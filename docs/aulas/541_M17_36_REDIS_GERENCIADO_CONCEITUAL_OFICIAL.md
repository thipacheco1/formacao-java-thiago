# 541 - M17.36 - Redis gerenciado conceitual

## Apresentação da aula

Na aula 540, você modelou integração assíncrona com Amazon SQS e Amazon SNS.

A aplicação passou a distinguir:

```text
commands;

events;

queues;

topics;

subscriptions;

fan-out;

retry;

dead-letter queue;

idempotência;

observabilidade.
```

Essa arquitetura reduz acoplamento entre responsabilidades.

Entretanto, existem problemas de desempenho e coordenação que não devem ser resolvidos apenas com banco relacional ou mensageria.

Exemplos:

```text
consulta repetida
com alto custo;

sessão temporária;

rate limit;

resultado calculado;

token de curta duração;

lock coordenado;

deduplicação temporária;

contador operacional.
```

A pergunta central desta aula será:

```text
como usar
Redis gerenciado

para acelerar
e coordenar
uma aplicação backend

sem transformar
cache
em fonte de verdade?
```

A resposta será construída com um modelo conceitual de Redis gerenciado.

O foco não será memorizar comandos.

O foco será compreender:

- cache-aside;
- TTL;
- invalidation;
- eviction;
- stampede;
- hot keys;
- sessões;
- locks;
- rate limiting;
- idempotência temporária;
- replicação;
- failover;
- sharding;
- segurança;
- observabilidade;
- custo;
- comportamento da aplicação quando o cache falha.

A regra central será:

```text
cache acelera;

banco preserva
a verdade;

falha do cache
não deve destruir
o dado de negócio.
```

Nesta aula, nenhum serviço real será criado.

Não haverá:

- conta AWS;
- cluster;
- replication group;
- endpoint;
- senha;
- token;
- Security Group;
- subnet group;
- credencial;
- cobrança;
- acesso remoto;
- dado real;
- alteração de produção.

A prática será local, versionada e verificável.

Você criará:

- blueprint de cache gerenciado;
- contrato de cache-aside;
- política de TTL;
- política de invalidation;
- contrato de eviction;
- proteção contra stampede;
- matriz de uso permitido;
- abstrações Java;
- adapter em memória;
- profile Spring Boot;
- simulações offline;
- evidence sanitizada.

A próxima aula será:

```text
542 - M17.37 - Object Storage S3 conceitual
```

Por isso, nenhum bucket, objeto, signed URL, lifecycle ou CDN será criado antecipadamente.

---

## Onde estamos na formação

A sequência oficial é:

```text
539:
RDS PostgreSQL.

540:
SQS SNS.

541:
Redis gerenciado conceitual.

542:
Object Storage S3 conceitual.

543:
CDN CloudFront conceitual.
```

A aula 540 respondeu:

```text
como desacoplar
tarefas e eventos
com filas e tópicos?
```

A aula 541 responderá:

```text
como reduzir latência
e carga de dependências

sem perder
consistência,
segurança
e resiliência?
```

Nesta aula:

```text
Redis:
sim.

cache gerenciado:
sim.

cache-aside:
sim.

read-through:
conceitual.

write-through:
conceitual.

write-behind:
conceitual.

TTL:
sim.

invalidation:
sim.

eviction:
sim.

stampede:
sim.

hot key:
sim.

replicação:
sim.

failover:
sim.

sharding:
sim.

cluster mode:
conceitual.

sessões:
sim.

rate limiting:
sim.

locks:
sim.

idempotência temporária:
sim.

persistência Redis:
conceitual.

Spring Boot:
sim.

cluster real:
não.

S3:
não.
```

A regra operacional será:

```text
cache miss
consulta a fonte;

resultado válido
pode ser armazenado;

alteração de negócio
invalida ou atualiza
o cache;

falha do cache
degrada desempenho,
não integridade.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
cloud/aws/cache
├── managed-redis-blueprint.yaml
├── cache-use-case-matrix.yaml
├── cache-aside-contract.yaml
├── cache-ttl-policy.yaml
├── cache-invalidation-policy.yaml
├── cache-eviction-policy.yaml
├── cache-stampede-policy.yaml
├── cache-security-policy.yaml
├── cache-observability-contract.yaml
├── cache-cost-policy.yaml
└── cache-readiness-checklist.yaml

src/main/java/com/formacao/orders/integration/cache
├── CacheKey.java
├── CacheEntry.java
├── CachePort.java
├── CacheLookupResult.java
├── InMemoryCacheAdapter.java
└── CacheAsideService.java

src/main/resources
└── application-aws-cache.yml

scripts/cloud/aws/cache
├── validate-cache-blueprint.ps1
├── validate-cache-key-policy.ps1
├── validate-cache-ttl-policy.ps1
├── validate-cache-invalidation-policy.ps1
├── simulate-cache-aside.ps1
├── simulate-cache-stampede.ps1
├── simulate-cache-failure.ps1
├── simulate-eviction.ps1
├── collect-cache-evidence.ps1
└── verify-cache-baseline.ps1

docs/devops/aws-cache
├── REDIS_MANAGED_ARCHITECTURE.md
├── CACHE_ASIDE.md
├── TTL_AND_INVALIDATION.md
├── EVICTION_AND_MEMORY.md
├── STAMPEDE_AND_HOT_KEYS.md
├── SESSION_RATE_LIMIT_LOCKS.md
├── CACHE_SECURITY.md
├── CACHE_OBSERVABILITY.md
├── CACHE_TEST_MATRIX.md
└── CACHE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
casos de uso classificados;

fonte de verdade preservada;

cache-aside definido;

TTL por domínio;

invalidation explícita;

eviction documentada;

stampede controlada;

keys padronizadas;

Spring profile seguro;

simulações offline;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline local;
2. classificar casos de uso;
3. definir o que pode entrar no cache;
4. definir o que não pode;
5. criar blueprint;
6. criar padrão de keys;
7. criar contrato cache-aside;
8. definir TTL;
9. definir invalidation;
10. definir negative caching;
11. definir eviction;
12. tratar stampede;
13. tratar hot keys;
14. discutir sessões;
15. discutir rate limiting;
16. discutir locks;
17. discutir idempotência;
18. criar abstrações Java;
19. criar adapter em memória;
20. criar profile Spring Boot;
21. simular miss e hit;
22. simular expiração;
23. simular invalidation;
24. simular stampede;
25. simular eviction;
26. simular indisponibilidade;
27. validar segurança;
28. validar observabilidade;
29. coletar evidence;
30. executar gate;
31. commitar;
32. preparar a aula 542.

---

## Conceito essencial

### Cache

Armazenamento temporário usado para reduzir latência e carga.

---

### Source of truth

Sistema responsável pelo estado oficial do dado.

Nesta aula:

```text
PostgreSQL:
fonte de verdade.

Redis:
aceleração e coordenação.
```

---

### Cache hit

A chave foi encontrada e ainda está válida.

---

### Cache miss

A chave não foi encontrada ou expirou.

---

### TTL

Tempo máximo de vida de uma entrada.

---

### Invalidation

Remoção ou atualização de uma entrada quando o dado de origem muda.

---

### Eviction

Remoção automática de keys por política de memória.

---

### Cache-aside

A aplicação consulta o cache, busca a fonte em caso de miss e grava o resultado no cache.

---

### Stampede

Muitas requisições recalculam a mesma key após um miss ou expiração.

---

### Hot key

Key que concentra volume desproporcional de acessos.

---

### Sharding

Distribuição de keys entre múltiplos nós.

---

### Replication

Cópia de dados para redundância e leitura conforme a arquitetura.

---

### Failover

Promoção ou troca do nó responsável após falha.

---

### Distributed lock

Coordenação temporária entre processos por meio de uma key com validade.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- aplicação saudável;
- HPA ativo;
- PostgreSQL apenas modelado para AWS;
- SQS e SNS apenas simulados;
- nenhum serviço Redis real.

---

### 2. Classificar casos de uso

Arquivo:

```text
cloud/aws/cache/cache-use-case-matrix.yaml
```

Conteúdo:

```yaml
useCases:
  productReference:
    allowed:
      true

    sourceOfTruth:
      PostgreSQL

    pattern:
      cache-aside

    consistency:
      eventual

  orderById:
    allowed:
      conditional

    sourceOfTruth:
      PostgreSQL

    containsSensitiveData:
      reviewed

    invalidation:
      required

  authenticationCredential:
    allowed:
      false

  paymentAuthorization:
    allowed:
      false

  session:
    allowed:
      conditional

    ttl:
      required

  rateLimit:
    allowed:
      true

  distributedLock:
    allowed:
      conditional

    ttl:
      mandatory

  idempotency:
    allowed:
      conditional

    durableAlternative:
      preferredForCriticalEffects
```

---

### 3. Definir o que não entra no cache

A policy proíbe:

- senha;
- access token de longa duração;
- secret key;
- cartão;
- dado pessoal sem necessidade;
- objeto sem TTL;
- fonte única de pedido;
- estado financeiro definitivo;
- autorização de pagamento;
- migration state;
- conteúdo sem owner;
- key sem padrão;
- payload ilimitado.

Redis não deve virar banco genérico apenas porque oferece estruturas flexíveis.

---

### 4. Criar o blueprint

Arquivo:

```text
managed-redis-blueprint.yaml
```

Conteúdo:

```yaml
cache:
  engine:
    redisCompatible:
      required

  environment:
    production:
      private:
        true

      multiZone:
        required

      automaticFailover:
        required

  topology:
    replication:
      required

    sharding:
      decisionRequired

  security:
    encryptionInTransit:
      required

    encryptionAtRest:
      required

    authentication:
      required

    publicAccess:
      forbidden

  memory:
    maxMemoryPolicy:
      decisionRequired

  operations:
    backups:
      decisionRequired

    maintenanceWindow:
      required

    monitoring:
      required

  evidence:
    actualClusters:
      zero
```

---

### 5. Rede e endpoint

O cache gerenciado deve permanecer em subnets privadas.

A aplicação acessa o endpoint pela rede interna.

O Security Group permite apenas a porta aprovada a partir do Security Group da aplicação.

A policy proíbe:

```text
endpoint público;

CIDR aberto;

acesso residencial;

porta exposta;

credencial compartilhada.
```

A aplicação usa DNS.

Não fixa IP.

Em failover, o destino por trás do endpoint pode mudar.

---

### 6. Replicação e failover

Uma topologia gerenciada pode usar:

- primary;
- replicas;
- automatic failover;
- múltiplas zonas.

A aplicação precisa esperar:

- conexões interrompidas;
- reconexão;
- perda temporária de disponibilidade;
- eventual atraso de replica;
- falha de comandos em andamento.

O cache não deve ser usado como única fonte de um efeito crítico.

Failover pode perder dados muito recentes conforme a arquitetura e o momento da falha.

---

### 7. Sharding e cluster mode

Sharding distribui keys entre shards.

Benefícios:

- mais memória;
- mais throughput;
- distribuição de carga.

Custos:

- maior complexidade;
- operações multi-key limitadas;
- resharding;
- hot shards;
- client compatibility;
- observabilidade distribuída.

A baseline não ativará sharding por hábito.

A decisão depende de:

- volume;
- throughput;
- quantidade de keys;
- tamanho médio;
- crescimento;
- operações necessárias.

---

### 8. Criar padrão de keys

Arquivo:

```text
cache-key-policy.yaml
```

Padrão:

```text
<application>:<environment>:<domain>:<version>:<identifier>
```

Exemplos fictícios:

```text
orders:dev:order-summary:v1:order-example

orders:dev:rate-limit:v1:client-example

orders:dev:idempotency:v1:event-example
```

Regras:

- prefixo de aplicação;
- ambiente;
- domínio;
- versão;
- identificador sanitizado;
- sem dado pessoal em texto claro;
- sem tamanho ilimitado;
- sem wildcard destrutivo;
- owner documentado.

---

### 9. Criar `CacheKey`

Arquivo:

```text
CacheKey.java
```

Conteúdo:

```java
package com.formacao.orders.integration.cache;

public record CacheKey(
        String application,
        String environment,
        String domain,
        String version,
        String identifier
) {
    public CacheKey {
        application = requirePart(application, "application");
        environment = requirePart(environment, "environment");
        domain = requirePart(domain, "domain");
        version = requirePart(version, "version");
        identifier = requirePart(identifier, "identifier");
    }

    public String value() {
        return String.join(
                ":",
                application,
                environment,
                domain,
                version,
                identifier
        );
    }

    private static String requirePart(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " is required"
            );
        }

        if (value.contains(":")) {
            throw new IllegalArgumentException(
                    field + " must not contain ':'"
            );
        }

        return value;
    }
}
```

---

### 10. Criar entrada de cache

Arquivo:

```text
CacheEntry.java
```

Conteúdo:

```java
package com.formacao.orders.integration.cache;

import java.time.Instant;
import java.util.Objects;

public record CacheEntry<T>(
        T value,
        Instant createdAt,
        Instant expiresAt
) {
    public CacheEntry {
        value = Objects.requireNonNull(value, "value");
        createdAt = Objects.requireNonNull(
                createdAt,
                "createdAt"
        );
        expiresAt = Objects.requireNonNull(
                expiresAt,
                "expiresAt"
        );

        if (!expiresAt.isAfter(createdAt)) {
            throw new IllegalArgumentException(
                    "expiresAt must be after createdAt"
            );
        }
    }

    public boolean expiredAt(Instant instant) {
        return !expiresAt.isAfter(instant);
    }
}
```

---

### 11. Criar resultado de lookup

Arquivo:

```text
CacheLookupResult.java
```

Conteúdo:

```java
package com.formacao.orders.integration.cache;

public sealed interface CacheLookupResult<T>
        permits CacheLookupResult.Hit,
                CacheLookupResult.Miss {

    record Hit<T>(T value)
            implements CacheLookupResult<T> {
    }

    record Miss<T>()
            implements CacheLookupResult<T> {
    }
}
```

---

### 12. Criar porta de cache

Arquivo:

```text
CachePort.java
```

Conteúdo:

```java
package com.formacao.orders.integration.cache;

import java.time.Duration;

public interface CachePort {

    <T> CacheLookupResult<T> get(
            CacheKey key,
            Class<T> expectedType
    );

    void put(
            CacheKey key,
            Object value,
            Duration ttl
    );

    void evict(CacheKey key);
}
```

A regra de negócio depende da porta.

O adapter gerenciado futuro dependerá do client Redis.

---

### 13. Criar adapter em memória

Arquivo:

```text
InMemoryCacheAdapter.java
```

Conteúdo:

```java
package com.formacao.orders.integration.cache;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

public final class InMemoryCacheAdapter
        implements CachePort {

    private final Map<String, CacheEntry<Object>> entries =
            new ConcurrentHashMap<>();

    private final Clock clock;

    public InMemoryCacheAdapter(Clock clock) {
        this.clock = Objects.requireNonNull(clock, "clock");
    }

    @Override
    public <T> CacheLookupResult<T> get(
            CacheKey key,
            Class<T> expectedType
    ) {
        CacheEntry<Object> entry =
                entries.get(key.value());

        if (entry == null) {
            return new CacheLookupResult.Miss<>();
        }

        Instant now = clock.instant();

        if (entry.expiredAt(now)) {
            entries.remove(key.value(), entry);
            return new CacheLookupResult.Miss<>();
        }

        return new CacheLookupResult.Hit<>(
                expectedType.cast(entry.value())
        );
    }

    @Override
    public void put(
            CacheKey key,
            Object value,
            Duration ttl
    ) {
        Objects.requireNonNull(key, "key");
        Objects.requireNonNull(value, "value");
        Objects.requireNonNull(ttl, "ttl");

        if (ttl.isZero() || ttl.isNegative()) {
            throw new IllegalArgumentException(
                    "ttl must be positive"
            );
        }

        Instant createdAt = clock.instant();

        entries.put(
                key.value(),
                new CacheEntry<>(
                        value,
                        createdAt,
                        createdAt.plus(ttl)
                )
        );
    }

    @Override
    public void evict(CacheKey key) {
        entries.remove(key.value());
    }
}
```

---

### 14. Criar contrato cache-aside

Arquivo:

```text
cache-aside-contract.yaml
```

Conteúdo:

```yaml
cacheAside:
  read:
    sequence:
      - build-key
      - read-cache
      - return-on-hit
      - load-source-on-miss
      - store-with-ttl
      - return-source-value

  write:
    sequence:
      - validate-command
      - persist-source-of-truth
      - commit-transaction
      - invalidate-cache

  failure:
    cacheRead:
      fallbackToSource:
        true

    cacheWrite:
      failBusinessOperation:
        false

    sourceOfTruth:
      unavailable:
        failRequest:
          true
```

---

### 15. Criar serviço cache-aside

Arquivo:

```text
CacheAsideService.java
```

Conteúdo:

```java
package com.formacao.orders.integration.cache;

import java.time.Duration;
import java.util.Objects;
import java.util.function.Supplier;

public final class CacheAsideService {

    private final CachePort cachePort;

    public CacheAsideService(CachePort cachePort) {
        this.cachePort = Objects.requireNonNull(
                cachePort,
                "cachePort"
        );
    }

    public <T> T getOrLoad(
            CacheKey key,
            Class<T> expectedType,
            Duration ttl,
            Supplier<T> sourceLoader
    ) {
        CacheLookupResult<T> result =
                cachePort.get(key, expectedType);

        if (result instanceof CacheLookupResult.Hit<T> hit) {
            return hit.value();
        }

        T loaded = Objects.requireNonNull(
                sourceLoader.get(),
                "sourceLoader returned null"
        );

        cachePort.put(key, loaded, ttl);

        return loaded;
    }

    public void invalidate(CacheKey key) {
        cachePort.evict(key);
    }
}
```

Esse código demonstra o fluxo.

O adapter gerenciado precisa adicionar timeout, métricas, serialization e tratamento de falha.

---

### 16. Definir TTL

Arquivo:

```text
cache-ttl-policy.yaml
```

Conteúdo:

```yaml
ttl:
  defaults:
    forbidden:
      true

  domains:
    productReference:
      seconds:
        300

      jitterPercent:
        10

    orderSummary:
      seconds:
        30

      invalidation:
        required

    rateLimit:
      seconds:
        60

    session:
      decisionRequired

    idempotency:
      greaterThanReplayWindow:
        required

  permanentKey:
    forbidden:
      true
```

Os valores são didáticos.

TTL precisa ser aprovado conforme o domínio.

---

### 17. Jitter de TTL

Se milhares de keys expirarem no mesmo segundo, muitas requisições podem atingir o banco juntas.

Jitter adiciona pequena variação.

Exemplo:

```text
TTL base:
300 segundos.

jitter:
mais ou menos 10%.
```

O objetivo é distribuir expirações.

Jitter não substitui proteção de stampede.

---

### 18. Negative caching

Negative caching armazena temporariamente o resultado “não encontrado”.

Ele pode reduzir consultas repetidas para identificadores inexistentes.

Riscos:

- criação posterior permanece invisível até expirar;
- ataques geram grande quantidade de keys;
- TTL longo prejudica consistência.

A policy permite negative caching somente com:

- TTL curto;
- key validada;
- limite;
- observabilidade;
- invalidation quando aplicável.

---

### 19. Invalidation

Arquivo:

```text
cache-invalidation-policy.yaml
```

Conteúdo:

```yaml
invalidation:
  afterCommit:
    required

  beforeCommit:
    forbidden

  strategies:
    exactKey:
      preferred

    namespaceVersion:
      allowed

    wildcardDelete:
      forbidden

    fullFlush:
      forbidden

  failure:
    retry:
      bounded

    staleTolerance:
      domainDecisionRequired

    eventBasedInvalidation:
      allowed
```

A invalidation ocorre após o commit da fonte de verdade.

Invalidar antes do commit pode permitir que outra requisição recarregue o valor antigo.

---

### 20. Event-driven invalidation

Um evento pode informar que o dado mudou.

Exemplo:

```text
OrderUpdated
→ consumer de cache
→ evict order summary.
```

Esse modelo é assíncrono.

Existe uma janela de staleness.

O consumer precisa ser idempotente.

SQS e SNS da aula anterior podem transportar esses eventos.

Nenhum recurso AWS real será conectado.

---

### 21. Eviction

Arquivo:

```text
cache-eviction-policy.yaml
```

Conteúdo:

```yaml
eviction:
  memoryLimit:
    required

  maxMemoryPolicy:
    decisionRequired

  application:
    handlesMissingKeys:
      required

  criticalData:
    cacheOnly:
      forbidden

  monitoring:
    evictedKeys:
      required

    memoryUsage:
      required

    fragmentation:
      required
```

Eviction pode remover uma key antes do TTL.

A aplicação deve tratar isso como miss normal.

---

### 22. Políticas de memória

Políticas comuns podem considerar:

- keys com TTL;
- todas as keys;
- recência;
- frequência;
- aleatoriedade;
- proibição de eviction.

A escolha depende do workload.

Uma policy sem eviction pode causar falhas quando a memória termina.

Uma policy agressiva pode reduzir hit ratio.

Não existe valor universal.

---

### 23. Stampede

Arquivo:

```text
cache-stampede-policy.yaml
```

Conteúdo:

```yaml
stampede:
  protections:
    ttlJitter:
      required

    singleFlight:
      preferred

    staleWhileRevalidate:
      conditional

    lock:
      conditional

    requestCoalescing:
      preferred

  lock:
    ttl:
      mandatory

    ownerToken:
      mandatory

    safeRelease:
      mandatory

  fallback:
    sourceCapacity:
      protected:
        true
```

---

### 24. Single-flight

Single-flight permite que apenas uma execução carregue determinada key dentro de um processo.

As demais aguardam o mesmo resultado.

Isso reduz duplicação local.

Em múltiplas réplicas, cada processo ainda pode iniciar um carregamento.

Para coordenação distribuída, outra estratégia pode ser necessária.

---

### 25. Stale-while-revalidate

Nesse padrão:

```text
valor expirado recente
pode ser servido
por uma janela pequena;

uma execução
atualiza em background.
```

Use apenas quando o domínio aceita staleness.

Não use para:

- saldo;
- autorização;
- pagamento;
- estado crítico;
- permissão.

---

### 26. Distributed locks

Um lock distribuído precisa de:

- key;
- owner token;
- TTL;
- aquisição atômica;
- release condicional;
- timeout;
- fencing quando necessário;
- métricas;
- fallback.

Nunca remova um lock sem comprovar que o owner é o mesmo.

TTL evita lock eterno.

Entretanto, o processo pode continuar trabalhando após perder o lock.

Para operações críticas, use fencing tokens ou outra estratégia de consistência.

Redis lock não substitui transação do banco.

---

### 27. Hot keys

Uma hot key concentra acessos.

Ela pode causar:

- sobrecarga de um shard;
- latência;
- saturação de CPU;
- desigualdade;
- failover mais sensível.

Mitigações:

- cache local em camada adicional;
- distribuição de keys quando semanticamente possível;
- replicação de leitura;
- pré-computação;
- batching;
- revisão do domínio;
- rate limiting.

Não fragmente uma key crítica sem garantir consistência.

---

### 28. Sessões

Redis pode armazenar sessões distribuídas.

Requisitos:

- TTL;
- rotação do identificador;
- criptografia em trânsito;
- dados mínimos;
- revogação;
- proteção contra fixation;
- nenhuma senha;
- nenhuma informação excessiva;
- compatibilidade com logout.

JWT stateless e sessão server-side possuem trade-offs diferentes.

A aula não escolherá uma estratégia universal.

---

### 29. Rate limiting

Estratégias incluem:

- fixed window;
- sliding window;
- token bucket;
- leaky bucket.

O contrato precisa definir:

- identidade do cliente;
- janela;
- limite;
- burst;
- resposta;
- headers;
- clock;
- fail-open ou fail-closed;
- observabilidade.

Se Redis falhar, a decisão de permitir ou bloquear depende do risco.

Para login, pode ser fail-closed controlado.

Para endpoint de baixa criticidade, pode ser fail-open com proteção local.

---

### 30. Idempotência temporária

Redis pode guardar keys de idempotência com TTL.

Isso é útil quando:

- a janela de replay é limitada;
- perda eventual da key é aceitável;
- a fonte durável preserva o efeito;
- o consumer continua validando o banco.

Para efeitos financeiros ou críticos, a fonte durável continua preferível.

Redis não deve ser a única prova de que uma transação ocorreu.

---

### 31. Persistência do Redis

Redis pode oferecer mecanismos de persistência conforme a plataforma e configuração.

Entretanto, persistência não transforma automaticamente o cache em banco de negócio.

É necessário entender:

- durabilidade;
- replicação;
- failover;
- janela de perda;
- backup;
- restore;
- custo;
- impacto de performance.

A baseline trata o serviço como cache e coordenação temporária.

---

### 32. Serialização

O formato precisa ser:

- versionado;
- compatível;
- pequeno;
- seguro;
- observável.

Evite serialização Java nativa de objetos arbitrários.

Prefira contratos explícitos.

A key pode incluir versão:

```text
order-summary:v1.
```

Quando o schema muda de forma incompatível, publique uma nova versão de key.

---

### 33. Criar profile Spring Boot

Arquivo:

```text
application-aws-cache.yml
```

Conteúdo:

```yaml
app:
  cache:
    enabled: ${AWS_CACHE_ENABLED:false}

    endpoint: ${AWS_CACHE_ENDPOINT:}
    port: ${AWS_CACHE_PORT:}

    tls:
      enabled: ${AWS_CACHE_TLS_ENABLED:true}

    username: ${AWS_CACHE_USERNAME:}
    password: ${AWS_CACHE_PASSWORD:}

    connect-timeout-ms: ${AWS_CACHE_CONNECT_TIMEOUT_MS:1000}
    command-timeout-ms: ${AWS_CACHE_COMMAND_TIMEOUT_MS:500}
    shutdown-timeout-ms: ${AWS_CACHE_SHUTDOWN_TIMEOUT_MS:3000}

    pool:
      max-active: ${AWS_CACHE_POOL_MAX_ACTIVE:16}
      max-idle: ${AWS_CACHE_POOL_MAX_IDLE:8}
      min-idle: ${AWS_CACHE_POOL_MIN_IDLE:1}

    key-prefix: ${AWS_CACHE_KEY_PREFIX:orders:dev}
```

O adapter fica desabilitado por padrão.

Nenhum endpoint ou segredo real possui default.

---

### 34. Timeouts

Cache deve ser rápido.

Um timeout longo pode transformar falha de cache em falha da API.

O contrato exige:

```text
connect timeout:
curto.

command timeout:
curto.

retry:
limitado.

fallback:
definido por caso de uso.
```

Não use retry infinito.

Não bloqueie threads por segundos esperando cache quando a fonte pode responder com segurança.

---

### 35. Circuit breaker e fallback

Quando o cache falha:

- circuit breaker pode abrir;
- reads podem ir à fonte;
- writes de cache podem ser ignorados;
- métricas precisam registrar degradação;
- a fonte deve possuir proteção contra stampede.

Fallback não pode sobrecarregar PostgreSQL.

Use:

- limite de concorrência;
- single-flight;
- rate limit;
- timeout;
- stale data quando permitido.

---

### 36. Segurança

Arquivo:

```text
cache-security-policy.yaml
```

Conteúdo:

```yaml
security:
  publicAccess:
    forbidden

  network:
    private:
      required

  tls:
    required

  authentication:
    required

  staticCredentialInGit:
    forbidden

  secrets:
    manager:
      required

  commands:
    administrative:
      application:
        forbidden

  keyContent:
    personalData:
      forbidden

  flush:
    application:
      forbidden
```

---

### 37. Observabilidade

Arquivo:

```text
cache-observability-contract.yaml
```

Inclua:

```yaml
observability:
  service:
    - cpu
    - memory-usage
    - memory-fragmentation
    - connected-clients
    - evictions
    - expirations
    - replication-lag
    - failover-events

  application:
    - cache-hit
    - cache-miss
    - cache-error
    - cache-timeout
    - cache-load-duration
    - cache-invalidation
    - stampede-prevented
    - fallback-to-source

  ratios:
    hitRatio:
      required

  alarms:
    actionable:
      required
```

Hit ratio isolada não mede valor.

Um hit de dado incorreto é pior que um miss.

---

### 38. Custo

Arquivo:

```text
cache-cost-policy.yaml
```

Inclua:

- node size;
- replicas;
- shards;
- Multi-AZ;
- backups;
- data transfer;
- monitoring;
- memory growth;
- reserved capacity quando aplicável;
- owner;
- budget;
- cost per cached lookup;
- cost reduction at source.

Rightsizing precisa considerar:

```text
dataset;

overhead;

replication;

fragmentation;

growth;

headroom.
```

---

### 39. Simular cache-aside

Execute:

```powershell
.\scripts\cloud\aws\cache\simulate-cache-aside.ps1
```

A simulação deve:

1. consultar key inexistente;
2. registrar miss;
3. carregar fonte fictícia;
4. armazenar com TTL;
5. consultar novamente;
6. registrar hit;
7. alterar a fonte;
8. invalidar após commit;
9. recarregar valor novo.

Nenhum banco ou Redis real é acessado.

---

### 40. Simular stampede

Execute:

```powershell
.\scripts\cloud\aws\cache\simulate-cache-stampede.ps1
```

A simulação deve:

- expirar uma key;
- iniciar várias requisições;
- comprovar single-flight local;
- limitar carregamentos;
- aplicar jitter;
- registrar quantos loads foram evitados.

---

### 41. Simular falha do cache

Execute:

```powershell
.\scripts\cloud\aws\cache\simulate-cache-failure.ps1
```

Cenários:

- timeout;
- conexão recusada;
- failover;
- command error.

Resultado esperado:

- circuit breaker;
- fallback controlado;
- nenhuma perda de dado;
- nenhuma senha exposta;
- alerta;
- recuperação.

---

### 42. Simular eviction

Execute:

```powershell
.\scripts\cloud\aws\cache\simulate-eviction.ps1
```

A simulação remove uma key antes do TTL.

A aplicação deve tratar como miss e recarregar a fonte.

Nenhuma regra de negócio pode depender da permanência da key.

---

### 43. Criar readiness checklist

Arquivo:

```text
cache-readiness-checklist.yaml
```

Conteúdo:

```yaml
readiness:
  sourceOfTruth:
    defined

  useCases:
    classified

  ttl:
    explicit

  invalidation:
    explicit

  eviction:
    handled

  stampede:
    protected

  hotKeys:
    reviewed

  failover:
    handled

  security:
    privateTlsAuth:
      required

  observability:
    required

  actualClusters:
    zero
```

---

### 44. Criar test matrix

Arquivo:

```text
CACHE_TEST_MATRIX.md
```

Cenários:

- miss consulta fonte;
- hit evita fonte;
- TTL expira;
- jitter varia expiração;
- invalidation após commit;
- invalidation antes do commit é bloqueada;
- negative cache usa TTL curto;
- eviction vira miss;
- stampede é reduzida;
- hot key é identificada;
- timeout aciona fallback;
- circuit breaker abre;
- failover exige reconexão;
- lock exige owner token;
- lock sem TTL é bloqueado;
- sessão possui TTL;
- rate limit possui policy de falha;
- idempotência crítica exige storage durável;
- endpoint público é bloqueado;
- Secret em Git é bloqueado;
- cluster real permanece zero.

---

### 45. Criar troubleshooting

Arquivo:

```text
CACHE_TROUBLESHOOTING.md
```

Inclua:

- connection timeout;
- endpoint DNS;
- TLS handshake;
- authentication failed;
- pool exhausted;
- hit ratio baixa;
- stale data;
- invalidation ausente;
- eviction alta;
- memory fragmentation;
- hot key;
- stampede;
- lock não liberado;
- lock removido por owner incorreto;
- failover;
- replication lag;
- serialization incompatível;
- key collision;
- prefixo errado;
- custo elevado;
- banco sobrecarregado durante fallback.

---

### 46. Executar gate final

Execute:

```powershell
.\scripts\cloud\aws\cache\validate-cache-blueprint.ps1

.\scripts\cloud\aws\cache\validate-cache-key-policy.ps1

.\scripts\cloud\aws\cache\validate-cache-ttl-policy.ps1

.\scripts\cloud\aws\cache\validate-cache-invalidation-policy.ps1

.\scripts\cloud\aws\cache\simulate-cache-aside.ps1

.\scripts\cloud\aws\cache\simulate-cache-stampede.ps1

.\scripts\cloud\aws\cache\simulate-cache-failure.ps1

.\scripts\cloud\aws\cache\simulate-eviction.ps1

.\scripts\cloud\aws\cache\collect-cache-evidence.ps1

.\scripts\cloud\aws\cache\verify-cache-baseline.ps1
```

Finalize:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme:

- aplicação saudável;
- cache desabilitado por padrão;
- nenhum endpoint real;
- nenhuma senha;
- nenhum cluster;
- nenhuma cobrança;
- nenhuma antecipação de S3.

---

## Entendendo o que foi feito

### Redis ganhou responsabilidade limitada

Ele foi tratado como cache e coordenação temporária, não como fonte de verdade universal.

### Cache-aside ganhou fluxo explícito

Miss consulta a fonte; hit retorna rápido; alteração invalida após commit.

### TTL ganhou decisão de domínio

Não existe TTL global adequado para todos os dados.

### Invalidation ganhou segurança transacional

A remoção ocorre depois do commit da fonte.

### Eviction virou comportamento esperado

Uma key pode desaparecer antes do TTL e a aplicação precisa tolerar.

### Stampede ganhou proteção

Jitter, single-flight e concorrência controlada protegem a fonte.

### Locks ganharam limites

TTL, owner token e release condicional passaram a ser obrigatórios.

### Spring Boot ganhou profile seguro

Endpoint e credenciais vêm do runtime e o adapter começa desabilitado.

### Falha do cache virou degradação

O sistema preserva integridade e controla carga sobre PostgreSQL.

### A próxima aula ganhou continuidade

Object storage será estudado sem confundir cache, arquivo e fonte transacional.

---

## Erros comuns importantes

### Usar Redis como banco principal por conveniência

A decisão de durabilidade precisa ser explícita.

### Criar key sem TTL

Memória cresce e lifecycle fica indefinido.

### Invalidar antes do commit

Outro request pode recarregar o valor antigo.

### Ignorar eviction

A key pode sumir antes da expiração.

### Usar TTL igual para tudo

Domínios possuem tolerâncias diferentes.

### Fazer fallback ilimitado ao banco

Uma falha de cache pode derrubar a fonte.

### Usar lock sem TTL

Falha do processo pode deixar bloqueio eterno.

### Liberar lock sem conferir owner

Um processo pode apagar o lock de outro.

### Guardar dado pessoal na key

Keys aparecem em métricas e diagnósticos.

### Usar `flush` pela aplicação

O blast radius é excessivo.

### Antecipar S3

A aula 542 possui esse objetivo.

---

## Comandos úteis

### Validar blueprint

```powershell
.\scripts\cloud\aws\cache\validate-cache-blueprint.ps1
```

### Validar TTL

```powershell
.\scripts\cloud\aws\cache\validate-cache-ttl-policy.ps1
```

### Simular cache-aside

```powershell
.\scripts\cloud\aws\cache\simulate-cache-aside.ps1
```

### Simular stampede

```powershell
.\scripts\cloud\aws\cache\simulate-cache-stampede.ps1
```

### Simular falha

```powershell
.\scripts\cloud\aws\cache\simulate-cache-failure.ps1
```

---

## Exercício guiado

### Parte 1 — Use cases

Classifique o que pode e o que não pode entrar no cache.

### Parte 2 — Keys

Crie padrão versionado e sem dados pessoais.

### Parte 3 — Cache-aside

Modele hit, miss e source loader.

### Parte 4 — TTL

Defina expiração e jitter.

### Parte 5 — Invalidation

Remova depois do commit.

### Parte 6 — Eviction

Trate desaparecimento como miss.

### Parte 7 — Stampede

Use single-flight e limite de concorrência.

### Parte 8 — Coordination

Avalie locks, rate limit e idempotência.

### Parte 9 — Failure

Teste timeout, failover e fallback.

### Parte 10 — Evidence

Comprove readiness sem cluster real.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 540 foi preservada;
- ponte para a aula 542 está correta;
- Redis gerenciado foi tratado conceitualmente;
- cache e source of truth foram diferenciados;
- hit e miss foram definidos;
- cache-aside foi definido;
- read-through, write-through e write-behind foram contextualizados;
- TTL foi definido;
- invalidation foi definida;
- eviction foi definida;
- stampede foi definida;
- hot key foi definida;
- sharding, replication e failover foram definidos;
- sessões, rate limiting, locks e idempotência foram analisados;
- persistência Redis não foi confundida com banco de negócio;
- use-case matrix foi criada;
- dados proibidos no cache foram listados;
- blueprint foi criado;
- rede privada, TLS e autenticação foram exigidos;
- acesso público foi proibido;
- Multi-AZ e failover foram exigidos para produção;
- sharding ficou sujeito a decisão;
- padrão de keys foi criado;
- keys não contêm dados pessoais;
- `CacheKey` foi criado;
- `CacheEntry` foi criado;
- `CacheLookupResult` foi criado;
- `CachePort` foi criado;
- `InMemoryCacheAdapter` foi criado;
- `CacheAsideService` foi criado;
- contrato cache-aside foi criado;
- escrita persiste antes de invalidar;
- falha de cache não falha automaticamente o negócio;
- TTL policy foi criada;
- TTL permanente foi proibido;
- jitter foi definido;
- negative caching recebeu TTL curto;
- invalidation policy foi criada;
- wildcard delete e full flush foram proibidos;
- event-driven invalidation foi explicado;
- eviction policy foi criada;
- aplicação trata eviction como miss;
- stampede policy foi criada;
- single-flight foi aplicado;
- stale-while-revalidate foi limitado a domínios tolerantes;
- locks exigem TTL, owner token e release segura;
- hot keys foram analisadas;
- sessões possuem TTL e revogação;
- rate limiting possui estratégia de falha;
- idempotência crítica prefere storage durável;
- serialization foi versionada;
- profile `application-aws-cache.yml` foi criado;
- cache começa desabilitado;
- endpoint e senha não possuem defaults;
- timeouts curtos foram definidos;
- circuit breaker e fallback foram definidos;
- security policy foi criada;
- observability contract foi criado;
- cost policy foi criada;
- cache-aside foi simulado;
- hit, miss, expiração e invalidation foram simulados;
- stampede foi simulada;
- falha do cache foi simulada;
- eviction foi simulada;
- readiness checklist foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- evidence foi sanitizada;
- nenhum endpoint, senha, cluster ou recurso real foi criado;
- S3 não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/aws/cache `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/com/formacao/orders/integration/cache `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-aws-cache.yml `
  scripts/cloud/aws/cache `
  docs/devops/aws-cache `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password: [^$]|amazonaws.com|redis://|rediss://|access.key|secret.key|endpoint: [a-zA-Z0-9]"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): modelar Redis gerenciado"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- senha;
- token;
- endpoint real;
- IP;
- access key;
- Secret;
- dump;
- snapshot;
- cluster state;
- bucket ou objeto da aula 542.

---

## Fechamento e ponte para a próxima aula

Nesta aula, Redis gerenciado deixou de ser tratado como solução automática para qualquer estado temporário.

O modelo passou a possuir:

```text
source of truth;

cache-aside;

keys versionadas;

TTL;

invalidation;

eviction;

stampede protection;

locks seguros;

fallback;

observabilidade;

custos.
```

Você comprovou que cache acelera, mas não substitui PostgreSQL; hit e miss precisam de métricas; TTL varia por domínio; invalidation acontece após commit; eviction é comportamento esperado; stampede precisa de jitter e single-flight; hot keys exigem análise; locks precisam de TTL e owner token; sessões, rate limiting e idempotência possuem riscos próprios; e falha do cache deve degradar desempenho sem destruir integridade.

A próxima aula será:

```text
542 - M17.37 - Object Storage S3 conceitual
```

Nela, você irá estudar buckets, objects, keys, versioning, lifecycle, encryption, policies, signed URLs, uploads, downloads, eventos, consistência, custos e integração segura com aplicações Java.

Nenhum bucket, objeto, signed URL, upload, lifecycle ou recurso real de object storage foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei casos de uso.
- [ ] Defini source of truth.
- [ ] Modelei cache-aside.
- [ ] Defini TTL e invalidation.
- [ ] Tratei eviction e stampede.
- [ ] Modelei segurança e observabilidade.
- [ ] Gerei evidence sanitizada.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O cache retorna dado antigo

Revise TTL, invalidation após commit, eventos e versionamento da key.

### O banco sobrecarrega quando o cache falha

Revise circuit breaker, limite de concorrência, single-flight e fallback.

### Muitas keys expiram juntas

Adicione jitter e revise o padrão de TTL.

### A memória cresce continuamente

Procure keys sem TTL, payloads grandes e política de eviction inadequada.

### O lock não libera

Revise TTL, owner token e release condicional.

### A aplicação remove o lock de outro processo

A release não validou o token do owner.

### O failover causa timeouts longos

Revise DNS, reconnect, timeouts do client e circuit breaker.

### O hit ratio é alto, mas o dado está incorreto

Hit ratio não mede consistência; revise invalidation e contrato do domínio.

### O custo aumentou

Revise tamanho, replicas, shards, backups, transfer e headroom.

### Um bucket apareceu nesta aula

Remova e preserve para a aula 542.

---

## Perguntas de revisão

1. O que é cache?
2. O que é source of truth?
3. O que é cache hit?
4. O que é cache miss?
5. O que é cache-aside?
6. O que é TTL?
7. O que é invalidation?
8. O que é eviction?
9. O que é stampede?
10. O que é hot key?
11. Para que serve jitter?
12. O que é negative caching?
13. Por que invalidar após o commit?
14. Como um lock distribuído deve ser protegido?
15. Redis pode ser a única fonte de idempotência crítica?
16. Como tratar falha do cache?
17. O que observar?
18. Como HPA afeta conexões e carga?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Armazenamento temporário.
2. Estado oficial.
3. Key encontrada.
4. Key ausente ou expirada.
5. Aplicação carrega e armazena.
6. Tempo de vida.
7. Remoção após mudança.
8. Remoção por memória.
9. Carga simultânea após miss.
10. Key com carga excessiva.
11. Distribuir expirações.
12. Cache de ausência.
13. Evitar recarregar valor antigo.
14. TTL, owner token e release segura.
15. Não para efeitos críticos.
16. Fallback controlado.
17. Hit, miss, timeout, eviction e memória.
18. Aumenta concorrência sobre cache e fonte.
19. Cluster e S3 reais.
20. Object Storage S3 conceitual.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 541 - M17.36 - Redis gerenciado conceitual

- Continuei após SQS e SNS.
- Defini Redis gerenciado como cache e coordenação temporária.
- Mantive PostgreSQL como fonte de verdade.
- Classifiquei casos de uso permitidos e proibidos.
- Modelei rede privada, TLS, autenticação e failover.
- Estudei replication, sharding e cluster mode.
- Criei padrão versionado de keys.
- Evitei dados pessoais em keys.
- Criei `CacheKey`, `CacheEntry`, `CacheLookupResult` e `CachePort`.
- Criei adapter em memória para testes offline.
- Implementei fluxo cache-aside.
- Defini TTL por domínio.
- Adicionei jitter de expiração.
- Modelei negative caching com TTL curto.
- Defini invalidation após commit.
- Proibi wildcard delete e full flush.
- Estudei event-driven invalidation.
- Modelei eviction e limites de memória.
- Protegi contra stampede com single-flight e jitter.
- Estudei stale-while-revalidate.
- Modelei hot keys.
- Defini regras para sessões e rate limiting.
- Modelei locks com TTL, owner token e release segura.
- Limitei idempotência temporária a cenários compatíveis.
- Criei `application-aws-cache.yml`.
- Mantive cache desabilitado por padrão.
- Defini timeouts curtos, circuit breaker e fallback.
- Modelei métricas, alarms e custos.
- Simulei hit, miss, expiração, invalidation, stampede, eviction e falha.
- Não criei endpoint, senha, cluster ou recurso real.
- Não antecipei S3.
- Próxima aula: Object Storage S3 conceitual.
```

---

## Referência técnica curta

- Redis Data Structures.
- Cache-Aside Pattern.
- Cache Invalidation.
- Time to Live.
- Eviction Policies.
- Cache Stampede.
- Distributed Locks.
- Redis Replication and Failover.
- Redis Cluster and Sharding.
- Spring Boot Cache Integration.

Regra final:

```text
Redis gerenciado deve ser tratado como cache e coordenação temporária, mantendo PostgreSQL ou outra fonte durável como source of truth: cache-aside consulta a key, carrega a fonte no miss, grava com TTL e invalida somente após o commit; keys são versionadas, não expõem dados pessoais e nunca permanecem sem lifecycle; eviction pode remover dados antes do TTL, stampede é reduzida com jitter, single-flight e concorrência controlada, e hot keys exigem revisão de distribuição; sessões, rate limiting, locks e idempotência possuem contratos próprios, sendo locks protegidos por TTL, owner token e release condicional e efeitos críticos preservados em storage durável; rede privada, TLS, autenticação, menor privilégio, timeouts curtos, circuit breaker, fallback, métricas, alarms e custos completam o desenho; nenhum cluster, endpoint, senha ou recurso real é criado, deixando para a aula 542 o estudo de object storage e S3.
```
