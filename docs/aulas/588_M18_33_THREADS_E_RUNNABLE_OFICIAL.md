# 588 - M18.33 - Threads e Runnable

## Apresentação da aula

Na aula 587, você construiu a base conceitual da concorrência Java clássica.

Você trabalhou com:

```text
processo;

thread;

task;

concorrência;

paralelismo;

interleaving;

ownership;

atomicidade;

visibilidade;

ordenação;

safety;

liveness;

blocking;

cancelamento;

shutdown.
```

Também criou um simulador determinístico para demonstrar que duas operações corretas isoladamente podem produzir um resultado incorreto quando suas etapas são intercaladas.

Até agora, porém, nenhuma thread real foi criada.

Nesta aula, você irá trabalhar diretamente com:

```java
Thread
```

e:

```java
Runnable
```

A pergunta central será:

```text
como criar,
iniciar,
acompanhar,
interromper
e encerrar

uma thread de plataforma

sem perder
exceções,
controle,
observabilidade
ou shutdown?
```

Uma thread representa um fluxo de execução dentro do processo Java.

Um `Runnable` representa uma unidade de trabalho que pode ser executada por uma thread.

Essa separação é importante:

```text
Thread:
mecanismo de execução.

Runnable:
trabalho a executar.
```

Quando uma aplicação mistura os dois papéis, o código fica mais difícil de:

- testar;
- nomear;
- monitorar;
- cancelar;
- reutilizar;
- substituir;
- migrar para pools;
- migrar para outros modelos de concorrência.

Nesta aula, você utilizará somente **threads de plataforma**.

Não serão usadas virtual threads.

Você irá observar o lifecycle:

```text
NEW;

RUNNABLE;

BLOCKED;

WAITING;

TIMED_WAITING;

TERMINATED.
```

Também irá compreender a diferença entre:

```java
thread.run();
```

e:

```java
thread.start();
```

Essa diferença é crítica.

Chamar `run()` diretamente executa o método na thread atual.

Chamar `start()` solicita à JVM a criação do novo fluxo e, nesse fluxo, o método `run()` será executado.

Exemplo:

```text
main chama run():
o trabalho continua na main.

main chama start():
o trabalho ocorre em outra thread.
```

Você também trabalhará com:

- nomes de thread;
- `Thread.currentThread()`;
- `Thread.State`;
- `start()`;
- `run()`;
- `join()`;
- `sleep()`;
- interruption;
- flag de interrupção;
- `InterruptedException`;
- restauração da interrupção;
- daemon versus non-daemon;
- `UncaughtExceptionHandler`;
- timeout de espera;
- shutdown cooperativo;
- recursos em `try/finally`;
- logs sanitizados;
- testes determinísticos.

A aula não irá usar `ExecutorService`.

Não serão implementados:

- `Executors.newFixedThreadPool`;
- `ThreadPoolExecutor`;
- filas de executor;
- `submit`;
- `invokeAll`;
- `shutdown` de pool;
- `awaitTermination` de pool;
- rejection policy;
- pool sizing;
- workers reutilizáveis.

Esses assuntos pertencem à próxima aula oficial:

```text
589 - M18.34 - ExecutorService pools
```

A regra central será:

```text
uma thread criada
precisa ter

nome,
owner,
trabalho,
término,
tratamento de falha,
interrupção
e shutdown.
```

---

## Onde estamos na formação

A sequência imediata é:

```text
587:
Concorrencia Java classica.

588:
Threads e Runnable.

589:
ExecutorService pools.

590:
CompletableFuture.
```

A progressão é:

```text
entender concorrência;

criar threads e tasks;

reutilizar workers em pools;

compor tarefas assíncronas.
```

Nesta aula:

```text
Thread:
sim.

Runnable:
sim.

platform thread:
sim.

start:
sim.

run:
sim.

join:
sim.

sleep:
sim.

interrupt:
sim.

UncaughtExceptionHandler:
sim.

daemon:
sim.

lifecycle:
sim.

thread states:
sim.

shutdown cooperativo:
sim.

ExecutorService:
não.

pool:
não.

CompletableFuture:
não.

virtual thread:
não.

locks:
não.
```

Você reutilizará:

- ownership;
- invariantes;
- safety;
- liveness;
- cancellation;
- shutdown;
- thread dumps;
- JFR;
- métricas;
- logs;
- testes determinísticos.

A implementação precisa preservar:

- término;
- propagação de falhas;
- interrupção;
- liberação de recursos;
- observabilidade;
- ausência de estado global desnecessário;
- capacidade de teste.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/threads-runnable
├── threads-runnable-contract.yaml
├── thread-lifecycle-policy.yaml
├── thread-naming-policy.yaml
├── thread-interruption-policy.yaml
├── thread-exception-policy.yaml
├── thread-daemon-policy.yaml
├── thread-shutdown-policy.yaml
├── thread-observability-policy.yaml
├── thread-data-quality-policy.yaml
├── thread-security-policy.yaml
├── thread-failure-policy.yaml
├── threads-runnable-scenarios.yaml
└── threads-runnable-evidence.yaml

concurrency/threads-runnable/src/main/java
└── br/com/formacao/concurrency/threads
    ├── ThreadEvent.java
    ├── ThreadEventRecorder.java
    ├── NamedRunnable.java
    ├── LifecycleProbe.java
    ├── InterruptibleWorker.java
    ├── CooperativeWorker.java
    ├── WorkerStopSignal.java
    ├── RecordingUncaughtExceptionHandler.java
    ├── ThreadJoinResult.java
    ├── ThreadJoiner.java
    ├── PlatformThreadFactory.java
    └── ThreadsRunnableDemo.java

concurrency/threads-runnable/src/test/java
└── br/com/formacao/concurrency/threads
    ├── NamedRunnableTest.java
    ├── ThreadStartVsRunTest.java
    ├── ThreadLifecycleTest.java
    ├── ThreadJoinerTest.java
    ├── InterruptibleWorkerTest.java
    ├── CooperativeWorkerTest.java
    ├── UncaughtExceptionHandlerTest.java
    └── ThreadShutdownTest.java

concurrency/threads-runnable/reports
├── thread-baseline-report.yaml
├── thread-lifecycle-report.yaml
├── thread-interruption-report.yaml
├── thread-exception-report.yaml
├── thread-shutdown-report.yaml
└── thread-gate-report.yaml

scripts/concurrency/threads-runnable
├── validate-threads-runnable-contract.ps1
├── run-thread-start-vs-run.ps1
├── run-thread-lifecycle-scenarios.ps1
├── validate-thread-names.ps1
├── validate-thread-interruption.ps1
├── validate-thread-exception-handler.ps1
├── validate-thread-daemon-policy.ps1
├── validate-thread-shutdown.ps1
├── collect-thread-dump-snapshot.ps1
├── scan-thread-output.ps1
├── collect-threads-runnable-evidence.ps1
└── verify-threads-runnable-baseline.ps1

docs/concurrency/threads-runnable
├── THREADS_AND_RUNNABLE_OVERVIEW.md
├── THREAD_START_VS_RUN.md
├── THREAD_LIFECYCLE.md
├── THREAD_NAMING.md
├── INTERRUPTION_GUIDE.md
├── UNCAUGHT_EXCEPTIONS.md
├── DAEMON_THREADS.md
├── THREAD_SHUTDOWN.md
├── THREADS_RUNNABLE_TEST_MATRIX.md
└── THREADS_RUNNABLE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de threads;

Runnable testável;

threads nomeadas;

lifecycle observado;

join com timeout;

interruption cooperativa;

handler de exceção;

daemon policy;

shutdown;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### `Runnable`

Interface funcional que representa trabalho sem valor de retorno declarado.

```java
@FunctionalInterface
public interface Runnable {
    void run();
}
```

---

### `Thread`

Objeto Java que representa uma thread e controla seu lifecycle.

---

### Platform thread

Thread Java tradicional associada ao mecanismo de threads do sistema operacional.

---

### `run()`

Método que contém o trabalho.

Chamado diretamente, executa na thread atual.

---

### `start()`

Inicia uma nova thread e causa a execução de `run()` nesse novo fluxo.

---

### Thread name

Nome operacional usado em logs, dumps e diagnóstico.

---

### `join()`

Faz a thread atual aguardar o término de outra thread.

---

### `sleep()`

Suspende a thread atual por um intervalo e pode lançar `InterruptedException`.

---

### Interrupt

Sinal cooperativo de que uma thread deve observar um pedido de interrupção.

---

### Interrupt flag

Estado de interrupção associado à thread.

---

### `InterruptedException`

Exceção lançada por operações bloqueantes interrompíveis.

---

### Daemon thread

Thread que não impede sozinha o encerramento da JVM.

---

### Non-daemon thread

Thread que mantém a JVM viva enquanto não termina.

---

### Uncaught exception

Exceção que sai do método `run()` sem tratamento.

---

### `UncaughtExceptionHandler`

Callback acionado quando uma thread termina por exceção não capturada.

---

### Lifecycle

Sequência de estados desde `NEW` até `TERMINATED`.

---

### Cooperative shutdown

Encerramento em que a task observa sinais, libera recursos e termina voluntariamente.

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

- aula 587 validada;
- simulador determinístico preservado;
- nenhum pool existente será reutilizado;
- nenhuma virtual thread será criada;
- todos os testes usarão tempos bounded;
- nenhuma thread ficará viva após o teste.

---

### 2. Criar contrato

Arquivo:

```text
threads-runnable-contract.yaml
```

Conteúdo:

```yaml
threads:
  required:
    - owner
    - runnable
    - name
    - daemon-policy
    - exception-handler
    - interruption-policy
    - join-policy
    - shutdown-policy
    - observability

  creation:
    platformThreadOnly:
      true

  tests:
    noLeakedThreads:
      required

  forbiddenInLesson588:
    - ExecutorService
    - ThreadPoolExecutor
    - CompletableFuture
    - virtualThread

  nextLesson:
    code:
      M18.34
```

---

### 3. Criar evento de observação

Crie:

```java
public record ThreadEvent(
        String category,
        String threadName,
        Thread.State state,
        Instant occurredAt) {

    public ThreadEvent {
        Objects.requireNonNull(category);
        Objects.requireNonNull(threadName);
        Objects.requireNonNull(state);
        Objects.requireNonNull(occurredAt);
    }
}
```

Não registre dados de negócio.

---

### 4. Criar recorder thread-safe

Para não antecipar locks e atomics, use uma coleção pronta:

```java
public final class ThreadEventRecorder {

    private final List<ThreadEvent> events =
            Collections.synchronizedList(
                    new ArrayList<>());

    public void record(String category) {
        Thread current =
                Thread.currentThread();

        events.add(
                new ThreadEvent(
                        category,
                        current.getName(),
                        current.getState(),
                        Instant.now()));
    }

    public List<ThreadEvent> snapshot() {
        synchronized (events) {
            return List.copyOf(events);
        }
    }
}
```

O uso detalhado de sincronização será aprofundado na aula 592.

Aqui, você utiliza uma abstração pronta para tornar o recorder seguro.

---

### 5. Criar `NamedRunnable`

```java
public final class NamedRunnable
        implements Runnable {

    private final String operation;
    private final ThreadEventRecorder recorder;

    public NamedRunnable(
            String operation,
            ThreadEventRecorder recorder) {
        this.operation =
                Objects.requireNonNull(operation);
        this.recorder =
                Objects.requireNonNull(recorder);
    }

    @Override
    public void run() {
        recorder.record(
                "START:" + operation);

        try {
            perform();
            recorder.record(
                    "SUCCESS:" + operation);
        } finally {
            recorder.record(
                    "FINISH:" + operation);
        }
    }

    private void perform() {
        // Trabalho sintético e bounded.
    }
}
```

O `Runnable` não cria sua própria thread.

---

### 6. Testar o `Runnable` diretamente

```java
@Test
void shouldRunTaskInCurrentTestThread() {
    ThreadEventRecorder recorder =
            new ThreadEventRecorder();

    Runnable task =
            new NamedRunnable(
                    "direct-run",
                    recorder);

    String testThread =
            Thread.currentThread().getName();

    task.run();

    assertTrue(
            recorder.snapshot()
                    .stream()
                    .allMatch(
                            event ->
                                    event.threadName()
                                            .equals(testThread)));
}
```

Isso demonstra que `Runnable` pode ser testado sem concorrência.

---

### 7. Criar política de naming

Arquivo:

```text
thread-naming-policy.yaml
```

Conteúdo:

```yaml
naming:
  required:
    true

  include:
    - component
    - purpose
    - sequence-or-category

  forbidden:
    - customer-id
    - order-id
    - email
    - token
    - random-unbounded-value

  examples:
    allowed:
      - orders-status-worker-01
      - cache-refresh-lab-01
      - shutdown-demo-worker
```

Nomes ajudam em:

- logs;
- thread dump;
- JFR;
- JMC;
- troubleshooting;
- correlação.

---

### 8. Criar factory de platform thread

A factory ainda não é um pool.

```java
public final class PlatformThreadFactory {

    private final String prefix;
    private int sequence;

    public PlatformThreadFactory(
            String prefix) {
        this.prefix =
                Objects.requireNonNull(prefix);
    }

    public Thread newThread(
            Runnable runnable) {

        sequence++;

        Thread thread =
                new Thread(
                        runnable,
                        prefix
                                + "-"
                                + String.format(
                                        "%02d",
                                        sequence));

        thread.setDaemon(false);

        return thread;
    }
}
```

A factory será usada somente de forma sequencial no laboratório.

O contador não será chamado concorrentemente.

---

### 9. Demonstrar `run()` versus `start()`

```java
ThreadEventRecorder recorder =
        new ThreadEventRecorder();

Runnable task =
        new NamedRunnable(
                "start-vs-run",
                recorder);

Thread thread =
        new Thread(
                task,
                "orders-demo-01");

thread.run();
```

Nesse caso, o trabalho executa na thread chamadora.

Agora:

```java
Thread thread =
        new Thread(
                task,
                "orders-demo-02");

thread.start();
thread.join();
```

O trabalho executa em `orders-demo-02`.

---

### 10. Criar teste `start` versus `run`

```java
@Test
void runShouldUseCurrentThreadAndStartShouldUseNewThread()
        throws InterruptedException {

    ThreadEventRecorder directRecorder =
            new ThreadEventRecorder();

    Thread direct =
            new Thread(
                    new NamedRunnable(
                            "direct",
                            directRecorder),
                    "unused-name");

    String current =
            Thread.currentThread().getName();

    direct.run();

    assertTrue(
            directRecorder.snapshot()
                    .stream()
                    .allMatch(
                            event ->
                                    event.threadName()
                                            .equals(current)));

    ThreadEventRecorder startedRecorder =
            new ThreadEventRecorder();

    Thread started =
            new Thread(
                    new NamedRunnable(
                            "started",
                            startedRecorder),
                    "actual-worker");

    started.start();
    started.join();

    assertTrue(
            startedRecorder.snapshot()
                    .stream()
                    .allMatch(
                            event ->
                                    event.threadName()
                                            .equals("actual-worker")));
}
```

---

### 11. Entender que `start()` só pode ocorrer uma vez

```java
Thread thread =
        new Thread(
                () -> {
                },
                "single-start");

thread.start();
thread.join();

thread.start();
```

A segunda chamada lança:

```text
IllegalThreadStateException.
```

Uma thread terminada não pode ser reiniciada.

Crie outra `Thread` para uma nova execução.

---

### 12. Criar policy de lifecycle

Arquivo:

```text
thread-lifecycle-policy.yaml
```

Conteúdo:

```yaml
lifecycle:
  states:
    - NEW
    - RUNNABLE
    - BLOCKED
    - WAITING
    - TIMED_WAITING
    - TERMINATED

  stateObservation:
    sampling:
      true

  exactTransientState:
    cannotBeAssumed:
      true

  startOnce:
    required

  leakedThreadAfterTest:
    forbidden
```

Estados transitórios podem mudar entre a leitura e o log.

---

### 13. Criar `LifecycleProbe`

```java
public final class LifecycleProbe {

    public List<Thread.State> observe(
            Thread thread,
            Duration timeout)
            throws InterruptedException {

        Instant deadline =
                Instant.now().plus(timeout);

        List<Thread.State> states =
                new ArrayList<>();

        while (Instant.now()
                .isBefore(deadline)) {

            Thread.State state =
                    thread.getState();

            states.add(state);

            if (state
                    == Thread.State.TERMINATED) {
                break;
            }

            Thread.sleep(5);
        }

        return List.copyOf(states);
    }
}
```

O probe observa amostras.

Ele não garante capturar todos os estados.

---

### 14. Observar `NEW`

```java
Thread thread =
        new Thread(
                () -> {
                },
                "lifecycle-new");

assertEquals(
        Thread.State.NEW,
        thread.getState());
```

---

### 15. Observar `RUNNABLE`

Crie uma task curta de cálculo bounded.

```java
Runnable cpuTask =
        () -> {
            long result = 0;

            for (int index = 0;
                    index < 5_000_000;
                    index++) {
                result += index;
            }

            consume(result);
        };
```

Durante a execução, a thread pode aparecer como `RUNNABLE`.

Não use loop infinito.

---

### 16. Observar `TIMED_WAITING`

```java
Thread sleeper =
        new Thread(
                () -> {
                    try {
                        Thread.sleep(500);
                    } catch (
                            InterruptedException exception) {
                        Thread.currentThread()
                                .interrupt();
                    }
                },
                "timed-waiting-demo");
```

Durante o `sleep`, o estado tende a ser `TIMED_WAITING`.

---

### 17. Observar `WAITING` com `join`

A thread chamadora entra em espera enquanto aguarda outra thread sem timeout.

Para testes, prefira `join(timeout)`.

Nesta aula, o estado será observado conceitualmente e em janela bounded.

---

### 18. Introduzir `BLOCKED` sem deadlock deliberado

Uma thread pode ficar `BLOCKED` ao tentar entrar em um monitor ocupado.

Você não irá criar deadlock.

O laboratório usa uma contenção curta e controlada.

O aprofundamento de `synchronized` pertence à aula 592 e deadlocks à aula 594.

---

### 19. Criar resultado de join

```java
public record ThreadJoinResult(
        String threadName,
        boolean completed,
        Thread.State finalState,
        Duration waitTime) {
}
```

---

### 20. Criar `ThreadJoiner`

```java
public final class ThreadJoiner {

    public ThreadJoinResult join(
            Thread thread,
            Duration timeout)
            throws InterruptedException {

        Instant started =
                Instant.now();

        thread.join(
                timeout.toMillis());

        Duration waitTime =
                Duration.between(
                        started,
                        Instant.now());

        return new ThreadJoinResult(
                thread.getName(),
                !thread.isAlive(),
                thread.getState(),
                waitTime);
    }
}
```

`join(timeout)` permite uma espera bounded.

---

### 21. Testar `join`

```java
@Test
void shouldJoinCompletedThread()
        throws InterruptedException {

    Thread thread =
            new Thread(
                    () -> {
                    },
                    "join-complete");

    thread.start();

    ThreadJoinResult result =
            new ThreadJoiner()
                    .join(
                            thread,
                            Duration.ofSeconds(1));

    assertTrue(
            result.completed());

    assertEquals(
            Thread.State.TERMINATED,
            result.finalState());
}
```

---

### 22. Testar timeout de join

```java
@Test
void shouldReportIncompleteThreadAfterJoinTimeout()
        throws InterruptedException {

    Thread thread =
            new Thread(
                    () -> {
                        try {
                            Thread.sleep(500);
                        } catch (
                                InterruptedException exception) {
                            Thread.currentThread()
                                    .interrupt();
                        }
                    },
                    "join-timeout");

    thread.start();

    ThreadJoinResult result =
            new ThreadJoiner()
                    .join(
                            thread,
                            Duration.ofMillis(20));

    assertFalse(
            result.completed());

    thread.interrupt();
    thread.join(1000);

    assertFalse(
            thread.isAlive());
}
```

Todo teste termina limpando a thread.

---

### 23. Criar policy de interruption

Arquivo:

```text
thread-interruption-policy.yaml
```

Conteúdo:

```yaml
interruption:
  cooperative:
    required

  blockingOperation:
    catchInterruptedException:
      required

  restoreFlagWhenNotPropagating:
    required

  swallowedInterrupt:
    forbidden

  loop:
    observeFlag:
      required

  cleanup:
    finally:
      requiredWhenResourceOwned
```

---

### 24. Criar `InterruptibleWorker`

```java
public final class InterruptibleWorker
        implements Runnable {

    private final ThreadEventRecorder recorder;

    public InterruptibleWorker(
            ThreadEventRecorder recorder) {
        this.recorder = recorder;
    }

    @Override
    public void run() {
        recorder.record(
                "WORKER_STARTED");

        try {
            while (!Thread.currentThread()
                    .isInterrupted()) {

                performUnit();

                Thread.sleep(50);
            }
        } catch (
                InterruptedException exception) {

            recorder.record(
                    "INTERRUPTED_EXCEPTION");

            Thread.currentThread()
                    .interrupt();
        } finally {
            recorder.record(
                    "WORKER_FINISHED");
        }
    }

    private void performUnit() {
        // Unidade pequena e segura.
    }
}
```

---

### 25. Entender limpeza da flag

Quando `sleep()` lança `InterruptedException`, a flag de interrupção é limpa.

Se o método não propaga a exceção, ele deve restaurar a flag quando o contrato exigir:

```java
Thread.currentThread()
        .interrupt();
```

Engolir a interrupção faz a task parecer não cancelável.

---

### 26. Testar interruption

```java
@Test
void shouldStopAfterInterrupt()
        throws InterruptedException {

    ThreadEventRecorder recorder =
            new ThreadEventRecorder();

    Thread worker =
            new Thread(
                    new InterruptibleWorker(
                            recorder),
                    "interruptible-worker");

    worker.start();

    Thread.sleep(80);

    worker.interrupt();
    worker.join(1000);

    assertFalse(
            worker.isAlive());

    assertTrue(
            recorder.snapshot()
                    .stream()
                    .anyMatch(
                            event ->
                                    event.category()
                                            .equals(
                                                    "WORKER_FINISHED")));
}
```

O tempo é bounded.

---

### 27. Diferenciar `isInterrupted()` e `Thread.interrupted()`

```java
thread.isInterrupted();
```

Consulta a flag de uma thread sem limpá-la.

```java
Thread.interrupted();
```

Consulta a flag da thread atual e a limpa.

Esse efeito colateral precisa ser conhecido.

Prefira chamadas explícitas e testadas.

---

### 28. Criar stop signal cooperativo

Sem usar atomics nesta aula:

```java
public final class WorkerStopSignal {

    private volatile boolean stopRequested;

    public void requestStop() {
        stopRequested = true;
    }

    public boolean isStopRequested() {
        return stopRequested;
    }
}
```

`volatile` fornece visibilidade para esse sinal simples.

Operações compostas não se tornam automaticamente atômicas.

O aprofundamento será feito na aula 592.

---

### 29. Criar `CooperativeWorker`

```java
public final class CooperativeWorker
        implements Runnable {

    private final WorkerStopSignal stopSignal;
    private final ThreadEventRecorder recorder;

    public CooperativeWorker(
            WorkerStopSignal stopSignal,
            ThreadEventRecorder recorder) {
        this.stopSignal = stopSignal;
        this.recorder = recorder;
    }

    @Override
    public void run() {
        recorder.record(
                "COOPERATIVE_STARTED");

        try {
            while (!stopSignal
                    .isStopRequested()) {
                performUnit();
            }
        } finally {
            recorder.record(
                    "COOPERATIVE_FINISHED");
        }
    }

    private void performUnit() {
        Thread.onSpinWait();
    }
}
```

Esse exemplo é pedagógico.

Em produção, busy spin precisa ser justificado e bounded.

---

### 30. Comparar stop flag e interrupt

Stop flag:

- sinal de domínio do worker;
- exige observação no loop;
- não acorda automaticamente uma operação bloqueante.

Interrupt:

- sinal da thread;
- pode acordar métodos bloqueantes interruptíveis;
- exige cooperação.

Muitas implementações usam ambos conforme o contrato.

---

### 31. Criar policy de exceções

Arquivo:

```text
thread-exception-policy.yaml
```

Conteúdo:

```yaml
exceptions:
  uncaught:
    handler:
      required

  handler:
    record:
      - thread-name
      - exception-category

  handler:
    forbidden:
      - secret
      - business-payload
      - raw-customer-id

  restartAutomatically:
    forbiddenWithoutPolicy

  failure:
    observable:
      required
```

---

### 32. Criar handler

```java
public final class RecordingUncaughtExceptionHandler
        implements Thread.UncaughtExceptionHandler {

    private final List<String> failures =
            Collections.synchronizedList(
                    new ArrayList<>());

    @Override
    public void uncaughtException(
            Thread thread,
            Throwable throwable) {

        failures.add(
                thread.getName()
                        + ":"
                        + throwable.getClass()
                                .getSimpleName());
    }

    public List<String> snapshot() {
        synchronized (failures) {
            return List.copyOf(failures);
        }
    }
}
```

---

### 33. Validar uncaught exception

```java
@Test
void shouldRecordUncaughtFailure()
        throws InterruptedException {

    RecordingUncaughtExceptionHandler handler =
            new RecordingUncaughtExceptionHandler();

    Thread thread =
            new Thread(
                    () -> {
                        throw new IllegalStateException(
                                "synthetic");
                    },
                    "failing-worker");

    thread.setUncaughtExceptionHandler(
            handler);

    thread.start();
    thread.join(1000);

    assertEquals(
            List.of(
                    "failing-worker:"
                            + "IllegalStateException"),
            handler.snapshot());
}
```

A exceção não volta automaticamente para a thread chamadora.

Por isso, precisa ser observável.

---

### 34. Criar policy de daemon

Arquivo:

```text
thread-daemon-policy.yaml
```

Conteúdo:

```yaml
daemon:
  defaultForOwnedBusinessWork:
    false

  allowedFor:
    - best-effort-observation
    - non-critical-background-support

  forbiddenFor:
    - durable-business-write
    - required-cleanup
    - critical-publication

  setBeforeStart:
    required

  relyingOnJVMExitForCleanup:
    forbidden
```

---

### 35. Entender daemon e non-daemon

Non-daemon mantém a JVM viva.

Daemon não mantém a JVM viva sozinho.

Quando restam apenas daemon threads, a JVM pode encerrar.

Portanto, daemon não é substituto para shutdown.

Uma task crítica não deve depender de “terminar antes que a JVM feche”.

---

### 36. Validar configuração antes de `start`

```java
Thread thread =
        new Thread(
                () -> {
                },
                "daemon-demo");

thread.setDaemon(true);

thread.start();
```

Alterar daemon depois de `start()` lança `IllegalThreadStateException`.

---

### 37. Criar policy de shutdown

Arquivo:

```text
thread-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  request:
    - signal-stop
    - interrupt-when-blocked

  wait:
    joinTimeout:
      required

  afterTimeout:
    record:
      required

  forceStop:
    ThreadStop:
      forbidden

  cleanup:
    finally:
      required

  aliveAfterShutdown:
    fail:
      true
```

`Thread.stop()` é proibido.

---

### 38. Criar shutdown básico

```java
public final class ThreadShutdown {

    public boolean stop(
            Thread thread,
            Duration timeout)
            throws InterruptedException {

        thread.interrupt();
        thread.join(
                timeout.toMillis());

        return !thread.isAlive();
    }
}
```

Se a thread continuar viva, registre falha e investigue.

Não tente destruí-la de forma insegura.

---

### 39. Validar shutdown

```java
@Test
void shouldShutdownInterruptibleWorker()
        throws InterruptedException {

    Thread thread =
            new Thread(
                    new InterruptibleWorker(
                            new ThreadEventRecorder()),
                    "shutdown-worker");

    thread.start();

    boolean stopped =
            new ThreadShutdown()
                    .stop(
                            thread,
                            Duration.ofSeconds(1));

    assertTrue(stopped);
}
```

---

### 40. Criar policy de observabilidade

Arquivo:

```text
thread-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  thread:
    required:
      - name
      - lifecycle
      - start
      - finish
      - failure
      - interruption
      - shutdown-timeout

  metrics:
    allowed:
      - active-thread-category
      - completed
      - failed
      - interrupted
      - shutdown-timeout

  labels:
    forbidden:
      - thread-id
      - request-id
      - customer-id
      - order-id

  threadDump:
    rawInRepository:
      forbidden
```

---

### 41. Criar snapshot de thread dump

Script:

```text
collect-thread-dump-snapshot.ps1
```

Use ambiente local e janela controlada.

Com JDK:

```powershell
jcmd `
  $processId `
  Thread.print `
  -l
```

Salve o dump bruto apenas em diretório temporário.

Extraia para o relatório somente:

- categorias de nome;
- estados;
- contagens;
- stacks sanitizadas;
- horário;
- cenário.

---

### 42. Correlacionar nomes

Exemplo:

```text
orders-lab-worker-01:
TIMED_WAITING em sleep.

orders-lab-worker-02:
RUNNABLE em cálculo.

orders-lab-worker-03:
TERMINATED após falha.
```

Sem nomes úteis, o diagnóstico vira busca por números efêmeros.

---

### 43. Criar failure policy

Arquivo:

```text
thread-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  secondStart:
    action:
      fail-test

  uncaughtException:
    action:
      record-and-fail-scenario

  swallowedInterrupt:
    action:
      fail-review

  joinTimeout:
    action:
      interrupt-and-report

  aliveAfterShutdown:
    action:
      fail-gate

  leakedThread:
    action:
      fail-gate

  ExecutorService:
    deferredToLesson589
```

---

### 44. Criar data quality policy

Arquivo:

```text
thread-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingThreadName:
    action:
      reject

  transientStateNotObserved:
    result:
      limited

  timingOnlyAssertion:
    result:
      fragile

  unboundedWait:
    action:
      reject

  staleThreadDump:
    result:
      limited

  singleExecution:
    result:
      limited
```

---

### 45. Criar security policy

Arquivo:

```text
thread-security-policy.yaml
```

Conteúdo:

```yaml
security:
  threadName:
    sensitiveData:
      forbidden

  exception:
    rawMessage:
      sanitize:
        required

  threadDump:
    repository:
      forbidden

  event:
    businessPayload:
      forbidden

  credentials:
    forbidden
```

---

### 46. Criar cenários

Arquivo:

```text
threads-runnable-scenarios.yaml
```

Cenários:

```text
runnable-direct-run;

thread-start;

start-twice;

state-new;

state-runnable;

state-timed-waiting;

short-blocked-state;

join-complete;

join-timeout;

interrupt-sleep;

interrupt-flag-restored;

cooperative-stop;

uncaught-exception;

daemon-configured-before-start;

non-daemon-owned-work;

shutdown-success;

shutdown-timeout;

thread-dump-correlation;

no-thread-leak.
```

Cada cenário registra:

- owner;
- thread name;
- daemon;
- state;
- interruption;
- exception;
- join;
- shutdown;
- result;
- evidence.

---

### 47. Criar teste de ausência de leak

No final de cada cenário, confirme que a thread terminou.

```java
assertFalse(
        thread.isAlive(),
        "Thread must not leak after test");
```

Use nomes exclusivos para localizar leaks.

---

### 48. Executar cenários

Script:

```text
run-thread-lifecycle-scenarios.ps1
```

Execute:

```powershell
mvn `
  --batch-mode `
  -Dtest="ThreadStartVsRunTest,ThreadLifecycleTest,ThreadJoinerTest" `
  test
```

Depois:

```powershell
mvn `
  --batch-mode `
  -Dtest="InterruptibleWorkerTest,CooperativeWorkerTest,UncaughtExceptionHandlerTest,ThreadShutdownTest" `
  test
```

---

### 49. Criar relatório de lifecycle

Arquivo:

```text
thread-lifecycle-report.yaml
```

Exemplo:

```yaml
lifecycle:
  observed:
    - NEW
    - RUNNABLE
    - TIMED_WAITING
    - TERMINATED

  transientNotGuaranteed:
    - BLOCKED
    - WAITING

  startOnce:
    validated

  join:
    bounded

  leaks:
    zero

  result:
    PASS
```

---

### 50. Criar relatório de interruption

Arquivo:

```text
thread-interruption-report.yaml
```

Inclua:

- scenario;
- interrupt requested;
- blocking point;
- exception observed;
- flag restored;
- cleanup;
- finish time;
- thread alive;
- decision.

---

### 51. Criar matriz de testes

Arquivo:

```text
THREADS_RUNNABLE_TEST_MATRIX.md
```

Cenários:

- Runnable direto;
- start;
- run;
- start twice;
- thread name;
- current thread;
- state NEW;
- state RUNNABLE;
- state TIMED_WAITING;
- state TERMINATED;
- BLOCKED curto;
- join;
- join timeout;
- sleep;
- interrupt;
- restored flag;
- cooperative flag;
- uncaught exception;
- daemon;
- non-daemon;
- shutdown;
- cleanup;
- thread dump;
- leak detection;
- segurança;
- evidence.

---

### 52. Criar troubleshooting

Arquivo:

```text
THREADS_RUNNABLE_TROUBLESHOOTING.md
```

Inclua:

- `run()` não cria thread;
- `start()` lança `IllegalThreadStateException`;
- join não retorna;
- sleep deixa teste lento;
- interruption foi engolida;
- flag foi limpa;
- worker ignora stop;
- daemon encerra cedo;
- non-daemon impede JVM de fechar;
- handler não recebe exceção capturada;
- estado esperado não aparece;
- thread dump sem nome útil;
- thread fica viva após teste;
- pool foi antecipado.

---

### 53. Criar gate

O gate valida:

- contrato;
- nomes;
- `run` versus `start`;
- lifecycle;
- start único;
- join bounded;
- interruption;
- restauração da flag;
- exceções;
- daemon policy;
- shutdown;
- leaks;
- observabilidade;
- segurança.

Status:

```text
PASS;

FAIL_NAME;

FAIL_START_SEMANTICS;

FAIL_INTERRUPT;

FAIL_EXCEPTION_HANDLER;

FAIL_SHUTDOWN;

FAIL_THREAD_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 54. Coletar evidence

Script:

```text
collect-threads-runnable-evidence.ps1
```

Arquivo:

```text
threads-runnable-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- scenario category;
- thread name category;
- start semantics status;
- lifecycle status;
- join status;
- interruption status;
- exception status;
- daemon status;
- shutdown status;
- leak status;
- observability status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- thread ID;
- request ID;
- customer ID;
- order ID;
- token;
- stack bruto;
- exception message sensível;
- código de pool;
- material da aula 589.

---

### 55. Executar gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\threads-runnable\validate-threads-runnable-contract.ps1

.\scripts\concurrency\threads-runnable\run-thread-start-vs-run.ps1

.\scripts\concurrency\threads-runnable\run-thread-lifecycle-scenarios.ps1

.\scripts\concurrency\threads-runnable\validate-thread-names.ps1

.\scripts\concurrency\threads-runnable\validate-thread-interruption.ps1

.\scripts\concurrency\threads-runnable\validate-thread-exception-handler.ps1

.\scripts\concurrency\threads-runnable\validate-thread-daemon-policy.ps1

.\scripts\concurrency\threads-runnable\validate-thread-shutdown.ps1

.\scripts\concurrency\threads-runnable\collect-thread-dump-snapshot.ps1

.\scripts\concurrency\threads-runnable\scan-thread-output.ps1

.\scripts\concurrency\threads-runnable\collect-threads-runnable-evidence.ps1

.\scripts\concurrency\threads-runnable\verify-threads-runnable-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- Runnable testável;
- `run` e `start` diferenciados;
- start único validado;
- nomes aprovados;
- lifecycle observado;
- joins bounded;
- interruption cooperativa;
- flag restaurada;
- exceções observadas;
- daemon policy aprovada;
- shutdown aprovado;
- zero leaks;
- thread dump sanitizado;
- segurança aprovada;
- evidence sanitizada;
- ExecutorService não antecipado.

---

### 56. Encerrar o laboratório

Confirme:

- nenhuma thread do laboratório viva;
- nenhuma espera sem timeout;
- nenhum dump bruto no Git;
- nenhum segredo em nomes;
- todos os testes encerrados;
- reports sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/threads-runnable `
  -Recurse `
  -Force
```

Não remova relatórios sanitizados.

---

## Entendendo o que foi feito

### `Runnable` ganhou separação

O trabalho passou a ser testado sem criar uma thread.

### `start` ganhou semântica

A criação do novo fluxo deixou de ser confundida com uma chamada direta a `run`.

### Lifecycle ganhou evidência

Estados passaram a ser observados como amostras, não como garantias temporais rígidas.

### Nomes ganharam operação

Logs, dumps e JFR passaram a identificar propósito.

### `join` ganhou limite

A espera pelo término passou a ter timeout e resultado explícito.

### Interruption ganhou cooperação

A thread passou a observar sinais e restaurar a flag quando necessário.

### Exceções ganharam handler

Falhas não capturadas deixaram de desaparecer silenciosamente.

### Daemon ganhou política

O encerramento da JVM deixou de ser usado como mecanismo de cleanup.

### Shutdown ganhou prova

A thread passou a terminar dentro do budget e sem leak.

### A próxima aula ganhou fronteira

A aula 589 irá substituir criação repetida de threads por pools gerenciados.

---

## Erros comuns importantes

### Chamar `run()` esperando concorrência

O método executa na thread atual.

### Chamar `start()` duas vezes

Uma instância de `Thread` só pode ser iniciada uma vez.

### Criar thread sem nome

Diagnóstico fica muito mais difícil.

### Usar `join()` sem timeout em teste

O teste pode travar indefinidamente.

### Engolir `InterruptedException`

O pedido de cancelamento é perdido.

### Usar daemon para trabalho crítico

A JVM pode encerrar antes da conclusão.

### Esperar exceção na thread chamadora

Exceção não capturada termina a worker e aciona o handler.

### Não limpar threads no teste

A suíte pode ficar instável ou não encerrar.

### Usar `Thread.stop()`

O estado compartilhado pode ficar inconsistente.

### Antecipar pool manualmente

`ExecutorService` pertence à aula 589.

---

## Comandos úteis

### Executar testes

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Validar start e run

```powershell
.\scripts\concurrency\threads-runnable\run-thread-start-vs-run.ps1
```

### Validar interruption

```powershell
.\scripts\concurrency\threads-runnable\validate-thread-interruption.ps1
```

### Coletar snapshot

```powershell
.\scripts\concurrency\threads-runnable\collect-thread-dump-snapshot.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\threads-runnable\validate-thread-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Runnable

Crie uma task testável sem thread.

### Parte 2 — Start versus run

Comprove a diferença pelo nome.

### Parte 3 — Lifecycle

Observe estados bounded.

### Parte 4 — Join

Implemente espera com timeout.

### Parte 5 — Interruption

Interrompa `sleep` e restaure a flag.

### Parte 6 — Cooperative stop

Use sinal visível e encerramento.

### Parte 7 — Exceptions

Configure handler por thread.

### Parte 8 — Daemon

Valide política antes de `start`.

### Parte 9 — Shutdown

Garanta término e cleanup.

### Parte 10 — Gate

Valide leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 587 e ponte para a aula 589 foram preservadas;
- `Runnable`, `Thread`, platform thread, `run`, `start`, nome, `join`, `sleep`, interrupt, flag, `InterruptedException`, daemon, non-daemon, uncaught exception, handler, lifecycle e cooperative shutdown foram definidos;
- contrato e policies foram criados;
- `Runnable` foi testado diretamente;
- `ThreadEvent` e recorder foram criados;
- nomes são obrigatórios e não contêm dados sensíveis;
- factory cria apenas platform threads e não é pool;
- `run()` executa na thread atual;
- `start()` executa em nova thread;
- segunda chamada a `start()` foi validada como erro;
- estados `NEW`, `RUNNABLE`, `TIMED_WAITING` e `TERMINATED` foram observados;
- estados transitórios não foram tratados como determinísticos;
- `join` possui timeout;
- teste de timeout interrompe e limpa a thread;
- interruption é cooperativa;
- `InterruptedException` não é engolida;
- flag é restaurada quando a exceção não é propagada;
- `isInterrupted` e `Thread.interrupted` foram diferenciados;
- stop signal usa visibilidade simples sem antecipar atomics;
- handler registra exceções não capturadas;
- daemon e non-daemon possuem política explícita;
- `Thread.stop()` foi proibido;
- shutdown usa interrupt, join bounded e cleanup;
- thread dump bruto permanece fora do Git;
- zero thread leaks foi validado;
- policies de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, gate e evidence sanitizada estão presentes;
- nenhum segredo ou identificador real foi commitado;
- `ExecutorService` e pools não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/threads-runnable `
  scripts/concurrency/threads-runnable `
  docs/concurrency/threads-runnable `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|requestId|rawThreadDump|Executors\.|ExecutorService|ThreadPoolExecutor|CompletableFuture|ofVirtual|startVirtualThread"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): praticar threads e Runnable"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- identificadores reais;
- dumps brutos;
- artifacts temporários;
- pools;
- `ExecutorService`;
- `CompletableFuture`;
- virtual threads;
- material da aula 589.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou threads de plataforma e separou trabalho de mecanismo de execução.

Você trabalhou com:

```text
Runnable;

Thread;

run;

start;

lifecycle;

names;

join;

sleep;

interrupt;

interrupt flag;

daemon;

uncaught exception;

shutdown;

thread dump.
```

Você comprovou que `run()` não cria uma nova thread; `start()` só pode ser chamado uma vez; nomes são parte da observabilidade; `join` precisa ser bounded; interruption é cooperativa; `InterruptedException` não deve ser engolida; exceções não capturadas precisam de handler; daemon não substitui cleanup; e todo teste precisa terminar sem thread leak.

A próxima aula será:

```text
589 - M18.34 - ExecutorService pools
```

Nela, você irá reutilizar threads por meio de pools, separar submissão e execução, configurar tamanho, filas, rejection policies, shutdown, `Future`, cancelamento, observabilidade e saturação.

Nenhum `ExecutorService`, `Executors`, `ThreadPoolExecutor`, pool sizing, work queue, rejection policy, `submit`, `Future` ou shutdown de pool foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei `Runnable` testável.
- [ ] Diferenciei `run` e `start`.
- [ ] Nomeei threads.
- [ ] Observei lifecycle.
- [ ] Usei `join` bounded.
- [ ] Tratei interruption.
- [ ] Configurei handler.
- [ ] Validei shutdown sem leak.

---

## Troubleshooting adicional

### `run()` usa a main

Esse é o comportamento esperado; use `start()` para novo fluxo.

### `start()` falha

A mesma thread pode já ter sido iniciada.

### O estado esperado não aparece

Estados transitórios mudam rapidamente; use barreiras e amostragem bounded.

### `join` não termina

A worker pode estar bloqueada ou ignorando interrupção.

### O interrupt não encerra o loop

O código não observa a flag ou engoliu a exceção.

### O handler não é chamado

A exceção pode ter sido capturada dentro de `run`.

### A JVM encerra cedo

Apenas daemon threads podem ter restado.

### A JVM não encerra

Existe non-daemon viva ou recurso não fechado.

### O teste passa, mas a suíte trava

Procure thread leak após o cenário.

### Surgiu `ExecutorService`

Preserve essa implementação para a aula 589.

---

## Perguntas de revisão

1. O que é `Runnable`?
2. O que é `Thread`?
3. Qual diferença entre `run` e `start`?
4. Quantas vezes uma thread pode ser iniciada?
5. Para que serve o nome?
6. O que faz `join`?
7. O que faz `sleep`?
8. O que é interruption?
9. O que acontece com a flag ao lançar `InterruptedException`?
10. Qual diferença entre `isInterrupted` e `Thread.interrupted`?
11. O que é daemon thread?
12. O que é non-daemon thread?
13. Para que serve `UncaughtExceptionHandler`?
14. Quais estados principais existem?
15. Por que usar timeout no join?
16. Por que `Thread.stop()` é proibido?
17. O que é cooperative shutdown?
18. Como detectar leak?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Unidade de trabalho sem retorno declarado.
2. Fluxo de execução controlado pela JVM.
3. Chamada atual versus novo fluxo.
4. Uma vez.
5. Observabilidade.
6. Aguarda término.
7. Suspende a thread atual.
8. Sinal cooperativo.
9. A flag é limpa.
10. Um preserva; o outro consulta e limpa.
11. Não mantém a JVM viva.
12. Mantém a JVM viva.
13. Observar falhas não capturadas.
14. NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING e TERMINATED.
15. Evitar espera infinita.
16. Pode deixar estado inconsistente.
17. Sinal, cleanup e término voluntário.
18. Verificar `isAlive` após shutdown.
19. ExecutorService pools.
20. ExecutorService pools.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 588 - M18.33 - Threads e Runnable

- Continuei após Concorrência Java clássica.
- Diferenciei `Runnable` e `Thread`.
- Criei tasks testáveis sem concorrência.
- Comprovei que `run()` executa na thread atual.
- Comprovei que `start()` cria novo fluxo.
- Validei que uma thread só inicia uma vez.
- Criei política de nomes seguros.
- Observei lifecycle e estados de thread.
- Usei `join` com timeout.
- Interrompi operações bloqueantes.
- Restaurei a flag de interrupção.
- Diferenciei `isInterrupted` e `Thread.interrupted`.
- Criei stop signal cooperativo.
- Configurei `UncaughtExceptionHandler`.
- Diferenciei daemon e non-daemon.
- Proibi `Thread.stop()`.
- Implementei shutdown com interrupt e join bounded.
- Coletei snapshot sanitizado de thread dump.
- Validei zero thread leaks.
- Criei policies de qualidade, segurança e failure.
- Coletei evidence sanitizada.
- Não antecipei ExecutorService.
- Próxima aula: ExecutorService pools.
```

---

## Referência técnica curta

- Java `Thread`.
- Java `Runnable`.
- Thread lifecycle.
- Thread interruption.
- `InterruptedException`.
- `Thread.UncaughtExceptionHandler`.
- Daemon threads.
- Thread naming.
- Thread join.
- Cooperative shutdown.

Regra final:

```text
threads e Runnable precisam separar trabalho de mecanismo de execução: Runnable permanece testável sem concorrência, Thread recebe nome seguro, daemon policy, handler, interruption policy, join bounded e shutdown, enquanto run executa no fluxo atual e start cria uma nova thread de plataforma que só pode ser iniciada uma vez; lifecycle é observado por amostragem, estados transitórios não são tratados como determinísticos, sleep e outras esperas respeitam interruption, InterruptedException não é engolida e a flag é restaurada quando o contrato não propaga a exceção; falhas não capturadas são registradas sem payload sensível, Thread.stop é proibido, daemon não substitui cleanup e todo cenário termina com zero thread leaks, deixando para a aula 589 ExecutorService, pools, filas, sizing, rejection policies, submit, Future, cancelamento e shutdown gerenciado.
```
