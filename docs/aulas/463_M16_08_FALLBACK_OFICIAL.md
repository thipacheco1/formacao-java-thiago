# 463 - M16.08 - Fallback

## Apresentação da aula

Nas aulas anteriores, a integração entre o consumidor de ordens e o catálogo ganhou uma cadeia completa de resiliência.

O fluxo atual é:

```text
Bulkhead;

Circuit Breaker;

Retry;

Timeout;

HTTP client;

catalog-provider.
```

Timeout limita a espera; retry repete falhas transitórias dentro do orçamento; circuit breaker interrompe insistência persistente; bulkhead limita operações concorrentes.

Mesmo com esses controles, algumas operações terminarão sem resposta válida por circuito aberto, bulkhead cheio, timeout, indisponibilidade ou rate limit. A pergunta central será:

```text
quando a dependência
não pode responder,
existe uma alternativa segura
ou o sistema deve falhar?
```

A alternativa recebe o nome:

```text
fallback.
```

Fallback é um caminho alternativo após a falha principal, mas um fallback incorreto pode ser mais perigoso que o erro original.

Exemplo inseguro:

```java
catch (
    ProductCatalogException exception
) {
    return new ProductAvailabilitySnapshot(
            productCode,
            true,
            Integer.MAX_VALUE
    );
}
```

Esse código transforma indisponibilidade técnica em estoque ilimitado e pode aceitar uma ordem sem confirmação.

Outro exemplo inseguro:

```java
.onErrorReturn(
    availableSnapshot()
);
```

O pipeline deixa de falhar e passa a produzir um dado inventado.

Criaremos um fallback conservador, observável e limitado, não um mecanismo para “fazer tudo continuar”.

A operação continua sendo:

```http
GET /api/v1/products/{productCode}/availability
```

O caso de uso precisa decidir se uma quantidade pode ser utilizada para uma ordem.

O catálogo informa:

```text
produto disponível;

quantidade disponível.
```

A decisão de negócio adotará esta prioridade:

```text
evitar falso positivo
é mais importante
que evitar falso negativo.
```

Falso positivo:

```text
aprovar uma ordem
sem estoque confirmado.
```

Falso negativo:

```text
rejeitar temporariamente
uma ordem que talvez
pudesse ser atendida.
```

Para o laboratório, o falso positivo é mais perigoso.

Portanto, a política será:

1. resposta viva e validada pode aprovar ou rejeitar;
2. cache degradado pode sustentar apenas uma rejeição conservadora;
3. cache degradado positivo nunca aprova;
4. ausência de cache não produz defaults;
5. cache expirado não é utilizado;
6. falhas de autenticação e contrato não são escondidas;
7. a origem e a idade do dado permanecem explícitas.

Com um snapshot de 25 unidades, uma ordem de 30 pode ser rejeitada de forma conservadora, mesmo que o estoque tenha aumentado. A mesma entrada não aprova uma ordem de 2, pois o estoque pode ter caído; nesse caso, a disponibilidade fica não confirmada.

O fallback utilizará um cache local controlado.

A implementação usará Caffeine com `maximumSize`, `expireAfterWrite`, estatísticas e `Clock` ou `Ticker` testável. Embora o Spring Boot possa integrar Caffeine à abstração de cache, criaremos uma porta e um adapter explícitos para armazenar instante observado, instante armazenado, origem, versão externa e metadados mínimos.

Também precisamos diferenciar:

```text
retention do cache;

maxStale permitido
para fallback.
```

Configuração didática:

```text
maximumSize:
1.000 entradas;

retention:
5 minutos;

maxStale:
2 minutos.
```

A entrada pode permanecer cinco minutos, mas só é elegível durante dois. Assim distinguimos hit, stale rejeitado, eviction e rejeição de policy.

Os valores são didáticos e não devem ser copiados para produção sem analisar volatilidade do estoque, custos de falsos positivos e negativos, atualização, capacidade, consistência, réplicas, tenancy e privacidade.

A composição final será:

```text
Fallback Resolver;

Bulkhead;

Circuit Breaker;

Retry;

Timeout;

HTTP.
```

O fallback ficará fora de toda a cadeia. Dentro do retry, poderia impedir tentativas; dentro do circuit breaker, esconder a falha do provider; dentro do bulkhead, perder rejeições locais. Assim, a cadeia termina, seus controles registram o resultado e somente depois o cache é consultado.

A implementação criará:

```text
ProductAvailabilityResolver.
```

O service de ordens dependerá desse resolver.

A porta HTTP continuará sendo:

```text
ProductCatalogGateway
ou
ReactiveProductCatalogGateway.
```

O resolver executará a cadeia viva, armazenará snapshots validados, classificará falhas, consultará o store, verificará idade e produzirá resolução explícita.

Os resultados serão:

```text
LIVE_AVAILABLE;

LIVE_UNAVAILABLE;

CACHE_NEGATIVE;

UNCONFIRMED.
```

`CACHE_NEGATIVE` indica que o último dado já era insuficiente para a ordem; `UNCONFIRMED` indica ausência de evidência atual ou conservadora suficiente.

A exception pública será:

```text
ProductAvailabilityUnconfirmedException.
```

Response:

```text
503 Service Unavailable;

code:
product_availability_unconfirmed.
```

Quando o cache negativo sustentar a rejeição, o contrato de negócio continuará sendo:

```text
409 Conflict;

code:
product_unavailable_for_order;

degraded:
true;

observedAt:
instante do snapshot.
```

`observedAt` informa a idade do dado. O response não revelará exception original, estado do breaker, permits, token, URL, stack ou conteúdo do cache.

Métricas e testes provarão atualização por sucesso live, consulta somente em falhas elegíveis, proibição de aprovação positiva, rejeição negativa, expiração, cancelamento sem fallback, preservação do breaker, limite de memória e isolamento de contexto.

A próxima aula será `464 - M16.09 - Idempotencia em APIs`, mudando o foco de leitura degradada para proteção de operações de escrita contra duplicidade.

---

## Onde estamos na formação

A sequência oficial é:

```text
461:
Circuit breaker.

462:
Bulkhead e isolamento.

463:
Fallback.

464:
Idempotencia em APIs.

465:
Idempotency key.
```

A aula 461 respondeu:

```text
quando parar
de chamar temporariamente?
```

A aula 462 respondeu:

```text
quantas operações
podem atravessar ao mesmo tempo?
```

A aula 463 responderá:

```text
qual caminho alternativo
é seguro
quando a integração falha?
```

Nesta aula:

```text
fallback conservador:
sim.

cache local:
sim.

origem do dado:
sim.

idade do dado:
sim.

fallback positivo:
não.

fallback negativo:
sim.

RestClient:
sim.

WebClient:
sim.

métricas:
sim.

idempotency key:
próxima aula.
```

A regra central será:

```text
fallback só é válido
quando preserva
a semântica e a segurança
do caso de uso.
```

---

## Objetivo prático

Ao final da aula, os consumidores terão:

```text
ProductAvailabilityResolver;

ReactiveProductAvailabilityResolver;

ProductAvailabilityResolution;

ProductAvailabilityResolutionSource;

ProductAvailabilityResolutionOutcome;

ProductAvailabilityFallbackStore;

CachedProductAvailability;

CatalogFallbackProperties;

CatalogFallbackEligibilityPolicy;

CatalogFallbackDecisionPolicy;

ProductAvailabilityUnconfirmedException;

CatalogFallbackMetrics;

CatalogFallbackEventLogger.
```

Adapters:

```text
CaffeineProductAvailabilityFallbackStore;

LiveThenCachedProductAvailabilityResolver;

ReactiveLiveThenCachedProductAvailabilityResolver.
```

Testes:

```text
CatalogFallbackPropertiesTest;

CatalogFallbackEligibilityPolicyTest;

CatalogFallbackDecisionPolicyTest;

CaffeineFallbackStoreTest;

ImperativeFallbackResolverTest;

ReactiveFallbackResolverTest;

FallbackCompositionOrderTest;

FallbackPositiveDataSafetyTest;

FallbackExpirationTest;

FallbackTenantIsolationTest;

FallbackMetricsTest;

FallbackLoggingSecurityTest;

FallbackProblemDetailsTest;

NoFallbackOnPermanentFailureTest.
```

Documentação:

```text
docs/
├── FALLBACK_POLICY.md
├── FALLBACK_DECISION_TABLE.md
├── FALLBACK_CACHE_MODEL.md
├── FALLBACK_COMPOSITION_ORDER.md
└── FALLBACK_RUNBOOK.md
```

Você irá definir objetivo e riscos, classificar falhas, modelar origem e idade, criar cache bounded, store, properties e policies, implementar resolvers imperativo e reativo, integrar o caso de uso, criar Problem Details e métricas, testar expiração, isolamento e composição e preparar idempotência.

---

## Conceito essencial

### Fallback e controles vizinhos

Default ignora evidência; fallback usa uma fonte alternativa com origem, validade, idade, semântica, risco e observabilidade conhecidos. Retry repete o caminho principal; fallback começa somente após as tentativas permitidas. Circuit breaker decide se a chamada pode ocorrer; fallback decide o caminho alternativo e não fecha o breaker. Cache é apenas uma fonte possível, ao lado de réplica, arquivo aprovado, serviço secundário, regra conservadora ou fila. Nesta aula, usaremos cache local.

---

### Cache de fallback

O cache armazena somente respostas `200` já desserializadas, validadas e mapeadas.

Nunca armazene:

- body inválido;
- exception;
- access token;
- Problem Details remoto;
- stack;
- response parcial;
- default inventado.

---

### Cache bounded

O cache precisa de limite.

Configuração:

```text
maximumSize:
1000.
```

Sem limite, novos códigos cresceriam indefinidamente. Eviction protege memória e apenas remove uma opção de fallback.

---

### Retention e maxStale

Retention:

```text
quanto tempo
a entrada pode permanecer
na estrutura.
```

Max stale:

```text
idade máxima
que a policy aceita
para fallback.
```

Configuração:

```text
retention:
5 minutos;

maxStale:
2 minutos.
```

Uma entrada de três minutos pode existir no cache e ainda ser rejeitada. `observedAt` representa quando o provider informou o snapshot; `storedAt` sozinho subestima a idade, pois a response pode ter sido produzida antes de chegar ao consumer.

Se o contrato não fornecer timestamp confiável, use o instante local de validação e documente a limitação. O laboratório possui `updatedAt`, preservado internamente pelo mapper.

---

### Clock skew

Se `observedAt` estiver muito no futuro em relação ao clock local:

```text
contract error.
```

Não transforme idade negativa em zero silenciosamente.

Defina tolerância didática:

```text
5 segundos.
```

Acima disso, a response é inconsistente.

---

### Origem

```java
public enum ProductAvailabilityResolutionSource {
    LIVE,
    CACHE
}
```

A origem nunca é inferida pelo caller.

Ela faz parte da resolução.

---

### Outcome

```java
public enum ProductAvailabilityResolutionOutcome {
    AVAILABLE,
    UNAVAILABLE,
    UNCONFIRMED
}
```

A combinação permite `LIVE + AVAILABLE`, `LIVE + UNAVAILABLE` e `CACHE + UNAVAILABLE`; `CACHE + AVAILABLE` é proibida na validação de ordem.

---

### Resolution

```java
public record ProductAvailabilityResolution(
        ProductCode productCode,
        ProductAvailabilityResolutionOutcome outcome,
        ProductAvailabilityResolutionSource source,
        int observedQuantity,
        Instant observedAt,
        boolean degraded
) {
}
```

Para `UNCONFIRMED`, a quantity pode ser omitida em outro tipo ou representada com `OptionalInt`.

Evite valores mágicos como `-1`.

Uma modelagem mais rígida pode usar uma `sealed interface` com `LiveAvailable`, `LiveUnavailable`, `CachedUnavailable` e `AvailabilityUnconfirmed`, impedindo combinações inválidas. O critério permanece: `CACHE + AVAILABLE` não aprova a ordem.

---

### Falso positivo e falso negativo

A policy registra que falso positivo não é aceito e falso negativo pode ser tolerado temporariamente. Outros domínios podem decidir diferente: uma tela informativa pode exibir dado stale marcado, enquanto uma autorização financeira não deve herdar essa decisão.

---

### Falhas elegíveis

Baseline:

```text
ProductCatalogUnavailableException;

ProductCatalogTimeoutException;

ProductCatalogCircuitOpenException;

ProductCatalogBulkheadFullException;

ProductCatalogRateLimitedException.
```

A falha principal continua registrada em suas próprias métricas.

---

### Falhas não elegíveis

```text
ProductCatalogAuthenticationException;

ProductCatalogContractException;

ProductNotFoundException;

CatalogCredentialsUnavailableException;

InvalidProductCodeException;

InvalidOrderQuantityException.
```

Auth indica credencial ou configuração quebrada; contract indica deploy incompatível ou resposta inválida; not found é autoritativo; credentials locais são erro do consumidor. Esconder essas falhas prolongaria o defeito.

---

### Rate limit

A baseline permite consultar cache depois de um rate limit final.

Isso não significa ignorar o `Retry-After`.

A retry policy decide novas tentativas; somente a exception final chega ao fallback, que aplica a decisão conservadora sem apagar a métrica de rate limit.

---

### Dado negativo

O cache é negativo para uma ordem quando:

```text
available == false
```

ou:

```text
availableQuantity
<
requestedQuantity.
```

Esse conceito depende da quantidade solicitada.

Por isso, a policy recebe `productCode`, `requestedQuantity`, `cachedEntry` e `failure`.

---

### Dado positivo

Quando o cache indica quantidade suficiente:

```text
não aprovar.
```

A resolution será:

```text
UNCONFIRMED.
```

O cache positivo pode ajudar em uma tela de diagnóstico, mas não autoriza a ordem.

---

### Cache miss

Sem entrada, o resultado é `UNCONFIRMED`; nunca consulte outro código, valor global ou default.

---

### Cache expired

Se:

```text
age > maxStale
```

a entrada não é elegível.

A retention pode removê-la depois; a policy registra `fallback_stale_rejected`.

---

### Composição correta

```text
Resolver
    |
    +-- live chain
    |   Bulkhead
    |   Circuit Breaker
    |   Retry
    |   Timeout
    |   HTTP
    |
    +-- fallback store
```

Em sucesso, valida, armazena e retorna `LIVE`. Em falha, classifica, consulta cache, avalia idade e quantidade e retorna `CACHE_NEGATIVE` ou lança unconfirmed.

---

### Atualização do cache

O cache é atualizado somente depois do mapper do adapter produzir um snapshot válido.

A gravação ocorre somente após code match, required fields, quantity, timestamp e contract version.

Se a gravação falhar, a resposta live pode continuar conforme policy. O cache não é a fonte principal, e sua falha precisa de métrica.

---

### Cache e multi-tenancy

O catálogo atual é global.

A key é:

```text
ProductCode.
```

Se a disponibilidade variar por tenant, contrato ou região, a key precisa incluir esse contexto.

Exemplo:

```text
TenantId
+
ProductCode
+
WarehouseId.
```

Uma key incompleta causa vazamento e decisão incorreta; um policy test documentará o escopo global atual.

---

### Multi-instância

Cada réplica possui cache local.

As réplicas podem possuir entradas, idades, eviction, warm-up e decisões de fallback diferentes.

Isso é aceito no laboratório; produção pode exigir cache distribuído, invalidação por eventos ou fonte secundária. Cache local não oferece consistência global.

---

### Cache stampede

Na recuperação, muitas requests podem atualizar o cache simultaneamente. A aula não implementará single flight, request coalescing, refresh ahead ou lock distribuído.

O bulkhead já limita concorrência, mas não elimina duplicidade.

Esse gap será registrado.

---

### Reativo e onErrorResume

No fluxo reativo, fallback será aplicado com:

```java
.onErrorResume(
    fallbackEligibilityPolicy::isEligible,
    failure ->
        fallbackResolver.resolve(
            productCode,
            requestedQuantity,
            failure
        )
)
```

O predicate é obrigatório: não capture qualquer `Throwable`. Cancelamento não é error signal e não inicia fallback.

---

### Métricas

Métricas:

```text
catalog.fallback.live;

catalog.fallback.attempt;

catalog.fallback.hit;

catalog.fallback.miss;

catalog.fallback.stale_rejected;

catalog.fallback.positive_rejected;

catalog.fallback.ineligible;

catalog.fallback.store_failure.
```

Tags:

```text
client.type;

fallback.outcome;

failure.kind;

source.
```

Product code, correlation e timestamp não são tags.

---

### Log seguro

Eventos:

```text
catalog_fallback_used;

catalog_fallback_rejected;

catalog_fallback_cache_miss;

catalog_fallback_ineligible.
```

Campos:

```text
outcome;

failure_kind;

data_age_bucket;

correlation_id.
```

Não logue o snapshot.

---

## Mão na massa guiada

### 1. Criar FALLBACK_POLICY.md

Registre:

```text
objetivo:
degradação conservadora.

aprovação por cache:
proibida.

rejeição por cache:
permitida até maxStale.

cache miss:
unconfirmed.

falha permanente:
sem fallback.
```

---

### 2. Adicionar Caffeine

Adicione a dependência aprovada e gerenciada:

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

Não fixe versão fora do dependency management já adotado.

---

### 3. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.catalog.fallback"
)
public record CatalogFallbackProperties(
        boolean enabled,
        long maximumSize,
        Duration retention,
        Duration maxStale,
        Duration futureTimestampTolerance
) {
    public CatalogFallbackProperties {
        if (
            maximumSize < 1
            || maximumSize > 100_000
        ) {
            throw new IllegalArgumentException(
                "maximumSize is invalid"
            );
        }

        requirePositive(
            retention
        );

        requirePositive(
            maxStale
        );

        if (
            maxStale.compareTo(
                retention
            ) > 0
        ) {
            throw new IllegalArgumentException(
                "maxStale cannot exceed retention"
            );
        }
    }
}
```

---

### 4. Configurar local profile

```yaml
integrations:
  catalog:
    fallback:
      enabled: true
      maximum-size: 1000
      retention: 5m
      max-stale: 2m
      future-timestamp-tolerance: 5s
```

---

### 5. Criar cached entry

```java
public record CachedProductAvailability(
        ProductAvailabilitySnapshot snapshot,
        Instant observedAt,
        Instant storedAt,
        long providerVersion
) {
    public CachedProductAvailability {
        Objects.requireNonNull(
                snapshot
        );

        Objects.requireNonNull(
                observedAt
        );

        Objects.requireNonNull(
                storedAt
        );
    }
}
```

---

### 6. Criar store port

```java
public interface ProductAvailabilityFallbackStore {

    void put(
            ProductCode productCode,
            CachedProductAvailability entry
    );

    Optional<CachedProductAvailability> find(
            ProductCode productCode
    );

    void invalidate(
            ProductCode productCode
    );
}
```

---

### 7. Criar Caffeine adapter

```java
@Component
public class CaffeineProductAvailabilityFallbackStore
        implements ProductAvailabilityFallbackStore {

    private final Cache<ProductCode, CachedProductAvailability>
            cache;

    public CaffeineProductAvailabilityFallbackStore(
            CatalogFallbackProperties properties,
            Ticker ticker
    ) {
        this.cache =
                Caffeine
                    .newBuilder()
                    .maximumSize(
                        properties.maximumSize()
                    )
                    .expireAfterWrite(
                        properties.retention()
                    )
                    .ticker(
                        ticker
                    )
                    .recordStats()
                    .build();
    }

    @Override
    public void put(
            ProductCode productCode,
            CachedProductAvailability entry
    ) {
        cache.put(
            productCode,
            entry
        );
    }

    @Override
    public Optional<CachedProductAvailability> find(
            ProductCode productCode
    ) {
        return Optional.ofNullable(
                cache.getIfPresent(
                    productCode
                )
        );
    }
}
```

---

### 8. Injetar Clock e Ticker

Produção:

```java
@Bean
Clock applicationClock() {
    return Clock.systemUTC();
}

@Bean
Ticker caffeineTicker() {
    return Ticker.systemTicker();
}
```

Testes usam clock e ticker controlados.

---

### 9. Criar eligibility policy

```java
@Component
public class CatalogFallbackEligibilityPolicy {

    public boolean isEligible(
            Throwable failure
    ) {
        return failure
                instanceof ProductCatalogUnavailableException
            || failure
                instanceof ProductCatalogTimeoutException
            || failure
                instanceof ProductCatalogCircuitOpenException
            || failure
                instanceof ProductCatalogBulkheadFullException
            || failure
                instanceof ProductCatalogRateLimitedException;
    }
}
```

A cause chain pode ser considerada quando decorators encapsulam a exception.

Não use mensagens.

---

### 10. Criar decision policy

```java
@Component
public class CatalogFallbackDecisionPolicy {

    public ProductAvailabilityResolution decide(
            ProductCode productCode,
            int requestedQuantity,
            CachedProductAvailability cached,
            Instant now
    ) {
        Duration age =
                Duration.between(
                    cached.observedAt(),
                    now
                );

        if (age.isNegative()) {
            throw new ProductCatalogContractException(
                    "Cached observation is in the future"
            );
        }

        if (
            age.compareTo(
                properties.maxStale()
            ) > 0
        ) {
            throw new ProductAvailabilityUnconfirmedException();
        }

        ProductAvailabilitySnapshot snapshot =
                cached.snapshot();

        boolean insufficient =
                !snapshot.available()
                || snapshot.availableQuantity()
                   < requestedQuantity;

        if (insufficient) {
            return ProductAvailabilityResolution
                    .cachedUnavailable(
                        productCode,
                        snapshot.availableQuantity(),
                        cached.observedAt()
                    );
        }

        throw new ProductAvailabilityUnconfirmedException();
    }
}
```

A implementação completa distingue stale, positive e cache miss para métricas.

---

### 11. Criar resolution types

Use sealed hierarchy:

```java
public sealed interface ProductAvailabilityResolution
        permits LiveAvailable,
                LiveUnavailable,
                CachedUnavailable {
}
```

`UNCONFIRMED` permanece exception porque o caso de uso não possui uma decisão utilizável.

Isso evita `Optional` ambíguo.

---

### 12. Criar resolver imperativo

```java
@Component
public class LiveThenCachedProductAvailabilityResolver
        implements ProductAvailabilityResolver {

    private final ProductCatalogGateway liveGateway;
    private final ProductAvailabilityFallbackStore store;
    private final CatalogFallbackEligibilityPolicy eligibility;
    private final CatalogFallbackDecisionPolicy decisionPolicy;
    private final Clock clock;

    @Override
    public ProductAvailabilityResolution resolve(
            ProductCode productCode,
            int requestedQuantity
    ) {
        try {
            ProductAvailabilitySnapshot live =
                    liveGateway
                        .findAvailability(
                            productCode
                        );

            storeValidated(
                productCode,
                live
            );

            return resolveLive(
                    live,
                    requestedQuantity
            );
        }
        catch (
            ProductCatalogException failure
        ) {
            if (
                !eligibility.isEligible(
                    failure
                )
            ) {
                throw failure;
            }

            CachedProductAvailability cached =
                    store
                        .find(
                            productCode
                        )
                        .orElseThrow(
                            ProductAvailabilityUnconfirmedException::new
                        );

            return decisionPolicy.decide(
                    productCode,
                    requestedQuantity,
                    cached,
                    clock.instant()
            );
        }
    }
}
```

---

### 13. Gravar somente live validado

O gateway já mapeou o contrato.

O resolver cria:

```java
new CachedProductAvailability(
    snapshot,
    snapshot.observedAt(),
    clock.instant(),
    snapshot.providerVersion()
);
```

Se o modelo da aula 457 não preservava `observedAt` e `version`, amplie apenas a fronteira de integração ou crie um modelo específico, sem expor esses campos ao domínio desnecessariamente.

---

### 14. Criar resolver reativo

```java
@Component
public class ReactiveLiveThenCachedProductAvailabilityResolver
        implements ReactiveProductAvailabilityResolver {

    @Override
    public Mono<ProductAvailabilityResolution> resolve(
            ProductCode productCode,
            int requestedQuantity
    ) {
        return Mono.defer(
                    () ->
                        liveGateway
                            .findAvailability(
                                productCode
                            )
                )
                .flatMap(
                    live ->
                        storeReactiveOrLocal(
                            productCode,
                            live
                        )
                        .thenReturn(
                            resolveLive(
                                live,
                                requestedQuantity
                            )
                        )
                )
                .onErrorResume(
                    eligibility::isEligible,
                    failure ->
                        resolveCached(
                            productCode,
                            requestedQuantity,
                            failure
                        )
                );
    }
}
```

Com Caffeine local, `find` é rápido; não use `boundedElastic` sem necessidade.

---

### 15. Não capturar cancelamento

Cancelamento não entra em `onErrorResume`.

Crie test com `Mono.never()` e cancel.

Esperado:

```text
fallback attempts:
0.
```

---

### 16. Atualizar service imperativo

Antes:

```text
ProductCatalogGateway.
```

Depois:

```text
ProductAvailabilityResolver.
```

O service recebe a resolution.

Live disponível:

```text
prossegue.
```

Live indisponível:

```text
409.
```

Cache negativo:

```text
409 degradado.
```

Unconfirmed:

```text
503.
```

---

### 17. Atualizar service reativo

Use:

```java
return resolver
        .resolve(
            code,
            quantity
        )
        .flatMap(
            this::applyResolution
        );
```

Não transforme `UNCONFIRMED` em `Mono.empty()`.

---

### 18. Criar response metadata

Para rejeição degradada:

```json
{
  "type": "urn:problem:order:product-unavailable",
  "title": "Product unavailable",
  "status": 409,
  "detail": "The requested quantity is not available.",
  "code": "product_unavailable_for_order",
  "degraded": true,
  "dataSource": "CACHE",
  "observedAt": "2026-07-12T03:00:00Z",
  "correlationId": "corr-463-001"
}
```

Não inclua `failureKind` no contrato público.

---

### 19. Criar unconfirmed problem

```json
{
  "type": "urn:problem:integration:availability-unconfirmed",
  "title": "Product availability unconfirmed",
  "status": 503,
  "detail": "Product availability could not be confirmed.",
  "code": "product_availability_unconfirmed",
  "correlationId": "corr-463-002"
}
```

---

### 20. Testar live available

Provider retorna quantidade suficiente.

Esperado:

```text
LIVE;

ordem validada;

cache atualizado;

fallback attempt:
0.
```

---

### 21. Testar live unavailable

Provider retorna quantidade insuficiente.

Esperado:

```text
LIVE_UNAVAILABLE;

409;

cache atualizado;

degraded false.
```

---

### 22. Testar timeout com cache negativo

Cache:

```text
quantity 1;

requested 2;

age 30s.
```

Live:

```text
timeout.
```

Esperado:

```text
CACHE_NEGATIVE;

409;

degraded true;

observedAt presente.
```

---

### 23. Testar circuit open com cache negativo

Esperado:

```text
sem HTTP;

cache consultado;

409 degradado.
```

O breaker permanece `OPEN`.

---

### 24. Testar bulkhead full

Com bulkhead saturado e cache negativo:

```text
fallback utilizado.
```

Bulkhead rejection continua em métrica própria.

---

### 25. Testar rate limit

Após a policy de retry encerrar:

```text
cache negativo pode rejeitar.
```

O `Retry-After` não é exposto como promessa do fallback.

---

### 26. Testar cache positivo

Cache:

```text
quantity 25;

requested 2.
```

Live falha.

Esperado:

```text
ProductAvailabilityUnconfirmedException;

503;

nenhuma aprovação.
```

Esse é o teste mais importante da aula.

---

### 27. Testar cache miss

Esperado:

```text
503 unconfirmed.
```

Nenhum default é criado.

---

### 28. Testar cache stale

Age:

```text
2m01s.
```

Max stale:

```text
2m.
```

Esperado:

```text
503;

fallback_stale_rejected.
```

---

### 29. Testar limite inclusivo

Age exatamente igual a `maxStale`.

Defina a policy:

```text
aceita.
```

Documente e teste.

---

### 30. Testar retention

Avance o ticker além de cinco minutos.

Esperado:

```text
cache miss.
```

---

### 31. Testar maximum size

Insira mais que mil entries.

Confirme:

```text
estimated size
não cresce sem limite;

eviction ocorre.
```

Não dependa de uma key específica ser removida.

---

### 32. Testar timestamp futuro

Dentro da tolerância:

```text
normalizar ou aceitar
conforme policy.
```

Acima de cinco segundos:

```text
contract inconsistency;

sem fallback.
```

A baseline rejeita.

---

### 33. Testar auth failure

Com cache presente:

```text
401/403 de integração;

cache não consultado;

exception original preservada.
```

---

### 34. Testar contract failure

Com cache presente:

```text
JSON incompatível;

cache não consultado.
```

Isso evita esconder deploy quebrado.

---

### 35. Testar not found

`404` live:

```text
ProductNotFoundException;

sem fallback.
```

A resposta autoritativa prevalece.

---

### 36. Testar credentials ausentes

Sem token local:

```text
sem fallback.
```

Corrija a configuração.

---

### 37. Testar store failure

Simule cache lançando exception.

Policy:

```text
não esconder falha principal
com exception do cache.
```

Registre `store_failure`.

Retorne:

```text
ProductAvailabilityUnconfirmedException
ou falha original
conforme contrato documentado.
```

A baseline usa unconfirmed.

---

### 38. Testar composição

Valide ordem:

```text
Fallback
-> Bulkhead
-> CircuitBreaker
-> Retry
-> Timeout
-> HTTP.
```

Confirme:

- retry ocorre antes do cache;
- breaker registra failure;
- bulkhead registra rejection;
- fallback não altera states;
- cached result não conta como live success.

---

### 39. Testar reativo com StepVerifier

Cenários:

- live;
- cached negative;
- cached positive;
- miss;
- stale;
- ineligible;
- cancelamento.

Use clock e ticker controlados.

---

### 40. Testar isolamento de key

O catálogo atual é global.

Crie policy test:

```text
key = ProductCode
somente enquanto
o contrato for global.
```

Se `tenantId` aparecer no contrato, o teste exige key composta.

---

### 41. Criar metrics

Registre:

```text
live_success;

fallback_attempt;

fallback_hit_negative;

fallback_miss;

fallback_stale;

fallback_positive_rejected;

fallback_ineligible;

store_failure.
```

Use buckets de idade fechados:

```text
lt_30s;

30s_60s;

60s_120s;

gt_120s.
```

---

### 42. Criar log sentinel test

Sentinelas:

```text
token-fallback-sentinel;

snapshot-fallback-sentinel;

product-fallback-sentinel;

remote-error-fallback-sentinel.
```

Nenhuma aparece.

---

### 43. Criar cache model document

Arquivo:

```text
docs/FALLBACK_CACHE_MODEL.md
```

Inclua:

- key;
- value;
- maximum size;
- retention;
- max stale;
- eviction;
- multi-instance;
- invalidation;
- privacy;
- gaps.

---

### 44. Criar decision table

Arquivo:

```text
docs/FALLBACK_DECISION_TABLE.md
```

| Live failure | Cache | Decision |
|---|---|---|
| timeout | negative fresh | reject degraded |
| unavailable | positive fresh | unconfirmed |
| circuit open | miss | unconfirmed |
| bulkhead full | stale | unconfirmed |
| rate limited | negative fresh | reject degraded |
| auth | any | propagate |
| contract | any | propagate |
| not found | any | propagate |

---

### 45. Criar composition document

Arquivo:

```text
docs/FALLBACK_COMPOSITION_ORDER.md
```

Explique por que o fallback é externo.

Registre a ordem alternativa rejeitada.

---

### 46. Criar runbook

Arquivo:

```text
docs/FALLBACK_RUNBOOK.md
```

Perguntas:

- qual failure kind;
- fallback foi tentado;
- houve hit;
- qual idade;
- era positivo ou negativo;
- max stale mudou;
- cache está aquecido;
- eviction aumentou;
- provider está recuperando;
- breaker está aberto;
- bulkhead está cheio;
- taxa de unconfirmed aumentou;
- alguma ordem foi aprovada por cache;
- key contém todos os contextos;
- quantas réplicas possuem caches divergentes.

A resposta para:

```text
alguma ordem foi aprovada
por cache?
```

deve ser:

```text
não.
```

---

### 47. Executar testes imperativos

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=CatalogFallbackPropertiesTest,CatalogFallbackEligibilityPolicyTest,CatalogFallbackDecisionPolicyTest,CaffeineFallbackStoreTest,ImperativeFallbackResolverTest,FallbackCompositionOrderTest,FallbackPositiveDataSafetyTest,FallbackExpirationTest,FallbackTenantIsolationTest,FallbackMetricsTest,FallbackLoggingSecurityTest,FallbackProblemDetailsTest,NoFallbackOnPermanentFailureTest `
  test
```

---

### 48. Executar testes reativos

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=CatalogFallbackPropertiesTest,CatalogFallbackEligibilityPolicyTest,CatalogFallbackDecisionPolicyTest,CaffeineFallbackStoreTest,ReactiveFallbackResolverTest,FallbackCompositionOrderTest,FallbackPositiveDataSafetyTest,FallbackExpirationTest,FallbackTenantIsolationTest,FallbackMetricsTest,FallbackLoggingSecurityTest,FallbackProblemDetailsTest,NoFallbackOnPermanentFailureTest `
  test
```

---

### 49. Executar fluxo local

1. execute provider;
2. consulte produto com quantidade insuficiente;
3. confirme cache;
4. desligue provider;
5. repita a ordem;
6. confirme `409` degradado;
7. use quantidade pequena;
8. confirme `503 unconfirmed`.

---

### 50. Executar gates

Nos dois consumers:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- nenhum cache positive approval;
- fallback somente em falhas elegíveis;
- bounded cache;
- age;
- composition;
- metrics;
- logs;
- no secrets;
- no idempotency antecipada.

---

### 51. Registrar limitações

Ainda faltam:

```text
cache distribuído;

invalidação por evento;

single flight;

refresh ahead;

consistência multi-instância;

tuning produtivo;

fallback para outros domínios;

idempotência em writes;

load test.
```

---

## Entendendo o que foi feito

### Fallback ganhou semântica

Ele deixou de ser um valor default e passou a ser uma decisão explícita.

### Cache positivo não virou autorização

O sistema não aprova ordem com dado antigo.

### Cache negativo permitiu degradação conservadora

A ordem pode ser rejeitada sem criar falso positivo.

### Origem e idade ficaram visíveis

O caller consegue distinguir live e cache degradado.

### Falhas permanentes permaneceram visíveis

Auth, contrato e not found não foram escondidos.

### Cache foi limitado

Maximum size, retention e max stale foram separados.

### O caminho principal continuou observável

Retry, breaker e bulkhead registram o fracasso antes do fallback.

### Reatividade permaneceu correta

`onErrorResume` utiliza predicate e não captura cancelamento.

### A próxima aula ganhou contexto

Fallback foi aplicado somente à leitura; escrita exigirá idempotência.

---

## Erros comuns importantes

### Retornar available true no erro

Cria falso positivo.

### Usar cache sem idade

Dado antigo parece atual.

### Usar storedAt como observedAt

A idade real pode ser subestimada.

### Aplicar fallback em qualquer exception

Auth e contrato ficam escondidos.

### Aprovar com cache positivo

Estoque pode ter mudado.

### Usar cache sem maximum size

Memória cresce com novas keys.

### Colocar fallback dentro do retry

A primeira falha impede novas tentativas.

### Colocar fallback dentro do breaker

O sucesso degradado mascara o provider doente.

### Usar key incompleta

Dados de contextos diferentes se misturam.

### Tratar cache local como consistente entre réplicas

Cada instância possui seu estado.

---

## Comandos úteis

### Testes de policy

```powershell
.\mvnw.cmd `
  -Dtest=CatalogFallbackPropertiesTest,CatalogFallbackEligibilityPolicyTest,CatalogFallbackDecisionPolicyTest `
  test
```

### Store e expiração

```powershell
.\mvnw.cmd `
  -Dtest=CaffeineFallbackStoreTest,FallbackExpirationTest,FallbackTenantIsolationTest `
  test
```

### Resolver e segurança

```powershell
.\mvnw.cmd `
  -Dtest=ImperativeFallbackResolverTest,FallbackPositiveDataSafetyTest,FallbackCompositionOrderTest,NoFallbackOnPermanentFailureTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar defaults inseguros

```powershell
git grep `
  -n `
  -E `
  "onErrorReturn|available\\(true\\)|Integer\\.MAX_VALUE|orElse\\(.*available|catch \\(Throwable|fallback"
```

---

## Exercício guiado

### Parte 1 — Risco

Defina falso positivo e falso negativo.

### Parte 2 — Policy

Liste falhas elegíveis e permanentes.

### Parte 3 — Cache

Configure size, retention e max stale.

### Parte 4 — Modelagem

Crie source, outcome e resolution.

### Parte 5 — Imperativo

Implemente live then cache.

### Parte 6 — Reativo

Use `onErrorResume` filtrado.

### Parte 7 — Segurança

Proíba aprovação com cache positivo.

### Parte 8 — Observabilidade

Crie metrics, logs e metadata.

### Parte 9 — Testes

Valide idade, miss, cancelamento e composição.

### Parte 10 — Gate

Comprove que escrita ainda não foi repetida.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 462 foi preservada;
- fallback foi diferenciado de default;
- fallback foi diferenciado de retry;
- fallback foi diferenciado de circuit breaker;
- cache foi tratado como fonte alternativa;
- risco de falso positivo foi priorizado;
- falso negativo foi aceito conscientemente;
- cache positivo não aprova ordem;
- cache negativo pode rejeitar ordem;
- cache miss produz unconfirmed;
- cache stale produz unconfirmed;
- falhas elegíveis foram definidas;
- auth não recebe fallback;
- contract error não recebe fallback;
- not found não recebe fallback;
- credentials ausentes não recebem fallback;
- rate limit pode consultar fallback após policy;
- Caffeine foi configurado;
- maximum size foi configurado;
- retention foi configurada;
- max stale foi configurado;
- max stale não excede retention;
- Clock e Ticker são testáveis;
- cached entry possui observedAt;
- timestamp futuro é validado;
- store port foi criado;
- implementation fica na infraestrutura;
- resolution source foi modelada;
- outcome foi modelado;
- combinações inválidas foram impedidas;
- resolver imperativo foi criado;
- resolver reativo foi criado;
- `onErrorResume` usa predicate;
- cancelamento não inicia fallback;
- live success atualiza cache;
- cache failure não produz dado inventado;
- fallback é externo ao bulkhead;
- fallback é externo ao circuit breaker;
- fallback é externo ao retry;
- breaker continua registrando falha;
- bulkhead continua registrando rejeição;
- retry conclui antes do fallback;
- rejection degradada retorna `409`;
- unconfirmed retorna `503`;
- origem e observedAt são expostos de forma controlada;
- exception original não vaza;
- key scope foi documentado;
- multi-instância foi documentada;
- cache stampede foi registrado como gap;
- metrics de fallback foram criadas;
- tags são de baixa cardinalidade;
- logs não contêm token ou snapshot;
- decision table foi criada;
- runbook foi criado;
- idempotência não foi antecipada;
- produção pública permaneceu NO-GO;
- gates dos dois consumidores foram executados;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat

git grep `
  -n `
  -E `
  "onErrorReturn|available\\(true\\)|Integer\\.MAX_VALUE|catch \\(Throwable|fallback|Cache<"
```

Revise cada ocorrência.

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer-reactive `
  labs/m16/aula-456-integracoes-http-entre-sistemas/docs `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m16): aplicar fallback conservador de disponibilidade"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- secret;
- `.env`;
- snapshot real;
- cache dump;
- fallback positivo;
- default de disponibilidade;
- cache sem limite;
- idempotency key antecipada;
- log de body;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a cadeia de resiliência passou a possuir um caminho alternativo controlado.

A ordem ficou:

```text
Fallback Resolver;

Bulkhead;

Circuit Breaker;

Retry;

Timeout;

HTTP.
```

Quando o catálogo responde:

```text
o snapshot é validado;

o cache é atualizado;

a decisão usa dado LIVE.
```

Quando a cadeia principal falha:

```text
a failure é classificada;

o cache é consultado;

a idade é validada;

a quantidade é comparada;

a policy decide.
```

A principal decisão foi:

```text
cache degradado
pode sustentar rejeição,
mas nunca aprovação
de uma ordem.
```

Isso preserva a prioridade do domínio:

```text
evitar falso positivo.
```

Também ficou comprovado que fallback não esconde auth ou contract, não substitui retry, não fecha o circuit breaker, não amplia o bulkhead e não inventa dados. A implementação registra origem, idade, outcome, hit, miss, stale, positive rejected e failure kind.

O cache local ficou bounded e testável, com limitações de multi-instância e invalidação registradas. Como o laboratório ainda usa um `GET`, retry e fallback não duplicaram escrita.

A próxima aula será:

```text
464 - M16.09 - Idempotencia em APIs
```

Ela tratará duplicidade em writes, diferença entre método e operação idempotente, criação de reserva, chave de idempotência, request hash, response persistida, concorrência, reutilização com payload diferente e retry seguro.

---

# Material complementar

## Checkpoint final

- [ ] Defini risco e semântica do fallback.
- [ ] Criei cache bounded com idade explícita.
- [ ] Proibi aprovação por cache positivo.
- [ ] Testei composição e falhas permanentes.
- [ ] Preparei a transição para idempotência.

---

## Troubleshooting adicional

### O cache nunca recebe entries

Confirme se a gravação ocorre após o mapper e se o resolver usado é o bean final.

### Cache positivo aprovou uma ordem

Interrompa a entrega e corrija a decision policy.

### Auth failure usa cache

A eligibility policy está ampla demais.

### Contract failure desaparece

O `onErrorResume` pode estar capturando qualquer exception.

### Dado stale continua sendo usado

Confirme Clock, maxStale e comparação inclusiva.

### Entry some antes de maxStale

Retention foi configurada menor que maxStale.

### Cache cresce demais

Confirme maximum size e stats de eviction.

### Breaker não registra failure

O fallback pode estar dentro do circuit breaker.

### Cancelamento usa cache

Existe conversão indevida de cancel para error.

### Réplicas retornam decisões diferentes

O cache é local; avalie invalidação ou cache distribuído.

---

## Perguntas de revisão

1. O que é fallback?
2. Fallback é default?
3. Fallback é retry?
4. Fallback é circuit breaker?
5. Qual fonte usamos?
6. O que é falso positivo?
7. O que é falso negativo?
8. Qual risco priorizamos?
9. Cache positivo aprova ordem?
10. Cache negativo pode fazer o quê?
11. O que é maxStale?
12. Retention e maxStale são iguais?
13. Auth recebe fallback?
14. Contract recebe fallback?
15. 404 recebe fallback?
16. Onde o fallback fica na cadeia?
17. Cancelamento reativo usa fallback?
18. Cache local é global entre réplicas?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Caminho alternativo controlado.
2. Não.
3. Não.
4. Não.
5. Cache local bounded.
6. Aprovar sem disponibilidade real.
7. Rejeitar algo que talvez estivesse disponível.
8. Evitar falso positivo.
9. Não.
10. Rejeitar conservadoramente.
11. Idade máxima aceita.
12. Não.
13. Não.
14. Não.
15. Não.
16. Fora de toda a cadeia principal.
17. Não.
18. Não.
19. Idempotencia em APIs.
20. Evitar duplicidade em writes.

---

## Desafio opcional

Crie um endpoint somente de consulta:

```text
GET /api/v1/product-availability/{code}
```

Ele pode retornar snapshot stale positivo, desde que inclua:

```text
degraded=true;

dataSource=CACHE;

observedAt;

ageSeconds.
```

A resposta não pode ser usada para autorizar criação de ordem.

Documente essa restrição e crie contract test.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 463 - M16.08 - Fallback

- Implementei fallback conservador para disponibilidade.
- Diferenciei fallback, default, retry e circuit breaker.
- Defini falso positivo e falso negativo.
- Priorizei evitar falso positivo.
- Proibi aprovação de ordem por cache positivo.
- Permiti rejeição conservadora por cache negativo.
- Criei `CatalogFallbackProperties`.
- Configurei maximum size, retention e max stale, mantendo max stale menor que retention.
- Adicionei Caffeine como cache bounded.
- Criei Clock e Ticker testáveis.
- Criei `CachedProductAvailability`, preservei `observedAt` e implementei `ProductAvailabilityFallbackStore` com Caffeine.
- Criei `CatalogFallbackEligibilityPolicy`, permitindo falhas transitórias e bloqueando auth, contract, not found e credentials.
- Criei `CatalogFallbackDecisionPolicy`.
- Modelei source e outcome.
- Impedi combinações inválidas.
- Criei `ProductAvailabilityUnconfirmedException`.
- Criei resolver imperativo.
- Criei resolver reativo.
- Usei `onErrorResume` filtrado.
- Impedi fallback em cancelamento.
- Atualizei cache somente com response live validada.
- Coloquei fallback fora de bulkhead, circuit breaker, retry e timeout.
- Mantive métricas do caminho principal.
- Mapeei cache negativo para `409` degradado.
- Mapeei disponibilidade não confirmada para `503`.
- Exponho origem e observedAt de forma controlada.
- Testei live, timeout, circuit open, bulkhead full, rate limit, cache positivo, miss e stale.
- Testei limite inclusivo de max stale.
- Testei retention e eviction.
- Testei timestamp futuro.
- Testei falhas permanentes sem fallback.
- Testei cache failure.
- Testei composição.
- Testei isolamento da key.
- Criei métricas e logs seguros.
- Criei policy, decision table, cache model, composition order e runbook de fallback.
- Registrei gaps de cache distribuído, invalidação e stampede.
- Não antecipei idempotência.
- Mantive produção pública como NO-GO.
- Próxima aula: Idempotencia em APIs.
```

---

## Referência técnica curta

- [Project Reactor — Error handling and fallback](https://projectreactor.io/docs/core/release/reference/coreFeatures/error-handling.html)
- [Spring Boot — Caching with Caffeine](https://docs.spring.io/spring-boot/reference/io/caching.html)
- [Caffeine — Cache](https://github.com/ben-manes/caffeine/wiki/Cache)
- [Caffeine — Eviction](https://github.com/ben-manes/caffeine/wiki/Eviction)
- [RFC 5861 — stale-if-error](https://www.rfc-editor.org/info/rfc5861/)
- [Microsoft Azure Architecture Center — Cache-Aside](https://learn.microsoft.com/azure/architecture/patterns/cache-aside)
- [Microsoft Azure Architecture Center — Circuit Breaker](https://learn.microsoft.com/azure/architecture/patterns/circuit-breaker)

Regra final:

```text
fallback deve ser uma alternativa explícita e conservadora, não um sucesso inventado: a cadeia principal executa timeout, retry, circuit breaker e bulkhead antes do fallback, somente respostas live validadas alimentam um cache bounded, cada entry preserva origem e observedAt, retention e maxStale são políticas diferentes, falhas transitórias e de capacidade podem consultar o cache, falhas de autenticação, contrato e not found permanecem visíveis, dado antigo negativo pode sustentar uma rejeição degradada, dado antigo positivo nunca aprova uma ordem, métricas registram hit, miss, stale e positive rejected e a transição para writes exige idempotência antes de qualquer retry seguro.
```
