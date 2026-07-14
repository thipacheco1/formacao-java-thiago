# 614 - M19.04 - Ports and Adapters

## Apresentação da aula

Na aula 613, você implementou uma aplicação em Arquitetura Hexagonal.

Você organizou o sistema em:

```text
núcleo;

lado de entrada;

lado de saída;

adapters de entrada;

adapters de saída;

composição.
```

Você também comprovou que:

- REST, CLI e testes podem acionar os mesmos casos de uso;
- persistência, notificação, tempo e identidade podem ficar fora do núcleo;
- adapters não devem coordenar regras de negócio;
- o core pode ser testado sem Spring;
- dependências devem apontar para dentro.

Agora você irá aprofundar o mecanismo que torna essa arquitetura explícita:

```text
Ports and Adapters.
```

Nesta aula, o foco não será apenas desenhar um núcleo com bordas.

O foco será formalizar contratos.

Você irá responder perguntas como:

```text
qual contrato representa
uma intenção externa?

qual contrato representa
uma necessidade do núcleo?

quem define o port?

quem implementa o adapter?

como escolher
entre duas implementações?

como testar
se dois adapters
obedecem ao mesmo contrato?

como evitar
que um port vire
uma interface genérica
sem significado?
```

Ports and Adapters ajuda a organizar o sistema em torno de duas ideias:

```text
ports:
contratos do núcleo;

adapters:
implementações ou conversores externos.
```

Os ports de entrada representam ações oferecidas pela aplicação.

Exemplos:

```text
CreateOrderPort;

FindOrderPort;

ConfirmOrderPort;

CancelOrderPort.
```

Os ports de saída representam capacidades que a aplicação precisa.

Exemplos:

```text
LoadOrderPort;

SaveOrderPort;

PublishOrderEventPort;

GenerateOrderIdPort;

CurrentTimePort.
```

Os driving adapters iniciam uma interação.

Exemplos:

```text
REST controller;

CLI;

scheduler;

message consumer;

test.
```

Os driven adapters são acionados pelo núcleo.

Exemplos:

```text
PostgreSQL adapter;

in-memory adapter;

Kafka publisher;

HTTP client;

file adapter;

clock adapter.
```

Nesta aula, você criará:

- ports de entrada com nomes orientados a intenção;
- ports de saída orientados a capacidade;
- driving adapters;
- driven adapters;
- múltiplas implementações do mesmo port;
- seleção por configuração;
- testes de contrato;
- testes de adapter;
- composition root;
- regras de nomenclatura;
- matriz de compatibilidade;
- gates arquiteturais.

O laboratório será:

```text
labs/m19/aula-614-ports-and-adapters/ports-orders-api
```

A aplicação continuará com pedidos.

O núcleo oferecerá casos de uso para:

- criar pedido;
- consultar pedido;
- confirmar pedido;
- cancelar pedido.

O núcleo exigirá capacidades para:

- carregar pedido;
- salvar pedido;
- publicar evento;
- gerar ID;
- obter horário atual.

Você implementará mais de um adapter para alguns ports.

Exemplo:

```text
SaveOrderPort:
InMemoryOrderAdapter;
FileOrderAdapter de laboratório.

PublishOrderEventPort:
ConsoleOrderEventAdapter;
CapturingOrderEventAdapter de teste.
```

O objetivo não é criar adapters sofisticados.

O objetivo é provar substituibilidade e contrato.

A próxima aula oficial será:

```text
615 - M19.05 - Monolito modular
```

Por isso, esta aula não irá ainda:

- dividir o sistema em módulos de negócio;
- definir boundaries entre módulos;
- criar módulos order, payment ou inventory;
- usar eventos entre módulos;
- criar testes de dependência modular;
- preparar extração de microservices;
- usar Spring Modulith como tema central.

Esses assuntos começam na aula 615.

A regra central desta aula será:

```text
ports expressam
o que o núcleo oferece
ou precisa;

adapters traduzem
tecnologias e mecanismos

sem redefinir
a política da aplicação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
612:
Clean Architecture.

613:
Arquitetura Hexagonal.

614:
Ports and Adapters.

615:
Monolito modular.

616:
Modularizacao em Java.
```

A progressão é:

```text
controlar dependências;

visualizar núcleo e bordas;

formalizar contratos e implementações;

organizar domínios em módulos;

reforçar módulos em Java.
```

Nesta aula:

```text
input ports:
sim.

output ports:
sim.

driving adapters:
sim.

driven adapters:
sim.

múltiplos adapters:
sim.

seleção por configuração:
sim.

contract tests:
sim.

adapter tests:
sim.

composition root:
sim.

monólito modular:
não.

JPMS:
não.

DDD completo:
não.
```

O laboratório usará Java 21, Maven, Spring Boot, Validation, Jackson e ArchUnit.

Um adapter de arquivo será usado somente no laboratório, com dados sintéticos.

---

## Objetivo prático

A estrutura será:

```text
labs/m19/aula-614-ports-and-adapters/ports-orders-api
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/portsorders
│   │   │       ├── PortsOrdersApplication.java
│   │   │       ├── core
│   │   │       │   ├── domain
│   │   │       │   │   ├── Order.java
│   │   │       │   │   ├── OrderId.java
│   │   │       │   │   ├── OrderItem.java
│   │   │       │   │   ├── OrderStatus.java
│   │   │       │   │   └── DomainException.java
│   │   │       │   ├── port
│   │   │       │   │   ├── in
│   │   │       │   │   │   ├── CreateOrderPort.java
│   │   │       │   │   │   ├── FindOrderPort.java
│   │   │       │   │   │   ├── ConfirmOrderPort.java
│   │   │       │   │   │   └── CancelOrderPort.java
│   │   │       │   │   └── out
│   │   │       │   │       ├── LoadOrderPort.java
│   │   │       │   │       ├── SaveOrderPort.java
│   │   │       │   │       ├── PublishOrderEventPort.java
│   │   │       │   │       ├── GenerateOrderIdPort.java
│   │   │       │   │       └── CurrentTimePort.java
│   │   │       │   ├── service
│   │   │       │   │   ├── CreateOrderService.java
│   │   │       │   │   ├── FindOrderService.java
│   │   │       │   │   ├── ConfirmOrderService.java
│   │   │       │   │   └── CancelOrderService.java
│   │   │       │   ├── command
│   │   │       │   │   └── CreateOrderCommand.java
│   │   │       │   ├── result
│   │   │       │   │   └── OrderResult.java
│   │   │       │   └── event
│   │   │       │       ├── OrderConfirmedEvent.java
│   │   │       │       └── OrderCancelledEvent.java
│   │   │       ├── adapter
│   │   │       │   ├── in
│   │   │       │   │   ├── web
│   │   │       │   │   │   ├── OrderController.java
│   │   │       │   │   │   ├── request
│   │   │       │   │   │   ├── response
│   │   │       │   │   │   └── ApiExceptionHandler.java
│   │   │       │   │   ├── cli
│   │   │       │   │   │   └── OrderCliAdapter.java
│   │   │       │   │   └── scheduler
│   │   │       │   │       └── PendingOrderSchedulerAdapter.java
│   │   │       │   └── out
│   │   │       │       ├── persistence
│   │   │       │       │   ├── memory
│   │   │       │       │   │   └── InMemoryOrderAdapter.java
│   │   │       │       │   └── file
│   │   │       │       │       └── FileOrderAdapter.java
│   │   │       │       ├── event
│   │   │       │       │   ├── ConsoleOrderEventAdapter.java
│   │   │       │       │   └── CapturingOrderEventAdapter.java
│   │   │       │       ├── identity
│   │   │       │       │   └── UUIDOrderIdAdapter.java
│   │   │       │       └── time
│   │   │       │           └── SystemClockAdapter.java
│   │   │       └── configuration
│   │   │           ├── PortsOrdersConfiguration.java
│   │   │           └── AdapterSelectionProperties.java
│   │   └── resources
│   │       ├── application.yml
│   │       ├── application-memory.yml
│   │       └── application-file.yml
│   └── test
│       └── java
│           └── br/com/formacao/portsorders
│               ├── architecture
│               │   └── PortsAndAdaptersArchitectureTest.java
│               ├── core
│               │   ├── CreateOrderServiceTest.java
│               │   └── ConfirmOrderServiceTest.java
│               ├── contract
│               │   ├── OrderPersistenceContractTest.java
│               │   └── OrderEventContractTest.java
│               ├── adapter
│               │   ├── OrderControllerTest.java
│               │   ├── OrderCliAdapterTest.java
│               │   ├── PendingOrderSchedulerAdapterTest.java
│               │   ├── InMemoryOrderAdapterTest.java
│               │   └── FileOrderAdapterTest.java
│               └── configuration
│                   └── AdapterSelectionTest.java
├── contracts
│   ├── ports-and-adapters-contract.yaml
│   ├── input-port-policy.yaml
│   ├── output-port-policy.yaml
│   ├── driving-adapter-policy.yaml
│   ├── driven-adapter-policy.yaml
│   ├── adapter-selection-policy.yaml
│   ├── contract-test-policy.yaml
│   ├── error-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── docs
│   ├── PORTS_AND_ADAPTERS_OVERVIEW.md
│   ├── PORT_NAMING.md
│   ├── DRIVING_ADAPTERS.md
│   ├── DRIVEN_ADAPTERS.md
│   ├── ADAPTER_SELECTION.md
│   ├── CONTRACT_TESTS.md
│   ├── REQUEST_FLOW.md
│   └── TROUBLESHOOTING.md
└── reports
    ├── input-port-report.yaml
    ├── output-port-report.yaml
    ├── driving-adapter-report.yaml
    ├── driven-adapter-report.yaml
    ├── contract-test-report.yaml
    ├── adapter-selection-report.yaml
    └── ports-and-adapters-gate-report.yaml
```

Scripts:

```text
scripts/m19/ports-orders-api
├── validate-ports-and-adapters-contract.ps1
├── run-ports-orders-tests.ps1
├── validate-input-ports.ps1
├── validate-output-ports.ps1
├── validate-driving-adapters.ps1
├── validate-driven-adapters.ps1
├── validate-adapter-selection.ps1
├── run-port-contract-tests.ps1
├── run-ports-orders-smoke.ps1
├── collect-ports-and-adapters-evidence.ps1
└── verify-ports-and-adapters-gate.ps1
```

---

## Conceito essencial

### Port

Contrato definido pelo núcleo para entrada ou saída.

---

### Input port

Contrato que representa uma intenção oferecida pela aplicação.

---

### Output port

Contrato que representa uma capacidade externa necessária pela aplicação.

---

### Driving adapter

Adapter que inicia uma interação com a aplicação.

---

### Driven adapter

Adapter acionado pela aplicação por meio de um output port.

---

### Adapter contract

Comportamento que toda implementação compatível deve respeitar.

---

### Contract test

Teste reutilizável aplicado a diferentes adapters do mesmo port.

---

### Composition root

Local externo onde implementações são selecionadas e conectadas.

---

### Adapter selection

Decisão de qual implementação concreta será usada em determinado ambiente.

---

### Port granularity

Nível de detalhe de um port.

---

### Capability

Necessidade externa expressa em termos do núcleo.

---

### Mechanism

Tecnologia concreta usada por um adapter.

---

### Substitution

Troca de adapter sem alteração no núcleo.

---

## Mão na massa guiada

### 1. Criar o laboratório

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-614-ports-and-adapters/ports-orders-api

Set-Location `
  labs/m19/aula-614-ports-and-adapters/ports-orders-api
```

---

### 2. Criar contrato principal

Arquivo:

```text
contracts/ports-and-adapters-contract.yaml
```

Conteúdo:

```yaml
portsAndAdapters:
  required:
    - input-ports
    - output-ports
    - driving-adapters
    - driven-adapters
    - multiple-implementations
    - adapter-selection
    - contract-tests
    - composition-root
    - architecture-tests

  forbidden:
    - generic-technology-port
    - adapter-business-rule
    - core-depending-on-adapter
    - direct-adapter-coordination

  nextLesson:
    code:
      M19.05
```

---

### 3. Definir nomenclatura

Input ports devem representar intenção:

```text
CreateOrderPort;

ConfirmOrderPort;

CancelOrderPort.
```

Evite:

```text
OrderServiceInterface;

GenericCommandPort;

ApplicationPort;
```

Output ports devem representar capacidade:

```text
SaveOrderPort;

LoadOrderPort;

PublishOrderEventPort.
```

Evite:

```text
DatabasePort;

KafkaPort;

PostgresPort.
```

O port descreve o que o núcleo precisa, não a tecnologia.

---

### 4. Criar input port policy

Arquivo:

```text
contracts/input-port-policy.yaml
```

Conteúdo:

```yaml
inputPort:
  name:
    businessIntent:
      required

  ownedBy:
    core

  implementedBy:
    application-service

  calledBy:
    driving-adapter

  forbidden:
    - HTTP-type
    - framework-annotation
    - adapter-type
    - persistence-type
```

---

### 5. Criar `CreateOrderPort`

```java
public interface CreateOrderPort {

    OrderResult create(
            CreateOrderCommand command);
}
```

O nome do método também expressa intenção.

---

### 6. Criar demais input ports

```java
public interface FindOrderPort {

    OrderResult find(
            UUID orderId);
}
```

```java
public interface ConfirmOrderPort {

    OrderResult confirm(
            UUID orderId);
}
```

```java
public interface CancelOrderPort {

    OrderResult cancel(
            UUID orderId);
}
```

Essas interfaces são pequenas por intenção.

Não crie um único `OrderUseCasesPort` com dezenas de métodos sem avaliar coesão.

---

### 7. Implementar input port

```java
public final class CreateOrderService
        implements CreateOrderPort {

    private final SaveOrderPort saveOrder;
    private final GenerateOrderIdPort generateId;
    private final CurrentTimePort currentTime;

    public CreateOrderService(
            SaveOrderPort saveOrder,
            GenerateOrderIdPort generateId,
            CurrentTimePort currentTime) {

        this.saveOrder = saveOrder;
        this.generateId = generateId;
        this.currentTime = currentTime;
    }

    @Override
    public OrderResult create(
            CreateOrderCommand command) {

        Order order =
                Order.create(
                        generateId.next(),
                        OrderCommandMapper.items(command),
                        currentTime.now());

        return OrderResultMapper.from(
                saveOrder.save(order));
    }
}
```

---

### 8. Criar output port policy

Arquivo:

```text
contracts/output-port-policy.yaml
```

Conteúdo:

```yaml
outputPort:
  name:
    capability:
      required

  ownedBy:
    core

  implementedBy:
    driven-adapter

  calledBy:
    application-service

  forbidden:
    - vendor-name
    - framework-type
    - adapter-implementation
    - transport-detail
```

---

### 9. Criar persistência separada

```java
public interface LoadOrderPort {

    Optional<Order> load(
            OrderId orderId);
}
```

```java
public interface SaveOrderPort {

    Order save(
            Order order);
}
```

A separação permite que um caso de uso dependa apenas do necessário.

---

### 10. Criar evento de domínio aplicado

```java
public record OrderConfirmedEvent(
        OrderId orderId,
        Instant occurredAt) {
}
```

Nesta aula, o evento representa uma mensagem interna para um output port.

Não será iniciado um modelo completo de domain events do DDD.

---

### 11. Criar port de publicação

```java
public interface PublishOrderEventPort {

    void publishConfirmed(
            OrderConfirmedEvent event);

    void publishCancelled(
            OrderCancelledEvent event);
}
```

O port não menciona Kafka.

---

### 12. Criar adapters de entrada

REST:

```java
@RestController
@RequestMapping("/api/orders")
public final class OrderController {

    private final CreateOrderPort createOrder;
    private final FindOrderPort findOrder;
    private final ConfirmOrderPort confirmOrder;
    private final CancelOrderPort cancelOrder;
}
```

CLI:

```java
public final class OrderCliAdapter
        implements ApplicationRunner {

    private final CreateOrderPort createOrder;
}
```

Scheduler:

```java
public final class PendingOrderSchedulerAdapter {

    private final FindOrderPort findOrder;
}
```

O scheduler do laboratório apenas demonstra um terceiro mecanismo.

Ele não implementará processamento distribuído.

---

### 13. Criar driving adapter policy

Arquivo:

```text
contracts/driving-adapter-policy.yaml
```

Conteúdo:

```yaml
drivingAdapter:
  responsibilities:
    - parse-input
    - validate-format
    - map-command
    - call-input-port
    - map-output

  forbidden:
    - call-driven-adapter
    - business-rule
    - transaction-policy
    - persistence-access
```

---

### 14. Criar adapter em memória

```java
public final class InMemoryOrderAdapter
        implements LoadOrderPort,
                   SaveOrderPort {

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

---

### 15. Criar adapter de arquivo

O adapter de arquivo será didático.

Formato:

```text
JSON por linha
ou
arquivo JSON pequeno.
```

Exemplo de contrato:

```java
public final class FileOrderAdapter
        implements LoadOrderPort,
                   SaveOrderPort {

    private final Path storageFile;
    private final ObjectMapper mapper;

    @Override
    public synchronized Order save(
            Order order) {

        // converte para modelo técnico,
        // atualiza coleção,
        // grava em arquivo temporário,
        // move de forma controlada.

        return order;
    }
}
```

O adapter pode usar Jackson.

O núcleo não.

---

### 16. Tratar escrita de arquivo

Cuidados:

- diretório conhecido;
- arquivo temporário;
- charset explícito;
- erro convertido;
- cleanup em teste;
- sincronização bounded;
- dados sintéticos;
- path de laboratório;
- nenhuma credencial.

---

### 17. Criar modelo de persistência

```java
record FileOrderRecord(
        UUID id,
        String status,
        List<FileOrderItemRecord> items,
        Instant createdAt) {
}
```

O modelo de arquivo pertence ao adapter.

A entity não recebe annotation Jackson.

---

### 18. Criar driven adapter policy

Arquivo:

```text
contracts/driven-adapter-policy.yaml
```

Conteúdo:

```yaml
drivenAdapter:
  responsibilities:
    - implement-output-port
    - technical-mapping
    - resource-management
    - technical-error-conversion

  forbidden:
    - use-case-orchestration
    - business-rule
    - external-model-inside-core
    - raw-technical-exception
```

---

### 19. Criar adapter de evento em console

```java
public final class ConsoleOrderEventAdapter
        implements PublishOrderEventPort {

    @Override
    public void publishConfirmed(
            OrderConfirmedEvent event) {

        System.out.println(
                "order-confirmed:"
                        + event.orderId().value());
    }

    @Override
    public void publishCancelled(
            OrderCancelledEvent event) {

        System.out.println(
                "order-cancelled:"
                        + event.orderId().value());
    }
}
```

---

### 20. Criar capturing adapter

```java
public final class CapturingOrderEventAdapter
        implements PublishOrderEventPort {

    private final List<Object>
            events =
            new ArrayList<>();

    @Override
    public void publishConfirmed(
            OrderConfirmedEvent event) {

        events.add(event);
    }

    @Override
    public void publishCancelled(
            OrderCancelledEvent event) {

        events.add(event);
    }

    public List<Object> events() {
        return List.copyOf(events);
    }
}
```

Essa implementação será usada em testes.

---

### 21. Atualizar confirmação

```java
public final class ConfirmOrderService
        implements ConfirmOrderPort {

    private final LoadOrderPort loadOrder;
    private final SaveOrderPort saveOrder;
    private final PublishOrderEventPort publishEvent;
    private final CurrentTimePort currentTime;

    @Override
    public OrderResult confirm(
            UUID orderId) {

        Order order =
                loadRequired(orderId);

        order.confirm();

        Order saved =
                saveOrder.save(order);

        publishEvent.publishConfirmed(
                new OrderConfirmedEvent(
                        saved.id(),
                        currentTime.now()));

        return OrderResultMapper.from(saved);
    }
}
```

A aplicação decide quando publicar.

O adapter decide como publicar.

---

### 22. Criar selection properties

```java
@ConfigurationProperties(
        prefix = "orders.adapters")
public record AdapterSelectionProperties(
        String persistence,
        String events) {
}
```

Valores:

```text
persistence:
memory;
file.

events:
console;
capturing-lab.
```

Em produção real, `capturing-lab` não deve existir.

---

### 23. Criar selection policy

Arquivo:

```text
contracts/adapter-selection-policy.yaml
```

Conteúdo:

```yaml
selection:
  location:
    composition-root

  basedOn:
    - environment
    - configuration
    - test-scenario

  coreBranchingByAdapter:
    forbidden

  unknownAdapter:
    failFast:
      required

  labAdapterInProduction:
    forbidden
```

---

### 24. Selecionar persistência

Exemplo:

```java
@Bean
OrderPersistenceAdapter orderPersistenceAdapter(
        AdapterSelectionProperties properties,
        ObjectMapper mapper) {

    return switch (
            properties.persistence()) {

        case "memory" ->
                new InMemoryOrderAdapter();

        case "file" ->
                new FileOrderAdapter(
                        Path.of(
                                "build/lab/orders.json"),
                        mapper);

        default ->
                throw new IllegalStateException(
                        "Unknown persistence adapter");
    };
}
```

Uma alternativa melhor pode declarar beans condicionais separados.

Nesta aula, documente trade-offs.

---

### 25. Evitar `if` no core

Proibido:

```java
if (useFileAdapter) {
    ...
} else {
    ...
}
```

dentro do service.

A seleção pertence à composição.

---

### 26. Criar contract test policy

Arquivo:

```text
contracts/contract-test-policy.yaml
```

Conteúdo:

```yaml
contractTest:
  appliedTo:
    - every-persistence-adapter
    - every-event-adapter-when-applicable

  validates:
    - behavior
    - error-contract
    - idempotent-expectation
    - missing-value
    - round-trip

  vendorSpecificAssertion:
    separate:
      required
```

---

### 27. Criar contrato de persistência

Use classe abstrata:

```java
public abstract class OrderPersistenceContractTest {

    protected abstract LoadOrderPort loadPort();

    protected abstract SaveOrderPort savePort();

    @Test
    void shouldSaveAndLoadOrder() {

        Order order =
                TestOrderFactory.created();

        savePort().save(order);

        Order loaded =
                loadPort()
                        .load(order.id())
                        .orElseThrow();

        assertEquals(
                order.id(),
                loaded.id());
    }

    @Test
    void shouldReturnEmptyForUnknownOrder() {

        Optional<Order> loaded =
                loadPort()
                        .load(TestIds.unknown());

        assertTrue(loaded.isEmpty());
    }
}
```

---

### 28. Aplicar ao adapter em memória

```java
class InMemoryOrderAdapterContractTest
        extends OrderPersistenceContractTest {

    private final InMemoryOrderAdapter adapter =
            new InMemoryOrderAdapter();

    @Override
    protected LoadOrderPort loadPort() {
        return adapter;
    }

    @Override
    protected SaveOrderPort savePort() {
        return adapter;
    }
}
```

---

### 29. Aplicar ao adapter de arquivo

```java
class FileOrderAdapterContractTest
        extends OrderPersistenceContractTest {

    @TempDir
    Path tempDir;

    private FileOrderAdapter adapter;

    @BeforeEach
    void setUp() {
        adapter =
                new FileOrderAdapter(
                        tempDir.resolve(
                                "orders.json"),
                        TestObjectMapper.create());
    }
}
```

O mesmo comportamento básico é exigido.

---

### 30. Criar testes específicos

Adapter de arquivo também precisa validar:

- arquivo corrompido;
- path inválido;
- atomicidade possível;
- charset;
- cleanup;
- exception conversion.

Esses testes não pertencem ao contrato compartilhado.

---

### 31. Criar contrato de evento

Valide:

- evento correto;
- ID correto;
- horário correto;
- uma publicação por transição;
- nenhuma publicação em falha.

O adapter console pode exigir captura de output.

O capturing adapter permite assert mais direto.

---

### 32. Testar substituição

Execute o mesmo caso de uso com:

```text
InMemoryOrderAdapter;

FileOrderAdapter.
```

O service não muda.

Esse é o principal resultado da aula.

---

### 33. Testar driving adapters

REST:

- mapping;
- validação;
- status;
- erro.

CLI:

- argumento;
- command;
- output.

Scheduler:

- disparo;
- input port;
- ausência de acesso direto à persistência.

---

### 34. Criar matriz de adapters

Arquivo:

```text
docs/ADAPTER_SELECTION.md
```

Tabela:

```text
Ambiente | Persistência | Eventos
test     | memory       | capturing
local    | file         | console
lab      | memory       | console
```

A tabela não é código.

Ela documenta decisões.

---

### 35. Criar arquitetura test

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

### 36. Proteger driving e driven

```java
@ArchTest
static final ArchRule drivingMustNotDependOnDriven =
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

### 37. Proteger implementação

Adapters de saída devem implementar pelo menos um output port.

Adapters de entrada devem depender de pelo menos um input port.

Pode ser validado por ArchUnit ou inspeção customizada.

---

### 38. Criar error policy

Arquivo:

```text
contracts/error-policy.yaml
```

Conteúdo:

```yaml
errors:
  core:
    technologyAgnostic:
      required

  drivingAdapter:
    mapsToProtocol:
      required

  drivenAdapter:
    convertsTechnicalFailure:
      required

  technicalExceptionCrossingPort:
    forbidden
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
  portNamedAfterVendor:
    result:
      technology-leak

  inputPortReturningHTTPType:
    action:
      FAIL

  outputPortReturningDriverType:
    action:
      FAIL

  adapterWithoutContractTest:
    result:
      incomplete

  coreSelectingAdapter:
    action:
      FAIL

  drivingCallingDriven:
    action:
      FAIL
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
  coreToAdapterDependency:
    action:
      FAIL

  technicalExceptionAcrossPort:
    action:
      FAIL

  incompatibleAdapter:
    action:
      FAIL_CONTRACT

  unknownSelection:
    action:
      FAIL_STARTUP

  ModularMonolith:
    deferredToLesson615

  JavaModularization:
    deferredToLesson616
```

---

### 41. Executar testes

```powershell
.\scripts\m19\ports-orders-api\run-ports-orders-tests.ps1
```

Confirme:

- domain;
- services;
- input ports;
- output ports;
- REST;
- CLI;
- scheduler;
- memory;
- file;
- events;
- selection;
- architecture.

---

### 42. Executar contract tests

```powershell
.\scripts\m19\ports-orders-api\run-port-contract-tests.ps1
```

Relatório:

- adapters encontrados;
- contrato aplicado;
- testes passados;
- testes específicos;
- incompatibilidades.

---

### 43. Validar input ports

```powershell
.\scripts\m19\ports-orders-api\validate-input-ports.ps1
```

Procure:

- tipos HTTP;
- annotations Spring;
- nomes genéricos;
- métodos sem intenção;
- adapters concretos.

---

### 44. Validar output ports

```powershell
.\scripts\m19\ports-orders-api\validate-output-ports.ps1
```

Procure:

- nomes de vendor;
- tipos JDBC;
- tipos Kafka;
- `ObjectMapper`;
- detalhes de arquivo;
- exceptions técnicas.

---

### 45. Validar adapters

```powershell
.\scripts\m19\ports-orders-api\validate-driving-adapters.ps1

.\scripts\m19\ports-orders-api\validate-driven-adapters.ps1
```

Confirme responsabilidades e direção.

---

### 46. Validar seleção

```powershell
.\scripts\m19\ports-orders-api\validate-adapter-selection.ps1
```

Cenários:

- memory;
- file;
- desconhecido;
- adapter lab em profile proibido;
- dois beans conflitantes;
- propriedade ausente.

---

### 47. Executar smoke

```powershell
.\scripts\m19\ports-orders-api\run-ports-orders-smoke.ps1
```

Execute com profile memory.

Depois com profile file.

Compare o comportamento externo.

---

### 48. Criar reports

Exemplo:

```yaml
outputPorts:
  loadOrder:
    PASS

  saveOrder:
    PASS

  publishOrderEvent:
    PASS

  generateOrderId:
    PASS

  currentTime:
    PASS

  result:
    PASS
```

---

### 49. Criar gate

O gate valida:

```text
build;

input ports;

output ports;

driving adapters;

driven adapters;

multiple implementations;

selection;

contract tests;

architecture tests;

smoke memory;

smoke file;

errors;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_BUILD;

FAIL_INPUT_PORT;

FAIL_OUTPUT_PORT;

FAIL_DRIVING_ADAPTER;

FAIL_DRIVEN_ADAPTER;

FAIL_SELECTION;

FAIL_CONTRACT_TEST;

FAIL_ARCHITECTURE;

FAIL_SMOKE;

FAIL_DOCUMENTATION;

INCONCLUSIVE.
```

---

### 50. Coletar evidence

Arquivo:

```text
contracts/ports-and-adapters-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- input ports status;
- output ports status;
- REST adapter status;
- CLI adapter status;
- scheduler adapter status;
- memory adapter status;
- file adapter status;
- event adapters status;
- adapter selection status;
- contract tests status;
- architecture status;
- smoke memory status;
- smoke file status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- secrets;
- paths reais do usuário;
- payloads reais;
- conteúdo de monólito modular;
- conteúdo de JPMS.

---

### 51. Executar validação completa

```powershell
.\scripts\m19\ports-orders-api\validate-ports-and-adapters-contract.ps1

.\scripts\m19\ports-orders-api\run-ports-orders-tests.ps1

.\scripts\m19\ports-orders-api\validate-input-ports.ps1

.\scripts\m19\ports-orders-api\validate-output-ports.ps1

.\scripts\m19\ports-orders-api\validate-driving-adapters.ps1

.\scripts\m19\ports-orders-api\validate-driven-adapters.ps1

.\scripts\m19\ports-orders-api\validate-adapter-selection.ps1

.\scripts\m19\ports-orders-api\run-port-contract-tests.ps1

.\scripts\m19\ports-orders-api\run-ports-orders-smoke.ps1

.\scripts\m19\ports-orders-api\collect-ports-and-adapters-evidence.ps1

.\scripts\m19\ports-orders-api\verify-ports-and-adapters-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 52. Encerrar o laboratório

Confirme:

- aplicação encerrada;
- scheduler encerrado;
- arquivo temporário removido;
- nenhum processo residual;
- tests aprovados;
- contract tests aprovados;
- adapter selection validada;
- reports sanitizados;
- monólito modular não antecipado;
- modularização Java não antecipada.

---

## Entendendo o que foi feito

### Os ports ganharam intenção

Contratos deixaram de ter nomes genéricos ou tecnológicos.

### Os input ports ganharam coesão

Cada intenção passou a possuir um contrato claro.

### Os output ports ganharam linguagem do núcleo

Capacidades deixaram de mencionar vendor ou framework.

### Os driving adapters ganharam limite

REST, CLI e scheduler passaram a apenas converter e acionar.

### Os driven adapters ganharam contrato

Memória, arquivo e console passaram a implementar necessidades explícitas.

### A seleção ganhou lugar

A composition root passou a escolher implementações.

### Os contract tests ganharam reutilização

Múltiplos adapters passaram a obedecer ao mesmo comportamento.

### Os testes específicos ganharam contexto

Detalhes de arquivo permaneceram fora do contrato genérico.

### A substituição ganhou prova

Profiles diferentes usaram o mesmo núcleo.

### A próxima aula ganhou fronteira

Monólito modular fica para a aula 615.

---

## Erros comuns importantes

### Nomear port com tecnologia

O núcleo fica acoplado à solução atual.

### Criar port genérico demais

A intenção desaparece.

### Colocar `ResponseEntity` no input port

HTTP invade o núcleo.

### Colocar `ResultSet` no output port

Driver invade o contrato.

### Selecionar adapter dentro do service

A composition root perde função.

### Driving adapter chamar driven adapter

O caso de uso é ignorado.

### Adapter implementar regra de negócio

O detalhe redefine a política.

### Usar apenas teste específico

Adapters diferentes podem divergir no comportamento comum.

### Forçar todos os detalhes no contract test

O contrato deixa de ser reutilizável.

### Antecipar monólito modular

O foco passa de integração para organização de domínios.

---

## Comandos úteis

### Executar testes

```powershell
.\scripts\m19\ports-orders-api\run-ports-orders-tests.ps1
```

### Validar ports

```powershell
.\scripts\m19\ports-orders-api\validate-input-ports.ps1

.\scripts\m19\ports-orders-api\validate-output-ports.ps1
```

### Executar contract tests

```powershell
.\scripts\m19\ports-orders-api\run-port-contract-tests.ps1
```

### Executar smoke

```powershell
.\scripts\m19\ports-orders-api\run-ports-orders-smoke.ps1
```

### Verificar gate

```powershell
.\scripts\m19\ports-orders-api\verify-ports-and-adapters-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Input ports

Modele intenções da aplicação.

### Parte 2 — Output ports

Modele capacidades externas.

### Parte 3 — Driving adapters

Implemente REST, CLI e scheduler.

### Parte 4 — Driven adapters

Implemente memória, arquivo e eventos.

### Parte 5 — Selection

Escolha adapters na composição.

### Parte 6 — Contract tests

Crie contrato compartilhado de persistência.

### Parte 7 — Adapter tests

Teste detalhes específicos.

### Parte 8 — Architecture tests

Proteja direção e dependências.

### Parte 9 — Smoke

Execute profiles diferentes.

### Parte 10 — Gate

Valide contratos, adapters e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 613 e ponte para a aula 615 foram preservadas;
- input ports representam intenções;
- output ports representam capacidades;
- ports pertencem ao núcleo;
- input ports não usam tipos HTTP;
- output ports não usam tipos de vendor ou driver;
- services implementam input ports;
- driven adapters implementam output ports;
- REST, CLI e scheduler são driving adapters;
- driving adapters não acessam driven adapters diretamente;
- adapters não implementam regras de negócio;
- `InMemoryOrderAdapter` e `FileOrderAdapter` obedecem ao mesmo contrato;
- adapter de arquivo usa modelo técnico separado;
- `ConsoleOrderEventAdapter` e capturing adapter implementam o mesmo port;
- adapter selection ocorre na composition root;
- adapter desconhecido falha no startup;
- adapter de laboratório não é permitido em profile inadequado;
- contract tests são aplicados a todas as implementações relevantes;
- testes específicos validam detalhes de cada adapter;
- architecture tests protegem core, ports e adapters;
- smoke foi executado com memory e file;
- technical exceptions não atravessam ports;
- documentação de nomenclatura, seleção, contratos e fluxo foi criada;
- reports, gate e evidence foram criados;
- nenhum dado sensível ou path pessoal foi incluído;
- monólito modular e modularização Java não foram antecipados;
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
  labs/m19/aula-614-ports-and-adapters/ports-orders-api `
  scripts/m19/ports-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReferenceReal|userHomePath|modularMonolith|module-info.java|boundedContext"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): aprofundar ports and adapters"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- paths locais reais;
- banco de produção;
- mensageria real;
- monólito modular;
- JPMS;
- DDD;
- sistemas distribuídos.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Ports and Adapters.

Você criou:

```text
input ports;

output ports;

driving adapters;

driven adapters;

adapter de memória;

adapter de arquivo;

adapter de evento;

seleção por configuração;

contract tests;

architecture tests;

smokes por profile.
```

Você comprovou que ports devem usar a linguagem do núcleo; que input ports representam intenções; que output ports representam capacidades; que adapters traduzem mecanismos; que a composition root seleciona implementações; que adapters diferentes podem obedecer ao mesmo contrato; que contract tests validam substituibilidade; e que detalhes específicos continuam em testes próprios.

A próxima aula será:

```text
615 - M19.05 - Monolito modular
```

Nela, você irá estudar como organizar uma aplicação única em módulos de negócio com fronteiras explícitas, dependências controladas e comunicação interna disciplinada.

Nenhum módulo de negócio, boundary modular, evento entre módulos ou preparação de extração de microservice foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Nomeei ports pela intenção e capacidade.
- [ ] Separei input e output ports.
- [ ] Implementei driving adapters.
- [ ] Implementei driven adapters.
- [ ] Criei múltiplas implementações.
- [ ] Selecionei adapters na composição.
- [ ] Criei contract tests.
- [ ] Protegi a arquitetura com gates.

---

## Troubleshooting adicional

### Port precisa de `ResponseEntity`

Mova o tipo para o adapter web.

### Port precisa de `KafkaTemplate`

Modele a capacidade de publicação.

### File adapter falha no teste

Revise diretório temporário, charset, mapping e cleanup.

### Dois adapters criam conflito de bean

Revise profile, conditions e composition root.

### Contract test passa em memória e falha em arquivo

O adapter de arquivo não cumpre o comportamento comum.

### Scheduler acessa repository

Faça o scheduler chamar um input port.

### Technical exception chega ao service

Converta no driven adapter.

### Port possui muitos métodos sem relação

Divida por intenção ou capacidade.

### Contract test contém asserts de arquivo

Mova detalhes técnicos para teste específico.

### O projeto começou a criar módulos de negócio

Reserve o conteúdo para a aula 615.

---

## Perguntas de revisão

1. O que é um port?
2. O que é input port?
3. O que é output port?
4. O que é driving adapter?
5. O que é driven adapter?
6. Quem define os ports?
7. Quem implementa input ports?
8. Quem implementa output ports?
9. Por que port não deve ter nome de vendor?
10. Por que input port não deve retornar HTTP?
11. O que é composition root?
12. Onde selecionar adapter?
13. O que é contract test?
14. Por que aplicar o mesmo contract test?
15. O que fica em teste específico?
16. Por que driving não chama driven diretamente?
17. O que prova substituibilidade?
18. Qual risco de ports genéricos?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Contrato do núcleo.
2. Intenção oferecida pela aplicação.
3. Capacidade externa necessária.
4. Mecanismo que inicia interação.
5. Mecanismo acionado pelo núcleo.
6. O núcleo.
7. Services ou interactors.
8. Adapters externos.
9. Evitar vazamento tecnológico.
10. Preservar independência do protocolo.
11. Local de composição.
12. Fora do núcleo.
13. Teste comum de compatibilidade.
14. Garantir comportamento equivalente.
15. Detalhes específicos da tecnologia.
16. Preservar a coordenação do caso de uso.
17. Mesmo núcleo com adapters diferentes.
18. Perda de intenção e coesão.
19. Monolito modular.
20. Monolito modular.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 614 - M19.04 - Ports and Adapters

- Criei o laboratório `ports-orders-api`.
- Formalizei input ports por intenção.
- Formalizei output ports por capacidade.
- Mantive ports sem tipos HTTP, drivers ou vendors.
- Implementei services como input ports.
- Criei REST, CLI e scheduler como driving adapters.
- Criei memória e arquivo como driven adapters.
- Criei adapters de evento em console e captura.
- Mantive regras de negócio no núcleo.
- Selecionei adapters na composition root.
- Criei profiles para memória e arquivo.
- Implementei contract tests de persistência.
- Apliquei o mesmo contrato aos adapters.
- Separei testes específicos de tecnologia.
- Protegi direção e dependências com ArchUnit.
- Executei smoke com múltiplas implementações.
- Criei reports, gate e evidence.
- Não antecipei monólito modular ou modularização Java.
- Próxima aula: Monólito modular.
```

---

## Referência técnica curta

- Ports and Adapters.
- Input ports.
- Output ports.
- Driving adapters.
- Driven adapters.
- Composition root.
- Adapter selection.
- Contract testing.
- Substitutability.
- Architecture tests.

Regra final:

```text
Ports and Adapters precisa transformar fronteiras em contratos explícitos: input ports pertencem ao núcleo e representam intenções como criar, consultar, confirmar e cancelar, output ports pertencem ao núcleo e representam capacidades como carregar, salvar, publicar, gerar identidade e obter tempo, e nenhum port usa `ResponseEntity`, driver, framework ou nome de vendor; services implementam input ports, REST, CLI e scheduler atuam como driving adapters, memória, arquivo, eventos, identidade e relógio atuam como driven adapters, driving adapters não acessam driven adapters diretamente, adapters não decidem regras de negócio e technical exceptions são convertidas antes de atravessar o port; a composition root seleciona implementações por ambiente, adapters desconhecidos falham cedo, contract tests são aplicados a todas as implementações compatíveis e testes específicos validam detalhes técnicos, enquanto ArchUnit protege a direção; o gate termina com ports, adapters, seleção, contratos, smokes, documentação e evidence aprovados, e monólito modular começa somente na aula 615, com modularização Java reservada à aula 616.
```
