# 584 - M18.29 - Cache invalidation

## Apresentação da aula

Na aula 583, você implementou um cache distribuído com Redis.

Você trabalhou com:

```text
Redis no Docker Compose;

Spring Data Redis;

RedisCacheManager;

namespace versionado;

chaves seguras;

serialização JSON;

TTL;

timeouts;

fallback;

miss storm;

métricas;

health;

rollback.
```

A aula anterior deixou uma fronteira proposital.

O cache já podia:

- armazenar cópias temporárias;
- compartilhar entradas entre réplicas;
- expirar por TTL;
- falhar sem substituir a fonte da verdade;
- voltar à origem quando estivesse vazio ou indisponível.

Porém, ainda faltava responder à pergunta mais difícil:

```text
quando o dado muda,
como impedir que o cache
continue servindo
a versão antiga?
```

Esse é o problema de **cache invalidation**.

A origem pode mudar por:

- comando HTTP;
- consumidor Kafka;
- job;
- integração;
- ajuste administrativo;
- compensação;
- reprocessamento;
- atualização em lote;
- mudança em outro serviço.

Se a entrada antiga permanecer no cache, o sistema pode responder:

```text
pedido:
CONCLUIDO no banco;

cache:
PENDENTE;

API:
PENDENTE.
```

A resposta é rápida, mas incorreta.

TTL reduz a duração do erro, porém não elimina a janela de inconsistência.

Exemplo:

```text
TTL:
5 minutos.

alteração:
agora.

staleness possível:
até 5 minutos.
```

Por isso, esta aula irá aprofundar invalidação por:

- chave;
- grupo;
- namespace;
- evento;
- versão;
- commit;
- outbox;
- pub/sub;
- tombstone;
- reparação;
- expiração;
- reconciliação.

A pergunta central será:

```text
como invalidar
ou substituir entradas

quando a fonte muda,

sem criar race conditions,
dupla escrita frágil,
perda de evento,
apagamento excessivo
ou dependência circular?
```

A regra básica continuará sendo:

```text
PostgreSQL:
fonte da verdade.

Redis:
cópia temporária.
```

A invalidação precisa ocorrer de forma coerente com a confirmação da escrita.

Invalidar antes do commit pode produzir:

```text
cache removido;

transação falha;

origem continua antiga;

nova leitura recarrega
o dado antigo.
```

Atualizar o cache antes do commit pode ser ainda pior:

```text
cache recebe
valor novo;

transação faz rollback;

cache passa a conter
estado que nunca existiu
na fonte da verdade.
```

Por isso, o fluxo mínimo será:

```text
persistir;

confirmar commit;

publicar intenção
de invalidação;

remover ou atualizar
a entrada;

medir o resultado.
```

Em um único processo, um callback `afterCommit` pode ser suficiente.

Em múltiplos serviços, isso não resolve o risco de falha entre:

```text
commit no banco;

publicação do evento.
```

Para esse problema, a aula utilizará o padrão **Transactional Outbox** de forma aplicada ao laboratório.

O mesmo commit que altera o pedido também registra um evento de invalidação.

Depois, um publicador entrega esse evento.

Assim, o sistema não depende de uma dupla escrita não atômica entre banco e Redis.

Você também irá diferenciar:

```text
delete invalidation;

write-through update;

versioned key;

namespace bump;

tombstone;

TTL-only;

repair-on-read.
```

Nenhuma estratégia é universal.

A escolha depende de:

- frequência de escrita;
- tolerância a stale;
- quantidade de leitores;
- custo da origem;
- cardinalidade;
- fan-out;
- ownership;
- necessidade de read-after-write;
- risco de evento duplicado;
- possibilidade de reordenação.

A aula não irá executar load testing com K6 ou Gatling.

Não serão aprofundados:

- modelagem de virtual users;
- ramp-up;
- arrival rate;
- thresholds de K6;
- scenarios;
- executors do Gatling;
- percentis de teste de carga;
- soak test;
- stress test;
- spike test;
- volume test;
- script completo de carga;
- gates de carga em CI.

Esses assuntos pertencem à próxima aula oficial:

```text
585 - M18.30 - Load testing K6 ou Gatling conceitual
```

Nesta aula, haverá apenas concorrência controlada para validar races de invalidação.

A regra central será:

```text
invalidação
não é apagar cache
de qualquer forma;

é preservar coerência
entre origem,
eventos,
versões
e leitores.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
582:
Cache local Caffeine.

583:
Cache distribuido Redis.

584:
Cache invalidation.

585:
Load testing K6 ou Gatling conceitual.
```

A progressão é:

```text
cache por processo;

cache compartilhado;

coerência e invalidação;

testes de carga.
```

Nesta aula:

```text
afterCommit:
sim.

evict por chave:
sim.

evict por grupo:
sim.

version token:
sim.

namespace bump:
sim.

outbox:
sim.

pub/sub:
sim.

eventos idempotentes:
sim.

ordenação:
sim.

tombstone:
sim.

repair-on-read:
sim.

reconciliation:
sim.

K6:
não.

Gatling:
não.

stress test:
não.
```

Você reutilizará:

- Redis;
- Spring Cache;
- Spring Data Redis;
- PostgreSQL;
- transações;
- Kafka;
- outbox;
- métricas;
- traces;
- logs;
- cenários concorrentes;
- runbooks.

A invalidação precisa preservar:

- source of truth;
- commit;
- idempotência;
- ordenação;
- isolamento de tenant;
- compatibilidade de schema;
- observabilidade;
- rollback;
- recuperação.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/cache/invalidation
├── cache-invalidation-contract.yaml
├── cache-invalidation-catalog.yaml
├── cache-invalidation-ownership-policy.yaml
├── cache-invalidation-after-commit-policy.yaml
├── cache-invalidation-event-policy.yaml
├── cache-invalidation-outbox-policy.yaml
├── cache-invalidation-pubsub-policy.yaml
├── cache-invalidation-version-policy.yaml
├── cache-invalidation-tombstone-policy.yaml
├── cache-invalidation-race-policy.yaml
├── cache-invalidation-idempotency-policy.yaml
├── cache-invalidation-ordering-policy.yaml
├── cache-invalidation-repair-policy.yaml
├── cache-invalidation-reconciliation-policy.yaml
├── cache-invalidation-observability-policy.yaml
├── cache-invalidation-data-quality-policy.yaml
├── cache-invalidation-security-policy.yaml
├── cache-invalidation-failure-policy.yaml
├── cache-invalidation-scenarios.yaml
└── cache-invalidation-evidence.yaml

performance/cache/invalidation/sql
├── 001_create_cache_outbox.sql
├── 002_create_cache_invalidation_checkpoint.sql
├── 003_seed_cache_invalidation_fixture.sql
└── 004_cleanup_cache_invalidation_fixture.sql

performance/cache/invalidation/reports
├── cache-invalidation-baseline-report.yaml
├── cache-invalidation-event-report.yaml
├── cache-invalidation-race-report.yaml
├── cache-invalidation-outbox-report.yaml
├── cache-invalidation-repair-report.yaml
└── cache-invalidation-gate-report.yaml

scripts/performance/cache/invalidation
├── validate-cache-invalidation-contract.ps1
├── prepare-cache-invalidation-fixture.ps1
├── collect-cache-invalidation-baseline.ps1
├── validate-after-commit-invalidation.ps1
├── validate-cache-invalidation-event.ps1
├── validate-cache-invalidation-outbox.ps1
├── validate-cache-invalidation-pubsub.ps1
├── validate-cache-version-token.ps1
├── validate-cache-tombstone.ps1
├── simulate-cache-read-write-race.ps1
├── simulate-cache-event-reordering.ps1
├── simulate-cache-duplicate-event.ps1
├── simulate-cache-lost-event.ps1
├── validate-cache-repair-on-read.ps1
├── reconcile-cache-with-source.ps1
├── compare-cache-invalidation-strategies.ps1
├── enforce-cache-invalidation-budget.ps1
├── validate-cache-invalidation-rollback.ps1
├── scan-cache-invalidation-output.ps1
├── collect-cache-invalidation-evidence.ps1
└── verify-cache-invalidation-baseline.ps1

docs/performance/cache/invalidation
├── CACHE_INVALIDATION_OVERVIEW.md
├── AFTER_COMMIT_INVALIDATION.md
├── OUTBOX_FOR_CACHE_INVALIDATION.md
├── PUBSUB_INVALIDATION_GUIDE.md
├── VERSIONED_CACHE_KEYS.md
├── TOMBSTONES_AND_DELETES.md
├── CACHE_RACE_CONDITIONS.md
├── CACHE_REPAIR_AND_RECONCILIATION.md
├── CACHE_INVALIDATION_TEST_MATRIX.md
└── CACHE_INVALIDATION_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de invalidação;

catálogo de caches;

ownership;

afterCommit;

outbox;

evento versionado;

pub/sub;

idempotência;

ordenação;

tombstones;

repair;

reconciliation;

gate;

evidence sanitizada.
```

Você irá implementar, simular falhas, comparar estratégias e validar a correção do fluxo.

---

## Conceito essencial

### Cache invalidation

Remoção ou substituição de uma entrada quando ela deixa de representar a fonte.

---

### Eviction

Remoção causada pela política do cache.

---

### Explicit invalidation

Remoção disparada por uma mudança conhecida.

---

### After-commit invalidation

Invalidação executada somente depois do commit da transação.

---

### Double write

Tentativa de alterar banco e cache como duas operações independentes.

---

### Transactional outbox

Registro do evento no mesmo commit da mudança de negócio.

---

### Invalidation event

Mensagem que descreve qual entrada ou versão deixou de ser válida.

---

### Idempotent consumer

Consumidor que pode processar o mesmo evento mais de uma vez sem efeito incorreto.

---

### Event ordering

Ordem relativa entre eventos que alteram a mesma chave.

---

### Version token

Versão monotônica associada ao estado ou à entrada.

---

### Versioned key

Chave que inclui versão da representação ou do estado.

---

### Namespace bump

Mudança do prefixo para abandonar em massa entradas antigas.

---

### Tombstone

Marca explícita de que um recurso foi removido.

---

### Read-after-write consistency

Expectativa de que o escritor leia imediatamente o valor atualizado.

---

### Repair-on-read

Correção do cache quando uma leitura detecta divergência.

---

### Reconciliation

Processo periódico que compara cache e origem.

---

### Race condition

Resultado incorreto dependente da ordem entre operações concorrentes.

---

### Lost invalidation

Mudança confirmada cuja invalidação não foi entregue.

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

- PostgreSQL saudável;
- Redis saudável;
- cache distribuído ativo;
- cache local desabilitado no cenário principal;
- namespace conhecido;
- TTL conhecido;
- endpoint candidato medido;
- nenhuma ferramenta de load testing será antecipada.

---

### 2. Criar contrato de invalidação

Arquivo:

```text
cache-invalidation-contract.yaml
```

Conteúdo:

```yaml
cacheInvalidation:
  required:
    - cache
    - owner
    - source-of-truth
    - write-operation
    - invalidation-key
    - trigger
    - timing
    - idempotency
    - ordering
    - observability
    - fallback
    - repair
    - rollback

  correctness:
    sourceCommitBeforeInvalidation:
      required

  forbidden:
    - cache-before-source-commit
    - unversioned-cross-service-event
    - silent-lost-invalidation
    - global-flush

  loadTesting:
    deferredToLesson585
```

---

### 3. Criar catálogo de invalidação

Arquivo:

```text
cache-invalidation-catalog.yaml
```

Exemplo:

```yaml
entries:
  - cache:
      order-status-by-id

    owner:
      orders-api

    sourceOfTruth:
      PostgreSQL

    writes:
      - confirm-order
      - cancel-order
      - complete-order
      - delete-order

    key:
      tenant-and-order-id

    strategy:
      evict-after-commit

    distributedPropagation:
      outbox-to-Kafka-to-consumers

    version:
      source-version

    repair:
      reload-on-miss
```

---

### 4. Definir ownership

Arquivo:

```text
cache-invalidation-ownership-policy.yaml
```

Conteúdo:

```yaml
ownership:
  cache:
    onePrimaryOwner:
      required

  source:
    authoritativeOwner:
      required

  writer:
    responsibleForPublishingChange:
      true

  reader:
    responsibleForHandlingMiss:
      true

  consumer:
    responsibleForIdempotentInvalidation:
      true

  unknownOwner:
    action:
      block-approval
```

Sem owner, eventos e falhas ficam sem responsabilidade clara.

---

### 5. Invalidar após commit

Arquivo:

```text
cache-invalidation-after-commit-policy.yaml
```

Conteúdo:

```yaml
afterCommit:
  requiredFor:
    - update
    - delete
    - status-change

  beforeCommit:
    forbidden

  rollback:
    invalidate:
      false

  callbackFailure:
    observable:
      required

  crossServiceReliability:
    useOutbox:
      required
```

---

### 6. Implementar invalidação local após commit

Exemplo:

```java
@Component
public class OrderStatusInvalidator {

    private final CacheManager cacheManager;

    public void invalidateAfterCommit(
            String tenantId,
            UUID orderId) {

        TransactionSynchronizationManager
                .registerSynchronization(
                        new TransactionSynchronization() {
                            @Override
                            public void afterCommit() {
                                Cache cache =
                                        cacheManager.getCache(
                                                "order-status-by-id");

                                if (cache != null) {
                                    cache.evict(
                                            tenantId
                                                    + ":"
                                                    + orderId);
                                }
                            }
                        });
    }
}
```

Esse mecanismo protege rollback no mesmo processo.

Ele não garante entrega remota depois de falha do processo.

---

### 7. Demonstrar o risco da dupla escrita

Fluxo frágil:

```text
1.
UPDATE no PostgreSQL.

2.
COMMIT.

3.
DEL no Redis.

4.
processo cai antes do DEL.
```

Resultado:

```text
banco novo;

cache antigo;

invalidação perdida.
```

Outro fluxo frágil:

```text
1.
DEL no Redis.

2.
UPDATE falha.

3.
outra leitura recarrega
o estado antigo.
```

A solução não é apenas trocar a ordem.

É registrar a intenção de invalidação de forma durável no mesmo commit.

---

### 8. Criar tabela outbox

Arquivo:

```text
001_create_cache_outbox.sql
```

Conteúdo:

```sql
CREATE TABLE IF NOT EXISTS cache_invalidation_outbox (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(128) NOT NULL,
    tenant_scope VARCHAR(128) NOT NULL,
    cache_name VARCHAR(128) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    source_version BIGINT NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error_category VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS
    idx_cache_invalidation_outbox_pending
ON cache_invalidation_outbox (
    occurred_at
)
WHERE published_at IS NULL;
```

Não armazene valor do cache no outbox.

---

### 9. Criar política de outbox

Arquivo:

```text
cache-invalidation-outbox-policy.yaml
```

Conteúdo:

```yaml
outbox:
  sameTransactionAsBusinessWrite:
    required

  event:
    include:
      - event-id
      - cache-name
      - tenant-scope
      - resource-id
      - source-version
      - occurred-at

  payload:
    cacheValue:
      forbidden

  publisher:
    retry:
      bounded:
        true

  published:
    checkpoint:
      required

  duplicateDelivery:
    expected:
      true
```

---

### 10. Persistir negócio e evento juntos

Exemplo conceitual:

```java
@Transactional
public void confirmOrder(
        String tenantId,
        UUID orderId) {

    Order order =
            repository.getRequired(
                    tenantId,
                    orderId);

    order.confirm();

    repository.save(order);

    outboxRepository.save(
            CacheInvalidationOutboxEvent
                    .orderStatusChanged(
                            tenantId,
                            orderId,
                            order.getVersion()));
}
```

Se a transação faz rollback, nem o pedido nem o evento são confirmados.

---

### 11. Criar evento versionado

Arquivo:

```text
cache-invalidation-event-policy.yaml
```

Contrato:

```yaml
event:
  name:
    order-status-cache-invalidated

  version:
    1

  required:
    - eventId
    - tenantScope
    - resourceId
    - cacheName
    - sourceVersion
    - occurredAt
    - reason

  forbidden:
    - cacheValue
    - customerData
    - credentials
```

Exemplo Java:

```java
public record CacheInvalidationEventV1(
        UUID eventId,
        String tenantScope,
        UUID resourceId,
        String cacheName,
        long sourceVersion,
        Instant occurredAt,
        String reason) {
}
```

---

### 12. Publicar outbox

O publicador precisa:

1. localizar eventos pendentes;
2. bloquear lote de forma controlada;
3. publicar no Kafka;
4. confirmar sucesso;
5. marcar `published_at`;
6. registrar tentativa;
7. preservar erro por categoria;
8. evitar loop infinito.

Não marque publicado antes da confirmação do broker.

---

### 13. Criar política de idempotência

Arquivo:

```text
cache-invalidation-idempotency-policy.yaml
```

Conteúdo:

```yaml
idempotency:
  eventId:
    unique:
      required

  duplicateEvent:
    expected:
      true

  evictSameKeyTwice:
    safe:
      true

  processedEventStore:
    optionalWhenOperationNaturallyIdempotent

  sideEffects:
    forbidden

  metrics:
    duplicate:
      required
```

Remover uma chave inexistente é operação idempotente.

---

### 14. Consumir invalidação

Exemplo:

```java
@Component
public class CacheInvalidationConsumer {

    private final RedisTemplate<String, Object>
            redisTemplate;

    public void onEvent(
            CacheInvalidationEventV1 event) {

        String key =
                RedisKeyFactory.orderStatus(
                        event.tenantScope(),
                        event.resourceId());

        redisTemplate.delete(key);
    }
}
```

O consumidor não precisa conhecer o valor.

Ele precisa conhecer o contrato da chave e o namespace.

---

### 15. Criar política de ordering

Arquivo:

```text
cache-invalidation-ordering-policy.yaml
```

Conteúdo:

```yaml
ordering:
  sameResource:
    partitionKey:
      resource-id

  sourceVersion:
    monotonic:
      required

  olderEventAfterNewer:
    action:
      ignore-or-safe-evict

  consumer:
    trackLastVersion:
      whenUpdatingCacheValue

  deleteOnly:
    reorderingRisk:
      lowerButNotZero
```

Evict puro tolera mais reordenação que update-through.

---

### 16. Simular evento duplicado

Script:

```text
simulate-cache-duplicate-event.ps1
```

Fluxo:

1. aquecer entrada;
2. publicar evento;
3. confirmar remoção;
4. publicar o mesmo evento;
5. confirmar ausência de erro;
6. confirmar origem intacta;
7. medir duplicate count.

Resultado esperado:

```text
idempotent.
```

---

### 17. Simular reordenação

Script:

```text
simulate-cache-event-reordering.ps1
```

Eventos:

```text
version 12:
status CONCLUIDO.

version 11:
status PENDENTE.
```

Se a estratégia é apenas evict:

```text
ambos removem a chave;
próxima leitura carrega v12.
```

Se a estratégia atualiza valor diretamente:

```text
v11 não pode sobrescrever v12.
```

Por isso, update-through exige comparação de versão.

---

### 18. Criar version token

Arquivo:

```text
cache-invalidation-version-policy.yaml
```

Conteúdo:

```yaml
version:
  source:
    authoritative:
      required

  token:
    monotonic:
      preferred

  cacheValue:
    includeSourceVersion:
      true

  event:
    includeSourceVersion:
      true

  olderWrite:
    reject:
      true

  unknownVersion:
    action:
      evict-and-reload
```

---

### 19. Aplicar compare-and-set conceitual

Quando o consumidor atualiza o valor em vez de remover:

```text
cache version atual:
12.

evento:
11.

ação:
ignorar.
```

```text
cache version atual:
12.

evento:
13.

ação:
substituir por v13.
```

No laboratório, o caminho principal continuará usando evict.

O update versionado será exercitado como cenário comparativo.

---

### 20. Criar namespace bump

Uma mudança incompatível no schema pode usar:

```text
orders:lab:v1:order-status

para

orders:lab:v2:order-status
```

Isso abandona entradas antigas sem `FLUSHALL`.

Vantagens:

- simples;
- seguro entre versões;
- rollback possível.

Custos:

- cold cache;
- memória temporariamente duplicada;
- limpeza posterior;
- aumento de misses.

---

### 21. Criar política de pub/sub

Arquivo:

```text
cache-invalidation-pubsub-policy.yaml
```

Conteúdo:

```yaml
pubsub:
  use:
    localCacheNotification:
      allowed

  delivery:
    durable:
      false

  sourceOfReliability:
    mustNotBePubsubAlone

  reconnect:
    missedMessages:
      possible

  combineWith:
    - outbox
    - durable-broker
    - version-check
    - reconciliation

  businessEventOnlyInPubsub:
    forbidden
```

Redis Pub/Sub não é durável.

Ele pode complementar, mas não substituir, outbox e broker durável.

---

### 22. Validar pub/sub

Script:

```text
validate-cache-invalidation-pubsub.ps1
```

Cenários:

- subscriber online;
- subscriber reiniciando;
- mensagem durante desconexão;
- reconnect;
- duplicate;
- payload inválido;
- namespace incorreto.

Confirme que perda de notificação pode ser reparada por TTL, versão ou reconciliação.

---

### 23. Criar tombstone

Arquivo:

```text
cache-invalidation-tombstone-policy.yaml
```

Conteúdo:

```yaml
tombstone:
  useFor:
    - delete
    - stable-not-found
    - race-protection

  include:
    - source-version
    - deleted-at
    - expiry

  TTL:
    shortAndBounded:
      required

  timeoutOrFailure:
    cannotBecomeTombstone:
      true

  resurrection:
    preventOlderWrite:
      true
```

Tombstone evita que uma resposta antiga ressuscite um recurso removido.

---

### 24. Simular delete race

Sequência:

```text
1.
leitura inicia na origem;

2.
recurso é deletado;

3.
evento remove o cache;

4.
leitura antiga termina;

5.
leitura antiga grava
valor antigo no cache.
```

Sem proteção, o recurso “ressuscita” no cache.

Com version token ou tombstone:

```text
write antigo
é rejeitado.
```

---

### 25. Validar tombstone

Script:

```text
validate-cache-tombstone.ps1
```

Valide:

- delete confirmado;
- tombstone criado;
- leitura antiga tenta gravar;
- versão antiga rejeitada;
- `not found` consistente;
- TTL do tombstone;
- recriação legítima com versão nova;
- cleanup.

---

### 26. Criar política de races

Arquivo:

```text
cache-invalidation-race-policy.yaml
```

Conteúdo:

```yaml
race:
  scenarios:
    required:
      - read-during-write
      - read-before-commit
      - stale-load-after-evict
      - delete-during-load
      - duplicate-event
      - reordered-event
      - delayed-event
      - concurrent-writers

  protection:
    allowed:
      - version-token
      - tombstone
      - evict-after-commit
      - atomic-cache-operation
      - retry-from-source

  sleepBasedProof:
    insufficient
```

---

### 27. Simular read-write race

Script:

```text
simulate-cache-read-write-race.ps1
```

Use barreiras controladas:

```text
reader:
carrega v10.

writer:
commita v11.

invalidation:
remove chave.

reader:
tenta armazenar v10.
```

O resultado aprovado é:

```text
v10 não permanece
como estado atual.
```

---

### 28. Criar repair-on-read

Arquivo:

```text
cache-invalidation-repair-policy.yaml
```

Conteúdo:

```yaml
repair:
  read:
    compareVersion:
      whenAvailable

  mismatch:
    action:
      evict-and-reload

  repairWrite:
    conditional:
      required

  metrics:
    required:
      - mismatch
      - repair-attempt
      - repair-success
      - repair-failure

  sourcePressure:
    bounded:
      required
```

---

### 29. Implementar reparação conceitual

Fluxo:

```text
1.
ler cache v10;

2.
obter source version v11
por metadata barata
ou evento conhecido;

3.
detectar mismatch;

4.
remover v10;

5.
recarregar v11;

6.
registrar repair.
```

Não faça uma consulta completa à origem em todo hit.

A reparação deve ser usada quando existe sinal de divergência.

---

### 30. Criar reconciliação

Arquivo:

```text
cache-invalidation-reconciliation-policy.yaml
```

Conteúdo:

```yaml
reconciliation:
  periodic:
    allowed

  scope:
    bounded:
      required

  compare:
    - key-exists
    - source-version
    - tombstone
    - TTL

  fullKeyspaceScan:
    forbiddenInCriticalWindow

  action:
    - evict-stale
    - reload-controlled
    - report

  metrics:
    required
```

Reconciliação é uma rede de segurança, não substituto para eventos confiáveis.

---

### 31. Reconciliar amostra controlada

Script:

```text
reconcile-cache-with-source.ps1
```

Fluxo:

1. selecionar chaves sintéticas;
2. obter versão cacheada;
3. obter versão da origem;
4. classificar;
5. remover stale;
6. recarregar opcionalmente;
7. registrar evidence;
8. limitar taxa.

Não use `KEYS *`.

---

### 32. Criar política de observabilidade

Arquivo:

```text
cache-invalidation-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - invalidation-requested
    - invalidation-success
    - invalidation-failure
    - outbox-pending
    - outbox-age
    - publish-failure
    - duplicate-event
    - reordered-event
    - ignored-old-version
    - tombstone-created
    - repair-attempt
    - reconciliation-mismatch
    - stale-read-detected

  correlate:
    - cache-hit
    - cache-miss
    - source-version
    - endpoint-latency
    - query-count

  labels:
    forbidden:
      - raw-key
      - tenant-id
      - order-id
```

---

### 33. Medir atraso de invalidação

Defina:

```text
invalidation lag
=
tempo de remoção
-
tempo do commit.
```

Registre:

- p50;
- p95;
- p99;
- máximo;
- outbox age;
- publish delay;
- consume delay;
- Redis command time.

Esse lag determina a janela real de staleness.

---

### 34. Criar budget de invalidação

Exemplo didático:

```yaml
invalidationBudget:
  afterCommitLocal:
    p95Ms:
      50

  distributedLag:
    p95Ms:
      500

  lostInvalidation:
    maximum:
      0

  outboxOldestPending:
    maximumAge:
      30s

  duplicateProcessing:
    allowed:
      true

  staleCriticalRead:
    maximum:
      0
```

Os valores reais dependem do negócio.

---

### 35. Criar política de data quality

Arquivo:

```text
cache-invalidation-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingSourceVersion:
    result:
      limited

  missingEventId:
    action:
      fail-event

  missingOccurredAt:
    action:
      fail-event

  unknownCacheName:
    action:
      reject

  invalidNamespace:
    action:
      reject

  mixedEnvironment:
    action:
      block

  clockSkew:
    record:
      required

  staleBaseline:
    action:
      recollect
```

---

### 36. Criar política de segurança

Arquivo:

```text
cache-invalidation-security-policy.yaml
```

Conteúdo:

```yaml
security:
  event:
    forbidden:
      - cache-value
      - token
      - password
      - email
      - customer-data

  key:
    raw:
      forbiddenInLogs

  tenant:
    scope:
      required

  topic:
    authorization:
      required

  outbox:
    sensitivePayload:
      forbidden

  evidence:
    identifiers:
      sanitized
```

---

### 37. Criar failure policy

Arquivo:

```text
cache-invalidation-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  afterCommitCallbackFailure:
    action:
      record-and-repair

  outboxPublishFailure:
    action:
      retry-bounded

  brokerUnavailable:
    action:
      keep-outbox-pending

  consumerFailure:
    action:
      retry-idempotent

  RedisUnavailable:
    action:
      preserve-event-and-fallback

  lostEventSuspected:
    action:
      reconciliation

  staleCriticalRead:
    action:
      bypass-cache

  loadTesting:
    deferredToLesson585
```

---

### 38. Criar cenários

Arquivo:

```text
cache-invalidation-scenarios.yaml
```

Cenários:

```text
after-commit-success;

transaction-rollback;

callback-failure;

outbox-success;

outbox-publish-failure;

duplicate-event;

reordered-event;

delayed-event;

consumer-restart;

Redis-unavailable;

read-write-race;

delete-during-load;

tombstone-prevents-resurrection;

version-token-rejects-old-value;

namespace-bump;

repair-on-read;

reconciliation-detects-stale;

rollback-to-TTL-only.
```

Cada cenário registra:

- cache;
- source version;
- event version;
- ordering;
- Redis state;
- outbox state;
- expected result;
- observed result;
- repair;
- rollback;
- evidence.

---

### 39. Simular lost invalidation

Script:

```text
simulate-cache-lost-event.ps1
```

Fluxo:

1. aquecer cache v10;
2. commitar v11;
3. impedir o publisher;
4. confirmar outbox pendente;
5. validar que evento não desapareceu;
6. restaurar publisher;
7. publicar;
8. invalidar;
9. recarregar v11;
10. medir lag.

A outbox transforma “perda” em atraso observável.

---

### 40. Validar outbox

Script:

```text
validate-cache-invalidation-outbox.ps1
```

Valide:

- evento no mesmo commit;
- rollback remove evento;
- publisher não marca antes do broker;
- retry incrementa attempts;
- duplicate delivery é segura;
- published timestamp;
- oldest pending;
- cleanup controlado;
- índice de pendentes.

---

### 41. Comparar estratégias

Script:

```text
compare-cache-invalidation-strategies.ps1
```

Compare:

```text
TTL-only;

evict-after-commit;

outbox + durable event;

pub/sub only;

versioned update;

tombstone;

namespace bump.
```

Critérios:

- correctness;
- lag;
- complexity;
- failure tolerance;
- source pressure;
- memory;
- operability;
- rollback.

`pub/sub only` deve falhar para entrega crítica.

---

### 42. Criar gate de invalidação

Script:

```text
enforce-cache-invalidation-budget.ps1
```

Valide:

- afterCommit;
- outbox;
- event schema;
- idempotência;
- ordering;
- lag;
- duplicates;
- lost event;
- tombstone;
- repair;
- reconciliation;
- security;
- rollback.

Status:

```text
PASS;

FAIL_BEFORE_COMMIT;

FAIL_LOST_EVENT;

FAIL_ORDERING;

FAIL_STALE_READ;

FAIL_TOMBSTONE;

FAIL_REPAIR;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 43. Validar rollback

Script:

```text
validate-cache-invalidation-rollback.ps1
```

Procedimento:

1. executar estratégia avançada;
2. coletar métricas;
3. desabilitar consumidor;
4. voltar ao profile TTL-only;
5. limpar apenas namespace do laboratório;
6. reiniciar controladamente;
7. validar leitura da origem;
8. confirmar correção;
9. preservar evidence;
10. reabilitar componentes conforme necessário.

O rollback pode reduzir freshness, mas não pode quebrar correção.

---

### 44. Criar matriz de testes

Arquivo:

```text
CACHE_INVALIDATION_TEST_MATRIX.md
```

Cenários:

- after commit;
- rollback;
- callback failure;
- outbox insert;
- outbox publish;
- duplicate;
- reordering;
- delay;
- consumer restart;
- Redis unavailable;
- version token;
- stale write;
- tombstone;
- delete race;
- namespace bump;
- pub/sub gap;
- repair-on-read;
- reconciliation;
- lost event;
- security;
- rollback;
- evidence sanitizada.

---

### 45. Criar troubleshooting

Arquivo:

```text
CACHE_INVALIDATION_TROUBLESHOOTING.md
```

Inclua:

- cache continua antigo;
- invalidação ocorre antes do commit;
- rollback remove entrada;
- outbox cresce;
- publisher marca cedo;
- eventos duplicados;
- eventos fora de ordem;
- consumidor perdeu mensagem;
- tombstone nunca expira;
- recurso deletado reaparece;
- namespace antigo cresce;
- repair-on-read sobrecarrega origem;
- reconciliação demora;
- pub/sub funciona apenas com subscriber online;
- versão ausente;
- relógios divergentes;
- identificador sensível no evento;
- load testing antecipado.

---

### 46. Coletar evidence

Script:

```text
collect-cache-invalidation-evidence.ps1
```

Arquivo:

```text
cache-invalidation-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- cache name;
- strategy;
- after-commit status;
- outbox status;
- event schema status;
- idempotency status;
- ordering status;
- lag category;
- duplicate category;
- tombstone status;
- race status;
- repair status;
- reconciliation status;
- failure recovery status;
- rollback status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- chave;
- valor;
- tenant;
- order ID;
- payload de negócio;
- credencial;
- hostname;
- tópico real;
- configuração real de produção;
- scripts K6;
- material da aula 585.

---

### 47. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\cache\invalidation\validate-cache-invalidation-contract.ps1

.\scripts\performance\cache\invalidation\prepare-cache-invalidation-fixture.ps1

.\scripts\performance\cache\invalidation\collect-cache-invalidation-baseline.ps1

.\scripts\performance\cache\invalidation\validate-after-commit-invalidation.ps1

.\scripts\performance\cache\invalidation\validate-cache-invalidation-event.ps1

.\scripts\performance\cache\invalidation\validate-cache-invalidation-outbox.ps1

.\scripts\performance\cache\invalidation\validate-cache-invalidation-pubsub.ps1

.\scripts\performance\cache\invalidation\validate-cache-version-token.ps1

.\scripts\performance\cache\invalidation\validate-cache-tombstone.ps1

.\scripts\performance\cache\invalidation\simulate-cache-read-write-race.ps1

.\scripts\performance\cache\invalidation\simulate-cache-event-reordering.ps1

.\scripts\performance\cache\invalidation\simulate-cache-duplicate-event.ps1

.\scripts\performance\cache\invalidation\simulate-cache-lost-event.ps1

.\scripts\performance\cache\invalidation\validate-cache-repair-on-read.ps1

.\scripts\performance\cache\invalidation\reconcile-cache-with-source.ps1

.\scripts\performance\cache\invalidation\compare-cache-invalidation-strategies.ps1

.\scripts\performance\cache\invalidation\enforce-cache-invalidation-budget.ps1

.\scripts\performance\cache\invalidation\validate-cache-invalidation-rollback.ps1

.\scripts\performance\cache\invalidation\scan-cache-invalidation-output.ps1

.\scripts\performance\cache\invalidation\collect-cache-invalidation-evidence.ps1

.\scripts\performance\cache\invalidation\verify-cache-invalidation-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- ownership aprovado;
- afterCommit aprovado;
- outbox aprovado;
- evento aprovado;
- idempotência aprovada;
- ordering aprovado;
- version token aprovado;
- pub/sub limitado ao papel correto;
- tombstone aprovado;
- races simuladas;
- repair aprovado;
- reconciliation aprovada;
- lag medido;
- falhas simuladas;
- rollback aprovado;
- segurança aprovada;
- evidence sanitizada;
- load testing não antecipado.

---

### 48. Encerrar o laboratório

Pare os cenários.

Confirme:

- publisher sem lote pendente inesperado;
- consumer saudável;
- Redis saudável;
- PostgreSQL saudável;
- nenhuma transação aberta;
- namespace correto;
- tombstones com TTL;
- evidence coletada.

Remova artifacts temporários:

```powershell
Remove-Item `
  .tmp/cache-invalidation `
  -Recurse `
  -Force
```

Limpe apenas o namespace do laboratório quando necessário.

Não execute `FLUSHALL`.

---

## Entendendo o que foi feito

### O commit ganhou prioridade

Cache deixou de ser alterado antes da confirmação da origem.

### A dupla escrita ganhou solução

Outbox tornou durável a intenção de invalidação.

### Eventos ganharam versão

Consumidores passaram a reconhecer schema e ordem.

### Duplicatas ganharam idempotência

Reprocessamento deixou de causar efeito incorreto.

### Reordenação ganhou source version

Eventos antigos deixaram de sobrescrever estados novos.

### Deletes ganharam tombstones

Leituras atrasadas deixaram de ressuscitar recursos.

### Pub/sub ganhou limite

Notificação efêmera deixou de ser confundida com entrega confiável.

### Lost invalidation ganhou reparação

TTL, repair-on-read e reconciliation passaram a limitar divergência.

### Lag ganhou métrica

A janela real de staleness passou a ser mensurável.

### Rollback ganhou segurança

O sistema voltou a TTL-only sem perder correção.

### A próxima aula ganhou fronteira

A aula 585 irá modelar carga, usuários virtuais, ramp-up e thresholds.

---

## Erros comuns importantes

### Invalidar antes do commit

Rollback pode recarregar estado antigo ou criar incoerência.

### Atualizar cache e banco sem outbox

A falha entre operações perde a invalidação.

### Confiar apenas em Pub/Sub

Subscriber offline perde a mensagem.

### Ignorar duplicatas

Brokers podem entregar mais de uma vez.

### Ignorar reordenação

Evento antigo pode sobrescrever valor novo.

### Usar TTL como única garantia

A janela de stale pode ser longa demais.

### Remover todo o Redis

Outros namespaces podem ser afetados.

### Não versionar eventos

Deploys incompatíveis quebram consumidores.

### Criar tombstone sem TTL

Marcas antigas podem crescer indefinidamente.

### Antecipar K6 ou Gatling

Load testing pertence à aula 585.

---

## Comandos úteis

### Consultar outbox pendente

```sql
SELECT
    count(*) AS pending,
    min(occurred_at) AS oldest
FROM cache_invalidation_outbox
WHERE published_at IS NULL;
```

### Inspecionar namespace

```powershell
docker compose `
  exec `
  redis `
  redis-cli `
  --scan `
  --pattern `
  "orders:lab:v1:*"
```

### Validar outbox

```powershell
.\scripts\performance\cache\invalidation\validate-cache-invalidation-outbox.ps1
```

### Simular race

```powershell
.\scripts\performance\cache\invalidation\simulate-cache-read-write-race.ps1
```

### Executar gate

```powershell
.\scripts\performance\cache\invalidation\enforce-cache-invalidation-budget.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Crie catálogo, owner e triggers.

### Parte 2 — After commit

Valide update, commit e rollback.

### Parte 3 — Outbox

Persista evento no mesmo commit.

### Parte 4 — Event

Versione schema e source version.

### Parte 5 — Idempotency

Processe duplicatas com segurança.

### Parte 6 — Ordering

Simule eventos fora de ordem.

### Parte 7 — Tombstone

Evite ressurreição após delete.

### Parte 8 — Repair

Valide repair-on-read e reconciliation.

### Parte 9 — Failure

Simule publisher, consumer e Redis indisponíveis.

### Parte 10 — Gate

Valide lag, segurança, rollback e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 583 e ponte para a aula 585 foram preservadas;
- invalidation, eviction, after-commit, double write, outbox, event, idempotency, ordering, version token, versioned key, namespace bump, tombstone, repair, reconciliation e race foram definidos;
- contrato, catálogo e ownership foram criados;
- invalidação ocorre somente após commit;
- rollback não remove nem atualiza cache indevidamente;
- risco de dupla escrita foi demonstrado;
- tabela outbox e índice de pendentes foram criados;
- evento é persistido no mesmo commit da mudança;
- publisher marca sucesso somente após confirmação do broker;
- evento possui ID, versão, tenant scope, resource ID, cache name, source version e timestamp;
- payload de cache e dados pessoais foram proibidos no evento;
- consumidor é idempotente;
- duplicatas foram simuladas;
- ordenação usa resource ID e source version;
- evento antigo não sobrescreve estado novo;
- namespace bump foi usado para schema incompatível;
- Redis Pub/Sub foi tratado como não durável;
- tombstone foi criado com versão e TTL;
- delete race foi simulada;
- versão antiga não ressuscita recurso removido;
- read-write race foi simulada com barreiras controladas;
- repair-on-read e reconciliation foram implementados de forma bounded;
- lost invalidation virou atraso observável pela outbox;
- invalidation lag foi medido;
- budgets de lag, pendência e stale foram criados;
- políticas de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, rollback e evidence sanitizada estão presentes;
- nenhuma chave, valor, dado pessoal, credencial ou tópico real foi commitado;
- load testing K6 ou Gatling não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/cache/invalidation `
  scripts/performance/cache/invalidation `
  docs/performance/cache/invalidation `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|tenantId|orderId|cacheKey|cacheValue|customerData|realTopic|k6|gatling|virtualUsers"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar invalidacao de cache"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- chaves;
- valores;
- dados pessoais;
- credentials;
- tópicos reais;
- artifacts temporários;
- configuração real de produção;
- scripts K6;
- cenários Gatling;
- material da aula 585.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou invalidação em um fluxo confiável, observável e reparável.

Você trabalhou com:

```text
afterCommit;

outbox;

eventos versionados;

idempotência;

ordenação;

source version;

namespace bump;

pub/sub;

tombstones;

races;

repair-on-read;

reconciliation;

lag;

rollback.
```

Você comprovou que invalidar antes do commit é inseguro; dupla escrita entre banco e cache pode perder eventos; outbox preserva a intenção no mesmo commit; consumidores precisam aceitar duplicatas; eventos fora de ordem exigem versão; tombstones evitam ressurreição; Pub/Sub não substitui entrega durável; TTL limita, mas não resolve sozinho; repair e reconciliation oferecem rede de segurança; e a janela de stale precisa ser medida por invalidation lag.

A próxima aula será:

```text
585 - M18.30 - Load testing K6 ou Gatling conceitual
```

Nela, você irá modelar workload, usuários virtuais, arrival rate, ramp-up, thresholds, smoke, load, stress, spike e soak tests, relacionando resultados aos budgets e sinais de saturação.

Nenhum script K6, simulation Gatling, virtual user, arrival rate, ramp-up, threshold, soak test, spike test ou stress test foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Invalidei após commit.
- [ ] Criei outbox.
- [ ] Versionei eventos.
- [ ] Validei duplicatas.
- [ ] Validei reordenação.
- [ ] Criei tombstones.
- [ ] Simulei races.
- [ ] Validei repair e reconciliation.

---

## Troubleshooting adicional

### Cache permanece antigo

Verifique commit, outbox, publisher, consumer, namespace e Redis.

### Outbox cresce

Revise broker, retry, erro do publisher e checkpoint.

### Evento duplicado gera falha

A operação de invalidação não está idempotente.

### Evento antigo sobrescreve novo

Compare source version antes de atualizar o cache.

### Recurso deletado reaparece

Implemente tombstone ou rejeição de escrita antiga.

### Pub/Sub funciona apenas às vezes

Subscriber desconectado perde mensagens; use entrega durável.

### Repair aumenta queries

Limite taxa, escopo e gatilhos de reparação.

### Namespace antigo cresce

Planeje cleanup depois da janela de rollback.

### Lag de invalidação aumenta

Separe atraso de outbox, broker, consumer e Redis.

### Surgiram usuários virtuais e ramp-up

Preserve esse trabalho para a aula 585.

---

## Perguntas de revisão

1. O que é cache invalidation?
2. Por que invalidar após commit?
3. O que é double write?
4. Como outbox reduz perda de evento?
5. Por que o consumidor precisa ser idempotente?
6. Como tratar eventos duplicados?
7. Como tratar eventos fora de ordem?
8. O que é source version?
9. O que é namespace bump?
10. Para que serve tombstone?
11. O que é read-write race?
12. O que é lost invalidation?
13. Qual limite do Redis Pub/Sub?
14. O que é repair-on-read?
15. O que é reconciliation?
16. O que é invalidation lag?
17. TTL resolve tudo?
18. Como validar rollback?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Remover ou substituir cópia obsoleta.
2. Evitar incoerência em rollback.
3. Banco e cache alterados separadamente.
4. Evento entra no mesmo commit.
5. Duplicatas são esperadas.
6. Repetir sem efeito incorreto.
7. Comparar versão.
8. Versão autoritativa do estado.
9. Troca de prefixo versionado.
10. Marcar remoção e impedir ressurreição.
11. Leitura antiga compete com escrita nova.
12. Mudança sem invalidação entregue.
13. Não é durável.
14. Corrigir durante leitura.
15. Comparar periodicamente cache e origem.
16. Tempo entre commit e remoção.
17. Não; apenas limita staleness.
18. Voltar a TTL-only e confirmar correção.
19. Load testing conceitual.
20. Load testing K6 ou Gatling conceitual.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 584 - M18.29 - Cache invalidation

- Continuei após Cache distribuído Redis.
- Entendi invalidação como preservação de coerência com a fonte.
- Criei contrato, catálogo e ownership.
- Invalidei somente após commit.
- Evitei alteração do cache antes da confirmação da transação.
- Demonstrei o risco de dupla escrita.
- Criei tabela e política de outbox.
- Persisti evento no mesmo commit do negócio.
- Criei evento versionado sem valor do cache.
- Publiquei outbox com retry bounded e checkpoint.
- Tornei o consumidor idempotente.
- Simulei eventos duplicados.
- Modelei ordenação por resource ID e source version.
- Impedi evento antigo de sobrescrever estado novo.
- Usei namespace bump para mudança incompatível.
- Tratei Redis Pub/Sub como canal não durável.
- Criei tombstone com versão e TTL.
- Simulei delete race e read-write race.
- Impedi ressurreição de recurso removido.
- Criei repair-on-read e reconciliação bounded.
- Transformei lost invalidation em atraso observável.
- Medi invalidation lag e outbox age.
- Criei policies de qualidade, segurança e failure.
- Comparei TTL-only, after-commit, outbox, version e tombstone.
- Validei rollback para TTL-only.
- Coletei evidence sanitizada.
- Não antecipei K6 ou Gatling.
- Próxima aula: Load testing K6 ou Gatling conceitual.
```

---

## Referência técnica curta

- Cache invalidation.
- Transaction synchronization.
- Transactional Outbox.
- Idempotent consumers.
- Event ordering.
- Version tokens.
- Tombstones.
- Repair-on-read.
- Reconciliation.
- Redis Pub/Sub limitations.

Regra final:

```text
cache invalidation precisa preservar a ordem entre fonte, commit, evento e leitores: nenhuma entrada é removida ou atualizada antes do commit, mudanças distribuídas registram a intenção em outbox no mesmo commit, eventos possuem ID, schema version, source version e tenant scope, e consumidores são idempotentes e tolerantes a duplicatas; eventos fora de ordem não sobrescrevem versões novas, deletes usam tombstones ou version tokens para impedir ressurreição, Pub/Sub não substitui entrega durável, e namespace bump isola schemas incompatíveis sem flush global; lost invalidation torna-se atraso observável por outbox age e invalidation lag, enquanto TTL, repair-on-read e reconciliation bounded funcionam como redes de segurança; chaves, valores e dados pessoais permanecem fora de logs, eventos e evidence, deixando para a aula 585 a modelagem de workloads, usuários virtuais, arrival rate, ramp-up, thresholds e testes smoke, load, stress, spike e soak com K6 ou Gatling.
```
