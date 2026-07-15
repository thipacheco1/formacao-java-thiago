# 686 - M20.16 - Implementacao observabilidade

## Apresentação da aula

Na aula 685, você implementou a mensageria do OrderFlow.

O fluxo assíncrono passou a possuir:

- contratos de mensagens;
- envelopes versionados;
- topics;
- message keys;
- Transactional Outbox;
- Outbox Publisher;
- producers;
- consumers;
- Inbox;
- ordering por pedido;
- retry topics;
- Dead Letter Queue;
- replay controlado;
- Integration Gateway conectado por Kafka;
- Orchestration Worker;
- Projection Worker;
- testes com broker real;
- testes de duplicidade;
- testes de retry;
- testes de DLQ;
- testes de replay.

O sistema já executa uma jornada distribuída.

Uma única operação pode atravessar:

```text
client;

API;

application handler;

PostgreSQL;

Outbox;

Outbox Publisher;

Kafka;

Integration Gateway;

provider externo;

Kafka novamente;

Orchestration Worker;

aggregate;

projection.
```

Sem observabilidade, uma falha nessa jornada se transforma em perguntas difíceis:

- o request chegou?
- qual tenant executou a ação?
- a idempotency key foi adquirida?
- o aggregate foi salvo?
- o evento entrou na Outbox?
- quanto tempo ficou pendente?
- a mensagem foi publicada?
- qual partition recebeu?
- o consumer processou?
- houve retry?
- foi para DLQ?
- o provider respondeu?
- o timeout foi ambíguo?
- a projection está atrasada?
- qual componente precisa de intervenção?

Logs isolados não respondem tudo.

Métricas isoladas também não.

Traces isolados mostram uma execução, mas não mostram tendência.

Uma implementação profissional combina:

```text
logs;

metrics;

traces;

events;

dashboards;

SLOs;

alerts;

runbooks.
```

Nesta aula, você implementará a observabilidade do OrderFlow.

O foco será:

- telemetria padronizada;
- OpenTelemetry;
- Micrometer;
- Spring Boot Actuator;
- logs estruturados;
- correlation ID;
- trace context;
- propagação HTTP;
- propagação Kafka;
- spans de banco e provider;
- métricas técnicas;
- métricas de jornada;
- controle de cardinalidade;
- dashboards;
- SLOs;
- error budget;
- alertas por burn rate;
- runbooks;
- testes de telemetria;
- evidence;
- gate.

O módulo compartilhado será:

```text
libs/orderflow-observability
```

As aplicações existentes receberão instrumentação:

- `orderflow-api`;
- `outbox-publisher`;
- `orchestration-worker`;
- `integration-gateway`;
- `projection-worker`.

O laboratório será:

```text
labs/m20/aula-686-implementacao-observabilidade/orderflow-observability
```

A próxima aula será:

```text
687 - M20.17 - Docker do projeto final
```

Na aula 687, API, PostgreSQL, Kafka, workers e componentes de observabilidade serão organizados em imagens e ambiente Docker reproduzível.

Nesta aula, nenhum `Dockerfile` final nem `compose.yaml` completo será criado.

Regra central:

```text
observabilidade
nao e quantidade de log;

e a capacidade
de explicar,
medir
e operar
o comportamento real
do sistema.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
683:
Implementacao seguranca.

684:
Implementacao integracoes.

685:
Implementacao mensageria.

686:
Implementacao observabilidade.

687:
Docker do projeto final.

688:
Kubernetes manifests finais.
```

A observabilidade precisa respeitar os boundaries já existentes.

O domínio não deve depender de:

- Micrometer;
- OpenTelemetry;
- logger;
- trace API;
- exporter;
- dashboard.

A aplicação pode definir intenção de telemetria por ports simples quando necessário.

Os adapters e módulos executáveis fazem a instrumentação técnica.

Essa separação evita:

- annotations de observabilidade no aggregate;
- logger como regra de negócio;
- métricas com entidades JPA;
- dependência do domínio em vendor;
- testes unitários dependentes de collector.

---

## Objetivo prático

Será criada a estrutura:

```text
libs/orderflow-observability
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/orderflow/observability
│   │           ├── ObservabilityConfiguration.java
│   │           ├── ObservabilityProperties.java
│   │           ├── OrderFlowMeters.java
│   │           ├── OrderFlowTracer.java
│   │           ├── OrderFlowLogContext.java
│   │           ├── TelemetryAttributes.java
│   │           ├── TelemetrySanitizer.java
│   │           ├── MessagingTelemetry.java
│   │           ├── ProviderTelemetryAdapter.java
│   │           ├── OutboxTelemetry.java
│   │           ├── ProjectionTelemetry.java
│   │           └── JourneyTelemetry.java
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/observability
│               ├── MetricCardinalityTest.java
│               ├── TracePropagationTest.java
│               ├── LogSanitizationTest.java
│               ├── OutboxTelemetryTest.java
│               ├── MessagingTelemetryTest.java
│               ├── ProviderTelemetryTest.java
│               ├── JourneyTelemetryTest.java
│               └── ObservabilityArchitectureTest.java
```

Documentação:

```text
docs/observability
├── OBSERVABILITY_CHARTER.md
├── TELEMETRY_ATTRIBUTE_CATALOG.md
├── STRUCTURED_LOGGING_POLICY.md
├── TRACE_POLICY.md
├── METRIC_CATALOG.md
├── CARDINALITY_POLICY.md
├── JOURNEY_SLO_CATALOG.md
├── ERROR_BUDGET_POLICY.md
├── ALERT_CATALOG.md
├── DASHBOARD_CATALOG.md
├── RUNBOOK_INDEX.md
├── OUTBOX_BACKLOG_RUNBOOK.md
├── CONSUMER_LAG_RUNBOOK.md
├── PROVIDER_FAILURE_RUNBOOK.md
├── DLQ_GROWTH_RUNBOOK.md
├── PROJECTION_STALENESS_RUNBOOK.md
├── OBSERVABILITY_TEST_MATRIX.md
├── OBSERVABILITY_RISK_REGISTER.md
├── OBSERVABILITY_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Configurações:

```text
observability
├── collector
│   └── otel-collector.yaml
├── prometheus
│   └── alert-rules.yaml
├── dashboards
│   ├── orderflow-overview.json
│   ├── orderflow-messaging.json
│   ├── orderflow-providers.json
│   └── orderflow-database.json
└── queries
    ├── journey-promql.md
    ├── messaging-promql.md
    └── provider-promql.md
```

---

## Conceito essencial

### Logs explicam eventos discretos

Logs são úteis para:

- mudança de estado;
- decisão de retry;
- rejeição de contrato;
- entrada em DLQ;
- conflito de versão;
- replay administrativo;
- falha de autenticação;
- início e fim de operação relevante.

### Métricas mostram tendência

Métricas respondem:

- quantos requests falham?
- qual o p95?
- qual a idade da Outbox?
- qual o consumer lag?
- quantas mensagens entram na DLQ?
- qual provider está degradado?
- qual é a taxa de replay?
- qual projection está stale?

### Traces explicam uma jornada

Trace distribui spans entre:

- HTTP;
- application;
- banco;
- Kafka;
- worker;
- provider.

O trace context precisa sobreviver ao transporte assíncrono.

### SLO transforma objetivo em operação

Exemplo:

```text
99,5% dos registros de pedido
devem ser aceitos com sucesso
em uma janela de 30 dias.
```

Outro:

```text
99% dos pedidos
devem alcançar estado operacional
em ate 60 segundos.
```

### Cardinalidade pode destruir a plataforma

Não use como label de métrica:

- order ID;
- tenant ID;
- correlation ID;
- message ID;
- operation ID;
- exception message;
- URL completa.

Esses dados pertencem a logs e traces.

---

## Mão na massa guiada

### 1. Configurar o módulo

No `libs/orderflow-observability/pom.xml`, adicione dependências para:

- Micrometer Core;
- Micrometer Observation;
- OpenTelemetry API;
- OpenTelemetry SDK;
- exporter OTLP;
- Logback JSON encoder;
- JUnit 5;
- ArchUnit.

Os módulos executáveis continuarão responsáveis pelo bootstrap.

---

### 2. Criar Observability Charter

Arquivo:

```text
docs/observability/OBSERVABILITY_CHARTER.md
```

Princípios:

```text
telemetry explains user journeys;

domain remains vendor neutral;

correlation crosses every boundary;

metrics use bounded labels;

logs are structured and sanitized;

traces preserve causality;

SLOs drive alerts;

alerts require runbooks;

evidence is reproducible;

Docker packaging belongs to lesson 687.
```

---

### 3. Criar TelemetryAttributes

```java
package br.com.formacao.orderflow.observability;

public final class TelemetryAttributes {

    public static final String COMPONENT =
            "orderflow.component";

    public static final String OPERATION =
            "orderflow.operation";

    public static final String RESULT =
            "orderflow.result";

    public static final String MESSAGE_TYPE =
            "messaging.message.type";

    public static final String CONSUMER =
            "messaging.consumer.name";

    public static final String PROVIDER =
            "external.provider";

    public static final String RETRYABLE =
            "orderflow.retryable";

    public static final String TENANT_CLASS =
            "orderflow.tenant.class";

    private TelemetryAttributes() {
    }
}
```

Use nomes estáveis e documentados.

---

### 4. Criar catálogo de atributos

Arquivo:

```text
docs/observability/TELEMETRY_ATTRIBUTE_CATALOG.md
```

Para cada atributo, registre:

- nome;
- tipo;
- permitido em log;
- permitido em span;
- permitido em métrica;
- sensibilidade;
- cardinalidade;
- owner.

---

### 5. Criar ObservabilityProperties

```java
package br.com.formacao.orderflow.observability;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(
        prefix = "orderflow.observability")
public record ObservabilityProperties(
        String serviceName,
        String environment,
        String otlpEndpoint,
        double traceSampleProbability,
        boolean structuredLoggingEnabled) {
}
```

---

### 6. Configurar application.yml

Exemplo:

```yaml
orderflow:
  observability:
    service-name: ${spring.application.name}
    environment: ${ORDERFLOW_ENVIRONMENT:local}
    otlp-endpoint: ${OTEL_EXPORTER_OTLP_ENDPOINT:http://localhost:4317}
    trace-sample-probability: ${ORDERFLOW_TRACE_SAMPLE:1.0}
    structured-logging-enabled: true

management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
          - prometheus
  metrics:
    tags:
      application: ${spring.application.name}
      environment: ${ORDERFLOW_ENVIRONMENT:local}
```

Valores de produção serão definidos por ambiente.

---

## Logs estruturados

### 7. Criar Structured Logging Policy

Arquivo:

```text
docs/observability/STRUCTURED_LOGGING_POLICY.md
```

Campos mínimos:

```text
timestamp;

level;

service;

environment;

event;

message;

trace_id;

span_id;

correlation_id;

component;

operation;

result.
```

Campos condicionais:

- provider;
- message type;
- consumer;
- retry attempt;
- circuit state;
- safe error code.

---

### 8. Criar OrderFlowLogContext

```java
package br.com.formacao.orderflow.observability;

import java.util.Map;
import org.slf4j.MDC;

public final class OrderFlowLogContext {

    public AutoCloseable open(
            Map<String, String> values) {

        Map<String, String> previous =
                MDC.getCopyOfContextMap();

        values.forEach(MDC::put);

        return () -> {
            MDC.clear();

            if (previous != null) {
                MDC.setContextMap(previous);
            }
        };
    }
}
```

Sempre limpe o MDC.

Isso é obrigatório em threads reutilizadas.

---

### 9. Criar TelemetrySanitizer

Bloqueie:

- authorization;
- bearer token;
- access token;
- refresh token;
- client secret;
- private key;
- full payment payload;
- raw provider response;
- stack trace em resposta.

O sanitizer também limita tamanho de valores.

---

### 10. Definir eventos de log

Use nomes estáveis:

```text
order.register.accepted;

order.transition.completed;

outbox.batch.claimed;

outbox.message.published;

consumer.message.duplicate;

consumer.message.failed;

provider.call.completed;

provider.call.ambiguous;

DLQ.message.created;

replay.completed;

projection.gap.detected.
```

---

### 11. Evitar logs duplicados

Não registre a mesma exception em todas as camadas.

A boundary responsável registra:

- contexto;
- decisão;
- resultado.

A exception continua sendo propagada quando necessário.

---

## Traces distribuídos

### 12. Criar Trace Policy

Arquivo:

```text
docs/observability/TRACE_POLICY.md
```

Spans obrigatórios:

- HTTP request;
- application use case;
- transaction;
- Outbox claim;
- Kafka produce;
- Kafka consume;
- Inbox acquire;
- provider call;
- projection update;
- replay operation.

---

### 13. Usar propagação W3C

Propague:

```text
traceparent;

tracestate.
```

Em HTTP, use headers padrão.

Em Kafka, use message headers.

Correlation ID continua como atributo de negócio operacional, não substitui trace ID.

---

### 14. Criar OrderFlowTracer

```java
package br.com.formacao.orderflow.observability;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

public final class OrderFlowTracer {

    private final Tracer tracer;

    public OrderFlowTracer(Tracer tracer) {
        this.tracer = tracer;
    }

    public Span start(
            String name) {

        return tracer
                .spanBuilder(name)
                .startSpan();
    }
}
```

No código completo, use scopes seguros com `try-with-resources`.

---

### 15. Nomear spans por operação

Bom:

```text
orderflow.register_order;

orderflow.publish_outbox;

orderflow.consume_integration_result;

orderflow.call_payment_provider.
```

Ruim:

```text
POST /v1/orders/123e4567.
```

Não coloque IDs no nome.

---

### 16. Instrumentar API

O span HTTP recebe:

- route;
- method;
- status;
- error type;
- authenticated token type;
- operation.

Não coloque JWT nem tenant ID bruto.

---

### 17. Instrumentar Kafka

Producer span:

- topic;
- message type;
- partition quando disponível;
- result.

Consumer span:

- topic;
- consumer group;
- message type;
- processing result;
- retry count.

---

### 18. Preservar trace em retry e DLQ

Retry preserva contexto original e pode criar um novo span ligado ao anterior.

DLQ registra link para o trace causador quando possível.

Replay cria novo trace e mantém referência à mensagem original.

---

### 19. Instrumentar providers

Span externo:

- provider;
- operation;
- HTTP status;
- normalized result;
- retry count;
- circuit state;
- timeout;
- duration.

Não inclua body ou token.

---

## Métricas

### 20. Criar Metric Catalog

Arquivo:

```text
docs/observability/METRIC_CATALOG.md
```

Para cada métrica, registre:

- nome;
- tipo;
- unidade;
- labels;
- propósito;
- owner;
- dashboard;
- alerta;
- retenção.

---

### 21. Criar OrderFlowMeters

```java
package br.com.formacao.orderflow.observability;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

public final class OrderFlowMeters {

    private final MeterRegistry registry;

    public OrderFlowMeters(
            MeterRegistry registry) {

        this.registry = registry;
    }

    public Timer useCaseTimer(
            String operation,
            String result) {

        return Timer.builder(
                        "orderflow.usecase.duration")
                .tag("operation", operation)
                .tag("result", result)
                .publishPercentileHistogram()
                .register(registry);
    }

    public void count(
            String metric,
            String result) {

        registry.counter(
                        metric,
                        "result",
                        result)
                .increment();
    }
}
```

---

### 22. Criar Cardinality Policy

Arquivo:

```text
docs/observability/CARDINALITY_POLICY.md
```

Labels permitidas:

- service;
- environment;
- operation;
- result;
- message type;
- provider;
- consumer;
- error category;
- circuit state.

Labels proibidas:

- order ID;
- tenant ID;
- message ID;
- correlation ID;
- raw path;
- exception message.

---

### 23. Criar MetricCardinalityTest

O teste inspeciona meters registrados.

Ele falha quando uma label proibida aparece.

Esse teste protege custo e estabilidade.

---

### 24. Medir API

Métricas:

```text
orderflow.api.requests;

orderflow.api.request.duration;

orderflow.api.authentication.failures;

orderflow.api.authorization.denials;

orderflow.api.idempotency.replays;

orderflow.api.idempotency.conflicts.
```

---

### 25. Medir Outbox

Métricas:

```text
orderflow.outbox.pending;

orderflow.outbox.oldest.age;

orderflow.outbox.publish.duration;

orderflow.outbox.publish.failures;

orderflow.outbox.batch.size;

orderflow.outbox.lease.recoveries.
```

A idade do evento mais antigo é mais útil que apenas a contagem.

---

### 26. Medir Kafka e consumers

Métricas:

```text
orderflow.messaging.consumed;

orderflow.messaging.processing.duration;

orderflow.messaging.duplicates;

orderflow.messaging.retries;

orderflow.messaging.DLQ;

orderflow.messaging.consumer.lag;

orderflow.messaging.schema.failures.
```

---

### 27. Medir providers

Métricas:

```text
orderflow.provider.calls;

orderflow.provider.duration;

orderflow.provider.failures;

orderflow.provider.ambiguous;

orderflow.provider.retries;

orderflow.provider.circuit.open;

orderflow.provider.rate.limited.
```

Labels:

- provider;
- operation;
- result.

---

### 28. Medir projection

Métricas:

```text
orderflow.projection.lag;

orderflow.projection.freshness.age;

orderflow.projection.gaps;

orderflow.projection.duplicates;

orderflow.projection.rebuild.progress.
```

---

### 29. Medir jornada

Métricas de negócio operacional:

```text
orderflow.journey.started;

orderflow.journey.completed;

orderflow.journey.failed;

orderflow.journey.reconciliation;

orderflow.journey.compensating;

orderflow.journey.duration.
```

Não use tenant como label.

---

## OpenTelemetry Collector

### 30. Criar configuração do collector

Arquivo:

```text
observability/collector/otel-collector.yaml
```

Pipelines:

```text
traces:
OTLP receiver
-> memory limiter
-> batch
-> trace exporter.

metrics:
OTLP receiver
-> memory limiter
-> batch
-> metrics exporter.

logs:
OTLP receiver
-> batch
-> log exporter.
```

A aula 687 conectará esses componentes em Docker.

---

### 31. Configurar sampling

Local:

```text
100%.
```

Produção:

- parent-based;
- probabilístico;
- retenção maior para erros;
- tail sampling quando disponível.

Sampling nunca altera métricas.

---

## SLOs e error budget

### 32. Criar Journey SLO Catalog

Arquivo:

```text
docs/observability/JOURNEY_SLO_CATALOG.md
```

SLO-API-01:

```text
99,5% dos requests validos
de registro
sem erro interno
em 30 dias.
```

SLO-API-02:

```text
95% dos registros
respondem em ate 500ms.
```

SLO-ASYNC-01:

```text
99% das jornadas
alcancam estado terminal
ou reconciliation
em ate 60s.
```

SLO-OUTBOX-01:

```text
99,9% dos eventos
sao publicados
em ate 10s.
```

SLO-PROJECTION-01:

```text
99% das projections
possuem freshness
inferior a 15s.
```

---

### 33. Definir indicadores

Cada SLO precisa de SLI mensurável.

Exemplo:

```text
good events:
outbox event published
within 10 seconds.

total events:
all publishable outbox events.
```

---

### 34. Criar Error Budget Policy

Arquivo:

```text
docs/observability/ERROR_BUDGET_POLICY.md
```

Quando o budget é consumido rapidamente:

- reduzir mudança arriscada;
- priorizar confiabilidade;
- revisar incidentes;
- corrigir gargalos;
- validar capacidade;
- revisar dependências.

---

### 35. Criar queries PromQL

Exemplo de taxa de erro:

```promql
sum(rate(orderflow_api_requests_total{result="error"}[5m]))
/
sum(rate(orderflow_api_requests_total[5m]))
```

Exemplo de Outbox atrasada:

```promql
max(orderflow_outbox_oldest_age_seconds)
```

Exemplo de DLQ:

```promql
sum(increase(orderflow_messaging_dlq_total[15m]))
```

---

## Dashboards

### 36. Criar Dashboard Catalog

Arquivo:

```text
docs/observability/DASHBOARD_CATALOG.md
```

Dashboards:

```text
OrderFlow Overview;

API and Security;

Outbox and Kafka;

Provider Integrations;

Projection Freshness;

Database Health;

Journey Reliability.
```

---

### 37. Criar dashboard geral

Painéis:

- request rate;
- error rate;
- p95 latency;
- journeys started;
- journeys completed;
- reconciliation rate;
- Outbox age;
- consumer lag;
- provider failures;
- DLQ growth;
- projection freshness.

---

### 38. Criar dashboard de mensageria

Painéis:

- Outbox pending;
- oldest age;
- publish throughput;
- publish failures;
- consumer throughput;
- lag por consumer;
- duplicate count;
- retry count;
- DLQ count;
- replay count.

---

### 39. Criar dashboard de providers

Painéis por provider:

- calls;
- p50;
- p95;
- p99;
- success;
- rejection;
- unavailable;
- ambiguous;
- retry;
- circuit state;
- rate limit.

---

### 40. Evitar dashboards decorativos

Cada painel precisa responder:

- qual decisão operacional depende dele?
- qual owner age?
- qual limite é esperado?
- qual runbook corresponde?

---

## Alertas

### 41. Criar Alert Catalog

Arquivo:

```text
docs/observability/ALERT_CATALOG.md
```

Alertas:

- API error budget burn;
- API latency burn;
- Outbox oldest age;
- Outbox publish failures;
- consumer lag;
- DLQ growth;
- provider unavailable;
- circuit open;
- projection stale;
- database connection saturation.

---

### 42. Usar burn rate

Em vez de alertar por um erro isolado, alerte quando o SLO está sendo consumido rapidamente.

Use janelas:

- curta para detecção;
- longa para confirmação.

---

### 43. Criar regras de alerta

Arquivo:

```text
observability/prometheus/alert-rules.yaml
```

Exemplo:

```yaml
groups:
  - name: orderflow
    rules:
      - alert: OrderFlowOutboxDelayed
        expr: orderflow_outbox_oldest_age_seconds > 30
        for: 5m
        labels:
          severity: warning
          service: outbox-publisher
        annotations:
          summary: OrderFlow Outbox is delayed
          runbook: OUTBOX_BACKLOG_RUNBOOK
```

---

### 44. Evitar alerta sem ação

Todo alerta precisa de:

- owner;
- severity;
- threshold;
- duration;
- runbook;
- suppression rule;
- recovery signal.

---

## Runbooks

### 45. Criar Runbook Index

Arquivo:

```text
docs/observability/RUNBOOK_INDEX.md
```

Links para:

- Outbox backlog;
- consumer lag;
- provider failure;
- DLQ growth;
- projection staleness;
- database saturation;
- security denial spike.

---

### 46. Criar Outbox Backlog Runbook

Passos:

1. confirmar idade;
2. verificar publisher;
3. verificar broker;
4. verificar lease;
5. verificar falhas;
6. validar volume;
7. recuperar publisher;
8. acompanhar redução;
9. registrar incidente.

---

### 47. Criar Consumer Lag Runbook

Passos:

- identificar consumer group;
- identificar partitions;
- validar erro;
- validar poison message;
- verificar retry;
- avaliar capacidade;
- escalar workers;
- confirmar redução;
- revisar ordering.

A aula 687 preparará a execução local dos componentes, mas o runbook já deve ser independente de plataforma.

---

### 48. Criar Provider Failure Runbook

Distinguir:

- autenticação;
- rate limit;
- timeout;
- contract drift;
- indisponibilidade;
- circuit open;
- resultado ambíguo.

Nunca sugerir retry manual sem validar idempotência.

---

### 49. Criar DLQ Growth Runbook

O operador precisa:

- classificar mensagens;
- confirmar owner;
- verificar schema;
- verificar estado atual;
- definir replay seguro;
- executar dry run;
- auditar replay;
- acompanhar resultados.

---

### 50. Criar Projection Staleness Runbook

Passos:

- medir freshness;
- verificar lag;
- verificar gaps;
- verificar Inbox;
- validar projection store;
- usar rebuild shadow quando necessário;
- nunca tornar projection autoridade.

---

## Testes de observabilidade

### 51. Testar logs estruturados

Valide:

- JSON válido;
- event name;
- service;
- correlation;
- trace ID;
- result;
- sem token;
- sem secret;
- sem payload sensível.

---

### 52. Testar propagação HTTP

Request com `traceparent` deve continuar no span do controller.

Response preserva correlation ID.

---

### 53. Testar propagação Kafka

Producer injeta trace context nos headers.

Consumer extrai contexto e cria child span ou linked span conforme policy.

---

### 54. Testar Outbox telemetry

Cenários:

- batch claimed;
- published;
- failed;
- lease recovered;
- oldest age;
- backlog count.

---

### 55. Testar provider telemetry

Cenários:

- success;
- rejection;
- unavailable;
- ambiguous;
- retry;
- circuit open.

Valide labels limitadas.

---

### 56. Testar JourneyTelemetry

Fluxo:

- order registered;
- stock reserved;
- payment authorized;
- fulfillment completed.

Valide duração e resultado final.

---

### 57. Testar erro de jornada

Fluxo:

- pagamento recusado;
- compensação;
- cancelamento.

Valide:

```text
result:
compensated.
```

Não classifique automaticamente como erro técnico.

---

### 58. Testar cardinalidade

Gere centenas de pedidos.

Confirme que o número de séries não cresce por order ID ou tenant ID.

---

### 59. Testar alerta

Alimente métrica de Outbox acima do limite.

Valide que a regra entra em `firing` somente após a duração definida.

---

### 60. Testar trace ponta a ponta

Fluxo:

```text
HTTP;

application;

database;

Outbox;

Kafka;

Gateway;

provider;

Kafka;

orchestration;

projection.
```

Valide correlation e causalidade.

---

## Arquitetura e qualidade

### 61. Criar ObservabilityArchitectureTest

Regras:

- domínio não depende de observability;
- application não depende de OpenTelemetry;
- exporters ficam em módulo técnico;
- métricas não usam labels proibidas;
- logs não usam tokens;
- controllers não constroem exporter;
- consumers usam instrumentation compartilhada;
- Docker final não existe nesta aula.

---

### 62. Criar Observability Test Matrix

Arquivo:

```text
docs/observability/OBSERVABILITY_TEST_MATRIX.md
```

Categorias:

- logs;
- traces;
- metrics;
- cardinality;
- API;
- Outbox;
- Kafka;
- providers;
- projection;
- SLO;
- alerts;
- runbooks;
- security.

---

### 63. Criar Risk Register

Arquivo:

```text
docs/observability/OBSERVABILITY_RISK_REGISTER.md
```

Riscos:

```text
token em log;

cardinalidade explosiva;

sampling escondendo falha;

trace quebrado no Kafka;

alerta sem runbook;

dashboard sem owner;

SLO sem indicador;

métrica com unidade incorreta;

log duplicado;

correlation ausente;

tenant em label;

collector indisponivel.
```

---

### 64. Criar Traceability

Arquivo:

```text
docs/observability/OBSERVABILITY_TRACEABILITY.md
```

Exemplo:

```text
ADR-010 OpenTelemetry
-> OrderFlowTracer
-> W3C propagation
-> TracePropagationTest.

ADR-003 Outbox
-> outbox oldest age
-> Outbox dashboard
-> Outbox delayed alert
-> backlog runbook.

SLO-ASYNC-01
-> journey duration metric
-> overview dashboard
-> burn rate alert.
```

---

### 65. Criar boundary da próxima aula

Arquivo:

```text
docs/observability/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 686 define:

- logs;
- metrics;
- traces;
- OpenTelemetry;
- Micrometer;
- dashboards;
- SLOs;
- alerts;
- runbooks;
- telemetry tests.

A aula 687 define:

- Dockerfiles;
- runtime users;
- image layers;
- health checks;
- compose;
- networks;
- volumes;
- resource limits;
- startup order;
- local observability stack.

Nenhum Dockerfile final
ou compose completo
e criado nesta aula.
```

---

### 66. Executar testes do módulo

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-observability `
  -am `
  clean `
  test
```

---

### 67. Executar testes das aplicações

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api,
  apps/outbox-publisher,
  apps/orchestration-worker,
  apps/integration-gateway,
  apps/projection-worker `
  -am `
  test
```

---

### 68. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

---

### 69. Validar configuração externa

Confirme:

- endpoint OTLP vem do ambiente;
- sample rate vem do ambiente;
- exporter pode ser desativado;
- nenhuma credencial está no YAML;
- logs são sanitizados;
- métricas possuem labels limitadas;
- dashboards não possuem datasource real embutido.

---

### 70. Criar report

Arquivo:

```text
reports/observability-implementation-report.yaml
```

Exemplo:

```yaml
observabilityImplementation:
  signals:
    logs:
      structured:
        true
    metrics:
      total:
        31
    traces:
      distributed:
        true

  propagation:
    HTTP:
      PASS
    Kafka:
      PASS
    provider:
      PASS

  SLOs:
    total:
      5

  dashboards:
    total:
      4

  alerts:
    total:
      10

  runbooks:
    total:
      5

  tests:
    unit:
      17
    integration:
      9
    architecture:
      1
    failures:
      0

  Docker:
    implemented:
      false

  gate:
    PASS
```

---

### 71. Criar evidence

Arquivo:

```text
contracts/observability-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- structured log status;
- metric count;
- trace propagation HTTP status;
- trace propagation Kafka status;
- provider trace status;
- forbidden label count;
- token leak count;
- SLO count;
- dashboard count;
- alert count;
- runbook count;
- Outbox metric status;
- consumer lag metric status;
- provider metric status;
- projection freshness status;
- journey metric status;
- alert test status;
- architecture test status;
- Docker implemented;
- documentation status;
- gate status;
- timestamp.

---

### 72. Criar gate de observabilidade

Status:

```text
PASS;

FAIL_OBSERVABILITY_MODULE;

FAIL_STRUCTURED_LOG;

FAIL_LOG_SANITIZATION;

FAIL_TRACE_CONFIGURATION;

FAIL_HTTP_PROPAGATION;

FAIL_KAFKA_PROPAGATION;

FAIL_PROVIDER_TRACE;

FAIL_METRIC_CATALOG;

FAIL_CARDINALITY;

FAIL_OUTBOX_METRIC;

FAIL_CONSUMER_METRIC;

FAIL_PROVIDER_METRIC;

FAIL_PROJECTION_METRIC;

FAIL_JOURNEY_METRIC;

FAIL_SLO;

FAIL_ERROR_BUDGET;

FAIL_DASHBOARD;

FAIL_ALERT;

FAIL_RUNBOOK;

FAIL_TELEMETRY_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_DOCKER_ANTICIPATION;

INCONCLUSIVE.
```

---

### 73. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Confirme:

- logs estruturados;
- token ausente dos logs;
- traces HTTP e Kafka;
- metrics limitadas;
- Outbox monitorada;
- lag monitorado;
- providers monitorados;
- projection monitorada;
- jornada monitorada;
- SLOs definidos;
- alertas ligados a runbooks;
- Docker não implementado.

---

### 74. Encerrar o laboratório

Confirme:

- module POM;
- properties;
- attributes;
- sanitizer;
- structured logs;
- W3C propagation;
- HTTP spans;
- Kafka spans;
- provider spans;
- metric catalog;
- cardinality policy;
- API metrics;
- Outbox metrics;
- messaging metrics;
- provider metrics;
- projection metrics;
- journey metrics;
- collector config;
- SLOs;
- error budget;
- PromQL;
- dashboards;
- alerts;
- runbooks;
- tests;
- architecture test;
- report;
- evidence;
- gate aprovado;
- Docker não implementado.

---

## Entendendo o que foi feito

### A jornada ficou explicável

Correlation e trace context atravessam componentes síncronos e assíncronos.

### Falhas viraram sinais

Outbox atrasada, lag, DLQ, provider ambíguo e projection stale possuem métricas.

### Métricas ficaram controladas

Labels de alta cardinalidade foram proibidas.

### SLOs criaram objetivos operacionais

Disponibilidade, latência, publicação e freshness passaram a ser medidos.

### Alertas ganharam contexto

Cada alerta possui owner e runbook.

### O domínio permaneceu puro

Nenhuma biblioteca de observabilidade entrou no modelo.

### O projeto ficou defensável

A arquitetura agora possui evidências de funcionamento e operação.

---

## Erros comuns importantes

### Logar tudo

Volume não substitui qualidade.

### Usar order ID como label

Cardinalidade cresce sem limite.

### Usar correlation como trace

Correlation não possui árvore de spans.

### Alerta sem duração

Ruído aparece por picos curtos.

### Dashboard sem decisão

Painel decorativo não ajuda operação.

### SLO sem SLI

Objetivo não pode ser medido.

### Sampling em métricas

Métricas precisam representar todo o fluxo.

### Token no log

Credencial pode ser reutilizada.

### Trace quebrado no Kafka

A jornada distribuída fica fragmentada.

### Criar Dockerfile agora

Conteinerização pertence à aula 687.

---

## Comandos úteis

### Testar observabilidade

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-observability `
  -am `
  test
```

### Testar cardinalidade

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-observability `
  -Dtest=MetricCardinalityTest `
  test
```

### Testar propagação

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-observability `
  -Dtest=TracePropagationTest `
  test
```

### Build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

---

## Exercício guiado

Implemente a observabilidade do fluxo:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. correlation;
2. trace HTTP;
3. span do use case;
4. span de banco;
5. span da Outbox;
6. producer span;
7. consumer span;
8. provider span;
9. normalized result;
10. retry count;
11. aggregate transition;
12. compensation event;
13. projection update;
14. structured logs;
15. journey duration;
16. compensated result;
17. dashboard panel;
18. alert condition;
19. runbook;
20. cardinality test;
21. trace test;
22. evidence.

Não crie Dockerfile.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 685 e ponte para a aula 687 foram preservadas;
- módulo `orderflow-observability` foi criado;
- dependências foram configuradas;
- Observability Charter foi criado;
- TelemetryAttributes foi criado;
- catálogo de atributos foi criado;
- ObservabilityProperties foi criada;
- configuração externa foi criada;
- Structured Logging Policy foi criada;
- OrderFlowLogContext foi criado;
- TelemetrySanitizer foi criado;
- eventos de log foram definidos;
- logs duplicados foram evitados;
- Trace Policy foi criada;
- propagação W3C foi definida;
- OrderFlowTracer foi criado;
- spans possuem nomes estáveis;
- API foi instrumentada;
- Kafka foi instrumentado;
- retries e DLQ preservam causalidade;
- providers foram instrumentados;
- Metric Catalog foi criado;
- OrderFlowMeters foi criado;
- Cardinality Policy foi criada;
- Cardinality Test foi criado;
- métricas da API foram criadas;
- métricas da Outbox foram criadas;
- métricas de consumers foram criadas;
- métricas de providers foram criadas;
- métricas de projection foram criadas;
- métricas de jornada foram criadas;
- configuração do collector foi criada;
- sampling foi definido;
- Journey SLO Catalog foi criado;
- indicadores foram definidos;
- Error Budget Policy foi criada;
- queries PromQL foram criadas;
- Dashboard Catalog foi criado;
- dashboard geral foi criado;
- dashboard de mensageria foi criado;
- dashboard de providers foi criado;
- painéis decorativos foram evitados;
- Alert Catalog foi criado;
- burn rate foi usado;
- regras de alerta foram criadas;
- alertas possuem ação;
- Runbook Index foi criado;
- runbook de Outbox foi criado;
- runbook de consumer lag foi criado;
- runbook de provider foi criado;
- runbook de DLQ foi criado;
- runbook de projection foi criado;
- logs estruturados foram testados;
- propagação HTTP foi testada;
- propagação Kafka foi testada;
- Outbox telemetry foi testada;
- provider telemetry foi testada;
- JourneyTelemetry foi testada;
- compensação foi testada;
- cardinalidade foi testada;
- alerta foi testado;
- trace ponta a ponta foi testado;
- teste arquitetural foi criado;
- Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 687 foi criado;
- build do módulo passou;
- build das aplicações passou;
- build completo passou;
- configuração externa foi validada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- Docker não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Adicione:

```powershell
git add `
  libs/orderflow-observability `
  apps/orderflow-api `
  apps/outbox-publisher `
  apps/orchestration-worker `
  apps/integration-gateway `
  apps/projection-worker `
  docs/observability `
  observability `
  reports/observability-implementation-report.yaml `
  contracts/observability-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Authorization: Bearer|access_token|refresh_token|client_secret|private_key|tenant_id.*tag|order_id.*tag|Dockerfile|compose.yaml"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(observability): instrument OrderFlow end to end"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- token;
- secret;
- datasource real;
- Dockerfile final;
- compose completo;
- conteúdo detalhado da aula 687.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou a observabilidade do OrderFlow.

Você criou:

```text
structured logs;

telemetry attributes;

sanitization;

distributed traces;

HTTP propagation;

Kafka propagation;

provider spans;

API metrics;

Outbox metrics;

consumer metrics;

provider metrics;

projection metrics;

journey metrics;

OpenTelemetry Collector config;

SLOs;

error budgets;

PromQL;

dashboards;

alerts;

runbooks;

tests;

report, evidence e gate.
```

O projeto agora consegue explicar uma jornada desde a API até a projection.

A próxima aula será:

```text
687 - M20.17 - Docker do projeto final
```

Nela, você criará imagens para os executáveis, usuários não root, layered jars, health checks, configuração por ambiente, redes, volumes, dependências, limits e um ambiente Docker Compose reproduzível para API, PostgreSQL, Kafka, workers e stack de observabilidade.

Nenhum Dockerfile final foi criado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei logs estruturados.
- [ ] Sanitizei dados.
- [ ] Propaguei traces.
- [ ] Criei métricas.
- [ ] Protegi cardinalidade.
- [ ] Criei SLOs.
- [ ] Criei error budget.
- [ ] Criei dashboards.
- [ ] Criei alertas.
- [ ] Criei runbooks.
- [ ] Testei telemetria.
- [ ] Preservei Docker para a aula 687.

---

## Troubleshooting adicional

### Trace termina no producer

Revise headers Kafka e extração no consumer.

### Métricas explodem em séries

Remova IDs das labels.

### Correlation não aparece no log

Revise MDC e limpeza de contexto.

### Outbox possui backlog sem alerta

Revise métrica de idade e regra.

### Provider apresenta latência sem span

Instrumente o client HTTP e o normalizador.

### Alertas disparam por um pico

Adicione duração e burn rate.

### Dashboard não ajuda investigação

Ligue painéis a perguntas e runbooks.

### Log contém token

Bloqueie no sanitizer e crie teste.

### SLO não possui query

Defina good e total events.

### Quero criar compose

Essa etapa pertence à aula 687.

---

## Perguntas de revisão

1. O que é observabilidade?
2. Qual papel dos logs?
3. Qual papel das métricas?
4. Qual papel dos traces?
5. Correlation ID substitui trace ID?
6. O que é W3C trace context?
7. O que é cardinalidade?
8. Order ID pode ser label?
9. Tenant ID pode ser label?
10. O que é SLI?
11. O que é SLO?
12. O que é error budget?
13. O que é burn rate?
14. Alerta precisa de runbook?
15. O que medir na Outbox?
16. O que medir no consumer?
17. O que medir no provider?
18. O que medir na projection?
19. Sampling afeta métricas?
20. O domínio depende de OpenTelemetry?
21. O que o collector faz?
22. O que a aula 687 fará?
23. O que não foi implementado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Capacidade de explicar e operar.
2. Explicar eventos discretos.
3. Mostrar tendência.
4. Explicar jornadas.
5. Não.
6. Padrão de propagação.
7. Quantidade de combinações de labels.
8. Não.
9. Não.
10. Indicador medido.
11. Objetivo de confiabilidade.
12. Margem de falha aceitável.
13. Velocidade de consumo do budget.
14. Sim.
15. Contagem e idade.
16. Lag, duração e falhas.
17. Latência, resultado e breaker.
18. Freshness, gap e lag.
19. Não.
20. Não.
21. Receber, processar e exportar sinais.
22. Criar Docker do projeto.
23. Dockerfiles e compose.
24. Docker do projeto final.
25. Observabilidade explica comportamento real.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 686 - M20.16 - Implementacao observabilidade

- Continuei após Implementação mensageria.
- Criei o módulo `orderflow-observability`.
- Configurei dependências.
- Criei Observability Charter.
- Criei TelemetryAttributes.
- Criei catálogo de atributos.
- Criei ObservabilityProperties.
- Externalizei configuração.
- Criei Structured Logging Policy.
- Criei OrderFlowLogContext.
- Criei TelemetrySanitizer.
- Defini eventos de log.
- Evitei logs duplicados.
- Criei Trace Policy.
- Defini propagação W3C.
- Criei OrderFlowTracer.
- Padronizei nomes de spans.
- Instrumentei API.
- Instrumentei Kafka.
- Preservei causalidade em retry e DLQ.
- Instrumentei providers.
- Criei Metric Catalog.
- Criei OrderFlowMeters.
- Criei Cardinality Policy.
- Criei MetricCardinalityTest.
- Criei métricas da API.
- Criei métricas da Outbox.
- Criei métricas de consumers.
- Criei métricas de providers.
- Criei métricas de projection.
- Criei métricas de jornada.
- Criei configuração do collector.
- Defini sampling.
- Criei Journey SLO Catalog.
- Defini indicadores.
- Criei Error Budget Policy.
- Criei queries PromQL.
- Criei Dashboard Catalog.
- Criei dashboard geral.
- Criei dashboard de mensageria.
- Criei dashboard de providers.
- Evitei painéis decorativos.
- Criei Alert Catalog.
- Usei burn rate.
- Criei regras de alerta.
- Liguei alertas a ações.
- Criei Runbook Index.
- Criei runbook de Outbox.
- Criei runbook de consumer lag.
- Criei runbook de provider.
- Criei runbook de DLQ.
- Criei runbook de projection.
- Testei logs estruturados.
- Testei propagação HTTP.
- Testei propagação Kafka.
- Testei Outbox telemetry.
- Testei provider telemetry.
- Testei JourneyTelemetry.
- Testei compensação.
- Testei cardinalidade.
- Testei alertas.
- Testei trace ponta a ponta.
- Criei teste arquitetural.
- Criei Observability Test Matrix.
- Criei Observability Risk Register.
- Criei Observability Traceability.
- Criei boundary para a aula 687.
- Executei build do módulo.
- Executei build das aplicações.
- Executei build completo.
- Validei configuração externa.
- Criei report, evidence e gate.
- Não antecipei Docker.
- Próxima aula: Docker do projeto final.
```

---

## Referência técnica curta

- Observability.
- Structured Logging.
- Micrometer.
- OpenTelemetry.
- OTLP.
- Trace Context.
- Span.
- Correlation ID.
- Prometheus.
- PromQL.
- Grafana.
- Cardinality.
- SLI.
- SLO.
- Error Budget.
- Burn Rate.
- Alert.
- Runbook.
- Distributed Trace.

Regra final:

```text
A implementação de observabilidade do OrderFlow deve explicar a jornada distribuída sem contaminar domínio e aplicação: libs/orderflow-observability concentra configuração e adapters de telemetria, logs estruturados incluem service, environment, event, trace ID, span ID, correlation, component, operation e result e nunca token, secret ou payload sensível, TelemetrySanitizer bloqueia campos proibidos, W3C trace context atravessa HTTP, Outbox, Kafka, consumers e providers, retries e DLQ preservam causalidade, spans usam nomes estáveis sem IDs, Micrometer registra API requests, idempotency, Outbox pending e oldest age, publish failures, consumer lag, duplicates, retries, DLQ, provider latency, ambiguous results, circuit state, projection freshness e journey duration, labels são limitadas a dimensões controladas e order ID, tenant ID, message ID e correlation ID são proibidos, OpenTelemetry Collector recebe e exporta sinais, SLOs medem disponibilidade, latência, tempo da jornada, publicação da Outbox e freshness, error budget orienta prioridade, dashboards respondem perguntas operacionais, alertas usam duração e burn rate e sempre apontam para runbooks, testes comprovam sanitização, propagação, métricas, cardinalidade, alertas e trace ponta a ponta, e o gate termina com logs, traces, metrics, SLOs, dashboards, alerts, runbooks, tests, report e evidence aprovados, enquanto Dockerfiles, imagens, usuários não root, health checks, networks, volumes e compose permanecem reservados para a aula 687.
```
