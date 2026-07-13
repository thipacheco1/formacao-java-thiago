# 589 - M18.34 - ExecutorService pools

## Apresentação da aula

Na aula 588, você criou threads de plataforma diretamente e praticou:

```text
Runnable;

Thread;

run;

start;

lifecycle;

nomes;

join;

sleep;

interrupt;

daemon;

UncaughtExceptionHandler;

shutdown;

thread dump.
```

Você comprovou que:

```text
run()
executa na thread atual;

start()
cria um novo fluxo;

uma Thread
só pode ser iniciada uma vez.
```

Também validou que toda thread precisa de:

- nome;
- owner;
- tratamento de falha;
- política de interrupção;
- espera bounded;
- shutdown;
- evidência de término;
- ausência de leak.

Criar uma thread para cada unidade de trabalho, porém, não é uma estratégia sustentável para um serviço backend.

Imagine:

```text
10 requests:
10 threads novas.

1.000 requests:
1.000 threads novas.

20.000 requests:
20.000 tentativas
de criar threads.
```

Cada thread de plataforma custa criação, memória, stack, agendamento e context switching. Criação sem limite transfere o overload para a JVM e o sistema operacional.

A solução clássica da plataforma Java é separar:

```text
submissão de tarefas;

execução por workers reutilizáveis.
```

Nesta aula, você irá trabalhar com:

```java
ExecutorService
```

e com a implementação configurável:

```java
ThreadPoolExecutor
```

A pergunta central será:

```text
como configurar
um pool de threads

com tamanho,
fila,
rejeição,
cancelamento,
observabilidade
e shutdown

sem esconder overload
ou criar trabalho infinito?
```

Um pool mantém workers reutilizáveis.

As tasks são submetidas, aguardam quando necessário e são executadas de acordo com a capacidade configurada.

Essa arquitetura exige decisões sobre workers, core e maximum size, keep-alive, fila, rejeição, workload, timeout, submissão, Future, cancelamento, contexto, shutdown, métricas e saturação.

Um pool não cria capacidade infinita.

Ele apenas define como a demanda será admitida e distribuída entre recursos limitados.

Considere:

```text
workers:
8.

fila:
100.

entrada:
1.000 tasks/s.

saída:
100 tasks/s.
```

Nesse cenário, a fila cresce até o limite.

Depois, tarefas serão rejeitadas ou o mecanismo escolhido aplicará outra reação.

Se a fila for ilimitada, o overload não desaparece.

Ele vira:

- espera crescente;
- consumo de memória;
- latência imprevisível;
- objetos retidos;
- cancelamentos tardios;
- shutdown lento;
- risco de `OutOfMemoryError`.

Por isso, a regra operacional será:

```text
pool bounded;

fila bounded;

timeout bounded;

shutdown bounded.
```

Você também irá diferenciar:

```text
execute(Runnable);

submit(Runnable);

submit(Callable);

invokeAll;

Future.get;

Future.cancel.
```

`execute` envia uma `Runnable` sem retornar um objeto de acompanhamento.

`submit` retorna um `Future`.

Esse `Future` permite:

- aguardar;
- obter resultado;
- observar falha;
- usar timeout;
- solicitar cancelamento.

Mas `Future.get()` também pode bloquear.

Se for chamado sem timeout em um caminho crítico, uma operação assíncrona pode se transformar em espera indefinida.

A aula irá tratar `Future` de forma clássica.

A composição declarativa e encadeada ficará para a próxima aula:

```text
590 - M18.35 - CompletableFuture
```

Não serão implementados nesta aula:

- `CompletableFuture.supplyAsync`;
- `thenApply`;
- `thenCompose`;
- `thenCombine`;
- `allOf`;
- `anyOf`;
- pipelines assíncronos;
- tratamento funcional de resultados;
- composição entre múltiplas futures;
- callbacks assíncronos;
- APIs reativas;
- virtual threads.

A regra central será:

```text
ExecutorService
não elimina limites;

ele torna explícitos
workers,
fila,
admissão,
rejeição
e encerramento.
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

criar threads diretamente;

gerenciar workers em pools;

compor tarefas assíncronas.
```

Nesta aula:

```text
Executor:
sim.

ExecutorService:
sim.

ThreadPoolExecutor:
sim.

Executors:
sim,
com cautela.

execute:
sim.

submit:
sim.

Callable:
sim.

Future:
sim.

cancel:
sim.

invokeAll:
sim.

corePoolSize:
sim.

maximumPoolSize:
sim.

keepAliveTime:
sim.

work queue:
sim.

rejection policy:
sim.

shutdown:
sim.

shutdownNow:
sim.

awaitTermination:
sim.

CompletableFuture:
não.

virtual threads:
não.

locks explícitos:
não.
```

Você reutilizará:

- `Runnable`;
- interrupção;
- naming;
- lifecycle;
- shutdown;
- safety;
- liveness;
- workload CPU-bound;
- workload I/O-bound;
- filas bounded;
- métricas de saturação;
- stress testing;
- thread dumps;
- JFR;
- runbooks.

O pool precisa preservar:

- limites;
- fairness suficiente;
- observabilidade;
- cancelamento;
- propagação de falhas;
- cleanup;
- shutdown;
- ausência de task leak;
- ausência de thread leak.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/executor-pools
├── executor-pool-contract.yaml
├── executor-pool-catalog.yaml
├── executor-workload-policy.yaml
├── executor-sizing-policy.yaml
├── executor-queue-policy.yaml
├── executor-rejection-policy.yaml
├── executor-future-policy.yaml
├── executor-cancellation-policy.yaml
├── executor-context-policy.yaml
├── executor-exception-policy.yaml
├── executor-shutdown-policy.yaml
├── executor-observability-policy.yaml
├── executor-data-quality-policy.yaml
├── executor-security-policy.yaml
├── executor-failure-policy.yaml
├── executor-pool-scenarios.yaml
└── executor-pool-evidence.yaml

concurrency/executor-pools/src/main/java
└── br/com/formacao/concurrency/executors
    ├── PoolWorkloadKind.java
    ├── PoolConfiguration.java
    ├── PoolMetricsSnapshot.java
    ├── NamedThreadFactory.java
    ├── BoundedExecutorFactory.java
    ├── RecordingRejectedExecutionHandler.java
    ├── TimedCallable.java
    ├── FutureResult.java
    ├── FutureAwaiter.java
    ├── CancellableTask.java
    ├── ExecutorShutdownResult.java
    ├── ExecutorShutdownManager.java
    ├── ExecutorContext.java
    └── ExecutorPoolDemo.java

concurrency/executor-pools/src/test/java
└── br/com/formacao/concurrency/executors
    ├── BoundedExecutorFactoryTest.java
    ├── ExecutorExecuteTest.java
    ├── ExecutorSubmitTest.java
    ├── FutureAwaiterTest.java
    ├── ExecutorCancellationTest.java
    ├── RejectionPolicyTest.java
    ├── ExecutorExceptionTest.java
    ├── ExecutorShutdownTest.java
    ├── ExecutorContextTest.java
    └── ExecutorNoLeakTest.java

concurrency/executor-pools/reports
├── executor-baseline-report.yaml
├── executor-sizing-report.yaml
├── executor-queue-report.yaml
├── executor-rejection-report.yaml
├── executor-future-report.yaml
├── executor-shutdown-report.yaml
└── executor-gate-report.yaml

scripts/concurrency/executor-pools
├── validate-executor-pool-contract.ps1
├── validate-executor-pool-catalog.ps1
├── run-executor-baseline.ps1
├── validate-executor-sizing.ps1
├── validate-executor-queue-bound.ps1
├── simulate-executor-saturation.ps1
├── validate-executor-rejection.ps1
├── validate-executor-futures.ps1
├── validate-executor-cancellation.ps1
├── validate-executor-context.ps1
├── validate-executor-exceptions.ps1
├── validate-executor-shutdown.ps1
├── collect-executor-thread-dump.ps1
├── scan-executor-output.ps1
├── collect-executor-pool-evidence.ps1
└── verify-executor-pool-baseline.ps1

docs/concurrency/executor-pools
├── EXECUTOR_SERVICE_OVERVIEW.md
├── THREAD_POOL_EXECUTOR_GUIDE.md
├── POOL_SIZING_GUIDE.md
├── EXECUTOR_QUEUE_GUIDE.md
├── REJECTION_POLICIES.md
├── FUTURE_AND_CANCELLATION.md
├── EXECUTOR_EXCEPTIONS.md
├── EXECUTOR_SHUTDOWN.md
├── EXECUTOR_POOL_TEST_MATRIX.md
└── EXECUTOR_POOL_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de pool;

catálogo de executors;

workers nomeados;

fila bounded;

rejection observável;

Future com timeout;

cancelamento;

context propagation;

shutdown gerenciado;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### `Executor`

Abstração mínima que executa um `Runnable`.

```java
public interface Executor {
    void execute(Runnable command);
}
```

---

### `ExecutorService`

Executor com lifecycle, submissão, `Future`, shutdown e operações em lote.

---

### `ThreadPoolExecutor`

Implementação configurável de pool de threads.

---

### Worker

Thread reutilizada pelo pool para executar tasks.

---

### Core pool size

Quantidade base de workers mantida pelo pool conforme configuração.

---

### Maximum pool size

Quantidade máxima de workers permitida.

---

### Keep-alive time

Tempo de ociosidade permitido para workers acima do core antes de serem removidos.

---

### Work queue

Fila usada para armazenar tasks aguardando execução.

---

### Bounded queue

Fila com capacidade máxima.

---

### Rejection

Resposta do executor quando não pode aceitar nova task.

---

### `Runnable`

Task sem resultado declarado.

---

### `Callable<V>`

Task que retorna valor e pode lançar exceção.

---

### `Future<V>`

Representa o resultado potencial de uma task.

---

### `Future.get()`

Aguarda o resultado e pode bloquear.

---

### `Future.cancel(boolean)`

Solicita o cancelamento da task.

---

### `ExecutionException`

Encapsula a falha produzida durante a execução da task.

---

### `TimeoutException`

Indica que o resultado não ficou disponível dentro do limite.

---

### `RejectedExecutionException`

Indica rejeição da task.

---

### `shutdown()`

Para novas submissões e permite que tasks aceitas terminem.

---

### `shutdownNow()`

Tenta interromper tasks em execução e devolve tasks nunca iniciadas.

---

### `awaitTermination()`

Aguarda o término do executor por tempo limitado.

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

- aula 588 validada;
- nenhuma thread do laboratório anterior está viva;
- naming policy disponível;
- interruption policy disponível;
- nenhuma `CompletableFuture` será usada;
- todos os pools terão fila bounded;
- todos os testes terão timeout.

---

### 2. Criar contrato

Arquivo:

```text
executor-pool-contract.yaml
```

Conteúdo:

```yaml
executor:
  required:
    - id
    - owner
    - workload-kind
    - core-size
    - maximum-size
    - queue-type
    - queue-capacity
    - rejection-policy
    - thread-factory
    - task-timeout
    - shutdown-policy
    - observability

  bounded:
    workers:
      required

    queue:
      required

  tests:
    zeroThreadLeak:
      required

    zeroTaskLeak:
      required

  forbiddenInLesson589:
    - CompletableFuture
    - virtualThread
    - unboundedQueueWithoutApproval

  nextLesson:
    code:
      M18.35
```

---

### 3. Criar catálogo de pools

Arquivo:

```text
executor-pool-catalog.yaml
```

Exemplo:

```yaml
executors:
  - id:
      order-enrichment

    owner:
      orders-api

    workload:
      IO_BOUND

    corePoolSize:
      4

    maximumPoolSize:
      8

    queue:
      type:
        ArrayBlockingQueue

      capacity:
        50

    rejection:
      AbortPolicy

    shutdown:
      graceful:
        5s

    productionValues:
      undefined
```

---

### 4. Classificar workload

Crie:

```java
public enum PoolWorkloadKind {
    CPU_BOUND,
    IO_BOUND,
    MIXED,
    UNKNOWN
}
```

A classificação orienta o sizing.

CPU-bound possui processamento intenso e pouca espera; workers demais ampliam context switching. I/O-bound espera rede, banco, arquivo ou dependência; mais workers ocultam espera, mas o downstream continua limitando a capacidade.

---

### 5. Criar policy de workload

Arquivo:

```text
executor-workload-policy.yaml
```

Conteúdo:

```yaml
workload:
  classification:
    required

  CPU_BOUND:
    sizeFrom:
      - available-processors
      - measured-utilization
      - task-cost

  IO_BOUND:
    sizeFrom:
      - wait-time
      - service-time
      - downstream-capacity
      - timeout

  MIXED:
    action:
      splitWhenPractical

  UNKNOWN:
    action:
      instrument-before-sizing
```

---

### 6. Criar configuração tipada

```java
public record PoolConfiguration(
        String id,
        PoolWorkloadKind workloadKind,
        int corePoolSize,
        int maximumPoolSize,
        int queueCapacity,
        Duration keepAlive,
        Duration shutdownTimeout) {

    public PoolConfiguration {
        Objects.requireNonNull(id);
        Objects.requireNonNull(workloadKind);
        Objects.requireNonNull(keepAlive);
        Objects.requireNonNull(shutdownTimeout);

        if (corePoolSize <= 0) {
            throw new IllegalArgumentException(
                    "corePoolSize must be positive");
        }

        if (maximumPoolSize < corePoolSize) {
            throw new IllegalArgumentException(
                    "maximumPoolSize must be >= corePoolSize");
        }

        if (queueCapacity <= 0) {
            throw new IllegalArgumentException(
                    "queueCapacity must be positive");
        }
    }
}
```

---

### 7. Criar policy de sizing

Arquivo:

```text
executor-sizing-policy.yaml
```

Conteúdo:

```yaml
sizing:
  deriveFrom:
    - workload-kind
    - service-time
    - wait-time
    - CPU
    - downstream-capacity
    - task-arrival-rate
    - queue-budget

  arbitraryLargePool:
    forbidden

  CPU_BOUND:
    initialCandidate:
      processors-or-near-processors

  IO_BOUND:
    requires:
      downstreamReview:
        true

  changeOneVariable:
    required
```

---

### 8. Estimar sizing CPU-bound

Ponto inicial didático:

```text
workers
≈
número de processadores
ou
processadores + pequena margem.
```

Não trate a fórmula como verdade universal.

Meça:

- CPU;
- throughput;
- context switching;
- filas;
- duração da task;
- GC.

---

### 9. Estimar sizing I/O-bound

Uma aproximação conceitual:

```text
threads
≈
núcleos
×
(1 + wait time / service time).
```

Exemplo:

```text
núcleos:
8.

wait:
90 ms.

service:
10 ms.

razão:
9.

candidato teórico:
8 × 10
=
80.
```

Esse valor não deve ser aplicado cegamente.

O banco, a API externa, o pool JDBC, os sockets e os rate limits podem suportar muito menos.

---

### 10. Criar thread factory nomeada

```java
public final class NamedThreadFactory
        implements ThreadFactory {

    private final String prefix;
    private final AtomicInteger sequence =
            new AtomicInteger();

    private final Thread.UncaughtExceptionHandler
            exceptionHandler;

    public NamedThreadFactory(
            String prefix,
            Thread.UncaughtExceptionHandler
                    exceptionHandler) {

        this.prefix =
                Objects.requireNonNull(prefix);

        this.exceptionHandler =
                Objects.requireNonNull(
                        exceptionHandler);
    }

    @Override
    public Thread newThread(
            Runnable runnable) {

        Thread thread =
                new Thread(
                        runnable,
                        prefix
                                + "-"
                                + sequence
                                        .incrementAndGet());

        thread.setDaemon(false);
        thread.setUncaughtExceptionHandler(
                exceptionHandler);

        return thread;
    }
}
```

A aula 592 aprofundará estruturas atômicas.

---

### 11. Criar rejection handler observável

```java
public final class RecordingRejectedExecutionHandler
        implements RejectedExecutionHandler {

    private final LongAdder rejected =
            new LongAdder();

    @Override
    public void rejectedExecution(
            Runnable runnable,
            ThreadPoolExecutor executor) {

        rejected.increment();

        throw new RejectedExecutionException(
                "Executor rejected task");
    }

    public long rejectedCount() {
        return rejected.sum();
    }
}
```

O payload da task não deve aparecer na mensagem.

---

### 12. Criar factory bounded

```java
public final class BoundedExecutorFactory {

    public ThreadPoolExecutor create(
            PoolConfiguration configuration,
            ThreadFactory threadFactory,
            RejectedExecutionHandler
                    rejectionHandler) {

        BlockingQueue<Runnable> queue =
                new ArrayBlockingQueue<>(
                        configuration
                                .queueCapacity());

        ThreadPoolExecutor executor =
                new ThreadPoolExecutor(
                        configuration
                                .corePoolSize(),
                        configuration
                                .maximumPoolSize(),
                        configuration
                                .keepAlive()
                                .toMillis(),
                        TimeUnit.MILLISECONDS,
                        queue,
                        threadFactory,
                        rejectionHandler);

        executor.allowCoreThreadTimeOut(
                false);

        return executor;
    }
}
```

---

### 13. Entender fila e `maximumPoolSize`

Com `ArrayBlockingQueue`, o fluxo simplificado é:

```text
se workers abaixo do core:
criar worker;

senão:
enfileirar;

se fila cheia
e workers abaixo do máximo:
criar worker adicional;

senão:
rejeitar.
```

O comportamento depende da fila escolhida.

---

### 14. Criar policy de fila

Arquivo:

```text
executor-queue-policy.yaml
```

Conteúdo:

```yaml
queue:
  bounded:
    required

  allowed:
    - ArrayBlockingQueue
    - bounded-LinkedBlockingQueue
    - SynchronousQueue-with-explicit-design

  unbounded:
    forbiddenWithoutArchitectureApproval

  metrics:
    required:
      - size
      - remaining-capacity
      - oldest-wait
      - enqueue-rate
      - dequeue-rate

  queueIsNotCapacity:
    true
```

---

### 15. Comparar filas

`ArrayBlockingQueue`:

- capacidade fixa;
- estrutura em array;
- bounded;
- comportamento previsível.

`LinkedBlockingQueue`:

- pode ser bounded;
- sem capacidade explícita, tende a ser muito grande;
- pode esconder overload.

`SynchronousQueue`:

- não armazena;
- entrega direta entre produtor e worker;
- exige estratégia explícita de crescimento e rejeição.

Nesta aula, o laboratório principal usa `ArrayBlockingQueue`.

---

### 16. Criar policy de rejection

Arquivo:

```text
executor-rejection-policy.yaml
```

Conteúdo:

```yaml
rejection:
  required:
    true

  allowed:
    - abort
    - caller-runs
    - discard-with-explicit-loss-contract
    - discard-oldest-with-explicit-loss-contract
    - custom-observable

  silentDiscard:
    forbidden

  CallerRuns:
    effect:
      backpressure-to-submitter

  Abort:
    effect:
      explicit-failure

  metrics:
    required
```

---

### 17. Entender policies padrão

`AbortPolicy`:

```text
rejeita com
RejectedExecutionException.
```

`CallerRunsPolicy`:

```text
a thread chamadora
executa a task,
se o executor
não estiver encerrado.
```

`DiscardPolicy`:

```text
descarta silenciosamente.
```

`DiscardOldestPolicy`:

```text
remove a task mais antiga
e tenta submeter novamente.
```

Para trabalho de negócio, descarte silencioso geralmente é perigoso.

---

### 18. Validar `AbortPolicy`

Crie um pool pequeno:

```text
workers:
1.

fila:
1.
```

Submeta:

1. task bloqueada de forma controlada;
2. task enfileirada;
3. terceira task.

A terceira precisa gerar:

```text
RejectedExecutionException.
```

Libere a barreira no `finally`.

---

### 19. Validar `CallerRunsPolicy`

Com pool saturado, a task rejeitada é executada pela thread chamadora.

Registre:

```text
thread name
da terceira task.
```

Esse comportamento aplica backpressure, porém pode aumentar a latência do chamador.

Não use sem entender o caminho de submissão.

---

### 20. Diferenciar `execute` e `submit`

Com `execute`:

```java
executor.execute(
        () -> {
            throw new IllegalStateException(
                    "synthetic");
        });
```

A exceção não capturada pode chegar ao `UncaughtExceptionHandler` da worker.

Com `submit`:

```java
Future<?> future =
        executor.submit(
                () -> {
                    throw new IllegalStateException(
                            "synthetic");
                });
```

A exceção é capturada pelo mecanismo da task e aparece em:

```java
future.get();
```

como:

```text
ExecutionException.
```

Essa diferença é operacionalmente importante.

---

### 21. Criar policy de exceções

Arquivo:

```text
executor-exception-policy.yaml
```

Conteúdo:

```yaml
exceptions:
  execute:
    uncaughtHandler:
      required

  submit:
    FutureMustBeObserved:
      required

  ignoredFuture:
    forbiddenForCriticalTask

  ExecutionException:
    unwrapCause:
      required

  logging:
    rawPayload:
      forbidden
```

---

### 22. Criar `TimedCallable`

```java
public final class TimedCallable
        implements Callable<String> {

    private final String result;
    private final Duration delay;

    public TimedCallable(
            String result,
            Duration delay) {
        this.result =
                Objects.requireNonNull(result);
        this.delay =
                Objects.requireNonNull(delay);
    }

    @Override
    public String call()
            throws Exception {

        Thread.sleep(
                delay.toMillis());

        return result;
    }
}
```

---

### 23. Criar `FutureResult`

```java
public record FutureResult<T>(
        boolean completed,
        boolean cancelled,
        T value,
        String failureCategory,
        Duration waitTime) {
}
```

---

### 24. Criar `FutureAwaiter`

```java
public final class FutureAwaiter {

    public <T> FutureResult<T> await(
            Future<T> future,
            Duration timeout) {

        Instant started =
                Instant.now();

        try {
            T value =
                    future.get(
                            timeout.toMillis(),
                            TimeUnit.MILLISECONDS);

            return new FutureResult<>(
                    true,
                    false,
                    value,
                    null,
                    Duration.between(
                            started,
                            Instant.now()));

        } catch (TimeoutException exception) {
            return new FutureResult<>(
                    false,
                    false,
                    null,
                    "TIMEOUT",
                    Duration.between(
                            started,
                            Instant.now()));

        } catch (CancellationException exception) {
            return new FutureResult<>(
                    false,
                    true,
                    null,
                    "CANCELLED",
                    Duration.between(
                            started,
                            Instant.now()));

        } catch (ExecutionException exception) {
            return new FutureResult<>(
                    false,
                    false,
                    null,
                    exception.getCause()
                            .getClass()
                            .getSimpleName(),
                    Duration.between(
                            started,
                            Instant.now()));

        } catch (InterruptedException exception) {
            Thread.currentThread()
                    .interrupt();

            return new FutureResult<>(
                    false,
                    false,
                    null,
                    "CALLER_INTERRUPTED",
                    Duration.between(
                            started,
                            Instant.now()));
        }
    }
}
```

---

### 25. Criar policy de Future

Arquivo:

```text
executor-future-policy.yaml
```

Conteúdo:

```yaml
future:
  criticalTask:
    resultObserved:
      required

  get:
    timeout:
      required

  timeout:
    action:
      - cancel-when-appropriate
      - record
      - fallback

  ExecutionException:
    inspectCause:
      required

  CancellationException:
    handle:
      required

  ignoredFuture:
    forbidden
```

---

### 26. Testar sucesso

```java
Future<String> future =
        executor.submit(
                new TimedCallable(
                        "ok",
                        Duration.ofMillis(20)));

FutureResult<String> result =
        new FutureAwaiter()
                .await(
                        future,
                        Duration.ofSeconds(1));

assertTrue(result.completed());
assertEquals("ok", result.value());
```

---

### 27. Testar timeout

```java
Future<String> future =
        executor.submit(
                new TimedCallable(
                        "late",
                        Duration.ofSeconds(2)));

FutureResult<String> result =
        new FutureAwaiter()
                .await(
                        future,
                        Duration.ofMillis(50));

assertEquals(
        "TIMEOUT",
        result.failureCategory());

future.cancel(true);
```

Timeout do chamador não cancela automaticamente a task.

A decisão precisa ser explícita.

---

### 28. Criar policy de cancelamento

Arquivo:

```text
executor-cancellation-policy.yaml
```

Conteúdo:

```yaml
cancellation:
  FutureCancel:
    explicit:
      required

  mayInterruptIfRunning:
    documented:
      required

  task:
    cooperative:
      required

  queuedTask:
    cancellation:
      supported

  runningTask:
    interruption:
      mayBeRequested

  partialEffects:
    contract:
      required
```

---

### 29. Criar task cancelável

```java
public final class CancellableTask
        implements Callable<Integer> {

    private final int maximumUnits;

    public CancellableTask(
            int maximumUnits) {
        this.maximumUnits =
                maximumUnits;
    }

    @Override
    public Integer call()
            throws Exception {

        int completed = 0;

        while (completed < maximumUnits) {
            if (Thread.currentThread()
                    .isInterrupted()) {
                throw new InterruptedException(
                        "Task interrupted");
            }

            performUnit();
            completed++;
        }

        return completed;
    }

    private void performUnit()
            throws InterruptedException {
        Thread.sleep(20);
    }
}
```

---

### 30. Validar `cancel(true)`

```java
Future<Integer> future =
        executor.submit(
                new CancellableTask(100));

Thread.sleep(60);

boolean cancellationRequested =
        future.cancel(true);

assertTrue(cancellationRequested);
assertTrue(future.isCancelled());
assertTrue(future.isDone());
```

`cancel(true)` solicita interrupção.

Não garante interrupção de código que ignora o sinal.

---

### 31. Validar `cancel(false)`

Se a task ainda não começou, ela pode ser cancelada sem interrupção.

Se já está em execução, `cancel(false)` não solicita interrupção.

O resultado depende do estado da task.

Registre a decisão e o resultado.

---

### 32. Criar policy de contexto

Arquivo:

```text
executor-context-policy.yaml
```

Conteúdo:

```yaml
context:
  required:
    - correlation-category
    - tenant-scope-when-safe
    - deadline
    - cancellation

  ThreadLocal:
    propagation:
      explicit:
        required

  cleanup:
    finally:
      required

  MDC:
    removeAfterTask:
      required

  sensitiveContext:
    forbidden
```

---

### 33. Entender `ThreadLocal` em pool

Workers são reutilizados.

Se uma task configura contexto e não limpa:

```text
task A:
tenant A.

worker reutilizado.

task B:
pode observar
contexto residual.
```

Isso pode causar vazamento entre requests.

Sempre limpe contexto em `finally`.

---

### 34. Criar wrapper de contexto

```java
public record ExecutorContext(
        String correlationCategory,
        Instant deadline) {
}
```

Exemplo conceitual:

```java
Runnable wrap(
        ExecutorContext context,
        Runnable task) {

    return () -> {
        try {
            contextHolder.set(context);
            task.run();
        } finally {
            contextHolder.remove();
        }
    };
}
```

Não inclua dados pessoais no contexto.

---

### 35. Criar métricas snapshot

```java
public record PoolMetricsSnapshot(
        int poolSize,
        int activeCount,
        int corePoolSize,
        int maximumPoolSize,
        int queueSize,
        int queueRemainingCapacity,
        long completedTaskCount,
        long taskCount,
        long rejectedCount,
        boolean shutdown,
        boolean terminated) {
}
```

---

### 36. Criar policy de observabilidade

Arquivo:

```text
executor-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  pool:
    required:
      - pool-size
      - active-count
      - largest-pool-size
      - completed-task-count
      - task-count

  queue:
    required:
      - size
      - remaining-capacity
      - rejection-count

  task:
    required:
      - submitted
      - started
      - completed
      - failed
      - cancelled
      - duration
      - wait-time

  shutdown:
    required:
      - requested
      - graceful-completed
      - forced-requested
      - never-started-count

  labels:
    forbidden:
      - request-id
      - order-id
      - customer-id
```

---

### 37. Medir fila e workers

Com `ThreadPoolExecutor`:

```java
int poolSize =
        executor.getPoolSize();

int active =
        executor.getActiveCount();

int largest =
        executor.getLargestPoolSize();

int queued =
        executor.getQueue().size();

int remaining =
        executor.getQueue()
                .remainingCapacity();

long completed =
        executor.getCompletedTaskCount();

long total =
        executor.getTaskCount();
```

Essas métricas são amostras; não crie invariantes rígidas sobre valores transitórios.

---

### 38. Simular saturação

Script:

```text
simulate-executor-saturation.ps1
```

Cenário:

```text
core:
2.

maximum:
4.

queue:
4.

tasks:
20.

task duration:
bounded.
```

Observe:

- workers;
- active;
- queue;
- remaining capacity;
- rejected;
- caller thread;
- latency;
- completed;
- shutdown.

---

### 39. Criar policy de shutdown

Arquivo:

```text
executor-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  graceful:
    sequence:
      - stop-submission
      - shutdown
      - await-termination

  timeout:
    required

  fallback:
    sequence:
      - shutdownNow
      - record-never-started
      - await-again

  interruptedCaller:
    restoreFlag:
      required

  threadLeak:
    forbidden
```

---

### 40. Criar resultado de shutdown

```java
public record ExecutorShutdownResult(
        boolean graceful,
        boolean forcedRequested,
        boolean terminated,
        int neverStartedTasks,
        Duration totalWait) {
}
```

---

### 41. Criar shutdown manager

```java
public final class ExecutorShutdownManager {

    public ExecutorShutdownResult shutdown(
            ExecutorService executor,
            Duration gracefulTimeout,
            Duration forcedTimeout) {

        Instant started =
                Instant.now();

        executor.shutdown();

        try {
            if (executor.awaitTermination(
                    gracefulTimeout.toMillis(),
                    TimeUnit.MILLISECONDS)) {

                return new ExecutorShutdownResult(
                        true,
                        false,
                        true,
                        0,
                        Duration.between(
                                started,
                                Instant.now()));
            }

            List<Runnable> neverStarted =
                    executor.shutdownNow();

            boolean terminated =
                    executor.awaitTermination(
                            forcedTimeout.toMillis(),
                            TimeUnit.MILLISECONDS);

            return new ExecutorShutdownResult(
                    false,
                    true,
                    terminated,
                    neverStarted.size(),
                    Duration.between(
                            started,
                            Instant.now()));

        } catch (InterruptedException exception) {
            List<Runnable> neverStarted =
                    executor.shutdownNow();

            Thread.currentThread()
                    .interrupt();

            return new ExecutorShutdownResult(
                    false,
                    true,
                    executor.isTerminated(),
                    neverStarted.size(),
                    Duration.between(
                            started,
                            Instant.now()));
        }
    }
}
```

---

### 42. Entender `shutdownNow()`

`shutdownNow()`:

- impede novas submissões;
- tenta interromper workers;
- retorna tasks que nunca começaram;
- não garante término instantâneo;
- depende da cooperação das tasks.

Nunca trate o nome como garantia de parada imediata.

---

### 43. Criar teste de shutdown graceful

```java
@Test
void shouldShutdownGracefully() {
    ExecutorService executor =
            createExecutor();

    executor.submit(
            () -> "done");

    ExecutorShutdownResult result =
            new ExecutorShutdownManager()
                    .shutdown(
                            executor,
                            Duration.ofSeconds(1),
                            Duration.ofSeconds(1));

    assertTrue(result.terminated());
    assertTrue(executor.isShutdown());
}
```

---

### 44. Criar teste de fallback

Submeta uma task interruptível mais longa.

Use timeout graceful curto.

Confirme:

- `shutdownNow()` foi solicitado;
- task observou interrupção;
- tasks nunca iniciadas foram contabilizadas;
- pool terminou;
- zero workers vivos.

---

### 45. Usar `invokeAll` com timeout

```java
List<Callable<String>> tasks =
        List.of(
                new TimedCallable(
                        "a",
                        Duration.ofMillis(20)),
                new TimedCallable(
                        "b",
                        Duration.ofMillis(30)));

List<Future<String>> futures =
        executor.invokeAll(
                tasks,
                1,
                TimeUnit.SECONDS);
```

`invokeAll` retorna futures na mesma ordem da lista de tasks.

Tasks não concluídas no timeout são canceladas.

Trate cada `Future` individualmente.

---

### 46. Evitar factories perigosamente genéricas

Exemplo:

```java
Executors.newFixedThreadPool(10);
```

Essa factory usa uma fila sem limite prático para muitos cenários.

Pode ser adequada em casos específicos, mas esconde decisões importantes.

No laboratório de produção, prefira construir `ThreadPoolExecutor` explicitamente.

Outro exemplo:

```java
Executors.newCachedThreadPool();
```

Pode criar muitas threads em resposta a demanda alta.

Não use sem compreender o risco.

---

### 47. Criar policy de failure

Arquivo:

```text
executor-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  rejectedTask:
    action:
      explicit

  ignoredFuture:
    action:
      fail-review

  swallowedExecutionException:
    action:
      fail-review

  queueSaturation:
    action:
      protect-upstream

  shutdownTimeout:
    action:
      shutdownNow-and-record

  threadLeak:
    action:
      fail-gate

  taskLeak:
    action:
      fail-gate

  CompletableFuture:
    deferredToLesson590
```

---

### 48. Criar data quality policy

Arquivo:

```text
executor-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unknownWorkload:
    result:
      inconclusive

  unknownDownstreamCapacity:
    result:
      limited

  missingQueueMetric:
    action:
      block-approval

  singleRun:
    result:
      limited

  timingOnlyAssertion:
    result:
      fragile

  staleThreadDump:
    result:
      limited
```

---

### 49. Criar security policy

Arquivo:

```text
executor-security-policy.yaml
```

Conteúdo:

```yaml
security:
  threadName:
    sensitiveData:
      forbidden

  context:
    credentials:
      forbidden

  queueInspection:
    rawTask:
      forbidden

  failureLog:
    businessPayload:
      forbidden

  threadDump:
    repository:
      forbidden
```

---

### 50. Criar cenários oficiais

Arquivo:

```text
executor-pool-scenarios.yaml
```

Cenários:

```text
execute-success;

execute-uncaught-failure;

submit-success;

submit-execution-failure;

future-timeout;

future-cancel-before-start;

future-cancel-running;

bounded-queue;

abort-policy;

caller-runs-policy;

CPU-bound-sizing;

IO-bound-sizing;

context-propagation;

context-cleanup;

graceful-shutdown;

forced-shutdown;

never-started-tasks;

thread-dump-correlation;

zero-thread-leak;

zero-task-leak.
```

Cada cenário registra:

- pool ID;
- workload;
- workers;
- queue;
- submissions;
- completed;
- failed;
- cancelled;
- rejected;
- shutdown;
- result;
- evidence.

---

### 51. Criar relatório baseline

Arquivo:

```text
executor-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  pool:
    id:
      order-enrichment

    core:
      4

    maximum:
      8

    queueCapacity:
      50

  workload:
    IO_BOUND

  metrics:
    activePeak:
      6

    queuePeak:
      12

    rejected:
      0

    completed:
      all-accepted

  shutdown:
    graceful:
      true

  result:
    PASS
```

Valores didáticos.

---

### 52. Criar matriz de testes

Arquivo:

```text
EXECUTOR_POOL_TEST_MATRIX.md
```

Cenários:

- Executor;
- ExecutorService;
- ThreadPoolExecutor;
- core size;
- maximum size;
- keep alive;
- bounded queue;
- ArrayBlockingQueue;
- AbortPolicy;
- CallerRunsPolicy;
- execute;
- submit Runnable;
- submit Callable;
- Future success;
- Future failure;
- Future timeout;
- cancel true;
- cancel false;
- invokeAll;
- context propagation;
- context cleanup;
- metrics;
- saturation;
- shutdown;
- shutdownNow;
- awaitTermination;
- never-started tasks;
- zero leaks;
- security;
- evidence.

---

### 53. Criar troubleshooting

Arquivo:

```text
EXECUTOR_POOL_TROUBLESHOOTING.md
```

Inclua:

- pool não cria workers acima do core;
- fila nunca enche;
- `maximumPoolSize` parece ignorado;
- rejection não aparece;
- `CallerRunsPolicy` aumenta latência;
- `Future.get()` trava;
- timeout não cancela;
- task ignora cancelamento;
- exceção de `submit` não aparece no handler;
- contexto vaza entre tasks;
- shutdown não termina;
- `shutdownNow()` não para;
- tasks nunca iniciadas são perdidas;
- thread dump sem prefixo útil;
- factory `Executors` criou fila ilimitada;
- `CompletableFuture` antecipada.

---

### 54. Criar gate

O gate valida:

- contrato;
- catálogo;
- workload;
- sizing;
- bounded workers;
- bounded queue;
- rejection;
- Future observado;
- timeout;
- cancelamento;
- contexto;
- exceções;
- métricas;
- shutdown;
- zero leaks;
- segurança.

Status:

```text
PASS;

FAIL_UNBOUNDED_POOL;

FAIL_UNBOUNDED_QUEUE;

FAIL_REJECTION;

FAIL_IGNORED_FUTURE;

FAIL_CANCELLATION;

FAIL_CONTEXT_LEAK;

FAIL_SHUTDOWN;

FAIL_THREAD_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 55. Coletar evidence

Script:

```text
collect-executor-pool-evidence.ps1
```

Arquivo:

```text
executor-pool-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- pool category;
- workload status;
- sizing status;
- queue status;
- rejection status;
- future status;
- cancellation status;
- context status;
- exception status;
- observability status;
- shutdown status;
- thread leak status;
- task leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- task payload;
- raw queue item;
- token;
- request ID;
- customer ID;
- order ID;
- stack bruto;
- thread dump bruto;
- `CompletableFuture`;
- material da aula 590.

---

### 56. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\executor-pools\validate-executor-pool-contract.ps1

.\scripts\concurrency\executor-pools\validate-executor-pool-catalog.ps1

.\scripts\concurrency\executor-pools\run-executor-baseline.ps1

.\scripts\concurrency\executor-pools\validate-executor-sizing.ps1

.\scripts\concurrency\executor-pools\validate-executor-queue-bound.ps1

.\scripts\concurrency\executor-pools\simulate-executor-saturation.ps1

.\scripts\concurrency\executor-pools\validate-executor-rejection.ps1

.\scripts\concurrency\executor-pools\validate-executor-futures.ps1

.\scripts\concurrency\executor-pools\validate-executor-cancellation.ps1

.\scripts\concurrency\executor-pools\validate-executor-context.ps1

.\scripts\concurrency\executor-pools\validate-executor-exceptions.ps1

.\scripts\concurrency\executor-pools\validate-executor-shutdown.ps1

.\scripts\concurrency\executor-pools\collect-executor-thread-dump.ps1

.\scripts\concurrency\executor-pools\scan-executor-output.ps1

.\scripts\concurrency\executor-pools\collect-executor-pool-evidence.ps1

.\scripts\concurrency\executor-pools\verify-executor-pool-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- workloads classificados;
- sizing documentado;
- workers bounded;
- fila bounded;
- rejection observável;
- `execute` e `submit` diferenciados;
- `Future` observado;
- timeouts aplicados;
- cancelamento validado;
- context cleanup aprovado;
- exceções aprovadas;
- métricas aprovadas;
- shutdown aprovado;
- zero thread leaks;
- zero task leaks;
- segurança aprovada;
- evidence sanitizada;
- `CompletableFuture` não antecipada.

---

### 57. Encerrar o laboratório

Confirme:

- todos os executors em `TERMINATED`;
- nenhuma task pendente;
- nenhuma fila residual;
- nenhuma worker viva;
- nenhum contexto residual;
- nenhum dump bruto no Git;
- relatórios sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/executor-pools `
  -Recurse `
  -Force
```

Preserve relatórios sanitizados.

---

## Entendendo o que foi feito

### Workers ganharam reutilização

A aplicação deixou de criar uma thread por task.

### Sizing ganhou workload

CPU-bound e I/O-bound passaram a orientar candidatos diferentes.

### Filas ganharam limite

Overload deixou de ser escondido por backlog infinito.

### Rejection ganhou contrato

A task deixou de desaparecer silenciosamente.

### `execute` e `submit` ganharam semânticas distintas

Falhas passaram a chegar pelo handler ou pelo `Future`.

### `Future` ganhou timeout

A espera pelo resultado deixou de ser indefinida.

### Cancelamento ganhou cooperação

`cancel(true)` passou a solicitar interrupção em vez de prometer parada instantânea.

### Contexto ganhou cleanup

Workers reutilizados deixaram de carregar dados residuais entre tasks.

### Métricas ganharam capacidade

Workers, active, queue, completed e rejected passaram a representar saturação.

### Shutdown ganhou sequência

Novas submissões são bloqueadas, tasks aceitas recebem tempo e o fallback é registrado.

### A próxima aula ganhou fronteira

A aula 590 irá compor tarefas assíncronas com `CompletableFuture`.

---

## Erros comuns importantes

### Usar pool ilimitado

O limite é transferido para threads, memória ou downstream.

### Usar fila ilimitada

`maximumPoolSize` pode nunca entrar em ação e a latência cresce na fila.

### Aumentar workers para corrigir banco lento

Mais concorrência pode piorar o banco.

### Ignorar `Future`

Falhas de `submit` podem ficar invisíveis.

### Chamar `get()` sem timeout

O chamador pode bloquear indefinidamente.

### Achar que timeout cancela

A task continua até cancelamento explícito ou término.

### Achar que `cancel(true)` força parada

A task precisa cooperar com interruption.

### Usar `DiscardPolicy` sem contrato

Trabalho pode desaparecer silenciosamente.

### Esquecer contexto em `ThreadLocal`

Dados podem vazar entre tasks reutilizando o mesmo worker.

### Não encerrar o pool

Workers non-daemon podem manter a JVM viva.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\concurrency\executor-pools\run-executor-baseline.ps1
```

### Simular saturação

```powershell
.\scripts\concurrency\executor-pools\simulate-executor-saturation.ps1
```

### Validar Futures

```powershell
.\scripts\concurrency\executor-pools\validate-executor-futures.ps1
```

### Validar rejeição

```powershell
.\scripts\concurrency\executor-pools\validate-executor-rejection.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\executor-pools\validate-executor-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Defina owner, workload, tamanho e fila.

### Parte 2 — Factory

Crie `ThreadPoolExecutor` bounded.

### Parte 3 — Queue

Valide capacidade e métricas.

### Parte 4 — Rejection

Compare `AbortPolicy` e `CallerRunsPolicy`.

### Parte 5 — Submit

Diferencie `execute` e `submit`.

### Parte 6 — Future

Valide sucesso, falha e timeout.

### Parte 7 — Cancellation

Teste `cancel(true)` e cooperação.

### Parte 8 — Context

Propague e limpe contexto.

### Parte 9 — Shutdown

Valide graceful e fallback.

### Parte 10 — Gate

Valide saturação, leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 588 e ponte para a aula 590 foram preservadas;
- `Executor`, `ExecutorService`, `ThreadPoolExecutor`, worker, core, maximum, keep alive, work queue, bounded queue, rejection, `Callable`, `Future`, `ExecutionException`, `TimeoutException`, `RejectedExecutionException`, `shutdown`, `shutdownNow` e `awaitTermination` foram definidos;
- contrato e catálogo de pools foram criados;
- workload CPU-bound, I/O-bound, mixed e unknown foi classificado;
- sizing considera CPU, espera, downstream, chegada e fila;
- valores arbitrariamente altos foram proibidos;
- `PoolConfiguration` valida limites;
- thread factory nomeia workers e instala handler;
- `ThreadPoolExecutor` usa fila bounded;
- `ArrayBlockingQueue`, `LinkedBlockingQueue` e `SynchronousQueue` foram diferenciadas;
- rejection policy é explícita e observável;
- `AbortPolicy` e `CallerRunsPolicy` foram validadas;
- descarte silencioso foi rejeitado para trabalho crítico;
- `execute` e `submit` foram diferenciados;
- falha de `submit` é observada pelo `Future`;
- `Future.get` usa timeout;
- timeout não é confundido com cancelamento;
- `ExecutionException`, `CancellationException` e interruption do chamador foram tratadas;
- cancelamento é cooperativo;
- `cancel(true)` solicita interruption;
- contexto de worker é propagado e limpo;
- `ThreadLocal` residual foi tratado como risco;
- métricas de pool, fila, tasks e rejeições foram criadas;
- saturação controlada foi simulada;
- shutdown segue `shutdown`, `awaitTermination`, `shutdownNow` e segunda espera;
- tasks nunca iniciadas foram contabilizadas;
- pools genéricos de `Executors` foram avaliados com cautela;
- policies de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, gate e evidence sanitizada estão presentes;
- zero thread leaks e zero task leaks foram validados;
- nenhum segredo, payload ou dump bruto foi commitado;
- `CompletableFuture` não foi implementada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/executor-pools `
  scripts/concurrency/executor-pools `
  docs/concurrency/executor-pools `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|requestId|rawThreadDump|taskPayload|CompletableFuture|thenApply|thenCompose|thenCombine|allOf|anyOf|ofVirtual"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar ExecutorService e pools"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- identificadores reais;
- payloads;
- filas brutas;
- dumps brutos;
- artifacts temporários;
- `CompletableFuture`;
- virtual threads;
- material da aula 590.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você substituiu criação repetida de threads por pools bounded e gerenciados.

Você trabalhou com:

```text
Executor;

ExecutorService;

ThreadPoolExecutor;

corePoolSize;

maximumPoolSize;

keepAliveTime;

work queue;

rejection;

execute;

submit;

Callable;

Future;

cancel;

context;

metrics;

shutdown.
```

Você comprovou que workers reutilizáveis reduzem o custo de criação, mas não eliminam a necessidade de limites; filas ilimitadas escondem overload; `maximumPoolSize` depende da estratégia de queue; rejection precisa ser explícita; falhas de `submit` precisam ser observadas pelo `Future`; timeout não cancela automaticamente; cancelamento depende de interruption cooperativa; contexto precisa ser removido entre tasks; e shutdown gerenciado precisa contabilizar tasks nunca iniciadas e terminar sem workers vivos.

A próxima aula será:

```text
590 - M18.35 - CompletableFuture
```

Nela, você irá criar e compor estágios assíncronos, diferenciar `runAsync` e `supplyAsync`, usar executors explícitos, encadear `thenApply`, `thenCompose`, `thenCombine`, tratar falhas, timeouts, cancelamento, `allOf`, `anyOf`, contexto e observabilidade.

Nenhum `CompletableFuture`, `runAsync`, `supplyAsync`, `thenApply`, `thenCompose`, `thenCombine`, `allOf`, `anyOf`, pipeline assíncrono ou callback funcional foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei pool bounded.
- [ ] Classifiquei workload.
- [ ] Limitei workers e fila.
- [ ] Configurei rejection.
- [ ] Diferenciei `execute` e `submit`.
- [ ] Observei `Future`.
- [ ] Validei cancelamento.
- [ ] Encerrei sem leaks.

---

## Troubleshooting adicional

### `maximumPoolSize` não é alcançado

A fila pode aceitar todas as tasks antes da criação de workers adicionais.

### A fila cresce continuamente

A taxa de chegada supera a taxa de processamento.

### Rejection nunca aparece

A fila pode estar ilimitada ou o cenário não saturou o pool.

### `CallerRunsPolicy` deixa o endpoint lento

A política aplica backpressure no chamador.

### A exceção desapareceu

Um `Future` retornado por `submit` pode não ter sido observado.

### Timeout retornou, mas a task continua

Cancele conforme o contrato e garanta cooperação.

### `shutdownNow()` não termina

A task pode ignorar interruption.

### Contexto de outra request apareceu

Limpe `ThreadLocal` e MDC em `finally`.

### A JVM continua viva

Algum executor não foi encerrado.

### Surgiu composição com callbacks

Preserve `CompletableFuture` para a aula 590.

---

## Perguntas de revisão

1. O que é `Executor`?
2. O que é `ExecutorService`?
3. O que é `ThreadPoolExecutor`?
4. O que é core pool size?
5. O que é maximum pool size?
6. O que é work queue?
7. Por que a fila deve ser bounded?
8. O que é rejection policy?
9. Qual diferença entre `execute` e `submit`?
10. O que é `Callable`?
11. O que é `Future`?
12. Por que usar timeout em `get`?
13. Timeout cancela a task?
14. O que faz `cancel(true)`?
15. Qual risco de `ThreadLocal`?
16. O que faz `shutdown()`?
17. O que faz `shutdownNow()`?
18. O que faz `awaitTermination()`?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Abstração de execução.
2. Executor com lifecycle e futures.
3. Pool configurável.
4. Quantidade base de workers.
5. Máximo de workers.
6. Fila de tasks aguardando.
7. Para limitar backlog e memória.
8. Resposta quando não há capacidade.
9. Sem Future versus com Future.
10. Task com resultado ou exceção.
11. Resultado potencial.
12. Evitar espera indefinida.
13. Não.
14. Solicita interruption se estiver executando.
15. Vazamento entre tasks.
16. Para novas submissões e drena aceitas.
17. Tenta interromper e devolve não iniciadas.
18. Aguarda término bounded.
19. CompletableFuture.
20. CompletableFuture.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 589 - M18.34 - ExecutorService pools

- Continuei após Threads e Runnable.
- Entendi `Executor`, `ExecutorService` e `ThreadPoolExecutor`.
- Classifiquei workloads CPU-bound, I/O-bound e mixed.
- Criei contrato e catálogo de pools.
- Modelei sizing por CPU, espera, downstream e chegada.
- Criei configuração tipada.
- Criei thread factory nomeada.
- Criei rejection handler observável.
- Configurei workers e fila bounded.
- Comparei `ArrayBlockingQueue`, `LinkedBlockingQueue` e `SynchronousQueue`.
- Validei `AbortPolicy` e `CallerRunsPolicy`.
- Diferenciei `execute` e `submit`.
- Criei `Callable` e observei resultados por `Future`.
- Tratei sucesso, falha, timeout e cancelamento.
- Confirmei que timeout não cancela automaticamente.
- Validei `cancel(true)` e interruption cooperativa.
- Propaguei e limpei contexto entre tasks.
- Criei métricas de workers, fila, tasks e rejeição.
- Simulei saturação do executor.
- Implementei shutdown graceful e fallback com `shutdownNow`.
- Contabilizei tasks nunca iniciadas.
- Validei zero thread leaks e zero task leaks.
- Coletei evidence sanitizada.
- Não antecipei CompletableFuture.
- Próxima aula: CompletableFuture.
```

---

## Referência técnica curta

- Java `Executor`.
- Java `ExecutorService`.
- Java `ThreadPoolExecutor`.
- Blocking queues.
- Rejected execution handlers.
- Java `Callable`.
- Java `Future`.
- Task cancellation.
- Executor observability.
- Executor shutdown.

Regra final:

```text
ExecutorService e pools precisam transformar concorrência em capacidade explicitamente limitada: todo executor possui owner, workload classificado, core e maximum sizing, thread factory nomeada, fila bounded, rejection policy, timeout, métricas e shutdown, enquanto filas ilimitadas e pools arbitrariamente grandes são proibidos porque escondem overload ou transferem saturação ao downstream; execute e submit possuem tratamento de falha diferente, todo Future crítico é observado com timeout, ExecutionException é desembrulhada e timeout não é confundido com cancelamento, pois cancel(true) apenas solicita interruption e a task precisa cooperar; workers reutilizados exigem propagação e limpeza de contexto, saturação é medida por active, queue, wait, completed e rejected, e o encerramento segue shutdown, awaitTermination, shutdownNow, contabilização de tasks nunca iniciadas e nova espera bounded, terminando com zero thread leaks e zero task leaks; composição assíncrona, callbacks e pipelines ficam para a aula 590 com CompletableFuture.
```
