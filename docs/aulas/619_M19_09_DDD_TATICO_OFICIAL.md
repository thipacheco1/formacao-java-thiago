# 619 - M19.09 - DDD tatico

## Apresentação da aula

Na aula 618, você aplicou DDD estratégico ao domínio de agendamento de serviços.

Você analisou:

```text
capacidades de negócio;

subdomínios;

core domain;

supporting subdomains;

generic subdomains;

bounded contexts candidatos;

context map;

upstream e downstream;

ownership;

data ownership;

ACL;

published language;

riscos;

plano de evolução.
```

A principal decisão foi tratar:

```text
Service Scheduling
```

como o core domain inicial.

Esse contexto é responsável por assumir e manter compromissos de atendimento.

Agora surge uma nova pergunta:

```text
como transformar
as decisões estratégicas

em um modelo de código

capaz de proteger
regras,
identidades,
estados
e transações?
```

Essa é a entrada para o DDD tático.

DDD tático oferece padrões para modelar o interior de um bounded context.

Os principais padrões desta aula serão:

- Entity;
- Value Object;
- Aggregate;
- Aggregate Root;
- Repository;
- Factory;
- Domain Service;
- Domain Event;
- Specification;
- Application Service;
- invariantes;
- consistência transacional;
- identidade;
- igualdade;
- encapsulamento;
- testes de domínio.

O objetivo não é usar todos os padrões em todas as classes.

Cada padrão responde a uma necessidade.

Exemplos:

```text
um conceito possui identidade
e continua sendo o mesmo
ao longo do tempo?
Entity.

um conceito é definido
somente por seus valores?
Value Object.

um conjunto precisa manter
invariantes em uma transação?
Aggregate.

quem pode controlar mudanças
dentro desse conjunto?
Aggregate Root.

como recuperar e salvar
um aggregate?
Repository.

a criação válida
é complexa?
Factory.

uma regra pertence ao domínio,
mas não se encaixa naturalmente
em uma entity?
Domain Service.

algo relevante aconteceu
no domínio?
Domain Event.
```

O laboratório será:

```text
labs/m19/aula-619-ddd-tatico/service-scheduling-domain
```

Você modelará o interior do:

```text
Service Scheduling Context.
```

O aggregate principal será:

```text
ServiceAppointment.
```

Ele representará um compromisso de atendimento.

O aggregate controlará:

- criação;
- confirmação;
- reagendamento;
- cancelamento;
- histórico de janelas;
- motivo de reagendamento;
- regras de estado;
- eventos de domínio.

O modelo também terá Value Objects como:

- `AppointmentId`;
- `ServiceRequestId`;
- `AppointmentWindow`;
- `ServiceAreaCode`;
- `RescheduleReason`;
- `CancellationReason`.

O repositório será definido pela linguagem do domínio:

```text
ServiceAppointmentRepository.
```

A implementação será em memória para manter o foco no modelo.

A criação será coordenada por:

```text
ServiceAppointmentFactory.
```

Uma regra que combina dados externos ao aggregate será demonstrada por:

```text
SchedulingEligibilityService.
```

Eventos serão registrados como:

- `AppointmentScheduled`;
- `AppointmentConfirmed`;
- `AppointmentRescheduled`;
- `AppointmentCancelled`.

A próxima aula oficial será:

```text
620 - M19.10 - Ubiquitous Language
```

Na aula 620, você irá aprofundar como linguagem, conversas, documentação, código, testes e contratos permanecem alinhados continuamente.

Por isso, esta aula usará os termos já aprovados, mas não executará ainda o laboratório completo de governança da linguagem.

A aula 621 será:

```text
621 - M19.11 - Bounded Context
```

Nela, bounded contexts serão aprofundados de forma dedicada.

Nesta aula, o contexto estratégico já escolhido será apenas a fronteira de trabalho.

Não será criado um novo context map completo.

Também não será implementado:

- Event Sourcing;
- CQRS;
- saga;
- mensageria distribuída;
- microservices;
- persistência JPA real;
- transação distribuída;
- integração com sistemas externos.

A regra central será:

```text
o modelo tático
deve proteger
as invariantes do domínio

e impedir que
qualquer código externo
altere estado
de forma inválida.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
617:
DDD fundamentos.

618:
DDD estrategico.

619:
DDD tatico.

620:
Ubiquitous Language.

621:
Bounded Context.
```

A progressão é:

```text
descobrir conhecimento;

definir fronteiras;

modelar dentro da fronteira;

aprofundar linguagem;

aprofundar contextos.
```

Nesta aula:

```text
Entity:
sim.

Value Object:
sim.

Aggregate:
sim.

Aggregate Root:
sim.

Repository:
sim.

Factory:
sim.

Domain Service:
sim.

Domain Event:
sim.

Specification:
sim.

Application Service:
sim.

JPA:
não.

Event Sourcing:
não.

CQRS:
não.

laboratório dedicado de linguagem:
não.

laboratório dedicado de bounded context:
não.
```

O laboratório será Java puro no núcleo.

Spring poderá aparecer apenas na composição e no application service.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-619-ddd-tatico/service-scheduling-domain
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/servicescheduling
│   │           ├── domain
│   │           │   ├── model
│   │           │   │   ├── ServiceAppointment.java
│   │           │   │   ├── AppointmentId.java
│   │           │   │   ├── ServiceRequestId.java
│   │           │   │   ├── AppointmentWindow.java
│   │           │   │   ├── ServiceAreaCode.java
│   │           │   │   ├── AppointmentStatus.java
│   │           │   │   ├── RescheduleReason.java
│   │           │   │   ├── CancellationReason.java
│   │           │   │   └── AppointmentHistoryEntry.java
│   │           │   ├── event
│   │           │   │   ├── DomainEvent.java
│   │           │   │   ├── AppointmentScheduled.java
│   │           │   │   ├── AppointmentConfirmed.java
│   │           │   │   ├── AppointmentRescheduled.java
│   │           │   │   └── AppointmentCancelled.java
│   │           │   ├── repository
│   │           │   │   └── ServiceAppointmentRepository.java
│   │           │   ├── factory
│   │           │   │   └── ServiceAppointmentFactory.java
│   │           │   ├── service
│   │           │   │   └── SchedulingEligibilityService.java
│   │           │   ├── specification
│   │           │   │   └── AppointmentCanBeRescheduled.java
│   │           │   └── exception
│   │           │       ├── DomainException.java
│   │           │       ├── InvalidAppointmentTransition.java
│   │           │       └── AppointmentNotFound.java
│   │           ├── application
│   │           │   ├── ScheduleAppointmentApplicationService.java
│   │           │   ├── ConfirmAppointmentApplicationService.java
│   │           │   ├── RescheduleAppointmentApplicationService.java
│   │           │   ├── CancelAppointmentApplicationService.java
│   │           │   ├── command
│   │           │   └── result
│   │           └── infrastructure
│   │               ├── persistence
│   │               │   └── InMemoryServiceAppointmentRepository.java
│   │               ├── events
│   │               │   └── CapturingDomainEventPublisher.java
│   │               └── configuration
│   │                   └── SchedulingDomainConfiguration.java
│   └── test
│       └── java
│           └── br/com/formacao/servicescheduling
│               ├── domain
│               │   ├── ServiceAppointmentTest.java
│               │   ├── AppointmentWindowTest.java
│               │   ├── ServiceAppointmentFactoryTest.java
│               │   ├── SchedulingEligibilityServiceTest.java
│               │   └── AppointmentCanBeRescheduledTest.java
│               ├── application
│               │   ├── ScheduleAppointmentApplicationServiceTest.java
│               │   └── RescheduleAppointmentApplicationServiceTest.java
│               ├── infrastructure
│               │   └── InMemoryServiceAppointmentRepositoryTest.java
│               └── architecture
│                   └── TacticalDDDArchitectureTest.java
├── contracts
│   ├── ddd-tactical-contract.yaml
│   ├── entity-policy.yaml
│   ├── value-object-policy.yaml
│   ├── aggregate-policy.yaml
│   ├── repository-policy.yaml
│   ├── factory-policy.yaml
│   ├── domain-service-policy.yaml
│   ├── domain-event-policy.yaml
│   ├── application-service-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── docs
│   ├── TACTICAL_MODEL_OVERVIEW.md
│   ├── AGGREGATE_BOUNDARY.md
│   ├── INVARIANT_CATALOG.md
│   ├── ENTITY_AND_VALUE_OBJECT_DECISIONS.md
│   ├── REPOSITORY_CONTRACT.md
│   ├── DOMAIN_EVENTS.md
│   ├── APPLICATION_FLOW.md
│   ├── TEST_STRATEGY.md
│   └── TROUBLESHOOTING.md
└── reports
    ├── entity-report.yaml
    ├── value-object-report.yaml
    ├── aggregate-report.yaml
    ├── repository-report.yaml
    ├── domain-event-report.yaml
    ├── application-service-report.yaml
    └── ddd-tactical-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-domain
├── validate-ddd-tactical-contract.ps1
├── validate-domain-entities.ps1
├── validate-value-objects.ps1
├── validate-aggregate-boundaries.ps1
├── validate-domain-invariants.ps1
├── validate-repository-contracts.ps1
├── validate-domain-events.ps1
├── validate-application-services.ps1
├── run-ddd-tactical-tests.ps1
├── collect-ddd-tactical-evidence.ps1
└── verify-ddd-tactical-gate.ps1
```

---

## Conceito essencial

### Entity

Objeto definido por identidade contínua, mesmo quando seus atributos mudam.

---

### Value Object

Objeto definido por seus valores, normalmente imutável e sem identidade própria.

---

### Aggregate

Conjunto de objetos tratado como uma unidade de consistência.

---

### Aggregate Root

Entity que controla o acesso e as mudanças dentro do aggregate.

---

### Invariante

Regra que deve permanecer verdadeira antes e depois de uma operação válida.

---

### Repository

Contrato orientado ao domínio para recuperar e persistir aggregates.

---

### Factory

Componente que encapsula uma criação complexa e válida.

---

### Domain Service

Operação de domínio que não pertence naturalmente a uma única entity ou value object.

---

### Domain Event

Registro imutável de algo relevante que aconteceu no domínio.

---

### Specification

Objeto que representa uma regra ou critério combinável.

---

### Application Service

Componente que coordena caso de uso, transação, repository e publicação de eventos.

---

### Identity

Elemento que permite reconhecer a continuidade de uma entity.

---

### Equality

Critério usado para comparar objetos.

Entities são comparadas pela identidade.

Value Objects são comparados por seus valores.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-619-ddd-tatico/service-scheduling-domain

Set-Location `
  labs/m19/aula-619-ddd-tatico/service-scheduling-domain
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/ddd-tactical-contract.yaml
```

Conteúdo:

```yaml
dddTactical:
  context:
    Service-Scheduling

  required:
    - entities
    - value-objects
    - aggregate-root
    - invariants
    - repository
    - factory
    - domain-service
    - domain-events
    - application-services
    - tests
    - architecture-rules

  forbidden:
    - public-state-mutation
    - repository-per-entity
    - domain-depending-on-framework
    - aggregate-cross-reference-by-object
    - anemic-domain-model
    - premature-event-sourcing

  nextLesson:
    code:
      M19.10
```

---

### 3. Criar IDs como Value Objects

```java
public record AppointmentId(
        UUID value) {

    public AppointmentId {
        Objects.requireNonNull(
                value,
                "Appointment id is required");
    }

    public static AppointmentId from(
            UUID value) {

        return new AppointmentId(value);
    }
}
```

Crie também:

```java
public record ServiceRequestId(
        UUID value) {
}
```

Esses tipos impedem misturar IDs semanticamente diferentes.

---

### 4. Criar policy de Value Objects

Arquivo:

```text
contracts/value-object-policy.yaml
```

Conteúdo:

```yaml
valueObject:
  required:
    - value-based-equality
    - immutability
    - validation-at-construction
    - domain-name

  forbidden:
    - public-setter
    - persistence-identity
    - mutable-collection
    - invalid-state-after-construction
```

---

### 5. Criar `ServiceAreaCode`

```java
public record ServiceAreaCode(
        String value) {

    public ServiceAreaCode {

        if (value == null
                || value.isBlank()) {
            throw new DomainException(
                    "Service area code is required");
        }

        value = value.trim()
                .toUpperCase(
                        Locale.ROOT);
    }
}
```

O objeto centraliza normalização e validade.

---

### 6. Criar `AppointmentWindow`

```java
public record AppointmentWindow(
        Instant startsAt,
        Instant endsAt) {

    public AppointmentWindow {

        Objects.requireNonNull(
                startsAt,
                "startsAt is required");

        Objects.requireNonNull(
                endsAt,
                "endsAt is required");

        if (!endsAt.isAfter(startsAt)) {
            throw new DomainException(
                    "Appointment window end must be after start");
        }
    }

    public Duration duration() {
        return Duration.between(
                startsAt,
                endsAt);
    }

    public boolean overlaps(
            AppointmentWindow other) {

        return startsAt.isBefore(
                       other.endsAt())
                && endsAt.isAfter(
                       other.startsAt());
    }
}
```

O Value Object contém comportamento relacionado ao conceito.

---

### 7. Criar motivos como Value Objects

```java
public record RescheduleReason(
        String value) {

    public RescheduleReason {

        if (value == null
                || value.isBlank()) {
            throw new DomainException(
                    "Reschedule reason is required");
        }

        if (value.length() > 200) {
            throw new DomainException(
                    "Reschedule reason is too long");
        }
    }
}
```

Crie `CancellationReason` separadamente.

Mesmo que ambos armazenem texto, possuem significados diferentes.

---

### 8. Criar Entity policy

Arquivo:

```text
contracts/entity-policy.yaml
```

Conteúdo:

```yaml
entity:
  identity:
    required

  equality:
    basedOnIdentity:
      required

  behavior:
    domainFocused:
      required

  stateMutation:
    onlyThroughBehavior:
      required

  forbidden:
    - public-setter
    - framework-annotation
    - DTO-responsibility
    - technical-identity
```

---

### 9. Criar status

```java
public enum AppointmentStatus {
    SCHEDULED,
    CONFIRMED,
    CANCELLED
}
```

`EXECUTED` não será incluído porque execução pertence ao contexto `Field Execution`.

Essa decisão vem da aula estratégica.

---

### 10. Definir invariantes

Arquivo:

```text
docs/INVARIANT_CATALOG.md
```

Invariantes:

```text
INV-001:
um compromisso possui ID.

INV-002:
um compromisso pertence
a uma solicitação.

INV-003:
a janela possui início
anterior ao fim.

INV-004:
somente SCHEDULED
pode ser confirmado.

INV-005:
somente compromisso ativo
pode ser reagendado.

INV-006:
reagendamento exige motivo.

INV-007:
cancelamento exige motivo.

INV-008:
compromisso cancelado
não pode mudar novamente.

INV-009:
histórico preserva janelas anteriores.

INV-010:
mudanças geram eventos do domínio.
```

---

### 11. Criar Aggregate Root

```java
public final class ServiceAppointment {

    private final AppointmentId id;
    private final ServiceRequestId serviceRequestId;
    private final ServiceAreaCode serviceAreaCode;
    private final Instant createdAt;

    private AppointmentWindow currentWindow;
    private AppointmentStatus status;

    private final List<AppointmentHistoryEntry>
            history;

    private final List<DomainEvent>
            domainEvents;

    private ServiceAppointment(
            AppointmentId id,
            ServiceRequestId serviceRequestId,
            ServiceAreaCode serviceAreaCode,
            AppointmentWindow currentWindow,
            Instant createdAt) {

        this.id = require(id);
        this.serviceRequestId = require(serviceRequestId);
        this.serviceAreaCode = require(serviceAreaCode);
        this.currentWindow = require(currentWindow);
        this.createdAt = require(createdAt);
        this.status = AppointmentStatus.SCHEDULED;
        this.history = new ArrayList<>();
        this.domainEvents = new ArrayList<>();
    }
}
```

O construtor permanece privado.

A criação será controlada.

---

### 12. Criar operação de agendamento

```java
static ServiceAppointment schedule(
        AppointmentId id,
        ServiceRequestId serviceRequestId,
        ServiceAreaCode serviceAreaCode,
        AppointmentWindow window,
        Instant occurredAt) {

    ServiceAppointment appointment =
            new ServiceAppointment(
                    id,
                    serviceRequestId,
                    serviceAreaCode,
                    window,
                    occurredAt);

    appointment.record(
            new AppointmentScheduled(
                    id,
                    serviceRequestId,
                    window,
                    occurredAt));

    return appointment;
}
```

O evento registra o fato ocorrido.

---

### 13. Criar confirmação

```java
public void confirm(
        Instant occurredAt) {

    if (status != AppointmentStatus.SCHEDULED) {
        throw new InvalidAppointmentTransition(
                status,
                "confirm");
    }

    status = AppointmentStatus.CONFIRMED;

    record(
            new AppointmentConfirmed(
                    id,
                    occurredAt));
}
```

Nenhum código externo altera o status diretamente.

---

### 14. Criar histórico

```java
public record AppointmentHistoryEntry(
        AppointmentWindow previousWindow,
        AppointmentWindow newWindow,
        RescheduleReason reason,
        Instant changedAt) {
}
```

Esse tipo é Value Object interno ao aggregate.

---

### 15. Criar reagendamento

```java
public void reschedule(
        AppointmentWindow newWindow,
        RescheduleReason reason,
        Instant occurredAt) {

    ensureActive();

    if (currentWindow.equals(newWindow)) {
        throw new DomainException(
                "New window must be different");
    }

    AppointmentWindow previous =
            currentWindow;

    currentWindow =
            newWindow;

    status =
            AppointmentStatus.SCHEDULED;

    history.add(
            new AppointmentHistoryEntry(
                    previous,
                    newWindow,
                    reason,
                    occurredAt));

    record(
            new AppointmentRescheduled(
                    id,
                    previous,
                    newWindow,
                    reason,
                    occurredAt));
}
```

Reagendar um compromisso confirmado retorna o estado para `SCHEDULED`, exigindo nova confirmação.

Essa regra precisa estar documentada e testada.

---

### 16. Criar cancelamento

```java
public void cancel(
        CancellationReason reason,
        Instant occurredAt) {

    ensureActive();

    status =
            AppointmentStatus.CANCELLED;

    record(
            new AppointmentCancelled(
                    id,
                    reason,
                    occurredAt));
}
```

---

### 17. Proteger coleções

```java
public List<AppointmentHistoryEntry> history() {
    return List.copyOf(history);
}
```

Nunca devolva a coleção mutável interna.

---

### 18. Definir igualdade de Entity

```java
@Override
public boolean equals(
        Object other) {

    if (this == other) {
        return true;
    }

    if (!(other instanceof ServiceAppointment that)) {
        return false;
    }

    return id.equals(that.id);
}

@Override
public int hashCode() {
    return id.hashCode();
}
```

A igualdade usa identidade.

---

### 19. Criar Aggregate policy

Arquivo:

```text
contracts/aggregate-policy.yaml
```

Conteúdo:

```yaml
aggregate:
  root:
    ServiceAppointment

  transactionBoundary:
    oneAggregate:
      preferred

  internalMutation:
    throughRoot:
      required

  externalReference:
    byIdentity:
      required

  invariants:
    protectedInsideAggregate:
      required

  forbidden:
    - direct-child-mutation
    - public-mutable-collection
    - aggregate-object-reference-to-another-aggregate
    - repository-for-internal-value-object
```

---

### 20. Escolher boundary do aggregate

Dentro de `ServiceAppointment`:

- status;
- janela atual;
- histórico de reagendamentos;
- eventos pendentes.

Fora do aggregate:

- solicitação completa;
- capacidade;
- cliente;
- execução de campo;
- notificação.

Esses elementos são referenciados por ID ou contrato.

Um aggregate não precisa conter tudo que participa do processo.

---

### 21. Criar Domain Event base

```java
public interface DomainEvent {

    Instant occurredAt();
}
```

Eventos serão records imutáveis.

---

### 22. Criar evento de confirmação

```java
public record AppointmentConfirmed(
        AppointmentId appointmentId,
        Instant occurredAt)
        implements DomainEvent {

    public AppointmentConfirmed {
        Objects.requireNonNull(appointmentId);
        Objects.requireNonNull(occurredAt);
    }
}
```

---

### 23. Registrar eventos no aggregate

```java
private void record(
        DomainEvent event) {

    domainEvents.add(
            Objects.requireNonNull(event));
}

public List<DomainEvent> pullDomainEvents() {

    List<DomainEvent> copy =
            List.copyOf(domainEvents);

    domainEvents.clear();

    return copy;
}
```

O método `pullDomainEvents` entrega e limpa os eventos.

A publicação será responsabilidade da camada de aplicação.

---

### 24. Criar Domain Event policy

Arquivo:

```text
contracts/domain-event-policy.yaml
```

Conteúdo:

```yaml
domainEvent:
  represents:
    pastFact:
      required

  required:
    - domain-name
    - immutable-data
    - occurred-at
    - aggregate-identity

  forbidden:
    - command-name
    - framework-event-type
    - mutable-entity-reference
    - technical-payload

  publishing:
    afterSuccessfulPersistence:
      required
```

---

### 25. Criar Repository

```java
public interface ServiceAppointmentRepository {

    Optional<ServiceAppointment> findById(
            AppointmentId appointmentId);

    ServiceAppointment save(
            ServiceAppointment appointment);

    boolean existsActiveFor(
            ServiceRequestId serviceRequestId);
}
```

O repositório opera com o aggregate root.

Não crie repository para cada Value Object.

---

### 26. Criar Repository policy

Arquivo:

```text
contracts/repository-policy.yaml
```

Conteúdo:

```yaml
repository:
  aggregateRoot:
    ServiceAppointment

  language:
    domainFocused:
      required

  implementation:
    outsideDomain:
      required

  forbidden:
    - generic-base-repository-in-domain
    - framework-type-in-signature
    - repository-per-value-object
    - persistence-record-return
```

---

### 27. Criar implementação em memória

```java
public final class InMemoryServiceAppointmentRepository
        implements ServiceAppointmentRepository {

    private final Map<AppointmentId, ServiceAppointment>
            storage =
            new ConcurrentHashMap<>();

    @Override
    public Optional<ServiceAppointment> findById(
            AppointmentId appointmentId) {

        return Optional.ofNullable(
                storage.get(appointmentId));
    }

    @Override
    public ServiceAppointment save(
            ServiceAppointment appointment) {

        storage.put(
                appointment.id(),
                appointment);

        return appointment;
    }
}
```

Em um laboratório maior, seria útil copiar snapshots para evitar mutação compartilhada.

Registre essa limitação.

---

### 28. Criar Factory

A criação exige:

- ID;
- solicitação;
- área;
- janela;
- horário;
- elegibilidade;
- inexistência de compromisso ativo.

```java
public final class ServiceAppointmentFactory {

    private final SchedulingEligibilityService
            eligibility;

    private final AppointmentIdGenerator
            idGenerator;

    private final CurrentTimeProvider
            currentTime;

    public ServiceAppointment create(
            ServiceRequestSnapshot request,
            AppointmentWindow window) {

        eligibility.ensureEligible(
                request,
                window);

        return ServiceAppointment.schedule(
                idGenerator.next(),
                request.id(),
                request.serviceAreaCode(),
                window,
                currentTime.now());
    }
}
```

---

### 29. Criar Factory policy

Arquivo:

```text
contracts/factory-policy.yaml
```

Conteúdo:

```yaml
factory:
  usedWhen:
    - creation-is-complex
    - collaborators-are-required
    - valid-construction-needs-policy

  returns:
    validAggregate:
      required

  forbidden:
    - persistence
    - application-orchestration
    - empty-anemic-object
```

---

### 30. Criar Domain Service

A elegibilidade depende de:

- solicitação;
- área;
- janela;
- política temporal;
- informação que não pertence ao appointment ainda.

```java
public final class SchedulingEligibilityService {

    public void ensureEligible(
            ServiceRequestSnapshot request,
            AppointmentWindow window,
            Instant now) {

        if (!request.eligible()) {
            throw new DomainException(
                    "Service request is not eligible");
        }

        if (!request.serviceAreaCode()
                .equals(
                        request.requestedAreaCode())) {
            throw new DomainException(
                    "Service area is not supported");
        }

        if (!window.startsAt().isAfter(now)) {
            throw new DomainException(
                    "Appointment must start in the future");
        }
    }
}
```

A regra continua na linguagem do domínio.

---

### 31. Criar Domain Service policy

Arquivo:

```text
contracts/domain-service-policy.yaml
```

Conteúdo:

```yaml
domainService:
  required:
    - domain-language
    - stateless-by-default
    - business-rule

  usedWhen:
    ruleFitsNoSingleEntity:
      true

  forbidden:
    - application-workflow
    - repository-orchestration
    - HTTP
    - transaction-annotation
    - generic-helper-name
```

---

### 32. Evitar service genérico

Evite:

```text
AppointmentDomainService
com 30 métodos.
```

Prefira nomes orientados à regra:

```text
SchedulingEligibilityService;
AppointmentConflictPolicy;
ReschedulingDeadlinePolicy.
```

---

### 33. Criar Specification

```java
public final class AppointmentCanBeRescheduled {

    public boolean isSatisfiedBy(
            ServiceAppointment appointment,
            Instant now) {

        return appointment.isActive()
                && appointment.currentWindow()
                        .startsAt()
                        .isAfter(
                                now.plus(
                                        Duration.ofHours(2)));
    }
}
```

A specification representa uma condição reutilizável.

Não use specification para esconder qualquer `if`.

---

### 34. Criar Application Service policy

Arquivo:

```text
contracts/application-service-policy.yaml
```

Conteúdo:

```yaml
applicationService:
  owns:
    - use-case-orchestration
    - transaction-boundary
    - repository-call
    - domain-event-publication
    - result-mapping

  forbidden:
    - domain-invariant
    - entity-state-mutation-by-setter
    - persistence-detail
    - HTTP-type
```

---

### 35. Criar serviço de agendamento

```java
public final class ScheduleAppointmentApplicationService {

    private final ServiceAppointmentRepository
            repository;

    private final ServiceAppointmentFactory
            factory;

    private final DomainEventPublisher
            eventPublisher;

    public AppointmentResult execute(
            ScheduleAppointmentCommand command) {

        ServiceRequestId requestId =
                new ServiceRequestId(
                        command.serviceRequestId());

        if (repository.existsActiveFor(requestId)) {
            throw new DomainException(
                    "Active appointment already exists");
        }

        ServiceAppointment appointment =
                factory.create(
                        command.requestSnapshot(),
                        command.window());

        repository.save(appointment);

        eventPublisher.publish(
                appointment.pullDomainEvents());

        return AppointmentResult.from(
                appointment);
    }
}
```

O application service coordena.

A regra de transição continua no aggregate.

---

### 36. Criar confirmação

```java
public AppointmentResult execute(
        ConfirmAppointmentCommand command) {

    ServiceAppointment appointment =
            repository.findById(
                            new AppointmentId(
                                    command.appointmentId()))
                    .orElseThrow(
                            () ->
                                    new AppointmentNotFound(
                                            command.appointmentId()));

    appointment.confirm(
            currentTime.now());

    repository.save(appointment);

    eventPublisher.publish(
            appointment.pullDomainEvents());

    return AppointmentResult.from(
            appointment);
}
```

---

### 37. Criar reagendamento

Fluxo:

```text
carregar aggregate;

validar specification;

criar Value Objects;

chamar `reschedule`;

salvar;

publicar eventos;

mapear resultado.
```

O application service não altera `status`.

---

### 38. Definir publicação após persistência

A publicação após `save` reduz o risco de anunciar um fato não persistido.

Neste laboratório, a persistência é em memória.

Em produção, opções incluem:

- transação;
- outbox;
- publicação after commit;
- event store;
- mensageria.

Esses padrões não serão implementados aqui.

---

### 39. Criar arquitetura test

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

### 40. Proteger aggregate

Valide:

- sem setters públicos;
- construtor controlado;
- collections imutáveis;
- status alterado apenas por métodos;
- repository somente para root;
- eventos no passado;
- domain sem framework.

---

### 41. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  entityWithoutIdentity:
    action:
      FAIL

  mutableValueObject:
    action:
      FAIL

  aggregatePublicSetter:
    action:
      FAIL

  repositoryForValueObject:
    action:
      FAIL

  eventWithEntityReference:
    action:
      FAIL

  applicationServiceContainingInvariant:
    result:
      domain-leak
```

---

### 42. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  invalidAggregateTransition:
    action:
      REJECT

  aggregateLoadedMissing:
    action:
      NOT_FOUND

  domainEventBeforePersistence:
    action:
      FAIL

  frameworkInsideDomain:
    action:
      FAIL

  UbiquitousLanguageDeepDive:
    deferredToLesson620

  BoundedContextDeepDive:
    deferredToLesson621
```

---

### 43. Testar Value Object

```java
@Test
void shouldRejectInvalidWindow() {

    Instant now =
            Instant.parse(
                    "2026-07-14T12:00:00Z");

    assertThrows(
            DomainException.class,
            () ->
                    new AppointmentWindow(
                            now.plusSeconds(3600),
                            now));
}
```

---

### 44. Testar confirmação

```java
@Test
void shouldConfirmScheduledAppointment() {

    ServiceAppointment appointment =
            SchedulingFixtures.scheduled();

    appointment.confirm(
            TestTimes.confirmation());

    assertEquals(
            AppointmentStatus.CONFIRMED,
            appointment.status());

    assertTrue(
            appointment.domainEvents()
                    .stream()
                    .anyMatch(
                            AppointmentConfirmed.class::isInstance));
}
```

Se o aggregate expõe `domainEvents`, devolva cópia imutável.

---

### 45. Testar transição inválida

```java
@Test
void shouldRejectConfirmationAfterCancellation() {

    ServiceAppointment appointment =
            SchedulingFixtures.scheduled();

    appointment.cancel(
            new CancellationReason(
                    "Customer requested cancellation"),
            TestTimes.cancellation());

    assertThrows(
            InvalidAppointmentTransition.class,
            () ->
                    appointment.confirm(
                            TestTimes.confirmation()));
}
```

---

### 46. Testar reagendamento

Valide:

- janela anterior no histórico;
- nova janela atual;
- motivo preservado;
- status `SCHEDULED`;
- evento emitido;
- nenhuma coleção mutável exposta.

---

### 47. Testar Factory

Use:

- ID fixo;
- relógio fixo;
- eligibility controlada.

Confirme que o aggregate nasce válido e com evento `AppointmentScheduled`.

---

### 48. Testar Domain Service

Cenários:

- solicitação elegível;
- solicitação inelegível;
- área incompatível;
- janela no passado;
- janela futura.

---

### 49. Testar Repository

Valide:

- save;
- find;
- inexistente;
- active appointment por solicitação;
- isolamento entre testes;
- identidade preservada.

---

### 50. Testar Application Service

Use repository em memória e event publisher de captura.

Confirme:

- repository chamado;
- aggregate usado;
- evento publicado depois do save;
- resultado mapeado;
- nenhuma regra duplicada.

---

### 51. Validar entities

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\validate-domain-entities.ps1
```

Procure:

- entity sem ID;
- equality por todos os campos;
- setters;
- annotations;
- DTO methods;
- estado público.

---

### 52. Validar Value Objects

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\validate-value-objects.ps1
```

Confirme:

- imutabilidade;
- igualdade por valor;
- validação;
- sem identidade;
- sem setters;
- collections copiadas.

---

### 53. Validar aggregate

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\validate-aggregate-boundaries.ps1
```

Confirme:

- root único;
- invariantes internas;
- referências externas por ID;
- sem acesso direto a children;
- repository por aggregate;
- boundary documentada.

---

### 54. Validar invariantes

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\validate-domain-invariants.ps1
```

Toda invariante do catálogo precisa ter:

- método;
- teste;
- erro;
- cenário;
- decisão.

---

### 55. Validar repository

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\validate-repository-contracts.ps1
```

Procure:

- tipos técnicos;
- base genérica;
- repository por Value Object;
- implementação no domain;
- retorno de record técnico.

---

### 56. Validar eventos

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\validate-domain-events.ps1
```

Confirme:

- nome no passado;
- imutabilidade;
- ID;
- occurredAt;
- sem entity mutável;
- publicação após save.

---

### 57. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-domain\run-ddd-tactical-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide domínio, aplicação, infraestrutura e arquitetura.

---

### 58. Criar reports

Exemplo:

```yaml
aggregateReview:
  root:
    ServiceAppointment

  invariantCount:
    10

  publicSetterCount:
    0

  externalAggregateObjectReferences:
    0

  domainEventCount:
    4

  result:
    PASS
```

---

### 59. Criar gate

O gate valida:

```text
entities;

identidade;

Value Objects;

aggregate root;

boundary;

invariantes;

repository;

factory;

domain service;

specification;

domain events;

application services;

testes;

arquitetura;

documentação;

evidence.
```

Status:

```text
PASS;

FAIL_ENTITY;

FAIL_VALUE_OBJECT;

FAIL_AGGREGATE;

FAIL_INVARIANT;

FAIL_REPOSITORY;

FAIL_FACTORY;

FAIL_DOMAIN_SERVICE;

FAIL_DOMAIN_EVENT;

FAIL_APPLICATION_SERVICE;

FAIL_ARCHITECTURE;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 60. Coletar evidence

Arquivo:

```text
contracts/ddd-tactical-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- entity status;
- value object status;
- aggregate root;
- aggregate status;
- invariant count;
- repository status;
- factory status;
- domain service status;
- specification status;
- domain event status;
- application service status;
- architecture status;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- IDs reais;
- segredos;
- payloads reais;
- JPA schema;
- event sourcing;
- laboratório completo da aula 620;
- aprofundamento da aula 621.

---

### 61. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-domain\validate-ddd-tactical-contract.ps1

.\scripts\m19\service-scheduling-domain\validate-domain-entities.ps1

.\scripts\m19\service-scheduling-domain\validate-value-objects.ps1

.\scripts\m19\service-scheduling-domain\validate-aggregate-boundaries.ps1

.\scripts\m19\service-scheduling-domain\validate-domain-invariants.ps1

.\scripts\m19\service-scheduling-domain\validate-repository-contracts.ps1

.\scripts\m19\service-scheduling-domain\validate-domain-events.ps1

.\scripts\m19\service-scheduling-domain\validate-application-services.ps1

.\scripts\m19\service-scheduling-domain\run-ddd-tactical-tests.ps1

.\scripts\m19\service-scheduling-domain\collect-ddd-tactical-evidence.ps1

.\scripts\m19\service-scheduling-domain\verify-ddd-tactical-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 62. Encerrar o laboratório

Confirme:

- aggregate válido;
- invariantes testadas;
- Value Objects imutáveis;
- entity com identidade;
- repository orientado ao aggregate;
- factory sem persistência;
- domain service focado;
- eventos imutáveis;
- publicação após save;
- domain sem framework;
- nenhum Event Sourcing;
- nenhum JPA;
- laboratório de linguagem não antecipado;
- bounded context dedicado não antecipado;
- reports sanitizados.

---

## Entendendo o que foi feito

### As Entities ganharam identidade

Mudanças de atributos deixaram de alterar quem o objeto é.

### Os Value Objects ganharam validade

Conceitos passaram a nascer válidos e imutáveis.

### O aggregate ganhou boundary

Consistência deixou de ser espalhada por vários services.

### A root ganhou autoridade

Mudanças internas passaram a ocorrer por comportamento explícito.

### As invariantes ganharam proteção

Estados inválidos passaram a ser rejeitados no domínio.

### O Repository ganhou linguagem

Persistência deixou de aparecer como contrato técnico.

### A Factory ganhou propósito

Criação complexa deixou de produzir objetos incompletos.

### O Domain Service ganhou foco

Regras que não pertencem a uma única Entity ganharam nome específico.

### Os Domain Events ganharam significado

Fatos relevantes passaram a ser registrados em linguagem do domínio.

### A aplicação ganhou coordenação

Application Services passaram a orquestrar sem duplicar regras.

---

## Erros comuns importantes

### Criar Entity sem comportamento

O modelo se torna anêmico.

### Criar Value Object mutável

Igualdade e validade ficam frágeis.

### Transformar tudo em Aggregate

Transações e carregamento ficam pesados.

### Colocar tudo dentro de um Aggregate

O boundary perde utilidade.

### Criar Repository para toda classe

Persistência passa a controlar a modelagem.

### Colocar regra no Application Service

O domínio perde autoridade.

### Criar Domain Service genérico

Responsabilidades voltam a ficar vagas.

### Publicar evento antes de salvar

Um fato pode ser anunciado sem existir.

### Colocar Entity inteira no evento

O consumidor recebe estado mutável e acoplado.

### Antecipar Event Sourcing

Domain Event não exige Event Sourcing.

---

## Comandos úteis

### Validar aggregate

```powershell
.\scripts\m19\service-scheduling-domain\validate-aggregate-boundaries.ps1
```

### Validar invariantes

```powershell
.\scripts\m19\service-scheduling-domain\validate-domain-invariants.ps1
```

### Validar eventos

```powershell
.\scripts\m19\service-scheduling-domain\validate-domain-events.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-domain\run-ddd-tactical-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-domain\verify-ddd-tactical-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Entities

Defina identidade e comportamento.

### Parte 2 — Value Objects

Modele conceitos imutáveis.

### Parte 3 — Aggregate

Escolha root e boundary.

### Parte 4 — Invariantes

Implemente regras dentro do aggregate.

### Parte 5 — Repository

Crie contrato para o root.

### Parte 6 — Factory

Centralize criação complexa.

### Parte 7 — Domain Service

Modele regra sem owner natural.

### Parte 8 — Domain Events

Registre fatos do passado.

### Parte 9 — Application Services

Coordene repository e publicação.

### Parte 10 — Gate

Valide modelo, testes e arquitetura.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 618 e ponte para a aula 620 foram preservadas;
- o laboratório `service-scheduling-domain` foi criado;
- o trabalho permanece dentro do Service Scheduling Context;
- `ServiceAppointment` possui identidade e comportamento;
- igualdade da Entity usa identidade;
- Value Objects são imutáveis;
- Value Objects validam seus valores na construção;
- IDs semanticamente diferentes usam tipos diferentes;
- `AppointmentWindow` protege início e fim;
- motivos de reagendamento e cancelamento são distintos;
- `ServiceAppointment` é Aggregate Root;
- mudanças de estado ocorrem somente por métodos do aggregate;
- não existem setters públicos;
- histórico interno não é exposto como coleção mutável;
- referências externas usam IDs;
- boundary do aggregate foi documentado;
- invariantes possuem catálogo e testes;
- repository opera com Aggregate Root;
- repository não retorna tipos técnicos;
- implementação do repository permanece fora do domínio;
- factory cria aggregate válido;
- factory não persiste;
- domain service contém regra de domínio específica;
- specification representa critério reutilizável;
- domain events usam nomes no passado;
- domain events são imutáveis;
- eventos não carregam Entity mutável;
- eventos são publicados após persistência;
- application services coordenam sem implementar invariantes;
- domain não depende de Spring ou JPA;
- architecture tests protegem o modelo;
- Event Sourcing, CQRS e JPA não foram antecipados;
- o laboratório dedicado de Ubiquitous Language não foi antecipado;
- o aprofundamento dedicado de Bounded Context não foi antecipado;
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
  labs/m19/aula-619-ddd-tatico/service-scheduling-domain `
  scripts/m19/service-scheduling-domain `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|realAddress|@Entity|JpaRepository|eventStore|CQRS|completeLanguageGovernance|boundedContextWorkshop"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar DDD tatico"
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
- banco externo;
- Event Sourcing;
- CQRS;
- saga;
- conteúdo completo da aula 620;
- conteúdo completo da aula 621.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou DDD tático dentro do Service Scheduling Context.

Você criou:

```text
Entities;

Value Objects;

Aggregate Root;

invariantes;

Repository;

Factory;

Domain Service;

Specification;

Domain Events;

Application Services;

testes de domínio;

architecture tests.
```

Você comprovou que Entity é definida por identidade; que Value Object é definido por valor; que Aggregate protege consistência; que Aggregate Root controla mudanças; que Repository representa acesso ao aggregate; que Factory cria objetos válidos; que Domain Service modela regras sem owner natural; que Domain Event representa um fato; e que Application Service coordena sem roubar regras do domínio.

A próxima aula será:

```text
620 - M19.10 - Ubiquitous Language
```

Nela, você irá aprofundar como a linguagem do domínio é construída, revisada, governada e mantida coerente entre conversas, documentação, APIs, eventos, testes e código.

Nenhum laboratório completo de governança da linguagem ou aprofundamento dedicado de Bounded Context foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Modelei Entities por identidade.
- [ ] Criei Value Objects imutáveis.
- [ ] Defini Aggregate Root e boundary.
- [ ] Protegi invariantes.
- [ ] Criei Repository orientado ao domínio.
- [ ] Usei Factory e Domain Service com propósito.
- [ ] Registrei Domain Events.
- [ ] Mantive Application Services sem regras.

---

## Troubleshooting adicional

### Entity precisa de setter para o framework

Não contamine o domínio nesta aula. Adapte a persistência externamente.

### Value Object parece apenas um wrapper

Adicione validação, normalização ou comportamento relevante.

### Aggregate ficou enorme

Revise consistência, ciclo de vida e referências por ID.

### Regra está no Application Service

Mova para Aggregate, Value Object, Specification ou Domain Service.

### Factory chama Repository

Separe criação de persistência.

### Domain Service virou utilitário

Renomeie pela regra e reduza responsabilidades.

### Evento usa verbo no presente

Registre o fato no passado.

### Evento carrega a Entity inteira

Publique ID e dados mínimos.

### Teste exige Spring

O domínio deve ser testado com Java puro.

### O laboratório começou a criar Event Store

Preserve Event Sourcing para conteúdo futuro.

---

## Perguntas de revisão

1. O que é Entity?
2. O que é Value Object?
3. Como comparar uma Entity?
4. Como comparar um Value Object?
5. O que é Aggregate?
6. O que é Aggregate Root?
7. O que é invariante?
8. Por que referências externas usam ID?
9. O que é Repository?
10. Por que não criar Repository para cada classe?
11. O que é Factory?
12. O que é Domain Service?
13. O que é Specification?
14. O que é Domain Event?
15. Por que evento usa nome no passado?
16. Quem publica eventos?
17. O que é Application Service?
18. Por que o domínio não depende de Spring?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Objeto definido por identidade contínua.
2. Objeto definido por seus valores.
3. Pela identidade.
4. Pelos valores.
5. Unidade de consistência.
6. Entity que controla o aggregate.
7. Condição que precisa permanecer verdadeira.
8. Evitar aggregates grandes e acoplados.
9. Contrato de acesso ao Aggregate Root.
10. Somente roots precisam de persistência própria.
11. Criação complexa de objeto válido.
12. Regra sem owner natural em uma Entity.
13. Critério de domínio reutilizável.
14. Fato relevante que aconteceu.
15. Porque representa algo ocorrido.
16. Application Service após persistência.
17. Coordenador do caso de uso.
18. Preservar independência e testabilidade.
19. Ubiquitous Language.
20. Ubiquitous Language.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 619 - M19.09 - DDD tatico

- Modelei o Service Scheduling Context com padrões táticos.
- Criei `ServiceAppointment` como Entity e Aggregate Root.
- Modelei IDs semanticamente tipados.
- Criei `AppointmentWindow`, `ServiceAreaCode`, `RescheduleReason` e `CancellationReason` como Value Objects.
- Protegi invariantes dentro do aggregate.
- Implementei confirmação, reagendamento e cancelamento por comportamento.
- Mantive histórico interno protegido.
- Defini igualdade de Entity por identidade.
- Criei `ServiceAppointmentRepository`.
- Implementei repository em memória fora do domínio.
- Criei `ServiceAppointmentFactory`.
- Modelei `SchedulingEligibilityService`.
- Criei Specification de reagendamento.
- Registrei eventos de agendamento, confirmação, reagendamento e cancelamento.
- Publiquei eventos após persistência.
- Criei Application Services para coordenar casos de uso.
- Testei Entities, Value Objects, Aggregate, Factory, Domain Service, Repository e eventos.
- Protegi o domínio com ArchUnit.
- Não antecipei Event Sourcing, JPA, Ubiquitous Language dedicado ou Bounded Context dedicado.
- Próxima aula: Ubiquitous Language.
```

---

## Referência técnica curta

- Tactical Domain-Driven Design.
- Entities.
- Value Objects.
- Aggregates.
- Aggregate Roots.
- Repositories.
- Factories.
- Domain Services.
- Domain Events.
- Specifications.

Regra final:

```text
DDD tático precisa transformar as decisões estratégicas em um modelo que proteja comportamento e consistência: Entities possuem identidade contínua e igualdade por ID, Value Objects são imutáveis, validados na construção e comparados por valor, e o Aggregate Root `ServiceAppointment` controla status, janela, histórico e eventos sem setters ou collections mutáveis; invariantes permanecem dentro do aggregate, referências a conceitos externos usam IDs, Repository existe para o root e não expõe tipos de framework, Factory cria aggregates válidos sem persistir, Domain Service representa regra de domínio sem owner natural, Specification expressa critérios reutilizáveis e Domain Events registram fatos imutáveis no passado sem carregar Entities; Application Services coordenam carregamento, comportamento, persistência, publicação after-save e result mapping sem implementar regra de negócio, enquanto o domínio permanece livre de Spring e JPA e ArchUnit protege as fronteiras; o gate termina com Entities, Value Objects, Aggregate, invariantes, Repository, Factory, Domain Service, eventos, serviços de aplicação, testes, documentação e evidence aprovados, enquanto Ubiquitous Language é aprofundada somente na aula 620 e Bounded Context permanece reservado à aula 621.
```
