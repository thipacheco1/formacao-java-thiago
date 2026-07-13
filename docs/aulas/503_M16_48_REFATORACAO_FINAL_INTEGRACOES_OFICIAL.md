# 503 - M16.48 - Refatoracao final integracoes

## Apresentação da aula

Na aula 502, você realizou uma prova prática de integrações.

O desafio exigiu evoluir o projeto com um novo fluxo:

```text
reagendamento de ordem de serviço.
```

A jornada esperada foi:

```text
PUT /api/v1/service-orders/{id}/reschedule;

transação local;

Outbox;

Kafka;

Inbox;

processamento idempotente;

Notification Intent;

dispatcher;

provider HTTP fake;

retry;

quarantine;

correlação;

métricas;

testes.
```

A prova não avaliou somente o happy path.

Ela exigiu evidências para:

- atomicidade;
- idempotência HTTP;
- event ID estável;
- redelivery;
- timeout pós-aceite;
- `ALREADY_ACCEPTED`;
- retry;
- quarantine;
- correlação;
- efeito único;
- fluxo ponta a ponta.

Quando uma feature é concluída, é comum o código funcionar e ainda apresentar sinais de desgaste:

- DTOs repetidos;
- criação de eventos duplicada;
- reason codes espalhados;
- cálculo de backoff repetido;
- workers com o mesmo esqueleto;
- scopes de correlação montados manualmente;
- strings de topic duplicadas;
- regras de retry acopladas a exceptions;
- mapeamentos HTTP extensos;
- testes longos e difíceis de ler;
- classes com responsabilidades demais;
- nomes diferentes para o mesmo conceito;
- infraestrutura genérica misturada com regras do domínio.

A pergunta central desta aula será:

```text
como refatorar
uma cadeia de integração

sem quebrar contratos,
garantias,
idempotência
ou comportamento operacional?
```

Refatoração não significa:

```text
reescrever tudo;

trocar tecnologia;

criar microsserviços;

alterar contratos;

mover classes por estética;

introduzir abstração genérica
antes de existir repetição real.
```

Refatoração significa:

```text
melhorar a estrutura interna

mantendo o comportamento
externamente observável.
```

No contexto desta aula, comportamento observável inclui:

- status HTTP;
- headers;
- topic;
- Kafka key;
- payload;
- event version;
- event ID;
- idempotency key;
- lifecycle;
- retry;
- reason codes;
- métricas;
- logs;
- constraints;
- respostas do provider;
- efeitos persistidos.

A estratégia será:

```text
1. congelar o comportamento;

2. identificar smells;

3. escolher refatorações pequenas;

4. executar uma por vez;

5. rodar testes;

6. revisar diff;

7. preservar contratos.
```

A aula trabalhará sobre o mesmo laboratório:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

O objetivo não será impor uma única arquitetura interna.

O objetivo será criar uma estrutura mais clara para os fluxos:

```text
service-order.scheduled.v1;

service-order.rescheduled.v1.
```

Os principais pontos de refatoração serão:

```text
envelope comum de eventos;

catálogo de event types;

metadata de integração;

factory de eventos;

taxonomia de reason codes;

política de retry;

scope Kafka reutilizável;

pipeline de workers;

mapeamento do provider;

fixtures e assertions de teste;

documentação arquitetural.
```

A refatoração precisa preservar:

```text
topic:
m16.service-order.events.v1.

key:
serviceOrderId.

consumer group:
m16-notification-service-order-v1.

dedup:
consumerName + eventId.

provider idempotency:
sourceEventId.

HTTP idempotency:
Idempotency-Key.

delivery:
at-least-once.

effect:
um efeito lógico por identidade.
```

A aula não criará um framework interno genérico para todos os sistemas do mundo.

Cada extração precisa responder:

```text
há repetição real?

o conceito possui nome estável?

a abstração reduz risco?

os testes ficam mais claros?

o domínio continua visível?
```

A próxima aula será:

```text
504 - M16.49 - Aula ensinavel integracoes
```

Depois da refatoração, você precisará transformar todo o conhecimento do módulo em uma explicação ensinável.

Ao final, você deverá explicar:

```text
por que testes de caracterização
vêm antes da refatoração;

quais contratos
não podem mudar;

como reduzir duplicação
sem esconder o domínio;

por que reason codes
precisam ser centralizados;

como separar retry policy
de worker;

como reutilizar
correlation context;

como melhorar testes
sem reduzir cobertura;

como validar
que a refatoração
não alterou garantias.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
501:
Revisao integracoes parte 2.

502:
Prova pratica integracoes.

503:
Refatoracao final integracoes.

504:
Aula ensinavel integracoes.
```

A aula 502 respondeu:

```text
você consegue implementar
uma integração completa
em um cenário novo?
```

A aula 503 responderá:

```text
você consegue melhorar
a estrutura dessa integração
sem quebrar o que provou?
```

Nesta aula:

```text
testes de caracterização:
sim.

preservação de contratos:
sim.

refatoração incremental:
sim.

event envelope:
sim.

event factory:
sim.

reason codes:
sim.

retry policy:
sim.

correlation scope:
sim.

workers:
sim.

provider mapping:
sim.

test fixtures:
sim.

documentação:
sim.

novo endpoint:
não.

novo evento:
não.

novo broker:
não.

novo microsserviço:
não.

mudança de topic:
não.

mudança de key:
não.

mudança de versão:
não.

aula ensinável:
não antecipada.
```

A regra central será:

```text
primeiro prove o comportamento;

depois melhore a estrutura;

por fim prove novamente
o mesmo comportamento.
```

---

## Objetivo prático

Ao final, a estrutura sugerida terá:

```text
src/main/java/br/com/formacao/m16/integration
├── contract
│   ├── IntegrationEventEnvelope.java
│   ├── IntegrationEventMetadata.java
│   └── IntegrationEventTypes.java
├── correlation
│   └── KafkaCorrelationScopeFactory.java
├── failure
│   ├── IntegrationFailure.java
│   ├── IntegrationFailureKind.java
│   └── IntegrationReasonCodes.java
├── retry
│   ├── ExponentialBackoffPolicy.java
│   ├── RetryDecision.java
│   └── RetryPolicy.java
└── test
    └── IntegrationAssertions.java
```

No módulo OS:

```text
src/main/java/br/com/formacao/m16/architecture/os
├── serviceorder
│   ├── event
│   │   ├── ServiceOrderEventFactory.java
│   │   ├── ServiceOrderScheduledPayloadV1.java
│   │   └── ServiceOrderRescheduledPayloadV1.java
│   └── application
│       └── ServiceOrderApplicationService.java
└── notification
    ├── consumer
    │   ├── NotificationEventRouter.java
    │   ├── NotificationEventHandler.java
    │   ├── ScheduledNotificationEventHandler.java
    │   └── RescheduledNotificationEventHandler.java
    ├── dispatch
    │   └── NotificationDispatchWorker.java
    └── provider
        └── http
            └── HttpNotificationProvider.java
```

Documentação:

```text
docs/architecture/refactoring-integrations
├── REFACTORING_PLAN.md
├── BEHAVIOR_PRESERVATION_MATRIX.md
├── INTEGRATION_NAMING_POLICY.md
├── FAILURE_TAXONOMY.md
└── REFACTORING_RESULT.md
```

Testes:

```text
src/test/java/br/com/formacao/m16/refactoring
├── IntegrationBehaviorCharacterizationTest.java
├── ServiceOrderEventFactoryTest.java
├── NotificationEventRouterTest.java
├── RetryPolicyTest.java
└── IntegrationArchitectureAfterRefactoringTest.java
```

Você irá:

1. confirmar a baseline;
2. criar matriz de preservação;
3. executar testes de caracterização;
4. listar smells;
5. priorizar refatorações;
6. centralizar tipos de evento;
7. criar envelope comum;
8. separar payloads;
9. criar factory de eventos;
10. simplificar application services;
11. criar router de eventos;
12. separar handlers;
13. centralizar reason codes;
14. criar taxonomia de falhas;
15. extrair retry policy;
16. extrair backoff;
17. reutilizar scope Kafka;
18. simplificar workers;
19. melhorar mapeamento HTTP;
20. criar fixtures;
21. criar assertions;
22. executar testes a cada passo;
23. revisar métricas e logs;
24. revisar arquitetura;
25. registrar resultado;
26. executar o gate;
27. commitar;
28. preparar a aula ensinável.

---

## Conceito essencial

### Teste de caracterização

Teste de caracterização registra o comportamento atual.

Ele é útil quando:

- a estrutura será alterada;
- o comportamento precisa permanecer;
- existem múltiplos boundaries;
- contratos já são consumidos;
- risco de regressão é alto.

O teste não precisa aprovar o design interno.

Ele precisa congelar o comportamento externo.

---

### Comportamento observável

No projeto, comportamento observável inclui:

```text
HTTP status;

response body;

headers;

event type;

event version;

topic;

key;

payload;

lifecycle;

reason code;

métrica;

efeito persistido.
```

Alterar qualquer um desses itens exige decisão de contrato, não refatoração silenciosa.

---

### Refatoração incremental

Uma refatoração segura deve ser pequena.

Exemplo:

```text
extrair reason codes;

rodar testes;

commitar.
```

Depois:

```text
extrair retry policy;

rodar testes;

commitar.
```

Evite alterar simultaneamente:

- modelo de evento;
- worker;
- banco;
- client HTTP;
- lifecycle;
- testes.

---

### Abstração prematura

Uma abstração é prematura quando:

- possui apenas um uso;
- esconde regras;
- exige muitos generics;
- aumenta indireção;
- não possui nome de domínio;
- torna debugging mais difícil.

A aula criará abstrações somente onde existe repetição comprovada.

---

### Envelope comum

Os eventos agendado e reagendado compartilham metadata:

```text
eventId;

eventType;

eventVersion;

occurredAt;

correlationId;

causationId;

serviceOrderId.
```

O conteúdo de negócio é diferente.

Uma modelagem possível:

```text
envelope comum;

payload específico.
```

Não transforme todos os campos em `Map<String, Object>`.

---

### Payload específico

Agendamento:

```text
customerId;

scheduleId;

preferredPeriod;

status.
```

Reagendamento:

```text
customerId;

scheduleId;

previousPeriod;

newPeriod;

reason;

serviceOrderVersion;

status.
```

O payload mantém o domínio explícito.

---

### Factory de eventos

A factory centraliza:

- event ID;
- event type;
- version;
- timestamp;
- correlation;
- causation;
- payload.

Ela reduz duplicação no application service.

Ela não deve buscar banco, publicar Kafka ou iniciar transação.

---

### Router de eventos

O consumer pode receber eventos diferentes no mesmo topic.

Um router faz:

```text
eventType
-> handler.
```

Cada handler conhece um payload.

Isso evita:

- listener gigante;
- `if` encadeado;
- casts espalhados;
- regras misturadas.

---

### Taxonomia de falhas

Falhas possuem duas dimensões:

```text
kind;

reason code.
```

Kinds:

```text
TRANSIENT;

PERMANENT;

AMBIGUOUS;

DUPLICATE.
```

Reason codes:

```text
PROVIDER_RATE_LIMITED;

PROVIDER_REJECTED;

PROVIDER_TIMEOUT;

EVENT_VERSION_UNSUPPORTED;

RETRY_EXHAUSTED.
```

A taxonomia reduz decisões por texto de exception.

---

### Retry policy

A retry policy recebe:

- kind;
- reason code;
- attempt;
- retry after;
- configuração.

Ela retorna:

```text
RETRY;

QUARANTINE;

IGNORE_DUPLICATE;

SUCCESS.
```

O worker executa a decisão.

Ele não precisa recalcular regras.

---

### Backoff

O cálculo precisa ser determinístico e testável.

Exemplo:

```text
base;

attempt;

max;

retryAfter;

jitter opcional.
```

A função não acessa banco nem relógio global.

---

### Correlation scope factory

Listeners e workers montaram mapas MDC manualmente.

Uma factory pode criar scopes para:

- Kafka record;
- Inbox item;
- dispatch item;
- replay item.

Ela reduz diferenças de nomes e campos esquecidos.

---

### Fixtures de teste

Fixtures criam objetos válidos de forma clara.

Exemplo:

```java
events()
    .rescheduled()
    .withServiceOrderId("OS-503")
    .build();
```

Evite fixtures que escondem todos os valores importantes.

---

### Assertions de integração

Assertions reutilizáveis podem verificar:

```text
Outbox;

Inbox;

Intent;

Provider delivery;

correlation;

event identity.
```

Elas reduzem repetição sem esconder o objetivo do teste.

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

Registre:

- commit;
- quantidade de testes;
- resultado;
- duração;
- branch.

Não refatore com testes vermelhos.

---

### 2. Criar plano de refatoração

Arquivo:

```text
docs/architecture/refactoring-integrations/REFACTORING_PLAN.md
```

Tabela:

```markdown
| Ordem | Smell | Refatoração | Risco | Teste protetor |
|---:|---|---|---|---|
| 1 | Event types duplicados | Catálogo central | Baixo | Contract test |
| 2 | Criação de evento repetida | Factory | Médio | Event factory test |
| 3 | Listener com branches | Router + handlers | Médio | Router test |
| 4 | Retry espalhado | RetryPolicy | Alto | Retry policy test |
| 5 | MDC manual | Scope factory | Médio | Correlation test |
| 6 | Test setup duplicado | Fixtures | Baixo | Suite completa |
```

---

### 3. Criar matriz de preservação

Arquivo:

```text
BEHAVIOR_PRESERVATION_MATRIX.md
```

Inclua:

```markdown
| Comportamento | Antes | Depois | Evidência |
|---|---|---|---|
| Topic | m16.service-order.events.v1 | Igual | Contract test |
| Kafka key | serviceOrderId | Igual | Publishing test |
| Scheduled type | service-order.scheduled.v1 | Igual | Contract test |
| Rescheduled type | service-order.rescheduled.v1 | Igual | Exam test |
| Dedup | consumerName + eventId | Igual | Redelivery test |
| HTTP key | Idempotency-Key | Igual | Idempotency test |
| Provider key | sourceEventId | Igual | Timeout test |
| 429 | Retry | Igual | Status test |
| 422 | Quarantine | Igual | Status test |
```

---

### 4. Criar teste de caracterização

Arquivo:

```text
IntegrationBehaviorCharacterizationTest.java
```

Ele deve confirmar:

- topic;
- group;
- event types;
- versions;
- key;
- headers;
- status HTTP;
- lifecycle;
- reason codes principais.

Não teste detalhes privados.

---

### 5. Centralizar tipos de evento

Arquivo:

```text
IntegrationEventTypes.java
```

```java
package br.com.formacao.m16.integration.contract;

public final class IntegrationEventTypes {

    public static final String
        SERVICE_ORDER_SCHEDULED_V1 =
            "service-order.scheduled.v1";

    public static final String
        SERVICE_ORDER_RESCHEDULED_V1 =
            "service-order.rescheduled.v1";

    private IntegrationEventTypes() {
    }
}
```

Substitua strings duplicadas.

Rode:

```powershell
.\mvnw.cmd `
  -Dtest=*Contract*,*Characterization* `
  test
```

---

### 6. Criar metadata comum

```java
package br.com.formacao.m16.integration.contract;

import java.time.Instant;
import java.util.UUID;

public record IntegrationEventMetadata(
    UUID eventId,
    String eventType,
    int eventVersion,
    Instant occurredAt,
    String correlationId,
    String causationId,
    String aggregateId
) {
}
```

`aggregateId` será:

```text
serviceOrderId.
```

---

### 7. Criar envelope genérico limitado

```java
package br.com.formacao.m16.integration.contract;

public record IntegrationEventEnvelope<T>(
    IntegrationEventMetadata metadata,
    T payload
) {
}
```

Use generics apenas no limite do contrato.

Não faça o domínio inteiro depender de `Object`.

---

### 8. Criar payloads específicos

```java
package br.com.formacao.m16.architecture.os.serviceorder.event;

public record ServiceOrderScheduledPayloadV1(
    String customerId,
    String scheduleId,
    String preferredPeriod,
    String status
) {
}
```

```java
package br.com.formacao.m16.architecture.os.serviceorder.event;

public record ServiceOrderRescheduledPayloadV1(
    String customerId,
    String scheduleId,
    String previousPeriod,
    String newPeriod,
    String reason,
    long serviceOrderVersion,
    String status
) {
}
```

---

### 9. Preservar o contrato serializado

Antes de trocar o modelo Java, compare JSON.

Se o contrato externo atual é flat, não mude para:

```json
{
  "metadata": {},
  "payload": {}
}
```

sem versionar.

Duas opções seguras:

#### Opção A

Usar envelope apenas internamente e manter serializer flat.

#### Opção B

Manter records externos atuais e utilizar metadata internamente.

Para esta aula, prefira preservar o JSON atual.

Refatoração interna não justifica quebra de contrato.

---

### 10. Criar ServiceOrderEventFactory

```java
package br.com.formacao.m16.architecture.os.serviceorder.event;

import br.com.formacao.m16.integration.contract.IntegrationEventTypes;
import br.com.formacao.m16.kafka.correlation.CorrelationContext;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ServiceOrderEventFactory {

    private final Clock clock;
    private final CorrelationContext correlationContext;

    public ServiceOrderEventFactory(
        CorrelationContext correlationContext
    ) {
        this.clock = Clock.systemUTC();
        this.correlationContext =
            correlationContext;
    }

    public ServiceOrderScheduledEventV1 scheduled(
        ServiceOrderScheduledData data
    ) {
        var correlation =
            correlationContext.current();

        return new ServiceOrderScheduledEventV1(
            UUID.randomUUID(),
            IntegrationEventTypes
                .SERVICE_ORDER_SCHEDULED_V1,
            1,
            clock.instant(),
            correlation.correlationId(),
            correlation.messageId(),
            data.serviceOrderId(),
            data.customerId(),
            data.scheduleId(),
            data.preferredPeriod(),
            data.status()
        );
    }
}
```

Crie método equivalente para reagendamento.

---

### 11. Simplificar application services

Antes:

```text
criar UUID;

buscar correlation;

montar event type;

montar version;

montar timestamp;

montar evento.
```

Depois:

```java
var event =
    eventFactory.rescheduled(
        new ServiceOrderRescheduledData(...)
    );
```

O application service continua responsável por:

- regra;
- transação;
- persistência;
- chamada do port.

A factory cuida apenas da construção.

---

### 12. Criar router de eventos

```java
package br.com.formacao.m16.architecture.os.notification.consumer;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventRouter {

    private final Map<
        String,
        NotificationEventHandler
    > handlers;

    public NotificationEventRouter(
        java.util.List<
            NotificationEventHandler
        > handlers
    ) {
        this.handlers =
            handlers.stream()
                .collect(
                    java.util.stream.Collectors
                        .toUnmodifiableMap(
                            NotificationEventHandler
                                ::eventType,
                            handler -> handler
                        )
                );
    }

    public void route(
        NotificationInboundEvent event
    ) {
        NotificationEventHandler handler =
            handlers.get(
                event.eventType()
            );

        if (handler == null) {
            throw new UnsupportedNotificationEventException(
                event.eventType()
            );
        }

        handler.handle(event);
    }
}
```

O listener continua responsável pela Inbox.

O worker chama o router.

---

### 13. Criar handlers específicos

Interface:

```java
public interface NotificationEventHandler {

    String eventType();

    void handle(
        NotificationInboundEvent event
    );
}
```

Handlers:

```text
ScheduledNotificationEventHandler;

RescheduledNotificationEventHandler.
```

Cada handler:

- valida versão;
- desserializa payload;
- cria intenção;
- escolhe template;
- não chama provider diretamente.

---

### 14. Centralizar reason codes

Arquivo:

```text
IntegrationReasonCodes.java
```

```java
package br.com.formacao.m16.integration.failure;

public final class IntegrationReasonCodes {

    public static final String
        PROVIDER_RATE_LIMITED =
            "PROVIDER_RATE_LIMITED";

    public static final String
        PROVIDER_REJECTED =
            "PROVIDER_REJECTED";

    public static final String
        PROVIDER_TIMEOUT =
            "PROVIDER_TIMEOUT";

    public static final String
        EVENT_VERSION_UNSUPPORTED =
            "EVENT_VERSION_UNSUPPORTED";

    public static final String
        RETRY_EXHAUSTED =
            "RETRY_EXHAUSTED";

    private IntegrationReasonCodes() {
    }
}
```

Não centralize mensagens de negócio sem necessidade.

---

### 15. Criar kind de falha

```java
package br.com.formacao.m16.integration.failure;

public enum IntegrationFailureKind {
    TRANSIENT,
    PERMANENT,
    AMBIGUOUS,
    DUPLICATE
}
```

Record:

```java
package br.com.formacao.m16.integration.failure;

import java.time.Duration;

public record IntegrationFailure(
    IntegrationFailureKind kind,
    String reasonCode,
    Duration retryAfter,
    Throwable cause
) {
}
```

---

### 16. Criar RetryDecision

```java
package br.com.formacao.m16.integration.retry;

import java.time.Duration;

public sealed interface RetryDecision {

    record RetryAfter(
        Duration delay
    ) implements RetryDecision {
    }

    record Quarantine(
        String reasonCode
    ) implements RetryDecision {
    }

    record IgnoreDuplicate()
        implements RetryDecision {
    }
}
```

O projeto pode utilizar uma interface não sealed se a versão ou estilo local preferir.

---

### 17. Criar RetryPolicy

```java
package br.com.formacao.m16.integration.retry;

import br.com.formacao.m16.integration.failure.IntegrationFailure;
import br.com.formacao.m16.integration.failure.IntegrationFailureKind;

public class RetryPolicy {

    private final ExponentialBackoffPolicy backoff;
    private final int maxAttempts;

    public RetryPolicy(
        ExponentialBackoffPolicy backoff,
        int maxAttempts
    ) {
        this.backoff = backoff;
        this.maxAttempts = maxAttempts;
    }

    public RetryDecision decide(
        IntegrationFailure failure,
        int currentAttempt
    ) {
        if (
            failure.kind()
                == IntegrationFailureKind.DUPLICATE
        ) {
            return new RetryDecision
                .IgnoreDuplicate();
        }

        if (
            failure.kind()
                == IntegrationFailureKind.PERMANENT
        ) {
            return new RetryDecision.Quarantine(
                failure.reasonCode()
            );
        }

        if (
            currentAttempt + 1
                >= maxAttempts
        ) {
            return new RetryDecision.Quarantine(
                "RETRY_EXHAUSTED"
            );
        }

        return new RetryDecision.RetryAfter(
            backoff.calculate(
                currentAttempt,
                failure.retryAfter()
            )
        );
    }
}
```

---

### 18. Criar backoff testável

```java
package br.com.formacao.m16.integration.retry;

import java.time.Duration;

public class ExponentialBackoffPolicy {

    private final Duration base;
    private final Duration max;

    public ExponentialBackoffPolicy(
        Duration base,
        Duration max
    ) {
        this.base = base;
        this.max = max;
    }

    public Duration calculate(
        int attempt,
        Duration retryAfter
    ) {
        long multiplier =
            1L << Math.min(
                attempt,
                20
            );

        Duration local =
            base.multipliedBy(
                multiplier
            );

        Duration selected =
            retryAfter != null
                && retryAfter.compareTo(local) > 0
                    ? retryAfter
                    : local;

        return selected.compareTo(max) > 0
            ? max
            : selected;
    }
}
```

Teste:

- attempts;
- cap;
- Retry-After;
- overflow protegido.

---

### 19. Adaptar exceptions

O adapter HTTP pode converter status em:

```text
IntegrationFailure.
```

Ou continuar usando exceptions tipadas e possuir um mapper:

```text
Throwable
-> IntegrationFailure.
```

Prefira não quebrar a porta `NotificationProvider`.

A refatoração precisa permanecer interna.

---

### 20. Simplificar o dispatch worker

Antes:

```text
catch permanente;

catch transitória;

calcular tentativa;

calcular delay;

marcar retry;

marcar quarantine.
```

Depois:

```text
mapear falha;

pedir decisão;

executar decisão.
```

O worker permanece responsável por coordenação.

A policy permanece responsável por decisão.

---

### 21. Criar KafkaCorrelationScopeFactory

```java
package br.com.formacao.m16.integration.correlation;

import br.com.formacao.m16.kafka.correlation.CorrelationScope;
import java.util.LinkedHashMap;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public class KafkaCorrelationScopeFactory {

    public CorrelationScope open(
        ConsumerRecord<?, ?> record,
        String correlationId,
        String messageId,
        String causationId
    ) {
        var values =
            new LinkedHashMap<
                String,
                String
            >();

        values.put(
            "correlationId",
            correlationId
        );

        values.put(
            "messageId",
            messageId
        );

        values.put(
            "causationId",
            causationId
        );

        values.put(
            "topic",
            record.topic()
        );

        values.put(
            "partition",
            Integer.toString(
                record.partition()
            )
        );

        values.put(
            "offset",
            Long.toString(
                record.offset()
            )
        );

        return CorrelationScope.open(
            values
        );
    }
}
```

Crie overload para work items persistidos.

---

### 22. Preservar logs e métricas

Depois da refatoração, valide:

- mesmos event names;
- mesmos reason codes;
- mesmas tags;
- mesmas métricas;
- nenhum ID novo em tags;
- nenhum payload em log;
- mesma correlação.

Refatorar nomes públicos de métricas exige migração e não pertence a esta aula.

---

### 23. Criar fixtures de eventos

Exemplo:

```java
public final class ServiceOrderEventFixtures {

    public static
        ServiceOrderRescheduledEventV1
        validRescheduledEvent() {
        return new ServiceOrderRescheduledEventV1(
            UUID.fromString(
                "00000000-0000-0000-0000-000000000503"
            ),
            IntegrationEventTypes
                .SERVICE_ORDER_RESCHEDULED_V1,
            1,
            Instant.parse(
                "2026-07-12T20:50:00Z"
            ),
            "CORR-503",
            "REQ-503",
            "OS-503",
            "CUSTOMER-503",
            "SCHEDULE-503",
            "MORNING",
            "AFTERNOON",
            "CUSTOMER_REQUEST",
            2,
            "SCHEDULED"
        );
    }

    private ServiceOrderEventFixtures() {
    }
}
```

Valores determinísticos facilitam comparação.

---

### 24. Criar assertions reutilizáveis

Exemplo:

```java
public final class IntegrationAssertions {

    public static void assertPublishedOnce(
        OutboxEventRepository repository,
        UUID eventId
    ) {
        assertThat(
            repository.countById(
                eventId
            )
        ).isEqualTo(1);
    }

    private IntegrationAssertions() {
    }
}
```

Não esconda assertions importantes demais em uma única chamada genérica.

---

### 25. Refatorar testes longos

Use:

```text
Given;

When;

Then.
```

Separe helpers de:

- setup;
- act;
- assertions;
- cleanup.

Mantenha no teste os dados que explicam o cenário:

```text
eventId;

idempotency key;

customer prefix;

expected lifecycle.
```

---

### 26. Criar teste do router

Cenários:

```text
scheduled
-> Scheduled handler.

rescheduled
-> Rescheduled handler.

unknown
-> permanent failure.
```

Confirme que somente um handler executa.

---

### 27. Criar teste da RetryPolicy

Cenários:

- permanent -> quarantine;
- duplicate -> ignore;
- transient -> retry;
- ambiguous -> retry;
- max attempts -> quarantine;
- Retry-After maior -> respeitado;
- cap -> aplicado.

---

### 28. Criar teste arquitetural pós-refatoração

Valide:

```text
application não importa KafkaTemplate;

application não importa RestClient;

handlers não importam provider;

worker depende de policy;

event types estão centralizados;

outro módulo não importa `.internal`.
```

---

### 29. Executar testes por etapa

Após cada refatoração:

```powershell
.\mvnw.cmd `
  -Dtest=<testes-relacionados> `
  test
```

A cada grupo:

```powershell
.\mvnw.cmd clean verify
```

Não acumule dez refatorações antes do primeiro teste.

---

### 30. Revisar o diff

```powershell
git diff --stat
git diff --check
git diff
```

Perguntas:

- algum contrato mudou?
- algum reason code mudou?
- algum status mudou?
- algum header sumiu?
- algum teste foi removido?
- alguma constraint foi alterada?
- alguma série de métrica mudou?
- alguma exception deixou de ser classificada?

---

### 31. Registrar resultado

Arquivo:

```text
REFACTORING_RESULT.md
```

Inclua:

```markdown
## Antes

## Smells encontrados

## Refatorações executadas

## Comportamentos preservados

## Testes executados

## Melhorias obtidas

## Abstrações recusadas

## Riscos restantes

## Próximos passos
```

Registrar abstrações recusadas é importante.

Exemplo:

```text
não foi criado
GenericIntegrationFramework;

não havia necessidade.
```

---

## Entendendo o que foi feito

### A refatoração começou pela proteção

Testes e matriz congelaram contratos.

### Metadata comum reduziu repetição

IDs, versão e correlação ganharam um modelo coerente.

### Payloads mantiveram o domínio visível

Agendamento e reagendamento continuaram diferentes.

### A factory simplificou application services

Construção de eventos saiu da orquestração.

### O router separou tipos de evento

O consumer não virou um bloco crescente de condições.

### Reason codes ganharam consistência

Logs, métricas e quarantine utilizam o mesmo vocabulário.

### Retry ficou testável

A policy decide; o worker coordena.

### Backoff deixou de ser cálculo espalhado

Cap e Retry-After foram centralizados.

### Correlação ficou reutilizável

Listeners e workers deixaram de montar mapas diferentes.

### Testes ficaram mais legíveis

Fixtures e assertions reduziram ruído sem esconder a intenção.

### O contrato permaneceu

Refatoração interna não mudou comportamento externo.

---

## Erros comuns importantes

### Refatorar sem baseline

Uma falha antiga pode ser atribuída à mudança nova.

### Alterar JSON por conveniência interna

Consumidores podem quebrar.

### Criar generic event com Map

O domínio perde tipos e validação.

### Centralizar todas as strings do projeto

A abstração vira um depósito sem significado.

### Criar retry policy acoplada ao banco

A lógica deixa de ser pura e testável.

### Transformar worker em framework genérico

As diferenças de lifecycle podem desaparecer.

### Remover testes duplicados sem entender cobertura

Cenários distintos podem parecer iguais.

### Mudar reason code silenciosamente

Alertas e runbooks deixam de funcionar.

### Renomear métricas durante refatoração

Dashboards quebram.

### Misturar refatoração e feature

Fica difícil provar preservação.

### Criar abstração para um único uso

A indireção aumenta sem benefício.

---

## Comandos úteis

### Baseline

```powershell
.\mvnw.cmd clean verify
```

### Testes de caracterização

```powershell
.\mvnw.cmd `
  -Dtest=*Characterization*,*Contract* `
  test
```

### Testes da refatoração

```powershell
.\mvnw.cmd `
  -Dtest=*Factory*,*Router*,*RetryPolicy*,*ArchitectureAfterRefactoring* `
  test
```

### Procurar strings duplicadas

```powershell
git grep `
  -n `
  -E `
  "service-order\\.(scheduled|rescheduled)\\.v1|PROVIDER_|RETRY_EXHAUSTED"
```

### Procurar violações

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|RestClient|\\.internal\\."
```

### Revisar diff

```powershell
git status
git diff --stat
git diff --check
git diff
```

---

## Exercício guiado

### Parte 1 — Proteção

Crie matriz e testes de caracterização.

### Parte 2 — Inventário

Liste smells reais.

### Parte 3 — Contratos

Centralize tipos sem mudar payload.

### Parte 4 — Eventos

Crie factory e payloads específicos.

### Parte 5 — Consumer

Crie router e handlers.

### Parte 6 — Falhas

Crie taxonomia e reason codes.

### Parte 7 — Retry

Extraia policy e backoff.

### Parte 8 — Correlação

Reutilize scope factory.

### Parte 9 — Testes

Crie fixtures e assertions.

### Parte 10 — Evidência

Registre o resultado e revise o diff.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 502 foi preservada;
- baseline foi executada;
- branch limpa foi confirmada;
- plano de refatoração foi criado;
- smells reais foram registrados;
- matriz de preservação foi criada;
- testes de caracterização foram criados;
- topic foi preservado;
- Kafka key foi preservada;
- consumer group foi preservado;
- event types foram preservados;
- event versions foram preservadas;
- headers foram preservados;
- idempotency keys foram preservadas;
- reason codes públicos foram preservados;
- métricas foram preservadas;
- logs foram preservados;
- lifecycle foi preservado;
- tipos de evento foram centralizados;
- metadata comum foi criada;
- envelope foi limitado;
- payload scheduled foi criado;
- payload rescheduled foi criado;
- JSON externo não foi alterado;
- quebra de contrato não foi introduzida;
- ServiceOrderEventFactory foi criada;
- UUID foi centralizado na factory;
- timestamp foi centralizado na factory;
- correlation foi centralizada na factory;
- application service foi simplificado;
- application service manteve regra e transação;
- router de eventos foi criado;
- handler scheduled foi criado;
- handler rescheduled foi criado;
- unknown event foi tratado;
- versão incompatível foi tratada;
- reason codes foram centralizados;
- failure kind foi criado;
- IntegrationFailure foi criado;
- RetryDecision foi criado;
- RetryPolicy foi criada;
- backoff foi extraído;
- Retry-After foi preservado;
- cap foi preservado;
- máximo de tentativas foi preservado;
- duplicate não virou retry;
- permanente não virou retry;
- correlation scope factory foi criada;
- topic, partition e offset foram preservados;
- fixtures determinísticas foram criadas;
- assertions reutilizáveis foram criadas;
- testes longos foram simplificados;
- cobertura crítica não foi removida;
- teste do router foi criado;
- teste da retry policy foi criado;
- teste arquitetural foi criado;
- application não importa KafkaTemplate;
- application não importa RestClient;
- handlers não chamam provider;
- workers dependem de policy;
- `.internal` continua protegido;
- testes foram executados por etapa;
- gate completo foi executado;
- diff foi revisado;
- contratos foram comparados antes e depois;
- resultado da refatoração foi documentado;
- abstrações recusadas foram registradas;
- novo framework genérico não foi criado;
- nova feature não foi adicionada;
- aula ensinável não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 504 está correta.

---

## Commit recomendado

Faça commits pequenos.

Exemplos:

```powershell
git commit -m "refactor(m16): centralizar contratos de eventos"
```

```powershell
git commit -m "refactor(m16): separar handlers de notification"
```

```powershell
git commit -m "refactor(m16): extrair politica de retry"
```

```powershell
git commit -m "test(m16): preservar comportamento das integracoes"
```

Antes do commit final:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/refactoring-integrations `
  docs/diario-de-bordo.md
```

Commit final recomendado:

```powershell
git commit -m "refactor(m16): concluir integracoes"
```

Valide:

```powershell
git log --oneline -10
git status --short
```

Não inclua:

- feature nova;
- mudança silenciosa de contrato;
- token;
- payload real;
- logs;
- banco H2;
- diretório data;
- target;
- testes desabilitados;
- abstração genérica sem uso;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou uma implementação funcional em uma estrutura mais clara e sustentável.

A sequência foi:

```text
baseline;

caracterização;

inventário de smells;

refatorações pequenas;

testes;

diff;

evidência.
```

Você comprovou que:

- refatoração começa por comportamento protegido;
- contrato externo não deve mudar silenciosamente;
- metadata comum pode reduzir repetição;
- payloads específicos preservam o domínio;
- factories simplificam orquestração;
- routers evitam consumers gigantes;
- handlers mantêm regras específicas;
- reason codes formam vocabulário operacional;
- retry policy separa decisão de coordenação;
- backoff precisa ser determinístico;
- correlation scope pode ser reutilizado;
- fixtures melhoram testes;
- abstrações recusadas também são decisões;
- testes verdes antes e depois sustentam a refatoração.

A próxima aula será:

```text
504 - M16.49 - Aula ensinavel integracoes
```

Nela, você irá:

- organizar o módulo para ensinar;
- explicar a jornada completa;
- criar uma narrativa;
- separar conceitos fundamentais;
- selecionar exemplos;
- demonstrar falhas;
- construir diagramas;
- criar perguntas;
- criar exercícios;
- explicar trade-offs;
- preparar uma aula técnica ensinável.

Nenhum roteiro completo da aula ensinável foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Executei a baseline.
- [ ] Criei testes de caracterização.
- [ ] Listei smells reais.
- [ ] Refatorei eventos e handlers.
- [ ] Extraí falhas e retry policy.
- [ ] Reutilizei correlação.
- [ ] Preservei contratos.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### Testes falham depois de centralizar event types

Alguma string pública foi alterada por engano.

### JSON mudou ao criar envelope

O serializer passou a expor metadata e payload aninhados.

### Router não encontra handler

Confirme event type, registro do bean e duplicidade de keys.

### Dois handlers usam o mesmo event type

A construção do mapa deve falhar e revelar o conflito.

### Retry mudou de quantidade

Compare `currentAttempt`, incremento e condição de máximo.

### Retry-After deixou de ser respeitado

A policy pode estar escolhendo o menor delay.

### MDC perdeu partition ou offset

A scope factory não recebeu metadata completa.

### Testes ficaram genéricos demais

Mantenha dados e assertions relevantes no corpo do cenário.

### O diff ficou enorme

Divida em refatorações menores e reverta mudanças não essenciais.

### Surgiu um framework genérico

Remova abstrações sem repetição comprovada.

---

## Perguntas de revisão

1. O que é teste de caracterização?
2. O que é comportamento observável?
3. Por que refatorar em passos pequenos?
4. O JSON pode mudar silenciosamente?
5. Para que serve metadata comum?
6. Por que manter payload específico?
7. O que faz a event factory?
8. O que faz o router?
9. O que faz um handler?
10. O que é failure kind?
11. O que é reason code?
12. O que decide a retry policy?
13. O worker decide backoff?
14. Para que serve scope factory?
15. O que uma fixture melhora?
16. Toda duplicação exige abstração?
17. Métricas podem ser renomeadas livremente?
18. Qual deve ser o estado dos testes depois?
19. Uma nova feature foi adicionada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Congela comportamento atual.
2. Contratos, efeitos e sinais externos.
3. Reduzir risco e localizar regressão.
4. Não.
5. Centralizar identidade e correlação.
6. Preservar tipos de domínio.
7. Construir eventos.
8. Selecionar handler.
9. Processar um tipo específico.
10. Natureza da falha.
11. Identificador operacional.
12. Retry, quarantine ou duplicate.
13. Não; executa a decisão.
14. Padronizar MDC.
15. Clareza e determinismo.
16. Não.
17. Não sem migração.
18. Verdes.
19. Não.
20. Aula ensinavel integracoes.

---

## Desafio opcional

Crie uma refatoração do client HTTP externo.

Objetivo:

```text
separar mapeamento de status
de execução do RestClient.
```

Sugestão:

```text
ProviderHttpResponseClassifier.
```

Requisitos:

- preservar todos os reason codes;
- preservar Retry-After;
- preservar timeout;
- não alterar NotificationProvider;
- criar testes;
- não criar framework HTTP genérico;
- registrar por que a extração foi útil.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 503 - M16.48 - Refatoracao final integracoes

- Continuei após a prova prática de integrações.
- Confirmei a baseline verde.
- Criei um plano de refatoração.
- Listei smells reais.
- Criei matriz de preservação.
- Criei testes de caracterização.
- Preservei topic, key e consumer group.
- Preservei event types e versions.
- Preservei headers e idempotency keys.
- Preservei lifecycle, logs e métricas.
- Centralizei tipos de evento.
- Criei metadata comum.
- Avaliei envelope genérico limitado.
- Mantive payloads específicos.
- Preservei o JSON externo.
- Criei `ServiceOrderEventFactory`.
- Simplifiquei application services.
- Criei router de eventos.
- Separei handlers scheduled e rescheduled.
- Centralizei reason codes.
- Criei failure kinds.
- Criei `IntegrationFailure`.
- Criei `RetryDecision`.
- Extraí `RetryPolicy`.
- Extraí backoff testável.
- Preservei Retry-After e máximo de tentativas.
- Criei correlation scope factory.
- Preservei topic, partition e offset no MDC.
- Criei fixtures determinísticas.
- Criei assertions reutilizáveis.
- Simplifiquei testes longos.
- Criei testes de router e retry policy.
- Criei teste arquitetural pós-refatoração.
- Executei testes a cada etapa.
- Revisei o diff.
- Documentei o resultado.
- Registrei abstrações recusadas.
- Não criei feature nova.
- Próxima aula: Aula ensinavel integracoes.
```

---

## Referência técnica curta

- Refactoring.
- Characterization Tests.
- Ports and Adapters.
- Integration Event Pattern.
- Strategy Pattern.
- Factory Pattern.
- Retry Pattern.
- Exponential Backoff.
- SLF4J MDC.
- Contract Testing.

Regra final:

```text
a refatoração final de integrações melhora a estrutura sem alterar contratos ou garantias: testes de caracterização e a matriz de preservação congelam topic, key, headers, event types, versions, idempotency keys, lifecycle, logs, métricas e efeitos; metadata comum e factories reduzem repetição, enquanto payloads específicos preservam o domínio e o JSON externo permanece compatível; routers e handlers substituem consumers crescentes, reason codes e failure kinds criam uma taxonomia estável, RetryPolicy e backoff separam decisão de coordenação e correlation scope factories padronizam o MDC; fixtures e assertions tornam os testes legíveis sem remover cobertura; cada mudança é pequena, seguida de testes e revisão de diff, e abstrações sem repetição comprovada são recusadas; ao final, o mesmo comportamento permanece demonstrável por uma estrutura mais clara, testável e preparada para ser ensinada.
```
