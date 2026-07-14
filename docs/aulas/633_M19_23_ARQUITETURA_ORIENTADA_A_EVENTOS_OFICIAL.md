# 633 - M19.23 - Arquitetura orientada a eventos

## Apresentação da aula

Na aula 632, você aprofundou Event Sourcing conceitual.

Você modelou Event Stream, Event Store, versões, append-only, replay, snapshots, upcasters, temporal queries e integridade. Os eventos eram a fonte de verdade do `Appointment`.

Agora a pergunta muda.

Não basta mais perguntar:

```text
como persistir fatos?
```

Passamos a perguntar:

```text
como vários componentes
e contextos

reagem a fatos

sem depender
de chamadas síncronas
em cadeia?
```

Depois de `AppointmentScheduled`, componentes podem preparar notificação, atualizar painel, iniciar execução, registrar auditoria ou alimentar métricas.

Uma cadeia síncrona entre Scheduling, Notifications, Field Execution, Analytics, Audit e Portal aumenta latência, acoplamento temporal, falhas em cascata e deploy coordenado.

Arquitetura orientada a eventos usa fatos publicados para permitir que consumidores reajam de forma desacoplada.

Ela transforma dependências diretas em contratos explícitos.

A arquitetura define eventos, producers, consumers, contratos, versionamento, publicação, duplicação, ordering, retry, dead letter, lag, correlação e limites.

Evento não implica Kafka, RabbitMQ, microservice, Event Sourcing, CQRS ou ausência de transação e ownership.

A pergunta será:

```text
como desenhar
uma arquitetura por eventos

que seja confiável,
observável,
versionada
e operável

sem transformar
eventos
em integração caótica?
```

Laboratório:

```text
labs/m19/aula-633-arquitetura-orientada-a-eventos/service-scheduling-event-driven
```

Você construirá producer, contratos, envelope, broker em memória, consumers, retries, dead letter, idempotência, ordering, checkpoints, lag e testes.

O evento principal será `ServiceAppointmentScheduledV1`, consumido por notificação, execução de campo, dashboard e auditoria, junto aos eventos de reagendamento e cancelamento.

Próxima aula:

```text
634 - M19.24 - Consistencia eventual
```

A aula reconhecerá atualizações defasadas, sem aprofundar convergência, causalidade, session guarantees ou reconciliação distribuída.

Depois virá:

```text
635 - M19.25 - CAP
```

CAP, quorums, split brain e disponibilidade sob partição permanecem fora do escopo.

Regra central:

```text
arquitetura orientada a eventos
é uma arquitetura de contratos,
entrega,
reação
e operação;

não apenas
uma coleção de mensagens.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
631:
CQRS.

632:
Event Sourcing conceitual.

633:
Arquitetura orientada a eventos.

634:
Consistencia eventual.

635:
CAP.
```

A progressão é:

```text
separar leitura e escrita;

usar eventos como fonte de estado;

distribuir reações por eventos;

entender convergência posterior;

analisar trade-offs sob partição.
```

Nesta aula serão praticados producer, consumer, broker em memória, envelope, contratos, at-least-once, idempotência, ordering, retry, dead letter, outbox, lag e observabilidade. Consistência eventual e CAP não serão aprofundados.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-633-arquitetura-orientada-a-eventos/service-scheduling-event-driven
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/eventdriven
│   │           ├── contract
│   │           │   ├── IntegrationEvent.java
│   │           │   ├── EventEnvelope.java
│   │           │   ├── EventId.java
│   │           │   ├── EventType.java
│   │           │   ├── SchemaVersion.java
│   │           │   ├── CorrelationId.java
│   │           │   ├── CausationId.java
│   │           │   ├── ProducerReference.java
│   │           │   ├── ServiceAppointmentScheduledV1.java
│   │           │   ├── ServiceAppointmentRescheduledV1.java
│   │           │   └── ServiceAppointmentCancelledV1.java
│   │           ├── producer
│   │           │   ├── EventProducer.java
│   │           │   ├── AppointmentIntegrationEventTranslator.java
│   │           │   ├── AppointmentEventPublisher.java
│   │           │   ├── OutboxRecord.java
│   │           │   ├── OutboxStore.java
│   │           │   └── InMemoryOutboxStore.java
│   │           ├── broker
│   │           │   ├── EventBroker.java
│   │           │   ├── Subscription.java
│   │           │   ├── TopicName.java
│   │           │   ├── OrderingKey.java
│   │           │   ├── DeliveryAttempt.java
│   │           │   ├── InMemoryEventBroker.java
│   │           │   ├── BrokerRecord.java
│   │           │   └── BrokerClock.java
│   │           ├── consumer
│   │           │   ├── EventConsumer.java
│   │           │   ├── EventHandler.java
│   │           │   ├── IdempotencyStore.java
│   │           │   ├── ConsumerCheckpointStore.java
│   │           │   ├── InMemoryIdempotencyStore.java
│   │           │   ├── InMemoryCheckpointStore.java
│   │           │   ├── PrepareCustomerNotification.java
│   │           │   ├── PrepareFieldExecution.java
│   │           │   ├── UpdateSchedulingDashboard.java
│   │           │   └── RecordSchedulingAudit.java
│   │           ├── retry
│   │           │   ├── RetryPolicy.java
│   │           │   ├── RetryDecision.java
│   │           │   ├── ExponentialBackoff.java
│   │           │   ├── DeadLetterRecord.java
│   │           │   ├── DeadLetterStore.java
│   │           │   └── InMemoryDeadLetterStore.java
│   │           ├── observability
│   │           │   ├── EventProcessingObservation.java
│   │           │   ├── ConsumerLag.java
│   │           │   ├── EventMetrics.java
│   │           │   └── EventTrace.java
│   │           └── application
│   │               ├── EventDrivenScenarioRunner.java
│   │               ├── OutboxRelay.java
│   │               └── DeadLetterReplayService.java
│   └── test
│       └── java
│           └── br/com/formacao/eventdriven
│               ├── contract
│               │   ├── IntegrationEventContractTest.java
│               │   ├── EventEnvelopeTest.java
│               │   └── EventCompatibilityTest.java
│               ├── producer
│               │   ├── AppointmentEventPublisherTest.java
│               │   └── OutboxRelayTest.java
│               ├── broker
│               │   ├── InMemoryEventBrokerTest.java
│               │   ├── AtLeastOnceDeliveryTest.java
│               │   └── OrderingKeyTest.java
│               ├── consumer
│               │   ├── IdempotentConsumerTest.java
│               │   ├── ConsumerCheckpointTest.java
│               │   ├── PrepareCustomerNotificationTest.java
│               │   └── UpdateSchedulingDashboardTest.java
│               ├── retry
│               │   ├── RetryPolicyTest.java
│               │   ├── DeadLetterStoreTest.java
│               │   └── DeadLetterReplayTest.java
│               ├── observability
│               │   ├── ConsumerLagTest.java
│               │   └── EventTraceTest.java
│               └── architecture
│                   ├── EventDrivenBoundaryTest.java
│                   ├── DomainBrokerIndependenceTest.java
│                   ├── ProducerConsumerContractTest.java
│                   └── ConsumerIsolationTest.java
├── event-driven
│   ├── EVENT_DRIVEN_CHARTER.md
│   ├── EVENT_CATALOG.md
│   ├── PRODUCER_OWNERSHIP.md
│   ├── CONSUMER_CATALOG.md
│   ├── DELIVERY_MODEL.md
│   ├── ORDERING_POLICY.md
│   ├── IDEMPOTENCY_POLICY.md
│   ├── RETRY_POLICY.md
│   ├── DEAD_LETTER_POLICY.md
│   ├── OUTBOX_POLICY.md
│   ├── CONTRACT_EVOLUTION.md
│   ├── OBSERVABILITY.md
│   ├── SECURITY_POLICY.md
│   ├── OPERATING_MODEL.md
│   ├── FAILURE_RECOVERY.md
│   ├── TRADE_OFFS.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_EVENT_DRIVEN_QUESTIONS.md
├── contracts
│   ├── event-driven-contract.yaml
│   ├── event-envelope-policy.yaml
│   ├── producer-policy.yaml
│   ├── consumer-policy.yaml
│   ├── delivery-policy.yaml
│   ├── ordering-policy.yaml
│   ├── idempotency-policy.yaml
│   ├── retry-policy.yaml
│   ├── dead-letter-policy.yaml
│   ├── outbox-policy.yaml
│   ├── contract-evolution-policy.yaml
│   ├── observability-policy.yaml
│   ├── security-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── event-catalog-report.yaml
    ├── producer-report.yaml
    ├── consumer-report.yaml
    ├── delivery-report.yaml
    ├── retry-report.yaml
    ├── dead-letter-report.yaml
    ├── lag-report.yaml
    ├── architecture-report.yaml
    └── event-driven-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-event-driven
├── validate-event-driven-contract.ps1
├── validate-event-envelope.ps1
├── validate-producer-ownership.ps1
├── validate-consumer-catalog.ps1
├── validate-delivery-model.ps1
├── validate-ordering-policy.ps1
├── validate-idempotency-policy.ps1
├── validate-retry-policy.ps1
├── validate-dead-letter-policy.ps1
├── validate-outbox-policy.ps1
├── validate-contract-evolution.ps1
├── validate-event-observability.ps1
├── run-event-driven-tests.ps1
├── collect-event-driven-evidence.ps1
└── verify-event-driven-gate.ps1
```

---

## Conceito essencial

### Arquitetura, Producer, Consumer e Broker

A arquitetura publica fatos por contratos; producer publica, consumer processa e broker entrega por topics.

### Envelope e contrato

O envelope carrega identidade, versão, tempos, origem, correlação, causa e payload.

### Delivery, idempotência e ordering

At-least-once pode repetir; consumers idempotentes usam Event ID e ordering key em escopo limitado.

### Retry, Dead Letter, Outbox e Lag

Retry trata falha transitória, dead letter guarda falha permanente, outbox protege publicação após commit e lag mede atraso.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-633-arquitetura-orientada-a-eventos/service-scheduling-event-driven

Set-Location `
  labs/m19/aula-633-arquitetura-orientada-a-eventos/service-scheduling-event-driven
```

---

### 2. Criar Event Driven Charter

Arquivo:

```text
event-driven/EVENT_DRIVEN_CHARTER.md
```

Conteúdo:

```markdown
# Event Driven Charter

## Contexto produtor

Service Scheduling.

## Eventos públicos iniciais

- ServiceAppointmentScheduledV1;
- ServiceAppointmentRescheduledV1;
- ServiceAppointmentCancelledV1.

## Consumidores

- Customer Communication;
- Field Execution;
- Operational Dashboard;
- Audit.

## Modelo de entrega

At-least-once.

## Ordering

Por Appointment ID.

## Publicação

Após commit,
por outbox relay.

## Requisitos

- contrato versionado;
- idempotência;
- retry;
- dead letter;
- lag;
- correlação;
- segurança;
- owner.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/event-driven-contract.yaml
```

Conteúdo:

```yaml
eventDriven:
  producerContext:
    Service-Scheduling

  required:
    - public-event-contract
    - producer-owner
    - consumer-catalog
    - event-envelope
    - schema-version
    - after-commit-publication
    - at-least-once-awareness
    - idempotent-consumer
    - ordering-scope
    - retry-policy
    - dead-letter-policy
    - outbox-policy
    - consumer-lag
    - correlation
    - causation
    - observability
    - security
    - contract-tests

  forbidden:
    - domain-object-as-message
    - broker-type-in-domain
    - publish-before-commit
    - consumer-without-owner
    - infinite-retry
    - global-ordering-assumption
    - silent-dead-letter
    - consistency-eventual-deep-dive
    - CAP-deep-dive

  nextLesson:
    code:
      M19.24
```

---

### 4. Criar Integration Event

```java
public sealed interface IntegrationEvent
        permits ServiceAppointmentScheduledV1,
                ServiceAppointmentRescheduledV1,
                ServiceAppointmentCancelledV1 {

    EventType eventType();

    SchemaVersion schemaVersion();

    Instant occurredAt();
}
```

Integration Event é contrato público.

Ele não deve ser a mesma classe da Entity ou do Domain Event interno.

---

### 5. Criar Event Envelope

```java
public record EventEnvelope<E extends IntegrationEvent>(
        EventId eventId,
        E payload,
        Instant publishedAt,
        ProducerReference producer,
        CorrelationId correlationId,
        CausationId causationId,
        OrderingKey orderingKey,
        Map<String, String> attributes) {

    public EventEnvelope {
        Objects.requireNonNull(eventId);
        Objects.requireNonNull(payload);
        Objects.requireNonNull(publishedAt);
        Objects.requireNonNull(producer);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(causationId);
        Objects.requireNonNull(orderingKey);

        attributes =
                attributes == null
                        ? Map.of()
                        : Map.copyOf(attributes);
    }
}
```

`occurredAt` indica quando o fato aconteceu.

`publishedAt` indica quando foi publicado.

---

### 6. Criar envelope policy

Arquivo:

```text
contracts/event-envelope-policy.yaml
```

Conteúdo:

```yaml
eventEnvelope:
  required:
    - event-id
    - event-type
    - schema-version
    - occurred-at
    - published-at
    - producer
    - correlation-id
    - causation-id
    - ordering-key
    - payload

  optional:
    - attributes

  forbidden:
    - raw-token
    - secret
    - stack-trace
    - entity
    - persistence-record
    - broker-specific-header-in-domain-contract
```

---

### 7. Criar evento agendado

```java
public record ServiceAppointmentScheduledV1(
        UUID appointmentId,
        UUID serviceRequestId,
        Instant startsAt,
        Instant endsAt,
        String serviceAreaCode,
        String serviceType,
        UUID capacityReservationId,
        Instant occurredAt)
        implements IntegrationEvent {

    @Override
    public EventType eventType() {
        return new EventType(
                "service-appointment-scheduled");
    }

    @Override
    public SchemaVersion schemaVersion() {
        return new SchemaVersion(1);
    }
}
```



---

### 8. Criar eventos de reagendamento e cancelamento

`ServiceAppointmentRescheduledV1` contém:

- Appointment ID;
- janela anterior;
- janela atual;
- reserva anterior;
- reserva atual;
- motivo público;
- occurredAt.

`ServiceAppointmentCancelledV1` contém:

- Appointment ID;
- reserva atual;
- categoria de cancelamento;
- occurredAt.


---

### 9. Criar catálogo de eventos

Arquivo:

```text
event-driven/EVENT_CATALOG.md
```

Para cada contrato, registre tipo, versão, producer, owner, ordering key, payload, consumers, retenção, compatibilidade e SLO.

---

### 10. Producer Ownership

Arquivo:

```text
event-driven/PRODUCER_OWNERSHIP.md
```

Regra:

```text
Service Scheduling
é owner dos fatos
sobre o ciclo de vida
do Appointment.
```

O producer define semântica, contrato, versão, compatibilidade, depreciação e SLO; o consumer não redefine o fato.

---

### 11. Criar producer policy

Arquivo:

```text
contracts/producer-policy.yaml
```

Conteúdo:

```yaml
producer:
  owns:
    - event-meaning
    - contract
    - schema-version
    - publication-slo
    - compatibility
    - deprecation

  required:
    - bounded-context
    - team-owner
    - contact
    - runbook

  forbidden:
    - consumer-specific-domain-rule
    - publish-uncommitted-state
    - expose-internal-entity
```

---

### 12. Traduzir Domain Event

```java
public final class AppointmentIntegrationEventTranslator {

    public IntegrationEvent translate(
            DomainEvent event) {

        return switch (event) {

            case AppointmentScheduled scheduled ->
                    new ServiceAppointmentScheduledV1(
                            scheduled.aggregateId()
                                    .value(),
                            scheduled.serviceRequestId()
                                    .value(),
                            scheduled.window()
                                    .startsAt(),
                            scheduled.window()
                                    .endsAt(),
                            scheduled.serviceAreaCode()
                                    .value(),
                            scheduled.serviceType()
                                    .name(),
                            scheduled.reservationId()
                                    .value(),
                            scheduled.occurredAt());

            case AppointmentRescheduled rescheduled ->
                    toRescheduled(rescheduled);

            case AppointmentCancelled cancelled ->
                    toCancelled(cancelled);

            case AppointmentConfirmed ignored ->
                    throw new EventNotPubliclyExposed(
                            "AppointmentConfirmed");
        };
    }
}
```


---

### 13. Criar Event Producer

```java
public interface EventProducer {

    void publish(
            TopicName topic,
            EventEnvelope<? extends IntegrationEvent>
                    envelope);
}
```

O contrato não menciona tecnologia de broker.

---

### 14. Publicação depois do commit

Fluxo inseguro:

```text
publicar evento;

salvar Aggregate;

commit falha.
```


Fluxo seguro conceitual:

```text
salvar Aggregate;

salvar outbox na mesma transação;

commit;

relay publica;

marca outbox como publicada.
```

---

### 15. Criar Outbox Record

```java
public record OutboxRecord(
        UUID outboxId,
        EventEnvelope<? extends IntegrationEvent>
                envelope,
        OutboxStatus status,
        int publicationAttempts,
        Instant createdAt,
        Optional<Instant> publishedAt) {
}
```

Outbox pertence à infraestrutura da aplicação.

---

### 16. Criar Outbox Store

```java
public interface OutboxStore {

    void append(
            OutboxRecord record);

    List<OutboxRecord> findPending(
            int limit);

    void markPublished(
            UUID outboxId,
            Instant publishedAt);

    void markFailed(
            UUID outboxId,
            String safeFailureCode);
}
```

---

### 17. Criar Outbox Policy

Arquivo:

```text
contracts/outbox-policy.yaml
```

Conteúdo:

```yaml
outbox:
  writtenInSameTransactionAsBusinessState:
    required

  relay:
    required

  publication:
    at-least-once:
      expected

  duplicatePublication:
    possible:
      true

  eventId:
    stableAcrossRetries:
      required

  status:
    allowed:
      - PENDING
      - PUBLISHED
      - FAILED

  payloadMutationAfterCommit:
    forbidden
```

---

### 18. Criar Outbox Relay

```java
public final class OutboxRelay {

    private final OutboxStore outboxStore;
    private final EventProducer producer;
    private final RelayClock clock;

    public RelayResult publishPending(
            int limit) {

        int published = 0;
        int failed = 0;

        for (OutboxRecord record :
                outboxStore.findPending(limit)) {

            try {
                producer.publish(
                        topicFor(
                                record.envelope()
                                        .payload()),
                        record.envelope());

                outboxStore.markPublished(
                        record.outboxId(),
                        clock.now());

                published++;

            } catch (RuntimeException exception) {
                outboxStore.markFailed(
                        record.outboxId(),
                        classify(exception));

                failed++;
            }
        }

        return new RelayResult(
                published,
                failed);
    }
}
```

Falha entre publicação e marcação pode gerar duplicação.

---

### 19. Delivery Semantics

At-most-once pode perder; at-least-once pode repetir; exactly-once depende de escopo formal. O laboratório usa at-least-once.

---

### 20. Criar delivery policy

Arquivo:

```text
contracts/delivery-policy.yaml
```

Conteúdo:

```yaml
delivery:
  model:
    at-least-once

  duplicate:
    expected

  loss:
    monitored

  acknowledgement:
    after-successful-processing

  acknowledgementBeforeProcessing:
    forbidden

  exactlyOnceClaim:
    requiresFormalScope:
      true

  timeout:
    explicit:
      required
```

---

### 21. Criar Broker em memória

```java
public interface EventBroker {

    void publish(
            TopicName topic,
            BrokerRecord record);

    Subscription subscribe(
            TopicName topic,
            EventConsumer consumer);

    int pending(
            Subscription subscription);
}
```

A implementação simula subscriptions, retries, ordering e lag.

---

### 22. Criar Broker Record

```java
public record BrokerRecord(
        EventEnvelope<? extends IntegrationEvent>
                envelope,
        DeliveryAttempt deliveryAttempt,
        Instant availableAt) {
}
```

`DeliveryAttempt` começa em 1.

---

### 23. Criar Consumer

```java
public interface EventConsumer {

    ConsumerName name();

    ConsumerResult consume(
            EventEnvelope<? extends IntegrationEvent>
                    envelope);
}
```

Cada consumer possui owner, contratos, idempotência, checkpoint e observabilidade.

---

### 24. Criar Consumer Catalog

Arquivo:

```text
event-driven/CONSUMER_CATALOG.md
```

Exemplo:

```text
Consumer:
PrepareCustomerNotification.

Owner:
Customer Communication.

Consumes:
service-appointment-scheduled v1;
service-appointment-rescheduled v1;
service-appointment-cancelled v1.

Side effect:
create notification command.

Idempotency key:
event ID.

Ordering:
Appointment ID.

Retry:
transient failures.

Dead letter:
after 5 attempts.

SLO:
95 percent under 30 seconds.
```

---

### 25. Criar consumer policy

Arquivo:

```text
contracts/consumer-policy.yaml
```

Conteúdo:

```yaml
consumer:
  requires:
    - owner
    - supported-event
    - idempotency
    - retry-policy
    - dead-letter-policy
    - ordering-policy
    - observability
    - runbook

  forbidden:
    - hidden-side-effect
    - infinite-retry
    - raw-exception-publication
    - mutable-global-state
    - consumer-without-contract-test
```

---

### 26. Consumidor idempotente

```java
public final class PrepareCustomerNotification
        implements EventConsumer {

    private final IdempotencyStore idempotency;
    private final NotificationCommandPort notifications;

    @Override
    public ConsumerResult consume(
            EventEnvelope<? extends IntegrationEvent>
                    envelope) {

        if (idempotency.wasProcessed(
                name(),
                envelope.eventId())) {

            return ConsumerResult.duplicate(
                    envelope.eventId());
        }

        IntegrationEvent event =
                envelope.payload();

        switch (event) {

            case ServiceAppointmentScheduledV1 scheduled ->
                    notifications.prepareScheduled(
                            scheduled);

            case ServiceAppointmentRescheduledV1 rescheduled ->
                    notifications.prepareRescheduled(
                            rescheduled);

            case ServiceAppointmentCancelledV1 cancelled ->
                    notifications.prepareCancelled(
                            cancelled);
        }

        idempotency.markProcessed(
                name(),
                envelope.eventId());

        return ConsumerResult.processed(
                envelope.eventId());
    }
}
```

---

### 27. Idempotência e efeito externo

Se o efeito externo ocorrer antes da marca de idempotência e houver falha, a repetição pode duplicá-lo.

Estratégias incluem idempotency key no destino, inbox, unique constraint, effect log ou compare-and-set.

No laboratório, `NotificationCommandPort` recebe o Event ID como chave.

---

### 28. Criar idempotency policy

Arquivo:

```text
contracts/idempotency-policy.yaml
```

Conteúdo:

```yaml
idempotency:
  key:
    event-id

  scope:
    consumer-name

  markProcessed:
    after-success:
      required

  externalEffect:
    idempotencyKey:
      required

  duplicate:
    result:
      ACKNOWLEDGE_WITHOUT_REPROCESSING

  retention:
    explicit:
      required
```

---

### 29. Ordering


O laboratório usa:

```text
orderingKey = Appointment ID.
```

Eventos do mesmo Appointment preservam ordem; Appointments diferentes podem intercalar.

---

### 30. Criar ordering policy

Arquivo:

```text
contracts/ordering-policy.yaml
```

Conteúdo:

```yaml
ordering:
  scope:
    appointment-id

  globalOrdering:
    false

  key:
    required

  consumerConcurrency:
    preserveOrderPerKey:
      required

  olderAggregateRevision:
    action:
      IGNORE_OR_QUARANTINE_BY_POLICY

  missingPredecessor:
    action:
      RETRY_THEN_QUARANTINE
```

---

### 31. Ordering e revisão

Além da ordering key, o payload pode carregar:

```text
aggregateRevision.
```

O consumer compara:

```text
expected next revision;
received revision.
```

O consumer pode processar, ignorar duplicata, aguardar predecessor ou quarentenar.


---

### 32. Retry Policy

```java
public interface RetryPolicy {

    RetryDecision decide(
            Throwable failure,
            DeliveryAttempt attempt);
}
```

```java
public sealed interface RetryDecision {

    record RetryAt(
            Instant availableAt)
            implements RetryDecision {
    }

    record SendToDeadLetter(
            String reasonCode)
            implements RetryDecision {
    }

    record DropAsNonRetryable(
            String reasonCode)
            implements RetryDecision {
    }
}
```

---

### 33. Exponential Backoff

```java
public final class ExponentialBackoff
        implements RetryPolicy {

    private final int maxAttempts;
    private final Duration initialDelay;
    private final Duration maximumDelay;
    private final RetryClock clock;

    @Override
    public RetryDecision decide(
            Throwable failure,
            DeliveryAttempt attempt) {

        if (!isRetryable(failure)) {
            return new RetryDecision
                    .DropAsNonRetryable(
                            classify(failure));
        }

        if (attempt.value() >= maxAttempts) {
            return new RetryDecision
                    .SendToDeadLetter(
                            "MAX_ATTEMPTS_EXCEEDED");
        }

        Duration delay =
                calculateDelay(attempt);

        return new RetryDecision.RetryAt(
                clock.now().plus(delay));
    }
}
```

---

### 34. Retryable versus non-retryable

Timeout, rate limit e indisponibilidade são retryable; schema inválido, contrato incompatível e payload malformado não são.


---

### 35. Criar retry policy

Arquivo:

```text
contracts/retry-policy.yaml
```

Conteúdo:

```yaml
retry:
  maxAttempts:
    5

  backoff:
    exponential

  jitter:
    recommended

  retryable:
    - timeout
    - temporary-unavailable
    - rate-limit
    - transient-lock

  nonRetryable:
    - invalid-schema
    - unsupported-version
    - malformed-payload
    - permanent-authorization-denial

  infiniteRetry:
    forbidden
```

---

### 36. Dead Letter

Dead letter é área de investigação e recuperação.

O registro inclui evento, versão, consumer, tentativas, código seguro, tempos, correlação, causa, status e owner.

---

### 37. Criar Dead Letter Record

```java
public record DeadLetterRecord(
        UUID deadLetterId,
        ConsumerName consumer,
        EventEnvelope<? extends IntegrationEvent>
                envelope,
        int attempts,
        String safeFailureCode,
        Instant firstFailedAt,
        Instant lastFailedAt,
        DeadLetterStatus status) {
}
```

---

### 38. Criar dead-letter policy

Arquivo:

```text
contracts/dead-letter-policy.yaml
```

Conteúdo:

```yaml
deadLetter:
  requires:
    - owner
    - event-id
    - consumer
    - event-type
    - schema-version
    - attempt-count
    - safe-failure-code
    - first-failed-at
    - last-failed-at
    - status
    - runbook

  status:
    allowed:
      - OPEN
      - INVESTIGATING
      - READY_TO_REPLAY
      - REPLAYED
      - DISCARDED_WITH_JUSTIFICATION

  silentAccumulation:
    forbidden

  replayWithoutFix:
    forbidden
```

---

### 39. Replay de Dead Letter

Fluxo seguro:

```text
investigar;

corrigir causa;

validar contrato;

marcar ready;

republicar
com mesmo event ID;

incrementar replay metadata;

observar resultado.
```

O replay preserva o ID.

---

### 40. Criar Dead Letter Replay Service

```java
public final class DeadLetterReplayService {

    private final DeadLetterStore store;
    private final EventProducer producer;
    private final ReplayAuthorization authorization;

    public ReplayResult replay(
            UUID deadLetterId,
            ActorContext actor) {

        authorization.requireAllowed(
                actor,
                "REPLAY_DEAD_LETTER");

        DeadLetterRecord record =
                store.findById(deadLetterId)
                        .orElseThrow(
                                DeadLetterNotFound::new);

        requireReady(record);

        producer.publish(
                topicFor(
                        record.envelope()
                                .payload()),
                record.envelope());

        store.markReplayed(
                deadLetterId);

        return ReplayResult.accepted(
                record.envelope()
                        .eventId());
    }
}
```

---

### 41. Consumer Checkpoint

Checkpoint registra progresso de uma subscription.

```java
public interface ConsumerCheckpointStore {

    Optional<ConsumerCheckpoint> latest(
            Subscription subscription);

    void commit(
            Subscription subscription,
            BrokerPosition position,
            Instant processedAt);
}
```


---

### 42. Consumer Lag

```java
public record ConsumerLag(
        Subscription subscription,
        long availablePosition,
        long processedPosition,
        long messageLag,
        Duration timeLag,
        boolean withinTarget) {
}
```

Meça message lag, time lag, idade pendente, retries, dead letters, throughput e falhas.

---

### 43. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  producer:
    required:
      - event-type
      - schema-version
      - event-id
      - correlation-id
      - publish-outcome
      - publish-latency

  consumer:
    required:
      - consumer-name
      - event-id
      - attempt
      - processing-outcome
      - processing-latency
      - checkpoint
      - lag

  forbidden:
    - raw-token
    - secret
    - full-sensitive-payload
```

---

### 44. Correlation e Causation

Correlation agrupa a jornada; causation identifica a ação ou evento que produziu o próximo passo.

---

### 45. Tracing

`EventTrace` relaciona trace, correlation, causation, Event ID, espera no broker, consumo, retries e dead letter.


---

### 46. Contrato e compatibilidade

Campos opcionais e metadata adicional tendem a ser compatíveis; remoção, rename, troca de tipo ou semântica são breaking changes.

Breaking change exige nova schema version.

---

### 47. Criar contract evolution policy

Arquivo:

```text
contracts/contract-evolution-policy.yaml
```

Conteúdo:

```yaml
contractEvolution:
  additiveChange:
    preferred

  removeField:
    requiresNewVersion:
      true

  renameField:
    requiresNewVersion:
      true

  semanticChange:
    requiresNewVersion:
      true

  enumExpansion:
    consumerFallback:
      required

  compatibilityTest:
    required

  consumerMigrationWindow:
    documented:
      required

  silentBreakingChange:
    forbidden
```

---

### 48. Consumer-driven Contract Test

Consumers declaram campos mínimos e o producer valida compatibilidade antes de evoluir o contrato.


---

### 49. Segurança

Eventos podem atravessar equipes, contas, regiões e fornecedores.

Defina autenticação, autorização, criptografia, retenção, classificação, least privilege e auditoria.

---

### 50. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

Conteúdo:

```yaml
security:
  producerAuthentication:
    required

  publishAuthorization:
    required

  consumerAuthorization:
    required

  encryptionInTransit:
    required

  sensitivePayload:
    minimize:
      required

  topicAccess:
    leastPrivilege:
      required

  administrativeReplay:
    audited:
      required

  secretInPayload:
    forbidden
```

---

### 51. Event Notification versus Event-Carried State Transfer

Event Notification:

```text
Appointment Scheduled;
consumer consulta detalhes.
```

Event-Carried State Transfer:

```text
evento carrega
dados suficientes
para o consumer agir.
```

Payload mínimo reduz exposição, mas pode exigir consulta síncrona; payload amplo reduz consulta e aumenta risco de stale e privacidade.



---

### 52. Comando versus evento

Evento:

```text
algo aconteceu.
```

Comando:

```text
faça algo.
```

Evite `SendNotificationEvent`; publique `AppointmentScheduled` e deixe o consumer decidir a reação.

---

### 53. Coreografia versus orquestração

Coreografia distribui reações; orquestração usa coordenador. A arquitetura pode combinar ambas, sem aprofundar sagas.

---

### 54. Fan-out

Um evento pode possuir vários consumers.

Fan-out permite novas reações e escala independente, mas aumenta efeitos indiretos, custo e debugging.


---

### 55. Event Storm

Replays ou bugs podem gerar volume excessivo; use quotas, pause, backpressure, alertas e kill switch.


---

### 56. Backpressure

Quando publicação supera processamento, o lag cresce; aumente capacidade, reduza custo, use batch e corrija dependências lentas.


---

### 57. Schema desconhecido

Um consumer recebe versão não suportada.

Schema desconhecido deve falhar, ir para dead letter, alertar owner e preservar o evento.

---

### 58. Poison Message

Poison message falha sempre.


A política limita tentativas, classifica, envia para dead letter, alerta e preserva ordering quando necessário.

---

### 59. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  eventWithoutOwner:
    action:
      FAIL

  consumerWithoutOwner:
    action:
      FAIL

  unversionedContract:
    action:
      FAIL

  publishBeforeCommit:
    action:
      FAIL

  nonIdempotentAtLeastOnceConsumer:
    action:
      FAIL

  infiniteRetry:
    action:
      FAIL

  unknownSchemaIgnored:
    action:
      FAIL

  deadLetterWithoutRunbook:
    action:
      FAIL

  globalOrderingAssumption:
    action:
      FAIL
```

---

### 60. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  producerUnavailable:
    action:
      KEEP_OUTBOX_PENDING

  transientConsumerFailure:
    action:
      RETRY

  permanentConsumerFailure:
    action:
      DEAD_LETTER

  unsupportedSchema:
    action:
      DEAD_LETTER_AND_ALERT

  duplicateEvent:
    action:
      IDEMPOTENT_ACK

  missingPredecessor:
    action:
      RETRY_THEN_QUARANTINE

  checkpointFailure:
    action:
      REDELIVER_IDEMPOTENTLY

  ConsistencyEventualDeepDive:
    deferredToLesson634

  CAPDeepDive:
    deferredToLesson635
```

---

### 61. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson634:
    forbidden:
      - causal-consistency-deep-dive
      - session-guarantees
      - convergence-model
      - conflict-reconciliation-deep-dive
      - stale-UX-deep-dive

  lesson635:
    forbidden:
      - CAP-formal-proof
      - quorum-analysis
      - CP-AP-classification
      - partition-simulation

  allowed:
    - acknowledge-consumer-lag
    - document-delayed-reaction
    - simulate-duplicate-delivery
```

---

### 62. Testar contrato

`IntegrationEventContractTest` valida tipo, versão, tempo, payload, imutabilidade e ausência de Entity ou segredo.

---

### 63. Testar Envelope

`EventEnvelopeTest` valida ID, publicação, producer, correlação, causa, ordering key e atributos imutáveis.

---

### 64. Testar Outbox

`OutboxRelayTest` simula commit, publicação, falha antes de `markPublished`, nova entrega com mesmo Event ID e deduplicação.

---

### 65. Testar consumer idempotente

Aplique o mesmo envelope duas vezes e confirme um único side effect, uma marca e acknowledgement da duplicata.

---

### 66. Testar ordering

Entregue revisões fora de ordem e confirme espera, retry ou quarentena sem regressão de estado.

---

### 67. Testar retry

Simule timeout e valide tentativa, backoff, preservação do evento e sucesso posterior.

---

### 68. Testar non-retryable

Schema incompatível deve gerar dead letter, owner e alerta sem retry infinito.

---

### 69. Testar Dead Letter Replay

Valide autorização, status, mesmo Event ID, correlação, auditoria e idempotência.

---

### 70. Testar Lag

Simule oito mensagens pendentes e valide message lag, time lag, target, alerta e idade da mais antiga.

---

### 71. Testar isolamento

`ConsumerIsolationTest` confirma que falha em notificação não bloqueia a subscription de auditoria.

---

### 72. Testar arquitetura

```java
@ArchTest
static final ArchRule domainMustNotDependOnBroker =
        noClasses()
                .that()
                .resideInAPackage(
                        "..domain..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "org.apache.kafka..",
                        "org.springframework.kafka..",
                        "org.springframework.amqp..",
                        "..broker..");
```

---

### 73. Criar Operating Model

Arquivo:

```text
event-driven/OPERATING_MODEL.md
```

Registre topics, producers, consumers, owners, throughput, payload, retenção, targets, replay, on-call, alertas e runbooks.

---

### 74. Criar Trade-offs

Arquivo:

```text
event-driven/TRADE_OFFS.md
```

Compare desacoplamento, fan-out, extensibilidade e escala com duplicação, ordering, lag, debugging, retry, dead letter, segurança e compatibilidade.


---

### 75. Criar Open Questions

Arquivo:

```text
event-driven/OPEN_EVENT_DRIVEN_QUESTIONS.md
```

Pergunte sobre eventos públicos, ordering key, retenção, lag, read-your-writes, tecnologia de outbox, replay, dados sensíveis, depreciação e consumers críticos.


---

### 76. Validar envelope

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-event-envelope.ps1
```

Valide identidade, versão, tempos, producer, correlação, causa, ordering key, payload e segurança.

---

### 77. Validar producers

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-producer-ownership.ps1
```

Valide contexto, owner, contrato, SLO, depreciação, after commit e outbox.

---

### 78. Validar consumers

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-consumer-catalog.ps1
```

Valide owner, contratos, side effects, idempotência, ordering, retry, dead letter e runbook.

---

### 79. Validar delivery

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-delivery-model.ps1
```

Valide at-least-once, duplicação, acknowledgement após sucesso e timeout.

---

### 80. Validar ordering

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-ordering-policy.ps1
```

Valide chave, escopo, revisão, predecessor e ausência de ordem global.

---

### 81. Validar idempotência

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-idempotency-policy.ps1
```

Valide Event ID, consumer scope, chave externa, retenção e marca após sucesso.

---

### 82. Validar retry

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-retry-policy.ps1
```

Valide máximo, backoff, jitter, classificação e ausência de retry infinito.

---

### 83. Validar Dead Letter

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-dead-letter-policy.ps1
```

Valide owner, status, reason, attempts, runbook, replay e auditoria.

---

### 84. Validar Outbox

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-outbox-policy.ps1
```

Valide transação, payload, Event ID estável, relay, pendências e falhas.

---

### 85. Validar evolução

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-contract-evolution.ps1
```

Valide versões, mudanças aditivas, breaking changes, testes e depreciação.

---

### 86. Validar observabilidade

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-event-observability.ps1
```

Valide outcomes, tentativas, latência, checkpoint, lag, dead letter, correlação e causa.

---

### 87. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-event-driven\run-event-driven-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide contrato, envelope, outbox, broker, delivery, ordering, idempotência, retry, dead letter, lag, tracing e arquitetura.

---

### 88. Criar Reports

Exemplo:

```yaml
eventDriven:
  publicEvents:
    3

  producers:
    1

  consumers:
    4

  duplicateDeliveries:
    7

  duplicateSideEffects:
    0

  retries:
    12

  deadLetters:
    1

  unsupportedSchemas:
    0

  maximumLagSeconds:
    18

  lagTargetSeconds:
    30

  result:
    PASS
```

---

### 89. Criar Gate

O gate valida charter, catálogo, ownership, consumers, envelope, delivery, outbox, idempotência, ordering, retry, dead letter, evolução, segurança, observabilidade, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_EVENT_CONTRACT;

FAIL_PRODUCER_OWNER;

FAIL_CONSUMER_OWNER;

FAIL_ENVELOPE;

FAIL_DELIVERY_MODEL;

FAIL_OUTBOX;

FAIL_IDEMPOTENCY;

FAIL_ORDERING;

FAIL_RETRY;

FAIL_DEAD_LETTER;

FAIL_COMPATIBILITY;

FAIL_SECURITY;

FAIL_OBSERVABILITY;

FAIL_LAG;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 90. Coletar Evidence

Arquivo:

```text
contracts/event-driven-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- producer context;
- public event count;
- producer count;
- consumer count;
- contract status;
- envelope status;
- outbox status;
- delivery status;
- duplicate delivery count;
- duplicate side effect count;
- ordering status;
- retry count;
- dead-letter count;
- unsupported schema count;
- message lag;
- time lag;
- security status;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua credenciais, tokens, dados pessoais, payloads, endpoints, broker real, consistência eventual aprofundada ou CAP.

---

### 91. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-event-driven-contract.ps1

.\scripts\m19\service-scheduling-event-driven\validate-event-envelope.ps1

.\scripts\m19\service-scheduling-event-driven\validate-producer-ownership.ps1

.\scripts\m19\service-scheduling-event-driven\validate-consumer-catalog.ps1

.\scripts\m19\service-scheduling-event-driven\validate-delivery-model.ps1

.\scripts\m19\service-scheduling-event-driven\validate-ordering-policy.ps1

.\scripts\m19\service-scheduling-event-driven\validate-idempotency-policy.ps1

.\scripts\m19\service-scheduling-event-driven\validate-retry-policy.ps1

.\scripts\m19\service-scheduling-event-driven\validate-dead-letter-policy.ps1

.\scripts\m19\service-scheduling-event-driven\validate-outbox-policy.ps1

.\scripts\m19\service-scheduling-event-driven\validate-contract-evolution.ps1

.\scripts\m19\service-scheduling-event-driven\validate-event-observability.ps1

.\scripts\m19\service-scheduling-event-driven\run-event-driven-tests.ps1

.\scripts\m19\service-scheduling-event-driven\collect-event-driven-evidence.ps1

.\scripts\m19\service-scheduling-event-driven\verify-event-driven-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 92. Encerrar o laboratório

Confirme contratos versionados, ownership, consumers, envelope, payload mínimo, separação de eventos, after commit, outbox, at-least-once, idempotência, ordering por Appointment, retry limitado, dead letters, replay auditado, checkpoints, lag, compatibilidade, segurança, runbooks e reports sanitizados. Consistência eventual e CAP permanecem fora do aprofundamento.

---

## Entendendo o que foi feito

### Contratos e ownership ficaram explícitos

Domain Events internos foram traduzidos para contratos públicos versionados, com producer e consumers identificados.

### Entrega e processamento ganharam políticas

At-least-once, idempotência, ordering, retry, dead letter, checkpoints e outbox passaram a ser tratados como parte da arquitetura.

### A operação ganhou visibilidade

Lag, tentativas, correlação, causa, contratos e runbooks tornaram o fluxo observável e recuperável.

---

## Erros comuns importantes

### Publicar Entity ou antes do commit

Internals vazam e consumidores podem receber fatos revertidos.

### Ignorar duplicação e ordering

Side effects repetem ou estados regridem.

### Retry infinito e dead letter sem owner

Poison messages acumulam sem recuperação.

### Consumer sem contrato

Mudanças quebram processamento silenciosamente.

### Evento como comando disfarçado

O producer controla outro contexto.

### Lag sem SLO

Atrasos deixam de ser operáveis.

---

## Comandos úteis

### Validar envelope

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-event-envelope.ps1
```

### Validar delivery

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-delivery-model.ps1
```

### Validar idempotência

```powershell
.\scripts\m19\service-scheduling-event-driven\validate-idempotency-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-event-driven\run-event-driven-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-event-driven\verify-event-driven-gate.ps1
```

---

## Exercício guiado

Modele contratos versionados, producer, outbox, broker, consumers, idempotência, ordering, retry, dead letter e observabilidade. Finalize validando testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 632 e ponte para a aula 634 foram preservadas;
- o laboratório `service-scheduling-event-driven` foi criado;
- Event Driven Charter foi criado;
- Event Catalog foi criado;
- Producer Ownership foi documentado;
- Consumer Catalog foi criado;
- eventos públicos possuem schema version;
- Domain Events e Integration Events usam classes diferentes;
- Event Envelope possui ID, tipo, versão, tempos, producer, correlação, causa e ordering key;
- payloads não expõem Entity;
- producer publica somente fatos confirmados;
- outbox é registrada junto ao estado de negócio;
- relay publica registros pendentes;
- Event ID permanece estável em retries;
- modelo de entrega é at-least-once;
- consumers aceitam duplicação;
- consumers são idempotentes;
- side effects externos usam idempotency key;
- checkpoint avança somente após sucesso;
- ordering é definido por Appointment ID;
- ordem global não foi assumida;
- Aggregate Revision pode apoiar ordering;
- retry possui máximo de tentativas;
- backoff foi implementado;
- falhas permanentes não entram em retry infinito;
- dead-letter record possui owner, reason, attempts e status;
- replay de dead letter exige autorização;
- replay preserva Event ID;
- contract evolution foi documentada;
- breaking changes exigem nova versão;
- compatibility tests foram criados;
- unknown schema não é ignorado;
- consumer lag mede mensagens e tempo;
- observabilidade usa correlation e causation;
- dados sensíveis e segredos foram proibidos;
- broker permanece fora do domínio;
- Event Store e broker não foram confundidos;
- consistência eventual não foi aprofundada;
- CAP não foi aprofundado;
- reports, gate e evidence foram criados;
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
  labs/m19/aula-633-arquitetura-orientada-a-eventos/service-scheduling-event-driven `
  scripts/m19/service-scheduling-event-driven `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|privateBroker|realTopic|productionEndpoint|rawPersonalData|consistencyEventualDeepDive|CAPDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar arquitetura orientada a eventos"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- broker real;
- topics privados;
- endpoints privados;
- consistência eventual aprofundada;
- CAP aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou arquitetura orientada a eventos.

Você criou charter, Integration Events, envelope, producer, outbox, relay, broker em memória, consumers, idempotência, ordering, retry, dead letter, checkpoints, lag e testes.

Você comprovou que event-driven architecture depende de contratos, ownership, publicação após commit, idempotência, ordering limitado, retry, dead letter e observabilidade.

A próxima aula será:

```text
634 - M19.24 - Consistencia eventual
```

Nela, você irá aprofundar como estados separados convergem, como representar janelas de inconsistência, como definir expectativas de leitura, como tratar dados stale, como reconciliar falhas e como projetar UX e operações para convergência.

Nenhum aprofundamento completo de consistência eventual ou CAP foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei eventos públicos versionados.
- [ ] Defini producer e consumers.
- [ ] Implementei outbox e relay.
- [ ] Modelei entrega at-least-once.
- [ ] Tornei consumers idempotentes.
- [ ] Defini ordering por Aggregate.
- [ ] Implementei retry e dead letter.
- [ ] Medi lag e tracing.

---

## Troubleshooting adicional

### O consumer executa duas vezes

Use Event ID, consumer scope e idempotency key no efeito externo.

### O evento foi publicado antes do commit

Registre outbox na mesma transação e publique por relay.

### A ordem foi perdida

Defina ordering key e Aggregate Revision.

### Um poison message bloqueia a fila

Limite retry e envie para dead letter.

### Dead letters acumulam

Defina owner, alertas, runbook e SLO de recuperação.

### O consumer não entende a versão

Falhe explicitamente, preserve a mensagem e valide migração.

### O lag cresce continuamente

Meça throughput, oldest pending age, retries e dependências lentas.

### O payload ficou enorme

Revise necessidade de dados, privacidade e estratégia de consulta.

### O producer conhece todos os consumers

Revise se o evento continua sendo fato ou virou comando distribuído.

### O laboratório começou a discutir causal consistency

Preserve o aprofundamento para a aula 634.

---

## Perguntas de revisão

1. O que é arquitetura orientada a eventos?
2. O que é producer?
3. O que é consumer?
4. O que é broker?
5. O que é Event Envelope?
6. Qual diferença entre Domain e Integration Event?
7. O que é at-least-once?
8. Por que consumer precisa ser idempotente?
9. O que é ordering key?
10. Existe ordem global por padrão?
11. O que é retry?
12. O que é poison message?
13. O que é dead letter?
14. O que é outbox?
15. Por que Event ID permanece estável?
16. O que é consumer lag?
17. Qual diferença entre correlação e causa?
18. Event Store é broker?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Arquitetura baseada em publicação e reação a fatos.
2. Componente que publica contrato.
3. Componente que processa evento.
4. Infraestrutura de entrega.
5. Metadata e payload da mensagem.
6. Um é interno; outro é público.
7. Entrega que pode repetir.
8. Para evitar side effects duplicados.
9. Chave de ordem em escopo limitado.
10. Não.
11. Nova tentativa após falha transitória.
12. Mensagem que falha repetidamente.
13. Área de recuperação de mensagens falhas.
14. Registro transacional para publicação posterior.
15. Para preservar deduplicação.
16. Distância entre disponível e processado.
17. Correlação agrupa; causa encadeia.
18. Não.
19. Consistência eventual.
20. Consistência eventual.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 633 - M19.23 - Arquitetura orientada a eventos

- Aprofundei arquitetura orientada a eventos.
- Criei o laboratório `service-scheduling-event-driven`.
- Criei Event Driven Charter e Event Catalog.
- Modelei Integration Events públicos e versionados.
- Separei Domain Event de Integration Event.
- Criei Event Envelope com identidade, tempos, producer, correlação, causa e ordering key.
- Documentei producer ownership.
- Criei Consumer Catalog.
- Modelei Event Producer independente de broker.
- Criei Outbox Record, Outbox Store e Outbox Relay.
- Mantive Event ID estável em retries.
- Modelei entrega at-least-once.
- Criei broker em memória com subscriptions.
- Implementei consumers idempotentes.
- Usei Event ID e consumer name como chave.
- Propaguei idempotency key para side effects externos.
- Defini ordering por Appointment ID.
- Evitei assumir ordem global.
- Criei retry com exponential backoff.
- Diferenciei falhas retryable e non-retryable.
- Criei Dead Letter Store e replay autorizado.
- Mantive mesmo Event ID no replay.
- Criei Consumer Checkpoints.
- Medi message lag, time lag e oldest pending age.
- Modelei correlation e causation.
- Criei contract evolution e compatibility tests.
- Documentei segurança e least privilege.
- Criei tests de outbox, duplicação, ordering, retry, dead letter, lag e arquitetura.
- Criei reports, gate e evidence.
- Não antecipei consistência eventual ou CAP.
- Próxima aula: Consistência eventual.
```

---

## Referência técnica curta

- Event-Driven Architecture.
- Producer.
- Consumer.
- Broker.
- Event Envelope.
- At-Least-Once.
- Idempotent Consumer.
- Ordering Key.
- Outbox.
- Dead Letter.

Regra final:

```text
Arquitetura orientada a eventos precisa ser tratada como arquitetura de contratos e operação: Service Scheduling publica Integration Events versionados e separados dos Domain Events internos, cada envelope possui Event ID, tipo, schema version, occurredAt, publishedAt, producer, correlation ID, causation ID, ordering key e payload mínimo, e o producer mantém ownership sobre significado, compatibilidade, SLO e depreciação; publicação ocorre depois do commit por outbox registrada na mesma transação, relay e broker podem repetir entregas e o modelo at-least-once exige consumers idempotentes por Event ID e consumer scope, com idempotency key propagada aos side effects externos; ordering existe apenas no escopo definido, como Appointment ID, revisions antigas ou predecessores ausentes seguem política explícita, retries possuem classificação, máximo, backoff e jitter, poison messages vão para dead letter com owner, runbook e replay autorizado preservando o Event ID; checkpoints avançam somente depois do sucesso, lag, oldest pending age, throughput, falhas, correlação e causa são observáveis, contratos evoluem por mudanças aditivas ou novas versões, segurança usa least privilege e payloads não carregam segredos; o gate termina com catálogo, ownership, envelope, delivery, outbox, idempotência, ordering, retry, dead letter, compatibilidade, segurança, lag, testes, arquitetura, documentação e evidence aprovados, enquanto consistência eventual é aprofundada somente na aula 634 e CAP permanece reservado à aula 635.
```
