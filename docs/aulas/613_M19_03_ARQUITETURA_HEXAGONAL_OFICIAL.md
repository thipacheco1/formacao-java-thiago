# 613 - M19.03 - Arquitetura Hexagonal

## Apresentação da aula

Na aula 612, você evoluiu da arquitetura em camadas para Clean Architecture.

Você passou a organizar a aplicação em torno de:

```text
entities;

use cases;

input boundaries;

output boundaries;

gateways;

presenters;

adapters;

framework composition.
```

A principal regra aprendida foi:

```text
dependências de código
devem apontar
para políticas internas.
```

Agora você irá observar a aplicação por outro ângulo.

A Arquitetura Hexagonal propõe imaginar o sistema como um núcleo cercado por mecanismos externos.

No centro ficam:

- regras de negócio;
- casos de uso;
- decisões da aplicação.

Ao redor ficam:

- HTTP;
- banco;
- mensageria;
- terminal;
- testes;
- scheduler;
- arquivos;
- serviços externos;
- frameworks.

A aplicação não deve nascer acoplada a esses mecanismos.

Ela deve oferecer pontos de entrada e saída que permitam a conexão de diferentes tecnologias.

A pergunta central desta aula será:

```text
como permitir que
a mesma aplicação

seja acionada
por diferentes entradas

e se comunique
com diferentes saídas

sem alterar
o núcleo do negócio?
```

Exemplo de entradas possíveis:

```text
REST controller;

comando de terminal;

job agendado;

consumer de mensagem;

teste automatizado.
```

Exemplo de saídas possíveis:

```text
PostgreSQL;

repositório em memória;

API de pagamento;

publisher Kafka;

arquivo;

serviço de e-mail.
```

A arquitetura hexagonal ajuda a impedir que a aplicação seja definida por uma única tecnologia.

Em um projeto mal acoplado, o caso de uso pode depender diretamente de:

```text
Spring MVC;

JpaRepository;

KafkaTemplate;

RestClient;

ObjectMapper;

ResponseEntity.
```

Nesse cenário, trocar o mecanismo externo exige alterar as regras centrais.

Em um projeto organizado por fronteiras, o núcleo depende apenas de contratos próprios.

Exemplo:

```text
CreateOrderUseCase;

LoadOrderPort;

SaveOrderPort;

NotifyOrderPort.
```

Os mecanismos externos implementam esses contratos.

Nesta aula, você criará um novo laboratório:

```text
labs/m19/aula-613-arquitetura-hexagonal/hexagonal-orders-api
```

O sistema terá um núcleo responsável por pedidos.

Ele poderá ser acionado por:

- REST;
- command runner de laboratório;
- teste direto.

Ele poderá persistir por:

- adapter em memória;
- adapter JDBC sintético opcional de laboratório.

Ele poderá notificar por:

- adapter de console;
- adapter de captura usado em testes.

O foco será entender a visão hexagonal:

```text
núcleo;

lado de entrada;

lado de saída;

adapters externos;

composição.
```

Nesta aula, você não irá ainda construir um catálogo completo e formal de Ports and Adapters.

A próxima aula oficial será:

```text
614 - M19.04 - Ports and Adapters
```

Nela, você irá aprofundar:

- classificação de ports;
- input ports;
- output ports;
- driving adapters;
- driven adapters;
- múltiplas implementações;
- contratos;
- testes de adapter;
- composição mais detalhada.

Portanto, a aula 613 irá apresentar e implementar a arquitetura hexagonal como visão estrutural, sem transformar o conteúdo em uma taxonomia completa de ports e adapters.

Também não será iniciado:

```text
monolito modular;
```

Esse tema pertence à aula 615.

A regra central desta aula será:

```text
o núcleo da aplicação
não deve conhecer

quem o aciona
nem como seus efeitos
são executados.
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

615:
Monolito modular.
```

A progressão é:

```text
separar responsabilidades;

inverter dependências;

visualizar entradas e saídas;

formalizar ports e adapters;

organizar módulos.
```

Nesta aula:

```text
núcleo da aplicação:
sim.

entradas externas:
sim.

saídas externas:
sim.

adapter REST:
sim.

adapter de linha de comando:
sim.

adapter de persistência em memória:
sim.

adapter de notificação:
sim.

composição:
sim.

testes sem framework:
sim.

testes de arquitetura:
sim.

taxonomia completa de ports:
não.

monólito modular:
não.

DDD:
não.
```

O laboratório continuará usando Java 21 e Spring Boot.

Mas o Spring permanecerá na borda.

---

## Objetivo prático

A estrutura será:

```text
labs/m19/aula-613-arquitetura-hexagonal/hexagonal-orders-api
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/hexagonalorders
│   │   │       ├── HexagonalOrdersApplication.java
│   │   │       ├── core
│   │   │       │   ├── domain
│   │   │       │   │   ├── Order.java
│   │   │       │   │   ├── OrderId.java
│   │   │       │   │   ├── OrderItem.java
│   │   │       │   │   ├── OrderStatus.java
│   │   │       │   │   └── DomainException.java
│   │   │       │   ├── application
│   │   │       │   │   ├── CreateOrderService.java
│   │   │       │   │   ├── FindOrderService.java
│   │   │       │   │   ├── ConfirmOrderService.java
│   │   │       │   │   ├── CancelOrderService.java
│   │   │       │   │   ├── command
│   │   │       │   │   │   └── CreateOrderCommand.java
│   │   │       │   │   └── result
│   │   │       │   │       └── OrderResult.java
│   │   │       │   └── boundary
│   │   │       │       ├── in
│   │   │       │       │   ├── CreateOrderUseCase.java
│   │   │       │       │   ├── FindOrderUseCase.java
│   │   │       │       │   ├── ConfirmOrderUseCase.java
│   │   │       │       │   └── CancelOrderUseCase.java
│   │   │       │       └── out
│   │   │       │           ├── LoadOrderBoundary.java
│   │   │       │           ├── SaveOrderBoundary.java
│   │   │       │           ├── GenerateOrderIdBoundary.java
│   │   │       │           ├── CurrentTimeBoundary.java
│   │   │       │           └── NotifyOrderBoundary.java
│   │   │       ├── adapter
│   │   │       │   ├── in
│   │   │       │   │   ├── web
│   │   │       │   │   │   ├── OrderController.java
│   │   │       │   │   │   ├── request
│   │   │       │   │   │   ├── response
│   │   │       │   │   │   └── ApiExceptionHandler.java
│   │   │       │   │   └── cli
│   │   │       │   │       └── OrderCommandRunner.java
│   │   │       │   └── out
│   │   │       │       ├── persistence
│   │   │       │       │   └── InMemoryOrderAdapter.java
│   │   │       │       ├── notification
│   │   │       │       │   └── ConsoleOrderNotificationAdapter.java
│   │   │       │       ├── identity
│   │   │       │       │   └── UUIDOrderIdAdapter.java
│   │   │       │       └── time
│   │   │       │           └── SystemClockAdapter.java
│   │   │       └── configuration
│   │   │           └── HexagonalOrdersConfiguration.java
│   │   └── resources
│   │       └── application.yml
│   └── test
│       └── java
│           └── br/com/formacao/hexagonalorders
│               ├── architecture
│               │   └── HexagonalArchitectureTest.java
│               ├── core
│               │   ├── OrderTest.java
│               │   ├── CreateOrderServiceTest.java
│               │   └── ConfirmOrderServiceTest.java
│               ├── adapter
│               │   ├── OrderControllerTest.java
│               │   ├── OrderCommandRunnerTest.java
│               │   ├── InMemoryOrderAdapterTest.java
│               │   └── ConsoleOrderNotificationAdapterTest.java
│               └── configuration
│                   └── HexagonalOrdersContextTest.java
├── contracts
│   ├── hexagonal-architecture-contract.yaml
│   ├── core-policy.yaml
│   ├── input-side-policy.yaml
│   ├── output-side-policy.yaml
│   ├── adapter-policy.yaml
│   ├── composition-policy.yaml
│   ├── error-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── docs
│   ├── HEXAGONAL_ARCHITECTURE_OVERVIEW.md
│   ├── CORE_AND_EDGES.md
│   ├── INPUT_SIDE.md
│   ├── OUTPUT_SIDE.md
│   ├── REQUEST_FLOW.md
│   ├── TEST_STRATEGY.md
│   └── TROUBLESHOOTING.md
└── reports
    ├── core-report.yaml
    ├── input-side-report.yaml
    ├── output-side-report.yaml
    ├── adapter-report.yaml
    ├── composition-report.yaml
    └── hexagonal-architecture-gate-report.yaml
```

Scripts:

```text
scripts/m19/hexagonal-orders-api
├── validate-hexagonal-architecture-contract.ps1
├── run-hexagonal-orders-tests.ps1
├── validate-hexagonal-core.ps1
├── validate-hexagonal-input-side.ps1
├── validate-hexagonal-output-side.ps1
├── validate-hexagonal-adapters.ps1
├── run-hexagonal-orders-smoke.ps1
├── collect-hexagonal-architecture-evidence.ps1
└── verify-hexagonal-architecture-gate.ps1
```

Ao final, você terá um núcleo acionável por mais de uma entrada e conectado a mais de uma saída sem depender delas.

---

## Conceito essencial

### Arquitetura Hexagonal

Modelo arquitetural que coloca a aplicação no centro e detalhes externos nas bordas.

---

### Núcleo

Conjunto de regras de domínio e serviços de aplicação.

---

### Lado de entrada

Região pela qual agentes externos acionam a aplicação.

---

### Lado de saída

Região pela qual a aplicação solicita efeitos externos.

---

### Boundary de entrada

Contrato oferecido pelo núcleo para receber intenções.

---

### Boundary de saída

Contrato exigido pelo núcleo para acessar capacidades externas.

---

### Adapter de entrada

Componente que converte um mecanismo externo em chamada ao núcleo.

---

### Adapter de saída

Componente que converte uma solicitação do núcleo em efeito técnico.

---

### Driving mechanism

Mecanismo que inicia uma interação com a aplicação.

---

### Driven mechanism

Mecanismo acionado pela aplicação.

---

### Composição

Momento em que implementações concretas são conectadas aos contratos.

---

### Substituibilidade

Capacidade de trocar um detalhe externo sem alterar as políticas centrais.

---

### Testabilidade

Capacidade de validar o núcleo com dependências controladas.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-613-arquitetura-hexagonal/hexagonal-orders-api
```

Entre:

```powershell
Set-Location `
  labs/m19/aula-613-arquitetura-hexagonal/hexagonal-orders-api
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

O adapter CLI usará `ApplicationRunner`.

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/hexagonal-architecture-contract.yaml
```

Conteúdo:

```yaml
hexagonalArchitecture:
  required:
    - core
    - input-side
    - output-side
    - input-adapters
    - output-adapters
    - composition
    - tests
    - architecture-rules

  coreMustNotDependOn:
    - Spring
    - HTTP
    - persistence-implementation
    - console
    - UUID-random-generator
    - system-clock

  nextLesson:
    code:
      M19.04
```

---

### 4. Criar visão do hexágono

Representação didática:

```text
           REST
             |
             v
CLI ---> [ NÚCLEO ] ---> Persistência
             |
             +----------> Notificação
             |
             +----------> Relógio
             |
             +----------> Gerador de ID
```

O hexágono não representa seis componentes obrigatórios.

A forma simboliza múltiplos pontos de conexão.

---

### 5. Criar core policy

Arquivo:

```text
contracts/core-policy.yaml
```

Conteúdo:

```yaml
core:
  contains:
    - domain
    - application
    - boundaries

  owns:
    - business-rules
    - use-case-orchestration
    - required-external-capabilities

  forbidden:
    - framework-annotation
    - HTTP-type
    - persistence-driver
    - console-output
    - technical-exception
```

---

### 6. Criar domínio

Use os objetos:

```text
Order;

OrderId;

OrderItem;

OrderStatus;

DomainException.
```

O domínio seguirá independente.

Exemplo:

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
        requireCreated();
        status = OrderStatus.CONFIRMED;
    }

    public void cancel() {
        requireCreated();
        status = OrderStatus.CANCELLED;
    }

    private void requireCreated() {
        if (status != OrderStatus.CREATED) {
            throw new DomainException(
                    "Order must be created");
        }
    }
}
```

---

### 7. Criar entrada de criação

```java
public interface CreateOrderUseCase {

    OrderResult execute(
            CreateOrderCommand command);
}
```

O contrato pertence ao núcleo.

REST, CLI e testes poderão chamá-lo.

---

### 8. Criar outras entradas

```java
public interface FindOrderUseCase {

    OrderResult execute(
            UUID orderId);
}
```

```java
public interface ConfirmOrderUseCase {

    OrderResult execute(
            UUID orderId);
}
```

```java
public interface CancelOrderUseCase {

    OrderResult execute(
            UUID orderId);
}
```

Nesta aula, esses contratos serão chamados de boundaries de entrada.

A formalização completa como input ports será aprofundada na aula 614.

---

### 9. Criar saída de carga

```java
public interface LoadOrderBoundary {

    Optional<Order> load(
            OrderId orderId);
}
```

---

### 10. Criar saída de salvamento

```java
public interface SaveOrderBoundary {

    Order save(
            Order order);
}
```

Separar leitura e escrita torna as necessidades explícitas.

Mas não é obrigatório em todo projeto.

Use a separação porque o laboratório deseja tornar as capacidades visíveis.

---

### 11. Criar saída de identidade

```java
public interface GenerateOrderIdBoundary {

    OrderId next();
}
```

O núcleo não chama `UUID.randomUUID()` diretamente.

---

### 12. Criar saída de tempo

```java
public interface CurrentTimeBoundary {

    Instant now();
}
```

O núcleo não chama `Instant.now()` diretamente.

---

### 13. Criar saída de notificação

```java
public interface NotifyOrderBoundary {

    void orderConfirmed(
            Order order);

    void orderCancelled(
            Order order);
}
```

O núcleo declara o efeito necessário.

Ele não conhece console, Kafka ou e-mail.

---

### 14. Criar application service

```java
public final class CreateOrderService
        implements CreateOrderUseCase {

    private final SaveOrderBoundary saveOrder;
    private final GenerateOrderIdBoundary generateId;
    private final CurrentTimeBoundary currentTime;

    public CreateOrderService(
            SaveOrderBoundary saveOrder,
            GenerateOrderIdBoundary generateId,
            CurrentTimeBoundary currentTime) {

        this.saveOrder = saveOrder;
        this.generateId = generateId;
        this.currentTime = currentTime;
    }

    @Override
    public OrderResult execute(
            CreateOrderCommand command) {

        List<OrderItem> items =
                command.items()
                        .stream()
                        .map(OrderCommandMapper::toDomain)
                        .toList();

        Order order =
                Order.create(
                        generateId.next(),
                        items,
                        currentTime.now());

        return OrderResultMapper.from(
                saveOrder.save(order));
    }
}
```

---

### 15. Criar serviço de consulta

```java
public final class FindOrderService
        implements FindOrderUseCase {

    private final LoadOrderBoundary loadOrder;

    @Override
    public OrderResult execute(
            UUID orderId) {

        Order order =
                loadOrder.load(
                                new OrderId(orderId))
                        .orElseThrow(
                                () ->
                                        new OrderNotFoundException(
                                                orderId));

        return OrderResultMapper.from(order);
    }
}
```

---

### 16. Criar serviço de confirmação

```java
public final class ConfirmOrderService
        implements ConfirmOrderUseCase {

    private final LoadOrderBoundary loadOrder;
    private final SaveOrderBoundary saveOrder;
    private final NotifyOrderBoundary notifyOrder;

    @Override
    public OrderResult execute(
            UUID orderId) {

        Order order =
                loadRequired(orderId);

        order.confirm();

        Order saved =
                saveOrder.save(order);

        notifyOrder.orderConfirmed(saved);

        return OrderResultMapper.from(saved);
    }
}
```

O serviço coordena:

- carga;
- regra;
- persistência;
- notificação;
- resultado.

---

### 17. Criar input-side policy

Arquivo:

```text
contracts/input-side-policy.yaml
```

Conteúdo:

```yaml
inputSide:
  adapters:
    allowed:
      - REST
      - CLI
      - automated-test

  adapterResponsibilities:
    - parse-external-input
    - validate-format
    - convert-to-command
    - call-core
    - convert-result

  forbidden:
    - domain-rule
    - persistence-access
    - output-adapter-call
```

---

### 18. Criar adapter REST

```java
@RestController
@RequestMapping("/api/orders")
public final class OrderController {

    private final CreateOrderUseCase createOrder;
    private final FindOrderUseCase findOrder;
    private final ConfirmOrderUseCase confirmOrder;
    private final CancelOrderUseCase cancelOrder;

    @PostMapping
    ResponseEntity<OrderResponse> create(
            @Valid
            @RequestBody
            CreateOrderRequest request) {

        OrderResult result =
                createOrder.execute(
                        OrderWebMapper.toCommand(
                                request));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        OrderWebMapper.toResponse(
                                result));
    }
}
```

O adapter REST traduz protocolo.

---

### 19. Criar adapter CLI

```java
public final class OrderCommandRunner
        implements ApplicationRunner {

    private final CreateOrderUseCase createOrder;

    @Override
    public void run(
            ApplicationArguments args) {

        if (!args.containsOption(
                "create-sample-order")) {
            return;
        }

        OrderResult result =
                createOrder.execute(
                        SampleOrderFactory.command());

        System.out.println(
                "Created order: "
                        + result.id());
    }
}
```

O mesmo caso de uso é acionado sem HTTP.

Isso demonstra a independência do mecanismo de entrada.

---

### 20. Evitar regra no CLI

O CLI não deve:

- validar status do domínio;
- acessar persistência;
- confirmar pedido diretamente;
- decidir política de notificação.

Ele converte argumentos e chama o núcleo.

---

### 21. Criar output-side policy

Arquivo:

```text
contracts/output-side-policy.yaml
```

Conteúdo:

```yaml
outputSide:
  coreDefines:
    - load-capability
    - save-capability
    - identity-capability
    - time-capability
    - notification-capability

  adaptersImplement:
    required

  adapterResponsibilities:
    - technical-integration
    - technical-mapping
    - exception-conversion
    - resource-management

  forbidden:
    - business-rule
    - use-case-orchestration
```

---

### 22. Criar adapter em memória

```java
public final class InMemoryOrderAdapter
        implements LoadOrderBoundary,
                   SaveOrderBoundary {

    private final Map<OrderId, Order>
            storage =
            new ConcurrentHashMap<>();

    @Override
    public Optional<Order> load(
            OrderId orderId) {

        return Optional.ofNullable(
                storage.get(orderId));
    }

    @Override
    public Order save(
            Order order) {

        storage.put(
                order.id(),
                order);

        return order;
    }
}
```

Um adapter pode implementar mais de uma capacidade.

A decisão deve permanecer clara e coesa.

---

### 23. Criar adapter de ID

```java
public final class UUIDOrderIdAdapter
        implements GenerateOrderIdBoundary {

    @Override
    public OrderId next() {
        return new OrderId(
                UUID.randomUUID());
    }
}
```

---

### 24. Criar adapter de tempo

```java
public final class SystemClockAdapter
        implements CurrentTimeBoundary {

    private final Clock clock;

    public SystemClockAdapter(
            Clock clock) {

        this.clock = clock;
    }

    @Override
    public Instant now() {
        return clock.instant();
    }
}
```

---

### 25. Criar adapter de notificação

```java
public final class ConsoleOrderNotificationAdapter
        implements NotifyOrderBoundary {

    @Override
    public void orderConfirmed(
            Order order) {

        System.out.println(
                "Order confirmed: "
                        + order.id().value());
    }

    @Override
    public void orderCancelled(
            Order order) {

        System.out.println(
                "Order cancelled: "
                        + order.id().value());
    }
}
```

O console é apenas um detalhe.

Na aula 614, você aprofundará a troca por outras implementações.

---

### 26. Criar adapter policy

Arquivo:

```text
contracts/adapter-policy.yaml
```

Conteúdo:

```yaml
adapters:
  input:
    convertExternalIntent:
      required

  output:
    implementCoreCapability:
      required

  both:
    businessRule:
      forbidden

    directAdapterToAdapterCall:
      forbiddenByDefault

    technicalException:
      mustBeConverted:
        true
```

---

### 27. Entender por que adapters não se chamam

Fluxo ruim:

```text
REST controller
chama
repository adapter.
```

Fluxo correto:

```text
REST controller
chama
use case;

use case
chama
boundary de saída;

adapter de saída
implementa boundary.
```

O núcleo coordena a interação.

---

### 28. Criar composição

```java
@Configuration
public class HexagonalOrdersConfiguration {

    @Bean
    InMemoryOrderAdapter inMemoryOrderAdapter() {
        return new InMemoryOrderAdapter();
    }

    @Bean
    GenerateOrderIdBoundary generateOrderId() {
        return new UUIDOrderIdAdapter();
    }

    @Bean
    CurrentTimeBoundary currentTime() {
        return new SystemClockAdapter(
                Clock.systemUTC());
    }

    @Bean
    NotifyOrderBoundary notifyOrder() {
        return new ConsoleOrderNotificationAdapter();
    }

    @Bean
    CreateOrderUseCase createOrder(
            SaveOrderBoundary saveOrder,
            GenerateOrderIdBoundary generateId,
            CurrentTimeBoundary currentTime) {

        return new CreateOrderService(
                saveOrder,
                generateId,
                currentTime);
    }
}
```

---

### 29. Criar composition policy

Arquivo:

```text
contracts/composition-policy.yaml
```

Conteúdo:

```yaml
composition:
  owns:
    - adapter-selection
    - object-construction
    - environment-choice
    - framework-wiring

  coreAnnotation:
    forbidden

  runtimeSwap:
    supported:
      required
```

---

### 30. Demonstrar troca de entrada

Teste o caso de uso de três formas:

```text
chamada direta no teste;

REST controller;

CLI runner.
```

O `CreateOrderService` permanece igual.

---

### 31. Demonstrar troca de saída

No teste, use:

```java
public final class FixedOrderIdAdapter
        implements GenerateOrderIdBoundary {

    @Override
    public OrderId next() {
        return new OrderId(
                UUID.fromString(
                        "00000000-0000-0000-0000-000000000001"));
    }
}
```

E:

```java
public final class FixedTimeAdapter
        implements CurrentTimeBoundary {

    @Override
    public Instant now() {
        return Instant.parse(
                "2026-07-14T12:00:00Z");
    }
}
```

O núcleo permanece determinístico.

---

### 32. Criar capturing notification

```java
public final class CapturingOrderNotificationAdapter
        implements NotifyOrderBoundary {

    private final List<OrderId>
            confirmed =
            new ArrayList<>();

    @Override
    public void orderConfirmed(
            Order order) {

        confirmed.add(order.id());
    }

    @Override
    public void orderCancelled(
            Order order) {
    }

    public List<OrderId> confirmed() {
        return List.copyOf(confirmed);
    }
}
```

---

### 33. Testar núcleo sem Spring

```java
@Test
void shouldConfirmAndNotifyOrder() {

    InMemoryOrderAdapter storage =
            new InMemoryOrderAdapter();

    Order order =
            storage.save(
                    TestOrderFactory.created());

    CapturingOrderNotificationAdapter notifications =
            new CapturingOrderNotificationAdapter();

    ConfirmOrderService service =
            new ConfirmOrderService(
                    storage,
                    storage,
                    notifications);

    OrderResult result =
            service.execute(
                    order.id().value());

    assertEquals(
            "CONFIRMED",
            result.status());

    assertEquals(
            List.of(order.id()),
            notifications.confirmed());
}
```

---

### 34. Testar REST adapter

Use `MockMvc`.

Valide:

- request;
- mapping;
- chamada ao use case;
- response;
- status;
- erro.

O teste pode mockar o boundary de entrada.

---

### 35. Testar CLI adapter

Valide:

- argumento ausente;
- argumento presente;
- command criado;
- use case chamado;
- output controlado;
- erro sem vazar exception técnica.

---

### 36. Testar output adapter

Valide:

- save;
- load;
- notificações;
- ID;
- tempo;
- concorrência básica;
- ausência de regra de domínio.

---

### 37. Criar architecture tests

Regra do core:

```java
@ArchTest
static final ArchRule coreMustNotDependOnAdapters =
        noClasses()
                .that()
                .resideInAPackage(
                        "..core..")
                .should()
                .dependOnClassesThat()
                .resideInAnyPackage(
                        "..adapter..",
                        "..configuration..",
                        "org.springframework..");
```

---

### 38. Regra de entrada

```java
@ArchTest
static final ArchRule inputAdaptersMustNotAccessOutputAdapters =
        noClasses()
                .that()
                .resideInAPackage(
                        "..adapter.in..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..adapter.out..");
```

---

### 39. Regra de saída

Adapters de saída não dependem de adapters de entrada.

Eles implementam boundaries do núcleo.

---

### 40. Criar error policy

Arquivo:

```text
contracts/error-policy.yaml
```

Conteúdo:

```yaml
errors:
  core:
    throws:
      - domain-exception
      - application-exception

  inputAdapter:
    mapsToExternalProtocol:
      required

  outputAdapter:
    convertsTechnicalException:
      required

  rawTechnicalExceptionIntoCore:
    forbidden
```

---

### 41. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  coreImportingAdapter:
    action:
      FAIL

  controllerAccessingStorageAdapter:
    action:
      FAIL

  CLIWithBusinessRule:
    result:
      boundary-leak

  outputAdapterCallingUseCase:
    result:
      direction-confusion

  systemTimeInsideCore:
    action:
      FAIL

  randomUUIDInsideCore:
    action:
      FAIL
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
  coreToFramework:
    action:
      FAIL

  inputToOutputAdapter:
    action:
      FAIL

  rawTechnicalException:
    action:
      FAIL

  directDatabaseFromController:
    action:
      FAIL

  PortsAndAdaptersTaxonomy:
    deferredToLesson614

  ModularMonolith:
    deferredToLesson615
```

---

### 43. Documentar request flow

Arquivo:

```text
docs/REQUEST_FLOW.md
```

Fluxo REST:

```text
HTTP request;

OrderController;

CreateOrderUseCase;

CreateOrderService;

SaveOrderBoundary;

InMemoryOrderAdapter;

OrderResult;

OrderResponse;

HTTP response.
```

Fluxo CLI:

```text
command-line argument;

OrderCommandRunner;

CreateOrderUseCase;

CreateOrderService;

SaveOrderBoundary;

InMemoryOrderAdapter;

console output.
```

O núcleo é o mesmo.

---

### 44. Documentar core and edges

Arquivo:

```text
docs/CORE_AND_EDGES.md
```

Inclua:

- o que pertence ao núcleo;
- o que pertence às bordas;
- exemplos de entrada;
- exemplos de saída;
- direção de dependência;
- erros comuns;
- testes.

---

### 45. Executar testes

Execute:

```powershell
.\scripts\m19\hexagonal-orders-api\run-hexagonal-orders-tests.ps1
```

Ou:

```powershell
mvn test
```

Confirme:

- domínio;
- serviços;
- boundaries;
- REST;
- CLI;
- adapters de saída;
- arquitetura;
- contexto.

---

### 46. Executar smoke

Execute:

```powershell
.\scripts\m19\hexagonal-orders-api\run-hexagonal-orders-smoke.ps1
```

Fluxo:

1. criar pedido por REST;
2. consultar;
3. confirmar;
4. observar notificação;
5. criar pedido por CLI;
6. validar que ambos usam o mesmo núcleo.

---

### 47. Validar core

Execute:

```powershell
.\scripts\m19\hexagonal-orders-api\validate-hexagonal-core.ps1
```

Procure:

- Spring;
- HTTP;
- console;
- persistência;
- random UUID;
- system clock;
- technical exception.

---

### 48. Validar lado de entrada

Execute:

```powershell
.\scripts\m19\hexagonal-orders-api\validate-hexagonal-input-side.ps1
```

Confirme:

- REST converte;
- CLI converte;
- ambos chamam boundaries;
- nenhum chama adapter de saída;
- nenhuma regra de negócio.

---

### 49. Validar lado de saída

Execute:

```powershell
.\scripts\m19\hexagonal-orders-api\validate-hexagonal-output-side.ps1
```

Confirme:

- boundaries são do núcleo;
- adapters implementam;
- technical mapping;
- exception conversion;
- zero orquestração de caso de uso.

---

### 50. Criar reports

Exemplo:

```yaml
hexagonalCore:
  domain:
    PASS

  application:
    PASS

  inputBoundaries:
    PASS

  outputBoundaries:
    PASS

  frameworkIndependence:
    PASS

  result:
    PASS
```

---

### 51. Criar gate

O gate valida:

```text
build;

core;

input-side;

output-side;

REST adapter;

CLI adapter;

persistence adapter;

notification adapter;

identity adapter;

time adapter;

composition;

architecture tests;

functional tests;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_BUILD;

FAIL_CORE;

FAIL_INPUT_SIDE;

FAIL_OUTPUT_SIDE;

FAIL_INPUT_ADAPTER;

FAIL_OUTPUT_ADAPTER;

FAIL_COMPOSITION;

FAIL_ARCHITECTURE;

FAIL_TEST;

FAIL_DOCUMENTATION;

INCONCLUSIVE.
```

---

### 52. Coletar evidence

Arquivo:

```text
contracts/hexagonal-architecture-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- core status;
- input side status;
- output side status;
- REST adapter status;
- CLI adapter status;
- persistence adapter status;
- notification adapter status;
- identity adapter status;
- time adapter status;
- composition status;
- architecture status;
- test status;
- smoke status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- secrets;
- IDs reais;
- payloads reais;
- catálogo completo da aula 614;
- conteúdo de monólito modular.

---

### 53. Executar validação completa

Execute:

```powershell
.\scripts\m19\hexagonal-orders-api\validate-hexagonal-architecture-contract.ps1

.\scripts\m19\hexagonal-orders-api\run-hexagonal-orders-tests.ps1

.\scripts\m19\hexagonal-orders-api\validate-hexagonal-core.ps1

.\scripts\m19\hexagonal-orders-api\validate-hexagonal-input-side.ps1

.\scripts\m19\hexagonal-orders-api\validate-hexagonal-output-side.ps1

.\scripts\m19\hexagonal-orders-api\validate-hexagonal-adapters.ps1

.\scripts\m19\hexagonal-orders-api\run-hexagonal-orders-smoke.ps1

.\scripts\m19\hexagonal-orders-api\collect-hexagonal-architecture-evidence.ps1

.\scripts\m19\hexagonal-orders-api\verify-hexagonal-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 54. Encerrar o laboratório

Confirme:

- aplicação encerrada;
- CLI encerrado;
- nenhum processo residual;
- testes aprovados;
- architecture tests aprovados;
- core sem framework;
- adapters sem regra de negócio;
- reports sanitizados;
- Ports and Adapters não antecipado;
- monólito modular não antecipado.

---

## Entendendo o que foi feito

### O núcleo ganhou independência prática

As regras passaram a funcionar sem REST, CLI ou Spring.

### A entrada ganhou substituibilidade

REST, CLI e testes passaram a acionar os mesmos casos de uso.

### A saída ganhou contratos próprios

Persistência, tempo, identidade e notificação passaram a ser capacidades exigidas pelo núcleo.

### Os adapters ganharam função técnica

Eles passaram a traduzir mecanismos externos sem assumir políticas.

### A composição ganhou responsabilidade

A escolha das implementações ficou fora do núcleo.

### O tempo e a identidade ganharam controle

Relógio e geração de ID deixaram de ser efeitos escondidos.

### Os testes ganharam velocidade

O núcleo passou a ser validado com adapters controlados.

### A arquitetura ganhou forma operacional

O hexágono deixou de ser apenas desenho e passou a orientar dependências reais.

### A próxima aula ganhou fronteira

Ports and Adapters será aprofundado na aula 614.

---

## Erros comuns importantes

### Desenhar um hexágono sem mudar dependências

A arquitetura permanece acoplada.

### Controller acessar repository adapter

O núcleo é ignorado.

### Core chamar `UUID.randomUUID()`

A geração de identidade permanece escondida.

### Core chamar `Instant.now()`

Tempo fica difícil de testar.

### CLI implementar regra

O mecanismo de entrada assume política.

### Adapter de saída chamar use case

A direção fica confusa.

### Um adapter chamar outro diretamente

A coordenação escapa do núcleo.

### Colocar annotations Spring no core

O framework invade a política.

### Criar dezenas de boundaries sem necessidade

A arquitetura vira burocrática.

### Antecipar toda a taxonomia da próxima aula

O foco da visão hexagonal se perde.

---

## Comandos úteis

### Executar testes

```powershell
.\scripts\m19\hexagonal-orders-api\run-hexagonal-orders-tests.ps1
```

### Validar core

```powershell
.\scripts\m19\hexagonal-orders-api\validate-hexagonal-core.ps1
```

### Validar entradas

```powershell
.\scripts\m19\hexagonal-orders-api\validate-hexagonal-input-side.ps1
```

### Executar smoke

```powershell
.\scripts\m19\hexagonal-orders-api\run-hexagonal-orders-smoke.ps1
```

### Verificar gate

```powershell
.\scripts\m19\hexagonal-orders-api\verify-hexagonal-architecture-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Núcleo

Crie domínio, aplicação e boundaries.

### Parte 2 — Entradas

Implemente REST e CLI.

### Parte 3 — Saídas

Defina persistência, notificação, tempo e identidade.

### Parte 4 — Services

Coordene regras e efeitos.

### Parte 5 — Adapters

Implemente detalhes externos.

### Parte 6 — Composição

Conecte contratos e implementações.

### Parte 7 — Testes

Valide núcleo sem Spring.

### Parte 8 — Architecture tests

Proteja direção e isolamento.

### Parte 9 — Smoke

Acione o mesmo núcleo por REST e CLI.

### Parte 10 — Gate

Valide core, lados, adapters e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 612 e ponte para a aula 614 foram preservadas;
- o laboratório `hexagonal-orders-api` foi criado;
- o núcleo contém domínio, aplicação e boundaries;
- o núcleo não depende de Spring, HTTP, console ou persistência;
- boundaries de entrada representam intenções;
- boundaries de saída representam capacidades externas;
- REST e CLI acionam o mesmo núcleo;
- testes podem acionar o núcleo diretamente;
- controller não acessa adapter de persistência;
- CLI não implementa regra de negócio;
- serviços de aplicação coordenam domínio e saídas;
- adapter em memória implementa carga e salvamento;
- adapter de notificação implementa efeito externo;
- adapter de ID remove `UUID.randomUUID()` do núcleo;
- adapter de tempo remove `Instant.now()` do núcleo;
- adapters não chamam uns aos outros diretamente;
- composição escolhe implementações;
- exceptions técnicas não vazam para o núcleo;
- testes do core não sobem Spring;
- testes de REST e CLI validam mecanismos de entrada;
- testes de saída validam detalhes técnicos;
- ArchUnit protege o isolamento do core;
- documentação de core, entradas, saídas, fluxo e testes foi criada;
- reports, gate e evidence foram criados;
- nenhuma informação sensível foi incluída;
- Ports and Adapters e monólito modular não foram antecipados;
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
  labs/m19/aula-613-arquitetura-hexagonal/hexagonal-orders-api `
  scripts/m19/hexagonal-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReferenceReal|fullPortCatalog|adapterRegistry|modularMonolithBoundary|boundedContext"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar arquitetura hexagonal"
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
- catálogo completo de Ports and Adapters;
- monólito modular;
- DDD;
- sistemas distribuídos.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou Arquitetura Hexagonal.

Você criou:

```text
núcleo;

domínio;

serviços de aplicação;

boundaries de entrada;

boundaries de saída;

adapter REST;

adapter CLI;

adapter de persistência;

adapter de notificação;

adapter de identidade;

adapter de tempo;

composição;

architecture tests.
```

Você comprovou que o núcleo não precisa conhecer quem o aciona; que REST, CLI e testes podem usar os mesmos casos de uso; que persistência, notificação, tempo e identidade podem ser tratados como capacidades externas; que adapters convertem mecanismos sem decidir regras; que a composição escolhe implementações; e que a arquitetura hexagonal melhora testabilidade e substituibilidade.

A próxima aula será:

```text
614 - M19.04 - Ports and Adapters
```

Nela, você irá formalizar os contratos de entrada e saída, classificar driving e driven adapters, trabalhar com múltiplas implementações e aprofundar os critérios de desenho e teste desses componentes.

Nenhum catálogo completo de ports, matriz formal de adapters ou monólito modular foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mantive o núcleo independente.
- [ ] Criei boundaries de entrada.
- [ ] Criei boundaries de saída.
- [ ] Implementei REST e CLI.
- [ ] Implementei adapters externos.
- [ ] Injetei tempo e identidade.
- [ ] Testei o core sem Spring.
- [ ] Protegi dependências com ArchUnit.

---

## Troubleshooting adicional

### Core precisa de `ResponseEntity`

O adapter de entrada deve converter o resultado.

### Core precisa de `JpaRepository`

Defina uma capacidade de saída e implemente fora.

### CLI precisa consultar storage

Chame o caso de uso de consulta.

### Adapter de notificação precisa decidir quando notificar

A decisão pertence ao serviço de aplicação.

### Teste precisa de UUID previsível

Use adapter de ID fixo.

### Teste precisa de horário previsível

Use adapter de tempo fixo.

### Spring não encontra boundaries

Revise beans e packages de configuração.

### ArchUnit detecta import de adapter no core

Remova a dependência para fora.

### Existem boundaries que nunca serão substituídos

Revise se a capacidade precisa realmente ser explícita.

### O projeto começou a definir uma taxonomia completa

Reserve o aprofundamento para a aula 614.

---

## Perguntas de revisão

1. O que é Arquitetura Hexagonal?
2. O que representa o núcleo?
3. O que é lado de entrada?
4. O que é lado de saída?
5. O que é boundary de entrada?
6. O que é boundary de saída?
7. Qual função de um adapter de entrada?
8. Qual função de um adapter de saída?
9. Por que REST e CLI podem compartilhar casos de uso?
10. Por que tempo pode ser uma saída?
11. Por que identidade pode ser uma saída?
12. Por que controller não deve acessar persistência?
13. Por que adapters não devem se chamar diretamente?
14. Onde ocorre a composição?
15. Como testar o núcleo sem Spring?
16. O que a substituibilidade permite?
17. Para que servem architecture tests?
18. Qual risco de criar boundaries demais?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Núcleo cercado por mecanismos externos.
2. Domínio, aplicação e contratos.
3. Região que aciona a aplicação.
4. Região usada para efeitos externos.
5. Contrato oferecido pelo núcleo.
6. Contrato exigido pelo núcleo.
7. Converter mecanismo externo em chamada.
8. Converter solicitação do núcleo em efeito.
9. Ambos dependem do mesmo boundary.
10. Para controlar e testar o instante.
11. Para controlar e testar a geração.
12. A coordenação pertence ao núcleo.
13. Evitar bypass das políticas.
14. Na configuração externa.
15. Usando adapters fakes ou em memória.
16. Trocar tecnologia sem alterar políticas.
17. Impedir dependências proibidas.
18. Aumentar burocracia sem benefício.
19. Ports and Adapters.
20. Ports and Adapters.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 613 - M19.03 - Arquitetura Hexagonal

- Criei o laboratório `hexagonal-orders-api`.
- Organizei o sistema em núcleo, lado de entrada e lado de saída.
- Mantive domínio, aplicação e boundaries no núcleo.
- Criei boundaries para criar, consultar, confirmar e cancelar pedidos.
- Criei capacidades externas para carregar, salvar, gerar ID, obter tempo e notificar.
- Implementei serviços de aplicação independentes de framework.
- Criei adapter REST.
- Criei adapter CLI.
- Implementei persistência em memória.
- Implementei notificação em console.
- Removi `UUID.randomUUID()` e `Instant.now()` do núcleo.
- Centralizei a composição no Spring.
- Testei o mesmo núcleo por REST, CLI e chamadas diretas.
- Criei adapters fixos para testes determinísticos.
- Usei ArchUnit para proteger o core.
- Criei reports, gate e evidence.
- Não antecipei Ports and Adapters ou monólito modular.
- Próxima aula: Ports and Adapters.
```

---

## Referência técnica curta

- Hexagonal Architecture.
- Application core.
- Input side.
- Output side.
- Driving mechanisms.
- Driven mechanisms.
- Boundary contracts.
- Adapter substitution.
- Composition root.
- Architecture tests.

Regra final:

```text
a Arquitetura Hexagonal precisa manter o núcleo independente de mecanismos externos: domínio, serviços de aplicação e boundaries pertencem ao core, REST, CLI e testes acionam boundaries de entrada, persistência, notificação, tempo e identidade implementam capacidades de saída, e nenhuma regra de negócio fica em controllers, runners ou adapters; o core não usa Spring, HTTP, console, `UUID.randomUUID()`, `Instant.now()` ou drivers de persistência, adapters convertem protocolos e detalhes técnicos, exceptions externas são traduzidas, adapters não chamam uns aos outros para coordenar casos de uso e a composição escolhe implementações em uma borda externa; testes do núcleo usam adapters controlados, REST e CLI demonstram múltiplas entradas, adapters de saída demonstram substituibilidade e ArchUnit bloqueia dependências para fora; o gate termina com core, lados, adapters, composição, smoke, documentação e evidence aprovados, enquanto Ports and Adapters é aprofundado somente na aula 614 e monólito modular permanece reservado à aula 615.
```
