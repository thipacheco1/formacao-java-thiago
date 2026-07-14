# 605 - M18.50 - Revisao producao parte 2

## Apresentação da aula

Na aula 604, você revisou a primeira metade dos fundamentos de produção.

Foram consolidados:

```text
logs estruturados;

níveis de log;

request ID;

correlation ID;

trace ID;

span ID;

métricas;

cardinalidade;

histogramas;

percentis;

Prometheus;

tracing;

health;

liveness;

readiness;

SLIs;

SLOs;

error budget;

burn rate;

alertas;

dashboards.
```

Agora você irá concluir a revisão técnica do módulo.

A parte 2 reúne os temas mais ligados a diagnóstico, capacidade, concorrência e resposta operacional:

- profiling;
- CPU;
- memória;
- garbage collection;
- thread dumps;
- virtual threads;
- sincronização;
- race conditions;
- deadlocks;
- backpressure;
- timeouts;
- filas;
- pools;
- banco lento;
- runbooks;
- incidentes;
- otimização;
- regressão;
- rollback;
- segurança operacional.

O objetivo não é repetir cada aula isoladamente.

O objetivo é conseguir raciocinar sobre sintomas combinados.

Em produção, os sinais raramente aparecem organizados por assunto.

Um incidente pode mostrar ao mesmo tempo:

```text
latência p99 alta;

CPU moderada;

Hikari pending alto;

fila crescendo;

readiness oscilando;

GC estável;

traces lentos no repository;

timeouts downstream.
```

Outro incidente pode mostrar:

```text
CPU alta;

throughput estável;

hot thread em busy loop;

pool saudável;

banco saudável;

heap estável;

error rate baixo.
```

A revisão precisa preparar você para responder:

```text
qual recurso está saturado?

qual etapa está limitando a jornada?

há trabalho útil
ou desperdício?

o problema é espera,
processamento,
retenção,
bloqueio
ou capacidade?

qual evidência falta?

qual ação é segura?

qual mudança deve ser evitada?

como validar recuperação?
```

Esta aula também irá consolidar a forma correta de escolher ferramentas.

Você não coleta heap dump para todo problema.

Você não usa flame graph para toda latência.

Você não aumenta pool para todo pending.

Você não reinicia antes de preservar evidência mínima.

Você não chama timeout de causa raiz.

Você não remove lock sem revisar invariantes.

Você não aumenta fila sem considerar backlog e latência.

A sequência oficial é:

```text
605:
Revisao producao parte 2.

606:
Prova pratica producao.

607:
Refatoracao final producao.
```

A prova prática da aula 606 não será antecipada.

Esta aula não irá revelar:

- enunciado;
- roteiro oculto;
- critérios completos;
- solução;
- respostas;
- código final esperado;
- ordem exata dos cenários;
- gabarito.

Ela apenas garante que você tenha repertório técnico para resolver a avaliação.

A regra central será:

```text
diagnóstico de produção
não começa pela ferramenta;

começa pelo sintoma,
pela hipótese
e pela evidência necessária.
```

---

## Onde estamos na formação

A sequência recente foi:

```text
603:
Projeto API observavel parte 3 otimizacao.

604:
Revisao producao parte 1.

605:
Revisao producao parte 2.

606:
Prova pratica producao.

607:
Refatoracao final producao.
```

A progressão é:

```text
construir;

instrumentar;

otimizar;

revisar sinais;

revisar diagnóstico;

avaliar;

refatorar.
```

Nesta aula:

```text
profiling:
revisão completa.

CPU:
revisão completa.

memória:
revisão completa.

concorrência:
revisão completa.

virtual threads:
revisão completa.

locks:
revisão completa.

race conditions:
revisão completa.

deadlocks:
revisão completa.

backpressure:
revisão completa.

timeouts:
revisão completa.

banco:
revisão completa.

incidentes:
revisão completa.

otimização:
revisão completa.

prova prática:
não antecipar.
```

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

A API observável permanece a referência concreta.

Você irá revisar decisões, cenários, relatórios, scripts e gates sem introduzir uma nova feature principal.

---

## Objetivo prático

Será criada uma área de revisão:

```text
reviews/production-part-2
├── production-review-part2-contract.yaml
├── production-review-profiling-checklist.yaml
├── production-review-CPU-checklist.yaml
├── production-review-memory-checklist.yaml
├── production-review-concurrency-checklist.yaml
├── production-review-backpressure-checklist.yaml
├── production-review-timeout-checklist.yaml
├── production-review-database-checklist.yaml
├── production-review-incident-checklist.yaml
├── production-review-optimization-checklist.yaml
├── production-review-security-policy.yaml
├── production-review-data-quality-policy.yaml
├── production-review-failure-policy.yaml
├── production-review-scenarios.yaml
└── production-review-evidence.yaml

reviews/production-part-2/questions
├── profiling-review.md
├── CPU-review.md
├── memory-review.md
├── concurrency-review.md
├── backpressure-timeout-review.md
├── database-review.md
├── incident-review.md
└── optimization-review.md

reviews/production-part-2/reports
├── profiling-review-report.yaml
├── CPU-review-report.yaml
├── memory-review-report.yaml
├── concurrency-review-report.yaml
├── backpressure-review-report.yaml
├── timeout-review-report.yaml
├── database-review-report.yaml
├── incident-review-report.yaml
├── optimization-review-report.yaml
└── production-review-part2-gate-report.yaml

scripts/reviews/production-part-2
├── validate-production-review-part2-contract.ps1
├── inspect-profiling-evidence.ps1
├── inspect-CPU-diagnosis.ps1
├── inspect-memory-diagnosis.ps1
├── inspect-thread-dumps.ps1
├── inspect-concurrency-controls.ps1
├── inspect-race-condition-protection.ps1
├── inspect-deadlock-evidence.ps1
├── inspect-backpressure-controls.ps1
├── inspect-timeout-hierarchy.ps1
├── inspect-database-diagnosis.ps1
├── inspect-incident-runbook.ps1
├── inspect-optimization-evidence.ps1
├── run-production-review-part2-scenarios.ps1
├── collect-production-review-part2-evidence.ps1
└── verify-production-review-part2.ps1
```

Ao final, você terá:

```text
checklists técnicos;

perguntas;

cenários;

relatórios;

correções;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### Profiling

Coleta de amostras ou eventos para identificar onde recursos são consumidos.

---

### Saturação

Condição em que a demanda pronta supera a capacidade disponível.

---

### Contenção

Disputa por recurso compartilhado.

---

### Race condition

Resultado dependente da ordem de interleavings concorrentes.

---

### Deadlock

Ciclo de espera no qual threads não conseguem prosseguir.

---

### Backpressure

Mecanismo usado para limitar entrada quando consumo ou downstream não acompanham.

---

### Timeout

Limite de espera aplicado a uma operação ou etapa.

---

### Deadline

Instante limite para conclusão de uma jornada.

---

### Live set

Conjunto de objetos ainda vivos após coleta comparável.

---

### Hot method

Método que aparece com frequência relevante em amostras de CPU.

---

### Pool acquisition time

Tempo de espera por uma conexão disponível.

---

### Query plan

Estratégia escolhida pelo banco para executar uma consulta.

---

### Mitigação

Ação que reduz impacto antes da correção definitiva.

---

### Rollback

Reversão controlada de uma mudança.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part3-baseline.ps1

.\scripts\reviews\production-part-1\verify-production-review-part1.ps1

git status

git diff --check
```

Confirme:

- partes 1, 2 e 3 aprovadas;
- revisão 604 aprovada;
- logs, métricas e traces disponíveis;
- workloads conhecidos;
- zero task leaks;
- zero connection leaks;
- nenhum modo de degradação ativo;
- raw artifacts fora do Git.

---

### 2. Criar contrato da revisão

Arquivo:

```text
production-review-part2-contract.yaml
```

Conteúdo:

```yaml
productionReviewPart2:
  required:
    - profiling
    - CPU
    - memory
    - concurrency
    - race-condition
    - deadlock
    - backpressure
    - timeout
    - database
    - incident-response
    - optimization
    - rollback
    - evidence

  mode:
    revision:
      true

  practicalExam:
    content:
      forbidden

  nextLesson:
    code:
      M18.51
```

---

### 3. Revisar a escolha da ferramenta

Sintoma:

```text
CPU alta.
```

Ferramentas adequadas:

- CPU por processo;
- CPU por thread;
- thread dumps;
- JFR;
- sampling profiler;
- flame graph.

Sintoma:

```text
heap crescente.
```

Ferramentas adequadas:

- heap after GC;
- allocation rate;
- GC logs;
- histogramas;
- heap dump;
- dominator tree;
- path to GC root.

Sintoma:

```text
latência alta com pool pending.
```

Ferramentas adequadas:

- Hikari metrics;
- traces;
- `pg_stat_activity`;
- lock waits;
- query duration;
- pool acquisition.

Escolha a ferramenta pelo tipo de evidência necessária.

---

### 4. Revisar profiling

Profiling precisa responder:

```text
onde o tempo de CPU é gasto?

quais métodos alocam?

onde existe contenção?

quais threads aguardam?

qual código aparece repetidamente?
```

Ferramentas:

```text
JFR;

async-profiler;

thread dumps;

heap histogram;

heap dump;

query plans.
```

Um único profile curto pode não representar o workload.

---

### 5. Criar checklist de profiling

Arquivo:

```text
production-review-profiling-checklist.yaml
```

Conteúdo:

```yaml
profiling:
  workload:
    known:
      required

  warmup:
    separated:
      required

  duration:
    bounded:
      required

  repeatedSamples:
    required

  rawArtifacts:
    repository:
      forbidden

  conclusion:
    singleSample:
      insufficient
```

---

### 6. Inspecionar evidências de profiling

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-profiling-evidence.ps1
```

Valide:

- workload;
- warmup;
- duração;
- versão;
- CPU quota;
- memória;
- amostras;
- cenário;
- limitação;
- segurança.

---

### 7. Revisar CPU alta

CPU alta pode representar:

- trabalho útil;
- busy loop;
- polling agressivo;
- regex;
- serialização;
- logging;
- GC;
- contenção;
- JIT;
- system calls;
- throttling;
- quota insuficiente.

Perguntas:

```text
throughput aumentou?

p99 piorou?

há throttling?

qual thread está quente?

qual stack se repete?

CPU é user ou system?

GC participa?
```

---

### 8. Revisar CPU por operação

CPU percentual isolado depende de cores e normalização.

Uma métrica complementar:

```text
CPU time
/
operações concluídas.
```

Se CPU sobe e throughput cresce proporcionalmente, o uso pode ser saudável.

Se CPU sobe e throughput fica estável, investigue desperdício.

---

### 9. Criar checklist de CPU

Arquivo:

```text
production-review-CPU-checklist.yaml
```

Conteúdo:

```yaml
CPU:
  context:
    required:
      - host-cores
      - container-limit
      - throttling
      - process-CPU
      - thread-CPU
      - throughput
      - latency

  hotThread:
    repeatedStack:
      required

  CPUPerOperation:
    required

  addCPUAsOnlyFix:
    forbidden
```

---

### 10. Inspecionar CPU

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-CPU-diagnosis.ps1
```

Cenários:

- trabalho útil;
- busy spin;
- regex custosa;
- GC pressure;
- logging excessivo;
- throttling;
- system CPU alta.

Registre evidência e conclusão.

---

### 11. Revisar thread dumps

Um thread dump mostra estado e stack naquele instante.

Estados comuns:

```text
RUNNABLE;

BLOCKED;

WAITING;

TIMED_WAITING;

TERMINATED.
```

Um dump único pode ser enganoso.

Para CPU:

```text
colete vários dumps
com intervalo curto.
```

Para deadlock:

```text
procure ciclo de ownership
e espera.
```

Para contenção:

```text
procure muitas threads
BLOCKED
no mesmo monitor.
```

---

### 12. Inspecionar dumps

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-thread-dumps.ps1
```

Confirme:

- timestamp;
- processo;
- release;
- múltiplas amostras;
- stacks recorrentes;
- monitors;
- locks;
- deadlock section;
- ausência de dados sensíveis em evidence.

---

### 13. Revisar memória

Diferencie:

```text
allocation alta;

heap alto;

live set crescente;

memory leak;

RSS crescente;

native memory.
```

Allocation alta não prova leak.

Heap alto não prova leak.

Leak exige retenção desnecessária e caminho até GC root.

---

### 14. Revisar sinais de memória

Observe:

- heap after GC;
- old generation;
- allocation rate;
- promotion rate;
- GC pause;
- GC CPU;
- histogram delta;
- retained heap;
- live set slope;
- RSS;
- direct buffers;
- thread count;
- metaspace.

---

### 15. Criar checklist de memória

Arquivo:

```text
production-review-memory-checklist.yaml
```

Conteúdo:

```yaml
memory:
  distinguish:
    - allocation
    - heap-usage
    - live-set
    - native-memory

  leak:
    requires:
      - repeated-growth
      - retention
      - owner
      - path-to-GC-root

  heapDump:
    security:
      required

  largerHeapAsOnlyFix:
    forbidden
```

---

### 16. Inspecionar memória

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-memory-diagnosis.ps1
```

Cenários:

- churn estável;
- static collection leak;
- ThreadLocal leak;
- listener leak;
- cache unbounded;
- RSS crescendo com heap estável.

---

### 17. Revisar garbage collection

Perguntas:

```text
GC está consumindo CPU?

heap after GC cresce?

allocation rate aumentou?

promotion rate aumentou?

full GC recupera pouco?

collector é causa
ou está reagindo
à aplicação?
```

Trocar collector não deve ser a primeira ação sem evidência.

---

### 18. Revisar virtual threads

Virtual threads ajudam em workloads bloqueantes.

Elas não:

- tornam CPU infinita;
- aumentam conexões do banco;
- removem necessidade de timeout;
- removem backpressure;
- corrigem race condition;
- evitam pinning;
- substituem limite downstream.

Use virtual threads quando o workload e a versão do JDK justificarem.

---

### 19. Revisar pinning

Pinning pode ocorrer quando uma virtual thread fica presa ao carrier durante operações incompatíveis com desagendamento eficiente.

Investigue:

- `synchronized` longo;
- native calls;
- operações bloqueantes específicas;
- JFR;
- eventos de pinning;
- throughput;
- carrier utilization.

Não conclua apenas por existir `synchronized`.

---

### 20. Criar checklist de concorrência

Arquivo:

```text
production-review-concurrency-checklist.yaml
```

Conteúdo:

```yaml
concurrency:
  workload:
    explicit:
      required

  sharedState:
    owner:
      required

  invariants:
    tested:
      required

  virtualThreads:
    downstreamLimit:
      required

  ThreadLocal:
    cleanup:
      required

  shutdown:
    bounded:
      required
```

---

### 21. Inspecionar controles concorrentes

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-concurrency-controls.ps1
```

Valide:

- executors;
- filas;
- permits;
- locks;
- atomics;
- ThreadLocal;
- virtual threads;
- cancellation;
- shutdown;
- leaks.

---

### 22. Revisar `synchronized`

Use quando:

- exclusão mútua simples;
- critical section curta;
- ownership claro;
- monitor suficiente;
- timeout não é necessário.

Cuidado com:

- critical section longa;
- I/O dentro do monitor;
- lock ordering;
- chamadas externas;
- logging pesado;
- callbacks.

---

### 23. Revisar `ReentrantLock`

Use quando precisar de:

- `tryLock`;
- timeout;
- interruptibilidade;
- múltiplas conditions;
- instrumentação mais explícita.

Sempre:

```java
lock.lock();

try {
    // critical section
} finally {
    lock.unlock();
}
```

---

### 24. Revisar atomics

Atomics ajudam em operações simples:

- counters;
- flags;
- referências imutáveis;
- compare-and-set.

Não resolvem automaticamente invariantes compostas em múltiplos campos.

---

### 25. Revisar race condition

Categorias:

```text
lost update;

check-then-act;

unsafe publication;

stale read;

double initialization;

compound action;

TOCTOU.
```

Uma race pode não aparecer em thread dump.

Ela precisa ser reproduzida por interleavings e invariantes.

---

### 26. Criar checklist de race condition

Arquivo:

```text
production-review-race-condition-checklist.yaml
```

Conteúdo:

```yaml
raceCondition:
  invariant:
    explicit:
      required

  reproduction:
    deterministicHarness:
      preferred

  ThreadSleepOnly:
    insufficient

  fix:
    chooseFrom:
      - synchronized
      - lock
      - atomic
      - immutable-state
      - concurrent-collection
      - confinement

  brokenCode:
    productionPath:
      forbidden
```

---

### 27. Inspecionar proteção contra race

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-race-condition-protection.ps1
```

Valide:

- check-then-act;
- map operations;
- safe publication;
- lazy initialization;
- atomic reference;
- shutdown flags;
- callbacks;
- `CompletableFuture`.

---

### 28. Revisar deadlock

Deadlock exige ciclo.

Exemplo:

```text
thread A:
possui lock 1,
espera lock 2.

thread B:
possui lock 2,
espera lock 1.
```

Sinais:

- progresso zero;
- threads BLOCKED;
- mesmos locks;
- cycle no dump;
- throughput parado;
- timeout secundário.

Timeout de lock não prova deadlock.

---

### 29. Prevenir deadlock

Estratégias:

- lock ordering;
- reduzir locks aninhados;
- critical section curta;
- evitar chamada externa sob lock;
- `tryLock` com rollback seguro;
- ownership claro;
- imutabilidade;
- partitioning;
- testes.

---

### 30. Inspecionar deadlock

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-deadlock-evidence.ps1
```

Confirme:

- cycle;
- ownership;
- waiting lock;
- stack;
- threads envolvidas;
- mitigação;
- correção;
- regressão.

---

### 31. Revisar backpressure

Backpressure responde:

```text
o que acontece
quando a entrada
é maior que a saída?
```

Opções:

- bloquear;
- rejeitar;
- limitar;
- descartar conforme contrato;
- degradar;
- pausar;
- reduzir demanda;
- escalar quando seguro;
- shed load.

Fila ilimitada não é backpressure.

É adiamento do problema.

---

### 32. Revisar métricas de fila

Observe:

- capacidade;
- pending;
- utilization;
- arrival rate;
- consumption rate;
- oldest age;
- rejection;
- drain time;
- lag.

Tamanho sem idade pode esconder trabalho antigo.

---

### 33. Criar checklist de backpressure

Arquivo:

```text
production-review-backpressure-checklist.yaml
```

Conteúdo:

```yaml
backpressure:
  queue:
    bounded:
      required

  capacity:
    explicit:
      required

  rejection:
    observable:
      required

  oldestAge:
    required

  downstream:
    budget:
      required

  largerQueueAsOnlyFix:
    forbidden
```

---

### 34. Inspecionar backpressure

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-backpressure-controls.ps1
```

Cenários:

- steady healthy;
- burst;
- consumer slow;
- downstream unavailable;
- queue near capacity;
- rejection;
- recovery;
- shutdown drain.

---

### 35. Revisar timeouts

Diferencie:

- connect timeout;
- acquisition timeout;
- read timeout;
- write timeout;
- response timeout;
- query timeout;
- transaction timeout;
- lock timeout;
- queue timeout;
- Future timeout;
- delivery timeout.

Um timeout apenas encerra a espera do chamador se a operação subjacente for tratada corretamente.

---

### 36. Revisar deadline e budget

Uma jornada possui budget total.

As etapas recebem budgets menores.

Exemplo:

```text
request:
2 segundos.

pool:
100 ms.

query:
700 ms.

downstream:
600 ms.

serialização e resposta:
reserva.
```

Timeout interno maior que o externo produz trabalho órfão.

---

### 37. Criar checklist de timeout

Arquivo:

```text
production-review-timeout-checklist.yaml
```

Conteúdo:

```yaml
timeout:
  journeyDeadline:
    required

  propagation:
    remainingBudget:
      preferred

  hierarchy:
    internalLessThanExternal:
      required

  cancellation:
    explicit:
      required

  retry:
    withinBudget:
      required

  lateCompletion:
    observable:
      required
```

---

### 38. Inspecionar timeouts

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-timeout-hierarchy.ps1
```

Valide:

- connect;
- pool;
- query;
- lock;
- HTTP;
- Future;
- retry;
- cancellation;
- late completion;
- shutdown.

---

### 39. Revisar retries

Retry precisa considerar:

- idempotência;
- erro transitório;
- limite;
- backoff;
- jitter;
- budget restante;
- carga adicional;
- duplicação;
- side effects.

Retry sem limite pode transformar falha parcial em incidente amplo.

---

### 40. Revisar banco lento

Separe:

```text
pool wait;

connection;

lock wait;

planning;

execution;

I/O;

transfer;

mapping;

serialization;

commit.
```

“Banco lento” não é diagnóstico suficiente.

---

### 41. Revisar HikariCP

Observe:

- active;
- idle;
- pending;
- maximum;
- acquisition time;
- connection timeout;
- leak detection quando apropriado.

Pending alto pode vir de:

- query lenta;
- transação longa;
- connection leak;
- pool pequeno;
- banco saturado;
- concorrência excessiva.

---

### 42. Revisar `pg_stat_activity`

Use para:

- state;
- wait event;
- xact age;
- query age;
- blocked;
- blocker;
- idle in transaction.

Não persista SQL sensível no relatório.

---

### 43. Revisar `pg_stat_statements`

Observe:

- calls;
- total time;
- mean time;
- rows;
- shared hits;
- reads;
- temp usage.

Query frequente e moderada pode consumir mais recursos que uma query rara e muito lenta.

---

### 44. Revisar planos

Compare:

- estimated rows;
- actual rows;
- loops;
- scan;
- join;
- buffers;
- sort;
- temp;
- planning time;
- execution time.

`Seq Scan` não é sempre ruim.

Índice não é sempre bom.

---

### 45. Criar checklist de banco

Arquivo:

```text
production-review-database-checklist.yaml
```

Conteúdo:

```yaml
database:
  separateStages:
    required

  pool:
    metrics:
      required

  activity:
    waits:
      required

  statements:
    totalAndCalls:
      required

  plan:
    estimatedVsActual:
      required

  index:
    workloadEvidence:
      required

  connectionLeak:
    zero:
      required
```

---

### 46. Inspecionar banco

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-database-diagnosis.ps1
```

Cenários:

- pool exhaustion;
- lock wait;
- long transaction;
- missing index;
- bad cardinality;
- N+1;
- deep offset;
- large result;
- connection leak.

---

### 47. Revisar incident response

Durante um incidente:

```text
declarar;

classificar severidade;

nomear commander;

abrir timeline;

atribuir investigação;

comunicar;

mitigar;

validar recovery;

encerrar;

preparar postmortem.
```

Causa raiz não é pré-requisito para declaração.

---

### 48. Revisar papéis

Incident commander:

- coordena;
- prioriza;
- aprova ações importantes;
- mantém visão global.

Technical lead:

- lidera investigação técnica.

Communications lead:

- envia atualizações aprovadas.

Scribe:

- registra timeline e decisões.

---

### 49. Revisar mitigação

Mitigações comuns:

- rollback;
- feature flag;
- traffic shift;
- scale;
- load shedding;
- restart;
- pause consumer;
- read-only;
- dependency isolation.

Cada ação precisa de:

- owner;
- risco;
- resultado esperado;
- trigger de rollback;
- validação.

---

### 50. Criar checklist de incidente

Arquivo:

```text
production-review-incident-checklist.yaml
```

Conteúdo:

```yaml
incident:
  declaration:
    beforeRootCause:
      allowed

  severity:
    explicit:
      required

  commander:
    requiredForCritical:
      true

  timeline:
    required

  decisionLog:
    required

  communication:
    cadence:
      required

  recovery:
    stableWindow:
      required

  closure:
    followUps:
      required
```

---

### 51. Inspecionar runbook

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-incident-runbook.ps1
```

Valide:

- entrada por alerta;
- impacto;
- papéis;
- timeline;
- evidence;
- mitigação;
- rollback;
- handoff;
- recovery;
- closure;
- postmortem.

---

### 52. Revisar otimização

Ciclo correto:

```text
baseline;

workload;

profiling;

hipótese;

candidato;

mudança isolada;

before/after;

regressão;

aprovação ou rollback.
```

Nunca aprove apenas porque “pareceu mais rápido”.

---

### 53. Revisar before/after

Fixe:

- Java;
- flags;
- CPU;
- memória;
- dataset;
- schema;
- statistics;
- pool;
- workload;
- warmup;
- duração.

Compare:

- throughput;
- p50;
- p95;
- p99;
- error rate;
- CPU por operação;
- allocation por operação;
- GC;
- query count;
- pool acquisition;
- queue utilization;
- SLO.

---

### 54. Criar checklist de otimização

Arquivo:

```text
production-review-optimization-checklist.yaml
```

Conteúdo:

```yaml
optimization:
  baseline:
    required

  candidate:
    hypothesis:
      required

  isolatedChange:
    required

  beforeAfter:
    sameWorkload:
      required

  preserve:
    - correctness
    - SLO
    - logs
    - metrics
    - traces
    - health
    - alerts

  rollback:
    tested:
      required
```

---

### 55. Inspecionar otimização

Execute:

```powershell
.\scripts\reviews\production-part-2\inspect-optimization-evidence.ps1
```

Valide:

- baseline;
- candidate;
- target metric;
- risk;
- before;
- after;
- regressão;
- observabilidade;
- rollback;
- decisão.

---

### 56. Revisar decisões perigosas

Rejeite:

- aumentar heap como única solução;
- aumentar pool sem banco;
- aumentar fila sem age;
- remover timeout;
- desabilitar alerta para parar ruído;
- excluir 5xx do SLI;
- remover lock sem invariant test;
- reduzir logs a ponto de perder diagnóstico;
- cache ilimitado;
- paralelismo ilimitado;
- restart periódico como correção;
- `VACUUM FULL` impulsivo;
- `EXPLAIN ANALYZE` perigoso;
- heap dump sem proteção.

---

### 57. Criar security policy

Arquivo:

```text
production-review-security-policy.yaml
```

Conteúdo:

```yaml
security:
  heapDump:
    sensitive:
      true

  JFR:
    rawRepository:
      forbidden

  threadDump:
    sanitize:
      required

  database:
    rawSQL:
      forbidden

  incident:
    personalContact:
      forbidden

  evidence:
    identifier:
      forbidden
```

---

### 58. Criar data quality policy

Arquivo:

```text
production-review-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  singleSample:
    result:
      limited

  differentWorkload:
    result:
      invalid

  missingCapacityContext:
    result:
      inconclusive

  missingTimeline:
    result:
      incomplete

  missingRootEvidence:
    result:
      suspected-only

  mixedChanges:
    result:
      inconclusive
```

---

### 59. Criar failure policy

Arquivo:

```text
production-review-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  unsafeDumpCollection:
    action:
      fail-security

  noDeadline:
    action:
      fail-timeout-design

  unboundedQueue:
    action:
      fail-backpressure

  deadlockWithoutCycleEvidence:
    result:
      suspected-only

  poolIncreaseWithoutEvidence:
    action:
      reject

  optimizationWithoutBaseline:
    action:
      reject

  examContent:
    deferredToLesson606
```

---

### 60. Criar cenários oficiais

Arquivo:

```text
production-review-scenarios.yaml
```

Cenários:

```text
CPU-useful-work;

CPU-busy-loop;

CPU-throttling;

memory-allocation-without-leak;

memory-live-set-growth;

ThreadLocal-leak;

virtual-thread-downstream-saturation;

lock-contention;

race-lost-update;

deadlock-cycle;

bounded-queue-healthy;

unbounded-queue-rejected;

timeout-hierarchy-valid;

timeout-orphan-work;

retry-budget-valid;

pool-acquisition-slow;

database-lock-wait;

query-plan-cardinality-error;

incident-declaration;

incident-handoff;

optimization-approved;

optimization-rolled-back;

evidence-sanitized;

part2-gate-pass.
```

---

### 61. Executar cenários

Execute:

```powershell
.\scripts\reviews\production-part-2\run-production-review-part2-scenarios.ps1
```

Para cada cenário, registre:

- sintoma;
- hipótese;
- evidência;
- ferramenta;
- decisão;
- mitigação;
- correção;
- validação;
- limitação.

---

### 62. Criar relatórios

Exemplo:

```yaml
CPUReview:
  capacityContext:
    PASS

  threadEvidence:
    PASS

  CPUPerOperation:
    PASS

  result:
    PASS
```

Repita para:

- profiling;
- memory;
- concurrency;
- backpressure;
- timeout;
- database;
- incident;
- optimization.

---

### 63. Criar gate

O gate valida:

```text
profiling;

CPU;

memory;

concurrency;

race condition;

deadlock;

backpressure;

timeouts;

database;

incidents;

optimization;

rollback;

security;

evidence.
```

Status:

```text
PASS;

FAIL_PROFILING;

FAIL_CPU;

FAIL_MEMORY;

FAIL_CONCURRENCY;

FAIL_RACE;

FAIL_DEADLOCK;

FAIL_BACKPRESSURE;

FAIL_TIMEOUT;

FAIL_DATABASE;

FAIL_INCIDENT;

FAIL_OPTIMIZATION;

FAIL_ROLLBACK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 64. Coletar evidence

Arquivo:

```text
production-review-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- environment;
- release category;
- profiling status;
- CPU status;
- memory status;
- concurrency status;
- race status;
- deadlock status;
- backpressure status;
- timeout status;
- database status;
- incident status;
- optimization status;
- rollback status;
- task leak status;
- connection leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- raw JFR;
- heap dump;
- raw thread dump;
- PID;
- thread ID;
- SQL bruto;
- query parameter;
- payload;
- order ID;
- customer reference;
- trace ID;
- contatos pessoais;
- enunciado ou respostas da prova.

---

### 65. Executar gate completo

Execute:

```powershell
.\scripts\reviews\production-part-2\validate-production-review-part2-contract.ps1

.\scripts\reviews\production-part-2\inspect-profiling-evidence.ps1

.\scripts\reviews\production-part-2\inspect-CPU-diagnosis.ps1

.\scripts\reviews\production-part-2\inspect-memory-diagnosis.ps1

.\scripts\reviews\production-part-2\inspect-thread-dumps.ps1

.\scripts\reviews\production-part-2\inspect-concurrency-controls.ps1

.\scripts\reviews\production-part-2\inspect-race-condition-protection.ps1

.\scripts\reviews\production-part-2\inspect-deadlock-evidence.ps1

.\scripts\reviews\production-part-2\inspect-backpressure-controls.ps1

.\scripts\reviews\production-part-2\inspect-timeout-hierarchy.ps1

.\scripts\reviews\production-part-2\inspect-database-diagnosis.ps1

.\scripts\reviews\production-part-2\inspect-incident-runbook.ps1

.\scripts\reviews\production-part-2\inspect-optimization-evidence.ps1

.\scripts\reviews\production-part-2\run-production-review-part2-scenarios.ps1

.\scripts\reviews\production-part-2\collect-production-review-part2-evidence.ps1

.\scripts\reviews\production-part-2\verify-production-review-part2.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 66. Encerrar a revisão

Confirme:

- stack encerrada quando não necessária;
- modos de degradação resetados;
- processos de profiling encerrados;
- filas em estado conhecido;
- executors encerrados;
- datasource fechado;
- zero task leaks;
- zero connection leaks;
- raw artifacts fora do Git;
- evidence sanitizada;
- revisão parte 1 preservada;
- gate parte 2 aprovado;
- prova prática não antecipada.

---

## Entendendo o que foi feito

### A ferramenta ganhou propósito

Cada coleta passou a responder uma pergunta específica.

### CPU ganhou contexto de capacidade

Throughput, quota, throttling e CPU por operação passaram a acompanhar o percentual.

### Memória ganhou distinção

Allocation, heap, live set e native memory deixaram de ser confundidos.

### Thread dumps ganharam repetição

Stacks recorrentes passaram a sustentar conclusões.

### Virtual threads ganharam limite

Downstream e backpressure continuaram explícitos.

### Locks ganharam invariantes

A sincronização deixou de ser escolhida apenas por sintaxe.

### Race conditions ganharam reprodução

Interleavings e invariantes passaram a orientar a correção.

### Deadlocks ganharam ciclo

Timeout deixou de ser confundido com prova.

### Backpressure ganhou capacidade

Fila bounded, idade, rejection e drain time passaram a ser obrigatórios.

### Timeouts ganharam hierarquia

Deadline, remaining budget, retries e cancelamento passaram a formar um contrato.

### Banco ganhou etapas

Pool, lock, execução, transferência e aplicação foram separados.

### Incidentes ganharam coordenação

Papéis, timeline, comunicação e mitigação foram consolidados.

### Otimização ganhou prova

Baseline, before/after, rollback e regressão passaram a decidir aprovação.

---

## Erros comuns importantes

### Escolher ferramenta antes da hipótese

A coleta pode ser irrelevante.

### Chamar CPU alta de defeito

Pode existir trabalho útil.

### Chamar heap alto de leak

A retenção pode estar estável.

### Usar um thread dump

A stack pode ser momentânea.

### Aumentar concorrência sem limite

O downstream pode saturar.

### Chamar timeout de causa

Timeout é consequência ou proteção.

### Aumentar fila

Backlog vira latência e memória.

### Aumentar pool

O banco pode sofrer mais concorrência.

### Reiniciar antes de preservar evidence

O estado necessário ao diagnóstico desaparece.

### Aprovar otimização sem regressão

A melhoria pode quebrar SLO ou funcionalidade.

---

## Comandos úteis

### Revisar CPU

```powershell
.\scripts\reviews\production-part-2\inspect-CPU-diagnosis.ps1
```

### Revisar memória

```powershell
.\scripts\reviews\production-part-2\inspect-memory-diagnosis.ps1
```

### Revisar concorrência

```powershell
.\scripts\reviews\production-part-2\inspect-concurrency-controls.ps1
```

### Revisar banco

```powershell
.\scripts\reviews\production-part-2\inspect-database-diagnosis.ps1
```

### Validar parte 2

```powershell
.\scripts\reviews\production-part-2\verify-production-review-part2.ps1
```

---

## Exercício guiado

### Parte 1 — Profiling

Escolha a ferramenta conforme o sintoma.

### Parte 2 — CPU e memória

Diferencie trabalho útil, churn, leak e native memory.

### Parte 3 — Concorrência

Revise locks, atomics, virtual threads e invariantes.

### Parte 4 — Race e deadlock

Exija reprodução ou ciclo.

### Parte 5 — Backpressure

Valide fila bounded, age e rejection.

### Parte 6 — Timeouts

Revise deadline, hierarchy e cancellation.

### Parte 7 — Banco

Separe pool, lock, query e transferência.

### Parte 8 — Incidente

Revise papéis, timeline, mitigação e recovery.

### Parte 9 — Otimização

Exija baseline, before/after e rollback.

### Parte 10 — Gate

Valide segurança, leaks, evidence e continuidade.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 604 e ponte para a aula 606 foram preservadas;
- a baseline do projeto e a revisão parte 1 permanecem aprovadas;
- contrato, checklists, cenários, relatórios e scripts foram criados;
- profiling foi associado a workload, warmup, duração e hipótese;
- CPU foi analisada com quota, throttling, throughput e CPU por operação;
- hot threads exigem stacks recorrentes;
- thread dumps foram revisados por estado, monitor e ciclo;
- allocation, heap, live set e memória nativa foram diferenciados;
- memory leak exige retenção, owner e path to GC root;
- GC foi interpretado em conjunto com allocation e live set;
- virtual threads continuam sujeitas a downstream limits;
- `synchronized`, locks e atomics foram revisados por invariantes;
- race condition exige reprodução e teste de invariante;
- deadlock exige ciclo de espera;
- backpressure exige fila bounded, capacity, age e rejection;
- timeout hierarchy e deadline foram revisados;
- cancellation, late completion e retry budget foram incluídos;
- pool, lock, query, transferência e aplicação foram separados;
- Hikari, `pg_stat_activity`, `pg_stat_statements` e planos foram revisados;
- incident response possui declaração, severidade, papéis, timeline e mitigation;
- otimização exige baseline, mudança isolada, before/after, regressão e rollback;
- zero task leaks e zero connection leaks foram validados;
- raw artifacts, SQL, IDs, payloads e contatos não foram commitados;
- a prova prática não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/reviews/production-part-2 `
  scripts/reviews/production-part-2 `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestId|traceIdValue|spanIdValue|rawJfr|heapDump|threadDump|rawSql|queryParameter|personalPhone|examAnswer"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): revisar producao parte 2"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados reais;
- raw JFR;
- heap dumps;
- thread dumps;
- SQL sensível;
- IDs;
- contatos pessoais;
- enunciado;
- solução;
- respostas da prova prática.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu a revisão técnica de produção.

Você consolidou:

```text
profiling;

CPU;

CPU por operação;

thread dumps;

memory leak;

live set;

GC;

virtual threads;

locks;

atomics;

race conditions;

deadlocks;

backpressure;

timeouts;

deadlines;

retries;

HikariCP;

PostgreSQL;

query plans;

incident response;

runbooks;

otimização;

rollback;

regressão.
```

Você comprovou que ferramentas são escolhidas por hipótese; que CPU depende de capacidade e throughput; que leak depende de retenção; que virtual threads não removem limites downstream; que locks preservam invariantes; que race condition e deadlock exigem evidências diferentes; que fila ilimitada não é backpressure; que timeouts precisam de hierarchy e cancellation; que banco lento deve ser decomposto; que incidentes exigem coordenação; e que otimização precisa de before/after e rollback.

A próxima aula será:

```text
606 - M18.51 - Prova pratica producao
```

Nela, você será avaliado por meio de um cenário prático de operação e diagnóstico de sistemas em produção.

Nenhum enunciado, gabarito, solução, critério oculto ou resposta da prova prática foi revelado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Escolho ferramenta pela hipótese.
- [ ] Diferencio CPU útil de desperdício.
- [ ] Diferencio allocation, heap e leak.
- [ ] Exijo invariantes em concorrência.
- [ ] Exijo ciclo para deadlock.
- [ ] Valido backpressure e timeout hierarchy.
- [ ] Decomponho banco e incidentes.
- [ ] Aprovo otimização apenas com regressão.

---

## Troubleshooting adicional

### CPU alta sem hot thread clara

Revise throttling, system CPU, GC, workload distribuído e duração da coleta.

### Heap cresce durante carga e estabiliza

Pode ser warmup ou working set, não leak.

### Thread dump mostra muitas threads waiting

Waiting não significa problema sem contexto de progresso.

### Virtual threads aumentam pool pending

O limite downstream permaneceu menor que a concorrência de entrada.

### Timeout diminui e erro aumenta

O valor pode ter ficado abaixo da latência saudável da dependência.

### Fila não enche, mas oldest age cresce

O consumo pode estar atrasado mesmo sem alta utilização percentual.

### Query rápida e request lenta

Meça fetch, mapping, serialização e downstream.

### Restart recupera e problema volta

A causa não foi corrigida.

### Otimização melhora p50 e piora p99

A mudança não deve ser aprovada sem análise.

### O documento começou a mostrar respostas da prova

Remova qualquer antecipação da aula 606.

---

## Perguntas de revisão

1. Como escolher uma ferramenta de profiling?
2. O que diferencia utilização de saturação?
3. Por que CPU percentual não basta?
4. O que é CPU por operação?
5. Qual diferença entre allocation e memory leak?
6. O que é live set?
7. Quando usar thread dumps?
8. O que virtual threads não resolvem?
9. Quando usar `synchronized`?
10. Quando usar `ReentrantLock`?
11. O que prova uma race condition?
12. O que prova um deadlock?
13. O que é backpressure?
14. Por que fila ilimitada é perigosa?
15. Qual diferença entre timeout e deadline?
16. Por que retry precisa de budget?
17. Como decompor banco lento?
18. O que uma otimização precisa provar?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Pelo sintoma e pela evidência necessária.
2. Uso do recurso versus demanda excedente.
3. Depende de cores, quota e throughput.
4. Tempo de CPU dividido por operações.
5. Criar objetos versus retê-los.
6. Objetos vivos após GC comparável.
7. CPU, contenção, deadlocks e estados.
8. Limites downstream, race, timeout e backpressure.
9. Exclusão mútua simples e curta.
10. Timeout, interruptibilidade e conditions.
11. Interleaving e violação de invariante.
12. Ciclo de espera e ownership.
13. Controle de entrada diante de capacidade limitada.
14. Converte pressão em memória e latência.
15. Limite por etapa versus limite da jornada.
16. Evitar amplificação e trabalho órfão.
17. Pool, lock, execução, I/O, transferência e aplicação.
18. Baseline, ganho, correção, SLO e rollback.
19. Prova prática produção.
20. Prova prática produção.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 605 - M18.50 - Revisao producao parte 2

- Concluí a revisão técnica de produção.
- Revisei escolha de ferramentas por sintoma e hipótese.
- Consolidei profiling com JFR, dumps, histogramas e planos.
- Revisei CPU, quota, throttling, hot threads e CPU por operação.
- Diferenciei allocation, heap, live set, leak e memória nativa.
- Revisei GC em conjunto com allocation e retenção.
- Consolidei virtual threads, pinning e downstream limits.
- Revisei `synchronized`, `ReentrantLock`, atomics e invariantes.
- Diferenciei race condition e deadlock.
- Revisei backpressure, filas bounded, age e rejection.
- Revisei timeouts, deadline, cancellation e retry budget.
- Decompus banco em pool, lock, execução, transferência e aplicação.
- Revisei HikariCP, `pg_stat_activity`, `pg_stat_statements` e planos.
- Consolidei incident response, papéis, timeline e mitigation.
- Revisei otimização com baseline, before/after, regressão e rollback.
- Validei zero task leaks e zero connection leaks.
- Coletei evidence sanitizada.
- Não antecipei enunciado ou respostas da prova.
- Próxima aula: Prova prática produção.
```

---

## Referência técnica curta

- Java Flight Recorder.
- Thread dumps.
- CPU profiling.
- JVM memory diagnostics.
- Virtual threads.
- Java concurrency.
- Backpressure.
- Timeout budgets.
- PostgreSQL diagnostics.
- Incident response and optimization regression.

Regra final:

```text
a segunda revisão de produção precisa consolidar diagnóstico por hipótese e evidência: profiling usa workload conhecido, warmup, duração bounded e múltiplas amostras, CPU é analisada com quota, throttling, throughput, hot threads e CPU por operação, memória diferencia allocation, heap, live set, leak e native memory, e thread dumps, histogramas, JFR, heap dumps e query plans são escolhidos conforme a pergunta; virtual threads não removem limites downstream, locks e atomics preservam invariantes, race condition exige reprodução de interleaving, deadlock exige ciclo, backpressure exige fila bounded, capacity, age e rejection, e timeouts formam hierarchy subordinada ao deadline com cancellation, retries e late completion observáveis; banco lento é decomposto em pool, lock, execução, I/O, transferência e aplicação, incidentes possuem papéis, timeline, mitigação e stable recovery, e otimizações só são aprovadas com baseline, mudança isolada, before/after, regressão, SLO preservado e rollback testado; raw artifacts e dados sensíveis permanecem fora do Git, e a prova prática da aula 606 não pode ser antecipada.
```
