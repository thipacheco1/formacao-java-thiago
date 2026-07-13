# 498 - M16.43 - Projeto mensageria OS parte 3

## Apresentação da aula

Na aula 496, você construiu o lado produtor do projeto de mensageria de ordens de serviço.

O fluxo ficou:

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

Na aula 497, você construiu o lado consumidor do módulo `notification`.

O fluxo avançou até:

```text
m16.service-order.events.v1;

Notification consumer;

notification_inbox_message;

commit do offset;

Notification worker;

service_order_notification_intent;

READY_TO_SEND.
```

A intenção de notificação já existe.

Ela ainda não foi enviada.

`READY_TO_SEND` significa:

```text
o módulo entendeu o evento;

preparou a intenção;

a chamada ao provider
ainda não ocorreu.
```

A terceira parte fechará o projeto com um dispatcher confiável.

A pergunta central desta aula será:

```text
como retirar uma intenção
do estado READY_TO_SEND,

enviá-la de forma idempotente,

tratar falhas transitórias
e permanentes,

preservar correlação,

isolar mensagens problemáticas

e provar a jornada completa?
```

O fluxo completo ficará:

```text
HTTP;

service_order;

Outbox;

Kafka;

Notification Inbox;

Notification Intent;

dispatcher;

fake provider;

SENT.
```

A aula criará:

```text
NotificationProvider.
```

Ela representa um provider externo conceitual.

A implementação será:

```text
FakeNotificationProvider.
```

Ela executará dentro do laboratório e não fará chamadas HTTP.

A integração HTTP com uma API externa fake será implementada somente na aula 499.

O provider fake terá:

```text
fake_notification_delivery.
```

Esse armazenamento simulará o estado de um sistema externo.

Ele utilizará uma idempotency key estável:

```text
sourceEventId.
```

Assim, se a aplicação repetir a chamada porque:

```text
o provider aceitou;

mas a aplicação falhou
antes de marcar SENT;
```

a segunda tentativa recebe:

```text
ALREADY_ACCEPTED.
```

e não cria uma segunda entrega.

O lifecycle da intenção evoluirá para:

```text
READY_TO_SEND;

SENDING;

RETRY_WAIT;

SENT;

QUARANTINED.
```

O dispatcher funcionará em etapas:

```text
1. localizar candidatos;

2. fazer claim;

3. marcar SENDING;

4. chamar provider
   fora da transação de banco
   da intenção;

5. marcar SENT;

ou

6. marcar RETRY_WAIT;

ou

7. criar quarantine
   e marcar QUARANTINED.
```

A chamada ao provider não ficará dentro de uma transação longa da aplicação.

Mesmo o provider fake utilizará uma transação separada para simular uma fronteira independente.

A aula criará falhas didáticas:

```text
customerId iniciado por
PROVIDER-TRANSIENT-:

falha nas duas primeiras tentativas.

customerId iniciado por
PROVIDER-PERMANENT-:

falha permanente.

demais customers:

sucesso.
```

Também será testada a janela:

```text
provider aceitou;

mark SENT falhou;

retry ocorreu;

provider reconheceu
a mesma idempotency key.
```

O projeto será instrumentado com:

- logs correlacionados;
- counters;
- timers;
- gauges;
- métricas de retry;
- métricas de quarantine;
- backlog e idade do item mais antigo;
- consumer lag observado;
- runbook operacional.

A quarentena será persistente:

```text
notification_dispatch_quarantine.
```

Ela armazenará:

- intent ID;
- source event ID;
- reason code;
- exception class;
- mensagem limitada;
- attempts;
- correlation ID;
- timestamps.

Ela não armazenará:

- stacktrace completo;
- token;
- payload do cliente;
- contato pessoal;
- segredo;
- corpo bruto de request externo.

A quarentena não será processada automaticamente.

Um operador ou um reprocessador futuro precisa tomar uma decisão explícita.

Ao final, o projeto de mensageria de OS estará fechado ponta a ponta dentro do laboratório:

```text
criação da OS;

publicação confiável;

recepção durável;

deduplicação;

preparação da intenção;

dispatch idempotente;

retry;

quarantine;

monitoramento;

testes completos.
```

Próxima aula:

```text
499 - M16.44 - Projeto integracao API externa fake
```

Ela substituirá o adapter local por uma integração HTTP real contra uma API fake, incluindo timeout, autenticação simulada, erros HTTP e resiliência.

Nesta aula, nenhum `RestClient`, `WebClient` ou endpoint externo será utilizado.

Ao final, você deverá explicar:

```text
por que o dispatcher
não fica no listener Kafka;

por que a intent precisa
de lifecycle próprio;

por que provider e aplicação
não compartilham atomicidade;

por que idempotency key
precisa ser estável;

por que a chamada ocorre
fora da transação de claim;

como tratar a janela
provider aceitou
e mark SENT falhou;

quando usar retry;

quando usar quarantine;

por que SENT
não significa leitura do cliente;

como provar o fluxo completo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
496:
Projeto mensageria OS parte 1.

497:
Projeto mensageria OS parte 2.

498:
Projeto mensageria OS parte 3.

499:
Projeto integracao API externa fake.

500:
Revisao integracoes parte 1.
```

A aula 497 respondeu:

```text
como receber o evento
e preparar uma intenção
com segurança?
```

A aula 498 responderá:

```text
como despachar essa intenção
com idempotência,
retry e operação segura?
```

Nesta aula:

```text
producer OS:
reutilizado.

Outbox:
reutilizada.

Kafka:
reutilizado.

Notification Inbox:
reutilizada.

Notification Intent:
evoluída.

dispatcher:
sim.

provider port:
sim.

provider fake local:
sim.

idempotency key:
sim.

retry:
sim.

backoff:
sim.

stale claim:
sim.

quarantine:
sim.

métricas:
sim.

logs correlacionados:
sim.

teste ponta a ponta:
sim.

runbook:
sim.

HTTP externo:
não.

RestClient:
não.

WebClient:
não.

API fake remota:
não.

aula 499:
não antecipada.
```

A regra central será:

```text
o dispatcher pode repetir
a chamada;

o provider deve reconhecer
a mesma intenção;

a aplicação deve registrar
o resultado de forma recuperável.
```

---

## Objetivo prático

Ao final, a estrutura terá:

```text
src/main/java/br/com/formacao/m16/architecture/os
└── notification
    ├── dispatch
    │   ├── NotificationDispatchWorker.java
    │   ├── NotificationDispatchStateService.java
    │   ├── NotificationDispatchWorkItem.java
    │   └── NotificationProviderResult.java
    ├── provider
    │   ├── NotificationProvider.java
    │   ├── NotificationProviderCommand.java
    │   ├── NotificationProviderPermanentException.java
    │   ├── NotificationProviderTransientException.java
    │   └── fake
    │       ├── FakeNotificationDeliveryEntity.java
    │       ├── FakeNotificationDeliveryRepository.java
    │       ├── FakeNotificationProvider.java
    │       └── FakeNotificationProviderStateService.java
    ├── quarantine
    │   ├── NotificationDispatchQuarantineEntity.java
    │   ├── NotificationDispatchQuarantineRepository.java
    │   └── NotificationDispatchQuarantineService.java
    └── persistence
        ├── NotificationIntentEntity.java
        ├── NotificationIntentRepository.java
        └── NotificationIntentStatus.java
```

Documentação:

```text
docs/architecture/messaging-os
├── MESSAGING_OS_PART3.md
├── NOTIFICATION_DISPATCH_POLICY.md
├── NOTIFICATION_QUARANTINE_POLICY.md
├── NOTIFICATION_OPERATION_RUNBOOK.md
└── NOTIFICATION_E2E_CHECKLIST.md
```

Testes:

```text
src/test/java/br/com/formacao/m16/architecture/os
├── FakeNotificationProviderTest.java
├── NotificationDispatchSuccessIntegrationTest.java
├── NotificationDispatchRetryIntegrationTest.java
├── NotificationDispatchIdempotencyIntegrationTest.java
├── NotificationDispatchQuarantineIntegrationTest.java
├── NotificationDispatchStaleClaimTest.java
└── ServiceOrderMessagingEndToEndIntegrationTest.java
```

Você irá:

1. confirmar a baseline;
2. evoluir o lifecycle da intenção;
3. criar o provider port;
4. criar comando do provider;
5. criar resultados explícitos;
6. criar provider fake;
7. persistir entregas fake;
8. criar idempotency key;
9. separar transações;
10. criar candidatos;
11. criar claim;
12. criar worker;
13. marcar SENT;
14. implementar retry;
15. implementar backoff;
16. recuperar stale claims;
17. criar quarantine;
18. limitar dados de erro;
19. preservar correlação;
20. instrumentar métricas;
21. testar sucesso;
22. testar retry;
23. testar duplicata;
24. testar falha pós-aceite;
25. testar quarantine;
26. testar restart;
27. testar a jornada completa;
28. criar runbook;
29. executar o gate;
30. commitar;
31. preparar a API externa fake.

---

## Conceito essencial

### Dispatcher

Dispatcher é o componente que retira uma intenção pronta e tenta entregá-la ao provider.

Ele não deve ser confundido com:

- listener Kafka;
- preparação da intent;
- provider;
- controller HTTP;
- Outbox publisher.

Cada componente possui lifecycle próprio.

---

### Intent lifecycle

O lifecycle será:

#### READY_TO_SEND

Intenção preparada.

#### SENDING

Um worker fez claim.

#### RETRY_WAIT

Falha transitória; aguarda nova tentativa.

#### SENT

Provider aceitou a intenção.

#### QUARANTINED

Falha permanente ou retries esgotados exigem decisão operacional.

---

### Claim

A claim precisa ser condicional.

Exemplo:

```sql
UPDATE service_order_notification_intent
SET status = 'SENDING',
    claimed_at = :now,
    claimed_by = :workerId
WHERE id = :id
  AND status IN ('READY_TO_SEND', 'RETRY_WAIT')
  AND next_attempt_at <= :now;
```

Uma instância recebe `1`.

As demais recebem `0`.

---

### Chamada fora da transação de claim

Fluxo:

```text
transação curta:

claim.

sem transação da intent:

provider.send.

transação curta:

mark SENT
ou retry
ou quarantine.
```

Não mantenha conexão e lock de banco enquanto aguarda rede.

Nesta aula, o provider é local, mas o desenho deve respeitar a futura fronteira HTTP.

---

### Provider port

A aplicação dependerá de:

```java
NotificationProvider.
```

A implementação fake é adapter.

Na aula 499, outro adapter poderá implementar a mesma porta usando HTTP.

O dispatcher não deve saber se o provider é:

- fake local;
- REST;
- mensageria;
- SDK;
- serviço externo.

---

### Idempotency key

A chave será:

```text
sourceEventId.
```

O mesmo evento de OS gera uma única intenção.

A mesma intenção repetida utiliza a mesma key.

O provider fake cria unique constraint nessa key.

---

### Provider accepted versus SENT

O provider pode aceitar a chamada.

Depois, a aplicação ainda precisa marcar:

```text
SENT.
```

Existe uma janela entre os dois.

Se a aplicação falhar:

```text
retry;

mesma idempotency key;

provider responde
ALREADY_ACCEPTED;

aplicação marca SENT.
```

---

### Resultados explícitos

O provider retornará:

```text
ACCEPTED;

ALREADY_ACCEPTED.
```

Falhas serão exceptions tipadas:

```text
NotificationProviderTransientException;

NotificationProviderPermanentException.
```

Não use mensagem textual para decidir retry.

---

### Retry

Retry será aplicado quando a falha for temporária.

Exemplos conceituais:

- timeout;
- indisponibilidade;
- rate limit;
- erro interno temporário;
- conexão interrompida.

Backoff:

```text
1s;

2s;

4s;

8s;

máximo configurado.
```

---

### Quarantine

Quarantine recebe intenções que não podem avançar automaticamente.

Motivos:

- provider rejeitou permanentemente;
- contrato inválido;
- configuração ausente;
- retries esgotados;
- estado incoerente;
- idempotency conflict.

A intenção fica:

```text
QUARANTINED.
```

---

### SENT

`SENT` significa:

```text
provider aceitou
a solicitação.
```

Não significa:

- cliente leu;
- cliente recebeu no dispositivo;
- entrega foi confirmada;
- notificação foi aberta;
- jornada terminou.

Esses estados exigiriam callbacks ou eventos futuros.

---

### Observabilidade

Cada tentativa precisa produzir logs com:

- correlation ID;
- message ID;
- intent ID;
- source event ID;
- operation;
- attempt;
- outcome;
- reason code;
- duration.

Métricas não usam IDs únicos como tags.

---

### At-least-once

O dispatcher continua at-least-once.

Ele pode tentar mais de uma vez.

A idempotência desloca a garantia para:

```text
uma entrega lógica
por idempotency key.
```

Não existe exactly-once global.

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

A parte 2 precisa permanecer verde.

---

### 2. Evoluir NotificationIntentStatus

```java
package br.com.formacao.m16.architecture.os.notification.persistence;

public enum NotificationIntentStatus {
    READY_TO_SEND,
    SENDING,
    RETRY_WAIT,
    SENT,
    QUARANTINED
}
```

Remova o enum que possuía apenas `READY_TO_SEND`.

---

### 3. Evoluir NotificationIntentEntity

Adicione:

```text
attemptCount;

nextAttemptAt;

claimedAt;

claimedBy;

sentAt;

providerMessageId;

lastError;

rowVersion.
```

Exemplo:

```java
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

@Column(name = "claimed_at")
private Instant claimedAt;

@Column(name = "claimed_by", length = 100)
private String claimedBy;

@Column(name = "sent_at")
private Instant sentAt;

@Column(
    name = "provider_message_id",
    length = 120
)
private String providerMessageId;

@Column(name = "last_error", length = 1000)
private String lastError;

@Version
private long rowVersion;
```

No construtor:

```text
attemptCount = 0;

nextAttemptAt = createdAt.
```

---

### 4. Criar NotificationProviderCommand

```java
package br.com.formacao.m16.architecture.os.notification.provider;

import java.util.UUID;

public record NotificationProviderCommand(
    UUID intentId,
    UUID sourceEventId,
    String idempotencyKey,
    String serviceOrderId,
    String customerId,
    String scheduleId,
    String channel,
    String templateCode,
    String correlationId
) {
}
```

Nenhum contato real será enviado.

---

### 5. Criar NotificationProviderResult

```java
package br.com.formacao.m16.architecture.os.notification.dispatch;

public record NotificationProviderResult(
    Outcome outcome,
    String providerMessageId
) {

    public enum Outcome {
        ACCEPTED,
        ALREADY_ACCEPTED
    }
}
```

---

### 6. Criar a porta

```java
package br.com.formacao.m16.architecture.os.notification.provider;

import br.com.formacao.m16.architecture.os.notification.dispatch.NotificationProviderResult;

public interface NotificationProvider {

    NotificationProviderResult send(
        NotificationProviderCommand command
    );
}
```

O dispatcher dependerá somente dessa interface.

---

### 7. Criar exceptions do provider

```java
package br.com.formacao.m16.architecture.os.notification.provider;

public class NotificationProviderTransientException
        extends RuntimeException {

    public NotificationProviderTransientException(
        String message
    ) {
        super(message);
    }
}
```

```java
package br.com.formacao.m16.architecture.os.notification.provider;

public class NotificationProviderPermanentException
        extends RuntimeException {

    public NotificationProviderPermanentException(
        String message
    ) {
        super(message);
    }
}
```

---

### 8. Criar FakeNotificationDeliveryEntity

```java
package br.com.formacao.m16.architecture.os.notification.provider.fake;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "fake_notification_delivery",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_fake_provider_idempotency",
            columnNames = "idempotency_key"
        )
    }
)
public class FakeNotificationDeliveryEntity {

    @Id
    private UUID id;

    @Column(
        name = "idempotency_key",
        nullable = false,
        length = 120
    )
    private String idempotencyKey;

    @Column(
        name = "provider_message_id",
        nullable = false,
        length = 120
    )
    private String providerMessageId;

    @Column(
        name = "service_order_id",
        nullable = false,
        length = 100
    )
    private String serviceOrderId;

    @Column(
        name = "accepted_at",
        nullable = false
    )
    private Instant acceptedAt;

    protected FakeNotificationDeliveryEntity() {
    }

    public FakeNotificationDeliveryEntity(
        UUID id,
        String idempotencyKey,
        String providerMessageId,
        String serviceOrderId,
        Instant acceptedAt
    ) {
        this.id = id;
        this.idempotencyKey = idempotencyKey;
        this.providerMessageId = providerMessageId;
        this.serviceOrderId = serviceOrderId;
        this.acceptedAt = acceptedAt;
    }

    public String providerMessageId() {
        return providerMessageId;
    }
}
```

---

### 9. Criar repository fake

```java
package br.com.formacao.m16.architecture.os.notification.provider.fake;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FakeNotificationDeliveryRepository
        extends JpaRepository<
            FakeNotificationDeliveryEntity,
            UUID
        > {

    Optional<
        FakeNotificationDeliveryEntity
    > findByIdempotencyKey(
        String idempotencyKey
    );
}
```

---

### 10. Criar state service do provider fake

Use transação separada:

```java
package br.com.formacao.m16.architecture.os.notification.provider.fake;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FakeNotificationProviderStateService {

    private final FakeNotificationDeliveryRepository repository;

    public FakeNotificationProviderStateService(
        FakeNotificationDeliveryRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional(
        propagation = Propagation.REQUIRES_NEW
    )
    public ProviderAcceptance accept(
        String idempotencyKey,
        String serviceOrderId
    ) {
        Optional<FakeNotificationDeliveryEntity> existing =
            repository.findByIdempotencyKey(
                idempotencyKey
            );

        if (existing.isPresent()) {
            return new ProviderAcceptance(
                false,
                existing
                    .orElseThrow()
                    .providerMessageId()
            );
        }

        String providerMessageId =
            "FAKE-"
                + UUID.randomUUID();

        repository.saveAndFlush(
            new FakeNotificationDeliveryEntity(
                UUID.randomUUID(),
                idempotencyKey,
                providerMessageId,
                serviceOrderId,
                Instant.now()
            )
        );

        return new ProviderAcceptance(
            true,
            providerMessageId
        );
    }
}
```

O record `ProviderAcceptance` contém:

```text
created;

providerMessageId.
```

Em concorrência real, a unique constraint continua sendo a autoridade.

---

### 11. Criar FakeNotificationProvider

```java
package br.com.formacao.m16.architecture.os.notification.provider.fake;

import br.com.formacao.m16.architecture.os.notification.dispatch.NotificationProviderResult;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProvider;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderCommand;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderPermanentException;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderTransientException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class FakeNotificationProvider
        implements NotificationProvider {

    private final FakeNotificationProviderStateService stateService;

    private final ConcurrentHashMap<
        String,
        AtomicInteger
    > attempts =
        new ConcurrentHashMap<>();

    public FakeNotificationProvider(
        FakeNotificationProviderStateService stateService
    ) {
        this.stateService = stateService;
    }

    @Override
    public NotificationProviderResult send(
        NotificationProviderCommand command
    ) {
        simulateFailure(command);

        ProviderAcceptance acceptance =
            stateService.accept(
                command.idempotencyKey(),
                command.serviceOrderId()
            );

        return new NotificationProviderResult(
            acceptance.created()
                ? NotificationProviderResult
                    .Outcome
                    .ACCEPTED
                : NotificationProviderResult
                    .Outcome
                    .ALREADY_ACCEPTED,
            acceptance.providerMessageId()
        );
    }

    private void simulateFailure(
        NotificationProviderCommand command
    ) {
        if (
            command.customerId()
                .startsWith("PROVIDER-PERMANENT-")
        ) {
            throw new NotificationProviderPermanentException(
                "Fake provider permanent rejection"
            );
        }

        if (
            command.customerId()
                .startsWith("PROVIDER-TRANSIENT-")
        ) {
            int currentAttempt =
                attempts
                    .computeIfAbsent(
                        command.idempotencyKey(),
                        ignored ->
                            new AtomicInteger()
                    )
                    .incrementAndGet();

            if (currentAttempt <= 2) {
                throw new NotificationProviderTransientException(
                    "Fake provider temporary unavailable"
                );
            }
        }
    }
}
```

A simulação de tentativas em memória é apenas didática.

A idempotência aceita pelo provider é persistente.

---

### 12. Criar NotificationDispatchWorkItem

```java
package br.com.formacao.m16.architecture.os.notification.dispatch;

import java.util.UUID;

public record NotificationDispatchWorkItem(
    UUID intentId,
    UUID sourceEventId,
    String serviceOrderId,
    String customerId,
    String scheduleId,
    String channel,
    String templateCode,
    String correlationId,
    String causationId,
    int attemptCount
) {
}
```

Inclua `correlationId` e `causationId` na entidade da intenção.

Eles devem ser copiados da Inbox durante a preparação.

---

### 13. Criar queries de candidatos

O repository precisa:

- buscar IDs por status e data;
- fazer claim;
- carregar work item;
- marcar `SENT`;
- marcar `RETRY_WAIT`;
- marcar `QUARANTINED`;
- recuperar stale claims;
- contar backlog;
- encontrar item mais antigo.

Candidatos:

```text
READY_TO_SEND;

RETRY_WAIT.
```

---

### 14. Criar claim condicional

Exemplo:

```java
@Modifying
@Query("""
    update NotificationIntentEntity intent
       set intent.status = :sending,
           intent.claimedAt = :now,
           intent.claimedBy = :workerId
     where intent.id = :id
       and intent.status in :readyStatuses
       and intent.nextAttemptAt <= :now
    """)
int claim(
    UUID id,
    List<NotificationIntentStatus> readyStatuses,
    NotificationIntentStatus sending,
    String workerId,
    Instant now
);
```

---

### 15. Criar NotificationDispatchStateService

Métodos com `REQUIRES_NEW`:

- `findReadyIds`;
- `claim`;
- `markSent`;
- `markRetry`;
- `markQuarantined`;
- `recoverStaleClaims`.

`markSent` exige:

```text
status = SENDING;

claimedBy = worker atual.
```

Ele grava:

- `SENT`;
- `sentAt`;
- provider message ID;
- limpa claim;
- limpa erro.

---

### 16. Criar quarantine entity

```java
package br.com.formacao.m16.architecture.os.notification.quarantine;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notification_dispatch_quarantine")
public class NotificationDispatchQuarantineEntity {

    @Id
    private UUID id;

    @Column(
        name = "intent_id",
        nullable = false,
        unique = true
    )
    private UUID intentId;

    @Column(
        name = "source_event_id",
        nullable = false
    )
    private UUID sourceEventId;

    @Column(
        name = "reason_code",
        nullable = false,
        length = 100
    )
    private String reasonCode;

    @Column(
        name = "exception_class",
        nullable = false,
        length = 200
    )
    private String exceptionClass;

    @Column(
        name = "error_message",
        nullable = false,
        length = 1000
    )
    private String errorMessage;

    @Column(
        name = "attempt_count",
        nullable = false
    )
    private int attemptCount;

    @Column(
        name = "correlation_id",
        nullable = false,
        length = 100
    )
    private String correlationId;

    @Column(
        name = "quarantined_at",
        nullable = false
    )
    private Instant quarantinedAt;

    protected NotificationDispatchQuarantineEntity() {
    }
}
```

Adicione construtor e getters necessários.

---

### 17. Criar quarantine service

O service persiste quarantine e marca a intenção `QUARANTINED` na mesma transação.

Reason codes controlados:

```text
PROVIDER_PERMANENT_REJECTION;

RETRY_EXHAUSTED;

IDEMPOTENCY_CONFLICT;

INVALID_INTENT_STATE.
```

A mensagem deve ser:

- sem quebra de linha;
- truncada;
- sem payload;
- sem segredo.

---

### 18. Configurar dispatcher

No `application.yaml`:

```yaml
app:
  notification:
    dispatch:
      worker-delay-ms: 1000
      batch-size: 50
      claim-timeout-seconds: 30
      retry-base-seconds: 1
      retry-max-seconds: 30
      max-attempts: 5
```

O worker de preparação e o dispatcher são jobs diferentes.

---

### 19. Criar NotificationDispatchWorker

```java
package br.com.formacao.m16.architecture.os.notification.dispatch;

import br.com.formacao.m16.architecture.os.notification.provider.NotificationProvider;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderCommand;
import br.com.formacao.m16.architecture.os.notification.provider.NotificationProviderPermanentException;
import br.com.formacao.m16.kafka.correlation.CorrelationScope;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationDispatchWorker {

    private final NotificationDispatchStateService stateService;
    private final NotificationProvider provider;

    private final String workerId =
        UUID.randomUUID().toString();

    public NotificationDispatchWorker(
        NotificationDispatchStateService stateService,
        NotificationProvider provider
    ) {
        this.stateService = stateService;
        this.provider = provider;
    }

    @Scheduled(
        fixedDelayString =
            "${app.notification.dispatch.worker-delay-ms:1000}"
    )
    public void dispatchReady() {
        Instant now = Instant.now();

        stateService.recoverStaleClaims(now);

        for (
            UUID id :
            stateService.findReadyIds(now)
        ) {
            stateService
                .claim(id, workerId, now)
                .ifPresent(this::dispatch);
        }
    }

    private void dispatch(
        NotificationDispatchWorkItem item
    ) {
        Map<String, String> context =
            new LinkedHashMap<>();

        context.put(
            "correlationId",
            item.correlationId()
        );

        context.put(
            "messageId",
            item.sourceEventId().toString()
        );

        context.put(
            "causationId",
            item.causationId()
        );

        try (
            CorrelationScope ignored =
                CorrelationScope.open(context)
        ) {
            try {
                NotificationProviderResult result =
                    provider.send(
                        new NotificationProviderCommand(
                            item.intentId(),
                            item.sourceEventId(),
                            item.sourceEventId()
                                .toString(),
                            item.serviceOrderId(),
                            item.customerId(),
                            item.scheduleId(),
                            item.channel(),
                            item.templateCode(),
                            item.correlationId()
                        )
                    );

                stateService.markSent(
                    item.intentId(),
                    workerId,
                    result.providerMessageId(),
                    Instant.now()
                );
            } catch (
                NotificationProviderPermanentException permanent
            ) {
                stateService.quarantine(
                    item,
                    workerId,
                    "PROVIDER_PERMANENT_REJECTION",
                    permanent,
                    Instant.now()
                );
            } catch (Exception transientFailure) {
                stateService.retryOrQuarantine(
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

O provider é chamado depois do commit da claim.

---

### 20. Tratar retry

A cada falha transitória:

```text
attemptCount + 1;

nextAttemptAt;

status RETRY_WAIT;

lastError limitado;

claim limpo.
```

Quando o máximo for atingido:

```text
quarantine;

status QUARANTINED;

reason RETRY_EXHAUSTED.
```

---

### 21. Recuperar stale claims

Localize:

```text
status = SENDING;

claimedAt < cutoff.
```

Atualize:

```text
status = RETRY_WAIT;

nextAttemptAt = now;

lastError = STALE_CLAIM_RECOVERED;

claim limpo.
```

Se o provider já havia aceitado, a próxima chamada usa a mesma idempotency key.

---

### 22. Instrumentar métricas

Crie métricas:

```text
integration.notification.dispatch;

integration.notification.dispatch.duration;

integration.notification.ready;

integration.notification.retry.wait;

integration.notification.quarantined;

integration.notification.oldest.age.
```

Tags controladas:

```text
operation=send;

outcome=accepted;

outcome=already_accepted;

outcome=retry;

outcome=quarantined;

reasonCode.
```

Não use:

- intent ID;
- source event ID;
- service order ID;
- correlation ID;
- customer ID;
- provider message ID.

---

### 23. Padronizar logs

Eventos:

```text
notification.dispatch.started;

notification.dispatch.accepted;

notification.dispatch.already_accepted;

notification.dispatch.retry_scheduled;

notification.dispatch.quarantined;

notification.dispatch.stale_claim_recovered.
```

Exemplo:

```java
LOGGER.info(
    "event=notification.dispatch.accepted outcome=SUCCESS attempt={} providerOutcome={}",
    item.attemptCount(),
    result.outcome()
);
```

Os IDs entram pelo MDC quando necessário.

---

### 24. Criar política de dispatch

Arquivo:

```text
NOTIFICATION_DISPATCH_POLICY.md
```

Inclua:

```markdown
# Notification Dispatch Policy

## Candidate states

READY_TO_SEND e RETRY_WAIT.

## Claim

Update condicional.

## Provider call

Fora da transação de claim.

## Idempotency key

sourceEventId.

## Success

ACCEPTED ou ALREADY_ACCEPTED.

## Retry

Somente falha transitória.

## Quarantine

Falha permanente ou retry esgotado.

## External provider

Fake local na aula 498.

## HTTP adapter

Aula 499.
```

---

### 25. Criar política de quarantine

Arquivo:

```text
NOTIFICATION_QUARANTINE_POLICY.md
```

Defina:

- critérios;
- campos;
- retenção;
- owner;
- ações proibidas;
- reprocessamento manual;
- auditoria;
- dados sensíveis;
- resolução.

Ações proibidas:

```text
apagar a intent;

marcar SENT manualmente
sem confirmação;

alterar sourceEventId;

reutilizar outra
idempotency key;

reprocessar em massa
sem dry run.
```

---

### 26. Criar teste de sucesso

Cenário:

```text
Intent:
READY_TO_SEND.

Customer:
CUSTOMER-498.
```

Execute o dispatcher.

Confirme:

```text
Intent:
SENT.

Fake delivery:
1.

providerMessageId:
preenchido.

Quarantine:
0.
```

---

### 27. Criar teste de retry

Customer:

```text
PROVIDER-TRANSIENT-CUSTOMER-498.
```

Fluxo:

```text
READY_TO_SEND;

SENDING;

RETRY_WAIT;

SENDING;

RETRY_WAIT;

SENDING;

SENT.
```

Confirme:

```text
fake delivery:
1.

attemptCount:
2 ou valor definido
pela implementação.
```

---

### 28. Criar teste de falha permanente

Customer:

```text
PROVIDER-PERMANENT-CUSTOMER-498.
```

Resultado:

```text
Intent:
QUARANTINED.

Fake delivery:
0.

Quarantine:
1.

reason:
PROVIDER_PERMANENT_REJECTION.
```

---

### 29. Testar idempotência do provider

Chame `provider.send` duas vezes com:

```text
mesma idempotency key.
```

Resultado:

```text
primeira:
ACCEPTED.

segunda:
ALREADY_ACCEPTED.

fake delivery:
1.
```

---

### 30. Testar falha depois do provider

Crie um teste em que:

1. provider aceita;
2. `markSent` falha;
3. intent fica ou retorna a retry;
4. stale recovery ou retry executa;
5. provider responde `ALREADY_ACCEPTED`;
6. intent termina `SENT`;
7. fake delivery continua `1`.

Esse é o teste mais importante da idempotência ponta a ponta.

---

### 31. Testar stale claim

1. marque `SENDING`;
2. não chame o provider;
3. avance o relógio;
4. recupere;
5. confirme `RETRY_WAIT`;
6. execute;
7. confirme `SENT`.

---

### 32. Criar teste ponta a ponta

Com `@SpringBootTest` e `@EmbeddedKafka`:

1. envie `POST /api/v1/service-orders`;
2. confirme `PENDING_PUBLICATION`;
3. aguarde Outbox `PUBLISHED`;
4. aguarde Notification Inbox `PROCESSED`;
5. aguarde intent `SENT`;
6. confirme fake delivery;
7. confirme event ID em todas as etapas;
8. confirme correlation ID;
9. confirme uma única intent;
10. confirme uma única fake delivery.

Use `Awaitility` ou polling de teste com timeout limitado.

Não use `Thread.sleep` longo e fixo.

---

### 33. Validar redelivery na jornada

Depois do sucesso, publique novamente o mesmo evento.

Confirme:

```text
Inbox:
uma linha.

Intent:
uma linha.

Fake delivery:
uma linha.

Provider:
nenhum segundo efeito lógico.
```

---

### 34. Validar métricas

Depois dos cenários:

- success;
- retry;
- quarantine;
- duplicate.

Consulte:

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "integration_notification"
```

Confirme que IDs únicos não aparecem como labels.

---

### 35. Criar runbook

Arquivo:

```text
NOTIFICATION_OPERATION_RUNBOOK.md
```

Seção `READY_TO_SEND antigo`:

1. verificar dispatcher;
2. verificar claim;
3. verificar provider;
4. consultar métricas;
5. consultar logs por correlation ID;
6. não alterar status manualmente;
7. restaurar worker;
8. acompanhar backlog.

Seção `QUARANTINED`:

1. localizar reason code;
2. verificar attempts;
3. consultar provider state;
4. confirmar idempotency key;
5. corrigir causa;
6. criar reprocessamento aprovado;
7. preservar auditoria.

---

### 36. Criar checklist ponta a ponta

Arquivo:

```text
NOTIFICATION_E2E_CHECKLIST.md
```

Inclua:

```markdown
- [ ] OS persistida.
- [ ] Outbox criada.
- [ ] Evento publicado.
- [ ] Inbox persistida.
- [ ] Duplicata protegida.
- [ ] Intent criada.
- [ ] Dispatcher fez claim.
- [ ] Provider recebeu idempotency key.
- [ ] Intent virou SENT.
- [ ] Correlação preservada.
- [ ] Métricas atualizadas.
- [ ] Quarantine testada.
- [ ] Nenhuma chamada HTTP externa.
```

---

### 37. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=FakeNotificationProviderTest,NotificationDispatchSuccessIntegrationTest,NotificationDispatchRetryIntegrationTest,NotificationDispatchIdempotencyIntegrationTest,NotificationDispatchQuarantineIntegrationTest,NotificationDispatchStaleClaimTest,ServiceOrderMessagingEndToEndIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

## Entendendo o que foi feito

### A intenção ganhou lifecycle completo

Ela deixou de ser apenas `READY_TO_SEND`.

### O provider ficou atrás de uma porta

O dispatcher não depende de tecnologia externa.

### A idempotência atravessou a fronteira

`sourceEventId` protege chamadas repetidas.

### A transação ficou curta

Claim e resultado são persistidos em momentos separados.

### A janela de falha foi tratada

`ALREADY_ACCEPTED` permite concluir depois de uma falha local.

### Retry ficou limitado

Falhas transitórias não viram loop infinito.

### Quarantine ficou persistente

Falhas permanentes não desaparecem.

### A correlação chegou ao dispatch

A investigação conecta HTTP, Kafka, Inbox e provider.

### O monitoramento fechou a operação

Backlog, retry e quarantine ficaram visíveis.

### O projeto foi comprovado ponta a ponta

A OS chegou a uma entrega fake idempotente.

---

## Erros comuns importantes

### Chamar provider dentro do listener Kafka

O consumer fica acoplado à disponibilidade externa.

### Manter transação aberta durante o send

Locks e conexões ficam presos.

### Gerar idempotency key por tentativa

O provider aceita duplicatas.

### Usar intent ID novo a cada retry

A identidade lógica muda.

### Marcar SENT antes do provider

Falha externa perde a entrega.

### Considerar timeout como rejeição permanente

O provider pode ter aceitado.

### Repetir com key diferente após timeout

Pode criar duas entregas.

### Apagar quarantine

A evidência operacional é perdida.

### Guardar stacktrace inteiro na tabela

Volume e dados sensíveis aumentam.

### Usar correlation ID como tag

A cardinalidade explode.

### Chamar fake provider de API externa

Ele ainda é um adapter local.

### Implementar RestClient nesta aula

A aula 499 seria antecipada.

---

## Comandos úteis

### Ver métricas

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "integration_notification"
```

### Procurar chamadas HTTP indevidas

```powershell
git grep `
  -n `
  -E `
  "RestClient|WebClient|HttpClient|baseUrl"
```

### Procurar idempotency key

```powershell
git grep `
  -n `
  -E `
  "idempotencyKey|sourceEventId|ALREADY_ACCEPTED"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Lifecycle

Evolua a intent.

### Parte 2 — Port

Crie NotificationProvider.

### Parte 3 — Fake provider

Persista aceite idempotente.

### Parte 4 — Dispatcher

Crie claim e envio.

### Parte 5 — Retry

Implemente backoff.

### Parte 6 — Quarantine

Preserve falhas terminais.

### Parte 7 — Correlação

Propague contexto.

### Parte 8 — Métricas

Meça backlog e outcomes.

### Parte 9 — E2E

Teste HTTP até SENT.

### Parte 10 — Operação

Crie runbook e checklist.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 497 foi preservada;
- projeto de mensageria OS foi consolidado;
- lifecycle da intent foi evoluído;
- READY_TO_SEND foi mantido;
- SENDING foi criado;
- RETRY_WAIT foi criado;
- SENT foi criado;
- QUARANTINED foi criado;
- provider port foi criado;
- provider command foi criado;
- provider result foi criado;
- outcomes ACCEPTED e ALREADY_ACCEPTED foram criados;
- exceptions transitória e permanente foram criadas;
- fake provider foi criado;
- fake provider não usa HTTP;
- fake provider possui storage próprio;
- unique constraint de idempotência foi criada;
- sourceEventId foi usado como idempotency key;
- provider message ID foi criado;
- transação do provider fake foi separada;
- dispatcher foi criado;
- candidate query foi limitada;
- claim condicional foi criado;
- provider foi chamado fora da transação de claim;
- mark SENT foi criado;
- provider message ID foi persistido;
- retry transitório foi criado;
- backoff foi criado;
- máximo de tentativas foi criado;
- retries esgotados foram tratados;
- stale claim foi recuperado;
- quarantine entity foi criada;
- quarantine repository foi criado;
- quarantine service foi criado;
- quarantine e status terminal compartilham transação;
- reason codes controlados foram definidos;
- error message foi limitada;
- stacktrace não foi persistido;
- dados sensíveis não foram persistidos;
- correlation ID foi preservado;
- message ID usa source event ID;
- logs estruturados foram criados;
- métricas de dispatch foram criadas;
- métricas de backlog foram criadas;
- métricas de retry foram criadas;
- métricas de quarantine foram criadas;
- IDs únicos não foram usados como tags;
- teste de sucesso foi criado;
- teste de retry foi criado;
- teste de falha permanente foi criado;
- teste de idempotência foi criado;
- teste de falha pós-provider foi criado;
- ALREADY_ACCEPTED foi testado;
- teste de stale claim foi criado;
- teste ponta a ponta foi criado;
- HTTP até SENT foi comprovado;
- eventId foi preservado;
- correlationId foi preservado;
- redelivery depois do sucesso foi testada;
- uma única intent foi criada;
- uma única fake delivery foi criada;
- runbook foi criado;
- checklist E2E foi criado;
- política de dispatch foi criada;
- política de quarantine foi criada;
- Actuator foi utilizado;
- nenhuma API externa real foi chamada;
- RestClient não foi criado;
- WebClient não foi criado;
- autenticação externa não foi antecipada;
- resiliência HTTP não foi antecipada;
- aula 499 não foi implementada;
- gate foi executado;
- commit recomendado está pronto;
- ponte para a aula 499 está correta.

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
  "NotificationProvider|ALREADY_ACCEPTED|idempotencyKey|QUARANTINED|RestClient|WebClient|correlationId|eventId"
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
git commit -m "feat(m16): concluir mensageria de OS"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- RestClient;
- WebClient;
- URL externa;
- token;
- contato real;
- payload real;
- banco H2;
- diretório data;
- logs;
- target;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto de mensageria de OS foi concluído dentro do laboratório.

A jornada ficou:

```text
HTTP;

Service Order;

Outbox;

Kafka;

Notification Inbox;

Notification Intent;

Dispatcher;

Fake Provider;

SENT.
```

Você comprovou que:

- o listener Kafka não chama o provider;
- a intent possui lifecycle independente;
- claim e provider call ficam em etapas diferentes;
- sourceEventId funciona como idempotency key;
- retries usam a mesma identidade;
- `ALREADY_ACCEPTED` resolve a janela pós-provider;
- falhas transitórias usam backoff;
- falhas permanentes e retries esgotados vão para quarantine;
- claims órfãos são recuperados;
- logs preservam a jornada;
- métricas mostram backlog, retry e quarantine;
- o fluxo ponta a ponta produz uma única entrega lógica;
- SENT significa aceite do provider, não leitura do cliente.

A próxima aula será:

```text
499 - M16.44 - Projeto integracao API externa fake
```

Nela, você irá:

- criar uma API externa fake;
- definir contrato HTTP;
- substituir o adapter local;
- configurar RestClient;
- configurar timeout;
- propagar correlation ID;
- enviar idempotency key;
- tratar respostas 2xx;
- tratar 4xx;
- tratar 429;
- tratar 5xx;
- aplicar retry HTTP;
- tratar resposta ambígua;
- testar com servidor fake;
- manter o mesmo NotificationProvider port.

Nenhuma chamada HTTP externa foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Evoluí o lifecycle da intent.
- [ ] Criei o provider port.
- [ ] Criei fake provider idempotente.
- [ ] Criei dispatcher e claim.
- [ ] Implementei retry e quarantine.
- [ ] Testei falha pós-provider.
- [ ] Testei a jornada ponta a ponta.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Intent fica READY_TO_SEND

Confirme scheduler, candidate query, `nextAttemptAt` e status.

### Intent fica SENDING

Stale recovery pode não estar executando.

### Provider cria duas deliveries

Confirme unique constraint e idempotency key.

### Retry usa key diferente

A key está sendo gerada no worker em vez de derivada de `sourceEventId`.

### Provider aceitou, mas intent não vira SENT

Teste `ALREADY_ACCEPTED` e revise `markSent`.

### QUARANTINED volta para candidatos

A query de candidatos inclui status terminal indevido.

### Retry acontece imediatamente

Revise backoff e `nextAttemptAt`.

### Métricas possuem IDs únicos

Remova intentId, eventId e correlationId das tags.

### E2E fica instável

Use Awaitility, topics e dados exclusivos por teste.

### Existe chamada HTTP

Remova o adapter remoto; ele pertence à aula 499.

---

## Perguntas de revisão

1. O que faz o dispatcher?
2. Quais estados da intent existem?
3. O que significa SENDING?
4. O que significa SENT?
5. O que significa QUARANTINED?
6. Qual é a idempotency key?
7. Por que ela não muda?
8. O provider pode aceitar duas vezes?
9. O que é ALREADY_ACCEPTED?
10. Por que a chamada fica fora da transação?
11. Quando usar retry?
12. Quando usar quarantine?
13. O que é stale claim?
14. O que acontece após retries esgotados?
15. Quais dados entram na quarantine?
16. SENT significa leitura do cliente?
17. Qual métrica não deve usar eventId?
18. O fluxo E2E termina onde?
19. RestClient foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Entrega intents ao provider.
2. READY, SENDING, RETRY, SENT e QUARANTINED.
3. Um worker fez claim.
4. Provider aceitou.
5. Exige decisão operacional.
6. sourceEventId.
7. Representa a intenção lógica.
8. Não logicamente.
9. A mesma key já foi aceita.
10. Evitar lock durante rede.
11. Falha transitória.
12. Falha permanente ou esgotada.
13. SENDING abandonado.
14. Vai para quarantine.
15. IDs técnicos e erro limitado.
16. Não.
17. Todas as métricas.
18. Provider fake aceitou.
19. Não.
20. Projeto integracao API externa fake.

---

## Desafio opcional

Adicione um segundo canal fake:

```text
EMAIL_FAKE.
```

Requisitos:

- mesmo NotificationProvider port;
- template próprio;
- idempotency key estável;
- storage separado por provider;
- retry;
- quarantine;
- métricas por channel controlado;
- nenhuma URL externa;
- nenhum contato real;
- testes de duplicata.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 498 - M16.43 - Projeto mensageria OS parte 3

- Continuei após a Inbox e a intent da parte 2.
- Evoluí o lifecycle da intenção.
- Criei READY_TO_SEND, SENDING, RETRY_WAIT, SENT e QUARANTINED.
- Criei `NotificationProvider`.
- Criei `NotificationProviderCommand`.
- Criei outcomes ACCEPTED e ALREADY_ACCEPTED.
- Criei exceptions transitória e permanente.
- Implementei `FakeNotificationProvider`.
- Criei storage próprio do provider fake.
- Criei unique constraint para idempotency key.
- Usei sourceEventId como idempotency key.
- Mantive a key estável em retries.
- Separei a transação do provider fake.
- Criei `NotificationDispatchWorker`.
- Criei candidate query.
- Criei claim condicional.
- Chamei o provider fora da transação de claim.
- Marquei SENT depois do aceite.
- Persistei providerMessageId.
- Implementei retry com backoff.
- Limitei tentativas.
- Recuperei stale claims.
- Criei quarantine persistente.
- Criei reason codes controlados.
- Limitei a mensagem de erro.
- Não persisti stacktrace ou payload sensível.
- Preservei correlationId e eventId.
- Criei métricas de dispatch, retry e quarantine.
- Evitei IDs únicos em tags.
- Testei sucesso.
- Testei falha transitória.
- Testei falha permanente.
- Testei idempotência.
- Testei provider aceito e mark SENT falhando.
- Validei ALREADY_ACCEPTED.
- Testei stale recovery.
- Testei a jornada HTTP até SENT.
- Confirmei uma única intent e uma única delivery.
- Criei runbook e checklist E2E.
- Não implementei HTTP externo.
- Próxima aula: Projeto integracao API externa fake.
```

---

## Referência técnica curta

- Idempotency Key Pattern.
- Transactional Outbox Pattern.
- Transactional Inbox Pattern.
- At-least-once Delivery.
- Retry with Exponential Backoff.
- Dead Letter and Quarantine Patterns.
- Ports and Adapters.
- Spring Scheduling.
- Spring Transaction Management.
- Micrometer Metrics.

Regra final:

```text
a terceira parte conclui o projeto de mensageria de OS com dispatch idempotente e operação recuperável: a intent evolui de READY_TO_SEND para SENDING e termina em SENT, RETRY_WAIT ou QUARANTINED; o dispatcher faz claim em transação curta, chama NotificationProvider fora da transação e registra o resultado depois; o provider fake persiste uma única entrega por sourceEventId, utilizado como idempotency key, e retorna ALREADY_ACCEPTED quando a aplicação repete uma chamada já aceita; essa resposta fecha a janela em que o provider confirma e mark SENT falha; falhas transitórias usam backoff, falhas permanentes ou retries esgotados geram quarantine, stale claims retornam ao fluxo e logs e métricas preservam visibilidade sem tags de alta cardinalidade; o teste ponta a ponta prova HTTP, Outbox, Kafka, Inbox, Intent, Dispatcher e uma única entrega fake, enquanto a integração HTTP externa permanece reservada para a aula 499.
```
