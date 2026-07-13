# 505 - M16.50 - Fechamento do Modulo 16

## Apresentação da aula

Esta aula encerra oficialmente o Módulo 16:

```text
Integrações,
mensageria,
eventos
e resiliência.
```

O módulo começou com uma pergunta ampla:

```text
como fazer
um sistema conversar
com outro sistema
de forma confiável?
```

Ao longo das aulas, essa pergunta foi dividida em problemas menores:

- como chamar uma API HTTP;
- como tratar respostas e erros;
- como controlar timeout;
- como publicar eventos;
- como escolher topic e key;
- como lidar com redelivery;
- como evitar dual write;
- como usar Outbox;
- como persistir Inbox;
- como deduplicar;
- como criar retries limitados;
- como tratar poison messages;
- como preservar correlation IDs;
- como monitorar backlogs;
- como reprocessar com segurança;
- como decidir entre monólito modular e microsserviços;
- como integrar um provider externo;
- como revisar;
- como testar;
- como refatorar;
- como ensinar.

O resultado foi uma jornada técnica completa:

```text
HTTP inbound;

regra de negócio;

transação local;

Outbox;

Kafka;

Inbox;

worker;

Notification Intent;

dispatcher;

API HTTP externa fake;

retry;

quarantine;

correlação;

métricas;

runbooks.
```

Essa jornada não representa apenas uma sequência de ferramentas.

Ela representa um modelo mental.

Uma integração confiável precisa responder:

```text
qual é o estado?

qual é a mensagem?

qual é a identidade?

onde existe transação?

onde pode repetir?

qual efeito precisa ser único?

qual falha é transitória?

qual falha é permanente?

como recuperar?

como investigar?

como operar?
```

O fechamento do módulo possui cinco objetivos.

Primeiro:

```text
consolidar
o conhecimento técnico.
```

Segundo:

```text
confirmar
os entregáveis produzidos.
```

Terceiro:

```text
mapear
competências desenvolvidas.
```

Quarto:

```text
identificar
lacunas que ainda permanecem.
```

Quinto:

```text
preparar a transição
para DevOps,
CI/CD,
Kubernetes
e Cloud.
```

O próximo módulo mudará o foco.

Até agora, a maior pergunta foi:

```text
a aplicação
se integra corretamente?
```

No Módulo 17, a pergunta passa a incluir:

```text
como empacotar?

como construir?

como testar em pipeline?

como publicar?

como implantar?

como escalar?

como observar no ambiente?

como reverter?

como operar com segurança?
```

A próxima aula será:

```text
506 - M17.01 - Docker revisao para Spring Boot
```

Portanto, este fechamento precisa garantir que o projeto de integrações esteja:

- verde;
- documentado;
- versionado;
- compreendido;
- reproduzível;
- pronto para ser empacotado.

A aula não adicionará uma nova integração.

Ela também não começará Docker antecipadamente.

O objetivo é fechar o módulo de forma consciente.

Ao final, você deverá ser capaz de explicar:

```text
o que aprendeu;

o que construiu;

o que consegue demonstrar;

o que ainda precisa praticar;

quais garantias implementou;

quais limitações permanecem;

como esse conhecimento
se conecta ao próximo módulo.
```

---

## Onde estamos na formação

A sequência final do Módulo 16 foi:

```text
481:
Consumers e producers Kafka.

482:
Partições, keys e ordering.

483:
Consumer groups.

484:
Entrega e redelivery.

485:
Retry em mensageria.

486:
Dead Letter Topic.

487:
Poison messages.

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

493:
Logs de correlação.

494:
Monitoramento de integrações.

495:
Microsserviços vs monólito modular.

496:
Projeto mensageria OS parte 1.

497:
Projeto mensageria OS parte 2.

498:
Projeto mensageria OS parte 3.

499:
Projeto integração API externa fake.

500:
Revisão integrações parte 1.

501:
Revisão integrações parte 2.

502:
Prova prática integrações.

503:
Refatoração final integrações.

504:
Aula ensinável integrações.

505:
Fechamento do Módulo 16.
```

O próximo passo oficial será:

```text
506 - M17.01 - Docker revisao para Spring Boot
```

O Módulo 16 entregou conhecimento em seis blocos:

```text
1. contratos e HTTP;

2. mensageria e Kafka;

3. consistência e idempotência;

4. resiliência e recuperação;

5. observabilidade e operação;

6. arquitetura, revisão e ensino.
```

Nesta aula:

```text
nova feature:
não.

novo contrato:
não.

novo evento:
não.

novo endpoint:
não.

nova infraestrutura:
não.

consolidação:
sim.

inventário:
sim.

checkpoint técnico:
sim.

checklist de qualidade:
sim.

mapa de lacunas:
sim.

encerramento:
sim.

transição para M17:
sim.

Docker:
não antecipado.
```

A regra central será:

```text
um módulo termina
quando o aluno
consegue construir,
provar,
explicar
e revisar;

não apenas
quando terminou
de ler as aulas.
```

---

## Objetivo prático

Ao final, o projeto terá documentação de encerramento:

```text
docs/modules/m16
├── M16_FINAL_SUMMARY.md
├── M16_COMPETENCY_MAP.md
├── M16_DELIVERABLE_INVENTORY.md
├── M16_FINAL_CHECKLIST.md
├── M16_GAP_ANALYSIS.md
├── M16_COMMAND_REFERENCE.md
└── M16_TRANSITION_TO_M17.md
```

Também será feita uma validação final do laboratório:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Você irá:

1. executar a baseline final;
2. registrar o commit de encerramento;
3. revisar a árvore do projeto;
4. inventariar contratos;
5. inventariar topics;
6. inventariar consumer groups;
7. inventariar tabelas;
8. inventariar workers;
9. inventariar estados;
10. inventariar métricas;
11. inventariar runbooks;
12. revisar testes críticos;
13. revisar segurança;
14. revisar limites;
15. mapear competências;
16. mapear lacunas;
17. criar resumo de bolso;
18. criar comandos essenciais;
19. criar checklist de demonstração;
20. preparar a transição para Docker;
21. atualizar o diário de bordo;
22. criar o commit final do módulo.

---

## Conceito essencial

### Encerramento técnico

Encerramento técnico não é somente dizer:

```text
módulo concluído.
```

Ele precisa confirmar:

- estado do código;
- estado dos testes;
- estado da documentação;
- decisões;
- riscos;
- limitações;
- competências;
- próximos passos.

---

### Conhecimento declarativo

É saber explicar conceitos.

Exemplos:

- o que é Outbox;
- o que é Inbox;
- o que é at-least-once;
- o que é idempotência;
- o que é timeout ambíguo.

---

### Conhecimento procedural

É saber executar.

Exemplos:

- criar um evento;
- configurar um producer;
- criar um consumer;
- persistir Inbox;
- implementar retry;
- testar redelivery.

---

### Conhecimento condicional

É saber quando utilizar.

Exemplos:

- quando usar comunicação síncrona;
- quando usar mensageria;
- quando usar retry;
- quando não repetir;
- quando criar quarantine;
- quando evitar microsserviços.

O domínio real exige os três tipos.

---

### Competência

Competência combina:

```text
conhecimento;

execução;

julgamento;

evidência.
```

Uma pessoa competente não apenas define Outbox.

Ela consegue:

- explicar o dual write;
- implementar a transação;
- testar rollback;
- monitorar backlog;
- descrever o custo.

---

### Entregável

Entregável é algo verificável.

Exemplos:

- código;
- teste;
- contrato;
- diagrama;
- runbook;
- métrica;
- ADR;
- documento de revisão.

---

### Lacuna

Lacuna é um conhecimento ou capacidade ainda insuficiente.

Ela não representa fracasso.

Ela orienta prática futura.

Exemplos:

- pouca experiência com Kafka real;
- dificuldade em PromQL;
- insegurança em concorrência;
- pouca prática de troubleshooting;
- falta de carga produtiva;
- dificuldade em explicar trade-offs.

---

### Definition of Done do módulo

O módulo pode ser considerado concluído quando:

```text
a grade foi percorrida;

o projeto compila;

os testes passam;

os contratos estão documentados;

a jornada é demonstrável;

as falhas críticas são cobertas;

o aluno consegue explicar;

as limitações estão registradas;

a transição está preparada.
```

---

### Reprodutibilidade

Outra pessoa precisa conseguir:

1. clonar;
2. configurar;
3. iniciar dependências;
4. executar testes;
5. iniciar a aplicação;
6. criar uma OS;
7. observar a jornada.

Se isso depende de conhecimento oculto, o módulo ainda não está bem fechado.

---

### Portabilidade

O próximo módulo irá empacotar a aplicação.

Para isso, o projeto precisa evitar dependência implícita de:

- caminho local;
- usuário do Windows;
- porta não configurável;
- arquivo externo desconhecido;
- banco criado manualmente;
- segredo hardcoded;
- processo iniciado à mão sem documentação.

---

### Baseline

Baseline final é o estado que será levado ao Módulo 17.

Ela precisa possuir:

- commit;
- testes;
- documentação;
- configuração;
- lista de dependências;
- limitações.

---

## Mão na massa guiada

### 1. Confirmar a árvore limpa

Entre no repositório:

```powershell
Set-Location `
  "formacao-java-thiago"
```

Execute:

```powershell
git status
```

Antes de encerrar:

```text
nenhuma alteração desconhecida;

nenhum arquivo temporário;

nenhum segredo;

nenhum artefato de build.
```

---

### 2. Entrar no laboratório

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Confirme:

```powershell
Get-Location
```

---

### 3. Executar gate final

```powershell
.\mvnw.cmd clean verify
```

Registre:

- data;
- Java;
- Maven Wrapper;
- quantidade de testes;
- resultado;
- duração;
- branch;
- commit.

Arquivo:

```text
docs/modules/m16/M16_FINAL_SUMMARY.md
```

---

### 4. Registrar o commit baseline

```powershell
git log -1 --oneline
```

Adicione no resumo:

```text
Baseline commit:
<hash>.
```

Não invente o hash.

Use o valor real.

---

### 5. Inventariar contratos HTTP

Registre:

```text
POST /api/v1/service-orders;

PUT /api/v1/service-orders/{id}/reschedule;

POST /fake-provider/v1/notifications;

Actuator endpoints permitidos.
```

Para cada contrato:

- método;
- URI;
- request;
- response;
- headers;
- erros;
- idempotência;
- owner.

---

### 6. Inventariar eventos

Eventos principais:

```text
service-order.scheduled.v1;

service-order.rescheduled.v1.
```

Para cada evento:

- event type;
- version;
- aggregate;
- key;
- payload;
- producer;
- consumer;
- dados proibidos.

---

### 7. Inventariar Kafka

Registre:

```text
topic:
m16.service-order.events.v1.

partitions:
3 no laboratório.

key:
serviceOrderId.

consumer group:
m16-notification-service-order-v1.

consumer name:
service-order-notification-v1.
```

Inclua:

```text
semântica:
at-least-once.
```

---

### 8. Inventariar persistência

Tabelas principais:

```text
service_order;

outbox_event;

notification_inbox_message;

service_order_notification_intent;

notification_dispatch_quarantine;

fake_external_notification_delivery.
```

Para cada tabela:

- owner;
- finalidade;
- identity;
- unique constraints;
- lifecycle;
- limpeza;
- auditoria.

---

### 9. Inventariar lifecycles

#### Outbox

```text
PENDING;

PROCESSING;

PUBLISHED;

FAILED.
```

Ajuste conforme o modelo real.

#### Inbox

```text
RECEIVED;

PROCESSING;

RETRY_WAIT;

PROCESSED;

FAILED_PERMANENT.
```

#### Notification Intent

```text
READY_TO_SEND;

SENDING;

RETRY_WAIT;

SENT;

QUARANTINED.
```

---

### 10. Inventariar workers

Liste:

- Outbox publisher;
- Inbox processing worker;
- Notification dispatch worker;
- stale claim recovery;
- replay worker quando aplicável.

Para cada um:

- scheduler;
- batch size;
- claim;
- timeout;
- retries;
- métricas;
- owner.

---

### 11. Inventariar identidades

Arquivo:

```text
M16_COMPETENCY_MAP.md
```

Mapa de IDs:

```text
correlationId:

jornada.

requestId:

interação HTTP.

eventId:

fato.

causationId:

causa anterior.

serviceOrderId:

aggregate e Kafka key.

consumerName + eventId:

deduplicação da Inbox.

sourceEventId:

idempotência da intent e provider.

replayRunId:

execução de replay.
```

---

### 12. Inventariar garantias

Tabela:

```markdown
| Etapa | Garantia | Proteção |
|---|---|---|
| Estado + Outbox | Atomicidade local | Transação |
| Outbox -> Kafka | At-least-once | EventId |
| Kafka -> Inbox | At-least-once | Unique constraint |
| Inbox -> Intent | At-least-once | SourceEventId |
| Intent -> Provider | At-least-once | Idempotency-Key |
| Efeito externo | Um efeito lógico | Unique key |
```

Registre:

```text
exactly-once global:
não prometido.
```

---

### 13. Inventariar falhas

Crie categorias:

```text
TRANSIENT;

PERMANENT;

AMBIGUOUS;

DUPLICATE.
```

Exemplos:

```text
429:
transient.

503:
transient.

422:
permanent.

409 idempotency conflict:
permanent.

read timeout:
ambiguous.

ALREADY_ACCEPTED:
duplicate esperada.
```

---

### 14. Inventariar retries

Para cada retry:

- trigger;
- máximo;
- backoff;
- Retry-After;
- idempotency key;
- estado terminal;
- métrica;
- runbook.

Confirme:

```text
nenhum retry infinito.
```

---

### 15. Inventariar quarantine

Registre:

```text
poison message;

Inbox failed permanent;

notification dispatch quarantine.
```

Diferencie:

- mensagem inválida;
- processamento impossível;
- provider rejeitou;
- tentativas esgotadas.

---

### 16. Inventariar observabilidade

Logs:

- correlation;
- message;
- causation;
- topic;
- partition;
- offset;
- outcome;
- reason code.

Métricas:

- counters;
- timers;
- gauges;
- backlog count;
- oldest age;
- consumer lag;
- quarantine.

---

### 17. Revisar cardinalidade

Confirme que não existem tags por:

```text
correlationId;

messageId;

eventId;

serviceOrderId;

customerId;

intentId;

replayRunId;

exceptionMessage.
```

Use:

```powershell
git grep `
  -n `
  -E `
  'tag\("(correlationId|messageId|eventId|serviceOrderId|customerId|intentId|replayRunId|exceptionMessage)"'
```

---

### 18. Revisar segurança

Checklist:

```markdown
- [ ] Nenhum token real.
- [ ] Authorization não entra em log.
- [ ] Payload sensível não entra em evento.
- [ ] Quarantine não guarda segredo.
- [ ] Actuator possui exposição limitada.
- [ ] IDs recebidos possuem validação.
- [ ] Erros não retornam stacktrace.
```

---

### 19. Revisar testes críticos

Inventarie:

- atomicidade Outbox;
- redelivery;
- deduplicação;
- stale claims;
- retry;
- quarantine;
- timeout pós-aceite;
- idempotência HTTP;
- correlation;
- cardinalidade;
- E2E.

Arquivo:

```text
M16_DELIVERABLE_INVENTORY.md
```

---

### 20. Criar mapa de competências

Competências sugeridas:

#### HTTP

- criar client;
- configurar timeout;
- classificar status;
- propagar headers;
- testar contrato.

#### Kafka

- topic;
- key;
- partition;
- group;
- redelivery;
- offset.

#### Consistência

- Outbox;
- Inbox;
- idempotência;
- unique constraints;
- claims.

#### Resiliência

- retry;
- backoff;
- Retry-After;
- circuit breaker conceitual;
- quarantine;
- stale recovery.

#### Observabilidade

- logs;
- MDC;
- correlation;
- métricas;
- lag;
- backlog;
- alerts.

#### Arquitetura

- ports;
- adapters;
- módulos;
- ownership;
- trade-offs.

Classifique cada item:

```text
EXPLICO;

IMPLEMENTO_COM_GUIA;

IMPLEMENTO_SOZINHO;

REVISO_OUTRA_SOLUCAO;

ENSINO.
```

---

### 21. Criar análise de lacunas

Arquivo:

```text
M16_GAP_ANALYSIS.md
```

Tabela:

```markdown
| Competência | Nível atual | Evidência | Próxima prática |
|---|---|---|---|
| Outbox | Implemento sozinho | Teste rollback | Aplicar em outro domínio |
| Kafka lag | Implemento com guia | Dashboard | Diagnosticar incidente |
| PromQL | Explico | Alert rules | Criar queries reais |
| Timeout ambíguo | Implemento sozinho | E2E | Integrar API diferente |
```

Use avaliação honesta.

---

### 22. Criar checklist final

Arquivo:

```text
M16_FINAL_CHECKLIST.md
```

Código:

- [ ] compila;
- [ ] testes passam;
- [ ] sem testes desabilitados;
- [ ] sem warnings críticos;
- [ ] sem segredos;
- [ ] sem arquivos temporários.

Contratos:

- [ ] HTTP documentado;
- [ ] eventos documentados;
- [ ] topic documentado;
- [ ] key documentada;
- [ ] errors documentados.

Resiliência:

- [ ] retry limitado;
- [ ] timeout;
- [ ] idempotência;
- [ ] quarantine;
- [ ] recovery.

Operação:

- [ ] logs;
- [ ] métricas;
- [ ] health;
- [ ] alertas;
- [ ] runbooks.

---

### 23. Criar referência de comandos

Arquivo:

```text
M16_COMMAND_REFERENCE.md
```

Inclua:

#### Gate

```powershell
.\mvnw.cmd clean verify
```

#### Kafka topics

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server "localhost:9092" `
  --list
```

#### Consumer group

```powershell
docker exec `
  "m16-kafka" `
  /opt/kafka/bin/kafka-consumer-groups.sh `
  --bootstrap-server "localhost:9092" `
  --describe `
  --group "m16-notification-service-order-v1"
```

#### Metrics

```powershell
Invoke-WebRequest `
  "http://localhost:8084/actuator/prometheus"
```

---

### 24. Criar roteiro de demonstração final

Duração:

```text
15 minutos.
```

Roteiro:

1. mostrar arquitetura;
2. criar uma OS;
3. mostrar Outbox;
4. mostrar Kafka;
5. mostrar Inbox;
6. mostrar intent;
7. mostrar provider;
8. mostrar correlation ID;
9. provocar duplicate;
10. mostrar métricas.

A demonstração precisa utilizar dados fictícios.

---

### 25. Criar resumo de bolso

Arquivo:

```text
M16_FINAL_SUMMARY.md
```

Resumo:

```text
síncrono:
resposta imediata,
acoplamento temporal.

assíncrono:
desacoplamento,
consistência eventual.

Outbox:
estado + intenção.

Inbox:
recepção + deduplicação.

eventId:
identidade do fato.

correlationId:
identidade da jornada.

retry:
falha transitória.

quarantine:
falha terminal.

lag:
broker.

backlog:
processamento interno.

idempotência:
repetir sem novo efeito.
```

---

### 26. Revisar documentação

Confirme links entre:

- contratos;
- ADRs;
- runbooks;
- revisão;
- prova;
- refatoração;
- aula ensinável;
- fechamento.

Evite documentos órfãos.

---

### 27. Revisar nomes

Confirme consistência em:

```text
service-order;

notification;

event;

message;

intent;

delivery;

quarantine;

retry;

replay.
```

Não altere contratos somente por estética no fechamento.

---

### 28. Revisar configuração

Liste variáveis:

```text
Kafka bootstrap servers;

provider base URL;

provider token;

timeouts;

batch size;

worker delay;

max attempts;

claim timeout;

management endpoints.
```

A transição para container exige configuração externa.

---

### 29. Criar transição para M17

Arquivo:

```text
M16_TRANSITION_TO_M17.md
```

Registre o que Docker precisará empacotar:

```text
aplicação Spring Boot;

configuração externa;

porta HTTP;

health endpoint;

metrics endpoint;

conectividade Kafka;

conectividade banco;

conectividade provider fake;

logs stdout;

shutdown gracioso.
```

Não escreva o Dockerfile ainda.

---

### 30. Preparar dados externos

No próximo módulo, nenhum valor importante deve depender de hardcode local.

Confirme que podem ser externalizados:

- URLs;
- tokens;
- timeouts;
- Kafka;
- banco;
- profiles;
- ports.

---

### 31. Revisar graceful shutdown

Registre para o próximo módulo:

- parar novos polls;
- concluir trabalho em andamento;
- liberar claims;
- confirmar offsets seguros;
- fechar clients;
- respeitar timeout de shutdown.

A implementação operacional será aprofundada no M17.

---

### 32. Criar checkpoint técnico oral

Responda sem consultar material:

1. qual problema a Outbox resolve?
2. por que Kafka redeliver?
3. como Inbox deduplica?
4. qual key ordena eventos da OS?
5. por que timeout é ambíguo?
6. qual key vai ao provider?
7. quando usar retry?
8. quando usar quarantine?
9. lag zero encerra o fluxo?
10. por que correlation ID não é tag?

Se houver dificuldade, registre no gap analysis.

---

### 33. Criar checkpoint prático

Sem consultar uma aula específica:

1. localize o producer;
2. localize a Outbox;
3. localize o listener;
4. localize a Inbox;
5. localize o worker;
6. localize o dispatcher;
7. localize o provider;
8. localize métricas;
9. localize runbook;
10. execute o E2E.

---

### 34. Executar gate final novamente

Depois da documentação:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
git diff --check
git status
```

---

### 35. Realizar a cerimônia técnica de encerramento

Reserve um momento para apresentar o resultado do módulo como se estivesse entregando uma solução para uma equipe.

A cerimônia deve possuir:

```text
contexto;

arquitetura;

demonstração;

garantias;

falhas;

observabilidade;

limitações;

próximo passo.
```

Comece pelo problema:

```text
uma ordem de serviço
precisa gerar uma notificação
sem perder o evento
e sem duplicar o efeito.
```

Mostre o diagrama principal.

Depois, demonstre uma jornada de sucesso.

Em seguida, apresente uma falha controlada:

- redelivery;
- timeout pós-aceite;
- provider indisponível;
- quarantine.

Explique qual mecanismo protege o sistema.

Evite transformar o encerramento em uma lista de classes.

O foco precisa ser:

```text
problema;

decisão;

garantia;

evidência.
```

Registre as perguntas recebidas.

Perguntas que você não consegue responder com segurança devem entrar em:

```text
M16_GAP_ANALYSIS.md.
```

A cerimônia termina quando outra pessoa consegue responder:

1. onde o estado é confirmado;
2. onde o evento é persistido;
3. onde pode repetir;
4. qual identidade permanece;
5. como o efeito fica único;
6. como investigar uma falha;
7. quais limitações impedem produção.

---

### 36. Criar uma snapshot de encerramento

Registre uma snapshot textual do projeto.

Inclua:

```text
Java version;

Spring Boot version;

Maven Wrapper version;

branch;

commit;

tests;

topics;

consumer groups;

application port;

management endpoints;

profiles;

external variables.
```

A snapshot não deve conter segredo.

Ela serve para comparar o estado atual com o projeto após Docker, pipeline e Kubernetes.

No Módulo 17, você poderá responder:

```text
o que mudou
quando a aplicação
foi containerizada
e automatizada?
```

Essa comparação ajuda a separar:

- mudança de negócio;
- mudança de integração;
- mudança operacional;
- mudança de infraestrutura.

---

## Entendendo o que foi feito

### O módulo ganhou uma baseline final

Existe um estado definido para iniciar DevOps.

### Contratos foram inventariados

HTTP, eventos, topics e headers ficaram localizáveis.

### Identidades foram consolidadas

Cada ID possui responsabilidade clara.

### Garantias foram registradas

At-least-once não foi confundido com exactly-once.

### Persistência ganhou ownership

Cada tabela possui função na jornada.

### Resiliência virou política

Retry, timeout e quarantine possuem critérios.

### Observabilidade virou operação

Logs, métricas, lag e backlog possuem finalidade.

### Competências foram mapeadas

Conhecimento deixou de ser apenas percepção.

### Lacunas foram registradas

Próximas práticas podem ser escolhidas conscientemente.

### A transição ficou preparada

O projeto agora pode ser empacotado sem esconder dependências.

---

## Erros comuns importantes

### Encerrar sem executar testes

O próximo módulo recebe uma baseline incerta.

### Declarar domínio sem evidência

Use código, teste ou demonstração.

### Ocultar lacunas

A evolução fica sem direção.

### Chamar laboratório de produção-ready

Infraestrutura e governança ainda são limitadas.

### Mudar contratos no fechamento

O risco aumenta sem necessidade.

### Criar Dockerfile antecipadamente

A próxima aula possui esse objetivo.

### Ignorar configuração externa

O container dependerá de hardcodes locais.

### Não documentar variáveis

A aplicação funciona apenas na máquina atual.

### Inventariar arquivos, mas não garantias

O conhecimento continua fragmentado.

### Considerar certificado suficiente

A prática precisa continuar.

---

## Comandos úteis

### Gate final

```powershell
.\mvnw.cmd clean verify
```

### Status

```powershell
git status
git diff --check
```

### Listar documentação M16

```powershell
Get-ChildItem `
  "docs" `
  -Recurse `
  -File |
  Where-Object {
    $_.FullName -match "m16|integration|messaging"
  }
```

### Listar testes

```powershell
Get-ChildItem `
  "src/test/java" `
  -Recurse `
  -Filter "*.java"
```

### Buscar configurações

```powershell
git grep `
  -n `
  -E `
  "bootstrap-servers|base-url|timeout|batch-size|max-attempts|management"
```

---

## Exercício guiado

### Parte 1 — Baseline

Execute o gate.

### Parte 2 — Inventário

Liste contratos e artefatos.

### Parte 3 — Garantias

Mapeie transações e idempotência.

### Parte 4 — Operação

Liste métricas e runbooks.

### Parte 5 — Competências

Classifique seu nível.

### Parte 6 — Lacunas

Defina próximas práticas.

### Parte 7 — Demonstração

Execute o fluxo final.

### Parte 8 — Segurança

Revise segredos e dados.

### Parte 9 — Transição

Liste necessidades de container.

### Parte 10 — Commit

Feche o módulo.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 504 foi preservada;
- fechamento oficial do M16 foi realizado;
- baseline final foi executada;
- commit baseline foi registrado;
- árvore limpa foi verificada;
- contratos HTTP foram inventariados;
- eventos foram inventariados;
- topics foram inventariados;
- keys foram inventariadas;
- consumer groups foram inventariados;
- tabelas foram inventariadas;
- constraints foram inventariadas;
- lifecycles foram inventariados;
- workers foram inventariados;
- schedulers foram inventariados;
- claims foram inventariados;
- identidades foram consolidadas;
- correlationId foi definido;
- requestId foi definido;
- eventId foi definido;
- causationId foi definido;
- sourceEventId foi definido;
- replayRunId foi definido;
- matriz de garantias foi criada;
- atomicidade local foi registrada;
- at-least-once foi registrado;
- exactly-once global não foi prometido;
- falhas foram classificadas;
- retries foram inventariados;
- máximo de tentativas foi revisado;
- Retry-After foi revisado;
- quarantine foi inventariada;
- poison foi diferenciado de quarantine;
- logs foram inventariados;
- métricas foram inventariadas;
- consumer lag foi registrado;
- backlogs foram registrados;
- oldest age foi registrado;
- cardinalidade foi revisada;
- segurança foi revisada;
- tokens reais foram proibidos;
- payload sensível foi proibido;
- Actuator foi revisado;
- testes críticos foram inventariados;
- mapa de competências foi criado;
- níveis de domínio foram definidos;
- análise de lacunas foi criada;
- próximas práticas foram definidas;
- checklist final foi criado;
- referência de comandos foi criada;
- roteiro de demonstração foi criado;
- resumo de bolso foi criado;
- documentação foi revisada;
- nomes foram revisados;
- configurações foram inventariadas;
- externalização foi preparada;
- transição para M17 foi criada;
- requisitos de container foram listados;
- graceful shutdown foi registrado;
- checkpoint oral foi criado;
- checkpoint prático foi criado;
- gate final foi executado novamente;
- nova feature não foi criada;
- Docker não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 506 está correta.

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
  docs/modules/m16 `
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
git commit -m "docs(m16): concluir modulo de integracoes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Tag opcional do marco:

```powershell
git tag `
  -a `
  "m16-completo" `
  -m `
  "Modulo 16 concluido"
```

Não envie a tag sem revisar a política do repositório.

Não inclua:

- segredo;
- token;
- payload real;
- banco local;
- logs;
- target;
- arquivo temporário;
- Dockerfile antecipado;
- configuração produtiva fictícia.

---

## Fechamento e ponte para a próxima aula

O Módulo 16 está oficialmente encerrado.

Você avançou de integrações simples para uma jornada completa e operável.

O módulo começou com:

```text
como chamar
outro sistema?
```

Terminou com:

```text
como preservar estado,
identidade,
recuperação,
segurança
e visibilidade
entre sistemas?
```

Você desenvolveu competências em:

- HTTP;
- contratos;
- Kafka;
- topics;
- keys;
- consumer groups;
- redelivery;
- Outbox;
- Inbox;
- idempotência;
- retries;
- backoff;
- poison messages;
- quarantine;
- replay;
- sagas;
- CDC;
- correlação;
- métricas;
- monitoramento;
- modularidade;
- revisão;
- testes;
- refatoração;
- ensino técnico.

O projeto final demonstrou:

```text
estado e evento
na mesma transação;

publicação at-least-once;

consumo durável;

deduplicação;

efeito idempotente;

provider HTTP;

timeout ambíguo;

retry limitado;

quarantine;

correlação;

métricas;

runbooks.
```

Também ficou explícito que o laboratório não é automaticamente production-ready.

Ainda seriam necessários, conforme o contexto:

- infraestrutura redundante;
- TLS;
- secret manager;
- banco gerenciado;
- retenção;
- carga;
- caos;
- SLOs;
- owners reais;
- on-call;
- disaster recovery;
- compliance.

A próxima aula será:

```text
506 - M17.01 - Docker revisao para Spring Boot
```

O Módulo 17 será:

```text
DevOps,
CI/CD,
Kubernetes
e Cloud.
```

A aplicação agora precisará sair do ambiente local como código executado manualmente e avançar para:

```text
artefato reproduzível;

container;

pipeline;

imagem;

registry;

deploy;

health;

configuração;

observabilidade operacional;

rollback.
```

Nenhum Dockerfile foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Executei o gate final.
- [ ] Inventariei contratos e artefatos.
- [ ] Consolidei garantias e identidades.
- [ ] Revisei segurança e observabilidade.
- [ ] Mapeei minhas competências.
- [ ] Registrei minhas lacunas.
- [ ] Preparei a transição para M17.
- [ ] Fiz o commit de encerramento.

---

## Troubleshooting adicional

### O gate final falha

Não encerre o módulo até identificar se a falha é de código, ambiente ou teste.

### Não encontro todos os contratos

Busque controllers, records, topics, headers e documentos.

### Meu mapa de competências ficou todo no nível máximo

Revise com evidências reais e cenários sem consulta.

### Não sei definir uma lacuna

Observe onde precisa copiar código, consultar aula ou pedir ajuda.

### A documentação está espalhada

Crie índices e links, sem reescrever tudo.

### O projeto depende de porta fixa

Registre para externalização no M17.

### Existe token no YAML

Confirme se é apenas valor didático; produção precisa de secret manager.

### Docker começou a aparecer no fechamento

Remova a implementação e mantenha apenas requisitos de transição.

### A tag Git foi criada no commit errado

Apague localmente antes de publicar e recrie no commit correto.

---

## Perguntas de revisão

1. Qual módulo foi concluído?
2. Qual foi a jornada principal?
3. O que é Outbox?
4. O que é Inbox?
5. Qual é a entrega do Kafka?
6. Existe exactly-once global?
7. Qual ID identifica o fato?
8. Qual ID identifica a jornada?
9. Qual é a key Kafka?
10. Qual é a dedup key da Inbox?
11. Qual é a idempotency key do provider?
12. Quando usar retry?
13. Quando usar quarantine?
14. Lag zero significa fluxo completo?
15. O que backlog age mostra?
16. O que precisa existir no fechamento?
17. O laboratório é production-ready?
18. Qual competência ainda precisa de prática?
19. Qual é o próximo módulo?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Módulo 16.
2. HTTP até provider externo.
3. Estado e intenção na mesma transação.
4. Recepção durável e deduplicação.
5. At-least-once.
6. Não.
7. eventId.
8. correlationId.
9. serviceOrderId.
10. consumerName + eventId.
11. sourceEventId.
12. Falha transitória.
13. Falha terminal.
14. Não.
15. Idade do item mais antigo.
16. Código, testes, docs e lacunas.
17. Não automaticamente.
18. Resposta pessoal com evidência.
19. Módulo 17.
20. Docker revisao para Spring Boot.

---

## Desafio opcional

Apresente o fechamento do Módulo 16 em vinte minutos.

Estrutura:

```text
3 min:
problema e jornada.

5 min:
Outbox, Kafka e Inbox.

4 min:
idempotência e timeout.

3 min:
observabilidade.

3 min:
trade-offs e limites.

2 min:
transição para DevOps.
```

Use:

- um diagrama;
- um teste;
- uma métrica;
- um runbook;
- uma limitação.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 505 - M16.50 - Fechamento do Modulo 16

- Encerrei oficialmente o Módulo 16.
- Executei o gate final.
- Registrei a baseline do projeto.
- Inventariei contratos HTTP.
- Inventariei eventos.
- Inventariei topic, key e consumer group.
- Inventariei tabelas e constraints.
- Inventariei lifecycles.
- Inventariei workers e claims.
- Consolidei correlationId, requestId, eventId, causationId, sourceEventId e replayRunId.
- Registrei as garantias de entrega.
- Mantive at-least-once sem prometer exactly-once global.
- Revisei falhas transitórias, permanentes, ambíguas e duplicatas.
- Inventariei retries e backoffs.
- Inventariei poison e quarantine.
- Revisei logs, métricas, lag e backlogs.
- Revisei cardinalidade.
- Revisei segurança e Actuator.
- Inventariei testes críticos.
- Criei mapa de competências.
- Classifiquei meu nível por competência.
- Criei análise de lacunas.
- Defini próximas práticas.
- Criei checklist final.
- Criei referência de comandos.
- Criei roteiro de demonstração.
- Criei resumo de bolso.
- Revisei documentação e configuração.
- Preparei a externalização para container.
- Registrei requisitos de graceful shutdown.
- Preparei a transição para o Módulo 17.
- Não criei Dockerfile antecipadamente.
- Próxima aula: Docker revisao para Spring Boot.
```

---

## Referência técnica curta

- HTTP Semantics.
- Apache Kafka.
- Transactional Outbox.
- Transactional Inbox.
- Idempotent Consumer.
- Retry and Backoff.
- SLF4J MDC.
- Micrometer.
- Production Readiness Review.
- Twelve-Factor App.

Regra final:

```text
o fechamento do Módulo 16 consolida uma jornada de integração completa: contratos HTTP e eventos versionados definem a comunicação, serviceOrderId organiza os records Kafka, transações locais unem estado e Outbox, at-least-once permite repetição, Inbox e unique constraints deduplicam, sourceEventId preserva a idempotência do provider, retries limitados tratam falhas transitórias, quarantine preserva falhas terminais, correlationId conecta logs e métricas mostram volume, duração, lag, backlog e idade; o encerramento exige baseline verde, inventário de entregáveis, mapa de competências, análise de lacunas, documentação reproduzível e limitações explícitas; o laboratório demonstra o modelo técnico, mas não substitui requisitos produtivos de infraestrutura, segurança, capacidade e governança; com o projeto validado e configurável, a formação avança para o Módulo 17, onde a aplicação será empacotada, automatizada, implantada e operada por práticas de DevOps, CI/CD, Kubernetes e Cloud.
```
