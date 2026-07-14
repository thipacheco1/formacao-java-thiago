# 627 - M19.17 - Domain Service

## Apresentação da aula

Na aula 626, você aprofundou Repository em DDD.

Você separou:

```text
domínio;

Aggregate Root;

contrato de Repository;

mapeamento;

JDBC;

JPA;

Spring Data;

queries de leitura;

concorrência otimista;

erros de persistência.
```

O domínio passou a depender apenas de:

```text
AppointmentRepository.
```

A infraestrutura ficou responsável por:

- SQL;
- registros;
- Entity JPA;
- Spring Data;
- optimistic locking;
- rehydration;
- tradução de erros técnicos;
- contract tests por implementação.

Agora surge uma nova pergunta:

```text
onde colocar
uma regra importante do domínio

quando ela não pertence
naturalmente

a uma única Entity,
Value Object
ou Aggregate Root?
```

Algumas regras pertencem claramente a um objeto: confirmação e cancelamento ficam no `Appointment`; sobreposição fica no `AppointmentWindow`.

Porém, outras regras dependem de conceitos externos ao Aggregate.

Exemplo:

```text
um novo compromisso
pode ser assumido

quando a solicitação está elegível,
a oferta de capacidade é compatível,
a janela respeita antecedência mínima
e não existe conflito operacional.
```

Essa decisão combina solicitação, oferta, janela, tempo e regras do domínio.

Colocar tudo dentro de `Appointment` seria incorreto porque o Appointment ainda não existe.

Colocar a regra no Repository seria incorreto porque Repository persiste Aggregates.

Colocar a regra no controller seria incorreto porque controller traduz transporte.

Colocar a regra em um utilitário genérico apagaria a linguagem.

DDD usa:

```text
Domain Service
```

para representar uma operação significativa do domínio que não pertence naturalmente a uma única Entity ou Value Object.

Um Domain Service fala a linguagem do domínio, representa uma regra focada, é stateless por padrão, recebe tipos do domínio e evita framework, orquestração e nomes genéricos.

Exemplos adequados:

```text
SchedulingEligibilityService;

AppointmentConflictPolicy;

ReschedulingDeadlinePolicy;

CapacityOfferSelectionPolicy.
```

Exemplos inadequados:

```text
DomainService;

AppointmentManager;

BusinessHelper;

AppointmentProcessor;

SchedulingUtils.
```

A pergunta será:

```text
como modelar
Domain Services

sem retirar comportamento
das Entities

e sem transformá-los
em Application Services
ou classes genéricas?
```

O laboratório será:

```text
labs/m19/aula-627-domain-service/service-scheduling-domain-services
```

Você irá construir quatro serviços de domínio:

```text
SchedulingEligibilityService;

AppointmentConflictPolicy;

ReschedulingDeadlinePolicy;

CapacityOfferSelectionPolicy.
```

Cada serviço terá uma responsabilidade: elegibilidade, conflito, prazo de reagendamento ou seleção de oferta.

O laboratório preservará comportamento na Aggregate Root e no Value Object, mantendo Repository, HTTP, DTOs e persistência fora do Domain Service.

Próxima aula:

```text
628 - M19.18 - Application Service Use Case
```

Por isso, esta aula não irá aprofundar:

- orquestração completa de casos de uso;
- autorização;
- transaction boundary de aplicação;
- carregamento de vários Repositories;
- publicação after commit;
- idempotência do caso de uso;
- DTOs de entrada e saída;
- controllers;
- handlers completos;
- retries de aplicação.

Depois virá:

```text
629 - M19.19 - Domain Events
```

Os Aggregates já podem registrar eventos conhecidos das aulas anteriores.

Nesta aula, Domain Events não serão aprofundados em modelagem, publicação, versionamento ou integração.

A regra central será:

```text
Domain Service existe
quando uma regra do domínio
não possui owner natural
em uma Entity ou Value Object;

ele não existe
para retirar comportamento
do modelo
nem para orquestrar aplicação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
625:
Aggregate Aggregate Root.

626:
Repository em DDD.

627:
Domain Service.

628:
Application Service Use Case.

629:
Domain Events.
```

A progressão é:

```text
proteger consistência;

persistir Aggregate Roots;

modelar regras sem owner natural;

orquestrar casos de uso;

representar fatos do domínio.
```

Nesta aula:

```text
Domain Service:
sim.

Policy de domínio:
sim.

regra entre conceitos:
sim.

serviço stateless:
sim.

Entity behavior:
preservado.

Value Object behavior:
preservado.

Repository:
usado apenas como contrato externo,
não dentro dos serviços principais.

Application Service:
não aprofundado.

Domain Events:
não aprofundados.

Spring:
não.

JPA:
não.

HTTP:
não.
```

O núcleo usará Java.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-627-domain-service/service-scheduling-domain-services
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/domainservices
│   │           ├── model
│   │           │   ├── Appointment.java
│   │           │   ├── AppointmentId.java
│   │           │   ├── AppointmentWindow.java
│   │           │   ├── AppointmentStatus.java
│   │           │   ├── ServiceRequestSnapshot.java
│   │           │   ├── ServiceRequestId.java
│   │           │   ├── ServiceAreaCode.java
│   │           │   ├── ServiceType.java
│   │           │   ├── CapacityOffer.java
│   │           │   ├── CapacityOfferId.java
│   │           │   ├── CapacityReservationId.java
│   │           │   ├── SchedulingDecision.java
│   │           │   ├── SchedulingRejection.java
│   │           │   ├── ConflictResult.java
│   │           │   ├── ReschedulingDecision.java
│   │           │   └── OfferSelectionResult.java
│   │           ├── service
│   │           │   ├── SchedulingEligibilityService.java
│   │           │   ├── AppointmentConflictPolicy.java
│   │           │   ├── ReschedulingDeadlinePolicy.java
│   │           │   └── CapacityOfferSelectionPolicy.java
│   │           ├── specification
│   │           │   ├── EligibleServiceRequest.java
│   │           │   ├── CompatibleCapacityOffer.java
│   │           │   └── FutureAppointmentWindow.java
│   │           ├── exception
│   │           │   ├── DomainPolicyViolation.java
│   │           │   └── NoSuitableCapacityOffer.java
│   │           └── support
│   │               ├── SchedulingClock.java
│   │               └── FixedSchedulingClock.java
│   └── test
│       └── java
│           └── br/com/formacao/domainservices
│               ├── service
│               │   ├── SchedulingEligibilityServiceTest.java
│               │   ├── AppointmentConflictPolicyTest.java
│               │   ├── ReschedulingDeadlinePolicyTest.java
│               │   └── CapacityOfferSelectionPolicyTest.java
│               ├── model
│               │   ├── AppointmentWindowTest.java
│               │   └── AppointmentBehaviorOwnershipTest.java
│               ├── specification
│               │   └── SchedulingSpecificationsTest.java
│               └── architecture
│                   ├── DomainServiceBoundaryTest.java
│                   ├── DomainServiceStatelessTest.java
│                   ├── BehaviorOwnershipTest.java
│                   └── DomainFrameworkIndependenceTest.java
├── domain-service
│   ├── DOMAIN_SERVICE_CHARTER.md
│   ├── BEHAVIOR_OWNERSHIP_MATRIX.md
│   ├── SERVICE_DECISION_GUIDE.md
│   ├── SERVICE_CATALOG.md
│   ├── INPUT_OUTPUT_CONTRACTS.md
│   ├── STATELESSNESS_POLICY.md
│   ├── FAILURE_DECISIONS.md
│   ├── TEST_STRATEGY.md
│   ├── SMELL_CATALOG.md
│   ├── EVOLUTION_LOG.md
│   └── OPEN_DOMAIN_SERVICE_QUESTIONS.md
├── contracts
│   ├── domain-service-contract.yaml
│   ├── behavior-ownership-policy.yaml
│   ├── domain-service-interface-policy.yaml
│   ├── statelessness-policy.yaml
│   ├── domain-policy-result-policy.yaml
│   ├── specification-policy.yaml
│   ├── dependency-policy.yaml
│   ├── failure-policy.yaml
│   ├── data-quality-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── behavior-ownership-report.yaml
    ├── domain-service-catalog-report.yaml
    ├── statelessness-report.yaml
    ├── dependency-report.yaml
    ├── failure-report.yaml
    ├── architecture-report.yaml
    └── domain-service-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-domain-services
├── validate-domain-service-contract.ps1
├── validate-behavior-ownership.ps1
├── validate-domain-service-interfaces.ps1
├── validate-domain-service-statelessness.ps1
├── validate-domain-policy-results.ps1
├── validate-specifications.ps1
├── validate-domain-service-dependencies.ps1
├── validate-domain-service-smells.ps1
├── run-domain-service-tests.ps1
├── collect-domain-service-evidence.ps1
└── verify-domain-service-gate.ps1
```

Ao final, haverá serviços focados e testáveis.

---

## Conceito essencial

### Domain Service

Operação de domínio que não pertence naturalmente a uma única Entity ou Value Object.

---

### Behavior Ownership

Decisão sobre qual elemento do modelo deve possuir determinado comportamento.

---

### Stateless Domain Service

Serviço que não mantém estado mutável entre chamadas.

---

### Domain Policy

Regra de domínio representada por objeto explicitamente nomeado.

---

### Policy Result

Objeto que comunica aprovação, rejeição, razões e dados derivados.

---

### Specification

Objeto que representa um predicado de domínio reutilizável.

---

### Application Service

Componente que coordena um caso de uso, transação, Repository e integrações.

---

### Domain Model Smell

Sinal de que o comportamento foi colocado em local inadequado.

---

### Anemic Model

Modelo em que Entities carregam dados, enquanto serviços externos concentram todo comportamento.

---

### Service Explosion

Criação excessiva de serviços pequenos sem responsabilidade ou linguagem claras.

---

### Temporal Policy

Regra baseada em tempo, com relógio explícito.

---

### Pure Domain Function

Função determinística baseada apenas em entradas do domínio.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-627-domain-service/service-scheduling-domain-services

Set-Location `
  labs/m19/aula-627-domain-service/service-scheduling-domain-services
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/domain-service-contract.yaml
```

Conteúdo:

```yaml
domainService:
  context:
    Service-Scheduling

  required:
    - behavior-ownership-review
    - domain-language
    - focused-responsibility
    - statelessness
    - domain-inputs
    - domain-outputs
    - deterministic-tests
    - framework-independence
    - explicit-failure
    - architecture-rules

  forbidden:
    - entity-behavior-theft
    - application-orchestration
    - transaction-control
    - HTTP
    - persistence-implementation
    - event-publication
    - generic-service-name
    - mutable-shared-state
    - application-service-deep-dive
    - domain-events-deep-dive

  nextLesson:
    code:
      M19.18
```

---

### 3. Criar Domain Service Charter

Arquivo:

```text
domain-service/DOMAIN_SERVICE_CHARTER.md
```

Conteúdo:

```markdown
# Domain Service Charter

## Contexto

Service Scheduling.

## Objetivo

Representar regras relevantes
que não pertencem naturalmente
a uma única Entity
ou Value Object.

## Serviços aprovados

- SchedulingEligibilityService;
- AppointmentConflictPolicy;
- ReschedulingDeadlinePolicy;
- CapacityOfferSelectionPolicy.

## Regras

- linguagem do domínio;
- uma responsabilidade;
- stateless por padrão;
- Java puro;
- sem Repository técnico;
- sem transação;
- sem publicação de eventos;
- sem DTO de transporte.

## Fora de escopo

- controller;
- application orchestration;
- persistence;
- authorization;
- messaging;
- logging técnico;
- retries;
- workflow.
```

---

### 4. Criar matriz de ownership

Arquivo:

```text
domain-service/BEHAVIOR_OWNERSHIP_MATRIX.md
```

Exemplo:

```text
Comportamento
| Owner
| Motivo

confirmar Appointment
| Appointment
| muda estado da root

comparar janelas
| AppointmentWindow
| usa somente seus valores

validar ServiceAreaCode
| ServiceAreaCode
| invariante do valor

avaliar solicitação + oferta + tempo
| SchedulingEligibilityService
| combina conceitos independentes

detectar conflito entre appointments
| AppointmentConflictPolicy
| compara múltiplos objetos

calcular deadline de reagendamento
| ReschedulingDeadlinePolicy
| política temporal externa à Entity

escolher oferta entre opções
| CapacityOfferSelectionPolicy
| decisão entre múltiplos candidatos

carregar Appointment
| Application Service
| orquestra Repository
```

---

### 5. Criar policy de ownership

Arquivo:

```text
contracts/behavior-ownership-policy.yaml
```

Conteúdo:

```yaml
behaviorOwnership:
  prefer:
    - entity
    - value-object
    - aggregate-root

  domainService:
    allowedWhen:
      - no-natural-single-owner
      - multiple-domain-concepts
      - named-domain-operation

  entityBehaviorTheft:
    forbidden

  genericHelper:
    forbidden

  ownershipDecision:
    documented:
      required
```

---

### 6. Criar guia de decisão

Arquivo:

```text
domain-service/SERVICE_DECISION_GUIDE.md
```

Pergunte:

```text
a regra usa apenas o estado
de uma Entity?
```

Se sim:

```text
coloque na Entity.
```

Pergunte:

```text
a regra usa apenas os valores
de um Value Object?
```

Se sim:

```text
coloque no Value Object.
```

Pergunte:

```text
a regra coordena Repository,
transação,
autorização
ou integração?
```

Se sim:

```text
é Application Service
ou infraestrutura.
```

Pergunte:

```text
a regra combina conceitos
sem owner natural
e possui nome de domínio?
```

Se sim:

```text
Domain Service pode ser adequado.
```

---

### 7. Criar `ServiceRequestSnapshot`

```java
public record ServiceRequestSnapshot(
        ServiceRequestId id,
        ServiceType serviceType,
        ServiceAreaCode serviceAreaCode,
        boolean eligible,
        Instant requestedAt) {

    public ServiceRequestSnapshot {
        Objects.requireNonNull(id);
        Objects.requireNonNull(serviceType);
        Objects.requireNonNull(serviceAreaCode);
        Objects.requireNonNull(requestedAt);
    }
}
```

É um snapshot de dados necessários.

Não é a Entity completa de outro contexto.

---

### 8. Criar `CapacityOffer`

```java
public record CapacityOffer(
        CapacityOfferId id,
        ServiceAreaCode serviceAreaCode,
        Set<ServiceType> supportedServices,
        AppointmentWindow window,
        int priority,
        boolean reservable) {

    public CapacityOffer {
        Objects.requireNonNull(id);
        Objects.requireNonNull(serviceAreaCode);
        supportedServices =
                Set.copyOf(supportedServices);
        Objects.requireNonNull(window);

        if (priority < 0) {
            throw new DomainPolicyViolation(
                    "Offer priority cannot be negative");
        }
    }

    public boolean supports(
            ServiceType serviceType) {

        return supportedServices.contains(
                serviceType);
    }
}
```

O comportamento local permanece no Value Object.

---

### 9. Criar `SchedulingDecision`

```java
public sealed interface SchedulingDecision {

    record Approved(
            CapacityOfferId offerId,
            AppointmentWindow window)
            implements SchedulingDecision {
    }

    record Rejected(
            List<SchedulingRejection> reasons)
            implements SchedulingDecision {

        public Rejected {
            reasons =
                    List.copyOf(reasons);

            if (reasons.isEmpty()) {
                throw new IllegalArgumentException(
                        "Rejection requires reasons");
            }
        }
    }
}
```

A decisão evita retornar apenas `boolean`.

---

### 10. Criar rejeições

```java
public enum SchedulingRejection {
    REQUEST_NOT_ELIGIBLE,
    SERVICE_AREA_MISMATCH,
    SERVICE_NOT_SUPPORTED,
    OFFER_NOT_RESERVABLE,
    WINDOW_IN_THE_PAST,
    MINIMUM_NOTICE_NOT_RESPECTED
}
```

Os motivos pertencem à linguagem do domínio.

---

### 11. Criar `SchedulingClock`

```java
public interface SchedulingClock {

    Instant now();
}
```

Implementação de teste:

```java
public record FixedSchedulingClock(
        Instant fixed)
        implements SchedulingClock {

    @Override
    public Instant now() {
        return fixed;
    }
}
```

Tempo explícito torna a policy testável.

---

### 12. Criar Eligibility Service

```java
public final class SchedulingEligibilityService {

    private final SchedulingClock clock;
    private final Duration minimumNotice;

    public SchedulingEligibilityService(
            SchedulingClock clock,
            Duration minimumNotice) {

        this.clock =
                Objects.requireNonNull(clock);

        this.minimumNotice =
                requirePositive(
                        minimumNotice);
    }

    public SchedulingDecision evaluate(
            ServiceRequestSnapshot request,
            CapacityOffer offer) {

        List<SchedulingRejection> reasons =
                new ArrayList<>();

        if (!request.eligible()) {
            reasons.add(
                    SchedulingRejection
                            .REQUEST_NOT_ELIGIBLE);
        }

        if (!request.serviceAreaCode()
                .equals(
                        offer.serviceAreaCode())) {
            reasons.add(
                    SchedulingRejection
                            .SERVICE_AREA_MISMATCH);
        }

        if (!offer.supports(
                request.serviceType())) {
            reasons.add(
                    SchedulingRejection
                            .SERVICE_NOT_SUPPORTED);
        }

        if (!offer.reservable()) {
            reasons.add(
                    SchedulingRejection
                            .OFFER_NOT_RESERVABLE);
        }

        Instant minimumStart =
                clock.now()
                        .plus(minimumNotice);

        if (offer.window()
                .startsAt()
                .isBefore(minimumStart)) {
            reasons.add(
                    SchedulingRejection
                            .MINIMUM_NOTICE_NOT_RESPECTED);
        }

        if (!reasons.isEmpty()) {
            return new SchedulingDecision.Rejected(
                    reasons);
        }

        return new SchedulingDecision.Approved(
                offer.id(),
                offer.window());
    }
}
```

O serviço avalia sem reservar capacidade ou salvar Appointment.

---

### 13. Por que não colocar em `Appointment`

O Appointment ainda não existe durante a avaliação inicial.

A regra combina request, offer, relógio e antecedência; nenhum objeto possui sozinho a decisão.

Esse é um uso adequado de Domain Service.

---

### 14. Por que não usar `boolean`

Um `boolean` não explica falhas, oferta aprovada ou janela considerada.

`SchedulingDecision` preserva significado.

---

### 15. Criar result policy

Arquivo:

```text
contracts/domain-policy-result-policy.yaml
```

Conteúdo:

```yaml
policyResult:
  booleanOnly:
    discouraged

  approved:
    mayContain:
      - selected-identity
      - derived-value

  rejected:
    requires:
      - domain-reason

  technicalError:
    forbidden

  mutableCollection:
    forbidden
```

---

### 16. Criar Specifications

```java
public final class EligibleServiceRequest {

    public boolean isSatisfiedBy(
            ServiceRequestSnapshot request) {

        return request.eligible();
    }
}
```

```java
public final class CompatibleCapacityOffer {

    public boolean isSatisfiedBy(
            ServiceRequestSnapshot request,
            CapacityOffer offer) {

        return request.serviceAreaCode()
                        .equals(
                                offer.serviceAreaCode())
                && offer.supports(
                        request.serviceType())
                && offer.reservable();
    }
}
```

---

### 17. Specification versus Domain Service

Specification representa:

```text
um predicado.
```

Domain Service pode combinar Specifications, produzir decisão rica, calcular ou selecionar.

Não transforme qualquer `if` em Specification.

---

### 18. Criar specification policy

Arquivo:

```text
contracts/specification-policy.yaml
```

Conteúdo:

```yaml
specification:
  represents:
    domain-predicate:
      required

  composable:
    preferred

  result:
    boolean-or-predicate-result

  forbidden:
    - persistence-query-detail
    - application-orchestration
    - generic-condition-wrapper
    - technical-validation
```

---

### 19. Criar Conflict Result

```java
public sealed interface ConflictResult {

    record NoConflict()
            implements ConflictResult {
    }

    record ConflictDetected(
            List<AppointmentId> conflictingAppointments)
            implements ConflictResult {

        public ConflictDetected {
            conflictingAppointments =
                    List.copyOf(
                            conflictingAppointments);
        }
    }
}
```

---

### 20. Criar Conflict Policy

```java
public final class AppointmentConflictPolicy {

    public ConflictResult evaluate(
            AppointmentWindow candidate,
            Collection<Appointment> existing) {

        List<AppointmentId> conflicts =
                existing.stream()
                        .filter(Appointment::isActive)
                        .filter(
                                appointment ->
                                        appointment.window()
                                                .overlaps(
                                                        candidate))
                        .map(Appointment::id)
                        .toList();

        if (conflicts.isEmpty()) {
            return new ConflictResult.NoConflict();
        }

        return new ConflictResult.ConflictDetected(
                conflicts);
    }
}
```

A policy recebe appointments já carregados, sem Repository.

---

### 21. Evitar Repository dentro da policy

Exemplo inadequado:

```java
public boolean hasConflict(
        AppointmentWindow window) {

    return repository
            .findAllActive()
            .stream()
            .anyMatch(...);
}
```

Isso mistura busca e regra, esconde custo e cria dependência de persistência.

A camada de aplicação carregará os dados na aula 628.

---

### 22. Criar dependency policy

Arquivo:

```text
contracts/dependency-policy.yaml
```

Conteúdo:

```yaml
domainServiceDependency:
  allowed:
    - domain-model
    - value-object
    - domain-policy
    - domain-clock
    - pure-domain-port-when-justified

  forbidden:
    - HTTP-client
    - framework
    - entity-manager
    - JDBC
    - Spring-Data
    - transaction-manager
    - event-publisher
    - controller
    - DTO
```

---

### 23. Criar `ReschedulingDecision`

```java
public sealed interface ReschedulingDecision {

    record Allowed(
            Instant deadline)
            implements ReschedulingDecision {
    }

    record Denied(
            Instant deadline,
            ReschedulingDenial reason)
            implements ReschedulingDecision {
    }
}
```

```java
public enum ReschedulingDenial {
    APPOINTMENT_NOT_ACTIVE,
    DEADLINE_EXCEEDED,
    NEW_WINDOW_NOT_IN_FUTURE
}
```

---

### 24. Criar Deadline Policy

```java
public final class ReschedulingDeadlinePolicy {

    private final SchedulingClock clock;
    private final Duration minimumNotice;

    public ReschedulingDeadlinePolicy(
            SchedulingClock clock,
            Duration minimumNotice) {

        this.clock =
                Objects.requireNonNull(clock);

        this.minimumNotice =
                requirePositive(
                        minimumNotice);
    }

    public ReschedulingDecision evaluate(
            Appointment appointment,
            AppointmentWindow requestedWindow) {

        Instant deadline =
                appointment.window()
                        .startsAt()
                        .minus(minimumNotice);

        if (!appointment.isActive()) {
            return new ReschedulingDecision.Denied(
                    deadline,
                    ReschedulingDenial
                            .APPOINTMENT_NOT_ACTIVE);
        }

        if (clock.now().isAfter(deadline)) {
            return new ReschedulingDecision.Denied(
                    deadline,
                    ReschedulingDenial
                            .DEADLINE_EXCEEDED);
        }

        if (!requestedWindow.startsAt()
                .isAfter(clock.now())) {
            return new ReschedulingDecision.Denied(
                    deadline,
                    ReschedulingDenial
                            .NEW_WINDOW_NOT_IN_FUTURE);
        }

        return new ReschedulingDecision.Allowed(
                deadline);
    }
}
```

---

### 25. Por que usar relógio como dependência

Evite:

```java
Instant.now()
```

dentro da policy.

Com relógio explícito, testes de borda são determinísticos e não dependem de estado global.

---

### 26. Statelessness

O serviço possui dependências imutáveis:

```text
clock;
minimumNotice.
```


O serviço não armazena:

- último request;
- último resultado;
- cache de appointments;
- usuário;
- transação;
- Entity carregada;
- contador mutável.

---

### 27. Criar statelessness policy

Arquivo:

```text
contracts/statelessness-policy.yaml
```

Conteúdo:

```yaml
statelessness:
  mutableBusinessState:
    forbidden

  immutableConfiguration:
    allowed

  collaborators:
    mustBe:
      - explicit
      - immutable-reference
      - domain-oriented

  requestScopedState:
    localVariable:
      required

  globalCache:
    forbidden

  lastResultField:
    forbidden
```

---

### 28. Criar oferta selecionada

```java
public sealed interface OfferSelectionResult {

    record Selected(
            CapacityOffer offer)
            implements OfferSelectionResult {
    }

    record NoneSuitable(
            List<CapacityOfferId> evaluatedOffers)
            implements OfferSelectionResult {

        public NoneSuitable {
            evaluatedOffers =
                    List.copyOf(evaluatedOffers);
        }
    }
}
```

---

### 29. Criar Selection Policy

```java
public final class CapacityOfferSelectionPolicy {

    private final SchedulingEligibilityService
            eligibility;

    public CapacityOfferSelectionPolicy(
            SchedulingEligibilityService eligibility) {

        this.eligibility =
                Objects.requireNonNull(
                        eligibility);
    }

    public OfferSelectionResult select(
            ServiceRequestSnapshot request,
            Collection<CapacityOffer> offers) {

        List<CapacityOffer> approved =
                offers.stream()
                        .filter(
                                offer ->
                                        eligibility.evaluate(
                                                request,
                                                offer)
                                                instanceof
                                                SchedulingDecision.Approved)
                        .sorted(
                                Comparator
                                        .comparingInt(
                                                CapacityOffer::priority)
                                        .thenComparing(
                                                offer ->
                                                        offer.window()
                                                                .startsAt()))
                        .toList();

        if (approved.isEmpty()) {
            return new OfferSelectionResult.NoneSuitable(
                    offers.stream()
                            .map(CapacityOffer::id)
                            .toList());
        }

        return new OfferSelectionResult.Selected(
                approved.getFirst());
    }
}
```

A policy seleciona opções já disponíveis.

---

### 30. Evitar busca dentro da Selection Policy

Não injete:

```text
CapacityClient;
CapacityRepository;
WebClient.
```

A policy não descobre ofertas.

Ela decide entre ofertas recebidas.

Descoberta pertence à orquestração.

---

### 31. Criar interface policy

Arquivo:

```text
contracts/domain-service-interface-policy.yaml
```

Conteúdo:

```yaml
domainServiceInterface:
  name:
    domain-language:
      required

  method:
    explicit-domain-verb:
      required

  inputs:
    domain-types:
      required

  outputs:
    domain-result:
      required

  forbidden:
    - Object
    - Map
    - DTO
    - Request
    - Response
    - framework-type
    - technical-exception
```

---

### 32. Exceção versus resultado

Use resultado para aprovação e rejeição esperadas. Use exceção para contrato inválido, configuração incorreta ou estado impossível.

Não use exceção para todo resultado negativo esperado.

---

### 33. Criar failure decisions

Arquivo:

```text
domain-service/FAILURE_DECISIONS.md
```

Exemplo:

```text
request inelegível:
resultado Rejected.

oferta incompatível:
resultado Rejected.

nenhuma oferta adequada:
NoneSuitable.

minimumNotice negativo:
DomainPolicyViolation.

input nulo:
rejeição de contrato.

status impossível:
falha de qualidade do modelo.
```

---

### 34. Evitar Domain Service anêmico

Exemplo:

```java
public final class AppointmentDomainService {

    public void confirm(
            Appointment appointment) {

        appointment.setStatus(
                AppointmentStatus.CONFIRMED);
    }
}
```

Isso rouba comportamento da Entity.

O correto é:

```java
appointment.confirm(occurredAt);
```

---

### 35. Evitar Manager

Exemplo:

```java
AppointmentManager
```

com métodos:

- create;
- update;
- delete;
- confirm;
- reschedule;
- cancel;
- send;
- save;
- validate.

Essa classe mistura domínio, aplicação, infraestrutura e transporte.

Quebre por ownership real.

---

### 36. Evitar service por tabela

Não crie:

```text
AppointmentStatusService;

AppointmentHistoryService;

AppointmentWindowService.
```

A existência de uma tabela ou classe não justifica um Domain Service.

---

### 37. Evitar service por verbo técnico

Nomes inadequados:

```text
ValidateService;

ProcessService;

ExecuteService;

UpdateService;

CalculationService.
```

Nomes adequados:

```text
SchedulingEligibilityService;

AppointmentConflictPolicy;

ReschedulingDeadlinePolicy.
```

O nome revela o conceito.

---

### 38. Criar smell catalog

Arquivo:

```text
domain-service/SMELL_CATALOG.md
```

Smells:

```text
SMELL-001:
service altera campo interno da Entity.

SMELL-002:
service chama Repository.

SMELL-003:
service abre transação.

SMELL-004:
service retorna DTO.

SMELL-005:
service possui nome genérico.

SMELL-006:
service mantém estado da última chamada.

SMELL-007:
service publica evento.

SMELL-008:
service contém regra que cabe em Value Object.

SMELL-009:
service possui dezenas de métodos.

SMELL-010:
service depende de framework.
```

---

### 39. Criar architecture test

```java
@ArchTest
static final ArchRule domainServicesMustRemainPure =
        noClasses()
                .that()
                .resideInAPackage(
                        "..service..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "org.springframework..",
                        "jakarta.persistence..",
                        "java.sql..",
                        "..infrastructure..",
                        "..controller..");
```

---

### 40. Testar nomes e localização

```java
@ArchTest
static final ArchRule domainServicesMustHaveDomainNames =
        classes()
                .that()
                .resideInAPackage(
                        "..service..")
                .should()
                .haveSimpleNameEndingWith(
                        "Service")
                .orShould()
                .haveSimpleNameEndingWith(
                        "Policy");
```

Essa regra auxilia a revisão humana.

---

### 41. Testar statelessness

Use reflexão para procurar:

- campos não finais;
- collections mutáveis;
- `ThreadLocal`;
- `static` mutável;
- último resultado;
- Entity armazenada.

Exceções precisam de justificativa documentada.

---

### 42. Testar Eligibility aprovado

```java
@Test
void shouldApproveCompatibleOffer() {

    SchedulingEligibilityService service =
            Fixtures.eligibilityService();

    SchedulingDecision result =
            service.evaluate(
                    Fixtures.eligibleRequest(),
                    Fixtures.compatibleOffer());

    assertInstanceOf(
            SchedulingDecision.Approved.class,
            result);
}
```

---

### 43. Testar múltiplas rejeições

```java
@Test
void shouldReportAllRelevantRejections() {

    SchedulingDecision result =
            service.evaluate(
                    Fixtures.ineligibleRequest(),
                    Fixtures.incompatibleOffer());

    SchedulingDecision.Rejected rejected =
            assertInstanceOf(
                    SchedulingDecision.Rejected.class,
                    result);

    assertTrue(
            rejected.reasons()
                    .contains(
                            SchedulingRejection
                                    .REQUEST_NOT_ELIGIBLE));

    assertTrue(
            rejected.reasons()
                    .contains(
                            SchedulingRejection
                                    .SERVICE_AREA_MISMATCH));
}
```

Não pare no primeiro erro quando o domínio precisa de diagnóstico completo.

---

### 44. Testar notice boundary

Cenários:

```text
janela exatamente no limite:
aprovada.

um nanossegundo antes:
rejeitada.

relógio depois do limite:
rejeitada.

minimumNotice inválido:
falha de configuração.
```

Regras temporais exigem bordas explícitas.

---

### 45. Testar conflito

Cenários:

- sem appointments;
- appointment cancelado;
- janela antes;
- janela depois;
- sobreposição parcial;
- janela contida;
- mesma janela;
- múltiplos conflitos.

---

### 46. Testar deadline

Valide:

- Appointment ativo;
- Appointment cancelado;
- deadline futuro;
- deadline exato;
- deadline ultrapassado;
- nova janela no passado;
- relógio fixo.

Defina se o instante exato é permitido.

No laboratório:

```text
agora igual ao deadline:
permitido.
```

---

### 47. Testar seleção

Valide:

- prioridade menor vence;
- empate usa início mais cedo;
- ofertas incompatíveis são ignoradas;
- lista vazia retorna `NoneSuitable`;
- input não é alterado;
- resultado é determinístico.

---

### 48. Testar ownership

`AppointmentBehaviorOwnershipTest` valida que:

- `confirm` existe em `Appointment`;
- `cancel` existe em `Appointment`;
- `overlaps` existe em `AppointmentWindow`;
- Domain Services não possuem setters de status;
- nenhum serviço usa reflexão para mutar a root.

---

### 49. Testar ausência de Repository

`DomainServiceBoundaryTest` procura:

```text
Repository;
JpaRepository;
EntityManager;
JdbcTemplate;
WebClient;
RestClient;
KafkaTemplate.
```

Nenhum pode ser dependência dos serviços.

---

### 50. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  genericDomainServiceName:
    action:
      FAIL

  entityBehaviorInsideService:
    action:
      FAIL

  mutableServiceState:
    action:
      FAIL

  frameworkDependency:
    action:
      FAIL

  booleanWithoutDomainMeaning:
    result:
      REVIEW

  technicalTypeInSignature:
    action:
      FAIL

  hiddenClock:
    action:
      FAIL
```

---

### 51. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  expectedDomainRejection:
    result:
      domain-result

  invalidPolicyConfiguration:
    action:
      THROW_DOMAIN_POLICY_VIOLATION

  invalidInput:
    action:
      REJECT_CONTRACT

  frameworkDependency:
    action:
      FAIL

  entityBehaviorTheft:
    action:
      FAIL

  ApplicationServiceDeepDive:
    deferredToLesson628

  DomainEventsDeepDive:
    deferredToLesson629
```

---

### 52. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson628:
    forbidden:
      - full-use-case-orchestration
      - transaction-boundary
      - authorization
      - Repository-loading-workflow
      - after-commit-publication

  lesson629:
    forbidden:
      - event-versioning-deep-dive
      - event-dispatcher
      - outbox
      - integration-event-design

  allowed:
    - existing-domain-event-reference
    - application-layer-placeholder
```

---

### 53. Criar Service Catalog

Arquivo:

```text
domain-service/SERVICE_CATALOG.md
```

Para cada serviço, registre:

- nome;
- propósito;
- owner;
- inputs;
- output;
- dependências;
- pureza;
- falhas;
- testes;
- motivo para não estar em Entity;
- motivo para não ser Application Service.

---

### 54. Criar Input/Output Contracts

Arquivo:

```text
domain-service/INPUT_OUTPUT_CONTRACTS.md
```

Exemplo:

```text
SchedulingEligibilityService

Input:
ServiceRequestSnapshot;
CapacityOffer.

Output:
SchedulingDecision.

Não aceita:
DTO;
Map;
JSON;
Entity JPA;
HTTP request.

Não executa:
save;
reserve;
publish;
authorize.
```

---

### 55. Criar Evolution Log

Arquivo:

```text
domain-service/EVOLUTION_LOG.md
```

Exemplo:

```markdown
## DS-DEC-003

Decisão:
AppointmentConflictPolicy
não acessará Repository.

Motivo:
Separar carregamento
de avaliação do domínio.

Consequência:
Application Service
deve fornecer appointments relevantes.

Revisão:
Após aula 628.
```

---

### 56. Criar perguntas abertas

Arquivo:

```text
domain-service/OPEN_DOMAIN_SERVICE_QUESTIONS.md
```

Exemplos:

- conflito é por cliente, técnico, endereço ou solicitação?
- minimum notice varia por serviço?
- feriados pertencem à policy?
- oferta prioritária pode ser mais tarde?
- appointment confirmado possui deadline diferente?
- todas as rejeições devem ser apresentadas?
- a policy aceita snapshot de outro contexto?
- qual dado externo pode ficar desatualizado?
- selection policy pertence a Scheduling ou Capacity?

Cada pergunta precisa de owner.

---

### 57. Validar ownership

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-behavior-ownership.ps1
```

Confirme:

- comportamento local em Entity;
- comportamento de valor no Value Object;
- regra sem owner no Domain Service;
- orquestração fora do domínio.

---

### 58. Validar interfaces

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-interfaces.ps1
```

Procure:

- DTO;
- Map;
- Object;
- framework;
- exception técnica;
- nome genérico;
- método `process`.

---

### 59. Validar statelessness

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-statelessness.ps1
```

Confirme:

- campos finais;
- sem estado da chamada;
- sem cache global;
- sem Entity armazenada;
- relógio explícito.

---

### 60. Validar policy results

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-policy-results.ps1
```

Confirme:

- resultados imutáveis;
- rejeições com motivo;
- sem códigos técnicos;
- sem collections mutáveis;
- sem `null`.

---

### 61. Validar Specifications

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-specifications.ps1
```

Confirme:

- predicado de domínio;
- nome específico;
- sem SQL;
- sem Repository;
- sem wrapper vazio;
- testes de composição.

---

### 62. Validar dependências

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-dependencies.ps1
```

Procure:

- Spring;
- JPA;
- JDBC;
- HTTP;
- mensageria;
- transaction manager;
- Repository técnico;
- controller.

---

### 63. Validar smells

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-smells.ps1
```

Gere findings para:

- Manager;
- Helper;
- Utils;
- Processor;
- service com muitos métodos;
- service com estado;
- service roubando Entity;
- service orquestrando aplicação.

---

### 64. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-domain-services\run-domain-service-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- elegibilidade;
- conflitos;
- deadline;
- seleção;
- Specifications;
- ownership;
- statelessness;
- arquitetura.

---

### 65. Criar reports

Exemplo:

```yaml
domainServiceCatalog:
  services:
    - SchedulingEligibilityService
    - AppointmentConflictPolicy
    - ReschedulingDeadlinePolicy
    - CapacityOfferSelectionPolicy

  genericNames:
    0

  frameworkDependencies:
    0

  mutableStateFields:
    0

  repositoryDependencies:
    0

  entityBehaviorTheft:
    0

  result:
    PASS
```

---

### 66. Criar gate

O gate valida:

```text
charter;

ownership;

service catalog;

interfaces;

inputs;

outputs;

statelessness;

policy results;

Specifications;

dependencies;

failure decisions;

smells;

tests;

architecture;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_OWNERSHIP;

FAIL_INTERFACE;

FAIL_STATELESSNESS;

FAIL_POLICY_RESULT;

FAIL_SPECIFICATION;

FAIL_DEPENDENCY;

FAIL_ENTITY_BEHAVIOR_THEFT;

FAIL_GENERIC_SERVICE;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 67. Coletar evidence

Arquivo:

```text
contracts/domain-service-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context;
- domain service count;
- policy count;
- specification count;
- ownership status;
- interface status;
- statelessness status;
- result status;
- dependency status;
- smell count;
- framework dependency count;
- Repository dependency count;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- IDs reais;
- ofertas reais;
- regras comerciais reais;
- Application Service completo;
- Domain Events aprofundados.

---

### 68. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-contract.ps1

.\scripts\m19\service-scheduling-domain-services\validate-behavior-ownership.ps1

.\scripts\m19\service-scheduling-domain-services\validate-domain-service-interfaces.ps1

.\scripts\m19\service-scheduling-domain-services\validate-domain-service-statelessness.ps1

.\scripts\m19\service-scheduling-domain-services\validate-domain-policy-results.ps1

.\scripts\m19\service-scheduling-domain-services\validate-specifications.ps1

.\scripts\m19\service-scheduling-domain-services\validate-domain-service-dependencies.ps1

.\scripts\m19\service-scheduling-domain-services\validate-domain-service-smells.ps1

.\scripts\m19\service-scheduling-domain-services\run-domain-service-tests.ps1

.\scripts\m19\service-scheduling-domain-services\collect-domain-service-evidence.ps1

.\scripts\m19\service-scheduling-domain-services\verify-domain-service-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 69. Encerrar o laboratório

Confirme:

- serviços nomeados pelo domínio;
- ownership documentado;
- comportamento local preservado;
- serviços stateless;
- relógio explícito;
- inputs e outputs de domínio;
- resultados ricos;
- rejeições com razões;
- Specifications focadas;
- zero Repository nos serviços;
- zero framework;
- zero transação;
- zero publicação de eventos;
- zero DTO técnico;
- Application Service não antecipado;
- Domain Events não aprofundados;
- reports sanitizados.

---

## Entendendo o que foi feito

### O comportamento ganhou owner

Regras locais permaneceram em Entities e Value Objects.

### Os serviços ganharam propósito

Cada Domain Service passou a representar uma decisão nomeada.

### A elegibilidade ganhou resultado rico

Aprovação e rejeições deixaram de ser apenas `boolean`.

### O tempo ganhou dependência explícita

Policies temporais tornaram-se determinísticas.

### Os conflitos ganharam avaliação pura

A policy recebeu objetos já carregados.

### A seleção ganhou critério

Ofertas foram ordenadas por regras do domínio.

### Statelessness ganhou proteção

Nenhum serviço manteve estado entre chamadas.

### As dependências ganharam limite

Frameworks, Repositories e clients ficaram fora.

### As Specifications ganharam papel

Predicados reutilizáveis deixaram de se misturar com orquestração.

### Os smells ganharam detecção

Managers, Helpers e Processors passaram a ser revisados.

---

## Erros comuns importantes

### Criar Domain Service para qualquer regra

Comportamento é retirado do modelo.

### Colocar `confirm` em serviço

A Aggregate Root perde autoridade.

### Injetar Repository

O serviço começa a orquestrar aplicação.

### Injetar HTTP client

O domínio passa a depender de infraestrutura.

### Retornar `boolean`

Razões e decisões são perdidas.

### Usar `Instant.now()`

Testes temporais ficam instáveis.

### Criar Manager ou Helper

A linguagem do domínio desaparece.

### Manter estado da última chamada

O serviço deixa de ser stateless.

### Publicar evento

Persistência e aplicação se misturam.

### Antecipar Application Service

A aula perde o foco em regras sem owner natural.

---

## Comandos úteis

### Validar ownership

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-behavior-ownership.ps1
```

### Validar statelessness

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-statelessness.ps1
```

### Validar dependências

```powershell
.\scripts\m19\service-scheduling-domain-services\validate-domain-service-dependencies.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-domain-services\run-domain-service-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-domain-services\verify-domain-service-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Ownership

Classifique cada comportamento.

### Parte 2 — Elegibilidade

Crie uma decisão rica.

### Parte 3 — Tempo

Use relógio explícito.

### Parte 4 — Conflito

Avalie appointments já carregados.

### Parte 5 — Deadline

Modele policy temporal.

### Parte 6 — Seleção

Escolha oferta por critérios.

### Parte 7 — Specifications

Modele predicados reutilizáveis.

### Parte 8 — Statelessness

Remova estado mutável.

### Parte 9 — Smells

Detecte Manager, Helper e Processor.

### Parte 10 — Gate

Valide serviços, testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 626 e ponte para a aula 628 foram preservadas;
- o laboratório `service-scheduling-domain-services` foi criado;
- Domain Service Charter foi criado;
- matriz de behavior ownership foi criada;
- comportamentos locais permanecem em Entities;
- comportamentos de valor permanecem em Value Objects;
- `SchedulingEligibilityService` representa regra sem owner natural;
- `AppointmentConflictPolicy` compara appointments já carregados;
- `ReschedulingDeadlinePolicy` usa relógio explícito;
- `CapacityOfferSelectionPolicy` seleciona opções já recebidas;
- nenhum Domain Service carrega Repository;
- nenhum Domain Service abre transação;
- nenhum Domain Service chama HTTP;
- nenhum Domain Service publica eventos;
- nenhum Domain Service usa Spring, JPA ou JDBC;
- serviços são stateless por padrão;
- dependências são finais e explícitas;
- nenhum serviço guarda último resultado;
- inputs usam tipos de domínio;
- outputs usam resultados de domínio;
- rejeições esperadas não usam exception técnica;
- `SchedulingDecision` contém razões;
- conflitos retornam IDs;
- policy temporal possui testes de borda;
- seleção é determinística;
- Specifications representam predicados;
- Specifications não escondem SQL;
- relógio global foi evitado;
- nomes genéricos foram proibidos;
- Manager, Helper, Utils e Processor foram tratados como smells;
- behavior theft foi testado;
- contract e architecture tests foram criados;
- Application Service completo não foi antecipado;
- Domain Events não foram aprofundados;
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
  labs/m19/aula-627-domain-service/service-scheduling-domain-services `
  scripts/m19/service-scheduling-domain-services `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|realCustomer|realCapacity|JpaRepository|EntityManager|WebClient|KafkaTemplate|TransactionTemplate|fullApplicationService|domainEventsDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar Domain Services"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- regras comerciais reais;
- Spring;
- JPA;
- HTTP client;
- Application Service completo;
- Domain Events aprofundados.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Domain Service.

Você criou:

```text
Domain Service Charter;

behavior ownership matrix;

SchedulingEligibilityService;

AppointmentConflictPolicy;

ReschedulingDeadlinePolicy;

CapacityOfferSelectionPolicy;

policy results;

Specifications;

statelessness policy;

smell catalog;

architecture tests.
```

Você comprovou que Domain Service representa uma regra sem owner natural; que comportamento local deve permanecer em Entity ou Value Object; que serviços não devem carregar Repository, abrir transação ou publicar eventos; que resultados ricos preservam razões; que relógio explícito torna policies temporais testáveis; que seleção deve receber opções já carregadas; e que nomes específicos protegem a linguagem.

A próxima aula será:

```text
628 - M19.18 - Application Service Use Case
```

Nela, você irá aprofundar como coordenar Repository, Domain Services, Aggregate Root, transação, autorização, idempotência, publicação after commit e resultados do caso de uso.

Nenhum aprofundamento completo de Application Service ou Domain Events foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei behavior ownership.
- [ ] Mantive comportamento nas Entities.
- [ ] Criei serviços com nomes de domínio.
- [ ] Mantive serviços stateless.
- [ ] Usei relógio explícito.
- [ ] Retornei resultados ricos.
- [ ] Evitei Repository e framework.
- [ ] Testei smells e arquitetura.

---

## Troubleshooting adicional

### A regra parece caber na Entity

Coloque-a na Entity antes de criar um serviço.

### O serviço precisa carregar Repository

Mova o carregamento para Application Service.

### O serviço precisa chamar Capacity

Receba uma oferta ou snapshot já obtido.

### O resultado negativo é esperado

Retorne policy result, não exception técnica.

### O teste depende da hora atual

Injete `SchedulingClock`.

### O serviço possui muitos métodos

Separe por decisões do domínio.

### O nome termina em Manager

Renomeie pela regra representada.

### A Specification contém SQL

Separe predicado de domínio e query técnica.

### O serviço publica Domain Event

A root registra; a aplicação coordena publicação.

### O laboratório começou a montar caso de uso completo

Preserve Application Service para a aula 628.

---

## Perguntas de revisão

1. O que é Domain Service?
2. Quando não criar Domain Service?
3. O que é behavior ownership?
4. Onde fica comportamento de uma Entity?
5. Onde fica comportamento de Value Object?
6. O que significa stateless?
7. Configuração imutável é estado proibido?
8. Por que evitar Repository no serviço?
9. Por que evitar HTTP client?
10. Por que usar resultado rico?
11. Quando usar exception?
12. O que é Domain Policy?
13. O que é Specification?
14. Qual diferença entre Specification e Domain Service?
15. Por que usar relógio explícito?
16. O que é behavior theft?
17. O que é service explosion?
18. Domain Service publica evento?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Regra de domínio sem owner natural em um objeto.
2. Quando a regra cabe em Entity ou Value Object.
3. Decisão sobre onde o comportamento pertence.
4. Na própria Entity ou Aggregate Root.
5. No próprio Value Object.
6. Não guardar estado mutável entre chamadas.
7. Não.
8. Evitar orquestração e persistência.
9. Evitar dependência de infraestrutura.
10. Preservar aprovação, rejeições e dados.
11. Para contrato inválido ou estado impossível.
12. Regra explicitamente nomeada.
13. Predicado de domínio reutilizável.
14. Specification avalia condição; serviço representa operação.
15. Garantir determinismo e testes de borda.
16. Retirar comportamento do objeto correto.
17. Excesso de serviços sem responsabilidade.
18. Não.
19. Application Service Use Case.
20. Application Service Use Case.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 627 - M19.17 - Domain Service

- Aprofundei Domain Service.
- Criei o laboratório `service-scheduling-domain-services`.
- Criei Domain Service Charter e matriz de behavior ownership.
- Mantive `confirm`, `cancel` e `reschedule` na Aggregate Root.
- Mantive `overlaps` em `AppointmentWindow`.
- Criei `SchedulingEligibilityService`.
- Modelei `SchedulingDecision` com aprovação e rejeições.
- Criei `AppointmentConflictPolicy`.
- Mantive Repository fora da policy.
- Criei `ReschedulingDeadlinePolicy`.
- Injetei `SchedulingClock` para testes determinísticos.
- Criei `CapacityOfferSelectionPolicy`.
- Selecionei entre ofertas já carregadas.
- Criei Specifications para predicados reutilizáveis.
- Mantive serviços stateless.
- Evitei Spring, JPA, JDBC, HTTP e mensageria.
- Diferenciei Domain Service de Application Service.
- Documentei exceptions versus policy results.
- Criei smell catalog.
- Protegi ownership, dependências e statelessness com ArchUnit.
- Criei reports, gate e evidence.
- Não antecipei Application Service completo ou Domain Events aprofundados.
- Próxima aula: Application Service Use Case.
```

---

## Referência técnica curta

- Domain Service.
- Behavior Ownership.
- Domain Policy.
- Stateless Service.
- Policy Result.
- Specification.
- Anemic Model.
- Service Explosion.
- Temporal Policy.
- Pure Domain Function.

Regra final:

```text
Domain Service deve existir somente quando uma regra importante do domínio não pertence naturalmente a uma Entity, Value Object ou Aggregate Root: comportamento local permanece no objeto que possui os dados e o ciclo de vida, enquanto `SchedulingEligibilityService`, `AppointmentConflictPolicy`, `ReschedulingDeadlinePolicy` e `CapacityOfferSelectionPolicy` representam decisões entre conceitos independentes; os serviços usam linguagem e tipos do domínio, são stateless por padrão, recebem snapshots e opções já carregadas, retornam resultados imutáveis com razões e utilizam relógio explícito para regras temporais; Repository, transação, HTTP, JPA, mensageria, autorização, publicação de eventos e DTOs técnicos permanecem fora, Specifications representam predicados reutilizáveis sem SQL, exceptions ficam reservadas a contratos inválidos e estados impossíveis e nomes genéricos como Manager, Helper, Utils ou Processor são rejeitados; o gate termina com ownership, interfaces, statelessness, results, Specifications, dependências, smells, testes, arquitetura, documentação e evidence aprovados, enquanto Application Service Use Case é aprofundado somente na aula 628 e Domain Events permanecem reservados à aula 629.
```
