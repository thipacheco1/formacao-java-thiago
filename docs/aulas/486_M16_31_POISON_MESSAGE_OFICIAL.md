# 486 - M16.31 - Poison message

## Apresentação da aula

Na aula 484, você evoluiu o contrato `orders.created.v1` sem quebrar readers antigos nem dados históricos.

Na aula 485, você modelou conceitualmente um Schema Registry com:

```text
subject;

subject version;

schema ID;

writer schema;

reader schema;

compatibility policy;

serializer;

deserializer;

cache.
```

Essas práticas reduzem a chance de mensagens incompatíveis entrarem no broker.

Elas não eliminam completamente o problema.

Em sistemas reais, ainda podem surgir records que o consumer não consegue processar.

Exemplos:

- JSON malformado;
- serializer incorreto;
- schema ID desconhecido;
- campo obrigatório ausente;
- tipo incompatível;
- versão não suportada;
- regra de negócio impossível;
- bug determinístico;
- producer não autorizado publicando no topic;
- record histórico incompatível com o reader atual;
- bytes corrompidos;
- evento enviado ao topic errado.

Uma mensagem que falha sempre na mesma posição pode impedir o avanço daquela partition.

O consumer tenta novamente.

A mesma falha acontece.

O offset não avança.

Os records seguintes permanecem aguardando.

Os logs crescem.

O lag aumenta.

Esse record é chamado de:

```text
poison message;

poison pill.
```

A pergunta central desta aula será:

```text
como impedir que uma mensagem
permanentemente inválida

bloqueie uma partition,

sem apagar silenciosamente
os bytes originais

e sem confundir falha permanente
com indisponibilidade transitória?
```

A solução será construída com:

```text
classificação de falhas;

consumo de bytes crus;

validação em camadas;

retry apenas para falha transitória;

quarantine topic;

preservação do payload original;

preservação de metadata;

avanço controlado do offset;

ausência de consumer automático
na quarentena.
```

O laboratório continuará na aplicação Spring Kafka:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Entretanto, utilizará topics exclusivos para não misturar poison messages com o fluxo anterior:

```text
main topic:
m16.orders.poison-lab.v1.

quarantine topic:
m16.orders.poison-lab.quarantine.v1.
```

O fluxo de sucesso será:

```text
producer;

main topic;

raw byte consumer;

parse;

contract validation;

semantic validation;

business processing;

commit.
```

O fluxo de falha permanente será:

```text
main topic;

raw byte consumer;

poison detected;

quarantine publisher;

quarantine topic;

offset da main topic avança.
```

O fluxo transitório será:

```text
main topic;

consumer;

falha transitória;

retry 1;

retry 2;

sucesso;

commit.
```

Quando a falha transitória não se recuperar:

```text
tentativas esgotadas;

recoverer;

quarantine topic;

offset avança.
```

A quarentena não será consumida automaticamente.

Ela será utilizada para:

- diagnóstico;
- alerta;
- inspeção;
- correção;
- decisão operacional;
- reprocessamento futuro controlado.

A aula não implementará:

- deduplicação;
- inbox pattern;
- outbox pattern;
- retry topic não bloqueante;
- DLT automática por annotation;
- reprocessador automático;
- transações Kafka;
- exactly-once;
- Schema Registry real;
- Avro;
- Protobuf;
- saga;
- CDC.

A deduplicação será a próxima aula.

Ao final, você deverá explicar:

```text
por que desserialização pode falhar
antes do listener tipado;

por que bytes originais
precisam ser preservados;

por que poison message
não deve receber retry infinito;

por que falha transitória
merece tratamento diferente;

por que quarentena não é lixo;

por que publicar na quarentena
precisa concluir antes
de avançar o offset;

por que quarentena não deve
ter consumer automático;

por que reprocessar pode duplicar efeitos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

489:
Saga orquestrada.
```

A aula 485 respondeu:

```text
como registrar schemas
e aplicar policies
antes da publicação?
```

A aula 486 responderá:

```text
o que fazer quando um record
já está no broker

e o consumer não consegue
interpretá-lo ou processá-lo?
```

Nesta aula:

```text
poison message:
sim.

JSON malformado:
sim.

contrato inválido:
sim.

versão não suportada:
sim.

falha permanente:
sim.

falha transitória:
sim.

bytes crus:
sim.

quarantine topic:
sim.

metadata:
sim.

retry limitado:
sim.

offset avançando:
sim.

reprocessamento automático:
não.

deduplicação:
não.

outbox:
não.

transaction:
não.
```

A regra central será:

```text
falha transitória pode ser repetida;

falha determinística deve ser isolada;

nenhuma falha deve ser descartada
sem evidência e decisão explícita.
```

---

## Objetivo prático

Ao final, a aplicação terá:

```text
src/main/java/br/com/formacao/m16/kafka
├── poison
│   ├── config
│   │   ├── PoisonKafkaConfiguration.java
│   │   └── PoisonTopicNames.java
│   ├── consumer
│   │   └── PoisonOrderConsumer.java
│   ├── error
│   │   ├── PoisonMessageCategory.java
│   │   ├── PoisonMessageException.java
│   │   └── TransientProjectionException.java
│   ├── observation
│   │   ├── PoisonProcessingRegistry.java
│   │   └── ProcessedPoisonLabRecord.java
│   ├── processing
│   │   ├── OrderPoisonMessageProcessor.java
│   │   └── TransientFailureSimulator.java
│   └── quarantine
│       └── QuarantinePublisher.java
└── web
    └── PoisonLabController.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/poison
├── OrderPoisonMessageProcessorTest.java
├── PoisonMessageIntegrationTest.java
└── QuarantinePublisherTest.java
```

Você irá:

1. criar topics isolados;
2. consumir `byte[]`;
3. preservar payload original;
4. classificar JSON malformado;
5. classificar contrato inválido;
6. classificar versão não suportada;
7. classificar regra de negócio permanente;
8. simular erro transitório;
9. aplicar três tentativas totais;
10. publicar falhas permanentes na quarentena;
11. publicar falha transitória esgotada na quarentena;
12. copiar metadata de origem;
13. adicionar categoria de falha;
14. não copiar headers sem revisão;
15. confirmar que a main partition continua;
16. confirmar que a quarentena não entra em loop;
17. inspecionar records via CLI;
18. testar o fluxo;
19. executar o gate;
20. commitar;
21. preparar deduplicação.

---

## Conceito essencial

### O que é poison message

Poison message é um record que não pode ser processado com sucesso pelo consumer atual e tende a falhar repetidamente de forma determinística.

Exemplo:

```text
offset 12:
JSON inválido.
```

O consumer pode ler os offsets `0` a `11`.

Ao chegar ao `12`, falha.

Sem uma política adequada, não alcança `13`, `14` e `15` naquela partition.

---

### Nem toda falha é poison

Falha transitória:

- timeout;
- serviço temporariamente indisponível;
- lock momentâneo;
- conexão encerrada;
- limite temporário;
- erro `503`;
- indisponibilidade breve de banco.

Falha permanente:

- JSON inválido;
- versão não suportada;
- campo obrigatório ausente;
- valor impossível;
- schema incompatível;
- event type errado;
- regra determinística;
- payload corrompido.

Retry pode ajudar a primeira categoria.

Retry normalmente não corrige a segunda.

---

### Falha antes do listener

O deserializer Kafka executa antes do método `@KafkaListener` tipado.

Fluxo:

```text
bytes;

deserializer;

objeto;

listener.
```

Se o deserializer falhar, o objeto nunca existe.

Por isso, um listener que espera:

```java
OrderCreatedEvent
```

não consegue receber diretamente o payload malformado.

Spring Kafka oferece `ErrorHandlingDeserializer`, que captura a exceção, preserva bytes em headers e encaminha o record ao error handler.

O laboratório desta aula utilizará outra estratégia válida:

```text
ByteArrayDeserializer;

parse controlado dentro do listener.
```

Motivos didáticos:

- visualizar bytes originais;
- classificar falhas;
- controlar metadata;
- testar quarentena;
- evitar que o erro aconteça antes do código do laboratório.

A aplicação produtiva pode utilizar `ErrorHandlingDeserializer` com `DefaultErrorHandler` e `DeadLetterPublishingRecoverer`.

---

### Validação em camadas

O processor validará:

```text
1. bytes existem;

2. JSON pode ser lido;

3. root é object;

4. campos obrigatórios existem;

5. tipos básicos são válidos;

6. eventType é suportado;

7. eventVersion é suportada;

8. regras semânticas são válidas;

9. regra de negócio pode executar.
```

Cada falha recebe uma categoria.

---

### Categorias

A baseline utilizará:

```text
EMPTY_PAYLOAD;

MALFORMED_JSON;

CONTRACT_VIOLATION;

UNSUPPORTED_EVENT_TYPE;

UNSUPPORTED_EVENT_VERSION;

SEMANTIC_VIOLATION;

PERMANENT_BUSINESS_FAILURE;

TRANSIENT_RETRIES_EXHAUSTED.
```

A categoria precisa ser estável o suficiente para métricas e operação.

Não use a mensagem completa da exception como categoria.

---

### Quarantine topic

A quarantine topic armazena records que não puderam continuar no fluxo principal.

Ela não deve ser confundida com:

```text
retry topic.
```

Retry topic representa uma nova tentativa planejada.

Quarantine topic representa:

```text
processamento interrompido;

causa ainda precisa de decisão.
```

---

### Preservação de bytes

O record em quarentena deve manter:

```text
value original em byte[];

key original quando segura;

topic original;

partition original;

offset original;

timestamp original;

group id;

categoria;

exception class;

exception message resumida;

momento da quarentena.
```

Não serializar novamente o payload inválido como objeto.

Isso pode:

- alterar bytes;
- esconder corrupção;
- normalizar campos;
- perder encoding;
- impossibilitar diagnóstico.

---

### Headers

Não copie todos os headers automaticamente.

Alguns podem conter:

- segredo;
- token;
- PII;
- rastreamento interno;
- stacktrace grande;
- informação não necessária.

A baseline cria headers novos e controlados.

---

### Offset depois da quarentena

O consumer só deve considerar o record recuperado depois que a publicação na quarentena for confirmada.

Fluxo correto:

```text
quarantine publish confirmado;

listener retorna;

container confirma offset.
```

Fluxo perigoso:

```text
ignorar erro;

retornar sucesso;

quarantine publish assíncrono falha depois.
```

Nesse caso, o record pode ser perdido.

---

### Quarantine publisher falhando

Se o broker não aceitar a publicação de quarentena, o publisher lança exception.

O listener também falha.

O offset não deve avançar como se a recuperação tivesse funcionado.

Isso pode bloquear temporariamente a partition, mas preserva a informação.

Perder silenciosamente é pior.

---

### Quarentena não é reprocessamento

A quarantine topic não possuirá listener automático.

O reprocessamento futuro precisa:

1. identificar a causa;
2. corrigir producer ou consumer;
3. verificar validade temporal;
4. verificar efeitos parciais;
5. aplicar deduplicação;
6. autorizar a operação;
7. definir limite;
8. registrar auditoria.

A próxima aula tratará deduplicação.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

---

### 2. Criar nomes dos topics

Arquivo:

```text
src/main/java/br/com/formacao/m16/kafka/poison/config/PoisonTopicNames.java
```

```java
package br.com.formacao.m16.kafka.poison.config;

public final class PoisonTopicNames {

    public static final String MAIN =
        "m16.orders.poison-lab.v1";

    public static final String QUARANTINE =
        "m16.orders.poison-lab.quarantine.v1";

    public static final String GROUP =
        "m16-orders-poison-validation-v1";

    private PoisonTopicNames() {
    }
}
```

---

### 3. Declarar os topics

Adicione dois beans `NewTopic`:

```java
@Bean
NewTopic poisonMainTopic() {
    return TopicBuilder
        .name(PoisonTopicNames.MAIN)
        .partitions(3)
        .replicas(1)
        .build();
}

@Bean
NewTopic poisonQuarantineTopic() {
    return TopicBuilder
        .name(PoisonTopicNames.QUARANTINE)
        .partitions(3)
        .replicas(1)
        .config(
            org.apache.kafka.common.config.TopicConfig
                .RETENTION_MS_CONFIG,
            "604800000"
        )
        .build();
}
```

Sete dias é apenas valor local.

Não copie essa retenção para produção sem decisão operacional.

---

### 4. Criar categorias

Arquivo:

```text
PoisonMessageCategory.java
```

```java
package br.com.formacao.m16.kafka.poison.error;

public enum PoisonMessageCategory {
    EMPTY_PAYLOAD,
    MALFORMED_JSON,
    CONTRACT_VIOLATION,
    UNSUPPORTED_EVENT_TYPE,
    UNSUPPORTED_EVENT_VERSION,
    SEMANTIC_VIOLATION,
    PERMANENT_BUSINESS_FAILURE,
    TRANSIENT_RETRIES_EXHAUSTED
}
```

---

### 5. Criar exceptions

```java
package br.com.formacao.m16.kafka.poison.error;

public class PoisonMessageException
        extends RuntimeException {

    private final PoisonMessageCategory category;

    public PoisonMessageException(
        PoisonMessageCategory category,
        String message
    ) {
        super(message);
        this.category = category;
    }

    public PoisonMessageException(
        PoisonMessageCategory category,
        String message,
        Throwable cause
    ) {
        super(message, cause);
        this.category = category;
    }

    public PoisonMessageCategory category() {
        return category;
    }
}
```

```java
package br.com.formacao.m16.kafka.poison.error;

public class TransientProjectionException
        extends RuntimeException {

    public TransientProjectionException(
        String message
    ) {
        super(message);
    }
}
```

---

### 6. Criar o processor

Arquivo:

```text
OrderPoisonMessageProcessor.java
```

Responsabilidade:

```text
byte[] -> evento validado.
```

Estrutura:

```java
package br.com.formacao.m16.kafka.poison.processing;

import br.com.formacao.m16.kafka.integration.compatibility.OrderCreatedV1Revision2Reader;
import br.com.formacao.m16.kafka.poison.error.PoisonMessageCategory;
import br.com.formacao.m16.kafka.poison.error.PoisonMessageException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class OrderPoisonMessageProcessor {

    private final ObjectMapper objectMapper;

    public OrderPoisonMessageProcessor(
        ObjectMapper objectMapper
    ) {
        this.objectMapper = objectMapper;
    }

    public OrderCreatedV1Revision2Reader parse(
        byte[] value
    ) {
        if (value == null || value.length == 0) {
            throw new PoisonMessageException(
                PoisonMessageCategory.EMPTY_PAYLOAD,
                "Payload is empty"
            );
        }

        JsonNode root;

        try {
            root = objectMapper.readTree(value);
        } catch (JsonProcessingException exception) {
            throw new PoisonMessageException(
                PoisonMessageCategory.MALFORMED_JSON,
                "Payload is not valid JSON",
                exception
            );
        }

        validateStructure(root);
        validateContract(root);

        try {
            return objectMapper.treeToValue(
                root,
                OrderCreatedV1Revision2Reader.class
            );
        } catch (JsonProcessingException exception) {
            throw new PoisonMessageException(
                PoisonMessageCategory.CONTRACT_VIOLATION,
                "Payload cannot be mapped to contract",
                exception
            );
        }
    }

    private void validateStructure(
        JsonNode root
    ) {
        if (!root.isObject()) {
            throw new PoisonMessageException(
                PoisonMessageCategory.CONTRACT_VIOLATION,
                "Payload root must be an object"
            );
        }

        requireText(root, "eventId");
        requireText(root, "eventType");
        requireInteger(root, "eventVersion");
        requireText(root, "occurredAt");
        requireText(root, "orderId");
        requireText(root, "customerId");
        requireNumber(root, "total");
    }

    private void validateContract(
        JsonNode root
    ) {
        String eventType =
            root.path("eventType").asText();

        if (!"orders.created.v1".equals(eventType)) {
            throw new PoisonMessageException(
                PoisonMessageCategory
                    .UNSUPPORTED_EVENT_TYPE,
                "Unsupported eventType"
            );
        }

        int version =
            root.path("eventVersion").asInt();

        if (version != 1) {
            throw new PoisonMessageException(
                PoisonMessageCategory
                    .UNSUPPORTED_EVENT_VERSION,
                "Unsupported eventVersion"
            );
        }

        if (
            root.path("total")
                .decimalValue()
                .signum() <= 0
        ) {
            throw new PoisonMessageException(
                PoisonMessageCategory
                    .SEMANTIC_VIOLATION,
                "Total must be positive"
            );
        }
    }

    private void requireText(
        JsonNode root,
        String field
    ) {
        JsonNode value = root.get(field);

        if (
            value == null
                || !value.isTextual()
                || value.asText().isBlank()
        ) {
            throw contractViolation(field);
        }
    }

    private void requireInteger(
        JsonNode root,
        String field
    ) {
        JsonNode value = root.get(field);

        if (
            value == null
                || !value.isIntegralNumber()
        ) {
            throw contractViolation(field);
        }
    }

    private void requireNumber(
        JsonNode root,
        String field
    ) {
        JsonNode value = root.get(field);

        if (
            value == null
                || !value.isNumber()
        ) {
            throw contractViolation(field);
        }
    }

    private PoisonMessageException contractViolation(
        String field
    ) {
        return new PoisonMessageException(
            PoisonMessageCategory.CONTRACT_VIOLATION,
            "Invalid or missing field: " + field
        );
    }
}
```

---

### 7. Criar simulador transitório

Arquivo:

```text
TransientFailureSimulator.java
```

```java
package br.com.formacao.m16.kafka.poison.processing;

import br.com.formacao.m16.kafka.integration.compatibility.OrderCreatedV1Revision2Reader;
import br.com.formacao.m16.kafka.poison.error.PoisonMessageException;
import br.com.formacao.m16.kafka.poison.error.PoisonMessageCategory;
import br.com.formacao.m16.kafka.poison.error.TransientProjectionException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class TransientFailureSimulator {

    private final Map<String, AtomicInteger> attempts =
        new ConcurrentHashMap<>();

    public void process(
        OrderCreatedV1Revision2Reader event
    ) {
        String orderId = event.orderId();

        if (orderId.startsWith("POISON-BUSINESS-")) {
            throw new PoisonMessageException(
                PoisonMessageCategory
                    .PERMANENT_BUSINESS_FAILURE,
                "Simulated permanent business failure"
            );
        }

        int attempt =
            attempts
                .computeIfAbsent(
                    orderId,
                    ignored -> new AtomicInteger()
                )
                .incrementAndGet();

        if (
            orderId.startsWith("TRANSIENT-RECOVER-")
                && attempt < 3
        ) {
            throw new TransientProjectionException(
                "Simulated recoverable failure"
            );
        }

        if (
            orderId.startsWith("TRANSIENT-EXHAUST-")
        ) {
            throw new TransientProjectionException(
                "Simulated persistent infrastructure failure"
            );
        }
    }
}
```

---

### 8. Criar producer factory de bytes

Arquivo:

```text
PoisonKafkaConfiguration.java
```

Utilize as properties do producer auto-configurado:

```java
@Bean
ProducerFactory<String, byte[]>
        quarantineProducerFactory(
    ProducerFactory<Object, Object>
        defaultProducerFactory
) {
    Map<String, Object> properties =
        new HashMap<>(
            defaultProducerFactory
                .getConfigurationProperties()
        );

    properties.put(
        ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
        StringSerializer.class
    );

    properties.put(
        ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
        ByteArraySerializer.class
    );

    return new DefaultKafkaProducerFactory<>(
        properties
    );
}

@Bean
KafkaTemplate<String, byte[]> quarantineKafkaTemplate(
    ProducerFactory<String, byte[]> producerFactory
) {
    return new KafkaTemplate<>(
        producerFactory
    );
}
```

Imports pertencem a:

```text
org.apache.kafka.clients.producer;

org.apache.kafka.common.serialization;

org.springframework.kafka.core.
```

---

### 9. Criar consumer factory raw

```java
@Bean
ConsumerFactory<String, byte[]> rawConsumerFactory(
    ConsumerFactory<Object, Object>
        defaultConsumerFactory
) {
    Map<String, Object> properties =
        new HashMap<>(
            defaultConsumerFactory
                .getConfigurationProperties()
        );

    properties.put(
        ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
        StringDeserializer.class
    );

    properties.put(
        ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
        ByteArrayDeserializer.class
    );

    properties.put(
        ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,
        false
    );

    return new DefaultKafkaConsumerFactory<>(
        properties
    );
}
```

---

### 10. Criar o quarantine publisher

Arquivo:

```text
QuarantinePublisher.java
```

```java
package br.com.formacao.m16.kafka.poison.quarantine;

import br.com.formacao.m16.kafka.poison.config.PoisonTopicNames;
import br.com.formacao.m16.kafka.poison.error.PoisonMessageCategory;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class QuarantinePublisher {

    private final KafkaTemplate<String, byte[]>
        kafkaTemplate;

    public QuarantinePublisher(
        KafkaTemplate<String, byte[]> kafkaTemplate
    ) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publish(
        ConsumerRecord<String, byte[]> source,
        PoisonMessageCategory category,
        Exception exception
    ) {
        RecordHeaders headers =
            new RecordHeaders();

        add(
            headers,
            "x-original-topic",
            source.topic()
        );

        add(
            headers,
            "x-original-partition",
            Integer.toString(source.partition())
        );

        add(
            headers,
            "x-original-offset",
            Long.toString(source.offset())
        );

        add(
            headers,
            "x-original-timestamp",
            Long.toString(source.timestamp())
        );

        add(
            headers,
            "x-failure-category",
            category.name()
        );

        add(
            headers,
            "x-exception-class",
            exception.getClass().getName()
        );

        add(
            headers,
            "x-exception-message",
            safeMessage(exception)
        );

        add(
            headers,
            "x-consumer-group",
            PoisonTopicNames.GROUP
        );

        add(
            headers,
            "x-quarantined-at",
            Instant.now().toString()
        );

        ProducerRecord<String, byte[]> target =
            new ProducerRecord<>(
                PoisonTopicNames.QUARANTINE,
                source.partition(),
                source.timestamp(),
                source.key(),
                source.value(),
                headers
            );

        try {
            kafkaTemplate
                .send(target)
                .get(
                    10,
                    TimeUnit.SECONDS
                );
        } catch (InterruptedException interrupted) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                "Quarantine publication interrupted",
                interrupted
            );
        } catch (Exception failure) {
            throw new IllegalStateException(
                "Quarantine publication failed",
                failure
            );
        }
    }

    private void add(
        RecordHeaders headers,
        String name,
        String value
    ) {
        headers.add(
            name,
            value.getBytes(
                StandardCharsets.UTF_8
            )
        );
    }

    private String safeMessage(
        Exception exception
    ) {
        String message =
            exception.getMessage();

        if (message == null) {
            return "No message";
        }

        return message.length() <= 300
            ? message
            : message.substring(0, 300);
    }
}
```

Não grave stacktrace completo em header.

---

### 11. Criar o error handler

No configuration:

```java
@Bean
DefaultErrorHandler poisonErrorHandler(
    QuarantinePublisher quarantinePublisher
) {
    ConsumerRecordRecoverer recoverer =
        (record, exception) ->
            quarantinePublisher.publish(
                cast(record),
                PoisonMessageCategory
                    .TRANSIENT_RETRIES_EXHAUSTED,
                exception
            );

    DefaultErrorHandler errorHandler =
        new DefaultErrorHandler(
            recoverer,
            new FixedBackOff(
                1_000L,
                2L
            )
        );

    errorHandler.addNotRetryableExceptions(
        PoisonMessageException.class
    );

    return errorHandler;
}

@SuppressWarnings("unchecked")
private ConsumerRecord<String, byte[]> cast(
    ConsumerRecord<?, ?> record
) {
    return (ConsumerRecord<String, byte[]>)
        record;
}
```

`FixedBackOff(1000, 2)` significa:

```text
uma entrega original;

duas novas tentativas;

três execuções totais.
```

---

### 12. Criar listener factory

```java
@Bean
ConcurrentKafkaListenerContainerFactory<
    String,
    byte[]
> rawPoisonKafkaListenerContainerFactory(
    ConsumerFactory<String, byte[]>
        rawConsumerFactory,
    DefaultErrorHandler poisonErrorHandler
) {
    ConcurrentKafkaListenerContainerFactory<
        String,
        byte[]
    > factory =
        new ConcurrentKafkaListenerContainerFactory<>();

    factory.setConsumerFactory(
        rawConsumerFactory
    );

    factory.setCommonErrorHandler(
        poisonErrorHandler
    );

    factory
        .getContainerProperties()
        .setAckMode(
            ContainerProperties.AckMode.RECORD
        );

    return factory;
}
```

---

### 13. Criar registry de sucesso

Arquivo:

```text
ProcessedPoisonLabRecord.java
```

```java
package br.com.formacao.m16.kafka.poison.observation;

import java.time.Instant;

public record ProcessedPoisonLabRecord(
    String orderId,
    String key,
    int partition,
    long offset,
    Instant processedAt
) {
}
```

Crie `PoisonProcessingRegistry` com `CopyOnWriteArrayList`, métodos `register`, `findAll` e `clear`.

---

### 14. Criar consumer

Arquivo:

```text
PoisonOrderConsumer.java
```

```java
package br.com.formacao.m16.kafka.poison.consumer;

import br.com.formacao.m16.kafka.integration.compatibility.OrderCreatedV1Revision2Reader;
import br.com.formacao.m16.kafka.poison.config.PoisonTopicNames;
import br.com.formacao.m16.kafka.poison.error.PoisonMessageException;
import br.com.formacao.m16.kafka.poison.observation.PoisonProcessingRegistry;
import br.com.formacao.m16.kafka.poison.observation.ProcessedPoisonLabRecord;
import br.com.formacao.m16.kafka.poison.processing.OrderPoisonMessageProcessor;
import br.com.formacao.m16.kafka.poison.processing.TransientFailureSimulator;
import br.com.formacao.m16.kafka.poison.quarantine.QuarantinePublisher;
import java.time.Instant;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PoisonOrderConsumer {

    private final OrderPoisonMessageProcessor processor;
    private final TransientFailureSimulator simulator;
    private final QuarantinePublisher quarantinePublisher;
    private final PoisonProcessingRegistry registry;

    public PoisonOrderConsumer(
        OrderPoisonMessageProcessor processor,
        TransientFailureSimulator simulator,
        QuarantinePublisher quarantinePublisher,
        PoisonProcessingRegistry registry
    ) {
        this.processor = processor;
        this.simulator = simulator;
        this.quarantinePublisher = quarantinePublisher;
        this.registry = registry;
    }

    @KafkaListener(
        id = "poison-orders-listener",
        topics = PoisonTopicNames.MAIN,
        groupId = PoisonTopicNames.GROUP,
        concurrency = "3",
        containerFactory =
            "rawPoisonKafkaListenerContainerFactory"
    )
    public void consume(
        ConsumerRecord<String, byte[]> record
    ) {
        try {
            OrderCreatedV1Revision2Reader event =
                processor.parse(
                    record.value()
                );

            simulator.process(event);

            registry.register(
                new ProcessedPoisonLabRecord(
                    event.orderId(),
                    record.key(),
                    record.partition(),
                    record.offset(),
                    Instant.now()
                )
            );
        } catch (PoisonMessageException poison) {
            quarantinePublisher.publish(
                record,
                poison.category(),
                poison
            );
        }
    }
}
```

`TransientProjectionException` não é capturada.

Ela segue para o `DefaultErrorHandler`.

---

### 15. Criar endpoint de consulta

Arquivo:

```text
PoisonLabController.java
```

```java
package br.com.formacao.m16.kafka.web;

import br.com.formacao.m16.kafka.poison.observation.PoisonProcessingRegistry;
import br.com.formacao.m16.kafka.poison.observation.ProcessedPoisonLabRecord;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    "/api/v1/lab/kafka/poison"
)
public class PoisonLabController {

    private final PoisonProcessingRegistry registry;

    public PoisonLabController(
        PoisonProcessingRegistry registry
    ) {
        this.registry = registry;
    }

    @GetMapping("/processed")
    public List<ProcessedPoisonLabRecord> processed() {
        return registry.findAll();
    }
}
```

---

### 16. Iniciar broker e aplicação

```powershell
docker start `
  "m16-kafka"
```

Depois:

```powershell
.\mvnw.cmd spring-boot:run
```

Confirme os dois topics:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --list
```

---

### 17. Publicar record válido pela CLI

```powershell
$valid = @'
ORD-486-OK|{"eventId":"6fa96087-90d1-4eaa-b0bc-a741ec94f1cb","eventType":"orders.created.v1","eventVersion":1,"occurredAt":"2026-07-12T18:50:00Z","orderId":"ORD-486-OK","customerId":"CUS-486-OK","total":99.90,"salesChannel":"WEB"}
'@

$valid |
  docker exec `
    --interactive `
    "m16-kafka" `
    /opt/kafka/bin/kafka-console-producer.sh `
    --bootstrap-server "localhost:9092" `
    --topic "m16.orders.poison-lab.v1" `
    --property "parse.key=true" `
    --property "key.separator=|"
```

Consulte:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/api/v1/lab/kafka/poison/processed"
```

---

### 18. Publicar JSON malformado

```powershell
'ORD-486-BAD|{"eventId":' |
  docker exec `
    --interactive `
    "m16-kafka" `
    /opt/kafka/bin/kafka-console-producer.sh `
    --bootstrap-server "localhost:9092" `
    --topic "m16.orders.poison-lab.v1" `
    --property "parse.key=true" `
    --property "key.separator=|"
```

Resultado:

```text
MALFORMED_JSON;

quarantine topic recebe record;

main consumer continua.
```

---

### 19. Publicar contrato inválido

Envie JSON sem `customerId`.

Categoria esperada:

```text
CONTRACT_VIOLATION.
```

Depois envie um record válido na mesma key.

O record válido precisa ser processado.

Isso comprova que a partition avançou.

---

### 20. Publicar versão não suportada

Use:

```json
"eventVersion": 2
```

Categoria:

```text
UNSUPPORTED_EVENT_VERSION.
```

---

### 21. Publicar falha permanente de negócio

Use:

```text
orderId:
POISON-BUSINESS-486.
```

O payload é estruturalmente válido.

A regra de negócio falha deterministicamente.

Categoria:

```text
PERMANENT_BUSINESS_FAILURE.
```

Não aplique três retries.

---

### 22. Publicar falha transitória recuperável

Use:

```text
orderId:
TRANSIENT-RECOVER-486.
```

O listener falha duas vezes.

Na terceira execução, conclui.

Resultado:

```text
processed registry:
contém o record;

quarantine:
não recebe.
```

---

### 23. Publicar falha transitória esgotada

Use:

```text
orderId:
TRANSIENT-EXHAUST-486.
```

O `DefaultErrorHandler` executa:

```text
tentativa original;

retry 1;

retry 2;

recoverer.
```

Categoria final:

```text
TRANSIENT_RETRIES_EXHAUSTED.
```

---

### 24. Inspecionar quarentena

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.poison-lab.quarantine.v1" `
  --from-beginning `
  --property "print.key=true" `
  --property "print.headers=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Confirme:

- payload original;
- key original;
- original topic;
- original partition;
- original offset;
- categoria;
- exception class;
- exception message;
- quarantine timestamp.

---

### 25. Confirmar ausência de loop

Aguarde.

A quantidade de records na quarentena deve permanecer estável.

Não existe listener para a quarantine topic.

Não publique quarantine records novamente na main topic automaticamente.

---

### 26. Confirmar offsets do grupo

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-orders-poison-validation-v1"
```

Confirme lag `0` depois que os records foram processados ou colocados em quarentena.

---

### 27. Testar falha da quarentena

Pare o broker antes de uma publicação de quarentena.

O `QuarantinePublisher` falha.

O record não deve ser tratado como recuperado.

Depois de o broker retornar, o record poderá ser entregue novamente.

Esse comportamento evita perda silenciosa.

---

### 28. Criar testes unitários

`OrderPoisonMessageProcessorTest` deve cobrir:

- payload vazio;
- JSON malformado;
- root não objeto;
- campo ausente;
- tipo inválido;
- event type inválido;
- version inválida;
- total negativo;
- payload válido;
- `salesChannel` ausente com fallback.

---

### 29. Criar teste de integração

Com `@EmbeddedKafka`, crie os dois topics.

Publique:

```text
válido;

malformado;

versão inválida;

válido posterior.
```

Aguarde:

- dois válidos processados;
- dois records na quarantine topic;
- consumer não bloqueado.

Use um consumer de teste com `ByteArrayDeserializer` para ler a quarentena e validar bytes e headers.

---

### 30. Executar o gate

```powershell
.\mvnw.cmd `
  -Dtest=OrderPoisonMessageProcessorTest,PoisonMessageIntegrationTest,QuarantinePublisherTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### O consumer passou a sobreviver a bytes inválidos

`ByteArrayDeserializer` permitiu que o listener recebesse o payload original.

### Falhas foram classificadas

JSON, contrato, versão, semântica, negócio e infraestrutura ficaram separados.

### Retry deixou de ser universal

Somente `TransientProjectionException` foi repetida.

### Poison messages foram isoladas

Falhas determinísticas foram direto para quarentena.

### O payload original foi preservado

Nenhuma desserialização bem-sucedida foi exigida para armazenar a evidência.

### Metadata tornou o diagnóstico possível

Topic, partition e offset de origem ficaram registrados.

### A partition continuou avançando

Depois da quarentena confirmada, o listener retornou.

### Falha da quarentena não foi escondida

A recuperação também pode falhar.

### A quarentena permaneceu estável

Nenhum consumer automático criou novo loop.

### A próxima etapa ficou preparada

Reprocessamento futuro precisará de deduplicação.

---

## Erros comuns importantes

### Retry infinito para JSON inválido

Os bytes não mudam.

### Capturar exception e apenas logar

O offset pode avançar sem preservar a mensagem.

### Avançar offset antes da quarentena

Falha posterior pode perder o record.

### Recriar o objeto e publicar

Os bytes originais podem ser alterados.

### Copiar todos os headers

Segredos e dados desnecessários podem vazar.

### Publicar stacktrace completo em header

A mensagem cresce e expõe detalhes internos.

### Consumir a quarentena automaticamente

O sistema cria um loop de reprocessamento.

### Tratar todo erro de negócio como poison

Algumas falhas são transitórias.

### Tratar toda exception como transitória

Erros determinísticos ocupam threads e partitions.

### Usar quarantine como arquivo eterno

É necessário owner, retenção, alerta e procedimento.

### Ignorar falha do quarantine publisher

O record pode ser perdido.

### Reprocessar sem deduplicação

Efeitos já executados podem acontecer novamente.

---

## Comandos úteis

### Ver topics

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --list
```

### Ver grupo

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-orders-poison-validation-v1"
```

### Consumir quarentena

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.poison-lab.quarantine.v1" `
  --from-beginning `
  --property "print.headers=true"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Topics

Crie main e quarantine.

### Parte 2 — Bytes

Configure consumer raw.

### Parte 3 — Classificação

Implemente categorias.

### Parte 4 — Processor

Valide estrutura e semântica.

### Parte 5 — Retry

Repita apenas falha transitória.

### Parte 6 — Quarentena

Preserve bytes e metadata.

### Parte 7 — Continuidade

Prove que o próximo record é processado.

### Parte 8 — Falha da recuperação

Impeça perda silenciosa.

### Parte 9 — Testes

Cubra cada categoria.

### Parte 10 — Operação

Documente owner e procedimento.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 485 foi preservada;
- poison message foi definido;
- falha transitória foi diferenciada;
- falha permanente foi diferenciada;
- falha de desserialização foi explicada;
- `ErrorHandlingDeserializer` foi contextualizado;
- implementação raw bytes foi justificada;
- topic principal isolado foi criado;
- quarantine topic isolada foi criada;
- três partitions foram mantidas;
- quarantine possui pelo menos as mesmas partitions;
- retenção local foi explícita;
- payload `byte[]` foi preservado;
- key original foi preservada;
- topic original foi registrado;
- partition original foi registrada;
- offset original foi registrado;
- timestamp original foi registrado;
- group id foi registrado;
- categoria foi registrada;
- exception class foi registrada;
- exception message foi limitada;
- stacktrace completo não foi colocado em header;
- headers originais não foram copiados cegamente;
- JSON malformado foi classificado;
- payload vazio foi classificado;
- contrato inválido foi classificado;
- event type inválido foi classificado;
- version inválida foi classificada;
- semântica inválida foi classificada;
- regra de negócio permanente foi classificada;
- falha transitória foi simulada;
- falha transitória recuperável funcionou;
- falha transitória esgotada foi quarantined;
- três execuções totais foram explicadas;
- poison permanente não recebeu retry;
- quarantine publish foi aguardado;
- interrupção restaurou flag;
- falha do quarantine publisher foi propagada;
- offset só avançou após recuperação;
- record posterior foi processado;
- loop foi interrompido;
- quarantine não possui listener automático;
- lag voltou a zero;
- testes unitários foram criados;
- teste de integração foi criado;
- bytes e headers foram validados;
- Schema Registry real não foi antecipado;
- retry topic não foi antecipado;
- deduplicação não foi antecipada;
- outbox não foi antecipado;
- transaction não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 487 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure riscos:

```powershell
git grep `
  -n `
  -E `
  "quarantine|PoisonMessage|ByteArrayDeserializer|FixedBackOff|stacktrace|retry"
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
git commit -m "feat(m16): tratar poison messages Kafka"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- payload real;
- segredo em header;
- stacktrace completo;
- logs;
- storage Kafka;
- consumer automático da quarentena;
- reprocessador;
- deduplicação antecipada;
- código temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o consumer deixou de ficar vulnerável a um record permanentemente inválido.

O fluxo ficou:

```text
bytes;

parse;

contract validation;

semantic validation;

business processing;

retry transitório;

quarantine permanente;

offset controlado.
```

Você comprovou que:

- poison message pode bloquear uma partition;
- desserialização pode falhar antes do listener tipado;
- bytes crus permitem preservar evidência;
- falhas precisam de categorias estáveis;
- retry não corrige JSON inválido;
- falha transitória pode se recuperar;
- falha permanente deve ser isolada;
- quarantine topic não é retry topic;
- publicação na quarentena precisa ser confirmada;
- metadata de origem é essencial;
- quarantine sem consumer automático evita loop;
- record posterior pode continuar;
- reprocessamento ainda não é seguro sem deduplicação.

A próxima aula será:

```text
487 - M16.32 - Deduplicação
```

Nela, você irá:

- compreender entrega at-least-once;
- identificar eventos duplicados;
- escolher chave de idempotência;
- criar inbox de mensagens processadas;
- usar constraint única;
- controlar concorrência;
- diferenciar duplicate delivery e duplicate event;
- evitar efeitos duplicados;
- definir retenção do registro;
- preparar Outbox Pattern.

Nenhum mecanismo de deduplicação foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei topics isolados.
- [ ] Consumi bytes crus.
- [ ] Classifiquei falhas.
- [ ] Apliquei retry apenas ao transitório.
- [ ] Preservei payload e metadata.
- [ ] Publiquei na quarentena.
- [ ] Comprovei avanço da partition.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Listener tipado não recebe JSON inválido

A falha ocorre no deserializer. Use `ErrorHandlingDeserializer` ou consumo de bytes.

### Quarantine topic permanece vazia

Confirme topic, producer factory de `byte[]`, exception e partition count.

### Record fica repetindo

O quarantine publisher pode estar falhando ou a exception não foi classificada.

### Record permanente recebe três retries

Ele não foi capturado como `PoisonMessageException`.

### Record transitório não recebe retry

A exception pode estar sendo capturada dentro do listener.

### Payload aparece transformado

Algum serializer JSON foi usado na quarentena em vez de `ByteArraySerializer`.

### Headers não aparecem na CLI

Adicione `print.headers=true`.

### Lag não volta a zero

A recuperação ainda não concluiu ou existe record posterior pendente.

### Quarentena entra em loop

Algum listener está inscrito nela e republicando automaticamente.

### Teste embedded não termina

Revise groups, Awaitility e quantidade de records esperada.

---

## Perguntas de revisão

1. O que é poison message?
2. Toda falha é poison?
3. O que é falha transitória?
4. O que é falha permanente?
5. Quando deserialização acontece?
6. Por que consumir bytes crus?
7. O que é quarantine topic?
8. Ela é retry topic?
9. Por que preservar bytes?
10. Quais metadados preservar?
11. Retry corrige JSON inválido?
12. Quantas execuções existem com dois retries?
13. Quando avançar offset?
14. E se quarantine publish falhar?
15. Deve existir consumer automático?
16. Por que limitar exception message?
17. Por que não copiar todos os headers?
18. Reprocessar já é seguro?
19. Deduplicação foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Record que falha repetidamente.
2. Não.
3. Pode desaparecer em nova tentativa.
4. Continua igual sem correção.
5. Antes do listener tipado.
6. Preservar e classificar.
7. Topic de isolamento.
8. Não.
9. Manter evidência original.
10. Topic, partition, offset e causa.
11. Não.
12. Três.
13. Após recuperação confirmada.
14. Propagar falha.
15. Não automaticamente.
16. Segurança e tamanho.
17. Podem conter dados sensíveis.
18. Não.
19. Não.
20. Deduplicação.

---

## Desafio opcional

Adicione uma categoria:

```text
UNKNOWN_SCHEMA_ID
```

Requisitos:

- simulação sem registry real;
- payload original preservado;
- header com schema ID fictício;
- quarantine imediata;
- nenhum retry;
- teste;
- nenhum consumer automático;
- documentação de que a correção depende do registry ou do producer.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 486 - M16.31 - Poison message

- Continuei após Schema Registry conceitual.
- Defini poison message.
- Diferenciei falha transitória e permanente.
- Entendi que desserialização ocorre antes do listener tipado.
- Contextualizei `ErrorHandlingDeserializer`.
- Escolhi consumo de bytes crus para o laboratório.
- Criei topic principal isolado.
- Criei quarantine topic isolada.
- Mantive três partitions.
- Configurei retenção local explícita.
- Criei categorias estáveis de falha.
- Classifiquei payload vazio.
- Classifiquei JSON malformado.
- Classifiquei contrato inválido.
- Classifiquei event type inválido.
- Classifiquei versão não suportada.
- Classifiquei semântica inválida.
- Classifiquei regra de negócio permanente.
- Simulei falha transitória recuperável.
- Simulei falha transitória esgotada.
- Configurei três execuções totais.
- Evitei retry em poison permanente.
- Preservei bytes originais.
- Preservei key, topic, partition e offset.
- Registrei categoria e exception.
- Limitei exception message.
- Não copiei todos os headers.
- Usei `ByteArraySerializer` na quarentena.
- Aguardei confirmação da publicação.
- Propaguei falha da quarentena.
- Avancei offset somente após recuperação.
- Comprovei que record posterior foi consumido.
- Mantive a quarentena sem consumer automático.
- Comprovei ausência de loop.
- Criei testes unitários e de integração.
- Não antecipei deduplicação ou outbox.
- Próxima aula: Deduplicação.
```

---

## Referência técnica curta

- Spring Kafka — Error Handling.
- Spring Kafka — `ErrorHandlingDeserializer`.
- Spring Kafka — `DefaultErrorHandler`.
- Spring Kafka — `DeadLetterPublishingRecoverer`.
- Spring Kafka — Serialization and Deserialization.
- Apache Kafka — Consumer Configurations.
- Apache Kafka — Consumer Groups.
- Apache Kafka — Delivery Semantics.
- Apache Kafka — Headers.
- Enterprise Integration Patterns — Dead Letter Channel.

Regra final:

```text
poison message é um record que falha de forma determinística e pode bloquear o avanço de uma partition; desserialização pode falhar antes do listener tipado, por isso o sistema precisa preservar bytes crus por meio de ErrorHandlingDeserializer ou de um consumer byte[]; falhas transitórias recebem poucas tentativas, enquanto JSON malformado, contrato inválido, versão não suportada e regra permanente seguem diretamente para uma quarantine topic; a quarentena preserva key, bytes, topic, partition, offset, timestamp e categoria, mas não copia headers ou stacktraces sem revisão; o offset da origem só deve avançar depois que a publicação de quarentena for confirmada; a quarentena não possui consumer automático, porque reprocessamento exige correção, autorização e deduplicação, tema da próxima aula.
```
