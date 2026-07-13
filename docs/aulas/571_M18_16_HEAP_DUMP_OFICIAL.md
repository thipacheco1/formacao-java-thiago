# 571 - M18.16 - Heap dump

## Apresentação da aula

Na aula 570, você aprendeu a investigar o estado interno das threads da JVM por meio de thread dumps.

Você trabalhou com:

```text
jcmd;

jstack;

estados de thread;

stacks;

monitores;

locks;

contenção;

deadlock;

starvation;

I/O bloqueante;

hotspots candidatos;

séries de snapshots.
```

Thread dump responde principalmente:

```text
o que as threads
estão fazendo agora?
```

Entretanto, existem incidentes em que o problema principal não está no progresso das threads.

Exemplos:

- memória cresce continuamente;
- o processo aproxima-se do limite do heap;
- objetos permanecem vivos por mais tempo do que o esperado;
- caches nunca liberam entradas;
- listeners permanecem registrados;
- filas acumulam payloads;
- sessões ficam retidas;
- class loaders antigos continuam alcançáveis;
- grandes coleções dominam o heap;
- a aplicação termina com `OutOfMemoryError`;
- reiniciar reduz memória temporariamente, mas o crescimento retorna.

Nesses cenários, precisamos observar os objetos existentes no heap.

Um **heap dump** é um snapshot da memória heap da JVM.

Ele pode registrar:

```text
classes;

instâncias;

arrays;

campos;

referências;

class loaders;

threads relacionadas;

GC roots;

caminhos de retenção;

tamanhos.
```

O arquivo geralmente utiliza o formato:

```text
HPROF
```

e costuma possuir extensão:

```text
.hprof
```

A pergunta central desta aula será:

```text
como coletar
e analisar heap dumps

sem comprometer
segurança,
disco,
estabilidade
ou privacidade,

identificando
retenções inesperadas,
objetos dominantes
e candidatos a vazamento?
```

Heap dump não prova vazamento. Ele mostra objetos, tamanho, referências e alcançabilidade; a análise diferencia uso legítimo, backlog, retenção temporária e leak provável.

Você trabalhará com `jcmd`, `jmap`, histogramas, Eclipse MAT, shallow e retained size, dominator tree, GC roots, class loaders, leak suspects, OQL e comparação de dumps.

A captura preferencial será `jcmd <PID> GC.heap_dump <arquivo>`, com `jmap` como fallback, e a análise principal será feita no Eclipse MAT.

O laboratório será local e controlado.

Não serão coletados heap dumps de processos reais sem autorização.

Heap dumps podem conter credenciais, payloads, dados pessoais e detalhes internos; o arquivo bruto é artifact altamente sensível.

A aula não irá aprofundar o comportamento temporal do garbage collector.

Não serão analisados:

- logs de GC;
- pausas de coleta;
- young GC;
- mixed GC;
- full GC;
- allocation rate ao longo do tempo;
- promoção;
- survivor regions;
- humongous allocations;
- causas de pausa;
- tuning por logs;
- comparação entre coletores.

Esses assuntos pertencem à próxima aula oficial:

```text
572 - M18.17 - GC logs
```

A regra central será:

```text
heap dump mostra
objetos e retenção
em um instante;

um candidato a vazamento
precisa combinar
estrutura,
crescimento,
contexto
e evidência temporal.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
569:
Troubleshooting por logs.

570:
Thread dump.

571:
Heap dump.

572:
GC logs.
```

A progressão segue de eventos e threads para objetos e, depois, comportamento temporal da memória.

Nesta aula:

```text
heap dump:
sim.

HPROF:
sim.

jcmd:
sim.

jmap:
sim.

class histogram:
sim.

Eclipse MAT:
sim.

shallow heap:
sim.

retained heap:
sim.

dominator tree:
sim.

GC roots:
sim.

paths to GC roots:
sim.

leak suspects:
sim.

GC logs:
não.

tuning de coletor:
não.

análise de pausas:
não.
```

Você reutilizará:

- métricas de memória;
- logs estruturados;
- release metadata;
- alertas;
- runbooks;
- thread dumps;
- cenários controlados;
- políticas de segurança.

Heap dump não substitui métricas.

Ele responde o que ocupa e retém memória no snapshot.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
src/main/java
└── .../diagnostics/heapdump
    ├── HeapDumpScenarioController.java
    ├── HeapGrowthScenario.java
    ├── BoundedCacheScenario.java
    ├── UnboundedCacheScenario.java
    ├── ListenerRetentionScenario.java
    ├── QueueRetentionScenario.java
    ├── ClassLoaderRetentionScenario.java
    ├── HeapDumpScenarioRegistry.java
    ├── RetainedPayloadFactory.java
    └── HeapDumpScenarioProperties.java

src/test/java
└── .../diagnostics/heapdump
    ├── BoundedCacheScenarioTest.java
    ├── UnboundedCacheScenarioContractTest.java
    ├── ListenerRetentionScenarioTest.java
    ├── QueueRetentionScenarioTest.java
    ├── HeapDumpScenarioIsolationTest.java
    └── HeapDumpScenarioSecurityTest.java

observability/heap-dump
├── heap-dump-contract.yaml
├── heap-dump-capture-policy.yaml
├── heap-dump-histogram-policy.yaml
├── heap-dump-analysis-policy.yaml
├── heap-dump-dominator-policy.yaml
├── heap-dump-gc-root-policy.yaml
├── heap-dump-comparison-policy.yaml
├── heap-dump-leak-candidate-policy.yaml
├── heap-dump-classloader-policy.yaml
├── heap-dump-collection-policy.yaml
├── heap-dump-data-quality-policy.yaml
├── heap-dump-security-policy.yaml
├── heap-dump-failure-policy.yaml
├── heap-dump-scenarios.yaml
└── heap-dump-evidence.yaml

scripts/observability/heap-dump
├── validate-heap-dump-tools.ps1
├── discover-heap-process.ps1
├── collect-class-histogram.ps1
├── capture-heap-dump.ps1
├── capture-heap-dump-series.ps1
├── validate-hprof-file.ps1
├── summarize-class-histogram.ps1
├── compare-class-histograms.ps1
├── prepare-mat-analysis.ps1
├── validate-dominator-report.ps1
├── validate-gc-root-analysis.ps1
├── validate-leak-suspect-report.ps1
├── compare-heap-dump-reports.ps1
├── scan-heap-dump-metadata.ps1
├── simulate-heap-dump-scenarios.ps1
├── collect-heap-dump-evidence.ps1
└── verify-heap-dump-baseline.ps1

docs/observability/heap-dump
├── HEAP_DUMP_OVERVIEW.md
├── JCMD_JMAP_HEAP_DUMP_GUIDE.md
├── CLASS_HISTOGRAM_GUIDE.md
├── ECLIPSE_MAT_GUIDE.md
├── DOMINATOR_TREE_GUIDE.md
├── GC_ROOTS_GUIDE.md
├── MEMORY_LEAK_ANALYSIS.md
├── HEAP_DUMP_TEST_MATRIX.md
└── HEAP_DUMP_TROUBLESHOOTING.md
```

Ao final, você terá cenários, histogramas, HPROF validado, análise no MAT, dominator tree, GC roots, leak suspects, comparação e evidence sanitizada.

Você irá validar ferramentas e disco, criar cenários, coletar histogramas e HPROF, analisar MAT, dominators, GC roots, coleções e class loaders, comparar snapshots, proteger dados e executar o gate.

---

## Conceito essencial

### Heap

Região da JVM onde objetos e arrays são alocados.

---

### Heap dump

Snapshot dos objetos, classes e referências do heap.

---

### HPROF

Formato de arquivo frequentemente usado para heap dumps Java.

---

### Live object

Objeto ainda alcançável por algum GC root.

---

### Unreachable object

Objeto sem caminho alcançável a partir de GC roots.

Pode estar aguardando coleta.

---

### Class histogram

Resumo por classe contendo quantidade de instâncias e bytes rasos.

---

### Instance count

Quantidade de objetos de uma classe.

---

### Shallow size

Memória ocupada pelo próprio objeto, sem incluir objetos referenciados.

---

### Retained size

Memória que pode tornar-se coletável caso um objeto específico deixe de ser alcançável.

---

### Dominator

Objeto que está em todos os caminhos entre um conjunto de objetos e os GC roots.

---

### Dominator tree

Estrutura que mostra relações de dominância e retenção.

---

### GC root

Ponto de partida usado pelo garbage collector para determinar objetos alcançáveis.

---

### Path to GC roots

Caminho de referências entre um objeto e seus roots.

---

### Strong reference

Referência que mantém o objeto fortemente alcançável.

---

### Weak reference

Referência que não impede coleta quando não existem referências fortes.

---

### Soft reference

Referência que pode ser limpa em resposta à pressão de memória.

---

### Phantom reference

Referência usada para observar processamento pós-finalização de alcançabilidade.

---

### Leak suspect

Objeto ou conjunto de objetos com retenção relevante e estrutura compatível com possível vazamento.

---

### Class loader leak

Retenção de class loader e das classes carregadas após ele não ser mais necessário.

---

### Object Query Language

Linguagem de consulta do MAT, conhecida como OQL.

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

jmap `
  -h

git status

git diff --check
```

Confirme:

- JDK 21 ativo;
- `jcmd` disponível;
- `jmap` disponível;
- aplicação compila;
- testes passam;
- espaço de disco suficiente;
- nenhum `.hprof` está no repositório;
- nenhum cenário de retenção está ativo;
- nenhum processo real será analisado.

Registre a baseline.

---

### 2. Criar contrato de heap dump

Arquivo:

```text
heap-dump-contract.yaml
```

Conteúdo:

```yaml
heapDump:
  process:
    required:
      - pid
      - service
      - environment
      - release

  capture:
    preferredTool:
      jcmd

    fallbackTool:
      jmap

    diskValidation:
      required

    authorization:
      requiredOutsideLaboratory

  analysis:
    required:
      - class-histogram
      - shallow-size
      - retained-size
      - dominator-tree
      - gc-roots
      - collection-analysis
      - classloader-analysis
      - leak-suspect-review

  rawFile:
    repository:
      forbidden

  gcLogAnalysis:
    deferredToLesson572
```

O contrato evita captura sem contexto e análise.

---

### 3. Criar política de captura

Arquivo:

```text
heap-dump-capture-policy.yaml
```

Conteúdo:

```yaml
capture:
  preferred:
    command:
      jcmd-pid-GC.heap_dump-file

  fallback:
    command:
      jmap-dump-format-b-file-pid

  destination:
    directory:
      .tmp/heap-dumps

  fileName:
    format:
      lesson-service-scenario-timestamp-sequence.hprof

  beforeCapture:
    required:
      - confirm-pid
      - confirm-service
      - confirm-release
      - confirm-disk-space
      - confirm-sensitive-artifact-policy

  afterCapture:
    required:
      - validate-file
      - record-size
      - calculate-sha256
      - restrict-access

  commit:
    forbidden
```

Heap dump pode aproximar-se do tamanho do heap em uso.

Valide espaço antes da captura.

---

### 4. Verificar espaço em disco

Exemplo PowerShell:

```powershell
$drive = Get-PSDrive `
  -Name `
  C

$freeBytes = $drive.Free

$minimumFreeBytes =
  4GB

if ($freeBytes -lt $minimumFreeBytes) {
    throw "Espaço insuficiente para heap dump."
}
```

O limite considera heap, uso atual, arquivo, MAT e margem de segurança; não use valor universal em produção.

---

### 5. Criar propriedades dos cenários

Arquivo:

```text
HeapDumpScenarioProperties.java
```

As properties limitam objetos, bytes, duração, fila, ambiente e concorrência e garantem cleanup.

Exemplo:

```java
@ConfigurationProperties(
        prefix = "app.diagnostics.heap-dump")
public record HeapDumpScenarioProperties(
        boolean enabled,
        int objectCount,
        int payloadBytes,
        int maximumRetainedMegabytes) {
}
```

---

### 6. Criar registry de cenários

Arquivo:

```text
HeapDumpScenarioRegistry.java
```

O registry inicia, para, limpa, mede retenção, evita duplicação e não expõe payloads.

Estados: `IDLE`, `ALLOCATING`, `RETAINING`, `RELEASING`, `COMPLETED` e `FAILED`.

---

### 7. Criar payload seguro

Arquivo:

```text
RetainedPayloadFactory.java
```

Use payload sintético:

```java
public byte[] create(
        int size,
        byte marker) {

    var payload =
            new byte[size];

    Arrays.fill(
            payload,
            marker);

    return payload;
}
```

Não use:

- dados pessoais;
- tokens;
- objetos reais;
- mensagens reais;
- conteúdo de banco;
- credenciais.

---

### 8. Criar cenário de crescimento controlado

Arquivo:

```text
HeapGrowthScenario.java
```

Estrutura:

```java
private final List<byte[]> retained =
        new ArrayList<>();

public void allocate(
        int count,
        int size) {

    for (int index = 0;
         index < count;
         index++) {

        retained.add(
                payloadFactory.create(
                        size,
                        (byte) 1));
    }
}

public void release() {
    retained.clear();
}
```

O cenário permite baseline, crescimento, captura, release e nova captura sem causar `OutOfMemoryError`.

---

### 9. Criar cache limitado

Arquivo:

```text
BoundedCacheScenario.java
```

Use uma estrutura com limite explícito.

Exemplo:

```text
maximum entries:
1.000.

eviction:
oldest.

cleanup:
available.
```

O objetivo é comparar:

```text
retenção esperada
versus retenção sem limite.
```

Cache cheio não é automaticamente vazamento.

---

### 10. Criar cache sem limite

Arquivo:

```text
UnboundedCacheScenario.java
```

Use apenas no profile de diagnóstico.

Estrutura conceitual:

```java
private final Map<String, byte[]> cache =
        new ConcurrentHashMap<>();
```

As chaves devem ser sintéticas.

O cenário possui limite, stop, cleanup, medição, execução local e isolamento.

---

### 11. Criar retenção por listener

Arquivo:

```text
ListenerRetentionScenario.java
```

Cenário:

1. criar listeners;
2. registrar em publisher de longa duração;
3. remover referências externas;
4. não remover do publisher;
5. capturar dump;
6. analisar caminho até GC root.

A retenção ocorre porque:

```text
publisher
→
lista de listeners
→
listener
→
payload.
```

A correção seria unregister adequado.

---

### 12. Criar retenção por fila

Arquivo:

```text
QueueRetentionScenario.java
```

Cenário:

- producer adiciona payloads;
- consumer é pausado;
- fila cresce;
- objetos permanecem alcançáveis;
- dump é capturado;
- consumer volta;
- fila drena;
- novo dump é comparado.

Esse caso pode ser backlog operacional.

Não é necessariamente leak.

---

### 13. Criar cenário de class loader

Arquivo:

```text
ClassLoaderRetentionScenario.java
```

O cenário cria class loader local isolado, carrega classe sintética, mantém retenção indireta e captura o dump, sem carregamento remoto.

---

### 14. Criar controller interno

Arquivo:

```text
HeapDumpScenarioController.java
```

Endpoints internos iniciam, liberam e consultam o cenário.

Regras:

- apenas profile `diagnostics`;
- ambiente local;
- limite de memória;
- um cenário por vez;
- cleanup;
- acesso restrito;
- sem produção.

---

### 15. Descobrir o processo

Script:

```text
discover-heap-process.ps1
```

Use:

```powershell
jcmd
```

ou:

```powershell
jps `
  -lv
```

Valide artifact, porta, release, profile, PID atual e correspondência única.

Não reutilize PID antigo.

---

### 16. Coletar histogram baseline

Script:

```text
collect-class-histogram.ps1
```

Comando preferencial:

```powershell
jcmd `
  $pid `
  GC.class_histogram
```

Fallback:

```powershell
jmap `
  -histo `
  $pid
```

O histograma mostra:

```text
rank;

instances;

bytes;

class name.
```

O histograma é mais leve que o dump completo.

---

### 17. Entender o histograma

Exemplo conceitual:

```text
num     #instances     #bytes       class name
1       120000         9600000      [B
2       85000          3400000      java.lang.String
3       12000          1800000      java.util.HashMap$Node
```

`[B`, `[C` e `[Ljava.lang.Object;` representam arrays; contagem alta não implica retained size alto, e histograma não mostra caminhos de referência.

---

### 18. Capturar com `jcmd`

Script:

```text
capture-heap-dump.ps1
```

Comando:

```powershell
jcmd `
  $pid `
  GC.heap_dump `
  .tmp/heap-dumps/571_orders-api_growth_001.hprof
```

Algumas opções e comportamento podem variar por versão.

O script registra tool, PID, arquivo, duração, tamanho, SHA-256 e status.

Não grave o PID na evidence final.

---

### 19. Usar `jmap` como fallback

Comando:

```powershell
jmap `
  -dump:format=b,file=.tmp/heap-dumps/571_orders-api_growth_001.hprof `
  $pid
```

Em ambientes onde a opção `live` for avaliada, documente o impacto.

Uma coleta que força processamento adicional pode alterar o estado observado.

No laboratório, prefira política explícita e consistente.

---

### 20. Validar o arquivo HPROF

Script:

```text
validate-hprof-file.ps1
```

Valide existência, tamanho, extensão, checksum, permissões, path temporário, ausência no Git e abertura no MAT.

Resultado:

```text
HPROF_APPROVED
ou
HPROF_BLOCKED.
```

---

### 21. Criar política de histogramas

Arquivo:

```text
heap-dump-histogram-policy.yaml
```

Conteúdo:

```yaml
histogram:
  capture:
    beforeScenario:
      required

    afterScenario:
      required

    afterRelease:
      recommended

  compare:
    dimensions:
      - class-name
      - instances
      - shallow-bytes

  conclusion:
    leakFromHistogramOnly:
      forbidden

  sensitiveClassNames:
    review:
      required
```

Histograma identifica candidatos.

Não prova retenção.

---

### 22. Comparar histogramas

Script:

```text
compare-class-histograms.ps1
```

Compare baseline, após alocação e após release.

A saída compara classe, instâncias, bytes e deltas.

Classificações:

```text
stable;

increased;

decreased;

returned-to-baseline;

persistent-growth;

inconclusive.
```

---

### 23. Preparar análise no MAT

Script:

```text
prepare-mat-analysis.ps1
```

O script valida o arquivo, registra checksum e metadata, prepara abertura no MAT, indica relatórios e mantém HPROF fora do Git.

Relatórios iniciais: Leak Suspects, Top Consumers, Dominator Tree, Histogram e Class Loader Explorer.

---

### 24. Entender shallow size

Exemplo:

```text
ArrayList
```

O shallow size inclui o objeto `ArrayList`.

Não inclui automaticamente:

```text
elementData;

elementos referenciados;

payloads internos.
```

Outro exemplo:

```text
byte[1048576]
```

O shallow size do array inclui aproximadamente os bytes do próprio array, além de overhead.

Shallow size ajuda a medir o objeto diretamente.

---

### 25. Entender retained size

Se um objeto é o único caminho para milhares de outros objetos, ele pode possuir retained size alto.

Exemplo:

```text
UnboundedCacheScenario
→
ConcurrentHashMap
→
nodes
→
keys
→
byte arrays.
```

O objeto raiz do cenário pode ter shallow size pequeno.

Entretanto, seu retained size pode ser grande.

Retained size ajuda a responder:

```text
quanto poderia ser liberado
se este objeto deixasse
de ser alcançável?
```

---

### 26. Entender dominator tree

Arquivo:

```text
heap-dump-dominator-policy.yaml
```

Conteúdo:

```yaml
dominator:
  review:
    required:
      - top-retained-objects
      - application-dominators
      - collections
      - class-loaders
      - queues
      - caches

  sortBy:
    retained-size

  exclude:
    known-platform-overhead:
      documented

  conclusion:
    topDominatorIsLeak:
      forbidden
```

O maior dominator pode ser legítimo.

Exemplos:

- cache configurado;
- aplicação Spring;
- class metadata;
- fila esperada;
- buffer controlado.

---

### 27. Analisar a dominator tree

Ordene por retained heap, localize objetos da aplicação, expanda referências, identifique coleções, encontre GC root e registre a hipótese no contexto do cenário.

Evite começar apenas por:

```text
maior objeto.
```

Comece pelo contexto do incidente.

---

### 28. Entender GC roots

GC roots incluem stacks, classes, static fields, JNI, class loaders, monitors e referências internas.

Um objeto permanece vivo quando existe caminho forte até algum root.

No MAT, use:

```text
Path to GC Roots
```

com exclusão de referências fracas quando apropriado.

---

### 29. Criar política de GC roots

Arquivo:

```text
heap-dump-gc-root-policy.yaml
```

Conteúdo:

```yaml
gcRoots:
  pathAnalysis:
    requiredForLeakCandidate

  excludeWeakReferences:
    default:
      true

  review:
    - static-field
    - thread-local
    - listener-registry
    - executor-queue
    - class-loader
    - cache
    - JNI-reference

  conclusion:
    rootPathWithoutContext:
      insufficient
```

O caminho mostra retenção.

A análise ainda precisa explicar por que ela é indevida.

---

### 30. Analisar static field

Exemplo:

```text
ApplicationRegistry.INSTANCE
→
listeners
→
ListenerRetentionScenario
→
payload.
```

Verifique lifecycle, unregister, limite da coleção, necessidade da referência estática e desacoplamento do payload.

Static field é um root comum.

Não é automaticamente problema.

---

### 31. Analisar `ThreadLocal`

Caminho possível:

```text
thread
→
ThreadLocalMap
→
entry
→
value.
```

Risco:

- thread de pool vive por muito tempo;
- valor não é removido;
- class loader fica retido;
- payload permanece vivo.

Boa prática:

```java
try {
    threadLocal.set(value);
    execute();
} finally {
    threadLocal.remove();
}
```

O heap dump pode revelar retenção.

---

### 32. Analisar coleções

Arquivo:

```text
heap-dump-collection-policy.yaml
```

Conteúdo:

```yaml
collections:
  inspect:
    - size
    - capacity
    - element-types
    - owner
    - lifecycle
    - bound
    - eviction
    - duplicate-keys
    - stale-entries

  suspicious:
    - unbounded-growth
    - owner-outlives-elements
    - no-eviction
    - queue-without-consumption
    - listener-without-unregister

  largeCollectionIsLeak:
    forbidden
```

Uma coleção grande pode ser legítima.

O problema é o descompasso entre tamanho, limite, lifecycle e uso.

---

### 33. Analisar arrays

Arrays dominantes podem representar:

- payloads;
- buffers;
- imagens;
- mensagens;
- serialização;
- strings;
- caches;
- pools.

Tipos comuns:

```text
byte[];

char[];

Object[].
```

Procure o owner.

O array sozinho raramente explica a retenção.

---

### 34. Analisar Strings

Strings podem dominar por arrays internos, keys, payloads, caches, intern pool e metadata.

Verifique unicidade, duplicação, uso como key, owner, limite e correlação com release.

Não extraia conteúdo sensível para evidence.

---

### 35. Analisar class loaders

Arquivo:

```text
heap-dump-classloader-policy.yaml
```

Conteúdo:

```yaml
classLoaders:
  inspect:
    - loader-count
    - loaded-class-count
    - retained-size
    - duplicate-application-classes
    - paths-to-roots

  suspicious:
    - old-loader-retained-after-reload
    - thread-context-classloader
    - static-registry
    - thread-local
    - shutdown-hook
    - driver-registry

  productionConclusion:
    requiresMultipleEvidence:
      true
```

Class loader leak é comum em ambientes com reload, plugins ou redeploy.

---

### 36. Analisar leak suspects

O MAT pode gerar:

```text
Leak Suspects Report.
```

O relatório aponta dominators, retained heap, paths e possíveis problemas, mas é apenas ponto de partida.

Valide cenário, lifecycle, crescimento, root, owner, release e comportamento após cleanup.

---

### 37. Criar política de candidato a leak

Arquivo:

```text
heap-dump-leak-candidate-policy.yaml
```

Conteúdo:

```yaml
leakCandidate:
  requires:
    - unexpected-retention
    - relevant-retained-size
    - path-to-gc-root
    - owner-identified
    - lifecycle-mismatch

  strengthens:
    - persistent-growth-across-dumps
    - returns-after-restart
    - reproduces-in-laboratory
    - disappears-after-fix
    - release-correlation

  weakEvidence:
    - single-large-object
    - single-histogram
    - high-instance-count-alone

  conclusion:
    probableLeak:
      requiresMultipleSignals
```

Use linguagem proporcional à evidência.

---

### 38. Executar OQL básico

Exemplo conceitual no MAT:

```sql
SELECT *
FROM INSTANCEOF
com.formacao.orders.diagnostics.heapdump.UnboundedCacheScenario
```

Outro:

```sql
SELECT *
FROM java.util.concurrent.ConcurrentHashMap
```

OQL localiza classes e objetos sem exportar conteúdo sensível.

---

### 39. Comparar dumps

Arquivo:

```text
heap-dump-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  requiredMetadata:
    - pid
    - service
    - release
    - scenario
    - timestamp

  snapshots:
    baseline:
      required

    afterGrowth:
      required

    afterRelease:
      required

  compare:
    - class-histogram
    - retained-size
    - dominators
    - gc-root-paths
    - collection-size
    - class-loader-count

  mixedProcess:
    interpretation:
      limited

  restart:
    record:
      required
```

Comparar processos diferentes exige cautela.

---

### 40. Criar série de dumps

Script:

```text
capture-heap-dump-series.ps1
```

A série captura baseline, crescimento e estado após release para comparar relatórios.

Heap dumps são pesados; use quantidades pequenas.

---

### 41. Interpretar retorno ao baseline

Se após release:

- contagem diminui;
- retained size diminui;
- objetos deixam de aparecer;
- fila drena;
- cache retorna ao limite;

então a retenção pode ser temporária e controlada.

Se permanece:

- mesmo owner;
- mesmo path;
- crescimento contínuo;
- lifecycle encerrado;

o candidato a leak se fortalece.

---

### 42. Comparar cache limitado e ilimitado

Cache limitado:

```text
cresce até o limite;

estabiliza;

eviction ocorre;

retained size permanece bounded.
```

Cache ilimitado:

```text
cresce com cada operação;

não estabiliza;

owner permanece vivo;

retained size aumenta.
```

A comparação ensina que:

```text
crescimento
não é igual a vazamento,

mas crescimento sem limite
é risco operacional.
```

---

### 43. Diferenciar backlog e leak

Backlog:

- objetos representam trabalho pendente;
- fila cresce quando throughput cai;
- drena quando consumer recupera;
- owner é conhecido;
- tamanho acompanha métrica.

Leak:

- objetos continuam após lifecycle;
- não drenam;
- owner é inesperado;
- retenção persiste;
- crescimento não acompanha trabalho válido.

As duas condições podem coexistir.

---

### 44. Correlacionar com métricas

Métricas úteis incluem heap used, committed e max, allocation rate, filas, caches, sessões, classes e class loaders.

Nesta aula, use métricas apenas para localizar contexto.

A análise temporal detalhada do GC fica para a aula 572.

---

### 45. Correlacionar com logs

Logs mostram início, crescimento, eviction, unregister, cleanup, release, OOM e lifecycle.

Não copie conteúdo de objetos do heap para logs.

Use IDs sintéticos e contagens.

---

### 46. Correlacionar com thread dumps

Thread dump mostra executor parado, consumer bloqueado, `ThreadLocal`, class loader e fila sem progresso.

Heap dump mostra:

- objetos retidos;
- fila;
- payloads;
- owners;
- paths.

As duas perspectivas se complementam.

---

### 47. Criar política de análise

Arquivo:

```text
heap-dump-analysis-policy.yaml
```

Conteúdo:

```yaml
analysis:
  beginWith:
    - incident-context
    - memory-metrics
    - scenario
    - release
    - histogram

  then:
    - top-consumers
    - dominator-tree
    - gc-root-path
    - collections
    - class-loaders
    - leak-suspects

  avoid:
    - random-object-browsing
    - exporting-sensitive-content
    - declaring-leak-from-size-alone

  conclusion:
    confidence:
      required
```

A análise começa pelo problema observado.

---

### 48. Criar política de qualidade

Arquivo:

```text
heap-dump-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  emptyFile:
    action:
      block-analysis

  truncatedFile:
    action:
      block-analysis

  unsupportedFormat:
    action:
      block-analysis

  missingMetadata:
    result:
      limited

  mixedRelease:
    action:
      separate-analysis

  noBaseline:
    result:
      limited

  processRestarted:
    record:
      required

  analysisToolError:
    action:
      preserve-file-securely-and-investigate
```

Um arquivo inválido não sustenta conclusão.

---

### 49. Criar política de segurança

Arquivo:

```text
heap-dump-security-policy.yaml
```

Conteúdo:

```yaml
security:
  classification:
    highly-sensitive

  rawFile:
    repository:
      forbidden

    externalSharing:
      forbiddenInLaboratory

  access:
    leastPrivilege:
      required

  storage:
    temporary:
      required

    encryptedWhenOutsideLocalLab:
      required

  evidence:
    objectContent:
      forbidden

    personalData:
      forbidden

    credentials:
      forbidden

  cleanup:
    verifiedDeletion:
      required
```

Heap dump pode conter segredos em texto claro e exige proteção.

---

### 50. Escanear metadata

Script:

```text
scan-heap-dump-metadata.ps1
```

O script valida filename, path, checksum, tamanho, permissões, metadata, ausência no Git e relatórios sanitizados sem exportar objetos.

Não copie strings encontradas no dump para evidence.

---

### 51. Criar failure policy

Arquivo:

```text
heap-dump-failure-policy.yaml
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

  insufficientDisk:
    action:
      block-capture

  jcmdUnavailable:
    action:
      evaluate-jmap

  attachDenied:
    action:
      validate-user-and-permissions

  emptyDump:
    action:
      block-analysis

  matCannotOpen:
    action:
      validate-format-and-memory

  sensitiveExposure:
    action:
      delete-copy-and-block-release

  gcLogAnalysis:
    deferredToLesson572
```

---

### 52. Criar cenários

Arquivo:

```text
heap-dump-scenarios.yaml
```

Cenários:

```text
baseline;

bounded-cache;

unbounded-cache;

listener-retention;

queue-backlog;

queue-drained;

classloader-retention;

released-references;

insufficient-disk;

invalid-hprof;

attach-failure.
```

Cada cenário registra setup, limites, PID, histograma, dump, relatório, hipótese, cleanup e evidence.

---

### 53. Simular cache limitado

No cache limitado, preencha além da capacidade, confirme eviction, capture histograma e dump e valide retenção bounded.

Conclusão esperada:

```text
retenção esperada
e limitada.
```

---

### 54. Simular cache ilimitado

No cache ilimitado, observe crescimento, capture histogramas e dump, localize dominator e root, libere e compare.

Conclusão esperada:

```text
candidato a retenção
por cache sem limite.
```

---

### 55. Simular listener retention

Confirme no MAT:

```text
publisher
→
listener collection
→
listener
→
payload.
```

Depois execute unregister.

Capture nova evidência.

O retained size deve reduzir quando o lifecycle estiver correto.

---

### 56. Simular fila

Pause o consumer.

Confirme:

- queue size cresce;
- objetos de mensagem aumentam;
- owner é a fila;
- retained size acompanha backlog.

Reative o consumer.

Confirme redução.

Classifique:

```text
backlog operacional,
não leak,
quando drena.
```

---

### 57. Simular class loader retention

Confirme:

- mais de um loader;
- classes duplicadas do laboratório;
- loader antigo retido;
- path por registry, thread local ou hook;
- lifecycle encerrado;
- retenção persiste.

A conclusão deve permanecer:

```text
classloader-retention-candidate.
```

---

### 58. Criar matriz de testes

Arquivo:

```text
HEAP_DUMP_TEST_MATRIX.md
```

Cenários:

- ferramentas disponíveis;
- disco suficiente;
- PID único;
- histogram baseline;
- histogram after growth;
- `jcmd` capture;
- `jmap` fallback;
- HPROF válido;
- checksum;
- bounded cache;
- unbounded cache;
- listener retention;
- queue backlog;
- queue drain;
- class loader retention;
- shallow size;
- retained size;
- dominator tree;
- paths to roots;
- leak suspects;
- OQL;
- comparison;
- release;
- cleanup;
- sensitive artifact;
- evidence sanitizada.

---

### 59. Criar troubleshooting

Arquivo:

```text
HEAP_DUMP_TROUBLESHOOTING.md
```

Inclua:

- `jcmd` não encontra processo;
- `jmap` não conecta;
- espaço insuficiente;
- arquivo vazio;
- HPROF truncado;
- MAT não abre;
- MAT sem memória;
- histogram diverge;
- retained size desconhecido;
- dominator não parece objeto da aplicação;
- path to GC root muito grande;
- referência fraca confunde caminho;
- cache grande parece leak;
- fila parece leak;
- class loader duplicado;
- dump entrou no Git;
- cleanup falhou;
- GC logs antecipados.

---

### 60. Coletar evidence

Script:

```text
collect-heap-dump-evidence.ps1
```

Arquivo:

```text
heap-dump-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release e status de ferramentas, disco, histogramas, HPROF, dominators, roots, leak suspects, comparações, cenários, segurança e testes.

Não inclua:

- heap dump bruto;
- conteúdo de objetos;
- strings encontradas;
- credentials;
- emails;
- tokens;
- IDs de negócio;
- PID real;
- paths internos completos.

---

### 61. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\heap-dump\validate-heap-dump-tools.ps1

.\scripts\observability\heap-dump\discover-heap-process.ps1

.\scripts\observability\heap-dump\collect-class-histogram.ps1

.\scripts\observability\heap-dump\summarize-class-histogram.ps1

.\scripts\observability\heap-dump\capture-heap-dump-series.ps1

.\scripts\observability\heap-dump\validate-hprof-file.ps1

.\scripts\observability\heap-dump\compare-class-histograms.ps1

.\scripts\observability\heap-dump\prepare-mat-analysis.ps1

.\scripts\observability\heap-dump\validate-dominator-report.ps1

.\scripts\observability\heap-dump\validate-gc-root-analysis.ps1

.\scripts\observability\heap-dump\validate-leak-suspect-report.ps1

.\scripts\observability\heap-dump\compare-heap-dump-reports.ps1

.\scripts\observability\heap-dump\scan-heap-dump-metadata.ps1

.\scripts\observability\heap-dump\simulate-heap-dump-scenarios.ps1

.\scripts\observability\heap-dump\collect-heap-dump-evidence.ps1

.\scripts\observability\heap-dump\verify-heap-dump-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- ferramentas aprovadas;
- disco aprovado;
- PID aprovado;
- histogramas aprovados;
- HPROF válido;
- MAT preparado;
- dominators analisados;
- GC roots analisados;
- leak suspects revisados;
- comparação aprovada;
- cenários aprovados;
- segurança aprovada;
- evidence sanitizada;
- GC logs não antecipados.

---

### 62. Encerrar o laboratório

Libere os cenários.

Pare processos descartáveis.

Remova somente o diretório temporário:

```powershell
Remove-Item `
  .tmp/heap-dumps `
  -Recurse `
  -Force
```

Antes, confirme path, evidence, relatórios sanitizados e ausência de `.hprof` no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### A memória ganhou visibilidade estrutural

Métricas mostravam quantidade.

Heap dump mostrou objetos e referências.

### Histogramas ganharam contexto

Contagem e shallow bytes passaram a indicar candidatos.

### Retained size ganhou prioridade

Objetos pequenos puderam revelar grandes subgrafos retidos.

### Dominator tree ganhou finalidade

A análise passou a localizar owners de retenção.

### GC roots ganharam caminhos

Foi possível entender por que o objeto permanecia vivo.

### Coleções ganharam lifecycle

Caches, filas e listeners passaram a ser avaliados por limite, owner e drenagem.

### Class loaders ganharam análise

Loaders antigos e classes duplicadas puderam ser identificados.

### Leak suspects ganharam cautela

Relatórios automáticos deixaram de ser tratados como veredito.

### Comparações ganharam evidência temporal

Baseline, crescimento e release permitiram fortalecer ou enfraquecer hipóteses.

### A próxima aula ganhou fronteira clara

GC logs irão mostrar comportamento temporal da coleta e das pausas.

---

## Erros comuns importantes

### Declarar leak pelo maior objeto

O maior dominator pode ser legítimo.

### Usar apenas histograma

Ele não mostra caminhos de retenção.

### Confundir shallow e retained size

O objeto pode ser pequeno e reter muito.

### Tratar fila como leak

Ela pode representar backlog que drena.

### Tratar cache cheio como leak

Um cache limitado pode estar funcionando corretamente.

### Ignorar GC roots

Sem o caminho, não sabemos quem mantém o objeto vivo.

### Copiar conteúdo do heap

Dados sensíveis podem ser expostos.

### Capturar sem espaço

O disco pode ser esgotado.

### Versionar `.hprof`

O repositório recebe artifact enorme e sensível.

### Antecipar GC logs

Pausas, ciclos e tuning pertencem à aula 572.

---

## Comandos úteis

### Listar processos

```powershell
jcmd
```

### Coletar histograma

```powershell
jcmd `
  <PID> `
  GC.class_histogram
```

### Capturar heap dump

```powershell
jcmd `
  <PID> `
  GC.heap_dump `
  .tmp/heap-dumps/heap.hprof
```

### Fallback com `jmap`

```powershell
jmap `
  -dump:format=b,file=.tmp/heap-dumps/heap.hprof `
  <PID>
```

### Comparar histogramas

```powershell
.\scripts\observability\heap-dump\compare-class-histograms.ps1
```

---

## Exercício guiado

### Parte 1 — Tools

Valide `jcmd`, `jmap`, PID e disco.

### Parte 2 — Baseline

Colete histograma e dump inicial.

### Parte 3 — Growth

Crie retenção sintética controlada.

### Parte 4 — MAT

Abra HPROF e gere relatórios.

### Parte 5 — Dominators

Localize owners com retained size.

### Parte 6 — GC roots

Explique caminhos de retenção.

### Parte 7 — Scenarios

Compare cache, listener, fila e class loader.

### Parte 8 — Comparison

Compare baseline, crescimento e release.

### Parte 9 — Security

Proteja artifacts e relatórios.

### Parte 10 — Gate

Execute testes, evidence e cleanup.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 570 e ponte para a aula 572 foram preservadas;
- heap, heap dump, HPROF, live object, unreachable object, histogram, instance count, shallow size, retained size, dominator, dominator tree, GC root, path to roots, strong, weak, soft e phantom references, leak suspect, class loader leak e OQL foram definidos;
- baseline foi validada;
- contrato de heap dump foi criado;
- política de captura foi criada;
- captura com `jcmd GC.heap_dump` foi documentada;
- `jmap` foi definido como fallback;
- nenhum Secret, dado pessoal, processo real ou `.hprof` foi commitado;
- GC logs não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/heap-dump `
  scripts/observability/heap-dump `
  docs/observability/heap-dump `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure artifacts e dados proibidos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "\.hprof|password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|private_key"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar diagnostico por heap dump"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- heap dumps;
- conteúdo de objetos;
- histogramas brutos com dados sensíveis;
- PIDs;
- paths internos;
- credentials;
- arquivos temporários;
- GC logs;
- material da aula 572.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a observar a estrutura de objetos da JVM por meio de heap dumps.

Você trabalhou com:

```text
jcmd;

jmap;

class histogram;

HPROF;

Eclipse MAT;

shallow size;

retained size;

dominator tree;

GC roots;

paths;

collections;

class loaders;

leak suspects;

OQL.
```

Você comprovou que histograma indica candidatos, mas não explica retenção; shallow size mede o objeto, enquanto retained size mede o subgrafo que depende dele; dominator tree ajuda a localizar owners; GC roots mostram por que o objeto permanece vivo; caches, filas e listeners precisam ser avaliados por lifecycle e limite; class loaders podem permanecer retidos por registries, threads e hooks; leak suspect report é ponto de partida; comparação entre baseline, crescimento e release fortalece a evidência; e heap dumps são artifacts sensíveis que nunca devem entrar no repositório.

A próxima aula será:

```text
572 - M18.17 - GC logs
```

Nela, você irá analisar o comportamento temporal do garbage collector, pausas, frequência, ocupação antes e depois da coleta, promoção, full collections, allocation pressure e sinais de configuração inadequada.

Nenhuma configuração, coleta ou análise de GC logs, pausas, young GC, mixed GC, full GC, promotion failure ou tuning de coletor foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei ferramentas, PID e disco.
- [ ] Coletei histogram baseline.
- [ ] Capturei HPROF com segurança.
- [ ] Abri o dump no MAT.
- [ ] Analisei dominators e roots.
- [ ] Comparei cenários de retenção.
- [ ] Protegi artifacts sensíveis.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### `jcmd` não captura o dump

Confirme PID, usuário, path, espaço e permissões.

### `jmap` falha no attach

Revise JDK, processo, usuário e política de fallback.

### O HPROF está vazio

Bloqueie a análise e repita após corrigir a captura.

### O MAT não abre

Revise formato, integridade, memória disponível e versão da ferramenta.

### O maior dominator parece framework

Procure owners da aplicação e contexto do incidente.

### O histograma mostra muitos arrays

Localize quem os referencia.

### A fila domina o heap

Compare backlog, throughput e drenagem.

### O class loader antigo permanece

Analise threads, registries, hooks e `ThreadLocal`.

### O leak suspect aponta objeto legítimo

Valide lifecycle, limite, baseline e paths.

### A análise começou a interpretar pausas do coletor

Preserve esse aprofundamento para a aula 572.

---

## Perguntas de revisão

1. O que é heap dump?
2. O que é HPROF?
3. O que é class histogram?
4. O que é shallow size?
5. O que é retained size?
6. O que é dominator?
7. O que é dominator tree?
8. O que é GC root?
9. O que é path to GC roots?
10. Qual diferença entre cache e leak?
11. Como distinguir backlog e leak?
12. O que é class loader leak?
13. Para que serve Leak Suspects Report?
14. Por que um único objeto grande não prova leak?
15. Por que comparar dumps?
16. O que OQL permite?
17. Por que validar disco?
18. Por que não versionar HPROF?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Snapshot dos objetos da JVM.
2. Formato de heap dump.
3. Resumo por classe.
4. Tamanho do próprio objeto.
5. Memória dependente do objeto.
6. Objeto que domina caminhos.
7. Árvore de retenção.
8. Origem de alcançabilidade.
9. Caminho de referências.
10. Limite e lifecycle.
11. Verificar drenagem.
12. Loader antigo retido.
13. Apontar candidatos.
14. Pode ser legítimo.
15. Identificar persistência.
16. Consultar objetos.
17. Evitar esgotar disco.
18. Artifact sensível.
19. GC logs.
20. GC logs.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 571 - M18.16 - Heap dump

- Continuei após Thread dump.
- Entendi heap dump como snapshot dos objetos e referências da JVM.
- Validei `jcmd`, `jmap`, PID e espaço em disco.
- Criei contrato e política de captura.
- Classifiquei HPROF como artifact altamente sensível.
- Criei cenários limitados no profile de diagnóstico.
- Usei payloads sintéticos.
- Criei cenário de crescimento controlado.
- Comparei cache limitado e ilimitado.
- Criei retenção por listener.
- Criei retenção por fila e drenagem.
- Criei cenário de class loader retention.
- Coletei class histogram antes e depois.
- Capturei heap dump com `jcmd GC.heap_dump`.
- Usei `jmap` como fallback.
- Validei tamanho, checksum e integridade do HPROF.
- Preparei análise com Eclipse MAT.
- Diferenciei shallow size e retained size.
- Analisei dominator tree.
- Analisei paths to GC roots.
- Estudei static fields e `ThreadLocal`.
- Analisei coleções, arrays e Strings.
- Analisei class loaders.
- Revisei Leak Suspects Report com cautela.
- Criei política de candidatos a leak.
- Usei OQL básico.
- Comparei baseline, crescimento e release.
- Diferenciei backlog operacional e leak.
- Correlacionei heap com métricas, logs e thread dumps.
- Criei políticas de qualidade, segurança e failure.
- Executei cenários controlados.
- Coletei evidence sanitizada.
- Não antecipei GC logs.
- Próxima aula: GC logs.
```

---

## Referência técnica curta

- Java Heap Dumps.
- `jcmd GC.heap_dump`.
- `jmap -dump`.
- Class Histograms.
- Eclipse Memory Analyzer.
- Shallow Heap.
- Retained Heap.
- Dominator Tree.
- GC Roots.
- Memory Leak Analysis.

Regra final:

```text
diagnóstico por heap dump precisa combinar contexto, histogramas, retenção e caminhos de referência: jcmd GC.heap_dump é a captura preferida e jmap é fallback, sempre após validar PID, serviço, release, autorização e espaço em disco; histogramas mostram instâncias e shallow bytes, mas leak candidates exigem retained size relevante, dominator tree, path to GC roots, owner conhecido, lifecycle incompatível e comparação entre baseline, crescimento e release; caches limitados, filas, listeners, ThreadLocals, static fields e class loaders são analisados por limite, drenagem, unregister e persistência, enquanto Leak Suspects Report e OQL orientam a investigação sem substituir julgamento; HPROF é artifact altamente sensível, não entra no Git, não expõe conteúdo de objetos e é removido por cleanup específico após evidence sanitizada, deixando para a aula 572 a coleta e análise temporal de GC logs, pausas, frequência de coleções, promoção, full GC, allocation pressure e tuning.
```
