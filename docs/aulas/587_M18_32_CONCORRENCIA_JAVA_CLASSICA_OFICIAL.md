# 587 - M18.32 - Concorrencia Java classica

## Apresentação da aula

Na aula 586, você ultrapassou a carga esperada de forma controlada.

Você trabalhou com:

```text
stress progressivo;

carga de pico;

saturation point;

breaking point;

failure region;

load shedding;

backpressure;

retry amplification;

backlog;

drain time;

recovery.
```

Durante os testes, vários sinais operacionais apareceram:

- filas cresceram;
- requisições permaneceram simultaneamente em execução;
- pools chegaram perto do limite;
- tarefas aguardaram recursos;
- operações foram rejeitadas;
- retries aumentaram a concorrência;
- threads permaneceram bloqueadas;
- latência subiu antes do erro;
- recuperação dependeu da liberação de trabalho acumulado.

Esses sinais pertencem a um tema central da plataforma Java:

```text
concorrência.
```

Concorrência aparece quando múltiplas atividades podem progredir durante o mesmo intervalo de tempo.

Elas não precisam executar exatamente no mesmo instante.

Um único núcleo pode alternar entre tarefas.

Múltiplos núcleos podem executar tarefas em paralelo.

Por isso, é importante separar:

```text
concorrência;

paralelismo.
```

**Concorrência** descreve a composição e coordenação de múltiplas atividades em andamento.

**Paralelismo** descreve a execução simultânea de atividades em recursos diferentes.

Uma aplicação backend utiliza concorrência mesmo quando o desenvolvedor não cria threads manualmente.

Exemplos:

- servidor HTTP processando requisições;
- consumers Kafka;
- scheduler;
- callbacks;
- pool JDBC;
- cliente HTTP;
- garbage collector;
- logging assíncrono;
- drivers;
- observabilidade;
- tarefas internas do framework.

A concorrência pode melhorar:

- utilização de CPU;
- throughput;
- responsividade;
- ocultação de espera de I/O;
- isolamento entre fluxos;
- capacidade de atender múltiplos clientes.

Mas também pode introduzir:

- estado compartilhado;
- interleavings imprevisíveis;
- lost update;
- leitura stale;
- race condition;
- deadlock;
- starvation;
- livelock;
- contenção;
- fila;
- context switching;
- vazamento de tarefas;
- cancelamento incompleto;
- shutdown incorreto;
- dificuldade de reprodução.

Nesta aula, você irá construir a base conceitual e operacional da concorrência Java clássica.

O objetivo não será ainda criar threads manualmente.

A pergunta central será:

```text
como reconhecer,
modelar
e diagnosticar

trabalho concorrente
em uma aplicação Java

antes de escolher
threads,
executors,
futures,
locks
ou estruturas atômicas?
```

Você irá estudar:

- processo;
- thread;
- task;
- scheduler;
- concorrência;
- paralelismo;
- interleaving;
- estado compartilhado;
- estado confinado;
- imutabilidade;
- atomicidade;
- visibilidade;
- ordenação;
- happens-before;
- critical section;
- safety;
- liveness;
- progress;
- blocking;
- waiting;
- contention;
- starvation;
- livelock;
- deadlock;
- cancellation;
- interruption;
- shutdown;
- CPU-bound;
- I/O-bound;
- throughput;
- latency;
- queueing;
- context switch;
- thread dump;
- métricas;
- runbook.

Alguns desses assuntos terão aulas específicas mais adiante.

Esta aula irá organizar o mapa e preparar o laboratório.

A sequência oficial após esta aula será:

```text
588:
Threads e Runnable.

589:
ExecutorService pools.

590:
CompletableFuture.

591:
Virtual threads.

592:
Sincronizacao locks atomic.

593:
Race condition.

594:
Deadlocks em Java.
```

Por isso, esta aula não irá antecipar implementações detalhadas de:

- `new Thread`;
- `Runnable`;
- `Callable`;
- `ExecutorService`;
- `CompletableFuture`;
- virtual threads;
- `synchronized`;
- `ReentrantLock`;
- `Semaphore`;
- `AtomicInteger`;
- simulação real de race;
- criação deliberada de deadlock.

O laboratório utilizará um **simulador determinístico de interleavings**.

Ele executará etapas sequenciais que representam possíveis ordens de operações concorrentes.

Isso permite visualizar riscos sem depender do scheduler real.

A regra central será:

```text
antes de paralelizar,
defina

estado,
ownership,
invariantes,
limites,
cancelamento,
observabilidade
e shutdown.
```

---

## Onde estamos na formação

A sequência imediata é:

```text
585:
Load testing conceitual.

586:
Stress e carga pico.

587:
Concorrencia Java classica.

588:
Threads e Runnable.
```

A progressão é:

```text
medir carga esperada;

encontrar limites;

entender concorrência;

criar threads e tasks.
```

Nesta aula:

```text
conceitos de concorrência:
sim.

concorrência versus paralelismo:
sim.

estado compartilhado:
sim.

atomicidade:
sim.

visibilidade:
sim.

ordenação:
sim.

happens-before:
introdução.

safety e liveness:
sim.

blocking e contention:
sim.

classificação CPU/I/O:
sim.

simulador de interleavings:
sim.

thread dump:
leitura conceitual.

Thread e Runnable:
não implementar.

ExecutorService:
não implementar.

locks e atomic:
não implementar.

race real:
não executar.

deadlock real:
não executar.
```

Você reutilizará:

- métricas de saturação;
- thread dumps;
- JFR;
- JMC;
- load testing;
- stress testing;
- filas;
- HikariCP;
- Kafka;
- logs;
- traces;
- runbooks;
- budgets de performance.

A concorrência precisa preservar:

- correção;
- invariantes;
- isolamento;
- boundedness;
- cancelamento;
- observabilidade;
- shutdown;
- recuperação.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/classic-foundations
├── concurrency-foundations-contract.yaml
├── concurrency-scenario-catalog.yaml
├── concurrency-ownership-policy.yaml
├── concurrency-state-policy.yaml
├── concurrency-safety-policy.yaml
├── concurrency-liveness-policy.yaml
├── concurrency-blocking-policy.yaml
├── concurrency-cancellation-policy.yaml
├── concurrency-shutdown-policy.yaml
├── concurrency-observability-policy.yaml
├── concurrency-data-quality-policy.yaml
├── concurrency-security-policy.yaml
├── concurrency-failure-policy.yaml
├── concurrency-foundation-scenarios.yaml
└── concurrency-foundation-evidence.yaml

concurrency/classic-foundations/src/main/java
└── br/com/formacao/concurrency/foundations
    ├── WorkloadKind.java
    ├── StateOwnership.java
    ├── ProgressGuarantee.java
    ├── OperationStep.java
    ├── InterleavingSchedule.java
    ├── InterleavingSimulator.java
    ├── CounterState.java
    ├── ConcurrencyScenario.java
    ├── ConcurrencyRisk.java
    ├── ConcurrencyAssessment.java
    └── ConcurrencyRiskAnalyzer.java

concurrency/classic-foundations/src/test/java
└── br/com/formacao/concurrency/foundations
    ├── InterleavingSimulatorTest.java
    ├── ConcurrencyRiskAnalyzerTest.java
    ├── StateOwnershipTest.java
    └── ConcurrencyContractTest.java

concurrency/classic-foundations/reports
├── concurrency-baseline-report.yaml
├── concurrency-interleaving-report.yaml
├── concurrency-risk-report.yaml
├── concurrency-observability-report.yaml
└── concurrency-gate-report.yaml

scripts/concurrency/foundations
├── validate-concurrency-foundations-contract.ps1
├── validate-concurrency-scenario-catalog.ps1
├── run-interleaving-simulator.ps1
├── validate-concurrency-invariants.ps1
├── analyze-concurrency-risks.ps1
├── validate-concurrency-observability.ps1
├── validate-concurrency-shutdown-plan.ps1
├── scan-concurrency-foundations-output.ps1
├── collect-concurrency-foundation-evidence.ps1
└── verify-concurrency-foundation-baseline.ps1

docs/concurrency/foundations
├── CONCURRENCY_FOUNDATIONS.md
├── CONCURRENCY_VS_PARALLELISM.md
├── SHARED_STATE_AND_OWNERSHIP.md
├── ATOMICITY_VISIBILITY_ORDERING.md
├── SAFETY_AND_LIVENESS.md
├── BLOCKING_CONTENTION_AND_QUEUES.md
├── CANCELLATION_AND_SHUTDOWN.md
├── CONCURRENCY_OBSERVABILITY.md
├── CONCURRENCY_TEST_MATRIX.md
└── CONCURRENCY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de concorrência;

catálogo de cenários;

classificação de workload;

ownership explícito;

simulador determinístico;

invariantes;

risk analyzer;

políticas de observabilidade;

shutdown plan;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### Processo

Instância de um programa em execução com espaço de memória e recursos próprios.

---

### Thread

Fluxo de execução dentro de um processo.

Threads do mesmo processo compartilham heap e recursos.

---

### Task

Unidade lógica de trabalho que pode ser executada por uma thread.

A task não precisa definir como a thread será criada.

---

### Scheduler

Componente do sistema operacional ou runtime que decide qual fluxo executa e por quanto tempo.

---

### Concorrência

Múltiplas atividades capazes de progredir no mesmo intervalo.

---

### Paralelismo

Múltiplas atividades executando simultaneamente.

---

### Interleaving

Ordem resultante da alternância entre etapas de operações.

---

### Shared state

Estado acessível por mais de um fluxo concorrente.

---

### Thread confinement

Estado acessado por apenas uma thread ou contexto de execução.

---

### Imutabilidade

Estado que não muda depois da construção.

---

### Atomicidade

Propriedade de uma operação observada como indivisível.

---

### Visibilidade

Garantia de que uma alteração feita por um fluxo pode ser observada por outro.

---

### Ordenação

Garantia sobre a ordem observável entre operações.

---

### Happens-before

Relação do Java Memory Model que garante ordem e visibilidade entre ações.

---

### Critical section

Trecho que acessa uma invariante compartilhada e exige coordenação.

---

### Invariante

Condição que deve permanecer verdadeira durante a operação correta do sistema.

---

### Safety

Propriedade de que algo incorreto nunca acontece.

Exemplo:

```text
saldo nunca fica
incompatível
com os lançamentos.
```

---

### Liveness

Propriedade de que algo desejado eventualmente acontece.

Exemplo:

```text
uma tarefa aceita
eventualmente termina
ou falha.
```

---

### Blocking

Situação em que um fluxo aguarda um evento ou recurso.

---

### Contention

Competição de múltiplos fluxos pelo mesmo recurso.

---

### Starvation

Fluxo permanece sem progredir porque outros consomem repetidamente o recurso.

---

### Livelock

Fluxos continuam ativos, mas não avançam no trabalho útil.

---

### Deadlock

Conjunto de fluxos aguardando recursos de forma circular sem progresso.

---

### CPU-bound

Trabalho limitado principalmente por processamento.

---

### I/O-bound

Trabalho limitado principalmente por espera de entrada e saída.

---

### Context switch

Troca do fluxo executado pelo processador.

---

### Cancellation

Pedido para interromper ou abandonar uma task.

---

### Interruption

Mecanismo cooperativo usado por threads Java para sinalizar interrupção.

A implementação será aprofundada depois.

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

- stress test encerrado;
- carga residual zerada;
- pools estabilizados;
- thread dump de referência disponível;
- JFR de referência disponível;
- nenhum código com criação manual de thread será adicionado;
- nenhuma race real será executada.

---

### 2. Criar contrato de fundamentos

Arquivo:

```text
concurrency-foundations-contract.yaml
```

Conteúdo:

```yaml
concurrency:
  required:
    - scenario
    - workload-kind
    - state
    - ownership
    - invariants
    - progress
    - blocking
    - cancellation
    - shutdown
    - observability

  implementation:
    deterministicSimulation:
      required

  forbiddenInLesson587:
    - manual-thread-creation
    - executor-service
    - completable-future
    - virtual-thread
    - explicit-lock
    - atomic-class
    - intentional-deadlock

  nextLesson:
    code:
      M18.33
```

---

### 3. Criar catálogo de cenários

Arquivo:

```text
concurrency-scenario-catalog.yaml
```

Exemplo:

```yaml
scenarios:
  - id:
      SHARED-COUNTER

    workload:
      CPU_LIGHT

    state:
      mutable-shared

    owner:
      multiple-callers

    invariants:
      - counter-equals-completed-increments

    risks:
      - lost-update
      - visibility
      - contention

  - id:
      ORDER-LOOKUP

    workload:
      IO_BOUND

    state:
      request-confined

    owner:
      request

    invariants:
      - response-belongs-to-request

    risks:
      - timeout
      - cancellation
      - resource-retention
```

---

### 4. Classificar workload

Crie:

```java
public enum WorkloadKind {
    CPU_BOUND,
    IO_BOUND,
    MIXED,
    UNKNOWN
}
```

A classificação orienta decisões futuras sobre:

- quantidade de threads;
- espera;
- pools;
- backpressure;
- observabilidade.

Não escolha implementação ainda.

---

### 5. Definir ownership

Crie:

```java
public enum StateOwnership {
    IMMUTABLE_SHARED,
    THREAD_CONFINED,
    REQUEST_CONFINED,
    SINGLE_WRITER,
    MULTI_WRITER,
    EXTERNAL_SOURCE_OF_TRUTH,
    UNKNOWN
}
```

Ownership responde:

```text
quem pode ler;

quem pode escrever;

durante quanto tempo;

sob qual contrato?
```

---

### 6. Criar política de ownership

Arquivo:

```text
concurrency-ownership-policy.yaml
```

Conteúdo:

```yaml
ownership:
  requiredForMutableState:
    true

  preferred:
    - immutable-shared
    - request-confined
    - single-writer

  multiWriter:
    requires:
      - invariant
      - coordination-strategy
      - tests
      - observability

  unknown:
    action:
      block-parallelization

  staticMutableState:
    review:
      mandatory
```

---

### 7. Criar estado do simulador

Crie:

```java
public final class CounterState {

    private int value;
    private int actorARegister;
    private int actorBRegister;

    public int value() {
        return value;
    }

    public int actorARegister() {
        return actorARegister;
    }

    public int actorBRegister() {
        return actorBRegister;
    }

    void readForActorA() {
        actorARegister = value;
    }

    void readForActorB() {
        actorBRegister = value;
    }

    void incrementActorARegister() {
        actorARegister++;
    }

    void incrementActorBRegister() {
        actorBRegister++;
    }

    void writeActorA() {
        value = actorARegister;
    }

    void writeActorB() {
        value = actorBRegister;
    }
}
```

O simulador será sequencial.

Ele representa etapas que poderiam ser intercaladas.

---

### 8. Modelar passos

Crie:

```java
public enum OperationStep {
    A_READ,
    A_INCREMENT,
    A_WRITE,
    B_READ,
    B_INCREMENT,
    B_WRITE
}
```

Cada passo será aplicado explicitamente.

---

### 9. Criar schedule

Crie:

```java
public record InterleavingSchedule(
        String id,
        List<OperationStep> steps) {

    public InterleavingSchedule {
        Objects.requireNonNull(id);
        steps = List.copyOf(steps);

        if (steps.isEmpty()) {
            throw new IllegalArgumentException(
                    "Schedule cannot be empty");
        }
    }
}
```

O schedule torna a ordem reproduzível.

---

### 10. Criar simulador

Crie:

```java
public final class InterleavingSimulator {

    public CounterState run(
            InterleavingSchedule schedule) {

        CounterState state =
                new CounterState();

        for (OperationStep step
                : schedule.steps()) {
            apply(state, step);
        }

        return state;
    }

    private void apply(
            CounterState state,
            OperationStep step) {

        switch (step) {
            case A_READ ->
                    state.readForActorA();

            case A_INCREMENT ->
                    state.incrementActorARegister();

            case A_WRITE ->
                    state.writeActorA();

            case B_READ ->
                    state.readForActorB();

            case B_INCREMENT ->
                    state.incrementActorBRegister();

            case B_WRITE ->
                    state.writeActorB();
        }
    }
}
```

Nenhuma thread real foi criada.

---

### 11. Simular ordem serial

Schedule:

```java
InterleavingSchedule serial =
        new InterleavingSchedule(
                "serial",
                List.of(
                        A_READ,
                        A_INCREMENT,
                        A_WRITE,
                        B_READ,
                        B_INCREMENT,
                        B_WRITE));
```

Resultado:

```text
valor final:
2.
```

A primeira operação termina antes da segunda.

---

### 12. Simular lost update conceitual

Schedule:

```java
InterleavingSchedule lostUpdate =
        new InterleavingSchedule(
                "lost-update",
                List.of(
                        A_READ,
                        B_READ,
                        A_INCREMENT,
                        B_INCREMENT,
                        A_WRITE,
                        B_WRITE));
```

Resultado:

```text
valor final:
1.
```

Ambos leram zero.

Ambos calcularam um.

A última escrita substituiu a anterior.

A aula 593 irá reproduzir race condition com execução concorrente real.

Nesta aula, você apenas demonstrou o interleaving.

---

### 13. Criar teste do simulador

```java
class InterleavingSimulatorTest {

    private final InterleavingSimulator simulator =
            new InterleavingSimulator();

    @Test
    void shouldPreserveBothIncrementsInSerialSchedule() {
        CounterState state =
                simulator.run(serialSchedule());

        assertEquals(
                2,
                state.value());
    }

    @Test
    void shouldExposeLostUpdateSchedule() {
        CounterState state =
                simulator.run(lostUpdateSchedule());

        assertEquals(
                1,
                state.value());
    }
}
```

O teste é determinístico.

---

### 14. Criar política de estado

Arquivo:

```text
concurrency-state-policy.yaml
```

Conteúdo:

```yaml
state:
  classify:
    - immutable
    - confined
    - single-writer
    - multi-writer
    - external

  mutableShared:
    require:
      - owner
      - invariant
      - coordination
      - failure-behavior

  entity:
    sharingAcrossThreads:
      forbiddenWithoutDesign

  requestContext:
    leakingAcrossRequests:
      forbidden

  cacheValue:
    immutable:
      preferred
```

---

### 15. Entender atomicidade

A expressão:

```java
counter++;
```

parece uma operação.

Conceitualmente, ela envolve:

```text
ler;

calcular;

escrever.
```

Sem coordenação, outros fluxos podem intercalar essas etapas.

Atomicidade não significa apenas “uma linha de código”.

---

### 16. Entender visibilidade

Um fluxo pode alterar um campo.

Outro fluxo pode não observar imediatamente a mudança sem uma relação de sincronização adequada.

Problema conceitual:

```text
worker:
running = false.

loop:
continua vendo true.
```

A solução detalhada com mecanismos Java será tratada nas aulas posteriores.

Nesta aula, registre a necessidade de uma relação de visibilidade.

---

### 17. Entender ordenação

Compilador, JVM e CPU podem reorganizar operações quando o resultado de um único fluxo permanece equivalente.

Em concorrência, outro fluxo pode observar uma ordem diferente sem garantias adequadas.

Por isso, raciocinar apenas pela ordem textual não é suficiente.

---

### 18. Introduzir happens-before

Exemplos de relações relevantes no Java Memory Model incluem:

- ordem dentro da própria thread;
- desbloqueio antes de bloqueio posterior no mesmo monitor;
- escrita `volatile` antes de leitura correspondente;
- início de thread;
- conclusão observada por `join`;
- mecanismos de bibliotecas concorrentes.

Esta aula não implementará esses mecanismos.

O objetivo é entender que visibilidade e ordenação precisam de uma relação formal.

---

### 19. Criar política de safety

Arquivo:

```text
concurrency-safety-policy.yaml
```

Conteúdo:

```yaml
safety:
  invariants:
    required

  examples:
    - no-lost-update
    - no-negative-inventory
    - no-duplicate-transition
    - no-cross-tenant-state

  violation:
    severity:
      explicit

  test:
    deterministicSchedule:
      requiredWhenPossible

  performanceCannotOverrideCorrectness:
    true
```

---

### 20. Criar invariantes

Para o contador:

```text
valor final
=
quantidade de increments concluídos.
```

Para pedido:

```text
pedido cancelado
não pode voltar
para criado
por evento antigo.
```

Para estoque:

```text
quantidade disponível
não fica negativa.
```

Para tenant:

```text
estado de um tenant
não aparece em outro.
```

---

### 21. Criar política de liveness

Arquivo:

```text
concurrency-liveness-policy.yaml
```

Conteúdo:

```yaml
liveness:
  acceptedTask:
    eventually:
      - complete
      - fail
      - cancel

  wait:
    bounded:
      required

  queue:
    bounded:
      required

  progress:
    observable:
      required

  noProgress:
    detect:
      required
```

---

### 22. Criar garantia de progresso

Crie:

```java
public enum ProgressGuarantee {
    COMPLETES,
    FAILS,
    CANCELS,
    MAY_BLOCK,
    UNKNOWN
}
```

Toda task precisa de uma expectativa de término.

`UNKNOWN` bloqueia aprovação.

---

### 23. Diferenciar safety e liveness

Safety:

```text
algo errado
não acontece.
```

Liveness:

```text
algo desejado
eventualmente acontece.
```

Um lock pode preservar safety e destruir liveness se nunca for liberado.

Uma fila pode preservar requests e destruir liveness se crescer sem drenagem.

---

### 24. Criar política de blocking

Arquivo:

```text
concurrency-blocking-policy.yaml
```

Conteúdo:

```yaml
blocking:
  operation:
    classify:
      required

  sources:
    - network
    - database
    - file
    - lock
    - queue
    - sleep
    - external-service

  wait:
    timeout:
      required

  criticalSection:
    blockingCall:
      avoid:
        true

  unknownBlocking:
    action:
      instrument
```

---

### 25. Classificar operações

Exemplo:

```yaml
operations:
  calculate-checksum:
    workload:
      CPU_BOUND

  load-order:
    workload:
      IO_BOUND

  update-order:
    workload:
      MIXED

  call-external-and-save:
    workload:
      MIXED
```

A classificação precisa refletir medição.

---

### 26. Entender filas

Uma fila representa trabalho aguardando capacidade.

Métricas essenciais:

- tamanho;
- capacidade;
- tempo de espera;
- idade do item mais antigo;
- taxa de entrada;
- taxa de saída;
- rejeições;
- drain time.

Fila sem limite transforma overload em consumo crescente de memória.

---

### 27. Criar política de cancellation

Arquivo:

```text
concurrency-cancellation-policy.yaml
```

Conteúdo:

```yaml
cancellation:
  cooperative:
    required

  reason:
    required

  propagate:
    toOwnedWork:
      required

  externalCall:
    cancelWhenSupported:
      true

  partialEffect:
    contract:
      required

  ignoredCancellation:
    forbidden
```

A implementação com interruption será aprofundada depois.

---

### 28. Criar política de shutdown

Arquivo:

```text
concurrency-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopAcceptingNewWork:
    first:
      true

  inFlight:
    policy:
      required

  timeout:
    required

  cancellation:
    required

  resourceRelease:
    required

  metrics:
    required

  forcedTermination:
    lastResort:
      true
```

---

### 29. Criar shutdown plan

Exemplo:

```text
1.
marcar instância not ready;

2.
parar novas tasks;

3.
aguardar in-flight;

4.
cancelar o que exceder o limite;

5.
fechar recursos;

6.
registrar tarefas incompletas;

7.
encerrar.
```

O plano será conectado a executors nas aulas seguintes.

---

### 30. Criar cenário

Crie:

```java
public record ConcurrencyScenario(
        String id,
        WorkloadKind workloadKind,
        StateOwnership ownership,
        Set<String> invariants,
        ProgressGuarantee progress,
        boolean blocking,
        boolean boundedQueue,
        boolean cancellationDefined,
        boolean shutdownDefined) {

    public ConcurrencyScenario {
        Objects.requireNonNull(id);
        Objects.requireNonNull(workloadKind);
        Objects.requireNonNull(ownership);
        invariants = Set.copyOf(invariants);
        Objects.requireNonNull(progress);
    }
}
```

---

### 31. Criar riscos

Crie:

```java
public enum ConcurrencyRisk {
    UNKNOWN_WORKLOAD,
    UNKNOWN_OWNERSHIP,
    MUTABLE_MULTI_WRITER_STATE,
    MISSING_INVARIANT,
    UNKNOWN_PROGRESS,
    UNBOUNDED_QUEUE,
    MISSING_CANCELLATION,
    MISSING_SHUTDOWN,
    BLOCKING_IN_CRITICAL_PATH
}
```

---

### 32. Criar assessment

```java
public record ConcurrencyAssessment(
        String scenarioId,
        Set<ConcurrencyRisk> risks,
        boolean approved) {

    public ConcurrencyAssessment {
        risks = Set.copyOf(risks);
    }
}
```

---

### 33. Criar risk analyzer

```java
public final class ConcurrencyRiskAnalyzer {

    public ConcurrencyAssessment assess(
            ConcurrencyScenario scenario) {

        EnumSet<ConcurrencyRisk> risks =
                EnumSet.noneOf(
                        ConcurrencyRisk.class);

        if (scenario.workloadKind()
                == WorkloadKind.UNKNOWN) {
            risks.add(
                    ConcurrencyRisk.UNKNOWN_WORKLOAD);
        }

        if (scenario.ownership()
                == StateOwnership.UNKNOWN) {
            risks.add(
                    ConcurrencyRisk.UNKNOWN_OWNERSHIP);
        }

        if (scenario.ownership()
                == StateOwnership.MULTI_WRITER) {
            risks.add(
                    ConcurrencyRisk
                            .MUTABLE_MULTI_WRITER_STATE);
        }

        if (scenario.invariants().isEmpty()) {
            risks.add(
                    ConcurrencyRisk.MISSING_INVARIANT);
        }

        if (!scenario.boundedQueue()) {
            risks.add(
                    ConcurrencyRisk.UNBOUNDED_QUEUE);
        }

        if (!scenario.cancellationDefined()) {
            risks.add(
                    ConcurrencyRisk.MISSING_CANCELLATION);
        }

        if (!scenario.shutdownDefined()) {
            risks.add(
                    ConcurrencyRisk.MISSING_SHUTDOWN);
        }

        return new ConcurrencyAssessment(
                scenario.id(),
                risks,
                risks.isEmpty());
    }
}
```

Esse analyzer não substitui revisão técnica.

Ele cria um gate básico antes da implementação.

---

### 34. Testar risk analyzer

```java
@Test
void shouldRejectUnknownMutableScenario() {
    ConcurrencyScenario scenario =
            new ConcurrencyScenario(
                    "unknown",
                    WorkloadKind.UNKNOWN,
                    StateOwnership.UNKNOWN,
                    Set.of(),
                    ProgressGuarantee.UNKNOWN,
                    true,
                    false,
                    false,
                    false);

    ConcurrencyAssessment assessment =
            analyzer.assess(scenario);

    assertFalse(
            assessment.approved());

    assertTrue(
            assessment.risks().contains(
                    ConcurrencyRisk
                            .UNKNOWN_OWNERSHIP));
}
```

---

### 35. Criar política de observabilidade

Arquivo:

```text
concurrency-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - active-work
    - queued-work
    - oldest-wait
    - completion-rate
    - failure-rate
    - cancellation-rate
    - rejection-rate
    - blocked-time
    - wait-time

  threadDump:
    correlate:
      required

  JFR:
    useFor:
      - thread-parks
      - monitor-contention
      - CPU-samples
      - allocation

  labels:
    forbidden:
      - thread-id
      - customer-id
      - request-id
```

---

### 36. Ler estados de thread conceitualmente

Em thread dump, estados comuns incluem:

```text
NEW;

RUNNABLE;

BLOCKED;

WAITING;

TIMED_WAITING;

TERMINATED.
```

`RUNNABLE` na JVM pode incluir thread executando ou pronta para executar.

`BLOCKED` indica espera por monitor.

`WAITING` indica espera sem timeout em operação específica.

`TIMED_WAITING` inclui espera limitada.

A aula 588 irá criar threads e observar os estados.

---

### 37. Correlacionar sinais

Exemplo:

```text
latência alta;

CPU baixa;

muitas threads WAITING;

HikariCP pending alto.
```

Hipótese:

```text
espera por conexão
ou coordenação,
não falta de CPU.
```

Outro exemplo:

```text
CPU alta;

RUNNABLE alta;

fila cresce;

throughput estagna.
```

Hipótese:

```text
trabalho CPU-bound
ou contenção de CPU.
```

---

### 38. Criar relatório de baseline

Arquivo:

```text
concurrency-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  scenarios:
    total:
      4

    approved:
      2

    blocked:
      2

  risks:
    - unknown-ownership
    - unbounded-queue

  observability:
    threadDump:
      available

    JFR:
      available

  result:
    baseline-created
```

---

### 39. Criar matriz de testes

Arquivo:

```text
CONCURRENCY_TEST_MATRIX.md
```

Cenários:

- process;
- thread;
- task;
- concurrency;
- parallelism;
- serial schedule;
- lost-update schedule;
- immutable state;
- confined state;
- single writer;
- multi writer;
- missing invariant;
- unknown workload;
- blocking operation;
- unbounded queue;
- cancellation missing;
- shutdown missing;
- safety;
- liveness;
- thread dump states;
- observability;
- security;
- evidence.

---

### 40. Criar troubleshooting

Arquivo:

```text
CONCURRENCY_TROUBLESHOOTING.md
```

Inclua:

- simulador retorna valor inesperado;
- schedule incompleto;
- ownership desconhecido;
- invariant genérica;
- CPU-bound classificado como I/O;
- fila sem capacidade;
- cancellation ausente;
- shutdown sem timeout;
- thread dump sem janela correspondente;
- JFR sem workload;
- `RUNNABLE` interpretado como CPU ativa;
- state compartilhado escondido em singleton;
- contexto de request vazando;
- implementação de `Thread` antecipada.

---

### 41. Criar política de data quality

Arquivo:

```text
concurrency-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingScenario:
    action:
      block

  missingOwnership:
    action:
      block

  missingInvariant:
    action:
      block

  unknownWorkload:
    result:
      limited

  noObservabilityWindow:
    result:
      inconclusive

  nondeterministicSimulation:
    action:
      reject

  staleThreadDump:
    result:
      limited
```

---

### 42. Criar política de segurança

Arquivo:

```text
concurrency-security-policy.yaml
```

Conteúdo:

```yaml
security:
  reports:
    identifiers:
      sanitize:
        required

  threadDump:
    mayContain:
      - class-names
      - endpoint-paths
      - arguments

  rawThreadDump:
    repository:
      forbidden

  requestContext:
    crossThreadLeak:
      forbidden

  credentials:
    forbidden
```

---

### 43. Criar failure policy

Arquivo:

```text
concurrency-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invariantViolation:
    action:
      reject-design

  unknownOwnership:
    action:
      stop-parallelization

  unboundedQueue:
    action:
      define-bound

  cancellationIgnored:
    action:
      block-approval

  shutdownIncomplete:
    action:
      block-release

  noProgress:
    action:
      collect-thread-dump-and-JFR

  manualThread:
    deferredToLesson588
```

---

### 44. Criar cenários oficiais

Arquivo:

```text
concurrency-foundation-scenarios.yaml
```

Cenários:

```text
serial-counter;

lost-update-interleaving;

immutable-shared-config;

request-confined-state;

single-writer-state;

multi-writer-without-contract;

CPU-bound-task;

I/O-bound-task;

blocking-critical-path;

bounded-queue;

unbounded-queue;

cancellation-defined;

cancellation-missing;

graceful-shutdown-plan;

missing-shutdown;

thread-dump-correlation.
```

Cada cenário registra:

- workload;
- ownership;
- state;
- invariants;
- progress;
- blocking;
- queue;
- cancellation;
- shutdown;
- observability;
- result;
- evidence.

---

### 45. Executar simulador

Script:

```text
run-interleaving-simulator.ps1
```

Execute:

```powershell
mvn `
  --batch-mode `
  -Dtest=InterleavingSimulatorTest `
  test
```

Gere:

```text
concurrency-interleaving-report.yaml.
```

Registre schedules e resultados sem dados reais.

---

### 46. Validar invariantes

Script:

```text
validate-concurrency-invariants.ps1
```

Verifique:

- cada cenário possui invariante;
- cada invariante é observável;
- violação possui severidade;
- schedule serial preserva;
- schedule de risco demonstra violação;
- nenhuma conclusão depende do scheduler real.

---

### 47. Analisar riscos

Script:

```text
analyze-concurrency-risks.ps1
```

Classifique:

```text
APPROVED_FOR_DESIGN;

REQUIRES_OWNERSHIP;

REQUIRES_INVARIANTS;

REQUIRES_BOUND;

REQUIRES_CANCELLATION;

REQUIRES_SHUTDOWN;

INCONCLUSIVE.
```

---

### 48. Validar shutdown plan

Script:

```text
validate-concurrency-shutdown-plan.ps1
```

Confirme:

- parar entrada;
- política para in-flight;
- timeout;
- cancelamento;
- liberação de recurso;
- evidence de incomplete work;
- owner;
- fallback.

---

### 49. Criar gate

Arquivo:

```text
concurrency-foundations-contract.yaml
```

O gate valida:

- catálogo;
- workload;
- ownership;
- invariantes;
- safety;
- liveness;
- blocking;
- queue;
- cancellation;
- shutdown;
- observability;
- segurança;
- evidence.

Status:

```text
PASS;

FAIL_OWNERSHIP;

FAIL_INVARIANT;

FAIL_UNBOUNDED_QUEUE;

FAIL_CANCELLATION;

FAIL_SHUTDOWN;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 50. Coletar evidence

Script:

```text
collect-concurrency-foundation-evidence.ps1
```

Arquivo:

```text
concurrency-foundation-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- scenario category;
- workload status;
- ownership status;
- invariant status;
- safety status;
- liveness status;
- blocking status;
- queue status;
- cancellation status;
- shutdown status;
- observability status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- thread dump bruto;
- request ID;
- customer ID;
- token;
- argumentos sensíveis;
- código de `Thread`;
- código `Runnable`;
- material da aula 588.

---

### 51. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\foundations\validate-concurrency-foundations-contract.ps1

.\scripts\concurrency\foundations\validate-concurrency-scenario-catalog.ps1

.\scripts\concurrency\foundations\run-interleaving-simulator.ps1

.\scripts\concurrency\foundations\validate-concurrency-invariants.ps1

.\scripts\concurrency\foundations\analyze-concurrency-risks.ps1

.\scripts\concurrency\foundations\validate-concurrency-observability.ps1

.\scripts\concurrency\foundations\validate-concurrency-shutdown-plan.ps1

.\scripts\concurrency\foundations\scan-concurrency-foundations-output.ps1

.\scripts\concurrency\foundations\collect-concurrency-foundation-evidence.ps1

.\scripts\concurrency\foundations\verify-concurrency-foundation-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- ownership aprovado;
- workloads classificados;
- schedules reproduzíveis;
- invariantes validadas;
- safety e liveness documentadas;
- blocking classificado;
- filas bounded;
- cancellation definida;
- shutdown definido;
- observabilidade aprovada;
- segurança aprovada;
- evidence sanitizada;
- Threads e Runnable não antecipados.

---

### 52. Encerrar o laboratório

Confirme:

- nenhum processo de carga ativo;
- nenhum artifact temporário;
- nenhum thread dump bruto no Git;
- reports sanitizados;
- testes determinísticos;
- baseline preservada;
- próxima aula preparada apenas pela ponte.

Remova:

```powershell
Remove-Item `
  .tmp/concurrency-foundations `
  -Recurse `
  -Force
```

Não remova relatórios sanitizados.

---

## Entendendo o que foi feito

### Concorrência ganhou linguagem

Processo, thread, task, concorrência e paralelismo passaram a ter significados distintos.

### Estado ganhou ownership

O acesso deixou de ser implícito.

### Interleaving ganhou reprodução

O simulador mostrou ordens possíveis sem depender do scheduler.

### Atomicidade ganhou decomposição

Uma expressão simples passou a ser vista como múltiplas etapas.

### Visibilidade ganhou contrato

A ordem textual deixou de ser tratada como garantia entre fluxos.

### Safety ganhou invariantes

Correção passou a ser expressa por condições observáveis.

### Liveness ganhou progresso

Toda task passou a precisar terminar, falhar ou cancelar.

### Blocking ganhou classificação

Espera por banco, rede, lock e fila passou a ser diferenciada.

### Filas ganharam limites

Backlog deixou de ser um detalhe escondido.

### Shutdown ganhou desenho

Aceite de trabalho, in-flight, cancelamento e liberação passaram a ter ordem.

### A próxima aula ganhou fronteira

A aula 588 irá criar threads e implementar tasks com `Runnable`.

---

## Erros comuns importantes

### Confundir concorrência e paralelismo

Concorrência pode existir em um único núcleo.

### Tratar linha de código como atômica

`counter++` possui etapas conceituais.

### Compartilhar objeto mutável sem owner

Ninguém sabe quem pode alterar e quando.

### Pensar apenas em safety

O sistema pode permanecer correto e nunca concluir.

### Usar fila sem limite

Overload vira consumo de memória.

### Ignorar cancelamento

Tasks continuam consumindo recursos depois da desistência.

### Fechar processo sem shutdown plan

Trabalho in-flight pode ser perdido.

### Interpretar `RUNNABLE` como CPU garantida

O estado não prova uso ativo do processador.

### Usar thread dump fora da janela

A evidência perde correlação.

### Antecipar `Thread` e `Runnable`

A implementação pertence à aula 588.

---

## Comandos úteis

### Executar testes

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Executar simulador

```powershell
.\scripts\concurrency\foundations\run-interleaving-simulator.ps1
```

### Analisar riscos

```powershell
.\scripts\concurrency\foundations\analyze-concurrency-risks.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\foundations\validate-concurrency-shutdown-plan.ps1
```

### Validar diff

```powershell
git diff --check
```

---

## Exercício guiado

### Parte 1 — Catálogo

Liste cenários concorrentes da aplicação.

### Parte 2 — Workload

Classifique CPU, I/O ou mixed.

### Parte 3 — Ownership

Defina quem lê e escreve.

### Parte 4 — Invariantes

Escreva condições de safety.

### Parte 5 — Interleaving

Execute schedules serial e lost update.

### Parte 6 — Liveness

Defina completion, failure e cancellation.

### Parte 7 — Blocking

Mapeie banco, rede, locks e filas.

### Parte 8 — Shutdown

Crie ordem de encerramento.

### Parte 9 — Observability

Defina métricas, thread dump e JFR.

### Parte 10 — Gate

Valide riscos, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 586 e ponte para a aula 588 foram preservadas;
- processo, thread, task, scheduler, concorrência, paralelismo, interleaving, shared state, confinement, imutabilidade, atomicidade, visibilidade, ordenação, happens-before, critical section, invariante, safety, liveness, blocking, contention, starvation, livelock, deadlock, CPU-bound, I/O-bound, context switch, cancellation e interruption foram definidos;
- contrato e catálogo de cenários foram criados;
- workloads foram classificados;
- ownership foi explicitado;
- estado mutável multi-writer exige coordenação;
- simulador determinístico foi criado;
- schedule serial preserva dois increments;
- schedule intercalado demonstra lost update conceitual;
- nenhuma thread real foi criada;
- política de estado foi criada;
- atomicidade foi separada da quantidade de linhas;
- visibilidade e ordenação foram relacionadas ao Java Memory Model;
- happens-before foi introduzido sem antecipar implementação;
- safety foi representada por invariantes;
- liveness foi representada por completion, failure ou cancellation;
- blocking sources foram catalogadas;
- filas exigem capacidade, idade, entrada, saída e drain time;
- cancellation cooperativa foi documentada;
- shutdown plan possui stop intake, in-flight, timeout, cancelamento e liberação;
- `ConcurrencyScenario`, risks, assessment e analyzer foram criados;
- observabilidade inclui active, queued, wait, completion, failure, cancellation e rejection;
- estados de thread foram interpretados conceitualmente;
- thread dump e JFR foram correlacionados;
- políticas de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, gate e evidence sanitizada estão presentes;
- nenhum thread dump bruto, identificador ou segredo foi commitado;
- `Thread` e `Runnable` não foram implementados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/classic-foundations `
  scripts/concurrency/foundations `
  docs/concurrency/foundations `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|requestId|rawThreadDump|new Thread|implements Runnable|ExecutorService"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): fundamentar concorrencia Java classica"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- identificadores reais;
- thread dumps brutos;
- artifacts temporários;
- `new Thread`;
- implementação de `Runnable`;
- executors;
- material da aula 588.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou a base conceitual e operacional para raciocinar sobre concorrência.

Você trabalhou com:

```text
processo;

thread;

task;

concorrência;

paralelismo;

interleaving;

ownership;

estado compartilhado;

atomicidade;

visibilidade;

ordenação;

safety;

liveness;

blocking;

filas;

cancelamento;

shutdown;

observabilidade.
```

Você comprovou, por um simulador determinístico, que duas operações corretas isoladamente podem produzir resultado incorreto quando suas etapas são intercaladas. Também estabeleceu que nenhuma decisão de paralelização deve ocorrer sem workload, ownership, invariantes, boundedness, cancelamento, observabilidade e shutdown.

A próxima aula será:

```text
588 - M18.33 - Threads e Runnable
```

Nela, você irá criar threads Java, implementar `Runnable`, observar lifecycle, nomes, estados, `start`, `run`, `join`, interruption, uncaught exceptions e encerramento básico.

Nenhuma criação manual de `Thread`, implementação de `Runnable`, chamada a `start`, `join`, configuração de `UncaughtExceptionHandler` ou execução concorrente real foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei concorrência e paralelismo.
- [ ] Classifiquei workloads.
- [ ] Defini ownership.
- [ ] Escrevi invariantes.
- [ ] Executei schedules determinísticos.
- [ ] Diferenciei safety e liveness.
- [ ] Mapeei blocking e filas.
- [ ] Criei cancellation e shutdown plan.

---

## Troubleshooting adicional

### O simulador não demonstra lost update

Revise a ordem `A_READ`, `B_READ`, increments e writes.

### O cenário não possui owner

Bloqueie a paralelização até definir acesso e escrita.

### A invariante é vaga

Transforme-a em condição observável e testável.

### Tudo foi classificado como I/O-bound

Meça CPU e espera antes de concluir.

### A fila não possui capacidade

Defina limite, rejeição e drain time.

### Cancellation existe apenas no documento

Defina como o pedido será propagado ao trabalho owned.

### Shutdown aguarda indefinidamente

Adicione timeout, cancelamento e fallback.

### Thread dump mostra `RUNNABLE`

Correlacione CPU, stack, JFR e janela antes de concluir.

### O relatório contém stack sensível

Sanitize e mantenha o dump bruto fora do Git.

### Surgiu código com `new Thread`

Mova a implementação para a aula 588.

---

## Perguntas de revisão

1. O que é concorrência?
2. O que é paralelismo?
3. O que é uma task?
4. O que é interleaving?
5. O que é shared state?
6. O que é thread confinement?
7. O que é atomicidade?
8. O que é visibilidade?
9. O que é ordenação?
10. O que é happens-before?
11. O que é safety?
12. O que é liveness?
13. O que é contention?
14. O que é starvation?
15. O que é livelock?
16. O que é deadlock?
17. Qual diferença entre CPU-bound e I/O-bound?
18. Por que shutdown precisa ser desenhado?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Múltiplas atividades em progresso.
2. Execução simultânea.
3. Unidade lógica de trabalho.
4. Ordem intercalada de etapas.
5. Estado acessado por múltiplos fluxos.
6. Estado confinado a um fluxo.
7. Operação indivisível.
8. Mudança observável por outro fluxo.
9. Ordem garantida entre ações.
10. Relação de ordem e visibilidade.
11. Algo incorreto não acontece.
12. Algo desejado eventualmente acontece.
13. Competição por recurso.
14. Fluxo não recebe oportunidade.
15. Atividade sem progresso útil.
16. Espera circular sem progresso.
17. Computação versus espera de I/O.
18. Para encerrar trabalho e recursos com segurança.
19. Threads e Runnable.
20. Threads e Runnable.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 587 - M18.32 - Concorrencia Java classica

- Continuei após Teste de stress carga pico.
- Diferenciei concorrência e paralelismo.
- Entendi processo, thread, task e scheduler.
- Classifiquei workloads CPU-bound, I/O-bound e mixed.
- Criei contrato e catálogo de cenários.
- Defini ownership para estados compartilhados.
- Priorizei imutabilidade, confinement e single writer.
- Criei simulador determinístico de interleavings.
- Executei schedule serial.
- Demonstrei lost update de forma conceitual.
- Entendi atomicidade como conjunto de etapas.
- Introduzi visibilidade, ordenação e happens-before.
- Diferenciei safety e liveness.
- Escrevi invariantes observáveis.
- Classifiquei blocking, contention, starvation, livelock e deadlock.
- Modelei filas bounded.
- Criei política de cancellation cooperativa.
- Criei shutdown plan.
- Criei scenario, risks, assessment e analyzer.
- Defini métricas de trabalho ativo, fila, espera, conclusão e rejeição.
- Interpretei estados de thread conceitualmente.
- Correlacionei thread dump e JFR.
- Coletei evidence sanitizada.
- Não implementei Thread ou Runnable.
- Próxima aula: Threads e Runnable.
```

---

## Referência técnica curta

- Java concurrency fundamentals.
- Java Memory Model.
- Atomicity, visibility and ordering.
- Happens-before.
- Safety and liveness.
- Shared state and confinement.
- Blocking and contention.
- Thread states.
- Cancellation.
- Graceful shutdown.

Regra final:

```text
concorrência Java clássica precisa começar pelo modelo do trabalho, não pela criação de threads: processo, thread e task são separados, concorrência não é confundida com paralelismo, workloads são classificados como CPU-bound, I/O-bound ou mixed, e todo estado mutável recebe ownership, invariantes e limites; atomicidade não é inferida pela quantidade de linhas, visibilidade e ordenação dependem de relações happens-before, safety impede estados incorretos e liveness garante término, falha ou cancelamento, enquanto blocking, contention, filas, starvation, livelock e deadlock precisam ser observáveis; um simulador determinístico demonstra interleavings sem depender do scheduler, filas permanecem bounded, cancellation é cooperativa e shutdown interrompe entrada, trata in-flight, libera recursos e registra trabalho incompleto; threads, Runnable, start, join, interruption e execução concorrente real ficam para a aula 588.
```
