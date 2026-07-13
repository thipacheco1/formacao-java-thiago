# 570 - M18.15 - Thread dump

## Apresentação da aula

Na aula 569, você aprendeu a investigar incidentes por logs estruturados.

A investigação passou a considerar:

```text
sintoma;

ambiente;

serviço;

release;

janela temporal;

correlation ID;

trace ID;

sequência de eventos;

primeiro desvio;

error type;

fingerprint;

stack trace;

comparação entre instances.
```

Os logs mostram eventos que a aplicação decidiu registrar.

Entretanto, alguns problemas de produção não aparecem de forma suficiente nos logs.

Exemplos:

- requisições ficam lentas sem lançar exceção;
- workers deixam de progredir;
- threads aguardam indefinidamente;
- um pool fica sem threads disponíveis;
- várias threads disputam o mesmo lock;
- um deadlock impede progresso;
- uma chamada externa bloqueia threads;
- o sistema aparenta estar vivo, mas não responde;
- CPU cresce por loop de execução;
- latência aumenta sem mudança clara nas métricas de erro.

Nesses casos, precisamos observar o estado interno das threads da JVM.

Um **thread dump** é um snapshot das threads de um processo Java em determinado instante.

Ele mostra informações como:

```text
nome da thread;

identificador;

estado;

prioridade;

daemon;

stack trace;

lock aguardado;

lock possuído;

monitor;

sincronizador;

deadlock detectado.
```

A pergunta central desta aula será:

```text
como coletar
e analisar thread dumps

sem interromper
o diagnóstico,

identificando
bloqueios,
contenção,
starvation,
espera externa
e ausência de progresso?
```

Problemas de concorrência e performance exigem vários snapshots. Estado e stack persistentes sugerem ausência de progresso; mudanças entre dumps indicam atividade. A análise diferencia espera normal, contenção, deadlock, starvation, I/O e CPU.

Você usará `jcmd`, `jstack` e `jps`. A coleta preferencial será `jcmd <PID> Thread.print -l`, com `jstack` como fallback, somente em laboratório autorizado.

A aula criará cenários de espera, contenção, deadlock, starvation, I/O, CPU, filas e comparação temporal correlacionada à telemetria.

A aula não irá analisar objetos no heap.

Não serão aprofundados:

- heap dump;
- classes dominantes;
- retained size;
- shallow size;
- dominator tree;
- histogramas de objetos;
- vazamento de memória;
- referências fortes;
- GC roots;
- análise com Eclipse MAT;
- arquivos `.hprof`.

Esses tópicos pertencem à próxima aula oficial:

```text
571 - M18.16 - Heap dump
```

A regra central será:

```text
um thread dump
é um snapshot;

o diagnóstico confiável
surge da comparação
entre estado,
stack,
locks
e progresso
ao longo do tempo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
568:
Postmortem.

569:
Troubleshooting por logs.

570:
Thread dump.

571:
Heap dump.
```

A progressão é:

```text
eventos registrados;

execução interna;

memória interna.
```

Nesta aula:

```text
jcmd:
sim.

jstack:
sim.

jps:
sim.

thread states:
sim.

monitors:
sim.

ownable synchronizers:
sim.

deadlock:
sim.

contention:
sim.

starvation:
sim.

I/O wait:
sim.

múltiplos snapshots:
sim.

heap dump:
não.

análise de objetos:
não.

memory leak:
não.
```

Você reutilizará logs, métricas, tracing, release metadata, alertas e runbooks. O thread dump responde o que as threads estão fazendo naquele instante.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
src/main/java
└── .../diagnostics/threaddump
    ├── ThreadDumpScenarioController.java
    ├── NormalWaitingScenario.java
    ├── MonitorContentionScenario.java
    ├── DeadlockScenario.java
    ├── ExecutorStarvationScenario.java
    ├── BlockingIoScenario.java
    ├── CpuLoopScenario.java
    ├── ScenarioExecutionRegistry.java
    └── ThreadDumpScenarioProperties.java

src/test/java
└── .../diagnostics/threaddump
    ├── NormalWaitingScenarioTest.java
    ├── MonitorContentionScenarioTest.java
    ├── DeadlockScenarioContractTest.java
    ├── ExecutorStarvationScenarioTest.java
    ├── ScenarioIsolationTest.java
    └── ThreadDumpScenarioSecurityTest.java

observability/thread-dump
├── thread-dump-contract.yaml
├── thread-state-policy.yaml
├── thread-naming-policy.yaml
├── thread-dump-capture-policy.yaml
├── thread-dump-analysis-policy.yaml
├── thread-dump-comparison-policy.yaml
├── thread-contention-policy.yaml
├── thread-deadlock-policy.yaml
├── thread-starvation-policy.yaml
├── thread-io-policy.yaml
├── thread-cpu-policy.yaml
├── thread-dump-data-quality-policy.yaml
├── thread-dump-security-policy.yaml
├── thread-dump-failure-policy.yaml
├── thread-dump-scenarios.yaml
└── thread-dump-evidence.yaml

scripts/observability/thread-dump
├── validate-thread-dump-tools.ps1
├── discover-java-process.ps1
├── capture-thread-dump.ps1
├── capture-thread-dump-series.ps1
├── parse-thread-dump.ps1
├── summarize-thread-states.ps1
├── detect-thread-deadlocks.ps1
├── analyze-monitor-contention.ps1
├── analyze-executor-starvation.ps1
├── analyze-blocking-io.ps1
├── analyze-runnable-hotspots.ps1
├── compare-thread-dumps.ps1
├── scan-thread-dump-output.ps1
├── simulate-thread-dump-scenarios.ps1
├── collect-thread-dump-evidence.ps1
└── verify-thread-dump-baseline.ps1

docs/observability/thread-dump
├── THREAD_DUMP_OVERVIEW.md
├── THREAD_STATES_GUIDE.md
├── JCMD_JSTACK_GUIDE.md
├── DEADLOCK_ANALYSIS.md
├── CONTENTION_ANALYSIS.md
├── EXECUTOR_STARVATION.md
├── BLOCKING_IO_ANALYSIS.md
├── THREAD_DUMP_TEST_MATRIX.md
└── THREAD_DUMP_TROUBLESHOOTING.md
```

Ao final, você terá cenários controlados, coleta por PID, séries de snapshots, parser, análise de estados, locks, deadlocks, starvation, I/O, CPU, comparação temporal e evidence sanitizada.

Você irá validar ferramentas e PID, criar cenários, coletar dumps, interpretar estados e locks, detectar deadlocks, analisar starvation, I/O e CPU, comparar snapshots, correlacionar telemetria e executar o gate.

---

## Conceito essencial

### Thread

Unidade de execução dentro da JVM.

---

### Thread dump

Snapshot textual do estado e da stack de todas as threads da JVM.

---

### `NEW`

Thread criada, mas ainda não iniciada.

---

### `RUNNABLE`

Thread executável pela JVM.

Pode estar usando CPU ou executando operação nativa.

---

### `BLOCKED`

Thread aguardando adquirir um monitor Java já possuído por outra thread.

---

### `WAITING`

Thread aguardando sem timeout explícito por outra ação.

---

### `TIMED_WAITING`

Thread aguardando por um período definido.

---

### `TERMINATED`

Thread cuja execução terminou.

Geralmente não aparece como ativa no dump.

---

### Monitor

Mecanismo associado a blocos e métodos `synchronized`.

---

### Lock owner

Thread que possui um lock aguardado por outra thread.

---

### Ownable synchronizer

Sincronizador como `ReentrantLock`, cuja posse pode aparecer na seção de locks.

---

### Contention

Disputa entre threads por um recurso sincronizado.

---

### Deadlock

Ciclo no qual threads aguardam locks possuídos umas pelas outras e nenhuma progride.

---

### Starvation

Situação em que uma tarefa não recebe oportunidade ou recurso suficiente para progredir.

---

### Thread pool

Conjunto controlado de threads usado para executar tarefas.

---

### Queue backlog

Tarefas aguardando execução em um executor.

---

### Snapshot series

Conjunto de dumps coletados em intervalos regulares.

---

### Progress signature

Mudança ou permanência de estado e stack entre snapshots.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

java `
  -version

jcmd `
  -h

jstack `
  -h

git status

git diff --check
```

Confirme:

- JDK 21 ativo;
- `jcmd` disponível;
- `jstack` disponível;
- aplicação compila;
- testes passam;
- cenários de thread ainda não existem;
- nenhum dump temporário está no repositório;
- nenhum processo real será analisado.

Registre a baseline.

---

### 2. Criar contrato de thread dump

Arquivo:

```text
thread-dump-contract.yaml
```

Conteúdo:

```yaml
threadDump:
  process:
    required:
      - pid
      - service
      - environment
      - release

  capture:
    tool:
      preferred:
        jcmd

      fallback:
        jstack

    multipleSnapshots:
      requiredForPerformanceAnalysis

  analysis:
    required:
      - thread-states
      - repeated-stacks
      - locks
      - deadlocks
      - executors
      - io-waits
      - runnable-hotspots

  evidence:
    rawDumpInRepository:
      forbidden

  heapAnalysis:
    deferredToLesson571
```

O contrato impede conclusões por linha isolada.

---

### 3. Criar política de captura

Arquivo:

```text
thread-dump-capture-policy.yaml
```

Conteúdo:

```yaml
capture:
  preferredCommand:
    jcmd-pid-Thread.print-l

  fallbackCommand:
    jstack-l-pid

  snapshots:
    minimum:
      3

    intervalSeconds:
      5

  metadata:
    required:
      - timestamp
      - pid
      - service
      - release
      - scenario
      - tool

  output:
    directory:
      .tmp/thread-dumps

    commit:
      forbidden

  production:
    authorization:
      required
```

Três snapshots são o mínimo didático.

---

### 4. Criar política de nomes de threads

Arquivo:

```text
thread-naming-policy.yaml
```

Conteúdo:

```yaml
threadNaming:
  requiredForCustomExecutors:
    true

  format:
    component-purpose-sequence

  examples:
    - orders-payment-1
    - orders-worker-2
    - diagnostics-deadlock-a

  forbidden:
    - customer-id
    - order-id
    - email
    - request-payload

  unnamedCustomThreads:
    action:
      block-operational-readiness
```

Nomes úteis aceleram o diagnóstico.

---

### 5. Criar propriedades do laboratório

Arquivo:

```text
ThreadDumpScenarioProperties.java
```

Responsabilidades:

- habilitar cenários apenas no profile `diagnostics`;
- definir duração máxima;
- definir quantidade de threads;
- limitar fila;
- impedir execução em produção;
- fornecer cleanup;
- exigir token local fictício quando endpoint HTTP for usado.

Exemplo conceitual:

```java
@ConfigurationProperties(
        prefix = "app.diagnostics.thread-dump")
public record ThreadDumpScenarioProperties(
        boolean enabled,
        int durationSeconds,
        int workerCount,
        int queueCapacity) {
}
```

O laboratório usa limites explícitos.

---

### 6. Criar registro de cenários

Arquivo:

```text
ScenarioExecutionRegistry.java
```

Responsabilidades:

- iniciar cenário;
- impedir duplicação;
- registrar estado;
- expor status;
- interromper cenário;
- executar cleanup;
- registrar timestamps;
- não armazenar IDs de negócio.

Estados:

```text
IDLE;

STARTING;

RUNNING;

STOPPING;

COMPLETED;

FAILED.
```

---

### 7. Criar endpoint controlado

Arquivo:

```text
ThreadDumpScenarioController.java
```

Endpoints locais:

```text
POST /internal/diagnostics/thread-dump/{scenario}/start

POST /internal/diagnostics/thread-dump/{scenario}/stop

GET /internal/diagnostics/thread-dump/status
```

Regras:

- profile `diagnostics`;
- ambiente local;
- acesso restrito;
- duração máxima;
- um cenário por vez;
- cleanup obrigatório;
- sem produção.

Não exponha esses endpoints em profiles normais.

---

### 8. Criar cenário de espera normal

Arquivo:

```text
NormalWaitingScenario.java
```

Exemplo:

```java
public void runScenario() throws InterruptedException {
    synchronized (monitor) {
        monitor.wait();
    }
}
```

A thread aparecerá como `WAITING on object monitor`. Esse estado pode ser normal; verifique nome, stack, finalidade, duração e expectativa do componente.

---

### 9. Criar cenário de `TIMED_WAITING`

Use:

```java
Thread.sleep(
        Duration.ofSeconds(30));
```

Ou:

```java
condition.await(
        30,
        TimeUnit.SECONDS);
```

O dump pode mostrar `TIMED_WAITING (sleeping)` ou `(parking)`, estado esperado em scheduler, retry delay, maintenance loop, pool idle ou timeout.

---

### 10. Criar cenário de contenção

Arquivo:

```text
MonitorContentionScenario.java
```

Estrutura:

```java
private final Object monitor =
        new Object();

public void holdLock() {
    synchronized (monitor) {
        sleepControlled();
    }
}

public void waitForLock() {
    synchronized (monitor) {
        performShortWork();
    }
}
```

Uma thread possui o monitor e outras ficam `BLOCKED waiting to lock`; a contenção pode ser temporária ou excessiva.

---

### 11. Criar cenário de deadlock

Arquivo:

```text
DeadlockScenario.java
```

Estrutura:

```java
private final Object lockA =
        new Object();

private final Object lockB =
        new Object();

public void pathOne() {
    synchronized (lockA) {
        waitUntilOtherThreadHoldsLockB();

        synchronized (lockB) {
            complete();
        }
    }
}

public void pathTwo() {
    synchronized (lockB) {
        waitUntilOtherThreadHoldsLockA();

        synchronized (lockA) {
            complete();
        }
    }
}
```

O cenário é local, isolado, protegido por profile e executado em processo descartável, pois monitores intrínsecos em deadlock não possuem cleanup simples.

---

### 12. Criar cenário de starvation

Arquivo:

```text
ExecutorStarvationScenario.java
```

Use um executor pequeno:

```java
new ThreadPoolExecutor(
        2,
        2,
        0L,
        TimeUnit.MILLISECONDS,
        new ArrayBlockingQueue<>(10),
        namedThreadFactory,
        new ThreadPoolExecutor.AbortPolicy());
```

Submeta tarefas que:

1. ocupam as duas threads;
2. aguardam resultados de tarefas submetidas ao mesmo pool;
3. deixam novas tarefas na fila.

O resultado combina workers ocupadas, tarefas aguardando e fila crescente, representando thread pool starvation.

---

### 13. Criar cenário de I/O bloqueante

Arquivo:

```text
BlockingIoScenario.java
```

Use servidor local fake ou socket controlado.

A thread pode aparecer como:

```text
RUNNABLE

at sun.nio.ch.SocketDispatcher.read0
```

ou em método de leitura nativa.

`RUNNABLE` pode representar espera em I/O nativo; interprete a stack antes de concluir CPU alta.

---

### 14. Criar cenário de loop de CPU

Arquivo:

```text
CpuLoopScenario.java
```

Exemplo controlado:

```java
while (running.get()) {
    accumulator =
            (accumulator * 31)
            ^ System.nanoTime();
}
```

Regras:

- duração limitada;
- uma thread;
- stop flag;
- ambiente local;
- prioridade normal;
- sem alocação excessiva.

Nos dumps, a thread tende a permanecer `RUNNABLE` com stack repetida no loop.

---

### 15. Criar política de estados

Arquivo:

```text
thread-state-policy.yaml
```

Conteúdo:

```yaml
states:
  NEW:
    activeProblem:
      uncommon

  RUNNABLE:
    interpretation:
      inspect-stack-and-cpu

  BLOCKED:
    interpretation:
      inspect-lock-owner

  WAITING:
    interpretation:
      inspect-reason-and-progress

  TIMED_WAITING:
    interpretation:
      inspect-timeout-and-purpose

  TERMINATED:
    usuallyAbsent:
      true

  conclusionFromStateOnly:
    forbidden
```

Estado isolado nunca basta.

---

### 16. Descobrir o processo Java

Script:

```text
discover-java-process.ps1
```

Comandos:

```powershell
jcmd
```

ou:

```powershell
jps `
  -lv
```

O script lista processos, filtra artifact, exige correspondência única, sanitiza a command line, retorna o PID e bloqueia ambiguidade.

Não reutilize PID antigo.

---

### 17. Coletar um dump com `jcmd`

Script:

```text
capture-thread-dump.ps1
```

Comando:

```powershell
jcmd `
  $pid `
  Thread.print `
  -l
```

`-l` inclui informações adicionais de locks.

Grave em:

```text
.tmp/thread-dumps/
570_<scenario>_<timestamp>_<sequence>.txt
```

Metadados ficam em arquivo separado:

```yaml
pid:
service:
release:
scenario:
tool:
capturedAt:
```

---

### 18. Usar `jstack` como fallback

Comando:

```powershell
jstack `
  -l `
  $pid
```

Use `jstack` quando `jcmd` não estiver disponível e o attach for permitido. Se ambos falharem, valide usuário, permissões, JDK e PID sem forçar ferramenta desconhecida.

---

### 19. Coletar uma série

Script:

```text
capture-thread-dump-series.ps1
```

Exemplo:

```powershell
1..3 |
ForEach-Object {
    .\scripts\observability\thread-dump\capture-thread-dump.ps1 `
      -Pid $pid `
      -Scenario "monitor-contention" `
      -Sequence $_

    Start-Sleep `
      -Seconds 5
}
```

A série usa mesmo PID, cenário e release, com intervalo registrado e timestamps UTC.

---

### 20. Entender o cabeçalho de uma thread

Exemplo conceitual:

```text
"orders-worker-1"
#42
prio=5
os_prio=0
cpu=125.00ms
elapsed=35.12s
tid=0x...
nid=0x...
waiting on condition
[0x...]
```

Campos variam por ferramenta. Interprete nome, daemon, prioridade, CPU, elapsed e estado, sem usar endereços nativos como identidade persistente.

---

### 21. Ler a linha de estado

Exemplo:

```text
java.lang.Thread.State:
BLOCKED
(on object monitor)
```

A linha informa o estado; a stack mostra onde e as linhas de lock mostram:

```text
waiting to lock <0x...>;

locked <0x...>;

parking to wait for <0x...>.
```

A análise combina estado, stack e locks.

---

### 22. Interpretar `BLOCKED`

Exemplo:

```text
"orders-contention-2"
java.lang.Thread.State:
BLOCKED
(on object monitor)

at
MonitorContentionScenario.waitForLock(...)

- waiting to lock <0x00000001>
```

Procure outra thread com:

```text
- locked <0x00000001>
```

Essa é a proprietária do monitor.

Verifique quantidade de waiters, progresso do owner, método que mantém o lock, I/O dentro da região crítica e persistência.

---

### 23. Interpretar `WAITING`

Exemplo:

```text
WAITING
(parking)

at
jdk.internal.misc.Unsafe.park

at
java.util.concurrent.locks.LockSupport.park
```

Pode ser normal em executor, queue, condition, future ou latch. Procure frames como `CompletableFuture.get`, `CountDownLatch.await`, `LinkedBlockingQueue.take` e `FutureTask.get`.

O motivo depende do contexto.

---

### 24. Interpretar `TIMED_WAITING`

Exemplo:

```text
TIMED_WAITING
(sleeping)

at
java.lang.Thread.sleep
```

Outro:

```text
TIMED_WAITING
(parking)

at
ScheduledThreadPoolExecutor$DelayedWorkQueue.take
```

Pode representar scheduler saudável; não marque toda espera temporizada como problema.

---

### 25. Interpretar `RUNNABLE`

`RUNNABLE` pode representar CPU, loop, serialização, JNI, socket, arquivo, DNS ou native poll. Compare stack, CPU, repetição, métricas e latência.

`RUNNABLE` em `SocketDispatcher.read0` difere de loop Java.

---

### 26. Criar parser

Script:

```text
parse-thread-dump.ps1
```

O parser extrai nome, estado, daemon, stack, locks aguardados e possuídos, synchronizers, deadlock, fingerprint, snapshot e timestamp.

A saída temporária fica em `.tmp/thread-dumps/parsed/*.json` e não é versionada.

---

### 27. Criar fingerprint da stack

Fingerprint pode usar:

```text
thread category;

state;

top application frames;

top framework frame;

lock identity normalized.
```

Exclua:

- endereço de memória;
- PID;
- nid;
- timestamp;
- número da thread;
- linha variável quando necessário.

O objetivo é agrupar threads com comportamento equivalente.

---

### 28. Resumir estados

Script:

```text
summarize-thread-states.ps1
```

O resumo conta estados, grupos por prefixo e fingerprint e variação entre snapshots. Contagem isolada não fornece diagnóstico.

---

### 29. Detectar deadlock

Script:

```text
detect-thread-deadlocks.ps1
```

Procure a seção:

```text
Found one Java-level deadlock.
```

Também construa o grafo de threads que aguardam locks possuídos umas pelas outras.

Valide:

- ciclo;
- threads;
- locks;
- stacks;
- owners;
- snapshots.

Deadlock detectado é evidência forte.

---

### 30. Diferenciar deadlock e contenção

Contenção:

```text
thread A possui lock;

thread B aguarda;

thread A eventualmente libera.
```

Deadlock:

```text
thread A aguarda B;

thread B aguarda A;

nenhuma progride.
```

A série temporal diferencia: owner que muda ou libera indica contenção; ciclo persistente indica deadlock.

---

### 31. Analisar contenção

Script:

```text
analyze-monitor-contention.ps1
```

O script agrupa por lock, localiza owner, conta waiters, compara snapshots, calcula persistência e marca I/O dentro do monitor.

O resumo registra lock, owner, waiters, persistência e stack da owner.

---

### 32. Analisar starvation

Script:

```text
analyze-executor-starvation.ps1
```

Starvation combina pool totalmente ocupado, waits em `Future.get`, dependência no mesmo executor, fila não vazia, padrão persistente e throughput baixo.

Compare com `active`, `max`, queue size e completed count; thread dump e métricas juntos fortalecem a conclusão.

---

### 33. Diferenciar starvation e saturação

Saturação:

```text
pool ocupado,
mas tarefas progridem.
```

Starvation:

```text
tarefas aguardam recursos
que dependem do próprio pool,
sem oportunidade de execução.
```

A fila pode crescer em ambos; stack e progresso diferenciam.

---

### 34. Analisar I/O bloqueante

Script:

```text
analyze-blocking-io.ps1
```

Procure socket, HTTP, JDBC, arquivo, DNS, poll e SSL. Valide quantidade, dependência, duração, timeout, progresso, pool e correlação com latência, logs e traces.

I/O bloqueante não é automaticamente defeito; o risco depende de duração, quantidade e pool.

---

### 35. Analisar hotspots `RUNNABLE`

Script:

```text
analyze-runnable-hotspots.ps1
```

Procure stack repetida, CPU alta e método de aplicação em loop, serialização, regex, compressão, hash, parsing ou spin lock.

Classifique como `candidate-cpu-hotspot` e correlacione com CPU e profiling antes de concluir.

---

### 36. Comparar dumps

Script:

```text
compare-thread-dumps.ps1
```

Para cada thread ou fingerprint, compare estado, stack, lock, owner, CPU, aparecimento, desaparecimento e persistência.

Classificações:

```text
progressing;

persistent-wait;

persistent-blocked;

deadlocked;

cpu-candidate;

io-wait-candidate;

idle-normal;

inconclusive.
```

---

### 37. Criar política de comparação

Arquivo:

```text
thread-dump-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  minimumSnapshots:
    3

  sameProcess:
    required

  sameRelease:
    required

  interval:
    recorded:
      required

  progress:
    stackChange:
      signal

    stateChange:
      signal

    lockOwnerChange:
      signal

  persistent:
    sameStateAndStack:
      investigate

  singleSnapshotConclusion:
    restricted
```

Restart entre dumps invalida comparação direta por thread.

---

### 38. Correlacionar com logs

Fluxo:

1. localizar janela de lentidão;
2. identificar thread pool;
3. observar stacks;
4. buscar logs do mesmo período;
5. validar dependency;
6. validar timeout;
7. validar release;
8. localizar primeira falha;
9. comparar recuperação.

Logs mostram eventos; thread dump mostra execução naquele instante.

---

### 39. Correlacionar com métricas

Métricas úteis incluem CPU, threads, executor active e queue, JDBC active e max, latência, throughput e erros.

Exemplo:

```text
executor active = max;

queue crescente;

throughput zero;

dumps mostram Future.get
nas duas threads.
```

Esse conjunto sustenta starvation.

---

### 40. Correlacionar com traces

Trace mostra uma operação lenta.

Thread dump mostra onde as threads estão.

Exemplo:

```text
trace:
payment span com 10s.

thread dump:
várias threads em socket read
no payment client.

logs:
timeout após 10s.
```

As três fontes convergem.

---

### 41. Criar política de deadlock

Arquivo:

```text
thread-deadlock-policy.yaml
```

Conteúdo:

```yaml
deadlock:
  javaLevel:
    severity:
      critical

  response:
    required:
      - capture-multiple-dumps
      - preserve-evidence
      - identify-lock-cycle
      - stop-new-risky-changes
      - evaluate-restart
      - create-defect

  restart:
    mitigationOnly:
      true

  rootFix:
    required:
      lock-order-or-design-change

  productionSimulation:
    forbidden
```

Restart remove o sintoma, mas não corrige a ordem de locks.

---

### 42. Criar política de contenção

Arquivo:

```text
thread-contention-policy.yaml
```

Conteúdo:

```yaml
contention:
  evaluate:
    - waiters
    - owner
    - persistence
    - critical-section
    - io-inside-lock
    - throughput-impact

  mitigation:
    reversible:
      preferred

  designOptions:
    - reduce-critical-section
    - move-io-outside-lock
    - partition-lock
    - immutable-snapshot
    - concurrent-structure

  correctness:
    neverSacrifice:
      true
```

Performance não justifica remover sincronização sem preservar correção.

---

### 43. Criar política de starvation

Arquivo:

```text
thread-starvation-policy.yaml
```

Conteúdo:

```yaml
starvation:
  indicators:
    - all-workers-occupied
    - dependent-tasks-same-pool
    - queue-not-empty
    - no-completion-progress
    - repeated-wait-stacks

  mitigation:
    - separate-executors
    - avoid-blocking-on-same-pool
    - bound-concurrency
    - backpressure

  increasePoolSize:
    automatic:
      forbidden
```

Aumentar o pool pode apenas adiar o problema.

---

### 44. Criar política de I/O

Arquivo:

```text
thread-io-policy.yaml
```

Conteúdo:

```yaml
io:
  evaluate:
    - operation
    - dependency
    - timeout
    - pool
    - thread-count
    - persistence
    - fallback
    - cancellation

  blockingOnRequestThreads:
    risk:
      highWhenSustained

  timeoutIncrease:
    requiresEvidence:
      true

  asyncMigration:
    notAutomatic:
      true
```

Migrar para async sem entender o domínio pode criar novos problemas.

---

### 45. Criar política de CPU

Arquivo:

```text
thread-cpu-policy.yaml
```

Conteúdo:

```yaml
cpu:
  highProcessCpu:
    correlateWith:
      - runnable-stacks
      - repeated-snapshots
      - operating-system-thread-data

  candidate:
    repeatedApplicationStack:
      required

  confirmation:
    profiler:
      recommended

  threadDumpAlone:
    definitive:
      false
```

Thread dump sugere hotspot; profiler confirma com maior precisão.

---

### 46. Criar política de qualidade

Arquivo:

```text
thread-dump-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  truncatedDump:
    result:
      partial

  missingMetadata:
    result:
      inconclusive

  mixedPid:
    action:
      block-comparison

  processRestarted:
    action:
      split-series

  captureIntervalUnknown:
    result:
      limited

  parserFailure:
    action:
      preserve-raw-temporary-and-investigate

  attachFailure:
    result:
      no-evidence
```

A qualidade do dump afeta a conclusão.

---

### 47. Criar política de segurança

Arquivo:

```text
thread-dump-security-policy.yaml
```

Conteúdo:

```yaml
security:
  rawDump:
    repository:
      forbidden

  threadNames:
    businessIdentifiers:
      forbidden

  stackFrames:
    internalPaths:
      evidence:
        summarize

  commandLine:
    credentials:
      redact

  production:
    capture:
      requiresAuthorization

  sharing:
    external:
      forbiddenInLaboratory
```

Thread dumps expõem nomes, classes, paths, argumentos e bibliotecas; trate-os como artifacts sensíveis.

---

### 48. Criar failure policy

Arquivo:

```text
thread-dump-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  processNotFound:
    action:
      rediscover-pid

  ambiguousProcess:
    action:
      block-capture

  jcmdUnavailable:
    action:
      try-jstack

  attachDenied:
    action:
      validate-user-and-permissions

  emptyDump:
    action:
      block-analysis

  deadlockDetected:
    action:
      preserve-evidence-and-escalate

  unsafeScenario:
    action:
      stop-laboratory

  heapAnalysis:
    deferredToLesson571
```

---

### 49. Criar cenários

Arquivo:

```text
thread-dump-scenarios.yaml
```

Cenários:

```text
normal-waiting;

timed-waiting;

monitor-contention;

java-deadlock;

executor-starvation;

blocking-io;

cpu-loop;

process-restart-between-dumps;

truncated-dump;

attach-failure.
```

Cada cenário registra setup, duração, PID, snapshots, estado, stack, locks, conclusão, cleanup e evidence.

---

### 50. Simular espera normal

Colete três dumps e confirme thread `WAITING`, stack esperada, ausência de waiters problemáticos e classificação `idle-normal`, evitando falso positivo.

---

### 51. Simular contenção

Mantenha um monitor por tempo controlado, inicie waiters e colete três dumps. Confirme owner, múltiplas `BLOCKED`, mesmo lock, persistência e recuperação após liberação.

---

### 52. Simular deadlock

Execute em processo descartável e confirme seção de deadlock, threads, locks, ciclo, stacks e persistência. Encerre o processo sem tentar liberar monitores por técnica insegura.

---

### 53. Simular starvation

Use executor pequeno com tarefas dependentes do mesmo pool. Combine dumps, métricas, fila, completions e logs para confirmar workers aguardando, fila não vazia, ausência de progresso e `executor-starvation`.

---

### 54. Simular I/O

Use servidor fake sem resposta, colete três dumps e confirme threads em read, dependência, persistência, timeout, ausência de conclusão e recuperação. Classifique como `io-wait-candidate`.

---

### 55. Simular loop de CPU

Inicie loop limitado, observe CPU e colete três dumps. Confirme thread `RUNNABLE`, stack repetida, CPU elevada, parada pela flag e classificação `candidate-cpu-hotspot`.

---

### 56. Criar matriz de testes

Arquivo:

```text
THREAD_DUMP_TEST_MATRIX.md
```

Cenários:

- ferramentas disponíveis;
- PID único;
- metadata;
- `jcmd`;
- `jstack`;
- três snapshots;
- waiting normal;
- timed waiting;
- blocked;
- lock owner;
- deadlock;
- ownable synchronizer;
- executor starvation;
- queue backlog;
- blocking I/O;
- runnable loop;
- parser;
- fingerprints;
- state summary;
- comparison;
- process restart;
- truncated dump;
- attach failure;
- sensitive scan;
- evidence sanitizada.

---

### 57. Criar troubleshooting

Arquivo:

```text
THREAD_DUMP_TROUBLESHOOTING.md
```

Inclua:

- `jcmd` não encontrado;
- `jstack` não encontrado;
- PID incorreto;
- vários processos iguais;
- attach denied;
- processo termina durante captura;
- arquivo vazio;
- dump truncado;
- encoding;
- parser falha;
- endereço de lock muda;
- thread name muda;
- deadlock section ausente;
- `RUNNABLE` interpretado como CPU;
- `WAITING` interpretado como problema;
- restart entre snapshots;
- cenário não finaliza;
- dump bruto entrou no Git;
- heap dump antecipado.

---

### 58. Coletar evidence

Script:

```text
collect-thread-dump-evidence.ps1
```

Arquivo:

```text
thread-dump-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release, ferramentas, quantidade e intervalo dos snapshots e status de estados, deadlock, contenção, starvation, I/O, CPU, comparação, qualidade, segurança, cenários e testes.

Não inclua:

- dumps brutos;
- endereços de memória;
- PID real na evidence final;
- paths internos completos;
- command line completa;
- credentials;
- dados pessoais;
- IDs de negócio.

---

### 59. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\thread-dump\validate-thread-dump-tools.ps1

.\scripts\observability\thread-dump\discover-java-process.ps1

.\scripts\observability\thread-dump\capture-thread-dump-series.ps1

.\scripts\observability\thread-dump\parse-thread-dump.ps1

.\scripts\observability\thread-dump\summarize-thread-states.ps1

.\scripts\observability\thread-dump\detect-thread-deadlocks.ps1

.\scripts\observability\thread-dump\analyze-monitor-contention.ps1

.\scripts\observability\thread-dump\analyze-executor-starvation.ps1

.\scripts\observability\thread-dump\analyze-blocking-io.ps1

.\scripts\observability\thread-dump\analyze-runnable-hotspots.ps1

.\scripts\observability\thread-dump\compare-thread-dumps.ps1

.\scripts\observability\thread-dump\scan-thread-dump-output.ps1

.\scripts\observability\thread-dump\simulate-thread-dump-scenarios.ps1

.\scripts\observability\thread-dump\collect-thread-dump-evidence.ps1

.\scripts\observability\thread-dump\verify-thread-dump-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- ferramentas aprovadas;
- PID aprovado;
- snapshots completos;
- estados analisados;
- fingerprints estáveis;
- deadlock detectado no cenário;
- contenção analisada;
- starvation analisada;
- I/O analisado;
- CPU candidate analisado;
- comparação aprovada;
- qualidade aprovada;
- dados sensíveis ausentes;
- evidence sanitizada;
- heap dump não antecipado.

---

### 60. Encerrar o laboratório

Pare cenários e processos descartáveis. Remova apenas os arquivos temporários:

```powershell
Remove-Item `
  .tmp/thread-dumps `
  -Recurse `
  -Force
```

Antes, confirme o path, colete evidence e preserve scripts, docs e configuração. Não execute limpeza global.

---

## Entendendo o que foi feito

### O diagnóstico ganhou visão interna

Logs mostravam eventos.

Thread dumps mostraram execução.

### Estados ganharam contexto

`RUNNABLE`, `BLOCKED`, `WAITING` e `TIMED_WAITING` deixaram de ser julgados isoladamente.

### Locks ganharam ownership

Waiters e owners puderam ser relacionados.

### Deadlock ganhou prova estrutural

O ciclo de locks passou a ser identificado.

### Contenção ganhou persistência

Múltiplos snapshots mostraram se o lock era temporário ou problemático.

### Executors ganharam análise

Pool ocupado deixou de ser confundido com starvation.

### I/O ganhou distinção

`RUNNABLE` em leitura nativa deixou de significar automaticamente CPU.

### Hotspots ganharam candidatos

Stacks repetidas com CPU alta passaram a orientar profiling.

### Evidence ganhou proteção

Dumps brutos permaneceram temporários.

### A próxima aula ganhou fronteira

Heap dump irá investigar objetos, retenção e vazamento de memória.

---

## Erros comuns importantes

### Concluir por um único dump

O snapshot pode capturar um estado transitório.

### Tratar `RUNNABLE` como CPU alta

A thread pode estar em I/O nativo.

### Tratar toda `WAITING` como problema

Pools ociosos aguardam trabalho normalmente.

### Contar apenas estados

A stack e os locks fornecem significado.

### Confundir contenção com deadlock

Na contenção, o owner pode progredir.

### Aumentar pool diante de starvation

A dependência circular pode permanecer.

### Reiniciar sem preservar dumps

A evidência do bloqueio é perdida.

### Versionar dump bruto

Paths e detalhes internos podem ser expostos.

### Capturar processo errado

A análise se torna inválida.

### Antecipar heap dump

Objetos e retained size pertencem à aula 571.

---

## Comandos úteis

### Listar processos Java

```powershell
jcmd
```

### Capturar com `jcmd`

```powershell
jcmd `
  <PID> `
  Thread.print `
  -l
```

### Capturar com `jstack`

```powershell
jstack `
  -l `
  <PID>
```

### Capturar série

```powershell
.\scripts\observability\thread-dump\capture-thread-dump-series.ps1
```

### Comparar dumps

```powershell
.\scripts\observability\thread-dump\compare-thread-dumps.ps1
```

---

## Exercício guiado

### Parte 1 — Tools

Valide `jcmd`, `jstack` e PID.

### Parte 2 — Baseline

Capture threads em comportamento normal.

### Parte 3 — States

Classifique estados e stacks.

### Parte 4 — Contention

Encontre owner e waiters.

### Parte 5 — Deadlock

Identifique o ciclo de locks.

### Parte 6 — Starvation

Relacione pool, fila e stacks.

### Parte 7 — I/O e CPU

Diferencie leitura nativa e loop.

### Parte 8 — Series

Compare três snapshots.

### Parte 9 — Correlation

Relacione dumps a logs, métricas e traces.

### Parte 10 — Gate

Execute cenários, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 569 e ponte para a aula 571 foram preservadas;
- thread, thread dump, `NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING`, `TERMINATED`, monitor, lock owner, ownable synchronizer, contention, deadlock, starvation, thread pool, queue backlog, snapshot series e progress signature foram definidos;
- baseline do laboratório foi validada;
- `jcmd`, `jstack` e `jps` foram verificados;
- contrato de thread dump foi criado;
- política de captura foi criada;
- mínimo de três snapshots foi definido;
- metadata de captura foi definida;
- dumps brutos não entram no Git;
- política de nomes foi criada;
- custom executors usam nomes estáveis;
- IDs de negócio são proibidos em nomes;
- profile de diagnóstico é isolado;
- duração e concorrência são limitadas;
- registro de cenários foi criado;
- endpoint interno é restrito;
- cenário de espera normal foi criado;
- cenário de timed waiting foi criado;
- cenário de contenção foi criado;
- cenário de deadlock foi criado;
- cenário de starvation foi criado;
- cenário de I/O foi criado;
- cenário de CPU foi criado;
- política de estados foi criada;
- conclusão por estado isolado é proibida;
- descoberta de PID bloqueia ambiguidade;
- captura por `jcmd Thread.print -l` foi documentada;
- `jstack -l` foi definido como fallback;
- série de dumps usa mesmo PID e release;
- `BLOCKED` foi analisado com owner;
- `WAITING` foi analisado pelo contexto;
- `TIMED_WAITING` foi analisado pelo timeout;
- `RUNNABLE` foi diferenciado entre CPU e I/O;
- parser foi criado;
- fingerprint da stack foi criado;
- endereços e IDs dinâmicos são removidos;
- resumo de estados foi criado;
- deadlock foi detectado por seção e grafo;
- deadlock e contenção foram diferenciados;
- análise de starvation foi criada;
- starvation e saturação foram diferenciadas;
- análise de hotspots `RUNNABLE` foi criada;
- política de comparação foi criada;
- restart entre snapshots invalida série contínua;
- correlação com logs foi documentada;
- correlação com métricas foi documentada;
- política de deadlock foi criada;
- restart foi tratado apenas como mitigação;
- política de contenção foi criada;
- correção não é sacrificada por performance;
- política de starvation foi criada;
- aumento automático do pool é proibido;
- política de I/O foi criada;
- aumento de timeout exige evidência;
- política de CPU foi criada;
- thread dump não foi tratado como profiler definitivo;
- política de qualidade foi criada;
- mixed PID bloqueia comparação;
- política de segurança foi criada;
- captura de produção exige autorização;
- failure policy foi criada;
- cenários foram catalogados;
- deadlock foi simulado em processo descartável;
- starvation foi simulada;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, dado pessoal, processo real ou dump bruto foi commitado;
- heap dump não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/thread-dump `
  scripts/observability/thread-dump `
  docs/observability/thread-dump `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|\.tmp/thread-dumps|Thread\.print.*[0-9]+"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar diagnostico por thread dump"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- thread dumps brutos;
- PIDs reais;
- endereços de memória;
- command lines completas;
- credentials;
- IDs de negócio;
- arquivos temporários;
- heap dumps;
- material da aula 571.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a observar o estado interno das threads da JVM.

Você trabalhou com:

```text
jcmd;

jstack;

thread states;

stacks;

monitors;

lock owners;

contention;

deadlocks;

starvation;

I/O;

CPU candidates;

snapshot series.
```

Você comprovou que um thread dump é um snapshot; múltiplos dumps revelam progresso ou persistência; `RUNNABLE` pode representar CPU ou I/O; `WAITING` pode ser normal; `BLOCKED` exige localizar o owner; contenção não é deadlock; starvation não é apenas pool ocupado; deadlocks formam ciclos; stacks repetidas precisam ser correlacionadas com CPU; executors exigem análise de fila e completions; e dumps brutos são artifacts sensíveis e temporários.

A próxima aula será:

```text
571 - M18.16 - Heap dump
```

Nela, você irá coletar e analisar snapshots do heap, identificar classes dominantes, retained size, dominator tree, GC roots, referências e candidatos a vazamento de memória.

Nenhuma coleta ou análise de heap dump, arquivo `.hprof`, dominator tree, retained size, GC root ou vazamento de objetos foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei ferramentas e PID.
- [ ] Capturei série de snapshots.
- [ ] Classifiquei estados.
- [ ] Identifiquei owner e waiters.
- [ ] Detectei deadlock.
- [ ] Analisei starvation, I/O e CPU.
- [ ] Correlacionei com telemetria.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### `jcmd` não lista o processo

Confirme usuário, JDK, PID e permissões de attach.

### O processo aparece várias vezes

Filtre por artifact, porta, release e command line sanitizada.

### O dump está vazio

Revise attach, redirecionamento, encoding e processo ativo.

### Todas as threads aparecem `WAITING`

Agrupe por nome e stack; pools ociosos podem estar normais.

### Muitas threads estão `BLOCKED`

Localize lock, owner e persistência em vários dumps.

### Deadlock não aparece na seção final

Construa o grafo de waits e confirme o ciclo.

### `RUNNABLE` foi interpretado como hotspot

Correlacione com CPU e stack repetida.

### A série usa PIDs diferentes

Separe os snapshots por processo.

### O dump entrou no Git

Remova do índice, apague o temporário e revise `.gitignore`.

### A análise começou a contar objetos

Preserve essa investigação para a aula 571.

---

## Perguntas de revisão

1. O que é thread dump?
2. O que significa `RUNNABLE`?
3. O que significa `BLOCKED`?
4. O que significa `WAITING`?
5. O que significa `TIMED_WAITING`?
6. O que é monitor?
7. O que é lock owner?
8. O que é contention?
9. O que é deadlock?
10. O que é starvation?
11. Por que coletar vários dumps?
12. Como diferenciar contenção e deadlock?
13. Como identificar starvation?
14. Por que `RUNNABLE` pode ser I/O?
15. Como identificar hotspot candidato?
16. Por que nomear threads?
17. Como correlacionar com métricas?
18. Por que não versionar dumps?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Snapshot das threads.
2. Executável ou em operação nativa.
3. Aguardando monitor.
4. Aguardando sem timeout.
5. Aguardando com timeout.
6. Lock de `synchronized`.
7. Thread que possui o lock.
8. Disputa por recurso.
9. Ciclo de espera.
10. Falta de oportunidade de progresso.
11. Identificar persistência.
12. Verificar se owner progride.
13. Pool ocupado, fila e dependência circular.
14. Leitura nativa aparece RUNNABLE.
15. Stack repetida com CPU alta.
16. Facilitar diagnóstico.
17. Comparar pools, filas, CPU e throughput.
18. Artifact sensível.
19. Heap dump.
20. Heap dump.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 570 - M18.15 - Thread dump

- Continuei após Troubleshooting por logs.
- Entendi thread dump como snapshot da execução da JVM.
- Validei `jcmd`, `jstack` e `jps`.
- Criei contrato e política de captura.
- Defini coleta de pelo menos três snapshots.
- Criei política de nomes de threads.
- Isolei cenários no profile de diagnóstico.
- Criei cenários de espera normal e temporizada.
- Criei cenário de contenção por monitor.
- Criei cenário de deadlock em processo descartável.
- Criei cenário de executor starvation.
- Criei cenário de I/O bloqueante.
- Criei cenário de loop de CPU controlado.
- Estudei estados `NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING` e `TERMINATED`.
- Aprendi a descobrir o PID com segurança.
- Capturei dumps com `jcmd Thread.print -l`.
- Usei `jstack -l` como fallback.
- Criei parser e fingerprints de stacks.
- Resumi estados por grupo e snapshot.
- Detectei deadlocks por seção e grafo de locks.
- Diferenciei contenção e deadlock.
- Analisei owner, waiters e persistência.
- Diferenciei starvation e saturação.
- Analisei I/O nativo em threads `RUNNABLE`.
- Identifiquei hotspots candidatos com stacks repetidas e CPU.
- Comparei dumps para identificar progresso.
- Correlacionei threads com logs, métricas e traces.
- Criei políticas de deadlock, contenção, starvation, I/O, CPU, qualidade e segurança.
- Executei cenários controlados.
- Coletei evidence sanitizada.
- Não antecipei heap dump.
- Próxima aula: Heap dump.
```

---

## Referência técnica curta

- Java Thread Dumps.
- `jcmd Thread.print`.
- `jstack`.
- Java Thread States.
- Java Monitors.
- Ownable Synchronizers.
- Deadlock Detection.
- Executor Starvation.
- Blocking I/O.
- Thread Dump Comparison.

Regra final:

```text
diagnóstico por thread dump precisa combinar múltiplos snapshots, estados, stacks, locks e progresso: jcmd Thread.print -l é a coleta preferida e jstack -l é fallback, o PID, serviço, release, cenário e intervalo são registrados e dumps brutos permanecem temporários; RUNNABLE pode representar CPU ou I/O, WAITING e TIMED_WAITING podem ser normais, BLOCKED exige localizar owner e waiters, contenção é diferenciada de deadlock pela capacidade de progresso e starvation é confirmada pela combinação de pool ocupado, fila, tarefas dependentes e ausência de completions; fingerprints removem endereços e valores dinâmicos, séries com restart ou PIDs diferentes são separadas, deadlocks preservam evidence antes da mitigação e thread dump sozinho não substitui profiler, logs, métricas ou traces; segurança, autorização e cleanup específico são obrigatórios, deixando para a aula 571 a coleta e análise de heap dumps, objetos dominantes, retained size, dominator tree, GC roots e candidatos a vazamento.
```
