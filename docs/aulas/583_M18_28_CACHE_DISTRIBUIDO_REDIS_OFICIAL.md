# 583 - M18.28 - Cache distribuido Redis

## Apresentação da aula

Na aula 582, você implementou um cache local com Caffeine.

Você trabalhou com:

```text
cache por processo;

Spring Cache;

Caffeine;

maximumSize;

maximumWeight;

expireAfterWrite;

expireAfterAccess;

refreshAfterWrite;

loader;

atomic load;

cache stampede;

hot keys;

invalidação após commit;

cold start;

métricas;

rollback.
```

A principal característica do cache local ficou clara:

```text
cada réplica
possui sua própria cópia.
```

Isso significa que uma réplica pode ter a entrada quente enquanto outra ainda consulta o banco.

Também significa que:

- restart elimina o cache daquela instância;
- scale-out cria uma instância fria;
- hit ratio varia por réplica;
- cada processo consome heap;
- uma remoção local não alcança as outras instâncias;
- dados podem divergir durante a janela de expiração.

Agora você irá mover a cópia temporária para um serviço externo compartilhado.

A pergunta central será como usar Redis sem transformar uma otimização em fonte de latência, inconsistência, falha ou vazamento.

Redis é um armazenamento em memória acessado pela rede.

Nesta aula, ele será usado como cache compartilhado entre as réplicas da `orders-api`.

As réplicas consultam o mesmo namespace no Redis. O compartilhamento reduz leituras repetidas, mas adiciona rede, serialização, conexões, timeouts, falhas, memória externa, observabilidade e fallback.

```text
PostgreSQL:
fonte da verdade.

Redis:
cópia temporária compartilhada.
```

Se Redis perder as entradas, a aplicação deve continuar pela origem, desde que o banco suporte o fallback. Uma outage pode provocar misses em massa, mais queries, conexões, CPU, latência e saturação: **cache outage amplification**.

A aula construirá cache Redis com Docker Compose, Spring Cache, namespaces, chaves versionadas, TTL, JSON, timeouts, fallback, métricas, health, falhas e rollback.

Cache local é mais rápido e isolado por réplica; cache distribuído é compartilhado e depende de rede; cache híbrido combina L1 local e L2 Redis, com maior complexidade. O laboratório usará Redis como cache distribuído único e manterá Caffeine apenas como comparação.

Redis não será banco principal nem será usado para sessões, filas, streams, locks, leader election, rate limit, pesquisa, contadores financeiros ou idempotência durável.

A aula seguinte será:

```text
584 - M18.29 - Cache invalidation
```

Esta aula usará apenas TTL, remoção pontual após escrita, limpeza controlada do namespace e fallback. Outbox, pub/sub, version tokens, tombstones, races, reparação e consistência avançada pertencem à aula 584.

Regra central:

```text
Redis é uma dependência
de performance;

a aplicação precisa
preservar correção
quando o cache
está vazio,
lento
ou indisponível.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
581:
HikariCP tuning.

582:
Cache local Caffeine.

583:
Cache distribuido Redis.

584:
Cache invalidation.
```

A progressão é:

```text
dimensionar conexões;

usar cache por processo;

compartilhar cache
entre réplicas;

aprofundar invalidação.
```

Nesta aula:

```text
Redis:
sim.

Spring Data Redis:
sim.

RedisCacheManager:
sim.

Docker Compose:
sim.

namespace:
sim.

prefixo:
sim.

TTL:
sim.

serialização:
sim.

timeout:
sim.

fallback:
sim.

métricas:
sim.

falha do Redis:
sim.

cache híbrido:
apenas comparação.

pub/sub de invalidação:
não.

outbox de invalidação:
não.

distributed lock:
não.

estratégia avançada de invalidação:
não.
```

Você reutilizará budgets, HikariCP, query count, banco, Caffeine, traces, logs, Prometheus, Grafana, carga, runbooks e Docker Compose.

O cache distribuído precisa preservar:

- contrato;
- autorização;
- source of truth;
- isolamento de tenant;
- compatibilidade entre versões;
- observabilidade;
- fallback;
- rollback;
- capacidade da origem.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/cache/redis
├── redis-cache-contract.yaml
├── redis-cache-catalog.yaml
├── redis-cache-topology-policy.yaml
├── redis-cache-key-policy.yaml
├── redis-cache-namespace-policy.yaml
├── redis-cache-ttl-policy.yaml
├── redis-cache-serialization-policy.yaml
├── redis-cache-connection-policy.yaml
├── redis-cache-timeout-policy.yaml
├── redis-cache-fallback-policy.yaml
├── redis-cache-stampede-policy.yaml
├── redis-cache-memory-policy.yaml
├── redis-cache-observability-policy.yaml
├── redis-cache-health-policy.yaml
├── redis-cache-regression-policy.yaml
├── redis-cache-data-quality-policy.yaml
├── redis-cache-security-policy.yaml
├── redis-cache-failure-policy.yaml
├── redis-cache-scenarios.yaml
└── redis-cache-evidence.yaml

performance/cache/redis/profiles
├── redis-disabled.properties
├── redis-standard.properties
├── redis-short-ttl.properties
├── redis-slow-network.properties
├── redis-unavailable.properties
└── redis-rollback.properties

performance/cache/redis/reports
├── redis-baseline-report.yaml
├── redis-hit-miss-report.yaml
├── redis-latency-report.yaml
├── redis-memory-report.yaml
├── redis-failure-report.yaml
├── redis-fallback-report.yaml
└── redis-gate-report.yaml

scripts/performance/cache/redis
├── validate-redis-cache-contract.ps1
├── validate-redis-installation.ps1
├── prepare-redis-laboratory.ps1
├── collect-redis-baseline.ps1
├── measure-redis-cache-hit-ratio.ps1
├── measure-redis-cache-latency.ps1
├── validate-redis-keyspace.ps1
├── validate-redis-serialization.ps1
├── validate-redis-ttl.ps1
├── validate-redis-timeouts.ps1
├── validate-redis-fallback.ps1
├── simulate-redis-cold-cache.ps1
├── simulate-redis-slow-network.ps1
├── simulate-redis-unavailable.ps1
├── simulate-redis-restart.ps1
├── simulate-redis-miss-storm.ps1
├── analyze-redis-memory.ps1
├── compare-redis-cache-profiles.ps1
├── enforce-redis-cache-budget.ps1
├── validate-redis-cache-rollback.ps1
├── scan-redis-cache-output.ps1
├── collect-redis-cache-evidence.ps1
└── verify-redis-cache-baseline.ps1

docs/performance/cache/redis
├── REDIS_CACHE_OVERVIEW.md
├── REDIS_TOPOLOGY_GUIDE.md
├── REDIS_KEYS_AND_NAMESPACES.md
├── REDIS_TTL_GUIDE.md
├── REDIS_SERIALIZATION_GUIDE.md
├── REDIS_CONNECTION_AND_TIMEOUTS.md
├── REDIS_FAILURE_AND_FALLBACK.md
├── REDIS_OBSERVABILITY_GUIDE.md
├── REDIS_CACHE_TEST_MATRIX.md
└── REDIS_CACHE_TROUBLESHOOTING.md
```

Ao final, você terá Redis local, catálogo, namespace versionado, chaves seguras, TTL, serialização, timeouts, fallback, falhas, rollback e evidence sanitizada.

Você irá subir Redis, configurar Spring, medir, simular falhas e executar o gate.

---

## Conceito essencial

- **Cache distribuído:** cache externo compartilhado por múltiplas instâncias.
- **Redis:** servidor em memória usado aqui como cache.
- **Namespace:** agrupamento lógico por aplicação, ambiente, versão e cache.
- **Key prefix:** prefixo que evita colisões.
- **Cache key:** identificador da entrada.
- **Cache value:** representação serializada armazenada.
- **Serialization:** conversão do objeto Java para formato persistido.
- **Deserialization:** reconstrução do objeto a partir do cache.
- **TTL:** tempo restante até a expiração.
- **Hit:** leitura atendida pelo Redis.
- **Miss:** chave ausente, expirada ou incompatível.
- **Network hop:** comunicação entre aplicação e Redis.
- **Redis latency:** tempo de comando e resposta.
- **Connection pool:** conexões Redis reutilizadas.
- **Cache outage:** indisponibilidade total ou parcial.
- **Fallback:** caminho alternativo pela origem.
- **Miss storm:** muitos misses simultâneos pressionando a origem.
- **Hot key:** chave muito mais acessada que as demais.
- **Key collision:** entradas distintas produzindo a mesma chave.
- **Schema version:** versão da representação armazenada.
- **Source of truth:** sistema autoritativo capaz de reconstruir o cache.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

docker compose `
  ps

git status

git diff --check
```

Confirme:

- aplicação compila;
- PostgreSQL está saudável;
- HikariCP voltou à baseline;
- cache Caffeine pode ser desabilitado;
- endpoint candidato está medido;
- nenhuma invalidação avançada será antecipada.

---

### 2. Adicionar Redis ao Docker Compose

Inclua:

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: kafka-orders-redis
    command:
      - redis-server
      - --appendonly
      - "no"
      - --save
      - ""
    ports:
      - "6379:6379"
    healthcheck:
      test:
        - CMD
        - redis-cli
        - ping
      interval: 5s
      timeout: 3s
      retries: 10
```

O laboratório usa Redis sem persistência.

A perda do container elimina o cache sem comprometer a origem.

Suba:

```powershell
docker compose `
  up `
  -d `
  redis
```

Valide:

```powershell
docker compose `
  ps `
  redis

docker compose `
  exec `
  redis `
  redis-cli `
  ping
```

Resultado esperado:

```text
PONG.
```

---

### 3. Adicionar dependência Spring Data Redis

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

Use versões gerenciadas pelo Spring Boot.

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

---

### 4. Configurar conexão local

No profile de laboratório:

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      connect-timeout: 500ms
      timeout: 800ms

  cache:
    type: redis
```

Os valores são didáticos; timeouts reais precisam caber no budget. Não inclua credenciais no Git.

---

### 5. Criar contrato de cache Redis

Arquivo:

```text
redis-cache-contract.yaml
```

Conteúdo:

```yaml
redisCache:
  required:
    - name
    - owner
    - source-of-truth
    - namespace
    - key
    - schema-version
    - serializer
    - ttl
    - timeout
    - fallback
    - metrics
    - rollback

  correctness:
    cacheCanBeEmpty:
      true

  forbidden:
    - source-of-truth-replacement
    - sensitive-key
    - unbounded-value
    - infinite-timeout
    - silent-fallback

  invalidationAdvanced:
    deferredToLesson584
```

---

### 6. Criar catálogo

Arquivo:

```text
redis-cache-catalog.yaml
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

    namespace:
      orders:lab:v1:order-status

    key:
      tenant-and-order-id

    value:
      OrderStatusSnapshotV1

    ttl:
      30s

    fallback:
      database

    invalidation:
      simple-evict-after-write

    productionValues:
      undefined
```

---

### 7. Criar política de topologia

Arquivo:

```text
redis-cache-topology-policy.yaml
```

Conteúdo:

```yaml
topology:
  laboratory:
    mode:
      standalone

  application:
    replicas:
      sharedCache:
        true

  sourceOfTruth:
    external:
      true

  restart:
    cacheLoss:
      acceptable

  persistence:
    requiredForCache:
      false

  productionTopology:
    undefined
```

Nesta aula, Redis standalone é suficiente para o laboratório.

Não faça afirmação de alta disponibilidade baseada em uma única instância.

---

### 8. Criar política de namespace

Arquivo:

```text
redis-cache-namespace-policy.yaml
```

Conteúdo:

```yaml
namespace:
  include:
    - application
    - environment
    - schema-version
    - cache-name

  format:
    separator:
      ":"

  productionAndLaboratory:
    shared:
      forbidden

  cacheNameCollision:
    forbidden

  migration:
    newSchemaUsesNewNamespace:
      true
```

Exemplo:

```text
orders:lab:v1:order-status
```

---

### 9. Criar política de chave

Arquivo:

```text
redis-cache-key-policy.yaml
```

Conteúdo:

```yaml
key:
  include:
    whenApplicable:
      - tenant-scope
      - resource-id
      - representation-version

  forbidden:
    - token
    - password
    - email
    - customer-name
    - raw-request
    - mutable-object

  length:
    bounded:
      required

  logging:
    rawKey:
      forbidden
```

A chave não deve carregar dados pessoais.

---

### 10. Criar chave tipada

Exemplo:

```java
public record RedisOrderStatusKey(
        String tenantId,
        UUID orderId) {

    public RedisOrderStatusKey {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(orderId);
    }

    public String externalForm() {
        return tenantId
                + ":"
                + orderId;
    }
}
```

A aplicação usa tipo interno e forma externa estável, sem logar a chave completa.

---

### 11. Criar valor versionado

Exemplo:

```java
public record OrderStatusSnapshotV1(
        UUID orderId,
        String status,
        Instant updatedAt,
        long sourceVersion) {
}
```

O sufixo `V1` documenta o schema. Mudanças incompatíveis exigem novo namespace ou tipo e nunca devem ser desserializadas silenciosamente.

---

### 12. Criar política de serialização

Arquivo:

```text
redis-cache-serialization-policy.yaml
```

Conteúdo:

```yaml
serialization:
  key:
    type:
      string

  value:
    format:
      JSON

    typeMetadata:
      explicit:
        required

  JavaNativeSerialization:
    forbidden

  unknownField:
    behavior:
      documented

  incompatibleSchema:
    action:
      cache-miss-and-reload

  sensitiveContent:
    forbidden
```

Serialização nativa Java não será usada.

---

### 13. Configurar `RedisCacheManager`

Crie:

```java
@Configuration
@EnableCaching
public class RedisCacheConfiguration {

    @Bean
    RedisCacheManager redisCacheManager(
            RedisConnectionFactory connectionFactory,
            ObjectMapper objectMapper) {

        RedisSerializer<String> keySerializer =
                new StringRedisSerializer();

        RedisSerializer<OrderStatusSnapshotV1>
                valueSerializer =
                new Jackson2JsonRedisSerializer<>(
                        objectMapper,
                        OrderStatusSnapshotV1.class);

        RedisSerializationContext
                .SerializationPair<String> keyPair =
                RedisSerializationContext
                        .SerializationPair
                        .fromSerializer(keySerializer);

        RedisSerializationContext
                .SerializationPair<OrderStatusSnapshotV1>
                valuePair =
                RedisSerializationContext
                        .SerializationPair
                        .fromSerializer(valueSerializer);

        RedisCacheConfiguration defaultConfiguration =
                RedisCacheConfiguration
                        .defaultCacheConfig()
                        .disableCachingNullValues()
                        .computePrefixWith(
                                cacheName ->
                                        "orders:lab:v1:"
                                                + cacheName
                                                + ":")
                        .serializeKeysWith(keyPair)
                        .serializeValuesWith(valuePair)
                        .entryTtl(Duration.ofSeconds(30));

        return RedisCacheManager
                .builder(connectionFactory)
                .cacheDefaults(defaultConfiguration)
                .build();
    }
}
```

A API pode variar por versão, mas o padrão permanece: serializer, prefixo e TTL explícitos, sem cache de `null`.

---

### 14. Criar política de TTL

Arquivo:

```text
redis-cache-ttl-policy.yaml
```

Conteúdo:

```yaml
ttl:
  requiredPerCache:
    true

  deriveFrom:
    - business-staleness
    - update-frequency
    - origin-capacity
    - miss-cost
    - failure-behavior

  infinite:
    forbidden

  zero:
    forbiddenWithoutReason

  jitter:
    evaluateForLargeKeySet:
      true

  exactProductionValue:
    undefined
```

TTL não substitui invalidação de escrita; o aprofundamento pertence à aula 584.

---

### 15. Validar TTL no Redis

Execute:

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  --scan `
  --pattern `
  "orders:lab:v1:*"
```

Para uma chave sintética:

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  TTL `
  "orders:lab:v1:order-status-by-id:synthetic"
```

TTL positivo indica segundos restantes, `-1` indica ausência de expiração e `-2` indica chave ausente. Chave de cache sem TTL bloqueia o gate.

---

### 16. Criar serviço de consulta

Exemplo:

```java
@Service
public class RedisOrderStatusQueryService {

    private final OrderStatusSource source;

    public RedisOrderStatusQueryService(
            OrderStatusSource source) {
        this.source = source;
    }

    @Cacheable(
            cacheNames = "order-status-by-id",
            key = "#tenantId + ':' + #orderId",
            unless = "#result == null",
            sync = true)
    public OrderStatusSnapshotV1 find(
            String tenantId,
            UUID orderId) {

        return source.load(
                tenantId,
                orderId);
    }
}
```

Valide o suporte de `sync` no provider e na configuração usada.

Não dependa apenas de anotação para resolver stampede distribuído.

---

### 17. Criar política de conexão

Arquivo:

```text
redis-cache-connection-policy.yaml
```

Conteúdo:

```yaml
connection:
  reuse:
    required

  creationPerRequest:
    forbidden

  pool:
    bounded:
      requiredWhenEnabled

  metrics:
    required:
      - active
      - idle
      - pending
      - creation
      - failure

  databaseAndRedisPools:
    independent:
      true
```

Redis e PostgreSQL possuem pools diferentes.

Saturação de um não deve ser confundida com o outro.

---

### 18. Criar política de timeout

Arquivo:

```text
redis-cache-timeout-policy.yaml
```

Conteúdo:

```yaml
timeout:
  connect:
    explicit:
      required

  command:
    explicit:
      required

  mustFit:
    remainingEndpointBudget

  longTimeout:
    risk:
      cacheBecomesCriticalPath

  timeoutFallback:
    explicit:
      required

  retry:
    forbiddenWithoutBudget
```

Cache é otimização.

Ele não deve segurar a requisição por mais tempo que a origem normalmente levaria.

---

### 19. Compor o budget

Exemplo didático:

```text
budget do endpoint:
250 ms.

Redis esperado:
5 ms.

timeout Redis:
40 ms.

origem:
120 ms.

margem:
90 ms.
```

Um timeout Redis de dois segundos destruiria o objetivo do cache.

Use valores compatíveis com ambiente, rede e operação.

---

### 20. Medir latência do Redis

Script:

```text
measure-redis-cache-latency.ps1
```

Registre:

- command latency p50;
- p95;
- p99;
- timeout;
- connection acquisition;
- cache hit endpoint p95;
- cache miss endpoint p95;
- source p95;
- release;
- profile.

Compare:

```text
Caffeine hit;

Redis hit;

database miss.
```

O Redis normalmente será mais lento que Caffeine por causa da rede, mas pode oferecer compartilhamento entre réplicas.

---

### 21. Criar política de fallback

Arquivo:

```text
redis-cache-fallback-policy.yaml
```

Conteúdo:

```yaml
fallback:
  cacheMiss:
    action:
      load-source

  cacheTimeout:
    action:
      load-source-when-budget-allows

  cacheUnavailable:
    action:
      load-source-and-protect

  sourceUnavailable:
    action:
      fail-according-to-api-contract

  staleValue:
    use:
      forbiddenWithoutExplicitPolicy

  observability:
    fallbackCounter:
      required
```

A origem precisa suportar fallback.

Se não suportar, proteções adicionais são necessárias.

---

### 22. Implementar fallback explícito

Para controle fino, use API nativa:

```java
@Service
public class RedisOrderStatusGateway {

    private final RedisTemplate<String,
            OrderStatusSnapshotV1> redisTemplate;

    private final OrderStatusSource source;

    public OrderStatusSnapshotV1 find(
            RedisOrderStatusKey key) {

        String redisKey =
                "orders:lab:v1:order-status:"
                        + key.externalForm();

        try {
            OrderStatusSnapshotV1 cached =
                    redisTemplate
                            .opsForValue()
                            .get(redisKey);

            if (cached != null) {
                return cached;
            }
        } catch (RedisConnectionFailureException
                 | QueryTimeoutException exception) {
            recordFallback(exception);
        }

        OrderStatusSnapshotV1 loaded =
                source.load(
                        key.tenantId(),
                        key.orderId());

        try {
            redisTemplate
                    .opsForValue()
                    .set(
                            redisKey,
                            loaded,
                            Duration.ofSeconds(30));
        } catch (RedisConnectionFailureException
                 | QueryTimeoutException exception) {
            recordWriteFailure(exception);
        }

        return loaded;
    }
}
```

A consulta continua correta quando a escrita no cache falha.

---

### 23. Evitar fallback silencioso

Registre timeout, falhas de conexão, leitura e escrita, fallback, origem e impacto no endpoint. Logs usam categoria e cache name, sem chave bruta.

---

### 24. Criar política de stampede

Arquivo:

```text
redis-cache-stampede-policy.yaml
```

Conteúdo:

```yaml
stampede:
  scenarios:
    required:
      - cold-cache
      - popular-key-expired
      - redis-restart
      - mass-eviction

  protection:
    allowed:
      - local-single-flight
      - bounded-concurrency
      - TTL-jitter
      - source-rate-protection

  distributedLock:
    deferred:
      true

  sourceCapacity:
    validate:
      required
```

Use proteção local por réplica e concorrência limitada; distributed lock não será implementado.

---

### 25. Criar single-flight local

Exemplo conceitual:

```java
@Component
public class LocalLoadCoordinator {

    private final ConcurrentHashMap<String,
            CompletableFuture<OrderStatusSnapshotV1>>
            inFlight =
            new ConcurrentHashMap<>();

    public OrderStatusSnapshotV1 load(
            String safeKey,
            Supplier<OrderStatusSnapshotV1> loader) {

        CompletableFuture<OrderStatusSnapshotV1> future =
                inFlight.computeIfAbsent(
                        safeKey,
                        ignored ->
                                CompletableFuture.supplyAsync(
                                        loader));

        try {
            return future.join();
        } finally {
            inFlight.remove(
                    safeKey,
                    future);
        }
    }
}
```

O exemplo precisa de executor limitado, timeout e tratamento de falha.

Ele coordena apenas dentro da mesma réplica.

---

### 26. Simular miss storm

Script:

```text
simulate-redis-miss-storm.ps1
```

Cenário:

```text
Redis vazio;

4 réplicas simuladas;

100 requests concorrentes;

mesma chave;

origem com 150 ms.
```

Meça:

- Redis misses;
- loads na origem;
- HikariCP active;
- query count;
- source p95;
- endpoint p95;
- timeouts;
- fallback count.

Compare sem e com single-flight local.

---

### 27. Criar política de memória Redis

Arquivo:

```text
redis-cache-memory-policy.yaml
```

Conteúdo:

```yaml
memory:
  measure:
    - used-memory
    - used-memory-peak
    - key-count
    - average-value-size
    - expired-keys
    - evicted-keys

  maxmemory:
    laboratory:
      documented

  evictionPolicy:
    production:
      undefined

  oversizedValue:
    forbidden

  noTTLKey:
    block:
      true
```

A aula não definirá política de produção.

No laboratório, a memória será observada e limitada pelo ambiente Docker quando necessário.

---

### 28. Inspecionar memória

Execute:

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  INFO `
  memory
```

Observe:

```text
used_memory;

used_memory_human;

used_memory_peak;

mem_fragmentation_ratio.
```

Também:

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  INFO `
  stats
```

Observe:

```text
keyspace_hits;

keyspace_misses;

expired_keys;

evicted_keys;
```

---

### 29. Analisar memória

Script:

```text
analyze-redis-memory.ps1
```

Registre keys por namespace, memória, pico, tamanho estimado, expired, evicted, hit ratio, miss ratio, cobertura de TTL e profile.

---

### 30. Criar política de observabilidade

Arquivo:

```text
redis-cache-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  cache:
    required:
      - hits
      - misses
      - load
      - fallback
      - read-failure
      - write-failure
      - timeout

  Redis:
    required:
      - command-latency
      - connections
      - memory
      - keys
      - expired
      - evicted

  source:
    correlate:
      - query-count
      - HikariCP-active
      - database-cpu

  labels:
    forbidden:
      - key
      - tenant
      - order-id
      - customer-id
```

---

### 31. Criar política de health

Arquivo:

```text
redis-cache-health-policy.yaml
```

Conteúdo:

```yaml
health:
  cacheDependency:
    readiness:
      evaluateByArchitecture

  liveness:
    RedisFailure:
      mustNotRestartApplicationAutomatically

  degradedMode:
    observable:
      required

  healthCheck:
    cannotOverloadRedis:
      true

  sourceCapacity:
    requiredForDegradedMode:
      true
```

Se Redis é opcional, sua indisponibilidade não deve matar automaticamente a aplicação; a decisão de readiness precisa ser explícita.

---

### 32. Validar health

Cenários:

```text
Redis saudável;

Redis lento;

Redis indisponível;

Redis retorna;

origem saudável;

origem degradada.
```

Valide:

- health endpoint;
- readiness;
- liveness;
- logs;
- métricas;
- fallback;
- recuperação.

Evite restart loop causado por cache opcional.

---

### 33. Criar política de segurança

Arquivo:

```text
redis-cache-security-policy.yaml
```

Conteúdo:

```yaml
security:
  network:
    exposure:
      local-only-in-laboratory

  credentials:
    repository:
      forbidden

  TLS:
    production:
      evaluate

  key:
    sensitiveData:
      forbidden

  value:
    minimize:
      required

  commands:
    dangerous:
      forbiddenWithoutAuthorization

  logs:
    rawValue:
      forbidden
```

Não exponha o Redis além do necessário.

---

### 34. Proibir comandos perigosos

Não use `FLUSHALL`, `FLUSHDB` ou `KEYS *` em ambiente compartilhado. Prefira `SCAN` e limpeza pelo prefixo do laboratório.

---

### 35. Criar limpeza por namespace

Script seguro:

```powershell
$pattern = "orders:lab:v1:*"

$keys = docker compose exec -T redis `
    redis-cli `
    --scan `
    --pattern $pattern

foreach ($key in $keys) {
    docker compose exec -T redis `
        redis-cli `
        UNLINK `
        $key
}
```

Use `UNLINK` para remoção assíncrona quando disponível.

Valide o ambiente e o prefixo antes de executar.

---

### 36. Criar política de falha

Arquivo:

```text
redis-cache-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  scenarios:
    required:
      - timeout
      - connection-refused
      - restart
      - cold-cache
      - serialization-error
      - memory-pressure
      - miss-storm

  correctness:
    preserve:
      required

  fallback:
    bounded:
      required

  retries:
    limited:
      required

  cacheFailure:
    cannotCorruptSource:
      true

  invalidationAdvanced:
    deferredToLesson584
```

---

### 37. Simular Redis indisponível

Script:

```text
simulate-redis-unavailable.ps1
```

Fluxo:

1. aquecer cache;
2. executar workload leve;
3. parar Redis local;
4. observar timeout;
5. observar fallback;
6. medir banco;
7. validar resposta;
8. iniciar Redis;
9. validar recuperação;
10. coletar evidence.

Pare:

```powershell
docker compose `
  stop `
  redis
```

Inicie:

```powershell
docker compose `
  start `
  redis
```

---

### 38. Simular rede lenta

Script:

```text
simulate-redis-slow-network.ps1
```

Use apenas mecanismo local controlado.

Valide:

- command p95;
- timeout;
- fallback;
- request p95;
- pending do cliente Redis;
- HikariCP;
- banco;
- recovery.

Não conclua que Redis está saudável apenas porque responde.

---

### 39. Simular restart

Script:

```text
simulate-redis-restart.ps1
```

Confirme:

- perda de chaves;
- aumento de misses;
- warmup gradual;
- fallback;
- ausência de corrupção;
- recuperação das métricas;
- estabilidade do banco.

Restart não deve exigir restart da aplicação.

---

### 40. Simular serialização incompatível

Grave uma representação sintética incompatível no namespace de teste.

Valide:

- erro de desserialização;
- métrica;
- entrada descartada ou tratada como miss;
- reload da origem;
- ausência de loop;
- ausência de exposição de payload.



---

### 41. Criar política de regressão

Arquivo:

```text
redis-cache-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - endpoint-latency
    - Redis-latency
    - hit-ratio
    - query-count
    - HikariCP-active
    - database-cpu
    - fallback-rate
    - timeout-rate
    - memory
    - serialization-errors

  absoluteBudget:
    required

  relativeBudget:
    required

  APIImprovementWithFailureRegression:
    reject:
      true

  sourceOverloadOnCacheFailure:
    reject:
      true
```

---

### 42. Criar política de qualidade

Arquivo:

```text
redis-cache-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingBaseline:
    action:
      block-comparison

  unknownNamespace:
    action:
      block-operation

  missingTTL:
    action:
      fail-gate

  mixedEnvironment:
    action:
      block-cleanup

  staleMetrics:
    action:
      recollect

  singleRun:
    result:
      inconclusive

  unknownSourceCapacity:
    result:
      limited-fallback-confidence
```

---

### 43. Criar cenários

Arquivo:

```text
redis-cache-scenarios.yaml
```

Cenários:

```text
cache-disabled-baseline;

cold-cache;

shared-hit-between-replicas;

TTL-expiration;

namespace-isolation;

schema-version-change;

serialization-error;

Redis-timeout;

Redis-unavailable;

Redis-restart;

slow-network;

miss-storm;

hot-key;

memory-growth;

no-TTL-key-forbidden;

fallback-success;

fallback-overloads-source;

rollback-to-no-cache.
```

Cada cenário registra profile, namespace, workload, estado do Redis e origem, latência, hit/miss, fallback, impacto no banco, resultado, rollback e evidence.

---

### 44. Validar compartilhamento entre réplicas

Execute duas instâncias em portas diferentes.

Fluxo:

1. limpar namespace do laboratório;
2. consultar na réplica A;
3. confirmar load da origem;
4. consultar a mesma chave na réplica B;
5. confirmar hit no Redis;
6. comparar query count;
7. confirmar contrato;
8. coletar métricas.

Esse é o benefício central do cache distribuído.

---

### 45. Validar namespace

Script:

```text
validate-redis-keyspace.ps1
```

Confirme:

- prefixo correto;
- ambiente correto;
- versão correta;
- cache name correto;
- ausência de chave sem TTL;
- ausência de dados pessoais;
- ausência de colisão;
- quantidade dentro do esperado.

Não imprima valores.

---

### 46. Validar serialização

Script:

```text
validate-redis-serialization.ps1
```

Cenários:

- valor válido;
- campo adicional;
- campo ausente;
- versão incompatível;
- payload corrompido;
- tipo inesperado;
- valor grande;
- dado sensível.

Resultado:

```text
PASS;

MISS_AND_RELOAD;

FAIL_SCHEMA;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 47. Validar timeouts

Script:

```text
validate-redis-timeouts.ps1
```

Valide:

- connect timeout;
- command timeout;
- pool acquisition;
- budget restante;
- fallback;
- timeout metric;
- trace;
- logs;
- recovery.

Timeout não pode causar retry ilimitado.

---

### 48. Validar fallback

Script:

```text
validate-redis-fallback.ps1
```

Compare:

```text
Redis hit;

Redis miss;

Redis timeout;

Redis unavailable;

source slow;

source unavailable.
```

A resposta precisa seguir o contrato da API em cada caso.

---

### 49. Comparar perfis

Script:

```text
compare-redis-cache-profiles.ps1
```

Compare:

```text
redis-disabled;

redis-standard;

redis-short-ttl;

redis-slow-network;

redis-unavailable;

redis-rollback.
```

Registre:

- config;
- endpoint p95;
- Redis p95;
- hit ratio;
- query count;
- HikariCP active;
- DB CPU;
- fallback;
- timeout;
- memory;
- decision.

---

### 50. Criar relatório baseline

Arquivo:

```text
redis-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  profile:
    redis-disabled

  endpoint:
    GET /orders/{id}/status

  workload:
    repeated-read-multi-replica

  metrics:
    latencyP95Ms:
      95

    queryCount:
      1000

    poolActiveP95:
      8

  source:
    healthy

  result:
    baseline-approved
```

---

### 51. Criar relatório com Redis

Arquivo:

```text
redis-hit-miss-report.yaml
```

Exemplo:

```yaml
cache:
  profile:
    redis-standard

  topology:
    standalone-laboratory

  metrics:
    hitRatio:
      high

    RedisP95:
      within-budget

    endpointP95:
      improved

    queryReduction:
      substantial

    fallbackRate:
      low

  correctness:
    sourceOfTruth:
      preserved

  result:
    candidate-approved-in-laboratory
```

---

### 52. Criar gate

Script:

```text
enforce-redis-cache-budget.ps1
```

Valide:

- namespace;
- TTL;
- serializer;
- hit ratio;
- Redis latency;
- endpoint latency;
- query count;
- HikariCP;
- banco;
- fallback;
- timeout;
- memory;
- serialization errors;
- security;
- rollback.

Status:

```text
PASS;

FAIL_TTL;

FAIL_NAMESPACE;

FAIL_SERIALIZATION;

FAIL_TIMEOUT;

FAIL_FALLBACK;

FAIL_SOURCE_OVERLOAD;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 53. Validar rollback

Script:

```text
validate-redis-cache-rollback.ps1
```

Procedimento:

1. executar com Redis;
2. coletar métricas;
3. ativar profile sem cache;
4. reiniciar aplicação;
5. consultar a origem;
6. confirmar correção;
7. confirmar ausência de dependência de Redis;
8. comparar baseline;
9. preservar evidence;
10. limpar namespace.

O sistema precisa operar sem Redis.

---

### 54. Criar matriz de testes

Arquivo:

```text
REDIS_CACHE_TEST_MATRIX.md
```

Cenários:

- Docker Compose;
- healthcheck;
- Spring Data Redis;
- RedisCacheManager;
- prefixo;
- namespace;
- key isolation;
- schema version;
- JSON serializer;
- TTL;
- no-TTL forbidden;
- hit;
- miss;
- multi-replica hit;
- connection reuse;
- connect timeout;
- command timeout;
- fallback;
- read failure;
- write failure;
- miss storm;
- local single-flight;
- hot key;
- slow network;
- unavailable;
- restart;
- cold cache;
- memory;
- expired keys;
- evicted keys;
- health;
- security scan;
- rollback;
- evidence sanitizada.

---

### 55. Criar troubleshooting

Arquivo:

```text
REDIS_CACHE_TROUBLESHOOTING.md
```

Inclua:

- aplicação não conecta;
- healthcheck falha;
- timeout alto;
- timeout baixo;
- hit ratio zero;
- prefixo incorreto;
- chave sem TTL;
- serialização falha;
- tipo incompatível;
- valor grande;
- cache compartilhado não funciona;
- Redis lento;
- fallback sobrecarrega banco;
- restart causa miss storm;
- métricas divergem;
- memória cresce;
- evicted keys aumentam;
- chave contém dado sensível;
- cleanup aponta para ambiente errado;
- invalidação avançada antecipada.

---

### 56. Coletar evidence

Script:

```text
collect-redis-cache-evidence.ps1
```

Arquivo:

```text
redis-cache-evidence.yaml.
```

A evidence registra apenas aula, ambiente, serviço, release e status sanitizados de topologia, namespace, schema, serialização, TTL, conexão, timeout, hits, latência, fallback, origem, memória, health, recovery, rollback, segurança, gate e testes.

Não inclua chave, valor, tenant, order ID, hostname, senha, URL completa, payload Redis, configuração de produção ou estratégia da aula 584.

---

### 57. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\cache\redis\validate-redis-cache-contract.ps1

.\scripts\performance\cache\redis\validate-redis-installation.ps1

.\scripts\performance\cache\redis\prepare-redis-laboratory.ps1

.\scripts\performance\cache\redis\collect-redis-baseline.ps1

.\scripts\performance\cache\redis\measure-redis-cache-hit-ratio.ps1

.\scripts\performance\cache\redis\measure-redis-cache-latency.ps1

.\scripts\performance\cache\redis\validate-redis-keyspace.ps1

.\scripts\performance\cache\redis\validate-redis-serialization.ps1

.\scripts\performance\cache\redis\validate-redis-ttl.ps1

.\scripts\performance\cache\redis\validate-redis-timeouts.ps1

.\scripts\performance\cache\redis\validate-redis-fallback.ps1

.\scripts\performance\cache\redis\simulate-redis-cold-cache.ps1

.\scripts\performance\cache\redis\simulate-redis-slow-network.ps1

.\scripts\performance\cache\redis\simulate-redis-unavailable.ps1

.\scripts\performance\cache\redis\simulate-redis-restart.ps1

.\scripts\performance\cache\redis\simulate-redis-miss-storm.ps1

.\scripts\performance\cache\redis\analyze-redis-memory.ps1

.\scripts\performance\cache\redis\compare-redis-cache-profiles.ps1

.\scripts\performance\cache\redis\enforce-redis-cache-budget.ps1

.\scripts\performance\cache\redis\validate-redis-cache-rollback.ps1

.\scripts\performance\cache\redis\scan-redis-cache-output.ps1

.\scripts\performance\cache\redis\collect-redis-cache-evidence.ps1

.\scripts\performance\cache\redis\verify-redis-cache-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- Redis saudável;
- catálogo aprovado;
- namespace aprovado;
- chave aprovada;
- schema version aprovado;
- serialização aprovada;
- TTL aprovado;
- conexão aprovada;
- timeout aprovado;
- compartilhamento entre réplicas aprovado;
- fallback aprovado;
- miss storm analisado;
- memória analisada;
- health aprovado;
- falhas simuladas;
- recovery validado;
- rollback aprovado;
- segurança aprovada;
- evidence sanitizada;
- invalidação avançada não antecipada.

---

### 58. Encerrar o laboratório

Pare workloads.

Limpe somente o namespace do laboratório.

Depois:

```powershell
docker compose `
  stop `
  redis
```

Remova artifacts temporários:

```powershell
Remove-Item `
  .tmp/redis-cache `
  -Recurse `
  -Force
```

Preserve:

- policies;
- reports;
- scripts;
- docs;
- evidence sanitizada;
- compose versionado.

Confirme que nenhuma chave ou valor foi incluído no Git.

---

## Entendendo o que foi feito

- O cache passou a ser compartilhado entre réplicas.
- Rede, serialização, conexão e timeout entraram no budget.
- Namespace e schema version passaram a evitar colisões.
- Serializer explícito passou a controlar compatibilidade.
- TTL obrigatório passou a impedir permanência indefinida.
- Fallback preservou correção e tornou a pressão na origem observável.
- Cold cache e restart passaram a ser avaliados como miss storm.
- Memória foi transferida do heap local para uma dependência externa mensurável.
- Health separou cache opcional de liveness da aplicação.
- Rollback comprovou operação correta sem Redis.
- A aula 584 aprofundará eventos, races e mecanismos de invalidação.

---

## Erros comuns importantes

### Tratar Redis como fonte da verdade

A perda do cache não pode destruir o estado autoritativo.

### Usar timeout longo

O cache vira caminho crítico mais lento que a origem.

### Não versionar namespace

Deploys incompatíveis podem ler valores antigos.

### Usar serialização Java nativa

Compatibilidade e segurança ficam frágeis.

### Criar chave com dado pessoal

Logs, dumps e inspeções podem expor informações.

### Ignorar TTL

Chaves podem permanecer indefinidamente.

### Fazer retry ilimitado

Falha no Redis vira amplificação.

### Não medir fallback

O banco pode saturar durante outage do cache.

### Usar `FLUSHALL`

Outros namespaces podem ser removidos.

### Antecipar invalidação complexa

Outbox, pub/sub e races pertencem à aula 584.

---

## Comandos úteis

### Validar Redis

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  ping
```

### Listar chaves do laboratório

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  --scan `
  --pattern `
  "orders:lab:v1:*"
```

### Consultar memória

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  INFO `
  memory
```

### Medir latência

```powershell
.\scripts\performance\cache\redis\measure-redis-cache-latency.ps1
```

### Executar gate

```powershell
.\scripts\performance\cache\redis\enforce-redis-cache-budget.ps1
```

---

## Exercício guiado

### Parte 1 — Infraestrutura

Suba Redis e valide healthcheck.

### Parte 2 — Spring

Configure conexão e `RedisCacheManager`.

### Parte 3 — Namespace

Defina ambiente, versão e cache name.

### Parte 4 — Serialization

Use chave String e valor JSON tipado.

### Parte 5 — TTL

Valide expiração e proíba chave sem TTL.

### Parte 6 — Multi-replica

Comprove hit compartilhado entre instâncias.

### Parte 7 — Timeouts

Teste conexão, comando e budget.

### Parte 8 — Fallback

Simule timeout, indisponibilidade e restart.

### Parte 9 — Observability

Meça hits, misses, Redis, banco e memória.

### Parte 10 — Gate

Valide segurança, rollback e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 582 e ponte para a aula 584 foram preservadas;
- cache distribuído, Redis, namespace, prefixo, schema version, serializer, TTL, network hop, fallback, miss storm e source of truth foram definidos;
- Redis foi adicionado ao Docker Compose com healthcheck e sem persistência no laboratório;
- Spring Data Redis e Spring Cache foram configurados com timeouts explícitos;
- contrato, catálogo, topologia, namespace, chave, TTL, serialização, conexão, timeout, fallback, memória, observabilidade, health, segurança e failure policies foram criados;
- namespace inclui aplicação, ambiente, versão e cache;
- chaves são bounded, isoladas e sem dados pessoais;
- valores usam JSON tipado e schema explícito; serialização Java nativa foi proibida;
- `RedisCacheManager` usa prefixo, serializer e TTL explícitos;
- chaves sem TTL bloqueiam o gate;
- hit compartilhado entre duas réplicas foi comprovado;
- pool Redis e pool JDBC foram diferenciados;
- hit Caffeine, hit Redis e miss no banco foram comparados;
- connect e command timeouts cabem no budget;
- fallback é explícito, observável e preserva a resposta correta;
- falha de escrita no cache não corrompe a origem;
- retry ilimitado foi proibido;
- cold cache, miss storm, Redis lento, indisponível, reiniciado e serialização incompatível foram simulados;
- impacto em HikariCP, banco, latência e memória foi medido;
- health, readiness, liveness e degraded mode foram avaliados;
- comandos globais destrutivos foram proibidos e cleanup usa somente o namespace do laboratório;
- regressões, recuperação e rollback sem Redis foram validados;
- cenários, matriz, troubleshooting e evidence sanitizada estão presentes;
- nenhuma chave, valor, credencial, URL completa ou configuração real foi commitada;
- invalidação avançada não foi antecipada;
- commit, diário de bordo e regra final estão presentes.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/cache/redis `
  scripts/performance/cache/redis `
  docs/performance/cache/redis `
  docker-compose.yml `
  pom.xml `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|redis://|tenantId|orderId|cacheKey|cacheValue|FLUSHALL|FLUSHDB|distributedLock|keyspaceNotification"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar cache distribuido com Redis"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- chaves;
- valores;
- credenciais;
- URLs completas;
- dados pessoais;
- dumps Redis;
- artifacts temporários;
- configuração de produção;
- estratégia avançada de invalidação;
- material da aula 584.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você moveu a cópia temporária para um cache compartilhado entre réplicas.

Você trabalhou com:

```text
Redis;

Docker Compose;

Spring Data Redis;

RedisCacheManager;

namespace;

prefixo;

schema version;

serialização JSON;

TTL;

timeouts;

fallback;

miss storm;

memória;

health;

falhas;

rollback.
```

Você comprovou que Redis adiciona rede, serialização e uma nova dependência operacional; namespace e schema version evitam colisões e incompatibilidades; TTL precisa ser obrigatório; timeout deve caber no budget; fallback precisa preservar correção e proteger a origem; restart produz cold cache e miss storm; health de cache opcional não deve criar restart loop; e o sistema precisa continuar correto quando Redis está vazio ou indisponível.

A próxima aula será:

```text
584 - M18.29 - Cache invalidation
```

Nela, você irá aprofundar invalidação por evento, após commit, entre serviços e réplicas, com versionamento, races, outbox, pub/sub, tombstones, reparação e testes de consistência.

Nenhuma estratégia avançada de outbox, pub/sub de invalidação, tombstone, version token, invalidação remota, race resolution ou reparação de cache foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Subi Redis local.
- [ ] Configurei Spring Data Redis.
- [ ] Criei namespace versionado.
- [ ] Usei serialização explícita.
- [ ] Validei TTL.
- [ ] Comprovei hit entre réplicas.
- [ ] Simulei falhas e fallback.
- [ ] Validei rollback e evidence.

---

## Troubleshooting adicional

### Redis não responde

Valide container, porta, healthcheck e logs locais.

### Hit ratio está zero

Revise cache manager, prefixo, chave, serializer e TTL.

### Chave sem TTL

Bloqueie o gate e corrija a configuração.

### Desserialização falha após deploy

Use novo namespace ou schema e recarregue a origem.

### Redis está mais lento que o banco

Revise rede, payload, timeout e o candidato.

### Fallback pressiona HikariCP

A origem não suporta a outage integral; aplique proteção e capacity review.

### Restart causa pico

O cache ficou frio; faça warmup gradual.

### Réplicas não compartilham hit

Confirme Redis, namespace, cache name, chave e profile.

### Cleanup encontrou chave inesperada

Pare e valide ambiente e prefixo.

### Surgiu pub/sub de invalidação

Preserve-o para a aula 584.

---

## Perguntas de revisão

1. O que é cache distribuído?
2. Qual diferença para cache local?
3. Por que Redis adiciona network hop?
4. O que é namespace?
5. Por que versionar o schema?
6. Por que usar serializer explícito?
7. O que é TTL?
8. Por que proibir chave sem TTL?
9. O que é miss storm?
10. O que é cache outage amplification?
11. Como funciona fallback?
12. Por que timeout deve ser curto?
13. O que medir no Redis?
14. Por que observar o banco durante outage?
15. Como validar compartilhamento entre réplicas?
16. Por que não usar `FLUSHALL`?
17. Como tratar payload incompatível?
18. O sistema pode depender do cache para correção?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Cache externo compartilhado.
2. Um é por processo; outro é comum às réplicas.
3. Existe comunicação pela rede.
4. Prefixo lógico de isolamento.
5. Evitar leitura de formato incompatível.
6. Garantir formato, tipo e compatibilidade.
7. Tempo até expiração.
8. Evitar permanência indefinida.
9. Muitos misses simultâneos.
10. Outage do cache pressiona a origem.
11. Consulta a fonte da verdade.
12. Cache não deve dominar a jornada.
13. Latência, conexões, memória, hits, misses e evictions.
14. O fallback pode saturá-lo.
15. Load em A e hit em B.
16. Pode remover outros namespaces.
17. Tratar como miss ou falha controlada.
18. Não; a origem permanece autoritativa.
19. Cache invalidation.
20. Cache invalidation.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 583 - M18.28 - Cache distribuido Redis

- Continuei após Cache local Caffeine.
- Mantive PostgreSQL como fonte da verdade.
- Subi Redis sem persistência no Docker Compose.
- Adicionei Spring Data Redis e Spring Cache.
- Configurei conexão e timeouts.
- Criei contrato, catálogo, topologia e namespace versionado.
- Usei chaves seguras e valores JSON tipados.
- Proibi serialização Java nativa.
- Configurei `RedisCacheManager` com prefixo e TTL.
- Validei TTL e compartilhamento entre réplicas.
- Diferenciei pool Redis e pool JDBC.
- Comparei hit local, hit Redis e miss no banco.
- Criei fallback explícito.
- Simulei miss storm, lentidão, indisponibilidade e restart.
- Analisei memória, hits, misses, expired e evicted.
- Validei health, recuperação e rollback sem Redis.
- Coletei evidence sanitizada.
- Não antecipei invalidação avançada.
- Próxima aula: Cache invalidation.
```

---

## Referência técnica curta

- Redis as distributed cache.
- Spring Data Redis.
- Spring Cache with Redis.
- Redis key namespaces.
- Redis TTL.
- JSON serialization.
- Redis command latency.
- Cache fallback.
- Miss storm protection.
- Redis memory metrics.

Regra final:

```text
cache distribuído Redis precisa ser tratado como cópia temporária compartilhada, não como fonte da verdade: cada cache possui namespace versionado, chave segura, valor com schema explícito, serializer conhecido, TTL obrigatório, timeouts compatíveis com o budget, fallback observável e rollback para operação sem cache; hits entre réplicas reduzem consultas, mas a rede, o pool Redis, a serialização e a indisponibilidade entram no caminho crítico, por isso misses, timeouts, falhas de leitura ou escrita, memória, expired, evicted, HikariCP e banco são correlacionados; restart ou outage podem criar miss storm e amplificar carga na origem, exigindo proteção local, concorrência limitada e capacity review, enquanto comandos globais, chaves sensíveis, serialização Java nativa e cache sem TTL são proibidos; a aplicação permanece correta com Redis vazio ou indisponível, deixando para a aula 584 a invalidação avançada por eventos, outbox, pub/sub, version tokens, tombstones, races e reparação de consistência.
```
