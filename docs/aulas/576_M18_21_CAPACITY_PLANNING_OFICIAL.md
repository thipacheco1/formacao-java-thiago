# 576 - M18.21 - Capacity planning

## Apresentação da aula

Na aula 575, você utilizou o JDK Mission Control para transformar gravações JFR em análises de gargalos.

Você investigou:

```text
CPU;

hot methods;

call tree;

allocations;

locks;

thread parks;

threads;

File I/O;

Socket I/O;

garbage collection;

correlações;

comparações com baseline.
```

A análise permitiu responder:

```text
qual recurso
limita o fluxo atual?

qual comportamento
é esperado?

qual gargalo
é primário?

qual fator
é secundário?

qual hipótese
possui evidência?
```

Agora surge uma pergunta diferente:

```text
a capacidade atual
será suficiente

para a demanda
esperada,

incluindo picos,
crescimento,
falhas,
manutenção
e margem operacional?
```

Essa é a função do **capacity planning**.

Capacity planning é o processo de estimar demanda, medir capacidade sustentável, identificar limites e planejar recursos antes que a saturação se transforme em incidente.

Ele não consiste apenas em perguntar:

```text
quantos servidores
precisamos?
```

A análise precisa considerar:

- demanda atual;
- demanda de pico;
- crescimento;
- sazonalidade;
- throughput;
- latência;
- erros;
- utilização;
- saturação;
- concorrência;
- filas;
- memória;
- CPU;
- I/O;
- banco de dados;
- mensageria;
- dependências;
- réplicas;
- falhas;
- manutenção;
- headroom;
- custo;
- tempo de provisionamento;
- incerteza.

Um teste curto pode alcançar 500 req/s sem sustentar esse valor. Em janelas maiores surgem aquecimento, filas, throttling, pools, retries, GC, dependências e falhas. Capacity planning usa **capacidade sustentável**, não o maior número observado.

A pergunta central desta aula será:

```text
como transformar
demanda,
throughput,
latência,
utilização,
saturação
e crescimento

em um plano
de capacidade

com premissas,
cenários,
headroom,
limites
e decisões revisáveis?
```

Você construirá um modelo para `orders-api` e `orders-worker`, considerando HTTP, Kafka, CPU, memória, heap, threads, conexões, filas, latência, throughput, réplicas, N-1, crescimento e picos.

A aula utilizará fórmulas simples e verificáveis.

Exemplo de dimensionamento:

```text
réplicas necessárias
=
teto(
demanda projetada
/
capacidade sustentável por réplica
)
```

Mas essa fórmula ainda precisa considerar utilização alvo.

Forma ajustada:

```text
réplicas necessárias
=
teto(
demanda projetada
/
(
capacidade sustentável por réplica
×
utilização alvo
)
)
```

Se uma réplica sustenta:

```text
200 req/s
```

e a utilização alvo é:

```text
70%
```

a capacidade planejada por réplica é:

```text
140 req/s.
```

Para uma demanda projetada de:

```text
420 req/s
```

o cálculo é:

```text
420 / 140 = 3 réplicas.
```

Se a arquitetura precisa sobreviver à perda de uma réplica, o cenário N-1 exige:

```text
4 réplicas provisionadas.
```

Os números da aula serão didáticos.

Eles não representam recomendação de produção.

A aula não irá definir ainda limites obrigatórios por endpoint, operação, consulta, payload ou jornada.

Não serão construídos:

- orçamento máximo por requisição;
- budget de latência por endpoint;
- budget de CPU por operação;
- budget de memória por funcionalidade;
- limite de alocação por request;
- limite de queries por fluxo;
- limite de payload;
- limite de chamadas externas;
- gate de regressão por orçamento;
- contrato de performance por funcionalidade.

Esses assuntos pertencem à próxima aula oficial:

```text
577 - M18.22 - Orcamento de performance
```

A regra central será:

```text
capacidade planejada
não é o máximo observado;

é a demanda
que o sistema sustenta

com SLO preservado,
margem operacional,
falhas previstas
e premissas documentadas.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
574:
Profiling com JFR.

575:
JMC analise de gargalos.

576:
Capacity planning.

577:
Orcamento de performance.
```

A progressão é:

```text
capturar eventos;

identificar gargalos;

planejar capacidade;

definir limites de performance.
```

Nesta aula:

```text
demanda atual:
sim.

demanda projetada:
sim.

throughput sustentável:
sim.

utilização:
sim.

saturação:
sim.

concorrência:
sim.

Little's Law:
sim.

headroom:
sim.

N-1:
sim.

réplicas:
sim.

cenários:
sim.

forecast:
sim.

budget por endpoint:
não.

gate de performance por operação:
não.

orçamento de queries:
não.
```

Você reutilizará:

- métricas Prometheus;
- dashboards Grafana;
- resultados de carga;
- GC logs;
- heap dumps;
- thread dumps;
- JFR;
- análises do JMC;
- release metadata;
- filas Kafka;
- pool de conexões;
- métricas de banco;
- SLOs;
- runbooks.

Capacity planning exige dados, fontes e premissas auditáveis.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
capacity
├── capacity-planning-contract.yaml
├── capacity-demand-model.yaml
├── capacity-supply-model.yaml
├── capacity-service-profile.yaml
├── capacity-utilization-policy.yaml
├── capacity-headroom-policy.yaml
├── capacity-saturation-policy.yaml
├── capacity-concurrency-policy.yaml
├── capacity-scaling-policy.yaml
├── capacity-failure-policy.yaml
├── capacity-growth-policy.yaml
├── capacity-cost-policy.yaml
├── capacity-data-quality-policy.yaml
├── capacity-security-policy.yaml
├── capacity-planning-scenarios.yaml
├── capacity-decision-register.yaml
└── capacity-planning-evidence.yaml

capacity/reports
├── capacity-current-state.yaml
├── capacity-baseline-report.yaml
├── capacity-peak-report.yaml
├── capacity-growth-report.yaml
├── capacity-n-minus-one-report.yaml
├── capacity-maintenance-report.yaml
└── capacity-plan.yaml

scripts/capacity
├── validate-capacity-inputs.ps1
├── collect-capacity-baseline.ps1
├── calculate-sustainable-throughput.ps1
├── calculate-concurrency.ps1
├── calculate-utilization.ps1
├── calculate-capacity-headroom.ps1
├── calculate-required-replicas.ps1
├── simulate-capacity-scenarios.ps1
├── validate-capacity-saturation.ps1
├── validate-capacity-n-minus-one.ps1
├── compare-capacity-plans.ps1
├── validate-capacity-assumptions.ps1
├── scan-capacity-output.ps1
├── collect-capacity-evidence.ps1
└── verify-capacity-baseline.ps1

docs/capacity
├── CAPACITY_PLANNING_OVERVIEW.md
├── DEMAND_MODEL_GUIDE.md
├── SUSTAINABLE_CAPACITY_GUIDE.md
├── UTILIZATION_AND_SATURATION.md
├── CONCURRENCY_AND_LITTLES_LAW.md
├── HEADROOM_AND_FAILURE_SCENARIOS.md
├── SCALING_DECISION_GUIDE.md
├── CAPACITY_PLANNING_TEST_MATRIX.md
└── CAPACITY_PLANNING_TROUBLESHOOTING.md
```

Ao final, você terá modelos de demanda e oferta, capacidade sustentável, utilização, headroom, cenários de pico, N-1, manutenção e crescimento, plano de réplicas, decisões e evidence sanitizada.

Você irá validar entradas, medir a baseline, definir capacidade sustentável, modelar demanda e concorrência, calcular utilização e headroom, simular picos, crescimento, falha e manutenção, avaliar scaling, registrar decisões e executar o gate.

---

## Conceito essencial

### Capacity planning

Processo de prever demanda e garantir recursos suficientes para atendê-la com qualidade e margem operacional.

---

### Demand

Quantidade de trabalho solicitada ao sistema em uma janela.

---

### Supply

Capacidade disponível para processar o trabalho.

---

### Throughput

Quantidade de unidades processadas por tempo.

Exemplos:

```text
requests per second;

messages per second;

orders per minute.
```

---

### Sustainable throughput

Throughput mantido por uma janela representativa sem violar SLOs, acumular backlog ou exceder recursos.

---

### Peak demand

Maior demanda relevante observada ou projetada em uma janela definida.

---

### Average demand

Demanda média da janela.

A média não representa necessariamente o pico.

---

### Utilization

Proporção da capacidade usada.

```text
utilization
=
demand
/
available capacity.
```

---

### Saturation

Condição em que um recurso não consegue aceitar mais trabalho sem gerar espera, fila, erro ou degradação.

---

### Headroom

Capacidade ainda disponível antes do limite operacional planejado.

---

### Concurrency

Quantidade de operações simultaneamente em andamento.

---

### Little's Law

Relação aproximada entre concorrência, throughput e tempo no sistema:

```text
L = λ × W
```

onde:

```text
L:
concorrência média;

λ:
throughput médio;

W:
tempo médio no sistema.
```

---

### Service time

Tempo efetivamente gasto por um recurso para atender uma unidade de trabalho.

---

### Queue time

Tempo aguardando antes do processamento.

---

### Capacity envelope

Faixa de demanda em que o sistema preserva critérios operacionais definidos.

---

### Scaling unit

Unidade adicionada ou removida durante scaling.

Exemplo:

```text
uma réplica da aplicação.
```

---

### Horizontal scaling

Aumento de capacidade pela adição de instâncias.

---

### Vertical scaling

Aumento de CPU, memória ou recurso de uma instância.

---

### N-1

Cenário em que o sistema precisa atender a demanda após perder uma unidade de capacidade.

---

### Growth rate

Taxa de crescimento da demanda em um período.

---

### Forecast

Projeção de demanda futura baseada em dados e premissas.

---

### Lead time

Tempo necessário para provisionar, validar e disponibilizar nova capacidade.

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

- aplicação compila;
- testes passam;
- dashboards estão disponíveis;
- métricas possuem janela suficiente;
- cenários de carga são reproduzíveis;
- release está identificada;
- limites locais são conhecidos;
- nenhuma projeção antiga será tratada como atual;
- nenhum valor de produção será inventado;
- nenhum budget da aula 577 será antecipado.

---

### 2. Criar contrato de capacity planning

Arquivo:

```text
capacity-planning-contract.yaml
```

Conteúdo:

```yaml
capacityPlanning:
  service:
    required:
      - name
      - release
      - environment

  demand:
    required:
      - average
      - peak
      - unit
      - window
      - source

  supply:
    required:
      - replicas
      - capacity-per-replica
      - sustainable-capacity
      - limiting-resource

  quality:
    required:
      - latency
      - errors
      - backlog
      - availability

  scenarios:
    required:
      - current
      - peak
      - growth
      - n-minus-one
      - maintenance

  assumptions:
    documented:
      required

  decision:
    required:
      - target-capacity
      - headroom
      - scaling-action
      - review-date

  performanceBudget:
    deferredToLesson577
```

O contrato exige fonte para cada valor.

---

### 3. Criar perfil do serviço

Arquivo:

```text
capacity-service-profile.yaml
```

Conteúdo:

```yaml
service:
  name:
    orders-api

  release:
    laboratory

  responsibilities:
    - receive-order
    - validate-order
    - call-payment
    - publish-order-event

  dependencies:
    - payment-simulator
    - PostgreSQL
    - Kafka

  scalingUnit:
    one-application-replica

  state:
    externalized:
      true

  limitingCandidates:
    - cpu
    - heap
    - http-thread-pool
    - database-pool
    - kafka-producer
    - dependency-latency
```

Crie também um perfil para:

```text
orders-worker.
```

O worker possui unidade de demanda diferente:

```text
messages per second.
```

---

### 4. Definir unidade de trabalho

A demanda precisa usar unidade explícita.

Para a API:

```text
requisições por segundo.
```

Para o worker:

```text
mensagens por segundo.
```

Para uma jornada de negócio:

```text
pedidos concluídos por minuto.
```

Não misture unidades.

Exemplo inválido:

```text
API:
300 req/s.

worker:
12.000 mensagens por hora.
```

Converta para uma base comum quando comparar fluxos.

---

### 5. Criar modelo de demanda

Arquivo:

```text
capacity-demand-model.yaml
```

Conteúdo:

```yaml
demand:
  current:
    average:
      value:
        80

      unit:
        requests-per-second

    peak:
      value:
        160

      unit:
        requests-per-second

    window:
      15m

    source:
      laboratory-metrics

  growth:
    monthlyRate:
      0.08

    horizonMonths:
      6

  seasonality:
    factor:
      1.25

  uncertainty:
    factor:
      1.15

  productionValues:
    undefined
```

---

### 6. Evitar média como única entrada

Considere média, p95 da taxa, máximo, pico sustentado e instantâneo, janela, calendário, campanha, retries, replay e backlog.

Um pico de um segundo pode ser absorvido por fila.

Um pico de quinze minutos exige capacidade diferente.

---

### 7. Criar modelo de oferta

Arquivo:

```text
capacity-supply-model.yaml
```

Conteúdo:

```yaml
supply:
  ordersApi:
    replicas:
      current:
        2

    perReplica:
      sustainableThroughput:
        140

      unit:
        requests-per-second

      limitingResource:
        cpu

      criteria:
        latencyPreserved:
          true

        errorsPreserved:
          true

        backlogStable:
          true

        memoryStable:
          true
```

A capacidade por réplica vem de cenário reproduzível.

---

### 8. Definir capacidade sustentável

Uma execução é sustentável quando throughput e qualidade permanecem estáveis, filas e heap ficam bounded, recursos e dependências não saturam, não há full GC ou restart inesperado e o resultado se repete.

O throughput anterior ao crash não é sustentável.

---

### 9. Coletar baseline

Script:

```text
collect-capacity-baseline.ps1
```

Colete duração, volume, throughput, latências, erros, CPU, memória, GC, threads, pools, fila, lag, retries, dependências, réplicas e release.

Use pelo menos três execuções equivalentes.

---

### 10. Calcular throughput sustentável

Script:

```text
calculate-sustainable-throughput.ps1
```

Procedimento:

1. aqueça a aplicação;
2. inicie carga baixa;
3. aumente em degraus;
4. mantenha cada degrau;
5. colete métricas;
6. identifique primeiro critério violado;
7. retorne ao degrau anterior;
8. repita;
9. registre o limitante;
10. classifique a confiança.

Exemplo:

```text
100 req/s:
aprovado.

140 req/s:
aprovado.

160 req/s:
p95 cresce,
CPU 88%,
fila começa a crescer.

capacidade sustentável:
140 req/s por réplica.
```

---

### 11. Criar política de utilização

Arquivo:

```text
capacity-utilization-policy.yaml
```

Conteúdo:

```yaml
utilization:
  calculate:
    demandDividedBySustainableCapacity

  target:
    normal:
      0.70

    peak:
      0.80

  sustainedAboveTarget:
    action:
      review-capacity

  saturation:
    forbiddenAsNormalTarget:
      true

  productionValues:
    undefined
```

---

### 12. Calcular utilização

Script:

```text
calculate-utilization.ps1
```

Exemplo:

```text
demanda:
196 req/s.

capacidade:
2 réplicas × 140 req/s
=
280 req/s.

utilização:
196 / 280
=
70%.
```

Utilização precisa ser relacionada ao limitante; CPU em 70% não exclui outro recurso em 90%.

---

### 13. Criar política de saturação

Arquivo:

```text
capacity-saturation-policy.yaml
```

Conteúdo:

```yaml
saturation:
  indicators:
    - queue-growth
    - executor-active-equals-max
    - connection-pool-exhaustion
    - kafka-lag-growth
    - cpu-throttling
    - memory-limit-pressure
    - retry-amplification
    - timeout-growth
    - latency-nonlinear-growth

  sustained:
    requiredForClassification:
      true

  singleSpike:
    conclusion:
      insufficient
```

Saturação aparece por espera e falta de recurso.

---

### 14. Reconhecer a curva não linear

À medida que a utilização se aproxima do limite, a espera pode crescer de forma não linear.

Exemplo didático:

```text
utilização:
50%.

p95:
80 ms.
```

```text
utilização:
70%.

p95:
100 ms.
```

```text
utilização:
90%.

p95:
350 ms.
```

A capacidade planejada não deve usar o ponto em que a latência já explodiu.

---

### 15. Criar política de headroom

Arquivo:

```text
capacity-headroom-policy.yaml
```

Conteúdo:

```yaml
headroom:
  include:
    - traffic-variance
    - dependency-variance
    - deployment-overlap
    - instance-failure
    - maintenance
    - retry-bursts
    - forecast-uncertainty

  formula:
    plannedCapacityMinusProjectedDemand

  minimum:
    scenarioSpecific:
      true

  consumed:
    action:
      capacity-review

  productionValue:
    undefined
```

Headroom é margem operacional com finalidade explícita.

---

### 16. Calcular headroom

Script:

```text
calculate-capacity-headroom.ps1
```

Exemplo:

```text
capacidade planejada:
420 req/s.

demanda projetada:
300 req/s.

headroom absoluto:
120 req/s.

headroom relativo:
120 / 420
=
28,57%.
```

Registre ambos.

---

### 17. Usar Little's Law

Arquivo:

```text
capacity-concurrency-policy.yaml
```

Conteúdo:

```yaml
concurrency:
  formula:
    throughput-times-latency

  units:
    normalize:
      required

  use:
    - thread-pool-review
    - connection-pool-review
    - in-flight-request-estimate
    - queue-review

  tailLatency:
    useForRiskScenario:
      allowed

  exactPrediction:
    forbidden
```

Exemplo:

```text
throughput:
100 req/s.

tempo médio:
0,2 s.

concorrência média:
100 × 0,2
=
20 operações.
```

Se a latência sobe para:

```text
1 s
```

com o mesmo throughput:

```text
concorrência:
100.
```

A latência da dependência pode multiplicar a quantidade de operações em andamento.

---

### 18. Calcular concorrência

Script:

```text
calculate-concurrency.ps1
```

O script recebe:

- throughput;
- latência;
- unidade;
- cenário;
- operação.

Produz:

- concorrência média;
- concorrência de risco;
- pool atual;
- margem;
- resultado.

Não use p99 como média; reserve-o para cenário conservador.

---

### 19. Avaliar pool HTTP

Compare:

- concorrência estimada;
- threads disponíveis;
- threads ocupadas;
- queue;
- timeout;
- I/O bloqueante;
- CPU.

Pool maior não cria capacidade de CPU.

Ele pode aumentar concorrência e pressão.

---

### 20. Avaliar pool de banco

Compare:

- operações simultâneas;
- pool máximo;
- active;
- pending;
- tempo de query;
- transações;
- capacidade do banco;
- réplicas da aplicação.

Ao aumentar réplicas, conexões potenciais equivalem a réplicas vezes pool máximo. Quatro réplicas com pool 30 podem solicitar 120 conexões, que o banco precisa suportar.

---

### 21. Avaliar Kafka

Para o worker, observe ingress, processing rate, lag, partições, consumers, tempo por mensagem, retries, rebalance e downstream.

Uma réplica adicional só aumenta paralelismo quando:

- há partições disponíveis;
- o processamento é paralelizável;
- dependências suportam o aumento;
- ordenação não impede.

---

### 22. Criar política de scaling

Arquivo:

```text
capacity-scaling-policy.yaml
```

Conteúdo:

```yaml
scaling:
  horizontal:
    evaluate:
      - statelessness
      - load-distribution
      - database-connections
      - kafka-partitions
      - dependency-limits
      - startup-time

  vertical:
    evaluate:
      - cpu-limit
      - memory-limit
      - single-instance-efficiency
      - restart-impact

  scaleOut:
    defaultForStatelessApi:
      candidate

  scaleUp:
    requiresComparison:
      true

  scalingWithoutBottleneckReview:
    forbidden
```

---

### 23. Calcular réplicas necessárias

Script:

```text
calculate-required-replicas.ps1
```

Fórmula:

```text
replicas
=
ceil(
projected demand
/
(
sustainable capacity per replica
×
target utilization
)
)
```

Exemplo:

```text
demanda projetada:
350 req/s.

capacidade sustentável por réplica:
140 req/s.

utilização alvo:
70%.

capacidade planejada por réplica:
98 req/s.

réplicas:
ceil(350 / 98)
=
4.
```

---

### 24. Adicionar cenário N-1

Arquivo:

```text
capacity-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  scenarios:
    required:
      - one-replica-unavailable
      - rolling-deployment
      - dependency-degradation
      - delayed-scaling

  NMinusOne:
    preserve:
      - availability
      - latency
      - error-rate
      - backlog-control

  failureCapacity:
    calculate:
      required

  normalOperationAtFailureLimit:
    forbidden
```

Se quatro réplicas são necessárias em pico e o sistema precisa sobreviver à perda de uma, podem ser necessárias cinco provisionadas.

---

### 25. Validar N-1

Script:

```text
validate-capacity-n-minus-one.ps1
```

Calcule:

```text
capacidade com todas as réplicas;

capacidade após perda de uma;

demanda de pico;

utilização restante;

headroom restante;

SLO esperado.
```

Resultado:

```text
N_MINUS_ONE_APPROVED;

N_MINUS_ONE_BLOCKED;

N_MINUS_ONE_INCONCLUSIVE.
```

---

### 26. Avaliar rolling deployment

Durante rollout, considere réplica indisponível, overlap de versões, startup, warmup, cache frio, readiness, conexões e rebalance.

Capacity planning precisa incluir a janela de deploy.

Não conte toda a capacidade nominal durante manutenção.

---

### 27. Criar cenário de manutenção

Relatório:

```text
capacity-maintenance-report.yaml
```

Inclua:

- réplicas totais;
- réplicas disponíveis;
- startup time;
- warmup time;
- readiness;
- capacity during rollout;
- utilization;
- backlog;
- abort criterion.

---

### 28. Criar modelo de crescimento

Arquivo:

```text
capacity-growth-policy.yaml
```

Conteúdo:

```yaml
growth:
  sources:
    - historical-demand
    - product-plan
    - customer-growth
    - seasonality
    - campaign-plan

  horizons:
    - 1-month
    - 3-months
    - 6-months

  scenarios:
    - expected
    - high
    - low

  uncertainty:
    explicit:
      required

  linearAssumption:
    documented:
      required
```

Não use crescimento composto sem declarar a fórmula.

---

### 29. Projetar demanda

Exemplo composto:

```text
demanda futura
=
demanda atual
×
(1 + taxa)^meses.
```

Para:

```text
160 req/s;

8% ao mês;

6 meses.
```

Resultado aproximado:

```text
160 × 1,08^6
≈
254 req/s.
```

Aplique depois:

- sazonalidade;
- incerteza;
- pico;
- retries.

Não multiplique fatores sem explicar o significado de cada um.

---

### 30. Criar cenários de projeção

Relatório:

```text
capacity-growth-report.yaml
```

Cenários:

```yaml
growthScenarios:
  low:
    monthlyRate:
      0.04

  expected:
    monthlyRate:
      0.08

  high:
    monthlyRate:
      0.12
```

Para cada horizonte, calcule:

- demanda média;
- pico;
- demanda ajustada;
- réplicas;
- N-1;
- headroom;
- data de revisão.

---

### 31. Considerar sazonalidade

Sazonalidade pode vir de horário, calendário, campanha, fechamento, evento, lote ou reprocessamento.

Registre o fator e a fonte.

Não use:

```text
dobrar por segurança
```

sem justificar.

---

### 32. Considerar retry amplification

Uma dependência lenta pode gerar:

- timeout;
- retry;
- mais carga;
- mais concorrência;
- nova latência;
- mais retries.

Capacity planning precisa incluir o pior cenário permitido pela política de retry.

Exemplo:

```text
demanda original:
200 req/s.

10% falham.

cada falha recebe 2 retries.
```

Carga adicional aproximada:

```text
200 × 10% × 2
=
40 req/s.
```

Carga total:

```text
240 req/s.
```

---

### 33. Considerar backlog

Para o worker:

```text
backlog change
=
ingress rate
-
processing rate.
```

Se entram:

```text
500 msg/s
```

e o worker processa:

```text
450 msg/s,
```

o lag cresce:

```text
50 msg/s.
```

Em dez minutos:

```text
30.000 mensagens.
```

Planeje drenagem, recuperação, retenção, dependências e replay.

---

### 34. Calcular tempo de drenagem

Se o backlog é:

```text
30.000 mensagens
```

e a capacidade excedente após normalização é:

```text
100 msg/s,
```

tempo ideal de drenagem:

```text
30.000 / 100
=
300 s
=
5 minutos.
```

Na prática, inclua variação e dependências.

---

### 35. Criar política de custo

Arquivo:

```text
capacity-cost-policy.yaml
```

Conteúdo:

```yaml
cost:
  compare:
    - current-capacity
    - planned-capacity
    - failure-headroom
    - idle-cost
    - incident-risk
    - scaling-lead-time

  cheapestOption:
    automaticChoice:
      false

  overprovisioning:
    review:
      required

  underprovisioning:
    risk:
      required
```

Capacity planning equilibra custo e risco.

---

### 36. Considerar lead time

Lead times variam: réplica pode levar minutos; partição Kafka e banco exigem operação; mudanças arquiteturais podem levar semanas.

A data de ação precisa considerar o lead time.

Aja antes de atingir o limite.

---

### 37. Criar current state report

Arquivo:

```text
capacity-current-state.yaml
```

Conteúdo:

```yaml
currentState:
  demand:
    average:
      80

    peak:
      160

  replicas:
    2

  sustainableCapacityPerReplica:
    140

  totalSustainableCapacity:
    280

  peakUtilization:
    0.57

  limitingResource:
    cpu

  NMinusOne:
    capacity:
      140

    peakSupported:
      false

  conclusion:
    current-normal-approved-peak-failure-blocked
```

O cenário atual pode atender o pico com todas as réplicas e falhar em N-1.

---

### 38. Criar baseline report

Arquivo:

```text
capacity-baseline-report.yaml
```

Inclua:

- cenário;
- release;
- workload;
- duração;
- warmup;
- repetições;
- throughput sustentável;
- latência;
- erros;
- utilização;
- recursos;
- limitante;
- confiança;
- data.

---

### 39. Criar peak report

Arquivo:

```text
capacity-peak-report.yaml
```

Inclua:

- peak source;
- peak duration;
- adjusted peak;
- retry factor;
- seasonality factor;
- required capacity;
- target utilization;
- replicas;
- headroom;
- failure behavior.

---

### 40. Criar plano final

Arquivo:

```text
capacity-plan.yaml
```

Estrutura:

```yaml
plan:
  horizon:
    6-months

  demandScenario:
    expected

  projectedPeak:
    value:
      320

    unit:
      requests-per-second

  sustainableCapacityPerReplica:
    140

  targetUtilization:
    0.70

  requiredActiveReplicas:
    4

  provisionedReplicas:
    5

  resilience:
    NMinusOne:
      approved

  bottleneck:
    cpu

  dependentActions:
    - validate-database-connections
    - validate-payment-capacity
    - validate-kafka-partitions

  reviewDate:
    before-threshold-or-quarterly

  confidence:
    medium

  productionDecision:
    not-defined-in-laboratory
```

---

### 41. Registrar decisões

Arquivo:

```text
capacity-decision-register.yaml
```

Cada decisão possui ID, data, cenário, premissas, inputs, cálculo, risco, owner, revisão, trigger e status.

Exemplo:

```yaml
decisions:
  - id:
      CAP-576-001

    decision:
      model-five-replicas-for-n-minus-one

    status:
      laboratory-proposal

    reviewTrigger:
      peak-demand-changes-by-15-percent
```

---

### 42. Criar política de qualidade

Arquivo:

```text
capacity-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingDemandSource:
    action:
      block-plan

  mixedUnits:
    action:
      block-calculation

  shortLoadTest:
    result:
      low-confidence

  missingPeakWindow:
    result:
      limited

  missingDependencyCapacity:
    result:
      incomplete-plan

  staleMetrics:
    action:
      recollect

  singleRun:
    result:
      low-confidence

  inventedProductionValue:
    action:
      block-release
```

---

### 43. Criar política de segurança

Arquivo:

```text
capacity-security-policy.yaml
```

Conteúdo:

```yaml
security:
  reports:
    forbidden:
      - customer-name
      - contract-volume
      - internal-hostname
      - credential
      - private-endpoint
      - exact-production-cost-without-approval

  evidence:
    rawMetrics:
      forbidden

  sharing:
    external:
      forbiddenInLaboratory

  productionCapacity:
    classification:
      restricted
```

Dados de capacidade podem revelar arquitetura e escala.

---

### 44. Criar cenários

Arquivo:

```text
capacity-planning-scenarios.yaml
```

Cenários:

```text
current-average;

current-peak;

projected-growth-low;

projected-growth-expected;

projected-growth-high;

N-minus-one;

rolling-deployment;

dependency-degradation;

retry-amplification;

Kafka-backlog;

delayed-scaling;

stale-metrics;

missing-dependency-capacity.
```

Cada cenário registra input, unidade, janela, premissa, capacidade, utilização, saturação, headroom, réplicas, conclusão, confiança e ação.

---

### 45. Simular cenário atual

Script:

```text
simulate-capacity-scenarios.ps1
```

Valide:

```text
average:
approved.

peak:
approved with all replicas.

N-1 peak:
blocked.
```

A conclusão precisa mostrar por que o cenário falha.

---

### 46. Simular crescimento esperado

Aplique:

- taxa;
- horizonte;
- sazonalidade;
- incerteza;
- retry factor.

Calcule:

- projected average;
- projected peak;
- required replicas;
- N-1;
- headroom.

Registre cada fator separadamente.

---

### 47. Simular dependência degradada

Reduza a capacidade efetiva por:

- latência maior;
- timeout;
- menor throughput;
- concorrência maior;
- retries.

Recalcule:

```text
capacity per replica.
```

A aplicação pode perder capacidade por dependência lenta.

---

### 48. Simular delayed scaling

Considere:

- métrica detecta saturação;
- regra aguarda janela;
- orquestrador cria réplica;
- aplicação inicia;
- readiness;
- warmup;
- load balancer distribui.

Durante esse intervalo, backlog pode crescer.

Capacity planning precisa validar se a fila absorve o lead time.

---

### 49. Criar matriz de testes

Arquivo:

```text
CAPACITY_PLANNING_TEST_MATRIX.md
```

Cenários:

- input source;
- units;
- average;
- peak;
- sustainable throughput;
- utilization;
- saturation;
- headroom;
- concurrency;
- Little's Law;
- HTTP pool;
- database pool;
- Kafka partitions;
- consumer lag;
- scaling;
- replicas;
- N-1;
- rolling deployment;
- growth;
- seasonality;
- uncertainty;
- retries;
- backlog;
- drain time;
- cost;
- lead time;
- stale data;
- missing dependency;
- security scan;
- evidence sanitizada.

---

### 50. Criar troubleshooting

Arquivo:

```text
CAPACITY_PLANNING_TROUBLESHOOTING.md
```

Inclua:

- unidades misturadas;
- média usada como pico;
- teste curto;
- throughput máximo tratado como sustentável;
- dependência ignorada;
- pool de banco não recalculado;
- partições Kafka insuficientes;
- latência aumenta antes da CPU;
- fila cresce;
- N-1 falha;
- rollout reduz capacidade;
- percentuais multiplicados incorretamente;
- crescimento composto incorreto;
- retry factor duplicado;
- dados antigos;
- custo sem fonte;
- budget por endpoint antecipado.

---

### 51. Validar premissas

Script:

```text
validate-capacity-assumptions.ps1
```

Cada premissa registra descrição, fonte, owner, confiança, validade e impacto se estiver errada.

Exemplo:

```yaml
assumption:
  description:
    payment dependency supports projected concurrency

  confidence:
    low

  impactIfWrong:
    capacity-plan-overestimated
```

Premissa de baixa confiança exige ação de validação.

---

### 52. Comparar planos

Script:

```text
compare-capacity-plans.ps1
```

Compare planos por demanda, capacidade, utilização, réplicas, N-1, headroom, custo relativo, riscos e premissas.

Não substitua o histórico.

Versione a decisão.

---

### 53. Coletar evidence

Script:

```text
collect-capacity-evidence.ps1
```

Arquivo:

```text
capacity-planning-evidence.yaml.
```

A evidence pode conter aula, ambiente, serviço, release e status de demanda, oferta, throughput, utilização, saturação, concorrência, headroom, N-1, crescimento, scaling, dependências, decisões, segurança, testes e confiança.

Não inclua:

- dados reais de clientes;
- volume contratual;
- hosts;
- endpoints privados;
- custos reais não aprovados;
- métricas brutas;
- capacidade real de produção;
- budgets da aula 577.

---

### 54. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\capacity\validate-capacity-inputs.ps1

.\scripts\capacity\collect-capacity-baseline.ps1

.\scripts\capacity\calculate-sustainable-throughput.ps1

.\scripts\capacity\calculate-concurrency.ps1

.\scripts\capacity\calculate-utilization.ps1

.\scripts\capacity\calculate-capacity-headroom.ps1

.\scripts\capacity\calculate-required-replicas.ps1

.\scripts\capacity\simulate-capacity-scenarios.ps1

.\scripts\capacity\validate-capacity-saturation.ps1

.\scripts\capacity\validate-capacity-n-minus-one.ps1

.\scripts\capacity\validate-capacity-assumptions.ps1

.\scripts\capacity\compare-capacity-plans.ps1

.\scripts\capacity\scan-capacity-output.ps1

.\scripts\capacity\collect-capacity-evidence.ps1

.\scripts\capacity\verify-capacity-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- demanda aprovada;
- oferta aprovada;
- baseline repetida;
- capacidade sustentável calculada;
- utilização calculada;
- saturação validada;
- concorrência calculada;
- headroom calculado;
- réplicas calculadas;
- N-1 validado;
- rollout validado;
- crescimento simulado;
- dependências revisadas;
- premissas validadas;
- decisões registradas;
- segurança aprovada;
- evidence sanitizada;
- orçamento de performance não antecipado.

---

### 55. Encerrar o laboratório

Pare cenários e carga.

Remova somente artifacts temporários:

```powershell
Remove-Item `
  .tmp/capacity `
  -Recurse `
  -Force
```

Antes:

- colete evidence;
- preserve modelos;
- preserve relatórios;
- preserve scripts;
- preserve docs;
- confirme que métricas brutas não estão no Git.

Não execute limpeza global.

---

## Entendendo o que foi feito

### Demanda ganhou unidade

Requests, mensagens e pedidos deixaram de ser misturados.

### Capacidade ganhou sustentabilidade

O maior throughput observado deixou de ser tratado como limite operacional.

### Utilização ganhou contexto

A demanda passou a ser comparada à capacidade do recurso limitante.

### Saturação ganhou sinais

Fila, lag, pool, throttling e latência passaram a indicar falta de capacidade.

### Headroom ganhou finalidade

A margem passou a cobrir variabilidade, falhas, manutenção e incerteza.

### Concorrência ganhou cálculo

Throughput e latência passaram a orientar pools e operações em andamento.

### Scaling ganhou dependências

Réplicas passaram a ser relacionadas a banco, Kafka, startup e serviços externos.

### Falhas ganharam cenário

N-1 e rolling deployment passaram a fazer parte do cálculo.

### Crescimento ganhou premissas

Taxa, sazonalidade, retries e incerteza passaram a ser explícitos.

### Decisões ganharam revisão

Owners, triggers e datas impediram que o plano se tornasse documento estático.

### A próxima aula ganhou fronteira

O orçamento de performance definirá limites por operação, enquanto esta aula permaneceu no dimensionamento da capacidade do sistema.

---

## Erros comuns importantes

### Usar throughput máximo

Um pico curto não representa sustentabilidade.

### Planejar pela média

Picos sustentados e sazonalidade ficam invisíveis.

### Ignorar latência

A concorrência pode crescer sem aumento de throughput.

### Usar CPU como único limite

Banco, filas, pools e dependências podem saturar antes.

### Aumentar réplicas sem revisar banco

O total de conexões pode ultrapassar a capacidade do banco.

### Ignorar partições Kafka

Consumers adicionais podem ficar ociosos.

### Não calcular N-1

Uma falha simples derruba a capacidade abaixo do pico.

### Tratar headroom como desperdício

A margem sustenta operação e recuperação.

### Usar dados antigos

O plano não representa a release atual.

### Antecipar performance budget

Limites por endpoint e operação pertencem à aula 577.

---

## Comandos úteis

### Coletar baseline

```powershell
.\scripts\capacity\collect-capacity-baseline.ps1
```

### Calcular throughput sustentável

```powershell
.\scripts\capacity\calculate-sustainable-throughput.ps1
```

### Calcular utilização

```powershell
.\scripts\capacity\calculate-utilization.ps1
```

### Calcular réplicas

```powershell
.\scripts\capacity\calculate-required-replicas.ps1
```

### Validar N-1

```powershell
.\scripts\capacity\validate-capacity-n-minus-one.ps1
```

---

## Exercício guiado

### Parte 1 — Demand

Defina unidade, média, pico, janela e fonte.

### Parte 2 — Supply

Meça capacidade sustentável por réplica.

### Parte 3 — Utilization

Calcule uso e saturação.

### Parte 4 — Concurrency

Use throughput e latência.

### Parte 5 — Headroom

Inclua variabilidade e incerteza.

### Parte 6 — Scaling

Calcule réplicas e dependências.

### Parte 7 — Resilience

Valide N-1 e rollout.

### Parte 8 — Growth

Projete cenários baixo, esperado e alto.

### Parte 9 — Decision

Registre premissas e revisão.

### Parte 10 — Gate

Execute cenários, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 575 e ponte para a aula 577 foram preservadas;
- capacity planning, demand, supply, throughput, sustainable throughput, peak, average, utilization, saturation, headroom, concurrency, Little's Law, service time, queue time, capacity envelope, scaling unit, horizontal scaling, vertical scaling, N-1, growth rate, forecast e lead time foram definidos;
- baseline foi validada;
- contrato foi criado;
- fontes foram exigidas;
- modelo de demanda foi criado;
- modelo de oferta foi criado;
- capacidade sustentável foi definida;
- throughput sustentável foi calculado;
- política de utilização foi criada;
- política de saturação foi criada;
- política de headroom foi criada;
- política de scaling foi criada;
- política de falha foi criada;
- N-1 foi validado;
- política de crescimento foi criada;
- política de custo foi criada;
- política de qualidade foi criada;
- valores inventados bloqueiam o plano;
- política de segurança foi criada;
- cenários foram catalogados;
- matriz de testes foi criada;
- troubleshooting foi criado;
- nenhum Secret, dado pessoal, volume contratual ou capacidade real de produção foi commitado;
- orçamento de performance não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/capacity `
  scripts/capacity `
  docs/capacity `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|customer_name|contract_volume|internal_hostname|private_endpoint|production_capacity|performanceBudget"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar capacity planning"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- métricas brutas;
- dados de clientes;
- capacidade real de produção;
- hosts privados;
- custos reais não aprovados;
- credentials;
- artifacts temporários;
- budgets por operação;
- material da aula 577.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou demanda e telemetria em um plano de capacidade revisável.

Você trabalhou com:

```text
demand;

supply;

throughput sustentável;

utilização;

saturação;

headroom;

concorrência;

Little's Law;

scaling;

N-1;

rolling deployment;

crescimento;

sazonalidade;

retries;

backlog;

lead time;

decisões.
```

Você comprovou que capacidade não é o maior throughput observado; demanda precisa de unidade, janela e fonte; utilização precisa ser relacionada ao limitante; saturação aparece por filas, lag, pool e latência; headroom sustenta picos, falhas e manutenção; concorrência cresce com throughput e latência; novas réplicas afetam banco, Kafka e dependências; N-1 precisa ser calculado; crescimento exige premissas e cenários; backlog precisa de capacidade de drenagem; e planos precisam de owner, revisão e trigger de reavaliação.

A próxima aula será:

```text
577 - M18.22 - Orcamento de performance
```

Nela, você irá definir limites mensuráveis por operação e jornada, como latência, CPU, memória, alocações, queries, payloads e chamadas externas, criando gates para detectar regressões.

Nenhum budget por endpoint, operação, query, alocação, payload, chamada externa ou gate de regressão foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini demanda, unidade e fonte.
- [ ] Medi capacidade sustentável.
- [ ] Calculei utilização e saturação.
- [ ] Calculei concorrência e headroom.
- [ ] Calculei réplicas.
- [ ] Validei N-1 e rollout.
- [ ] Projetei crescimento.
- [ ] Registrei decisão e revisão.

---

## Troubleshooting adicional

### O throughput varia entre execuções

Padronize workload, warmup, release, duração e dependências.

### A CPU está baixa, mas a latência sobe

Investigue pool, fila, banco, lock, I/O e dependências.

### A nova réplica não aumenta throughput

Verifique gargalo compartilhado, partições e balanceamento.

### O banco esgota conexões após scale-out

Recalcule o total de pools por réplica.

### O lag Kafka cresce

Compare ingress, processing rate, partições, retries e downstream.

### O plano atende pico, mas falha em N-1

Adicione capacidade ou reduza o pico suportado com decisão explícita.

### O forecast muda muito

Use cenários e registre incerteza.

### O headroom parece excessivo

Revise falhas, lead time, variação e custo de incidente.

### Os dados são antigos

Colete novamente na release atual.

### O documento começou a definir budget por endpoint

Preserve essa etapa para a aula 577.

---

## Perguntas de revisão

1. O que é capacity planning?
2. O que é demand?
3. O que é supply?
4. O que é sustainable throughput?
5. O que é utilization?
6. O que é saturation?
7. O que é headroom?
8. O que é concurrency?
9. O que diz Little's Law?
10. O que é N-1?
11. Qual diferença entre scale-out e scale-up?
12. Por que calcular conexões do banco?
13. Como partições limitam consumers?
14. O que é backlog growth?
15. Como calcular drain time?
16. Por que usar cenários de crescimento?
17. O que é lead time?
18. Por que registrar premissas?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Planejamento de recursos.
2. Trabalho solicitado.
3. Capacidade disponível.
4. Throughput mantido com qualidade.
5. Proporção usada.
6. Falta de recurso e espera.
7. Margem operacional.
8. Operações simultâneas.
9. Concorrência igual a throughput vezes tempo.
10. Perda de uma unidade.
11. Mais instâncias versus instância maior.
12. Scale-out multiplica pools.
13. Consumers úteis não excedem paralelismo disponível.
14. Entrada maior que processamento.
15. Backlog dividido pela capacidade excedente.
16. Tratar incerteza.
17. Tempo para adicionar capacidade.
18. Tornar o cálculo auditável.
19. Orçamento de performance.
20. Orçamento de performance.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 576 - M18.21 - Capacity planning

- Continuei após JMC análise de gargalos.
- Entendi capacity planning como planejamento de demanda e capacidade sustentável.
- Diferenciei demand, supply, average e peak.
- Defini unidades para API, worker e jornada.
- Criei contrato e perfil dos serviços.
- Criei modelos de demanda e oferta.
- Diferenciei throughput máximo e sustentável.
- Coletei baseline com workload reproduzível.
- Calculei capacidade sustentável por réplica.
- Identifiquei o recurso limitante.
- Criei política e cálculo de utilização.
- Relacionei saturação a filas, lag, pools, throttling e latência.
- Criei política e cálculo de headroom.
- Apliquei Little's Law.
- Estimei concorrência média e de risco.
- Analisei pool HTTP e pool de banco.
- Calculei conexões totais após scale-out.
- Analisei ingress, processing rate, lag e partições Kafka.
- Comparei horizontal e vertical scaling.
- Calculei réplicas por demanda, capacidade e utilização alvo.
- Criei e validei cenário N-1.
- Considerei rolling deployment e manutenção.
- Criei projeções de crescimento low, expected e high.
- Considerei sazonalidade, incerteza e retry amplification.
- Calculei backlog e tempo de drenagem.
- Considerei custo, risco e lead time.
- Criei current state, baseline, peak, growth e capacity plan.
- Registrei decisões, owners e triggers de revisão.
- Criei políticas de qualidade, segurança e failure.
- Simulei cenário atual, crescimento, dependência degradada e delayed scaling.
- Validei premissas.
- Coletei evidence sanitizada.
- Não antecipei orçamento de performance.
- Próxima aula: Orçamento de performance.
```

---

## Referência técnica curta

- Capacity Planning.
- Sustainable Throughput.
- Resource Utilization.
- Saturation.
- Headroom.
- Little's Law.
- Horizontal Scaling.
- Vertical Scaling.
- N-1 Capacity.
- Demand Forecasting.

Regra final:

```text
capacity planning precisa combinar demanda observada, capacidade sustentável, qualidade, recursos e cenários: cada valor possui unidade, janela, fonte e premissa, throughput por réplica é medido em execuções equivalentes e deixa de ser aprovado quando latência, erros, backlog, memória, pools ou dependências degradam; utilização é calculada contra o limitante, saturação é reconhecida por espera e fila, headroom cobre variação, falha, rollout, retries e incerteza, e Little's Law relaciona throughput, latência e concorrência; réplicas são calculadas com utilização alvo e depois validadas em N-1, manutenção, dependências, banco, Kafka e lead time, enquanto crescimento, sazonalidade e backlog são tratados por cenários e decisões versionadas; dados sensíveis e valores reais de produção permanecem fora do Git, deixando para a aula 577 budgets mensuráveis por endpoint, operação, query, alocação, payload e chamada externa com gates de regressão.
```
