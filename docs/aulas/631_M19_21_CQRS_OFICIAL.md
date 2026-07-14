# 631 - M19.21 - CQRS

## Apresentação da aula

Na aula 630, você conduziu um Event Storming do domínio de Service Scheduling.

O board revelou:

```text
commands;

Domain Events;

actors;

policies;

read models;

external systems;

hotspots;

Bounded Context candidates;

Aggregate candidates;

Domain Service candidates.
```

No fluxo de agendamento surgiram commands como `Schedule`, `Confirm`, `Reschedule` e `Cancel Appointment`, além de views para elegibilidade, capacidade, resumo e opções. Command tenta mudar estado; query obtém informação sem mudança observável.

Em sistemas simples, commands e queries podem compartilhar modelo e banco por muito tempo. CQRS não deve ser automático.

A separação passa a fazer sentido quando telas exigem joins e filtros próprios, listagens carregam Aggregates completos, relatórios deformam o domínio ou leitura e escrita possuem escalas e latências diferentes.

CQRS significa:

```text
Command Query Responsibility Segregation.
```

A separação pode ser mínima, com interfaces e handlers distintos; intermediária, com write e read models diferentes no mesmo banco; ou avançada, com stores e projections independentes.

CQRS não exige microservices, dois bancos, mensageria, Event Sourcing ou framework específico.

A pergunta desta aula será:

```text
quando separar
commands e queries

e como fazer isso
sem duplicar
complexidade
desnecessariamente?
```

O laboratório será:

```text
labs/m19/aula-631-cqrs/service-scheduling-cqrs
```

Você implementará Command Side, Query Side, read models, handlers, projection, checkpoint, lag, rebuild e testes arquiteturais.

O Command Side preservará Aggregate, Domain Services, Repository, revisão e invariantes. O Query Side terá queries, handlers, stores, filtros, paginação e views específicas.

O laboratório usará projection síncrona e fila em memória para simular stale read, lag, read-your-writes e falhas.

A próxima aula oficial será:

```text
632 - M19.22 - Event Sourcing conceitual
```

Esta aula não implementará Event Store, replay de Aggregate, snapshots de stream ou persistência append-only.

A aula 633 será:

```text
633 - M19.23 - Arquitetura orientada a eventos
```

Também não aprofundará brokers, consumers, delivery guarantees, partitions, DLQ ou choreography.

A regra central será:

```text
commands protegem mudanças;

queries entregam informação;

a separação
deve ser proporcional
à diferença real
entre essas responsabilidades.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
629:
Domain Events.

630:
Event Storming.

631:
CQRS.

632:
Event Sourcing conceitual.

633:
Arquitetura orientada a eventos.
```

A progressão vai de fatos e descoberta para separação de leitura e escrita, Event Sourcing e arquitetura orientada a eventos.

Nesta aula, o foco será Command Side, Query Side, read models, projections, lag, read-your-writes e rebuild. Event Sourcing, broker e arquitetura orientada a eventos não serão aprofundados.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-631-cqrs/service-scheduling-cqrs
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/cqrs
│   │           ├── command
│   │           │   ├── api
│   │           │   │   ├── Command.java
│   │           │   │   ├── CommandHandler.java
│   │           │   │   ├── CommandResult.java
│   │           │   │   └── CommandFailure.java
│   │           │   ├── appointment
│   │           │   │   ├── ScheduleAppointmentCommand.java
│   │           │   │   ├── ConfirmAppointmentCommand.java
│   │           │   │   ├── RescheduleAppointmentCommand.java
│   │           │   │   ├── CancelAppointmentCommand.java
│   │           │   │   ├── ScheduleAppointmentHandler.java
│   │           │   │   ├── ConfirmAppointmentHandler.java
│   │           │   │   ├── RescheduleAppointmentHandler.java
│   │           │   │   └── CancelAppointmentHandler.java
│   │           │   └── port
│   │           │       ├── AppointmentRepository.java
│   │           │       ├── TransactionRunner.java
│   │           │       └── DomainEventPublisher.java
│   │           ├── query
│   │           │   ├── api
│   │           │   │   ├── Query.java
│   │           │   │   ├── QueryHandler.java
│   │           │   │   ├── QueryPage.java
│   │           │   │   └── QuerySort.java
│   │           │   ├── appointment
│   │           │   │   ├── GetAppointmentDetails.java
│   │           │   │   ├── SearchAppointments.java
│   │           │   │   ├── GetReschedulingOptions.java
│   │           │   │   ├── GetAppointmentDetailsHandler.java
│   │           │   │   ├── SearchAppointmentsHandler.java
│   │           │   │   └── GetReschedulingOptionsHandler.java
│   │           │   ├── model
│   │           │   │   ├── AppointmentDetailsView.java
│   │           │   │   ├── AppointmentListItem.java
│   │           │   │   ├── ReschedulingOptionView.java
│   │           │   │   ├── AppointmentSearchCriteria.java
│   │           │   │   └── ReadModelVersion.java
│   │           │   └── port
│   │           │       ├── AppointmentReadModelStore.java
│   │           │       ├── CapacityReadModelGateway.java
│   │           │       └── ProjectionCheckpointStore.java
│   │           ├── domain
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── AppointmentRevision.java
│   │           │   ├── AppointmentStatus.java
│   │           │   └── event
│   │           │       ├── AppointmentScheduled.java
│   │           │       ├── AppointmentConfirmed.java
│   │           │       ├── AppointmentRescheduled.java
│   │           │       └── AppointmentCancelled.java
│   │           ├── projection
│   │           │   ├── AppointmentProjection.java
│   │           │   ├── AppointmentProjectionHandler.java
│   │           │   ├── ProjectionEventEnvelope.java
│   │           │   ├── ProjectionResult.java
│   │           │   ├── ProjectionLag.java
│   │           │   └── AppointmentProjectionRebuilder.java
│   │           ├── infrastructure
│   │           │   ├── memory
│   │           │   │   ├── InMemoryAppointmentRepository.java
│   │           │   │   ├── InMemoryAppointmentReadModelStore.java
│   │           │   │   ├── InMemoryProjectionCheckpointStore.java
│   │           │   │   └── QueuedProjectionDispatcher.java
│   │           │   └── web
│   │           │       ├── AppointmentCommandController.java
│   │           │       └── AppointmentQueryController.java
│   │           └── configuration
│   │               └── CqrsConfiguration.java
│   └── test
│       └── java
│           └── br/com/formacao/cqrs
│               ├── command
│               │   ├── ScheduleAppointmentHandlerTest.java
│               │   ├── ConfirmAppointmentHandlerTest.java
│               │   └── CommandSideInvariantTest.java
│               ├── query
│               │   ├── GetAppointmentDetailsHandlerTest.java
│               │   ├── SearchAppointmentsHandlerTest.java
│               │   └── QueryMustNotMutateStateTest.java
│               ├── projection
│               │   ├── AppointmentProjectionTest.java
│               │   ├── ProjectionIdempotencyTest.java
│               │   ├── ProjectionOrderingTest.java
│               │   ├── ProjectionLagTest.java
│               │   └── AppointmentProjectionRebuilderTest.java
│               └── architecture
│                   ├── CommandQuerySeparationTest.java
│                   ├── QueryDomainIndependenceTest.java
│                   ├── CommandReadModelIndependenceTest.java
│                   └── CqrsFrameworkIndependenceTest.java
├── cqrs
│   ├── CQRS_CHARTER.md
│   ├── ADOPTION_DECISION.md
│   ├── COMMAND_SIDE.md
│   ├── QUERY_SIDE.md
│   ├── READ_MODEL_CATALOG.md
│   ├── PROJECTION_DESIGN.md
│   ├── CONSISTENCY_MODEL.md
│   ├── READ_YOUR_WRITES.md
│   ├── PROJECTION_LAG.md
│   ├── PROJECTION_FAILURES.md
│   ├── REBUILD_POLICY.md
│   ├── QUERY_PERFORMANCE.md
│   ├── SECURITY_POLICY.md
│   ├── TEST_STRATEGY.md
│   ├── TRADE_OFFS.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_CQRS_QUESTIONS.md
├── contracts
│   ├── cqrs-contract.yaml
│   ├── command-side-policy.yaml
│   ├── query-side-policy.yaml
│   ├── read-model-policy.yaml
│   ├── projection-policy.yaml
│   ├── consistency-policy.yaml
│   ├── read-your-writes-policy.yaml
│   ├── projection-lag-policy.yaml
│   ├── rebuild-policy.yaml
│   ├── security-policy.yaml
│   ├── data-quality-policy.yaml
│   ├── failure-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── command-side-report.yaml
    ├── query-side-report.yaml
    ├── read-model-report.yaml
    ├── projection-report.yaml
    ├── consistency-report.yaml
    ├── projection-lag-report.yaml
    ├── architecture-report.yaml
    └── cqrs-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-cqrs
├── validate-cqrs-contract.ps1
├── validate-command-side.ps1
├── validate-query-side.ps1
├── validate-read-models.ps1
├── validate-projections.ps1
├── validate-query-non-mutation.ps1
├── validate-consistency-model.ps1
├── validate-read-your-writes.ps1
├── validate-projection-lag.ps1
├── validate-rebuild-policy.ps1
├── run-cqrs-tests.ps1
├── collect-cqrs-evidence.ps1
└── verify-cqrs-gate.ps1
```

---

## Conceito essencial

### CQRS, Command e Query

CQRS separa mudança e leitura. Command representa intenção de alterar estado; Query solicita informação sem mutação observável.

### Write e Read Models

Write Model protege regras e invariantes. Read Model atende uma consulta específica.

### Projection, Checkpoint e Lag

Projection atualiza views; checkpoint registra progresso; lag mede distância entre escrita e leitura.

### Read Your Writes e Rebuild

Read-your-writes define como o usuário vê sua própria alteração. Rebuild reconstrói views a partir de fonte confiável.

### Consistência

Projection síncrona atualiza no mesmo fluxo; assíncrona converge depois.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-631-cqrs/service-scheduling-cqrs

Set-Location `
  labs/m19/aula-631-cqrs/service-scheduling-cqrs
```

---

### 2. Criar CQRS Charter

Arquivo:

```text
cqrs/CQRS_CHARTER.md
```

Conteúdo:

```markdown
# CQRS Charter

## Contexto

Service Scheduling.

## Objetivo

Separar operações
que mudam Appointment
das consultas
que exibem informações.

## Command Side

Protege invariantes,
Aggregate Root,
revisão
e persistência.

## Query Side

Entrega views
orientadas ao consumidor,
com filtros,
ordenação
e paginação.

## Estratégia inicial

- mesma aplicação;
- mesmo processo;
- stores em memória separados;
- projection síncrona;
- fila simulada para lag;
- sem Event Sourcing;
- sem broker.

## Critério de sucesso

A separação melhora
clareza e leitura
sem duplicar regra de domínio.
```

---

### 3. Registrar decisão de adoção

Arquivo:

```text
cqrs/ADOPTION_DECISION.md
```

Perguntas:

```text
write model e read model
possuem necessidades diferentes?

consultas deformam Aggregates?

a leitura exige filtros
ou agregações específicas?

a escala de leitura
é diferente da escrita?

há necessidade de projections?

a equipe aceita
complexidade operacional adicional?

consistência eventual
é tolerável?
```

Para o laboratório:

```text
decisão:
CQRS moderado.

motivo:
separar Aggregate
das telas operacionais.

sem:
bancos independentes obrigatórios.
```

---

### 4. Criar contrato principal

Arquivo:

```text
contracts/cqrs-contract.yaml
```

Conteúdo:

```yaml
cqrs:
  context:
    Service-Scheduling

  required:
    - command-query-separation
    - command-handler
    - query-handler
    - write-model
    - read-model
    - explicit-projection
    - projection-idempotency
    - projection-ordering
    - consistency-model
    - read-your-writes-decision
    - projection-lag-observability
    - rebuild-policy
    - tests
    - architecture-rules

  forbidden:
    - query-mutates-state
    - command-returns-read-model-graph
    - query-loads-aggregate-for-listing
    - domain-rule-in-projection
    - event-store
    - aggregate-replay
    - broker-dependency
    - Event-Sourcing-deep-dive
    - Event-Driven-Architecture-deep-dive

  nextLesson:
    code:
      M19.22
```

---

### 5. Criar API de command

```java
public interface Command<R extends CommandResult> {
}
```

```java
public interface CommandHandler<
        C extends Command<R>,
        R extends CommandResult> {

    R handle(
            C command);
}
```

O tipo genérico pertence à aplicação; o command continua específico.

---

### 6. Criar command específico

```java
public record ConfirmAppointmentCommand(
        AppointmentId appointmentId,
        AppointmentRevision expectedRevision,
        EventContext eventContext)
        implements Command<CommandResult> {

    public ConfirmAppointmentCommand {
        Objects.requireNonNull(appointmentId);
        Objects.requireNonNull(expectedRevision);
        Objects.requireNonNull(eventContext);
    }
}
```


Ele não representa uma consulta.

---

### 7. Criar Command Handler

```java
public final class ConfirmAppointmentHandler
        implements CommandHandler<
                ConfirmAppointmentCommand,
                CommandResult> {

    private final AppointmentRepository repository;
    private final TransactionRunner transactions;
    private final DomainEventPublisher publisher;
    private final SchedulingClock clock;

    @Override
    public CommandResult handle(
            ConfirmAppointmentCommand command) {

        return transactions.required(
                () -> execute(command));
    }

    private CommandResult execute(
            ConfirmAppointmentCommand command) {

        Appointment appointment =
                repository.findById(
                                command.appointmentId())
                        .orElseThrow(
                                AppointmentNotFound::new);

        appointment.requireRevision(
                command.expectedRevision());

        AppointmentRevision loadedRevision =
                appointment.revision();

        appointment.confirm(
                clock.now(),
                command.eventContext());

        repository.save(
                appointment,
                ExpectedRevision.existing(
                        loadedRevision));

        publisher.publishAfterCommit(
                appointment.pullEvents());

        return CommandResult.accepted(
                appointment.id(),
                appointment.revision());
    }
}
```

A root decide.

---

### 8. Criar command-side policy

Arquivo:

```text
contracts/command-side-policy.yaml
```

Conteúdo:

```yaml
commandSide:
  owns:
    - command
    - command-handler
    - aggregate-root
    - domain-service
    - domain-repository
    - transaction
    - expected-revision

  required:
    - explicit-intent
    - invariant-protection
    - concurrency-control

  forbidden:
    - read-model-table-as-source-of-truth
    - projection-rule-as-domain-rule
    - UI-pagination
    - report-query
```

---

### 9. Resultado do command

O command não precisa devolver a view completa.

Resultado mínimo:

```java
public sealed interface CommandResult {

    record Accepted(
            AppointmentId aggregateId,
            AppointmentRevision revision)
            implements CommandResult {
    }

    record Rejected(
            CommandFailure failure)
            implements CommandResult {
    }
}
```

O cliente consulta a view depois; confirmação mínima pode ser aceitável.

---

### 10. Criar API de query

```java
public interface Query<R> {
}
```

```java
public interface QueryHandler<
        Q extends Query<R>,
        R> {

    R handle(
            Q query);
}
```

Uma query não altera estado observável.

---

### 11. Criar query de detalhes

```java
public record GetAppointmentDetails(
        AppointmentId appointmentId)
        implements Query<
                Optional<AppointmentDetailsView>> {
}
```

Handler:

```java
public final class GetAppointmentDetailsHandler
        implements QueryHandler<
                GetAppointmentDetails,
                Optional<AppointmentDetailsView>> {

    private final AppointmentReadModelStore store;

    @Override
    public Optional<AppointmentDetailsView> handle(
            GetAppointmentDetails query) {

        return store.findDetails(
                query.appointmentId());
    }
}
```

Nenhum Aggregate é carregado.

---

### 12. Criar query de busca

```java
public record SearchAppointments(
        AppointmentSearchCriteria criteria,
        int page,
        int size,
        List<QuerySort> sorts)
        implements Query<
                QueryPage<AppointmentListItem>> {

    public SearchAppointments {
        Objects.requireNonNull(criteria);
        sorts =
                List.copyOf(sorts);

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page cannot be negative");
        }

        if (size < 1 || size > 200) {
            throw new IllegalArgumentException(
                    "Invalid page size");
        }
    }
}
```


---

### 13. Criar query-side policy

Arquivo:

```text
contracts/query-side-policy.yaml
```

Conteúdo:

```yaml
querySide:
  owns:
    - query
    - query-handler
    - read-model
    - filtering
    - sorting
    - pagination
    - projection-store

  required:
    - no-observable-mutation
    - consumer-oriented-shape
    - explicit-security
    - bounded-result-size

  forbidden:
    - aggregate-mutation
    - domain-repository-save
    - domain-event-recording
    - transaction-for-business-change
    - lazy-domain-graph
```

---

### 14. Criar Read Model

```java
public record AppointmentDetailsView(
        UUID appointmentId,
        String status,
        Instant startsAt,
        Instant endsAt,
        String serviceArea,
        String serviceType,
        String customerDisplayReference,
        String capacityReference,
        long aggregateRevision,
        ReadModelVersion readModelVersion,
        Instant projectedAt) {
}
```

O formato atende à leitura, não à estrutura interna do Aggregate.

---

### 15. Criar item de listagem

```java
public record AppointmentListItem(
        UUID appointmentId,
        String statusLabel,
        Instant scheduledStart,
        Instant scheduledEnd,
        String areaLabel,
        String serviceLabel,
        boolean confirmationRequired,
        boolean reschedulingAllowed,
        long aggregateRevision) {
}
```

Campos derivados são permitidos, sem contradizer o domínio.

---

### 16. Criar read-model policy

Arquivo:

```text
contracts/read-model-policy.yaml
```

Conteúdo:

```yaml
readModel:
  optimizedFor:
    consumer-use-case:
      required

  mayContain:
    - denormalized-data
    - display-label
    - derived-field
    - joined-reference
    - pagination-metadata

  forbidden:
    - aggregate-behavior
    - domain-invariant-owner
    - mutable-entity
    - framework-lazy-proxy

  freshness:
    documented:
      required
```

---

### 17. Criar Store de leitura

```java
public interface AppointmentReadModelStore {

    Optional<AppointmentDetailsView> findDetails(
            AppointmentId appointmentId);

    QueryPage<AppointmentListItem> search(
            AppointmentSearchCriteria criteria,
            int page,
            int size,
            List<QuerySort> sorts);

    void upsert(
            AppointmentDetailsView view);

    void delete(
            AppointmentId appointmentId);
}
```


---

### 18. Projection

A projection reage a fatos e atualiza a leitura.

```java
public interface AppointmentProjection {

    ProjectionResult apply(
            ProjectionEventEnvelope envelope);
}
```

Envelope:

```java
public record ProjectionEventEnvelope(
        DomainEventId eventId,
        String eventType,
        EventVersion eventVersion,
        AppointmentId aggregateId,
        AppointmentRevision aggregateRevision,
        Instant occurredAt,
        DomainEvent event) {
}
```

---

### 19. Criar Projection Handler

```java
public final class AppointmentProjectionHandler
        implements AppointmentProjection {

    private final AppointmentReadModelStore store;
    private final ProjectionCheckpointStore checkpoints;
    private final ProjectionClock clock;

    @Override
    public ProjectionResult apply(
            ProjectionEventEnvelope envelope) {

        if (checkpoints.wasProcessed(
                envelope.eventId())) {
            return ProjectionResult.duplicate(
                    envelope.eventId());
        }

        ProjectionResult result =
                switch (envelope.event()) {

                    case AppointmentScheduled event ->
                            onScheduled(event);

                    case AppointmentConfirmed event ->
                            onConfirmed(event);

                    case AppointmentRescheduled event ->
                            onRescheduled(event);

                    case AppointmentCancelled event ->
                            onCancelled(event);
                };

        checkpoints.markProcessed(
                envelope.eventId(),
                envelope.aggregateRevision(),
                clock.now());

        return result;
    }
}
```

---

### 20. Projection idempotente

A projection deduplica por event ID e revisão.

Exemplo:

```java
if (current.aggregateRevision()
        >= event.aggregateRevision().value()) {

    return ProjectionResult.ignoredOlderVersion(
            event.eventId());
}
```

---

### 21. Criar projection policy

Arquivo:

```text
contracts/projection-policy.yaml
```

Conteúdo:

```yaml
projection:
  input:
    domain-or-integration-event

  required:
    - idempotency
    - ordering-policy
    - checkpoint
    - failure-policy
    - rebuildability
    - observability

  forbidden:
    - domain-rule-owner
    - aggregate-mutation
    - event-publication-loop
    - non-deterministic-hidden-clock
    - silent-failure
```

---

### 22. Projetar evento de criação

```java
private ProjectionResult onScheduled(
        AppointmentScheduled event) {

    AppointmentDetailsView view =
            new AppointmentDetailsView(
                    event.aggregateId().value(),
                    "SCHEDULED",
                    event.window().startsAt(),
                    event.window().endsAt(),
                    event.serviceAreaCode().value(),
                    event.serviceType().name(),
                    event.customerReference().displayValue(),
                    event.reservationId().value().toString(),
                    event.aggregateRevision().value(),
                    ReadModelVersion.initial(),
                    clock.now());

    store.upsert(view);

    return ProjectionResult.applied(
            event.eventId());
}
```


---

### 23. Projetar confirmação

```java
private ProjectionResult onConfirmed(
        AppointmentConfirmed event) {

    AppointmentDetailsView current =
            store.findDetails(
                            event.aggregateId())
                    .orElseThrow(
                            ProjectionStateMissing::new);

    store.upsert(
            current.withStatus(
                    "CONFIRMED",
                    event.aggregateRevision(),
                    clock.now()));

    return ProjectionResult.applied(
            event.eventId());
}
```


---

### 24. Projetar reagendamento

A projection atualiza janela, status, reserva e revisão; ela reflete um fato já decidido.

---

### 25. Projetar cancelamento

No cancelamento, cada view pode manter, remover ou historizar o item conforme seu propósito.

---

### 26. Read models múltiplos

Um evento pode atualizar várias views; evite um read model universal.

---

### 27. Mesma base de dados

CQRS pode usar tabelas de escrita e leitura no mesmo PostgreSQL, reduzindo complexidade, embora mantenha escala e operação acopladas.

---

### 28. Bancos separados

Stores separados fazem sentido com escala, busca ou isolamento distintos, mas adicionam consistência eventual, rebuild, duplicação e operação. Não comece por eles sem necessidade.

---

### 29. Projection síncrona

Fluxo:

```text
command;

Aggregate;

save;

projection update;

commit;

result.
```

A projection síncrona favorece leitura imediata, mas amplia a transação.

---

### 30. Projection assíncrona

Fluxo:

```text
command;

save;

commit;

event;

projection;

read model.
```

A projection assíncrona favorece escala, mas exige lag, ordering e recuperação.

Nesta aula, a versão assíncrona será simulada por fila em memória.

---

### 31. Criar consistency model

Arquivo:

```text
cqrs/CONSISTENCY_MODEL.md
```

Decisão do laboratório:

```text
Appointment Details:
síncrono no fluxo principal.

Operational Search:
pode ter lag curto.

Dashboards:
eventual consistency aceita.

Authorization:
nunca depende
de read model potencialmente stale
quando a decisão exige estado atual.

Domain invariants:
sempre no write model.
```

---

### 32. Criar consistency policy

Arquivo:

```text
contracts/consistency-policy.yaml
```

Conteúdo:

```yaml
consistency:
  domainInvariant:
    source:
      write-model

  authorizationCriticalState:
    source:
      write-model-or-strong-source

  appointmentDetails:
    target:
      immediate

  operationalSearch:
    maximumLagSeconds:
      5

  dashboard:
    maximumLagSeconds:
      60

  staleRead:
    behavior:
      documented
```

---

### 33. Projection Lag

```java
public record ProjectionLag(
        AppointmentRevision writeRevision,
        AppointmentRevision readRevision,
        Duration timeLag,
        boolean withinTarget) {
}
```

Calcule:

```text
revision lag;
time lag.
```


---

### 34. Criar lag policy

Arquivo:

```text
contracts/projection-lag-policy.yaml
```

Conteúdo:

```yaml
projectionLag:
  measures:
    - revision-lag
    - time-lag

  target:
    operationalSearchSeconds:
      5

  alert:
    whenTargetExceeded:
      required

  unknownCheckpoint:
    status:
      INCONCLUSIVE

  hiddenLag:
    forbidden
```

---

### 35. Read Your Writes

Após confirmar um Appointment, o usuário pode esperar ver `CONFIRMED` imediatamente.

Estratégias incluem projection síncrona, confirmação mínima, revisão mínima, polling ou UI otimista.


---

### 36. Criar read-your-writes policy

Arquivo:

```text
contracts/read-your-writes-policy.yaml
```

Conteúdo:

```yaml
readYourWrites:
  confirmAppointment:
    strategy:
      synchronous-projection

  rescheduleAppointment:
    strategy:
      wait-until-revision

  searchList:
    strategy:
      eventual-consistency

  timeout:
    required

  fallback:
    documented

  indefiniteWait:
    forbidden
```

---

### 37. Query por revisão mínima

```java
public record GetAppointmentDetails(
        AppointmentId appointmentId,
        Optional<AppointmentRevision> minimumRevision,
        Duration waitTimeout)
        implements Query<
                Optional<AppointmentDetailsView>> {
}
```

O handler pode aguardar até a projection alcançar a revisão.


---

### 38. Query não pode alterar negócio

Exemplos proibidos em Query Handler:

```java
appointment.markAsViewed();

repository.save(appointment);

eventPublisher.publish(...);

capacity.reserve(...);
```

Métricas técnicas podem existir fora do domínio; a query não muda negócio.

---

### 39. Query security

Read models denormalizados exigem autorização, tenant, escopo, mascaramento e limite de campos.


---

### 40. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

Conteúdo:

```yaml
querySecurity:
  requires:
    - actor-context
    - authorization
    - tenant-scope
    - field-filtering

  readModel:
    leastPrivilege:
      required

  denormalizedSensitiveData:
    forbiddenWithoutJustification

  cachedResult:
    authorizationAware:
      required
```

---

### 41. Projection failure

Falhas incluem evento inválido, store indisponível, ordering incorreta, duplicação, versão desconhecida e checkpoint inconsistente.


---

### 42. Atomicidade da projection

Ordem segura:

```text
aplicar alteração;
salvar read model;
salvar checkpoint;
commit.
```

Checkpoint salvo antes da view pode perder evento; salvo depois pode causar repetição, exigindo idempotência.

---

### 43. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  projectionStoreUnavailable:
    action:
      RETRY

  duplicateEvent:
    action:
      IDEMPOTENT_IGNORE

  olderAggregateRevision:
    action:
      IGNORE_AND_REPORT

  missingBaseProjection:
    action:
      REBUILD_OR_QUARANTINE

  unknownEventVersion:
    action:
      QUARANTINE

  checkpointFailure:
    action:
      RETRY_IDEMPOTENTLY

  EventSourcingDeepDive:
    deferredToLesson632

  EventDrivenArchitectureDeepDive:
    deferredToLesson633
```

---

### 44. Projection Checkpoint

```java
public interface ProjectionCheckpointStore {

    boolean wasProcessed(
            DomainEventId eventId);

    void markProcessed(
            DomainEventId eventId,
            AppointmentRevision revision,
            Instant projectedAt);

    Optional<ProjectionCheckpoint> latestFor(
            String projectionName);
}
```

Checkpoint controla processamento.

---

### 45. Rebuild

Rebuild significa reconstruir read models a partir de uma fonte confiável.

Fontes de rebuild podem ser eventos retidos, change log, snapshots ou tabelas de origem.

Nesta aula, o rebuild usará snapshots atuais do write model.


---

### 46. Criar Rebuilder

```java
public final class AppointmentProjectionRebuilder {

    private final AppointmentSnapshotSource source;
    private final AppointmentReadModelStore store;
    private final RebuildLock lock;

    public RebuildResult rebuild() {

        return lock.execute(
                "appointment-projection",
                () -> {

                    store.clearForRebuild();

                    int count = 0;

                    for (AppointmentSnapshot snapshot :
                            source.streamAll()) {

                        store.upsert(
                                map(snapshot));

                        count++;
                    }

                    return RebuildResult.success(
                            count);
                });
    }
}
```

---

### 47. Criar rebuild policy

Arquivo:

```text
contracts/rebuild-policy.yaml
```

Conteúdo:

```yaml
rebuild:
  source:
    trusted:
      required

  requires:
    - lock-or-versioned-switch
    - progress-report
    - failure-recovery
    - validation
    - security-review

  productionReadAvailability:
    strategy:
      shadow-build-and-switch

  destructiveClearWithoutBackup:
    forbidden

  EventStoreRequired:
    false
```

---

### 48. Shadow build

Shadow build cria uma nova projection, reconstrói, valida, troca o alias e preserva rollback.


---

### 49. Query Performance

Arquivo:

```text
cqrs/QUERY_PERFORMANCE.md
```

Registre:

- query;
- volume;
- filtros;
- sort;
- cardinalidade;
- índice;
- page size;
- timeout;
- cache;
- freshness;
- owner;
- SLO.


---

### 50. Evitar offset profundo

Para listas grandes, considere:

```text
keyset pagination.
```

Exemplo:

```text
scheduledStart;
appointmentId.
```

A escolha pertence ao Query Side.

---

### 51. Command Controller

```java
@RestController
final class AppointmentCommandController {

    private final ConfirmAppointmentHandler confirm;

    @PostMapping(
            "/appointments/{id}/confirmation")
    ResponseEntity<?> confirm(
            @PathVariable UUID id,
            @RequestBody ConfirmRequest request) {

        CommandResult result =
                confirm.handle(
                        mapper.toCommand(
                                id,
                                request));

        return presenter.from(result);
    }
}
```

---

### 52. Query Controller

```java
@RestController
final class AppointmentQueryController {

    private final SearchAppointmentsHandler search;

    @GetMapping("/appointments")
    QueryPage<AppointmentListItem> search(
            AppointmentSearchRequest request) {

        return search.handle(
                mapper.toQuery(request));
    }
}
```


---

### 53. CQRS sem framework

Você pode implementar CQRS apenas com:

- interfaces;
- classes;
- packages;
- convenções;
- testes arquiteturais.

Framework não cria a separação.

---

### 54. Evitar command bus genérico cedo

Um bus genérico pode esconder transação, autorização, idempotência, erro e fluxo.


---

### 55. Testar Command Side

`ScheduleAppointmentHandlerTest` valida:

- Aggregate criada;
- invariantes;
- expected revision;
- save;
- evento;
- resultado mínimo;
- nenhuma leitura projetada usada como verdade.

---

### 56. Testar Query Side

`SearchAppointmentsHandlerTest` valida:

- filtros;
- sort;
- paginação;
- shape;
- segurança;
- ausência de Repository de domínio;
- ausência de mutação.

---

### 57. Testar query sem mutação

```java
@Test
void queryMustNotMutateBusinessState() {

    AppointmentSnapshot before =
            writeStore.snapshot();

    queryHandler.handle(
            Fixtures.searchQuery());

    AppointmentSnapshot after =
            writeStore.snapshot();

    assertEquals(
            before,
            after);
}
```

---

### 58. Testar Projection Idempotency

Aplique o mesmo evento duas vezes.

Confirme:

- uma alteração;
- um checkpoint;
- duplicate report;
- mesma revisão;
- nenhum contador duplicado.

---

### 59. Testar ordering

Cenário:

```text
revision 5 chega;
revision 4 chega depois.
```

A projection deve:

- ignorar revisão antiga;
- registrar finding;
- não regredir o read model.

---

### 60. Testar lag

Simule fila:

1. command confirma;
2. evento fica pendente;
3. write revision = 3;
4. read revision = 2;
5. lag report fora do target;
6. dispatcher processa;
7. revisões convergem.

---

### 61. Testar Read Your Writes

Para confirmação síncrona:

- command termina;
- query retorna revisão confirmada.

Para busca eventual:

- command termina;
- lista pode permanecer antiga por um intervalo;
- contrato comunica freshness.

---

### 62. Testar rebuild

Confirme:

- store vazio é reconstruído;
- contagem correta;
- revisões preservadas;
- falha intermediária não troca a projection ativa;
- rebuild repetido produz mesmo resultado;
- dados inválidos são relatados.

---

### 63. Architecture Test

```java
@ArchTest
static final ArchRule querySideMustNotDependOnDomainAggregate =
        noClasses()
                .that()
                .resideInAPackage(
                        "..query..")
                .should()
                .dependOnClassesThat()
                .haveSimpleName(
                        "Appointment");
```

Não carregue a root para listagem.

---

### 64. Command independence

```java
@ArchTest
static final ArchRule commandSideMustNotDependOnReadModel =
        noClasses()
                .that()
                .resideInAPackage(
                        "..command..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..query.model..");
```

---

### 65. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  queryMutatesBusinessState:
    action:
      FAIL

  commandUsesReadModelAsAuthority:
    action:
      FAIL

  projectionRegressesRevision:
    action:
      FAIL

  duplicateEventDuplicatesData:
    action:
      FAIL

  checkpointBeforeProjection:
    action:
      FAIL

  hiddenProjectionLag:
    action:
      FAIL

  readModelWithoutOwner:
    action:
      FAIL
```

---

### 66. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson632:
    forbidden:
      - event-store
      - aggregate-replay
      - event-stream-as-source-of-truth
      - event-sourced-snapshot
      - historical-event-upcasting-deep-dive

  lesson633:
    forbidden:
      - broker-topology
      - consumer-group
      - dead-letter-queue
      - delivery-guarantee-deep-dive
      - event-choreography

  allowed:
    - in-memory-projection-queue
    - synchronous-projection
    - projection-lag-simulation
```

---

### 67. Validar Command Side

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-command-side.ps1
```

Confirme:

- commands;
- handlers;
- Aggregate;
- Domain Services;
- Repository;
- transação;
- revisão;
- ausência de read model como autoridade.

---

### 68. Validar Query Side

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-query-side.ps1
```

Confirme:

- queries;
- handlers;
- views;
- filtros;
- paginação;
- segurança;
- zero mutação;
- zero Aggregate para listagem.

---

### 69. Validar Read Models

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-read-models.ps1
```

Procure:

- owner ausente;
- freshness ausente;
- Entity de domínio;
- comportamento;
- dado sensível;
- shape universal;
- paginação ilimitada.

---

### 70. Validar Projections

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-projections.ps1
```

Confirme:

- idempotência;
- ordering;
- checkpoint;
- revisão;
- erro;
- rebuild;
- observabilidade;
- sem regra de domínio.

---

### 71. Validar Query Non-Mutation

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-query-non-mutation.ps1
```

Procure:

- save;
- update;
- publish;
- reserve;
- event recording;
- setter;
- transaction de negócio.

---

### 72. Validar Consistência

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-consistency-model.ps1
```

Confirme:

- fonte da verdade;
- strong reads;
- eventual reads;
- targets;
- stale behavior;
- autorização crítica;
- dashboards.

---

### 73. Validar Read Your Writes

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-read-your-writes.ps1
```

Confirme:

- estratégia por use case;
- revisão mínima;
- timeout;
- fallback;
- nenhuma espera infinita.

---

### 74. Validar Lag

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-projection-lag.ps1
```

Confirme:

- revision lag;
- time lag;
- target;
- alert;
- checkpoint;
- status inconclusivo.

---

### 75. Validar Rebuild

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-rebuild-policy.ps1
```

Confirme:

- fonte confiável;
- lock ou shadow build;
- progresso;
- validação;
- rollback;
- segurança;
- sem Event Store obrigatório.

---

### 76. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-cqrs\run-cqrs-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- command handlers;
- query handlers;
- query non-mutation;
- projection;
- idempotência;
- ordering;
- lag;
- read-your-writes;
- rebuild;
- arquitetura.

---

### 77. Criar Reports

Exemplo:

```yaml
cqrs:
  commandHandlers:
    4

  queryHandlers:
    3

  readModels:
    3

  projections:
    1

  queryMutations:
    0

  commandsUsingReadModelAsAuthority:
    0

  duplicateProjectionWrites:
    0

  projectionLagSeconds:
    2

  lagTargetSeconds:
    5

  result:
    PASS
```

---

### 78. Criar Gate

O gate valida adoção, Command Side, Query Side, handlers, read models, projections, consistência, lag, rebuild, segurança, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_ADOPTION_DECISION;

FAIL_COMMAND_SIDE;

FAIL_QUERY_SIDE;

FAIL_QUERY_MUTATION;

FAIL_READ_MODEL;

FAIL_PROJECTION;

FAIL_IDEMPOTENCY;

FAIL_ORDERING;

FAIL_CONSISTENCY;

FAIL_READ_YOUR_WRITES;

FAIL_LAG;

FAIL_REBUILD;

FAIL_SECURITY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 79. Coletar Evidence

Arquivo:

```text
contracts/cqrs-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- command handler count;
- query handler count;
- read model count;
- projection count;
- command side status;
- query side status;
- query mutation count;
- projection idempotency status;
- ordering status;
- checkpoint status;
- consistency status;
- read-your-writes status;
- revision lag;
- time lag;
- rebuild status;
- security status;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- queries reais de produção;
- connection strings;
- Event Store;
- broker real;
- payloads reais;
- Event Sourcing aprofundado;
- arquitetura orientada a eventos aprofundada.

---

### 80. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-cqrs-contract.ps1

.\scripts\m19\service-scheduling-cqrs\validate-command-side.ps1

.\scripts\m19\service-scheduling-cqrs\validate-query-side.ps1

.\scripts\m19\service-scheduling-cqrs\validate-read-models.ps1

.\scripts\m19\service-scheduling-cqrs\validate-projections.ps1

.\scripts\m19\service-scheduling-cqrs\validate-query-non-mutation.ps1

.\scripts\m19\service-scheduling-cqrs\validate-consistency-model.ps1

.\scripts\m19\service-scheduling-cqrs\validate-read-your-writes.ps1

.\scripts\m19\service-scheduling-cqrs\validate-projection-lag.ps1

.\scripts\m19\service-scheduling-cqrs\validate-rebuild-policy.ps1

.\scripts\m19\service-scheduling-cqrs\run-cqrs-tests.ps1

.\scripts\m19\service-scheduling-cqrs\collect-cqrs-evidence.ps1

.\scripts\m19\service-scheduling-cqrs\verify-cqrs-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 81. Encerrar o laboratório

Confirme:

- decisão de adoção documentada;
- Command Side explícito;
- Query Side explícito;
- commands não representam queries;
- queries não alteram negócio;
- write model protege invariantes;
- read models atendem consumidores;
- read model não é fonte de verdade para commands;
- projections idempotentes;
- revisões não regridem;
- checkpoints existem;
- lag é observável;
- read-your-writes possui estratégia;
- segurança existe na leitura;
- rebuild possui política;
- mesmo banco continua permitido;
- Event Store não foi criado;
- broker não foi usado;
- Event Sourcing não foi antecipado;
- arquitetura orientada a eventos não foi aprofundada;
- reports sanitizados.

---

## Entendendo o que foi feito

### A separação ganhou propósito

Commands preservaram invariantes e concorrência no write model; queries passaram a usar views próprias sem carregar Aggregates.

### Projections ganharam contrato

Idempotência, ordering, checkpoint, lag e falhas ficaram explícitos.

### A consistência ganhou decisão

Cada consulta passou a definir freshness, read-your-writes e segurança.

### O rebuild ganhou proteção

Read models tornaram-se reconstruíveis sem exigir Event Sourcing ou dois bancos.

---

## Erros comuns importantes

### Aplicar CQRS em todo CRUD

A complexidade supera o benefício.

### Usar read model como autoridade

Invariantes podem usar dado stale.

### Carregar Aggregate para listagem

A leitura fica cara e acoplada.

### Colocar regra na projection

Write e read models podem divergir.

### Query alterar negócio

A separação semântica é quebrada.

### Ignorar idempotência, ordering ou lag

Duplicações, regressões e dados antigos ficam invisíveis.

### Confundir CQRS com Event Sourcing

São padrões independentes.

---

## Comandos úteis

### Validar Command Side

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-command-side.ps1
```

### Validar Query Side

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-query-side.ps1
```

### Validar Projections

```powershell
.\scripts\m19\service-scheduling-cqrs\validate-projections.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-cqrs\run-cqrs-tests.ps1
```

### Verificar Gate

```powershell
.\scripts\m19\service-scheduling-cqrs\verify-cqrs-gate.ps1
```

---

## Exercício guiado

Justifique CQRS, implemente Command Side e Query Side, projete eventos em views, proteja idempotência e ordering, classifique consistência, defina read-your-writes, execute rebuild e valide o gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 630 e ponte para a aula 632 foram preservadas;
- o laboratório `service-scheduling-cqrs` foi criado;
- CQRS Charter foi criado;
- decisão de adoção foi documentada;
- separação mínima, intermediária e avançada foram diferenciadas;
- CQRS não foi tratado como sinônimo de dois bancos;
- CQRS não foi tratado como sinônimo de Event Sourcing;
- Command Side possui commands e handlers explícitos;
- Command Side usa Aggregate Root e Domain Services;
- write model continua fonte de invariantes;
- expected revision continua no command flow;
- command result é mínimo e estável;
- Query Side possui queries e handlers explícitos;
- queries não alteram estado observável;
- Query Side não salva Aggregate;
- listagens não carregam Aggregate Root;
- read models são orientados ao consumidor;
- paginação, filtros e ordenação pertencem à leitura;
- AppointmentReadModelStore foi separado do Repository;
- projection reage a eventos;
- projection é idempotente;
- event ID é usado contra duplicação;
- Aggregate Revision impede regressão;
- checkpoint é salvo depois da alteração;
- falha de checkpoint pode ser repetida com segurança;
- consistency model foi documentado;
- leituras críticas não usam dado stale como autoridade;
- projection lag mede revisão e tempo;
- target de lag foi definido;
- read-your-writes possui estratégia e timeout;
- query security foi documentada;
- rebuild usa fonte confiável;
- rebuild não exige Event Store;
- shadow build foi documentado;
- tests cobrem command, query, projection, lag e rebuild;
- architecture tests protegem dependências;
- Event Sourcing não foi implementado;
- broker não foi utilizado;
- arquitetura orientada a eventos não foi aprofundada;
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
  labs/m19/aula-631-cqrs/service-scheduling-cqrs `
  scripts/m19/service-scheduling-cqrs `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|connectionString|EventStore|aggregateReplay|KafkaTemplate|RabbitTemplate|consumerGroup|eventSourcingDeepDive|eventDrivenArchitectureDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar CQRS"
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
- queries reais de produção;
- Event Store;
- broker real;
- Event Sourcing aprofundado;
- arquitetura orientada a eventos aprofundada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou CQRS.

Você criou charter, decisão de adoção, lados de command e query, handlers, read models, projections, checkpoints, consistência, lag, rebuild e testes arquiteturais.

Você comprovou que CQRS separa mudança e leitura, preserva invariantes no write model e exige projections idempotentes, freshness explícita, lag observável e rebuild seguro.

A próxima aula será:

```text
632 - M19.22 - Event Sourcing conceitual
```

Nela, você irá aprofundar o que muda quando eventos passam a ser a fonte de verdade, como streams reconstroem Aggregates, quais são os custos de evolução, replay, snapshotting, auditoria e operação.

Nenhuma implementação de Event Sourcing ou arquitetura orientada a eventos foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Documentei a decisão de CQRS.
- [ ] Separei commands e queries.
- [ ] Mantive invariantes no write model.
- [ ] Criei read models específicos.
- [ ] Implementei projection idempotente.
- [ ] Defini consistency model.
- [ ] Modelei read-your-writes.
- [ ] Testei lag e rebuild.

---

## Troubleshooting adicional

### A query precisa da Aggregate Root

Revise se precisa de comportamento ou apenas de dados projetados.

### O command consulta um dashboard

Não use read model stale para proteger invariante.

### A projection duplicou itens

Adicione deduplicação por event ID.

### A revisão da view regrediu

Ignore eventos antigos e registre finding.

### O usuário não vê a própria alteração

Defina projection síncrona, revisão mínima ou polling.

### O rebuild deixa a tela indisponível

Use shadow build e troca controlada.

### A projection contém regras de negócio

Mova decisões para write model e projete apenas fatos.

### O Query Handler salva dados

Separe telemetria técnica de estado de negócio.

### A equipe quer dois bancos imediatamente

Comece com separação lógica e meça necessidade.

### O laboratório começou a criar Event Store

Preserve Event Sourcing para a aula 632.

---

## Perguntas de revisão

1. O que significa CQRS?
2. Qual responsabilidade de um command?
3. Qual responsabilidade de uma query?
4. O que é write model?
5. O que é read model?
6. O que é projection?
7. O que é projection checkpoint?
8. O que é projection lag?
9. O que é read-your-writes?
10. Query pode mudar estado de negócio?
11. Read model pode ser fonte de invariante?
12. CQRS exige dois bancos?
13. CQRS exige Event Sourcing?
14. Por que projection precisa ser idempotente?
15. Como evitar regressão da view?
16. O que é rebuild?
17. Rebuild exige Event Store?
18. Quando CQRS não vale a pena?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Command Query Responsibility Segregation.
2. Tentar alterar o estado.
3. Obter informação sem mudança observável.
4. Modelo orientado a regras e mudanças.
5. Modelo orientado a leitura.
6. Transformação de fatos em views.
7. Posição processada por uma projection.
8. Diferença entre escrita e leitura.
9. Ver a própria mudança rapidamente.
10. Não.
11. Não quando pode estar stale.
12. Não.
13. Não.
14. Para tolerar duplicação.
15. Comparar Aggregate Revision.
16. Reconstrução de read model.
17. Não.
18. Quando as necessidades são simples e iguais.
19. Event Sourcing conceitual.
20. Event Sourcing conceitual.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 631 - M19.21 - CQRS

- Aprofundei CQRS.
- Criei o laboratório `service-scheduling-cqrs`.
- Criei CQRS Charter e decisão de adoção.
- Diferenciei separação mínima, intermediária e avançada.
- Mantive Command Side orientado a Aggregate Root e invariantes.
- Criei commands e command handlers explícitos.
- Mantive expected revision e concorrência otimista.
- Modelei command results mínimos.
- Criei Query Side independente.
- Criei queries e query handlers.
- Modelei read models orientados a consumidores.
- Separei AppointmentReadModelStore de AppointmentRepository.
- Mantive listagens sem carregar Aggregates.
- Criei projection baseada em Domain Events.
- Implementei idempotência por event ID.
- Impedi regressão por Aggregate Revision.
- Criei projection checkpoint.
- Documentei projection síncrona e assíncrona.
- Criei consistency model por consulta.
- Modelei read-your-writes com timeout.
- Medi projection lag por revisão e tempo.
- Documentei segurança de read models.
- Criei rebuild com fonte confiável e shadow build.
- Criei testes de command, query, projection, lag e rebuild.
- Criei architecture tests, reports, gate e evidence.
- Não antecipei Event Sourcing ou arquitetura orientada a eventos.
- Próxima aula: Event Sourcing conceitual.
```

---

## Referência técnica curta

- CQRS.
- Command Side.
- Query Side.
- Write Model.
- Read Model.
- Projection.
- Projection Checkpoint.
- Projection Lag.
- Read Your Writes.
- Rebuild.

Regra final:

```text
CQRS deve separar responsabilidades de mudança e leitura somente quando essa diferença gera valor: commands e command handlers usam Aggregate Root, Domain Services, Repository, transação e expected revision para proteger invariantes, enquanto queries e query handlers usam read models orientados ao consumidor, com filtros, paginação, ordenação e segurança, sem alterar estado de negócio ou carregar Aggregates para listagens; projections transformam fatos em views e precisam ser idempotentes por event ID, impedir regressão por Aggregate Revision, salvar checkpoint depois da alteração, expor falhas, medir revision lag e time lag e possuir política de rebuild; o write model permanece fonte de verdade para decisões críticas, cada consulta define freshness e read-your-writes, e bancos separados, mensageria e consistência eventual são opções, não requisitos; rebuild pode usar snapshots confiáveis e shadow build sem Event Store, e CQRS pode existir na mesma aplicação e no mesmo banco; o gate termina com decisão de adoção, Command Side, Query Side, read models, projections, consistency model, read-your-writes, lag, rebuild, segurança, testes, arquitetura, documentação e evidence aprovados, enquanto Event Sourcing conceitual é aprofundado somente na aula 632 e arquitetura orientada a eventos permanece reservada à aula 633.
```
