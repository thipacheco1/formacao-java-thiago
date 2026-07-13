# 477 - M16.22 - Producers consumers

## Apresentação da aula

Na aula 475, você criou o primeiro producer e consumer com RabbitMQ usando a exchange padrão. Na aula 476, o roteamento ficou explícito:

```text
publisher -> exchange -> routing key -> binding -> queue -> consumer
```

Agora a aplicação Spring passará a utilizar a topologia declarada.

O fluxo anterior era:

```text
OrderMessagePublisher
    -> exchange padrão
    -> m16.orders.created.v1
    -> OrderMessageConsumer
```

O novo fluxo será:

```text
OrderEventPublisher
    |
    | exchange:
    | m16.orders.events.direct.v1
    |
    | routing key:
    | orders.created.v1
    v
direct exchange
    |
    +--> m16.fulfillment.orders-created.v1
    |        -> Fulfillment consumer
    |
    +--> m16.audit.orders-created.v1
             -> Audit consumer
```

O producer conhecerá o exchange, a routing key e o contrato da mensagem. Ele não conhecerá queues, quantidade de consumers, concorrência ou tempo de processamento.

Cada capacidade terá sua própria queue. A mesma publicação será consumida uma vez por fulfillment e uma vez por auditoria porque existem duas cópias independentes. Na queue de fulfillment haverá dois competing consumers: cada entrega será processada por apenas um deles.

Também serão estudados listener container, consumer tag, concorrência, prefetch, estados `Ready` e `Unacked`, acknowledgement `AUTO` e metadata de entrega.

A conversão JSON deixará de ficar espalhada. Um único `MessageConverter` será utilizado pelo `RabbitTemplate` e pelos listeners.

A baseline moderna utilizará:

```text
JacksonJsonMessageConverter.
```

Em uma linha anterior do Spring AMQP, use o equivalente legado `Jackson2JsonMessageConverter`. Não adicione os dois nem altere isoladamente a versão gerenciada pelo Spring Boot.

Não serão configurados publisher confirms, returned messages, retry, DLQ, manual ack, transação AMQP, Kafka, outbox, saga ou CDC.

A aula deve deixar clara a diferença:

```text
erro de publicação:
a aplicação não conseguiu publicar.

erro de consumo:
a mensagem foi entregue,
mas o processamento falhou.
```

A política de falha do consumer será construída na aula 478.

## Onde estamos na formação

A sequência oficial é:

```text
475:
RabbitMQ fundamentos.

476:
Exchanges queues bindings.

477:
Producers consumers.

478:
Retry e DLQ RabbitMQ.

479:
Kafka fundamentos.
```

A aula 476 respondeu:

```text
como declarar a topologia
e controlar o roteamento?
```

A aula 477 responderá:

```text
como conectar código de produção
a exchanges e queues reais,
mantendo producer e consumers
com responsabilidades separadas?
```

Nesta aula:

```text
RabbitTemplate:
sim.

exchange nomeado:
sim.

routing key:
sim.

MessageConverter JSON:
sim.

message post processor:
sim.

consumers por capacidade:
sim.

@RabbitListener:
sim.

listener container:
sim.

concorrência:
sim.

competing consumers:
sim.

prefetch:
sim.

ack AUTO:
sim.

metadata:
sim.

redelivery:
conceitual e observado.

publisher confirms:
não.

manual ack:
não.

retry:
não.

DLQ:
não.

Kafka:
não.
```

A regra central será:

```text
producer publica fatos
sem conhecer a infraestrutura
dos consumidores;

cada consumer processa
a queue de sua capacidade;

o listener container controla
entrega, concorrência, prefetch
e acknowledgement.
```

---

## Objetivo prático

O laboratório continua em:

```text
labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos
```

Estrutura principal:

```text
config/
├── RabbitMqTopologyConfiguration.java
├── RabbitMessagingConfiguration.java
└── RabbitTopologyNames.java

consumer/
├── AuditOrderCreatedConsumer.java
├── FulfillmentOrderCreatedConsumer.java
├── ConsumedMessageObservationFactory.java
└── OrderMessageReader.java

message/
└── OrderCreatedMessage.java

observation/
├── ConsumedMessageObservation.java
└── ConsumedMessageRegistry.java

producer/
└── OrderEventPublisher.java
```

Você irá:

1. reutilizar a topologia direct;
2. remover o acoplamento do producer com a queue;
3. centralizar JSON;
4. publicar em exchange nomeado;
5. criar consumers de fulfillment e auditoria;
6. iniciar dois competing consumers em fulfillment;
7. configurar prefetch pequeno;
8. observar metadata, `Ready` e `Unacked`;
9. comprovar cópias e competição;
10. testar falha de publicação;
11. remover o código legado;
12. executar testes e commit.

## Conceito essencial

### Producer

Producer é o componente que transforma uma decisão da aplicação em uma publicação.

Responsabilidades do producer:

```text
escolher o contrato da mensagem;

escolher o exchange;

escolher a routing key;

preencher metadata aprovada;

solicitar a publicação;

propagar falha de publicação.
```

O producer não deve:

```text
executar o trabalho do consumer;

conhecer todas as queues;

esperar a conclusão dos consumers;

consultar quantos consumers existem;

controlar concorrência do consumer.
```

A separação permite adicionar uma nova queue de auditoria sem modificar o producer.

---

### Mensagem como contrato

`OrderCreatedMessage` não é entidade JPA nem request HTTP. Ele é o contrato de integração:

```java
public record OrderCreatedMessage(
    UUID messageId,
    String messageType,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

Use:

```text
messageType:
orders.created.v1
```

A routing key decide roteamento; `messageType` declara a semântica no payload. Os dois valores devem permanecer consistentes.

### MessageConverter

O `RabbitTemplate` trabalha com objetos e mensagens AMQP.

O converter faz a ponte:

```text
objeto Java
    |
    v
JSON + MessageProperties
```

e no consumer:

```text
JSON + MessageProperties
    |
    v
objeto Java
```

O converter padrão simples é útil para strings e byte arrays, mas não deve induzir serialização Java nativa entre sistemas.

JSON é mais interoperável.

Centralizar o converter evita:

- `ObjectMapper` em cada producer;
- `new String(body)` em cada consumer;
- regras diferentes de data;
- content type inconsistente;
- duplicação de tratamento.

A conversão não elimina a necessidade de contrato. Aulas futuras tratarão schema evolution e Schema Registry conceitual.

---

### RabbitTemplate

`RabbitTemplate` é a abstração de envio e recebimento síncrono do Spring AMQP.

Nesta aula ele será utilizado apenas para publicar:

```java
rabbitTemplate.convertAndSend(
    exchange,
    routingKey,
    payload,
    messagePostProcessor
);
```

A chamada converte e envia a mensagem.

Sem publisher confirms, o retorno normal não deve ser descrito como confirmação durável do broker.

O endpoint continuará respondendo:

```text
202 Accepted.
```

Isso significa:

```text
a aplicação aceitou a solicitação
e executou o passo local de publicação
sem erro síncrono detectado.
```

Não significa:

- fulfillment concluído;
- auditoria concluída;
- mensagem processada;
- persistência de negócio concluída;
- confirmação do consumer;
- garantia de perda zero.

---

### Consumer

Consumer é uma assinatura ativa. A queue existe sem consumer; quando o listener inicia, o broker registra uma assinatura com consumer tag, channel, ack e prefetch. O broker entrega mensagens pela conexão AMQP.

### Listener container

`@RabbitListener` é executado por um listener container. Ele mantém conexão e consumers, recebe deliveries, converte payloads, chama o método, controla concorrência, prefetch, acknowledgement e recuperação de conexão.

### Consumers por capacidade

Nesta aula existirão:

```text
FulfillmentOrderCreatedConsumer
    -> m16.fulfillment.orders-created.v1

AuditOrderCreatedConsumer
    -> m16.audit.orders-created.v1
```

Uma publicação `orders.created.v1` combina com dois bindings.

Resultado:

```text
uma mensagem na queue de fulfillment;

uma mensagem na queue de auditoria.
```

Cada queue possui lifecycle independente.

Se auditoria estiver parada, fulfillment pode continuar.

Quando auditoria voltar, suas mensagens Ready poderão ser processadas.

---

### Competing consumers

O consumer de fulfillment usará:

```text
concurrency = 2.
```

Isso registra dois consumers na mesma queue.

Para cada mensagem dessa queue, apenas um deles recebe a entrega.

```text
fulfillment queue
      |
      +--> consumer 1
      |
      +--> consumer 2
```

Não são duas cópias.

É distribuição de trabalho.

RabbitMQ não deve ser tratado como garantia de alternância perfeita.

A distribuição depende de:

- disponibilidade do consumer;
- prefetch;
- mensagens não confirmadas;
- tempo de processamento;
- conexão;
- scheduling;
- tamanho das mensagens.

---

### Concorrência

Concorrência aumenta paralelismo, mas eleva mensagens em voo, uso de recursos e pressão sobre downstreams. Também pode alterar a ordem de conclusão. A baseline usa dois consumers somente para aprendizado; aumentar o valor sem medir não é estratégia de escala.

### Prefetch

Prefetch limita mensagens não confirmadas por consumer.

```text
prefetch:
5.
```

Com dois consumers de fulfillment, até cerca de dez entregas podem ficar em voo. Valores altos favorecem throughput, mas aumentam memória, concentração de trabalho e redelivery potencial. Valores baixos podem melhorar distribuição e ordenação, com menor throughput.

### Acknowledgement AUTO

A baseline mantém:

```text
acknowledge-mode:
auto.
```

No Spring AMQP, isso não significa o modo AMQP `autoAck=true`.

O listener container exige acknowledgement e decide quando confirmar.

Para o método simples desta aula:

```text
retorno normal:
entrega pode ser confirmada.

exceção:
entrega segue política de erro do container.
```

Retry e DLQ ainda não estão configurados.

Por isso, não provoque falha permanente nesta aula. Uma exceção recorrente pode causar redelivery repetido conforme a configuração.

---

### Metadata de entrega

O payload contém dados de negócio.

As propriedades AMQP carregam metadata operacional.

Serão observadas:

```text
messageId;

type;

timestamp;

contentType;

receivedExchange;

receivedRoutingKey;

consumerQueue;

consumerTag;

deliveryTag;

redelivered.
```

Não coloque segredo ou dado pessoal desnecessário em headers.

Metadata também vira superfície de contrato.

---

### Publisher confirm e consumer ack

São mecanismos diferentes.

```text
publisher confirm:
broker responde ao publisher.

consumer ack:
consumer confirma processamento ao broker.
```

Um não substitui o outro.

Nesta aula:

```text
consumer ack:
sim, AUTO.

publisher confirm:
não configurado.
```

A ausência de publisher confirm será registrada como limitação.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m16/aula-475-rabbitmq-fundamentos/rabbitmq-fundamentos"
```

Confirme o broker:

```powershell
docker ps `
  --filter "name=formacao-rabbitmq"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

A topologia da aula 476 precisa permanecer verde.

---

### 2. Normalizar o tipo da mensagem

Na aula 475, o valor usado no payload pode ter ficado como:

```text
order.created.v1
```

A topologia da aula 476 adotou:

```text
orders.created.v1
```

A partir desta aula, utilize uma única forma:

```text
orders.created.v1.
```

Antes de remover o consumer antigo, confirme que a queue antiga está vazia.

Não misture mensagens antigas com contratos diferentes.

---

### 3. Criar a configuração de mensageria

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/config/RabbitMessagingConfiguration.java
```

Código para Spring AMQP atual:

```java
package br.com.formacao.m16.rabbitmq.config;

import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMessagingConfiguration {

    @Bean
    MessageConverter rabbitMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
```

Use o converter JSON compatível com a versão gerenciada pelo Spring Boot.

Não fixe manualmente outra versão do Spring AMQP para obter uma classe diferente.

---

### 4. Configurar o listener no application.yaml

Mantenha conexão e credenciais locais já existentes.

Adicione ou revise:

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        acknowledge-mode: "auto"
        prefetch: 5
        concurrency: 1
        max-concurrency: 1
```

A configuração global inicia um consumer por listener.

O fulfillment sobrescreverá a concorrência para dois na annotation.

Não configure retry nesta seção.

---

### 5. Criar o registro de observação

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/observation/ConsumedMessageObservation.java
```

```java
package br.com.formacao.m16.rabbitmq.observation;

import java.time.Instant;
import java.util.UUID;

public record ConsumedMessageObservation(
    UUID messageId,
    String messageType,
    String orderId,
    String capability,
    String queue,
    String exchange,
    String routingKey,
    String consumerTag,
    long deliveryTag,
    boolean redelivered,
    String threadName,
    Instant consumedAt
) {
}
```

Esse record existe para observação do laboratório.

Ele não é evento de domínio.

---

### 6. Atualizar o registry

Substitua o conteúdo do `ConsumedMessageRegistry` por:

```java
package br.com.formacao.m16.rabbitmq.observation;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;

@Component
public class ConsumedMessageRegistry {

    private final List<ConsumedMessageObservation> observations =
        new CopyOnWriteArrayList<>();

    public void register(
        ConsumedMessageObservation observation
    ) {
        observations.add(observation);
    }

    public List<ConsumedMessageObservation> findAll() {
        return List.copyOf(observations);
    }

    public void clear() {
        observations.clear();
    }
}
```

O registry agora registra cada entrega por capacidade.

Uma publicação deverá produzir duas observações.

---

### 7. Criar um apoio para conversão no consumer

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/consumer/OrderMessageReader.java
```

```java
package br.com.formacao.m16.rabbitmq.consumer;

import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.stereotype.Component;

@Component
public class OrderMessageReader {

    private final MessageConverter messageConverter;

    public OrderMessageReader(
        MessageConverter messageConverter
    ) {
        this.messageConverter = messageConverter;
    }

    public OrderCreatedMessage read(Message message) {
        Object converted =
            messageConverter.fromMessage(message);

        if (converted instanceof OrderCreatedMessage orderMessage) {
            return orderMessage;
        }

        throw new IllegalArgumentException(
            "Unsupported message payload type: "
                + converted.getClass().getName()
        );
    }
}
```

O converter utilizado pelo producer e pelo consumer é o mesmo bean.

Não use cast sem validação.

---

### 8. Criar um factory de observações

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/consumer/ConsumedMessageObservationFactory.java
```

```java
package br.com.formacao.m16.rabbitmq.consumer;

import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageObservation;
import java.time.Instant;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.stereotype.Component;

@Component
public class ConsumedMessageObservationFactory {

    public ConsumedMessageObservation create(
        String capability,
        OrderCreatedMessage payload,
        Message amqpMessage
    ) {
        MessageProperties properties =
            amqpMessage.getMessageProperties();

        return new ConsumedMessageObservation(
            payload.messageId(),
            payload.messageType(),
            payload.orderId(),
            capability,
            properties.getConsumerQueue(),
            properties.getReceivedExchange(),
            properties.getReceivedRoutingKey(),
            properties.getConsumerTag(),
            properties.getDeliveryTag(),
            properties.isRedelivered(),
            Thread.currentThread().getName(),
            Instant.now()
        );
    }
}
```

A factory mantém os listeners pequenos.

---

### 9. Criar o consumer de fulfillment

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/consumer/FulfillmentOrderCreatedConsumer.java
```

```java
package br.com.formacao.m16.rabbitmq.consumer;

import br.com.formacao.m16.rabbitmq.config.RabbitTopologyNames;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageObservation;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class FulfillmentOrderCreatedConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            FulfillmentOrderCreatedConsumer.class
        );

    private final OrderMessageReader messageReader;
    private final ConsumedMessageObservationFactory observationFactory;
    private final ConsumedMessageRegistry registry;

    public FulfillmentOrderCreatedConsumer(
        OrderMessageReader messageReader,
        ConsumedMessageObservationFactory observationFactory,
        ConsumedMessageRegistry registry
    ) {
        this.messageReader = messageReader;
        this.observationFactory = observationFactory;
        this.registry = registry;
    }

    @RabbitListener(
        id = "fulfillment-orders-created",
        queues =
            RabbitTopologyNames
                .FULFILLMENT_ORDERS_CREATED_QUEUE,
        concurrency = "2"
    )
    public void consume(Message amqpMessage) {
        OrderCreatedMessage payload =
            messageReader.read(amqpMessage);

        ConsumedMessageObservation observation =
            observationFactory.create(
                "fulfillment",
                payload,
                amqpMessage
            );

        LOGGER.info(
            "Fulfillment consumed messageId={} orderId={} "
                + "queue={} consumerTag={} deliveryTag={} "
                + "redelivered={} thread={}",
            observation.messageId(),
            observation.orderId(),
            observation.queue(),
            observation.consumerTag(),
            observation.deliveryTag(),
            observation.redelivered(),
            observation.threadName()
        );

        registry.register(observation);
    }
}
```

O listener não realiza retry manual.

O retorno normal permite o ack pelo container.

---

### 10. Criar o consumer de auditoria

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/consumer/AuditOrderCreatedConsumer.java
```

```java
package br.com.formacao.m16.rabbitmq.consumer;

import br.com.formacao.m16.rabbitmq.config.RabbitTopologyNames;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageObservation;
import br.com.formacao.m16.rabbitmq.observation.ConsumedMessageRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class AuditOrderCreatedConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            AuditOrderCreatedConsumer.class
        );

    private final OrderMessageReader messageReader;
    private final ConsumedMessageObservationFactory observationFactory;
    private final ConsumedMessageRegistry registry;

    public AuditOrderCreatedConsumer(
        OrderMessageReader messageReader,
        ConsumedMessageObservationFactory observationFactory,
        ConsumedMessageRegistry registry
    ) {
        this.messageReader = messageReader;
        this.observationFactory = observationFactory;
        this.registry = registry;
    }

    @RabbitListener(
        id = "audit-orders-created",
        queues =
            RabbitTopologyNames
                .AUDIT_ORDERS_CREATED_QUEUE
    )
    public void consume(Message amqpMessage) {
        OrderCreatedMessage payload =
            messageReader.read(amqpMessage);

        ConsumedMessageObservation observation =
            observationFactory.create(
                "audit",
                payload,
                amqpMessage
            );

        LOGGER.info(
            "Audit consumed messageId={} orderId={} "
                + "queue={} consumerTag={} deliveryTag={} "
                + "redelivered={}",
            observation.messageId(),
            observation.orderId(),
            observation.queue(),
            observation.consumerTag(),
            observation.deliveryTag(),
            observation.redelivered()
        );

        registry.register(observation);
    }
}
```

A auditoria utiliza um consumer porque não há necessidade de demonstrar concorrência nas duas capacidades.

---

### 11. Refatorar o producer

Renomeie:

```text
OrderMessagePublisher
```

para:

```text
OrderEventPublisher.
```

Arquivo:

```text
src/main/java/br/com/formacao/m16/rabbitmq/producer/OrderEventPublisher.java
```

```java
package br.com.formacao.m16.rabbitmq.producer;

import br.com.formacao.m16.rabbitmq.config.RabbitTopologyNames;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OrderEventPublisher(
        RabbitTemplate rabbitTemplate
    ) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(OrderCreatedMessage message) {
        rabbitTemplate.convertAndSend(
            RabbitTopologyNames.ORDERS_DIRECT_EXCHANGE,
            RabbitTopologyNames.ORDERS_CREATED_KEY,
            message,
            amqpMessage -> {
                MessageProperties properties =
                    amqpMessage.getMessageProperties();

                properties.setMessageId(
                    message.messageId().toString()
                );
                properties.setType(message.messageType());
                properties.setTimestamp(
                    java.util.Date.from(
                        message.occurredAt()
                    )
                );
                properties.setDeliveryMode(
                    MessageDeliveryMode.PERSISTENT
                );
                properties.setHeader(
                    "x-correlation-id",
                    message.messageId().toString()
                );

                return amqpMessage;
            }
        );
    }
}
```

O converter define o corpo JSON e o content type.

O post processor adiciona metadata operacional.

---

### 12. Atualizar o controller

Troque a dependência para `OrderEventPublisher`.

Na criação da mensagem, use:

```java
OrderCreatedMessage message =
    new OrderCreatedMessage(
        messageId,
        RabbitTopologyNames.ORDERS_CREATED_KEY,
        now,
        request.orderId(),
        request.customerId(),
        request.total()
    );
```

O endpoint continua retornando:

```text
202 Accepted;

PUBLISH_REQUEST_ACCEPTED.
```

Não altere para `201 Created`.

Nenhum recurso de negócio foi criado pelo consumer no contexto desta request.

---

### 13. Ajustar o endpoint de observação

O `GET` agora retorna:

```text
List<ConsumedMessageObservation>
```

Depois de uma publicação, espere duas entradas com o mesmo `messageId`:

```text
capability:
fulfillment.

capability:
audit.
```

As queues e delivery tags serão diferentes.

Delivery tag é escopo do channel. Não compare valores de channels diferentes como identificador global.

---

### 14. Remover o consumer antigo

Remova:

```text
OrderMessageConsumer.java.
```

Remova a injeção antiga de `ObjectMapper` ligada à desserialização manual.

Não mantenha dois consumers para a mesma intenção sem perceber.

A queue antiga ainda pode existir no broker porque era durável.

---

### 15. Remover a declaração antiga do código

Remova o bean da queue:

```text
m16.orders.created.v1
```

de `RabbitMqFundamentosConfiguration`.

Se a classe ficar vazia, remova-a.

Isso remove a declaração do código, mas não apaga a queue já existente no broker.

Confirme que ela está vazia e sem consumers. Depois, no broker local, exclua-a conscientemente pela UI.

Não implemente deleção automática no startup.

---

### 16. Compilar

```powershell
.\mvnw.cmd clean compile
```

Erros possíveis:

- converter não compatível com a versão;
- import antigo;
- publisher antigo ainda injetado;
- registry com tipo antigo;
- consumer antigo ainda referenciado;
- constante com nome incorreto.

Resolva antes de iniciar.

---

### 17. Iniciar a aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

Abra:

```text
http://127.0.0.1:15672
```

Confirme:

```text
m16.fulfillment.orders-created.v1:
2 consumers.

m16.audit.orders-created.v1:
1 consumer.
```

As queues de billing, fanout e topic permanecem sem consumers. Elas pertencem à topologia didática, mas ainda não foram conectadas a código.

---

### 18. Publicar uma mensagem

```powershell
$body = @{
  orderId = "ORD-477-0001"
  customerId = "CUS-477-0001"
  total = 149.90
} |
  ConvertTo-Json

$response =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8080" +
      "/api/v1/lab/orders/messages"
    ) `
    -ContentType "application/json" `
    -Body $body

$response
```

Ajuste a porta somente se o projeto já utilizar outra configuração.

Resultado esperado:

```text
status:
PUBLISH_REQUEST_ACCEPTED.
```

---

### 19. Consultar as observações

```powershell
$observations =
  Invoke-RestMethod `
    -Method Get `
    -Uri (
      "http://localhost:8080" +
      "/api/v1/lab/orders/messages/consumed"
    )

$observations |
  Format-Table `
    messageId,
    capability,
    queue,
    routingKey,
    consumerTag,
    redelivered,
    threadName
```

Confirme duas capacidades.

Não espere a mesma delivery tag.

---

### 20. Publicar um lote controlado

```powershell
1..20 | ForEach-Object {

  $body = @{
    orderId = "ORD-477-{0:D4}" -f $_
    customerId = "CUS-477-LOAD"
    total = 10 + $_
  } |
    ConvertTo-Json

  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8080" +
      "/api/v1/lab/orders/messages"
    ) `
    -ContentType "application/json" `
    -Body $body |
    Out-Null
}
```

Resultado lógico:

```text
20 mensagens publicadas;

20 entregas em fulfillment;

20 entregas em audit;

40 observações no total.
```

Pode haver pequenas diferenças temporárias enquanto mensagens ainda estão em processamento.

---

### 21. Observar competing consumers

Filtre fulfillment:

```powershell
$observations |
  Where-Object {
    $_.capability -eq "fulfillment"
  } |
  Group-Object consumerTag |
  Select-Object Name, Count
```

Espera-se mais de um consumer tag.

Não exija divisão exatamente `10/10`.

A garantia relevante é:

```text
cada mensagem da queue de fulfillment
é processada por um consumer.
```

---

### 22. Observar prefetch

Para visualizar `Unacked`, adicione temporariamente um atraso curto ao consumer de fulfillment, tratando `InterruptedException` e restaurando o flag da thread. Publique 30 mensagens e observe `Ready`, `Unacked`, consumers e prefetch.

Remova o atraso antes do commit.

### 23. Validar ausência de ordenação global

Publique mensagens numeradas e compare os logs dos dois consumers. Com concorrência `2`, a ordem de conclusão pode divergir da publicação.

Quando o domínio exige ordem estrita, avalie consumer único, prefetch menor ou particionamento por chave. Não implemente isso agora.

### 24. Parar somente a auditoria

Desative temporariamente apenas o listener de auditoria, reinicie e publique cinco mensagens.

Resultado:

```text
fulfillment:
processa.

audit:
acumula Ready.
```

Restaure o listener e confirme o consumo do backlog. Não faça commit com ele desativado.

### 25. Testar falha de publicação

Pare o broker:

```powershell
docker stop "formacao-rabbitmq"
```

Execute o POST. A publicação deve falhar e nenhuma observação nova deve surgir. O endpoint não pode responder sucesso falso.

Reinicie:

```powershell
docker start "formacao-rabbitmq"
```

Traduzir `AmqpException` para Problem Details `503` pode ser uma evolução, sem esconder a causa.

### 26. Não testar falha permanente do consumer

Não altere o consumer para lançar exceção em toda entrega.

Sem retry e DLQ, isso pode provocar ciclo de redelivery ou descarte conforme a política efetiva.

A aula 478 criará um cenário seguro e observável para falhas.

---

### 27. Criar teste do publisher

Arquivo:

```text
src/test/java/br/com/formacao/m16/rabbitmq/producer/OrderEventPublisherTest.java
```

Use Mockito para capturar a chamada.

O teste precisa comprovar:

```text
exchange correto;

routing key correta;

payload correto;

message post processor presente.
```

Estrutura:

```java
package br.com.formacao.m16.rabbitmq.producer;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import br.com.formacao.m16.rabbitmq.config.RabbitTopologyNames;
import br.com.formacao.m16.rabbitmq.message.OrderCreatedMessage;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

class OrderEventPublisherTest {

    @Test
    void shouldPublishUsingOrdersExchangeAndRoutingKey() {
        RabbitTemplate rabbitTemplate =
            org.mockito.Mockito.mock(
                RabbitTemplate.class
            );

        OrderEventPublisher publisher =
            new OrderEventPublisher(rabbitTemplate);

        OrderCreatedMessage message =
            new OrderCreatedMessage(
                UUID.randomUUID(),
                RabbitTopologyNames.ORDERS_CREATED_KEY,
                Instant.parse("2026-07-12T18:00:00Z"),
                "ORD-477-TEST",
                "CUS-477-TEST",
                new BigDecimal("99.90")
            );

        publisher.publish(message);

        verify(rabbitTemplate).convertAndSend(
            eq(RabbitTopologyNames.ORDERS_DIRECT_EXCHANGE),
            eq(RabbitTopologyNames.ORDERS_CREATED_KEY),
            eq(message),
            any(MessagePostProcessor.class)
        );
    }
}
```

O teste não prova roteamento no broker.

A aula 476 já criou prova estrutural e manual da topologia.

---

### 28. Criar teste do registry

Valide que duas observações com o mesmo messageId e capacidades diferentes são preservadas.

Não use `Set` por `messageId`, pois isso apagaria uma das cópias legítimas.

---

### 29. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=OrderEventPublisherTest,ConsumersObservationTest,RabbitMqTopologyConfigurationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 30. Revisar a aplicação

Confirme:

```text
producer não conhece queues;

fulfillment conhece apenas sua queue;

audit conhece apenas sua queue;

converter é único;

payload não é serializado manualmente;

ack permanece AUTO;

prefetch está explícito;

fulfillment possui dois consumers;

audit possui um consumer;

retry e DLQ não existem ainda.
```

---

## Entendendo o que foi feito

### O producer passou a publicar no modelo correto

Exchange e routing key substituíram o acoplamento com a queue.

### A topologia passou a dirigir os destinos

Adicionar uma nova queue com binding compatível não exige alterar o publisher.

### A conversão JSON ficou centralizada

Producer e consumers compartilham a mesma política de conversão.

### Consumers passaram a representar capacidades

Fulfillment e auditoria possuem código, queue e observação próprios.

### Cópia e competição foram comprovadas

Duas queues recebem cópias; dois consumers na mesma queue dividem trabalho.

### Concorrência ficou observável

Consumer tags e threads mostram múltiplos consumers de fulfillment.

### Prefetch deixou de ser um detalhe invisível

Ele controla quantas mensagens podem ficar em voo por consumer.

### Ack AUTO foi mantido conscientemente

O retorno normal do listener permite confirmação pelo container.

### Erros foram separados por fase

Falha de publicação não é falha de consumo.

### A limitação de confiabilidade ficou explícita

Publisher confirms ainda não estão configurados.

---

## Erros comuns importantes

### Producer publicar para cada queue

Isso recria acoplamento e duplica lógica.

### Uma queue para capacidades independentes

Os consumers competem e apenas um recebe cada mensagem.

### Um consumer para todas as responsabilidades

Falhas, scaling e ownership ficam misturados.

### Serializar JSON manualmente em cada classe

Configurações divergem.

### Usar entidade JPA como payload

O contrato fica acoplado à persistência.

### Tratar 202 como trabalho concluído

O consumer pode ainda não ter executado.

### Tratar convertAndSend como publisher confirm

Sem confirms, são garantias diferentes.

### Aumentar concurrency sem medir downstream

O consumer pode sobrecarregar banco ou API.

### Usar prefetch muito alto com mensagem grande

Muitas mensagens ficam em memória e Unacked.

### Exigir ordem com vários consumers

Concorrência altera a ordem de conclusão.

### Usar messageId para deduplicar cópias entre capacidades

Fulfillment e audit precisam processar a mesma publicação.

### Comparar deliveryTag globalmente

Delivery tag pertence ao channel.

### Lançar erro permanente antes da DLQ

Pode criar redelivery infinito.

---

## Comandos úteis

### Iniciar broker

```powershell
docker start `
  "formacao-rabbitmq"
```

### Iniciar aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

### Testes principais

```powershell
.\mvnw.cmd `
  -Dtest=OrderEventPublisherTest,ConsumersObservationTest,RabbitMqTopologyConfigurationTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar acoplamento antigo

```powershell
git grep `
  -n `
  -E `
  "m16\\.orders\\.created\\.v1|OrderMessagePublisher|ObjectMapper.*consumer|convertAndSend"
```

### Consultar queues

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://127.0.0.1:15672/api/queues/%2F" `
  -Headers $headers
```

---

## Exercício guiado

### Parte 1 — Producer

Refatore o publisher para exchange e routing key.

### Parte 2 — Conversão

Centralize JSON em um `MessageConverter`.

### Parte 3 — Consumers

Crie fulfillment e audit.

### Parte 4 — Concorrência

Use dois consumers em fulfillment.

### Parte 5 — Prefetch

Configure valor `5` e observe Unacked.

### Parte 6 — Backlog independente

Pare auditoria e confirme que fulfillment continua.

### Parte 7 — Falha do producer

Pare o broker e confirme ausência de falso sucesso.

### Parte 8 — Testes

Valide publisher, registry e topologia.

### Parte 9 — Limpeza

Remova código e queue antiga somente após verificar que estão vazios.

### Parte 10 — Registro

Documente:

```text
exchange;

routing key;

queues;

consumers por queue;

prefetch;

ack mode;

converter;

metadata;

limitações.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 476 foi preservada;
- a topologia direct foi reutilizada;
- producer deixou de publicar pelo nome da queue;
- exchange nomeado foi usado;
- producer não conhece queues;
- `RabbitTemplate` foi mantido;
- serialização manual foi removida;
- desserialização manual foi removida;
- converter compatível com a versão do Spring AMQP foi usado;
- `OrderCreatedMessage` permaneceu contrato próprio;
- entidade JPA não foi usada como mensagem;
- metadata segura foi adicionada;
- messageId foi configurado;
- type foi configurado;
- timestamp foi configurado;
- delivery mode persistente foi mantido;
- correlation id sintético foi usado;
- consumer de fulfillment foi criado;
- consumer de auditoria foi criado;
- cada consumer conhece apenas sua queue;
- fulfillment possui dois consumers;
- auditoria possui um consumer;
- competing consumers foram explicados;
- concorrência não foi tratada como broadcast;
- listener container foi explicado;
- consumer tag foi observado;
- delivery tag foi observado;
- delivery tag não foi tratada como global;
- received exchange foi observado;
- received routing key foi observado;
- consumer queue foi observada;
- redelivered foi observado;
- thread foi registrada;
- prefetch foi configurado;
- impacto do prefetch foi explicado;
- Ready foi observado;
- Unacked foi observado;
- ack AUTO foi mantido;
- ack AUTO foi diferenciado de autoAck AMQP;
- retorno normal do listener foi relacionado ao ack;
- exceção permanente não foi provocada;
- ausência de ordenação global foi explicada;
- backlog independente foi demonstrado;
- erro de publicação foi testado;
- erro de consumo foi reservado para aula 478;
- 202 não foi tratado como processamento concluído;
- publisher confirms não foram simulados;
- queue antiga foi removida do código;
- deleção automática de queue foi proibida;
- teste do publisher foi criado;
- teste do registry foi criado;
- teste estrutural da topologia permaneceu;
- retry não foi antecipado;
- DLQ não foi antecipada;
- Kafka não foi antecipado;
- outbox e saga não foram antecipados;
- commit recomendado está pronto;
- ponte para aula 478 está correta.
---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure código antigo:

```powershell
git grep `
  -n `
  -E `
  "OrderMessageConsumer|OrderMessagePublisher|m16\\.orders\\.created\\.v1"
```

Adicione:

```powershell
git add `
  labs/m16/aula-475-rabbitmq-fundamentos `
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
git commit -m "feat(m16): integrar producers e consumers RabbitMQ"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- logs;
- mensagens exportadas;
- volume do broker;
- `Thread.sleep`;
- listener desativado;
- fila antiga com dados;
- retry improvisado;
- DLQ antecipada;
- publisher confirm falso;
- código temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a topologia da aula 476 passou a ser utilizada por código real.

O caminho ficou:

```text
controller;

OrderEventPublisher;

RabbitTemplate;

Jackson JSON converter;

direct exchange;

routing key;

bindings;

fulfillment queue;

audit queue;

listener containers;

consumers;

ack AUTO.
```

Você comprovou que:

- producer publica sem conhecer queues;
- exchange e binding controlam destinos;
- fulfillment e auditoria recebem cópias independentes;
- dois consumers na mesma queue competem;
- concurrency aumenta paralelismo;
- prefetch limita mensagens não confirmadas;
- Ready representa mensagens aguardando entrega;
- Unacked representa deliveries em processamento;
- retorno normal permite acknowledgement pelo container;
- 202 não significa processamento concluído;
- falha de publicação e falha de consumo são diferentes;
- publisher confirm e consumer ack são ortogonais;
- concorrência pode alterar ordem;
- queue durável não deve ser apagada automaticamente durante migração.

A próxima aula será:

```text
478 - M16.23 - Retry e DLQ RabbitMQ
```

Nela, você irá:

- criar falhas transitórias e permanentes;
- impedir redelivery infinito;
- configurar retry com backoff;
- limitar tentativas;
- criar dead-letter exchange;
- criar dead-letter queue;
- analisar headers de morte;
- diferenciar rejeitar, requeue e dead-letter;
- reprocessar mensagens com segurança inicial;
- criar critérios para poison messages;
- observar falhas sem perder rastreabilidade.

Nada disso foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Refatorei o producer para exchange e routing key.
- [ ] Centralizei a conversão JSON.
- [ ] Criei consumers de fulfillment e auditoria.
- [ ] Validei concorrência e prefetch.
- [ ] Diferenciei publicação, entrega e processamento.
- [ ] Executei os testes e o gate.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Converter não existe

Verifique a versão gerenciada do Spring AMQP. Use a implementação JSON correspondente à linha do framework, sem alterar versões isoladamente.

### Consumer recebe byte[]

O converter não foi aplicado, o content type não é JSON ou a mensagem antiga foi produzida por outra configuração.

### Consumer recebe tipo inesperado

Revise headers de tipo, converter e classe alvo. Purge apenas mensagens antigas do laboratório após confirmar que não são necessárias.

### Queue mostra um consumer em vez de dois

Confirme:

```text
concurrency = "2";

listener ativo;

aplicação reiniciada;

queue correta.
```

### Mensagens ficam Ready

Confirme consumers ativos, bindings, logs e ausência de falha de conversão.

### Mensagens ficam Unacked

O listener pode estar bloqueado ou processando lentamente. Remova atraso temporário.

### Auditoria não recebe

Confirme o binding `orders.created.v1` para a queue de auditoria.

### Fulfillment processa duas vezes a mesma cópia

Investigue redelivery, falha antes do ack, reconexão ou duas publicações. Não confunda com a cópia legítima da auditoria.

### Distribuição não fica 50/50

Isso não é contrato. Prefetch, velocidade e scheduling influenciam.

### POST retorna sucesso com broker parado

Revise se a aplicação está realmente publicando ou apenas registrando localmente. Não capture `AmqpException` e retorne 202.

### Queue antiga reaparece

Algum bean ou código antigo ainda a declara.

### Redelivery entra em loop

Pare o consumer e não continue o experimento. A aula 478 configurará retry e DLQ.

---

## Perguntas de revisão

1. O que o producer precisa conhecer?
2. O producer deve conhecer queues?
3. Quem decide os destinos?
4. Por que existem duas queues para o mesmo evento?
5. O que ocorre com dois consumers na mesma queue?
6. O que é listener container?
7. O que faz o MessageConverter?
8. O que é concurrency?
9. O que é prefetch?
10. O que significa Ready?
11. O que significa Unacked?
12. Quando ocorre ack no modo AUTO?
13. AUTO é igual a autoAck do AMQP?
14. Delivery tag é global?
15. O que indica redelivered?
16. 202 significa consumer concluído?
17. Publisher confirm é consumer ack?
18. Por que ordem pode mudar?
19. Retry foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Contrato, exchange e routing key.
2. Não.
3. Exchange e bindings.
4. Capacidades independentes precisam de cópias.
5. Competem pelas entregas.
6. Infraestrutura que executa consumers.
7. Converte objeto e mensagem AMQP.
8. Quantidade de consumers paralelos.
9. Limite de mensagens não confirmadas por consumer.
10. Aguardando entrega.
11. Entregue e ainda não confirmada.
12. Após retorno normal conforme o container.
13. Não.
14. Não, pertence ao channel.
15. Que a entrega já ocorreu anteriormente.
16. Não.
17. Não.
18. Há processamento concorrente.
19. Não.
20. Retry e DLQ RabbitMQ.

---

## Desafio opcional

Crie um consumer para:

```text
m16.billing.orders-cancelled.v1
```

Requisitos:

- mensagem `OrderCancelledMessage`;
- producer publica `orders.cancelled.v1`;
- mesmo direct exchange;
- consumer de billing;
- converter central;
- metadata observada;
- um consumer;
- prefetch `5`;
- nenhum retry;
- nenhuma DLQ;
- teste do publisher;
- prova de que fulfillment não recebe cancelamento;
- prova de que auditoria de created não recebe cancelamento;
- nenhuma alteração no producer de order created.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 477 - M16.22 - Producers consumers

- Continuei no laboratório RabbitMQ das aulas 475 e 476.
- Refatorei o producer para usar exchange nomeado.
- Passei a publicar com routing key canônica.
- Alinhei `messageType` com `orders.created.v1`.
- Mantive o producer sem conhecimento das queues.
- Centralizei JSON em um `MessageConverter`.
- Removi serialização manual do producer.
- Removi desserialização manual dos consumers.
- Mantive `OrderCreatedMessage` como contrato próprio.
- Adicionei metadata de mensagem.
- Criei o consumer de fulfillment.
- Criei o consumer de auditoria.
- Usei queues independentes por capacidade.
- Comprovei cópias independentes por binding.
- Configurei dois competing consumers em fulfillment.
- Mantive um consumer em auditoria.
- Entendi o papel do listener container.
- Configurei prefetch `5`.
- Observei mensagens Ready e Unacked.
- Mantive acknowledgement AUTO.
- Diferenciei AUTO do autoAck AMQP.
- Observei consumer tag.
- Observei delivery tag.
- Entendi que delivery tag pertence ao channel.
- Observei received exchange e routing key.
- Observei consumer queue.
- Observei redelivered.
- Registrei thread de consumo.
- Comprovei que competing consumers não são broadcast.
- Comprovei que duas queues recebem duas cópias.
- Observei que concorrência pode alterar ordem.
- Testei backlog independente da auditoria.
- Testei falha de publicação com broker parado.
- Não tratei 202 como processamento concluído.
- Diferenciei publisher confirm e consumer ack.
- Removi o consumer antigo.
- Removi a declaração antiga do código.
- Não apaguei queue automaticamente.
- Criei teste do publisher.
- Mantive teste estrutural da topologia.
- Não antecipei retry ou DLQ.
- Próxima aula: Retry e DLQ RabbitMQ.
```

---

## Referência técnica curta

- Spring AMQP Reference — Message Converters.
- Spring AMQP Reference — Asynchronous Consumer.
- Spring AMQP Reference — Annotation-driven Listener Endpoints.
- Spring AMQP Reference — Listener Container Configuration.
- Spring Boot Reference — AMQP.
- RabbitMQ Documentation — Consumers.
- RabbitMQ Documentation — Consumer Prefetch.
- RabbitMQ Documentation — Consumer Acknowledgements.
- RabbitMQ Documentation — Publisher Confirms.
- RabbitMQ Documentation — Queues.

Regra final:

```text
o producer publica em exchange nomeado com routing key estável e não conhece queues; bindings criam cópias para capacidades independentes; consumers da mesma queue competem; o listener container controla conversão, concorrência, prefetch e ack; sucesso de publicação não significa consumo concluído; publisher confirms e consumer acknowledgements resolvem etapas diferentes; falhas permanentes exigem a política de retry e DLQ da próxima aula.
```
