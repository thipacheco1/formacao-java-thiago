# 462 - M16.07 - Bulkhead e isolamento

## Apresentação da aula

Na aula 461, as integrações do catálogo receberam um circuit breaker.

O fluxo passou a ser:

```text
Circuit Breaker;

Retry;

Timeout;

HTTP client;

catalog-provider.
```

O breaker mede operações lógicas e pode assumir:

```text
CLOSED;

OPEN;

HALF_OPEN.
```

Quando o catálogo falha de forma persistente:

```text
CLOSED -> OPEN.
```

Enquanto está aberto:

- novas chamadas falham rapidamente;
- o provider não é chamado;
- retry não inicia;
- a aplicação responde com `503`;
- métricas registram chamadas não permitidas.

Esse controle reduz a insistência em uma dependência doente.

Entretanto, existe um intervalo importante antes de o breaker abrir.

Imagine cem requests chegando ao mesmo tempo.

O circuit breaker ainda pode estar `CLOSED`.

Todas podem iniciar:

- token provider;
- retry;
- conexão HTTP;
- espera por resposta;
- leitura de body;
- mapeamento;
- backoff.

Mesmo que o breaker abra alguns instantes depois, recursos já podem estar ocupados.

O problema não é apenas a taxa histórica de falhas.

O problema é:

```text
quantas operações concorrentes
podem consumir recursos
ao mesmo tempo?
```

A pergunta central desta aula será:

```text
como limitar concorrência
e isolar recursos
para que uma integração lenta
não esgote toda a capacidade
do consumidor?
```

A resposta será o padrão:

```text
bulkhead.
```

O nome vem das divisórias de um navio: a falha de um compartimento não deve comprometer toda a embarcação. Em software:

```text
falha ou saturação
de uma dependência
não deve consumir
todos os recursos
da aplicação.
```

Nesta aula, aplicaremos isolamento à integração:

```http
GET /api/v1/products/{productCode}/availability
```

Os dois consumidores continuarão existindo:

```text
order-consumer:
RestClient e fluxo imperativo.

order-consumer-reactive:
WebClient e fluxo reativo.
```

A baseline usará:

```text
SemaphoreBulkhead.
```

O bulkhead baseado em semáforo limita quantas execuções podem atravessar ao mesmo tempo.

Ele não cria uma nova thread pool.

No consumidor imperativo, a thread tenta adquirir permissão, executa a cadeia quando aceita, falha rapidamente quando rejeitada e libera o permit ao final.

No consumidor reativo, a subscription adquire o permit, prossegue quando aceita, recebe `BulkheadFullException` quando rejeitada e libera a capacidade em sucesso, erro ou cancelamento.

Também estudaremos:

```text
ThreadPoolBulkhead.
```

Essa implementação usa pool dedicado, workers fixos, fila limitada e execução assíncrona. Ela pode isolar uma operação bloqueante legada, mas não será a baseline do `WebClient`.

Colocar uma cadeia não bloqueante em uma thread pool dedicada pode desperdiçar o modelo reativo e adicionar filas desnecessárias.

A configuração didática do semáforo será:

```text
maxConcurrentCalls:
4;

maxWaitDuration:
0 ms.
```

Isso permite quatro operações lógicas simultâneas; a quinta falha imediatamente, sem fila escondida, produzindo resposta previsível.

A exception estável será:

```text
ProductCatalogBulkheadFullException.
```

A response pública será:

```text
503 Service Unavailable;

code:
product_catalog_capacity_exhausted.
```

O consumidor não informará permits, fila, thread, stack, URL ou token.

A ordem escolhida será:

```text
Bulkhead
    |
    v
Circuit Breaker
    |
    v
Retry
    |
    v
Timeout
    |
    v
HTTP client
```

Consequências:

1. o bulkhead limita operações lógicas completas;
2. uma permissão é mantida durante retry e backoff;
3. o circuit breaker aberto ainda exige que a chamada atravesse o bulkhead antes de falhar;
4. a capacidade local permanece limitada;
5. tentativas internas não adquirem permissões adicionais.

Essa ordem é conservadora: uma operação lenta ou em backoff mantém seu permit, reduzindo throughput para limitar o total de jornadas ativas.

Também documentaremos uma alternativa:

```text
Circuit Breaker
    |
    v
Bulkhead
    |
    v
Retry
    |
    v
HTTP.
```

Nessa alternativa, circuito aberto falharia antes de adquirir permit.

Ela reduz uso de bulkhead durante `OPEN`.

Porém, a baseline manterá o bulkhead na borda externa para representar um limite estável da capacidade da integração como um todo.

A ordem precisa ser deliberada, documentada e testada.

A aula não implementará fallback; isso ficará para:

```text
463 - M16.08 - Fallback.
```

Também não criaremos filas ilimitadas, pois elas apenas adiam a falha e acumulam latência.

Ao final, você deverá conseguir explicar:

```text
por que circuit breaker
não limita concorrência;

por que bulkhead
não detecta falha persistente;

por que semaphore
e thread pool bulkhead
não são equivalentes;

por que maxWaitDuration zero
favorece fail-fast;

por que fila limitada
é obrigatória;

por que bulkhead
não substitui timeout,
retry,
circuit breaker
ou capacity planning.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
460:
Retry com backoff.

461:
Circuit breaker.

462:
Bulkhead e isolamento.

463:
Fallback.

464:
Idempotencia em APIs.
```

A aula 460 respondeu:

```text
quando repetir
uma falha transitória?
```

A aula 461 respondeu:

```text
quando interromper
chamadas a um provider
persistentemente doente?
```

A aula 462 responderá:

```text
quantas chamadas simultâneas
podem atravessar
e quais recursos
devem ser isolados?
```

Nesta aula:

```text
SemaphoreBulkhead:
sim.

ThreadPoolBulkhead:
comparado e demonstrado.

concorrência:
limitada.

fila:
limitada.

rejeição:
observável.

RestClient:
sim.

WebClient:
sim.

cancelamento:
sim.

métricas:
sim.

fallback:
próxima aula.
```

A regra central será:

```text
cada integração externa
precisa de capacidade limitada
e isolamento próprio.
```

---

## Objetivo prático

Ao final da aula, os consumidores terão:

```text
CatalogBulkheadProperties;

CatalogBulkheadPolicy;

ProductCatalogBulkheadFullException;

CatalogBulkheadMetrics;

CatalogBulkheadEventLogger;

CatalogBulkheadHealthContributor.
```

No consumidor imperativo:

```text
CatalogSemaphoreBulkheadConfiguration;

BulkheadedProductCatalogGateway;

LegacyThreadPoolBulkheadExample.
```

No consumidor reativo:

```text
ReactiveCatalogBulkheadConfiguration;

ReactiveBulkheadedProductCatalogGateway.
```

Testes:

```text
CatalogBulkheadPropertiesTest;

CatalogSemaphoreBulkheadStateTest;

RestClientBulkheadConcurrencyTest;

WebClientBulkheadConcurrencyTest;

ReactiveBulkheadCancellationTest;

BulkheadRetryOrderTest;

BulkheadCircuitBreakerOrderTest;

ThreadPoolBulkheadIsolationTest;

BulkheadMetricsTest;

BulkheadLoggingSecurityTest;

BulkheadHealthTest;

BulkheadIsolationPolicyTest;

NoFallbackBeforeFallbackLessonPolicyTest.
```

Documentação:

```text
docs/
├── BULKHEAD_POLICY.md
├── BULKHEAD_COMPOSITION_ORDER.md
├── BULKHEAD_CAPACITY_MODEL.md
├── BULKHEAD_TEST_MATRIX.md
└── BULKHEAD_RUNBOOK.md
```

Você irá:

1. diferenciar saturação e falha;
2. modelar concurrency limit;
3. comparar semáforo e thread pool;
4. validar properties;
5. configurar bulkhead dedicado;
6. aplicar no consumidor imperativo;
7. aplicar no consumidor reativo;
8. traduzir `BulkheadFullException`;
9. preservar timeout;
10. preservar retry;
11. preservar circuit breaker;
12. testar concorrência;
13. testar cancelamento;
14. testar liberação de permits;
15. testar fila limitada;
16. criar métricas;
17. criar logs seguros;
18. criar health interno;
19. registrar limitações;
20. preparar fallback.

---

## Conceito essencial

### Saturação

Saturação ocorre quando a demanda concorrente supera a capacidade disponível.

Exemplo:

```text
4 permits;

10 requests simultâneas.
```

Com `maxWaitDuration=0`:

```text
4 entram;

6 são rejeitadas.
```

A rejeição é parte da proteção.

Sem limite, as dez poderiam iniciar e competir por:

- threads;
- sockets;
- memória;
- pools;
- CPU;
- event loops;
- contexto.

---

### Bulkhead não é rate limiting

Rate limiting controla frequência em uma janela.

Exemplo:

```text
100 requests por minuto.
```

Bulkhead controla concorrência instantânea.

Exemplo:

```text
4 requests ao mesmo tempo.
```

É possível ter baixa taxa e alta concorrência quando chamadas são lentas.

Também é possível ter alta taxa com baixa concorrência quando respostas são rápidas.

Os controles são complementares.

---

### Bulkhead não é circuit breaker

Circuit breaker usa histórico de resultados para decidir se novas chamadas devem ser permitidas.

Bulkhead usa capacidade atual.

Um provider pode estar saudável, mas todas as permissões podem estar ocupadas.

Nesse caso:

```text
bulkhead rejeita;

circuit breaker continua CLOSED.
```

---

### SemaphoreBulkhead

O semáforo representa um conjunto de permissões.

Configuração:

```text
maxConcurrentCalls;

maxWaitDuration.
```

Com espera zero:

- aquisição é imediata;
- não há fila;
- saturação é visível;
- o caller falha rápido.

Com espera positiva, a thread imperativa pode ficar bloqueada aguardando permit.

No pipeline reativo, o operator de semáforo também pode introduzir espera conforme a configuração da biblioteca.

Nesta baseline:

```text
maxWaitDuration = 0.
```

---

### ThreadPoolBulkhead

O thread pool bulkhead utiliza:

```text
core thread pool size;

max thread pool size;

queue capacity;

keep alive.
```

Ele executa a função em um pool dedicado.

É útil para:

- API bloqueante legada;
- SDK sem suporte assíncrono;
- isolamento de threads;
- workload que não deve ocupar o pool principal.

Ele custa context switch, fila, memória, propagação de contexto, cancelamento, monitoramento e tuning.

---

### Fila limitada

Uma fila de tamanho quatro aceita operações enquanto os workers estão ocupados. Com pool e fila cheios:

```text
BulkheadFullException.
```

Fila grande demais:

- aumenta p99;
- retém requests que já podem estar vencidas;
- consome memória;
- esconde saturação;
- dificulta recuperação.

Fila ilimitada é proibida.

---

### Little's Law como intuição

Uma relação útil:

```text
concorrência
aproximadamente igual a
taxa de chegada
multiplicada pela latência.
```

Exemplo:

```text
20 requests por segundo;

200 ms de duração média;

concorrência média:
aproximadamente 4.
```

Se a latência sobe para um segundo:

```text
concorrência média:
aproximadamente 20.
```

O bulkhead precisa considerar throughput, p95/p99, orçamento, capacidade do provider, número de instâncias, retry e margem.

Não derive valor produtivo apenas da média.

---

### Capacidade por instância

O bulkhead do Resilience4j é local à instância.

Se existem cinco réplicas e cada uma permite quatro chamadas:

```text
capacidade agregada teórica:
20 chamadas concorrentes.
```

O provider precisa suportar esse total.

Escalar horizontalmente o consumidor também aumenta pressão no provider.

---

### Um bulkhead por capacidade

Nome:

```text
catalogAvailability.
```

Não use um bulkhead chamado:

```text
default.
```

Catálogo, pagamento e identidade precisam de limites próprios.

Mesmo dentro do catálogo, endpoints de disponibilidade e exportação podem precisar de capacidades separadas.

---

### Fairness

Semáforos podem não garantir fairness estrita entre requests.

A baseline não promete ordem FIFO.

O contrato promete:

```text
permitido
ou
rejeitado.
```

Não use o bulkhead como fila de processamento ordenado.

Mensageria será estudada posteriormente.

---

### maxWaitDuration

Uma espera positiva pode ser útil quando:

- o atraso é pequeno;
- o budget comporta;
- o modelo aceita espera;
- a fila externa é controlada.

Mas ela também pode:

- consumir thread;
- gastar deadline;
- aumentar latência;
- criar head-of-line blocking.

Por isso:

```text
baseline:
zero.
```

---

### Rejeição estável

Crie:

```java
public final class ProductCatalogBulkheadFullException
        extends ProductCatalogException {

    public ProductCatalogBulkheadFullException() {
        super(
            "Product catalog capacity is exhausted"
        );
    }
}
```

A aplicação traduz `BulkheadFullException` na infraestrutura.

O domínio não conhece Resilience4j.

---

### Status público

Use:

```text
503 Service Unavailable.
```

O consumer está saudável, mas sem capacidade para executar a dependência naquele instante.

Código:

```text
product_catalog_capacity_exhausted.
```

Não use `429` por padrão.

`429` costuma representar limitação de taxa do caller; aqui protegemos capacidade interna da dependência.

---

### Retry de bulkhead full

A baseline não repete:

```text
ProductCatalogBulkheadFullException.
```

Retry imediato colocaria a mesma request novamente diante de uma capacidade esgotada.

Backoff poderia reduzir pressão, mas manteria a operação pendente e consumiria budget.

A decisão inicial será fail-fast.

Uma futura policy poderia considerar fila externa ou retry específico, mas não nesta aula.

---

### Circuit breaker e bulkhead

Bulkhead full não conta como failure do circuit breaker.

O provider nem foi chamado.

Contar a rejeição local como falha do provider distorceria a taxa.

Métrica separada:

```text
bulkhead rejected.
```

---

### Ordem dos decorators

Baseline:

```text
Bulkhead(
    CircuitBreaker(
        Retry(
            Timeout(
                HTTP
            )
        )
    )
)
```

Uma permissão cobre a operação lógica completa.

Isso inclui:

- token;
- retry;
- backoff;
- HTTP;
- mapper.

A vantagem é um limite real de jornadas ativas.

O custo é manter o permit durante backoff.

---

### Alternativa por tentativa

```text
CircuitBreaker(
    Retry(
        Bulkhead(
            HTTP
        )
    )
)
```

Nesse desenho, cada tentativa adquire um permit.

O permit é liberado durante backoff.

Isso pode aumentar throughput, mas várias operações lógicas permanecem pendentes esperando novas tentativas.

A baseline rejeita essa ordem.

---

### Reatividade e permit

O `BulkheadOperator` adquire permissão quando há subscription.

Ele libera no terminal signal.

Por isso, é importante testar:

- `onComplete`;
- `onError`;
- cancelamento.

Uma subscription cancelada não pode vazar permit.

---

### ThreadPoolBulkhead e WebClient

Não usaremos thread pool bulkhead no fluxo reativo.

`WebClient` já utiliza I/O não bloqueante.

Mover a subscription para um pool dedicado não cria mais capacidade de rede.

Pode apenas:

- adicionar threads;
- criar fila;
- complicar contexto;
- esconder bloqueio.

---

### Context propagation

No thread pool bulkhead, `ThreadLocal` e MDC não atravessam automaticamente.

Seria necessário:

- context propagator;
- task decorator;
- captura controlada;
- limpeza.

O exemplo legado da aula utilizará correlation ID explícito na command.

Não carregará token no contexto de thread.

---

### Timeout e queue

Se uma operação fica esperando na fila do thread pool, o deadline total precisa incluir essa espera.

Não permita:

```text
queue wait
+
novo timeout completo
+
retries.
```

O budget da aula 459 continua sendo a barreira externa.

---

### Métricas

Métricas úteis:

```text
available concurrent calls;

max allowed concurrent calls;

calls permitted;

calls rejected;

queue depth;

queue capacity;

thread pool active;

thread pool size.
```

Tags permitidas:

```text
bulkhead.name;

client.type;

result.
```

Não use correlation ID ou product code como tag.

---

### Health

Bulkhead cheio em um instante não significa que a aplicação está morta.

Liveness continua independente.

Readiness também não deve oscilar a cada saturação breve sem uma policy clara.

O health interno exibirá:

- available permits;
- max permits;
- rejected calls;
- queue depth no exemplo thread pool.

---

## Mão na massa guiada

### 1. Criar policy document

Arquivo:

```text
docs/BULKHEAD_POLICY.md
```

Baseline:

| Propriedade | Valor didático |
|---|---:|
| name | catalogAvailability |
| type | semaphore |
| max concurrent calls | 4 |
| max wait duration | 0 ms |
| thread pool demo size | 2 |
| thread pool demo queue | 2 |

Registre:

```text
produção exige capacity test.
```

---

### 2. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.catalog.bulkhead"
)
public record CatalogBulkheadProperties(
        int maxConcurrentCalls,
        Duration maxWaitDuration,
        int threadPoolCoreSize,
        int threadPoolMaxSize,
        int threadPoolQueueCapacity
) {
    public CatalogBulkheadProperties {
        if (
            maxConcurrentCalls < 1
            || maxConcurrentCalls > 100
        ) {
            throw new IllegalArgumentException(
                "maxConcurrentCalls is invalid"
            );
        }

        if (maxWaitDuration.isNegative()) {
            throw new IllegalArgumentException(
                "maxWaitDuration cannot be negative"
            );
        }

        if (
            threadPoolCoreSize < 1
            || threadPoolMaxSize < threadPoolCoreSize
        ) {
            throw new IllegalArgumentException(
                "thread pool sizes are invalid"
            );
        }

        if (threadPoolQueueCapacity < 0) {
            throw new IllegalArgumentException(
                "queue capacity cannot be negative"
            );
        }
    }
}
```

---

### 3. Configurar profile local

```yaml
integrations:
  catalog:
    bulkhead:
      max-concurrent-calls: 4
      max-wait-duration: 0ms
      thread-pool-core-size: 2
      thread-pool-max-size: 2
      thread-pool-queue-capacity: 2
```

---

### 4. Criar SemaphoreBulkhead

```java
@Bean
Bulkhead catalogAvailabilityBulkhead(
        CatalogBulkheadProperties properties
) {
    BulkheadConfig config =
            BulkheadConfig
                .custom()
                .maxConcurrentCalls(
                    properties.maxConcurrentCalls()
                )
                .maxWaitDuration(
                    properties.maxWaitDuration()
                )
                .build();

    return Bulkhead.of(
            "catalogAvailability",
            config
    );
}
```

---

### 5. Criar exception estável

```java
public final class ProductCatalogBulkheadFullException
        extends ProductCatalogException {

    public ProductCatalogBulkheadFullException() {
        super(
            "Product catalog capacity is exhausted"
        );
    }
}
```

---

### 6. Decorar consumidor imperativo

```java
@Component
@Primary
public class BulkheadedProductCatalogGateway
        implements ProductCatalogGateway {

    private final ProductCatalogGateway circuitBreakingDelegate;
    private final Bulkhead bulkhead;

    @Override
    public ProductAvailabilitySnapshot findAvailability(
            ProductCode productCode
    ) {
        Supplier<ProductAvailabilitySnapshot> operation =
                Bulkhead.decorateSupplier(
                    bulkhead,
                    () ->
                        circuitBreakingDelegate
                            .findAvailability(
                                productCode
                            )
                );

        try {
            return operation.get();
        }
        catch (
            BulkheadFullException exception
        ) {
            throw new ProductCatalogBulkheadFullException();
        }
    }
}
```

A cadeia interna já contém circuit breaker e retry.

---

### 7. Qualificar a chain

Nomes:

```text
rawCatalogGateway;

retryingCatalogGateway;

circuitBreakingCatalogGateway;

bulkheadedCatalogGateway.
```

O application service recebe:

```text
bulkheadedCatalogGateway.
```

Crie architecture test para validar essa ordem.

---

### 8. Decorar consumidor reativo

```java
@Component
@Primary
public class ReactiveBulkheadedProductCatalogGateway
        implements ReactiveProductCatalogGateway {

    private final ReactiveProductCatalogGateway
            circuitBreakingDelegate;

    private final Bulkhead bulkhead;

    @Override
    public Mono<ProductAvailabilitySnapshot> findAvailability(
            ProductCode productCode
    ) {
        return Mono.defer(
                    () ->
                        circuitBreakingDelegate
                            .findAvailability(
                                productCode
                            )
                )
                .transformDeferred(
                    BulkheadOperator.of(
                        bulkhead
                    )
                )
                .onErrorMap(
                    BulkheadFullException.class,
                    exception ->
                        new ProductCatalogBulkheadFullException()
                );
    }
}
```

Não use `.block()`.

---

### 9. Preservar cancelamento

Adicione teste com upstream controlado:

```java
AtomicBoolean cancelled =
        new AtomicBoolean();

Mono<ProductAvailabilitySnapshot> upstream =
        Mono.<ProductAvailabilitySnapshot>never()
            .doOnCancel(
                () ->
                    cancelled.set(
                        true
                    )
            );
```

Cancele a subscription.

Confirme:

- upstream cancelado;
- permit liberado;
- próxima chamada consegue entrar.

---

### 10. Criar Problem Details

Mapeamento:

```text
ProductCatalogBulkheadFullException:
503.
```

Response:

```json
{
  "type": "urn:problem:integration:catalog-capacity-exhausted",
  "title": "Product catalog capacity exhausted",
  "status": 503,
  "detail": "The product catalog integration is temporarily at capacity.",
  "code": "product_catalog_capacity_exhausted",
  "correlationId": "corr-462-001"
}
```

---

### 11. Não incluir Retry-After sem policy

A baseline não promete tempo de liberação.

Uma chamada pode terminar em milissegundos ou em quase todo o timeout.

Não invente:

```text
Retry-After: 1.
```

Registre somente quando houver uma policy segura.

---

### 12. Criar event logger

Eventos:

```text
CALL_PERMITTED;

CALL_REJECTED;

CALL_FINISHED.
```

Exemplo seguro:

```java
bulkhead
    .getEventPublisher()
    .onCallRejected(
        event ->
            log.warn(
                "event=catalog_bulkhead_rejected "
                + "bulkhead={} client={}",
                event.getBulkheadName(),
                clientType
            )
    );
```

Não logue request body.

---

### 13. Criar métricas

Registre:

```text
available concurrent calls;

max allowed;

permitted;

rejected.
```

Associe Resilience4j ao `MeterRegistry` quando suportado.

Crie métricas próprias somente para gaps não cobertos.

---

### 14. Criar health contributor

Dados internos:

```text
name;

available permits;

max permits;

rejected total.
```

Mantenha management em loopback.

Não altere liveness por uma rejeição isolada.

---

### 15. Criar BarrierCatalogStub

Fixture:

1. cada request incrementa contador;
2. espera em uma barrier;
3. só termina quando teste libera.

Isso permite manter quatro chamadas simultâneas ocupando permits.

Não use `Thread.sleep` como sincronização principal.

---

### 16. Testar quatro chamadas permitidas

Inicie quatro tasks.

Confirme:

```text
HTTP calls:
4;

available permits:
0;

nenhuma rejeição.
```

---

### 17. Testar quinta rejeitada

Com quatro chamadas bloqueadas:

```text
quinta chamada:
ProductCatalogBulkheadFullException;

HTTP calls continuam:
4;

retry:
0 para a quinta;

circuit breaker:
não registra failure.
```

---

### 18. Liberar e testar novamente

Libere as quatro calls.

Confirme permits restaurados.

Execute nova chamada.

Esperado:

```text
sucesso.
```

Isso detecta leak de permit.

---

### 19. Testar erro libera permit

Uma chamada permitida termina com `503`.

Mesmo com retry e circuit breaker internos, ao final:

```text
permit liberado.
```

Execute chamada seguinte.

---

### 20. Testar timeout libera permit

Mantenha response lenta até o timeout.

Após `ProductCatalogTimeoutException`:

```text
available permits:
4.
```

---

### 21. Testar circuito aberto

Abra o circuit breaker.

Execute chamadas concorrentes.

Como bulkhead é externo:

- cada chamada adquire permit brevemente;
- breaker rejeita;
- permit é liberado;
- não há HTTP;
- não há retry.

Confirme que não existe leak.

---

### 22. Testar bulkhead full ignorado pelo breaker

Com bulkhead saturado, execute rejeições.

Failure rate do breaker não deve mudar.

---

### 23. Testar bulkhead full sem retry

Valide:

```text
raw calls:
0;

retry scheduled:
0.
```

A exception não entra na retry policy.

---

### 24. Testar WebClient concorrente

Use `Flux.range(1, 10)` apenas no teste.

Faça dez subscriptions concorrentes.

Com quatro permits e upstream bloqueado:

```text
4 permitidas;

6 rejeitadas.
```

Não use `flatMap` com concurrency quatro como substituto do bulkhead.

O teste precisa exercitar o operator.

---

### 25. Testar reactive cancellation

Cancele duas das quatro operações.

Confirme que duas novas subscriptions podem entrar.

---

### 26. Testar terminal signals

Cenários:

```text
onComplete;

onError;

cancel.
```

Todos liberam permit.

---

### 27. Criar ThreadPoolBulkhead demo

Somente no consumidor imperativo:

```java
@Bean
ThreadPoolBulkhead legacyCatalogThreadPoolBulkhead(
        CatalogBulkheadProperties properties
) {
    ThreadPoolBulkheadConfig config =
            ThreadPoolBulkheadConfig
                .custom()
                .coreThreadPoolSize(
                    properties.threadPoolCoreSize()
                )
                .maxThreadPoolSize(
                    properties.threadPoolMaxSize()
                )
                .queueCapacity(
                    properties.threadPoolQueueCapacity()
                )
                .build();

    return ThreadPoolBulkhead.of(
            "legacyCatalogBlocking",
            config
    );
}
```

Ele não substitui a baseline.

---

### 28. Criar exemplo legado

```java
CompletionStage<ProductAvailabilitySnapshot>
findLegacyAvailability(
        ProductCode code
) {
    Supplier<CompletionStage<ProductAvailabilitySnapshot>>
            decorated =
                ThreadPoolBulkhead
                    .decorateSupplier(
                        legacyBulkhead,
                        () ->
                            blockingGateway
                                .findAvailability(
                                    code
                                )
                    );

    return decorated.get();
}
```

Ajuste a API exata à versão usada.

O objetivo é compreender o modelo.

---

### 29. Testar pool e fila

Configuração:

```text
2 workers;

2 queued.
```

Inicie cinco operações bloqueadas.

Esperado:

```text
2 executando;

2 na fila;

1 rejeitada.
```

---

### 30. Testar queue wait dentro do budget

A operação na fila precisa compartilhar o mesmo deadline total.

Se o budget expira antes de executar:

```text
não iniciar HTTP.
```

Documente a complexidade adicional.

---

### 31. Testar correlation em thread pool

Passe correlation explicitamente.

Confirme:

- worker recebe o ID técnico;
- MDC é limpo;
- chamada seguinte não herda ID anterior;
- token não é propagado por MDC.

---

### 32. Criar capacity model

Arquivo:

```text
docs/BULKHEAD_CAPACITY_MODEL.md
```

Exemplo didático:

```text
incoming:
20 req/s;

p95:
200 ms;

concurrency estimada:
4;

bulkhead:
4;

retry:
até 3 raw calls;

instances:
1 no laboratório.
```

Registre margem e limitações.

---

### 33. Criar composition order document

Arquivo:

```text
docs/BULKHEAD_COMPOSITION_ORDER.md
```

Baseline:

```text
Bulkhead
-> CircuitBreaker
-> Retry
-> Timeout
-> HTTP.
```

Explique:

- logical operation limit;
- permit durante backoff;
- CB open dentro do permit;
- sem tentativa adicional de permit por retry.

---

### 34. Criar test matrix

Arquivo:

```text
docs/BULKHEAD_TEST_MATRIX.md
```

| Cenário | Esperado |
|---|---|
| 4 concorrentes | permitidas |
| 5ª | rejeitada |
| erro | permit liberado |
| timeout | permit liberado |
| cancelamento | permit liberado |
| circuit open | sem HTTP |
| bulkhead full | sem retry |
| thread pool 2+2 | quinta rejeitada |

---

### 35. Criar runbook

Arquivo:

```text
docs/BULKHEAD_RUNBOOK.md
```

Perguntas:

- qual bulkhead;
- quantos permits;
- quantos disponíveis;
- taxa de rejeição;
- p95/p99;
- retry aumentou duração;
- circuit breaker está aberto;
- pool está saturado;
- fila está cheia;
- quantas instâncias existem;
- provider suporta capacidade agregada;
- houve mudança de timeout;
- houve aumento de tráfego;
- fallback ainda não existe.

---

### 36. Criar isolation policy test

Falhe se:

- bulkhead se chama `default`;
- mesmo bulkhead protege catálogo e pagamento;
- queue capacity é negativa ou ilimitada;
- max concurrent calls é zero;
- max wait é maior que total timeout;
- controller acessa Bulkhead;
- domínio importa Resilience4j;
- thread pool bulkhead aparece no projeto reativo;
- fallback aparece antes da aula 463.

---

### 37. Criar metrics cardinality test

Proíba tags:

- product code;
- correlation ID;
- URL;
- token;
- thread name;
- exception message.

---

### 38. Criar logging sentinel test

Sentinelas:

```text
token-bulkhead-sentinel;

body-bulkhead-sentinel;

product-bulkhead-sentinel;

correlation-leak-sentinel.
```

Teste:

- permitida;
- rejeitada;
- erro;
- timeout;
- cancelamento;
- thread pool reuse.

---

### 39. Executar testes imperativos

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer

.\mvnw.cmd `
  -Dtest=CatalogBulkheadPropertiesTest,CatalogSemaphoreBulkheadStateTest,RestClientBulkheadConcurrencyTest,BulkheadRetryOrderTest,BulkheadCircuitBreakerOrderTest,ThreadPoolBulkheadIsolationTest,BulkheadMetricsTest,BulkheadLoggingSecurityTest,BulkheadHealthTest,BulkheadIsolationPolicyTest `
  test
```

---

### 40. Executar testes reativos

```powershell
Set-Location `
  ..\order-consumer-reactive

.\mvnw.cmd `
  -Dtest=CatalogBulkheadPropertiesTest,CatalogSemaphoreBulkheadStateTest,WebClientBulkheadConcurrencyTest,ReactiveBulkheadCancellationTest,BulkheadRetryOrderTest,BulkheadCircuitBreakerOrderTest,BulkheadMetricsTest,BulkheadLoggingSecurityTest,BulkheadHealthTest,BulkheadIsolationPolicyTest,NoFallbackBeforeFallbackLessonPolicyTest `
  test
```

---

### 41. Executar saturação local

Configure o provider para manter respostas lentas abaixo do timeout.

Dispare concorrência.

Confirme:

```text
4 operações ativas;

demais:
503 capacity exhausted;

provider:
máximo 4 chamadas lógicas simultâneas.
```

---

### 42. Executar recuperação

Após as chamadas terminarem:

```text
available permits:
4.
```

A taxa de rejeição volta a zero quando o tráfego diminui.

---

### 43. Executar regressão de resiliência

Confirme:

- timeout continua ativo;
- retry continua filtrado;
- circuit breaker continua medindo;
- bulkhead full não vira retry;
- bulkhead full não abre circuit;
- correlation continua;
- logs continuam seguros;
- no fallback.

---

### 44. Executar gates

Em ambos:

```powershell
.\mvnw.cmd clean verify
```

---

### 45. Atualizar documentação dos clients

Registre:

```text
bulkhead:
implementado;

baseline:
semaphore;

thread pool:
somente exemplo legado;

fallback:
ainda ausente.
```

---

### 46. Registrar limitações

Ainda faltam:

```text
fallback;

load test real;

tuning produtivo;

capacity review do provider;

pool acquisition tuning;

distributed admission control;

fila externa;

autoscaling validado;

dashboards e alertas reais.
```

---

## Entendendo o que foi feito

### Concorrência ganhou limite

A integração não pode mais ocupar recursos sem controle.

### Saturação virou falha explícita

A quinta chamada recebe uma exception estável e não atinge o provider.

### Circuit breaker e bulkhead ficaram separados

Um usa histórico; o outro usa capacidade atual.

### Retry não amplifica rejeições

Bulkhead full não entra na retry policy.

### O provider não é culpado por rejeição local

Bulkhead full não altera failure rate do circuit breaker.

### Permits foram testados em todos os terminais

Sucesso, erro, timeout e cancelamento liberam capacidade.

### Thread pool foi estudada sem contaminar o reativo

O exemplo legado mostra fila e workers dedicados.

### A ordem dos decorators foi registrada

Uma permissão cobre uma operação lógica completa.

### A próxima decisão ficou preparada

Com capacidade limitada, poderemos discutir respostas alternativas seguras.

---

## Erros comuns importantes

### Usar fila ilimitada

A aplicação acumula latência e memória.

### Configurar bulkhead global

Uma integração consome a capacidade de todas.

### Repetir bulkhead full

A rejeição local volta para a mesma saturação.

### Contar bulkhead full no circuit breaker

O provider é marcado como doente sem ter sido chamado.

### Manter maxWait alto

Threads e deadlines são consumidos.

### Usar ThreadPoolBulkhead no WebClient

Threads extras anulam parte do modelo não bloqueante.

### Não testar cancelamento

Permits podem vazar.

### Dimensionar só pela média

Picos e p99 ficam ignorados.

### Esquecer capacidade agregada por réplicas

O provider recebe mais carga a cada escala horizontal.

### Confundir bulkhead com fallback

Limitar capacidade não cria resposta alternativa.

---

## Comandos úteis

### Testes imperativos

```powershell
.\mvnw.cmd `
  -Dtest=RestClientBulkheadConcurrencyTest,ThreadPoolBulkheadIsolationTest,BulkheadRetryOrderTest `
  test
```

### Testes reativos

```powershell
.\mvnw.cmd `
  -Dtest=WebClientBulkheadConcurrencyTest,ReactiveBulkheadCancellationTest,BulkheadCircuitBreakerOrderTest `
  test
```

### Policies e observabilidade

```powershell
.\mvnw.cmd `
  -Dtest=BulkheadMetricsTest,BulkheadLoggingSecurityTest,BulkheadHealthTest,BulkheadIsolationPolicyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar filas e fallback

```powershell
git grep `
  -n `
  -E `
  "Bulkhead|queueCapacity|onErrorReturn|recover\\(|available\\(true\\)|fallback"
```

---

## Exercício guiado

### Parte 1 — Saturação

Diferencie taxa, falha e concorrência.

### Parte 2 — Semáforo

Configure quatro permits e fail-fast.

### Parte 3 — Imperativo

Decore a operação lógica.

### Parte 4 — Reativo

Use `BulkheadOperator`.

### Parte 5 — Ordem

Preserve breaker, retry e timeout.

### Parte 6 — Signals

Teste sucesso, erro e cancelamento.

### Parte 7 — Thread pool

Demonstre workers e fila limitada.

### Parte 8 — Observabilidade

Crie metrics, events e health.

### Parte 9 — Capacity

Estime concorrência e réplicas.

### Parte 10 — Gate

Comprove que rejeições não chamam o provider.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 461 foi preservada;
- bulkhead foi diferenciado de rate limiting;
- bulkhead foi diferenciado de circuit breaker;
- saturação foi explicada;
- SemaphoreBulkhead foi configurado;
- ThreadPoolBulkhead foi comparado;
- baseline utiliza semáforo;
- maxConcurrentCalls foi configurado;
- maxWaitDuration foi configurado como zero;
- values foram marcados como didáticos;
- fila ilimitada foi proibida;
- thread pool possui queue capacity limitada;
- `ProductCatalogBulkheadFullException` foi criada;
- bulkhead full retorna `503`;
- nenhum detalhe interno foi exposto;
- bulkhead full não recebe retry;
- bulkhead full não conta no circuit breaker;
- bulkhead dedicado ao catálogo foi criado;
- domínio não importa Resilience4j;
- consumidor imperativo recebeu decorator;
- consumidor reativo recebeu `BulkheadOperator`;
- código reativo não usa `.block()`;
- ordem com circuit breaker, retry e timeout foi documentada;
- uma permissão cobre uma operação lógica;
- permits durante backoff foram discutidos;
- alternativa por tentativa foi analisada;
- quatro chamadas concorrentes foram permitidas;
- quinta chamada foi rejeitada;
- rejeição não atingiu HTTP;
- erro liberou permit;
- timeout liberou permit;
- cancelamento liberou permit;
- circuit open não vazou permit;
- concorrência reativa foi testada;
- ThreadPoolBulkhead executou workers e fila limitada;
- quinta operação thread pool foi rejeitada;
- queue wait foi ligada ao budget;
- correlation em worker foi controlada;
- métricas de permits e rejeições foram criadas;
- logs não contêm token ou body;
- health detalhado ficou interno;
- liveness não depende de saturação momentânea;
- capacity model foi criado;
- capacidade agregada por réplicas foi discutida;
- isolation policy foi criada;
- fallback não foi antecipado;
- limitações foram registradas;
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
  "Bulkhead|ThreadPoolBulkhead|queueCapacity|onErrorReturn|recover\\(|available\\(true\\)|Bearer ey"
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
git commit -m "feat(m16): limitar concorrencia com bulkhead"
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
- fila ilimitada;
- maxWait produtivo inventado;
- fallback;
- bulkhead global;
- ThreadPoolBulkhead no fluxo reativo;
- reset ou bypass público;
- logs temporários;
- report local.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a integração passou a possuir um limite de concorrência explícito.

A cadeia ficou:

```text
Bulkhead;

Circuit Breaker;

Retry;

Timeout;

HTTP client;

catalog-provider.
```

O bulkhead baseado em semáforo passou a permitir:

```text
4 operações lógicas
simultâneas.
```

Quando a capacidade está ocupada:

```text
nova chamada:

ProductCatalogBulkheadFullException;

503;

sem HTTP;

sem retry;

sem failure
no circuit breaker.
```

A principal decisão foi:

```text
uma permissão
cobre a operação lógica inteira,
incluindo retry e backoff.
```

Isso limita o número total de jornadas ativas, mesmo com o custo de manter capacidade ocupada durante a espera.

Também ficou comprovado:

```text
rate limiting
controla frequência;

bulkhead
controla concorrência;

circuit breaker
controla insistência
em falhas persistentes.
```

O `ThreadPoolBulkhead` demonstrou isolamento de workloads bloqueantes com:

- workers dedicados;
- fila limitada;
- rejeição previsível;
- propagação explícita de contexto.

Ele não foi aplicado ao `WebClient`.

A aula testou a liberação de permits em:

- sucesso;
- erro;
- timeout;
- cancelamento;
- circuito aberto.

Agora existe uma nova pergunta.

Quando a chamada não pode ser executada por:

- circuito aberto;
- timeout;
- indisponibilidade;
- bulkhead cheio;

o sistema deve sempre falhar ou existe alguma resposta alternativa segura?

A próxima aula será:

```text
463 - M16.08 - Fallback
```

Nela, você irá:

- diferenciar fallback de esconder erro;
- definir quais dados podem ser usados;
- modelar cache com idade e origem;
- impedir `available=true` por padrão;
- criar fallback somente para leitura;
- diferenciar stale data e ausência de dado;
- combinar fallback com timeout, retry, circuit breaker e bulkhead;
- criar métricas e headers de degradação;
- testar comportamento degradado;
- preservar segurança e consistência.

---

# Material complementar

## Checkpoint final

- [ ] Limitei concorrência com semáforo.
- [ ] Separei bulkhead, rate limit e circuit breaker.
- [ ] Testei permits e cancelamento.
- [ ] Demonstrei thread pool e fila limitada.
- [ ] Mantive fallback para a próxima aula.

---

## Troubleshooting adicional

### A quinta chamada entra mesmo assim

Confirme se o bean decorado é o injetado no service e se as chamadas permanecem simultâneas no teste.

### O teste não satura

Use barrier ou latch para manter as primeiras chamadas ativas.

### Bulkhead full entra no retry

Remova a exception da retry classifier.

### Bulkhead full abre o circuit breaker

A rejeição local está dentro do classifier do breaker ou a ordem foi invertida.

### Permit não volta após cancelamento

Confirme `BulkheadOperator`, terminal signal e ausência de subscription paralela.

### WebClient usa ThreadPoolBulkhead

Remova o pool e mantenha o semáforo reativo.

### Thread pool perde correlation

Propague contexto explícito e limpe MDC no worker.

### A fila aumenta p99

Reduza ou elimine queue; revise capacidade e budget.

### O provider recebe mais carga após escalar replicas

Calcule capacidade agregada e coordene com o provider.

### A equipe pede fallback disponível por padrão

A próxima aula exigirá fonte, idade, segurança e semântica explícitas.

---

## Perguntas de revisão

1. O que bulkhead limita?
2. Bulkhead é rate limiting?
3. Bulkhead é circuit breaker?
4. O que faz SemaphoreBulkhead?
5. O que faz ThreadPoolBulkhead?
6. Qual é o max concurrent didático?
7. Qual é o max wait?
8. Por que max wait zero?
9. Fila ilimitada é aceita?
10. Bulkhead full recebe retry?
11. Bulkhead full conta no breaker?
12. Qual status público usamos?
13. Qual é a ordem dos decorators?
14. Permit cobre o backoff?
15. Cancelamento libera permit?
16. Thread pool é usado no WebClient?
17. O que Little's Law ajuda a estimar?
18. Bulkhead fornece fallback?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Concorrência.
2. Não.
3. Não.
4. Limita execuções por permits.
5. Isola em workers e fila limitada.
6. Quatro.
7. Zero.
8. Falhar rápido e não consumir deadline.
9. Não.
10. Não.
11. Não.
12. `503`.
13. Bulkhead, circuit breaker, retry, timeout e HTTP.
14. Sim na baseline.
15. Sim.
16. Não.
17. Concorrência por taxa e latência.
18. Não.
19. Fallback.
20. Resposta degradada segura.

---

## Desafio opcional

Crie uma simulação de capacidade com:

```text
1, 2, 4 e 8 permits;

latência de 100, 300 e 800 ms;

uma e quatro réplicas;

retry zero e dois.
```

Calcule:

- throughput;
- rejeições;
- ocupação;
- chamadas ao provider;
- p95 aproximado.

Não use o resultado como tuning produtivo sem teste real.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 462 - M16.07 - Bulkhead e isolamento

- Implementei bulkhead nas integrações do catálogo.
- Diferenciei saturação de falha persistente.
- Diferenciei bulkhead, rate limiting e circuit breaker.
- Estudei SemaphoreBulkhead.
- Estudei ThreadPoolBulkhead.
- Escolhi SemaphoreBulkhead como baseline.
- Configurei quatro chamadas concorrentes.
- Configurei `maxWaitDuration` zero.
- Mantive rejeição fail-fast.
- Proibi fila ilimitada.
- Criei `CatalogBulkheadProperties`.
- Criei `ProductCatalogBulkheadFullException`.
- Mapeei saturação para `503`.
- Mantive detalhes internos fora do Problem Details.
- Criei bulkhead dedicado `catalogAvailability`.
- Mantive Resilience4j fora do domínio.
- Criei decorator imperativo.
- Criei decorator reativo com `BulkheadOperator`.
- Mantive `.block()` fora do fluxo reativo.
- Defini a ordem Bulkhead -> CircuitBreaker -> Retry -> Timeout -> HTTP.
- Tratei uma permissão como uma operação lógica.
- Mantive permit durante backoff.
- Analisei a alternativa por tentativa.
- Impedi retry de bulkhead full.
- Impedi bulkhead full de contar no circuit breaker.
- Testei quatro chamadas permitidas.
- Testei quinta chamada rejeitada.
- Comprovei que rejeição não chama o provider.
- Testei liberação após sucesso.
- Testei liberação após erro.
- Testei liberação após timeout.
- Testei liberação após cancelamento.
- Testei circuito aberto sem leak.
- Testei concorrência no WebClient.
- Criei exemplo com ThreadPoolBulkhead.
- Configurei dois workers e fila de duas posições.
- Testei quinta operação rejeitada.
- Liguei queue wait ao budget total.
- Controlei correlation em worker reutilizado.
- Criei métricas de permits e rejeições.
- Criei logs seguros.
- Criei health contributor interno.
- Mantive liveness independente da saturação momentânea.
- Criei `BULKHEAD_POLICY.md`.
- Criei `BULKHEAD_COMPOSITION_ORDER.md`.
- Criei `BULKHEAD_CAPACITY_MODEL.md`.
- Criei `BULKHEAD_TEST_MATRIX.md`.
- Criei `BULKHEAD_RUNBOOK.md`.
- Criei isolation policy.
- Não antecipei fallback.
- Mantive produção pública como NO-GO.
- Próxima aula: Fallback.
```

---

## Referência técnica curta

- [Resilience4j — Bulkhead](https://resilience4j.readme.io/docs/bulkhead)
- [Resilience4j Reactor — BulkheadOperator](https://resilience4j.readme.io/docs/examples-1)
- [Resilience4j — Getting Started](https://resilience4j.readme.io/docs/getting-started)
- [Microsoft Azure Architecture Center — Bulkhead](https://learn.microsoft.com/azure/architecture/patterns/bulkhead)
- [AWS Builders Library — Avoiding overload](https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/)
- [Reactive Streams](https://www.reactive-streams.org/)

Regra final:

```text
bulkhead e isolamento devem limitar concorrência antes que uma dependência lenta consuma toda a aplicação: SemaphoreBulkhead controla permits sem criar pool, ThreadPoolBulkhead isola workloads bloqueantes em workers e fila limitada, cada provider e capacidade recebe seu próprio limite, maxWait zero favorece fail-fast, bulkhead full é uma rejeição local que não recebe retry nem conta no circuit breaker, a ordem Bulkhead, CircuitBreaker, Retry, Timeout e HTTP limita operações lógicas completas, permits são liberados em sucesso, erro, timeout e cancelamento, métricas mostram capacidade e rejeições sem alta cardinalidade e fallback continua uma decisão separada que só pode ser adicionada com semântica, origem e validade explícitas.
```
