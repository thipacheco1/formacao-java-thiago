# 580 - M18.25 - Performance de banco

## Apresentação da aula

Na aula 579, você aplicou budgets e sinais de saturação à camada de API. Traces e relatórios passaram a registrar quantidade de queries, tempo total no banco, espera por conexão, duração da transação, linhas retornadas e participação do banco na latência.

Agora a pergunta é:

```text
por que a consulta
custou esse tempo;

qual plano foi escolhido;

quantas linhas
foram processadas;

onde existe espera;

e como melhorar
sem criar regressão?
```

**Performance de banco** é a execução de consultas e transações com tempo, consumo, concorrência e previsibilidade compatíveis com os budgets do serviço.

Uma consulta correta ainda pode ler linhas demais, usar plano inadequado, gerar `N+1`, ordenar sem suporte, paginar por offset profundo, manter transações longas, aguardar locks, usar estatísticas antigas ou degradar escrita por excesso de índices.

O ciclo será:

```text
medir;

capturar e sanitizar;

reproduzir com dataset conhecido;

ler o plano;

formular hipótese;

alterar uma variável;

validar leitura,
escrita e concorrência;

aprovar ou reverter.
```

A pergunta central desta aula será:

```text
como diagnosticar
e melhorar consultas
PostgreSQL

usando planos,
estatísticas,
índices,
cardinalidade,
paginação,
locks
e transações?
```

Você utilizará `EXPLAIN`, `EXPLAIN ANALYZE`, `BUFFERS`, planos JSON, estatísticas PostgreSQL, índices, scans, joins, keyset pagination, fetch size, batch, transações, locks e gates de regressão.

`EXPLAIN ANALYZE` executa a consulta. Em escrita, utilize laboratório controlado, transação reversível e revisão de triggers, locks e efeitos externos.

A aula não irá dimensionar o HikariCP. Não serão definidos `maximumPoolSize`, `minimumIdle`, `connectionTimeout`, `idleTimeout`, `maxLifetime`, `keepaliveTime` ou `leakDetectionThreshold`.

Esses assuntos pertencem à próxima aula:

```text
581 - M18.26 - HikariCP tuning
```

Nesta aula, o pool será apenas observado por active, idle, pending, acquisition time, timeout e conexões potenciais.

A regra central será:

```text
não crie índice
antes de entender
consulta,
dados,
plano,
cardinalidade,
escrita
e concorrência.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
578:
Leitura de saturacao.

579:
Performance de API.

580:
Performance de banco.

581:
HikariCP tuning.
```

A progressão é:

```text
identificar saturação;

otimizar endpoints;

otimizar acesso a dados;

dimensionar o pool.
```

Nesta aula:

```text
slow queries:
sim.

EXPLAIN:
sim.

EXPLAIN ANALYZE:
sim.

BUFFERS:
sim.

pg_stat_statements:
sim.

índices:
sim.

joins:
sim.

estatísticas:
sim.

locks:
sim.

transações:
sim.

paginação:
sim.

N+1:
sim.

fetch size:
sim.

batch:
sim.

HikariCP tuning:
não.

maximumPoolSize:
não.

maxLifetime:
não.
```

Você reutilizará:

- performance budgets;
- traces;
- query count;
- dashboards;
- métricas JDBC;
- PostgreSQL;
- JPA e Hibernate;
- logs estruturados;
- cenários de carga;
- dados sintéticos;
- runbooks;
- capacidade planejada.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/database
├── database-performance-contract.yaml
├── database-query-catalog.yaml
├── database-baseline-policy.yaml
├── database-explain-policy.yaml
├── database-index-policy.yaml
├── database-cardinality-policy.yaml
├── database-join-policy.yaml
├── database-pagination-policy.yaml
├── database-fetch-policy.yaml
├── database-batch-policy.yaml
├── database-transaction-policy.yaml
├── database-lock-policy.yaml
├── database-statistics-policy.yaml
├── database-regression-policy.yaml
├── database-data-quality-policy.yaml
├── database-security-policy.yaml
├── database-failure-policy.yaml
├── database-performance-scenarios.yaml
└── database-performance-evidence.yaml

performance/database/sql
├── 001_create_performance_fixture.sql
├── 002_seed_performance_fixture.sql
├── 003_enable_pg_stat_statements.sql
├── 004_baseline_queries.sql
├── 005_candidate_indexes.sql
├── 006_lock_scenarios.sql
├── 007_transaction_scenarios.sql
└── 008_cleanup_performance_fixture.sql

performance/database/plans
├── get-order-baseline-plan.json
├── list-orders-baseline-plan.json
├── search-orders-baseline-plan.json
├── get-order-candidate-plan.json
├── list-orders-candidate-plan.json
└── search-orders-candidate-plan.json

performance/database/reports
├── database-baseline-report.yaml
├── database-query-regression-report.yaml
├── database-index-impact-report.yaml
├── database-lock-report.yaml
├── database-transaction-report.yaml
└── database-performance-gate-report.yaml

scripts/performance/database
├── validate-database-performance-contract.ps1
├── prepare-database-performance-fixture.ps1
├── collect-database-baseline.ps1
├── capture-explain-plan.ps1
├── compare-explain-plans.ps1
├── analyze-query-cardinality.ps1
├── validate-candidate-index.ps1
├── validate-query-count.ps1
├── validate-database-pagination.ps1
├── validate-fetch-size.ps1
├── validate-batch-processing.ps1
├── analyze-database-locks.ps1
├── analyze-transaction-duration.ps1
├── validate-database-statistics.ps1
├── compare-database-performance.ps1
├── enforce-database-performance-budget.ps1
├── simulate-database-performance-scenarios.ps1
├── scan-database-performance-output.ps1
├── collect-database-performance-evidence.ps1
└── verify-database-performance-baseline.ps1

docs/performance/database
├── DATABASE_PERFORMANCE_OVERVIEW.md
├── EXPLAIN_ANALYZE_GUIDE.md
├── INDEX_STRATEGY_GUIDE.md
├── CARDINALITY_AND_STATISTICS.md
├── JOIN_STRATEGY_GUIDE.md
├── DATABASE_PAGINATION_GUIDE.md
├── TRANSACTIONS_AND_LOCKS.md
├── DATABASE_PERFORMANCE_TEST_MATRIX.md
└── DATABASE_PERFORMANCE_TROUBLESHOOTING.md
```

Ao final, você terá catálogo de consultas, dataset reproduzível, baseline, planos JSON, índices candidatos, cenários de locks e transações, gates e evidence sanitizada.

Você irá medir consultas, capturar planos, analisar cardinalidade, validar índices, paginação, N+1, batches, locks e transações e executar o gate.

---

## Conceito essencial

- **Query plan:** estratégia escolhida para executar a consulta.
- **Planner:** componente que estima custos e seleciona o plano.
- **Cost:** estimativa relativa do planner; não representa milissegundos.
- **Actual time:** tempo observado por `EXPLAIN ANALYZE`.
- **Rows e loops:** linhas processadas e quantidade de execuções de cada nó.
- **Cardinalidade:** quantidade de linhas estimada ou real.
- **Seletividade:** proporção de linhas atendidas pelo predicado.
- **Sequential Scan:** leitura sequencial da tabela.
- **Index Scan:** navegação pelo índice com acesso à tabela.
- **Index Only Scan:** leitura principalmente pelo índice, sujeita a heap fetches.
- **Bitmap Scan:** bitmap de índice combinado com acesso por blocos.
- **Nested Loop:** repete o acesso interno para linhas externas.
- **Hash Join:** constrói hash para comparar conjuntos.
- **Merge Join:** combina entradas ordenadas.
- **Sort:** ordenação em memória ou disco.
- **Filter:** predicado aplicado após a leitura de um nó.
- **Index Cond:** predicado usado para navegar no índice.
- **Covering index:** índice que inclui colunas necessárias à consulta.
- **Partial index:** índice apenas sobre linhas que atendem uma condição.
- **Composite index:** índice com múltiplas colunas em ordem definida.
- **Statistics:** dados de distribuição e cardinalidade usados pelo planner.
- **Lock wait:** espera por lock incompatível.
- **Transaction duration:** tempo entre início e encerramento da transação.

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

- PostgreSQL ativo;
- versão registrada;
- schema conhecido;
- migrations aplicadas;
- testes passam;
- budgets da aula 577 disponíveis;
- baseline da API disponível;
- nenhum plano contém dados sensíveis;
- nenhum tuning HikariCP será antecipado.

---

### 2. Criar contrato de performance

Arquivo:

```text
database-performance-contract.yaml
```

Conteúdo:

```yaml
databasePerformance:
  query:
    required:
      - id
      - operation
      - owner
      - source
      - budget

  baseline:
    required:
      - schema-version
      - dataset-size
      - PostgreSQL-version
      - repetitions

  analysis:
    required:
      - plan
      - actual-time
      - rows
      - loops
      - buffers
      - query-count
      - transaction-duration

  change:
    oneVariableAtATime:
      required

  validation:
    required:
      - result-equivalence
      - read-performance
      - write-impact
      - concurrency
      - rollback

  poolTuning:
    deferredToLesson581
```

---

### 3. Criar catálogo de consultas

Arquivo:

```text
database-query-catalog.yaml
```

Exemplo:

```yaml
queries:
  - id:
      DB-ORDER-BY-ID

    operation:
      GET /orders/{id}

    source:
      OrderRepository.findById

    type:
      select

    criticality:
      high

    budget:
      maximumQueriesPerOperation:
        2

      p95Ms:
        40

  - id:
      DB-ORDER-LIST

    operation:
      GET /orders

    source:
      OrderRepository.findPage

    type:
      select-page

    criticality:
      medium

    budget:
      p95Ms:
        80

      maximumRows:
        101
```

Use IDs estáveis e não catalogue valores reais.

---

### 4. Preparar fixture reproduzível

Arquivo:

```text
001_create_performance_fixture.sql
```

Crie tabelas didáticas ou utilize schema de laboratório:

```sql
CREATE TABLE IF NOT EXISTS performance_pedido (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    total NUMERIC(15, 2) NOT NULL,
    criado_em TIMESTAMPTZ NOT NULL,
    atualizado_em TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS performance_item_pedido (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    preco NUMERIC(15, 2) NOT NULL,
    CONSTRAINT fk_performance_item_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES performance_pedido(id)
);
```

---

### 5. Gerar dados sintéticos

Arquivo:

```text
002_seed_performance_fixture.sql
```

Crie distribuição conhecida:

```sql
INSERT INTO performance_pedido (
    cliente_id,
    status,
    total,
    criado_em,
    atualizado_em
)
SELECT
    1 + (serie % 5000),
    CASE
        WHEN serie % 100 < 70
            THEN 'CONCLUIDO'
        WHEN serie % 100 < 90
            THEN 'PENDENTE'
        ELSE 'CANCELADO'
    END,
    10 + (serie % 10000),
    now() - ((serie % 365) || ' days')::interval,
    now()
FROM generate_series(1, 300000) AS serie;
```

Registre quantidade, distribuição, seed, schema e versão. Os dados são sintéticos.

---

### 6. Coletar baseline

Script:

```text
collect-database-baseline.ps1
```

Colete query ID, percentis, rows, buffers, query count, duração da transação, espera por conexão, dataset, schema e versão do PostgreSQL.

Execute pelo menos três repetições depois do warmup.

---

### 7. Criar política de baseline

Arquivo:

```text
database-baseline-policy.yaml
```

Conteúdo:

```yaml
baseline:
  required:
    - fixed-schema
    - known-dataset
    - warmup
    - repetitions
    - equivalent-parameters
    - statistics-current

  cacheState:
    document:
      required

  coldAndWarm:
    compareWhenRelevant:
      true

  singleExecution:
    result:
      inconclusive
```

Registre se o cache está frio ou quente.

---

### 8. Criar política de `EXPLAIN`

Arquivo:

```text
database-explain-policy.yaml
```

Conteúdo:

```yaml
explain:
  preferred:
    format:
      JSON

  analyze:
    executesQuery:
      true

  options:
    required:
      - ANALYZE
      - BUFFERS
      - VERBOSE
      - SETTINGS
      - FORMAT JSON

  writeQuery:
    require:
      - controlled-environment
      - transaction
      - rollback
      - side-effect-review

  production:
    approval:
      required
```

---

### 9. Capturar plano

Script:

```text
capture-explain-plan.ps1
```

Consulta:

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SETTINGS,
    FORMAT JSON
)
SELECT
    id,
    status,
    total,
    criado_em
FROM performance_pedido
WHERE cliente_id = 1234
ORDER BY criado_em DESC
LIMIT 20;
```

Salve:

```text
search-orders-baseline-plan.json
```

O arquivo precisa ser sanitizado.

---

### 10. Ler o plano de baixo para cima

Comece pelos nós folha.

Pergunte como as linhas foram encontradas, quantas foram estimadas e reais, quantas foram removidas, quantos loops e buffers ocorreram e se houve sort, spill ou heap fetch.

A causa costuma estar nos nós descendentes.

---

### 11. Diferenciar custo e tempo

Exemplo:

```text
cost=0.42..8.44
```

Não significa:

```text
8,44 ms.
```

Cost é unidade interna do planner.

Tempo real aparece em:

```text
actual time.
```

Use cost para entender a escolha relativa.

Use actual time para observar a execução.

---

### 12. Analisar estimativa e realidade

Exemplo:

```text
rows estimadas:
10.

rows reais:
25.000.
```

Essa divergência pode levar a join inadequado ou memória insuficiente para operações.

Investigue estatísticas, distribuição, correlação, parâmetros, expressões, casts e valores extremos.

---

### 13. Criar política de cardinalidade

Arquivo:

```text
database-cardinality-policy.yaml
```

Conteúdo:

```yaml
cardinality:
  compare:
    - estimated-rows
    - actual-rows
    - loops

  mismatch:
    ratioThreshold:
      documented

  investigate:
    - stale-statistics
    - skew
    - correlated-columns
    - parameter-distribution
    - expression
    - implicit-cast

  fixedByIndexOnly:
    forbidden
```

Índice não corrige estimativa incorreta por si só.

---

### 14. Analisar cardinalidade

Script:

```text
analyze-query-cardinality.ps1
```

Calcule por nó:

```text
actual rows
/
estimated rows.
```

Classifique:

```text
accurate;

moderate-mismatch;

severe-underestimate;

severe-overestimate;

unknown.
```

Registre o nó e a hipótese.

---

### 15. Reconhecer `Sequential Scan`

`Sequential Scan` não é automaticamente ruim.

Pode ser adequado em tabela pequena, consulta pouco seletiva ou leitura de grande parte das linhas.

Questione:

```text
quantas linhas foram lidas;

quantas foram retornadas;

qual o tamanho da tabela;

qual o budget.
```

---

### 16. Reconhecer filtro tardio

Exemplo:

```text
Rows Removed by Filter:
298.000.
```

Para retornar:

```text
20 linhas.
```

Isso indica trabalho descartado.

Um índice compatível pode transformar filtro em:

```text
Index Cond.
```

Mas valide escrita e tamanho do índice.

---

### 17. Criar política de índices

Arquivo:

```text
database-index-policy.yaml
```

Conteúdo:

```yaml
index:
  candidate:
    require:
      - query-frequency
      - filter-or-join
      - selectivity
      - plan-evidence
      - expected-benefit

  validate:
    - read-improvement
    - write-impact
    - storage
    - maintenance
    - duplicate-index
    - concurrency

  createInProduction:
    concurrent:
      evaluate

  unused:
    review:
      required

  speculative:
    forbidden
```

---

### 18. Criar índice candidato

Consulta:

```sql
SELECT
    id,
    status,
    total,
    criado_em
FROM performance_pedido
WHERE cliente_id = ?
ORDER BY criado_em DESC
LIMIT 20;
```

Índice candidato:

```sql
CREATE INDEX idx_perf_pedido_cliente_criado
    ON performance_pedido (
        cliente_id,
        criado_em DESC
    );
```

A ordem das colunas acompanha:

```text
igualdade por cliente;

ordenação por criado_em.
```

---

### 19. Validar índice candidato

Script:

```text
validate-candidate-index.ps1
```

Compare plano, tempo, buffers, rows, sort, storage, escrita, lock de criação e repetições.

Classifique:

```text
APPROVE;

REJECT;

INCONCLUSIVE.
```

---

### 20. Usar `INCLUDE`

Quando a consulta precisa de poucas colunas adicionais:

```sql
CREATE INDEX idx_perf_pedido_cliente_criado_cover
    ON performance_pedido (
        cliente_id,
        criado_em DESC
    )
    INCLUDE (
        status,
        total
    );
```

Isso pode favorecer `Index Only Scan`.

Mas:

- aumenta o índice;
- aumenta custo de escrita;
- não elimina heap fetch quando visibility map não ajuda;
- pode duplicar índice existente.

Meça.

---

### 21. Usar índice parcial

Consulta frequente:

```sql
SELECT
    id,
    cliente_id,
    criado_em
FROM performance_pedido
WHERE status = 'PENDENTE'
ORDER BY criado_em
LIMIT 100;
```

Índice candidato:

```sql
CREATE INDEX idx_perf_pedido_pendente_criado
    ON performance_pedido (
        criado_em
    )
    WHERE status = 'PENDENTE';
```

O predicado da consulta precisa ser compatível com o índice.

Índice parcial não atende automaticamente variações arbitrárias.

---

### 22. Evitar índice de baixa seletividade isolado

Índice somente em:

```text
status
```

com três valores pode não ajudar.

O planner pode preferir leitura sequencial.

Combine o índice com o padrão real:

```text
status + data;

status parcial;

status + tenant;

status + chave de ordenação.
```

Não indexe por intuição.

---

### 23. Identificar índices duplicados

Exemplo:

```text
(cliente_id)

(cliente_id, criado_em)

(cliente_id, criado_em, status)
```

Eles podem se sobrepor. Avalie consultas, prefixos, ordenação, `INCLUDE`, unicidade, escrita, tamanho e uso.

Não remova índice sem observar o workload.

---

### 24. Analisar joins

Arquivo:

```text
database-join-policy.yaml
```

Conteúdo:

```yaml
join:
  inspect:
    - algorithm
    - estimated-rows
    - actual-rows
    - loops
    - join-condition
    - filters
    - memory
    - spill

  nestedLoop:
    validWhen:
      - outer-small
      - inner-indexed

  hashJoin:
    inspect:
      - build-size
      - batches
      - memory

  mergeJoin:
    inspect:
      - ordering
      - sort-cost

  forceJoinStrategy:
    forbiddenInBasicOptimization
```

Não force o planner como primeira solução.

---

### 25. Ler `Nested Loop`

`Nested Loop` pode ser excelente quando:

- poucas linhas externas;
- busca interna indexada;
- resultado pequeno.

Pode ser ruim quando:

```text
outer rows:
100.000.

inner loops:
100.000.

inner access:
caro.
```

Analise:

```text
rows × loops.
```

---

### 26. Ler `Hash Join`

`Hash Join` costuma funcionar bem em conjuntos maiores com igualdade.

Observe tamanho do hash, batches, memória, spill, estimativas e filtros anteriores.

Muitos batches podem indicar memória insuficiente ou estimativa ruim.

Não altere memória do PostgreSQL nesta aula sem evidência e escopo.

---

### 27. Ler `Merge Join`

`Merge Join` utiliza entradas ordenadas.

Pode ser adequado quando:

- índices já entregam ordem;
- conjuntos são grandes;
- condição é compatível.

Pode exigir sorts caros quando a ordem não existe.

Observe se o sort usa:

```text
Memory;

Disk.
```

---

### 28. Detectar `N+1`

Exemplo:

```text
1 query para pedidos;

100 queries para itens.
```

Total:

```text
101 queries.
```

O endpoint pode passar localmente com poucos dados e falhar em volume.

Use:

- query count;
- logs controlados;
- traces;
- testes de integração;
- métricas por operação.

---

### 29. Validar query count

Script:

```text
validate-query-count.ps1
```

Para `GET /orders`:

```text
budget:
até 3 queries.

resultado:
101.

gate:
FAIL_N_PLUS_ONE.
```

Correções possíveis:

- fetch join controlado;
- entity graph;
- projeção;
- batch fetch;
- consulta específica;
- carregamento em duas etapas.

---

### 30. Evitar fetch join de coleção paginada sem validação

Fetch join de coleção pode:

- multiplicar linhas;
- quebrar paginação;
- aumentar memória;
- duplicar entidades;
- transferir dados excessivos.

Uma estratégia segura pode usar:

1. página de IDs;
2. busca dos detalhes necessários;
3. reordenação;
4. DTO.

Meça query count e payload.

---

### 31. Criar política de paginação no banco

Arquivo:

```text
database-pagination-policy.yaml
```

Conteúdo:

```yaml
pagination:
  offset:
    allowedFor:
      - small-or-bounded-pages

  keyset:
    preferredFor:
      - deep-pages
      - stable-order
      - high-volume

  ordering:
    uniqueTieBreaker:
      required

  totalCount:
    separateBudget:
      required

  collectionFetchJoin:
    requiresValidation:
      true
```

---

### 32. Comparar offset e keyset

Offset:

```sql
SELECT
    id,
    status,
    criado_em
FROM performance_pedido
ORDER BY criado_em DESC, id DESC
OFFSET 200000
LIMIT 20;
```

Keyset:

```sql
SELECT
    id,
    status,
    criado_em
FROM performance_pedido
WHERE (
    criado_em,
    id
) < (
    :ultimoCriadoEm,
    :ultimoId
)
ORDER BY criado_em DESC, id DESC
LIMIT 20;
```

Keyset evita descartar muitas linhas anteriores.

Exige cursor e ordenação estável.

---

### 33. Validar paginação

Script:

```text
validate-database-pagination.ps1
```

Compare:

- página inicial;
- página profunda;
- actual time;
- buffers;
- rows scanned;
- sort;
- duplicidade;
- lacuna;
- atualização concorrente;
- contrato da API.

---

### 34. Tratar `COUNT(*)`

Total count pode custar mais que a página.

Pergunte:

- o cliente precisa do total exato;
- `hasNext` é suficiente;
- estimativa é aceitável;
- count possui budget próprio;
- count pode ser assíncrono;
- filtro muda frequentemente.

A remoção exige decisão de produto.

---

### 35. Criar política de fetch

Arquivo:

```text
database-fetch-policy.yaml
```

Conteúdo:

```yaml
fetch:
  largeResult:
    materializeAll:
      forbidden

  fetchSize:
    explicitWhenStreaming:
      required

  transaction:
    requiredByDriverWhenApplicable

  entityManagement:
    clearPeriodically:
      requiredForLargeBatch

  connectionOccupancy:
    measure:
      required
```

Fetch size reduz materialização de grandes resultados, mas mantém cursor e conexão.

---

### 36. Validar fetch size

Script:

```text
validate-fetch-size.ps1
```

Compare:

```text
fetch all;

fetch size 100;

fetch size 1000.
```

Meça heap, RSS, GC, TTFB, duração, ocupação da conexão, linhas e cancelamento.

Não use streaming para endpoints de coleção sem paginação.

---

### 37. Criar política de batch

Arquivo:

```text
database-batch-policy.yaml
```

Conteúdo:

```yaml
batch:
  write:
    size:
      bounded

  validate:
    - statements
    - round-trips
    - transaction-duration
    - lock-duration
    - memory
    - failure-behavior

  hugeTransaction:
    forbidden

  partialFailure:
    contract:
      required
```

Batch reduz round-trips, mas pode ampliar lock e rollback.

---

### 38. Validar batch

Script:

```text
validate-batch-processing.ps1
```

Compare:

```text
1 por vez;

batch 50;

batch 500.
```

Meça duração, statements, round-trips, memória, locks, WAL, rollback e throughput.

Escolha por evidência.

---

### 39. Criar política de transação

Arquivo:

```text
database-transaction-policy.yaml
```

Conteúdo:

```yaml
transaction:
  scope:
    minimal:
      required

  externalCallInside:
    forbiddenUnlessExplicitlyDesigned

  duration:
    measure:
      required

  isolation:
    documented:
      required

  readOnly:
    useWhenApplicable:
      true

  idleInTransaction:
    forbidden
```

Não mantenha transação aberta enquanto chama serviço externo.

---

### 40. Medir duração de transação

Script:

```text
analyze-transaction-duration.ps1
```

Registre duração, statements, espera externa, locks, rows, rollback e release.

Classifique:

```text
bounded;

long-running;

idle-in-transaction;

blocked;

inconclusive.
```

---

### 41. Criar política de locks

Arquivo:

```text
database-lock-policy.yaml
```

Conteúdo:

```yaml
locks:
  inspect:
    - lock-type
    - mode
    - granted
    - relation
    - transaction
    - wait-duration
    - blocker
    - blocked

  conclusion:
    fromSingleSnapshot:
      limited

  remediation:
    killSession:
      forbiddenWithoutAuthorization

  correlate:
    - transaction-duration
    - query
    - application-operation
```

---

### 42. Consultar locks

Consulta didática:

```sql
SELECT
    blocked.pid AS blocked_pid,
    blocker.pid AS blocker_pid,
    blocked.query AS blocked_query,
    blocker.query AS blocker_query
FROM pg_stat_activity blocked
JOIN pg_locks blocked_lock
    ON blocked_lock.pid = blocked.pid
JOIN pg_locks blocker_lock
    ON blocker_lock.locktype = blocked_lock.locktype
    AND blocker_lock.database IS NOT DISTINCT FROM blocked_lock.database
    AND blocker_lock.relation IS NOT DISTINCT FROM blocked_lock.relation
    AND blocker_lock.page IS NOT DISTINCT FROM blocked_lock.page
    AND blocker_lock.tuple IS NOT DISTINCT FROM blocked_lock.tuple
    AND blocker_lock.transactionid
        IS NOT DISTINCT FROM blocked_lock.transactionid
    AND blocker_lock.classid IS NOT DISTINCT FROM blocked_lock.classid
    AND blocker_lock.objid IS NOT DISTINCT FROM blocked_lock.objid
    AND blocker_lock.objsubid IS NOT DISTINCT FROM blocked_lock.objsubid
    AND blocker_lock.pid <> blocked_lock.pid
JOIN pg_stat_activity blocker
    ON blocker.pid = blocker_lock.pid
WHERE
    NOT blocked_lock.granted;
```

Sanitize queries antes de criar evidence.

---

### 43. Simular lock wait

Sessão A:

```sql
BEGIN;

UPDATE performance_pedido
SET status = 'PROCESSANDO'
WHERE id = 1001;
```

Mantenha aberta somente durante a simulação.

Sessão B:

```sql
BEGIN;

UPDATE performance_pedido
SET status = 'CONCLUIDO'
WHERE id = 1001;
```

Observe o wait.

Finalize:

```sql
ROLLBACK;
```

nas duas sessões.

Não deixe transações abertas.

---

### 44. Criar política de estatísticas

Arquivo:

```text
database-statistics-policy.yaml
```

Conteúdo:

```yaml
statistics:
  validate:
    - last-analyze
    - estimated-rows
    - actual-rows
    - data-distribution
    - column-correlation

  manualAnalyze:
    controlled:
      required

  statisticsTarget:
    change:
      requiresEvidence

  staleAfterBulkLoad:
    action:
      analyze-fixture

  productionMaintenance:
    platformOwned:
      true
```

---

### 45. Atualizar estatísticas no laboratório

Depois da carga:

```sql
ANALYZE performance_pedido;

ANALYZE performance_item_pedido;
```

Capture o plano antes e depois.

Verifique se as estimativas melhoraram.

Não generalize a manutenção para produção.

---

### 46. Usar `pg_stat_statements`

Arquivo:

```text
003_enable_pg_stat_statements.sql
```

Quando a extensão estiver disponível:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

Consulta:

```sql
SELECT
    queryid,
    calls,
    total_exec_time,
    mean_exec_time,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

Use queries normalizadas e não exporte valores sensíveis.

---

### 47. Diferenciar consulta lenta e consulta cara no total

Consulta A:

```text
média:
800 ms.

calls:
2.
```

Consulta B:

```text
média:
20 ms.

calls:
100.000.
```

A consulta B pode consumir mais tempo total.

Priorize por impacto total, criticidade, frequência, p95, risco e custo de correção.

---

### 48. Criar política de regressão

Arquivo:

```text
database-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - actual-time
    - buffers
    - rows
    - loops
    - query-count
    - transaction-duration
    - lock-wait
    - write-throughput

  absoluteBudget:
    required

  relativeBudget:
    required

  resultEquivalence:
    required

  planChange:
    notFailureByItself:
      true

  missingPlan:
    result:
      inconclusive
```

Plano diferente não é automaticamente regressão.

---

### 49. Comparar planos

Script:

```text
compare-explain-plans.ps1
```

Compare nós, tempos, rows estimadas e reais, loops, buffers, sort, spill, heap fetches e settings.

Normalize IDs e timestamps.

---

### 50. Validar impacto em escrita

Índices tornam leitura mais rápida e escrita mais cara.

Meça escrita, tamanho do índice, WAL, impacto de manutenção, lock de criação, migration e rollback.

A melhora de leitura precisa preservar a escrita.

---

### 51. Criar política de qualidade

Arquivo:

```text
database-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unknownDataset:
    action:
      block-comparison

  staleStatistics:
    result:
      limited

  differentSchema:
    result:
      invalid-comparison

  differentParameters:
    result:
      invalid-comparison

  cacheStateUnknown:
    result:
      limited

  singleRun:
    result:
      inconclusive

  missingWriteImpact:
    action:
      block-index-approval
```

---

### 52. Criar política de segurança

Arquivo:

```text
database-security-policy.yaml
```

Conteúdo:

```yaml
security:
  query:
    parameters:
      redact:
        required

  plans:
    sensitiveLiterals:
      forbidden

  activity:
    export:
      sanitized

  credentials:
    forbidden

  production:
    EXPLAIN_ANALYZE:
      requiresApproval

  evidence:
    rawQuery:
      forbidden
```

Planos podem conter filtros e constantes.

Revise antes de compartilhar.

---

### 53. Criar failure policy

Arquivo:

```text
database-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  queryTimeout:
    action:
      preserve-plan-and-context

  lockTimeout:
    action:
      analyze-blocker

  deadlock:
    action:
      preserve-database-and-application-logs

  invalidPlan:
    action:
      block-comparison

  indexRegression:
    action:
      rollback-index

  resultMismatch:
    action:
      reject-change

  poolSaturation:
    deferTuningToLesson581
```

---

### 54. Criar cenários

Arquivo:

```text
database-performance-scenarios.yaml
```

Cenários:

```text
baseline-by-id;

filter-without-index;

composite-index;

covering-index;

partial-index;

low-selectivity-index;

cardinality-mismatch;

nested-loop-good;

nested-loop-expensive;

hash-join;

deep-offset;

keyset-pagination;

N-plus-one;

fetch-size;

batch-write;

long-transaction;

idle-in-transaction;

lock-wait;

stale-statistics;

write-regression.
```

Cada cenário registra query ID, dataset, schema, parâmetros sanitizados, plano, budget, hipótese, mudança, resultado, rollback e evidence.

---

### 55. Simular filtro sem índice

Execute consulta por:

```text
cliente_id + criado_em.
```

Sem índice candidato.

Registre:

- sequential scan;
- rows removed;
- sort;
- buffers;
- p95.

Crie o índice composto.

Repita o cenário.

---

### 56. Simular cardinalidade incorreta

Carregue dados com distribuição enviesada.

Capture plano antes de `ANALYZE`.

Execute:

```sql
ANALYZE performance_pedido;
```

Capture novamente.

Compare estimativa e estratégia.

---

### 57. Simular `N+1`

Carregue página de pedidos e itens por pedido.

Valide query count.

Aplique uma estratégia controlada.

Confirme:

- mesmo resultado;
- query count dentro do budget;
- paginação preservada;
- payload preservado;
- memória estável.

---

### 58. Simular lock wait

Execute as duas sessões controladas.

Colete:

- blocker;
- blocked;
- lock mode;
- wait duration;
- operação;
- transaction age.

Finalize ambas.

Confirme que não existe sessão `idle in transaction`.

---

### 59. Criar matriz de testes

Arquivo:

```text
DATABASE_PERFORMANCE_TEST_MATRIX.md
```

Cenários:

- fixture;
- seed;
- baseline;
- `EXPLAIN`;
- `EXPLAIN ANALYZE`;
- buffers;
- JSON plan;
- sequential scan;
- index scan;
- index only scan;
- bitmap scan;
- composite index;
- partial index;
- include;
- duplicate index;
- cardinality;
- statistics;
- nested loop;
- hash join;
- merge join;
- sort spill;
- deep offset;
- keyset;
- total count;
- N+1;
- fetch size;
- batch;
- transaction duration;
- idle in transaction;
- lock wait;
- deadlock evidence;
- read regression;
- write regression;
- security scan;
- evidence sanitizada.

---

### 60. Criar troubleshooting

Arquivo:

```text
DATABASE_PERFORMANCE_TROUBLESHOOTING.md
```

Inclua:

- `EXPLAIN ANALYZE` alterou dados;
- plano não usa índice;
- índice aumenta tempo;
- estimativa diverge;
- `Index Only Scan` faz heap fetch;
- sort usa disco;
- nested loop possui muitos loops;
- hash join usa batches;
- paginação profunda degrada;
- fetch join quebra página;
- N+1 reaparece;
- fetch size não reduz memória;
- batch amplia transação;
- sessão idle in transaction;
- lock blocker não aparece;
- `pg_stat_statements` indisponível;
- plano contém dados sensíveis;
- tuning HikariCP antecipado.

---

### 61. Coletar evidence

Script:

```text
collect-database-performance-evidence.ps1
```

Arquivo:

```text
database-performance-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release, versões e status de catálogo, baseline, planos, cardinalidade, índices, joins, paginação, query count, fetch, batch, transações, locks, estatísticas, regressões, segurança, gate e testes.

Não inclua:

- SQL com valores reais;
- dados de clientes;
- hostnames;
- usernames;
- PIDs;
- credentials;
- planos não sanitizados;
- configurações HikariCP da aula 581.

---

### 62. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\database\validate-database-performance-contract.ps1

.\scripts\performance\database\prepare-database-performance-fixture.ps1

.\scripts\performance\database\collect-database-baseline.ps1

.\scripts\performance\database\capture-explain-plan.ps1

.\scripts\performance\database\compare-explain-plans.ps1

.\scripts\performance\database\analyze-query-cardinality.ps1

.\scripts\performance\database\validate-candidate-index.ps1

.\scripts\performance\database\validate-query-count.ps1

.\scripts\performance\database\validate-database-pagination.ps1

.\scripts\performance\database\validate-fetch-size.ps1

.\scripts\performance\database\validate-batch-processing.ps1

.\scripts\performance\database\analyze-database-locks.ps1

.\scripts\performance\database\analyze-transaction-duration.ps1

.\scripts\performance\database\validate-database-statistics.ps1

.\scripts\performance\database\compare-database-performance.ps1

.\scripts\performance\database\enforce-database-performance-budget.ps1

.\scripts\performance\database\simulate-database-performance-scenarios.ps1

.\scripts\performance\database\scan-database-performance-output.ps1

.\scripts\performance\database\collect-database-performance-evidence.ps1

.\scripts\performance\database\verify-database-performance-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- fixture aprovada;
- baseline aprovada;
- planos capturados;
- cardinalidade analisada;
- índices avaliados;
- impacto de escrita medido;
- joins analisados;
- paginação validada;
- N+1 bloqueado;
- fetch size validado;
- batch validado;
- transações analisadas;
- locks analisados;
- estatísticas validadas;
- regressões comparadas;
- segurança aprovada;
- evidence sanitizada;
- HikariCP tuning não antecipado.

---

### 63. Encerrar o laboratório

Finalize sessões e transações.

Remova somente artifacts temporários:

```powershell
Remove-Item `
  .tmp/database-performance `
  -Recurse `
  -Force
```

Execute cleanup da fixture somente quando a aula estiver concluída:

```sql
DROP TABLE IF EXISTS performance_item_pedido;

DROP TABLE IF EXISTS performance_pedido;
```

Antes:

- colete evidence;
- preserve policies;
- preserve plans sanitizados;
- preserve reports;
- preserve scripts;
- preserve docs;
- confirme ausência de sessão aberta;
- confirme ausência de artifact bruto no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### A consulta ganhou identidade

Cada SQL passou a ter operação, owner, fonte e budget.

### O plano ganhou leitura sistemática

Nós, rows, loops, buffers e tempos passaram a orientar hipóteses.

### Custo e tempo foram separados

Estimativa do planner deixou de ser confundida com duração real.

### Cardinalidade ganhou evidência

Divergências entre estimado e real passaram a explicar escolhas ruins.

### Índices ganharam critérios

Leitura, escrita, armazenamento e concorrência passaram a ser avaliados juntos.

### Joins ganharam contexto

Nested loop, hash e merge deixaram de ser classificados como bons ou ruins isoladamente.

### Paginação ganhou estratégia de banco

Offset profundo foi comparado com keyset.

### N+1 ganhou gate

Query count passou a fazer parte do contrato de performance.

### Fetch e batch ganharam trade-offs

Memória, conexão, round-trips, locks e transações foram medidos.

### Locks ganharam cadeia causal

Blocked, blocker, duração e operação passaram a ser relacionados.

### A próxima aula ganhou fronteira

Com consultas e transações compreendidas, o pool HikariCP poderá ser dimensionado sem esconder problemas SQL.

---

## Erros comuns importantes

### Criar índice por intuição

O índice precisa de consulta e plano.

### Tratar sequential scan como erro

Ele pode ser a opção correta.

### Confundir cost com milissegundos

Cost é estimativa relativa.

### Ignorar rows e loops

Um nó barato repetido milhares de vezes pode dominar.

### Usar `EXPLAIN ANALYZE` sem cuidado

A consulta é executada.

### Criar muitos índices

Escrita, WAL e armazenamento degradam.

### Forçar join strategy cedo

A causa pode ser cardinalidade ou estatística.

### Corrigir N+1 com fetch join indiscriminado

Paginação e memória podem piorar.

### Manter transação durante chamada externa

Locks e conexões ficam ocupados.

### Aumentar pool para esconder SQL lento

O tuning pertence à aula 581 e precisa de consulta saudável.

---

## Comandos úteis

### Atualizar estatísticas

```sql
ANALYZE performance_pedido;
```

### Capturar plano

```sql
EXPLAIN (
    ANALYZE,
    BUFFERS,
    VERBOSE,
    SETTINGS,
    FORMAT JSON
)
SELECT
    id,
    status
FROM performance_pedido
WHERE cliente_id = 1234;
```

### Consultar atividade

```sql
SELECT
    pid,
    state,
    wait_event_type,
    wait_event,
    query_start
FROM pg_stat_activity;
```

### Validar índices

```powershell
.\scripts\performance\database\validate-candidate-index.ps1
```

### Executar gate

```powershell
.\scripts\performance\database\enforce-database-performance-budget.ps1
```

---

## Exercício guiado

### Parte 1 — Fixture

Crie schema e dados sintéticos.

### Parte 2 — Baseline

Meça queries críticas.

### Parte 3 — Plans

Capture `EXPLAIN ANALYZE` em JSON.

### Parte 4 — Cardinality

Compare estimado e real.

### Parte 5 — Indexes

Teste composto, parcial e covering.

### Parte 6 — Joins

Analise nested loop, hash e merge.

### Parte 7 — Pagination e N+1

Compare offset, keyset e query count.

### Parte 8 — Fetch e batch

Meça memória, round-trips e transação.

### Parte 9 — Locks

Simule blocker e blocked.

### Parte 10 — Gate

Valide leitura, escrita, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 579 e ponte para a aula 581 foram preservadas;
- contrato, catálogo, fixture, dados sintéticos e baseline reproduzível foram criados;
- planos JSON com `EXPLAIN ANALYZE`, `BUFFERS`, `VERBOSE` e `SETTINGS` foram capturados com segurança;
- sequential scan, index scan, index only scan e bitmap scan foram diferenciados;
- índices compostos, parciais e com `INCLUDE` foram avaliados por leitura, escrita, espaço e concorrência;
- nested loop, hash join e merge join foram analisados conforme cardinalidade, loops, memória e ordenação;
- N+1 foi bloqueado por query count;
- offset profundo e keyset foram comparados com ordenação estável;
- fetch size e batch foram medidos por memória, conexão, round-trips, locks e rollback;
- transações permanecem curtas e não ficam `idle in transaction`;
- blocker, blocked, lock mode e wait duration foram identificados;
- estatísticas foram atualizadas e comparadas;
- `pg_stat_statements` foi usado quando disponível;
- regressões de leitura e escrita foram avaliadas com budgets;
- políticas, cenários, matriz, troubleshooting, evidence sanitizada e cleanup estão presentes;
- nenhum dado real, Secret, literal sensível ou plano bruto foi commitado;
- HikariCP tuning não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/database `
  scripts/performance/database `
  docs/performance/database `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|hostname|username|rawQuery|maximumPoolSize|minimiumIdle|maxLifetime"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): otimizar performance de banco"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- SQL com dados reais;
- credentials;
- hostnames;
- usernames;
- planos não sanitizados;
- artifacts temporários;
- configuração HikariCP;
- material da aula 581.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou consultas e transações em objetos mensuráveis de performance.

Você trabalhou com:

```text
EXPLAIN;

EXPLAIN ANALYZE;

BUFFERS;

planos JSON;

cardinalidade;

seletividade;

scans;

índices;

joins;

paginação;

N+1;

fetch size;

batch;

transações;

locks;

estatísticas;

pg_stat_statements.
```

Você comprovou que o plano precisa ser lido por rows, loops, buffers e tempos; cost não representa milissegundos; sequential scan pode ser correto; índices precisam considerar seletividade, ordenação, escrita e concorrência; cardinalidade incorreta pode levar a estratégia ruim; joins dependem do tamanho e acesso dos conjuntos; offset profundo pode ser substituído por keyset; N+1 precisa de gate; fetch size e batch possuem custos de conexão, memória e lock; transações precisam ser curtas; e locks precisam ser relacionados ao blocker, à operação e à duração.

A próxima aula será:

```text
581 - M18.26 - HikariCP tuning
```

Nela, você irá dimensionar o pool de conexões com base em concorrência, capacidade do banco, réplicas, tempo de aquisição, timeouts, lifetime, idle connections, falhas e métricas.

Nenhum valor de `maximumPoolSize`, `minimumIdle`, `connectionTimeout`, `idleTimeout`, `maxLifetime`, `keepaliveTime` ou `leakDetectionThreshold` foi definido nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei fixture e baseline.
- [ ] Capturei planos JSON.
- [ ] Analisei rows, loops e buffers.
- [ ] Validei índices e escrita.
- [ ] Analisei joins e cardinalidade.
- [ ] Comparei offset e keyset.
- [ ] Bloqueei N+1.
- [ ] Analisei transações e locks.

---

## Troubleshooting adicional

### O índice não é usado

Revise seletividade, tamanho, estatísticas, casts, predicado e custo.

### `Index Only Scan` faz heap fetch

Atualizações recentes e visibility map podem exigir acesso à tabela.

### O plano muda

Compare parâmetros, cache, estatísticas, dataset e settings.

### O sort usa disco

Revise volume e largura das linhas antes de alterar memória.

### O nested loop está lento

Multiplique rows externas pelos loops e avalie o acesso interno.

### `EXPLAIN ANALYZE` executou escrita

Reverta, revise efeitos e restrinja o cenário.

### O N+1 sumiu, mas a página quebrou

Revise fetch join, duplicidade e paginação.

### Existe `idle in transaction`

Corrija o escopo e garanta encerramento.

### O blocker não aparece

A sessão pode ter terminado; preserve a janela correta.

### A investigação começou a alterar HikariCP

Preserve essa etapa para a aula 581.

---

## Perguntas de revisão

1. O que é query plan?
2. O que representa cost?
3. O que representa actual time?
4. Por que rows e loops importam?
5. O que é cardinalidade?
6. O que é seletividade?
7. Quando sequential scan pode ser correto?
8. O que é index condition?
9. O que é índice composto?
10. O que é índice parcial?
11. Quando nested loop é adequado?
12. O que observar em hash join?
13. Qual diferença entre offset e keyset?
14. O que é N+1?
15. Para que serve fetch size?
16. Qual risco de batch grande?
17. Por que transações devem ser curtas?
18. Como identificar blocker?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Estratégia de execução.
2. Estimativa relativa.
3. Tempo observado.
4. Revelam trabalho repetido.
5. Quantidade de linhas.
6. Proporção atendida pelo filtro.
7. Tabela pequena ou muitas linhas.
8. Predicado usado no índice.
9. Índice com várias colunas.
10. Índice de subconjunto.
11. Outer pequeno e inner indexado.
12. Hash size, batches e memória.
13. Descartar linhas versus cursor.
14. Uma consulta seguida de várias.
15. Controlar materialização.
16. Locks, memória e rollback.
17. Reduzir locks e ocupação.
18. Relacionar `pg_locks` e activity.
19. HikariCP tuning.
20. HikariCP tuning.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 580 - M18.25 - Performance de banco

- Continuei após Performance de API.
- Criei contrato, catálogo, fixture e dados sintéticos.
- Coletei baseline com schema, dataset, warmup e repetições.
- Capturei planos JSON com `EXPLAIN ANALYZE`, `BUFFERS` e `SETTINGS`.
- Diferenciei cost, actual time, rows, loops e buffers.
- Analisei cardinalidade, seletividade e estatísticas.
- Diferenciei scans sequenciais, por índice, index only e bitmap.
- Testei índices compostos, parciais e com `INCLUDE`.
- Medi benefício de leitura e impacto de escrita.
- Analisei nested loop, hash join e merge join.
- Detectei e bloqueei N+1.
- Comparei offset e keyset pagination.
- Medi fetch size e batch.
- Mantive transações curtas e evitei `idle in transaction`.
- Identifiquei blocker, blocked e lock wait.
- Executei `ANALYZE` na fixture.
- Usei `pg_stat_statements` quando disponível.
- Comparei regressões de leitura e escrita.
- Coletei evidence sanitizada.
- Não antecipei HikariCP tuning.
- Próxima aula: HikariCP tuning.
```

---

## Referência técnica curta

- PostgreSQL `EXPLAIN` e `EXPLAIN ANALYZE`.
- Buffer usage e planos JSON.
- Índices e estatísticas do planner.
- Estratégias de join.
- Keyset pagination.
- `pg_stat_statements`, `pg_stat_activity` e `pg_locks`.

Regra final:

```text
performance de banco precisa começar por consulta catalogada, dataset conhecido, schema versionado, baseline e budget: planos são capturados com EXPLAIN ANALYZE, BUFFERS, SETTINGS e FORMAT JSON em ambiente controlado, lembrando que ANALYZE executa a consulta; rows, loops, buffers, estimativas, filtros, sorts e heap fetches orientam hipóteses, enquanto cost não é confundido com milissegundos; índices compostos, parciais ou com INCLUDE somente são aprovados após medir seletividade, leitura, escrita, armazenamento e concorrência, joins são avaliados pela cardinalidade e pelo acesso dos conjuntos, offset profundo é comparado com keyset, N+1 é bloqueado por query count, e fetch size, batch, transações e locks são medidos por memória, conexão, round-trips, duração e blocker; planos e queries permanecem sanitizados e fora do Git quando brutos, deixando para a aula 581 o dimensionamento de maximumPoolSize, minimumIdle, connectionTimeout, idleTimeout, maxLifetime, keepaliveTime e leakDetectionThreshold do HikariCP.
```
