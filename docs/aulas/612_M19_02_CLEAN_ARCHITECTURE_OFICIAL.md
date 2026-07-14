# 612 - M19.02 - Clean Architecture

## Apresentação da aula

Na aula 611, você iniciou o Módulo 19 organizando uma API em camadas:

```text
presentation;

application;

domain;

infrastructure.
```

A arquitetura em camadas trouxe uma primeira separação clara de responsabilidades.

Você definiu que:

- controllers cuidam de HTTP;
- casos de uso coordenam intenções;
- o domínio protege regras;
- a infraestrutura implementa detalhes técnicos;
- DTOs não substituem objetos de domínio;
- testes de arquitetura protegem dependências.

Essa base é importante, mas ainda deixa perguntas abertas.

Exemplos:

```text
quem define as interfaces
entre casos de uso
e detalhes externos?

o caso de uso
pode devolver um DTO HTTP?

a implementação do banco
pode decidir
como o caso de uso falha?

o framework
pode aparecer
nas classes centrais?

qual camada
deve depender de qual?

como trocar
a API HTTP,
o banco
ou o framework

sem reescrever
as regras centrais?
```

Clean Architecture aprofunda essas perguntas.

O ponto principal não é desenhar círculos em um diagrama.

O ponto principal é controlar dependências.

A regra central é:

```text
dependências de código
devem apontar
para políticas mais internas.
```

Isso significa que detalhes externos podem conhecer regras internas.

Regras internas não devem conhecer detalhes externos.

Exemplo:

```text
Spring conhece
o caso de uso.

O caso de uso
não conhece Spring.
```

Outro:

```text
adapter PostgreSQL conhece
a interface de persistência.

A interface de persistência
não conhece PostgreSQL.
```

Outro:

```text
controller HTTP conhece
o input boundary.

O input boundary
não conhece HTTP.
```

Nesta aula, você irá evoluir o projeto da aula 611 para uma organização inspirada em Clean Architecture.

O novo laboratório será:

```text
labs/m19/aula-612-clean-architecture/clean-orders-api
```

A aplicação continuará sintética e pequena.

Ela implementará:

- criação de pedido;
- consulta de pedido;
- confirmação;
- cancelamento;
- input boundaries;
- output boundaries;
- presenters;
- gateways;
- entities;
- use case data;
- adapters HTTP;
- adapter de persistência em memória;
- composição no framework;
- testes de dependência;
- testes de casos de uso;
- testes de adapters.

Você irá trabalhar com quatro áreas conceituais:

```text
entities;

use cases;

interface adapters;

frameworks and drivers.
```

Essas áreas não precisam necessariamente ser pastas com esses nomes exatos em todo projeto.

O importante é preservar a regra de dependência.

Nesta aula, você não irá implementar ainda:

- arquitetura hexagonal completa;
- desenho explícito de lado esquerdo e lado direito;
- adapters driving e driven como foco principal;
- catálogo completo de ports;
- múltiplos adapters para o mesmo port;
- domínio dirigido por bounded contexts;
- aggregates completos;
- domain services avançados;
- domain events distribuídos;
- CQRS;
- event sourcing;
- microservices;
- saga.

A próxima aula oficial será:

```text
613 - M19.03 - Arquitetura Hexagonal
```

Por isso, a aula 612 não irá transformar Clean Architecture em Ports and Adapters.

Ela irá permanecer na regra de dependência e nos boundaries de entrada e saída.

A pergunta central será:

```text
como manter
as regras centrais
independentes

de HTTP,
Spring,
banco,
JSON,
framework
e tecnologia?
```

A regra final da aula será:

```text
detalhes dependem
de políticas;

políticas não dependem
de detalhes.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
611:
Arquitetura em camadas.

612:
Clean Architecture.

613:
Arquitetura Hexagonal.

614:
Ports and Adapters.
```

A progressão é:

```text
separar responsabilidades;

controlar dependências;

modelar fronteiras externas;

formalizar ports e adapters.
```

Nesta aula:

```text
entities:
sim.

use cases:
sim.

input boundary:
sim.

output boundary:
sim.

presenter:
sim.

gateway:
sim.

request model:
sim.

response model:
sim.

framework composition:
sim.

dependency rule:
sim.

architecture tests:
sim.

arquitetura hexagonal:
não.

ports and adapters como tema central:
não.

DDD tático:
não.
```

A base conceitual da aula 611 será preservada.

Mas o laboratório será reorganizado para destacar:

```text
policies;

boundaries;

details;

dependency direction.
```

---

## Objetivo prático

A estrutura será:

```text
labs/m19/aula-612-clean-architecture/clean-orders-api
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/cleanorders
│   │   │       ├── CleanOrdersApplication.java
│   │   │       ├── entity
│   │   │       │   ├── Order.java
│   │   │       │   ├── OrderId.java
│   │   │       │   ├── OrderItem.java
│   │   │       │   ├── OrderStatus.java
│   │   │       │   └── DomainException.java
│   │   │       ├── usecase
│   │   │       │   ├── create
│   │   │       │   │   ├── CreateOrderInputBoundary.java
│   │   │       │   │   ├── CreateOrderOutputBoundary.java
│   │   │       │   │   ├── CreateOrderRequestModel.java
│   │   │       │   │   ├── CreateOrderResponseModel.java
│   │   │       │   │   └── CreateOrderInteractor.java
│   │   │       │   ├── find
│   │   │       │   ├── confirm
│   │   │       │   ├── cancel
│   │   │       │   └── gateway
│   │   │       │       └── OrderGateway.java
│   │   │       ├── adapter
│   │   │       │   ├── web
│   │   │       │   │   ├── OrderController.java
│   │   │       │   │   ├── request
│   │   │       │   │   ├── response
│   │   │       │   │   └── ApiExceptionHandler.java
│   │   │       │   ├── presenter
│   │   │       │   │   ├── CreateOrderPresenter.java
│   │   │       │   │   ├── FindOrderPresenter.java
│   │   │       │   │   ├── ConfirmOrderPresenter.java
│   │   │       │   │   └── CancelOrderPresenter.java
│   │   │       │   └── persistence
│   │   │       │       └── InMemoryOrderGateway.java
│   │   │       └── framework
│   │   │           └── configuration
│   │   │               └── CleanOrdersConfiguration.java
│   │   └── resources
│   │       └── application.yml
│   └── test
│       └── java
│           └── br/com/formacao/cleanorders
│               ├── architecture
│               │   └── CleanArchitectureDependencyTest.java
│               ├── entity
│               │   └── OrderTest.java
│               ├── usecase
│               │   ├── CreateOrderInteractorTest.java
│               │   └── ConfirmOrderInteractorTest.java
│               ├── adapter
│               │   ├── OrderControllerTest.java
│               │   ├── CreateOrderPresenterTest.java
│               │   └── InMemoryOrderGatewayTest.java
│               └── framework
│                   └── CleanOrdersContextTest.java
├── contracts
│   ├── clean-architecture-contract.yaml
│   ├── dependency-rule-policy.yaml
│   ├── entity-policy.yaml
│   ├── use-case-policy.yaml
│   ├── boundary-policy.yaml
│   ├── adapter-policy.yaml
│   ├── framework-policy.yaml
│   ├── error-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── docs
│   ├── CLEAN_ARCHITECTURE_OVERVIEW.md
│   ├── DEPENDENCY_RULE.md
│   ├── USE_CASE_FLOW.md
│   ├── BOUNDARIES_AND_MODELS.md
│   ├── FRAMEWORK_COMPOSITION.md
│   ├── TEST_STRATEGY.md
│   └── TROUBLESHOOTING.md
└── reports
    ├── dependency-rule-report.yaml
    ├── entity-report.yaml
    ├── use-case-report.yaml
    ├── adapter-report.yaml
    ├── framework-report.yaml
    └── clean-architecture-gate-report.yaml
```

Scripts:

```text
scripts/m19/clean-orders-api
├── validate-clean-architecture-contract.ps1
├── run-clean-orders-tests.ps1
├── validate-clean-dependency-rule.ps1
├── validate-clean-entities.ps1
├── validate-clean-use-cases.ps1
├── validate-clean-adapters.ps1
├── run-clean-orders-smoke.ps1
├── collect-clean-architecture-evidence.ps1
└── verify-clean-architecture-gate.ps1
```

Ao final, você terá uma aplicação cujas regras centrais permanecem independentes de detalhes externos.

---

## Conceito essencial

### Clean Architecture

Organização arquitetural que protege políticas internas contra dependências de detalhes externos.

---

### Dependency Rule

Regra segundo a qual dependências de código apontam para dentro, em direção a políticas mais centrais.

---

### Entity

Objeto que representa regras e comportamento de negócio mais estáveis.

---

### Use case

Política de aplicação que coordena uma intenção específica.

---

### Input boundary

Contrato de entrada de um caso de uso.

---

### Output boundary

Contrato usado pelo caso de uso para entregar resultado.

---

### Request model

Modelo de entrada do caso de uso.

---

### Response model

Modelo de saída produzido pelo caso de uso.

---

### Presenter

Componente que converte o response model para uma forma adequada ao mecanismo de entrega.

---

### Gateway

Contrato usado pelo caso de uso para acessar um detalhe externo.

---

### Interface adapter

Componente que converte dados entre o mundo externo e as políticas internas.

---

### Framework and driver

Detalhe externo como Spring, HTTP, banco, mensageria ou interface gráfica.

---

### Policy

Regra ou decisão central do sistema.

---

### Detail

Tecnologia ou mecanismo substituível.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-612-clean-architecture/clean-orders-api
```

Entre:

```powershell
Set-Location `
  labs/m19/aula-612-clean-architecture/clean-orders-api
```

---

### 2. Criar o projeto

Use:

- Java 21;
- Maven;
- Spring Web;
- Validation;
- Spring Boot Test;
- ArchUnit.

O Spring ficará restrito a adapters e framework composition.

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/clean-architecture-contract.yaml
```

Conteúdo:

```yaml
cleanArchitecture:
  required:
    - entities
    - use-cases
    - input-boundaries
    - output-boundaries
    - gateways
    - presenters
    - adapters
    - framework-composition
    - dependency-rule
    - architecture-tests

  forbidden:
    - entity-to-framework
    - use-case-to-HTTP
    - use-case-to-database-implementation
    - presenter-business-rule
    - controller-domain-rule

  nextLesson:
    code:
      M19.03
```

---

### 4. Criar a dependency rule

Arquivo:

```text
contracts/dependency-rule-policy.yaml
```

Conteúdo:

```yaml
dependencyRule:
  entity:
    mayDependOn:
      - Java-standard-library

  usecase:
    mayDependOn:
      - entity
      - usecase-boundaries

  adapter:
    mayDependOn:
      - usecase
      - entity

  framework:
    mayDependOn:
      - adapter
      - usecase
      - entity

  inwardDependency:
    required

  outwardDependency:
    forbidden
```

---

### 5. Visualizar as áreas

Representação didática:

```text
frameworks and drivers
        |
        v
interface adapters
        |
        v
use cases
        |
        v
entities
```

As setas representam dependências de código.

O fluxo de execução pode voltar por interfaces.

Exemplo:

```text
controller chama input boundary;

interactor chama output boundary;

presenter recebe response model;

controller devolve resposta.
```

---

### 6. Criar entity policy

Arquivo:

```text
contracts/entity-policy.yaml
```

Conteúdo:

```yaml
entity:
  owns:
    - business-invariants
    - state-transitions
    - stable-business-behavior

  forbidden:
    - Spring-annotation
    - HTTP-type
    - persistence-annotation
    - JSON-annotation
    - framework-exception
```

---

### 7. Criar `OrderId`

```java
public record OrderId(
        UUID value) {

    public OrderId {
        Objects.requireNonNull(
                value,
                "value is required");
    }

    public static OrderId newId() {
        return new OrderId(
                UUID.randomUUID());
    }
}
```

---

### 8. Criar `OrderItem`

```java
public record OrderItem(
        String productReference,
        int quantity,
        BigDecimal unitPrice) {

    public OrderItem {
        if (productReference == null
                || productReference.isBlank()) {
            throw new DomainException(
                    "Product reference is required");
        }

        if (quantity <= 0) {
            throw new DomainException(
                    "Quantity must be positive");
        }

        if (unitPrice == null
                || unitPrice.signum() <= 0) {
            throw new DomainException(
                    "Unit price must be positive");
        }
    }

    public BigDecimal subtotal() {
        return unitPrice.multiply(
                BigDecimal.valueOf(quantity));
    }
}
```

---

### 9. Criar `Order`

```java
public final class Order {

    private final OrderId id;
    private final List<OrderItem> items;
    private final Instant createdAt;

    private OrderStatus status;

    private Order(
            OrderId id,
            List<OrderItem> items,
            Instant createdAt) {

        if (items == null
                || items.isEmpty()) {
            throw new DomainException(
                    "Order must contain items");
        }

        this.id = id;
        this.items = List.copyOf(items);
        this.createdAt = createdAt;
        this.status = OrderStatus.CREATED;
    }

    public static Order create(
            OrderId id,
            List<OrderItem> items,
            Instant createdAt) {

        return new Order(
                id,
                items,
                createdAt);
    }

    public void confirm() {
        ensureCreated();
        status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        ensureCreated();
        status = OrderStatus.CANCELLED;
    }

    private void ensureCreated() {
        if (status != OrderStatus.CREATED) {
            throw new DomainException(
                    "Order must be created");
        }
    }
}
```

A entity não conhece `Clock`.

O caso de uso pode receber o tempo e fornecer à criação.

Essa é uma decisão possível para manter orchestration no use case.

---

### 10. Criar use case policy

Arquivo:

```text
contracts/use-case-policy.yaml
```

Conteúdo:

```yaml
useCase:
  owns:
    - application-flow
    - entity-coordination
    - gateway-calls
    - transaction-intent
    - output-boundary-call

  forbidden:
    - HTTP-response
    - JSON
    - Spring-MVC
    - database-driver
    - framework-configuration
```

---

### 11. Criar input boundary

```java
public interface CreateOrderInputBoundary {

    void execute(
            CreateOrderRequestModel request);
}
```

O controller depende dessa interface.

Ele não precisa conhecer o interactor concreto.

---

### 12. Criar output boundary

```java
public interface CreateOrderOutputBoundary {

    void present(
            CreateOrderResponseModel response);
}
```

O interactor depende da interface.

Ele não conhece `ResponseEntity` nem JSON.

---

### 13. Criar request model

```java
public record CreateOrderRequestModel(
        List<CreateOrderItemModel> items) {
}
```

Esse modelo pertence ao caso de uso.

Ele não possui annotations HTTP.

---

### 14. Criar response model

```java
public record CreateOrderResponseModel(
        UUID id,
        String status,
        BigDecimal total,
        Instant createdAt) {
}
```

Esse modelo representa a saída do caso de uso antes do formato externo.

---

### 15. Criar gateway

```java
public interface OrderGateway {

    Order save(
            Order order);

    Optional<Order> findById(
            OrderId id);
}
```

O gateway pertence à área dos casos de uso.

Ele descreve o que a política precisa do mundo externo.

---

### 16. Criar ID generator

Para evitar `UUID.randomUUID()` dentro da entity, crie:

```java
public interface OrderIdGenerator {

    OrderId next();
}
```

O use case depende desse contrato.

A implementação concreta ficará fora.

---

### 17. Criar interactor

```java
public final class CreateOrderInteractor
        implements CreateOrderInputBoundary {

    private final OrderGateway gateway;
    private final CreateOrderOutputBoundary output;
    private final OrderIdGenerator idGenerator;
    private final Clock clock;

    public CreateOrderInteractor(
            OrderGateway gateway,
            CreateOrderOutputBoundary output,
            OrderIdGenerator idGenerator,
            Clock clock) {

        this.gateway = gateway;
        this.output = output;
        this.idGenerator = idGenerator;
        this.clock = clock;
    }

    @Override
    public void execute(
            CreateOrderRequestModel request) {

        List<OrderItem> items =
                request.items()
                        .stream()
                        .map(this::toEntity)
                        .toList();

        Order order =
                Order.create(
                        idGenerator.next(),
                        items,
                        clock.instant());

        Order saved =
                gateway.save(order);

        output.present(
                OrderResponseMapper.from(saved));
    }
}
```

O interactor:

- recebe modelo interno;
- cria entities;
- usa gateway;
- produz response model;
- chama output boundary.

---

### 18. Criar interactor de consulta

Fluxo:

```text
receber ID;

criar OrderId;

consultar gateway;

falhar com exception da aplicação;

mapear entity;

chamar output boundary.
```

Não devolver `ResponseEntity`.

---

### 19. Criar interactors de confirmação e cancelamento

Fluxo:

```text
localizar entity;

executar transição;

persistir;

produzir response model;

chamar presenter.
```

A regra de transição continua na entity.

---

### 20. Criar presenter

```java
@Component
@Scope(
        ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public final class CreateOrderPresenter
        implements CreateOrderOutputBoundary {

    private OrderViewModel viewModel;

    @Override
    public void present(
            CreateOrderResponseModel response) {

        this.viewModel =
                new OrderViewModel(
                        response.id(),
                        response.status(),
                        response.total(),
                        response.createdAt());
    }

    public OrderViewModel viewModel() {
        return viewModel;
    }
}
```

O presenter converte o response model.

Ele não decide regra de negócio.

---

### 21. Entender o estado do presenter

Um presenter stateful por request exige cuidado.

Alternativas:

- prototype scope;
- presenter retornando resultado;
- response collector;
- boundary funcional;
- mediator.

Nesta aula, use uma abordagem explícita e testável.

Documente o lifecycle.

---

### 22. Criar boundary policy

Arquivo:

```text
contracts/boundary-policy.yaml
```

Conteúdo:

```yaml
boundaries:
  input:
    implementedBy:
      interactor

  output:
    implementedBy:
      presenter

  requestModel:
    frameworkAnnotation:
      forbidden

  responseModel:
    frameworkAnnotation:
      forbidden

  presenter:
    businessRule:
      forbidden
```

---

### 23. Criar adapter web

O controller converte:

```text
HTTP request
para
request model.
```

Exemplo:

```java
@RestController
@RequestMapping("/api/orders")
public final class OrderController {

    private final CreateOrderInputBoundary createOrder;
    private final CreateOrderPresenter presenter;

    @PostMapping
    public ResponseEntity<OrderViewModel> create(
            @Valid
            @RequestBody
            CreateOrderHttpRequest request) {

        createOrder.execute(
                HttpRequestMapper.toModel(request));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(presenter.viewModel());
    }
}
```

---

### 24. Não deixar HTTP entrar no use case

Proibidos no interactor:

```text
ResponseEntity;

HttpStatus;

HttpServletRequest;

@RequestBody;

@PathVariable;

@Valid;

JSON annotation.
```

---

### 25. Criar persistence adapter

```java
public final class InMemoryOrderGateway
        implements OrderGateway {

    private final Map<OrderId, Order>
            storage =
            new ConcurrentHashMap<>();

    @Override
    public Order save(
            Order order) {

        storage.put(
                order.id(),
                order);

        return order;
    }

    @Override
    public Optional<Order> findById(
            OrderId id) {

        return Optional.ofNullable(
                storage.get(id));
    }
}
```

O adapter conhece o gateway.

O gateway não conhece o adapter.

---

### 26. Criar adapter policy

Arquivo:

```text
contracts/adapter-policy.yaml
```

Conteúdo:

```yaml
adapter:
  web:
    owns:
      - HTTP-mapping
      - validation-format
      - request-conversion
      - response-conversion

  persistence:
    owns:
      - storage-mechanism
      - technical-mapping
      - technical-exception-conversion

  forbidden:
    - business-rule
    - use-case-orchestration
```

---

### 27. Criar framework composition

Arquivo:

```java
@Configuration
public class CleanOrdersConfiguration {

    @Bean
    OrderGateway orderGateway() {
        return new InMemoryOrderGateway();
    }

    @Bean
    OrderIdGenerator orderIdGenerator() {
        return () ->
                new OrderId(
                        UUID.randomUUID());
    }

    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    CreateOrderInputBoundary createOrder(
            OrderGateway gateway,
            CreateOrderPresenter presenter,
            OrderIdGenerator generator,
            Clock clock) {

        return new CreateOrderInteractor(
                gateway,
                presenter,
                generator,
                clock);
    }
}
```

O framework monta as dependências.

Os interactors não recebem annotations Spring.

---

### 28. Criar framework policy

Arquivo:

```text
contracts/framework-policy.yaml
```

Conteúdo:

```yaml
framework:
  owns:
    - dependency-composition
    - server-startup
    - framework-configuration
    - external-configuration

  forbidden:
    - domain-invariant
    - use-case-policy
    - business-decision
```

---

### 29. Mapear erros

Crie exceptions internas:

```text
OrderNotFoundException;

UseCaseException;

DomainException.
```

O adapter web converte para resposta HTTP.

O interactor não conhece o status.

---

### 30. Criar error policy

Arquivo:

```text
contracts/error-policy.yaml
```

Conteúdo:

```yaml
errors:
  entity:
    mayThrow:
      - domain-exception

  usecase:
    mayThrow:
      - application-exception

  adapter:
    mapsToExternalProtocol:
      required

  frameworkExceptionToEntity:
    forbidden

  rawTechnicalExceptionToClient:
    forbidden
```

---

### 31. Criar teste de entity

```java
@Test
void shouldRejectConfirmAfterCancellation() {

    Order order =
            orderCreated();

    order.cancel();

    assertThrows(
            DomainException.class,
            order::confirm);
}
```

Sem Spring.

---

### 32. Criar teste de interactor

Use fakes:

```java
@Test
void shouldCreateAndPresentOrder() {

    InMemoryOrderGateway gateway =
            new InMemoryOrderGateway();

    CapturingCreateOrderPresenter presenter =
            new CapturingCreateOrderPresenter();

    OrderIdGenerator generator =
            () -> new OrderId(
                    UUID.fromString(
                            "00000000-0000-0000-0000-000000000001"));

    Clock clock =
            Clock.fixed(
                    Instant.parse(
                            "2026-07-14T12:00:00Z"),
                    ZoneOffset.UTC);

    CreateOrderInteractor interactor =
            new CreateOrderInteractor(
                    gateway,
                    presenter,
                    generator,
                    clock);

    interactor.execute(
            validRequestModel());

    assertEquals(
            "CREATED",
            presenter.response().status());
}
```

---

### 33. Criar capturing presenter

```java
public final class CapturingCreateOrderPresenter
        implements CreateOrderOutputBoundary {

    private CreateOrderResponseModel response;

    @Override
    public void present(
            CreateOrderResponseModel response) {

        this.response = response;
    }

    public CreateOrderResponseModel response() {
        return response;
    }
}
```

Esse fake testa o use case sem HTTP.

---

### 34. Testar presenter real

Valide:

- conversão de nomes;
- formatos;
- campos;
- ausência de regra de negócio;
- tratamento de valores permitidos.

---

### 35. Testar controller

Use `MockMvc`.

Valide:

- request HTTP;
- validação;
- mapping;
- status;
- view model;
- error mapping.

O teste do controller pode mockar o input boundary.

---

### 36. Criar architecture tests

Use ArchUnit.

Regra entity:

```java
@ArchTest
static final ArchRule entitiesMustNotDependOnOuterAreas =
        noClasses()
                .that()
                .resideInAPackage(
                        "..entity..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..usecase..",
                        "..adapter..",
                        "..framework..",
                        "org.springframework..");
```

---

### 37. Regra de use case

```java
@ArchTest
static final ArchRule useCasesMustNotDependOnAdapters =
        noClasses()
                .that()
                .resideInAPackage(
                        "..usecase..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..adapter..",
                        "..framework..",
                        "org.springframework..");
```

---

### 38. Regra de adapters

Adapters podem depender de use cases e entities.

Mas não devem ser dependência das áreas internas.

---

### 39. Regra de framework

Framework composition pode conhecer várias áreas para montar objetos.

Isso não significa que deve conter regras.

Valide classes e annotations permitidas.

---

### 40. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  HTTPTypeInsideUseCase:
    action:
      fail-dependency-rule

  SpringAnnotationInsideEntity:
    action:
      fail-entity

  presenterWithBusinessRule:
    result:
      policy-leak

  gatewayImplementationInsideUseCase:
    action:
      fail-boundary

  requestModelWithJSONAnnotation:
    result:
      framework-leak
```

---

### 41. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  outwardDependency:
    action:
      FAIL

  controllerCallingGatewayDirectly:
    action:
      FAIL

  interactorReturningResponseEntity:
    action:
      FAIL

  entityDependingOnFramework:
    action:
      FAIL

  HexagonalArchitecture:
    deferredToLesson613

  PortsAndAdapters:
    deferredToLesson614
```

---

### 42. Documentar fluxo

Arquivo:

```text
docs/USE_CASE_FLOW.md
```

Criação:

```text
HTTP request;

web request DTO;

request mapper;

CreateOrderRequestModel;

CreateOrderInputBoundary;

CreateOrderInteractor;

Order entity;

OrderGateway;

CreateOrderResponseModel;

CreateOrderOutputBoundary;

CreateOrderPresenter;

OrderViewModel;

HTTP response.
```

---

### 43. Documentar boundaries

Arquivo:

```text
docs/BOUNDARIES_AND_MODELS.md
```

Diferencie:

- HTTP request DTO;
- request model;
- entity;
- response model;
- view model;
- persistence model, quando existir.

Cada modelo atende a uma fronteira.

---

### 44. Evitar excesso de modelos

Separação não significa copiar todos os campos em dez objetos sem motivo.

Use modelos diferentes quando:

- contrato externo difere;
- ciclo de vida difere;
- responsabilidade difere;
- tecnologia difere;
- evolução independente é necessária.

Documente trade-offs.

---

### 45. Executar testes

Execute:

```powershell
.\scripts\m19\clean-orders-api\run-clean-orders-tests.ps1
```

Ou:

```powershell
mvn test
```

Confirme:

- entities;
- interactors;
- presenters;
- adapters;
- context;
- architecture rules.

---

### 46. Executar smoke

Execute:

```powershell
.\scripts\m19\clean-orders-api\run-clean-orders-smoke.ps1
```

Fluxo:

1. criar pedido;
2. consultar;
3. confirmar;
4. consultar;
5. tentar cancelar;
6. validar erro;
7. confirmar contrato HTTP.

---

### 47. Validar entities

Execute:

```powershell
.\scripts\m19\clean-orders-api\validate-clean-entities.ps1
```

Procure:

- annotations Spring;
- HTTP;
- persistence;
- JSON;
- regra fora da entity;
- mutabilidade indevida.

---

### 48. Validar use cases

Execute:

```powershell
.\scripts\m19\clean-orders-api\validate-clean-use-cases.ps1
```

Procure:

- `ResponseEntity`;
- `HttpStatus`;
- controller;
- adapter concreto;
- driver de banco;
- regra de apresentação;
- annotation Spring.

---

### 49. Validar adapters

Execute:

```powershell
.\scripts\m19\clean-orders-api\validate-clean-adapters.ps1
```

Confirme:

- adapters convertem;
- presenters apresentam;
- gateways implementam contratos;
- nenhuma regra central foi movida para fora.

---

### 50. Criar gate

O gate valida:

```text
build;

entities;

use cases;

input boundaries;

output boundaries;

gateways;

presenters;

web adapter;

persistence adapter;

framework composition;

dependency rule;

tests;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_BUILD;

FAIL_ENTITY;

FAIL_USE_CASE;

FAIL_BOUNDARY;

FAIL_GATEWAY;

FAIL_PRESENTER;

FAIL_ADAPTER;

FAIL_FRAMEWORK;

FAIL_DEPENDENCY_RULE;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 51. Coletar evidence

Arquivo:

```text
contracts/clean-architecture-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- entity status;
- use case status;
- input boundary status;
- output boundary status;
- gateway status;
- presenter status;
- web adapter status;
- persistence adapter status;
- framework status;
- dependency rule status;
- test status;
- smoke status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- secrets;
- IDs reais;
- payload real;
- desenho completo de arquitetura hexagonal;
- catálogo completo de ports and adapters.

---

### 52. Executar validação completa

Execute:

```powershell
.\scripts\m19\clean-orders-api\validate-clean-architecture-contract.ps1

.\scripts\m19\clean-orders-api\run-clean-orders-tests.ps1

.\scripts\m19\clean-orders-api\validate-clean-dependency-rule.ps1

.\scripts\m19\clean-orders-api\validate-clean-entities.ps1

.\scripts\m19\clean-orders-api\validate-clean-use-cases.ps1

.\scripts\m19\clean-orders-api\validate-clean-adapters.ps1

.\scripts\m19\clean-orders-api\run-clean-orders-smoke.ps1

.\scripts\m19\clean-orders-api\collect-clean-architecture-evidence.ps1

.\scripts\m19\clean-orders-api\verify-clean-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 53. Encerrar o laboratório

Confirme:

- aplicação encerrada;
- testes aprovados;
- architecture tests aprovados;
- nenhuma dependência externa indevida;
- nenhum processo residual;
- reports sanitizados;
- nenhuma implementação hexagonal completa;
- Ports and Adapters não antecipado.

---

## Entendendo o que foi feito

### As entities ganharam independência

Regras estáveis deixaram de conhecer frameworks.

### Os use cases ganharam boundaries

Entrada e saída passaram a ser contratos explícitos.

### Os interactors ganharam foco

Coordenação deixou de se misturar com HTTP ou banco.

### Os gateways ganharam direção

Casos de uso passaram a definir o que precisam dos detalhes externos.

### Os presenters ganharam responsabilidade

Formatação externa deixou de entrar no núcleo.

### Os adapters ganharam função de conversão

HTTP e persistência passaram a traduzir modelos.

### O framework ganhou posição externa

Spring passou a montar objetos, não a definir políticas.

### A dependency rule ganhou teste

Dependências proibidas passaram a falhar automaticamente.

### Os modelos ganharam contexto

Request DTO, request model, entity, response model e view model deixaram de ser confundidos.

### A próxima aula ganhou fronteira

Arquitetura Hexagonal fica para a aula 613.

---

## Erros comuns importantes

### Decorar os círculos

O desenho não substitui a regra de dependência.

### Colocar Spring no interactor

O caso de uso volta a depender do detalhe.

### Retornar `ResponseEntity` do use case

HTTP invade a política.

### Fazer presenter decidir regra

Apresentação passa a controlar negócio.

### Controller chamar gateway diretamente

A orquestração ignora o interactor.

### Entity usar annotation de persistência

O núcleo fica acoplado ao banco.

### Criar modelos demais sem necessidade

A arquitetura fica burocrática.

### Criar interface para toda classe

A abstração não possui propósito.

### Confundir fluxo de execução com dependência

Callbacks podem inverter a direção de execução sem inverter a dependência.

### Antecipar arquitetura hexagonal

A aula perde o foco na dependency rule.

---

## Comandos úteis

### Executar testes

```powershell
.\scripts\m19\clean-orders-api\run-clean-orders-tests.ps1
```

### Validar dependency rule

```powershell
.\scripts\m19\clean-orders-api\validate-clean-dependency-rule.ps1
```

### Validar use cases

```powershell
.\scripts\m19\clean-orders-api\validate-clean-use-cases.ps1
```

### Executar smoke

```powershell
.\scripts\m19\clean-orders-api\run-clean-orders-smoke.ps1
```

### Verificar gate

```powershell
.\scripts\m19\clean-orders-api\verify-clean-architecture-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Entities

Implemente regras independentes.

### Parte 2 — Input boundary

Defina o contrato de entrada.

### Parte 3 — Output boundary

Defina o contrato de saída.

### Parte 4 — Interactor

Coordene o caso de uso.

### Parte 5 — Gateway

Defina necessidades externas.

### Parte 6 — Presenter

Converta response model em view model.

### Parte 7 — Adapters

Implemente HTTP e persistência.

### Parte 8 — Framework

Monte dependências no Spring.

### Parte 9 — Architecture tests

Proteja a dependency rule.

### Parte 10 — Gate

Valide fluxo, contracts e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 611 e ponte para a aula 613 foram preservadas;
- entities, use cases, adapters e framework foram organizados;
- a dependency rule foi documentada;
- entities não dependem de Spring, HTTP, JSON ou persistência;
- use cases não dependem de controllers, adapters ou framework;
- input boundaries são implementados por interactors;
- output boundaries são implementados por presenters;
- request models não possuem annotations HTTP;
- response models não possuem annotations HTTP;
- gateway é definido na área interna;
- persistence adapter implementa o gateway;
- controller depende do input boundary;
- controller não chama gateway diretamente;
- interactor não retorna `ResponseEntity`;
- presenter não contém regra de negócio;
- framework composition monta os objetos;
- `Clock` e gerador de ID são injetáveis;
- exceptions internas são mapeadas no adapter externo;
- entity tests não sobem Spring;
- interactor tests usam gateways e presenters controlados;
- controller tests validam HTTP;
- presenter tests validam apresentação;
- architecture tests protegem dependências;
- documentação de dependency rule, boundaries, fluxo e composição foi criada;
- reports, gate e evidence foram criados;
- nenhuma informação sensível foi incluída;
- arquitetura hexagonal e Ports and Adapters não foram antecipados;
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
  labs/m19/aula-612-clean-architecture/clean-orders-api `
  scripts/m19/clean-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReferenceReal|drivingAdapterCatalog|drivenAdapterCatalog|hexagonDiagram|boundedContext|domainEventDistributed"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar Clean Architecture"
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
- adapter PostgreSQL real;
- arquitetura hexagonal completa;
- catálogo de Ports and Adapters;
- DDD;
- sistemas distribuídos.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você evoluiu da arquitetura em camadas para Clean Architecture.

Você criou:

```text
entities;

use cases;

input boundaries;

output boundaries;

request models;

response models;

interactors;

gateways;

presenters;

web adapter;

persistence adapter;

framework composition;

architecture tests.
```

Você comprovou que Clean Architecture não é apenas um diagrama; que dependências devem apontar para políticas internas; que entities e use cases não podem depender de frameworks; que controllers convertem HTTP; que interactors coordenam regras; que presenters convertem saída; que gateways descrevem necessidades externas; que Spring pode montar o sistema sem dominar o núcleo; e que a regra de dependência precisa ser automatizada por testes.

A próxima aula será:

```text
613 - M19.03 - Arquitetura Hexagonal
```

Nela, você irá estudar a aplicação como um núcleo cercado por adapters, diferenciando entradas, saídas e mecanismos externos.

Nenhum desenho hexagonal completo, classificação formal de adapters ou catálogo de Ports and Adapters foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mantive entities independentes.
- [ ] Criei input e output boundaries.
- [ ] Implementei interactors.
- [ ] Defini gateways.
- [ ] Criei presenters.
- [ ] Implementei adapters externos.
- [ ] Montei dependências no framework.
- [ ] Protegi a dependency rule.

---

## Troubleshooting adicional

### Interactor precisa de `ResponseEntity`

Crie output boundary e presenter.

### Controller precisa conhecer entity

Converta para request model ou view model.

### Entity precisa de `@Entity`

Nesta aula, mantenha persistência fora do núcleo.

### Presenter precisa consultar banco

A consulta pertence ao use case.

### Gateway retorna model HTTP

Use entity ou modelo interno apropriado.

### Spring não encontra o interactor

Revise configuration beans.

### Presenter prototype não funciona

Revise lifecycle e forma de composição.

### ArchUnit acusa dependência indireta

Inspecione tipos de assinatura, imports e annotations.

### Existem muitos modelos iguais

Revise se as fronteiras realmente exigem independência.

### O projeto começou a classificar driving e driven adapters

Preserve o aprofundamento para as aulas 613 e 614.

---

## Perguntas de revisão

1. O que é Clean Architecture?
2. O que é dependency rule?
3. O que é entity?
4. O que é use case?
5. O que é input boundary?
6. O que é output boundary?
7. O que é request model?
8. O que é response model?
9. O que é presenter?
10. O que é gateway?
11. O que é interface adapter?
12. O que são frameworks and drivers?
13. Por que interactor não deve conhecer HTTP?
14. Por que entity não deve conhecer persistência?
15. Quem implementa input boundary?
16. Quem implementa output boundary?
17. Onde Spring deve aparecer?
18. Para que servem architecture tests?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Arquitetura que protege políticas internas.
2. Dependências apontam para dentro.
3. Regra e comportamento estável de negócio.
4. Política de aplicação.
5. Contrato de entrada do caso de uso.
6. Contrato de saída do caso de uso.
7. Dados internos de entrada.
8. Dados internos de saída.
9. Conversor da saída para apresentação.
10. Contrato para detalhes externos.
11. Conversor entre mundo externo e políticas.
12. Detalhes externos e tecnologias.
13. Preservar independência do protocolo.
14. Preservar independência do mecanismo técnico.
15. O interactor.
16. O presenter.
17. Na composição e nos adapters externos.
18. Impedir regressão arquitetural.
19. Arquitetura Hexagonal.
20. Arquitetura Hexagonal.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 612 - M19.02 - Clean Architecture

- Evoluí da arquitetura em camadas para Clean Architecture.
- Criei o laboratório `clean-orders-api`.
- Organizei entities, use cases, adapters e framework.
- Documentei e protegi a dependency rule.
- Mantive entities sem Spring, HTTP, JSON ou persistência.
- Criei input boundaries e output boundaries.
- Criei request models e response models internos.
- Implementei interactors para os casos de uso.
- Defini gateways para necessidades externas.
- Criei presenters para converter saídas.
- Implementei web adapter e persistence adapter em memória.
- Mantive controllers focados em HTTP.
- Montei dependências no Spring sem contaminar o núcleo.
- Injetei `Clock` e gerador de ID.
- Criei testes de entities, interactors, presenters e adapters.
- Usei ArchUnit para proteger dependências.
- Criei reports, gate e evidence.
- Não antecipei arquitetura hexagonal ou Ports and Adapters.
- Próxima aula: Arquitetura Hexagonal.
```

---

## Referência técnica curta

- Clean Architecture.
- Dependency Rule.
- Entities.
- Use cases.
- Input boundaries.
- Output boundaries.
- Presenters.
- Gateways.
- Interface adapters.
- Architecture tests.

Regra final:

```text
Clean Architecture precisa proteger políticas internas por meio da dependency rule: entities concentram regras estáveis sem depender de Spring, HTTP, JSON ou persistência, use cases coordenam intenções por interactors, request models e response models internos, input boundaries definem entrada, output boundaries definem saída, gateways descrevem necessidades externas e presenters convertem resultados sem decidir negócio; web e persistence adapters conhecem contratos internos, enquanto interactors não conhecem controllers, drivers, banco ou `ResponseEntity`, e o framework permanece na composição das dependências; models são separados quando fronteiras exigem evolução independente, exceptions internas são mapeadas no adapter externo, testes unitários validam policies sem Spring e ArchUnit bloqueia dependências para fora; o gate termina com entities, use cases, boundaries, adapters, composição, documentação e evidence aprovados, enquanto Arquitetura Hexagonal começa somente na aula 613 e Ports and Adapters permanece reservado à aula 614.
```
