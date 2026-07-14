# 629 - M19.19 - Domain Events

## Apresentação da aula

Na aula 628, você aprofundou Application Service e Use Case.

Você estruturou:

```text
input ports;

commands;

results;

authorization;

idempotency;

transaction boundary;

output ports;

compensation;

after commit;

controller fino;

observabilidade.
```

Os casos de uso passaram a coordenar:

- Repository;
- Aggregate Root;
- Domain Services;
- gateways externos;
- expected revision;
- idempotência;
- transação;
- publicação posterior ao commit.

A Aggregate Root já registrava `AppointmentScheduled`, `AppointmentConfirmed`, `AppointmentRescheduled` e `AppointmentCancelled` como resultado de mudanças válidas.

Agora a pergunta será:

```text
como transformar
uma mudança importante do domínio

em um fato explícito,
imutável,
bem nomeado
e útil para outras partes
do sistema?
```

Um Domain Event representa um fato relevante, imutável, ocorrido em um instante e ligado a um Aggregate ou processo.

Exemplos adequados:

```text
AppointmentScheduled;

AppointmentConfirmed;

AppointmentRescheduled;

AppointmentCancelled;

CapacityReservationReleased;

ServiceRequestBecameEligible.
```

Exemplos inadequados:

```text
AppointmentUpdated;

DatabaseRowChanged;

EntitySaved;

StatusChanged;

MessageSent;

ControllerExecuted.
```

O primeiro grupo descreve fatos do domínio.

O segundo descreve detalhes técnicos ou eventos genéricos demais.

Domain Event não é sinônimo de mensagem de broker, log, auditoria, DTO, comando ou registro de banco.

Um Domain Event pode originar Integration Event, audit record, notification command ou atualização de leitura, sem ser o mesmo objeto.

A pergunta será:

```text
como modelar
Domain Events

com significado,
granularidade,
metadados,
versionamento
e responsabilidade

sem acoplar
o domínio
à mensageria
ou ao transporte?
```

O laboratório será:

```text
labs/m19/aula-629-domain-events/service-scheduling-domain-events
```

Você irá aprofundar os eventos do Aggregate `Appointment`.

Os principais eventos serão:

```text
AppointmentScheduled;

AppointmentConfirmed;

AppointmentRescheduled;

AppointmentCancelled.
```

Você também criará metadados, catálogo, recorder, dispatcher, handlers, tradução para Integration Event, compatibilidade, testes, evidence e gate.

A próxima aula oficial será:

```text
630 - M19.20 - Event Storming
```

Esta aula não executará workshop, mural, hotspots ou níveis de Event Storming.

A aula 631 será:

```text
631 - M19.21 - CQRS
```

Esta aula não aprofundará write/read models, projections, rebuild ou bancos separados.

A regra central será:

```text
Domain Event
é um fato imutável
do domínio,

registrado após
uma mudança válida,

com linguagem,
identidade,
tempo
e contexto explícitos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
627:
Domain Service.

628:
Application Service Use Case.

629:
Domain Events.

630:
Event Storming.

631:
CQRS.
```

A progressão vai de regras e orquestração para fatos, descoberta colaborativa e separação de leitura e escrita.

Nesta aula:

```text
Domain Event:
sim.

event identity:
sim.

occurredAt:
sim.

aggregate revision:
sim.

correlation:
sim.

causation:
sim.

actor reference:
sim.

event version:
sim.

event catalog:
sim.

internal dispatcher:
sim.

domain handler:
sim.

integration translation:
sim.

broker real:
não.

outbox completa:
não.

Event Storming:
não.

CQRS:
não.
```

O domínio permanece livre de brokers.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-629-domain-events/service-scheduling-domain-events
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/domainevents
│   │           ├── domain
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── AppointmentRevision.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── CapacityReservationId.java
│   │           │   ├── CancellationReason.java
│   │           │   └── RescheduleReason.java
│   │           ├── event
│   │           │   ├── DomainEvent.java
│   │           │   ├── DomainEventId.java
│   │           │   ├── EventVersion.java
│   │           │   ├── CorrelationId.java
│   │           │   ├── CausationId.java
│   │           │   ├── ActorReference.java
│   │           │   ├── AppointmentScheduled.java
│   │           │   ├── AppointmentConfirmed.java
│   │           │   ├── AppointmentRescheduled.java
│   │           │   └── AppointmentCancelled.java
│   │           ├── recording
│   │           │   ├── DomainEventRecorder.java
│   │           │   └── RecordedDomainEvents.java
│   │           ├── dispatch
│   │           │   ├── DomainEventDispatcher.java
│   │           │   ├── DomainEventHandler.java
│   │           │   ├── InMemoryDomainEventDispatcher.java
│   │           │   └── DomainEventDispatchException.java
│   │           ├── handler
│   │           │   ├── RecordAppointmentAudit.java
│   │           │   ├── ReleasePreviousCapacityReservation.java
│   │           │   └── PrepareAppointmentNotification.java
│   │           ├── integration
│   │           │   ├── IntegrationEvent.java
│   │           │   ├── AppointmentIntegrationEventTranslator.java
│   │           │   ├── AppointmentScheduledV1.java
│   │           │   ├── AppointmentRescheduledV1.java
│   │           │   └── AppointmentCancelledV1.java
│   │           └── application
│   │               ├── AppointmentEventPublishingService.java
│   │               ├── AfterCommitDomainEventPublisher.java
│   │               └── DomainEventPublicationResult.java
│   └── test
│       └── java
│           └── br/com/formacao/domainevents
│               ├── domain
│               │   ├── AppointmentEventRecordingTest.java
│               │   ├── AppointmentRevisionEventTest.java
│               │   └── FailedOperationMustNotRecordEventTest.java
│               ├── event
│               │   ├── DomainEventMetadataTest.java
│               │   ├── DomainEventImmutabilityTest.java
│               │   ├── DomainEventNamingTest.java
│               │   └── EventVersionCompatibilityTest.java
│               ├── dispatch
│               │   ├── DomainEventDispatcherTest.java
│               │   └── DomainEventHandlerFailureTest.java
│               ├── integration
│               │   └── AppointmentIntegrationEventTranslatorTest.java
│               └── architecture
│                   ├── DomainEventBoundaryTest.java
│                   ├── DomainEventPurityTest.java
│                   ├── IntegrationEventSeparationTest.java
│                   └── BrokerIndependenceTest.java
├── domain-events
│   ├── DOMAIN_EVENT_CHARTER.md
│   ├── EVENT_CATALOG.md
│   ├── EVENT_NAMING_POLICY.md
│   ├── EVENT_GRANULARITY.md
│   ├── EVENT_METADATA.md
│   ├── EVENT_PAYLOAD_POLICY.md
│   ├── EVENT_VERSIONING.md
│   ├── EVENT_COMPATIBILITY.md
│   ├── DOMAIN_VS_INTEGRATION_EVENT.md
│   ├── PUBLICATION_TIMING.md
│   ├── HANDLER_POLICY.md
│   ├── FAILURE_POLICY.md
│   ├── OBSERVABILITY.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_EVENT_QUESTIONS.md
├── contracts
│   ├── domain-events-contract.yaml
│   ├── domain-event-interface-policy.yaml
│   ├── event-naming-policy.yaml
│   ├── event-metadata-policy.yaml
│   ├── event-payload-policy.yaml
│   ├── event-versioning-policy.yaml
│   ├── event-compatibility-policy.yaml
│   ├── event-recording-policy.yaml
│   ├── event-dispatch-policy.yaml
│   ├── integration-event-policy.yaml
│   ├── observability-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── event-catalog-report.yaml
    ├── event-metadata-report.yaml
    ├── event-payload-report.yaml
    ├── event-versioning-report.yaml
    ├── event-dispatch-report.yaml
    ├── integration-separation-report.yaml
    ├── architecture-report.yaml
    └── domain-events-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-domain-events
├── validate-domain-events-contract.ps1
├── validate-event-catalog.ps1
├── validate-event-names.ps1
├── validate-event-metadata.ps1
├── validate-event-payloads.ps1
├── validate-event-versions.ps1
├── validate-event-recording.ps1
├── validate-event-dispatch.ps1
├── validate-domain-integration-separation.ps1
├── validate-event-observability.ps1
├── run-domain-event-tests.ps1
├── collect-domain-event-evidence.ps1
└── verify-domain-events-gate.ps1
```

Ao final, você terá eventos de domínio explícitos, versionados, testáveis e separados de integração.

---

## Conceito essencial

### Domain Event

Fato relevante que aconteceu no domínio.

### Identidade, tempo e contexto

Event ID identifica o fato; occurredAt indica o instante; Aggregate Revision indica a versão; correlation e causation conectam o fluxo; actor reference identifica minimamente o ator.

### Versão e payload

Event Version controla o contrato; payload carrega somente dados necessários.

### Recording e Dispatch

A root registra após mudança válida; handlers recebem os eventos posteriormente.

### Integration Event e compatibilidade

Integration Event é o contrato publicado, com evolução e compatibilidade próprias.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-629-domain-events/service-scheduling-domain-events

Set-Location `
  labs/m19/aula-629-domain-events/service-scheduling-domain-events
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/domain-events-contract.yaml
```

Conteúdo:

```yaml
domainEvents:
  context:
    Service-Scheduling

  required:
    - past-tense-name
    - event-id
    - aggregate-id
    - aggregate-revision
    - occurred-at
    - correlation-id
    - causation-id
    - event-version
    - immutable-payload
    - aggregate-recording
    - after-commit-publication
    - domain-integration-separation
    - compatibility-policy
    - tests
    - architecture-rules

  forbidden:
    - technical-event-name
    - mutable-event
    - aggregate-entity-reference
    - persistence-record-in-payload
    - broker-type-in-domain
    - event-before-state-change
    - event-on-failed-operation
    - Event-Storming-workshop
    - CQRS-deep-dive

  nextLesson:
    code:
      M19.20
```

---

### 3. Criar Domain Event Charter

Arquivo:

```text
domain-events/DOMAIN_EVENT_CHARTER.md
```

Conteúdo:

```markdown
# Domain Event Charter

## Contexto

Service Scheduling.

## Objetivo

Registrar fatos importantes
gerados por mudanças válidas
do Appointment Aggregate.

## Eventos iniciais

- AppointmentScheduled;
- AppointmentConfirmed;
- AppointmentRescheduled;
- AppointmentCancelled.

## Responsabilidades

- nomear fatos no passado;
- registrar metadados mínimos;
- usar payload imutável;
- preservar aggregate revision;
- permitir tradução para integração;
- evitar dependência de broker.

## Fora de escopo

- Kafka;
- RabbitMQ;
- outbox completa;
- Event Storming;
- CQRS;
- projeções.
```

---

### 4. Criar interface base

```java
public interface DomainEvent {

    DomainEventId eventId();

    String eventType();

    EventVersion eventVersion();

    AppointmentId aggregateId();

    AppointmentRevision aggregateRevision();

    Instant occurredAt();

    CorrelationId correlationId();

    CausationId causationId();

    Optional<ActorReference> actor();
}
```

A interface usa tipos do domínio, sem mensagens, JSON, JPA, HTTP ou broker.

---

### 5. Criar tipos de metadados

```java
public record DomainEventId(
        UUID value) {

    public DomainEventId {
        Objects.requireNonNull(value);
    }

    public static DomainEventId generate() {
        return new DomainEventId(
                UUID.randomUUID());
    }
}
```

```java
public record EventVersion(
        int value) {

    public EventVersion {
        if (value < 1) {
            throw new IllegalArgumentException(
                    "Event version must be positive");
        }
    }
}
```

```java
public record CorrelationId(
        String value) {

    public CorrelationId {
        if (value == null
                || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Correlation id is required");
        }
    }
}
```

```java
public record CausationId(
        String value) {

    public CausationId {
        if (value == null
                || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Causation id is required");
        }
    }
}
```

---

### 6. Criar metadata policy

Arquivo:

```text
contracts/event-metadata-policy.yaml
```

Conteúdo:

```yaml
eventMetadata:
  required:
    - event-id
    - event-type
    - event-version
    - aggregate-id
    - aggregate-revision
    - occurred-at
    - correlation-id
    - causation-id

  optional:
    - actor-reference

  forbidden:
    - raw-token
    - personal-data
    - database-sequence-as-event-id
    - system-default-timezone
    - mutable-metadata
```

---

### 7. Nomear no passado

Use:

```text
AppointmentScheduled;

AppointmentConfirmed;

AppointmentRescheduled;

AppointmentCancelled.
```

Evite:

```text
ScheduleAppointment;

ConfirmAppointment;

AppointmentSchedule;

AppointmentChange;

UpdateAppointment.
```

Comando representa intenção.

Evento representa fato ocorrido.

---

### 8. Criar naming policy

Arquivo:

```text
contracts/event-naming-policy.yaml
```

Conteúdo:

```yaml
eventNaming:
  tense:
    past

  language:
    ubiquitous-language

  required:
    - specific-fact
    - meaningful-domain-term

  forbiddenSuffix:
    - Updated
    - Changed
    - Processed
    - Executed
    - Saved

  technicalName:
    forbidden
```

`Updated` não é sempre proibido em todos os domínios, mas exige justificativa forte.

No laboratório, será tratado como smell.

---

### 9. Criar `AppointmentScheduled`

```java
public record AppointmentScheduled(
        DomainEventId eventId,
        EventVersion eventVersion,
        AppointmentId aggregateId,
        AppointmentRevision aggregateRevision,
        ServiceRequestId serviceRequestId,
        CapacityReservationId reservationId,
        AppointmentWindow window,
        Instant occurredAt,
        CorrelationId correlationId,
        CausationId causationId,
        Optional<ActorReference> actor)
        implements DomainEvent {

    public AppointmentScheduled {
        Objects.requireNonNull(eventId);
        Objects.requireNonNull(eventVersion);
        Objects.requireNonNull(aggregateId);
        Objects.requireNonNull(aggregateRevision);
        Objects.requireNonNull(serviceRequestId);
        Objects.requireNonNull(reservationId);
        Objects.requireNonNull(window);
        Objects.requireNonNull(occurredAt);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(causationId);
        actor =
                actor == null
                        ? Optional.empty()
                        : actor;
    }

    @Override
    public String eventType() {
        return "appointment-scheduled";
    }
}
```

O payload contém apenas dados necessários, sem a Entity `Appointment`.

---

### 10. Criar payload policy

Arquivo:

```text
contracts/event-payload-policy.yaml
```

Conteúdo:

```yaml
eventPayload:
  required:
    - domain-meaning
    - immutable-types
    - minimum-data-for-reaction

  forbidden:
    - aggregate-entity
    - mutable-collection
    - persistence-record
    - lazy-proxy
    - technical-exception
    - raw-request
    - secret
    - personal-data-without-need

  snapshot:
    allowedWhen:
      - explicitly-versioned
      - justified
```

---

### 11. Granularidade

Compare:

```text
AppointmentUpdated
```

com:

```text
AppointmentConfirmed;

AppointmentRescheduled;

AppointmentCancelled.
```

Eventos específicos favorecem handlers claros, evolução controlada e menor acoplamento.

Evite criar um evento para cada setter técnico.


---

### 12. Criar documento de granularidade

Arquivo:

```text
domain-events/EVENT_GRANULARITY.md
```

Para cada candidato, registre:

- fato;
- quem se importa;
- reação;
- necessidade de auditoria;
- frequência;
- payload;
- risco;
- decisão.

Exemplo:

```text
AppointmentWindowFieldChanged:
rejeitado.

AppointmentRescheduled:
aprovado.
```

---

### 13. Registrar depois da mudança válida

Dentro da root:

```java
public void confirm(
        Instant occurredAt,
        EventContext context) {

    requireStatus(
            AppointmentStatus.SCHEDULED);

    status =
            AppointmentStatus.CONFIRMED;

    revision =
            revision.next();

    record(
            new AppointmentConfirmed(
                    DomainEventId.generate(),
                    new EventVersion(1),
                    id,
                    revision,
                    window,
                    occurredAt,
                    context.correlationId(),
                    context.causationId(),
                    context.actor()));
}
```


---

### 14. Não registrar antes da validação

Exemplo incorreto:

```java
record(new AppointmentConfirmed(...));

requireStatus(SCHEDULED);

status = CONFIRMED;
```

Se a validação falhar, um fato inexistente foi registrado.

A ordem correta é:

```text
validar;

mudar estado;

incrementar revisão;

registrar evento.
```

---

### 15. Criar recording policy

Arquivo:

```text
contracts/event-recording-policy.yaml
```

Conteúdo:

```yaml
eventRecording:
  owner:
    aggregate-root

  order:
    - validate
    - mutate
    - increment-revision
    - record-event

  failedOperation:
    events:
      zero

  rehydration:
    events:
      zero

  eventRevision:
    equalsAggregateRevisionAfterMutation:
      required
```

---

### 16. Criar recorder

```java
public final class DomainEventRecorder {

    private final List<DomainEvent> events =
            new ArrayList<>();

    public void record(
            DomainEvent event) {

        events.add(
                Objects.requireNonNull(event));
    }

    public RecordedDomainEvents pull() {

        RecordedDomainEvents result =
                new RecordedDomainEvents(
                        events);

        events.clear();

        return result;
    }
}
```

```java
public record RecordedDomainEvents(
        List<DomainEvent> events) {

    public RecordedDomainEvents {
        events =
                List.copyOf(events);
    }
}
```

---

### 17. Rehydration sem eventos

Quando o Repository reconstrói o Aggregate:

```java
Appointment.rehydrate(snapshot);
```

o recorder começa vazio.

Carregar estado não significa que um novo fato ocorreu.

Teste:

```java
assertTrue(
        rehydrated.pullEvents()
                .events()
                .isEmpty());
```

---

### 18. Criar `AppointmentConfirmed`

```java
public record AppointmentConfirmed(
        DomainEventId eventId,
        EventVersion eventVersion,
        AppointmentId aggregateId,
        AppointmentRevision aggregateRevision,
        AppointmentWindow confirmedWindow,
        Instant occurredAt,
        CorrelationId correlationId,
        CausationId causationId,
        Optional<ActorReference> actor)
        implements DomainEvent {

    @Override
    public String eventType() {
        return "appointment-confirmed";
    }
}
```

Não inclua todos os campos do Appointment.

Inclua somente o necessário para compreender o fato.

---

### 19. Criar `AppointmentRescheduled`

```java
public record AppointmentRescheduled(
        DomainEventId eventId,
        EventVersion eventVersion,
        AppointmentId aggregateId,
        AppointmentRevision aggregateRevision,
        AppointmentWindow previousWindow,
        AppointmentWindow currentWindow,
        CapacityReservationId previousReservationId,
        CapacityReservationId currentReservationId,
        RescheduleReason reason,
        Instant occurredAt,
        CorrelationId correlationId,
        CausationId causationId,
        Optional<ActorReference> actor)
        implements DomainEvent {

    @Override
    public String eventType() {
        return "appointment-rescheduled";
    }
}
```

A mudança anterior e atual são relevantes.

---

### 20. Criar `AppointmentCancelled`

```java
public record AppointmentCancelled(
        DomainEventId eventId,
        EventVersion eventVersion,
        AppointmentId aggregateId,
        AppointmentRevision aggregateRevision,
        CapacityReservationId reservationId,
        CancellationReason reason,
        Instant occurredAt,
        CorrelationId correlationId,
        CausationId causationId,
        Optional<ActorReference> actor)
        implements DomainEvent {

    @Override
    public String eventType() {
        return "appointment-cancelled";
    }
}
```

A reserva é necessária para reações posteriores.

---

### 21. Event Context

```java
public record EventContext(
        CorrelationId correlationId,
        CausationId causationId,
        Optional<ActorReference> actor) {

    public EventContext {
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(causationId);
        actor =
                actor == null
                        ? Optional.empty()
                        : actor;
    }
}
```

O Application Service cria esse contexto.

A root não acessa thread local, security context ou request.

---

### 22. Causation

Exemplo:

```text
ScheduleAppointmentCommand ID:
cmd-100.

AppointmentScheduled:
causation ID = cmd-100.

AppointmentNotificationPrepared:
causation ID = event ID de AppointmentScheduled.
```

Causation cria encadeamento.

Correlation agrupa o fluxo completo.

---

### 23. Actor Reference

```java
public record ActorReference(
        String actorId,
        String actorType) {

    public ActorReference {
        if (actorId == null
                || actorId.isBlank()) {
            throw new IllegalArgumentException(
                    "Actor id is required");
        }

        if (actorType == null
                || actorType.isBlank()) {
            throw new IllegalArgumentException(
                    "Actor type is required");
        }
    }
}
```

Não inclua nome, e-mail ou token sem necessidade.

---

### 24. Criar event catalog

Arquivo:

```text
domain-events/EVENT_CATALOG.md
```

Para cada evento, registre:

- event type;
- versão;
- Aggregate;
- momento;
- owner;
- payload;
- handlers;
- integration translation;
- compatibilidade;
- status;
- data de revisão.

---

### 25. Versionamento

Versão inicial:

```text
appointment-scheduled v1.
```

A versão pertence ao contrato.

Não use somente versão da aplicação.

Mudanças compatíveis podem manter a versão; breaking changes exigem outra.

---

### 26. Criar versioning policy

Arquivo:

```text
contracts/event-versioning-policy.yaml
```

Conteúdo:

```yaml
eventVersioning:
  explicit:
    required

  initialVersion:
    1

  compatibleChange:
    mayKeepVersion:
      true

  breakingChange:
    requires:
      - new-version
      - migration-plan
      - consumer-review
      - compatibility-test

  applicationVersionAsEventVersion:
    forbidden

  silentBreakingChange:
    forbidden
```

---

### 27. Mudanças compatíveis

Exemplos geralmente compatíveis:

- adicionar campo opcional;
- adicionar metadata não obrigatória;
- corrigir documentação;
- ampliar enum com estratégia documentada.


---

### 28. Mudanças incompatíveis

Exemplos:

- remover campo;
- renomear campo;
- mudar significado;
- trocar tipo;
- mudar unidade;
- tornar opcional em obrigatório;
- dividir um evento sem plano;
- alterar event type.

---

### 29. Criar compatibility policy

Arquivo:

```text
contracts/event-compatibility-policy.yaml
```

Conteúdo:

```yaml
eventCompatibility:
  consumer:
    tolerantReader:
      recommended

  producer:
    additiveChange:
      preferred

  removedField:
    requiresNewVersion:
      true

  changedMeaning:
    requiresNewVersion:
      true

  enumExpansion:
    consumerFallback:
      required

  compatibilityTest:
    required
```

---

### 30. Domain Event versus Integration Event

Domain Event pertence ao modelo interno.

Integration Event pertence ao contrato entre contextos.

Exemplo:

```text
Domain Event:
AppointmentRescheduled.

Integration Event:
ServiceAppointmentWindowChangedV1.
```

Eles podem ter nomes, payloads, versões e owners diferentes.

---

### 31. Criar documento de separação

Arquivo:

```text
domain-events/DOMAIN_VS_INTEGRATION_EVENT.md
```

Tabela:

```text
Aspecto
| Domain Event
| Integration Event

Owner
| domínio
| contrato de integração

Linguagem
| interna
| publicada

Payload
| necessário ao domínio
| mínimo para consumidores

Versionamento
| interno
| compatibilidade externa

Transporte
| nenhum
| broker ou API

Persistência
| opcional
| outbox futura
```

---

### 32. Criar Integration Event

```java
public sealed interface IntegrationEvent {

    UUID messageId();

    String messageType();

    int schemaVersion();

    Instant occurredAt();

    String correlationId();
}
```

Esse contrato fica fora do domínio.

---

### 33. Criar translator

```java
public final class AppointmentIntegrationEventTranslator {

    public IntegrationEvent translate(
            DomainEvent event) {

        return switch (event) {

            case AppointmentScheduled scheduled ->
                    toIntegration(scheduled);

            case AppointmentRescheduled rescheduled ->
                    toIntegration(rescheduled);

            case AppointmentCancelled cancelled ->
                    toIntegration(cancelled);

            case AppointmentConfirmed confirmed ->
                    toIntegration(confirmed);
        };
    }
}
```


---

### 34. Criar integration policy

Arquivo:

```text
contracts/integration-event-policy.yaml
```

Conteúdo:

```yaml
integrationEvent:
  translatedFromDomainEvent:
    allowed

  sameClassAsDomainEvent:
    discouraged

  requires:
    - message-id
    - message-type
    - schema-version
    - occurred-at
    - correlation-id
    - minimal-payload

  brokerHeadersInsideDomain:
    forbidden

  outbox:
    deferred
```

---

### 35. Dispatcher interno

```java
public interface DomainEventHandler<E extends DomainEvent> {

    Class<E> eventType();

    void handle(
            E event);
}
```

```java
public interface DomainEventDispatcher {

    void dispatch(
            RecordedDomainEvents events);
}
```


---

### 36. Criar InMemory Dispatcher

```java
public final class InMemoryDomainEventDispatcher
        implements DomainEventDispatcher {

    private final Map<Class<?>, List<DomainEventHandler<?>>>
            handlers;

    @Override
    public void dispatch(
            RecordedDomainEvents recorded) {

        for (DomainEvent event : recorded.events()) {

            for (DomainEventHandler<?> handler :
                    handlers.getOrDefault(
                            event.getClass(),
                            List.of())) {

                invoke(
                        handler,
                        event);
            }
        }
    }
}
```

---

### 37. Criar dispatch policy

Arquivo:

```text
contracts/event-dispatch-policy.yaml
```

Conteúdo:

```yaml
eventDispatch:
  timing:
    afterCommit:
      required

  handler:
    explicit:
      required

  handlerOrder:
    notGuaranteedByDefault:
      true

  duplicateDelivery:
    possible:
      documented

  failure:
    explicitPolicy:
      required

  broker:
    notRequiredForDomainDispatch
```

---

### 38. Handler de auditoria

```java
public final class RecordAppointmentAudit
        implements DomainEventHandler<
                AppointmentRescheduled> {

    @Override
    public Class<AppointmentRescheduled>
    eventType() {

        return AppointmentRescheduled.class;
    }

    @Override
    public void handle(
            AppointmentRescheduled event) {

        auditPort.record(
                AppointmentAuditEntry.from(
                        event));
    }
}
```


---

### 39. Handler de capacidade

```java
public final class ReleasePreviousCapacityReservation
        implements DomainEventHandler<
                AppointmentRescheduled> {

    @Override
    public void handle(
            AppointmentRescheduled event) {

        capacityReleasePort.release(
                event.previousReservationId(),
                event.correlationId());
    }
}
```


---

### 40. Handler de notificação

`PrepareAppointmentNotification` pode:

- traduzir fato;
- selecionar template;
- criar comando de notificação;
- usar output port.

Ele não altera diretamente o Aggregate que originou o evento.

---

### 41. Falha de handler

Opções:

```text
fail-fast;

continue-and-report;

retry;

dead-letter futura;

compensação;

registro para intervenção.
```

No laboratório:

```text
handlers internos críticos:
fail-fast antes de confirmar resultado operacional.

handlers externos after commit:
registrar falha e retornar publication result.
```


---

### 42. Criar handler policy

Arquivo:

```text
domain-events/HANDLER_POLICY.md
```

Registre:

- handler;
- evento;
- criticidade;
- sincronismo;
- retryable;
- idempotência;
- owner;
- erro;
- observabilidade;
- transporte.

---

### 43. Criar publication service

```java
public final class AppointmentEventPublishingService {

    private final DomainEventDispatcher dispatcher;
    private final AppointmentIntegrationEventTranslator
            translator;
    private final IntegrationEventPublisher
            integrationPublisher;

    public DomainEventPublicationResult publish(
            RecordedDomainEvents events) {

        dispatcher.dispatch(events);

        for (DomainEvent event : events.events()) {
            integrationPublisher.publish(
                    translator.translate(event));
        }

        return DomainEventPublicationResult.success(
                events.events().size());
    }
}
```

Esse serviço pertence à aplicação.

O domínio não conhece publisher.

---

### 44. After commit

```java
RecordedDomainEvents events =
        appointment.pullEvents();

afterCommit.register(
        () ->
                publishingService.publish(
                        events));
```

Se a transação falhar:

```text
não publicar.
```

Se o after commit falhar:

```text
registrar falha;
não fingir rollback do banco;
acionar recuperação.
```


---

### 45. Criar publication timing

Arquivo:

```text
domain-events/PUBLICATION_TIMING.md
```

Fluxo:

```text
validar;

mudar Aggregate;

registrar evento;

salvar Aggregate;

commit;

dispatch interno;

traduzir Integration Event;

publicar externamente.
```

---

### 46. Duplicação

Handlers podem receber o mesmo evento mais de uma vez em arquiteturas distribuídas.

Use:

```text
eventId
```

como chave de deduplicação no consumidor quando necessário.

Nesta aula, documente e teste o contrato sem broker.

---

### 47. Ordering

A revisão do Aggregate permite ordenar eventos do mesmo Aggregate:

```text
revision 3;
revision 4;
revision 5.
```

Não assuma ordem global entre Aggregates.


---

### 48. Timestamp

`occurredAt` representa o momento do fato.

Ele não é necessariamente:

- momento de publicação;
- momento de consumo;
- timestamp do banco;
- timestamp do broker.

Se necessário, contratos externos podem adicionar:

```text
publishedAt.
```

---

### 49. Event ID versus Aggregate ID

```text
eventId:
identifica o fato.

aggregateId:
identifica a origem.

correlationId:
agrupa fluxo.

causationId:
identifica a causa.
```


---

### 50. Imutabilidade

Eventos usam fields finais, Value Objects imutáveis e cópias defensivas, sem Entity mutável ou setters.


---

### 51. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
eventObservability:
  required:
    - event-id
    - event-type
    - event-version
    - aggregate-id
    - aggregate-revision
    - correlation-id
    - causation-id
    - publication-outcome
    - duration

  forbidden:
    - raw-payload
    - personal-data
    - token
    - secret
    - stack-trace-as-public-result
```

---

### 52. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  eventWithoutId:
    action:
      FAIL

  eventWithoutVersion:
    action:
      FAIL

  eventBeforeMutation:
    action:
      FAIL

  failedOperationWithEvent:
    action:
      FAIL

  mutablePayload:
    action:
      FAIL

  entityReferenceInPayload:
    action:
      FAIL

  technicalEventName:
    action:
      FAIL

  domainAndIntegrationSameClass:
    result:
      REVIEW
```

---

### 53. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidEventMetadata:
    action:
      REJECT

  eventHandlerFailure:
    action:
      REPORT_BY_HANDLER_POLICY

  integrationTranslationFailure:
    action:
      PUBLICATION_FAILURE

  publishAfterCommitFailure:
    action:
      RECOVERY_REQUIRED

  duplicateEvent:
    action:
      IDEMPOTENT_IGNORE_WHEN_SUPPORTED

  EventStormingWorkshop:
    deferredToLesson630

  CQRSDeepDive:
    deferredToLesson631
```

---

### 54. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson630:
    forbidden:
      - full-event-storming-workshop
      - sticky-note-board
      - hotspot-facilitation
      - big-picture-session
      - process-level-session

  lesson631:
    forbidden:
      - command-query-separation-deep-dive
      - read-model-projection
      - projection-rebuild
      - separate-read-store

  allowed:
    - event-catalog
    - event-handler
    - integration-translation
    - after-commit-dispatch
```

---

### 55. Testar gravação

```java
@Test
void shouldRecordEventAfterSuccessfulConfirmation() {

    Appointment appointment =
            Fixtures.scheduledAppointment();

    appointment.confirm(
            Fixtures.now(),
            Fixtures.eventContext());

    RecordedDomainEvents events =
            appointment.pullEvents();

    assertEquals(
            1,
            events.events().size());

    AppointmentConfirmed event =
            assertInstanceOf(
                    AppointmentConfirmed.class,
                    events.events().getFirst());

    assertEquals(
            appointment.revision(),
            event.aggregateRevision());
}
```

---

### 56. Testar operação falha

```java
@Test
void failedOperationMustNotRecordEvent() {

    Appointment appointment =
            Fixtures.cancelledAppointment();

    assertThrows(
            InvalidAppointmentTransition.class,
            () ->
                    appointment.confirm(
                            Fixtures.now(),
                            Fixtures.eventContext()));

    assertTrue(
            appointment.pullEvents()
                    .events()
                    .isEmpty());
}
```

---

### 57. Testar revisão

Confirme:

- revisão incrementada antes do evento;
- evento usa nova revisão;
- dois eventos sucessivos possuem revisões crescentes;
- rehydration preserva revisão;
- load não cria evento.

---

### 58. Testar metadados

Valide:

- event ID único;
- event type estável;
- version positiva;
- correlation ID obrigatória;
- causation ID obrigatória;
- occurredAt não nulo;
- actor opcional;
- nenhuma coleção mutável.

---

### 59. Testar naming

Procure classes terminadas em:

```text
Command;

Request;

Updated;

Changed;

Processed.
```

No package de Domain Events, qualquer ocorrência precisa de revisão.


---

### 60. Testar separação de integração

`IntegrationEventSeparationTest` confirma:

- Domain Event não implementa `IntegrationEvent`;
- Integration Event não está em package `domain`;
- translator é explícito;
- broker types não aparecem;
- schema version é independente.

---

### 61. Testar dispatcher

Cenários:

- zero handlers;
- um handler;
- múltiplos handlers;
- tipos diferentes;
- falha de handler;
- eventos na ordem do lote;
- lote imutável.

---

### 62. Testar compatibilidade

Crie fixtures:

```text
AppointmentScheduledV1;
AppointmentScheduledV1 com novo campo opcional;
consumer V1.
```

Confirme que o consumidor tolerante continua funcionando.


---

### 63. Criar architecture test

```java
@ArchTest
static final ArchRule domainEventsMustNotDependOnBrokers =
        noClasses()
                .that()
                .resideInAPackage(
                        "..event..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "org.springframework.kafka..",
                        "org.springframework.amqp..",
                        "org.apache.kafka..",
                        "..integration..",
                        "..infrastructure..");
```

---

### 64. Validar catálogo

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-catalog.ps1
```

Confirme:

- tipo;
- versão;
- Aggregate;
- owner;
- payload;
- handlers;
- compatibilidade;
- status.

---

### 65. Validar nomes

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-names.ps1
```

Procure:

- verbos no imperativo;
- nomes técnicos;
- `Updated`;
- `Changed`;
- `Processed`;
- nomes sem termo do domínio.

---

### 66. Validar metadados

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-metadata.ps1
```

Confirme:

- event ID;
- event type;
- version;
- Aggregate ID;
- revision;
- occurredAt;
- correlation;
- causation;
- actor.

---

### 67. Validar payloads

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-payloads.ps1
```

Procure:

- Entity;
- persistence record;
- mutable collection;
- token;
- segredo;
- dado pessoal;
- payload excessivo;
- tipo técnico.

---

### 68. Validar versões

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-versions.ps1
```

Confirme:

- versão explícita;
- alteração compatível;
- breaking change;
- migration plan;
- compatibility test;
- schema de integração separado.

---

### 69. Validar recording

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-recording.ps1
```

Confirme:

- validação;
- mutation;
- revisão;
- gravação;
- falha sem evento;
- rehydration sem evento.

---

### 70. Validar dispatch

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-dispatch.ps1
```

Confirme:

- after commit;
- handlers explícitos;
- falha documentada;
- order não assumida globalmente;
- deduplicação documentada.

---

### 71. Validar separação

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-domain-integration-separation.ps1
```

Confirme:

- classes diferentes;
- packages diferentes;
- translator explícito;
- versões independentes;
- zero broker no domínio.

---

### 72. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-events\run-domain-event-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- recording;
- failed operation;
- metadata;
- revision;
- immutability;
- naming;
- dispatcher;
- handler failure;
- translation;
- compatibility;
- arquitetura.

---

### 73. Criar reports

Exemplo:

```yaml
eventCatalog:
  events:
    - appointment-scheduled
    - appointment-confirmed
    - appointment-rescheduled
    - appointment-cancelled

  eventsWithoutVersion:
    0

  eventsWithoutCorrelation:
    0

  mutablePayloads:
    0

  entityReferences:
    0

  brokerDependencies:
    0

  result:
    PASS
```

---

### 74. Criar gate

O gate valida catálogo, naming, granularidade, metadata, payload, recording, revisão, versões, compatibilidade, dispatch, separação, timing, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_EVENT_NAME;

FAIL_METADATA;

FAIL_PAYLOAD;

FAIL_RECORDING;

FAIL_REVISION;

FAIL_VERSIONING;

FAIL_COMPATIBILITY;

FAIL_DISPATCH;

FAIL_HANDLER;

FAIL_INTEGRATION_SEPARATION;

FAIL_PUBLICATION_TIMING;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 75. Coletar evidence

Arquivo:

```text
contracts/domain-events-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- event count;
- event catalog status;
- naming status;
- metadata status;
- payload status;
- recording status;
- revision status;
- versioning status;
- compatibility status;
- dispatch status;
- integration separation status;
- publication timing status;
- broker dependency count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- payload real;
- token;
- segredo;
- endpoint real;
- broker real;
- Event Storming completo;
- CQRS aprofundado.

---

### 76. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-domain-events-contract.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-catalog.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-names.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-metadata.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-payloads.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-versions.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-recording.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-dispatch.ps1

.\scripts\m19\service-scheduling-domain-events\validate-domain-integration-separation.ps1

.\scripts\m19\service-scheduling-domain-events\validate-event-observability.ps1

.\scripts\m19\service-scheduling-domain-events\run-domain-event-tests.ps1

.\scripts\m19\service-scheduling-domain-events\collect-domain-event-evidence.ps1

.\scripts\m19\service-scheduling-domain-events\verify-domain-events-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 77. Encerrar o laboratório

Confirme:

- eventos nomeados no passado;
- event IDs únicos;
- Aggregate ID explícito;
- revisão explícita;
- occurredAt explícito;
- correlation e causation;
- actor mínimo;
- payload imutável;
- zero Entity no payload;
- zero tipo de broker;
- gravação após mudança válida;
- falha sem evento;
- rehydration sem evento;
- versões explícitas;
- compatibilidade testada;
- dispatcher interno;
- handlers documentados;
- tradução para Integration Event;
- publicação after commit;
- Event Storming não antecipado;
- CQRS não aprofundado;
- reports sanitizados.

---

## Entendendo o que foi feito

### Os fatos ganharam linguagem

Eventos deixaram de ser mudanças técnicas genéricas.

### A Aggregate Root ganhou responsabilidade

Somente mudanças válidas passaram a registrar fatos.

### Os metadados ganharam semântica

Event ID, Aggregate ID, correlation e causation passaram a ter papéis distintos.

### A revisão ganhou rastreabilidade

Cada evento passou a carregar a versão da root após a mudança.

### O payload ganhou limite

Entities, records técnicos e dados sensíveis ficaram de fora.

### O versionamento ganhou política

Breaking changes passaram a exigir nova versão e compatibilidade.

### O dispatcher ganhou fronteira

Handlers internos passaram a reagir sem introduzir broker no domínio.

### A integração ganhou tradução

Domain Event e Integration Event deixaram de compartilhar a mesma classe.

### A publicação ganhou timing

Eventos só são despachados depois do commit.

### A observabilidade ganhou identidade

Fluxos passaram a ser rastreados por evento, correlação e causa.

---

## Erros comuns importantes

### Usar nome genérico

`AppointmentUpdated` exige inferência e cria acoplamento.

### Registrar antes da mudança

Uma falha pode produzir fato inexistente.

### Registrar evento em rehydration

Carregamento passa a parecer mudança de negócio.

### Colocar Entity no payload

Mutabilidade e internals vazam.

### Usar o mesmo tipo para integração

O domínio fica acoplado a consumidores externos.

### Ignorar versionamento

Mudanças silenciosas quebram handlers.

### Publicar antes do commit

Consumidores recebem mudanças revertidas.

### Assumir ordenação global

Eventos de Aggregates diferentes podem intercalar.

### Confundir evento com comando

Intenção e fato têm semânticas diferentes.

### Antecipar Event Storming ou CQRS

A aula perde o foco na modelagem de fatos.

---

## Comandos úteis

### Validar catálogo

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-catalog.ps1
```

### Validar metadados

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-metadata.ps1
```

### Validar recording

```powershell
.\scripts\m19\service-scheduling-domain-events\validate-event-recording.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-domain-events\run-domain-event-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-domain-events\verify-domain-events-gate.ps1
```

---

## Exercício guiado

Construa o catálogo, nomeie fatos no passado, adicione metadados, limite payloads, registre depois da mudança, versione contratos, crie handlers, traduza Integration Events, publique após commit e valide o gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 628 e ponte para a aula 630 foram preservadas;
- o laboratório `service-scheduling-domain-events` foi criado;
- Domain Event Charter foi criado;
- catálogo de eventos foi criado;
- eventos usam nomes no passado;
- nomes técnicos e genéricos foram evitados;
- `AppointmentScheduled` foi implementado;
- `AppointmentConfirmed` foi implementado;
- `AppointmentRescheduled` foi implementado;
- `AppointmentCancelled` foi implementado;
- todo evento possui event ID;
- todo evento possui event type;
- todo evento possui versão;
- todo evento possui Aggregate ID;
- todo evento possui Aggregate Revision;
- todo evento possui occurredAt;
- todo evento possui correlation ID;
- todo evento possui causation ID;
- actor reference é mínimo e opcional;
- payloads são imutáveis;
- payloads não contêm Entity;
- payloads não contêm persistence record;
- payloads não contêm token ou segredo;
- root registra somente após validação e mudança;
- operações falhas não registram eventos;
- rehydration não registra eventos;
- evento usa a revisão posterior à mudança;
- versionamento é explícito;
- breaking changes exigem nova versão;
- compatibility tests foram criados;
- dispatcher não depende de broker;
- handlers possuem política de falha;
- ordering global não foi assumida;
- duplicação foi documentada;
- Domain Event e Integration Event são classes diferentes;
- translator explícito foi criado;
- publicação ocorre após commit;
- falha after commit exige recuperação;
- arquitetura bloqueia Kafka e RabbitMQ no domínio;
- Event Storming não foi antecipado;
- CQRS não foi aprofundado;
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
  labs/m19/aula-629-domain-events/service-scheduling-domain-events `
  scripts/m19/service-scheduling-domain-events `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|rawPayload|KafkaTemplate|RabbitTemplate|ProducerRecord|JpaEntityInsideEvent|eventStormingWorkshop|cqrsDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): modelar Domain Events"
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
- payloads reais;
- broker real;
- Entity no evento;
- Event Storming completo;
- CQRS aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Domain Events.

Você criou charter, catálogo, metadata, payload, recording, revisão, contexto, versionamento, dispatcher, handlers, translator e testes arquiteturais.

Você comprovou que Domain Event representa fato ocorrido, usa metadados distintos, payload mínimo, versionamento, tradução para integração e publicação após commit.

A próxima aula será:

```text
630 - M19.20 - Event Storming
```

Nela, você irá usar eventos, comandos, atores, policies, sistemas externos, read models e hotspots para descobrir e revisar fluxos do domínio de forma colaborativa.

Nenhum workshop completo de Event Storming ou aprofundamento de CQRS foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Nomeei eventos no passado.
- [ ] Adicionei metadados obrigatórios.
- [ ] Mantive payloads imutáveis.
- [ ] Registrei eventos após mudanças válidas.
- [ ] Evitei eventos na rehydration.
- [ ] Versionei contratos.
- [ ] Separei Domain e Integration Events.
- [ ] Publiquei somente após commit.

---

## Troubleshooting adicional

### O evento está se chamando `Updated`

Identifique o fato específico que ocorreu.

### O payload precisa da Entity inteira

Crie um payload mínimo com Value Objects e identificadores.

### O evento é registrado em operação inválida

Mova o recording para depois da validação e mutation.

### A rehydration produz eventos

Separe construtor de criação e método de rehydration.

### O consumidor precisa de outro campo

Avalie mudança aditiva, nova versão ou novo Integration Event.

### O dispatcher depende de Kafka

Crie interface interna e adapter externo.

### O handler falha depois do commit

Registre publication failure e defina recuperação.

### Eventos chegam duplicados

Use event ID e handler idempotente quando necessário.

### Eventos chegam fora de ordem

Use Aggregate Revision e política do consumidor.

### O laboratório começou um mural colaborativo

Preserve Event Storming para a aula 630.

---

## Perguntas de revisão

1. O que é Domain Event?
2. Qual diferença entre comando e evento?
3. Por que nomear no passado?
4. O que é event ID?
5. O que é Aggregate ID?
6. O que é Aggregate Revision?
7. O que é correlation ID?
8. O que é causation ID?
9. O que é occurredAt?
10. O que deve entrar no payload?
11. O que não deve entrar no payload?
12. Quando a root registra o evento?
13. Rehydration registra eventos?
14. O que é Event Version?
15. Quando criar nova versão?
16. Qual diferença entre Domain e Integration Event?
17. Quem publica depois do commit?
18. Broker pertence ao domínio?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fato significativo que aconteceu no domínio.
2. Comando é intenção; evento é fato.
3. Porque o fato já aconteceu.
4. Identidade única do fato.
5. Identidade da origem.
6. Versão do Aggregate após a mudança.
7. Agrupa operações do mesmo fluxo.
8. Identifica a causa direta.
9. Momento do fato.
10. Dados mínimos para compreender e reagir.
11. Entity, tipos técnicos, segredos e dados desnecessários.
12. Depois de validar, mudar e incrementar revisão.
13. Não.
14. Versão do contrato do evento.
15. Em breaking change.
16. Um é interno; o outro é contrato externo.
17. A aplicação por after commit.
18. Não.
19. Event Storming.
20. Event Storming.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 629 - M19.19 - Domain Events

- Aprofundei Domain Events.
- Criei o laboratório `service-scheduling-domain-events`.
- Criei Domain Event Charter e catálogo de eventos.
- Modelei `AppointmentScheduled`.
- Modelei `AppointmentConfirmed`.
- Modelei `AppointmentRescheduled`.
- Modelei `AppointmentCancelled`.
- Usei nomes no passado e linguagem do domínio.
- Adicionei event ID, event type e event version.
- Adicionei Aggregate ID e Aggregate Revision.
- Adicionei occurredAt, correlation ID e causation ID.
- Modelei actor reference mínimo e opcional.
- Mantive payloads imutáveis.
- Evitei Entity, records técnicos e dados sensíveis nos eventos.
- Registrei eventos somente após mudanças válidas.
- Garanti que falhas não produzem eventos.
- Mantive rehydration sem eventos.
- Criei Event Context.
- Criei políticas de versionamento e compatibilidade.
- Diferenciei Domain Event de Integration Event.
- Criei translator explícito para integração.
- Criei dispatcher e handlers internos.
- Mantive broker fora do domínio.
- Registrei publicação somente após commit.
- Criei testes de metadata, recording, revision, compatibility e arquitetura.
- Criei reports, gate e evidence.
- Não antecipei Event Storming ou CQRS.
- Próxima aula: Event Storming.
```

---

## Referência técnica curta

- Domain Event.
- Event Identity.
- Aggregate Revision.
- Correlation ID.
- Causation ID.
- Event Versioning.
- Event Compatibility.
- Domain Event Handler.
- Integration Event.
- After Commit Publication.

Regra final:

```text
Domain Event precisa representar um fato específico e imutável do domínio: eventos como `AppointmentScheduled`, `AppointmentConfirmed`, `AppointmentRescheduled` e `AppointmentCancelled` são nomeados no passado, possuem event ID, event type, event version, Aggregate ID, Aggregate Revision, occurredAt, correlation ID, causation ID e actor reference mínimo, e carregam somente Value Objects e identificadores necessários, sem Entities, records de persistência, tokens, segredos ou tipos de broker; a Aggregate Root valida a operação, muda o estado, incrementa a revisão e só então registra o evento, enquanto operações falhas e rehydration produzem zero eventos; contratos evoluem por versionamento explícito, breaking changes exigem nova versão e compatibility tests, Domain Events permanecem internos e são traduzidos para Integration Events separados, com payload, owner e schema próprios; dispatch interno usa handlers explícitos, publicação externa ocorre somente após commit, falhas posteriores exigem recuperação, duplicação e ordering são tratados por event ID e Aggregate Revision sem assumir ordem global; o gate termina com catálogo, naming, metadata, payload, recording, revision, versioning, compatibility, dispatch, integração, timing, testes, arquitetura, documentação e evidence aprovados, enquanto Event Storming é aprofundado somente na aula 630 e CQRS permanece reservado à aula 631.
```
