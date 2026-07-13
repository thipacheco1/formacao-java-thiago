# 598 - M18.43 - CPU high diagnostico

## Apresentação da aula

Na aula 597, você diagnosticou memory leaks usando tendência de live set, histogramas, heap dumps, dominator tree e caminhos até GC roots.

Você aprendeu que:

```text
heap alto
não prova leak;

retenção crescente
e owner identificável
formam a evidência.
```

Nesta aula, o foco muda de retenção de memória para consumo de processamento.

A pergunta central será qual thread, método ou comportamento está consumindo CPU.

CPU alta pode representar tráfego, trabalho útil, serialização, compressão, criptografia, parsing, GC, JIT, polling, retries, contenção, loops, logging, instrumentação, competição por recursos ou limites incorretos do container.

O diagnóstico separa trabalho útil de desperdício, loop, contenção, GC ou desenho inadequado.

Também é necessário diferenciar CPU do host, container, processo e thread, além de user CPU, system CPU, throttling, load, run queue, GC CPU e steal time.

Um processo pode usar 100% de um core dentro de um container limitado, mesmo com o host livre.

Se a carga exige mais que a quota, throttling e latência crescem mesmo sem 100% aparente.

Por isso, diagnóstico de CPU alta precisa considerar capacidade e limites.

Você trabalhará com utilization, saturation, user e system CPU, processo e threads, run queue, throttling, native thread IDs, dumps, sampling, JFR, async-profiler, flame graphs, JIT, GC, loops, polling, contenção, regex, serialização, logging, regressão e runbook.

O laboratório criará cenários bounded de loop matemático, regex custosa, serialização repetitiva, busy spin, logging, GC pressure, contenção e polling agressivo.

Cada cenário será executado em processo Java filho.

A suíte principal permanece segura.

Você coletará baseline, CPU por processo e thread, três dumps, JFR, perfil, flame graph, hot methods, throughput, p95, p99 e comparação após a correção.

A próxima aula oficial será:

```text
599 - M18.44 - Banco lento diagnostico
```

Por isso, esta aula não irá aprofundar:

- planos de execução SQL;
- `EXPLAIN`;
- `EXPLAIN ANALYZE`;
- índices;
- sequential scan;
- index scan;
- lock de banco;
- blocking sessions;
- `pg_stat_activity`;
- `pg_stat_statements`;
- vacuum;
- bloat;
- cardinalidade de query;
- análise de query lenta;
- tuning de PostgreSQL;
- pool JDBC como causa central de banco lento.

Banco poderá aparecer apenas como dependência correlacionada.

A regra central será:

```text
CPU alta
não deve ser tratada
com adivinhação;

primeiro identifique
a capacidade,
depois a thread,
depois a stack
e então o método quente.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
596:
Timeouts em producao.

597:
Memory leak diagnostico.

598:
CPU high diagnostico.

599:
Banco lento diagnostico.
```

A progressão é:

```text
limitar espera;

diagnosticar retenção;

diagnosticar processamento;

diagnosticar persistência lenta.
```

Nesta aula:

```text
CPU do host:
sim.

CPU de container:
sim.

CPU de processo:
sim.

CPU por thread:
sim.

thread dump sampling:
sim.

native thread ID:
sim.

JFR:
sim.

async-profiler:
sim.

flame graph:
sim.

hot methods:
sim.

GC CPU:
sim.

busy spin:
sim.

contenção:
sim.

CPU regression:
sim.

plano de execução SQL:
não.

diagnóstico profundo de banco:
não.
```

Você reutilizará:

- observabilidade;
- thread dumps;
- JFR;
- processos filhos;
- timeouts;
- stress testing;
- load testing;
- virtual threads;
- locks;
- GC logs;
- métricas;
- tracing;
- runbooks;
- evidence sanitizada.

O diagnóstico precisa preservar workload conhecido, ambiente e limites comparáveis, mesma versão, JVM, duração, warmup, múltiplas janelas, dados sintéticos, cleanup e zero processos residuais.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/cpu-high
├── cpu-high-contract.yaml
├── cpu-high-scenario-catalog.yaml
├── cpu-high-baseline-policy.yaml
├── cpu-high-capacity-policy.yaml
├── cpu-high-thread-policy.yaml
├── cpu-high-sampling-policy.yaml
├── cpu-high-jfr-policy.yaml
├── cpu-high-profiler-policy.yaml
├── cpu-high-gc-policy.yaml
├── cpu-high-contention-policy.yaml
├── cpu-high-fix-policy.yaml
├── cpu-high-regression-policy.yaml
├── cpu-high-observability-policy.yaml
├── cpu-high-shutdown-policy.yaml
├── cpu-high-data-quality-policy.yaml
├── cpu-high-security-policy.yaml
├── cpu-high-failure-policy.yaml
├── cpu-high-scenarios.yaml
└── cpu-high-evidence.yaml

performance/cpu-high/src/main/java
└── br/com/formacao/performance/cpu
    ├── CpuScenarioType.java
    ├── CpuScenario.java
    ├── CpuSnapshot.java
    ├── ThreadCpuSnapshot.java
    ├── HotThreadSample.java
    ├── CpuRunSummary.java
    ├── MathLoopScenario.java
    ├── BusySpinScenario.java
    ├── RegexScenario.java
    ├── SerializationScenario.java
    ├── LoggingScenario.java
    ├── ContentionScenario.java
    ├── GcPressureScenario.java
    ├── PollingScenario.java
    ├── CpuHighChildMain.java
    ├── CpuHighProcessRunner.java
    ├── CpuRegressionVerifier.java
    └── CpuHighDemo.java

performance/cpu-high/src/test/java
└── br/com/formacao/performance/cpu
    ├── MathLoopScenarioTest.java
    ├── BusySpinScenarioTest.java
    ├── RegexScenarioTest.java
    ├── SerializationScenarioTest.java
    ├── LoggingScenarioTest.java
    ├── ContentionScenarioTest.java
    ├── GcPressureScenarioTest.java
    ├── PollingScenarioTest.java
    ├── CpuHighProcessTest.java
    ├── CpuRegressionTest.java
    ├── CpuHighCleanupTest.java
    └── CpuHighContractTest.java

performance/cpu-high/reports
├── cpu-baseline-report.yaml
├── cpu-process-report.yaml
├── cpu-thread-report.yaml
├── cpu-stack-sampling-report.yaml
├── cpu-jfr-report.yaml
├── cpu-flamegraph-report.yaml
├── cpu-fix-report.yaml
└── cpu-high-gate-report.yaml

scripts/performance/cpu-high
├── validate-cpu-high-contract.ps1
├── validate-cpu-high-scenarios.ps1
├── build-cpu-high-child.ps1
├── run-cpu-high-baseline.ps1
├── run-math-loop-scenario.ps1
├── run-busy-spin-scenario.ps1
├── run-regex-scenario.ps1
├── run-serialization-scenario.ps1
├── run-logging-scenario.ps1
├── run-contention-scenario.ps1
├── run-gc-pressure-scenario.ps1
├── run-polling-scenario.ps1
├── collect-process-cpu.ps1
├── collect-thread-cpu.ps1
├── collect-cpu-thread-dumps.ps1
├── map-native-thread-id.ps1
├── collect-cpu-jfr.ps1
├── collect-async-profiler.ps1
├── generate-cpu-flamegraph.ps1
├── analyze-hot-methods.ps1
├── validate-cpu-high-fix.ps1
├── validate-cpu-high-regression.ps1
├── validate-cpu-high-shutdown.ps1
├── kill-residual-cpu-process.ps1
├── scan-cpu-output.ps1
├── collect-cpu-high-evidence.ps1
└── verify-cpu-high-baseline.ps1

docs/performance/cpu-high
├── CPU_HIGH_OVERVIEW.md
├── CPU_CAPACITY_AND_SATURATION.md
├── HOST_CONTAINER_PROCESS_CPU.md
├── THREAD_CPU_ANALYSIS.md
├── THREAD_DUMP_SAMPLING.md
├── JFR_CPU_PROFILING.md
├── ASYNC_PROFILER_GUIDE.md
├── FLAME_GRAPH_GUIDE.md
├── GC_AND_CONTENTION_CPU.md
├── CPU_HIGH_RECOVERY_RUNBOOK.md
├── CPU_HIGH_TEST_MATRIX.md
└── CPU_HIGH_TROUBLESHOOTING.md
```

Ao final, você terá contrato, catálogo, baseline, processo filho, CPU de processo e thread, dumps, JFR, perfil, flame graph, hot methods, correções, regressão, runbook, gate e evidence sanitizada.

---

## Conceito essencial

### CPU utilization

Percentual de tempo em que a CPU está executando trabalho.

---

### CPU saturation

Condição em que existe mais trabalho pronto para executar do que capacidade disponível.

---

### User CPU

Tempo gasto executando código em espaço de usuário.

---

### System CPU

Tempo gasto em operações do kernel.

---

### Process CPU

CPU consumida por um processo específico.

---

### Thread CPU

CPU consumida por uma thread específica.

---

### Load average

Métrica de carga do sistema relacionada a tarefas executáveis ou aguardando recursos, com semântica dependente do sistema operacional.

---

### Run queue

Conjunto de threads prontas para executar aguardando CPU.

---

### Throttling

Redução forçada de CPU quando um container ultrapassa sua quota.

---

### Steal time

Tempo em que uma máquina virtual aguarda CPU porque o hypervisor está atendendo outro workload.

---

### Hot thread

Thread responsável por parcela relevante do consumo de CPU.

---

### Hot method

Método que aparece com frequência relevante nas amostras de CPU.

---

### Sampling profiler

Profiler que coleta stacks periodicamente para estimar onde a CPU é utilizada.

---

### Flame graph

Visualização agregada de stacks amostradas, em que a largura representa frequência relativa.

---

### Busy loop

Loop que executa continuamente sem espera ou trabalho útil proporcional.

---

### Spin loop

Loop que aguarda uma condição consumindo CPU ativamente.

---

### CPU regression

Aumento de CPU para o mesmo workload após uma mudança.

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

- aula 597 validada;
- zero processos residuais;
- heap dumps fora do Git;
- Java 21 ativo;
- JFR disponível;
- processo filho pode ser encerrado;
- workload sintético definido.

---

### 2. Criar contrato

Arquivo:

```text
cpu-high-contract.yaml
```

Conteúdo:

```yaml
cpuHigh:
  required:
    - scenario
    - owner
    - workload
    - capacity
    - baseline
    - processCPU
    - threadCPU
    - stackSamples
    - profiler
    - hotMethod
    - fix
    - regression
    - recovery
    - shutdown

  intentionalHighCPU:
    childProcess:
      required

  evidence:
    rawProfileInRepository:
      forbidden

  conclusion:
    highCPUAloneIdentifiesCause:
      false

  nextLesson:
    code:
      M18.44
```

---

### 3. Criar catálogo

Arquivo:

```text
cpu-high-scenario-catalog.yaml
```

Exemplo:

```yaml
scenarios:
  - id:
      BUSY-SPIN

    type:
      busy-loop

    expectedHotMethod:
      BusySpinScenario.run

    isolation:
      child-process

  - id:
      REGEX-BACKTRACKING

    type:
      regex

    expectedHotMethod:
      java.util.regex.Pattern

    data:
      synthetic

  - id:
      GC-PRESSURE

    type:
      allocation

    expectedCategory:
      GC-and-allocation
```

---

### 4. Criar policy de baseline

Arquivo:

```text
cpu-high-baseline-policy.yaml
```

Conteúdo:

```yaml
baseline:
  same:
    - Java-version
    - JVM-flags
    - CPU-limit
    - CPU-request
    - workload
    - concurrency
    - duration
    - warmup

  collect:
    - process-CPU
    - system-CPU
    - user-CPU
    - throttling
    - throughput
    - p95
    - p99
    - GC-CPU
    - context-switches

  repeatedWindows:
    required
```

---

### 5. Criar snapshot

```java
public record CpuSnapshot(
        Instant capturedAt,
        double processCpuLoad,
        double systemCpuLoad,
        long processCpuTimeNanos,
        long completedOperations,
        double throughput,
        Duration p95,
        Duration p99) {
}
```

Métricas do sistema operacional e container complementam a JVM.

---

### 6. Criar snapshot por thread

```java
public record ThreadCpuSnapshot(
        long threadId,
        String threadNameCategory,
        Thread.State state,
        long cpuTimeNanos,
        long userTimeNanos) {
}
```

IDs podem existir apenas durante a análise local.

Não os use como labels persistentes.

---

### 7. Criar policy de capacidade

Arquivo:

```text
cpu-high-capacity-policy.yaml
```

Conteúdo:

```yaml
capacity:
  identify:
    - host-cores
    - container-request
    - container-limit
    - JVM-active-processor-count

  container:
    throttling:
      required

  interpretation:
    processPercentMustConsiderCoreCount:
      true

  hostFreeDoesNotProveContainerFree:
    true

  autoscaling:
    notRootCauseAnalysis:
      true
```

---

### 8. Entender percentuais

Em ferramentas diferentes:

```text
100% CPU
```

pode significar:

- um core totalmente ocupado;
- todos os cores ocupados;
- quota total do container;
- processo relativo ao host;
- valor normalizado por core.

Sempre documente a semântica da métrica.

---

### 9. Verificar processadores percebidos

No Java:

```java
int processors =
        Runtime.getRuntime()
                .availableProcessors();
```

No diagnóstico, compare cores do host, quota do container, `-XX:ActiveProcessorCount`, versão do JDK e ergonomics da JVM.

---

### 10. Criar processo filho

```java
public final class CpuHighChildMain {

    public static void main(
            String[] arguments)
            throws Exception {

        CpuScenarioType type =
                CpuScenarioType.valueOf(
                        arguments[0]);

        CpuScenario scenario =
                CpuScenarioFactory.create(type);

        System.out.println(
                "CPU_SCENARIO_STARTED");

        scenario.run(
                Duration.ofSeconds(30));

        System.out.println(
                "CPU_SCENARIO_FINISHED");
    }
}
```

O parent aplica timeout e coleta evidências durante a execução.

---

### 11. Criar cenário matemático

```java
public final class MathLoopScenario
        implements CpuScenario {

    private volatile double result;

    @Override
    public void run(
            Duration duration) {

        long deadline =
                System.nanoTime()
                + duration.toNanos();

        double accumulator = 0;

        while (System.nanoTime()
                < deadline) {

            for (int index = 1;
                    index <= 10_000;
                    index++) {

                accumulator +=
                        Math.sqrt(index)
                        * Math.log(index);
            }
        }

        result = accumulator;
    }
}
```

Esse cenário produz CPU útil e previsível.

---

### 12. Criar busy spin

```java
public final class BusySpinScenario
        implements CpuScenario {

    private final AtomicBoolean running =
            new AtomicBoolean(true);

    @Override
    public void run(
            Duration duration) {

        long deadline =
                System.nanoTime()
                + duration.toNanos();

        while (running.get()
                && System.nanoTime()
                        < deadline) {
            Thread.onSpinWait();
        }
    }

    public void stop() {
        running.set(false);
    }
}
```

O loop consome CPU sem produzir trabalho proporcional.

---

### 13. Corrigir busy spin

Corrija busy spin com fila, condition, latch, semaphore, park, callback, evento ou polling bounded, conforme o contrato de wake-up e latência.

---

### 14. Criar cenário de polling

```java
public final class PollingScenario
        implements CpuScenario {

    private final Supplier<Boolean> ready;

    @Override
    public void run(
            Duration duration) {

        long deadline =
                System.nanoTime()
                + duration.toNanos();

        while (System.nanoTime()
                < deadline) {

            if (ready.get()) {
                process();
            }
        }
    }
}
```

Sem espera, polling agressivo consome CPU mesmo sem trabalho.

---

### 15. Corrigir polling

Exemplo:

```java
while (!Thread.currentThread()
        .isInterrupted()) {

    WorkItem item =
            queue.poll(
                    100,
                    TimeUnit.MILLISECONDS);

    if (item != null) {
        process(item);
    }
}
```

A correção reduz CPU e preserva cancelamento.

---

### 16. Criar cenário de regex

```java
public final class RegexScenario
        implements CpuScenario {

    private static final Pattern PATTERN =
            Pattern.compile(
                    "(a+)+$");

    public boolean matches(
            String input) {
        return PATTERN.matcher(input)
                .matches();
    }
}
```

Entradas sintéticas específicas podem causar backtracking intenso.

Não use conteúdo externo não confiável sem limites.

---

### 17. Corrigir regex

Corrija regex simplificando a expressão, evitando quantificadores aninhados, limitando entrada, usando parser ou engine apropriada e criando testes de pior caso.

A correção precisa preservar a regra funcional.

---

### 18. Criar cenário de serialização

```java
public final class SerializationScenario
        implements CpuScenario {

    private final ObjectMapper mapper;

    public byte[] serializeRepeatedly(
            SyntheticPayload payload,
            int repetitions)
            throws JsonProcessingException {

        byte[] result = null;

        for (int index = 0;
                index < repetitions;
                index++) {
            result =
                    mapper.writeValueAsBytes(
                            payload);
        }

        return result;
    }
}
```

Serializar o mesmo objeto repetidamente pode desperdiçar CPU.

---

### 19. Corrigir serialização

Na serialização, avalie reutilização, payload menor, menos conversões, streaming, configuração do mapper e compressão medida separadamente.

---

### 20. Criar cenário de logging

```java
public final class LoggingScenario
        implements CpuScenario {

    public void process(
            List<SyntheticItem> items) {

        for (SyntheticItem item : items) {
            logger.info(
                    "Processing item {}",
                    item.category());
        }
    }
}
```

Mesmo com logging assíncrono, formatação, enqueue, serialização e I/O possuem custo.

---

### 21. Corrigir logging

No logging, use nível adequado, sampling, agregação, métricas, transições relevantes, tamanho limitado, cardinalidade controlada e appenders revisados.

Não remova observabilidade necessária; reduza desperdício.

---

### 22. Criar cenário de contenção

Múltiplas threads executam uma critical section longa:

```java
synchronized (monitor) {
    expensiveComputation();
}
```

CPU pode ficar concentrada em uma thread, enquanto outras ficam `BLOCKED`.

O throughput cai mesmo sem todos os cores ocupados.

---

### 23. Corrigir contenção

Na contenção, mova computação para fora do lock, reduza estado compartilhado, particione, use snapshots, elimine logging interno e meça hold time.

---

### 24. Criar cenário de GC pressure

```java
public final class GcPressureScenario
        implements CpuScenario {

    @Override
    public void run(
            Duration duration) {

        long deadline =
                System.nanoTime()
                + duration.toNanos();

        while (System.nanoTime()
                < deadline) {

            List<byte[]> values =
                    new ArrayList<>();

            for (int index = 0;
                    index < 1_000;
                    index++) {
                values.add(
                        new byte[8 * 1024]);
            }
        }
    }
}
```

Esse cenário produz allocation alta e CPU de GC.

---

### 25. Diferenciar CPU de aplicação e GC

Observe process CPU, GC pause e CPU, allocation, promotion, heap after GC, throughput e amostras JFR.

Se GC CPU cresce devido à alocação, o hot path pode estar no código que cria objetos.

---

### 26. Criar policy de GC CPU

Arquivo:

```text
cpu-high-gc-policy.yaml
```

Conteúdo:

```yaml
GC:
  correlate:
    - process-CPU
    - allocation-rate
    - promotion-rate
    - pause-time
    - concurrent-cycle-time
    - heap-after-GC

  highGCCPU:
    investigateAllocationSource:
      required

  collectorChange:
    notFirstAction:
      true

  memoryLeak:
    useLesson597Evidence:
      requiredWhenSuspected
```

---

### 27. Coletar CPU do processo

Script:

```text
collect-process-cpu.ps1
```

No Windows, use contadores do processo.

Em Linux, use `pidstat`, `top`, `ps`, `procfs` e métricas de cgroup.

No container, correlacione usage, quota, throttling, request e limit.

---

### 28. Coletar CPU por thread

Script:

```text
collect-thread-cpu.ps1
```

Com `ThreadMXBean`:

```java
ThreadMXBean bean =
        ManagementFactory
                .getThreadMXBean();

if (bean.isThreadCpuTimeSupported()
        && !bean.isThreadCpuTimeEnabled()) {
    bean.setThreadCpuTimeEnabled(true);
}
```

Depois:

```java
long cpuNanos =
        bean.getThreadCpuTime(
                threadId);
```

Colete deltas, não apenas valores absolutos.

---

### 29. Criar policy de thread CPU

Arquivo:

```text
cpu-high-thread-policy.yaml
```

Conteúdo:

```yaml
threadCPU:
  support:
    verify:
      required

  sampling:
    repeated:
      required

  rank:
    byDelta:
      required

  threadId:
    persistentMetricLabel:
      forbidden

  correlate:
    - thread-name-category
    - state
    - stack
    - scenario
```

---

### 30. Mapear native thread ID

Em ferramentas do sistema operacional, a thread aparece por ID nativo.

No thread dump Java, o `nid` costuma ser exibido em hexadecimal.

Fluxo conceitual:

1. identificar hot thread no SO;
2. obter ID nativo decimal;
3. converter para hexadecimal;
4. localizar `nid=0x...` no dump;
5. ler stack;
6. confirmar em várias amostras.

Script:

```text
map-native-thread-id.ps1
```

---

### 31. Coletar múltiplos thread dumps

Script:

```text
collect-cpu-thread-dumps.ps1
```

Colete ao menos três dumps separados por intervalo curto:

```powershell
jcmd `
  $processId `
  Thread.print `
  -l
```

A mesma stack aparecendo repetidamente na hot thread é sinal forte.

Um dump único pode capturar momento irrelevante.

---

### 32. Criar policy de sampling

Arquivo:

```text
cpu-high-sampling-policy.yaml
```

Conteúdo:

```yaml
sampling:
  threadDumps:
    minimum:
      3

    interval:
      explicit

  hotThread:
    repeatedStack:
      strongSignal

  singleDump:
    insufficient

  workload:
    stableDuringCollection:
      required

  duration:
    bounded:
      required
```

---

### 33. Interpretar stacks

Nas stacks, procure métodos repetidos, regex, serialização, compressão, logging, coleções, locks, spin, loops, GC, class loading, JIT, JNI e instrumentação.

A stack mostra onde a thread estava, não toda a causa.

---

### 34. Coletar JFR

Script:

```text
collect-cpu-jfr.ps1
```

Exemplo:

```powershell
jcmd `
  $processId `
  JFR.start `
  name=cpu-high `
  settings=profile `
  duration=30s `
  filename=.tmp/cpu-high/cpu-high.jfr
```

No JFR, analise execution samples, thread CPU, allocation, GC, monitor enter, park, I/O, exceptions e class loading.

---

### 35. Criar policy de JFR

Arquivo:

```text
cpu-high-jfr-policy.yaml
```

Conteúdo:

```yaml
JFR:
  profile:
    duration:
      bounded

  collect:
    - execution-samples
    - thread-CPU
    - allocation
    - GC
    - monitor-contention

  rawFile:
    repository:
      forbidden

  sanitizeReport:
    required

  production:
    overheadAssessment:
      required
```

---

### 36. Usar async-profiler

Script:

```text
collect-async-profiler.ps1
```

Em ambiente compatível:

```text
profiler
  -e cpu
  -d 30
  -f cpu.html
  PID
```

O profiler usa sampling e pode produzir flame graph interativo.

Valide sistema operacional, arquitetura, permissões, container, kernel e JVM.

---

### 37. Criar policy do profiler

Arquivo:

```text
cpu-high-profiler-policy.yaml
```

Conteúdo:

```yaml
profiler:
  mode:
    CPU

  duration:
    bounded

  attach:
    authorization:
      required

  overhead:
    assess:
      required

  output:
    raw:
      repository:
        forbidden

    sanitizedSummary:
      required

  unsupportedEnvironment:
    fallback:
      JFR-and-thread-dumps
```

---

### 38. Entender flame graph

No flame graph:

- eixo horizontal não é tempo cronológico;
- largura representa frequência de amostra;
- eixo vertical representa profundidade da stack;
- blocos largos merecem investigação;
- método folha pode ser consequência do caller;
- compare before e after com mesmo workload.

Não corrija sem entender o fluxo.

---

### 39. Criar relatório de hot methods

Arquivo:

```text
cpu-flamegraph-report.yaml
```

Exemplo:

```yaml
hotMethods:
  - category:
      busy-spin-loop

    sampleShareCategory:
      dominant

    stack:
      - child-main
      - busy-spin-scenario
      - on-spin-wait

    expected:
      false

    owner:
      polling-component
```

Não registre dados de negócio.

---

### 40. Analisar JIT

CPU alta temporária no warmup pode incluir compilação JIT.

Observe code cache, compilação, tiers, deoptimization e duração do warmup.

Baseline e regressão separam warmup da medição.

---

### 41. Diferenciar user e system CPU

User CPU alta sugere:

- código Java;
- bibliotecas;
- JIT;
- GC;
- parsing;
- loops.

System CPU alta sugere:

- chamadas de sistema;
- I/O;
- rede;
- filesystem;
- context switches;
- kernel;
- native libraries.

A classificação orienta a investigação.

---

### 42. Diferenciar utilization e saturation

CPU utilization alta sem run queue relevante pode representar uso eficiente.

CPU utilization alta com run queue crescente, throttling e latência crescente indica saturação.

Quota ou throttling podem causar saturação abaixo de 100% observado.

---

### 43. Criar policy de observabilidade

Arquivo:

```text
cpu-high-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  host:
    required:
      - CPU-utilization
      - load-average
      - run-queue
      - steal-time

  container:
    required:
      - CPU-usage
      - CPU-limit
      - CPU-request
      - throttled-periods
      - throttled-seconds

  JVM:
    required:
      - process-CPU
      - thread-CPU-category
      - GC-CPU
      - live-thread-count
      - compilation-category

  application:
    required:
      - throughput
      - p95
      - p99
      - error-rate

  labels:
    forbidden:
      - thread-id
      - request-id
      - customer-id
      - raw-stack
```

---

### 44. Correlacionar sinais

Cenário A:

```text
CPU:
90%.

throughput:
subiu proporcionalmente.

p99:
estável.

errors:
estáveis.
```

Hipótese:

```text
trabalho útil,
capacidade próxima do limite.
```

Cenário B:

```text
CPU:
90%.

throughput:
igual.

p99:
subindo.

hot thread:
busy loop.
```

Hipótese:

```text
desperdício.
```

Cenário C:

```text
CPU do container:
moderada.

throttling:
alto.

latência:
alta.
```

Hipótese:

```text
quota insuficiente
ou configuração inadequada.
```

---

### 45. Criar policy de contenção

Arquivo:

```text
cpu-high-contention-policy.yaml
```

Conteúdo:

```yaml
contention:
  observe:
    - blocked-thread-count
    - monitor-enter
    - lock-wait
    - hold-time
    - context-switches
    - throughput

  highCPUWithBlockedThreads:
    identifyOwner:
      required

  spinLock:
    review:
      required

  lockRemovalWithoutInvariantReview:
    forbidden
```

---

### 46. Corrigir hot method

A correção depende da categoria: bloquear loops, reescrever regex, reduzir serialização e logging, diminuir allocation, encurtar critical sections, substituir polling e limitar retries.

A correção precisa preservar funcionalidade.

---

### 47. Criar policy de fix

Arquivo:

```text
cpu-high-fix-policy.yaml
```

Conteúdo:

```yaml
fix:
  rootCause:
    required

  preserve:
    - functionality
    - throughput
    - correctness
    - observability

  avoid:
    - add-more-CPU-as-only-fix
    - restart-as-only-fix
    - remove-lock-without-invariant-review
    - disable-GC-observability
    - remove-all-logs

  validate:
    - process-CPU
    - hot-method-share
    - throughput
    - p95
    - p99
    - errors
```

---

### 48. Entender quando aumentar CPU ajuda

Aumentar CPU pode ser correto quando a carga cresceu, o trabalho é útil, não há loop desperdiçado, throughput escala com cores e o SLO exige capacidade.

Dimensionamento não substitui causa raiz.

---

### 49. Criar regressão

Arquivo:

```text
cpu-high-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    sameWorkload:
      required

    sameCPUQuota:
      required

    sameJava:
      required

    sameDuration:
      required

    sameWarmup:
      required

  pass:
    CPUPerOperation:
      withinBound

    throughput:
      notWorseThanThreshold

    p99:
      withinBound

    hotMethodShare:
      reducedWhenTargeted

    zeroResidualProcess:
      required
```

---

### 50. Calcular CPU por operação

Uma métrica útil:

```text
CPU time
dividido por
operações concluídas.
```

Exemplo:

```text
antes:
40 segundos de CPU
para 10.000 operações.

depois:
24 segundos de CPU
para 10.000 operações.
```

Redução:

```text
4 ms
para
2,4 ms de CPU
por operação.
```

Compare com a mesma carga.

---

### 51. Criar runbook

Arquivo:

```text
CPU_HIGH_RECOVERY_RUNBOOK.md
```

O runbook confirma impacto, capacidade, release e workload; coleta CPU, throughput, hot threads, dumps, JFR e profile; classifica aplicação, GC, JIT, contenção ou sistema; recupera a instância; corrige; repete a carga; valida CPU por operação e elimina artefatos brutos.

---

### 52. Criar policy de shutdown

Arquivo:

```text
cpu-high-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewWork:
    required

  childProcess:
    timeout:
      required

  hotLoop:
    cooperativeStop:
      required

  profiler:
    stop:
      required

  JFR:
    dumpAndClose:
      required

  executor:
    terminate:
      required

  residualProcess:
    forbidden
```

---

### 53. Criar data quality policy

Arquivo:

```text
cpu-high-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingCPUQuota:
    result:
      inconclusive

  singleThreadDump:
    result:
      limited

  noWarmupSeparation:
    result:
      invalid-comparison

  differentWorkload:
    result:
      invalid-comparison

  missingThroughput:
    result:
      limited

  CPUPercentUnknownSemantic:
    action:
      block-conclusion

  shortProfile:
    result:
      limited
```

---

### 54. Criar security policy

Arquivo:

```text
cpu-high-security-policy.yaml
```

Conteúdo:

```yaml
security:
  threadDump:
    raw:
      repository:
        forbidden

  JFR:
    raw:
      repository:
        forbidden

  flameGraph:
    businessData:
      forbidden

  commandLine:
    credentials:
      forbidden

  evidence:
    threadId:
      forbidden

    rawStack:
      forbidden
```

---

### 55. Criar failure policy

Arquivo:

```text
cpu-high-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  intentionalHighCPUInMainProcess:
    action:
      fail-review

  residualChildProcess:
    action:
      fail-gate

  profilerWithoutAuthorization:
    action:
      reject

  highCPUWithoutCapacityContext:
    result:
      inconclusive

  restartOnly:
    action:
      reject-fix

  databaseSlow:
    deferredToLesson599
```

---

### 56. Criar cenários oficiais

Arquivo:

```text
cpu-high-scenarios.yaml
```

Cenários:

```text
idle-baseline;

useful-math-load;

busy-spin;

bounded-wait-fix;

aggressive-polling;

blocking-poll-fix;

regex-backtracking;

regex-fix;

repeated-serialization;

serialization-reuse;

logging-volume;

logging-sampling;

long-critical-section;

reduced-critical-section;

GC-pressure;

allocation-reduction;

container-throttling-model;

JIT-warmup;

thread-CPU-ranking;

three-thread-dump-sampling;

JFR-hot-method;

async-profiler-hot-method;

CPU-regression;

shutdown-cooperative-stop;

zero-residual-process.
```

Cada cenário registra workload, capacidade, process CPU, thread, stack, hot method, throughput, latência, fix, shutdown, resultado e evidence.

---

### 57. Criar baseline report

Arquivo:

```text
cpu-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  Java:
    version:
      21

  workload:
    synthetic:
      true

  CPU:
    limit:
      recorded

    request:
      recorded

  warmup:
    separated:
      true

  process:
    residual:
      zero

  result:
    PASS
```

---

### 58. Criar matriz de testes

Arquivo:

```text
CPU_HIGH_TEST_MATRIX.md
```

Cenários:

- host CPU;
- container CPU;
- quota;
- throttling;
- process CPU;
- user CPU;
- system CPU;
- thread CPU;
- native thread mapping;
- three dumps;
- repeated stack;
- JFR;
- profiler;
- flame graph;
- busy spin;
- polling;
- regex;
- serialization;
- logging;
- contention;
- GC pressure;
- JIT warmup;
- CPU per operation;
- regression;
- shutdown;
- residual process;
- security;
- evidence.

---

### 59. Criar troubleshooting

Arquivo:

```text
CPU_HIGH_TROUBLESHOOTING.md
```

Inclua:

- CPU parece alta, mas throughput também subiu;
- host livre e container throttled;
- percentual muda entre ferramentas;
- `ThreadMXBean` não habilita CPU time;
- hot thread não aparece no dump;
- native ID não corresponde;
- dumps mostram stacks diferentes;
- JFR não inicia;
- async-profiler sem permissão;
- flame graph vazio;
- regex só falha com entrada específica;
- GC usa CPU alta;
- logging domina profile;
- JIT aparece no warmup;
- processo filho não encerra;
- banco lento começa a dominar a investigação;
- material da aula 599 antecipado.

---

### 60. Criar gate

O gate valida:

- contrato;
- catálogo;
- baseline;
- capacidade;
- processo filho;
- CPU de processo;
- CPU por thread;
- thread dumps;
- native thread mapping;
- JFR;
- profiler;
- flame graph;
- hot methods;
- GC;
- contenção;
- fix;
- regressão;
- shutdown;
- zero processos residuais;
- segurança.

Status:

```text
PASS;

FAIL_BASELINE;

FAIL_CAPACITY_CONTEXT;

FAIL_ISOLATION;

FAIL_THREAD_MAPPING;

FAIL_SAMPLING;

FAIL_PROFILER;

FAIL_ROOT_CAUSE;

FAIL_FIX;

FAIL_REGRESSION;

FAIL_SHUTDOWN;

FAIL_RESIDUAL_PROCESS;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 61. Coletar evidence

Script:

```text
collect-cpu-high-evidence.ps1
```

Arquivo:

```text
cpu-high-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- scenario category;
- CPU capacity category;
- process CPU category;
- system CPU category;
- thread category;
- stack category;
- hot method category;
- GC CPU category;
- throttling category;
- throughput category;
- latency category;
- fix status;
- regression status;
- shutdown status;
- residual process status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- thread ID;
- native thread ID;
- PID persistido;
- request ID;
- customer ID;
- payload;
- raw stack;
- JFR bruto;
- profile bruto;
- SQL;
- plano de execução;
- material da aula 599.

---

### 62. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\cpu-high\validate-cpu-high-contract.ps1

.\scripts\performance\cpu-high\validate-cpu-high-scenarios.ps1

.\scripts\performance\cpu-high\build-cpu-high-child.ps1

.\scripts\performance\cpu-high\run-cpu-high-baseline.ps1

.\scripts\performance\cpu-high\run-math-loop-scenario.ps1

.\scripts\performance\cpu-high\run-busy-spin-scenario.ps1

.\scripts\performance\cpu-high\run-regex-scenario.ps1

.\scripts\performance\cpu-high\run-serialization-scenario.ps1

.\scripts\performance\cpu-high\run-logging-scenario.ps1

.\scripts\performance\cpu-high\run-contention-scenario.ps1

.\scripts\performance\cpu-high\run-gc-pressure-scenario.ps1

.\scripts\performance\cpu-high\run-polling-scenario.ps1

.\scripts\performance\cpu-high\collect-process-cpu.ps1

.\scripts\performance\cpu-high\collect-thread-cpu.ps1

.\scripts\performance\cpu-high\collect-cpu-thread-dumps.ps1

.\scripts\performance\cpu-high\map-native-thread-id.ps1

.\scripts\performance\cpu-high\collect-cpu-jfr.ps1

.\scripts\performance\cpu-high\collect-async-profiler.ps1

.\scripts\performance\cpu-high\generate-cpu-flamegraph.ps1

.\scripts\performance\cpu-high\analyze-hot-methods.ps1

.\scripts\performance\cpu-high\validate-cpu-high-fix.ps1

.\scripts\performance\cpu-high\validate-cpu-high-regression.ps1

.\scripts\performance\cpu-high\validate-cpu-high-shutdown.ps1

.\scripts\performance\cpu-high\kill-residual-cpu-process.ps1

.\scripts\performance\cpu-high\scan-cpu-output.ps1

.\scripts\performance\cpu-high\collect-cpu-high-evidence.ps1

.\scripts\performance\cpu-high\verify-cpu-high-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- baseline aprovada;
- capacidade registrada;
- processo filho isolado;
- CPU de processo coletada;
- threads ranqueadas por delta;
- native thread mapping validado;
- três dumps coletados;
- hot stack confirmada;
- JFR coletado;
- profiler executado quando suportado;
- flame graph analisado;
- hot method identificado;
- GC CPU correlacionada;
- fix aprovado;
- regressão aprovada;
- shutdown aprovado;
- zero processos residuais;
- segurança aprovada;
- evidence sanitizada;
- banco lento não antecipado.

---

### 63. Encerrar o laboratório

Confirme processo, loop, profiler, JFR e executors encerrados, zero PIDs residuais, artefatos brutos fora do Git e baseline preservada.

Execute:

```powershell
.\scripts\performance\cpu-high\kill-residual-cpu-process.ps1

Remove-Item `
  .tmp/cpu-high `
  -Recurse `
  -Force
```

---

## Entendendo o que foi feito

### CPU alta ganhou contexto

Percentual isolado deixou de ser interpretado sem cores, quota e throttling.

### Processo ganhou decomposição

User, system, GC e thread CPU passaram a ser separados.

### Hot thread ganhou evidência

Ranking por delta e native thread mapping conectaram SO e JVM.

### Thread dump ganhou repetição

Três amostras reduziram o risco de interpretar um momento aleatório.

### JFR ganhou dimensão temporal

CPU, allocation, GC e contenção passaram a ser correlacionados.

### Flame graph ganhou visualização

Stacks frequentes revelaram caminhos dominantes de execução.

### Busy loop ganhou correção

Espera ativa foi substituída por bloqueio ou sinalização apropriada.

### GC CPU ganhou origem

Allocation hot paths passaram a ser investigados, não apenas o collector.

### Regressão ganhou unidade

CPU por operação passou a complementar CPU percentual.

### A próxima aula ganhou fronteira

A aula 599 irá aprofundar diagnóstico de banco lento.

---

## Erros comuns importantes

### Tratar 100% como semântica universal

Ferramentas normalizam CPU de formas diferentes.

### Ignorar quota do container

O host pode ter CPU livre enquanto o container sofre throttling.

### Coletar apenas um thread dump

A stack pode não representar o hot path.

### Reiniciar antes da evidence

A causa desaparece com o processo.

### Culpar método folha

O caller pode ser o verdadeiro owner do trabalho repetido.

### Remover lock sem revisar invariante

A correção de CPU pode criar race condition.

### Trocar collector primeiro

GC CPU pode ser efeito de allocation excessiva.

### Aumentar CPU sem investigar

Capacidade adicional pode apenas esconder desperdício.

### Comparar workloads diferentes

A regressão fica inválida.

### Versionar JFR ou profile bruto

Esses artefatos podem conter dados sensíveis.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\performance\cpu-high\run-cpu-high-baseline.ps1
```

### Coletar thread CPU

```powershell
.\scripts\performance\cpu-high\collect-thread-cpu.ps1
```

### Coletar três dumps

```powershell
.\scripts\performance\cpu-high\collect-cpu-thread-dumps.ps1
```

### Coletar JFR

```powershell
.\scripts\performance\cpu-high\collect-cpu-jfr.ps1
```

### Validar regressão

```powershell
.\scripts\performance\cpu-high\validate-cpu-high-regression.ps1
```

---

## Exercício guiado

### Parte 1 — Capacidade

Registre host, container, request, limit e throttling.

### Parte 2 — Baseline

Separe warmup e medição.

### Parte 3 — Processo

Colete user, system e process CPU.

### Parte 4 — Thread

Ranqueie threads por delta.

### Parte 5 — Dumps

Colete três stacks.

### Parte 6 — JFR

Correlacione CPU, allocation, GC e locks.

### Parte 7 — Profiler

Gere flame graph.

### Parte 8 — Root cause

Classifique loop, regex, logging, serialização, GC ou contenção.

### Parte 9 — Fix

Preserve funcionalidade e throughput.

### Parte 10 — Gate

Valide regressão, cleanup, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 597 e ponte para a aula 599 foram preservadas;
- utilization, saturation, user, system, process e thread CPU, throttling, hot threads, hot methods, sampling e flame graphs foram definidos;
- contrato, catálogo, baseline e policies foram criados;
- cenários executam apenas em processo filho bounded;
- host, container, request, limit, quota e throttling foram registrados;
- workload, warmup, duração, JVM e semântica do percentual são comparáveis;
- CPU de processo e thread foram coletadas e ranqueadas por delta;
- native thread ID foi correlacionado ao `nid`;
- três dumps confirmaram hot stacks recorrentes;
- JFR, async-profiler e flame graph foram analisados;
- busy spin, polling, regex, serialização, logging, contenção e GC pressure foram reproduzidos;
- correções preservam funcionalidade, throughput e invariantes;
- user e system CPU, utilization e saturation foram diferenciadas;
- GC CPU foi correlacionada a allocation;
- CPU por operação foi calculada;
- regressão usa mesma carga e quota;
- shutdown encerra loops, profiler, JFR, executors e processo filho;
- zero processos residuais foram validados;
- matriz, troubleshooting, gate, segurança e evidence estão presentes;
- nenhum raw stack, JFR bruto, profile bruto, PID ou identificador real foi commitado;
- banco lento não foi aprofundado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/cpu-high `
  scripts/performance/cpu-high `
  docs/performance/cpu-high `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|requestId|nativeThreadId|rawStack|rawJfr|rawProfile|flameGraphRaw|EXPLAIN|pg_stat_activity|pg_stat_statements"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): diagnosticar CPU alta"
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
- thread IDs;
- stacks brutas;
- JFR bruto;
- profiles brutos;
- artifacts temporários;
- plano SQL;
- material da aula 599.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você estruturou diagnóstico de CPU alta com capacidade, threads, stacks e profiling.

Você trabalhou com:

```text
host CPU;

container CPU;

quota;

throttling;

process CPU;

thread CPU;

native thread ID;

thread dumps;

JFR;

async-profiler;

flame graph;

hot methods;

busy loops;

regex;

serialização;

logging;

contenção;

GC CPU;

CPU regression.
```

Você comprovou que CPU alta pode representar trabalho útil ou desperdício; que o percentual depende da semântica e da quantidade de cores; que container throttling pode existir mesmo com host livre; que hot threads precisam ser ranqueadas por delta; que três dumps são melhores que um; que JFR e profilers revelam métodos quentes; que GC CPU frequentemente aponta para allocation; que locks não podem ser removidos sem preservar invariantes; e que CPU por operação é uma métrica importante para regressão.

A próxima aula será:

```text
599 - M18.44 - Banco lento diagnostico
```

Nela, você irá diagnosticar lentidão em PostgreSQL e no acesso JDBC, separar fila de pool, conexão, lock, execução e transferência, usar `pg_stat_activity`, `pg_stat_statements`, `EXPLAIN`, `EXPLAIN ANALYZE`, planos, índices, cardinalidade, vacuum, bloat e criar runbooks de banco lento.

Nenhum plano de execução, `EXPLAIN ANALYZE`, diagnóstico de índice, `pg_stat_activity`, `pg_stat_statements`, vacuum, bloat ou laboratório completo de banco lento foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Registrei quota e throttling.
- [ ] Separei warmup da medição.
- [ ] Coletei CPU por processo e thread.
- [ ] Mapeei native thread ID.
- [ ] Coletei três dumps.
- [ ] Analisei JFR e flame graph.
- [ ] Corrigi hot method.
- [ ] Validei CPU por operação sem processo residual.

---

## Troubleshooting adicional

### CPU alta com throughput alto

Pode ser trabalho útil próximo da capacidade.

### Host livre e container lento

Verifique quota e throttling.

### Hot thread muda entre dumps

O workload pode ser distribuído ou instável.

### `ThreadMXBean` retorna valores inválidos

Confirme suporte e habilitação de thread CPU time.

### JFR mostra GC dominante

Investigue allocation hot paths e live set.

### Profiler não anexa

Revise permissões, kernel, container e compatibilidade.

### Flame graph mostra logging

Revise volume, sampling, layout e appender.

### Regex domina CPU

Teste entradas adversariais e reescreva a expressão.

### Correção reduz CPU e throughput

A otimização pode ter removido trabalho necessário ou criado espera excessiva.

### Banco começa a aparecer como causa

Preserve a investigação aprofundada para a aula 599.

---

## Perguntas de revisão

1. O que é CPU utilization?
2. O que é CPU saturation?
3. Qual diferença entre user e system CPU?
4. O que é process CPU?
5. O que é thread CPU?
6. O que é throttling?
7. O que é steal time?
8. O que é hot thread?
9. O que é hot method?
10. Por que coletar três thread dumps?
11. Como mapear native thread ID?
12. Para que serve JFR?
13. Para que serve async-profiler?
14. Como ler largura em flame graph?
15. O que é busy spin?
16. Como GC pode consumir CPU?
17. O que é CPU por operação?
18. Quando aumentar CPU pode ser correto?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Percentual de tempo executando trabalho.
2. Demanda pronta maior que a capacidade.
3. Código de usuário versus kernel.
4. CPU de um processo.
5. CPU de uma thread.
6. Limitação por quota.
7. Espera causada pelo hypervisor.
8. Thread com consumo relevante.
9. Método frequente nas amostras.
10. Confirmar stack recorrente.
11. Converter ID e localizar `nid`.
12. Correlacionar CPU, stacks, GC e eventos.
13. Sampling de baixo overhead.
14. Frequência relativa de amostras.
15. Loop ativo sem trabalho proporcional.
16. Allocation e collections consomem CPU.
17. Tempo de CPU dividido por operações.
18. Quando o trabalho é útil e escala.
19. Banco lento diagnóstico.
20. Banco lento diagnóstico.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 598 - M18.43 - CPU high diagnostico

- Continuei após Memory leak diagnóstico.
- Diferenciei utilization, saturation, user, system, processo e thread CPU.
- Registrei host, container, quota e throttling.
- Criei baseline e processo filho.
- Reproduzi loops, polling, regex, serialização, logging, contenção e GC pressure.
- Ranqueei hot threads e mapeei native ID para `nid`.
- Coletei três dumps, JFR, async-profiler e flame graph.
- Correlacionei GC CPU com allocation.
- Corrigi hot paths e calculei CPU por operação.
- Validei regressão, shutdown e zero processos residuais.
- Coletei evidence sanitizada.
- Não antecipei banco lento.
- Próxima aula: Banco lento diagnóstico.
```

## Referência técnica curta

- JVM CPU monitoring.
- `ThreadMXBean`.
- Java thread dumps.
- Java Flight Recorder.
- async-profiler.
- Flame graphs.
- Container CPU throttling.
- GC CPU analysis.
- Hot methods.
- CPU regression testing.

Regra final:

```text
CPU alta precisa ser diagnosticada a partir de capacidade, workload e evidência de execução: todo cenário registra cores, request, limit, quota, throttling, versão, warmup, process CPU, user CPU, system CPU, throughput e latência, enquanto threads são ranqueadas por delta, native thread IDs são correlacionados ao nid e pelo menos três thread dumps confirmam stacks recorrentes; JFR, async-profiler e flame graphs identificam hot methods sem transformar uma única amostra em conclusão, e busy loops, polling agressivo, regex, serialização repetitiva, logging excessivo, contenção e GC pressure recebem correções compatíveis com funcionalidade e invariantes; CPU adicional pode ampliar capacidade quando o trabalho é útil, mas restart ou scaling isolado não substituem root cause analysis, regressões usam a mesma carga e quota e medem CPU por operação, e o laboratório termina com zero processos residuais e evidence sanitizada; planos SQL, índices, pg_stat_activity, pg_stat_statements e diagnóstico aprofundado de banco lento ficam para a aula 599.
```
