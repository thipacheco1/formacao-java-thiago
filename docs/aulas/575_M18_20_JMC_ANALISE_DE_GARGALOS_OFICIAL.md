# 575 - M18.20 - JMC analise de gargalos

## Apresentação da aula

Na aula 574, você criou uma base segura para profiling com Java Flight Recorder.

Você definiu:

```text
objetivo;

hipótese;

processo;

release;

workload;

warmup;

duração;

settings;

maxage;

maxsize;

eventos customizados;

cleanup.
```

Também aprendeu a:

- iniciar gravações com `JFR.start`;
- validar gravações com `JFR.check`;
- gerar snapshots com `JFR.dump`;
- encerrar gravações com `JFR.stop`;
- usar `StartFlightRecording`;
- validar `.jfr`;
- consultar `jfr summary`;
- filtrar eventos com `jfr print`;
- comparar gravações equivalentes;
- proteger arquivos brutos.

A captura, porém, é apenas a primeira metade do trabalho.

A segunda metade é transformar eventos em uma investigação organizada.

Nesta aula, você utilizará o **JDK Mission Control**, conhecido como **JMC**, para analisar gravações JFR e localizar gargalos.

A pergunta central será:

```text
como sair
de milhares de eventos

para uma conclusão
tecnicamente defensável

sobre CPU,
alocação,
locks,
I/O,
threads,
GC
e latência?
```

Um gargalo é uma limitação que restringe o desempenho de um fluxo.

Ele pode ocorrer em:

- CPU;
- método específico;
- lock;
- pool de threads;
- alocação;
- garbage collector;
- socket;
- disco;
- banco;
- fila;
- dependência;
- sincronização;
- configuração;
- recurso externo.

Muitos eventos não provam gargalo. Alocações podem ser coletadas com eficiência, e muitos samples podem representar trabalho útil. A análise considera impacto, frequência, duração, workload, release, thread, stack, comparação e fontes complementares.

O fluxo confirma integridade, contexto e janela; usa regras automáticas para triagem; aprofunda CPU, allocations, locks, threads, I/O e GC; correlaciona fontes; compara a baseline; e registra conclusão, confiança e próxima ação.

Você trabalhará com Automated Analysis, Method Profiling, Memory, Locks, Threads, File e Socket I/O, GC, Event Browser, stacks, call tree, hot methods, flame view, filtros e comparações.

A aula analisará `baseline`, `cpu-pressure`, `allocation-pressure`, `monitor-contention`, `blocking-io` e `mixed-workload`, praticando triagem sem assumir o gargalo dominante.

A aula não irá transformar resultados em projeções de infraestrutura.

Não serão calculados:

- crescimento anual;
- demanda futura;
- capacidade máxima do cluster;
- quantidade futura de réplicas;
- headroom de negócio;
- sazonalidade;
- forecast de tráfego;
- limite de usuários;
- curva de expansão;
- orçamento de capacidade;
- plano de aquisição;
- metas de utilização futuras.

Esses tópicos pertencem à próxima aula oficial:

```text
576 - M18.21 - Capacity planning
```

A regra central será:

```text
JMC não substitui
raciocínio investigativo;

ele organiza eventos,
stacks,
threads
e durações

para que hipóteses
sejam comparadas
com evidência.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
573:
JVM tuning basico.

574:
Profiling com JFR.

575:
JMC analise de gargalos.

576:
Capacity planning.
```

A progressão é:

```text
ajustar runtime;

capturar eventos;

localizar gargalos;

planejar capacidade.
```

Nesta aula:

```text
JMC:
sim.

Automated Analysis:
sim.

hot methods:
sim.

call tree:
sim.

CPU samples:
sim.

allocation hot spots:
sim.

lock instances:
sim.

thread parks:
sim.

file I/O:
sim.

socket I/O:
sim.

GC:
sim.

event browser:
sim.

correlação temporal:
sim.

comparação:
sim.

capacity forecast:
não.

dimensionamento futuro:
não.

projeção de réplicas:
não.
```

Você reutilizará gravações, custom events, GC logs, heap e thread dumps, métricas, dashboards, traces, logs, release metadata e cenários reproduzíveis.

A análise começa por gravação válida; a interface não corrige contexto inconsistente.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
observability/jmc
├── jmc-analysis-contract.yaml
├── jmc-recording-intake-policy.yaml
├── jmc-automated-analysis-policy.yaml
├── jmc-time-range-policy.yaml
├── jmc-cpu-analysis-policy.yaml
├── jmc-call-tree-policy.yaml
├── jmc-allocation-analysis-policy.yaml
├── jmc-lock-analysis-policy.yaml
├── jmc-thread-analysis-policy.yaml
├── jmc-io-analysis-policy.yaml
├── jmc-gc-analysis-policy.yaml
├── jmc-correlation-policy.yaml
├── jmc-comparison-policy.yaml
├── jmc-conclusion-policy.yaml
├── jmc-data-quality-policy.yaml
├── jmc-security-policy.yaml
├── jmc-failure-policy.yaml
├── jmc-analysis-scenarios.yaml
└── jmc-analysis-evidence.yaml

observability/jmc/reports
├── baseline-analysis.yaml
├── cpu-pressure-analysis.yaml
├── allocation-pressure-analysis.yaml
├── monitor-contention-analysis.yaml
├── blocking-io-analysis.yaml
├── mixed-workload-analysis.yaml
└── jmc-comparison-report.yaml

scripts/observability/jmc
├── validate-jmc-installation.ps1
├── validate-jmc-input-recordings.ps1
├── validate-jmc-analysis-contract.ps1
├── validate-jmc-analysis-report.ps1
├── validate-jmc-time-ranges.ps1
├── validate-jmc-hypotheses.ps1
├── validate-jmc-correlations.ps1
├── compare-jmc-analysis-reports.ps1
├── scan-jmc-analysis-output.ps1
├── simulate-jmc-analysis-review.ps1
├── collect-jmc-analysis-evidence.ps1
└── verify-jmc-analysis-baseline.ps1

docs/observability/jmc
├── JMC_OVERVIEW.md
├── JMC_RECORDING_INTAKE.md
├── JMC_AUTOMATED_ANALYSIS.md
├── JMC_CPU_ANALYSIS.md
├── JMC_ALLOCATION_ANALYSIS.md
├── JMC_LOCK_ANALYSIS.md
├── JMC_IO_ANALYSIS.md
├── JMC_GC_ANALYSIS.md
├── JMC_CORRELATION_GUIDE.md
├── JMC_TEST_MATRIX.md
└── JMC_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
intake validado;

análises por cenário;

hipóteses registradas;

gargalos classificados;

correlações documentadas;

comparação com baseline;

evidence sanitizada.
```

Você irá validar JMC e gravações, criar contratos, examinar regras automáticas, selecionar janelas, analisar CPU, call tree, allocations, locks, threads, I/O e GC, correlacionar fontes, comparar cenários, registrar confiança e executar o gate.

---

## Conceito essencial

### JDK Mission Control

Ferramenta de análise e monitoramento para aplicações Java, incluindo gravações JFR.

---

### Automated Analysis

Conjunto de regras do JMC que avalia eventos e apresenta observações, severidades e recomendações.

---

### Hot method

Método que aparece com frequência relevante em amostras ou tempo atribuído.

---

### Call tree

Estrutura hierárquica que apresenta relações entre chamadas de métodos.

---

### Stack trace

Sequência de frames que mostra o caminho de execução observado.

---

### Flame view

Representação agregada de stacks em que a largura indica frequência ou peso relativo.

---

### Self time

Tempo atribuído ao próprio método, excluindo chamadas filhas quando a visualização oferece essa distinção.

---

### Total time

Tempo atribuído ao método incluindo trabalho das chamadas descendentes.

---

### Execution sample

Amostra de stack coletada durante execução.

---

### Allocation hot spot

Classe ou stack associada a volume relevante de alocações.

---

### TLAB

Thread Local Allocation Buffer usado para alocações rápidas por thread.

---

### Monitor contention

Disputa por monitor que causa espera antes de entrar em região sincronizada.

---

### Thread park

Espera de thread por mecanismo baseado em `LockSupport`, filas, futures ou locks.

---

### I/O latency

Tempo gasto em operações de arquivo, socket ou dependência externa.

---

### Time range selection

Recorte temporal aplicado à análise.

---

### Event Browser

Visão do JMC que permite explorar eventos e atributos de forma detalhada.

---

### Bottleneck candidate

Componente ou comportamento com evidência suficiente para investigação prioritária.

---

### Confidence

Nível de confiança atribuído à conclusão com base na qualidade e convergência das evidências.

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

- JMC instalado;
- JDK 21;
- gravações da aula 574 disponíveis temporariamente;
- checksums registrados;
- settings conhecidas;
- duração conhecida;
- workload conhecido;
- release conhecida;
- eventos customizados presentes;
- nenhum `.jfr` no Git;
- nenhum relatório com dado sensível.

---

### 2. Validar a instalação do JMC

Script:

```text
validate-jmc-installation.ps1
```

Valide:

- executável disponível;
- versão registrada;
- arquitetura compatível;
- abertura local;
- workspace temporário;
- memória suficiente;
- associação com `.jfr` opcional;
- nenhum plugin não aprovado necessário.

Registre:

```text
JMC_INSTALLATION_APPROVED
```

ou:

```text
JMC_INSTALLATION_BLOCKED.
```

---

### 3. Criar contrato de análise

Arquivo:

```text
jmc-analysis-contract.yaml
```

Conteúdo:

```yaml
analysis:
  objective:
    required

  recording:
    required:
      - checksum
      - service
      - release
      - scenario
      - duration
      - settings
      - workload

  review:
    required:
      - automated-analysis
      - time-range
      - cpu
      - allocation
      - locks
      - threads
      - io
      - gc

  hypothesis:
    evidence:
      required

  conclusion:
    required:
      - classification
      - confidence
      - impact
      - next-action

  capacityPlanning:
    deferredToLesson576
```

---

### 4. Criar política de intake

Arquivo:

```text
jmc-recording-intake-policy.yaml
```

Conteúdo:

```yaml
intake:
  validate:
    - file-readable
    - checksum
    - duration
    - JDK-version
    - settings
    - release
    - scenario-markers
    - event-counts

  reject:
    - empty-recording
    - corrupted-recording
    - unknown-workload
    - missing-release
    - sensitive-data-exposure

  limited:
    - missing-markers
    - different-settings
    - incomplete-window
```

Gravação rejeitada não sustenta conclusão.

---

### 5. Abrir a gravação baseline

Abra:

```text
baseline.jfr
```

Confirme:

- página Overview;
- duração;
- início e fim;
- JVM;
- host local;
- processor count;
- heap;
- collector;
- threads;
- event counts;
- custom markers.

Não comece pelos hot methods.

Primeiro confirme o contexto.

---

### 6. Ler Automated Analysis

Arquivo:

```text
jmc-automated-analysis-policy.yaml
```

Conteúdo:

```yaml
automatedAnalysis:
  use:
    triage:
      true

  severity:
    interpretWithContext:
      required

  ruleResult:
    conclusion:
      forbidden

  review:
    - score
    - explanation
    - relevant-events
    - time-range
    - recommendation
    - applicability

  unsupportedRule:
    action:
      record-and-ignore
```

Automated Analysis serve para triagem.

Uma regra amarela ou vermelha não é causa raiz.

---

### 7. Registrar regras observadas

No relatório:

```yaml
automatedAnalysis:
  - rule:
      Java Application CPU Load

    score:
      warning

    relevance:
      scenario-consistent

    evidence:
      cpu-pressure-window

    conclusion:
      requires-method-analysis
```

Evite copiar textos longos da interface.

Registre apenas síntese e referência.

---

### 8. Selecionar a janela temporal

Arquivo:

```text
jmc-time-range-policy.yaml
```

Conteúdo:

```yaml
timeRange:
  source:
    preferred:
      custom-scenario-markers

  fallback:
    - known-workload-window
    - alert-window
    - release-window

  include:
    before:
      5s

    after:
      5s

  fullRecording:
    allowedForOverview:
      true

  detailedAnalysis:
    bounded:
      required
```

Use os custom events para localizar:

```text
scenario=start;

scenario=end.
```

Aplique o recorte nas páginas relacionadas.

---

### 9. Comparar janela completa e janela do cenário

A gravação completa inclui startup, warmup, idle, cenário e cleanup. Compare-a com a janela marcada para não atribuir custo de startup ao gargalo operacional.

---

### 10. Criar relatório padrão

Cada arquivo em:

```text
observability/jmc/reports
```

seguirá:

```yaml
analysis:
  recording:
  objective:
  timeRange:
  automatedAnalysis:
  cpu:
  allocations:
  locks:
  threads:
  io:
  gc:
  correlations:
  hypotheses:
  conclusion:
  confidence:
  limitations:
  nextActions:
```

A estrutura impede conclusão baseada em uma única página.

---

### 11. Analisar CPU

Arquivo:

```text
jmc-cpu-analysis-policy.yaml
```

Conteúdo:

```yaml
cpu:
  review:
    - machine-load
    - jvm-load
    - execution-samples
    - hot-methods
    - call-tree
    - thread-distribution
    - native-samples

  require:
    scenario-window:
      true

  singleHotMethod:
    conclusion:
      forbidden

  correlate:
    - throughput
    - latency
    - release
    - thread-name
```

---

### 12. Abrir Method Profiling

Na gravação `cpu-pressure.jfr`:

1. selecione a janela do cenário;
2. abra Method Profiling;
3. examine hot methods;
4. alterne por thread;
5. abra stack traces;
6. observe call tree;
7. compare self e total;
8. verifique samples nativos;
9. relacione com CPU load.

O método deve aparecer relevantemente.

---

### 13. Entender sample count

Execution sampling não mede cada instrução.

Ele coleta amostras ao longo do tempo.

Se um método aparece em grande proporção dos samples durante a janela, ele é candidato a consumo de CPU.

Considere duração, sample count, intervalo, threads, trabalho esperado, baseline e CPU real.

---

### 14. Entender self e total

Exemplo:

```text
OrderCalculationService.calculate
total:
45%.

self:
4%.
```

Isso indica que o custo principal está nas chamadas filhas.

Outro:

```text
HashingLoop.compute
total:
38%.

self:
36%.
```

O próprio método concentra o trabalho amostrado.

Nem toda versão do JMC apresenta os nomes exatamente iguais.

Interprete a relação, não apenas o rótulo.

---

### 15. Usar call tree

Arquivo:

```text
jmc-call-tree-policy.yaml
```

Conteúdo:

```yaml
callTree:
  inspect:
    - root-thread
    - caller
    - callee
    - sample-weight
    - recursion
    - framework-boundary
    - application-frame

  collapse:
    frameworkFrames:
      optional

  conclusion:
    leafWithoutCallerContext:
      insufficient
```

A call tree ajuda a descobrir quem chama o método quente.

---

### 16. Usar flame view

Quando disponível, use flame view para:

- visualizar stacks agregadas;
- identificar caminhos largos;
- comparar branches;
- localizar recursão;
- observar concentração por package.

A largura representa peso relativo.

A altura representa profundidade.

Cor não significa automaticamente severidade.

---

### 17. Comparar CPU com baseline

Abra `baseline.jfr` e `cpu-pressure.jfr`.

Use:

- mesma janela;
- settings iguais;
- workload documentado;
- duração equivalente.

Compare:

- total de samples;
- método candidato;
- distribuição por thread;
- CPU load;
- throughput;
- latência;
- custom markers.

Classifique:

```text
CPU_BOTTLENECK_CONFIRMED;

CPU_BOTTLENECK_CANDIDATE;

CPU_PATTERN_EXPECTED;

INCONCLUSIVE.
```

---

### 18. Analisar allocations

Arquivo:

```text
jmc-allocation-analysis-policy.yaml
```

Conteúdo:

```yaml
allocations:
  review:
    - allocation-events
    - allocation-by-class
    - allocation-by-stack
    - outside-tlab
    - thread-distribution
    - gc-correlation

  objectContent:
    forbidden

  highAllocation:
    leakConclusion:
      forbidden

  correlate:
    - gc-frequency
    - pause
    - heap-dump
    - throughput
```

---

### 19. Abrir Memory e Allocations

Na gravação `allocation-pressure.jfr`:

1. selecione a janela;
2. abra Memory;
3. examine allocations;
4. ordene por classe;
5. ordene por stack;
6. observe TLAB e outside TLAB;
7. agrupe por thread;
8. relacione com GC;
9. compare com baseline.

Procure classes sintéticas do cenário.

---

### 20. Diferenciar volume e retenção

JFR mostra onde ocorre alocação.

Heap dump mostra o que continua retido.

Padrão A:

```text
allocation alta;

GC frequente;

piso pós-GC estável;

heap dump sem retenção inesperada.
```

Conclusão possível:

```text
allocation pressure.
```

Padrão B:

```text
allocation alta;

piso pós-GC crescente;

dominator inesperado;

path to GC root persistente.
```

Conclusão possível:

```text
retention candidate.
```

---

### 21. Analisar outside TLAB

Alocações outside TLAB podem aparecer para objetos grandes ou condições específicas.

Verifique:

- classe;
- tamanho;
- stack;
- frequência;
- thread;
- humongous events;
- region size;
- heap dump.

Não conclua problema apenas pela presença.

---

### 22. Analisar locks

Arquivo:

```text
jmc-lock-analysis-policy.yaml
```

Conteúdo:

```yaml
locks:
  review:
    - monitor-enter
    - thread-park
    - duration
    - lock-class
    - thread
    - stack
    - owner-context

  threshold:
    known:
      required

  deadlock:
    useThreadDump:
      required

  correlate:
    - throughput
    - executor-queue
    - thread-dump
```

---

### 23. Abrir Locks

Na gravação `monitor-contention.jfr`:

1. selecione a janela;
2. abra Lock Instances;
3. ordene por duração;
4. examine classe do monitor;
5. examine threads bloqueadas;
6. examine stack;
7. localize região sincronizada;
8. relacione com thread dump;
9. compare com baseline.

A gravação deve mostrar contenção do cenário, sem deadlock.

---

### 24. Diferenciar monitor e park

`JavaMonitorEnter` se relaciona a monitores intrínsecos.

`ThreadPark` pode representar:

- `LockSupport`;
- `ReentrantLock`;
- futures;
- queues;
- executors;
- semáforos;
- condições.

A stack define o significado.

Não agrupe todas as esperas como lock contention.

---

### 25. Avaliar impacto da contenção

Avalie quantidade e duração das waits, caminho crítico, throughput, fila, owner, I/O, amplitude da região, baseline e release.

A existência de monitor não é um problema.

A espera relevante e persistente pode ser.

---

### 26. Analisar threads

Arquivo:

```text
jmc-thread-analysis-policy.yaml
```

Conteúdo:

```yaml
threads:
  review:
    - active-count
    - start-events
    - end-events
    - parks
    - names
    - groups
    - scenario-distribution

  suspicious:
    - unbounded-thread-growth
    - unnamed-custom-threads
    - repeated-short-lived-threads
    - long-parks-on-critical-path

  stateSnapshot:
    useThreadDump:
      required
```

JFR mostra eventos ao longo do tempo.

Thread dump mostra estados em um instante.

---

### 27. Avaliar criação de threads

Procure:

- taxa de criação;
- nomes;
- duração;
- encerramento;
- pools;
- threads avulsas;
- correlação com workload.

Criar uma thread por requisição pode gerar:

- overhead;
- stacks nativas;
- scheduling;
- pressão de memória;
- baixa previsibilidade.

Use custom thread factories e pools controlados.

---

### 28. Analisar I/O

Arquivo:

```text
jmc-io-analysis-policy.yaml
```

Conteúdo:

```yaml
io:
  review:
    - file-read
    - file-write
    - socket-read
    - socket-write
    - duration
    - bytes
    - thread
    - stack

  sensitive:
    endpoint:
      redact

    path:
      summarize

  correlate:
    - trace
    - logs
    - latency
    - dependency
```

---

### 29. Abrir File I/O e Socket I/O

Na gravação `blocking-io.jfr`:

1. selecione a janela;
2. abra File I/O;
3. ordene por duração;
4. examine bytes;
5. examine stack;
6. abra Socket I/O;
7. ordene por duração;
8. identifique thread;
9. relacione com dependency event;
10. compare com baseline.

Nenhum host real deve aparecer no relatório.

---

### 30. Diferenciar volume e latência de I/O

Grande volume com alta velocidade pode ser saudável.

Baixo volume com longa duração pode ser gargalo.

Analise:

- bytes;
- duration;
- throughput;
- frequency;
- concurrency;
- thread pool;
- timeout;
- posição na jornada.

---

### 31. Analisar GC

Arquivo:

```text
jmc-gc-analysis-policy.yaml
```

Conteúdo:

```yaml
gc:
  review:
    - collector
    - pause-time
    - pause-distribution
    - heap-before
    - heap-after
    - gc-cause
    - allocation-pressure
    - live-set
    - full-collection

  sourceOfTruth:
    detailedTimeline:
      jfr-and-gc-logs

  tuning:
    useLesson573Baseline:
      required
```

---

### 32. Abrir Garbage Collections

Examine:

- eventos por tipo;
- duração;
- causa;
- heap;
- pauses;
- thread activity;
- correlação com allocation;
- correlação com latência;
- custom markers.

Compare com os GC logs da aula 572.

A mesma janela deve produzir narrativa compatível.

---

### 33. Correlacionar CPU e GC

CPU alta pode vir de:

- aplicação;
- GC;
- compilação;
- native code.

Use:

- CPU load;
- execution samples;
- GC events;
- compilation events;
- thread distribution.

Não atribua CPU alta à aplicação sem separar o trabalho da JVM.

---

### 34. Correlacionar JFR e traces

Exemplo:

```text
trace:
payment span lento.

JFR:
socket read longo
na mesma janela.

logs:
timeout da dependência.

métrica:
p95 elevado.
```

As fontes convergem para I/O externo.

JFR pode não carregar o trace ID em todos os eventos nativos.

Use tempo, thread, custom event e operação para correlação.

---

### 35. Correlacionar JFR e logs

Use logs para:

- release;
- scenario marker;
- operação;
- erro;
- início;
- fim;
- cleanup.

Use JFR para:

- stack;
- duração;
- thread;
- allocation;
- monitor;
- I/O;
- GC.

Não copie logs para o arquivo JFR.

---

### 36. Criar política de correlação

Arquivo:

```text
jmc-correlation-policy.yaml
```

Conteúdo:

```yaml
correlation:
  dimensions:
    - time-range
    - release
    - scenario
    - thread
    - operation
    - dependency
    - custom-event

  sources:
    - JFR
    - metrics
    - logs
    - traces
    - GC-logs
    - thread-dumps
    - heap-dumps

  conflict:
    action:
      record-and-investigate

  unsupportedCausality:
    forbidden
```

---

### 37. Formular hipóteses

Hipótese boa:

```text
durante a janela cpu-pressure,
a maior proporção de execution samples
está no método sintético de hashing,
com CPU do processo elevada,
latência maior
e ausência do padrão na baseline.
```

Hipótese ruim:

```text
o código está lento.
```

Toda hipótese declara observação, evidência, comparação, impacto, limitação e teste seguinte.

---

### 38. Criar política de conclusão

Arquivo:

```text
jmc-conclusion-policy.yaml
```

Conteúdo:

```yaml
conclusion:
  classification:
    allowed:
      - confirmed-bottleneck
      - bottleneck-candidate
      - expected-behavior
      - secondary-factor
      - inconclusive

  confidence:
    allowed:
      - high
      - medium
      - low

  required:
    - evidence
    - comparison
    - impact
    - limitation
    - next-action

  singleView:
    conclusion:
      forbidden
```

---

### 39. Analisar cenário misto

Abra:

```text
mixed-workload.jfr
```

Não consulte o nome do cenário como resposta pronta.

Faça triagem:

1. Automated Analysis;
2. janela;
3. CPU;
4. allocations;
5. locks;
6. I/O;
7. GC;
8. threads;
9. correlations;
10. comparação.

Classifique cada fator:

```text
primary;

secondary;

expected;

irrelevant;

inconclusive.
```

---

### 40. Evitar falso gargalo

Exemplo:

```text
método X aparece em 20% dos samples.
```

Isso pode ser esperado se ele realiza 25% do trabalho útil.

Verifique latência, fila, throughput, alternativa, mudança, baseline, custo de framework e validade do cenário.

O objetivo não é eliminar trabalho útil.

---

### 41. Comparar relatórios

Arquivo:

```text
jmc-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  required:
    - same-JDK
    - same-settings
    - same-duration
    - equivalent-workload
    - same-release-or-explicit-release-comparison
    - same-time-range-method

  compare:
    - automated-rules
    - cpu
    - allocations
    - locks
    - threads
    - io
    - gc
    - conclusion

  missingBaseline:
    result:
      limited
```

---

### 42. Criar relatório comparativo

Arquivo:

```text
jmc-comparison-report.yaml
```

Conteúdo conceitual:

```yaml
comparison:
  baseline:
    recording:
      baseline

  candidate:
    recording:
      cpu-pressure

  differences:
    executionSamples:
      increased

    targetMethod:
      present-only-in-candidate

    jvmCpu:
      increased

    allocation:
      stable

    locks:
      stable

    io:
      stable

  conclusion:
    classification:
      confirmed-bottleneck

    confidence:
      high
```

---

### 43. Criar política de qualidade

Arquivo:

```text
jmc-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  corruptedRecording:
    action:
      block

  missingSettings:
    result:
      limited

  missingMarkers:
    result:
      limited

  differentDuration:
    action:
      normalize-or-limit

  lowSampleCount:
    result:
      low-confidence

  missingBaseline:
    result:
      limited

  JmcRuleUnavailable:
    action:
      manual-review

  UIFieldDifference:
    action:
      use-concept-not-label
```

Versões do JMC podem alterar labels e layout.

O conceito permanece.

---

### 44. Criar política de segurança

Arquivo:

```text
jmc-security-policy.yaml
```

Conteúdo:

```yaml
security:
  screenshots:
    redact:
      - hostname
      - username
      - path
      - endpoint
      - classpath-sensitive-entry

  reports:
    forbidden:
      - customer-id
      - payload
      - credentials
      - personal-data
      - full-internal-path
      - raw-stack-export

  recording:
    repository:
      forbidden

  externalSharing:
    forbiddenInLaboratory
```

Screenshots também são evidência sensível.

---

### 45. Criar failure policy

Arquivo:

```text
jmc-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  JmcUnavailable:
    action:
      block-laboratory

  recordingCannotOpen:
    action:
      validate-file-and-version

  automatedAnalysisEmpty:
    action:
      continue-manual-review

  eventPageEmpty:
    action:
      validate-settings-and-window

  highMemoryUsage:
    action:
      narrow-recording-or-increase-JMC-memory-locally

  conclusionConflict:
    action:
      record-and-review

  capacityPlanning:
    deferredToLesson576
```

---

### 46. Criar cenários de análise

Arquivo:

```text
jmc-analysis-scenarios.yaml
```

Cenários:

```text
baseline-analysis;

cpu-bottleneck-analysis;

allocation-pressure-analysis;

monitor-contention-analysis;

blocking-io-analysis;

mixed-workload-triage;

missing-markers;

low-sample-count;

different-settings;

corrupted-recording.
```

Cada cenário registra:

- input;
- objective;
- time range;
- pages;
- hypotheses;
- evidence;
- classification;
- confidence;
- limitation;
- next action.

---

### 47. Validar relatórios

Script:

```text
validate-jmc-analysis-report.ps1
```

Bloqueie:

- conclusão sem evidence;
- ausência de baseline quando exigida;
- classificação inválida;
- confiança ausente;
- time range ausente;
- gravação sem checksum;
- hipótese sem comparação;
- relatório com dados sensíveis;
- capacity forecast antecipado.

---

### 48. Validar hipóteses

Script:

```text
validate-jmc-hypotheses.ps1
```

Cada hipótese precisa de:

```text
observation;

source;

time range;

comparison;

impact;

limitation;

test.
```

Resultado:

```text
JMC_HYPOTHESES_APPROVED
```

ou:

```text
JMC_HYPOTHESES_BLOCKED.
```

---

### 49. Simular review

Script:

```text
simulate-jmc-analysis-review.ps1
```

A review deve:

1. validar intake;
2. confirmar janela;
3. desafiar regra automática;
4. revisar CPU;
5. revisar allocation;
6. revisar lock;
7. revisar I/O;
8. revisar GC;
9. validar correlações;
10. validar conclusão.

O reviewer precisa conseguir reconstruir o raciocínio sem abrir todas as telas.

---

### 50. Criar matriz de testes

Arquivo:

```text
JMC_TEST_MATRIX.md
```

Cenários:

- instalação;
- recording intake;
- checksum;
- duration;
- settings;
- markers;
- Automated Analysis;
- time range;
- CPU;
- self versus total;
- call tree;
- flame view;
- allocations;
- outside TLAB;
- locks;
- parks;
- threads;
- file I/O;
- socket I/O;
- GC;
- custom events;
- correlations;
- baseline comparison;
- mixed workload;
- low sample count;
- corrupted file;
- security scan;
- evidence sanitizada.

---

### 51. Criar troubleshooting

Arquivo:

```text
JMC_TROUBLESHOOTING.md
```

Inclua:

- JMC não inicia;
- gravação não abre;
- workspace corrompido;
- análise automática vazia;
- página sem eventos;
- período errado;
- samples insuficientes;
- self e total confundidos;
- flame view ausente;
- allocations ausentes;
- lock page vazia;
- endpoint sensível;
- JMC consome memória;
- gravações diferentes;
- regra automática contraditória;
- relatório sem confiança;
- capacity planning antecipado.

---

### 52. Coletar evidence

Script:

```text
collect-jmc-analysis-evidence.ps1
```

Arquivo:

```text
jmc-analysis-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- JDK version;
- JMC version;
- recording intake status;
- automated analysis status;
- time range status;
- CPU analysis status;
- allocation analysis status;
- lock analysis status;
- thread analysis status;
- I/O analysis status;
- GC analysis status;
- correlation status;
- comparison status;
- conclusion category;
- confidence;
- security status;
- tests status;
- timestamp.

Não inclua:

- `.jfr`;
- screenshots sem redaction;
- stacks completas;
- PIDs;
- usernames;
- hostnames;
- payloads;
- credentials;
- capacity forecast.

---

### 53. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\jmc\validate-jmc-installation.ps1

.\scripts\observability\jmc\validate-jmc-input-recordings.ps1

.\scripts\observability\jmc\validate-jmc-analysis-contract.ps1

.\scripts\observability\jmc\validate-jmc-analysis-report.ps1

.\scripts\observability\jmc\validate-jmc-time-ranges.ps1

.\scripts\observability\jmc\validate-jmc-hypotheses.ps1

.\scripts\observability\jmc\validate-jmc-correlations.ps1

.\scripts\observability\jmc\compare-jmc-analysis-reports.ps1

.\scripts\observability\jmc\scan-jmc-analysis-output.ps1

.\scripts\observability\jmc\simulate-jmc-analysis-review.ps1

.\scripts\observability\jmc\collect-jmc-analysis-evidence.ps1

.\scripts\observability\jmc\verify-jmc-analysis-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- instalação aprovada;
- intake aprovado;
- contrato aprovado;
- janelas aprovadas;
- CPU analisada;
- allocations analisadas;
- locks analisados;
- threads analisadas;
- I/O analisado;
- GC analisado;
- correlações aprovadas;
- hipóteses aprovadas;
- relatórios comparados;
- review simulada;
- segurança aprovada;
- evidence sanitizada;
- capacity planning não antecipado.

---

### 54. Encerrar o laboratório

Feche gravações e JMC.

Remova somente artifacts temporários:

```powershell
Remove-Item `
  .tmp/jfr `
  -Recurse `
  -Force

Remove-Item `
  .tmp/jmc `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve relatórios sanitizados;
- preserve policies;
- preserve scripts;
- preserve docs;
- confirme que nenhum `.jfr` está no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### A captura virou investigação

Eventos passaram a sustentar hipóteses e conclusões.

### Automated Analysis virou triagem

Regras automáticas deixaram de ser tratadas como veredito.

### A janela ganhou precisão

Custom markers separaram warmup, cenário e cleanup.

### CPU ganhou contexto de chamadas

Hot methods, call tree e samples foram relacionados ao workload.

### Allocation ganhou distinção

Pressão de alocação deixou de ser confundida com retenção.

### Locks ganharam impacto

Monitor enter e parks foram analisados por duração, thread e caminho crítico.

### I/O ganhou dimensão temporal

Bytes, duração, stack e dependência foram comparados.

### GC ganhou correlação

Eventos JFR e GC logs passaram a contar a mesma história.

### Conclusões ganharam confiança

Classificação, impacto, limitação e próxima ação tornaram-se obrigatórios.

### A próxima aula ganhou base real

Capacity planning poderá usar gargalos confirmados e limites medidos sem confundir sintomas com capacidade futura.

---

## Erros comuns importantes

### Aceitar a regra automática como causa

Ela é ponto de partida.

### Analisar a gravação inteira sem recorte

Startup e idle contaminam o resultado.

### Escolher o método com mais samples sem contexto

Ele pode representar trabalho esperado.

### Confundir alocação com leak

Retenção exige heap dump e GC roots.

### Tratar todo park como contenção

Executors ociosos também estacionam threads.

### Ignorar baseline

Não existe referência de comportamento esperado.

### Comparar settings diferentes

A quantidade de eventos muda.

### Omitir limitações

A conclusão parece mais forte do que a evidência.

### Expor screenshots

Hostnames, paths e endpoints podem aparecer.

### Antecipar capacity planning

Projeções e dimensionamento pertencem à aula 576.

---

## Comandos úteis

### Validar gravação

```powershell
jfr `
  summary `
  .tmp/jfr/baseline.jfr
```

### Consultar eventos customizados

```powershell
jfr `
  print `
  --events `
  "formacao.*" `
  .tmp/jfr/baseline.jfr
```

### Validar relatórios

```powershell
.\scripts\observability\jmc\validate-jmc-analysis-report.ps1
```

### Comparar análises

```powershell
.\scripts\observability\jmc\compare-jmc-analysis-reports.ps1
```

### Executar review

```powershell
.\scripts\observability\jmc\simulate-jmc-analysis-review.ps1
```

---

## Exercício guiado

### Parte 1 — Intake

Valide gravações, settings e markers.

### Parte 2 — Automated Analysis

Use regras como triagem.

### Parte 3 — Time range

Recorte a janela do cenário.

### Parte 4 — CPU

Analise samples, hot methods e call tree.

### Parte 5 — Allocation

Analise classes, stacks e GC.

### Parte 6 — Locks

Analise monitors, parks e impacto.

### Parte 7 — I/O e threads

Analise duração, bytes, pools e nomes.

### Parte 8 — Correlation

Relacione JFR a logs, traces e métricas.

### Parte 9 — Comparison

Compare baseline e cenário.

### Parte 10 — Gate

Registre conclusão, confiança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 574 e ponte para a aula 576 foram preservadas;
- JMC, Automated Analysis, hot method, call tree, stack trace, flame view, self time, total time, execution sample, allocation hot spot, TLAB, monitor contention, thread park, I/O latency, time range, Event Browser, bottleneck candidate e confidence foram definidos;
- baseline foi validada;
- instalação do JMC foi validada;
- contrato de análise foi criado;
- política de intake foi criada;
- gravações corrompidas ou sem contexto são rejeitadas;
- baseline foi aberta e contextualizada;
- Automated Analysis foi usado como triagem;
- regras automáticas não foram tratadas como causa;
- política de janela foi criada;
- custom markers foram usados;
- janela completa e janela do cenário foram comparadas;
- relatório padrão foi criado;
- política de CPU foi criada;
- Method Profiling foi analisado;
- sample count foi interpretado;
- self e total foram diferenciados;
- call tree foi analisada;
- flame view foi explicada;
- CPU foi comparada com baseline;
- política de allocations foi criada;
- allocations foram analisadas por classe e stack;
- volume e retenção foram diferenciados;
- outside TLAB foi analisado;
- política de locks foi criada;
- Lock Instances foi analisada;
- monitor e park foram diferenciados;
- impacto da contenção foi avaliado;
- política de threads foi criada;
- criação de threads foi analisada;
- política de I/O foi criada;
- File I/O e Socket I/O foram analisados;
- volume e latência foram diferenciados;
- política de GC foi criada;
- eventos de GC foram analisados;
- CPU de aplicação e CPU de JVM foram diferenciadas;
- JFR foi correlacionado a traces;
- JFR foi correlacionado a logs;
- política de correlação foi criada;
- hipóteses possuem evidência e comparação;
- política de conclusão foi criada;
- cenário misto foi analisado por triagem completa;
- falso gargalo foi considerado;
- política de comparação foi criada;
- relatório comparativo foi criado;
- política de qualidade foi criada;
- versões diferentes da UI foram consideradas;
- política de segurança foi criada;
- screenshots exigem redaction;
- failure policy foi criada;
- cenários de análise foram catalogados;
- relatórios foram validados;
- hipóteses foram validadas;
- review foi simulada;
- matriz de testes foi criada;
- troubleshooting foi criado;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, dado pessoal, `.jfr` ou screenshot não sanitizado foi commitado;
- capacity planning não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/jmc `
  scripts/observability/jmc `
  docs/observability/jmc `
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
      "\.jfr|password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|private_key|hostname|username|capacityForecast"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): analisar gargalos com JMC"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- gravações JFR;
- screenshots não sanitizados;
- PIDs;
- hostnames;
- usernames;
- paths completos;
- credentials;
- projeções de capacidade;
- material da aula 576.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as gravações JFR foram transformadas em análises reproduzíveis no JDK Mission Control.

Você trabalhou com:

```text
Automated Analysis;

time ranges;

Method Profiling;

hot methods;

call tree;

flame view;

allocations;

lock instances;

thread parks;

threads;

File I/O;

Socket I/O;

GC;

Event Browser;

correlações;

comparações;

confidence.
```

Você comprovou que regras automáticas servem para triagem; janelas precisam separar warmup e cenário; hot methods exigem comparação com workload e baseline; self time e total time respondem perguntas diferentes; allocation não é sinônimo de leak; monitors e parks possuem causas distintas; I/O deve ser avaliado por duração, bytes, thread e caminho crítico; CPU da aplicação precisa ser separada de GC e compilação; JFR ganha força quando converge com métricas, logs, traces, thread dumps e heap dumps; e toda conclusão precisa declarar impacto, confiança, limitações e próxima ação.

A próxima aula será:

```text
576 - M18.21 - Capacity planning
```

Nela, você irá transformar demanda, throughput, utilização, latência, saturação, headroom, crescimento e limites medidos em projeções de capacidade e decisões de dimensionamento.

Nenhuma projeção de demanda, crescimento, quantidade futura de réplicas, orçamento de capacidade, forecast de tráfego ou dimensionamento futuro foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei JMC e gravações.
- [ ] Selecionei janelas corretas.
- [ ] Analisei Automated Analysis.
- [ ] Analisei CPU e call tree.
- [ ] Analisei allocations e locks.
- [ ] Analisei threads, I/O e GC.
- [ ] Comparei com baseline.
- [ ] Registrei conclusão e confiança.

---

## Troubleshooting adicional

### O JMC não abre a gravação

Valide integridade, versão, tamanho e checksum.

### Automated Analysis não mostra regras

Continue pela análise manual e valide settings.

### A página de CPU está vazia

Confirme execution samples e janela.

### O método quente pertence ao framework

Expanda call tree até o frame da aplicação.

### Allocation aparece sem stack

Revise settings e custo de stacktrace.

### Locks não aparecem

Confirme threshold, cenário e eventos habilitados.

### Socket I/O mostra endpoint sensível

Redija relatórios e screenshots.

### As gravações apresentam durações diferentes

Normalize métricas ou limite a comparação.

### A conclusão contradiz métricas

Registre conflito e reavalie janela, cenário e hipótese.

### A análise começou a projetar réplicas futuras

Preserve essa etapa para a aula 576.

---

## Perguntas de revisão

1. O que é JDK Mission Control?
2. Para que serve Automated Analysis?
3. O que é hot method?
4. O que é call tree?
5. Qual diferença entre self e total time?
6. O que execution sample representa?
7. O que é allocation hot spot?
8. Qual diferença entre allocation e retention?
9. O que é monitor contention?
10. O que é thread park?
11. Como analisar I/O?
12. Por que selecionar time range?
13. Como usar custom markers?
14. Por que comparar com baseline?
15. O que é bottleneck candidate?
16. O que significa confidence?
17. Como JFR e thread dump se complementam?
18. Por que screenshots precisam de redaction?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Ferramenta de análise Java.
2. Triagem por regras.
3. Método com peso relevante.
4. Hierarquia de chamadas.
5. Próprio método versus descendentes.
6. Amostra de stack.
7. Classe ou stack de alocação.
8. Criar objetos versus mantê-los.
9. Espera por monitor.
10. Espera por park.
11. Duração, bytes, thread e stack.
12. Isolar o cenário.
13. Marcar início e fim.
14. Identificar diferença real.
15. Possível limitação dominante.
16. Força da conclusão.
17. Linha temporal e snapshot.
18. Podem expor dados.
19. Capacity planning.
20. Capacity planning.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 575 - M18.20 - JMC analise de gargalos

- Continuei após Profiling com JFR.
- Validei instalação e versão do JDK Mission Control.
- Criei contrato e política de intake das gravações.
- Abri a baseline e confirmei contexto, settings, release e markers.
- Usei Automated Analysis apenas como triagem.
- Criei política de seleção temporal.
- Separei warmup, cenário e cleanup.
- Criei relatórios padronizados por gravação.
- Analisei CPU com execution samples e hot methods.
- Diferenciei self time e total time.
- Analisei call tree e flame view.
- Comparei CPU com baseline.
- Analisei allocations por classe, stack e thread.
- Diferenciei allocation pressure e retention.
- Analisei eventos outside TLAB.
- Analisei monitor contention e thread parks.
- Diferenciei contenção, espera normal e deadlock.
- Analisei criação e duração de threads.
- Analisei File I/O e Socket I/O.
- Diferenciei volume e latência de I/O.
- Analisei eventos de GC no JMC.
- Separei CPU da aplicação, GC e compilação.
- Correlacionei JFR com logs, traces, métricas, GC logs, thread dumps e heap dumps.
- Criei política de correlação.
- Registrei hipóteses com evidência, impacto e limitações.
- Classifiquei conclusões e níveis de confiança.
- Analisei o cenário misto sem assumir resposta.
- Criei relatório comparativo.
- Criei políticas de qualidade, segurança e failure.
- Validei relatórios e hipóteses.
- Simulei review.
- Coletei evidence sanitizada.
- Não antecipei capacity planning.
- Próxima aula: Capacity planning.
```

---

## Referência técnica curta

- JDK Mission Control.
- Automated Analysis.
- JFR Method Profiling.
- Hot Methods.
- Call Tree.
- Allocation Profiling.
- Lock Instances.
- Thread Park Events.
- File and Socket I/O.
- JFR Bottleneck Analysis.

Regra final:

```text
análise de gargalos no JMC precisa começar pelo intake da gravação, objetivo, release, settings, workload, duração e janela do cenário: Automated Analysis orienta triagem, mas nenhuma regra, hot method, allocation class, lock ou evento de I/O é tratado isoladamente como causa; CPU é analisada por samples, self e total time, call tree, thread e comparação com baseline, allocations são separadas de retenção por GC logs e heap dumps, monitors e parks são avaliados por duração e caminho crítico, e I/O é relacionado a bytes, threads, traces e latência; conclusões precisam convergir com métricas, logs, traces, thread dumps, heap dumps e custom markers, declarar classificação, confiança, impacto, limitações e próxima ação, enquanto gravações e screenshots permanecem sanitizados e fora do Git, deixando para a aula 576 projeções de demanda, crescimento, headroom, réplicas e dimensionamento futuro.
```
