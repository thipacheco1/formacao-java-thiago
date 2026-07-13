# 488 - M16.33 - Outbox Pattern

## Apresentação da aula

Na aula 483, você separou:

```text
evento de domínio;

evento de integração;

infraestrutura de publicação.
```

Na aula 487, você protegeu o lado consumidor com:

```text
eventId estável;

inbox persistente;

constraint única;

efeito e inbox
na mesma transação;

deduplicação.
```

Ainda existe um problema no lado produtor.

Considere o fluxo:

```text
1. aplicação cria um pedido;

2. banco confirma a transação;

3. aplicação publica no Kafka.
```

Se o processo falhar entre os passos `2` e `3`, o estado existe no banco, mas o evento não existe no broker.

Agora inverta:

```text
1. aplicação publica no Kafka;

2. aplicação grava o pedido.
```

Se a publicação funcionar e o banco falhar, outros sistemas recebem um evento sobre um pedido que não foi persistido.

A aplicação precisa coordenar dois recursos:

```text
banco de dados;

broker.
```

Sem uma estratégia, surgem estados inconsistentes:

```text
pedido sem evento;

evento sem pedido.
```

A pergunta central desta aula será:

```text
como gravar o estado do negócio
e a intenção de publicação

em uma única transação local,

sem exigir uma transação distribuída
entre banco e Kafka?
```

A resposta será:

```text
Outbox Pattern.
```

O Outbox Pattern transforma a publicação em duas etapas confiáveis:

```text
transação de negócio:

pedido + outbox.

processo assíncrono:

outbox + Kafka.
```

O fluxo ficará:

```text
HTTP request;

application service;

BEGIN DATABASE TRANSACTION;

insert order;

insert outbox_event;

COMMIT;

HTTP response;

publisher job;

claim outbox row;

KafkaTemplate.send;

broker acknowledgement;

mark PUBLISHED.
```

O evento deixa de depender da memória do processo.

A intenção de publicação fica persistida na mesma transação do estado do pedido.

Se a aplicação encerrar após o commit, o registro permanece:

```text
PENDING.
```

Quando a aplicação voltar, o publisher continua.

A aula implementará a variante:

```text
polling publisher.
```

Um job periódico buscará registros pendentes e tentará publicá-los.

Uma alternativa baseada em CDC será estudada conceitualmente na aula 491.

Nesta aula, não será usado:

- Debezium;
- leitura do transaction log;
- Kafka Connect;
- transação distribuída;
- XA;
- two-phase commit;
- Kafka transaction;
- exactly-once end-to-end;
- saga;
- Inbox Pattern completo;
- CDC real.

O publisher será at-least-once.

Existe uma janela inevitável:

```text
Kafka confirmou;

aplicação falhou
antes de marcar PUBLISHED.
```

Quando o claim expirar, o registro será publicado novamente.

Isso não é defeito escondido.

É uma propriedade do desenho.

Por isso, o Outbox Pattern será combinado com a deduplicação da aula 487:

```text
producer preserva eventId;

consumer deduplica eventId.
```

A garantia prática será:

```text
nenhum evento confirmado
no banco é abandonado;

uma publicação pode se repetir;

o consumer precisa ser idempotente.
```

A próxima aula oficial será:

```text
489 - M16.34 - Inbox Pattern
```

Ela formalizará o lado consumidor como padrão arquitetural completo.

Ao final desta aula, você deverá explicar:

```text
por que salvar e publicar
diretamente cria dual write;

por que pedido e outbox
precisam da mesma transação;

por que o publisher
não deve manter transação de banco
aberta durante a chamada ao Kafka;

por que claim precisa ser atômico;

por que PROCESSING pode ficar órfão;

por que stale claims precisam
ser recuperados;

por que publish confirmado
ainda pode gerar duplicata;

por que eventId precisa ser preservado;

por que PUBLISHED
é diferente de processado
pelos consumers.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
486:
Poison message.

487:
Deduplicação.

488:
Outbox Pattern.

489:
Inbox Pattern.

490:
Saga conceitual.

491:
CDC conceitual.

492:
Reprocessamento seguro.
```

A aula 487 respondeu:

```text
como impedir que uma entrega repetida
duplique o efeito no consumer?
```

A aula 488 responderá:

```text
como impedir que uma transação
de negócio confirmada
perca seu evento?
```

Nesta aula:

```text
dual write:
sim.

outbox table:
sim.

mesma transação local:
sim.

polling publisher:
sim.

claim:
sim.

retry:
sim.

backoff:
sim.

stale claim:
sim.

backlog:
sim.

cleanup:
sim.

eventId preservado:
sim.

publicação duplicada:
sim.

consumer dedup:
reutilizado.

Inbox Pattern completo:
não.

CDC:
não.

saga:
não.

XA:
não.

Kafka transaction:
não.
```

A regra central será:

```text
estado do negócio
e intenção de publicação

são gravados juntos;

a entrega ao broker
acontece depois
e pode ser repetida.
```

---

## Objetivo prático

O laboratório continua em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Ao final, a estrutura terá:

```text
src/main/java/br/com/formacao/m16/kafka
└── outbox
    ├── application
    │   ├── CreateOrderWithOutboxCommand.java
    │   ├── CreateOrderWithOutboxResult.java
    │   └── CreateOrderWithOutboxService.java
    ├── config
    │   ├── OutboxConfiguration.java
    │   └── OutboxTopicNames.java
    ├── order
    │   ├── OutboxOrderEntity.java
    │   └── OutboxOrderRepository.java
    ├── persistence
    │   ├── OutboxEventEntity.java
    │   ├── OutboxEventRepository.java
    │   ├── OutboxPublication.java
    │   └── OutboxStatus.java
    ├── publisher
    │   ├── OutboxKafkaPublisher.java
    │   ├── OutboxPublisherJob.java
    │   ├── OutboxStateService.java
    │   └── PublishedKafkaRecord.java
    └── web
        ├── CreateOutboxOrderRequest.java
        ├── CreateOutboxOrderResponse.java
        ├── OutboxController.java
        └── OutboxStatusResponse.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/outbox
├── CreateOrderWithOutboxIntegrationTest.java
├── OutboxAtomicityTest.java
├── OutboxPublisherIntegrationTest.java
├── OutboxPublisherJobTest.java
└── OutboxStaleClaimTest.java
```

Você irá:

1. definir dual write;
2. criar topic exclusivo;
3. criar tabela de pedidos;
4. criar tabela outbox;
5. usar `eventId` como ID do evento;
6. serializar o contrato;
7. salvar pedido e outbox juntos;
8. retornar antes da publicação;
9. criar status do lifecycle;
10. buscar candidatos em lote;
11. reivindicar uma linha atomicamente;
12. publicar fora da transação de banco;
13. aguardar acknowledgement do Kafka;
14. marcar `PUBLISHED`;
15. registrar partition e offset;
16. marcar falha e calcular backoff;
17. recuperar claims órfãos;
18. observar backlog;
19. testar broker indisponível;
20. testar duplicata depois do send;
21. validar consumer deduplicador;
22. criar cleanup seguro;
23. executar testes;
24. commitar;
25. preparar Inbox Pattern.

---

## Conceito essencial

### Dual write

Dual write acontece quando a aplicação precisa alterar dois recursos independentes.

Exemplo:

```text
UPDATE banco;

PUBLISH Kafka.
```

Não existe atomicidade automática entre essas operações.

Qualquer ordem possui janela de falha.

---

### Outbox

Outbox é uma tabela no mesmo banco do estado de negócio.

Na mesma transação:

```text
insert order;

insert outbox event.
```

Se a transação confirmar, os dois existem.

Se ela fizer rollback, nenhum existe.

---

### O que a outbox representa

A linha representa:

```text
um evento que precisa
ser publicado.
```

Ela não representa:

- confirmação de consumo;
- conclusão de todos os consumers;
- offset confirmado;
- processamento de saga;
- resposta síncrona;
- log completo de auditoria eterno.

---

### Lifecycle

A baseline utilizará:

```text
PENDING;

PROCESSING;

FAILED;

PUBLISHED.
```

Fluxo:

```text
PENDING
   |
   v
PROCESSING
   |
   +--> PUBLISHED
   |
   +--> FAILED
          |
          v
       PROCESSING.
```

Um `PROCESSING` antigo pode ser recuperado como `FAILED`.

---

### Polling publisher

O polling publisher executa periodicamente:

1. encontra candidatos;
2. tenta fazer claim;
3. publica no broker;
4. marca o resultado.

Vantagens:

- simples;
- não exige CDC;
- usa banco e aplicação existentes;
- fácil de testar.

Custos:

- consultas periódicas;
- latência do polling;
- necessidade de índices;
- concorrência entre instâncias;
- recuperação de claims;
- cleanup;
- monitoramento de backlog.

---

### Claim atômico

Duas instâncias podem encontrar o mesmo ID.

O claim precisa usar uma atualização condicional:

```sql
UPDATE outbox_event
SET status = 'PROCESSING'
WHERE id = ?
  AND status IN ('PENDING', 'FAILED')
  AND next_attempt_at <= now();
```

Apenas uma atualização retorna `1`.

A outra retorna `0`.

Não use apenas:

```text
select;

if pending;

update.
```

Isso possui race condition.

---

### Transações curtas

A chamada ao Kafka não deve ocorrer dentro da mesma transação que mantém locks da outbox.

Fluxo recomendado:

```text
transação curta:
claim.

sem transação de banco:
publish Kafka.

transação curta:
mark published ou failed.
```

Manter a transação aberta durante rede:

- segura conexão;
- segura locks;
- aumenta contenção;
- amplia rollback;
- reduz throughput.

---

### Publicação at-least-once

Cenário:

```text
Kafka append:
sucesso.

mark PUBLISHED:
não executado.

claim expira.

evento:
publicado novamente.
```

A mesma linha mantém:

```text
mesmo eventId;

mesmo payload lógico;

mesma key.
```

O novo record pode ter:

```text
outra partition:
não, se key e partition count
permanecerem compatíveis;

outro offset:
sim.
```

O consumer usa `eventId` para deduplicar.

---

### Backoff

Falhas de publicação não devem produzir loop acelerado.

A baseline utilizará backoff exponencial limitado:

```text
1s;

2s;

4s;

8s;

máximo configurado.
```

O registro permanece `FAILED` com:

- attempt count;
- next attempt;
- última causa;
- data do claim.

---

### Stale claim

O processo pode encerrar depois do claim.

A linha fica:

```text
PROCESSING.
```

Outro job precisa recuperar registros cujo:

```text
claimed_at
<
now - claim_timeout.
```

Eles voltam a `FAILED`, recebem nova tentativa e preservam o histórico.

---

### Backlog

Backlog da outbox inclui registros:

```text
PENDING;

FAILED;

PROCESSING antigo.
```

Métricas importantes:

- contagem por status;
- idade do mais antigo pendente;
- taxa de publicação;
- taxa de falha;
- tentativas;
- stale claims;
- duração de publicação;
- backlog por event type.

---

### Cleanup

Somente registros `PUBLISHED` antigos podem ser candidatos à limpeza.

Nunca apague automaticamente:

- `PENDING`;
- `FAILED`;
- `PROCESSING`;
- registro em investigação;
- dados ainda exigidos por auditoria.

A retenção precisa considerar operação e compliance.

---

### Polling e CDC

Polling lê a tabela pela aplicação.

CDC observa alterações no log transacional e publica por infraestrutura dedicada.

A aula 491 comparará CDC conceitualmente.

Nesta aula, apenas polling será implementado.

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

A deduplicação da aula 487 precisa continuar verde.

---

### 2. Ignorar o banco local

Adicione ao `.gitignore`:

```text
data/
*.mv.db
*.trace.db
```

Não commite o arquivo H2.

---

### 3. Criar o topic

Arquivo:

```text
OutboxTopicNames.java
```

```java
package br.com.formacao.m16.kafka.outbox.config;

public final class OutboxTopicNames {

    public static final String ORDERS =
        "m16.orders.outbox-lab.v1";

    private OutboxTopicNames() {
    }
}
```

Declare:

```java
@Bean
NewTopic outboxOrdersTopic() {
    return TopicBuilder
        .name(OutboxTopicNames.ORDERS)
        .partitions(3)
        .replicas(1)
        .build();
}
```

---

### 4. Habilitar scheduling

Arquivo:

```text
OutboxConfiguration.java
```

```java
package br.com.formacao.m16.kafka.outbox.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class OutboxConfiguration {
}
```

---

### 5. Configurar o publisher

Adicione ao `application.yaml`:

```yaml
app:
  outbox:
    publisher-delay-ms: 1000
    batch-size: 50
    claim-timeout-seconds: 30
    send-timeout-seconds: 10
    retry-base-seconds: 1
    retry-max-seconds: 60
    cleanup-retention-days: 7
    cleanup-batch-size: 100
```

Esses números pertencem ao laboratório.

Produção exige capacity planning.

---

### 6. Criar o estado do pedido

Arquivo:

```text
OutboxOrderEntity.java
```

```java
package br.com.formacao.m16.kafka.outbox.order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "outbox_order")
public class OutboxOrderEntity {

    @Id
    @Column(name = "order_id", length = 100)
    private String orderId;

    @Column(name = "customer_id", nullable = false, length = 100)
    private String customerId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 40)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected OutboxOrderEntity() {
    }

    public OutboxOrderEntity(
        String orderId,
        String customerId,
        BigDecimal total,
        String status,
        Instant createdAt
    ) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String orderId() {
        return orderId;
    }
}
```

Repository:

```java
package br.com.formacao.m16.kafka.outbox.order;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OutboxOrderRepository
        extends JpaRepository<OutboxOrderEntity, String> {
}
```

---

### 7. Criar status da outbox

```java
package br.com.formacao.m16.kafka.outbox.persistence;

public enum OutboxStatus {
    PENDING,
    PROCESSING,
    FAILED,
    PUBLISHED
}
```

---

### 8. Criar OutboxEventEntity

Campos necessários:

```java
package br.com.formacao.m16.kafka.outbox.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "outbox_event",
    indexes = {
        @Index(
            name = "idx_outbox_dispatch",
            columnList = "status,next_attempt_at,created_at"
        ),
        @Index(
            name = "idx_outbox_claim",
            columnList = "status,claimed_at"
        )
    }
)
public class OutboxEventEntity {

    @Id
    private UUID id;

    @Column(name = "aggregate_type", nullable = false, length = 100)
    private String aggregateType;

    @Column(name = "aggregate_id", nullable = false, length = 100)
    private String aggregateId;

    @Column(name = "event_type", nullable = false, length = 150)
    private String eventType;

    @Column(name = "event_version", nullable = false)
    private int eventVersion;

    @Column(nullable = false, length = 200)
    private String topic;

    @Column(name = "message_key", nullable = false, length = 200)
    private String messageKey;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OutboxStatus status;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "next_attempt_at", nullable = false)
    private Instant nextAttemptAt;

    @Column(name = "claimed_at")
    private Instant claimedAt;

    @Column(name = "claimed_by", length = 100)
    private String claimedBy;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "last_error", length = 1000)
    private String lastError;

    @Column(name = "kafka_partition")
    private Integer kafkaPartition;

    @Column(name = "kafka_offset")
    private Long kafkaOffset;

    @Version
    private long rowVersion;

    protected OutboxEventEntity() {
    }

    public OutboxEventEntity(
        UUID id,
        String aggregateType,
        String aggregateId,
        String eventType,
        int eventVersion,
        String topic,
        String messageKey,
        String payload,
        Instant occurredAt,
        Instant createdAt
    ) {
        this.id = id;
        this.aggregateType = aggregateType;
        this.aggregateId = aggregateId;
        this.eventType = eventType;
        this.eventVersion = eventVersion;
        this.topic = topic;
        this.messageKey = messageKey;
        this.payload = payload;
        this.occurredAt = occurredAt;
        this.createdAt = createdAt;
        this.status = OutboxStatus.PENDING;
        this.attemptCount = 0;
        this.nextAttemptAt = createdAt;
    }

    public UUID id() {
        return id;
    }
}
```

Use migrations em produção.

---

### 9. Criar o contrato de publicação

```java
package br.com.formacao.m16.kafka.outbox.persistence;

import java.time.Instant;
import java.util.UUID;

public record OutboxPublication(
    UUID id,
    String aggregateType,
    String aggregateId,
    String eventType,
    int eventVersion,
    String topic,
    String messageKey,
    String payload,
    Instant occurredAt,
    int attemptCount
) {
}
```

---

### 10. Criar o repository

O repository precisa:

- encontrar candidatos;
- fazer claim condicional;
- carregar publicação;
- marcar sucesso;
- marcar falha;
- recuperar stale claims;
- contar backlog;
- selecionar published para cleanup.

A claim deve retornar quantidade de linhas atualizadas.

Exemplo JPQL:

```java
@Modifying
@Query("""
    update OutboxEventEntity event
       set event.status = :processing,
           event.claimedBy = :workerId,
           event.claimedAt = :now
     where event.id = :id
       and event.status in :claimable
       and event.nextAttemptAt <= :now
    """)
int claim(
    UUID id,
    List<OutboxStatus> claimable,
    OutboxStatus processing,
    String workerId,
    Instant now
);
```

A busca usa `PageRequest.of(0, batchSize)`.

A constraint da atualização decide o vencedor.

---

### 11. Criar o command

```java
package br.com.formacao.m16.kafka.outbox.application;

import java.math.BigDecimal;

public record CreateOrderWithOutboxCommand(
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

Resultado:

```java
package br.com.formacao.m16.kafka.outbox.application;

import java.util.UUID;

public record CreateOrderWithOutboxResult(
    String orderId,
    UUID eventId,
    String integrationStatus
) {
}
```

---

### 12. Criar o service transacional

```java
package br.com.formacao.m16.kafka.outbox.application;

import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import br.com.formacao.m16.kafka.outbox.config.OutboxTopicNames;
import br.com.formacao.m16.kafka.outbox.order.OutboxOrderEntity;
import br.com.formacao.m16.kafka.outbox.order.OutboxOrderRepository;
import br.com.formacao.m16.kafka.outbox.persistence.OutboxEventEntity;
import br.com.formacao.m16.kafka.outbox.persistence.OutboxEventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateOrderWithOutboxService {

    private final OutboxOrderRepository orderRepository;
    private final OutboxEventRepository outboxRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock = Clock.systemUTC();

    public CreateOrderWithOutboxService(
        OutboxOrderRepository orderRepository,
        OutboxEventRepository outboxRepository,
        ObjectMapper objectMapper
    ) {
        this.orderRepository = orderRepository;
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public CreateOrderWithOutboxResult execute(
        CreateOrderWithOutboxCommand command
    ) {
        if (orderRepository.existsById(command.orderId())) {
            throw new IllegalArgumentException(
                "Order already exists"
            );
        }

        Instant now = clock.instant();
        UUID eventId = UUID.randomUUID();

        OrderCreatedIntegrationEventV1 event =
            new OrderCreatedIntegrationEventV1(
                eventId,
                "orders.created.v1",
                1,
                now,
                command.orderId(),
                command.customerId(),
                command.total()
            );

        orderRepository.save(
            new OutboxOrderEntity(
                command.orderId(),
                command.customerId(),
                command.total(),
                "CREATED",
                now
            )
        );

        outboxRepository.save(
            new OutboxEventEntity(
                eventId,
                "Order",
                command.orderId(),
                event.eventType(),
                event.eventVersion(),
                OutboxTopicNames.ORDERS,
                command.orderId(),
                serialize(event),
                event.occurredAt(),
                now
            )
        );

        return new CreateOrderWithOutboxResult(
            command.orderId(),
            eventId,
            "PENDING_PUBLICATION"
        );
    }

    private String serialize(
        OrderCreatedIntegrationEventV1 event
    ) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                "Outbox payload serialization failed",
                exception
            );
        }
    }
}
```

O método não chama Kafka.

---

### 13. Criar o template String

A outbox armazenou JSON pronto.

Configure:

```java
@Bean
ProducerFactory<String, String> outboxProducerFactory(
    KafkaProperties kafkaProperties
) {
    Map<String, Object> properties =
        kafkaProperties.buildProducerProperties();

    properties.put(
        ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
        StringSerializer.class
    );

    properties.put(
        ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
        StringSerializer.class
    );

    return new DefaultKafkaProducerFactory<>(properties);
}

@Bean
KafkaTemplate<String, String> outboxKafkaTemplate(
    ProducerFactory<String, String> outboxProducerFactory
) {
    return new KafkaTemplate<>(outboxProducerFactory);
}
```

Use `@Qualifier` quando houver mais de um template.

---

### 14. Criar o publisher Kafka

```java
package br.com.formacao.m16.kafka.outbox.publisher;

import br.com.formacao.m16.kafka.outbox.persistence.OutboxPublication;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OutboxKafkaPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public OutboxKafkaPublisher(
        @Qualifier("outboxKafkaTemplate")
        KafkaTemplate<String, String> kafkaTemplate
    ) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public PublishedKafkaRecord publish(
        OutboxPublication publication,
        long timeoutSeconds
    ) {
        RecordHeaders headers = new RecordHeaders();

        add(headers, "eventId", publication.id().toString());
        add(headers, "eventType", publication.eventType());
        add(
            headers,
            "eventVersion",
            Integer.toString(publication.eventVersion())
        );
        add(headers, "aggregateType", publication.aggregateType());
        add(headers, "occurredAt", publication.occurredAt().toString());

        ProducerRecord<String, String> record =
            new ProducerRecord<>(
                publication.topic(),
                null,
                publication.occurredAt().toEpochMilli(),
                publication.messageKey(),
                publication.payload(),
                headers
            );

        try {
            var metadata =
                kafkaTemplate
                    .send(record)
                    .get(timeoutSeconds, TimeUnit.SECONDS)
                    .getRecordMetadata();

            return new PublishedKafkaRecord(
                metadata.partition(),
                metadata.offset()
            );
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                "Outbox publication interrupted",
                exception
            );
        } catch (Exception exception) {
            throw new IllegalStateException(
                "Outbox publication failed",
                exception
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
            value.getBytes(StandardCharsets.UTF_8)
        );
    }
}
```

Resultado:

```java
package br.com.formacao.m16.kafka.outbox.publisher;

public record PublishedKafkaRecord(
    int partition,
    long offset
) {
}
```

---

### 15. Criar OutboxStateService

Esse service terá métodos separados com:

```text
REQUIRES_NEW.
```

Responsabilidades:

```text
find candidates;

claim;

mark published;

mark failed;

recover stale;

cleanup.
```

Exemplo do claim:

```java
@Transactional(
    propagation = Propagation.REQUIRES_NEW
)
public Optional<OutboxPublication> claim(
    UUID id,
    String workerId,
    Instant now
) {
    int changed =
        repository.claim(
            id,
            List.of(
                OutboxStatus.PENDING,
                OutboxStatus.FAILED
            ),
            OutboxStatus.PROCESSING,
            workerId,
            now
        );

    if (changed == 0) {
        return Optional.empty();
    }

    return repository
        .findPublicationById(id);
}
```

Não chame esse método por self-invocation dentro da mesma classe.

Ele precisa passar pelo proxy Spring.

---

### 16. Marcar sucesso

A atualização deve exigir:

```text
status = PROCESSING;

claimedBy = worker atual.
```

Ela grava:

- `PUBLISHED`;
- `publishedAt`;
- partition;
- offset;
- limpa claim;
- limpa erro.

Se a atualização retornar `0`, registre erro operacional.

Não assuma sucesso silenciosamente.

---

### 17. Marcar falha

A falha deve:

- mudar para `FAILED`;
- incrementar tentativa;
- calcular `nextAttemptAt`;
- limitar `lastError`;
- limpar claim;
- preservar payload e eventId.

Backoff:

```java
long factor =
    1L << Math.min(attemptCount, 10);

long delay =
    Math.min(
        maxSeconds,
        baseSeconds * factor
    );
```

Proteja contra overflow em configurações grandes.

---

### 18. Criar o job

```java
package br.com.formacao.m16.kafka.outbox.publisher;

import br.com.formacao.m16.kafka.outbox.persistence.OutboxPublication;
import java.time.Instant;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OutboxPublisherJob {

    private final OutboxStateService stateService;
    private final OutboxKafkaPublisher publisher;
    private final String workerId =
        UUID.randomUUID().toString();

    public OutboxPublisherJob(
        OutboxStateService stateService,
        OutboxKafkaPublisher publisher
    ) {
        this.stateService = stateService;
        this.publisher = publisher;
    }

    @Scheduled(
        fixedDelayString =
            "${app.outbox.publisher-delay-ms:1000}"
    )
    public void publishPending() {
        Instant now = Instant.now();

        stateService.recoverStaleClaims(now);

        for (
            UUID id :
            stateService.findCandidateIds(now)
        ) {
            stateService
                .claim(id, workerId, now)
                .ifPresent(this::publishClaimed);
        }
    }

    private void publishClaimed(
        OutboxPublication publication
    ) {
        try {
            PublishedKafkaRecord metadata =
                publisher.publish(
                    publication,
                    stateService.sendTimeoutSeconds()
                );

            stateService.markPublished(
                publication.id(),
                workerId,
                metadata,
                Instant.now()
            );
        } catch (Exception exception) {
            stateService.markFailed(
                publication,
                workerId,
                exception,
                Instant.now()
            );
        }
    }
}
```

O job não utiliza uma grande transação.

---

### 19. Recuperar stale claims

A cada execução:

```text
PROCESSING;

claimedAt anterior ao timeout;

volta para FAILED;

nextAttemptAt = now.
```

Registre:

```text
stale claim recovered.
```

Não marque como `PUBLISHED` sem evidência do broker.

---

### 20. Criar endpoint

Endpoint:

```text
POST /api/v1/lab/kafka/outbox/orders
```

Request:

```java
public record CreateOutboxOrderRequest(
    String orderId,
    String customerId,
    BigDecimal total
) {
}
```

Response:

```java
public record CreateOutboxOrderResponse(
    String orderId,
    UUID eventId,
    String integrationStatus
) {
}
```

Retorne:

```text
201 Created;

PENDING_PUBLICATION.
```

Não retorne `PUBLISHED`.

O job é assíncrono.

---

### 21. Criar observabilidade

Endpoint:

```text
GET /api/v1/lab/kafka/outbox/status
```

Retorne:

```text
pending;

processing;

failed;

published;

oldestPendingAt;

oldestPendingAgeSeconds.
```

Não retorne payloads completos.

---

### 22. Iniciar broker e aplicação

```powershell
docker start `
  "m16-kafka"
```

Depois:

```powershell
.\mvnw.cmd spring-boot:run
```

Confirme o topic:

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.orders.outbox-lab.v1"
```

---

### 23. Criar pedido

```powershell
$body = @{
  orderId = "ORD-488-0001"
  customerId = "CUS-488-0001"
  total = 349.90
} |
  ConvertTo-Json

$result =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8084" +
      "/api/v1/lab/kafka/outbox/orders"
    ) `
    -ContentType "application/json" `
    -Body $body

$result
```

Resposta:

```text
orderId;

eventId;

PENDING_PUBLICATION.
```

---

### 24. Observar o lifecycle

Consulte imediatamente:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/api/v1/lab/kafka/outbox/status"
```

Conforme o timing, o registro pode estar:

```text
PENDING;

PROCESSING;

PUBLISHED.
```

Depois de alguns segundos, deve chegar a `PUBLISHED`.

---

### 25. Inspecionar o topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.outbox-lab.v1" `
  --from-beginning `
  --property "print.key=true" `
  --property "print.headers=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Confirme:

- key `orderId`;
- payload JSON;
- eventId;
- eventType;
- partition;
- offset.

---

### 26. Testar broker indisponível

Pare:

```powershell
docker stop `
  "m16-kafka"
```

Crie outro pedido.

Resultado esperado:

```text
pedido:
confirmado no banco.

outbox:
PENDING ou FAILED.

Kafka:
não publicado ainda.
```

O endpoint não precisa depender do broker.

---

### 27. Recuperar publicação

Reinicie:

```powershell
docker start `
  "m16-kafka"
```

Aguarde.

O job tenta novamente.

O registro chega a:

```text
PUBLISHED.
```

O pedido não foi recriado.

---

### 28. Testar atomicidade local

Crie um teste que força falha durante a serialização ou antes do save da outbox.

Resultado:

```text
order:
0.

outbox:
0.
```

A transação deve fazer rollback.

Depois teste o caminho normal:

```text
order:
1.

outbox:
1.
```

---

### 29. Testar duplicata pós-send

No teste do job:

1. publique no Embedded Kafka;
2. simule falha em `markPublished`;
3. deixe claim expirar;
4. execute o job novamente;
5. confirme dois records físicos;
6. confirme o mesmo `eventId`;
7. consuma com a deduplicação da aula 487;
8. confirme um efeito lógico.

Esse teste prova a semântica at-least-once do publisher.

---

### 30. Testar duas instâncias

Execute dois workers sobre os mesmos candidate IDs.

A atualização condicional precisa produzir:

```text
um claim:
1.

outro claim:
0.
```

Somente o vencedor publica naquele ciclo.

---

### 31. Criar cleanup seguro

Selecione apenas:

```text
status = PUBLISHED;

publishedAt < cutoff;

limite por lote.
```

Execute `deleteAllInBatch` em lotes pequenos.

A baseline pode manter o cleanup desabilitado por configuração durante o laboratório.

Nunca use:

```sql
DELETE FROM outbox_event
WHERE created_at < ...
```

sem filtrar o estado.

---

### 32. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=CreateOrderWithOutboxIntegrationTest,OutboxAtomicityTest,OutboxPublisherIntegrationTest,OutboxPublisherJobTest,OutboxStaleClaimTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### O dual write foi removido do request

O endpoint não grava no banco e publica diretamente.

### Pedido e evento passaram a ser atômicos localmente

Os dois são confirmados ou revertidos juntos.

### O broker saiu da transação de negócio

Indisponibilidade do Kafka não impede a persistência válida.

### O publisher ficou assíncrono

O endpoint retorna com publicação pendente.

### Claims permitiram concorrência segura

A atualização condicional escolhe um worker.

### A rede ficou fora da transação de banco

Locks e conexões não permanecem presos durante o send.

### Falhas passaram a ter retry e backoff

O backlog fica visível e recuperável.

### PROCESSING órfão ganhou recuperação

Stale claims voltam ao fluxo.

### Duplicidade continuou possível

Falha depois do send pode publicar outra vez.

### A deduplicação completou o desenho

Mesmo `eventId` impede efeito repetido no consumer.

---

## Erros comuns importantes

### Publicar dentro do request após o commit

A janela de perda continua existindo.

### Publicar antes do banco

O evento pode anunciar estado inexistente.

### Usar evento apenas em memória

Restart perde a intenção.

### Criar outbox em outro banco

A transação local deixa de ser única.

### Segurar transação durante Kafka send

Locks e conexões ficam expostos à rede.

### Fazer claim apenas com select

Duas instâncias podem publicar.

### Não recuperar PROCESSING

Claims órfãos ficam presos.

### Marcar PUBLISHED antes do send

Falha de publicação perde o evento.

### Achar que PUBLISHED significa consumido

Significa somente append confirmado pelo broker.

### Regenerar eventId no retry

A deduplicação deixa de funcionar.

### Apagar FAILED no cleanup

O evento não publicado é perdido.

### Prometer exactly-once

A publicação é at-least-once.

---

## Comandos úteis

### Criar pedido

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8084/api/v1/lab/kafka/outbox/orders" `
  -ContentType "application/json" `
  -Body $body
```

### Ver backlog

```powershell
Invoke-RestMethod `
  "http://localhost:8084/api/v1/lab/kafka/outbox/status"
```

### Ver topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.orders.outbox-lab.v1" `
  --from-beginning `
  --property "print.headers=true"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Dual write

Documente as duas janelas de falha.

### Parte 2 — Tabelas

Crie pedido e outbox.

### Parte 3 — Transação

Salve os dois juntos.

### Parte 4 — Publisher

Crie polling assíncrono.

### Parte 5 — Claim

Proteja múltiplas instâncias.

### Parte 6 — Retry

Implemente backoff.

### Parte 7 — Recovery

Recupere stale claims.

### Parte 8 — Duplicata

Falhe depois do send.

### Parte 9 — Métricas

Observe backlog e idade.

### Parte 10 — Cleanup

Apague somente published antigos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 487 foi preservada;
- dual write foi explicado;
- janela banco sem evento foi explicada;
- janela evento sem banco foi explicada;
- Outbox Pattern foi definido;
- polling publisher foi escolhido;
- CDC foi reservado para aula futura;
- topic exclusivo foi criado;
- tabela de pedido foi criada;
- tabela outbox foi criada;
- pedido e outbox usam o mesmo banco;
- pedido e outbox usam a mesma transação;
- Kafka não é chamado no request transacional;
- endpoint retorna publicação pendente;
- eventId foi preservado;
- key foi orderId;
- payload JSON foi persistido;
- event type foi persistido;
- event version foi persistida;
- occurredAt foi persistido;
- status lifecycle foi criado;
- `PENDING` foi criado;
- `PROCESSING` foi criado;
- `FAILED` foi criado;
- `PUBLISHED` foi criado;
- candidate query foi limitada;
- índice de dispatch foi criado;
- claim condicional foi criado;
- claim retorna quantidade alterada;
- múltiplos workers foram considerados;
- transação de claim é curta;
- Kafka send fica fora da transação de banco;
- acknowledgement do broker foi aguardado;
- partition foi registrada;
- offset foi registrado;
- PUBLISHED só ocorre depois do send;
- falha incrementa tentativa;
- backoff foi limitado;
- erro foi truncado;
- claim foi limpo após sucesso ou falha;
- stale claim foi recuperado;
- PROCESSING não fica preso para sempre;
- publisher é at-least-once;
- falha pós-send foi testada;
- duplicata física foi aceita;
- mesmo eventId foi mantido;
- consumer dedup foi reutilizado;
- PUBLISHED foi diferenciado de consumido;
- backlog foi medido;
- idade do mais antigo foi medida;
- broker indisponível foi testado;
- pedido permaneceu salvo;
- publicação posterior funcionou;
- atomicidade local foi testada;
- rollback remove pedido e outbox;
- cleanup filtra somente PUBLISHED;
- cleanup usa lote;
- retenção foi documentada;
- H2 foi tratado como laboratório;
- migrations foram recomendadas;
- XA não foi implementado;
- Kafka transaction não foi implementada;
- Inbox Pattern completo não foi antecipado;
- saga não foi antecipada;
- CDC não foi implementado;
- commit recomendado está pronto;
- ponte para aula 489 está correta.

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
  "Outbox|PENDING|PROCESSING|PUBLISHED|FAILED|@Transactional|@Scheduled|eventId|delete"
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
git commit -m "feat(m16): implementar Outbox Pattern"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- banco H2;
- diretório data;
- logs;
- target;
- payload real;
- segredo em headers;
- cleanup sem filtro;
- código CDC antecipado;
- transação distribuída;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o lado produtor deixou de depender de um dual write frágil.

O fluxo ficou:

```text
business transaction;

order;

outbox event;

commit;

polling publisher;

claim;

Kafka append;

mark published;

consumer dedup.
```

Você comprovou que:

- banco e broker não formam transação local automática;
- pedido e intenção de publicação podem ser atômicos no banco;
- indisponibilidade do Kafka não perde o evento;
- o publisher pode continuar depois do restart;
- claim precisa de atualização condicional;
- chamada de rede não deve segurar transação de banco;
- falhas precisam de retry e backoff;
- stale claims precisam ser recuperados;
- backlog precisa de métricas e alertas;
- cleanup só remove eventos publicados;
- falha após o send pode duplicar a publicação;
- `eventId` estável conecta outbox e deduplicação;
- Outbox Pattern não significa exactly-once global.

A próxima aula será:

```text
489 - M16.34 - Inbox Pattern
```

Nela, você irá:

- formalizar a inbox como padrão arquitetural;
- separar recebimento e processamento;
- persistir mensagem recebida;
- controlar estados de processamento;
- combinar inbox e deduplicação;
- tratar retry local;
- recuperar processamento interrompido;
- criar backlog de entrada;
- definir retenção;
- relacionar Outbox e Inbox;
- preparar Saga conceitual.

A aula 487 criou a base de deduplicação.

A aula 489 transformará essa base em um fluxo completo de entrada persistente.

---

# Material complementar

## Checkpoint final

- [ ] Removi dual write do request.
- [ ] Gravei pedido e outbox juntos.
- [ ] Criei publisher assíncrono.
- [ ] Implementei claim seguro.
- [ ] Implementei retry e stale recovery.
- [ ] Testei broker indisponível.
- [ ] Combinei eventId e deduplicação.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Pedido existe e outbox não

A transação foi dividida ou o insert ocorreu em outro datasource.

### Outbox existe e pedido não

As operações não participaram da mesma transação.

### Registro fica PENDING

Scheduling pode não estar habilitado ou a candidate query não encontra a data.

### Registro fica PROCESSING

O worker morreu e stale recovery não executou.

### Dois workers publicam juntos

O claim não possui condição atômica.

### PUBLISHED não grava offset

A atualização pode estar usando workerId diferente ou status incorreto.

### FAILED repete sem pausa

O `nextAttemptAt` ou backoff não está sendo aplicado.

### Evento foi publicado duas vezes

Isso é possível após falha pós-send. Confirme o mesmo eventId e a deduplicação.

### Endpoint falha quando Kafka cai

O request ainda está chamando o broker diretamente.

### Cleanup apagou pendentes

Interrompa o job e restaure. A query precisa filtrar somente PUBLISHED.

---

## Perguntas de revisão

1. O que é dual write?
2. Qual janela existe ao salvar primeiro?
3. Qual janela existe ao publicar primeiro?
4. O que a outbox armazena?
5. Onde ela deve ficar?
6. O que é polling publisher?
7. Por que fazer claim?
8. Por que a claim é condicional?
9. Por que publicar fora da transação?
10. O que é stale claim?
11. O que significa PUBLISHED?
12. Significa consumido?
13. Por que pode haver duplicata?
14. Qual ID deve permanecer?
15. Quem elimina efeito repetido?
16. O que é backlog?
17. O que pode ser apagado?
18. O padrão cria exactly-once?
19. Inbox Pattern foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Escrita em dois recursos independentes.
2. Banco confirma e evento pode faltar.
3. Evento existe e banco pode falhar.
4. Intenção persistente de publicação.
5. No mesmo banco do negócio.
6. Job que publica linhas pendentes.
7. Coordenar workers.
8. Evitar corrida.
9. Não segurar locks durante rede.
10. PROCESSING abandonado.
11. Broker confirmou o append.
12. Não.
13. Falha após send e antes da marcação.
14. eventId.
15. Consumer idempotente.
16. Eventos ainda não publicados.
17. Somente PUBLISHED antigos.
18. Não globalmente.
19. Não completamente.
20. Inbox Pattern.

---

## Desafio opcional

Implemente uma segunda família:

```text
payments.authorized.v1
```

Requisitos:

- mesma tabela outbox;
- outro event type;
- outro topic;
- mesma estratégia de claim;
- key por paymentId;
- retry;
- stale recovery;
- métricas por event type;
- cleanup apenas PUBLISHED;
- eventId estável;
- consumer deduplicador;
- nenhum CDC;
- nenhuma saga.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 488 - M16.33 - Outbox Pattern

- Continuei após a deduplicação.
- Entendi o problema de dual write.
- Analisei banco confirmado sem evento.
- Analisei evento publicado sem banco.
- Defini Outbox Pattern.
- Escolhi polling publisher para o laboratório.
- Criei topic exclusivo de outbox.
- Criei tabela de pedido.
- Criei tabela `outbox_event`.
- Mantive pedido e outbox no mesmo banco.
- Gravei pedido e evento na mesma transação.
- Removi publicação Kafka do request.
- Retornei `PENDING_PUBLICATION`.
- Preservei `eventId`.
- Usei `orderId` como key.
- Persistei payload JSON.
- Criei estados PENDING, PROCESSING, FAILED e PUBLISHED.
- Criei índice para dispatch.
- Busquei candidatos em lote.
- Implementei claim condicional.
- Protegi concorrência entre workers.
- Mantive claim em transação curta.
- Publiquei no Kafka fora da transação de banco.
- Aguardei o acknowledgement do broker.
- Registrei partition e offset.
- Marquei PUBLISHED somente depois do send.
- Implementei retry com backoff.
- Registrei tentativa e última falha.
- Recuperei stale claims.
- Medi backlog por status.
- Medi idade do evento mais antigo.
- Testei Kafka indisponível.
- Mantive pedido e outbox persistidos.
- Publiquei quando o broker retornou.
- Testei rollback local.
- Testei falha depois do send.
- Aceitei publicação duplicada com mesmo eventId.
- Reutilizei deduplicação no consumer.
- Diferenciei PUBLISHED de consumido.
- Criei cleanup apenas para PUBLISHED antigos.
- Não implementei XA, CDC, saga ou Kafka transactions.
- Próxima aula: Inbox Pattern.
```

---

## Referência técnica curta

- Transactional Outbox Pattern.
- Debezium — Outbox Event Router.
- Spring Framework — Declarative Transaction Management.
- Spring Framework — `@Transactional`.
- Spring Framework — Task Execution and Scheduling.
- Spring Kafka — Sending Messages.
- Spring Kafka — `KafkaTemplate`.
- Jakarta Persistence — Transactions and Entity Mapping.
- PostgreSQL — Indexes and Constraints.
- Enterprise Integration Patterns — Guaranteed Delivery.

Regra final:

```text
Outbox Pattern elimina o dual write direto do request ao gravar estado de negócio e intenção de publicação na mesma transação local; a linha outbox preserva eventId, eventType, key, payload e lifecycle; um polling publisher busca candidatos, reivindica cada linha por atualização condicional, publica fora da transação de banco, aguarda o acknowledgement do Kafka e marca PUBLISHED em outra transação curta; falhas viram FAILED com backoff, PROCESSING órfão é recuperado por timeout e backlog precisa de métricas; se o broker confirmar e a marcação falhar, o evento pode ser publicado novamente, portanto o eventId deve permanecer e o consumer precisa deduplicar; cleanup só remove PUBLISHED antigos, e a garantia resultante é entrega at-least-once confiável, não exactly-once global.
```
