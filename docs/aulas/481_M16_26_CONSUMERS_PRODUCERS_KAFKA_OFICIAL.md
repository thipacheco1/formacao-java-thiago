# 481 - M16.26 - Consumers producers Kafka

## Apresentação da aula

Na aula 479, você iniciou o Apache Kafka 4.3.1 em modo KRaft, criou um topic e comprovou que consumir um record não o remove do log.

Na aula 480, o modelo foi aprofundado:

```text
topic;

partitions;

keys;

offsets;

consumer groups;

assignments;

rebalance;

lag;

reset;

replay.
```

O laboratório CLI mostrou que uma key consistente mantém records relacionados na mesma partition, que a ordem é garantida dentro de cada partition e que grupos diferentes possuem offsets independentes.

Agora esses conceitos serão conectados a uma aplicação Java profissional.

A pergunta central desta aula será:

```text
como uma aplicação Spring Boot
publica records com key,

consome por grupos independentes,

observa topic, partition e offset

e valida o fluxo com testes reais?
```

A solução utilizará:

```text
Spring for Apache Kafka;

spring-kafka;

KafkaTemplate;

NewTopic;

TopicBuilder;

@KafkaListener;

ConsumerRecord;

serialização JSON;

deserialização JSON;

consumer groups;

listener concurrency;

ack mode RECORD;

@EmbeddedKafka.
```

O fluxo de publicação será:

```text
request HTTP;

controller;

OrderEventPublisher;

KafkaTemplate;

key = orderId;

topic;

partition escolhida;

record append;

RecordMetadata;

response 202.
```

O fluxo de consumo será:

```text
topic com 3 partitions
        |
        +----------------------+
        |                      |
        v                      v
projection group           audit group
3 consumers                1 consumer
        |                      |
        v                      v
projeção local             trilha local
```

Cada record será lido por dois grupos:

```text
m16-order-projection-spring-v1;

m16-order-audit-spring-v1.
```

Dentro do grupo de projeção existirão três consumers concorrentes, um para cada partition disponível quando todos estiverem ativos.

O grupo de auditoria utilizará um consumer. Esse consumer poderá receber as três partitions.

A aplicação publicará no topic já criado na aula 480:

```text
m16.orders.partitioned.v1
```

A infraestrutura também será declarada por código com um bean `NewTopic`.

Isso não cria um topic diferente. O `KafkaAdmin` auto-configurado pelo Spring Boot verifica e declara a necessidade da aplicação.

A baseline continuará com:

```text
partitions:
3.

replicas:
1.
```

A réplica única pertence somente ao laboratório com um broker.

O producer utilizará:

```text
StringSerializer para key;

JsonSerializer para value;

acks=all;

idempotência do producer habilitada.
```

A idempotência do producer reduz duplicações causadas por retries internos do próprio producer dentro da sessão compatível. Ela não transforma o fluxo completo em exactly-once e não coordena banco de dados com Kafka.

O consumer utilizará:

```text
StringDeserializer para key;

JsonDeserializer para value;

enable-auto-commit=false;

ack-mode=RECORD;

auto-offset-reset=earliest.
```

O listener container confirmará o offset depois que o método retornar normalmente.

Isso estabelece uma baseline at-least-once:

```text
se o efeito ocorrer
e o processo falhar antes do commit,

o record pode ser entregue novamente.
```

Por isso, idempotência continua necessária em aplicações reais.

A aula não implementará:

- manual acknowledgement;
- batch listener;
- transactions;
- exactly-once;
- retry topic;
- dead-letter topic;
- `DefaultErrorHandler`;
- poison message;
- outbox;
- inbox;
- Schema Registry;
- Avro;
- Kafka Connect;
- Kafka Streams.

Esses limites preservam a progressão do curso.

A aula 482 fará a comparação profissional entre RabbitMQ e Kafka.

Ao final, você deverá explicar:

```text
por que KafkaTemplate publica por topic;

por que orderId será a key;

por que NewTopic não substitui governança;

por que dois grupos leem o mesmo record;

por que concurrency=3 não cria cópias;

quando o offset é confirmado;

por que 202 não significa
que os consumers concluíram;

por que RecordMetadata do producer
não é committed offset do consumer;

por que um teste embedded
não substitui o broker real.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
479:
Kafka fundamentos.

480:
Topics partitions offsets.

481:
Consumers producers Kafka.

482:
RabbitMQ vs Kafka.

483:
Eventos de domínio.

484:
Schema evolution.
```

A aula 480 respondeu:

```text
como partitions, keys, groups
e offsets controlam distribuição
e progresso?
```

A aula 481 responderá:

```text
como aplicar esse modelo
com Spring Boot e Java?
```

Nesta aula:

```text
Spring Boot:
sim.

Spring Kafka:
sim.

KafkaTemplate:
sim.

NewTopic:
sim.

TopicBuilder:
sim.

JSON:
sim.

key por orderId:
sim.

@KafkaListener:
sim.

ConsumerRecord:
sim.

dois grupos:
sim.

concurrency:
sim.

ack RECORD:
sim.

metadata:
sim.

Embedded Kafka:
sim.

manual ack:
não.

batch:
não.

transactions:
não.

retry topic:
não.

DLT:
não.

Schema Registry:
não.
```

A regra central será:

```text
producer publica um contrato
com key estável;

consumer group define
uma capacidade de leitura;

listener container controla
poll, assignment e commit;

metadata torna a posição
observável no código.
```

---

## Objetivo prático

Crie o projeto:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Estrutura esperada:

```text
src/main/java/br/com/formacao/m16/kafka
├── KafkaOrdersLabApplication.java
├── config
│   ├── KafkaTopicConfiguration.java
│   └── KafkaTopicNames.java
├── consumer
│   ├── OrderAuditConsumer.java
│   └── OrderProjectionConsumer.java
├── message
│   └── OrderCreatedEvent.java
├── observation
│   ├── ConsumedKafkaRecord.java
│   └── KafkaConsumptionRegistry.java
├── producer
│   ├── KafkaPublishException.java
│   ├── KafkaPublishResult.java
│   └── OrderEventPublisher.java
└── web
    ├── KafkaEventController.java
    ├── PublishOrderEventRequest.java
    └── PublishOrderEventResponse.java
```

Teste:

```text
src/test/java/br/com/formacao/m16/kafka
└── KafkaOrdersIntegrationTest.java
```

Ao final, a aplicação deverá:

1. conectar ao broker da aula 480;
2. declarar o topic com três partitions;
3. publicar `OrderCreatedEvent`;
4. usar `orderId` como key;
5. aguardar o acknowledgement do broker;
6. devolver topic, partition e offset;
7. consumir com grupo de projeção;
8. consumir com grupo de auditoria;
9. usar três consumers na projeção;
10. registrar metadata de cada consumo;
11. confirmar offsets após retorno normal;
12. comprovar grupos independentes;
13. comprovar mesma key na mesma partition;
14. parar e reiniciar sem reler offsets confirmados;
15. criar teste com Embedded Kafka;
16. executar o gate;
17. commitar;
18. preparar a comparação RabbitMQ vs Kafka.

---

## Conceito essencial

### Spring for Apache Kafka

Spring for Apache Kafka aplica abstrações Spring ao cliente Kafka.

Principais recursos usados nesta aula:

```text
KafkaTemplate:
publicação.

@KafkaListener:
consumo orientado a método.

KafkaAdmin:
administração.

NewTopic:
declaração de topic.

listener container:
poll, assignment, commit e lifecycle.

spring-kafka-test:
testes.
```

A dependência continua utilizando o cliente Kafka real.

Spring não transforma Kafka em RabbitMQ nem esconde partitions e offsets.

---

### Auto-configuração do Spring Boot

Ao adicionar:

```text
spring-kafka
```

o Spring Boot configura componentes a partir de:

```text
spring.kafka.*
```

Entre eles:

- producer factory;
- consumer factory;
- `KafkaTemplate`;
- listener container factory;
- `KafkaAdmin`.

A aplicação deve externalizar:

```text
bootstrap servers;

groups;

topic;

serializers;

deserializers;

ack mode.
```

Não crie todas as factories manualmente quando a auto-configuração atende ao caso.

---

### NewTopic e KafkaAdmin

Um bean `NewTopic` declara a expectativa da aplicação.

```java
@Bean
NewTopic ordersTopic() {
    return TopicBuilder
        .name(topicName)
        .partitions(3)
        .replicas(1)
        .build();
}
```

O Spring Boot já registra `KafkaAdmin`.

No startup, o admin tenta criar ou ajustar o topic quando permitido.

Cuidados:

- não use isso como substituto de governança;
- não reduza partitions;
- não invente replication factor produtivo;
- não apague topics automaticamente;
- não trate startup de aplicação como ferramenta universal de migração;
- valide permissões do cluster.

Nesta aula, o topic já existe com a mesma configuração.

---

### KafkaTemplate

`KafkaTemplate<K, V>` fornece operações de publicação.

A chamada principal será:

```java
kafkaTemplate.send(
    topic,
    key,
    value
);
```

O retorno é assíncrono e produz um `SendResult`.

O `SendResult` contém `RecordMetadata`, incluindo:

```text
topic;

partition;

offset;

timestamp.
```

Esses dados comprovam o append reconhecido conforme a configuração do producer.

Eles não comprovam que algum consumer processou o record.

---

### Key de negócio

A key será:

```text
orderId.
```

Motivo:

```text
eventos do mesmo pedido
precisam permanecer
na mesma partition
para preservar ordem relativa.
```

A key não será:

- messageId aleatório;
- customerId;
- nome do consumer;
- nome do group;
- routing key RabbitMQ.

A escolha da key é decisão de modelagem.

---

### JSON sem acoplamento de classe no header

O `JsonSerializer` pode adicionar metadata de tipo Java.

Nesta baseline, os headers de tipo serão desabilitados.

O consumer configurará explicitamente o tipo esperado:

```text
OrderCreatedEvent.
```

Benefícios:

- não publicar nome de classe Java;
- reduzir acoplamento entre packages;
- tornar o contrato mais explícito;
- facilitar consumers em outras linguagens.

Isso ainda não substitui schema formal.

Schema evolution será estudado na aula 484.

---

### Consumer group como capacidade

O grupo de projeção representa:

```text
construir ou atualizar
uma visão local de pedidos.
```

O grupo de auditoria representa:

```text
registrar a passagem
dos eventos.
```

Cada grupo recebe todos os records compatíveis do topic, respeitando seus próprios offsets.

Dois listeners com o mesmo group id dividiriam as partitions.

Dois listeners com groups diferentes recebem leituras independentes.

---

### Listener container

`@KafkaListener` registra um endpoint.

O container realiza:

- conexão;
- subscription;
- join do group;
- poll;
- assignment;
- invocação;
- commit;
- rebalance;
- shutdown.

O método do listener recebe um `ConsumerRecord`.

Essa escolha deixa explícitos:

```text
key;

value;

topic;

partition;

offset;

timestamp;

headers.
```

---

### Concurrency

O listener de projeção utilizará:

```text
concurrency = 3.
```

Spring cria três child containers.

Com três partitions, cada consumer pode receber uma partition.

O listener de auditoria utilizará:

```text
concurrency = 1.
```

Um único consumer pode receber as três partitions.

Concurrency não cria cópias.

O group id continua sendo o mesmo para os child containers da projeção.

---

### Ack mode RECORD

Configuração:

```text
spring.kafka.listener.ack-mode=record.
```

Para record listeners, o container confirma o offset de cada record depois que o listener retorna normalmente.

Não use:

```text
enable-auto-commit=true.
```

A aplicação deve manter o controle do commit pelo container.

Ack `RECORD` não é transação entre o efeito local e o offset.

Cenário:

```text
consumer grava efeito;

processo falha antes do commit;

record pode voltar.
```

A aplicação precisa tolerar duplicidade.

---

### auto.offset.reset

A baseline usa:

```text
earliest.
```

Isso ajuda quando um group id novo é criado.

Se o grupo já possui committed offsets válidos, ele continua deles.

Reiniciar a aplicação não provoca replay automático.

---

### RecordMetadata e committed offset

Não confunda:

```text
RecordMetadata.offset:
posição atribuída ao record produzido.

committed offset:
posição confirmada pelo consumer group.
```

O producer conhece onde o record foi anexado.

Ele não conhece o progresso dos grupos.

---

### Teste embedded

`@EmbeddedKafka` inicia um broker para testes.

Ele permite validar:

- producer real;
- serializer;
- topic;
- consumer real;
- deserializer;
- listener;
- groups;
- metadata.

Ele não substitui testes com a imagem Kafka usada no ambiente.

Diferenças de configuração, segurança, rede e operação ainda precisam de validação própria.

---

## Mão na massa guiada

### 1. Criar o projeto

No Spring Initializr, utilize:

```text
Project:
Maven.

Language:
Java.

Java:
21.

Group:
br.com.formacao.m16.

Artifact:
kafka-orders-lab.

Package:
br.com.formacao.m16.kafka.
```

Dependências:

```text
Spring Web;

Validation;

Spring for Apache Kafka;

Spring Boot Actuator;

Spring Boot Starter Test.
```

Use a versão de Spring Boot adotada pelo curso.

Não atualize isoladamente somente para esta aula.

Extraia em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

---

### 2. Revisar o pom.xml

Confirme:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

Adicione para testes:

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka-test</artifactId>
    <scope>test</scope>
</dependency>
```

Não fixe versões dessas dependências.

Execute:

```powershell
.\mvnw.cmd clean compile
```

---

### 3. Configurar application.yaml

Arquivo:

```text
src/main/resources/application.yaml
```

Conteúdo:

```yaml
server:
  port: 8084

spring:
  application:
    name: "kafka-orders-lab"

  kafka:
    bootstrap-servers:
      - "${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}"

    admin:
      fail-fast: true

    producer:
      key-serializer:
        org.apache.kafka.common.serialization.StringSerializer

      value-serializer:
        org.springframework.kafka.support.serializer.JsonSerializer

      acks: "all"

      properties:
        enable.idempotence: true
        spring.json.add.type.headers: false

    consumer:
      enable-auto-commit: false
      auto-offset-reset: "earliest"

      key-deserializer:
        org.apache.kafka.common.serialization.StringDeserializer

      value-deserializer:
        org.springframework.kafka.support.serializer.JsonDeserializer

      properties:
        spring.json.trusted.packages:
          "br.com.formacao.m16.kafka.message"

        spring.json.value.default.type:
          "br.com.formacao.m16.kafka.message.OrderCreatedEvent"

        spring.json.use.type.headers: false

    listener:
      ack-mode: "record"

app:
  kafka:
    topics:
      orders: "m16.orders.partitioned.v1"

    groups:
      order-projection:
        "m16-order-projection-spring-v1"

      order-audit:
        "m16-order-audit-spring-v1"
```

Não coloque credenciais.

O broker local ainda não possui autenticação.

---

### 4. Criar nomes da topologia

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/config/KafkaTopicNames.java
```

```java
package br.com.formacao.m16.kafka.config;

public final class KafkaTopicNames {

    public static final String ORDERS =
        "m16.orders.partitioned.v1";

    public static final String ORDER_CREATED =
        "orders.created.v1";

    private KafkaTopicNames() {
    }
}
```

A property e a constante devem permanecer consistentes.

A property permite configuração; a constante documenta o contrato didático.

---

### 5. Declarar o topic

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/config/KafkaTopicConfiguration.java
```

```java
package br.com.formacao.m16.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfiguration {

    @Bean
    NewTopic ordersTopic(
        @Value("${app.kafka.topics.orders}")
        String topicName
    ) {
        return TopicBuilder
            .name(topicName)
            .partitions(3)
            .replicas(1)
            .build();
    }
}
```

Não adicione `KafkaAdmin` manual.

O Spring Boot já o auto-configura.

---

### 6. Criar o contrato do evento

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/message/OrderCreatedEvent.java
```

```java
package br.com.formacao.m16.kafka.message;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderCreatedEvent(
    UUID messageId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

O record é contrato de integração.

Não é entidade JPA nem request HTTP.

---

### 7. Criar o resultado de publicação

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/producer/KafkaPublishResult.java
```

```java
package br.com.formacao.m16.kafka.producer;

import java.time.Instant;
import java.util.UUID;

public record KafkaPublishResult(
    UUID messageId,
    String key,
    String topic,
    int partition,
    long offset,
    Instant brokerTimestamp
) {
}
```

---

### 8. Criar a exceção de publicação

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/producer/KafkaPublishException.java
```

```java
package br.com.formacao.m16.kafka.producer;

public class KafkaPublishException
        extends RuntimeException {

    public KafkaPublishException(
        String message,
        Throwable cause
    ) {
        super(message, cause);
    }
}
```

---

### 9. Criar o publisher

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/producer/OrderEventPublisher.java
```

```java
package br.com.formacao.m16.kafka.producer;

import br.com.formacao.m16.kafka.message.OrderCreatedEvent;
import java.time.Instant;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Component
public class OrderEventPublisher {

    private final KafkaTemplate<
        String,
        OrderCreatedEvent
    > kafkaTemplate;

    private final String topicName;

    public OrderEventPublisher(
        KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate,
        @Value("${app.kafka.topics.orders}")
        String topicName
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.topicName = topicName;
    }

    public KafkaPublishResult publish(
        OrderCreatedEvent event
    ) {
        try {
            SendResult<String, OrderCreatedEvent> result =
                kafkaTemplate
                    .send(
                        topicName,
                        event.orderId(),
                        event
                    )
                    .get(
                        10,
                        TimeUnit.SECONDS
                    );

            RecordMetadata metadata =
                result.getRecordMetadata();

            return new KafkaPublishResult(
                event.messageId(),
                event.orderId(),
                metadata.topic(),
                metadata.partition(),
                metadata.offset(),
                Instant.ofEpochMilli(
                    metadata.timestamp()
                )
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw new KafkaPublishException(
                "Kafka publication was interrupted",
                exception
            );
        } catch (
            ExecutionException
                | TimeoutException exception
        ) {
            throw new KafkaPublishException(
                "Kafka publication failed",
                exception
            );
        }
    }
}
```

O laboratório aguarda o resultado para devolver metadata.

Isso não significa que os consumers processaram.

---

### 10. Criar a observação de consumo

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/observation/ConsumedKafkaRecord.java
```

```java
package br.com.formacao.m16.kafka.observation;

import br.com.formacao.m16.kafka.message.OrderCreatedEvent;
import java.time.Instant;

public record ConsumedKafkaRecord(
    String capability,
    String groupId,
    String key,
    String topic,
    int partition,
    long offset,
    long recordTimestamp,
    String threadName,
    Instant consumedAt,
    OrderCreatedEvent event
) {
}
```

---

### 11. Criar o registry

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/observation/KafkaConsumptionRegistry.java
```

```java
package br.com.formacao.m16.kafka.observation;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;

@Component
public class KafkaConsumptionRegistry {

    private final List<ConsumedKafkaRecord> records =
        new CopyOnWriteArrayList<>();

    public void register(
        ConsumedKafkaRecord record
    ) {
        records.add(record);
    }

    public List<ConsumedKafkaRecord> findAll() {
        return List.copyOf(records);
    }

    public List<ConsumedKafkaRecord> findByMessageId(
        UUID messageId
    ) {
        return records
            .stream()
            .filter(
                record ->
                    record
                        .event()
                        .messageId()
                        .equals(messageId)
            )
            .toList();
    }

    public void clear() {
        records.clear();
    }
}
```

Não deduplique por `messageId`.

Dois grupos devem registrar o mesmo evento.

---

### 12. Criar o consumer de projeção

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/consumer/OrderProjectionConsumer.java
```

```java
package br.com.formacao.m16.kafka.consumer;

import br.com.formacao.m16.kafka.message.OrderCreatedEvent;
import br.com.formacao.m16.kafka.observation.ConsumedKafkaRecord;
import br.com.formacao.m16.kafka.observation.KafkaConsumptionRegistry;
import java.time.Instant;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderProjectionConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            OrderProjectionConsumer.class
        );

    private final KafkaConsumptionRegistry registry;
    private final String groupId;

    public OrderProjectionConsumer(
        KafkaConsumptionRegistry registry,
        @Value("${app.kafka.groups.order-projection}")
        String groupId
    ) {
        this.registry = registry;
        this.groupId = groupId;
    }

    @KafkaListener(
        id = "order-projection-listener",
        topics = "${app.kafka.topics.orders}",
        groupId =
            "${app.kafka.groups.order-projection}",
        clientIdPrefix = "order-projection",
        concurrency = "3"
    )
    public void consume(
        ConsumerRecord<
            String,
            OrderCreatedEvent
        > record
    ) {
        LOGGER.info(
            "Projection consumed key={} topic={} "
                + "partition={} offset={} thread={}",
            record.key(),
            record.topic(),
            record.partition(),
            record.offset(),
            Thread.currentThread().getName()
        );

        registry.register(
            new ConsumedKafkaRecord(
                "projection",
                groupId,
                record.key(),
                record.topic(),
                record.partition(),
                record.offset(),
                record.timestamp(),
                Thread.currentThread().getName(),
                Instant.now(),
                record.value()
            )
        );
    }
}
```

O group id do registro pode ser externalizado em uma evolução.

Nesta aula ele documenta o laboratório.

---

### 13. Criar o consumer de auditoria

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/consumer/OrderAuditConsumer.java
```

```java
package br.com.formacao.m16.kafka.consumer;

import br.com.formacao.m16.kafka.message.OrderCreatedEvent;
import br.com.formacao.m16.kafka.observation.ConsumedKafkaRecord;
import br.com.formacao.m16.kafka.observation.KafkaConsumptionRegistry;
import java.time.Instant;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderAuditConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            OrderAuditConsumer.class
        );

    private final KafkaConsumptionRegistry registry;
    private final String groupId;

    public OrderAuditConsumer(
        KafkaConsumptionRegistry registry,
        @Value("${app.kafka.groups.order-audit}")
        String groupId
    ) {
        this.registry = registry;
        this.groupId = groupId;
    }

    @KafkaListener(
        id = "order-audit-listener",
        topics = "${app.kafka.topics.orders}",
        groupId =
            "${app.kafka.groups.order-audit}",
        clientIdPrefix = "order-audit",
        concurrency = "1"
    )
    public void consume(
        ConsumerRecord<
            String,
            OrderCreatedEvent
        > record
    ) {
        LOGGER.info(
            "Audit consumed key={} topic={} "
                + "partition={} offset={}",
            record.key(),
            record.topic(),
            record.partition(),
            record.offset()
        );

        registry.register(
            new ConsumedKafkaRecord(
                "audit",
                groupId,
                record.key(),
                record.topic(),
                record.partition(),
                record.offset(),
                record.timestamp(),
                Thread.currentThread().getName(),
                Instant.now(),
                record.value()
            )
        );
    }
}
```

Um consumer de auditoria pode receber todas as partitions.

---

### 14. Criar request e response

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/web/PublishOrderEventRequest.java
```

```java
package br.com.formacao.m16.kafka.web;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PublishOrderEventRequest(
    @NotBlank
    String orderId,

    @NotBlank
    String customerId,

    @NotNull
    @DecimalMin("0.01")
    BigDecimal total
) {
}
```

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/web/PublishOrderEventResponse.java
```

```java
package br.com.formacao.m16.kafka.web;

import java.time.Instant;
import java.util.UUID;

public record PublishOrderEventResponse(
    UUID messageId,
    String status,
    String key,
    String topic,
    int partition,
    long offset,
    Instant brokerTimestamp
) {
}
```

---

### 15. Criar o controller

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/web/KafkaEventController.java
```

```java
package br.com.formacao.m16.kafka.web;

import br.com.formacao.m16.kafka.config.KafkaTopicNames;
import br.com.formacao.m16.kafka.message.OrderCreatedEvent;
import br.com.formacao.m16.kafka.observation.ConsumedKafkaRecord;
import br.com.formacao.m16.kafka.observation.KafkaConsumptionRegistry;
import br.com.formacao.m16.kafka.producer.KafkaPublishResult;
import br.com.formacao.m16.kafka.producer.OrderEventPublisher;
import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/lab/kafka/orders")
public class KafkaEventController {

    private final OrderEventPublisher publisher;
    private final KafkaConsumptionRegistry registry;

    public KafkaEventController(
        OrderEventPublisher publisher,
        KafkaConsumptionRegistry registry
    ) {
        this.publisher = publisher;
        this.registry = registry;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public PublishOrderEventResponse publish(
        @Valid
        @RequestBody
        PublishOrderEventRequest request
    ) {
        OrderCreatedEvent event =
            new OrderCreatedEvent(
                UUID.randomUUID(),
                KafkaTopicNames.ORDER_CREATED,
                1,
                Instant.now(),
                request.orderId(),
                request.customerId(),
                request.total()
            );

        KafkaPublishResult result =
            publisher.publish(event);

        return new PublishOrderEventResponse(
            result.messageId(),
            "APPENDED_TO_KAFKA",
            result.key(),
            result.topic(),
            result.partition(),
            result.offset(),
            result.brokerTimestamp()
        );
    }

    @GetMapping("/consumed")
    public List<ConsumedKafkaRecord> consumed() {
        return registry.findAll();
    }
}
```

`APPENDED_TO_KAFKA` não significa projeção ou auditoria concluída.

---

### 16. Iniciar o broker

Entre no laboratório anterior:

```powershell
Set-Location `
  "labs/m16/aula-479-kafka-fundamentos"
```

Inicie:

```powershell
docker start `
  "m16-kafka"
```

Confirme:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.partitioned.v1"
```

---

### 17. Iniciar a aplicação

Entre no projeto:

```powershell
Set-Location `
  "..\aula-481-consumers-producers-kafka\kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd spring-boot:run
```

Nos logs, procure:

- conexão;
- topic;
- group join;
- assignments;
- três child consumers de projeção;
- um consumer de auditoria.

Não dependa de texto exato de log.

---

### 18. Inspecionar grupos

Em outro terminal:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-spring-v1" `
  --members `
  --verbose
```

Confirme três members ou child consumers.

Depois:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-audit-spring-v1" `
  --members `
  --verbose
```

Confirme um member com múltiplas partitions.

---

### 19. Publicar o primeiro evento

```powershell
$body = @{
  orderId = "ORD-481-0001"
  customerId = "CUS-481-0001"
  total = 249.90
} |
  ConvertTo-Json

$response =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8084" +
      "/api/v1/lab/kafka/orders"
    ) `
    -ContentType "application/json" `
    -Body $body

$response
```

Observe:

```text
messageId;

status;

key;

topic;

partition;

offset;

brokerTimestamp.
```

---

### 20. Consultar consumos

```powershell
Start-Sleep `
  -Seconds 2

$consumed =
  Invoke-RestMethod `
    "http://localhost:8084/api/v1/lab/kafka/orders/consumed"

$consumed |
  Format-Table `
    capability,
    key,
    partition,
    offset,
    threadName
```

Para o mesmo `messageId`, confirme:

```text
projection;

audit.
```

Os dois registros devem possuir:

```text
mesma key;

mesmo topic;

mesma partition;

mesmo offset.
```

Eles representam o mesmo record lido por grupos diferentes.

---

### 21. Publicar eventos da mesma key

```powershell
1..5 | ForEach-Object {

  $body = @{
    orderId = "ORD-481-SAME"
    customerId = "CUS-481-SAME"
    total = 100 + $_
  } |
    ConvertTo-Json

  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8084" +
      "/api/v1/lab/kafka/orders"
    ) `
    -ContentType "application/json" `
    -Body $body |
    Out-Null
}
```

Consulte e filtre:

```powershell
$consumed =
  Invoke-RestMethod `
    "http://localhost:8084/api/v1/lab/kafka/orders/consumed"

$consumed |
  Where-Object {
    $_.key -eq "ORD-481-SAME"
    -and
    $_.capability -eq "projection"
  } |
  Select-Object `
    partition,
    offset,
    @{
      Name = "messageId"
      Expression = {
        $_.event.messageId
      }
    }
```

Confirme a mesma partition e offsets crescentes.

---

### 22. Publicar keys diferentes

Publique:

```text
ORD-481-A;

ORD-481-B;

ORD-481-C;

ORD-481-D.
```

Observe a distribuição.

Não exija que cada key caia em uma partition distinta.

---

### 23. Observar concurrency

Filtre apenas projeção e agrupe por thread:

```powershell
$consumed |
  Where-Object {
    $_.capability -eq "projection"
  } |
  Group-Object threadName |
  Select-Object Name, Count
```

As threads correspondem aos child containers.

Em baixo volume, nem todas precisam aparecer.

Produza mais records com keys variadas para observar distribuição.

---

### 24. Confirmar commits

Aguarde alguns segundos e execute:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-spring-v1"
```

Confirme:

```text
LAG:
0
```

após consumo concluído.

Repita para auditoria.

---

### 25. Reiniciar sem replay

Pare a aplicação com:

```text
Ctrl + C.
```

Inicie novamente.

Não publique novos records imediatamente.

O registry em memória estará vazio.

Aguarde e consulte:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/api/v1/lab/kafka/orders/consumed"
```

Resultado esperado:

```text
lista vazia.
```

Os groups retomaram dos committed offsets.

`earliest` não forçou replay.

---

### 26. Publicar após restart

Publique um novo evento.

Os dois groups consomem apenas o novo record.

Confirme offsets posteriores aos anteriores.

---

### 27. Testar broker indisponível

Pare o broker:

```powershell
docker stop `
  "m16-kafka"
```

Execute o POST.

O publisher deve falhar ou atingir timeout.

O endpoint não deve devolver `APPENDED_TO_KAFKA`.

Reinicie o broker e aguarde a reconexão:

```powershell
docker start `
  "m16-kafka"
```

Não reduza o timeout para esconder indisponibilidade.

---

### 28. Criar o teste de integração

Arquivo:

```text
src/test/java/br/com/formacao/m16/kafka/KafkaOrdersIntegrationTest.java
```

```java
package br.com.formacao.m16.kafka;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import br.com.formacao.m16.kafka.config.KafkaTopicNames;
import br.com.formacao.m16.kafka.message.OrderCreatedEvent;
import br.com.formacao.m16.kafka.observation.KafkaConsumptionRegistry;
import br.com.formacao.m16.kafka.producer.OrderEventPublisher;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.annotation.DirtiesContext;

@SpringBootTest(
    properties = {
        "app.kafka.topics.orders=m16.orders.partitioned.test.v1",
        "app.kafka.groups.order-projection=m16-order-projection-test-v1",
        "app.kafka.groups.order-audit=m16-order-audit-test-v1"
    }
)
@EmbeddedKafka(
    partitions = 3,
    topics = "m16.orders.partitioned.test.v1",
    bootstrapServersProperty =
        "spring.kafka.bootstrap-servers"
)
@DirtiesContext
class KafkaOrdersIntegrationTest {

    @Autowired
    private OrderEventPublisher publisher;

    @Autowired
    private KafkaConsumptionRegistry registry;

    @BeforeEach
    void clearRegistry() {
        registry.clear();
    }

    @Test
    void shouldPublishAndConsumeInIndependentGroups() {
        UUID messageId = UUID.randomUUID();

        OrderCreatedEvent event =
            new OrderCreatedEvent(
                messageId,
                KafkaTopicNames.ORDER_CREATED,
                1,
                Instant.parse(
                    "2026-07-12T18:30:00Z"
                ),
                "ORD-481-TEST",
                "CUS-481-TEST",
                new BigDecimal("199.90")
            );

        publisher.publish(event);

        await()
            .atMost(Duration.ofSeconds(10))
            .untilAsserted(
                () -> {
                    var records =
                        registry.findByMessageId(
                            messageId
                        );

                    assertThat(records)
                        .extracting(
                            record ->
                                record.capability()
                        )
                        .containsExactlyInAnyOrder(
                            "projection",
                            "audit"
                        );

                    assertThat(records)
                        .allSatisfy(
                            record -> {
                                assertThat(record.key())
                                    .isEqualTo(
                                        "ORD-481-TEST"
                                    );

                                assertThat(record.event())
                                    .isEqualTo(event);
                            }
                        );
                }
            );
    }
}
```

O teste usa topic e groups próprios.

Isso reduz interferência entre testes.

---

### 29. Executar o teste

Pare a aplicação local para liberar recursos.

Execute:

```powershell
.\mvnw.cmd `
  -Dtest=KafkaOrdersIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

O Embedded Kafka não exige o container `m16-kafka`.

---

### 30. Revisar o fluxo

Confirme:

```text
topic:
declarado.

partitions:
3.

key:
orderId.

producer:
KafkaTemplate.

producer result:
topic, partition e offset.

projection group:
3 consumers.

audit group:
1 consumer.

commit:
RECORD.

auto commit:
false.

reset:
earliest somente sem offset válido.

test:
Embedded Kafka.
```

---

## Entendendo o que foi feito

### A aplicação passou a publicar records reais

`KafkaTemplate` utilizou key e value tipados.

### A key preservou afinidade

Records do mesmo pedido foram para a mesma partition.

### O producer passou a observar o append

`RecordMetadata` informou topic, partition e offset.

### Consumers passaram a usar grupos reais

Projection e audit leram o mesmo record independentemente.

### Concurrency ficou ligada às partitions

Três child containers dividiram as três partitions.

### Metadata entrou no código

`ConsumerRecord` expôs key, topic, partition, offset e timestamp.

### O commit ficou controlado pelo container

`enable-auto-commit=false` e ack `RECORD` formaram a baseline.

### Restart respeitou offsets

O registry vazio não foi repopulado com records antigos.

### JSON ficou menos acoplado a Java

Headers de tipo foram desabilitados e o tipo esperado foi configurado.

### O teste cobriu o fluxo real

Producer e listeners foram exercitados contra um broker embedded.

---

## Erros comuns importantes

### Publicar sem key quando a ordem por pedido importa

Eventos relacionados podem cair em partitions diferentes.

### Usar messageId como key

Cada evento recebe key distinta e perde afinidade do pedido.

### Tratar RecordMetadata como consumo concluído

Ela comprova append, não processamento.

### Usar o mesmo group para projeção e auditoria

Os consumers dividem records em vez de ambos receberem.

### Criar groups aleatórios a cada startup

Offsets anteriores deixam de ser reutilizados.

### Ativar auto commit

O progresso pode ser confirmado sem relação clara com o processamento.

### Usar earliest esperando replay em todo restart

Committed offsets válidos têm precedência.

### Configurar concurrency maior que partitions esperando ganho

Consumers adicionais ficam sem assignment.

### Publicar nome de classe Java como contrato

Consumers ficam acoplados ao package do producer.

### Criar topic automaticamente sem declaração

Partition count e governança ficam implícitos.

### Tratar replicas=1 como produção

Não existe tolerância à falha de broker.

### Fazer efeito não idempotente antes do commit

Redelivery pode repetir o efeito.

### Tratar Embedded Kafka como ambiente final

Rede, segurança e configuração real permanecem sem validação.

---

## Comandos úteis

### Iniciar Kafka

```powershell
docker start `
  "m16-kafka"
```

### Iniciar aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

### Ver projection group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-spring-v1"
```

### Ver members

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-spring-v1" `
  --members `
  --verbose
```

### Teste

```powershell
.\mvnw.cmd `
  -Dtest=KafkaOrdersIntegrationTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Projeto

Crie o Spring Boot com Kafka.

### Parte 2 — Topic

Declare três partitions com `NewTopic`.

### Parte 3 — Producer

Publique com `KafkaTemplate`.

### Parte 4 — Key

Use `orderId`.

### Parte 5 — Projection

Crie group com concurrency três.

### Parte 6 — Audit

Crie group independente.

### Parte 7 — Metadata

Registre partition e offset.

### Parte 8 — Restart

Comprove retomada por commit.

### Parte 9 — Falha

Pare o broker e impeça falso sucesso.

### Parte 10 — Teste

Valide com Embedded Kafka.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 480 foi preservada;
- projeto Spring Boot foi criado;
- Java 21 foi mantido;
- Spring Kafka foi adicionado;
- versões isoladas não foram fixadas;
- `spring-kafka-test` foi adicionado em test;
- auto-configuração do Spring Boot foi utilizada;
- bootstrap servers foram externalizados;
- broker local foi reutilizado;
- topic da aula 480 foi reutilizado;
- `NewTopic` foi criado;
- `TopicBuilder` foi usado;
- partitions ficaram em três;
- replicas ficaram em um;
- limitação do laboratório foi registrada;
- `KafkaAdmin` manual não foi duplicado;
- contrato `OrderCreatedEvent` foi criado;
- entidade JPA não foi usada;
- request HTTP não virou evento diretamente;
- `KafkaTemplate` foi usado;
- key foi `orderId`;
- `StringSerializer` foi configurado;
- `JsonSerializer` foi configurado;
- headers de tipo Java foram desabilitados;
- acks all foi configurado;
- idempotência do producer foi habilitada;
- idempotência não foi confundida com exactly-once;
- publisher aguardou resultado;
- timeout de publicação foi definido;
- interrupção restaurou o flag da thread;
- falha foi traduzida em exceção;
- `RecordMetadata` foi utilizado;
- topic produzido foi retornado;
- partition produzida foi retornada;
- offset produzido foi retornado;
- status não afirmou consumo concluído;
- `StringDeserializer` foi configurado;
- `JsonDeserializer` foi configurado;
- package confiável foi limitado;
- tipo default foi explícito;
- type headers não foram exigidos;
- auto commit ficou false;
- auto offset reset ficou earliest;
- ack mode ficou RECORD;
- consumer de projeção foi criado;
- consumer de auditoria foi criado;
- groups são diferentes;
- projeção possui concurrency três;
- auditoria possui concurrency um;
- `ConsumerRecord` foi utilizado;
- key foi observada;
- topic foi observado;
- partition foi observada;
- offset foi observado;
- timestamp foi observado;
- threads foram observadas;
- mesma key permaneceu na mesma partition;
- offsets cresceram na partition;
- keys diferentes puderam se distribuir;
- groups leram o mesmo record;
- registry preservou duas capacidades;
- committed offsets foram inspecionados;
- lag zero foi observado;
- restart não provocou replay;
- earliest foi interpretado corretamente;
- broker indisponível foi testado;
- falso sucesso foi impedido;
- Embedded Kafka foi usado;
- topic de teste foi isolado;
- groups de teste foram isolados;
- Awaitility foi usado;
- producer e consumers foram exercitados;
- teste embedded não foi tratado como produção;
- manual ack não foi antecipado;
- transactions não foram antecipadas;
- retry topic não foi antecipado;
- DLT não foi antecipada;
- Schema Registry não foi antecipado;
- Kafka Connect e Streams não foram antecipados;
- gate foi executado;
- commit recomendado está pronto;
- ponte para aula 482 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure configurações importantes:

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|@KafkaListener|NewTopic|ack-mode|enable-auto-commit|m16-order-projection-spring-v1"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
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
git commit -m "feat(m16): integrar producers e consumers Kafka"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- logs;
- storage do broker;
- credentials;
- payload real;
- offsets produtivos;
- topic temporário;
- classes geradas;
- target;
- retry topic;
- DLT;
- configuração transacional.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os conceitos Kafka das aulas 479 e 480 foram conectados ao Spring Boot.

O fluxo ficou:

```text
HTTP;

OrderEventPublisher;

KafkaTemplate;

key orderId;

topic;

partition;

offset;

projection group;

audit group;

listener containers;

ack RECORD;

committed offsets.
```

Você comprovou que:

- Spring Boot auto-configura Kafka por properties;
- `NewTopic` declara a necessidade de infraestrutura;
- `KafkaTemplate` publica records tipados;
- `orderId` mantém afinidade por pedido;
- `RecordMetadata` informa o append;
- grupos independentes leem o mesmo record;
- concurrency divide partitions dentro do grupo;
- `ConsumerRecord` expõe metadata;
- ack `RECORD` confirma depois do retorno normal;
- restart retoma de committed offsets;
- `earliest` não força replay quando o grupo possui posição;
- producer idempotente não cria exactly-once de negócio;
- teste embedded valida integração, mas não substitui ambiente real.

A próxima aula será:

```text
482 - M16.27 - RabbitMQ vs Kafka
```

Nela, você irá comparar:

- queue e log;
- exchange e topic;
- binding e partitioning;
- acknowledgement e offset commit;
- retry/DLQ e replay;
- competing consumers e consumer groups;
- retenção;
- ordenação;
- escalabilidade;
- latência;
- operação;
- casos de uso;
- erros de escolha;
- uso combinado.

A próxima aula não implementará outra ferramenta.

Ela consolidará critérios arquiteturais com base nos dois laboratórios construídos.

---

# Material complementar

## Checkpoint final

- [ ] Criei o projeto Spring Kafka.
- [ ] Declarei o topic.
- [ ] Publiquei com key e JSON.
- [ ] Criei dois consumer groups.
- [ ] Observei partition e offset.
- [ ] Validei commits e restart.
- [ ] Executei Embedded Kafka.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Aplicação falha no startup

Confirme broker, porta 9092, topic e `spring.kafka.admin.fail-fast`.

### JsonDeserializer rejeita o payload

Revise default type, trusted package e versão do contrato.

### Listener recebe null ou Map

A configuração de deserializer não está apontando para `OrderCreatedEvent`.

### Três consumers não aparecem

Confirme concurrency, três partitions e group id correto.

### Audit não recebe

Confirme group distinto. Se usar o mesmo group, os records serão divididos.

### Registry mostra apenas uma capacidade

Um listener pode não ter iniciado, estar em outro topic ou falhar na deserialização.

### Mesmo pedido aparece em outra partition

Revise a key, o topic e mudanças na quantidade de partitions.

### Offset não avança

O listener pode estar falhando antes do retorno ou o group id consultado está incorreto.

### Aplicação relê tudo após restart

O group id mudou, offsets não foram confirmados ou foram removidos/resetados.

### POST trava com broker parado

O publisher aguarda o timeout configurado. Não transforme timeout em falso sucesso.

### Teste embedded interfere em outro teste

Use topic e groups exclusivos e mantenha `@DirtiesContext`.

### Awaitility expira

Revise bootstrap server do embedded broker, listeners e deserialização.

---

## Perguntas de revisão

1. O que Spring Kafka fornece?
2. O que KafkaTemplate faz?
3. O que NewTopic representa?
4. Quem auto-configura KafkaAdmin?
5. Qual key foi usada?
6. Por que orderId?
7. O que RecordMetadata informa?
8. Ele prova consumo?
9. Por que dois groups?
10. O que concurrency três cria?
11. Cria três cópias?
12. O que ConsumerRecord expõe?
13. Por que auto commit ficou false?
14. Quando RECORD confirma?
15. O que earliest faz?
16. Restart relê tudo?
17. Idempotência do producer é exactly-once?
18. Para que serve Embedded Kafka?
19. Retry topic foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Abstrações Spring para Kafka.
2. Publica records.
3. Necessidade declarada de topic.
4. Spring Boot.
5. orderId.
6. Afinidade e ordem por pedido.
7. Topic, partition, offset e timestamp.
8. Não.
9. Capacidades independentes.
10. Três consumers no mesmo group.
11. Não.
12. Key, value e metadata.
13. Para o container controlar commit.
14. Após retorno normal do record listener.
15. Inicia no primeiro offset disponível sem posição válida.
16. Não com offsets válidos.
17. Não.
18. Testar producer e consumer reais.
19. Não.
20. RabbitMQ vs Kafka.

---

## Desafio opcional

Crie o evento:

```text
orders.cancelled.v1
```

Requisitos:

- mesmo topic;
- mesma key `orderId`;
- contrato `OrderCancelledEvent`;
- estratégia de deserialização explicitamente projetada;
- consumer de auditoria;
- sem usar nome de classe Java como contrato;
- teste com topic isolado;
- nenhuma Schema Registry;
- nenhum retry topic;
- documentação do risco de múltiplos tipos no mesmo topic.

O desafio é opcional porque múltiplos tipos exigem uma decisão de contrato que será aprofundada nas aulas de eventos e schema evolution.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 481 - M16.26 - Consumers producers Kafka

- Continuei o laboratório Kafka das aulas 479 e 480.
- Criei uma aplicação Spring Boot com Java 21.
- Adicionei Spring for Apache Kafka.
- Mantive versões gerenciadas pelo Spring Boot.
- Adicionei `spring-kafka-test`.
- Configurei `spring.kafka.*`.
- Externalizei bootstrap servers.
- Reutilizei `m16.orders.partitioned.v1`.
- Declarei o topic com `NewTopic`.
- Usei `TopicBuilder`.
- Mantive três partitions e uma réplica local.
- Não dupliquei `KafkaAdmin`.
- Criei `OrderCreatedEvent`.
- Mantive evento separado de request e entidade.
- Configurei key como `orderId`.
- Configurei JSON no producer.
- Desabilitei headers de tipo Java.
- Configurei acks all.
- Habilitei idempotência do producer.
- Diferenciei idempotência de exactly-once.
- Publiquei com `KafkaTemplate`.
- Aguardei o resultado do broker.
- Observei topic, partition, offset e timestamp.
- Não tratei append como consumo concluído.
- Configurei JSON no consumer.
- Limitei trusted packages.
- Configurei tipo default explícito.
- Desabilitei auto commit.
- Usei ack mode RECORD.
- Usei auto offset reset earliest.
- Criei consumer de projeção.
- Criei consumer de auditoria.
- Usei groups independentes.
- Configurei concurrency três na projeção.
- Mantive concurrency um na auditoria.
- Consumi com `ConsumerRecord`.
- Observei key, topic, partition, offset e timestamp.
- Registrei threads dos child containers.
- Comprovei mesma key na mesma partition.
- Comprovei dois groups lendo o mesmo record.
- Inspecionei committed offsets e lag.
- Reiniciei sem replay.
- Testei broker indisponível.
- Impedi falso sucesso na publicação.
- Criei teste com `@EmbeddedKafka`.
- Isolei topic e groups de teste.
- Usei Awaitility para consumo assíncrono.
- Não antecipei manual ack, transactions, retry topic ou DLT.
- Próxima aula: RabbitMQ vs Kafka.
```

---

## Referência técnica curta

- Spring Boot — Apache Kafka Support.
- Spring for Apache Kafka — Quick Tour.
- Spring Kafka — Sending Messages.
- Spring Kafka — `KafkaListener` Annotation.
- Spring Kafka — Configuring Topics.
- Spring Kafka — Serialization and Deserialization.
- Spring Kafka — Testing Applications.
- Apache Kafka — Producer Configurations.
- Apache Kafka — Consumer Configurations.
- Apache Kafka — Consumer Groups.

Regra final:

```text
uma aplicação Spring Kafka deve manter explícitos contrato, key, topic, group e semântica de commit: o producer usa KafkaTemplate para anexar um evento JSON com orderId como key, recebe RecordMetadata do broker e não confunde append com processamento; o topic é declarado com NewTopic e três partitions; grupos de projeção e auditoria leem o mesmo record com offsets independentes; concurrency divide partitions dentro do grupo sem criar cópias; ConsumerRecord expõe key, topic, partition, offset e timestamp; auto commit permanece desabilitado e ack RECORD confirma depois do retorno normal; restart continua dos committed offsets, e testes com Embedded Kafka validam producer, serializers, listeners e groups sem substituir o ambiente real nem antecipar transactions, retry topics ou Schema Registry.
```
