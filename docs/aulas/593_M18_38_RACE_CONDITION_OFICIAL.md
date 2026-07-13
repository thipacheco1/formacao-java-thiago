# 593 - M18.38 - Race condition

## Apresentação da aula

Na aula 592, você estruturou mecanismos para proteger invariantes compartilhadas.

Você trabalhou com:

```text
synchronized;

monitores;

wait e notifyAll;

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

compare-and-set;

contenção;

shutdown.
```

A aula anterior apresentou mecanismos de coordenação. Agora a pergunta muda:

```text
como uma condição
de corrida aparece,

como reproduzi-la,

como provar
que ela existe

e como validar
que a correção
eliminou o risco?
```

Uma **race condition** acontece quando o resultado depende da ordem relativa entre operações concorrentes.

O problema aparece quando múltiplas operações acessam o mesmo estado, existe escrita, falta coordenação e a ordem pode violar a invariante.

Considere:

```java
counter++;
```

Em execução sequencial:

```text
counter:
0.

incremento A:
1.

incremento B:
2.
```

Em um interleaving concorrente possível:

```text
A lê 0;

B lê 0;

A calcula 1;

B calcula 1;

A escreve 1;

B escreve 1.
```

Resultado:

```text
esperado:
2.

observado:
1.
```

Esse problema é chamado de **lost update**.

Race condition também pode aparecer como stale read, check-then-act, unsafe publication, TOCTOU, duplicidade, cache incoerente, coleção corrompida, limite ultrapassado ou decisão baseada em snapshot antigo.

No check-then-act abaixo, duas threads podem verificar a ausência antes do `put` e criar o valor duas vezes:

```java
if (!map.containsKey(key)) {
    map.put(key, createValue());
}
```

Isso pode causar trabalho, evento, cobrança, reserva, chamada externa ou side effect duplicado.

Em `if (available >= units) { available -= units; }`, check e alteração precisam ser atômicos; duas threads podem aprovar a mesma capacidade.

Nesta aula, você irá construir harnesses controlados para reproduzir races de forma repetível.

A pergunta central será como transformar um bug intermitente em cenário observável, reproduzível e corrigível.

Você utilizará latches, barriers, phasers, executors, virtual threads, seeds, repetição, invariantes, métricas, timeouts e os mecanismos da aula 592.

A aula trabalhará com lost update, stale read, check-then-act, unsafe publication, TOCTOU e collection race.

Você comparará `synchronized`, `ReentrantLock`, atomics, coleções concorrentes, imutabilidade, single writer, transação e versionamento otimista.

A aula não irá aprofundar deadlocks.

Não serão construídos deliberadamente:

- ciclo de espera entre locks;
- dining philosophers;
- lock ordering quebrado;
- deadlock entre duas threads;
- deadlock em `synchronized`;
- deadlock com `ReentrantLock`;
- thread dump de deadlock;
- recuperação de deadlock;
- detecção automática de deadlock;
- análise de wait-for graph.

Esses assuntos pertencem à próxima aula oficial:

```text
594 - M18.39 - Deadlocks em Java
```

Qualquer cenário com mais de um lock seguirá ordem fixa.

A regra central será reproduzir, definir a invariante, capturar o interleaving e só então provar a correção.

---

## Onde estamos na formação

A sequência oficial é:

```text
591:
Virtual threads.

592:
Sincronizacao locks atomic.

593:
Race condition.

594:
Deadlocks em Java.
```

A progressão é:

```text
escalar tasks bloqueantes;

coordenar estado;

reproduzir races;

diagnosticar deadlocks.
```

Nesta aula:

```text
lost update:
sim.

stale read:
sim.

check-then-act:
sim.

unsafe publication:
sim.

TOCTOU:
sim.

collection race:
sim.

harness determinístico:
sim.

harness probabilístico:
sim.

CountDownLatch:
sim.

CyclicBarrier:
sim.

Phaser:
sim.

atomic correction:
sim.

lock correction:
sim.

single writer:
sim.

optimistic version:
sim.

deadlock deliberado:
não.

wait-for graph:
não.

deadlock detector:
não.
```

Você reutilizará:

- threads;
- executors;
- virtual threads;
- locks;
- atomics;
- latches;
- barriers;
- timeouts;
- JFR;
- thread dumps;
- load testing;
- stress testing;
- logs;
- métricas;
- traces;
- runbooks.

A investigação precisa preservar repetibilidade, dados sintéticos, seed, timeout, cleanup e zero leaks.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/race-condition
├── race-condition-contract.yaml
├── race-condition-catalog.yaml
├── race-invariant-policy.yaml
├── race-harness-policy.yaml
├── race-reproduction-policy.yaml
├── race-scheduling-policy.yaml
├── race-lost-update-policy.yaml
├── race-stale-read-policy.yaml
├── race-check-then-act-policy.yaml
├── race-publication-policy.yaml
├── race-toctou-policy.yaml
├── race-collection-policy.yaml
├── race-fix-validation-policy.yaml
├── race-observability-policy.yaml
├── race-shutdown-policy.yaml
├── race-data-quality-policy.yaml
├── race-security-policy.yaml
├── race-failure-policy.yaml
├── race-condition-scenarios.yaml
└── race-condition-evidence.yaml

concurrency/race-condition/src/main/java
└── br/com/formacao/concurrency/race
    ├── RaceScenarioId.java
    ├── RaceOutcome.java
    ├── RaceIterationResult.java
    ├── RaceRunSummary.java
    ├── UnsafeCounter.java
    ├── AtomicCounter.java
    ├── LockedCounter.java
    ├── UnsafeCapacity.java
    ├── SafeCapacity.java
    ├── UnsafeRegistry.java
    ├── SafeRegistry.java
    ├── PublicationHolder.java
    ├── UnsafePublication.java
    ├── SafePublication.java
    ├── FileDecision.java
    ├── ToctouSimulator.java
    ├── RaceHarness.java
    ├── DeterministicRaceHarness.java
    ├── ProbabilisticRaceHarness.java
    ├── RaceInvariantVerifier.java
    └── RaceConditionDemo.java

concurrency/race-condition/src/test/java
└── br/com/formacao/concurrency/race
    ├── LostUpdateRaceTest.java
    ├── StaleReadRaceTest.java
    ├── CheckThenActRaceTest.java
    ├── UnsafePublicationTest.java
    ├── ToctouRaceTest.java
    ├── CollectionRaceTest.java
    ├── AtomicCounterFixTest.java
    ├── LockedCounterFixTest.java
    ├── SingleWriterFixTest.java
    ├── OptimisticVersionFixTest.java
    ├── RaceHarnessRepeatabilityTest.java
    ├── RaceShutdownTest.java
    └── RaceContractTest.java

concurrency/race-condition/reports
├── race-baseline-report.yaml
├── race-lost-update-report.yaml
├── race-stale-read-report.yaml
├── race-check-then-act-report.yaml
├── race-publication-report.yaml
├── race-toctou-report.yaml
├── race-collection-report.yaml
├── race-fix-comparison-report.yaml
└── race-gate-report.yaml

scripts/concurrency/race-condition
├── validate-race-condition-contract.ps1
├── validate-race-invariants.ps1
├── run-race-baseline.ps1
├── reproduce-lost-update.ps1
├── reproduce-stale-read.ps1
├── reproduce-check-then-act.ps1
├── reproduce-unsafe-publication.ps1
├── reproduce-toctou.ps1
├── reproduce-collection-race.ps1
├── validate-race-atomic-fix.ps1
├── validate-race-lock-fix.ps1
├── validate-race-single-writer-fix.ps1
├── validate-race-optimistic-version-fix.ps1
├── compare-race-fixes.ps1
├── analyze-race-repeatability.ps1
├── validate-race-shutdown.ps1
├── collect-race-thread-dump.ps1
├── collect-race-jfr.ps1
├── scan-race-output.ps1
├── collect-race-evidence.ps1
└── verify-race-baseline.ps1

docs/concurrency/race-condition
├── RACE_CONDITION_OVERVIEW.md
├── LOST_UPDATE_GUIDE.md
├── STALE_READ_GUIDE.md
├── CHECK_THEN_ACT_GUIDE.md
├── UNSAFE_PUBLICATION_GUIDE.md
├── TOCTOU_GUIDE.md
├── COLLECTION_RACES.md
├── RACE_REPRODUCTION_HARNESS.md
├── RACE_FIX_COMPARISON.md
├── RACE_CONDITION_TEST_MATRIX.md
└── RACE_CONDITION_TROUBLESHOOTING.md
```

Ao final, você terá contrato, catálogo, invariantes, harnesses determinístico e probabilístico, reprodução das seis classes, comparação de correções, métricas, shutdown, gate e evidence sanitizada.

---

## Conceito essencial

### Race condition

Comportamento cujo resultado depende da ordem relativa entre operações concorrentes.

---

### Data race

Acesso concorrente ao mesmo local de memória, com pelo menos uma escrita, sem sincronização adequada.

Nem toda race condition é descrita apenas como data race.

---

### Lost update

Atualização sobrescrita por outra atualização baseada no mesmo valor antigo.

---

### Stale read

Leitura de um valor antigo quando outra thread já realizou uma atualização relevante.

---

### Check-then-act

Padrão em que uma condição é verificada e uma ação é executada depois, sem atomicidade entre as duas etapas.

---

### Read-modify-write

Operação composta por ler, calcular e escrever.

---

### Unsafe publication

Objeto compartilhado antes que sua construção e estado estejam corretamente visíveis.

---

### TOCTOU

Time-of-check to time-of-use.

O estado pode mudar entre a verificação e o uso.

---

### Linearization point

Instante lógico em que uma operação concorrente passa a ser considerada efetiva.

---

### Interleaving

Ordem concreta entre passos de operações concorrentes.

---

### Race harness

Infraestrutura que coordena, repete e observa uma condição de corrida.

---

### Deterministic harness

Harness que força uma ordem específica por latches ou barriers.

---

### Probabilistic harness

Harness que repete muitas execuções para aumentar a chance de observar o bug.

---

### Invariant violation

Estado que quebra uma condição obrigatória do sistema.

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

- aula 592 validada;
- locks, atomics e semáforos disponíveis;
- zero lock leaks;
- zero permit leaks;
- zero waiter leaks;
- nenhum cenário de deadlock será criado;
- todos os harnesses terão timeout;
- todos os dados serão sintéticos.

---

### 2. Criar contrato

Arquivo:

```text
race-condition-contract.yaml
```

Conteúdo:

```yaml
raceCondition:
  required:
    - scenario
    - shared-state
    - owner
    - invariant
    - unsafe-operation
    - forced-interleaving
    - timeout
    - expected-violation
    - fix
    - fix-validation
    - cleanup
    - observability

  harness:
    bounded:
      required

  evidence:
    seed:
      requiredWhenProbabilistic

  forbiddenInLesson593:
    - intentional-deadlock
    - unbounded-stress
    - real-business-side-effect

  nextLesson:
    code:
      M18.39
```

---

### 3. Criar catálogo

Arquivo:

```text
race-condition-catalog.yaml
```

Exemplo:

```yaml
scenarios:
  - id:
      LOST-UPDATE-COUNTER

    sharedState:
      counter

    invariant:
      final-value-equals-successful-increments

    unsafePattern:
      read-modify-write

    forcedInterleaving:
      two-read-before-two-write

    fixCandidates:
      - AtomicInteger
      - synchronized
      - ReentrantLock

  - id:
      CHECK-THEN-ACT-REGISTRY

    sharedState:
      registry

    invariant:
      one-value-created-per-key

    unsafePattern:
      containsKey-then-put

    fixCandidates:
      - computeIfAbsent
      - single-writer
```

---

### 4. Criar policy de invariantes

Arquivo:

```text
race-invariant-policy.yaml
```

Conteúdo:

```yaml
invariant:
  required:
    true

  observable:
    true

  examples:
    - final-counter-equals-successful-increments
    - capacity-never-negative
    - one-value-per-key
    - published-object-is-fully-initialized
    - checked-resource-remains-valid-until-use

  violation:
    capture:
      required

  fix:
    preserveUnderRepetition:
      required
```

---

### 5. Criar modelo de resultado

```java
public enum RaceOutcome {
    INVARIANT_PRESERVED,
    INVARIANT_VIOLATED,
    TIMEOUT,
    HARNESS_FAILURE,
    INCONCLUSIVE
}
```

Resultado por iteração:

```java
public record RaceIterationResult(
        int iteration,
        RaceOutcome outcome,
        String scenario,
        String observedCategory,
        Duration elapsed) {
}
```

Resumo:

```java
public record RaceRunSummary(
        String scenario,
        int iterations,
        long preserved,
        long violated,
        long timedOut,
        long harnessFailures,
        long seed) {
}
```

---

### 6. Criar policy de harness

Arquivo:

```text
race-harness-policy.yaml
```

Conteúdo:

```yaml
harness:
  startBarrier:
    required

  completion:
    timeout:
      required

  threads:
    named:
      required

  cleanup:
    interruptAndJoin:
      required

  result:
    captureEveryIteration:
      required

  deadlock:
    intentional:
      forbidden
```

---

### 7. Criar contador inseguro

```java
public final class UnsafeCounter {

    private int value;

    public int read() {
        return value;
    }

    public void write(int next) {
        value = next;
    }

    public int value() {
        return value;
    }
}
```

A API separa leitura e escrita para expor o interleaving.

---

### 8. Criar harness determinístico de lost update

```java
public final class DeterministicRaceHarness {

    public RaceIterationResult runLostUpdate(
            int iteration)
            throws InterruptedException {

        UnsafeCounter counter =
                new UnsafeCounter();

        CountDownLatch bothRead =
                new CountDownLatch(2);

        CountDownLatch allowWrite =
                new CountDownLatch(1);

        CountDownLatch completed =
                new CountDownLatch(2);

        Runnable task =
                () -> {
                    int current =
                            counter.read();

                    bothRead.countDown();

                    try {
                        bothRead.await();
                        allowWrite.await();

                        counter.write(
                                current + 1);
                    } catch (
                            InterruptedException exception) {
                        Thread.currentThread()
                                .interrupt();
                    } finally {
                        completed.countDown();
                    }
                };

        Thread first =
                Thread.ofVirtual()
                        .name("race-lost-update-a")
                        .start(task);

        Thread second =
                Thread.ofVirtual()
                        .name("race-lost-update-b")
                        .start(task);

        boolean readsCompleted =
                bothRead.await(
                        1,
                        TimeUnit.SECONDS);

        allowWrite.countDown();

        boolean finished =
                completed.await(
                        1,
                        TimeUnit.SECONDS);

        first.join(1000);
        second.join(1000);

        if (!readsCompleted || !finished) {
            first.interrupt();
            second.interrupt();

            return timeoutResult(iteration);
        }

        RaceOutcome outcome =
                counter.value() == 2
                        ? RaceOutcome
                                .INVARIANT_PRESERVED
                        : RaceOutcome
                                .INVARIANT_VIOLATED;

        return result(
                iteration,
                outcome,
                "value-" + counter.value());
    }
}
```

O harness força as duas leituras antes das escritas.

---

### 9. Validar lost update

Teste:

```java
@Test
void shouldReproduceLostUpdateDeterministically()
        throws InterruptedException {

    RaceIterationResult result =
            harness.runLostUpdate(1);

    assertEquals(
            RaceOutcome.INVARIANT_VIOLATED,
            result.outcome());
}
```

Resultado esperado:

```text
valor final:
1.
```

---

### 10. Corrigir com `AtomicInteger`

```java
public final class AtomicCounter {

    private final AtomicInteger value =
            new AtomicInteger();

    public int increment() {
        return value.incrementAndGet();
    }

    public int value() {
        return value.get();
    }
}
```

Agora a operação possui um linearization point dentro da atualização atômica.

---

### 11. Corrigir com lock

```java
public final class LockedCounter {

    private final ReentrantLock lock =
            new ReentrantLock();

    private int value;

    public int increment() {
        lock.lock();

        try {
            value++;
            return value;
        } finally {
            lock.unlock();
        }
    }

    public int value() {
        lock.lock();

        try {
            return value;
        } finally {
            lock.unlock();
        }
    }
}
```

---

### 12. Criar policy de lost update

Arquivo:

```text
race-lost-update-policy.yaml
```

Conteúdo:

```yaml
lostUpdate:
  identify:
    - read
    - calculate
    - write

  invariant:
    successfulUpdatesMustAccumulate

  fixCandidates:
    - atomic-update
    - lock-whole-operation
    - database-atomic-update
    - optimistic-version

  partialLock:
    forbidden

  validation:
    forcedInterleaving:
      required
```

---

### 13. Reproduzir stale read

Cenário conceitual:

```java
public final class VisibilityFlag {

    private boolean ready;
    private int value;

    public void publish() {
        value = 42;
        ready = true;
    }

    public int awaitValue() {
        while (!ready) {
            Thread.onSpinWait();
        }

        return value;
    }
}
```

Sem happens-before, a leitura pode não observar a publicação. Como esse bug pode ser difícil de reproduzir, o relatório distingue reproduzido, suspeito, não observado e corrigido por contrato.

---

### 14. Corrigir visibilidade

Opção simples para flag:

```java
private volatile boolean ready;
```

A escrita `volatile` e a leitura correspondente criam relação de visibilidade.

Outras opções são monitor, lock, future, latch e objeto imutável publicado com segurança.

---

### 15. Criar policy de stale read

Arquivo:

```text
race-stale-read-policy.yaml
```

Conteúdo:

```yaml
staleRead:
  identify:
    - writer
    - reader
    - publication
    - visibility-edge

  busyWait:
    bounded:
      required

  fixCandidates:
    - volatile
    - synchronized
    - lock
    - latch
    - immutable-publication

  absenceOfObservedFailure:
    notProofOfSafety:
      true
```

---

### 16. Reproduzir check-then-act

Registry inseguro:

```java
public final class UnsafeRegistry {

    private final Map<String, String> values =
            new HashMap<>();

    private final LongAdder creations =
            new LongAdder();

    public String getOrCreate(
            String key,
            Supplier<String> factory) {

        if (!values.containsKey(key)) {
            creations.increment();
            values.put(
                    key,
                    factory.get());
        }

        return values.get(key);
    }

    public long creationCount() {
        return creations.sum();
    }
}
```

O factory pode executar duas vezes.

---

### 17. Forçar check-then-act

Use uma barrier antes do `put`.

Ambas as threads:

1. verificam ausência;
2. aguardam;
3. criam;
4. gravam.

A invariante será:

```text
creationCount == 1.
```

O mapa pode terminar com um valor, embora o side effect tenha ocorrido duas vezes.

---

### 18. Corrigir registry

```java
public final class SafeRegistry {

    private final ConcurrentHashMap<
            String,
            String> values =
            new ConcurrentHashMap<>();

    public String getOrCreate(
            String key,
            Supplier<String> factory) {

        return values.computeIfAbsent(
                key,
                ignored ->
                        factory.get());
    }
}
```

A operação deve corresponder ao contrato, e o factory deve evitar side effect irreversível.

---

### 19. Criar policy de check-then-act

Arquivo:

```text
race-check-then-act-policy.yaml
```

Conteúdo:

```yaml
checkThenAct:
  pattern:
    - check
    - gap
    - action

  risk:
    stateMayChangeInGap

  fixCandidates:
    - atomic-collection-operation
    - lock-check-and-act
    - single-writer
    - database-constraint

  sideEffectFactory:
    review:
      required
```

---

### 20. Reproduzir unsafe publication

Objeto:

```java
public final class PublicationHolder {

    private final int expected;
    private final List<Integer> values;

    public PublicationHolder(
            int expected) {

        this.expected = expected;

        this.values =
                IntStream.range(
                                0,
                                expected)
                        .boxed()
                        .toList();
    }

    public boolean valid() {
        return values.size()
                == expected;
    }
}
```

Publicação insegura:

```java
public final class UnsafePublication {

    private PublicationHolder holder;

    public void publish(
            PublicationHolder next) {
        holder = next;
    }

    public PublicationHolder read() {
        return holder;
    }
}
```

Sem sincronização, não existe garantia formal de publicação segura.

---

### 21. Corrigir publication

Opções:

```java
private volatile PublicationHolder holder;
```

ou:

```java
private final AtomicReference<
        PublicationHolder> holder =
        new AtomicReference<>();
```

Também podem ser usados lock, monitor, final field, container imutável ou fila thread-safe.

---

### 22. Criar policy de publication

Arquivo:

```text
race-publication-policy.yaml
```

Conteúdo:

```yaml
publication:
  object:
    immutable:
      preferred

  publishThrough:
    allowed:
      - volatile-reference
      - atomic-reference
      - monitor
      - lock
      - concurrent-queue
      - safely-initialized-final-field

  plainMutableReference:
    forbiddenForCrossThreadPublication

  constructorEscape:
    forbidden
```

---

### 23. Entender constructor escape

Problema:

```java
public UnsafeListener() {
    registry.register(
            () -> this.handle());
}
```

O `this` pode escapar antes do fim da construção.

Outra thread pode observar estado parcialmente inicializado.

Evite publicar `this` durante o construtor.

Use factory ou etapa de start após construção completa.

---

### 24. Reproduzir TOCTOU

TOCTOU significa:

```text
time of check;

time of use.
```

Exemplo conceitual de arquivo:

```text
1.
verificar que o caminho
é permitido;

2.
outra operação troca
o alvo;

3.
abrir o caminho.
```

No laboratório, não serão alterados arquivos sensíveis reais.

Use um modelo sintético:

```java
public record FileDecision(
        String logicalPath,
        long version,
        boolean allowed) {
}
```

O simulador altera a versão entre check e use.

---

### 25. Criar `ToctouSimulator`

```java
public final class ToctouSimulator {

    private final AtomicReference<
            FileDecision> decision;

    public ToctouSimulator(
            FileDecision initial) {
        this.decision =
                new AtomicReference<>(
                        initial);
    }

    public boolean unsafeUse() {
        FileDecision checked =
                decision.get();

        if (!checked.allowed()) {
            return false;
        }

        FileDecision used =
                decision.get();

        return used.allowed();
    }
}
```

A verificação e o uso não estão vinculados à mesma versão.

---

### 26. Corrigir TOCTOU

As correções incluem validar o handle real, comparar versão, usar operação atômica, lock, constraint transacional ou delegar à fonte da verdade.

No modelo sintético:

```java
public boolean safeUse() {
    FileDecision checked =
            decision.get();

    return decision.compareAndSet(
            checked,
            checked)
            && checked.allowed();
}
```

O exemplo ilustra vínculo de versão; recursos reais exigem a API correta do sistema operacional.

---

### 27. Criar policy de TOCTOU

Arquivo:

```text
race-toctou-policy.yaml
```

Conteúdo:

```yaml
TOCTOU:
  identify:
    - check
    - mutable-resource
    - use

  securitySensitive:
    default:
      high

  fixCandidates:
    - operate-on-open-handle
    - version-check
    - transaction
    - lock
    - atomic-operation

  syntheticOnlyInLab:
    required
```

---

### 28. Reproduzir race em coleção

Uso inseguro:

```java
List<Integer> values =
        new ArrayList<>();
```

Múltiplas threads executando `add` não possuem garantia de segurança.

O resultado pode apresentar:

- tamanho incorreto;
- perda de elementos;
- exceção;
- estado interno inconsistente;
- comportamento variável por execução.

---

### 29. Corrigir coleção

Opções incluem `synchronizedList`, `CopyOnWriteArrayList`, `ConcurrentLinkedQueue` e `ConcurrentHashMap`. A escolha depende de leitura, escrita, iteração, ordenação, memória e consistência.

---

### 30. Criar policy de coleções

Arquivo:

```text
race-collection-policy.yaml
```

Conteúdo:

```yaml
collections:
  plainMutable:
    crossThreadMutation:
      forbidden

  chooseBy:
    - read-write-ratio
    - iteration-contract
    - ordering
    - memory
    - snapshot-needs

  compoundOperation:
    atomicMethodOrExternalCoordination:
      required

  synchronizedCollectionIteration:
    externalSynchronization:
      required
```

---

### 31. Criar harness probabilístico

```java
public final class ProbabilisticRaceHarness {

    public RaceRunSummary repeat(
            String scenario,
            int iterations,
            long seed,
            IntFunction<
                    RaceIterationResult> runner) {

        long preserved = 0;
        long violated = 0;
        long timedOut = 0;
        long harnessFailures = 0;

        for (int index = 0;
                index < iterations;
                index++) {

            RaceIterationResult result =
                    runner.apply(index);

            switch (result.outcome()) {
                case INVARIANT_PRESERVED ->
                        preserved++;

                case INVARIANT_VIOLATED ->
                        violated++;

                case TIMEOUT ->
                        timedOut++;

                default ->
                        harnessFailures++;
            }
        }

        return new RaceRunSummary(
                scenario,
                iterations,
                preserved,
                violated,
                timedOut,
                harnessFailures,
                seed);
    }
}
```

Registre a seed em toda execução probabilística.

---

### 32. Criar policy de reprodução

Arquivo:

```text
race-reproduction-policy.yaml
```

Conteúdo:

```yaml
reproduction:
  deterministicFirst:
    preferred

  probabilistic:
    useFor:
      - scheduler-sensitive-race
      - regression-confidence
      - environment-comparison

  iterations:
    bounded:
      required

  seed:
    required

  timeout:
    perIteration:
      required

  noFailureObserved:
    result:
      not-reproduced
```

---

### 33. Criar policy de scheduling

Arquivo:

```text
race-scheduling-policy.yaml
```

Conteúdo:

```yaml
scheduling:
  tools:
    allowed:
      - CountDownLatch
      - CyclicBarrier
      - Phaser
      - controlled-yield
      - virtual-thread

  ThreadSleepAsOnlyCoordination:
    forbidden

  barriers:
    timeout:
      required

  interruption:
    cleanup:
      required
```

`sleep` pode aumentar uma janela, mas não é prova de interleaving.

---

### 34. Usar `CyclicBarrier`

Exemplo:

```java
CyclicBarrier barrier =
        new CyclicBarrier(2);

Runnable task =
        () -> {
            int current =
                    counter.read();

            await(barrier);

            counter.write(
                    current + 1);
        };
```

A barrier faz as duas threads chegarem ao mesmo ponto antes de continuar.

---

### 35. Usar `Phaser`

`Phaser` é útil para múltiplas fases:

```text
fase 1:
ambas leem;

fase 2:
ambas calculam;

fase 3:
ambas escrevem.
```

Ele permite registrar participantes e avançar fases.

Todo uso precisa de timeout e deregistration.

---

### 36. Criar verifier

```java
public final class RaceInvariantVerifier {

    public RaceOutcome verifyCounter(
            int expected,
            int observed) {

        return expected == observed
                ? RaceOutcome
                        .INVARIANT_PRESERVED
                : RaceOutcome
                        .INVARIANT_VIOLATED;
    }

    public RaceOutcome verifyCapacity(
            int total,
            int available,
            int reserved) {

        boolean valid =
                available >= 0
                && reserved >= 0
                && available + reserved
                        == total;

        return valid
                ? RaceOutcome
                        .INVARIANT_PRESERVED
                : RaceOutcome
                        .INVARIANT_VIOLATED;
    }
}
```

---

### 37. Validar correção atômica

Script:

```text
validate-race-atomic-fix.ps1
```

Execute o mesmo harness contra:

- `UnsafeCounter`;
- `AtomicCounter`.

Mude apenas o mecanismo de coordenação.

Esperado:

```text
unsafe:
violation reproduced.

atomic:
zero violations
nas execuções aprovadas.
```

Zero violações bounded não é prova universal, mas o contrato atômico fornece evidência forte.

---

### 38. Validar correção por lock

Script:

```text
validate-race-lock-fix.ps1
```

Confirme:

- lock cobre read-modify-write;
- leitura observada usa o mesmo contrato;
- unlock ocorre em `finally`;
- harness termina;
- zero violations;
- hold time bounded;
- zero lock leaks.

---

### 39. Validar single writer

Em vez de múltiplas threads alterarem diretamente o estado:

```text
producers:
enviam comandos;

single writer:
aplica mudanças
sequencialmente.
```

Esse modelo reduz coordenação do estado.

Valide:

- fila bounded;
- owner único;
- ordering;
- shutdown;
- backlog;
- failure handling.

---

### 40. Validar optimistic version

Modelo:

```text
read version 10;

calculate update;

UPDATE ...
WHERE version = 10;

rows affected:
1 ou 0.
```

Se zero linhas forem alteradas:

```text
conflito detectado.
```

A aplicação pode recarregar, informar conflito, abortar ou executar retry bounded, nunca infinito.

---

### 41. Criar policy de fix validation

Arquivo:

```text
race-fix-validation-policy.yaml
```

Conteúdo:

```yaml
fix:
  sameScenario:
    required

  sameInvariant:
    required

  sameHarness:
    required

  compare:
    - violations
    - throughput
    - p95
    - wait-time
    - retries
    - failures
    - shutdown

  correctnessBeforePerformance:
    true

  zeroObservedViolationsWithoutContract:
    insufficient
```

---

### 42. Comparar correções

Script:

```text
compare-race-fixes.ps1
```

Compare:

```text
unsafe;

synchronized;

ReentrantLock;

AtomicInteger;

AtomicReference;

single writer;

optimistic version;

concurrent collection.
```

Compare correção, clareza, contenção, retries, throughput, latência, side effects e shutdown.

---

### 43. Criar policy de observabilidade

Arquivo:

```text
race-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - scenario
    - iterations
    - violations
    - violation-rate
    - timeout-count
    - harness-failure-count
    - seed
    - fix
    - retry-count
    - wait-time
    - duration

  evidence:
    interleavingCategory:
      required

  labels:
    forbidden:
      - thread-id
      - request-id
      - order-id
      - customer-id
      - raw-key
```

---

### 44. Registrar interleaving sem dados sensíveis

Exemplo:

```yaml
interleaving:
  - actor-A-read
  - actor-B-read
  - actor-A-write
  - actor-B-write
```

Não registre payload real.

Use categorias e valores sintéticos.

---

### 45. Coletar thread dump e JFR

Scripts:

```text
collect-race-thread-dump.ps1
```

```text
collect-race-jfr.ps1
```

Use dumps e JFR quando houver travamento, timeout, contenção, CPU alta ou threads pendentes.

Deadlocks ficam para a aula 594.

---

### 46. Criar policy de shutdown

Arquivo:

```text
race-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  harness:
    stopSubmission:
      required

  tasks:
    await:
      bounded:
        required

  timeout:
    interrupt:
      required

  barriers:
    releaseOrBreak:
      required

  executor:
    terminate:
      required

  zeroThreadLeak:
    required

  zeroTaskLeak:
    required
```

---

### 47. Validar shutdown de harness

Cenário:

- uma thread falha antes da barrier;
- outra permanece aguardando;
- timeout ocorre;
- barrier é quebrada;
- task é interrompida;
- executor encerra;
- resultado é `HARNESS_FAILURE`;
- nenhuma thread permanece viva.

Falha do harness não é race reproduzida.

---

### 48. Criar failure policy

Arquivo:

```text
race-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invariantViolation:
    action:
      capture-and-fail-unsafe-scenario

  harnessTimeout:
    action:
      classify-separately

  barrierFailure:
    action:
      harness-failure

  zeroViolationUnsafeScenario:
    action:
      rerun-or-inconclusive

  zeroViolationFixedScenario:
    require:
      - mechanism-contract
      - repeated-run
      - invariant-check

  deadlockSuspected:
    deferDeepAnalysisToLesson594
```

---

### 49. Criar data quality policy

Arquivo:

```text
race-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingInvariant:
    action:
      block

  missingSeed:
    action:
      block-probabilistic-run

  changedHarnessBetweenUnsafeAndFix:
    result:
      invalid-comparison

  timingOnlyCoordination:
    result:
      fragile

  singleIteration:
    result:
      limited

  mixedEnvironment:
    result:
      invalid-comparison

  staleEvidence:
    action:
      recollect
```

---

### 50. Criar security policy

Arquivo:

```text
race-security-policy.yaml
```

Conteúdo:

```yaml
security:
  data:
    synthetic:
      required

  event:
    businessPayload:
      forbidden

  logs:
    rawIdentifier:
      forbidden

  threadDump:
    repository:
      forbidden

  JFR:
    rawFile:
      repository:
        forbidden

  TOCTOU:
    realSensitivePath:
      forbidden
```

---

### 51. Criar cenários oficiais

Arquivo:

```text
race-condition-scenarios.yaml
```

Cenários:

```text
lost-update-deterministic;

lost-update-probabilistic;

lost-update-atomic-fix;

lost-update-lock-fix;

stale-read-suspected;

stale-read-volatile-fix;

check-then-act-duplicate-create;

compute-if-absent-fix;

unsafe-publication;

volatile-publication-fix;

atomic-reference-publication-fix;

TOCTOU-synthetic;

TOCTOU-version-fix;

ArrayList-concurrent-add;

concurrent-collection-fix;

single-writer-fix;

optimistic-version-conflict;

harness-barrier-failure;

harness-timeout;

zero-thread-leak;

zero-task-leak.
```

Cada cenário registra estado, invariante, atores, interleaving, seed, iterações, resultado, correção, shutdown e evidence.

---

### 52. Criar relatório baseline

Arquivo:

```text
race-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  scenarios:
    unsafe:
      6

    fixed:
      6

  deterministic:
    lostUpdate:
      reproduced

  probabilistic:
    iterations:
      bounded

    seed:
      recorded

  harness:
    timeout:
      configured

    leaks:
      zero

  result:
    BASELINE_CREATED
```

---

### 53. Criar relatório de fix comparison

Arquivo:

```text
race-fix-comparison-report.yaml
```

Inclua:

- scenario;
- unsafe violation rate;
- fixed violation rate;
- mechanism;
- throughput;
- p95;
- wait;
- retries;
- timeouts;
- harness failures;
- shutdown;
- decision.

---

### 54. Criar matriz de testes

Arquivo:

```text
RACE_CONDITION_TEST_MATRIX.md
```

Cenários:

- lost update;
- stale read;
- read-modify-write;
- check-then-act;
- unsafe publication;
- constructor escape;
- TOCTOU;
- ArrayList mutation;
- concurrent collection;
- atomic fix;
- lock fix;
- single writer;
- optimistic version;
- CountDownLatch;
- CyclicBarrier;
- Phaser;
- seed;
- repetition;
- timeout;
- barrier failure;
- shutdown;
- thread dump;
- JFR;
- security;
- evidence.

---

### 55. Criar troubleshooting

Arquivo:

```text
RACE_CONDITION_TROUBLESHOOTING.md
```

Inclua:

- race não reproduz;
- harness não força a ordem;
- `sleep` funciona apenas localmente;
- barrier quebra;
- latch nunca chega a zero;
- teste trava;
- unsafe passa ocasionalmente;
- fix falha em alta repetição;
- `computeIfAbsent` executa factory inesperadamente;
- volatile não protege operação composta;
- CAS loop repete;
- coleção concorrente não protege operação composta;
- optimistic version entra em retry loop;
- thread dump sugere deadlock;
- material da aula 594 antecipado.

---

### 56. Criar gate

O gate valida:

- contrato;
- catálogo;
- invariantes;
- harness;
- seed;
- reprodução;
- lost update;
- stale read;
- check-then-act;
- publication;
- TOCTOU;
- collections;
- fix comparison;
- shutdown;
- zero thread leaks;
- zero task leaks;
- segurança.

Status:

```text
PASS;

FAIL_NOT_REPRODUCED;

FAIL_HARNESS;

FAIL_INVARIANT;

FAIL_FIX;

FAIL_TIMEOUT;

FAIL_THREAD_LEAK;

FAIL_TASK_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 57. Coletar evidence

Script:

```text
collect-race-evidence.ps1
```

Arquivo:

```text
race-condition-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- scenario category;
- shared state category;
- invariant status;
- harness status;
- seed category;
- iterations category;
- violation status;
- fix category;
- retry category;
- timeout status;
- shutdown status;
- thread leak status;
- task leak status;
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
- path sensível;
- dump bruto;
- JFR bruto;
- cenário deliberado de deadlock;
- material da aula 594.

---

### 58. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\race-condition\validate-race-condition-contract.ps1

.\scripts\concurrency\race-condition\validate-race-invariants.ps1

.\scripts\concurrency\race-condition\run-race-baseline.ps1

.\scripts\concurrency\race-condition\reproduce-lost-update.ps1

.\scripts\concurrency\race-condition\reproduce-stale-read.ps1

.\scripts\concurrency\race-condition\reproduce-check-then-act.ps1

.\scripts\concurrency\race-condition\reproduce-unsafe-publication.ps1

.\scripts\concurrency\race-condition\reproduce-toctou.ps1

.\scripts\concurrency\race-condition\reproduce-collection-race.ps1

.\scripts\concurrency\race-condition\validate-race-atomic-fix.ps1

.\scripts\concurrency\race-condition\validate-race-lock-fix.ps1

.\scripts\concurrency\race-condition\validate-race-single-writer-fix.ps1

.\scripts\concurrency\race-condition\validate-race-optimistic-version-fix.ps1

.\scripts\concurrency\race-condition\compare-race-fixes.ps1

.\scripts\concurrency\race-condition\analyze-race-repeatability.ps1

.\scripts\concurrency\race-condition\validate-race-shutdown.ps1

.\scripts\concurrency\race-condition\collect-race-thread-dump.ps1

.\scripts\concurrency\race-condition\collect-race-jfr.ps1

.\scripts\concurrency\race-condition\scan-race-output.ps1

.\scripts\concurrency\race-condition\collect-race-evidence.ps1

.\scripts\concurrency\race-condition\verify-race-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- invariantes aprovadas;
- harness determinístico aprovado;
- harness probabilístico aprovado;
- seed registrada;
- lost update reproduzido;
- stale read classificado corretamente;
- check-then-act reproduzido;
- publication avaliada;
- TOCTOU sintético reproduzido;
- collection race reproduzida;
- correção atômica aprovada;
- correção por lock aprovada;
- single writer aprovado;
- optimistic version aprovado;
- shutdown aprovado;
- zero thread leaks;
- zero task leaks;
- segurança aprovada;
- evidence sanitizada;
- deadlocks não antecipados.

---

### 59. Encerrar o laboratório

Confirme barriers e latches liberados, executors e threads encerrados, nenhum lock ou dado residual, dumps brutos fora do Git e baseline mantida.

Remova:

```powershell
Remove-Item `
  .tmp/race-condition `
  -Recurse `
  -Force
```

Preserve relatórios.

---

## Entendendo o que foi feito

### Race ganhou invariante

O bug deixou de ser descrito apenas como “resultado estranho”.

### Lost update ganhou interleaving

Duas leituras anteriores às escritas produziram a violação de forma determinística.

### Stale read ganhou contrato

Ausência de falha observada deixou de ser confundida com garantia de visibilidade.

### Check-then-act ganhou atomicidade

A verificação e a ação passaram a ser tratadas como uma única decisão lógica.

### Publication ganhou happens-before

Objetos imutáveis e referências seguras passaram a substituir publicação simples.

### TOCTOU ganhou versão

A verificação passou a ser vinculada ao recurso usado.

### Coleções ganharam operação correta

Estrutura thread-safe deixou de ser confundida com atomicidade de operações compostas.

### Harness ganhou qualidade

Barriers, seeds, timeouts e cleanup separaram bug da aplicação de falha do teste.

### Fix ganhou comparação

Correção passou a ser validada com o mesmo cenário e a mesma invariante.

### A próxima aula ganhou fronteira

A aula 594 irá aprofundar deadlocks em Java.

---

## Erros comuns importantes

### Usar `sleep` como única coordenação

O teste fica dependente de timing e ambiente.

### Concluir que não existe race porque não apareceu

Races podem depender de interleavings raros.

### Alterar o harness junto com a correção

A comparação deixa de ser válida.

### Usar `volatile` em operação composta

Visibilidade não cria atomicidade para read-modify-write.

### Usar coleção concorrente e manter check-then-act separado

A race continua na operação composta.

### Executar side effect dentro de retry CAS

O efeito pode ocorrer mais de uma vez.

### Fazer retry otimista infinito

Contenção pode virar livelock operacional.

### Confundir timeout do harness com race

Timeout pode indicar falha da infraestrutura de teste.

### Registrar payload para “provar” a race

Use dados sintéticos e categorias.

### Criar ciclo de locks no cenário

Deadlocks pertencem à aula 594.

---

## Comandos úteis

### Reproduzir lost update

```powershell
.\scripts\concurrency\race-condition\reproduce-lost-update.ps1
```

### Reproduzir check-then-act

```powershell
.\scripts\concurrency\race-condition\reproduce-check-then-act.ps1
```

### Validar correção atômica

```powershell
.\scripts\concurrency\race-condition\validate-race-atomic-fix.ps1
```

### Comparar correções

```powershell
.\scripts\concurrency\race-condition\compare-race-fixes.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\race-condition\validate-race-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Invariant

Defina a condição obrigatória.

### Parte 2 — Lost update

Force duas leituras antes das escritas.

### Parte 3 — Stale read

Mapeie publication e visibility edge.

### Parte 4 — Check-then-act

Force duas decisões sobre o mesmo estado.

### Parte 5 — Publication

Compare referência simples, volatile e atomic.

### Parte 6 — TOCTOU

Altere versão entre check e use.

### Parte 7 — Collection

Compare lista simples e estrutura concorrente.

### Parte 8 — Fixes

Aplique atomic, lock, single writer e version.

### Parte 9 — Repetition

Execute harness bounded com seed.

### Parte 10 — Gate

Valide shutdown, leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 592 e ponte para a aula 594 foram preservadas;
- conceitos de race, data race, lost update, stale read, check-then-act, publication, TOCTOU, interleaving e harness foram definidos;
- contrato, catálogo, invariantes e policies foram criados;
- harnesses possuem naming, timeout, seed, cleanup e resultados explícitos;
- lost update foi reproduzido deterministicamente;
- correções com atomic e lock preservaram a invariante;
- stale read foi relacionado a visibility edge e happens-before;
- ausência de falha observada não foi tratada como prova de segurança;
- check-then-act foi reproduzido e corrigido por operação atômica;
- publication insegura, volatile, `AtomicReference` e constructor escape foram avaliados;
- TOCTOU foi reproduzido apenas com modelo sintético;
- collection race e operações compostas foram validadas;
- `CountDownLatch`, `CyclicBarrier` e `Phaser` foram usados com timeout;
- `sleep` não foi usado como única coordenação;
- single writer e optimistic version foram validados;
- fixes usaram o mesmo harness e a mesma invariante;
- métricas registram seed, iterations, violations, timeouts, retries e harness failures;
- shutdown libera barriers, interrompe tasks e encerra executors;
- policies de qualidade, segurança e failure estão presentes;
- matriz, troubleshooting, gate e evidence sanitizada foram criados;
- zero thread leaks e zero task leaks foram validados;
- nenhum segredo, payload, path sensível ou identificador real foi commitado;
- deadlocks não foram aprofundados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/race-condition `
  scripts/concurrency/race-condition `
  docs/concurrency/race-condition `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|rawThreadDump|rawJfr|businessPayload|sensitivePath|intentionalDeadlock|waitForGraph"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): reproduzir e corrigir race conditions"
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
- paths sensíveis;
- dumps brutos;
- JFR bruto;
- artifacts temporários;
- deadlock deliberado;
- material da aula 594.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou races intermitentes em cenários reproduzíveis e verificáveis.

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

atomic fixes;

lock fixes;

single writer;

optimistic version;

seed;

repetição;

shutdown.
```

Você comprovou que lost update nasce de read-modify-write não atômico, stale read depende de visibilidade e toda correção precisa do mesmo harness.

A próxima aula será:

```text
594 - M18.39 - Deadlocks em Java
```

Nela, você irá aprofundar condições de Coffman, ciclos de espera, lock ordering, detecção, prevenção, recuperação e runbooks.

Nenhum ciclo deliberado de locks, dining philosophers, deadlock real entre threads, detector de deadlock, wait-for graph ou recuperação de deadlock foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini invariantes.
- [ ] Reproduzi lost update.
- [ ] Classifiquei stale read.
- [ ] Reproduzi check-then-act.
- [ ] Avaliei publication.
- [ ] Reproduzi TOCTOU sintético.
- [ ] Comparei correções.
- [ ] Encerrei harnesses sem leaks.

---

## Troubleshooting adicional

### Lost update não aparece

Garanta que ambas as threads leiam antes de qualquer escrita.

### Barrier quebra

Uma task pode ter falhado ou não chegado dentro do timeout.

### O teste trava

Use timeout em latches, barriers, futures e joins.

### Stale read não foi observado

Isso não prova segurança; valide o contrato de happens-before.

### `computeIfAbsent` ainda gera efeito duplicado

Revise o contrato do factory e remova side effects irreversíveis.

### Atomic fix continua falhando

A invariante pode envolver mais de uma variável.

### Lock fix reduz muito throughput

Meça hold time e reduza a critical section.

### Optimistic retry nunca termina

Defina máximo de tentativas e estratégia de conflito.

### Thread dump sugere ciclo de locks

Preserve a análise aprofundada para a aula 594.

### O relatório contém dados reais

Substitua por categorias e valores sintéticos.

---

## Perguntas de revisão

1. O que é race condition?
2. O que é data race?
3. O que é lost update?
4. O que é stale read?
5. O que é check-then-act?
6. O que é read-modify-write?
7. O que é unsafe publication?
8. O que é TOCTOU?
9. O que é linearization point?
10. O que é deterministic harness?
11. O que é probabilistic harness?
12. Por que usar seed?
13. Qual limite de `sleep`?
14. Para que serve `CountDownLatch`?
15. Para que serve `CyclicBarrier`?
16. Quando usar single writer?
17. Como funciona optimistic version?
18. Zero falhas observadas prova segurança?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Resultado depende da ordem concorrente.
2. Acesso concorrente sem sincronização adequada.
3. Atualização sobrescrita.
4. Leitura de valor antigo.
5. Verificar e agir sem atomicidade.
6. Ler, calcular e escrever.
7. Compartilhar objeto sem publicação segura.
8. Estado muda entre check e use.
9. Instante lógico da operação.
10. Força interleaving.
11. Repete para aumentar probabilidade.
12. Reproduzir a execução.
13. Timing não garante ordem.
14. Coordenar contagem e liberação.
15. Alinhar participantes em um ponto.
16. Quando owner único simplifica estado.
17. Update condicionado à versão lida.
18. Não.
19. Deadlocks em Java.
20. Deadlocks em Java.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 593 - M18.38 - Race condition

- Continuei após Sincronização locks atomic.
- Defini race condition, data race e invariantes.
- Criei harnesses determinístico e probabilístico com timeout e seed.
- Reproduzi lost update e corrigi com atomic e lock.
- Analisei stale read e happens-before.
- Reproduzi check-then-act e corrigi com operação atômica de coleção.
- Avaliei unsafe publication, volatile, `AtomicReference` e constructor escape.
- Reproduzi TOCTOU apenas com modelo sintético.
- Reproduzi race em coleção.
- Usei `CountDownLatch`, `CyclicBarrier` e `Phaser`.
- Comparei atomic, lock, single writer e optimistic version.
- Validei fixes com o mesmo harness e a mesma invariante.
- Medi violation rate, timeout, retry e harness failure.
- Encerrei barriers, tasks e executors sem leaks.
- Coletei evidence sanitizada.
- Não antecipei deadlocks.
- Próxima aula: Deadlocks em Java.
```

## Referência técnica curta

- Race conditions.
- Java Memory Model.
- Lost update.
- Stale reads.
- Check-then-act.
- Safe publication.
- TOCTOU.
- Concurrent collections.
- Optimistic locking.
- Concurrency test harnesses.

Regra final:

```text
race conditions precisam ser investigadas a partir de estado compartilhado, owner, invariante e interleaving: lost update é reproduzido ao forçar múltiplas leituras antes das escritas, stale read é tratado pela ausência de happens-before, check-then-act precisa virar uma operação atômica, publicação usa referência volatile, atomic, monitor, lock ou canal thread-safe, TOCTOU vincula verificação e uso por handle, versão, transação ou coordenação, e coleções concorrentes não tornam automaticamente operações compostas seguras; harnesses usam CountDownLatch, CyclicBarrier ou Phaser com timeout, seed, repetição bounded, cleanup e distinção entre violação, timeout e falha do teste, enquanto atomic, lock, single writer, concurrent operations e optimistic version são comparados com o mesmo cenário e a mesma invariante; zero violações observadas não substitui o contrato do mecanismo, evidence permanece sintética e sanitizada, e todos os executors, barriers e tasks terminam com zero thread leaks e zero task leaks; ciclos de espera, detecção e recuperação de deadlocks ficam para a aula 594.
```
