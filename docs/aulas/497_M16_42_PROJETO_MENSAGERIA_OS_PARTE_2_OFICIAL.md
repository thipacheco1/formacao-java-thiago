# 497 - M16.42 - Projeto mensageria OS parte 2

## Apresentação da aula

Na aula 496, você iniciou o projeto prático de mensageria de ordens de serviço pelo lado produtor.

O fluxo construído foi:

```text
POST /service-orders;

ServiceOrderApplicationService;

SchedulingApi;

service_order;

outbox_event;

commit;

Outbox publisher;

m16.service-order.events.v1.
```

O evento publicado foi:

```text
service-order.scheduled.v1.
```

Ele utiliza:

```text
serviceOrderId:

key do record.

eventId:

identidade estável do fato.

correlationId:

identidade da jornada.

causationId:

identidade da interação causadora.
```

A parte 1 termina no Kafka.

Nenhum consumer funcional do módulo `notification` foi criado.

Agora o projeto avançará para o lado consumidor.

A pergunta central desta aula será:

```text
como receber o evento da OS,
persistir sua recepção,
evitar efeitos duplicados
e processá-lo depois
sem bloquear o listener?
```

A resposta será construída com:

```text
consumer group exclusivo;

listener curto;

Inbox persistente;

deduplicação por eventId;

worker assíncrono;

claim condicional;

retry com backoff;

falha permanente;

correlação;

redelivery segura.
```

O fluxo ficará:

```text
m16.service-order.events.v1
        |
        v
Notification consumer
        |
        v
notification_inbox_message
        |
        v
commit do banco
        |
        v
commit do offset
        |
        v
Notification worker
        |
        v
service_order_notification_intent
        |
        v
PROCESSED.
```

O listener não enviará e-mail, SMS ou WhatsApp.

O efeito local da parte 2 será:

```text
preparar uma intenção
de notificação

com status
READY_TO_SEND.
```

Essa intenção representa:

```text
o evento foi compreendido;

a notificação necessária
foi preparada;

o envio ao provedor
ainda não ocorreu.
```

A parte 3 ficará responsável por consolidar o projeto, incluindo o envio fake, tratamento operacional completo, integração ponta a ponta e cenários finais de falha.

O consumer group será:

```text
m16-notification-service-order-v1.
```

O consumer lógico será:

```text
service-order-notification-v1.
```

A tabela de Inbox será:

```text
notification_inbox_message.
```

A tabela de intenção será:

```text
service_order_notification_intent.
```

O lifecycle da Inbox será:

```text
RECEIVED;

PROCESSING;

RETRY_WAIT;

PROCESSED;

FAILED_PERMANENT.
```

A deduplicação utilizará:

```text
consumerName + eventId.
```

Essa chave protege:

- redelivery do mesmo record;
- republicação do mesmo evento;
- retry do Outbox;
- falha depois do commit da Inbox;
- restart do consumer.

O processamento continuará at-least-once.

Existe uma janela possível:

```text
intenção de notificação salva;

status PROCESSED salvo;

checkpoint do worker concluído;

mas offset do listener
já havia sido confirmado antes.
```

Essa separação é intencional.

O Kafka confirma a recepção durável na Inbox.

O worker confirma o processamento local.

A aula também criará falhas didáticas:

```text
customerId iniciado por
TRANSIENT-:

falha temporária
nas duas primeiras tentativas.

customerId iniciado por
PERMANENT-:

falha permanente.
```

Esses prefixos são exclusivos do laboratório.

Nenhuma regra produtiva deve depender desse mecanismo.

Ao final, você deverá explicar:

```text
por que o listener
não realiza o envio;

por que a Inbox
é persistida antes do ack;

por que eventId
é a chave de deduplicação;

por que consumerName
faz parte da constraint;

por que o worker
precisa de claim;

por que efeito e PROCESSED
compartilham transação;

por que RETRY_WAIT
é diferente de falha permanente;

como a correlação
sobrevive até o worker;

por que READY_TO_SEND
não significa notificação enviada.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
495:
Microsservicos vs monolito modular.

496:
Projeto mensageria OS parte 1.

497:
Projeto mensageria OS parte 2.

498:
Projeto mensageria OS parte 3.

499:
Projeto integracao API externa fake.
```

A aula 496 respondeu:

```text
como publicar
um evento confiável de OS?
```

A aula 497 responderá:

```text
como receber
e processar esse evento
com segurança?
```

Nesta aula:

```text
topic existente:
reutilizado.

consumer group:
sim.

listener:
sim.

Inbox:
sim.

deduplicação:
sim.

worker:
sim.

claim:
sim.

retry:
sim.

backoff:
sim.

falha permanente:
sim.

correlação:
sim.

intenção de notificação:
sim.

envio externo:
não.

WhatsApp:
não.

e-mail:
não.

SMS:
não.

quarantine específica:
não.

consolidação ponta a ponta:
não.

parte 3:
não antecipada.
```

A regra central será:

```text
receber de forma durável
é diferente de concluir
o processamento.
```

---

## Objetivo prático

Ao final, a estrutura terá:

```text
src/main/java/br/com/formacao/m16/architecture/os
└── notification
    ├── config
    │   └── NotificationMessagingConfiguration.java
    ├── consumer
    │   └── ServiceOrderScheduledConsumer.java
    ├── inbox
    │   ├── NotificationInboxEntity.java
    │   ├── NotificationInboxIngestionHandler.java
    │   ├── NotificationInboxIngestionOutcome.java
    │   ├── NotificationInboxIngestionService.java
    │   ├── NotificationInboxRepository.java
    │   ├── NotificationInboxStatus.java
    │   └── NotificationInboxWorkItem.java
    ├── processing
    │   ├── NotificationPermanentException.java
    │   ├── NotificationPreparationService.java
    │   ├── NotificationProcessingWorker.java
    │   ├── NotificationStateService.java
    │   └── NotificationTransientException.java
    └── persistence
        ├── NotificationIntentEntity.java
        ├── NotificationIntentRepository.java
        └── NotificationIntentStatus.java
```

Documentação:

```text
docs/architecture/messaging-os
├── MESSAGING_OS_PART2.md
├── NOTIFICATION_INBOX_POLICY.md
└── NOTIFICATION_FAILURE_MATRIX.md
```

Testes:

```text
src/test/java/br/com/formacao/m16/architecture/os
├── NotificationInboxIngestionIntegrationTest.java
├── NotificationProcessingIntegrationTest.java
├── NotificationRetryIntegrationTest.java
├── NotificationRedeliveryIntegrationTest.java
└── NotificationCorrelationIntegrationTest.java
```

Você irá:

1. confirmar a baseline;
2. configurar o consumer group;
3. reutilizar o contrato da parte 1;
4. criar a Inbox;
5. criar unique constraint;
6. persistir metadata de origem;
7. persistir correlation IDs;
8. criar listener curto;
9. tratar duplicata;
10. confirmar offset após commit;
11. criar lifecycle;
12. criar queries de candidatos;
13. criar claim condicional;
14. criar worker;
15. preparar intenção de notificação;
16. aplicar transação local;
17. implementar retry;
18. implementar backoff;
19. separar falha permanente;
20. recuperar stale claim;
21. testar redelivery;
22. testar correlação;
23. executar o gate;
24. commitar;
25. preparar a parte 3.

---

## Conceito essencial

### Consumer group

O group será:

```text
m16-notification-service-order-v1.
```

Todas as instâncias do mesmo módulo notification utilizarão esse group.

O Kafka distribui as partitions entre as instâncias ativas.

Um record é entregue a uma instância do group por vez, mas pode ser entregue novamente quando o progresso não foi confirmado.

---

### Listener curto

O listener executará:

```text
extrair correlação;

persistir Inbox;

registrar outcome;

retornar.
```

Ele não executará:

- chamada externa;
- envio de mensagem;
- retry com sleep;
- cálculo pesado;
- acesso a provedor;
- workflow longo.

---

### Inbox

A Inbox será a fronteira durável do módulo notification.

Ela responde:

```text
este módulo recebeu
este evento?
```

A linha preserva:

- consumer name;
- event ID;
- event type;
- event version;
- payload;
- key;
- source topic;
- source partition;
- source offset;
- source timestamp;
- correlation ID;
- causation ID;
- lifecycle;
- tentativas;
- erro;
- timestamps.

---

### Deduplicação

A constraint será:

```text
consumer_name + event_id.
```

Não use apenas `eventId`.

Outro consumer pode processar o mesmo evento legitimamente.

Não use apenas:

```text
topic + partition + offset.
```

O mesmo `eventId` pode ser republicado em outro offset.

---

### Commit do offset

Com ack mode `RECORD`, o listener retorna somente depois de:

```text
insert Inbox;

commit da transação.
```

Se o banco falhar, a exception sai e o offset não deve avançar.

Se o banco confirmar e o offset falhar, o record volta.

A unique constraint reconhece a duplicata.

---

### Lifecycle da Inbox

#### RECEIVED

Mensagem persistida e pronta.

#### PROCESSING

Um worker fez claim.

#### RETRY_WAIT

Falha transitória; aguarda nova tentativa.

#### PROCESSED

Intenção de notificação preparada.

#### FAILED_PERMANENT

O evento não pode ser processado automaticamente.

---

### Notification intent

A intenção persistida terá:

```text
sourceEventId;

serviceOrderId;

customerId;

scheduleId;

channel;

templateCode;

status;

createdAt.
```

Nesta aula:

```text
channel:
IN_APP.

templateCode:
SERVICE_ORDER_SCHEDULED_V1.

status:
READY_TO_SEND.
```

Nenhum contato pessoal será necessário.

---

### Claim condicional

Duas instâncias podem localizar a mesma linha.

O claim precisa ser:

```sql
UPDATE notification_inbox_message
SET status = 'PROCESSING'
WHERE id = ?
  AND status IN ('RECEIVED', 'RETRY_WAIT')
  AND next_attempt_at <= now();
```

Apenas uma atualização retorna `1`.

---

### Efeito e PROCESSED

O worker executa:

```text
BEGIN;

insert notification intent;

update Inbox PROCESSED;

COMMIT.
```

Se o insert falhar:

```text
ROLLBACK intent;

ROLLBACK PROCESSED.
```

Depois, outra transação marca `RETRY_WAIT` ou `FAILED_PERMANENT`.

---

### Retry transitório

Retry será utilizado para falhas recuperáveis.

A baseline utilizará:

```text
1s;

2s;

4s;

8s;

máximo configurado.
```

O worker não ficará em loop.

---

### Falha permanente

Falhas permanentes incluem:

- event type não suportado;
- event version incompatível;
- campos obrigatórios ausentes;
- regra de negócio impossível;
- tentativa esgotada.

Elas não devem permanecer em retry infinito.

---

### Stale claim

Se a aplicação encerrar após o claim:

```text
status:
PROCESSING.
```

O recovery identifica:

```text
claimedAt
anterior ao timeout.
```

A linha volta para `RETRY_WAIT`.

---

### Correlação

Os IDs serão persistidos na Inbox.

O worker reconstrói o MDC com:

```text
correlationId;

messageId = eventId;

causationId;

topic;

partition;

offset.
```

Assim, ingestão e processamento continuam na mesma jornada.

---

### READY_TO_SEND

`READY_TO_SEND` significa:

```text
a intenção local
foi preparada.
```

Não significa:

- e-mail enviado;
- SMS enviado;
- WhatsApp entregue;
- cliente notificado;
- provedor confirmou.

Essa distinção será importante na parte 3.

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

A parte 1 continua verde.

---

### 2. Configurar nomes

No arquivo:

```text
NotificationMessagingConfiguration.java
```

```java
package br.com.formacao.m16.architecture.os.notification.config;

public final class NotificationMessagingConfiguration {

    public static final String TOPIC =
        "m16.service-order.events.v1";

    public static final String GROUP =
        "m16-notification-service-order-v1";

    public static final String CONSUMER_NAME =
        "service-order-notification-v1";

    private NotificationMessagingConfiguration() {
    }
}
```

---

### 3. Configurar listener factory

Reutilize o consumer factory JSON do laboratório.

Garanta:

```text
value type:

ServiceOrderScheduledEventV1.

ack mode:

RECORD.

enable.auto.commit:

false.
```

Use um container factory próprio:

```text
notificationKafkaListenerContainerFactory.
```

Isso evita alterar consumidores anteriores.

---

### 4. Criar status da Inbox

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

public enum NotificationInboxStatus {
    RECEIVED,
    PROCESSING,
    RETRY_WAIT,
    PROCESSED,
    FAILED_PERMANENT
}
```

---

### 5. Criar NotificationInboxEntity

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "notification_inbox_message",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_notification_consumer_event",
            columnNames = {
                "consumer_name",
                "event_id"
            }
        )
    },
    indexes = {
        @Index(
            name = "idx_notification_inbox_ready",
            columnList =
                "status,next_attempt_at,received_at"
        ),
        @Index(
            name = "idx_notification_inbox_claim",
            columnList = "status,claimed_at"
        )
    }
)
public class NotificationInboxEntity {

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
        length = 150
    )
    private String eventType;

    @Column(
        name = "event_version",
        nullable = false
    )
    private int eventVersion;

    @Column(
        name = "message_key",
        nullable = false,
        length = 120
    )
    private String messageKey;

    @Lob
    @Column(nullable = false)
    private String payload;

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
        name = "source_timestamp",
        nullable = false
    )
    private Instant sourceTimestamp;

    @Column(
        name = "correlation_id",
        nullable = false,
        length = 100
    )
    private String correlationId;

    @Column(
        name = "causation_id",
        length = 100
    )
    private String causationId;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 40
    )
    private NotificationInboxStatus status;

    @Column(
        name = "attempt_count",
        nullable = false
    )
    private int attemptCount;

    @Column(
        name = "next_attempt_at",
        nullable = false
    )
    private Instant nextAttemptAt;

    @Column(name = "received_at", nullable = false)
    private Instant receivedAt;

    @Column(name = "claimed_at")
    private Instant claimedAt;

    @Column(name = "claimed_by", length = 100)
    private String claimedBy;

    @Column(name = "processed_at")
    private Instant processedAt;

    @Column(name = "last_error", length = 1000)
    private String lastError;

    @Version
    private long rowVersion;

    protected NotificationInboxEntity() {
    }

    public NotificationInboxEntity(
        UUID id,
        String consumerName,
        UUID eventId,
        String eventType,
        int eventVersion,
        String messageKey,
        String payload,
        String sourceTopic,
        int sourcePartition,
        long sourceOffset,
        Instant sourceTimestamp,
        String correlationId,
        String causationId,
        Instant receivedAt
    ) {
        this.id = id;
        this.consumerName = consumerName;
        this.eventId = eventId;
        this.eventType = eventType;
        this.eventVersion = eventVersion;
        this.messageKey = messageKey;
        this.payload = payload;
        this.sourceTopic = sourceTopic;
        this.sourcePartition = sourcePartition;
        this.sourceOffset = sourceOffset;
        this.sourceTimestamp = sourceTimestamp;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.status = NotificationInboxStatus.RECEIVED;
        this.attemptCount = 0;
        this.nextAttemptAt = receivedAt;
        this.receivedAt = receivedAt;
    }
}
```

Use migrations em produção.

---

### 6. Criar repository da Inbox

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationInboxRepository
        extends JpaRepository<
            NotificationInboxEntity,
            UUID
        > {

    long countByConsumerNameAndEventId(
        String consumerName,
        UUID eventId
    );
}
```

Adicione queries para:

- candidatos;
- claim;
- `markProcessed`;
- `markRetry`;
- `markPermanentFailure`;
- stale claims.

---

### 7. Criar work item

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

import java.util.UUID;

public record NotificationInboxWorkItem(
    UUID inboxId,
    UUID eventId,
    String eventType,
    int eventVersion,
    String messageKey,
    String payload,
    String sourceTopic,
    int sourcePartition,
    long sourceOffset,
    String correlationId,
    String causationId,
    int attemptCount
) {
}
```

---

### 8. Criar outcome da ingestão

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

public enum NotificationInboxIngestionOutcome {
    RECEIVED,
    DUPLICATE
}
```

---

### 9. Criar service de ingestão

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

import br.com.formacao.m16.architecture.os.notification.config.NotificationMessagingConfiguration;
import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.UUID;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationInboxIngestionService {

    private final NotificationInboxRepository repository;
    private final ObjectMapper objectMapper;

    public NotificationInboxIngestionService(
        NotificationInboxRepository repository,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void receive(
        ConsumerRecord<
            String,
            ServiceOrderScheduledEventV1
        > record
    ) {
        ServiceOrderScheduledEventV1 event =
            record.value();

        repository.saveAndFlush(
            new NotificationInboxEntity(
                UUID.randomUUID(),
                NotificationMessagingConfiguration
                    .CONSUMER_NAME,
                event.eventId(),
                event.eventType(),
                event.eventVersion(),
                record.key(),
                serialize(event),
                record.topic(),
                record.partition(),
                record.offset(),
                Instant.ofEpochMilli(
                    record.timestamp()
                ),
                event.correlationId(),
                event.causationId(),
                Instant.now()
            )
        );
    }

    private String serialize(
        ServiceOrderScheduledEventV1 event
    ) {
        try {
            return objectMapper.writeValueAsString(
                event
            );
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                "Notification Inbox serialization failed",
                exception
            );
        }
    }
}
```

O payload é preservado.

---

### 10. Criar handler de ingestão

```java
package br.com.formacao.m16.architecture.os.notification.inbox;

import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Component
public class NotificationInboxIngestionHandler {

    private final NotificationInboxIngestionService service;

    public NotificationInboxIngestionHandler(
        NotificationInboxIngestionService service
    ) {
        this.service = service;
    }

    public NotificationInboxIngestionOutcome handle(
        ConsumerRecord<
            String,
            ServiceOrderScheduledEventV1
        > record
    ) {
        try {
            service.receive(record);

            return NotificationInboxIngestionOutcome
                .RECEIVED;
        } catch (
            DataIntegrityViolationException duplicate
        ) {
            return NotificationInboxIngestionOutcome
                .DUPLICATE;
        }
    }
}
```

Em produção, confirme constraint ou SQLState antes de classificar qualquer violação como duplicata.

---

### 11. Criar o listener

```java
package br.com.formacao.m16.architecture.os.notification.consumer;

import br.com.formacao.m16.architecture.os.notification.config.NotificationMessagingConfiguration;
import br.com.formacao.m16.architecture.os.notification.inbox.NotificationInboxIngestionHandler;
import br.com.formacao.m16.architecture.os.notification.inbox.NotificationInboxIngestionOutcome;
import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import br.com.formacao.m16.kafka.correlation.CorrelationScope;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ServiceOrderScheduledConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            ServiceOrderScheduledConsumer.class
        );

    private final NotificationInboxIngestionHandler handler;

    public ServiceOrderScheduledConsumer(
        NotificationInboxIngestionHandler handler
    ) {
        this.handler = handler;
    }

    @KafkaListener(
        id = "notification-service-order-listener",
        topics =
            NotificationMessagingConfiguration.TOPIC,
        groupId =
            NotificationMessagingConfiguration.GROUP,
        concurrency = "3",
        containerFactory =
            "notificationKafkaListenerContainerFactory"
    )
    public void consume(
        ConsumerRecord<
            String,
            ServiceOrderScheduledEventV1
        > record
    ) {
        var event = record.value();

        Map<String, String> context =
            new LinkedHashMap<>();

        context.put(
            "correlationId",
            event.correlationId()
        );

        context.put(
            "messageId",
            event.eventId().toString()
        );

        context.put(
            "causationId",
            event.causationId()
        );

        context.put(
            "topic",
            record.topic()
        );

        context.put(
            "partition",
            Integer.toString(
                record.partition()
            )
        );

        context.put(
            "offset",
            Long.toString(
                record.offset()
            )
        );

        try (
            CorrelationScope ignored =
                CorrelationScope.open(context)
        ) {
            NotificationInboxIngestionOutcome outcome =
                handler.handle(record);

            LOGGER.info(
                "event=notification.inbox.ingested outcome={} eventType={}",
                outcome,
                event.eventType()
            );
        }
    }
}
```

O listener termina depois da recepção durável.

---

### 12. Criar status da intenção

```java
package br.com.formacao.m16.architecture.os.notification.persistence;

public enum NotificationIntentStatus {
    READY_TO_SEND
}
```

---

### 13. Criar NotificationIntentEntity

```java
package br.com.formacao.m16.architecture.os.notification.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "service_order_notification_intent")
public class NotificationIntentEntity {

    @Id
    private UUID id;

    @Column(
        name = "source_event_id",
        nullable = false,
        unique = true
    )
    private UUID sourceEventId;

    @Column(
        name = "service_order_id",
        nullable = false,
        length = 100
    )
    private String serviceOrderId;

    @Column(
        name = "customer_id",
        nullable = false,
        length = 100
    )
    private String customerId;

    @Column(
        name = "schedule_id",
        nullable = false,
        length = 100
    )
    private String scheduleId;

    @Column(nullable = false, length = 40)
    private String channel;

    @Column(
        name = "template_code",
        nullable = false,
        length = 100
    )
    private String templateCode;

    @Column(
        nullable = false,
        length = 40
    )
    private String status;

    @Column(
        name = "created_at",
        nullable = false
    )
    private Instant createdAt;

    protected NotificationIntentEntity() {
    }

    public NotificationIntentEntity(
        UUID id,
        UUID sourceEventId,
        String serviceOrderId,
        String customerId,
        String scheduleId,
        String channel,
        String templateCode,
        String status,
        Instant createdAt
    ) {
        this.id = id;
        this.sourceEventId = sourceEventId;
        this.serviceOrderId = serviceOrderId;
        this.customerId = customerId;
        this.scheduleId = scheduleId;
        this.channel = channel;
        this.templateCode = templateCode;
        this.status = status;
        this.createdAt = createdAt;
    }
}
```

A constraint por `sourceEventId` é uma defesa adicional.

---

### 14. Criar repository da intenção

```java
package br.com.formacao.m16.architecture.os.notification.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationIntentRepository
        extends JpaRepository<
            NotificationIntentEntity,
            UUID
        > {

    long countBySourceEventId(
        UUID sourceEventId
    );
}
```

---

### 15. Criar exceptions de processamento

```java
package br.com.formacao.m16.architecture.os.notification.processing;

public class NotificationTransientException
        extends RuntimeException {

    public NotificationTransientException(
        String message
    ) {
        super(message);
    }
}
```

```java
package br.com.formacao.m16.architecture.os.notification.processing;

public class NotificationPermanentException
        extends RuntimeException {

    public NotificationPermanentException(
        String message
    ) {
        super(message);
    }
}
```

---

### 16. Criar NotificationPreparationService

```java
package br.com.formacao.m16.architecture.os.notification.processing;

import br.com.formacao.m16.architecture.os.notification.inbox.NotificationInboxRepository;
import br.com.formacao.m16.architecture.os.notification.inbox.NotificationInboxStatus;
import br.com.formacao.m16.architecture.os.notification.inbox.NotificationInboxWorkItem;
import br.com.formacao.m16.architecture.os.notification.persistence.NotificationIntentEntity;
import br.com.formacao.m16.architecture.os.notification.persistence.NotificationIntentRepository;
import br.com.formacao.m16.architecture.os.notification.persistence.NotificationIntentStatus;
import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationPreparationService {

    private final ObjectMapper objectMapper;
    private final NotificationIntentRepository intentRepository;
    private final NotificationInboxRepository inboxRepository;

    public NotificationPreparationService(
        ObjectMapper objectMapper,
        NotificationIntentRepository intentRepository,
        NotificationInboxRepository inboxRepository
    ) {
        this.objectMapper = objectMapper;
        this.intentRepository = intentRepository;
        this.inboxRepository = inboxRepository;
    }

    @Transactional(
        propagation = Propagation.REQUIRES_NEW
    )
    public void process(
        NotificationInboxWorkItem item,
        String workerId
    ) {
        ServiceOrderScheduledEventV1 event =
            deserialize(item.payload());

        validate(event);

        simulateFailure(
            event,
            item.attemptCount()
        );

        intentRepository.save(
            new NotificationIntentEntity(
                UUID.randomUUID(),
                event.eventId(),
                event.serviceOrderId(),
                event.customerId(),
                event.scheduleId(),
                "IN_APP",
                "SERVICE_ORDER_SCHEDULED_V1",
                NotificationIntentStatus
                    .READY_TO_SEND
                    .name(),
                Instant.now()
            )
        );

        int changed =
            inboxRepository.markProcessed(
                item.inboxId(),
                workerId,
                NotificationInboxStatus.PROCESSED,
                Instant.now()
            );

        if (changed != 1) {
            throw new IllegalStateException(
                "Inbox item was not marked processed"
            );
        }
    }

    private ServiceOrderScheduledEventV1 deserialize(
        String payload
    ) {
        try {
            return objectMapper.readValue(
                payload,
                ServiceOrderScheduledEventV1.class
            );
        } catch (JsonProcessingException exception) {
            throw new NotificationPermanentException(
                "Invalid persisted event payload"
            );
        }
    }

    private void validate(
        ServiceOrderScheduledEventV1 event
    ) {
        if (
            !"service-order.scheduled.v1"
                .equals(event.eventType())
        ) {
            throw new NotificationPermanentException(
                "Unsupported event type"
            );
        }

        if (event.eventVersion() != 1) {
            throw new NotificationPermanentException(
                "Unsupported event version"
            );
        }
    }

    private void simulateFailure(
        ServiceOrderScheduledEventV1 event,
        int attemptCount
    ) {
        if (
            event.customerId()
                .startsWith("PERMANENT-")
        ) {
            throw new NotificationPermanentException(
                "Permanent lab failure"
            );
        }

        if (
            event.customerId()
                .startsWith("TRANSIENT-")
                && attemptCount < 2
        ) {
            throw new NotificationTransientException(
                "Transient lab failure"
            );
        }
    }
}
```

O processamento não envia mensagem externa.

---

### 17. Criar NotificationStateService

Esse service terá métodos com:

```text
REQUIRES_NEW.
```

Responsabilidades:

- encontrar IDs prontos;
- fazer claim;
- carregar work item;
- marcar retry;
- marcar falha permanente;
- recuperar stale claims.

O claim aceita:

```text
RECEIVED;

RETRY_WAIT.
```

Ele exige:

```text
nextAttemptAt <= now.
```

---

### 18. Criar política de backoff

No `application.yaml`:

```yaml
app:
  notification:
    worker-delay-ms: 1000
    batch-size: 50
    claim-timeout-seconds: 30
    retry-base-seconds: 1
    retry-max-seconds: 30
    max-attempts: 5
```

A fórmula pode ser:

```text
delay =
min(
  max,
  base * 2 ^ attempt
).
```

Proteja contra overflow.

---

### 19. Criar NotificationProcessingWorker

```java
package br.com.formacao.m16.architecture.os.notification.processing;

import br.com.formacao.m16.architecture.os.notification.inbox.NotificationInboxWorkItem;
import br.com.formacao.m16.kafka.correlation.CorrelationMetadata;
import br.com.formacao.m16.kafka.correlation.CorrelationScope;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationProcessingWorker {

    private final NotificationStateService stateService;
    private final NotificationPreparationService preparationService;

    private final String workerId =
        UUID.randomUUID().toString();

    public NotificationProcessingWorker(
        NotificationStateService stateService,
        NotificationPreparationService preparationService
    ) {
        this.stateService = stateService;
        this.preparationService = preparationService;
    }

    @Scheduled(
        fixedDelayString =
            "${app.notification.worker-delay-ms:1000}"
    )
    public void processReady() {
        Instant now = Instant.now();

        stateService.recoverStaleClaims(now);

        for (
            UUID id :
            stateService.findReadyIds(now)
        ) {
            stateService
                .claim(id, workerId, now)
                .ifPresent(this::processClaimed);
        }
    }

    private void processClaimed(
        NotificationInboxWorkItem item
    ) {
        Map<String, String> context =
            new LinkedHashMap<>();

        context.put(
            "correlationId",
            item.correlationId()
        );

        context.put(
            "messageId",
            item.eventId().toString()
        );

        context.put(
            "causationId",
            item.causationId()
        );

        context.put(
            "topic",
            item.sourceTopic()
        );

        context.put(
            "partition",
            Integer.toString(
                item.sourcePartition()
            )
        );

        context.put(
            "offset",
            Long.toString(
                item.sourceOffset()
            )
        );

        try (
            CorrelationScope ignored =
                CorrelationScope.open(context)
        ) {
            try {
                preparationService.process(
                    item,
                    workerId
                );
            } catch (
                NotificationPermanentException permanent
            ) {
                stateService.markPermanentFailure(
                    item,
                    workerId,
                    permanent,
                    Instant.now()
                );
            } catch (Exception transientFailure) {
                stateService.markRetryOrExhausted(
                    item,
                    workerId,
                    transientFailure,
                    Instant.now()
                );
            }
        }
    }
}
```

O worker preserva a correlação original.

---

### 20. Tratar retry esgotado

Quando:

```text
attemptCount + 1
>= maxAttempts
```

o estado vai para:

```text
FAILED_PERMANENT.
```

O `lastError` deve usar:

```text
RETRY_EXHAUSTED:
NotificationTransientException.
```

Não grave stacktrace na tabela.

---

### 21. Recuperar stale claims

A query deve localizar:

```text
status = PROCESSING;

claimedAt < cutoff.
```

Ela atualiza:

```text
status:
RETRY_WAIT.

nextAttemptAt:
now.

claimedAt:
null.

claimedBy:
null.

lastError:
STALE_CLAIM_RECOVERED.
```

---

### 22. Documentar a Inbox

Arquivo:

```text
NOTIFICATION_INBOX_POLICY.md
```

Inclua:

```markdown
# Notification Inbox Policy

## Consumer

service-order-notification-v1.

## Dedup key

consumerName + eventId.

## Ack

Depois do commit da Inbox.

## Processing

Worker separado.

## Retry

Somente falha transitória.

## Permanent failure

FAILED_PERMANENT.

## Effect

Notification intent READY_TO_SEND.

## External send

Fora do escopo da parte 2.
```

---

### 23. Criar matriz de falhas

Arquivo:

```text
NOTIFICATION_FAILURE_MATRIX.md
```

```markdown
| Falha | Natureza | Ação |
|---|---|---|
| Banco da Inbox indisponível | Transitória de ingestão | Não confirmar offset |
| Evento duplicado | Esperada | Retornar normalmente |
| Payload persistido inválido | Permanente | FAILED_PERMANENT |
| Versão não suportada | Permanente | FAILED_PERMANENT |
| Falha local temporária | Transitória | RETRY_WAIT |
| Tentativas esgotadas | Permanente operacional | FAILED_PERMANENT |
| Worker encerra após claim | Recuperável | Stale recovery |
| Intent duplicada | Deduplicação adicional | Não repetir efeito |
```

---

### 24. Atualizar a documentação do fluxo

Arquivo:

```text
MESSAGING_OS_PART2.md
```

Diagrama:

```text
m16.service-order.events.v1
        |
        v
ServiceOrderScheduledConsumer
        |
        v
notification_inbox_message
        |
        v
Kafka offset commit
        |
        v
NotificationProcessingWorker
        |
        v
service_order_notification_intent
        |
        v
READY_TO_SEND
```

Registre:

```text
provider dispatch:
parte 3.
```

---

### 25. Testar ingestão

Com `@EmbeddedKafka`:

1. publique `ServiceOrderScheduledEventV1`;
2. aguarde o listener;
3. confirme uma linha na Inbox;
4. confirme status `RECEIVED`;
5. confirme topic;
6. confirme partition;
7. confirme offset;
8. confirme correlation ID;
9. confirme event ID.

Desabilite o worker neste teste para observar `RECEIVED`.

---

### 26. Testar redelivery

Publique dois records com:

```text
mesmo eventId;

mesma key;

offsets diferentes.
```

Resultado:

```text
Inbox:
uma linha.

outcome:
uma RECEIVED;
uma DUPLICATE.

consumer lag:
zero.
```

A intenção também será criada uma vez quando o worker executar.

---

### 27. Testar processamento

Crie uma Inbox válida.

Execute o worker.

Confirme:

```text
Inbox:
PROCESSED.

Intent:
READY_TO_SEND.

sourceEventId:
eventId.

intent count:
1.
```

---

### 28. Testar rollback

Force falha depois do insert da intenção e antes de `markProcessed`.

Resultado da transação:

```text
Intent:
0.

Inbox:
ainda PROCESSING
até a transação de retry.
```

Depois:

```text
Inbox:
RETRY_WAIT.
```

---

### 29. Testar retry transitório

Use:

```text
customerId:
TRANSIENT-CUSTOMER-497.
```

Fluxo esperado:

```text
RECEIVED;

PROCESSING;

RETRY_WAIT;

PROCESSING;

RETRY_WAIT;

PROCESSING;

PROCESSED.
```

Confirme:

```text
attemptCount:
2 ou valor definido
pela política.

Intent:
1.
```

---

### 30. Testar falha permanente

Use:

```text
customerId:
PERMANENT-CUSTOMER-497.
```

Resultado:

```text
FAILED_PERMANENT;

Intent:
0.
```

O item não retorna a `RETRY_WAIT`.

---

### 31. Testar stale claim

1. faça claim;
2. não execute preparação;
3. avance o relógio;
4. execute recovery;
5. confirme `RETRY_WAIT`;
6. execute o worker;
7. confirme conclusão.

---

### 32. Testar correlação

Publique:

```text
correlationId:
CORR-497.

causationId:
REQ-497.

eventId:
EVENT-497.
```

Capture o MDC dentro do worker.

Confirme:

```text
correlationId:
CORR-497.

messageId:
EVENT-497.

causationId:
REQ-497.

topic:
m16.service-order.events.v1.
```

---

### 33. Testar ponta parcial

Execute:

```text
HTTP create OS;

Outbox publish;

Kafka consume;

Inbox persist;

worker process;

intent READY_TO_SEND.
```

Esse teste ainda não envia notificação.

Ele comprova o fluxo até a intenção local.

A parte 3 completará a jornada.

---

### 34. Inspecionar o group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-notification-service-order-v1"
```

Confirme:

```text
CURRENT-OFFSET;

LOG-END-OFFSET;

LAG.
```

---

### 35. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=NotificationInboxIngestionIntegrationTest,NotificationProcessingIntegrationTest,NotificationRetryIntegrationTest,NotificationRedeliveryIntegrationTest,NotificationCorrelationIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### O módulo notification ganhou entrada própria

O consumer group representa sua capacidade.

### O listener ficou curto

Ele apenas confirma recepção durável.

### A Inbox separou ack e processamento

Kafka lag e backlog interno passaram a ser distintos.

### A constraint protegeu redelivery

O mesmo eventId não criou outra linha.

### O worker ganhou coordenação

Claims condicionais permitem múltiplas instâncias.

### O efeito ficou local e transacional

Intent e PROCESSED confirmam juntos.

### Retry ganhou limite

Falhas transitórias não entram em loop infinito.

### Falhas permanentes ficaram visíveis

Itens impossíveis permanecem preservados.

### A correlação sobreviveu ao atraso

O worker reconstruiu o contexto da mensagem.

### READY_TO_SEND ficou honesto

O cliente ainda não recebeu nada.

---

## Erros comuns importantes

### Enviar notificação no listener

O poll fica lento e sujeito a falhas externas.

### Confirmar offset antes do insert

Uma falha pode perder a mensagem.

### Usar offset como dedup key

Republicação em outro offset passa novamente.

### Usar somente eventId na constraint global

Outro consumer pode ser bloqueado.

### Fazer exists-then-insert

Existe race condition.

### Processar sem claim

Duas instâncias podem executar o efeito.

### Marcar PROCESSED fora da transação

Intent e Inbox podem divergir.

### Repetir falha permanente

O backlog nunca termina.

### Tratar timeout como sucesso

O estado real permanece desconhecido.

### Logar payload completo

Dados e volume ficam expostos.

### Chamar READY_TO_SEND de SENT

O lifecycle fica incorreto.

### Implementar provider na parte 2

A continuidade pedagógica é quebrada.

---

## Comandos úteis

### Ver consumer group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-notification-service-order-v1"
```

### Ver o topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.service-order.events.v1" `
  --from-beginning `
  --property "print.key=true" `
  --property "print.headers=true"
```

### Procurar envio externo indevido

```powershell
git grep `
  -n `
  -E `
  "RestClient|WebClient|sendEmail|sendSms|sendWhatsApp"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Consumer

Configure topic e group.

### Parte 2 — Inbox

Persista evento e metadata.

### Parte 3 — Deduplicação

Crie constraint composta.

### Parte 4 — Listener

Mantenha ingestão curta.

### Parte 5 — Worker

Crie claim e processamento.

### Parte 6 — Intent

Crie READY_TO_SEND.

### Parte 7 — Retry

Implemente backoff.

### Parte 8 — Falha permanente

Crie lifecycle final.

### Parte 9 — Correlação

Preserve IDs.

### Parte 10 — Testes

Prove redelivery e retry.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 496 foi preservada;
- parte 2 do projeto foi iniciada;
- topic da parte 1 foi reutilizado;
- contrato da parte 1 foi reutilizado;
- group de notification foi criado;
- consumer name foi criado;
- listener factory própria foi criada;
- ack mode RECORD foi definido;
- auto commit foi desabilitado;
- listener curto foi criado;
- Inbox persistente foi criada;
- unique constraint foi criada;
- consumerName faz parte da chave;
- eventId faz parte da chave;
- topic foi persistido;
- partition foi persistida;
- offset foi persistido;
- timestamp foi persistido;
- key foi persistida;
- payload foi persistido;
- correlationId foi persistido;
- causationId foi persistido;
- status RECEIVED foi criado;
- status PROCESSING foi criado;
- status RETRY_WAIT foi criado;
- status PROCESSED foi criado;
- status FAILED_PERMANENT foi criado;
- duplicata retorna normalmente;
- falha de banco impede ack;
- redelivery foi testada;
- republicação em outro offset foi testada;
- worker foi criado;
- claim condicional foi criado;
- candidate query foi limitada;
- stale claim foi recuperado;
- backoff foi criado;
- máximo de tentativas foi criado;
- retry esgotado foi tratado;
- falha permanente foi separada;
- NotificationIntentEntity foi criada;
- sourceEventId é único;
- channel IN_APP foi definido;
- template code foi definido;
- READY_TO_SEND foi definido;
- READY_TO_SEND não foi chamado de enviado;
- effect e PROCESSED compartilham transação;
- rollback conjunto foi testado;
- correlation scope foi reconstruído;
- messageId usa eventId;
- topic, partition e offset entram no MDC;
- teste de ingestão foi criado;
- teste de processamento foi criado;
- teste de retry foi criado;
- teste de falha permanente foi criado;
- teste de stale claim foi criado;
- teste de redelivery foi criado;
- teste de correlação foi criado;
- fluxo parcial foi testado;
- consumer group foi inspecionado;
- documentação da Inbox foi criada;
- matriz de falhas foi criada;
- documentação da parte 2 foi criada;
- envio externo não foi implementado;
- WhatsApp não foi implementado;
- e-mail não foi implementado;
- SMS não foi implementado;
- quarantine específica não foi antecipada;
- consolidação final não foi antecipada;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 498 está correta.

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
  "m16-notification-service-order-v1|notification_inbox_message|READY_TO_SEND|FAILED_PERMANENT|eventId|correlationId|RestClient|WebClient"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/messaging-os `
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
git commit -m "feat(m16): consumir eventos de OS com Inbox"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- integração externa;
- credenciais;
- contatos reais;
- payload real;
- banco H2;
- diretório data;
- logs;
- target;
- quarantine da parte 3;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto de mensageria de OS ganhou o lado consumidor.

O fluxo ficou:

```text
Kafka;

notification listener;

Inbox RECEIVED;

offset commit;

worker;

claim;

notification intent;

PROCESSED.
```

Você comprovou que:

- o listener não precisa enviar a notificação;
- a recepção é persistida antes do ack;
- eventId protege redelivery;
- consumerName define o escopo da deduplicação;
- o worker processa depois;
- claim protege concorrência;
- intent e PROCESSED compartilham transação;
- falha transitória usa retry e backoff;
- falha permanente não repete indefinidamente;
- stale claims são recuperados;
- correlação atravessa Inbox e worker;
- `READY_TO_SEND` não significa mensagem entregue.

A próxima aula será:

```text
498 - M16.43 - Projeto mensageria OS parte 3
```

Nela, você irá:

- consolidar o projeto ponta a ponta;
- criar o dispatcher fake de notificação;
- evoluir o lifecycle de READY_TO_SEND;
- implementar envio idempotente;
- tratar falha transitória do provider;
- tratar falha permanente;
- criar quarantine operacional;
- integrar métricas;
- validar logs correlacionados;
- executar testes completos;
- criar runbook;
- fechar o projeto de mensageria de OS.

Nenhum envio externo ou dispatcher foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei consumer group próprio.
- [ ] Persistei a Inbox antes do ack.
- [ ] Criei deduplicação por consumer e eventId.
- [ ] Criei worker e claim.
- [ ] Criei READY_TO_SEND.
- [ ] Implementei retry e falha permanente.
- [ ] Preservei correlação.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O listener repete o mesmo record

Confirme commit da Inbox, ack mode e transaction propagation.

### Duas linhas aparecem para o mesmo eventId

A unique constraint pode não existir no schema real.

### O lag fica zero, mas a intent não aparece

Consulte RECEIVED e RETRY_WAIT na Inbox.

### O item fica PROCESSING

Stale recovery pode estar desabilitado.

### O retry acontece sem pausa

Confirme `nextAttemptAt` e backoff.

### FAILED_PERMANENT volta a processar

A candidate query está incluindo status incorreto.

### Duas intents são criadas

Confirme claim e unique constraint em `sourceEventId`.

### A correlação desaparece no worker

Os IDs podem não ter sido persistidos na Inbox.

### O provider foi chamado

Remova qualquer RestClient ou adapter externo desta aula.

### READY_TO_SEND é tratado como enviado

Revise o lifecycle e os nomes do endpoint.

---

## Perguntas de revisão

1. Qual é o consumer group?
2. Qual é o consumer name?
3. Quando o offset pode avançar?
4. Qual é a dedup key?
5. Por que incluir consumerName?
6. Por que não usar offset?
7. O que significa RECEIVED?
8. O que significa PROCESSING?
9. O que significa RETRY_WAIT?
10. O que significa PROCESSED?
11. O que significa FAILED_PERMANENT?
12. O que é claim?
13. O que é stale claim?
14. Qual é o efeito local?
15. O que significa READY_TO_SEND?
16. A notificação foi enviada?
17. Como a correlação chega ao worker?
18. Redelivery foi testada?
19. Provider externo foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. m16-notification-service-order-v1.
2. service-order-notification-v1.
3. Depois do commit da Inbox.
4. consumerName + eventId.
5. Permitir outros consumers.
6. Republicação pode mudar offset.
7. Persistida e pronta.
8. Reivindicada.
9. Aguardando retry.
10. Intent preparada.
11. Falha final preservada.
12. Reserva condicional do item.
13. PROCESSING abandonado.
14. Criar notification intent.
15. Preparada para envio.
16. Não.
17. IDs persistidos na Inbox.
18. Sim.
19. Não.
20. Projeto mensageria OS parte 3.

---

## Desafio opcional

Adicione um segundo consumer lógico:

```text
service-order-audit-v1.
```

Requisitos:

- mesmo topic;
- outro group;
- outro consumerName;
- mesma eventId permitida;
- Inbox própria ou escopo próprio;
- efeito local de auditoria;
- deduplicação;
- correlação;
- nenhum envio externo;
- nenhum código da parte 3.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 497 - M16.42 - Projeto mensageria OS parte 2

- Continuei após o producer da parte 1.
- Reutilizei o topic `m16.service-order.events.v1`.
- Reutilizei `ServiceOrderScheduledEventV1`.
- Criei o group `m16-notification-service-order-v1`.
- Criei o consumer name `service-order-notification-v1`.
- Mantive o listener curto.
- Configurei ack por record.
- Desabilitei auto commit.
- Criei `notification_inbox_message`.
- Criei unique constraint por consumerName e eventId.
- Persistei payload e metadata Kafka.
- Persistei correlationId e causationId.
- Criei lifecycle RECEIVED, PROCESSING, RETRY_WAIT, PROCESSED e FAILED_PERMANENT.
- Persistei a Inbox antes do ack.
- Tratei redelivery como duplicata.
- Criei worker separado.
- Criei candidate query.
- Criei claim condicional.
- Criei stale recovery.
- Criei retry com backoff.
- Limitei tentativas.
- Separei falha permanente.
- Criei `NotificationIntentEntity`.
- Criei unique constraint por sourceEventId.
- Defini channel IN_APP.
- Defini template `SERVICE_ORDER_SCHEDULED_V1`.
- Defini status READY_TO_SEND.
- Mantive READY_TO_SEND diferente de enviado.
- Coloquei intent e PROCESSED na mesma transação.
- Testei rollback.
- Testei retry transitório.
- Testei falha permanente.
- Testei redelivery em outro offset.
- Preservei a correlação no worker.
- Testei o fluxo até a intenção local.
- Não implementei provider externo.
- Não antecipei a consolidação da parte 3.
- Próxima aula: Projeto mensageria OS parte 3.
```

---

## Referência técnica curta

- Apache Kafka — Consumer Groups.
- Apache Kafka — Delivery Semantics.
- Spring Kafka — Listener Containers.
- Spring Kafka — Committing Offsets.
- Transactional Inbox Pattern.
- Idempotent Consumer Pattern.
- Retry with Exponential Backoff.
- SLF4J MDC.
- Jakarta Persistence — Unique Constraints.
- Modular Monolith.

Regra final:

```text
a segunda parte do projeto de mensageria de OS transforma o módulo notification em consumidor confiável sem realizar envio externo: o group m16-notification-service-order-v1 recebe service-order.scheduled.v1, o listener persiste eventId, payload, key, topic, partition, offset e correlação em notification_inbox_message e só retorna depois do commit; a constraint consumerName + eventId converte redelivery ou republicação em DUPLICATE; um worker separado reivindica registros por atualização condicional, reconstrói o MDC, valida o contrato e cria uma intenção READY_TO_SEND; intent e status PROCESSED compartilham a mesma transação, falhas transitórias usam RETRY_WAIT com backoff, falhas permanentes ficam preservadas e claims órfãos são recuperados; READY_TO_SEND confirma preparação local, não entrega ao cliente, e dispatcher, provider fake, quarantine, métricas finais e testes completos pertencem exclusivamente à parte 3.
```
