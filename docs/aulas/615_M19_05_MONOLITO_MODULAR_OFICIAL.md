# 615 - M19.05 - Monolito modular

## Apresentação da aula

Na aula 614, você aprofundou Ports and Adapters.

Você aprendeu a separar:

```text
input ports;

output ports;

driving adapters;

driven adapters;

composition root;

contract tests.
```

Essa organização resolveu um problema importante:

```text
como impedir
que HTTP,
banco,
arquivo,
mensageria
ou framework

definam
as políticas centrais
da aplicação?
```

Agora surge um novo problema.

Mesmo com ports e adapters corretos, uma aplicação pode crescer até se tornar um bloco único e difícil de evoluir.

Exemplo:

```text
orders;

payments;

inventory;

customers;

notifications;

billing;

shipping.
```

Se tudo permanecer dentro de um único conjunto de packages sem fronteiras claras, o projeto pode apresentar:

- chamadas diretas entre qualquer parte;
- repositories usados por vários domínios;
- services gigantes;
- transações atravessando responsabilidades;
- entidades compartilhadas;
- tabelas acessadas por qualquer módulo;
- eventos internos inexistentes;
- testes que precisam subir a aplicação inteira;
- mudanças pequenas com impacto amplo;
- dificuldade para dividir equipes;
- dificuldade para extrair serviços no futuro;
- arquitetura conhecida apenas por convenção oral.

Esse tipo de aplicação é frequentemente chamado de:

```text
monólito acoplado;

big ball of mud;

monólito distribuído internamente.
```

O problema não é ser monólito.

O problema é ser um monólito sem limites.

Um monólito modular continua sendo uma única aplicação implantável.

Ele pode ter:

- um único processo;
- um único artifact;
- um único deploy;
- um único banco;
- uma única pipeline.

Mas internamente ele é dividido em módulos com responsabilidades de negócio explícitas.

A pergunta central desta aula será:

```text
como organizar
uma aplicação única

em módulos de negócio
com fronteiras claras,

sem criar
microservices prematuros?
```

O laboratório será:

```text
labs/m19/aula-615-monolito-modular/modular-commerce-api
```

A aplicação terá três módulos didáticos:

```text
orders;

inventory;

notifications.
```

O módulo `orders` será responsável por:

- criar pedidos;
- confirmar pedidos;
- cancelar pedidos;
- consultar pedidos;
- publicar eventos internos do módulo.

O módulo `inventory` será responsável por:

- registrar disponibilidade;
- reservar estoque;
- liberar estoque;
- consultar reserva.

O módulo `notifications` será responsável por:

- receber eventos internos aprovados;
- registrar notificações sintéticas;
- manter histórico de envios de laboratório.

A comunicação será controlada.

O módulo `orders` não acessará diretamente:

```text
InventoryRepository;

InventoryEntity;

NotificationRepository;

classes internas
dos outros módulos.
```

Ele utilizará contratos públicos.

Exemplos:

```text
InventoryModuleApi;

NotificationModuleApi;

OrderCreatedModuleEvent;

OrderConfirmedModuleEvent.
```

Você irá diferenciar:

```text
API pública do módulo;

implementação interna;

eventos publicados;

detalhes privados;

dependências permitidas;

dependências proibidas.
```

O laboratório continuará sendo uma única aplicação Spring Boot.

O foco será:

- package by module;
- API interna explícita;
- classes internas protegidas;
- eventos entre módulos;
- testes de integração modular;
- testes de arquitetura;
- ciclos proibidos;
- banco compartilhado com ownership lógico;
- transações delimitadas;
- documentação de dependências;
- gates de modularidade.

A próxima aula oficial será:

```text
616 - M19.06 - Modularizacao em Java
```

Na aula 616, você irá aprofundar mecanismos de modularização oferecidos pelo ecossistema Java.

Por isso, esta aula não irá implementar ainda:

- `module-info.java`;
- Java Platform Module System;
- `requires`;
- `exports`;
- `opens`;
- módulos Maven separados;
- classpath versus module path;
- automatic modules;
- split packages;
- encapsulamento em runtime por JPMS.

Esses assuntos pertencem à aula 616.

Também não será iniciado formalmente:

```text
DDD fundamentos.
```

Esse tema pertence à aula 617.

A regra central desta aula será:

```text
um monólito modular
é uma aplicação única

com múltiplos módulos
internamente protegidos

por APIs,
eventos,
dependências
e testes.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
613:
Arquitetura Hexagonal.

614:
Ports and Adapters.

615:
Monolito modular.

616:
Modularizacao em Java.

617:
DDD fundamentos.
```

A progressão é:

```text
separar núcleo e bordas;

formalizar ports e adapters;

organizar responsabilidades em módulos;

reforçar encapsulamento no Java;

aprofundar modelagem de domínio.
```

Nesta aula:

```text
package by module:
sim.

API pública de módulo:
sim.

implementação interna:
sim.

eventos internos:
sim.

dependências entre módulos:
sim.

ciclos:
proibidos.

banco compartilhado:
sim,
com ownership lógico.

transações modulares:
sim.

testes arquiteturais:
sim.

Spring Modulith:
uso opcional e introdutório.

JPMS:
não.

DDD formal:
não.

microservices:
não.
```

O projeto será novo.

Ele não substituirá os laboratórios anteriores.

Ele utilizará os princípios já aprendidos:

- dependency direction;
- boundaries;
- ports;
- adapters;
- composition;
- testabilidade;
- contratos.

---

## Objetivo prático

A estrutura será:

```text
labs/m19/aula-615-monolito-modular/modular-commerce-api
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/modularcommerce
│   │   │       ├── ModularCommerceApplication.java
│   │   │       ├── orders
│   │   │       │   ├── OrderModuleApi.java
│   │   │       │   ├── OrderCreatedModuleEvent.java
│   │   │       │   ├── OrderConfirmedModuleEvent.java
│   │   │       │   ├── OrderCancelledModuleEvent.java
│   │   │       │   └── internal
│   │   │       │       ├── application
│   │   │       │       │   ├── CreateOrderService.java
│   │   │       │       │   ├── ConfirmOrderService.java
│   │   │       │       │   └── CancelOrderService.java
│   │   │       │       ├── domain
│   │   │       │       │   ├── Order.java
│   │   │       │       │   ├── OrderId.java
│   │   │       │       │   ├── OrderItem.java
│   │   │       │       │   └── OrderStatus.java
│   │   │       │       ├── persistence
│   │   │       │       │   ├── OrderRecord.java
│   │   │       │       │   ├── OrderRepository.java
│   │   │       │       │   └── InMemoryOrderRepository.java
│   │   │       │       └── web
│   │   │       │           └── OrderController.java
│   │   │       ├── inventory
│   │   │       │   ├── InventoryModuleApi.java
│   │   │       │   ├── InventoryReservationResult.java
│   │   │       │   └── internal
│   │   │       │       ├── application
│   │   │       │       │   ├── ReserveInventoryService.java
│   │   │       │       │   └── ReleaseInventoryService.java
│   │   │       │       ├── domain
│   │   │       │       │   ├── InventoryItem.java
│   │   │       │       │   └── InventoryReservation.java
│   │   │       │       └── persistence
│   │   │       │           ├── InventoryRepository.java
│   │   │       │           └── InMemoryInventoryRepository.java
│   │   │       ├── notifications
│   │   │       │   ├── NotificationModuleApi.java
│   │   │       │   └── internal
│   │   │       │       ├── application
│   │   │       │       │   └── RegisterNotificationService.java
│   │   │       │       ├── listener
│   │   │       │       │   └── OrderModuleEventListener.java
│   │   │       │       └── persistence
│   │   │       │           ├── NotificationRepository.java
│   │   │       │           └── InMemoryNotificationRepository.java
│   │   │       └── shared
│   │   │           ├── ModuleEventPublisher.java
│   │   │           ├── ModuleClock.java
│   │   │           └── ModuleIdGenerator.java
│   │   └── resources
│   │       └── application.yml
│   └── test
│       └── java
│           └── br/com/formacao/modularcommerce
│               ├── architecture
│               │   ├── ModularBoundaryTest.java
│               │   ├── ModuleCycleTest.java
│               │   └── InternalPackageVisibilityTest.java
│               ├── orders
│               │   ├── OrderModuleTest.java
│               │   └── OrderControllerTest.java
│               ├── inventory
│               │   └── InventoryModuleTest.java
│               ├── notifications
│               │   └── NotificationModuleTest.java
│               └── integration
│                   └── OrderInventoryNotificationFlowTest.java
├── contracts
│   ├── modular-monolith-contract.yaml
│   ├── module-boundary-policy.yaml
│   ├── public-api-policy.yaml
│   ├── internal-package-policy.yaml
│   ├── module-dependency-policy.yaml
│   ├── module-event-policy.yaml
│   ├── transaction-policy.yaml
│   ├── shared-kernel-policy.yaml
│   ├── data-ownership-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── docs
│   ├── MODULAR_MONOLITH_OVERVIEW.md
│   ├── MODULE_CATALOG.md
│   ├── MODULE_DEPENDENCIES.md
│   ├── MODULE_APIS.md
│   ├── MODULE_EVENTS.md
│   ├── DATA_OWNERSHIP.md
│   ├── TRANSACTION_BOUNDARIES.md
│   ├── TEST_STRATEGY.md
│   └── TROUBLESHOOTING.md
└── reports
    ├── module-boundary-report.yaml
    ├── module-cycle-report.yaml
    ├── module-api-report.yaml
    ├── module-event-report.yaml
    ├── data-ownership-report.yaml
    ├── transaction-report.yaml
    └── modular-monolith-gate-report.yaml
```

Scripts:

```text
scripts/m19/modular-commerce-api
├── validate-modular-monolith-contract.ps1
├── run-modular-commerce-tests.ps1
├── validate-module-boundaries.ps1
├── validate-module-public-apis.ps1
├── validate-module-internals.ps1
├── validate-module-dependencies.ps1
├── validate-module-cycles.ps1
├── validate-module-events.ps1
├── validate-module-data-ownership.ps1
├── run-modular-commerce-smoke.ps1
├── collect-modular-monolith-evidence.ps1
└── verify-modular-monolith-gate.ps1
```

Ao final, você terá uma aplicação única dividida em módulos de negócio com dependências controladas.

---

## Conceito essencial

### Monólito

Aplicação implantada como uma única unidade.

---

### Monólito modular

Monólito internamente dividido em módulos independentes e explicitamente relacionados.

---

### Módulo de negócio

Unidade que concentra uma responsabilidade de negócio, sua API e sua implementação.

---

### API pública do módulo

Conjunto de tipos que outros módulos podem usar.

---

### Internal package

Área privada que não deve ser acessada por outros módulos.

---

### Module dependency

Relação explícita entre dois módulos.

---

### Cyclic dependency

Situação em que módulos dependem uns dos outros formando um ciclo.

---

### Module event

Evento usado para comunicar algo ocorrido em um módulo.

---

### Data ownership

Responsabilidade de um módulo sobre seus dados.

---

### Transaction boundary

Limite no qual uma operação é executada de forma atômica.

---

### Shared kernel

Pequeno conjunto de tipos realmente compartilhados.

---

### Package by module

Organização do código por responsabilidade de negócio, e não apenas por camada técnica.

---

### Modular boundary test

Teste que valida regras entre módulos.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-615-monolito-modular/modular-commerce-api

Set-Location `
  labs/m19/aula-615-monolito-modular/modular-commerce-api
```

---

### 2. Criar o projeto

Use:

- Java 21;
- Maven;
- Spring Boot;
- Spring Web;
- Validation;
- Spring Boot Test;
- ArchUnit.

Spring Modulith pode ser incluído como ferramenta opcional de verificação, sem substituir os conceitos.

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/modular-monolith-contract.yaml
```

Conteúdo:

```yaml
modularMonolith:
  required:
    - business-modules
    - public-module-APIs
    - internal-packages
    - dependency-rules
    - no-cycles
    - module-events
    - data-ownership
    - transaction-boundaries
    - architecture-tests

  deployment:
    singleUnit:
      true

  directInternalAccess:
    forbidden

  nextLesson:
    code:
      M19.06
```

---

### 4. Definir módulos

Catálogo inicial:

```text
orders:
gerencia ciclo de vida do pedido.

inventory:
gerencia disponibilidade e reservas.

notifications:
registra notificações do laboratório.
```

Não crie módulo por tabela.

Não crie módulo por package técnico.

O módulo representa uma capacidade de negócio.

---

### 5. Criar catálogo

Arquivo:

```text
docs/MODULE_CATALOG.md
```

Para cada módulo:

```markdown
## orders

- Responsabilidade:
- API pública:
- Eventos publicados:
- Eventos consumidos:
- Dados próprios:
- Dependências permitidas:
- Dependências proibidas:
- Owner:
```

---

### 6. Criar policy de boundary

Arquivo:

```text
contracts/module-boundary-policy.yaml
```

Conteúdo:

```yaml
boundaries:
  module:
    contains:
      - public-api
      - internal-implementation
      - owned-data
      - tests

  externalModule:
    mayAccess:
      - public-api
      - published-event

  externalModule:
    mustNotAccess:
      - internal
      - repository
      - entity
      - technical-model
```

---

### 7. Definir packages públicos

Exemplo:

```text
br.com.formacao.modularcommerce.orders
```

Nesse package raiz ficam apenas:

- `OrderModuleApi`;
- commands públicos necessários;
- results públicos necessários;
- module events publicados.

Implementação fica em:

```text
br.com.formacao.modularcommerce.orders.internal
```

---

### 8. Criar API do módulo orders

```java
public interface OrderModuleApi {

    OrderSummary create(
            CreateOrderRequest request);

    OrderSummary find(
            UUID orderId);

    OrderSummary confirm(
            UUID orderId);

    OrderSummary cancel(
            UUID orderId);
}
```

Essa API é interna à aplicação, mas pública para os outros módulos.

Ela não é a API HTTP.

---

### 9. Criar request público do módulo

```java
public record CreateOrderRequest(
        List<CreateOrderItemRequest> items) {
}
```

Use apenas campos necessários.

Não exponha entities internas.

---

### 10. Criar summary público

```java
public record OrderSummary(
        UUID id,
        String status,
        BigDecimal total,
        Instant createdAt) {
}
```

Esse tipo pode ser usado por adapters e módulos autorizados.

---

### 11. Implementar internamente

```java
final class DefaultOrderModuleApi
        implements OrderModuleApi {

    private final CreateOrderService createOrder;
    private final FindOrderService findOrder;
    private final ConfirmOrderService confirmOrder;
    private final CancelOrderService cancelOrder;

    @Override
    public OrderSummary create(
            CreateOrderRequest request) {

        return createOrder.execute(request);
    }
}
```

A implementação pode permanecer package-private quando possível.

---

### 12. Criar public API policy

Arquivo:

```text
contracts/public-api-policy.yaml
```

Conteúdo:

```yaml
publicApi:
  mustBe:
    - stable
    - minimal
    - technology-agnostic
    - documented

  mustNotExpose:
    - entity
    - repository
    - HTTP-type
    - persistence-record
    - framework-exception

  compatibility:
    considered:
      required
```

---

### 13. Criar internal policy

Arquivo:

```text
contracts/internal-package-policy.yaml
```

Conteúdo:

```yaml
internal:
  path:
    contains:
      internal

  accessFromOtherModules:
    forbidden

  mayContain:
    - domain
    - application
    - persistence
    - web
    - configuration

  exportedType:
    forbiddenByDefault
```

---

### 14. Criar API de inventory

```java
public interface InventoryModuleApi {

    InventoryReservationResult reserve(
            UUID orderId,
            List<InventoryRequestItem> items);

    void release(
            UUID orderId);
}
```

O módulo `orders` pode depender dessa API.

Ele não depende do repository de inventory.

---

### 15. Criar resultado de reserva

```java
public record InventoryReservationResult(
        UUID orderId,
        boolean reserved,
        List<String> unavailableProducts) {
}
```

O resultado expressa o contrato de negócio necessário.

---

### 16. Integrar order e inventory

No fluxo de confirmação:

```text
orders carrega pedido;

orders solicita reserva
via `InventoryModuleApi`;

inventory responde;

orders confirma ou rejeita;

orders publica evento.
```

O módulo de pedidos continua dono da decisão de confirmar o pedido.

O módulo de estoque continua dono da decisão de disponibilidade.

---

### 17. Evitar acesso direto

Proibido:

```java
inventoryRepository.reserve(...);
```

dentro de `orders`.

Permitido:

```java
inventoryModuleApi.reserve(...);
```

---

### 18. Criar dependency policy

Arquivo:

```text
contracts/module-dependency-policy.yaml
```

Conteúdo:

```yaml
dependencies:
  orders:
    mayDependOn:
      - inventory-public-api
      - shared-minimal

  inventory:
    mayDependOn:
      - shared-minimal

  notifications:
    mayDependOn:
      - published-module-events
      - shared-minimal

  forbidden:
    - orders-to-inventory-internal
    - inventory-to-orders-internal
    - notifications-to-order-repository
    - cyclic-dependency
```

---

### 19. Criar grafo permitido

```text
orders ---> inventory

orders ---> module events ---> notifications
```

Evite:

```text
orders ---> inventory
   ^          |
   |__________|
```

Se inventory precisa de informação de orders, avalie:

- evento;
- request explícito;
- serviço coordenador;
- revisão da responsabilidade.

---

### 20. Criar cycle test

Use ArchUnit.

Exemplo:

```java
@ArchTest
static final ArchRule modulesMustBeFreeOfCycles =
        slices()
                .matching(
                        "br.com.formacao.modularcommerce.(*)..")
                .should()
                .beFreeOfCycles();
```

Ajuste o pattern para considerar apenas módulos reais.

---

### 21. Criar boundary test

```java
@ArchTest
static final ArchRule ordersMustNotAccessInventoryInternals =
        noClasses()
                .that()
                .resideInAPackage(
                        "..orders..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..inventory.internal..");
```

Repita para os módulos relevantes.

---

### 22. Criar module events

```java
public record OrderConfirmedModuleEvent(
        UUID orderId,
        Instant occurredAt) {
}
```

Evento contém apenas informação necessária.

Evite publicar a entity inteira.

---

### 23. Criar event publisher

No shared mínimo:

```java
public interface ModuleEventPublisher {

    void publish(
            Object event);
}
```

Uma implementação Spring pode usar:

```text
ApplicationEventPublisher.
```

O evento continua pertencendo ao módulo publicador.

---

### 24. Publicar evento

```java
moduleEventPublisher.publish(
        new OrderConfirmedModuleEvent(
                order.id().value(),
                clock.instant()));
```

A publicação ocorre após a decisão de negócio.

---

### 25. Criar listener

```java
@Component
final class OrderModuleEventListener {

    private final RegisterNotificationService
            registerNotification;

    @EventListener
    void on(
            OrderConfirmedModuleEvent event) {

        registerNotification.register(
                "ORDER_CONFIRMED",
                event.orderId(),
                event.occurredAt());
    }
}
```

O listener fica em `notifications.internal`.

---

### 26. Criar event policy

Arquivo:

```text
contracts/module-event-policy.yaml
```

Conteúdo:

```yaml
moduleEvent:
  ownedBy:
    publishing-module

  contains:
    minimal-data:
      required

  entityPayload:
    forbidden

  consumerInternalAccess:
    forbidden

  synchronousByDefault:
    documented:
      required

  failureBehavior:
    explicit:
      required
```

---

### 27. Entender evento síncrono

Com `ApplicationEventPublisher`, listeners podem executar na mesma thread.

Consequências:

- falha do listener pode afetar a operação;
- transação pode ser compartilhada;
- latência aumenta;
- ordem importa;
- rollback pode alcançar mais partes.

Documente a semântica.

Nesta aula, mantenha a implementação simples e explícita.

---

### 28. Criar transaction policy

Arquivo:

```text
contracts/transaction-policy.yaml
```

Conteúdo:

```yaml
transactions:
  module:
    owns:
      its-write-boundary:
        required

  crossModule:
    default:
      avoid

  synchronousEvent:
    semantics:
      documented

  listenerFailure:
    behavior:
      explicit

  distributedTransaction:
    outOfScope
```

---

### 29. Delimitar transação

O módulo `orders` não deve abrir transação e manipular repositories privados dos outros módulos.

Opções:

- chamar APIs modulares;
- usar eventos;
- aceitar consistência eventual em cenários futuros;
- criar coordinator explícito quando necessário.

Nesta aula, use APIs síncronas para reserva e evento para notificação.

---

### 30. Definir data ownership

`orders` é dono de:

```text
orders;

order items;

order status.
```

`inventory` é dono de:

```text
stock;

reservations.
```

`notifications` é dono de:

```text
notification records;

delivery status do laboratório.
```

---

### 31. Criar data ownership policy

Arquivo:

```text
contracts/data-ownership-policy.yaml
```

Conteúdo:

```yaml
dataOwnership:
  orders:
    owns:
      - order
      - order-item

  inventory:
    owns:
      - inventory-item
      - inventory-reservation

  notifications:
    owns:
      - notification-record

  directTableAccessAcrossModules:
    forbidden

  sharedDatabase:
    allowedWithLogicalOwnership:
      true
```

---

### 32. Entender banco compartilhado

Monólito modular pode usar um banco único.

Mas isso não autoriza:

- qualquer módulo consultar qualquer tabela;
- joins arbitrários entre módulos;
- foreign keys sem avaliação;
- repository compartilhado;
- migrations sem owner.

Ownership lógico precisa ser preservado.

---

### 33. Criar shared kernel policy

Arquivo:

```text
contracts/shared-kernel-policy.yaml
```

Conteúdo:

```yaml
sharedKernel:
  allowed:
    - ModuleEventPublisher
    - ModuleClock
    - ModuleIdGenerator

  forbidden:
    - shared-domain-entity
    - generic-repository
    - global-service
    - universal-DTO

  growth:
    requiresReview:
      true
```

---

### 34. Evitar pasta shared gigante

Sinais de problema:

```text
shared/service;

shared/repository;

shared/entity;

shared/util;

shared/model;

shared/dto.
```

Esses packages podem esconder responsabilidades mal definidas.

---

### 35. Criar controller dentro do módulo

`OrderController` pode ficar em:

```text
orders.internal.web
```

Ele chama `OrderModuleApi`.

O controller pertence ao adapter de entrada do módulo.

---

### 36. Não criar controller global

Evite:

```text
controllers
services
repositories
entities
```

na raiz da aplicação.

Isso volta ao package by layer global.

---

### 37. Criar teste de orders

Valide:

- criação;
- confirmação;
- cancelamento;
- interação com API de inventory;
- eventos publicados;
- ausência de acesso interno.

Use fake de `InventoryModuleApi`.

---

### 38. Criar teste de inventory

Valide:

- estoque disponível;
- estoque insuficiente;
- reserva idempotente conforme contrato;
- liberação;
- dados próprios.

---

### 39. Criar teste de notifications

Valide:

- evento recebido;
- registro criado;
- ausência de acesso ao order repository;
- falha tratada conforme política.

---

### 40. Criar teste integrado

Fluxo:

```text
criar pedido;

confirmar pedido;

reservar estoque;

publicar evento;

registrar notificação;

consultar resultados.
```

O teste sobe a aplicação completa.

Mas os testes dos módulos continuam isolados quando possível.

---

### 41. Criar architecture tests

Regras:

- modules sem ciclos;
- internals inacessíveis;
- APIs públicas mínimas;
- shared restrito;
- repositories privados;
- events públicos;
- controllers dentro do módulo;
- nenhuma dependência de JPMS.

---

### 42. Usar Spring Modulith opcionalmente

Pode incluir:

```text
ApplicationModules.of(ModularCommerceApplication.class)
```

E validar:

```java
@Test
void shouldVerifyApplicationModules() {

    ApplicationModules
            .of(
                    ModularCommerceApplication.class)
            .verify();
}
```

Use como ferramenta de apoio.

Não deixe a compreensão depender apenas da biblioteca.

---

### 43. Criar documentation test

Gere ou mantenha manualmente:

```text
MODULE_DEPENDENCIES.md
```

O documento deve corresponder ao grafo validado.

---

### 44. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  externalModuleUsingInternalType:
    action:
      FAIL

  moduleCycle:
    action:
      FAIL

  publicApiExposingEntity:
    result:
      boundary-leak

  sharedPackageGrowth:
    result:
      review-required

  directRepositoryAccess:
    action:
      FAIL

  undocumentedDependency:
    result:
      incomplete
```

---

### 45. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  moduleCycle:
    action:
      FAIL

  internalAccess:
    action:
      FAIL

  crossModuleRepository:
    action:
      FAIL

  entityPublishedAsEvent:
    action:
      FAIL

  sharedKernelWithDomainEntity:
    action:
      FAIL

  JPMS:
    deferredToLesson616

  DDD:
    deferredToLesson617
```

---

### 46. Executar testes

```powershell
.\scripts\m19\modular-commerce-api\run-modular-commerce-tests.ps1
```

Confirme:

- modules;
- APIs;
- internals;
- events;
- transactions;
- integration;
- architecture.

---

### 47. Validar boundaries

```powershell
.\scripts\m19\modular-commerce-api\validate-module-boundaries.ps1
```

Procure imports entre internals.

---

### 48. Validar APIs públicas

```powershell
.\scripts\m19\modular-commerce-api\validate-module-public-apis.ps1
```

Confirme:

- minimalidade;
- estabilidade;
- ausência de entity;
- ausência de repository;
- ausência de framework.

---

### 49. Validar internals

```powershell
.\scripts\m19\modular-commerce-api\validate-module-internals.ps1
```

Procure classes públicas sem necessidade.

---

### 50. Validar dependências e ciclos

```powershell
.\scripts\m19\modular-commerce-api\validate-module-dependencies.ps1

.\scripts\m19\modular-commerce-api\validate-module-cycles.ps1
```

O resultado precisa listar:

- módulo origem;
- módulo destino;
- tipo de dependência;
- justificativa;
- ciclo detectado.

---

### 51. Validar eventos

```powershell
.\scripts\m19\modular-commerce-api\validate-module-events.ps1
```

Confirme:

- owner;
- payload mínimo;
- listener;
- sem entity;
- sem internal type;
- sem dados sensíveis;
- sem falha silenciosa.

---

### 52. Validar data ownership

```powershell
.\scripts\m19\modular-commerce-api\validate-module-data-ownership.ps1
```

Procure:

- repositories usados fora do módulo;
- records públicos;
- consultas cruzadas;
- shared repository;
- migration sem owner.

---

### 53. Executar smoke

```powershell
.\scripts\m19\modular-commerce-api\run-modular-commerce-smoke.ps1
```

Fluxo:

1. registrar estoque sintético;
2. criar pedido;
3. confirmar pedido;
4. validar reserva;
5. validar notificação;
6. cancelar segundo pedido;
7. validar liberação quando aplicável.

---

### 54. Criar reports

Exemplo:

```yaml
moduleBoundaries:
  orders:
    PASS

  inventory:
    PASS

  notifications:
    PASS

  internalAccessViolations:
    0

  result:
    PASS
```

---

### 55. Criar gate

O gate valida:

```text
build;

module catalog;

public APIs;

internals;

dependencies;

cycles;

events;

transactions;

data ownership;

shared kernel;

tests;

smoke;

documentation;

evidence.
```

Status:

```text
PASS;

FAIL_BUILD;

FAIL_MODULE_API;

FAIL_INTERNAL_ACCESS;

FAIL_DEPENDENCY;

FAIL_CYCLE;

FAIL_EVENT;

FAIL_TRANSACTION;

FAIL_DATA_OWNERSHIP;

FAIL_SHARED_KERNEL;

FAIL_TEST;

FAIL_DOCUMENTATION;

INCONCLUSIVE.
```

---

### 56. Coletar evidence

Arquivo:

```text
contracts/modular-monolith-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- orders module status;
- inventory module status;
- notifications module status;
- public API status;
- internal visibility status;
- dependency status;
- cycle status;
- event status;
- transaction status;
- data ownership status;
- shared kernel status;
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
- `module-info.java`;
- DDD formal;
- conteúdo da aula 616;
- conteúdo da aula 617.

---

### 57. Executar validação completa

```powershell
.\scripts\m19\modular-commerce-api\validate-modular-monolith-contract.ps1

.\scripts\m19\modular-commerce-api\run-modular-commerce-tests.ps1

.\scripts\m19\modular-commerce-api\validate-module-boundaries.ps1

.\scripts\m19\modular-commerce-api\validate-module-public-apis.ps1

.\scripts\m19\modular-commerce-api\validate-module-internals.ps1

.\scripts\m19\modular-commerce-api\validate-module-dependencies.ps1

.\scripts\m19\modular-commerce-api\validate-module-cycles.ps1

.\scripts\m19\modular-commerce-api\validate-module-events.ps1

.\scripts\m19\modular-commerce-api\validate-module-data-ownership.ps1

.\scripts\m19\modular-commerce-api\run-modular-commerce-smoke.ps1

.\scripts\m19\modular-commerce-api\collect-modular-monolith-evidence.ps1

.\scripts\m19\modular-commerce-api\verify-modular-monolith-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 58. Encerrar o laboratório

Confirme:

- aplicação encerrada;
- eventos processados;
- nenhum processo residual;
- nenhum ciclo;
- nenhum internal access;
- nenhum repository compartilhado;
- reports sanitizados;
- JPMS não antecipado;
- DDD não antecipado.

---

## Entendendo o que foi feito

### A aplicação ganhou módulos de negócio

A estrutura deixou de ser organizada apenas por tecnologia.

### Cada módulo ganhou API pública

Outros módulos passaram a depender de contratos estáveis.

### A implementação ganhou privacidade

Entities, repositories e services internos deixaram de vazar.

### As dependências ganharam direção

O grafo passou a ser explícito e testável.

### Os ciclos ganharam proibição

A arquitetura passou a impedir dependências recíprocas.

### Os eventos ganharam função

Notificações passaram a reagir a fatos publicados.

### Os dados ganharam owner

Banco compartilhado deixou de significar acesso irrestrito.

### As transações ganharam limite

Operações deixaram de manipular internals de vários módulos.

### O shared ganhou restrição

Tipos globais deixaram de crescer sem revisão.

### A próxima aula ganhou fronteira

Modularização em Java fica para a aula 616.

---

## Erros comuns importantes

### Criar módulo por tabela

O módulo perde significado de negócio.

### Criar módulo por camada técnica

A aplicação continua acoplada horizontalmente.

### Expor entities na API do módulo

Internals vazam.

### Acessar repository de outro módulo

Ownership é quebrado.

### Criar ciclo entre módulos

Mudanças passam a exigir coordenação permanente.

### Publicar entity inteira como evento

Contrato e dados internos vazam.

### Usar pasta shared para tudo

A responsabilidade desaparece.

### Assumir que banco único elimina boundaries

Ownership continua necessário.

### Usar evento sem documentar semântica

Falhas e transações ficam imprevisíveis.

### Antecipar JPMS ou DDD

A aula perde o foco no monólito modular.

---

## Comandos úteis

### Executar testes

```powershell
.\scripts\m19\modular-commerce-api\run-modular-commerce-tests.ps1
```

### Validar módulos

```powershell
.\scripts\m19\modular-commerce-api\validate-module-boundaries.ps1
```

### Validar ciclos

```powershell
.\scripts\m19\modular-commerce-api\validate-module-cycles.ps1
```

### Executar smoke

```powershell
.\scripts\m19\modular-commerce-api\run-modular-commerce-smoke.ps1
```

### Verificar gate

```powershell
.\scripts\m19\modular-commerce-api\verify-modular-monolith-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Catálogo

Defina módulos e responsabilidades.

### Parte 2 — APIs públicas

Crie contratos mínimos.

### Parte 3 — Internals

Proteja implementação.

### Parte 4 — Dependências

Defina grafo permitido.

### Parte 5 — Eventos

Publique fatos mínimos.

### Parte 6 — Data ownership

Atribua dados a módulos.

### Parte 7 — Transações

Evite manipulação cruzada de internals.

### Parte 8 — Testes

Valide módulos isolados e integrados.

### Parte 9 — Arquitetura

Bloqueie ciclos e acessos indevidos.

### Parte 10 — Gate

Valide documentação, smoke e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 614 e ponte para a aula 616 foram preservadas;
- o laboratório `modular-commerce-api` foi criado;
- a aplicação permanece um único deploy;
- módulos `orders`, `inventory` e `notifications` foram definidos;
- cada módulo possui responsabilidade explícita;
- cada módulo possui API pública mínima;
- implementação interna fica em package `internal`;
- outros módulos não acessam internals;
- APIs públicas não expõem entities ou repositories;
- `orders` usa `InventoryModuleApi`;
- `orders` não acessa repository de inventory;
- notifications reage a eventos publicados;
- eventos contêm payload mínimo;
- entities não são publicadas como evento;
- grafo de dependências foi documentado;
- módulos não possuem ciclos;
- ArchUnit protege boundaries e ciclos;
- data ownership foi definido;
- banco compartilhado não permite acesso cruzado irrestrito;
- transações respeitam boundaries modulares;
- shared kernel permanece pequeno;
- controllers ficam dentro dos módulos;
- testes isolados por módulo foram criados;
- teste integrado cobre orders, inventory e notifications;
- Spring Modulith, quando usado, atua como ferramenta de apoio;
- reports, gate e evidence foram criados;
- nenhum dado sensível foi incluído;
- JPMS, modularização em Java e DDD não foram antecipados;
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
  labs/m19/aula-615-monolito-modular/modular-commerce-api `
  scripts/m19/modular-commerce-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReferenceReal|module-info.java|requires transitive|exports br|boundedContext|aggregateRoot"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): implementar monolito modular"
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
- microservices;
- JPMS;
- `module-info.java`;
- DDD formal;
- sistemas distribuídos.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou um monólito modular.

Você criou:

```text
módulos de negócio;

APIs públicas;

packages internos;

grafo de dependências;

eventos entre módulos;

data ownership;

transaction boundaries;

shared kernel mínimo;

testes modulares;

architecture tests;

gate.
```

Você comprovou que monólito não significa ausência de arquitetura; que uma única aplicação pode possuir módulos fortes; que APIs internas evitam acesso direto a internals; que ciclos precisam ser proibidos; que eventos reduzem acoplamento em alguns fluxos; que banco compartilhado ainda exige ownership; que shared precisa ser pequeno; e que testes arquiteturais tornam as fronteiras executáveis.

A próxima aula será:

```text
616 - M19.06 - Modularizacao em Java
```

Nela, você irá estudar como o Java pode reforçar limites por meio de módulos, exports, requires e encapsulamento, além de analisar quando esse mecanismo faz sentido em aplicações backend.

Nenhum `module-info.java`, módulo JPMS, regra de `exports`, `requires` ou `opens` foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini módulos de negócio.
- [ ] Criei APIs públicas mínimas.
- [ ] Protegi packages internos.
- [ ] Documentei dependências.
- [ ] Eliminei ciclos.
- [ ] Criei eventos modulares.
- [ ] Defini data ownership.
- [ ] Validei boundaries com testes.

---

## Troubleshooting adicional

### Módulo precisa de entity de outro módulo

Use API, result público ou evento.

### Orders precisa acessar inventory repository

Use `InventoryModuleApi`.

### Surge um ciclo

Revise responsabilidade, evento ou coordenação.

### Evento precisa carregar muitos campos

Publique apenas o fato necessário.

### Listener falha e quebra a transação

Documente semântica e trate conforme a policy.

### Shared cresce rapidamente

Mova responsabilidades de volta aos módulos.

### Teste precisa subir tudo

Crie APIs fakes para testes isolados.

### ArchUnit não detecta internal access

Revise patterns de packages.

### Spring Modulith acusa dependência

Analise se o grafo documentado está incorreto.

### O laboratório começou a criar `module-info.java`

Preserve essa etapa para a aula 616.

---

## Perguntas de revisão

1. O que é monólito modular?
2. Qual diferença entre monólito e monólito acoplado?
3. O que é módulo de negócio?
4. O que é API pública de módulo?
5. O que é internal package?
6. Por que não expor entities?
7. O que é module dependency?
8. Por que ciclos são perigosos?
9. O que é module event?
10. Por que evento deve ter payload mínimo?
11. O que é data ownership?
12. Banco único permite acesso a tudo?
13. O que é transaction boundary?
14. O que é shared kernel?
15. Por que shared deve ser pequeno?
16. Para que servem architecture tests?
17. Como testar módulos isoladamente?
18. Qual função do Spring Modulith?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Aplicação única com módulos internos fortes.
2. Fronteiras explícitas versus dependências livres.
3. Unidade de responsabilidade de negócio.
4. Contrato disponível para outros módulos.
5. Implementação privada.
6. Evitar vazamento e acoplamento.
7. Relação explícita entre módulos.
8. Impedem evolução independente.
9. Fato publicado por um módulo.
10. Evitar vazamento interno.
11. Responsabilidade sobre dados.
12. Não; ownership continua obrigatório.
13. Limite de atomicidade.
14. Conjunto mínimo realmente compartilhado.
15. Evitar módulo global disfarçado.
16. Proteger boundaries e ciclos.
17. Usando APIs fakes e testes internos.
18. Apoiar verificação e documentação modular.
19. Modularizacao em Java.
20. Modularizacao em Java.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 615 - M19.05 - Monolito modular

- Criei o laboratório `modular-commerce-api`.
- Mantive uma única aplicação e um único deploy.
- Organizei o sistema em módulos `orders`, `inventory` e `notifications`.
- Defini responsabilidades de negócio para cada módulo.
- Criei APIs públicas mínimas.
- Protegi implementações em packages `internal`.
- Impedi acesso direto a entities e repositories de outros módulos.
- Criei grafo de dependências permitido.
- Proibi ciclos entre módulos.
- Usei `InventoryModuleApi` no fluxo de pedidos.
- Criei eventos de pedido para notifications.
- Mantive payload de eventos mínimo.
- Defini data ownership por módulo.
- Documentei transaction boundaries.
- Mantive shared kernel pequeno.
- Criei testes isolados e integração modular.
- Usei ArchUnit e verificação opcional com Spring Modulith.
- Criei reports, gate e evidence.
- Não antecipei JPMS ou DDD.
- Próxima aula: Modularização em Java.
```

---

## Referência técnica curta

- Modular monolith.
- Package by module.
- Module APIs.
- Internal packages.
- Module dependencies.
- Cyclic dependencies.
- Module events.
- Data ownership.
- Transaction boundaries.
- Spring Modulith.

Regra final:

```text
um monólito modular precisa permanecer uma única unidade de deploy sem se tornar um bloco sem fronteiras: módulos de negócio como orders, inventory e notifications possuem responsabilidade, API pública mínima, implementation em package internal, dados próprios, eventos publicados e dependências documentadas; módulos externos usam apenas APIs e eventos, não acessam entities, repositories ou technical records de outro módulo, ciclos são proibidos, o grafo é validado por ArchUnit e, opcionalmente, Spring Modulith, eventos carregam payload mínimo, listeners não conhecem internals do publicador e falhas síncronas têm semântica explícita; banco compartilhado não elimina data ownership, transações não manipulam repositories de múltiplos módulos diretamente e shared kernel permanece pequeno; testes isolados usam APIs fakes, integração valida o fluxo completo e o gate termina com boundaries, APIs, dependencies, cycles, events, transactions, data ownership, documentação e evidence aprovados, enquanto Modularização em Java começa somente na aula 616 e DDD fundamentos permanece reservado à aula 617.
```
