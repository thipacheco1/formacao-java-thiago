# 628 - M19.18 - Application Service Use Case

## Apresentação da aula

Na aula 627, você aprofundou Domain Service.

Você criou serviços de elegibilidade, conflito, prazo e seleção, preservando confirmação e cancelamento na Aggregate Root, sobreposição no Value Object e orquestração fora do Domain Service.

Agora surge a pergunta: quem coordena essas partes para executar uma intenção do início ao fim?

Considere o caso de uso `Agendar atendimento`.

Para executá-lo, o sistema valida comando, autoriza, controla idempotência, carrega dados, usa o domínio, persiste, coordena transação, publica após commit e devolve resultado estável.

Essas tarefas formam a orquestração do caso de uso, coordenada por um Application Service.

Um Application Service representa uma intenção, carrega e salva Aggregates, chama Domain Services, controla autorização, idempotência, transação, adapters, publicação posterior e tradução de falhas, sem possuir a regra central.

A pergunta desta aula será:

```text
como construir
um Application Service

que coordene
o caso de uso completo

sem roubar regras
do domínio

e sem se transformar
em controller,
Repository
ou script procedural?
```

O laboratório será:

```text
labs/m19/aula-628-application-service-use-case/service-scheduling-use-cases
```

Você implementará `ScheduleAppointmentUseCase`, `ConfirmAppointmentUseCase`, `RescheduleAppointmentUseCase` e `CancelAppointmentUseCase`. O primeiro coordenará autorização, idempotência, gateways, policies, factory, Repository, transação e after commit.

Os demais casos mostrarão carregamento da root, expected revision, persistência, concorrência, after commit e resultado estável.

A próxima aula oficial será `629 - M19.19 - Domain Events`. Esta aula apenas encaminhará eventos existentes após commit, sem aprofundar modelagem, versionamento, outbox ou integração. Event Storming permanece para a aula 630.

A regra central será:

```text
Application Service
coordena o caso de uso;

o domínio
decide as regras;

a infraestrutura
executa detalhes técnicos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
626:
Repository em DDD.

627:
Domain Service.

628:
Application Service Use Case.

629:
Domain Events.

630:
Event Storming.
```

A progressão vai da persistência e regras de domínio à orquestração, eventos e descoberta colaborativa.

Nesta aula, o foco é Application Service, Use Case, commands, results, autorização, idempotência, transação, orquestração e after commit. Domain Events, Event Storming, mensageria e outbox não serão aprofundados.

O núcleo usará Java puro; Spring aparecerá somente em adapters.

---

## Objetivo prático

Será criada a seguinte estrutura:

```text
labs/m19/aula-628-application-service-use-case/service-scheduling-use-cases
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/schedulingusecases
│   │           ├── application
│   │           │   ├── port
│   │           │   │   ├── in
│   │           │   │   │   ├── ScheduleAppointmentUseCase.java
│   │           │   │   │   ├── ConfirmAppointmentUseCase.java
│   │           │   │   │   ├── RescheduleAppointmentUseCase.java
│   │           │   │   │   └── CancelAppointmentUseCase.java
│   │           │   │   └── out
│   │           │   │       ├── AppointmentRepository.java
│   │           │   │       ├── ServiceRequestGateway.java
│   │           │   │       ├── CapacityGateway.java
│   │           │   │       ├── AuthorizationGateway.java
│   │           │   │       ├── IdempotencyStore.java
│   │           │   │       ├── TransactionRunner.java
│   │           │   │       ├── AfterCommitPublisher.java
│   │           │   │       ├── SchedulingClock.java
│   │           │   │       └── SchedulingIdGenerator.java
│   │           │   ├── command
│   │           │   │   ├── ScheduleAppointmentCommand.java
│   │           │   │   ├── ConfirmAppointmentCommand.java
│   │           │   │   ├── RescheduleAppointmentCommand.java
│   │           │   │   └── CancelAppointmentCommand.java
│   │           │   ├── result
│   │           │   │   ├── AppointmentUseCaseResult.java
│   │           │   │   ├── AppointmentView.java
│   │           │   │   ├── UseCaseFailure.java
│   │           │   │   └── UseCaseFailureCode.java
│   │           │   ├── context
│   │           │   │   ├── ActorContext.java
│   │           │   │   ├── IdempotencyKey.java
│   │           │   │   └── CorrelationId.java
│   │           │   └── service
│   │           │       ├── DefaultScheduleAppointmentService.java
│   │           │       ├── DefaultConfirmAppointmentService.java
│   │           │       ├── DefaultRescheduleAppointmentService.java
│   │           │       └── DefaultCancelAppointmentService.java
│   │           ├── domain
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentFactory.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── AppointmentRevision.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── CapacityOffer.java
│   │           │   ├── CapacityReservationId.java
│   │           │   ├── ServiceRequestSnapshot.java
│   │           │   ├── SchedulingEligibilityService.java
│   │           │   ├── CapacityOfferSelectionPolicy.java
│   │           │   ├── ReschedulingDeadlinePolicy.java
│   │           │   └── AppointmentConflictPolicy.java
│   │           ├── adapter
│   │           │   ├── in
│   │           │   │   └── web
│   │           │   │       ├── AppointmentController.java
│   │           │   │       ├── ScheduleAppointmentRequest.java
│   │           │   │       └── AppointmentResponse.java
│   │           │   └── out
│   │           │       ├── memory
│   │           │       │   ├── InMemoryAppointmentRepository.java
│   │           │       │   ├── InMemoryIdempotencyStore.java
│   │           │       │   └── CapturingAfterCommitPublisher.java
│   │           │       └── transaction
│   │           │           ├── DirectTransactionRunner.java
│   │           │           └── SpringTransactionRunner.java
│   │           └── configuration
│   │               └── SchedulingUseCaseConfiguration.java
│   └── test
│       └── java
│           └── br/com/formacao/schedulingusecases
│               ├── application
│               │   ├── ScheduleAppointmentUseCaseTest.java
│               │   ├── ConfirmAppointmentUseCaseTest.java
│               │   ├── RescheduleAppointmentUseCaseTest.java
│               │   ├── CancelAppointmentUseCaseTest.java
│               │   ├── UseCaseAuthorizationTest.java
│               │   ├── UseCaseIdempotencyTest.java
│               │   ├── UseCaseTransactionTest.java
│               │   └── AfterCommitPublicationTest.java
│               ├── adapter
│               │   └── AppointmentControllerTest.java
│               └── architecture
│                   ├── ApplicationServiceBoundaryTest.java
│                   ├── DomainRuleOwnershipTest.java
│                   ├── AdapterDependencyDirectionTest.java
│                   └── UseCaseFrameworkIndependenceTest.java
├── application-service
│   ├── APPLICATION_SERVICE_CHARTER.md
│   ├── USE_CASE_CATALOG.md
│   ├── ORCHESTRATION_SEQUENCE.md
│   ├── COMMAND_POLICY.md
│   ├── RESULT_POLICY.md
│   ├── AUTHORIZATION_POLICY.md
│   ├── IDEMPOTENCY_POLICY.md
│   ├── TRANSACTION_BOUNDARY.md
│   ├── AFTER_COMMIT_POLICY.md
│   ├── ERROR_TRANSLATION.md
│   ├── OBSERVABILITY.md
│   ├── TEST_STRATEGY.md
│   ├── SMELL_CATALOG.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_USE_CASE_QUESTIONS.md
├── contracts
│   ├── application-service-contract.yaml
│   ├── use-case-interface-policy.yaml
│   ├── command-policy.yaml
│   ├── result-policy.yaml
│   ├── authorization-policy.yaml
│   ├── idempotency-policy.yaml
│   ├── transaction-policy.yaml
│   ├── after-commit-policy.yaml
│   ├── error-translation-policy.yaml
│   ├── observability-policy.yaml
│   ├── dependency-policy.yaml
│   ├── data-quality-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── use-case-catalog-report.yaml
    ├── authorization-report.yaml
    ├── idempotency-report.yaml
    ├── transaction-report.yaml
    ├── after-commit-report.yaml
    ├── dependency-report.yaml
    ├── architecture-report.yaml
    └── application-service-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-use-cases
├── validate-application-service-contract.ps1
├── validate-use-case-interfaces.ps1
├── validate-commands.ps1
├── validate-results.ps1
├── validate-authorization-flow.ps1
├── validate-idempotency-flow.ps1
├── validate-transaction-boundaries.ps1
├── validate-after-commit-flow.ps1
├── validate-error-translations.ps1
├── validate-use-case-dependencies.ps1
├── validate-application-service-smells.ps1
├── run-application-service-tests.ps1
├── collect-application-service-evidence.ps1
└── verify-application-service-gate.ps1
```

Ao final, haverá casos de uso explícitos e testáveis.

---

## Conceito essencial

### Application Service

Coordena um caso de uso sem concentrar regras centrais.

### Use Case

Intenção executável com entrada, fluxo, resultado e falhas.

### Input e Output Ports

Interfaces de entrada e contratos de persistência, autorização ou integração.

### Command e Result

Intenção imutável e resultado estável.

### Actor Context e Authorization

Dados mínimos do ator e decisão de permissão.

### Idempotency

Evita efeitos duplicados para a mesma intenção.

### Transaction Boundary e After Commit

Delimitam atomicidade local e ações posteriores ao commit.

### Orchestration e Error Translation

Coordenam portas e convertem falhas em códigos estáveis.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-628-application-service-use-case/service-scheduling-use-cases

Set-Location `
  labs/m19/aula-628-application-service-use-case/service-scheduling-use-cases
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/application-service-contract.yaml
```

Conteúdo:

```yaml
applicationService:
  context:
    Service-Scheduling

  required:
    - explicit-input-port
    - immutable-command
    - stable-result
    - authorization
    - idempotency
    - transaction-boundary
    - domain-service-coordination
    - aggregate-loading
    - aggregate-persistence
    - after-commit-publication
    - error-translation
    - observability
    - tests
    - architecture-rules

  forbidden:
    - domain-rule-duplication
    - HTTP-type-in-use-case
    - persistence-type-in-use-case
    - framework-annotation-in-core
    - publish-before-commit
    - idempotency-after-side-effect
    - controller-business-rule
    - domain-events-deep-dive
    - event-storming-workshop

  nextLesson:
    code:
      M19.19
```

---

### 3. Criar Application Service Charter

Arquivo:

```text
application-service/APPLICATION_SERVICE_CHARTER.md
```

Conteúdo:

```markdown
# Application Service Charter

## Contexto

Service Scheduling.

## Responsabilidade

Coordenar casos de uso
sem implementar regras centrais
do domínio.

## Pode

- autorizar;
- validar contrato de entrada;
- controlar idempotência;
- abrir transação;
- carregar Aggregates;
- chamar Domain Services;
- chamar comportamento da root;
- salvar Aggregate;
- registrar ação after commit;
- traduzir falhas;
- devolver resultado.

## Não pode

- alterar estado interno diretamente;
- duplicar invariantes;
- depender de HTTP;
- depender de Entity JPA;
- executar SQL;
- decidir regra sem usar o domínio;
- publicar antes do commit.
```

---

### 4. Criar catálogo de casos de uso

Arquivo:

```text
application-service/USE_CASE_CATALOG.md
```

Exemplo:

```text
UC-001:
Schedule Appointment.

Actor:
Scheduling Operator.

Command:
ScheduleAppointmentCommand.

Domain collaborators:
SchedulingEligibilityService;
CapacityOfferSelectionPolicy;
AppointmentFactory.

Output ports:
ServiceRequestGateway;
CapacityGateway;
AppointmentRepository.

Transaction:
reserva + criação local,
com compensação explícita quando necessário.

Result:
AppointmentUseCaseResult.
```

Repita para confirmar, reagendar e cancelar.

---

### 5. Criar input port

```java
public interface ScheduleAppointmentUseCase {

    AppointmentUseCaseResult execute(
            ScheduleAppointmentCommand command);
}
```

O adapter depende dessa interface.

O caso de uso não conhece controller.

---

### 6. Criar command

```java
public record ScheduleAppointmentCommand(
        ActorContext actor,
        CorrelationId correlationId,
        IdempotencyKey idempotencyKey,
        UUID serviceRequestId) {

    public ScheduleAppointmentCommand {
        Objects.requireNonNull(actor);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(idempotencyKey);
        Objects.requireNonNull(serviceRequestId);
    }
}
```

O command contém intenção e contexto mínimo, sem tipos técnicos.

---

### 7. Criar command policy

Arquivo:

```text
contracts/command-policy.yaml
```

Conteúdo:

```yaml
command:
  immutable:
    required

  required:
    - actor
    - correlation-id
    - idempotency-key
    - use-case-data

  forbidden:
    - HTTP-request
    - persistence-entity
    - framework-type
    - mutable-collection
    - authorization-token-raw
    - domain-entity-as-input

  validation:
    structural:
      at-construction:
        required
```

---

### 8. Criar Actor Context

```java
public record ActorContext(
        String actorId,
        Set<String> roles) {

    public ActorContext {
        if (actorId == null
                || actorId.isBlank()) {
            throw new IllegalArgumentException(
                    "Actor id is required");
        }

        roles =
                Set.copyOf(roles);
    }
}
```


---

### 9. Criar autorização

```java
public interface AuthorizationGateway {

    AuthorizationDecision authorize(
            ActorContext actor,
            UseCasePermission permission);
}
```

```java
public sealed interface AuthorizationDecision {

    record Allowed()
            implements AuthorizationDecision {
    }

    record Denied(
            String reasonCode)
            implements AuthorizationDecision {
    }
}
```

O Application Service recebe uma decisão, sem interpretar token.

---

### 10. Criar authorization policy

Arquivo:

```text
contracts/authorization-policy.yaml
```

Conteúdo:

```yaml
authorization:
  before:
    - Repository-load
    - external-side-effect
    - domain-mutation

  input:
    actor-context

  result:
    explicit-decision

  rawToken:
    forbidden

  controllerOnlyAuthorization:
    forbidden

  denied:
    effect:
      none
```

---

### 11. Criar Idempotency Key

```java
public record IdempotencyKey(
        String value) {

    public IdempotencyKey {
        if (value == null
                || value.isBlank()
                || value.length() > 100) {
            throw new IllegalArgumentException(
                    "Invalid idempotency key");
        }
    }
}
```

A chave pertence ao contrato da aplicação.

---

### 12. Criar Idempotency Store

```java
public interface IdempotencyStore {

    Optional<AppointmentUseCaseResult> findCompleted(
            String useCaseName,
            IdempotencyKey key);

    IdempotencyReservation reserve(
            String useCaseName,
            IdempotencyKey key,
            CorrelationId correlationId);

    void complete(
            IdempotencyReservation reservation,
            AppointmentUseCaseResult result);

    void release(
            IdempotencyReservation reservation);
}
```


---

### 13. Ordem da idempotência

Fluxo: validar, autorizar, consultar resultado, reservar chave, executar efeitos e completar.

Valide antes da reserva e controle duplicação antes de side effects.

---

### 14. Criar idempotency policy

Arquivo:

```text
contracts/idempotency-policy.yaml
```

Conteúdo:

```yaml
idempotency:
  requiredFor:
    - schedule
    - reschedule
    - cancel
    - confirm

  lookup:
    before-side-effects:
      required

  completedResult:
    returnedWithoutReexecution:
      required

  concurrentReservation:
    action:
      REJECT_OR_WAIT_BY_POLICY

  failureBeforeCommit:
    reservation:
      release:
        required

  failureAfterCommit:
    recovery:
      explicit:
        required

  keyReuseWithDifferentPayload:
    action:
      REJECT
```

---

### 15. Criar result

```java
public sealed interface AppointmentUseCaseResult {

    record Success(
            AppointmentView appointment,
            boolean replayed)
            implements AppointmentUseCaseResult {
    }

    record Failure(
            UseCaseFailure failure)
            implements AppointmentUseCaseResult {
    }
}
```

---

### 16. Criar falha estável

```java
public record UseCaseFailure(
        UseCaseFailureCode code,
        String safeMessage,
        boolean retryable) {

    public UseCaseFailure {
        Objects.requireNonNull(code);
        Objects.requireNonNull(safeMessage);
    }
}
```

Os códigos cobrem autorização, ausência, capacidade, conflito, concorrência, idempotência, operação inválida, indisponibilidade e falha da aplicação.

---

### 17. Criar result policy

Arquivo:

```text
contracts/result-policy.yaml
```

Conteúdo:

```yaml
result:
  immutable:
    required

  success:
    stable-view:
      required

  failure:
    requires:
      - stable-code
      - safe-message
      - retryable

  technicalException:
    publicExposure:
      forbidden

  stackTrace:
    publicExposure:
      forbidden

  null:
    forbidden
```

---

### 18. Criar Transaction Runner

```java
public interface TransactionRunner {

    <T> T required(
            Supplier<T> operation);
}
```

Implementação direta para testes:

```java
public final class DirectTransactionRunner
        implements TransactionRunner {

    @Override
    public <T> T required(
            Supplier<T> operation) {

        return operation.get();
    }
}
```

---

### 19. Criar adapter Spring

```java
public final class SpringTransactionRunner
        implements TransactionRunner {

    private final TransactionTemplate template;

    @Override
    public <T> T required(
            Supplier<T> operation) {

        return template.execute(
                status ->
                        operation.get());
    }
}
```

`TransactionTemplate` permanece no adapter.

---

### 20. Criar transaction policy

Arquivo:

```text
contracts/transaction-policy.yaml
```

Conteúdo:

```yaml
transaction:
  ownedBy:
    application-service

  includes:
    - aggregate-load
    - domain-mutation
    - aggregate-save
    - local-idempotency-completion

  excludes:
    - long-remote-call-when-avoidable
    - HTTP-response-writing
    - message-delivery
    - external-context-database

  rollback:
    onFailure:
      required

  domain:
    transaction-api:
      forbidden
```

---

### 21. Criar After Commit Publisher

```java
public interface AfterCommitPublisher {

    void register(
            Runnable action);
}
```

O adapter registra callbacks na transação; testes capturam e executam após sucesso.

---

### 22. Criar after commit policy

Arquivo:

```text
contracts/after-commit-policy.yaml
```

Conteúdo:

```yaml
afterCommit:
  domainEventPublication:
    onlyAfterCommit:
      required

  registration:
    inside-use-case:
      allowed

  execution:
    transaction-adapter:
      responsible

  rollback:
    publish:
      forbidden

  eventDesign:
    deferredToLesson629

  outbox:
    outOfScopeForLesson628
```

---

### 23. Criar sequência do agendamento

Arquivo:

```text
application-service/ORCHESTRATION_SEQUENCE.md
```

Sequência:

```text
1. validar command;
2. autorizar actor;
3. buscar resultado idempotente;
4. reservar idempotency key;
5. carregar Service Request;
6. consultar ofertas;
7. selecionar oferta;
8. reservar capacidade;
9. criar Appointment;
10. salvar root;
11. completar idempotência;
12. registrar publicação after commit;
13. retornar view.
```


---

### 24. Criar Schedule Service

```java
public final class DefaultScheduleAppointmentService
        implements ScheduleAppointmentUseCase {

    private static final String USE_CASE =
            "schedule-appointment";

    private final AuthorizationGateway authorization;
    private final IdempotencyStore idempotency;
    private final ServiceRequestGateway requests;
    private final CapacityGateway capacity;
    private final CapacityOfferSelectionPolicy selection;
    private final AppointmentFactory factory;
    private final AppointmentRepository appointments;
    private final TransactionRunner transactions;
    private final AfterCommitPublisher afterCommit;
    private final SchedulingClock clock;

    @Override
    public AppointmentUseCaseResult execute(
            ScheduleAppointmentCommand command) {

        AuthorizationDecision decision =
                authorization.authorize(
                        command.actor(),
                        UseCasePermission
                                .SCHEDULE_APPOINTMENT);

        if (decision
                instanceof AuthorizationDecision.Denied) {
            return forbidden();
        }

        Optional<AppointmentUseCaseResult> completed =
                idempotency.findCompleted(
                        USE_CASE,
                        command.idempotencyKey());

        if (completed.isPresent()) {
            return markAsReplay(
                    completed.get());
        }

        IdempotencyReservation reservation =
                idempotency.reserve(
                        USE_CASE,
                        command.idempotencyKey(),
                        command.correlationId());

        try {
            return transactions.required(
                    () ->
                            executeTransaction(
                                    command,
                                    reservation));

        } catch (RuntimeException exception) {
            idempotency.release(reservation);
            return translate(exception);
        }
    }
}
```

A estrutura coordena; as regras continuam no domínio.

---

### 25. Executar transação do agendamento

```java
private AppointmentUseCaseResult executeTransaction(
        ScheduleAppointmentCommand command,
        IdempotencyReservation idempotencyReservation) {

    ServiceRequestSnapshot request =
            requests.findById(
                            command.serviceRequestId())
                    .orElseThrow(
                            ServiceRequestNotFound::new);

    List<CapacityOffer> offers =
            capacity.findOffers(
                    request.serviceAreaCode(),
                    request.serviceType());

    CapacityOffer selected =
            selection.select(
                    request,
                    offers)
                    .selectedOrThrow();

    CapacityReservationId reservationId =
            capacity.reserve(
                    selected.id(),
                    command.correlationId());

    Appointment appointment =
            factory.schedule(
                    request,
                    selected,
                    reservationId,
                    clock.now());

    appointments.save(
            appointment,
            ExpectedRevision.newAggregate());

    AppointmentUseCaseResult result =
            success(
                    appointment.snapshot(),
                    false);

    idempotency.complete(
            idempotencyReservation,
            result);

    List<AppointmentDomainEvent> events =
            appointment.pullEvents();

    afterCommit.register(
            () ->
                    publish(events));

    return result;
}
```


---

### 26. Compensar reserva externa

Se Capacity foi reservada e o save local falhar:

```java
try {
    appointments.save(...);
} catch (RuntimeException exception) {
    capacity.release(
            reservationId,
            command.correlationId());
    throw exception;
}
```


---

### 27. Evitar regra no Application Service

Exemplo incorreto:

```java
if (!request.eligible()
        || !offer.reservable()
        || !offer.supports(
                request.serviceType())) {
    return failure(...);
}
```

O Application Service deve chamar:

```java
selection.select(request, offers);
```

ou:

```java
eligibility.evaluate(request, offer);
```


---

### 28. Criar Confirm Use Case

```java
public interface ConfirmAppointmentUseCase {

    AppointmentUseCaseResult execute(
            ConfirmAppointmentCommand command);
}
```

Command:

```java
public record ConfirmAppointmentCommand(
        ActorContext actor,
        CorrelationId correlationId,
        IdempotencyKey idempotencyKey,
        AppointmentId appointmentId,
        AppointmentRevision expectedRevision) {
}
```

---

### 29. Criar Confirm Service

Fluxo:

```java
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
        clock.now());

repository.save(
        appointment,
        ExpectedRevision.existing(
                loadedRevision));
```


---

### 30. Criar Reschedule Use Case

O fluxo precisa:

- autorizar;
- controlar idempotência;
- carregar Appointment;
- validar expected revision;
- avaliar deadline;
- buscar ofertas;
- avaliar conflitos;
- reservar nova capacidade;
- chamar `appointment.reschedule`;
- salvar;
- liberar reserva anterior após commit;
- publicar eventos após commit.


---

### 31. Criar Cancel Use Case

O cancelamento precisa:

- carregar root;
- validar revisão;
- chamar `appointment.cancel`;
- salvar;
- registrar after commit;
- liberar capacidade;
- devolver view.


---

### 32. Autorização antes do carregamento

Autorizar cedo reduz consultas, exposição e side effects indevidos.

Quando a autorização depende do recurso, autorize primeiro de forma básica, carregue dados mínimos, autorize contextualmente e só então altere.

---

### 33. Idempotência e payload

A mesma chave não pode representar comandos diferentes.

Armazene fingerprint do use case, ator, recurso e payload canonicalizado.

Se a chave existe com fingerprint diferente:

```text
IDEMPOTENCY_CONFLICT.
```


---

### 34. Criar autorização contextual

```java
AuthorizationDecision authorize(
        ActorContext actor,
        UseCasePermission permission,
        ResourceScope scope);
```



---

### 35. Criar error translation

Arquivo:

```text
application-service/ERROR_TRANSLATION.md
```

Mapeamentos:

```text
AppointmentNotFound
-> APPOINTMENT_NOT_FOUND.

AppointmentConcurrencyException
-> CONCURRENCY_CONFLICT.

SchedulingDecision.Rejected
-> INVALID_OPERATION.

CapacityUnavailable
-> EXTERNAL_DEPENDENCY_UNAVAILABLE.

IdempotencyConflict
-> IDEMPOTENCY_CONFLICT.

UnexpectedException
-> APPLICATION_FAILURE.
```

---

### 36. Criar error policy

Arquivo:

```text
contracts/error-translation-policy.yaml
```

Conteúdo:

```yaml
errorTranslation:
  applicationBoundary:
    required

  domainException:
    translated:
      required

  technicalException:
    translated:
      required

  stableCode:
    required

  safeMessage:
    required

  retryable:
    explicit:
      required

  rawException:
    publicExposure:
      forbidden
```

---

### 37. Exceção ou Result

O Application Service pode usar exceções internamente, mas devolve `AppointmentUseCaseResult` estável na fronteira pública.

---

### 38. Criar controller fino

```java
@RestController
final class AppointmentController {

    private final ScheduleAppointmentUseCase
            schedule;

    @PostMapping("/appointments")
    ResponseEntity<AppointmentResponse> schedule(
            @RequestHeader("Idempotency-Key")
            String idempotencyKey,
            @RequestBody
            ScheduleAppointmentRequest request,
            Authentication authentication) {

        ScheduleAppointmentCommand command =
                mapper.toCommand(
                        request,
                        authentication,
                        idempotencyKey);

        AppointmentUseCaseResult result =
                schedule.execute(command);

        return presenter.toResponse(result);
    }
}
```

O controller apenas traduz transporte e apresenta o resultado.

---

### 39. Criar use-case interface policy

Arquivo:

```text
contracts/use-case-interface-policy.yaml
```

Conteúdo:

```yaml
useCaseInterface:
  package:
    application-port-in

  method:
    execute:
      preferred

  input:
    command:
      required

  output:
    result:
      required

  forbidden:
    - HTTP
    - persistence
    - framework-page
    - domain-entity-as-response
    - technical-exception
```

---

### 40. Criar dependency policy

Arquivo:

```text
contracts/dependency-policy.yaml
```

Conteúdo:

```yaml
dependency:
  adapterIn:
    dependsOn:
      input-port

  application:
    dependsOn:
      - domain
      - input-port
      - output-port

  domain:
    dependsOn:
      application:
        false

  adapterOut:
    implements:
      output-port

  forbidden:
    - domain-to-application
    - application-to-controller
    - application-to-JPA
    - application-to-HTTP-client-concrete
```

---

### 41. Observabilidade

Arquivo:

```text
application-service/OBSERVABILITY.md
```

Campos permitidos:

- use case;
- correlation ID;
- actor técnico anonimizado;
- idempotency outcome;
- transaction outcome;
- duration;
- result code;
- retryable;
- Aggregate ID;
- expected revision;
- persisted revision;
- after commit registration count.

Não registre token, dados pessoais, payload completo, exception bruta ou segredo.

---

### 42. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - use-case
    - correlation-id
    - outcome
    - duration
    - result-code

  optional:
    - aggregate-id
    - expected-revision
    - persisted-revision
    - idempotency-outcome

  forbidden:
    - raw-token
    - personal-data
    - full-payload
    - secret
```

---

### 43. Criar smell catalog

Arquivo:

```text
application-service/SMELL_CATALOG.md
```

Smells:

```text
SMELL-001:
Application Service altera campo da Entity.

SMELL-002:
controller chama Repository.

SMELL-003:
caso de uso depende de DTO HTTP.

SMELL-004:
serviço publica antes do commit.

SMELL-005:
idempotência é verificada após side effect.

SMELL-006:
Application Service contém regra duplicada.

SMELL-007:
transação engloba chamada externa longa.

SMELL-008:
exception técnica chega ao controller.

SMELL-009:
caso de uso retorna Entity.

SMELL-010:
um service possui dezenas de casos de uso.
```

---

### 44. Um serviço por caso de uso

Prefira:

```text
DefaultScheduleAppointmentService;

DefaultConfirmAppointmentService;

DefaultRescheduleAppointmentService;

DefaultCancelAppointmentService.
```

Evite:

```text
AppointmentApplicationService
```

com dezenas de métodos sem coesão.


---

### 45. Testar caminho feliz

`ScheduleAppointmentUseCaseTest` valida:

- autorização;
- idempotência;
- request carregada;
- ofertas consultadas;
- policy chamada;
- capacidade reservada;
- Aggregate criada;
- Repository salvo;
- idempotência concluída;
- after commit registrado;
- view retornada.

---

### 46. Testar autorização negada

Confirme:

- resultado `FORBIDDEN`;
- Repository não chamado;
- Capacity não chamada;
- idempotência não reservada;
- transação não aberta;
- evento não registrado.

---

### 47. Testar replay idempotente

Dado um resultado concluído:

- o mesmo resultado é devolvido;
- `replayed = true`;
- Repository não é carregado;
- Capacity não é chamada;
- transação não é aberta;
- evento não é publicado novamente.

---

### 48. Testar conflito de chave

Mesma chave com fingerprint diferente:

- resultado `IDEMPOTENCY_CONFLICT`;
- nenhum side effect;
- métrica registrada;
- tentativa não sobrescreve resultado anterior.

---

### 49. Testar rollback

Simule falha no Repository.

Confirme:

- transação falha;
- idempotency reservation é liberada;
- after commit não executa;
- reserva externa é compensada;
- resultado é estável;
- Aggregate não aparece persistida.

---

### 50. Testar after commit

```java
@Test
void shouldPublishOnlyAfterSuccessfulCommit() {

    useCase.execute(command);

    assertEquals(
            1,
            afterCommit.registeredCount());

    assertEquals(
            0,
            publisher.publishedCount());

    afterCommit.executeRegistered();

    assertEquals(
            1,
            publisher.publishedCount());
}
```

Esse teste valida apenas o timing da publicação.

---

### 51. Testar concorrência

Dado expected revision antiga:

- root é carregada;
- `requireRevision` falha ou save rejeita;
- resultado é `CONCURRENCY_CONFLICT`;
- nenhuma publicação ocorre;
- idempotência não é marcada como sucesso.

---

### 52. Testar regra no domínio

`DomainRuleOwnershipTest` verifica:

- `confirm` existe na root;
- `reschedule` existe na root;
- elegibilidade existe no Domain Service;
- Application Service não possui `if` baseado em status internos;
- nenhum setter é usado.


---

### 53. Testar controller

`AppointmentControllerTest` valida:

- request para command;
- header de idempotência;
- actor context;
- status HTTP por result code;
- ausência de Repository no controller;
- ausência de regra de negócio.

---

### 54. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unauthorizedSideEffect:
    action:
      FAIL

  idempotencyAfterSideEffect:
    action:
      FAIL

  publishBeforeCommit:
    action:
      FAIL

  technicalExceptionLeak:
    action:
      FAIL

  domainRuleDuplicated:
    action:
      FAIL

  entityReturnedAsResponse:
    action:
      FAIL

  transactionWithoutOwner:
    action:
      FAIL
```

---

### 55. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson629:
    forbidden:
      - domain-event-design-deep-dive
      - event-versioning
      - event-schema-evolution
      - dispatcher-implementation
      - outbox
      - broker-delivery-guarantees

  lesson630:
    forbidden:
      - event-storming-workshop
      - orange-blue-yellow-sticky-flow
      - full-process-discovery

  allowed:
    - pull-existing-events
    - register-after-commit-action
    - capture-publisher-test-double
```

---

### 56. Criar Test Strategy

Arquivo:

```text
application-service/TEST_STRATEGY.md
```

Pirâmide:

```text
unit:
caso de uso com fakes.

domain:
Aggregate e Domain Services.

contract:
output ports.

adapter:
controller, transaction e persistence.

architecture:
direção de dependências.

integration:
fluxo com transaction adapter.
```


---

### 57. Criar Evolution Log

Arquivo:

```text
application-service/EVOLUTION_LOG.md
```

Exemplo:

```markdown
## APP-DEC-004

Decisão:
Publicação será registrada
como after commit action.

Motivo:
Impedir publicação
de mudança revertida.

Limitação:
Garantia distribuída completa
não está implementada.

Próxima revisão:
Aula 629
e módulo de confiabilidade.
```

---

### 58. Criar perguntas abertas

Arquivo:

```text
application-service/OPEN_USE_CASE_QUESTIONS.md
```

Exemplos:

- autorização depende da área de atendimento?
- qual é o TTL da idempotency key?
- como tratar falha após commit antes de completar idempotência?
- reserva de capacidade deve ocorrer dentro ou fora da transação local?
- quando compensar reserva?
- expected revision é obrigatória em todos os comandos?
- confirmação exige autorização contextual?
- qual result code é retryable?
- o controller pode aceitar ausência de idempotency key?
- quais eventos devem ser publicados?


---

### 59. Validar interfaces

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-use-case-interfaces.ps1
```

Confirme:

- input port;
- command;
- result;
- sem HTTP;
- sem JPA;
- sem Entity exposta;
- sem exception técnica.

---

### 60. Validar commands

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-commands.ps1
```

Procure:

- mutabilidade;
- token bruto;
- DTO;
- Entity;
- collections mutáveis;
- ausência de correlation ID;
- ausência de idempotency key.

---

### 61. Validar results

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-results.ps1
```

Confirme:

- success;
- failure;
- safe message;
- stable code;
- retryable;
- sem `null`;
- sem stack trace;
- view imutável.

---

### 62. Validar autorização

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-authorization-flow.ps1
```

Confirme:

- autorização antes de efeitos;
- denied sem chamadas externas;
- actor mínimo;
- autorização contextual quando necessária;
- zero token no core.

---

### 63. Validar idempotência

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-idempotency-flow.ps1
```

Confirme:

- lookup;
- reservation;
- fingerprint;
- replay;
- conflict;
- completion;
- release;
- nenhum efeito duplicado.

---

### 64. Validar transação

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-transaction-boundaries.ps1
```

Confirme:

- owner;
- Aggregate load;
- mutation;
- save;
- rollback;
- chamadas externas classificadas;
- domain sem transaction API.

---

### 65. Validar after commit

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-after-commit-flow.ps1
```

Confirme:

- registro após save;
- execução somente no commit;
- rollback sem publicação;
- zero publish direto;
- eventos existentes sem aprofundamento.

---

### 66. Validar erros

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-error-translations.ps1
```

Confirme:

- domain error;
- persistence error;
- external error;
- idempotency error;
- stable result;
- retryable;
- mensagem segura.

---

### 67. Validar dependências

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-use-case-dependencies.ps1
```

Procure:

- controller;
- HTTP;
- JPA;
- JDBC;
- Spring Data;
- EntityManager;
- concrete client;
- broker;
- SQL.

---

### 68. Validar smells

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-application-service-smells.ps1
```

Procure:

- setter;
- regra de status;
- controller gordo;
- service genérico;
- publish antes do commit;
- idempotência tardia;
- Entity como response;
- transação ausente.

---

### 69. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-use-cases\run-application-service-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- schedule;
- confirm;
- reschedule;
- cancel;
- autorização;
- idempotência;
- rollback;
- compensação;
- concorrência;
- after commit;
- controller;
- arquitetura.

---

### 70. Criar reports

Exemplo:

```yaml
useCaseCatalog:
  useCases:
    - ScheduleAppointment
    - ConfirmAppointment
    - RescheduleAppointment
    - CancelAppointment

  domainRuleDuplications:
    0

  HTTPTypesInCore:
    0

  persistenceTypesInCore:
    0

  unauthorizedSideEffects:
    0

  publishBeforeCommit:
    0

  idempotentReplays:
    4

  result:
    PASS
```

---

### 71. Criar gate

O gate valida catálogo, ports, commands, results, autorização, idempotência, transação, domínio, compensação, after commit, erros, observabilidade, testes, arquitetura, documentação e evidence.

Status:

```text
PASS;

FAIL_INPUT_PORT;

FAIL_COMMAND;

FAIL_RESULT;

FAIL_AUTHORIZATION;

FAIL_IDEMPOTENCY;

FAIL_TRANSACTION;

FAIL_DOMAIN_OWNERSHIP;

FAIL_COMPENSATION;

FAIL_AFTER_COMMIT;

FAIL_ERROR_TRANSLATION;

FAIL_DEPENDENCY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 72. Coletar evidence

Arquivo:

```text
contracts/application-service-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- use case count;
- input port status;
- command status;
- result status;
- authorization status;
- idempotency status;
- transaction status;
- compensation status;
- after commit status;
- error translation status;
- dependency status;
- smell count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- tokens;
- dados pessoais;
- payload real;
- credenciais;
- eventos completos;
- schemas de mensageria;
- Event Storming completo.

---

### 73. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-application-service-contract.ps1

.\scripts\m19\service-scheduling-use-cases\validate-use-case-interfaces.ps1

.\scripts\m19\service-scheduling-use-cases\validate-commands.ps1

.\scripts\m19\service-scheduling-use-cases\validate-results.ps1

.\scripts\m19\service-scheduling-use-cases\validate-authorization-flow.ps1

.\scripts\m19\service-scheduling-use-cases\validate-idempotency-flow.ps1

.\scripts\m19\service-scheduling-use-cases\validate-transaction-boundaries.ps1

.\scripts\m19\service-scheduling-use-cases\validate-after-commit-flow.ps1

.\scripts\m19\service-scheduling-use-cases\validate-error-translations.ps1

.\scripts\m19\service-scheduling-use-cases\validate-use-case-dependencies.ps1

.\scripts\m19\service-scheduling-use-cases\validate-application-service-smells.ps1

.\scripts\m19\service-scheduling-use-cases\run-application-service-tests.ps1

.\scripts\m19\service-scheduling-use-cases\collect-application-service-evidence.ps1

.\scripts\m19\service-scheduling-use-cases\verify-application-service-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 74. Encerrar o laboratório

Confirme:

- input ports explícitos;
- commands imutáveis;
- results estáveis;
- autorização antes de efeitos;
- idempotência antes de side effects;
- replay sem reexecução;
- chave com fingerprint;
- transação controlada pela aplicação;
- regras no domínio;
- Repositories por output port;
- compensação documentada;
- after commit sem publish antecipado;
- controller fino;
- erros traduzidos;
- observabilidade sanitizada;
- Domain Events não aprofundados;
- Event Storming não antecipado;
- reports sanitizados.

---

## Entendendo o que foi feito

### O caso de uso ganhou fronteira

Entrada, fluxo, resultado e falhas ficaram explícitos.

### A aplicação ganhou papel

Ela coordenou autorização, idempotência, transação, domínio, Repositories, integrações e compensações sem substituir regras.

### A publicação ganhou timing

Eventos só são encaminhados após commit.

### O controller ganhou simplicidade

Transporte deixou de concentrar fluxo e regra.

---

## Erros comuns importantes

### Colocar regra de negócio no Application Service

O domínio fica anêmico.

### Chamar Repository no controller

A fronteira do caso de uso desaparece.

### Verificar idempotência depois do side effect

Duplicações continuam possíveis.

### Autorizar apenas no frontend

Operações indevidas chegam ao backend.

### Publicar antes do commit

Eventos podem representar mudanças revertidas.

### Retornar Entity como resposta

Internals viram contrato.

### Usar DTO HTTP no input port

A aplicação fica acoplada ao transporte.

### Englobar chamada externa longa na transação

Locks e falhas aumentam.

### Capturar toda exception como sucesso

Falhas ficam invisíveis.

### Antecipar Domain Events

A aula perde o foco na orquestração.

---

## Comandos úteis

### Validar interfaces

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-use-case-interfaces.ps1
```

### Validar idempotência

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-idempotency-flow.ps1
```

### Validar transações

```powershell
.\scripts\m19\service-scheduling-use-cases\validate-transaction-boundaries.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-use-cases\run-application-service-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-use-cases\verify-application-service-gate.ps1
```

---

## Exercício guiado

Implemente input ports, commands, results, autorização, idempotência, orquestração, transação, compensação e after commit. Finalize validando fluxo, testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 627 e ponte para a aula 629 foram preservadas;
- o laboratório `service-scheduling-use-cases` foi criado;
- Application Service Charter foi criado;
- catálogo de casos de uso foi criado;
- existe um input port por intenção principal;
- commands são imutáveis;
- commands possuem actor, correlation ID e idempotency key;
- commands não possuem HTTP, JPA ou Entity de domínio como transporte;
- results são estáveis e imutáveis;
- failures possuem code, safe message e retryable;
- autorização ocorre antes de side effects;
- autorização negada não chama Repository ou integração;
- idempotência é consultada antes da execução;
- replay devolve resultado sem reexecutar;
- fingerprint diferente produz conflito;
- reservation de idempotência é liberada em rollback;
- Application Service controla transaction boundary;
- domínio não conhece transaction API;
- regras permanecem na Aggregate Root e nos Domain Services;
- Application Service não altera estado por setter;
- Service Request e Capacity são acessados por output ports;
- CapacityOfferSelectionPolicy recebe ofertas carregadas;
- criação usa AppointmentFactory;
- Repository usa expected revision;
- stale write vira conflito estável;
- compensação de reserva foi documentada e testada;
- eventos existentes são coletados da root;
- publicação é registrada somente após persistência;
- rollback não publica;
- controller apenas traduz transporte;
- controller não acessa Repository;
- erros técnicos e de domínio são traduzidos;
- observabilidade não registra dados sensíveis;
- architecture tests validam direção;
- Domain Events não foram aprofundados;
- Event Storming não foi antecipado;
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
  labs/m19/aula-628-application-service-use-case/service-scheduling-use-cases `
  scripts/m19/service-scheduling-use-cases `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|rawToken|HttpServletRequestInsideUseCase|JpaRepositoryInsideApplication|publishBeforeCommit|fullDomainEventsDeepDive|eventStormingWorkshop"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar Application Services e Use Cases"
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
- Entity JPA na aplicação;
- publicação antes do commit;
- Domain Events aprofundados;
- Event Storming.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Application Service e Use Case.

Você criou:

```text
Application Service Charter;

catálogo de casos de uso;

input ports;

commands;

results;

actor context;

authorization;

idempotency;

transaction runner;

output ports;

compensação;

after commit;

controller fino;

testes arquiteturais.
```

Você comprovou que Application Service coordena sem substituir o domínio, autoriza antes dos efeitos, controla idempotência e transação, usa output ports, compensa falhas externas e publica após commit.

A próxima aula será:

```text
629 - M19.19 - Domain Events
```

Nela, você irá aprofundar como modelar fatos do domínio, escolher granularidade, nomear eventos, registrar metadados, separar evento interno de integração e controlar evolução e publicação.

Nenhum aprofundamento completo de Domain Events ou Event Storming foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei input ports explícitos.
- [ ] Modelei commands imutáveis.
- [ ] Modelei results estáveis.
- [ ] Autorizei antes dos efeitos.
- [ ] Controlei idempotência.
- [ ] Delimitei transação.
- [ ] Mantive regras no domínio.
- [ ] Publiquei somente após commit.

---

## Troubleshooting adicional

### O Application Service possui muitos `if`

Revise se as decisões pertencem à root ou a Domain Services.

### O controller precisa carregar Repository

Crie ou use um input port apropriado.

### A mesma requisição cria dois Aggregates

Adicione idempotência, fingerprint e constraint.

### A chave ficou presa após falha

Libere reservation em rollback e defina recuperação.

### A reserva externa ocorreu antes do save

Implemente compensação explícita.

### O evento foi publicado mesmo com rollback

Registre a ação no after commit adapter.

### A transação mantém chamada externa longa

Reavalie sequência, reserva e compensação.

### A exception do banco chegou ao controller

Traduza na fronteira da aplicação.

### O caso de uso retorna Appointment

Mapeie para `AppointmentView`.

### O laboratório começou a desenhar schema de evento

Preserve o aprofundamento para a aula 629.

---

## Perguntas de revisão

1. O que é Application Service?
2. O que é Use Case?
3. O que é Input Port?
4. O que é Output Port?
5. O que é Command?
6. O que é Result?
7. Onde ficam as regras centrais?
8. Quem controla a transação?
9. Quando ocorre autorização?
10. O que é idempotência?
11. O que é fingerprint da chave?
12. O que é replay idempotente?
13. O que é compensação?
14. Por que publicar after commit?
15. O controller pode acessar Repository?
16. Por que não retornar Entity?
17. Como tratar stale write?
18. Qual diferença entre Application e Domain Service?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Coordenador de um caso de uso.
2. Intenção executável com fluxo e resultado.
3. Interface de entrada da aplicação.
4. Contrato para persistência ou integração.
5. Intenção imutável.
6. Sucesso ou falha estável.
7. No domínio.
8. O Application Service.
9. Antes dos efeitos.
10. Proteção contra repetição duplicada.
11. Representação canônica do comando.
12. Devolver resultado sem reexecutar.
13. Ação que desfaz efeito externo anterior.
14. Evitar evento de mudança revertida.
15. Não.
16. Proteger internals e contratos.
17. Traduzir para conflito e reavaliar.
18. Application coordena; Domain Service decide regra.
19. Domain Events.
20. Domain Events.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 628 - M19.18 - Application Service Use Case

- Aprofundei Application Service e Use Case.
- Criei o laboratório `service-scheduling-use-cases`.
- Criei Application Service Charter e catálogo de casos de uso.
- Modelei input ports para agendar, confirmar, reagendar e cancelar.
- Criei commands imutáveis com actor, correlation ID e idempotency key.
- Criei results estáveis com códigos de falha.
- Mantive HTTP, JPA e transporte fora do core.
- Implementei autorização antes de side effects.
- Modelei `IdempotencyStore`, reservation, replay e fingerprint.
- Impedi reexecução de comandos concluídos.
- Criei `TransactionRunner` como output port.
- Mantive transaction API fora do domínio.
- Coordenei Service Request, Capacity, Domain Services e Aggregate Root.
- Mantive regras de negócio no domínio.
- Usei expected revision para concorrência.
- Modelei compensação de reserva externa.
- Registrei publicação somente após commit.
- Mantive controller fino.
- Traduzi exceções para resultados estáveis.
- Criei testes de autorização, idempotência, rollback, compensação e after commit.
- Criei architecture tests, reports, gate e evidence.
- Não antecipei Domain Events aprofundados ou Event Storming.
- Próxima aula: Domain Events.
```

---

## Referência técnica curta

- Application Service.
- Use Case.
- Input Port.
- Output Port.
- Command.
- Result.
- Authorization.
- Idempotency.
- Transaction Boundary.
- After Commit.

Regra final:

```text
Application Service deve coordenar uma intenção completa sem substituir o domínio: cada Use Case possui input port, command imutável, actor, correlation ID, idempotency key e result estável, autorização ocorre antes de qualquer efeito, idempotência é consultada e reservada antes de integrações, replay devolve o resultado anterior sem reexecução e reutilização da chave com payload diferente é rejeitada; a aplicação carrega snapshots e Aggregate Roots por output ports, chama Domain Services para decisões, chama comportamento da root para mudanças, salva com expected revision e traduz stale writes para conflito, mantendo HTTP, JPA, SQL e clients concretos nos adapters; o Application Service controla transaction boundary, registra compensações para efeitos externos, completa idempotência de forma coerente e encaminha eventos existentes somente por after commit, sem publicação em rollback; controllers apenas traduzem transporte, erros técnicos viram códigos seguros e observabilidade usa correlação sem dados sensíveis; o gate termina com ports, commands, results, autorização, idempotência, transação, domínio, compensação, after commit, erros, dependências, testes, arquitetura, documentação e evidence aprovados, enquanto Domain Events são aprofundados somente na aula 629 e Event Storming permanece reservado à aula 630.
```
