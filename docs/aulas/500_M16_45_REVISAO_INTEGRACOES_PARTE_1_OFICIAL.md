# 500 - M16.45 - Revisao integracoes parte 1

## Apresentação da aula

A formação chegou a um ponto importante.

Nas aulas anteriores, você não estudou integrações como assuntos isolados.

Você construiu uma jornada completa:

```text
requisição HTTP;

regra de negócio;

transação local;

Outbox;

Kafka;

Inbox;

deduplicação;

worker;

intenção de notificação;

dispatcher;

API HTTP externa fake;

retry;

quarantine;

correlação;

monitoramento.
```

O projeto de ordens de serviço possui agora várias fronteiras.

Cada fronteira introduz decisões diferentes:

```text
HTTP:

contrato, timeout,
status e autenticação.

Banco:

atomicidade local,
constraints e ownership.

Kafka:

topic, key, partition,
offset e redelivery.

Outbox:

intenção de publicação
na mesma transação do negócio.

Inbox:

recepção durável
antes do commit do offset.

Dispatcher:

claim, retry,
idempotência e quarantine.

Provider externo:

Idempotency-Key,
falhas HTTP e resposta ambígua.
```

Implementar cada mecanismo separadamente é apenas uma parte do trabalho.

A outra parte é revisar se todos eles formam um sistema coerente.

Uma integração pode compilar e ainda possuir falhas graves:

- evento sem versão;
- key Kafka incorreta;
- retry em erro permanente;
- token em log;
- timeout ausente;
- Outbox fora da transação;
- Inbox confirmada antes do commit;
- idempotency key recriada em cada tentativa;
- payload com dados excessivos;
- consumer sem deduplicação;
- 429 tratado como erro permanente;
- 409 contornado com nova key;
- quarantine apagada sem auditoria.

A pergunta central desta aula será:

```text
como revisar tecnicamente
uma integração completa

antes de considerá-la
pronta para evolução
ou operação?
```

Esta é uma aula de revisão técnica.

Ela não adicionará um novo broker, um novo endpoint externo ou um novo padrão.

O objetivo será voltar ao que foi construído e avaliar:

```text
contratos;

boundaries;

garantias;

atomicidade;

idempotência;

retry;

timeouts;

erros;

segurança;

testes;

evidências.
```

A revisão será dividida em duas partes.

A parte 1, nesta aula, concentrará:

- contratos HTTP;
- contratos de eventos;
- topics, keys e headers;
- Outbox;
- Inbox;
- garantias de entrega;
- deduplicação;
- idempotência;
- retries;
- classificação de erros;
- timeouts;
- quarantine;
- segurança dos dados;
- testes de resiliência.

A parte 2, na aula 501, concentrará:

- logs e correlação;
- métricas;
- cardinalidade;
- alertas;
- runbooks;
- monitoramento;
- modularidade;
- custo arquitetural;
- readiness operacional;
- revisão final da jornada.

A revisão desta aula será aplicada ao laboratório:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Os principais fluxos revisados serão:

```text
Fluxo A:

POST /api/v1/service-orders
-> service_order
-> outbox_event.

Fluxo B:

outbox_event
-> m16.service-order.events.v1.

Fluxo C:

Kafka
-> notification_inbox_message
-> service_order_notification_intent.

Fluxo D:

notification intent
-> HttpNotificationProvider
-> fake external API.
```

Você criará um pacote de evidências em:

```text
docs/architecture/review-integrations
```

O resultado da revisão não será apenas:

```text
está funcionando.
```

O resultado deverá dizer:

```text
o que foi verificado;

qual evidência foi usada;

qual risco foi encontrado;

qual severidade;

qual decisão foi tomada;

qual ação permanece.
```

Nenhuma correção estrutural extensa será executada nesta aula.

Achados serão registrados.

Correções pequenas e objetivas podem ser aplicadas quando forem necessárias para manter a coerência do laboratório.

Refatorações amplas pertencem à aula 503:

```text
Refatoracao final integracoes.
```

Ao final, você deverá explicar:

```text
como inventariar fronteiras;

como revisar contratos;

como diferenciar garantia
de transporte e garantia
de efeito;

por que at-least-once
exige idempotência;

como validar atomicidade
de Outbox e Inbox;

como classificar falhas;

como revisar timeout
e resposta ambígua;

como verificar segurança;

como transformar achados
em evidência acionável.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
498:
Projeto mensageria OS parte 3.

499:
Projeto integracao API externa fake.

500:
Revisao integracoes parte 1.

501:
Revisao integracoes parte 2.

502:
Prova pratica integracoes.

503:
Refatoracao final integracoes.
```

A aula 499 respondeu:

```text
como integrar
um provider HTTP fake

com timeouts,
idempotência,
correlação
e classificação de erros?
```

A aula 500 responderá:

```text
como revisar
a segurança e a coerência
de toda essa integração?
```

Nesta aula:

```text
inventário de contratos:
sim.

inventário de boundaries:
sim.

Outbox:
revisada.

Inbox:
revisada.

Kafka:
revisado.

HTTP:
revisado.

idempotência:
revisada.

retry:
revisado.

timeouts:
revisados.

erros:
revisados.

quarantine:
revisada.

segurança:
revisada.

testes:
revisados.

logs e métricas:
somente referências.

monitoramento completo:
não.

arquitetura final:
não.

prova prática:
não.

refatoração final:
não.
```

A regra central será:

```text
uma integração está pronta
quando suas garantias,
falhas e evidências
são explícitas;

não apenas quando
o happy path funciona.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
docs/architecture/review-integrations
├── INTEGRATION_REVIEW_PART1.md
├── INTEGRATION_BOUNDARY_INVENTORY.md
├── CONTRACT_INVENTORY.md
├── DELIVERY_GUARANTEE_MATRIX.md
├── ERROR_RETRY_MATRIX.md
├── SECURITY_REVIEW.md
├── RESILIENCE_TEST_MATRIX.md
└── REVIEW_FINDINGS_PART1.md
```

Também serão criados testes de revisão:

```text
src/test/java/br/com/formacao/m16/review
├── IntegrationContractReviewTest.java
└── IntegrationSafetyReviewTest.java
```

Você irá:

1. confirmar a baseline;
2. desenhar a jornada;
3. listar boundaries;
4. listar contratos;
5. revisar request e response HTTP;
6. revisar evento Kafka;
7. revisar topic e key;
8. revisar headers;
9. revisar Outbox;
10. revisar Inbox;
11. revisar deduplicação;
12. revisar idempotência do provider;
13. revisar retries;
14. revisar timeouts;
15. revisar classificação de erros;
16. revisar quarantine;
17. revisar segurança;
18. revisar testes existentes;
19. executar cenários críticos;
20. registrar evidências;
21. classificar achados;
22. executar o gate;
23. commitar;
24. preparar a parte 2.

---

## Conceito essencial

### Revisão técnica

Revisão técnica é uma avaliação sistemática da solução.

Ela deve verificar:

- requisito;
- desenho;
- código;
- configuração;
- testes;
- dados;
- falhas;
- operação;
- segurança.

Ela não é uma leitura superficial do código.

---

### Boundary

Boundary é uma fronteira de responsabilidade ou tecnologia.

No projeto:

```text
HTTP inbound;

módulo Service Order;

banco local;

Outbox publisher;

Kafka;

Notification consumer;

Notification worker;

dispatcher;

HTTP outbound;

fake provider.
```

Cada boundary precisa de contrato e política de falha.

---

### Contrato

Contrato é a forma acordada de comunicação.

Pode ser:

- request HTTP;
- response HTTP;
- evento;
- header;
- status;
- topic;
- key;
- schema;
- idempotency key;
- código de erro.

Um contrato não é somente um DTO Java.

---

### Garantia de transporte

Garantia de transporte responde:

```text
a mensagem pode ser
entregue novamente?
```

No Kafka e nos jobs do laboratório:

```text
at-least-once.
```

Isso significa:

```text
uma ou mais tentativas.
```

---

### Garantia de efeito

Garantia de efeito responde:

```text
quantas vezes
o efeito lógico acontece?
```

O projeto busca:

```text
uma vez por eventId
ou idempotency key.
```

Isso é obtido por:

- unique constraint;
- Inbox;
- claim;
- sourceEventId;
- provider idempotente.

Não é exactly-once global.

---

### Atomicidade local

Atomicidade local existe dentro de um datasource e transaction manager.

Exemplo:

```text
service_order;

outbox_event.
```

Eles confirmam juntos.

Outro exemplo:

```text
notification intent;

Inbox PROCESSED.
```

Eles confirmam juntos.

A chamada HTTP externa não participa da mesma transação.

---

### Resposta ambígua

Uma resposta é ambígua quando o client não sabe se o provider aplicou o efeito.

Exemplo:

```text
read timeout.
```

O provider pode ter aceitado antes do timeout.

A solução não é assumir sucesso ou falha.

A solução é repetir com a mesma idempotency key.

---

### Falha transitória

Pode melhorar sem alteração do request.

Exemplos:

- 429;
- 503;
- timeout;
- conexão indisponível;
- lock temporário;
- broker indisponível.

Ela pode usar retry com backoff.

---

### Falha permanente

Não melhora repetindo o mesmo request.

Exemplos:

- 400;
- 401 com configuração incorreta;
- 403;
- 409 de idempotência;
- 422;
- schema incompatível;
- evento inválido.

Ela precisa de correção, quarantine ou intervenção.

---

### Quarantine

Quarantine preserva uma falha terminal.

Ela não é lixeira.

Ela precisa de:

- reason code;
- IDs técnicos;
- attempts;
- timestamp;
- owner;
- runbook;
- política de retenção.

---

### Evidência

Uma conclusão deve possuir evidência.

Exemplos:

```text
teste automatizado;

constraint do banco;

configuração;

record Kafka;

linha Outbox;

linha Inbox;

response HTTP;

métrica;

log correlacionado.
```

Nesta parte, o foco será teste, contrato e persistência.

---

### Severidade dos achados

Use:

#### BLOCKER

Risco imediato de perda, duplicidade grave, vazamento ou corrupção.

#### HIGH

Falha importante de resiliência, segurança ou contrato.

#### MEDIUM

Risco relevante, mas com mitigação parcial.

#### LOW

Melhoria de clareza, manutenção ou cobertura.

#### INFO

Observação sem ação obrigatória.

A severidade precisa considerar impacto e probabilidade.

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

- data;
- commit;
- Java;
- resultado;
- quantidade de testes;
- falhas;
- duração aproximada.

Não inicie a revisão com a baseline vermelha.

---

### 2. Criar o documento principal

Arquivo:

```text
docs/architecture/review-integrations/INTEGRATION_REVIEW_PART1.md
```

Estrutura:

```markdown
# Revisão de integrações — parte 1

## Escopo

## Fora do escopo

## Ambiente

## Fluxos revisados

## Evidências

## Achados

## Decisões

## Pendências para a parte 2
```

---

### 3. Desenhar a jornada completa

Adicione:

```text
Client
  |
  v
POST /service-orders
  |
  v
ServiceOrderApplicationService
  |
  +--> service_order
  |
  +--> outbox_event
  |
  v
Outbox Publisher
  |
  v
m16.service-order.events.v1
  |
  v
Notification Listener
  |
  v
notification_inbox_message
  |
  v
Notification Preparation Worker
  |
  v
service_order_notification_intent
  |
  v
Notification Dispatch Worker
  |
  v
HttpNotificationProvider
  |
  v
Fake External Notification API
```

Marque os commits transacionais.

---

### 4. Criar inventário de boundaries

Arquivo:

```text
INTEGRATION_BOUNDARY_INVENTORY.md
```

Tabela:

```markdown
| Boundary | Entrada | Saída | Falha principal | Proteção |
|---|---|---|---|---|
| HTTP inbound | JSON + headers | 201 | Request inválido | Validação |
| Service Order | Command | OS + evento | Rollback | Transação |
| Outbox | Linha PENDING | Kafka record | Broker indisponível | Retry |
| Kafka | Record | Consumer delivery | Redelivery | eventId |
| Inbox | Record | Linha RECEIVED | Banco indisponível | Sem ack |
| Worker | Inbox | Intent | Falha local | Retry |
| Dispatcher | Intent | Provider call | Timeout | Idempotência |
| External API | HTTP request | 2xx/4xx/5xx | Resultado ambíguo | Idempotency-Key |
```

---

### 5. Criar inventário de contratos

Arquivo:

```text
CONTRACT_INVENTORY.md
```

Inclua:

```markdown
| Contrato | Versão | Owner | Consumer | Evidência |
|---|---:|---|---|---|
| POST /api/v1/service-orders | v1 | Service Order | Client | Controller test |
| service-order.scheduled.v1 | 1 | Service Order | Notification | JSON + test |
| m16.service-order.events.v1 | v1 | Service Order | Notification | Topic catalog |
| Fake Provider HTTP | v1 | Fake Provider | Notification | Contract test |
```

---

### 6. Revisar o HTTP inbound

Confirme:

- método `POST`;
- URI versionada;
- request explícito;
- response explícito;
- `201 Created`;
- `Location`;
- correlation header;
- request ID;
- erro de duplicidade;
- campos obrigatórios;
- ausência de entidade JPA no response.

Achado típico:

```text
Bean Validation
ainda não aplicada
em todos os campos.
```

Registre sem inventar correção se não estiver no escopo.

---

### 7. Revisar o evento

Confirme:

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

Perguntas:

- o nome representa um fato?
- a versão é explícita?
- campos são necessários?
- existem dados pessoais?
- o evento é independente da entidade?
- o eventId é criado uma vez?
- retry preserva o ID?

---

### 8. Revisar topic e key

Confirme:

```text
topic:
m16.service-order.events.v1.

key:
serviceOrderId.

partitions:
3 no laboratório.
```

Perguntas:

- a key preserva ordem por OS?
- o producer usa a key em todas as tentativas?
- consumer depende de ordem global?
- alteração de partitions foi considerada?
- o topic possui owner?

---

### 9. Revisar headers Kafka

Confirme:

```text
correlationId;

messageId;

causationId;

eventType;

eventVersion;

aggregateType.
```

Regras:

- `messageId = eventId`;
- headers não substituem o payload;
- valores são pequenos;
- token não entra;
- header inválido não quebra a jornada sem policy.

---

### 10. Revisar Outbox

Crie checklist:

```markdown
- [ ] Estado e evento na mesma transação.
- [ ] EventId gerado antes da persistência.
- [ ] Payload serializado antes do commit.
- [ ] Topic e key persistidos.
- [ ] CorrelationId persistido.
- [ ] Status inicial PENDING.
- [ ] Claim condicional.
- [ ] Publish fora da transação longa.
- [ ] Ack do broker aguardado.
- [ ] PUBLISHED marcado depois.
- [ ] Retry preserva eventId.
- [ ] Stale claim recovery.
```

Evidência principal:

```text
ServiceOrderOutboxAtomicityIntegrationTest.
```

---

### 11. Revisar Inbox

Checklist:

```markdown
- [ ] Consumer group exclusivo.
- [ ] Auto commit desabilitado.
- [ ] Ack depois do commit da Inbox.
- [ ] Unique consumerName + eventId.
- [ ] Payload e metadata persistidos.
- [ ] Duplicata retorna normalmente.
- [ ] Falha de banco impede progresso.
- [ ] Worker separado.
- [ ] Claim condicional.
- [ ] Retry limitado.
- [ ] FAILED_PERMANENT preservado.
```

Evidência:

```text
NotificationInboxIngestionIntegrationTest;

NotificationRedeliveryIntegrationTest.
```

---

### 12. Criar matriz de garantias

Arquivo:

```text
DELIVERY_GUARANTEE_MATRIX.md
```

```markdown
| Etapa | Garantia | Possível duplicata | Proteção |
|---|---|---:|---|
| HTTP create | Request único esperado | Sim, por retry do client | serviceOrderId |
| Outbox publish | At-least-once | Sim | eventId |
| Kafka consume | At-least-once | Sim | Inbox |
| Inbox worker | At-least-once | Sim | sourceEventId |
| HTTP provider | At-least-once | Sim | Idempotency-Key |
| Provider effect | Um efeito lógico por key | Não esperado | Unique constraint |
```

Registre:

```text
exactly-once global:
não prometido.
```

---

### 13. Revisar idempotência

Verifique quatro níveis:

#### Criação da OS

```text
serviceOrderId único.
```

#### Evento

```text
eventId estável.
```

#### Consumer

```text
consumerName + eventId.
```

#### Provider

```text
sourceEventId
como Idempotency-Key.
```

A mesma intenção precisa manter a mesma identidade em todas as tentativas.

---

### 14. Revisar retry

Pergunte para cada retry:

```text
qual falha permite retry?

qual é o máximo?

qual é o backoff?

há jitter?

há Retry-After?

a identidade permanece?

qual é o estado terminal?

há métrica?

há runbook?
```

Não aceite:

```text
catch Exception
e repetir para sempre.
```

---

### 15. Criar matriz de erros

Arquivo:

```text
ERROR_RETRY_MATRIX.md
```

Inclua:

```markdown
| Erro | Classe | Retry | Estado final |
|---|---|---:|---|
| Kafka indisponível | Transitório | Sim | FAILED/PENDING |
| Inbox DB indisponível | Transitório | Kafka redelivery | Não recebido |
| Evento inválido | Permanente | Não | FAILED_PERMANENT |
| Provider 400 | Permanente | Não | QUARANTINED |
| Provider 409 | Permanente crítico | Não | QUARANTINED |
| Provider 429 | Transitório | Sim | RETRY_WAIT |
| Provider 503 | Transitório | Sim | RETRY_WAIT |
| Connect timeout | Transitório | Sim | RETRY_WAIT |
| Read timeout | Ambíguo | Sim, mesma key | RETRY_WAIT |
| Retry esgotado | Terminal | Não automático | QUARANTINED |
```

---

### 16. Revisar timeout

Confirme:

```text
connect timeout:
configurado.

read timeout:
configurado.

timeout infinito:
não.

mesma key após timeout:
sim.
```

Revise também o budget total:

```text
attempts
x timeout
+ backoff.
```

Um timeout pequeno com muitos retries pode produzir uma operação longa.

---

### 17. Revisar Retry-After

Confirme:

- 429 tratado antes do handler genérico de 4xx;
- header pode estar ausente;
- valor inválido não quebra o client;
- limite máximo existe;
- backoff local ainda participa;
- valor não vira tag de alta cardinalidade.

---

### 18. Revisar quarantine

Confirme:

```text
intentId;

sourceEventId;

reasonCode;

exceptionClass;

errorMessage limitada;

attemptCount;

correlationId;

quarantinedAt.
```

Proíba:

- token;
- payload;
- stacktrace completo;
- contato;
- segredo;
- alteração manual para `SENT`.

---

### 19. Criar revisão de segurança

Arquivo:

```text
SECURITY_REVIEW.md
```

Checklist:

```markdown
## Segredos

- [ ] Token externalizado.
- [ ] Token não versionado em produção.
- [ ] Authorization não aparece em log.

## Dados

- [ ] Evento minimizado.
- [ ] Payload externo sem contato real.
- [ ] Quarantine sem payload bruto.
- [ ] Logs sem body completo.

## Headers

- [ ] Correlation validada.
- [ ] Request ID gerado.
- [ ] Idempotency-Key limitada.
- [ ] Quebra de linha rejeitada.

## Actuator

- [ ] Endpoints limitados.
- [ ] Health details protegidos.
```

---

### 20. Revisar testes de resiliência

Arquivo:

```text
RESILIENCE_TEST_MATRIX.md
```

Liste:

- happy path;
- rollback da Outbox;
- Kafka indisponível;
- duplicate event;
- redelivery;
- stale claim;
- transient worker failure;
- permanent worker failure;
- provider retry;
- provider timeout pós-aceite;
- provider duplicate;
- idempotency conflict;
- 429;
- 503;
- quarantine;
- restart;
- E2E.

Marque:

```text
AUTOMATED;

MANUAL;

MISSING.
```

---

### 21. Criar teste de contrato de revisão

Arquivo:

```text
IntegrationContractReviewTest.java
```

```java
package br.com.formacao.m16.review;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.formacao.m16.architecture.os.config.OsMessagingTopicNames;
import br.com.formacao.m16.architecture.os.notification.config.NotificationMessagingConfiguration;
import br.com.formacao.m16.architecture.os.serviceorder.event.ServiceOrderScheduledEventV1;
import java.time.Instant;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class IntegrationContractReviewTest {

    @Test
    void shouldKeepServiceOrderMessagingContractStable() {
        assertThat(
            OsMessagingTopicNames
                .SERVICE_ORDER_EVENTS
        ).isEqualTo(
            "m16.service-order.events.v1"
        );

        assertThat(
            NotificationMessagingConfiguration.TOPIC
        ).isEqualTo(
            OsMessagingTopicNames
                .SERVICE_ORDER_EVENTS
        );

        assertThat(
            NotificationMessagingConfiguration.GROUP
        ).isEqualTo(
            "m16-notification-service-order-v1"
        );

        var event =
            new ServiceOrderScheduledEventV1(
                UUID.randomUUID(),
                "service-order.scheduled.v1",
                1,
                Instant.now(),
                "CORR-500",
                "REQ-500",
                "OS-500",
                "CUSTOMER-500",
                "SCHEDULE-500",
                "MORNING",
                "SCHEDULED"
            );

        assertThat(event.eventVersion())
            .isEqualTo(1);

        assertThat(event.serviceOrderId())
            .isEqualTo("OS-500");
    }
}
```

Esse teste protege decisões essenciais.

---

### 22. Criar teste de segurança estrutural

Arquivo:

```text
IntegrationSafetyReviewTest.java
```

O teste percorre fontes e falha quando encontra padrões proibidos em locais críticos.

Exemplos:

```text
LOGGER.*Authorization;

tag("correlationId");

tag("eventId");

new Idempotency-Key aleatória;

Thread.sleep em listener;

KafkaTemplate no application service.
```

Não transforme o teste em parser Java completo.

Use-o como proteção didática e mantenha revisão manual.

---

### 23. Executar testes direcionados

```powershell
.\mvnw.cmd `
  -Dtest=IntegrationContractReviewTest,IntegrationSafetyReviewTest,ServiceOrderOutboxAtomicityIntegrationTest,NotificationRedeliveryIntegrationTest,NotificationDispatchIdempotencyIntegrationTest,HttpNotificationProviderStatusClassificationTest,HttpNotificationProviderTimeoutIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 24. Executar busca de riscos

```powershell
git grep `
  -n `
  -E `
  "Authorization|Bearer|payload=|body=|correlationId.*tag|eventId.*tag|Thread.sleep|KafkaTemplate"
```

Cada resultado precisa ser classificado.

Encontrar o termo não significa automaticamente falha.

---

### 25. Criar documento de achados

Arquivo:

```text
REVIEW_FINDINGS_PART1.md
```

Tabela:

```markdown
| ID | Severidade | Área | Achado | Evidência | Ação |
|---|---|---|---|---|---|
| INT-500-001 | INFO | Outbox | Atomicidade coberta | Teste | Nenhuma |
| INT-500-002 | LOW | Validation | Bean Validation parcial | Controller | Revisar |
| INT-500-003 | INFO | Idempotência | Key estável | Teste timeout | Nenhuma |
```

Não invente falhas.

Registre somente o que foi observado.

---

### 26. Definir decisão de aprovação

Status possíveis:

```text
APPROVED;

APPROVED_WITH_ACTIONS;

REJECTED.
```

Para o laboratório, a expectativa é:

```text
APPROVED_WITH_ACTIONS.
```

Motivo possível:

- desenho principal validado;
- riscos críticos cobertos;
- observabilidade será revisada na parte 2;
- hardening produtivo permanece fora do laboratório.

---

### 27. Registrar limitações

Inclua:

- broker de uma réplica;
- banco local;
- token didático;
- fake provider no mesmo runtime;
- sem TLS real;
- sem secret manager;
- sem infraestrutura multi-node;
- sem teste de caos real;
- sem carga produtiva;
- sem política corporativa de retenção.

Essas limitações não invalidam o laboratório.

Elas impedem chamar o projeto de produção-ready.

---

## Entendendo o que foi feito

### A integração ganhou um inventário

Fronteiras e contratos deixaram de estar espalhados.

### Garantia de transporte foi separada de efeito

At-least-once não foi confundido com duplicação de negócio.

### Atomicidade ficou comprovável

Outbox e Inbox foram ligadas a testes e constraints.

### A idempotência foi revisada ponta a ponta

OS, evento, consumer e provider possuem identidades próprias.

### Retry ganhou justificativa

Cada tentativa precisa de falha transitória e limite.

### Timeout foi tratado como ambíguo

A mesma key continua sendo a proteção.

### Quarantine ganhou função operacional

Ela preserva o problema sem repetir eternamente.

### Segurança entrou na revisão

Segredos, payloads, headers e Actuator foram avaliados.

### Testes viraram evidência

A revisão não dependeu apenas de opinião.

### Limitações foram explicitadas

Laboratório funcional não foi chamado de produção-ready.

---

## Erros comuns importantes

### Revisar somente o happy path

Falhas reais permanecem desconhecidas.

### Confundir teste verde com segurança total

Cobertura e ambiente possuem limites.

### Prometer exactly-once

O projeto utiliza at-least-once e idempotência.

### Revisar DTO, mas ignorar topic e key

O contrato Kafka fica incompleto.

### Aceitar retry genérico

Falhas permanentes podem repetir para sempre.

### Ignorar timeout total

Muitos retries podem exceder o deadline.

### Considerar quarantine como descarte

O problema precisa de owner e runbook.

### Registrar achado sem evidência

A ação fica subjetiva.

### Criar severidade pelo esforço de correção

Severidade representa risco, não dificuldade.

### Corrigir tudo durante a revisão

O escopo se perde e a evidência fica confusa.

### Chamar fake provider de produção

As limitações do laboratório precisam continuar visíveis.

---

## Comandos úteis

### Baseline

```powershell
.\mvnw.cmd clean verify
```

### Testes críticos

```powershell
.\mvnw.cmd `
  -Dtest=*Outbox*,*Inbox*,*Redelivery*,*Idempotency*,*Timeout*,*Review* `
  test
```

### Buscar contratos

```powershell
git grep `
  -n `
  -E `
  "service-order.scheduled.v1|m16.service-order.events.v1|Idempotency-Key|X-Correlation-Id"
```

### Buscar riscos

```powershell
git grep `
  -n `
  -E `
  "Authorization|payload=|body=|Thread.sleep|KafkaTemplate"
```

### Status

```powershell
git status
git diff --check
```

---

## Exercício guiado

### Parte 1 — Jornada

Desenhe todas as fronteiras.

### Parte 2 — Contratos

Crie o inventário.

### Parte 3 — Garantias

Classifique entrega e efeito.

### Parte 4 — Atomicidade

Revise Outbox e Inbox.

### Parte 5 — Idempotência

Revise as quatro identidades.

### Parte 6 — Erros

Crie a matriz.

### Parte 7 — Segurança

Execute o checklist.

### Parte 8 — Testes

Associe evidências.

### Parte 9 — Achados

Classifique severidade.

### Parte 10 — Decisão

Aprove, aprove com ações ou rejeite.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 499 foi preservada;
- escopo da revisão parte 1 foi definido;
- fora do escopo foi definido;
- baseline foi executada;
- ambiente foi registrado;
- jornada completa foi desenhada;
- boundaries foram inventariados;
- contratos foram inventariados;
- HTTP inbound foi revisado;
- request foi revisado;
- response foi revisado;
- Location foi revisado;
- correlation headers foram revisados;
- evento foi revisado;
- eventId foi revisado;
- eventType foi revisado;
- eventVersion foi revisado;
- payload foi revisado;
- dados sensíveis foram revisados;
- topic foi revisado;
- key foi revisada;
- partitions foram revisadas;
- headers Kafka foram revisados;
- Outbox foi revisada;
- atomicidade da Outbox foi verificada;
- claim da Outbox foi revisado;
- retry da Outbox foi revisado;
- Inbox foi revisada;
- ack depois do commit foi verificado;
- deduplicação foi revisada;
- worker separado foi revisado;
- claim da Inbox foi revisado;
- garantia de transporte foi definida;
- garantia de efeito foi definida;
- exactly-once global não foi prometido;
- matriz de garantias foi criada;
- idempotência da OS foi revisada;
- idempotência do evento foi revisada;
- idempotência do consumer foi revisada;
- idempotência do provider foi revisada;
- retries foram revisados;
- backoff foi revisado;
- máximo de tentativas foi revisado;
- Retry-After foi revisado;
- erros transitórios foram classificados;
- erros permanentes foram classificados;
- resposta ambígua foi revisada;
- connect timeout foi revisado;
- read timeout foi revisado;
- budget total foi considerado;
- quarantine foi revisada;
- reason codes foram revisados;
- mensagens de erro foram revisadas;
- segredos foram revisados;
- token externalizado foi verificado;
- logs de Authorization foram proibidos;
- payload bruto foi proibido;
- Actuator foi revisado em segurança;
- matriz de testes foi criada;
- happy path foi listado;
- rollback foi listado;
- redelivery foi listada;
- timeout pós-aceite foi listado;
- idempotency conflict foi listado;
- restart foi listado;
- teste de contrato foi criado;
- teste de segurança foi criado;
- testes direcionados foram executados;
- gate completo foi executado;
- achados foram registrados;
- severidades foram definidas;
- evidências foram associadas;
- decisão de revisão foi registrada;
- limitações foram documentadas;
- monitoramento completo não foi antecipado;
- arquitetura final não foi antecipada;
- prova prática não foi antecipada;
- refatoração final não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 501 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka `
  docs/architecture/review-integrations `
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
git commit -m "test(m16): revisar integracoes parte 1"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- payload real;
- evidência com dado pessoal;
- logs completos;
- banco H2;
- diretório data;
- target;
- correção estrutural fora do escopo;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você não adicionou uma nova integração.

Você fez algo igualmente importante:

```text
parou;

mapeou;

questionou;

testou;

classificou;

registrou.
```

A revisão comprovou que uma integração precisa ser avaliada como uma cadeia.

Não basta revisar somente:

- controller;
- producer;
- consumer;
- provider.

É necessário revisar:

```text
identidade;

contrato;

transação;

entrega;

efeito;

falha;

retry;

segurança;

evidência.
```

Você comprovou que:

- boundaries precisam ser inventariados;
- contrato inclui body, headers, status, topic e key;
- at-least-once exige idempotência;
- Outbox protege o dual write local;
- Inbox protege a recepção durável;
- unique constraints são autoridades de deduplicação;
- retry só pertence a falhas transitórias;
- timeout pode ser ambíguo;
- quarantine precisa de owner;
- segredo e payload precisam ser minimizados;
- testes são evidências da revisão;
- limitações precisam ser declaradas.

A próxima aula será:

```text
501 - M16.46 - Revisao integracoes parte 2
```

Nela, você irá revisar:

- logs de correlação;
- MDC;
- propagação de contexto;
- métricas;
- cardinalidade;
- consumer lag;
- Outbox backlog;
- Inbox backlog;
- alertas;
- dashboards;
- health;
- runbooks;
- modularidade;
- custo operacional;
- readiness;
- decisão final da revisão.

Nenhum conteúdo da prova prática ou da refatoração final foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Executei a baseline.
- [ ] Inventariei boundaries e contratos.
- [ ] Revisei Outbox e Inbox.
- [ ] Revisei idempotência e retry.
- [ ] Revisei erros e timeouts.
- [ ] Revisei quarantine e segurança.
- [ ] Registrei achados com evidências.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A baseline falha antes da revisão

Registre a falha e corrija somente o necessário para recuperar a baseline.

### Não sei se um item é contrato

Pergunte se outro componente depende desse valor ou comportamento.

### A matriz promete exactly-once

Substitua pela garantia real: at-least-once mais idempotência.

### Não encontro evidência da atomicidade

Crie ou localize um teste que force rollback entre as duas gravações.

### Todo erro foi classificado como transitório

Revise 4xx, schema inválido e idempotency conflict.

### A mesma key muda depois de timeout

A identidade está sendo gerada por tentativa e precisa ser corrigida.

### A quarantine possui payload completo

Reduza para IDs técnicos, reason code e erro limitado.

### A busca por Authorization encontra configuração

Classifique o resultado; configuração não é automaticamente vazamento.

### Existem muitos achados BLOCKER

Revise impacto e probabilidade, sem reduzir severidade para facilitar aprovação.

### A revisão começa a refatorar toda a aplicação

Registre o achado e preserve o escopo.

---

## Perguntas de revisão

1. O que é boundary?
2. O que é contrato?
3. O que é garantia de transporte?
4. O que é garantia de efeito?
5. Qual garantia Kafka oferece no projeto?
6. Existe exactly-once global?
7. O que a Outbox protege?
8. O que a Inbox protege?
9. Qual é a dedup key do consumer?
10. Qual é a idempotency key HTTP?
11. O que é falha transitória?
12. O que é falha permanente?
13. Por que timeout é ambíguo?
14. Como repetir após timeout?
15. O que vai para quarantine?
16. Token pode entrar em log?
17. O que é evidência de revisão?
18. O que significa BLOCKER?
19. A revisão final terminou?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fronteira de responsabilidade.
2. Acordo de comunicação.
3. Quantas entregas podem ocorrer.
4. Quantos efeitos lógicos ocorrem.
5. At-least-once.
6. Não.
7. Dual write local.
8. Recepção durável.
9. consumerName + eventId.
10. sourceEventId.
11. Pode melhorar sem alterar o request.
12. Repetir não resolve.
13. O provider pode ter aceitado.
14. Com a mesma key.
15. Falha terminal com evidência.
16. Não.
17. Teste, constraint ou configuração.
18. Risco crítico imediato.
19. Não.
20. Revisao integracoes parte 2.

---

## Desafio opcional

Revise um segundo fluxo do laboratório:

```text
reprocessamento seguro.
```

Crie:

- boundary inventory;
- contrato de execução;
- garantia de efeito;
- matriz de falha;
- checklist de segurança;
- testes;
- achados;
- decisão.

Não altere offsets produtivos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 500 - M16.45 - Revisao integracoes parte 1

- Continuei após a integração HTTP externa fake.
- Iniciei a revisão técnica consolidada de integrações.
- Executei a baseline do projeto.
- Registrei ambiente, commit e resultado.
- Desenhei a jornada completa da OS.
- Inventariei boundaries.
- Inventariei contratos.
- Revisei o endpoint de criação da OS.
- Revisei request, response e headers.
- Revisei `service-order.scheduled.v1`.
- Revisei eventId, eventType e eventVersion.
- Revisei o topic `m16.service-order.events.v1`.
- Revisei `serviceOrderId` como key.
- Revisei headers Kafka.
- Revisei atomicidade da Outbox.
- Revisei claim, retry e stale recovery.
- Revisei a Inbox.
- Revisei ack depois do commit.
- Revisei deduplicação por consumerName e eventId.
- Diferenciei garantia de transporte e garantia de efeito.
- Mantive at-least-once sem prometer exactly-once global.
- Revisei idempotência da OS, evento, consumer e provider.
- Revisei backoff e máximo de tentativas.
- Revisei Retry-After.
- Classifiquei falhas transitórias, permanentes e ambíguas.
- Revisei connect timeout e read timeout.
- Revisei quarantine.
- Revisei reason codes e erro limitado.
- Revisei segredos, payloads e headers.
- Criei matriz de testes de resiliência.
- Criei testes de contrato e segurança.
- Executei testes críticos.
- Registrei achados com severidade e evidência.
- Documentei limitações do laboratório.
- Não antecipei observabilidade e arquitetura da parte 2.
- Próxima aula: Revisao integracoes parte 2.
```

---

## Referência técnica curta

- HTTP Semantics.
- Spring RestClient.
- Apache Kafka Delivery Semantics.
- Transactional Outbox Pattern.
- Transactional Inbox Pattern.
- Idempotent Consumer Pattern.
- Idempotency Key Pattern.
- Retry with Exponential Backoff.
- Quarantine Pattern.
- OWASP Logging and Secrets Guidance.

Regra final:

```text
a revisão de integrações parte 1 avalia a cadeia completa antes de aprovar o sistema: boundaries e contratos precisam ser inventariados, e contrato inclui body, headers, status, topic, key e versão; Kafka, Outbox, Inbox, workers e HTTP operam com at-least-once, enquanto unique constraints, eventId, consumerName e sourceEventId reduzem múltiplas tentativas a um efeito lógico; atomicidade existe somente dentro de transações locais, timeouts e falhas de transporte podem ser ambíguos e precisam repetir a mesma idempotency key; retries pertencem a falhas transitórias, falhas permanentes e conflitos seguem para quarantine com reason code e evidência; segredos, payloads e IDs sensíveis permanecem fora de logs e métricas; testes, constraints e configurações sustentam os achados, e limitações do laboratório impedem confundir uma implementação didática validada com uma solução produtiva já aprovada.
```
