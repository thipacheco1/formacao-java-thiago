# 597 - M18.42 - Memory leak diagnostico

## Apresentação da aula

Na aula 596, você estruturou timeouts como budgets distribuídos ao longo de uma jornada.

Você trabalhou com:

```text
deadline;

remaining budget;

connect timeout;

acquisition timeout;

JDBC timeout;

Redis timeout;

Kafka timeout;

Future timeout;

retry budget;

cancelamento;

late completion;

shutdown.
```

A conclusão principal foi:

```text
uma espera
precisa terminar

antes que consuma
recursos além
da utilidade da jornada.
```

Nesta aula, o foco muda da duração da espera para a permanência de objetos na memória.

A pergunta central será por que o heap continua crescendo e como provar quem retém os objetos.

Uma aplicação Java cria objetos o tempo inteiro.

Isso não representa automaticamente um problema.

Objetos temporários como requests, DTOs, mensagens, resultados, strings, buffers e estruturas intermediárias são esperados.

O garbage collector identifica objetos que não são mais alcançáveis e recupera sua memória.

Por isso, o primeiro cuidado é diferenciar:

```text
alocação alta;

pressão de memória;

heap pequeno;

GC frequente;

cache legítimo;

backlog temporário;

memory leak.
```

Um **memory leak** ocorre quando objetos que não têm mais utilidade permanecem alcançáveis por alguma cadeia de referências.

A JVM os considera vivos, então o GC não pode removê-los.

O problema é manter objetos antigos alcançáveis sem necessidade.

Exemplo conceitual:

```java
private static final List<byte[]> HISTORY =
        new ArrayList<>();

public void process() {
    HISTORY.add(
            new byte[1024 * 1024]);
}
```

Cada execução adiciona um megabyte à lista estática.

Mesmo depois do método terminar, os arrays continuam alcançáveis por:

```text
GC root;

classe carregada;

campo static;

lista;

array.
```

O heap continua crescendo.

O efeito pode aparecer como old generation crescente, GC frequente, pausas, perda de throughput, tail latency, `OutOfMemoryError`, reinícios e impacto nas outras réplicas.

O fluxo será confirmar tendência, separar heap de memória nativa, reproduzir, coletar histogramas e dump, analisar roots, corrigir lifecycle e validar regressão.

Você trabalhará com heap, generations, live set, allocation e promotion rates, GC roots, shallow e retained heap, dominator tree, histogramas, referências, caches, ThreadLocal, listeners, classloaders, buffers diretos, dumps, JFR, NMT, regressão e runbook.

O laboratório criará leaks sintéticos em um processo Java filho.

Isso protege o ambiente principal.

Os cenários usarão heap pequeno, duração bounded, timeout externo, dados sintéticos, cleanup e nenhum dump versionado.

A próxima aula será:

```text
598 - M18.43 - CPU high diagnostico
```

Por isso, esta aula não irá aprofundar:

- flame graph de CPU;
- hot methods;
- profiling de CPU;
- loops ocupados;
- spin loops;
- thread dump sampling para CPU;
- `top -H`;
- mapeamento de native thread ID;
- async-profiler em modo CPU;
- JFR CPU hotspots;
- diferenciação detalhada entre user CPU e system CPU;
- investigação de CPU steal;
- regressão de CPU.

CPU aparecerá apenas como sinal correlacionado com GC.

A regra central é provar retenção crescente, owner identificável e caminho até GC root.

---

## Onde estamos na formação

A sequência oficial é:

```text
595:
Backpressure conceitual.

596:
Timeouts em producao.

597:
Memory leak diagnostico.

598:
CPU high diagnostico.
```

A progressão é:

```text
controlar pressão;

limitar esperas;

diagnosticar retenção;

diagnosticar consumo de CPU.
```

Nesta aula:

```text
heap:
sim.

GC:
sim.

live set:
sim.

histogram:
sim.

heap dump:
sim.

dominator tree:
sim.

retained heap:
sim.

GC roots:
sim.

ThreadLocal leak:
sim.

cache leak:
sim.

listener leak:
sim.

classloader leak:
sim,
conceitual.

direct buffer:
sim,
diferenciação.

native memory:
sim,
triagem.

CPU profiling:
não aprofundar.
```

Você reutilizará:

- métricas;
- logs;
- JFR;
- `jcmd`;
- scripts PowerShell;
- processos filhos;
- load testing;
- stress testing;
- timeouts;
- shutdown;
- segurança operacional;
- runbooks;
- evidence sanitizada.

O diagnóstico precisa preservar ambiente seguro, dump protegido, processo isolado, baseline equivalente, timestamps, flags, cleanup e zero processos residuais.

---

## Objetivo prático

O laboratório segue em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/memory-leak
├── memory-leak-contract.yaml
├── memory-leak-scenario-catalog.yaml
├── memory-leak-baseline-policy.yaml
├── memory-leak-heap-policy.yaml
├── memory-leak-dump-policy.yaml
├── memory-leak-gc-policy.yaml
├── memory-leak-threadlocal-policy.yaml
├── memory-leak-cache-policy.yaml
├── memory-leak-listener-policy.yaml
├── memory-leak-classloader-policy.yaml
├── memory-leak-native-memory-policy.yaml
├── memory-leak-fix-policy.yaml
├── memory-leak-regression-policy.yaml
├── memory-leak-observability-policy.yaml
├── memory-leak-shutdown-policy.yaml
├── memory-leak-data-quality-policy.yaml
├── memory-leak-security-policy.yaml
├── memory-leak-failure-policy.yaml
├── memory-leak-scenarios.yaml
└── memory-leak-evidence.yaml

performance/memory-leak/src/main/java
└── br/com/formacao/performance/memory
    ├── LeakScenario.java
    ├── LeakScenarioType.java
    ├── LeakProcessResult.java
    ├── MemorySnapshot.java
    ├── ClassHistogramEntry.java
    ├── LeakRunSummary.java
    ├── StaticCollectionLeak.java
    ├── BoundedHistory.java
    ├── ThreadLocalLeak.java
    ├── SafeThreadLocalUsage.java
    ├── ListenerRegistryLeak.java
    ├── SafeListenerRegistry.java
    ├── UnboundedCacheLeak.java
    ├── BoundedCache.java
    ├── ExecutorQueueRetention.java
    ├── DirectBufferScenario.java
    ├── MemoryLeakChildMain.java
    ├── MemoryLeakProcessRunner.java
    └── MemoryLeakDemo.java

performance/memory-leak/src/test/java
└── br/com/formacao/performance/memory
    ├── StaticCollectionLeakTest.java
    ├── BoundedHistoryTest.java
    ├── ThreadLocalLeakTest.java
    ├── SafeThreadLocalUsageTest.java
    ├── ListenerRegistryLeakTest.java
    ├── SafeListenerRegistryTest.java
    ├── UnboundedCacheLeakTest.java
    ├── BoundedCacheTest.java
    ├── MemoryLeakProcessTest.java
    ├── MemoryLeakRegressionTest.java
    ├── MemoryLeakCleanupTest.java
    └── MemoryLeakContractTest.java

performance/memory-leak/reports
├── memory-baseline-report.yaml
├── memory-growth-report.yaml
├── memory-histogram-report.yaml
├── memory-dominator-report.yaml
├── memory-gc-root-report.yaml
├── memory-native-report.yaml
├── memory-fix-report.yaml
└── memory-leak-gate-report.yaml

scripts/performance/memory-leak
├── validate-memory-leak-contract.ps1
├── validate-memory-leak-scenarios.ps1
├── build-memory-leak-child.ps1
├── run-memory-leak-baseline.ps1
├── run-static-collection-leak.ps1
├── run-threadlocal-leak.ps1
├── run-listener-leak.ps1
├── run-cache-leak.ps1
├── collect-class-histogram.ps1
├── collect-live-class-histogram.ps1
├── collect-heap-dump.ps1
├── collect-gc-log.ps1
├── collect-memory-jfr.ps1
├── collect-native-memory-summary.ps1
├── analyze-memory-growth.ps1
├── analyze-dominator-tree.ps1
├── analyze-path-to-gc-root.ps1
├── validate-memory-leak-fix.ps1
├── validate-memory-leak-regression.ps1
├── validate-memory-leak-shutdown.ps1
├── kill-residual-memory-process.ps1
├── scan-memory-output.ps1
├── collect-memory-leak-evidence.ps1
└── verify-memory-leak-baseline.ps1

docs/performance/memory-leak
├── MEMORY_LEAK_OVERVIEW.md
├── HEAP_AND_LIVE_SET.md
├── GC_ROOTS_GUIDE.md
├── CLASS_HISTOGRAM_GUIDE.md
├── HEAP_DUMP_SECURITY.md
├── DOMINATOR_TREE_GUIDE.md
├── THREADLOCAL_LEAK_GUIDE.md
├── CACHE_AND_LISTENER_LEAKS.md
├── CLASSLOADER_AND_NATIVE_MEMORY.md
├── MEMORY_LEAK_RECOVERY_RUNBOOK.md
├── MEMORY_LEAK_TEST_MATRIX.md
└── MEMORY_LEAK_TROUBLESHOOTING.md
```

Ao final, você terá contrato, catálogo, baseline, processo filho, histogramas, dump, dominators, roots, correções, regressão, runbook, gate e evidence sanitizada.

---

## Conceito essencial

### Heap

Área da JVM usada para armazenar objetos gerenciados pelo garbage collector.

---

### Young generation

Região onde muitos objetos novos são inicialmente alocados.

---

### Old generation

Região que armazena objetos que sobreviveram a ciclos de GC ou foram promovidos.

---

### Live set

Conjunto de objetos ainda alcançáveis após uma coleta completa relevante.

---

### Allocation rate

Quantidade de memória alocada por unidade de tempo.

---

### Promotion rate

Quantidade de memória promovida para regiões de vida mais longa.

---

### GC root

Referência inicial considerada viva pela JVM.

Exemplos:

- thread ativa;
- campo static;
- referência JNI;
- monitor;
- classloader;
- variável local ativa.

---

### Shallow heap

Memória ocupada diretamente por um objeto.

---

### Retained heap

Memória que pode ser liberada caso um objeto específico deixe de ser alcançável.

---

### Dominator

Objeto que está presente em todos os caminhos de acesso até determinados objetos retidos.

---

### Dominator tree

Estrutura que organiza objetos por relação de dominância e evidencia grandes retenções.

---

### Path to GC root

Cadeia de referências que explica por que um objeto permanece vivo.

---

### Heap dump

Snapshot dos objetos e referências existentes no heap.

---

### Class histogram

Resumo de quantidade de instâncias e bytes por classe.

---

### Memory pressure

Uso elevado de memória que pode ser temporário e legítimo.

---

### Memory leak

Retenção crescente e desnecessária de objetos alcançáveis.

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

- aula 596 validada;
- zero task leaks;
- zero connection leaks;
- nenhum heap dump antigo no repositório;
- Java 21 ativo;
- espaço em disco disponível;
- processo filho pode ser encerrado;
- dados sintéticos serão usados.

---

### 2. Criar contrato

Arquivo:

```text
memory-leak-contract.yaml
```

Conteúdo:

```yaml
memoryLeak:
  required:
    - scenario
    - owner
    - baseline
    - load-profile
    - heap-limit
    - collection-window
    - histogram
    - dump-policy
    - root-cause
    - fix
    - regression
    - recovery
    - shutdown

  intentionalLeak:
    childProcess:
      required

  evidence:
    rawHeapDumpInRepository:
      forbidden

  conclusion:
    heapHighAloneProvesLeak:
      false

  nextLesson:
    code:
      M18.43
```

---

### 3. Criar catálogo de cenários

Arquivo:

```text
memory-leak-scenario-catalog.yaml
```

Exemplo:

```yaml
scenarios:
  - id:
      STATIC-HISTORY

    type:
      static-collection

    owner:
      memory-lab

    expectedRetainer:
      StaticCollectionLeak.HISTORY

    data:
      synthetic

    isolation:
      child-process

  - id:
      THREADLOCAL-POOL

    type:
      ThreadLocal

    expectedRetainer:
      worker-thread

    cleanup:
      missing-in-unsafe-version
```

---

### 4. Criar policy de baseline

Arquivo:

```text
memory-leak-baseline-policy.yaml
```

Conteúdo:

```yaml
baseline:
  same:
    - Java-version
    - JVM-flags
    - heap-size
    - workload
    - duration
    - warmup
    - environment

  collect:
    - heap-used-after-GC
    - old-generation-used
    - allocation-rate
    - promotion-rate
    - GC-count
    - GC-pause
    - process-RSS

  minimumWindows:
    repeated:
      required
```

---

### 5. Diferenciar allocation de retenção

Cenário A:

```text
allocation rate:
alta.

heap após GC:
estável.
```

Hipótese:

```text
muitos objetos temporários,
sem leak evidente.
```

Cenário B:

```text
allocation rate:
moderada.

heap após GC:
crescendo a cada janela.
```

Hipótese:

```text
retenção crescente.
```

O sinal mais forte é o live set crescente após GCs comparáveis.

---

### 6. Criar snapshot de memória

```java
public record MemorySnapshot(
        Instant capturedAt,
        long heapUsed,
        long heapCommitted,
        long nonHeapUsed,
        long processResidentCategory,
        long completedOperations) {
}
```

No relatório público, evite expor informações sensíveis do processo.

---

### 7. Criar leak de coleção estática

```java
public final class StaticCollectionLeak {

    private static final List<byte[]> HISTORY =
            new ArrayList<>();

    public void addSyntheticPayload(
            int bytes) {

        HISTORY.add(
                new byte[bytes]);
    }

    public int retainedItems() {
        return HISTORY.size();
    }
}
```

A cadeia provável é classloader → Class → campo static → lista → `byte[]`.

---

### 8. Criar versão bounded

```java
public final class BoundedHistory {

    private final ArrayDeque<byte[]> history;
    private final int maximumEntries;

    public BoundedHistory(
            int maximumEntries) {

        if (maximumEntries <= 0) {
            throw new IllegalArgumentException(
                    "Maximum must be positive");
        }

        this.maximumEntries =
                maximumEntries;

        this.history =
                new ArrayDeque<>(
                        maximumEntries);
    }

    public synchronized void add(
            byte[] value) {

        while (history.size()
                >= maximumEntries) {
            history.removeFirst();
        }

        history.addLast(value);
    }

    public synchronized int size() {
        return history.size();
    }
}
```

A correção segue a regra de negócio; histórico completo pertence a armazenamento apropriado, não ao heap ilimitado.

---

### 9. Criar policy de heap

Arquivo:

```text
memory-leak-heap-policy.yaml
```

Conteúdo:

```yaml
heap:
  intentionalScenario:
    maximum:
      explicit

  childProcess:
    Xms:
      fixedForComparison

    Xmx:
      fixedForComparison

  baseline:
    afterComparableGC:
      required

  conclusion:
    use:
      - trend
      - live-set
      - histogram
      - root-path

  forcedGC:
    production:
      forbiddenAsRoutine
```

---

### 10. Criar processo filho

```java
public final class MemoryLeakChildMain {

    public static void main(
            String[] args)
            throws Exception {

        LeakScenarioType type =
                LeakScenarioType.valueOf(
                        args[0]);

        LeakScenario scenario =
                LeakScenarioFactory.create(type);

        System.out.println(
                "MEMORY_SCENARIO_STARTED");

        scenario.run(
                Duration.ofSeconds(30));

        System.out.println(
                "MEMORY_SCENARIO_FINISHED");
    }
}
```

O parent aplica timeout e coleta evidence.

---

### 11. Executar com heap pequeno

Exemplo:

```powershell
java `
  -Xms128m `
  -Xmx128m `
  -XX:+HeapDumpOnOutOfMemoryError `
  -XX:HeapDumpPath=.tmp/memory-leak `
  -Xlog:gc*:file=.tmp/memory-leak/gc.log:time,level,tags `
  -cp `
  target/classes `
  br.com.formacao.performance.memory.MemoryLeakChildMain `
  STATIC_COLLECTION
```

O diretório fica protegido e fora do Git.

---

### 12. Coletar histogram

Script:

```text
collect-class-histogram.ps1
```

Comando:

```powershell
jcmd `
  $processId `
  GC.class_histogram
```

Observe:

- quantidade de instâncias;
- bytes;
- classe;
- variação entre coletas;
- classes dominantes;
- objetos esperados e inesperados.

---

### 13. Coletar histogram live

Script:

```text
collect-live-class-histogram.ps1
```

Exemplo:

```powershell
jmap `
  -histo:live `
  $processId
```

Essa operação pode causar impacto.

Use apenas no laboratório ou em produção com autorização e avaliação de risco.

Não trate `live` como operação gratuita.

---

### 14. Comparar histogramas

Colete:

```text
T0:
após warmup.

T1:
após carga.

T2:
após janela de estabilização.
```

Analise deltas:

```text
instâncias;

bytes;

classe;

taxa de crescimento.
```

Classe crescente pode ser consequência, não raiz.

`byte[]`, `char[]` e `String` frequentemente são conteúdo retido por outro owner.

---

### 15. Criar policy de GC

Arquivo:

```text
memory-leak-gc-policy.yaml
```

Conteúdo:

```yaml
GC:
  collect:
    - heap-after-GC
    - old-generation-after-GC
    - allocation-rate
    - promotion-rate
    - pause
    - frequency

  compare:
    sameCollector:
      required

  fullGC:
    repeatedGrowthAfterComparableCollection:
      strongSignal

  singlePause:
    insufficient

  highAllocation:
    notEqualLeak
```

---

### 16. Ler GC logs

Procure:

- heap before e after;
- old generation;
- frequência;
- pause;
- concurrent cycle;
- promotion;
- allocation stall;
- humongous allocation;
- to-space exhausted;
- full GC;
- reclaimed percentage.

Registre JVM e collector, pois a interpretação depende deles.

---

### 17. Capturar heap dump

Script:

```text
collect-heap-dump.ps1
```

Com `jcmd`:

```powershell
jcmd `
  $processId `
  GC.heap_dump `
  .tmp/memory-leak/heap.hprof
```

Alternativa:

```powershell
jmap `
  -dump:live,format=b,file=.tmp/memory-leak/heap.hprof `
  $processId
```

A coleta pode pausar a aplicação e consumir disco.

---

### 18. Criar policy de dump

Arquivo:

```text
memory-leak-dump-policy.yaml
```

Conteúdo:

```yaml
heapDump:
  authorization:
    required

  disk:
    freeSpaceCheck:
      required

  encryptionAtRest:
    requiredWhenProductionDataPossible

  transfer:
    approvedChannel:
      required

  retention:
    limited:
      required

  repository:
    forbidden

  deletion:
    verified:
      required

  production:
    impactAssessment:
      required
```

Heap dump pode conter tokens, credenciais, payloads, dados pessoais, queries, headers, sessões e mensagens; trate-o como artefato sensível.

---

### 19. Abrir no Eclipse MAT

No MAT, abra o `.hprof`, revise Leak Suspects, Histogram e Dominator Tree, ordene por retained heap, siga Path to GC Roots e valide o owner no código.

---

### 20. Entender shallow heap

Exemplo:

```text
ArrayList:
shallow pequeno.

elementos retidos:
centenas de MB.
```

Um objeto pequeno pode dominar grande subárvore.

Por isso, retained heap costuma ser mais útil para achar owners.

---

### 21. Entender retained heap

Se remover uma referência a um cache libera:

```text
map;

entries;

keys;

values;

byte arrays;
```

o cache possui grande retained heap.

Isso ainda não prova leak.

Ainda verifique se o cache deveria crescer, possui limite, expiração, owner, utilidade e memory budget.

---

### 22. Entender dominator tree

No dominator tree:

```text
objeto A domina B
```

quando todo caminho de GC root até B passa por A.

Grandes dominators ajudam a encontrar:

- mapas;
- listas;
- caches;
- classloaders;
- registries;
- queues;
- thread locals;
- listeners.

---

### 23. Seguir path to GC root

Exemplo:

```text
byte[];

CacheEntry;

ConcurrentHashMap.Node;

ConcurrentHashMap.table;

UnboundedCache.entries;

Spring singleton;

application context;

GC root.
```

O path explica por que o objeto ainda está vivo.

A correção atua no owner ou lifecycle, não no objeto folha.

---

### 24. Criar relatório de dominators

Arquivo:

```text
memory-dominator-report.yaml
```

Campos:

```yaml
dominators:
  - category:
      unbounded-cache

    retainedSizeCategory:
      high

    path:
      - application-context
      - singleton
      - map
      - entry
      - payload

    expected:
      false

    owner:
      cache-component
```

Não registre valores de negócio.

---

### 25. Criar leak de `ThreadLocal`

```java
public final class ThreadLocalLeak {

    private static final ThreadLocal<byte[]>
            CONTEXT =
            new ThreadLocal<>();

    public void process(
            int bytes) {
        CONTEXT.set(
                new byte[bytes]);

        doWork();

        // remove ausente de propósito
    }
}
```

Em worker reutilizado, o valor pode permanecer associado à thread.

---

### 26. Corrigir `ThreadLocal`

```java
public final class SafeThreadLocalUsage {

    private static final ThreadLocal<byte[]>
            CONTEXT =
            new ThreadLocal<>();

    public void process(
            int bytes) {

        try {
            CONTEXT.set(
                    new byte[bytes]);

            doWork();
        } finally {
            CONTEXT.remove();
        }
    }
}
```

Evite armazenar payloads grandes em `ThreadLocal`.

---

### 27. Criar policy de ThreadLocal

Arquivo:

```text
memory-leak-threadlocal-policy.yaml
```

Conteúdo:

```yaml
ThreadLocal:
  set:
    cleanup:
      finally:
        required

  workerPool:
    reuse:
      considered:
        required

  value:
    largeObject:
      forbidden

    credential:
      forbidden

  staticThreadLocal:
    review:
      required

  virtualThreads:
    highCardinalityMemoryImpact:
      measure:
        required
```

---

### 28. Criar listener leak

```java
public final class ListenerRegistryLeak {

    private final List<Runnable> listeners =
            new CopyOnWriteArrayList<>();

    public void register(
            Runnable listener) {
        listeners.add(listener);
    }

    public int size() {
        return listeners.size();
    }
}
```

Se listeners não forem removidos quando o componente termina, o registry retém:

- listener;
- objeto capturado pelo lambda;
- contexto;
- serviço;
- buffers;
- árvore completa de objetos.

---

### 29. Corrigir listener lifecycle

```java
public final class SafeListenerRegistry {

    private final Set<Runnable> listeners =
            ConcurrentHashMap.newKeySet();

    public AutoCloseable register(
            Runnable listener) {

        listeners.add(listener);

        return () ->
                listeners.remove(listener);
    }
}
```

O owner recebe uma handle e o shutdown fecha as inscrições.

---

### 30. Criar policy de listener

Arquivo:

```text
memory-leak-listener-policy.yaml
```

Conteúdo:

```yaml
listener:
  registration:
    owner:
      required

  unsubscribe:
    required

  returnedHandle:
    preferred

  lambdaCapture:
    review:
      required

  shutdown:
    clear:
      required

  registry:
    growthMetric:
      required
```

---

### 31. Criar cache leak

```java
public final class UnboundedCacheLeak {

    private final ConcurrentHashMap<
            String,
            byte[]> entries =
            new ConcurrentHashMap<>();

    public byte[] getOrCreate(
            String key,
            int bytes) {

        return entries.computeIfAbsent(
                key,
                ignored ->
                        new byte[bytes]);
    }
}
```

Sem limite ou expiração, cardinalidade crescente vira retenção.

---

### 32. Corrigir cache

A correção pode usar maximum size ou weight, TTL, eviction, métricas, cache externo, invalidação e controle de cardinalidade.

Exemplo didático:

```java
Cache<String, byte[]> cache =
        Caffeine.newBuilder()
                .maximumSize(1_000)
                .expireAfterAccess(
                        Duration.ofMinutes(5))
                .recordStats()
                .build();
```

O limite segue o memory budget.

---

### 33. Criar policy de cache

Arquivo:

```text
memory-leak-cache-policy.yaml
```

Conteúdo:

```yaml
cache:
  required:
    - owner
    - maximum-size-or-weight
    - expiration
    - eviction
    - cardinality
    - memory-budget
    - metrics
    - invalidation

  unbounded:
    forbidden

  key:
    highCardinality:
      review:
        required

  value:
    large:
      weightBasedLimit:
        preferred
```

---

### 34. Investigar executor queue

Uma fila de executor pode reter tasks, closures, contextos, payloads, Futures, callbacks e serviços.

Mesmo bounded, uma fila grande pode reter muita memória temporariamente.

Diferencie:

```text
backlog esperado;

queue leak;

tasks nunca consumidas;

executor abandonado.
```

---

### 35. Investigar `CompletableFuture`

Pipelines incompletos podem reter stages, valores, callbacks, exceptions, contexto e owners.

Procure:

- future nunca concluída;
- callback registrado indefinidamente;
- mapa de requests pendentes sem timeout;
- completion stage guardada em registry;
- timeout sem remoção do tracking map.

A correção exige término, timeout, cancelamento e remoção.

---

### 36. Investigar classloader leak

Classloader leak aparece em redeploys, plugins, drivers, threads vivas, ThreadLocal, registries, timers, JNI e handlers.

Um classloader retido pode manter todas as classes e statics daquele deployment.

A análise será conceitual.

---

### 37. Criar policy de classloader

Arquivo:

```text
memory-leak-classloader-policy.yaml
```

Conteúdo:

```yaml
classloader:
  redeploy:
    oldLoaderMustBecomeCollectable:
      required

  commonRetainers:
    - thread
    - ThreadLocal
    - static-registry
    - timer
    - driver
    - listener

  report:
    duplicateApplicationClassloaders:
      required

  productionSimulation:
    notRequiredInLesson597
```

---

### 38. Diferenciar heap e memória nativa

Se RSS cresce com heap estável, investigue direct buffers, stacks, metaspace, code cache, JNI, bibliotecas nativas, mmap e accounting do container.

Heap dump não explica memória nativa.

---

### 39. Usar Native Memory Tracking

Inicie processo de laboratório com:

```text
-XX:NativeMemoryTracking=summary
```

Depois:

```powershell
jcmd `
  $processId `
  VM.native_memory `
  summary
```

NMT exige habilitação no startup e possui overhead.

---

### 40. Criar policy de native memory

Arquivo:

```text
memory-leak-native-memory-policy.yaml
```

Conteúdo:

```yaml
nativeMemory:
  compare:
    - heap
    - RSS
    - metaspace
    - thread
    - code
    - GC
    - compiler
    - internal

  NMT:
    startupRequired:
      true

  directBuffer:
    metrics:
      required

  heapDumpExplainsNativeGrowth:
    false
```

---

### 41. Coletar JFR

Script:

```text
collect-memory-jfr.ps1
```

No JFR, observe allocations, GC, heap summary, old object samples, threads, class loading e buffers diretos quando disponíveis.

JFR acrescenta dimensão temporal ao dump.

---

### 42. Criar policy de observabilidade

Arquivo:

```text
memory-leak-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  JVM:
    required:
      - heap-used
      - heap-after-GC
      - old-generation-used
      - allocation-rate
      - promotion-rate
      - GC-count
      - GC-pause
      - live-thread-count
      - class-count

  process:
    required:
      - RSS-category
      - direct-buffer-category
      - open-resource-category

  application:
    required:
      - cache-size
      - registry-size
      - queue-size
      - pending-future-count

  labels:
    forbidden:
      - object-id
      - customer-id
      - request-id
      - class-instance-address
```

---

### 43. Criar gráfico conceitual de leak

A evidência típica mostra:

```text
tempo
→

heap após GC
subindo em degraus;

old gen
subindo;

full GC
recuperando pouco;

latência
crescendo;

restart
derrubando heap;

crescimento
retornando depois.
```

Restart recupera a instância, não a causa.

---

### 44. Criar policy de correção

Arquivo:

```text
memory-leak-fix-policy.yaml
```

Conteúdo:

```yaml
fix:
  identifyOwner:
    required

  removeRetentionCause:
    required

  avoid:
    - forced-GC-as-solution
    - larger-heap-as-only-fix
    - periodic-restart-as-only-fix
    - clear-all-without-contract

  validate:
    - functionality
    - bounded-growth
    - stable-live-set
    - cleanup
    - performance
```

---

### 45. Entender por que aumentar heap não corrige

Aumentar `-Xmx` apenas adia o OOM, esconde o problema, encarece dumps e pode piorar recovery.

Retenção ilimitada também preencherá um heap maior.

---

### 46. Criar regressão

Arquivo:

```text
memory-leak-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    sameWorkload:
      required

    sameHeap:
      required

    sameDuration:
      required

  windows:
    warmup:
      required

    measurement:
      repeated

    stabilization:
      required

  pass:
    liveSetSlope:
      withinBound

    retainedOwner:
      bounded

    registryAndCache:
      bounded

    zeroResidualProcess:
      required
```

---

### 47. Calcular slope conceitual

Colete heap após GC em várias janelas:

```text
T1:
60 MB.

T2:
68 MB.

T3:
76 MB.

T4:
84 MB.
```

Crescimento aproximado:

```text
8 MB por janela.
```

Depois da correção:

```text
T1:
60 MB.

T2:
64 MB.

T3:
63 MB.

T4:
64 MB.
```

A estabilização sugere bounded live set.

Use várias amostras.

---

### 48. Validar fix

Script:

```text
validate-memory-leak-fix.ps1
```

Compare unsafe e fixed:

- mesma JVM;
- mesmo heap;
- mesma carga;
- mesma duração;
- mesmo warmup;
- mesmo collector;
- mesmos pontos de coleta.

Valide:

- live set;
- histogram delta;
- owner count;
- retained heap;
- GC behavior;
- throughput;
- p95;
- shutdown.

---

### 49. Criar runbook

Arquivo:

```text
MEMORY_LEAK_RECOVERY_RUNBOOK.md
```

O runbook confirma tendência e instância, compara heap e RSS, preserva GC metrics, valida disco e autorização, coleta histogramas, dump e JFR, reduz tráfego, recupera a instância, analisa dominators e roots, corrige o owner, cria regressão e exclui artefatos conforme política.

---

### 50. Criar policy de shutdown

Arquivo:

```text
memory-leak-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewAllocation:
    required

  childProcess:
    timeout:
      required

  executor:
    terminate:
      required

  ThreadLocal:
    cleanup:
      required

  listeners:
    unsubscribe:
      required

  caches:
    closeWhenApplicable:
      required

  residualProcess:
    forbidden
```

---

### 51. Criar data quality policy

Arquivo:

```text
memory-leak-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  heapHighWithoutTrend:
    result:
      insufficient

  histogramWithoutDelta:
    result:
      limited

  dumpWithoutBaseline:
    result:
      limited

  differentHeapSizes:
    result:
      invalid-comparison

  differentWorkloads:
    result:
      invalid-comparison

  missingGCContext:
    result:
      inconclusive

  singleSample:
    result:
      insufficient
```

---

### 52. Criar security policy

Arquivo:

```text
memory-leak-security-policy.yaml
```

Conteúdo:

```yaml
security:
  heapDump:
    classification:
      highly-sensitive

    repository:
      forbidden

    transfer:
      approved-channel-only

    retention:
      limited

  histogram:
    classNames:
      review:
        required

  JFR:
    rawFile:
      repository:
        forbidden

  evidence:
    objectAddress:
      forbidden

    businessPayload:
      forbidden
```

---

### 53. Criar failure policy

Arquivo:

```text
memory-leak-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  intentionalLeakInMainProcess:
    action:
      fail-review

  dumpWithoutAuthorization:
    action:
      reject

  residualChildProcess:
    action:
      fail-gate

  unboundedCache:
    action:
      reject-design

  ThreadLocalWithoutCleanup:
    action:
      fail-review

  heapGrowthWithoutRootCause:
    result:
      suspected-only

  CPUHigh:
    deferredToLesson598
```

---

### 54. Criar cenários oficiais

Arquivo:

```text
memory-leak-scenarios.yaml
```

Cenários:

```text
stable-allocation-high-rate;

static-collection-growth;

bounded-history-stable;

ThreadLocal-worker-retention;

ThreadLocal-cleanup;

listener-registration-growth;

listener-unsubscribe;

unbounded-cache-growth;

bounded-cache-eviction;

executor-queue-retention;

pending-CompletableFuture-retention;

classloader-report;

direct-buffer-growth;

heap-stable-RSS-growing;

histogram-delta;

heap-dump-capture;

dominator-analysis;

path-to-GC-root;

fix-comparison;

shutdown-cleanup;

zero-residual-process.
```

Cada cenário registra processo, heap, workload, allocation, live set, dominator, root path, fix, shutdown, resultado e evidence.

---

### 55. Criar baseline report

Arquivo:

```text
memory-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  Java:
    version:
      21

  heap:
    fixed:
      true

  workload:
    synthetic:
      true

  afterGC:
    trend:
      stable

  histogram:
    captured:
      true

  process:
    residual:
      zero

  result:
    PASS
```

---

### 56. Criar matriz de testes

Arquivo:

```text
MEMORY_LEAK_TEST_MATRIX.md
```

Cenários:

- allocation rate;
- live set;
- old generation;
- GC logs;
- static collection;
- bounded history;
- ThreadLocal;
- listener;
- cache;
- executor queue;
- pending future;
- classloader;
- direct buffer;
- RSS versus heap;
- histogram;
- live histogram;
- heap dump;
- dominator tree;
- retained heap;
- path to root;
- JFR;
- NMT;
- fix comparison;
- shutdown;
- residual process;
- security;
- evidence.

---

### 57. Criar troubleshooting

Arquivo:

```text
MEMORY_LEAK_TROUBLESHOOTING.md
```

Inclua:

- heap alto, mas estável;
- allocation alta sem retenção;
- histogram dominado por `byte[]`;
- dump falha por falta de disco;
- `jcmd` não encontra PID;
- processo morre antes da coleta;
- MAT não abre dump;
- dominator não é owner de negócio;
- path passa por `ThreadLocal`;
- cache cresce após correção;
- listener continua registrado;
- RSS cresce com heap estável;
- NMT não estava habilitado;
- full GC recupera pouco;
- restart resolve temporariamente;
- CPU alta começa a dominar a investigação;
- material da aula 598 antecipado.

---

### 58. Criar gate

O gate valida:

- contrato;
- catálogo;
- baseline;
- processo filho;
- GC metrics;
- histogram;
- heap dump policy;
- dominator analysis;
- path to root;
- ThreadLocal;
- cache;
- listener;
- classloader triage;
- native memory triage;
- fix;
- regression;
- shutdown;
- zero residual process;
- segurança.

Status:

```text
PASS;

FAIL_BASELINE;

FAIL_ISOLATION;

FAIL_DUMP_POLICY;

FAIL_ROOT_CAUSE;

FAIL_UNBOUNDED_RETENTION;

FAIL_THREADLOCAL;

FAIL_CACHE;

FAIL_LISTENER;

FAIL_REGRESSION;

FAIL_SHUTDOWN;

FAIL_RESIDUAL_PROCESS;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 59. Coletar evidence

Script:

```text
collect-memory-leak-evidence.ps1
```

Arquivo:

```text
memory-leak-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- scenario category;
- heap trend;
- live set category;
- allocation category;
- histogram category;
- dominator category;
- root path category;
- native memory category;
- fix status;
- regression status;
- shutdown status;
- residual process status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- object address;
- PID persistido;
- payload;
- token;
- credencial;
- heap dump;
- JFR bruto;
- string sensível;
- conteúdo da aula 598.

---

### 60. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\memory-leak\validate-memory-leak-contract.ps1

.\scripts\performance\memory-leak\validate-memory-leak-scenarios.ps1

.\scripts\performance\memory-leak\build-memory-leak-child.ps1

.\scripts\performance\memory-leak\run-memory-leak-baseline.ps1

.\scripts\performance\memory-leak\run-static-collection-leak.ps1

.\scripts\performance\memory-leak\run-threadlocal-leak.ps1

.\scripts\performance\memory-leak\run-listener-leak.ps1

.\scripts\performance\memory-leak\run-cache-leak.ps1

.\scripts\performance\memory-leak\collect-class-histogram.ps1

.\scripts\performance\memory-leak\collect-live-class-histogram.ps1

.\scripts\performance\memory-leak\collect-heap-dump.ps1

.\scripts\performance\memory-leak\collect-gc-log.ps1

.\scripts\performance\memory-leak\collect-memory-jfr.ps1

.\scripts\performance\memory-leak\collect-native-memory-summary.ps1

.\scripts\performance\memory-leak\analyze-memory-growth.ps1

.\scripts\performance\memory-leak\analyze-dominator-tree.ps1

.\scripts\performance\memory-leak\analyze-path-to-gc-root.ps1

.\scripts\performance\memory-leak\validate-memory-leak-fix.ps1

.\scripts\performance\memory-leak\validate-memory-leak-regression.ps1

.\scripts\performance\memory-leak\validate-memory-leak-shutdown.ps1

.\scripts\performance\memory-leak\kill-residual-memory-process.ps1

.\scripts\performance\memory-leak\scan-memory-output.ps1

.\scripts\performance\memory-leak\collect-memory-leak-evidence.ps1

.\scripts\performance\memory-leak\verify-memory-leak-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- baseline aprovada;
- processo filho isolado;
- leak estático reproduzido;
- ThreadLocal leak reproduzido;
- listener leak reproduzido;
- cache leak reproduzido;
- histogramas coletados;
- heap dump protegido;
- dominator analisado;
- path to GC root identificado;
- heap e native memory diferenciados;
- fix aprovado;
- regressão aprovada;
- shutdown aprovado;
- zero processos residuais;
- segurança aprovada;
- evidence sanitizada;
- CPU high não antecipado.

---

### 61. Encerrar o laboratório

Confirme processo e executors encerrados, ThreadLocals removidos, listeners cancelados, caches fechados, dumps fora do Git e baseline preservada.

Execute:

```powershell
.\scripts\performance\memory-leak\kill-residual-memory-process.ps1

Remove-Item `
  .tmp/memory-leak `
  -Recurse `
  -Force
```

---

## Entendendo o que foi feito

### Heap alto ganhou contexto

Uso elevado deixou de ser tratado automaticamente como leak.

### Live set ganhou tendência

Heap após GCs comparáveis passou a mostrar retenção crescente.

### Histogram ganhou delta

Quantidade e bytes por classe passaram a ser comparados entre janelas.

### Heap dump ganhou segurança

O artefato passou a ser tratado como dado altamente sensível.

### Dominator tree ganhou owner

Grandes retainers passaram a apontar componentes responsáveis.

### Path to GC root ganhou causalidade

A cadeia de referências explicou por que o objeto permanecia vivo.

### ThreadLocal ganhou lifecycle

Valores passaram a ser removidos em `finally`.

### Cache ganhou budget

Cardinalidade, peso, TTL e eviction passaram a ser explícitos.

### Listener ganhou unsubscribe

Registro passou a devolver uma handle de cleanup.

### Heap e RSS ganharam separação

Crescimento nativo deixou de ser investigado apenas por heap dump.

### A próxima aula ganhou fronteira

A aula 598 irá aprofundar diagnóstico de CPU alta.

---

## Erros comuns importantes

### Chamar heap alto de leak

O heap pode estar cheio e estável.

### Olhar apenas allocation rate

Alocação alta pode ser saudável se os objetos morrerem.

### Usar apenas uma amostra

Leak exige tendência e comparação.

### Capturar dump sem autorização

O arquivo pode conter dados sensíveis.

### Versionar `.hprof`

Heap dump nunca deve ir para o Git.

### Culpar `byte[]`

O array costuma ser conteúdo retido por outro owner.

### Corrigir aumentando `-Xmx`

Isso apenas adia um leak ilimitado.

### Usar `System.gc()` como solução

GC não remove objetos ainda alcançáveis.

### Limpar cache sem contrato

Pode quebrar funcionalidade ou gerar stampede.

### Ignorar memória nativa

RSS pode crescer com heap estável.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\performance\memory-leak\run-memory-leak-baseline.ps1
```

### Coletar histogram

```powershell
.\scripts\performance\memory-leak\collect-class-histogram.ps1
```

### Capturar heap dump

```powershell
.\scripts\performance\memory-leak\collect-heap-dump.ps1
```

### Analisar crescimento

```powershell
.\scripts\performance\memory-leak\analyze-memory-growth.ps1
```

### Validar regressão

```powershell
.\scripts\performance\memory-leak\validate-memory-leak-regression.ps1
```

---

## Exercício guiado

### Parte 1 — Baseline

Fixe JVM, heap, workload e janelas.

### Parte 2 — Leak sintético

Execute o processo filho.

### Parte 3 — GC

Compare heap após GC e old generation.

### Parte 4 — Histogram

Colete T0, T1 e T2.

### Parte 5 — Heap dump

Capture com segurança.

### Parte 6 — MAT

Analise dominators e retained heap.

### Parte 7 — GC roots

Identifique owner e lifecycle.

### Parte 8 — Fix

Limite cache, remova ThreadLocal ou cancele listener.

### Parte 9 — Regression

Repita a mesma carga.

### Parte 10 — Gate

Valide cleanup, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 596 e ponte para a aula 598 foram preservadas;
- heap, generations, live set, allocation, promotion, GC roots, shallow heap, retained heap, dominators, histogramas e dumps foram definidos;
- contrato, catálogo, baseline e policies foram criados;
- leaks intencionais executam apenas em processo filho bounded;
- baseline usa JVM, heap, workload, duração e collector equivalentes;
- allocation alta foi diferenciada de retenção e heap após GC foi medido;
- leaks de coleção estática, ThreadLocal, listener e cache foram reproduzidos e corrigidos;
- histogramas em múltiplas janelas foram comparados;
- heap dump foi coletado sob política de segurança;
- MAT, dominator tree, retained heap e path to GC root foram aplicados;
- owner e lifecycle da retenção foram identificados;
- executor queues, pending Futures e classloaders foram avaliados;
- heap e memória nativa foram diferenciados com apoio de JFR e NMT;
- a correção remove a causa, sem depender apenas de Xmx, forced GC ou restart;
- regressão usa workload equivalente e várias janelas;
- shutdown remove recursos e deixa zero processos residuais;
- matriz, troubleshooting, gate, segurança e evidence estão presentes;
- nenhum heap dump, JFR bruto, payload ou endereço de objeto foi commitado;
- CPU high não foi aprofundado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/memory-leak `
  scripts/performance/memory-leak `
  docs/performance/memory-leak `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|requestId|objectAddress|businessPayload|\.hprof|rawJfr|heapDumpBinary|CPUFlameGraph"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): diagnosticar memory leaks"
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
- heap dumps;
- JFR bruto;
- PIDs persistidos;
- artifacts temporários;
- profiling aprofundado de CPU;
- material da aula 598.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou crescimento de memória em uma investigação baseada em retenção.

Você trabalhou com:

```text
heap;

live set;

allocation rate;

old generation;

GC logs;

histogram;

heap dump;

dominator tree;

retained heap;

GC roots;

ThreadLocal;

cache;

listeners;

classloaders;

native memory;

JFR;

NMT;

regression.
```

Você comprovou que heap alto não prova leak; que allocation alta pode ser temporária; que live set crescente após GCs comparáveis é um sinal forte; que histogramas mostram classes em crescimento; que dominator tree e retained heap ajudam a encontrar owners; que path to GC root explica a retenção; que ThreadLocal, caches, listeners, queues e classloaders precisam de lifecycle; e que heap dump exige proteção rigorosa.

A próxima aula será:

```text
598 - M18.43 - CPU high diagnostico
```

Nela, você irá diagnosticar CPU alta com métricas de processo e container, distinguir user e system CPU, coletar thread dumps em sequência, mapear native thread IDs, usar JFR e profiling, identificar hot methods, loops, contention, GC CPU e criar regressões de CPU.

Nenhum flame graph, hot method analysis, `top -H`, async-profiler em modo CPU, mapeamento de native thread ID ou laboratório completo de CPU alta foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei allocation de retenção.
- [ ] Medi live set após GC.
- [ ] Coletei histogramas.
- [ ] Protegi o heap dump.
- [ ] Analisei dominator tree.
- [ ] Segui path to GC root.
- [ ] Corrigi owner e lifecycle.
- [ ] Validei regressão sem processo residual.

---

## Troubleshooting adicional

### Heap cresce, mas cai após GC

Pode ser pressão de alocação, não leak.

### Old generation cresce continuamente

Investigue objetos sobreviventes, roots e promoção.

### Histogram mostra muitos `byte[]`

Procure o objeto que domina esses arrays.

### Dump não cabe no disco

Pare e libere espaço; não arrisque preencher o filesystem.

### MAT acusa leak suspect incorreto

Confirme dominator, root path, owner e cenário.

### ThreadLocal continua retendo

Verifique todos os caminhos de exception e cleanup.

### Cache segue crescendo

Revise cardinalidade, TTL, maximum weight e chaves.

### RSS cresce com heap estável

Investigue direct buffers, stacks, metaspace e NMT.

### Restart resolve por algumas horas

Isso recupera a instância, mas confirma apenas retenção reiniciável.

### CPU alta domina o incidente

Preserve o profiling aprofundado para a aula 598.

---

## Perguntas de revisão

1. O que é memory leak?
2. Qual diferença entre allocation e retenção?
3. O que é live set?
4. O que é GC root?
5. O que é shallow heap?
6. O que é retained heap?
7. O que é dominator tree?
8. O que é path to GC root?
9. Para que serve class histogram?
10. Por que heap dump é sensível?
11. Como ThreadLocal causa leak?
12. Como listener causa leak?
13. Como cache causa leak?
14. Por que aumentar heap não corrige?
15. Como diferenciar heap e RSS?
16. Para que serve NMT?
17. Como criar regressão de memória?
18. O que restart resolve?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Retenção desnecessária de objetos alcançáveis.
2. Criar objetos versus mantê-los vivos.
3. Objetos vivos após GC comparável.
4. Referência inicial considerada viva.
5. Memória direta do objeto.
6. Memória liberável se o objeto morrer.
7. Árvore de objetos dominantes.
8. Cadeia até uma raiz.
9. Contar instâncias e bytes por classe.
10. Pode conter dados da aplicação.
11. Valor permanece ligado à thread.
12. Registry mantém callback e capturas.
13. Cardinalidade cresce sem limite.
14. Apenas adia o esgotamento.
15. Comparando heap, RSS e categorias nativas.
16. Categorizar memória nativa.
17. Mesma carga, várias janelas e slope bounded.
18. Remove o estado da JVM, não a causa.
19. CPU high diagnóstico.
20. CPU high diagnóstico.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 597 - M18.42 - Memory leak diagnostico

- Continuei após Timeouts em produção.
- Diferenciei heap alto, allocation e retenção.
- Defini live set, GC roots, shallow heap e retained heap.
- Criei baseline e processo filho bounded.
- Reproduzi leaks de coleção estática, ThreadLocal, listener e cache.
- Implementei versões bounded e cleanup de lifecycle.
- Coletei GC logs, histogramas, heap dump e JFR com segurança.
- Analisei dominator tree e path to GC root.
- Identifiquei owner da retenção.
- Avaliei queues, Futures, classloaders e memória nativa.
- Usei Native Memory Tracking.
- Criei runbook e regressão com live set bounded.
- Encerrei processos e removi artefatos sensíveis.
- Coletei evidence sanitizada.
- Não antecipei CPU high diagnóstico.
- Próxima aula: CPU high diagnóstico.
```

## Referência técnica curta

- Java heap and garbage collection.
- GC roots.
- Class histograms.
- Heap dumps.
- Eclipse Memory Analyzer.
- Dominator tree.
- Retained heap.
- ThreadLocal cleanup.
- Cache lifecycle.
- Native Memory Tracking.

Regra final:

```text
memory leak precisa ser provado por retenção crescente e por uma cadeia explicável até GC root, não por heap alto isolado: todo diagnóstico começa com baseline comparável, heap após GC, old generation, allocation e promotion rates, histogramas em múltiplas janelas e processo filho bounded, enquanto heap dumps são artefatos altamente sensíveis, coletados somente com autorização, espaço, proteção, retenção limitada e exclusão verificada; dominator tree, retained heap e path to GC root identificam o owner real, e a correção atua no lifecycle de coleções estáticas, ThreadLocals, listeners, caches, executor queues, Futures ou classloaders, sem usar aumento de Xmx, forced GC ou restart periódico como solução definitiva; heap e RSS são diferenciados com JFR e Native Memory Tracking, regressões usam a mesma JVM, heap, workload e duração, e o laboratório termina com live set bounded, zero processos residuais e evidence sanitizada; flame graphs, hot methods e diagnóstico aprofundado de CPU alta ficam para a aula 598.
```
