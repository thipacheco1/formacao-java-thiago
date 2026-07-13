# 586 - M18.31 - Teste de stress carga pico

## Apresentação da aula

Na aula 585, você estruturou load testing como experimento controlado.

Você trabalhou com:

```text
K6;

Gatling;

virtual users;

arrival rate;

closed workload;

open workload;

ramp-up;

warmup;

steady state;

checks;

thresholds;

stop conditions;

correlação;

rollback.
```

O teste permaneceu dentro de uma faixa planejada.

A pergunta era:

```text
o sistema atende
a carga esperada

dentro dos budgets
e com headroom?
```

Agora a pergunta muda:

```text
o que acontece
quando a demanda
ultrapassa a faixa esperada?
```

Nesta aula, você irá executar cenários controlados para descobrir:

- o primeiro recurso que satura;
- o ponto em que a latência deixa de crescer de forma aceitável;
- o início de filas persistentes;
- o momento em que erros aumentam;
- o comportamento durante um pico abrupto;
- a capacidade de recuperar depois da carga;
- o risco de backlog residual;
- a eficácia de timeouts, bulkheads e load shedding;
- a distância entre carga nominal e breaking point.

**Teste de stress** aplica carga crescente até que o sistema ultrapasse um limite operacional ou funcional definido.

**Teste de pico** aplica uma elevação rápida de demanda para observar resposta, proteção e recuperação.

O objetivo não é “derrubar o sistema por diversão”.

O objetivo é responder, com segurança:

```text
onde está
o limite;

como o sistema
degrada;

como ele protege
recursos críticos;

e quanto tempo
leva para recuperar?
```

Um sistema pode passar em carga estável e falhar por CPU, throttling, heap, GC, pools, banco, Redis, Kafka, retries, dependências, filas, timeouts, ausência de proteção ou recuperação incompleta.

A aula utilizará o mesmo workload de pedidos da aula 585, porém com três fases controladas:

```text
baseline;

stress progressivo;

pico abrupto.
```

A carga de stress será aumentada em degraus.

Exemplo didático:

```text
80 req/s;

100 req/s;

120 req/s;

140 req/s;

160 req/s.
```

Cada degrau observará taxa, percentis, erros, filas, CPU, memória, GC, conexões, banco, Redis, Kafka e recovery.

O teste será interrompido quando uma stop condition for atingida.

Você não continuará aumentando a carga depois que o risco superar o valor pedagógico do experimento.

O pico será modelado como:

```text
carga nominal;

subida abrupta;

janela curta no pico;

retorno controlado;

janela de recuperação.
```

Exemplo:

```text
80 req/s
→
200 req/s
→
80 req/s.
```

O valor é didático.

A proporção real precisa respeitar o ambiente autorizado.

A aula também irá diferenciar:

```text
breaking point;

saturation point;

failure point;

recovery point.
```

O **saturation point** é a região em que um recurso começa a limitar throughput ou produzir espera persistente.

O **breaking point** é o ponto em que budgets, SLOs ou critérios funcionais deixam de ser atendidos de forma sustentada.

O **failure point** é a região em que o sistema apresenta falhas relevantes, indisponibilidade, corrupção, backlog sem recuperação ou risco operacional.

O **recovery point** é o momento em que, após reduzir a carga, o sistema retorna à baseline definida.

Esses pontos podem ser diferentes.

Exemplo:

```text
CPU satura:
120 req/s.

p95 estoura:
130 req/s.

timeouts começam:
145 req/s.

recovery completa:
4 minutos após retorno
para 80 req/s.
```

A aula irá trabalhar com **degradação controlada**.

Isso significa que, sob excesso de carga, o sistema deve preferir:

- rejeitar cedo;
- limitar concorrência;
- preservar operações críticas;
- responder com erro explícito;
- respeitar `Retry-After` quando aplicável;
- proteger banco e filas;
- recuperar sem restart manual.

Evite filas ilimitadas, transações acumuladas, conexões excessivas, retry storm, consumo de memória, restart loop, duplicidade e backlog oculto.

A aula não irá aprofundar a implementação interna da concorrência Java.

Não serão estudados ainda:

- criação manual de `Thread`;
- `Runnable`;
- `Callable`;
- `Future`;
- `ExecutorService`;
- `synchronized`;
- `ReentrantLock`;
- `Semaphore`;
- `CountDownLatch`;
- `CompletableFuture`;
- race condition em memória Java;
- visibility;
- atomicidade;
- deadlock Java;
- starvation de threads em código;
- programação concorrente clássica.

Esses assuntos pertencem à próxima aula oficial:

```text
587 - M18.32 - Concorrencia Java classica
```

Nesta aula, pools e threads serão observados como recursos de produção, sem aprofundar sua implementação.

A regra central será:

```text
stress testing
não procura apenas
o ponto de quebra;

ele verifica
degradação,
proteção
e recuperação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
584:
Cache invalidation.

585:
Load testing K6 ou Gatling conceitual.

586:
Teste de stress carga pico.

587:
Concorrencia Java classica.
```

A progressão é:

```text
coerência de cache;

carga esperada;

carga acima do esperado;

concorrência Java.
```

Nesta aula:

```text
stress progressivo:
sim.

carga pico:
sim.

breaking point:
sim.

saturation point:
sim.

failure point:
sim.

recovery:
sim.

backlog:
sim.

load shedding:
sim.

backpressure:
sim.

retry amplification:
sim.

stop conditions:
sim.

recovery window:
sim.

concorrência Java:
não.

locks Java:
não.

ExecutorService:
não.
```

Você reutilizará K6, Gatling conceitual, budgets, SLOs, RED, USE, dashboards, traces, logs, HikariCP, PostgreSQL, Redis, Kafka e runbooks.

O teste precisa preservar autorização, dados sintéticos, limites, owner, parada, reversibilidade, observabilidade, recuperação e evidence sanitizada.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/stress-testing
├── stress-test-contract.yaml
├── stress-workload-catalog.yaml
├── stress-test-environment-policy.yaml
├── stress-test-step-policy.yaml
├── stress-test-spike-policy.yaml
├── stress-test-breaking-point-policy.yaml
├── stress-test-stop-policy.yaml
├── stress-test-load-shedding-policy.yaml
├── stress-test-backpressure-policy.yaml
├── stress-test-retry-policy.yaml
├── stress-test-backlog-policy.yaml
├── stress-test-recovery-policy.yaml
├── stress-test-observability-policy.yaml
├── stress-test-regression-policy.yaml
├── stress-test-data-quality-policy.yaml
├── stress-test-security-policy.yaml
├── stress-test-failure-policy.yaml
├── stress-test-scenarios.yaml
└── stress-test-evidence.yaml

performance/stress-testing/k6
├── stress-config.js
├── stress-thresholds.js
├── progressive-stress.js
├── spike-test.js
├── recovery-observer.js
└── stress-summary.js

performance/stress-testing/reports
├── stress-baseline-report.yaml
├── progressive-stress-report.yaml
├── spike-report.yaml
├── breaking-point-report.yaml
├── backlog-report.yaml
├── recovery-report.yaml
└── stress-gate-report.yaml

scripts/performance/stress-testing
├── validate-stress-test-contract.ps1
├── validate-stress-test-environment.ps1
├── prepare-stress-test-data.ps1
├── collect-stress-baseline.ps1
├── run-progressive-stress-test.ps1
├── run-spike-test.ps1
├── validate-stress-step.ps1
├── detect-breaking-point.ps1
├── validate-load-shedding.ps1
├── validate-backpressure.ps1
├── analyze-retry-amplification.ps1
├── analyze-stress-backlog.ps1
├── validate-stress-recovery.ps1
├── correlate-stress-metrics.ps1
├── compare-stress-runs.ps1
├── enforce-stress-stop-conditions.ps1
├── validate-stress-rollback.ps1
├── scan-stress-output.ps1
├── collect-stress-evidence.ps1
└── verify-stress-baseline.ps1

docs/performance/stress-testing
├── STRESS_TESTING_OVERVIEW.md
├── PROGRESSIVE_STRESS_GUIDE.md
├── SPIKE_TEST_GUIDE.md
├── BREAKING_POINT_GUIDE.md
├── LOAD_SHEDDING_AND_BACKPRESSURE.md
├── RETRY_AMPLIFICATION_GUIDE.md
├── BACKLOG_AND_RECOVERY.md
├── STRESS_TEST_OBSERVABILITY.md
├── STRESS_TEST_MATRIX.md
└── STRESS_TEST_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de stress;

degraus de carga;

cenário de pico;

breaking point;

stop conditions;

load shedding;

backpressure;

análise de retries;

backlog;

recovery;

gate;

evidence sanitizada.
```

Você irá validar a baseline, executar stress progressivo, executar pico, identificar limites, observar recuperação e validar rollback.

---

## Conceito essencial

### Stress testing

Teste que aumenta a demanda além da carga esperada para identificar limites e comportamento de degradação.

---

### Spike testing

Teste que aplica uma elevação rápida e temporária de carga.

---

### Saturation point

Região em que um recurso começa a limitar o sistema de forma persistente.

---

### Breaking point

Ponto em que budgets ou critérios de aceite deixam de ser atendidos de maneira sustentada.

---

### Failure point

Ponto em que falhas relevantes ou riscos operacionais aparecem.

---

### Recovery point

Momento em que o sistema retorna à baseline depois da redução da carga.

---

### Graceful degradation

Redução controlada de qualidade ou capacidade, preservando funções essenciais.

---

### Load shedding

Rejeição deliberada de parte da carga para proteger o sistema.

---

### Backpressure

Sinalização ou limitação aplicada quando a capacidade downstream é insuficiente.

---

### Retry amplification

Aumento da carga total causado por novas tentativas.

---

### Backlog

Trabalho acumulado ainda não processado.

---

### Drain time

Tempo estimado para consumir o backlog após reduzir a entrada.

```text
drain time
≈
backlog
/
(processing rate - ingress rate).
```

---

### Hysteresis

Margem usada para evitar alternância rápida entre estados de proteção.

---

### Recovery window

Período observado depois da carga para confirmar retorno estável.

---

### Overload

Demanda superior à capacidade sustentável.

---

### Fail-fast

Falha rápida antes de consumir recursos escassos por muito tempo.

---

### Brownout

Desativação temporária de funções não essenciais para preservar o núcleo.

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

- ambiente autorizado;
- owner presente;
- janela comunicada;
- dados sintéticos;
- smoke aprovado;
- steady load aprovado;
- dashboards ativos;
- stop conditions conhecidas;
- rollback preparado;
- nenhuma implementação de concorrência Java será antecipada.

---

### 2. Criar contrato de stress

Arquivo:

```text
stress-test-contract.yaml
```

Conteúdo:

```yaml
stressTest:
  required:
    - objective
    - baseline
    - workload
    - stress-steps
    - spike
    - observability
    - stop-conditions
    - recovery-window
    - rollback

  safety:
    authorizedEnvironment:
      required

    owner:
      required

    maximumPlannedLoad:
      required

  result:
    allowed:
      - pass
      - fail
      - stopped-for-safety
      - inconclusive

  JavaConcurrency:
    deferredToLesson587
```

---

### 3. Definir a hipótese

Exemplo:

```yaml
hypothesis:
  service:
    orders-api

  baseline:
    80-requests-per-second

  progressiveStress:
    maximumPlanned:
      160-requests-per-second

  spike:
    from:
      80

    to:
      200

    duration:
      60s

  expected:
    - no-data-corruption
    - early-rejection-under-overload
    - bounded-backlog
    - recovery-without-restart
```

---

### 4. Criar catálogo do workload

Arquivo:

```text
stress-workload-catalog.yaml
```

Use o mesmo mix aprovado na aula 585:

```yaml
operations:
  ORDER-STATUS:
    share:
      0.45

  ORDER-BY-ID:
    share:
      0.25

  ORDER-LIST:
    share:
      0.20

  ORDER-CREATE:
    share:
      0.10
```

A comparação só é válida se o workload permanecer equivalente.

---

### 5. Criar política de ambiente

Arquivo:

```text
stress-test-environment-policy.yaml
```

Conteúdo:

```yaml
environment:
  required:
    - authorization
    - owner
    - topology
    - resource-limits
    - dependencies
    - dashboards
    - alerts
    - rollback

  shared:
    announce:
      required

  production:
    stressWithoutExecutiveApproval:
      forbidden

  externalDependency:
    protect:
      required

  blastRadius:
    bounded:
      required
```

---

### 6. Definir blast radius

O teste precisa limitar:

- ambiente;
- tenant;
- dados;
- dependências;
- horário;
- taxa;
- duração;
- máximo de VUs;
- quantidade de writes;
- filas;
- conexões;
- recursos externos.

Nunca use um target aberto ou variável sem allowlist.

---

### 7. Criar política de degraus

Arquivo:

```text
stress-test-step-policy.yaml
```

Conteúdo:

```yaml
steps:
  startFrom:
    approved-baseline

  increase:
    controlled:
      required

  duration:
    sufficientForObservation:
      required

  nextStep:
    require:
      - previous-step-stable
      - no-stop-condition
      - generator-healthy

  maximum:
    preapproved:
      required

  skipStep:
    forbidden
```

---

### 8. Definir degraus

Exemplo didático:

```yaml
steps:
  - rate:
      80

    duration:
      3m

  - rate:
      100

    duration:
      3m

  - rate:
      120

    duration:
      3m

  - rate:
      140

    duration:
      3m

  - rate:
      160

    duration:
      3m
```

Cada degrau precisa ter:

- início;
- fim;
- taxa planejada;
- taxa observada;
- métricas;
- estado;
- decisão.

---

### 9. Criar script de stress progressivo

Arquivo:

```text
progressive-stress.js
```

Exemplo:

```javascript
export const options = {
  scenarios: {
    progressive_stress: {
      executor: 'ramping-arrival-rate',
      startRate: 80,
      timeUnit: '1s',
      preAllocatedVUs: 80,
      maxVUs: 300,
      stages: [
        { target: 80, duration: '3m' },
        { target: 100, duration: '3m' },
        { target: 120, duration: '3m' },
        { target: 140, duration: '3m' },
        { target: 160, duration: '3m' },
        { target: 80, duration: '2m' },
      ],
    },
  },
};
```

O `maxVUs` é limitado.

Dropped iterations precisam ser interpretadas.

---

### 10. Criar thresholds de segurança

Arquivo:

```text
stress-thresholds.js
```

Exemplo:

```javascript
export const stressThresholds = {
  http_req_failed: [
    {
      threshold: 'rate<0.05',
      abortOnFail: true,
      delayAbortEval: '30s',
    },
  ],

  checks: [
    {
      threshold: 'rate>0.95',
      abortOnFail: true,
      delayAbortEval: '30s',
    },
  ],

  dropped_iterations: [
    {
      threshold: 'count<100',
      abortOnFail: true,
      delayAbortEval: '30s',
    },
  ],
};
```

Esses valores são didáticos.

A parada também depende de métricas externas que o K6 pode não conhecer diretamente.

---

### 11. Criar política de stop

Arquivo:

```text
stress-test-stop-policy.yaml
```

Conteúdo:

```yaml
stop:
  conditions:
    - data-corruption
    - critical-error-rate
    - database-risk
    - HikariCP-timeout-growth
    - uncontrolled-backlog
    - generator-saturation
    - environment-instability
    - external-dependency-impact

  owner:
    required

  automatic:
    whenMetricAvailable:
      true

  manual:
    runbook:
      required

  evidence:
    stopReason:
      required
```

---

### 12. Definir stop conditions

Exemplo:

```text
error rate:
> 5% por 60 segundos;

HikariCP timeouts:
crescimento contínuo;

DB CPU:
acima do limite seguro;

Kafka lag:
sem tendência de estabilização;

heap:
crescimento sem recuperação;

dados:
qualquer inconsistência;

gerador:
taxa não atingida por saturação;

dependência externa:
impacto não autorizado.
```

A condição mais conservadora prevalece.

---

### 13. Validar cada degrau

Script:

```text
validate-stress-step.ps1
```

Para cada step, registre:

- taxa planejada;
- taxa iniciada;
- taxa concluída;
- p50;
- p95;
- p99;
- erros;
- checks;
- dropped iterations;
- CPU;
- throttling;
- heap;
- GC;
- threads;
- HikariCP;
- Redis;
- PostgreSQL;
- Kafka;
- backlog;
- stop status.

---

### 14. Detectar saturation point

Sinais:

- throughput para de crescer;
- latência acelera;
- fila cresce;
- pending cresce;
- throttling aparece;
- GC aumenta;
- lock wait cresce;
- lag cresce;
- errors surgem;
- utilização fica próxima do limite.

Um único pico não é suficiente.

Procure comportamento sustentado durante o degrau.

---

### 15. Criar política de breaking point

Arquivo:

```text
stress-test-breaking-point-policy.yaml
```

Conteúdo:

```yaml
breakingPoint:
  definedBy:
    firstSustainedViolationOf:
      - latency-budget
      - error-budget
      - backlog-budget
      - recovery-budget
      - resource-safety-budget

  singleTransientViolation:
    insufficient

  dataCorruption:
    immediateFailure:
      true

  generatorLimited:
    result:
      inconclusive

  report:
    includeLastHealthyStep:
      true
```

---

### 16. Detectar breaking point

Script:

```text
detect-breaking-point.ps1
```

Saída:

```yaml
lastHealthyStep:
  rate:
    120

firstBrokenStep:
  rate:
    140

reason:
  - p95-budget
  - HikariCP-pending
  - database-cpu

confidence:
  medium

repetitionRequired:
  true
```

O resultado deve ser repetido para ganhar confiança.

---

### 17. Diferenciar saturation e failure

Exemplo:

```text
120 req/s:
CPU 90%;
budgets ainda passam.

140 req/s:
p95 falha;
pending cresce.

160 req/s:
timeouts;
erros;
recovery lenta.
```

Classificação:

```text
120:
saturation candidate.

140:
breaking point.

160:
failure region.
```

---

### 18. Criar política de pico

Arquivo:

```text
stress-test-spike-policy.yaml
```

Conteúdo:

```yaml
spike:
  baseline:
    required

  increase:
    abrupt:
      true

  peak:
    boundedDuration:
      required

  maximum:
    preapproved:
      required

  return:
    controlled:
      required

  recoveryWindow:
    required

  repeatedSpike:
    optional
```

---

### 19. Criar script de pico

Arquivo:

```text
spike-test.js
```

Exemplo:

```javascript
export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: 80,
      timeUnit: '1s',
      preAllocatedVUs: 120,
      maxVUs: 350,
      stages: [
        { target: 80, duration: '2m' },
        { target: 200, duration: '10s' },
        { target: 200, duration: '50s' },
        { target: 80, duration: '10s' },
        { target: 80, duration: '5m' },
      ],
    },
  },
};
```

A janela de recuperação faz parte do teste.

---

### 20. Criar política de load shedding

Arquivo:

```text
stress-test-load-shedding-policy.yaml
```

Conteúdo:

```yaml
loadShedding:
  purpose:
    protect-critical-resources

  trigger:
    explicit:
      required

  reject:
    early:
      preferred

  response:
    defined:
      required

  RetryAfter:
    whenApplicable:
      required

  criticalOperations:
    priority:
      higher

  hiddenQueue:
    forbidden
```

---

### 21. Validar load shedding

Script:

```text
validate-load-shedding.ps1
```

Teste:

- limite de concorrência;
- fila cheia;
- bulkhead esgotado;
- dependência lenta;
- banco protegido;
- operação crítica;
- operação não crítica;
- resposta de rejeição;
- `Retry-After`;
- recuperação.

A rejeição controlada pode ser mais saudável que timeout tardio.

---

### 22. Criar política de backpressure

Arquivo:

```text
stress-test-backpressure-policy.yaml
```

Conteúdo:

```yaml
backpressure:
  applyWhen:
    downstreamCapacityInsufficient

  mechanisms:
    allowed:
      - bounded-queue
      - consumer-pause
      - rate-limit
      - concurrency-limit
      - rejection

  unboundedBuffer:
    forbidden

  feedback:
    observable:
      required

  recovery:
    resumeGradually:
      required
```

---

### 23. Validar backpressure

Script:

```text
validate-backpressure.ps1
```

Cenário Kafka:

```text
ingress:
1000 msg/s.

processing:
700 msg/s.
```

Sem proteção:

```text
lag cresce
sem limite.
```

Com backpressure:

- entrada limitada quando possível;
- consumers controlados;
- filas bounded;
- producer recebe sinal;
- drain time é medido.

---

### 24. Criar política de retries

Arquivo:

```text
stress-test-retry-policy.yaml
```

Conteúdo:

```yaml
retries:
  stressWindow:
    monitor:
      required

  amplification:
    formula:
      attempts-divided-by-original-requests

  maximumAttempts:
    bounded:
      required

  backoff:
    required

  jitter:
    required

  RetryAfter:
    respect:
      required

  overload:
    retriesMayBeDisabled:
      true
```

---

### 25. Medir retry amplification

Script:

```text
analyze-retry-amplification.ps1
```

Exemplo:

```text
requests originais:
10.000.

tentativas totais:
14.000.

amplificação:
1,4x.
```

Sob overload, retries podem impedir a recuperação.

---

### 26. Criar política de backlog

Arquivo:

```text
stress-test-backlog-policy.yaml
```

Conteúdo:

```yaml
backlog:
  sources:
    - Kafka-lag
    - executor-queue
    - HikariCP-pending
    - outbox-pending
    - request-queue

  measure:
    - size
    - growth-rate
    - oldest-age
    - drain-rate
    - estimated-drain-time

  unbounded:
    forbidden

  hiddenAfterTest:
    forbidden
```

---

### 27. Calcular drain time

Exemplo:

```text
backlog:
60.000 mensagens.

processing:
1.200/s.

ingress após teste:
800/s.

capacidade líquida:
400/s.

drain time:
60.000 / 400
=
150 segundos.
```

Se ingress for maior ou igual ao processamento, o backlog não será drenado.

---

### 28. Analisar backlog

Script:

```text
analyze-stress-backlog.ps1
```

Registre:

- backlog inicial;
- pico;
- final;
- crescimento;
- idade;
- ingress;
- processing;
- drain time;
- recuperação;
- risco.

Não encerre o laboratório antes de verificar o backlog residual.

---

### 29. Criar política de recovery

Arquivo:

```text
stress-test-recovery-policy.yaml
```

Conteúdo:

```yaml
recovery:
  startsWhen:
    loadReturnsToBaseline

  observeUntil:
    allCriticalMetricsStable

  required:
    - latency
    - errors
    - queues
    - HikariCP
    - database
    - Redis
    - Kafka
    - heap
    - GC

  manualRestart:
    countsAs:
      recovery-failure

  maximumTime:
    budgeted:
      required
```

---

### 30. Validar recovery

Script:

```text
validate-stress-recovery.ps1
```

Critérios:

- request rate volta ao baseline;
- p95 volta ao budget;
- error rate volta ao normal;
- HikariCP pending zera ou estabiliza;
- DB CPU reduz;
- locks desaparecem;
- Redis latency normaliza;
- Kafka lag drena;
- heap estabiliza;
- GC volta ao padrão;
- não há restart manual.

---

### 31. Criar observador de recuperação

Arquivo:

```text
recovery-observer.js
```

O gerador pode manter carga nominal durante a janela de recuperação.

A recuperação não deve ser observada com tráfego zero se o objetivo é retornar ao serviço normal.

Exemplo:

```text
pico termina;

carga volta a 80 req/s;

métricas são observadas
por 5 minutos.
```

---

### 32. Criar política de observabilidade

Arquivo:

```text
stress-test-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  phases:
    required:
      - baseline
      - ramp
      - stress-step
      - peak
      - recovery

  generator:
    required:
      - rate
      - VUs
      - dropped-iterations
      - CPU
      - memory

  system:
    required:
      - RED
      - USE
      - pools
      - queues
      - dependencies

  sameClock:
    required

  phaseTag:
    required
```

---

### 33. Correlacionar métricas

Script:

```text
correlate-stress-metrics.ps1
```

Para cada fase, registre:

- rate;
- p95;
- p99;
- errors;
- CPU;
- throttling;
- heap;
- GC;
- thread count;
- executor queue;
- HikariCP pending;
- DB CPU;
- DB connections;
- lock wait;
- Redis latency;
- cache hit;
- Kafka lag;
- retry amplification;
- backlog;
- drain time.

---

### 34. Identificar o primeiro limitante

Exemplo:

```text
CPU:
70%.

HikariCP pending:
alto.

DB CPU:
95%.

query p95:
alto.
```

Primeiro limitante provável:

```text
banco.
```

Outro exemplo:

```text
DB saudável;

Redis saudável;

CPU do pod:
100%;

throttling:
alto;

throughput:
estagnado.
```

Primeiro limitante provável:

```text
CPU da aplicação.
```

Declare a conclusão como hipótese sustentada por correlação.

---

### 35. Criar política de regressão

Arquivo:

```text
stress-test-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - last-healthy-step
    - breaking-point
    - peak-errors
    - recovery-time
    - backlog
    - resource-headroom

  sameEnvironment:
    required

  sameWorkload:
    required

  higherBreakingPointWithWorseRecovery:
    evaluate:
      required

  dataCorruption:
    immediateReject:
      true
```

---

### 36. Comparar execuções

Script:

```text
compare-stress-runs.ps1
```

Compare:

```text
baseline release;

candidate release.
```

Registre:

- último degrau saudável;
- primeiro degrau quebrado;
- pico suportado;
- erros;
- shedding;
- backlog;
- drain time;
- recovery;
- recurso limitante;
- decisão.

---

### 37. Criar política de data quality

Arquivo:

```text
stress-test-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingBaseline:
    action:
      block-test

  generatorLimited:
    result:
      inconclusive

  changedTopology:
    result:
      invalid-comparison

  stopConditionTriggered:
    preservePartialResult:
      true

  missingRecoveryWindow:
    result:
      incomplete

  unknownBackgroundTraffic:
    result:
      limited

  singleRunBreakingPoint:
    confidence:
      low
```

---

### 38. Criar política de segurança

Arquivo:

```text
stress-test-security-policy.yaml
```

Conteúdo:

```yaml
security:
  authorization:
    required

  target:
    allowlist:
      required

  data:
    synthetic:
      required

  maximumLoad:
    preapproved:
      required

  credentials:
    environmentOnly:
      required

  logs:
    payload:
      forbidden

  destructiveAction:
    bounded:
      required
```

---

### 39. Criar failure policy

Arquivo:

```text
stress-test-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  dataCorruption:
    action:
      immediate-stop

  databaseRisk:
    action:
      immediate-stop

  generatorSaturation:
    result:
      inconclusive

  uncontrolledBacklog:
    action:
      stop-and-drain

  loadSheddingFailure:
    action:
      protect-environment

  recoveryTimeout:
    result:
      fail-recovery

  JavaConcurrency:
    deferredToLesson587
```

---

### 40. Criar cenários

Arquivo:

```text
stress-test-scenarios.yaml
```

Cenários:

```text
baseline-confirmation;

progressive-stress;

CPU-saturation;

database-saturation;

HikariCP-exhaustion;

Redis-latency;

Kafka-backlog;

retry-amplification;

load-shedding-success;

load-shedding-failure;

backpressure-success;

backpressure-failure;

spike-short;

spike-repeated;

recovery-normal;

recovery-slow;

recovery-requires-restart;

generator-limited;

rollback-to-baseline.
```

Cada cenário registra:

- phase;
- workload;
- rate;
- duration;
- maximum;
- stop conditions;
- target metrics;
- generator metrics;
- backlog;
- recovery;
- result;
- rollback;
- evidence.

---

### 41. Executar stress progressivo

Script:

```text
run-progressive-stress-test.ps1
```

Procedimento:

1. confirmar baseline;
2. iniciar observabilidade;
3. executar degrau 80;
4. validar estabilidade;
5. avançar para 100;
6. repetir validação;
7. continuar até o limite aprovado;
8. interromper em stop condition;
9. retornar à baseline;
10. observar recovery.

---

### 42. Executar pico

Script:

```text
run-spike-test.ps1
```

Procedimento:

1. estabilizar em carga nominal;
2. marcar início da fase;
3. subir abruptamente;
4. manter janela curta;
5. reduzir para nominal;
6. observar backlog;
7. medir recovery;
8. confirmar ausência de corrupção;
9. preservar métricas;
10. executar rollback.

---

### 43. Validar load shedding

A resposta de rejeição deve:

- chegar cedo;
- ser explícita;
- não abrir transação desnecessária;
- não consumir conexão por muito tempo;
- não produzir efeito parcial;
- ser mensurável;
- permitir recuperação.

Exemplo de comportamento:

```text
HTTP 429
ou
HTTP 503

com contrato definido.
```

---

### 44. Validar backpressure em Kafka

Verifique:

- taxa de entrada;
- taxa de processamento;
- lag por partição;
- pause/resume;
- erro;
- retry;
- poison message;
- drain time;
- recuperação.

Backpressure não significa apenas “processar mais devagar”.

Ele precisa limitar a pressão upstream quando possível.

---

### 45. Criar relatório de stress

Arquivo:

```text
progressive-stress-report.yaml
```

Exemplo:

```yaml
stress:
  baselineRate:
    80

  lastHealthyStep:
    120

  firstBrokenStep:
    140

  maximumPlanned:
    160

  firstLimiter:
    database

  stopCondition:
    HikariCP-timeout-growth

  recovery:
    duration:
      4m

    status:
      PASS

  result:
    breaking-point-identified
```

Valores didáticos.

---

### 46. Criar relatório de pico

Arquivo:

```text
spike-report.yaml
```

Inclua:

- baseline;
- peak;
- subida;
- duração;
- erros;
- shedding;
- backlog;
- recurso limitante;
- recovery time;
- status;
- stop reason.

---

### 47. Criar gate

Arquivo:

```text
stress-test-contract.yaml
```

O gate precisa validar:

- ambiente;
- baseline;
- steps;
- maximum;
- stop conditions;
- breaking point;
- load shedding;
- backpressure;
- retries;
- backlog;
- recovery;
- rollback;
- segurança.

Status:

```text
PASS;

FAIL_BREAKING_POINT_BELOW_EXPECTED;

FAIL_UNCONTROLLED_DEGRADATION;

FAIL_BACKLOG;

FAIL_RECOVERY;

FAIL_SECURITY;

STOPPED_FOR_SAFETY;

INCONCLUSIVE.
```

---

### 48. Validar rollback

Script:

```text
validate-stress-rollback.ps1
```

Procedimento:

1. parar geradores;
2. confirmar ausência de processo residual;
3. reduzir carga;
4. restaurar profiles;
5. desativar flags temporárias;
6. limpar dados sintéticos;
7. drenar backlog;
8. confirmar pools;
9. confirmar health;
10. repetir baseline curta.

---

### 49. Criar matriz de testes

Arquivo:

```text
STRESS_TEST_MATRIX.md
```

Cenários:

- contract;
- authorization;
- baseline;
- progressive steps;
- maximum rate;
- stop condition;
- CPU saturation;
- throttling;
- memory pressure;
- GC;
- thread pools;
- HikariCP;
- database;
- Redis;
- Kafka;
- retry amplification;
- load shedding;
- backpressure;
- backlog;
- drain time;
- spike;
- repeated spike;
- recovery;
- generator saturation;
- rollback;
- security;
- evidence.

---

### 50. Criar troubleshooting

Arquivo:

```text
STRESS_TEST_TROUBLESHOOTING.md
```

Inclua:

- breaking point muda;
- gerador não atinge taxa;
- dropped iterations;
- CPU do gerador alta;
- target throttling;
- HikariCP pending;
- banco satura;
- Redis lento;
- Kafka lag não drena;
- retry amplification;
- load shedding tardio;
- backpressure não propaga;
- backlog oculto;
- recovery exige restart;
- heap não volta;
- erro permanece após pico;
- ambiente compartilhado interfere;
- concorrência Java antecipada.

---

### 51. Coletar evidence

Script:

```text
collect-stress-evidence.ps1
```

Arquivo:

```text
stress-test-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment category;
- service;
- release;
- workload category;
- baseline status;
- stress step category;
- last healthy step category;
- breaking point category;
- first limiter category;
- spike category;
- stop condition status;
- load shedding status;
- backpressure status;
- retry amplification category;
- backlog category;
- recovery category;
- rollback status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- token;
- URL privada;
- hostname;
- IP;
- payload;
- ID real;
- body;
- cookie;
- query;
- configuração real de produção;
- código da aula 587.

---

### 52. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\stress-testing\validate-stress-test-contract.ps1

.\scripts\performance\stress-testing\validate-stress-test-environment.ps1

.\scripts\performance\stress-testing\prepare-stress-test-data.ps1

.\scripts\performance\stress-testing\collect-stress-baseline.ps1

.\scripts\performance\stress-testing\run-progressive-stress-test.ps1

.\scripts\performance\stress-testing\run-spike-test.ps1

.\scripts\performance\stress-testing\validate-stress-step.ps1

.\scripts\performance\stress-testing\detect-breaking-point.ps1

.\scripts\performance\stress-testing\validate-load-shedding.ps1

.\scripts\performance\stress-testing\validate-backpressure.ps1

.\scripts\performance\stress-testing\analyze-retry-amplification.ps1

.\scripts\performance\stress-testing\analyze-stress-backlog.ps1

.\scripts\performance\stress-testing\validate-stress-recovery.ps1

.\scripts\performance\stress-testing\correlate-stress-metrics.ps1

.\scripts\performance\stress-testing\compare-stress-runs.ps1

.\scripts\performance\stress-testing\enforce-stress-stop-conditions.ps1

.\scripts\performance\stress-testing\validate-stress-rollback.ps1

.\scripts\performance\stress-testing\scan-stress-output.ps1

.\scripts\performance\stress-testing\collect-stress-evidence.ps1

.\scripts\performance\stress-testing\verify-stress-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- ambiente autorizado;
- baseline aprovada;
- steps executados;
- spike executado;
- breaking point identificado ou classificado como inconclusivo;
- stop conditions validadas;
- load shedding validado;
- backpressure validado;
- retries analisados;
- backlog medido;
- recovery validada;
- rollback aprovado;
- segurança aprovada;
- evidence sanitizada;
- concorrência Java não antecipada.

---

### 53. Encerrar o laboratório

Pare todos os geradores.

Confirme:

- taxa voltou a zero;
- carga residual terminou;
- HikariCP pending voltou ao normal;
- banco estabilizou;
- Redis estabilizou;
- Kafka lag drenou;
- heap estabilizou;
- GC normalizou;
- nenhum restart loop;
- profiles restaurados;
- evidence coletada.

Remova artifacts temporários:

```powershell
Remove-Item `
  .tmp/stress-testing `
  -Recurse `
  -Force
```

Preserve relatórios sanitizados.

---

## Entendendo o que foi feito

### O limite ganhou método

A carga cresceu por degraus, não por tentativa aleatória.

### Saturação ganhou sinais

Fila, pending, throttling, lag e latência passaram a definir o limite.

### Breaking point ganhou critério

A primeira violação sustentada passou a substituir um pico isolado.

### Pico ganhou recovery

A queda da carga deixou de encerrar o experimento.

### Load shedding ganhou propósito

Rejeitar cedo passou a proteger recursos críticos.

### Backpressure ganhou fluxo

A capacidade downstream passou a limitar a pressão upstream.

### Retry ganhou amplificação

Tentativas passaram a ser contadas como carga adicional.

### Backlog ganhou drain time

O sistema passou a demonstrar que consegue recuperar trabalho acumulado.

### Rollback ganhou baseline

O ambiente voltou a um estado conhecido e validado.

### A próxima aula ganhou fronteira

A aula 587 irá aprofundar os mecanismos clássicos de concorrência dentro do código Java.

---

## Erros comuns importantes

### Aumentar carga sem degraus

Você perde a região em que a degradação começou.

### Continuar após stop condition

O risco deixa de ser pedagógico e vira incidente.

### Confundir gerador saturado com target saturado

Dropped iterations podem invalidar a conclusão.

### Medir apenas o pico

Recovery e backlog podem continuar ruins.

### Aumentar retry durante overload

A pressão cresce quando o sistema precisa respirar.

### Usar fila sem limite

A falha fica adiada e consome memória.

### Rejeitar tarde

Recursos escassos já foram consumidos.

### Ignorar drain time

O teste termina, mas o sistema continua degradado.

### Reiniciar para recuperar

Isso indica falha de recovery, não sucesso.

### Antecipar locks e threads Java

Concorrência interna pertence à aula 587.

---

## Comandos úteis

### Executar stress progressivo

```powershell
.\scripts\performance\stress-testing\run-progressive-stress-test.ps1
```

### Executar pico

```powershell
.\scripts\performance\stress-testing\run-spike-test.ps1
```

### Detectar breaking point

```powershell
.\scripts\performance\stress-testing\detect-breaking-point.ps1
```

### Analisar backlog

```powershell
.\scripts\performance\stress-testing\analyze-stress-backlog.ps1
```

### Validar recovery

```powershell
.\scripts\performance\stress-testing\validate-stress-recovery.ps1
```

---

## Exercício guiado

### Parte 1 — Baseline

Confirme carga nominal e budgets.

### Parte 2 — Steps

Defina degraus e duração.

### Parte 3 — Progressive stress

Aumente até stop condition ou máximo aprovado.

### Parte 4 — Breaking point

Identifique último degrau saudável.

### Parte 5 — Spike

Aplique pico curto e controlado.

### Parte 6 — Shedding

Valide rejeição antecipada.

### Parte 7 — Backpressure

Valide filas e downstream.

### Parte 8 — Retries e backlog

Meça amplificação e drain time.

### Parte 9 — Recovery

Observe retorno à baseline.

### Parte 10 — Gate

Valide segurança, rollback e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 585 e ponte para a aula 587 foram preservadas;
- stress, spike, saturation point, breaking point, failure point, recovery point, graceful degradation, load shedding, backpressure, retry amplification, backlog, drain time, hysteresis, overload, fail-fast e brownout foram definidos;
- contrato, workload, ambiente, steps, spike, breaking point, stop, shedding, backpressure, retry, backlog, recovery, observabilidade, regressão, qualidade, segurança e failure policies foram criados;
- baseline aprovada foi usada como início;
- degraus são controlados, observáveis e limitados;
- próximo degrau exige estabilidade anterior;
- máximo de carga foi pré-aprovado;
- script progressivo usa arrival rate e VUs limitados;
- thresholds de segurança podem abortar o teste;
- stop conditions externas foram documentadas;
- cada degrau registra taxa, latência, erros, recursos, filas e decisão;
- saturation point foi identificado por comportamento sustentado;
- breaking point foi definido pela primeira violação sustentada;
- último degrau saudável e primeiro quebrado foram registrados;
- failure region foi diferenciada do breaking point;
- pico possui baseline, subida, janela curta, retorno e recovery;
- load shedding rejeita cedo e preserva operações críticas;
- backpressure usa filas bounded, rate limit, pause ou rejeição;
- retries possuem limite, backoff, jitter e medição de amplificação;
- backlog registra tamanho, crescimento, idade e drain time;
- recovery exige retorno de latência, erros, pools, banco, Redis, Kafka, heap e GC;
- restart manual conta como falha de recovery;
- métricas do gerador e do target foram separadas;
- primeiro recurso limitante foi inferido por correlação;
- baseline e candidate foram comparadas com mesmo workload e ambiente;
- cenários, matriz, troubleshooting, rollback e evidence sanitizada estão presentes;
- nenhum segredo, URL privada, payload, ID real ou configuração de produção foi commitado;
- concorrência Java clássica não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/stress-testing `
  scripts/performance/stress-testing `
  docs/performance/stress-testing `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|privateUrl|hostname|customerId|orderId|responseBody|Thread|ExecutorService|ReentrantLock|Semaphore"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar teste de stress e carga pico"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- tokens;
- URLs privadas;
- payloads;
- IDs reais;
- cookies;
- artifacts temporários;
- valores reais de produção;
- implementação de concorrência Java;
- material da aula 587.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você ultrapassou a carga esperada de maneira controlada.

Você trabalhou com:

```text
stress progressivo;

carga pico;

saturation point;

breaking point;

failure region;

stop conditions;

load shedding;

backpressure;

retry amplification;

backlog;

drain time;

recovery;

rollback.
```

Você comprovou que stress testing precisa crescer por degraus; saturation point e breaking point não são necessariamente iguais; pico só termina depois da recovery window; load shedding protege recursos quando rejeita cedo; backpressure precisa limitar o upstream; retries podem ampliar overload; backlog precisa drenar; e recuperação sem restart manual faz parte do critério de sucesso.

A próxima aula será:

```text
587 - M18.32 - Concorrencia Java classica
```

Nela, você irá aprofundar threads, tasks, executors, futures, sincronização, locks, semáforos, atomicidade, visibilidade, condições de corrida, deadlocks e coordenação dentro da JVM.

Nenhuma implementação de `Thread`, `Runnable`, `Callable`, `Future`, `ExecutorService`, `synchronized`, `ReentrantLock`, `Semaphore`, `CountDownLatch`, `CompletableFuture` ou primitive de concorrência Java foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Confirmei baseline.
- [ ] Defini degraus.
- [ ] Executei stress progressivo.
- [ ] Identifiquei breaking point.
- [ ] Executei pico.
- [ ] Validei shedding e backpressure.
- [ ] Medi backlog e drain time.
- [ ] Validei recovery.

---

## Troubleshooting adicional

### O breaking point muda muito

Repita com mesmo ambiente, workload, dados e baseline.

### O gerador não alcança a taxa

Revise VUs, CPU, memória, rede e dropped iterations.

### O p95 estoura antes da CPU

A limitação pode estar em banco, pool, lock, fila ou dependência.

### HikariCP pending cresce

Correlacione usage, query, banco e transações antes de aumentar o pool.

### Kafka lag não drena

Processing rate não superou ingress ou consumers continuam degradados.

### Retry amplification aumenta

Reduza tentativas, respeite `Retry-After` e priorize recovery.

### Load shedding ocorre tarde

O gatilho está depois do consumo do recurso crítico.

### Backpressure não chega ao upstream

O mecanismo pode estar apenas acumulando em outra fila.

### Recovery precisa de restart

Classifique como falha de recuperação.

### A análise começou a implementar locks Java

Preserve essa etapa para a aula 587.

---

## Perguntas de revisão

1. O que é stress testing?
2. O que é spike testing?
3. O que é saturation point?
4. O que é breaking point?
5. O que é failure point?
6. O que é recovery point?
7. O que é graceful degradation?
8. O que é load shedding?
9. O que é backpressure?
10. O que é retry amplification?
11. O que é backlog?
12. Como calcular drain time?
13. Por que usar degraus?
14. O que é stop condition?
15. Como detectar gerador saturado?
16. Por que observar recovery?
17. O que significa fail-fast?
18. O que é brownout?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Carga acima do esperado.
2. Pico abrupto e temporário.
3. Recurso começa a limitar.
4. Budget deixa de ser atendido.
5. Falhas relevantes aparecem.
6. Sistema retorna à baseline.
7. Degradação controlada.
8. Rejeição para proteção.
9. Limitação pela capacidade downstream.
10. Tentativas aumentam carga.
11. Trabalho acumulado.
12. Backlog dividido pela capacidade líquida.
13. Encontrar a região de degradação.
14. Critério de interrupção.
15. Recursos e dropped iterations.
16. Sobrecarga pode deixar resíduos.
17. Falhar antes de consumir recursos.
18. Desabilitar função não essencial.
19. Concorrência Java clássica.
20. Concorrência Java clássica.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 586 - M18.31 - Teste de stress carga pico

- Continuei após Load testing K6 ou Gatling conceitual.
- Diferenciei stress, spike, saturation, breaking e failure point.
- Criei contrato, workload e ambiente autorizado.
- Defini blast radius e máximo pré-aprovado.
- Criei degraus de carga controlados.
- Executei stress progressivo com arrival rate.
- Validei thresholds e stop conditions.
- Registrei cada degrau com métricas do gerador e do sistema.
- Identifiquei último degrau saudável e primeiro quebrado.
- Diferenciei target saturation e generator saturation.
- Criei cenário de pico com recovery window.
- Validei load shedding e rejeição antecipada.
- Validei backpressure com filas bounded.
- Medi retry amplification.
- Medi backlog, growth, age e drain time.
- Correlacionei CPU, throttling, heap, GC, pools, banco, Redis e Kafka.
- Identifiquei o primeiro recurso limitante.
- Validei recuperação sem restart manual.
- Comparei baseline e candidate.
- Executei rollback e repeti baseline curta.
- Coletei evidence sanitizada.
- Não antecipei concorrência Java.
- Próxima aula: Concorrência Java clássica.
```

---

## Referência técnica curta

- Stress testing.
- Spike testing.
- Breaking point.
- Load shedding.
- Backpressure.
- Retry amplification.
- Backlog and drain time.
- Recovery testing.
- Graceful degradation.
- Overload protection.

Regra final:

```text
teste de stress e carga de pico precisa ultrapassar a carga esperada de forma autorizada, limitada e observável: a execução começa em baseline aprovada, cresce por degraus, respeita máximo pré-definido e interrompe em stop conditions de segurança, enquanto saturation point, breaking point e failure region são diferenciados por violações sustentadas de budgets, filas, erros e recursos; picos incluem retorno à carga nominal e recovery window, load shedding rejeita cedo para preservar operações críticas, backpressure impede buffers ilimitados, retries são medidos por amplificação e backlog é acompanhado por tamanho, idade, crescimento e drain time; generator saturation não é confundida com target saturation, recovery exige normalização de RED, USE, HikariCP, PostgreSQL, Redis, Kafka, heap e GC sem restart manual, e toda evidence permanece sanitizada, deixando para a aula 587 threads, tasks, executors, futures, sincronização, locks, semáforos, atomicidade, visibilidade, races e deadlocks na JVM.
```
