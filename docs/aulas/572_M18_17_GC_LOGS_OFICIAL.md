# 572 - M18.17 - GC logs

## Apresentação da aula

Na aula 571, você aprendeu a coletar e analisar heap dumps para entender:

```text
quais objetos existem;

quanto ocupam;

quem os referencia;

por que permanecem alcançáveis;

quais estruturas dominam o heap;

quais retenções são esperadas;

quais retenções são candidatas a vazamento.
```

Você trabalhou com:

- class histogram;
- HPROF;
- Eclipse MAT;
- shallow size;
- retained size;
- dominator tree;
- GC roots;
- paths to GC roots;
- caches;
- filas;
- listeners;
- `ThreadLocal`;
- class loaders;
- leak suspects;
- comparação entre snapshots.

Heap dump é um snapshot estrutural.

Ele mostra a memória em um instante.

Entretanto, muitas investigações exigem observar o comportamento da memória ao longo do tempo.

Exemplos:

- o heap cresce e depois volta ao normal;
- young collections ocorrem com frequência elevada;
- objetos promovem rapidamente para a geração antiga;
- mixed collections não recuperam espaço suficiente;
- full collections aparecem durante tráfego normal;
- pausas aumentam após uma release;
- o processo passa a coletar repetidamente sem recuperar memória;
- humongous allocations aparecem em ciclos;
- a aplicação entra em pressão de alocação;
- o throughput cai por tempo gasto em GC;
- um `OutOfMemoryError` é precedido por ciclos cada vez menos eficientes.

Para analisar esse comportamento, usamos **GC logs**.

GC logs são registros produzidos pela JVM sobre eventos do garbage collector.

Eles podem mostrar:

```text
quando a coleta ocorreu;

qual causa iniciou o ciclo;

qual collector executou;

qual região foi processada;

quanto heap existia antes;

quanto permaneceu depois;

quanto tempo a pausa durou;

quantas threads participaram;

qual fase ocorreu;

se houve promoção;

se houve full collection;

se a coleta recuperou espaço;

se o sistema entrou em pressão.
```

A pergunta central desta aula será:

```text
como coletar
e interpretar GC logs

sem confundir
atividade normal
com problema,

relacionando
ocupação,
frequência,
pausas,
causas
e recuperação
ao comportamento da aplicação?
```

GC ativo não significa problema. O diagnóstico precisa relacionar collector, heap, frequência, recuperação, pausas, full collections, promoção, objetos grandes, tráfego, release e persistência.

Você trabalhará com Unified JVM Logging e seletores como `gc`, `gc+heap`, `gc+age`, `gc+phases`, `gc+region`, `gc+ergo` e `safepoint`.

O laboratório utilizará o collector padrão do JDK 21 no ambiente local, normalmente G1 GC quando nenhuma alteração explícita é feita.

O foco será leitura e diagnóstico.

A aula não irá definir valores finais de tuning.

Não serão escolhidos ainda:

- `-Xms` definitivo;
- `-Xmx` definitivo;
- `MaxGCPauseMillis` definitivo;
- quantidade final de GC threads;
- young generation fixa;
- survivor ratio;
- initiating heap occupancy final;
- region size;
- collector alternativo;
- ZGC;
- Shenandoah;
- parâmetros de produção.

Esses assuntos pertencem à próxima aula oficial:

```text
573 - M18.18 - JVM tuning basico
```

A regra central será:

```text
GC logs descrevem
o comportamento do collector;

diagnóstico exige
tendência,
contexto
e correlação,

não apenas
uma pausa isolada.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
570:
Thread dump.

571:
Heap dump.

572:
GC logs.

573:
JVM tuning basico.
```

A progressão é:

```text
threads em um instante;

objetos em um instante;

coleta de memória ao longo do tempo;

ajustes básicos baseados em evidência.
```

Nesta aula:

```text
Unified JVM Logging:
sim.

-Xlog:
sim.

young GC:
sim.

mixed GC:
sim.

full GC:
sim.

concurrent cycle:
sim.

heap before/after:
sim.

pause time:
sim.

allocation pressure:
sim.

promotion:
sim.

humongous:
sim.

safepoint:
sim.

tuning final:
não.

mudança de collector:
não.

parâmetros de produção:
não.
```

Você reutilizará:

- métricas de heap;
- heap dumps;
- logs estruturados;
- release metadata;
- dashboards;
- alertas;
- runbooks;
- thread dumps;
- cenários de retenção;
- políticas de segurança.

GC logs não substituem heap dumps.

Eles respondem outra pergunta:

```text
como a JVM
está coletando memória
ao longo do tempo?
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
observability/gc-logs
├── gc-log-contract.yaml
├── gc-log-capture-policy.yaml
├── gc-log-rotation-policy.yaml
├── gc-log-parser-policy.yaml
├── gc-event-taxonomy.yaml
├── gc-pause-policy.yaml
├── gc-occupancy-policy.yaml
├── gc-promotion-policy.yaml
├── gc-humongous-policy.yaml
├── gc-full-collection-policy.yaml
├── gc-safepoint-policy.yaml
├── gc-comparison-policy.yaml
├── gc-data-quality-policy.yaml
├── gc-security-policy.yaml
├── gc-failure-policy.yaml
├── gc-log-scenarios.yaml
└── gc-log-evidence.yaml

scripts/observability/gc-logs
├── validate-gc-log-options.ps1
├── start-app-with-gc-logs.ps1
├── validate-gc-log-file.ps1
├── parse-gc-log.ps1
├── summarize-gc-events.ps1
├── analyze-gc-pauses.ps1
├── analyze-gc-occupancy.ps1
├── analyze-gc-promotion.ps1
├── analyze-humongous-allocations.ps1
├── detect-full-collections.ps1
├── analyze-safepoints.ps1
├── compare-gc-logs-by-release.ps1
├── compare-gc-logs-by-scenario.ps1
├── scan-gc-log-output.ps1
├── simulate-gc-log-scenarios.ps1
├── collect-gc-log-evidence.ps1
└── verify-gc-log-baseline.ps1

docs/observability/gc-logs
├── GC_LOGS_OVERVIEW.md
├── UNIFIED_JVM_LOGGING_GUIDE.md
├── G1_GC_EVENT_GUIDE.md
├── GC_PAUSE_ANALYSIS.md
├── GC_OCCUPANCY_ANALYSIS.md
├── GC_PROMOTION_AND_AGE.md
├── HUMONGOUS_ALLOCATION_GUIDE.md
├── FULL_GC_ANALYSIS.md
├── SAFEPOINT_ANALYSIS.md
├── GC_LOG_TEST_MATRIX.md
└── GC_LOG_TROUBLESHOOTING.md
```

Ao final, você terá GC logs rotacionados, parser, taxonomia, análise de pausas, ocupação, promoção, humongous, full GC, safepoints, comparação e evidence sanitizada.

Você irá configurar captura e rotação, coletar baseline, simular alocação e retenção, interpretar eventos, analisar pausas, ocupação, promoção, humongous, full GC e safepoints, comparar cenários e executar o gate.

---

## Conceito essencial

### Garbage collector

Componente da JVM responsável por recuperar memória de objetos não alcançáveis.

---

### GC event

Evento registrado quando o collector executa uma ação relevante.

---

### Stop-the-world

Período em que threads da aplicação ficam suspensas para uma operação da JVM.

---

### Pause

Intervalo stop-the-world registrado em um evento.

---

### Young collection

Coleta focada principalmente em regiões jovens.

---

### Mixed collection

No G1, coleta que inclui regiões jovens e algumas regiões antigas selecionadas.

---

### Full collection

Coleta mais abrangente e normalmente mais custosa, envolvendo grande parte do heap.

---

### Concurrent cycle

Fases executadas parcialmente em paralelo com a aplicação.

---

### Allocation rate

Velocidade com que novos objetos são alocados.

---

### Live set

Conjunto de objetos vivos após a coleta.

---

### Promotion

Movimentação de objetos sobreviventes para regiões mais antigas.

---

### Survivor

Objeto que permanece vivo após uma ou mais young collections.

---

### Age

Quantidade aproximada de ciclos jovens sobrevividos por um objeto.

---

### Humongous allocation

No G1, objeto grande o suficiente para ocupar uma ou mais regiões especiais.

---

### Heap occupancy

Quantidade de heap utilizada antes e depois de uma coleta.

---

### Reclamation efficiency

Proporção ou quantidade de memória recuperada por um evento.

---

### GC overhead

Tempo e recursos gastos pelo garbage collector.

---

### Safepoint

Momento em que a JVM consegue interromper as threads de aplicação para certas operações.

---

### Unified Logging

Infraestrutura moderna da JVM para logs usando `-Xlog`.

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
  -Xlog:help

git status

git diff --check
```

Confirme:

- JDK 21 ativo;
- Unified Logging disponível;
- aplicação compila;
- testes passam;
- nenhum arquivo bruto de GC está no Git;
- nenhum parâmetro de tuning final foi adicionado;
- espaço em disco disponível;
- laboratório local.

Registre a baseline.

---

### 2. Identificar o collector

Inicie a JVM com:

```powershell
java `
  -Xlog:gc=info `
  -version
```

Ou consulte flags:

```powershell
java `
  -XX:+PrintCommandLineFlags `
  -version
```

Registre:

- JDK;
- collector selecionado;
- heap inicial;
- heap máximo;
- ambiente;
- release;
- command line sanitizada.

No JDK 21, o collector padrão costuma ser G1 em máquinas servidoras.

Valide o resultado real.

Não assuma apenas pelo sistema operacional.

---

### 3. Criar contrato de GC logs

Arquivo:

```text
gc-log-contract.yaml
```

Conteúdo:

```yaml
gcLogs:
  runtime:
    required:
      - jdk-version
      - collector
      - service
      - environment
      - release

  capture:
    unifiedLogging:
      required

    rotation:
      required

    timestamp:
      required

  analysis:
    required:
      - event-type
      - cause
      - pause
      - occupancy-before
      - occupancy-after
      - reclaimed
      - frequency
      - promotion
      - humongous
      - full-collection
      - safepoint

  rawFiles:
    repository:
      forbidden

  tuning:
    deferredToLesson573
```

O contrato exige contexto antes da interpretação.

---

### 4. Criar política de captura

Arquivo:

```text
gc-log-capture-policy.yaml
```

Conteúdo:

```yaml
capture:
  tags:
    - gc*
    - safepoint

  level:
    baseline:
      info

    detailedLaboratory:
      debug

  decorators:
    - uptime
    - time
    - level
    - tags

  destination:
    .tmp/gc-logs/gc.log

  startup:
    required

  runtimeEnablement:
    controlled:
      true

  production:
    authorization:
      required
```

O nível `trace` fica restrito a janelas curtas.

---

### 5. Configurar Unified Logging

Configuração didática:

```text
-Xlog:gc*,safepoint:file=.tmp/gc-logs/gc.log:time,uptime,level,tags
```

Em PowerShell:

```powershell
$gcLogOption =
  "-Xlog:gc*,safepoint:file=.tmp/gc-logs/gc.log:time,uptime,level,tags"
```

Depois:

```powershell
java `
  $gcLogOption `
  -jar `
  target/kafka-orders-lab.jar
```

A ordem e a sintaxe precisam ser validadas no JDK usado.

---

### 6. Configurar rotação

Arquivo:

```text
gc-log-rotation-policy.yaml
```

Exemplo:

```yaml
rotation:
  fileCount:
    5

  fileSize:
    20m

  path:
    .tmp/gc-logs/gc.log

  compression:
    optional

  cleanup:
    specific

  rawCommit:
    forbidden
```

Configuração:

```text
-Xlog:gc*,safepoint:file=.tmp/gc-logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20M
```

Rotação evita crescimento indefinido.

---

### 7. Criar script de inicialização

Arquivo:

```text
start-app-with-gc-logs.ps1
```

O script valida diretório e espaço, configura flags, registra release e collector, inicia a aplicação e permite encerramento sem expor credenciais.

Não inclua valores sensíveis na command line.

---

### 8. Validar o arquivo

Script:

```text
validate-gc-log-file.ps1
```

Valide existência, tamanho, encoding, timestamps, tags, startup, collector, rotação, ausência no Git e dados sensíveis.

Resultado:

```text
GC_LOG_FILE_APPROVED
ou
GC_LOG_FILE_BLOCKED.
```

---

### 9. Criar taxonomia de eventos

Arquivo:

```text
gc-event-taxonomy.yaml
```

Conteúdo:

```yaml
events:
  startup:
    - heap-configuration
    - region-size
    - worker-count

  young:
    - evacuation-pause
    - normal
    - concurrent-start

  concurrent:
    - mark-cycle
    - cleanup
    - rebuild-remembered-sets

  mixed:
    - evacuation-pause-mixed

  full:
    - compaction
    - allocation-failure

  humongous:
    - allocation
    - reclaim

  safepoint:
    - application-stop
    - cleanup
```

Nomes exatos variam por versão.

O parser precisa mapear o texto real para categorias estáveis.

---

### 10. Entender uma linha simples

Exemplo conceitual:

```text
[2.345s][info][gc]
GC(12)
Pause Young
(Normal)
(G1 Evacuation Pause)
256M->84M(512M)
8.420ms
```

Interprete:

```text
uptime:
2.345 segundos.

evento:
GC 12.

tipo:
Pause Young.

causa:
G1 Evacuation Pause.

antes:
256 MB.

depois:
84 MB.

heap total:
512 MB.

pausa:
8.420 ms.
```

Memória recuperada:

```text
172 MB.
```

---

### 11. Criar parser

Script:

```text
parse-gc-log.ps1
```

O parser extrai timestamp, uptime, GC ID, tags, tipo, causa, before, after, capacity, reclaimed, duração, fase, collector, cenário e release.

Saída temporária:

```text
.tmp/gc-logs/parsed-events.jsonl
```

Não versione output bruto.

---

### 12. Criar resumo dos eventos

Script:

```text
summarize-gc-events.ps1
```

Resumo:

```text
event count;

young count;

mixed count;

full count;

concurrent cycle count;

pause total;

pause maximum;

pause p95;

average reclaimed bytes;

time window;

release.
```

A média sozinha não basta.

Inclua percentis e máximo.

---

### 13. Coletar baseline normal

Execute a aplicação sem cenário de pressão.

Gere tráfego leve e estável.

Colete uma janela didática com heap, throughput, latência, GC logs, release e request count.

Registre:

```text
baseline-normal.
```

O objetivo é conhecer o comportamento esperado.

---

### 14. Criar cenário de alocação normal

Reutilize payloads sintéticos da aula 571 sem retenção.

Fluxo:

1. alocar objetos;
2. processar;
3. liberar referências;
4. observar young collections;
5. confirmar recuperação;
6. confirmar heap após coleta estável.

Esse cenário mostra atividade saudável.

---

### 15. Criar cenário de pressão controlada

Use alocações sintéticas em lotes limitados.

Regras:

- sem `OutOfMemoryError`;
- stop flag;
- máximo de bytes;
- duração limitada;
- profile `diagnostics`;
- cleanup;
- apenas local.

Observe frequência de young GC, pausas, before/after, throughput e latência.

---

### 16. Criar cenário de retenção

Use o `UnboundedCacheScenario` com limite de segurança.

Observe crescimento do heap pós-GC, live set, mixed collections, reclaimed bytes e frequência.

O cenário deve parar antes de esgotar memória.

---

### 17. Criar cenário de objetos grandes

Use arrays sintéticos grandes, mas limitados.

No G1, objetos maiores que uma fração da region size podem ser classificados como humongous.

Observe tags como:

```text
gc+humongous.
```

A classificação exata depende da region size.

Registre a region size real.

---

### 18. Criar política de pausas

Arquivo:

```text
gc-pause-policy.yaml
```

Conteúdo:

```yaml
pauses:
  analyze:
    - count
    - total
    - maximum
    - p50
    - p95
    - p99
    - frequency
    - cause

  correlate:
    - request-latency
    - throughput
    - release
    - allocation-scenario

  singlePause:
    conclusion:
      insufficient

  productionThreshold:
    undefined:
      true
```

Esta aula não define threshold oficial de produção.

---

### 19. Analisar pausas

Script:

```text
analyze-gc-pauses.ps1
```

Calcule quantidade, total, média, máximo, p50, p95, p99, frequência, tipo e correlação com latência.

Exemplo:

```text
young pauses:
120.

p95:
12 ms.

max:
38 ms.

full pauses:
0.
```

A avaliação depende do SLO de latência do serviço.

---

### 20. Evitar conclusões por média

Exemplo:

```text
média:
5 ms.

p99:
180 ms.
```

A média parece saudável.

O tail pode afetar operações específicas.

Por isso, use distribuição e timestamps.

Compare com traces lentos e métricas de latência.

---

### 21. Criar política de ocupação

Arquivo:

```text
gc-occupancy-policy.yaml
```

Conteúdo:

```yaml
occupancy:
  analyze:
    - before
    - after
    - capacity
    - reclaimed
    - post-gc-floor
    - slope

  healthyPattern:
    postGcFloor:
      stableOrBounded

  suspiciousPattern:
    postGcFloor:
      increasingAcrossCycles

  conclusion:
    leakFromOccupancyAlone:
      forbidden
```

O piso pós-GC é um sinal importante.

---

### 22. Analisar ocupação

Script:

```text
analyze-gc-occupancy.ps1
```

Para cada evento:

```text
before;

after;

capacity;

reclaimed;

reclaimed ratio.
```

Ao longo da janela:

```text
post-GC floor;

slope;

minimum;

maximum;

trend.
```

Se o `after` aumenta ciclo após ciclo, pode existir crescimento do live set.

Correlacione com heap dump.

---

### 23. Entender young collections

Young collections são esperadas em aplicações que alocam objetos temporários.

Observe frequência, pausa, eden, survivor, promotion, reclaimed e throughput.

Alta frequência pode indicar:

- alta allocation rate;
- heap jovem pequeno;
- carga elevada;
- payloads temporários;
- serialização;
- buffers.

Diagnóstico não é tuning automático.

---

### 24. Entender mixed collections

No G1, mixed collections podem ocorrer após um ciclo concorrente de marcação.

Elas coletam:

- regiões jovens;
- algumas regiões antigas selecionadas.

Observe concurrent cycle, marcação, mixed pauses, regiões antigas recuperadas e post-GC occupancy.

Mixed GC não é erro.

---

### 25. Entender full collection

Full GC normalmente merece investigação quando aparece em tráfego normal.

Possíveis causas incluem allocation failure, evacuation failure, falta de regiões livres, metadata pressure, explicit GC e cenário artificial.

Não conclua a causa pelo rótulo sem consultar detalhes.

---

### 26. Criar política de full collection

Arquivo:

```text
gc-full-collection-policy.yaml
```

Conteúdo:

```yaml
fullCollection:
  detect:
    required

  record:
    - timestamp
    - cause
    - before
    - after
    - capacity
    - duration
    - release
    - scenario

  unexpectedInBaseline:
    action:
      investigate

  explicitGc:
    identify:
      required

  productionConclusion:
    requiresContext:
      true
```

---

### 27. Detectar full collections

Script:

```text
detect-full-collections.ps1
```

Resultado:

```text
full count;

causes;

maximum pause;

reclaimed bytes;

timestamps;

scenario;

release.
```

Classificações:

```text
none;

expected-laboratory;

unexpected;

repeated;

inconclusive.
```

---

### 28. Entender ciclo concorrente

O G1 executa fases concorrentes para identificar regiões antigas recuperáveis.

Eventos podem incluir:

- concurrent mark;
- remark;
- cleanup;
- rebuild remembered sets.

Algumas fases são concorrentes.

Outras possuem pausas.

Observe duração do ciclo e frequência.

Ciclos concorrentes muito frequentes podem indicar crescimento do old generation.

---

### 29. Criar política de promoção

Arquivo:

```text
gc-promotion-policy.yaml
```

Conteúdo:

```yaml
promotion:
  analyze:
    - survivor-age
    - promoted-bytes
    - old-occupancy
    - object-lifetime
    - release
    - scenario

  rapidPromotion:
    investigate:
      true

  tenuringThreshold:
    tuning:
      deferredToLesson573

  conclusion:
    promotionIsLeak:
      forbidden
```

Promoção significa sobrevivência.

Não significa vazamento automaticamente.

---

### 30. Coletar informações de idade

Inclua:

```text
-Xlog:gc+age=trace
```

somente em cenário controlado.

O log pode mostrar:

- desired survivor size;
- new threshold;
- age table;
- bytes por idade.

Volume pode aumentar.

Use janela curta.

---

### 31. Analisar promoção

Script:

```text
analyze-gc-promotion.ps1
```

Procure age distribution, threshold, survivor overflow, old occupancy, crescimento e correlação com cenário.

Resultados possíveis:

```text
normal-survival;

rapid-promotion-candidate;

old-growth-candidate;

insufficient-data.
```

---

### 32. Criar política de humongous

Arquivo:

```text
gc-humongous-policy.yaml
```

Conteúdo:

```yaml
humongous:
  analyze:
    - region-size
    - allocation-count
    - object-size-category
    - reclaim-events
    - occupancy-impact
    - scenario

  sensitiveContent:
    forbidden

  conclusion:
    allocationAloneIsProblem:
      false
```

Objetos grandes podem ser legítimos.

A frequência e a retenção importam.

---

### 33. Analisar humongous allocations

Script:

```text
analyze-humongous-allocations.ps1
```

Procure tags:

```text
gc+humongous.
```

Registre region size, quantidade, frequência, bytes, reclaimed, release e cenário.

Correlacione com heap dump para identificar classes.

---

### 34. Entender evacuation failure

No G1, uma evacuation failure indica dificuldade em mover objetos durante uma pausa.

Pode estar associada a:

- falta de regiões livres;
- pressão intensa;
- fragmentação;
- live set elevado;
- cenário extremo.

Se ocorrer, preserve logs e métricas, avalie heap dump, registre release e não ajuste flags imediatamente.

---

### 35. Entender explicit GC

Chamadas a:

```java
System.gc();
```

podem gerar eventos explícitos, dependendo das flags.

Procure causa semelhante a:

```text
System.gc()
```

Verifique origem, necessidade, repetição e impacto da chamada.

Não desabilite explicit GC sem avaliar dependências.

---

### 36. Criar política de safepoints

Arquivo:

```text
gc-safepoint-policy.yaml
```

Conteúdo:

```yaml
safepoints:
  analyze:
    - reason
    - time-to-safepoint
    - cleanup-time
    - total-stop-time
    - frequency

  correlate:
    - gc-pause
    - thread-state
    - latency

  longTimeToSafepoint:
    investigate:
      true

  tuning:
    deferredToLesson573
```

Safepoint não é sinônimo de GC.

Outras operações da JVM também usam safepoints.

---

### 37. Analisar safepoints

Script:

```text
analyze-safepoints.ps1
```

Registre timestamp, motivo, time-to-safepoint, cleanup, tempo parado, correlação e release.

Se `time-to-safepoint` for alto, uma thread pode ter demorado a chegar a um ponto seguro.

Correlacione com thread dumps quando possível.

---

### 38. Criar política de comparação

Arquivo:

```text
gc-comparison-policy.yaml
```

Conteúdo:

```yaml
comparison:
  required:
    - equivalent-window
    - request-count
    - collector
    - heap-configuration
    - release
    - scenario

  compare:
    - event-frequency
    - pause-distribution
    - post-gc-floor
    - reclaimed-bytes
    - full-count
    - promotion
    - humongous
    - safepoints

  mixedCollector:
    forbidden

  mixedHeapConfiguration:
    result:
      limited
```

Comparar releases exige contexto equivalente.

---

### 39. Comparar releases

Script:

```text
compare-gc-logs-by-release.ps1
```

Compare releases em janelas equivalentes por tráfego, cenário, heap, collector, pausas, frequência, piso pós-GC, full e humongous.

Classificações:

```text
improved;

degraded;

unchanged;

inconclusive.
```

---

### 40. Comparar cenários

Script:

```text
compare-gc-logs-by-scenario.ps1
```

Cenários:

```text
baseline-normal;

allocation-pressure;

retained-cache;

humongous-allocation;

released-cache.
```

O objetivo é reconhecer padrões.

Não é escolher flags finais.

---

### 41. Relacionar com heap dumps

Exemplo:

```text
GC logs:
post-GC floor cresce.

heap dump:
UnboundedCacheScenario domina retained heap.

path to root:
static cache registry.
```

As evidências convergem para retenção.

Outro:

```text
GC logs:
frequência alta,
mas after retorna ao baseline.

heap dump:
sem dominator inesperado.
```

Isso sugere allocation pressure temporária, não leak.

---

### 42. Relacionar com métricas

Compare:

- JVM heap used;
- committed;
- max;
- GC pause metrics;
- allocation metrics quando disponíveis;
- request latency;
- throughput;
- error rate;
- queue size.

Os logs oferecem detalhes por evento.

As métricas facilitam tendência e alertas.

---

### 43. Relacionar com thread dumps

Durante pausa longa ou pressão:

- thread dumps fora da pausa mostram estado da aplicação;
- safepoint logs mostram tempo parado;
- thread pools podem acumular fila;
- latência pode aumentar;
- workers podem permanecer bloqueados por dependência.

Não tente capturar thread dump exatamente durante uma pausa curta como única estratégia.

---

### 44. Criar política de parser

Arquivo:

```text
gc-log-parser-policy.yaml
```

Conteúdo:

```yaml
parser:
  jdk:
    versionAware:
      required

  collector:
    aware:
      required

  unknownLine:
    preserve:
      true

  invalidLine:
    count:
      required

  units:
    normalize:
      bytes-and-milliseconds

  timestamp:
    normalize:
      UTC-and-uptime

  conclusion:
    parserCoverage:
      required
```

Formato pode mudar entre JDKs.

Não descarte linhas desconhecidas silenciosamente.

---

### 45. Criar política de qualidade

Arquivo:

```text
gc-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingStartup:
    result:
      collector-unknown

  rotationGap:
    result:
      partial-window

  truncatedFile:
    result:
      partial

  mixedRelease:
    action:
      split-analysis

  clockSkew:
    action:
      prefer-uptime-for-order

  missingScenario:
    result:
      limited

  parserCoverageLow:
    action:
      block-conclusion
```

A análise precisa declarar lacunas.

---

### 46. Criar política de segurança

Arquivo:

```text
gc-security-policy.yaml
```

Conteúdo:

```yaml
security:
  rawFiles:
    repository:
      forbidden

  commandLine:
    secrets:
      forbidden

  filePath:
    sensitiveIdentifiers:
      forbidden

  evidence:
    rawLines:
      forbidden

  sharing:
    external:
      forbiddenInLaboratory

  cleanup:
    verified:
      required
```

GC logs costumam conter menos dados de negócio que heap dumps.

Ainda assim, podem revelar paths, flags e detalhes internos.

---

### 47. Criar failure policy

Arquivo:

```text
gc-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidXlogOption:
    action:
      block-start

  fileNotCreated:
    action:
      block-analysis

  diskFull:
    action:
      stop-scenario

  parserFailure:
    action:
      preserve-raw-temporary-and-investigate

  fullGcDetected:
    action:
      classify-and-correlate

  repeatedEvacuationFailure:
    action:
      preserve-evidence-and-escalate

  sensitiveData:
    action:
      block-release

  tuning:
    deferredToLesson573
```

---

### 48. Criar cenários

Arquivo:

```text
gc-log-scenarios.yaml
```

Cenários:

```text
baseline-normal;

short-lived-allocation;

controlled-allocation-pressure;

retained-cache-growth;

cache-release;

humongous-allocation;

explicit-gc-laboratory;

rotation;

truncated-log;

parser-unknown-line.
```

Cada cenário registra setup, duração, collector, heap, release, tráfego, eventos, conclusão, cleanup e evidence.

---

### 49. Simular baseline

Inicie a aplicação.

Gere tráfego leve.

Valide:

- collector;
- young events;
- nenhuma full collection inesperada;
- post-GC floor estável;
- pausas curtas no laboratório;
- arquivo rotacionável;
- parser aprovado.

Resultado:

```text
baseline-established.
```

---

### 50. Simular pressão de alocação

Gere objetos temporários em lotes.

Valide:

- frequência de young GC aumenta;
- heap after retorna;
- live set permanece bounded;
- throughput continua;
- pausas são registradas;
- full GC não é exigida.

Conclusão:

```text
allocation-pressure-with-recovery.
```

---

### 51. Simular retenção

Ative cache crescente com limite de segurança.

Valide:

- post-GC floor cresce;
- old occupancy cresce;
- mixed cycles podem aparecer;
- reclaimed ratio muda;
- heap dump aponta owner;
- release e cenário estão registrados.

Conclusão:

```text
retained-live-set-candidate.
```

---

### 52. Simular objetos humongous

Gere arrays grandes e limitados.

Valide:

- region size;
- humongous events;
- ocupação;
- liberação;
- recuperação após cleanup;
- ausência de conteúdo sensível.

Conclusão:

```text
controlled-humongous-allocation.
```

---

### 53. Criar matriz de testes

Arquivo:

```text
GC_LOG_TEST_MATRIX.md
```

Cenários:

- `-Xlog` válido;
- collector identificado;
- decorators;
- file output;
- rotation;
- parser;
- unknown line;
- young GC;
- mixed GC;
- concurrent cycle;
- full GC;
- explicit GC;
- before/after;
- reclaimed;
- pause p50;
- pause p95;
- pause max;
- post-GC floor;
- promotion;
- age table;
- humongous;
- safepoint;
- release comparison;
- scenario comparison;
- truncated log;
- disk full;
- sensitive scan;
- evidence sanitizada.

---

### 54. Criar troubleshooting

Arquivo:

```text
GC_LOG_TROUBLESHOOTING.md
```

Inclua:

- `-Xlog` inválido;
- arquivo não criado;
- path inexistente;
- rotação não ocorre;
- parser ignora linhas;
- collector desconhecido;
- unidades inconsistentes;
- heap before/after ausente;
- full GC sem causa;
- humongous sem region size;
- age table vazia;
- safepoint ausente;
- logs misturam releases;
- relógio divergente;
- arquivo truncado;
- disco cheio;
- GC log entrou no Git;
- tuning antecipado.

---

### 55. Coletar evidence

Script:

```text
collect-gc-log-evidence.ps1
```

Arquivo:

```text
gc-log-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release, JDK, collector e status de captura, rotação, parser, eventos, pausas, ocupação, promoção, humongous, safepoints, comparações, segurança e testes.

Não inclua:

- logs brutos;
- command line completa;
- paths internos completos;
- PIDs;
- credentials;
- dados pessoais;
- tuning final.

---

### 56. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\gc-logs\validate-gc-log-options.ps1

.\scripts\observability\gc-logs\start-app-with-gc-logs.ps1

.\scripts\observability\gc-logs\validate-gc-log-file.ps1

.\scripts\observability\gc-logs\parse-gc-log.ps1

.\scripts\observability\gc-logs\summarize-gc-events.ps1

.\scripts\observability\gc-logs\analyze-gc-pauses.ps1

.\scripts\observability\gc-logs\analyze-gc-occupancy.ps1

.\scripts\observability\gc-logs\analyze-gc-promotion.ps1

.\scripts\observability\gc-logs\analyze-humongous-allocations.ps1

.\scripts\observability\gc-logs\detect-full-collections.ps1

.\scripts\observability\gc-logs\analyze-safepoints.ps1

.\scripts\observability\gc-logs\compare-gc-logs-by-release.ps1

.\scripts\observability\gc-logs\compare-gc-logs-by-scenario.ps1

.\scripts\observability\gc-logs\scan-gc-log-output.ps1

.\scripts\observability\gc-logs\simulate-gc-log-scenarios.ps1

.\scripts\observability\gc-logs\collect-gc-log-evidence.ps1

.\scripts\observability\gc-logs\verify-gc-log-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- opções válidas;
- collector conhecido;
- arquivo válido;
- rotação válida;
- parser aprovado;
- eventos resumidos;
- pausas analisadas;
- ocupação analisada;
- promoção analisada;
- humongous analisado;
- full collections classificadas;
- safepoints analisados;
- comparações aprovadas;
- dados sensíveis ausentes;
- evidence sanitizada;
- tuning não antecipado.

---

### 57. Encerrar o laboratório

Pare a aplicação e os cenários.

Remova apenas:

```powershell
Remove-Item `
  .tmp/gc-logs `
  -Recurse `
  -Force
```

Antes:

- confirme o path;
- colete evidence;
- preserve scripts;
- preserve docs;
- confirme que nenhum log bruto está no Git;
- registre encerramento.

Não execute limpeza global.

---

## Entendendo o que foi feito

### A memória ganhou dimensão temporal

Heap dump mostrava objetos.

GC logs mostraram ciclos e tendências.

### Young collections ganharam contexto

Frequência elevada passou a ser relacionada à allocation rate e recuperação.

### Mixed collections ganharam significado

Old regions recuperadas passaram a ser analisadas após ciclos concorrentes.

### Full collections ganharam atenção

Eventos abrangentes passaram a ser classificados por causa e impacto.

### Pausas ganharam distribuição

Média, percentis, máximo e frequência passaram a ser comparados.

### Ocupação ganhou piso pós-GC

O crescimento do live set pôde ser observado ao longo dos ciclos.

### Promoção ganhou evidência

Survivors e age tables passaram a indicar vida dos objetos.

### Humongous allocations ganharam contexto

Objetos grandes passaram a ser relacionados à region size e retenção.

### Safepoints ganharam separação

Tempo para safepoint deixou de ser confundido automaticamente com pausa de GC.

### A próxima aula ganhou base

JVM tuning básico poderá partir de comportamento medido, não de flags copiadas.

---

## Erros comuns importantes

### Tratar qualquer GC como problema

Coleta é parte normal da JVM.

### Olhar apenas a pausa máxima

Frequência e distribuição também importam.

### Usar apenas média

Tail latency pode ficar invisível.

### Declarar leak pelo heap crescente antes do GC

O importante é observar o piso após coleta.

### Tratar promoção como vazamento

Objetos legítimos também sobrevivem.

### Tratar mixed GC como falha

É parte do funcionamento do G1.

### Ignorar full GC

Pode indicar pressão ou cenário inesperado.

### Comparar releases com heaps diferentes

A comparação perde validade.

### Versionar logs brutos

Artifacts temporários entram no repositório.

### Antecipar tuning

Flags finais pertencem à aula 573.

---

## Comandos úteis

### Ver opções de logging

```powershell
java `
  -Xlog:help
```

### Iniciar com GC logs

```powershell
java `
  "-Xlog:gc*,safepoint:file=.tmp/gc-logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20M" `
  -jar `
  target/kafka-orders-lab.jar
```

### Validar arquivo

```powershell
.\scripts\observability\gc-logs\validate-gc-log-file.ps1
```

### Analisar pausas

```powershell
.\scripts\observability\gc-logs\analyze-gc-pauses.ps1
```

### Comparar releases

```powershell
.\scripts\observability\gc-logs\compare-gc-logs-by-release.ps1
```

---

## Exercício guiado

### Parte 1 — Runtime

Identifique JDK, collector e heap.

### Parte 2 — Capture

Configure Unified Logging e rotação.

### Parte 3 — Baseline

Colete comportamento normal.

### Parte 4 — Allocation

Gere objetos temporários.

### Parte 5 — Retention

Observe crescimento do live set.

### Parte 6 — Humongous

Gere objetos grandes controlados.

### Parte 7 — Analysis

Calcule pausas, ocupação e promoção.

### Parte 8 — Correlation

Relacione heap dump, métricas e traces.

### Parte 9 — Comparison

Compare cenários e releases.

### Parte 10 — Gate

Valide, registre e limpe artifacts.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 571 e ponte para a aula 573 foram preservadas;
- garbage collector, GC event, stop-the-world, pause, young, mixed, full, concurrent cycle, allocation rate, live set, promotion, survivor, age, humongous, occupancy, reclamation efficiency, overhead, safepoint e Unified Logging foram definidos;
- baseline foi validada;
- collector foi identificado;
- contrato de GC logs foi criado;
- Unified Logging foi configurado;
- decorators foram definidos;
- rotação foi configurada;
- script de inicialização foi criado;
- arquivo de log foi validado;
- taxonomia de eventos foi criada;
- linha de GC foi interpretada;
- parser foi criado;
- resumo de eventos foi criado;
- baseline normal foi coletada;
- alocação normal foi simulada;
- pressão controlada foi simulada;
- retenção foi simulada;
- objetos grandes foram simulados;
- política de pausas foi criada;
- pausas foram analisadas por distribuição;
- média isolada não foi usada como conclusão;
- política de ocupação foi criada;
- before, after e reclaimed foram analisados;
- piso pós-GC foi analisado;
- young collections foram interpretadas;
- mixed collections foram interpretadas;
- full collections foram interpretadas;
- política de full collection foi criada;
- full collections foram detectadas;
- ciclos concorrentes foram interpretados;
- política de promoção foi criada;
- age table foi documentada;
- promoção foi analisada;
- política de humongous foi criada;
- humongous allocations foram analisadas;
- evacuation failure foi explicada;
- explicit GC foi explicado;
- política de safepoints foi criada;
- safepoints foram analisados;
- política de comparação foi criada;
- releases foram comparadas em contexto equivalente;
- cenários foram comparados;
- GC logs foram relacionados ao heap dump;
- GC logs foram relacionados às métricas;
- GC logs foram relacionados aos thread dumps;
- política de parser foi criada;
- linhas desconhecidas são preservadas;
- política de qualidade foi criada;
- lacunas e truncamentos limitam conclusões;
- política de segurança foi criada;
- arquivos brutos não entram no Git;
- failure policy foi criada;
- cenários foram catalogados;
- baseline foi simulada;
- allocation pressure foi simulada;
- retained live set foi simulado;
- humongous allocation foi simulada;
- matriz de testes foi criada;
- troubleshooting foi criado;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, dado pessoal, ambiente real ou GC log bruto foi commitado;
- parâmetros finais de tuning não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/gc-logs `
  scripts/observability/gc-logs `
  docs/observability/gc-logs `
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
      "\.tmp/gc-logs|gc\.log|password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|order_id|email|private_key"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar diagnostico por GC logs"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- GC logs brutos;
- PIDs;
- command lines completas;
- credentials;
- dados pessoais;
- artifacts temporários;
- parâmetros finais de tuning;
- material da aula 573.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a analisar o comportamento temporal do garbage collector.

Você trabalhou com:

```text
Unified JVM Logging;

-Xlog;

young GC;

mixed GC;

full GC;

concurrent cycles;

before e after;

reclaimed bytes;

pausas;

promoção;

age tables;

humongous allocations;

safepoints;

comparações.
```

Você comprovou que GC é parte normal da JVM; pausas precisam ser analisadas por distribuição e frequência; o piso pós-GC revela tendência do live set; young collections refletem alocação e sobrevivência; mixed collections fazem parte do G1; full collections exigem classificação; promoção não significa leak; humongous allocations dependem da region size; safepoints não são sinônimo de GC; logs precisam ser comparados em janelas equivalentes; e heap dumps, métricas, traces e thread dumps complementam a análise.

A próxima aula será:

```text
573 - M18.18 - JVM tuning basico
```

Nela, você irá transformar evidências de memória, pausas, throughput e comportamento do serviço em ajustes básicos e reversíveis de heap, collector e flags, sempre medindo antes e depois.

Nenhum valor final de `-Xms`, `-Xmx`, pause target, region size, thread count, tenuring, collector alternativo ou configuração de produção foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Identifiquei JDK e collector.
- [ ] Configurei `-Xlog` e rotação.
- [ ] Coletei baseline normal.
- [ ] Analisei pausas e ocupação.
- [ ] Analisei promoção e humongous.
- [ ] Classifiquei full GC e safepoints.
- [ ] Comparei cenários e releases.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### `-Xlog` impede a JVM de iniciar

Valide a sintaxe com `java -Xlog:help`.

### O arquivo não é criado

Confirme diretório, permissões e configuração de output.

### A rotação não funciona

Revise `filecount`, `filesize` e path.

### O parser perde linhas

Preserve eventos desconhecidos e atualize a taxonomia.

### O collector não aparece

Garanta eventos de startup ou consulte flags da JVM.

### O piso pós-GC cresce

Compare heap dump, release, filas, caches e live set.

### Full GC apareceu uma vez

Classifique causa, cenário e impacto antes de concluir.

### Humongous aparece sem objeto conhecido

Correlacione region size e heap dump.

### Safepoint parece maior que a pausa de GC

Analise time-to-safepoint e outras operações da JVM.

### A investigação começou a escolher flags finais

Preserve esse trabalho para a aula 573.

---

## Perguntas de revisão

1. O que são GC logs?
2. O que é stop-the-world?
3. O que é young GC?
4. O que é mixed GC?
5. O que é full GC?
6. O que é concurrent cycle?
7. O que é allocation rate?
8. O que é live set?
9. O que é promotion?
10. O que é humongous allocation?
11. O que representa heap before e after?
12. Por que observar o piso pós-GC?
13. Por que média de pausa não basta?
14. O que é evacuation failure?
15. O que é explicit GC?
16. O que é safepoint?
17. Como GC logs e heap dumps se complementam?
18. Por que comparar configurações equivalentes?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Registros dos eventos do collector.
2. Pausa das threads da aplicação.
3. Coleta de regiões jovens.
4. Jovens e antigas selecionadas.
5. Coleta abrangente.
6. Fases paralelas à aplicação.
7. Velocidade de alocação.
8. Objetos vivos após GC.
9. Movimentação para regiões antigas.
10. Objeto grande em relação à região.
11. Ocupação antes e depois.
12. Identificar crescimento do live set.
13. Esconde tail e frequência.
14. Falha ao evacuar objetos.
15. Coleta solicitada explicitamente.
16. Ponto seguro da JVM.
17. Tempo versus estrutura.
18. Preservar validade da comparação.
19. JVM tuning básico.
20. JVM tuning básico.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 572 - M18.17 - GC logs

- Continuei após Heap dump.
- Entendi GC logs como histórico temporal da coleta de memória.
- Validei JDK 21 e Unified JVM Logging.
- Identifiquei o collector real da JVM.
- Criei contrato e política de captura.
- Configurei `-Xlog:gc*,safepoint`.
- Configurei rotação por quantidade e tamanho.
- Criei script de inicialização com GC logs.
- Validei arquivo, decorators e eventos de startup.
- Criei taxonomia de eventos.
- Interpretei GC ID, causa, before, after, capacity e pause.
- Criei parser e resumo de eventos.
- Coletei baseline normal.
- Simulei allocation pressure com objetos temporários.
- Simulei crescimento de live set.
- Simulei objetos humongous controlados.
- Analisei quantidade, máximo e percentis de pausas.
- Evitei conclusões baseadas apenas na média.
- Analisei ocupação e piso pós-GC.
- Diferenciei young, mixed e full collections.
- Analisei ciclos concorrentes.
- Criei política de promoção e age tables.
- Analisei humongous allocations.
- Estudei evacuation failure e explicit GC.
- Criei política e análise de safepoints.
- Comparei releases e cenários equivalentes.
- Correlacionei GC logs com heap dumps, métricas e thread dumps.
- Criei políticas de parser, qualidade, segurança e failure.
- Executei cenários controlados.
- Coletei evidence sanitizada.
- Não antecipei tuning final da JVM.
- Próxima aula: JVM tuning básico.
```

---

## Referência técnica curta

- Unified JVM Logging.
- `-Xlog:gc`.
- G1 Garbage Collector.
- Young GC.
- Mixed GC.
- Full GC.
- Concurrent Marking.
- GC Pause Analysis.
- Humongous Objects.
- JVM Safepoints.

Regra final:

```text
diagnóstico por GC logs precisa combinar eventos, frequência, pausas, ocupação e contexto: Unified JVM Logging registra collector, causas, before, after, capacity, reclaimed bytes, fases concorrentes, promoção, humongous allocations e safepoints, com rotação e artifacts brutos fora do Git; young e mixed collections podem ser normais, full collections exigem classificação, média de pausa não substitui percentis e máximo, e o piso pós-GC ajuda a observar crescimento do live set sem provar vazamento sozinho; comparação exige mesmo collector, heap configuration, tráfego, janela, release e cenário, enquanto heap dumps explicam objetos, métricas mostram tendência e thread dumps ajudam a entender impacto sobre execução; parser, qualidade, segurança e evidence sanitizada limitam conclusões, deixando para a aula 573 os ajustes básicos e reversíveis de heap, collector e flags, sempre medidos antes e depois.
```
