# 501 - M16.46 - Revisao integracoes parte 2

## Apresentação da aula

Na aula 500, você iniciou a revisão consolidada das integrações construídas ao longo do módulo.

A primeira parte concentrou:

```text
boundaries;

contratos;

HTTP;

Kafka;

Outbox;

Inbox;

idempotência;

retries;

timeouts;

classificação de erros;

quarantine;

segurança;

testes de resiliência.
```

A jornada revisada foi:

```text
POST /service-orders;

service_order;

outbox_event;

m16.service-order.events.v1;

notification_inbox_message;

service_order_notification_intent;

NotificationDispatchWorker;

HttpNotificationProvider;

Fake External Notification API.
```

A revisão comprovou que o sistema utiliza:

```text
at-least-once
no transporte;

idempotência
para limitar o efeito lógico;

transações locais
para proteger cada boundary;

quarantine
para preservar falhas terminais.
```

Ainda falta revisar uma dimensão essencial:

```text
como perceber,
investigar
e operar a integração
quando ela degrada?
```

Um sistema pode possuir contratos corretos e ainda ser difícil de operar.

Exemplos:

- correlation ID não atravessa uma thread;
- MDC vaza entre requisições;
- métricas usam tags de alta cardinalidade;
- consumer lag é interpretado como processamento concluído;
- Outbox backlog cresce sem alerta;
- Inbox backlog fica invisível;
- health derruba instâncias por um threshold inadequado;
- alerta não possui runbook;
- dashboard mostra volume, mas não idade do backlog;
- módulo de aplicação importa infraestrutura;
- owner não está definido;
- ninguém sabe quando o sistema está pronto para produção.

A pergunta central desta aula será:

```text
como concluir a revisão
avaliando observabilidade,
operabilidade,
modularidade
e readiness?
```

A segunda parte revisará:

```text
logs estruturados;

correlationId;

messageId;

causationId;

replayRunId;

MDC;

propagação entre threads;

métricas;

counters;

timers;

gauges;

cardinalidade;

Kafka lag;

Outbox backlog;

Inbox backlog;

idade do item mais antigo;

health;

alertas;

dashboards;

runbooks;

ownership;

boundaries;

custo operacional;

decisão final.
```

Esta aula não adicionará uma nova integração.

Ela também não realizará a prova prática da aula 502.

O objetivo é produzir uma conclusão verificável sobre o estado atual do projeto.

A decisão final do laboratório será expressa por um status:

```text
APPROVED;

APPROVED_WITH_ACTIONS;

REJECTED.
```

A expectativa será:

```text
APPROVED_WITH_ACTIONS.
```

Essa decisão significa:

```text
o desenho didático
está coerente;

os cenários críticos
estão cobertos;

a jornada funciona
dentro do laboratório;

mas existem ações
antes de uma adoção produtiva.
```

A aula também diferenciará:

```text
functional readiness;

operational readiness;

production readiness.
```

#### Functional readiness

O fluxo entrega o resultado esperado.

#### Operational readiness

A equipe consegue detectar, investigar e recuperar falhas.

#### Production readiness

Além de funcionar e ser operável, o sistema possui infraestrutura, segurança, capacidade, governança e suporte adequados ao ambiente real.

O laboratório alcançará:

```text
functional readiness:
sim.

operational readiness:
parcial e documentada.

production readiness:
não.
```

As limitações permanecerão explícitas:

- broker com uma réplica;
- aplicação e fake provider no mesmo runtime;
- banco local;
- token didático;
- ausência de TLS real;
- ausência de secret manager;
- sem teste de carga representativo;
- sem teste de caos real;
- sem infraestrutura multi-zona;
- sem política corporativa de retenção;
- sem escala de suporte;
- sem SLO aprovado pelo negócio.

A revisão final não esconderá essas limitações.

A próxima aula será:

```text
502 - M16.47 - Prova pratica integracoes
```

Nela, você receberá um desafio de implementação e validação.

Nesta aula, nenhum enunciado ou solução da prova será antecipado.

Ao final, você deverá explicar:

```text
como logs e métricas
se complementam;

por que correlationId
não deve ser tag;

por que MDC
precisa ser limpo;

por que Kafka lag
não substitui Inbox backlog;

por que backlog age
é um SLI importante;

como revisar alertas;

como revisar runbooks;

como validar boundaries;

como diferenciar
laboratório validado
de sistema production-ready;

como registrar
a decisão final.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

A aula 500 respondeu:

```text
os contratos,
as garantias
e as políticas de falha
estão coerentes?
```

A aula 501 responderá:

```text
a integração é observável,
operável,
modular
e suficientemente pronta
para o objetivo do laboratório?
```

Nesta aula:

```text
logs:
revisados.

MDC:
revisado.

correlação:
revisada.

métricas:
revisadas.

cardinalidade:
revisada.

Kafka lag:
revisado.

Outbox backlog:
revisado.

Inbox backlog:
revisado.

health:
revisado.

alertas:
revisados.

dashboards:
revisados.

runbooks:
revisados.

boundaries:
revisados.

ownership:
revisado.

readiness:
avaliada.

decisão final:
registrada.

nova feature:
não.

prova prática:
não.

refatoração final:
não.
```

A regra central será:

```text
observabilidade mostra
o que está acontecendo;

operabilidade define
como agir;

arquitetura define
quem é responsável;

readiness reúne
essas evidências.
```

---

## Objetivo prático

Ao final, o projeto terá:

```text
docs/architecture/review-integrations
├── INTEGRATION_REVIEW_PART2.md
├── OBSERVABILITY_REVIEW.md
├── CARDINALITY_REVIEW.md
├── OPERABILITY_REVIEW.md
├── MODULARITY_REVIEW.md
├── READINESS_SCORECARD.md
├── READINESS_DECISION.md
└── REVIEW_FINDINGS_PART2.md
```

Testes de revisão:

```text
src/test/java/br/com/formacao/m16/review
├── IntegrationObservabilityReviewTest.java
└── IntegrationArchitectureReviewTest.java
```

Você irá:

1. confirmar a baseline;
2. revisar logs estruturados;
3. revisar IDs de correlação;
4. revisar scopes MDC;
5. revisar propagação assíncrona;
6. revisar dados proibidos em logs;
7. revisar nomes de métricas;
8. revisar counters;
9. revisar timers;
10. revisar gauges;
11. revisar cardinalidade;
12. revisar métricas Kafka;
13. revisar consumer lag;
14. revisar Outbox backlog;
15. revisar Inbox backlog;
16. revisar poison e quarantine;
17. revisar replay;
18. revisar health;
19. revisar alertas;
20. revisar dashboards;
21. revisar runbooks;
22. revisar ownership;
23. revisar módulos;
24. revisar dependências;
25. construir scorecard;
26. registrar achados;
27. registrar decisão final;
28. executar o gate;
29. commitar;
30. preparar a prova prática.

---

## Conceito essencial

### Observabilidade

Observabilidade é a capacidade de compreender o estado interno do sistema pelos sinais produzidos.

Os sinais mais comuns são:

```text
logs;

métricas;

traces.
```

O laboratório implementou logs e métricas.

Tracing distribuído não foi instalado.

---

### Logs

Logs explicam eventos específicos.

Exemplo:

```text
correlationId=C-1
event=notification.dispatch.retry_scheduled
reasonCode=PROVIDER_RATE_LIMITED
attempt=2
```

Eles respondem:

```text
o que ocorreu
com esta jornada?
```

---

### Métricas

Métricas agregam comportamento.

Exemplo:

```text
taxa de retries;

p95 de duração;

Outbox pendente;

Inbox oldest age;

quarantine count.
```

Elas respondem:

```text
o sistema está degradando?
```

---

### Correlation ID

`correlationId` identifica a jornada distribuída.

Ele deve permanecer em:

```text
HTTP inbound;

Outbox;

Kafka;

Inbox;

worker;

dispatcher;

HTTP outbound.
```

Ele pertence a logs e traces.

Normalmente não pertence a tags de métricas.

---

### Message ID

`messageId` identifica uma interação específica.

No evento Kafka:

```text
messageId = eventId.
```

Na chamada HTTP:

```text
messageId = requestId.
```

---

### Causation ID

`causationId` aponta para a interação causadora.

Ele permite navegar:

```text
request HTTP;

evento;

processamento;

chamada ao provider.
```

---

### MDC

MDC associa campos à thread atual.

Ele não atravessa automaticamente:

- processos;
- Kafka;
- bancos;
- executors;
- schedulers;
- novas threads.

Cada boundary precisa reconstruir o contexto.

---

### Vazamento de MDC

Threads são reutilizadas.

Se o contexto não for limpo:

```text
requisição B
pode receber IDs
da requisição A.
```

A proteção é:

```text
scope;

try/finally;

restauração;

TaskDecorator;

testes.
```

---

### Counter

Counter mede ocorrências acumuladas.

Exemplos:

- sucessos;
- falhas;
- poison messages;
- duplicatas;
- retries;
- quarantines.

Ele não representa o valor atual do backlog.

---

### Timer

Timer mede:

```text
quantidade;

duração.
```

Exemplos:

- publish Outbox;
- process Inbox;
- dispatch;
- HTTP client.

---

### Gauge

Gauge representa estado atual.

Exemplos:

- Outbox pending;
- Inbox ready;
- notification retry wait;
- quarantine count;
- oldest age;
- replay running.

---

### Cardinalidade

Cada combinação de tags gera uma série.

Tags com valores ilimitados criam alta cardinalidade.

Proibidas:

```text
correlationId;

messageId;

eventId;

orderId;

customerId;

intentId;

replayRunId;

exceptionMessage;

rawUrl;

payload.
```

Permitidas quando controladas:

```text
component;

operation;

outcome;

eventType;

reasonCode;

mode;

channel;

consumerName allowlisted.
```

---

### Consumer lag

Consumer lag mede a diferença entre:

```text
log end offset;

committed offset.
```

Ele indica trabalho ainda não confirmado pelo group.

No Inbox Pattern:

```text
lag pode chegar a zero;

mas a Inbox
ainda pode estar acumulada.
```

Portanto:

```text
Kafka lag
e Inbox backlog
são sinais diferentes.
```

---

### Backlog count

Mostra quantos itens aguardam.

Ele ajuda na capacidade.

Não revela sozinho a urgência.

---

### Backlog age

Mostra há quanto tempo o item mais antigo aguarda.

Exemplo:

```text
1 item há 3 horas
```

pode ser mais crítico que:

```text
500 itens há 2 segundos.
```

Count e age precisam aparecer juntos.

---

### Health

Health endpoint descreve a condição da instância ou dependências.

Readiness responde:

```text
a instância deve receber tráfego?
```

Nem todo backlog deve derrubar readiness.

Retirar todas as instâncias por backlog pode impedir a recuperação.

---

### Alerta

Alerta deve ser acionável.

Ele precisa de:

- condição;
- duração;
- impacto;
- severidade;
- owner;
- runbook;
- ação inicial.

Um alerta sem ação é apenas ruído.

---

### Dashboard

Dashboard organiza sinais.

Ele não substitui:

- alerta;
- runbook;
- investigação;
- ownership;
- SLO.

Um painel bonito sem decisão operacional não torna o sistema operável.

---

### Runbook

Runbook descreve como investigar e recuperar.

Ele deve conter:

- significado;
- impacto;
- queries;
- logs;
- métricas;
- ações permitidas;
- ações proibidas;
- escalonamento;
- critério de encerramento.

---

### Modularidade

O laboratório utiliza um monólito modular.

Módulos:

```text
serviceorder;

scheduling;

notification;

audit.
```

Boundaries precisam ser preservados mesmo sem processos separados.

---

### Readiness

Readiness será avaliada em dimensões:

```text
funcional;

contratos;

resiliência;

idempotência;

observabilidade;

operabilidade;

segurança;

testes;

arquitetura;

infraestrutura.
```

Uma única nota não substitui os detalhes.

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
- Java;
- profile;
- testes;
- resultado;
- duração;
- alterações locais.

A revisão parte 2 começa com baseline verde.

---

### 2. Criar documento principal

Arquivo:

```text
docs/architecture/review-integrations/INTEGRATION_REVIEW_PART2.md
```

Estrutura:

```markdown
# Revisão de integrações — parte 2

## Escopo

## Baseline

## Observabilidade

## Operabilidade

## Modularidade

## Readiness

## Achados

## Decisão final
```

---

### 3. Revisar a taxonomia de logs

Arquivo:

```text
OBSERVABILITY_REVIEW.md
```

Confirme eventos como:

```text
http.request.started;

outbox.publish.started;

outbox.publish.completed;

notification.inbox.ingested;

notification.processing.completed;

notification.dispatch.started;

notification.dispatch.accepted;

notification.dispatch.retry_scheduled;

notification.dispatch.quarantined.
```

Cada evento deve possuir:

```text
event;

outcome;

reasonCode quando aplicável;

attempt quando aplicável.
```

---

### 4. Revisar correlação ponta a ponta

Crie uma tabela:

```markdown
| Boundary | correlationId | messageId | causationId |
|---|---|---|---|
| HTTP inbound | Recebido ou gerado | Request ID | Opcional |
| Outbox event | Preservado | Event ID | Request ID |
| Kafka consumer | Header/evento | Event ID | Request ID |
| Inbox worker | Persistido | Event ID | Persistido |
| Dispatcher | Persistido | Event ID | Persistido |
| HTTP outbound | Preservado | Novo request ID | Event ID |
```

Confirme que o `correlationId` não muda.

---

### 5. Revisar o filtro HTTP

Checklist:

```markdown
- [ ] Gera correlation ID ausente.
- [ ] Gera request ID ausente.
- [ ] Valida tamanho.
- [ ] Valida caracteres.
- [ ] Devolve IDs na resposta.
- [ ] Abre CorrelationScope.
- [ ] Fecha em finally.
- [ ] Não registra header rejeitado completo.
```

Evidência:

```text
CorrelationHttpFilterTest.
```

---

### 6. Revisar CorrelationScope

Confirme:

- salva contexto anterior;
- limpa antes de aplicar;
- ignora valores nulos;
- restaura contexto anterior;
- aceita scopes aninhados;
- close duplicado não quebra;
- testes não deixam resíduos.

---

### 7. Revisar propagação assíncrona

Confirme:

```text
TaskDecorator;

scheduler cria contexto;

Inbox persiste IDs;

worker reconstrói;

dispatcher reconstrói.
```

Procure usos de:

```text
CompletableFuture;

Executor;

ThreadPoolTaskExecutor;

@Async.
```

Toda mudança de thread precisa de policy.

---

### 8. Revisar conteúdo dos logs

Proibido por padrão:

```text
Authorization;

token;

payload completo;

body HTTP completo;

documento;

e-mail;

telefone;

stacktrace no MDC;

SQL em campos de contexto.
```

Permitido:

```text
IDs técnicos;

event type;

operation;

outcome;

reason code;

attempt;

topic;

partition;

offset;

duration.
```

---

### 9. Criar revisão de cardinalidade

Arquivo:

```text
CARDINALITY_REVIEW.md
```

Tabela:

```markdown
| Campo | Log | Tag de métrica |
|---|---:|---:|
| component | Sim | Sim |
| operation | Sim | Sim |
| outcome | Sim | Sim |
| eventType controlado | Sim | Sim |
| reasonCode controlado | Sim | Sim |
| correlationId | Sim | Não |
| messageId | Sim | Não |
| eventId | Sim | Não |
| serviceOrderId | Quando necessário | Não |
| customerId | Não por padrão | Não |
| replayRunId | Sim | Não |
| exceptionMessage | Limitada | Não |
```

---

### 10. Revisar nomes de métricas

Confirme nomes centralizados:

```text
integration.messages;

integration.operation.duration;

integration.outbox.pending;

integration.outbox.failed;

integration.outbox.oldest.age;

integration.inbox.ready;

integration.inbox.retry.wait;

integration.inbox.failed.permanent;

integration.inbox.oldest.age;

integration.poison.messages;

integration.dedup.duplicates;

integration.replay.records;

integration.notification.dispatch;

integration.notification.quarantined.
```

Evite nomes criados dinamicamente.

---

### 11. Revisar counters

Confirme que counters representam eventos acumulados:

```text
success;

failure;

duplicate;

poison;

retry;

quarantine;

accepted;

already accepted.
```

Não use counter como backlog atual.

---

### 12. Revisar timers

Confirme timers para:

- Outbox publish;
- Inbox processing;
- notification dispatch;
- HTTP client;
- replay record quando aplicável.

Verifique:

- timer finalizado no sucesso;
- timer finalizado na falha;
- reason code controlado;
- histogram configurado apenas quando necessário.

---

### 13. Revisar gauges

Confirme gauges para:

```text
Outbox pending;

Outbox failed;

Outbox oldest age;

Inbox ready;

Inbox retry wait;

Inbox failed permanent;

Inbox oldest age;

Notification ready;

Notification retry wait;

Notification quarantined;

Notification oldest age;

Replay running;

Replay failed.
```

A fonte precisa usar consultas agregadas.

Não carregue entidades completas para contar.

---

### 14. Revisar consumer lag

Registre:

```text
fonte da métrica;

consumer group;

topic;

partitions;

threshold;

janela;

runbook.
```

Confirme o group:

```text
m16-notification-service-order-v1.
```

Não use correlation ID ou partition individual ilimitada como label de alerta sem necessidade.

---

### 15. Revisar Outbox backlog

Perguntas:

```text
quantos PENDING?

quantos FAILED?

qual oldest age?

há publicação recente?

há stale claims?

Kafka está disponível?

o backlog está diminuindo?
```

Alerta forte:

```text
pending > 0
e
success rate = 0
por uma janela sustentada.
```

---

### 16. Revisar Inbox backlog

Perguntas:

```text
quantos RECEIVED?

quantos RETRY_WAIT?

quantos FAILED_PERMANENT?

qual oldest age?

worker está ativo?

claims estão presas?
```

Lag zero não encerra essa revisão.

---

### 17. Revisar notification backlog

Estados:

```text
READY_TO_SEND;

SENDING;

RETRY_WAIT;

SENT;

QUARANTINED.
```

Sinais:

- ready count;
- retry count;
- quarantine count;
- oldest ready age;
- dispatch success rate;
- p95;
- stale claims.

---

### 18. Revisar poison e quarantine

Diferencie:

```text
poison message:

problema no evento ou consumo.

dispatch quarantine:

problema na entrega ao provider.
```

Cada fluxo precisa de:

- reason code;
- owner;
- retenção;
- runbook;
- política de reprocessamento.

---

### 19. Revisar replay

Confirme que as métricas de replay são agregadas.

Permitido:

```text
mode;

outcome;

status.
```

Proibido como tag:

```text
runId.
```

O runId permanece nos logs e endpoints.

---

### 20. Revisar Actuator

Confirme exposição limitada:

```text
health;

info;

metrics;

prometheus.
```

Verifique:

- detalhes de health protegidos;
- ambiente produtivo não expõe endpoints desnecessários;
- nenhuma credencial aparece;
- URI de client HTTP permanece templated;
- métricas próprias aparecem.

---

### 21. Revisar health e readiness

Arquivo:

```text
OPERABILITY_REVIEW.md
```

Avalie:

```text
backlog alto
deve marcar health DOWN?

deve retirar readiness?

qual condição
impede atendimento HTTP?

qual condição
apenas degrada async?
```

Decisão do laboratório:

```text
backlog crítico
pode aparecer em health;

readiness não deve
ser derrubada automaticamente
sem política específica.
```

---

### 22. Revisar alertas

Checklist:

```markdown
- [ ] Possui expressão.
- [ ] Possui `for`.
- [ ] Possui severidade.
- [ ] Possui summary.
- [ ] Possui runbook.
- [ ] Possui owner.
- [ ] Não depende de ID único.
- [ ] Evita alertar sem trabalho.
- [ ] Possui critério de resolução.
```

Revise:

- Outbox oldest age;
- Inbox oldest age;
- poison detected;
- notification quarantine;
- no progress;
- consumer lag;
- provider error ratio.

---

### 23. Revisar dashboards

Painéis mínimos:

```text
Overview;

Outbox;

Kafka consumers;

Inbox;

Notification dispatch;

Poison and quarantine;

Replay;

Dependencies.
```

Cada painel precisa combinar:

```text
rate;

errors;

duration;

backlog;

oldest age.
```

---

### 24. Revisar runbooks

Confirme runbooks para:

- Outbox backlog;
- Inbox backlog;
- poison;
- quarantine;
- provider 429;
- provider timeout;
- provider 409;
- stale claim;
- replay;
- auth failure.

Ação proibida precisa estar explícita.

Exemplo:

```text
não marcar SENT manualmente.
```

---

### 25. Revisar ownership

Crie tabela:

```markdown
| Capacidade | Owner lógico | Dados | Sinal principal |
|---|---|---|---|
| Service Order | serviceorder | service_order | create success |
| Event publication | serviceorder/outbox | outbox_event | oldest pending |
| Notification ingestion | notification | notification_inbox_message | oldest ready |
| Notification dispatch | notification | notification_intent | oldest send |
| Fake provider | external fake | fake delivery | HTTP outcomes |
```

Em produção, substitua owners lógicos por times reais.

---

### 26. Revisar modularidade

Arquivo:

```text
MODULARITY_REVIEW.md
```

Confirme:

- application service não importa KafkaTemplate;
- application service não importa RestClient;
- notification provider é port;
- adapters ficam na infraestrutura;
- módulos não importam `.internal` de outros;
- dados possuem owner;
- nenhum módulo escreve tabela de outro diretamente;
- contratos públicos ficam em `.api`;
- consumer depende do contrato do evento, não da entidade JPA.

---

### 27. Revisar sinais de monólito distribuído

Mesmo sendo monólito modular, registre sinais futuros:

- deploy coordenado obrigatório;
- banco com escrita cruzada;
- chamada remota em cascata;
- contratos não versionados;
- owner ambíguo;
- testes apenas ponta a ponta;
- mudanças em vários módulos sempre juntas.

O projeto atual não deve ser chamado de microsserviços.

---

### 28. Criar teste de observabilidade

Arquivo:

```text
IntegrationObservabilityReviewTest.java
```

```java
package br.com.formacao.m16.review;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.formacao.m16.kafka.monitoring.IntegrationMetricNames;
import java.util.Set;
import org.junit.jupiter.api.Test;

class IntegrationObservabilityReviewTest {

    @Test
    void shouldKeepMetricNamesStable() {
        Set<String> names =
            Set.of(
                IntegrationMetricNames.MESSAGES,
                IntegrationMetricNames
                    .OPERATION_DURATION,
                IntegrationMetricNames
                    .OUTBOX_PENDING,
                IntegrationMetricNames
                    .INBOX_READY,
                IntegrationMetricNames
                    .POISON_MESSAGES
            );

        assertThat(names)
            .doesNotContainNull()
            .allMatch(
                name ->
                    name.startsWith(
                        "integration."
                    )
            );
    }

    @Test
    void highCardinalityFieldsMustRemainForbidden() {
        Set<String> forbidden =
            Set.of(
                "correlationId",
                "messageId",
                "eventId",
                "orderId",
                "customerId",
                "replayRunId",
                "exceptionMessage"
            );

        assertThat(forbidden)
            .contains("correlationId")
            .contains("eventId");
    }
}
```

O segundo teste documenta a policy.

O teste estrutural da aula 500 procura usos indevidos.

---

### 29. Criar teste de arquitetura

Arquivo:

```text
IntegrationArchitectureReviewTest.java
```

Percorra os fontes e valide:

```text
serviceorder.application
não contém import KafkaTemplate;

serviceorder.application
não contém import RestClient;

notification.dispatch
depende de NotificationProvider;

notification.provider.http
pode conter RestClient;

outro módulo
não importa `.internal`.
```

Mantenha revisão manual para casos complexos.

---

### 30. Criar scorecard de readiness

Arquivo:

```text
READINESS_SCORECARD.md
```

Use notas:

```text
0:
ausente.

1:
parcial.

2:
adequado ao laboratório.

3:
adequado ao alvo produtivo.
```

Dimensões:

```text
contratos;

atomicidade;

idempotência;

resiliência;

observabilidade;

operabilidade;

segurança;

testes;

arquitetura;

infraestrutura;

capacidade;

governança.
```

Exemplo:

```markdown
| Dimensão | Nota | Evidência |
|---|---:|---|
| Contratos | 2 | Contract tests |
| Atomicidade | 2 | Rollback tests |
| Idempotência | 2 | Timeout test |
| Observabilidade | 2 | Metrics + logs |
| Infraestrutura | 1 | Single broker |
| Segurança | 1 | Token didático |
| Capacidade | 1 | Sem carga real |
```

---

### 31. Definir critérios bloqueantes

Mesmo com boa soma, estes itens podem bloquear produção:

- segredo hardcoded real;
- ausência de timeout;
- perda de mensagem conhecida;
- duplicidade financeira;
- ausência de owner;
- ausência de rollback;
- dados pessoais expostos;
- infraestrutura sem redundância exigida;
- falta de auditoria regulatória.

Score não substitui blockers.

---

### 32. Criar documento de decisão

Arquivo:

```text
READINESS_DECISION.md
```

Estrutura:

```markdown
# Decisão de readiness

## Status

APPROVED_WITH_ACTIONS.

## Aprovado para

- laboratório;
- estudo;
- demonstração;
- prova prática.

## Não aprovado para

- produção;
- dados reais;
- contato real;
- escala real.

## Evidências

## Ações obrigatórias antes de produção

## Riscos aceitos no laboratório

## Próxima revisão
```

---

### 33. Ações antes de produção

Registre:

1. broker redundante;
2. banco gerenciado ou HA;
3. TLS;
4. secret manager;
5. autenticação real;
6. autorização de Actuator;
7. schema migrations;
8. retenção;
9. backup;
10. teste de carga;
11. teste de caos;
12. SLO aprovado;
13. alertas em plataforma real;
14. dashboards implantados;
15. owners reais;
16. on-call;
17. DR;
18. compliance;
19. dados reais minimizados;
20. plano de rollback.

---

### 34. Criar achados parte 2

Arquivo:

```text
REVIEW_FINDINGS_PART2.md
```

Exemplo:

```markdown
| ID | Severidade | Área | Achado | Evidência | Ação |
|---|---|---|---|---|---|
| INT-501-001 | INFO | Correlation | Jornada preservada | Tests | Nenhuma |
| INT-501-002 | LOW | Readiness | Owners ainda lógicos | Docs | Definir times |
| INT-501-003 | MEDIUM | Infra | Broker de uma réplica | Docker | Redundância |
| INT-501-004 | MEDIUM | Security | Token didático | YAML | Secret manager |
```

Registre apenas achados observados.

---

### 35. Consolidar as partes 1 e 2

No documento principal, referencie:

```text
REVIEW_FINDINGS_PART1.md;

REVIEW_FINDINGS_PART2.md;

READINESS_DECISION.md.
```

Decisão final:

```text
APPROVED_WITH_ACTIONS.
```

Justificativa:

- happy path comprovado;
- falhas críticas testadas;
- idempotência comprovada;
- contratos inventariados;
- observabilidade implementada;
- operação documentada;
- limitações produtivas explícitas.

---

### 36. Executar testes direcionados

```powershell
.\mvnw.cmd `
  -Dtest=IntegrationObservabilityReviewTest,IntegrationArchitectureReviewTest,CorrelationScopeTest,MdcTaskDecoratorTest,IntegrationMetricsTest,IntegrationCardinalityPolicyTest,IntegrationBacklogHealthIndicatorTest,ServiceOrderMessagingEndToEndIntegrationTest,ServiceOrderExternalApiEndToEndIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

---

### 37. Inspecionar métricas

Com a aplicação ativa:

```powershell
$response =
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"

$response.Content |
  Select-String `
    "integration_"
```

Procure IDs proibidos:

```powershell
$response.Content |
  Select-String `
    "correlationId|messageId|eventId|orderId|customerId|replayRunId"
```

Resultado esperado:

```text
nenhuma tag dinâmica
com esses nomes.
```

---

### 38. Inspecionar logs

Execute uma jornada e busque o mesmo `correlationId`.

Confirme etapas:

```text
HTTP;

Outbox;

Kafka;

Inbox;

processing;

dispatch;

HTTP provider.
```

Confirme que o contexto é limpo depois.

---

## Entendendo o que foi feito

### Observabilidade foi revisada como cadeia

Logs e métricas não foram avaliados isoladamente.

### Correlação foi validada em cada boundary

O mesmo correlation ID permanece na jornada.

### MDC recebeu uma revisão de segurança

Limpeza e propagação foram tratadas como requisitos.

### Cardinalidade ganhou proteção explícita

IDs únicos ficaram fora das tags.

### Lag e backlog foram separados

Kafka, Inbox e notification possuem filas diferentes.

### Age ganhou prioridade operacional

O item mais antigo mostra urgência.

### Alertas foram ligados a runbooks

O sistema não apenas detecta; orienta ação.

### Modularidade entrou na revisão

Portas e adapters continuam protegendo a aplicação.

### Readiness ficou multidimensional

Funcionar não foi confundido com estar pronto para produção.

### A decisão ficou honesta

O laboratório foi aprovado com ações, não promovido indevidamente a production-ready.

---

## Erros comuns importantes

### Revisar apenas logs

Sem métricas, degradação agregada fica invisível.

### Revisar apenas métricas

Sem logs, investigação por jornada fica difícil.

### Usar correlation ID como tag

A cardinalidade explode.

### Interpretar lag zero como fluxo concluído

Inbox ou dispatcher podem continuar acumulados.

### Alertar por backlog sem idade

Picos saudáveis geram ruído.

### Derrubar readiness por qualquer falha assíncrona

A recuperação pode ficar pior.

### Criar dashboard sem owner

Ninguém age sobre os sinais.

### Aprovar produção pela nota média

Um blocker pode existir mesmo com score alto.

### Chamar owners lógicos de on-call real

Responsabilidade documental não substitui suporte.

### Ocultar limitações do laboratório

A decisão perde credibilidade.

### Antecipar a prova prática

A revisão precisa terminar antes do desafio.

---

## Comandos úteis

### Testes de revisão

```powershell
.\mvnw.cmd `
  -Dtest=*Review*,*Observability*,*Cardinality*,*Correlation* `
  test
```

### Buscar tags proibidas

```powershell
git grep `
  -n `
  -E `
  'tag\("(correlationId|messageId|eventId|orderId|customerId|replayRunId|exceptionMessage)"'
```

### Buscar boundaries

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|RestClient|NotificationProvider|ServiceOrderEventPublisher"
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Status

```powershell
git status
git diff --check
```

---

## Exercício guiado

### Parte 1 — Logs

Revise eventos e campos.

### Parte 2 — Correlação

Valide IDs em cada boundary.

### Parte 3 — MDC

Revise cleanup e async.

### Parte 4 — Métricas

Revise counters, timers e gauges.

### Parte 5 — Backlogs

Separe Kafka, Inbox e notification.

### Parte 6 — Operação

Revise health, alertas e runbooks.

### Parte 7 — Arquitetura

Revise portas, adapters e ownership.

### Parte 8 — Scorecard

Avalie readiness.

### Parte 9 — Achados

Classifique evidências.

### Parte 10 — Decisão

Registre `APPROVED_WITH_ACTIONS`.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 500 foi preservada;
- escopo da revisão parte 2 foi definido;
- baseline foi executada;
- logs estruturados foram revisados;
- eventos de log foram inventariados;
- correlationId foi revisado;
- messageId foi revisado;
- causationId foi revisado;
- replayRunId foi revisado;
- HTTP inbound foi revisado;
- Outbox correlation foi revisada;
- Kafka headers foram revisados;
- Inbox correlation foi revisada;
- dispatcher correlation foi revisada;
- HTTP outbound foi revisado;
- filtro HTTP foi revisado;
- policy de valores foi revisada;
- CorrelationScope foi revisado;
- contexto anterior foi revisado;
- cleanup foi revisado;
- scopes aninhados foram revisados;
- TaskDecorator foi revisado;
- schedulers foram revisados;
- payload em log foi proibido;
- Authorization em log foi proibida;
- stacktrace no MDC foi proibido;
- cardinalidade foi revisada;
- tabela de campos foi criada;
- correlationId não virou tag;
- messageId não virou tag;
- eventId não virou tag;
- orderId não virou tag;
- customerId não virou tag;
- replayRunId não virou tag;
- exceptionMessage não virou tag;
- nomes de métricas foram revisados;
- counters foram revisados;
- timers foram revisados;
- gauges foram revisados;
- queries agregadas foram revisadas;
- consumer lag foi revisado;
- consumer group foi identificado;
- lag foi diferenciado de Inbox backlog;
- Outbox backlog foi revisado;
- Outbox oldest age foi revisado;
- Inbox backlog foi revisado;
- Inbox oldest age foi revisado;
- notification backlog foi revisado;
- notification oldest age foi revisado;
- poison foi diferenciado de quarantine;
- replay metrics foram revisadas;
- runId não virou tag;
- Actuator foi revisado;
- exposição limitada foi verificada;
- health foi revisado;
- readiness recebeu ressalva;
- alertas foram revisados;
- `for` foi revisado;
- severity foi revisada;
- runbook foi revisado;
- owner foi revisado;
- dashboard foi revisado;
- rate, errors, duration e backlog foram combinados;
- runbooks foram inventariados;
- ações proibidas foram verificadas;
- ownership foi documentado;
- módulos foram revisados;
- ports foram revisados;
- adapters foram revisados;
- application service não importa KafkaTemplate;
- application service não importa RestClient;
- `.internal` não é importado externamente;
- dados possuem owner;
- sinais de monólito distribuído foram registrados;
- teste de observabilidade foi criado;
- teste de arquitetura foi criado;
- teste de cardinalidade foi reutilizado;
- scorecard de readiness foi criado;
- critérios bloqueantes foram definidos;
- decisão de readiness foi criada;
- status APPROVED_WITH_ACTIONS foi registrado;
- escopo aprovado foi definido;
- escopo não aprovado foi definido;
- ações antes de produção foram listadas;
- achados parte 2 foram registrados;
- partes 1 e 2 foram consolidadas;
- testes direcionados foram executados;
- gate completo foi executado;
- métricas foram inspecionadas;
- logs foram inspecionados;
- prova prática não foi antecipada;
- refatoração final não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 502 está correta.

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
git commit -m "test(m16): revisar integracoes parte 2"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- payload real;
- dados pessoais;
- logs completos;
- banco H2;
- diretório data;
- target;
- dashboard com credenciais;
- solução da prova prática;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a revisão de integrações foi concluída.

A parte 1 revisou:

```text
contratos;

garantias;

atomicidade;

idempotência;

falhas;

timeouts;

segurança.
```

A parte 2 revisou:

```text
logs;

correlação;

MDC;

métricas;

cardinalidade;

lag;

backlogs;

alertas;

runbooks;

modularidade;

readiness.
```

Você comprovou que:

- logs explicam jornadas;
- métricas mostram tendência;
- correlation ID precisa atravessar boundaries;
- MDC precisa ser limpo;
- IDs únicos não pertencem a tags;
- Kafka lag não substitui Inbox backlog;
- backlog age revela urgência;
- health e readiness exigem políticas diferentes;
- alerta precisa de owner e runbook;
- ports e adapters preservam o domínio;
- scorecard não substitui blockers;
- o laboratório é funcional e parcialmente operável;
- infraestrutura e segurança ainda impedem aprovação produtiva.

A decisão final foi:

```text
APPROVED_WITH_ACTIONS.
```

Aprovado para:

- estudo;
- demonstração;
- laboratório;
- prova prática.

Não aprovado para:

- produção;
- dados reais;
- contatos reais;
- carga real;
- operação sem ações adicionais.

A próxima aula será:

```text
502 - M16.47 - Prova pratica integracoes
```

Nela, você receberá um desafio para demonstrar:

- contratos;
- HTTP;
- mensageria;
- Outbox;
- Inbox;
- idempotência;
- retry;
- correlação;
- monitoramento;
- testes;
- documentação.

Nenhum enunciado, resposta ou implementação da prova foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei logs e correlação.
- [ ] Revisei MDC e async.
- [ ] Revisei métricas e cardinalidade.
- [ ] Revisei lag e backlogs.
- [ ] Revisei alertas e runbooks.
- [ ] Revisei modularidade.
- [ ] Registrei readiness.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### correlationId desaparece no dispatcher

Confirme persistência na intent e reconstrução do scope.

### IDs aparecem nas métricas

Revise tags registradas e o teste de cardinalidade.

### Lag está zero, mas há atraso

Consulte Inbox e notification oldest age.

### Health está DOWN sem impacto HTTP

Revise se backlog deveria afetar readiness ou apenas health details.

### Alerta dispara sem trabalho

Combine backlog ou rate antes de alertar ausência de progresso.

### Dashboard não mostra retries

Confirme counter, tags controladas e query.

### Runbook manda alterar status manualmente

Remova a ação e use recovery ou reprocessamento aprovado.

### Scorecard ficou alto, mas há blocker

Blocker tem precedência sobre a média.

### Decisão diz production-ready

Revise limitações de infraestrutura, segurança e capacidade.

### A revisão começou a resolver a prova

Pare no readiness e preserve o escopo da aula 502.

---

## Perguntas de revisão

1. O que observabilidade permite?
2. O que logs respondem?
3. O que métricas respondem?
4. Para que serve correlationId?
5. MDC atravessa threads sozinho?
6. Por que limpar MDC?
7. O que é cardinalidade?
8. correlationId pode ser tag?
9. O que consumer lag mede?
10. Lag zero garante processamento?
11. O que backlog count mede?
12. O que backlog age mede?
13. O que torna alerta acionável?
14. Dashboard substitui runbook?
15. O que health responde?
16. O que readiness responde?
17. Qual arquitetura o laboratório usa?
18. Qual foi a decisão final?
19. O projeto está production-ready?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Compreender estado interno.
2. Casos específicos.
3. Tendências agregadas.
4. Identificar a jornada.
5. Não.
6. Evitar vazamento.
7. Quantidade de séries.
8. Não.
9. Distância do group.
10. Não.
11. Quantidade aguardando.
12. Idade do mais antigo.
13. Impacto, duração, owner e runbook.
14. Não.
15. Condição da instância.
16. Se deve receber tráfego.
17. Monólito modular.
18. APPROVED_WITH_ACTIONS.
19. Não.
20. Prova pratica integracoes.

---

## Desafio opcional

Crie uma revisão de readiness exclusiva para:

```text
reprocessamento seguro.
```

Inclua:

- logs;
- métricas;
- cardinalidade;
- alertas;
- runbook;
- owners;
- blockers;
- scorecard;
- decisão.

Não execute reset do group produtivo.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 501 - M16.46 - Revisao integracoes parte 2

- Continuei após a revisão de contratos e garantias.
- Executei a baseline da parte 2.
- Revisei eventos de log.
- Revisei correlationId, messageId e causationId.
- Revisei replayRunId.
- Validei a correlação em cada boundary.
- Revisei o filtro HTTP.
- Revisei CorrelationScope.
- Revisei cleanup e scopes aninhados.
- Revisei TaskDecorator.
- Revisei propagação em schedulers e workers.
- Proibi payload, token e Authorization nos logs.
- Revisei nomes de métricas.
- Revisei counters.
- Revisei timers.
- Revisei gauges.
- Revisei cardinalidade.
- Mantive IDs únicos fora das tags.
- Revisei métricas Kafka.
- Revisei consumer lag.
- Diferenciei lag e Inbox backlog.
- Revisei Outbox backlog e oldest age.
- Revisei Inbox backlog e oldest age.
- Revisei notification backlog.
- Diferenciei poison e quarantine.
- Revisei replay metrics.
- Revisei Actuator.
- Revisei health e readiness.
- Revisei alertas.
- Revisei dashboards.
- Revisei runbooks.
- Revisei ownership.
- Revisei módulos, ports e adapters.
- Verifiquei imports proibidos.
- Registrei sinais de monólito distribuído.
- Criei testes de observabilidade e arquitetura.
- Criei scorecard de readiness.
- Defini critérios bloqueantes.
- Registrei `APPROVED_WITH_ACTIONS`.
- Listei ações obrigatórias antes de produção.
- Consolidei os achados das duas partes.
- Confirmei que o laboratório não é production-ready.
- Não antecipei a prova prática.
- Próxima aula: Prova pratica integracoes.
```

---

## Referência técnica curta

- SLF4J MDC.
- Spring TaskDecorator.
- Spring Boot Actuator.
- Micrometer Metrics.
- Prometheus Labels and Cardinality.
- Apache Kafka Consumer Lag.
- Google SRE — SLIs and SLOs.
- Health and Readiness Probes.
- Modular Monolith.
- Production Readiness Review.

Regra final:

```text
a revisão de integrações parte 2 conclui a avaliação do laboratório pela dimensão operacional: correlationId, messageId e causationId precisam atravessar HTTP, Outbox, Kafka, Inbox, workers, dispatcher e provider, enquanto MDC exige scope, limpeza e propagação explícita entre threads; counters, timers e gauges medem volume, erro, duração e estado atual, mas IDs únicos permanecem nos logs para evitar alta cardinalidade; Kafka consumer lag mede o progresso do group e não substitui Outbox, Inbox ou notification backlog, por isso count e oldest age são revisados em cada estágio; alertas precisam de duração, severidade, owner e runbook, dashboards precisam combinar rate, errors, duration e saturation, e health não deve derrubar readiness sem uma política consciente; ports, adapters e ownership preservam a modularidade; o scorecard e os blockers resultam em APPROVED_WITH_ACTIONS para laboratório e prova prática, mas não em production readiness sem redundância, TLS, secret manager, carga, caos, SLOs, owners e governança reais.
```
