# 502 - M16.47 - Prova pratica integracoes

## Apresentação da aula

Esta aula é uma avaliação prática.

Até aqui, você construiu e revisou uma jornada completa de integrações:

```text
HTTP inbound;

transação local;

Outbox;

Kafka;

Inbox;

deduplicação;

worker;

dispatcher;

API HTTP externa fake;

idempotência;

retry;

quarantine;

correlação;

métricas;

runbooks.
```

Nas aulas 500 e 501, o projeto foi revisado em duas dimensões.

A primeira revisão avaliou:

- contratos;
- boundaries;
- atomicidade;
- garantias de entrega;
- idempotência;
- retries;
- timeouts;
- classificação de erros;
- quarantine;
- segurança.

A segunda revisão avaliou:

- logs;
- correlação;
- MDC;
- métricas;
- cardinalidade;
- consumer lag;
- backlogs;
- alertas;
- runbooks;
- modularidade;
- readiness.

Agora você deverá demonstrar que consegue aplicar esses conhecimentos em um cenário novo.

A prova não pedirá que você copie o fluxo:

```text
service-order.scheduled.v1.
```

O desafio será implementar uma extensão coerente:

```text
reagendamento de ordem de serviço.
```

O novo fato será:

```text
service-order.rescheduled.v1.
```

O fluxo esperado será:

```text
PUT /api/v1/service-orders/{id}/reschedule
        |
        v
Service Order module
        |
        +--> atualizar service_order
        |
        +--> gravar outbox_event
        |
        v
COMMIT
        |
        v
Outbox Publisher
        |
        v
m16.service-order.events.v1
        |
        v
Notification Consumer
        |
        v
Notification Inbox
        |
        v
Notification Processing
        |
        v
Reschedule Notification Intent
        |
        v
Dispatcher
        |
        v
Fake External Notification API
```

A implementação precisa reutilizar a arquitetura existente.

Você não deve criar:

- outro broker;
- outro sistema de Outbox;
- outra infraestrutura de Inbox;
- outro client HTTP genérico;
- outro modelo de correlação;
- outro padrão de métricas;
- um microsserviço separado;
- um segundo projeto Spring Boot.

A prova mede sua capacidade de evoluir uma integração existente sem quebrar:

```text
contratos;

garantias;

boundaries;

idempotência;

operabilidade.
```

O enunciado fornecerá:

- contexto;
- regras;
- contrato mínimo;
- cenários obrigatórios;
- restrições;
- critérios de aceite;
- pontuação;
- evidências esperadas.

Ele não fornecerá a solução completa.

A prova é individual.

Antes de iniciar:

1. faça commit ou stash do trabalho anterior;
2. confirme a baseline verde;
3. crie uma branch específica;
4. leia todo o enunciado;
5. desenhe a solução;
6. só depois altere código.

Branch sugerida:

```powershell
git switch `
  -c `
  "feature/m16-prova-integracoes"
```

Tempo sugerido:

```text
4 a 6 horas
para primeira execução;

mais tempo
para revisão e correção.
```

A pontuação total será:

```text
100 pontos.
```

Critério sugerido de aprovação:

```text
75 pontos;

sem falha bloqueante.
```

Uma solução com nota alta, mas que possua perda de mensagem ou duplicidade grave, não deve ser considerada aprovada.

Falhas bloqueantes incluem:

- atualizar a OS e perder o evento;
- publicar Kafka dentro da transação de negócio;
- confirmar o consumer antes da persistência durável;
- gerar nova idempotency key em retries;
- criar efeitos duplicados no provider;
- expor token em log;
- ignorar timeout;
- usar retry infinito;
- marcar `SENT` sem aceite do provider.

A próxima aula será:

```text
503 - M16.48 - Refatoracao final integracoes
```

Ela utilizará os resultados desta prova para melhorar o projeto.

Nesta aula, nenhuma refatoração final será antecipada.

---

## Onde estamos na formação

A sequência oficial é:

```text
500:
Revisao integracoes parte 1.

501:
Revisao integracoes parte 2.

502:
Prova pratica integracoes.

503:
Refatoracao final integracoes.
```

A prova avaliará os seguintes blocos:

```text
HTTP;

contrato de evento;

transação;

Outbox;

Kafka;

Inbox;

idempotência;

retry;

provider HTTP;

correlação;

métricas;

testes;

documentação.
```

Nesta aula:

```text
novo cenário:
sim.

implementação pelo aluno:
sim.

solução pronta:
não.

contrato mínimo:
sim.

critérios objetivos:
sim.

rubrica:
sim.

evidências:
sim.

autoavaliação:
sim.

refatoração final:
não.

resposta completa:
não.
```

A regra central será:

```text
a prova mede
o comportamento da solução;

não apenas
a quantidade de código.
```

---

## Objetivo prático

Ao final da prova, o projeto deverá suportar:

```text
reagendamento de OS;

evento de integração;

publicação confiável;

consumo durável;

notificação idempotente;

provider HTTP fake;

retry;

quarantine;

correlação;

monitoramento;

testes.
```

Artefatos mínimos sugeridos:

```text
src/main/java/br/com/formacao/m16/architecture/os
├── serviceorder
│   ├── api
│   ├── application
│   ├── event
│   ├── persistence
│   └── web
└── notification
    ├── consumer
    ├── inbox
    ├── processing
    ├── dispatch
    ├── provider
    └── quarantine
```

Documentação da prova:

```text
docs/architecture/prova-integracoes
├── SOLUTION_DESIGN.md
├── CONTRACT.md
├── FAILURE_MATRIX.md
├── TEST_EVIDENCE.md
└── SELF_REVIEW.md
```

Testes esperados:

```text
src/test/java/br/com/formacao/m16/exam
├── ServiceOrderRescheduleAtomicityTest.java
├── ServiceOrderReschedulePublishingTest.java
├── RescheduleNotificationDeduplicationTest.java
├── RescheduleNotificationRetryTest.java
├── RescheduleProviderIdempotencyTest.java
├── RescheduleCorrelationTest.java
└── RescheduleEndToEndTest.java
```

Os nomes podem variar.

O comportamento não pode variar.

---

## Conceito essencial

### Avaliação por evidência

Uma afirmação precisa de prova.

Exemplo inadequado:

```text
a Outbox é atômica.
```

Exemplo adequado:

```text
o teste força falha
depois da atualização da OS
e antes do commit;

resultado:

OS anterior preservada;

nenhuma Outbox criada.
```

A prova será avaliada por:

- código;
- testes;
- constraints;
- configuração;
- logs;
- métricas;
- documentação.

---

### Reutilização arquitetural

O cenário novo deve entrar nos mecanismos existentes.

Exemplo:

```text
Outbox genérica existente;

mesmo topic de eventos de OS;

mesma taxonomia de headers;

mesma Inbox do consumer lógico;

mesmo dispatcher;

mesmo NotificationProvider.
```

Não duplique infraestrutura para evitar compreender o desenho.

---

### Evolução compatível

O topic atual é:

```text
m16.service-order.events.v1.
```

Ele já transporta:

```text
service-order.scheduled.v1.
```

Agora transportará:

```text
service-order.rescheduled.v1.
```

O consumer precisa discriminar tipos de evento de forma explícita.

Não transforme um DTO em uma estrutura opcional com dezenas de campos nulos.

---

### Idempotência do comando HTTP

A requisição de reagendamento deve possuir uma identidade.

Header obrigatório:

```text
Idempotency-Key.
```

O mesmo header com o mesmo request deve retornar o resultado anterior ou um resultado semanticamente equivalente.

A mesma key com conteúdo diferente deve retornar:

```text
409 Conflict.
```

O armazenamento pode ser local ao módulo Service Order.

---

### Atomicidade

A operação de reagendamento deve confirmar juntos:

```text
novo período da OS;

nova versão da OS;

evento Outbox.
```

Se a Outbox falhar:

```text
o reagendamento
não pode permanecer aplicado.
```

---

### Ordenação

A key Kafka continuará:

```text
serviceOrderId.
```

Isso preserva a ordem local dos eventos da mesma OS.

O consumer não deve assumir ordem global entre OS diferentes.

---

### Deduplicação

O consumer utiliza:

```text
consumerName + eventId.
```

O efeito de notificação utiliza:

```text
sourceEventId.
```

O provider utiliza:

```text
sourceEventId
como Idempotency-Key.
```

---

### Falhas

A solução precisa diferenciar:

```text
falha transitória;

falha permanente;

resposta ambígua;

duplicata esperada.
```

Não use uma única exception genérica para decidir todos os caminhos.

---

### Observabilidade

A nova jornada precisa preservar:

```text
correlationId;

messageId;

causationId;

topic;

partition;

offset.
```

Métricas precisam utilizar tags controladas.

---

## Mão na massa guiada

Esta seção organiza a execução da prova.

Ela não contém a solução completa.

### 1. Preparar a branch

```powershell
git status
```

A árvore precisa estar limpa.

Crie a branch:

```powershell
git switch `
  -c `
  "feature/m16-prova-integracoes"
```

Registre o commit inicial:

```powershell
git log -1 --oneline
```

---

### 2. Executar a baseline

```powershell
.\mvnw.cmd clean verify
```

Registre em:

```text
TEST_EVIDENCE.md.
```

Inclua:

- data;
- commit;
- Java;
- total de testes;
- resultado.

---

### 3. Ler o cenário

#### História

Como sistema de ordens de serviço, quero reagendar uma OS e publicar um evento confiável, para que o módulo de notificação prepare e envie uma comunicação de reagendamento sem duplicidade.

#### Endpoint

```text
PUT /api/v1/service-orders/{serviceOrderId}/reschedule
```

#### Request

```json
{
  "newPeriod": "AFTERNOON",
  "reason": "CUSTOMER_REQUEST"
}
```

#### Headers

```text
X-Correlation-Id:
opcional.

X-Request-Id:
opcional.

Idempotency-Key:
obrigatório.
```

#### Response de sucesso

```text
200 OK.
```

Body mínimo:

```json
{
  "serviceOrderId": "OS-502-0001",
  "previousPeriod": "MORNING",
  "newPeriod": "AFTERNOON",
  "status": "SCHEDULED",
  "version": 2,
  "eventId": "UUID",
  "integrationStatus": "PENDING_PUBLICATION"
}
```

---

### 4. Aplicar regras de negócio

A OS só pode ser reagendada quando:

```text
status = SCHEDULED.
```

O novo período precisa ser diferente do atual.

Períodos válidos:

```text
MORNING;

AFTERNOON;

EVENING.
```

Motivos válidos:

```text
CUSTOMER_REQUEST;

OPERATIONAL_ADJUSTMENT;

TECHNICIAN_UNAVAILABLE.
```

A versão da OS aumenta em `1`.

O período anterior precisa ser preservado no evento.

---

### 5. Definir erros HTTP

#### OS inexistente

```text
404 Not Found.
```

#### Status não elegível

```text
409 Conflict.
```

#### Mesmo período

```text
422 Unprocessable Entity.
```

#### Request inválido

```text
400 Bad Request.
```

#### Idempotency-Key ausente

```text
400 Bad Request.
```

#### Mesma key com request diferente

```text
409 Conflict.
```

Não use `500` para regra de negócio conhecida.

---

### 6. Definir contrato do evento

Evento:

```text
service-order.rescheduled.v1.
```

Campos mínimos:

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

previousPeriod;

newPeriod;

reason;

serviceOrderVersion;

status.
```

Versão:

```text
1.
```

Key Kafka:

```text
serviceOrderId.
```

Topic:

```text
m16.service-order.events.v1.
```

---

### 7. Criar contrato documentado

Arquivo:

```text
docs/architecture/prova-integracoes/CONTRACT.md
```

Inclua:

- endpoint;
- request;
- response;
- erros;
- evento;
- headers;
- topic;
- key;
- versionamento;
- owner;
- dados proibidos.

Dados proibidos:

- telefone;
- e-mail;
- documento;
- endereço;
- token;
- payload de entidades;
- stacktrace.

---

### 8. Planejar idempotência HTTP

Você deve definir uma persistência com:

```text
idempotencyKey;

requestHash;

serviceOrderId;

eventId;

response;

status;

createdAt.
```

A constraint precisa impedir duplicidade da key no escopo correto.

O request hash precisa utilizar uma representação canônica.

Não use:

```text
Object.toString().
```

---

### 9. Implementar a transação local

A mesma transação deve:

1. validar idempotência;
2. carregar a OS;
3. validar regra;
4. atualizar período;
5. incrementar versão;
6. criar eventId;
7. salvar Outbox;
8. salvar resultado idempotente;
9. confirmar.

Se qualquer etapa falhar:

```text
rollback total.
```

---

### 10. Publicar via Outbox

Reutilize a infraestrutura existente.

O application service não pode importar:

```text
KafkaTemplate;

ProducerRecord;

RestClient.
```

O port de publicação deve receber o novo evento ou uma abstração compatível.

---

### 11. Evoluir o consumer

O módulo Notification precisa aceitar:

```text
service-order.scheduled.v1;

service-order.rescheduled.v1.
```

Você pode utilizar:

- envelope comum;
- dispatch por `eventType`;
- handlers separados;
- serializer configurado.

A escolha precisa ser documentada.

Não use um bloco de `if` que serialize e desserialize entidades arbitrárias sem validação.

---

### 12. Persistir a Inbox

O novo evento deve ser deduplicado pela constraint existente:

```text
consumerName + eventId.
```

A Inbox precisa preservar:

- payload;
- event type;
- event version;
- key;
- topic;
- partition;
- offset;
- correlation;
- causation.

---

### 13. Preparar a intenção

Crie uma intenção específica ou generalize o modelo existente.

A intenção de reagendamento precisa identificar:

```text
sourceEventId;

serviceOrderId;

customerId;

previousPeriod;

newPeriod;

reason;

templateCode;

status.
```

Template sugerido:

```text
SERVICE_ORDER_RESCHEDULED_V1.
```

Status inicial:

```text
READY_TO_SEND.
```

---

### 14. Despachar ao provider

Reutilize:

```text
NotificationProvider.
```

A idempotency key do provider continua:

```text
sourceEventId.
```

O body externo precisa refletir o novo template.

Nenhum novo client HTTP genérico deve ser criado.

---

### 15. Tratar cenários do provider

A prova precisa testar:

#### Sucesso

```text
202 ACCEPTED.
```

#### Duplicata

```text
200 ALREADY_ACCEPTED.
```

#### Rate limit

```text
429 + Retry-After.
```

#### Indisponibilidade

```text
503.
```

#### Rejeição permanente

```text
422.
```

#### Timeout pós-aceite

```text
provider persiste;

resposta atrasa;

retry com a mesma key;

ALREADY_ACCEPTED.
```

---

### 16. Preservar correlação

Fluxo esperado:

```text
HTTP request messageId;

evento com correlationId;

causationId = request messageId;

Kafka messageId = eventId;

worker messageId = eventId;

HTTP outbound requestId novo;

X-Causation-Id = eventId.
```

Nenhum ID único pode virar tag de métrica.

---

### 17. Criar métricas

Métricas mínimas:

```text
reschedule requests;

reschedule failures;

reschedule duration;

reschedule events published;

reschedule events consumed;

reschedule duplicates;

reschedule notification retries;

reschedule quarantines;

oldest reschedule notification age.
```

Tags permitidas:

```text
operation;

outcome;

reasonCode;

eventType;

component.
```

---

### 18. Criar matriz de falhas

Arquivo:

```text
FAILURE_MATRIX.md
```

Inclua:

```markdown
| Falha | Boundary | Classificação | Retry | Estado final |
|---|---|---|---:|---|
| OS inexistente | HTTP/domain | Permanente | Não | 404 |
| Mesmo período | Domain | Permanente | Não | 422 |
| Outbox indisponível | Banco | Transitória | Request falha | Rollback |
| Kafka indisponível | Publisher | Transitória | Sim | PENDING |
| Inbox DB indisponível | Consumer | Transitória | Redelivery | Sem ack |
| Evento inválido | Worker | Permanente | Não | FAILED_PERMANENT |
| Provider 429 | HTTP externo | Transitória | Sim | RETRY_WAIT |
| Provider 422 | HTTP externo | Permanente | Não | QUARANTINED |
| Read timeout | HTTP externo | Ambígua | Sim, mesma key | RETRY_WAIT |
```

---

### 19. Testar atomicidade

Cenário obrigatório:

1. existe uma OS em `MORNING`;
2. o adapter Outbox falha;
3. o endpoint retorna erro;
4. período continua `MORNING`;
5. versão não aumenta;
6. nenhuma Outbox é criada;
7. nenhuma resposta idempotente de sucesso é salva.

---

### 20. Testar idempotência HTTP

#### Repetição idêntica

1. envie request com key `K-502`;
2. obtenha `eventId E-1`;
3. repita a mesma request;
4. confirme o mesmo resultado lógico;
5. confirme um único incremento de versão;
6. confirme uma única Outbox;
7. confirme o mesmo eventId.

#### Conflito

1. use key `K-502`;
2. altere `newPeriod`;
3. confirme `409`;
4. não gere outro evento.

---

### 21. Testar redelivery Kafka

Publique duas vezes o mesmo eventId.

Confirme:

```text
Inbox:
uma linha.

Intent:
uma linha.

Provider delivery:
uma linha.
```

---

### 22. Testar timeout pós-aceite

O teste deve provar:

```text
primeira tentativa:
timeout.

provider:
uma delivery.

intent:
RETRY_WAIT.

segunda tentativa:
ALREADY_ACCEPTED.

intent:
SENT.

provider:
continua com uma delivery.
```

---

### 23. Testar correlação

Use:

```text
X-Correlation-Id:
CORR-502.

X-Request-Id:
REQ-502.
```

Confirme nos boundaries:

- Outbox;
- Kafka;
- Inbox;
- intent;
- dispatcher;
- fake provider.

---

### 24. Criar teste ponta a ponta

O teste E2E precisa executar:

```text
PUT reschedule;

Outbox PUBLISHED;

Inbox PROCESSED;

Intent SENT;

provider delivery criada.
```

Confirme:

- novo período;
- versão;
- eventId;
- correlation ID;
- uma única delivery;
- métricas atualizadas.

---

### 25. Registrar evidências

Arquivo:

```text
TEST_EVIDENCE.md
```

Tabela:

```markdown
| Cenário | Teste | Resultado | Evidência |
|---|---|---|---|
| Happy path | ... | PASS | Assert |
| Atomicidade | ... | PASS | Banco |
| HTTP idempotency | ... | PASS | Count |
| Redelivery | ... | PASS | Unique |
| 429 | ... | PASS | Retry |
| Timeout | ... | PASS | ALREADY_ACCEPTED |
| Quarantine | ... | PASS | Linha |
| Correlation | ... | PASS | MDC/header |
```

Não use prints como única evidência quando um teste automatizado for possível.

---

### 26. Criar autoavaliação

Arquivo:

```text
SELF_REVIEW.md
```

Perguntas:

- qual foi a principal decisão?
- qual trade-off foi aceito?
- onde existe at-least-once?
- onde existe idempotência?
- qual falha foi mais difícil?
- qual cenário ainda não está coberto?
- o que seria diferente em produção?
- quais limitações permanecem?
- qual refatoração você faria depois?

---

### 27. Executar gate final

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
git status
git diff --check
```

A entrega não pode depender de testes desabilitados.

---

## Entendendo o que será avaliado

### Correção funcional

O reagendamento precisa alterar o estado correto.

### Correção transacional

Estado e evento não podem divergir.

### Contrato

HTTP e Kafka precisam ser explícitos e versionados.

### Idempotência

Retries não podem criar efeitos adicionais.

### Resiliência

Falhas transitórias e permanentes precisam de caminhos diferentes.

### Operabilidade

Logs, métricas e quarantine precisam permitir investigação.

### Arquitetura

A solução deve reutilizar ports, adapters, Outbox e Inbox.

### Testes

Os cenários críticos precisam ser automatizados.

### Documentação

As decisões precisam estar registradas.

---

## Erros comuns importantes

### Criar um segundo topic sem justificativa

A família existente já suporta eventos de OS.

### Atualizar a OS antes de validar idempotência

Uma repetição pode alterar o estado novamente.

### Criar eventId em cada retry

O fluxo perde deduplicação.

### Publicar diretamente no Kafka

A atomicidade local é quebrada.

### Confirmar o consumer antes da Inbox

Uma falha pode perder o evento.

### Criar intent duas vezes

Deduplicação ou transação está incorreta.

### Usar nova key no timeout

O provider pode criar duplicata.

### Tratar 422 com retry

A rejeição não se corrige sozinha.

### Usar correlationId como tag

A cardinalidade cresce sem limite.

### Entregar apenas happy path

A maior parte da nota está nas garantias e falhas.

### Alterar infraestrutura inteira

A prova avalia evolução, não reescrita.

### Copiar o fluxo anterior sem adaptar o domínio

Reagendamento possui regras próprias.

---

## Comandos úteis

### Criar branch

```powershell
git switch `
  -c `
  "feature/m16-prova-integracoes"
```

### Baseline

```powershell
.\mvnw.cmd clean verify
```

### Testes da prova

```powershell
.\mvnw.cmd `
  -Dtest=*Reschedule*,*Exam* `
  test
```

### Buscar violações

```powershell
git grep `
  -n `
  -E `
  "KafkaTemplate|RestClient|Thread.sleep|correlationId.*tag|eventId.*tag"
```

### Revisão final

```powershell
git status
git diff
git diff --check
git diff --stat
```

---

## Exercício guiado

A prova inteira é o exercício principal.

Ordem recomendada:

### Etapa 1 — Desenho

Crie `SOLUTION_DESIGN.md`.

### Etapa 2 — Contratos

Defina HTTP e evento.

### Etapa 3 — Domínio

Implemente as regras de reagendamento.

### Etapa 4 — Transação

Integre Outbox e idempotência HTTP.

### Etapa 5 — Mensageria

Publique e consuma o novo evento.

### Etapa 6 — Efeito

Prepare e despache a notificação.

### Etapa 7 — Falhas

Implemente retry e quarantine.

### Etapa 8 — Observabilidade

Adicione logs e métricas.

### Etapa 9 — Testes

Cubra cenários obrigatórios.

### Etapa 10 — Revisão

Preencha evidências e autoavaliação.

---

## Critérios de aceite

### Bloco A — HTTP e domínio — 15 pontos

- endpoint correto;
- request e response explícitos;
- validações de período e motivo;
- 404, 409, 422 e 400;
- versionamento da OS;
- idempotency key obrigatória.

### Bloco B — Contrato e Kafka — 15 pontos

- evento `service-order.rescheduled.v1`;
- eventVersion 1;
- topic existente reutilizado;
- key `serviceOrderId`;
- eventId estável;
- correlation e causation;
- dados minimizados.

### Bloco C — Atomicidade e Outbox — 15 pontos

- OS, Outbox e idempotência na mesma transação;
- rollback comprovado;
- publisher existente reutilizado;
- sem KafkaTemplate no application service;
- retry preserva identidade.

### Bloco D — Inbox e processamento — 15 pontos

- consumer aceita o novo evento;
- Inbox antes do ack;
- deduplicação por consumerName + eventId;
- worker separado;
- intent única;
- falha permanente separada.

### Bloco E — Provider e resiliência — 15 pontos

- NotificationProvider reutilizado;
- sourceEventId como key;
- 429 e Retry-After;
- 503;
- 422;
- timeout ambíguo;
- ALREADY_ACCEPTED;
- quarantine.

### Bloco F — Observabilidade — 10 pontos

- correlação ponta a ponta;
- MDC limpo;
- logs estruturados;
- métricas;
- tags controladas;
- backlog age.

### Bloco G — Testes — 10 pontos

- atomicidade;
- idempotência HTTP;
- redelivery;
- timeout;
- quarantine;
- E2E.

### Bloco H — Documentação — 5 pontos

- solution design;
- contrato;
- matriz de falhas;
- evidências;
- autoavaliação.

Total:

```text
100 pontos.
```

Falhas bloqueantes anulam a aprovação mesmo com nota numérica suficiente.

---

## Rubrica de avaliação

### Excelente — 90 a 100

- desenho coerente;
- nenhuma falha bloqueante;
- testes críticos sólidos;
- idempotência comprovada;
- documentação clara;
- código integrado ao projeto existente;
- operação observável.

### Bom — 75 a 89

- fluxo principal correto;
- garantias essenciais presentes;
- pequenas lacunas não críticas;
- testes adequados;
- documentação suficiente.

### Em desenvolvimento — 60 a 74

- happy path funciona;
- garantias incompletas;
- testes de falha insuficientes;
- documentação parcial;
- precisa de correções antes de aprovação.

### Insuficiente — abaixo de 60

- perda ou duplicidade;
- contratos frágeis;
- ausência de testes críticos;
- infraestrutura duplicada;
- retry ou timeout incorretos;
- solução não demonstrável.

---

## Protocolo de entrega da prova

A entrega precisa permitir que outra pessoa reproduza o resultado sem depender de explicação verbal.

Inclua:

```text
branch;

commit inicial;

commits da implementação;

commit final;

comando de execução;

comando de testes;

configurações necessárias;

evidências;

limitações conhecidas.
```

O arquivo `SOLUTION_DESIGN.md` deve registrar:

1. diagrama da jornada;
2. boundaries envolvidos;
3. transações locais;
4. contratos HTTP e Kafka;
5. decisões de idempotência;
6. classificação de falhas;
7. estratégia de observabilidade;
8. trade-offs;
9. riscos;
10. itens fora do escopo.

O arquivo `TEST_EVIDENCE.md` precisa indicar o nome real de cada teste.

Não use afirmações genéricas como:

```text
todos os testes passaram.
```

Use:

```text
ServiceOrderRescheduleAtomicityTest:
PASS.

RescheduleProviderIdempotencyTest:
PASS.

RescheduleEndToEndTest:
PASS.
```

Quando um cenário permanecer manual, explique:

- por que não foi automatizado;
- como reproduzir;
- resultado esperado;
- risco da ausência de automação.

A entrega deve ser executável com comandos documentados.

Exemplo:

```powershell
docker start `
  "m16-kafka"

.\mvnw.cmd clean verify
```

Não dependa de:

- arquivo fora do repositório;
- variável não documentada;
- porta fixa ocupada;
- internet;
- dado criado manualmente no banco;
- sequência secreta de passos.

---

## Critérios bloqueantes detalhados

Um blocker representa risco incompatível com a aprovação.

### Perda de estado ou evento

Exemplo:

```text
OS foi reagendada;

Outbox não existe.
```

Outro:

```text
Outbox existe;

estado da OS não confirmou.
```

A prova precisa demonstrar rollback conjunto.

### Duplicidade de efeito

Exemplo:

```text
mesmo sourceEventId;

duas deliveries externas.
```

Mesmo que existam dois records Kafka, o efeito lógico precisa permanecer único.

### Offset confirmado sem recepção durável

Se o banco da Inbox falhar, o consumer não pode considerar a mensagem concluída.

### Retry destrutivo

É bloqueante:

- repetir 400 ou 422 indefinidamente;
- trocar a idempotency key;
- ignorar máximo de tentativas;
- apagar evidência;
- marcar sucesso sem confirmação.

### Segurança

É bloqueante versionar ou registrar:

- token real;
- Authorization;
- senha;
- contato pessoal;
- payload sensível;
- stacktrace com segredo.

### Ausência de timeout

Uma chamada externa sem timeout pode consumir workers indefinidamente.

### Contrato incompatível

É bloqueante alterar silenciosamente:

- topic;
- key;
- significado do evento;
- versão;
- status HTTP;
- header de idempotência.

---

## Checklist do avaliador

O avaliador deve começar pela reprodução.

### Preparação

- [ ] A branch existe.
- [ ] A árvore está limpa.
- [ ] A documentação informa dependências.
- [ ] A baseline executa.
- [ ] Não há credenciais reais.

### Leitura arquitetural

- [ ] O desenho mostra todas as fronteiras.
- [ ] As transações estão marcadas.
- [ ] A chamada HTTP externa está fora da transação longa.
- [ ] Ports e adapters são preservados.
- [ ] Não há infraestrutura duplicada.

### Verificação funcional

- [ ] Reagendamento elegível funciona.
- [ ] OS inexistente retorna 404.
- [ ] Status não elegível retorna 409.
- [ ] Mesmo período retorna 422.
- [ ] Versão aumenta uma vez.
- [ ] Response informa publicação pendente.

### Verificação de garantias

- [ ] Outbox é atômica.
- [ ] EventId é estável.
- [ ] Kafka key está correta.
- [ ] Inbox deduplica.
- [ ] Provider deduplica.
- [ ] Timeout pós-aceite termina em SENT.
- [ ] Falha permanente termina em quarantine.

### Verificação operacional

- [ ] Logs possuem correlação.
- [ ] Métricas não possuem IDs únicos.
- [ ] Retry possui reason code.
- [ ] Backlog é observável.
- [ ] Quarantine possui evidência.
- [ ] Runbook ou matriz orienta a investigação.

---

## Defesa técnica da solução

Depois da implementação, explique a solução em até quinze minutos.

A defesa deve responder:

1. onde ocorre cada commit;
2. por que a Outbox está na mesma transação;
3. quando o Kafka pode entregar novamente;
4. como a Inbox trata repetição;
5. por que `serviceOrderId` é a key;
6. onde `eventId` é criado;
7. por que ele não muda;
8. como a idempotência HTTP funciona;
9. como a idempotência do provider funciona;
10. o que acontece no read timeout;
11. por que 429 possui retry;
12. por que 422 não possui retry;
13. como a correlação atravessa o fluxo;
14. quais métricas mostram degradação;
15. o que ainda impediria produção.

Uma solução funcional sem explicação das garantias demonstra domínio incompleto.

A defesa não exige memorizar classes.

Ela exige compreender:

```text
estado;

mensagem;

identidade;

falha;

recuperação;

evidência.
```

---

## Commit recomendado

Faça commits intencionais durante a prova.

Exemplos:

```powershell
git commit -m "feat(m16): adicionar reagendamento de OS"
```

```powershell
git commit -m "feat(m16): publicar evento de reagendamento"
```

```powershell
git commit -m "feat(m16): processar notificacao de reagendamento"
```

```powershell
git commit -m "test(m16): validar integracoes da prova pratica"
```

Antes da entrega:

```powershell
git status
git diff --check
git log --oneline -10
```

Não inclua:

- token real;
- payload real;
- dados pessoais;
- banco H2;
- diretório data;
- logs;
- target;
- testes desabilitados;
- arquivos temporários;
- solução copiada sem compreensão.

---

## Fechamento e ponte para a próxima aula

Esta aula transformou o conhecimento do módulo em um desafio independente.

A prova exige que você conecte:

```text
HTTP;

domínio;

transação;

Outbox;

Kafka;

Inbox;

idempotência;

provider;

retry;

quarantine;

correlação;

métricas;

testes.
```

O objetivo não é produzir o maior número de classes.

O objetivo é demonstrar que você consegue explicar e provar:

- onde a transação começa e termina;
- quando a mensagem pode repetir;
- qual identidade permanece;
- como o efeito evita duplicidade;
- quais falhas usam retry;
- quais falhas terminam;
- como um timeout é recuperado;
- como a equipe detecta problemas;
- como a arquitetura permanece modular.

A próxima aula será:

```text
503 - M16.48 - Refatoracao final integracoes
```

Nela, você utilizará:

- os achados da prova;
- os testes;
- as duplicações;
- as decisões;
- as limitações;
- a autoavaliação.

O objetivo será refatorar sem alterar o comportamento já comprovado.

Nenhuma solução da refatoração final foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei a branch da prova.
- [ ] Executei a baseline.
- [ ] Desenhei a solução.
- [ ] Implementei reagendamento.
- [ ] Integrei Outbox e Kafka.
- [ ] Integrei Inbox e provider.
- [ ] Testei falhas críticas.
- [ ] Documentei evidências.

---

## Troubleshooting adicional

### A prova parece grande demais

Divida pela ordem recomendada e preserve uma baseline verde em cada etapa.

### O evento antigo parou de funcionar

O consumer foi alterado sem compatibilidade para múltiplos event types.

### O mesmo request aumenta a versão duas vezes

A idempotência HTTP está sendo validada tarde demais.

### O rollback deixa a OS reagendada

A Outbox ou a atualização estão fora da mesma transação.

### O consumer cria duas intents

Revise a unique constraint e o claim.

### O provider cria duas deliveries

Confirme a estabilidade de `sourceEventId`.

### O timeout vira quarantine imediatamente

Ele deve ser classificado como transitório e ambíguo.

### O teste E2E é instável

Use espera limitada baseada em condição, não sleep fixo longo.

### As métricas possuem IDs

Remova tags dinâmicas e mantenha os IDs nos logs.

### A prova está alterando tudo

Volte ao desenho e reutilize a infraestrutura existente.

---

## Perguntas de revisão

1. Qual é o novo endpoint?
2. Qual é o novo evento?
3. Qual topic deve ser usado?
4. Qual é a key Kafka?
5. Qual header garante idempotência HTTP?
6. O que acontece com a mesma key e request igual?
7. O que acontece com a mesma key e request diferente?
8. O que deve confirmar na mesma transação?
9. Qual é a dedup key do consumer?
10. Qual é a key do provider?
11. Por que timeout é ambíguo?
12. Como recuperar o timeout?
13. Qual erro deve respeitar Retry-After?
14. Qual erro vai direto para quarantine?
15. Qual ID permanece na jornada?
16. IDs podem virar tags?
17. Qual teste prova atomicidade?
18. Qual teste prova efeito único?
19. Qual é a nota sugerida para aprovação?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. PUT /service-orders/{id}/reschedule.
2. service-order.rescheduled.v1.
3. m16.service-order.events.v1.
4. serviceOrderId.
5. Idempotency-Key.
6. Mesmo resultado lógico.
7. 409 Conflict.
8. OS, Outbox e registro idempotente.
9. consumerName + eventId.
10. sourceEventId.
11. O provider pode ter aceitado.
12. Repetir com a mesma key.
13. 429.
14. 422 ou falha permanente.
15. correlationId.
16. Não.
17. Rollback forçado da Outbox.
18. Timeout ou redelivery idempotente.
19. 75 sem blocker.
20. Refatoracao final integracoes.

---

## Desafio opcional

Depois de concluir a prova obrigatória, adicione:

```text
GET /api/v1/service-orders/{id}/integration-status.
```

Ele pode retornar:

- event ID;
- Outbox status;
- Inbox status;
- intent status;
- provider message ID;
- quarantine reason.

Requisitos:

- read-only;
- sem payload;
- sem token;
- sem alteração de status;
- teste;
- documentação.

Esse desafio não substitui nenhum critério obrigatório.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 502 - M16.47 - Prova pratica integracoes

- Iniciei a prova prática do módulo de integrações.
- Criei uma branch exclusiva.
- Confirmei a baseline verde.
- Analisei o cenário de reagendamento de OS.
- Desenhei a jornada completa.
- Defini o endpoint de reagendamento.
- Defini Idempotency-Key obrigatória.
- Defini erros HTTP.
- Defini `service-order.rescheduled.v1`.
- Reutilizei `m16.service-order.events.v1`.
- Mantive `serviceOrderId` como key.
- Planejei atomicidade entre OS, Outbox e idempotência.
- Reutilizei a infraestrutura de Outbox.
- Evoluí o consumer para múltiplos eventos.
- Mantive deduplicação por consumerName e eventId.
- Preparei intenção de notificação de reagendamento.
- Reutilizei NotificationProvider.
- Mantive sourceEventId como idempotency key.
- Tratei 429, 503, 422 e timeout.
- Preservei correlação ponta a ponta.
- Criei métricas com tags controladas.
- Testei atomicidade.
- Testei idempotência HTTP.
- Testei redelivery.
- Testei timeout pós-aceite.
- Testei quarantine.
- Testei a jornada ponta a ponta.
- Registrei evidências.
- Preenchi a autoavaliação.
- Próxima aula: Refatoracao final integracoes.
```

---

## Referência técnica curta

- HTTP Idempotency.
- Transactional Outbox Pattern.
- Transactional Inbox Pattern.
- Apache Kafka Record Keys.
- At-least-once Delivery.
- Idempotent Consumer Pattern.
- Retry-After.
- Ports and Adapters.
- Micrometer Metrics.
- Integration Testing.

Regra final:

```text
a prova prática avalia a capacidade de evoluir uma integração existente sem duplicar infraestrutura nem quebrar garantias: o endpoint de reagendamento usa Idempotency-Key, valida regras de domínio e confirma atualização da OS, incremento de versão, evento Outbox e resultado idempotente na mesma transação; o fato service-order.rescheduled.v1 utiliza o topic existente, serviceOrderId como key, eventId estável e correlação preservada; o consumer persiste Inbox antes do ack, deduplica por consumerName + eventId e cria uma única intent; o dispatcher reutiliza NotificationProvider e sourceEventId como idempotency key, trata 429, 503, 422 e timeout ambíguo, usa retry limitado e quarantine; testes precisam provar rollback, repetição HTTP, redelivery, timeout pós-aceite, efeito único e jornada ponta a ponta; a nota depende de comportamento, evidência e documentação, e qualquer perda de mensagem, duplicidade grave, vazamento de segredo ou ausência de timeout constitui falha bloqueante.
```
