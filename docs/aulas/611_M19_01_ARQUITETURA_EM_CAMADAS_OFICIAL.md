# 611 - M19.01 - Arquitetura em camadas

## Apresentação da aula

Você concluiu o Módulo 18 aprendendo a operar sistemas Java em produção.

Naquele módulo, você observou sintomas como:

```text
logs duplicados;

métricas espalhadas;

transações longas;

regras misturadas com infraestrutura;

tratamento de erro inconsistente;

testes difíceis;

dependências difíceis de substituir;

runbooks complexos;

mudanças pequenas com impacto amplo.
```

Esses sintomas não aparecem apenas por falta de monitoramento.

Muitos deles nascem da forma como o código foi organizado.

Por isso, o Módulo 19 inicia uma nova etapa da formação:

```text
Arquitetura,
DDD,
sistemas distribuídos
e liderança técnica.
```

A primeira pergunta será:

```text
como dividir
uma aplicação backend

em responsabilidades claras

sem transformar
o projeto
em um conjunto
de pastas decorativas?
```

Nesta aula, você aprenderá arquitetura em camadas.

O objetivo não será decorar nomes como:

```text
controller;

service;

repository.
```

Esses nomes são comuns, mas sozinhos não formam uma arquitetura.

A arquitetura aparece quando existem:

- responsabilidades explícitas;
- fronteiras;
- direção de chamadas;
- contratos;
- regras sobre dependências;
- decisões sobre onde cada comportamento deve ficar;
- testes que protegem essas decisões.

Uma aplicação pode ter pastas chamadas:

```text
controller;

service;

repository;
```

e continuar desorganizada.

Exemplo:

```text
controller acessa banco;

service conhece HTTP;

repository decide regra de negócio;

entity JPA contém regra de apresentação;

exception de infraestrutura vaza até o cliente.
```

Nesse caso, as pastas existem, mas as fronteiras não.

Nesta aula, você irá organizar uma API sintética de pedidos em camadas tradicionais:

```text
presentation;

application;

domain;

infrastructure.
```

Cada camada terá uma função.

A camada de apresentação cuidará da entrada e saída HTTP.

A camada de aplicação coordenará casos de uso.

A camada de domínio representará regras e estados do negócio.

A camada de infraestrutura implementará persistência e integrações técnicas.

Você irá trabalhar com um projeto didático próprio:

```text
projects/layered-orders-api
```

Ele será menor do que a API observável do Módulo 18.

Isso permitirá concentrar a aula em arquitetura, não em ferramentas operacionais.

O laboratório implementará:

- criação de pedido;
- consulta de pedido;
- confirmação;
- cancelamento;
- persistência em memória;
- contratos entre camadas;
- mapeamento de erros;
- testes de arquitetura;
- testes por camada.

O laboratório não irá implementar ainda:

- Clean Architecture completa;
- regra explícita de dependências para círculos concêntricos;
- ports and adapters;
- arquitetura hexagonal;
- DDD tático completo;
- aggregates;
- bounded contexts;
- domain events distribuídos;
- microservices;
- mensageria;
- saga;
- CQRS;
- event sourcing.

Esses temas aparecerão em aulas futuras do Módulo 19.

A próxima aula oficial será:

```text
612 - M19.02 - Clean Architecture
```

Por isso, esta aula ficará na arquitetura em camadas clássica.

A regra central será:

```text
camadas existem
para separar responsabilidades

e reduzir o impacto
de mudanças,

não apenas
para organizar arquivos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
610:
Fechamento do Modulo 18.

611:
Arquitetura em camadas.

612:
Clean Architecture.

613:
Arquitetura Hexagonal.
```

A progressão é:

```text
operar sistemas;

entender responsabilidades;

controlar dependências;

modelar ports e adapters.
```

Nesta aula:

```text
camada de apresentação:
sim.

camada de aplicação:
sim.

camada de domínio:
sim.

camada de infraestrutura:
sim.

DTOs:
sim.

use cases:
sim.

repository interface:
sim.

repository em memória:
sim.

mapeamento entre camadas:
sim.

testes de arquitetura:
sim.

Clean Architecture:
não.

arquitetura hexagonal:
não.

DDD tático:
não.
```

O novo laboratório será:

```text
labs/m19/aula-611-arquitetura-em-camadas/layered-orders-api
```

A aplicação será criada com Java 21 e Spring Boot, seguindo a baseline tecnológica da formação.

---

## Objetivo prático

Será criada a seguinte estrutura:

```text
labs/m19/aula-611-arquitetura-em-camadas/layered-orders-api
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/layeredorders
│   │   │       ├── LayeredOrdersApplication.java
│   │   │       ├── presentation
│   │   │       │   ├── OrderController.java
│   │   │       │   ├── ApiExceptionHandler.java
│   │   │       │   ├── request
│   │   │       │   │   └── CreateOrderRequest.java
│   │   │       │   └── response
│   │   │       │       ├── OrderResponse.java
│   │   │       │       └── ApiErrorResponse.java
│   │   │       ├── application
│   │   │       │   ├── CreateOrderUseCase.java
│   │   │       │   ├── FindOrderUseCase.java
│   │   │       │   ├── ConfirmOrderUseCase.java
│   │   │       │   ├── CancelOrderUseCase.java
│   │   │       │   ├── command
│   │   │       │   │   └── CreateOrderCommand.java
│   │   │       │   └── result
│   │   │       │       └── OrderResult.java
│   │   │       ├── domain
│   │   │       │   ├── Order.java
│   │   │       │   ├── OrderId.java
│   │   │       │   ├── OrderStatus.java
│   │   │       │   ├── OrderItem.java
│   │   │       │   ├── OrderRepository.java
│   │   │       │   ├── DomainException.java
│   │   │       │   └── OrderNotFoundException.java
│   │   │       └── infrastructure
│   │   │           ├── configuration
│   │   │           │   └── LayeredOrdersConfiguration.java
│   │   │           └── persistence
│   │   │               └── InMemoryOrderRepository.java
│   │   └── resources
│   │       └── application.yml
│   └── test
│       └── java
│           └── br/com/formacao/layeredorders
│               ├── architecture
│               │   └── LayerDependencyTest.java
│               ├── presentation
│               │   └── OrderControllerTest.java
│               ├── application
│               │   └── CreateOrderUseCaseTest.java
│               ├── domain
│               │   └── OrderTest.java
│               └── infrastructure
│                   └── InMemoryOrderRepositoryTest.java
├── docs
│   ├── ARCHITECTURE.md
│   ├── LAYER_RESPONSIBILITIES.md
│   ├── DEPENDENCY_RULES.md
│   ├── REQUEST_FLOW.md
│   ├── TEST_STRATEGY.md
│   └── TROUBLESHOOTING.md
├── contracts
│   ├── layered-architecture-contract.yaml
│   ├── layer-responsibility-policy.yaml
│   ├── layer-dependency-policy.yaml
│   ├── error-mapping-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
└── reports
    ├── layer-boundary-report.yaml
    ├── dependency-report.yaml
    ├── test-report.yaml
    └── layered-architecture-gate-report.yaml
```

Também serão criados scripts:

```text
scripts/m19/layered-orders-api
├── validate-layered-architecture-contract.ps1
├── run-layered-orders-tests.ps1
├── validate-layer-dependencies.ps1
├── validate-layer-responsibilities.ps1
├── run-layered-orders-smoke.ps1
├── validate-layered-orders-errors.ps1
├── collect-layered-architecture-evidence.ps1
└── verify-layered-architecture-gate.ps1
```

Ao final, você terá uma API funcional organizada por camadas e protegida por testes.

---

## Conceito essencial

### Arquitetura de software

Conjunto de decisões estruturais que organiza componentes, responsabilidades, dependências e mudanças.

---

### Camada

Agrupamento de responsabilidades relacionadas.

---

### Fronteira

Limite que separa responsabilidades e controla comunicação.

---

### Presentation layer

Camada responsável por entrada, validação superficial, protocolo e resposta.

---

### Application layer

Camada responsável por coordenar casos de uso.

---

### Domain layer

Camada responsável por regras, estados e invariantes do domínio.

---

### Infrastructure layer

Camada responsável por detalhes técnicos como banco, arquivos, filas e frameworks.

---

### Use case

Operação que representa uma intenção do usuário ou do sistema.

---

### DTO

Objeto usado para transportar dados entre fronteiras.

---

### Dependency direction

Direção em que uma camada conhece outra.

---

### Mapping

Conversão entre modelos de camadas diferentes.

---

### Leakage

Vazamento de detalhes de uma camada para outra.

---

### Architectural test

Teste que valida regras estruturais do projeto.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-611-arquitetura-em-camadas/layered-orders-api
```

Entre no diretório:

```powershell
Set-Location `
  labs/m19/aula-611-arquitetura-em-camadas/layered-orders-api
```

Confirme:

```powershell
Get-Location
```

---

### 2. Criar o projeto Spring Boot

Use:

- Java 21;
- Maven;
- Spring Web;
- Validation;
- Spring Boot Test.

O banco será em memória por implementação própria.

Isso evita misturar persistência real com o objetivo arquitetural.

---

### 3. Criar aplicação principal

Arquivo:

```java
@SpringBootApplication
public class LayeredOrdersApplication {

    public static void main(
            String[] args) {

        SpringApplication.run(
                LayeredOrdersApplication.class,
                args);
    }
}
```

A aplicação principal fica na raiz do package para permitir component scan.

---

### 4. Criar contrato arquitetural

Arquivo:

```text
contracts/layered-architecture-contract.yaml
```

Conteúdo:

```yaml
architecture:
  layers:
    - presentation
    - application
    - domain
    - infrastructure

  required:
    - explicit-responsibilities
    - dependency-rules
    - DTO-boundaries
    - use-cases
    - domain-invariants
    - repository-contract
    - error-mapping
    - tests

  forbidden:
    - controller-direct-repository
    - domain-depending-on-HTTP
    - repository-deciding-business-rule
    - infrastructure-exception-to-client

  nextLesson:
    code:
      M19.02
```

---

### 5. Criar responsabilidade das camadas

Arquivo:

```text
contracts/layer-responsibility-policy.yaml
```

Conteúdo:

```yaml
responsibilities:
  presentation:
    allowed:
      - HTTP
      - request-validation
      - DTO-mapping
      - response-status

  application:
    allowed:
      - use-case-orchestration
      - transaction-boundary
      - repository-calls
      - result-mapping

  domain:
    allowed:
      - business-rules
      - invariants
      - state-transitions

  infrastructure:
    allowed:
      - persistence
      - framework-configuration
      - technical-adapters
```

---

### 6. Criar direção de dependências

Nesta arquitetura didática, use:

```text
presentation
    depende de
application.

application
    depende de
domain.

infrastructure
    depende de
domain.

domain
    não depende
das outras camadas.
```

Representação:

```text
presentation
      |
      v
application
      |
      v
domain
      ^
      |
infrastructure
```

A infraestrutura implementa contratos definidos no domínio.

Essa decisão prepara a evolução futura, mas ainda não transforma a aula em Clean Architecture ou arquitetura hexagonal.

---

### 7. Criar policy de dependência

Arquivo:

```text
contracts/layer-dependency-policy.yaml
```

Conteúdo:

```yaml
dependencies:
  presentation:
    mayDependOn:
      - application

  application:
    mayDependOn:
      - domain

  infrastructure:
    mayDependOn:
      - domain

  domain:
    mayDependOn:
      - Java-standard-library

  forbidden:
    - presentation-to-infrastructure
    - domain-to-Spring
    - domain-to-HTTP
    - domain-to-persistence-framework
```

---

### 8. Criar `OrderId`

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

Esse objeto representa uma identidade do domínio.

Não é DTO HTTP.

---

### 9. Criar status

```java
public enum OrderStatus {
    CREATED,
    CONFIRMED,
    CANCELLED
}
```

---

### 10. Criar item

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

A validação essencial pertence ao domínio.

---

### 11. Criar `Order`

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
            List<OrderItem> items,
            Clock clock) {

        return new Order(
                OrderId.newId(),
                items,
                clock.instant());
    }

    public void confirm() {

        if (status != OrderStatus.CREATED) {
            throw new DomainException(
                    "Only created orders can be confirmed");
        }

        status = OrderStatus.CONFIRMED;
    }

    public void cancel() {

        if (status != OrderStatus.CREATED) {
            throw new DomainException(
                    "Only created orders can be cancelled");
        }

        status = OrderStatus.CANCELLED;
    }
}
```

O domínio controla transições.

O controller não decide se pode confirmar.

---

### 12. Criar repository contract

```java
public interface OrderRepository {

    Order save(
            Order order);

    Optional<Order> findById(
            OrderId id);
}
```

O domínio conhece a necessidade de persistir e consultar pedidos.

Ele não conhece PostgreSQL, JPA ou memória.

---

### 13. Criar command de aplicação

```java
public record CreateOrderCommand(
        List<CreateOrderItemCommand> items) {
}
```

Esse command representa a entrada do caso de uso.

Ele não precisa conhecer `HttpServletRequest`.

---

### 14. Criar result

```java
public record OrderResult(
        UUID id,
        String status,
        BigDecimal total,
        Instant createdAt) {
}
```

O result pertence à aplicação.

A apresentação poderá convertê-lo em response HTTP.

---

### 15. Criar use case de criação

```java
public final class CreateOrderUseCase {

    private final OrderRepository repository;
    private final Clock clock;

    public CreateOrderUseCase(
            OrderRepository repository,
            Clock clock) {

        this.repository = repository;
        this.clock = clock;
    }

    public OrderResult execute(
            CreateOrderCommand command) {

        List<OrderItem> items =
                command.items()
                        .stream()
                        .map(this::toDomain)
                        .toList();

        Order order =
                Order.create(
                        items,
                        clock);

        Order saved =
                repository.save(order);

        return OrderResultMapper.from(saved);
    }
}
```

O use case coordena.

A regra de transição permanece no domínio.

---

### 16. Criar use case de consulta

```java
public final class FindOrderUseCase {

    private final OrderRepository repository;

    public OrderResult execute(
            UUID id) {

        Order order =
                repository.findById(
                                new OrderId(id))
                        .orElseThrow(
                                () ->
                                        new OrderNotFoundException(id));

        return OrderResultMapper.from(order);
    }
}
```

---

### 17. Criar use case de confirmação

```java
public final class ConfirmOrderUseCase {

    private final OrderRepository repository;

    public OrderResult execute(
            UUID id) {

        Order order =
                findRequired(id);

        order.confirm();

        return OrderResultMapper.from(
                repository.save(order));
    }
}
```

O caso de uso coordena:

1. localizar;
2. executar regra;
3. persistir;
4. retornar resultado.

---

### 18. Criar use case de cancelamento

O fluxo será equivalente:

```text
localizar;

executar `cancel`;

persistir;

mapear resultado.
```

Não replique código desnecessariamente.

Mas não crie abstração genérica prematura apenas para eliminar quatro linhas.

---

### 19. Criar repository em memória

```java
public final class InMemoryOrderRepository
        implements OrderRepository {

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

A implementação está na infraestrutura.

O contrato está no domínio.

---

### 20. Criar configuração

```java
@Configuration
public class LayeredOrdersConfiguration {

    @Bean
    OrderRepository orderRepository() {
        return new InMemoryOrderRepository();
    }

    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    CreateOrderUseCase createOrderUseCase(
            OrderRepository repository,
            Clock clock) {

        return new CreateOrderUseCase(
                repository,
                clock);
    }
}
```

Os use cases não precisam conhecer Spring.

O framework monta os objetos.

---

### 21. Criar request HTTP

```java
public record CreateOrderRequest(
        @NotEmpty
        List<CreateOrderItemRequest> items) {
}
```

Validações de protocolo:

- campo obrigatório;
- JSON bem formado;
- lista presente;
- formato do valor.

Validações de negócio continuam no domínio.

---

### 22. Diferenciar validações

Presentation:

```text
campo ausente;

JSON inválido;

tipo inválido;

formato inválido.
```

Domain:

```text
quantidade positiva;

preço positivo;

pedido precisa de item;

estado permite transição.
```

Application:

```text
pedido precisa existir;

orquestração do caso de uso;

política de autorização,
quando aplicável.
```

---

### 23. Criar response

```java
public record OrderResponse(
        UUID id,
        String status,
        BigDecimal total,
        Instant createdAt) {

    public static OrderResponse from(
            OrderResult result) {

        return new OrderResponse(
                result.id(),
                result.status(),
                result.total(),
                result.createdAt());
    }
}
```

---

### 24. Criar controller

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final CreateOrderUseCase createOrder;
    private final FindOrderUseCase findOrder;
    private final ConfirmOrderUseCase confirmOrder;
    private final CancelOrderUseCase cancelOrder;

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @Valid
            @RequestBody
            CreateOrderRequest request) {

        CreateOrderCommand command =
                RequestMapper.toCommand(request);

        OrderResult result =
                createOrder.execute(command);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(OrderResponse.from(result));
    }
}
```

O controller:

- recebe HTTP;
- converte request;
- chama use case;
- converte result;
- define status.

Ele não implementa regra de negócio.

---

### 25. Criar endpoints restantes

```text
GET /api/orders/{id};

POST /api/orders/{id}/confirm;

POST /api/orders/{id}/cancel.
```

Todos chamam use cases.

Nenhum chama o repository diretamente.

---

### 26. Criar tratamento de erros

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(
            OrderNotFoundException.class)
    ResponseEntity<ApiErrorResponse> handleNotFound(
            OrderNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                        new ApiErrorResponse(
                                "ORDER_NOT_FOUND",
                                "Order was not found"));
    }

    @ExceptionHandler(
            DomainException.class)
    ResponseEntity<ApiErrorResponse> handleDomain(
            DomainException exception) {

        return ResponseEntity
                .unprocessableEntity()
                .body(
                        new ApiErrorResponse(
                                "DOMAIN_RULE_VIOLATION",
                                exception.getMessage()));
    }
}
```

Para produção, mensagens públicas podem ser ainda mais controladas.

Nesta aula, o objetivo é mostrar o mapeamento de fronteira.

---

### 27. Criar error mapping policy

Arquivo:

```text
contracts/error-mapping-policy.yaml
```

Conteúdo:

```yaml
errors:
  domain:
    mappedAt:
      presentation-boundary

  infrastructure:
    rawExceptionToClient:
      forbidden

  HTTP:
    status:
      controlled

  response:
    stableCode:
      required
```

---

### 28. Documentar request flow

Arquivo:

```text
docs/REQUEST_FLOW.md
```

Fluxo de criação:

```text
HTTP request;

CreateOrderRequest;

RequestMapper;

CreateOrderCommand;

CreateOrderUseCase;

Order;

OrderRepository;

InMemoryOrderRepository;

OrderResult;

OrderResponse;

HTTP response.
```

---

### 29. Entender o fluxo de dependência

Fluxo de execução:

```text
presentation
chama
application;

application
chama
domain;

application
usa
repository contract;

infrastructure
implementa
repository contract.
```

Fluxo de dependência de código não é exatamente igual ao fluxo de execução.

Essa distinção será aprofundada nas próximas aulas.

---

### 30. Criar teste de domínio

```java
@Test
void shouldConfirmCreatedOrder() {

    Clock clock =
            Clock.fixed(
                    Instant.parse(
                            "2026-07-14T12:00:00Z"),
                    ZoneOffset.UTC);

    Order order =
            Order.create(
                    List.of(validItem()),
                    clock);

    order.confirm();

    assertEquals(
            OrderStatus.CONFIRMED,
            order.status());
}
```

---

### 31. Testar transição inválida

```java
@Test
void shouldRejectCancelAfterConfirmation() {

    Order order =
            createdOrder();

    order.confirm();

    assertThrows(
            DomainException.class,
            order::cancel);
}
```

O teste do domínio não sobe Spring.

---

### 32. Criar teste de aplicação

Use repository fake ou em memória:

```java
@Test
void shouldCreateOrder() {

    OrderRepository repository =
            new InMemoryOrderRepository();

    Clock clock =
            Clock.fixed(
                    Instant.parse(
                            "2026-07-14T12:00:00Z"),
                    ZoneOffset.UTC);

    CreateOrderUseCase useCase =
            new CreateOrderUseCase(
                    repository,
                    clock);

    OrderResult result =
            useCase.execute(
                    validCommand());

    assertEquals(
            "CREATED",
            result.status());
}
```

---

### 33. Criar teste de apresentação

Use `MockMvc`.

Valide:

- status 201;
- JSON;
- validação;
- error mapping;
- controller sem lógica de negócio.

---

### 34. Criar teste de infraestrutura

Valide:

- save;
- find;
- overwrite controlado;
- concorrência básica;
- ausência de retorno para ID inexistente.

---

### 35. Adicionar ArchUnit

Dependência de teste:

```xml
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <scope>test</scope>
</dependency>
```

Use versão compatível com o projeto.

---

### 36. Criar teste de camadas

```java
@AnalyzeClasses(
        packages =
                "br.com.formacao.layeredorders")
class LayerDependencyTest {

    @ArchTest
    static final ArchRule domainMustNotDependOnSpring =
            noClasses()
                    .that()
                    .resideInAPackage(
                            "..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAnyPackage(
                            "org.springframework..");

    @ArchTest
    static final ArchRule presentationMustNotAccessInfrastructure =
            noClasses()
                    .that()
                    .resideInAPackage(
                            "..presentation..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage(
                            "..infrastructure..");
}
```

---

### 37. Criar teste de application

```java
@ArchTest
static final ArchRule applicationMustNotDependOnPresentation =
        noClasses()
                .that()
                .resideInAPackage(
                        "..application..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..presentation..");
```

---

### 38. Criar teste de repository

Valide que implementações ficam em infrastructure:

```text
interfaces:
domain.

implementações técnicas:
infrastructure.
```

---

### 39. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  classInWrongLayer:
    action:
      fail-architecture-test

  controllerWithBusinessRule:
    result:
      responsibility-leak

  domainWithFrameworkDependency:
    action:
      fail-gate

  DTOUsedAsDomainEntity:
    result:
      boundary-leak

  missingMapping:
    result:
      contract-confusion
```

---

### 40. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  presentationToInfrastructure:
    action:
      FAIL

  domainToSpring:
    action:
      FAIL

  rawInfrastructureException:
    action:
      FAIL

  directRepositoryFromController:
    action:
      FAIL

  CleanArchitectureContent:
    deferredToLesson612

  HexagonalContent:
    deferredToLesson613
```

---

### 41. Criar documentação de responsabilidades

Arquivo:

```text
docs/LAYER_RESPONSIBILITIES.md
```

Inclua exemplos de:

- o que pertence;
- o que não pertence;
- sintomas de vazamento;
- testes correspondentes;
- decisão de dependência.

---

### 42. Criar guia de troubleshooting

Arquivo:

```text
docs/TROUBLESHOOTING.md
```

Inclua:

- bean não encontrado;
- package fora do component scan;
- use case instanciado incorretamente;
- controller acessando repository;
- DTO vazando para domínio;
- ArchUnit falhando;
- exception não mapeada;
- teste do domínio subindo Spring;
- lógica duplicada entre controller e use case;
- abstração prematura;
- conteúdo da aula 612 antecipado.

---

### 43. Executar testes

Execute:

```powershell
.\scripts\m19\layered-orders-api\run-layered-orders-tests.ps1
```

Ou:

```powershell
mvn test
```

Confirme:

- domínio;
- aplicação;
- apresentação;
- infraestrutura;
- arquitetura.

---

### 44. Executar smoke

Execute:

```powershell
.\scripts\m19\layered-orders-api\run-layered-orders-smoke.ps1
```

Fluxo:

1. criar pedido;
2. consultar;
3. confirmar;
4. tentar cancelar;
5. validar erro de domínio;
6. consultar novamente.

---

### 45. Validar responsabilidades

Execute:

```powershell
.\scripts\m19\layered-orders-api\validate-layer-responsibilities.ps1
```

Procure:

- annotations Spring no domínio;
- imports HTTP na aplicação;
- repository em presentation;
- regra de transição no controller;
- DTO em domain;
- exception técnica na response.

---

### 46. Validar dependências

Execute:

```powershell
.\scripts\m19\layered-orders-api\validate-layer-dependencies.ps1
```

O script deve executar ArchUnit e inspeções adicionais.

---

### 47. Criar reports

Exemplo:

```yaml
layerBoundary:
  presentation:
    PASS

  application:
    PASS

  domain:
    PASS

  infrastructure:
    PASS

  result:
    PASS
```

---

### 48. Criar gate

O gate valida:

```text
build;

functional-flow;

presentation;

application;

domain;

infrastructure;

dependency-rules;

error-mapping;

tests;

documentation;

security;

evidence.
```

Status:

```text
PASS;

FAIL_BUILD;

FAIL_PRESENTATION;

FAIL_APPLICATION;

FAIL_DOMAIN;

FAIL_INFRASTRUCTURE;

FAIL_DEPENDENCY;

FAIL_ERROR_MAPPING;

FAIL_TEST;

FAIL_DOCUMENTATION;

INCONCLUSIVE.
```

---

### 49. Coletar evidence

Arquivo:

```text
contracts/layered-architecture-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- presentation status;
- application status;
- domain status;
- infrastructure status;
- dependency status;
- error mapping status;
- test status;
- smoke status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- secrets;
- payloads reais;
- IDs reais;
- conteúdo completo de Clean Architecture;
- conteúdo de arquitetura hexagonal.

---

### 50. Executar validação completa

Execute:

```powershell
.\scripts\m19\layered-orders-api\validate-layered-architecture-contract.ps1

.\scripts\m19\layered-orders-api\run-layered-orders-tests.ps1

.\scripts\m19\layered-orders-api\validate-layer-dependencies.ps1

.\scripts\m19\layered-orders-api\validate-layer-responsibilities.ps1

.\scripts\m19\layered-orders-api\run-layered-orders-smoke.ps1

.\scripts\m19\layered-orders-api\validate-layered-orders-errors.ps1

.\scripts\m19\layered-orders-api\collect-layered-architecture-evidence.ps1

.\scripts\m19\layered-orders-api\verify-layered-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 51. Encerrar o laboratório

Confirme:

- aplicação encerrada;
- nenhuma thread residual;
- nenhum recurso externo pendente;
- testes aprovados;
- architecture tests aprovados;
- reports sanitizados;
- nenhuma feature futura;
- Clean Architecture não antecipada;
- arquitetura hexagonal não antecipada.

---

## Entendendo o que foi feito

### A apresentação ganhou limite

HTTP deixou de controlar regras de negócio.

### A aplicação ganhou casos de uso

Coordenação deixou de ficar espalhada em services genéricos.

### O domínio ganhou autoridade

Invariantes e transições passaram a ser protegidas por objetos do domínio.

### A infraestrutura ganhou papel técnico

Persistência deixou de decidir comportamento funcional.

### Os DTOs ganharam fronteira

Requests e responses deixaram de ser usados como entidades.

### O repository ganhou contrato

A aplicação passou a depender de uma abstração do domínio.

### O Spring ganhou posição de montagem

O framework passou a conectar objetos sem dominar o núcleo.

### Os testes ganharam foco

Cada camada passou a ser validada de forma apropriada.

### A arquitetura ganhou teste

Regras deixaram de existir apenas em documentação.

### A próxima aula ganhou fronteira

Clean Architecture fica para a aula 612.

---

## Erros comuns importantes

### Criar pasta sem regra

A estrutura vira decoração.

### Controller acessar repository

A aplicação perde coordenação central.

### Service conhecer HTTP

O caso de uso fica acoplado ao protocolo.

### Domain importar Spring

O núcleo passa a depender do framework.

### Repository validar regra de negócio

Persistência assume responsabilidade indevida.

### Usar entity como response

Detalhes internos vazam para a API.

### Criar interface para tudo

Abstração sem necessidade aumenta complexidade.

### Criar service genérico

Responsabilidades ficam vagas.

### Ignorar testes de arquitetura

As regras se degradam com o tempo.

### Antecipar Clean Architecture

A aula perde o foco na base em camadas.

---

## Comandos úteis

### Executar testes

```powershell
.\scripts\m19\layered-orders-api\run-layered-orders-tests.ps1
```

### Validar dependências

```powershell
.\scripts\m19\layered-orders-api\validate-layer-dependencies.ps1
```

### Validar responsabilidades

```powershell
.\scripts\m19\layered-orders-api\validate-layer-responsibilities.ps1
```

### Executar smoke

```powershell
.\scripts\m19\layered-orders-api\run-layered-orders-smoke.ps1
```

### Verificar gate

```powershell
.\scripts\m19\layered-orders-api\verify-layered-architecture-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Estrutura

Crie os packages das quatro camadas.

### Parte 2 — Domínio

Implemente pedido, item, status e invariantes.

### Parte 3 — Repository contract

Defina contrato sem tecnologia.

### Parte 4 — Application

Crie use cases explícitos.

### Parte 5 — Infrastructure

Implemente repository em memória.

### Parte 6 — Presentation

Crie requests, responses e controller.

### Parte 7 — Error mapping

Mapeie exceptions na fronteira HTTP.

### Parte 8 — Tests

Teste domínio, aplicação, apresentação e infraestrutura.

### Parte 9 — Architecture tests

Proteja as dependências.

### Parte 10 — Gate

Valide fluxo, responsabilidades e documentação.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- a aula abre corretamente o Módulo 19;
- continuidade com o fechamento do M18 foi preservada;
- ponte para a aula 612 foi preservada;
- o laboratório possui presentation, application, domain e infrastructure;
- responsabilidades de cada camada foram documentadas;
- o domínio não depende de Spring, HTTP ou persistência;
- presentation depende de application;
- application depende de domain;
- infrastructure implementa contrato do domínio;
- controller não acessa repository diretamente;
- controller não implementa regra de negócio;
- application coordena casos de uso;
- domínio protege invariantes e transições;
- DTOs de request e response permanecem na apresentação;
- commands e results permanecem na aplicação;
- repository interface permanece no domínio;
- repository em memória permanece na infraestrutura;
- exceptions técnicas não vazam para o cliente;
- error mapping ocorre na fronteira;
- `Clock` é injetável;
- testes de domínio não sobem Spring;
- testes de aplicação usam dependências controladas;
- testes de apresentação validam HTTP;
- testes de infraestrutura validam persistência;
- ArchUnit protege dependências;
- documentação de arquitetura, responsabilidades, fluxo e testes foi criada;
- reports, gate e evidence foram criados;
- nenhum dado sensível foi incluído;
- Clean Architecture, arquitetura hexagonal e DDD não foram antecipados;
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
  labs/m19/aula-611-arquitetura-em-camadas/layered-orders-api `
  scripts/m19/layered-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReferenceReal|cleanArchitectureCircle|inputPort|outputPort|drivingAdapter|drivenAdapter|boundedContext"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar arquitetura em camadas"
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
- banco externo;
- implementação de Clean Architecture;
- arquitetura hexagonal;
- DDD;
- sistemas distribuídos.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou o Módulo 19 com arquitetura em camadas.

Você criou:

```text
presentation;

application;

domain;

infrastructure;

DTOs;

commands;

results;

use cases;

repository contract;

repository em memória;

error mapping;

testes por camada;

architecture tests;

gate.
```

Você comprovou que pastas não bastam; que camada precisa de responsabilidade; que controller não deve coordenar persistência diretamente; que aplicação representa casos de uso; que domínio protege regras; que infraestrutura implementa detalhes; que DTOs evitam vazamentos; que frameworks podem montar o sistema sem dominar o núcleo; e que regras arquiteturais podem ser testadas.

A próxima aula será:

```text
612 - M19.02 - Clean Architecture
```

Nela, você irá aprofundar o controle de dependências e organizar o sistema em torno de regras de negócio e casos de uso, estudando como detalhes externos devem depender de políticas internas.

Nenhum círculo completo de Clean Architecture, regra de dependência avançada ou arquitetura hexagonal foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei as quatro camadas.
- [ ] Defini responsabilidades.
- [ ] Mantive domínio sem framework.
- [ ] Criei use cases explícitos.
- [ ] Separei DTOs e modelos.
- [ ] Implementei repository técnico.
- [ ] Criei testes por camada.
- [ ] Protegi dependências com ArchUnit.

---

## Troubleshooting adicional

### Spring não encontra use case

Revise a classe de configuração e os packages.

### Controller precisa do repository

Crie ou use o caso de uso correspondente.

### Domain precisa de annotation JPA

Nesta aula, mantenha o domínio independente e use implementação técnica separada.

### DTO possui método de negócio

Mova a regra para o domínio.

### Use case recebe `HttpServletRequest`

Converta dados necessários na apresentação.

### Repository lança exception técnica

Converta na infrastructure ou application conforme o contrato.

### ArchUnit falha após novo import

Verifique se a camada passou a conhecer uma responsabilidade indevida.

### Teste do domínio está lento

Ele não deve subir contexto Spring.

### Existem interfaces para classes sem variação

Remova abstrações prematuras.

### A estrutura começou a usar ports e adapters completos

Preserve essa evolução para as aulas 612 e 613.

---

## Perguntas de revisão

1. O que é arquitetura de software?
2. O que é uma camada?
3. Qual função da presentation layer?
4. Qual função da application layer?
5. Qual função da domain layer?
6. Qual função da infrastructure layer?
7. O que é um use case?
8. Por que controller não deve acessar repository?
9. Por que domínio não deve conhecer HTTP?
10. Qual diferença entre request DTO e entidade de domínio?
11. Onde ficam regras de transição?
12. Onde fica error mapping HTTP?
13. Onde fica repository interface?
14. Onde fica repository implementation?
15. Para que serve `Clock` injetável?
16. O que é boundary leakage?
17. Para que serve ArchUnit?
18. Por que evitar abstração prematura?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Decisões sobre componentes, responsabilidades e dependências.
2. Agrupamento de responsabilidades relacionadas.
3. Protocolo, validação superficial e resposta.
4. Coordenação de casos de uso.
5. Regras, estados e invariantes.
6. Banco, frameworks e detalhes técnicos.
7. Intenção do usuário ou sistema.
8. Evitar acoplamento e coordenação espalhada.
9. Preservar independência do protocolo.
10. Transporte versus comportamento do negócio.
11. No domínio.
12. Na fronteira de apresentação.
13. No domínio, neste laboratório.
14. Na infraestrutura.
15. Tornar tempo determinístico e testável.
16. Detalhe de uma camada vazando para outra.
17. Proteger regras arquiteturais.
18. Evitar complexidade sem necessidade real.
19. Clean Architecture.
20. Clean Architecture.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 611 - M19.01 - Arquitetura em camadas

- Iniciei o Módulo 19.
- Criei o laboratório `layered-orders-api`.
- Organizei a aplicação em presentation, application, domain e infrastructure.
- Documentei responsabilidades e dependências.
- Mantive o domínio sem Spring, HTTP ou persistência.
- Modelei `Order`, `OrderItem`, `OrderId` e `OrderStatus`.
- Protegi invariantes e transições no domínio.
- Criei repository contract no domínio.
- Implementei repository em memória na infraestrutura.
- Criei use cases explícitos na aplicação.
- Separei request, command, result e response.
- Mantive controller focado em HTTP.
- Centralizei error mapping na apresentação.
- Criei testes de domínio, aplicação, apresentação e infraestrutura.
- Usei ArchUnit para proteger dependências.
- Criei reports, gate e evidence.
- Não antecipei Clean Architecture, arquitetura hexagonal ou DDD.
- Próxima aula: Clean Architecture.
```

---

## Referência técnica curta

- Layered architecture.
- Separation of concerns.
- Dependency direction.
- Application use cases.
- Domain invariants.
- DTO boundaries.
- Repository abstraction.
- Spring configuration.
- ArchUnit.
- Architecture tests.

Regra final:

```text
a arquitetura em camadas precisa separar responsabilidades e controlar dependências, não apenas criar pastas: presentation recebe HTTP, valida protocolo, converte DTOs e mapeia respostas, application coordena casos de uso por commands e results, domain protege identidades, estados, invariantes e transições sem depender de Spring, HTTP ou persistência, e infrastructure implementa detalhes técnicos como repository; controllers não acessam banco diretamente, repositories não decidem regras de negócio, DTOs não substituem entidades, exceptions técnicas não vazam para clientes e o framework apenas monta dependências; testes de domínio são rápidos e isolados, testes de aplicação controlam colaboradores, testes de apresentação validam contratos HTTP, testes de infraestrutura validam detalhes e ArchUnit bloqueia imports proibidos; o gate termina com responsabilidades, fluxo, error mapping e documentação aprovados, enquanto Clean Architecture começa somente na aula 612 e arquitetura hexagonal permanece reservada à aula 613.
```
