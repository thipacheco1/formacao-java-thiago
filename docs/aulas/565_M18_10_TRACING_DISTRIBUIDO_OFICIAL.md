# 565 - M18.10 - Tracing distribuido

## Apresentação da aula

Na aula 564, a `orders-api` recebeu uma base OpenTelemetry controlada.

Você configurou:

```text
OpenTelemetry Java Agent;

Resource;

semantic conventions;

OTLP;

OpenTelemetry Collector;

receivers;

processors;

debug exporter;

signal ownership;

data protection.
```

A aplicação passou a gerar traces locais para requisições HTTP.

Esses traces já possuem:

- trace ID;
- span ID;
- nome da operação;
- span kind;
- status;
- atributos HTTP;
- Resource da aplicação;
- instrumentation scope.

Entretanto, um único span local ainda não representa a jornada completa de uma operação distribuída.

Imagine o fluxo:

```text
cliente;

orders-api;

serviço de pagamento fake;

PostgreSQL;

Kafka;

consumer;

processamento final.
```

Uma requisição pode iniciar na borda HTTP, atravessar uma chamada de cliente, publicar uma mensagem e continuar em outro processo.

Sem propagação e relações corretas, cada componente produz um trace separado.

O resultado é:

```text
vários fragmentos;

sem causalidade;

sem ordem confiável;

sem caminho crítico;

sem visão da falha completa.
```

Tracing distribuído conecta essas operações.

O objetivo não é apenas carregar o mesmo trace ID, mas preservar a estrutura causal entre parents, children, producers, consumers, links, eventos, status e duração.

Pergunta central:

```text
como reconstruir
uma jornada distribuída

através de HTTP,
mensageria,
execução assíncrona
e retries

sem misturar fluxos,
duplicar spans
ou expor dados?
```

Você irá evoluir o laboratório para possuir dois componentes locais.

### Componente 1 — `orders-api`

Responsável por:

- receber a requisição;
- criar o pedido;
- chamar uma dependência HTTP fake;
- publicar um evento;
- responder ao cliente.

### Componente 2 — `orders-worker`

Responsável por:

- consumir o evento;
- executar processamento controlado;
- registrar outcome;
- concluir o fluxo assíncrono.

O backend local de traces será o Grafana Tempo.

O fluxo será:

```text
orders-api;

orders-worker;

Java Agents;

W3C Trace Context;

OTLP;

Collector;

Tempo;

Grafana;

trace completo.
```

Você irá validar propagação, relações HTTP e mensageria, retries, links, atributos, status, correlação, caminho crítico, duplicação, segurança e evidence.

A aula não irá criar:

- regras de alerta;
- alertas Prometheus;
- alertas Grafana;
- Alertmanager;
- contact points;
- notification policies;
- silences;
- inhibition;
- escalation;
- paging;
- severidades oficiais.

Esses tópicos pertencem à próxima aula oficial:

```text
566 - M18.11 - Alertas
```

Regra central:

```text
um trace distribuído
precisa preservar
causalidade,

não apenas
repetir um identificador.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
563:
Grafana.

564:
OpenTelemetry.

565:
Tracing distribuido.

566:
Alertas.
```

A progressão é:

```text
instrumentação local;

pipeline OpenTelemetry;

propagação entre componentes;

operação orientada a alertas.
```

Aqui:

```text
trace distribuído:
sim.

parent-child:
sim.

HTTP propagation:
sim.

messaging propagation:
sim.

producer span:
sim.

consumer span:
sim.

span links:
sim.

retry tracing:
sim.

Tempo:
sim.

Grafana traces:
sim.

critical path:
sim.

alertas:
não.

notification:
não.

Alertmanager:
não.
```

A aplicação preservará logs, correlation ID, métricas, Prometheus, Grafana e contratos de confiabilidade. Tracing será outra perspectiva, não substituto.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
apps
├── orders-api
└── orders-worker

src/main/java
└── .../observability/tracing
    ├── TraceAttributeNames.java
    ├── TraceEventNames.java
    ├── TraceOperationNames.java
    ├── TraceContextBridge.java
    ├── OrderTraceEnricher.java
    ├── MessagingTraceHeaders.java
    ├── MessagingTraceContext.java
    ├── RetryTracePolicy.java
    └── TraceDataSanitizer.java

src/test/java
└── .../observability/tracing
    ├── TraceContextBridgeTest.java
    ├── HttpTracePropagationTest.java
    ├── MessagingTracePropagationTest.java
    ├── RetryTracePolicyTest.java
    ├── SpanRelationshipContractTest.java
    ├── TraceAttributeContractTest.java
    ├── TraceIsolationTest.java
    └── DistributedTraceIntegrationTest.java

observability/tracing
├── tempo-config.yml
├── distributed-tracing-compose.yml
├── tracing-architecture.yaml
├── trace-operation-catalog.yaml
├── trace-relationship-contract.yaml
├── trace-propagation-policy.yaml
├── trace-attribute-policy.yaml
├── trace-status-policy.yaml
├── trace-event-policy.yaml
├── trace-retry-policy.yaml
├── trace-sampling-policy.yaml
├── trace-retention-policy.yaml
├── trace-data-quality-policy.yaml
├── trace-failure-policy.yaml
├── distributed-tracing-scenarios.yaml
└── distributed-tracing-evidence.yaml

observability/grafana/provisioning
└── datasources
    └── tempo-datasource.yml

scripts/observability/tracing
├── validate-tracing-architecture.ps1
├── validate-tempo-config.ps1
├── start-distributed-tracing-lab.ps1
├── start-orders-components-with-agents.ps1
├── validate-trace-propagation.ps1
├── validate-span-relationships.ps1
├── validate-trace-attributes.ps1
├── simulate-http-distributed-trace.ps1
├── simulate-messaging-distributed-trace.ps1
├── simulate-trace-retry.ps1
├── validate-tempo-traces.ps1
├── scan-distributed-traces.ps1
├── collect-distributed-tracing-evidence.ps1
└── verify-distributed-tracing-baseline.ps1

docs/observability/tracing
├── DISTRIBUTED_TRACING_OVERVIEW.md
├── HTTP_TRACE_PROPAGATION.md
├── MESSAGING_TRACE_PROPAGATION.md
├── SPAN_RELATIONSHIPS.md
├── RETRY_TRACING.md
├── TEMPO_AND_GRAFANA_TRACES.md
├── TRACE_INVESTIGATION_GUIDE.md
├── DISTRIBUTED_TRACING_TEST_MATRIX.md
└── DISTRIBUTED_TRACING_TROUBLESHOOTING.md
```

Ao final, você terá dois componentes locais, propagação HTTP e mensageria, Tempo, Grafana traces, waterfall, critical path, testes e evidence sanitizada.

Você irá construir a topologia, configurar Tempo e Collector, propagar contexto por HTTP e mensageria, validar retries, links, atributos, waterfall, critical path, falhas, segurança e evidence.

---

## Conceito essencial

### Trace distribuído

Representação de uma jornada que atravessa múltiplos componentes.

---

### Span

Unidade de trabalho observada dentro de um trace.

---

### Parent span

Span que iniciou ou causou outro span.

---

### Child span

Span criado como consequência de outro span.

---

### Root span

Span sem parent dentro do trace observado.

---

### Span context

Conjunto que inclui trace ID, span ID, flags e estado de propagação.

---

### Propagation

Transporte do span context entre fronteiras.

---

### Context carrier

Meio usado para transportar contexto, como headers HTTP ou headers de mensagem.

---

### Extractor

Componente que lê contexto de entrada.

---

### Injector

Componente que escreve contexto de saída.

---

### Producer span

Span que representa publicação de mensagem.

---

### Consumer span

Span que representa recebimento ou processamento de mensagem.

---

### Span link

Relação entre um span e outro contexto sem estabelecer parent-child direto.

---

### Span event

Registro temporal associado a um span.

---

### Critical path

Sequência de operações que determina a duração total observada.

---

### Trace waterfall

Visualização temporal dos spans e suas relações.

---

### Head sampling

Decisão de amostragem tomada no início do trace.

---

### Tail sampling

Decisão tomada depois que mais informações do trace estão disponíveis.

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

Suba o Collector da aula 564.

Confirme:

- Java Agent fixado;
- checksum aprovado;
- Collector saudável;
- OTLP HTTP ativo;
- trace local chegando;
- metrics exporter desabilitado;
- logs exporter desabilitado;
- Resource da `orders-api` correto;
- nenhum backend de trace ainda configurado;
- nenhum Secret real.

Registre a baseline.

---

### 2. Definir a arquitetura distribuída

Arquivo:

```text
tracing-architecture.yaml
```

Conteúdo:

```yaml
architecture:
  components:
    orders-api:
      entry:
        HTTP

      responsibilities:
        - create-order
        - call-payment-simulator
        - publish-order-event

    orders-worker:
      entry:
        messaging

      responsibilities:
        - consume-order-event
        - process-order

    payment-simulator:
      mode:
        local-http-fake

  propagation:
    HTTP:
      W3C-tracecontext

    messaging:
      W3C-tracecontext-headers

  telemetry:
    agent:
      OpenTelemetry-Java-Agent

    transport:
      OTLP

    collector:
      OpenTelemetry-Collector

    backend:
      Grafana-Tempo

    visualization:
      Grafana
```

A topologia é local, didática e não representa produção.

---

### 3. Criar o `orders-worker`

O worker pode ser um segundo módulo ou aplicação Spring Boot, com nome, release, Resource, consumer local, health, logs estruturados e Agent próprios.

O objetivo: criar uma fronteira real de processo.

Não simule dois serviços apenas com dois métodos na mesma JVM.

---

### 4. Configurar Resource por componente

Para a API:

```text
OTEL_SERVICE_NAME=orders-api.
```

Para o worker:

```text
OTEL_SERVICE_NAME=orders-worker.
```

Atributos comuns:

```text
service.namespace=formacao-java;

deployment.environment.name=local.
```

Versões:

```text
orders-api:
api-local-build.

orders-worker:
worker-local-build.
```

Dois componentes não podem compartilhar `service.name`.

---

### 5. Criar catálogo de operações

Arquivo:

```text
trace-operation-catalog.yaml
```

Operações:

```yaml
operations:
  - name:
      POST /orders

    kind:
      SERVER

    owner:
      orders-api

  - name:
      payment-simulator.authorize

    kind:
      CLIENT

    owner:
      orders-api

  - name:
      orders.publish

    kind:
      PRODUCER

    owner:
      orders-api

  - name:
      orders.process

    kind:
      CONSUMER

    owner:
      orders-worker

  - name:
      order.processing

    kind:
      INTERNAL

    owner:
      orders-worker
```

Nomes precisam ser estáveis.

Não inclua IDs dinâmicos.

---

### 6. Criar catálogo Java de operações

Arquivo:

```text
TraceOperationNames.java
```

Exemplo:

```java
package com.formacao.orders.observability.tracing;

public final class TraceOperationNames {

    public static final String PAYMENT_AUTHORIZE =
            "payment-simulator.authorize";

    public static final String ORDER_PUBLISH =
            "orders.publish";

    public static final String ORDER_PROCESS =
            "orders.process";

    public static final String ORDER_PROCESSING =
            "order.processing";

    private TraceOperationNames() {
    }
}
```

Use esse catálogo apenas para instrumentação manual necessária.

Spans automáticos do framework continuam seguindo semantic conventions.

---

### 7. Definir relações esperadas

Arquivo:

```text
trace-relationship-contract.yaml
```

Conteúdo:

```yaml
relationships:
  HTTP:
    root:
      orders-api-server-span

    child:
      payment-client-span

  messaging:
    producer:
      orders-api-producer-span

    consumer:
      orders-worker-consumer-span

    traceIdentity:
      preserved

  internalProcessing:
    parent:
      orders-worker-consumer-span

    child:
      worker-internal-span

  retry:
    sameTrace:
      conditional

    newSpan:
      required

    linkToOriginal:
      requiredWhenNewTrace
```

O contrato define a causalidade.

---

### 8. Configurar Tempo

Arquivo:

```text
tempo-config.yml
```

Conteúdo:

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317

        http:
          endpoint: 0.0.0.0:4318

ingester:
  max_block_duration: 5m

compactor:
  compaction:
    block_retention: 24h

storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces
    wal:
      path: /var/tempo/wal
```

A retenção é local e curta.

---

### 9. Integrar Collector ao Tempo

Atualize o Collector:

```yaml
exporters:
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true

  debug:
    verbosity: normal
```

Pipeline:

```yaml
service:
  pipelines:
    traces:
      receivers:
        - otlp

      processors:
        - memory_limiter
        - attributes/drop_sensitive
        - batch

      exporters:
        - otlp/tempo
        - debug
```

O debug exporter permanece somente no laboratório.

---

### 10. Criar Compose distribuído

Arquivo:

```text
distributed-tracing-compose.yml
```

Serviços:

```text
otel-collector;

tempo;

grafana;

prometheus;
```

Use uma network compartilhada:

```text
orders-observability.
```

Exponha somente:

- Grafana 3000;
- Prometheus 9090;
- Tempo 3200 quando necessário;
- Collector 4317, 4318 e health.

As portas internas de ingestão do Tempo não precisam ser públicas quando o Collector está na mesma network.

---

### 11. Provisionar datasource Tempo

Arquivo:

```text
tempo-datasource.yml
```

Conteúdo:

```yaml
apiVersion: 1

datasources:
  - name: Orders Tempo
    uid: orders-tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    editable: false
    jsonData:
      httpMethod: GET
      tracesToLogsV2:
        datasourceUid: ""
      tracesToMetrics:
        datasourceUid: orders-prometheus
      serviceMap:
        datasourceUid: orders-prometheus
```

A integração com logs permanece conceitual; métricas seguem o contrato existente.

---

### 12. Criar política de propagação

Arquivo:

```text
trace-propagation-policy.yaml
```

Conteúdo:

```yaml
propagation:
  format:
    W3C-tracecontext

  HTTP:
    carrier:
      headers

    accepted:
      - traceparent
      - tracestate

  messaging:
    carrier:
      message-headers

    accepted:
      - traceparent
      - tracestate

  baggage:
    enabled:
      false-for-business-data

  invalidContext:
    action:
      start-new-trace

  duplicateHeaders:
    action:
      reject-or-normalize

  authorization:
    never-propagated-by-tracing-component
```

Não copie todos os headers de entrada.

---

### 13. Validar propagação HTTP

O Java Agent pode instrumentar servidor e cliente HTTP automaticamente.

Fluxo:

```text
client;

orders-api SERVER span;

HTTP client CLIENT span;

payment-simulator SERVER span.
```

Valide trace ID comum, span IDs distintos, relação client/server, headers W3C, route, método, status, duração e ausência de body.

O simulador pode ser um WireMock local ou pequena aplicação fake.

---

### 14. Evitar spans duplicados em HTTP

Duplicação ocorre quando Agent, framework, interceptor e código manual instrumentam a mesma chamada, gerando spans equivalentes.

A política será:

```text
instrumentação automática
primeiro;

manual somente
quando faltar semântica.
```

Não crie span manual apenas para adicionar atributos.

Use a API para enriquecer o span atual quando apropriado.

---

### 15. Criar `TraceContextBridge`

Arquivo:

```text
TraceContextBridge.java
```

Responsabilidade:

- obter span atual;
- consultar trace ID;
- consultar span ID;
- verificar contexto válido;
- enriquecer logs existentes;
- não criar novo trace automaticamente.

Exemplo:

```java
package com.formacao.orders.observability.tracing;

import io.opentelemetry.api.trace.Span;

public final class TraceContextBridge {

    public String currentTraceId() {
        var context = Span.current()
                .getSpanContext();

        return context.isValid()
                ? context.getTraceId()
                : "unknown";
    }

    public String currentSpanId() {
        var context = Span.current()
                .getSpanContext();

        return context.isValid()
                ? context.getSpanId()
                : "unknown";
    }
}
```

Esse bridge não substitui o MDC do Agent.

Ele serve para validação e integração controlada.

---

### 16. Atualizar correlação com logs

Os logs precisam receber o trace ID do contexto OpenTelemetry.

Valide os campos reais gerados pelo Agent.

Evite manter:

```text
trace_id customizado
diferente
do trace_id OpenTelemetry.
```

Quando existir trace ID próprio da aula 557, prefira o OTel, mantenha correlation ID separado, remova geração paralela com testes de compatibilidade e documente a migração.

O resultado final precisa possuir uma única identidade técnica de trace.

---

### 17. Definir headers de mensageria

Arquivo:

```text
MessagingTraceHeaders.java
```

Headers:

```text
traceparent;

tracestate.
```

Mesmo com instrumentação automática de Kafka, valide headers, formato, ausência de duplicação, preservação na serialização e ausência de payload.

O correlation ID permanece separado.

---

### 18. Validar producer span

O producer span representa publicação.

Use atributos de sistema, destino, operação, outcome e erro controlado; proíba payload, IDs dinâmicos e keys sensíveis.

Business ID pode permanecer nos logs correlacionados.

---

### 19. Validar consumer span

O consumer span representa recebimento ou processamento.

Valide trace preservado, contexto extraído, kind `CONSUMER`, destino, operação, duração, status, child interno e cleanup.

Thread reuse não pode misturar mensagens.

---

### 20. Criar contexto de mensagem controlado

Arquivo:

```text
MessagingTraceContext.java
```

O componente valida o carrier, extrai contexto, executa callback, enriquece o span e limpa recursos sem copiar headers proibidos.

Quando o Agent já executa extração automática, o componente deve atuar apenas como validator e test helper.

Não crie um segundo consumer span.

---

### 21. Criar child span interno

Quando uma etapa de negócio relevante não é visível automaticamente, crie span manual.

Exemplo conceitual:

```java
var tracer = openTelemetry
        .getTracer("orders-worker");

var span = tracer
        .spanBuilder(
                TraceOperationNames.ORDER_PROCESSING)
        .setSpanKind(
                SpanKind.INTERNAL)
        .startSpan();

try (var scope = span.makeCurrent()) {
    orderProcessor.process(message);
} catch (RuntimeException exception) {
    span.recordException(exception);
    span.setStatus(
            StatusCode.ERROR);
    throw exception;
} finally {
    span.end();
}
```

Crie span manual somente para operação relevante.

Não crie um span por método privado.

---

### 22. Enriquecer o span atual

Arquivo:

```text
OrderTraceEnricher.java
```

Atributos permitidos:

- `order.operation`;
- `order.channel`;
- `order.outcome`;
- `error.type`;
- `retryable`.

Não use:

- order ID;
- customer ID;
- email;
- payload;
- preço;
- endereço.

Exemplo:

```java
Span.current()
        .setAttribute(
                "order.operation",
                "create")
        .setAttribute(
                "order.channel",
                "api");
```

Use atributos com cardinalidade limitada.

---

### 23. Criar política de atributos

Arquivo:

```text
trace-attribute-policy.yaml
```

Conteúdo:

```yaml
attributes:
  allowed:
    - order.operation
    - order.channel
    - order.outcome
    - error.type
    - retryable
    - http.request.method
    - http.route
    - http.response.status_code
    - messaging.system
    - messaging.destination.name
    - messaging.operation.type

  forbidden:
    - order.id
    - customer.id
    - user.email
    - request.body
    - response.body
    - messaging.message.body
    - db.query.parameter
    - authorization
    - cookie

  spanName:
    dynamicValues:
      forbidden
```

Atributos de trace também afetam custo e privacidade.

---

### 24. Definir status dos spans

Arquivo:

```text
trace-status-policy.yaml
```

Regras:

```yaml
status:
  technicalSuccess:
    code:
      UNSET-or-OK

  businessRejection:
    code:
      UNSET

    event:
      optional-controlled

  unexpectedFailure:
    code:
      ERROR

    exception:
      recorded

  dependencyTimeout:
    code:
      ERROR

    attributes:
      error.type:
        timeout

  retryScheduled:
    currentSpan:
      ERROR-or-UNSET-by-policy

    retrySpan:
      new-operation
```

Não marque rejeição válida como erro técnico automaticamente.

---

### 25. Criar eventos de span

Arquivo:

```text
TraceEventNames.java
```

Eventos controlados incluem validação, rejeição, autorização, publicação, retry e conclusão.

Span event é útil para marcos dentro de uma operação.

Não transforme cada log em span event.

Use eventos apenas quando ajudam a entender a linha do tempo.

---

### 26. Criar política de eventos

Arquivo:

```text
trace-event-policy.yaml
```

Regras:

```yaml
events:
  naming:
    stable:
      required

  attributes:
    bounded:
      required

  duplicateLogs:
    avoid:
      true

  payload:
    forbidden

  exception:
    useRecordException:
      preferred

  timestamps:
    automatic:
      preferred
```

Eventos precisam ter finalidade.

---

### 27. Entender retries

Retry pode ocorrer no mesmo fluxo ou depois, em outro processo ou redelivery; a modelagem depende da relação temporal.

---

### 28. Criar política de retry

Arquivo:

```text
trace-retry-policy.yaml
```

Conteúdo:

```yaml
retry:
  synchronous:
    sameTrace:
      true

    eachAttempt:
      childSpan:
        required

  asynchronousRedelivery:
    newTrace:
      allowed

    linkToOriginal:
      required

  attributes:
    allowed:
      - retry.attempt
      - retry.max
      - retryable

  attemptValues:
    bounded:
      required

  spanName:
    attemptNumber:
      forbidden
```

Não coloque o número da tentativa no span name.

Use atributo numérico.

---

### 29. Usar span links

Span link é adequado quando existe dependência causal sem parent-child temporal direto, como redelivery, batch ou fan-in.

Exemplo conceitual:

```java
var linkedContext =
        extractedContext;

var span = tracer
        .spanBuilder("orders.redelivery")
        .addLink(
                Span.fromContext(
                        linkedContext)
                    .getSpanContext())
        .startSpan();
```

A aula usará link em redelivery assíncrona.

---

### 30. Validar causalidade de retries

Cenário síncrono:

```text
CLIENT span;

attempt 1 child;

attempt 2 child;

resultado.
```

Cenário assíncrono:

```text
trace original;

mensagem falha;

redelivery;

novo trace;

link ao span original.
```

O teste valida a política escolhida.

---

### 31. Criar política de sampling

Arquivo:

```text
trace-sampling-policy.yaml
```

Conteúdo:

```yaml
sampling:
  laboratory:
    type:
      always_on

    reason:
      deterministic-validation

  production:
    configured:
      false

  parentBased:
    requiredWhenConfigured

  errors:
    tailSampling:
      future-option

  personallyIdentifiableData:
    neverJustifiesCapture

  alerting:
    deferredToLesson566
```

No laboratório, `always_on` facilita validação.

Não copie esse valor para produção sem análise de volume e custo.

---

### 32. Configurar sampling do Agent

Ambiente:

```powershell
$env:OTEL_TRACES_SAMPLER = `
  "parentbased_always_on"
```

Esse sampler preserva decisão do parent e amostra roots locais.

A configuração é didática e registrada em evidence.

---

### 33. Criar política de retenção

Arquivo:

```text
trace-retention-policy.yaml
```

Conteúdo:

```yaml
retention:
  laboratory:
    duration:
      24h

    backend:
      local-tempo

  production:
    undefined:
      true

  payloads:
    forbidden

  sensitiveAttributes:
    forbidden

  cleanup:
    required
```

Retenção e acesso a traces exigem governança.

---

### 34. Iniciar os componentes com Agents

Script:

```text
start-orders-components-with-agents.ps1
```

Configure individualmente:

```text
orders-api:

OTEL_SERVICE_NAME=orders-api;

port=8080.
```

```text
orders-worker:

OTEL_SERVICE_NAME=orders-worker;

port=8081 ou processo sem HTTP principal.
```

Ambos exportam para:

```text
http://localhost:4318.
```

As versões e environments precisam ser coerentes.

---

### 35. Simular trace HTTP distribuído

Script:

```text
simulate-http-distributed-trace.ps1
```

Fluxo:

1. chamar `POST /orders`;
2. API chama payment simulator;
3. simulador responde;
4. API conclui;
5. consultar o trace no Tempo.

Valide:

- um trace ID;
- spans em dois services;
- relações corretas;
- durations;
- status;
- attributes;
- nenhum body;
- nenhum ID dinâmico em nomes.

---

### 36. Simular trace de mensageria

Script:

```text
simulate-messaging-distributed-trace.ps1
```

Fluxo:

1. API cria pedido;
2. producer publica;
3. worker consome;
4. child span interno processa;
5. resultado é registrado.

Valide:

- trace ID;
- producer;
- consumer;
- service names;
- messaging attributes;
- duração;
- cleanup;
- ausência de context leak.

---

### 37. Simular retry

Script:

```text
simulate-trace-retry.ps1
```

Cenário:

- primeira tentativa falha;
- retryable `true`;
- retry agendado;
- nova tentativa;
- sucesso;
- span link ou child relationship conforme política.

Valide:

- tentativa controlada;
- status correto;
- error type;
- link;
- nenhum loop infinito;
- nenhum span name dinâmico.

---

### 38. Consultar traces no Tempo

O Tempo pode ser consultado pelo Grafana Explore.

Use:

- Trace ID conhecido do laboratório;
- busca por service name;
- duração;
- status;
- span name;
- atributos controlados.

A API do Tempo também pode ser usada pelos scripts.

Registre as consultas em `TEMPO_AND_GRAFANA_TRACES.md`.

---

### 39. Analisar o waterfall

Observe:

```text
root span;

client span;

remote server span;

producer span;

consumer span;

internal span.
```

Investigue duração dominante, paralelismo, sequência, erro, gaps, duplicações e parents.

---

### 40. Identificar caminho crítico

O caminho crítico determina a duração total. Considere paralelismo: somar spans sobrepostos pode exceder o tempo do trace.

---

### 41. Correlacionar trace e logs

Com o trace ID, localize o span, busque logs correlacionados e compare correlation ID, stack trace, release e ambiente.

O trace mostra estrutura; o log fornece detalhes.

---

### 42. Correlacionar trace e métricas

O dashboard mostra:

```text
p95 aumentou.
```

O trace ajuda a investigar exemplos de operações lentas.

Sem exemplars, a investigação usa janela e atributos; registre essa limitação.

---

### 43. Validar trace data quality

Arquivo:

```text
trace-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingParent:
    action:
      investigate-propagation

  duplicateSpan:
    action:
      block-release

  invalidDuration:
    action:
      block-analysis

  missingServiceName:
    action:
      block-release

  dynamicSpanName:
    action:
      block-release

  missingTrace:
    result:
      inconclusive

  partialTrace:
    result:
      incomplete

  clockSkew:
    action:
      investigate-runtime-clock

  unsampledTrace:
    result:
      expected-by-policy
```

Waterfall não garante trace completo.

---

### 44. Validar relações automaticamente

Script:

```text
validate-span-relationships.ps1
```

O script deve confirmar:

- root único quando esperado;
- parent IDs existentes;
- nenhum ciclo;
- services esperados;
- kinds esperados;
- producer e consumer;
- links válidos;
- durations não negativas;
- start e end coerentes;
- nenhum span órfão indevido.

Resultado:

```text
SPAN_RELATIONSHIPS_APPROVED
ou
SPAN_RELATIONSHIPS_BLOCKED.
```

---

### 45. Validar propagação

Script:

```text
validate-trace-propagation.ps1
```

Valide:

- `traceparent` HTTP;
- `tracestate` quando presente;
- headers de mensagem;
- trace ID preservado;
- novos span IDs;
- invalid context inicia novo trace;
- duplicate context não é aceito silenciosamente;
- correlation ID permanece separado;
- Authorization não é propagada pelo componente de tracing.

---

### 46. Validar atributos

Script:

```text
validate-trace-attributes.ps1
```

Procure:

- atributos obrigatórios;
- semantic conventions;
- valores limitados;
- status;
- error type;
- operation;
- channel;
- retry;
- ausência de IDs;
- ausência de payload;
- ausência de credenciais.

Limite a quantidade de atributos por span.

---

### 47. Escanear traces

Script:

```text
scan-distributed-traces.ps1
```

Procure:

- password;
- token;
- authorization;
- Cookie;
- email;
- CPF;
- order ID;
- customer ID;
- request body;
- response body;
- message body;
- query parameter;
- private key;
- dynamic span names.

Resultado:

```text
DISTRIBUTED_TRACES_APPROVED
ou
DISTRIBUTED_TRACES_BLOCKED.
```

---

### 48. Criar cenários

Arquivo:

```text
distributed-tracing-scenarios.yaml
```

Cenários:

```text
HTTP success;

HTTP dependency failure;

messaging success;

consumer failure;

synchronous retry;

asynchronous redelivery;

invalid traceparent;

missing context;

Collector unavailable;

Tempo unavailable;

duplicate instrumentation;

partial trace.
```

Cada cenário registra setup, entrada, spans esperados, relação, status, cleanup e evidence.

---

### 49. Simular Tempo indisponível

Pare o Tempo mantendo Collector e aplicação.

Confirme que o negócio continua, a exportação falha de forma limitada e memória, fila e health permanecem controlados.

Reinicie Tempo.

Confirme recuperação.

---

### 50. Simular contexto inválido

Envie `traceparent` inválido em requisição controlada.

Resultado esperado:

```text
novo trace seguro.
```

Não registre o header bruto.

O trace inválido não deve quebrar a requisição.

Registre reason controlada em log.

---

### 51. Criar failure policy

Arquivo:

```text
trace-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidIncomingContext:
    action:
      start-new-trace

  CollectorUnavailable:
    business:
      continue

  tempoUnavailable:
    business:
      continue

    telemetry:
      degraded

  duplicateSpans:
    action:
      block-release

  brokenParentChild:
    action:
      block-release

  sensitiveData:
    action:
      block-release

  partialTrace:
    investigation:
      required

  alerting:
    deferredToLesson566
```

---

### 52. Criar matriz de testes

Arquivo:

```text
DISTRIBUTED_TRACING_TEST_MATRIX.md
```

Cenários:

- two services;
- resources distintos;
- HTTP root;
- HTTP client;
- remote server;
- producer;
- consumer;
- internal child;
- same trace;
- different span IDs;
- W3C headers;
- invalid header;
- missing header;
- async context;
- thread isolation;
- retry child spans;
- redelivery link;
- status success;
- status failure;
- business rejection;
- no body;
- no credentials;
- no dynamic name;
- Collector down;
- Tempo down;
- recovery;
- partial trace;
- duplicate span;
- evidence sanitizada.

---

### 53. Criar troubleshooting

Arquivo:

```text
DISTRIBUTED_TRACING_TROUBLESHOOTING.md
```

Inclua:

- traces separados por serviço;
- trace ID muda no HTTP;
- consumer inicia novo trace;
- producer span ausente;
- consumer span duplicado;
- parent ID inexistente;
- span órfão;
- waterfall com gap;
- duração negativa;
- clock skew;
- service name igual;
- Resource ausente;
- span name com ID;
- retry sem link;
- Tempo sem traces;
- datasource Tempo falha;
- Collector export falha;
- logs usam outro trace ID;
- métricas duplicaram;
- alertas antecipados.

---

### 54. Coletar evidence

Script:

```text
collect-distributed-tracing-evidence.ps1
```

Arquivo:

```text
distributed-tracing-evidence.json.
```

A evidence pode conter aula, ambiente, serviços, versões e status de propagação, spans, retries, links, relações, atributos, scan, consultas, critical path, cenários, testes e timestamp.

Não inclua:

- trace IDs reais;
- span IDs;
- payloads;
- credentials;
- order IDs;
- customer IDs;
- logs completos;
- traces completos.

---

### 55. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\tracing\validate-tracing-architecture.ps1

.\scripts\observability\tracing\validate-tempo-config.ps1

.\scripts\observability\tracing\start-distributed-tracing-lab.ps1

.\scripts\observability\tracing\start-orders-components-with-agents.ps1

.\scripts\observability\tracing\simulate-http-distributed-trace.ps1

.\scripts\observability\tracing\simulate-messaging-distributed-trace.ps1

.\scripts\observability\tracing\simulate-trace-retry.ps1

.\scripts\observability\tracing\validate-trace-propagation.ps1

.\scripts\observability\tracing\validate-span-relationships.ps1

.\scripts\observability\tracing\validate-trace-attributes.ps1

.\scripts\observability\tracing\validate-tempo-traces.ps1

.\scripts\observability\tracing\scan-distributed-traces.ps1

.\scripts\observability\tracing\collect-distributed-tracing-evidence.ps1

.\scripts\observability\tracing\verify-distributed-tracing-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- dois serviços distintos;
- Resources distintos;
- Tempo ativo;
- datasource ativo;
- HTTP propagation aprovada;
- messaging propagation aprovada;
- parent-child aprovado;
- producer e consumer aprovados;
- retry aprovado;
- links aprovados;
- status aprovado;
- atributos aprovados;
- dados sensíveis ausentes;
- critical path analisado;
- evidence sanitizada;
- alertas não antecipados.

---

### 56. Encerrar o laboratório

Pare os processos Java.

Depois:

```powershell
docker compose `
  --file `
  observability/tracing/distributed-tracing-compose.yml `
  down
```

Para remover dados locais:

```powershell
docker compose `
  --file `
  observability/tracing/distributed-tracing-compose.yml `
  down `
  --volumes
```

Antes:

- colete evidence;
- confirme o Compose;
- confirme que dados são locais;
- confirme que não há artifacts necessários.

Não execute limpeza Docker global.

---

## Entendendo o que foi feito

### O trace ganhou causalidade

Spans passaram a formar uma jornada, não fragmentos isolados.

### Services ganharam Resources distintos

API e worker deixaram de parecer o mesmo processo.

### HTTP ganhou parent-child

Client e server spans passaram a compartilhar contexto.

### Mensageria ganhou producer e consumer

Publicação e processamento ficaram conectados.

### Retries ganharam modelagem

Tentativas síncronas e redeliveries deixaram de ser iguais.

### Links ganharam finalidade

Relações assíncronas sem parent-child direto puderam ser representadas.

### Tempo ganhou retenção local

Traces deixaram de existir apenas no debug exporter.

### Grafana ganhou waterfall

A linha do tempo pôde ser investigada visualmente.

### Logs e traces ganharam integração

Trace ID passou a conectar estrutura e detalhes.

### A próxima aula ganhou sinais operacionais

Falhas e degradações poderão orientar alertas sem depender de uma única métrica.

---

## Erros comuns importantes

### Preservar apenas trace ID

Sem parent-child, a causalidade fica incorreta.

### Usar mesmo service name

Os componentes ficam indistinguíveis.

### Criar span manual e automático

O trace ganha duplicações.

### Usar order ID no span name

Cardinalidade e privacidade pioram.

### Copiar todos os headers

Credenciais podem vazar.

### Tratar business rejection como erro técnico

O trace comunica falha inexistente.

### Reutilizar contexto de outra mensagem

Fluxos independentes são misturados.

### Modelar redelivery sempre como child

A relação temporal pode ser falsa.

### Tratar Tempo como obrigatório ao negócio

Falha de telemetria quebra o serviço.

### Antecipar alertas

Regras, notificações e severidades pertencem à aula 566.

---

## Comandos úteis

### Subir o laboratório

```powershell
.\scripts\observability\tracing\start-distributed-tracing-lab.ps1
```

### Iniciar componentes

```powershell
.\scripts\observability\tracing\start-orders-components-with-agents.ps1
```

### Simular HTTP

```powershell
.\scripts\observability\tracing\simulate-http-distributed-trace.ps1
```

### Simular mensageria

```powershell
.\scripts\observability\tracing\simulate-messaging-distributed-trace.ps1
```

### Validar relações

```powershell
.\scripts\observability\tracing\validate-span-relationships.ps1
```

---

## Exercício guiado

### Parte 1 — Topology

Crie API, worker e simulador.

### Parte 2 — Backend

Configure Tempo e datasource.

### Parte 3 — HTTP

Valide parent-child.

### Parte 4 — Messaging

Valide producer e consumer.

### Parte 5 — Internal

Crie span manual somente quando necessário.

### Parte 6 — Retry

Modele tentativas e redelivery.

### Parte 7 — Investigation

Analise waterfall e critical path.

### Parte 8 — Correlation

Conecte trace e logs.

### Parte 9 — Failures

Simule context, Collector e Tempo.

### Parte 10 — Evidence

Valide, registre e encerre.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 564 e ponte para a aula 566 foram preservadas;
- trace distribuído, span, parent, child, root, span context, propagation, carrier, extractor, injector, producer, consumer, link, event, critical path, waterfall, head sampling e tail sampling foram definidos;
- baseline OpenTelemetry foi validada;
- arquitetura distribuída foi criada;
- `orders-api` e `orders-worker` possuem processos distintos;
- cada componente possui `service.name` próprio;
- payment simulator é local e fake;
- catálogo de operações foi criado;
- nomes de operação são estáveis;
- relação esperada foi documentada;
- Tempo foi configurado;
- retenção local de 24 horas foi definida;
- Collector exporta traces ao Tempo;
- debug exporter permanece somente no laboratório;
- Compose usa network compartilhada;
- datasource Tempo possui UID estável;
- política de propagação foi criada;
- W3C `traceparent` e `tracestate` foram usados;
- HTTP server e client spans compartilham trace;
- span IDs são diferentes;
- headers proibidos não são propagados;
- duplicação HTTP foi evitada;
- bridge de contexto foi criado;
- uma única identidade técnica de trace foi preservada;
- correlation ID permanece separado;
- mensageria transporta trace context;
- producer span foi validado;
- consumer span foi validado;
- thread reuse não mistura mensagens;
- child span manual é criado apenas para operação relevante;
- atributos possuem cardinalidade limitada;
- IDs de negócio e payloads são proibidos;
- status técnico e rejeição de negócio foram diferenciados;
- span events possuem catálogo;
- eventos não duplicam todos os logs;
- retry síncrono usa spans por tentativa;
- redelivery assíncrona usa novo trace e link quando definido;
- tentativa não aparece no span name;
- sampling de laboratório usa parent-based always-on;
- sampling de produção não foi definido;
- Resources dos componentes são distintos;
- componentes foram iniciados com Agents;
- trace HTTP distribuído foi simulado;
- trace de mensageria foi simulado;
- retry foi simulado;
- Tempo foi consultado;
- waterfall foi analisado;
- critical path foi analisado;
- sobreposição de spans foi considerada;
- trace e logs foram correlacionados;
- integração com métricas foi documentada sem inventar exemplars;
- policy de data quality foi criada;
- relações foram validadas automaticamente;
- propagação foi validada;
- atributos foram validados;
- traces foram escaneados;
- cenários foram criados;
- Tempo indisponível não quebra negócio;
- contexto inválido inicia novo trace;
- failure policy foi criada;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret real, dado pessoal, cloud pública ou backend de produção foi usado;
- alertas, notificações e Alertmanager não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/apps `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/tracing `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/grafana/provisioning/datasources/tempo-datasource.yml `
  scripts/observability/tracing `
  docs/observability/tracing `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|request_body|response_body|order.id|customer.id|email"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): implementar tracing distribuido"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- trace IDs reais;
- spans completos;
- dados do Tempo;
- credentials;
- payloads;
- IDs de negócio;
- regras de alertas;
- notificações;
- material da aula 566.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a `orders-api` e o `orders-worker` passaram a formar traces distribuídos.

Você configurou:

```text
W3C Trace Context;

HTTP propagation;

messaging propagation;

parent-child;

producer spans;

consumer spans;

internal spans;

span events;

retries;

span links;

Tempo;

Grafana traces.
```

Você comprovou que repetir trace ID não é suficiente; relações parent-child preservam causalidade; Resources precisam distinguir componentes; instrumentação automática e manual não podem duplicar spans; HTTP e mensageria precisam de carriers e propagators controlados; producer e consumer possuem semânticas próprias; retries síncronos e redeliveries assíncronas precisam de modelagens diferentes; span links representam relações sem parent-child direto; atributos e nomes precisam de cardinalidade limitada; rejeições de negócio não são automaticamente erros técnicos; backend de traces pode falhar sem quebrar o negócio; waterfall precisa ser analisado considerando paralelismo; e logs, métricas e traces se complementam.

Próxima aula:

```text
566 - M18.11 - Alertas
```

Nela, você irá transformar sinais operacionais em alertas acionáveis, definir severidade, duração, condições, roteamento e proteção contra ruído.

Nenhuma regra de alerta, Alertmanager, contact point, notification policy, silence, inhibition ou escalonamento foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei dois componentes com Resources distintos.
- [ ] Configurei Tempo e datasource.
- [ ] Validei propagação HTTP.
- [ ] Validei producer e consumer.
- [ ] Modelei retries e links.
- [ ] Analisei waterfall e critical path.
- [ ] Correlacionei traces e logs.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### Cada serviço cria um trace diferente

Revise propagação W3C, injector, extractor e headers.

### Dois spans aparecem para a mesma chamada

Remova instrumentação manual duplicada.

### Worker usa o mesmo service name

Corrija `OTEL_SERVICE_NAME` e Resource.

### Producer existe, mas consumer não

Revise headers, instrumentação Kafka e contexto extraído.

### Consumer mistura mensagens

Valide cleanup e thread reuse.

### Redelivery não possui link

Revise política e contexto persistido.

### Trace não aparece no Tempo

Revise Collector exporter, network e datasource.

### Logs usam trace ID diferente

Consolide a identidade técnica no contexto OTel.

### Span name contém ID

Use operação estável e mova detalhes permitidos para atributos.

### Uma regra de alerta começou a ser criada

Preserve esse conteúdo para a aula 566.

---

## Perguntas de revisão

1. O que é tracing distribuído?
2. O que é parent span?
3. O que é child span?
4. O que é root span?
5. O que é propagation?
6. O que é carrier?
7. O que é producer span?
8. O que é consumer span?
9. O que é span link?
10. Quando usar link?
11. O que é critical path?
12. O que é waterfall?
13. Como modelar retry síncrono?
14. Como modelar redelivery?
15. Por que evitar spans duplicados?
16. Por que Resource deve mudar por serviço?
17. Como logs e traces se complementam?
18. O que significa partial trace?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Jornada entre componentes.
2. Operação causadora.
3. Operação causada.
4. Primeiro span.
5. Transporte de contexto.
6. Meio de transporte.
7. Publicação.
8. Recebimento ou processamento.
9. Relação sem parent direto.
10. Redelivery, batch ou fan-in.
11. Sequência que determina duração.
12. Linha do tempo dos spans.
13. Child span por tentativa.
14. Novo trace com link.
15. Ruído e duração falsa.
16. Identidade dos componentes.
17. Estrutura e detalhes.
18. Trace incompleto.
19. Alertas.
20. Alertas.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 565 - M18.10 - Tracing distribuido

- Continuei após OpenTelemetry.
- Diferenciei trace, span, parent, child e root.
- Criei uma topologia local com `orders-api` e `orders-worker`.
- Configurei Resources distintos por componente.
- Criei catálogo de operações e relações esperadas.
- Configurei Grafana Tempo com retenção local.
- Integrei Collector e Tempo por OTLP.
- Provisionei datasource Tempo no Grafana.
- Adotei W3C Trace Context.
- Validei propagação HTTP entre server e client spans.
- Evitei duplicação entre instrumentação automática e manual.
- Consolidei trace ID técnico do OpenTelemetry.
- Mantive correlation ID operacional separado.
- Propaguei contexto em mensageria.
- Validei producer e consumer spans.
- Criei child span interno apenas para operação relevante.
- Criei política de atributos, status e eventos.
- Diferenciei erro técnico e rejeição de negócio.
- Modelei retries síncronos com child spans.
- Modelei redelivery assíncrona com novo trace e span link.
- Configurei sampling parent-based always-on apenas no laboratório.
- Simulei traces HTTP, mensageria e retry.
- Consultei traces no Tempo e Grafana.
- Analisei waterfall e critical path.
- Correlacionei trace com logs estruturados.
- Validei propagação, relações e atributos.
- Escaneei dados sensíveis.
- Simulei Collector, Tempo e contexto inválido.
- Coletei evidence sanitizada.
- Não antecipei regras ou notificações de alertas.
- Próxima aula: Alertas.
```

---

## Referência técnica curta

- OpenTelemetry Traces.
- W3C Trace Context.
- Span Relationships.
- Span Kinds.
- Span Links.
- OpenTelemetry Messaging Conventions.
- OpenTelemetry HTTP Conventions.
- Grafana Tempo.
- Distributed Trace Waterfall.
- Trace Context Propagation.

Regra final:

```text
tracing distribuído precisa preservar causalidade entre componentes: orders-api e orders-worker possuem Resources e service names distintos, W3C traceparent e tracestate transportam contexto por HTTP e mensageria, server, client, producer, consumer e internal spans usam kinds e relações coerentes, e instrumentação automática é preferida para evitar duplicação; correlation ID permanece operacional e separado, enquanto o trace ID OpenTelemetry se torna a identidade técnica única; nomes e atributos são estáveis, limitados e sem IDs, payloads ou credenciais, rejeições de negócio não são marcadas automaticamente como erro, retries síncronos criam spans por tentativa e redeliveries assíncronas podem iniciar novo trace com link ao contexto original; Tempo armazena traces locais, Grafana exibe waterfall, logs fornecem detalhes e métricas indicam onde investigar, enquanto testes validam propagation, parents, links, durations, sampling, data quality e segurança, deixando para a aula 566 a definição de alertas, severidades, roteamento e notificações.
```
