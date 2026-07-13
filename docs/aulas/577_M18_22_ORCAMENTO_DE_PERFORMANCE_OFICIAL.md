# 577 - M18.22 - Orcamento de performance

## Apresentação da aula

Na aula 576, você transformou demanda, throughput, latência, utilização, saturação, crescimento e resiliência em um plano de capacidade.

Você trabalhou com:

```text
demanda média;

demanda de pico;

capacidade sustentável;

utilização alvo;

headroom;

concorrência;

Little's Law;

réplicas;

N-1;

rolling deployment;

crescimento;

sazonalidade;

retry amplification;

backlog;

tempo de drenagem;

lead time.
```

Capacity planning respondeu:

```text
quanta capacidade
o sistema precisa

para sustentar
a demanda atual
e projetada?
```

Agora surge uma pergunta mais granular:

```text
quanto cada operação
pode consumir

antes de comprometer
a jornada,
o serviço
ou a capacidade planejada?
```

Essa é a função do **orçamento de performance**.

Um orçamento de performance define limites mensuráveis para operações, endpoints, consultas, payloads, alocações, dependências e jornadas.

Ele transforma expectativas vagas como:

```text
a API precisa ser rápida
```

em contratos verificáveis:

```text
GET /orders/{id}

p95:
até 180 ms;

p99:
até 350 ms;

queries:
até 3;

payload:
até 32 KiB;

chamadas externas:
até 1;

alocação estimada:
até 2 MiB por operação;

erro técnico:
abaixo de 1%.
```

Esses valores precisam surgir de:

- SLOs;
- capacidade sustentável;
- arquitetura;
- baseline;
- criticidade da jornada;
- dependências;
- volume;
- headroom;
- custo;
- experiência do usuário;
- risco de regressão.

O orçamento responde:

```text
esta mudança
continua dentro
do limite aceitável?
```

Sem budget, uma regressão pode parecer pequena:

```text
+20 ms por requisição.
```

Mas em grande volume ela pode gerar:

- mais concorrência;
- mais threads ocupadas;
- mais conexões abertas;
- mais CPU;
- mais tempo em fila;
- maior lag;
- mais timeout;
- menor capacidade por réplica.

O orçamento inclui latência, throughput, CPU, memória, alocação, queries, conexões, payload, dependências, retries, erros e tempo total da jornada.

Também serão criados gates de regressão para impedir que uma mudança aprovada funcionalmente degrade o comportamento operacional.

A pergunta central será:

```text
como definir
orçamentos de performance

por operação
e por jornada

com limites,
margens,
fontes,
testes
e critérios de bloqueio?
```

A aula irá diferenciar:

```text
budget absoluto;

budget relativo;

budget por operação;

budget por jornada;

budget técnico;

budget de dependência;

budget de regressão;

budget de capacidade.
```

Exemplo de budget relativo:

```text
a nova release
não pode aumentar
o p95 em mais de 8%
contra a baseline.
```

Exemplo de budget absoluto:

```text
o p95
não pode ultrapassar
200 ms.
```

Os dois podem coexistir.

Uma release pode ficar dentro do limite absoluto e ainda assim apresentar regressão importante.

Exemplo:

```text
baseline:
90 ms.

nova release:
170 ms.

limite absoluto:
200 ms.
```

O limite absoluto foi respeitado.

Mas a regressão foi de aproximadamente:

```text
88,9%.
```

Por isso, o gate deve verificar:

```text
limite absoluto
e
variação relativa.
```

A aula não irá aprofundar a interpretação operacional de saturação em dashboards e incidentes.

Não serão detalhados ainda:

- leitura sistemática de filas;
- saturação de pools;
- CPU throttling;
- saturação de conexão;
- crescimento de lag;
- latência não linear;
- exaustão de executor;
- memória próxima do limite;
- sinais combinados de saturação;
- diferenciação visual entre uso alto e saturação;
- diagnóstico operacional de recurso esgotado.

Esses assuntos pertencem à próxima aula oficial:

```text
578 - M18.23 - Leitura de saturacao
```

A regra central será:

```text
performance budget
não é meta aspiracional;

é um limite
mensurável,
versionado,
testável
e relacionado
à capacidade
e ao SLO.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
575:
JMC analise de gargalos.

576:
Capacity planning.

577:
Orcamento de performance.

578:
Leitura de saturacao.
```

A progressão é:

```text
identificar gargalos;

planejar capacidade;

limitar consumo por operação;

interpretar saturação operacional.
```

Nesta aula:

```text
budget de latência:
sim.

budget de CPU:
sim.

budget de memória:
sim.

budget de alocação:
sim.

budget de queries:
sim.

budget de payload:
sim.

budget de dependência:
sim.

budget por jornada:
sim.

gate absoluto:
sim.

gate relativo:
sim.

baseline:
sim.

regressão:
sim.

leitura profunda de saturação:
não.

diagnóstico de pools saturados:
não.

interpretação operacional de filas:
não.
```

Você reutilizará:

- SLOs;
- capacity planning;
- throughput sustentável;
- JFR;
- JMC;
- GC logs;
- heap dumps;
- traces;
- métricas;
- testes de carga;
- consultas de banco;
- logs estruturados;
- release metadata;
- pipelines de CI.

O orçamento precisa refletir arquitetura, capacidade e jornada reais.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance-budget
├── performance-budget-contract.yaml
├── performance-budget-catalog.yaml
├── performance-budget-latency-policy.yaml
├── performance-budget-throughput-policy.yaml
├── performance-budget-cpu-policy.yaml
├── performance-budget-memory-policy.yaml
├── performance-budget-allocation-policy.yaml
├── performance-budget-query-policy.yaml
├── performance-budget-payload-policy.yaml
├── performance-budget-dependency-policy.yaml
├── performance-budget-retry-policy.yaml
├── performance-budget-journey-policy.yaml
├── performance-budget-regression-policy.yaml
├── performance-budget-exception-policy.yaml
├── performance-budget-versioning-policy.yaml
├── performance-budget-data-quality-policy.yaml
├── performance-budget-security-policy.yaml
├── performance-budget-failure-policy.yaml
├── performance-budget-scenarios.yaml
├── performance-budget-decision-register.yaml
└── performance-budget-evidence.yaml

performance-budget/budgets
├── create-order-budget.yaml
├── get-order-budget.yaml
├── list-orders-budget.yaml
├── publish-order-event-budget.yaml
├── consume-order-event-budget.yaml
└── order-journey-budget.yaml

performance-budget/reports
├── performance-budget-baseline.yaml
├── performance-budget-candidate.yaml
├── performance-budget-regression-report.yaml
├── performance-budget-exception-report.yaml
└── performance-budget-gate-report.yaml

scripts/performance-budget
├── validate-performance-budget-contract.ps1
├── validate-performance-budget-catalog.ps1
├── collect-performance-budget-baseline.ps1
├── measure-endpoint-latency.ps1
├── measure-throughput-budget.ps1
├── measure-cpu-budget.ps1
├── measure-memory-budget.ps1
├── measure-allocation-budget.ps1
├── measure-query-budget.ps1
├── measure-payload-budget.ps1
├── measure-dependency-budget.ps1
├── measure-journey-budget.ps1
├── compare-performance-budget.ps1
├── enforce-performance-budget.ps1
├── validate-performance-budget-exceptions.ps1
├── scan-performance-budget-output.ps1
├── collect-performance-budget-evidence.ps1
└── verify-performance-budget-baseline.ps1

docs/performance-budget
├── PERFORMANCE_BUDGET_OVERVIEW.md
├── LATENCY_BUDGET_GUIDE.md
├── RESOURCE_BUDGET_GUIDE.md
├── QUERY_AND_PAYLOAD_BUDGET.md
├── DEPENDENCY_BUDGET_GUIDE.md
├── JOURNEY_BUDGET_GUIDE.md
├── REGRESSION_GATE_GUIDE.md
├── PERFORMANCE_BUDGET_TEST_MATRIX.md
└── PERFORMANCE_BUDGET_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, budgets por endpoint e jornada, baseline, limites absolutos e relativos, gates, exceções auditáveis, decisões e evidence sanitizada.

Você irá validar a baseline, definir o contrato, criar budgets por operação, medir latência, throughput, CPU, memória, alocação, queries, payloads e dependências, compor a jornada, comparar releases, bloquear regressões, controlar exceções e executar o gate.

---

## Conceito essencial

### Performance budget

Limite mensurável de consumo ou tempo para uma operação, jornada ou componente.

---

### Absolute budget

Limite fixo.

Exemplo:

```text
p95 <= 200 ms.
```

---

### Relative budget

Limite comparado à baseline.

Exemplo:

```text
regressão de p95 <= 8%.
```

---

### Endpoint budget

Budget aplicado a uma operação HTTP específica.

---

### Journey budget

Budget aplicado à soma ou composição de uma jornada ponta a ponta.

---

### Latency budget

Tempo máximo permitido em determinada distribuição.

---

### Throughput budget

Quantidade mínima ou faixa aceitável de unidades processadas por tempo.

---

### CPU budget

Consumo máximo de CPU atribuído ao cenário ou operação.

---

### Memory budget

Limite de memória usado durante uma janela ou cenário.

---

### Allocation budget

Quantidade máxima de bytes ou objetos alocados por operação.

---

### Query budget

Quantidade máxima de consultas ou tempo de banco por operação.

---

### Payload budget

Tamanho máximo de request, response ou mensagem.

---

### Dependency budget

Parcela de tempo e chamadas reservada para dependências externas.

---

### Retry budget

Quantidade máxima de tentativas extras admitidas por operação ou janela.

---

### Regression gate

Validação automática que aprova ou bloqueia uma mudança com base no budget.

---

### Exception

Desvio temporário e formalmente aprovado de um budget.

---

### Baseline

Resultado de referência usado para comparação.

---

### Noise margin

Margem usada para evitar falso positivo por variação natural.

---

### Confidence interval

Faixa estimada de variação de uma medida.

---

### Performance envelope

Conjunto de limites que define comportamento aceitável.

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

- release identificada;
- workload reproduzível;
- warmup definido;
- testes de carga disponíveis;
- métricas exportadas;
- traces disponíveis;
- consultas mensuráveis;
- payloads sintéticos;
- nenhum budget antigo será reutilizado sem validação;
- nenhum valor real de produção será inventado;
- leitura de saturação não será antecipada.

---

### 2. Criar contrato de orçamento

Arquivo:

```text
performance-budget-contract.yaml
```

Conteúdo:

```yaml
performanceBudget:
  scope:
    required:
      - service
      - operation
      - release
      - environment

  baseline:
    required:
      - source
      - date
      - workload
      - repetitions

  dimensions:
    allowed:
      - latency
      - throughput
      - cpu
      - memory
      - allocation
      - queries
      - payload
      - dependencies
      - retries
      - journey

  limit:
    required:
      - absolute
      - relative

  gate:
    required:
      - pass
      - fail
      - inconclusive

  exception:
    controlled:
      true

  saturationReading:
    deferredToLesson578
```

---

### 3. Criar catálogo de budgets

Arquivo:

```text
performance-budget-catalog.yaml
```

Conteúdo:

```yaml
budgets:
  - id:
      PB-ORDER-CREATE

    operation:
      POST /orders

    criticality:
      high

    owner:
      orders-api

    baseline:
      required

    dimensions:
      - latency
      - queries
      - payload
      - dependencies
      - allocation
      - errors

  - id:
      PB-ORDER-GET

    operation:
      GET /orders/{id}

    criticality:
      medium

    dimensions:
      - latency
      - queries
      - payload
      - cpu
```

Cada budget precisa de owner.

---

### 4. Definir fontes dos limites

Fontes possíveis:

- SLO;
- teste de carga;
- capacity plan;
- baseline aprovada;
- contrato externo;
- arquitetura;
- limite de dependência;
- experiência do usuário;
- custo;
- histórico;
- benchmark interno.

Fonte inválida:

```text
parece razoável.
```

Registre:

- fonte;
- data;
- owner;
- confiança;
- validade;
- impacto se estiver errada.

---

### 5. Criar budget de criação de pedido

Arquivo:

```text
create-order-budget.yaml
```

Exemplo didático:

```yaml
budget:
  id:
    PB-ORDER-CREATE

  operation:
    POST /orders

  latency:
    p50Ms:
      120

    p95Ms:
      250

    p99Ms:
      500

  queries:
    maximum:
      5

  payload:
    requestMaxBytes:
      32768

    responseMaxBytes:
      16384

  dependencies:
    maximumCalls:
      2

    totalP95Ms:
      160

  allocations:
    estimatedMaxBytesPerOperation:
      3145728

  errors:
    technicalRateMaximum:
      0.01

  regression:
    p95MaximumIncrease:
      0.08

  productionValues:
    undefined
```

Os números são didáticos.

---

### 6. Criar budget de consulta

Arquivo:

```text
get-order-budget.yaml
```

Exemplo:

```yaml
budget:
  id:
    PB-ORDER-GET

  operation:
    GET /orders/{id}

  latency:
    p95Ms:
      180

  queries:
    maximum:
      2

  payload:
    responseMaxBytes:
      32768

  cpu:
    maximumMillisecondsPerOperation:
      12

  regression:
    p95MaximumIncrease:
      0.08
```

O budget reflete o caminho.

---

### 7. Criar budget da jornada

Arquivo:

```text
order-journey-budget.yaml
```

Conteúdo:

```yaml
journey:
  id:
    PB-ORDER-JOURNEY

  steps:
    - receive-request
    - validate-order
    - persist-order
    - call-payment
    - publish-event
    - consume-event
    - finalize-status

  totalLatency:
    p95Ms:
      1500

  synchronousPart:
    p95Ms:
      350

  asynchronousCompletion:
    p95Ms:
      1200

  retries:
    maximum:
      2

  errorRate:
    maximum:
      0.02

  regression:
    maximumIncrease:
      0.10
```

A soma simples dos budgets individuais nem sempre representa a jornada.

Etapas podem ocorrer em paralelo ou de forma assíncrona.

---

### 8. Criar política de latência

Arquivo:

```text
performance-budget-latency-policy.yaml
```

Conteúdo:

```yaml
latency:
  requiredPercentiles:
    - p50
    - p95
    - p99

  averageOnly:
    forbidden

  warmup:
    required

  minimumSampleSize:
    required

  timeout:
    countedAsFailure:
      true

  compare:
    - absolute-limit
    - relative-regression

  noiseMargin:
    documented:
      required
```

A média oculta o tail.

---

### 9. Medir latência

Script:

```text
measure-endpoint-latency.ps1
```

Fluxo:

1. iniciar aplicação;
2. validar release;
3. aquecer;
4. executar workload;
5. coletar amostras;
6. calcular percentis;
7. registrar timeout;
8. comparar com baseline;
9. repetir;
10. gerar relatório.

Resultado:

```text
p50;

p95;

p99;

maximum;

timeout count;

sample count;

confidence.
```

---

### 10. Tratar tamanho de amostra

Um p99 calculado sobre poucas amostras é instável.

A política exige amostra e duração mínimas, distribuição suficiente, repetição e workload consistente.

Se a amostra for insuficiente:

```text
INCONCLUSIVE.
```

Não converta incerteza em aprovação.

---

### 11. Criar política de throughput

Arquivo:

```text
performance-budget-throughput-policy.yaml
```

Conteúdo:

```yaml
throughput:
  minimum:
    requiredForCapacityCriticalOperations

  window:
    documented:
      required

  latencyPreserved:
    required

  errorsPreserved:
    required

  backlogStable:
    required

  relativeRegression:
    maximum:
      definedPerOperation
```

Throughput maior com latência e erros degradados não é aprovação.

---

### 12. Medir throughput

Script:

```text
measure-throughput-budget.ps1
```

Registre unidade, janela, volume, sucessos, erros, p95, backlog, réplicas, CPU e release.

Exemplo:

```text
budget:
mínimo 120 req/s.

resultado:
128 req/s.

p95:
aprovado.

erros:
aprovado.

gate:
PASS.
```

---

### 13. Criar política de CPU

Arquivo:

```text
performance-budget-cpu-policy.yaml
```

Conteúdo:

```yaml
cpu:
  measure:
    - process-cpu
    - container-cpu
    - cpu-per-operation

  compare:
    equivalentWorkload:
      required

  highUtilization:
    saturationConclusion:
      deferredToLesson578

  absoluteLimit:
    scenarioSpecific:
      true

  relativeRegression:
    required
```

Nesta aula, CPU é budget de consumo.

A interpretação de saturação fica para a próxima.

---

### 14. Medir CPU por operação

Script:

```text
measure-cpu-budget.ps1
```

Use CPU total por operação, JFR, métricas de processo e comparação baseline/candidate.

Exemplo:

```text
baseline:
8 ms CPU/operação.

candidate:
10 ms CPU/operação.

regressão:
25%.

budget relativo:
10%.

gate:
FAIL.
```

---

### 15. Criar política de memória

Arquivo:

```text
performance-budget-memory-policy.yaml
```

Conteúdo:

```yaml
memory:
  measure:
    - heap-after-gc
    - rss
    - peak-heap
    - native-headroom

  scenario:
    equivalent:
      required

  singleSnapshot:
    conclusion:
      forbidden

  leakConclusion:
    useHeapDump:
      required

  regression:
    required
```

O budget de memória observa consumo.

Não conclui sozinho vazamento.

---

### 16. Medir memória

Script:

```text
measure-memory-budget.ps1
```

Registre heap, pós-workload, pós-GC, RSS, pico, direct buffers, threads e release.

Compare:

```text
baseline;

candidate;

delta;

budget;

gate.
```

---

### 17. Criar política de alocação

Arquivo:

```text
performance-budget-allocation-policy.yaml
```

Conteúdo:

```yaml
allocation:
  measure:
    - bytes-per-operation
    - objects-per-operation
    - outside-tlab-events
    - allocation-hot-stacks

  source:
    - JFR
    - profiler
    - controlled-estimate

  objectContent:
    forbidden

  regression:
    relative:
      required
```

Allocation budget ajuda a controlar pressão de GC.

---

### 18. Medir alocação

Script:

```text
measure-allocation-budget.ps1
```

Use gravação JFR curta e workload controlado.

Registre:

- operação;
- bytes estimados;
- objetos;
- top classes;
- top stacks;
- amostras;
- baseline;
- candidate;
- variação;
- gate.

Não exporte conteúdo dos objetos.

---

### 19. Criar política de queries

Arquivo:

```text
performance-budget-query-policy.yaml
```

Conteúdo:

```yaml
queries:
  measure:
    - count-per-operation
    - total-database-time
    - maximum-single-query-time
    - rows-read
    - rows-returned

  NPlusOne:
    forbidden:
      true

  transaction:
    reviewed:
      required

  explainPlan:
    requiredForRegression:
      true

  productionQueryText:
    evidence:
      sanitized
```

Query budget não é apenas contagem.

Tempo e volume também importam.

---

### 20. Medir queries

Script:

```text
measure-query-budget.ps1
```

Para cada operação, registre queries, tempo total, maior query, linhas, transação, espera de conexão e release.

Exemplo:

```text
baseline:
2 queries.

candidate:
21 queries.

budget:
máximo 3.

gate:
FAIL_N_PLUS_ONE.
```

---

### 21. Criar política de payload

Arquivo:

```text
performance-budget-payload-policy.yaml
```

Conteúdo:

```yaml
payload:
  measure:
    - request-bytes
    - response-bytes
    - message-bytes
    - compressed-bytes
    - serialization-time

  sensitiveContent:
    forbidden

  maximum:
    operationSpecific:
      true

  regression:
    relative:
      required
```

Payload maior afeta rede, memória, serialização e latência.

---

### 22. Medir payload

Script:

```text
measure-payload-budget.ps1
```

Registre apenas tamanho, compressão, serialização, content type, operação e release.

Não persista o conteúdo.

Exemplo:

```text
response baseline:
18 KiB.

candidate:
41 KiB.

absolute budget:
32 KiB.

gate:
FAIL.
```

---

### 23. Criar política de dependências

Arquivo:

```text
performance-budget-dependency-policy.yaml
```

Conteúdo:

```yaml
dependencies:
  measure:
    - call-count
    - total-time
    - p95
    - retries
    - timeouts
    - fallback

  perOperation:
    maximumCalls:
      required

  totalLatencyShare:
    budgeted:
      required

  externalDependency:
    ownSlo:
      referenced
```

A operação não deve consumir toda a latência disponível antes de entrar na dependência.

---

### 24. Compor budget de latência

Exemplo de operação síncrona:

```text
budget total:
350 ms.

validação:
30 ms.

banco:
70 ms.

payment:
160 ms.

serialização:
20 ms.

fila e margem:
70 ms.
```

A soma é:

```text
350 ms.
```

Se payment consome 250 ms, o budget total fica em risco.

---

### 25. Medir dependências

Script:

```text
measure-dependency-budget.ps1
```

Use traces e eventos customizados.

Registre dependência, chamadas, percentis, retries, timeouts, parcela total, baseline e candidate.

Não registre URLs com query sensível.

---

### 26. Criar política de retries

Arquivo:

```text
performance-budget-retry-policy.yaml
```

Conteúdo:

```yaml
retries:
  perOperation:
    maximum:
      defined

  perWindow:
    rateMaximum:
      defined

  retryAmplification:
    measured:
      required

  retryWithoutBackoff:
    forbidden

  retryWithoutIdempotency:
    forbiddenForUnsafeOperation
```

Retry consome orçamento de dependência e capacidade.

---

### 27. Criar política de jornada

Arquivo:

```text
performance-budget-journey-policy.yaml
```

Conteúdo:

```yaml
journey:
  required:
    - steps
    - synchronous-budget
    - asynchronous-budget
    - dependencies
    - retries
    - final-outcome

  parallelSteps:
    modeled:
      required

  timeoutPropagation:
    reviewed:
      required

  totalBudget:
    notSimpleSumWhenParallel:
      true
```

---

### 28. Medir a jornada

Script:

```text
measure-journey-budget.ps1
```

Use:

- trace root;
- spans;
- custom events;
- logs;
- status final;
- mensagem Kafka;
- consumer completion.

Registre:

- synchronous time;
- asynchronous completion;
- dependencies;
- retries;
- failures;
- p95;
- p99;
- baseline;
- candidate.

---

### 29. Criar política de regressão

Arquivo:

```text
performance-budget-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  evaluate:
    - absolute-limit
    - relative-change
    - confidence
    - sample-size
    - repeated-runs

  gate:
    failWhen:
      - absolute-limit-exceeded
      - relative-limit-exceeded
      - critical-dimension-missing
      - evidence-invalid

  inconclusiveWhen:
    - high-variance
    - insufficient-sample
    - environment-mismatch

  approve:
    requiresAllCriticalDimensions:
      true
```

---

### 30. Calcular regressão relativa

Fórmula:

```text
regression
=
(candidate - baseline)
/
baseline.
```

Exemplo:

```text
baseline:
100 ms.

candidate:
112 ms.

regressão:
12%.
```

Se o budget permite 8%:

```text
FAIL.
```

Para métricas em que maior é melhor, como throughput, a interpretação é inversa.

---

### 31. Aplicar noise margin

Pequenas variações podem ser ruído.

Exemplo:

```text
baseline:
100 ms.

candidate:
102 ms.

variação natural observada:
±4%.
```

Uma diferença de 2% não deve bloquear automaticamente.

A margem precisa vir de repetição.

Não use noise margin para esconder regressão consistente.

---

### 32. Repetir medições

Mínimo didático:

```text
3 execuções.
```

Preferível:

- warmup igual;
- workload igual;
- dataset igual;
- ambiente igual;
- release identificada;
- dependências controladas;
- mesma duração.

Registre mediana e dispersão.

---

### 33. Criar baseline

Arquivo:

```text
performance-budget-baseline.yaml
```

Conteúdo:

```yaml
baseline:
  release:
    previous-approved

  workload:
    order-standard

  repetitions:
    3

  results:
    createOrder:
      latencyP95Ms:
        210

      queryCount:
        4

      payloadResponseBytes:
        12000

      dependencyCalls:
        2

      allocationBytes:
        2500000
```

Baseline precisa ser versionada.

---

### 34. Criar candidate report

Arquivo:

```text
performance-budget-candidate.yaml
```

Inclua:

- release candidata;
- commit;
- workload;
- ambiente;
- resultados;
- variação;
- status por dimensão;
- observações;
- limitações.

Não inclua dados sensíveis.

---

### 35. Comparar budget

Script:

```text
compare-performance-budget.ps1
```

Para cada dimensão:

```text
baseline;

candidate;

absolute limit;

relative limit;

delta;

confidence;

status.
```

Status possíveis:

```text
PASS;

FAIL_ABSOLUTE;

FAIL_RELATIVE;

FAIL_MISSING_DATA;

INCONCLUSIVE.
```

---

### 36. Enforce do budget

Script:

```text
enforce-performance-budget.ps1
```

O script deve:

- ler catálogo;
- localizar operação;
- carregar baseline;
- carregar candidate;
- validar ambiente;
- avaliar dimensões críticas;
- gerar relatório;
- retornar exit code.

Exemplo:

```text
0:
PASS.

1:
FAIL.

2:
INCONCLUSIVE.

3:
INVALID_INPUT.
```

O pipeline deve distinguir falha técnica de regressão.

---

### 37. Integrar no pipeline

Exemplo conceitual:

```text
build;

unit tests;

integration tests;

performance smoke;

budget collection;

budget comparison;

budget gate;

artifact sanitization.
```

O smoke não substitui teste de carga completo.

Ele protege contra regressões evidentes.

---

### 38. Criar política de exceção

Arquivo:

```text
performance-budget-exception-policy.yaml
```

Conteúdo:

```yaml
exception:
  required:
    - budget-id
    - dimension
    - reason
    - owner
    - risk
    - expiry-date
    - rollback-or-fix-plan
    - approval

  permanentException:
    forbidden

  expired:
    action:
      fail-gate

  repeatedException:
    action:
      architecture-review
```

Exceção não é remoção do budget.

---

### 39. Criar exception report

Arquivo:

```text
performance-budget-exception-report.yaml
```

Exemplo:

```yaml
exception:
  id:
    PB-EX-001

  budget:
    PB-ORDER-CREATE

  dimension:
    dependency-p95

  reason:
    temporary-payment-sandbox-degradation

  expiryDate:
    2026-08-01

  owner:
    orders-api-team

  status:
    laboratory-example
```

Não use data sem owner e prazo.

---

### 40. Criar política de versionamento

Arquivo:

```text
performance-budget-versioning-policy.yaml
```

Conteúdo:

```yaml
versioning:
  budget:
    semanticChange:
      required

  baseline:
    immutable:
      true

  update:
    requires:
      - evidence
      - owner
      - reason
      - decision

  loosenLimit:
    architectureReview:
      required

  tightenLimit:
    capacityValidation:
      required
```

Alterar o budget para fazer o pipeline passar é proibido.

---

### 41. Registrar decisões

Arquivo:

```text
performance-budget-decision-register.yaml
```

Cada decisão inclui:

- budget;
- dimensão;
- valor anterior;
- valor novo;
- motivo;
- evidência;
- owner;
- aprovação;
- data;
- impacto;
- revisão.

---

### 42. Criar política de qualidade

Arquivo:

```text
performance-budget-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingBaseline:
    action:
      block-gate

  differentEnvironment:
    result:
      invalid-comparison

  differentWorkload:
    result:
      invalid-comparison

  insufficientSamples:
    result:
      inconclusive

  highVariance:
    result:
      inconclusive

  missingCriticalDimension:
    action:
      fail-gate

  staleBaseline:
    action:
      recollect

  inventedProductionLimit:
    action:
      block-release
```

---

### 43. Criar política de segurança

Arquivo:

```text
performance-budget-security-policy.yaml
```

Conteúdo:

```yaml
security:
  reports:
    forbidden:
      - payload-content
      - customer-id
      - credentials
      - full-url-query
      - production-host
      - raw-query-with-sensitive-values

  evidence:
    only:
      - sizes
      - durations
      - counts
      - categories
      - sanitized-identifiers

  externalSharing:
    forbiddenInLaboratory
```

---

### 44. Criar failure policy

Arquivo:

```text
performance-budget-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  collectorError:
    action:
      invalid-input

  missingMetric:
    action:
      fail-critical-or-inconclusive

  timeout:
    action:
      count-as-failure

  budgetExceeded:
    action:
      fail-gate

  expiredException:
    action:
      fail-gate

  sensitiveData:
    action:
      block-artifact

  saturationDiagnosis:
    deferredToLesson578
```

---

### 45. Criar cenários

Arquivo:

```text
performance-budget-scenarios.yaml
```

Cenários:

```text
baseline-pass;

absolute-latency-fail;

relative-latency-fail;

query-budget-fail;

payload-budget-fail;

allocation-budget-fail;

dependency-budget-fail;

journey-budget-fail;

throughput-regression;

insufficient-samples;

high-variance;

expired-exception;

environment-mismatch.
```

Cada cenário registra:

- input;
- baseline;
- candidate;
- budget;
- expected gate;
- reason;
- cleanup;
- evidence.

---

### 46. Simular regressão de latência

Baseline:

```text
p95:
200 ms.
```

Candidate:

```text
p95:
236 ms.
```

Limites:

```text
absoluto:
250 ms.

relativo:
8%.
```

Resultado:

```text
absoluto:
PASS.

relativo:
FAIL.

gate final:
FAIL_RELATIVE.
```

---

### 47. Simular N+1

Baseline:

```text
2 queries.
```

Candidate:

```text
22 queries.
```

Budget:

```text
máximo 3.
```

O gate falha mesmo se a latência local ainda estiver aceitável.

Isso evita que o problema apareça apenas em volume alto.

---

### 48. Simular payload excessivo

Baseline:

```text
12 KiB.
```

Candidate:

```text
48 KiB.
```

Budget:

```text
32 KiB.
```

O gate falha.

A investigação precisa identificar:

- campo novo;
- lista expandida;
- dados redundantes;
- serialização;
- compressão;
- contrato.

---

### 49. Simular alocação excessiva

Baseline:

```text
2,4 MiB/operação.
```

Candidate:

```text
4,1 MiB/operação.
```

Budget relativo:

```text
15%.
```

O gate falha.

Use JFR para localizar classes e stacks.

---

### 50. Criar matriz de testes

Arquivo:

```text
PERFORMANCE_BUDGET_TEST_MATRIX.md
```

Cenários:

- contrato;
- catálogo;
- owner;
- baseline;
- absolute latency;
- relative latency;
- p50;
- p95;
- p99;
- sample size;
- throughput;
- CPU;
- memory;
- allocation;
- queries;
- N+1;
- payload;
- dependency calls;
- dependency latency;
- retries;
- journey;
- noise margin;
- repeated runs;
- gate exit code;
- exception;
- expiry;
- versioning;
- stale baseline;
- environment mismatch;
- sensitive scan;
- evidence sanitizada.

---

### 51. Criar troubleshooting

Arquivo:

```text
PERFORMANCE_BUDGET_TROUBLESHOOTING.md
```

Inclua:

- p99 instável;
- amostra pequena;
- baseline ausente;
- ambiente diferente;
- workload diferente;
- alta variância;
- timeout;
- query count incorreta;
- payload comprimido versus bruto;
- allocation sem stack;
- CPU por operação inconsistente;
- dependência instável;
- exception expirada;
- gate sempre passa;
- gate sempre falha;
- valor alterado sem decisão;
- saturação aprofundada antecipada.

---

### 52. Validar exceções

Script:

```text
validate-performance-budget-exceptions.ps1
```

Valide:

- ID;
- budget;
- dimensão;
- owner;
- motivo;
- risco;
- aprovação;
- prazo;
- fix plan;
- status.

Bloqueie exceção:

- sem prazo;
- sem owner;
- permanente;
- expirada;
- sem plano.

---

### 53. Gerar gate report

Arquivo:

```text
performance-budget-gate-report.yaml
```

Estrutura:

```yaml
gate:
  operation:
    POST /orders

  release:
    candidate

  dimensions:
    latency:
      status:
        PASS

    queries:
      status:
        FAIL_ABSOLUTE

    payload:
      status:
        PASS

    allocation:
      status:
        PASS

  final:
    FAIL

  reason:
    query-budget-exceeded

  exception:
    none
```

---

### 54. Coletar evidence

Script:

```text
collect-performance-budget-evidence.ps1
```

Arquivo:

```text
performance-budget-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- catalog status;
- baseline status;
- latency status;
- throughput status;
- CPU status;
- memory status;
- allocation status;
- query status;
- payload status;
- dependency status;
- retry status;
- journey status;
- regression status;
- exception status;
- gate status;
- security status;
- tests status;
- timestamp.

Não inclua:

- payloads;
- queries com dados;
- URLs completas;
- customer IDs;
- credentials;
- hosts reais;
- capacidade real de produção;
- dados de saturação da aula 578.

---

### 55. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance-budget\validate-performance-budget-contract.ps1

.\scripts\performance-budget\validate-performance-budget-catalog.ps1

.\scripts\performance-budget\collect-performance-budget-baseline.ps1

.\scripts\performance-budget\measure-endpoint-latency.ps1

.\scripts\performance-budget\measure-throughput-budget.ps1

.\scripts\performance-budget\measure-cpu-budget.ps1

.\scripts\performance-budget\measure-memory-budget.ps1

.\scripts\performance-budget\measure-allocation-budget.ps1

.\scripts\performance-budget\measure-query-budget.ps1

.\scripts\performance-budget\measure-payload-budget.ps1

.\scripts\performance-budget\measure-dependency-budget.ps1

.\scripts\performance-budget\measure-journey-budget.ps1

.\scripts\performance-budget\compare-performance-budget.ps1

.\scripts\performance-budget\enforce-performance-budget.ps1

.\scripts\performance-budget\validate-performance-budget-exceptions.ps1

.\scripts\performance-budget\scan-performance-budget-output.ps1

.\scripts\performance-budget\collect-performance-budget-evidence.ps1

.\scripts\performance-budget\verify-performance-budget-baseline.ps1
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
- latência medida;
- throughput medido;
- CPU medida;
- memória medida;
- alocação medida;
- queries medidas;
- payload medido;
- dependências medidas;
- jornada medida;
- regressão comparada;
- gate executado;
- exceções validadas;
- segurança aprovada;
- evidence sanitizada;
- leitura de saturação não antecipada.

---

### 56. Encerrar o laboratório

Pare workloads e coletores.

Remova somente artifacts temporários:

```powershell
Remove-Item `
  .tmp/performance-budget `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve budgets;
- preserve reports;
- preserve scripts;
- preserve docs;
- confirme que outputs brutos não estão no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### Expectativas ganharam limites

“Rápido” deixou de ser subjetivo.

### Operações ganharam budgets próprios

Endpoints diferentes passaram a refletir criticidade e arquitetura.

### Jornadas ganharam composição

Partes síncronas e assíncronas passaram a ter limites explícitos.

### Latência ganhou distribuição

p50, p95 e p99 passaram a ser tratados separadamente.

### Regressão ganhou dupla validação

Limites absolutos e relativos passaram a coexistir.

### Recursos ganharam orçamento

CPU, memória, alocação, queries e payloads entraram no contrato.

### Dependências ganharam parcela

Chamadas externas deixaram de consumir toda a latência sem controle.

### Exceções ganharam prazo

Desvios deixaram de virar permanência silenciosa.

### Pipeline ganhou gate

Regressões técnicas passaram a bloquear a entrega.

### A próxima aula ganhou fronteira

A leitura de saturação irá interpretar sinais operacionais combinados, enquanto esta aula permaneceu na definição e enforcement de limites.

---

## Erros comuns importantes

### Inventar budget

O limite precisa de fonte.

### Usar apenas média

Tail latency fica invisível.

### Usar apenas limite absoluto

Regressões grandes podem passar.

### Usar apenas variação relativa

Uma baseline ruim pode legitimar resultado ruim.

### Ignorar tamanho de amostra

Percentis ficam instáveis.

### Bloquear por ruído

Noise margin precisa ser conhecida.

### Alterar o budget para passar

Isso destrói o objetivo do gate.

### Aceitar exceção permanente

O desvio vira dívida invisível.

### Medir queries apenas por contagem

Tempo e linhas também importam.

### Antecipar leitura de saturação

Interpretação operacional de filas e recursos pertence à aula 578.

---

## Comandos úteis

### Coletar baseline

```powershell
.\scripts\performance-budget\collect-performance-budget-baseline.ps1
```

### Medir latência

```powershell
.\scripts\performance-budget\measure-endpoint-latency.ps1
```

### Comparar budgets

```powershell
.\scripts\performance-budget\compare-performance-budget.ps1
```

### Executar gate

```powershell
.\scripts\performance-budget\enforce-performance-budget.ps1
```

### Validar exceções

```powershell
.\scripts\performance-budget\validate-performance-budget-exceptions.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Crie contrato, catálogo e owners.

### Parte 2 — Endpoint budgets

Defina create, get e list.

### Parte 3 — Latency

Meça percentis e sample size.

### Parte 4 — Resources

Meça CPU, memória e alocação.

### Parte 5 — Database

Meça queries, tempo e linhas.

### Parte 6 — Payload e dependências

Meça tamanho, chamadas e latência.

### Parte 7 — Journey

Componha budget síncrono e assíncrono.

### Parte 8 — Regression

Compare absoluto e relativo.

### Parte 9 — Exceptions

Valide prazo, owner e plano.

### Parte 10 — Gate

Execute pipeline, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 576 e ponte para a aula 578 foram preservadas;
- performance budget, absolute, relative, endpoint, journey, latency, throughput, CPU, memory, allocation, query, payload, dependency, retry, regression gate, exception, baseline, noise margin, confidence interval e performance envelope foram definidos;
- baseline foi validada;
- contrato foi criado;
- catálogo foi criado;
- owners foram definidos;
- fontes dos budgets foram documentadas;
- create-order budget foi criado;
- get-order budget foi criado;
- journey budget foi criado;
- política de latência foi criada;
- p50, p95 e p99 foram medidos;
- average-only foi proibido;
- sample size foi validado;
- política de throughput foi criada;
- throughput foi medido com qualidade preservada;
- política de CPU foi criada;
- CPU por operação foi comparada;
- política de memória foi criada;
- heap e RSS foram comparados;
- política de alocação foi criada;
- allocation por operação foi medida;
- política de queries foi criada;
- query count, tempo e linhas foram medidos;
- N+1 foi bloqueado;
- política de payload foi criada;
- request, response e message size foram medidos;
- conteúdo sensível não foi persistido;
- política de dependências foi criada;
- calls, p95, retries e timeouts foram medidos;
- budget de latência foi composto;
- política de retries foi criada;
- política de jornada foi criada;
- jornada síncrona e assíncrona foi medida;
- política de regressão foi criada;
- limites absolutos e relativos foram avaliados;
- noise margin foi documentada;
- medições foram repetidas;
- baseline foi versionada;
- candidate report foi criado;
- comparação foi criada;
- enforce do budget foi criado;
- exit codes foram definidos;
- integração de pipeline foi documentada;
- política de exceção foi criada;
- exceções permanentes foram proibidas;
- exception report foi criado;
- política de versionamento foi criada;
- alteração de limite exige decisão;
- decision register foi criado;
- política de qualidade foi criada;
- baseline ausente bloqueia gate;
- política de segurança foi criada;
- failure policy foi criada;
- cenários foram catalogados;
- regressão de latência foi simulada;
- N+1 foi simulado;
- payload excessivo foi simulado;
- allocation excessiva foi simulada;
- matriz de testes foi criada;
- troubleshooting foi criado;
- exceções foram validadas;
- gate report foi criado;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret, payload, query sensível, host real ou valor de produção foi commitado;
- leitura de saturação não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance-budget `
  scripts/performance-budget `
  docs/performance-budget `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_id|payloadContent|productionHost|rawQuery|privateEndpoint|saturationDiagnostic"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): definir orcamentos de performance"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- payloads;
- queries com dados;
- hosts reais;
- credentials;
- outputs brutos;
- budgets reais de produção;
- artifacts temporários;
- diagnóstico de saturação;
- material da aula 578.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou expectativas de performance em contratos verificáveis.

Você trabalhou com:

```text
budgets absolutos;

budgets relativos;

latência;

throughput;

CPU;

memória;

alocação;

queries;

payloads;

dependências;

retries;

jornadas;

exceções;

gates.
```

Você comprovou que um budget precisa de fonte, owner, baseline e validade; p50, p95 e p99 respondem perguntas diferentes; limites absolutos e relativos precisam coexistir; throughput só é aprovado quando latência, erros e backlog permanecem saudáveis; CPU, memória e allocation precisam ser comparados em workload equivalente; query budget controla contagem, tempo e linhas; payload budget protege rede, serialização e memória; dependency budget reserva parcela da jornada; exceções precisam de prazo e plano; e o pipeline deve bloquear regressões com evidência válida.

A próxima aula será:

```text
578 - M18.23 - Leitura de saturacao
```

Nela, você irá interpretar sinais de recursos esgotados ou próximos do limite, como filas, pools, lag, CPU throttling, conexões, memória, latência não linear e ausência de headroom.

Nenhuma análise operacional aprofundada de saturação de CPU, memória, pools, filas, conexões, Kafka lag ou throttling foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contrato e catálogo.
- [ ] Defini budgets por endpoint.
- [ ] Medi latência e throughput.
- [ ] Medi CPU, memória e alocação.
- [ ] Medi queries e payloads.
- [ ] Medi dependências e jornada.
- [ ] Comparei regressões.
- [ ] Executei gate e exceções.

---

## Troubleshooting adicional

### O p99 muda muito

Aumente amostra, duração e repetições.

### A baseline está antiga

Colete novamente na release aprovada.

### O candidate parece melhor em ambiente menor

A comparação é inválida.

### O gate falha por 1%

Revise noise margin e consistência, não altere o budget automaticamente.

### O query count está alto

Investigue N+1, joins, lazy loading e fluxo repetido.

### O payload aumentou

Revise contrato, listas, campos redundantes e serialização.

### Allocation subiu sem latência

Avalie impacto em GC e capacidade.

### A exceção expirou

O gate precisa falhar até correção ou nova decisão formal.

### O throughput aumentou com erro maior

O resultado não está aprovado.

### A análise começou a interpretar filas e throttling

Preserve esse aprofundamento para a aula 578.

---

## Perguntas de revisão

1. O que é performance budget?
2. O que é budget absoluto?
3. O que é budget relativo?
4. O que é endpoint budget?
5. O que é journey budget?
6. Por que usar p95 e p99?
7. Por que controlar sample size?
8. O que é CPU budget?
9. O que é allocation budget?
10. O que é query budget?
11. O que é payload budget?
12. O que é dependency budget?
13. O que é retry budget?
14. O que é regression gate?
15. O que é noise margin?
16. Por que repetir medições?
17. Como controlar exceções?
18. Por que versionar budgets?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Limite mensurável.
2. Valor fixo.
3. Variação contra baseline.
4. Limite por endpoint.
5. Limite por jornada.
6. Observar tail latency.
7. Garantir estabilidade.
8. Limite de CPU.
9. Limite de alocação.
10. Limite de consultas e tempo.
11. Limite de tamanho.
12. Limite de chamadas e latência externa.
13. Limite de novas tentativas.
14. Bloqueio automatizado.
15. Margem de variação natural.
16. Reduzir ruído.
17. Prazo, owner, risco e plano.
18. Tornar decisões auditáveis.
19. Leitura de saturação.
20. Leitura de saturação.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 577 - M18.22 - Orcamento de performance

- Continuei após Capacity planning.
- Entendi performance budget como limite mensurável e testável.
- Diferenciei budget absoluto e relativo.
- Criei contrato e catálogo de budgets.
- Defini owner, fonte, validade e criticidade.
- Criei budgets para create, get, list, publish, consume e jornada.
- Criei política de latência.
- Medi p50, p95, p99, timeout e sample size.
- Criei política e medição de throughput.
- Criei budget de CPU por operação.
- Criei budget de heap, RSS e memória.
- Criei budget de allocation por operação.
- Criei budget de queries, tempo e linhas.
- Bloqueei N+1.
- Criei budget de payload sem persistir conteúdo.
- Criei budget de dependências, retries e timeouts.
- Compus budget total de latência.
- Criei budget de jornada síncrona e assíncrona.
- Criei política de regressão.
- Comparei limites absolutos e relativos.
- Apliquei noise margin com repetição.
- Versionei baseline e candidate reports.
- Criei enforce do budget e exit codes.
- Integrei gate no pipeline.
- Criei política de exceções temporárias.
- Criei versionamento e decision register.
- Criei políticas de qualidade, segurança e failure.
- Simulei regressão de latência, N+1, payload e allocation.
- Validei exceções.
- Coletei evidence sanitizada.
- Não antecipei leitura de saturação.
- Próxima aula: Leitura de saturação.
```

---

## Referência técnica curta

- Performance Budgets.
- Latency Percentiles.
- Throughput Budgets.
- CPU and Memory Budgets.
- Allocation Budgets.
- Query Budgets.
- Payload Budgets.
- Dependency Budgets.
- Regression Gates.
- Performance Baselines.

Regra final:

```text
orçamento de performance precisa transformar expectativas em limites versionados, mensuráveis e ligados a SLO, capacidade e arquitetura: cada operação e jornada possui owner, fonte, baseline, validade, budgets absolutos e relativos e dimensões críticas de latência, throughput, CPU, memória, allocation, queries, payloads, dependências, retries e erro; p50, p95 e p99 exigem amostra, warmup e repetição, comparações usam workload e ambiente equivalentes, e o gate falha quando o limite absoluto ou relativo é excedido, quando faltam dimensões críticas ou quando a evidência é inválida; exceções possuem prazo, risco, owner e plano, budgets não são afrouxados para fazer pipeline passar e artifacts mantêm apenas tamanhos, durações e contagens sanitizadas, deixando para a aula 578 a leitura operacional de saturação em CPU, memória, pools, filas, conexões, Kafka lag, throttling e latência não linear.
```
