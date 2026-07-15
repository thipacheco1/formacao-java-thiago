# 685 - M20.15 - Implementacao mensageria

## Apresentação da aula

Na aula 684, você implementou as integrações do OrderFlow.

O `integration-gateway` passou a possuir:

- contracts normalizados;
- ports de estoque;
- ports de pagamento;
- ports de fulfillment;
- clients HTTP;
- autenticação de workload;
- idempotência externa;
- deadlines;
- retries seguros;
- circuit breakers separados;
- bulkheads;
- rate limiters;
- normalização de respostas;
- tratamento de resultados ambíguos;
- contract tests com WireMock;
- testes de contract drift;
- telemetria técnica básica.

Os adapters externos já sabem executar operações.

Porém, ainda não existe transporte assíncrono ligando:

```text
OrderFlow;

Outbox;

Message Broker;

Integration Gateway;

Orchestration Worker;

Projection Worker.
```

Hoje, o fluxo conceitual termina quando a aplicação grava um evento na Outbox.

Nesta aula, você implementará o caminho completo:

```text
transaction commit;

Outbox Publisher;

Kafka topic;

consumer;

Inbox;

handler;

novo estado;

nova Outbox;

projection.
```

A mensageria será implementada com Kafka como referência.

O foco não será apenas enviar e receber mensagens.

Uma implementação profissional precisa decidir:

- quais eventos existem;
- quais comandos de integração existem;
- qual topic recebe cada contrato;
- qual key controla ordering;
- como o schema evolui;
- como duplicidade é tratada;
- como retry funciona;
- quando usar retry topic;
- quando enviar para DLQ;
- como replay é executado;
- como evitar poison message infinito;
- como garantir que estado e mensagem não divergem;
- como impedir efeito externo duplicado;
- como distinguir falha transitória de falha definitiva.

O erro mais comum é acreditar que Kafka oferece exatamente uma execução de negócio.

Kafka pode entregar uma mensagem mais de uma vez.

O consumer precisa ser idempotente.

Outro erro é publicar diretamente dentro da transação do aggregate.

Se o banco confirmar e o broker falhar, o evento é perdido.

Se o broker confirmar e o banco fizer rollback, o evento descreve um estado inexistente.

Por isso, o OrderFlow usa:

```text
Transactional Outbox.
```

Outro ponto importante:

```text
exactly-once delivery
nao significa
exactly-once business effect.
```

O efeito de negócio depende de:

- Inbox;
- idempotency key;
- operation ID;
- optimistic locking;
- transaction boundary;
- provider idempotency;
- handlers determinísticos.

Nesta aula, você implementará:

- contratos de eventos;
- catálogo de topics;
- serialização;
- headers;
- Outbox Publisher;
- producer;
- consumers;
- Inbox;
- ordering;
- retry;
- dead letter;
- replay;
- projection consumer;
- integration request consumer;
- integration result consumer;
- testes com Kafka real;
- reports, evidence e gate.

O laboratório será:

```text
labs/m20/aula-685-implementacao-mensageria/orderflow-messaging
```

A próxima aula será:

```text
686 - M20.16 - Implementacao observabilidade
```

Na aula 686, você adicionará métricas completas, traces distribuídos, logs estruturados, dashboards, SLOs, alertas, runbooks e correlação entre API, Outbox, Kafka, consumers e providers.

Nesta aula, serão criados apenas os sinais mínimos necessários para provar o funcionamento da mensageria.

Regra central:

```text
mensagem pode repetir;

efeito de negocio
nao pode repetir.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
682:
Implementacao API REST.

683:
Implementacao seguranca.

684:
Implementacao integracoes.

685:
Implementacao mensageria.

686:
Implementacao observabilidade.

687:
Testes unitarios e integracao.
```

A API produz commands.

A aplicação executa casos de uso.

A persistência grava aggregate, audit e Outbox.

O Integration Gateway executa providers.

Agora o broker conectará essas partes.

A mensageria não deve alterar os boundaries já definidos.

Ela deve respeitar:

- domínio puro;
- application ports;
- transaction boundary;
- tenant scope;
- idempotência;
- Inbox;
- Outbox;
- Integration Gateway;
- workload identity;
- contratos normalizados;
- segurança de dados.

---

## Objetivo prático

Será criada a estrutura:

```text
libs/orderflow-contracts
├── src
│   └── main
│       └── java
│           └── br/com/formacao/orderflow/contracts
│               ├── MessageEnvelope.java
│               ├── MessageMetadata.java
│               ├── MessageType.java
│               ├── OrderRegisteredEvent.java
│               ├── StockReservationRequestedMessage.java
│               ├── StockReservationResultMessage.java
│               ├── PaymentAuthorizationRequestedMessage.java
│               ├── PaymentAuthorizationResultMessage.java
│               ├── FulfillmentRequestedMessage.java
│               ├── FulfillmentResultMessage.java
│               ├── CompensationRequestedMessage.java
│               ├── ReconciliationRequestedMessage.java
│               └── OrderProjectionEvent.java
```

Aplicações:

```text
apps/outbox-publisher
├── src/main/java/br/com/formacao/orderflow/outbox
│   ├── OutboxPublisherApplication.java
│   ├── OutboxPollingJob.java
│   ├── OutboxBatchClaimRepository.java
│   ├── KafkaOutboxProducer.java
│   ├── OutboxPublishService.java
│   ├── OutboxPublishPolicy.java
│   └── OutboxPublisherConfiguration.java
└── src/test/java/...

apps/orchestration-worker
├── src/main/java/br/com/formacao/orderflow/orchestration
│   ├── OrchestrationWorkerApplication.java
│   ├── IntegrationResultConsumer.java
│   ├── IntegrationResultMessageMapper.java
│   ├── ConsumerTransactionService.java
│   ├── ConsumerFailureClassifier.java
│   └── OrchestrationMessagingConfiguration.java
└── src/test/java/...

apps/integration-gateway
├── src/main/java/br/com/formacao/orderflow/integration/messaging
│   ├── ProviderRequestConsumer.java
│   ├── ProviderOperationMessageMapper.java
│   ├── ProviderResultProducer.java
│   └── IntegrationMessagingConfiguration.java
└── src/test/java/...

apps/projection-worker
├── src/main/java/br/com/formacao/orderflow/projection
│   ├── ProjectionWorkerApplication.java
│   ├── OrderProjectionConsumer.java
│   ├── ProjectionInboxStore.java
│   ├── ProjectionVersionGuard.java
│   └── ProjectionMessagingConfiguration.java
└── src/test/java/...
```

Documentação:

```text
docs/messaging
├── MESSAGING_CHARTER.md
├── TOPIC_CATALOG.md
├── MESSAGE_CONTRACT_CATALOG.md
├── MESSAGE_KEY_POLICY.md
├── SCHEMA_EVOLUTION_POLICY.md
├── CONSUMER_IDEMPOTENCY_POLICY.md
├── RETRY_TOPIC_POLICY.md
├── DEAD_LETTER_POLICY.md
├── REPLAY_POLICY.md
├── MESSAGE_SECURITY_POLICY.md
├── MESSAGING_TEST_MATRIX.md
├── MESSAGING_RISK_REGISTER.md
├── MESSAGING_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Evento e comando são diferentes

Evento:

```text
algo aconteceu.
```

Exemplo:

```text
OrderRegistered.
```

Comando de integração:

```text
algo deve ser tentado.
```

Exemplo:

```text
ReserveStock.
```

Não use nomes vagos como:

```text
OrderMessage.
```

### Envelope padroniza metadados

Toda mensagem precisa carregar:

- message ID;
- type;
- version;
- tenant;
- aggregate ID;
- correlation ID;
- causation ID;
- occurred at;
- producer;
- payload.

### Message key controla ordering

Para a jornada do pedido:

```text
key = tenant_id + order_id.
```

Mensagens do mesmo pedido permanecem na mesma partition enquanto o número de partitions não muda de forma incompatível.

### Inbox protege consumers

O consumer registra:

```text
consumer name + message ID.
```

Somente a primeira entrega executa o handler.

### Retry topic evita bloquear partition

Uma mensagem com falha transitória não deve impedir indefinidamente todas as mensagens seguintes.

Retry topic permite atraso e nova tentativa controlada.

### DLQ não é lixeira

A Dead Letter Queue precisa de:

- owner;
- reason;
- original topic;
- original partition;
- original offset;
- attempts;
- correlation;
- payload sanitizado;
- runbook;
- replay controlado.

---

## Mão na massa guiada

### 1. Configurar dependências

Adicione Spring Kafka aos módulos:

- `outbox-publisher`;
- `orchestration-worker`;
- `integration-gateway`;
- `projection-worker`.

Adicione Testcontainers Kafka nos testes.

O módulo `orderflow-contracts` não depende de Spring Kafka.

---

### 2. Criar Messaging Charter

Arquivo:

```text
docs/messaging/MESSAGING_CHARTER.md
```

Princípios:

```text
database state and Outbox commit together;

messages are at-least-once;

business effects are idempotent;

message key preserves order scope;

contracts are versioned;

consumers own retry behavior;

DLQ requires runbook;

replay is controlled;

sensitive data is minimized;

observability is completed in lesson 686.
```

---

### 3. Criar MessageMetadata

```java
package br.com.formacao.orderflow.contracts;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public record MessageMetadata(
        UUID messageId,
        String messageType,
        int messageVersion,
        String tenantId,
        UUID aggregateId,
        String correlationId,
        UUID causationId,
        Instant occurredAt,
        String producer) {

    public MessageMetadata {
        Objects.requireNonNull(messageId);
        Objects.requireNonNull(messageType);
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(aggregateId);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(occurredAt);
        Objects.requireNonNull(producer);

        if (messageVersion <= 0) {
            throw new IllegalArgumentException(
                    "Message version must be positive");
        }
    }
}
```

---

### 4. Criar MessageEnvelope

```java
package br.com.formacao.orderflow.contracts;

import java.util.Map;
import java.util.Objects;

public record MessageEnvelope(
        MessageMetadata metadata,
        Map<String, Object> payload) {

    public MessageEnvelope {
        Objects.requireNonNull(metadata);
        payload = Map.copyOf(payload);
    }
}
```

O envelope pode ser serializado como JSON.

O schema lógico permanece explícito.

---

### 5. Criar catálogo de message types

Tipos:

```text
order.registered.v1;

stock.reservation.requested.v1;

stock.reservation.result.v1;

payment.authorization.requested.v1;

payment.authorization.result.v1;

fulfillment.requested.v1;

fulfillment.result.v1;

compensation.requested.v1;

reconciliation.requested.v1;

order.projection.changed.v1.
```

O sufixo da versão faz parte do contrato.

---

### 6. Criar contratos tipados

Prefira records tipados em `orderflow-contracts`.

Exemplo:

```java
package br.com.formacao.orderflow.contracts;

import java.util.List;
import java.util.UUID;

public record StockReservationRequestedMessage(
        UUID orderId,
        String tenantId,
        String operationId,
        List<Item> items) {

    public StockReservationRequestedMessage {
        items = List.copyOf(items);
    }

    public record Item(
            String productCode,
            int quantity) {
    }
}
```

---

### 7. Evitar mapa arbitrário no domínio de mensagens

`Map<String, Object>` pode existir no envelope persistido.

Mas produtores e consumers devem trabalhar com payloads tipados.

Isso melhora:

- validação;
- refatoração;
- contrato;
- documentação;
- testes.

---

### 8. Criar Topic Catalog

Arquivo:

```text
docs/messaging/TOPIC_CATALOG.md
```

Topics:

```text
orderflow.order-events.v1;

orderflow.integration-requests.v1;

orderflow.integration-results.v1;

orderflow.projection-events.v1;

orderflow.retry.5s.v1;

orderflow.retry.30s.v1;

orderflow.dead-letter.v1.
```

Cada topic registra:

- purpose;
- producer;
- consumers;
- key;
- retention;
- partitions;
- classification;
- owner.

---

### 9. Criar Message Key Policy

Arquivo:

```text
docs/messaging/MESSAGE_KEY_POLICY.md
```

Regra principal:

```text
tenantId + ":" + orderId.
```

Retry e DLQ preservam a key original.

Não use message ID como key da jornada.

---

### 10. Criar Message Security Policy

Arquivo:

```text
docs/messaging/MESSAGE_SECURITY_POLICY.md
```

Proibido em payload:

- access token;
- refresh token;
- client secret;
- private key;
- authorization header;
- cartão completo;
- dado pessoal desnecessário;
- stack trace.

---

## Outbox Publisher

### 11. Criar OutboxPollingJob

Responsabilidade:

- executar em intervalo curto;
- reivindicar lote;
- publicar mensagens;
- atualizar status;
- liberar lease;
- limitar batch;
- não executar em paralelo sem coordenação.

---

### 12. Reivindicar lote com SKIP LOCKED

Query conceitual:

```sql
SELECT *
FROM orderflow.outbox_event
WHERE status IN ('PENDING', 'FAILED')
  AND available_at <= now()
ORDER BY occurred_at
FOR UPDATE SKIP LOCKED
LIMIT :batchSize
```

Depois, marque os registros como:

```text
PUBLISHING.
```

---

### 13. Criar lease do publisher

Campos adicionais:

- locked by;
- locked until;
- publish started at.

Se uma instância morrer, outro publisher recupera após o lease.

---

### 14. Criar KafkaOutboxProducer

```java
package br.com.formacao.orderflow.outbox;

import java.util.concurrent.CompletableFuture;
import org.springframework.kafka.core.KafkaTemplate;

public final class KafkaOutboxProducer {

    private final KafkaTemplate<String, String> template;

    public KafkaOutboxProducer(
            KafkaTemplate<String, String> template) {

        this.template = template;
    }

    public CompletableFuture<?> send(
            String topic,
            String key,
            String payload) {

        return template.send(
                topic,
                key,
                payload);
    }
}
```

A serialização completa fica em component específico.

---

### 15. Confirmar publicação antes de marcar

Fluxo:

```text
send;

aguardar acknowledgement;

mark PUBLISHED;

commit.
```

Se falhar:

```text
mark FAILED;

increment attempts;

calculate next available at.
```

---

### 16. Aceitar duplicidade de publicação

Pode ocorrer:

```text
broker confirma;

processo morre;

banco nao marca PUBLISHED;

evento e publicado novamente.
```

Consumers precisam usar Inbox.

---

### 17. Criar OutboxPublishPolicy

Defina:

- batch size;
- lease duration;
- max attempts;
- backoff;
- DLQ administrativa para Outbox;
- status final;
- cleanup.

Outbox falha persistente precisa de alerta na aula 686.

---

### 18. Preservar headers

Headers Kafka:

```text
message-id;

message-type;

message-version;

tenant-id;

aggregate-id;

correlation-id;

causation-id;

producer;

occurred-at.
```

O payload não deve duplicar todos os headers quando não necessário.

---

## Producer configuration

### 19. Configurar producer

Configurações relevantes:

- acknowledgements fortes;
- retries do client;
- idempotent producer;
- compression;
- delivery timeout;
- request timeout;
- max in flight compatível;
- serializers.

A idempotência do producer não substitui Inbox.

---

### 20. Configurar topic mapping

O tipo da Outbox determina o topic.

Exemplo:

```text
StockReservationRequested
-> integration requests.

StockReservationResult
-> integration results.

OrderCompleted
-> order events
e projection events
conforme contrato.
```

Não deixe o controller escolher topic.

---

## Consumers e Inbox

### 21. Criar padrão de consumer

Fluxo:

```text
receive;

validate envelope;

try Inbox;

deserialize;

execute handler;

write state, audit and Outbox;

mark Inbox processed;

commit offset after transaction.
```

---

### 22. Validar envelope

Rejeite:

- message ID ausente;
- version inválida;
- tenant inválido;
- aggregate ID ausente;
- type desconhecido;
- payload incompatível;
- correlation ausente;
- message muito grande.

---

### 23. Criar IntegrationResultConsumer

O consumer do Orchestration Worker recebe:

```text
stock result;

payment result;

fulfillment result;

compensation result.
```

Ele converte a mensagem para command da aplicação.

---

### 24. Usar consumer name estável

Exemplo:

```text
orchestration-worker.integration-results.v1.
```

O Inbox ID usa:

```text
consumer name + message ID.
```

Alterar consumer name cria uma nova identidade de processamento.

---

### 25. Criar ConsumerTransactionService

A mesma transação contém:

- Inbox received;
- load aggregate;
- domain transition;
- aggregate update;
- audit;
- new Outbox;
- Inbox processed.

O commit do offset acontece somente após sucesso.

---

### 26. Tratar mensagem duplicada

Se Inbox já possui `PROCESSED`:

- não carregar aggregate;
- não gerar novo evento;
- confirmar offset;
- registrar duplicate count.

---

### 27. Tratar fingerprint divergente

Mesmo message ID com payload diferente:

```text
SECURITY_OR_CONTRACT_FINDING.
```

Não processe.

Envie para DLQ com reason controlado.

---

## Integration Gateway consumer

### 28. Criar ProviderRequestConsumer

Recebe comandos de integração.

Converte para:

```text
ProviderOperation.
```

Chama:

```text
ProviderOperationExecutor.
```

Produz resultado normalizado.

---

### 29. Não manter transação aberta durante HTTP

O consumer não mantém transaction de banco enquanto chama provider.

Fluxo:

```text
Inbox receive;

commit receive marker;

call provider;

publish result;

mark processed
com estrategia consistente.
```

Use um modelo de estado explícito para operação externa.

---

### 30. Persistir execução do Gateway

Crie tabela ou store para:

- message ID;
- operation ID;
- status;
- provider;
- attempts;
- result;
- timestamps.

Isso permite recovery sem repetir efeito indevido.

---

### 31. Publicar resultado pela Outbox do Gateway

Mesmo no Gateway, prefira:

```text
persist execution result
+ Outbox
na mesma transacao.
```

Não dependa apenas de `KafkaTemplate.send` após HTTP.

---

### 32. Criar ProviderResultProducer

O resultado possui:

- operation ID;
- provider;
- normalized status;
- code;
- retryable;
- occurred at;
- attributes permitidos;
- correlation;
- causation.

---

## Projection Worker

### 33. Criar OrderProjectionConsumer

Consome eventos do pedido.

Atualiza:

- status;
- current stage;
- total;
- flags;
- updated at;
- freshness;
- version.

---

### 34. Criar ProjectionVersionGuard

Cada evento possui versão do aggregate.

Regras:

```text
event version
= current + 1:
apply.

event version
<= current:
duplicate or old.

event version
> current + 1:
gap.
```

Gap gera finding e pode acionar replay.

---

### 35. Garantir idempotência da projection

Use Inbox e unique constraint.

A projection pode ser reconstruída.

Ela não é autoridade de comando.

---

### 36. Criar rebuild controlado

Rebuild:

- usa novo consumer group;
- escreve em tabela shadow;
- valida contagem;
- troca leitura;
- preserva rastreabilidade.

Não limpe projection ativa sem estratégia.

---

## Retry topics

### 37. Criar Retry Topic Policy

Arquivo:

```text
docs/messaging/RETRY_TOPIC_POLICY.md
```

Baseline:

```text
retry 5 seconds;

retry 30 seconds;

depois DLQ.
```

Falhas elegíveis:

- provider unavailable;
- transient database error;
- temporary broker error;
- rate limit transitório.

---

### 38. Não retry business error

Não use retry topic para:

- invalid transition;
- contract incompatible;
- tenant mismatch;
- malformed message;
- business rejection;
- duplicate different payload.

---

### 39. Preservar metadados no retry

Adicione:

- original topic;
- original partition;
- original offset;
- retry count;
- first failure at;
- last failure reason.

Preserve message ID.

---

### 40. Criar ConsumerFailureClassifier

Classificações:

```text
RETRYABLE;

NON_RETRYABLE;

AMBIGUOUS;

SECURITY_FINDING.
```

A classificação decide retry, DLQ ou reconciliação.

---

## Dead Letter Queue

### 41. Criar Dead Letter Policy

Arquivo:

```text
docs/messaging/DEAD_LETTER_POLICY.md
```

Uma mensagem vai para DLQ quando:

- excede tentativas;
- schema inválido;
- type desconhecido;
- fingerprint divergente;
- erro não retryable;
- handler continua falhando;
- policy manda intervenção humana.

---

### 42. Criar DLQ envelope

Inclua:

- original metadata;
- original topic;
- partition;
- offset;
- consumer;
- attempts;
- failure category;
- safe reason;
- failed at;
- payload sanitizado.

---

### 43. Definir ownership da DLQ

Owners:

- integração para requests de provider;
- orchestration para results;
- data/read model para projection;
- plataforma para falha técnica do broker.

---

### 44. Criar runbook de DLQ

O runbook deve orientar:

1. identificar mensagem;
2. validar tenant;
3. validar contrato;
4. verificar estado atual;
5. determinar se replay é seguro;
6. corrigir causa;
7. registrar decisão;
8. executar replay;
9. confirmar efeito;
10. fechar incidente.

---

## Replay

### 45. Criar Replay Policy

Arquivo:

```text
docs/messaging/REPLAY_POLICY.md
```

Replay exige:

- autorização;
- reason;
- owner;
- filtro preciso;
- dry run;
- idempotência validada;
- janela;
- limite;
- audit;
- resultado.

---

### 46. Não alterar message ID no replay técnico

Replay da mesma mensagem preserva message ID.

Se o objetivo for nova intenção de negócio, crie nova mensagem com novo ID e causation.

---

### 47. Criar ferramenta de replay administrativo

A ferramenta lê DLQ ou Outbox falha.

Ela não edita payload manualmente sem processo de correção versionada.

---

## Schema evolution

### 48. Criar Schema Evolution Policy

Arquivo:

```text
docs/messaging/SCHEMA_EVOLUTION_POLICY.md
```

Compatível:

- adicionar campo opcional;
- adicionar enum tolerado;
- corrigir documentação;
- adicionar header opcional.

Incompatível:

- remover campo obrigatório;
- mudar significado;
- mudar tipo;
- reutilizar message type;
- alterar key.

---

### 49. Usar upcaster quando necessário

Consumer pode converter:

```text
v1
-> modelo interno atual.
```

Não espalhe condicionais de versão no handler de negócio.

---

### 50. Criar contract compatibility tests

Valide que consumer atual lê:

- mensagem atual;
- versão anterior suportada;
- campo opcional ausente;
- campo novo desconhecido quando permitido.

---

## Testes com broker real

### 51. Configurar Kafka Testcontainer

Crie suporte compartilhado para:

- broker;
- bootstrap servers;
- topics;
- producer;
- consumers;
- cleanup.

Fixe a imagem em versão revisada no projeto.

---

### 52. Testar Outbox Publisher

Cenários:

- evento pending é publicado;
- status vira published;
- broker indisponível gera failed;
- lease expirado é recuperado;
- duas instâncias não publicam o mesmo lote simultaneamente;
- duplicidade eventual é tolerada.

---

### 53. Testar ordering

Publique eventos do mesmo pedido.

Valide mesma partition e ordem.

Publique pedidos diferentes.

Permita processamento paralelo.

---

### 54. Testar consumer idempotente

Publique a mesma mensagem duas vezes.

Valide:

- um efeito;
- uma transição;
- uma nova Outbox;
- Inbox processed;
- dois offsets confirmados.

---

### 55. Testar retry topic

Primeira tentativa falha de forma transitória.

Valide:

- envio ao retry;
- contador;
- metadados;
- sucesso posterior;
- sem DLQ.

---

### 56. Testar DLQ

Mensagem inválida.

Valide:

- não executa handler;
- vai para DLQ;
- reason seguro;
- original metadata preservada;
- offset confirmado após roteamento.

---

### 57. Testar Integration Gateway por Kafka

Fluxo:

```text
integration request;

consumer;

provider WireMock;

normalized result;

Gateway Outbox;

integration result topic.
```

---

### 58. Testar Orchestration Worker

Fluxo:

```text
integration result;

Inbox;

aggregate;

state transition;

audit;

Outbox;

commit.
```

---

### 59. Testar Projection Worker

Fluxo:

```text
order event;

Inbox;

version guard;

projection update;

freshness.
```

Teste duplicate e gap.

---

### 60. Testar replay

Use mensagem em DLQ.

Valide:

- autorização simulada;
- audit;
- mesma message ID;
- processamento idempotente;
- resultado registrado.

---

## Arquitetura e qualidade

### 61. Criar MessagingArchitectureTest

Regras:

- contratos não dependem de Kafka;
- domínio não depende de Kafka;
- aplicação não depende de Kafka;
- listeners ficam em apps de worker;
- API não produz diretamente;
- Integration Gateway não consome DTO de domínio;
- Outbox Publisher não altera aggregate;
- consumers usam Inbox;
- DLQ possui owner;
- observabilidade detalhada permanece para a aula 686.

---

### 62. Criar Messaging Test Matrix

Arquivo:

```text
docs/messaging/MESSAGING_TEST_MATRIX.md
```

Categorias:

- Outbox;
- producer;
- schema;
- ordering;
- consumer;
- Inbox;
- retry;
- DLQ;
- replay;
- projection;
- integration;
- orchestration;
- security;
- recovery.

---

### 63. Criar Messaging Risk Register

Arquivo:

```text
docs/messaging/MESSAGING_RISK_REGISTER.md
```

Riscos:

```text
publicacao duplicada;

consumer sem Inbox;

key incorreta;

partition hot spot;

schema drift;

retry infinito;

DLQ sem owner;

replay inseguro;

offset confirmado cedo;

HTTP dentro de transacao;

payload sensivel;

projection gap;

Outbox backlog.
```

---

### 64. Criar Messaging Traceability

Arquivo:

```text
docs/messaging/MESSAGING_TRACEABILITY.md
```

Exemplo:

```text
ADR-003 Outbox and Inbox
-> OutboxPollingJob
-> InboxStore
-> OutboxPublisherIntegrationTest
-> ConsumerIdempotencyTest.

ADR-006 Event-driven orchestration
-> integration requests topic
-> integration results topic
-> Orchestration Worker.

INV duplicate external result
-> message ID
-> Inbox
-> operation ID
-> duplicate test.
```

---

### 65. Criar boundary da próxima aula

Arquivo:

```text
docs/messaging/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 685 define:

- Kafka transport;
- topics;
- contracts;
- producers;
- consumers;
- Outbox Publisher;
- Inbox;
- ordering;
- retry topics;
- DLQ;
- replay;
- projection processing;
- integration processing.

A aula 686 define:

- structured logging;
- distributed tracing;
- metrics;
- dashboards;
- SLOs;
- alerts;
- runbooks;
- correlation;
- telemetry governance.

Dashboards e alertas finais
nao sao produzidos nesta aula.
```

---

### 66. Executar testes de mensageria

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  apps/outbox-publisher,
  apps/orchestration-worker,
  apps/integration-gateway,
  apps/projection-worker `
  -am `
  clean `
  test
```

---

### 67. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

---

### 68. Validar configuração externa

Confirme:

- bootstrap servers vêm do ambiente;
- credentials não estão versionadas;
- topics possuem prefixo por ambiente;
- consumer groups são estáveis;
- security protocol é configurável;
- payload máximo é limitado;
- retry é limitado;
- DLQ possui owner.

---

### 69. Criar report

Arquivo:

```text
reports/messaging-implementation-report.yaml
```

Exemplo:

```yaml
messagingImplementation:
  broker:
    Kafka

  topics:
    total:
      7

  contracts:
    total:
      10

  producers:
    total:
      3

  consumers:
    total:
      4

  reliability:
    Outbox:
      PASS
    Inbox:
      PASS
    ordering:
      PASS
    retryTopics:
      PASS
    DLQ:
      PASS
    replay:
      PASS

  tests:
    integration:
      27
    architecture:
      1
    failures:
      0

  observability:
    completed:
      false

  gate:
    PASS
```

---

### 70. Criar evidence

Arquivo:

```text
contracts/messaging-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- broker;
- topic count;
- contract count;
- producer count;
- consumer count;
- Outbox publisher status;
- Inbox status;
- ordering test status;
- duplicate delivery test status;
- retry topic status;
- DLQ status;
- replay status;
- projection version guard status;
- Gateway messaging status;
- orchestration messaging status;
- integration test count;
- architecture test count;
- test failure count;
- secret leak count;
- observability completed;
- documentation status;
- gate status;
- timestamp.

---

### 71. Criar gate de mensageria

Status:

```text
PASS;

FAIL_MESSAGING_MODULE;

FAIL_MESSAGE_CONTRACT;

FAIL_TOPIC_CATALOG;

FAIL_MESSAGE_KEY;

FAIL_OUTBOX_PUBLISHER;

FAIL_PRODUCER;

FAIL_CONSUMER;

FAIL_INBOX;

FAIL_ORDERING;

FAIL_SCHEMA_EVOLUTION;

FAIL_RETRY_TOPIC;

FAIL_DLQ;

FAIL_REPLAY;

FAIL_PROJECTION_CONSUMER;

FAIL_INTEGRATION_CONSUMER;

FAIL_ORCHESTRATION_CONSUMER;

FAIL_SECURITY;

FAIL_INTEGRATION_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_OBSERVABILITY_ANTICIPATION;

INCONCLUSIVE.
```

---

### 72. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Confirme:

- Outbox publica;
- consumers usam Inbox;
- ordering é preservado;
- retries são limitados;
- DLQ recebe falhas definitivas;
- replay é auditável;
- Gateway recebe requests;
- Orchestration recebe results;
- projection recebe events;
- observabilidade final não foi antecipada.

---

### 73. Encerrar o laboratório

Confirme:

- contracts;
- envelope;
- topics;
- keys;
- schemas;
- Outbox Publisher;
- producers;
- consumers;
- Inbox;
- ordering;
- retry topics;
- DLQ;
- replay;
- Gateway messaging;
- orchestration messaging;
- projection messaging;
- Testcontainers;
- integration tests;
- architecture test;
- report;
- evidence;
- gate aprovado;
- observabilidade completa não implementada.

---

## Entendendo o que foi feito

### O fluxo assíncrono foi fechado

Eventos agora saem da Outbox, atravessam Kafka e chegam aos workers.

### Publicação ficou recuperável

Outbox Publisher usa lease, retry e status.

### Consumers ficaram idempotentes

Inbox impede repetição do efeito de negócio.

### Ordering ganhou uma regra explícita

Tenant e pedido formam a message key.

### Integrações ficaram desacopladas

O Gateway recebe requests e produz results por contratos internos.

### Projection passou a acompanhar eventos

Version guard detecta duplicate, old event e gap.

### Falhas ganharam destino controlado

Retry topics tratam transitórios.

DLQ trata intervenção.

### Replay ganhou governança

A repetição é autorizada, auditada e idempotente.

---

## Erros comuns importantes

### Confiar em entrega única

Kafka pode redeliver.

### Confirmar offset antes do commit

Mensagem pode ser perdida.

### Publicar dentro do handler sem Outbox

Banco e broker podem divergir.

### Usar message ID como key

Ordering por pedido é perdido.

### Retry infinito

Poison message bloqueia operação.

### DLQ sem runbook

Falha fica esquecida.

### Replay com novo message ID

Inbox não protege o efeito original.

### Abrir transação durante chamada HTTP

Locks e conexões ficam presos.

### Projection como autoridade

Read model não decide comandos.

### Criar dashboards completos agora

Observabilidade pertence à aula 686.

---

## Comandos úteis

### Testar publisher

```powershell
.\mvnw.cmd `
  -pl `
  apps/outbox-publisher `
  -am `
  test
```

### Testar orchestration worker

```powershell
.\mvnw.cmd `
  -pl `
  apps/orchestration-worker `
  -am `
  test
```

### Testar Gateway

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -am `
  test
```

### Build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

---

## Exercício guiado

Implemente o fluxo:

```text
pagamento recusado
apos estoque reservado.
```

Inclua:

1. Outbox de autorização;
2. integration request topic;
3. key por tenant e order;
4. Gateway consumer;
5. Inbox do Gateway;
6. Payment Provider;
7. resultado `REJECTED`;
8. Gateway Outbox;
9. integration result topic;
10. Orchestration consumer;
11. Inbox do worker;
12. aggregate em `COMPENSATING`;
13. compensation event;
14. audit;
15. projection event;
16. duplicate delivery;
17. retry transitório;
18. DLQ para contract error;
19. replay controlado;
20. evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 684 e ponte para a aula 686 foram preservadas;
- dependências Kafka foram configuradas;
- Messaging Charter foi criado;
- MessageMetadata foi criado;
- MessageEnvelope foi criado;
- catálogo de types foi criado;
- contratos tipados foram criados;
- mapa arbitrário foi limitado;
- Topic Catalog foi criado;
- Message Key Policy foi criada;
- Message Security Policy foi criada;
- OutboxPollingJob foi criado;
- claim de lote usa `SKIP LOCKED`;
- lease foi criado;
- KafkaOutboxProducer foi criado;
- acknowledgement foi tratado;
- duplicidade de publicação foi aceita;
- OutboxPublishPolicy foi criada;
- headers foram preservados;
- producer foi configurado;
- topic mapping foi criado;
- padrão de consumer foi criado;
- envelope foi validado;
- IntegrationResultConsumer foi criado;
- consumer name estável foi criado;
- ConsumerTransactionService foi criado;
- mensagem duplicada foi tratada;
- fingerprint divergente foi tratada;
- ProviderRequestConsumer foi criado;
- transação durante HTTP foi evitada;
- execução do Gateway foi persistida;
- resultado do Gateway usa Outbox;
- ProviderResultProducer foi criado;
- OrderProjectionConsumer foi criado;
- ProjectionVersionGuard foi criado;
- projection ficou idempotente;
- rebuild foi definido;
- Retry Topic Policy foi criada;
- business error não recebe retry;
- metadados de retry foram preservados;
- ConsumerFailureClassifier foi criado;
- Dead Letter Policy foi criada;
- DLQ envelope foi criado;
- ownership da DLQ foi definido;
- runbook foi criado;
- Replay Policy foi criada;
- message ID é preservado no replay;
- ferramenta administrativa foi definida;
- Schema Evolution Policy foi criada;
- upcaster foi definido;
- compatibility tests foram criados;
- Kafka Testcontainer foi configurado;
- Outbox Publisher foi testado;
- ordering foi testado;
- consumer idempotente foi testado;
- retry topic foi testado;
- DLQ foi testada;
- Gateway por Kafka foi testado;
- Orchestration Worker foi testado;
- Projection Worker foi testado;
- replay foi testado;
- teste arquitetural foi criado;
- Test Matrix foi criada;
- Risk Register foi criado;
- traceability foi criada;
- boundary da aula 686 foi criado;
- build dos módulos passou;
- build completo passou;
- configuração externa foi validada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- observabilidade completa não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Adicione:

```powershell
git add `
  libs/orderflow-contracts `
  apps/outbox-publisher `
  apps/orchestration-worker `
  apps/integration-gateway `
  apps/projection-worker `
  docs/messaging `
  reports/messaging-implementation-report.yaml `
  contracts/messaging-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "client_secret|private_key|access_token|refresh_token|Bearer ey|realBootstrapServer|realSaslPassword"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(messaging): implement OrderFlow asynchronous flow"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- broker real;
- credencial real;
- dashboards finais;
- alertas finais;
- SLOs finais;
- conteúdo detalhado da aula 686.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou a mensageria do OrderFlow.

Você criou:

```text
message contracts;

envelopes;

topics;

message keys;

Outbox Publisher;

Kafka producers;

Kafka consumers;

Inbox;

ordering;

retry topics;

DLQ;

replay;

Integration Gateway messaging;

Orchestration Worker messaging;

Projection Worker messaging;

schema evolution;

integration tests;

architecture test;

report, evidence e gate.
```

O fluxo agora conecta:

```text
API;

application;

PostgreSQL;

Outbox;

Kafka;

Integration Gateway;

providers;

Orchestration Worker;

Projection Worker.
```

A próxima aula será:

```text
686 - M20.16 - Implementacao observabilidade
```

Nela, você implementará logs estruturados, traces distribuídos, métricas, dashboards, SLOs, alertas, runbooks e correlação ponta a ponta para API, banco, Outbox, Kafka, consumers, providers e projections.

A observabilidade completa não foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contracts.
- [ ] Criei topics.
- [ ] Defini keys.
- [ ] Implementei Outbox Publisher.
- [ ] Implementei producers.
- [ ] Implementei consumers.
- [ ] Implementei Inbox.
- [ ] Testei ordering.
- [ ] Criei retries.
- [ ] Criei DLQ.
- [ ] Criei replay.
- [ ] Conectei Gateway.
- [ ] Conectei Orchestration.
- [ ] Conectei Projection.
- [ ] Preservei observabilidade para a aula 686.

---

## Troubleshooting adicional

### Outbox fica em `PUBLISHING`

Revise lease e recovery.

### Consumer processa duas vezes

Confirme Inbox antes do handler.

### Eventos do mesmo pedido chegam fora de ordem

Revise key e partition.

### Retry topic perde headers

Copie metadados explicitamente.

### DLQ cresce sem alerta

A aula 686 criará alertas e dashboards.

### Offset é confirmado cedo

Integre confirmação ao sucesso transacional.

### Gateway repete provider

Revise execution store e idempotency key.

### Projection detecta gap

Pare ou marque stale e acione replay.

### Replay não executa

Verifique Inbox e intenção do replay.

### Quero criar dashboard agora

Essa etapa pertence à aula 686.

---

## Perguntas de revisão

1. O que é Transactional Outbox?
2. Kafka entrega uma vez?
3. O que Inbox protege?
4. Qual é a message key?
5. Por que usar tenant e order?
6. O que é message envelope?
7. Evento é comando?
8. Quando usar retry topic?
9. Business rejection recebe retry?
10. O que é DLQ?
11. DLQ precisa de owner?
12. Replay preserva message ID?
13. Quando criar novo message ID?
14. O que causation identifica?
15. Quando confirmar offset?
16. O Gateway mantém transação durante HTTP?
17. Como Gateway publica resultado?
18. O que ProjectionVersionGuard protege?
19. O que é schema evolution?
20. O que upcaster faz?
21. Exactly-once garante efeito único?
22. O que a aula 686 fará?
23. O que não foi concluído?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Publicação confiável após commit.
2. Pode redeliver.
3. Efeito duplicado no consumer.
4. Tenant e order.
5. Para ordering da jornada.
6. Metadados e payload.
7. Não.
8. Falha transitória.
9. Não.
10. Fila de intervenção.
11. Sim.
12. Sim.
13. Nova intenção.
14. Mensagem causadora.
15. Após commit do processamento.
16. Não.
17. Pela própria Outbox.
18. Duplicate, old event e gap.
19. Evolução compatível do contrato.
20. Converte versão antiga.
21. Não.
22. Implementar observabilidade.
23. Dashboards, SLOs e alertas.
24. Implementação observabilidade.
25. Mensagem repete; efeito não.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 685 - M20.15 - Implementacao mensageria

- Continuei após Implementação integrações.
- Configurei dependências Kafka.
- Criei Messaging Charter.
- Criei MessageMetadata.
- Criei MessageEnvelope.
- Criei message types.
- Criei contratos tipados.
- Limitei payloads arbitrários.
- Criei Topic Catalog.
- Criei Message Key Policy.
- Criei Message Security Policy.
- Criei OutboxPollingJob.
- Implementei claim com SKIP LOCKED.
- Criei lease.
- Criei KafkaOutboxProducer.
- Tratei acknowledgement.
- Aceitei publicação duplicada.
- Criei OutboxPublishPolicy.
- Propaguei headers.
- Configurei producer.
- Criei topic mapping.
- Criei padrão de consumer.
- Validei envelope.
- Criei IntegrationResultConsumer.
- Defini consumer name estável.
- Criei ConsumerTransactionService.
- Tratei mensagem duplicada.
- Tratei fingerprint divergente.
- Criei ProviderRequestConsumer.
- Evitei transação durante HTTP.
- Persistei execução do Gateway.
- Usei Outbox para resultado.
- Criei ProviderResultProducer.
- Criei OrderProjectionConsumer.
- Criei ProjectionVersionGuard.
- Tornei projection idempotente.
- Defini rebuild controlado.
- Criei Retry Topic Policy.
- Evitei retry de business error.
- Preservei metadados de retry.
- Criei ConsumerFailureClassifier.
- Criei Dead Letter Policy.
- Criei DLQ envelope.
- Defini ownership da DLQ.
- Criei runbook.
- Criei Replay Policy.
- Preservei message ID.
- Defini ferramenta de replay.
- Criei Schema Evolution Policy.
- Defini upcaster.
- Criei compatibility tests.
- Configurei Kafka Testcontainer.
- Testei Outbox Publisher.
- Testei ordering.
- Testei consumer idempotente.
- Testei retry topic.
- Testei DLQ.
- Testei Gateway por Kafka.
- Testei Orchestration Worker.
- Testei Projection Worker.
- Testei replay.
- Criei teste arquitetural.
- Criei Messaging Test Matrix.
- Criei Messaging Risk Register.
- Criei Messaging Traceability.
- Criei boundary para a aula 686.
- Executei testes dos módulos.
- Executei build completo.
- Validei configuração externa.
- Criei report, evidence e gate.
- Não antecipei observabilidade completa.
- Próxima aula: Implementacao observabilidade.
```

---

## Referência técnica curta

- Apache Kafka.
- Transactional Outbox.
- Inbox.
- At-Least-Once.
- Message Envelope.
- Message Key.
- Partition.
- Consumer Group.
- Retry Topic.
- Dead Letter Queue.
- Replay.
- Schema Evolution.
- Upcaster.
- Offset Commit.
- SKIP LOCKED.
- Projection Version Guard.
- Kafka Testcontainers.

Regra final:

```text
A implementação de mensageria do OrderFlow deve assumir entrega at-least-once e proteger o efeito de negócio com Outbox, Inbox, operation ID, version e idempotência: domain e application não dependem de Kafka, orderflow-contracts contém envelopes e payloads tipados com message ID, type, version, tenant, aggregate, correlation, causation, occurred at e producer, topics separam order events, integration requests, integration results, projection events, retries e DLQ, a key tenant + order preserva ordering da jornada, OutboxPollingJob reivindica lotes com FOR UPDATE SKIP LOCKED e lease, KafkaOutboxProducer publica e somente depois marca PUBLISHED, duplicidade eventual é aceita, consumers validam envelope, registram Inbox antes do handler, executam aggregate, audit e nova Outbox na mesma transação e confirmam offset após commit, o Gateway não mantém transação durante HTTP e persiste execution result com Outbox própria, ProjectionVersionGuard aplica current + 1, ignora versões antigas e detecta gap, retry topics recebem apenas falhas transitórias, business errors e contract errors não recebem retry, DLQ preserva origem, attempts e safe reason e possui owner e runbook, replay é autorizado, auditado e preserva message ID, schema evolution usa compatibilidade e upcasters, e Testcontainers comprova publisher, ordering, duplicate delivery, retry, DLQ, Gateway, orchestration, projection e replay; o gate termina com contracts, topics, keys, Outbox Publisher, producers, consumers, Inbox, retries, DLQ, replay, tests, report e evidence aprovados, enquanto logs estruturados completos, distributed tracing, metrics, dashboards, SLOs, alertas e runbooks finais permanecem reservados para a aula 686.
```
