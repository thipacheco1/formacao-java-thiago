# 574 - M18.19 - Profiling com JFR

## Apresentação da aula

Na aula 573, você tratou JVM tuning como experimento controlado.

Foram definidos:

```text
objetivo;

hipótese;

baseline;

budget de memória;

headroom nativo;

workload;

warmup;

repetições;

métricas;

critérios de aprovação;

rollback.
```

Você comparou:

- `-Xms`;
- `-Xmx`;
- percentuais de RAM;
- pause target;
- CPU detectada;
- RSS;
- throughput;
- latência;
- frequência de GC;
- full GC;
- risco de OOM.

Essas fontes mostram sintomas e tendências.

Entretanto, algumas perguntas continuam abertas:

```text
quais métodos
consomem CPU?

onde ocorrem
as alocações?

quais locks
geram contenção?

quais threads
bloqueiam?

quais operações de arquivo,
socket ou monitor
dominam a janela?

qual comportamento
começou após a release?
```

Para responder com baixo overhead, a JVM oferece o **Java Flight Recorder**.

O JFR registra eventos produzidos pela JVM e pela aplicação.

Uma gravação pode conter:

```text
CPU samples;

execution samples;

object allocations;

garbage collections;

thread parks;

monitor enter;

socket read e write;

file read e write;

class loading;

compilation;

exceptions;

thread starts;

thread ends;

environment metadata;

custom events.
```

A pergunta central desta aula será:

```text
como capturar
uma gravação JFR

de forma segura,
limitada,
reproduzível
e correlacionável,

sem transformar
profiling
em uma nova causa
de instabilidade?
```

O JFR não deve ser acionado sem contexto. Antes da captura, defina sintoma, serviço, ambiente, release, janela, duração, workload, settings, destino, limites, autorização, hipótese e cleanup.

O fluxo será validar ferramentas, criar baseline, capturar o cenário, marcar eventos, fazer dump ou stop, validar, resumir, comparar, sanitizar e limpar artifacts.

Você utilizará:

```text
jcmd JFR.start;

jcmd JFR.check;

jcmd JFR.dump;

jcmd JFR.stop;

java -XX:StartFlightRecording;

jfr summary;

jfr print;

jfr configure.
```

O formato produzido será:

```text
.jfr
```

Eventos customizados marcarão início, fim, operação, release, profile, resultado e fase, sem payloads ou IDs de negócio.

A aula não irá aprofundar ainda a navegação visual e a investigação de gargalos no JDK Mission Control.

Não serão detalhados:

- páginas de análise do JMC;
- regras automáticas do JMC;
- árvore de chamadas;
- hot methods;
- flame view;
- lock instances;
- allocation hot spots;
- latency bottlenecks;
- comparação visual de gravações;
- classificação final dos gargalos;
- investigação aprofundada por telas do Mission Control.

Esses tópicos pertencem à próxima aula oficial:

```text
575 - M18.20 - JMC analise de gargalos
```

Nesta aula, o JMC será usado apenas para confirmar que o arquivo abre e contém eventos.

A regra central será:

```text
uma gravação JFR
precisa ter
objetivo,
janela,
limites,
metadata,
cenário
e cleanup;

capturar tudo
por tempo indefinido
não é profiling seguro.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
572:
GC logs.

573:
JVM tuning basico.

574:
Profiling com JFR.

575:
JMC analise de gargalos.
```

A progressão é:

```text
observar memória;

ajustar runtime;

capturar eventos detalhados;

analisar gargalos visualmente.
```

Nesta aula:

```text
JFR:
sim.

jcmd:
sim.

jfr CLI:
sim.

gravação por duração:
sim.

gravação contínua limitada:
sim.

settings:
sim.

eventos customizados:
sim.

CPU samples:
sim.

allocations:
sim.

locks:
sim.

I/O:
sim.

metadata:
sim.

validação:
sim.

análise profunda no JMC:
não.

classificação final de gargalos:
não.
```

Você reutilizará:

- baseline de tuning;
- GC logs;
- heap dumps;
- thread dumps;
- métricas;
- traces;
- logs estruturados;
- release metadata;
- workloads controlados;
- políticas de segurança;
- runbooks.

JFR complementa essas fontes.

Ele fornece uma linha temporal de eventos internos e da aplicação.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
src/main/java
└── .../diagnostics/jfr
    ├── JfrScenarioController.java
    ├── JfrScenarioRegistry.java
    ├── JfrScenarioProperties.java
    ├── events
    │   ├── LaboratoryScenarioEvent.java
    │   ├── OrderOperationEvent.java
    │   ├── DependencyCallEvent.java
    │   └── QueuePressureEvent.java
    └── scenarios
        ├── CpuPressureScenario.java
        ├── AllocationPressureScenario.java
        ├── MonitorContentionScenario.java
        ├── BlockingIoScenario.java
        └── MixedWorkloadScenario.java

src/test/java
└── .../diagnostics/jfr
    ├── JfrCustomEventTest.java
    ├── JfrScenarioIsolationTest.java
    ├── JfrScenarioLimitTest.java
    └── JfrScenarioSecurityTest.java

observability/jfr
├── jfr-contract.yaml
├── jfr-capture-policy.yaml
├── jfr-settings-policy.yaml
├── jfr-duration-policy.yaml
├── jfr-file-policy.yaml
├── jfr-event-catalog.yaml
├── jfr-custom-event-policy.yaml
├── jfr-cpu-policy.yaml
├── jfr-allocation-policy.yaml
├── jfr-lock-policy.yaml
├── jfr-io-policy.yaml
├── jfr-comparison-policy.yaml
├── jfr-data-quality-policy.yaml
├── jfr-security-policy.yaml
├── jfr-failure-policy.yaml
├── jfr-scenarios.yaml
└── jfr-evidence.yaml

observability/jfr/settings
├── baseline.jfc
├── profiling-laboratory.jfc
└── continuous-limited.jfc

scripts/observability/jfr
├── validate-jfr-tools.ps1
├── discover-jfr-process.ps1
├── validate-jfr-settings.ps1
├── start-jfr-recording.ps1
├── check-jfr-recording.ps1
├── dump-jfr-recording.ps1
├── stop-jfr-recording.ps1
├── validate-jfr-file.ps1
├── summarize-jfr-recording.ps1
├── print-jfr-event-catalog.ps1
├── validate-jfr-custom-events.ps1
├── compare-jfr-recordings.ps1
├── scan-jfr-output.ps1
├── simulate-jfr-scenarios.ps1
├── collect-jfr-evidence.ps1
└── verify-jfr-baseline.ps1

docs/observability/jfr
├── JFR_OVERVIEW.md
├── JFR_CAPTURE_GUIDE.md
├── JFR_SETTINGS_GUIDE.md
├── JFR_CUSTOM_EVENTS_GUIDE.md
├── JFR_CLI_GUIDE.md
├── JFR_COMPARISON_GUIDE.md
├── JFR_TEST_MATRIX.md
└── JFR_TROUBLESHOOTING.md
```

Ao final, você terá settings versionadas, gravações limitadas, eventos customizados, cenários reproduzíveis, validação por CLI, comparação, segurança e evidence sanitizada.

Você irá validar ferramentas e processo, criar contrato, settings, limites, eventos e cenários, executar start/check/dump/stop, validar e comparar gravações, coletar evidence e executar o gate.

---

## Conceito essencial

### Java Flight Recorder

Infraestrutura de gravação de eventos integrada à JVM.

---

### Recording

Sessão JFR com configuração, duração, destino e conjunto de eventos.

---

### JFR event

Registro tipado com timestamp, duração, thread, stack e campos específicos.

---

### Event setting

Configuração que habilita, desabilita ou ajusta um tipo de evento.

---

### `.jfc`

Arquivo XML de configuração de eventos do JFR.

---

### Threshold

Duração mínima para registrar determinado evento.

---

### Period

Periodicidade de emissão de um evento periódico.

---

### Stack trace setting

Controle sobre a captura de stack para um evento.

---

### Duration

Tempo total planejado da gravação.

---

### Max age

Janela máxima de eventos mantidos em uma gravação contínua.

---

### Max size

Limite de tamanho para a gravação contínua.

---

### Disk recording

Gravação que usa arquivos temporários e destino em disco.

---

### Dump

Persistência dos eventos atuais em arquivo `.jfr`.

---

### Continuous recording

Gravação prolongada com limites de idade e tamanho.

---

### Custom event

Evento definido pela aplicação usando `jdk.jfr.Event`.

---

### Execution sample

Amostra periódica da stack de uma thread em execução.

---

### Allocation event

Evento relacionado à alocação de objetos.

---

### Monitor event

Evento relacionado à entrada ou espera em monitor.

---

### I/O event

Evento de leitura ou escrita em arquivo ou socket.

---

### Event correlation

Relação entre JFR, release, cenário, trace, log e métrica.

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

jfr `
  help

git status

git diff --check
```

Confirme:

- JDK 21;
- `jcmd` disponível;
- `jfr` CLI disponível;
- aplicação compila;
- testes passam;
- workload controlado;
- GC logs disponíveis;
- nenhum `.jfr` no Git;
- nenhum recording ativo;
- nenhum cenário de profiling em execução.

Registre a baseline.

---

### 2. Criar contrato JFR

Arquivo:

```text
jfr-contract.yaml
```

Conteúdo:

```yaml
jfr:
  objective:
    required

  process:
    required:
      - pid
      - service
      - environment
      - release

  recording:
    required:
      - name
      - settings
      - duration
      - max-size
      - destination

  workload:
    reproducible:
      required

  customEvents:
    sensitiveData:
      forbidden

  rawFile:
    repository:
      forbidden

  deepJmcAnalysis:
    deferredToLesson575
```

O contrato impede gravações sem contexto.

---

### 3. Criar política de captura

Arquivo:

```text
jfr-capture-policy.yaml
```

Conteúdo:

```yaml
capture:
  preferred:
    jcmd

  startupAlternative:
    StartFlightRecording

  before:
    required:
      - confirm-pid
      - confirm-service
      - confirm-release
      - confirm-settings
      - confirm-duration
      - confirm-disk
      - confirm-authorization

  after:
    required:
      - validate-file
      - calculate-sha256
      - record-size
      - restrict-access
      - plan-cleanup

  production:
    approval:
      required
```

---

### 4. Definir duração

Arquivo:

```text
jfr-duration-policy.yaml
```

Conteúdo:

```yaml
duration:
  laboratory:
    default:
      60s

    maximum:
      5m

  warmup:
    separate:
      required

  scenario:
    marked:
      required

  indefiniteRecording:
    forbiddenWithoutMaxAgeAndMaxSize

  production:
    basedOnObjective:
      required
```

Uma gravação curta demais pode perder o evento.

Uma gravação longa demais aumenta volume e ruído.

---

### 5. Criar settings baseline

Arquivo:

```text
settings/baseline.jfc
```

Objetivo:

- baixo overhead;
- eventos de runtime;
- GC;
- threads;
- metadata;
- alguns samples;
- sem detalhamento excessivo de allocation ou locks.

Use como ponto de referência.

Não copie um `.jfc` de outra versão sem validar no JDK 21.

---

### 6. Criar settings de laboratório

Arquivo:

```text
settings/profiling-laboratory.jfc
```

Ajuste:

- execution samples;
- object allocations;
- monitor enter;
- thread park;
- socket I/O;
- file I/O;
- exceptions controladas;
- custom events;
- stacks quando necessárias;
- thresholds para reduzir ruído.

---

### 7. Criar settings contínua limitada

Arquivo:

```text
settings/continuous-limited.jfc
```

Finalidade:

- gravação contínua local;
- baixo overhead;
- `maxage`;
- `maxsize`;
- dump sob demanda;
- retenção limitada.

Ela não deve habilitar todos os eventos caros.

---

### 8. Criar política de settings

Arquivo:

```text
jfr-settings-policy.yaml
```

Conteúdo:

```yaml
settings:
  versioned:
    required

  JdkVersion:
    validated:
      required

  event:
    fields:
      - enabled
      - threshold
      - period
      - stacktrace

  expensiveEvents:
    controlled:
      required

  customProfile:
    documented:
      required

  allEventsEnabled:
    forbidden
```

---

### 9. Validar settings

Script:

```text
validate-jfr-settings.ps1
```

Valide:

- XML válido;
- eventos reconhecidos;
- thresholds;
- periods;
- stacktrace;
- ausência de profile vazio;
- versão;
- nome;
- nenhum evento proibido;
- limites da gravação definidos em script ou profile.

Use:

```powershell
jfr `
  configure `
  --input `
  observability/jfr/settings/profiling-laboratory.jfc
```

---

### 10. Criar propriedades do laboratório

Arquivo:

```text
JfrScenarioProperties.java
```

As properties limitam duração, threads, alocações, I/O e concorrência, restringem o profile e garantem cleanup.

Exemplo:

```java
@ConfigurationProperties(
        prefix = "app.diagnostics.jfr")
public record JfrScenarioProperties(
        boolean enabled,
        int durationSeconds,
        int workerCount,
        int allocationMegabytes,
        int ioIterations) {
}
```

---

### 11. Criar registry

Arquivo:

```text
JfrScenarioRegistry.java
```

Estados:

```text
IDLE;

STARTING;

RUNNING;

STOPPING;

COMPLETED;

FAILED.
```

O registry registra cenário, início, fim, release, status e cleanup sem IDs de negócio.

---

### 12. Criar evento de cenário

Arquivo:

```text
LaboratoryScenarioEvent.java
```

Exemplo:

```java
@Name(
    "formacao.LaboratoryScenario")
@Label(
    "Laboratory Scenario")
@Category({
    "Formacao",
    "Diagnostics"
})
@Description(
    "Marks the lifecycle of a controlled scenario")
public final class LaboratoryScenarioEvent
        extends Event {

    @Label("Scenario")
    String scenario;

    @Label("Phase")
    String phase;

    @Label("Release")
    String release;

    @Label("Profile")
    String profile;

    @Label("Outcome")
    String outcome;
}
```

Não adicione:

- order ID;
- email;
- payload;
- token;
- correlation ID real;
- customer ID.

---

### 13. Publicar evento customizado

Uso:

```java
var event =
        new LaboratoryScenarioEvent();

event.scenario =
        "cpu-pressure";

event.phase =
        "start";

event.release =
        releaseMetadata.version();

event.profile =
        "diagnostics";

event.outcome =
        "running";

event.commit();
```

Antes de criar evento de alta frequência, verifique:

```java
event.isEnabled();
```

Para eventos com duração:

```java
event.begin();

executeOperation();

event.end();

if (event.shouldCommit()) {
    event.commit();
}
```

---

### 14. Criar evento de operação

Arquivo:

```text
OrderOperationEvent.java
```

Campos permitidos:

- operation;
- outcome;
- duration category;
- release;
- scenario;
- dependency category.

Não copie parâmetros de requisição.

JFR custom event deve resumir comportamento operacional.

---

### 15. Criar catálogo de eventos

Arquivo:

```text
jfr-event-catalog.yaml
```

Conteúdo:

```yaml
events:
  custom:
    - formacao.LaboratoryScenario
    - formacao.OrderOperation
    - formacao.DependencyCall
    - formacao.QueuePressure

  runtime:
    - jdk.ExecutionSample
    - jdk.ObjectAllocationInNewTLAB
    - jdk.ObjectAllocationOutsideTLAB
    - jdk.JavaMonitorEnter
    - jdk.ThreadPark
    - jdk.SocketRead
    - jdk.SocketWrite
    - jdk.FileRead
    - jdk.FileWrite
    - jdk.GarbageCollection
    - jdk.CPULoad
```

Nomes podem variar por versão e settings.

Valide o arquivo real.

---

### 16. Criar política de eventos customizados

Arquivo:

```text
jfr-custom-event-policy.yaml
```

Conteúdo:

```yaml
customEvents:
  required:
    - stable-name
    - category
    - label
    - description
    - bounded-fields

  fieldTypes:
    prefer:
      - boolean
      - int
      - long
      - enum-like-string
      - duration-category

  forbidden:
    - payload
    - credentials
    - personal-data
    - business-id
    - full-url-with-query
    - unbounded-message

  highFrequency:
    require:
      - isEnabled
      - threshold
      - sampling-or-aggregation
```

---

### 17. Criar cenário de CPU

Arquivo:

```text
CpuPressureScenario.java
```

Regras:

- uma thread;
- duração limitada;
- stop flag;
- nenhum loop infinito sem saída;
- nenhuma alocação desnecessária;
- profile local.

O cenário deve produzir execution samples reconhecíveis.

---

### 18. Criar cenário de allocation

Arquivo:

```text
AllocationPressureScenario.java
```

Use objetos sintéticos de vida curta.

Registre:

- quantidade;
- tamanho aproximado;
- duração;
- scenario event;
- cleanup.

Objetivo:

```text
produzir eventos
de allocation

sem causar OOM.
```

---

### 19. Criar cenário de lock

Arquivo:

```text
MonitorContentionScenario.java
```

Reutilize a ideia da aula 570, mas com duração curta.

Produza:

- `JavaMonitorEnter`;
- `ThreadPark`;
- eventos customizados de início e fim;
- logs sanitizados.

Não crie deadlock nesta aula.

O objetivo é capturar contenção observável.

---

### 20. Criar cenário de I/O

Arquivo:

```text
BlockingIoScenario.java
```

Use arquivo temporário ou servidor local fake.

Produza:

- file read;
- file write;
- socket read;
- socket write;
- duração limitada;
- cleanup específico.

Nenhum endpoint externo real será usado.

---

### 21. Criar cenário misto

Arquivo:

```text
MixedWorkloadScenario.java
```

Combine em proporções pequenas:

- CPU;
- alocação;
- lock;
- I/O;
- chamadas da aplicação.

O cenário serve para validar se a gravação captura categorias diferentes.

Ele não será usado para concluir o maior gargalo nesta aula.

---

### 22. Criar controller interno

Arquivo:

```text
JfrScenarioController.java
```

Endpoints:

```text
POST /internal/diagnostics/jfr/{scenario}/start

POST /internal/diagnostics/jfr/{scenario}/stop

GET /internal/diagnostics/jfr/status
```

Regras:

- profile `diagnostics`;
- local;
- duração máxima;
- um cenário por vez;
- acesso restrito;
- cleanup;
- sem produção.

---

### 23. Descobrir o processo

Script:

```text
discover-jfr-process.ps1
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

Valide:

- artifact;
- profile;
- release;
- porta;
- correspondência única;
- PID atual.

Não reutilize PID de execução anterior.

---

### 24. Iniciar gravação com `jcmd`

Script:

```text
start-jfr-recording.ps1
```

Exemplo:

```powershell
jcmd `
  $pid `
  JFR.start `
  name=lesson574 `
  settings=observability/jfr/settings/profiling-laboratory.jfc `
  duration=60s `
  filename=.tmp/jfr/lesson574_cpu_pressure.jfr `
  dumponexit=true
```

O script registra name, settings, duração, destino, cenário, release, início, PID temporário e status.

---

### 25. Iniciar na linha de comando

Alternativa:

```text
-XX:StartFlightRecording=
name=lesson574,
settings=profile,
duration=60s,
filename=.tmp/jfr/startup.jfr,
dumponexit=true
```

Use quando o problema inclui:

- startup;
- class loading;
- aquecimento;
- inicialização;
- primeira carga.

A configuração fica versionada no profile de laboratório.

---

### 26. Verificar gravação ativa

Script:

```text
check-jfr-recording.ps1
```

Comando:

```powershell
jcmd `
  $pid `
  JFR.check
```

Valide:

- recording name;
- status;
- duration;
- settings;
- disk;
- max age;
- max size;
- destination quando aplicável.

Bloqueie cenários quando outra gravação incompatível já estiver ativa.

---

### 27. Fazer dump sem parar

Script:

```text
dump-jfr-recording.ps1
```

Comando:

```powershell
jcmd `
  $pid `
  JFR.dump `
  name=lesson574 `
  filename=.tmp/jfr/lesson574_snapshot.jfr
```

Uso:

- preservar janela atual;
- manter gravação contínua;
- coletar snapshot após alerta;
- comparar antes e depois.

O dump preserva a gravação ativa.

---

### 28. Parar gravação

Script:

```text
stop-jfr-recording.ps1
```

Comando:

```powershell
jcmd `
  $pid `
  JFR.stop `
  name=lesson574 `
  filename=.tmp/jfr/lesson574_final.jfr
```

Depois, confirme:

```powershell
jcmd `
  $pid `
  JFR.check
```

Confirme o encerramento.

---

### 29. Criar gravação contínua limitada

Exemplo:

```powershell
jcmd `
  $pid `
  JFR.start `
  name=continuous-limited `
  settings=observability/jfr/settings/continuous-limited.jfc `
  disk=true `
  maxage=15m `
  maxsize=128m `
  dumponexit=true
```

A gravação contínua exige `maxage`, `maxsize`, autorização, destino, dump, cleanup e monitoramento de disco.

---

### 30. Criar política de arquivo

Arquivo:

```text
jfr-file-policy.yaml
```

Conteúdo:

```yaml
file:
  extension:
    .jfr

  directory:
    .tmp/jfr

  rawCommit:
    forbidden

  before:
    diskValidation:
      required

  after:
    required:
      - non-empty
      - summary-readable
      - sha256
      - restricted-access
      - cleanup-date

  sharing:
    external:
      forbiddenInLaboratory
```

Arquivos JFR podem conter nomes de classes, métodos, paths e metadata do runtime.

---

### 31. Validar o arquivo

Script:

```text
validate-jfr-file.ps1
```

Valide:

- arquivo existe;
- tamanho maior que zero;
- extensão;
- checksum;
- path temporário;
- ausência no Git;
- leitura pelo `jfr summary`;
- eventos esperados;
- metadata;
- nenhuma credencial em outputs derivados.

Resultado:

```text
JFR_FILE_APPROVED
ou
JFR_FILE_BLOCKED.
```

---

### 32. Usar `jfr summary`

Script:

```text
summarize-jfr-recording.ps1
```

Comando:

```powershell
jfr `
  summary `
  .tmp/jfr/lesson574_final.jfr
```

O summary verifica versão, chunks, duração, contagens, custom events, samples, GC, locks e I/O.

O summary não substitui a análise visual da aula 575.

---

### 33. Usar `jfr print`

Exemplo:

```powershell
jfr `
  print `
  --events `
  formacao.LaboratoryScenario `
  .tmp/jfr/lesson574_final.jfr
```

Outro:

```powershell
jfr `
  print `
  --events `
  jdk.GarbageCollection `
  .tmp/jfr/lesson574_final.jfr
```

Limite o output.

Não imprima toda a gravação sem necessidade.

---

### 34. Filtrar eventos

Exemplos:

```powershell
jfr `
  print `
  --events `
  "jdk.ExecutionSample,jdk.JavaMonitorEnter" `
  .tmp/jfr/lesson574_final.jfr
```

```powershell
jfr `
  print `
  --events `
  "formacao.*" `
  .tmp/jfr/lesson574_final.jfr
```

A disponibilidade de filtros deve ser validada na CLI do JDK.

---

### 35. Criar política de CPU

Arquivo:

```text
jfr-cpu-policy.yaml
```

Conteúdo:

```yaml
cpu:
  capture:
    - execution-sample
    - native-method-sample
    - cpu-load

  scenario:
    controlled:
      required

  conclusion:
    fromSingleSample:
      forbidden

  deepHotMethodAnalysis:
    deferredToLesson575
```

Nesta aula, valide presença e volume dos samples.

A análise profunda dos métodos quentes ficará para a próxima aula.

---

### 36. Criar política de allocation

Arquivo:

```text
jfr-allocation-policy.yaml
```

Conteúdo:

```yaml
allocation:
  capture:
    - in-new-tlab
    - outside-tlab

  stacktrace:
    controlled:
      required

  highVolume:
    action:
      threshold-or-short-window

  objectContent:
    forbidden

  deepAllocationHotspotAnalysis:
    deferredToLesson575
```

Eventos de allocation podem gerar volume.

Use gravações curtas e settings específicas.

---

### 37. Criar política de locks

Arquivo:

```text
jfr-lock-policy.yaml
```

Conteúdo:

```yaml
locks:
  capture:
    - monitor-enter
    - thread-park

  threshold:
    required

  correlate:
    - thread-name
    - scenario
    - release
    - duration

  deadlockConclusion:
    useThreadDump:
      required

  deepContentionAnalysis:
    deferredToLesson575
```

JFR registra duração e contexto.

Thread dump continua sendo fonte estrutural para deadlock.

---

### 38. Criar política de I/O

Arquivo:

```text
jfr-io-policy.yaml
```

Conteúdo:

```yaml
io:
  capture:
    - socket-read
    - socket-write
    - file-read
    - file-write

  endpoint:
    sensitiveData:
      redact

  path:
    evidence:
      summarize

  externalTraffic:
    forbiddenInLaboratory

  deepLatencyAnalysis:
    deferredToLesson575
```

---

### 39. Criar política de comparação

Arquivo:

```text
jfr-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  equivalent:
    - JDK
    - collector
    - release
    - workload
    - duration
    - warmup
    - settings
    - environment

  compare:
    - event-counts
    - recording-duration
    - execution-samples
    - allocations
    - monitor-events
    - parks
    - io-events
    - gc-events
    - custom-events

  differentSettings:
    result:
      limited-comparison
```

A comparação desta aula será quantitativa e de presença.

A análise de gargalos ficará para o JMC.

---

### 40. Comparar gravações

Script:

```text
compare-jfr-recordings.ps1
```

Compare:

```text
baseline;

cpu-pressure;

allocation-pressure;

monitor-contention;

blocking-io;

mixed-workload.
```

Registre duração, tamanho, settings, eventos, samples, markers, release, cenário e validade.

Classifique:

```text
EXPECTED_EVENTS_PRESENT;

MISSING_EXPECTED_EVENTS;

NOISY_RECORDING;

INVALID_COMPARISON;

INCONCLUSIVE.
```

---

### 41. Criar política de qualidade

Arquivo:

```text
jfr-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  emptyFile:
    action:
      block-analysis

  missingScenarioMarker:
    result:
      limited

  missingRelease:
    result:
      limited

  truncatedRecording:
    action:
      block-comparison

  differentDuration:
    result:
      normalize-or-limit

  differentSettings:
    result:
      limited

  recordingOverlap:
    action:
      document

  eventCountZero:
    investigate:
      settings-or-scenario
```

---

### 42. Criar política de segurança

Arquivo:

```text
jfr-security-policy.yaml
```

Conteúdo:

```yaml
security:
  rawRecording:
    classification:
      sensitive

    repository:
      forbidden

  customEvents:
    prohibited:
      - credentials
      - personal-data
      - business-id
      - payload
      - full-url-query
      - complete-stack-export

  commandLine:
    secrets:
      forbidden

  evidence:
    rawEventDump:
      forbidden

  production:
    capture:
      requiresApproval
```

---

### 43. Criar failure policy

Arquivo:

```text
jfr-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  toolUnavailable:
    action:
      block-laboratory

  processNotFound:
    action:
      rediscover-pid

  ambiguousProcess:
    action:
      block-capture

  invalidSettings:
    action:
      block-start

  recordingAlreadyActive:
    action:
      check-compatibility

  diskFull:
    action:
      stop-recording

  emptyFile:
    action:
      block-analysis

  sensitiveData:
    action:
      delete-copy-and-block-release

  deepJmcAnalysis:
    deferredToLesson575
```

---

### 44. Criar cenários

Arquivo:

```text
jfr-scenarios.yaml
```

Cenários:

```text
baseline;

cpu-pressure;

allocation-pressure;

monitor-contention;

blocking-file-io;

blocking-socket-io;

mixed-workload;

continuous-limited;

dump-without-stop;

invalid-settings;

disk-pressure.
```

Cada cenário registra:

- objetivo;
- hipótese;
- settings;
- duração;
- workload;
- markers;
- eventos esperados;
- arquivo;
- cleanup;
- evidence.

---

### 45. Simular baseline

Execute:

1. warmup;
2. iniciar gravação baseline;
3. gerar tráfego leve;
4. marcar início e fim;
5. parar;
6. validar;
7. gerar summary.

Confirme:

- GC;
- threads;
- metadata;
- custom markers;
- poucos eventos de alta intensidade;
- arquivo legível.

---

### 46. Simular CPU pressure

Execute o cenário controlado.

Confirme:

- recording ativa;
- marker de início;
- execution samples;
- CPU load;
- marker de fim;
- stop flag;
- arquivo válido.

Não conclua qual método é o maior gargalo.

Essa análise pertence à aula 575.

---

### 47. Simular allocation pressure

Execute alocações sintéticas de vida curta.

Confirme:

- eventos de allocation;
- GC events;
- custom marker;
- limite de duração;
- ausência de OOM;
- arquivo dentro do tamanho esperado.

---

### 48. Simular contenção

Execute múltiplas threads disputando monitor por tempo limitado.

Confirme:

- monitor enter;
- thread park quando aplicável;
- threads nomeadas;
- custom markers;
- cleanup;
- ausência de deadlock.

---

### 49. Simular I/O

Execute arquivo temporário e socket local fake.

Confirme:

- file events;
- socket events;
- duração;
- path sanitizado nos relatórios;
- nenhum host externo;
- cleanup.

---

### 50. Validar eventos customizados

Script:

```text
validate-jfr-custom-events.ps1
```

Valide:

- tipos presentes;
- nomes estáveis;
- categories;
- fields permitidos;
- início e fim;
- release;
- cenário;
- nenhum dado sensível;
- contagem compatível.

---

### 51. Abrir no JMC apenas para validação

Abra:

```text
lesson574_final.jfr
```

Confirme somente:

- arquivo abre;
- duração aparece;
- eventos estão disponíveis;
- custom events aparecem;
- gravação não está corrompida.

Não faça ainda a investigação detalhada dos gargalos.

Registre:

```text
JMC_OPEN_VALIDATION_APPROVED.
```

---

### 52. Criar matriz de testes

Arquivo:

```text
JFR_TEST_MATRIX.md
```

Cenários:

- ferramentas;
- processo único;
- settings baseline;
- settings profiling;
- settings continuous;
- recording start;
- recording check;
- recording dump;
- recording stop;
- duration;
- max age;
- max size;
- `.jfr` válido;
- summary;
- print;
- custom events;
- CPU samples;
- allocations;
- locks;
- parks;
- file I/O;
- socket I/O;
- GC events;
- comparison;
- invalid settings;
- disk pressure;
- sensitive scan;
- JMC open validation;
- evidence sanitizada.

---

### 53. Criar troubleshooting

Arquivo:

```text
JFR_TROUBLESHOOTING.md
```

Inclua:

- `jfr` CLI não encontrada;
- `JFR.start` não reconhecido;
- PID incorreto;
- settings inválida;
- gravação já existe;
- arquivo não é criado;
- gravação vazia;
- evento esperado ausente;
- custom event ausente;
- arquivo grande;
- disco cheio;
- `JFR.dump` falha;
- `JFR.stop` não encerra;
- `jfr summary` falha;
- versão incompatível;
- dados sensíveis em custom event;
- arquivo entrou no Git;
- análise JMC aprofundada antecipada.

---

### 54. Coletar evidence

Script:

```text
collect-jfr-evidence.ps1
```

Arquivo:

```text
jfr-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release, JDK, recording e status de ferramentas, settings, duração, tamanho, summary, eventos, comparação, validação no JMC, segurança e testes.

Não inclua:

- gravação bruta;
- PID;
- paths internos completos;
- stacks completas;
- nomes de clientes;
- IDs de negócio;
- payloads;
- credentials.

---

### 55. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\jfr\validate-jfr-tools.ps1

.\scripts\observability\jfr\discover-jfr-process.ps1

.\scripts\observability\jfr\validate-jfr-settings.ps1

.\scripts\observability\jfr\start-jfr-recording.ps1

.\scripts\observability\jfr\check-jfr-recording.ps1

.\scripts\observability\jfr\dump-jfr-recording.ps1

.\scripts\observability\jfr\stop-jfr-recording.ps1

.\scripts\observability\jfr\validate-jfr-file.ps1

.\scripts\observability\jfr\summarize-jfr-recording.ps1

.\scripts\observability\jfr\print-jfr-event-catalog.ps1

.\scripts\observability\jfr\validate-jfr-custom-events.ps1

.\scripts\observability\jfr\compare-jfr-recordings.ps1

.\scripts\observability\jfr\scan-jfr-output.ps1

.\scripts\observability\jfr\simulate-jfr-scenarios.ps1

.\scripts\observability\jfr\collect-jfr-evidence.ps1

.\scripts\observability\jfr\verify-jfr-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- ferramentas aprovadas;
- processo aprovado;
- settings válidas;
- gravação iniciada;
- check aprovado;
- dump aprovado;
- stop aprovado;
- arquivo válido;
- summary aprovado;
- eventos customizados aprovados;
- CPU events presentes;
- allocation events presentes;
- lock events presentes;
- I/O events presentes;
- GC events presentes;
- comparação aprovada;
- segurança aprovada;
- JMC abre o arquivo;
- evidence sanitizada;
- análise profunda não antecipada.

---

### 56. Encerrar o laboratório

Pare os cenários.

Confirme que não existe gravação ativa:

```powershell
jcmd `
  <PID> `
  JFR.check
```

Remova somente artifacts temporários:

```powershell
Remove-Item `
  .tmp/jfr `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve settings;
- preserve scripts;
- preserve docs;
- confirme que nenhum `.jfr` está no Git;
- registre cleanup.

Não execute limpeza global.

---

## Entendendo o que foi feito

### Profiling ganhou contexto

A gravação passou a nascer de objetivo, hipótese, cenário e janela.

### Settings ganharam versionamento

Eventos, thresholds e stacks deixaram de depender de configuração manual.

### Duração ganhou limite

Capturas curtas e gravações contínuas limitadas reduziram risco.

### Cenários ganharam marcação

Custom events permitiram localizar início, fim, profile e release.

### CPU ganhou samples

A gravação passou a conter execution samples para análise posterior.

### Allocation ganhou controle

Eventos foram capturados em janela limitada, sem OOM.

### Locks ganharam duração

Monitor enter e thread park passaram a aparecer na linha temporal.

### I/O ganhou eventos

Arquivo e socket local puderam ser observados.

### Comparações ganharam equivalência

Settings, duração, workload, JDK e release foram controlados.

### Artifacts ganharam segurança

Arquivos `.jfr` permaneceram temporários e fora do Git.

### A próxima aula ganhou material confiável

O JMC poderá analisar gargalos usando gravações válidas, marcadas e comparáveis.

---

## Erros comuns importantes

### Gravar sem objetivo

O arquivo contém volume, mas não responde uma pergunta.

### Habilitar todos os eventos

Overhead e ruído aumentam.

### Gravar indefinidamente

Disco e retenção ficam sem limite.

### Não marcar o cenário

A janela de interesse fica difícil de localizar.

### Incluir payload em custom event

O artifact passa a expor dados.

### Comparar settings diferentes

A quantidade de eventos deixa de ser comparável.

### Concluir por um único sample

Sampling exige distribuição e contexto.

### Tratar JFR como thread dump

JFR é linha temporal; thread dump é snapshot estrutural.

### Versionar `.jfr`

O repositório recebe artifact sensível e grande.

### Antecipar a análise completa no JMC

A investigação de gargalos pertence à aula 575.

---

## Comandos úteis

### Iniciar gravação

```powershell
jcmd `
  <PID> `
  JFR.start `
  name=lesson574 `
  settings=profile `
  duration=60s `
  filename=.tmp/jfr/lesson574.jfr
```

### Verificar gravação

```powershell
jcmd `
  <PID> `
  JFR.check
```

### Fazer dump

```powershell
jcmd `
  <PID> `
  JFR.dump `
  name=lesson574 `
  filename=.tmp/jfr/snapshot.jfr
```

### Parar gravação

```powershell
jcmd `
  <PID> `
  JFR.stop `
  name=lesson574
```

### Resumir arquivo

```powershell
jfr `
  summary `
  .tmp/jfr/lesson574.jfr
```

---

## Exercício guiado

### Parte 1 — Baseline

Valide ferramentas, processo e workload.

### Parte 2 — Settings

Crie baseline, profiling e continuous limited.

### Parte 3 — Custom events

Marque cenário, operação e release.

### Parte 4 — Capture

Inicie, verifique, faça dump e pare.

### Parte 5 — CPU

Capture samples controlados.

### Parte 6 — Allocation

Capture alocações sintéticas.

### Parte 7 — Locks e I/O

Capture contenção e I/O local.

### Parte 8 — CLI

Valide summary e eventos selecionados.

### Parte 9 — Comparison

Compare gravações equivalentes.

### Parte 10 — Gate

Escaneie, colete evidence e faça cleanup.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 573 e ponte para a aula 575 foram preservadas;
- JFR, recording, event, event setting, `.jfc`, threshold, period, stack trace setting, duration, max age, max size, disk recording, dump, continuous recording, custom event, execution sample, allocation event, monitor event, I/O event e event correlation foram definidos;
- baseline foi validada;
- `jcmd` e `jfr` CLI foram validados;
- contrato foi criado;
- política de captura foi criada;
- política de duração foi criada;
- gravação indefinida sem limites foi proibida;
- settings baseline foi criada;
- settings de profiling foi criada;
- settings contínua limitada foi criada;
- política de settings foi criada;
- settings foram validadas;
- properties limitaram cenários;
- registry foi criado;
- custom event de cenário foi criado;
- `isEnabled`, `begin`, `end`, `shouldCommit` e `commit` foram explicados;
- custom event de operação foi criado;
- catálogo de eventos foi criado;
- política de eventos customizados foi criada;
- dados sensíveis foram proibidos;
- cenário de CPU foi criado;
- cenário de allocation foi criado;
- cenário de contenção foi criado;
- deadlock não foi criado;
- cenário de I/O local foi criado;
- cenário misto foi criado;
- controller interno foi restrito;
- processo foi descoberto com segurança;
- gravação foi iniciada com `JFR.start`;
- startup recording foi documentada;
- gravação ativa foi validada com `JFR.check`;
- dump sem stop foi documentado;
- stop foi documentado;
- gravação contínua possui `maxage` e `maxsize`;
- política de arquivo foi criada;
- arquivo `.jfr` foi validado;
- `jfr summary` foi usado;
- `jfr print` foi usado com filtros;
- política de CPU foi criada;
- conclusão por sample isolado foi proibida;
- política de allocation foi criada;
- volume de allocation foi limitado;
- política de locks foi criada;
- deadlock continua sendo validado por thread dump;
- política de I/O foi criada;
- tráfego externo foi proibido no laboratório;
- política de comparação foi criada;
- gravações foram comparadas com contexto equivalente;
- política de qualidade foi criada;
- arquivos vazios ou truncados bloqueiam análise;
- política de segurança foi criada;
- `.jfr` bruto não entra no Git;
- failure policy foi criada;
- cenários foram catalogados;
- baseline foi simulada;
- CPU pressure foi simulada;
- allocation pressure foi simulada;
- contenção foi simulada;
- I/O foi simulado;
- eventos customizados foram validados;
- arquivo foi aberto no JMC apenas para validação;
- matriz de testes foi criada;
- troubleshooting foi criado;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, dado pessoal, ambiente real ou `.jfr` foi commitado;
- análise profunda no JMC não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/jfr `
  scripts/observability/jfr `
  docs/observability/jfr `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure artifacts e conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "\.jfr|password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|private_key|payload"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar profiling com JFR"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- gravações JFR;
- PIDs;
- outputs completos de eventos;
- stacks completas;
- credentials;
- dados reais;
- arquivos temporários;
- análise profunda do JMC;
- material da aula 575.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a capturar eventos internos da JVM e da aplicação com Java Flight Recorder.

Você trabalhou com:

```text
jcmd JFR.start;

JFR.check;

JFR.dump;

JFR.stop;

StartFlightRecording;

settings .jfc;

jfr summary;

jfr print;

custom events;

CPU samples;

allocations;

locks;

I/O;

gravação contínua limitada.
```

Você comprovou que uma gravação precisa de objetivo, workload, warmup, duração, settings, limite de arquivo, metadata, segurança e cleanup; custom events devem marcar o cenário sem expor dados; execution samples não autorizam conclusão por amostra isolada; allocation events precisam de janela controlada; monitor enter e thread park complementam thread dumps; file e socket events precisam de ambiente local e sanitização; gravações comparáveis precisam usar mesmo JDK, release, workload, duração e settings; e `.jfr` é artifact sensível que não entra no repositório.

A próxima aula será:

```text
575 - M18.20 - JMC analise de gargalos
```

Nela, você irá abrir as gravações no JDK Mission Control e investigar CPU, hot methods, call trees, alocações, locks, latência, I/O e regras automáticas para localizar gargalos.

Nenhuma análise detalhada de hot methods, call tree, flame view, allocation hot spot, lock instance, regra automática ou gargalo final no JMC foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei JFR e processo.
- [ ] Criei settings versionadas.
- [ ] Criei eventos customizados seguros.
- [ ] Iniciei, verifiquei, fiz dump e parei.
- [ ] Validei summary e eventos.
- [ ] Comparei gravações equivalentes.
- [ ] Abri o arquivo apenas para validação.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### `JFR.start` não funciona

Confirme JDK, PID, permissão de attach e sintaxe.

### A settings não é aceita

Valide XML, eventos, versão e path.

### A gravação fica vazia

Confirme duração, cenário, settings e eventos habilitados.

### O custom event não aparece

Confirme `commit`, `isEnabled`, duração e nome do evento.

### O arquivo cresce demais

Reduza duração, eventos, stacks e use `maxsize`.

### `JFR.dump` não gera arquivo

Revise recording name, destino e espaço.

### A gravação permanece ativa

Execute `JFR.stop` e valide com `JFR.check`.

### `jfr summary` falha

Verifique integridade, versão e tamanho do arquivo.

### O arquivo contém dado sensível

Apague a cópia, corrija eventos e bloqueie entrega.

### A análise começou a classificar hot methods

Preserve esse aprofundamento para a aula 575.

---

## Perguntas de revisão

1. O que é Java Flight Recorder?
2. O que é uma recording?
3. O que é um JFR event?
4. O que é `.jfc`?
5. O que é threshold?
6. O que é period?
7. O que é max age?
8. O que é max size?
9. O que faz `JFR.start`?
10. O que faz `JFR.check`?
11. O que faz `JFR.dump`?
12. O que faz `JFR.stop`?
13. O que é custom event?
14. Por que usar `isEnabled`?
15. Por que limitar allocation events?
16. Como JFR e thread dump se complementam?
17. Por que comparar settings iguais?
18. Por que não versionar `.jfr`?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Gravador de eventos da JVM.
2. Sessão configurada de eventos.
3. Registro tipado.
4. Arquivo de settings.
5. Duração mínima de evento.
6. Periodicidade.
7. Janela retida.
8. Limite de tamanho.
9. Inicia gravação.
10. Lista gravações.
11. Persiste snapshot.
12. Encerra gravação.
13. Evento da aplicação.
14. Evitar trabalho desnecessário.
15. Controlar overhead e volume.
16. Linha temporal e snapshot estrutural.
17. Preservar comparabilidade.
18. Artifact sensível.
19. JMC análise de gargalos.
20. JMC análise de gargalos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 574 - M18.19 - Profiling com JFR

- Continuei após JVM tuning básico.
- Entendi JFR como gravador de eventos da JVM e da aplicação.
- Validei `jcmd` e `jfr` CLI no JDK 21.
- Criei contrato e política de captura.
- Defini duração, `maxage` e `maxsize`.
- Criei settings baseline, profiling e continuous limited.
- Versionei eventos, thresholds, periods e stack traces.
- Criei cenários limitados no profile de diagnóstico.
- Criei eventos customizados para cenário, operação, dependência e fila.
- Proibi payloads, credentials, dados pessoais e IDs de negócio.
- Usei `isEnabled`, `begin`, `end`, `shouldCommit` e `commit`.
- Criei cenários de CPU, allocation, contenção, I/O e workload misto.
- Descobri o processo com correspondência única.
- Iniciei gravação com `JFR.start`.
- Documentei `StartFlightRecording`.
- Validei gravação ativa com `JFR.check`.
- Fiz dump sem encerrar.
- Parei gravação com `JFR.stop`.
- Criei gravação contínua limitada.
- Validei arquivo `.jfr`.
- Usei `jfr summary`.
- Usei `jfr print` com filtros.
- Criei políticas de CPU, allocation, locks e I/O.
- Comparei gravações equivalentes.
- Criei políticas de qualidade, segurança e failure.
- Simulei os cenários controlados.
- Validei eventos customizados.
- Abri o arquivo no JMC apenas para confirmar integridade.
- Coletei evidence sanitizada.
- Não antecipei análise profunda de gargalos no JMC.
- Próxima aula: JMC análise de gargalos.
```

---

## Referência técnica curta

- Java Flight Recorder.
- `jcmd JFR.start`.
- `jcmd JFR.check`.
- `jcmd JFR.dump`.
- `jcmd JFR.stop`.
- JFR Configuration Files.
- JFR Custom Events.
- JFR CLI.
- Continuous Recording.
- Low-Overhead Profiling.

Regra final:

```text
profiling com JFR precisa começar por objetivo, hipótese, processo, release, workload, warmup, janela, settings e limites: gravações são iniciadas, verificadas, despejadas e encerradas com jcmd, settings .jfc versionam eventos, thresholds, periods e stacks, e gravações contínuas sempre possuem maxage e maxsize; custom events marcam cenário, fase, profile e outcome sem payloads, credentials, dados pessoais ou IDs de negócio, enquanto CPU samples, allocations, locks, parks, file I/O, socket I/O e GC events são capturados em cenários locais e limitados; arquivos .jfr são validados por summary, comparados somente com mesmo JDK, release, workload, duração e settings e permanecem fora do Git como artifacts sensíveis, deixando para a aula 575 a análise aprofundada no JDK Mission Control de hot methods, call trees, allocations, locks, I/O, regras automáticas e gargalos.
```
