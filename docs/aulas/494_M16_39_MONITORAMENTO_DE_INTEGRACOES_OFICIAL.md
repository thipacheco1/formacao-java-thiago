# 494 - M16.39 - Monitoramento de integracoes

## Apresentação da aula

Na aula 493, você conectou os logs de uma jornada distribuída por meio de:

```text
correlationId;

messageId;

causationId;

replayRunId;

topic;

partition;

offset.
```

Agora os logs permitem responder:

```text
qual requisição originou o evento?

qual mensagem causou a próxima?

qual record foi consumido?

qual execução de replay
processou o histórico?
```

Logs correlacionados são essenciais para investigar um caso específico.

Eles não respondem sozinhos a perguntas como:

```text
quantas publicações falharam
nos últimos quinze minutos?

qual é a latência do publisher?

o backlog da Outbox está crescendo?

qual é a idade
do item mais antigo da Inbox?

o consumer lag está aumentando?

quantas poison messages
foram isoladas?

qual percentual
de mensagens termina com sucesso?

a integração está dentro do SLO?
```

Essas perguntas pertencem ao monitoramento.

A pergunta central desta aula será:

```text
como transformar
o comportamento das integrações

em métricas, SLIs,
dashboards e alertas

sem criar séries
de alta cardinalidade
ou alarmes inúteis?
```

A solução será construída com:

```text
Spring Boot Actuator;

Micrometer;

Prometheus endpoint;

counters;

timers;

gauges;

backlog age;

health indicators;

SLIs;

SLOs;

alert rules;

dashboard specification.
```

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

A instrumentação cobrirá os fluxos construídos nas aulas anteriores:

```text
Outbox;

Kafka producer;

Kafka consumer;

Inbox;

poison messages;

deduplicação;

replay.
```

O monitoramento responderá sobre volume, erros, latência e acúmulo de trabalho.

Essas dimensões lembram sinais clássicos de operação, mas serão aplicadas diretamente ao contexto da formação.

A aula criará métricas como:

```text
integration.messages;

integration.operation.duration;

integration.outbox.pending;

integration.outbox.failed;

integration.outbox.oldest.age;

integration.inbox.ready;

integration.inbox.retry.wait;

integration.inbox.failed.permanent;

integration.inbox.oldest.age;

integration.poison.messages;

integration.dedup.duplicates;

integration.replay.jobs.
```

No endpoint Prometheus, os nomes aparecem normalizados.

Exemplo:

```text
integration_messages_total;

integration_operation_duration_seconds;

integration_outbox_pending;

integration_outbox_oldest_age_seconds.
```

O monitoramento também utilizará métricas nativas dos clientes Kafka quando estiverem disponíveis no `MeterRegistry`.

A aplicação não criará uma série por:

- correlation ID;
- message ID;
- order ID;
- event ID;
- replay run ID;
- texto da exception;
- payload;
- usuário;
- URL completa.

Esses valores possuem alta cardinalidade.

Eles pertencem aos logs correlacionados, não às tags de métricas.

A aula não instalará:

- Prometheus Server;
- Grafana;
- Alertmanager;
- OpenTelemetry Collector;
- Jaeger;
- Tempo;
- Loki;
- Elasticsearch;
- agente de infraestrutura.

Ela preparará:

- endpoint de métricas;
- instrumentação;
- testes;
- especificação de dashboard;
- regras de alerta exemplificativas;
- política de cardinalidade;
- runbook inicial.

Os thresholds serão exemplos de laboratório. Produção exige baseline, capacidade, volume, SLO, owner e severidade aprovados.

Outro ponto importante será:

```text
alerta não deve existir
apenas porque uma métrica existe.
```

Um bom alerta precisa indicar:

- impacto;
- urgência;
- ação possível;
- owner;
- runbook;
- condição sustentada;
- proteção contra ruído.

A próxima aula será:

```text
495 - M16.40 - Microsservicos vs monolito modular
```

Portanto, esta aula encerrará o aprofundamento operacional das integrações e não antecipará a decisão arquitetural entre distribuição e modularização.

Ao final, você deverá explicar:

```text
a diferença entre log,
métrica e trace;

a diferença entre counter,
timer e gauge;

o que é SLI;

o que é SLO;

por que backlog age
pode ser mais útil
do que apenas backlog count;

por que Kafka lag
não substitui Inbox backlog;

por que correlationId
não pode virar tag;

como medir Outbox,
Inbox, poison e replay;

como criar alertas acionáveis;

por que monitoramento
não é apenas um dashboard.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
492:
Reprocessamento seguro.

493:
Logs de correlacao em integracoes.

494:
Monitoramento de integracoes.

495:
Microsservicos vs monolito modular.

496:
Bounded contexts.
```

A aula 493 respondeu:

```text
como localizar os logs
de uma mesma jornada?
```

A aula 494 responderá:

```text
como perceber
que o sistema está degradando
antes de uma investigação individual?
```

Nesta aula:

```text
Actuator:
sim.

Micrometer:
sim.

Prometheus endpoint:
sim.

counters:
sim.

timers:
sim.

gauges:
sim.

Kafka metrics:
sim.

Outbox metrics:
sim.

Inbox metrics:
sim.

poison metrics:
sim.

replay metrics:
sim.

health indicator:
sim.

SLI:
sim.

SLO:
sim.

alertas:
sim.

dashboard:
especificado.

cardinalidade:
sim.

Prometheus Server:
não.

Grafana:
não.

tracing:
não.

arquitetura de microsserviços:
não antecipada.
```

A regra central será:

```text
métricas mostram tendência
e impacto agregado;

logs explicam casos;

traces mostram o caminho;

cada sinal possui
uma responsabilidade.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/kafka
└── monitoring
    ├── IntegrationMetricNames.java
    ├── IntegrationMetrics.java
    ├── IntegrationOperation.java
    ├── backlog
    │   ├── IntegrationBacklogMetrics.java
    │   ├── IntegrationBacklogSnapshot.java
    │   └── IntegrationBacklogSnapshotSource.java
    ├── health
    │   └── IntegrationBacklogHealthIndicator.java
    └── instrumentation
        ├── MonitoredInboxProcessor.java
        ├── MonitoredOutboxPublisher.java
        ├── PoisonMonitoringService.java
        └── ReplayMonitoringService.java
```

Documentação:

```text
docs/architecture/monitoring
├── INTEGRATION_MONITORING_POLICY.md
├── INTEGRATION_SLI_SLO.md
├── INTEGRATION_DASHBOARD_SPEC.md
├── INTEGRATION_ALERT_RUNBOOK.md
└── prometheus
    └── integration-alert-rules.yml
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/monitoring
├── IntegrationMetricsTest.java
├── IntegrationBacklogMetricsTest.java
├── IntegrationBacklogHealthIndicatorTest.java
└── IntegrationCardinalityPolicyTest.java
```

Você irá:

1. adicionar Actuator;
2. adicionar registry Prometheus;
3. configurar endpoints;
4. definir nomes de métricas;
5. definir tags permitidas;
6. criar counters;
7. criar timers;
8. criar gauges;
9. medir publicação Outbox;
10. medir consumo;
11. medir poison messages;
12. medir duplicatas;
13. medir replay;
14. medir backlog da Outbox;
15. medir backlog da Inbox;
16. medir idade do item mais antigo;
17. descobrir métricas Kafka;
18. criar health indicator;
19. definir SLIs;
20. propor SLOs de laboratório;
21. criar dashboard;
22. criar alert rules;
23. criar runbook;
24. testar métricas;
25. validar cardinalidade;
26. executar o gate;
27. commitar;
28. preparar a comparação arquitetural da aula 495.

---

## Conceito essencial

### Logs

Logs registram eventos detalhados.

Eles ajudam a responder:

```text
o que aconteceu
com a jornada C-1?
```

São adequados para:

- contexto;
- causa;
- stacktrace;
- correlation ID;
- partition e offset;
- detalhes limitados;
- investigação.

---

### Métricas

Métricas agregam medidas numéricas ao longo do tempo.

Elas ajudam a responder:

```text
quantos erros existem?

qual é a taxa?

qual é a duração?

o backlog está crescendo?
```

São adequadas para:

- dashboards;
- tendências;
- alertas;
- capacidade;
- SLOs.

---

### Traces

Traces conectam spans de uma operação distribuída.

Elas ajudam a responder:

```text
onde a jornada gastou tempo?
```

Tracing não será implementado nesta aula.

---

### Counter

Counter cresce monotonicamente.

Exemplos:

```text
mensagens processadas;

falhas;

poison messages;

duplicatas;

retries.
```

Não use counter para representar:

```text
quantidade atual de pendentes.
```

---

### Gauge

Gauge representa um valor atual que pode subir ou descer.

Exemplos:

```text
Outbox pendente;

Inbox pronta;

replays ativos;

idade do item mais antigo.
```

Gauge precisa de uma fonte atualizável.

---

### Timer

Timer mede:

- quantidade de operações;
- duração total;
- distribuição de duração;
- máximos conforme registry.

Exemplos:

```text
tempo de publicação;

tempo de processamento;

tempo de claim;

tempo de replay por record.
```

Timer já possui count.

Não crie counter duplicado sem motivo operacional.

---

### Tag

Tag divide uma métrica em séries.

Exemplo:

```text
component=outbox;

operation=publish;

outcome=success;

eventType=orders.created.v1.
```

Cada combinação gera uma série.

Mais valores significam mais cardinalidade.

---

### Alta cardinalidade

Tags proibidas:

```text
correlationId;

messageId;

eventId;

orderId;

customerId;

userId;

replayRunId;

exceptionMessage;

rawUrl;

payload.
```

Esses valores podem gerar milhões de séries.

---

### Tags permitidas

Tags com vocabulário controlado:

```text
service;

component;

operation;

outcome;

eventType;

reasonCode;

topic allowlisted;

consumerGroup allowlisted;

mode.
```

Mesmo tags permitidas precisam de limite.

---

### SLI

Service Level Indicator é uma medida do comportamento observado.

Exemplos:

```text
publication success ratio;

processing success ratio;

p95 publication latency;

oldest Outbox age;

oldest Inbox age;

consumer lag;

poison message rate.
```

---

### SLO

Service Level Objective é um objetivo para um SLI.

Exemplo de laboratório:

```text
99,5% das publicações
concluídas com sucesso
em janela de 30 minutos.
```

Outro:

```text
p95 da publicação
abaixo de dois segundos.
```

Produção precisa de validação.

---

### SLA

SLA é um compromisso formal ou contratual.

Nem todo SLO interno é um SLA.

Não use os termos como sinônimos.

---

### Backlog count

Backlog count mostra quantos itens aguardam.

Ele não mostra há quanto tempo esperam.

Exemplo:

```text
100 eventos criados
há cinco segundos
```

pode ser normal.

```text
1 evento pendente
há três horas
```

pode ser crítico.

---

### Backlog age

Backlog age mede a idade do item mais antigo elegível.

É um SLI importante para:

- Outbox;
- Inbox;
- replay;
- filas;
- jobs.

Use count e age juntos.

---

### Consumer lag

Kafka consumer lag representa a distância entre:

```text
log end offset;

committed offset
do consumer group.
```

Lag alto pode significar:

- consumer lento;
- consumer parado;
- throughput insuficiente;
- rebalance;
- downstream lento;
- erro repetido.

Lag zero não significa que o efeito terminou quando existe Inbox Pattern.

---

### Inbox backlog

No Inbox Pattern:

```text
consumer confirma a recepção;

Kafka lag pode cair;

worker ainda processa.
```

Por isso, monitore:

```text
Kafka lag;

Inbox RECEIVED;

Inbox RETRY_WAIT;

Inbox oldest age.
```

---

### Alerta acionável

Um alerta precisa responder:

```text
o que está impactado?

qual é a severidade?

há quanto tempo?

qual owner?

qual runbook?

qual ação inicial?
```

Evite alertar por um único erro isolado sem contexto.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

---

### 2. Adicionar dependências

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
    <scope>runtime</scope>
</dependency>
```

As versões permanecem gerenciadas pelo Spring Boot.

---

### 3. Configurar Actuator

No `application.yaml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include:
          - "health"
          - "info"
          - "metrics"
          - "prometheus"

  endpoint:
    health:
      show-details: "when_authorized"

  metrics:
    tags:
      application: "${spring.application.name:kafka-orders-lab}"

    distribution:
      percentiles-histogram:
        integration.operation.duration: true

      slo:
        integration.operation.duration:
          - "100ms"
          - "500ms"
          - "1s"
          - "2s"
          - "5s"
```

Não exponha todos os endpoints por padrão.

---

### 4. Validar endpoints

Inicie:

```powershell
.\mvnw.cmd spring-boot:run
```

Consulte:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health"
```

Depois:

```powershell
Invoke-WebRequest `
  "http://localhost:8084/actuator/prometheus"
```

Procure:

```text
jvm_;

process_;

http_server_requests;

kafka_;
```

Os nomes exatos dependem dos binders ativos.

Use `/actuator/metrics` para descoberta.

---

### 5. Criar nomes de métricas

Arquivo:

```text
IntegrationMetricNames.java
```

```java
package br.com.formacao.m16.kafka.monitoring;

public final class IntegrationMetricNames {

    public static final String MESSAGES =
        "integration.messages";

    public static final String OPERATION_DURATION =
        "integration.operation.duration";

    public static final String POISON_MESSAGES =
        "integration.poison.messages";

    public static final String DUPLICATES =
        "integration.dedup.duplicates";

    public static final String REPLAY_RECORDS =
        "integration.replay.records";

    public static final String OUTBOX_PENDING =
        "integration.outbox.pending";

    public static final String OUTBOX_FAILED =
        "integration.outbox.failed";

    public static final String OUTBOX_OLDEST_AGE =
        "integration.outbox.oldest.age";

    public static final String INBOX_READY =
        "integration.inbox.ready";

    public static final String INBOX_RETRY_WAIT =
        "integration.inbox.retry.wait";

    public static final String INBOX_FAILED_PERMANENT =
        "integration.inbox.failed.permanent";

    public static final String INBOX_OLDEST_AGE =
        "integration.inbox.oldest.age";

    private IntegrationMetricNames() {
    }
}
```

---

### 6. Criar contexto de operação

Arquivo:

```text
IntegrationOperation.java
```

```java
package br.com.formacao.m16.kafka.monitoring;

import io.micrometer.core.instrument.Timer;

public record IntegrationOperation(
    Timer.Sample sample,
    String component,
    String operation,
    String eventType
) {
}
```

---

### 7. Criar IntegrationMetrics

Arquivo:

```text
IntegrationMetrics.java
```

```java
package br.com.formacao.m16.kafka.monitoring;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tag;
import io.micrometer.core.instrument.Tags;
import io.micrometer.core.instrument.Timer;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class IntegrationMetrics {

    private final MeterRegistry registry;

    public IntegrationMetrics(
        MeterRegistry registry
    ) {
        this.registry = registry;
    }

    public IntegrationOperation start(
        String component,
        String operation,
        String eventType
    ) {
        return new IntegrationOperation(
            Timer.start(registry),
            component,
            operation,
            normalizeEventType(eventType)
        );
    }

    public void success(
        IntegrationOperation operation
    ) {
        finish(
            operation,
            "success",
            "none"
        );
    }

    public void failure(
        IntegrationOperation operation,
        String reasonCode
    ) {
        finish(
            operation,
            "failure",
            normalizeReason(reasonCode)
        );
    }

    public void incrementPoison(
        String category
    ) {
        Counter.builder(
                IntegrationMetricNames
                    .POISON_MESSAGES
            )
            .tag(
                "category",
                normalizeReason(category)
            )
            .register(registry)
            .increment();
    }

    public void incrementDuplicate(
        String consumer
    ) {
        Counter.builder(
                IntegrationMetricNames
                    .DUPLICATES
            )
            .tag(
                "consumer",
                normalizeConsumer(consumer)
            )
            .register(registry)
            .increment();
    }

    public void incrementReplay(
        String mode,
        String outcome
    ) {
        Counter.builder(
                IntegrationMetricNames
                    .REPLAY_RECORDS
            )
            .tags(
                "mode",
                normalizeMode(mode),
                "outcome",
                normalizeOutcome(outcome)
            )
            .register(registry)
            .increment();
    }

    private void finish(
        IntegrationOperation operation,
        String outcome,
        String reasonCode
    ) {
        Tags tags =
            Tags.of(
                List.of(
                    Tag.of(
                        "component",
                        operation.component()
                    ),
                    Tag.of(
                        "operation",
                        operation.operation()
                    ),
                    Tag.of(
                        "eventType",
                        operation.eventType()
                    ),
                    Tag.of(
                        "outcome",
                        outcome
                    ),
                    Tag.of(
                        "reasonCode",
                        reasonCode
                    )
                )
            );

        operation
            .sample()
            .stop(
                Timer.builder(
                        IntegrationMetricNames
                            .OPERATION_DURATION
                    )
                    .tags(tags)
                    .register(registry)
            );

        Counter.builder(
                IntegrationMetricNames
                    .MESSAGES
            )
            .tags(tags)
            .register(registry)
            .increment();
    }

    private String normalizeEventType(
        String value
    ) {
        return value == null
            ? "unknown"
            : value;
    }

    private String normalizeReason(
        String value
    ) {
        return value == null
            ? "unknown"
            : value;
    }

    private String normalizeConsumer(
        String value
    ) {
        return value == null
            ? "unknown"
            : value;
    }

    private String normalizeMode(
        String value
    ) {
        return value == null
            ? "unknown"
            : value;
    }

    private String normalizeOutcome(
        String value
    ) {
        return value == null
            ? "unknown"
            : value;
    }
}
```

Em produção, `normalize` deve validar against allowlists.

Não aceite texto arbitrário como tag.

---

### 8. Instrumentar Outbox

Crie um decorator ou altere o publisher:

```java
IntegrationOperation operation =
    metrics.start(
        "outbox",
        "publish",
        publication.eventType()
    );

try {
    PublishedKafkaRecord result =
        delegate.publish(
            publication,
            timeoutSeconds
        );

    metrics.success(operation);

    return result;
} catch (Exception exception) {
    metrics.failure(
        operation,
        "kafka_send_failed"
    );

    throw exception;
}
```

Não use:

```text
exception.getMessage()
```

como tag.

---

### 9. Instrumentar Inbox

No worker:

```java
IntegrationOperation operation =
    metrics.start(
        "inbox",
        "process",
        item.eventType()
    );

try {
    processingService.process(
        item,
        workerId
    );

    metrics.success(operation);
} catch (
    InboxPermanentProcessingException exception
) {
    metrics.failure(
        operation,
        "permanent_failure"
    );

    throw exception;
} catch (Exception exception) {
    metrics.failure(
        operation,
        "transient_failure"
    );

    throw exception;
}
```

---

### 10. Instrumentar poison messages

Quando a mensagem for enviada para quarentena:

```java
metrics.incrementPoison(
    category.name()
);
```

Categorias já são um enum controlado.

Exemplos:

```text
MALFORMED_JSON;

CONTRACT_VIOLATION;

UNSUPPORTED_EVENT_VERSION;

TRANSIENT_RETRIES_EXHAUSTED.
```

---

### 11. Instrumentar duplicatas

Quando a Inbox ou o consumer idempotente detectar duplicata:

```java
metrics.incrementDuplicate(
    "order-created-inbox-v1"
);
```

O consumer name deve vir de uma lista controlada.

---

### 12. Instrumentar replay

No processor:

```java
metrics.incrementReplay(
    mode.name(),
    result.outcome().name()
);
```

Não use `runId` como tag.

Para investigar uma execução específica, use logs com `replayRunId`.

---

### 13. Criar snapshot de backlog

Arquivo:

```text
IntegrationBacklogSnapshot.java
```

```java
package br.com.formacao.m16.kafka.monitoring.backlog;

import java.time.Instant;

public record IntegrationBacklogSnapshot(
    long outboxPending,
    long outboxFailed,
    Instant oldestOutboxReadyAt,
    long inboxReady,
    long inboxRetryWait,
    long inboxFailedPermanent,
    Instant oldestInboxReadyAt,
    long replayRunning,
    long replayFailed
) {
}
```

---

### 14. Criar source do snapshot

```java
package br.com.formacao.m16.kafka.monitoring.backlog;

public interface IntegrationBacklogSnapshotSource {

    IntegrationBacklogSnapshot read();
}
```

Uma implementação JPA consulta os repositories criados nas aulas anteriores.

Queries precisam ser agregadas e indexadas.

Não carregue todas as entidades para contar.

---

### 15. Adicionar queries de backlog

Nos repositories, adicione queries específicas.

Exemplo Outbox:

```java
long countByStatus(
    OutboxStatus status
);

@Query("""
    select min(event.createdAt)
      from OutboxEventEntity event
     where event.status in :statuses
    """)
Instant findOldestReadyAt(
    List<OutboxStatus> statuses
);
```

Exemplo Inbox:

```java
long countByStatus(
    InboxMessageStatus status
);

@Query("""
    select min(message.receivedAt)
      from InboxMessageEntity message
     where message.status in :statuses
    """)
Instant findOldestReadyAt(
    List<InboxMessageStatus> statuses
);
```

Ajuste retorno para `Optional<Instant>` quando necessário.

---

### 16. Criar IntegrationBacklogMetrics

Arquivo:

```text
IntegrationBacklogMetrics.java
```

```java
package br.com.formacao.m16.kafka.monitoring.backlog;

import br.com.formacao.m16.kafka.monitoring.IntegrationMetricNames;
import io.micrometer.core.instrument.MeterRegistry;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class IntegrationBacklogMetrics {

    private final IntegrationBacklogSnapshotSource source;
    private final Clock clock;

    private final AtomicLong outboxPending =
        new AtomicLong();

    private final AtomicLong outboxFailed =
        new AtomicLong();

    private final AtomicLong outboxOldestAge =
        new AtomicLong();

    private final AtomicLong inboxReady =
        new AtomicLong();

    private final AtomicLong inboxRetryWait =
        new AtomicLong();

    private final AtomicLong inboxFailedPermanent =
        new AtomicLong();

    private final AtomicLong inboxOldestAge =
        new AtomicLong();

    public IntegrationBacklogMetrics(
        IntegrationBacklogSnapshotSource source,
        MeterRegistry registry
    ) {
        this.source = source;
        this.clock = Clock.systemUTC();

        registry.gauge(
            IntegrationMetricNames.OUTBOX_PENDING,
            outboxPending
        );

        registry.gauge(
            IntegrationMetricNames.OUTBOX_FAILED,
            outboxFailed
        );

        registry.gauge(
            IntegrationMetricNames.OUTBOX_OLDEST_AGE,
            outboxOldestAge
        );

        registry.gauge(
            IntegrationMetricNames.INBOX_READY,
            inboxReady
        );

        registry.gauge(
            IntegrationMetricNames.INBOX_RETRY_WAIT,
            inboxRetryWait
        );

        registry.gauge(
            IntegrationMetricNames
                .INBOX_FAILED_PERMANENT,
            inboxFailedPermanent
        );

        registry.gauge(
            IntegrationMetricNames.INBOX_OLDEST_AGE,
            inboxOldestAge
        );
    }

    @Scheduled(
        fixedDelayString =
            "${app.monitoring.backlog-refresh-ms:5000}"
    )
    public void refresh() {
        IntegrationBacklogSnapshot snapshot =
            source.read();

        Instant now = clock.instant();

        outboxPending.set(
            snapshot.outboxPending()
        );

        outboxFailed.set(
            snapshot.outboxFailed()
        );

        outboxOldestAge.set(
            ageSeconds(
                snapshot.oldestOutboxReadyAt(),
                now
            )
        );

        inboxReady.set(
            snapshot.inboxReady()
        );

        inboxRetryWait.set(
            snapshot.inboxRetryWait()
        );

        inboxFailedPermanent.set(
            snapshot.inboxFailedPermanent()
        );

        inboxOldestAge.set(
            ageSeconds(
                snapshot.oldestInboxReadyAt(),
                now
            )
        );
    }

    private long ageSeconds(
        Instant oldest,
        Instant now
    ) {
        if (oldest == null) {
            return 0;
        }

        return Math.max(
            0,
            Duration
                .between(oldest, now)
                .toSeconds()
        );
    }
}
```

O scheduler apenas atualiza valores agregados.

---

### 17. Medir replay jobs

Adicione gauges:

```text
integration.replay.running;

integration.replay.failed.
```

Não use um gauge por `runId`.

O detalhe por execução permanece no endpoint e nos logs.

---

### 18. Descobrir métricas Kafka

Consulte:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/metrics"
```

Procure nomes que contenham:

```text
kafka;

consumer;

producer;

request;

records;

latency.
```

Depois consulte uma métrica específica:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/metrics/<nome>"
```

Não codifique dashboards antes de confirmar os nomes reais no ambiente.

---

### 19. Consumer lag

Há três caminhos comuns:

```text
métricas do cliente Kafka;

exporter dedicado;

consulta administrativa.
```

Para produção, prefira uma fonte central capaz de observar todos os groups, inclusive quando a aplicação está desligada.

A métrica interna da aplicação pode desaparecer justamente durante uma falha total.

---

### 20. Criar health indicator

Arquivo:

```text
IntegrationBacklogHealthIndicator.java
```

```java
package br.com.formacao.m16.kafka.monitoring.health;

import br.com.formacao.m16.kafka.monitoring.backlog.IntegrationBacklogSnapshot;
import br.com.formacao.m16.kafka.monitoring.backlog.IntegrationBacklogSnapshotSource;
import java.time.Duration;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class IntegrationBacklogHealthIndicator
        implements HealthIndicator {

    private final IntegrationBacklogSnapshotSource source;
    private final long criticalAgeSeconds;

    public IntegrationBacklogHealthIndicator(
        IntegrationBacklogSnapshotSource source,
        @Value(
            "${app.monitoring.critical-backlog-age-seconds:300}"
        )
        long criticalAgeSeconds
    ) {
        this.source = source;
        this.criticalAgeSeconds =
            criticalAgeSeconds;
    }

    @Override
    public Health health() {
        IntegrationBacklogSnapshot snapshot =
            source.read();

        long outboxAge =
            age(snapshot.oldestOutboxReadyAt());

        long inboxAge =
            age(snapshot.oldestInboxReadyAt());

        Health.Builder builder =
            outboxAge > criticalAgeSeconds
                || inboxAge > criticalAgeSeconds
                ? Health.down()
                : Health.up();

        return builder
            .withDetail(
                "outboxPending",
                snapshot.outboxPending()
            )
            .withDetail(
                "outboxOldestAgeSeconds",
                outboxAge
            )
            .withDetail(
                "inboxReady",
                snapshot.inboxReady()
            )
            .withDetail(
                "inboxOldestAgeSeconds",
                inboxAge
            )
            .build();
    }

    private long age(
        Instant value
    ) {
        return value == null
            ? 0
            : Math.max(
                0,
                Duration
                    .between(
                        value,
                        Instant.now()
                    )
                    .toSeconds()
            );
    }
}
```

Em produção, avalie se backlog deve derrubar readiness.

Nem toda degradação deve retirar a instância do balanceador.

---

### 21. Definir SLIs

Arquivo:

```text
docs/architecture/monitoring/INTEGRATION_SLI_SLO.md
```

SLIs:

```text
Outbox publication success ratio;

Outbox publication p95;

Outbox oldest pending age;

Inbox processing success ratio;

Inbox processing p95;

Inbox oldest ready age;

consumer lag;

poison message rate;

duplicate rate;

replay failure rate.
```

---

### 22. Definir SLOs de laboratório

Exemplo:

```markdown
| SLI | Objetivo de laboratório |
|---|---|
| Outbox publication success | >= 99% em 30 min |
| Outbox oldest age | < 60 s |
| Inbox processing success | >= 99% em 30 min |
| Inbox oldest age | < 120 s |
| Poison messages | 0 esperado |
| Replay failed jobs | 0 |
```

Marque explicitamente:

```text
não é SLA;

não é threshold produtivo.
```

---

### 23. Criar dashboard spec

Arquivo:

```text
INTEGRATION_DASHBOARD_SPEC.md
```

Painéis:

```text
1. Overview.

2. Producer.

3. Kafka consumers.

4. Outbox.

5. Inbox.

6. Poison and retries.

7. Deduplication.

8. Replay.

9. Health and dependencies.
```

---

### 28. Criar alert rules

Arquivo:

```text
docs/architecture/monitoring/prometheus/integration-alert-rules.yml
```

Exemplo:

```yaml
groups:
  - name: integration-lab
    rules:
      - alert: OutboxOldestPendingTooHigh
        expr: integration_outbox_oldest_age_seconds > 60
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Outbox com evento antigo"
          runbook: "INTEGRATION_ALERT_RUNBOOK.md#outbox"

      - alert: InboxOldestReadyTooHigh
        expr: integration_inbox_oldest_age_seconds > 120
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Inbox acumulando processamento"
          runbook: "INTEGRATION_ALERT_RUNBOOK.md#inbox"

      - alert: PoisonMessagesDetected
        expr: increase(integration_poison_messages_total[10m]) > 0
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Poison message detectada"
          runbook: "INTEGRATION_ALERT_RUNBOOK.md#poison"
```

Os nomes e queries precisam ser validados contra o endpoint real.

---

### 29. Criar alerta de ausência de progresso

A condição mais útil pode combinar:

```text
backlog > 0;

taxa de sucesso = 0;

janela sustentada.
```

Exemplo conceitual:

```promql
integration_outbox_pending > 0
and
rate(
  integration_messages_total{
    component="outbox",
    operation="publish",
    outcome="success"
  }[5m]
) == 0
```

Isso reduz falsos positivos em períodos sem trabalho.

---

### 30. Criar runbook

Arquivo:

```text
INTEGRATION_ALERT_RUNBOOK.md
```

Para cada alerta:

- significado;
- impacto;
- queries;
- logs;
- correlation search;
- dependências;
- primeira ação;
- ações proibidas;
- escalation owner;
- encerramento.

Exemplo Outbox:

1. consultar pending e oldest age;
2. verificar publication errors;
3. verificar Kafka;
4. verificar scheduler;
5. verificar stale claims;
6. não apagar registros;
7. não marcar PUBLISHED manualmente;
8. restaurar publisher;
9. confirmar redução do backlog.

---

### 31. Criar política de cardinalidade

Arquivo:

```text
INTEGRATION_MONITORING_POLICY.md
```

Tabela:

```markdown
| Campo | Métrica tag | Log field |
|---|---:|---:|
| component | Sim | Sim |
| operation | Sim | Sim |
| outcome | Sim | Sim |
| eventType controlado | Sim | Sim |
| reasonCode controlado | Sim | Sim |
| correlationId | Não | Sim |
| messageId | Não | Sim |
| eventId | Não | Sim |
| orderId | Não | Quando necessário |
| exceptionMessage | Não | Limitada |
| payload | Não | Não por padrão |
```

---

### 32. Testar IntegrationMetrics

Com `SimpleMeterRegistry`:

```java
@Test
void shouldRecordSuccessfulOperation() {
    SimpleMeterRegistry registry =
        new SimpleMeterRegistry();

    IntegrationMetrics metrics =
        new IntegrationMetrics(registry);

    IntegrationOperation operation =
        metrics.start(
            "outbox",
            "publish",
            "orders.created.v1"
        );

    metrics.success(operation);

    double count =
        registry
            .find(
                IntegrationMetricNames.MESSAGES
            )
            .tags(
                "component",
                "outbox",
                "operation",
                "publish",
                "eventType",
                "orders.created.v1",
                "outcome",
                "success",
                "reasonCode",
                "none"
            )
            .counter()
            .count();

    assertThat(count)
        .isEqualTo(1);
}
```

Valide também o timer.

---

### 33. Testar failure reason

Confirme que:

```text
reasonCode:
kafka_send_failed.
```

Não use texto da exception.

Crie um teste que passa uma mensagem de erro diferente e verifica que nenhuma tag dinâmica apareceu.

---

### 34. Testar gauges

Use um source fake.

Primeiro snapshot:

```text
outboxPending:
10.

oldest:
30 segundos.
```

Segundo snapshot:

```text
outboxPending:
2.

oldest:
5 segundos.
```

Confirme que gauges sobem e descem.

---

### 35. Testar health indicator

Cenários:

```text
sem backlog:
UP.

backlog abaixo do threshold:
UP.

Outbox age acima:
DOWN.

Inbox age acima:
DOWN.
```

Lembre que a política de readiness pode ser diferente.

---

### 36. Testar cardinalidade

Crie um teste que inspeciona as tags registradas e proíbe nomes:

```text
correlationId;

messageId;

eventId;

orderId;

replayRunId;

exceptionMessage.
```

O teste protege futuras alterações.

---

### 37. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=IntegrationMetricsTest,IntegrationBacklogMetricsTest,IntegrationBacklogHealthIndicatorTest,IntegrationCardinalityPolicyTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 38. Inspecionar Prometheus endpoint

```powershell
$response =
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"

$response.Content |
  Select-String `
    "integration_"
```

Execute mensagens válidas, falhas controladas, duplicatas e poison messages.

Confirme que as séries mudam.

---

## Entendendo o que foi feito

### As integrações ganharam sinais agregados

Agora é possível perceber degradação sem começar por um caso individual.

### Counters mediram acontecimentos

Sucessos, erros, poison messages e duplicatas ficaram acumulados.

### Timers mediram duração

Publicação e processamento ganharam distribuição de latência.

### Gauges mediram estado atual

Backlogs e idade do item mais antigo ficaram visíveis.

### Kafka lag foi colocado no contexto correto

Ele mede backlog no broker, não o trabalho depois da Inbox.

### Outbox e Inbox ganharam idade

Count e age evitam conclusões incompletas.

### Cardinalidade foi protegida

IDs únicos ficaram nos logs.

### SLIs e SLOs foram separados

A medida observada não foi confundida com o objetivo.

### Alertas ganharam ação

Cada condição aponta para um runbook.

### Monitoramento virou processo

Métrica, dashboard, alerta e resposta operacional passaram a formar um conjunto.

---

## Erros comuns importantes

### Criar uma métrica por correlation ID

A cardinalidade explode.

### Usar exception message como tag

Cada texto pode criar uma série.

### Medir apenas sucesso

Falhas e duração permanecem invisíveis.

### Medir apenas backlog count

Um item antigo pode ficar escondido.

### Medir apenas consumer lag

Inbox pode continuar acumulada.

### Expor todos os Actuator endpoints

A superfície de segurança aumenta.

### Criar alerta sem `for`

Picos curtos geram ruído.

### Alertar sem runbook

A equipe sabe que falhou, mas não como agir.

### Derrubar readiness por qualquer backlog

O balanceador pode piorar a situação.

### Tratar SLO de laboratório como SLA

O valor ainda não foi validado.

### Criar dashboard antes de validar nomes

Queries podem apontar para métricas inexistentes.

### Usar logs como única monitoração

Não existe visão agregada nem alerta confiável.

---

## Comandos úteis

### Health

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health"
```

### Listar métricas

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/metrics"
```

### Prometheus

```powershell
Invoke-WebRequest `
  "http://localhost:8084/actuator/prometheus"
```

### Buscar métricas próprias

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "integration_"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Actuator

Exponha health, metrics e Prometheus.

### Parte 2 — Counters

Meça success, failure e poison.

### Parte 3 — Timers

Meça publication e processing.

### Parte 4 — Gauges

Meça Outbox e Inbox.

### Parte 5 — Kafka

Descubra métricas do client.

### Parte 6 — SLIs

Defina indicadores.

### Parte 7 — SLOs

Proponha objetivos de laboratório.

### Parte 8 — Dashboard

Organize painéis.

### Parte 9 — Alertas

Crie regras acionáveis.

### Parte 10 — Cardinalidade

Teste tags proibidas.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 493 foi preservada;
- logs foram diferenciados de métricas;
- traces foram contextualizadas;
- counters foram explicados;
- gauges foram explicados;
- timers foram explicados;
- distribution summary foi contextualizado;
- tags foram explicadas;
- cardinalidade foi explicada;
- tags permitidas foram definidas;
- tags proibidas foram definidas;
- correlationId não virou tag;
- messageId não virou tag;
- eventId não virou tag;
- orderId não virou tag;
- replayRunId não virou tag;
- exception message não virou tag;
- Actuator foi adicionado;
- Prometheus registry foi adicionado;
- versões ficaram sob Spring Boot;
- endpoints foram limitados;
- health foi exposto;
- metrics foi exposto;
- prometheus foi exposto;
- métricas globais receberam application tag;
- histogram de duração foi configurado;
- nomes de métricas foram centralizados;
- IntegrationMetrics foi criado;
- success foi medido;
- failure foi medido;
- reason codes foram controlados;
- Outbox foi instrumentada;
- Inbox foi instrumentada;
- poison messages foram instrumentadas;
- duplicatas foram instrumentadas;
- replay foi instrumentado;
- runId não foi usado como tag;
- snapshot de backlog foi criado;
- source de backlog foi criado;
- queries agregadas foram recomendadas;
- entidades completas não foram carregadas;
- Outbox pending foi medido;
- Outbox failed foi medido;
- Outbox oldest age foi medido;
- Inbox ready foi medido;
- Inbox retry wait foi medido;
- Inbox failed permanent foi medido;
- Inbox oldest age foi medido;
- replay running foi medido;
- replay failed foi medido;
- métricas Kafka foram descobertas;
- nomes de Kafka não foram presumidos;
- consumer lag foi explicado;
- fonte externa de lag foi recomendada;
- Kafka lag foi diferenciado de Inbox backlog;
- health indicator foi criado;
- threshold foi configurável;
- readiness recebeu ressalva;
- SLI foi definido;
- SLO foi definido;
- SLA foi diferenciado;
- error budget foi contextualizado;
- success ratio foi definido;
- p95 foi definido;
- backlog count foi definido;
- backlog age foi definido;
- dashboard spec foi criado;
- painel Overview foi definido;
- painel Outbox foi definido;
- painel Inbox foi definido;
- painel replay foi definido;
- alert rules foram criadas;
- alerta possui duração sustentada;
- alerta possui severity;
- alerta possui runbook;
- no-progress alert foi criado;
- runbook foi criado;
- ações proibidas foram registradas;
- política de cardinalidade foi criada;
- testes de counter foram criados;
- testes de timer foram criados;
- testes de gauge foram criados;
- testes de health foram criados;
- teste de cardinalidade foi criado;
- Prometheus Server não foi instalado;
- Grafana não foi instalado;
- tracing não foi antecipado;
- microsserviços não foram antecipados;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 495 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure riscos:

```powershell
git grep `
  -n `
  -E `
  "MeterRegistry|Counter|Timer|gauge|correlationId|messageId|eventId|orderId|reasonCode"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/monitoring `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m16): monitorar integracoes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- logs;
- payload;
- secrets;
- banco H2;
- target;
- correlation IDs reais;
- endpoint irrestrito;
- dashboard exportado com credenciais;
- thresholds produtivos não aprovados;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a integração deixou de depender apenas de investigação por logs.

O modelo ficou:

```text
logs:

qual jornada?

métricas:

qual tendência?

health:

a instância está saudável?

SLIs:

o que medir?

SLOs:

qual objetivo?

alertas:

quando agir?

runbook:

como agir?
```

Você comprovou que:

- counters medem acontecimentos acumulados;
- gauges medem estado atual;
- timers medem duração e quantidade;
- backlog count e backlog age se complementam;
- Kafka lag não mede o processamento depois da Inbox;
- Outbox, Inbox, poison, deduplicação e replay precisam de sinais próprios;
- IDs únicos pertencem aos logs, não às tags;
- alertas precisam de janela sustentada;
- dashboard sem runbook não completa a operação;
- health e readiness precisam de políticas diferentes;
- SLI, SLO e SLA não são sinônimos;
- monitoramento precisa ser validado contra o endpoint real.

A próxima aula será:

```text
495 - M16.40 - Microsservicos vs monolito modular
```

Nela, você irá:

- diferenciar monolito, monolito modular e microsserviços;
- comparar boundaries;
- comparar deploy;
- comparar dados;
- comparar comunicação;
- avaliar custo operacional;
- avaliar autonomia;
- avaliar acoplamento;
- analisar quando distribuir;
- analisar quando manter junto;
- criar uma matriz de decisão;
- preparar bounded contexts.

Nenhuma decisão de decomposição foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei Actuator e Micrometer.
- [ ] Criei counters, timers e gauges.
- [ ] Medi Outbox e Inbox.
- [ ] Medi poison, deduplicação e replay.
- [ ] Defini SLIs e SLOs.
- [ ] Criei dashboard e alertas.
- [ ] Protegi cardinalidade.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `/actuator/prometheus` retorna 404

Confirme a dependência Prometheus e a exposição do endpoint.

### Métrica própria não aparece

Ela pode ainda não ter sido registrada ou incrementada.

### Gauge fica sempre zero

O source não está retornando dados ou o scheduler não executou.

### Timer não possui percentil

Confirme histogram e se existem amostras.

### Consumer lag não aparece

O binder pode não estar ativo; use descoberta ou exporter dedicado.

### Health fica DOWN com backlog normal

Revise threshold e política de readiness.

### Prometheus cria muitas séries

Revise tags e remova IDs dinâmicos.

### Poison alert dispara em laboratório

O teste gerou poison message; silencie apenas em ambiente de teste, não removendo a métrica.

### Outbox pending existe sem alerta

A regra pode exigir idade ou ausência de progresso.

### Dashboard mostra nomes vazios

As queries podem não corresponder aos nomes normalizados.

---

## Perguntas de revisão

1. O que logs respondem?
2. O que métricas respondem?
3. O que traces respondem?
4. O que é counter?
5. O que é gauge?
6. O que é timer?
7. O que é tag?
8. O que é alta cardinalidade?
9. Correlation ID pode ser tag?
10. O que é SLI?
11. O que é SLO?
12. O que é SLA?
13. O que é backlog count?
14. O que é backlog age?
15. O que é consumer lag?
16. Lag zero garante Inbox processada?
17. O que torna alerta acionável?
18. Por que usar `for`?
19. Grafana foi instalado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Detalhes de casos.
2. Tendências agregadas.
3. Caminho e latência distribuída.
4. Valor acumulado.
5. Estado atual.
6. Quantidade e duração.
7. Dimensão da série.
8. Muitos valores distintos.
9. Não.
10. Indicador observado.
11. Objetivo do indicador.
12. Compromisso formal.
13. Quantidade aguardando.
14. Idade do mais antigo.
15. Distância entre end e committed offset.
16. Não.
17. Impacto, owner e runbook.
18. Evitar ruído transitório.
19. Não.
20. Microsservicos vs monolito modular.

---

## Desafio opcional

Crie monitoramento para o fluxo de poison message.

Requisitos:

- counter por categoria controlada;
- timer da publicação de quarentena;
- gauge de quarentena pendente quando houver store próprio;
- alerta de crescimento;
- dashboard;
- runbook;
- nenhuma tag por eventId;
- nenhuma tag por correlationId;
- nenhum payload;
- teste de cardinalidade.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 494 - M16.39 - Monitoramento de integracoes

- Continuei após os logs de correlação.
- Diferenciei logs, métricas e traces.
- Entendi counters.
- Entendi gauges.
- Entendi timers.
- Contextualizei distribution summaries.
- Entendi tags e cardinalidade.
- Defini tags permitidas.
- Proibi correlationId como tag.
- Proibi messageId como tag.
- Proibi eventId e orderId como tags.
- Proibi exception message e payload.
- Adicionei Spring Boot Actuator.
- Adicionei Micrometer Prometheus registry.
- Expus health, metrics e prometheus.
- Mantive endpoints limitados.
- Configurei application tag.
- Configurei histogram de duração.
- Centralizei nomes de métricas.
- Criei IntegrationMetrics.
- Medi success e failure.
- Usei reason codes controlados.
- Instrumentei Outbox.
- Instrumentei Inbox.
- Instrumentei poison messages.
- Instrumentei duplicatas.
- Instrumentei replay.
- Não usei replayRunId como tag.
- Criei snapshot de backlog.
- Criei gauges de Outbox.
- Criei gauges de Inbox.
- Medi idade do item mais antigo.
- Diferenciei Kafka lag de Inbox backlog.
- Descobri métricas Kafka pelo Actuator.
- Contextualizei exporter externo de lag.
- Criei health indicator.
- Mantive threshold configurável.
- Diferenciei health e readiness.
- Defini SLIs.
- Defini SLOs de laboratório.
- Diferenciei SLA.
- Contextualizei error budget.
- Criei dashboard spec.
- Criei regras de alerta.
- Criei alerta de ausência de progresso.
- Criei runbook.
- Criei política de cardinalidade.
- Testei counters, timers, gauges e health.
- Criei teste contra tags proibidas.
- Não instalei Prometheus Server ou Grafana.
- Não antecipei a decisão entre microsserviços e monolito modular.
- Próxima aula: Microsservicos vs monolito modular.
```

---

## Referência técnica curta

- Spring Boot Actuator.
- Spring Boot — Metrics.
- Micrometer — Concepts.
- Micrometer — Counters.
- Micrometer — Timers.
- Micrometer — Gauges.
- Prometheus — Metric and Label Naming.
- Prometheus — Alerting Rules.
- Google SRE — Service Level Indicators.
- Apache Kafka — Consumer Metrics.

Regra final:

```text
monitoramento de integrações combina sinais agregados e resposta operacional: counters medem acontecimentos, timers medem duração, gauges representam estado atual e tags dividem séries apenas por dimensões controladas; correlationId, messageId, eventId, orderId, replayRunId, payload e mensagens de exceção permanecem nos logs para evitar alta cardinalidade; Outbox e Inbox precisam de backlog count e oldest age, Kafka consumer lag mede trabalho anterior ao commit do group e não substitui o backlog interno, poison messages, retries, duplicatas e replay exigem métricas próprias; SLIs descrevem o comportamento observado, SLOs definem objetivos e alertas precisam de impacto, duração, owner e runbook; Actuator e Micrometer expõem a instrumentação, mas dashboards e thresholds só se tornam confiáveis depois de validar nomes, baseline e capacidade reais.
```
