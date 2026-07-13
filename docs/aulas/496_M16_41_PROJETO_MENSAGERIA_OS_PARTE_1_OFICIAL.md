# 496 - M16.41 - Projeto mensageria OS parte 1

## Apresentação da aula

Na aula 495, você comparou:

```text
monólito desorganizado;

monólito modular;

microsserviços.
```

A decisão do laboratório foi:

```text
começar com monólito modular;

preservar boundaries;

introduzir mensageria
onde existe desacoplamento real;

extrair um microsserviço
somente quando houver evidência.
```

O cenário foi dividido em módulos:

```text
serviceorder;

scheduling;

notification;

audit.
```

A criação da ordem de serviço ainda possuía uma chamada direta ao módulo de notificação:

```text
serviceorder;

notification.register(...).
```

Essa chamada mantém os módulos no mesmo processo e no mesmo momento de execução.

Se o envio de notificação ficar lento ou indisponível, a criação da OS pode ser afetada.

O objetivo do projeto prático será substituir essa dependência temporal por um evento assíncrono.

A pergunta central desta aula será:

```text
como publicar um fato
sobre a ordem de serviço

sem acoplar a transação principal
ao processamento da notificação?
```

A solução da primeira parte será:

```text
criação da OS;

agendamento;

persistência da OS;

persistência de evento na Outbox;

commit da transação;

publisher assíncrono;

Kafka topic.
```

O fluxo terminará no broker.

O consumer de notificação será implementado somente na aula 497.

O evento escolhido será:

```text
service-order.scheduled.v1.
```

Ele representa um fato concluído:

```text
a ordem de serviço
foi criada e agendada.
```

O topic será:

```text
m16.service-order.events.v1.
```

A key será:

```text
serviceOrderId.
```

Essa key mantém eventos da mesma OS na mesma partition enquanto:

- o número de partitions permanecer compatível;
- o mesmo algoritmo de partitioning for utilizado;
- a key for preservada.

O contrato conterá:

```text
eventId;

eventType;

eventVersion;

occurredAt;

correlationId;

causationId;

serviceOrderId;

customerId;

scheduleId;

preferredPeriod;

status.
```

O evento não conterá:

- payload completo da OS;
- documento do cliente;
- endereço;
- telefone;
- token;
- dados de pagamento;
- campos internos do banco;
- entidade JPA serializada.

A publicação utilizará o Outbox Pattern construído na aula 488.

Isso evita o dual write:

```text
salvar OS;

publicar Kafka diretamente.
```

A transação local gravará:

```text
service_order;

outbox_event.
```

Se o commit acontecer, os dois registros existirão.

Se houver rollback, nenhum deles existirá.

O publisher assíncrono continuará responsável por:

- buscar eventos pendentes;
- fazer claim;
- publicar no Kafka;
- aguardar acknowledgement;
- marcar `PUBLISHED`;
- aplicar retry;
- preservar `eventId`;
- manter correlation IDs.

A parte 1 também criará testes para provar:

- contrato estável;
- key correta;
- atomicidade entre OS e Outbox;
- evento persistido;
- headers de correlação;
- publicação no topic;
- ausência de chamada síncrona ao módulo notification.

A aula não implementará:

- consumer de notificação;
- Inbox do módulo notification;
- deduplicação no consumer;
- retry do envio ao cliente;
- quarantine de notificação;
- integração com WhatsApp;
- integração com e-mail;
- integração com SMS;
- testes ponta a ponta completos;
- extração de microsserviço;
- nova aplicação Spring Boot.

Esses assuntos pertencem às partes seguintes do projeto.

A próxima aula será:

```text
497 - M16.42 - Projeto mensageria OS parte 2
```

Ao final, você deverá explicar:

```text
por que o evento representa
um fato concluído;

por que a key é serviceOrderId;

por que o contrato
não deve expor a entidade;

por que a aplicação
não publica diretamente
dentro da transação;

por que Outbox e Kafka
são etapas diferentes;

como correlationId
atravessa a publicação;

por que o módulo notification
ainda não processa o evento;

como provar atomicidade
e publicação.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
494:
Monitoramento de integracoes.

495:
Microsservicos vs monolito modular.

496:
Projeto mensageria OS parte 1.

497:
Projeto mensageria OS parte 2.

498:
Projeto mensageria OS parte 3.
```

A aula 495 respondeu:

```text
onde os módulos devem viver
e quando considerar extração?
```

A aula 496 responderá:

```text
como criar a primeira fronteira
assíncrona do projeto de OS?
```

Nesta aula:

```text
monólito modular:
mantido.

OS persistente:
sim.

agendamento local:
sim.

evento de integração:
sim.

contrato versionado:
sim.

topic:
sim.

key:
sim.

Outbox:
sim.

correlação:
sim.

producer:
sim.

publicação Kafka:
sim.

testes de atomicidade:
sim.

testes de producer:
sim.

consumer notification:
não.

Inbox notification:
não.

deduplicação notification:
não.

quarantine notification:
não.

parte 2:
não antecipada.
```

A regra central será:

```text
a transação confirma
o estado e a intenção;

o publisher entrega
o evento depois.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Ao final, a estrutura terá:

```text
src/main/java/br/com/formacao/m16/architecture/os
├── config
│   ├── OsMessagingConfiguration.java
│   └── OsMessagingTopicNames.java
├── serviceorder
│   ├── api
│   │   ├── CreateServiceOrderCommand.java
│   │   ├── CreateServiceOrderResult.java
│   │   └── ServiceOrderFacade.java
│   ├── application
│   │   ├── ServiceOrderApplicationService.java
│   │   └── port
│   │       └── ServiceOrderEventPublisher.java
│   ├── domain
│   │   ├── ServiceOrder.java
│   │   └── ServiceOrderStatus.java
│   ├── event
│   │   └── ServiceOrderScheduledEventV1.java
│   ├── infrastructure
│   │   └── outbox
│   │       └── OutboxServiceOrderEventPublisher.java
│   └── persistence
│       ├── ServiceOrderEntity.java
│       └── ServiceOrderRepository.java
└── web
    ├── CreateServiceOrderRequest.java
    ├── CreateServiceOrderResponse.java
    └── ServiceOrderController.java
```

Documentação:

```text
contracts/service-order
└── service-order-scheduled.v1.json

docs/architecture/messaging-os
├── MESSAGING_OS_PART1.md
├── SERVICE_ORDER_EVENT_CONTRACT.md
└── TOPIC_CATALOG.md
```

Testes:

```text
src/test/java/br/com/formacao/m16/architecture/os
├── ServiceOrderApplicationServiceTest.java
├── ServiceOrderOutboxAtomicityIntegrationTest.java
└── ServiceOrderOutboxPublishingIntegrationTest.java
```

Você irá:

1. confirmar a baseline;
2. definir o fluxo funcional;
3. definir o topic;
4. definir a key;
5. definir o evento;
6. versionar o contrato;
7. criar persistência da OS;
8. criar um port de publicação;
9. adaptar o módulo para Outbox;
10. remover a chamada síncrona de notification;
11. gravar OS e evento juntos;
12. preservar correlation ID;
13. criar endpoint HTTP;
14. configurar o topic;
15. reutilizar o publisher Outbox;
16. testar rollback;
17. testar payload;
18. testar key;
19. testar headers;
20. inspecionar o Kafka;
21. executar o gate;
22. commitar;
23. preparar a parte 2.

---

## Conceito essencial

### Fato versus comando

Um comando expressa intenção:

```text
SendServiceOrderNotification.
```

Um evento expressa fato:

```text
ServiceOrderScheduled.
```

Nesta aula, o produtor não manda o módulo notification executar uma implementação específica.

Ele publica o fato:

```text
uma OS foi agendada.
```

O módulo notification poderá reagir na aula 497.

---

### Por que `scheduled`

O fluxo da aula 495 cria a OS e solicita um agendamento antes de concluir.

Portanto, o fato estável é:

```text
OS criada e agendada.
```

Publicar `service-order.created.v1` antes de conhecer o agendamento criaria outra semântica.

O nome do evento deve representar o momento real do negócio.

---

### Evento de integração

O evento atravessará uma fronteira assíncrona.

Ele precisa ser:

- explícito;
- pequeno;
- versionado;
- estável;
- independente da entidade;
- serializável;
- validável;
- documentado.

---

### Topic

O topic será:

```text
m16.service-order.events.v1.
```

O sufixo `v1` pertence à família do stream.

O evento também possui:

```text
eventVersion = 1.
```

Topic version e event version são decisões distintas.

---

### Key

A key será:

```text
serviceOrderId.
```

Ela permite:

- agrupamento por OS;
- partitioning consistente;
- investigação;
- ordenação local por OS;
- futuros eventos da mesma entidade.

Não use `eventId` como key quando o requisito é manter eventos da mesma OS juntos.

---

### Event ID

Cada fato possui:

```text
eventId.
```

Esse ID permanece igual em:

- retry do Outbox;
- republicação do mesmo registro;
- redelivery;
- deduplicação do consumer;
- replay.

Não gere outro ID a cada tentativa.

---

### Correlation ID

O correlation ID vem da requisição HTTP.

Ele atravessa:

```text
HTTP;

application service;

Outbox;

Kafka headers;

consumer futuro.
```

O `causationId` do evento será o `messageId` da requisição atual.

---

### Contrato versus entidade

Entidade JPA contém decisões internas:

- nomes de colunas;
- relacionamentos;
- lazy loading;
- campos técnicos;
- timestamps internos;
- constraints;
- métodos.

O contrato publica apenas o que o consumidor precisa.

Não serialize a entidade.

---

### Dual write

Fluxo incorreto:

```text
repository.save(order);

kafkaTemplate.send(event).
```

Uma das operações pode confirmar e a outra falhar.

Fluxo correto:

```text
BEGIN;

save order;

save outbox event;

COMMIT.
```

O Kafka é chamado depois pelo publisher.

---

### Port de publicação

O application service dependerá de:

```java
ServiceOrderEventPublisher
```

Ele não dependerá de:

- KafkaTemplate;
- topic;
- serializer;
- OutboxEventRepository;
- ProducerRecord.

A implementação Outbox fica na infraestrutura.

---

### Atomicidade

A criação da OS e o registro do evento compartilham:

```text
mesmo datasource;

mesmo transaction manager;

mesma transação.
```

Se o evento não puder ser serializado ou persistido, a OS não deve ficar salva.

---

### Status da resposta

O endpoint retornará:

```text
201 Created;

integrationStatus:
PENDING_PUBLICATION.
```

Ele não retornará:

```text
NOTIFICATION_SENT.
```

O consumer ainda nem existe.

---

### Responsabilidade da parte 1

A parte 1 termina em:

```text
Kafka append confirmado.
```

Ela não prova o processamento de notificação.

Esse limite precisa permanecer explícito.

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

Confirme que as aulas anteriores continuam verdes.

---

### 2. Criar nomes do topic

Arquivo:

```text
OsMessagingTopicNames.java
```

```java
package br.com.formacao.m16.architecture.os.config;

public final class OsMessagingTopicNames {

    public static final String SERVICE_ORDER_EVENTS =
        "m16.service-order.events.v1";

    private OsMessagingTopicNames() {
    }
}
```

---

### 3. Declarar o topic

Arquivo:

```text
OsMessagingConfiguration.java
```

```java
package br.com.formacao.m16.architecture.os.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class OsMessagingConfiguration {

    @Bean
    NewTopic serviceOrderEventsTopic() {
        return TopicBuilder
            .name(
                OsMessagingTopicNames
                    .SERVICE_ORDER_EVENTS
            )
            .partitions(3)
            .replicas(1)
            .build();
    }
}
```

Três partitions são suficientes para o laboratório.

---

### 4. Criar o contrato Java

Arquivo:

```text
ServiceOrderScheduledEventV1.java
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.event;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record ServiceOrderScheduledEventV1(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String correlationId,
    String causationId,
    String serviceOrderId,
    String customerId,
    String scheduleId,
    String preferredPeriod,
    String status
) {

    public ServiceOrderScheduledEventV1 {
        Objects.requireNonNull(eventId);
        Objects.requireNonNull(eventType);
        Objects.requireNonNull(occurredAt);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(serviceOrderId);
        Objects.requireNonNull(customerId);
        Objects.requireNonNull(scheduleId);
        Objects.requireNonNull(preferredPeriod);
        Objects.requireNonNull(status);

        if (
            !"service-order.scheduled.v1"
                .equals(eventType)
        ) {
            throw new IllegalArgumentException(
                "Unsupported eventType"
            );
        }

        if (eventVersion != 1) {
            throw new IllegalArgumentException(
                "Unsupported eventVersion"
            );
        }
    }
}
```

O `causationId` pode ser nulo quando não houver contexto anterior.

No fluxo HTTP atual, ele estará preenchido.

---

### 5. Criar exemplo do contrato

Arquivo:

```text
contracts/service-order/service-order-scheduled.v1.json
```

```json
{
  "eventId": "fbce594e-0cad-4996-bf1e-63ee2d89b8ce",
  "eventType": "service-order.scheduled.v1",
  "eventVersion": 1,
  "occurredAt": "2026-07-12T19:55:00Z",
  "correlationId": "efb4316f-d82f-4a2e-9a85-20b2177ec2a4",
  "causationId": "1dda323b-f44e-4a13-9049-7ec51390596f",
  "serviceOrderId": "OS-496-0001",
  "customerId": "CUSTOMER-496-0001",
  "scheduleId": "SCHEDULE-496-0001",
  "preferredPeriod": "MORNING",
  "status": "SCHEDULED"
}
```

Os valores são fictícios.

---

### 6. Criar entidade persistente de OS

Arquivo:

```text
ServiceOrderEntity.java
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "service_order")
public class ServiceOrderEntity {

    @Id
    @Column(
        name = "service_order_id",
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

    @Column(
        name = "preferred_period",
        nullable = false,
        length = 40
    )
    private String preferredPeriod;

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

    protected ServiceOrderEntity() {
    }

    public ServiceOrderEntity(
        String serviceOrderId,
        String customerId,
        String scheduleId,
        String preferredPeriod,
        String status,
        Instant createdAt
    ) {
        this.serviceOrderId = serviceOrderId;
        this.customerId = customerId;
        this.scheduleId = scheduleId;
        this.preferredPeriod = preferredPeriod;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String serviceOrderId() {
        return serviceOrderId;
    }
}
```

A entidade não será usada como payload Kafka.

---

### 7. Criar repository

```java
package br.com.formacao.m16.architecture.os.serviceorder.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceOrderRepository
        extends JpaRepository<
            ServiceOrderEntity,
            String
        > {
}
```

---

### 8. Criar port de publicação

Arquivo:

```text
ServiceOrderEventPublisher.java
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.application.port;

import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;

public interface ServiceOrderEventPublisher {

    void publish(
        ServiceOrderScheduledEventV1 event
    );
}
```

O nome `publish` representa a intenção da aplicação.

A implementação Outbox não envia ao Kafka imediatamente.

Ela registra a intenção de publicação.

---

### 9. Criar adapter Outbox

Arquivo:

```text
OutboxServiceOrderEventPublisher.java
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.infrastructure.outbox;

import br.com.formacao.m16.architecture.os.config.OsMessagingTopicNames;
import br.com.formacao.m16.architecture.os.serviceorder.application.port.ServiceOrderEventPublisher;
import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import br.com.formacao.m16.kafka.outbox.persistence.OutboxEventEntity;
import br.com.formacao.m16.kafka.outbox.persistence.OutboxEventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import org.springframework.stereotype.Component;

@Component
public class OutboxServiceOrderEventPublisher
        implements ServiceOrderEventPublisher {

    private final OutboxEventRepository repository;
    private final ObjectMapper objectMapper;

    public OutboxServiceOrderEventPublisher(
        OutboxEventRepository repository,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void publish(
        ServiceOrderScheduledEventV1 event
    ) {
        repository.save(
            new OutboxEventEntity(
                event.eventId(),
                "ServiceOrder",
                event.serviceOrderId(),
                event.eventType(),
                event.eventVersion(),
                OsMessagingTopicNames
                    .SERVICE_ORDER_EVENTS,
                event.serviceOrderId(),
                serialize(event),
                event.occurredAt(),
                Instant.now(),
                event.correlationId(),
                event.causationId()
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
                "Service order event serialization failed",
                exception
            );
        }
    }
}
```

Ajuste o construtor de `OutboxEventEntity` para receber os campos de correlação adicionados na aula 493.

Não crie um segundo modelo de Outbox.

---

### 10. Atualizar o resultado da criação

```java
package br.com.formacao.m16.architecture.os.serviceorder.api;

import java.util.UUID;

public record CreateServiceOrderResult(
    String serviceOrderId,
    String status,
    String scheduleId,
    UUID eventId,
    String integrationStatus
) {
}
```

O status de integração será:

```text
PENDING_PUBLICATION.
```

---

### 11. Atualizar o application service

Remova a dependência síncrona:

```java
NotificationApi.
```

Adicione:

```java
ServiceOrderRepository;

ServiceOrderEventPublisher;

CorrelationContext.
```

Implementação:

```java
package br.com.formacao.m16.architecture.os.serviceorder.application;

import br.com.formacao.m16.architecture.os.audit.api.AuditApi;
import br.com.formacao.m16.architecture.os.audit.api.AuditEntry;
import br.com.formacao.m16.architecture.os.scheduling.api.ScheduleRequest;
import br.com.formacao.m16.architecture.os.scheduling.api.SchedulingApi;
import br.com.formacao.m16.architecture.os.serviceorder.api.CreateServiceOrderCommand;
import br.com.formacao.m16.architecture.os.serviceorder.api.CreateServiceOrderResult;
import br.com.formacao.m16.architecture.os.serviceorder.api.ServiceOrderFacade;
import br.com.formacao.m16.architecture.os.serviceorder.application.port.ServiceOrderEventPublisher;
import br.com.formacao.m16.architecture.os.serviceorder.domain.ServiceOrder;
import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import br.com.formacao.m16.architecture.os.serviceorder.persistence.ServiceOrderEntity;
import br.com.formacao.m16.architecture.os.serviceorder.persistence.ServiceOrderRepository;
import br.com.formacao.m16.kafka.correlation.CorrelationContext;
import br.com.formacao.m16.kafka.correlation.CorrelationMetadata;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceOrderApplicationService
        implements ServiceOrderFacade {

    private final SchedulingApi scheduling;
    private final AuditApi audit;
    private final ServiceOrderRepository repository;
    private final ServiceOrderEventPublisher eventPublisher;
    private final CorrelationContext correlationContext;
    private final Clock clock;

    public ServiceOrderApplicationService(
        SchedulingApi scheduling,
        AuditApi audit,
        ServiceOrderRepository repository,
        ServiceOrderEventPublisher eventPublisher,
        CorrelationContext correlationContext
    ) {
        this.scheduling = scheduling;
        this.audit = audit;
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.correlationContext = correlationContext;
        this.clock = Clock.systemUTC();
    }

    @Override
    @Transactional
    public CreateServiceOrderResult create(
        CreateServiceOrderCommand command
    ) {
        if (
            repository.existsById(
                command.serviceOrderId()
            )
        ) {
            throw new IllegalArgumentException(
                "Service order already exists"
            );
        }

        ServiceOrder order =
            new ServiceOrder(
                command.serviceOrderId(),
                command.customerId(),
                clock.instant()
            );

        var schedule =
            scheduling.schedule(
                new ScheduleRequest(
                    order.id(),
                    command.preferredPeriod()
                )
            );

        if (!schedule.accepted()) {
            throw new IllegalStateException(
                "Schedule was not accepted"
            );
        }

        order.markScheduled();

        repository.save(
            new ServiceOrderEntity(
                order.id(),
                order.customerId(),
                schedule.scheduleId(),
                command.preferredPeriod(),
                order.status().name(),
                order.createdAt()
            )
        );

        CorrelationMetadata current =
            correlationContext.current();

        UUID eventId =
            UUID.randomUUID();

        eventPublisher.publish(
            new ServiceOrderScheduledEventV1(
                eventId,
                "service-order.scheduled.v1",
                1,
                clock.instant(),
                current.correlationId(),
                current.messageId(),
                order.id(),
                order.customerId(),
                schedule.scheduleId(),
                command.preferredPeriod(),
                order.status().name()
            )
        );

        audit.record(
            new AuditEntry(
                order.id(),
                "SERVICE_ORDER_SCHEDULED",
                clock.instant()
            )
        );

        return new CreateServiceOrderResult(
            order.id(),
            order.status().name(),
            schedule.scheduleId(),
            eventId,
            "PENDING_PUBLICATION"
        );
    }
}
```

A OS e a Outbox compartilham a transação.

---

### 12. Criar request HTTP

```java
package br.com.formacao.m16.architecture.os.web;

public record CreateServiceOrderRequest(
    String serviceOrderId,
    String customerId,
    String preferredPeriod
) {
}
```

Response:

```java
package br.com.formacao.m16.architecture.os.web;

import java.util.UUID;

public record CreateServiceOrderResponse(
    String serviceOrderId,
    String status,
    String scheduleId,
    UUID eventId,
    String integrationStatus
) {
}
```

---

### 13. Criar controller

```java
package br.com.formacao.m16.architecture.os.web;

import br.com.formacao.m16.architecture.os.serviceorder.api.CreateServiceOrderCommand;
import br.com.formacao.m16.architecture.os.serviceorder.api.ServiceOrderFacade;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    "/api/v1/service-orders"
)
public class ServiceOrderController {

    private final ServiceOrderFacade serviceOrder;

    public ServiceOrderController(
        ServiceOrderFacade serviceOrder
    ) {
        this.serviceOrder = serviceOrder;
    }

    @PostMapping
    public ResponseEntity<
        CreateServiceOrderResponse
    > create(
        @RequestBody
        CreateServiceOrderRequest request
    ) {
        var result =
            serviceOrder.create(
                new CreateServiceOrderCommand(
                    request.serviceOrderId(),
                    request.customerId(),
                    request.preferredPeriod()
                )
            );

        return ResponseEntity
            .created(
                URI.create(
                    "/api/v1/service-orders/"
                        + result.serviceOrderId()
                )
            )
            .body(
                new CreateServiceOrderResponse(
                    result.serviceOrderId(),
                    result.status(),
                    result.scheduleId(),
                    result.eventId(),
                    result.integrationStatus()
                )
            );
    }
}
```

Validações Bean Validation podem ser acrescentadas sem mudar o contrato central.

---

### 14. Atualizar a política de módulos

No arquivo:

```text
MODULE_BOUNDARY_POLICY.md
```

Adicione:

```text
serviceorder.application
pode depender de
serviceorder.application.port.

serviceorder.infrastructure.outbox
implementa o port.

serviceorder.application
não importa KafkaTemplate.

notification
não é chamado diretamente
pela criação da OS.
```

---

### 15. Criar catálogo do topic

Arquivo:

```text
TOPIC_CATALOG.md
```

```markdown
# Catálogo de topics — Projeto mensageria OS

## m16.service-order.events.v1

- Owner: Service Order module.
- Tipo: eventos de integração.
- Partitions: 3 no laboratório.
- Key: serviceOrderId.
- Contrato atual: service-order.scheduled.v1.
- Producer: Service Order Outbox.
- Consumer planejado: Notification module.
- Semântica: at-least-once.
- Deduplicação esperada: eventId.
- Dados sensíveis: proibidos.
- Retenção: configuração do laboratório.
```

---

### 16. Documentar o fluxo

Arquivo:

```text
MESSAGING_OS_PART1.md
```

Diagrama:

```text
POST /service-orders
        |
        v
ServiceOrderApplicationService
        |
        +--> SchedulingApi
        |
        +--> service_order
        |
        +--> outbox_event
        |
        v
DATABASE COMMIT
        |
        v
OutboxPublisherJob
        |
        v
m16.service-order.events.v1
```

Registre:

```text
notification consumer:
parte 2.
```

---

### 17. Atualizar o publisher genérico

Confirme que o `OutboxPublication` contém:

```text
correlationId;

causationId.
```

O `OutboxKafkaPublisher` precisa criar headers:

```text
correlationId;

messageId = outbox id;

causationId;

eventType;

eventVersion;

aggregateType.
```

O payload permanece o contrato JSON.

---

### 18. Testar application service

Atualize o teste da aula 495.

Use mocks ou fakes para:

- scheduling;
- audit;
- repository;
- event publisher;
- correlation context.

Confirme:

```text
notification API:
não é dependência.

repository.save:
uma vez.

eventPublisher.publish:
uma vez.

event:
service-order.scheduled.v1.

event key lógica:
serviceOrderId.

result:
PENDING_PUBLICATION.
```

---

### 19. Testar atomicidade

Com `@SpringBootTest` e banco de teste:

Cenário de sucesso:

```text
service_order:
1.

outbox_event:
1.
```

Cenário de falha:

1. force o adapter Outbox a lançar exception;
2. chame o service;
3. confirme rollback.

Resultado:

```text
service_order:
0.

outbox_event:
0.
```

Não aceite OS sem evento.

---

### 20. Testar contrato persistido

Carregue a linha Outbox.

Confirme:

```text
topic:
m16.service-order.events.v1.

messageKey:
OS-496-0001.

aggregateType:
ServiceOrder.

aggregateId:
OS-496-0001.

eventType:
service-order.scheduled.v1.

eventVersion:
1.

status:
PENDING.
```

Desserialize o payload como:

```text
ServiceOrderScheduledEventV1.
```

Não compare JSON por ordem de campos.

---

### 21. Testar correlação

Abra um `CorrelationScope` no teste:

```text
correlationId:
CORR-496.

messageId:
REQ-496.
```

Crie a OS.

Confirme na Outbox:

```text
correlationId:
CORR-496.

causationId:
REQ-496.

messageId:
eventId da Outbox.
```

---

### 22. Testar publicação Kafka

Com `@EmbeddedKafka`:

1. crie a OS;
2. execute o publisher Outbox;
3. consuma o topic com consumer de teste;
4. confirme key;
5. confirme payload;
6. confirme headers;
7. confirme partition válida;
8. confirme status Outbox `PUBLISHED`.

O consumer de teste não representa o módulo notification.

Ele apenas verifica o producer.

---

### 23. Iniciar broker

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
  --topic "m16.service-order.events.v1"
```

---

### 24. Iniciar aplicação

```powershell
.\mvnw.cmd spring-boot:run
```

---

### 25. Criar uma OS

```powershell
$correlationId =
  [guid]::NewGuid().ToString()

$body = @{
  serviceOrderId = "OS-496-0001"
  customerId = "CUSTOMER-496-0001"
  preferredPeriod = "MORNING"
} |
  ConvertTo-Json

$result =
  Invoke-RestMethod `
    -Method Post `
    -Uri (
      "http://localhost:8084" +
      "/api/v1/service-orders"
    ) `
    -Headers @{
      "X-Correlation-Id" =
        $correlationId
    } `
    -ContentType "application/json" `
    -Body $body

$result
```

Resposta esperada:

```text
status:
SCHEDULED.

integrationStatus:
PENDING_PUBLICATION.

eventId:
preenchido.
```

---

### 26. Inspecionar o topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server "localhost:9092" `
  --topic "m16.service-order.events.v1" `
  --from-beginning `
  --property "print.key=true" `
  --property "print.headers=true" `
  --property "print.partition=true" `
  --property "print.offset=true"
```

Confirme:

```text
key:
OS-496-0001.

eventType:
service-order.scheduled.v1.

correlationId:
igual ao HTTP.
```

---

### 27. Confirmar ausência de consumer funcional

Nesta etapa:

```text
notification:
não envia nada.

Inbox:
não recebe nada.

consumer group de notification:
não existe.
```

Isso está correto.

A parte 1 termina no broker.

---

### 28. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderApplicationServiceTest,ServiceOrderOutboxAtomicityIntegrationTest,ServiceOrderOutboxPublishingIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### O boundary de notification deixou de ser síncrono

A criação da OS não chama mais o módulo diretamente.

### O evento representa um fato

`service-order.scheduled.v1` só existe depois do agendamento aceito.

### O contrato ficou separado da entidade

O payload não expõe detalhes JPA.

### A key representa a entidade

Eventos da mesma OS utilizam `serviceOrderId`.

### A transação ficou local

OS e Outbox são gravadas juntas.

### O Kafka ficou fora da transação

O publisher executa depois do commit.

### A correlação sobreviveu ao tempo

IDs persistidos permitem que o job publique no contexto original.

### A resposta ficou honesta

O endpoint informa `PENDING_PUBLICATION`.

### A parte 1 ficou limitada

A publicação foi comprovada, mas o processamento ainda não existe.

---

## Erros comuns importantes

### Publicar `created` antes do schedule

O nome não representa o fato final do fluxo.

### Chamar notification e também publicar evento

O efeito pode ocorrer duas vezes.

### Serializar ServiceOrderEntity

O contrato fica acoplado à persistência.

### Usar eventId como key

Eventos da mesma OS podem ir para partitions diferentes.

### Gerar eventId no publisher

Retries produzem novos IDs.

### Chamar Kafka dentro do service transacional

O dual write reaparece.

### Retornar NOTIFICATION_SENT

O consumer ainda não existe.

### Criar outro modelo Outbox

A infraestrutura anterior fica duplicada.

### Colocar dados pessoais no evento

O topic amplia a exposição.

### Testar apenas o endpoint

Atomicidade, key e headers ficam sem prova.

### Implementar consumer na parte 1

A continuidade da grade é atropelada.

---

## Comandos úteis

### Ver topic

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --topic "m16.service-order.events.v1"
```

### Consumir records

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

### Procurar chamada síncrona antiga

```powershell
git grep `
  -n `
  "NotificationApi"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Fluxo

Desenhe HTTP, transação, Outbox e Kafka.

### Parte 2 — Contrato

Crie o evento versionado.

### Parte 3 — Topic

Defina nome, key e owner.

### Parte 4 — Persistência

Crie a entidade de OS.

### Parte 5 — Port

Isole a publicação.

### Parte 6 — Outbox

Implemente o adapter.

### Parte 7 — Serviço

Grave OS e evento juntos.

### Parte 8 — Correlação

Preserve os IDs.

### Parte 9 — Testes

Prove atomicidade e publicação.

### Parte 10 — Limite

Não implemente o consumer.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 495 foi preservada;
- projeto de mensageria OS foi iniciado;
- monólito modular foi mantido;
- fluxo funcional foi definido;
- chamada síncrona de notification foi removida;
- evento representa fato concluído;
- nome `service-order.scheduled.v1` foi escolhido;
- eventVersion foi definida;
- topic foi definido;
- topic possui três partitions no laboratório;
- key foi definida como serviceOrderId;
- eventId foi definido;
- eventId é estável;
- correlationId foi incluído;
- causationId foi incluído;
- payload não expõe entidade;
- dados sensíveis foram proibidos;
- exemplo JSON foi criado;
- entidade de OS foi criada;
- repository foi criado;
- port de publicação foi criado;
- application service depende do port;
- application service não importa KafkaTemplate;
- adapter Outbox foi criado;
- infraestrutura Outbox anterior foi reutilizada;
- segundo modelo Outbox não foi criado;
- OS e Outbox compartilham transação;
- rollback conjunto foi testado;
- evento é criado depois do schedule;
- status SCHEDULED foi preservado;
- response inclui eventId;
- response informa PENDING_PUBLICATION;
- response não afirma envio de notificação;
- controller foi criado;
- boundary policy foi atualizada;
- catálogo do topic foi criado;
- documentação do fluxo foi criada;
- publisher preserva headers;
- messageId Kafka usa eventId;
- causationId usa request messageId;
- teste unitário foi criado;
- teste de atomicidade foi criado;
- teste de contrato persistido foi criado;
- teste de correlação foi criado;
- teste Embedded Kafka foi criado;
- key foi validada;
- payload foi validado;
- headers foram validados;
- Outbox PUBLISHED foi validada;
- topic foi inspecionado;
- ausência do consumer funcional foi documentada;
- NotificationApi não é chamada na criação;
- Inbox notification não foi antecipada;
- deduplicação notification não foi antecipada;
- retry de envio não foi antecipado;
- quarantine de notification não foi antecipada;
- parte 2 não foi implementada;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 497 está correta.

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
  "service-order.scheduled.v1|m16.service-order.events.v1|NotificationApi|KafkaTemplate|ServiceOrderEntity|OutboxEventEntity"
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  contracts/service-order `
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
git commit -m "feat(m16): iniciar mensageria de OS"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- consumer da parte 2;
- integração real de WhatsApp;
- payload real;
- dados pessoais;
- banco H2;
- diretório data;
- logs;
- target;
- segundo serviço;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto de mensageria de OS começou pelo lado produtor.

O fluxo ficou:

```text
HTTP;

Service Order module;

Scheduling API;

service_order;

outbox_event;

commit;

Outbox publisher;

Kafka topic.
```

Você comprovou que:

- a OS permanece em um monólito modular;
- notification não precisa ser chamado sincronamente;
- o evento representa um fato concluído;
- o contrato é independente da entidade;
- a key agrupa eventos pela OS;
- eventId permanece estável;
- correlationId atravessa a publicação;
- OS e Outbox são atômicas;
- Kafka é chamado depois do commit;
- a resposta informa publicação pendente;
- a parte 1 termina no broker.

A próxima aula será:

```text
497 - M16.42 - Projeto mensageria OS parte 2
```

Nela, você irá:

- criar o consumer do módulo notification;
- definir o consumer group;
- persistir uma Inbox;
- deduplicar pelo eventId;
- criar lifecycle de notificação;
- processar o evento;
- preservar correlação;
- tratar retry transitório;
- separar falha permanente;
- comprovar redelivery segura;
- preparar a parte 3.

Nenhum consumer de notification foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini o evento da OS.
- [ ] Defini topic e key.
- [ ] Criei persistência da OS.
- [ ] Criei port e adapter Outbox.
- [ ] Gravei OS e evento juntos.
- [ ] Removi notification síncrona.
- [ ] Testei atomicidade e Kafka.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A OS é salva, mas a Outbox não

Confirme a mesma transação, datasource e exception propagation.

### A Outbox é salva, mas a OS não

Revise transaction manager e chamadas com `REQUIRES_NEW`.

### O Kafka não recebe o evento

Confirme o publisher Outbox, status, topic e broker.

### O evento chega sem correlationId

Confirme persistência na Outbox e escrita dos headers.

### A key aparece nula

Confirme `messageKey = serviceOrderId`.

### O payload contém campos da entidade

O adapter pode estar serializando `ServiceOrderEntity`.

### A resposta mostra PUBLISHED imediatamente

O endpoint está assumindo o trabalho do job assíncrono.

### Notification ainda é chamado

Remova a dependência do application service.

### O teste Embedded Kafka consome records antigos

Use topic e group exclusivos ou limpe o contexto de teste.

### O eventId muda em retry

Ele está sendo criado no publisher em vez da transação de negócio.

---

## Perguntas de revisão

1. Qual é o fato publicado?
2. Qual é o topic?
3. Qual é a key?
4. Para que serve eventId?
5. Quem cria eventId?
6. Ele muda no retry?
7. Qual ID atravessa a jornada?
8. Qual ID representa a causa?
9. Por que não serializar entidade?
10. O que é dual write?
11. Onde a OS é gravada?
12. Onde o evento é gravado?
13. Eles usam a mesma transação?
14. Quando Kafka é chamado?
15. Qual status o endpoint retorna?
16. Notification é chamado diretamente?
17. Existe consumer nesta aula?
18. Existe Inbox notification?
19. A publicação foi testada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. OS criada e agendada.
2. m16.service-order.events.v1.
3. serviceOrderId.
4. Identificar o fato e deduplicar.
5. A transação de negócio.
6. Não.
7. correlationId.
8. causationId.
9. Evitar acoplamento à persistência.
10. Escrita em banco e broker sem atomicidade.
11. service_order.
12. outbox_event.
13. Sim.
14. Depois do commit.
15. PENDING_PUBLICATION.
16. Não.
17. Não funcional.
18. Não.
19. Sim.
20. Projeto mensageria OS parte 2.

---

## Desafio opcional

Adicione um segundo evento:

```text
service-order.schedule-rejected.v1.
```

Requisitos:

- fato diferente;
- contrato próprio;
- mesma família de topic;
- key serviceOrderId;
- eventId estável;
- correlationId;
- Outbox;
- nenhum consumer;
- teste de contrato;
- nenhuma notificação direta.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 496 - M16.41 - Projeto mensageria OS parte 1

- Continuei após a decisão pelo monólito modular.
- Iniciei o projeto prático de mensageria de OS.
- Defini o fluxo produtor.
- Mantive serviceorder, scheduling, notification e audit como módulos.
- Removi a chamada síncrona de notification.
- Escolhi o fato `service-order.scheduled.v1`.
- Defini eventVersion 1.
- Criei o topic `m16.service-order.events.v1`.
- Defini `serviceOrderId` como key.
- Criei `ServiceOrderScheduledEventV1`.
- Incluí eventId.
- Incluí correlationId.
- Incluí causationId.
- Evitei dados sensíveis.
- Separei contrato e entidade.
- Criei exemplo JSON.
- Criei `ServiceOrderEntity`.
- Criei repository.
- Criei `ServiceOrderEventPublisher`.
- Mantive a aplicação independente do Kafka.
- Criei adapter Outbox.
- Reutilizei a infraestrutura da aula 488.
- Gravei OS e Outbox na mesma transação.
- Criei eventId dentro da transação de negócio.
- Persistei correlationId e causationId.
- Atualizei o resultado da criação.
- Retornei `PENDING_PUBLICATION`.
- Criei endpoint HTTP.
- Atualizei a política de boundaries.
- Criei catálogo do topic.
- Documentei o fluxo.
- Validei contrato, key e headers.
- Testei rollback conjunto.
- Testei publicação com Embedded Kafka.
- Confirmei Outbox como PUBLISHED.
- Mantive a parte 1 limitada ao broker.
- Não implementei consumer ou Inbox de notification.
- Próxima aula: Projeto mensageria OS parte 2.
```

---

## Referência técnica curta

- Apache Kafka — Topics and Partitions.
- Apache Kafka — Record Keys.
- Spring Kafka — Sending Messages.
- Spring Kafka — `KafkaTemplate`.
- Transactional Outbox Pattern.
- Idempotent Consumer Pattern.
- Event-driven Architecture.
- Domain Event versus Integration Event.
- SLF4J MDC.
- Modular Monolith.

Regra final:

```text
a primeira parte do projeto de mensageria de OS cria um producer confiável sem distribuir prematuramente a aplicação: depois que Scheduling aceita o agendamento, o módulo Service Order cria o fato versionado service-order.scheduled.v1, usa serviceOrderId como key, gera eventId estável e preserva correlationId e causationId; o contrato é pequeno e independente da entidade JPA; ServiceOrderApplicationService depende de um port, enquanto o adapter de infraestrutura grava o evento na Outbox; service_order e outbox_event participam da mesma transação, o endpoint retorna PENDING_PUBLICATION e o publisher assíncrono entrega ao topic m16.service-order.events.v1 depois do commit; testes provam rollback, payload, key, headers e append no Kafka; o fluxo termina no broker, e consumer, Inbox, deduplicação e processamento de notification pertencem exclusivamente à parte 2.
```
