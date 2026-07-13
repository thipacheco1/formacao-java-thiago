# 573 - M18.18 - JVM tuning basico

## Apresentação da aula

Na aula 572, você aprendeu a coletar e interpretar GC logs.

Você passou a observar:

```text
collector ativo;

heap configurado;

young collections;

mixed collections;

full collections;

ciclos concorrentes;

heap before e after;

piso pós-GC;

pausas;

promoção;

age table;

humongous allocations;

safepoints;

comparações por release.
```

Essas evidências permitiram diferenciar:

- alocação temporária;
- crescimento do live set;
- pressão de memória;
- full GC inesperado;
- retenção;
- objetos grandes;
- pausas transitórias;
- comportamento persistente.

Agora surge uma nova responsabilidade:

```text
ajustar a JVM
sem copiar flags
de outro sistema
e sem trocar estabilidade
por uma melhoria aparente.
```

**JVM tuning** é o processo de ajustar recursos e opções da JVM a partir de objetivos mensuráveis.

Tuning não é uma coleção de flags mágicas. Ele começa pelo problema, evidência, objetivo, risco, hipótese, cenário, baseline, critério e rollback.

Exemplo inadequado:

```text
a aplicação está lenta;

vamos aumentar o heap
e colocar várias flags de GC.
```

Esse caminho mistura mudanças e impede saber qual delas produziu resultado.

Exemplo melhor:

```text
hipótese:
o heap máximo atual
gera mixed collections frequentes
durante carga estável.

mudança:
aumentar apenas Xmx
dentro do limite do container.

medição:
pausas,
post-GC floor,
RSS,
throughput,
latência,
full GC.

decisão:
manter,
reverter
ou investigar.
```

A pergunta central desta aula será:

```text
como realizar
tuning básico da JVM

de forma
mensurável,
reversível,
segura
e compatível
com os recursos reais
do ambiente?
```

Você trabalhará principalmente com:

```text
-Xms;

-Xmx;

-XX:InitialRAMPercentage;

-XX:MaxRAMPercentage;

-XX:MaxGCPauseMillis;

-XX:ActiveProcessorCount;

-XX:+UseG1GC;

-XX:+HeapDumpOnOutOfMemoryError;

-XX:+ExitOnOutOfMemoryError;

-Xlog:gc*.
```

O laboratório continuará utilizando JDK 21 e G1 GC como baseline.

Você avaliará heap, memória total, headroom, pausas, throughput, frequência de GC, CPU, containers, comparação equivalente e rollback.

A aula não irá produzir profiling detalhado de CPU, alocação, locks ou métodos.

Não serão construídos ainda:

- gravações JFR;
- eventos customizados JFR;
- análise no JDK Mission Control;
- flame graph;
- hot methods;
- allocation profiling;
- lock profiling;
- socket profiling;
- gravação contínua;
- templates JFR;
- análise de stacks por amostragem.

Esses tópicos pertencem à próxima aula oficial:

```text
574 - M18.19 - Profiling com JFR
```

A regra central será:

```text
mude uma variável
por vez,

meça antes e depois,

respeite o limite
do ambiente

e reverta
quando a hipótese
não for confirmada.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
571:
Heap dump.

572:
GC logs.

573:
JVM tuning basico.

574:
Profiling com JFR.
```

A progressão é:

```text
entender retenção;

entender coleta;

ajustar recursos;

investigar execução detalhada.
```

Nesta aula:

```text
heap sizing:
sim.

container memory:
sim.

headroom:
sim.

G1 básico:
sim.

pause target:
sim.

OOM policy:
sim.

CPU awareness:
sim.

before/after:
sim.

rollback:
sim.

JFR:
não.

flame graph:
não.

profiling de métodos:
não.
```

Você reutilizará:

- GC logs;
- heap dumps;
- métricas Micrometer;
- Prometheus;
- Grafana;
- thread dumps;
- logs estruturados;
- release metadata;
- runbooks;
- cenários de carga;
- evidence sanitizada.

O tuning precisa combinar essas fontes.

Uma flag isolada não explica o comportamento completo do processo.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
runtime/jvm-tuning
├── jvm-tuning-contract.yaml
├── jvm-resource-budget.yaml
├── jvm-heap-sizing-policy.yaml
├── jvm-native-headroom-policy.yaml
├── jvm-container-memory-policy.yaml
├── jvm-g1-basic-policy.yaml
├── jvm-pause-target-policy.yaml
├── jvm-cpu-policy.yaml
├── jvm-oom-policy.yaml
├── jvm-change-policy.yaml
├── jvm-comparison-policy.yaml
├── jvm-rollback-policy.yaml
├── jvm-data-quality-policy.yaml
├── jvm-security-policy.yaml
├── jvm-failure-policy.yaml
├── jvm-tuning-scenarios.yaml
└── jvm-tuning-evidence.yaml

runtime/jvm-tuning/profiles
├── baseline.env
├── small-heap.env
├── balanced-heap.env
├── percentage-heap.env
├── pause-target.env
└── rollback.env

scripts/runtime/jvm-tuning
├── validate-jvm-tuning-options.ps1
├── inspect-jvm-effective-flags.ps1
├── inspect-process-memory.ps1
├── validate-resource-budget.ps1
├── start-jvm-tuning-scenario.ps1
├── stop-jvm-tuning-scenario.ps1
├── run-jvm-tuning-baseline.ps1
├── run-jvm-heap-comparison.ps1
├── run-jvm-pause-target-comparison.ps1
├── run-jvm-container-memory-comparison.ps1
├── analyze-jvm-tuning-result.ps1
├── validate-jvm-tuning-rollback.ps1
├── scan-jvm-tuning-output.ps1
├── collect-jvm-tuning-evidence.ps1
└── verify-jvm-tuning-baseline.ps1

docs/runtime/jvm-tuning
├── JVM_TUNING_OVERVIEW.md
├── JVM_MEMORY_BUDGET_GUIDE.md
├── HEAP_SIZING_GUIDE.md
├── G1_BASIC_TUNING_GUIDE.md
├── CONTAINER_AWARENESS_GUIDE.md
├── JVM_OOM_POLICY.md
├── JVM_TUNING_COMPARISON_GUIDE.md
├── JVM_TUNING_TEST_MATRIX.md
└── JVM_TUNING_TROUBLESHOOTING.md
```

Ao final, você terá baseline, budget, perfis versionados, comparações, heap sizing, headroom, container awareness, pause target, OOM policy, rollback e evidence sanitizada.

Você irá validar baseline e recursos, criar contratos e profiles, comparar heap, percentuais, pause target e CPU, definir OOM e rollback, coletar evidence e executar o gate.

---

## Conceito essencial

### JVM tuning

Ajuste orientado por evidências das opções e recursos da JVM.

---

### Baseline

Configuração e resultado de referência usados para comparação.

---

### Hypothesis

Explicação testável que justifica uma mudança.

---

### Heap

Memória gerenciada pelo garbage collector para objetos Java.

---

### Native memory

Memória do processo fora do heap Java.

---

### Headroom

Margem reservada para picos e memória não contabilizada no heap.

---

### `-Xms`

Tamanho inicial do heap.

---

### `-Xmx`

Tamanho máximo do heap.

---

### Initial RAM percentage

Percentual de memória detectada usado para calcular o heap inicial.

---

### Max RAM percentage

Percentual de memória detectada usado para calcular o heap máximo.

---

### Pause target

Meta que orienta decisões ergonômicas do collector.

Não é garantia rígida.

---

### Throughput

Proporção de tempo útil gasto executando a aplicação.

---

### Ergonomics

Decisões automáticas da JVM baseadas no ambiente e nas flags.

---

### Container awareness

Capacidade da JVM de considerar limites de CPU e memória do container.

---

### Resident Set Size

Memória física residente utilizada pelo processo, frequentemente abreviada como RSS.

---

### Metaspace

Memória nativa usada principalmente para metadata de classes.

---

### Code cache

Memória usada pelo compilador JIT para código nativo compilado.

---

### Direct buffer

Buffer fora do heap, frequentemente usado por I/O.

---

### OOM

Condição `OutOfMemoryError`.

---

### Rollback

Retorno para a configuração anteriormente aprovada.

---

### Change isolation

Prática de alterar uma variável por experimento.

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

java `
  -XX:+PrintCommandLineFlags `
  -version

git status

git diff --check
```

Suba a aplicação com o profile normal e GC logs da aula 572.

Confirme:

- JDK 21;
- collector;
- heap inicial efetivo;
- heap máximo efetivo;
- CPU detectada;
- memória detectada;
- release;
- GC logs ativos;
- métricas disponíveis;
- nenhum perfil de tuning ativo;
- nenhum artifact bruto no Git.

Registre a baseline antes de qualquer mudança.

---

### 2. Criar contrato de tuning

Arquivo:

```text
jvm-tuning-contract.yaml
```

Conteúdo:

```yaml
tuning:
  objective:
    required

  hypothesis:
    required

  baseline:
    required

  change:
    oneVariableAtATime:
      required

  environment:
    required:
      - service
      - release
      - memory-limit
      - cpu-limit
      - collector
      - jdk-version

  measures:
    required:
      - throughput
      - latency
      - errors
      - heap
      - rss
      - gc-pauses
      - gc-frequency

  decision:
    allowed:
      - approve
      - reject
      - inconclusive

  rollback:
    required

  profiling:
    deferredToLesson574
```

O contrato bloqueia tuning sem objetivo mensurável.

---

### 3. Definir o objetivo

Objetivos válidos incluem reduzir full GC ou pausas, evitar OOM, preservar headroom e reduzir reinícios. “Melhorar a JVM” não é mensurável.

O objetivo precisa ser observável.

---

### 4. Criar budget de recursos

Arquivo:

```text
jvm-resource-budget.yaml
```

Exemplo didático:

```yaml
resourceBudget:
  environment:
    local-laboratory

  memory:
    processLimit:
      1024MiB

    heapMaximumTarget:
      640MiB

    nativeHeadroomMinimum:
      256MiB

    operatingMargin:
      128MiB

  cpu:
    availableProcessors:
      4

  workload:
    requestRate:
      controlled

  productionValues:
    undefined
```

Os números são didáticos, não recomendação de produção.

---

### 5. Entender o budget de memória

A memória do processo inclui heap, metaspace, code cache, thread stacks, direct buffers, bibliotecas, estruturas de GC e overhead.

Por isso:

```text
Xmx
=
limite total do container
```

é uma configuração perigosa.

A JVM e a aplicação precisam de headroom.

---

### 6. Criar política de headroom

Arquivo:

```text
jvm-native-headroom-policy.yaml
```

Conteúdo:

```yaml
nativeHeadroom:
  include:
    - metaspace
    - code-cache
    - thread-stacks
    - direct-buffers
    - native-libraries
    - gc-structures
    - monitoring-agent
    - safety-margin

  minimum:
    measured:
      required

  XmxEqualsContainerLimit:
    forbidden

  unknownNativeUsage:
    result:
      conservative-budget
```

Headroom precisa ser medido e revisado.

---

### 7. Inspecionar memória efetiva

Script:

```text
inspect-jvm-effective-flags.ps1
```

Comando base:

```powershell
java `
  -XX:+PrintFlagsFinal `
  -version
```

Filtre:

```powershell
java `
  -XX:+PrintFlagsFinal `
  -version `
| Select-String `
    "InitialHeapSize|MaxHeapSize|UseG1GC|MaxGCPauseMillis|ActiveProcessorCount|MaxRAMPercentage|InitialRAMPercentage"
```

Registre valores efetivos.

Não confie apenas no arquivo `.env`.

---

### 8. Inspecionar o processo

Script:

```text
inspect-process-memory.ps1
```

No Windows:

```powershell
Get-Process `
  -Id `
  $pid `
| Select-Object `
    Id,
    ProcessName,
    WorkingSet64,
    PrivateMemorySize64,
    PagedMemorySize64,
    CPU
```

Use RSS ou working set como sinal operacional.

Não trate como soma exata de categorias internas.

---

### 9. Inspecionar componentes nativos

Quando disponível e iniciado com Native Memory Tracking, use:

```text
-XX:NativeMemoryTracking=summary
```

Depois:

```powershell
jcmd `
  $pid `
  VM.native_memory `
  summary
```

NMT possui custo e precisa de decisão explícita.

No laboratório, ele pode ser usado em profile próprio.

Não altere a baseline silenciosamente.

---

### 10. Criar perfil baseline

Arquivo:

```text
profiles/baseline.env
```

Conteúdo:

```text
JAVA_TOOL_OPTIONS=
APP_JVM_PROFILE=baseline
```

O objetivo é permitir que ergonomics da JVM escolha valores.

Registre memória, CPU, heaps efetivos, collector, pause target e métricas.

---

### 11. Criar perfil de heap pequeno

Arquivo:

```text
profiles/small-heap.env
```

Exemplo didático:

```text
JAVA_TOOL_OPTIONS=-Xms256m -Xmx256m -Xlog:gc*
APP_JVM_PROFILE=small-heap
```

Esse perfil é apenas comparativo. Observe GC, pausas, full GC, piso pós-GC, throughput, latência, RSS e risco de OOM.

---

### 12. Criar perfil balanceado

Arquivo:

```text
profiles/balanced-heap.env
```

Exemplo:

```text
JAVA_TOOL_OPTIONS=-Xms384m -Xmx640m -Xlog:gc*
APP_JVM_PROFILE=balanced-heap
```

Valide contra o budget de 1 GiB do laboratório.

Confirme que sobra margem para memória nativa e picos.

---

### 13. Entender `-Xms`

`-Xms` define o heap inicial.

Valor menor reduz reserva inicial, mas permite crescimento durante aquecimento. Igualar a `-Xmx` aumenta previsibilidade e compromisso de memória, sem ser automaticamente melhor.

A decisão depende de:

- ambiente;
- densidade;
- startup;
- carga;
- previsibilidade;
- orçamento.

---

### 14. Entender `-Xmx`

`-Xmx` limita o heap.

Valor pequeno demais aumenta GC, full GC, perda de throughput e OOM. Grande demais consome headroom, eleva RSS, pode ampliar pausas e adiar detecção de leak.

Mais heap não corrige retenção.

---

### 15. Criar política de heap sizing

Arquivo:

```text
jvm-heap-sizing-policy.yaml
```

Conteúdo:

```yaml
heapSizing:
  inputs:
    - process-memory-limit
    - measured-live-set
    - allocation-rate
    - native-usage
    - traffic
    - pause-objective
    - throughput-objective

  Xms:
    equalToXmx:
      optional

  Xmx:
    belowProcessLimit:
      required

  safety:
    nativeHeadroom:
      required

  validation:
    beforeAfter:
      required

  fixedProductionValue:
    undefined
```

---

### 16. Usar percentuais em containers

Arquivo:

```text
profiles/percentage-heap.env
```

Exemplo:

```text
JAVA_TOOL_OPTIONS=-XX:InitialRAMPercentage=35 -XX:MaxRAMPercentage=62.5 -Xlog:gc*
APP_JVM_PROFILE=percentage-heap
```

Percentuais adaptam o heap ao limite detectado, mas podem produzir headroom insuficiente ou comportamento diferente entre ambientes.

Percentual ainda exige budget.

---

### 17. Criar política de container memory

Arquivo:

```text
jvm-container-memory-policy.yaml
```

Conteúdo:

```yaml
containerMemory:
  verify:
    - detected-memory
    - configured-limit
    - effective-max-heap
    - rss
    - native-headroom

  percentageFlags:
    allowed:
      true

  MaxRAMPercentage:
    requiresBudget:
      true

  noMemoryLimit:
    action:
      define-runtime-guardrail

  containerKill:
    classifySeparatelyFromJavaOOM:
      true
```

Java OOM e container OOM kill são eventos diferentes.

---

### 18. Verificar container awareness

Em container controlado, execute:

```powershell
java `
  -XshowSettings:system `
  -version
```

E:

```powershell
java `
  -XshowSettings:vm `
  -version
```

Compare:

- memory limit;
- effective heap;
- CPU count;
- flags;
- ambiente host.

Quando o processo estiver fora de container, registre a diferença.

---

### 19. Entender G1 como baseline

O G1 organiza o heap em regiões.

G1 busca pausas previsíveis, coleta incremental, trabalho concorrente e recuperação de regiões antigas.

Tuning básico não começa alterando dezenas de parâmetros internos.

Começa por:

- heap adequado;
- pause target realista;
- CPU suficiente;
- headroom;
- GC logs;
- workload estável.

---

### 20. Criar política G1 básica

Arquivo:

```text
jvm-g1-basic-policy.yaml
```

Conteúdo:

```yaml
g1:
  baseline:
    explicitUseG1GC:
      optionalOnJdk21

  tuneFirst:
    - heap-budget
    - workload
    - pause-target
    - cpu-budget

  avoidFirst:
    - manual-region-size
    - manual-young-size
    - survivor-ratio
    - tenuring-threshold
    - gc-thread-counts

  internalFlags:
    requireAdvancedEvidence:
      true
```

Não altere internals sem evidência.

---

### 21. Entender pause target

`-XX:MaxGCPauseMillis` é uma meta para o G1.

Não é:

- limite rígido;
- SLA;
- timeout;
- garantia;
- substituto de heap sizing.

Meta agressiva pode aumentar frequência e CPU e reduzir throughput; meta relaxada pode permitir pausas maiores.

A decisão precisa considerar a jornada do serviço.

---

### 22. Criar perfil de pause target

Arquivo:

```text
profiles/pause-target.env
```

Exemplo didático:

```text
JAVA_TOOL_OPTIONS=-Xms384m -Xmx640m -XX:MaxGCPauseMillis=100 -Xlog:gc*
APP_JVM_PROFILE=pause-target
```

Compare com o perfil balanceado.

Mude apenas o pause target.

Não altere heap e pause target no mesmo experimento.

---

### 23. Criar política de pause target

Arquivo:

```text
jvm-pause-target-policy.yaml
```

Conteúdo:

```yaml
pauseTarget:
  objective:
    required

  compare:
    - pause-p95
    - pause-max
    - throughput
    - gc-frequency
    - cpu
    - latency

  aggressiveTarget:
    risk:
      throughput-and-cpu

  targetAsGuarantee:
    forbidden

  finalProductionValue:
    undefined
```

---

### 24. Entender CPU detectada

A JVM usa a CPU detectada em GC, JIT, common pools, ergonomics e paralelismo.

Em container, CPU quota pode reduzir processadores disponíveis.

Verifique:

```powershell
java `
  -XshowSettings:system `
  -version
```

E dentro da aplicação:

```java
Runtime
    .getRuntime()
    .availableProcessors();
```

---

### 25. Usar `ActiveProcessorCount` com cautela

Exemplo de laboratório:

```text
-XX:ActiveProcessorCount=2
```

Essa flag pode ser útil quando:

- ambiente reporta CPU incorreta;
- teste precisa simular CPU menor;
- ergonomics precisa ser reproduzida.

Riscos:

- paralelismo reduzido;
- GC mais lento;
- common pool menor;
- throughput menor;
- comportamento artificial.

Não use para “liberar CPU” sem medição.

---

### 26. Criar política de CPU

Arquivo:

```text
jvm-cpu-policy.yaml
```

Conteúdo:

```yaml
cpu:
  verify:
    - host-or-container-limit
    - jvm-detected-processors
    - application-detected-processors
    - process-cpu
    - throttling
    - throughput

  ActiveProcessorCount:
    allowedForLaboratory:
      true

    production:
      requiresPlatformEvidence

  manualGcThreads:
    basicTuning:
      forbidden
```

Quantidade manual de GC threads fica fora do tuning básico.

---

### 27. Entender memória além do heap

Memória nativa inclui metaspace, code cache, stacks, direct buffers, bibliotecas, agents, JIT e estruturas de GC.

Aumentar `Xmx` reduz margem para essas categorias.

Por isso, monitore:

- heap;
- RSS;
- thread count;
- direct buffers;
- metaspace;
- container memory.

---

### 28. Criar política de OOM

Arquivo:

```text
jvm-oom-policy.yaml
```

Conteúdo:

```yaml
oom:
  HeapDumpOnOutOfMemoryError:
    laboratory:
      allowed

  heapDumpPath:
    temporary-and-protected

  ExitOnOutOfMemoryError:
    recommendedForControlledRestart:
      evaluate

  CrashOnOutOfMemoryError:
    basicPolicy:
      disabledUnlessRequired

  OnOutOfMemoryError:
    shellCommand:
      forbiddenWithoutSecurityReview

  containerKill:
    separateClassification:
      required

  automaticRestart:
    requiresLoopProtection:
      true
```

OOM é falha grave.

A resposta precisa evitar processo parcialmente degradado e restart loop.

---

### 29. Configurar heap dump em OOM

Perfil didático:

```text
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=.tmp/heap-dumps/oom.hprof
```

Regras:

- diretório protegido;
- espaço validado;
- arquivo fora do Git;
- cleanup;
- acesso mínimo;
- sem produção sem aprovação.

Essa opção reutiliza a governança da aula 571.

---

### 30. Avaliar `ExitOnOutOfMemoryError`

Flag:

```text
-XX:+ExitOnOutOfMemoryError
```

Ela encerra a JVM após OOM.

A flag pode evitar processo inconsistente e permitir restart, mas traz risco de loop, indisponibilidade e perda de trabalho em andamento.

A decisão depende da arquitetura e do mecanismo de recuperação.

---

### 31. Criar política de mudança

Arquivo:

```text
jvm-change-policy.yaml
```

Conteúdo:

```yaml
change:
  oneVariableAtATime:
    required

  hypothesis:
    required

  baseline:
    required

  scenario:
    reproducible:
      required

  warmup:
    required

  repetitions:
    minimum:
      3

  confidence:
    required

  approval:
    basedOnAcceptanceCriteria

  rejectedChange:
    rollbackImmediately
```

Uma única execução pode sofrer ruído.

Repita o cenário.

---

### 32. Criar política de comparação

Arquivo:

```text
jvm-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  equivalent:
    - workload
    - request-count
    - duration
    - JDK
    - collector
    - release
    - environment
    - warmup
    - dataset

  compare:
    - latency-p50
    - latency-p95
    - latency-p99
    - throughput
    - errors
    - gc-pause-p95
    - gc-pause-max
    - gc-frequency
    - post-gc-floor
    - rss
    - cpu

  mixedChanges:
    result:
      invalid-comparison
```

---

### 33. Definir warmup

Uma medição logo após startup inclui class loading, compilação, caches e conexões frias.

Antes do cenário:

1. aguarde readiness;
2. execute tráfego de aquecimento;
3. confirme estabilidade;
4. marque início da medição;
5. preserve a mesma duração.

Não use warmup infinito para esconder startup.

---

### 34. Executar baseline

Script:

```text
run-jvm-tuning-baseline.ps1
```

Fluxo:

1. aplicar `baseline.env`;
2. iniciar aplicação;
3. validar flags;
4. aquecer;
5. executar carga;
6. coletar métricas;
7. coletar GC logs;
8. coletar RSS;
9. encerrar;
10. registrar resultado.

Repita pelo menos três vezes.

---

### 35. Comparar heaps

Script:

```text
run-jvm-heap-comparison.ps1
```

Perfis:

```text
baseline;

small-heap;

balanced-heap;

percentage-heap.
```

Mantenha:

- mesma release;
- mesma carga;
- mesma duração;
- mesmo dataset;
- mesmo JDK;
- mesmo collector;
- mesmo warmup.

Compare OOM, full GC, pausas, frequência, piso pós-GC, latência, throughput, CPU, RSS e headroom.

---

### 36. Interpretar heap pequeno

Possível padrão:

```text
small heap;

young GC frequente;

mixed GC frequente;

piso pós-GC perto do máximo;

full GC;

throughput reduzido.
```

Conclusão possível:

```text
heap insuficiente
para o live set
e a carga do cenário.
```

Confirme com:

- heap dump;
- GC logs;
- RSS;
- métricas;
- repetição.

---

### 37. Interpretar heap maior

Possível padrão:

```text
menos GCs;

maior RSS;

mais headroom consumido;

pausas semelhantes;

throughput estável.
```

Se não houver melhoria relevante, o heap maior pode não se justificar.

Mais memória precisa produzir benefício mensurável.

---

### 38. Comparar pause target

Script:

```text
run-jvm-pause-target-comparison.ps1
```

Compare:

```text
default ergonomics;

MaxGCPauseMillis=100.
```

Mantenha o mesmo heap.

Analise:

- p95 de pausa;
- máximo;
- frequência;
- CPU;
- throughput;
- latência;
- mixed cycles;
- heap occupancy.

Resultado pode ser:

```text
melhor pausa,
pior throughput;

sem diferença;

melhora equilibrada;

inconclusivo.
```

---

### 39. Comparar memória por percentual

Script:

```text
run-jvm-container-memory-comparison.ps1
```

Execute com limites controlados.

Valide:

- memória detectada;
- heap máximo efetivo;
- RSS;
- headroom;
- container limit;
- OOM Java;
- container kill;
- comportamento após alteração do limite.

Não compare container e host sem registrar o contexto.

---

### 40. Criar critérios de aprovação

Exemplo:

```yaml
acceptance:
  noOutOfMemory:
    required

  noUnexpectedFullGc:
    required

  latencyP95:
    regressionMaximum:
      5-percent

  throughput:
    regressionMaximum:
      3-percent

  rss:
    belowProcessBudget:
      required

  nativeHeadroom:
    aboveMinimum:
      required

  repetitions:
    minimum:
      3
```

Os percentuais são didáticos.

Cada serviço precisa de critérios próprios.

---

### 41. Analisar resultado

Script:

```text
analyze-jvm-tuning-result.ps1
```

Classifique:

```text
APPROVE;

REJECT;

INCONCLUSIVE.
```

Aprovar exige objetivo atendido, riscos dentro do budget, repetição consistente, ausência de regressão crítica, rollback e evidence.

Inconclusivo não significa sucesso.

---

### 42. Criar política de rollback

Arquivo:

```text
jvm-rollback-policy.yaml
```

Conteúdo:

```yaml
rollback:
  source:
    last-approved-profile

  trigger:
    - startup-failure
    - OOM
    - container-kill
    - latency-regression
    - throughput-regression
    - unexpected-full-gc
    - native-headroom-breach
    - evidence-inconclusive

  validation:
    - effective-flags-restored
    - service-ready
    - metrics-normal
    - gc-baseline-restored

  destructiveCleanup:
    forbidden
```

---

### 43. Validar rollback

Script:

```text
validate-jvm-tuning-rollback.ps1
```

Fluxo:

1. aplicar perfil experimental;
2. validar flag efetiva;
3. executar cenário curto;
4. encerrar;
5. aplicar `rollback.env`;
6. iniciar;
7. validar flags baseline;
8. validar health;
9. validar GC logs;
10. registrar resultado.

Rollback precisa ser testado antes de depender dele.

---

### 44. Criar perfil de rollback

Arquivo:

```text
profiles/rollback.env
```

Conteúdo:

```text
JAVA_TOOL_OPTIONS=
APP_JVM_PROFILE=rollback-baseline
```

Se a baseline aprovada possui flags explícitas, registre-as integralmente.

Não dependa de memória humana.

---

### 45. Diferenciar Java OOM e container kill

Java OOM pode produzir:

```text
java.lang.OutOfMemoryError
```

Container kill pode encerrar o processo externamente, frequentemente sem stack trace Java completo.

Investigue:

- exit code;
- eventos do runtime;
- memory limit;
- RSS;
- heap;
- native headroom;
- logs;
- dump;
- restart count.

A solução para um não é automaticamente a solução para o outro.

---

### 46. Evitar flag cargo cult

Cargo cult aparece como muitas flags sem hipótese, opções antigas, collector por popularidade, `Xmx` uniforme, pause target sem objetivo e ausência de comparação ou rollback.

Tuning precisa ser específico para:

- workload;
- JDK;
- collector;
- ambiente;
- limite;
- objetivo.

---

### 47. Criar política de qualidade

Arquivo:

```text
jvm-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingBaseline:
    action:
      block-decision

  differentWorkload:
    result:
      invalid-comparison

  insufficientRepetitions:
    result:
      inconclusive

  missingEffectiveFlags:
    result:
      limited

  missingRss:
    result:
      native-risk-unknown

  warmupMismatch:
    result:
      invalid-comparison

  GCLogGap:
    result:
      partial

  profilerRequired:
    deferredToLesson574
```

---

### 48. Criar política de segurança

Arquivo:

```text
jvm-security-policy.yaml
```

Conteúdo:

```yaml
security:
  commandLine:
    credentials:
      forbidden

  JAVA_TOOL_OPTIONS:
    secrets:
      forbidden

  heapDump:
    sensitive:
      true

  rawGcLogs:
    repository:
      forbidden

  environmentFiles:
    credentials:
      forbidden

  evidence:
    commandLineComplete:
      forbidden

  productionChange:
    approval:
      required
```

Flags podem aparecer em command line e logs.

Não coloque Secrets nelas.

---

### 49. Criar failure policy

Arquivo:

```text
jvm-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidFlag:
    action:
      block-start

  startupFailure:
    action:
      rollback

  OOM:
    action:
      preserve-evidence-and-rollback

  containerKill:
    action:
      classify-memory-budget

  repeatedFullGc:
    action:
      reject-change

  noHeadroom:
    action:
      reject-change

  inconsistentRuns:
    result:
      inconclusive

  profilingNeed:
    deferToLesson574
```

---

### 50. Criar cenários

Arquivo:

```text
jvm-tuning-scenarios.yaml
```

Cenários:

```text
baseline;

small-heap;

balanced-heap;

percentage-heap;

pause-target;

cpu-limited;

retained-live-set;

short-lived-allocation;

rollback;

invalid-flag;

container-memory-pressure.
```

Cada cenário registra objetivo, hipótese, profile, recursos, workload, warmup, repetições, medidas, aceite, rollback, cleanup e evidence.

---

### 51. Simular heap pequeno

Execute o cenário controlado.

Valide:

- flags efetivas;
- heap;
- GC frequency;
- pause distribution;
- full GC;
- throughput;
- latency;
- RSS;
- ausência de OOM fora do cenário previsto.

Não force OOM quando a aula pode validar pressão sem esgotamento.

---

### 52. Simular perfil balanceado

Execute com o mesmo workload.

Valide:

- headroom;
- menor pressão;
- estabilidade;
- RSS dentro do budget;
- benefício mensurável;
- nenhuma regressão de startup;
- nenhuma full GC inesperada.

Aprovação depende do conjunto.

---

### 53. Simular pause target

Mude apenas:

```text
-XX:MaxGCPauseMillis.
```

Compare três execuções.

Se a pausa melhorar, mas throughput e CPU piorarem significativamente, a decisão pode ser rejeitar.

Objetivos conflitantes precisam ser explícitos.

---

### 54. Simular CPU limitada

Use apenas no laboratório:

```text
-XX:ActiveProcessorCount=2
```

Observe:

- GC duration;
- throughput;
- common pool;
- latency;
- CPU;
- queue;
- thread count.

O objetivo é entender ergonomics.

Não definir uma recomendação final.

---

### 55. Criar matriz de testes

Arquivo:

```text
JVM_TUNING_TEST_MATRIX.md
```

Cenários:

- baseline;
- effective flags;
- resource budget;
- native headroom;
- fixed heap;
- percentage heap;
- small heap;
- balanced heap;
- pause target;
- CPU detection;
- `ActiveProcessorCount`;
- GC logs;
- RSS;
- throughput;
- latency;
- OOM policy;
- Java OOM;
- container kill;
- invalid flag;
- rollback;
- repetitions;
- warmup;
- security scan;
- evidence sanitizada.

---

### 56. Criar troubleshooting

Arquivo:

```text
JVM_TUNING_TROUBLESHOOTING.md
```

Inclua:

- flag não reconhecida;
- aplicação não inicia;
- heap efetivo diferente;
- container limit não detectado;
- RSS ultrapassa budget;
- `Xmx` cabe, mas processo é morto;
- GC fica mais frequente;
- pause target não é respeitado;
- throughput cai;
- full GC aparece;
- NMT indisponível;
- runs variam;
- warmup inconsistente;
- perfil errado;
- rollback não restaura flags;
- Secret aparece em command line;
- JFR antecipado.

---

### 57. Coletar evidence

Script:

```text
collect-jvm-tuning-evidence.ps1
```

Arquivo:

```text
jvm-tuning-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release, JDK, collector, profile e status de recursos, heap, headroom, pausas, throughput, latência, full GC, RSS, comparação, rollback, segurança, testes e decisão.

Não inclua:

- command line completa;
- PIDs;
- credentials;
- heap dumps;
- GC logs brutos;
- dados pessoais;
- flags de produção definitivas.

---

### 58. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\runtime\jvm-tuning\validate-jvm-tuning-options.ps1

.\scripts\runtime\jvm-tuning\inspect-jvm-effective-flags.ps1

.\scripts\runtime\jvm-tuning\inspect-process-memory.ps1

.\scripts\runtime\jvm-tuning\validate-resource-budget.ps1

.\scripts\runtime\jvm-tuning\run-jvm-tuning-baseline.ps1

.\scripts\runtime\jvm-tuning\run-jvm-heap-comparison.ps1

.\scripts\runtime\jvm-tuning\run-jvm-pause-target-comparison.ps1

.\scripts\runtime\jvm-tuning\run-jvm-container-memory-comparison.ps1

.\scripts\runtime\jvm-tuning\analyze-jvm-tuning-result.ps1

.\scripts\runtime\jvm-tuning\validate-jvm-tuning-rollback.ps1

.\scripts\runtime\jvm-tuning\scan-jvm-tuning-output.ps1

.\scripts\runtime\jvm-tuning\collect-jvm-tuning-evidence.ps1

.\scripts\runtime\jvm-tuning\verify-jvm-tuning-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- budget aprovado;
- flags válidas;
- valores efetivos conhecidos;
- baseline repetida;
- heap comparado;
- percentuais comparados;
- pause target comparado;
- CPU detectada;
- headroom preservado;
- OOM policy aprovada;
- rollback aprovado;
- segurança aprovada;
- evidence sanitizada;
- JFR não antecipado.

---

### 59. Encerrar o laboratório

Pare os cenários.

Encerre processos Java controlados.

Remova apenas artifacts temporários:

```powershell
Remove-Item `
  .tmp/jvm-tuning `
  -Recurse `
  -Force

Remove-Item `
  .tmp/gc-logs `
  -Recurse `
  -Force
```

Se existir heap dump de OOM didático, aplique a política da aula 571.

Antes:

- confirme os paths;
- colete evidence;
- preserve profiles;
- preserve scripts;
- preserve docs;
- confirme que nenhum artifact bruto está no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### Tuning ganhou objetivo

Flags deixaram de ser escolhidas por costume.

### Heap ganhou budget

`Xmx` passou a respeitar memória total e headroom nativo.

### Valores efetivos ganharam validação

Configuração declarada deixou de ser confundida com configuração usada.

### Containers ganharam contexto

Memória e CPU detectadas passaram a ser comparadas aos limites reais.

### G1 ganhou fronteira básica

Heap, pause target, CPU e workload foram priorizados antes de internals.

### Pause target ganhou custo

Pausas menores passaram a ser comparadas com CPU e throughput.

### OOM ganhou política

Java OOM e container kill passaram a ser classificados separadamente.

### Experimentos ganharam isolamento

Uma variável por vez permitiu atribuir resultado.

### Comparações ganharam equivalência

Warmup, workload, release, JDK e duração passaram a ser controlados.

### Rollback ganhou teste

O perfil anterior deixou de depender de memória humana.

### A próxima aula ganhou necessidade clara

Quando GC logs e métricas não explicarem hot methods, alocações ou locks, o JFR aprofundará o diagnóstico.

---

## Erros comuns importantes

### Copiar flags de outra empresa

Workload, JDK e limites são diferentes.

### Colocar `Xmx` igual ao limite do container

Memória nativa fica sem headroom.

### Alterar várias flags

A causa do resultado fica desconhecida.

### Assumir que pause target é garantia

Ele é uma meta ergonômica.

### Aumentar heap para corrigir leak

A falha apenas demora mais para aparecer.

### Ignorar RSS

O heap pode estar saudável enquanto o processo excede o limite.

### Comparar workloads diferentes

O experimento perde validade.

### Executar apenas uma vez

Ruído pode parecer melhoria.

### Não testar rollback

A reversão pode falhar durante incidente.

### Antecipar profiling JFR

Hot methods e allocation profiling pertencem à aula 574.

---

## Comandos úteis

### Ver flags efetivas

```powershell
java `
  -XX:+PrintFlagsFinal `
  -version
```

### Ver recursos detectados

```powershell
java `
  -XshowSettings:system `
  -XshowSettings:vm `
  -version
```

### Ver memória do processo

```powershell
Get-Process `
  -Id `
  <PID>
```

### Consultar NMT

```powershell
jcmd `
  <PID> `
  VM.native_memory `
  summary
```

### Executar comparação

```powershell
.\scripts\runtime\jvm-tuning\run-jvm-heap-comparison.ps1
```

---

## Exercício guiado

### Parte 1 — Baseline

Registre flags, heap, CPU, RSS e GC.

### Parte 2 — Budget

Defina limite, headroom e margem.

### Parte 3 — Heap

Compare baseline, small e balanced.

### Parte 4 — Percentage

Valide percentuais no limite detectado.

### Parte 5 — Pause target

Altere apenas uma meta.

### Parte 6 — CPU

Simule processadores menores.

### Parte 7 — OOM

Defina captura e encerramento controlado.

### Parte 8 — Comparison

Repita workload equivalente.

### Parte 9 — Rollback

Restaure o perfil aprovado.

### Parte 10 — Gate

Valide segurança, evidence e decisão.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 572 e ponte para a aula 574 foram preservadas;
- JVM tuning, baseline, hypothesis, heap, native memory, headroom, `-Xms`, `-Xmx`, RAM percentages, pause target, throughput, ergonomics, container awareness, RSS, metaspace, code cache, direct buffer, OOM, rollback e change isolation foram definidos;
- baseline foi validada;
- contrato de tuning foi criado;
- objetivo mensurável foi exigido;
- budget de memória foi criado;
- memória total do processo foi diferenciada do heap;
- política de headroom foi criada;
- `Xmx` igual ao limite foi proibido;
- flags efetivas foram inspecionadas;
- RSS foi inspecionado;
- NMT foi tratado como ferramenta opcional e controlada;
- `-Xms` foi explicado;
- `-Xmx` foi explicado;
- política de heap sizing foi criada;
- container awareness foi validado;
- Java OOM e container kill foram diferenciados;
- G1 foi mantido como baseline;
- política G1 básica foi criada;
- internals não foram alterados;
- pause target foi explicado como meta;
- política de pause target foi criada;
- CPU detectada foi validada;
- `ActiveProcessorCount` foi testado apenas no laboratório;
- quantidade manual de GC threads foi proibida no tuning básico;
- memória nativa foi considerada;
- política de OOM foi criada;
- heap dump em OOM reutiliza governança da aula 571;
- `ExitOnOutOfMemoryError` foi avaliado com riscos;
- política de mudança foi criada;
- uma variável por vez foi exigida;
- mínimo de três repetições foi definido;
- política de comparação foi criada;
- warmup foi padronizado;
- critérios de aprovação foram criados;
- resultado foi classificado como approve, reject ou inconclusive;
- política de rollback foi criada;
- rollback foi validado;
- cargo cult foi rejeitado;
- política de qualidade foi criada;
- política de segurança foi criada;
- Secrets em flags foram proibidos;
- failure policy foi criada;
- cenários foram catalogados;
- nenhum Secret, dado pessoal, ambiente real ou artifact bruto foi commitado;
- profiling com JFR não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/runtime/jvm-tuning `
  scripts/runtime/jvm-tuning `
  docs/runtime/jvm-tuning `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|private_key|\.hprof|\.tmp/gc-logs"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar tuning basico da JVM"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- heap dumps;
- GC logs brutos;
- PIDs;
- command lines completas;
- credentials;
- valores definitivos de produção;
- gravações JFR;
- material da aula 574.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou métricas, heap dumps e GC logs em experimentos básicos de JVM tuning.

Você trabalhou com:

```text
baseline;

resource budget;

-Xms;

-Xmx;

RAM percentages;

native headroom;

container awareness;

G1;

pause target;

CPU detection;

OOM policy;

before/after;

rollback.
```

Você comprovou que tuning precisa de objetivo e hipótese; heap não representa toda a memória do processo; `Xmx` precisa deixar margem para memória nativa; percentuais dependem do limite detectado; G1 deve ser ajustado primeiro por heap, workload, CPU e pause target; pause target não é garantia; valores maiores não são automaticamente melhores; Java OOM e container kill são diferentes; uma variável por vez melhora a causalidade do experimento; repetições e warmup reduzem ruído; e rollback precisa ser testado.

A próxima aula será:

```text
574 - M18.19 - Profiling com JFR
```

Nela, você irá usar Java Flight Recorder para investigar CPU, métodos quentes, alocações, locks, threads, I/O e comportamento temporal com baixo overhead e análise no JDK Mission Control.

Nenhuma gravação JFR, evento customizado, flame graph, hot method, allocation profile, lock profile ou análise no Mission Control foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Registrei baseline e objetivo.
- [ ] Defini budget e headroom.
- [ ] Comparei heaps.
- [ ] Validei percentuais.
- [ ] Comparei pause target.
- [ ] Validei CPU e OOM policy.
- [ ] Testei rollback.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### `Xmx` efetivo não corresponde ao perfil

Revise `JAVA_TOOL_OPTIONS`, argumentos da linha de comando e ergonomics.

### O processo excede o limite com heap baixo

Investigue memória nativa, threads, direct buffers, agents e metaspace.

### O perfil percentual muda entre ambientes

Confirme memória detectada e limites.

### O pause target não reduz o p95

Analise heap, workload, CPU e comportamento do collector.

### O throughput cai

Compare frequência de GC, CPU e tamanho do trabalho por pausa.

### O processo recebe container kill

Revise RSS e headroom, não apenas heap.

### A comparação varia muito

Padronize warmup, carga, duração e repetições.

### O rollback não restaura a baseline

Valide flags efetivas e origem de configuração.

### Uma flag aparece removida

Consulte o JDK 21 e remova opção obsoleta.

### A investigação começou a procurar hot methods

Preserve esse aprofundamento para a aula 574.

---

## Perguntas de revisão

1. O que é JVM tuning?
2. O que é baseline?
3. O que é hypothesis?
4. Qual diferença entre heap e memória do processo?
5. O que é headroom?
6. Para que serve `-Xms`?
7. Para que serve `-Xmx`?
8. O que faz `MaxRAMPercentage`?
9. O que é container awareness?
10. O que é pause target?
11. Por que ele não é garantia?
12. O que é RSS?
13. O que é NMT?
14. Por que alterar uma variável por vez?
15. Por que repetir o cenário?
16. Qual diferença entre Java OOM e container kill?
17. Quando aprovar uma mudança?
18. Quando reverter?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Ajuste baseado em evidência.
2. Resultado de referência.
3. Explicação testável.
4. Heap é apenas uma categoria.
5. Margem para memória nativa.
6. Definir heap inicial.
7. Limitar heap máximo.
8. Calcula heap pela memória detectada.
9. Respeitar limites do container.
10. Meta ergonômica de pausa.
11. Collector equilibra vários objetivos.
12. Memória residente.
13. Native Memory Tracking.
14. Atribuir resultado.
15. Reduzir ruído.
16. Exceção Java versus término externo.
17. Quando objetivo e budget são atendidos.
18. Quando há regressão ou risco.
19. Profiling com JFR.
20. Profiling com JFR.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 573 - M18.18 - JVM tuning basico

- Continuei após GC logs.
- Entendi tuning como experimento orientado por evidências.
- Criei contrato com objetivo, hipótese, baseline, medidas e rollback.
- Defini budget de memória e CPU.
- Diferenciei heap e memória total do processo.
- Criei política de native headroom.
- Inspecionei flags efetivas da JVM.
- Inspecionei RSS do processo.
- Estudei Native Memory Tracking como recurso controlado.
- Criei profiles baseline, small heap, balanced heap e percentage heap.
- Estudei `-Xms` e `-Xmx`.
- Criei política de heap sizing.
- Testei `InitialRAMPercentage` e `MaxRAMPercentage`.
- Validei container awareness.
- Diferenciei Java OOM e container kill.
- Mantive G1 como baseline.
- Criei política de tuning básico do G1.
- Entendi `MaxGCPauseMillis` como meta, não garantia.
- Comparei pause target com heap constante.
- Validei CPU detectada.
- Usei `ActiveProcessorCount` somente para simulação.
- Considerei metaspace, code cache, thread stacks e direct buffers.
- Criei política de OOM.
- Avaliei heap dump e exit em OOM.
- Exigi uma variável por experimento.
- Padronizei warmup e repetições.
- Comparei heap, percentuais, pausa, RSS, throughput e latência.
- Classifiquei mudanças como approve, reject ou inconclusive.
- Criei e testei rollback.
- Rejeitei cargo cult de flags.
- Criei políticas de qualidade, segurança e failure.
- Coletei evidence sanitizada.
- Não antecipei profiling com JFR.
- Próxima aula: Profiling com JFR.
```

---

## Referência técnica curta

- JVM Ergonomics.
- `-Xms` and `-Xmx`.
- `InitialRAMPercentage`.
- `MaxRAMPercentage`.
- G1 GC.
- `MaxGCPauseMillis`.
- Container Awareness.
- Native Memory Tracking.
- OutOfMemoryError Policies.
- Evidence-Based JVM Tuning.

Regra final:

```text
tuning básico da JVM precisa ser tratado como experimento controlado: objetivo, hipótese, baseline, workload, warmup, repetições, métricas, critérios e rollback são obrigatórios, e apenas uma variável muda por vez; heap é apenas parte da memória do processo, portanto Xmx, percentuais e limites de container precisam preservar headroom para metaspace, code cache, stacks, direct buffers, agentes e estruturas nativas, enquanto RSS e memória detectada validam o budget; G1 permanece baseline e seus primeiros controles são heap, workload, CPU e pause target, que é meta e não garantia; Java OOM e container kill são classificados separadamente, mudanças são aprovadas somente quando melhoram o objetivo sem violar throughput, latência, full GC, RSS ou margem nativa, e rollback restaura flags efetivas já testadas; artifacts brutos e Secrets permanecem fora do Git, deixando para a aula 574 o profiling com Java Flight Recorder, hot methods, alocações, locks, I/O e análise temporal no Mission Control.
```
