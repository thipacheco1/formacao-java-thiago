# 591 - M18.36 - Virtual threads

## Apresentação da aula

Na aula 590, você evoluiu do `Future` clássico para pipelines assíncronos com:

```text
CompletableFuture;

runAsync;

supplyAsync;

thenApply;

thenCompose;

thenCombine;

allOf;

anyOf;

timeouts;

tratamento de falhas;

context propagation;

shutdown.
```

Você também reforçou uma regra importante:

```text
concorrência
não cria capacidade infinita.
```

Executors, filas, timeouts e recursos downstream continuaram limitando o sistema.

Nesta aula, você irá estudar **virtual threads**, recurso disponível no Java 21 para simplificar aplicações com muitas operações bloqueantes.

A pergunta central será:

```text
como atender
grande quantidade
de tarefas bloqueantes

com código sequencial,

sem criar
um grande pool
de platform threads

e sem ultrapassar
a capacidade
do banco,
Redis,
Kafka
ou APIs externas?
```

Uma virtual thread é uma thread gerenciada pela JVM, criada para ser leve e barata em comparação com uma platform thread tradicional.

A ideia principal é permitir:

```text
uma virtual thread
por tarefa.
```

Em vez de manter poucas threads de plataforma executando muitos callbacks ou pipelines complexos, você pode escrever código sequencial:

```java
Order order =
        orderClient.load(orderId);

Customer customer =
        customerClient.load(
                order.customerId());

Policy policy =
        policyClient.load(
                customer.policyId());

return decisionService.decide(
        order,
        customer,
        policy);
```

Quando uma operação bloqueante compatível aguarda I/O, a JVM pode desmontar temporariamente a virtual thread da platform thread que a estava executando.

A platform thread fica disponível para executar outra virtual thread.

Esse comportamento é chamado, conceitualmente, de:

```text
mount;

unmount;

park;

resume.
```

A platform thread que executa virtual threads é frequentemente chamada de **carrier thread**.

A relação conceitual é:

```text
muitas virtual threads;

poucas carrier threads.
```

Virtual thread não é gratuita: cada task ainda consome memória, CPU, contexto, conexões, sockets, capacidade downstream, métricas e tempo de shutdown.

Virtual threads melhoram principalmente a escalabilidade de workloads que passam bastante tempo bloqueados em I/O.

Elas não aumentam automaticamente a velocidade de tarefas CPU-bound.

Se uma tarefa executa cálculo pesado durante dez segundos, ela ocupa CPU durante dez segundos, seja virtual ou platform thread.

Elas também não eliminam contenção, races, deadlocks, limites, idempotência, timeout, cancelamento, backpressure ou observabilidade.

Nesta aula, você irá comparar:

```text
platform thread por task;

pool bounded de platform threads;

virtual thread por task.
```

O foco será um workload bloqueante sintético que simula:

- consulta ao PostgreSQL;
- consulta a Redis;
- chamada HTTP;
- espera por Kafka;
- leitura de arquivo;
- timeout;
- cancelamento;
- shutdown.

O laboratório será executado em Java 21.

Você irá utilizar:

```java
Thread.ofVirtual();

Thread.startVirtualThread(...);

Executors.newVirtualThreadPerTaskExecutor();
```

Também irá observar `isVirtual`, naming, carriers, parking, pinning, ThreadLocal, limites downstream, timeout, interruption, shutdown, dumps, JFR e comparação com pools.

O uso de `Semaphore` aparecerá apenas como mecanismo de **limitação de concorrência downstream**.

A implementação detalhada de sincronização, locks e estruturas atômicas pertence à próxima aula:

```text
592 - M18.37 - Sincronizacao locks atomic
```

Nesta aula, você não irá aprofundar:

- monitor intrinsic;
- `synchronized` como mecanismo de exclusão;
- `ReentrantLock`;
- `ReadWriteLock`;
- `StampedLock`;
- `Condition`;
- `AtomicInteger`;
- `AtomicReference`;
- `LongAdder`;
- compare-and-set;
- memory fences;
- lock fairness;
- lock striping;
- spin lock.

A regra central será:

```text
virtual threads
barateiam espera bloqueante;

não barateiam
o recurso downstream
que está sendo esperado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
589:
ExecutorService pools.

590:
CompletableFuture.

591:
Virtual threads.

592:
Sincronizacao locks atomic.
```

A progressão é:

```text
reutilizar platform threads;

compor estágios assíncronos;

usar thread-per-task leve;

coordenar estado compartilhado.
```

Nesta aula:

```text
Java 21:
sim.

virtual threads:
sim.

Thread.ofVirtual:
sim.

startVirtualThread:
sim.

newVirtualThreadPerTaskExecutor:
sim.

thread-per-task:
sim.

carrier threads:
sim.

parking:
sim.

pinning:
sim.

blocking I/O:
sim.

CPU-bound:
comparação.

ThreadLocal:
sim.

limite downstream:
sim.

observabilidade:
sim.

shutdown:
sim.

locks explícitos:
não aprofundar.

atomics:
não aprofundar.

race condition:
não reproduzir como tema central.

deadlock:
não reproduzir deliberadamente.
```

Você reutilizará:

- threads;
- `Runnable`;
- `Callable`;
- `ExecutorService`;
- `Future`;
- interruption;
- timeouts;
- pools;
- HikariCP;
- Redis;
- Kafka;
- load testing;
- stress testing;
- thread dumps;
- JFR;
- logs;
- traces;
- runbooks.

A implementação precisa preservar correção, limites downstream, timeout, cancelamento, contexto, segurança, observabilidade, shutdown e zero leaks.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/virtual-threads
├── virtual-thread-contract.yaml
├── virtual-thread-workload-catalog.yaml
├── virtual-thread-adoption-policy.yaml
├── virtual-thread-downstream-policy.yaml
├── virtual-thread-pinning-policy.yaml
├── virtual-thread-threadlocal-policy.yaml
├── virtual-thread-timeout-policy.yaml
├── virtual-thread-cancellation-policy.yaml
├── virtual-thread-observability-policy.yaml
├── virtual-thread-shutdown-policy.yaml
├── virtual-thread-regression-policy.yaml
├── virtual-thread-data-quality-policy.yaml
├── virtual-thread-security-policy.yaml
├── virtual-thread-failure-policy.yaml
├── virtual-thread-scenarios.yaml
└── virtual-thread-evidence.yaml

concurrency/virtual-threads/src/main/java
└── br/com/formacao/concurrency/virtualthreads
    ├── WorkloadProfile.java
    ├── VirtualThreadEvent.java
    ├── VirtualThreadRecorder.java
    ├── BlockingOrderSource.java
    ├── SyntheticBlockingOrderSource.java
    ├── VirtualThreadTask.java
    ├── VirtualThreadLauncher.java
    ├── VirtualThreadPerTaskService.java
    ├── DownstreamConcurrencyLimiter.java
    ├── VirtualThreadContext.java
    ├── ContextAwareVirtualTask.java
    ├── VirtualThreadShutdownResult.java
    ├── VirtualThreadShutdownManager.java
    ├── VirtualThreadComparison.java
    └── VirtualThreadDemo.java

concurrency/virtual-threads/src/test/java
└── br/com/formacao/concurrency/virtualthreads
    ├── VirtualThreadCreationTest.java
    ├── VirtualThreadPerTaskExecutorTest.java
    ├── VirtualThreadBlockingTest.java
    ├── VirtualThreadCpuBoundTest.java
    ├── VirtualThreadDownstreamLimitTest.java
    ├── VirtualThreadInterruptionTest.java
    ├── VirtualThreadContextTest.java
    ├── VirtualThreadPinningTest.java
    ├── VirtualThreadShutdownTest.java
    └── VirtualThreadNoLeakTest.java

concurrency/virtual-threads/reports
├── virtual-thread-baseline-report.yaml
├── virtual-thread-comparison-report.yaml
├── virtual-thread-downstream-report.yaml
├── virtual-thread-pinning-report.yaml
├── virtual-thread-context-report.yaml
├── virtual-thread-shutdown-report.yaml
└── virtual-thread-gate-report.yaml

scripts/concurrency/virtual-threads
├── validate-virtual-thread-contract.ps1
├── validate-virtual-thread-workload.ps1
├── run-virtual-thread-baseline.ps1
├── compare-platform-and-virtual-threads.ps1
├── validate-virtual-thread-downstream-limit.ps1
├── detect-virtual-thread-pinning.ps1
├── validate-virtual-thread-threadlocal.ps1
├── validate-virtual-thread-timeouts.ps1
├── validate-virtual-thread-cancellation.ps1
├── validate-virtual-thread-observability.ps1
├── validate-virtual-thread-shutdown.ps1
├── collect-virtual-thread-dump.ps1
├── collect-virtual-thread-jfr.ps1
├── scan-virtual-thread-output.ps1
├── collect-virtual-thread-evidence.ps1
└── verify-virtual-thread-baseline.ps1

docs/concurrency/virtual-threads
├── VIRTUAL_THREADS_OVERVIEW.md
├── PLATFORM_VS_VIRTUAL_THREADS.md
├── VIRTUAL_THREAD_PER_TASK.md
├── BLOCKING_AND_PARKING.md
├── VIRTUAL_THREAD_PINNING.md
├── VIRTUAL_THREADS_AND_DOWNSTREAM_LIMITS.md
├── VIRTUAL_THREADS_AND_THREADLOCAL.md
├── VIRTUAL_THREAD_OBSERVABILITY.md
├── VIRTUAL_THREAD_TEST_MATRIX.md
└── VIRTUAL_THREAD_TROUBLESHOOTING.md
```

Ao final, você terá contrato de adoção, catálogo, thread-per-task, comparação, limites downstream, pinning, contexto, timeout, cancelamento, shutdown, gate e evidence sanitizada.

---

## Conceito essencial

### Virtual thread

Thread leve gerenciada pela JVM, adequada para grande quantidade de tarefas bloqueantes.

---

### Platform thread

Thread tradicional associada a uma thread do sistema operacional.

---

### Carrier thread

Platform thread usada pela JVM para executar virtual threads.

---

### Mount

Associação temporária entre virtual thread e carrier thread.

---

### Unmount

Liberação da carrier thread enquanto a virtual thread aguarda.

---

### Park

Suspensão lógica de uma virtual thread até que possa continuar.

---

### Thread-per-task

Modelo em que cada unidade de trabalho recebe sua própria thread.

---

### Blocking operation

Operação que aguarda I/O, lock, fila, timeout ou outro evento.

---

### Pinning

Situação em que uma virtual thread bloqueada permanece associada à carrier thread.

---

### Downstream limit

Capacidade real do banco, Redis, API, broker ou outro recurso externo.

---

### `Thread.isVirtual()`

Indica se a thread é virtual.

---

### `Thread.ofVirtual()`

Builder para criação de virtual threads.

---

### `Thread.startVirtualThread(...)`

Cria e inicia uma virtual thread para a task informada.

---

### Virtual-thread-per-task executor

Executor que cria uma virtual thread para cada task aceita.

---

### ThreadLocal

Contexto associado a uma thread.

Em virtual threads, continua existindo e precisa de cleanup.

---

### CPU-bound

Trabalho limitado principalmente por CPU.

Virtual threads não aumentam a quantidade de processadores.

---

### I/O-bound

Trabalho com grande proporção de espera.

É o principal candidato para virtual threads.

---

## Mão na massa guiada

### 1. Validar Java 21

Execute:

```powershell
java `
  -version

javac `
  -version
```

Confirme:

```text
Java 21.
```

Depois:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Confirme:

- aula 590 validada;
- executors encerrados;
- zero task leaks;
- zero thread leaks;
- ambiente autorizado;
- nenhuma configuração real de produção será usada.

---

### 2. Criar contrato

Arquivo:

```text
virtual-thread-contract.yaml
```

Conteúdo:

```yaml
virtualThreads:
  required:
    - workload
    - owner
    - Java-version
    - task-boundary
    - downstream-limits
    - timeout
    - cancellation
    - ThreadLocal-policy
    - pinning-policy
    - observability
    - shutdown

  adoption:
    blockingWorkload:
      preferredCandidate

    CPUBoundWorkload:
      benchmarkBeforeAdoption

  downstream:
    unlimitedConcurrency:
      forbidden

  tests:
    zeroTaskLeak:
      required

    zeroResourceLeak:
      required

  forbiddenInLesson591:
    - explicit-lock-design
    - atomic-design
    - intentional-deadlock

  nextLesson:
    code:
      M18.37
```

---

### 3. Criar catálogo de workloads

Arquivo:

```text
virtual-thread-workload-catalog.yaml
```

Exemplo:

```yaml
workloads:
  - id:
      ORDER-DETAIL

    owner:
      orders-api

    profile:
      IO_BOUND

    blocking:
      - PostgreSQL
      - Redis
      - HTTP

    taskBoundary:
      request

    expectedConcurrency:
      high

    downstreamLimits:
      databaseConnections:
        bounded

      HTTPConcurrency:
        bounded

  - id:
      PRICE-CALCULATION

    owner:
      pricing

    profile:
      CPU_BOUND

    blocking:
      none

    virtualThreadCandidate:
      benchmark-required
```

---

### 4. Criar enum de profile

```java
public enum WorkloadProfile {
    IO_BOUND,
    CPU_BOUND,
    MIXED,
    UNKNOWN
}
```

Virtual threads são candidatas naturais para `IO_BOUND`.

Para `CPU_BOUND`, a quantidade de CPU continua limitada.

---

### 5. Criar policy de adoção

Arquivo:

```text
virtual-thread-adoption-policy.yaml
```

Conteúdo:

```yaml
adoption:
  evaluate:
    - blocking-ratio
    - request-concurrency
    - downstream-capacity
    - latency
    - memory
    - ThreadLocal-usage
    - pinning
    - observability
    - shutdown

  preferred:
    - simple-blocking-code
    - independent-request-task
    - bounded-external-resources

  avoidBlindMigration:
    true

  existingAsyncPipeline:
    rewriteOnlyWithEvidence:
      true

  productionRollout:
    gradual:
      required
```

---

### 6. Criar evento de observação

```java
public record VirtualThreadEvent(
        String category,
        String threadName,
        boolean virtual,
        Thread.State state,
        Instant occurredAt) {
}
```

---

### 7. Criar recorder

```java
public final class VirtualThreadRecorder {

    private final List<VirtualThreadEvent> events =
            Collections.synchronizedList(
                    new ArrayList<>());

    public void record(String category) {
        Thread current =
                Thread.currentThread();

        events.add(
                new VirtualThreadEvent(
                        category,
                        current.getName(),
                        current.isVirtual(),
                        current.getState(),
                        Instant.now()));
    }

    public List<VirtualThreadEvent> snapshot() {
        synchronized (events) {
            return List.copyOf(events);
        }
    }
}
```

---

### 8. Criar primeira virtual thread

```java
VirtualThreadRecorder recorder =
        new VirtualThreadRecorder();

Thread thread =
        Thread.ofVirtual()
                .name(
                        "orders-vt-demo")
                .start(
                        () -> {
                            recorder.record(
                                    "START");

                            recorder.record(
                                    "FINISH");
                        });

thread.join();
```

Valide:

```java
assertTrue(
        recorder.snapshot()
                .stream()
                .allMatch(
                        VirtualThreadEvent::virtual));
```

---

### 9. Usar `startVirtualThread`

```java
Thread thread =
        Thread.startVirtualThread(
                () ->
                        recorder.record(
                                "STARTED_DIRECTLY"));

thread.join();
```

Esse método é conveniente para criação e início imediato.

Para naming controlado, o builder costuma ser mais explícito.

---

### 10. Validar `isVirtual`

```java
assertTrue(
        thread.isVirtual());
```

Compare com:

```java
Thread platform =
        new Thread(
                () -> {
                });

assertFalse(
        platform.isVirtual());
```

---

### 11. Criar task bloqueante sintética

```java
public final class VirtualThreadTask
        implements Callable<String> {

    private final Duration blockingTime;
    private final VirtualThreadRecorder recorder;

    public VirtualThreadTask(
            Duration blockingTime,
            VirtualThreadRecorder recorder) {
        this.blockingTime = blockingTime;
        this.recorder = recorder;
    }

    @Override
    public String call()
            throws Exception {

        recorder.record(
                "TASK_START");

        try {
            Thread.sleep(
                    blockingTime.toMillis());

            recorder.record(
                    "TASK_SUCCESS");

            return Thread.currentThread()
                    .getName();

        } finally {
            recorder.record(
                    "TASK_FINISH");
        }
    }
}
```

O `sleep` representa espera bloqueante controlada.

---

### 12. Criar executor por task

```java
try (ExecutorService executor =
        Executors
                .newVirtualThreadPerTaskExecutor()) {

    Future<String> future =
            executor.submit(
                    new VirtualThreadTask(
                            Duration.ofMillis(100),
                            recorder));

    String threadName =
            future.get(
                    1,
                    TimeUnit.SECONDS);
}
```

O executor cria uma virtual thread para cada task.

O bloco `try` fecha o executor ao final.

---

### 13. Entender que não é um pool tradicional

`newVirtualThreadPerTaskExecutor()` não mantém um pequeno conjunto fixo de virtual threads para reutilização.

O modelo é:

```text
uma task aceita;

uma virtual thread criada;

task termina;

virtual thread termina.
```

A JVM administra a execução sobre carrier threads.

---

### 14. Criar serviço thread-per-task

```java
public final class VirtualThreadPerTaskService
        implements AutoCloseable {

    private final ExecutorService executor =
            Executors
                    .newVirtualThreadPerTaskExecutor();

    public <T> Future<T> submit(
            Callable<T> task) {
        return executor.submit(task);
    }

    @Override
    public void close() {
        executor.close();
    }
}
```

---

### 15. Comparar platform e virtual threads

Cenário didático:

```text
1.000 tasks;

cada task:
100 ms de espera;

trabalho CPU:
mínimo.
```

Compare:

- fixed pool com 20 platform threads;
- uma platform thread por task;
- virtual thread por task.

Meça:

- tempo total;
- threads criadas;
- heap;
- CPU;
- context switching;
- failures;
- tasks concluídas;
- shutdown.

Avalie o conjunto de métricas.

---

### 16. Criar script de comparação

Script:

```text
compare-platform-and-virtual-threads.ps1
```

Perfis:

```text
PLATFORM_FIXED_POOL;

PLATFORM_THREAD_PER_TASK;

VIRTUAL_THREAD_PER_TASK.
```

Classifique resultados:

```text
PASS;

FAIL_RESOURCE;

FAIL_TIMEOUT;

INCONCLUSIVE.
```

---

### 17. Explicar blocking e parking

Quando uma virtual thread chama uma operação bloqueante suportada, a JVM pode estacioná-la.

Conceitualmente:

```text
virtual thread A
espera rede;

carrier liberada;

virtual thread B
executa;

rede responde;

virtual thread A
retoma.
```

Esse comportamento permite alta concorrência bloqueante sem uma platform thread dedicada para cada espera.

---

### 18. Comparar CPU-bound

Cenário:

```text
1.000 tasks;

cada task:
cálculo intenso;

quase nenhuma espera.
```

Virtual threads não criam mais CPU.

Espere CPU próxima do limite, throughput limitado pelos processadores e nenhuma vantagem automática.

---

### 19. Criar policy downstream

Arquivo:

```text
virtual-thread-downstream-policy.yaml
```

Conteúdo:

```yaml
downstream:
  required:
    - resource
    - capacity
    - timeout
    - concurrency-limit
    - rejection-or-wait-policy
    - metrics

  database:
    limitBy:
      connection-pool

  HTTP:
    limitBy:
      dependency-capacity

  Redis:
    limitBy:
      connection-and-command-budget

  Kafka:
    limitBy:
      partitions-and-consumer-capacity

  unlimitedVirtualThreadsToLimitedResource:
    forbidden
```

---

### 20. Entender o principal risco

Com platform pool bounded:

```text
20 workers
limitam implicitamente
a concorrência.
```

Com virtual thread por task:

```text
10.000 tasks
podem tentar acessar
o mesmo banco.
```

Se HikariCP possui:

```text
20 conexões,
```

as demais tasks aguardam conexão.

Isso pode ser aceitável se:

- timeout for bounded;
- fila de espera for observável;
- memória permanecer saudável;
- cancellation funcionar;
- request budget for respeitado.

Mas não é capacidade infinita.

---

### 21. Criar limiter downstream

```java
public final class DownstreamConcurrencyLimiter {

    private final Semaphore permits;

    public DownstreamConcurrencyLimiter(
            int maximumConcurrency) {

        this.permits =
                new Semaphore(
                        maximumConcurrency);
    }

    public <T> T execute(
            Callable<T> action,
            Duration timeout)
            throws Exception {

        boolean acquired =
                permits.tryAcquire(
                        timeout.toMillis(),
                        TimeUnit.MILLISECONDS);

        if (!acquired) {
            throw new TimeoutException(
                    "Downstream permit timeout");
        }

        try {
            return action.call();
        } finally {
            permits.release();
        }
    }
}
```

O semáforo será usado apenas como limite.

Seus detalhes internos serão aprofundados na aula 592.

---

### 22. Validar limite downstream

Cenário:

```text
tasks:
1.000.

virtual threads:
1.000.

permits:
20.

downstream:
sintético.
```

Confirme máximo simultâneo próximo de 20, timeout observado, permits liberados, zero tasks pendentes e shutdown completo.

---

### 23. Criar script de limite

Script:

```text
validate-virtual-thread-downstream-limit.ps1
```

Registre submissões, conclusões, timeouts, concorrência máxima, espera por permit, latência downstream, shutdown e leaks.

---

### 24. Criar policy de timeout

Arquivo:

```text
virtual-thread-timeout-policy.yaml
```

Conteúdo:

```yaml
timeout:
  request:
    required

  blockingOperation:
    required

  downstreamPermit:
    required

  FutureGet:
    bounded:
      required

  timeoutDoesNotCreateCapacity:
    true

  retryAfterTimeout:
    evaluate:
      required
```

---

### 25. Aplicar timeout por jornada

Exemplo:

```text
request budget:
800 ms.

permit:
50 ms.

database:
250 ms.

HTTP:
300 ms.

assembly:
50 ms.

margin:
150 ms.
```

Timeouts internos precisam caber no budget total.

---

### 26. Criar policy de cancellation

Arquivo:

```text
virtual-thread-cancellation-policy.yaml
```

Conteúdo:

```yaml
cancellation:
  cooperative:
    required

  interruption:
    observe:
      required

  blockingOperation:
    interruptibleWhenSupported:
      true

  ownedChildTask:
    cancelOnParentCancellation:
      required

  partialEffects:
    contract:
      required

  swallowedInterrupt:
    forbidden
```

---

### 27. Validar interruption

```java
Future<String> future =
        executor.submit(
                new VirtualThreadTask(
                        Duration.ofSeconds(5),
                        recorder));

Thread.sleep(50);

future.cancel(true);
```

Confirme:

- future cancelada;
- virtual thread observou interrupção;
- cleanup executado;
- permit liberado;
- executor encerrou;
- nenhuma task residual.

---

### 28. Não confundir virtual thread com cancelamento automático

Virtual threads continuam usando o modelo cooperativo de interruption.

Código que ignora interrupção continua problemático.

Bibliotecas chamadas também precisam respeitar timeout e cancelamento.

---

### 29. Criar policy de pinning

Arquivo:

```text
virtual-thread-pinning-policy.yaml
```

Conteúdo:

```yaml
pinning:
  detect:
    required

  commonCauses:
    - blocking-inside-synchronized
    - native-or-foreign-call

  longBlockingInsideMonitor:
    avoid:
      true

  shortCriticalSection:
    evaluateByMeasurement

  evidence:
    JFR:
      requiredWhenSuspected

  conclusion:
    singleOccurrence:
      insufficient
```

---

### 30. Entender pinning

Uma virtual thread pode permanecer montada na carrier thread durante certas operações.

O caso mais conhecido é bloqueio prolongado enquanto executa dentro de um bloco `synchronized`.

Exemplo conceitual:

```java
synchronized (monitor) {
    blockingHttpCall();
}
```

Enquanto a chamada bloqueia, a carrier pode ficar presa à virtual thread.

O problema não é o uso isolado de `synchronized`.

O risco é bloquear por muito tempo dentro de uma região que impede o unmount.

---

### 31. Criar cenário de pinning controlado

Use laboratório sintético, tempo curto e sem deadlock.

Compare:

```text
blocking fora do monitor;

blocking dentro do monitor.
```

Meça:

- duração;
- carrier utilization;
- eventos JFR;
- throughput;
- latência;
- tasks concluídas.

Não transforme o exemplo em recomendação de lock.

---

### 32. Detectar pinning

Script:

```text
detect-virtual-thread-pinning.ps1
```

Use JFR local com eventos relevantes.

Exemplo de execução:

```powershell
java `
  -XX:StartFlightRecording=filename=.tmp/virtual-threads.jfr,duration=30s `
  -jar `
  target/virtual-threads-lab.jar
```

Depois, analise no JDK Mission Control.

---

### 33. Criar policy de ThreadLocal

Arquivo:

```text
virtual-thread-threadlocal-policy.yaml
```

Conteúdo:

```yaml
ThreadLocal:
  allowed:
    withExplicitLifecycle

  capture:
    required

  cleanup:
    finally:
      required

  largeValue:
    forbidden

  credential:
    forbidden

  inheritance:
    evaluate:
      required

  millionsOfThreads:
    memoryImpact:
      measure
```

---

### 34. Entender ThreadLocal em virtual threads

Cada virtual thread pode possuir seus próprios valores.

Isso facilita isolamento, mas uma grande quantidade de virtual threads com valores grandes pode consumir muita memória.

Não armazene payloads, tokens, entidades, grandes coleções, buffers ou objetos de sessão.

---

### 35. Criar contexto pequeno

```java
public record VirtualThreadContext(
        String correlationCategory,
        Instant deadline) {
}
```

Use um holder:

```java
private static final ThreadLocal<
        VirtualThreadContext> CONTEXT =
        new ThreadLocal<>();
```

---

### 36. Criar task context-aware

```java
public final class ContextAwareVirtualTask
        implements Runnable {

    private final VirtualThreadContext context;
    private final Runnable delegate;

    public ContextAwareVirtualTask(
            VirtualThreadContext context,
            Runnable delegate) {
        this.context = context;
        this.delegate = delegate;
    }

    @Override
    public void run() {
        try {
            CONTEXT.set(context);
            delegate.run();
        } finally {
            CONTEXT.remove();
        }
    }
}
```

Cleanup continua obrigatório.

---

### 37. Validar contexto

Cenários:

- contexto A;
- contexto B;
- task sem contexto;
- task cancelada;
- task com falha;
- cleanup em `finally`;
- ausência de valor residual;
- ausência de dados sensíveis.

---

### 38. Criar policy de observabilidade

Arquivo:

```text
virtual-thread-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  tasks:
    required:
      - submitted
      - started
      - completed
      - failed
      - cancelled
      - timed-out

  downstream:
    required:
      - permits-used
      - permit-wait
      - connection-wait
      - command-latency
      - rejection

  runtime:
    required:
      - virtual-thread-count-category
      - carrier-utilization-category
      - pinning-events
      - CPU
      - memory
      - GC

  labels:
    forbidden:
      - thread-id
      - request-id
      - order-id
      - customer-id

  rawDump:
    repository:
      forbidden
```

---

### 39. Entender observabilidade de alta cardinalidade

Não crie uma série métrica por virtual thread.

Virtual threads podem existir em grande quantidade.

Prefira agregações:

- tasks ativas;
- tasks concluídas;
- tasks em espera por downstream;
- timeout;
- cancelamento;
- pinning;
- duração por categoria;
- concorrência por recurso;
- memória;
- CPU;
- GC.

---

### 40. Coletar thread dump

Script:

```text
collect-virtual-thread-dump.ps1
```

Use:

```powershell
jcmd `
  $processId `
  Thread.dump_to_file `
  -format=json `
  .tmp/virtual-thread-dump.json
```

Não versione o dump bruto.

Extraia apenas:

- contagens;
- categorias;
- estados;
- stacks sanitizadas;
- horário;
- cenário.

---

### 41. Coletar JFR

Script:

```text
collect-virtual-thread-jfr.ps1
```

Registre:

- janela;
- workload;
- task count;
- pinning category;
- CPU;
- allocation;
- monitor events;
- thread park;
- GC;
- release.

Não inclua dados de negócio.

---

### 42. Criar policy de shutdown

Arquivo:

```text
virtual-thread-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewTasks:
    required

  executor:
    closeOrShutdown:
      required

  inFlight:
    wait:
      bounded:
        required

  timeout:
    cancel:
      explicit

  downstreamPermit:
    release:
      required

  context:
    cleanup:
      required

  zeroTaskLeak:
    required
```

---

### 43. Criar resultado de shutdown

```java
public record VirtualThreadShutdownResult(
        boolean terminated,
        int completed,
        int cancelled,
        int failed,
        Duration waitTime) {
}
```

---

### 44. Criar shutdown manager

```java
public final class VirtualThreadShutdownManager {

    public VirtualThreadShutdownResult shutdown(
            ExecutorService executor,
            List<? extends Future<?>> futures,
            Duration timeout) {

        Instant started =
                Instant.now();

        executor.shutdown();

        int completed = 0;
        int cancelled = 0;
        int failed = 0;

        for (Future<?> future : futures) {
            try {
                future.get(
                        timeout.toMillis(),
                        TimeUnit.MILLISECONDS);
                completed++;
            } catch (TimeoutException exception) {
                future.cancel(true);
                cancelled++;
            } catch (CancellationException exception) {
                cancelled++;
            } catch (ExecutionException exception) {
                failed++;
            } catch (InterruptedException exception) {
                future.cancel(true);
                Thread.currentThread()
                        .interrupt();
                cancelled++;
                break;
            }
        }

        boolean terminated;

        try {
            terminated =
                    executor.awaitTermination(
                            timeout.toMillis(),
                            TimeUnit.MILLISECONDS);
        } catch (InterruptedException exception) {
            Thread.currentThread()
                    .interrupt();
            terminated = false;
        }

        return new VirtualThreadShutdownResult(
                terminated,
                completed,
                cancelled,
                failed,
                Duration.between(
                        started,
                        Instant.now()));
    }
}
```

O timeout por lista precisa ser refinado para usar deadline global.

---

### 45. Usar deadline global

Em vez de aplicar o timeout inteiro a cada future:

```text
10 futures × 1 segundo
pode esperar até 10 segundos.
```

Calcule o tempo restante:

```java
Instant deadline =
        Instant.now().plus(timeout);

Duration remaining =
        Duration.between(
                Instant.now(),
                deadline);
```

Cada espera usa apenas o budget restante.

---

### 46. Criar policy de regressão

Arquivo:

```text
virtual-thread-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - throughput
    - p95
    - p99
    - CPU
    - memory
    - GC
    - platform-thread-count
    - downstream-wait
    - timeout-rate
    - pinning
    - recovery-time

  sameWorkload:
    required

  sameDownstreamLimits:
    required

  moreThroughputWithMoreDownstreamOverload:
    reject:
      true

  CPUOnlyImprovementClaim:
    requireEvidence:
      true
```

---

### 47. Comparar perfis

Perfis:

```text
platform fixed pool;

CompletableFuture com pools;

virtual thread per task.
```

Compare apenas com:

- mesmo workload;
- mesmos dados;
- mesmos limites;
- mesmo ambiente;
- mesma duração;
- mesmos budgets.

---

### 48. Criar failure policy

Arquivo:

```text
virtual-thread-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  unlimitedDownstreamConcurrency:
    action:
      reject-design

  pinningSuspected:
    action:
      collect-JFR

  swallowedInterrupt:
    action:
      fail-review

  ThreadLocalLeak:
    action:
      fail-gate

  executorNotClosed:
    action:
      fail-gate

  resourceLeak:
    action:
      fail-gate

  CPUOnlyWorkload:
    action:
      benchmark-before-adoption

  locksAndAtomics:
    deferredToLesson592
```

---

### 49. Criar data quality policy

Arquivo:

```text
virtual-thread-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingWorkloadProfile:
    action:
      block

  missingDownstreamCapacity:
    result:
      inconclusive

  generatorLimited:
    result:
      inconclusive

  singleRun:
    result:
      limited

  pinningWithoutJFR:
    result:
      suspected-only

  mixedEnvironment:
    action:
      reject-comparison

  missingShutdownEvidence:
    action:
      fail
```

---

### 50. Criar security policy

Arquivo:

```text
virtual-thread-security-policy.yaml
```

Conteúdo:

```yaml
security:
  threadName:
    sensitiveData:
      forbidden

  ThreadLocal:
    credentials:
      forbidden

  dump:
    repository:
      forbidden

  JFR:
    rawFile:
      repository:
        forbidden

  event:
    businessPayload:
      forbidden

  evidence:
    identifiers:
      sanitized
```

---

### 51. Criar cenários

Arquivo:

```text
virtual-thread-scenarios.yaml
```

Cenários:

```text
builder-create;

startVirtualThread;

isVirtual;

virtual-thread-per-task-success;

virtual-thread-per-task-failure;

blocking-sleep;

blocking-HTTP-synthetic;

CPU-bound-comparison;

platform-fixed-pool-comparison;

CompletableFuture-comparison;

downstream-limit-success;

downstream-permit-timeout;

interruption;

context-propagation;

context-cleanup;

pinning-control;

pinning-suspected;

executor-close;

shutdown-timeout;

zero-task-leak;

zero-resource-leak.
```

Cada cenário registra:

- workload;
- task count;
- virtual status;
- executor;
- downstream capacity;
- timeout;
- pinning;
- context;
- cancellation;
- shutdown;
- result;
- evidence.

---

### 52. Criar relatório baseline

Arquivo:

```text
virtual-thread-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  Java:
    version:
      21

  workload:
    IO_BOUND

  tasks:
    category:
      medium

  executor:
    virtual-thread-per-task

  downstream:
    bounded:
      true

  metrics:
    completed:
      all-accepted

    timeoutRate:
      within-budget

    resourceLeak:
      zero

  shutdown:
    terminated:
      true

  result:
    PASS
```

---

### 53. Criar relatório de comparação

Arquivo:

```text
virtual-thread-comparison-report.yaml
```

Inclua:

- workload;
- profile;
- task count;
- duration;
- throughput;
- p95;
- p99;
- CPU;
- memory;
- GC;
- platform thread category;
- downstream wait;
- timeout;
- pinning;
- shutdown;
- decisão.

---

### 54. Criar matriz de testes

Arquivo:

```text
VIRTUAL_THREAD_TEST_MATRIX.md
```

Cenários:

- Java 21;
- builder;
- start;
- `isVirtual`;
- thread-per-task executor;
- blocking;
- parking;
- CPU-bound;
- platform comparison;
- CompletableFuture comparison;
- downstream limit;
- permit timeout;
- database pool;
- HTTP capacity;
- interruption;
- timeout;
- ThreadLocal;
- cleanup;
- pinning;
- thread dump;
- JFR;
- shutdown;
- zero task leak;
- zero resource leak;
- security;
- evidence.

---

### 55. Criar troubleshooting

Arquivo:

```text
VIRTUAL_THREAD_TROUBLESHOOTING.md
```

Inclua:

- `isVirtual()` retorna falso;
- JDK não é 21;
- executor não fecha;
- tasks ficam pendentes;
- banco satura;
- HikariCP pending cresce;
- HTTP downstream recebe excesso;
- semáforo não libera permit;
- timeout não cancela;
- interrupção foi engolida;
- ThreadLocal vaza;
- memória cresce com contexto;
- pinning aparece;
- throughput não melhora;
- CPU-bound continua limitado;
- dump bruto foi versionado;
- locks e atomics antecipados.

---

### 56. Criar gate

O gate valida:

- Java 21;
- contrato;
- catálogo;
- workload;
- executor;
- virtual status;
- downstream bounded;
- timeouts;
- cancellation;
- pinning;
- ThreadLocal;
- observabilidade;
- shutdown;
- zero task leaks;
- zero resource leaks;
- segurança.

Status:

```text
PASS;

FAIL_JAVA_VERSION;

FAIL_NOT_VIRTUAL;

FAIL_DOWNSTREAM_LIMIT;

FAIL_TIMEOUT;

FAIL_INTERRUPT;

FAIL_PINNING;

FAIL_CONTEXT_LEAK;

FAIL_SHUTDOWN;

FAIL_RESOURCE_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 57. Coletar evidence

Script:

```text
collect-virtual-thread-evidence.ps1
```

Arquivo:

```text
virtual-thread-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- Java version status;
- workload status;
- virtual thread status;
- executor status;
- downstream limit status;
- timeout status;
- cancellation status;
- pinning category;
- ThreadLocal status;
- observability status;
- shutdown status;
- task leak status;
- resource leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- thread ID;
- request ID;
- order ID;
- customer ID;
- token;
- payload;
- dump bruto;
- JFR bruto;
- lock design;
- atomic design;
- material da aula 592.

---

### 58. Executar gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\virtual-threads\validate-virtual-thread-contract.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-workload.ps1

.\scripts\concurrency\virtual-threads\run-virtual-thread-baseline.ps1

.\scripts\concurrency\virtual-threads\compare-platform-and-virtual-threads.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-downstream-limit.ps1

.\scripts\concurrency\virtual-threads\detect-virtual-thread-pinning.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-threadlocal.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-timeouts.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-cancellation.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-observability.ps1

.\scripts\concurrency\virtual-threads\validate-virtual-thread-shutdown.ps1

.\scripts\concurrency\virtual-threads\collect-virtual-thread-dump.ps1

.\scripts\concurrency\virtual-threads\collect-virtual-thread-jfr.ps1

.\scripts\concurrency\virtual-threads\scan-virtual-thread-output.ps1

.\scripts\concurrency\virtual-threads\collect-virtual-thread-evidence.ps1

.\scripts\concurrency\virtual-threads\verify-virtual-thread-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- Java 21 aprovado;
- contrato aprovado;
- catálogo aprovado;
- workload classificado;
- virtual threads criadas;
- `isVirtual` validado;
- executor por task aprovado;
- blocking workload comparado;
- CPU-bound comparado;
- downstream bounded;
- permit timeout validado;
- interruption aprovada;
- ThreadLocal limpo;
- pinning analisado;
- thread dump sanitizado;
- JFR sanitizado;
- shutdown aprovado;
- zero task leaks;
- zero resource leaks;
- segurança aprovada;
- evidence sanitizada;
- locks e atomics não antecipados.

---

### 59. Encerrar o laboratório

Confirme:

- nenhuma task pendente;
- executor fechado;
- virtual threads concluídas;
- permits restaurados;
- nenhuma conexão residual;
- nenhum contexto residual;
- nenhum dump bruto no Git;
- nenhum JFR bruto no Git;
- reports sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/virtual-threads `
  -Recurse `
  -Force
```

Preserve relatórios sanitizados.

---

## Entendendo o que foi feito

### Thread-per-task ganhou viabilidade

Virtual threads tornaram possível criar uma thread lógica por tarefa bloqueante.

### Blocking ganhou parking

A espera deixou de exigir uma platform thread dedicada durante todo o período.

### Carrier threads ganharam papel

Platform threads passaram a executar virtual threads montadas temporariamente.

### CPU-bound ganhou limite real

Virtual threads não criaram novos processadores.

### Downstream ganhou proteção explícita

Banco, Redis, Kafka e HTTP continuaram bounded.

### Pinning ganhou diagnóstico

Bloqueio dentro de regiões inadequadas passou a ser observado por JFR.

### ThreadLocal ganhou custo

Contexto por thread continuou possível, mas precisou ser pequeno e limpo.

### Timeout ganhou jornada

Esperas, permits e futures passaram a respeitar um budget total.

### Shutdown ganhou deadline

O término deixou de multiplicar timeout por quantidade de futures.

### A próxima aula ganhou fronteira

A aula 592 irá aprofundar sincronização, locks e estruturas atômicas.

---

## Erros comuns importantes

### Usar virtual thread para “aumentar CPU”

A quantidade de processadores não muda.

### Remover todos os limites

Banco e APIs continuam com capacidade finita.

### Criar milhares de conexões

Virtual thread não substitui pool JDBC.

### Ignorar pinning

Carrier threads podem permanecer ocupadas durante bloqueios inadequados.

### Guardar objetos grandes em ThreadLocal

Memória pode crescer com a quantidade de tasks.

### Não limpar ThreadLocal

Contexto pode permanecer até o término da thread e ampliar retenção.

### Achar que timeout cancela tudo

A operação subjacente pode continuar.

### Engolir interruption

A task deixa de responder ao cancelamento.

### Medir uma execução isolada

Resultados precisam de repetição e baseline equivalente.

### Antecipar locks e atomics

Esses mecanismos pertencem à aula 592.

---

## Comandos úteis

### Validar Java

```powershell
java `
  -version
```

### Executar baseline

```powershell
.\scripts\concurrency\virtual-threads\run-virtual-thread-baseline.ps1
```

### Comparar modelos

```powershell
.\scripts\concurrency\virtual-threads\compare-platform-and-virtual-threads.ps1
```

### Detectar pinning

```powershell
.\scripts\concurrency\virtual-threads\detect-virtual-thread-pinning.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\virtual-threads\validate-virtual-thread-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Defina workload, owner e limites downstream.

### Parte 2 — Creation

Crie virtual threads com builder e helper.

### Parte 3 — Executor

Use virtual thread por task.

### Parte 4 — Blocking

Compare espera em platform e virtual threads.

### Parte 5 — CPU

Comprove o limite de processadores.

### Parte 6 — Downstream

Aplique limite de concorrência.

### Parte 7 — Pinning

Compare bloqueio dentro e fora de monitor.

### Parte 8 — Context

Propague e limpe ThreadLocal.

### Parte 9 — Shutdown

Use deadline global e cancelamento.

### Parte 10 — Gate

Valide leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 590 e ponte para a aula 592 foram preservadas;
- virtual thread, platform thread, carrier thread, mount, unmount, park, thread-per-task, blocking operation, pinning, downstream limit, `isVirtual`, `Thread.ofVirtual`, `startVirtualThread`, virtual-thread-per-task executor, ThreadLocal, CPU-bound e I/O-bound foram definidos;
- Java 21 foi validado;
- contrato, catálogo e policies foram criados;
- workloads foram classificados;
- adoção exige medição e rollout gradual;
- primeira virtual thread foi criada com builder;
- `Thread.startVirtualThread` foi validado;
- `Thread.isVirtual` diferenciou platform e virtual thread;
- executor por task foi criado e fechado;
- workload bloqueante foi comparado entre modelos;
- workload CPU-bound demonstrou limite de CPU;
- virtual thread por task não foi confundida com pool tradicional;
- banco, Redis, Kafka e HTTP permaneceram bounded;
- semáforo foi usado apenas como limitador downstream;
- permit timeout e liberação em `finally` foram validados;
- timeout de request, bloqueio, permit e Future foi documentado;
- interruption cooperativa foi validada;
- timeout não foi confundido com cancelamento completo;
- pinning foi definido e analisado;
- bloqueio dentro e fora de monitor foi comparado de forma controlada;
- JFR foi usado para evidência de pinning;
- ThreadLocal permaneceu pequeno, seguro e limpo;
- métricas agregadas evitaram cardinalidade por thread;
- dump e JFR brutos ficaram fora do Git;
- shutdown usou deadline global;
- regressão comparou mesmo workload e mesmos limites;
- policies de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, gate e evidence sanitizada estão presentes;
- zero task leaks e zero resource leaks foram validados;
- nenhum segredo, payload ou identificador real foi commitado;
- sincronização, locks e atomics não foram aprofundados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/virtual-threads `
  scripts/concurrency/virtual-threads `
  docs/concurrency/virtual-threads `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|rawThreadDump|rawJfr|businessPayload|ReentrantLock|ReadWriteLock|StampedLock|AtomicInteger|AtomicReference|compareAndSet"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): aplicar virtual threads"
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
- dumps brutos;
- JFR bruto;
- artifacts temporários;
- desenho de locks;
- estruturas atômicas;
- material da aula 592.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou thread-per-task a workloads bloqueantes usando virtual threads do Java 21.

Você trabalhou com:

```text
Thread.ofVirtual;

Thread.startVirtualThread;

newVirtualThreadPerTaskExecutor;

isVirtual;

carrier threads;

parking;

blocking;

pinning;

downstream limits;

ThreadLocal;

timeouts;

interruption;

shutdown;

JFR.
```

Você comprovou que virtual threads simplificam código bloqueante e permitem grande quantidade de tasks lógicas, mas não aumentam CPU nem capacidade do banco, Redis, Kafka ou APIs externas. Também estabeleceu que downstream precisa continuar bounded; pinning deve ser observado; ThreadLocal precisa permanecer pequeno e ser limpo; timeout não garante cancelamento completo; métricas precisam ser agregadas; e shutdown precisa terminar todas as tasks com deadline global.

A próxima aula será:

```text
592 - M18.37 - Sincronizacao locks atomic
```

Nela, você irá aprofundar `synchronized`, monitores, `ReentrantLock`, `ReadWriteLock`, `StampedLock`, `Condition`, semáforos, estruturas atômicas, compare-and-set, contenção, fairness, invariantes e escolha de mecanismos de coordenação.

Nenhum design completo com `ReentrantLock`, `ReadWriteLock`, `StampedLock`, `Condition`, `AtomicInteger`, `AtomicReference`, compare-and-set, lock striping ou sincronização avançada foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei Java 21.
- [ ] Criei virtual threads.
- [ ] Usei executor por task.
- [ ] Comparei blocking e CPU-bound.
- [ ] Limitei downstream.
- [ ] Analisei pinning.
- [ ] Limpei ThreadLocal.
- [ ] Encerrei sem leaks.

---

## Troubleshooting adicional

### `Thread.ofVirtual()` não compila

Confirme JDK 21 e configuração do compilador Maven.

### `isVirtual()` retorna falso

A task pode estar executando em platform thread.

### O banco satura

Virtual threads aumentaram concorrência sem respeitar HikariCP e capacidade do banco.

### O throughput não melhora

O workload pode ser CPU-bound ou o downstream já está saturado.

### Permits nunca retornam

Garanta `release()` em `finally`.

### Timeout ocorreu, mas a task continua

Solicite cancelamento e valide interruption da operação.

### JFR mostra pinning

Procure bloqueio prolongado dentro de `synchronized` ou chamada nativa.

### Memória cresce

Revise quantidade de tasks, payloads capturados e ThreadLocal.

### A aplicação não encerra

O executor pode não ter sido fechado ou existem tasks que ignoram interruption.

### Surgiu `ReentrantLock`

Preserve a implementação para a aula 592.

---

## Perguntas de revisão

1. O que é virtual thread?
2. O que é platform thread?
3. O que é carrier thread?
4. O que significa mount?
5. O que significa unmount?
6. O que é parking?
7. O que é thread-per-task?
8. Qual workload mais se beneficia?
9. Virtual thread aumenta CPU?
10. O que é pinning?
11. Qual risco de blocking dentro de `synchronized`?
12. Virtual thread elimina HikariCP?
13. Por que limitar downstream?
14. Como criar uma virtual thread?
15. O que faz `isVirtual()`?
16. Qual risco de ThreadLocal?
17. Timeout cancela automaticamente?
18. Como encerrar o executor?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Thread leve gerenciada pela JVM.
2. Thread associada ao sistema operacional.
3. Platform thread que executa virtual threads.
4. Associar virtual a carrier.
5. Liberar a carrier durante espera.
6. Suspender a virtual thread.
7. Uma thread por tarefa.
8. I/O-bound e bloqueante.
9. Não.
10. Virtual permanece presa à carrier.
11. Carrier pode ficar ocupada.
12. Não.
13. Recursos externos continuam finitos.
14. Builder, helper ou executor por task.
15. Informa se a thread é virtual.
16. Retenção e dados sensíveis por task.
17. Não.
18. Fechar, aguardar e cancelar bounded.
19. Sincronização, locks e atomics.
20. Sincronização locks atomic.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 591 - M18.36 - Virtual threads

- Continuei após CompletableFuture.
- Validei Java 21.
- Diferenciei virtual thread, platform thread e carrier thread.
- Entendi mount, unmount, parking e thread-per-task.
- Criei virtual threads com `Thread.ofVirtual`.
- Usei `Thread.startVirtualThread`.
- Validei `Thread.isVirtual`.
- Usei `Executors.newVirtualThreadPerTaskExecutor`.
- Diferenciei executor por task de pool tradicional.
- Comparei platform threads e virtual threads em workload bloqueante.
- Comparei workload CPU-bound.
- Mantive banco, Redis, Kafka e HTTP bounded.
- Usei limite de concorrência downstream.
- Validei timeout de permit.
- Tratei interruption e cancelamento cooperativo.
- Entendi que timeout não encerra automaticamente o trabalho.
- Analisei pinning com cenário controlado.
- Coletei evidência por JFR.
- Mantive ThreadLocal pequeno e limpo.
- Evitei métricas por thread individual.
- Criei shutdown com deadline global.
- Validei zero task leaks e zero resource leaks.
- Coletei evidence sanitizada.
- Não antecipei locks e atomics.
- Próxima aula: Sincronização locks atomic.
```

---

## Referência técnica curta

- Java virtual threads.
- Thread-per-task.
- `Thread.ofVirtual`.
- `Thread.startVirtualThread`.
- Virtual-thread-per-task executor.
- Carrier threads.
- Blocking and parking.
- Virtual thread pinning.
- ThreadLocal with virtual threads.
- Virtual thread observability.

Regra final:

```text
virtual threads precisam ser adotadas como modelo thread-per-task para workloads predominantemente bloqueantes, não como multiplicador de CPU ou de recursos externos: cada task recebe owner, timeout, cancelamento, contexto, observabilidade e shutdown, enquanto PostgreSQL, HikariCP, Redis, Kafka, APIs e outros downstreams continuam bounded por conexão, permit, rate limit ou capacidade medida; Thread.ofVirtual, Thread.startVirtualThread e newVirtualThreadPerTaskExecutor criam virtual threads leves executadas sobre carrier threads, permitindo parking e unmount durante esperas compatíveis, mas CPU-bound continua limitado pelos processadores e pinning pode manter a carrier ocupada durante bloqueios inadequados; ThreadLocal permanece pequeno, seguro e limpo, dumps e JFR brutos ficam fora do Git, métricas são agregadas, timeouts não são confundidos com cancelamento completo e o executor encerra todas as tasks com deadline global, zero task leaks e zero resource leaks; sincronização, locks, condições, semáforos e estruturas atômicas ficam para a aula 592.
```
