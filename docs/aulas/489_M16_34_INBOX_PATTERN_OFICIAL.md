# 489 - M16.34 - Inbox Pattern

## Apresentação da aula

Na aula 488, você implementou o Outbox Pattern no lado produtor.

O fluxo passou a ser:

```text
transação de negócio;

pedido;

registro outbox;

commit;

polling publisher;

Kafka;

consumer.
```

Com isso, um pedido confirmado no banco não perde sua intenção de publicação quando o broker está indisponível.

Na aula 487, você também implementou deduplicação no lado consumidor:

```text
consumerName + eventId;

inbox persistente;

constraint única;

efeito de negócio
na mesma transação.
```

Essa solução protegeu um processamento direto contra redelivery.

Agora o lado consumidor será formalizado como um fluxo completo de entrada persistente.

Considere um consumer que recebe um evento e executa imediatamente uma operação lenta:

```text
chama serviço externo;

calcula projeção;

atualiza várias tabelas;

gera documento;

aguarda dependência temporária.
```

Enquanto esse processamento ocorre:

- o poll fica mais demorado;
- a partition permanece ocupada;
- rebalances podem acontecer;
- o offset ainda não foi confirmado;
- uma falha pode provocar nova entrega;
- o backlog continua no Kafka;
- a aplicação mistura ingestão e processamento.

A pergunta central desta aula será:

```text
como confirmar que uma mensagem
foi recebida de forma durável

e processá-la depois,
com lifecycle, retry,
concorrência e recuperação?
```

A resposta será:

```text
Inbox Pattern.
```

Nesta aula, Inbox Pattern não significará apenas:

```text
tabela de IDs processados.
```

Ele será tratado como:

```text
uma caixa de entrada persistente
com estado de processamento.
```

O listener Kafka terá uma responsabilidade curta:

```text
receber;

persistir;

retornar.
```

Depois do commit da transação de inbox, o listener retorna normalmente.

Com ack mode `RECORD`, o offset pode ser confirmado.

Um worker separado executará:

```text
claim;

processamento;

retry;

backoff;

stale recovery;

marcação final.
```

O fluxo completo será:

```text
Kafka record;

listener de ingestão;

BEGIN;

insert inbox;

COMMIT;

retorno do listener;

commit do offset;

worker;

claim;

efeito local;

mark PROCESSED.
```

Quando houver redelivery:

```text
mesmo consumerName;

mesmo eventId;

unique constraint;

DUPLICATE;

listener retorna;

offset avança.
```

Quando o processamento falhar temporariamente:

```text
PROCESSING;

rollback do efeito;

RETRY_WAIT;

nextAttemptAt;

nova tentativa.
```

Quando o processamento falhar de forma permanente:

```text
FAILED_PERMANENT;

causa preservada;

alerta;

decisão operacional.
```

O topic do laboratório será:

```text
m16.orders.inbox-lab.v1.
```

O group de ingestão será:

```text
m16-order-inbox-ingestion-v1.
```

O consumer lógico será:

```text
order-created-inbox-v1.
```

A tabela será:

```text
inbox_message.
```

O lifecycle será:

```text
RECEIVED;

PROCESSING;

RETRY_WAIT;

PROCESSED;

FAILED_PERMANENT.
```

A aula reutilizará princípios anteriores:

- poison messages da aula 486;
- deduplicação da aula 487;
- claims e stale recovery da aula 488;
- `eventId` estável;
- transações locais;
- processamento at-least-once.

O fluxo assumirá que o record já passou por desserialização e validação de contrato.

Bytes malformados continuam pertencendo ao tratamento de poison message.

O Inbox Pattern não substitui quarentena.

Também não substitui invariantes de negócio.

A aula não implementará:

- saga;
- CDC;
- Kafka transactions;
- exactly-once global;
- reprocessador manual completo;
- painel operacional;
- workflow humano;
- chamadas externas idempotentes;
- inbox em banco separado;
- fila interna em memória;
- event sourcing.

A próxima aula será:

```text
490 - M16.35 - Saga conceitual
```

Ao final, você deverá explicar:

```text
por que persistir antes de confirmar
protege contra perda;

por que o listener
deve ser curto;

por que Kafka lag pode cair
enquanto o inbox backlog cresce;

por que claim precisa ser atômico;

por que efeito e PROCESSED
precisam da mesma transação;

por que RETRY_WAIT
não é FAILED_PERMANENT;

por que claims órfãos
precisam de recuperação;

por que deduplicação
continua necessária;

por que Inbox Pattern
não cria exactly-once global.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

A aula 488 respondeu:

```text
como garantir que uma mudança
confirmada no banco
não perca sua publicação?
```

A aula 489 responderá:

```text
como garantir que uma mensagem
recebida seja persistida,
processada e recuperável?
```

Nesta aula:

```text
inbox persistente:
sim.

ingestão:
sim.

deduplicação:
sim.

lifecycle:
sim.

worker:
sim.

claim:
sim.

retry:
sim.

backoff:
sim.

stale recovery:
sim.

backlog:
sim.

cleanup:
sim.

poison bytes:
reutilizado conceitualmente.

quarantine:
não reimplementada.

saga:
não.

CDC:
não.

exactly-once:
não.
```

A regra central será:

```text
o listener confirma recepção durável;

o worker confirma processamento;

esses dois momentos
não são a mesma coisa.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
src/main/java/br/com/formacao/m16/kafka
└── inbox
    ├── config
    │   ├── InboxConfiguration.java
    │   └── InboxTopicNames.java
    ├── consumer
    │   └── OrderInboxConsumer.java
    ├── ingestion
    │   ├── InboxIngestionHandler.java
    │   ├── InboxIngestionOutcome.java
    │   └── InboxIngestionService.java
    ├── persistence
    │   ├── InboxMessageEntity.java
    │   ├── InboxMessageRepository.java
    │   ├── InboxMessageStatus.java
    │   └── InboxWorkItem.java
    ├── processing
    │   ├── InboxOrderProjectionEntity.java
    │   ├── InboxOrderProjectionRepository.java
    │   ├── InboxPermanentProcessingException.java
    │   ├── InboxProcessingService.java
    │   ├── InboxProcessingWorker.java
    │   ├── InboxStateService.java
    │   └── InboxTransientProcessingException.java
    └── web
        ├── InboxStatusController.java
        └── InboxStatusResponse.java
```

Testes:

```text
src/test/java/br/com/formacao/m16/kafka/inbox
├── InboxIngestionIntegrationTest.java
├── InboxProcessingIntegrationTest.java
├── InboxConcurrencyTest.java
├── InboxRetryTest.java
└── InboxStaleClaimTest.java
```

Você irá:

1. criar topic exclusivo;
2. criar group exclusivo;
3. criar tabela inbox;
4. criar constraint única composta;
5. persistir payload e metadata;
6. confirmar offset somente após commit;
7. reconhecer redelivery;
8. criar lifecycle explícito;
9. buscar itens prontos;
10. fazer claim condicional;
11. processar fora do listener;
12. aplicar efeito e status final juntos;
13. aplicar retry com backoff;
14. separar falha permanente;
15. recuperar stale claims;
16. medir backlog;
17. comparar lag e inbox backlog;
18. testar broker redelivery;
19. testar concorrência;
20. testar rollback;
21. criar cleanup seguro;
22. executar o gate;
23. commitar;
24. preparar Saga conceitual.

---

## Conceito essencial

### Inbox Pattern

Inbox Pattern persiste mensagens recebidas antes de executar seu processamento completo.

Ele cria uma fronteira durável entre:

```text
recepção;

processamento.
```

Recepção responde:

```text
a mensagem foi armazenada
de forma confiável?
```

Processamento responde:

```text
o efeito foi concluído?
```

Essas respostas podem acontecer em momentos diferentes.

---

### Ingestão

Ingestão deve ser pequena e previsível.

Responsabilidades:

- validar identidade mínima;
- persistir payload;
- persistir metadata;
- aplicar constraint de deduplicação;
- confirmar a transação;
- retornar.

Ela não deve:

- chamar serviço externo;
- executar cálculo pesado;
- gerar arquivo;
- aguardar retry longo;
- manter lock durante rede;
- publicar outro evento diretamente;
- iniciar saga.

---

### Persistir antes do ack

Fluxo correto:

```text
record recebido;

insert inbox;

database commit;

listener retorna;

offset commit.
```

Se o banco falhar:

```text
listener lança exception;

offset não avança;

record volta.
```

Se o banco confirmar e o offset falhar:

```text
record volta;

unique constraint detecta duplicata;

listener retorna;

offset avança.
```

---

### Deduplicação de ingestão

A chave será:

```text
consumer_name + event_id.
```

Ela responde:

```text
esta capacidade
já recebeu este evento?
```

A constraint não depende de:

- thread;
- instância;
- pod;
- partition;
- offset;
- memória local.

---

### Payload persistido

A baseline armazenará JSON.

Campos principais:

```text
eventId;

eventType;

eventVersion;

payload;

messageKey;

sourceTopic;

sourcePartition;

sourceOffset;

receivedAt.
```

O payload precisa ser suficiente para processamento posterior.

Não armazene apenas o ID se o worker depender de dados que podem mudar em outra tabela.

---

### Lifecycle da inbox

#### RECEIVED

Mensagem persistida e pronta para processamento.

#### PROCESSING

Um worker fez claim.

#### RETRY_WAIT

Falha transitória; aguarda `nextAttemptAt`.

#### PROCESSED

Efeito concluído e confirmado.

#### FAILED_PERMANENT

Falha não recuperável automaticamente.

---

### Claim

Duas instâncias podem encontrar a mesma linha.

A claim deve ser atualização condicional:

```sql
UPDATE inbox_message
SET status = 'PROCESSING'
WHERE id = ?
  AND status IN ('RECEIVED', 'RETRY_WAIT')
  AND next_attempt_at <= now();
```

Uma instância recebe `1`.

As outras recebem `0`.

---

### Worker

O worker:

1. recupera stale claims;
2. encontra candidatos;
3. reivindica;
4. processa;
5. marca sucesso ou falha.

O worker não deve manter uma transação abrangendo todos os itens do lote.

Cada item precisa de isolamento.

---

### Efeito e PROCESSED

Para efeitos no mesmo banco:

```text
BEGIN;

apply business effect;

update inbox PROCESSED;

COMMIT.
```

Se o efeito falhar:

```text
ROLLBACK effect;

ROLLBACK PROCESSED.
```

Depois, uma transação separada marca `RETRY_WAIT` ou `FAILED_PERMANENT`.

---

### Janela entre claim e processamento

Claim é confirmado antes do efeito.

Se a instância encerrar:

```text
status:
PROCESSING.
```

O stale recovery identifica:

```text
claimedAt < now - timeout.
```

O item volta para `RETRY_WAIT`.

---

### Retry

Retry só deve tratar erro transitório.

Exemplos:

- banco auxiliar indisponível;
- lock temporário;
- timeout interno;
- serviço recuperável;
- recurso temporariamente ocupado.

Backoff evita loop rápido.

A baseline utilizará:

```text
1s;

2s;

4s;

8s;

limite máximo.
```

---

### Falha permanente

Exemplos:

- estado de negócio impossível;
- referência definitivamente inexistente;
- versão não suportada depois da ingestão;
- payload semanticamente inválido;
- operação proibida;
- configuração ausente sem fallback.

O item vai para:

```text
FAILED_PERMANENT.
```

Ele não deve ser apagado automaticamente.

---

### Kafka lag e inbox backlog

Depois que a ingestão confirma offsets, o Kafka lag pode chegar a zero.

Mesmo assim, podem existir milhares de itens:

```text
RECEIVED;

RETRY_WAIT;

PROCESSING.
```

Portanto:

```text
Kafka lag:
backlog antes da inbox.

Inbox backlog:
backlog depois da ingestão.
```

Monitorar apenas lag cria uma falsa impressão de saúde.

---

### Inbox não é event store

A inbox é uma estrutura operacional de processamento.

Ela não substitui:

- event store;
- auditoria regulatória;
- histórico de domínio;
- topic Kafka;
- data lake;
- log de segurança.

Sua retenção atende recuperação e operação.

---

### Outbox e Inbox

No produtor:

```text
state + outbox
na mesma transação.
```

No consumidor:

```text
inbox + deduplicação
antes do ack.
```

Juntos:

```text
producer:
não perde intenção.

consumer:
não perde recepção.

sistema:
aceita duplicidade.
```

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

### 2. Criar nomes do laboratório

Arquivo:

```text
InboxTopicNames.java
```

```java
package br.com.formacao.m16.kafka.inbox.config;

public final class InboxTopicNames {

    public static final String ORDERS =
        "m16.orders.inbox-lab.v1";

    public static final String GROUP =
        "m16-order-inbox-ingestion-v1";

    public static final String CONSUMER_NAME =
        "order-created-inbox-v1";

    private InboxTopicNames() {
    }
}
```

---

### 3. Declarar o topic

```java
@Bean
NewTopic inboxOrdersTopic() {
    return TopicBuilder
        .name(InboxTopicNames.ORDERS)
        .partitions(3)
        .replicas(1)
        .build();
}
```

---

### 4. Configurar o worker

Adicione:

```yaml
app:
  inbox:
    worker-delay-ms: 1000
    batch-size: 50
    claim-timeout-seconds: 30
    retry-base-seconds: 1
    retry-max-seconds: 60
    max-attempts: 5
    cleanup-retention-days: 7
```

Valores de laboratório.

---

### 5. Criar status

Arquivo:

```text
InboxMessageStatus.java
```

```java
package br.com.formacao.m16.kafka.inbox.persistence;

public enum InboxMessageStatus {
    RECEIVED,
    PROCESSING,
    RETRY_WAIT,
    PROCESSED,
    FAILED_PERMANENT
}
```

---

### 6. Criar InboxMessageEntity

```java
package br.com.formacao.m16.kafka.inbox.persistence;

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
    name = "inbox_message",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_inbox_consumer_event",
            columnNames = {
                "consumer_name",
                "event_id"
            }
        )
    },
    indexes = {
        @Index(
            name = "idx_inbox_ready",
            columnList = "status,next_attempt_at,received_at"
        ),
        @Index(
            name = "idx_inbox_claim",
            columnList = "status,claimed_at"
        )
    }
)
public class InboxMessageEntity {

    @Id
    private UUID id;

    @Column(name = "consumer_name", nullable = false, length = 120)
    private String consumerName;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "event_type", nullable = false, length = 150)
    private String eventType;

    @Column(name = "event_version", nullable = false)
    private int eventVersion;

    @Column(name = "message_key", length = 200)
    private String messageKey;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Column(name = "source_topic", nullable = false, length = 200)
    private String sourceTopic;

    @Column(name = "source_partition", nullable = false)
    private int sourcePartition;

    @Column(name = "source_offset", nullable = false)
    private long sourceOffset;

    @Column(name = "source_timestamp", nullable = false)
    private Instant sourceTimestamp;

    @Column(name = "received_at", nullable = false)
    private Instant receivedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private InboxMessageStatus status;

    @Column(name = "attempt_count", nullable = false)
    private int attemptCount;

    @Column(name = "next_attempt_at", nullable = false)
    private Instant nextAttemptAt;

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

    protected InboxMessageEntity() {
    }

    public InboxMessageEntity(
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
        this.receivedAt = receivedAt;
        this.status = InboxMessageStatus.RECEIVED;
        this.attemptCount = 0;
        this.nextAttemptAt = receivedAt;
    }

    public UUID id() {
        return id;
    }
}
```

---

### 7. Criar o work item

```java
package br.com.formacao.m16.kafka.inbox.persistence;

import java.util.UUID;

public record InboxWorkItem(
    UUID id,
    UUID eventId,
    String eventType,
    int eventVersion,
    String messageKey,
    String payload,
    String sourceTopic,
    int sourcePartition,
    long sourceOffset,
    int attemptCount
) {
}
```

---

### 8. Criar repository

Responsabilidades:

- salvar ingestão;
- encontrar candidatos;
- claim condicional;
- carregar work item;
- marcar processed;
- marcar retry;
- marcar permanent;
- recuperar stale;
- contar por status;
- cleanup.

Exemplo de claim:

```java
@Modifying
@Query("""
    update InboxMessageEntity message
       set message.status = :processing,
           message.claimedAt = :now,
           message.claimedBy = :workerId
     where message.id = :id
       and message.status in :readyStatuses
       and message.nextAttemptAt <= :now
    """)
int claim(
    UUID id,
    List<InboxMessageStatus> readyStatuses,
    InboxMessageStatus processing,
    String workerId,
    Instant now
);
```

Use `Pageable` na busca.

---

### 9. Criar outcome de ingestão

```java
package br.com.formacao.m16.kafka.inbox.ingestion;

public enum InboxIngestionOutcome {
    RECEIVED,
    DUPLICATE
}
```

---

### 10. Criar InboxIngestionService

```java
package br.com.formacao.m16.kafka.inbox.ingestion;

import br.com.formacao.m16.kafka.inbox.config.InboxTopicNames;
import br.com.formacao.m16.kafka.inbox.persistence.InboxMessageEntity;
import br.com.formacao.m16.kafka.inbox.persistence.InboxMessageRepository;
import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.UUID;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InboxIngestionService {

    private final InboxMessageRepository repository;
    private final ObjectMapper objectMapper;

    public InboxIngestionService(
        InboxMessageRepository repository,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void receive(
        ConsumerRecord<
            String,
            OrderCreatedIntegrationEventV1
        > record
    ) {
        OrderCreatedIntegrationEventV1 event =
            record.value();

        repository.saveAndFlush(
            new InboxMessageEntity(
                UUID.randomUUID(),
                InboxTopicNames.CONSUMER_NAME,
                event.eventId(),
                event.eventType(),
                event.eventVersion(),
                record.key(),
                serialize(event),
                record.topic(),
                record.partition(),
                record.offset(),
                Instant.ofEpochMilli(record.timestamp()),
                Instant.now()
            )
        );
    }

    private String serialize(
        OrderCreatedIntegrationEventV1 event
    ) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException(
                "Inbox payload serialization failed",
                exception
            );
        }
    }
}
```

A serialização ocorre antes de o listener retornar.

---

### 11. Criar handler de ingestão

```java
package br.com.formacao.m16.kafka.inbox.ingestion;

import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Component
public class InboxIngestionHandler {

    private final InboxIngestionService service;

    public InboxIngestionHandler(
        InboxIngestionService service
    ) {
        this.service = service;
    }

    public InboxIngestionOutcome handle(
        ConsumerRecord<
            String,
            OrderCreatedIntegrationEventV1
        > record
    ) {
        try {
            service.receive(record);

            return InboxIngestionOutcome.RECEIVED;
        } catch (
            DataIntegrityViolationException duplicate
        ) {
            return InboxIngestionOutcome.DUPLICATE;
        }
    }
}
```

Em produção, confirme constraint ou SQLState antes de classificar toda violação como duplicata.

---

### 12. Criar o listener

```java
package br.com.formacao.m16.kafka.inbox.consumer;

import br.com.formacao.m16.kafka.inbox.config.InboxTopicNames;
import br.com.formacao.m16.kafka.inbox.ingestion.InboxIngestionHandler;
import br.com.formacao.m16.kafka.inbox.ingestion.InboxIngestionOutcome;
import br.com.formacao.m16.kafka.integration.event.OrderCreatedIntegrationEventV1;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderInboxConsumer {

    private static final Logger LOGGER =
        LoggerFactory.getLogger(
            OrderInboxConsumer.class
        );

    private final InboxIngestionHandler handler;

    public OrderInboxConsumer(
        InboxIngestionHandler handler
    ) {
        this.handler = handler;
    }

    @KafkaListener(
        id = "order-inbox-ingestion-listener",
        topics = InboxTopicNames.ORDERS,
        groupId = InboxTopicNames.GROUP,
        concurrency = "3"
    )
    public void consume(
        ConsumerRecord<
            String,
            OrderCreatedIntegrationEventV1
        > record
    ) {
        InboxIngestionOutcome outcome =
            handler.handle(record);

        LOGGER.info(
            "Inbox ingestion outcome={} eventId={} "
                + "topic={} partition={} offset={}",
            outcome,
            record.value().eventId(),
            record.topic(),
            record.partition(),
            record.offset()
        );
    }
}
```

Se a transação de inbox falhar por causa não classificada, a exception precisa sair e impedir o commit do offset.

---

### 13. Criar a projeção

```java
package br.com.formacao.m16.kafka.inbox.processing;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inbox_order_projection")
public class InboxOrderProjectionEntity {

    @Id
    private UUID id;

    @Column(name = "event_id", nullable = false, unique = true)
    private UUID eventId;

    @Column(name = "order_id", nullable = false, length = 100)
    private String orderId;

    @Column(name = "customer_id", nullable = false, length = 100)
    private String customerId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal total;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected InboxOrderProjectionEntity() {
    }

    public InboxOrderProjectionEntity(
        UUID id,
        UUID eventId,
        String orderId,
        String customerId,
        BigDecimal total,
        Instant createdAt
    ) {
        this.id = id;
        this.eventId = eventId;
        this.orderId = orderId;
        this.customerId = customerId;
        this.total = total;
        this.createdAt = createdAt;
    }
}
```

O `eventId` único cria defesa adicional.

---

### 14. Criar exceptions de processamento

```java
package br.com.formacao.m16.kafka.inbox.processing;

public class InboxTransientProcessingException
        extends RuntimeException {

    public InboxTransientProcessingException(
        String message
    ) {
        super(message);
    }
}
```

```java
package br.com.formacao.m16.kafka.inbox.processing;

public class InboxPermanentProcessingException
        extends RuntimeException {

    public InboxPermanentProcessingException(
        String message
    ) {
        super(message);
    }
}
```

---

### 15. Criar InboxProcessingService

Esse método executa em transação própria:

```java
@Transactional(
    propagation = Propagation.REQUIRES_NEW
)
public void process(
    InboxWorkItem item,
    String workerId
) {
    repository.assertClaimedBy(
        item.id(),
        workerId
    );

    OrderCreatedIntegrationEventV1 event =
        deserialize(item.payload());

    validateBusinessRules(event);

    projectionRepository.save(
        new InboxOrderProjectionEntity(
            UUID.randomUUID(),
            event.eventId(),
            event.orderId(),
            event.customerId(),
            event.total(),
            Instant.now()
        )
    );

    int changed =
        repository.markProcessed(
            item.id(),
            workerId,
            InboxMessageStatus.PROCESSED,
            Instant.now()
        );

    if (changed != 1) {
        throw new IllegalStateException(
            "Inbox item was not marked processed"
        );
    }
}
```

O efeito e o status final compartilham a transação.

---

### 16. Criar InboxStateService

Métodos com `REQUIRES_NEW`:

- `findReadyIds`;
- `claim`;
- `markRetry`;
- `markPermanentFailure`;
- `recoverStaleClaims`;
- `statusSnapshot`;
- `cleanupProcessed`.

O método `claim` retorna `Optional<InboxWorkItem>`.

O método de retry calcula:

```text
attemptCount + 1;

nextAttemptAt;

lastError;

RETRY_WAIT.
```

Quando `attemptCount` atingir `maxAttempts`, a falha transitória esgotada pode ser classificada como:

```text
FAILED_PERMANENT
```

ou:

```text
RETRY_EXHAUSTED
```

A baseline utilizará `FAILED_PERMANENT` com mensagem `RETRY_EXHAUSTED`.

---

### 17. Criar o worker

```java
package br.com.formacao.m16.kafka.inbox.processing;

import br.com.formacao.m16.kafka.inbox.persistence.InboxWorkItem;
import java.time.Instant;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class InboxProcessingWorker {

    private final InboxStateService stateService;
    private final InboxProcessingService processingService;

    private final String workerId =
        UUID.randomUUID().toString();

    public InboxProcessingWorker(
        InboxStateService stateService,
        InboxProcessingService processingService
    ) {
        this.stateService = stateService;
        this.processingService = processingService;
    }

    @Scheduled(
        fixedDelayString =
            "${app.inbox.worker-delay-ms:1000}"
    )
    public void processReady() {
        Instant now = Instant.now();

        stateService.recoverStaleClaims(now);

        for (UUID id : stateService.findReadyIds(now)) {
            stateService
                .claim(id, workerId, now)
                .ifPresent(this::processClaimed);
        }
    }

    private void processClaimed(
        InboxWorkItem item
    ) {
        try {
            processingService.process(
                item,
                workerId
            );
        } catch (
            InboxPermanentProcessingException permanent
        ) {
            stateService.markPermanentFailure(
                item,
                workerId,
                permanent,
                Instant.now()
            );
        } catch (Exception transientFailure) {
            stateService.markRetry(
                item,
                workerId,
                transientFailure,
                Instant.now()
            );
        }
    }
}
```

O worker não captura `Error` nem esconde falhas da JVM.

---

### 18. Simular falhas

No `validateBusinessRules`:

```text
orderId startsWith PERMANENT-:
falha permanente.

orderId startsWith TRANSIENT-:
falha transitória nas duas primeiras tentativas.

outros:
sucesso.
```

Use um contador persistente ou baseado em `attemptCount`.

Não use apenas memória em um teste de restart.

---

### 19. Criar endpoint de status

Endpoint:

```text
GET /api/v1/lab/kafka/inbox/status
```

Response:

```java
public record InboxStatusResponse(
    long received,
    long processing,
    long retryWait,
    long processed,
    long failedPermanent,
    Instant oldestReadyAt,
    long oldestReadyAgeSeconds
) {
}
```

Não retorne payload completo.

---

### 20. Publicar evento válido

Use um producer de laboratório ou a CLI.

Payload:

```json
{
  "eventId": "1fdb2ac3-2c82-4cf5-a981-8cc8e8ac67bb",
  "eventType": "orders.created.v1",
  "eventVersion": 1,
  "occurredAt": "2026-07-12T19:00:00Z",
  "orderId": "ORD-489-0001",
  "customerId": "CUS-489-0001",
  "total": 299.90
}
```

Confirme:

```text
Kafka lag:
0.

Inbox:
PROCESSED 1.

Projection:
1.
```

---

### 21. Publicar o mesmo eventId novamente

O novo record pode ter outro offset.

Resultado:

```text
ingestion:
DUPLICATE.

inbox:
uma linha.

projection:
uma linha.

Kafka lag:
0.
```

---

### 22. Testar worker parado

Desabilite temporariamente o scheduling por property de teste ou pare o worker.

Publique vários eventos.

Resultado:

```text
Kafka lag:
0.

Inbox RECEIVED:
cresce.

Projection:
não cresce.
```

Isso comprova que lag e inbox backlog são diferentes.

---

### 23. Testar falha transitória

Publique:

```text
orderId:
TRANSIENT-489-0001.
```

Observe:

```text
RECEIVED;

PROCESSING;

RETRY_WAIT;

PROCESSING;

PROCESSED.
```

Confirme `attemptCount`.

---

### 24. Testar falha permanente

Publique:

```text
orderId:
PERMANENT-489-0001.
```

Resultado:

```text
FAILED_PERMANENT.
```

O worker não deve tentar indefinidamente.

---

### 25. Testar stale claim

1. faça claim;
2. interrompa antes de processar;
3. avance o relógio ou aguarde timeout;
4. execute recovery;
5. confirme `RETRY_WAIT`;
6. execute processamento.

O item não fica preso em `PROCESSING`.

---

### 26. Testar concorrência

Dois workers recebem o mesmo candidate ID.

Resultado:

```text
um claim:
1.

outro claim:
0.

uma projeção.
```

A constraint de `eventId` na projeção é defesa adicional, não substituto do claim.

---

### 27. Testar rollback do processamento

Force exception depois do save da projeção e antes do `markProcessed`.

Resultado:

```text
projection:
rollback.

inbox:
continua PROCESSING
até markRetry.

depois:
RETRY_WAIT.
```

Na próxima tentativa, o efeito pode ser concluído.

---

### 28. Testar falha da ingestão

Pare o banco ou faça o repository lançar exception.

O listener deve falhar.

O offset não deve avançar.

Quando o banco voltar, o record é entregue novamente e persistido.

---

### 29. Criar cleanup seguro

Somente:

```text
status = PROCESSED;

processedAt < cutoff;

lote limitado.
```

`FAILED_PERMANENT` exige política própria e não deve ser apagado pelo mesmo job automaticamente.

---

### 30. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=InboxIngestionIntegrationTest,InboxProcessingIntegrationTest,InboxConcurrencyTest,InboxRetryTest,InboxStaleClaimTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### Recepção e processamento foram separados

O listener ficou curto e o worker assumiu o efeito.

### O offset passou a representar recepção durável

Ele não representa necessariamente processamento final.

### A inbox virou backlog operacional

Itens recebidos permanecem visíveis até a conclusão.

### A deduplicação permaneceu na entrada

Redelivery não cria nova linha.

### Claims permitiram várias instâncias

A atualização condicional escolhe o worker.

### O efeito e PROCESSED ficaram atômicos

Falha intermediária faz rollback.

### Retry ganhou estado próprio

`RETRY_WAIT` não foi confundido com falha permanente.

### Claims órfãos foram recuperados

`PROCESSING` não fica preso.

### Lag e backlog foram diferenciados

Saúde exige observar os dois.

### Outbox e Inbox se complementaram

A origem preserva publicação; o destino preserva recepção.

---

## Erros comuns importantes

### Confirmar offset antes do insert

Uma falha pode perder a mensagem.

### Processar tudo no listener

O consumer fica lento e sujeito a rebalance.

### Tratar RECEIVED como PROCESSED

O efeito ainda não ocorreu.

### Usar fila em memória

Restart perde mensagens.

### Fazer claim com select simples

Duas instâncias podem processar.

### Marcar PROCESSED fora da transação do efeito

Estado e efeito podem divergir.

### Tratar qualquer erro como retry

Falhas permanentes entram em loop.

### Tratar qualquer erro como permanente

Falhas transitórias perdem recuperação automática.

### Monitorar apenas Kafka lag

Inbox backlog pode crescer escondido.

### Limpar FAILED_PERMANENT automaticamente

Evidências são perdidas.

### Armazenar payload sem proteção

Dados sensíveis podem permanecer além do necessário.

### Chamar Inbox de exactly-once

Efeitos externos continuam exigindo idempotência própria.

---

## Comandos úteis

### Ver group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-order-inbox-ingestion-v1"
```

### Ver inbox status

```powershell
Invoke-RestMethod `
  "http://localhost:8084/api/v1/lab/kafka/inbox/status"
```

### Testes

```powershell
.\mvnw.cmd `
  -Dtest=Inbox*Test `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Tabela

Crie inbox persistente.

### Parte 2 — Ingestão

Persista antes do ack.

### Parte 3 — Deduplicação

Use consumer + eventId.

### Parte 4 — Worker

Separe processamento.

### Parte 5 — Claim

Proteja concorrência.

### Parte 6 — Transação

Una efeito e PROCESSED.

### Parte 7 — Retry

Use RETRY_WAIT e backoff.

### Parte 8 — Recovery

Recupere stale claims.

### Parte 9 — Métricas

Compare lag e backlog.

### Parte 10 — Cleanup

Apague apenas PROCESSED antigos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 488 foi preservada;
- Inbox Pattern foi definido;
- recepção foi separada de processamento;
- topic exclusivo foi criado;
- group exclusivo foi criado;
- consumer name foi definido;
- tabela inbox foi criada;
- lifecycle foi criado;
- RECEIVED foi criado;
- PROCESSING foi criado;
- RETRY_WAIT foi criado;
- PROCESSED foi criado;
- FAILED_PERMANENT foi criado;
- unique constraint foi criada;
- chave usa consumerName e eventId;
- payload foi persistido;
- metadata de origem foi persistida;
- listener ficou curto;
- listener não chama serviço externo;
- insert ocorre antes do retorno;
- commit do banco acontece antes do offset;
- falha de banco impede offset commit;
- redelivery foi reconhecida;
- duplicata retorna normalmente;
- candidate query foi limitada;
- claim condicional foi criado;
- dois workers foram testados;
- apenas um worker venceu;
- stale claim foi recuperado;
- processamento usa transação própria;
- efeito e PROCESSED compartilham transação;
- rollback foi testado;
- retry transitório foi implementado;
- backoff foi implementado;
- número máximo de tentativas foi configurado;
- falha permanente foi separada;
- retry esgotado foi classificado;
- last error foi limitado;
- Kafka lag foi observado;
- inbox backlog foi observado;
- diferença entre os dois foi explicada;
- endpoint de status foi criado;
- oldest ready age foi medida;
- cleanup filtra apenas PROCESSED;
- FAILED_PERMANENT não é apagado automaticamente;
- Inbox foi diferenciada de event store;
- Outbox e Inbox foram relacionados;
- poison bytes não foram reimplementados;
- saga não foi antecipada;
- CDC não foi antecipado;
- exactly-once não foi prometido;
- testes de ingestão foram criados;
- testes de processamento foram criados;
- testes de concorrência foram criados;
- testes de retry foram criados;
- testes de stale claim foram criados;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 490 está correta.

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
  "Inbox|RECEIVED|PROCESSING|RETRY_WAIT|PROCESSED|FAILED_PERMANENT|@Transactional|@Scheduled"
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
git commit -m "feat(m16): implementar Inbox Pattern"
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
- segredo;
- cleanup de falhas permanentes;
- saga antecipada;
- CDC;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o lado consumidor passou a possuir uma entrada persistente e recuperável.

O fluxo ficou:

```text
Kafka;

listener;

inbox RECEIVED;

offset commit;

worker;

claim;

business effect;

PROCESSED.
```

Você comprovou que:

- persistência precisa acontecer antes do ack;
- recepção e processamento são momentos diferentes;
- redelivery não cria nova linha;
- listener curto reduz acoplamento com trabalho lento;
- worker precisa de claim atômico;
- efeito e PROCESSED precisam da mesma transação;
- retry transitório precisa de backoff;
- falha permanente precisa de estado próprio;
- stale claims precisam de recuperação;
- Kafka lag pode estar zero com inbox backlog alto;
- cleanup só remove processados antigos;
- Outbox e Inbox formam uma dupla confiável;
- a arquitetura continua at-least-once e dependente de idempotência.

A próxima aula será:

```text
490 - M16.35 - Saga conceitual
```

Nela, você irá:

- compreender transações distribuídas de negócio;
- diferenciar consistência técnica e consistência de negócio;
- definir passos de saga;
- definir compensações;
- comparar orquestração e coreografia;
- modelar estados;
- tratar timeout;
- tratar retry;
- tratar compensação falha;
- relacionar Outbox e Inbox à saga;
- preparar CDC conceitual.

Nenhuma saga foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei inbox persistente.
- [ ] Persistei antes do ack.
- [ ] Separei listener e worker.
- [ ] Implementei claim.
- [ ] Implementei retry e stale recovery.
- [ ] Uni efeito e PROCESSED.
- [ ] Comparei lag e backlog.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Kafka lag está zero, mas nada foi processado

Consulte `RECEIVED`, `RETRY_WAIT` e idade do backlog.

### Record repete no listener

O insert pode estar falhando ou a constraint não existe.

### Duplicata cria outra linha

Confirme consumer name e eventId.

### Item fica PROCESSING

Stale recovery não está rodando ou o timeout é inválido.

### Dois workers aplicam efeito

Claim não é condicional ou a projeção não possui proteção adicional.

### Item fica RETRY_WAIT

`nextAttemptAt` pode estar no futuro ou o worker está parado.

### Falha permanente continua tentando

O worker está classificando toda exception como transitória.

### PROCESSED sem projeção

Status foi atualizado fora da transação do efeito.

### Projeção sem PROCESSED

As operações não estão na mesma transação.

### Cleanup removeu falhas

A query não filtrou somente PROCESSED.

---

## Perguntas de revisão

1. O que é Inbox Pattern?
2. Qual a diferença entre recepção e processamento?
3. Quando o offset pode avançar?
4. E se o banco falhar?
5. E se o offset falhar após o insert?
6. Qual chave deduplica a ingestão?
7. O que significa RECEIVED?
8. O que significa PROCESSING?
9. O que significa RETRY_WAIT?
10. O que significa PROCESSED?
11. O que significa FAILED_PERMANENT?
12. Por que usar claim?
13. Por que recuperar stale claim?
14. Onde aplicar o efeito?
15. Onde marcar PROCESSED?
16. Kafka lag mede o inbox backlog?
17. Inbox é event store?
18. Outbox e Inbox se complementam?
19. Saga foi implementada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Entrada persistente de mensagens.
2. Armazenar versus concluir efeito.
3. Depois do commit da inbox.
4. O record volta.
5. A constraint reconhece a duplicata.
6. consumerName + eventId.
7. Persistida e pronta.
8. Reivindicada por worker.
9. Aguardando nova tentativa.
10. Efeito concluído.
11. Requer decisão operacional.
12. Evitar processamento concorrente.
13. Worker pode morrer.
14. Em transação própria.
15. Na mesma transação do efeito.
16. Não.
17. Não.
18. Sim.
19. Não.
20. Saga conceitual.

---

## Desafio opcional

Implemente uma inbox para:

```text
payments.authorized.v1.
```

Requisitos:

- outro consumer name;
- mesma tabela;
- mesmo eventId permitido para consumers diferentes;
- claim próprio;
- projeção de pagamento;
- retry transitório;
- falha permanente;
- métricas por event type;
- cleanup apenas PROCESSED;
- nenhum código de saga.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 489 - M16.34 - Inbox Pattern

- Continuei após o Outbox Pattern.
- Formalizei o Inbox Pattern.
- Diferenciei recepção e processamento.
- Criei topic exclusivo de inbox.
- Criei group exclusivo de ingestão.
- Defini consumer name.
- Criei tabela `inbox_message`.
- Criei estados RECEIVED, PROCESSING, RETRY_WAIT, PROCESSED e FAILED_PERMANENT.
- Criei unique constraint por consumerName e eventId.
- Persistei payload e metadata de origem.
- Mantive o listener curto.
- Persistei antes do retorno do listener.
- Confirmei offset somente depois do commit do banco.
- Impedi perda quando a persistência falha.
- Reconheci redelivery como duplicata.
- Separei worker de processamento.
- Busquei candidatos em lote.
- Implementei claim condicional.
- Protegi concorrência entre workers.
- Apliquei efeito em transação própria.
- Marquei PROCESSED na mesma transação do efeito.
- Testei rollback.
- Implementei RETRY_WAIT.
- Implementei backoff.
- Limitei tentativas.
- Separei falha permanente.
- Recuperei stale claims.
- Criei endpoint de status.
- Medi backlog por estado.
- Medi idade do item mais antigo.
- Diferenciei Kafka lag de inbox backlog.
- Mantive FAILED_PERMANENT para investigação.
- Criei cleanup somente para PROCESSED antigos.
- Diferenciei Inbox de event store.
- Relacionei Outbox e Inbox.
- Não prometi exactly-once global.
- Não antecipei Saga ou CDC.
- Próxima aula: Saga conceitual.
```

---

## Referência técnica curta

- Enterprise Integration Patterns — Idempotent Receiver.
- Enterprise Integration Patterns — Guaranteed Delivery.
- Transactional Inbox Pattern.
- Apache Kafka — Delivery Semantics.
- Apache Kafka — Consumer Groups.
- Spring Kafka — Committing Offsets.
- Spring Framework — Transaction Management.
- Spring Framework — Scheduling.
- Jakarta Persistence — Unique Constraints.
- PostgreSQL — Conditional Updates and Indexes.

Regra final:

```text
Inbox Pattern separa recepção durável de processamento: o listener persiste eventId, payload e metadata em uma tabela inbox com unique constraint por consumerName e eventId, confirma a transação e só então permite o commit do offset; redelivery vira duplicata sem nova linha; um worker separado encontra itens RECEIVED ou RETRY_WAIT, faz claim por atualização condicional, executa o efeito e marca PROCESSED na mesma transação; falhas transitórias usam backoff, falhas permanentes ficam preservadas e PROCESSING órfão é recuperado por timeout; Kafka lag mede apenas o backlog anterior à ingestão, enquanto o inbox backlog mede trabalho ainda não concluído; Outbox protege a publicação na origem, Inbox protege a recepção no destino, e os dois padrões continuam at-least-once, exigindo idempotência e sem criar exactly-once global.
```
