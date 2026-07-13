# 582 - M18.27 - Cache local Caffeine

## Apresentação da aula

Na aula 581, você dimensionou o HikariCP com base em concorrência, tempo de posse da conexão, capacidade do PostgreSQL, réplicas, timeouts e falhas.

Você aprendeu que:

```text
pool maior
não cria capacidade
no banco;

ele apenas permite
mais concorrência
contra o banco.
```

Também passou a medir:

- active;
- idle;
- pending;
- acquisition time;
- usage time;
- timeout;
- conexões totais;
- impacto do rollout;
- recuperação após falha.

Depois de otimizar consultas e dimensionar o pool, uma nova pergunta aparece:

```text
toda leitura
precisa realmente
chegar ao banco?
```

Em muitos sistemas, algumas informações são:

- consultadas com frequência;
- relativamente estáveis;
- pequenas;
- reconstruíveis;
- tolerantes a pequena defasagem;
- caras o suficiente para justificar reutilização.

Nesses casos, um cache local pode reduzir:

- latência;
- chamadas ao banco;
- utilização do pool;
- CPU do banco;
- quantidade de queries;
- alocação relacionada ao acesso a dados;
- tráfego interno;
- pressão durante picos.

Nesta aula, você utilizará **Caffeine**, uma biblioteca de cache local para Java.

O cache ficará dentro do processo da aplicação.

Isso significa:

```text
cada réplica
possui seu próprio cache.
```

Se existem quatro réplicas, existem quatro conjuntos de entradas independentes.

O cache local oferece acesso rápido sem rede, mas cada réplica possui dados, memória, warmup, invalidação e estatísticas independentes. Restart esvazia o cache e scale-out cria instâncias frias.

A pergunta central será:

```text
como criar
um cache local
com Caffeine

que seja limitado,
observável,
coerente
com o negócio,
seguro
sob concorrência
e reversível?
```

O objetivo é selecionar candidatos adequados e definir chave, valor, origem, TTL, tamanho, invalidação, miss, falha, concorrência, métricas, segurança e rollback.

Sem limite, expiração, invalidação, isolamento e métricas, o cache pode consumir heap, servir dados obsoletos, misturar tenants e esconder baixo benefício.

A aula utilizará duas formas de integração:

```text
Spring Cache
com Caffeine;

API nativa
do Caffeine
em pontos controlados.
```

Spring Cache atenderá operações declarativas; a API nativa será usada para stats, weight, loader, refresh e concorrência explícita.

Você trabalhará com Spring Cache, API nativa Caffeine, size, weight, expiração, refresh, loader, atomic loading, negative caching, stampede, hot keys, stats, warmup, invalidação e rollback.

A aula não irá criar cache distribuído.

Não serão tratados:

- servidor Redis;
- cluster Redis;
- rede entre aplicação e cache;
- consistência compartilhada;
- pub/sub;
- distributed lock;
- cache compartilhado entre réplicas;
- TTL no Redis;
- keyspace notifications;
- serialização em Redis;
- failover Redis;
- cache distribuído;
- invalidação remota.

Esses assuntos pertencem à próxima aula oficial:

```text
583 - M18.28 - Cache distribuido Redis
```

A regra central será:

```text
cache local
é uma cópia temporária
por processo;

a fonte da verdade
continua fora dele.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
580:
Performance de banco.

581:
HikariCP tuning.

582:
Cache local Caffeine.

583:
Cache distribuido Redis.
```

A progressão é:

```text
otimizar consultas;

dimensionar conexões;

reduzir leituras repetidas
dentro de cada réplica;

compartilhar cache
entre réplicas.
```

Nesta aula:

```text
Caffeine:
sim.

Spring Cache:
sim.

cache local:
sim.

maximumSize:
sim.

maximumWeight:
sim.

expireAfterWrite:
sim.

expireAfterAccess:
sim.

refreshAfterWrite:
sim.

recordStats:
sim.

loader:
sim.

eviction:
sim.

stampede:
sim.

invalidation:
sim.

Redis:
não.

cache distribuído:
não.

pub/sub:
não.
```

Você reutilizará:

- budgets da API;
- query count;
- métricas HikariCP;
- latência de banco;
- traces;
- logs;
- Prometheus;
- Grafana;
- JFR;
- heap dump;
- testes de carga;
- runbooks;
- cenários de falha.

O cache precisa preservar contrato, autorização, consistência aceitável, isolamento, fonte da verdade, observabilidade e desligamento seguro.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/cache/caffeine
├── caffeine-cache-contract.yaml
├── caffeine-cache-catalog.yaml
├── caffeine-cache-candidate-policy.yaml
├── caffeine-cache-key-policy.yaml
├── caffeine-cache-size-policy.yaml
├── caffeine-cache-expiration-policy.yaml
├── caffeine-cache-refresh-policy.yaml
├── caffeine-cache-loader-policy.yaml
├── caffeine-cache-invalidation-policy.yaml
├── caffeine-cache-concurrency-policy.yaml
├── caffeine-cache-negative-policy.yaml
├── caffeine-cache-warmup-policy.yaml
├── caffeine-cache-observability-policy.yaml
├── caffeine-cache-memory-policy.yaml
├── caffeine-cache-regression-policy.yaml
├── caffeine-cache-data-quality-policy.yaml
├── caffeine-cache-security-policy.yaml
├── caffeine-cache-failure-policy.yaml
├── caffeine-cache-scenarios.yaml
└── caffeine-cache-evidence.yaml

performance/cache/caffeine/profiles
├── cache-disabled.properties
├── bounded-ttl.properties
├── access-expiration.properties
├── weighted-cache.properties
├── refresh-cache.properties
└── rollback.properties

performance/cache/caffeine/reports
├── caffeine-baseline-report.yaml
├── caffeine-hit-miss-report.yaml
├── caffeine-eviction-report.yaml
├── caffeine-memory-report.yaml
├── caffeine-concurrency-report.yaml
├── caffeine-invalidation-report.yaml
└── caffeine-gate-report.yaml

scripts/performance/cache/caffeine
├── validate-caffeine-contract.ps1
├── collect-caffeine-baseline.ps1
├── measure-caffeine-hit-ratio.ps1
├── measure-caffeine-load-time.ps1
├── validate-caffeine-size-bound.ps1
├── validate-caffeine-expiration.ps1
├── validate-caffeine-refresh.ps1
├── validate-caffeine-invalidation.ps1
├── validate-caffeine-concurrency.ps1
├── simulate-caffeine-stampede.ps1
├── simulate-caffeine-hot-key.ps1
├── simulate-caffeine-cold-start.ps1
├── analyze-caffeine-memory.ps1
├── compare-caffeine-profiles.ps1
├── enforce-caffeine-budget.ps1
├── validate-caffeine-rollback.ps1
├── scan-caffeine-output.ps1
├── collect-caffeine-evidence.ps1
└── verify-caffeine-baseline.ps1

docs/performance/cache/caffeine
├── CAFFEINE_OVERVIEW.md
├── CACHE_CANDIDATE_GUIDE.md
├── CACHE_KEYS_AND_VALUES.md
├── SIZE_AND_WEIGHT_GUIDE.md
├── EXPIRATION_AND_REFRESH.md
├── INVALIDATION_GUIDE.md
├── CACHE_CONCURRENCY_GUIDE.md
├── CACHE_OBSERVABILITY_GUIDE.md
├── CAFFEINE_TEST_MATRIX.md
└── CAFFEINE_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, candidatos avaliados, chaves versionadas, limites, expiração, invalidação, métricas, concorrência, rollback e evidence sanitizada.

Você irá criar o cache local, medir baseline, validar hit, miss, load, eviction, expiração, memória, concorrência e invalidação, comparar perfis e executar o gate.

---

## Conceito essencial

### Cache local

Cópia temporária de dados mantida dentro do processo da aplicação.

---

### Source of truth

Sistema responsável pelo estado autoritativo.

O cache não substitui essa fonte.

---

### Cache entry

Par de chave e valor armazenado.

---

### Cache key

Identificador usado para localizar uma entrada.

---

### Cache value

Representação armazenada para reutilização.

---

### Cache hit

Consulta atendida pelo cache.

---

### Cache miss

Chave ausente ou expirada que exige busca na origem.

---

### Load

Operação que obtém o valor da fonte e o coloca no cache.

---

### Load success

Carregamento concluído com valor válido.

---

### Load failure

Falha ao carregar o valor.

---

### Hit ratio

Proporção de acessos atendidos pelo cache.

```text
hit ratio
=
hits
/
requests.
```

---

### Eviction

Remoção causada por política de tamanho, peso ou expiração.

---

### Invalidation

Remoção explícita de uma entrada.

---

### Expiration

Remoção baseada em tempo.

---

### `maximumSize`

Limite aproximado da quantidade de entradas.

---

### `maximumWeight`

Limite baseado em peso calculado por entrada.

---

### `expireAfterWrite`

Expiração calculada a partir da criação ou atualização da entrada.

---

### `expireAfterAccess`

Expiração calculada a partir do último acesso.

---

### `refreshAfterWrite`

Atualização assíncrona após uma idade mínima, normalmente combinada com loader.

---

### Cache loader

Componente responsável por buscar o valor quando a chave não está presente.

---

### Atomic load

Garantia de que carregamentos concorrentes da mesma chave sejam coordenados.

---

### Cache stampede

Muitas requisições tentando reconstruir a mesma entrada ao mesmo tempo.

---

### Hot key

Chave acessada com frequência muito maior que as demais.

---

### Cold cache

Cache vazio ou ainda não aquecido.

---

### Negative caching

Armazenamento temporário de resultado ausente ou negativo.

---

### Bounded cache

Cache com limite explícito de quantidade ou peso.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Confirme:

- API compila;
- testes passam;
- banco ativo;
- HikariCP está estável;
- query count conhecido;
- endpoint candidato conhecido;
- métricas disponíveis;
- nenhum Redis será antecipado.

---

### 2. Adicionar dependência Caffeine

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

Mantenha as versões gerenciadas pelo Spring Boot quando possível.

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

---

### 3. Habilitar Spring Cache

Crie:

```java
@Configuration
@EnableCaching
public class CacheConfiguration {
}
```

`@EnableCaching` ativa o suporte aos proxies de cache do Spring.

Isso significa que chamadas internas no mesmo objeto podem não passar pelo proxy.

A aula irá validar esse comportamento.

---

### 4. Criar contrato de cache

Arquivo:

```text
caffeine-cache-contract.yaml
```

Conteúdo:

```yaml
cache:
  required:
    - name
    - owner
    - source-of-truth
    - key
    - value
    - maximum
    - expiration
    - invalidation
    - metrics
    - rollback

  candidate:
    require:
      - repeated-read
      - bounded-cardinality
      - acceptable-staleness
      - reconstructible-value

  forbidden:
    - unbounded-cache
    - sensitive-key
    - source-of-truth-replacement
    - silent-failure

  distributedCache:
    deferredToLesson583
```

---

### 5. Criar catálogo de caches

Arquivo:

```text
caffeine-cache-catalog.yaml
```

Exemplo:

```yaml
caches:
  - id:
      order-status-by-id

    owner:
      orders-api

    sourceOfTruth:
      PostgreSQL

    operation:
      GET /orders/{id}/status

    key:
      order-id-with-tenant-scope

    value:
      OrderStatusSnapshot

    staleness:
      maximum:
        20s

    invalidation:
      on-status-change

    maximumSize:
      10000

    productionValues:
      undefined
```

---

### 6. Criar política de candidato

Arquivo:

```text
caffeine-cache-candidate-policy.yaml
```

Conteúdo:

```yaml
candidate:
  positiveSignals:
    - read-heavy
    - repeated-key-access
    - stable-value-window
    - expensive-source
    - small-value
    - bounded-key-space

  negativeSignals:
    - write-heavy
    - strict-read-after-write
    - unbounded-cardinality
    - large-value
    - authorization-dependent-value
    - low-repeat-rate

  decision:
    required:
      - expected-hit-ratio
      - staleness-tolerance
      - invalidation-source
      - memory-budget
```

Consulta lenta só vira candidata após excluir problemas de query, lock, pool ou dependência.

---

### 7. Criar DTO imutável para o valor

Exemplo:

```java
public record OrderStatusSnapshot(
        UUID orderId,
        String status,
        Instant updatedAt,
        long version) {
}
```

O valor deve ser pequeno, imutável, thread-safe, desacoplado de JPA e sem dados desnecessários.

---

### 8. Criar política de chave

Arquivo:

```text
caffeine-cache-key-policy.yaml
```

Conteúdo:

```yaml
key:
  required:
    - stable
    - immutable
    - bounded
    - authorization-safe

  include:
    whenApplicable:
      - tenant
      - resource-id
      - representation-version
      - locale

  forbidden:
    - token
    - email
    - customer-name
    - mutable-object
    - raw-request

  toString:
    logging:
      sanitized
```

A chave precisa representar exatamente a variação do valor.

---

### 9. Criar chave tipada

Exemplo:

```java
public record OrderStatusCacheKey(
        String tenantId,
        UUID orderId) {

    public OrderStatusCacheKey {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(orderId);
    }
}
```

Não use uma chave textual ambígua como:

```text
tenant + ":" + orderId
```

sem normalização e contrato.

---

### 10. Criar política de tamanho

Arquivo:

```text
caffeine-cache-size-policy.yaml
```

Conteúdo:

```yaml
size:
  bounded:
    required

  strategy:
    allowed:
      - maximum-size
      - maximum-weight

  maximumSize:
    useWhen:
      entriesHaveSimilarCost

  maximumWeight:
    useWhen:
      entryCostVaries

  measure:
    - estimated-size
    - eviction-count
    - heap-impact

  arbitraryValue:
    forbidden
```

---

### 11. Configurar `maximumSize`

Crie:

```java
@Configuration
@EnableCaching
public class CacheConfiguration {

    @Bean
    public CaffeineCacheManager caffeineCacheManager() {
        CaffeineCacheManager manager =
                new CaffeineCacheManager("order-status-by-id");

        manager.setCaffeine(
                Caffeine.newBuilder()
                        .maximumSize(10_000)
                        .expireAfterWrite(Duration.ofSeconds(20))
                        .recordStats());

        return manager;
    }
}
```

A capacidade depende de heap, réplicas, cardinalidade e tamanho.

---

### 12. Criar política de memória

Arquivo:

```text
caffeine-cache-memory-policy.yaml
```

Conteúdo:

```yaml
memory:
  budget:
    required

  measure:
    - heap-before
    - heap-after-warmup
    - post-gc-floor
    - estimated-size
    - eviction-count
    - allocation-rate

  replicas:
    multiplyLocalCache:
      true

  heapDump:
    useForRetentionValidation:
      allowed

  unlimitedGrowth:
    block:
      true
```

Cache local consome heap em cada réplica.

---

### 13. Medir memória

Script:

```text
analyze-caffeine-memory.ps1
```

Colete:

- heap baseline;
- heap após warmup;
- pós-GC;
- entradas estimadas;
- eviction count;
- tamanho médio aproximado;
- throughput;
- hit ratio;
- release;
- profile.

Compare com cache desabilitado.

---

### 14. Usar `maximumWeight`

Quando valores possuem tamanhos muito diferentes:

```java
Cache<OrderStatusCacheKey, OrderStatusSnapshot> cache =
        Caffeine.newBuilder()
                .maximumWeight(10_000_000L)
                .weigher((OrderStatusCacheKey key,
                          OrderStatusSnapshot value) -> {
                    return estimateWeight(value);
                })
                .recordStats()
                .build();
```

O `weigher` precisa ser rápido, determinístico e proporcional ao custo; peso não representa bytes exatos.

---

### 15. Criar política de expiração

Arquivo:

```text
caffeine-cache-expiration-policy.yaml
```

Conteúdo:

```yaml
expiration:
  strategy:
    allowed:
      - after-write
      - after-access
      - variable

  businessStaleness:
    required

  expireAfterWrite:
    useWhen:
      freshnessStartsAtLoad

  expireAfterAccess:
    useWhen:
      inactivityShouldRemove

  expirationWithoutInvalidation:
    requiresReview

  zeroOrHugeTTL:
    forbiddenWithoutEvidence
```

---

### 16. Diferenciar `expireAfterWrite`

Use quando o valor precisa ser renovado após tempo fixo desde criação ou atualização.

Exemplo:

```text
status pode ficar
até 20 segundos
desatualizado.
```

O relógio não é renovado por leitura.

É uma política adequada quando frequência de acesso não deve prolongar indefinidamente a vida da entrada.

---

### 17. Diferenciar `expireAfterAccess`

Use quando entradas não acessadas precisam sair:

```java
Caffeine.newBuilder()
        .maximumSize(10_000)
        .expireAfterAccess(Duration.ofMinutes(5))
        .recordStats();
```

Uma hot key pode permanecer enquanto continuar sendo acessada.

Isso pode ser inadequado quando existe limite rígido de staleness.

---

### 18. Validar expiração

Script:

```text
validate-caffeine-expiration.ps1
```

Cenários:

- miss inicial;
- hit antes do TTL;
- acesso próximo do limite;
- expiração;
- novo load;
- valor atualizado na origem;
- relógio controlado;
- concorrência na expiração.

Use `Ticker` controlado em testes unitários quando necessário.

---

### 19. Criar `Ticker` de teste

Exemplo conceitual:

```java
final class MutableTicker
        implements Ticker {

    private final AtomicLong nanos =
            new AtomicLong();

    @Override
    public long read() {
        return nanos.get();
    }

    void advance(Duration duration) {
        nanos.addAndGet(duration.toNanos());
    }
}
```

Isso torna a expiração determinística.

---

### 20. Criar política de loader

Arquivo:

```text
caffeine-cache-loader-policy.yaml
```

Conteúdo:

```yaml
loader:
  source:
    required

  failure:
    propagateOrFallback:
      explicit

  timeout:
    required

  null:
    strategy:
      explicit

  concurrentSameKey:
    atomicLoad:
      required

  externalCall:
    observe:
      required
```

---

### 21. Usar `LoadingCache`

Exemplo:

```java
@Bean
LoadingCache<OrderStatusCacheKey, OrderStatusSnapshot>
orderStatusLoadingCache(
        OrderStatusSource source) {

    return Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(Duration.ofSeconds(20))
            .recordStats()
            .build(source::load);
}
```

O loader deve retornar valor imutável.

Falhas não devem ser convertidas silenciosamente em dado antigo sem contrato.

---

### 22. Evitar stampede com atomic load

Com:

```java
cache.get(key, mappingFunction)
```

requisições concorrentes para a mesma chave podem compartilhar o carregamento coordenado pelo cache.

Exemplo:

```java
public OrderStatusSnapshot findStatus(
        OrderStatusCacheKey key) {

    return cache.get(
            key,
            source::load);
}
```

Isso reduz múltiplas leituras simultâneas da mesma chave.

---

### 23. Criar política de concorrência

Arquivo:

```text
caffeine-cache-concurrency-policy.yaml
```

Conteúdo:

```yaml
concurrency:
  sameKey:
    load:
      atomic:
        required

  differentKeys:
    parallel:
      allowed

  loader:
    blocking:
      isolated:
        required

  mutation:
    valueImmutable:
      required

  stampede:
    scenario:
      required

  hotKey:
    scenario:
      required
```

O cache é thread-safe, e o valor também precisa ser.

---

### 24. Simular stampede

Script:

```text
simulate-caffeine-stampede.ps1
```

Cenário:

```text
100 chamadas concorrentes;

mesma chave;

cache vazio;

origem com 200 ms.
```

Meça:

- loads na origem;
- requests;
- hits;
- misses;
- total load time;
- p95;
- threads;
- HikariCP active;
- query count.

Resultado esperado:

```text
um carregamento coordenado
ou quantidade controlada,
conforme a API usada.
```

---

### 25. Simular hot key

Script:

```text
simulate-caffeine-hot-key.ps1
```

Use distribuição:

```text
80% dos acessos
em 1% das chaves.
```

Observe:

- hit ratio;
- latência;
- contenção;
- loader;
- expiração;
- memória;
- origem;
- perfil por réplica.

Uma hot key expirada pode causar pico de carga.

---

### 26. Criar política de refresh

Arquivo:

```text
caffeine-cache-refresh-policy.yaml
```

Conteúdo:

```yaml
refresh:
  use:
    requiresLoader:
      true

  refreshAfterWrite:
    semantics:
      staleValueMayBeServedDuringRefresh

  failure:
    keepPreviousValue:
      evaluate

  executor:
    bounded:
      required

  sourcePressure:
    measure:
      required

  strictFreshness:
    use:
      false
```

---

### 27. Entender `refreshAfterWrite`

Refresh é diferente de expiração.

Na expiração:

```text
entrada deixa de estar disponível;

próxima leitura
precisa carregar.
```

No refresh:

```text
entrada pode continuar disponível;

uma leitura elegível
aciona atualização.
```

Isso pode reduzir picos de latência, mas permite servir valor antigo durante a atualização.

---

### 28. Configurar refresh controlado

Exemplo:

```java
LoadingCache<OrderStatusCacheKey, OrderStatusSnapshot>
cache =
        Caffeine.newBuilder()
                .maximumSize(10_000)
                .refreshAfterWrite(Duration.ofSeconds(15))
                .expireAfterWrite(Duration.ofMinutes(2))
                .executor(cacheRefreshExecutor)
                .recordStats()
                .build(source::load);
```

O executor precisa ser limitado.

---

### 29. Validar refresh

Script:

```text
validate-caffeine-refresh.ps1
```

Cenários:

- valor inicial;
- janela antes do refresh;
- leitura que aciona refresh;
- valor antigo durante atualização;
- refresh concluído;
- refresh falha;
- origem lenta;
- muitas chaves elegíveis;
- shutdown.

Registre se servir valor antigo é aceitável.

---

### 30. Criar política de invalidação

Arquivo:

```text
caffeine-cache-invalidation-policy.yaml
```

Conteúdo:

```yaml
invalidation:
  requiredFor:
    - write
    - status-change
    - delete
    - authorization-change

  timing:
    afterSuccessfulCommit:
      required

  methods:
    allowed:
      - invalidate-key
      - invalidate-group
      - invalidate-all-controlled

  failure:
    observable:
      required

  localScope:
    documented:
      required
```

A invalidação é local à réplica.

---

### 31. Invalidar após commit

Evite invalidar antes da confirmação da transação.

Exemplo:

```java
@Component
public class OrderStatusCacheInvalidator {

    private final Cache<OrderStatusCacheKey,
            OrderStatusSnapshot> cache;

    public void invalidateAfterCommit(
            OrderStatusCacheKey key) {

        TransactionSynchronizationManager
                .registerSynchronization(
                        new TransactionSynchronization() {
                            @Override
                            public void afterCommit() {
                                cache.invalidate(key);
                            }
                        });
    }
}
```

Em rollback, a entrada permanece.

---

### 32. Usar `@Cacheable`

Exemplo:

```java
@Service
public class OrderStatusQueryService {

    @Cacheable(
            cacheNames = "order-status-by-id",
            key = "#tenantId + ':' + #orderId",
            sync = true)
    public OrderStatusSnapshot find(
            String tenantId,
            UUID orderId) {

        return loadFromDatabase(
                tenantId,
                orderId);
    }
}
```

`sync = true` ajuda a coordenar loads concorrentes conforme o provider e a operação.

Prefira uma estratégia de chave explicitamente testada.

---

### 33. Usar `@CacheEvict`

Exemplo:

```java
@CacheEvict(
        cacheNames = "order-status-by-id",
        key = "#tenantId + ':' + #orderId")
public void evictStatus(
        String tenantId,
        UUID orderId) {
}
```

A chamada precisa passar pelo proxy; self-invocation pode ignorar a interceptação.

---

### 34. Validar self-invocation

Cenário:

```java
this.findStatus(...)
```

dentro da mesma classe.

A chamada não passa necessariamente pelo proxy.

Crie teste que valide:

- primeira chamada;
- segunda chamada;
- contador de origem;
- chamada externa;
- chamada interna;
- eviction.

Se necessário, separe responsabilidades em beans diferentes.

---

### 35. Criar política de negative caching

Arquivo:

```text
caffeine-cache-negative-policy.yaml
```

Conteúdo:

```yaml
negativeCaching:
  allowedFor:
    - stable-not-found
    - rate-limited-origin-protection

  forbiddenFor:
    - transient-error
    - authorization-denied
    - timeout
    - database-unavailable

  TTL:
    short:
      required

  representation:
    explicit:
      required

  creationRace:
    evaluate:
      required
```

Não armazene timeout como se o recurso não existisse.

---

### 36. Tratar ausência explicitamente

Em vez de `null`, use representação controlada:

```java
public sealed interface OrderStatusCacheValue
        permits FoundOrderStatus,
                MissingOrderStatus {
}
```

Ou utilize `Optional` somente com contrato bem definido.

Caffeine não aceita `null` como valor de cache nativo.

---

### 37. Criar política de warmup

Arquivo:

```text
caffeine-cache-warmup-policy.yaml
```

Conteúdo:

```yaml
warmup:
  default:
    lazy

  eager:
    allowedWhen:
      - key-set-small
      - source-safe
      - startup-budget-allows
      - memory-known

  startup:
    cannotBlockIndefinitely:
      true

  replica:
    eachWarmsIndependently:
      true

  preloadingAllData:
    forbiddenWithoutBound
```

---

### 38. Simular cold start

Script:

```text
simulate-caffeine-cold-start.ps1
```

Cenário:

- restart da aplicação;
- cache vazio;
- workload inicial;
- miss ratio;
- HikariCP active;
- query count;
- p95;
- warmup duration;
- hit ratio após estabilização.

Compare uma réplica fria e uma aquecida.

---

### 39. Evitar warmup agressivo

Carregar milhares de chaves no startup pode:

- atrasar readiness;
- pressionar banco;
- consumir conexões;
- aumentar heap;
- causar tempestade durante scale-out;
- carregar dados nunca usados.

Prefira lazy loading quando o conjunto é grande ou imprevisível.

---

### 40. Criar política de observabilidade

Arquivo:

```text
caffeine-cache-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  stats:
    required:
      - request-count
      - hit-count
      - miss-count
      - load-success
      - load-failure
      - total-load-time
      - eviction-count
      - estimated-size

  labels:
    allowed:
      - cache
      - service
      - environment

  labels:
    forbidden:
      - key
      - tenant
      - order-id
      - customer-id

  correlate:
    - endpoint-latency
    - query-count
    - HikariCP-active
    - database-cpu
    - heap
```

---

### 41. Expor stats

Com cache nativo:

```java
CacheStats stats =
        cache.stats();

long hits =
        stats.hitCount();

long misses =
        stats.missCount();

double hitRate =
        stats.hitRate();

long evictions =
        stats.evictionCount();
```

Não registre chaves individuais em métricas.

---

### 42. Medir hit ratio

Script:

```text
measure-caffeine-hit-ratio.ps1
```

Calcule:

```text
hit ratio;

miss ratio;

load success rate;

load failure rate;

average load penalty;

eviction rate.
```

Hit ratio alto não prova benefício; compare latência, queries, heap, GC, CPU, consistência e invalidação.

---

### 43. Criar budget de cache

Exemplo:

```yaml
cacheBudget:
  hitRatio:
    minimumAfterWarmup:
      0.80

  loadFailureRate:
    maximum:
      0.01

  evictionRate:
    reviewAbove:
      0.10

  memory:
    maximumHeapShare:
      0.08

  staleResponse:
    maximumKnown:
      business-defined

  productionValues:
    undefined
```

---

### 44. Criar política de regressão

Arquivo:

```text
caffeine-cache-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - endpoint-latency
    - query-count
    - pool-acquisition
    - database-cpu
    - heap
    - gc
    - hit-ratio
    - load-failure
    - stale-response
    - invalidation

  APIImprovementWithMemoryRegression:
    rejectWhenBudgetExceeded

  staleData:
    critical:
      true

  localReplicaDivergence:
    document:
      required
```

---

### 45. Comparar perfis

Script:

```text
compare-caffeine-profiles.ps1
```

Compare:

```text
cache-disabled;

bounded-ttl;

access-expiration;

weighted-cache;

refresh-cache;

rollback.
```

Para cada perfil, registre:

- configuração;
- workload;
- hit ratio;
- miss ratio;
- p95;
- query count;
- HikariCP active;
- DB CPU;
- heap;
- GC;
- eviction;
- stale;
- decisão.

---

### 46. Criar política de qualidade

Arquivo:

```text
caffeine-cache-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingBaseline:
    action:
      block-comparison

  missingStats:
    result:
      limited

  unknownKeyCardinality:
    result:
      inconclusive

  mixedWorkload:
    action:
      split-analysis

  noWarmupWindow:
    result:
      limited

  staleDetectionMissing:
    action:
      block-approval

  singleReplicaOnly:
    localBehaviorOnly:
      true
```

---

### 47. Criar política de segurança

Arquivo:

```text
caffeine-cache-security-policy.yaml
```

Conteúdo:

```yaml
security:
  key:
    forbidden:
      - token
      - password
      - email
      - raw-customer-id

  value:
    forbidden:
      - credential
      - authorization-context
      - mutable-session
      - unnecessary-personal-data

  tenant:
    isolation:
      required

  dumps:
    cacheValuesMayAppear:
      true

  logs:
    rawKey:
      forbidden
```

Heap dumps podem conter valores cacheados.

Armazene somente o necessário.

---

### 48. Criar failure policy

Arquivo:

```text
caffeine-cache-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  loaderFailure:
    action:
      propagate-or-defined-fallback

  invalidationFailure:
    action:
      log-metric-and-protect

  memoryBudgetExceeded:
    action:
      disable-or-reduce-cache

  staleCriticalData:
    action:
      bypass-cache

  statsUnavailable:
    result:
      limited

  localCacheDivergence:
    expectedAcrossReplicas:
      true

  Redis:
    deferredToLesson583
```

---

### 49. Criar cenários

Arquivo:

```text
caffeine-cache-scenarios.yaml
```

Cenários:

```text
cache-disabled-baseline;

cold-miss;

warm-hit;

entry-expiration;

access-expiration;

size-eviction;

weight-eviction;

loader-success;

loader-failure;

same-key-concurrency;

stampede-protection;

hot-key;

refresh-success;

refresh-failure;

write-invalidation;

rollback-without-invalidation;

negative-cache-not-found;

negative-cache-timeout-forbidden;

cold-start;

multi-replica-divergence;

memory-budget-breach.
```

Cada cenário registra:

- profile;
- cache;
- workload;
- key category;
- origin calls;
- stats;
- latency;
- memory;
- consistency;
- result;
- rollback;
- evidence.

---

### 50. Validar size bound

Script:

```text
validate-caffeine-size-bound.ps1
```

Insira mais chaves que o limite.

Observe:

- estimated size;
- eviction count;
- hit ratio;
- heap;
- origem;
- latência.

O tamanho é aproximado; valide comportamento, não igualdade instantânea.

---

### 51. Validar invalidação

Script:

```text
validate-caffeine-invalidation.ps1
```

Fluxo:

1. carregar valor;
2. confirmar hit;
3. atualizar origem;
4. confirmar commit;
5. invalidar;
6. consultar novamente;
7. confirmar novo valor;
8. simular rollback;
9. confirmar que invalidação indevida não ocorreu;
10. coletar métricas.

---

### 52. Criar relatório baseline

Arquivo:

```text
caffeine-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  cache:
    disabled

  endpoint:
    GET /orders/{id}/status

  workload:
    repeated-read

  metrics:
    latencyP95Ms:
      90

    queryCount:
      1000

    poolActiveP95:
      8

    databaseCpu:
      moderate

  result:
    baseline-approved
```

---

### 53. Criar relatório com cache

Arquivo:

```text
caffeine-hit-miss-report.yaml
```

Exemplo:

```yaml
cache:
  profile:
    bounded-ttl

  metrics:
    hitRatio:
      0.88

    loadFailureRate:
      0

    evictionCount:
      low

    latencyP95Ms:
      20

    queryReduction:
      substantial

    heapImpact:
      within-budget

  consistency:
    invalidation:
      approved

  result:
    candidate-approved-in-laboratory
```

---

### 54. Executar gate

Script:

```text
enforce-caffeine-budget.ps1
```

Valide:

- baseline;
- hit ratio;
- load failure;
- p95;
- query count;
- HikariCP;
- banco;
- heap;
- GC;
- eviction;
- stale;
- invalidation;
- segurança;
- rollback.

Status:

```text
PASS;

FAIL_MEMORY;

FAIL_STALE;

FAIL_INVALIDATION;

FAIL_LOAD;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 55. Validar rollback

Script:

```text
validate-caffeine-rollback.ps1
```

Procedimento:

1. executar perfil com cache;
2. coletar métricas;
3. desabilitar cache por profile;
4. reiniciar de forma controlada;
5. repetir baseline;
6. confirmar origem;
7. confirmar ausência de erro;
8. comparar;
9. preservar evidence;
10. limpar artifacts.

O sistema permanece correto sem cache.

---

### 56. Criar matriz de testes

Arquivo:

```text
CAFFEINE_TEST_MATRIX.md
```

Cenários:

- dependency;
- `@EnableCaching`;
- `@Cacheable`;
- `@CacheEvict`;
- self-invocation;
- key isolation;
- immutable value;
- maximum size;
- maximum weight;
- expire after write;
- expire after access;
- ticker;
- loader;
- atomic load;
- stampede;
- hot key;
- refresh;
- refresh failure;
- invalidation;
- commit;
- rollback;
- negative caching;
- cold start;
- warmup;
- metrics;
- heap;
- eviction;
- multi-replica divergence;
- security scan;
- rollback do cache;
- evidence sanitizada.

---

### 57. Criar troubleshooting

Arquivo:

```text
CAFFEINE_TROUBLESHOOTING.md
```

Inclua:

- `@Cacheable` não funciona;
- self-invocation;
- chave colide;
- hit ratio baixo;
- eviction alta;
- heap cresce;
- `expireAfterAccess` mantém hot key antiga;
- refresh sobrecarrega origem;
- loader falha;
- stampede reaparece;
- negative cache armazena timeout;
- invalidação ocorre antes do commit;
- rollback remove entrada;
- cache mistura tenants;
- restart causa pico;
- scale-out causa cold start;
- métricas não aparecem;
- valor mutável;
- cache local diverge entre réplicas;
- Redis antecipado.

---

### 58. Coletar evidence

Script:

```text
collect-caffeine-evidence.ps1
```

Arquivo:

```text
caffeine-cache-evidence.yaml.
```

A evidence pode registrar aula, ambiente, serviço, release, cache, profile e status de candidato, chave, tamanho, memória, expiração, refresh, loader, concorrência, hits, evictions, invalidação, cold start, rollback, segurança, gate e testes.

Não inclua:

- chaves;
- valores;
- tenant IDs;
- order IDs;
- dados pessoais;
- heap dump;
- Redis;
- material da aula 583.

---

### 59. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\cache\caffeine\validate-caffeine-contract.ps1

.\scripts\performance\cache\caffeine\collect-caffeine-baseline.ps1

.\scripts\performance\cache\caffeine\measure-caffeine-hit-ratio.ps1

.\scripts\performance\cache\caffeine\measure-caffeine-load-time.ps1

.\scripts\performance\cache\caffeine\validate-caffeine-size-bound.ps1

.\scripts\performance\cache\caffeine\validate-caffeine-expiration.ps1

.\scripts\performance\cache\caffeine\validate-caffeine-refresh.ps1

.\scripts\performance\cache\caffeine\validate-caffeine-invalidation.ps1

.\scripts\performance\cache\caffeine\validate-caffeine-concurrency.ps1

.\scripts\performance\cache\caffeine\simulate-caffeine-stampede.ps1

.\scripts\performance\cache\caffeine\simulate-caffeine-hot-key.ps1

.\scripts\performance\cache\caffeine\simulate-caffeine-cold-start.ps1

.\scripts\performance\cache\caffeine\analyze-caffeine-memory.ps1

.\scripts\performance\cache\caffeine\compare-caffeine-profiles.ps1

.\scripts\performance\cache\caffeine\enforce-caffeine-budget.ps1

.\scripts\performance\cache\caffeine\validate-caffeine-rollback.ps1

.\scripts\performance\cache\caffeine\scan-caffeine-output.ps1

.\scripts\performance\cache\caffeine\collect-caffeine-evidence.ps1

.\scripts\performance\cache\caffeine\verify-caffeine-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- candidato validado;
- chave validada;
- valor imutável;
- size bound aprovado;
- memória aprovada;
- expiração aprovada;
- loader aprovado;
- concorrência aprovada;
- stampede controlado;
- refresh validado;
- invalidação validada;
- negative caching validado;
- cold start analisado;
- métricas aprovadas;
- rollback aprovado;
- segurança aprovada;
- evidence sanitizada;
- Redis não antecipado.

---

### 60. Encerrar o laboratório

Pare workloads e limpe caches.

Com API nativa:

```java
cache.invalidateAll();
cache.cleanUp();
```

Remova artifacts temporários:

```powershell
Remove-Item `
  .tmp/caffeine `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve policies;
- preserve reports;
- preserve scripts;
- preserve docs;
- confirme que nenhuma chave ou valor está no Git.

---

## Entendendo o que foi feito

### O candidato ganhou critérios

Consultas repetidas deixaram de ser cacheadas por intuição.

### A chave ganhou contrato

Tenant, recurso e versão passaram a determinar isolamento.

### O valor ganhou imutabilidade

Entidades JPA e objetos mutáveis deixaram de entrar no cache.

### O tamanho ganhou limite

Heap passou a ser protegido por size ou weight.

### A expiração ganhou semântica

Write, access e refresh passaram a responder a necessidades diferentes.

### O loader ganhou concorrência

Loads da mesma chave passaram a ser coordenados.

### A invalidação ganhou transação

A entrada passou a ser removida depois do commit.

### Stats ganharam correlação

Hit ratio passou a ser comparado com latência, banco, pool e memória.

### Cold start ganhou cenário

Restart e scale-out passaram a considerar cache frio por réplica.

### Rollback ganhou prova

A aplicação continuou correta com cache desabilitado.

### A próxima aula ganhou fronteira

O Redis irá tratar cache compartilhado, rede e consistência entre réplicas.

---

## Erros comuns importantes

### Cachear tudo

Cardinalidade, staleness e memória precisam ser avaliadas.

### Não limitar tamanho

O cache pode competir com o heap da aplicação.

### Usar apenas TTL

Writes podem exigir invalidação imediata.

### Invalidar antes do commit

Rollback pode deixar comportamento incoerente.

### Usar entidade JPA como valor

Lazy loading, mutabilidade e acoplamento aparecem.

### Colocar tenant fora da chave

Dados podem ser misturados.

### Medir apenas hit ratio

Memória, stale e custo de load podem piorar.

### Usar refresh com executor ilimitado

A origem pode ser sobrecarregada.

### Cachear timeout como not found

Falha transitória vira ausência falsa.

### Assumir consistência entre réplicas

Cada processo possui cache próprio.

---

## Comandos úteis

### Executar testes

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Medir hit ratio

```powershell
.\scripts\performance\cache\caffeine\measure-caffeine-hit-ratio.ps1
```

### Validar invalidação

```powershell
.\scripts\performance\cache\caffeine\validate-caffeine-invalidation.ps1
```

### Analisar memória

```powershell
.\scripts\performance\cache\caffeine\analyze-caffeine-memory.ps1
```

### Executar gate

```powershell
.\scripts\performance\cache\caffeine\enforce-caffeine-budget.ps1
```

---

## Exercício guiado

### Parte 1 — Candidate

Escolha um endpoint read-heavy e bounded.

### Parte 2 — Key e value

Crie chave tipada e valor imutável.

### Parte 3 — Size

Compare maximum size e weight.

### Parte 4 — Expiration

Teste write, access e relógio controlado.

### Parte 5 — Loader

Valide load success, failure e atomicidade.

### Parte 6 — Concurrency

Simule stampede e hot key.

### Parte 7 — Refresh

Valide atualização e falha.

### Parte 8 — Invalidation

Teste commit, rollback e delete.

### Parte 9 — Observability

Meça hit, miss, load, eviction e heap.

### Parte 10 — Gate

Valide segurança, rollback e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 581 e ponte para a aula 583 foram preservadas;
- cache local, source of truth, entry, key, value, hit, miss, load, eviction, invalidation, expiration, size, weight, refresh, loader, stampede, hot key, cold cache e negative caching foram definidos;
- dependências do Spring Cache e Caffeine foram adicionadas;
- `@EnableCaching` foi habilitado;
- contrato, catálogo e política de candidato foram criados;
- chave tipada, estável, bounded e isolada por autorização foi criada;
- valor imutável e desacoplado de entidade JPA foi criado;
- `maximumSize` e `maximumWeight` foram avaliados;
- heap, pós-GC, estimated size e evictions foram medidos;
- `expireAfterWrite` e `expireAfterAccess` foram diferenciados;
- expiração foi testada com relógio controlado;
- loader possui falha, timeout e atomic load explícitos;
- concorrência da mesma chave foi coordenada;
- stampede e hot key foram simulados;
- refresh foi diferenciado de expiração;
- executor de refresh é limitado;
- invalidação ocorre após commit;
- rollback não invalida indevidamente;
- `@Cacheable`, `@CacheEvict` e self-invocation foram validados;
- negative caching não armazena timeout ou indisponibilidade;
- warmup e cold start por réplica foram analisados;
- stats de hit, miss, load, eviction e size foram expostas;
- hit ratio foi correlacionado com latência, queries, HikariCP, banco e heap;
- budgets e regressões de memória, stale e invalidação foram avaliados;
- perfis cache-disabled, bounded, weighted, refresh e rollback foram comparados;
- políticas de qualidade, segurança e failure foram criadas;
- cenários, matriz de testes, troubleshooting, rollback e evidence sanitizada estão presentes;
- nenhuma chave, valor, dado pessoal, heap dump ou segredo foi commitado;
- cache distribuído Redis não foi antecipado;
- commit recomendado, diário de bordo e regra final estão presentes.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/cache/caffeine `
  scripts/performance/cache/caffeine `
  docs/performance/cache/caffeine `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|customer_id|order_id|tenantId|cacheKey|cacheValue|redis|pubsub|distributedLock"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar cache local com Caffeine"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- chaves;
- valores;
- tokens;
- dados pessoais;
- heap dumps;
- artifacts temporários;
- configuração real de produção;
- Redis;
- material da aula 583.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou um cache local Caffeine limitado, observável e seguro.

Você trabalhou com:

```text
Spring Cache;

Caffeine;

keys;

values;

maximumSize;

maximumWeight;

expireAfterWrite;

expireAfterAccess;

refreshAfterWrite;

loader;

stats;

eviction;

invalidation;

stampede;

hot keys;

cold start;

negative caching;

rollback.
```

Você comprovou que cache local é uma cópia por processo; a fonte da verdade continua no banco; chaves precisam refletir tenant e representação; valores precisam ser pequenos e imutáveis; size e weight protegem o heap; expiração e invalidação possuem papéis diferentes; refresh pode servir valor antigo durante atualização; loads concorrentes precisam ser coordenados; stats precisam ser correlacionadas a banco, pool e memória; e a aplicação precisa continuar correta com cache desligado.

A próxima aula será:

```text
583 - M18.28 - Cache distribuido Redis
```

Nela, você irá compartilhar o cache entre réplicas e tratar rede, serialização, TTL, namespaces, invalidação remota, falhas, consistência, observabilidade e fallback.

Nenhum servidor Redis, cache compartilhado, pub/sub, distributed lock, keyspace notification, failover Redis ou invalidação remota foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Escolhi candidato adequado.
- [ ] Criei chave segura.
- [ ] Criei valor imutável.
- [ ] Limitei size ou weight.
- [ ] Validei expiração.
- [ ] Validei loader e concorrência.
- [ ] Validei invalidação.
- [ ] Medi stats, memória e rollback.

---

## Troubleshooting adicional

### `@Cacheable` não produz hit

Verifique `@EnableCaching`, proxy, método público, chave e self-invocation.

### Hit ratio permanece baixo

O padrão de acesso pode não repetir chaves o suficiente.

### Eviction cresce rapidamente

Revise cardinalidade, tamanho, TTL e distribuição.

### Heap aumenta além do budget

Reduza limite, valor ou desabilite o cache.

### `expireAfterAccess` mantém dado antigo

Hot keys renovam a janela de acesso; use política compatível com staleness.

### Refresh aumenta carga

Revise executor, janela, quantidade de chaves e origem.

### Invalidação não ocorre

Valide evento, commit, proxy e chave exata.

### Rollback remove entrada

A invalidação ocorreu cedo demais.

### Cache mistura tenants

Desabilite imediatamente e corrija a chave.

### Réplicas retornam valores diferentes

Isso é possível em cache local; o cache distribuído será tratado na aula 583.

---

## Perguntas de revisão

1. O que é cache local?
2. Por que ele é por réplica?
3. O que é source of truth?
4. O que é cache hit?
5. O que é cache miss?
6. Qual diferença entre size e weight?
7. Qual diferença entre write e access expiration?
8. Qual diferença entre expiration e refresh?
9. O que é cache loader?
10. O que é atomic load?
11. O que é cache stampede?
12. O que é hot key?
13. Por que o valor deve ser imutável?
14. Por que invalidar após commit?
15. O que é negative caching?
16. Por que medir heap?
17. Hit ratio alto sempre é bom?
18. O que acontece no restart?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Cópia no processo.
2. Cada processo possui memória própria.
3. Estado autoritativo.
4. Leitura atendida pelo cache.
5. Leitura que exige origem.
6. Entradas versus custo ponderado.
7. Tempo desde escrita versus último acesso.
8. Remover versus atualizar mantendo valor.
9. Componente que carrega a origem.
10. Load coordenado por chave.
11. Muitos loads simultâneos.
12. Chave muito acessada.
13. Segurança entre threads.
14. Evitar inconsistência em rollback.
15. Cache temporário de ausência.
16. Cache compete pelo heap.
17. Não, stale e memória também importam.
18. O cache fica frio.
19. Cache distribuído Redis.
20. Cache distribuído Redis.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 582 - M18.27 - Cache local Caffeine

- Continuei após HikariCP tuning.
- Entendi cache local como cópia temporária por processo.
- Mantive PostgreSQL como fonte da verdade.
- Adicionei Spring Cache e Caffeine.
- Habilitei `@EnableCaching`.
- Criei contrato, catálogo e política de candidato.
- Criei chave tipada com isolamento por tenant.
- Criei valor pequeno e imutável.
- Comparei `maximumSize` e `maximumWeight`.
- Medi heap, pós-GC, tamanho e eviction.
- Diferenciei `expireAfterWrite` e `expireAfterAccess`.
- Testei expiração com `Ticker` controlado.
- Criei loader com falha e timeout explícitos.
- Coordenei loads da mesma chave.
- Simulei cache stampede e hot key.
- Diferenciei refresh e expiration.
- Limitei executor de refresh.
- Invalidei entradas após commit.
- Validei rollback sem invalidação indevida.
- Validei `@Cacheable`, `@CacheEvict` e self-invocation.
- Impedi negative caching de timeout.
- Analisei cold start e warmup por réplica.
- Expus hit, miss, load, eviction e size.
- Correlacionei cache com API, HikariCP, banco e heap.
- Comparei perfis e executei rollback.
- Coletei evidence sanitizada.
- Não antecipei Redis.
- Próxima aula: Cache distribuído Redis.
```

---

## Referência técnica curta

- Caffeine Cache.
- Spring Cache abstraction.
- Cache sizing and weighting.
- Expiration policies.
- Refresh policies.
- Cache loading.
- Cache statistics.
- Cache invalidation.
- Cache stampede.
- Local cache consistency.

Regra final:

```text
cache local Caffeine precisa ser tratado como cópia temporária por processo, nunca como fonte da verdade: cada cache possui candidato, owner, chave segura, valor imutável, limite de size ou weight, política de expiração, invalidação após commit, loader, comportamento de falha, métricas e rollback; expireAfterWrite controla idade desde carga, expireAfterAccess controla inatividade, refreshAfterWrite pode manter valor antigo durante atualização e exige executor limitado, enquanto atomic load reduz stampede para a mesma chave; hit ratio é comparado com latência, queries, HikariCP, banco, heap, GC, eviction e stale, negative caching não transforma timeout em ausência, e restart ou scale-out produzem cache frio em cada réplica; chaves, valores e dados pessoais permanecem fora do Git e de métricas, deixando para a aula 583 o cache distribuído Redis com compartilhamento entre réplicas, rede, serialização, TTL, namespaces, invalidação remota, failover e consistência.
```
