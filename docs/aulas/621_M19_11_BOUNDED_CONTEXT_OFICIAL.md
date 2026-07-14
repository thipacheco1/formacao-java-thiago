# 621 - M19.11 - Bounded Context

## Apresentação da aula

Na aula 620, você aprofundou Ubiquitous Language no contexto de agendamento de serviços.

Você criou:

```text
charter da linguagem;

glossário vivo;

definições operacionais;

exemplos;

contraexemplos;

sinônimos permitidos;

sinônimos proibidos;

registro de ambiguidades;

termos aposentados;

inventário de código;

inventário de API;

inventário de eventos;

inventário de testes;

rastreabilidade;

processo de mudança.
```

A conclusão principal foi:

```text
uma linguagem só é ubíqua
quando aparece de forma coerente
nas conversas,
documentos,
testes,
código
e contratos.
```

Agora surge a pergunta que dá continuidade direta a esse aprendizado:

```text
onde essa linguagem é válida?
```

Uma palavra pode ser precisa em uma parte do negócio e ambígua em outra.

Exemplo:

```text
Appointment
```

dentro de Service Scheduling significa:

```text
compromisso de atendimento
assumido para uma solicitação
em uma janela definida.
```

Porém, no contexto de Field Execution, a equipe pode usar:

```text
Activity
```

para representar o trabalho operacional em campo.

No contexto de Capacity Management, uma:

```text
Window
```

pode ser apenas um intervalo disponível para oferta.

No contexto de Service Scheduling, a mesma palavra pode representar o intervalo associado a um compromisso já criado.

Se todos esses conceitos forem colocados em um único modelo global, surgem classes como:

```text
GenericAppointment;

UniversalStatus;

CommonWindow;

SharedCustomer;

GlobalActivity;

MasterOrder.
```

Essas classes parecem reutilizáveis.

Na prática, costumam acumular significados incompatíveis.

Bounded Context é o limite explícito dentro do qual:

- um modelo é válido;
- uma linguagem possui significado;
- regras permanecem coerentes;
- dados possuem ownership;
- decisões pertencem a uma responsabilidade;
- APIs públicas são controladas;
- implementações internas permanecem protegidas.

A pergunta central desta aula será:

```text
como transformar
uma fronteira conceitual

em uma fronteira prática

que proteja linguagem,
modelo,
dados,
dependências
e evolução?
```

Você irá aprofundar o:

```text
Service Scheduling Context.
```

O laboratório será:

```text
labs/m19/aula-621-bounded-context/service-scheduling-context
```

O contexto terá responsabilidade por:

- assumir compromisso de atendimento;
- consultar o compromisso atual;
- confirmar o compromisso;
- reagendar o compromisso;
- cancelar o compromisso;
- preservar histórico de mudanças;
- publicar fatos do contexto;
- traduzir entradas externas para sua linguagem;
- proteger seu modelo interno.

O contexto não será responsável por:

- calcular capacidade;
- manter cadastro completo do cliente;
- executar serviço em campo;
- enviar mensagens;
- faturar;
- decidir política financeira;
- controlar técnicos;
- armazenar conceitos internos de outros contextos.

Você irá definir:

- context charter;
- propósito;
- linguagem;
- public API;
- internal model;
- inbound contracts;
- outbound contracts;
- data ownership;
- transaction boundary;
- package boundary;
- dependency rules;
- error boundary;
- event boundary;
- team ownership;
- change policy;
- tests;
- reports;
- gate.

A próxima aula oficial será:

```text
622 - M19.12 - Context Map
```

Na aula 622, você irá aprofundar as relações entre vários contextos.

Por isso, esta aula não irá construir ainda o Context Map completo.

Ela irá apenas registrar:

```text
dependências conhecidas;
contratos necessários;
upstreams candidatos;
downstreams candidatos.
```

Também não irá implementar em profundidade:

```text
Anti Corruption Layer.
```

Esse tema pertence à aula 623.

Nesta aula, haverá apenas uma interface de tradução simples para demonstrar que o modelo externo não pode invadir o contexto.

A regra central será:

```text
um Bounded Context
protege um modelo

porque define
o que pertence,
o que não pertence,
como se entra,
como se sai
e quem pode mudar
suas decisões.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
619:
DDD tatico.

620:
Ubiquitous Language.

621:
Bounded Context.

622:
Context Map.

623:
Anti Corruption Layer.
```

A progressão é:

```text
modelar comportamento;

alinhar linguagem;

proteger a fronteira;

mapear relações;

traduzir modelos externos.
```

Nesta aula:

```text
context purpose:
sim.

context language:
sim.

public API:
sim.

internal model:
sim.

inbound boundary:
sim.

outbound boundary:
sim.

data ownership:
sim.

transaction boundary:
sim.

team ownership:
sim.

package rules:
sim.

architecture tests:
sim.

Context Map completo:
não.

ACL completa:
não.

microservice:
não.

nova classificação de subdomínios:
não.
```

O contexto será implementado como módulo interno de uma aplicação única.

Isso demonstra que:

```text
Bounded Context
não é sinônimo
de microservice.
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-621-bounded-context/service-scheduling-context
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/servicescheduling
│   │           ├── api
│   │           │   ├── ServiceSchedulingApi.java
│   │           │   ├── ScheduleAppointmentCommand.java
│   │           │   ├── ConfirmAppointmentCommand.java
│   │           │   ├── RescheduleAppointmentCommand.java
│   │           │   ├── CancelAppointmentCommand.java
│   │           │   ├── AppointmentView.java
│   │           │   └── SchedulingError.java
│   │           ├── event
│   │           │   ├── AppointmentScheduledEvent.java
│   │           │   ├── AppointmentConfirmedEvent.java
│   │           │   ├── AppointmentRescheduledEvent.java
│   │           │   └── AppointmentCancelledEvent.java
│   │           └── internal
│   │               ├── application
│   │               │   ├── DefaultServiceSchedulingApi.java
│   │               │   ├── ScheduleAppointmentHandler.java
│   │               │   ├── ConfirmAppointmentHandler.java
│   │               │   ├── RescheduleAppointmentHandler.java
│   │               │   └── CancelAppointmentHandler.java
│   │               ├── domain
│   │               │   ├── Appointment.java
│   │               │   ├── AppointmentId.java
│   │               │   ├── AppointmentWindow.java
│   │               │   ├── AppointmentStatus.java
│   │               │   ├── ServiceRequestReference.java
│   │               │   └── SchedulingDomainException.java
│   │               ├── port
│   │               │   ├── LoadAppointmentPort.java
│   │               │   ├── SaveAppointmentPort.java
│   │               │   ├── CapacityAvailabilityPort.java
│   │               │   ├── SchedulingEventPublisher.java
│   │               │   ├── SchedulingClock.java
│   │               │   └── SchedulingIdGenerator.java
│   │               ├── persistence
│   │               │   └── InMemoryAppointmentRepository.java
│   │               ├── integration
│   │               │   └── CapacityAvailabilityAdapter.java
│   │               └── configuration
│   │                   └── ServiceSchedulingConfiguration.java
│   └── test
│       └── java
│           └── br/com/formacao/servicescheduling
│               ├── architecture
│               │   ├── BoundedContextBoundaryTest.java
│               │   ├── InternalVisibilityTest.java
│               │   ├── PublicApiPurityTest.java
│               │   └── ContextDependencyTest.java
│               ├── api
│               │   └── ServiceSchedulingApiContractTest.java
│               ├── internal
│               │   ├── AppointmentTest.java
│               │   ├── DefaultServiceSchedulingApiTest.java
│               │   └── InMemoryAppointmentRepositoryTest.java
│               └── integration
│                   └── CapacityAvailabilityAdapterTest.java
├── context
│   ├── context-charter.md
│   ├── context-purpose.md
│   ├── language-boundary.md
│   ├── responsibility-catalog.md
│   ├── in-scope.md
│   ├── out-of-scope.md
│   ├── public-API.md
│   ├── internal-model.md
│   ├── inbound-contracts.md
│   ├── outbound-contracts.md
│   ├── data-ownership.md
│   ├── transaction-boundaries.md
│   ├── team-ownership.md
│   ├── dependency-rules.md
│   ├── error-boundary.md
│   ├── event-boundary.md
│   ├── change-policy.md
│   └── open-context-questions.md
├── contracts
│   ├── bounded-context-contract.yaml
│   ├── context-purpose-policy.yaml
│   ├── public-API-policy.yaml
│   ├── internal-model-policy.yaml
│   ├── inbound-boundary-policy.yaml
│   ├── outbound-boundary-policy.yaml
│   ├── data-ownership-policy.yaml
│   ├── transaction-boundary-policy.yaml
│   ├── team-ownership-policy.yaml
│   ├── event-boundary-policy.yaml
│   ├── error-boundary-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
└── reports
    ├── context-purpose-report.yaml
    ├── public-API-report.yaml
    ├── internal-model-report.yaml
    ├── dependency-report.yaml
    ├── data-ownership-report.yaml
    ├── transaction-report.yaml
    ├── event-boundary-report.yaml
    └── bounded-context-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-context
├── validate-bounded-context-contract.ps1
├── validate-context-purpose.ps1
├── validate-public-API.ps1
├── validate-internal-model.ps1
├── validate-inbound-boundary.ps1
├── validate-outbound-boundary.ps1
├── validate-context-dependencies.ps1
├── validate-data-ownership.ps1
├── validate-transaction-boundaries.ps1
├── validate-event-boundary.ps1
├── run-bounded-context-tests.ps1
├── collect-bounded-context-evidence.ps1
└── verify-bounded-context-gate.ps1
```

Ao final, você terá uma fronteira executável e testável para o Service Scheduling Context.

---

## Conceito essencial

### Bounded Context

Limite explícito dentro do qual um modelo e uma linguagem permanecem coerentes.

---

### Context Purpose

Razão de existir do contexto.

---

### Context Responsibility

Decisão, regra ou capacidade que pertence ao contexto.

---

### Public API

Conjunto mínimo de contratos disponíveis para consumidores externos ao contexto.

---

### Internal Model

Classes, regras, repositories e detalhes privados do contexto.

---

### Inbound Boundary

Forma controlada pela qual comandos e consultas entram no contexto.

---

### Outbound Boundary

Contrato pelo qual o contexto solicita capacidades externas.

---

### Data Ownership

Responsabilidade do contexto sobre criação, alteração e interpretação de dados.

---

### Transaction Boundary

Limite em que uma operação precisa preservar consistência.

---

### Language Boundary

Limite em que termos possuem significado específico.

---

### Team Ownership

Responsabilidade organizacional por decisões e evolução do contexto.

---

### Context Leak

Vazamento de modelo, linguagem ou detalhe interno para fora do contexto.

---

### Boundary Enforcement

Mecanismo que torna a fronteira verificável por código, testes e build.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-621-bounded-context/service-scheduling-context

Set-Location `
  labs/m19/aula-621-bounded-context/service-scheduling-context
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/bounded-context-contract.yaml
```

Conteúdo:

```yaml
boundedContext:
  name:
    Service-Scheduling

  required:
    - purpose
    - language-boundary
    - responsibility-catalog
    - public-API
    - internal-model
    - inbound-contracts
    - outbound-contracts
    - data-ownership
    - transaction-boundaries
    - team-ownership
    - dependency-rules
    - event-boundary
    - error-boundary
    - architecture-tests

  forbidden:
    - external-access-to-internal
    - internal-entity-in-public-contract
    - external-model-inside-domain
    - shared-repository
    - uncontrolled-cross-context-transaction
    - context-defined-only-by-deployment

  nextLesson:
    code:
      M19.12
```

---

### 3. Criar context charter

Arquivo:

```text
context/context-charter.md
```

Conteúdo:

```markdown
# Service Scheduling Context Charter

## Propósito

Assumir,
confirmar,
reagendar
e cancelar
compromissos de atendimento.

## Resultado de negócio

Manter um compromisso atual,
válido,
rastreável
e compreensível.

## Linguagem principal

- Appointment;
- Appointment Window;
- Confirmation;
- Rescheduling;
- Cancellation.

## Owner

Scheduling Team.

## Consumidores

- Customer Service;
- Field Execution;
- Notifications.

## Fornecedores

- Capacity Management;
- Customer Service.

## Implantação inicial

Módulo interno de uma aplicação única.
```

---

### 4. Criar policy de propósito

Arquivo:

```text
contracts/context-purpose-policy.yaml
```

Conteúdo:

```yaml
contextPurpose:
  requires:
    - business-outcome
    - owned-decisions
    - language
    - consumers
    - suppliers
    - owner

  technologyOnlyPurpose:
    forbidden

  tableOnlyPurpose:
    forbidden

  genericPurpose:
    forbidden:
      - process-data
      - manage-records
      - provide-services
```

---

### 5. Definir propósito com precisão

Evite:

```text
gerenciar agendamentos.
```

Essa frase é ampla.

Prefira:

```text
assumir e manter
o compromisso atual
de atendimento
para uma solicitação elegível.
```

A segunda frase ajuda a decidir:

- o que entra;
- o que sai;
- quais regras pertencem;
- quais dados são próprios.

---

### 6. Criar catálogo de responsabilidades

Arquivo:

```text
context/responsibility-catalog.md
```

Responsabilidades:

```text
RESP-001:
criar compromisso.

RESP-002:
confirmar compromisso.

RESP-003:
reagendar compromisso.

RESP-004:
cancelar compromisso.

RESP-005:
preservar histórico.

RESP-006:
publicar fatos do compromisso.

RESP-007:
proteger linguagem do contexto.

RESP-008:
consultar capacidade por contrato.
```

---

### 7. Criar in-scope

Arquivo:

```text
context/in-scope.md
```

Inclua:

- appointment atual;
- status do appointment;
- window do compromisso;
- motivo de reagendamento;
- motivo de cancelamento;
- histórico;
- regras de transição;
- eventos do contexto;
- contrato público de scheduling.

---

### 8. Criar out-of-scope

Arquivo:

```text
context/out-of-scope.md
```

Inclua:

- cálculo de capacidade;
- cadastro completo de cliente;
- técnico;
- execução;
- cobrança;
- template;
- entrega de notificação;
- roteirização;
- estoque;
- autenticação.

Out-of-scope reduz crescimento acidental.

---

### 9. Criar language boundary

Arquivo:

```text
context/language-boundary.md
```

Defina:

```text
Appointment:
compromisso atual de atendimento.

Appointment Window:
intervalo associado ao compromisso.

Confirmation:
aceite do compromisso.

Rescheduling:
substituição da janela atual
por nova janela,
preservando histórico.

Cancellation:
encerramento do compromisso
sem execução.
```

Também registre termos externos que não entram diretamente:

```text
Slot;
Job;
Activity;
TechnicalStatus;
CapacityBucket.
```

---

### 10. Criar API pública

```java
public interface ServiceSchedulingApi {

    AppointmentView schedule(
            ScheduleAppointmentCommand command);

    AppointmentView confirm(
            ConfirmAppointmentCommand command);

    AppointmentView reschedule(
            RescheduleAppointmentCommand command);

    AppointmentView cancel(
            CancelAppointmentCommand command);

    AppointmentView find(
            UUID appointmentId);
}
```

A API representa intenções do contexto.

---

### 11. Criar public API policy

Arquivo:

```text
contracts/public-API-policy.yaml
```

Conteúdo:

```yaml
publicAPI:
  required:
    - domain-intention
    - stable-contract
    - minimal-data
    - context-language
    - compatibility-policy

  mustNotExpose:
    - internal-entity
    - repository
    - framework-type
    - persistence-record
    - external-vendor-type

  genericMethod:
    forbidden:
      - process
      - update
      - executeAction
      - changeStatus
```

---

### 12. Criar commands públicos

```java
public record ScheduleAppointmentCommand(
        UUID serviceRequestId,
        String serviceAreaCode,
        Instant startsAt,
        Instant endsAt) {
}
```

O command possui dados necessários à intenção.

Ele não expõe:

- Entity;
- repository;
- record de banco;
- DTO de Capacity;
- objeto de outro contexto.

---

### 13. Criar view pública

```java
public record AppointmentView(
        UUID appointmentId,
        UUID serviceRequestId,
        String status,
        Instant startsAt,
        Instant endsAt) {
}
```

Essa view é estável e mínima.

O histórico detalhado pode exigir contrato separado.

---

### 14. Criar internal model policy

Arquivo:

```text
contracts/internal-model-policy.yaml
```

Conteúdo:

```yaml
internalModel:
  package:
    contains:
      internal

  externalAccess:
    forbidden

  mayContain:
    - domain
    - application
    - persistence
    - integration
    - configuration

  publicType:
    forbiddenByDefault

  internalEntityInAPI:
    forbidden
```

---

### 15. Criar Aggregate interno

```java
final class Appointment {

    private final AppointmentId id;
    private final ServiceRequestReference
            serviceRequest;

    private AppointmentWindow window;
    private AppointmentStatus status;

    void confirm(
            Instant occurredAt) {

        requireScheduled();

        status =
                AppointmentStatus.CONFIRMED;
    }
}
```

A classe permanece em:

```text
internal.domain.
```

Consumidores externos recebem `AppointmentView`.

---

### 16. Criar referência externa

```java
record ServiceRequestReference(
        UUID value) {

    ServiceRequestReference {
        Objects.requireNonNull(value);
    }
}
```

O contexto conhece apenas a referência necessária.

Ele não carrega a Entity completa de Customer Service.

---

### 17. Criar implementação da API

```java
final class DefaultServiceSchedulingApi
        implements ServiceSchedulingApi {

    private final ScheduleAppointmentHandler
            schedule;

    private final ConfirmAppointmentHandler
            confirm;

    private final RescheduleAppointmentHandler
            reschedule;

    private final CancelAppointmentHandler
            cancel;

    @Override
    public AppointmentView schedule(
            ScheduleAppointmentCommand command) {

        return schedule.handle(command);
    }
}
```

A classe pode ser exposta apenas pela configuração.

---

### 18. Criar inbound policy

Arquivo:

```text
contracts/inbound-boundary-policy.yaml
```

Conteúdo:

```yaml
inboundBoundary:
  accepted:
    - public-command
    - public-query
    - published-event-when-documented

  responsibilities:
    - validate-contract-shape
    - translate-to-internal-language
    - call-application-handler
    - map-result

  forbidden:
    - internal-entity-input
    - repository-input
    - foreign-context-entity
    - direct-state-mutation
```

---

### 19. Entender entrada controlada

O contexto pode receber uma solicitação externa como:

```text
CustomerServiceRequestCreated.
```

Mas não deve usar diretamente:

```text
CustomerRequestEntity.
```

A entrada precisa ser convertida para:

```text
ServiceRequestReference;
ServiceAreaCode;
AppointmentWindow.
```

---

### 20. Criar outbound contracts

```java
interface CapacityAvailabilityPort {

    CapacityAvailabilityResult check(
            CapacityAvailabilityRequest request);
}
```

```java
interface SchedulingEventPublisher {

    void publish(
            List<SchedulingEvent> events);
}
```

O contexto define o que precisa.

Não depende de implementação externa.

---

### 21. Criar outbound policy

Arquivo:

```text
contracts/outbound-boundary-policy.yaml
```

Conteúdo:

```yaml
outboundBoundary:
  ownedBy:
    context

  expresses:
    external-capability:
      required

  forbidden:
    - vendor-name
    - external-entity
    - driver-type
    - HTTP-response-type
    - database-record

  adapter:
    outsideInternalDomain:
      required
```

---

### 22. Criar request interno de capacidade

```java
record CapacityAvailabilityRequest(
        String serviceAreaCode,
        Instant startsAt,
        Instant endsAt) {
}
```

Esse contrato usa a linguagem necessária ao contexto.

Ele não usa:

```text
LegacySlotRequest.
```

---

### 23. Criar adapter simples

```java
final class CapacityAvailabilityAdapter
        implements CapacityAvailabilityPort {

    private final CapacityClient client;

    @Override
    public CapacityAvailabilityResult check(
            CapacityAvailabilityRequest request) {

        CapacityClientResponse response =
                client.check(
                        CapacityClientMapper.toRequest(
                                request));

        return CapacityClientMapper.toResult(
                response);
    }
}
```

A tradução completa e seus padrões serão aprofundados na aula 623.

---

### 24. Criar data ownership

Arquivo:

```text
context/data-ownership.md
```

O contexto é owner de:

- appointment ID;
- service request reference;
- appointment status;
- current window;
- reschedule history;
- cancellation reason;
- appointment events.

O contexto não é owner de:

- cliente;
- capacidade;
- técnico;
- execução;
- template;
- faturamento.

---

### 25. Criar data ownership policy

Arquivo:

```text
contracts/data-ownership-policy.yaml
```

Conteúdo:

```yaml
dataOwnership:
  context:
    Service-Scheduling

  owns:
    - appointment
    - appointment-window-current
    - appointment-history
    - appointment-status
    - scheduling-events

  referencesOnly:
    - service-request
    - capacity-offer

  directForeignTableAccess:
    forbidden

  sharedRepository:
    forbidden

  foreignDataMutation:
    forbidden
```

---

### 26. Evitar banco compartilhado sem ownership

Mesmo que todos os contextos usem o mesmo banco, Scheduling não deve:

- atualizar tabela de capacidade;
- consultar tabela de técnico;
- alterar cadastro do cliente;
- inserir notificação diretamente.

O banco físico não remove a fronteira lógica.

---

### 27. Criar transaction boundary

Arquivo:

```text
context/transaction-boundaries.md
```

Operação de reagendamento:

```text
carregar appointment;

validar estado;

consultar capacidade;

substituir janela;

preservar histórico;

salvar appointment;

registrar evento.
```

A transação local protege o aggregate de Scheduling.

Ela não controla diretamente dados de Capacity.

---

### 28. Criar transaction policy

Arquivo:

```text
contracts/transaction-boundary-policy.yaml
```

Conteúdo:

```yaml
transactionBoundary:
  localAggregate:
    atomic:
      required

  crossContext:
    directSharedTransaction:
      forbiddenByDefault

  externalCall:
    failureBehavior:
      explicit

  eventPublication:
    afterPersistence:
      required

  distributedTransaction:
    outOfScope
```

---

### 29. Definir falha de capacidade

Exemplo:

```text
se Capacity estiver indisponível,
Scheduling não assume
uma nova janela.
```

A operação retorna erro controlado.

Não abre uma transação distribuída.

---

### 30. Criar event boundary

Arquivo:

```text
context/event-boundary.md
```

Eventos públicos:

```text
AppointmentScheduledEvent;

AppointmentConfirmedEvent;

AppointmentRescheduledEvent;

AppointmentCancelledEvent.
```

Eventos internos do aggregate podem possuir detalhes adicionais.

O evento público contém apenas:

- ID;
- referência necessária;
- estado relevante;
- data;
- versão.

---

### 31. Criar event policy

Arquivo:

```text
contracts/event-boundary-policy.yaml
```

Conteúdo:

```yaml
eventBoundary:
  publicEvent:
    requires:
      - stable-name
      - minimal-payload
      - version
      - occurred-at
      - owner

  internalEntity:
    forbiddenInPayload

  internalEventAndPublishedEvent:
    mayDiffer:
      true

  compatibility:
    required

  genericEvent:
    forbidden
```

---

### 32. Separar evento interno e público

Evento interno:

```java
record AppointmentRescheduled(
        AppointmentId id,
        AppointmentWindow previousWindow,
        AppointmentWindow newWindow,
        RescheduleReason reason,
        Instant occurredAt) {
}
```

Evento público:

```java
public record AppointmentRescheduledEvent(
        UUID appointmentId,
        Instant startsAt,
        Instant endsAt,
        Instant occurredAt,
        int version) {
}
```

O evento público protege internals.

---

### 33. Criar error boundary

Arquivo:

```text
context/error-boundary.md
```

Erros públicos:

```text
APPOINTMENT_NOT_FOUND;

APPOINTMENT_CANNOT_BE_CONFIRMED;

APPOINTMENT_CANNOT_BE_RESCHEDULED;

CAPACITY_UNAVAILABLE;

INVALID_APPOINTMENT_WINDOW.
```

Erros internos podem ser mais específicos.

---

### 34. Criar error policy

Arquivo:

```text
contracts/error-boundary-policy.yaml
```

Conteúdo:

```yaml
errorBoundary:
  publicError:
    requires:
      - stable-code
      - safe-message
      - owner

  internalException:
    publicExposure:
      forbidden

  technicalException:
    publicExposure:
      forbidden

  foreignError:
    translated:
      required
```

---

### 35. Criar team ownership

Arquivo:

```text
context/team-ownership.md
```

Inclua:

- equipe responsável;
- product owner;
- especialistas;
- on-call;
- processo de mudança;
- canal de dúvida;
- dependências organizacionais.

Sem owner, a fronteira tende a se degradar.

---

### 36. Criar team policy

Arquivo:

```text
contracts/team-ownership-policy.yaml
```

Conteúdo:

```yaml
teamOwnership:
  requires:
    - accountable-team
    - product-owner
    - domain-expert-contact
    - change-process
    - operational-contact

  sharedOwnershipWithoutDecisionProcess:
    forbidden

  externalChange:
    notification:
      required
```

---

### 37. Criar regras de dependência

Arquivo:

```text
context/dependency-rules.md
```

Regras:

```text
API não depende de internal.

Internal pode depender da API pública
apenas quando necessário.

Domain não depende de persistence.

Application depende de ports.

Persistence implementa ports.

Integration implementa ports.

Outros contextos dependem apenas da API.

Nenhum contexto acessa internal.
```

---

### 38. Criar architecture test

```java
@ArchTest
static final ArchRule externalPackagesMustNotAccessInternal =
        noClasses()
                .that()
                .resideOutsideOfPackage(
                        "br.com.formacao.servicescheduling..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..servicescheduling.internal..");
```

Em laboratório isolado, crie packages consumidores sintéticos para provar a regra.

---

### 39. Proteger API pública

```java
@ArchTest
static final ArchRule publicApiMustNotDependOnInternal =
        noClasses()
                .that()
                .resideInAPackage(
                        "..servicescheduling.api..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..servicescheduling.internal..");
```

---

### 40. Proteger domain

```java
@ArchTest
static final ArchRule domainMustNotDependOnInfrastructure =
        noClasses()
                .that()
                .resideInAPackage(
                        "..internal.domain..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..internal.persistence..",
                        "..internal.integration..",
                        "org.springframework..");
```

---

### 41. Criar public API contract test

Valide:

- comandos públicos;
- tipos estáveis;
- ausência de internals;
- ausência de framework;
- ausência de vendor;
- erros públicos;
- compatibilidade.

---

### 42. Criar internal visibility test

Inspecione classes em:

```text
internal.
```

Regras:

- package-private quando possível;
- public somente quando framework exige;
- nenhuma exportação acidental;
- nenhuma referência externa.

---

### 43. Criar change policy

Arquivo:

```text
context/change-policy.md
```

Mudanças em:

- API;
- evento;
- erro;
- data ownership;
- linguagem;
- transaction boundary;
- responsabilidade.

Exigem revisão explícita.

---

### 44. Criar policy de mudança

```yaml
contextChange:
  publicAPI:
    compatibilityReview:
      required

  event:
    versionReview:
      required

  responsibility:
    charterUpdate:
      required

  dataOwnership:
    migrationPlan:
      required

  language:
    glossaryUpdate:
      required

  boundaryRemoval:
    architectureDecision:
      required
```

Adicione ao arquivo:

```text
contracts/context-purpose-policy.yaml
```

ou crie seção dedicada no contrato principal.

---

### 45. Criar perguntas abertas

Arquivo:

```text
context/open-context-questions.md
```

Exemplos:

- Scheduling pode criar appointment sem reserva confirmada?
- confirmação pertence somente ao cliente?
- qual evento é público?
- histórico completo deve ser público?
- quem mantém compatibilidade de API?
- qual falha externa é retryable?
- quanto tempo Scheduling retém histórico?
- Service Request pode mudar depois do appointment?

Cada pergunta precisa de owner.

---

### 46. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  contextWithoutPurpose:
    action:
      FAIL

  publicAPIExposingInternal:
    action:
      FAIL

  externalEntityInsideContext:
    action:
      FAIL

  foreignTableAccess:
    action:
      FAIL

  publicEventWithoutVersion:
    action:
      FAIL

  contextWithoutOwner:
    action:
      FAIL

  outOfScopeResponsibilityInsideContext:
    result:
      boundary-drift
```

---

### 47. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  internalLeak:
    action:
      FAIL

  foreignModelLeak:
    action:
      FAIL

  sharedRepository:
    action:
      FAIL

  uncontrolledCrossContextTransaction:
    action:
      FAIL

  ContextMapDeepDive:
    deferredToLesson622

  AntiCorruptionLayerDeepDive:
    deferredToLesson623
```

---

### 48. Implementar configuração

```java
@Configuration
public class ServiceSchedulingConfiguration {

    @Bean
    ServiceSchedulingApi serviceSchedulingApi(
            LoadAppointmentPort load,
            SaveAppointmentPort save,
            CapacityAvailabilityPort capacity,
            SchedulingEventPublisher publisher,
            SchedulingClock clock,
            SchedulingIdGenerator ids) {

        return DefaultServiceSchedulingApi.create(
                load,
                save,
                capacity,
                publisher,
                clock,
                ids);
    }
}
```

A configuração é a porta de montagem.

Consumidores recebem apenas `ServiceSchedulingApi`.

---

### 49. Testar agendamento

Cenário:

```text
solicitação válida;

janela disponível;

appointment criado;

evento público produzido;

view retornada.
```

Teste a API pública sem acessar o aggregate diretamente.

---

### 50. Testar reagendamento

Valide:

- capacidade consultada;
- janela substituída;
- histórico interno preservado;
- evento público mínimo;
- view atualizada;
- nenhuma Entity externa.

---

### 51. Testar falha externa

Simule:

```text
Capacity indisponível.
```

Confirme:

- appointment não foi alterado;
- evento não foi publicado;
- erro público é estável;
- exception técnica não vazou.

---

### 52. Validar propósito

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-context-purpose.ps1
```

Confirme:

- outcome;
- responsabilidades;
- linguagem;
- owner;
- consumidores;
- fornecedores;
- out-of-scope.

---

### 53. Validar API pública

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-public-API.ps1
```

Procure:

- Entity interna;
- repository;
- Spring;
- JPA;
- vendor;
- métodos genéricos;
- termos não aprovados.

---

### 54. Validar internal model

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-internal-model.ps1
```

Confirme:

- privacidade;
- domínio sem infraestrutura;
- aggregate protegido;
- nenhum acesso externo;
- nenhum tipo público desnecessário.

---

### 55. Validar boundaries

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-inbound-boundary.ps1

.\scripts\m19\service-scheduling-context\validate-outbound-boundary.ps1
```

Confirme traduções e contratos.

---

### 56. Validar dependências

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-context-dependencies.ps1
```

Procure:

- API para internal;
- domain para persistence;
- consumer para internal;
- integration concreta no domain;
- acesso direto a contexto externo.

---

### 57. Validar data ownership

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-data-ownership.ps1
```

Confirme:

- dados próprios;
- referências externas;
- zero foreign table access;
- zero shared repository;
- ownership documentado.

---

### 58. Validar transações

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-transaction-boundaries.ps1
```

Confirme:

- consistência local;
- falha externa explícita;
- publicação após save;
- ausência de transação distribuída.

---

### 59. Validar eventos

Execute:

```powershell
.\scripts\m19\service-scheduling-context\validate-event-boundary.ps1
```

Confirme:

- nome estável;
- payload mínimo;
- versão;
- owner;
- sem Entity interna;
- compatibilidade.

---

### 60. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-context\run-bounded-context-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide:

- API;
- domain;
- persistence;
- integration;
- errors;
- events;
- architecture.

---

### 61. Criar reports

Exemplo:

```yaml
publicAPIReview:
  publicTypes:
    7

  internalTypeLeaks:
    0

  frameworkTypeLeaks:
    0

  vendorTypeLeaks:
    0

  genericMethodViolations:
    0

  result:
    PASS
```

---

### 62. Criar gate

O gate valida:

```text
purpose;

language;

responsibilities;

in-scope;

out-of-scope;

public API;

internal model;

inbound boundary;

outbound boundary;

data ownership;

transaction boundary;

event boundary;

error boundary;

team ownership;

dependencies;

tests;

documentation;

evidence.
```

Status:

```text
PASS;

PASS_WITH_OPEN_QUESTIONS;

FAIL_PURPOSE;

FAIL_PUBLIC_API;

FAIL_INTERNAL_MODEL;

FAIL_INBOUND_BOUNDARY;

FAIL_OUTBOUND_BOUNDARY;

FAIL_DATA_OWNERSHIP;

FAIL_TRANSACTION_BOUNDARY;

FAIL_EVENT_BOUNDARY;

FAIL_ERROR_BOUNDARY;

FAIL_TEAM_OWNERSHIP;

FAIL_DEPENDENCY;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 63. Coletar evidence

Arquivo:

```text
contracts/bounded-context-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- context name;
- purpose status;
- language status;
- responsibility status;
- public API status;
- internal model status;
- inbound boundary status;
- outbound boundary status;
- data ownership status;
- transaction boundary status;
- event boundary status;
- error boundary status;
- team ownership status;
- dependency status;
- test status;
- documentation status;
- open question count;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- segredos;
- nomes reais;
- payloads corporativos reais;
- Context Map completo;
- ACL completa;
- microservices.

---

### 64. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-context\validate-bounded-context-contract.ps1

.\scripts\m19\service-scheduling-context\validate-context-purpose.ps1

.\scripts\m19\service-scheduling-context\validate-public-API.ps1

.\scripts\m19\service-scheduling-context\validate-internal-model.ps1

.\scripts\m19\service-scheduling-context\validate-inbound-boundary.ps1

.\scripts\m19\service-scheduling-context\validate-outbound-boundary.ps1

.\scripts\m19\service-scheduling-context\validate-context-dependencies.ps1

.\scripts\m19\service-scheduling-context\validate-data-ownership.ps1

.\scripts\m19\service-scheduling-context\validate-transaction-boundaries.ps1

.\scripts\m19\service-scheduling-context\validate-event-boundary.ps1

.\scripts\m19\service-scheduling-context\run-bounded-context-tests.ps1

.\scripts\m19\service-scheduling-context\collect-bounded-context-evidence.ps1

.\scripts\m19\service-scheduling-context\verify-bounded-context-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 65. Encerrar o laboratório

Confirme:

- propósito explícito;
- linguagem delimitada;
- responsabilidades claras;
- API pública mínima;
- internals protegidos;
- inbound controlado;
- outbound controlado;
- data ownership definido;
- transações locais;
- eventos públicos versionados;
- erros traduzidos;
- owner definido;
- nenhuma dependência de internals;
- Context Map completo não antecipado;
- ACL completa não antecipada;
- reports sanitizados.

---

## Entendendo o que foi feito

### O contexto ganhou propósito

A fronteira deixou de ser apenas estrutural.

### A linguagem ganhou validade local

Termos passaram a significar algo dentro de um limite.

### A API ganhou estabilidade

Consumidores deixaram de depender do aggregate interno.

### O modelo interno ganhou proteção

Entities e repositories deixaram de vazar.

### As entradas ganharam tradução

Comandos externos passaram a chegar em linguagem controlada.

### As saídas ganharam contratos

Capacidade e eventos deixaram de depender de vendors.

### Os dados ganharam owner

Banco compartilhado deixou de significar acesso livre.

### As transações ganharam limite

Consistência ficou local ao aggregate e ao contexto.

### Os eventos ganharam fronteira

Eventos públicos deixaram de ser cópias de eventos internos.

### A equipe ganhou responsabilidade

Mudanças passaram a possuir owner e processo.

---

## Erros comuns importantes

### Definir contexto por package

A estrutura pode existir sem propósito.

### Definir contexto por microservice

Deployment não garante modelo coerente.

### Expor Entity interna

Consumidores ficam acoplados ao modelo.

### Compartilhar Repository

Data ownership é quebrado.

### Usar modelo externo no domínio

A linguagem local é corrompida.

### Criar API genérica

A intenção do contexto desaparece.

### Controlar dados de outro contexto

A fronteira perde ownership.

### Criar transação entre vários contextos

Consistência fica acoplada.

### Publicar evento interno diretamente

Detalhes privados viram contrato.

### Antecipar Context Map e ACL

A aula perde o foco na fronteira.

---

## Comandos úteis

### Validar propósito

```powershell
.\scripts\m19\service-scheduling-context\validate-context-purpose.ps1
```

### Validar API

```powershell
.\scripts\m19\service-scheduling-context\validate-public-API.ps1
```

### Validar dependências

```powershell
.\scripts\m19\service-scheduling-context\validate-context-dependencies.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-context\run-bounded-context-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-context\verify-bounded-context-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Propósito

Escreva o outcome do contexto.

### Parte 2 — Escopo

Defina in-scope e out-of-scope.

### Parte 3 — Linguagem

Liste termos válidos e externos.

### Parte 4 — API pública

Exponha intenções mínimas.

### Parte 5 — Internals

Proteja modelo, repositories e handlers.

### Parte 6 — Entradas e saídas

Defina commands, ports e adapters.

### Parte 7 — Dados

Atribua ownership e referências.

### Parte 8 — Transações e eventos

Defina consistência e contratos públicos.

### Parte 9 — Ownership

Defina equipe e processo de mudança.

### Parte 10 — Gate

Valide fronteiras e evidências.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 620 e ponte para a aula 622 foram preservadas;
- o laboratório `service-scheduling-context` foi criado;
- o contexto possui propósito de negócio explícito;
- responsabilidades, in-scope e out-of-scope foram documentados;
- a linguagem possui validade dentro do contexto;
- termos externos não invadem diretamente o modelo;
- `ServiceSchedulingApi` representa intenções do contexto;
- comandos públicos não expõem Entities internas;
- `AppointmentView` é estável e mínima;
- public API não depende de internal;
- internal model permanece protegido;
- Aggregate, handlers e repositories permanecem em `internal`;
- inbound boundary traduz entradas;
- outbound boundary expressa capacidades;
- ports não usam vendors ou drivers;
- adapter de capacidade traduz o contrato externo;
- data ownership foi documentado;
- foreign table access é proibido;
- shared repository é proibido;
- transaction boundary é local;
- falha externa possui comportamento explícito;
- eventos são publicados após persistência;
- eventos públicos possuem payload mínimo e versão;
- eventos públicos não expõem Entities internas;
- erros técnicos e internos são traduzidos;
- team ownership e change policy foram definidos;
- architecture tests impedem leaks;
- testes cobrem API, internals, integração e falhas;
- Bounded Context não foi tratado automaticamente como microservice;
- Context Map completo não foi antecipado;
- ACL completa não foi antecipada;
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
  labs/m19/aula-621-bounded-context/service-scheduling-context `
  scripts/m19/service-scheduling-context `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|companyRealName|fullContextMap|completeAntiCorruptionLayer|foreignRepository|sharedEntity"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): proteger Bounded Context"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- nomes reais;
- contratos reais;
- Context Map completo;
- ACL completa;
- microservices;
- tabela externa acessada diretamente.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Bounded Context.

Você criou:

```text
context charter;

propósito;

responsabilidades;

in-scope;

out-of-scope;

language boundary;

public API;

internal model;

inbound boundary;

outbound boundary;

data ownership;

transaction boundary;

event boundary;

error boundary;

team ownership;

dependency rules;

architecture tests.
```

Você comprovou que Bounded Context não é apenas uma pasta; que a linguagem precisa de um limite; que a API pública protege internals; que dados precisam de owner; que transações devem preservar consistência local; que eventos públicos podem diferir dos eventos internos; que erros precisam ser traduzidos; e que a fronteira precisa de uma equipe responsável.

A próxima aula será:

```text
622 - M19.12 - Context Map
```

Nela, você irá conectar múltiplos Bounded Contexts, registrar upstreams, downstreams, padrões de relacionamento, contratos, riscos e evolução da integração.

Nenhum Context Map completo ou Anti Corruption Layer aprofundada foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini propósito e owner.
- [ ] Delimitei escopo.
- [ ] Protegi a linguagem.
- [ ] Criei API pública mínima.
- [ ] Mantive internals privados.
- [ ] Defini entradas e saídas.
- [ ] Atribuí data ownership.
- [ ] Protegi dependências com testes.

---

## Troubleshooting adicional

### O contexto parece uma camada técnica

Reescreva propósito em linguagem de negócio.

### A API precisa retornar Entity

Crie view ou result público.

### Outro contexto precisa do Repository

Publique uma intenção na API.

### Scheduling precisa alterar Capacity

Chame uma capacidade externa; não altere dados internos.

### Evento público precisa de muitos campos

Revise consumidores e crie contrato mínimo.

### Transação atravessa contexts

Separe decisões e trate falhas explicitamente.

### Muitas classes precisam ser públicas

Revise composição, packages e API.

### O owner não está claro

A fronteira provavelmente não será sustentável.

### O adapter contém regra central

Mova a regra para o contexto.

### A equipe começou a desenhar relações completas

Preserve o Context Map para a aula 622.

---

## Perguntas de revisão

1. O que é Bounded Context?
2. O que é context purpose?
3. O que é language boundary?
4. O que é public API do contexto?
5. O que é internal model?
6. O que é inbound boundary?
7. O que é outbound boundary?
8. O que é data ownership?
9. O que é transaction boundary?
10. O que é team ownership?
11. Por que Entity interna não deve ser pública?
12. Por que outro contexto não acessa Repository?
13. Por que eventos públicos podem diferir dos internos?
14. Por que erros externos precisam ser traduzidos?
15. Bounded Context é microservice?
16. Banco compartilhado elimina fronteiras?
17. Para que servem architecture tests?
18. O que é context leak?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Limite de validade de modelo e linguagem.
2. Resultado de negócio do contexto.
3. Limite semântico dos termos.
4. Contratos disponíveis aos consumidores.
5. Implementação privada.
6. Entrada controlada de comandos e consultas.
7. Capacidade externa requerida.
8. Responsabilidade sobre dados.
9. Limite de consistência.
10. Responsabilidade organizacional.
11. Evitar acoplamento ao modelo.
12. Preservar ownership e intenção.
13. Proteger detalhes internos.
14. Evitar vazamento técnico.
15. Não.
16. Não.
17. Tornar a fronteira executável.
18. Vazamento de modelo, linguagem ou internals.
19. Context Map.
20. Context Map.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 621 - M19.11 - Bounded Context

- Aprofundei Bounded Context no Service Scheduling Context.
- Criei um context charter.
- Defini propósito, resultado de negócio e owner.
- Documentei responsabilidades, in-scope e out-of-scope.
- Delimitei a linguagem válida do contexto.
- Criei `ServiceSchedulingApi` como public API.
- Separei commands e views públicas do modelo interno.
- Mantive Aggregate, handlers e repositories em `internal`.
- Criei inbound boundary para traduzir entradas.
- Criei outbound ports para capacidades externas.
- Implementei adapter simples de capacidade.
- Defini data ownership e proibi foreign table access.
- Delimitei transações locais.
- Separei eventos internos e públicos.
- Versionei eventos públicos.
- Criei error boundary e códigos estáveis.
- Defini team ownership e change policy.
- Protegi API, internals e dependências com ArchUnit.
- Criei reports, gate e evidence.
- Não antecipei Context Map completo ou ACL aprofundada.
- Próxima aula: Context Map.
```

---

## Referência técnica curta

- Bounded Context.
- Context Purpose.
- Language Boundary.
- Public API.
- Internal Model.
- Inbound Boundary.
- Outbound Boundary.
- Data Ownership.
- Transaction Boundary.
- Boundary Enforcement.

Regra final:

```text
um Bounded Context precisa tornar explícito onde um modelo e uma linguagem são válidos: o Service Scheduling Context possui propósito, responsabilidades, in-scope, out-of-scope, owner, public API, internal model, inbound e outbound boundaries, dados próprios, transações locais, eventos públicos, erros traduzidos e regras de mudança; consumidores usam apenas `ServiceSchedulingApi`, commands, views e eventos estáveis, enquanto Aggregate, handlers, repositories e detalhes técnicos permanecem em `internal`, modelos externos são traduzidos antes de entrar, ports expressam capacidades sem vendors e nenhum contexto acessa tabelas, repositories ou Entities de outro; data ownership continua válido mesmo em banco compartilhado, eventos públicos possuem versão e payload mínimo, falhas técnicas não vazam, architecture tests bloqueiam internal leaks e a equipe responsável governa mudanças; o gate termina com propósito, linguagem, API, internals, boundaries, ownership, transactions, events, errors, tests, documentação e evidence aprovados, enquanto Context Map é aprofundado somente na aula 622 e Anti Corruption Layer permanece reservada à aula 623.
```
