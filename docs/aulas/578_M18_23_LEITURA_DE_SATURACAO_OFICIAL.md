# 578 - M18.23 - Leitura de saturacao

## Apresentação da aula

Na aula 577, você transformou expectativas de desempenho em orçamentos mensuráveis.

Você definiu budgets para:

```text
latência;

throughput;

CPU;

memória;

alocação;

queries;

payloads;

dependências;

retries;

jornadas.
```

Também criou gates para verificar:

```text
limite absoluto;

regressão relativa;

tamanho de amostra;

noise margin;

exceções;

validade da baseline.
```

Esses budgets respondem:

```text
a operação
continua dentro
do limite aceitável?
```

Agora surge outra pergunta:

```text
o sistema está apenas
usando muito um recurso

ou já está
sem capacidade
para aceitar mais trabalho
sem gerar fila,
espera,
erro
ou degradação?
```

Essa é a diferença entre **utilização** e **saturação**.

Utilização mede quanto de um recurso está sendo usado.

Saturação aparece quando o recurso não consegue atender imediatamente a nova demanda.

Exemplo:

```text
CPU:
85%.

fila de execução:
estável.

latência:
estável.

throttling:
zero.
```

Esse cenário pode representar utilização alta sem saturação.

Outro cenário:

```text
CPU:
70%.

executor:
active = max.

queue:
crescendo.

latência:
crescendo.

timeouts:
aumentando.
```

Aqui existe saturação mesmo sem CPU em 100%.

O recurso limitante pode ser:

- pool de threads;
- pool de conexões;
- fila interna;
- partições Kafka;
- dependência externa;
- disco;
- rede;
- banco de dados;
- memória;
- CPU;
- limite do container;
- rate limit;
- semáforo;
- executor;
- lock.

A pergunta central desta aula será:

```text
como reconhecer
saturação real

usando sinais combinados
de utilização,
fila,
espera,
latência,
erros,
throttling,
lag
e perda de headroom?
```

Você irá aplicar duas abordagens clássicas:

```text
USE Method;

RED Method.
```

A USE Method organiza recursos por:

```text
Utilization;

Saturation;

Errors.
```

A RED Method organiza serviços por:

```text
Rate;

Errors;

Duration.
```

As duas se complementam.

RED mostra o impacto; USE ajuda a localizar o recurso.

A aula irá analisar saturação em:

- CPU;
- container CPU;
- memória;
- heap;
- garbage collector;
- pools de threads;
- executores;
- pools JDBC;
- banco de dados;
- Kafka;
- filas;
- disco;
- rede;
- dependências;
- retries;
- rate limits.

O diagnóstico não depende de um único gráfico. Antes de concluir, verifique duração, fila, throttling, throughput, latência, erros, workload, histórico, dependências, capacidade sustentável e headroom.

A aula também irá trabalhar com a curva não linear de latência.

Quando a utilização se aproxima da capacidade sustentável, pequenos aumentos de demanda podem causar grandes aumentos de fila e latência.

Exemplo didático:

```text
utilização:
60%.

p95:
100 ms.
```

```text
utilização:
75%.

p95:
120 ms.
```

```text
utilização:
90%.

p95:
420 ms.
```

O crescimento de latência não é proporcional.

Ele reflete espera acumulada.

A aula não irá aprofundar ainda otimizações específicas de APIs HTTP.

Não serão implementados:

- redução de payload por endpoint;
- paginação otimizada;
- compressão HTTP;
- cache de resposta;
- ETag;
- índices específicos para endpoints;
- serialização otimizada;
- filtros de campos;
- batch de chamadas;
- HTTP/2;
- pool de cliente HTTP específico;
- otimização de controllers;
- tuning de queries por endpoint;
- benchmark de API detalhado.

Esses assuntos pertencem à próxima aula oficial:

```text
579 - M18.24 - Performance de API
```

A regra central será:

```text
saturação não é
uso alto isolado;

é falta de capacidade
observada por fila,
espera,
latência,
erro,
throttling
ou backlog.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
576:
Capacity planning.

577:
Orcamento de performance.

578:
Leitura de saturacao.

579:
Performance de API.
```

A progressão é:

```text
dimensionar capacidade;

definir limites;

interpretar esgotamento;

otimizar APIs.
```

Nesta aula:

```text
USE Method:
sim.

RED Method:
sim.

CPU saturation:
sim.

CPU throttling:
sim.

memory pressure:
sim.

GC pressure:
sim.

thread pool saturation:
sim.

connection pool saturation:
sim.

Kafka lag:
sim.

queue growth:
sim.

disk saturation:
sim.

network saturation:
sim.

dependency saturation:
sim.

retry amplification:
sim.

otimização específica de API:
não.

cache HTTP:
não.

paginação:
não.
```

Você reutilizará dashboards, métricas, SLOs, budgets, capacity planning, GC logs, dumps, JFR, JMC, traces, logs, alertas e runbooks.

O mesmo valor pode ser saudável ou crítico.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
observability/saturation
├── saturation-reading-contract.yaml
├── saturation-resource-catalog.yaml
├── saturation-use-method-policy.yaml
├── saturation-red-method-policy.yaml
├── saturation-cpu-policy.yaml
├── saturation-memory-policy.yaml
├── saturation-gc-policy.yaml
├── saturation-thread-pool-policy.yaml
├── saturation-connection-pool-policy.yaml
├── saturation-database-policy.yaml
├── saturation-kafka-policy.yaml
├── saturation-queue-policy.yaml
├── saturation-disk-policy.yaml
├── saturation-network-policy.yaml
├── saturation-dependency-policy.yaml
├── saturation-retry-policy.yaml
├── saturation-correlation-policy.yaml
├── saturation-classification-policy.yaml
├── saturation-data-quality-policy.yaml
├── saturation-security-policy.yaml
├── saturation-failure-policy.yaml
├── saturation-scenarios.yaml
└── saturation-evidence.yaml

observability/saturation/dashboards
├── saturation-overview-dashboard.json
├── saturation-cpu-dashboard.json
├── saturation-memory-dashboard.json
├── saturation-pools-dashboard.json
├── saturation-kafka-dashboard.json
└── saturation-dependencies-dashboard.json

observability/saturation/reports
├── saturation-baseline-report.yaml
├── saturation-cpu-report.yaml
├── saturation-thread-pool-report.yaml
├── saturation-connection-pool-report.yaml
├── saturation-kafka-report.yaml
├── saturation-dependency-report.yaml
└── saturation-gate-report.yaml

scripts/observability/saturation
├── validate-saturation-contract.ps1
├── validate-saturation-metrics.ps1
├── collect-saturation-baseline.ps1
├── analyze-cpu-saturation.ps1
├── analyze-memory-pressure.ps1
├── analyze-gc-pressure.ps1
├── analyze-thread-pool-saturation.ps1
├── analyze-connection-pool-saturation.ps1
├── analyze-database-saturation.ps1
├── analyze-kafka-saturation.ps1
├── analyze-queue-saturation.ps1
├── analyze-disk-saturation.ps1
├── analyze-network-saturation.ps1
├── analyze-dependency-saturation.ps1
├── analyze-retry-amplification.ps1
├── correlate-saturation-signals.ps1
├── classify-saturation-state.ps1
├── simulate-saturation-scenarios.ps1
├── scan-saturation-output.ps1
├── collect-saturation-evidence.ps1
└── verify-saturation-baseline.ps1

docs/observability/saturation
├── SATURATION_OVERVIEW.md
├── USE_AND_RED_METHODS.md
├── CPU_SATURATION_GUIDE.md
├── MEMORY_AND_GC_PRESSURE.md
├── THREAD_AND_CONNECTION_POOLS.md
├── KAFKA_AND_QUEUE_SATURATION.md
├── DISK_NETWORK_DEPENDENCIES.md
├── SATURATION_CORRELATION_GUIDE.md
├── SATURATION_TEST_MATRIX.md
└── SATURATION_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, dashboards, baseline, estados classificados, análises de CPU, memória, GC, pools, Kafka, filas, disco, rede, dependências, retries e evidence sanitizada.

Você irá validar métricas, criar contratos, coletar baseline, aplicar USE e RED, analisar cada recurso, correlacionar sinais, classificar saturação, simular cenários, registrar limitações e executar o gate.

---

## Conceito essencial

### Utilization

Proporção de tempo ou capacidade em uso.

---

### Saturation

Trabalho que não pode ser atendido imediatamente e precisa esperar, ser rejeitado ou acumulado.

---

### Error

Falha explícita relacionada ao recurso ou serviço.

---

### USE Method

Método que avalia cada recurso por utilização, saturação e erros.

---

### RED Method

Método que avalia cada serviço por rate, errors e duration.

---

### Queue depth

Quantidade de itens aguardando processamento.

---

### Queue growth rate

Velocidade de crescimento da fila.

```text
queue growth
=
ingress
-
egress.
```

---

### Wait time

Tempo gasto aguardando recurso.

---

### Throttling

Limitação ativa de consumo imposta por quota, container, sistema operacional ou dependência.

---

### Headroom

Margem disponível antes do limite operacional.

---

### Backpressure

Mecanismo que reduz, bloqueia ou rejeita entrada quando o downstream não acompanha.

---

### Load shedding

Rejeição controlada de parte da carga para preservar o sistema.

---

### Pool exhaustion

Condição em que todas as unidades de um pool estão ocupadas.

---

### Connection wait

Tempo aguardando conexão disponível.

---

### Consumer lag

Diferença entre mensagens produzidas e mensagens consumidas.

---

### Run queue

Threads ou tarefas prontas aguardando CPU.

---

### Memory pressure

Pressão causada pela proximidade de limites de heap, memória nativa ou container.

---

### Retry amplification

Aumento de carga causado por novas tentativas.

---

### Nonlinear latency

Crescimento acelerado da latência quando o sistema se aproxima da capacidade.

---

### Saturation window

Janela em que sinais de saturação permanecem presentes.

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

- release identificada;
- dashboards disponíveis;
- métricas possuem timestamps;
- budgets da aula 577 estão versionados;
- capacity plan da aula 576 está disponível;
- workload é reproduzível;
- nenhuma otimização específica de API será antecipada;
- nenhum valor de produção será inventado.

---

### 2. Criar contrato de leitura

Arquivo:

```text
saturation-reading-contract.yaml
```

Conteúdo:

```yaml
saturation:
  resource:
    required:
      - name
      - type
      - owner
      - limit
      - metric-source

  signals:
    required:
      - utilization
      - saturation
      - errors
      - rate
      - duration

  window:
    required:
      - start
      - end
      - workload
      - release

  classification:
    allowed:
      - healthy
      - highly-utilized
      - saturation-candidate
      - saturated
      - recovering
      - inconclusive

  conclusion:
    required:
      - evidence
      - impact
      - confidence
      - next-action

  apiOptimization:
    deferredToLesson579
```

---

### 3. Criar catálogo de recursos

Arquivo:

```text
saturation-resource-catalog.yaml
```

Conteúdo:

```yaml
resources:
  - id:
      cpu-orders-api

    type:
      cpu

    owner:
      platform

    utilizationMetric:
      process_cpu_usage

    saturationMetrics:
      - container_cpu_throttled_seconds_total
      - run_queue
      - runnable_threads

    errorMetrics:
      - container_oom_events

  - id:
      jdbc-pool-orders-api

    type:
      connection-pool

    owner:
      orders-api

    utilizationMetric:
      hikaricp_connections_active

    saturationMetrics:
      - hikaricp_connections_pending

    errorMetrics:
      - hikaricp_connections_timeout_total
```

Cada recurso precisa de limite, métrica, unidade, owner, interpretação e fallback.

---

### 4. Aplicar USE Method

Arquivo:

```text
saturation-use-method-policy.yaml
```

Conteúdo:

```yaml
USE:
  forEveryResource:
    inspect:
      - utilization
      - saturation
      - errors

  utilizationOnly:
    conclusion:
      forbidden

  saturationEvidence:
    prefer:
      - queue
      - wait
      - throttling
      - rejection
      - backlog

  errors:
    correlateWithWindow:
      required
```

Exemplo para CPU:

```text
utilization:
process CPU.

saturation:
throttling,
run queue,
runnable threads.

errors:
OOM,
process termination,
resource limit event.
```

---

### 5. Aplicar RED Method

Arquivo:

```text
saturation-red-method-policy.yaml
```

Conteúdo:

```yaml
RED:
  rate:
    - requests-per-second
    - messages-per-second

  errors:
    - technical-error-rate
    - timeout-rate
    - rejection-rate

  duration:
    - p50
    - p95
    - p99

  correlateWithUSE:
    required
```

RED mostra o impacto no serviço.

USE procura o recurso responsável.

---

### 6. Criar baseline

Script:

```text
collect-saturation-baseline.ps1
```

Colete rate, errors, duration, CPU, throttling, heap, GC, threads, executores, JDBC, Kafka, disco, rede, dependências e retries em janela saudável.

Repita a coleta em janela equivalente.

---

### 7. Criar relatório baseline

Arquivo:

```text
saturation-baseline-report.yaml
```

Conteúdo:

```yaml
baseline:
  release:
    approved

  workload:
    standard

  window:
    15m

  RED:
    rate:
      stable

    errors:
      low

    duration:
      within-budget

  USE:
    CPU:
      utilization:
        moderate

      saturation:
        absent

    JDBC:
      utilization:
        moderate

      saturation:
        absent

    Kafka:
      utilization:
        stable

      saturation:
        absent

  conclusion:
    healthy
```

---

### 8. Criar política de classificação

Arquivo:

```text
saturation-classification-policy.yaml
```

Conteúdo:

```yaml
classification:
  healthy:
    requires:
      - budgets-preserved
      - queues-stable
      - waits-low
      - errors-low

  highlyUtilized:
    requires:
      - utilization-high
      - saturation-absent
      - budgets-preserved

  saturationCandidate:
    requiresAny:
      - queue-growing
      - wait-growing
      - throttling
      - rejections
      - lag-growing

  saturated:
    requires:
      - persistent-saturation-signal
      - service-impact

  recovering:
    requires:
      - backlog-decreasing
      - latency-improving
      - errors-decreasing

  inconclusive:
    when:
      - missing-limit
      - missing-window
      - missing-baseline
      - conflicting-data
```

---

### 9. Analisar CPU

Arquivo:

```text
saturation-cpu-policy.yaml
```

Conteúdo:

```yaml
cpu:
  utilization:
    - process-cpu
    - container-cpu

  saturation:
    - throttled-time
    - throttled-periods
    - run-queue
    - runnable-threads
    - scheduler-delay

  impact:
    - latency
    - throughput
    - queue-growth

  highCpuWithoutSaturation:
    classification:
      highly-utilized

  throttlingWithImpact:
    classification:
      saturated
```

---

### 10. Interpretar CPU alta

Cenário A:

```text
CPU:
88%.

throttling:
0.

run queue:
estável.

throughput:
estável.

p95:
dentro do budget.
```

Classificação:

```text
highly-utilized.
```

Cenário B:

```text
CPU:
75%.

throttling:
crescendo.

p95:
acima do budget.

fila:
crescendo.
```

Classificação:

```text
saturated.
```

O limite do container pode causar throttling antes de 100% do host.

---

### 11. Analisar throttling

Script:

```text
analyze-cpu-saturation.ps1
```

Calcule CPU, quota, throttled seconds e periods, run queue, p95, throughput e janela.

Não use apenas CPU média.

---

### 12. Analisar memória

Arquivo:

```text
saturation-memory-policy.yaml
```

Conteúdo:

```yaml
memory:
  utilization:
    - heap-used
    - rss
    - direct-buffers
    - metaspace

  saturation:
    - allocation-failure
    - container-memory-pressure
    - repeated-full-gc
    - swap-or-paging
    - OOM
    - headroom-breach

  impact:
    - pause
    - latency
    - restart
    - throughput

  highHeapBeforeGc:
    conclusion:
      insufficient
```

Memória precisa ser analisada depois da coleta e em relação ao limite total.

---

### 13. Analisar pressão de memória

Script:

```text
analyze-memory-pressure.ps1
```

Observe heap antes e após GC, piso pós-GC, RSS, limite, direct buffers, threads, headroom, restart e OOM.

Classifique:

```text
normal-allocation;

high-utilization;

memory-pressure-candidate;

memory-saturated;

inconclusive.
```

---

### 14. Analisar GC

Arquivo:

```text
saturation-gc-policy.yaml
```

Conteúdo:

```yaml
gc:
  utilization:
    - gc-time-ratio
    - collection-frequency

  saturation:
    - repeated-full-gc
    - low-reclamation
    - post-gc-floor-near-limit
    - allocation-stall

  errors:
    - OOM
    - evacuation-failure

  correlate:
    - heap-dump
    - allocation-rate
    - latency
    - throughput
```

GC frequente pode refletir alta alocação sem saturação, desde que recupere memória e preserve budgets.

---

### 15. Analisar pressão de GC

Script:

```text
analyze-gc-pressure.ps1
```

Considere:

- tempo total em GC;
- frequência;
- pauses;
- before/after;
- reclaimed;
- full GC;
- live set;
- throughput;
- latência.

Saturação de memória fica mais forte quando:

```text
piso pós-GC cresce;

full GC repete;

reclaimed diminui;

headroom desaparece;

latência e throughput degradam.
```

---

### 16. Analisar pool de threads

Arquivo:

```text
saturation-thread-pool-policy.yaml
```

Conteúdo:

```yaml
threadPool:
  utilization:
    - active
    - maximum

  saturation:
    - queue-size
    - queue-growth
    - task-wait-time
    - rejection-count

  impact:
    - request-latency
    - timeout
    - throughput

  activeEqualsMaxWithoutQueue:
    conclusion:
      insufficient
```

Um pool com todas as threads ocupadas pode estar saudável se não houver fila, espera ou rejeição.

---

### 17. Analisar executor

Script:

```text
analyze-thread-pool-saturation.ps1
```

Registre pool, active, maximum, queue, growth, completions, rejections, wait, throughput e p95.

Exemplo:

```text
active:
20 de 20.

queue:
0.

rejections:
0.

throughput:
estável.
```

Classificação:

```text
highly-utilized.
```

Outro:

```text
active:
20 de 20.

queue:
1.500 e crescendo.

rejections:
aumentando.

p95:
degradado.
```

Classificação:

```text
saturated.
```

---

### 18. Correlacionar com thread dump

Thread dump pode mostrar:

- workers bloqueadas em I/O;
- futures aguardando;
- locks;
- pool starvation;
- threads ociosas;
- filas internas.

JFR pode mostrar:

- parks;
- monitor enter;
- socket read;
- file I/O;
- execution samples.

A métrica mostra tendência; dump e JFR mostram contexto.

---

### 19. Analisar pool JDBC

Arquivo:

```text
saturation-connection-pool-policy.yaml
```

Conteúdo:

```yaml
connectionPool:
  utilization:
    - active
    - idle
    - maximum

  saturation:
    - pending
    - acquisition-time
    - timeout-count

  impact:
    - request-latency
    - transaction-time
    - error-rate

  activeEqualsMax:
    conclusion:
      requiresPendingOrWait
```

---

### 20. Interpretar pool JDBC

Cenário saudável:

```text
active:
30 de 30 por 2 segundos.

pending:
0.

acquisition:
baixo.

timeouts:
0.
```

Cenário saturado:

```text
active:
30 de 30 por 10 minutos.

pending:
crescendo.

acquisition p95:
2 segundos.

timeouts:
aumentando.
```

O pool pode ser o sintoma.

A causa pode estar no banco, em transações longas ou queries lentas.

---

### 21. Analisar pool de conexões

Script:

```text
analyze-connection-pool-saturation.ps1
```

Calcule utilização, pending, acquisition p95, timeout, transação, query, réplicas e conexões potenciais.

Não aumente o pool sem validar o banco.

---

### 22. Analisar banco de dados

Arquivo:

```text
saturation-database-policy.yaml
```

Conteúdo:

```yaml
database:
  utilization:
    - cpu
    - connections
    - buffer-cache
    - io

  saturation:
    - lock-wait
    - query-queue
    - connection-wait
    - disk-wait
    - replication-lag

  errors:
    - timeout
    - deadlock
    - rejected-connection

  correlate:
    - query-budget
    - slow-query
    - transaction-duration
```

---

### 23. Diferenciar aplicação e banco

Sinais:

```text
JDBC pending:
alto.

DB CPU:
baixo.

lock wait:
alto.
```

Possível causa:

```text
contenção transacional.
```

Outro:

```text
JDBC pending:
alto.

DB CPU:
alto.

disk wait:
alto.
```

Possível causa:

```text
capacidade do banco.
```

O mesmo sintoma pode ter causas diferentes.

---

### 24. Analisar Kafka

Arquivo:

```text
saturation-kafka-policy.yaml
```

Conteúdo:

```yaml
kafka:
  utilization:
    - ingress-rate
    - processing-rate
    - partition-utilization

  saturation:
    - consumer-lag
    - lag-growth
    - fetch-wait
    - producer-buffer-wait
    - request-queue

  errors:
    - produce-error
    - consume-error
    - rebalance-loop

  recovery:
    - drain-rate
    - drain-time
```

---

### 25. Interpretar consumer lag

Lag alto e estável pode representar backlog conhecido.

Lag crescente indica:

```text
ingress
>
processing.
```

Lag decrescente indica recuperação.

Registre unidade, partição, consumer group, janela, ingress, egress, retries e poison messages.

---

### 26. Analisar Kafka

Script:

```text
analyze-kafka-saturation.ps1
```

Calcule ingress, processamento, lag total e por partição, crescimento, drain time, consumers, partições, retries e erros.

Classifique:

```text
stable;

backlog-known;

saturation-candidate;

saturated;

recovering.
```

---

### 27. Analisar filas internas

Arquivo:

```text
saturation-queue-policy.yaml
```

Conteúdo:

```yaml
queue:
  inspect:
    - depth
    - ingress
    - egress
    - growth-rate
    - wait-time
    - age-oldest-item
    - rejection
    - capacity

  fullQueue:
    action:
      classify-impact

  queueNearCapacity:
    requiresTrend:
      true
```

Depth isolada não basta.

Uma fila de 10 mil pode ser saudável ou crítica dependendo do throughput e da idade.

---

### 28. Calcular idade do item mais antigo

A idade do item mais antigo ajuda a diferenciar:

- fila ativa;
- backlog parado;
- item poison;
- consumer travado;
- reprocessamento.

Exemplo:

```text
depth:
5.000.

oldest age:
3 segundos.
```

Pode ser saudável.

Outro:

```text
depth:
200.

oldest age:
45 minutos.
```

Pode ser crítico.

---

### 29. Analisar disco

Arquivo:

```text
saturation-disk-policy.yaml
```

Conteúdo:

```yaml
disk:
  utilization:
    - busy-time
    - throughput

  saturation:
    - io-wait
    - queue-depth
    - latency
    - fsync-duration

  errors:
    - io-error
    - disk-full

  correlate:
    - database
    - logs
    - Kafka
    - heap-dump
```

Disco cheio é erro de capacidade.

Disco com fila e latência crescente é saturação.

---

### 30. Analisar rede

Arquivo:

```text
saturation-network-policy.yaml
```

Conteúdo:

```yaml
network:
  utilization:
    - bytes-in
    - bytes-out
    - bandwidth-ratio

  saturation:
    - retransmissions
    - socket-queue
    - packet-drop
    - connection-wait

  errors:
    - reset
    - timeout
    - unreachable

  correlate:
    - dependency-latency
    - payload-size
    - retry-rate
```

Latência de rede pode surgir antes de largura de banda nominal atingir 100%.

---

### 31. Analisar dependências

Arquivo:

```text
saturation-dependency-policy.yaml
```

Conteúdo:

```yaml
dependency:
  RED:
    - call-rate
    - errors
    - duration

  saturation:
    inferFrom:
      - timeout
      - rate-limit
      - connection-wait
      - queue
      - retry-growth

  remoteLimit:
    unknown:
      result:
        saturation-candidate

  localImpact:
    - thread-occupation
    - connection-occupation
    - queue-growth
```

Nem sempre você terá métricas internas da dependência.

Nesse caso, classifique com confiança proporcional.

---

### 32. Analisar retry amplification

Arquivo:

```text
saturation-retry-policy.yaml
```

Conteúdo:

```yaml
retry:
  measure:
    - original-rate
    - retry-rate
    - attempts-per-operation
    - success-after-retry
    - latency-impact

  saturation:
    amplify:
      true

  protection:
    - backoff
    - jitter
    - maximum-attempts
    - retry-budget
    - circuit-breaker

  retryStorm:
    classify:
      saturated
```

---

### 33. Calcular amplificação

Exemplo:

```text
requisições originais:
1.000/min.

20% falham.

cada falha:
2 retries.
```

Retries:

```text
1.000 × 20% × 2
=
400/min.
```

Carga total:

```text
1.400/min.
```

Amplificação:

```text
40%.
```

A saturação pode se autoamplificar.

---

### 34. Analisar dependências

Script:

```text
analyze-dependency-saturation.ps1
```

Registre call rate, percentis, timeout, rate limit, retries, pools, threads, circuito, fallback e release.

---

### 35. Correlacionar sinais

Arquivo:

```text
saturation-correlation-policy.yaml
```

Conteúdo:

```yaml
correlation:
  require:
    - same-window
    - same-release
    - same-workload

  sources:
    - metrics
    - logs
    - traces
    - GC-logs
    - thread-dumps
    - JFR
    - database
    - Kafka

  causality:
    fromCorrelationOnly:
      forbidden

  conflictingSignals:
    action:
      record-and-investigate
```

---

### 36. Aplicar sequência de leitura

Sequência recomendada:

```text
1.
RED do serviço.

2.
budget violado.

3.
USE dos recursos.

4.
fila ou espera.

5.
dependência.

6.
retry.

7.
impacto.

8.
baseline.

9.
classificação.

10.
próxima ação.
```

Essa sequência evita começar pelo gráfico mais chamativo.

---

### 37. Criar relatório de saturação

Exemplo:

```yaml
saturation:
  resource:
    jdbc-pool-orders-api

  window:
    load-step-160-rps

  utilization:
    active:
      maximum

  saturation:
    pending:
      growing

    acquisitionP95:
      degraded

  errors:
    timeoutRate:
      increasing

  serviceImpact:
    latencyP95:
      above-budget

  classification:
    saturated

  confidence:
    high

  nextAction:
    investigate-database-and-query-duration
```

---

### 38. Classificar recuperação

Saturação não termina quando a entrada cai.

Pode existir backlog.

Estado `recovering` exige:

- ingress abaixo da capacidade;
- backlog decrescente;
- oldest age diminuindo;
- p95 melhorando;
- erros diminuindo;
- recursos recuperando headroom.

---

### 39. Evitar falso positivo

Exemplo:

```text
JDBC active:
máximo.

pending:
zero.

p95:
normal.

queries:
rápidas.
```

Não classifique saturação.

Outro:

```text
Kafka lag:
alto.

growth:
zero.

oldest age:
estável.

janela:
reprocessamento planejado.
```

Pode ser backlog conhecido.

Contexto.

---

### 40. Evitar falso negativo

Exemplo:

```text
CPU:
55%.

latência:
alta.

thread pool queue:
crescendo.

socket read:
longo.
```

CPU baixa não significa capacidade disponível.

O sistema está saturado por dependência ou I/O.

---

### 41. Criar política de qualidade

Arquivo:

```text
saturation-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingLimit:
    result:
      inconclusive

  missingQueueMetric:
    result:
      limited

  mixedWindow:
    action:
      split-analysis

  staleBaseline:
    action:
      recollect

  counterReset:
    action:
      normalize

  missingRelease:
    result:
      limited

  lowCardinalityViolation:
    action:
      block-dashboard

  singlePoint:
    conclusion:
      forbidden
```

---

### 42. Criar política de segurança

Arquivo:

```text
saturation-security-policy.yaml
```

Conteúdo:

```yaml
security:
  dashboards:
    forbidden:
      - customer-id
      - order-id
      - email
      - token
      - private-endpoint

  reports:
    redact:
      - hostname
      - pod-name
      - internal-address

  rawMetrics:
    repository:
      forbidden

  externalSharing:
    forbiddenInLaboratory
```

---

### 43. Criar failure policy

Arquivo:

```text
saturation-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  missingMetric:
    result:
      inconclusive

  dashboardUnavailable:
    action:
      use-approved-export

  conflictingSignals:
    action:
      preserve-evidence

  saturationDetected:
    action:
      invoke-runbook

  retryStorm:
    action:
      protect-and-reduce-load

  queueNearCapacity:
    action:
      evaluate-backpressure

  apiOptimization:
    deferredToLesson579
```

---

### 44. Criar cenários

Arquivo:

```text
saturation-scenarios.yaml
```

Cenários:

```text
healthy-baseline;

high-cpu-without-saturation;

cpu-throttling;

memory-pressure;

gc-pressure;

thread-pool-queue-growth;

jdbc-pending-growth;

database-lock-wait;

Kafka-lag-growth;

Kafka-recovery;

queue-near-capacity;

disk-io-wait;

network-retransmission;

dependency-timeout;

retry-storm;

conflicting-signals.
```

Cada cenário registra workload, janela, recurso, utilização, saturação, erros, impacto RED, classificação, confiança e ação.

---

### 45. Simular CPU alta saudável

Gere CPU controlada.

Confirme:

- utilização alta;
- sem throttling;
- fila estável;
- throughput estável;
- budget preservado.

Resultado:

```text
highly-utilized.
```

---

### 46. Simular throttling

Aplique limite de CPU controlado.

Confirme:

- throttled periods;
- throttled time;
- latência crescente;
- throughput degradado;
- queue growth.

Resultado:

```text
saturated.
```

---

### 47. Simular pool saturado

Use executor limitado.

Confirme:

- active = max;
- fila crescente;
- task wait;
- timeout;
- p95 degradado.

Resultado:

```text
thread-pool-saturated.
```

---

### 48. Simular JDBC pending

Reduza pool e aumente duração transacional no laboratório.

Confirme:

- active = max;
- pending;
- acquisition time;
- timeout;
- latência.

Não aumente o pool como correção automática.

---

### 49. Simular lag Kafka

Configure processamento abaixo do ingresso.

Confirme:

- lag crescente;
- oldest age crescente;
- ingress > egress;
- drain time indefinido enquanto a condição persistir.

Depois reduza a entrada.

Confirme estado:

```text
recovering.
```

---

### 50. Simular retry storm

Configure falha controlada e retries limitados.

Meça:

- original rate;
- retry rate;
- attempts;
- latência;
- pool occupancy;
- dependency rate.

Interrompa antes de comprometer o laboratório.

---

### 51. Criar matriz de testes

Arquivo:

```text
SATURATION_TEST_MATRIX.md
```

Cenários:

- USE;
- RED;
- baseline;
- CPU utilization;
- throttling;
- run queue;
- memory pressure;
- post-GC floor;
- full GC;
- executor active;
- queue growth;
- rejections;
- JDBC pending;
- acquisition timeout;
- DB lock wait;
- Kafka lag;
- lag growth;
- drain time;
- oldest item age;
- disk wait;
- network retransmission;
- dependency timeout;
- rate limit;
- retry amplification;
- recovering;
- conflicting signals;
- data quality;
- security scan;
- evidence sanitizada.

---

### 52. Criar troubleshooting

Arquivo:

```text
SATURATION_TROUBLESHOOTING.md
```

Inclua:

- CPU alta sem impacto;
- CPU baixa com fila;
- throttling ausente;
- run queue indisponível;
- heap alto antes do GC;
- RSS alto com heap baixo;
- executor sem queue metric;
- pool ativo no máximo;
- JDBC pending sem DB CPU;
- lag alto estável;
- lag crescente;
- oldest age divergente;
- disco busy sem latência;
- rede sem bandwidth metric;
- dependência sem métricas internas;
- retry counter reiniciado;
- sinais conflitantes;
- otimização de API antecipada.

---

### 53. Coletar evidence

Script:

```text
collect-saturation-evidence.ps1
```

Arquivo:

```text
saturation-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- baseline status;
- RED status;
- USE status;
- CPU status;
- memory status;
- GC status;
- thread pool status;
- connection pool status;
- database status;
- Kafka status;
- queue status;
- disk status;
- network status;
- dependency status;
- retry status;
- classification;
- confidence;
- security status;
- tests status;
- timestamp.

Não inclua:

- IDs de negócio;
- hostnames reais;
- endpoints privados;
- payloads;
- credentials;
- métricas brutas;
- otimizações da aula 579.

---

### 54. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\saturation\validate-saturation-contract.ps1

.\scripts\observability\saturation\validate-saturation-metrics.ps1

.\scripts\observability\saturation\collect-saturation-baseline.ps1

.\scripts\observability\saturation\analyze-cpu-saturation.ps1

.\scripts\observability\saturation\analyze-memory-pressure.ps1

.\scripts\observability\saturation\analyze-gc-pressure.ps1

.\scripts\observability\saturation\analyze-thread-pool-saturation.ps1

.\scripts\observability\saturation\analyze-connection-pool-saturation.ps1

.\scripts\observability\saturation\analyze-database-saturation.ps1

.\scripts\observability\saturation\analyze-kafka-saturation.ps1

.\scripts\observability\saturation\analyze-queue-saturation.ps1

.\scripts\observability\saturation\analyze-disk-saturation.ps1

.\scripts\observability\saturation\analyze-network-saturation.ps1

.\scripts\observability\saturation\analyze-dependency-saturation.ps1

.\scripts\observability\saturation\analyze-retry-amplification.ps1

.\scripts\observability\saturation\correlate-saturation-signals.ps1

.\scripts\observability\saturation\classify-saturation-state.ps1

.\scripts\observability\saturation\simulate-saturation-scenarios.ps1

.\scripts\observability\saturation\scan-saturation-output.ps1

.\scripts\observability\saturation\collect-saturation-evidence.ps1

.\scripts\observability\saturation\verify-saturation-baseline.ps1
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
- USE aplicado;
- RED aplicado;
- CPU analisada;
- memória analisada;
- GC analisado;
- executor analisado;
- JDBC analisado;
- banco analisado;
- Kafka analisado;
- filas analisadas;
- disco analisado;
- rede analisada;
- dependências analisadas;
- retries analisados;
- sinais correlacionados;
- estados classificados;
- segurança aprovada;
- evidence sanitizada;
- performance de API não antecipada.

---

### 55. Encerrar o laboratório

Pare os cenários.

Remova apenas artifacts temporários:

```powershell
Remove-Item `
  .tmp/saturation `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve policies;
- preserve dashboards;
- preserve reports;
- preserve scripts;
- preserve docs;
- confirme que métricas brutas não estão no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### Utilização e saturação foram separadas

Uso alto deixou de ser tratado como falta de capacidade.

### USE e RED passaram a trabalhar juntos

O impacto no serviço foi relacionado ao recurso limitante.

### CPU ganhou throttling

Percentual de CPU deixou de ser a única leitura.

### Memória ganhou headroom

Heap, RSS, pós-GC e limites passaram a ser correlacionados.

### Pools ganharam espera

Active igual ao máximo deixou de ser suficiente sem pending, queue ou timeout.

### Kafka ganhou tendência

Lag passou a ser lido por crescimento, idade e drenagem.

### Filas ganharam idade

Depth deixou de ser interpretada isoladamente.

### Dependências ganharam impacto local

Timeout remoto passou a ser ligado a threads, conexões e retries.

### Retries ganharam amplificação

Novas tentativas passaram a ser tratadas como carga adicional.

### Estados ganharam classificação

Healthy, highly utilized, candidate, saturated e recovering passaram a ter critérios.

### A próxima aula ganhou base

A otimização de APIs poderá partir do recurso realmente saturado, não de suposições.

---

## Erros comuns importantes

### Tratar CPU alta como saturação

Sem fila, throttling ou impacto, pode ser apenas alta utilização.

### Esperar CPU chegar a 100%

Pools e dependências podem saturar antes.

### Tratar active igual ao máximo como problema

Verifique pending, queue, wait e timeout.

### Olhar apenas depth da fila

Use crescimento, idade e capacidade de drenagem.

### Aumentar pool automaticamente

Downstream pode falhar.

### Tratar lag alto como crescimento

Lag alto pode estar estável ou recuperando.

### Ignorar retries

Eles podem amplificar a carga.

### Usar um único gráfico

Saturação exige sinais convergentes.

### Confundir correlação e causa

Registre hipótese e próxima validação.

### Antecipar performance de API

Otimizações específicas pertencem à aula 579.

---

## Comandos úteis

### Coletar baseline

```powershell
.\scripts\observability\saturation\collect-saturation-baseline.ps1
```

### Analisar CPU

```powershell
.\scripts\observability\saturation\analyze-cpu-saturation.ps1
```

### Analisar pools

```powershell
.\scripts\observability\saturation\analyze-thread-pool-saturation.ps1

.\scripts\observability\saturation\analyze-connection-pool-saturation.ps1
```

### Analisar Kafka

```powershell
.\scripts\observability\saturation\analyze-kafka-saturation.ps1
```

### Classificar estado

```powershell
.\scripts\observability\saturation\classify-saturation-state.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Crie catálogo, limites e owners.

### Parte 2 — RED

Leia rate, errors e duration.

### Parte 3 — USE

Leia utilization, saturation e errors.

### Parte 4 — CPU e memória

Analise throttling, pós-GC e headroom.

### Parte 5 — Pools

Analise active, pending, queue e timeout.

### Parte 6 — Kafka e filas

Analise ingress, egress, lag, growth e age.

### Parte 7 — Dependências

Analise latência, timeout, rate limit e retries.

### Parte 8 — Correlation

Use mesma janela, release e workload.

### Parte 9 — Classification

Classifique healthy, candidate, saturated ou recovering.

### Parte 10 — Gate

Execute cenários, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 577 e ponte para a aula 579 foram preservadas;
- utilization, saturation, error, USE, RED, queue depth, queue growth, wait time, throttling, headroom, backpressure, load shedding, pool exhaustion, connection wait, consumer lag, run queue, memory pressure, retry amplification, nonlinear latency e saturation window foram definidos;
- baseline foi validada;
- contrato foi criado;
- catálogo de recursos foi criado;
- cada recurso possui owner, limite e métricas;
- USE Method foi aplicado;
- RED Method foi aplicado;
- utilização isolada não gera conclusão;
- política de CPU foi criada;
- CPU alta e throttling foram diferenciados;
- run queue e runnable threads foram considerados;
- heap e RSS foram diferenciados;
- post-GC floor e headroom foram analisados;
- GC frequente sem impacto não foi tratado como saturação;
- active, maximum, queue, wait e rejection foram correlacionados;
- thread dump e JFR foram usados como contexto;
- active igual ao máximo exige pending ou wait;
- aquisição e timeout foram analisados;
- banco foi analisado por CPU, lock, I/O e conexões;
- aplicação e banco foram diferenciados;
- lag, growth, partitions, ingress e egress foram analisados;
- recuperação e drain time foram considerados;
- depth e oldest age foram diferenciados;
- busy, queue e latency foram correlacionados;
- retransmission, drop e socket queue foram considerados;
- ausência de métricas remotas reduz confiança;
- retry amplification foi calculado;
- mesma janela, release e workload foram exigidos;
- sequência de leitura foi definida;
- recuperação foi classificada;
- falsos positivos foram evitados;
- falsos negativos foram considerados;
- CPU alta saudável foi simulada;
- throttling foi simulado;
- pool saturado foi simulado;
- JDBC pending foi simulado;
- lag Kafka foi simulado;
- retry storm foi simulado;
- nenhum Secret, dado pessoal, hostname real, endpoint privado ou métrica bruta foi commitado;
- performance de API não foi antecipada;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/saturation `
  scripts/observability/saturation `
  docs/observability/saturation `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|hostname|private_endpoint|rawMetric|apiOptimization"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar leitura de saturacao"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- métricas brutas;
- IDs de negócio;
- hostnames;
- endpoints privados;
- credentials;
- artifacts temporários;
- otimizações específicas de API;
- material da aula 579.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a diferenciar uso alto de falta real de capacidade.

Você trabalhou com:

```text
USE Method;

RED Method;

CPU;

throttling;

memória;

GC;

thread pools;

JDBC pools;

banco;

Kafka;

filas;

disco;

rede;

dependências;

retries;

classificação.
```

Você comprovou que utilização alta não significa saturação; CPU precisa ser lida com throttling, run queue, throughput e latência; memória precisa considerar pós-GC, RSS e headroom; pools exigem leitura de pending, queue, wait e timeout; Kafka exige ingress, egress, lag, crescimento e idade; filas precisam de depth, oldest age e capacidade de drenagem; dependências lentas ocupam threads e conexões; retries amplificam carga; e a classificação precisa combinar RED, USE, baseline, janela, impacto e confiança.

A próxima aula será:

```text
579 - M18.24 - Performance de API
```

Nela, você irá aplicar os sinais de saturação e budgets para otimizar endpoints, payloads, paginação, serialização, banco, chamadas externas, caches e clientes HTTP.

Nenhuma otimização específica de endpoint, payload, paginação, serialização, cache HTTP, cliente HTTP ou query de API foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei utilização e saturação.
- [ ] Apliquei USE e RED.
- [ ] Analisei CPU, memória e GC.
- [ ] Analisei pools e banco.
- [ ] Analisei Kafka e filas.
- [ ] Analisei disco, rede e dependências.
- [ ] Calculei retry amplification.
- [ ] Classifiquei estado e confiança.

---

## Troubleshooting adicional

### CPU está alta, mas não há impacto

Classifique como highly utilized enquanto queues, throttling e budgets estiverem saudáveis.

### CPU está baixa, mas a fila cresce

Investigue I/O, locks, pools e dependências.

### Heap fica alto antes do GC

Analise pós-GC, live set e headroom.

### JDBC active está no máximo

Verifique pending, acquisition e timeout.

### Kafka lag está alto

Meça growth rate, oldest age e drain rate.

### A fila está perto do limite

Observe tendência, ingress, egress, rejeições e backpressure.

### Retry rate cresce

Calcule amplificação e valide backoff, jitter e limite.

### Os sinais se contradizem

Confirme janela, release, resets e fontes.

### O dashboard não possui queue metric

Declare limitação e adicione instrumentação antes de concluir.

### A análise começou a otimizar endpoints

Preserve esse trabalho para a aula 579.

---

## Perguntas de revisão

1. Qual diferença entre utilization e saturation?
2. O que é USE Method?
3. O que é RED Method?
4. O que é queue growth?
5. O que é throttling?
6. O que é backpressure?
7. O que é pool exhaustion?
8. O que é connection wait?
9. O que é consumer lag?
10. O que é run queue?
11. Como reconhecer memory pressure?
12. Quando GC frequente indica problema?
13. Por que active igual ao máximo não basta?
14. Como interpretar oldest item age?
15. O que é retry amplification?
16. O que significa recovering?
17. Como evitar falso positivo?
18. Como evitar falso negativo?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uso versus trabalho esperando.
2. Utilization, saturation e errors.
3. Rate, errors e duration.
4. Entrada menos saída.
5. Limitação ativa.
6. Redução da entrada.
7. Todas as unidades ocupadas.
8. Espera por conexão.
9. Diferença entre produzido e consumido.
10. Trabalho esperando CPU.
11. Pós-GC, RSS e headroom.
12. Quando recuperação e budgets degradam.
13. Pode não haver espera.
14. Tempo real no backlog.
15. Carga adicional por retries.
16. Backlog e impacto diminuindo.
17. Exigir fila, espera ou impacto.
18. Investigar recursos além da CPU.
19. Performance de API.
20. Performance de API.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 578 - M18.23 - Leitura de saturacao

- Continuei após Orçamento de performance.
- Diferenciei utilização e saturação.
- Entendi saturação como trabalho aguardando, rejeitado ou acumulado.
- Apliquei USE Method em recursos.
- Apliquei RED Method no serviço.
- Criei contrato e catálogo de recursos.
- Criei baseline saudável.
- Defini estados healthy, highly utilized, candidate, saturated, recovering e inconclusive.
- Analisei CPU, run queue e throttling.
- Diferenciei CPU alta saudável de CPU saturada.
- Analisei heap, RSS, pós-GC e headroom.
- Analisei pressão de GC.
- Analisei active, max, queue, wait e rejection em executores.
- Correlacionei métricas com thread dumps e JFR.
- Analisei pool JDBC, pending, acquisition e timeout.
- Diferenciei saturação da aplicação e do banco.
- Analisei CPU, locks, I/O e conexões do banco.
- Analisei Kafka ingress, processing rate, lag e partições.
- Calculei growth rate e drain time.
- Analisei depth e oldest item age em filas.
- Analisei disco, rede e dependências.
- Calculei retry amplification.
- Criei política de correlação.
- Usei mesma janela, release e workload.
- Criei relatório e classificação de saturação.
- Evitei falsos positivos e falsos negativos.
- Criei políticas de qualidade, segurança e failure.
- Simulei CPU alta, throttling, pool saturado, JDBC pending, Kafka lag e retry storm.
- Coletei evidence sanitizada.
- Não antecipei performance de API.
- Próxima aula: Performance de API.
```

---

## Referência técnica curta

- USE Method.
- RED Method.
- Resource Saturation.
- CPU Throttling.
- Memory Pressure.
- Thread Pool Saturation.
- Connection Pool Saturation.
- Kafka Consumer Lag.
- Backpressure.
- Retry Amplification.

Regra final:

```text
leitura de saturação precisa separar utilização de trabalho esperando: RED mostra rate, errors e duration do serviço, enquanto USE verifica utilization, saturation e errors de cada recurso; CPU exige throttling, run queue e impacto, memória exige pós-GC, RSS e headroom, pools exigem pending, queue, wait, timeout e rejection, Kafka exige ingress, egress, lag, crescimento e idade, e filas exigem profundidade, oldest age e capacidade de drenagem; dependências, disco, rede e retries precisam ser correlacionados na mesma janela, release e workload, sem transformar correlação em causalidade; estados healthy, highly utilized, candidate, saturated e recovering dependem de sinais persistentes e impacto nos budgets, mantendo métricas brutas e identificadores fora do Git e deixando para a aula 579 as otimizações específicas de endpoints, payloads, paginação, serialização, caches, clientes HTTP e queries de API.
```
