# 483 - M16.28 - Eventos de domínio

## Apresentação da aula

Na aula 482, você comparou RabbitMQ e Kafka a partir do problema real.

A conclusão foi:

```text
RabbitMQ:
entrega, filas, roteamento, trabalho e DLQ.

Kafka:
log, retenção, partitions, offsets e replay.
```

Também ficou claro que nenhuma tecnologia corrige uma modelagem ruim.

Um broker pode entregar uma mensagem com sucesso e ainda assim o conteúdo representar:

- intenção mal definida;
- evento genérico;
- estado incompleto;
- detalhe interno vazado;
- comando disfarçado de evento;
- entidade inteira serializada;
- contrato impossível de evoluir.

A próxima pergunta precisa acontecer antes da escolha do exchange, topic ou queue:

```text
o que exatamente
a aplicação está comunicando?
```

Considere estas mensagens:

```text
criar pedido;

pedido criado;

atualizar cliente;

cliente atualizado;

processar pagamento;

pagamento autorizado.
```

Elas não possuem a mesma semântica.

Algumas expressam intenção:

```text
faça algo.
```

Outras expressam fato:

```text
algo aconteceu.
```

A pergunta central desta aula será:

```text
como modelar eventos de domínio
que representem fatos reais do negócio,

preservem invariantes do agregado,

e possam ser convertidos
em eventos de integração
sem acoplar o domínio ao broker?
```

A resposta será construída com:

```text
comando;

evento;

evento de domínio;

evento de integração;

agregado;

invariante;

registro de eventos;

publicação;

mapeamento;

contrato externo.
```

O laboratório continuará no projeto:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Mas a modelagem criada nesta aula não dependerá diretamente do Kafka.

O domínio conhecerá apenas conceitos como:

```text
Order;

OrderId;

OrderStatus;

OrderCreatedDomainEvent;

OrderConfirmedDomainEvent.
```

Ele não conhecerá:

```text
KafkaTemplate;

RabbitTemplate;

topic;

exchange;

routing key;

partition;

offset;

consumer group.
```

A infraestrutura continuará responsável por transformar eventos internos em contratos de integração.

O fluxo será:

```text
command HTTP;

application service;

aggregate;

invariant;

domain event registrado;

repository save;

event dispatcher;

mapper;

integration event;

publisher port.
```

A aula não implementará atomicidade completa entre banco e broker.

Esse problema será tratado com:

```text
Outbox Pattern
```

na aula 488.

Nesta aula, o fluxo de publicação será deliberadamente didático e terá uma limitação registrada:

```text
salvar no banco
e publicar no broker
são duas operações distintas.
```

Se o banco confirmar e o broker falhar, pode existir inconsistência.

Essa limitação não será escondida.

Ao final, você deverá explicar:

```text
por que comando não é evento;

por que evento deve estar no passado;

por que evento de domínio
não precisa ser contrato externo;

por que agregado registra eventos
depois de validar invariantes;

por que evento não deve conter
a entidade inteira;

por que domínio não conhece Kafka;

por que integração exige mapeamento;

por que publicar após save
ainda não resolve atomicidade;

por que schema evolution
será a próxima etapa.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
481:
Consumers producers Kafka.

482:
RabbitMQ vs Kafka.

483:
Eventos de domínio.

484:
Schema evolution.

485:
Schema Registry conceitual.

486:
Poison message.

487:
Deduplicação.

488:
Outbox Pattern.
```

A aula 482 respondeu:

```text
qual tecnologia escolher
para cada problema?
```

A aula 483 responderá:

```text
qual fato do negócio
deve ser comunicado?
```

Nesta aula:

```text
comandos:
sim.

eventos:
sim.

eventos de domínio:
sim.

eventos de integração:
sim.

agregado:
sim.

invariantes:
sim.

registro de eventos:
sim.

mapeamento:
sim.

publisher port:
sim.

Kafka direto no domínio:
não.

RabbitMQ direto no domínio:
não.

schema evolution profundo:
não.

outbox:
não.

saga:
não.

CDC:
não.
```

A regra central será:

```text
o domínio registra fatos
depois que uma mudança válida acontece;

a aplicação decide
quando despachar;

a infraestrutura decide
como publicar.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/kafka
├── application
│   ├── CreateOrderCommand.java
│   ├── CreateOrderService.java
│   ├── ConfirmOrderCommand.java
│   └── ConfirmOrderService.java
├── domain
│   ├── DomainEvent.java
│   ├── Order.java
│   ├── OrderId.java
│   ├── OrderStatus.java
│   ├── event
│   │   ├── OrderConfirmedDomainEvent.java
│   │   └── OrderCreatedDomainEvent.java
│   └── exception
│       └── InvalidOrderStateException.java
├── integration
│   ├── DomainEventDispatcher.java
│   ├── IntegrationEventPublisher.java
│   ├── OrderIntegrationEventMapper.java
│   └── event
│       ├── OrderConfirmedIntegrationEventV1.java
│       └── OrderCreatedIntegrationEventV1.java
└── repository
    ├── InMemoryOrderRepository.java
    └── OrderRepository.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka
├── application
│   └── CreateOrderServiceTest.java
├── domain
│   └── OrderTest.java
└── integration
    └── OrderIntegrationEventMapperTest.java
```

Você irá:

1. diferenciar comando e evento;
2. definir uma interface de evento de domínio;
3. criar um value object para `OrderId`;
4. criar um agregado `Order`;
5. validar invariantes;
6. registrar eventos internamente;
7. expor eventos pendentes com segurança;
8. limpar eventos após despacho;
9. criar application services;
10. criar repository port;
11. criar publisher port;
12. criar mapper de domínio para integração;
13. criar eventos de integração versionados;
14. publicar sem acoplar o domínio ao broker;
15. registrar a limitação de atomicidade;
16. testar o agregado;
17. testar a aplicação;
18. testar o mapeamento;
19. documentar naming;
20. commitar;
21. preparar schema evolution.

---

## Conceito essencial

### Comando

Comando expressa intenção.

Exemplos:

```text
CreateOrder;

ConfirmOrder;

CancelOrder;

AuthorizePayment.
```

Um comando pode ser recusado.

Exemplo:

```text
ConfirmOrder
```

pode falhar porque o pedido já está cancelado.

Comandos normalmente utilizam verbo no imperativo ou infinitivo conceitual.

Eles dizem:

```text
tente executar esta ação.
```

---

### Evento

Evento expressa fato ocorrido.

Exemplos:

```text
OrderCreated;

OrderConfirmed;

OrderCancelled;

PaymentAuthorized.
```

Um evento não deve dizer:

```text
talvez tenha acontecido.
```

Quando o evento existe, o fato já foi aceito pelo domínio.

Por isso, o nome deve estar no passado.

---

### Evento de domínio

Evento de domínio representa algo relevante que aconteceu dentro do modelo de negócio.

Exemplo:

```text
OrderConfirmedDomainEvent.
```

Ele nasce porque o agregado executou uma transição válida.

Características:

- usa linguagem do domínio;
- nasce depois da validação;
- pertence ao boundary do domínio;
- pode ser consumido dentro da aplicação;
- não precisa ser igual ao contrato externo;
- não conhece tecnologia de mensageria.

---

### Evento de integração

Evento de integração é um contrato publicado para outros componentes ou sistemas.

Exemplo:

```text
OrderConfirmedIntegrationEventV1.
```

Ele precisa considerar:

- compatibilidade;
- versionamento;
- consumidores externos;
- segurança;
- governança;
- schema;
- retenção;
- evolução.

Um evento de domínio pode gerar:

- nenhum evento de integração;
- um evento de integração;
- vários eventos de integração.

Também é possível que vários eventos internos sejam consolidados em um contrato externo.

---

### Agregado

Agregado é uma fronteira de consistência.

Ele controla:

- estado;
- invariantes;
- transições;
- eventos resultantes.

Nesta aula, `Order` será aggregate root.

A regra será:

```text
somente Order
muda o status do pedido.
```

Código externo não receberá setter público para alterar o estado.

---

### Invariante

Invariante é uma condição que precisa permanecer verdadeira.

Exemplos:

```text
total deve ser positivo;

customerId não pode estar vazio;

pedido cancelado não pode ser confirmado;

pedido confirmado não pode ser confirmado novamente.
```

O evento só será registrado depois que a invariante for preservada.

Não faça:

```text
registrar evento;

depois validar.
```

---

### Evento não é snapshot completo

Um erro comum é publicar a entidade inteira.

Exemplo ruim:

```text
OrderEntity com todos os campos JPA;
lazy relations;
audit columns;
flags internos;
dados sensíveis.
```

O evento deve conter o necessário para representar o fato.

Exemplo:

```text
orderId;

customerId;

total;

occurredAt.
```

Payload mínimo reduz acoplamento.

Payload mínimo não significa payload insuficiente.

---

### Registro de eventos

O agregado manterá uma coleção interna:

```text
pendingEvents.
```

Quando uma ação válida acontece:

```java
pendingEvents.add(
    new OrderConfirmedDomainEvent(...)
);
```

O aggregate não publica diretamente.

Ele apenas registra.

A application layer coordena o despacho.

---

### Pull de eventos pendentes

A baseline utilizará:

```text
pullDomainEvents()
```

O método retorna uma cópia imutável e limpa a coleção interna.

Vantagem:

```text
um evento não é despachado
duas vezes pelo mesmo ciclo local.
```

Limitação:

```text
se o processo falhar
depois de limpar
e antes de publicar,
o evento pode ser perdido.
```

Essa limitação reforça a necessidade futura do outbox.

---

### Domínio independente da infraestrutura

O package de domínio não deve importar:

```text
org.springframework.kafka;

org.springframework.amqp;

KafkaTemplate;

RabbitTemplate;

ConsumerRecord;

Message.
```

O domínio deve ser testável com Java puro.

---

### Mapeamento

O mapper converte:

```text
domain event
        |
        v
integration event
```

Exemplo:

```text
OrderCreatedDomainEvent
        |
        v
OrderCreatedIntegrationEventV1
```

O mapper pode:

- renomear campos;
- remover detalhes internos;
- adicionar versão;
- adicionar event type;
- normalizar formato;
- proteger dados.

---

### Naming

Evento deve responder:

```text
o que aconteceu?
```

Exemplos bons:

```text
OrderCreated;

OrderConfirmed;

PaymentAuthorized.
```

Exemplos ruins:

```text
OrderEvent;

OrderUpdated;

ProcessOrder;

HandlePayment.
```

`OrderUpdated` é genérico demais.

Qual mudança ocorreu?

---

### Granularidade

Eventos muito amplos escondem significado.

Eventos pequenos demais criam ruído.

Exemplo amplo:

```text
OrderChanged.
```

Exemplo excessivamente técnico:

```text
OrderStatusColumnValueChanged.
```

Exemplo adequado:

```text
OrderConfirmed.
```

A linguagem deve refletir uma mudança relevante para o negócio.

---

## Mão na massa guiada

### 1. Confirmar o projeto

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

A aplicação Kafka precisa continuar verde.

---

### 2. Criar DomainEvent

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/DomainEvent.java
```

```java
package br.com.formacao.m16.kafka.domain;

import java.time.Instant;
import java.util.UUID;

public interface DomainEvent {

    UUID eventId();

    Instant occurredAt();

    String aggregateType();

    String aggregateId();
}
```

Não inclua topic ou partition.

---

### 3. Criar OrderId

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/OrderId.java
```

```java
package br.com.formacao.m16.kafka.domain;

import java.util.Objects;

public record OrderId(String value) {

    public OrderId {
        Objects.requireNonNull(
            value,
            "Order id must not be null"
        );

        if (value.isBlank()) {
            throw new IllegalArgumentException(
                "Order id must not be blank"
            );
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
```

---

### 4. Criar status

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/OrderStatus.java
```

```java
package br.com.formacao.m16.kafka.domain;

public enum OrderStatus {
    CREATED,
    CONFIRMED,
    CANCELLED
}
```

---

### 5. Criar o evento de criação

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/event/OrderCreatedDomainEvent.java
```

```java
package br.com.formacao.m16.kafka.domain.event;

import br.com.formacao.m16.kafka.domain.DomainEvent;
import br.com.formacao.m16.kafka.domain.OrderId;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderCreatedDomainEvent(
    UUID eventId,
    Instant occurredAt,
    OrderId orderId,
    String customerId,
    BigDecimal total
) implements DomainEvent {

    @Override
    public String aggregateType() {
        return "Order";
    }

    @Override
    public String aggregateId() {
        return orderId.value();
    }
}
```

---

### 6. Criar o evento de confirmação

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/event/OrderConfirmedDomainEvent.java
```

```java
package br.com.formacao.m16.kafka.domain.event;

import br.com.formacao.m16.kafka.domain.DomainEvent;
import br.com.formacao.m16.kafka.domain.OrderId;
import java.time.Instant;
import java.util.UUID;

public record OrderConfirmedDomainEvent(
    UUID eventId,
    Instant occurredAt,
    OrderId orderId
) implements DomainEvent {

    @Override
    public String aggregateType() {
        return "Order";
    }

    @Override
    public String aggregateId() {
        return orderId.value();
    }
}
```

O evento contém somente o necessário.

---

### 7. Criar a exceção de estado

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/exception/InvalidOrderStateException.java
```

```java
package br.com.formacao.m16.kafka.domain.exception;

public class InvalidOrderStateException
        extends RuntimeException {

    public InvalidOrderStateException(
        String message
    ) {
        super(message);
    }
}
```

---

### 8. Criar o aggregate Order

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/domain/Order.java
```

```java
package br.com.formacao.m16.kafka.domain;

import br.com.formacao.m16.kafka.domain.event.OrderConfirmedDomainEvent;
import br.com.formacao.m16.kafka.domain.event.OrderCreatedDomainEvent;
import br.com.formacao.m16.kafka.domain.exception.InvalidOrderStateException;
import java.math.BigDecimal;
import java.time.Clock;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class Order {

    private final OrderId id;
    private final String customerId;
    private final BigDecimal total;
    private final List<DomainEvent> pendingEvents =
        new ArrayList<>();

    private OrderStatus status;

    private Order(
        OrderId id,
        String customerId,
        BigDecimal total,
        OrderStatus status
    ) {
        this.id = id;
        this.customerId = customerId;
        this.total = total;
        this.status = status;
    }

    public static Order create(
        OrderId id,
        String customerId,
        BigDecimal total,
        Clock clock
    ) {
        Objects.requireNonNull(
            id,
            "Order id must not be null"
        );

        Objects.requireNonNull(
            customerId,
            "Customer id must not be null"
        );

        Objects.requireNonNull(
            total,
            "Total must not be null"
        );

        if (customerId.isBlank()) {
            throw new IllegalArgumentException(
                "Customer id must not be blank"
            );
        }

        if (total.signum() <= 0) {
            throw new IllegalArgumentException(
                "Total must be positive"
            );
        }

        Order order =
            new Order(
                id,
                customerId,
                total,
                OrderStatus.CREATED
            );

        order.register(
            new OrderCreatedDomainEvent(
                UUID.randomUUID(),
                clock.instant(),
                id,
                customerId,
                total
            )
        );

        return order;
    }

    public void confirm(Clock clock) {
        if (status != OrderStatus.CREATED) {
            throw new InvalidOrderStateException(
                "Only a created order can be confirmed"
            );
        }

        status = OrderStatus.CONFIRMED;

        register(
            new OrderConfirmedDomainEvent(
                UUID.randomUUID(),
                clock.instant(),
                id
            )
        );
    }

    private void register(
        DomainEvent event
    ) {
        pendingEvents.add(event);
    }

    public List<DomainEvent> pullDomainEvents() {
        List<DomainEvent> events =
            List.copyOf(pendingEvents);

        pendingEvents.clear();

        return events;
    }

    public OrderId id() {
        return id;
    }

    public String customerId() {
        return customerId;
    }

    public BigDecimal total() {
        return total;
    }

    public OrderStatus status() {
        return status;
    }
}
```

A criação e a confirmação registram eventos apenas depois de manter as invariantes.

---

### 9. Criar repository port

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/repository/OrderRepository.java
```

```java
package br.com.formacao.m16.kafka.repository;

import br.com.formacao.m16.kafka.domain.Order;
import br.com.formacao.m16.kafka.domain.OrderId;
import java.util.Optional;

public interface OrderRepository {

    void save(Order order);

    Optional<Order> findById(OrderId id);
}
```

---

### 10. Criar repository em memória

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/repository/InMemoryOrderRepository.java
```

```java
package br.com.formacao.m16.kafka.repository;

import br.com.formacao.m16.kafka.domain.Order;
import br.com.formacao.m16.kafka.domain.OrderId;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryOrderRepository
        implements OrderRepository {

    private final Map<OrderId, Order> orders =
        new ConcurrentHashMap<>();

    @Override
    public void save(Order order) {
        orders.put(
            order.id(),
            order
        );
    }

    @Override
    public Optional<Order> findById(
        OrderId id
    ) {
        return Optional.ofNullable(
            orders.get(id)
        );
    }
}
```

A persistência é apenas didática.

---

### 11. Criar o publisher port

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/IntegrationEventPublisher.java
```

```java
package br.com.formacao.m16.kafka.integration;

public interface IntegrationEventPublisher {

    void publish(Object integrationEvent);
}
```

O domínio não implementa essa interface.

Ela pertence à fronteira de integração.

---

### 12. Criar eventos de integração

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/event/OrderCreatedIntegrationEventV1.java
```

```java
package br.com.formacao.m16.kafka.integration.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderCreatedIntegrationEventV1(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/event/OrderConfirmedIntegrationEventV1.java
```

```java
package br.com.formacao.m16.kafka.integration.event;

import java.time.Instant;
import java.util.UUID;

public record OrderConfirmedIntegrationEventV1(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String orderId
) {
}
```

A versão aparece no nome e no payload.

A evolução será aprofundada na aula 484.

---

### 13. Criar o mapper

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/OrderIntegrationEventMapper.java
```

```java
package br.com.formacao.m16.kafka.integration;

import br.com.formacao.m16.kafka.domain.DomainEvent;
import br.com.formacao.m16.kafka.domain.event.OrderConfirmedDomainEvent;
import br.com.formacao.m16.kafka.domain.event.OrderCreatedDomainEvent;
import br.com.formacao.m16.kafka.integration.event.OrderConfirmedIntegrationEventV1;
import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import org.springframework.stereotype.Component;

@Component
public class OrderIntegrationEventMapper {

    public Object map(DomainEvent event) {
        if (
            event
                instanceof
                OrderCreatedDomainEvent created
        ) {
            return new OrderCreatedIntegrationEventV1(
                created.eventId(),
                "orders.created.v1",
                1,
                created.occurredAt(),
                created.orderId().value(),
                created.customerId(),
                created.total()
            );
        }

        if (
            event
                instanceof
                OrderConfirmedDomainEvent confirmed
        ) {
            return new OrderConfirmedIntegrationEventV1(
                confirmed.eventId(),
                "orders.confirmed.v1",
                1,
                confirmed.occurredAt(),
                confirmed.orderId().value()
            );
        }

        throw new IllegalArgumentException(
            "Unsupported domain event: "
                + event.getClass().getName()
        );
    }
}
```

O mapper concentra a tradução.

---

### 14. Criar o dispatcher

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/DomainEventDispatcher.java
```

```java
package br.com.formacao.m16.kafka.integration;

import br.com.formacao.m16.kafka.domain.DomainEvent;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class DomainEventDispatcher {

    private final OrderIntegrationEventMapper mapper;
    private final IntegrationEventPublisher publisher;

    public DomainEventDispatcher(
        OrderIntegrationEventMapper mapper,
        IntegrationEventPublisher publisher
    ) {
        this.mapper = mapper;
        this.publisher = publisher;
    }

    public void dispatch(
        List<DomainEvent> events
    ) {
        events
            .stream()
            .map(mapper::map)
            .forEach(publisher::publish);
    }
}
```

A implementação real do publisher poderá usar Kafka.

O domínio continua independente.

---

### 15. Criar publisher Kafka de integração

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/integration/KafkaIntegrationEventPublisher.java
```

```java
package br.com.formacao.m16.kafka.integration;

import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaIntegrationEventPublisher
        implements IntegrationEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String topicName;

    public KafkaIntegrationEventPublisher(
        KafkaTemplate<String, Object> kafkaTemplate,
        @Value("${app.kafka.topics.orders}")
        String topicName
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.topicName = topicName;
    }

    @Override
    public void publish(
        Object integrationEvent
    ) {
        String key =
            extractOrderId(
                integrationEvent
            );

        try {
            kafkaTemplate
                .send(
                    topicName,
                    key,
                    integrationEvent
                )
                .get(
                    10,
                    TimeUnit.SECONDS
                );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                "Integration event publication interrupted",
                exception
            );
        } catch (Exception exception) {
            throw new IllegalStateException(
                "Integration event publication failed",
                exception
            );
        }
    }

    private String extractOrderId(
        Object event
    ) {
        if (
            event
                instanceof
                br.com.formacao.m16.kafka.integration.event
                    .OrderCreatedIntegrationEventV1 created
        ) {
            return created.orderId();
        }

        if (
            event
                instanceof
                br.com.formacao.m16.kafka.integration.event
                    .OrderConfirmedIntegrationEventV1 confirmed
        ) {
            return confirmed.orderId();
        }

        throw new IllegalArgumentException(
            "Unsupported integration event"
        );
    }
}
```

Esse código revela uma limitação importante:

```text
publicação após save
não é atomicidade.
```

---

### 16. Criar command de criação

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/application/CreateOrderCommand.java
```

```java
package br.com.formacao.m16.kafka.application;

import java.math.BigDecimal;

public record CreateOrderCommand(
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

---

### 17. Criar service de criação

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/application/CreateOrderService.java
```

```java
package br.com.formacao.m16.kafka.application;

import br.com.formacao.m16.kafka.domain.Order;
import br.com.formacao.m16.kafka.domain.OrderId;
import br.com.formacao.m16.kafka.integration.DomainEventDispatcher;
import br.com.formacao.m16.kafka.repository.OrderRepository;
import java.time.Clock;
import org.springframework.stereotype.Service;

@Service
public class CreateOrderService {

    private final OrderRepository repository;
    private final DomainEventDispatcher dispatcher;
    private final Clock clock;

    public CreateOrderService(
        OrderRepository repository,
        DomainEventDispatcher dispatcher
    ) {
        this.repository = repository;
        this.dispatcher = dispatcher;
        this.clock = Clock.systemUTC();
    }

    public Order execute(
        CreateOrderCommand command
    ) {
        Order order =
            Order.create(
                new OrderId(
                    command.orderId()
                ),
                command.customerId(),
                command.total(),
                clock
            );

        repository.save(order);

        dispatcher.dispatch(
            order.pullDomainEvents()
        );

        return order;
    }
}
```

O fluxo é claro, mas ainda vulnerável à falha entre save e publish.

---

### 18. Criar confirmação

Crie:

```text
ConfirmOrderCommand;

ConfirmOrderService.
```

Fluxo:

```text
carregar;

confirmar;

salvar;

pull;

dispatch.
```

Não duplique lógica de invariant fora do aggregate.

---

### 19. Testar o aggregate

Arquivo:

```text
src/test/java/br/com/formacao/m16/kafka/domain/OrderTest.java
```

Cenários:

```text
criação válida registra OrderCreated;

total inválido não cria evento;

confirmação registra OrderConfirmed;

segunda confirmação falha;

pull limpa eventos;

evento usa horário controlado.
```

Use:

```java
Clock.fixed(...)
```

para timestamps determinísticos.

---

### 20. Testar o application service

Utilize fakes:

```text
InMemoryOrderRepository;

publisher que captura objetos.
```

Confirme:

- save ocorreu;
- evento de integração foi publicado;
- payload não é a entidade;
- key pertence ao pedido;
- versão é `1`.

---

### 21. Testar o mapper

Arquivo:

```text
OrderIntegrationEventMapperTest.java
```

Confirme:

```text
OrderCreatedDomainEvent
-> orders.created.v1.

OrderConfirmedDomainEvent
-> orders.confirmed.v1.

eventId preservado;

occurredAt preservado;

orderId convertido para String;

eventVersion = 1.
```

---

### 22. Registrar a limitação de atomicidade

Crie:

```text
docs/architecture/messaging/DOMAIN_EVENTS_LIMITATIONS.md
```

Registre:

```markdown
# Limitações da publicação atual

1. O aggregate registra eventos em memória.
2. O repository salva o aggregate.
3. O dispatcher publica depois.
4. Banco e broker não compartilham transação.
5. Falha após o save pode perder publicação.
6. Falha antes do save não deve publicar.
7. Retry simples pode duplicar publicação.
8. A solução futura será Outbox Pattern.
```

Não implemente outbox agora.

---

### 23. Criar guia de naming

Arquivo:

```text
docs/architecture/messaging/DOMAIN_EVENT_NAMING.md
```

Inclua:

```text
passado;

linguagem de negócio;

sem verbo técnico;

sem nome genérico;

sem CRUD;

sem nome de tabela;

sem nome de framework.
```

Exemplos:

```text
OrderConfirmed:
bom.

OrderStatusUpdated:
genérico.

OrderRowUpdated:
técnico.

ProcessOrder:
comando.
```

---

### 24. Revisar acoplamento

Execute:

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|RabbitTemplate|ConsumerRecord|Message" `
  -- `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/br/com/formacao/m16/kafka/domain"
```

Resultado esperado:

```text
nenhuma ocorrência.
```

---

### 25. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=OrderTest,CreateOrderServiceTest,OrderIntegrationEventMapperTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### Comando e evento ficaram separados

Comando pede; evento registra fato.

### O aggregate passou a proteger invariantes

Estado não é alterado por setters externos.

### Eventos nasceram depois da mudança válida

Falha de regra não produz evento.

### O domínio ficou independente do broker

Nenhum import Kafka ou RabbitMQ foi usado no package de domínio.

### Eventos internos e externos foram separados

O mapper controla a tradução.

### Payloads ficaram mínimos

A entidade completa não foi serializada.

### Versionamento apareceu no contrato externo

`V1` e `eventVersion=1` prepararam a evolução.

### O dispatcher ficou fora do aggregate

O domínio registra; a aplicação coordena.

### A limitação ficou explícita

Save e publish ainda não são atômicos.

### A próxima aula ficou preparada

Schema evolution poderá partir de contratos claros e versionados.

---

## Erros comuns importantes

### Chamar comando de evento

`CreateOrderEvent` ainda expressa intenção.

### Nomear evento no presente

Evento deve representar fato ocorrido.

### Criar evento genérico

`OrderUpdated` esconde significado.

### Publicar entidade JPA

Vaza detalhes internos e cria acoplamento.

### Colocar KafkaTemplate no aggregate

Domínio passa a depender da infraestrutura.

### Registrar antes da validação

Evento pode representar fato que nunca aconteceu.

### Limpar eventos cedo demais

Falha antes da publicação pode perder informação.

### Nunca limpar eventos

O mesmo evento pode ser despachado novamente.

### Usar o mesmo modelo interno externamente

Mudanças internas quebram consumidores.

### Colocar dados sensíveis no evento

Retenção e múltiplos consumidores ampliam exposição.

### Tratar publicação após save como transação

Ainda existe janela de falha.

### Implementar outbox pela metade

A aula específica existe para tratar atomicidade corretamente.

---

## Comandos úteis

### Testes de domínio

```powershell
.\mvnw.cmd `
  -Dtest=OrderTest `
  test
```

### Testes da aplicação

```powershell
.\mvnw.cmd `
  -Dtest=CreateOrderServiceTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Verificar acoplamento

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|RabbitTemplate" `
  -- `
  "*/domain/*"
```

### Ver eventos

```powershell
git grep `
  -n `
  -E `
  "DomainEvent|IntegrationEvent|pullDomainEvents"
```

---

## Exercício guiado

### Parte 1 — Comando

Crie `CreateOrderCommand`.

### Parte 2 — Aggregate

Implemente invariantes.

### Parte 3 — Evento

Registre `OrderCreatedDomainEvent`.

### Parte 4 — Confirmação

Registre `OrderConfirmedDomainEvent`.

### Parte 5 — Mapper

Converta para integração V1.

### Parte 6 — Publisher port

Mantenha domínio independente.

### Parte 7 — Application service

Salve e despache.

### Parte 8 — Testes

Valide invariantes e eventos.

### Parte 9 — Limitação

Documente atomicidade.

### Parte 10 — Naming

Registre convenções.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 482 foi preservada;
- comando foi diferenciado de evento;
- evento foi nomeado no passado;
- evento de domínio foi definido;
- evento de integração foi definido;
- agregado foi explicado;
- invariante foi explicada;
- aggregate root foi criado;
- setters públicos de status não foram criados;
- criação valida customerId;
- criação valida total positivo;
- confirmação valida estado;
- segunda confirmação falha;
- evento só é registrado após validação;
- `DomainEvent` não conhece broker;
- domain package não importa Kafka;
- domain package não importa RabbitMQ;
- `OrderCreatedDomainEvent` foi criado;
- `OrderConfirmedDomainEvent` foi criado;
- eventos pendentes foram armazenados;
- retorno de eventos é imutável;
- pull limpa eventos;
- risco do pull foi documentado;
- repository port foi criado;
- publisher port foi criado;
- mapper foi criado;
- evento de domínio foi separado do externo;
- eventos de integração V1 foram criados;
- event type foi explícito;
- event version foi explícita;
- eventId foi preservado;
- occurredAt foi preservado;
- entidade completa não foi publicada;
- payload sensível não foi incluído;
- application service coordena;
- aggregate não publica diretamente;
- save acontece antes do dispatch;
- limitação de atomicidade foi registrada;
- outbox foi citado sem implementação;
- testes usam Clock fixo;
- invariantes foram testadas;
- pull foi testado;
- mapper foi testado;
- publisher fake foi usado;
- naming guide foi criado;
- eventos genéricos foram evitados;
- CRUD técnico foi evitado;
- schema evolution não foi aprofundada;
- Schema Registry não foi antecipado;
- deduplicação não foi antecipada;
- saga e CDC não foram antecipados;
- commit recomendado está pronto;
- ponte para aula 484 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure acoplamento:

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|RabbitTemplate|DomainEvent|IntegrationEvent"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/messaging `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m16): modelar eventos de domínio"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- entidade inteira serializada;
- credenciais;
- logs;
- payload real;
- target;
- outbox incompleta;
- transação distribuída improvisada;
- schema futuro antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a mensageria deixou de começar no broker e passou a começar no domínio.

O fluxo ficou:

```text
command;

application service;

aggregate;

invariant;

domain event;

repository;

dispatcher;

mapper;

integration event;

publisher.
```

Você comprovou que:

- comando expressa intenção;
- evento expressa fato;
- eventos são nomeados no passado;
- aggregate protege invariantes;
- evento nasce depois da mudança válida;
- domínio não conhece Kafka ou RabbitMQ;
- evento de domínio não precisa ser contrato externo;
- mapper protege o domínio;
- evento de integração precisa de versão;
- payload não deve copiar a entidade inteira;
- save e publish ainda não são atômicos;
- outbox será necessário para confiabilidade maior.

A próxima aula será:

```text
484 - M16.29 - Schema evolution
```

Nela, você irá:

- definir mudança compatível;
- definir mudança incompatível;
- trabalhar com campos opcionais;
- evitar remoções abruptas;
- versionar contratos;
- testar consumers antigos;
- criar matriz de compatibilidade;
- trabalhar com defaults;
- evitar semantic breaking changes;
- preparar Schema Registry conceitual.

Nada disso foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei comando e evento.
- [ ] Criei aggregate com invariantes.
- [ ] Registrei eventos de domínio.
- [ ] Criei eventos de integração V1.
- [ ] Mantive domínio sem broker.
- [ ] Testei aggregate e mapper.
- [ ] Documentei atomicidade.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Nenhum evento é publicado

Confirme se `pullDomainEvents()` foi chamado depois do save.

### Evento aparece duas vezes

O pull pode não estar limpando ou o service pode despachar duas vezes.

### Confirmação não gera evento

Revise a transição e o método `confirm`.

### Teste depende do relógio real

Injete `Clock.fixed`.

### Domain importa Spring Kafka

Mova publicação para a camada de integração.

### Evento contém campos demais

Revise o fato e os consumidores reais.

### Mapper lança unsupported event

Um novo domain event ainda não possui contrato externo.

### Save funciona e publish falha

Essa é a limitação documentada. Não esconda; a solução futura é outbox.

### Publish funciona antes do save

A ordem está incorreta. Um fato externo não deve anunciar estado não persistido.

### Consumer quebra após mudança de campo

A próxima aula tratará schema evolution.

---

## Perguntas de revisão

1. O que é comando?
2. O que é evento?
3. Como nomear evento?
4. O que é evento de domínio?
5. O que é evento de integração?
6. Eles precisam ser iguais?
7. O que é agregado?
8. O que é invariante?
9. Quando registrar evento?
10. Aggregate deve publicar?
11. Domínio conhece Kafka?
12. Por que mapear?
13. Por que payload mínimo?
14. Por que não publicar entidade?
15. O que pull faz?
16. Qual risco do pull?
17. Save e publish são atômicos?
18. Qual padrão resolverá?
19. Schema evolution foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Intenção de executar ação.
2. Fato ocorrido.
3. No passado.
4. Fato relevante interno.
5. Contrato externo.
6. Não.
7. Fronteira de consistência.
8. Regra sempre verdadeira.
9. Depois da mudança válida.
10. Não diretamente.
11. Não.
12. Proteger domínio e contrato.
13. Reduzir acoplamento.
14. Vaza estrutura interna.
15. Retorna e limpa eventos.
16. Falha antes de publicar pode perder.
17. Não.
18. Outbox Pattern.
19. Não.
20. Schema evolution.

---

## Desafio opcional

Modele:

```text
OrderCancelledDomainEvent
```

Requisitos:

- somente CREATED pode cancelar;
- CONFIRMED não pode cancelar;
- evento no passado;
- integração `orders.cancelled.v1`;
- mapper;
- teste com relógio fixo;
- payload mínimo;
- nenhum KafkaTemplate no aggregate;
- nenhuma outbox;
- documentação da invariante.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 483 - M16.28 - Eventos de domínio

- Continuei após a comparação RabbitMQ vs Kafka.
- Diferenciei comando e evento.
- Entendi comando como intenção.
- Entendi evento como fato ocorrido.
- Passei a nomear eventos no passado.
- Diferenciei evento de domínio e integração.
- Modelei `Order` como aggregate root.
- Criei `OrderId` como value object.
- Criei `OrderStatus`.
- Implementei invariantes de criação.
- Implementei invariante de confirmação.
- Removi setters públicos de estado.
- Criei `DomainEvent`.
- Criei `OrderCreatedDomainEvent`.
- Criei `OrderConfirmedDomainEvent`.
- Registrei eventos somente após mudanças válidas.
- Criei coleção de eventos pendentes.
- Retornei cópia imutável.
- Limpei eventos após pull.
- Documentei o risco de falha entre pull e publicação.
- Criei `OrderRepository`.
- Criei repository em memória.
- Criei `IntegrationEventPublisher`.
- Mantive domínio sem Kafka ou RabbitMQ.
- Criei eventos de integração V1.
- Criei mapper entre domínio e integração.
- Mantive payload mínimo.
- Não publiquei entidade JPA.
- Criei dispatcher.
- Criei application services.
- Salvei antes de despachar.
- Registrei que save e publish não são atômicos.
- Preparei a futura adoção de Outbox Pattern.
- Criei testes com Clock fixo.
- Testei invariantes, eventos e mapper.
- Criei guia de naming.
- Não antecipei schema evolution ou outbox.
- Próxima aula: Schema evolution.
```

---

## Referência técnica curta

- Domain-Driven Design — Domain Events.
- Patterns, Principles, and Practices of Domain-Driven Design.
- Enterprise Integration Patterns — Message.
- Spring Data — Domain Events.
- Spring Framework — Application Events.
- Apache Kafka — Event Design.
- AsyncAPI — Event-driven APIs.
- CloudEvents — Event Metadata.
- Microsoft Architecture Guide — Domain Events.
- Martin Fowler — Domain Event.

Regra final:

```text
eventos de domínio devem nascer de mudanças válidas dentro de um agregado e representar fatos do negócio no passado; comandos expressam intenção e podem ser rejeitados, enquanto eventos registram algo que já aconteceu; o aggregate protege invariantes, registra eventos em memória e não conhece Kafka, RabbitMQ, topics ou queues; a application layer salva o estado e coordena o despacho; um mapper converte eventos internos em contratos de integração versionados e mínimos; publicar a entidade inteira cria acoplamento, e publicar depois do save ainda deixa uma janela de falha que somente uma estratégia como Outbox Pattern resolverá; com contratos V1 claros, a próxima etapa poderá estudar schema evolution sem misturar domínio e infraestrutura.
```
