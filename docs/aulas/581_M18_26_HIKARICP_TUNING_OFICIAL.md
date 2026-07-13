# 581 - M18.26 - HikariCP tuning

## Apresentação da aula

Na aula 580, você aprofundou a performance do banco.

Você trabalhou com:

```text
EXPLAIN;

EXPLAIN ANALYZE;

BUFFERS;

planos JSON;

cardinalidade;

seletividade;

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

A aula anterior também deixou clara uma distinção importante:

```text
consulta lenta
não é igual
a espera por conexão.
```

Uma requisição pode gastar pouco tempo executando SQL e, ainda assim, apresentar latência alta porque aguardou uma conexão disponível.

Outra requisição pode adquirir a conexão imediatamente e passar quase todo o tempo no banco.

Esses dois cenários exigem correções diferentes.

Nesta aula, você irá trabalhar com o **HikariCP**, o pool de conexões utilizado pelo Spring Boot em muitos projetos Java.

A pergunta central será:

```text
como dimensionar
e configurar
o pool de conexões

com base em
concorrência,
tempo de uso,
capacidade do banco,
réplicas,
timeouts,
falhas
e métricas?
```

O pool reutiliza conexões físicas, mas uma configuração incorreta pode gerar espera, timeouts, sessões ociosas, pressão sobre o banco, falhas de rotação, conexões expiradas e competição entre réplicas.

A configuração não deve começar por:

```text
maximumPoolSize = 100
```

apenas porque o servidor possui muitos usuários.

O pool deve considerar concorrência de banco, tempo de posse, throughput, latência, limites, réplicas, pools, transações, falhas, aquisição, headroom e recuperação.

Uma conexão não precisa ficar ocupada durante toda a requisição.

Ela fica ocupada durante o trecho em que a operação acessa o banco.

Exemplo:

```text
latência total:
500 ms.

tempo com conexão:
80 ms.
```

Nesse cenário, a concorrência HTTP pode ser muito maior que a concorrência de banco.

Essa diferença é essencial para o dimensionamento.

A aula utilizará uma forma prática de estimar demanda de conexões:

```text
concorrência de banco
≈
throughput
×
tempo médio de posse da conexão.
```

Essa relação deriva da mesma lógica usada em Little's Law.

Exemplo didático:

```text
throughput:
100 req/s.

tempo médio
com conexão:
0,05 s.

concorrência média
de conexões:
100 × 0,05
=
5.
```

Isso não significa que `maximumPoolSize=5` seja automaticamente correto.

Ainda precisam ser considerados picos, tail latency, transações longas, jobs, consumers, falhas, margem e múltiplas réplicas.

O HikariCP expõe parâmetros como:

```text
maximumPoolSize;

minimumIdle;

connectionTimeout;

idleTimeout;

maxLifetime;

keepaliveTime;

validationTimeout;

initializationFailTimeout;

leakDetectionThreshold;

poolName;
```

Cada parâmetro responde a um problema específico.

Alterar vários ao mesmo tempo impede descobrir qual mudança produziu o resultado.

O fluxo será:

```text
medir baseline;

identificar demanda;

calcular concorrência;

validar limite do banco;

definir pool candidato;

simular carga;

medir active,
idle,
pending,
acquisition
e timeout;

simular falhas;

comparar;

aprovar ou reverter.
```

A aula não irá implementar cache local com Caffeine.

Não serão tratados:

- `Cache`;
- `Caffeine`;
- `maximumSize`;
- `expireAfterWrite`;
- `expireAfterAccess`;
- `refreshAfterWrite`;
- `recordStats`;
- cache hit;
- cache miss;
- eviction;
- cache loader;
- cache stampede;
- cache local por réplica;
- invalidação de cache local.

Esses assuntos pertencem à próxima aula oficial:

```text
582 - M18.27 - Cache local Caffeine
```

A regra central será:

```text
pool maior
não cria capacidade
no banco;

ele apenas permite
mais concorrência
contra o banco.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
579:
Performance de API.

580:
Performance de banco.

581:
HikariCP tuning.

582:
Cache local Caffeine.
```

A progressão é:

```text
otimizar endpoints;

otimizar consultas;

dimensionar conexões;

reduzir leituras repetidas
com cache local.
```

Nesta aula:

```text
maximumPoolSize:
sim.

minimumIdle:
sim.

connectionTimeout:
sim.

idleTimeout:
sim.

maxLifetime:
sim.

keepaliveTime:
sim.

validationTimeout:
sim.

initializationFailTimeout:
sim.

leakDetectionThreshold:
sim.

métricas HikariCP:
sim.

concorrência:
sim.

múltiplas réplicas:
sim.

falha do banco:
sim.

cache Caffeine:
não.
```

Você reutilizará:

- query budgets;
- transaction duration;
- connection wait;
- performance da API;
- capacity planning;
- leitura de saturação;
- métricas Prometheus;
- dashboards Grafana;
- traces;
- logs;
- PostgreSQL;
- cenários de falha;
- runbooks.

O tuning precisa preservar banco, isolamento, latência, disponibilidade, recuperação, segurança, observabilidade e rollback.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/hikaricp
├── hikaricp-tuning-contract.yaml
├── hikaricp-pool-catalog.yaml
├── hikaricp-capacity-policy.yaml
├── hikaricp-size-policy.yaml
├── hikaricp-minimum-idle-policy.yaml
├── hikaricp-acquisition-policy.yaml
├── hikaricp-lifetime-policy.yaml
├── hikaricp-keepalive-policy.yaml
├── hikaricp-validation-policy.yaml
├── hikaricp-initialization-policy.yaml
├── hikaricp-leak-detection-policy.yaml
├── hikaricp-replica-policy.yaml
├── hikaricp-failure-policy.yaml
├── hikaricp-observability-policy.yaml
├── hikaricp-regression-policy.yaml
├── hikaricp-data-quality-policy.yaml
├── hikaricp-security-policy.yaml
├── hikaricp-scenarios.yaml
└── hikaricp-evidence.yaml

performance/hikaricp/profiles
├── baseline.properties
├── undersized.properties
├── balanced.properties
├── oversized.properties
├── resilient.properties
└── rollback.properties

performance/hikaricp/reports
├── hikaricp-baseline-report.yaml
├── hikaricp-size-comparison-report.yaml
├── hikaricp-timeout-report.yaml
├── hikaricp-lifetime-report.yaml
├── hikaricp-failure-report.yaml
├── hikaricp-replica-report.yaml
└── hikaricp-gate-report.yaml

scripts/performance/hikaricp
├── validate-hikaricp-contract.ps1
├── collect-hikaricp-baseline.ps1
├── calculate-database-concurrency.ps1
├── calculate-hikaricp-pool-size.ps1
├── validate-hikaricp-total-connections.ps1
├── compare-hikaricp-profiles.ps1
├── analyze-hikaricp-acquisition.ps1
├── validate-hikaricp-lifetime.ps1
├── validate-hikaricp-keepalive.ps1
├── validate-hikaricp-initialization.ps1
├── validate-hikaricp-leak-detection.ps1
├── simulate-hikaricp-exhaustion.ps1
├── simulate-database-restart.ps1
├── simulate-hikaricp-recovery.ps1
├── validate-hikaricp-rollback.ps1
├── scan-hikaricp-output.ps1
├── collect-hikaricp-evidence.ps1
└── verify-hikaricp-baseline.ps1

docs/performance/hikaricp
├── HIKARICP_TUNING_OVERVIEW.md
├── POOL_SIZE_GUIDE.md
├── ACQUISITION_TIMEOUT_GUIDE.md
├── CONNECTION_LIFETIME_GUIDE.md
├── KEEPALIVE_AND_VALIDATION.md
├── LEAK_DETECTION_GUIDE.md
├── MULTI_REPLICA_CAPACITY.md
├── HIKARICP_TEST_MATRIX.md
└── HIKARICP_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, baseline, concorrência estimada, budget total, perfis comparáveis, cenários de exaustão e restart, rollback e evidence sanitizada.

Você irá medir, calcular, comparar perfis, simular saturação e falhas, validar recuperação e executar o gate.

---

## Conceito essencial

### Connection pool

Conjunto de conexões reutilizáveis mantidas pela aplicação.

---

### Physical connection

Conexão real entre aplicação e banco.

---

### Logical connection

Handle entregue à aplicação e devolvido ao pool após `close()`.

---

### Borrow

Aquisição de uma conexão pelo consumidor.

---

### Return

Devolução da conexão ao pool.

---

### Active connection

Conexão emprestada e ainda não devolvida.

---

### Idle connection

Conexão disponível no pool.

---

### Pending thread

Thread aguardando conexão.

---

### Acquisition time

Tempo entre solicitar e receber uma conexão.

---

### Pool exhaustion

Condição em que todas as conexões estão ocupadas e novas solicitações aguardam ou falham.

---

### maximumPoolSize

Número máximo de conexões que o pool pode manter.

---

### minimumIdle

Quantidade mínima de conexões ociosas que o pool tenta manter.

---

### connectionTimeout

Tempo máximo de espera pela aquisição de uma conexão.

---

### idleTimeout

Tempo após o qual uma conexão ociosa acima do mínimo pode ser removida.

---

### maxLifetime

Tempo máximo de permanência de uma conexão no pool.

---

### keepaliveTime

Intervalo usado para testar periodicamente uma conexão ociosa, quando aplicável.

---

### validationTimeout

Tempo máximo permitido para validar uma conexão.

---

### initializationFailTimeout

Comportamento de inicialização quando o pool não consegue obter conexão.

---

### leakDetectionThreshold

Tempo após o qual uma conexão emprestada por muito tempo pode gerar alerta de suspeita de leak.

---

### Connection leak

Conexão obtida e não devolvida corretamente.

---

### Long-held connection

Conexão legítima mantida por tempo elevado, por exemplo em transação longa.

Não é automaticamente leak.

---

### Total connection budget

Quantidade total de conexões que todas as instâncias e pools podem solicitar ao banco.

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
- consultas críticas conhecidas;
- transações medidas;
- métricas HikariCP disponíveis;
- budgets disponíveis;
- workload reproduzível;
- quantidade de réplicas conhecida;
- nenhum cache Caffeine será antecipado.

---

### 2. Criar contrato de tuning

Arquivo:

```text
hikaricp-tuning-contract.yaml
```

Conteúdo:

```yaml
hikariCP:
  pool:
    required:
      - name
      - datasource
      - owner
      - replica-count
      - database-limit

  baseline:
    required:
      - throughput
      - connection-hold-time
      - active
      - idle
      - pending
      - acquisition-time
      - timeout-count

  tuning:
    required:
      - hypothesis
      - one-change
      - workload
      - repetitions
      - rollback

  validation:
    required:
      - application-budget
      - database-impact
      - failure-recovery
      - total-connections

  caffeineCache:
    deferredToLesson582
```

---

### 3. Criar catálogo de pools

Arquivo:

```text
hikaricp-pool-catalog.yaml
```

Exemplo:

```yaml
pools:
  - id:
      orders-primary

    datasource:
      primary-postgresql

    owner:
      orders-api

    workloads:
      - HTTP
      - Kafka-consumer

    replicaCount:
      laboratory:
        2

    databaseConnectionBudget:
      laboratory:
        40

    profile:
      baseline
```

Se houver mais de um datasource, catalogue cada pool separadamente.

---

### 4. Instrumentar métricas

Arquivo:

```text
hikaricp-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  metrics:
    required:
      - active
      - idle
      - total
      - pending
      - acquire
      - usage
      - creation
      - timeout

  labels:
    allowed:
      - pool
      - service
      - environment

  labels:
    forbidden:
      - customer-id
      - order-id
      - SQL
      - connection-id

  dashboards:
    correlate:
      - request-rate
      - latency
      - query-time
      - transaction-time
      - database-connections
      - database-cpu
```

Use labels de baixa cardinalidade.

---

### 5. Coletar baseline

Script:

```text
collect-hikaricp-baseline.ps1
```

Registre rates, throughput, active, idle, pending, acquisition, usage, timeouts, transações, queries, conexões, CPU, release e profile.

Execute três janelas equivalentes.

---

### 6. Separar tempos

Diferencie:

```text
acquisition time:
espera para obter conexão.

usage time:
tempo entre borrow e return.

query time:
tempo executando SQL.

transaction time:
tempo total da transação.
```

Uma aquisição alta indica competição pelo pool.

Usage alta pode indicar:

- transação longa;
- query lenta;
- múltiplas queries;
- espera dentro da transação;
- chamada externa indevida;
- streaming prolongado.

---

### 7. Estimar concorrência de banco

Script:

```text
calculate-database-concurrency.ps1
```

Fórmula didática:

```text
concorrência média
=
throughput de operações com banco
×
tempo médio de posse da conexão.
```

Exemplo:

```text
throughput:
120 operações/s.

usage médio:
40 ms
=
0,04 s.

concorrência média:
4,8 conexões.
```

Para risco, considere:

- p95 de usage;
- burst;
- jobs;
- consumers;
- retries;
- transações paralelas.

Não use p95 como média sem rotular o cenário.

---

### 8. Criar política de capacidade

Arquivo:

```text
hikaricp-capacity-policy.yaml
```

Conteúdo:

```yaml
capacity:
  inputs:
    required:
      - database-max-connections
      - reserved-connections
      - application-replicas
      - pools-per-replica
      - workload-concurrency
      - headroom

  databaseBudget:
    formula:
      max-connections-minus-reserved

  applicationBudget:
    dividedAcross:
      - services
      - replicas
      - pools

  poolCannotExceedDatabaseBudget:
    true

  unknownSharedConsumers:
    result:
      inconclusive
```

---

### 9. Calcular budget total

Exemplo didático:

```text
PostgreSQL max_connections:
100.

reservado para:
administração:
10.

outros serviços:
30.

budget do orders:
60.
```

Com três réplicas e um pool por réplica:

```text
máximo teórico por pool:
60 / 3
=
20.
```

Isso é teto de capacidade, não recomendação automática.

O pool candidato ainda precisa ser compatível com a concorrência medida.

---

### 10. Criar política de tamanho

Arquivo:

```text
hikaricp-size-policy.yaml
```

Conteúdo:

```yaml
poolSize:
  deriveFrom:
    - measured-concurrency
    - acquisition-time
    - database-budget
    - replica-count
    - workload
    - headroom

  activeAtMaximum:
    conclusion:
      requiresPendingOrTimeout

  oversized:
    risks:
      - database-contention
      - excessive-sessions
      - memory-overhead
      - longer-lock-chains

  undersized:
    risks:
      - pending-growth
      - acquisition-time
      - timeout
      - lower-throughput

  arbitraryLargeValue:
    forbidden
```

---

### 11. Criar perfis

Arquivo:

```text
profiles/baseline.properties
```

Exemplo didático:

```properties
spring.datasource.hikari.pool-name=orders-baseline
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
```

Crie também:

```text
undersized.properties;

balanced.properties;

oversized.properties;

resilient.properties;

rollback.properties.
```

Os valores do laboratório não são valores de produção.

---

### 12. Validar perfil subdimensionado

Exemplo:

```properties
spring.datasource.hikari.maximum-pool-size=2
spring.datasource.hikari.minimum-idle=2
```

Sob carga, observe:

- active=max;
- pending crescente;
- acquisition p95;
- timeout;
- throughput;
- latência;
- banco ainda com capacidade.

Se o banco está saudável e o pool gera espera, existe evidência de subdimensionamento.

---

### 13. Validar perfil superdimensionado

Exemplo:

```properties
spring.datasource.hikari.maximum-pool-size=40
spring.datasource.hikari.minimum-idle=40
```

Observe:

- conexões totais;
- banco;
- CPU;
- lock waits;
- query latency;
- throughput;
- memória;
- criação de conexões;
- concorrência entre réplicas.

Pool maior pode não melhorar throughput.

Pode piorar o banco.

---

### 14. Calcular tamanho candidato

Script:

```text
calculate-hikaricp-pool-size.ps1
```

Entradas:

- concorrência média;
- concorrência de pico;
- active p95;
- pending;
- usage p95;
- replicas;
- budget do banco;
- headroom.

Saída:

```text
candidate-min;

candidate-target;

candidate-max;

confidence;

constraints.
```

O script não deve produzir valor sem apresentar premissas.

---

### 15. Validar conexões totais

Script:

```text
validate-hikaricp-total-connections.ps1
```

Fórmula:

```text
total potencial
=
réplicas
×
pools por réplica
×
maximumPoolSize.
```

Inclua:

- workers;
- schedulers;
- migration tools;
- administração;
- outros serviços;
- headroom.

Resultado:

```text
APPROVED;

BLOCKED_DATABASE_BUDGET;

INCONCLUSIVE_SHARED_USAGE.
```

---

### 16. Criar política de `minimumIdle`

Arquivo:

```text
hikaricp-minimum-idle-policy.yaml
```

Conteúdo:

```yaml
minimumIdle:
  purpose:
    ready-connections

  evaluate:
    - startup-burst
    - steady-load
    - connection-creation-cost
    - database-session-cost
    - scale-out-replicas

  equalToMaximum:
    fixedSizeBehavior:
      true

  lowerThanMaximum:
    dynamicIdle:
      true

  highReplicaCount:
    risk:
      idle-session-multiplication
```

Manter muitas conexões ociosas em cada réplica pode consumir o budget do banco.

---

### 17. Comparar `minimumIdle`

Cenário A:

```text
maximumPoolSize:
10.

minimumIdle:
10.
```

Cenário B:

```text
maximumPoolSize:
10.

minimumIdle:
2.
```

Compare:

- startup;
- primeira rajada;
- criação;
- idle;
- total;
- latência;
- banco;
- recuperação após idle.

Não escolha somente pelo menor número de conexões.

---

### 18. Criar política de aquisição

Arquivo:

```text
hikaricp-acquisition-policy.yaml
```

Conteúdo:

```yaml
acquisition:
  connectionTimeout:
    required

  mustFit:
    remainingRequestBudget

  waitMetric:
    required

  timeoutMetric:
    required

  longTimeout:
    risk:
      hidden-queue

  shortTimeout:
    risk:
      premature-failure

  retryAfterAcquisitionTimeout:
    forbiddenWithoutBudget
```

---

### 19. Compor `connectionTimeout`

Exemplo:

```text
budget da API:
500 ms.

processamento local:
80 ms.

banco:
180 ms.

dependência:
150 ms.

margem:
90 ms.
```

Um `connectionTimeout` de 30 segundos não cabe nessa jornada.

O timeout precisa considerar:

- budget restante;
- fallback;
- retry;
- UX;
- fila aceitável;
- capacidade de recuperação.

Valor muito alto transforma o pool em fila oculta.

---

### 20. Analisar aquisição

Script:

```text
analyze-hikaricp-acquisition.ps1
```

Compare:

- p50;
- p95;
- p99;
- pending;
- timeout count;
- active;
- usage;
- query;
- transaction;
- request latency.

Classifique:

```text
healthy;

highly-utilized;

pool-saturation-candidate;

pool-saturated;

database-slow;

inconclusive.
```

---

### 21. Diferenciar pool e banco

Cenário A:

```text
pending:
alto.

acquisition:
alto.

database CPU:
baixo.

query p95:
baixo.
```

Possível causa:

```text
pool pequeno
ou conexão retida
fora do SQL.
```

Cenário B:

```text
pending:
alto.

query p95:
alto.

database CPU:
alto.

lock wait:
alto.
```

Possível causa:

```text
banco saturado
ou consultas concorrentes demais.
```

Aumentar o pool no cenário B tende a piorar.

---

### 22. Criar política de lifetime

Arquivo:

```text
hikaricp-lifetime-policy.yaml
```

Conteúdo:

```yaml
lifetime:
  maxLifetime:
    required

  lessThanInfrastructureLifetime:
    recommendedByPolicy

  retirement:
    staggered:
      required

  tooShort:
    risks:
      - connection-churn
      - authentication-load
      - latency-spikes

  tooLong:
    risks:
      - stale-connections
      - infrastructure-termination
      - recovery-delay

  exactProductionValue:
    environmentSpecific
```

`maxLifetime` precisa ser menor que limites externos conhecidos quando a infraestrutura encerra conexões.

---

### 23. Validar `maxLifetime`

Script:

```text
validate-hikaricp-lifetime.ps1
```

Simule:

- conexão criada;
- uso normal;
- envelhecimento;
- retirada;
- substituição;
- carga durante rotação;
- múltiplas conexões expirando;
- restart do banco.

Observe:

- churn;
- creation time;
- timeout;
- latência;
- erro;
- recuperação.

Evite configurar todas as conexões para expirar simultaneamente por mecanismos externos.

---

### 24. Criar política de `idleTimeout`

Inclua em:

```text
hikaricp-lifetime-policy.yaml
```

Regras:

```yaml
idleTimeout:
  appliesWhen:
    idleAboveMinimum

  evaluate:
    - traffic-pattern
    - connection-cost
    - replica-count
    - database-session-budget

  tooShort:
    risk:
      repeated-creation

  tooLong:
    risk:
      unnecessary-idle-sessions
```

`idleTimeout` não substitui `maxLifetime`.

Eles tratam situações diferentes.

---

### 25. Criar política de keepalive

Arquivo:

```text
hikaricp-keepalive-policy.yaml
```

Conteúdo:

```yaml
keepalive:
  useWhen:
    infrastructureMayDropIdleConnections

  connection:
    mustBeIdle:
      true

  interval:
    lessThanMaxLifetime:
      required

  tooFrequent:
    risks:
      - unnecessary-database-traffic
      - noisy-metrics

  enabledWithoutNeed:
    forbiddenByPolicy
```

Keepalive não é mecanismo para corrigir conexão ocupada por transação longa.

---

### 26. Validar keepalive

Script:

```text
validate-hikaricp-keepalive.ps1
```

Simule um intermediário que encerra conexões ociosas.

Compare:

```text
keepalive desabilitado;

keepalive controlado.
```

Observe:

- falha no primeiro uso;
- substituição;
- latência;
- criação;
- tráfego adicional;
- recuperação.

---

### 27. Criar política de validação

Arquivo:

```text
hikaricp-validation-policy.yaml
```

Conteúdo:

```yaml
validation:
  timeout:
    explicit:
      required

  driver:
    jdbc4IsValid:
      preferredWhenSupported

  testQuery:
    avoidUnlessRequired:
      true

  validationCannotExceedAcquisitionBudget:
    true

  failure:
    removeConnection:
      required
```

Não defina query de teste sem necessidade do driver.

---

### 28. Validar `validationTimeout`

O tempo de validação precisa ser:

- menor que o budget de aquisição;
- curto o suficiente para não prender threads;
- longo o suficiente para o ambiente;
- coerente com falhas reais.

Teste:

- banco saudável;
- rede lenta;
- banco indisponível;
- conexão inválida;
- recuperação.

---

### 29. Criar política de inicialização

Arquivo:

```text
hikaricp-initialization-policy.yaml
```

Conteúdo:

```yaml
initialization:
  initializationFailTimeout:
    decide:
      - fail-fast
      - delayed-start
      - background-retry

  readiness:
    separateFromLiveness:
      required

  migration:
    dependency:
      documented

  databaseUnavailableAtStartup:
    scenario:
      required

  infiniteStartupWait:
    forbidden
```

A decisão depende do papel do serviço.

---

### 30. Validar inicialização

Script:

```text
validate-hikaricp-initialization.ps1
```

Cenários:

```text
banco disponível;

banco indisponível;

banco lento;

credencial inválida;

DNS indisponível;

banco retorna depois.
```

Valide:

- processo inicia;
- readiness;
- liveness;
- logs;
- retries;
- tempo;
- orquestrador;
- recuperação.

---

### 31. Criar política de leak detection

Arquivo:

```text
hikaricp-leak-detection-policy.yaml
```

Conteúdo:

```yaml
leakDetection:
  use:
    diagnosticsOnly

  threshold:
    aboveExpectedUsage:
      required

  production:
    permanentEnablement:
      requiresApproval

  alert:
    classification:
      suspected-leak

  confirmWith:
    - transaction-duration
    - thread-dump
    - stack
    - code-review
    - repeated-occurrence

  longTransaction:
    notAutomaticallyLeak:
      true
```

---

### 32. Entender falso positivo de leak

Exemplo:

```text
leakDetectionThreshold:
2 segundos.

transação legítima:
3 segundos.
```

O alerta aparecerá, mas a conexão pode ser devolvida corretamente.

A investigação precisa verificar:

- stack;
- duração;
- retorno;
- frequência;
- transação;
- bloqueio;
- chamada externa;
- caminho de exceção.

---

### 33. Validar leak detection

Script:

```text
validate-hikaricp-leak-detection.ps1
```

Cenários:

- conexão devolvida;
- conexão não fechada;
- transação longa;
- lock wait;
- chamada externa dentro da transação;
- exceção antes do close;
- timeout;
- cancelamento.

Resultado:

```text
NO_LEAK;

SUSPECTED_LEAK;

LONG_HELD_CONNECTION;

BLOCKED_TRANSACTION;

INCONCLUSIVE.
```

---

### 34. Criar política de réplicas

Arquivo:

```text
hikaricp-replica-policy.yaml
```

Conteúdo:

```yaml
replicas:
  totalConnections:
    formula:
      replicas-times-pools-times-maximum

  scaleOut:
    requires:
      - database-budget
      - connection-budget
      - startup-burst-review
      - minimum-idle-review

  rollingDeployment:
    includeSurge:
      true

  autoscaling:
    poolMultiplication:
      monitored

  NMinusOne:
    databaseCapacity:
      preserved
```

Scale-out da aplicação multiplica conexões potenciais.

---

### 35. Simular múltiplas réplicas

Relatório:

```text
hikaricp-replica-report.yaml
```

Exemplo:

```yaml
replicas:
  steady:
    4

  rolloutSurge:
    2

  totalDuringRollout:
    6

  poolsPerReplica:
    1

  maximumPoolSize:
    12

  potentialConnections:
    72

  databaseBudget:
    60

  result:
    BLOCKED
```

O rollout pode exceder o budget mesmo quando o steady state está aprovado.

---

### 36. Criar política de falhas

Arquivo:

```text
hikaricp-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  scenarios:
    required:
      - database-restart
      - network-interruption
      - stale-connection
      - authentication-failure
      - pool-exhaustion
      - connection-creation-slow

  recovery:
    required:
      - bounded-time
      - metrics
      - logs
      - readiness
      - no-manual-restart

  retryStorm:
    forbidden

  databaseOverload:
    action:
      protect-not-expand-pool
```

---

### 37. Simular exaustão

Script:

```text
simulate-hikaricp-exhaustion.ps1
```

Crie transações controladas que mantenham conexões por tempo limitado.

Observe:

- active;
- pending;
- acquisition;
- timeout;
- request p95;
- database CPU;
- lock wait.

Finalize todas as transações.

Nunca deixe o cenário ativo após a coleta.

---

### 38. Simular restart do banco

Script:

```text
simulate-database-restart.ps1
```

Fluxo:

1. aquecer aplicação;
2. iniciar workload leve;
3. reiniciar PostgreSQL local;
4. observar erros;
5. validar retirada de conexões inválidas;
6. validar criação de conexões novas;
7. acompanhar readiness;
8. confirmar recuperação;
9. parar workload;
10. coletar evidence.

O laboratório deve usar apenas banco descartável.

---

### 39. Validar recuperação

Script:

```text
simulate-hikaricp-recovery.ps1
```

Critérios:

- falhas são observáveis;
- chamadas não ficam presas indefinidamente;
- pool remove conexões inválidas;
- novas conexões são criadas;
- pending diminui;
- timeout volta ao baseline;
- readiness se recupera;
- não há restart loop;
- banco não recebe tempestade de conexão.

---

### 40. Criar política de regressão

Arquivo:

```text
hikaricp-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - throughput
    - request-latency
    - acquisition-time
    - usage-time
    - pending
    - timeout-count
    - database-cpu
    - database-connections
    - lock-wait
    - recovery-time

  absoluteBudget:
    required

  relativeBudget:
    required

  databaseImpact:
    critical:
      true

  applicationImprovementWithDatabaseRegression:
    reject:
      true
```

Melhorar latência da aplicação causando regressão no banco não é aprovação.

---

### 41. Comparar perfis

Script:

```text
compare-hikaricp-profiles.ps1
```

Compare:

```text
baseline;

undersized;

balanced;

oversized;

resilient;

rollback.
```

Para cada perfil, registre:

- config;
- workload;
- throughput;
- p95;
- active;
- idle;
- pending;
- acquisition;
- usage;
- timeouts;
- DB CPU;
- DB connections;
- lock waits;
- recovery;
- decision.

---

### 42. Criar política de qualidade

Arquivo:

```text
hikaricp-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingDatabaseLimit:
    result:
      inconclusive

  unknownReplicaCount:
    result:
      invalid-total-budget

  mixedWorkload:
    action:
      split-analysis

  missingPendingMetric:
    result:
      limited

  singleRun:
    result:
      inconclusive

  databaseStateChanged:
    action:
      repeat-baseline

  staleBaseline:
    action:
      recollect
```

---

### 43. Criar política de segurança

Arquivo:

```text
hikaricp-security-policy.yaml
```

Conteúdo:

```yaml
security:
  datasource:
    credentials:
      forbiddenInRepository

  JDBCUrl:
    sensitiveParameters:
      redact

  metrics:
    forbiddenLabels:
      - username
      - hostname
      - connection-id

  reports:
    redact:
      - private-host
      - database-name
      - user

  externalSharing:
    forbiddenInLaboratory
```

---

### 44. Criar cenários

Arquivo:

```text
hikaricp-scenarios.yaml
```

Cenários:

```text
healthy-baseline;

undersized-pool;

oversized-pool;

minimum-idle-high;

minimum-idle-low;

acquisition-timeout-short;

acquisition-timeout-long;

connection-churn;

stale-connection;

keepalive-required;

keepalive-unnecessary;

startup-fail-fast;

startup-delayed;

suspected-leak;

long-transaction;

database-restart;

network-interruption;

rolling-deployment-surge;

autoscaling-connection-multiplication.
```

Cada cenário registra:

- profile;
- workload;
- replica count;
- DB budget;
- metrics;
- hypothesis;
- result;
- rollback;
- evidence.

---

### 45. Criar relatório de baseline

Arquivo:

```text
hikaricp-baseline-report.yaml
```

Estrutura:

```yaml
baseline:
  profile:
    baseline

  replicas:
    2

  maximumPoolSize:
    10

  minimumIdle:
    10

  metrics:
    activeP95:
      6

    pendingP95:
      0

    acquisitionP95Ms:
      4

    usageP95Ms:
      55

    timeouts:
      0

  database:
    connections:
      20

    status:
      healthy

  decision:
    baseline-approved
```

Valores didáticos.

---

### 46. Criar relatório de comparação

Arquivo:

```text
hikaricp-size-comparison-report.yaml
```

Inclua:

- baseline;
- pool candidato;
- diferença;
- budget;
- banco;
- réplicas;
- headroom;
- risco;
- confidence;
- decision.

Não aprove apenas porque `pending=0`.

Pool excessivo também pode manter pending em zero.

---

### 47. Validar rollback

Script:

```text
validate-hikaricp-rollback.ps1
```

Procedimento:

1. aplicar profile candidato;
2. executar cenário;
3. registrar comportamento;
4. restaurar profile baseline;
5. reiniciar de forma controlada;
6. repetir baseline;
7. comparar;
8. confirmar recuperação.

O rollback precisa ser testado, não apenas documentado.

---

### 48. Criar matriz de testes

Arquivo:

```text
HIKARICP_TEST_MATRIX.md
```

Cenários:

- baseline;
- active;
- idle;
- pending;
- acquisition;
- usage;
- timeout;
- maximumPoolSize;
- minimumIdle;
- connectionTimeout;
- idleTimeout;
- maxLifetime;
- keepaliveTime;
- validationTimeout;
- initializationFailTimeout;
- leakDetectionThreshold;
- multiple replicas;
- rollout surge;
- autoscaling;
- database restart;
- network failure;
- stale connection;
- connection churn;
- suspected leak;
- long transaction;
- recovery;
- rollback;
- security scan;
- evidence sanitizada.

---

### 49. Criar troubleshooting

Arquivo:

```text
HIKARICP_TROUBLESHOOTING.md
```

Inclua:

- active sempre no máximo;
- pending sem CPU alta;
- pending com query lenta;
- timeout de aquisição;
- muitas conexões ociosas;
- criação frequente;
- conexões morrem antes de `maxLifetime`;
- keepalive sem efeito;
- validação lenta;
- startup bloqueado;
- readiness incorreta;
- leak detection falso positivo;
- conexão não devolvida;
- rollout excede budget;
- autoscaling derruba banco;
- restart não recupera;
- rollback não restaura baseline;
- cache Caffeine antecipado.

---

### 50. Coletar evidence

Script:

```text
collect-hikaricp-evidence.ps1
```

Arquivo:

```text
hikaricp-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- pool name;
- profile;
- replica category;
- database budget status;
- baseline status;
- size status;
- minimum idle status;
- acquisition status;
- lifetime status;
- keepalive status;
- validation status;
- initialization status;
- leak detection status;
- failure recovery status;
- rollback status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- JDBC URL completa;
- usuário;
- senha;
- hostname;
- IP;
- database name real;
- connection IDs;
- SQL;
- dados de cache da aula 582.

---

### 51. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\hikaricp\validate-hikaricp-contract.ps1

.\scripts\performance\hikaricp\collect-hikaricp-baseline.ps1

.\scripts\performance\hikaricp\calculate-database-concurrency.ps1

.\scripts\performance\hikaricp\calculate-hikaricp-pool-size.ps1

.\scripts\performance\hikaricp\validate-hikaricp-total-connections.ps1

.\scripts\performance\hikaricp\compare-hikaricp-profiles.ps1

.\scripts\performance\hikaricp\analyze-hikaricp-acquisition.ps1

.\scripts\performance\hikaricp\validate-hikaricp-lifetime.ps1

.\scripts\performance\hikaricp\validate-hikaricp-keepalive.ps1

.\scripts\performance\hikaricp\validate-hikaricp-initialization.ps1

.\scripts\performance\hikaricp\validate-hikaricp-leak-detection.ps1

.\scripts\performance\hikaricp\simulate-hikaricp-exhaustion.ps1

.\scripts\performance\hikaricp\simulate-database-restart.ps1

.\scripts\performance\hikaricp\simulate-hikaricp-recovery.ps1

.\scripts\performance\hikaricp\validate-hikaricp-rollback.ps1

.\scripts\performance\hikaricp\scan-hikaricp-output.ps1

.\scripts\performance\hikaricp\collect-hikaricp-evidence.ps1

.\scripts\performance\hikaricp\verify-hikaricp-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- baseline aprovada;
- concorrência estimada;
- budget total validado;
- perfis comparados;
- aquisição analisada;
- lifetime validado;
- keepalive validado;
- inicialização validada;
- leak detection validado;
- exaustão simulada;
- restart simulado;
- recuperação validada;
- rollback validado;
- segurança aprovada;
- evidence sanitizada;
- cache Caffeine não antecipado.

---

### 52. Encerrar o laboratório

Pare workloads e cenários.

Confirme:

- nenhuma transação aberta;
- pending retornou ao baseline;
- banco saudável;
- conexões estáveis;
- profile rollback disponível;
- arquivos temporários fora do Git.

Remova apenas artifacts temporários:

```powershell
Remove-Item `
  .tmp/hikaricp `
  -Recurse `
  -Force
```

Não execute limpeza global.

---

## Entendendo o que foi feito

### O pool ganhou budget

O tamanho passou a respeitar capacidade do banco, réplicas e workloads.

### Concorrência ganhou medição

Throughput e usage time passaram a orientar o dimensionamento.

### Active ganhou contexto

Active igual ao máximo deixou de ser problema isolado.

### Pending ganhou prioridade

Espera por conexão passou a ser medida diretamente.

### `minimumIdle` ganhou custo

Conexões ociosas passaram a ser multiplicadas por réplica.

### Timeouts ganharam jornada

`connectionTimeout` passou a caber no budget restante.

### Lifetime ganhou infraestrutura

Rotação de conexões passou a considerar limites externos.

### Keepalive ganhou finalidade

Testes periódicos passaram a existir apenas quando idle connections podem ser encerradas.

### Leak detection ganhou diagnóstico

Conexão longa deixou de ser confundida automaticamente com leak.

### Réplicas ganharam multiplicação

Scale-out e rollout passaram a considerar conexões totais.

### Falhas ganharam recuperação

Restart e interrupção passaram a ser validados sem intervenção manual.

### A próxima aula ganhou fronteira

O cache local Caffeine será tratado depois que conexão, banco e pool estiverem compreendidos.

---

## Erros comuns importantes

### Aumentar o pool ao ver pending

A causa pode ser SQL lento, locks ou transação longa.

### Usar o limite do banco por réplica

O limite é compartilhado.

### Ignorar rollout surge

Réplicas temporárias também criam pools.

### Manter `minimumIdle` alto em todas as réplicas

Conexões ociosas se multiplicam.

### Usar `connectionTimeout` maior que a jornada

A fila fica escondida.

### Configurar lifetime sem conhecer a infraestrutura

Conexões podem morrer antes do pool retirá-las.

### Ativar keepalive sem necessidade

Tráfego e ruído aumentam.

### Tratar leak alert como prova

Pode ser transação longa ou lock wait.

### Testar restart no banco real

O cenário precisa ser descartável e autorizado.

### Antecipar Caffeine

Cache local pertence à aula 582.

---

## Comandos úteis

### Ver métricas do pool

```powershell
curl.exe `
  http://localhost:8080/actuator/metrics/hikaricp.connections.active

curl.exe `
  http://localhost:8080/actuator/metrics/hikaricp.connections.pending
```

### Consultar conexões no PostgreSQL

```sql
SELECT
    application_name,
    state,
    count(*)
FROM pg_stat_activity
GROUP BY
    application_name,
    state
ORDER BY
    application_name,
    state;
```

### Calcular pool

```powershell
.\scripts\performance\hikaricp\calculate-hikaricp-pool-size.ps1
```

### Validar conexões totais

```powershell
.\scripts\performance\hikaricp\validate-hikaricp-total-connections.ps1
```

### Comparar perfis

```powershell
.\scripts\performance\hikaricp\compare-hikaricp-profiles.ps1
```

---

## Exercício guiado

### Parte 1 — Baseline

Colete active, idle, pending, acquisition e usage.

### Parte 2 — Concorrência

Estime demanda de conexões.

### Parte 3 — Database budget

Distribua conexões entre serviços e réplicas.

### Parte 4 — Pool size

Compare undersized, balanced e oversized.

### Parte 5 — Idle e acquisition

Valide `minimumIdle` e `connectionTimeout`.

### Parte 6 — Lifetime

Valide `idleTimeout`, `maxLifetime` e keepalive.

### Parte 7 — Startup

Valide initialization e readiness.

### Parte 8 — Leak

Diferencie leak, transação longa e lock.

### Parte 9 — Failure

Simule exaustão e restart do banco.

### Parte 10 — Gate

Valide recuperação, rollback, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 580 e ponte para a aula 582 foram preservadas;
- pool, borrow, return, active, idle, pending, acquisition, exhaustion, lifetime, keepalive, validation, initialization e leak detection foram definidos;
- contrato e catálogo de pools foram criados;
- métricas de active, idle, total, pending, acquire, usage, creation e timeout foram instrumentadas;
- baseline possui workload, repetições, transação, query, banco, release e profile;
- acquisition, usage, query e transaction time foram diferenciados;
- concorrência de banco foi estimada com throughput e tempo de posse;
- capacidade do banco, conexões reservadas, réplicas e pools foram considerados;
- tamanho do pool foi derivado de demanda medida e não de valor arbitrário;
- perfis undersized, balanced, oversized, resilient e rollback foram comparados;
- conexões totais foram calculadas por réplicas, pools e máximo;
- `minimumIdle` foi avaliado por burst, custo de conexão e multiplicação por réplica;
- `connectionTimeout` foi relacionado ao budget restante;
- pending, acquisition, timeout, usage e banco foram correlacionados;
- pool pequeno e banco lento foram diferenciados;
- `maxLifetime` foi relacionado aos limites da infraestrutura;
- `idleTimeout` foi tratado separadamente de lifetime;
- keepalive foi usado somente quando existe risco de idle connection expirar;
- `validationTimeout` foi limitado pelo budget de aquisição;
- initialization foi testada com banco disponível e indisponível;
- readiness e liveness foram separadas;
- leak detection foi usado como diagnóstico, não como prova;
- long-held connection, lock wait e leak foram diferenciados;
- scale-out, rollout surge e autoscaling consideraram multiplicação de conexões;
- exaustão do pool, restart do banco e recuperação foram simulados em ambiente descartável;
- regressões da aplicação e do banco foram avaliadas em conjunto;
- rollback foi executado e comparado à baseline;
- políticas de qualidade, segurança e failure foram criadas;
- cenários, matriz de testes, troubleshooting, evidence sanitizada e cleanup estão presentes;
- nenhuma credencial, JDBC URL completa, hostname, SQL ou conexão identificável foi commitada;
- cache local Caffeine não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/hikaricp `
  scripts/performance/hikaricp `
  docs/performance/hikaricp `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|jdbc:|hostname|databaseName|connectionId|rawSql|caffeine|maximumSize|expireAfterWrite"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar tuning do HikariCP"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- JDBC URL completa;
- hosts;
- nomes reais de banco;
- SQL bruto;
- artifacts temporários;
- configurações reais de produção;
- Caffeine;
- material da aula 582.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você dimensionou e validou o HikariCP com base em demanda, capacidade e falhas.

Você trabalhou com:

```text
maximumPoolSize;

minimumIdle;

connectionTimeout;

idleTimeout;

maxLifetime;

keepaliveTime;

validationTimeout;

initializationFailTimeout;

leakDetectionThreshold;

active;

idle;

pending;

acquisition;

usage;

múltiplas réplicas;

restart;

rollback.
```

Você comprovou que pool maior não cria capacidade no banco; active igual ao máximo só ganha significado quando existe pending, espera ou timeout; o tamanho precisa respeitar concorrência medida e budget total de conexões; `minimumIdle` se multiplica por réplica; `connectionTimeout` precisa caber na jornada; `maxLifetime` e keepalive precisam considerar infraestrutura; leak detection produz suspeita, não prova; e scale-out, rollout e autoscaling precisam considerar o número total de sessões.

A próxima aula será:

```text
582 - M18.27 - Cache local Caffeine
```

Nela, você irá criar cache local por réplica com limites, TTL, políticas de expiração, métricas, invalidação, concorrência, prevenção de stampede e comparação com a fonte de dados.

Nenhuma configuração de Caffeine, `maximumSize`, `expireAfterWrite`, `expireAfterAccess`, `refreshAfterWrite`, cache loader, hit, miss, eviction ou invalidação de cache local foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Coletei baseline do pool.
- [ ] Diferenciei acquisition e usage.
- [ ] Calculei concorrência de banco.
- [ ] Validei budget total.
- [ ] Comparei pools pequenos e grandes.
- [ ] Validei timeouts e lifetime.
- [ ] Testei leak detection.
- [ ] Simulei falha, recuperação e rollback.

---

## Troubleshooting adicional

### Active está sempre no máximo

Verifique pending, acquisition, usage, query e transação antes de aumentar.

### Pending cresce com banco saudável

O pool pode estar pequeno ou conexões podem estar retidas.

### Pending cresce com banco degradado

Reduza pressão e corrija o banco antes de expandir o pool.

### Muitas conexões ficam idle

Revise `minimumIdle`, réplicas, tráfego e custo de criação.

### Conexões são recriadas com frequência

Revise `idleTimeout`, `maxLifetime`, rede e infraestrutura.

### Keepalive não resolve

A falha pode ocorrer em conexão ativa ou por causa diferente de idle timeout.

### Leak detection alerta durante lock

Classifique como conexão longa ou bloqueada até comprovar ausência de retorno.

### Startup nunca fica ready

Revise initialization, banco, credenciais, DNS e probes.

### Rollout excede o limite do banco

Inclua surge no cálculo total.

### A implementação começou a criar cache local

Preserve esse trabalho para a aula 582.

---

## Perguntas de revisão

1. O que é connection pool?
2. Qual diferença entre conexão física e lógica?
3. O que significa active?
4. O que significa pending?
5. O que é acquisition time?
6. O que é usage time?
7. Como estimar concorrência de banco?
8. Por que pool maior pode piorar?
9. Como calcular conexões totais?
10. Para que serve `minimumIdle`?
11. Como definir `connectionTimeout`?
12. Qual função de `maxLifetime`?
13. Qual diferença entre `idleTimeout` e `maxLifetime`?
14. Quando usar keepalive?
15. Para que serve `validationTimeout`?
16. O que faz initialization fail policy?
17. Leak detection prova leak?
18. Como scale-out afeta conexões?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Reutilização de conexões.
2. Sessão real versus handle emprestado.
3. Conexão em uso.
4. Thread aguardando conexão.
5. Tempo para adquirir.
6. Tempo de posse.
7. Throughput vezes tempo de posse.
8. Aumenta concorrência no banco.
9. Réplicas vezes pools vezes máximo.
10. Manter conexões prontas.
11. Caber no budget da jornada.
12. Retirar conexões antigas.
13. Ociosidade versus idade total.
14. Quando idle connections podem expirar.
15. Limitar validação.
16. Definir comportamento no startup.
17. Não, apenas suspeita.
18. Multiplica pools.
19. Cache local Caffeine.
20. Cache local Caffeine.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 581 - M18.26 - HikariCP tuning

- Continuei após Performance de banco.
- Entendi pool, borrow, return, active, idle, pending e acquisition.
- Criei contrato e catálogo de pools.
- Instrumentei métricas de active, idle, total, pending, acquisition, usage, creation e timeout.
- Coletei baseline com workload e repetições.
- Diferenciei acquisition, usage, query e transaction time.
- Estimei concorrência de banco com throughput e tempo de posse.
- Calculei budget total de conexões.
- Considerei serviços, réplicas, pools, rollout e headroom.
- Comparei perfis undersized, balanced e oversized.
- Validei `maximumPoolSize` por demanda e capacidade.
- Avaliei `minimumIdle` e multiplicação de sessões.
- Relacionei `connectionTimeout` ao budget da jornada.
- Diferenciei pool pequeno e banco lento.
- Validei `idleTimeout` e `maxLifetime`.
- Testei keepalive e validação.
- Testei initialization com banco disponível e indisponível.
- Diferenciei leak, conexão longa e transação bloqueada.
- Simulei exaustão, restart e recuperação.
- Validei múltiplas réplicas e rollout surge.
- Executei rollback e recuperei a baseline.
- Coletei evidence sanitizada.
- Não antecipei cache local Caffeine.
- Próxima aula: Cache local Caffeine.
```

---

## Referência técnica curta

- HikariCP configuration.
- Connection pool sizing.
- Connection acquisition time.
- Pool usage time.
- Connection lifetime.
- Idle connection management.
- Keepalive.
- Connection validation.
- Leak detection.
- Multi-replica connection budgets.

Regra final:

```text
tuning do HikariCP precisa começar por baseline, concorrência de banco, tempo de posse, limites do PostgreSQL, quantidade de réplicas, pools e headroom: maximumPoolSize é derivado de demanda medida e budget total, minimumIdle é avaliado pelo custo de criação e pela multiplicação de sessões, connectionTimeout cabe no tempo restante da jornada e não deve esconder fila, enquanto idleTimeout, maxLifetime, keepaliveTime e validationTimeout são alinhados ao comportamento da infraestrutura e às falhas reais; leakDetectionThreshold gera suspeita e precisa ser correlacionado a transações, locks, stacks e devolução da conexão, scale-out e rollout incluem todas as conexões potenciais, e qualquer melhora da aplicação que degrade CPU, locks ou sessões do banco é rejeitada; falhas, recovery e rollback são testados em ambiente descartável, deixando para a aula 582 o cache local Caffeine com maximumSize, expiração, métricas, invalidação e prevenção de stampede.
```
