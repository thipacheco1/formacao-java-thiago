# 714 - M20.44 - System design interview

## Apresentação da aula

Na aula 713, você realizou uma sessão completa de live coding Java.

O trabalho anterior treinou:

- clarificação de requisitos;
- comunicação do raciocínio;
- escolha de estruturas de dados;
- análise de complexidade;
- tratamento de casos de borda;
- testes;
- debugging;
- refatoração;
- modelagem com records e enums;
- uso de mapas e conjuntos;
- idempotência;
- reconciliação;
- execução sob tempo controlado;
- revisão por scorecard;
- report, evidence e gate.

Agora você retornará ao desenho sistêmico, mas em uma situação diferente da aula 712.

Na aula 712, você preparou a entrevista de arquitetura do OrderFlow com documentos, matrizes, estratégias e uma defesa ampla.

Nesta aula, você realizará uma **system design interview completa a partir de um cenário aberto**, como acontece em processos seletivos.

O avaliador apresentará um problema parcialmente definido.

Você precisará descobrir o restante durante a conversa.

A sessão avaliará se você consegue:

- organizar o tempo;
- fazer perguntas relevantes;
- transformar linguagem de negócio em requisitos;
- declarar assumptions;
- estimar ordem de grandeza;
- escolher um desenho inicial simples;
- definir APIs;
- escolher modelos de dados;
- separar autoridade e projeção;
- tratar concorrência;
- planejar consistência;
- decidir entre comunicação síncrona e assíncrona;
- lidar com falhas;
- proteger dados e tenants;
- definir observabilidade;
- explicar escalabilidade;
- planejar disponibilidade;
- discutir custo;
- adaptar o desenho quando o entrevistador muda o cenário;
- defender decisões sem agir como se existisse apenas uma resposta correta.

O cenário central será:

```text
desenhar uma plataforma multi-tenant
para receber,
acompanhar
e processar pedidos,
integrando estoque,
pagamento
e fulfillment.
```

O cenário se relaciona ao OrderFlow, porém a entrevista começará do zero.

Você não poderá assumir que o avaliador conhece o projeto.

Você deverá construir a solução gradualmente e justificar cada parte.

A sessão será dividida em fases:

```text
discovery;

scope;

capacity;

high-level design;

API;

data;

consistency;

messaging;

failure handling;

security;

observability;

scaling;

availability;

cost;

scenario changes;

final defense.
```

A próxima aula será:

```text
715 - M20.45 - Como ensinar o que aprendeu
```

Na aula 715, você transformará conhecimento técnico em conteúdo ensinável, estruturando objetivos, explicações, exemplos, exercícios, avaliação, feedback e progressão pedagógica.

Nesta aula, nenhum material didático final será criado.

O laboratório será:

```text
labs/m20/aula-714-system-design-interview/orderflow-system-design-simulation
```

Regra central:

```text
uma system design interview forte
nao tenta impressionar
com o maior numero de tecnologias;

ela mostra
descoberta,
priorizacao,
estimativa,
decisao,
trade-off
e capacidade de adaptacao.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
711:
Entrevista DevOps cloud.

712:
Entrevista arquitetura.

713:
Live coding Java.

714:
System design interview.

715:
Como ensinar o que aprendeu.

716:
Aula ensinavel final.
```

A aula 714 usa como fonte:

- fundamentos de arquitetura;
- prática de discovery;
- modelagem do OrderFlow;
- APIs;
- PostgreSQL;
- Kafka;
- Outbox;
- Inbox;
- idempotência;
- segurança multi-tenant;
- observabilidade;
- Docker;
- Kubernetes;
- capacidade;
- disponibilidade;
- custos;
- respostas das entrevistas anteriores;
- disciplina de comunicação do live coding.

A diferença principal desta aula é o formato.

Você terá tempo limitado e informação incompleta.

Não haverá um roteiro entregue pelo avaliador.

Você deverá criar o roteiro durante a entrevista.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/system-design-interview
├── SYSTEM_DESIGN_INTERVIEW_CHARTER.md
├── TIME_BOX_PLAN.md
├── INTERVIEW_SCENARIO.md
├── DISCOVERY_NOTES.md
├── REQUIREMENTS_SUMMARY.md
├── ASSUMPTION_REGISTER.md
├── CAPACITY_CALCULATION.md
├── HIGH_LEVEL_DESIGN.md
├── API_DESIGN.md
├── DATA_MODEL.md
├── CONSISTENCY_MODEL.md
├── EVENT_FLOW.md
├── FAILURE_MODEL.md
├── SECURITY_MODEL.md
├── OBSERVABILITY_MODEL.md
├── SCALING_MODEL.md
├── AVAILABILITY_MODEL.md
├── DEPLOYMENT_MODEL.md
├── COST_MODEL.md
├── SCENARIO_CHANGE_01.md
├── SCENARIO_CHANGE_02.md
├── SCENARIO_CHANGE_03.md
├── FINAL_DEFENSE.md
├── INTERVIEWER_QUESTION_BANK.md
├── SYSTEM_DESIGN_SCORECARD.md
├── SYSTEM_DESIGN_REVIEW_CHECKLIST.md
├── SYSTEM_DESIGN_MATRIX.md
├── SYSTEM_DESIGN_RISK_REGISTER.md
├── SYSTEM_DESIGN_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Diagramas:

```text
docs/system-design-interview/diagrams
├── 01-context.md
├── 02-high-level.md
├── 03-write-flow.md
├── 04-event-flow.md
├── 05-failure-flow.md
├── 06-deployment.md
└── 07-scaling.md
```

Scripts:

```text
scripts/system-design-interview
├── start-interview-timer.ps1
├── validate-assumptions.ps1
├── validate-capacity-calculation.ps1
├── validate-diagram-links.ps1
├── run-scenario-changes.ps1
├── generate-system-design-report.ps1
└── collect-system-design-evidence.ps1
```

Artifacts:

```text
reports/system-design-interview-report.yaml

contracts/system-design-interview-evidence.yaml
```

---

## Conceito essencial

### O entrevistador avalia o processo

O desenho final importa, mas o caminho até ele mostra maturidade.

### Perguntas reduzem risco

Cada pergunta evita que uma decisão seja baseada em uma premissa invisível.

### Estimativa orienta escolhas

Sem ordem de grandeza, banco, fila, cache e particionamento viram opinião.

### Um desenho inicial simples é vantagem

Você pode evoluir uma solução clara.

É difícil corrigir uma solução complexa demais.

### Mudança de cenário faz parte da entrevista

O avaliador pode alterar volume, disponibilidade, compliance ou equipe para observar adaptação.

---

## Mão na massa guiada

### 1. Criar System Design Interview Charter

Arquivo:

```text
docs/system-design-interview/SYSTEM_DESIGN_INTERVIEW_CHARTER.md
```

Princípios:

```text
discover before designing;

state assumptions;

estimate before scaling;

start simple;

separate authority from projections;

design for failure;

make trade-offs visible;

teaching practice belongs to lesson 715.
```

---

## Planejamento do tempo

### 2. Criar Time Box Plan

Arquivo:

```text
docs/system-design-interview/TIME_BOX_PLAN.md
```

Sessão de 105 minutos:

```text
0 a 10:
discovery.

10 a 20:
scope e requirements.

20 a 30:
capacity.

30 a 45:
high-level design.

45 a 58:
API e data.

58 a 72:
consistency e events.

72 a 82:
security e observability.

82 a 92:
scaling e availability.

92 a 100:
scenario changes.

100 a 105:
final defense.
```

---

### 3. Preparar relógio visível

---

### 4. Definir checkpoints

Ao final de cada bloco, resuma:

- decisões;
- assumptions;
- dúvidas;
- próximos passos.

---

### 5. Evitar gastar metade da entrevista em discovery

Pergunte o que muda o desenho.

---

### 6. Reservar tempo para mudança de cenário

---

## Cenário

### 7. Criar Interview Scenario

Arquivo:

```text
docs/system-design-interview/INTERVIEW_SCENARIO.md
```

Problema inicial:

```text
uma empresa precisa de uma plataforma
para receber pedidos de varios clientes corporativos,
acompanhar a jornada
e integrar estoque,
pagamento
e fulfillment.
```

---

### 8. Não assumir requisitos adicionais

---

### 9. Repetir o problema

```text
vou confirmar:
precisamos receber pedidos multi-tenant,
processar uma jornada distribuida
e expor acompanhamento.
```

---

### 10. Perguntar qual é o objetivo principal

---

## Discovery

### 11. Criar Discovery Notes

Arquivo:

```text
docs/system-design-interview/DISCOVERY_NOTES.md
```

---

### 12. Perguntar quem cria pedidos

Possíveis respostas:

- API de parceiro;
- portal;
- serviço interno.

---

### 13. Perguntar quem consulta

---

### 14. Perguntar se criação precisa responder imediatamente

---

### 15. Perguntar se pagamento é síncrono ou assíncrono

---

### 16. Perguntar se estoque aceita reserva

---

### 17. Perguntar como fulfillment recebe trabalho

---

### 18. Perguntar se cancelamento é permitido

---

### 19. Perguntar se pedido duplicado é possível

---

### 20. Perguntar se existe multi-tenancy lógico ou físico

---

### 21. Perguntar dados sensíveis

---

### 22. Perguntar compliance

---

### 23. Perguntar duração de retenção

---

### 24. Perguntar disponibilidade

---

### 25. Perguntar latência

---

### 26. Perguntar volume médio e pico

---

### 27. Perguntar tamanho médio do pedido

---

### 28. Perguntar regiões atendidas

---

### 29. Perguntar tamanho e experiência da equipe

---

### 30. Perguntar orçamento e prazo

---

### 31. Registrar respostas ausentes

---

## Requisitos e escopo

### 32. Criar Requirements Summary

Arquivo:

```text
docs/system-design-interview/REQUIREMENTS_SUMMARY.md
```

---

### 33. Definir must-have

- registrar pedido;
- impedir duplicidade;
- acompanhar status;
- integrar estoque;
- integrar pagamento;
- iniciar fulfillment;
- cancelar quando permitido;
- isolar tenants;
- auditar decisões.

---

### 34. Definir should-have

- replay;
- administração;
- busca;
- relatórios;
- alertas.

---

### 35. Definir fora de escopo

Exemplo:

- recomendação;
- faturamento;
- analytics avançado;
- marketplace.

---

### 36. Definir requisitos não funcionais

---

### 37. Priorizar disponibilidade e durabilidade

---

### 38. Definir consistência por parte da jornada

---

### 39. Definir objetivo de latência

---

### 40. Definir recuperação

---

## Assumptions

### 41. Criar Assumption Register

Arquivo:

```text
docs/system-design-interview/ASSUMPTION_REGISTER.md
```

---

### 42. Numerar assumptions

Exemplo:

```text
A-01:
tenant vem de token confiavel.

A-02:
provider aceita operation ID.

A-03:
pedido medio possui ate dez itens.

A-04:
leitura pode ficar alguns segundos atrasada.
```

---

### 43. Marcar impacto

Classifique:

- baixo;
- médio;
- alto.

---

### 44. Marcar validação futura

---

### 45. Revisar assumptions quando o cenário mudar

---

## Capacidade

### 46. Criar Capacity Calculation

Arquivo:

```text
docs/system-design-interview/CAPACITY_CALCULATION.md
```

---

### 47. Assumir pedidos diários

Exemplo:

```text
5 milhoes de pedidos por dia.
```

---

### 48. Calcular média

```text
5.000.000 / 86.400
aproximadamente 58 pedidos por segundo.
```

---

### 49. Aplicar pico

Fator dez:

```text
aproximadamente 580 pedidos por segundo.
```

---

### 50. Estimar consultas

Se cada pedido gera dez consultas:

```text
aproximadamente 5.800 leituras por segundo no pico.
```

---

### 51. Estimar eventos

Considere seis a dez eventos por pedido.

---

### 52. Estimar storage bruto

Considere:

- pedido;
- itens;
- audit;
- Outbox;
- Inbox;
- projection;
- índices.

---

### 53. Estimar retenção anual

---

### 54. Estimar bandwidth

---

### 55. Estimar partitions iniciais

Use throughput e parallelism, sem fingir precisão absoluta.

---

### 56. Declarar margem e incerteza

---

## Desenho de alto nível

### 57. Criar High Level Design

Arquivo:

```text
docs/system-design-interview/HIGH_LEVEL_DESIGN.md
```

Componentes iniciais:

- API;
- PostgreSQL;
- Outbox publisher;
- Kafka;
- orchestration worker;
- provider gateways;
- projection worker;
- read model;
- identity provider;
- observability stack.

---

### 58. Começar com poucos runtimes

---

### 59. Explicar por que não iniciar com dezenas de microservices

---

### 60. Definir API stateless

---

### 61. Definir banco como autoridade

---

### 62. Definir Kafka como transporte de eventos

---

### 63. Definir read model para acompanhamento

---

### 64. Definir workers separados por responsabilidade

---

### 65. Desenhar contexto

Arquivo:

```text
docs/system-design-interview/diagrams/01-context.md
```

---

### 66. Desenhar alto nível

Arquivo:

```text
docs/system-design-interview/diagrams/02-high-level.md
```

---

## API design

### 67. Criar API Design

Arquivo:

```text
docs/system-design-interview/API_DESIGN.md
```

---

### 68. Definir criação

```text
POST /v1/orders
```

Headers:

```text
Authorization;

Idempotency-Key;

Traceparent.
```

---

### 69. Definir resposta

Possível:

```text
202 Accepted
```

com:

- order ID;
- current status;
- links;
- correlation ID.

---

### 70. Definir consulta

```text
GET /v1/orders/{orderId}
```

---

### 71. Definir cancelamento

```text
POST /v1/orders/{orderId}/cancellations
```

---

### 72. Definir listagem

Use keyset pagination quando volume justificar.

---

### 73. Definir errors

---

### 74. Definir versionamento

---

### 75. Definir rate limiting

---

### 76. Definir authorization por recurso

---

## Data model

### 77. Criar Data Model

Arquivo:

```text
docs/system-design-interview/DATA_MODEL.md
```

Tabelas centrais:

- order;
- order_item;
- order_audit;
- idempotency_record;
- outbox_message;
- inbox_message;
- order_projection.

---

### 78. Definir primary keys

---

### 79. Definir tenant ID em chaves e índices relevantes

---

### 80. Definir unique de idempotência

```text
tenant_id + idempotency_key
```

---

### 81. Definir version para optimistic locking

---

### 82. Definir status

---

### 83. Definir constraints

---

### 84. Definir índices por query

---

### 85. Evitar armazenar payload sem política de retenção

---

### 86. Separar entidade transacional e projection

---

## Consistência

### 87. Criar Consistency Model

Arquivo:

```text
docs/system-design-interview/CONSISTENCY_MODEL.md
```

---

### 88. Definir transação de criação

Persista:

- order;
- items;
- audit;
- idempotency;
- Outbox.

---

### 89. Explicar dual write

---

### 90. Explicar Outbox

---

### 91. Definir at-least-once

---

### 92. Definir Inbox

---

### 93. Definir optimistic locking

---

### 94. Definir resultado ambíguo

---

### 95. Definir reconciliação

---

### 96. Definir compensações

---

### 97. Explicar por que não existe transação global simples

---

## Event flow

### 98. Criar Event Flow

Arquivo:

```text
docs/system-design-interview/EVENT_FLOW.md
```

Eventos possíveis:

- OrderCreated;
- InventoryReserved;
- PaymentAuthorized;
- FulfillmentStarted;
- OrderCompleted;
- OrderRejected;
- OrderCancelled.

---

### 99. Definir key por order ID

---

### 100. Definir schema version

---

### 101. Definir ordering local

---

### 102. Definir retry topics

---

### 103. Definir DLQ

---

### 104. Definir replay autorizado

---

### 105. Definir retention

---

### 106. Desenhar write flow

Arquivo:

```text
docs/system-design-interview/diagrams/03-write-flow.md
```

---

### 107. Desenhar event flow

Arquivo:

```text
docs/system-design-interview/diagrams/04-event-flow.md
```

---

## Failure model

### 108. Criar Failure Model

Arquivo:

```text
docs/system-design-interview/FAILURE_MODEL.md
```

---

### 109. Falha antes do commit

Nada é aceito.

---

### 110. Falha após commit e antes da publicação

Outbox mantém evento.

---

### 111. Mensagem duplicada

Inbox ou idempotência de consumidor evita efeito repetido.

---

### 112. Provider timeout

Resultado permanece ambíguo.

---

### 113. Provider indisponível

Retry seletivo, breaker e reconciliação.

---

### 114. Kafka indisponível

Outbox acumula.

---

### 115. Projection atrasada

API de leitura mostra freshness ou fallback controlado.

---

### 116. Banco indisponível

Criação falha com resposta controlada.

---

### 117. Poison message

DLQ e inspeção.

---

### 118. Desenhar failure flow

Arquivo:

```text
docs/system-design-interview/diagrams/05-failure-flow.md
```

---

## Segurança

### 119. Criar Security Model

Arquivo:

```text
docs/system-design-interview/SECURITY_MODEL.md
```

---

### 120. Definir OAuth2 Resource Server

---

### 121. Validar issuer, audience e assinatura

---

### 122. Definir scopes e roles

---

### 123. Definir tenant a partir do token

---

### 124. Proibir tenant livre no body

---

### 125. Definir autorização por order ID e tenant

---

### 126. Definir secrets em runtime

---

### 127. Definir criptografia em trânsito e repouso

---

### 128. Definir logs sanitizados

---

### 129. Definir testes cross-tenant

---

## Observabilidade

### 130. Criar Observability Model

Arquivo:

```text
docs/system-design-interview/OBSERVABILITY_MODEL.md
```

---

### 131. Definir correlation ID

---

### 132. Definir trace distribuído

---

### 133. Definir métricas de API

- throughput;
- p95;
- p99;
- error rate.

---

### 134. Definir métricas assíncronas

- Outbox age;
- consumer lag;
- retry count;
- DLQ depth;
- projection freshness.

---

### 135. Definir métricas de provider

---

### 136. Definir SLOs

---

### 137. Definir alertas acionáveis

---

### 138. Definir runbooks

---

## Scaling

### 139. Criar Scaling Model

Arquivo:

```text
docs/system-design-interview/SCALING_MODEL.md
```

---

### 140. Escalar API horizontalmente

---

### 141. Escalar publisher por claim seguro

---

### 142. Escalar consumers por partitions

---

### 143. Escalar projection workers

---

### 144. Revisar connection pool

---

### 145. Revisar índices e queries

---

### 146. Considerar read replicas somente para leituras compatíveis

---

### 147. Considerar partitioning quando dados e workload justificarem

---

### 148. Definir backpressure

---

### 149. Definir load shedding

---

### 150. Desenhar scaling

Arquivo:

```text
docs/system-design-interview/diagrams/07-scaling.md
```

---

## Availability

### 151. Criar Availability Model

Arquivo:

```text
docs/system-design-interview/AVAILABILITY_MODEL.md
```

---

### 152. Definir múltiplas zonas

---

### 153. Definir banco com estratégia de failover

---

### 154. Definir broker redundante

---

### 155. Definir RTO

---

### 156. Definir RPO

---

### 157. Definir backup e restore testado

---

### 158. Definir graceful degradation

---

### 159. Definir disaster recovery como evolução quando não exigido

---

## Deployment

### 160. Criar Deployment Model

Arquivo:

```text
docs/system-design-interview/DEPLOYMENT_MODEL.md
```

---

### 161. Definir containers imutáveis

---

### 162. Definir build once

---

### 163. Definir rollout progressivo

---

### 164. Definir schema compatível

---

### 165. Definir smoke tests

---

### 166. Definir rollback e roll-forward

---

### 167. Desenhar deployment

Arquivo:

```text
docs/system-design-interview/diagrams/06-deployment.md
```

---

## Cost model

### 168. Criar Cost Model

Arquivo:

```text
docs/system-design-interview/COST_MODEL.md
```

Custos principais:

- banco;
- Kafka;
- compute;
- storage;
- observabilidade;
- egress;
- backup;
- suporte operacional.

---

### 169. Identificar custo dominante

---

### 170. Definir right-sizing

---

### 171. Definir retenção de logs e eventos

---

### 172. Definir managed versus self-hosted

---

### 173. Explicar custo de complexidade

---

## Mudança de cenário 1

### 174. Criar Scenario Change 01

Arquivo:

```text
docs/system-design-interview/SCENARIO_CHANGE_01.md
```

Mudança:

```text
o volume cresce dez vezes
em tres meses.
```

---

### 175. Recalcular throughput

---

### 176. Revisar partitions

---

### 177. Revisar banco

---

### 178. Revisar consumers

---

### 179. Revisar provider capacity

---

### 180. Revisar custo

---

### 181. Não redesenhar tudo automaticamente

---

## Mudança de cenário 2

### 182. Criar Scenario Change 02

Arquivo:

```text
docs/system-design-interview/SCENARIO_CHANGE_02.md
```

Mudança:

```text
um tenant enterprise exige
isolamento fisico de dados.
```

---

### 183. Separar estratégia de tenant

---

### 184. Avaliar banco dedicado

---

### 185. Avaliar routing

---

### 186. Avaliar migrations

---

### 187. Avaliar observabilidade

---

### 188. Avaliar custo

---

## Mudança de cenário 3

### 189. Criar Scenario Change 03

Arquivo:

```text
docs/system-design-interview/SCENARIO_CHANGE_03.md
```

Mudança:

```text
pagamento fica indisponivel
por duas horas.
```

---

### 190. Definir fila de espera

---

### 191. Definir estado intermediário

---

### 192. Definir retry controlado

---

### 193. Definir breaker

---

### 194. Definir comunicação ao cliente

---

### 195. Definir reconciliação

---

### 196. Definir limite de backlog

---

## Defesa final

### 197. Criar Final Defense

Arquivo:

```text
docs/system-design-interview/FINAL_DEFENSE.md
```

Estrutura:

1. contexto;
2. requisitos;
3. desenho;
4. dados;
5. consistência;
6. eventos;
7. falhas;
8. segurança;
9. observabilidade;
10. escala;
11. disponibilidade;
12. custos;
13. limites;
14. gatilhos de mudança.

---

### 198. Criar resposta de cinco minutos

---

### 199. Criar resposta de quinze minutos

---

### 200. Declarar maior risco

---

### 201. Declarar maior assumption

---

### 202. Declarar maior custo

---

### 203. Declarar próxima medição

---

## Question bank

### 204. Criar Interviewer Question Bank

Arquivo:

```text
docs/system-design-interview/INTERVIEWER_QUESTION_BANK.md
```

Perguntas:

- por que PostgreSQL?
- por que Kafka?
- por que Outbox?
- por que não síncrono?
- por que não microservices?
- como recuperar?
- como escalar?
- como proteger tenant?
- onde está o maior gargalo?
- quanto custa?
- o que mudaria primeiro?

---

### 205. Preparar respostas curtas

---

### 206. Preparar respostas aprofundadas

---

### 207. Preparar respostas para “depende”

Explique de quais variáveis depende.

---

### 208. Preparar resposta para “não sei”

Diga como investigaria.

---

## Simulação

### 209. Executar simulação de 105 minutos

---

### 210. Gravar tela, voz e diagramas

---

### 211. Não consultar solução pronta

---

### 212. Pedir feedback apenas no final de cada bloco

---

### 213. Executar segunda rodada adversarial

---

### 214. Trocar pelo menos duas assumptions

---

## Scorecard

### 215. Criar System Design Scorecard

Arquivo:

```text
docs/system-design-interview/SYSTEM_DESIGN_SCORECARD.md
```

Critérios de um a cinco:

- discovery;
- scope;
- requirements;
- assumptions;
- estimation;
- high-level design;
- API;
- data;
- consistency;
- messaging;
- failure handling;
- security;
- observability;
- scaling;
- availability;
- cost;
- adaptation;
- communication;
- time management;
- honesty.

---

### 216. Criar Review Checklist

Arquivo:

```text
docs/system-design-interview/SYSTEM_DESIGN_REVIEW_CHECKLIST.md
```

Perguntas:

- fiz perguntas úteis?
- controlei o tempo?
- declarei assumptions?
- estimei volume?
- comecei simples?
- defini autoridade?
- tratei falhas?
- expliquei custos?
- adaptei o desenho?
- evitei antecipar a aula 715?

---

### 217. Criar Matrix

Arquivo:

```text
docs/system-design-interview/SYSTEM_DESIGN_MATRIX.md
```

Colunas:

- requisito;
- decisão;
- alternativa;
- benefício;
- custo;
- risco;
- evidence;
- score.

---

### 218. Criar Risk Register

Arquivo:

```text
docs/system-design-interview/SYSTEM_DESIGN_RISK_REGISTER.md
```

Riscos:

```text
discovery superficial;

tempo mal distribuido;

assumption oculta;

estimativa falsa;

tecnologia prematura;

autoridade indefinida;

falha ignorada;

custo omitido;

cenario nao adaptado;

ensino antecipado.
```

---

### 219. Criar Traceability

Arquivo:

```text
docs/system-design-interview/SYSTEM_DESIGN_TRACEABILITY.md
```

Exemplo:

```text
duplicate prevention
-> idempotency key
-> unique constraint
-> persisted response
-> concurrency test.

durable event publication
-> local transaction
-> Outbox
-> publisher
-> replay evidence.

tenant isolation
-> JWT claim
-> application context
-> database predicate
-> negative test.
```

---

### 220. Criar boundary da próxima aula

Arquivo:

```text
docs/system-design-interview/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 714 define:

- timed system design interview;
- open scenario;
- discovery;
- scope;
- requirements;
- assumptions;
- capacity;
- high-level design;
- APIs;
- data model;
- consistency;
- messaging;
- failure model;
- security;
- observability;
- scaling;
- availability;
- deployment;
- cost;
- scenario changes;
- final defense;
- scorecard.

A aula 715 define:

- learning objectives;
- audience analysis;
- explanation structure;
- analogy;
- worked example;
- guided practice;
- exercise design;
- assessment;
- feedback;
- lesson progression;
- teaching artifacts;
- teach-back simulation.

Nenhum material ensinavel final
e produzido nesta aula.
```

---

## Relatório e evidence

### 221. Criar report

Arquivo:

```text
reports/system-design-interview-report.yaml
```

Exemplo:

```yaml
systemDesignInterview:
  timing:
    plannedMinutes:
      105
    actualMinutes:
      measured

  discovery:
    questions:
      measured
    assumptions:
      measured

  design:
    requirements:
      PASS
    capacity:
      PASS
    API:
      PASS
    data:
      PASS
    consistency:
      PASS
    messaging:
      PASS
    failureHandling:
      PASS
    security:
      PASS
    observability:
      PASS
    scaling:
      PASS
    availability:
      PASS
    cost:
      PASS

  adaptation:
    scenarioChangesCompleted:
      3

  integrity:
    unsupportedClaims:
      0
    hiddenAssumptions:
      0

  teachingPreparation:
    completed:
      false

  gate:
    PASS
```

---

### 222. Criar evidence

Arquivo:

```text
contracts/system-design-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- interview duration;
- discovery question count;
- requirement count;
- assumption count;
- high-impact assumption count;
- capacity calculation status;
- context diagram status;
- high-level diagram status;
- write-flow diagram status;
- event-flow diagram status;
- failure-flow diagram status;
- deployment diagram status;
- scaling diagram status;
- API endpoint count;
- data table count;
- event type count;
- failure scenario count;
- security control count;
- observability signal count;
- scaling decision count;
- availability control count;
- scenario change count;
- trade-off count;
- unsupported claim count;
- hidden assumption count;
- average score;
- lowest topic;
- highest topic;
- teaching preparation completed;
- documentation status;
- gate status;
- timestamp.

---

### 223. Criar gate

Status:

```text
PASS;

FAIL_TIME_BOX;

FAIL_SCENARIO;

FAIL_DISCOVERY;

FAIL_REQUIREMENTS;

FAIL_ASSUMPTIONS;

FAIL_CAPACITY;

FAIL_HIGH_LEVEL_DESIGN;

FAIL_API;

FAIL_DATA_MODEL;

FAIL_CONSISTENCY;

FAIL_EVENT_FLOW;

FAIL_FAILURE_MODEL;

FAIL_SECURITY;

FAIL_OBSERVABILITY;

FAIL_SCALING;

FAIL_AVAILABILITY;

FAIL_DEPLOYMENT;

FAIL_COST;

FAIL_SCENARIO_CHANGE_01;

FAIL_SCENARIO_CHANGE_02;

FAIL_SCENARIO_CHANGE_03;

FAIL_FINAL_DEFENSE;

FAIL_SCORECARD;

FAIL_UNSUPPORTED_CLAIM;

FAIL_HIDDEN_ASSUMPTION;

FAIL_TEACHING_ANTICIPATION;

INCONCLUSIVE.
```

---

### 224. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\system-design-interview\validate-assumptions.ps1

.\scripts\system-design-interview\validate-capacity-calculation.ps1

.\scripts\system-design-interview\validate-diagram-links.ps1

.\scripts\system-design-interview\run-scenario-changes.ps1

.\scripts\system-design-interview\collect-system-design-evidence.ps1
```

---

### 225. Revisar gravação

Selecione:

- cinco perguntas úteis;
- três assumptions tardias;
- três decisões fortes;
- dois custos omitidos;
- dois momentos de má gestão de tempo;
- um plano de melhoria.

---

### 226. Repetir a entrevista em 60 minutos

A segunda execução deve ser mais objetiva.

---

### 227. Comparar as duas rodadas

---

### 228. Encerrar o laboratório

Confirme:

- Charter;
- time box;
- cenário;
- discovery;
- requirements;
- assumptions;
- capacity;
- high-level;
- API;
- data;
- consistency;
- events;
- failures;
- security;
- observability;
- scaling;
- availability;
- deployment;
- cost;
- três mudanças;
- final defense;
- question bank;
- duas rodadas;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 715 preservada.

---

## Entendendo o que foi feito

### A entrevista ganhou ritmo

Cada fase passou a possuir tempo e resultado esperado.

### Discovery ganhou foco

Perguntas passaram a reduzir incerteza real.

### Estimativas ganharam consequência

Throughput, eventos e storage influenciaram o desenho.

### O high-level design começou simples

Complexidade passou a ser adicionada apenas com motivo.

### Consistência ganhou fluxo completo

Banco, Outbox, Kafka, Inbox e reconciliação foram conectados.

### Falhas ganharam estados explícitos

Timeout e indisponibilidade deixaram de ser respostas binárias.

### Segurança atravessou o desenho

Tenant, autorização, secrets e testes não ficaram no final.

### Cenários adversariais ganharam adaptação

O desenho evoluiu sem ser descartado inteiro.

### A defesa ganhou honestidade

Limites, custos e assumptions passaram a ser declarados.

---

## Erros comuns importantes

### Começar desenhando microservices

O problema ainda não foi entendido.

### Não controlar o relógio

A entrevista termina antes da defesa.

### Fazer vinte perguntas sem priorizar

Discovery vira interrogatório.

### Estimar com precisão falsa

Ordem de grandeza é mais honesta.

### Escolher Kafka sem explicar fluxo

Tecnologia vira decoração.

### Ignorar estado ambíguo

Timeout pode gerar duplicidade.

### Escalar API e ignorar banco

O gargalo permanece.

### Falar de alta disponibilidade sem RTO e RPO

O objetivo fica indefinido.

### Não recalcular após mudança de cenário

A adaptação fica superficial.

### Antecipar a aula de ensino

Essa etapa pertence à aula 715.

---

## Comandos úteis

### Iniciar cronômetro

```powershell
.\scripts\system-design-interview\start-interview-timer.ps1
```

### Validar assumptions

```powershell
.\scripts\system-design-interview\validate-assumptions.ps1
```

### Validar estimativas

```powershell
.\scripts\system-design-interview\validate-capacity-calculation.ps1
```

### Coletar evidence

```powershell
.\scripts\system-design-interview\collect-system-design-evidence.ps1
```

---

## Exercício principal

Execute uma system design interview de 105 minutos.

Inclua:

1. repetir o cenário;
2. perguntar usuários;
3. perguntar jornada;
4. perguntar volume;
5. perguntar latência;
6. perguntar disponibilidade;
7. perguntar consistência;
8. perguntar segurança;
9. definir escopo;
10. registrar assumptions;
11. calcular média;
12. calcular pico;
13. estimar eventos;
14. estimar storage;
15. desenhar contexto;
16. desenhar high-level;
17. definir API;
18. definir data model;
19. definir idempotência;
20. definir transação;
21. definir Outbox;
22. definir eventos;
23. definir retry;
24. definir DLQ;
25. definir timeout;
26. definir reconciliação;
27. definir tenant;
28. definir observabilidade;
29. definir scaling;
30. definir availability;
31. definir deployment;
32. definir custos;
33. responder volume dez vezes maior;
34. responder tenant isolado;
35. responder provider indisponível;
36. apresentar defesa final;
37. preencher scorecard;
38. revisar gravação;
39. repetir em sessenta minutos.

Não produza a aula ensinável da etapa seguinte.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 713 e ponte para a aula 715 foram preservadas;
- System Design Interview Charter foi criado;
- Time Box Plan foi criado;
- checkpoints foram definidos;
- tempo para mudanças foi preservado;
- Interview Scenario foi criado;
- problema foi repetido;
- requisitos não foram presumidos;
- Discovery Notes foi criado;
- usuários, consulta, latência, volume, segurança, retenção, regiões, equipe, prazo e orçamento foram investigados;
- respostas ausentes foram registradas;
- Requirements Summary foi criado;
- must, should e out of scope foram definidos;
- requisitos não funcionais foram priorizados;
- Assumption Register foi criado;
- assumptions foram numeradas;
- impacto e validação foram registrados;
- Capacity Calculation foi criada;
- média, pico, consultas, eventos, storage, retenção, bandwidth e partitions foram estimados;
- margem e incerteza foram declaradas;
- High Level Design foi criado;
- poucos runtimes foram usados inicialmente;
- microservices prematuros foram evitados;
- API, banco, Kafka, read model e workers foram definidos;
- diagramas de contexto e alto nível foram criados;
- API Design foi criado;
- criação, consulta, cancelamento, paginação, errors, versionamento, rate limiting e autorização foram definidos;
- Data Model foi criado;
- tabelas, chaves, tenant, idempotência, version, constraints e índices foram definidos;
- projection foi separada;
- Consistency Model foi criado;
- transação, dual write, Outbox, at-least-once, Inbox, locking, ambiguity, reconciliation e compensation foram tratados;
- Event Flow foi criado;
- eventos, key, schema, ordering, retries, DLQ, replay e retention foram definidos;
- diagramas de escrita e eventos foram criados;
- Failure Model foi criado;
- falhas de commit, publicação, duplicidade, provider, Kafka, projection, banco e poison message foram tratadas;
- diagrama de falhas foi criado;
- Security Model foi criado;
- Resource Server, JWT, tenant, autorização, secrets, criptografia, logs e testes foram definidos;
- Observability Model foi criado;
- correlation, traces, métricas, SLOs, alertas e runbooks foram definidos;
- Scaling Model foi criado;
- API, publisher, consumers, projection, pool, banco, replicas, partitioning, backpressure e load shedding foram tratados;
- diagrama de scaling foi criado;
- Availability Model foi criado;
- zonas, failover, broker, RTO, RPO, backup e degradação foram definidos;
- Deployment Model foi criado;
- artifacts, build once, rollout, schema, smoke, rollback e roll-forward foram tratados;
- diagrama de deployment foi criado;
- Cost Model foi criado;
- custos dominantes, right-sizing, retenção, managed e complexidade foram tratados;
- Scenario Change 01 foi resolvido;
- throughput, partitions, banco, consumers, provider e custo foram revisados;
- Scenario Change 02 foi resolvido;
- isolamento físico, banco, routing, migrations, observabilidade e custo foram tratados;
- Scenario Change 03 foi resolvido;
- backlog, estado, retry, breaker, comunicação e reconciliação foram tratados;
- Final Defense foi criada;
- versões de cinco e quinze minutos foram preparadas;
- risco, assumption, custo e próxima medição foram declarados;
- Interviewer Question Bank foi criado;
- respostas curtas, longas, dependências e incertezas foram preparadas;
- simulação de 105 minutos foi executada;
- tela, voz e diagramas foram gravados;
- solução pronta não foi consultada;
- segunda rodada adversarial foi executada;
- assumptions foram alteradas;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 715 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- gravação foi revisada;
- entrevista foi repetida em sessenta minutos;
- rodadas foram comparadas;
- commit recomendado e diário de bordo estão presentes;
- material ensinável da aula 715 não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\system-design-interview\validate-assumptions.ps1

.\scripts\system-design-interview\validate-capacity-calculation.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/system-design-interview `
  scripts/system-design-interview `
  reports/system-design-interview-report.yaml `
  contracts/system-design-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-volume-claim|hidden-assumption|realTenant|realCustomer|teaching-final-material"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(system-design): complete timed architecture simulation"
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

- assumption oculta;
- claim de produção sem evidence;
- secret;
- material final da aula 715.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou uma system design interview completa.

Você praticou:

```text
time boxing;

open scenario;

discovery;

requirements;

assumptions;

capacity;

high-level design;

API;

data;

consistency;

events;

failure handling;

security;

observability;

scaling;

availability;

deployment;

cost;

scenario changes;

final defense;

scorecard;

report e evidence.
```

Agora você consegue conduzir uma entrevista partindo de informação incompleta, construir um desenho inicial, adaptar decisões e defender trade-offs.

A próxima aula será:

```text
715 - M20.45 - Como ensinar o que aprendeu
```

Nela, você transformará conhecimento técnico em conteúdo ensinável, com objetivo, audiência, explicação, exemplo, prática guiada, exercício, avaliação, feedback e progressão.

Nenhum material ensinável final foi produzido nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Controlei o tempo.
- [ ] Fiz discovery.
- [ ] Defini escopo.
- [ ] Registrei assumptions.
- [ ] Estimei capacidade.
- [ ] Desenhei high-level.
- [ ] Defini API e dados.
- [ ] Modelei consistência e eventos.
- [ ] Tratei falhas.
- [ ] Defini segurança e observabilidade.
- [ ] Tratei escala e disponibilidade.
- [ ] Respondi mudanças de cenário.
- [ ] Fiz defesa final.
- [ ] Comparei duas rodadas.
- [ ] Preservei ensino para a aula 715.

---

## Troubleshooting adicional

### O tempo de discovery passou

Resuma e avance com assumptions explícitas.

### Não recebi volume

Use ordem de grandeza e marque a premissa.

### O desenho ficou grande demais

Volte ao must-have.

### Não sei escolher Kafka

Explique primeiro o requisito assíncrono.

### A estimativa parece fraca

Mostre fórmula e margem.

### O entrevistador muda o tenant model

Revise dados, routing, observabilidade e custo.

### Provider caiu por horas

Modele backlog, estados e comunicação.

### Não sei responder uma tecnologia específica

Explique o comportamento necessário e como validaria a ferramenta.

### A defesa ficou longa

Comece pela conclusão e aprofunde sob pergunta.

### Quero montar uma aula sobre isso

Essa etapa pertence à aula 715.

---

## Perguntas de revisão

1. System design começa por tecnologia?
2. O que time box protege?
3. Toda pergunta de discovery é útil?
4. Assumption precisa ser registrada?
5. Estimativa é número exato?
6. Por que começar simples?
7. Projection é autoridade?
8. Outbox resolve qual risco?
9. At-least-once exige o quê?
10. Timeout é falha definitiva?
11. Tenant pode vir do body?
12. Escalar API resolve provider?
13. RTO e RPO são iguais?
14. Rollback ignora schema?
15. Custo faz parte da arquitetura?
16. Mudança de cenário exige redesenho total?
17. O que maior risco representa?
18. Por que repetir em sessenta minutos?
19. O que scorecard mede?
20. O que evidence registra?
21. O que a aula 715 fará?
22. O que não foi produzido?
23. Qual é a próxima aula?
24. Qual é a regra central?
25. O que fazer quando não sabe?

---

## Roteiro de resposta

1. Não.
2. Cobertura da entrevista.
3. Não.
4. Sim.
5. Não.
6. Evoluir com clareza.
7. Não.
8. Dual write.
9. Idempotência.
10. Não.
11. Não.
12. Não.
13. Não.
14. Não.
15. Sim.
16. Não.
17. Prioridade de mitigação.
18. Melhorar objetividade.
19. Processo e decisões.
20. Execução verificável.
21. Ensinar o aprendido.
22. Aula ensinável final.
23. Como ensinar o que aprendeu.
24. Descobrir, estimar, decidir e adaptar.
25. Declarar e investigar.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 714 - M20.44 - System design interview

- Continuei após Live coding Java.
- Criei System Design Interview Charter.
- Criei Time Box Plan de 105 minutos.
- Defini checkpoints.
- Criei cenário aberto multi-tenant.
- Criei Discovery Notes.
- Investiguei usuários, jornadas, volume, latência, consistência, segurança, retenção, regiões, equipe e orçamento.
- Criei Requirements Summary.
- Priorizei must, should e out of scope.
- Criei Assumption Register.
- Numerei e classifiquei assumptions.
- Criei Capacity Calculation.
- Estimei média, pico, consultas, eventos, storage, bandwidth e partitions.
- Declarei margem e incerteza.
- Criei High Level Design.
- Comecei com poucos runtimes.
- Criei diagramas de contexto e alto nível.
- Criei API Design.
- Defini criação, consulta, cancelamento, paginação, errors, versionamento e autorização.
- Criei Data Model.
- Defini order, items, audit, idempotency, Outbox, Inbox e projection.
- Criei Consistency Model.
- Revisei transação local, dual write, Outbox, at-least-once, Inbox, locking, ambiguity, reconciliation e compensation.
- Criei Event Flow.
- Defini eventos, key, schema, ordering, retry, DLQ e replay.
- Criei diagramas de escrita e eventos.
- Criei Failure Model.
- Modelei falhas de commit, publicação, duplicidade, provider, Kafka, projection, banco e poison message.
- Criei Security Model.
- Defini Resource Server, JWT, tenant, autorização, secrets, criptografia, logs e testes.
- Criei Observability Model.
- Defini correlation, traces, métricas, SLOs, alertas e runbooks.
- Criei Scaling Model.
- Tratei API, publisher, consumers, projection, pool, banco, replicas, partitioning, backpressure e load shedding.
- Criei Availability Model.
- Defini zonas, failover, RTO, RPO, backup e degradação.
- Criei Deployment Model.
- Defini build once, rollout, schema, smoke, rollback e roll-forward.
- Criei Cost Model.
- Revisei banco, Kafka, compute, storage, observabilidade, egress e complexidade.
- Resolvi crescimento de dez vezes.
- Resolvi isolamento físico para tenant enterprise.
- Resolvi indisponibilidade de pagamento.
- Criei Final Defense.
- Preparei respostas de cinco e quinze minutos.
- Declarei maior risco, assumption, custo e próxima medição.
- Criei Interviewer Question Bank.
- Executei simulação de 105 minutos.
- Gravei tela, voz e diagramas.
- Executei segunda rodada adversarial.
- Alterei assumptions durante a rodada.
- Criei Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 715.
- Criei report, evidence e gate.
- Revisei gravação.
- Repeti a entrevista em sessenta minutos.
- Comparei as duas rodadas.
- Não antecipei material ensinável.
- Próxima aula: Como ensinar o que aprendeu.
```

---

## Referência técnica curta

- System Design Interview.
- Time Box.
- Discovery.
- Scope.
- Requirement.
- Assumption.
- Capacity Estimate.
- High-Level Design.
- API Design.
- Data Model.
- Consistency Model.
- Outbox.
- Inbox.
- Failure Model.
- Security Model.
- Observability.
- Scaling.
- Availability.
- Deployment.
- Cost Model.
- Scenario Change.
- Final Defense.

Regra final:

```text
A system design interview do OrderFlow deve demonstrar processo sob tempo controlado: time box reserva discovery, scope, capacity, high-level, API, data, consistency, security, scaling, scenario changes and defense, discovery investiga actors, journey, volume, latency, consistency, availability, security, retention, regions, team and budget, requirements separam must, should and out of scope, assumptions são numeradas, classificadas and revisitadas, capacity calcula average, peak, read ratio, events, storage, bandwidth and partitions com margem explícita, high-level design começa com API, PostgreSQL, Outbox publisher, Kafka, workers, gateways, projection and observability sem microservices prematuros, API usa idempotency key, async acceptance, resource authorization, errors and keyset pagination, data model separa transactional authority, audit, idempotency, Outbox, Inbox and projection com tenant-aware constraints, consistency usa local transaction, optimistic locking, at-least-once, ambiguity, reconciliation and compensation, event flow define aggregate key, schema, ordering, retries, DLQ and replay, failure model cobre commit, publication, duplicate, provider timeout, Kafka outage, stale projection, database outage and poison messages, security usa validated JWT, trusted tenant, resource policy, runtime secrets, encryption, sanitized logs and negative tests, observability mede API percentiles, Outbox age, lag, retries, DLQ, provider errors and freshness, scaling trata stateless API, safe publisher claims, consumer partitions, database tuning, replicas, partitioning, backpressure and load shedding, availability define zones, failover, RTO, RPO, tested restore and graceful degradation, deployment usa immutable artifacts, build once, progressive rollout, compatible schema, smoke, rollback and roll-forward, cost model inclui database, Kafka, compute, storage, telemetry, egress and operational complexity, três scenario changes testam tenfold growth, physical tenant isolation and long payment outage, final defense declara risks, assumptions, costs and next measurements, duas timed rounds geram scorecard, report and evidence, e o gate fecha a entrevista enquanto objectives, audience, explanations, examples, guided practice, assessment and teach-back permanecem reservados para a aula 715.
```
