# 625 - M19.15 - Aggregate Aggregate Root

## Apresentação da aula

Na aula 624, você revisitou profundamente Entity e Value Object.

Você refinou conceitos como:

```text
identidade;

igualdade;

ciclo de vida;

imutabilidade;

normalização;

defensive copy;

primitive obsession;

rehydration;

snapshot;

mapeamento de persistência.
```

O modelo passou a distinguir Entity, Value Object e referências tipadas.

Agora surge uma pergunta maior:

```text
quais objetos precisam mudar juntos

para que as regras
permaneçam verdadeiras?
```

Uma Entity isolada pode possuir comportamento correto.

Mesmo assim, o sistema pode permitir inconsistências se outros objetos relacionados forem alterados fora de uma fronteira controlada.

Considere um compromisso de atendimento.

Uma operação de reagendamento precisa alterar, de forma coerente:

- a janela atual;
- o estado de confirmação;
- a referência da reserva de capacidade;
- o histórico;
- a revisão do compromisso;
- os eventos produzidos.

Se cada informação mudar separadamente, janela, reserva, status, histórico e eventos podem divergir.

DDD usa o conceito de:

```text
Aggregate
```

para definir uma unidade de consistência.

Dentro dessa unidade existe uma Entity especial:

```text
Aggregate Root.
```

A root é a única porta de entrada para mudanças e protege invariantes, children, ciclo de vida, consistência, eventos, referências e concorrência.

A pergunta será:

```text
como escolher
uma fronteira de Aggregate

que seja pequena o suficiente
para escalar

e forte o suficiente
para proteger
as regras do domínio?
```

Laboratório:

```text
labs/m19/aula-625-aggregate-aggregate-root/service-appointment-aggregate
```

Aggregate:

```text
Appointment.
```

Root:

```text
Appointment.
```

O Aggregate conterá:

- identidade;
- referência da solicitação;
- janela atual;
- status;
- referência da reserva de capacidade;
- histórico de mudanças;
- revisão interna;
- eventos pendentes.

Elementos externos permanecerão fora:

- `ServiceRequest`;
- `CapacityReservation`;
- `Customer`;
- `Technician`;
- `FieldActivity`;
- `Notification`.

O Aggregate guardará apenas `ServiceRequestId` e `CapacityReservationId`.

Você irá praticar escolha da root, invariantes, consistência forte e eventual, referências por identidade, children protegidos, eventos, tamanho, revisão, concorrência e testes de fronteira.

A próxima aula oficial será `626 - M19.16 - Repository em DDD`.

Esta aula não aprofundará contrato de Repository, queries, JPA, Unit of Work, Identity Map, paginação ou caching de Aggregates.

Será criado apenas um contrato mínimo de armazenamento em testes quando necessário para demonstrar o fluxo, sem transformar o tema em Repository.

A aula 627 será `Domain Service`; nesta aula, regras pertencentes ao Aggregate permanecem na root.

A regra central será:

```text
um Aggregate
é uma fronteira
de consistência;

a Aggregate Root
é a única autoridade
para mudar
o que existe
dentro dessa fronteira.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
623:
Anti Corruption Layer.

624:
Entity Value Object revisitados.

625:
Aggregate Aggregate Root.

626:
Repository em DDD.

627:
Domain Service.
```

A progressão é:

```text
proteger integração externa;

refinar identidade e valor;

definir consistência;

persistir Aggregates;

modelar regras sem owner natural.
```

Nesta aula:

```text
Aggregate:
sim.

Aggregate Root:
sim.

invariantes:
sim.

consistência transacional:
sim.

consistência eventual:
sim.

referências por ID:
sim.

children internos:
sim.

eventos do Aggregate:
sim.

versionamento:
sim.

concorrência conceitual:
sim.

Repository aprofundado:
não.

Domain Service aprofundado:
não.

JPA:
não.

mensageria:
não.
```

O domínio usa Java puro.

---

## Objetivo prático

Será criada a seguinte estrutura:

```text
labs/m19/aula-625-aggregate-aggregate-root/service-appointment-aggregate
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/appointmentaggregate
│   │           ├── domain
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── ServiceRequestId.java
│   │           │   ├── CapacityReservationId.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── AppointmentStatus.java
│   │           │   ├── RescheduleReason.java
│   │           │   ├── CancellationReason.java
│   │           │   ├── AppointmentChange.java
│   │           │   ├── AppointmentChangeType.java
│   │           │   ├── AppointmentRevision.java
│   │           │   ├── AppointmentSnapshot.java
│   │           │   └── exception
│   │           │       ├── AggregateInvariantViolation.java
│   │           │       ├── InvalidAppointmentTransition.java
│   │           │       └── StaleAppointmentRevision.java
│   │           ├── event
│   │           │   ├── AppointmentDomainEvent.java
│   │           │   ├── AppointmentScheduled.java
│   │           │   ├── AppointmentConfirmed.java
│   │           │   ├── AppointmentRescheduled.java
│   │           │   └── AppointmentCancelled.java
│   │           ├── application
│   │           │   ├── AppointmentCommandHandler.java
│   │           │   ├── command
│   │           │   │   ├── ScheduleAppointment.java
│   │           │   │   ├── ConfirmAppointment.java
│   │           │   │   ├── RescheduleAppointment.java
│   │           │   │   └── CancelAppointment.java
│   │           │   └── result
│   │           │       └── AppointmentResult.java
│   │           └── support
│   │               ├── AppointmentIdGenerator.java
│   │               ├── AppointmentClock.java
│   │               └── CapturingAppointmentEventPublisher.java
│   └── test
│       └── java
│           └── br/com/formacao/appointmentaggregate
│               ├── domain
│               │   ├── AppointmentCreationTest.java
│               │   ├── AppointmentConfirmationTest.java
│               │   ├── AppointmentReschedulingTest.java
│               │   ├── AppointmentCancellationTest.java
│               │   ├── AppointmentInvariantTest.java
│               │   ├── AppointmentRevisionTest.java
│               │   ├── AppointmentHistoryTest.java
│               │   └── AppointmentSnapshotTest.java
│               ├── application
│               │   └── AppointmentCommandHandlerTest.java
│               └── architecture
│                   ├── AggregateBoundaryTest.java
│                   ├── AggregateRootAuthorityTest.java
│                   ├── ExternalReferenceTest.java
│                   └── DomainFrameworkIndependenceTest.java
├── aggregate
│   ├── AGGREGATE_CHARTER.md
│   ├── ROOT_DECISION.md
│   ├── INVARIANT_CATALOG.md
│   ├── CONSISTENCY_DECISIONS.md
│   ├── AGGREGATE_BOUNDARY.md
│   ├── EXTERNAL_REFERENCES.md
│   ├── TRANSACTION_BOUNDARY.md
│   ├── CONCURRENCY_POLICY.md
│   ├── EVENT_POLICY.md
│   ├── SIZE_AND_PERFORMANCE.md
│   ├── REHYDRATION_POLICY.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_AGGREGATE_QUESTIONS.md
├── contracts
│   ├── aggregate-root-contract.yaml
│   ├── aggregate-boundary-policy.yaml
│   ├── aggregate-root-policy.yaml
│   ├── invariant-policy.yaml
│   ├── consistency-policy.yaml
│   ├── external-reference-policy.yaml
│   ├── child-access-policy.yaml
│   ├── concurrency-policy.yaml
│   ├── aggregate-event-policy.yaml
│   ├── rehydration-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
└── reports
    ├── aggregate-boundary-report.yaml
    ├── root-authority-report.yaml
    ├── invariant-report.yaml
    ├── consistency-report.yaml
    ├── external-reference-report.yaml
    ├── concurrency-report.yaml
    ├── event-report.yaml
    └── aggregate-root-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-appointment-aggregate
├── validate-aggregate-root-contract.ps1
├── validate-aggregate-boundary.ps1
├── validate-root-authority.ps1
├── validate-aggregate-invariants.ps1
├── validate-consistency-decisions.ps1
├── validate-external-references.ps1
├── validate-child-access.ps1
├── validate-concurrency-policy.ps1
├── validate-aggregate-events.ps1
├── run-aggregate-root-tests.ps1
├── collect-aggregate-root-evidence.ps1
└── verify-aggregate-root-gate.ps1
```

Ao final, você terá um Aggregate pequeno, protegido e testável.

---

## Conceito essencial

### Aggregate

Conjunto de objetos do domínio tratado como uma unidade de consistência.

---

### Aggregate Root

Entity que representa o Aggregate e controla todo acesso de alteração.

---

### Aggregate Boundary

Limite que define quais objetos participam da mesma consistência forte.

---

### Invariant

Regra que precisa permanecer verdadeira antes e depois de uma operação válida.

---

### Strong Consistency

Garantia de que mudanças relacionadas são observadas juntas dentro da mesma decisão.

---

### Eventual Consistency

Garantia de convergência posterior entre decisões que não precisam ocorrer na mesma transação.

---

### Internal Child

Entity ou Value Object que pertence ao Aggregate e não deve ser alterado diretamente por consumidores.

---

### External Reference

Referência por identidade a um conceito pertencente a outro Aggregate ou contexto.

---

### Transaction Boundary

Limite em que uma mudança precisa ser atômica.

---

### Aggregate Revision

Número monotônico que representa a versão observada do estado.

---

### Optimistic Concurrency

Estratégia que detecta se o Aggregate foi alterado desde a leitura.

---

### Aggregate Event

Fato produzido por uma mudança válida realizada pela root.

---

### Rehydration

Reconstrução do Aggregate a partir de estado persistido sem repetir fatos de criação.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-625-aggregate-aggregate-root/service-appointment-aggregate

Set-Location `
  labs/m19/aula-625-aggregate-aggregate-root/service-appointment-aggregate
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/aggregate-root-contract.yaml
```

Conteúdo:

```yaml
aggregate:
  name:
    Appointment

  root:
    Appointment

  required:
    - root-authority
    - explicit-boundary
    - invariant-catalog
    - local-transaction-boundary
    - internal-child-protection
    - external-reference-by-identity
    - aggregate-events
    - revision
    - rehydration
    - tests
    - architecture-rules

  forbidden:
    - direct-child-mutation
    - cross-aggregate-object-reference
    - public-mutable-collection
    - invariant-outside-root
    - aggregate-with-unbounded-history
    - framework-dependency
    - repository-deep-dive
    - domain-service-deep-dive

  nextLesson:
    code:
      M19.16
```

---

### 3. Criar Aggregate Charter

Arquivo:

```text
aggregate/AGGREGATE_CHARTER.md
```

Conteúdo:

```markdown
# Appointment Aggregate Charter

## Propósito

Manter um compromisso de atendimento
válido e consistente.

## Root

Appointment.

## Consistência forte

- janela atual;
- estado;
- reserva vinculada;
- histórico recente;
- revisão;
- eventos pendentes.

## Referências externas

- ServiceRequestId;
- CapacityReservationId.

## Fora do Aggregate

- ServiceRequest;
- CapacityReservation;
- Customer;
- Technician;
- FieldActivity;
- Notification.

## Estado terminal

CANCELLED.
```

---

### 4. Escolher a root

A root precisa possuir identidade, representar o Aggregate, controlar mudanças, proteger invariantes, emitir eventos e impedir alteração direta de children. `Appointment` atende a esses critérios.

Não crie:

```text
AppointmentAggregateManager.
```

A própria Entity é a root.

---

### 5. Criar root policy

Arquivo:

```text
contracts/aggregate-root-policy.yaml
```

Conteúdo:

```yaml
aggregateRoot:
  type:
    Appointment

  required:
    - identity
    - behavior
    - invariant-protection
    - child-control
    - event-recording
    - revision-control

  onlyPublicMutationEntry:
    required

  forbidden:
    - public-setter
    - public-child-mutation
    - framework-annotation
    - generic-update-method
```

---

### 6. Criar identidades

```java
public record AppointmentId(
        UUID value) {

    public AppointmentId {
        Objects.requireNonNull(value);
    }
}
```

```java
public record ServiceRequestId(
        UUID value) {

    public ServiceRequestId {
        Objects.requireNonNull(value);
    }
}
```

```java
public record CapacityReservationId(
        UUID value) {

    public CapacityReservationId {
        Objects.requireNonNull(value);
    }
}
```

A root referencia outros conceitos apenas por identidade.

---

### 7. Criar revisão

```java
public record AppointmentRevision(
        long value) {

    public AppointmentRevision {

        if (value < 0) {
            throw new AggregateInvariantViolation(
                    "Revision cannot be negative");
        }
    }

    public AppointmentRevision next() {

        return new AppointmentRevision(
                Math.addExact(value, 1));
    }
}
```

A revisão pertence ao Aggregate; a persistência otimista será aprofundada na aula 626.

---

### 8. Criar histórico interno

```java
public record AppointmentChange(
        AppointmentChangeType type,
        AppointmentWindow previousWindow,
        AppointmentWindow currentWindow,
        String reason,
        Instant occurredAt,
        AppointmentRevision revision) {

    public AppointmentChange {
        Objects.requireNonNull(type);
        Objects.requireNonNull(currentWindow);
        Objects.requireNonNull(occurredAt);
        Objects.requireNonNull(revision);
    }
}
```

O histórico usa Value Objects internos, sem Repository próprio.

---

### 9. Criar boundary policy

Arquivo:

```text
contracts/aggregate-boundary-policy.yaml
```

Conteúdo:

```yaml
aggregateBoundary:
  inside:
    - appointment-identity
    - service-request-reference
    - current-window
    - status
    - capacity-reservation-reference
    - bounded-change-history
    - revision
    - pending-events

  outside:
    - service-request-entity
    - capacity-reservation-entity
    - customer
    - technician
    - field-activity
    - notification

  inclusionRequires:
    - same-invariant
    - same-transaction
    - same-lifecycle-control

  convenienceOnly:
    forbidden
```

---

### 10. Definir catálogo de invariantes

Arquivo:

```text
aggregate/INVARIANT_CATALOG.md
```

Invariantes:

```text
INV-001:
Appointment possui identidade.

INV-002:
Appointment pertence a uma ServiceRequest.

INV-003:
Appointment possui janela válida.

INV-004:
Appointment SCHEDULED possui reserva de capacidade.

INV-005:
somente SCHEDULED pode ser confirmado.

INV-006:
Appointment CANCELLED é terminal.

INV-007:
reagendamento exige nova janela.

INV-008:
reagendamento exige nova reserva.

INV-009:
a nova janela deve diferir da atual.

INV-010:
histórico registra toda substituição de janela.

INV-011:
cada mudança incrementa a revisão.

INV-012:
cada mudança relevante registra evento.

INV-013:
eventos não são publicados pela root.

INV-014:
histórico possui limite operacional.
```

---

### 11. Criar invariant policy

Arquivo:

```text
contracts/invariant-policy.yaml
```

Conteúdo:

```yaml
invariant:
  requires:
    - identifier
    - statement
    - owner
    - protected-by
    - test

  protectedInsideRoot:
    required

  duplicatedInApplicationService:
    forbidden

  bypassMethod:
    forbidden

  rehydration:
    mustValidate:
      true
```

---

### 12. Criar status

```java
public enum AppointmentStatus {
    SCHEDULED,
    CONFIRMED,
    CANCELLED
}
```

Execution continua fora do Aggregate de Scheduling.

Esse limite foi decidido nas aulas estratégicas.

---

### 13. Criar root

```java
public final class Appointment {

    private static final int MAX_HISTORY =
            50;

    private final AppointmentId id;
    private final ServiceRequestId serviceRequestId;
    private final Instant createdAt;

    private AppointmentWindow window;
    private CapacityReservationId reservationId;
    private AppointmentStatus status;
    private AppointmentRevision revision;

    private final List<AppointmentChange> history;
    private final List<AppointmentDomainEvent> events;

    private Appointment(
            AppointmentId id,
            ServiceRequestId serviceRequestId,
            AppointmentWindow window,
            CapacityReservationId reservationId,
            Instant createdAt,
            AppointmentStatus status,
            AppointmentRevision revision,
            List<AppointmentChange> history) {

        this.id =
                Objects.requireNonNull(id);

        this.serviceRequestId =
                Objects.requireNonNull(
                        serviceRequestId);

        this.window =
                Objects.requireNonNull(window);

        this.reservationId =
                Objects.requireNonNull(
                        reservationId);

        this.createdAt =
                Objects.requireNonNull(createdAt);

        this.status =
                Objects.requireNonNull(status);

        this.revision =
                Objects.requireNonNull(revision);

        this.history =
                new ArrayList<>(
                        List.copyOf(history));

        this.events =
                new ArrayList<>();

        validateCurrentState();
    }
}
```


---

### 14. Criar operação de criação

```java
public static Appointment schedule(
        AppointmentId id,
        ServiceRequestId serviceRequestId,
        AppointmentWindow window,
        CapacityReservationId reservationId,
        Instant occurredAt) {

    Appointment appointment =
            new Appointment(
                    id,
                    serviceRequestId,
                    window,
                    reservationId,
                    occurredAt,
                    AppointmentStatus.SCHEDULED,
                    new AppointmentRevision(0),
                    List.of());

    appointment.record(
            new AppointmentScheduled(
                    id,
                    serviceRequestId,
                    window,
                    reservationId,
                    occurredAt,
                    appointment.revision));

    return appointment;
}
```

O Appointment nasce válido, sem estado parcial.

---

### 15. Criar validação central

```java
private void validateCurrentState() {

    if (status == AppointmentStatus.SCHEDULED
            && reservationId == null) {
        throw new AggregateInvariantViolation(
                "Scheduled appointment requires reservation");
    }

    if (history.size() > MAX_HISTORY) {
        throw new AggregateInvariantViolation(
                "Appointment history limit exceeded");
    }
}
```

A validação defensiva também é usada na reidratação.

---

### 16. Criar confirmação

```java
public void confirm(
        Instant occurredAt) {

    requireStatus(
            AppointmentStatus.SCHEDULED,
            "confirm");

    status =
            AppointmentStatus.CONFIRMED;

    revision =
            revision.next();

    record(
            new AppointmentConfirmed(
                    id,
                    window,
                    occurredAt,
                    revision));

    validateCurrentState();
}
```

A root altera estado, revisão e evento.

---

### 17. Criar reagendamento

```java
public void reschedule(
        AppointmentWindow newWindow,
        CapacityReservationId newReservationId,
        RescheduleReason reason,
        Instant occurredAt) {

    requireActive();

    Objects.requireNonNull(newWindow);
    Objects.requireNonNull(newReservationId);
    Objects.requireNonNull(reason);
    Objects.requireNonNull(occurredAt);

    if (window.equals(newWindow)) {
        throw new AggregateInvariantViolation(
                "New window must differ from current window");
    }

    AppointmentWindow previousWindow =
            window;

    CapacityReservationId previousReservation =
            reservationId;

    window =
            newWindow;

    reservationId =
            newReservationId;

    status =
            AppointmentStatus.SCHEDULED;

    revision =
            revision.next();

    appendHistory(
            new AppointmentChange(
                    AppointmentChangeType.RESCHEDULED,
                    previousWindow,
                    newWindow,
                    reason.value(),
                    occurredAt,
                    revision));

    record(
            new AppointmentRescheduled(
                    id,
                    previousWindow,
                    newWindow,
                    previousReservation,
                    newReservationId,
                    reason,
                    occurredAt,
                    revision));

    validateCurrentState();
}
```

Janela e reserva são substituídas juntas.

---

### 18. Criar cancelamento

```java
public void cancel(
        CancellationReason reason,
        Instant occurredAt) {

    requireActive();

    Objects.requireNonNull(reason);
    Objects.requireNonNull(occurredAt);

    status =
            AppointmentStatus.CANCELLED;

    revision =
            revision.next();

    appendHistory(
            new AppointmentChange(
                    AppointmentChangeType.CANCELLED,
                    window,
                    window,
                    reason.value(),
                    occurredAt,
                    revision));

    record(
            new AppointmentCancelled(
                    id,
                    reservationId,
                    reason,
                    occurredAt,
                    revision));

    validateCurrentState();
}
```

A referência permite reação externa sem alterar Capacity.

---

### 19. Proteger histórico

```java
private void appendHistory(
        AppointmentChange change) {

    if (history.size() >= MAX_HISTORY) {
        throw new AggregateInvariantViolation(
                "History limit reached");
    }

    history.add(
            Objects.requireNonNull(change));
}

public List<AppointmentChange> history() {

    return List.copyOf(history);
}
```

O limite evita crescimento indefinido.

Em outro domínio, o histórico completo poderia ficar fora do Aggregate.

---

### 20. Criar child access policy

Arquivo:

```text
contracts/child-access-policy.yaml
```

Conteúdo:

```yaml
childAccess:
  mutation:
    rootOnly:
      required

  collection:
    immutableCopy:
      required

  childRepository:
    forbidden

  childPublicSetter:
    forbidden

  externalCode:
    mayObserveSnapshot:
      true
```

---

### 21. Aggregate sem child Entity

Um Aggregate pode conter somente uma root, Value Objects, referências e eventos; não precisa formar uma árvore grande.

---

### 22. Referências externas por identidade

O Appointment não contém:

```java
private CapacityReservation reservation;
```

Ele contém:

```java
private CapacityReservationId reservationId;
```

Essa decisão evita carregar outro Aggregate, salvar grafos grandes, criar transação cruzada e acoplar ciclos de vida.

---

### 23. Criar external reference policy

Arquivo:

```text
contracts/external-reference-policy.yaml
```

Conteúdo:

```yaml
externalReference:
  aggregateToAggregate:
    byIdentity:
      required

  directObjectReference:
    forbidden

  foreignLifecycleControl:
    forbidden

  requiredExternalData:
    snapshotOrContract:
      preferred

  staleSnapshotRisk:
    documented:
      required
```

---

### 24. Consistência forte

Dentro do Appointment, precisam mudar juntos:

- janela;
- reserva vinculada;
- status;
- revisão;
- histórico;
- evento pendente.


---

### 25. Consistência eventual

Depois do cancelamento:

- Capacity precisa liberar a reserva;
- Notifications pode informar o cliente;
- Field Execution pode encerrar preparação;
- Billing pode ignorar o compromisso.

Essas reações podem convergir por eventos, sem transação distribuída.

---

### 26. Criar consistency policy

Arquivo:

```text
contracts/consistency-policy.yaml
```

Conteúdo:

```yaml
consistency:
  strongInsideAggregate:
    - current-window
    - reservation-reference
    - status
    - revision
    - bounded-history
    - pending-events

  eventualOutsideAggregate:
    - capacity-release
    - customer-notification
    - field-execution-update
    - billing-reaction

  distributedTransaction:
    forbidden

  remoteCallInsideRoot:
    forbidden

  externalReaction:
    triggeredByEvent:
      preferred
```

---

### 27. Criar documento de decisões

Arquivo:

```text
aggregate/CONSISTENCY_DECISIONS.md
```

Registre para cada regra:

- dados envolvidos;
- necessidade de atomicidade;
- owner;
- comportamento de falha;
- evento;
- consistência forte ou eventual;
- motivo.

---

### 28. Evitar chamadas remotas na root

Exemplo incorreto:

```java
public void reschedule(...) {

    capacityClient.reserve(...);

    notificationClient.send(...);

    this.window = newWindow;
}
```

A root não deve depender de rede.

A aplicação obtém a reserva antes de chamar:

```java
appointment.reschedule(
        newWindow,
        reservationId,
        reason,
        occurredAt);
```

---

### 29. Criar eventos

```java
public sealed interface AppointmentDomainEvent
        permits AppointmentScheduled,
                AppointmentConfirmed,
                AppointmentRescheduled,
                AppointmentCancelled {

    AppointmentId appointmentId();

    AppointmentRevision revision();

    Instant occurredAt();
}
```

Cada evento representa uma mudança válida.

---

### 30. Criar event policy

Arquivo:

```text
contracts/aggregate-event-policy.yaml
```

Conteúdo:

```yaml
aggregateEvent:
  producedBy:
    root

  required:
    - aggregate-id
    - aggregate-revision
    - occurred-at
    - domain-fact

  immutable:
    required

  publication:
    outsideAggregate:
      required

  technicalEvent:
    forbidden

  mutableEntityReference:
    forbidden
```

---

### 31. Coletar eventos

```java
private void record(
        AppointmentDomainEvent event) {

    events.add(
            Objects.requireNonNull(event));
}

public List<AppointmentDomainEvent>
pullEvents() {

    List<AppointmentDomainEvent> copy =
            List.copyOf(events);

    events.clear();

    return copy;
}
```

A root registra; a aplicação publica depois.

---

### 32. Criar snapshot

```java
public AppointmentSnapshot snapshot() {

    return new AppointmentSnapshot(
            id,
            serviceRequestId,
            window,
            reservationId,
            status,
            revision,
            List.copyOf(history),
            createdAt);
}
```

O snapshot oferece leitura imutável.

---

### 33. Criar reidratação

```java
public static Appointment rehydrate(
        AppointmentSnapshot snapshot) {

    return new Appointment(
            snapshot.id(),
            snapshot.serviceRequestId(),
            snapshot.window(),
            snapshot.reservationId(),
            snapshot.createdAt(),
            snapshot.status(),
            snapshot.revision(),
            snapshot.history());
}
```

A reidratação não produz evento nem incrementa revisão; ela valida invariantes e rejeita dados inválidos.

---

### 34. Criar rehydration policy

Arquivo:

```text
contracts/rehydration-policy.yaml
```

Conteúdo:

```yaml
rehydration:
  validates:
    - identity
    - state
    - references
    - history-limit
    - revision

  createsDomainEvents:
    forbidden

  incrementsRevision:
    forbidden

  bypassesInvariants:
    forbidden

  invalidPersistedState:
    action:
      DATA_QUALITY_FAILURE
```

---

### 35. Concorrência perdida

Cenário:

```text
processo A lê revisão 4;

processo B lê revisão 4;

A confirma e salva revisão 5;

B cancela com base na revisão 4;

B sobrescreve a confirmação.
```

Esse problema é chamado `lost update`.

A root mantém revisão para permitir detecção externa.

---

### 36. Criar concurrency policy

Arquivo:

```text
contracts/concurrency-policy.yaml
```

Conteúdo:

```yaml
concurrency:
  aggregate:
    revision:
      required

  expectedRevision:
    checkedOnPersistence:
      required

  staleWrite:
    action:
      REJECT

  retry:
    reloadAndReevaluate:
      required

  blindOverwrite:
    forbidden

  implementation:
    deferredToRepositoryLesson
```

A persistência fica para a aula 626.

---

### 37. Criar método de revisão esperada

```java
public void requireRevision(
        AppointmentRevision expected) {

    if (!revision.equals(expected)) {
        throw new StaleAppointmentRevision(
                expected,
                revision);
    }
}
```

O handler pode verificar a revisão, mas a decisão final pertence ao armazenamento.

---

### 38. Criar command de reagendamento

```java
public record RescheduleAppointment(
        AppointmentId appointmentId,
        AppointmentRevision expectedRevision,
        AppointmentWindow newWindow,
        CapacityReservationId reservationId,
        RescheduleReason reason) {
}
```

O command carrega a revisão observada pelo consumidor.

---

### 39. Criar command handler

```java
public final class AppointmentCommandHandler {

    public AppointmentResult handle(
            Appointment appointment,
            RescheduleAppointment command,
            Instant occurredAt) {

        appointment.requireRevision(
                command.expectedRevision());

        appointment.reschedule(
                command.newWindow(),
                command.reservationId(),
                command.reason(),
                occurredAt);

        return AppointmentResult.from(
                appointment.snapshot());
    }
}
```

O handler coordena; as invariantes permanecem na root.

---

### 40. Não colocar regra no handler

Exemplo incorreto:

```java
if (appointment.status()
        == AppointmentStatus.CANCELLED) {
    throw ...
}
```

A root já deve rejeitar a transição.

O handler não duplica a regra.

---

### 41. Tamanho do Aggregate

Aggregate grande aumenta carregamento, conflitos e transações; pequeno demais espalha invariantes e coordenação. A fronteira deve seguir consistência, não conveniência.

---

### 42. Criar size policy

Arquivo:

```text
aggregate/SIZE_AND_PERFORMANCE.md
```

Registre:

```text
objetos internos;

volume esperado;

crescimento do histórico;

tempo de carregamento;

frequência de escrita;

conflitos esperados;

limite de coleção;

estratégia de arquivamento.
```

O histórico foi limitado a cinquenta entradas no laboratório.

---

### 43. Modelar histórico fora quando necessário

Se o histórico crescer indefinidamente, use audit log, read model, armazenamento histórico ou janela recente. Evite milhares de elementos.

---

### 44. Criar evolution log

Arquivo:

```text
aggregate/EVOLUTION_LOG.md
```

Exemplo:

```markdown
## AGG-DEC-003

Decisão:
Manter somente cinquenta mudanças recentes.

Motivo:
Evitar crescimento ilimitado da root.

Consequência:
Histórico completo pertence a auditoria externa.

Revisão:
Após métricas de produção.
```

---

### 45. Testar criação válida

```java
@Test
void shouldCreateScheduledAppointment() {

    Appointment appointment =
            Appointment.schedule(
                    Fixtures.appointmentId(),
                    Fixtures.serviceRequestId(),
                    Fixtures.window(),
                    Fixtures.reservationId(),
                    Fixtures.now());

    AppointmentSnapshot snapshot =
            appointment.snapshot();

    assertEquals(
            AppointmentStatus.SCHEDULED,
            snapshot.status());

    assertEquals(
            new AppointmentRevision(0),
            snapshot.revision());
}
```

---

### 46. Testar confirmação

Valide:

- estado anterior;
- novo estado;
- revisão incrementada;
- evento;
- janela preservada;
- reserva preservada;
- histórico não alterado.

---

### 47. Testar confirmação inválida

```java
@Test
void shouldRejectSecondConfirmation() {

    Appointment appointment =
            Fixtures.scheduledAppointment();

    appointment.confirm(
            Fixtures.confirmedAt());

    assertThrows(
            InvalidAppointmentTransition.class,
            () ->
                    appointment.confirm(
                            Fixtures.later()));
}
```

---

### 48. Testar reagendamento atômico

Confirme na mesma operação:

- nova janela;
- nova reserva;
- status `SCHEDULED`;
- histórico;
- revisão;
- evento.

Nenhum estado intermediário deve ser observável.

---

### 49. Testar cancelamento terminal

Após cancelamento:

- confirmação falha;
- reagendamento falha;
- segundo cancelamento falha;
- revisão permanece estável após falha;
- nenhum evento extra é registrado.

---

### 50. Testar histórico protegido

```java
@Test
void historyMustBeImmutableFromOutside() {

    Appointment appointment =
            Fixtures.rescheduledAppointment();

    List<AppointmentChange> history =
            appointment.history();

    assertThrows(
            UnsupportedOperationException.class,
            () ->
                    history.clear());
}
```

---

### 51. Testar limite de histórico

Crie cinquenta mudanças válidas.

A próxima deve falhar antes de deixar estado parcial.

Para garantir isso, verifique o limite antes de alterar a janela.

A implementação final deve executar preconditions antes das mutations.

---

### 52. Corrigir ordem das preconditions

Antes de mudar estado:

```java
private void ensureHistoryCapacity() {

    if (history.size() >= MAX_HISTORY) {
        throw new AggregateInvariantViolation(
                "History limit reached");
    }
}
```

Chame no início de `reschedule` e `cancel`.

Esse detalhe evita Aggregate parcialmente alterado quando a operação falha.

---

### 53. Testar revisão

```java
@Test
void everySuccessfulChangeMustIncrementRevision() {

    Appointment appointment =
            Fixtures.scheduledAppointment();

    assertEquals(
            0,
            appointment.revision().value());

    appointment.confirm(
            Fixtures.confirmedAt());

    assertEquals(
            1,
            appointment.revision().value());
}
```

Falhas não incrementam revisão.

---

### 54. Testar stale revision

```java
@Test
void shouldRejectStaleCommandRevision() {

    Appointment appointment =
            Fixtures.scheduledAppointment();

    appointment.confirm(
            Fixtures.confirmedAt());

    assertThrows(
            StaleAppointmentRevision.class,
            () ->
                    appointment.requireRevision(
                            new AppointmentRevision(0)));
}
```

---

### 55. Testar reidratação

Valide:

- mesmo snapshot;
- zero eventos pendentes;
- mesma revisão;
- mesmas invariantes;
- histórico imutável;
- estado inválido rejeitado.

---

### 56. Criar architecture test

```java
@ArchTest
static final ArchRule domainMustNotDependOnFramework =
        noClasses()
                .that()
                .resideInAPackage(
                        "..domain..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "org.springframework..",
                        "jakarta.persistence..",
                        "..infrastructure..");
```

---

### 57. Criar root authority test

Inspecione:

- ausência de setters;
- mutações públicas somente na root;
- history imutável;
- Value Objects imutáveis;
- nenhum child repository;
- nenhum client remoto.

---

### 58. Criar external reference test

Procure dentro de `Appointment`:

```text
ServiceRequest;
CapacityReservation;
Customer;
Technician;
FieldActivity.
```

Somente IDs podem aparecer.

---

### 59. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  rootWithoutIdentity:
    action:
      FAIL

  invariantOutsideRoot:
    action:
      FAIL

  directChildMutation:
    action:
      FAIL

  crossAggregateObjectReference:
    action:
      FAIL

  unboundedCollection:
    action:
      FAIL

  failedOperationChangingRevision:
    action:
      FAIL

  rehydrationCreatingEvent:
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
  invariantViolation:
    action:
      REJECT_WITHOUT_STATE_CHANGE

  invalidTransition:
    action:
      REJECT_WITHOUT_STATE_CHANGE

  staleRevision:
    action:
      RELOAD_AND_REEVALUATE

  invalidPersistedState:
    action:
      DATA_QUALITY_FAILURE

  historyLimit:
    action:
      REJECT_OR_ARCHIVE_BY_POLICY

  RepositoryDeepDive:
    deferredToLesson626

  DomainServiceDeepDive:
    deferredToLesson627
```

---

### 61. Validar boundary

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-aggregate-boundary.ps1
```

Confirme:

- inside;
- outside;
- root;
- IDs;
- collections;
- eventos;
- revisão.

---

### 62. Validar autoridade da root

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-root-authority.ps1
```

Procure:

- setters;
- mutação de child;
- collection mutável;
- bypass;
- método genérico;
- acesso direto.

---

### 63. Validar invariantes

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-aggregate-invariants.ps1
```

Cada invariante precisa de:

- método;
- teste;
- cenário válido;
- cenário inválido;
- owner;
- mensagem.

---

### 64. Validar consistência

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-consistency-decisions.ps1
```

Confirme:

- forte dentro;
- eventual fora;
- sem remote call na root;
- sem transação distribuída;
- eventos para reações externas.

---

### 65. Validar referências

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-external-references.ps1
```

Confirme:

- somente IDs;
- nenhum objeto externo;
- nenhum repository externo;
- nenhum lifecycle externo controlado.

---

### 66. Validar children

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-child-access.ps1
```

Confirme:

- root-only mutation;
- immutable copies;
- sem child repository;
- sem setter;
- sem exposição de lista mutável.

---

### 67. Validar concorrência

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-concurrency-policy.ps1
```

Confirme:

- revisão;
- expected revision;
- stale rejection;
- sem blind overwrite;
- implementação completa adiada para Repository.

---

### 68. Validar eventos

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\validate-aggregate-events.ps1
```

Confirme:

- fatos no passado;
- ID;
- revisão;
- occurredAt;
- imutabilidade;
- publicação externa à root.

---

### 69. Executar testes

Execute:

```powershell
.\scripts\m19\service-appointment-aggregate\run-aggregate-root-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- criação;
- confirmação;
- reagendamento;
- cancelamento;
- invariantes;
- histórico;
- revisão;
- stale command;
- reidratação;
- arquitetura.

---

### 70. Criar reports

Exemplo:

```yaml
aggregateBoundary:
  root:
    Appointment

  internalValueObjects:
    8

  externalObjectReferences:
    0

  externalIdentityReferences:
    2

  unboundedCollections:
    0

  rootMutationBypass:
    0

  result:
    PASS
```

---

### 71. Criar gate

O gate valida charter, root, boundary, invariantes, children, referências, consistência, revisão, concorrência, eventos, rehydration, tamanho, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_ROOT;

FAIL_BOUNDARY;

FAIL_INVARIANT;

FAIL_CHILD_ACCESS;

FAIL_EXTERNAL_REFERENCE;

FAIL_CONSISTENCY;

FAIL_TRANSACTION_BOUNDARY;

FAIL_REVISION;

FAIL_CONCURRENCY;

FAIL_EVENT;

FAIL_REHYDRATION;

FAIL_SIZE;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 72. Coletar evidence

Arquivo:

```text
contracts/aggregate-root-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- aggregate;
- root;
- invariant count;
- internal child count;
- external identity reference count;
- root authority status;
- strong consistency status;
- eventual consistency status;
- history limit;
- revision status;
- concurrency policy status;
- event status;
- rehydration status;
- architecture status;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- IDs reais;
- payloads reais;
- JPA;
- Repository aprofundado;
- Domain Service aprofundado.

---

### 73. Executar validação completa

```powershell
.\scripts\m19\service-appointment-aggregate\validate-aggregate-root-contract.ps1

.\scripts\m19\service-appointment-aggregate\validate-aggregate-boundary.ps1

.\scripts\m19\service-appointment-aggregate\validate-root-authority.ps1

.\scripts\m19\service-appointment-aggregate\validate-aggregate-invariants.ps1

.\scripts\m19\service-appointment-aggregate\validate-consistency-decisions.ps1

.\scripts\m19\service-appointment-aggregate\validate-external-references.ps1

.\scripts\m19\service-appointment-aggregate\validate-child-access.ps1

.\scripts\m19\service-appointment-aggregate\validate-concurrency-policy.ps1

.\scripts\m19\service-appointment-aggregate\validate-aggregate-events.ps1

.\scripts\m19\service-appointment-aggregate\run-aggregate-root-tests.ps1

.\scripts\m19\service-appointment-aggregate\collect-aggregate-root-evidence.ps1

.\scripts\m19\service-appointment-aggregate\verify-aggregate-root-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 74. Encerrar o laboratório

Confirme:

- root explícita;
- boundary documentada;
- invariantes protegidas;
- children internos;
- referências externas por ID;
- consistência forte local;
- consistência eventual externa;
- zero chamada remota na root;
- histórico limitado;
- revisão monotônica;
- stale command rejeitado;
- eventos imutáveis;
- reidratação sem eventos;
- domain sem framework;
- Repository não aprofundado;
- Domain Service não aprofundado;
- reports sanitizados.

---

## Entendendo o que foi feito

### O modelo ganhou unidade de consistência

Objetos relacionados deixaram de mudar separadamente.

### A root ganhou autoridade

Toda mutação passou por `Appointment`.

### As invariantes ganharam uma casa

Regras deixaram de ficar espalhadas em handlers.

### As referências ganharam limite

Outros Aggregates passaram a ser conhecidos somente por ID.

### A transação ganhou fronteira

Janela, reserva, status, histórico, revisão e evento mudam juntos.

### A consistência eventual ganhou propósito

Outros contextos reagem a fatos sem transação distribuída.

### O histórico ganhou limite

A root deixou de crescer indefinidamente.

### A revisão ganhou função

Concorrência perdida passou a ser detectável.

### Os eventos ganharam origem

Somente mudanças válidas da root produzem fatos.

### A reidratação ganhou segurança

Estado persistido não contorna invariantes.

---

## Erros comuns importantes

### Criar Aggregate para toda Entity

Nem toda Entity precisa de um boundary próprio.

### Colocar todo o processo em um Aggregate

A root fica grande e altamente contenciosa.

### Referenciar outro Aggregate por objeto

Ciclos de carregamento e transação aparecem.

### Permitir mutação de child

A root perde autoridade.

### Colocar remote call na root

O domínio fica dependente de rede.

### Duplicar invariante no handler

A regra pode divergir.

### Manter coleção sem limite

O Aggregate cresce indefinidamente.

### Publicar evento dentro da root

Persistência e domínio ficam acoplados.

### Ignorar revisão

Lost updates podem sobrescrever decisões.

### Antecipar Repository e Domain Service

A aula perde o foco na consistência.

---

## Comandos úteis

### Validar boundary

```powershell
.\scripts\m19\service-appointment-aggregate\validate-aggregate-boundary.ps1
```

### Validar invariantes

```powershell
.\scripts\m19\service-appointment-aggregate\validate-aggregate-invariants.ps1
```

### Validar concorrência

```powershell
.\scripts\m19\service-appointment-aggregate\validate-concurrency-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-appointment-aggregate\run-aggregate-root-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-appointment-aggregate\verify-aggregate-root-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Root

Escolha a Entity que representa o Aggregate.

### Parte 2 — Boundary

Liste elementos internos e externos.

### Parte 3 — Invariantes

Defina regras de consistência.

### Parte 4 — Mutação

Permita mudanças somente pela root.

### Parte 5 — Referências

Use IDs para outros Aggregates.

### Parte 6 — Consistência

Separe forte e eventual.

### Parte 7 — Eventos

Registre fatos após mudanças válidas.

### Parte 8 — Concorrência

Adicione revisão e stale detection.

### Parte 9 — Tamanho

Limite coleções e crescimento.

### Parte 10 — Gate

Valide boundary, testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 624 e ponte para a aula 626 foram preservadas;
- o laboratório `service-appointment-aggregate` foi criado;
- `Appointment` foi definido como Aggregate Root;
- o Aggregate Charter foi criado;
- a decisão da root foi documentada;
- elementos inside e outside foram listados;
- invariantes possuem IDs e testes;
- toda mudança ocorre por comportamento da root;
- não existem setters públicos;
- children não podem ser alterados diretamente;
- histórico é exposto por cópia imutável;
- histórico possui limite operacional;
- `ServiceRequest` e `CapacityReservation` não estão dentro do Aggregate;
- referências externas usam `ServiceRequestId` e `CapacityReservationId`;
- janela e reserva mudam juntas no reagendamento;
- cancelamento é terminal;
- toda mudança bem-sucedida incrementa revisão;
- falhas não alteram estado ou revisão;
- toda mudança relevante registra evento;
- eventos são imutáveis;
- eventos não carregam Entity mutável;
- a root não publica eventos;
- publicação ocorre após persistência na camada externa;
- reidratação não produz eventos;
- reidratação valida invariantes;
- consistência forte está limitada ao Aggregate;
- reações externas usam consistência eventual;
- não existe transação distribuída;
- não existe chamada remota dentro da root;
- stale revision foi modelada;
- blind overwrite foi proibido;
- Aggregate size e contention foram avaliados;
- arquitetura impede dependência de framework;
- Repository em DDD não foi aprofundado;
- Domain Service não foi aprofundado;
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
  labs/m19/aula-625-aggregate-aggregate-root/service-appointment-aggregate `
  scripts/m19/service-appointment-aggregate `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|@Entity|JpaRepository|EntityManager|remoteClientInsideAggregate|repositoryDeepDive|domainServiceDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar Aggregate e Aggregate Root"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- IDs reais;
- JPA;
- banco real;
- chamada remota na root;
- Repository aprofundado;
- Domain Service aprofundado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Aggregate e Aggregate Root.

Você criou:

```text
Aggregate Charter;

decisão da root;

boundary;

catálogo de invariantes;

consistência forte;

consistência eventual;

referências externas por ID;

histórico protegido;

revisão;

política de concorrência;

eventos;

rehydration;

testes arquiteturais.
```

Você comprovou que Aggregate é uma unidade de consistência; que a root é a única autoridade de alteração; que outros Aggregates são referenciados por identidade; que chamadas remotas não pertencem à root; que reações entre contextos podem ser eventualmente consistentes; que histórico precisa de limite; que revisão ajuda a detectar lost updates; e que eventos só surgem após mudanças válidas.

A próxima aula será:

```text
626 - M19.16 - Repository em DDD
```

Nela, você irá aprofundar como recuperar e persistir Aggregate Roots, desenhar contratos de Repository, preservar linguagem de domínio, implementar concorrência otimista e separar persistência do modelo.

Nenhum aprofundamento de Repository em DDD ou Domain Service foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Escolhi a Aggregate Root.
- [ ] Documentei o boundary.
- [ ] Listei invariantes.
- [ ] Protegi children.
- [ ] Usei referências por ID.
- [ ] Separei consistência forte e eventual.
- [ ] Adicionei revisão.
- [ ] Testei transições e reidratação.

---

## Troubleshooting adicional

### O Aggregate precisa carregar outro Aggregate

Use referência por ID e obtenha dados necessários antes da operação.

### A root possui centenas de children

Revise consistência, lifecycle e estratégia de arquivamento.

### Um handler altera status diretamente

Mova a mudança para comportamento da root.

### A operação chama API externa

Faça a chamada na camada de aplicação e entregue o resultado à root.

### Uma falha deixa estado parcial

Execute todas as preconditions antes das mutations.

### A coleção cresce sem limite

Defina janela recente, arquivamento ou modelo separado.

### Duas gravações se sobrescrevem

Use revisão e concorrência otimista na persistência.

### Um evento precisa de dados externos

Publique dados do Aggregate ou enriqueça fora da root.

### A reidratação gera evento de criação

Separe factory de criação e método de rehydration.

### O laboratório começou a implementar JPA

Preserve Repository e persistência para a aula 626.

---

## Perguntas de revisão

1. O que é Aggregate?
2. O que é Aggregate Root?
3. O que é Aggregate Boundary?
4. O que é invariante?
5. Quem pode alterar children?
6. Como referenciar outro Aggregate?
7. O que pertence à consistência forte?
8. O que pode ser eventualmente consistente?
9. Por que evitar transação distribuída?
10. Por que evitar remote call na root?
11. O que é Aggregate Revision?
12. O que é lost update?
13. O que é optimistic concurrency?
14. Por que limitar collections?
15. Quem registra eventos?
16. Quem publica eventos?
17. O que a reidratação não deve fazer?
18. Por que Aggregate não significa grafo grande?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Unidade de consistência do domínio.
2. Entity que controla o Aggregate.
3. Limite dos objetos que mudam juntos.
4. Regra que precisa permanecer verdadeira.
5. Somente a root.
6. Por identidade.
7. Dados que precisam mudar atomicamente.
8. Reações de outros Aggregates e contextos.
9. Reduzir acoplamento e falhas coordenadas.
10. Manter domínio determinístico e local.
11. Versão monotônica do estado.
12. Sobrescrita de alteração concorrente.
13. Detecção de estado alterado desde a leitura.
14. Evitar crescimento e contention.
15. A Aggregate Root.
16. A camada de aplicação após persistência.
17. Produzir eventos ou ignorar invariantes.
18. O boundary segue consistência.
19. Repository em DDD.
20. Repository em DDD.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 625 - M19.15 - Aggregate Aggregate Root

- Aprofundei Aggregate e Aggregate Root.
- Criei o laboratório `service-appointment-aggregate`.
- Defini `Appointment` como Aggregate Root.
- Criei Aggregate Charter e decisão da root.
- Listei elementos inside e outside.
- Criei catálogo de invariantes.
- Mantive janela, reserva, status, revisão, histórico e eventos na mesma consistência.
- Referenciei Service Request e Capacity Reservation somente por ID.
- Impedi mutação direta de children.
- Protegi histórico com cópia imutável e limite.
- Implementei criação, confirmação, reagendamento e cancelamento.
- Mantive cancelamento como estado terminal.
- Incrementei revisão em mudanças válidas.
- Rejeitei stale revisions.
- Separei consistência forte local de consistência eventual externa.
- Mantive chamadas remotas fora da root.
- Registrei eventos imutáveis na root.
- Mantive publicação após persistência.
- Implementei rehydration sem eventos.
- Criei testes de invariantes, revision, history e arquitetura.
- Criei reports, gate e evidence.
- Não antecipei Repository em DDD ou Domain Service.
- Próxima aula: Repository em DDD.
```

---

## Referência técnica curta

- Aggregate.
- Aggregate Root.
- Aggregate Boundary.
- Invariants.
- Strong Consistency.
- Eventual Consistency.
- External References.
- Optimistic Concurrency.
- Aggregate Revision.
- Rehydration.

Regra final:

```text
um Aggregate precisa ser desenhado como unidade de consistência, não como agrupamento por conveniência: `Appointment` é a Aggregate Root e a única autoridade para alterar janela, reserva, status, histórico, revisão e eventos, enquanto `ServiceRequest` e `CapacityReservation` permanecem fora e são referenciados somente por IDs; invariantes são verificadas dentro da root, todas as preconditions ocorrem antes das mutations, children não possuem mutação externa, coleções são imutáveis e limitadas, e cada mudança válida incrementa a revisão e registra um fato de domínio; consistência forte permanece dentro do Aggregate, reações de Capacity, Notifications, Field Execution e Billing são eventualmente consistentes, chamadas remotas e transações distribuídas não entram na root, e eventos são publicados pela aplicação somente após persistência; rehydration valida estado sem gerar eventos, stale revisions impedem blind overwrite e tamanho, contention e histórico são monitorados; o gate termina com root, boundary, invariantes, referências, consistência, revisão, eventos, rehydration, testes, arquitetura, documentação e evidence aprovados, enquanto Repository em DDD é aprofundado somente na aula 626 e Domain Service permanece reservado à aula 627.
```
