# 594 - M18.39 - Deadlocks em Java

## Apresentação da aula

Na aula 593, você transformou condições de corrida intermitentes em cenários reproduzíveis.

Você trabalhou com:

```text
lost update;

stale read;

check-then-act;

unsafe publication;

TOCTOU;

collection race;

CountDownLatch;

CyclicBarrier;

Phaser;

correções atômicas;

locks;

single writer;

versionamento otimista.
```

Você comprovou que concorrência incorreta pode produzir respostas erradas mesmo quando todas as threads continuam executando.

Nesta aula, o problema muda.

Agora o sistema pode parar de progredir.

A pergunta central será:

```text
como identificar,
reproduzir,
detectar,
prevenir
e responder

a um deadlock
em uma aplicação Java?
```

Um **deadlock** ocorre quando duas ou mais threads permanecem aguardando recursos umas das outras e nenhuma consegue prosseguir.

Exemplo clássico:

```text
thread A:
possui lock 1;
aguarda lock 2.

thread B:
possui lock 2;
aguarda lock 1.
```

O ciclo é `A espera B` e `B espera A`.

Sem intervenção, o progresso não retorna.

Health checks e outras threads podem responder, embora o fluxo afetado permaneça bloqueado.

Filas, conexões e pools podem degradar.

Deadlock não é race condition, contenção, espera longa, starvation, livelock, fila saturada, timeout ou banco lento.

Contenção é competição temporária; starvation é falta prolongada de oportunidade; livelock é atividade sem progresso; deadlock é espera circular sem saída.

Você irá estudar mutual exclusion, hold and wait, no preemption e circular wait, as quatro condições de Coffman do deadlock clássico.

Você irá construir um cenário intencional e controlado com dois locks, mas ele será executado somente em um **processo Java filho isolado**.

Isso é necessário porque uma thread `BLOCKED` em monitor intrínseco não pode ser interrompida para desfazer o ciclo.

A suíte principal não deve ficar presa.

O processo filho terá dados sintéticos, threads daemon, timeout, detecção, saída sanitizada e kill de segurança.

Você também usará `ReentrantLock` e `lockInterruptibly` para demonstrar aquisição cancelável.

O laboratório utilizará monitores, `ReentrantLock`, aquisição bounded, `ThreadMXBean`, dumps, JFR, wait-for graph, métricas, runbook e processo filho.

A aula também irá diferenciar:

```text
deadlock de monitor Java;

deadlock de lock explícito;

deadlock de pool;

deadlock de recursos;

deadlock de banco.
```

O foco será a JVM.

A próxima aula oficial será `595 - M18.40 - Backpressure conceitual`.

Por isso, esta aula não irá desenvolver:

- protocolos de demanda;
- publisher e subscriber;
- Reactive Streams;
- `request(n)`;
- buffers reativos;
- estratégias de drop;
- estratégias de latest;
- controle de produção pelo consumidor;
- operadores reativos;
- backpressure em Kafka;
- backpressure em HTTP.

A regra central é remover o ciclo ou uma condição de Coffman; aumentar timeout, pool ou threads não resolve deadlock.

---

## Onde estamos na formação

A sequência oficial é:

```text
592:
Sincronizacao locks atomic.

593:
Race condition.

594:
Deadlocks em Java.

595:
Backpressure conceitual.
```

A progressão é coordenar estado, reproduzir races, diagnosticar ausência de progresso e depois controlar pressão.

Nesta aula:

```text
condições de Coffman:
sim.

deadlock com synchronized:
sim,
em processo filho.

deadlock com ReentrantLock:
sim,
em processo filho.

ThreadMXBean:
sim.

findDeadlockedThreads:
sim.

thread dump:
sim.

wait-for graph:
sim.

lock ordering:
sim.

tryLock:
sim.

lockInterruptibly:
sim.

runbook:
sim.

recuperação:
sim.

deadlock de banco:
diferenciação curta.

backpressure:
não aprofundar.
```

Você reutilizará invariantes, ownership, locks, thread states, executors, timeouts, interruption, JFR, métricas, health checks e runbooks.

A investigação precisa preservar isolamento, timeout, captura antes da recuperação, dados sintéticos, cleanup e zero processos ou arquivos brutos residuais.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/deadlocks
├── deadlock-contract.yaml
├── deadlock-scenario-catalog.yaml
├── deadlock-coffman-policy.yaml
├── deadlock-isolation-policy.yaml
├── deadlock-lock-order-policy.yaml
├── deadlock-timeout-policy.yaml
├── deadlock-detection-policy.yaml
├── deadlock-thread-dump-policy.yaml
├── deadlock-recovery-policy.yaml
├── deadlock-observability-policy.yaml
├── deadlock-regression-policy.yaml
├── deadlock-data-quality-policy.yaml
├── deadlock-security-policy.yaml
├── deadlock-failure-policy.yaml
├── deadlock-scenarios.yaml
└── deadlock-evidence.yaml

concurrency/deadlocks/src/main/java
└── br/com/formacao/concurrency/deadlocks
    ├── ResourceLockId.java
    ├── DeadlockScenarioType.java
    ├── DeadlockDetectionResult.java
    ├── DeadlockThreadSnapshot.java
    ├── WaitForEdge.java
    ├── WaitForGraph.java
    ├── MonitorDeadlockScenario.java
    ├── ExplicitLockDeadlockScenario.java
    ├── OrderedTransferService.java
    ├── InterruptibleTransferService.java
    ├── TimedLockTransferService.java
    ├── DeadlockDetector.java
    ├── DeadlockReportWriter.java
    ├── DeadlockChildMain.java
    ├── DeadlockProcessResult.java
    ├── DeadlockProcessRunner.java
    └── DeadlockDemo.java

concurrency/deadlocks/src/test/java
└── br/com/formacao/concurrency/deadlocks
    ├── DeadlockDetectorTest.java
    ├── WaitForGraphTest.java
    ├── MonitorDeadlockChildProcessTest.java
    ├── ExplicitLockDeadlockChildProcessTest.java
    ├── OrderedTransferServiceTest.java
    ├── InterruptibleTransferServiceTest.java
    ├── TimedLockTransferServiceTest.java
    ├── DeadlockRegressionTest.java
    ├── DeadlockProcessCleanupTest.java
    └── DeadlockContractTest.java

concurrency/deadlocks/reports
├── deadlock-baseline-report.yaml
├── deadlock-monitor-report.yaml
├── deadlock-explicit-lock-report.yaml
├── deadlock-wait-for-graph-report.yaml
├── deadlock-prevention-report.yaml
├── deadlock-recovery-report.yaml
└── deadlock-gate-report.yaml

scripts/concurrency/deadlocks
├── validate-deadlock-contract.ps1
├── validate-deadlock-scenarios.ps1
├── build-deadlock-child-process.ps1
├── run-monitor-deadlock-child.ps1
├── run-explicit-lock-deadlock-child.ps1
├── detect-java-deadlock.ps1
├── collect-deadlock-thread-dump.ps1
├── collect-deadlock-jfr.ps1
├── build-deadlock-wait-for-graph.ps1
├── validate-lock-ordering.ps1
├── validate-interruptible-locking.ps1
├── validate-timed-locking.ps1
├── validate-deadlock-recovery.ps1
├── validate-deadlock-regression.ps1
├── kill-residual-deadlock-process.ps1
├── scan-deadlock-output.ps1
├── collect-deadlock-evidence.ps1
└── verify-deadlock-baseline.ps1

docs/concurrency/deadlocks
├── DEADLOCK_OVERVIEW.md
├── COFFMAN_CONDITIONS.md
├── MONITOR_DEADLOCK_GUIDE.md
├── EXPLICIT_LOCK_DEADLOCK_GUIDE.md
├── JAVA_DEADLOCK_DETECTION.md
├── THREAD_DUMP_DEADLOCK_ANALYSIS.md
├── WAIT_FOR_GRAPH_GUIDE.md
├── DEADLOCK_PREVENTION.md
├── DEADLOCK_RECOVERY_RUNBOOK.md
├── DEADLOCK_TEST_MATRIX.md
└── DEADLOCK_TROUBLESHOOTING.md
```

Ao final, você terá contrato, catálogo, processo filho, dois tipos de deadlock, detector, grafo, ordering, aquisição bounded, runbook, gate e evidence sanitizada.

---

## Conceito essencial

### Deadlock

Conjunto de threads em espera circular por recursos que nunca serão liberados dentro do estado atual.

---

### Mutual exclusion

Um recurso só pode ser possuído por um fluxo por vez.

---

### Hold and wait

Uma thread mantém um recurso enquanto aguarda outro.

---

### No preemption

O recurso não é retirado à força; precisa ser liberado pelo owner.

---

### Circular wait

Existe um ciclo em que cada thread aguarda recurso mantido pela próxima.

---

### Lock ordering

Regra global que determina uma ordem única para aquisição de múltiplos locks.

---

### Wait-for graph

Grafo direcionado em que:

```text
thread
→
recurso ou owner
que ela aguarda.
```

Um ciclo é evidência de deadlock.

---

### Monitor deadlock

Deadlock envolvendo intrinsic locks adquiridos por `synchronized`.

---

### Explicit lock deadlock

Deadlock envolvendo `Lock`, como `ReentrantLock`.

---

### Pool-induced deadlock

Tasks aguardam outras tasks que não podem executar porque todos os workers do pool estão ocupados pelos próprios waiters.

---

### Resource deadlock

Fluxos aguardam combinações de recursos limitados em ordem incompatível.

---

### `ThreadMXBean`

API de gerenciamento da JVM usada para consultar threads e detectar deadlocks.

---

### `findMonitorDeadlockedThreads`

Detecta deadlocks envolvendo monitores e ownable synchronizers monitoráveis pela operação específica.

---

### `findDeadlockedThreads`

Detecta deadlocks envolvendo monitores e ownable synchronizers, incluindo locks explícitos suportados.

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

- aula 593 validada;
- nenhum harness de race ativo;
- zero thread leaks;
- zero task leaks;
- Java 21 ativo;
- scripts podem criar e encerrar processo filho;
- nenhum deadlock será criado dentro da JVM da suíte.

---

### 2. Criar contrato

Arquivo:

```text
deadlock-contract.yaml
```

Conteúdo:

```yaml
deadlock:
  required:
    - scenario
    - resources
    - owners
    - acquisition-order
    - Coffman-conditions
    - isolation
    - timeout
    - detection
    - evidence
    - recovery
    - prevention
    - cleanup

  intentionalScenario:
    childProcess:
      required

  mainTestProcess:
    intentionalDeadlock:
      forbidden

  rawDump:
    repository:
      forbidden

  nextLesson:
    code:
      M18.40
```

---

### 3. Criar catálogo de cenários

Arquivo:

```text
deadlock-scenario-catalog.yaml
```

Exemplo:

```yaml
scenarios:
  - id:
      MONITOR-TWO-LOCK-CYCLE

    type:
      monitor

    resources:
      - account-A-monitor
      - account-B-monitor

    actors:
      - transfer-A-to-B
      - transfer-B-to-A

    isolation:
      child-process

    detector:
      ThreadMXBean

    prevention:
      total-lock-order

  - id:
      EXPLICIT-LOCK-CYCLE

    type:
      ReentrantLock

    prevention:
      - lockInterruptibly
      - tryLock-timeout
      - total-lock-order
```

---

### 4. Criar policy das condições de Coffman

Arquivo:

```text
deadlock-coffman-policy.yaml
```

Conteúdo:

```yaml
Coffman:
  evaluate:
    - mutual-exclusion
    - hold-and-wait
    - no-preemption
    - circular-wait

  prevention:
    breakAtLeastOne:
      required

  report:
    conditionEvidence:
      required

  claimDeadlockWithoutCycle:
    forbidden
```

---

### 5. Mapear as quatro condições

No cenário de transferência, cada conta possui lock exclusivo, cada thread mantém um lock enquanto aguarda outro, não há retirada forçada e A espera B enquanto B espera A. Eliminar uma dessas condições impede o ciclo clássico.

---

### 6. Criar IDs ordenáveis

```java
public record ResourceLockId(
        long value)
        implements Comparable<ResourceLockId> {

    @Override
    public int compareTo(
            ResourceLockId other) {
        return Long.compare(
                value,
                other.value);
    }
}
```

O ID será sintético e estável; não use `identityHashCode` sem tratar colisões.

---

### 7. Criar deadlock de monitor

```java
public final class MonitorDeadlockScenario {

    private final Object first =
            new Object();

    private final Object second =
            new Object();

    private final CountDownLatch firstLocksHeld =
            new CountDownLatch(2);

    public void start() {
        Thread left =
                new Thread(
                        () -> lockFirstThenSecond(
                                first,
                                second),
                        "deadlock-monitor-left");

        Thread right =
                new Thread(
                        () -> lockFirstThenSecond(
                                second,
                                first),
                        "deadlock-monitor-right");

        left.setDaemon(true);
        right.setDaemon(true);

        left.start();
        right.start();
    }

    private void lockFirstThenSecond(
            Object owned,
            Object awaited) {

        synchronized (owned) {
            firstLocksHeld.countDown();

            awaitLatch();

            synchronized (awaited) {
                throw new IllegalStateException(
                        "Unreachable when deadlocked");
            }
        }
    }

    private void awaitLatch() {
        try {
            firstLocksHeld.await();
        } catch (InterruptedException exception) {
            Thread.currentThread()
                    .interrupt();
        }
    }
}
```

O latch garante que cada thread adquira seu primeiro monitor antes de tentar o segundo.

---

### 8. Isolar em processo filho

Classe:

```java
public final class DeadlockChildMain {

    public static void main(
            String[] arguments)
            throws Exception {

        String scenario =
                arguments.length == 0
                        ? "monitor"
                        : arguments[0];

        if (scenario.equals("monitor")) {
            new MonitorDeadlockScenario()
                    .start();
        } else {
            new ExplicitLockDeadlockScenario()
                    .start();
        }

        System.out.println(
                "DEADLOCK_SCENARIO_STARTED");

        DeadlockDetector detector =
                new DeadlockDetector();

        DeadlockDetectionResult result =
                detector.awaitDetection(
                        Duration.ofSeconds(5));

        DeadlockReportWriter.write(
                result,
                System.out);

        System.exit(
                result.detected()
                        ? 0
                        : 2);
    }
}
```

`System.exit` ocorre somente no processo filho do laboratório.

---

### 9. Criar policy de isolamento

Arquivo:

```text
deadlock-isolation-policy.yaml
```

Conteúdo:

```yaml
isolation:
  intentionalDeadlock:
    process:
      child

  child:
    timeout:
      required

    stdout:
      sanitized

    stderr:
      sanitized

  parent:
    killOnTimeout:
      required

    waitForExit:
      required

  residualProcess:
    forbidden
```

---

### 10. Criar detector

```java
public final class DeadlockDetector {

    private final ThreadMXBean threadMXBean =
            ManagementFactory
                    .getThreadMXBean();

    public DeadlockDetectionResult detect() {
        long[] ids =
                threadMXBean
                        .findDeadlockedThreads();

        if (ids == null
                || ids.length == 0) {
            return DeadlockDetectionResult
                    .notDetected();
        }

        ThreadInfo[] infos =
                threadMXBean.getThreadInfo(
                        ids,
                        true,
                        true);

        return DeadlockDetectionResult
                .detected(
                        Arrays.stream(infos)
                                .filter(
                                        Objects::nonNull)
                                .map(
                                        DeadlockThreadSnapshot
                                                ::from)
                                .toList());
    }

    public DeadlockDetectionResult
    awaitDetection(
            Duration timeout)
            throws InterruptedException {

        Instant deadline =
                Instant.now()
                        .plus(timeout);

        while (Instant.now()
                .isBefore(deadline)) {

            DeadlockDetectionResult result =
                    detect();

            if (result.detected()) {
                return result;
            }

            Thread.sleep(50);
        }

        return DeadlockDetectionResult
                .notDetected();
    }
}
```

---

### 11. Criar snapshot sanitizado

```java
public record DeadlockThreadSnapshot(
        String threadName,
        Thread.State state,
        String lockNameCategory,
        String lockOwnerName,
        List<String> stackCategories) {

    public static DeadlockThreadSnapshot from(
            ThreadInfo info) {

        List<String> categories =
                Arrays.stream(
                                info.getStackTrace())
                        .limit(12)
                        .map(
                                element ->
                                        element
                                                .getClassName()
                                                + "#"
                                                + element
                                                        .getMethodName())
                        .toList();

        return new DeadlockThreadSnapshot(
                sanitizeName(
                        info.getThreadName()),
                info.getThreadState(),
                categorizeLock(
                        info.getLockName()),
                sanitizeName(
                        info.getLockOwnerName()),
                categories);
    }
}
```

Não grave identidade hexadecimal do monitor como label de métrica.

---

### 12. Diferenciar detectores

Use:

```java
threadMXBean
        .findMonitorDeadlockedThreads();
```

para deadlocks de monitor.

Use:

```java
threadMXBean
        .findDeadlockedThreads();
```

para cobertura mais ampla, incluindo ownable synchronizers suportados.

Registre qual método detectou o cenário.

---

### 13. Criar processo runner

```java
public final class DeadlockProcessRunner {

    public DeadlockProcessResult run(
            String scenario,
            Duration timeout)
            throws Exception {

        Process process =
                new ProcessBuilder(
                        javaExecutable(),
                        "-cp",
                        classpath(),
                        DeadlockChildMain.class
                                .getName(),
                        scenario)
                        .redirectErrorStream(true)
                        .start();

        boolean exited =
                process.waitFor(
                        timeout.toMillis(),
                        TimeUnit.MILLISECONDS);

        if (!exited) {
            process.destroy();

            if (!process.waitFor(
                    500,
                    TimeUnit.MILLISECONDS)) {
                process.destroyForcibly();
                process.waitFor();
            }
        }

        String output =
                new String(
                        process
                                .getInputStream()
                                .readAllBytes(),
                        StandardCharsets.UTF_8);

        return DeadlockProcessResult.from(
                scenario,
                exited,
                process.exitValue(),
                sanitize(output));
    }
}
```

Acesse `exitValue()` somente após o encerramento.

---

### 14. Executar cenário de monitor

Script:

```text
run-monitor-deadlock-child.ps1
```

Procedimento:

1. compilar;
2. iniciar processo filho;
3. esperar marcador de início;
4. aguardar detecção;
5. capturar relatório;
6. confirmar duas threads;
7. confirmar ciclo;
8. encerrar processo;
9. validar ausência de PID residual.

---

### 15. Criar deadlock com lock explícito

```java
public final class ExplicitLockDeadlockScenario {

    private final ReentrantLock first =
            new ReentrantLock();

    private final ReentrantLock second =
            new ReentrantLock();

    private final CountDownLatch held =
            new CountDownLatch(2);

    public void start() {
        startActor(
                "deadlock-lock-left",
                first,
                second);

        startActor(
                "deadlock-lock-right",
                second,
                first);
    }

    private void startActor(
            String name,
            ReentrantLock owned,
            ReentrantLock awaited) {

        Thread thread =
                new Thread(
                        () -> {
                            owned.lock();

                            try {
                                held.countDown();
                                awaitHeld();

                                awaited.lock();

                                try {
                                    throw new IllegalStateException(
                                            "Unreachable");
                                } finally {
                                    awaited.unlock();
                                }
                            } finally {
                                owned.unlock();
                            }
                        },
                        name);

        thread.setDaemon(true);
        thread.start();
    }
}
```

Esse cenário permanece isolado no processo filho.

---

### 16. Construir wait-for graph

```java
public record WaitForEdge(
        String waitingThread,
        String ownerThread,
        String resourceCategory) {
}
```

Grafo:

```java
public final class WaitForGraph {

    private final Map<String, Set<String>>
            edges;

    public boolean hasCycle() {
        return detectCycle(
                edges);
    }
}
```

Exemplo:

```text
deadlock-monitor-left
→
deadlock-monitor-right.

deadlock-monitor-right
→
deadlock-monitor-left.
```

---

### 17. Criar script do grafo

Script:

```text
build-deadlock-wait-for-graph.ps1
```

Saída:

```yaml
graph:
  nodes:
    - monitor-left
    - monitor-right

  edges:
    - from:
        monitor-left

      to:
        monitor-right

    - from:
        monitor-right

      to:
        monitor-left

  cycle:
    true
```

---

### 18. Criar policy de detecção

Arquivo:

```text
deadlock-detection-policy.yaml
```

Conteúdo:

```yaml
detection:
  primary:
    ThreadMXBean-findDeadlockedThreads

  monitorSpecific:
    ThreadMXBean-findMonitorDeadlockedThreads

  evidence:
    required:
      - thread-category
      - state
      - owner-category
      - waited-resource-category
      - cycle
      - timestamp

  polling:
    bounded:
      required

  noDeadlockDetected:
    result:
      not-reproduced
```

---

### 19. Coletar thread dump

Script:

```text
collect-deadlock-thread-dump.ps1
```

Com `jcmd`:

```powershell
jcmd `
  $processId `
  Thread.print `
  -l
```

Alternativa:

```powershell
jstack `
  -l `
  $processId
```

Capture antes do kill.

---

### 20. Interpretar dump

Procure:

```text
BLOCKED;

waiting to lock;

locked;

parking to wait for;

Found one Java-level deadlock.
```

O dump apresenta thread, estado, recurso, owner, stack e ciclo; sanitize antes de persistir.

---

### 21. Criar policy de dumps

Arquivo:

```text
deadlock-thread-dump-policy.yaml
```

Conteúdo:

```yaml
threadDump:
  collectBeforeRecovery:
    preferred

  raw:
    repository:
      forbidden

  sanitize:
    required

  preserve:
    - thread-category
    - state
    - lock-category
    - owner-category
    - stack-category
    - deadlock-summary

  sensitiveArguments:
    remove:
      required
```

---

### 22. Coletar JFR

Script:

```text
collect-deadlock-jfr.ps1
```

Use janela curta no processo filho.

Analise:

- monitor blocked;
- thread park;
- lock instances;
- thread state;
- CPU;
- allocation;
- duração;
- cenário.

JFR complementa o dump e o `ThreadMXBean`.

---

### 23. Diferenciar bloqueio normal

Exemplo normal:

```text
thread A mantém lock;

thread B aguarda;

thread A termina;

thread B prossegue.
```

Não existe ciclo.

O wait-for graph é acíclico.

Deadlock exige ciclo sem liberação possível.

---

### 24. Diferenciar starvation

Em starvation:

- lock pode ser liberado;
- outras threads continuam adquirindo;
- uma thread específica não progride;
- não existe necessariamente ciclo.

Fairness pode influenciar, mas não é cura universal.

---

### 25. Diferenciar livelock

Em livelock:

- threads não estão paradas;
- estados mudam;
- tentativas são repetidas;
- nenhuma operação termina.

Exemplo:

```text
duas threads liberam
e tentam novamente
sempre ao mesmo tempo.
```

Deadlock apresenta espera; livelock apresenta atividade sem progresso útil.

---

### 26. Prevenir com lock ordering

Regra:

```text
sempre adquirir
o lock de menor ID
antes do maior ID.
```

Implementação:

```java
public final class OrderedTransferService {

    public void transfer(
            Account left,
            Account right,
            int amount) {

        Account first =
                left.lockId()
                                .compareTo(
                                        right.lockId())
                        <= 0
                        ? left
                        : right;

        Account second =
                first == left
                        ? right
                        : left;

        synchronized (first.monitor()) {
            synchronized (second.monitor()) {
                applyTransfer(
                        left,
                        right,
                        amount);
            }
        }
    }
}
```

A direção da transferência não altera a ordem de aquisição.

---

### 27. Tratar IDs iguais

Se duas entidades podem compartilhar o mesmo ID lógico ou lock ID, defina desempate.

Exemplo:

- rejeitar entidades iguais quando a operação não faz sentido;
- usar lock global de desempate;
- usar registry único de locks;
- garantir unicidade estrutural.

A ordem precisa ser total.

---

### 28. Criar policy de lock ordering

Arquivo:

```text
deadlock-lock-order-policy.yaml
```

Conteúdo:

```yaml
lockOrdering:
  global:
    required

  orderKey:
    stable:
      required

    uniqueOrTieBreaker:
      required

  reverseBusinessOperation:
    sameAcquisitionOrder:
      required

  documentation:
    required

  dynamicUnknownOrder:
    action:
      redesign
```

---

### 29. Validar ordering

Script:

```text
validate-lock-ordering.ps1
```

Execute transferências simultâneas:

```text
A para B;

B para A.
```

Confirme:

- ambas usam a mesma ordem de locks;
- nenhuma detecção de deadlock;
- invariantes preservadas;
- tasks terminam;
- zero locks residuais;
- throughput e wait time registrados.

---

### 30. Prevenir com `tryLock`

```java
public boolean transfer(
        Account from,
        Account to,
        int amount,
        Duration timeout)
        throws InterruptedException {

    Instant deadline =
            Instant.now()
                    .plus(timeout);

    if (!from.lock()
            .tryLock(
                    remaining(deadline),
                    TimeUnit.NANOSECONDS)) {
        return false;
    }

    try {
        if (!to.lock()
                .tryLock(
                        remaining(deadline),
                        TimeUnit.NANOSECONDS)) {
            return false;
        }

        try {
            applyTransfer(
                    from,
                    to,
                    amount);

            return true;
        } finally {
            to.lock().unlock();
        }
    } finally {
        from.lock().unlock();
    }
}
```

Use deadline global.

Não reaplique o timeout inteiro no segundo lock.

---

### 31. Evitar livelock com retry

Se `tryLock` falhar, use tentativas bounded, jitter, deadline, registro e fallback. A prevenção não deve criar livelock.

---

### 32. Usar `lockInterruptibly`

```java
public void transferInterruptibly(
        Account from,
        Account to,
        int amount)
        throws InterruptedException {

    from.lock()
            .lockInterruptibly();

    try {
        to.lock()
                .lockInterruptibly();

        try {
            applyTransfer(
                    from,
                    to,
                    amount);
        } finally {
            to.lock().unlock();
        }
    } finally {
        from.lock().unlock();
    }
}
```

A espera por lock pode ser cancelada.

Isso quebra a condição prática de no preemption para a task cancelada, mas ainda é melhor manter ordering.

---

### 33. Criar policy de timeout

Arquivo:

```text
deadlock-timeout-policy.yaml
```

Conteúdo:

```yaml
lockWait:
  requestPath:
    bounded:
      required

  deadline:
    global:
      required

  retry:
    maximumAttempts:
      required

    jitter:
      requiredWhenRepeated

  timeout:
    classify:
      - contention
      - overload
      - possible-deadlock
      - cancellation

  timeoutAloneProvesDeadlock:
    false
```

Timeout é sinal; ciclo é evidência de deadlock.

---

### 34. Reduzir hold-and-wait

Outra prevenção é evitar manter um recurso enquanto aguarda outro.

Reduza hold-and-wait adquirindo em ordem, dividindo a operação, usando transação, single writer ou estado imutável. Não aguarde HTTP, banco ou fila mantendo lock local.

---

### 35. Reduzir mutual exclusion

Reduza mutual exclusion com imutabilidade, snapshots, confinamento, particionamento, atomics, estruturas concorrentes ou single writer.

---

### 36. Deadlock de pool

Cenário:

```text
pool:
2 workers.

task A:
submete child A
e aguarda.

task B:
submete child B
e aguarda.

child A e child B:
ficam na fila.

workers livres:
0.
```

Não há ciclo de locks tradicional, mas existe dependência circular de capacidade.

Evite:

- bloquear aguardando child no mesmo pool saturável;
- fan-out sem capacidade;
- `Future.get()` dentro do mesmo executor;
- pool pequeno com dependências internas;
- fila sem observabilidade.

---

### 37. Deadlock de recursos

Exemplo:

```text
thread A:
possui conexão DB;
aguarda permit HTTP.

thread B:
possui permit HTTP;
aguarda conexão DB.
```

A prevenção usa ordem global, aquisição curta, timeout, liberação antecipada e menos recursos simultâneos.

---

### 38. Diferenciar deadlock de banco

No SGBD:

```text
transação A
possui row lock X
e espera Y.

transação B
possui row lock Y
e espera X.
```

O banco geralmente detecta o ciclo e aborta uma transação.

Na JVM, um deadlock de monitor pode permanecer indefinidamente.

A aplicação precisa tratar a exceção de banco com retry bounded e idempotência, sem confundi-la com deadlock de threads.

---

### 39. Criar policy de recuperação

Arquivo:

```text
deadlock-recovery-policy.yaml
```

Conteúdo:

```yaml
recovery:
  intentionalLab:
    terminateChildProcess

  production:
    preferred:
      - stop-or-drain-traffic
      - capture-thread-dump
      - capture-JFR-when-possible
      - identify-affected-instance
      - restart-instance
      - verify-recovery
      - preserve-evidence
      - open-root-cause-analysis

  unsafeThreadStop:
    forbidden

  forceUnlockForeignMonitor:
    impossible

  repeatedRestartWithoutDiagnosis:
    forbidden
```

---

### 40. Entender por que restart funciona

Deadlock está no estado da JVM.

Reiniciar o processo elimina:

- threads;
- monitores;
- locks;
- filas em memória;
- ciclo.

Porém, restart não corrige a causa.

Sem mudança no código, o incidente pode retornar.

---

### 41. Criar runbook

Arquivo:

```text
DEADLOCK_RECOVERY_RUNBOOK.md
```

Passos: confirmar impacto e instância, reduzir tráfego, coletar dump e JFR, executar detector, construir o grafo, reiniciar, validar recuperação, preservar evidence e abrir causa raiz com teste de regressão.

---

### 42. Criar detector periódico seguro

Em produção, um detector pode executar com baixa frequência.

O detector periódico deve agregar categorias, emitir evento crítico, orientar coleta segura e nunca tentar desbloquear threads ou encerrar a JVM sem política.

---

### 43. Criar policy de observabilidade

Arquivo:

```text
deadlock-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - detection-count
    - involved-thread-count
    - monitor-deadlock-count
    - ownable-synchronizer-deadlock-count
    - blocked-thread-category
    - lock-wait-category
    - request-timeout-rate
    - pool-saturation
    - queue-growth
    - recovery-time

  event:
    severity:
      critical

  labels:
    forbidden:
      - thread-id
      - raw-lock-identity
      - request-id
      - customer-id

  correlation:
    - release
    - instance
    - timestamp
    - scenario-category
```

---

### 44. Criar health signal

Liveness de processo pode permanecer verde.

Use canary, progresso de worker, idade da fila ou heartbeat; JVM responsiva não prova progresso funcional.

---

### 45. Criar regressão

Arquivo:

```text
deadlock-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  unsafeScenario:
    childProcess:
      detectionRequired

  fixedScenario:
    repeatedRuns:
      required

  validate:
    - no-deadlock-detected
    - all-tasks-completed
    - invariants-preserved
    - bounded-wait
    - zero-residual-process

  timingOnlyAssertion:
    forbidden
```

---

### 46. Testar o detector

`DeadlockDetectorTest` usa um provider falso de `ThreadInfo` para validar transformação sem criar deadlock na JVM do teste.

O cenário real permanece no processo filho.

Valide:

- nenhum ID;
- lista vazia;
- duas threads;
- owner correto;
- ciclo;
- stack sanitizada;
- detector monitor-specific;
- detector geral.

---

### 47. Testar processo filho

`MonitorDeadlockChildProcessTest`:

- executa script ou runner;
- aplica timeout total;
- espera exit code;
- procura `DEADLOCK_DETECTED`;
- valida duas categorias de thread;
- confirma cycle `true`;
- confirma processo encerrado;
- não importa dump bruto.

---

### 48. Testar explicit locks

`ExplicitLockDeadlockChildProcessTest` confirma que:

- `findDeadlockedThreads` detecta;
- ownable synchronizer aparece;
- `findMonitorDeadlockedThreads` pode não cobrir o mesmo caso;
- processo encerra;
- evidence é sanitizada.

---

### 49. Validar correções

Execute o mesmo fluxo contra:

```text
ordem invertida:
deadlock detectado.

ordem global:
nenhum deadlock.

lockInterruptibly:
cancelamento funciona.

tryLock bounded:
timeout retorna controle.
```

Correção precisa preservar a invariante de negócio.

---

### 50. Criar failure policy

Arquivo:

```text
deadlock-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  intentionalDeadlockInMainProcess:
    action:
      fail-review

  childProcessTimeout:
    action:
      destroy-forcibly-and-fail

  residualPID:
    action:
      fail-gate

  detectorMissOnKnownScenario:
    action:
      fail

  cycleWithoutEvidence:
    result:
      inconclusive

  unsafeThreadStop:
    action:
      reject

  backpressure:
    deferredToLesson595
```

---

### 51. Criar data quality policy

Arquivo:

```text
deadlock-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingThreadInfo:
    result:
      incomplete

  rawDumpOnly:
    result:
      requires-analysis

  timeoutWithoutCycle:
    result:
      suspected-only

  staleDump:
    result:
      limited

  childProcessKilledBeforeCapture:
    result:
      insufficient-evidence

  fixedScenarioSingleRun:
    result:
      limited
```

---

### 52. Criar security policy

Arquivo:

```text
deadlock-security-policy.yaml
```

Conteúdo:

```yaml
security:
  threadName:
    sensitiveIdentifier:
      forbidden

  stack:
    argumentValue:
      remove:
        required

  rawDump:
    repository:
      forbidden

  rawJFR:
    repository:
      forbidden

  processCommand:
    credential:
      forbidden

  evidence:
    lockIdentity:
      categorized
```

---

### 53. Criar cenários oficiais

Arquivo:

```text
deadlock-scenarios.yaml
```

Cenários:

```text
monitor-two-lock-cycle;

explicit-lock-two-lock-cycle;

ThreadMXBean-no-deadlock;

ThreadMXBean-monitor-detection;

ThreadMXBean-general-detection;

wait-for-graph-cycle;

normal-contention-no-cycle;

starvation-classification;

livelock-classification;

global-lock-ordering;

lock-order-tie-breaker;

tryLock-timeout;

tryLock-bounded-retry;

lockInterruptibly-cancellation;

pool-induced-deadlock-model;

resource-ordering;

child-process-timeout;

child-process-forced-kill;

recovery-restart;

zero-residual-process.
```

Cada cenário registra recursos, owners, Coffman, ciclo, detector, timeout, prevenção, recovery, resultado e evidence.

---

### 54. Criar relatório baseline

Arquivo:

```text
deadlock-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  Java:
    version:
      21

  intentionalScenarios:
    isolation:
      child-process

  monitorDeadlock:
    detected:
      true

  explicitLockDeadlock:
    detected:
      true

  fixedOrdering:
    detected:
      false

  cleanup:
    residualProcesses:
      zero

  result:
    PASS
```

---

### 55. Criar matriz de testes

Arquivo:

```text
DEADLOCK_TEST_MATRIX.md
```

Cenários:

- Coffman conditions;
- monitor cycle;
- explicit lock cycle;
- daemon child threads;
- child timeout;
- forced kill;
- `ThreadMXBean`;
- monitor detector;
- general detector;
- `ThreadInfo`;
- wait-for graph;
- normal contention;
- starvation;
- livelock;
- lock ordering;
- tie-breaker;
- `tryLock`;
- global deadline;
- bounded retry;
- `lockInterruptibly`;
- pool-induced model;
- resource ordering;
- thread dump;
- JFR;
- recovery;
- regression;
- zero residual process;
- security;
- evidence.

---

### 56. Criar troubleshooting

Arquivo:

```text
DEADLOCK_TROUBLESHOOTING.md
```

Inclua:

- processo filho não inicia;
- detector retorna `null`;
- monitor detector não vê explicit lock;
- thread dump foi coletado tarde;
- cenário não forma ciclo;
- latch não chega a zero;
- processo não encerra;
- `destroy()` não funciona;
- PID residual;
- `tryLock` usa timeout duplicado;
- retry cria livelock;
- ordering não é total;
- empate de IDs;
- pool trava sem ciclo de locks;
- deadlock de banco confundido com JVM;
- dados sensíveis no dump;
- conteúdo de backpressure antecipado.

---

### 57. Criar gate

O gate valida:

- contrato;
- catálogo;
- Coffman;
- isolamento;
- monitor deadlock;
- explicit lock deadlock;
- detector;
- wait-for graph;
- thread dump;
- ordering;
- interruptible locking;
- timed locking;
- recovery;
- regression;
- zero residual processes;
- segurança.

Status:

```text
PASS;

FAIL_ISOLATION;

FAIL_NOT_DETECTED;

FAIL_WAIT_FOR_GRAPH;

FAIL_LOCK_ORDER;

FAIL_TIMEOUT;

FAIL_RECOVERY;

FAIL_RESIDUAL_PROCESS;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 58. Coletar evidence

Script:

```text
collect-deadlock-evidence.ps1
```

Arquivo:

```text
deadlock-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- scenario category;
- Coffman status;
- isolation status;
- detector status;
- cycle status;
- thread category;
- lock category;
- prevention category;
- recovery status;
- residual process status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- thread ID;
- raw monitor identity;
- PID persistido;
- request ID;
- customer ID;
- payload;
- argumentos sensíveis;
- dump bruto;
- JFR bruto;
- material da aula 595.

---

### 59. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\deadlocks\validate-deadlock-contract.ps1

.\scripts\concurrency\deadlocks\validate-deadlock-scenarios.ps1

.\scripts\concurrency\deadlocks\build-deadlock-child-process.ps1

.\scripts\concurrency\deadlocks\run-monitor-deadlock-child.ps1

.\scripts\concurrency\deadlocks\run-explicit-lock-deadlock-child.ps1

.\scripts\concurrency\deadlocks\detect-java-deadlock.ps1

.\scripts\concurrency\deadlocks\collect-deadlock-thread-dump.ps1

.\scripts\concurrency\deadlocks\collect-deadlock-jfr.ps1

.\scripts\concurrency\deadlocks\build-deadlock-wait-for-graph.ps1

.\scripts\concurrency\deadlocks\validate-lock-ordering.ps1

.\scripts\concurrency\deadlocks\validate-interruptible-locking.ps1

.\scripts\concurrency\deadlocks\validate-timed-locking.ps1

.\scripts\concurrency\deadlocks\validate-deadlock-recovery.ps1

.\scripts\concurrency\deadlocks\validate-deadlock-regression.ps1

.\scripts\concurrency\deadlocks\kill-residual-deadlock-process.ps1

.\scripts\concurrency\deadlocks\scan-deadlock-output.ps1

.\scripts\concurrency\deadlocks\collect-deadlock-evidence.ps1

.\scripts\concurrency\deadlocks\verify-deadlock-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- cenários aprovados;
- condições de Coffman registradas;
- deadlocks isolados em processo filho;
- monitor deadlock detectado;
- explicit lock deadlock detectado;
- wait-for graph com ciclo;
- dumps sanitizados;
- ordering aprovado;
- tie-breaker aprovado;
- acquisition interruptível aprovada;
- `tryLock` bounded aprovado;
- recovery aprovada;
- regressão aprovada;
- zero PIDs residuais;
- segurança aprovada;
- evidence sanitizada;
- backpressure não antecipada.

---

### 60. Encerrar o laboratório

Confirme zero processos e PIDs residuais, nenhum dump bruto versionado e baseline preservada.

Execute:

```powershell
.\scripts\concurrency\deadlocks\kill-residual-deadlock-process.ps1

Remove-Item `
  .tmp/deadlocks `
  -Recurse `
  -Force
```

---

## Entendendo o que foi feito

### Deadlock ganhou definição operacional

Espera longa deixou de ser confundida com ciclo permanente.

### Coffman ganhou evidência

As quatro condições passaram a ser verificadas no cenário.

### O processo filho ganhou segurança

O deadlock intencional não contaminou a suíte principal.

### `ThreadMXBean` ganhou detecção

A JVM passou a fornecer threads, owners e recursos envolvidos.

### O dump ganhou leitura estruturada

Estados, locks, owners e stacks passaram a formar um ciclo explicável.

### Wait-for graph ganhou causalidade

A relação entre quem espera e quem possui o recurso ficou visível.

### Ordering ganhou prevenção

Operações opostas adquiriram locks na mesma ordem global.

### `tryLock` ganhou boundedness

A espera deixou de ser infinita e passou a retornar controle.

### `lockInterruptibly` ganhou cancelamento

A task passou a responder à interrupção enquanto aguardava lock.

### Recovery ganhou runbook

Coleta, isolamento, restart e validação passaram a seguir uma sequência.

### A próxima aula ganhou fronteira

A aula 595 irá aprofundar backpressure conceitual.

---

## Erros comuns importantes

### Criar deadlock dentro do teste principal

A suíte pode nunca terminar.

### Usar apenas timeout para afirmar deadlock

Timeout também pode indicar contenção, I/O ou harness defeituoso.

### Aumentar o pool

Mais threads podem ampliar o número de waiters sem remover o ciclo.

### Aumentar timeout

O deadlock continuará existindo por mais tempo.

### Usar `Thread.stop`

O estado compartilhado pode ficar inconsistente.

### Tentar interromper monitor `BLOCKED`

A interrupção não retira a thread da aquisição de intrinsic lock.

### Definir ordering parcial

Empates ou recursos dinâmicos podem recriar ciclos.

### Repetir `tryLock` sem limite

A prevenção pode virar livelock.

### Coletar dump depois do restart

A evidência do ciclo foi perdida.

### Confundir banco e JVM

Os detectores e estratégias de recuperação são diferentes.

---

## Comandos úteis

### Executar cenário de monitor

```powershell
.\scripts\concurrency\deadlocks\run-monitor-deadlock-child.ps1
```

### Executar cenário de lock explícito

```powershell
.\scripts\concurrency\deadlocks\run-explicit-lock-deadlock-child.ps1
```

### Detectar deadlock

```powershell
.\scripts\concurrency\deadlocks\detect-java-deadlock.ps1
```

### Coletar dump

```powershell
.\scripts\concurrency\deadlocks\collect-deadlock-thread-dump.ps1
```

### Validar ordering

```powershell
.\scripts\concurrency\deadlocks\validate-lock-ordering.ps1
```

### Limpar processos residuais

```powershell
.\scripts\concurrency\deadlocks\kill-residual-deadlock-process.ps1
```

---

## Exercício guiado

### Parte 1 — Coffman

Mapeie as quatro condições.

### Parte 2 — Monitor

Execute o deadlock em processo filho.

### Parte 3 — Explicit lock

Repita com `ReentrantLock`.

### Parte 4 — Detector

Use `ThreadMXBean`.

### Parte 5 — Graph

Construa o wait-for graph.

### Parte 6 — Dump

Correlacione states, owners e stacks.

### Parte 7 — Ordering

Implemente ordem global e tie-breaker.

### Parte 8 — Bounded acquisition

Use `tryLock` e deadline global.

### Parte 9 — Recovery

Execute o runbook e valide o restart.

### Parte 10 — Gate

Valide regressão, cleanup, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 593 e ponte para a aula 595 foram preservadas;
- deadlock, Coffman, wait-for graph, monitor, explicit lock, pool-induced e resource deadlock foram definidos;
- contrato, catálogo e policies foram criados;
- cenários intencionais executam somente em processo filho com timeout e kill de segurança;
- deadlocks de monitor e `ReentrantLock` foram reproduzidos;
- `ThreadMXBean`, `ThreadInfo` e os dois detectores foram validados;
- wait-for graph, dump e JFR produziram evidence sanitizada;
- contenção, starvation, livelock e deadlock foram diferenciados;
- ordering global e tie-breaker impediram circular wait;
- `tryLock` usa deadline global e retry bounded;
- `lockInterruptibly` permitiu cancelamento;
- hold-and-wait e mutual exclusion foram reduzidos quando possível;
- pool-induced, resource e database deadlocks foram diferenciados;
- runbook cobre captura, isolamento, restart e validação;
- regressão confirma conclusão das tasks e ausência de ciclos;
- zero processos residuais foram validados;
- matriz, troubleshooting, gate, segurança e evidence estão presentes;
- nenhum PID, dump bruto, JFR bruto ou identificador real foi commitado;
- backpressure não foi aprofundada;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/deadlocks `
  scripts/concurrency/deadlocks `
  docs/concurrency/deadlocks `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|rawThreadDump|rawJfr|rawMonitorIdentity|persistedPid|businessPayload|request\(n\)|ReactiveStreams"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): diagnosticar e prevenir deadlocks Java"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- identificadores reais;
- PIDs;
- dumps brutos;
- JFR bruto;
- artifacts temporários;
- processo residual;
- implementação de backpressure;
- material da aula 595.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você reproduziu e diagnosticou deadlocks Java de maneira segura.

Você trabalhou com:

```text
Coffman;

monitor deadlock;

explicit lock deadlock;

processo filho;

ThreadMXBean;

ThreadInfo;

thread dump;

JFR;

wait-for graph;

lock ordering;

tryLock;

lockInterruptibly;

recovery;

runbook.
```

Você comprovou que deadlock é um ciclo de espera, não apenas uma operação lenta; que as quatro condições de Coffman ajudam a estruturar a causa; que cenários intencionais devem ficar fora da JVM principal; que `ThreadMXBean`, dumps e wait-for graphs permitem explicar o ciclo; que ordering global remove circular wait; que timeout sozinho não prova deadlock; que `tryLock` e interruption devolvem controle, mas precisam de retry bounded; e que restart recupera a instância sem corrigir a causa raiz.

A próxima aula será:

```text
595 - M18.40 - Backpressure conceitual
```

Nela, você irá estudar produtores e consumidores com velocidades diferentes, sinais de demanda, filas bounded, propagação de pressão, políticas de rejeição, buffering e proteção de recursos, sem confundir backpressure com simples aumento de capacidade.

Nenhum protocolo Reactive Streams, `request(n)`, publisher, subscriber, operador reativo, estratégia de drop ou implementação de backpressure foi desenvolvido nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei as condições de Coffman.
- [ ] Isolei o deadlock em processo filho.
- [ ] Detectei com `ThreadMXBean`.
- [ ] Construí wait-for graph.
- [ ] Analisei thread dump.
- [ ] Implementei lock ordering.
- [ ] Usei aquisição bounded.
- [ ] Validei recovery sem processo residual.

---

## Troubleshooting adicional

### O detector retorna `null`

O ciclo pode ainda não ter sido formado ou o cenário terminou antes da coleta.

### O monitor detector não encontra o lock explícito

Use `findDeadlockedThreads` para ownable synchronizers.

### O processo filho não termina

Aplique timeout, `destroy` e `destroyForcibly`.

### O dump não mostra ciclo

Colete durante o incidente e confirme o PID correto.

### Ordering continua falhando

A ordem pode não ser total ou o tie-breaker está ausente.

### `tryLock` demora demais

Use deadline global, não timeout completo por aquisição.

### Retry consome CPU

Aplique limite, jitter e fallback.

### A instância responde health, mas não processa

Use canary funcional e métricas de progresso.

### O banco reportou deadlock

Analise o SGBD e trate a transação abortada; não use apenas o detector da JVM.

### O conteúdo começou a implementar `request(n)`

Preserve backpressure para a aula 595.

---

## Perguntas de revisão

1. O que é deadlock?
2. Quais são as quatro condições de Coffman?
3. O que é circular wait?
4. O que é wait-for graph?
5. Qual diferença entre deadlock e contenção?
6. Qual diferença entre deadlock e starvation?
7. Qual diferença entre deadlock e livelock?
8. Para que serve `ThreadMXBean`?
9. Qual diferença entre os dois métodos de detecção?
10. Por que usar processo filho?
11. Como lock ordering previne deadlock?
12. Por que a ordem precisa ser total?
13. O que `tryLock` acrescenta?
14. O que `lockInterruptibly` acrescenta?
15. Timeout prova deadlock?
16. Por que restart não corrige a causa?
17. O que é pool-induced deadlock?
18. Como diferenciar deadlock de banco?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Espera circular sem progresso.
2. Exclusão, hold-and-wait, sem preempção e ciclo.
3. Cada fluxo aguarda o próximo.
4. Grafo de dependências de espera.
5. Contenção pode terminar.
6. Starvation não exige ciclo.
7. Livelock possui atividade sem progresso.
8. Consultar threads e detectar ciclos.
9. Monitor específico versus cobertura geral.
10. Evitar travar a suíte principal.
11. Remove aquisição em ordem invertida.
12. Empates não podem ficar indefinidos.
13. Espera bounded e retorno de controle.
14. Cancelamento durante aquisição.
15. Não.
16. O código continua vulnerável.
17. Workers aguardam tasks presas na própria fila.
18. O SGBD detecta e aborta transação.
19. Backpressure conceitual.
20. Backpressure conceitual.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 594 - M18.39 - Deadlocks em Java

- Continuei após Race condition.
- Defini deadlock e as condições de Coffman.
- Diferenciei contenção, starvation e livelock.
- Isolei deadlocks intencionais em processo filho.
- Reproduzi ciclos com monitores e `ReentrantLock`.
- Detectei com `ThreadMXBean` e `ThreadInfo`.
- Construí wait-for graph e analisei dump e JFR.
- Implementei ordering total e tie-breaker.
- Usei `tryLock` com deadline e retry bounded.
- Usei `lockInterruptibly` para cancelamento.
- Modelei pool-induced, resource e database deadlocks.
- Criei runbook de captura, restart e causa raiz.
- Validei regressão e zero processos residuais.
- Coletei evidence sanitizada.
- Não antecipei backpressure.
- Próxima aula: Backpressure conceitual.
```

## Referência técnica curta

- Java deadlocks.
- Coffman conditions.
- `ThreadMXBean`.
- `ThreadInfo`.
- Java thread dumps.
- `ReentrantLock`.
- `tryLock`.
- `lockInterruptibly`.
- Lock ordering.
- Wait-for graphs.

Regra final:

```text
deadlocks em Java precisam ser tratados como ciclos de espera comprováveis, não como simples lentidão: todo cenário identifica recursos, owners, ordem de aquisição e as quatro condições de Coffman, enquanto deadlocks intencionais são executados somente em processo filho com timeout, detector, dump, evidence sanitizada e kill de segurança; ThreadMXBean, ThreadInfo, thread dumps, JFR e wait-for graphs registram threads, locks, owners e ciclos sem expor IDs sensíveis, lock ordering total remove circular wait, tryLock usa deadline global, retries são bounded para não criar livelock e lockInterruptibly permite cancelamento durante aquisição; pools e combinações de recursos também podem bloquear progresso, restart recupera a JVM mas não corrige a causa, Thread.stop e tentativa de forçar unlock alheio são proibidos, e o laboratório termina com zero processos residuais, regressão aprovada e runbook de captura, isolamento, restart e causa raiz; sinais de demanda, buffers e propagação de pressão ficam para a aula 595.
```
