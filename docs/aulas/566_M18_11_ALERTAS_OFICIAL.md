# 566 - M18.11 - Alertas

## Apresentação da aula

Na aula 565, a `orders-api` e o `orders-worker` passaram a produzir traces distribuídos.

A plataforma de observabilidade do laboratório já possui:

```text
logs estruturados;

correlation ID;

trace ID;

Actuator;

Micrometer;

golden signals;

SLIs e SLOs didáticos;

Prometheus;

Grafana;

OpenTelemetry;

Collector;

Tempo;

tracing distribuído.
```

Esses componentes permitem observar e investigar o sistema.

Entretanto, depender de alguém olhando dashboards continuamente não é uma operação sustentável.

Um serviço pode degradar durante a madrugada, consumir rapidamente o error budget ou acumular backlog sem que ninguém esteja com o painel aberto.

Alertas existem para transformar uma condição observável em uma solicitação de atenção.

Pergunta central:

```text
como detectar
uma condição relevante,

notificar a pessoa certa

e fornecer contexto suficiente
para uma primeira decisão

sem gerar ruído,
duplicação
ou fadiga?
```

Um alerta útil precisa informar condição, serviço, ambiente, impacto, duração, severidade, owner, ação inicial e referência de investigação.

Exemplo ruim:

```text
CPU > 80%.
```

Esse alerta não informa duração, impacto, tráfego, owner ou ação e pode reagir a picos normais.

Exemplo melhor:

```text
orders-api:
fila interna acima de 90%
da capacidade por 10 minutos,

com throughput inferior
ao tráfego de entrada.
```

Esse alerta combina:

```text
saturação;

duração;

capacidade;

tráfego;

throughput;

serviço;

ambiente.
```

Você trabalhará com rules do Prometheus, lifecycle, duração, labels, annotations, severidade, Alertmanager, roteamento, grouping, inhibition, silences, missing data, burn rate, testes e evidence.

O laboratório usará apenas destinos locais e fictícios, sem canais, webhooks ou credenciais reais.

A aula não escreverá runbooks completos.

Os alertas terão uma referência estável para runbook, mas o conteúdo operacional detalhado será criado na próxima aula oficial:

```text
567 - M18.12 - Runbooks
```

Regra central:

```text
alertar somente
quando existe

condição relevante,
duração suficiente,
owner conhecido
e ação possível.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
564:
OpenTelemetry.

565:
Tracing distribuido.

566:
Alertas.

567:
Runbooks.
```

Progressão:

```text
telemetria;

consulta;

visualização;

detecção;

notificação;

resposta orientada.
```

Nesta aula:

```text
Prometheus alerting rules:
sim.

Alertmanager:
sim.

severidade:
sim.

duração:
sim.

roteamento:
sim.

agrupamento:
sim.

deduplicação:
sim.

inhibition:
sim.

silence:
sim.

contact point local:
sim.

burn rate didático:
sim.

runbook completo:
não.

procedimento operacional detalhado:
não.
```

A aula usará como fonte:

- métricas Micrometer;
- séries Prometheus;
- golden signals;
- contratos SLI e SLO;
- contexto de release;
- estado dos targets;
- saturação;
- traces e logs para investigação posterior.

Um alerta não será criado diretamente a partir de cada métrica disponível.

A seleção começa pelo impacto e pela ação.

---

## Objetivo prático

O laboratório permanece em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
observability/alerts
├── prometheus-alert-rules.yml
├── prometheus-recording-rules.yml
├── alertmanager.yml
├── alerting-compose.yml
├── alert-contract.yaml
├── alert-catalog.yaml
├── alert-severity-policy.yaml
├── alert-routing-policy.yaml
├── alert-grouping-policy.yaml
├── alert-inhibition-policy.yaml
├── alert-silence-policy.yaml
├── alert-missing-data-policy.yaml
├── alert-burn-rate-policy.yaml
├── alert-maintenance-policy.yaml
├── alert-data-quality-policy.yaml
├── alert-failure-policy.yaml
├── alert-scenarios.yaml
└── alert-evidence.yaml

observability/grafana/provisioning
└── alerting
    ├── contact-points.yml
    ├── notification-policies.yml
    └── mute-timings.yml

scripts/observability/alerts
├── validate-alert-rule-files.ps1
├── validate-alert-contract.ps1
├── validate-alert-labels.ps1
├── validate-alert-annotations.ps1
├── validate-alert-routing.ps1
├── validate-alert-inhibition.ps1
├── start-alerting-lab.ps1
├── simulate-target-down-alert.ps1
├── simulate-error-rate-alert.ps1
├── simulate-latency-alert.ps1
├── simulate-saturation-alert.ps1
├── simulate-burn-rate-alert.ps1
├── validate-alert-lifecycle.ps1
├── validate-alertmanager-notifications.ps1
├── scan-alert-output.ps1
├── collect-alert-evidence.ps1
└── verify-alert-baseline.ps1

docs/observability/alerts
├── ALERTING_OVERVIEW.md
├── ALERT_DESIGN_GUIDE.md
├── ALERT_SEVERITY_AND_ROUTING.md
├── ALERTMANAGER_GUIDE.md
├── ALERT_TEST_MATRIX.md
└── ALERT_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, rules versionadas, Alertmanager local, roteamento, grouping, inhibition, silences, testes, simulações e evidence sanitizada.

Você irá definir contratos, criar rules, configurar Alertmanager, validar lifecycle, routing, grouping, inhibition, silences, burn rate, notificações, segurança e evidence.

---

## Conceito essencial

### Alert rule

Regra que avalia uma expressão e produz um alerta quando a condição é atendida.

---

### Recording rule

Regra que salva o resultado de uma consulta como uma nova série.

---

### Inactive

Estado em que a expressão do alerta não é verdadeira.

---

### Pending

Estado em que a condição é verdadeira, mas ainda não completou o período definido em `for`.

---

### Firing

Estado em que a condição permanece verdadeira pelo período exigido e o alerta está ativo.

---

### `for`

Duração mínima pela qual a condição precisa permanecer verdadeira antes de disparar.

---

### `keep_firing_for`

Período opcional em que o alerta continua firing após a condição deixar de ser verdadeira.

---

### Label

Dimensão usada para identidade, roteamento, agrupamento e severidade.

---

### Annotation

Texto contextual que não participa da identidade do alerta.

---

### Alertmanager

Componente que recebe alertas, agrupa, deduplica, roteia, inibe e envia notificações.

---

### Receiver

Destino lógico de uma notificação.

---

### Route

Árvore que decide para qual receiver cada alerta será enviado.

---

### Grouping

Agrupamento de alertas relacionados em uma mesma notificação.

---

### Deduplication

Evita notificações repetidas para o mesmo conjunto de alertas ativos.

---

### Inhibition

Suprime alertas menos importantes quando outro alerta relacionado já está firing.

---

### Silence

Supressão temporária baseada em matchers e duração explícita.

---

### Contact point

Destino usado por uma plataforma de alertas para entregar a notificação.

---

### Alert fatigue

Perda de confiança causada por alertas excessivos, repetitivos ou não acionáveis.

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

Suba o ambiente de observabilidade:

```powershell
docker compose `
  --file `
  observability/tracing/distributed-tracing-compose.yml `
  up `
  --detach
```

Confirme:

- `orders-api` disponível;
- `orders-worker` disponível;
- Prometheus ativo;
- target `orders-api` `UP`;
- target `orders-worker` `UP`;
- Grafana ativo;
- Tempo ativo;
- Collector ativo;
- logs e traces disponíveis;
- regras de alerta ainda não carregadas;
- nenhum canal real configurado.

Registre a baseline normal.

---

### 2. Definir o contrato de alerta

Arquivo:

```text
alert-contract.yaml
```

Conteúdo:

```yaml
alert:
  name:
    stable:
      required

  expression:
    required

  duration:
    required

  owner:
    required

  severity:
    required

  service:
    required

  environment:
    required

  summary:
    required

  description:
    required

  action:
    required

  runbookRef:
    required

  dashboardRef:
    recommended

  generator:
    Prometheus

  personallyIdentifiableData:
    forbidden

  realNotificationDestination:
    forbiddenInLaboratory
```

O `runbookRef` será uma referência estável, por exemplo:

```text
runbook:orders-api/high-error-rate.
```

O procedimento ficará para a aula 567.

---

### 3. Começar pelo impacto

Antes de escrever PromQL, responda:

```text
quem é afetado?

qual comportamento
deixou de ser aceitável?

qual ação
é possível agora?
```

Um alerta precisa existir por causa de uma condição operacional.

Não por causa de uma métrica disponível.

Condições acionáveis incluem target indisponível, erro técnico sustentado, latência com tráfego, saturação e consumo rápido do budget. Picos curtos ou uma falha isolada normalmente não bastam.

---

### 4. Criar política de severidade

Arquivo:

```text
alert-severity-policy.yaml
```

Conteúdo:

```yaml
severity:
  critical:
    meaning:
      immediate-user-impact-or-imminent-exhaustion

    response:
      immediate

  warning:
    meaning:
      sustained-degradation-or-reduced-headroom

    response:
      planned-or-rapid-investigation

  info:
    meaning:
      operational-awareness

    notification:
      non-paging

  forbidden:
    - urgent
    - high
    - medium
    - low

  customSeverity:
    forbiddenWithoutGovernance
```

Use vocabulário pequeno.

`critical` não significa apenas um valor alto.

Ele representa impacto ou risco imediato.

---

### 5. Criar catálogo de alertas

Arquivo:

```text
alert-catalog.yaml
```

Alertas do laboratório:

```yaml
alerts:
  - name:
      OrdersApiTargetDown

    severity:
      critical

    owner:
      platform

    signal:
      availability

  - name:
      OrdersApiHighTechnicalErrorRate

    severity:
      critical

    owner:
      orders-team

    signal:
      errors

  - name:
      OrdersApiHighLatency

    severity:
      warning

    owner:
      orders-team

    signal:
      latency

  - name:
      OrdersInternalQueueNearCapacity

    severity:
      warning

    owner:
      orders-team

    signal:
      saturation

  - name:
      OrdersErrorBudgetFastBurn

    severity:
      critical

    owner:
      orders-team

    signal:
      reliability

  - name:
      OrdersWorkerBacklogGrowing

    severity:
      warning

    owner:
      orders-team

    signal:
      traffic-and-saturation
```

Cada alerta precisa de uma pergunta e uma ação inicial.

---

### 6. Criar recording rules

Arquivo:

```text
prometheus-recording-rules.yml
```

Exemplo:

```yaml
groups:
  - name: orders-recording-rules
    interval: 30s
    rules:
      - record: orders:http_requests:rate5m
        expr: |
          sum by (service, environment) (
            rate(
              http_server_requests_seconds_count{
                uri!~"/actuator.*"
              }[5m]
            )
          )

      - record: orders:technical_errors:ratio5m
        expr: |
          sum by (service, environment) (
            rate(
              orders_creation_seconds_count{
                outcome=~"failure|timeout"
              }[5m]
            )
          )
          /
          clamp_min(
            sum by (service, environment) (
              rate(
                orders_creation_seconds_count[5m]
              )
            ),
            0.000001
          )

      - record: orders:latency:p95_5m
        expr: |
          histogram_quantile(
            0.95,
            sum by (le, service, environment) (
              rate(
                orders_creation_seconds_bucket{
                  outcome="success"
                }[5m]
              )
            )
          )
```

Recording rules reduzem repetição e padronizam consultas.

Elas também criam novas séries e precisam de ownership e budget.

---

### 7. Criar alerta de target indisponível

Arquivo:

```text
prometheus-alert-rules.yml
```

Exemplo:

```yaml
groups:
  - name: orders-availability-alerts
    interval: 30s
    rules:
      - alert: OrdersApiTargetDown
        expr: |
          max by (job, environment) (
            up{
              job="orders-api"
            }
          ) == 0
        for: 2m
        keep_firing_for: 1m
        labels:
          severity: critical
          service: orders-api
          team: platform
          signal: availability
        annotations:
          summary: Orders API target is down
          description: Prometheus cannot scrape orders-api for more than two minutes.
          action: Validate process, network, Actuator endpoint and recent deployment.
          runbook_ref: runbook:orders-api/target-down
          dashboard_ref: dashboard:orders-operational-overview
```

O alerta verifica a coleta.

Ele não substitui um alerta de experiência do usuário.

---

### 8. Criar alerta de taxa de erro

Exemplo:

```yaml
- alert: OrdersApiHighTechnicalErrorRate
  expr: |
    orders:technical_errors:ratio5m
    > 0.05
  for: 10m
  labels:
    severity: critical
    service: orders-api
    team: orders-team
    signal: errors
  annotations:
    summary: Orders API technical error rate is elevated
    description: Technical failures and timeouts exceed the laboratory threshold for ten minutes.
    action: Compare release, traffic, dependencies, traces and structured logs.
    runbook_ref: runbook:orders-api/high-technical-error-rate
    dashboard_ref: dashboard:orders-golden-signals
```

O valor é didático.

Não representa SLO de produção.

---

### 9. Garantir tráfego mínimo

Uma taxa pode ser enganosa com pouco volume.

Exemplo:

```text
uma operação;

uma falha;

taxa:
100%.
```

Adicione condição de volume:

```promql
orders:technical_errors:ratio5m > 0.05
and
orders:http_requests:rate5m > 0.1
```

A condição exata depende do contrato.

O alerta precisa distinguir:

- taxa alta com volume significativo;
- taxa alta com amostra insuficiente;
- ausência de tráfego;
- ausência de série.

---

### 10. Criar alerta de latência

Exemplo:

```yaml
- alert: OrdersApiHighLatency
  expr: |
    orders:latency:p95_5m
    > 0.5
    and
    orders:http_requests:rate5m
    > 0.1
  for: 15m
  labels:
    severity: warning
    service: orders-api
    team: orders-team
    signal: latency
  annotations:
    summary: Orders API p95 latency is elevated
    description: Successful order creation p95 exceeds the laboratory threshold with sufficient traffic.
    action: Inspect saturation, dependencies, critical traces and release annotations.
    runbook_ref: runbook:orders-api/high-latency
    dashboard_ref: dashboard:orders-golden-signals
```

A duração evita picos breves.

---

### 11. Criar alerta de saturação

Exemplo:

```yaml
- alert: OrdersInternalQueueNearCapacity
  expr: |
    (
      orders_internal_queue_size
      /
      clamp_min(
        orders_internal_queue_capacity,
        1
      )
    ) > 0.90
  for: 10m
  labels:
    severity: warning
    service: orders-worker
    team: orders-team
    signal: saturation
  annotations:
    summary: Orders internal queue is near capacity
    description: Queue utilization remains above ninety percent.
    action: Compare input rate, throughput, active tasks and dependency latency.
    runbook_ref: runbook:orders-worker/queue-near-capacity
    dashboard_ref: dashboard:orders-golden-signals
```

Saturação exige capacidade conhecida.

---

### 12. Modelar burn rate

Arquivo:

```text
alert-burn-rate-policy.yaml
```

Conteúdo:

```yaml
burnRate:
  slo:
    laboratory:
      99.5

  budgetFraction:
    0.005

  windows:
    fast:
      long:
        1h

      short:
        5m

    slow:
      long:
        6h

      short:
        30m

  officialProductionPolicy:
    undefined
```

O laboratório utilizará multi-window burn rate de forma didática.

A política de produção exigiria validação com o SLO oficial.

---

### 13. Criar alerta de fast burn

Forma conceitual:

```text
error ratio
/
error budget fraction.
```

Se o SLO didático é 99,5%:

```text
budget fraction:
0,005.
```

Recording rule:

```yaml
- record: orders:error_budget:burn_rate5m
  expr: |
    orders:technical_errors:ratio5m
    / 0.005
```

Alerta:

```yaml
- alert: OrdersErrorBudgetFastBurn
  expr: |
    orders:error_budget:burn_rate1h > 14
    and
    orders:error_budget:burn_rate5m > 14
  for: 2m
  labels:
    severity: critical
    service: orders-api
    team: orders-team
    signal: reliability
  annotations:
    summary: Orders API error budget is burning rapidly
    description: Long and short windows indicate sustained fast consumption of the laboratory error budget.
    action: Validate user impact, recent release, dependencies and rollback criteria.
    runbook_ref: runbook:orders-api/error-budget-fast-burn
    dashboard_ref: dashboard:orders-reliability
```

Os multiplicadores e janelas são didáticos.

---

### 14. Entender `for`

Sem `for`, uma condição verdadeira em uma avaliação pode disparar imediatamente.

Use `for` quando:

- picos curtos são esperados;
- a condição precisa ser sustentada;
- a ação só faz sentido após confirmação;
- o dado possui ruído.

Não use `for` para esconder um threshold ruim.

Alertas de falha absoluta podem usar duração menor.

Alertas de tendência podem exigir duração maior.

---

### 15. Entender `keep_firing_for`

`keep_firing_for` pode reduzir flapping quando a expressão oscila.

Use com cuidado.

Um valor excessivo mantém alertas ativos depois da recuperação.

Registre:

- motivo;
- duração;
- comportamento esperado;
- impacto na resolução.

Não configure globalmente sem necessidade.

---

### 16. Definir labels

Labels recomendadas:

```text
alertname;

severity;

service;

team;

environment;

signal.
```

Labels proibidas:

- trace ID;
- correlation ID;
- order ID;
- customer ID;
- message ID;
- URL bruta;
- exception message;
- timestamp;
- texto livre.

Labels participam da identidade do alerta.

Um valor dinâmico cria alertas diferentes e prejudica deduplicação.

---

### 17. Definir annotations

Annotations recomendadas:

```text
summary;

description;

action;

runbook_ref;

dashboard_ref.
```

Annotations podem incluir valores renderizados limitados.

Evite:

- payload;
- query completa;
- stack trace;
- token;
- email;
- identificador de usuário;
- dezenas de labels.

A notificação precisa ser curta e útil.

---

### 18. Configurar o Prometheus para regras

Atualize `prometheus.yml`:

```yaml
rule_files:
  - /etc/prometheus/rules/prometheus-recording-rules.yml
  - /etc/prometheus/rules/prometheus-alert-rules.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093
```

Monte os arquivos como read-only no Compose.

Valide antes de reiniciar.

---

### 19. Validar regras com `promtool`

Execute:

```powershell
docker run `
  --rm `
  --volume `
  "${PWD}/observability/alerts/prometheus-alert-rules.yml:/rules/alerts.yml:ro" `
  prom/prometheus:v3.5.0 `
  promtool `
  check rules `
  /rules/alerts.yml
```

Valide também recording rules.

O gate falha em:

- YAML inválido;
- PromQL inválida;
- label ausente;
- annotation ausente;
- nome duplicado;
- severity desconhecida;
- runbook ref ausente.

---

### 20. Configurar Alertmanager

Arquivo:

```text
alertmanager.yml
```

Conteúdo:

```yaml
global:
  resolve_timeout: 5m

route:
  receiver: local-default
  group_by:
    - alertname
    - service
    - environment
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - receiver: local-critical
      matchers:
        - severity="critical"
      continue: false

    - receiver: local-warning
      matchers:
        - severity="warning"
      continue: false

receivers:
  - name: local-default
    webhook_configs:
      - url: http://notification-sink:8085/alerts
        send_resolved: true

  - name: local-critical
    webhook_configs:
      - url: http://notification-sink:8085/critical
        send_resolved: true

  - name: local-warning
    webhook_configs:
      - url: http://notification-sink:8085/warning
        send_resolved: true
```

O receiver é local e fictício.

---

### 21. Criar notification sink local

No Compose, adicione um serviço simples de captura HTTP.

Ele deve:

- receber POST;
- registrar apenas resumo sanitizado;
- não encaminhar;
- não persistir indefinidamente;
- não exigir credential real;
- permitir contar notificações;
- permitir validar firing e resolved.

Nome:

```text
notification-sink.
```

Porta interna:

```text
8085.
```

Não exponha publicamente sem necessidade.

---

### 22. Criar política de roteamento

Arquivo:

```text
alert-routing-policy.yaml
```

Conteúdo:

```yaml
routing:
  critical:
    receiver:
      local-critical

    repeat:
      4h

  warning:
    receiver:
      local-warning

    repeat:
      8h

  info:
    receiver:
      local-default

    paging:
      false

  ownership:
    label:
      team

  unknownTeam:
    action:
      route-to-default-and-block-release
```

Nos testes, os repeat intervals podem ser reduzidos.

O arquivo mantém os valores normais.

---

### 23. Definir agrupamento

Arquivo:

```text
alert-grouping-policy.yaml
```

Conteúdo:

```yaml
grouping:
  labels:
    - alertname
    - service
    - environment

  groupWait:
    30s

  groupInterval:
    5m

  repeatInterval:
    4h

  forbiddenGroupLabels:
    - instance
    - pod
    - trace_id
    - correlation_id
```

Agrupar por `instance` pode gerar uma notificação por réplica.

Em alguns alertas isso é necessário.

Para impacto de serviço, agrupe em nível de serviço.

---

### 24. Configurar inhibition

Arquivo:

```text
alert-inhibition-policy.yaml
```

Exemplo:

```yaml
inhibition:
  rules:
    - source:
        alertname:
          OrdersApiTargetDown

        severity:
          critical

      target:
        service:
          orders-api

        severity:
          warning

      equal:
        - service
        - environment
```

No `alertmanager.yml`:

```yaml
inhibit_rules:
  - source_matchers:
      - alertname="OrdersApiTargetDown"
      - severity="critical"
    target_matchers:
      - service="orders-api"
      - severity="warning"
    equal:
      - service
      - environment
```

Se o target está down, alertas derivados de latência podem ser sem sentido.

---

### 25. Entender silences

Silence é temporário e possui:

- matchers;
- início;
- fim;
- creator;
- comment;
- motivo.

Use para:

- manutenção aprovada;
- teste controlado;
- incidente conhecido;
- migração.

Não use para esconder alerta ruim.

Um alerta ruidoso precisa ser corrigido.

---

### 26. Criar política de silences

Arquivo:

```text
alert-silence-policy.yaml
```

Conteúdo:

```yaml
silence:
  requires:
    - matcher
    - start
    - end
    - owner
    - reason
    - changeReference

  maximumLaboratoryDuration:
    2h

  indefinite:
    forbidden

  broadMatchers:
    forbidden

  postExpirationReview:
    required
```

Nenhum silence permanente será versionado.

---

### 27. Tratar manutenção

Arquivo:

```text
alert-maintenance-policy.yaml
```

Durante um deploy planejado:

- target pode reiniciar;
- readiness pode mudar;
- tráfego pode cair;
- série pode reiniciar;
- alertas podem ficar pending.

A estratégia pode combinar:

- janela de manutenção;
- silence específico;
- annotation de deploy;
- thresholds adequados;
- `for`;
- health de rollout.

Não desabilite todas as regras.

---

### 28. Tratar missing data

Arquivo:

```text
alert-missing-data-policy.yaml
```

Conteúdo:

```yaml
missingData:
  targetSeries:
    alert:
      required

  businessMetric:
    whenTrafficExpected:
      investigate

  zeroTraffic:
    distinguishFromMissing:
      required

  staleSeries:
    result:
      unknown

  absentFunction:
    allowed:
      true

  defaultHealthy:
    forbidden
```

Ausência não é sucesso.

Crie um alerta separado quando a falta da série é relevante.

---

### 29. Criar política de data quality

Arquivo:

```text
alert-data-quality-policy.yaml
```

Regras:

```yaml
quality:
  insufficientSamples:
    action:
      suppress-or-mark-low-confidence

  counterReset:
    query:
      rate-aware

  labelDrift:
    action:
      block-rule-approval

  duplicateSeries:
    action:
      investigate

  targetDown:
    dependentAlerts:
      inhibit

  datasourceUnavailable:
    result:
      alerting-degraded
```

A qualidade da telemetria faz parte do sistema de alertas.

---

### 30. Provisionar contact points no Grafana

Arquivo:

```text
contact-points.yml
```

Conteúdo conceitual:

```yaml
apiVersion: 1

contactPoints:
  - orgId: 1
    name: local-alert-sink
    receivers:
      - uid: local-alert-sink
        type: webhook
        settings:
          url: http://notification-sink:8085/grafana
        disableResolveMessage: false
```

O laboratório pode validar Grafana Alerting sem duplicar as regras principais.

A fonte oficial de regras desta aula será Prometheus.

Grafana não deve avaliar a mesma regra em paralelo sem motivo.

---

### 31. Evitar dupla avaliação

Problema:

```text
Prometheus avalia regra;

Grafana avalia regra igual;

dois alertas;

duas notificações.
```

Política:

```text
Prometheus:
owner das regras baseadas em PromQL.

Grafana:
visualização
e contact point de laboratório
somente quando explicitamente usado.
```

Não duplique o catálogo.

---

### 32. Criar failure policy

Arquivo:

```text
alert-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidRule:
    action:
      block-start

  missingOwner:
    action:
      block-release

  missingRunbookRef:
    action:
      block-release

  unknownSeverity:
    action:
      block-release

  AlertmanagerUnavailable:
    alertEvaluation:
      continue

    notification:
      degraded

  notificationSinkUnavailable:
    alertState:
      preserved

    delivery:
      degraded

  duplicateEvaluation:
    action:
      block-release

  sensitiveData:
    action:
      block-release
```

Avaliação e entrega são camadas diferentes.

---

### 33. Criar cenários

Arquivo:

```text
alert-scenarios.yaml
```

Cenários:

```text
target down;

target recovers;

technical error rate high;

traffic too low;

latency high;

queue saturation;

fast burn;

maintenance silence;

inhibition;

Alertmanager unavailable;

notification sink unavailable;

missing series;

flapping condition.
```

Cada cenário registra setup, expressão, lifecycle, labels, receiver, notificação, resolução, cleanup e evidence.

---

### 34. Simular target down

Script:

```text
simulate-target-down-alert.ps1
```

Fluxo:

1. confirmar alerta inactive;
2. parar `orders-api`;
3. observar `up = 0`;
4. observar estado pending;
5. aguardar `for`;
6. observar firing;
7. validar receiver;
8. iniciar aplicação;
9. observar resolved;
10. validar `send_resolved`.

Não altere a regra para disparar instantaneamente no arquivo oficial.

O script pode usar uma configuração de teste separada.

---

### 35. Simular taxa de erro

Script:

```text
simulate-error-rate-alert.ps1
```

Gere tráfego fictício suficiente.

Inclua:

- sucessos;
- timeouts controlados;
- falhas técnicas;
- rejeições de negócio.

Valide:

- rejeições não entram quando o contrato não permite;
- volume mínimo foi atingido;
- estado percorreu pending e firing;
- annotation contém ação;
- receiver correto;
- resolução ocorre após recuperação.

---

### 36. Simular latência

Script:

```text
simulate-latency-alert.ps1
```

Use atraso controlado.

Valide:

- p95;
- tráfego mínimo;
- duração;
- warning;
- agrupamento;
- dashboard reference;
- resolved.

Uma única requisição lenta não deve disparar.

---

### 37. Simular saturação

Script:

```text
simulate-saturation-alert.ps1
```

Use fila local limitada.

Valide:

- utilização;
- capacidade;
- duração;
- warning;
- throughput;
- recuperação após drenar fila;
- ausência de alertas duplicados por instância.

---

### 38. Simular burn rate

Script:

```text
simulate-burn-rate-alert.ps1
```

Gere falhas em duas janelas didáticas.

Valide:

- recording rules;
- long window;
- short window;
- firing apenas quando ambas atendem;
- severity critical;
- budget didático;
- resolução;
- ausência de SLO real.

---

### 39. Validar ciclo de vida

Script:

```text
validate-alert-lifecycle.ps1
```

Para cada alerta:

```text
inactive;

pending;

firing;

resolved.
```

Valide timestamps e duração.

O alerta não deve:

- pular pending quando possui `for`;
- continuar firing indefinidamente;
- resolver sem notificação quando `send_resolved` é obrigatório;
- mudar identidade por label dinâmica.

---

### 40. Validar notificações

Script:

```text
validate-alertmanager-notifications.ps1
```

Confirme receiver, grouping, status, quantidade, annotations, firing, resolved e ausência de credentials ou IDs.

Não salve o payload bruto completo na evidence.

---

### 41. Validar inhibition

Cenário:

```text
OrdersApiTargetDown:
firing.

OrdersApiHighLatency:
também verdadeiro.
```

Resultado esperado:

```text
target down notificado;

latência inibida.
```

Confirme no Alertmanager:

- source matcher;
- target matcher;
- labels `equal`;
- alerta target ativo mas inibido;
- recuperação após source resolver.

---

### 42. Validar silence

Crie silence temporário via API local do Alertmanager.

Matchers:

```text
service="orders-api";

environment="local";

alertname="OrdersApiHighLatency".
```

Inclua comentário:

```text
laboratory maintenance simulation.
```

Valide:

- alerta continua firing;
- notificação é suprimida;
- silence expira;
- notificações voltam quando condição continua;
- evidence não contém usuário real.

---

### 43. Validar roteamento

Script:

```text
validate-alert-routing.ps1
```

Matriz:

```text
critical
→
local-critical.

warning
→
local-warning.

info
→
local-default.

unknown severity
→
gate bloqueado.
```

Valide também team e service.

Um alerta sem owner não pode ser aprovado.

---

### 44. Escanear output

Script:

```text
scan-alert-output.ps1
```

Procure:

- password;
- token;
- Authorization;
- Cookie;
- email real;
- telefone;
- order ID;
- customer ID;
- correlation ID;
- trace ID;
- payload;
- stack trace;
- URL corporativa;
- webhook real;
- API key.

Resultado:

```text
ALERT_OUTPUT_APPROVED
ou
ALERT_OUTPUT_BLOCKED.
```

---

### 45. Criar matriz de testes

Arquivo:

```text
ALERT_TEST_MATRIX.md
```

Cenários:

- rule YAML válida;
- PromQL válida;
- recording rule;
- inactive;
- pending;
- firing;
- resolved;
- `for`;
- `keep_firing_for`;
- traffic minimum;
- target down;
- error ratio;
- latency;
- saturation;
- burn rate;
- missing data;
- low sample count;
- routing critical;
- routing warning;
- grouping;
- deduplication;
- inhibition;
- silence;
- maintenance;
- Alertmanager down;
- sink down;
- send resolved;
- no sensitive data;
- evidence sanitizada.

---

### 46. Criar troubleshooting

Arquivo:

```text
ALERT_TROUBLESHOOTING.md
```

Inclua:

- regra não carrega;
- PromQL inválida;
- alerta sempre inactive;
- alerta sempre pending;
- alerta dispara com pouco tráfego;
- alerta não resolve;
- receiver não recebe;
- grupo contém alertas demais;
- repeat interval excessivo;
- labels mudam identidade;
- annotation sem ação;
- runbook ref ausente;
- silence amplo;
- inhibition não funciona;
- target down gera alertas derivados;
- burn rate sem duas janelas;
- Grafana e Prometheus duplicam alertas;
- webhook expõe dados;
- runbook completo antecipado.

---

### 47. Coletar evidence

Script:

```text
collect-alert-evidence.ps1
```

Arquivo:

```text
alert-evidence.json.
```

A evidence pode conter aula, ambiente, versões, grupos, contagens e status de routing, grouping, inhibition, silence, lifecycle, notificações, scan, cenários, testes e timestamp.

Não inclua:

- payload completo da notificação;
- credentials;
- webhook externo;
- IDs de negócio;
- trace IDs;
- correlation IDs;
- email;
- telefone;
- dados pessoais.

---

### 48. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\alerts\validate-alert-rule-files.ps1

.\scripts\observability\alerts\validate-alert-contract.ps1

.\scripts\observability\alerts\validate-alert-labels.ps1

.\scripts\observability\alerts\validate-alert-annotations.ps1

.\scripts\observability\alerts\validate-alert-routing.ps1

.\scripts\observability\alerts\validate-alert-inhibition.ps1

.\scripts\observability\alerts\start-alerting-lab.ps1

.\scripts\observability\alerts\simulate-target-down-alert.ps1

.\scripts\observability\alerts\simulate-error-rate-alert.ps1

.\scripts\observability\alerts\simulate-latency-alert.ps1

.\scripts\observability\alerts\simulate-saturation-alert.ps1

.\scripts\observability\alerts\simulate-burn-rate-alert.ps1

.\scripts\observability\alerts\validate-alert-lifecycle.ps1

.\scripts\observability\alerts\validate-alertmanager-notifications.ps1

.\scripts\observability\alerts\scan-alert-output.ps1

.\scripts\observability\alerts\collect-alert-evidence.ps1

.\scripts\observability\alerts\verify-alert-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- regras válidas;
- recording rules válidas;
- severidades válidas;
- owners presentes;
- runbook refs presentes;
- target down aprovado;
- erro aprovado;
- latência aprovada;
- saturação aprovada;
- burn rate aprovado;
- lifecycle aprovado;
- grouping aprovado;
- routing aprovado;
- inhibition aprovada;
- silence aprovado;
- resolved aprovado;
- dados sensíveis ausentes;
- evidence sanitizada;
- runbooks não antecipados.

---

### 49. Encerrar o laboratório

Execute:

```powershell
docker compose `
  --file `
  observability/alerts/alerting-compose.yml `
  down
```

Para remover volumes locais:

```powershell
docker compose `
  --file `
  observability/alerts/alerting-compose.yml `
  down `
  --volumes
```

Antes:

- colete evidence;
- confirme que os dados são locais;
- confirme o arquivo Compose;
- confirme ausência de informação necessária;
- encerre processos Java.

Não execute limpeza Docker global.

---

## Entendendo o que foi feito

### Métricas ganharam detecção

Condições relevantes passaram a ser avaliadas continuamente.

### Condições ganharam duração

Picos curtos deixaram de gerar notificações imediatas.

### Alertas ganharam ciclo de vida

Inactive, pending, firing e resolved passaram a ser testados.

### Labels ganharam governança

Identidade, severidade, owner e roteamento foram separados de texto descritivo.

### Annotations ganharam ação

Resumo, descrição, ação e referências passaram a acompanhar o alerta.

### Alertmanager ganhou responsabilidade

Agrupamento, deduplicação, roteamento, inhibition e silences ficaram centralizados.

### SLO ganhou ligação operacional

Burn rate didático mostrou consumo acelerado do error budget.

### Missing data ganhou tratamento

Ausência deixou de ser interpretada como saúde.

### Notificações ganharam destino seguro

O laboratório usa apenas um sink local e fictício.

### A próxima aula ganhou entradas claras

Cada alerta possui uma referência estável para um procedimento que será escrito na aula 567.

---

## Erros comuns importantes

### Alertar toda métrica

A equipe recebe ruído sem ação.

### Usar threshold sem duração

Picos breves viram incidentes.

### Usar labels dinâmicas

Deduplicação e agrupamento deixam de funcionar.

### Colocar stack trace na annotation

A notificação fica enorme e pode expor dados.

### Disparar taxa sem volume mínimo

Uma falha em uma requisição parece incidente grave.

### Criar alerta de CPU isolado

O impacto não está demonstrado.

### Usar silence permanente

O problema deixa de ser visível.

### Duplicar regra no Grafana e Prometheus

Duas notificações são enviadas.

### Inibir alerta crítico por warning

A hierarquia fica invertida.

### Antecipar o runbook

O procedimento completo pertence à aula 567.

---

## Comandos úteis

### Validar regras

```powershell
.\scripts\observability\alerts\validate-alert-rule-files.ps1
```

### Subir laboratório

```powershell
.\scripts\observability\alerts\start-alerting-lab.ps1
```

### Simular target down

```powershell
.\scripts\observability\alerts\simulate-target-down-alert.ps1
```

### Validar lifecycle

```powershell
.\scripts\observability\alerts\validate-alert-lifecycle.ps1
```

### Validar notificações

```powershell
.\scripts\observability\alerts\validate-alertmanager-notifications.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Defina impacto, owner, severidade e ação.

### Parte 2 — Rules

Crie recording e alerting rules.

### Parte 3 — Lifecycle

Valide inactive, pending, firing e resolved.

### Parte 4 — Routing

Configure receivers por severidade.

### Parte 5 — Grouping

Agrupe por alerta, serviço e ambiente.

### Parte 6 — Inhibition

Suprima alertas derivados de target down.

### Parte 7 — Silences

Simule manutenção temporária.

### Parte 8 — Burn rate

Valide duas janelas didáticas.

### Parte 9 — Failures

Simule Alertmanager e sink indisponíveis.

### Parte 10 — Evidence

Escaneie, registre e encerre.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 565 e ponte para a aula 567 foram preservadas;
- alert rule, recording rule, inactive, pending, firing, `for`, `keep_firing_for`, labels, annotations, Alertmanager, receiver, route, grouping, deduplication, inhibition, silence e alert fatigue foram definidos;
- baseline da observabilidade foi validada;
- contrato de alerta foi criado;
- alertas começam pelo impacto e pela ação;
- política de severidade foi criada;
- vocabulário de severidade é limitado;
- catálogo de alertas foi criado;
- target down foi definido;
- taxa de erro técnico foi definida;
- tráfego mínimo foi considerado;
- latência p95 foi definida;
- saturação usa capacidade;
- backlog combina entrada e throughput;
- recording rules foram criadas;
- recording rules possuem ownership;
- alerting rules foram criadas;
- PromQL foi validada;
- `for` foi justificado;
- `keep_firing_for` foi usado somente quando necessário;
- labels possuem severity, service, team e signal;
- labels dinâmicas são proibidas;
- annotations possuem summary, description, action e runbook ref;
- nenhum dado sensível aparece em annotations;
- burn rate didático foi criado;
- duas janelas foram utilizadas no fast burn;
- valores didáticos não foram chamados de SLO de produção;
- Prometheus aponta para Alertmanager;
- Alertmanager usa receiver local fictício;
- notificações firing e resolved foram validadas;
- política de roteamento foi criada;
- critical e warning usam receivers separados;
- alerta sem owner bloqueia o gate;
- política de agrupamento foi criada;
- agrupamento evita dimensão por instância sem necessidade;
- inhibition foi configurada;
- target down inibe alertas derivados;
- política de silences foi criada;
- silence possui motivo, owner, início e fim;
- silence permanente é proibido;
- manutenção foi tratada sem desabilitar todas as regras;
- missing data foi diferenciado de zero;
- data quality policy foi criada;
- Grafana e Prometheus não avaliam a mesma regra em paralelo;
- contact point local foi provisionado sem credential real;
- failure policy foi criada;
- Alertmanager indisponível não interrompe avaliação no Prometheus;
- sink indisponível não apaga estado do alerta;
- cenários foram criados;
- target down foi simulado;
- erro elevado foi simulado;
- latência foi simulada;
- saturação foi simulada;
- burn rate foi simulado;
- lifecycle foi validado;
- roteamento foi validado;
- inhibition foi validada;
- silence foi validado;
- notificações foram validadas;
- output foi escaneado;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhum canal real, Secret, dado pessoal ou cloud pública foi usado;
- runbooks completos não foram criados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/alerts `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/grafana/provisioning/alerting `
  scripts/observability/alerts `
  docs/observability/alerts `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|email|phone|pagerduty|slack.com|teams|order_id|customer_id|trace_id|correlation_id"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): implementar alertas acionaveis"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- webhook externo;
- email real;
- telefone;
- token;
- API key;
- payloads completos;
- silences ativos;
- dados do Alertmanager;
- runbooks completos;
- material da aula 567.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as séries e os sinais da `orders-api` passaram a produzir alertas acionáveis.

Você configurou:

```text
recording rules;

alerting rules;

Prometheus;

Alertmanager;

receivers;

routes;

grouping;

deduplication;

inhibition;

silences;

contact point local;

burn rate didático.
```

Você comprovou que um alerta precisa representar impacto e ação; thresholds isolados geram ruído; duração reduz flapping; labels definem identidade e roteamento; annotations fornecem contexto; tráfego mínimo protege ratios; saturação exige capacidade; target down deve inibir sintomas derivados; silences precisam ser temporários e auditáveis; burn rate combina erro e tolerância; missing data não é sucesso; Prometheus e Grafana não devem avaliar a mesma regra sem um motivo; e a indisponibilidade da entrega não deve apagar o estado avaliado.

A próxima aula será:

```text
567 - M18.12 - Runbooks
```

Nela, você irá transformar as referências dos alertas em procedimentos operacionais completos, com diagnóstico, mitigação, rollback, escalonamento, evidências e critérios de encerramento.

Nenhum runbook completo, sequência detalhada de resposta, matriz final de escalonamento ou procedimento formal de incidente foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei catálogo e contrato de alertas.
- [ ] Criei recording e alerting rules.
- [ ] Configurei Alertmanager e receivers locais.
- [ ] Validei routing, grouping e inhibition.
- [ ] Simulei silences e manutenção.
- [ ] Validei burn rate e lifecycle.
- [ ] Escaneei notificações.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### O alerta nunca sai de inactive

Execute a PromQL diretamente e valide labels e tráfego.

### O alerta fica pending para sempre

Revise `for`, avaliações e oscilações da expressão.

### O alerta não resolve

Revise a série, `keep_firing_for` e o estado no Prometheus.

### O receiver não recebe

Revise route, matcher, Alertmanager e sink local.

### Uma notificação chega por instância

Revise `group_by` e labels de identidade.

### O alerta dispara com uma única falha

Adicione volume mínimo e duração.

### A latência alerta durante target down

Revise inhibition.

### O silence não funciona

Revise matchers, horário e expiração.

### O mesmo alerta chega duas vezes

Verifique dupla avaliação no Grafana e Prometheus.

### O procedimento completo começou a ser escrito

Preserve essa construção para a aula 567.

---

## Perguntas de revisão

1. O que é alert rule?
2. O que é recording rule?
3. O que significa inactive?
4. O que significa pending?
5. O que significa firing?
6. Para que serve `for`?
7. Para que serve `keep_firing_for`?
8. Qual diferença entre label e annotation?
9. O que faz o Alertmanager?
10. O que é grouping?
11. O que é deduplication?
12. O que é inhibition?
13. O que é silence?
14. Por que considerar tráfego mínimo?
15. Por que usar duas janelas em burn rate?
16. Como tratar missing data?
17. Por que evitar labels dinâmicas?
18. O que é alert fatigue?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Regra que produz alerta.
2. Consulta pré-calculada.
3. Condição falsa.
4. Condição aguardando duração.
5. Alerta ativo.
6. Exigir persistência.
7. Reduzir flapping.
8. Identidade versus contexto.
9. Agrupa, roteia e notifica.
10. Junta alertas relacionados.
11. Evita repetição.
12. Suprime sintomas derivados.
13. Supressão temporária.
14. Evitar ratio enganosa.
15. Confirmar consumo sustentado.
16. Estado desconhecido ou alerta próprio.
17. Preservar identidade e deduplicação.
18. Perda de confiança por ruído.
19. Runbooks.
20. Runbooks.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 566 - M18.11 - Alertas

- Continuei após Tracing distribuído.
- Diferenciei recording rules e alerting rules.
- Entendi os estados inactive, pending, firing e resolved.
- Criei contrato e catálogo de alertas.
- Defini severidades critical, warning e info.
- Comecei os alertas pelo impacto e pela ação.
- Criei recording rules para tráfego, erros e p95.
- Criei alerta de target down.
- Criei alerta de taxa de erro técnico com tráfego mínimo.
- Criei alerta de latência sustentada.
- Criei alerta de fila próxima da capacidade.
- Modelei fast burn didático com duas janelas.
- Usei `for` para evitar picos transitórios.
- Analisei `keep_firing_for` para reduzir flapping.
- Defini labels estáveis e annotations acionáveis.
- Adicionei referências estáveis para dashboards e futuros runbooks.
- Configurei Prometheus para enviar alertas ao Alertmanager.
- Configurei receivers locais fictícios.
- Criei políticas de routing e grouping.
- Configurei inhibition para sintomas derivados de target down.
- Criei política de silences temporários.
- Modelei manutenção sem desabilitar todas as regras.
- Diferenciei zero, missing data e target down.
- Evitei avaliação duplicada entre Prometheus e Grafana.
- Simulei target down, erros, latência, saturação e burn rate.
- Validei lifecycle, notificações firing e resolved.
- Escaneei dados sensíveis.
- Coletei evidence sanitizada.
- Não criei runbooks completos.
- Próxima aula: Runbooks.
```

---

## Referência técnica curta

- Prometheus Alerting Rules.
- Prometheus Recording Rules.
- Alert Rule Lifecycle.
- Prometheus `for`.
- Prometheus `keep_firing_for`.
- Alertmanager Configuration.
- Alertmanager Routing.
- Alertmanager Grouping.
- Alertmanager Inhibition.
- Alertmanager Silences.

Regra final:

```text
alertas precisam converter sinais em ações sem gerar fadiga: recording rules padronizam consultas, alerting rules usam condições relevantes, duração, tráfego mínimo e capacidade conhecida, e o ciclo inactive, pending, firing e resolved é validado; labels estáveis definem severity, service, team, environment e signal, enquanto annotations fornecem summary, description, action, dashboard_ref e uma referência estável para o runbook futuro; Alertmanager agrupa, deduplica, roteia e envia apenas para receivers locais fictícios, inhibition suprime sintomas derivados, silences são temporários e auditáveis, missing data nunca é tratado automaticamente como saúde e Prometheus permanece a fonte principal das regras para evitar avaliação duplicada; burn rate didático combina janelas curta e longa, notificações firing e resolved são testadas, dados sensíveis e destinos reais são proibidos, deixando para a aula 567 a criação dos procedimentos completos de diagnóstico, mitigação, rollback, escalonamento e encerramento.
```
