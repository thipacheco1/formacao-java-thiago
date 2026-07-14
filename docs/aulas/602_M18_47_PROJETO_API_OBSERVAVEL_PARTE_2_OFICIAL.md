# 602 - M18.47 - Projeto API observavel parte 2

## Apresentação da aula

Na aula 601, você iniciou o projeto `observable-orders-api`.

A aplicação passou a possuir:

```text
domínio sintético de pedidos;

migrations PostgreSQL;

endpoints funcionais;

tratamento centralizado de erros;

request ID;

correlation ID;

MDC;

logs estruturados;

métricas de negócio;

métricas de repository;

métricas de fila;

health;

liveness;

readiness;

build info;

graceful shutdown.
```

Essa primeira camada respondeu perguntas locais importantes:

```text
a aplicação está viva?

está pronta para receber tráfego?

qual operação falhou?

quanto tempo o repository levou?

quantos pedidos foram criados?

a fila sintética está próxima do limite?

o contexto foi limpo após a request?
```

Entretanto, uma aplicação observável em produção precisa relacionar sinais.

Logs, métricas e traces isolados mostram partes do problema. O valor operacional aparece quando permitem navegar pela mesma jornada:

```text
alerta;

dashboard;

métrica;

exemplar;

trace;

span;

log;

request;

dependência;

release.
```

A pergunta central desta aula será:

```text
como transformar
logs,
métricas
e traces

em um sistema
coerente de diagnóstico

que detecta,
explica
e orienta a resposta?
```

Nesta parte 2, você irá evoluir a API com:

- OpenTelemetry;
- tracing automático e manual;
- propagação de contexto;
- trace ID e span ID nos logs;
- spans de aplicação;
- spans de repository;
- spans do publisher;
- atributos bounded;
- status e eventos de span;
- baggage restrito;
- Prometheus;
- configuração de scrape;
- Grafana;
- provisioning de datasource;
- dashboards operacionais;
- métricas RED;
- métricas USE quando aplicáveis;
- histogramas;
- exemplars;
- SLI de disponibilidade;
- SLI de latência;
- SLO inicial do projeto;
- burn-rate alerts;
- alertas de saturação;
- alertas de readiness;
- cenários de degradação controlada;
- correlação por release;
- runbook específico da API;
- game day do projeto;
- gate de observabilidade integrada.

A parte 2 irá medir e diagnosticar, sem otimizar o código. Não serão feitos ainda:

- tuning de pool;
- mudança de algoritmo por performance;
- redução final de alocação;
- correção de hot method;
- otimização de query;
- comparação before/after de CPU;
- profiling final;
- ajuste final de virtual threads;
- tuning de GC;
- revisão final de índices;
- load test definitivo;
- aprovação de ganho de performance.

Esses itens pertencem à aula oficial seguinte:

```text
603 - M18.48 - Projeto API observavel parte 3 otimizacao
```

A regra central da aula será:

```text
um sinal
precisa levar
ao próximo sinal;

dashboard sem contexto
e trace sem contrato
não formam
observabilidade operacional.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
600:
Runbook de incidente.

601:
Projeto API observavel parte 1.

602:
Projeto API observavel parte 2.

603:
Projeto API observavel parte 3 otimizacao.

604:
Revisao producao parte 1.
```

A progressão do projeto é:

```text
parte 1:
fundação observável.

parte 2:
integração operacional.

parte 3:
otimização orientada por evidência.
```

Nesta aula:

```text
OpenTelemetry:
sim.

trace ID em logs:
sim.

spans customizados:
sim.

Prometheus:
sim.

Grafana:
sim.

dashboards:
sim.

SLI:
sim.

SLO:
sim.

burn rate:
sim.

alertas:
sim.

degradação controlada:
sim.

runbook da API:
sim.

otimização:
não.

profiling final:
não.

tuning final:
não.
```

Você continuará trabalhando em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

A baseline da aula 601 deve permanecer funcional.

---

## Objetivo prático

A estrutura será ampliada com:

```text
projects/observable-orders-api
├── compose.yaml
├── config
│   ├── prometheus.yml
│   ├── alert-rules.yml
│   ├── otel-collector.yml
│   └── grafana
│       ├── provisioning
│       │   ├── datasources
│       │   │   └── datasources.yml
│       │   └── dashboards
│       │       └── dashboards.yml
│       └── dashboards
│           ├── observable-orders-overview.json
│           ├── observable-orders-http.json
│           ├── observable-orders-dependencies.json
│           └── observable-orders-slo.json
├── contracts
│   ├── observable-api-tracing-policy.yaml
│   ├── observable-api-context-propagation-policy.yaml
│   ├── observable-api-dashboard-policy.yaml
│   ├── observable-api-sli-policy.yaml
│   ├── observable-api-slo-policy.yaml
│   ├── observable-api-alert-policy.yaml
│   ├── observable-api-degradation-policy.yaml
│   ├── observable-api-runbook-policy.yaml
│   ├── observable-api-part2-security-policy.yaml
│   ├── observable-api-part2-data-quality-policy.yaml
│   ├── observable-api-part2-failure-policy.yaml
│   ├── observable-api-part2-scenarios.yaml
│   └── observable-api-part2-evidence.yaml
├── src/main/java/br/com/formacao/observableorders
│   ├── observability
│   │   ├── ObservationNames.java
│   │   ├── ObservationAttributes.java
│   │   ├── OrderObservationService.java
│   │   ├── RepositoryObservationInterceptor.java
│   │   ├── EventPublisherObservationDecorator.java
│   │   ├── TraceLogContextEnricher.java
│   │   ├── DegradationController.java
│   │   ├── DegradationMode.java
│   │   ├── SyntheticLatencyInjector.java
│   │   ├── SyntheticFailureInjector.java
│   │   └── ObservableApiReadinessContributor.java
│   └── operations
│       ├── SloSnapshot.java
│       ├── ErrorBudgetSnapshot.java
│       ├── OperationalRunbookService.java
│       └── GameDayScenario.java
├── src/test/java/br/com/formacao/observableorders
│   ├── TracePropagationTest.java
│   ├── SpanAttributePolicyTest.java
│   ├── TraceLogCorrelationTest.java
│   ├── PrometheusContractTest.java
│   ├── DashboardContractTest.java
│   ├── SliCalculationTest.java
│   ├── ErrorBudgetCalculationTest.java
│   ├── AlertRuleContractTest.java
│   ├── DegradationScenarioTest.java
│   ├── RunbookContractTest.java
│   └── ObservableApiPart2GateTest.java
├── reports
│   ├── observable-api-trace-report.yaml
│   ├── observable-api-correlation-report.yaml
│   ├── observable-api-dashboard-report.yaml
│   ├── observable-api-sli-report.yaml
│   ├── observable-api-slo-report.yaml
│   ├── observable-api-alert-report.yaml
│   ├── observable-api-degradation-report.yaml
│   ├── observable-api-game-day-report.yaml
│   └── observable-api-part2-gate-report.yaml
└── docs
    ├── TRACING_ARCHITECTURE.md
    ├── SIGNAL_CORRELATION_GUIDE.md
    ├── PROMETHEUS_AND_GRAFANA.md
    ├── DASHBOARD_OPERATING_GUIDE.md
    ├── SLI_AND_SLO.md
    ├── ALERTING_STRATEGY.md
    ├── CONTROLLED_DEGRADATION.md
    ├── OBSERVABLE_API_RUNBOOK.md
    ├── OBSERVABLE_API_GAME_DAY.md
    ├── OBSERVABLE_API_PART2_TEST_MATRIX.md
    └── OBSERVABLE_API_PART2_TROUBLESHOOTING.md
```

Scripts adicionais:

```text
scripts/projects/observable-orders-api
├── start-observability-stack.ps1
├── stop-observability-stack.ps1
├── validate-otel-collector.ps1
├── validate-trace-propagation.ps1
├── validate-trace-log-correlation.ps1
├── validate-prometheus-scrape.ps1
├── validate-grafana-provisioning.ps1
├── validate-observable-dashboards.ps1
├── validate-observable-api-slis.ps1
├── validate-observable-api-slo.ps1
├── validate-observable-api-alerts.ps1
├── simulate-database-latency.ps1
├── simulate-publisher-saturation.ps1
├── simulate-HTTP-error-rate.ps1
├── simulate-readiness-failure.ps1
├── validate-degradation-recovery.ps1
├── run-observable-api-game-day.ps1
├── validate-observable-api-runbook.ps1
├── collect-observable-api-part2-evidence.ps1
└── verify-observable-api-part2-baseline.ps1
```

Ao final, a operação poderá partir de um alerta e chegar à causa provável por sinais correlacionados.

---

## Conceito essencial

### Trace

Representação de uma jornada distribuída composta por spans.

---

### Span

Unidade de trabalho dentro de um trace.

---

### Trace ID

Identificador do trace completo.

---

### Span ID

Identificador de um span específico.

---

### Parent span

Span que originou ou contém outro span.

---

### Context propagation

Transporte do contexto de observabilidade entre componentes.

---

### Span attribute

Atributo estruturado associado a um span.

---

### Span event

Evento pontual registrado dentro de um span.

---

### Baggage

Contexto propagado entre componentes, sujeito a forte controle de segurança, tamanho e cardinalidade.

---

### Exemplar

Referência de uma observação de métrica para um trace relacionado.

---

### RED

Modelo baseado em:

```text
Rate;

Errors;

Duration.
```

---

### USE

Modelo baseado em:

```text
Utilization;

Saturation;

Errors.
```

---

### SLI

Indicador quantitativo que mede o comportamento do serviço.

---

### SLO

Objetivo definido para um SLI em uma janela.

---

### Error budget

Parcela de falha permitida pelo SLO.

---

### Burn rate

Velocidade com que o error budget está sendo consumido.

---

### Dashboard operacional

Dashboard criado para responder perguntas e orientar ações, não apenas para exibir gráficos.

---

## Mão na massa guiada

### 1. Validar a baseline da parte 1

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-baseline.ps1

git status

git diff --check
```

Confirme:

- API funcional;
- migrations aplicadas;
- logs estruturados;
- métricas disponíveis;
- readiness e liveness corretas;
- fila bounded;
- zero task leaks;
- nenhum segredo no repositório.

---

### 2. Adicionar dependências de tracing

Inclua as dependências compatíveis com a baseline da formação:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>

<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
```

O tracing deve usar a integração suportada pela versão de Spring Boot adotada.

Evite combinar bibliotecas com versões incompatíveis.

---

### 3. Configurar tracing

Exemplo em `application.yml`:

```yaml
management:
  tracing:
    sampling:
      probability: 1.0

  otlp:
    tracing:
      endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT:http://localhost:4318/v1/traces}

  observations:
    key-values:
      service: observable-orders-api
```

Amostragem de 100% é aceitável no laboratório.

Em produção, a taxa precisa considerar:

- volume;
- custo;
- retenção;
- criticidade;
- tail sampling;
- incidentes;
- compliance.

---

### 4. Criar policy de tracing

Arquivo:

```text
contracts/observable-api-tracing-policy.yaml
```

Conteúdo:

```yaml
tracing:
  required:
    - inbound-HTTP-span
    - application-span
    - repository-span
    - event-publisher-span
    - error-status
    - context-propagation
    - trace-log-correlation

  attributes:
    allowed:
      - service.name
      - deployment.environment
      - service.version
      - operation
      - outcome
      - order.status.category
      - repository.operation
      - messaging.operation

    forbidden:
      - order.id
      - customer.reference
      - request.body
      - SQL.parameter
      - token
      - exception.message.raw

  sampling:
    explicit:
      required
```

---

### 5. Criar nomes padronizados

```java
public final class ObservationNames {

    public static final String ORDER_CREATE =
            "order.create";

    public static final String ORDER_CONFIRM =
            "order.confirm";

    public static final String ORDER_CANCEL =
            "order.cancel";

    public static final String REPOSITORY_SAVE =
            "order.repository.save";

    public static final String REPOSITORY_FIND =
            "order.repository.find";

    public static final String EVENT_PUBLISH =
            "order.event.publish";

    private ObservationNames() {
    }
}
```

Nomes precisam ser estáveis.

---

### 6. Criar serviço de observação

```java
@Component
public final class OrderObservationService {

    private final ObservationRegistry registry;

    public <T> T observe(
            String name,
            String operation,
            Supplier<T> supplier) {

        Observation observation =
                Observation.createNotStarted(
                        name,
                        registry)
                        .lowCardinalityKeyValue(
                                "operation",
                                operation);

        return observation.observe(
                supplier::get);
    }
}
```

Atributos de baixa cardinalidade são usados para agrupamento.

---

### 7. Instrumentar application service

```java
public OrderResponse create(
        CreateOrderRequest request) {

    return observations.observe(
            ObservationNames.ORDER_CREATE,
            "create",
            () -> createObserved(request));
}
```

Dentro do fluxo, métricas e logs continuam sendo emitidos.

O objetivo é correlacionar os sinais.

---

### 8. Instrumentar repository

```java
@Component
public final class RepositoryObservationInterceptor {

    private final ObservationRegistry registry;

    public <T> T observe(
            String operation,
            Supplier<T> supplier) {

        return Observation
                .createNotStarted(
                        "order.repository",
                        registry)
                .lowCardinalityKeyValue(
                        "operation",
                        operation)
                .observe(
                        supplier::get);
    }
}
```

Não adicione ID do pedido como atributo indexado.

---

### 9. Instrumentar publisher

```java
@Component
public final class EventPublisherObservationDecorator
        implements OrderEventPublisher {

    private final OrderEventPublisher delegate;
    private final ObservationRegistry registry;

    @Override
    public void publishCreated(
            Order order) {

        Observation.createNotStarted(
                        ObservationNames.EVENT_PUBLISH,
                        registry)
                .lowCardinalityKeyValue(
                        "operation",
                        "created")
                .observe(
                        () -> delegate
                                .publishCreated(order));
    }
}
```

---

### 10. Criar policy de propagação

Arquivo:

```text
contracts/observable-api-context-propagation-policy.yaml
```

Conteúdo:

```yaml
propagation:
  inbound:
    accept:
      - W3C-traceparent
      - W3C-tracestate

  outbound:
    inject:
      required

  local:
    preserveAcross:
      - application-service
      - repository
      - event-publisher

  customExecutor:
    contextCapture:
      required

  ThreadLocalOnly:
    insufficient

  baggage:
    allowlist:
      required
```

---

### 11. Entender `traceparent`

Formato conceitual:

```text
version-traceid-parentid-flags
```

O header é gerenciado pela biblioteca.

Não monte manualmente IDs de trace.

Não aceite conteúdo inválido como atributo livre.

---

### 12. Correlacionar trace com logs

O padrão de log deve incluir:

```text
traceId;

spanId;

requestId;

correlationId.
```

Exemplo de configuração:

```xml
<pattern>
    {"timestamp":"%d{ISO8601}",
    "level":"%level",
    "service":"${serviceName}",
    "traceId":"%X{traceId}",
    "spanId":"%X{spanId}",
    "requestId":"%X{requestId}",
    "correlationId":"%X{correlationId}",
    "message":"%replace(%msg){'[\r\n]',' '}"}
    %n
</pattern>
```

Trace ID não deve ser usado como label de métrica.

---

### 13. Criar enriquecedor de log

```java
@Component
public final class TraceLogContextEnricher {

    public Map<String, String> current() {

        return Map.of(
                "traceId",
                valueOrUnavailable(
                        MDC.get("traceId")),
                "spanId",
                valueOrUnavailable(
                        MDC.get("spanId")),
                "requestId",
                RequestContext
                        .currentRequestId());
    }
}
```

Use esse componente somente para campos permitidos.

---

### 14. Registrar erro no span

Quando uma operação falha:

- marque outcome;
- mantenha exception categorizada;
- evite mensagem sensível;
- preserve stack no backend autorizado;
- não transforme regra de domínio em erro técnico genérico.

Exemplo conceitual:

```java
observation.error(exception);
```

A integração deve produzir status compatível com a semântica do framework.

---

### 15. Criar atributos de erro bounded

Permitidos:

```text
error.type.category;

operation;

outcome;

dependency.category.
```

Proibidos:

```text
exception.message;

request.path.raw;

order.id;

customer.reference;

SQL.raw.
```

---

### 16. Configurar OpenTelemetry Collector

Arquivo:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:
  memory_limiter:
    check_interval: 1s
    limit_mib: 256

exporters:
  debug:
    verbosity: basic

service:
  pipelines:
    traces:
      receivers:
        - otlp
      processors:
        - memory_limiter
        - batch
      exporters:
        - debug
```

A configuração local pode usar exporter de debug.

O contrato deve permitir troca por backend real.

---

### 17. Evoluir `compose.yaml`

Adicione:

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./config/alert-rules.yml:/etc/prometheus/alert-rules.yml:ro
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    volumes:
      - ./config/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./config/grafana/dashboards:/var/lib/grafana/dashboards:ro
    ports:
      - "3000:3000"

  otel-collector:
    image: otel/opentelemetry-collector
    command:
      - --config=/etc/otelcol/config.yml
    volumes:
      - ./config/otel-collector.yml:/etc/otelcol/config.yml:ro
    ports:
      - "4317:4317"
      - "4318:4318"
```

Use versões fixadas no projeto real.

Tags flutuantes devem ser evitadas na baseline definitiva.

---

### 18. Configurar Prometheus

Arquivo:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - /etc/prometheus/alert-rules.yml

scrape_configs:
  - job_name: observable-orders-api
    metrics_path: /actuator/prometheus
    static_configs:
      - targets:
          - host.docker.internal:8080
```

A resolução do host pode variar conforme o sistema operacional.

Documente a alternativa local.

---

### 19. Validar scrape

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-prometheus-scrape.ps1
```

Confirme:

- target `UP`;
- scrape sem erro;
- JVM metrics;
- HTTP metrics;
- métricas de pedido;
- repository timer;
- pending events;
- Hikari metrics;
- labels bounded.

---

### 20. Criar policy de dashboard

Arquivo:

```text
contracts/observable-api-dashboard-policy.yaml
```

Conteúdo:

```yaml
dashboards:
  required:
    - overview
    - HTTP
    - dependencies
    - SLO

  everyPanel:
    required:
      - title
      - unit
      - description
      - owner-question
      - datasource

  variables:
    allowed:
      - environment
      - service
      - release
      - operation

  forbidden:
    - request-id-variable
    - trace-id-variable
    - order-id-variable

  links:
    traceNavigation:
      preferred
```

---

### 21. Criar dashboard overview

Painéis:

```text
service status;

request rate;

error rate;

p50 latency;

p95 latency;

p99 latency;

readiness;

active connections;

pending connections;

pending events;

JVM heap;

process CPU;

release.
```

Cada painel precisa responder uma pergunta.

---

### 22. Criar dashboard HTTP

Painéis:

- requests por rota normalizada;
- status class;
- taxa de 4xx;
- taxa de 5xx;
- p50;
- p95;
- p99;
- requests em andamento;
- endpoints mais lentos;
- duração por release.

Não use URI bruta com IDs.

---

### 23. Criar dashboard de dependências

Painéis:

- repository latency;
- repository errors;
- Hikari active;
- Hikari idle;
- Hikari pending;
- acquisition time;
- queue utilization;
- event publish errors;
- readiness por dependência;
- taxa de degradação.

---

### 24. Criar métricas RED

Rate:

```promql
sum(
  rate(
    http_server_requests_seconds_count{
      application="observable-orders-api"
    }[5m]
  )
)
```

Errors:

```promql
sum(
  rate(
    http_server_requests_seconds_count{
      application="observable-orders-api",
      status=~"5.."
    }[5m]
  )
)
```

Duration:

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(
      http_server_requests_seconds_bucket{
        application="observable-orders-api"
      }[5m]
    )
  )
)
```

Os nomes reais dependem da versão e configuração do Micrometer.

Valide no endpoint Prometheus.

---

### 25. Usar rota normalizada

A métrica deve conter:

```text
/api/orders/{id}
```

e não:

```text
/api/orders/6d34...
```

Isso protege cardinalidade.

---

### 26. Criar SLI policy

Arquivo:

```text
contracts/observable-api-sli-policy.yaml
```

Conteúdo:

```yaml
SLI:
  availability:
    good:
      HTTP-status-not-5xx

    total:
      eligible-HTTP-requests

    exclusions:
      explicit:
        required

  latency:
    threshold:
      500ms

    good:
      eligible-request-below-threshold

  window:
    rolling:
      30d

  routeScope:
    criticalOperations:
      required
```

Os valores são didáticos e precisam ser revisados para produção.

---

### 27. Definir elegibilidade

Nem toda request precisa pertencer ao mesmo SLI.

Exemplos:

```text
incluídas:
criar,
consultar,
confirmar,
cancelar.

avaliadas separadamente:
actuator,
health,
metrics.

excluídas:
requests de teste autorizadas,
quando documentado.
```

Exclusão não pode esconder falhas reais.

---

### 28. Criar SLO policy

Arquivo:

```text
contracts/observable-api-slo-policy.yaml
```

Conteúdo:

```yaml
SLO:
  availability:
    objective:
      99.9

    window:
      30d

  latency:
    objective:
      99.0

    threshold:
      500ms

    window:
      30d

  owner:
    orders-team

  review:
    periodic:
      required

  releaseGate:
    errorBudgetAware:
      true
```

---

### 29. Calcular error budget

Para disponibilidade de:

```text
99,9%
```

o orçamento de falha é:

```text
0,1%
```

Em uma janela de 30 dias, o equivalente temporal aproximado pode ajudar na comunicação, mas o cálculo operacional deve usar eventos elegíveis.

Não reduza o SLO apenas a minutos indisponíveis quando o indicador é request-based.

---

### 30. Criar snapshot de SLO

```java
public record SloSnapshot(
        double availability,
        double latencyCompliance,
        double availabilityObjective,
        double latencyObjective,
        Duration window) {
}
```

---

### 31. Criar error budget snapshot

```java
public record ErrorBudgetSnapshot(
        double allowedBadRatio,
        double observedBadRatio,
        double remainingRatio,
        double burnRate) {
}
```

Evite cálculos com divisões silenciosamente inválidas.

---

### 32. Criar burn-rate alerts

Conceito:

```text
burn rate = taxa observada de consumo
            dividida pela taxa permitida.
```

Um burn rate alto significa que o orçamento será consumido rapidamente.

Use janelas múltiplas para equilibrar velocidade e estabilidade.

---

### 33. Criar policy de alertas

Arquivo:

```text
contracts/observable-api-alert-policy.yaml
```

Conteúdo:

```yaml
alerts:
  required:
    - availability-burn-rate
    - latency-burn-rate
    - readiness-down
    - Hikari-pending
    - event-queue-saturation
    - sustained-5xx

  eachAlert:
    required:
      - owner
      - severity
      - symptom
      - impact
      - runbook
      - dashboard
      - duration
      - recovery-condition

  rawThresholdWithoutDuration:
    forbidden

  page:
    symptomBased:
      required
```

---

### 34. Criar regra de 5xx sustentado

Exemplo:

```yaml
groups:
  - name: observable-orders-api
    rules:
      - alert: ObservableOrdersHigh5xxRate
        expr: |
          (
            sum(rate(http_server_requests_seconds_count{
              application="observable-orders-api",
              status=~"5.."
            }[5m]))
            /
            sum(rate(http_server_requests_seconds_count{
              application="observable-orders-api"
            }[5m]))
          ) > 0.05
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: Sustained 5xx rate
          runbook: observable-api-runbook
```

Valide divisão por zero na regra real.

---

### 35. Criar alerta de readiness

Readiness `DOWN` persistente pode indicar:

- banco indisponível;
- fila próxima da capacidade;
- dependency gate fechado;
- migration incompleta;
- estado de degradação.

O alerta precisa diferenciar uma instância isolada de todo o serviço.

---

### 36. Criar alerta de Hikari pending

Sinais relacionados:

- pending;
- active;
- maximum;
- acquisition p95;
- query latency;
- lock wait;
- timeout rate.

Nunca conclua automaticamente:

```text
pool pequeno.
```

O alerta deve levar ao runbook de diagnóstico.

---

### 37. Criar alerta de fila

Exemplo conceitual:

```text
pending events
/
capacity
>
0,8
por 10 minutos.
```

A fila próxima do limite pode acionar:

- warning;
- readiness degradada;
- redução de entrada;
- investigação do consumer.

---

### 38. Criar cenários de degradação

Arquivo:

```text
contracts/observable-api-degradation-policy.yaml
```

Conteúdo:

```yaml
degradation:
  environment:
    nonProductionOnly:
      required

  modes:
    - database-latency
    - repository-failure
    - publisher-latency
    - publisher-saturation
    - HTTP-error-rate
    - readiness-failure

  activation:
    explicit:
      required

  production:
    endpoint:
      forbidden

  autoReset:
    required

  observability:
    required
```

---

### 39. Criar modos de degradação

```java
public enum DegradationMode {
    NONE,
    DATABASE_LATENCY,
    REPOSITORY_FAILURE,
    PUBLISHER_LATENCY,
    PUBLISHER_SATURATION,
    READINESS_FAILURE
}
```

Esses modos existem somente em perfil de laboratório.

---

### 40. Criar injetor de latência

```java
@Component
@Profile("lab")
public final class SyntheticLatencyInjector {

    private final AtomicReference<DegradationMode>
            mode =
            new AtomicReference<>(
                    DegradationMode.NONE);

    public void beforeRepository() {

        if (mode.get()
                == DegradationMode.DATABASE_LATENCY) {
            try {
                Thread.sleep(300);
            } catch (InterruptedException exception) {
                Thread.currentThread()
                        .interrupt();
            }
        }
    }
}
```

Não use esse componente em produção.

---

### 41. Criar controller de degradação

```java
@RestController
@RequestMapping("/lab/degradation")
@Profile("lab")
public class DegradationController {

    @PostMapping("/{mode}")
    public void activate(
            @PathVariable
            DegradationMode mode) {
        service.activate(mode);
    }

    @DeleteMapping
    public void reset() {
        service.reset();
    }
}
```

O profile `lab` impede exposição normal.

---

### 42. Simular latência de banco

Execute:

```powershell
.\scripts\projects\observable-orders-api\simulate-database-latency.ps1
```

Observe:

- p95 HTTP;
- repository timer;
- trace;
- span de repository;
- Hikari;
- logs da mesma journey;
- readiness;
- alerta de latência;
- recovery após reset.

---

### 43. Simular saturação do publisher

Execute:

```powershell
.\scripts\projects\observable-orders-api\simulate-publisher-saturation.ps1
```

Observe:

- pending events;
- queue utilization;
- rejeições;
- readiness;
- error rate;
- trace do publish;
- log de queue full;
- alerta;
- recovery.

---

### 44. Simular 5xx

Execute:

```powershell
.\scripts\projects\observable-orders-api\simulate-HTTP-error-rate.ps1
```

Confirme:

- 5xx cresce;
- alerta respeita duração;
- traces de erro existem;
- logs possuem trace ID;
- dashboard mostra release;
- erro não expõe stack ao cliente.

---

### 45. Criar correlação por release

Métricas e logs precisam indicar uma categoria de release estável.

Use:

```text
service.version;

deployment.environment.
```

Evite labels com commit completo quando isso gerar cardinalidade excessiva ao longo de longas janelas.

A política deve definir retenção e quantidade esperada de releases simultâneas.

---

### 46. Criar exemplars

Quando suportado, histogramas podem associar observações a trace IDs.

O fluxo operacional fica:

```text
pico no p99;

abrir exemplar;

abrir trace;

identificar span lento;

buscar logs pelo trace ID.
```

Exemplars não substituem dashboards ou sampling adequado.

---

### 47. Criar dashboard de SLO

Painéis:

- disponibilidade atual;
- objetivo;
- error budget restante;
- burn rate curto;
- burn rate longo;
- conformidade de latência;
- bad events;
- requests elegíveis;
- release atual;
- eventos de deployment.

---

### 48. Criar runbook da API

Arquivo:

```text
docs/OBSERVABLE_API_RUNBOOK.md
```

Entrada:

```text
alert name;

severity;

service;

environment;

release;

dashboard;

SLO status;

known degradation mode.
```

Primeiros passos:

1. validar impacto;
2. confirmar se é simulação;
3. abrir dashboard overview;
4. revisar release;
5. revisar RED;
6. abrir dashboard de dependências;
7. abrir exemplar ou trace;
8. correlacionar logs;
9. revisar readiness;
10. escolher runbook especializado;
11. mitigar;
12. validar recovery.

---

### 49. Criar policy de runbook

Arquivo:

```text
contracts/observable-api-runbook-policy.yaml
```

Conteúdo:

```yaml
runbook:
  required:
    - alert-entry
    - impact-check
    - dashboard-navigation
    - trace-navigation
    - log-correlation
    - dependency-check
    - mitigation
    - recovery
    - escalation

  everyAlert:
    link:
      required

  destructiveAction:
    authorization:
      required

  optimization:
    deferredToLesson603
```

---

### 50. Criar game day

Cenário:

```text
release:
nova.

p95:
crescendo.

5xx:
estável.

repository span:
lento.

Hikari pending:
baixo.

database CPU:
normal.

degradation mode:
database-latency.
```

Objetivo:

- detectar pelo dashboard;
- verificar SLO;
- abrir trace;
- localizar repository;
- confirmar logs;
- identificar modo sintético;
- resetar degradação;
- validar recovery;
- registrar timeline.

---

### 51. Executar segundo cenário

Cenário:

```text
pending events:
alto.

readiness:
DOWN.

5xx:
crescendo.

publisher span:
falhando.

fila:
cheia.
```

Valide:

- alerta de fila;
- dashboard de dependências;
- trace de erro;
- log correlacionado;
- rejection explícita;
- recovery após drenagem;
- ausência de perda silenciosa.

---

### 52. Criar policy de segurança da parte 2

Arquivo:

```text
contracts/observable-api-part2-security-policy.yaml
```

Conteúdo:

```yaml
security:
  traces:
    forbidden:
      - payload
      - credential
      - customer-reference
      - order-id
      - SQL-parameter

  baggage:
    allowlist:
      required

  dashboards:
    publicAccess:
      forbidden

  Grafana:
    defaultCredential:
      forbiddenOutsideLab

  degradationEndpoint:
    production:
      forbidden

  rawTelemetry:
    repository:
      forbidden
```

---

### 53. Criar data quality policy

Arquivo:

```text
contracts/observable-api-part2-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingTrace:
    result:
      correlation-incomplete

  missingRelease:
    result:
      deployment-correlation-limited

  histogramWithoutBuckets:
    result:
      percentile-invalid

  SLIWithoutEligibility:
    action:
      fail-review

  alertWithoutDuration:
    action:
      fail-gate

  dashboardWithoutQuestion:
    result:
      decoration-only

  singleDegradationRun:
    result:
      limited
```

---

### 54. Criar failure policy

Arquivo:

```text
contracts/observable-api-part2-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  traceAttributeHighCardinality:
    action:
      fail-gate

  baggageSensitive:
    action:
      fail-security

  PrometheusTargetDown:
    action:
      fail-observability-stack

  GrafanaProvisioningFailed:
    action:
      fail-dashboard

  SLOWithoutOwner:
    action:
      fail-governance

  alertWithoutRunbook:
    action:
      fail-readiness

  optimizationChange:
    deferredToLesson603
```

---

### 55. Criar cenários oficiais

Arquivo:

```text
contracts/observable-api-part2-scenarios.yaml
```

Cenários:

```text
trace-create-order;

trace-find-order;

trace-confirm-order;

trace-cancel-order;

trace-domain-error;

trace-repository-error;

trace-publisher-error;

trace-log-correlation;

context-propagation;

invalid-trace-header;

bounded-span-attributes;

Prometheus-target-up;

Grafana-provisioning;

RED-dashboard;

dependency-dashboard;

SLO-dashboard;

availability-SLI;

latency-SLI;

error-budget;

short-window-burn-rate;

long-window-burn-rate;

readiness-alert;

Hikari-pending-alert;

queue-saturation-alert;

database-latency-degradation;

publisher-saturation-degradation;

HTTP-error-degradation;

degradation-recovery;

runbook-navigation;

game-day-complete.
```

---

### 56. Criar matriz de testes

Arquivo:

```text
docs/OBSERVABLE_API_PART2_TEST_MATRIX.md
```

Cobertura:

- inbound trace;
- trace ID;
- span ID;
- parent-child;
- application span;
- repository span;
- publisher span;
- error span;
- attributes;
- baggage;
- context propagation;
- log correlation;
- Prometheus scrape;
- metrics names;
- buckets;
- Grafana provisioning;
- dashboard variables;
- RED;
- SLI;
- SLO;
- error budget;
- burn rate;
- alert duration;
- runbook link;
- degradation;
- recovery;
- security;
- evidence.

---

### 57. Criar troubleshooting

Arquivo:

```text
docs/OBSERVABLE_API_PART2_TROUBLESHOOTING.md
```

Inclua:

- trace não é exportado;
- collector não inicia;
- trace ID não aparece no log;
- spans não possuem parent;
- atributo cria cardinalidade;
- Prometheus target fica down;
- métrica não possui buckets;
- p95 retorna vazio;
- Grafana não provisiona dashboard;
- datasource não aparece;
- SLI inclui actuator;
- error budget fica negativo por erro de cálculo;
- alerta dispara sem tráfego;
- readiness alert gera ruído por restart;
- endpoint de degradação aparece em produção;
- game day não recupera;
- otimização da aula 603 foi antecipada.

---

### 58. Executar validação completa

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\validate-otel-collector.ps1

.\scripts\projects\observable-orders-api\validate-trace-propagation.ps1

.\scripts\projects\observable-orders-api\validate-trace-log-correlation.ps1

.\scripts\projects\observable-orders-api\validate-prometheus-scrape.ps1

.\scripts\projects\observable-orders-api\validate-grafana-provisioning.ps1

.\scripts\projects\observable-orders-api\validate-observable-dashboards.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-slis.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-slo.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-alerts.ps1

.\scripts\projects\observable-orders-api\simulate-database-latency.ps1

.\scripts\projects\observable-orders-api\simulate-publisher-saturation.ps1

.\scripts\projects\observable-orders-api\simulate-HTTP-error-rate.ps1

.\scripts\projects\observable-orders-api\simulate-readiness-failure.ps1

.\scripts\projects\observable-orders-api\validate-degradation-recovery.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-runbook.ps1

.\scripts\projects\observable-orders-api\run-observable-api-game-day.ps1

.\scripts\projects\observable-orders-api\collect-observable-api-part2-evidence.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part2-baseline.ps1

.\scripts\projects\observable-orders-api\stop-observability-stack.ps1

.\scripts\projects\observable-orders-api\stop-observable-api-dependencies.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 59. Criar gate da parte 2

O gate valida:

```text
baseline da parte 1;

tracing;

propagação;

correlação;

Prometheus;

Grafana;

dashboards;

SLIs;

SLOs;

error budget;

burn rates;

alertas;

degradação;

recovery;

runbook;

game day;

segurança;

evidence.
```

Status:

```text
PASS;

FAIL_PART1_BASELINE;

FAIL_TRACING;

FAIL_PROPAGATION;

FAIL_CORRELATION;

FAIL_PROMETHEUS;

FAIL_GRAFANA;

FAIL_DASHBOARD;

FAIL_SLI;

FAIL_SLO;

FAIL_ALERT;

FAIL_DEGRADATION;

FAIL_RECOVERY;

FAIL_RUNBOOK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 60. Coletar evidence

Arquivo:

```text
contracts/observable-api-part2-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- environment;
- release category;
- part 1 baseline status;
- tracing status;
- propagation status;
- correlation status;
- Prometheus status;
- Grafana status;
- dashboard status;
- SLI status;
- SLO status;
- error budget status;
- alert status;
- degradation status;
- recovery status;
- runbook status;
- game day status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- trace ID real persistido;
- span ID;
- request ID;
- order ID;
- customer reference;
- payload;
- baggage sensível;
- token;
- credencial;
- raw telemetry;
- profile de CPU;
- heap dump;
- otimizações da aula 603.

---

### 61. Encerrar o laboratório

Confirme:

- modos de degradação resetados;
- API encerrada;
- collector encerrado;
- Prometheus encerrado;
- Grafana encerrado;
- PostgreSQL encerrado;
- fila em estado conhecido;
- nenhuma task residual;
- nenhuma série de alta cardinalidade criada;
- nenhum dashboard com segredo;
- raw telemetry fora do Git;
- evidence sanitizada;
- baseline da parte 2 aprovada.

---

## Entendendo o que foi feito

### A request ganhou trace

A jornada passou a ter spans e relações parent-child.

### Logs ganharam navegação

Trace ID e span ID passaram a ligar eventos ao trace.

### Métricas ganharam contexto operacional

RED, dependências e release passaram a orientar perguntas.

### Prometheus ganhou contrato

Scrape, nomes, labels e buckets passaram a ser validados.

### Grafana ganhou propósito

Painéis foram criados para responder perguntas específicas.

### SLI ganhou elegibilidade

Requests relevantes passaram a ser diferenciadas de actuator e testes.

### SLO ganhou owner

O objetivo deixou de ser apenas uma linha no dashboard.

### Error budget ganhou velocidade

Burn rate passou a indicar urgência.

### Alertas ganharam runbook

Cada alerta passou a apontar para investigação e recovery.

### Degradação ganhou segurança

Falhas sintéticas ficaram restritas ao perfil de laboratório.

### O projeto ganhou game day

A equipe passou a validar se os sinais realmente conduzem ao diagnóstico.

### A próxima parte ganhou fronteira

Mudanças de performance e tuning ficam para a aula 603.

---

## Erros comuns importantes

### Criar spans demais

Volume e custo aumentam sem melhorar o diagnóstico.

### Usar IDs como atributos indexados

A cardinalidade do backend cresce.

### Colocar dados sensíveis no baggage

O dado é propagado entre componentes.

### Exibir gráficos sem pergunta

O dashboard vira decoração.

### Calcular p95 sem histogram

O resultado fica ausente ou incorreto.

### Incluir actuator no SLI principal

Health checks podem distorcer a disponibilidade percebida pelo usuário.

### Criar alerta sem duração

Picos curtos geram ruído.

### Criar alerta sem runbook

O operador recebe sintoma sem caminho de ação.

### Expor endpoint de degradação

A produção pode ser alterada por um mecanismo de laboratório.

### Otimizar durante a coleta

A baseline deixa de representar o comportamento original.

---

## Comandos úteis

### Subir stack de observabilidade

```powershell
.\scripts\projects\observable-orders-api\start-observability-stack.ps1
```

### Validar tracing

```powershell
.\scripts\projects\observable-orders-api\validate-trace-propagation.ps1
```

### Validar dashboards

```powershell
.\scripts\projects\observable-orders-api\validate-observable-dashboards.ps1
```

### Validar alertas

```powershell
.\scripts\projects\observable-orders-api\validate-observable-api-alerts.ps1
```

### Executar game day

```powershell
.\scripts\projects\observable-orders-api\run-observable-api-game-day.ps1
```

---

## Exercício guiado

### Parte 1 — Tracing

Adicione spans inbound, application, repository e publisher.

### Parte 2 — Propagação

Valide parent-child e headers W3C.

### Parte 3 — Correlação

Inclua trace ID e span ID nos logs.

### Parte 4 — Prometheus

Valide scrape, métricas e buckets.

### Parte 5 — Grafana

Provision dashboards operacionais.

### Parte 6 — SLI e SLO

Defina elegibilidade, objetivos e error budget.

### Parte 7 — Alertas

Crie burn rate, readiness, pool e fila.

### Parte 8 — Degradação

Execute falhas controladas em perfil lab.

### Parte 9 — Runbook

Navegue do alerta ao trace e ao log.

### Parte 10 — Gate

Valide recovery, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 601 e ponte para a aula 603 foram preservadas;
- a baseline funcional da parte 1 continua aprovada;
- dependências de tracing são compatíveis com o Spring Boot utilizado;
- tracing inbound, application, repository e publisher foi criado;
- nomes de observations e spans são estáveis;
- atributos possuem cardinalidade bounded;
- IDs de negócio, payloads e parâmetros não entram nos spans;
- propagação W3C foi validada;
- parent-child foi preservado;
- trace ID e span ID aparecem em logs estruturados;
- trace ID não foi usado como label de métrica;
- OpenTelemetry Collector foi configurado;
- Prometheus coleta métricas da API;
- Grafana provisiona datasource e dashboards;
- dashboards overview, HTTP, dependencies e SLO foram criados;
- painéis possuem título, unidade, descrição e pergunta operacional;
- métricas RED foram aplicadas;
- rotas HTTP são normalizadas;
- SLI de disponibilidade possui elegibilidade explícita;
- SLI de latência usa histogramas;
- SLOs possuem objetivo, janela, owner e revisão;
- error budget e burn rate foram calculados;
- alertas possuem owner, duração, runbook e recovery condition;
- alertas de disponibilidade, latência, readiness, Hikari e fila foram definidos;
- modos de degradação existem apenas no perfil lab;
- latência, falha e saturação sintéticas foram observadas;
- recovery foi validada após reset;
- runbook permite navegar de alerta para dashboard, trace e log;
- game day foi executado;
- policies de segurança, qualidade e failure foram criadas;
- matriz, troubleshooting, gate e evidence estão presentes;
- nenhum trace ID, span ID, payload, segredo ou raw telemetry foi commitado;
- nenhuma otimização de CPU, memória, query, pool ou GC foi executada;
- a aula 603 não foi antecipada;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api `
  scripts/projects/observable-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestId|traceIdValue|spanIdValue|rawTelemetry|rawProfile|heapDump|productionDegradationEndpoint"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): integrar API observavel parte 2"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- `.env`;
- IDs reais;
- payloads;
- baggage sensível;
- raw traces;
- raw logs;
- profiles;
- dumps;
- resultados temporários;
- otimizações da aula 603.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou a API instrumentada em uma aplicação operacionalmente navegável.

Você integrou:

```text
OpenTelemetry;

spans;

propagação W3C;

trace ID;

span ID;

logs correlacionados;

Prometheus;

Grafana;

RED;

dashboards;

SLIs;

SLOs;

error budget;

burn rate;

alertas;

degradação controlada;

recovery;

runbook;

game day.
```

Você comprovou que um alerta precisa apontar para um dashboard; que o dashboard precisa orientar a escolha do trace; que o trace precisa revelar o span lento ou falho; que os logs precisam carregar o mesmo contexto; que métricas dependem de labels bounded e buckets corretos; que SLO exige elegibilidade e owner; que alertas precisam de duração, impacto e runbook; e que falhas sintéticas devem existir apenas em ambiente controlado.

A próxima aula será:

```text
603 - M18.48 - Projeto API observavel parte 3 otimizacao
```

Nela, você irá usar a baseline integrada para executar carga, profiling, análise de CPU, memória, banco, filas, pools e latência, selecionar gargalos com evidência, aplicar otimizações bounded e comprovar os resultados com regressão before/after.

Nenhuma otimização de query, pool, CPU, heap, GC, fila, serialização, logging, algoritmo ou concorrência foi aplicada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei tracing e propagação.
- [ ] Correlacionei traces e logs.
- [ ] Validei Prometheus.
- [ ] Provisionei Grafana.
- [ ] Criei dashboards operacionais.
- [ ] Defini SLI, SLO e error budget.
- [ ] Criei alertas com runbook.
- [ ] Executei degradação e recovery controladas.

---

## Troubleshooting adicional

### Trace não chega ao collector

Confirme endpoint OTLP, protocolo, porta e configuração da aplicação.

### Spans não formam hierarquia

Revise propagação, escopo e executors customizados.

### Trace ID não aparece no log

Valide bridge, MDC e configuração do encoder.

### Prometheus não coleta

Confirme target, path, rede e exposição do actuator.

### p95 está vazio

Valide histogram buckets e tráfego suficiente.

### Dashboard não aparece

Revise provisioning, path e permissões do Grafana.

### Alerta dispara sem tráfego

Proteja divisões e use volume mínimo.

### SLI inclui health checks

Ajuste a elegibilidade das requests.

### Endpoint lab aparece em produção

Confirme `@Profile("lab")` e pipeline de configuração.

### O projeto começou a alterar pool ou query

Preserve otimização para a aula 603.

---

## Perguntas de revisão

1. O que é um trace?
2. O que é um span?
3. Qual diferença entre trace ID e span ID?
4. O que é context propagation?
5. O que é baggage?
6. Por que atributos precisam ser bounded?
7. Como logs e traces são correlacionados?
8. O que significa RED?
9. O que significa USE?
10. O que é exemplar?
11. O que é SLI?
12. O que é SLO?
13. O que é error budget?
14. O que é burn rate?
15. Por que SLI precisa de elegibilidade?
16. Por que alerta precisa de duração?
17. Por que alerta precisa de runbook?
18. Por que degradação deve ficar no profile lab?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Jornada composta por spans.
2. Unidade de trabalho do trace.
3. Jornada completa versus operação individual.
4. Transporte de contexto.
5. Contexto propagado com forte restrição.
6. Evitar explosão de cardinalidade e custo.
7. Por trace ID e span ID.
8. Rate, Errors e Duration.
9. Utilization, Saturation e Errors.
10. Ligação entre métrica e trace.
11. Indicador medido.
12. Objetivo do indicador.
13. Falha permitida pelo objetivo.
14. Velocidade de consumo do orçamento.
15. Definir quais eventos contam.
16. Evitar ruído por picos.
17. Orientar investigação e recovery.
18. Impedir alteração sintética em produção.
19. Projeto API observável parte 3 otimização.
20. Projeto API observável parte 3 otimização.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 602 - M18.47 - Projeto API observavel parte 2

- Continuei sobre a baseline da parte 1.
- Adicionei Micrometer Tracing com bridge OpenTelemetry.
- Criei spans de aplicação, repository e publisher.
- Validei propagação W3C e relações parent-child.
- Correlacionei trace ID e span ID com logs estruturados.
- Mantive atributos e labels bounded.
- Configurei OpenTelemetry Collector.
- Adicionei Prometheus e validei o scrape.
- Provisionei Grafana e dashboards operacionais.
- Apliquei métricas RED e contexto de dependências.
- Defini SLIs de disponibilidade e latência.
- Criei SLOs com janela, owner e error budget.
- Modelei burn rates e alertas com runbooks.
- Criei modos de degradação exclusivos do profile lab.
- Simulei latência de banco, saturação da fila e erros HTTP.
- Validei recovery e readiness.
- Criei runbook específico da API.
- Executei game day navegando de alerta para dashboard, trace e log.
- Coletei evidence sanitizada.
- Não apliquei otimizações.
- Próxima aula: Projeto API observável parte 3 otimização.
```

---

## Referência técnica curta

- OpenTelemetry.
- Micrometer Tracing.
- W3C Trace Context.
- Prometheus.
- Grafana provisioning.
- RED method.
- SLIs and SLOs.
- Error budgets.
- Burn-rate alerting.
- Controlled degradation.

Regra final:

```text
a segunda parte da API observável precisa conectar sinais em um fluxo operacional navegável: requests geram traces com spans inbound, application, repository e publisher, propagação W3C preserva parent-child, logs incluem trace ID e span ID sem transformar esses valores em labels, e atributos, baggage, métricas e dashboards respeitam cardinalidade, segurança e contratos estáveis; Prometheus coleta histogramas e métricas RED, Grafana apresenta overview, HTTP, dependências e SLOs, SLIs definem elegibilidade, SLOs possuem janela e owner, error budgets produzem burn rates e alertas incluem duração, impacto, dashboard, runbook e condição de recovery; degradações de banco, publisher, erro HTTP e readiness existem somente no profile lab, game days comprovam a navegação de alerta para dashboard, exemplar, trace e log, e a baseline termina recuperada, sem tasks residuais, segredos ou raw telemetry versionada; toda alteração de query, pool, CPU, memória, GC, fila, serialização, logging, algoritmo ou concorrência permanece reservada à aula 603.
```
