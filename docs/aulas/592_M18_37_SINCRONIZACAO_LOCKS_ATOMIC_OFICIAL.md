# 592 - M18.37 - Sincronizacao locks atomic

## Apresentação da aula

Na aula 591, você aplicou virtual threads a workloads bloqueantes no Java 21.

Você trabalhou com:

```text
Thread.ofVirtual;

Thread.startVirtualThread;

newVirtualThreadPerTaskExecutor;

thread-per-task;

carrier threads;

parking;

pinning;

downstream limits;

ThreadLocal;

timeouts;

interruption;

shutdown.
```

Também consolidou uma regra essencial:

```text
mais threads
não significam
mais capacidade
do recurso compartilhado.
```

Banco, Redis, Kafka, APIs externas, arquivos e memória continuaram limitados.

Nesta aula, o foco muda do **modelo de execução** para a **coordenação do estado compartilhado**.

A pergunta central será:

```text
como preservar
invariantes compartilhadas

quando múltiplas threads
podem ler,
alterar
e publicar estado

sem bloquear demais,
sem perder visibilidade
e sem criar contenção
desnecessária?
```

Você irá aprofundar:

- `synchronized`;
- monitores;
- métodos sincronizados;
- blocos sincronizados;
- critical section;
- monitor ownership;
- reentrância;
- visibilidade;
- happens-before;
- `wait`;
- `notify`;
- `notifyAll`;
- `ReentrantLock`;
- `tryLock`;
- timeout de lock;
- fairness;
- `Condition`;
- `ReadWriteLock`;
- `ReentrantReadWriteLock`;
- `StampedLock`;
- optimistic read;
- `Semaphore`;
- `AtomicInteger`;
- `AtomicLong`;
- `AtomicReference`;
- `AtomicBoolean`;
- compare-and-set;
- update functions;
- `LongAdder`;
- contenção;
- métricas;
- escolha de mecanismo;
- shutdown;
- observabilidade.

Na aula 587, você aprendeu que uma operação simples como:

```java
counter++;
```

pode ser decomposta conceitualmente em:

```text
ler;

calcular;

escrever.
```

Nesta aula, você não irá executar ainda um laboratório dedicado a provocar condições de corrida reais em milhares de interleavings.

Esse aprofundamento pertence à próxima aula oficial:

```text
593 - M18.38 - Race condition
```

Aqui, você irá construir implementações **corretas e controladas**, definir invariantes e comparar os mecanismos disponíveis.

O objetivo não é colocar um lock em todo lugar.

Locks custam espera, contenção, serialização, context switching, throughput, cancelamento e complexidade operacional.

Estruturas atômicas também não resolvem qualquer problema.

Um `AtomicInteger` funciona bem para uma única variável com atualização independente.

Ele não torna automaticamente atômicas invariantes envolvendo:

```text
saldo;

limite;

status;

timestamp;

duas coleções;

múltiplas entidades.
```

Exemplo:

```text
saldo >= valor

e

limite disponível >= valor

e

status == ATIVO.
```

Esse conjunto exige uma estratégia que preserve a invariante completa.

A escolha começa por estado, owner, invariante, padrão de leitura e escrita, duração da critical section, bloqueios, timeout, contenção, cancelamento e shutdown.

A aula utilizará um laboratório de **reserva de capacidade sintética**.

A invariante central será:

```text
reserved >= 0;

available >= 0;

reserved + available
=
total capacity.
```

Você implementará versões com:

- monitor intrínseco;
- `ReentrantLock`;
- `ReadWriteLock`;
- `StampedLock`;
- `AtomicInteger`;
- `AtomicReference`;
- `LongAdder`;
- `Semaphore`.

Cada mecanismo terá papel específico.

A regra central será:

```text
sincronização correta
protege uma invariante;

não apenas
uma linha de código.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
590:
CompletableFuture.

591:
Virtual threads.

592:
Sincronizacao locks atomic.

593:
Race condition.
```

A progressão é:

```text
compor tarefas;

escalar espera bloqueante;

coordenar estado compartilhado;

reproduzir e diagnosticar races.
```

Nesta aula:

```text
synchronized:
sim.

monitores:
sim.

wait e notify:
sim,
de forma controlada.

ReentrantLock:
sim.

tryLock:
sim.

Condition:
sim.

ReadWriteLock:
sim.

StampedLock:
sim.

Semaphore:
sim.

AtomicInteger:
sim.

AtomicReference:
sim.

compare-and-set:
sim.

LongAdder:
sim.

fairness:
sim.

contenção:
sim.

race condition real:
não aprofundar.

deadlock deliberado:
não.

stress de race:
não.
```

Você reutilizará ownership, invariantes, happens-before, threads, executors, virtual threads, interruption, timeouts, JFR, dumps, testes de carga, métricas e runbooks.

A implementação precisa preservar atomicidade, visibilidade, ordenação, espera bounded, cancelamento, liberação em `finally`, observabilidade, shutdown e segurança.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/synchronization
├── synchronization-contract.yaml
├── synchronization-mechanism-catalog.yaml
├── synchronization-invariant-policy.yaml
├── synchronization-monitor-policy.yaml
├── synchronization-lock-policy.yaml
├── synchronization-condition-policy.yaml
├── synchronization-read-write-policy.yaml
├── synchronization-stamped-lock-policy.yaml
├── synchronization-semaphore-policy.yaml
├── synchronization-atomic-policy.yaml
├── synchronization-contention-policy.yaml
├── synchronization-observability-policy.yaml
├── synchronization-shutdown-policy.yaml
├── synchronization-data-quality-policy.yaml
├── synchronization-security-policy.yaml
├── synchronization-failure-policy.yaml
├── synchronization-scenarios.yaml
└── synchronization-evidence.yaml

concurrency/synchronization/src/main/java
└── br/com/formacao/concurrency/synchronization
    ├── CapacitySnapshot.java
    ├── CapacityReservation.java
    ├── SynchronizedCapacityReservation.java
    ├── LockCapacityReservation.java
    ├── ReadWriteCapacityReservation.java
    ├── StampedCapacityView.java
    ├── AtomicCapacityReservation.java
    ├── AtomicCapacityState.java
    ├── AdmissionSemaphore.java
    ├── ContentionEvent.java
    ├── ContentionRecorder.java
    ├── LockAttemptResult.java
    ├── SynchronizationAssessment.java
    └── SynchronizationDemo.java

concurrency/synchronization/src/test/java
└── br/com/formacao/concurrency/synchronization
    ├── SynchronizedCapacityReservationTest.java
    ├── MonitorLifecycleTest.java
    ├── LockCapacityReservationTest.java
    ├── ConditionCoordinationTest.java
    ├── ReadWriteCapacityReservationTest.java
    ├── StampedCapacityViewTest.java
    ├── AtomicCapacityReservationTest.java
    ├── AtomicReferenceStateTest.java
    ├── AdmissionSemaphoreTest.java
    ├── LongAdderMetricsTest.java
    ├── SynchronizationShutdownTest.java
    └── SynchronizationContractTest.java

concurrency/synchronization/reports
├── synchronization-baseline-report.yaml
├── synchronization-monitor-report.yaml
├── synchronization-lock-report.yaml
├── synchronization-read-write-report.yaml
├── synchronization-atomic-report.yaml
├── synchronization-contention-report.yaml
└── synchronization-gate-report.yaml

scripts/concurrency/synchronization
├── validate-synchronization-contract.ps1
├── validate-synchronization-invariants.ps1
├── run-synchronized-baseline.ps1
├── validate-monitor-coordination.ps1
├── validate-reentrant-lock.ps1
├── validate-lock-timeout.ps1
├── validate-condition-coordination.ps1
├── validate-read-write-lock.ps1
├── validate-stamped-lock.ps1
├── validate-semaphore-limit.ps1
├── validate-atomic-operations.ps1
├── validate-atomic-reference-state.ps1
├── analyze-synchronization-contention.ps1
├── validate-synchronization-shutdown.ps1
├── collect-synchronization-thread-dump.ps1
├── collect-synchronization-jfr.ps1
├── scan-synchronization-output.ps1
├── collect-synchronization-evidence.ps1
└── verify-synchronization-baseline.ps1

docs/concurrency/synchronization
├── SYNCHRONIZATION_OVERVIEW.md
├── SYNCHRONIZED_AND_MONITORS.md
├── WAIT_NOTIFY_CONTRACT.md
├── REENTRANT_LOCK_GUIDE.md
├── CONDITIONS_GUIDE.md
├── READ_WRITE_LOCK_GUIDE.md
├── STAMPED_LOCK_GUIDE.md
├── SEMAPHORE_GUIDE.md
├── ATOMIC_CLASSES_AND_CAS.md
├── SYNCHRONIZATION_CONTENTION.md
├── SYNCHRONIZATION_TEST_MATRIX.md
└── SYNCHRONIZATION_TROUBLESHOOTING.md
```

Ao final, você terá contrato, catálogo, invariantes, monitores, locks, conditions, read/write coordination, optimistic read, semáforo, atomics, CAS, métricas, gate e evidence sanitizada.

---

## Conceito essencial

### Mutual exclusion

Garantia de que apenas um fluxo executa uma região protegida por vez.

---

### Monitor

Mecanismo associado a todo objeto Java, usado por `synchronized`, `wait`, `notify` e `notifyAll`.

---

### Intrinsic lock

Lock interno do monitor de um objeto.

---

### Critical section

Trecho que acessa estado compartilhado e precisa preservar uma invariante.

---

### Reentrancy

Capacidade de uma thread adquirir novamente um lock que já possui.

---

### `synchronized`

Mecanismo da linguagem que combina exclusão mútua com garantias de visibilidade.

---

### `ReentrantLock`

Lock explícito com recursos como `tryLock`, timeout, fairness e múltiplas `Condition`.

---

### `Condition`

Fila de espera associada a um `Lock`, equivalente conceitual mais flexível a `wait` e `notify`.

---

### `ReadWriteLock`

Permite múltiplas leituras simultâneas e escrita exclusiva.

---

### `StampedLock`

Lock com modos de escrita, leitura e leitura otimista.

---

### `Semaphore`

Controla quantos fluxos podem acessar simultaneamente um recurso.

---

### Atomic variable

Estrutura que oferece operações atômicas sobre um valor.

---

### Compare-and-set

Atualização condicional:

```text
se valor atual
é igual ao esperado,

substitua pelo novo.
```

---

### Lock-free operation

Operação que progride sem exclusão mútua tradicional, usando atomics e CAS.

---

### `LongAdder`

Contador distribuído internamente, útil para métricas sob alta contenção.

---

### Contention

Competição por lock, permit ou estado atômico.

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

- aula 591 validada;
- virtual-thread executor fechado;
- nenhuma task residual;
- Java 21 ativo;
- thread dump e JFR disponíveis;
- nenhum cenário de race real será antecipado;
- nenhum deadlock será criado deliberadamente.

---

### 2. Criar contrato

Arquivo:

```text
synchronization-contract.yaml
```

Conteúdo:

```yaml
synchronization:
  required:
    - state
    - owner
    - invariant
    - mechanism
    - critical-section
    - wait-policy
    - timeout
    - cancellation
    - observability
    - shutdown

  criticalSection:
    blockingIO:
      forbiddenWithoutExplicitReview

  lock:
    releaseInFinally:
      required

  wait:
    bounded:
      required

  forbiddenInLesson592:
    - uncontrolled-race-stress
    - intentional-deadlock
    - production-lock-values

  nextLesson:
    code:
      M18.38
```

---

### 3. Criar catálogo

Arquivo:

```text
synchronization-mechanism-catalog.yaml
```

Exemplo:

```yaml
mechanisms:
  - id:
      capacity-monitor

    state:
      available-and-reserved

    invariant:
      reserved-plus-available-equals-total

    mechanism:
      synchronized

    workload:
      short-write-heavy

  - id:
      capacity-lock

    state:
      available-and-reserved

    mechanism:
      ReentrantLock

    timeout:
      required

  - id:
      capacity-snapshot

    state:
      immutable-snapshot

    mechanism:
      AtomicReference

  - id:
      admission-limit

    resource:
      downstream-call

    mechanism:
      Semaphore
```

---

### 4. Criar policy de invariantes

Arquivo:

```text
synchronization-invariant-policy.yaml
```

Conteúdo:

```yaml
invariant:
  requiredForMutableSharedState:
    true

  observable:
    required

  examples:
    - available-nonnegative
    - reserved-nonnegative
    - available-plus-reserved-equals-total
    - permits-never-exceed-capacity

  violation:
    severity:
      explicit

  mechanismProtectsWholeInvariant:
    required
```

---

### 5. Criar contrato de reserva

```java
public interface CapacityReservation {

    boolean reserve(int units);

    void release(int units);

    CapacitySnapshot snapshot();
}
```

Snapshot:

```java
public record CapacitySnapshot(
        int total,
        int available,
        int reserved) {

    public CapacitySnapshot {
        if (total < 0
                || available < 0
                || reserved < 0) {
            throw new IllegalArgumentException(
                    "Capacity cannot be negative");
        }

        if (available + reserved != total) {
            throw new IllegalArgumentException(
                    "Invariant violated");
        }
    }
}
```

---

### 6. Implementar com `synchronized`

```java
public final class
SynchronizedCapacityReservation
        implements CapacityReservation {

    private final int total;
    private int available;
    private int reserved;

    public SynchronizedCapacityReservation(
            int total) {

        if (total <= 0) {
            throw new IllegalArgumentException(
                    "Total must be positive");
        }

        this.total = total;
        this.available = total;
    }

    @Override
    public synchronized boolean reserve(
            int units) {

        validateUnits(units);

        if (available < units) {
            return false;
        }

        available -= units;
        reserved += units;

        verifyInvariant();

        return true;
    }

    @Override
    public synchronized void release(
            int units) {

        validateUnits(units);

        if (reserved < units) {
            throw new IllegalStateException(
                    "Cannot release more than reserved");
        }

        reserved -= units;
        available += units;

        verifyInvariant();
    }

    @Override
    public synchronized CapacitySnapshot snapshot() {
        return new CapacitySnapshot(
                total,
                available,
                reserved);
    }
}
```

---

### 7. Entender happens-before do monitor

A saída de um bloco `synchronized` acontece-before uma entrada posterior no mesmo monitor.

Isso fornece:

- exclusão mútua;
- publicação das alterações;
- visibilidade para quem adquire o mesmo monitor depois.

Não sincronize leitura em um monitor e escrita em outro esperando a mesma garantia.

---

### 8. Usar bloco sincronizado

Em vez de sincronizar o método inteiro:

```java
synchronized (monitor) {
    updateSharedState();
}
```

Mantenha a critical section pequena e faça parsing, logging caro, HTTP, banco, serialização, espera e callbacks fora do monitor.

---

### 9. Criar policy de monitor

Arquivo:

```text
synchronization-monitor-policy.yaml
```

Conteúdo:

```yaml
monitor:
  owner:
    private-final-object:
      preferred

  publicObjectAsMonitor:
    avoid:
      true

  criticalSection:
    short:
      required

  blockingIOInside:
    forbidden

  wait:
    conditionLoop:
      required

  notifyAll:
    preferredWhenMultipleConditionsMayExist
```

Evite usar string internada, classe pública ou objeto exposto como monitor.

---

### 10. Introduzir `wait` e `notifyAll`

`wait()`:

- exige posse do monitor;
- libera o monitor durante a espera;
- pode acordar por notificação, interrupção ou despertar espúrio.

Por isso, a condição precisa ser testada em loop:

```java
synchronized (monitor) {
    while (!condition()) {
        monitor.wait(timeoutMillis);
    }

    perform();
}
```

Nunca use apenas:

```java
if (!condition()) {
    monitor.wait();
}
```

---

### 11. Criar teste controlado de monitor

Cenário:

- capacidade inicial zero;
- consumer espera disponibilidade;
- producer publica capacidade;
- producer chama `notifyAll`;
- consumer revalida a condição;
- teste possui timeout;
- shutdown libera qualquer wait pendente.

Não use espera infinita.

---

### 12. Criar `ReentrantLock`

```java
public final class LockCapacityReservation
        implements CapacityReservation {

    private final int total;
    private int available;
    private int reserved;

    private final ReentrantLock lock;

    public LockCapacityReservation(
            int total,
            boolean fair) {
        this.total = total;
        this.available = total;
        this.lock =
                new ReentrantLock(fair);
    }

    @Override
    public boolean reserve(int units) {
        lock.lock();

        try {
            validateUnits(units);

            if (available < units) {
                return false;
            }

            available -= units;
            reserved += units;
            verifyInvariant();

            return true;
        } finally {
            lock.unlock();
        }
    }
}
```

`unlock()` precisa estar em `finally`.

---

### 13. Criar policy de lock

Arquivo:

```text
synchronization-lock-policy.yaml
```

Conteúdo:

```yaml
lock:
  acquisition:
    boundedWhenOnRequestPath:
      required

  release:
    finally:
      required

  interruptibleAcquisition:
    evaluate:
      required

  fairness:
    default:
      false

  multipleLocks:
    orderingPolicy:
      required

  blockingIOInside:
    forbidden

  metrics:
    required
```

---

### 14. Usar `tryLock` com timeout

```java
public LockAttemptResult reserve(
        int units,
        Duration timeout)
        throws InterruptedException {

    Instant started =
            Instant.now();

    boolean acquired =
            lock.tryLock(
                    timeout.toMillis(),
                    TimeUnit.MILLISECONDS);

    if (!acquired) {
        return LockAttemptResult.timeout(
                Duration.between(
                        started,
                        Instant.now()));
    }

    try {
        boolean reserved =
                reserveWhileLocked(units);

        return LockAttemptResult.completed(
                reserved,
                Duration.between(
                        started,
                        Instant.now()));
    } finally {
        lock.unlock();
    }
}
```

A interrupção da espera precisa ser propagada ou restaurada conforme o contrato.

---

### 15. Entender fairness

`new ReentrantLock(true)` solicita fairness.

Isso pode reduzir starvation em certos cenários, mas possui custo de throughput e não garante scheduling perfeito.

A política padrão deve ser baseada em medição, não em preferência abstrata.

---

### 16. Criar `Condition`

```java
private final ReentrantLock lock =
        new ReentrantLock();

private final Condition capacityAvailable =
        lock.newCondition();
```

Espera:

```java
lock.lockInterruptibly();

try {
    while (available < units) {
        boolean signaled =
                capacityAvailable.await(
                        timeout.toMillis(),
                        TimeUnit.MILLISECONDS);

        if (!signaled) {
            return false;
        }
    }

    reserveWhileLocked(units);

    return true;
} finally {
    lock.unlock();
}
```

Sinalização:

```java
capacityAvailable.signalAll();
```

---

### 17. Criar policy de `Condition`

Arquivo:

```text
synchronization-condition-policy.yaml
```

Conteúdo:

```yaml
condition:
  owningLock:
    required

  wait:
    loop:
      required

    timeout:
      required

    interruption:
      supported

  signal:
    afterStateChange:
      required

  signalAll:
    useWhenMultipleWaitersMayQualify

  conditionPredicate:
    documented:
      required
```

---

### 18. Usar `ReadWriteLock`

```java
public final class
ReadWriteCapacityReservation
        implements CapacityReservation {

    private final ReentrantReadWriteLock lock =
            new ReentrantReadWriteLock();

    private final Lock readLock =
            lock.readLock();

    private final Lock writeLock =
            lock.writeLock();

    private final int total;
    private int available;
    private int reserved;

    @Override
    public CapacitySnapshot snapshot() {
        readLock.lock();

        try {
            return new CapacitySnapshot(
                    total,
                    available,
                    reserved);
        } finally {
            readLock.unlock();
        }
    }

    @Override
    public boolean reserve(int units) {
        writeLock.lock();

        try {
            return reserveWhileLocked(units);
        } finally {
            writeLock.unlock();
        }
    }
}
```

Múltiplos leitores podem prosseguir juntos.

A escrita continua exclusiva.

---

### 19. Criar policy de read/write

Arquivo:

```text
synchronization-read-write-policy.yaml
```

Conteúdo:

```yaml
readWriteLock:
  candidateWhen:
    - reads-dominate
    - critical-section-nontrivial
    - state-consistent-under-read-lock

  avoidWhen:
    - writes-frequent
    - sections-tiny
    - lock-overhead-dominates

  upgradeReadToWrite:
    forbiddenWithoutDesign

  downgrade:
    explicit:
      required

  starvation:
    observe:
      required
```

Read/write lock não é automaticamente mais rápido.

---

### 20. Introduzir `StampedLock`

```java
public final class StampedCapacityView {

    private final StampedLock lock =
            new StampedLock();

    private int available;
    private int reserved;
    private final int total;

    public CapacitySnapshot optimisticSnapshot() {
        long stamp =
                lock.tryOptimisticRead();

        int currentAvailable =
                available;

        int currentReserved =
                reserved;

        if (!lock.validate(stamp)) {
            stamp =
                    lock.readLock();

            try {
                currentAvailable =
                        available;

                currentReserved =
                        reserved;
            } finally {
                lock.unlockRead(stamp);
            }
        }

        return new CapacitySnapshot(
                total,
                currentAvailable,
                currentReserved);
    }
}
```

---

### 21. Entender limites do `StampedLock`

`StampedLock`:

- não é reentrante;
- exige cuidado com o stamp;
- pode ser mais difícil de manter;
- optimistic read precisa validar;
- leitura sem validação pode observar dados inconsistentes;
- não deve ser escolhido apenas por ser sofisticado.

---

### 22. Criar policy de `StampedLock`

Arquivo:

```text
synchronization-stamped-lock-policy.yaml
```

Conteúdo:

```yaml
stampedLock:
  candidateWhen:
    - reads-dominate
    - optimistic-read-is-cheap
    - fallback-read-lock-is-acceptable

  optimisticRead:
    validation:
      required

  reentrancy:
    unavailable

  stamp:
    releaseCorrectly:
      required

  complexity:
    architectureReview:
      required
```

---

### 23. Usar `Semaphore` como admissão

```java
public final class AdmissionSemaphore {

    private final Semaphore semaphore;

    public AdmissionSemaphore(
            int maximumConcurrency,
            boolean fair) {

        this.semaphore =
                new Semaphore(
                        maximumConcurrency,
                        fair);
    }

    public <T> T execute(
            Callable<T> action,
            Duration timeout)
            throws Exception {

        boolean acquired =
                semaphore.tryAcquire(
                        timeout.toMillis(),
                        TimeUnit.MILLISECONDS);

        if (!acquired) {
            throw new TimeoutException(
                    "Admission timeout");
        }

        try {
            return action.call();
        } finally {
            semaphore.release();
        }
    }
}
```

Semáforo limita concorrência.

Ele não protege sozinho uma invariante de múltiplos campos.

---

### 24. Criar policy de semáforo

Arquivo:

```text
synchronization-semaphore-policy.yaml
```

Conteúdo:

```yaml
semaphore:
  useFor:
    - downstream-concurrency
    - admission-control
    - bounded-parallelism

  permitCount:
    deriveFrom:
      - downstream-capacity
      - connection-budget
      - latency-budget

  acquire:
    timeout:
      required

  release:
    finally:
      required

  overRelease:
    forbidden

  fairness:
    measure:
      required
```

---

### 25. Criar estado atômico simples

Para uma única quantidade independente:

```java
private final AtomicInteger available =
        new AtomicInteger(total);
```

Reserva por CAS:

```java
public boolean reserve(int units) {
    while (true) {
        int current =
                available.get();

        if (current < units) {
            return false;
        }

        int next =
                current - units;

        if (available.compareAndSet(
                current,
                next)) {
            return true;
        }
    }
}
```

Esse loop repete quando outra thread altera o valor entre leitura e CAS.

---

### 26. Criar policy de atomics

Arquivo:

```text
synchronization-atomic-policy.yaml
```

Conteúdo:

```yaml
atomic:
  candidateWhen:
    - single-value-invariant
    - short-update
    - CAS-loop-bounded-by-progress

  avoidWhen:
    - multiple-field-invariant
    - blocking-operation
    - complex-side-effect
    - update-requires-rollback

  CAS:
    sideEffectInsideLoop:
      forbidden

  metrics:
    retryCount:
      requiredWhenContended
```

---

### 27. Evitar efeitos dentro do CAS loop

Não faça:

```java
while (true) {
    sendNotification();

    if (state.compareAndSet(
            current,
            next)) {
        break;
    }
}
```

O loop pode repetir e executar o efeito várias vezes.

Calcule o novo valor de forma pura.

Execute efeitos externos depois da atualização confirmada.

---

### 28. Criar `AtomicReference` para estado composto

```java
public record AtomicCapacityState(
        int total,
        int available,
        int reserved) {

    public AtomicCapacityState {
        if (available < 0
                || reserved < 0
                || available + reserved != total) {
            throw new IllegalArgumentException(
                    "Invariant violated");
        }
    }

    public AtomicCapacityState reserve(
            int units) {

        if (available < units) {
            return this;
        }

        return new AtomicCapacityState(
                total,
                available - units,
                reserved + units);
    }
}
```

Holder:

```java
private final AtomicReference<
        AtomicCapacityState> state;
```

Atualização:

```java
AtomicCapacityState result =
        state.updateAndGet(
                current ->
                        current.reserve(units));
```

O objeto precisa ser imutável.

---

### 29. Diferenciar CAS de lock

CAS pode evitar bloqueio tradicional, mas sob alta contenção pode repetir muitas vezes.

Locks podem fazer threads aguardarem. A escolha depende de invariante, escrita, contenção, retry, fairness, espera condicional, side effects e clareza.

---

### 30. Usar `AtomicBoolean`

Exemplo para sinal de lifecycle:

```java
private final AtomicBoolean closed =
        new AtomicBoolean();

public boolean closeOnce() {
    return closed.compareAndSet(
            false,
            true);
}
```

Isso garante transição única:

```text
aberto
para
fechado.
```

Não representa uma máquina de estados complexa.

---

### 31. Usar `LongAdder` para métricas

```java
private final LongAdder successful =
        new LongAdder();

private final LongAdder rejected =
        new LongAdder();
```

Atualização:

```java
successful.increment();
```

Leitura:

```java
long value =
        successful.sum();
```

`LongAdder` é adequado para contadores sob contenção.

Não use como fonte de verdade transacional.

---

### 32. Criar recorder de contenção

```java
public record ContentionEvent(
        String mechanism,
        String outcome,
        Duration waitTime,
        Instant occurredAt) {
}
```

Recorder:

```java
public final class ContentionRecorder {

    private final List<ContentionEvent> events =
            Collections.synchronizedList(
                    new ArrayList<>());

    public void record(
            String mechanism,
            String outcome,
            Duration waitTime) {

        events.add(
                new ContentionEvent(
                        mechanism,
                        outcome,
                        waitTime,
                        Instant.now()));
    }
}
```

---

### 33. Criar policy de contenção

Arquivo:

```text
synchronization-contention-policy.yaml
```

Conteúdo:

```yaml
contention:
  measure:
    - acquisition-wait
    - acquisition-timeout
    - queue-length-category
    - hold-time
    - CAS-retries
    - permit-wait
    - blocked-thread-category

  alert:
    sustained:
      required

  singleSample:
    insufficient

  correlate:
    - throughput
    - p95
    - p99
    - CPU
    - thread-states
    - downstream-latency
```

---

### 34. Medir hold time

Hold time é o período entre aquisição e liberação.

Registre por categoria.

Se hold time cresce:

- critical section pode estar longa;
- I/O pode ter entrado na seção;
- logging pode estar caro;
- outra operação pode estar sendo chamada;
- GC pode interferir;
- CPU pode estar saturada.

---

### 35. Criar policy de observabilidade

Arquivo:

```text
synchronization-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  monitor:
    required:
      - blocked-thread-category
      - wait-category
      - hold-time-category

  lock:
    required:
      - acquisition
      - timeout
      - interruption
      - hold-time

  atomic:
    required:
      - update
      - CAS-retry-category
      - failure

  semaphore:
    required:
      - permits-used
      - permit-wait
      - timeout

  labels:
    forbidden:
      - thread-id
      - request-id
      - customer-id
      - resource-id
```

---

### 36. Coletar thread dump

Script:

```text
collect-synchronization-thread-dump.ps1
```

Busque categorias:

```text
BLOCKED;

WAITING;

TIMED_WAITING;

locked monitor;

parking to wait for.
```

Não versione o dump bruto.

Correlacione com o cenário e o horário.

---

### 37. Coletar JFR

Script:

```text
collect-synchronization-jfr.ps1
```

Analise:

- monitor enter;
- monitor wait;
- thread park;
- CPU;
- allocation;
- lock duration;
- virtual-thread pinning quando aplicável.

Preserve apenas relatório sanitizado.

---

### 38. Criar policy de shutdown

Arquivo:

```text
synchronization-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewWork:
    required

  waitingThreads:
    signal:
      required

  lockAcquisition:
    timeout:
      required

  interruption:
    supported:
      required

  permits:
    restored:
      required

  conditions:
    signalAllOnClose:
      required

  zeroWaiterLeak:
    required
```

---

### 39. Implementar close com condition

Estado:

```java
private boolean closed;
```

Fechamento:

```java
lock.lock();

try {
    closed = true;
    capacityAvailable.signalAll();
} finally {
    lock.unlock();
}
```

Waiters acordam, revalidam:

```text
capacity disponível
ou
serviço fechado.
```

---

### 40. Validar shutdown

Teste:

- waiter aguardando;
- `close()` chamado;
- `signalAll`;
- waiter termina;
- lock liberado;
- permit restaurado;
- zero threads vivas;
- zero waits pendentes.

---

### 41. Criar failure policy

Arquivo:

```text
synchronization-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  unlockMissing:
    action:
      fail-review

  waitWithoutLoop:
    action:
      fail-review

  unboundedLockWait:
    action:
      fail-gate

  blockingIOInsideCriticalSection:
    action:
      reject-design

  CASWithSideEffect:
    action:
      reject-design

  semaphorePermitLeak:
    action:
      fail-gate

  ThreadDumpLeak:
    action:
      fail-security

  raceStress:
    deferredToLesson593
```

---

### 42. Criar data quality policy

Arquivo:

```text
synchronization-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingInvariant:
    action:
      block

  missingOwner:
    action:
      block

  unknownCriticalSection:
    result:
      inconclusive

  timingOnlyAssertion:
    result:
      fragile

  singleContentionSample:
    result:
      limited

  missingJFRWindow:
    result:
      limited

  staleThreadDump:
    result:
      limited
```

---

### 43. Criar security policy

Arquivo:

```text
synchronization-security-policy.yaml
```

Conteúdo:

```yaml
security:
  lockName:
    identifier:
      forbidden

  event:
    payload:
      forbidden

  threadDump:
    repository:
      forbidden

  JFR:
    rawFile:
      repository:
        forbidden

  exception:
    rawBusinessData:
      forbidden

  evidence:
    identifiers:
      sanitized
```

---

### 44. Criar cenários

Arquivo:

```text
synchronization-scenarios.yaml
```

Cenários:

```text
synchronized-reserve;

synchronized-release;

monitor-wait-signal;

monitor-timeout;

reentrant-lock-success;

reentrant-lock-timeout;

lock-interruption;

condition-signal;

condition-close;

read-heavy-read-write-lock;

write-exclusive-read-write-lock;

optimistic-read-valid;

optimistic-read-fallback;

semaphore-admission;

semaphore-timeout;

atomic-integer-CAS;

atomic-reference-state;

atomic-boolean-close-once;

LongAdder-metrics;

contention-observation;

shutdown-waiters;

zero-permit-leak;

zero-waiter-leak.
```

Cada cenário registra:

- mechanism;
- invariant;
- wait;
- timeout;
- contention;
- interruption;
- shutdown;
- result;
- evidence.

---

### 45. Criar testes de `synchronized`

Valide:

- reserva válida;
- reserva insuficiente;
- release válido;
- release acima do reservado;
- snapshot consistente;
- invariante preservada;
- nenhum I/O dentro do método;
- estado não exposto.

---

### 46. Criar testes de lock

Valide:

- aquisição;
- timeout;
- interruption;
- unlock em falha;
- fairness documentada;
- hold time;
- zero lock leak.

Não use apenas `sleep` como prova de sincronização.

Use barreiras controladas e timeouts.

---

### 47. Criar testes de atomics

Valide:

- CAS de sucesso;
- CAS que precisa repetir;
- atualização sem side effect;
- estado composto imutável;
- transição única com `AtomicBoolean`;
- `LongAdder` apenas como métrica.

A reprodução massiva de lost update será feita na aula 593.

---

### 48. Comparar mecanismos

Crie relatório:

```text
synchronization-baseline-report.yaml
```

Compare:

```text
synchronized;

ReentrantLock;

ReadWriteLock;

StampedLock;

AtomicInteger;

AtomicReference;

Semaphore.
```

Critérios:

- clareza;
- invariante;
- read/write ratio;
- timeout;
- interruption;
- fairness;
- conditional wait;
- contenção;
- manutenção;
- observabilidade.

---

### 49. Criar matriz de decisão

Exemplo:

```text
critical section simples:
synchronized.

timeout de aquisição:
ReentrantLock.

múltiplas condições:
ReentrantLock + Condition.

muitas leituras:
ReadWriteLock,
após medição.

leitura otimista:
StampedLock,
com validação.

limite de concorrência:
Semaphore.

contador independente:
AtomicInteger ou LongAdder.

estado composto imutável:
AtomicReference.
```

---

### 50. Criar matriz de testes

Arquivo:

```text
SYNCHRONIZATION_TEST_MATRIX.md
```

Cenários:

- synchronized method;
- synchronized block;
- monitor ownership;
- wait loop;
- notifyAll;
- reentrancy;
- lock success;
- lock timeout;
- lock interrupt;
- fairness;
- condition wait;
- condition signal;
- read lock;
- write lock;
- optimistic read;
- validation fallback;
- semaphore acquire;
- permit timeout;
- permit release;
- AtomicInteger;
- AtomicReference;
- AtomicBoolean;
- CAS retry;
- LongAdder;
- contention;
- thread dump;
- JFR;
- shutdown;
- security;
- evidence.

---

### 51. Criar troubleshooting

Arquivo:

```text
SYNCHRONIZATION_TROUBLESHOOTING.md
```

Inclua:

- `IllegalMonitorStateException`;
- wait sem possuir monitor;
- wait fora de loop;
- notify acorda waiter incorreto;
- lock nunca liberado;
- `tryLock` sempre expira;
- fairness reduz throughput;
- read lock não melhora;
- optimistic read falha muito;
- stamp incorreto;
- permit vaza;
- CAS loop consome CPU;
- efeito externo repete no CAS;
- `LongAdder` usado como fonte de verdade;
- hold time cresce;
- pinning aparece em virtual thread;
- race stress antecipado.

---

### 52. Criar gate

O gate valida:

- contrato;
- catálogo;
- invariantes;
- monitor;
- locks;
- conditions;
- read/write;
- stamped lock;
- semáforo;
- atomics;
- contenção;
- shutdown;
- zero lock leaks;
- zero permit leaks;
- zero waiter leaks;
- segurança.

Status:

```text
PASS;

FAIL_INVARIANT;

FAIL_UNLOCK;

FAIL_WAIT_CONTRACT;

FAIL_LOCK_TIMEOUT;

FAIL_PERMIT_LEAK;

FAIL_CAS_SIDE_EFFECT;

FAIL_CONTENTION;

FAIL_SHUTDOWN;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 53. Coletar evidence

Script:

```text
collect-synchronization-evidence.ps1
```

Arquivo:

```text
synchronization-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- mechanism category;
- invariant status;
- monitor status;
- lock status;
- condition status;
- read-write status;
- stamped status;
- semaphore status;
- atomic status;
- contention status;
- shutdown status;
- lock leak status;
- permit leak status;
- waiter leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- thread ID;
- request ID;
- customer ID;
- order ID;
- payload;
- monitor object value;
- dump bruto;
- JFR bruto;
- production lock values;
- material da aula 593.

---

### 54. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\synchronization\validate-synchronization-contract.ps1

.\scripts\concurrency\synchronization\validate-synchronization-invariants.ps1

.\scripts\concurrency\synchronization\run-synchronized-baseline.ps1

.\scripts\concurrency\synchronization\validate-monitor-coordination.ps1

.\scripts\concurrency\synchronization\validate-reentrant-lock.ps1

.\scripts\concurrency\synchronization\validate-lock-timeout.ps1

.\scripts\concurrency\synchronization\validate-condition-coordination.ps1

.\scripts\concurrency\synchronization\validate-read-write-lock.ps1

.\scripts\concurrency\synchronization\validate-stamped-lock.ps1

.\scripts\concurrency\synchronization\validate-semaphore-limit.ps1

.\scripts\concurrency\synchronization\validate-atomic-operations.ps1

.\scripts\concurrency\synchronization\validate-atomic-reference-state.ps1

.\scripts\concurrency\synchronization\analyze-synchronization-contention.ps1

.\scripts\concurrency\synchronization\validate-synchronization-shutdown.ps1

.\scripts\concurrency\synchronization\collect-synchronization-thread-dump.ps1

.\scripts\concurrency\synchronization\collect-synchronization-jfr.ps1

.\scripts\concurrency\synchronization\scan-synchronization-output.ps1

.\scripts\concurrency\synchronization\collect-synchronization-evidence.ps1

.\scripts\concurrency\synchronization\verify-synchronization-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- invariantes aprovadas;
- `synchronized` aprovado;
- monitor wait/notify aprovado;
- `ReentrantLock` aprovado;
- timeout e interruption aprovados;
- `Condition` aprovada;
- read/write lock aprovado;
- optimistic read validado;
- semáforo aprovado;
- atomics aprovados;
- CAS sem side effects;
- contenção observada;
- shutdown aprovado;
- zero lock leaks;
- zero permit leaks;
- zero waiter leaks;
- segurança aprovada;
- evidence sanitizada;
- race condition não antecipada.

---

### 55. Encerrar o laboratório

Confirme:

- nenhum lock mantido;
- nenhum waiter ativo;
- permits restaurados;
- nenhuma task pendente;
- nenhum executor vivo;
- nenhum dump bruto no Git;
- nenhum JFR bruto no Git;
- relatórios sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/synchronization `
  -Recurse `
  -Force
```

---

## Entendendo o que foi feito

### `synchronized` ganhou invariante

O monitor passou a proteger estado completo, não apenas uma linha.

### Happens-before ganhou aplicação

Saída e entrada no mesmo monitor passaram a fornecer visibilidade.

### `wait` ganhou contrato

A espera passou a ocorrer em loop, com timeout e condição revalidada.

### `ReentrantLock` ganhou controle

Aquisição interruptível, timeout, fairness e `Condition` ficaram disponíveis.

### Read/write ganhou critério

Mais leitores só justificam mecanismo mais complexo quando a medição comprova benefício.

### `StampedLock` ganhou cautela

Leitura otimista passou a exigir validação e fallback.

### Semáforo ganhou papel

Permits limitaram concorrência sem representar exclusão de toda a invariante.

### Atomics ganharam escopo

CAS passou a ser aplicado a valores ou estados imutáveis compatíveis.

### `LongAdder` ganhou limite

Ele ficou restrito a métricas, não a decisões transacionais.

### Contenção ganhou evidência

Wait, hold time, timeout e retries passaram a ser correlacionados.

### A próxima aula ganhou fronteira

A aula 593 irá provocar, reproduzir e diagnosticar race conditions reais.

---

## Erros comuns importantes

### Sincronizar objeto público

Código externo pode adquirir o mesmo monitor.

### Fazer I/O dentro do lock

A critical section fica longa e aumenta contenção.

### Esquecer `unlock` em `finally`

Falha deixa o lock permanentemente mantido.

### Usar `wait` sem loop

Despertar espúrio ou condição alterada quebra a lógica.

### Preferir fairness sem medir

Throughput pode cair sem benefício real.

### Usar read/write lock em seção mínima

Overhead pode superar o ganho.

### Não validar optimistic read

Snapshot pode ficar inconsistente.

### Usar semáforo como mutex de estado composto

Permits não preservam automaticamente a invariante.

### Executar side effect dentro de CAS loop

O efeito pode ocorrer repetidamente.

### Usar `LongAdder` como saldo

A leitura não representa contrato transacional.

---

## Comandos úteis

### Validar contrato

```powershell
.\scripts\concurrency\synchronization\validate-synchronization-contract.ps1
```

### Validar locks

```powershell
.\scripts\concurrency\synchronization\validate-reentrant-lock.ps1
```

### Validar atomics

```powershell
.\scripts\concurrency\synchronization\validate-atomic-operations.ps1
```

### Analisar contenção

```powershell
.\scripts\concurrency\synchronization\analyze-synchronization-contention.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\synchronization\validate-synchronization-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Invariant

Defina estado, owner e condição obrigatória.

### Parte 2 — Monitor

Implemente `synchronized`.

### Parte 3 — Wait

Use loop, timeout e `notifyAll`.

### Parte 4 — Explicit lock

Implemente `tryLock` e interruption.

### Parte 5 — Condition

Coordene waiters.

### Parte 6 — Read/write

Compare leitores e escritores.

### Parte 7 — Stamped

Valide optimistic read.

### Parte 8 — Semaphore

Limite concorrência downstream.

### Parte 9 — Atomics

Use CAS sem side effects.

### Parte 10 — Gate

Valide contenção, leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 591 e ponte para a aula 593 foram preservadas;
- mutual exclusion, monitor, intrinsic lock, critical section, reentrancy, `synchronized`, `ReentrantLock`, `Condition`, `ReadWriteLock`, `StampedLock`, `Semaphore`, atomic variable, compare-and-set, lock-free operation, `LongAdder` e contention foram definidos;
- contrato, catálogo e policies foram criados;
- invariante de capacidade foi explicitada;
- `CapacitySnapshot` valida o estado;
- implementação com `synchronized` protege a invariante completa;
- happens-before do monitor foi aplicado;
- critical sections permanecem pequenas;
- I/O dentro do monitor foi proibido;
- `wait` ocorre em loop com timeout;
- `notifyAll` ocorre depois da alteração de estado;
- `ReentrantLock` libera em `finally`;
- `tryLock` com timeout foi implementado;
- interruption da aquisição foi tratada;
- fairness foi tratada como decisão medida;
- `Condition` possui predicate documentado;
- read/write lock foi usado apenas como candidato medido;
- `StampedLock` valida optimistic read;
- semáforo limita concorrência downstream;
- permits são liberados em `finally`;
- `AtomicInteger` usa CAS;
- CAS loop não executa side effects;
- `AtomicReference` usa estado composto imutável;
- `AtomicBoolean` protege transição única;
- `LongAdder` foi restrito a métricas;
- wait, hold time, timeout, CAS retry e permit wait foram observados;
- thread dump e JFR foram sanitizados;
- shutdown acorda waiters e restaura permits;
- policies de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, gate e evidence sanitizada estão presentes;
- zero lock leaks, zero permit leaks e zero waiter leaks foram validados;
- nenhum segredo, payload ou identificador real foi commitado;
- race condition real não foi aprofundada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/synchronization `
  scripts/concurrency/synchronization `
  docs/concurrency/synchronization `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|rawThreadDump|rawJfr|businessPayload|productionLockValue|uncontrolledRace|intentionalDeadlock"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar sincronizacao locks e atomics"
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
- valores de produção;
- race stress;
- deadlock deliberado;
- material da aula 593.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você estruturou mecanismos de coordenação para preservar invariantes compartilhadas.

Você trabalhou com:

```text
synchronized;

monitores;

wait;

notifyAll;

ReentrantLock;

tryLock;

Condition;

ReadWriteLock;

StampedLock;

Semaphore;

AtomicInteger;

AtomicReference;

AtomicBoolean;

LongAdder;

CAS;

contenção;

shutdown.
```

Você comprovou que sincronização precisa proteger a invariante inteira; monitores combinam exclusão e visibilidade; `wait` exige loop e timeout; locks explícitos exigem liberação em `finally`; fairness precisa ser medida; read/write e stamped locks só se justificam quando o workload demonstra benefício; semáforos limitam concorrência, mas não substituem invariantes; atomics funcionam melhor para valores simples ou estados imutáveis; CAS não pode repetir side effects; e métricas de contenção precisam correlacionar wait, hold time, throughput e latência.

A próxima aula será:

```text
593 - M18.38 - Race condition
```

Nela, você irá provocar interleavings reais, reproduzir lost updates, stale reads, check-then-act, publication races, TOCTOU e races em coleções, criar harnesses repetíveis e comparar correções com os mecanismos estudados nesta aula.

Nenhum stress massivo de race, harness probabilístico, lost update concorrente em alta repetição, stale-read lab, check-then-act real, TOCTOU real ou publicação insegura foi aprofundado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini a invariante.
- [ ] Implementei `synchronized`.
- [ ] Usei wait em loop.
- [ ] Usei `tryLock` bounded.
- [ ] Modelei `Condition`.
- [ ] Comparei read/write e stamped.
- [ ] Limitei concorrência com semáforo.
- [ ] Usei atomics sem side effects.

---

## Troubleshooting adicional

### `IllegalMonitorStateException`

A thread chamou `wait`, `notify` ou `notifyAll` sem possuir o monitor.

### O waiter nunca acorda

Revise alteração de estado, `signalAll`, timeout e condição de fechamento.

### O lock fica preso

Garanta `unlock()` em `finally`.

### `tryLock` sempre expira

A critical section pode estar longa ou existe contenção sustentada.

### Read/write lock piorou

O overhead pode ser maior que o benefício.

### Optimistic read retorna dados estranhos

O stamp pode não ter sido validado.

### Permits diminuem permanentemente

Algum caminho não executou `release()`.

### CAS loop usa muita CPU

A contenção está alta ou a transformação é cara.

### Métrica com `LongAdder` diverge momentaneamente

Ela é adequada a estatística agregada, não a invariante transacional.

### Surgiu harness de race real

Preserve esse laboratório para a aula 593.

---

## Perguntas de revisão

1. O que é monitor?
2. O que é intrinsic lock?
3. O que `synchronized` garante?
4. Por que `wait` precisa de loop?
5. Quando usar `notifyAll`?
6. Qual vantagem de `ReentrantLock`?
7. Para que serve `tryLock`?
8. O que é fairness?
9. O que é `Condition`?
10. Quando avaliar `ReadWriteLock`?
11. O que é optimistic read?
12. O que é `StampedLock`?
13. Para que serve `Semaphore`?
14. O que é compare-and-set?
15. Quando usar `AtomicInteger`?
16. Quando usar `AtomicReference`?
17. Para que serve `LongAdder`?
18. O que é contention?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Mecanismo associado a objeto.
2. Lock interno do monitor.
3. Exclusão, visibilidade e ordenação.
4. Despertar espúrio e condição alterável.
5. Múltiplos waiters ou condições.
6. Timeout, interruption, fairness e conditions.
7. Aquisição bounded.
8. Preferência de atendimento em espera.
9. Fila de espera de um lock.
10. Leituras dominantes e seção relevante.
11. Leitura sem lock com validação posterior.
12. Lock com stamps e leitura otimista.
13. Limitar concorrência.
14. Atualização se valor esperado confere.
15. Estado simples independente.
16. Estado composto imutável.
17. Métrica sob contenção.
18. Competição por mecanismo compartilhado.
19. Race condition.
20. Race condition.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 592 - M18.37 - Sincronizacao locks atomic

- Continuei após Virtual threads.
- Defini invariantes antes do mecanismo.
- Entendi monitor, intrinsic lock e critical section.
- Implementei reserva com `synchronized`.
- Apliquei happens-before do monitor.
- Mantive I/O fora da critical section.
- Usei `wait` em loop com timeout.
- Usei `notifyAll` depois da alteração de estado.
- Implementei `ReentrantLock`.
- Usei `tryLock` com timeout.
- Tratei interruption da aquisição.
- Avaliei fairness por medição.
- Coordenei waiters com `Condition`.
- Comparei `ReadWriteLock`.
- Validei optimistic read com `StampedLock`.
- Usei `Semaphore` para limitar downstream.
- Implementei `AtomicInteger` com CAS.
- Evitei side effects em CAS loop.
- Usei `AtomicReference` com estado imutável.
- Usei `AtomicBoolean` para transição única.
- Mantive `LongAdder` apenas em métricas.
- Medi wait, hold time, timeout e retries.
- Validei shutdown, permits e waiters.
- Coletei evidence sanitizada.
- Não antecipei race condition real.
- Próxima aula: Race condition.
```

---

## Referência técnica curta

- Java intrinsic monitors.
- Java `synchronized`.
- `ReentrantLock`.
- Java `Condition`.
- `ReadWriteLock`.
- `StampedLock`.
- Java `Semaphore`.
- Atomic variables.
- Compare-and-set.
- `LongAdder`.

Regra final:

```text
sincronização, locks e atomics precisam ser escolhidos a partir da invariante, do owner e do padrão de contenção: synchronized protege critical sections curtas e fornece happens-before no mesmo monitor, wait sempre ocorre em loop com timeout e notifyAll sucede a mudança de estado, enquanto ReentrantLock oferece aquisição interruptível, tryLock bounded, fairness e Conditions, mas exige unlock em finally; ReadWriteLock e StampedLock só entram após medição, optimistic read sempre valida o stamp, Semaphore limita concorrência downstream e restaura permits em finally, e atomics ficam restritos a valores simples ou estados imutáveis atualizados por CAS sem side effects repetíveis; LongAdder serve a métricas, não a invariantes transacionais, I/O permanece fora das regiões protegidas, contenção é observada por wait, hold time, timeouts, retries, thread dumps e JFR, e o shutdown termina com zero lock leaks, zero permit leaks e zero waiter leaks; a reprodução aprofundada de lost updates, stale reads, check-then-act, publicação insegura e TOCTOU fica para a aula 593.
```
