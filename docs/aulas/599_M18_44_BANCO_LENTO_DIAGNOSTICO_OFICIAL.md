# 599 - M18.44 - Banco lento diagnostico

## Apresentação da aula

Na aula 598, você diagnosticou CPU alta usando capacidade, quota, throttling, CPU por processo, CPU por thread, thread dumps, JFR, async-profiler e flame graphs.

Você aprendeu que:

```text
CPU alta
não deve ser explicada
por adivinhação;

é preciso identificar
capacidade,
thread,
stack
e método quente.
```

Nesta aula, o foco muda para a persistência.

A pergunta central será:

```text
por que uma operação
que depende do banco

está demorando

e em qual etapa
essa latência
está sendo criada?
```

Quando alguém diz:

```text
o banco está lento,
```

essa frase ainda é ampla demais.

A lentidão pode estar em:

- fila para obter conexão;
- criação de conexão;
- DNS;
- rede;
- TLS;
- pool esgotado;
- query esperando lock;
- query executando;
- query lendo muitos blocos;
- query retornando muitas linhas;
- driver convertendo tipos;
- aplicação serializando resultado;
- transação aberta;
- commit;
- rollback;
- autovacuum concorrendo por recursos;
- estatísticas desatualizadas;
- índice ausente;
- índice inadequado;
- cardinalidade estimada incorretamente;
- bloat;
- I/O;
- CPU do banco;
- cache do banco frio;
- fetch size;
- N+1;
- consultas repetidas;
- timeout mal alinhado;
- pool grande demais;
- pool pequeno demais.

Por isso, o diagnóstico precisa separar etapas.

A jornada será tratada como:

```text
espera no pool;

aquisição de conexão;

envio da query;

espera por lock;

execução;

leitura de páginas;

transferência de linhas;

mapeamento no driver;

processamento na aplicação;

commit ou rollback.
```

Uma query lenta também não é necessariamente uma query ruim.

Ela pode estar bloqueada por outra transação.

Ela pode usar um plano adequado, mas ler dados demais porque a requisição pediu volume excessivo.

Ela pode ser rápida no banco e lenta na aplicação por causa de:

- muitas linhas;
- conversão;
- paginação incorreta;
- serialização;
- GC;
- rede;
- consumo posterior.

Nesta aula, você irá trabalhar com:

- HikariCP;
- active connections;
- idle connections;
- pending connections;
- acquisition time;
- connection timeout;
- transaction duration;
- query duration;
- lock wait;
- `pg_stat_activity`;
- `pg_stat_statements`;
- `EXPLAIN`;
- `EXPLAIN ANALYZE`;
- estimated rows;
- actual rows;
- sequential scan;
- index scan;
- bitmap scan;
- nested loop;
- hash join;
- merge join;
- sort;
- aggregate;
- buffers;
- planning time;
- execution time;
- shared hit;
- shared read;
- temp read;
- temp written;
- indexes;
- selectivity;
- cardinality;
- statistics;
- autovacuum;
- analyze;
- bloat;
- N+1;
- pagination;
- batch;
- statement timeout;
- lock timeout;
- runbook de diagnóstico.

O laboratório continuará usando PostgreSQL local e dados sintéticos.

Nenhuma query de produção será executada sem autorização.

`EXPLAIN ANALYZE` executa a query.

Portanto:

```text
EXPLAIN
é diferente de
EXPLAIN ANALYZE.
```

Em comandos de escrita, `EXPLAIN ANALYZE` pode alterar dados se não houver proteção transacional adequada.

A próxima aula oficial será:

```text
600 - M18.45 - Runbook de incidente
```

Por isso, esta aula irá criar um runbook específico para banco lento, mas não irá construir ainda o runbook transversal completo para incidentes de produção envolvendo papéis, severidade, comunicação, escalonamento, timeline e postmortem.

A regra central será:

```text
antes de culpar
a query,

separe
pool,
lock,
execução,
I/O,
transferência
e aplicação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
597:
Memory leak diagnostico.

598:
CPU high diagnostico.

599:
Banco lento diagnostico.

600:
Runbook de incidente.
```

A progressão é:

```text
diagnosticar retenção;

diagnosticar CPU;

diagnosticar persistência;

operacionalizar resposta a incidentes.
```

Nesta aula:

```text
pool JDBC:
sim.

pg_stat_activity:
sim.

pg_stat_statements:
sim.

EXPLAIN:
sim.

EXPLAIN ANALYZE:
sim,
com segurança.

índices:
sim.

locks:
sim.

N+1:
sim.

vacuum e analyze:
sim.

bloat:
triagem.

runbook específico:
sim.

runbook transversal:
não aprofundar.
```

Você reutilizará:

- timeouts;
- tracing;
- métricas;
- HikariCP;
- PostgreSQL;
- logs;
- JFR;
- load testing;
- stress testing;
- runbooks;
- evidências sanitizadas.

O diagnóstico precisa preservar:

- dados sintéticos;
- ambiente controlado;
- mesma carga;
- mesma versão;
- mesmo schema;
- mesmo volume;
- mesmas estatísticas;
- consultas parametrizadas;
- segurança;
- cleanup;
- ausência de SQL sensível no Git.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/database-slow
├── database-slow-contract.yaml
├── database-slow-scenario-catalog.yaml
├── database-slow-pool-policy.yaml
├── database-slow-query-policy.yaml
├── database-slow-lock-policy.yaml
├── database-slow-plan-policy.yaml
├── database-slow-index-policy.yaml
├── database-slow-statistics-policy.yaml
├── database-slow-vacuum-policy.yaml
├── database-slow-bloat-policy.yaml
├── database-slow-pagination-policy.yaml
├── database-slow-n-plus-one-policy.yaml
├── database-slow-observability-policy.yaml
├── database-slow-shutdown-policy.yaml
├── database-slow-data-quality-policy.yaml
├── database-slow-security-policy.yaml
├── database-slow-failure-policy.yaml
├── database-slow-scenarios.yaml
└── database-slow-evidence.yaml

performance/database-slow/src/main/java
└── br/com/formacao/performance/database
    ├── DatabaseStage.java
    ├── DatabaseOutcome.java
    ├── PoolSnapshot.java
    ├── QuerySample.java
    ├── QueryPlanSummary.java
    ├── LockWaitSnapshot.java
    ├── DatabaseRunSummary.java
    ├── SlowQueryRepository.java
    ├── NPlusOneService.java
    ├── BatchedOrderRepository.java
    ├── KeysetPaginationRepository.java
    ├── DatabaseSlowScenarioRunner.java
    ├── DatabaseSlowMetrics.java
    └── DatabaseSlowDemo.java

performance/database-slow/src/test/java
└── br/com/formacao/performance/database
    ├── PoolExhaustionTest.java
    ├── LockWaitScenarioTest.java
    ├── SequentialScanScenarioTest.java
    ├── IndexScenarioTest.java
    ├── NPlusOneScenarioTest.java
    ├── BatchQueryScenarioTest.java
    ├── OffsetPaginationTest.java
    ├── KeysetPaginationTest.java
    ├── DatabaseSlowRegressionTest.java
    └── DatabaseSlowContractTest.java

performance/database-slow/reports
├── database-baseline-report.yaml
├── database-pool-report.yaml
├── database-lock-report.yaml
├── database-query-report.yaml
├── database-plan-report.yaml
├── database-index-report.yaml
├── database-statistics-report.yaml
├── database-regression-report.yaml
└── database-slow-gate-report.yaml

scripts/performance/database-slow
├── validate-database-slow-contract.ps1
├── validate-database-slow-scenarios.ps1
├── prepare-database-slow-fixtures.ps1
├── run-database-slow-baseline.ps1
├── simulate-pool-exhaustion.ps1
├── simulate-lock-wait.ps1
├── collect-pg-stat-activity.ps1
├── collect-pg-stat-statements.ps1
├── collect-query-plan.ps1
├── collect-query-plan-analyze.ps1
├── analyze-query-plan.ps1
├── validate-index-fix.ps1
├── validate-statistics-refresh.ps1
├── validate-vacuum-health.ps1
├── analyze-table-bloat.ps1
├── validate-n-plus-one-fix.ps1
├── validate-pagination-fix.ps1
├── validate-database-slow-regression.ps1
├── validate-database-slow-observability.ps1
├── validate-database-slow-shutdown.ps1
├── scan-database-slow-output.ps1
├── collect-database-slow-evidence.ps1
└── verify-database-slow-baseline.ps1

docs/performance/database-slow
├── DATABASE_SLOW_OVERVIEW.md
├── JDBC_POOL_DIAGNOSIS.md
├── PG_STAT_ACTIVITY_GUIDE.md
├── PG_STAT_STATEMENTS_GUIDE.md
├── EXPLAIN_GUIDE.md
├── EXPLAIN_ANALYZE_SAFETY.md
├── QUERY_PLAN_READING.md
├── INDEX_AND_CARDINALITY.md
├── LOCK_WAIT_GUIDE.md
├── VACUUM_ANALYZE_AND_BLOAT.md
├── N_PLUS_ONE_GUIDE.md
├── PAGINATION_PERFORMANCE.md
├── DATABASE_SLOW_RUNBOOK.md
├── DATABASE_SLOW_TEST_MATRIX.md
└── DATABASE_SLOW_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato;

catálogo;

baseline;

pool metrics;

lock analysis;

pg_stat views;

plan analysis;

index validation;

statistics;

vacuum triage;

N+1 fix;

pagination fix;

regression;

runbook;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### Pool acquisition time

Tempo gasto aguardando uma conexão disponível no pool.

---

### Active connection

Conexão atualmente emprestada à aplicação.

---

### Idle connection

Conexão disponível no pool.

---

### Pending connection request

Thread ou task aguardando uma conexão.

---

### Query execution time

Tempo gasto pelo banco para executar a query.

---

### Lock wait

Tempo aguardando um lock mantido por outra transação.

---

### Planning time

Tempo gasto pelo PostgreSQL para escolher o plano.

---

### Execution time

Tempo gasto executando o plano.

---

### Estimated rows

Quantidade de linhas que o otimizador espera processar.

---

### Actual rows

Quantidade de linhas realmente processadas.

---

### Selectivity

Capacidade de um predicado reduzir o conjunto de linhas.

---

### Sequential scan

Leitura sequencial da tabela.

---

### Index scan

Acesso por índice seguido de leitura das linhas correspondentes.

---

### Bitmap scan

Estratégia que combina bitmap de páginas e leitura agrupada.

---

### Cardinality misestimate

Diferença relevante entre linhas estimadas e reais.

---

### N+1

Uma query inicial seguida de várias queries adicionais por item.

---

### Bloat

Espaço ocupado por versões mortas ou estruturas que não foram compactadas conforme esperado.

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

- aula 598 validada;
- zero processos residuais;
- PostgreSQL local disponível;
- fixtures sintéticas;
- migrations aplicadas;
- HikariCP instrumentado;
- nenhum SQL real sensível será usado.

---

### 2. Criar contrato

Arquivo:

```text
database-slow-contract.yaml
```

Conteúdo:

```yaml
databaseSlow:
  required:
    - journey
    - pool
    - connection-acquisition
    - query
    - lock-wait
    - plan
    - indexes
    - statistics
    - transfer
    - application-processing
    - fix
    - regression
    - observability
    - shutdown

  explainAnalyze:
    authorization:
      required

  evidence:
    rawBusinessSQL:
      forbidden

  nextLesson:
    code:
      M18.45
```

---

### 3. Criar catálogo de cenários

Arquivo:

```text
database-slow-scenario-catalog.yaml
```

Exemplo:

```yaml
scenarios:
  - id:
      POOL-EXHAUSTION

    stage:
      connection-acquisition

    expectedSignal:
      pending-connections

  - id:
      LOCK-WAIT

    stage:
      lock

    expectedSignal:
      wait-event-Lock

  - id:
      MISSING-INDEX

    stage:
      execution

    expectedSignal:
      sequential-scan

  - id:
      N-PLUS-ONE

    stage:
      application-query-pattern

    expectedSignal:
      excessive-query-count
```

---

### 4. Criar snapshot do pool

```java
public record PoolSnapshot(
        int active,
        int idle,
        int pending,
        int total,
        Duration acquisitionP95,
        Duration acquisitionP99) {
}
```

HikariCP deve expor métricas por datasource, não por request.

---

### 5. Criar policy de pool

Arquivo:

```text
database-slow-pool-policy.yaml
```

Conteúdo:

```yaml
pool:
  observe:
    - active
    - idle
    - pending
    - maximum
    - minimum-idle
    - acquisition-time
    - connection-timeout

  pendingHigh:
    investigate:
      - long-transactions
      - connection-leak
      - slow-query
      - pool-too-small
      - downstream-saturation

  largerPoolAsFirstFix:
    forbidden

  maximum:
    alignWithDatabaseCapacity:
      required
```

---

### 6. Simular pool esgotado

Script:

```text
simulate-pool-exhaustion.ps1
```

Cenário:

```text
pool:
2 conexões.

duas transações:
mantêm conexão.

terceira operação:
aguarda.
```

Valide:

- active igual ao máximo;
- idle igual a zero;
- pending maior que zero;
- acquisition time cresce;
- query ainda não iniciou;
- timeout é classificado como pool acquisition.

---

### 7. Entender pool grande demais

Aumentar pool pode:

- elevar concorrência no banco;
- aumentar context switching;
- ampliar lock contention;
- pressionar memória;
- aumentar working set;
- criar mais queries simultâneas;
- piorar latência.

Pool deve ser dimensionado com a capacidade real do banco.

---

### 8. Criar query sample

```java
public record QuerySample(
        String operationCategory,
        Duration poolWait,
        Duration execution,
        Duration transfer,
        long rowsReturned,
        DatabaseOutcome outcome) {
}
```

Não armazene SQL bruto no relatório público.

---

### 9. Criar policy de query

Arquivo:

```text
database-slow-query-policy.yaml
```

Conteúdo:

```yaml
query:
  observe:
    - operation-category
    - execution-time
    - rows-returned
    - rows-scanned-category
    - plan-category
    - lock-wait
    - timeout-category

  parameterized:
    required

  selectStar:
    review:
      required

  unboundedResult:
    forbidden

  businessValueInLogs:
    forbidden
```

---

### 10. Usar `pg_stat_activity`

Script:

```text
collect-pg-stat-activity.ps1
```

Consulta sanitizada:

```sql
select
    pid,
    usename,
    application_name,
    state,
    wait_event_type,
    wait_event,
    backend_start,
    xact_start,
    query_start,
    state_change
from
    pg_stat_activity
where
    datname = current_database();
```

Em relatório público, categorize PIDs e usuários.

---

### 11. Interpretar estados

Estados comuns:

```text
active;

idle;

idle in transaction;

idle in transaction aborted;

disabled.
```

`idle in transaction` merece atenção porque a transação continua aberta.

Ela pode:

- manter locks;
- impedir cleanup;
- reter conexão;
- ampliar bloat;
- atrasar vacuum;
- aumentar contention.

---

### 12. Interpretar wait events

Exemplos:

- `Lock`;
- `IO`;
- `Client`;
- `LWLock`;
- `Activity`;
- `IPC`;
- `Timeout`.

Wait event precisa ser correlacionado com estado, duração e query category.

---

### 13. Simular lock wait

Script:

```text
simulate-lock-wait.ps1
```

Sessão A:

```sql
begin;

update
    lab_order
set
    status = 'PROCESSING'
where
    id = 100;
```

Sessão B:

```sql
update
    lab_order
set
    status = 'DONE'
where
    id = 100;
```

Sessão B aguarda a transação A.

Use somente fixtures sintéticas.

---

### 14. Criar policy de locks

Arquivo:

```text
database-slow-lock-policy.yaml
```

Conteúdo:

```yaml
locks:
  observe:
    - blocker-category
    - blocked-category
    - lock-type
    - relation-category
    - transaction-age
    - wait-duration

  terminateProductionBackend:
    authorization:
      required

  longTransaction:
    threshold:
      environmentSpecific

  lockTimeout:
    explicit:
      requiredForContentiousFlow
```

---

### 15. Identificar blocker

Consulta conceitual:

```sql
select
    blocked.pid as blocked_pid,
    blocker.pid as blocker_pid,
    blocked.wait_event_type,
    blocked.wait_event
from
    pg_stat_activity blocked
join
    pg_locks blocked_lock
on
    blocked_lock.pid = blocked.pid
join
    pg_locks blocker_lock
on
    blocker_lock.locktype =
        blocked_lock.locktype
    and blocker_lock.database
        is not distinct from
        blocked_lock.database
    and blocker_lock.relation
        is not distinct from
        blocked_lock.relation
join
    pg_stat_activity blocker
on
    blocker.pid = blocker_lock.pid
where
    not blocked_lock.granted
    and blocker_lock.granted;
```

Em produção, use consultas aprovadas e testadas.

---

### 16. Usar `pg_stat_statements`

Pré-requisito:

```text
shared_preload_libraries
inclui
pg_stat_statements.
```

Consulta:

```sql
select
    queryid,
    calls,
    total_exec_time,
    mean_exec_time,
    rows,
    shared_blks_hit,
    shared_blks_read,
    temp_blks_read,
    temp_blks_written
from
    pg_stat_statements
order by
    total_exec_time desc
limit 20;
```

---

### 17. Interpretar impacto total

Uma query pode não ser a mais lenta por chamada, mas consumir mais tempo acumulado.

Exemplo:

```text
query A:
2 segundos;
10 chamadas;
20 segundos total.

query B:
100 ms;
100.000 chamadas;
10.000 segundos total.
```

Por isso, observe:

- total time;
- mean time;
- calls;
- rows;
- I/O;
- temp usage.

---

### 18. Criar policy de plano

Arquivo:

```text
database-slow-plan-policy.yaml
```

Conteúdo:

```yaml
plan:
  collect:
    - node-types
    - estimated-rows
    - actual-rows
    - loops
    - planning-time
    - execution-time
    - buffers
    - temp-usage

  explain:
    safeByDefault:
      true

  explainAnalyze:
    executesQuery:
      true

    authorization:
      required

  production:
    writeStatementAnalyze:
      forbiddenWithoutRollbackPlan
```

---

### 19. Usar `EXPLAIN`

Exemplo:

```sql
explain
select
    id,
    customer_id,
    status,
    created_at
from
    lab_order
where
    customer_id = 5000;
```

`EXPLAIN` mostra o plano estimado sem executar a query.

---

### 20. Usar `EXPLAIN ANALYZE`

Exemplo de leitura:

```sql
explain
    (analyze, buffers, verbose, format json)
select
    id,
    customer_id,
    status,
    created_at
from
    lab_order
where
    customer_id = 5000;
```

Isso executa a consulta.

Use em ambiente controlado e com dados sintéticos.

---

### 21. Ler plan nodes

Nós comuns:

- `Seq Scan`;
- `Index Scan`;
- `Index Only Scan`;
- `Bitmap Index Scan`;
- `Bitmap Heap Scan`;
- `Nested Loop`;
- `Hash Join`;
- `Merge Join`;
- `Sort`;
- `Aggregate`;
- `Limit`;
- `Gather`;
- `Gather Merge`.

Nenhum nó é sempre bom ou ruim.

---

### 22. Entender sequential scan

Sequential scan pode ser adequado quando:

- tabela é pequena;
- grande parte das linhas será lida;
- índice não é seletivo;
- leitura sequencial é mais barata;
- dados já estão em cache.

Não crie índice apenas porque apareceu `Seq Scan`.

---

### 23. Entender index scan

Index scan ajuda quando:

- predicado é seletivo;
- poucas linhas retornam;
- índice cobre colunas relevantes;
- ordenação pode ser aproveitada;
- custo de leitura aleatória é aceitável.

Índice também possui custo de:

- armazenamento;
- escrita;
- vacuum;
- cache;
- manutenção;
- lock;
- planejamento.

---

### 24. Criar policy de índice

Arquivo:

```text
database-slow-index-policy.yaml
```

Conteúdo:

```yaml
index:
  proposeFrom:
    - workload
    - predicate
    - selectivity
    - ordering
    - join
    - projection
    - write-cost

  duplicate:
    forbidden

  unused:
    review:
      required

  createInProduction:
    plan:
      required

  regression:
    compareReadAndWrite:
      required
```

---

### 25. Validar índice

Script:

```text
validate-index-fix.ps1
```

Compare antes e depois:

- plan node;
- estimated rows;
- actual rows;
- buffers hit;
- buffers read;
- execution time;
- rows returned;
- write overhead;
- index size.

---

### 26. Detectar cardinalidade incorreta

Sinal:

```text
estimated rows:
10.

actual rows:
100.000.
```

Essa diferença pode levar o planner a escolher join ou scan inadequado.

Investigue:

- estatísticas antigas;
- distribuição desigual;
- correlação entre colunas;
- expressão;
- função;
- cast;
- parâmetro;
- dados extremos.

---

### 27. Atualizar estatísticas

Script:

```text
validate-statistics-refresh.ps1
```

Comando:

```sql
analyze
    lab_order;
```

Depois, recalcule o plano.

Não use `ANALYZE` como cura automática sem entender por que as estatísticas ficaram inadequadas.

---

### 28. Criar policy de estatísticas

Arquivo:

```text
database-slow-statistics-policy.yaml
```

Conteúdo:

```yaml
statistics:
  observe:
    - last-analyze
    - last-autoanalyze
    - estimated-vs-actual
    - column-distribution
    - correlation

  refresh:
    validateImpact:
      required

  extendedStatistics:
    evaluateForCorrelatedColumns:
      true

  staleStatistics:
    evidence:
      required
```

---

### 29. Entender joins

`Nested Loop` pode ser excelente para poucos registros e índice eficiente.

`Hash Join` pode ser adequado para conjuntos maiores.

`Merge Join` pode ser útil quando entradas estão ordenadas.

O diagnóstico observa:

- tamanho de cada lado;
- loops;
- rows;
- filtros;
- spills;
- buffers;
- estimativas;
- índices disponíveis.

---

### 30. Detectar sort e spill

Sort grande pode usar memória e depois disco.

No plano, procure:

```text
Sort Method;

Memory;

Disk.
```

Também observe:

- temp blocks read;
- temp blocks written;
- `work_mem`;
- volume;
- ordenação desnecessária;
- índice que poderia fornecer ordem.

Não aumente `work_mem` globalmente sem avaliar multiplicação por operações concorrentes.

---

### 31. Criar policy de vacuum

Arquivo:

```text
database-slow-vacuum-policy.yaml
```

Conteúdo:

```yaml
vacuum:
  observe:
    - last-vacuum
    - last-autovacuum
    - dead-tuples
    - live-tuples
    - vacuum-count
    - autovacuum-count

  disabled:
    forbiddenWithoutReason

  manualVacuum:
    authorization:
      required

  full:
    production:
      highRisk
```

---

### 32. Verificar saúde do vacuum

Consulta:

```sql
select
    relname,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
from
    pg_stat_user_tables
order by
    n_dead_tup desc;
```

Dead tuples sozinhos não provam bloat grave.

Correlacione com:

- tamanho;
- churn;
- autovacuum;
- long transactions;
- espaço;
- planos;
- I/O.

---

### 33. Triar bloat

Script:

```text
analyze-table-bloat.ps1
```

A triagem verifica:

- tamanho da tabela;
- tamanho dos índices;
- dead tuples;
- crescimento;
- frequência de update/delete;
- autovacuum;
- transações antigas;
- espaço desperdiçado estimado.

Não execute `VACUUM FULL` como primeira ação.

---

### 34. Detectar N+1

Exemplo ruim:

```java
List<Order> orders =
        orderRepository.findAll();

for (Order order : orders) {
    customerRepository.findById(
            order.customerId());
}
```

Uma query busca pedidos.

Depois, uma query adicional busca cada cliente.

---

### 35. Criar policy de N+1

Arquivo:

```text
database-slow-n-plus-one-policy.yaml
```

Conteúdo:

```yaml
NPlusOne:
  observe:
    - query-count-per-journey
    - repeated-operation-category
    - rows
    - total-database-time

  fixCandidates:
    - join
    - fetch-join
    - batch-fetch
    - IN-query
    - projection

  giantJoin:
    review:
      required

  regression:
    maximumQueryCount:
      required
```

---

### 36. Corrigir N+1

Opções:

```text
join;

fetch join;

batch fetch;

IN query;

projection;

preload;

cache,
quando apropriado.
```

A correção deve evitar:

- resultado cartesiano gigante;
- duplicação;
- excesso de colunas;
- perda de paginação;
- heap excessivo.

---

### 37. Validar N+1

Script:

```text
validate-n-plus-one-fix.ps1
```

Compare:

- número de queries;
- tempo total;
- linhas transferidas;
- CPU da aplicação;
- heap;
- p95;
- p99;
- funcionalidade.

---

### 38. Diagnosticar paginação por offset

Query:

```sql
select
    id,
    created_at
from
    lab_order
order by
    created_at,
    id
offset
    500000
limit
    50;
```

O banco pode precisar percorrer grande volume antes de descartar linhas.

---

### 39. Implementar keyset pagination

Query:

```sql
select
    id,
    created_at
from
    lab_order
where
    (created_at, id)
        >
    (:lastCreatedAt, :lastId)
order by
    created_at,
    id
limit
    50;
```

Requer ordenação estável e cursor coerente.

---

### 40. Criar policy de paginação

Arquivo:

```text
database-slow-pagination-policy.yaml
```

Conteúdo:

```yaml
pagination:
  offset:
    large:
      review:
        required

  keyset:
    requires:
      - stable-order
      - unique-tie-breaker
      - cursor-contract

  pageSize:
    bounded:
      required

  totalCount:
    expensive:
      evaluate:
        required
```

---

### 41. Validar paginação

Script:

```text
validate-pagination-fix.ps1
```

Compare páginas iniciais e profundas.

Valide:

- plan;
- execution time;
- buffers;
- rows removed;
- estabilidade;
- ausência de duplicação;
- ausência de perda.

---

### 42. Separar execução e transferência

Uma query pode executar rápido e retornar milhões de linhas.

Depois, o tempo aparece em:

- socket;
- driver;
- deserialização;
- mapper;
- heap;
- JSON;
- resposta HTTP.

Registre:

```text
database execution;

rows returned;

fetch duration;

mapping duration;

serialization duration.
```

---

### 43. Usar fetch size

Fetch size pode reduzir uso de memória e controlar transferência.

Porém:

- sem transação adequada, o driver pode materializar;
- valor pequeno aumenta round trips;
- valor grande aumenta memória;
- comportamento varia por driver.

Valide no PostgreSQL JDBC usado.

---

### 44. Criar observabilidade

Arquivo:

```text
database-slow-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  pool:
    required:
      - active
      - idle
      - pending
      - acquisition-time

  database:
    required:
      - query-duration
      - lock-wait
      - rows-returned-category
      - timeout-category
      - calls
      - total-time

  application:
    required:
      - mapping-time
      - serialization-time
      - query-count-per-journey

  labels:
    forbidden:
      - raw-SQL
      - parameter-value
      - customer-id
      - order-id
```

---

### 45. Criar tracing por estágio

Span conceitual:

```text
database.pool.acquire;

database.query.execute;

database.rows.fetch;

database.result.map;

response.serialize.
```

Não registre SQL com valores sensíveis.

Use operation category e query fingerprint aprovado.

---

### 46. Criar policy de shutdown

Arquivo:

```text
database-slow-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewQueries:
    required

  transactions:
    completeOrRollback:
      required

  statements:
    cancelWhenSupported:
      true

  connections:
    returnOrClose:
      required

  pool:
    close:
      required

  zeroConnectionLeak:
    required
```

---

### 47. Criar data quality policy

Arquivo:

```text
database-slow-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  differentDataset:
    result:
      invalid-comparison

  differentStatistics:
    result:
      limited

  planWithoutActual:
    result:
      estimated-only

  analyzeWithoutAuthorization:
    action:
      block

  missingPoolMetrics:
    result:
      incomplete

  missingRowsReturned:
    result:
      limited

  singleExecution:
    result:
      limited
```

---

### 48. Criar security policy

Arquivo:

```text
database-slow-security-policy.yaml
```

Conteúdo:

```yaml
security:
  SQL:
    rawBusinessQuery:
      forbiddenInEvidence

  parameter:
    rawValue:
      forbidden

  activity:
    queryText:
      sanitize:
        required

  explain:
    output:
      review:
        required

  credentials:
    forbidden

  productionKill:
    authorization:
      required
```

---

### 49. Criar failure policy

Arquivo:

```text
database-slow-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  EXPLAIN_ANALYZE_write_without_protection:
    action:
      reject

  poolIncreaseWithoutCapacityReview:
    action:
      reject-fix

  indexWithoutWorkloadEvidence:
    action:
      reject

  VACUUM_FULL_as_first_action:
    action:
      reject

  terminateBackendWithoutAuthorization:
    action:
      reject

  incidentRunbookTransversal:
    deferredToLesson600
```

---

### 50. Criar cenários oficiais

Arquivo:

```text
database-slow-scenarios.yaml
```

Cenários:

```text
healthy-baseline;

pool-exhaustion;

connection-acquisition-timeout;

idle-in-transaction;

row-lock-wait;

long-running-query;

high-total-time-query;

sequential-scan-small-table;

sequential-scan-large-selective-query;

index-scan-fix;

cardinality-misestimate;

statistics-refresh;

nested-loop-valid;

nested-loop-problematic;

sort-in-memory;

sort-spill;

N-plus-one;

batch-fetch-fix;

offset-first-page;

offset-deep-page;

keyset-deep-page;

large-result-transfer;

fetch-size;

vacuum-health;

bloat-triage;

shutdown-zero-connection-leak.
```

Cada cenário registra:

- pool;
- activity;
- wait;
- query category;
- plan;
- rows;
- buffers;
- statistics;
- fix;
- shutdown;
- result;
- evidence.

---

### 51. Criar baseline report

Arquivo:

```text
database-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  PostgreSQL:
    version:
      recorded

  dataset:
    synthetic:
      true

  pool:
    pending:
      zero

  activity:
    lockWait:
      zero

  query:
    p95:
      withinBudget

  shutdown:
    connectionLeaks:
      zero

  result:
    PASS
```

---

### 52. Criar regressão

Script:

```text
validate-database-slow-regression.ps1
```

Compare:

- mesmo dataset;
- mesma versão;
- mesmas estatísticas;
- mesmo pool;
- mesma concorrência;
- mesmo workload;
- mesma duração;
- mesmo warmup.

Valide:

- acquisition p95;
- query p95;
- lock wait;
- rows;
- buffers;
- total time;
- query count;
- throughput;
- connection leaks.

---

### 53. Criar runbook específico

Arquivo:

```text
DATABASE_SLOW_RUNBOOK.md
```

Passos:

1. confirmar impacto;
2. identificar jornada;
3. separar pool e query;
4. verificar pending e acquisition;
5. verificar `pg_stat_activity`;
6. identificar waits e blockers;
7. verificar queries por total time;
8. coletar plano com segurança;
9. comparar estimated e actual rows;
10. analisar buffers e temp usage;
11. verificar índices;
12. verificar estatísticas;
13. verificar vacuum e transações antigas;
14. revisar N+1 e paginação;
15. aplicar correção;
16. repetir workload;
17. validar regressão;
18. preservar evidence sanitizada.

Este runbook é específico do domínio de banco.

A aula 600 irá transformar aprendizados operacionais em um runbook de incidente transversal.

---

### 54. Criar matriz de testes

Arquivo:

```text
DATABASE_SLOW_TEST_MATRIX.md
```

Cenários:

- pool active;
- pool idle;
- pool pending;
- acquisition timeout;
- idle in transaction;
- lock wait;
- blocker;
- `pg_stat_activity`;
- `pg_stat_statements`;
- total time;
- mean time;
- calls;
- `EXPLAIN`;
- `EXPLAIN ANALYZE`;
- estimated rows;
- actual rows;
- seq scan;
- index scan;
- bitmap scan;
- nested loop;
- hash join;
- sort spill;
- buffers;
- index;
- statistics;
- vacuum;
- bloat;
- N+1;
- offset;
- keyset;
- transfer;
- shutdown;
- security;
- evidence.

---

### 55. Criar troubleshooting

Arquivo:

```text
DATABASE_SLOW_TROUBLESHOOTING.md
```

Inclua:

- pending alto e banco ocioso;
- active alto e queries rápidas;
- acquisition timeout;
- idle in transaction;
- lock wait sem blocker visível;
- `pg_stat_statements` indisponível;
- plano muda entre ambientes;
- `EXPLAIN ANALYZE` perigoso;
- seq scan em tabela pequena;
- índice criado e query continua lenta;
- estimated e actual rows divergentes;
- sort spill;
- autovacuum atrasado;
- bloat suspeito;
- N+1 corrigido com join gigante;
- offset profundo;
- query rápida e resposta lenta;
- pool fechado no shutdown;
- material da aula 600 antecipado.

---

### 56. Criar gate

O gate valida:

- contrato;
- catálogo;
- baseline;
- pool;
- activity;
- locks;
- `pg_stat_statements`;
- plans;
- indexes;
- statistics;
- vacuum;
- bloat;
- N+1;
- pagination;
- transfer;
- regression;
- shutdown;
- zero connection leaks;
- segurança.

Status:

```text
PASS;

FAIL_POOL;

FAIL_LOCK_WAIT;

FAIL_QUERY_PLAN;

FAIL_INDEX;

FAIL_STATISTICS;

FAIL_VACUUM;

FAIL_N_PLUS_ONE;

FAIL_PAGINATION;

FAIL_TRANSFER;

FAIL_REGRESSION;

FAIL_CONNECTION_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 57. Coletar evidence

Script:

```text
collect-database-slow-evidence.ps1
```

Arquivo:

```text
database-slow-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- journey category;
- pool status;
- acquisition category;
- activity status;
- lock category;
- query category;
- plan category;
- index status;
- statistics status;
- vacuum status;
- bloat category;
- N+1 status;
- pagination status;
- regression status;
- shutdown status;
- connection leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- SQL bruto;
- parâmetros;
- PIDs persistidos;
- customer ID;
- order ID;
- credenciais;
- query text sensível;
- plano com valores reais;
- material transversal da aula 600.

---

### 58. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\database-slow\validate-database-slow-contract.ps1

.\scripts\performance\database-slow\validate-database-slow-scenarios.ps1

.\scripts\performance\database-slow\prepare-database-slow-fixtures.ps1

.\scripts\performance\database-slow\run-database-slow-baseline.ps1

.\scripts\performance\database-slow\simulate-pool-exhaustion.ps1

.\scripts\performance\database-slow\simulate-lock-wait.ps1

.\scripts\performance\database-slow\collect-pg-stat-activity.ps1

.\scripts\performance\database-slow\collect-pg-stat-statements.ps1

.\scripts\performance\database-slow\collect-query-plan.ps1

.\scripts\performance\database-slow\collect-query-plan-analyze.ps1

.\scripts\performance\database-slow\analyze-query-plan.ps1

.\scripts\performance\database-slow\validate-index-fix.ps1

.\scripts\performance\database-slow\validate-statistics-refresh.ps1

.\scripts\performance\database-slow\validate-vacuum-health.ps1

.\scripts\performance\database-slow\analyze-table-bloat.ps1

.\scripts\performance\database-slow\validate-n-plus-one-fix.ps1

.\scripts\performance\database-slow\validate-pagination-fix.ps1

.\scripts\performance\database-slow\validate-database-slow-regression.ps1

.\scripts\performance\database-slow\validate-database-slow-observability.ps1

.\scripts\performance\database-slow\validate-database-slow-shutdown.ps1

.\scripts\performance\database-slow\scan-database-slow-output.ps1

.\scripts\performance\database-slow\collect-database-slow-evidence.ps1

.\scripts\performance\database-slow\verify-database-slow-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- baseline aprovada;
- pool observado;
- acquisition separado de execução;
- activity coletada;
- blockers identificados;
- statements analisados;
- planos coletados com segurança;
- estimated e actual rows comparados;
- índices validados;
- estatísticas revisadas;
- vacuum triado;
- bloat classificado;
- N+1 corrigido;
- paginação validada;
- transferência observada;
- regressão aprovada;
- shutdown aprovado;
- zero connection leaks;
- segurança aprovada;
- evidence sanitizada;
- runbook transversal não antecipado.

---

### 59. Encerrar o laboratório

Confirme:

- transações concluídas ou rollback;
- sessões de teste encerradas;
- conexões devolvidas;
- pool fechado;
- fixtures removidas quando aplicável;
- nenhum blocker residual;
- nenhum SQL sensível em artefatos;
- relatórios sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/database-slow `
  -Recurse `
  -Force
```

---

## Entendendo o que foi feito

### “Banco lento” ganhou etapas

Pool, lock, execução, transferência e aplicação passaram a ser medidos separadamente.

### Pool ganhou contexto

Pending alto deixou de ser tratado automaticamente como necessidade de pool maior.

### `pg_stat_activity` ganhou operação

Estados, waits, transações e blockers passaram a orientar a investigação.

### `pg_stat_statements` ganhou impacto

Queries passaram a ser priorizadas por calls, total time, mean time, rows e I/O.

### Plano ganhou leitura

Nós, estimativas, linhas reais, loops, buffers e temp usage passaram a explicar o custo.

### Índice ganhou evidência

Criação de índice passou a depender de workload, selectivity e regressão de escrita.

### Estatísticas ganharam importância

Divergência entre estimated e actual rows passou a orientar `ANALYZE` e estatísticas estendidas.

### N+1 ganhou métrica

Contagem de queries por jornada passou a revelar custo acumulado.

### Paginação ganhou estratégia

Offset profundo passou a ser comparado com keyset pagination.

### A próxima aula ganhou fronteira

A aula 600 irá estruturar um runbook de incidente transversal.

---

## Erros comuns importantes

### Aumentar pool primeiro

Mais conexões podem piorar a concorrência no banco.

### Chamar toda espera de query lenta

A operação pode estar aguardando pool ou lock.

### Usar `EXPLAIN ANALYZE` sem segurança

A query será executada.

### Criar índice para todo `Seq Scan`

Sequential scan pode ser a melhor escolha.

### Olhar apenas mean time

Queries frequentes podem dominar o total.

### Ignorar estimated versus actual rows

O planner pode estar tomando decisões com cardinalidade incorreta.

### Corrigir N+1 com join gigante

O resultado pode multiplicar linhas e memória.

### Aumentar `work_mem` globalmente

Cada operação pode consumir sua própria parcela.

### Executar `VACUUM FULL` como primeira ação

É uma operação pesada e com implicações de lock.

### Registrar SQL e parâmetros reais

Evidências precisam ser sanitizadas.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\performance\database-slow\run-database-slow-baseline.ps1
```

### Coletar activity

```powershell
.\scripts\performance\database-slow\collect-pg-stat-activity.ps1
```

### Coletar statements

```powershell
.\scripts\performance\database-slow\collect-pg-stat-statements.ps1
```

### Coletar plano

```powershell
.\scripts\performance\database-slow\collect-query-plan.ps1
```

### Validar regressão

```powershell
.\scripts\performance\database-slow\validate-database-slow-regression.ps1
```

---

## Exercício guiado

### Parte 1 — Pool

Meça active, idle, pending e acquisition.

### Parte 2 — Activity

Identifique estados e wait events.

### Parte 3 — Locks

Encontre blocked e blocker.

### Parte 4 — Statements

Priorize por total time, calls e rows.

### Parte 5 — Plan

Compare estimated e actual rows.

### Parte 6 — Index

Valide selectivity e custo de escrita.

### Parte 7 — Statistics

Atualize e compare o plano.

### Parte 8 — N+1 e paginação

Reduza queries e evite offset profundo.

### Parte 9 — Regression

Repita o mesmo workload.

### Parte 10 — Gate

Valide shutdown, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 598 e ponte para a aula 600 foram preservadas;
- pool acquisition, active, idle, pending, lock wait, planning time, execution time, estimated rows, actual rows, selectivity, scans, cardinality, N+1 e bloat foram definidos;
- contrato, catálogo, baseline e policies foram criados;
- pool exhaustion foi reproduzido e separado de query lenta;
- `pg_stat_activity` e wait events foram analisados;
- blockers e blocked sessions foram identificados;
- `pg_stat_statements` foi usado para calls, total time, mean time, rows e I/O;
- `EXPLAIN` e `EXPLAIN ANALYZE` foram diferenciados;
- planos foram coletados com segurança;
- seq scan, index scan, bitmap scan, joins, sort e aggregate foram interpretados;
- estimated e actual rows foram comparados;
- índices foram validados com workload e custo de escrita;
- estatísticas e `ANALYZE` foram avaliados;
- sort spill e temp usage foram observados;
- vacuum e bloat foram triados sem ações destrutivas automáticas;
- N+1 foi reproduzido e corrigido;
- offset profundo foi comparado com keyset pagination;
- execução, transferência, mapping e serialização foram separados;
- regressão usa dataset, schema, estatísticas, pool e carga equivalentes;
- shutdown encerra transações, statements, conexões e pool;
- zero connection leaks foram validados;
- matriz, troubleshooting, gate, segurança e evidence estão presentes;
- nenhum SQL bruto, parâmetro, PID ou identificador real foi commitado;
- runbook transversal não foi aprofundado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/database-slow `
  scripts/performance/database-slow `
  docs/performance/database-slow `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|requestId|rawSql|queryParameter|productionPid|businessPayload|incidentCommander|statusPage"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): diagnosticar banco lento"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- SQL bruto;
- parâmetros reais;
- identificadores;
- PIDs;
- planos com valores sensíveis;
- artifacts temporários;
- runbook transversal;
- material da aula 600.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você estruturou diagnóstico de banco lento por etapas.

Você trabalhou com:

```text
HikariCP;

pool acquisition;

pg_stat_activity;

pg_stat_statements;

locks;

EXPLAIN;

EXPLAIN ANALYZE;

query plans;

indexes;

cardinality;

statistics;

vacuum;

bloat;

N+1;

pagination;

transfer;

regression.
```

Você comprovou que “banco lento” pode ser pool, lock, execução, I/O, transferência ou aplicação; que `pg_stat_activity` revela estados e waits; que `pg_stat_statements` mostra impacto acumulado; que `EXPLAIN ANALYZE` executa a query; que seq scan não é sempre ruim; que índices precisam de workload; que divergência entre linhas estimadas e reais aponta para estatísticas; que N+1 e offset profundo criam custo fora de uma única query; e que pool maior pode piorar o banco.

A próxima aula será:

```text
600 - M18.45 - Runbook de incidente
```

Nela, você irá transformar diagnóstico técnico em resposta operacional estruturada, com severidade, papéis, timeline, comunicação, coleta de evidence, mitigação, rollback, critérios de encerramento, handoff e postmortem.

Nenhum runbook transversal completo com incident commander, comunicação executiva, status page, severidade, handoff e postmortem foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Separei pool e query.
- [ ] Analisei waits e blockers.
- [ ] Usei `pg_stat_statements`.
- [ ] Li estimated e actual rows.
- [ ] Validei índice e estatísticas.
- [ ] Triei vacuum e bloat.
- [ ] Corrigi N+1 e paginação.
- [ ] Validei regressão sem connection leak.

---

## Troubleshooting adicional

### Pending alto e banco ocioso

Revise pool local, connection leaks e transações retidas.

### Query ativa e wait event Lock

Identifique blocker e duração da transação.

### `pg_stat_statements` não existe

A extensão pode não estar habilitada.

### Plano muda entre ambientes

Volume, estatísticas, versão, configurações ou parâmetros podem diferir.

### Índice não é usado

O predicado pode não ser seletivo ou o planner pode estimar outro custo.

### Estimated rows divergem

Revise estatísticas, correlação, casts e distribuição.

### Query rápida retorna muita linha

Meça fetch, mapping e serialização.

### N+1 reduziu, mas heap aumentou

O novo join pode estar retornando um resultado grande demais.

### Offset profundo continua lento

Considere keyset pagination com ordenação estável.

### O conteúdo virou resposta geral a incidente

Preserve o runbook transversal para a aula 600.

---

## Perguntas de revisão

1. O que é pool acquisition time?
2. O que significa pending no HikariCP?
3. Qual diferença entre pool wait e query time?
4. Para que serve `pg_stat_activity`?
5. Para que serve `pg_stat_statements`?
6. Qual diferença entre `EXPLAIN` e `EXPLAIN ANALYZE`?
7. O que são estimated rows?
8. O que são actual rows?
9. Seq scan é sempre ruim?
10. Quando um índice ajuda?
11. O que é cardinality misestimate?
12. O que é sort spill?
13. O que é idle in transaction?
14. O que é N+1?
15. O que é keyset pagination?
16. O que é bloat?
17. Por que pool maior pode piorar?
18. Como separar execução e transferência?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Tempo aguardando conexão.
2. Operações esperando slot.
3. Antes da conexão versus dentro do banco.
4. Ver sessões, estados e waits.
5. Agregar queries por fingerprint.
6. Um estima; o outro executa.
7. Linhas previstas.
8. Linhas observadas.
9. Não.
10. Quando o workload e selectivity justificam.
11. Diferença entre estimativa e realidade.
12. Ordenação que usa disco.
13. Transação aberta sem atividade.
14. Uma query mais várias por item.
15. Paginação por cursor estável.
16. Espaço desperdiçado por versões e estrutura.
17. Aumenta concorrência no banco.
18. Medindo banco, fetch, mapping e serialização.
19. Runbook de incidente.
20. Runbook de incidente.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 599 - M18.44 - Banco lento diagnostico

- Continuei após CPU high diagnóstico.
- Separei pool, lock, execução, transferência e aplicação.
- Criei contrato, catálogo, baseline e policies.
- Simulei pool exhaustion e acquisition timeout.
- Usei `pg_stat_activity` para states e wait events.
- Identifiquei blocked e blocker.
- Usei `pg_stat_statements` para calls, total e mean time.
- Diferenciei `EXPLAIN` e `EXPLAIN ANALYZE`.
- Li scans, joins, sorts, buffers e temp usage.
- Comparei estimated e actual rows.
- Validei índices e custo de escrita.
- Revisei estatísticas e `ANALYZE`.
- Triei vacuum, dead tuples e bloat.
- Reproduzi e corrigi N+1.
- Comparei offset e keyset pagination.
- Separei execução, fetch, mapping e serialização.
- Criei regressão com workload equivalente.
- Validei shutdown e zero connection leaks.
- Coletei evidence sanitizada.
- Não antecipei o runbook transversal.
- Próxima aula: Runbook de incidente.
```

---

## Referência técnica curta

- HikariCP metrics.
- PostgreSQL `pg_stat_activity`.
- PostgreSQL `pg_stat_statements`.
- `EXPLAIN`.
- `EXPLAIN ANALYZE`.
- Query plans.
- Index selectivity.
- PostgreSQL statistics.
- Autovacuum and bloat.
- N+1 and keyset pagination.

Regra final:

```text
diagnóstico de banco lento precisa decompor a jornada em pool acquisition, conexão, lock wait, execução, I/O, transferência, mapping e serialização: pending alto não prova falta de pool, query ativa não prova execução quando existe wait event, e pg_stat_activity, pg_stat_statements, traces e métricas de HikariCP devem ser correlacionados antes da mudança; EXPLAIN estima, EXPLAIN ANALYZE executa, planos são lidos por nodes, estimated rows, actual rows, loops, buffers, temp usage, planning e execution time, enquanto índices só são criados com workload, selectivity, ordering, joins e custo de escrita considerados; estatísticas, vacuum, transações antigas, bloat, N+1, paginação por offset, keyset, fetch size e volume retornado fazem parte da causa, regressões usam dataset, schema, pool, estatísticas e carga equivalentes, e o laboratório termina com transações encerradas, pool fechado, zero connection leaks e evidence sanitizada; severidade, incident commander, comunicação, handoff e postmortem ficam para a aula 600.
```
