# 540 - M17.35 - SQS SNS

## Apresentação da aula

Na aula 539, você preparou a arquitetura de persistência relacional com Amazon RDS for PostgreSQL.

O modelo passou a incluir:

```text
rede privada;

Security Group restrito;

credenciais protegidas;

migrations controladas;

connection pool dimensionado;

backup restaurável;

failover observável.
```

A persistência relacional resolve o estado transacional da aplicação.

Entretanto, uma aplicação backend também precisa desacoplar tarefas e distribuir eventos.

Exemplos:

```text
pedido criado;

pagamento confirmado;

estoque reservado;

notificação solicitada;

integração externa pendente;

auditoria publicada.
```

Executar todas essas ações dentro da mesma requisição HTTP aumenta:

- latência;
- acoplamento;
- risco de timeout;
- impacto de falhas externas;
- dificuldade de retry;
- blast radius;
- consumo de recursos.

A pergunta central desta aula será:

```text
como usar
filas e pub/sub
na AWS

para desacoplar
processamento

sem perder
idempotência,
observabilidade
e controle operacional?
```

A resposta será construída com:

```text
Amazon SQS;

Amazon SNS.
```

Amazon SQS oferece filas gerenciadas.

Amazon SNS oferece tópicos de publicação e assinatura.

A regra central será:

```text
SQS distribui trabalho;

SNS distribui eventos;

fan-out combina
tópico e filas;

a aplicação continua
responsável
pela idempotência
e pelo efeito de negócio.
```

Nesta aula, nenhum recurso AWS real será criado.

Não haverá:

- conta AWS;
- access key;
- secret key;
- queue URL real;
- queue ARN real;
- topic ARN real;
- subscription real;
- mensagem enviada à AWS;
- cobrança;
- policy aplicada;
- endpoint externo;
- recurso de produção.

A prática será offline, versionada e verificável.

Você criará:

- blueprint de SQS e SNS;
- contratos de mensagens;
- topologia de fan-out;
- política de retry;
- política de dead-letter;
- contrato de idempotência;
- profile Spring Boot;
- portas de aplicação;
- simulador local;
- scripts de validação;
- evidence sanitizada.

A próxima aula será:

```text
541 - M17.36 - Redis gerenciado conceitual
```

Por isso, nenhum cache Redis gerenciado será implementado antecipadamente.

---

## Onde estamos na formação

A sequência oficial é:

```text
538:
AWS visao backend.

539:
RDS PostgreSQL.

540:
SQS SNS.

541:
Redis gerenciado conceitual.

542:
S3 e CDN.
```

A aula 539 respondeu:

```text
como preparar
PostgreSQL gerenciado
para a aplicação?
```

A aula 540 responderá:

```text
como desacoplar
tarefas e distribuir eventos
com SQS e SNS?
```

Nesta aula:

```text
SQS Standard:
sim.

SQS FIFO:
sim.

SNS Standard:
sim.

SNS FIFO:
conceitual.

queue URL:
sim.

queue ARN:
sim.

topic ARN:
sim.

visibility timeout:
sim.

long polling:
sim.

message retention:
sim.

delivery delay:
sim.

dead-letter queue:
sim.

redrive policy:
sim.

redrive allow policy:
sim.

idempotência:
sim.

deduplicação:
sim.

message group:
sim.

fan-out:
sim.

subscription filter:
sim.

raw message delivery:
sim.

IAM:
sim.

KMS:
sim.

VPC endpoint:
conceitual.

CloudWatch:
sim.

Spring Boot:
sim.

recurso AWS real:
não.

Redis:
não.
```

A regra central será:

```text
mensagem recebida
não significa
efeito concluído;

acknowledgement ocorre
somente após
processamento seguro.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
cloud/aws/messaging
├── sqs-sns-blueprint.yaml
├── sns-fanout-topology.yaml
├── sqs-redrive-policy.yaml
├── messaging-security-policy.yaml
├── messaging-idempotency-contract.yaml
├── messaging-observability-contract.yaml
├── messaging-cost-policy.yaml
├── order-event-contract.json
├── order-event-filter-policy.json
└── messaging-readiness-checklist.yaml

src/main/java/com/formacao/orders/integration/messaging
├── MessagingEnvelope.java
├── OrderEventPublisher.java
├── MessageProcessingDecision.java
├── IdempotencyKey.java
└── InMemoryOrderEventPublisher.java

src/main/resources
└── application-aws-messaging.yml

scripts/cloud/aws/messaging
├── validate-sqs-sns-blueprint.ps1
├── validate-message-contract.ps1
├── validate-redrive-policy.ps1
├── validate-idempotency-contract.ps1
├── simulate-standard-queue.ps1
├── simulate-fifo-queue.ps1
├── simulate-sns-fanout.ps1
├── simulate-poison-message.ps1
├── collect-messaging-evidence.ps1
└── verify-messaging-baseline.ps1

docs/devops/aws-messaging
├── SQS_ARCHITECTURE.md
├── SQS_STANDARD_VS_FIFO.md
├── SNS_FANOUT.md
├── MESSAGE_CONTRACT.md
├── IDEMPOTENCY_AND_DEDUPLICATION.md
├── RETRY_VISIBILITY_DLQ.md
├── MESSAGING_SECURITY.md
├── MESSAGING_OBSERVABILITY.md
├── MESSAGING_TEST_MATRIX.md
└── MESSAGING_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
fila de comandos modelada;

tópico de eventos modelado;

fan-out para filas;

DLQ e redrive;

contrato JSON;

idempotência;

ordenação quando necessária;

Spring profile seguro;

simulações offline;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline local;
2. classificar comandos e eventos;
3. diferenciar fila e tópico;
4. diferenciar Standard e FIFO;
5. criar blueprint;
6. criar topologia de fan-out;
7. criar contrato de mensagem;
8. criar filtro de subscription;
9. criar redrive policy;
10. definir visibility timeout;
11. definir long polling;
12. definir retenção;
13. definir idempotência;
14. definir deduplicação;
15. definir message group;
16. criar portas Java;
17. criar publisher local;
18. criar profile AWS;
19. simular duplicidade;
20. simular reordenação;
21. simular poison message;
22. simular fan-out;
23. validar segurança;
24. validar observabilidade;
25. criar scripts;
26. criar documentação;
27. coletar evidence;
28. executar gate;
29. commitar;
30. preparar a aula 541.

---

## Conceito essencial

### Queue

Estrutura de trabalho assíncrono consumida por um ou mais workers.

---

### Topic

Canal de publicação que distribui mensagens para subscriptions.

---

### Producer

Componente que envia uma mensagem.

---

### Consumer

Componente que recebe e processa uma mensagem.

---

### Subscription

Ligação entre um tópico e um destino.

---

### Fan-out

Distribuição de um evento para múltiplos destinos independentes.

---

### Visibility timeout

Período em que uma mensagem recebida fica temporariamente invisível para outros consumers.

---

### Long polling

Espera controlada por mensagens antes de retornar uma resposta vazia.

---

### Dead-letter queue

Fila que recebe mensagens que excederam a política de tentativas.

---

### Redrive policy

Regra que define a DLQ e o número máximo de recebimentos.

---

### Idempotência

Capacidade de repetir o mesmo processamento sem duplicar o efeito de negócio.

---

### Deduplicação

Mecanismo para reconhecer mensagens repetidas dentro de um contexto definido.

---

### Message group

Chave usada em filas FIFO para ordenar mensagens relacionadas.

---

### Standard queue

Fila de alto throughput com entrega pelo menos uma vez e ordenação best-effort.

---

### FIFO queue

Fila voltada a ordenação por grupo e deduplicação controlada.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- aplicação disponível;
- HPA ativo;
- RDS apenas modelado;
- nenhuma dependência AWS real;
- Git limpo antes da aula.

---

### 2. Classificar mensagens

Antes de escolher SQS ou SNS, classifique o significado.

#### Command

Solicita que uma responsabilidade execute uma ação.

Exemplo:

```text
GenerateInvoice.
```

Normalmente possui um responsável principal.

#### Event

Informa que algo aconteceu.

Exemplo:

```text
OrderCreated.
```

Pode possuir múltiplos interessados.

A policy será:

```text
command:
fila específica.

event:
tópico
com fan-out
para filas específicas.
```

---

### 3. Diferenciar SQS e SNS

Use SQS quando:

- uma unidade de trabalho precisa ser processada;
- consumers competem pela mensagem;
- processamento precisa sobreviver a indisponibilidade temporária;
- retry e DLQ são necessários;
- o producer não precisa conhecer o worker.

Use SNS quando:

- um evento precisa alcançar múltiplos destinos;
- cada subscriber possui responsabilidade independente;
- filtros podem reduzir mensagens entregues;
- fan-out é necessário.

Um tópico SNS não substitui uma fila de trabalho.

A combinação comum será:

```text
producer
→ SNS topic
→ SQS queue A
→ consumer A.

            └→ SQS queue B
              → consumer B.
```

---

### 4. Criar o blueprint

Arquivo:

```text
cloud/aws/messaging/sqs-sns-blueprint.yaml
```

Conteúdo:

```yaml
messaging:
  commands:
    generateInvoice:
      service:
        SQS

      queueType:
        Standard

      consumer:
        invoice-worker

      deadLetterQueue:
        required

  events:
    orderCreated:
      service:
        SNS

      topicType:
        Standard

      subscriptions:
        - destination:
            SQS

          purpose:
            inventory

        - destination:
            SQS

          purpose:
            notification

        - destination:
            SQS

          purpose:
            analytics

  security:
    publicAccess:
      forbidden

    encryption:
      required

    leastPrivilege:
      required

  evidence:
    realResources:
      zero
```

---

### 5. Criar a topologia de fan-out

Arquivo:

```text
sns-fanout-topology.yaml
```

Conteúdo:

```yaml
fanout:
  topic:
    logicalName:
      order-events

    arn:
      fromEnvironment:
        true

  subscriptions:
    - logicalQueue:
        inventory-order-events

      filter:
        eventType:
          - OrderCreated
          - OrderCancelled

    - logicalQueue:
        notification-order-events

      filter:
        eventType:
          - OrderCreated
          - OrderDelivered

    - logicalQueue:
        analytics-order-events

      filter:
        eventType:
          - OrderCreated
          - OrderCancelled
          - OrderDelivered

  directApplicationSubscription:
    forbidden:
      true
```

A aplicação consumirá de SQS.

Ela não ficará dependente de entrega HTTP direta do SNS.

---

### 6. Criar o contrato JSON

Arquivo:

```text
order-event-contract.json
```

Conteúdo:

```json
{
  "schemaVersion": "1",
  "eventId": "00000000-0000-0000-0000-000000000000",
  "eventType": "OrderCreated",
  "occurredAt": "2026-01-01T00:00:00Z",
  "aggregateType": "Order",
  "aggregateId": "order-example",
  "correlationId": "correlation-example",
  "causationId": "causation-example",
  "producer": "orders-api",
  "environment": "dev",
  "payload": {
    "orderId": "order-example",
    "customerId": "customer-example",
    "total": 100.00,
    "currency": "BRL"
  }
}
```

Todos os valores são fictícios.

Nenhum dado pessoal real deve ser usado.

---

### 7. Definir regras do envelope

Campos obrigatórios:

- `schemaVersion`;
- `eventId`;
- `eventType`;
- `occurredAt`;
- `aggregateType`;
- `aggregateId`;
- `correlationId`;
- `producer`;
- `environment`;
- `payload`.

Regras:

```text
eventId:
imutável e único.

eventType:
nome de negócio.

schemaVersion:
explícita.

occurredAt:
UTC.

payload:
mínimo necessário.

correlationId:
propagado.

Secret:
proibido.

dado pessoal:
mínimo e classificado.
```

---

### 8. Criar filtro de subscription

Arquivo:

```text
order-event-filter-policy.json
```

Conteúdo:

```json
{
  "eventType": [
    "OrderCreated",
    "OrderCancelled"
  ],
  "environment": [
    "dev"
  ]
}
```

A filter policy opera sobre atributos de mensagem quando essa estratégia é adotada.

Não dependa de parsing profundo do payload quando atributos explícitos resolvem o roteamento.

---

### 9. Standard queue

Use Standard quando:

- ordenação estrita não é requisito;
- duplicidade pode ocorrer;
- throughput e elasticidade são prioritários;
- o consumer é idempotente.

A aplicação deve assumir:

```text
a mesma mensagem
pode chegar
mais de uma vez.
```

Também deve tolerar reordenação.

Exemplo:

```text
OrderUpdated
pode ser observado
antes de outro evento
atrasado.
```

Quando ordem importa, use versão, timestamp de negócio ou uma estratégia FIFO adequada.

---

### 10. FIFO queue

Use FIFO quando:

- ordenação por grupo é requisito;
- mensagens relacionadas precisam manter sequência;
- deduplicação gerenciada é útil;
- o throughput e a topologia são compatíveis.

Campos importantes:

```text
MessageGroupId;

MessageDeduplicationId.
```

Exemplo:

```text
MessageGroupId:
order-123.
```

Mensagens do mesmo pedido permanecem no mesmo grupo lógico.

Não use um único group para todo o sistema sem necessidade.

Isso serializa trabalho demais.

Mesmo em FIFO, os efeitos externos do consumer precisam de idempotência.

A deduplicação da fila não conhece:

- transação do banco;
- chamada ao parceiro;
- email enviado;
- pagamento capturado;
- arquivo gravado.

---

### 11. Definir idempotency key

A key recomendada será:

```text
eventId
+
consumerName.
```

Exemplo conceitual:

```text
OrderCreated:
event-abc:
inventory-consumer.
```

Cada consumer possui seu próprio efeito.

O inventory consumer e o notification consumer não compartilham o mesmo registro de conclusão.

---

### 12. Criar contrato de idempotência

Arquivo:

```text
messaging-idempotency-contract.yaml
```

Conteúdo:

```yaml
idempotency:
  key:
    fields:
      - eventId
      - consumerName

  storage:
    durable:
      required

  states:
    - RECEIVED
    - PROCESSING
    - SUCCEEDED
    - RETRYABLE_FAILURE
    - TERMINAL_FAILURE

  duplicate:
    whenSucceeded:
      acknowledgeWithoutReprocessing

  transaction:
    businessEffectAndIdempotency:
      atomicWhenPossible

  retention:
    greaterThanMessageReplayWindow:
      required
```

O storage durável poderá ser PostgreSQL.

Redis será estudado na próxima aula, mas não será adotado antecipadamente como única fonte de idempotência.

---

### 13. Visibility timeout

Ao receber uma mensagem, ela fica invisível por um período.

O consumer deve concluir antes do timeout ou estender a visibilidade quando o processamento controlado exige mais tempo.

Se o timeout for curto demais:

```text
a mensagem reaparece
enquanto o primeiro consumer
ainda trabalha.
```

Se for longo demais:

```text
uma falha demora
para liberar retry.
```

A policy exige:

```text
visibility timeout
>
pior duração normal
do processamento
+
margem.
```

Não use visibility timeout para esconder processamento indefinido.

---

### 14. Long polling

Long polling reduz respostas vazias e chamadas desnecessárias.

O consumer aguarda por mensagens durante uma janela controlada.

A policy exige:

- wait time configurado;
- timeout HTTP maior que a espera;
- cancellation;
- shutdown gracioso;
- métricas de empty receive;
- nenhuma espera infinita.

---

### 15. Retenção e delay

#### Message retention

Define por quanto tempo uma mensagem não processada permanece disponível.

#### Delivery delay

Adia a primeira disponibilidade da mensagem.

Delay não substitui scheduler de negócio complexo.

A retenção precisa considerar:

- tempo de incidente;
- capacidade de recuperação;
- DLQ;
- replay;
- custo;
- compliance.

---

### 16. Criar redrive policy

Arquivo:

```text
sqs-redrive-policy.yaml
```

Conteúdo:

```yaml
redrive:
  sourceQueue:
    logicalName:
      inventory-order-events

  deadLetterQueue:
    logicalName:
      inventory-order-events-dlq

  maxReceiveCount:
    5

  redriveAllowPolicy:
    sourceQueues:
      - inventory-order-events

  replay:
    manualApproval:
      required

    rootCauseResolved:
      required

    batchLimited:
      true

    observability:
      required
```

O valor `5` é didático.

Ele deve ser validado conforme o custo e o tempo de processamento.

---

### 17. Poison message

Poison message falha repetidamente por causa do conteúdo, schema ou regra de negócio.

Exemplos:

- campo obrigatório ausente;
- schema incompatível;
- valor impossível;
- referência inexistente permanente;
- payload corrompido.

Retry infinito não corrige erro terminal.

A decisão precisa classificar:

```text
retryable;

terminal;

duplicate;

success.
```

---

### 18. Criar enum de decisão

Arquivo:

```text
MessageProcessingDecision.java
```

Conteúdo:

```java
package com.formacao.orders.integration.messaging;

public enum MessageProcessingDecision {
    SUCCESS,
    DUPLICATE,
    RETRYABLE_FAILURE,
    TERMINAL_FAILURE
}
```

Essa decisão será registrada por consumer.

---

### 19. Criar o envelope Java

Arquivo:

```text
MessagingEnvelope.java
```

Conteúdo:

```java
package com.formacao.orders.integration.messaging;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public record MessagingEnvelope(
        String schemaVersion,
        UUID eventId,
        String eventType,
        Instant occurredAt,
        String aggregateType,
        String aggregateId,
        String correlationId,
        String causationId,
        String producer,
        String environment,
        Map<String, Object> payload
) {
    public MessagingEnvelope {
        schemaVersion = requireText(schemaVersion, "schemaVersion");
        eventId = Objects.requireNonNull(eventId, "eventId");
        eventType = requireText(eventType, "eventType");
        occurredAt = Objects.requireNonNull(occurredAt, "occurredAt");
        aggregateType = requireText(aggregateType, "aggregateType");
        aggregateId = requireText(aggregateId, "aggregateId");
        correlationId = requireText(correlationId, "correlationId");
        producer = requireText(producer, "producer");
        environment = requireText(environment, "environment");
        payload = Map.copyOf(Objects.requireNonNull(payload, "payload"));
    }

    private static String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
        return value;
    }
}
```

O record não conhece AWS.

Ele representa o contrato de negócio.

---

### 20. Criar a porta de publicação

Arquivo:

```text
OrderEventPublisher.java
```

Conteúdo:

```java
package com.formacao.orders.integration.messaging;

public interface OrderEventPublisher {

    void publish(MessagingEnvelope envelope);
}
```

A aplicação depende da porta.

O adapter AWS futuro dependerá do SDK.

---

### 21. Criar a idempotency key

Arquivo:

```text
IdempotencyKey.java
```

Conteúdo:

```java
package com.formacao.orders.integration.messaging;

import java.util.Objects;
import java.util.UUID;

public record IdempotencyKey(
        UUID eventId,
        String consumerName
) {
    public IdempotencyKey {
        eventId = Objects.requireNonNull(eventId, "eventId");

        if (consumerName == null || consumerName.isBlank()) {
            throw new IllegalArgumentException("consumerName is required");
        }
    }

    public String asStorageKey() {
        return eventId + ":" + consumerName;
    }
}
```

---

### 22. Criar publisher local

Arquivo:

```text
InMemoryOrderEventPublisher.java
```

Conteúdo:

```java
package com.formacao.orders.integration.messaging;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public final class InMemoryOrderEventPublisher
        implements OrderEventPublisher {

    private final List<MessagingEnvelope> published =
            new ArrayList<>();

    @Override
    public synchronized void publish(
            MessagingEnvelope envelope
    ) {
        published.add(
                Objects.requireNonNull(
                        envelope,
                        "envelope"
                )
        );
    }

    public synchronized List<MessagingEnvelope> published() {
        return List.copyOf(published);
    }
}
```

Esse adapter permite testes sem AWS.

---

### 23. Criar profile Spring Boot

Arquivo:

```text
application-aws-messaging.yml
```

Conteúdo:

```yaml
app:
  messaging:
    enabled: ${AWS_MESSAGING_ENABLED:false}

    region: ${AWS_REGION:}

    sns:
      order-events-topic-arn: ${ORDER_EVENTS_TOPIC_ARN:}

    sqs:
      inventory-queue-url: ${INVENTORY_QUEUE_URL:}
      notification-queue-url: ${NOTIFICATION_QUEUE_URL:}

      long-poll-seconds: ${SQS_LONG_POLL_SECONDS:10}
      visibility-timeout-seconds: ${SQS_VISIBILITY_TIMEOUT_SECONDS:60}
      max-concurrent-messages: ${SQS_MAX_CONCURRENT_MESSAGES:4}

    consumer:
      shutdown-timeout-seconds: ${SQS_SHUTDOWN_TIMEOUT_SECONDS:30}

      idempotency:
        required: true
```

O profile fica desabilitado por padrão.

Nenhum ARN ou URL possui default real.

---

### 24. IAM do publisher

O publisher precisa apenas das actions necessárias para publicar no tópico esperado.

O contrato proíbe:

```text
sns:*;

Resource: *.
```

A policy deve limitar:

- action;
- topic;
- environment;
- role;
- conditions quando aplicáveis.

---

### 25. IAM do consumer

O consumer precisa de ações compatíveis com:

- receber;
- deletar após sucesso;
- alterar visibilidade quando aprovado;
- consultar atributos mínimos.

Ele não precisa:

- criar fila;
- deletar fila;
- alterar policy;
- listar todas as filas;
- administrar SNS;
- ler Secrets arbitrários.

---

### 26. Policy entre SNS e SQS

A queue policy precisa permitir que o tópico autorizado envie mensagens.

A regra deve restringir a origem pelo ARN do tópico.

Não use policy pública.

O source topic e a queue precisam seguir a topologia aprovada.

---

### 27. Encryption

SQS e SNS podem utilizar criptografia gerenciada.

Quando uma chave KMS controlada é usada, IAM e key policy precisam permitir as operações necessárias ao serviço e aos principals autorizados.

A aplicação não recebe permissão administrativa sobre a chave.

A policy registrará:

- key ownership;
- aliases conceituais;
- rotation;
- service access;
- audit;
- environment separation.

---

### 28. VPC endpoints

Quando a arquitetura exige tráfego privado para serviços AWS, VPC endpoints podem ser avaliados.

Eles podem reduzir dependência de rota pública e NAT.

A decisão precisa considerar:

- serviço suportado;
- DNS privado;
- endpoint policy;
- Security Groups;
- custo;
- disponibilidade;
- observabilidade.

Nenhum endpoint será criado nesta aula.

---

### 29. SNS filter policy

Filter policy reduz entregas que o subscriber não precisa receber.

Ela não deve substituir autorização.

Um subscriber autorizado continua precisando de:

- IAM;
- queue policy;
- schema validation;
- idempotência.

Filtros precisam de testes.

Um filtro incorreto pode silenciar eventos necessários.

---

### 30. Raw message delivery

Quando SNS entrega para SQS, a mensagem pode incluir um envelope SNS ou utilizar raw message delivery conforme a configuração.

A escolha afeta:

- parsing;
- atributos;
- assinatura;
- compatibilidade;
- contrato do consumer.

A policy precisa escolher explicitamente uma forma.

Nesta baseline, o consumer espera um envelope de negócio controlado e metadata explícita.

---

### 31. Payload grande

Mensagens não devem transportar documentos grandes ou binários.

O padrão recomendado será:

```text
payload pequeno
+
referência segura
para object storage.
```

A referência precisa ter:

- autorização;
- expiração;
- integridade;
- lifecycle;
- encryption.

S3 será aprofundado em aula futura.

Nenhum bucket será criado aqui.

---

### 32. Transactional outbox

Existe um problema clássico:

```text
transação do banco
confirma;

publicação do evento
falha.
```

Ou o inverso:

```text
evento é publicado;

transação do banco
faz rollback.
```

O padrão transactional outbox registra o evento na mesma transação do dado de negócio.

Um processo separado publica o evento e marca o outbox como concluído.

Nesta aula, o padrão será documentado e modelado.

Não será implementado por completo para não antecipar mudanças de schema sem a aula específica.

---

### 33. Criar policy de segurança

Arquivo:

```text
messaging-security-policy.yaml
```

Conteúdo:

```yaml
security:
  publicAccess:
    forbidden

  staticAccessKey:
    forbidden

  workloadRole:
    required

  wildcardActions:
    forbidden

  wildcardResources:
    forbidden

  encryption:
    required

  queuePolicy:
    sourceTopicRestricted:
      required

  payload:
    secrets:
      forbidden

    personalData:
      minimumRequired
```

---

### 34. Criar observability contract

Arquivo:

```text
messaging-observability-contract.yaml
```

Inclua:

```yaml
observability:
  queue:
    - approximate-visible-messages
    - approximate-not-visible-messages
    - age-of-oldest-message
    - messages-received
    - messages-deleted
    - empty-receives

  deadLetter:
    - visible-messages
    - age-of-oldest-message

  consumer:
    - processing-duration
    - success-count
    - duplicate-count
    - retryable-failure-count
    - terminal-failure-count
    - idempotency-conflict-count

  tracing:
    correlationId:
      required

  alarms:
    actionable:
      required
```

---

### 35. Criar cost policy

Arquivo:

```text
messaging-cost-policy.yaml
```

Inclua:

- requests;
- payload size;
- empty receives;
- retention;
- KMS usage;
- data transfer;
- DLQ growth;
- subscriptions;
- logs;
- alarms;
- owner;
- budget;
- cost per processed order.

Long polling e batch podem reduzir chamadas.

Não aumente batch sem avaliar latência, visibility timeout e falhas parciais.

---

### 36. Simular Standard queue

Execute:

```powershell
.\scripts\cloud\aws\messaging\simulate-standard-queue.ps1
```

A simulação deve:

1. gerar mensagens;
2. duplicar uma mensagem;
3. alterar a ordem de duas;
4. processar com idempotency key;
5. confirmar um único efeito;
6. registrar duplicate count;
7. finalizar sem AWS.

---

### 37. Simular FIFO queue

Execute:

```powershell
.\scripts\cloud\aws\messaging\simulate-fifo-queue.ps1
```

A simulação deve:

- usar dois message groups;
- preservar ordem dentro de cada group;
- permitir processamento independente entre groups;
- duplicar um deduplication ID;
- comprovar que o consumer continua idempotente.

---

### 38. Simular SNS fan-out

Execute:

```powershell
.\scripts\cloud\aws\messaging\simulate-sns-fanout.ps1
```

O evento:

```text
OrderCreated
```

deve ser entregue logicamente para:

- inventory;
- notification;
- analytics.

Cada consumer possui:

- idempotency key própria;
- fila própria;
- retry próprio;
- DLQ própria;
- observabilidade própria.

Uma falha em notification não bloqueia inventory.

---

### 39. Simular poison message

Execute:

```powershell
.\scripts\cloud\aws\messaging\simulate-poison-message.ps1
```

A simulação deve:

1. receber payload inválido;
2. classificar falha terminal;
3. não repetir indefinidamente;
4. mover logicamente para DLQ;
5. registrar motivo sanitizado;
6. exigir aprovação para replay;
7. impedir replay antes da correção.

---

### 40. Criar readiness checklist

Arquivo:

```text
messaging-readiness-checklist.yaml
```

Itens:

```yaml
readiness:
  contractVersioned:
    required

  idempotency:
    required

  deadLetterQueue:
    required

  visibilityTimeout:
    reviewed

  longPolling:
    enabled

  retry:
    bounded

  poisonMessage:
    classified

  encryption:
    required

  leastPrivilege:
    required

  alarms:
    required

  replayRunbook:
    required

  realResources:
    zero
```

---

### 41. Criar documentação

#### `SQS_ARCHITECTURE.md`

Explique receive, visibility, delete e retry.

#### `SQS_STANDARD_VS_FIFO.md`

Explique delivery, ordering, groups e deduplication.

#### `SNS_FANOUT.md`

Explique topics, subscriptions, filters e filas.

#### `MESSAGE_CONTRACT.md`

Explique versionamento e envelope.

#### `IDEMPOTENCY_AND_DEDUPLICATION.md`

Explique efeitos de negócio e storage durável.

#### `RETRY_VISIBILITY_DLQ.md`

Explique falhas retryable, terminal e replay.

#### `MESSAGING_SECURITY.md`

Explique IAM, policies, KMS e private access.

#### `MESSAGING_OBSERVABILITY.md`

Explique métricas, alarms, correlation e custos.

---

### 42. Criar test matrix

Arquivo:

```text
MESSAGING_TEST_MATRIX.md
```

Cenários:

- Standard aceita duplicidade;
- Standard tolera reordenação;
- FIFO preserva ordem por group;
- groups diferentes processam independentemente;
- duplicate event não repete efeito;
- visibility timeout curto é detectado;
- long polling configurado;
- falha retryable retorna à fila;
- falha terminal vai para DLQ;
- replay sem aprovação é bloqueado;
- SNS fan-out entrega para três filas;
- filter policy reduz eventos;
- queue policy pública é bloqueada;
- wildcard IAM é bloqueado;
- Secret no payload é bloqueado;
- correlation ID é propagado;
- real resource count permanece zero.

---

### 43. Criar troubleshooting

Arquivo:

```text
MESSAGING_TROUBLESHOOTING.md
```

Inclua:

- access denied;
- queue URL incorreta;
- topic ARN incorreto;
- queue policy bloqueando SNS;
- KMS denied;
- mensagem reaparecendo cedo;
- consumer lento;
- duplicate effect;
- order incorreta;
- message group inadequado;
- DLQ crescendo;
- replay repetindo falha;
- filter policy silenciosa;
- payload incompatível;
- empty receives altos;
- shutdown interrompendo processamento;
- correlation ID ausente;
- poison message em loop.

---

### 44. Executar gate final

Execute:

```powershell
.\scripts\cloud\aws\messaging\validate-sqs-sns-blueprint.ps1

.\scripts\cloud\aws\messaging\validate-message-contract.ps1

.\scripts\cloud\aws\messaging\validate-redrive-policy.ps1

.\scripts\cloud\aws\messaging\validate-idempotency-contract.ps1

.\scripts\cloud\aws\messaging\simulate-standard-queue.ps1

.\scripts\cloud\aws\messaging\simulate-fifo-queue.ps1

.\scripts\cloud\aws\messaging\simulate-sns-fanout.ps1

.\scripts\cloud\aws\messaging\simulate-poison-message.ps1

.\scripts\cloud\aws\messaging\collect-messaging-evidence.ps1

.\scripts\cloud\aws\messaging\verify-messaging-baseline.ps1
```

Finalize:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme:

- aplicação local saudável;
- nenhum login AWS;
- nenhum ARN ou URL real;
- nenhum Secret;
- nenhum recurso criado;
- nenhuma fila ativa;
- nenhum tópico ativo;
- nenhuma antecipação de Redis.

---

## Entendendo o que foi feito

### Fila e tópico ganharam responsabilidades diferentes

SQS distribui trabalho.

SNS distribui eventos.

### Fan-out ficou desacoplado

Inventory, notification e analytics receberam filas independentes.

### Standard ganhou contrato realista

Duplicidade e reordenação deixaram de ser exceções inesperadas.

### FIFO ganhou limite correto

Ordenação por group não substituiu idempotência de negócio.

### Visibility timeout ganhou relação com processamento

A mensagem só permanece invisível durante um período controlado.

### DLQ ganhou runbook

Falha terminal não ficou em retry infinito.

### Envelope ganhou versionamento

Producer e consumers passaram a compartilhar um contrato explícito.

### Spring Boot ganhou profile seguro

ARNs e URLs vêm de runtime e o adapter fica desabilitado por padrão.

### Segurança ganhou least privilege

Publisher, consumer, tópico, fila e chave possuem permissões separadas.

### Observabilidade ganhou métricas de fila e aplicação

Backlog, idade, DLQ, duplicidade e duração passaram a ser sinais operacionais.

---

## Erros comuns importantes

### Tratar SQS como exactly-once de negócio

O consumer continua responsável pela idempotência dos efeitos.

### Deletar a mensagem antes do commit

A unidade de trabalho pode ser perdida.

### Usar visibility timeout curto

A mesma mensagem pode ser processada em paralelo.

### Usar visibility timeout enorme

A recuperação de falha fica lenta.

### Fazer retry infinito de erro terminal

Poison messages precisam de DLQ.

### Reutilizar uma DLQ para tudo

Owner, schema e replay ficam confusos.

### Usar um único FIFO group global

O throughput fica serializado sem necessidade.

### Publicar Secret no payload

Mensagens não são cofre.

### Dar `sqs:*` e `sns:*`

Use actions e resources mínimos.

### Assinar a aplicação diretamente por HTTP sem necessidade

Fila intermediária melhora resiliência e controle.

### Antecipar Redis

A aula 541 possui esse objetivo.

---

## Comandos úteis

### Validar blueprint

```powershell
.\scripts\cloud\aws\messaging\validate-sqs-sns-blueprint.ps1
```

### Validar contrato

```powershell
.\scripts\cloud\aws\messaging\validate-message-contract.ps1
```

### Simular Standard

```powershell
.\scripts\cloud\aws\messaging\simulate-standard-queue.ps1
```

### Simular FIFO

```powershell
.\scripts\cloud\aws\messaging\simulate-fifo-queue.ps1
```

### Simular fan-out

```powershell
.\scripts\cloud\aws\messaging\simulate-sns-fanout.ps1
```

---

## Exercício guiado

### Parte 1 — Semântica

Classifique commands e events.

### Parte 2 — Blueprint

Modele SQS, SNS e subscriptions.

### Parte 3 — Contract

Crie envelope versionado.

### Parte 4 — Standard

Teste duplicidade e reordenação.

### Parte 5 — FIFO

Teste groups e deduplication.

### Parte 6 — Idempotency

Proteja o efeito de negócio.

### Parte 7 — Retry

Defina visibility, max receives e DLQ.

### Parte 8 — Fan-out

Distribua para consumers independentes.

### Parte 9 — Security

Defina IAM, queue policy e encryption.

### Parte 10 — Evidence

Comprove readiness sem AWS real.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 539 foi preservada;
- ponte para a aula 541 está correta;
- SQS e SNS foram definidos;
- queue e topic foram diferenciados;
- command e event foram diferenciados;
- producer, consumer e subscription foram definidos;
- fan-out foi explicado;
- Standard e FIFO foram diferenciadas;
- entrega pelo menos uma vez foi tratada;
- ordenação best-effort foi tratada;
- message group foi definido;
- deduplication ID foi definido;
- idempotência permaneceu obrigatória;
- visibility timeout foi relacionado à duração do processamento;
- long polling foi definido;
- retention e delay foram definidos;
- DLQ e redrive foram definidos;
- poison message foi classificada;
- retryable e terminal failure foram diferenciadas;
- replay exige correção e aprovação;
- blueprint foi criado;
- fan-out topology foi criada;
- contrato JSON foi criado;
- filter policy foi criada;
- redrive policy foi criada;
- contrato de idempotência foi criado;
- enum de decisão foi criado;
- envelope Java foi criado;
- porta de publicação foi criada;
- idempotency key foi criada;
- publisher em memória foi criado;
- profile Spring Boot foi criado;
- profile fica desabilitado por padrão;
- nenhum ARN ou URL real possui default;
- publisher IAM foi limitado;
- consumer IAM foi limitado;
- wildcard IAM foi proibido;
- queue policy pública foi proibida;
- origem SNS foi restringida;
- encryption foi exigida;
- KMS foi considerado;
- VPC endpoint foi explicado sem implementação;
- raw message delivery foi tratado;
- payload grande foi direcionado para object storage por referência;
- transactional outbox foi explicado;
- observability contract foi criado;
- cost policy foi criada;
- Standard queue foi simulada;
- duplicidade foi simulada;
- reordenação foi simulada;
- efeito duplicado foi evitado;
- FIFO queue foi simulada;
- dois message groups foram usados;
- ordem por group foi preservada;
- fan-out foi simulado;
- falha em um subscriber não bloqueou os demais;
- poison message foi simulada;
- retry infinito foi impedido;
- readiness checklist foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- evidence foi sanitizada;
- nenhum access key, Secret, ARN, URL ou recurso real foi criado;
- Redis não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/aws/messaging `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/com/formacao/orders/integration/messaging `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-aws-messaging.yml `
  scripts/cloud/aws/messaging `
  docs/devops/aws-messaging `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "AKIA|ASIA|arn:aws:|amazonaws.com|access.key|secret.key|queue-url: http"
```

Referências conceituais são permitidas.

Credenciais, ARNs, URLs e endpoints reais não são.

Commit recomendado:

```powershell
git commit -m "feat(m17): modelar integracao SQS SNS"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access key;
- secret key;
- session token;
- ARN real;
- queue URL real;
- endpoint real;
- mensagem real;
- payload pessoal;
- Secret;
- Redis da aula 541.

---

## Fechamento e ponte para a próxima aula

Nesta aula, mensageria deixou de ser tratada como apenas enviar JSON para um serviço externo.

O modelo passou a possuir:

```text
commands;

events;

queues;

topics;

subscriptions;

fan-out;

visibility;

retry;

DLQ;

idempotência;

segurança;

observabilidade.
```

Você comprovou que SQS distribui trabalho, SNS distribui eventos, Standard exige tolerância a duplicidade e reordenação, FIFO preserva ordem por group sem eliminar idempotência, visibility timeout precisa acompanhar a duração do processamento, retry terminal deve terminar em DLQ, replay precisa de correção e aprovação, fan-out desacopla consumers, e IAM, queue policies, KMS e métricas fazem parte do desenho.

A próxima aula será:

```text
541 - M17.36 - Redis gerenciado conceitual
```

Nela, você irá estudar cache distribuído, TTL, eviction, invalidation, cache-aside, stampede, locks, sessões, idempotência e operação de Redis gerenciado.

Nenhum cluster Redis, endpoint, senha, cache, lock distribuído ou serviço gerenciado de Redis foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei SQS e SNS.
- [ ] Modelei Standard e FIFO.
- [ ] Criei contrato de mensagem.
- [ ] Defini idempotência.
- [ ] Modelei visibility, retry e DLQ.
- [ ] Simulei fan-out e poison message.
- [ ] Gerei evidence sanitizada.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A mensagem reaparece enquanto o consumer trabalha

Revise visibility timeout e duração real.

### O mesmo efeito ocorreu duas vezes

Revise idempotency key, transação e acknowledgement.

### A DLQ cresce

Classifique schema, dependência, credencial, timeout e poison messages.

### O SNS não entrega na fila

Revise subscription, queue policy, source topic e encryption.

### A FIFO perdeu throughput

Revise distribuição de message groups.

### O filtro não entrega eventos

Revise atributos, tipos e policy.

### O consumer demora a desligar

Revise cancellation, long polling e shutdown timeout.

### O replay falha novamente

A causa raiz não foi corrigida ou o lote foi grande demais.

### O payload contém Secret

Remova, rotacione e revise o contrato.

### Redis apareceu nesta aula

Remova e preserve para a aula 541.

---

## Perguntas de revisão

1. O que é SQS?
2. O que é SNS?
3. Qual a diferença entre queue e topic?
4. O que é fan-out?
5. Qual a diferença entre Standard e FIFO?
6. O que é visibility timeout?
7. O que é long polling?
8. O que é DLQ?
9. O que é redrive policy?
10. O que é poison message?
11. Por que idempotência é necessária?
12. O que é MessageGroupId?
13. O que é MessageDeduplicationId?
14. Para que serve filter policy?
15. Quando deletar a mensagem?
16. O que fazer com payload grande?
17. O que é transactional outbox?
18. Quais métricas observar?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fila gerenciada.
2. Pub/sub gerenciado.
3. Trabalho e distribuição.
4. Um evento para vários destinos.
5. Escala livre e ordem por grupo.
6. Invisibilidade temporária.
7. Espera por mensagens.
8. Fila de falhas.
9. Regra de envio à DLQ.
10. Mensagem que falha sempre.
11. Entrega pode repetir.
12. Grupo ordenado.
13. Identificador de deduplicação.
14. Reduzir entregas.
15. Após efeito seguro.
16. Referenciar object storage.
17. Publicação derivada da transação.
18. Backlog, idade, DLQ e duração.
19. Recursos AWS e Redis.
20. Redis gerenciado conceitual.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 540 - M17.35 - SQS SNS

- Continuei após RDS PostgreSQL.
- Diferenciei commands e events.
- Defini SQS como fila de trabalho.
- Defini SNS como tópico pub/sub.
- Modelei fan-out de SNS para filas SQS.
- Diferenciei Standard e FIFO.
- Tratei duplicidade e ordenação best-effort.
- Modelei MessageGroupId e MessageDeduplicationId.
- Mantive idempotência obrigatória para efeitos de negócio.
- Defini visibility timeout e long polling.
- Modelei retention, delay, retry e dead-letter queue.
- Criei redrive policy e replay controlado.
- Classifiquei falhas retryable e terminal.
- Modelei poison messages.
- Criei envelope versionado com correlation ID.
- Criei filter policy de subscription.
- Criei interfaces Java independentes de AWS.
- Criei publisher em memória para testes locais.
- Criei profile `application-aws-messaging.yml`.
- Mantive ARNs e URLs sem defaults reais.
- Modelei least privilege para publisher e consumer.
- Restringi queue policy ao tópico autorizado.
- Modelei encryption e KMS.
- Modelei VPC endpoints conceitualmente.
- Estudei raw message delivery.
- Modelei payload grande por referência a object storage.
- Estudei transactional outbox.
- Simulei Standard, FIFO, fan-out e poison message.
- Criei observability contract, cost policy e test matrix.
- Não criei fila, tópico, subscription ou credencial AWS.
- Não antecipei Redis gerenciado.
- Próxima aula: Redis gerenciado conceitual.
```

---

## Referência técnica curta

- Amazon Simple Queue Service.
- Amazon Simple Notification Service.
- Amazon SQS Standard Queues.
- Amazon SQS FIFO Queues.
- Amazon SQS Visibility Timeout.
- Amazon SQS Dead-Letter Queues.
- Amazon SNS Message Filtering.
- AWS IAM for SQS and SNS.
- AWS KMS Encryption for Messaging.
- Idempotent Consumer Pattern.

Regra final:

```text
SQS e SNS resolvem responsabilidades diferentes: filas distribuem trabalho entre consumers e tópicos distribuem eventos para subscriptions, sendo comum usar SNS fan-out para filas SQS independentes; Standard queues oferecem entrega pelo menos uma vez e ordenação best-effort, enquanto FIFO organiza ordem por MessageGroupId e deduplicação por identificador, sem eliminar a necessidade de idempotência dos efeitos de negócio; visibility timeout protege o processamento em andamento, long polling reduz chamadas vazias, e acknowledgement só ocorre depois do commit seguro; falhas retryable retornam à fila, falhas terminais seguem para DLQ após redrive controlado, e replay exige causa corrigida, lote limitado e observabilidade; contratos versionados, correlation ID, filter policies, queue policies restritas, IAM mínimo, encryption, KMS, métricas, alarms e custos formam o contrato operacional; nenhuma fila, tópico, subscription, ARN, URL ou credencial real é criada, deixando para a aula 541 o aprofundamento de Redis gerenciado, cache, TTL e invalidation.
```
