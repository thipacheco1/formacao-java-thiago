# 632 - M19.22 - Event Sourcing conceitual

## Apresentação da aula

Na aula 631, você aprofundou CQRS.

Você separou Command Side e Query Side, mantendo Aggregate Root, invariantes, revisão e Domain Events na escrita, enquanto a leitura ganhou views, projections, freshness e rebuild.

Na estratégia anterior, a Aggregate Root ainda era persistida como estado atual; Domain Events eram registrados, mas não constituíam a fonte de reconstrução.

Isso muda essa decisão.

Em um modelo event-sourced, a fonte de verdade deixa de ser apenas:

```text
o estado atual.
```

Ela passa a ser:

```text
a sequência de fatos
que levou ao estado atual.
```

Para um Appointment, o stream poderia ser:

```text
1. AppointmentScheduled;
2. AppointmentConfirmed;
3. AppointmentRescheduled;
4. AppointmentCancelled.
```

O estado atual é derivado ao reaplicar os eventos na ordem correta.

Isso permite reconstruir como chegou ao estado atual, quais decisões ocorreram, qual versão existia e como refazer projections.

O padrão exige decisões sobre streams, append-only, concorrência, replay, snapshots, evolução, privacidade, integridade, operação e tooling.

Isso não significa log, broker, Kafka, CQRS obrigatório, JSON sem contrato ou processamento assíncrono.

A pergunta será:

```text
o que muda
quando eventos passam
a ser a fonte de verdade

e quais custos
devem ser aceitos
antes de adotar
Event Sourcing?
```

Laboratório:

```text
labs/m19/aula-632-event-sourcing-conceitual/service-appointment-event-stream
```

Você construirá Event Stream, Event Store, append, expected version, replay, snapshots, upcasters, temporal views, integridade e testes.


A próxima aula oficial será `633 - M19.23 - Arquitetura orientada a eventos`.

Esta aula não aprofundará brokers, producers, consumers, partitions, DLQ, delivery guarantees, choreography ou topologias distribuídas.

A aula 634 será `Consistencia eventual`.

A aula apenas reconhecerá que projections podem convergir depois, sem aprofundar causalidade, conflitos entre réplicas ou UX para dados stale.

Regra central:

```text
Event Sourcing
armazena fatos imutáveis
como fonte de verdade;

o estado atual
é uma projeção
do stream.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
630:
Event Storming.

631:
CQRS.

632:
Event Sourcing conceitual.

633:
Arquitetura orientada a eventos.

634:
Consistencia eventual.
```

A progressão vai da descoberta e CQRS para eventos persistidos, arquitetura orientada a eventos e convergência.

Nesta aula, Event Stream, Event Store didático, append-only, expected version, replay, snapshots, upcasting e temporal views serão praticados. Brokers e consistência eventual não serão aprofundados.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-632-event-sourcing-conceitual/service-appointment-event-stream
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/eventsourcing
│   │           ├── domain
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── AppointmentStatus.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── AppointmentRevision.java
│   │           │   ├── CapacityReservationId.java
│   │           │   ├── RescheduleReason.java
│   │           │   ├── CancellationReason.java
│   │           │   └── EventSourcedAppointment.java
│   │           ├── event
│   │           │   ├── AppointmentEvent.java
│   │           │   ├── AppointmentScheduled.java
│   │           │   ├── AppointmentConfirmed.java
│   │           │   ├── AppointmentRescheduled.java
│   │           │   ├── AppointmentCancelled.java
│   │           │   ├── EventId.java
│   │           │   ├── EventType.java
│   │           │   ├── EventVersion.java
│   │           │   ├── StreamVersion.java
│   │           │   ├── EventMetadata.java
│   │           │   └── StoredEvent.java
│   │           ├── store
│   │           │   ├── EventStore.java
│   │           │   ├── EventStream.java
│   │           │   ├── ExpectedStreamVersion.java
│   │           │   ├── AppendResult.java
│   │           │   ├── InMemoryEventStore.java
│   │           │   ├── EventStreamNotFound.java
│   │           │   ├── WrongExpectedStreamVersion.java
│   │           │   └── CorruptedEventStream.java
│   │           ├── repository
│   │           │   ├── EventSourcedAppointmentRepository.java
│   │           │   └── DefaultEventSourcedAppointmentRepository.java
│   │           ├── snapshot
│   │           │   ├── AppointmentSnapshot.java
│   │           │   ├── SnapshotStore.java
│   │           │   ├── InMemorySnapshotStore.java
│   │           │   └── SnapshotPolicy.java
│   │           ├── evolution
│   │           │   ├── EventUpcaster.java
│   │           │   ├── EventUpcasterChain.java
│   │           │   ├── AppointmentScheduledV1ToV2Upcaster.java
│   │           │   └── UnsupportedHistoricalEvent.java
│   │           ├── application
│   │           │   ├── ScheduleAppointmentHandler.java
│   │           │   ├── ConfirmAppointmentHandler.java
│   │           │   ├── RescheduleAppointmentHandler.java
│   │           │   ├── CancelAppointmentHandler.java
│   │           │   └── TemporalAppointmentQuery.java
│   │           └── integrity
│   │               ├── EventStreamIntegrityValidator.java
│   │               ├── StreamIntegrityResult.java
│   │               └── StreamHash.java
│   └── test
│       └── java
│           └── br/com/formacao/eventsourcing
│               ├── domain
│               │   ├── AppointmentReplayTest.java
│               │   ├── AppointmentDecisionTest.java
│               │   ├── FailedDecisionMustNotAppendEventTest.java
│               │   └── AppointmentTemporalStateTest.java
│               ├── store
│               │   ├── EventStoreContractTest.java
│               │   ├── InMemoryEventStoreTest.java
│               │   ├── ExpectedStreamVersionTest.java
│               │   ├── AppendOnlyTest.java
│               │   └── EventStreamIntegrityTest.java
│               ├── snapshot
│               │   ├── AppointmentSnapshotTest.java
│               │   └── SnapshotFallbackTest.java
│               ├── evolution
│               │   ├── EventUpcasterChainTest.java
│               │   └── HistoricalEventCompatibilityTest.java
│               └── architecture
│                   ├── EventSourcingBoundaryTest.java
│                   ├── EventStoreIndependenceTest.java
│                   ├── HistoricalEventImmutabilityTest.java
│                   └── BrokerIndependenceTest.java
├── event-sourcing
│   ├── EVENT_SOURCING_CHARTER.md
│   ├── ADOPTION_DECISION.md
│   ├── EVENT_STREAM_MODEL.md
│   ├── APPEND_POLICY.md
│   ├── REPLAY_POLICY.md
│   ├── SNAPSHOT_POLICY.md
│   ├── EVENT_EVOLUTION.md
│   ├── UPCASTING_POLICY.md
│   ├── TEMPORAL_QUERY.md
│   ├── PRIVACY_AND_RETENTION.md
│   ├── STREAM_INTEGRITY.md
│   ├── OPERATIONAL_MODEL.md
│   ├── FAILURE_RECOVERY.md
│   ├── TEST_STRATEGY.md
│   ├── TRADE_OFFS.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_EVENT_SOURCING_QUESTIONS.md
├── contracts
│   ├── event-sourcing-contract.yaml
│   ├── event-stream-policy.yaml
│   ├── append-policy.yaml
│   ├── replay-policy.yaml
│   ├── snapshot-policy.yaml
│   ├── event-evolution-policy.yaml
│   ├── upcasting-policy.yaml
│   ├── temporal-query-policy.yaml
│   ├── privacy-retention-policy.yaml
│   ├── stream-integrity-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── stream-model-report.yaml
    ├── append-report.yaml
    ├── replay-report.yaml
    ├── snapshot-report.yaml
    ├── evolution-report.yaml
    ├── integrity-report.yaml
    ├── operational-report.yaml
    └── event-sourcing-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-appointment-event-stream
├── validate-event-sourcing-contract.ps1
├── validate-event-stream-model.ps1
├── validate-append-policy.ps1
├── validate-replay-policy.ps1
├── validate-snapshots.ps1
├── validate-event-evolution.ps1
├── validate-upcasters.ps1
├── validate-temporal-queries.ps1
├── validate-stream-integrity.ps1
├── validate-privacy-retention.ps1
├── run-event-sourcing-tests.ps1
├── collect-event-sourcing-evidence.ps1
└── verify-event-sourcing-gate.ps1
```

---

## Conceito essencial

### Event Sourcing e Event Stream

Event Sourcing persiste eventos imutáveis como fonte de verdade; o Event Stream é a sequência ordenada de uma identidade.

### Versionamento e append

Stream Version indica a posição atual; Expected Stream Version protege concorrência; append inclui somente no final.

### Replay e Event Store

Replay reaplica eventos; Event Store persiste streams e envelopes com metadata.

### Snapshot, Upcaster e Temporal Query

Snapshot acelera reconstrução; Upcaster adapta eventos históricos; Temporal Query reconstrói um estado passado.

### Integridade

Append-only, ordem, identidade e completude protegem a história.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-632-event-sourcing-conceitual/service-appointment-event-stream

Set-Location `
  labs/m19/aula-632-event-sourcing-conceitual/service-appointment-event-stream
```

---

### 2. Criar Event Sourcing Charter

Arquivo:

```text
event-sourcing/EVENT_SOURCING_CHARTER.md
```

Conteúdo:

```markdown
# Event Sourcing Charter

## Aggregate

Appointment.

## Stream

appointment-{appointmentId}.

## Fonte de verdade

Eventos persistidos
na ordem do stream.

## Estado atual

Derivado por replay
ou snapshot + replay.

## Concorrência

Expected Stream Version.

## Eventos iniciais

- AppointmentScheduled;
- AppointmentConfirmed;
- AppointmentRescheduled;
- AppointmentCancelled.

## Fora de escopo

- broker;
- arquitetura distribuída;
- Event Store de produção;
- multi-region;
- consistência eventual aprofundada.
```

---

### 3. Criar decisão de adoção

Arquivo:

```text
event-sourcing/ADOPTION_DECISION.md
```

Perguntas obrigatórias:

```text
o histórico
possui valor de negócio?

é necessário reconstruir
estado passado?

auditoria exige fatos
e não apenas snapshots?

o domínio é naturalmente
orientado a eventos?

a equipe consegue operar
versionamento histórico?

replay e rebuild
são aceitáveis?

privacidade e retenção
foram avaliadas?

o custo supera
uma tabela de histórico?
```

Decisão do laboratório:

```text
ADOPT_FOR_LEARNING_ONLY.
```

Motivo:

```text
compreender o padrão.
```

---

### 4. Criar contrato principal

Arquivo:

```text
contracts/event-sourcing-contract.yaml
```

Conteúdo:

```yaml
eventSourcing:
  aggregate:
    Appointment

  required:
    - immutable-event-stream
    - append-only
    - ordered-stream-version
    - expected-stream-version
    - aggregate-replay
    - failed-decision-zero-events
    - snapshot-policy
    - historical-event-evolution
    - temporal-query
    - stream-integrity
    - privacy-retention
    - tests
    - architecture-rules

  forbidden:
    - update-historical-event
    - delete-historical-event-silently
    - replay-publishes-new-events
    - append-without-concurrency-check
    - unknown-event-ignored
    - broker-in-domain
    - Event-Driven-Architecture-deep-dive
    - Eventual-Consistency-deep-dive

  nextLesson:
    code:
      M19.23
```

---

### 5. Criar evento base

```java
public sealed interface AppointmentEvent
        permits AppointmentScheduled,
                AppointmentConfirmed,
                AppointmentRescheduled,
                AppointmentCancelled {

    EventId eventId();

    EventVersion eventVersion();

    AppointmentId appointmentId();

    Instant occurredAt();

    EventMetadata metadata();
}
```


---

### 6. Criar Metadata

```java
public record EventMetadata(
        String correlationId,
        String causationId,
        Optional<String> actorReference,
        Map<String, String> attributes) {

    public EventMetadata {
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(causationId);

        actorReference =
                actorReference == null
                        ? Optional.empty()
                        : actorReference;

        attributes =
                attributes == null
                        ? Map.of()
                        : Map.copyOf(attributes);
    }
}
```

Metadata não carrega token, segredo, payload HTTP, Entity ou dados pessoais desnecessários.

---

### 7. Criar Stored Event

```java
public record StoredEvent(
        String streamId,
        StreamVersion streamVersion,
        EventId eventId,
        EventType eventType,
        EventVersion eventVersion,
        Instant storedAt,
        AppointmentEvent event,
        StreamHash streamHash) {

    public StoredEvent {
        Objects.requireNonNull(streamId);
        Objects.requireNonNull(streamVersion);
        Objects.requireNonNull(eventId);
        Objects.requireNonNull(eventType);
        Objects.requireNonNull(eventVersion);
        Objects.requireNonNull(storedAt);
        Objects.requireNonNull(event);
        Objects.requireNonNull(streamHash);
    }
}
```

`occurredAt` pertence ao fato; `storedAt`, ao armazenamento.

---

### 8. Criar Stream Version

```java
public record StreamVersion(
        long value)
        implements Comparable<StreamVersion> {

    public StreamVersion {
        if (value < 0) {
            throw new IllegalArgumentException(
                    "Stream version cannot be negative");
        }
    }

    public StreamVersion next() {
        return new StreamVersion(
                value + 1);
    }

    @Override
    public int compareTo(
            StreamVersion other) {

        return Long.compare(
                value,
                other.value);
    }
}
```


---

### 9. Criar Expected Stream Version

```java
public sealed interface ExpectedStreamVersion {

    record NoStream()
            implements ExpectedStreamVersion {
    }

    record Exact(
            StreamVersion version)
            implements ExpectedStreamVersion {
    }

    record Any()
            implements ExpectedStreamVersion {
    }

    static ExpectedStreamVersion noStream() {
        return new NoStream();
    }

    static ExpectedStreamVersion exact(
            StreamVersion version) {
        return new Exact(version);
    }
}
```

`Any` será proibido para commands de domínio.

---

### 10. Criar Event Store

```java
public interface EventStore {

    Optional<EventStream> load(
            String streamId);

    AppendResult append(
            String streamId,
            ExpectedStreamVersion expectedVersion,
            List<AppointmentEvent> newEvents);

    boolean exists(
            String streamId);
}
```


---

### 11. Criar Event Stream

```java
public record EventStream(
        String streamId,
        StreamVersion currentVersion,
        List<StoredEvent> events) {

    public EventStream {
        Objects.requireNonNull(streamId);
        Objects.requireNonNull(currentVersion);

        events =
                List.copyOf(events);
    }

    public static EventStream empty(
            String streamId) {

        return new EventStream(
                streamId,
                new StreamVersion(0),
                List.of());
    }
}
```

---

### 12. Criar stream policy

Arquivo:

```text
contracts/event-stream-policy.yaml
```

Conteúdo:

```yaml
eventStream:
  identity:
    required

  order:
    stream-version:
      required

  immutable:
    required

  duplicateEventId:
    forbidden

  missingVersion:
    action:
      CORRUPTED_STREAM

  unknownEvent:
    action:
      FAIL

  emptyStream:
    allowedOnlyBeforeCreation:
      true
```

---

### 13. Criar Aggregate event-sourced

```java
public final class EventSourcedAppointment {

    private AppointmentId id;
    private AppointmentStatus status;
    private AppointmentWindow window;
    private CapacityReservationId reservationId;
    private StreamVersion loadedVersion;

    private final List<AppointmentEvent>
            uncommittedEvents =
            new ArrayList<>();

    private EventSourcedAppointment() {
    }

    public static EventSourcedAppointment replay(
            List<AppointmentEvent> history,
            StreamVersion loadedVersion) {

        EventSourcedAppointment appointment =
                new EventSourcedAppointment();

        for (AppointmentEvent event : history) {
            appointment.applyHistorical(event);
        }

        appointment.loadedVersion =
                loadedVersion;

        appointment.uncommittedEvents.clear();

        return appointment;
    }
}
```


---

### 14. Decidir e aplicar

Em Event Sourcing, `decide` valida e produz evento; `apply` muda o estado a partir dele.

Exemplo:

```java
public void confirm(
        Instant occurredAt,
        EventMetadata metadata) {

    if (status != AppointmentStatus.SCHEDULED) {
        throw new InvalidAppointmentTransition(
                status,
                AppointmentStatus.CONFIRMED);
    }

    AppointmentConfirmed event =
            new AppointmentConfirmed(
                    EventId.generate(),
                    new EventVersion(1),
                    id,
                    window,
                    occurredAt,
                    metadata);

    applyNew(event);
}
```

---

### 15. Criar `applyNew`

```java
private void applyNew(
        AppointmentEvent event) {

    applyHistorical(event);
    uncommittedEvents.add(event);
}
```

`applyHistorical` só atualiza estado; `applyNew` também registra evento pendente.

---

### 16. Criar apply histórico

```java
private void applyHistorical(
        AppointmentEvent event) {

    switch (event) {

        case AppointmentScheduled scheduled -> {
            id =
                    scheduled.appointmentId();

            status =
                    AppointmentStatus.SCHEDULED;

            window =
                    scheduled.window();

            reservationId =
                    scheduled.reservationId();
        }

        case AppointmentConfirmed ignored ->
                status =
                        AppointmentStatus.CONFIRMED;

        case AppointmentRescheduled rescheduled -> {
            window =
                    rescheduled.currentWindow();

            reservationId =
                    rescheduled.currentReservationId();
        }

        case AppointmentCancelled ignored ->
                status =
                        AppointmentStatus.CANCELLED;
    }
}
```

O apply é determinístico e sem dependências externas.

---

### 17. Criar eventos pendentes

```java
public List<AppointmentEvent>
uncommittedEvents() {

    return List.copyOf(
            uncommittedEvents);
}

public void markCommitted(
        StreamVersion newVersion) {

    loadedVersion =
            newVersion;

    uncommittedEvents.clear();
}
```


---

### 18. Criar Append Policy

Arquivo:

```text
event-sourcing/APPEND_POLICY.md
```

Regras:

```text
append somente no final;

event IDs únicos;

stream versions contínuas;

expected version obrigatória;

eventos históricos imutáveis;

append atômico por stream;

lista vazia não altera versão;

falha não marca committed;

append não publica no broker.
```

---

### 19. Criar append-policy.yaml

Arquivo:

```text
contracts/append-policy.yaml
```

Conteúdo:

```yaml
append:
  position:
    end-only

  atomicPerStream:
    required

  expectedVersion:
    required

  domainCommandUsingAnyVersion:
    forbidden

  duplicateEventId:
    action:
      REJECT

  emptyBatch:
    versionChange:
      false

  historicalMutation:
    forbidden

  publication:
    responsibility:
      false
```

---

### 20. Implementar InMemory Event Store

```java
public final class InMemoryEventStore
        implements EventStore {

    private final Map<String, List<StoredEvent>>
            streams =
            new ConcurrentHashMap<>();

    @Override
    public synchronized AppendResult append(
            String streamId,
            ExpectedStreamVersion expectedVersion,
            List<AppointmentEvent> newEvents) {

        List<StoredEvent> current =
                streams.getOrDefault(
                        streamId,
                        List.of());

        StreamVersion currentVersion =
                current.isEmpty()
                        ? new StreamVersion(0)
                        : current.getLast()
                                .streamVersion();

        validateExpectedVersion(
                streamId,
                expectedVersion,
                currentVersion,
                current.isEmpty());

        List<StoredEvent> appended =
                appendEvents(
                        streamId,
                        current,
                        currentVersion,
                        newEvents);

        streams.put(
                streamId,
                appended);

        StreamVersion newVersion =
                appended.isEmpty()
                        ? currentVersion
                        : appended.getLast()
                                .streamVersion();

        return new AppendResult(
                streamId,
                newVersion,
                newEvents.size());
    }
}
```


---

### 21. Concorrência

Fluxo:

```text
A carrega stream version 2;

B carrega stream version 2;

A produz AppointmentConfirmed;

B produz AppointmentCancelled;

A faz append expected 2;
stream vira 3;

B faz append expected 2;
Event Store rejeita.
```

B recarrega, redecide e tenta novo append.

---

### 22. Criar erro de versão

```java
public final class WrongExpectedStreamVersion
        extends RuntimeException {

    public WrongExpectedStreamVersion(
            String streamId,
            ExpectedStreamVersion expected,
            StreamVersion actual) {

        super(
                "Wrong expected version for stream "
                        + streamId
                        + ": expected "
                        + expected
                        + ", actual "
                        + actual);
    }
}
```


---

### 23. Criar Repository event-sourced

```java
public interface EventSourcedAppointmentRepository {

    Optional<EventSourcedAppointment> findById(
            AppointmentId appointmentId);

    void save(
            EventSourcedAppointment appointment);
}
```

Implementação:

```java
public final class DefaultEventSourcedAppointmentRepository
        implements EventSourcedAppointmentRepository {

    private final EventStore eventStore;

    @Override
    public Optional<EventSourcedAppointment> findById(
            AppointmentId appointmentId) {

        String streamId =
                streamId(appointmentId);

        return eventStore.load(streamId)
                .map(stream ->
                        EventSourcedAppointment.replay(
                                stream.events()
                                        .stream()
                                        .map(StoredEvent::event)
                                        .toList(),
                                stream.currentVersion()));
    }
}
```

---

### 24. Salvar eventos pendentes

```java
@Override
public void save(
        EventSourcedAppointment appointment) {

    List<AppointmentEvent> events =
            appointment.uncommittedEvents();

    if (events.isEmpty()) {
        return;
    }

    AppendResult result =
            eventStore.append(
                    streamId(appointment.id()),
                    ExpectedStreamVersion.exact(
                            appointment.loadedVersion()),
                    events);

    appointment.markCommitted(
            result.newVersion());
}
```


---

### 25. Criar replay policy

Arquivo:

```text
contracts/replay-policy.yaml
```

Conteúdo:

```yaml
replay:
  order:
    stream-version-ascending

  deterministic:
    required

  producesNewEvents:
    forbidden

  externalCalls:
    forbidden

  hiddenClock:
    forbidden

  unknownEvent:
    action:
      FAIL

  invalidSequence:
    action:
      CORRUPTED_STREAM

  loadedVersion:
    equalsLastStreamVersion:
      required
```

---

### 26. Validar sequência

Sequência válida:

```text
AppointmentScheduled;
AppointmentConfirmed;
AppointmentRescheduled;
AppointmentCancelled.
```

O replay falha em confirmação sem criação, criação duplicada, Aggregate ID divergente, versão repetida ou lacuna.

---

### 27. Criar integrity validator

```java
public final class EventStreamIntegrityValidator {

    public StreamIntegrityResult validate(
            EventStream stream) {

        List<String> findings =
                new ArrayList<>();

        validateContinuousVersions(
                stream,
                findings);

        validateUniqueEventIds(
                stream,
                findings);

        validateAggregateIdentity(
                stream,
                findings);

        validateSequence(
                stream,
                findings);

        validateHashes(
                stream,
                findings);

        return findings.isEmpty()
                ? StreamIntegrityResult.valid()
                : StreamIntegrityResult.invalid(
                        findings);
    }
}
```

---

### 28. Stream Hash

Uma hash chain didática combina hash anterior, stream, versão, evento e payload canônico para detectar alteração acidental.

---

### 29. Criar integrity policy

Arquivo:

```text
contracts/stream-integrity-policy.yaml
```

Conteúdo:

```yaml
streamIntegrity:
  continuousVersion:
    required

  uniqueEventId:
    required

  aggregateIdentity:
    consistent:
      required

  sequence:
    valid:
      required

  tamperEvidence:
    hashChain:
      recommended

  corruptedStream:
    action:
      QUARANTINE_AND_FAIL

  autoRepairWithoutAudit:
    forbidden
```

---

### 30. Snapshot

Snapshots reduzem o custo de streams longos ao iniciar o replay de uma versão intermediária, sem substituir a fonte de verdade.

---

### 31. Criar Appointment Snapshot

```java
public record AppointmentSnapshot(
        AppointmentId appointmentId,
        AppointmentStatus status,
        AppointmentWindow window,
        CapacityReservationId reservationId,
        StreamVersion streamVersion,
        Instant createdAt) {
}
```

O snapshot precisa indicar a versão representada.

---

### 32. Criar Snapshot Store

```java
public interface SnapshotStore {

    Optional<AppointmentSnapshot> loadLatest(
            AppointmentId appointmentId);

    void save(
            AppointmentSnapshot snapshot);

    void delete(
            AppointmentId appointmentId);
}
```


---

### 33. Criar Snapshot Policy

Arquivo:

```text
contracts/snapshot-policy.yaml
```

Conteúdo:

```yaml
snapshot:
  sourceOfTruth:
    false

  requires:
    - aggregate-id
    - stream-version
    - deterministic-state
    - compatibility-version

  creation:
    everyEvents:
      100

  invalidSnapshot:
    action:
      DISCARD_AND_FULL_REPLAY

  missingSnapshot:
    action:
      FULL_REPLAY

  historicalEvents:
    retained:
      required
```

---

### 34. Carregar com snapshot

Fluxo:

```text
carregar snapshot;

carregar eventos posteriores;

reconstruir a partir do snapshot;

aplicar eventos restantes;

validar versão.
```

Se falhar, descarte-o e faça replay completo.

---

### 35. Evolução de eventos


Exemplo inicial:

```text
AppointmentScheduledV1:
windowStart;
windowEnd;
reservationId.
```

Novo modelo:

```text
AppointmentScheduledV2:
window;
reservationId;
serviceAreaCode.
```


---

### 36. Estratégias de evolução

Opções:

```text
manter handlers para versões antigas;

upcast em leitura;

migrar eventos com trilha auditável;

usar evento corretivo;

introduzir nova semântica;

reconstruir stream em novo formato.
```


---

### 37. Criar Upcaster

```java
public interface EventUpcaster {

    boolean supports(
            EventType type,
            EventVersion version);

    StoredEvent upcast(
            StoredEvent historicalEvent);
}
```

Exemplo:

```java
public final class AppointmentScheduledV1ToV2Upcaster
        implements EventUpcaster {

    @Override
    public boolean supports(
            EventType type,
            EventVersion version) {

        return type.value()
                        .equals(
                                "appointment-scheduled")
                && version.value() == 1;
    }

    @Override
    public StoredEvent upcast(
            StoredEvent historicalEvent) {

        AppointmentScheduledV1 oldEvent =
                decodeV1(
                        historicalEvent);

        AppointmentScheduledV2 newEvent =
                new AppointmentScheduledV2(
                        oldEvent.eventId(),
                        oldEvent.appointmentId(),
                        AppointmentWindow.of(
                                oldEvent.windowStart(),
                                oldEvent.windowEnd()),
                        oldEvent.reservationId(),
                        ServiceAreaCode.unknown(),
                        oldEvent.occurredAt(),
                        oldEvent.metadata());

        return replacePayload(
                historicalEvent,
                new EventVersion(2),
                newEvent);
    }
}
```

Upcasting transforma a representação durante leitura sem alterar o registro original.

---

### 38. Criar upcasting policy

Arquivo:

```text
contracts/upcasting-policy.yaml
```

Conteúdo:

```yaml
upcasting:
  historicalRecordMutation:
    forbidden

  chainOrder:
    explicit:
      required

  deterministic:
    required

  missingRequiredInformation:
    action:
      FAIL_OR_USE_DOCUMENTED_DEFAULT

  defaultValue:
    requires:
      justification:
        true

  compatibilityTest:
    required

  observability:
    upcastCount:
      required
```

---

### 39. Valor padrão perigoso

No exemplo anterior:

```text
ServiceAreaCode.unknown()
```

pode esconder perda de informação.

Antes de usar default, verifique se o dado pode ser inferido, corrigido ou se altera a semântica.


---

### 40. Temporal Query

O stream permite reconstruir estado até uma versão ou instante, apoiando auditoria e incidentes.

---

### 41. Criar Temporal Query

```java
public final class TemporalAppointmentQuery {

    private final EventStore eventStore;

    public Optional<EventSourcedAppointment>
    stateAtVersion(
            AppointmentId appointmentId,
            StreamVersion version) {

        return eventStore.load(
                        streamId(appointmentId))
                .map(stream ->
                        stream.events()
                                .stream()
                                .filter(event ->
                                        event.streamVersion()
                                                .compareTo(version)
                                                <= 0)
                                .map(StoredEvent::event)
                                .toList())
                .map(events ->
                        EventSourcedAppointment.replay(
                                events,
                                version));
    }
}
```

---

### 42. Criar temporal policy

Arquivo:

```text
contracts/temporal-query-policy.yaml
```

Conteúdo:

```yaml
temporalQuery:
  source:
    event-stream

  supported:
    - stream-version
    - occurred-at

  timezone:
    UTC

  authorization:
    required

  personalData:
    filtered:
      required

  historicalResult:
    readOnly:
      required

  commandOnHistoricalState:
    forbidden
```

---

### 43. Auditoria versus Event Sourcing

Auditoria pode ser suficiente quando reconstrução do domínio e temporalidade não são necessárias.

---

### 44. Privacidade e retenção

Eventos imutáveis entram em tensão com exclusão, minimização, retenção, correção e anonimização.


---

### 45. Criar privacy policy

Arquivo:

```text
contracts/privacy-retention-policy.yaml
```

Conteúdo:

```yaml
privacy:
  personalData:
    minimize:
      required

  secret:
    forbidden

  rawToken:
    forbidden

  erasableData:
    strategy:
      required

  cryptoShredding:
    optional

  redactionEvent:
    documented:
      required

  retention:
    explicit:
      required

  legalHold:
    supportedByPolicy:
      required

  silentHistoricalRewrite:
    forbidden
```

---

### 46. Correção de fato

Eventos incorretos exigem correção auditável, evento corretivo ou migração controlada, nunca edição silenciosa.


---

### 47. Deleção lógica do Aggregate

`AppointmentDeleted` pode representar decisão do domínio sem remover fisicamente o histórico.

---

### 48. Operação de Event Store

Produção exige backup, restore, throughput, criptografia, corrupção, migração e tooling.

---

### 49. Criar Operational Model

Arquivo:

```text
event-sourcing/OPERATIONAL_MODEL.md
```

Registre:

- volume por stream;
- eventos por segundo;
- tamanho médio;
- stream mais quente;
- replay máximo;
- snapshot target;
- append latency;
- load latency;
- corruption handling;
- backup;
- restore;
- owner;
- SLO;
- runbook.

---

### 50. Hot Streams

Streams muito disputados aumentam conflitos; Event Sourcing não corrige boundary ruim.

---

### 51. Event Store versus Broker

Event Store persiste streams e reconstrói estado; broker distribui mensagens a consumidores.


---

### 52. Comparação com CQRS

CQRS separa command e query; Event Sourcing persiste estado como eventos. Eles podem ser usados juntos ou separadamente.


---

### 53. Adoção parcial

Event Sourcing pode ser aplicado somente a Aggregates com histórico, auditoria ou temporalidade realmente valiosos.


---

### 54. Criar Trade-offs

Em `event-sourcing/TRADE_OFFS.md`, compare histórico, auditoria e rebuild com evolução, privacidade, operação e recovery.


---

### 55. Falhas no append

Trate versão incorreta, duplicação, indisponibilidade e lote parcial.


---

### 56. Falhas no replay

Trate lacunas, ordem incorreta, incompatibilidade e identidade divergente.


---

### 57. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  wrongExpectedVersion:
    action:
      RELOAD_REDECIDE

  duplicateEventId:
    action:
      REJECT

  partialAppend:
    action:
      ROLLBACK

  unknownHistoricalEvent:
    action:
      QUARANTINE_AND_FAIL

  corruptedStream:
    action:
      QUARANTINE_AND_ALERT

  invalidSnapshot:
    action:
      DISCARD_AND_FULL_REPLAY

  upcasterFailure:
    action:
      FAIL_REPLAY

  EventDrivenArchitectureDeepDive:
    deferredToLesson633

  EventualConsistencyDeepDive:
    deferredToLesson634
```

---

### 58. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  mutableHistoricalEvent:
    action:
      FAIL

  gapInStreamVersion:
    action:
      FAIL

  duplicateEventId:
    action:
      FAIL

  replayProducesEvent:
    action:
      FAIL

  unknownEventIgnored:
    action:
      FAIL

  snapshotAsSourceOfTruth:
    action:
      FAIL

  eventWithSecret:
    action:
      FAIL

  adoptionWithoutDecision:
    action:
      FAIL
```

---

### 59. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson633:
    forbidden:
      - broker-topology
      - consumer-group
      - producer-configuration
      - dead-letter-queue
      - distributed-choreography
      - delivery-guarantee-deep-dive

  lesson634:
    forbidden:
      - consistency-window-analysis
      - causal-consistency-deep-dive
      - replica-conflict-resolution
      - convergence-proof

  allowed:
    - local-event-store
    - in-memory-stream
    - local-projection-reference
```

---

### 60. Testar criação do stream

Valide que `schedule` cria um stream com um único `AppointmentScheduled`, versão inicial correta e zero mutação histórica.

---

### 61. Testar replay

```java
@Test
void shouldReconstructAppointmentFromStream() {

    Fixtures.appendSchedulingConfirmationAndReschedule(
            eventStore);

    EventSourcedAppointment appointment =
            repository.findById(
                            Fixtures.appointmentId())
                    .orElseThrow();

    assertEquals(
            AppointmentStatus.CONFIRMED,
            appointment.status());

    assertEquals(
            Fixtures.rescheduledWindow(),
            appointment.window());

    assertTrue(
            appointment.uncommittedEvents()
                    .isEmpty());
}
```

---

### 62. Testar falha sem evento

```java
@Test
void failedDecisionMustNotAppendEvent() {

    EventSourcedAppointment appointment =
            Fixtures.cancelledAppointment();

    assertThrows(
            InvalidAppointmentTransition.class,
            () ->
                    appointment.confirm(
                            Fixtures.now(),
                            Fixtures.metadata()));

    assertTrue(
            appointment.uncommittedEvents()
                    .isEmpty());
}
```

---

### 63. Testar expected version

Simule dois writers.

Confirme:

- primeiro append aceito;
- segundo append rejeitado;
- stream sem evento duplicado;
- writer rejeitado recarrega;
- decisão é reexecutada.

---

### 64. Testar append only

Confirme que a API não oferece:

```text
updateEvent;

deleteEvent;

replaceStream;

changeVersion.
```

Tente alterar a coleção retornada.

Ela deve ser imutável.

---

### 65. Testar integridade

Cenários:

- gap de versão;
- event ID duplicado;
- hash alterado;
- Aggregate ID divergente;
- primeiro evento incorreto;
- versão repetida.

Todos devem gerar finding ou falha.

---

### 66. Testar snapshot

Confirme:

- snapshot na versão 100;
- replay a partir de 101;
- estado final igual ao replay completo;
- snapshot inválido descartado;
- stream continua fonte de verdade.

---

### 67. Testar Upcaster

Fixtures:

```text
AppointmentScheduled V1;

AppointmentScheduled V2.
```

Confirme:

- V1 é transformado durante load;
- registro histórico não muda;
- resultado é determinístico;
- default possui justificativa;
- cadeia executa em ordem.

---

### 68. Testar Temporal State

Reconstrua as versões de agendamento, confirmação, reagendamento e cancelamento e valide cada estado.

---

### 69. Testar arquitetura

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
                        "org.springframework.amqp..");
```

---

### 70. Validar modelo de stream

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-event-stream-model.ps1
```

Confirme:

- stream ID;
- version;
- order;
- event ID;
- immutability;
- identity;
- primeiro evento.

---

### 71. Validar append

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-append-policy.ps1
```

Confirme:

- end-only;
- expected version;
- atomicidade;
- duplicação;
- lista vazia;
- zero alteração histórica.

---

### 72. Validar replay

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-replay-policy.ps1
```

Confirme:

- ordem;
- determinismo;
- zero evento novo;
- zero chamada externa;
- falha em evento desconhecido;
- versão final.

---

### 73. Validar snapshots

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-snapshots.ps1
```

Confirme:

- versão;
- compatibilidade;
- fallback;
- replay restante;
- não source of truth.

---

### 74. Validar evolução

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-event-evolution.ps1
```

Confirme:

- versões históricas;
- breaking changes;
- migration plan;
- compatibility tests;
- zero alteração silenciosa.

---

### 75. Validar upcasters

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-upcasters.ps1
```

Confirme:

- chain order;
- determinismo;
- default justificado;
- erro explícito;
- observabilidade.

---

### 76. Validar temporal queries

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-temporal-queries.ps1
```

Confirme:

- versão;
- instante;
- autorização;
- read-only;
- UTC;
- zero command histórico.

---

### 77. Validar integridade

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-stream-integrity.ps1
```

Confirme:

- versões contínuas;
- IDs únicos;
- identidade;
- hash;
- sequence;
- quarantine.

---

### 78. Validar privacidade

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\validate-privacy-retention.ps1
```

Confirme:

- minimização;
- retenção;
- legal hold;
- redaction;
- dados apagáveis;
- zero segredo;
- nenhuma reescrita silenciosa.

---

### 79. Executar testes

Execute:

```powershell
.\scripts\m19\service-appointment-event-stream\run-event-sourcing-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- decisions;
- replay;
- append;
- concorrência;
- integridade;
- snapshots;
- upcasters;
- temporal state;
- arquitetura.

---

### 80. Criar reports

Exemplo:

```yaml
eventSourcing:
  aggregate:
    Appointment

  streams:
    25

  historicalEvents:
    180

  versionGaps:
    0

  duplicateEventIds:
    0

  replayFailures:
    0

  snapshots:
    4

  upcastedEvents:
    12

  corruptedStreams:
    0

  result:
    PASS
```

---

### 81. Criar gate

O gate valida:

```text
charter;

adoption decision;

stream model;

event contracts;

append only;

expected version;

replay;

Aggregate reconstruction;

snapshots;

event evolution;

upcasters;

temporal queries;

privacy;

retention;

integrity;

failure recovery;

operation;

tests;

architecture;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_ADOPTION_DECISION;

FAIL_STREAM_MODEL;

FAIL_APPEND;

FAIL_EXPECTED_VERSION;

FAIL_REPLAY;

FAIL_SNAPSHOT;

FAIL_EVENT_EVOLUTION;

FAIL_UPCASTER;

FAIL_TEMPORAL_QUERY;

FAIL_PRIVACY;

FAIL_INTEGRITY;

FAIL_OPERATIONAL_MODEL;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 82. Coletar evidence

Arquivo:

```text
contracts/event-sourcing-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- Aggregate;
- stream count;
- event count;
- append status;
- expected version status;
- replay status;
- snapshot status;
- upcaster status;
- temporal query status;
- integrity status;
- privacy status;
- retention status;
- corruption count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- payload real;
- segredo;
- Event Store de produção;
- connection strings;
- broker;
- topologia;
- arquitetura orientada a eventos aprofundada;
- consistência eventual aprofundada.

---

### 83. Executar validação completa

```powershell
.\scripts\m19\service-appointment-event-stream\validate-event-sourcing-contract.ps1

.\scripts\m19\service-appointment-event-stream\validate-event-stream-model.ps1

.\scripts\m19\service-appointment-event-stream\validate-append-policy.ps1

.\scripts\m19\service-appointment-event-stream\validate-replay-policy.ps1

.\scripts\m19\service-appointment-event-stream\validate-snapshots.ps1

.\scripts\m19\service-appointment-event-stream\validate-event-evolution.ps1

.\scripts\m19\service-appointment-event-stream\validate-upcasters.ps1

.\scripts\m19\service-appointment-event-stream\validate-temporal-queries.ps1

.\scripts\m19\service-appointment-event-stream\validate-stream-integrity.ps1

.\scripts\m19\service-appointment-event-stream\validate-privacy-retention.ps1

.\scripts\m19\service-appointment-event-stream\run-event-sourcing-tests.ps1

.\scripts\m19\service-appointment-event-stream\collect-event-sourcing-evidence.ps1

.\scripts\m19\service-appointment-event-stream\verify-event-sourcing-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 84. Encerrar o laboratório

Confirme:

- decisão de adoção explícita;
- Event Stream por Appointment;
- eventos imutáveis;
- stream versions contínuas;
- expected version obrigatória;
- append atômico;
- zero alteração histórica;
- replay determinístico;
- replay sem eventos novos;
- Aggregate reconstruído;
- falha de decisão sem append;
- concorrência rejeitada;
- snapshot não é fonte de verdade;
- fallback para replay completo;
- evolução histórica documentada;
- upcasters determinísticos;
- temporal query read-only;
- integridade validada;
- privacidade e retenção documentadas;
- operação e recovery registrados;
- Event Store apenas didático;
- broker não utilizado;
- arquitetura orientada a eventos não aprofundada;
- consistência eventual não aprofundada;
- reports sanitizados.

---

## Entendendo o que foi feito

### O estado ganhou história

Appointment passou a ser reconstruído por fatos ordenados.

### A persistência ganhou stream e concorrência

Append-only, Stream Version e Expected Stream Version protegeram a história.

### O domínio ganhou decide, apply e replay

Decisões produzem eventos; replay reconstrói sem efeitos.

### Snapshots, evolução e integridade ganharam políticas

Snapshots aceleram, upcasters preservam compatibilidade e validações detectam corrupção.

### A adoção ganhou critério

Event Sourcing deixou de ser tratado como padrão obrigatório.

---

## Erros comuns importantes

### Confundir Event Sourcing com log

Logs não reconstroem necessariamente o domínio.

### Append sem expected version

Lost updates continuam possíveis.

### Replay com efeitos

Carregamento produz duplicação.

### Snapshot como verdade

Corrupção do snapshot quebra o sistema.

### Ignorar evolução histórica

Deploys futuros deixam de reconstruir streams.

### Inventar dados ou armazenar excesso pessoal

O passado perde semântica e aumenta risco de compliance.

### Adotar sem valor temporal

A complexidade supera o benefício.

---

## Comandos úteis

### Validar stream

```powershell
.\scripts\m19\service-appointment-event-stream\validate-event-stream-model.ps1
```

### Validar append

```powershell
.\scripts\m19\service-appointment-event-stream\validate-append-policy.ps1
```

### Validar replay

```powershell
.\scripts\m19\service-appointment-event-stream\validate-replay-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-appointment-event-stream\run-event-sourcing-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-appointment-event-stream\verify-event-sourcing-gate.ps1
```

---

## Exercício guiado

Justifique a adoção, modele stream e Aggregate, implemente append e replay, adicione snapshot, evolução, temporal query e integridade, e finalize validando o gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 631 e ponte para a aula 633 foram preservadas;
- o laboratório `service-appointment-event-stream` foi criado;
- Event Sourcing Charter foi criado;
- decisão de adoção foi documentada;
- O padrão não foi tratado como padrão automático;
- Event Stream foi modelado;
- Stream ID foi definido;
- Stream Version foi criada;
- Expected Stream Version foi criada;
- `Any` foi proibido para commands de domínio;
- eventos históricos são imutáveis;
- append ocorre somente no final;
- append é atômico por stream;
- duplicate Event ID é rejeitado;
- lista vazia não altera versão;
- `EventSourcedAppointment` foi implementado;
- decide e apply foram separados;
- apply histórico é determinístico;
- replay não registra novos eventos;
- replay não chama dependências;
- failed decision não produz evento;
- Repository carrega por replay;
- Repository salva eventos pendentes;
- concorrência usa expected stream version;
- writer stale é rejeitado;
- retry exige reload e nova decisão;
- sequência inválida falha;
- integridade valida versões contínuas;
- integridade valida Aggregate ID;
- hash chain foi documentado;
- snapshot possui stream version;
- snapshot não é fonte de verdade;
- snapshot inválido faz fallback;
- evolução histórica foi documentada;
- upcaster não altera o registro original;
- upcaster é determinístico;
- defaults exigem justificativa;
- temporal query por versão foi criada;
- temporal state é read-only;
- privacidade e retenção foram documentadas;
- segredo e token foram proibidos;
- Event Store e broker foram diferenciados;
- Event Sourcing e CQRS foram diferenciados;
- operação, backup e recovery foram registrados;
- broker não foi implementado;
- arquitetura orientada a eventos não foi aprofundada;
- consistência eventual não foi aprofundada;
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
  labs/m19/aula-632-event-sourcing-conceitual/service-appointment-event-stream `
  scripts/m19/service-appointment-event-stream `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|rawPersonalData|productionEventStore|connectionString|KafkaTemplate|RabbitTemplate|consumerGroup|eventDrivenArchitectureDeepDive|eventualConsistencyDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): modelar Event Sourcing conceitual"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- connection strings;
- Event Store real;
- broker;
- payloads de produção;
- arquitetura orientada a eventos aprofundada;
- consistência eventual aprofundada.

---

## Fechamento e ponte para a próxima aula


Você criou charter, decisão de adoção, streams, Event Store, versões, append, replay, snapshots, upcasters, temporal queries, integridade e testes.

Você comprovou que eventos imutáveis são a fonte de verdade; que o estado é derivado do stream; que expected version protege concorrência; que decide e apply possuem papéis distintos; que replay precisa ser determinístico; que snapshot é otimização; que eventos históricos precisam continuar compreensíveis; que upcasters não devem inventar fatos; que temporal queries possuem valor; e que privacidade, retenção e operação são parte do custo.

A próxima aula:

```text
633 - M19.23 - Arquitetura orientada a eventos
```

Nela, você irá aprofundar como produtores, consumidores, brokers, contratos, delivery, ordering, retries, idempotência e observabilidade formam uma arquitetura distribuída orientada a eventos.

Arquitetura orientada a eventos e consistência eventual não foram aprofundadas.

---

# Material complementar

## Checkpoint final

- [ ] Documentei a decisão de adoção.
- [ ] Modelei Event Stream e versões.
- [ ] Implementei expected version.
- [ ] Separei decide e apply.
- [ ] Reconstruí Aggregate por replay.
- [ ] Mantive snapshot como otimização.
- [ ] Modelei upcasting.
- [ ] Validei integridade e privacidade.

---

## Troubleshooting adicional

### O replay publica eventos

Separe `applyHistorical` de `applyNew`.

### O segundo writer sobrescreve o primeiro

Exija Expected Stream Version no append.

### O snapshot é obrigatório para carregar

Permita fallback para replay completo.

### Um evento antigo não desserializa

Crie upcaster ou suporte explícito à versão antiga.

### O upcaster precisa inventar dado

Reavalie default, fonte auxiliar ou evento corretivo.

### O stream possui lacuna

Quarantenize e investigue; não ignore.

### A temporal query executa command

Estado histórico deve permanecer read-only.

### O payload contém dados pessoais

Minimize, referencie ou aplique estratégia de retenção.

### A equipe quer adotar em todos os Aggregates

Faça decisão por necessidade e custo.

### O laboratório começou a configurar Kafka

Preserve arquitetura orientada a eventos para a aula 633.

---

## Perguntas de revisão

1. O que é Event Sourcing?
2. O que é Event Stream?
3. O que é Stream Version?
4. O que é Expected Stream Version?
5. O que é append?
6. O que é replay?
7. Qual diferença entre decide e apply?
8. Replay pode publicar eventos?
9. O que acontece em stale writer?
10. O que é snapshot?
11. Snapshot é fonte de verdade?
12. O que é upcaster?
13. Upcaster altera o evento armazenado?
14. O que é temporal query?
15. Event Sourcing é igual a auditoria?
16. Event Sourcing exige CQRS?
17. Event Store é igual a broker?
18. Qual risco de dados pessoais?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Persistência do estado como sequência de fatos.
2. Sequência ordenada de eventos de uma identidade.
3. Posição lógica atual do stream.
4. Versão esperada antes do append.
5. Inclusão de novos eventos no final.
6. Reaplicação dos eventos para reconstruir estado.
7. Decide valida e produz evento; apply atualiza estado.
8. Não.
9. O append é rejeitado e a decisão deve ser refeita.
10. Estado intermediário otimizado.
11. Não.
12. Transformação de evento histórico para forma atual.
13. Não.
14. Reconstrução do estado em versão ou instante passado.
15. Não.
16. Não.
17. Não.
18. Imutabilidade dificulta exclusão e correção.
19. Arquitetura orientada a eventos.
20. Arquitetura orientada a eventos.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 632 - M19.22 - Event Sourcing conceitual

- Aprofundei Event Sourcing conceitual.
- Criei o laboratório `service-appointment-event-stream`.
- Criei Event Sourcing Charter e decisão de adoção.
- Diferenciei estado atual de sequência de fatos.
- Modelei Event Stream e Stream ID.
- Criei Stream Version e Expected Stream Version.
- Proibi append cego em commands de domínio.
- Modelei Event Store em memória.
- Implementei append-only atômico por stream.
- Separei decide, apply histórico e apply novo.
- Reconstruí `EventSourcedAppointment` por replay.
- Garanti que replay não cria novos eventos.
- Garanti que failed decisions não produzem append.
- Modelei concorrência com expected stream version.
- Criei validação de sequência e integridade.
- Documentei hash chain.
- Modelei snapshots como otimização descartável.
- Criei fallback para replay completo.
- Aprofundei evolução de eventos históricos.
- Criei cadeia de upcasters determinísticos.
- Evitei alteração silenciosa de eventos antigos.
- Criei temporal query por versão.
- Diferenciei Event Store de broker.
- Diferenciei Event Sourcing de CQRS.
- Documentei privacidade, retenção e operação.
- Criei testes de replay, append, concorrência, snapshot, upcasting e integridade.
- Criei reports, gate e evidence.
- Não antecipei arquitetura orientada a eventos ou consistência eventual.
- Próxima aula: Arquitetura orientada a eventos.
```

---

## Referência técnica curta

- Event Sourcing.
- Event Stream.
- Event Store.
- Stream Version.
- Expected Stream Version.
- Append.
- Replay.
- Snapshot.
- Upcaster.
- Temporal Query.

Regra final:

```text
Event Sourcing deve ser adotado quando o valor do histórico completo, da reconstrução temporal e da auditabilidade supera o custo operacional: cada Appointment possui um Event Stream identificado, ordenado por Stream Version e composto por eventos imutáveis anexados somente no final, enquanto Expected Stream Version protege concorrência e qualquer stale writer precisa recarregar, reexecutar a decisão e tentar novo append; a Aggregate Root separa decide de apply, eventos novos atualizam estado e entram em uncommitted events, eventos históricos apenas reconstruem estado e replay nunca publica, consulta dependências ou produz fatos; Event Store é fonte de verdade, snapshots são otimizações descartáveis com versão e fallback para replay completo, eventos históricos não são alterados silenciosamente e sua evolução usa suporte de versões, upcasters determinísticos ou migrações auditáveis sem inventar dados; temporal queries são read-only, integridade verifica versões contínuas, IDs, identidade, sequência e hashes, e privacidade, retenção, backup, recovery, corrupção e tooling fazem parte da decisão; o gate termina com adoção, stream, append, expected version, replay, snapshots, evolução, upcasting, temporal queries, integridade, privacidade, operação, testes, arquitetura, documentação e evidence aprovados, enquanto arquitetura orientada a eventos é aprofundada somente na aula 633 e consistência eventual permanece reservada à aula 634.
```
