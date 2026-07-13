# 487 - M16.32 - Deduplicação

## Apresentação da aula

Na aula 486, você criou um fluxo para impedir que poison messages bloqueassem uma partition.

O consumer passou a:

```text
receber bytes;

classificar falhas;

repetir apenas erros transitórios;

preservar payload e metadata;

enviar falhas permanentes
para uma quarantine topic;

avançar depois da recuperação.
```

Esse fluxo permite que uma mensagem problemática seja isolada.

Ele não responde a outra característica fundamental de sistemas distribuídos:

```text
a mesma mensagem
pode ser entregue novamente.
```

Considere este cenário:

```text
1. consumer recebe o evento;

2. grava o efeito no banco;

3. a aplicação falha
   antes de confirmar o offset;

4. o Kafka entrega
   o mesmo record novamente;

5. o consumer executa
   o efeito outra vez.
```

O record pode ser igual.

A entrega pode ser legítima.

O broker não consegue saber se o efeito de negócio foi concluído.

Isso faz parte de uma semântica comum:

```text
at-least-once.
```

A pergunta central desta aula será:

```text
como permitir redelivery
sem repetir o efeito de negócio?
```

A resposta será construída com:

```text
idempotência;

chave de deduplicação;

inbox persistente;

constraint única;

transação de banco;

controle de concorrência;

retenção do histórico;

ack depois do commit.
```

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Um topic isolado será utilizado:

```text
m16.orders.dedup-lab.v1.
```

O consumer group será:

```text
m16-order-projection-dedup-v1.
```

O fluxo esperado será:

```text
Kafka record;

listener;

dedup handler;

transação de banco;

insert na inbox;

efeito de negócio;

commit;

retorno do listener;

commit do offset.
```

Quando o mesmo `eventId` aparecer novamente:

```text
insert na inbox;

unique constraint violation;

transação abortada;

duplicate reconhecido;

nenhum efeito repetido;

listener retorna;

offset avança.
```

A tabela de inbox utilizará a chave:

```text
consumer_name + event_id.
```

Essa composição é importante.

O mesmo evento pode ser processado legitimamente por:

```text
projection consumer;

audit consumer;

billing consumer.
```

Cada capacidade precisa de sua própria deduplicação.

A chave não será apenas:

```text
eventId.
```

Também não será apenas:

```text
topic + partition + offset.
```

O offset identifica uma posição física.

Um producer pode republicar o mesmo evento em outro offset.

A chave lógica estável será:

```text
eventId.
```

com o escopo:

```text
consumerName.
```

A aula também distinguirá três situações:

```text
duplicate delivery:

mesmo record entregue novamente.

duplicate event:

mesmo eventId publicado novamente,
possivelmente em outro offset.

semantic duplicate:

mesma intenção de negócio,
mas com outro eventId.
```

A inbox detecta os dois primeiros quando o `eventId` foi preservado.

Ela não detecta automaticamente o terceiro.

Exemplo:

```text
duas mensagens de criação
para o mesmo pedido,

cada uma com eventId diferente.
```

Nesse caso, uma invariante de domínio ou constraint de negócio também é necessária.

A aula não implementará:

- Outbox Pattern;
- Inbox + Outbox completa;
- transaction Kafka;
- exactly-once end-to-end;
- saga;
- CDC;
- idempotência de API externa;
- deduplicação aproximada;
- Bloom filter;
- cache como fonte de verdade;
- reprocessador automático da quarentena.

O Outbox Pattern será a próxima aula.

Ao final, você deverá explicar:

```text
por que at-least-once
permite redelivery;

por que eventId precisa ser estável;

por que offset não basta;

por que exists-then-insert
possui race condition;

por que unique constraint
é a fonte de verdade;

por que inbox e efeito
precisam da mesma transação;

por que ack deve acontecer
depois do commit;

por que deduplicação
não significa exactly-once;

por que a retenção da inbox
precisa acompanhar o replay.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

490:
Saga coreografada.
```

A aula 486 respondeu:

```text
como isolar um record
que nunca será processado
com sucesso?
```

A aula 487 responderá:

```text
como aceitar uma nova entrega
sem repetir o efeito
já concluído?
```

Nesta aula:

```text
at-least-once:
sim.

idempotência:
sim.

eventId:
sim.

inbox table:
sim.

constraint única:
sim.

transação:
sim.

concorrência:
sim.

redelivery:
sim.

duplicate event:
sim.

semantic duplicate:
sim.

retenção:
sim.

Outbox Pattern:
não.

exactly-once:
não.

Kafka transaction:
não.

saga:
não.
```

A regra central será:

```text
o consumer deve transformar
uma entrega repetida

em um resultado repetível
sem duplicar o efeito.
```

---

## Objetivo prático

Ao final, a aplicação terá:

```text
src/main/java/br/com/formacao/m16/kafka
├── dedup
│   ├── application
│   │   ├── DeduplicatingOrderCreatedHandler.java
│   │   ├── DuplicateMessageException.java
│   │   ├── OrderCreatedTransactionalProcessor.java
│   │   └── ProcessingOutcome.java
│   ├── config
│   │   ├── DedupKafkaConfiguration.java
│   │   └── DedupTopicNames.java
│   ├── consumer
│   │   └── DeduplicatingOrderCreatedConsumer.java
│   ├── inbox
│   │   ├── ProcessedMessageEntity.java
│   │   ├── ProcessedMessageRepository.java
│   │   └── ProcessedMessageService.java
│   ├── projection
│   │   ├── OrderProjectionEntity.java
│   │   └── OrderProjectionRepository.java
│   └── producer
│       └── DedupLabPublisher.java
└── web
    ├── DedupLabController.java
    ├── PublishDedupEventRequest.java
    └── PublishDedupEventResponse.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/dedup
├── DeduplicationConcurrencyTest.java
├── DeduplicationIntegrationTest.java
└── OrderCreatedTransactionalProcessorTest.java
```

Você irá:

1. adicionar persistência ao laboratório;
2. criar topic de deduplicação;
3. criar consumer group próprio;
4. criar inbox persistente;
5. criar constraint única composta;
6. criar projeção de negócio;
7. processar inbox e efeito na mesma transação;
8. capturar duplicata fora da transação;
9. usar `eventId` como chave lógica;
10. manter o escopo por consumer;
11. publicar o mesmo evento duas vezes;
12. comprovar offsets diferentes;
13. aplicar o efeito uma vez;
14. simular concorrência;
15. comprovar a constraint;
16. simular falha antes do commit;
17. comprovar rollback completo;
18. simular redelivery depois do commit;
19. definir retenção da inbox;
20. documentar semantic duplicates;
21. executar o gate;
22. commitar;
23. preparar Outbox Pattern.

---

## Conceito essencial

### At-least-once

At-least-once significa:

```text
uma mensagem será processada
uma ou mais vezes.
```

O objetivo é evitar perda, aceitando possível repetição.

Cenários de repetição:

- processo encerra antes do commit;
- rebalance acontece durante processamento;
- conexão cai;
- timeout de commit;
- ack não chega;
- retry do consumer;
- recuperação de broker;
- operador reseta offsets;
- mensagem é republicada;
- quarentena é reprocessada.

O consumer precisa considerar duplicidade como parte normal do sistema.

---

### Idempotência

Uma operação idempotente produz o mesmo estado final quando repetida com a mesma intenção.

Exemplo:

```text
marcar pedido como CONFIRMED
quando já está CONFIRMED.
```

Pode ser idempotente.

Exemplo não idempotente:

```text
incrementar saldo em 100
a cada execução.
```

Repetir produz outro resultado.

Deduplicação é uma estratégia para tornar efeitos não idempotentes seguros diante de entregas repetidas.

---

### Duplicate delivery

Duplicate delivery é a nova entrega do mesmo record.

Metadata pode permanecer:

```text
mesmo topic;

mesma partition;

mesmo offset;

mesmo eventId.
```

A causa normalmente está no ciclo de consumo e commit.

---

### Duplicate event

Duplicate event é uma nova publicação lógica do mesmo evento.

Pode possuir:

```text
mesmo eventId;

outro offset;

talvez outro timestamp de publicação.
```

A inbox baseada em `eventId` consegue detectá-lo.

---

### Semantic duplicate

Semantic duplicate representa a mesma ação de negócio com outro identificador técnico.

Exemplo:

```text
eventId A:
pedido ORD-1 criado.

eventId B:
pedido ORD-1 criado.
```

A inbox considera os eventos distintos.

A proteção precisa vir de:

- aggregate;
- constraint por orderId;
- idempotency key de comando;
- regra de negócio;
- versionamento de estado.

Deduplicação técnica não substitui invariantes.

---

### Chave de idempotência

Uma boa chave deve ser:

- estável;
- única para o fato;
- preservada em retries;
- preservada em republicações;
- produzida na origem;
- não derivada de horário;
- não regenerada pelo consumer.

Nesta aula:

```text
eventId.
```

O producer não pode criar um novo `eventId` quando apenas repete a publicação do mesmo evento.

---

### Por que offset não basta

A chave:

```text
topic + partition + offset
```

detecta redelivery do mesmo record.

Ela não detecta:

```text
mesmo eventId
republicado em outro offset.
```

Também fica acoplada à infraestrutura.

Por isso, metadata física é útil para auditoria, mas `eventId` é a chave lógica.

---

### Escopo por consumer

A inbox utilizará:

```text
consumer_name;

event_id.
```

Exemplo:

```text
projection + event A:
processado.

audit + event A:
processado.
```

Se a constraint fosse apenas `event_id`, o primeiro consumer impediria os outros.

---

### Inbox

Inbox é um registro persistente das mensagens já processadas por uma capacidade.

Campos mínimos:

```text
id;

consumer_name;

event_id;

event_type;

source_topic;

source_partition;

source_offset;

processed_at.
```

A inbox permite responder:

```text
este consumer
já aplicou este evento?
```

---

### Constraint única

A regra crítica será:

```sql
unique (
    consumer_name,
    event_id
)
```

A constraint pertence ao banco.

Ela continua válida com:

- várias threads;
- várias instâncias;
- vários pods;
- rebalances;
- processamento simultâneo.

Um `Set` em memória não oferece essa proteção.

---

### Race condition de exists-then-insert

Fluxo inseguro:

```text
thread A:
exists = false.

thread B:
exists = false.

thread A:
processa.

thread B:
processa.
```

As duas viram o mesmo estado antes do insert.

A verificação pode ser usada para observação, mas não como fonte de verdade.

A constraint única decide o vencedor.

---

### Mesma transação

A inbox e o efeito de negócio precisam compartilhar a mesma transação de banco.

Fluxo correto:

```text
BEGIN;

insert inbox;

apply effect;

COMMIT.
```

Se o efeito falhar:

```text
ROLLBACK inbox;

ROLLBACK effect.
```

Na próxima entrega, a mensagem pode tentar novamente.

Fluxo incorreto:

```text
insert inbox e commit;

efeito falha depois.
```

Na próxima entrega, a inbox diz “já processado”, embora o efeito não tenha sido concluído.

---

### Commit do Kafka depois do banco

Com ack `RECORD`, o listener retorna depois que a transação do banco foi confirmada.

Então o container confirma o progresso do grupo.

Janela importante:

```text
banco commitou;

offset não commitou;

record volta.
```

A inbox reconhece a duplicata e impede novo efeito.

Esse é exatamente o cenário que a deduplicação resolve.

---

### Deduplicação não é exactly-once

O sistema pode garantir:

```text
efeito local aplicado uma vez
por eventId e consumer,
dentro do banco protegido.
```

Isso não significa:

```text
exactly-once em toda arquitetura.
```

Uma chamada HTTP externa, um e-mail ou outro broker não participam automaticamente da transação do banco.

Para efeitos externos, é necessário:

- idempotency key no destino;
- protocolo próprio;
- outbox;
- workflow;
- compensação;
- reconciliação.

---

### Retenção da inbox

Se a inbox apagar registros cedo demais, um replay antigo pode reaplicar efeitos.

A retenção deve considerar:

- retenção do topic;
- janela de replay;
- quarentena;
- backups;
- recuperação;
- exigência regulatória;
- custo de storage.

Regra inicial:

```text
inbox retention
>= maior janela possível
de redelivery ou replay
+ margem operacional.
```

Não transforme essa regra em valor fixo universal.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

---

### 2. Adicionar persistência

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

H2 será utilizado no laboratório.

Em ambiente real, use o banco homologado pelo projeto.

Não fixe versões.

---

### 3. Configurar o datasource local

Adicione ao `application.yaml`:

```yaml
spring:
  datasource:
    url: "jdbc:h2:file:./data/dedup-lab;MODE=PostgreSQL"
    username: "sa"
    password: ""

  jpa:
    hibernate:
      ddl-auto: "update"

    open-in-view: false

    properties:
      hibernate:
        format_sql: true
```

`ddl-auto=update` é somente didático.

Produção deve usar migrations.

---

### 4. Criar nomes do laboratório

Arquivo:

```text
DedupTopicNames.java
```

```java
package br.com.formacao.m16.kafka.dedup.config;

public final class DedupTopicNames {

    public static final String MAIN =
        "m16.orders.dedup-lab.v1";

    public static final String GROUP =
        "m16-order-projection-dedup-v1";

    public static final String CONSUMER_NAME =
        "order-created-projection-v1";

    private DedupTopicNames() {
    }
}
```

---

### 5. Declarar o topic

```java
@Bean
NewTopic dedupLabTopic() {
    return TopicBuilder
        .name(DedupTopicNames.MAIN)
        .partitions(3)
        .replicas(1)
        .build();
}
```

---

### 6. Criar consumer factory tipada

Configure um `JsonDeserializer` específico para:

```text
OrderCreatedIntegrationEventV1.
```

```java
@Bean
ConsumerFactory<
    String,
    OrderCreatedIntegrationEventV1
> dedupConsumerFactory(
    KafkaProperties kafkaProperties
) {
    JsonDeserializer<
        OrderCreatedIntegrationEventV1
    > valueDeserializer =
        new JsonDeserializer<>(
            OrderCreatedIntegrationEventV1.class,
            false
        );

    valueDeserializer.addTrustedPackages(
        "br.com.formacao.m16.kafka.integration.event"
    );

    return new DefaultKafkaConsumerFactory<>(
        kafkaProperties
            .buildConsumerProperties(),
        new StringDeserializer(),
        valueDeserializer
    );
}
```

Crie uma listener factory com ack `RECORD`.

---

### 7. Criar ProcessedMessageEntity

Arquivo:

```text
ProcessedMessageEntity.java
```

```java
package br.com.formacao.m16.kafka.dedup.inbox;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "processed_message",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_processed_consumer_event",
            columnNames = {
                "consumer_name",
                "event_id"
            }
        )
    }
)
public class ProcessedMessageEntity {

    @Id
    private UUID id;

    @Column(
        name = "consumer_name",
        nullable = false,
        length = 120
    )
    private String consumerName;

    @Column(
        name = "event_id",
        nullable = false
    )
    private UUID eventId;

    @Column(
        name = "event_type",
        nullable = false,
        length = 120
    )
    private String eventType;

    @Column(
        name = "source_topic",
        nullable = false,
        length = 200
    )
    private String sourceTopic;

    @Column(
        name = "source_partition",
        nullable = false
    )
    private int sourcePartition;

    @Column(
        name = "source_offset",
        nullable = false
    )
    private long sourceOffset;

    @Column(
        name = "processed_at",
        nullable = false
    )
    private Instant processedAt;

    protected ProcessedMessageEntity() {
    }

    public ProcessedMessageEntity(
        UUID id,
        String consumerName,
        UUID eventId,
        String eventType,
        String sourceTopic,
        int sourcePartition,
        long sourceOffset,
        Instant processedAt
    ) {
        this.id = id;
        this.consumerName = consumerName;
        this.eventId = eventId;
        this.eventType = eventType;
        this.sourceTopic = sourceTopic;
        this.sourcePartition = sourcePartition;
        this.sourceOffset = sourceOffset;
        this.processedAt = processedAt;
    }
}
```

Não use o offset como unique key principal.

---

### 8. Criar repository da inbox

```java
package br.com.formacao.m16.kafka.dedup.inbox;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedMessageRepository
        extends JpaRepository<
            ProcessedMessageEntity,
            UUID
        > {

    long countByConsumerNameAndEventId(
        String consumerName,
        UUID eventId
    );
}
```

O `count` será usado em testes e observação.

Não será a proteção principal.

---

### 9. Criar projeção de negócio

Arquivo:

```text
OrderProjectionEntity.java
```

```java
package br.com.formacao.m16.kafka.dedup.projection;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "order_created_projection")
public class OrderProjectionEntity {

    @Id
    private UUID id;

    @Column(
        name = "event_id",
        nullable = false
    )
    private UUID eventId;

    @Column(
        name = "order_id",
        nullable = false,
        length = 100
    )
    private String orderId;

    @Column(
        name = "customer_id",
        nullable = false,
        length = 100
    )
    private String customerId;

    @Column(
        name = "total",
        nullable = false,
        precision = 19,
        scale = 2
    )
    private BigDecimal total;

    @Column(
        name = "applied_at",
        nullable = false
    )
    private Instant appliedAt;

    protected OrderProjectionEntity() {
    }

    public OrderProjectionEntity(
        UUID id,
        UUID eventId,
        String orderId,
        String customerId,
        BigDecimal total,
        Instant appliedAt
    ) {
        this.id = id;
        this.eventId = eventId;
        this.orderId = orderId;
        this.customerId = customerId;
        this.total = total;
        this.appliedAt = appliedAt;
    }
}
```

Repository:

```java
public interface OrderProjectionRepository
        extends JpaRepository<
            OrderProjectionEntity,
            UUID
        > {

    long countByEventId(UUID eventId);
}
```

---

### 10. Criar DuplicateMessageException

```java
package br.com.formacao.m16.kafka.dedup.application;

import java.util.UUID;

public class DuplicateMessageException
        extends RuntimeException {

    private final UUID eventId;

    public DuplicateMessageException(
        UUID eventId,
        Throwable cause
    ) {
        super(
            "Message already processed: " + eventId,
            cause
        );
        this.eventId = eventId;
    }

    public UUID eventId() {
        return eventId;
    }
}
```

---

### 11. Criar ProcessedMessageService

```java
package br.com.formacao.m16.kafka.dedup.inbox;

import br.com.formacao.m16.kafka.dedup.application.DuplicateMessageException;
import java.time.Instant;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class ProcessedMessageService {

    private final ProcessedMessageRepository repository;

    public ProcessedMessageService(
        ProcessedMessageRepository repository
    ) {
        this.repository = repository;
    }

    public void register(
        String consumerName,
        UUID eventId,
        String eventType,
        String sourceTopic,
        int sourcePartition,
        long sourceOffset,
        Instant processedAt
    ) {
        try {
            repository.saveAndFlush(
                new ProcessedMessageEntity(
                    UUID.randomUUID(),
                    consumerName,
                    eventId,
                    eventType,
                    sourceTopic,
                    sourcePartition,
                    sourceOffset,
                    processedAt
                )
            );
        } catch (
            DataIntegrityViolationException exception
        ) {
            throw new DuplicateMessageException(
                eventId,
                exception
            );
        }
    }
}
```

Em produção, valide o nome da constraint ou SQLState antes de classificar toda violação como duplicata.

---

### 12. Criar outcome

```java
package br.com.formacao.m16.kafka.dedup.application;

public enum ProcessingOutcome {
    PROCESSED,
    DUPLICATE
}
```

---

### 13. Criar processor transacional

```java
package br.com.formacao.m16.kafka.dedup.application;

import br.com.formacao.m16.kafka.dedup.config.DedupTopicNames;
import br.com.formacao.m16.kafka.dedup.inbox.ProcessedMessageService;
import br.com.formacao.m16.kafka.dedup.projection.OrderProjectionEntity;
import br.com.formacao.m16.kafka.dedup.projection.OrderProjectionRepository;
import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderCreatedTransactionalProcessor {

    private final ProcessedMessageService inbox;
    private final OrderProjectionRepository projection;
    private final Clock clock;

    public OrderCreatedTransactionalProcessor(
        ProcessedMessageService inbox,
        OrderProjectionRepository projection
    ) {
        this.inbox = inbox;
        this.projection = projection;
        this.clock = Clock.systemUTC();
    }

    @Transactional
    public void process(
        OrderCreatedIntegrationEventV1 event,
        String sourceTopic,
        int sourcePartition,
        long sourceOffset
    ) {
        inbox.register(
            DedupTopicNames.CONSUMER_NAME,
            event.eventId(),
            event.eventType(),
            sourceTopic,
            sourcePartition,
            sourceOffset,
            clock.instant()
        );

        projection.save(
            new OrderProjectionEntity(
                UUID.randomUUID(),
                event.eventId(),
                event.orderId(),
                event.customerId(),
                event.total(),
                clock.instant()
            )
        );
    }
}
```

Inbox e efeito compartilham a transação.

---

### 14. Criar handler externo

```java
package br.com.formacao.m16.kafka.dedup.application;

import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import org.springframework.stereotype.Component;

@Component
public class DeduplicatingOrderCreatedHandler {

    private final OrderCreatedTransactionalProcessor processor;

    public DeduplicatingOrderCreatedHandler(
        OrderCreatedTransactionalProcessor processor
    ) {
        this.processor = processor;
    }

    public ProcessingOutcome handle(
        OrderCreatedIntegrationEventV1 event,
        String topic,
        int partition,
        long offset
    ) {
        try {
            processor.process(
                event,
                topic,
                partition,
                offset
            );

            return ProcessingOutcome.PROCESSED;
        } catch (DuplicateMessageException duplicate) {
            return ProcessingOutcome.DUPLICATE;
        }
    }
}
```

A captura acontece fora da transação interceptada.

---

### 15. Criar consumer

```java
package br.com.formacao.m16.kafka.dedup.consumer;

import br.com.formacao.m16.kafka.dedup.application.DeduplicatingOrderCreatedHandler;
import br.com.formacao.m16.kafka.dedup.application.ProcessingOutcome;
import br.com.formacao.m16.kafka.dedup.config.DedupTopicNames;
import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class DeduplicatingOrderCreatedConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            DeduplicatingOrderCreatedConsumer.class
        );

    private final DeduplicatingOrderCreatedHandler handler;

    public DeduplicatingOrderCreatedConsumer(
        DeduplicatingOrderCreatedHandler handler
    ) {
        this.handler = handler;
    }

    @KafkaListener(
        id = "dedup-order-created-listener",
        topics = DedupTopicNames.MAIN,
        groupId = DedupTopicNames.GROUP,
        concurrency = "3",
        containerFactory =
            "dedupKafkaListenerContainerFactory"
    )
    public void consume(
        ConsumerRecord<
            String,
            OrderCreatedIntegrationEventV1
        > record
    ) {
        ProcessingOutcome outcome =
            handler.handle(
                record.value(),
                record.topic(),
                record.partition(),
                record.offset()
            );

        LOGGER.info(
            "Dedup outcome={} eventId={} topic={} "
                + "partition={} offset={}",
            outcome,
            record.value().eventId(),
            record.topic(),
            record.partition(),
            record.offset()
        );
    }
}
```

Duplicata retorna normalmente.

O container pode confirmar o offset.

---

### 16. Criar publisher do laboratório

Utilize:

```text
KafkaTemplate<String, Object>.
```

Publique:

```java
kafkaTemplate.send(
    DedupTopicNames.MAIN,
    event.orderId(),
    event
);
```

O request deverá aceitar um `eventId`.

Isso permite publicar exatamente o mesmo evento duas vezes.

Não gere novo ID no segundo envio.

---

### 17. Criar endpoint

Request:

```java
public record PublishDedupEventRequest(
    UUID eventId,
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

Endpoint:

```text
POST /api/v1/lab/kafka/dedup/publish.
```

Retorne:

- eventId;
- topic;
- partition;
- offset.

Dois POSTs com o mesmo body criam dois records com offsets diferentes.

---

### 18. Iniciar broker e aplicação

```powershell
docker start `
  "m16-kafka"
```

Depois:

```powershell
.\mvnw.cmd spring-boot:run
```

Confirme o topic.

---

### 19. Publicar o evento original

```powershell
$eventId = [guid]::NewGuid()

$body = @{
  eventId = $eventId
  orderId = "ORD-487-0001"
  customerId = "CUS-487-0001"
  total = 199.90
} |
  ConvertTo-Json

$first =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8084" +
      "/api/v1/lab/kafka/dedup/publish"
    ) `
    -ContentType "application/json" `
    -Body $body

$first
```

Resultado:

```text
PROCESSED;

inbox count:
1;

projection count:
1.
```

---

### 20. Publicar duplicata lógica

Execute o mesmo POST com o mesmo `$body`.

Resultado:

```text
outro Kafka offset;

mesmo eventId;

outcome DUPLICATE;

inbox count:
1;

projection count:
1.
```

Isso comprova que offset não é a chave de deduplicação.

---

### 21. Criar endpoint de observação

Adicione:

```text
GET /api/v1/lab/kafka/dedup/events/{eventId}.
```

Retorne:

```text
inboxOccurrences;

projectionOccurrences.
```

Não retorne entidade JPA diretamente.

Use DTO.

---

### 22. Simular concorrência

No teste, execute duas chamadas simultâneas ao handler com:

```text
mesmo consumer;

mesmo eventId;

offsets diferentes.
```

Use:

```text
ExecutorService;

CountDownLatch;

Future.
```

Resultado:

```text
um PROCESSED;

um DUPLICATE;

inbox:
1;

projection:
1.
```

A unique constraint resolve a corrida.

---

### 23. Testar rollback

Adicione um hook somente de teste ou mock no processor para lançar exception depois do registro da inbox e antes do save da projeção.

Resultado esperado:

```text
inbox:
0;

projection:
0.
```

Na próxima tentativa, o evento pode ser processado.

Isso comprova a transação compartilhada.

---

### 24. Simular redelivery depois do commit

Chame novamente o handler depois de a primeira transação confirmar.

Resultado:

```text
DUPLICATE;

efeito não repete.
```

Esse cenário representa:

```text
DB commit concluído;

offset commit falhou;

Kafka redeliver.
```

---

### 25. Inspecionar o group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-dedup-v1"
```

O lag deve retornar a zero.

Duplicatas também são consideradas tratadas.

---

### 26. Documentar semantic duplicate

Crie:

```text
docs/architecture/messaging/DEDUPLICATION_POLICY.md
```

Registre:

```text
technical key:
consumerName + eventId.

business invariant:
orderId cannot be created twice.

physical metadata:
topic + partition + offset.

duplicate delivery:
same physical record.

duplicate event:
same eventId, different physical record.

semantic duplicate:
same business action, different eventId.
```

---

### 27. Definir retenção

No documento, registre:

```text
topic retention;

maximum replay window;

quarantine retention;

inbox retention;

cleanup owner;

cleanup query;

audit requirement.
```

Não crie um job de limpeza nesta aula.

Uma limpeza incorreta pode reativar duplicatas antigas.

---

### 28. Criar teste de integração

Com `@EmbeddedKafka` e H2:

1. publique o mesmo evento duas vezes;
2. aguarde o group;
3. confirme dois offsets produzidos;
4. confirme inbox `1`;
5. confirme projection `1`;
6. confirme lag final;
7. reinicie o listener ou contexto quando necessário;
8. confirme que a deduplicação persiste no banco de teste durante o cenário.

Use topic e group exclusivos.

---

### 29. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=OrderCreatedTransactionalProcessorTest,DeduplicationConcurrencyTest,DeduplicationIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### A duplicidade virou cenário esperado

Redelivery deixou de ser tratado como exceção impossível.

### `eventId` virou chave lógica

A deduplicação não ficou presa ao offset.

### O escopo ficou por consumer

Capacidades independentes processam o mesmo evento.

### A inbox ficou persistente

Restart e múltiplas instâncias compartilham o histórico.

### A constraint resolveu concorrência

Dois consumers não aplicaram o efeito duas vezes.

### Inbox e projeção compartilharam transação

Falha intermediária remove os dois efeitos.

### O commit do offset veio depois

A transação termina antes do retorno do listener.

### Redelivery depois do commit ficou segura

A constraint identifica a repetição.

### Semantic duplicate permaneceu distinto

Outro eventId exige invariante de negócio.

### A próxima etapa ficou preparada

Outbox resolverá confiabilidade de publicação na origem.

---

## Erros comuns importantes

### Usar cache em memória

Restart perde o histórico.

### Usar apenas offset

Republicação em outro offset não é detectada.

### Usar eventId sem consumer scope

Um consumer bloqueia outro.

### Gerar novo eventId em retry

A duplicata fica invisível.

### Fazer exists antes de insert

Existe race condition.

### Não criar unique constraint

Várias instâncias podem vencer ao mesmo tempo.

### Registrar inbox fora da transação

O efeito pode falhar depois.

### Aplicar efeito antes da inbox

Concorrência pode repetir o efeito.

### Capturar toda DataIntegrityViolation como duplicata

Outra constraint pode ter falhado.

### Apagar inbox cedo

Replay antigo reaplica efeitos.

### Chamar API externa dentro da transação esperando atomicidade

A API não participa automaticamente.

### Declarar exactly-once

A garantia é limitada ao efeito local protegido.

---

## Comandos úteis

### Iniciar broker

```powershell
docker start `
  "m16-kafka"
```

### Iniciar aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

### Ver group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-projection-dedup-v1"
```

### Testes

```powershell
.\mvnw.cmd `
  -Dtest=*Deduplication*,OrderCreatedTransactionalProcessorTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Inbox

Crie entidade e repository.

### Parte 2 — Constraint

Use consumer + eventId.

### Parte 3 — Efeito

Crie projeção persistente.

### Parte 4 — Transação

Grave inbox e efeito juntos.

### Parte 5 — Duplicata

Publique o mesmo eventId duas vezes.

### Parte 6 — Concorrência

Execute dois handlers simultâneos.

### Parte 7 — Rollback

Falhe entre inbox e efeito.

### Parte 8 — Redelivery

Execute depois do commit.

### Parte 9 — Retenção

Documente a janela.

### Parte 10 — Testes

Valide integração completa.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 486 foi preservada;
- at-least-once foi explicado;
- redelivery foi tratado como normal;
- idempotência foi explicada;
- duplicate delivery foi explicado;
- duplicate event foi explicado;
- semantic duplicate foi explicado;
- eventId foi escolhido como chave lógica;
- eventId precisa ser preservado;
- offset foi diferenciado da chave lógica;
- consumer scope foi incluído;
- inbox persistente foi criada;
- entidade de inbox foi criada;
- unique constraint composta foi criada;
- constraint pertence ao banco;
- cache em memória não foi usado como fonte de verdade;
- exists-then-insert foi rejeitado;
- race condition foi explicada;
- projection entity foi criada;
- inbox e efeito compartilham transação;
- inbox é registrada antes do efeito;
- falha posterior causa rollback;
- handler captura duplicata fora da transação;
- duplicata retorna outcome próprio;
- listener retorna normalmente na duplicata;
- ack acontece depois do processamento;
- janela DB commit e offset commit foi explicada;
- redelivery após DB commit foi testada;
- offsets diferentes com mesmo eventId foram testados;
- efeito ocorreu uma vez;
- inbox contém uma ocorrência;
- concorrência foi testada;
- um processamento venceu;
- outro foi classificado como duplicata;
- DataIntegrityViolation genérica recebeu ressalva;
- retenção da inbox foi documentada;
- retenção foi ligada ao replay;
- limpeza automática não foi criada;
- API externa foi reconhecida como outro boundary;
- deduplicação não foi chamada de exactly-once;
- Kafka transaction não foi antecipada;
- Outbox Pattern não foi antecipado;
- saga e CDC não foram antecipados;
- testes unitários foram criados;
- teste de integração foi criado;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 488 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Procure pontos críticos:

```powershell
git grep `
  -n `
  -E `
  "eventId|consumerName|UniqueConstraint|@Transactional|DuplicateMessage|existsBy"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/messaging/DEDUPLICATION_POLICY.md `
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
git commit -m "feat(m16): adicionar deduplicação persistente"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- banco local;
- diretório `data`;
- logs;
- target;
- payload real;
- job de limpeza inseguro;
- Outbox antecipada;
- transaction Kafka;
- credenciais.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o consumer passou a tolerar entregas repetidas sem repetir o efeito local.

O fluxo ficou:

```text
record;

eventId;

consumer scope;

unique constraint;

inbox;

business effect;

database transaction;

offset commit.
```

Você comprovou que:

- at-least-once permite redelivery;
- o mesmo evento pode aparecer em outro offset;
- `eventId` precisa ser estável;
- offset é metadata física;
- inbox precisa ser persistente;
- consumer name faz parte da chave;
- `exists` antes de `insert` não resolve concorrência;
- constraint única decide o vencedor;
- inbox e efeito precisam da mesma transação;
- rollback remove os dois;
- DB commit antes do offset commit é protegido pela inbox;
- semantic duplicate exige regra de negócio;
- retenção curta pode reativar duplicatas;
- deduplicação local não cria exactly-once global.

A próxima aula será:

```text
488 - M16.33 - Outbox Pattern
```

Nela, você irá:

- resolver a janela entre banco e broker;
- criar tabela outbox;
- gravar agregado e evento na mesma transação;
- criar publisher assíncrono;
- marcar eventos publicados;
- tratar retries de publicação;
- preservar eventId;
- combinar outbox e deduplicação;
- medir backlog;
- criar cleanup seguro;
- discutir polling publisher;
- preparar sagas.

Nenhum mecanismo de outbox foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Entendi at-least-once.
- [ ] Escolhi eventId como chave.
- [ ] Criei inbox persistente.
- [ ] Criei constraint única.
- [ ] Uni inbox e efeito em transação.
- [ ] Testei duplicata e concorrência.
- [ ] Documentei retenção.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Duplicata ainda gera projeção

Confirme unique constraint, consumer name e eventId preservado.

### Duas threads processam

A tabela pode não ter constraint real ou o schema não foi atualizado.

### Duplicate exception deixa transação rollback-only

Capture a exception fora do método transacional.

### Inbox fica registrada sem projeção

As duas operações não estão na mesma transação.

### Projeção existe sem inbox

O efeito foi executado antes do registro ou em outra transação.

### Novo offset não é detectado como duplicata

Confirme que o eventId foi mantido.

### Mesmo pedido com eventId novo passa

Isso é semantic duplicate. Crie invariante de negócio.

### Teste de concorrência é instável

Use latch para iniciar threads simultaneamente e aguarde todas as futures.

### H2 se comporta diferente do banco real

Execute testes de integração também no banco homologado antes de produção.

### Inbox cresce continuamente

Defina retenção baseada em replay e operação, não uma limpeza arbitrária.

---

## Perguntas de revisão

1. O que significa at-least-once?
2. O que é idempotência?
3. O que é duplicate delivery?
4. O que é duplicate event?
5. O que é semantic duplicate?
6. Qual chave foi escolhida?
7. Por que não usar offset?
8. Por que incluir consumer name?
9. O que é inbox?
10. Qual constraint foi criada?
11. Por que exists-then-insert falha?
12. Quem resolve concorrência?
13. Onde registrar inbox?
14. Onde aplicar o efeito?
15. O que acontece no rollback?
16. Quando o offset avança?
17. DB commit e offset failure é seguro?
18. Deduplicação é exactly-once?
19. Outbox foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma ou mais entregas.
2. Repetição sem alterar o resultado final.
3. Mesmo record entregue novamente.
4. Mesmo eventId republicado.
5. Mesma ação com outro eventId.
6. consumerName + eventId.
7. Republicação pode mudar o offset.
8. Consumers independentes.
9. Registro persistente de processados.
10. Unique composta.
11. Possui race condition.
12. A constraint do banco.
13. Na mesma transação do efeito.
14. Na mesma transação.
15. Ambos são desfeitos.
16. Depois do retorno normal.
17. Sim, redelivery vira duplicata.
18. Não globalmente.
19. Não.
20. Outbox Pattern.

---

## Desafio opcional

Adicione deduplicação ao consumer de auditoria.

Requisitos:

- mesmo `eventId`;
- outro `consumerName`;
- mesma tabela de inbox;
- constraint composta;
- audit effect separado;
- projection e audit processam uma vez cada;
- duplicatas de ambos são ignoradas;
- teste concorrente;
- nenhum Outbox Pattern.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 487 - M16.32 - Deduplicação

- Continuei após o tratamento de poison messages.
- Entendi entrega at-least-once.
- Tratei redelivery como cenário normal.
- Diferenciei idempotência e deduplicação.
- Diferenciei duplicate delivery.
- Diferenciei duplicate event.
- Diferenciei semantic duplicate.
- Escolhi `eventId` como chave lógica.
- Mantive `eventId` em republicações.
- Diferenciei eventId de topic, partition e offset.
- Adicionei consumer name ao escopo.
- Criei inbox persistente.
- Criei `ProcessedMessageEntity`.
- Criei unique constraint composta.
- Mantive o banco como fonte de verdade.
- Rejeitei cache em memória como proteção principal.
- Rejeitei `exists-then-insert`.
- Entendi a race condition.
- Criei projeção persistente.
- Registrei inbox antes do efeito.
- Coloquei inbox e efeito na mesma transação.
- Testei rollback completo.
- Capturei duplicata fora do método transacional.
- Criei outcomes PROCESSED e DUPLICATE.
- Publiquei o mesmo eventId em offsets diferentes.
- Apliquei o efeito apenas uma vez.
- Testei concorrência entre threads.
- Comprovei a unique constraint.
- Simulei redelivery depois do commit do banco.
- Protegi a janela antes do commit do offset.
- Documentei semantic duplicates.
- Documentei retenção da inbox.
- Relacionei retenção à janela de replay.
- Não criei job de limpeza inseguro.
- Não declarei exactly-once global.
- Não antecipei Outbox Pattern.
- Próxima aula: Outbox Pattern.
```

---

## Referência técnica curta

- Apache Kafka — Delivery Semantics.
- Apache Kafka — Consumer Groups.
- Spring Kafka — Committing Offsets.
- Spring Kafka — Transactions.
- Spring Framework — Transaction Management.
- Jakarta Persistence — Unique Constraints.
- PostgreSQL — Unique Constraints.
- Enterprise Integration Patterns — Idempotent Receiver.
- Microservices Patterns — Idempotent Consumer.
- Microsoft Architecture Center — Idempotent Message Processing.

Regra final:

```text
consumers em sistemas at-least-once precisam aceitar redelivery sem repetir efeitos: eventId é a chave lógica estável, topic-partition-offset é apenas metadata física, e a chave de inbox deve incluir consumerName para permitir capacidades independentes; a proteção precisa ser persistente e baseada em unique constraint, porque exists-then-insert possui race condition; o registro da inbox e o efeito de negócio devem ocorrer na mesma transação, de modo que falhas revertam ambos; depois do commit do banco, o listener retorna e o offset é confirmado, e se esse commit falhar a nova entrega será reconhecida como duplicata; semantic duplicates com eventIds diferentes exigem invariantes de negócio; a retenção da inbox deve cobrir a maior janela de replay, e essa garantia local não equivale a exactly-once end-to-end nem resolve a publicação atômica que será tratada pelo Outbox Pattern.
```
