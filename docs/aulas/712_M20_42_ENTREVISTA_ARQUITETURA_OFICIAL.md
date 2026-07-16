# 712 - M20.42 - Entrevista arquitetura

## Apresentação da aula

Na aula 711, você concluiu a preparação para uma entrevista DevOps cloud.

O material anterior organizou:

- Linux e runtime;
- processos e sinais;
- imagens e containers;
- Dockerfiles;
- Docker Compose;
- registries;
- supply chain;
- CI/CD;
- GitHub Actions;
- artifacts;
- configuração;
- Kubernetes;
- workloads;
- networking;
- probes;
- autoscaling;
- cloud;
- IAM;
- storage;
- observabilidade;
- deploy;
- rollback;
- custos;
- troubleshooting;
- duas entrevistas simuladas;
- scorecard;
- report, evidence e gate.

Agora você avançará para uma entrevista de arquitetura.

Essa é uma das etapas mais amplas da formação.

A entrevista de arquitetura avalia se você consegue transformar um problema incompleto em um desenho técnico coerente.

O avaliador não espera apenas um diagrama bonito.

Ele observa se você consegue:

- fazer perguntas;
- identificar requisitos;
- descobrir restrições;
- priorizar atributos de qualidade;
- estimar volume;
- definir boundaries;
- escolher autoridade dos dados;
- modelar fluxos síncronos e assíncronos;
- tratar falhas;
- proteger segurança;
- planejar observabilidade;
- discutir escalabilidade;
- explicar disponibilidade;
- reconhecer custos;
- declarar limites;
- comparar alternativas;
- adaptar o desenho quando o contexto muda.

Perguntas comuns:

- como você começa um system design?
- quais requisitos ainda estão faltando?
- qual é o volume esperado?
- qual é o SLA?
- quais dados precisam de consistência forte?
- quando usar mensageria?
- por que não começar com microserviços?
- como evitar acoplamento?
- onde fica a transação?
- como tratar duplicidade?
- como lidar com timeout de provider?
- como o sistema escala?
- qual componente vira gargalo?
- como garantir tenant isolation?
- como o sistema é observado?
- como fazer deploy sem quebrar contratos?
- como recuperar de falha parcial?
- quais trade-offs foram aceitos?
- o que você mudaria se o volume fosse dez vezes maior?
- o que você não sabe ainda?

Uma resposta superficial começa escolhendo tecnologias:

```text
eu usaria Kafka,
Kubernetes,
Redis
e microservicos.
```

Uma resposta profissional começa pelo problema:

```text
antes de escolher tecnologia,
eu preciso entender
volume,
latencia,
consistencia,
disponibilidade,
seguranca,
operacao
e restricoes da equipe.
```

Nesta aula, você treinará uma banca arquitetural completa baseada no OrderFlow.

O foco será:

- discovery;
- requisitos;
- constraints;
- qualidade;
- contexto;
- boundaries;
- APIs;
- dados;
- consistência;
- transações;
- mensageria;
- integrações;
- segurança;
- observabilidade;
- escalabilidade;
- disponibilidade;
- cache;
- resiliência;
- deployment;
- custos;
- evolução;
- diagramas;
- defesa;
- simulação.

A próxima aula será:

```text
713 - M20.43 - Live coding Java
```

Na aula 713, você resolverá problemas práticos em Java sob tempo controlado, explicando raciocínio, testes, complexidade, refatoração e comunicação.

Nesta aula, nenhum live coding completo será executado.

O laboratório será:

```text
labs/m20/aula-712-entrevista-arquitetura/orderflow-architecture-interview
```

Regra central:

```text
uma boa entrevista de arquitetura
nao comeca pela tecnologia;

ela comeca
pelo problema,
pelos requisitos,
pelas restricoes
e pelos trade-offs.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
709:
Entrevista SQL banco.

710:
Entrevista seguranca.

711:
Entrevista DevOps cloud.

712:
Entrevista arquitetura.

713:
Live coding Java.

714:
Live coding SQL.
```

A aula 712 utiliza como fonte:

- arquitetura final do OrderFlow;
- ADRs;
- diagramas;
- boundaries;
- contratos;
- modelos de dados;
- Outbox;
- Inbox;
- Kafka;
- integração com providers;
- segurança;
- observabilidade;
- CI/CD;
- deployment simulation;
- runbooks;
- performance baseline;
- reports;
- evidence;
- respostas das entrevistas anteriores.

A banca precisa preservar a verdade do projeto.

Não apresente produção real quando houve simulação.

Não apresente benchmark definitivo quando houve baseline controlada.

Não apresente microserviços independentes quando existem módulos e runtimes específicos.

Não afirme exactly-once global quando o sistema trabalha com at-least-once e idempotência.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/interview-arquitetura
├── ARCHITECTURE_INTERVIEW_CHARTER.md
├── DISCOVERY_QUESTION_FRAMEWORK.md
├── FUNCTIONAL_REQUIREMENTS.md
├── NON_FUNCTIONAL_REQUIREMENTS.md
├── CONSTRAINTS_AND_ASSUMPTIONS.md
├── CAPACITY_ESTIMATION.md
├── SYSTEM_CONTEXT.md
├── CONTAINER_VIEW.md
├── COMPONENT_VIEW.md
├── DOMAIN_BOUNDARIES.md
├── API_CONTRACT_STRATEGY.md
├── DATA_OWNERSHIP_STRATEGY.md
├── CONSISTENCY_TRANSACTION_STRATEGY.md
├── MESSAGING_EVENT_STRATEGY.md
├── INTEGRATION_RESILIENCE_STRATEGY.md
├── SECURITY_ARCHITECTURE.md
├── OBSERVABILITY_ARCHITECTURE.md
├── SCALABILITY_STRATEGY.md
├── AVAILABILITY_RECOVERY_STRATEGY.md
├── CACHE_STRATEGY.md
├── DEPLOYMENT_TOPOLOGY.md
├── COST_AND_COMPLEXITY_ANALYSIS.md
├── ARCHITECTURE_TRADE_OFF_MATRIX.md
├── ARCHITECTURE_EVOLUTION_PLAN.md
├── ARCHITECTURE_QUESTION_BANK.md
├── MOCK_ARCHITECTURE_INTERVIEW.md
├── ARCHITECTURE_SCORECARD.md
├── ARCHITECTURE_REVIEW_CHECKLIST.md
├── ARCHITECTURE_MATRIX.md
├── ARCHITECTURE_RISK_REGISTER.md
├── ARCHITECTURE_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/interview-arquitetura
├── collect-architecture-sources.ps1
├── generate-architecture-question-bank.ps1
├── validate-architecture-claims.ps1
├── validate-architecture-diagrams.ps1
├── validate-capacity-estimates.ps1
├── run-architecture-scenarios.ps1
├── run-architecture-mock-interview.ps1
├── generate-architecture-report.ps1
└── collect-architecture-evidence.ps1
```

Artifacts:

```text
reports/architecture-interview-report.yaml

contracts/architecture-interview-evidence.yaml
```

---

## Conceito essencial

### Arquitetura é decisão sob restrição

Não existe desenho ideal sem contexto.

### Requisito funcional diz o que

Exemplo:

```text
registrar pedido.
```

### Requisito não funcional diz como o sistema precisa se comportar

Exemplo:

```text
responder em p95 abaixo do objetivo definido.
```

### Boundary reduz acoplamento

Mas cada boundary também cria custo de integração.

### Diagrama não substitui raciocínio

O diagrama comunica decisões já justificadas.

---

## Mão na massa guiada

### 1. Criar Architecture Interview Charter

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_INTERVIEW_CHARTER.md
```

Princípios:

```text
questions before solutions;

requirements before components;

quality attributes are prioritized;

estimates are explicit;

boundaries have owners;

trade-offs are documented;

uncertainty is admitted;

live coding belongs to lesson 713.
```

---

## Discovery

### 2. Criar Discovery Question Framework

Arquivo:

```text
docs/interview-arquitetura/DISCOVERY_QUESTION_FRAMEWORK.md
```

Categorias:

- usuários;
- jornada;
- volume;
- latência;
- disponibilidade;
- consistência;
- segurança;
- compliance;
- operação;
- orçamento;
- equipe;
- prazo.

---

### 3. Perguntar quem usa

Exemplos:

- cliente;
- operador;
- serviço interno;
- integração;
- administrador.

---

### 4. Perguntar qual jornada é crítica

No OrderFlow:

- registrar pedido;
- reservar estoque;
- autorizar pagamento;
- iniciar fulfillment;
- cancelar;
- reconciliar.

---

### 5. Perguntar volume

Busque:

- requests por segundo;
- pedidos por dia;
- picos;
- tamanho de payload;
- eventos;
- retenção.

---

### 6. Perguntar latência

Diferencie:

- API;
- processamento assíncrono;
- jornada completa;
- atualização da projection.

---

### 7. Perguntar disponibilidade

Questione:

- horário de operação;
- tolerância a indisponibilidade;
- impacto;
- RTO;
- RPO.

---

### 8. Perguntar consistência

Descubra quais estados precisam de consistência forte e quais aceitam eventual.

---

### 9. Perguntar segurança

Inclua:

- identidade;
- autorização;
- tenant;
- dado sensível;
- auditoria;
- compliance.

---

### 10. Perguntar restrições

Exemplos:

- stack;
- banco;
- cloud;
- equipe;
- prazo;
- orçamento;
- integração legada.

---

### 11. Registrar perguntas sem resposta

Não invente premissas silenciosas.

---

## Requisitos funcionais

### 12. Criar Functional Requirements

Arquivo:

```text
docs/interview-arquitetura/FUNCTIONAL_REQUIREMENTS.md
```

---

### 13. Definir registro de pedido

Inclua:

- idempotency key;
- tenant;
- itens;
- total;
- resposta inicial.

---

### 14. Definir consulta de pedido

Inclua leitura por ID e isolamento.

---

### 15. Definir acompanhamento

A projection oferece visão de jornada.

---

### 16. Definir cancelamento

Precisa respeitar estado e compensações.

---

### 17. Definir integração

Estoque, pagamento e fulfillment possuem contratos.

---

### 18. Definir administração

Reprocessamento, replay e DLQ exigem autorização.

---

### 19. Priorizar requisitos

Classifique:

- must;
- should;
- could;
- out of scope.

---

## Requisitos não funcionais

### 20. Criar Non-Functional Requirements

Arquivo:

```text
docs/interview-arquitetura/NON_FUNCTIONAL_REQUIREMENTS.md
```

---

### 21. Definir performance

Use percentis e contexto.

---

### 22. Definir disponibilidade

Declare objetivo e janela.

---

### 23. Definir durabilidade

Pedidos aceitos não podem desaparecer silenciosamente.

---

### 24. Definir segurança

Tenant isolation e autorização por recurso são obrigatórios.

---

### 25. Definir observabilidade

Toda jornada precisa de correlation e trace.

---

### 26. Definir recuperação

Mensagens e integrações precisam de retry, DLQ e reconciliação.

---

### 27. Definir testabilidade

Boundaries precisam ser substituíveis e verificáveis.

---

### 28. Definir operabilidade

Runbooks e health checks precisam existir.

---

### 29. Priorizar atributos

Não trate todos como máximos.

---

## Constraints e assumptions

### 30. Criar Constraints and Assumptions

Arquivo:

```text
docs/interview-arquitetura/CONSTRAINTS_AND_ASSUMPTIONS.md
```

---

### 31. Registrar stack

Java 21, Spring Boot, PostgreSQL e Kafka.

---

### 32. Registrar equipe

Arquitetura precisa ser operável pela equipe.

---

### 33. Registrar providers simulados

---

### 34. Registrar ambiente controlado

---

### 35. Registrar assumptions

Exemplo:

```text
pedido medio possui poucos itens;
picos sao conhecidos;
tenant vem de token confiavel;
providers aceitam operation ID.
```

---

### 36. Criar mecanismo de revisão

Premissas mudam.

---

## Estimativa de capacidade

### 37. Criar Capacity Estimation

Arquivo:

```text
docs/interview-arquitetura/CAPACITY_ESTIMATION.md
```

---

### 38. Estimar requests

Exemplo:

```text
pedidos por dia
dividido por segundos ativos
multiplicado por fator de pico.
```

---

### 39. Estimar eventos

Um pedido pode gerar múltiplos eventos.

---

### 40. Estimar storage

Considere:

- pedido;
- itens;
- audit;
- Outbox;
- Inbox;
- projection;
- índices;
- retenção.

---

### 41. Estimar bandwidth

Payload médio multiplicado por volume.

---

### 42. Estimar concurrency

Use latência e throughput.

---

### 43. Declarar margem

Inclua headroom.

---

### 44. Registrar incerteza

Estimativa não é medição.

---

## Contexto e containers

### 45. Criar System Context

Arquivo:

```text
docs/interview-arquitetura/SYSTEM_CONTEXT.md
```

Atores:

- cliente;
- operador;
- identity provider;
- estoque;
- pagamento;
- fulfillment;
- observabilidade.

---

### 46. Criar Container View

Arquivo:

```text
docs/interview-arquitetura/CONTAINER_VIEW.md
```

Containers lógicos:

- API;
- PostgreSQL;
- Kafka;
- Outbox publisher;
- orchestration worker;
- integration gateway;
- projection worker;
- identity provider;
- observability stack.

---

### 47. Explicar responsabilidade de cada container

---

### 48. Explicar protocolo

Use HTTP, Kafka e SQL conforme boundary.

---

### 49. Evitar excesso de caixas

Mostre o necessário para a pergunta.

---

## Componentes

### 50. Criar Component View

Arquivo:

```text
docs/interview-arquitetura/COMPONENT_VIEW.md
```

---

### 51. Mostrar domain

Aggregate, policies, events e value objects.

---

### 52. Mostrar application

Commands, handlers, queries e ports.

---

### 53. Mostrar adapters

HTTP, JPA, Kafka e providers.

---

### 54. Mostrar composition root

---

### 55. Mostrar boundaries de runtime

---

## Domínio e boundaries

### 56. Criar Domain Boundaries

Arquivo:

```text
docs/interview-arquitetura/DOMAIN_BOUNDARIES.md
```

---

### 57. Definir Order

Responsável por invariantes e transições.

---

### 58. Definir Inventory

Integração externa ou bounded context separado.

---

### 59. Definir Payment

Contrato próprio e resultado assíncrono.

---

### 60. Definir Fulfillment

Responsável por execução posterior.

---

### 61. Definir Projection

Leitura derivada, não autoridade.

---

### 62. Explicar por que não microserviços imediatos

Boundaries podem existir sem deploy independente.

---

### 63. Definir gatilhos de separação

- escala;
- ownership;
- release;
- isolamento;
- compliance;
- falha.

---

## APIs e contratos

### 64. Criar API Contract Strategy

Arquivo:

```text
docs/interview-arquitetura/API_CONTRACT_STRATEGY.md
```

---

### 65. Definir endpoint de registro

Inclua idempotência e resposta assíncrona.

---

### 66. Definir status codes

---

### 67. Definir versionamento

Evite versionar sem necessidade.

---

### 68. Definir backward compatibility

---

### 69. Definir errors

Use modelo consistente.

---

### 70. Definir OpenAPI

Contrato público e testável.

---

### 71. Definir rate limiting

---

## Dados

### 72. Criar Data Ownership Strategy

Arquivo:

```text
docs/interview-arquitetura/DATA_OWNERSHIP_STRATEGY.md
```

---

### 73. Definir PostgreSQL como autoridade

---

### 74. Definir ownership por módulo

---

### 75. Evitar acesso cruzado informal

---

### 76. Definir projection

---

### 77. Definir retention

---

### 78. Definir tenant key

---

### 79. Definir constraints

---

### 80. Definir migrations

---

## Consistência e transações

### 81. Criar Consistency Transaction Strategy

Arquivo:

```text
docs/interview-arquitetura/CONSISTENCY_TRANSACTION_STRATEGY.md
```

---

### 82. Definir transação local

Aggregate, audit e Outbox.

---

### 83. Explicar dual write

---

### 84. Explicar por que não 2PC

---

### 85. Definir idempotência

---

### 86. Definir optimistic locking

---

### 87. Definir consistência eventual

---

### 88. Definir reconciliação

---

### 89. Definir resultado ambíguo

---

### 90. Definir compensação

---

## Mensageria

### 91. Criar Messaging Event Strategy

Arquivo:

```text
docs/interview-arquitetura/MESSAGING_EVENT_STRATEGY.md
```

---

### 92. Definir eventos

---

### 93. Definir key

Aggregate ID preserva ordering local.

---

### 94. Definir at-least-once

---

### 95. Definir Inbox

---

### 96. Definir retry

---

### 97. Definir DLQ

---

### 98. Definir replay

---

### 99. Definir versionamento de schema

---

### 100. Definir observabilidade de lag

---

## Integrações e resiliência

### 101. Criar Integration Resilience Strategy

Arquivo:

```text
docs/interview-arquitetura/INTEGRATION_RESILIENCE_STRATEGY.md
```

---

### 102. Definir ACL

---

### 103. Definir operation ID

---

### 104. Definir timeout

---

### 105. Definir retry seletivo

---

### 106. Definir circuit breaker

---

### 107. Definir bulkhead

---

### 108. Definir fallback

Fallback não pode inventar sucesso.

---

### 109. Definir reconciliation

---

### 110. Definir proteção de chamadas duplicadas

---

## Segurança

### 111. Criar Security Architecture

Arquivo:

```text
docs/interview-arquitetura/SECURITY_ARCHITECTURE.md
```

---

### 112. Definir OAuth2 Resource Server

---

### 113. Definir validação JWT

Issuer, audience, expiração e assinatura.

---

### 114. Definir scopes e roles

---

### 115. Definir tenant isolation

---

### 116. Definir autorização por recurso

---

### 117. Definir secret management

---

### 118. Definir logging seguro

---

### 119. Definir threat model

---

### 120. Definir testes negativos

---

## Observabilidade

### 121. Criar Observability Architecture

Arquivo:

```text
docs/interview-arquitetura/OBSERVABILITY_ARCHITECTURE.md
```

---

### 122. Definir logs estruturados

---

### 123. Definir métricas

- API latency;
- error rate;
- Outbox age;
- consumer lag;
- provider errors;
- projection freshness.

---

### 124. Definir traces

---

### 125. Definir correlation

---

### 126. Definir SLOs

---

### 127. Definir alertas

---

### 128. Definir runbooks

---

## Escalabilidade

### 129. Criar Scalability Strategy

Arquivo:

```text
docs/interview-arquitetura/SCALABILITY_STRATEGY.md
```

---

### 130. Escalar API horizontalmente

Stateless e idempotente.

---

### 131. Escalar publisher

Use claim seguro.

---

### 132. Escalar consumers

Partitions, lag e idempotência.

---

### 133. Escalar banco

Comece por:

- query;
- índice;
- pool;
- read model;
- particionamento quando necessário.

---

### 134. Escalar cache

Cache não substitui autoridade.

---

### 135. Identificar gargalos

- banco;
- broker;
- provider;
- rede;
- pool;
- storage.

---

### 136. Definir backpressure

---

### 137. Definir load shedding

---

## Disponibilidade e recuperação

### 138. Criar Availability Recovery Strategy

Arquivo:

```text
docs/interview-arquitetura/AVAILABILITY_RECOVERY_STRATEGY.md
```

---

### 139. Definir zonas de falha

---

### 140. Definir redundância

---

### 141. Definir RTO e RPO

---

### 142. Definir backup e restore testado

---

### 143. Definir graceful degradation

---

### 144. Definir failover

---

### 145. Definir disaster recovery como escopo futuro quando não validado

---

## Cache

### 146. Criar Cache Strategy

Arquivo:

```text
docs/interview-arquitetura/CACHE_STRATEGY.md
```

---

### 147. Definir o que pode ser cacheado

---

### 148. Definir chave com tenant

---

### 149. Definir TTL

---

### 150. Definir invalidação

---

### 151. Definir comportamento em falha

---

### 152. Evitar cache de autorização sem política

---

## Deployment topology

### 153. Criar Deployment Topology

Arquivo:

```text
docs/interview-arquitetura/DEPLOYMENT_TOPOLOGY.md
```

---

### 154. Mostrar runtimes

---

### 155. Mostrar banco e broker

---

### 156. Mostrar rede e ingress

---

### 157. Mostrar IAM e secrets

---

### 158. Mostrar observabilidade

---

### 159. Mostrar zonas

---

### 160. Mostrar rollout

---

## Custos e complexidade

### 161. Criar Cost and Complexity Analysis

Arquivo:

```text
docs/interview-arquitetura/COST_AND_COMPLEXITY_ANALYSIS.md
```

---

### 162. Custos de Kafka

---

### 163. Custos de Outbox

---

### 164. Custos de múltiplos runtimes

---

### 165. Custos de observabilidade

---

### 166. Custos de testes

---

### 167. Custos de alta disponibilidade

---

### 168. Definir onde simplificar

---

## Trade-offs

### 169. Criar Architecture Trade-Off Matrix

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_TRADE_OFF_MATRIX.md
```

Colunas:

- decisão;
- benefício;
- custo;
- risco;
- alternativa;
- gatilho de mudança;
- evidence.

---

### 170. Comparar modular monolith e microservices

---

### 171. Comparar sync e async

---

### 172. Comparar SQL e NoSQL

---

### 173. Comparar cache e read model

---

### 174. Comparar optimistic e pessimistic locking

---

### 175. Comparar at-least-once e exatamente uma vez aparente

---

### 176. Comparar managed service e self-hosted

---

## Evolução

### 177. Criar Architecture Evolution Plan

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_EVOLUTION_PLAN.md
```

---

### 178. Fase 1

Modular monolith e runtimes controlados.

---

### 179. Fase 2

Escala e isolamento de workloads específicos.

---

### 180. Fase 3

Separação por ownership quando justificada.

---

### 181. Fase 4

Multi-region apenas com requisito.

---

### 182. Definir métricas de gatilho

---

### 183. Evitar roadmap tecnológico sem problema

---

## Question bank

### 184. Criar Architecture Question Bank

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_QUESTION_BANK.md
```

Categorias:

- discovery;
- capacity;
- boundaries;
- data;
- consistency;
- messaging;
- security;
- scaling;
- availability;
- operation;
- cost;
- evolution.

---

### 185. Criar perguntas de mudança de contexto

Exemplos:

- volume dez vezes maior;
- provider indisponível por uma hora;
- novo requisito de multi-region;
- tenant enterprise exige isolamento físico;
- equipe reduzida pela metade;
- custo precisa cair trinta por cento.

---

### 186. Criar perguntas adversariais

- por que isso não é overengineering?
- por que Kafka?
- por que não serverless?
- por que não NoSQL?
- por que não microservices?
- onde está o maior risco?

---

### 187. Criar respostas curtas

Comece pela conclusão.

---

### 188. Criar respostas longas

Aprofunde critérios e evidence.

---

## Simulação

### 189. Criar Mock Architecture Interview

Arquivo:

```text
docs/interview-arquitetura/MOCK_ARCHITECTURE_INTERVIEW.md
```

Duração:

```text
90 a 120 minutos.
```

---

### 190. Estruturar banca

1. descoberta;
2. requisitos;
3. estimativa;
4. contexto;
5. boundaries;
6. API;
7. dados;
8. consistência;
9. eventos;
10. integrações;
11. segurança;
12. observabilidade;
13. escala;
14. disponibilidade;
15. deployment;
16. custo;
17. mudança de cenário;
18. defesa.

---

### 191. Desenhar em tempo real

Use:

- contexto;
- containers;
- sequência;
- deployment.

---

### 192. Narrar decisões

Não desenhe em silêncio.

---

### 193. Registrar assumptions

---

### 194. Pedir confirmação

Valide entendimento durante a banca.

---

### 195. Gravar simulação

---

### 196. Criar Architecture Scorecard

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_SCORECARD.md
```

Critérios:

- discovery;
- requisitos;
- estimativas;
- clareza;
- boundaries;
- dados;
- consistência;
- mensageria;
- segurança;
- observabilidade;
- escala;
- disponibilidade;
- custos;
- trade-offs;
- adaptação;
- comunicação.

---

### 197. Criar Review Checklist

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_REVIEW_CHECKLIST.md
```

Perguntas:

- perguntei antes de desenhar?
- declarei assumptions?
- priorizei qualidade?
- estimei volume?
- defini ownership?
- expliquei falhas?
- tratei segurança?
- tratei operação?
- declarei custos?
- evitei antecipar live coding?

---

### 198. Criar Architecture Matrix

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_MATRIX.md
```

Colunas:

- tema;
- requisito;
- decisão;
- alternativa;
- trade-off;
- evidence;
- score;
- revisão.

---

### 199. Criar Risk Register

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_RISK_REGISTER.md
```

Riscos:

```text
tecnologia antes do problema;

requisito inventado;

volume sem estimativa;

boundary sem owner;

consistencia ignorada;

seguranca tardia;

observabilidade ausente;

custo omitido;

live coding antecipado;

feedback nao registrado.
```

---

### 200. Criar Traceability

Arquivo:

```text
docs/interview-arquitetura/ARCHITECTURE_TRACEABILITY.md
```

Exemplo:

```text
durabilidade de pedido
-> PostgreSQL
-> transaction
-> Outbox
-> integration test.

tenant isolation
-> JWT
-> application context
-> repository predicate
-> negative test.

recovery
-> retry
-> DLQ
-> replay
-> runbook.
```

---

### 201. Criar boundary da próxima aula

Arquivo:

```text
docs/interview-arquitetura/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 712 define:

- discovery;
- functional requirements;
- non-functional requirements;
- constraints;
- assumptions;
- capacity estimation;
- system context;
- container view;
- component view;
- domain boundaries;
- API contracts;
- data ownership;
- consistency;
- transactions;
- messaging;
- integrations;
- security;
- observability;
- scalability;
- availability;
- cache;
- deployment topology;
- cost;
- trade-offs;
- architecture evolution;
- mock architecture interview.

A aula 713 define:

- live coding preparation;
- requirement clarification;
- algorithm selection;
- data structures;
- complexity;
- Java implementation;
- tests;
- refactoring;
- debugging;
- communication;
- timed exercises;
- live coding simulation.

Nenhum live coding Java
e executado nesta aula.
```

---

## Validação final

### 202. Criar report

Arquivo:

```text
reports/architecture-interview-report.yaml
```

Exemplo:

```yaml
architectureInterview:
  discovery:
    questionsAsked:
      measured
    assumptionsRecorded:
      measured

  design:
    requirements:
      PASS
    capacity:
      PASS
    boundaries:
      PASS
    data:
      PASS
    consistency:
      PASS
    messaging:
      PASS
    security:
      PASS
    observability:
      PASS
    scalability:
      PASS
    availability:
      PASS
    deployment:
      PASS

  integrity:
    unsupportedClaims:
      0
    contradictions:
      0

  mockInterview:
    completed:
      true
    durationMinutes:
      measured

  liveCodingJava:
    completed:
      false

  gate:
    PASS
```

---

### 203. Criar evidence

Arquivo:

```text
contracts/architecture-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- discovery question count;
- requirement count;
- non-functional requirement count;
- constraint count;
- assumption count;
- capacity estimate status;
- context diagram status;
- container diagram status;
- component diagram status;
- boundary count;
- API strategy status;
- data ownership status;
- consistency strategy status;
- messaging strategy status;
- integration strategy status;
- security architecture status;
- observability architecture status;
- scalability strategy status;
- availability strategy status;
- cache strategy status;
- deployment topology status;
- trade-off count;
- evolution trigger count;
- mock interview duration;
- average score;
- lowest topic;
- highest topic;
- unsupported claim count;
- contradiction count;
- admitted uncertainty count;
- live coding Java completed;
- documentation status;
- gate status;
- timestamp.

---

### 204. Criar gate

Status:

```text
PASS;

FAIL_DISCOVERY;

FAIL_FUNCTIONAL_REQUIREMENTS;

FAIL_NON_FUNCTIONAL_REQUIREMENTS;

FAIL_CONSTRAINTS;

FAIL_ASSUMPTIONS;

FAIL_CAPACITY_ESTIMATION;

FAIL_SYSTEM_CONTEXT;

FAIL_CONTAINER_VIEW;

FAIL_COMPONENT_VIEW;

FAIL_DOMAIN_BOUNDARIES;

FAIL_API_STRATEGY;

FAIL_DATA_OWNERSHIP;

FAIL_CONSISTENCY;

FAIL_TRANSACTIONS;

FAIL_MESSAGING;

FAIL_INTEGRATIONS;

FAIL_SECURITY_ARCHITECTURE;

FAIL_OBSERVABILITY_ARCHITECTURE;

FAIL_SCALABILITY;

FAIL_AVAILABILITY;

FAIL_CACHE;

FAIL_DEPLOYMENT_TOPOLOGY;

FAIL_COST_ANALYSIS;

FAIL_TRADE_OFFS;

FAIL_EVOLUTION_PLAN;

FAIL_MOCK_INTERVIEW;

FAIL_UNSUPPORTED_CLAIM;

FAIL_CONTRADICTION;

FAIL_LIVE_CODING_ANTICIPATION;

INCONCLUSIVE.
```

---

### 205. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\interview-arquitetura\collect-architecture-sources.ps1

.\scripts\interview-arquitetura\generate-architecture-question-bank.ps1

.\scripts\interview-arquitetura\validate-architecture-claims.ps1

.\scripts\interview-arquitetura\validate-architecture-diagrams.ps1

.\scripts\interview-arquitetura\validate-capacity-estimates.ps1

.\scripts\interview-arquitetura\run-architecture-scenarios.ps1

.\scripts\interview-arquitetura\collect-architecture-evidence.ps1
```

---

### 206. Executar duas rodadas

Rodada 1:

```text
discovery
e desenho base.
```

Rodada 2:

```text
mudanca de contexto
e defesa adversarial.
```

---

### 207. Revisar gravações

Selecione:

- três boas perguntas;
- três assumptions omitidas;
- dois trade-offs fracos;
- dois diagramas confusos;
- um plano de melhoria.

---

### 208. Repetir o atributo mais fraco

---

### 209. Encerrar o laboratório

Confirme:

- Charter;
- discovery;
- requirements;
- non-functional requirements;
- constraints;
- assumptions;
- capacity;
- context;
- containers;
- components;
- boundaries;
- APIs;
- data;
- consistency;
- transactions;
- messaging;
- integrations;
- security;
- observability;
- scaling;
- availability;
- cache;
- deployment;
- cost;
- trade-offs;
- evolution;
- question bank;
- mock;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 713 preservada.

---

## Entendendo o que foi feito

### A arquitetura passou a começar por perguntas

Tecnologias deixaram de ser a primeira resposta.

### Requisitos ganharam prioridade

Funcionalidade e atributos de qualidade foram separados.

### Estimativas ganharam transparência

Volume, storage e concorrência passaram a possuir assumptions.

### Boundaries ganharam ownership

Módulos e contextos deixaram de ser apenas packages.

### Consistência ganhou desenho

Transação local, Outbox, idempotência e reconciliação foram conectadas.

### Escala ganhou gargalos

Banco, broker, provider e pool foram considerados.

### Disponibilidade ganhou recuperação

RTO, RPO, backup, failover e degradação foram tratados.

### Trade-offs ganharam evidência

Cada decisão passou a possuir custo e gatilho de mudança.

### A banca ganhou método

Discovery, desenho, mudança de cenário e defesa foram praticados.

---

## Erros comuns importantes

### Começar por Kafka

O problema ainda não foi entendido.

### Inventar requisitos

Assumption precisa ser declarada.

### Ignorar volume

Escala fica abstrata.

### Desenhar microserviços por padrão

O custo operacional pode ser injustificado.

### Confundir projection com autoridade

Consistência fica errada.

### Ignorar falhas de provider

Jornada distribuída fica incompleta.

### Escalar API e esquecer banco

O gargalo permanece.

### Prometer alta disponibilidade sem recuperação

Redundância não basta.

### Omitir custo

A decisão parece irreal.

### Antecipar live coding

Essa etapa pertence à aula 713.

---

## Comandos úteis

### Gerar perguntas

```powershell
.\scripts\interview-arquitetura\generate-architecture-question-bank.ps1
```

### Validar claims

```powershell
.\scripts\interview-arquitetura\validate-architecture-claims.ps1
```

### Validar diagramas

```powershell
.\scripts\interview-arquitetura\validate-architecture-diagrams.ps1
```

### Coletar evidence

```powershell
.\scripts\interview-arquitetura\collect-architecture-evidence.ps1
```

---

## Exercício principal

Realize uma entrevista de arquitetura de 110 minutos para o OrderFlow.

Inclua:

1. usuários;
2. jornadas;
3. requisitos;
4. atributos de qualidade;
5. constraints;
6. assumptions;
7. volume;
8. latência;
9. storage;
10. contexto;
11. containers;
12. components;
13. boundaries;
14. API;
15. idempotência;
16. PostgreSQL;
17. ownership;
18. Outbox;
19. Kafka;
20. Inbox;
21. retry;
22. DLQ;
23. replay;
24. provider;
25. timeout;
26. breaker;
27. tenant;
28. JWT;
29. autorização;
30. observabilidade;
31. SLO;
32. API scaling;
33. consumer scaling;
34. database scaling;
35. availability;
36. RTO;
37. RPO;
38. cache;
39. deployment;
40. rollback;
41. custos;
42. trade-offs;
43. mudança de contexto;
44. defesa;
45. feedback;
46. plano de melhoria.

Não execute live coding Java.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 711 e ponte para a aula 713 foram preservadas;
- Architecture Interview Charter foi criado;
- Discovery Question Framework foi criado;
- usuários, jornadas, volume, latência, disponibilidade, consistência, segurança e constraints foram investigados;
- perguntas sem resposta foram registradas;
- Functional Requirements foi criado;
- registro, consulta, acompanhamento, cancelamento, integração e administração foram definidos;
- requisitos foram priorizados;
- Non-Functional Requirements foi criado;
- performance, disponibilidade, durabilidade, segurança, observabilidade, recuperação, testabilidade e operabilidade foram definidos;
- atributos foram priorizados;
- Constraints and Assumptions foi criado;
- stack, equipe, providers e ambiente foram registrados;
- assumptions foram registradas;
- mecanismo de revisão foi criado;
- Capacity Estimation foi criada;
- requests, eventos, storage, bandwidth, concurrency e headroom foram estimados;
- incerteza foi declarada;
- System Context foi criado;
- atores foram definidos;
- Container View foi criado;
- responsabilidades e protocolos foram definidos;
- excesso de caixas foi evitado;
- Component View foi criado;
- domain, application, adapters, composition root e runtimes foram apresentados;
- Domain Boundaries foi criado;
- Order, Inventory, Payment, Fulfillment e Projection foram definidos;
- microservices imediatos foram evitados;
- gatilhos de separação foram definidos;
- API Contract Strategy foi criada;
- registro, status codes, versionamento, compatibilidade, errors, OpenAPI e rate limiting foram definidos;
- Data Ownership Strategy foi criada;
- PostgreSQL foi definido como autoridade;
- ownership foi definido;
- acesso cruzado informal foi evitado;
- projection, retention, tenant, constraints e migrations foram definidos;
- Consistency Transaction Strategy foi criada;
- transação local foi definida;
- dual write e 2PC foram discutidos;
- idempotência e optimistic locking foram definidos;
- eventual consistency, reconciliation, ambiguity e compensation foram definidos;
- Messaging Event Strategy foi criada;
- eventos, keys, at-least-once, Inbox, retry, DLQ, replay, schema e lag foram definidos;
- Integration Resilience Strategy foi criada;
- ACL, operation ID, timeout, retry, breaker, bulkhead, fallback, reconciliation e duplicate protection foram definidos;
- Security Architecture foi criada;
- Resource Server, JWT, scopes, roles, tenant, resource authorization, secrets, logs, threat model e negative tests foram definidos;
- Observability Architecture foi criada;
- logs, metrics, traces, correlation, SLOs, alerts e runbooks foram definidos;
- Scalability Strategy foi criada;
- API, publisher, consumers, banco e cache foram tratados;
- gargalos, backpressure e load shedding foram definidos;
- Availability Recovery Strategy foi criada;
- zonas, redundância, RTO, RPO, backup, degradação, failover e disaster recovery foram tratados;
- Cache Strategy foi criada;
- itens, key, TTL, invalidation, failure e authorization cache foram tratados;
- Deployment Topology foi criado;
- runtimes, banco, broker, rede, IAM, secrets, observabilidade, zonas e rollout foram mostrados;
- Cost and Complexity Analysis foi criada;
- custos de Kafka, Outbox, runtimes, observabilidade, testes e disponibilidade foram tratados;
- simplificações foram definidas;
- Architecture Trade-Off Matrix foi criada;
- modular monolith, microservices, sync, async, SQL, NoSQL, cache, read model, locks, delivery semantics e managed services foram comparados;
- Architecture Evolution Plan foi criado;
- fases e métricas de gatilho foram definidas;
- roadmap sem problema foi evitado;
- Architecture Question Bank foi criado;
- mudanças de contexto e perguntas adversariais foram criadas;
- respostas curtas e longas foram preparadas;
- Mock Architecture Interview foi criado;
- banca foi estruturada;
- diagramas foram desenhados em tempo real;
- decisões foram narradas;
- assumptions foram registradas;
- entendimento foi validado;
- simulação foi gravada;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 713 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- duas rodadas foram executadas;
- gravações foram revisadas;
- atributo mais fraco foi repetido;
- commit recomendado e diário de bordo estão presentes;
- live coding Java não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\interview-arquitetura\validate-architecture-claims.ps1

.\scripts\interview-arquitetura\validate-architecture-diagrams.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/interview-arquitetura `
  scripts/interview-arquitetura `
  reports/architecture-interview-report.yaml `
  contracts/architecture-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-scale-claim|realTenant|realCustomer|live-coding-solution"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(interview): prepare architecture interview"
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

- requisito inventado;
- claim sem evidence;
- dado sensível;
- solução detalhada da aula 713.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a preparação completa para uma entrevista de arquitetura.

Você estruturou:

```text
discovery;

functional requirements;

non-functional requirements;

constraints;

assumptions;

capacity estimates;

system context;

container view;

component view;

boundaries;

API strategy;

data ownership;

consistency;

transactions;

messaging;

integrations;

security;

observability;

scalability;

availability;

cache;

deployment topology;

cost;

trade-offs;

evolution;

mock interview;

scorecard;

report e evidence.
```

Agora você consegue transformar um problema incompleto em um desenho argumentado, observável e defensável.

A próxima aula será:

```text
713 - M20.43 - Live coding Java
```

Nela, você resolverá exercícios práticos em Java sob tempo controlado, explicando requisitos, estruturas de dados, algoritmos, complexidade, testes, refatoração, debugging e comunicação.

Nenhum live coding Java foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Fiz discovery.
- [ ] Defini requisitos.
- [ ] Priorizei qualidade.
- [ ] Declarei constraints.
- [ ] Registrei assumptions.
- [ ] Estimei capacidade.
- [ ] Desenhei contexto.
- [ ] Desenhei containers.
- [ ] Defini boundaries.
- [ ] Defini dados e consistência.
- [ ] Defini mensageria.
- [ ] Defini segurança.
- [ ] Defini observabilidade.
- [ ] Defini escala e disponibilidade.
- [ ] Preservei live coding para a aula 713.

---

## Troubleshooting adicional

### Não sei por onde começar

Faça perguntas de discovery.

### O avaliador não fornece volume

Declare assumption e siga.

### O desenho ficou complexo

Volte aos requisitos obrigatórios.

### Não sei escolher banco

Comece pelos dados e consistência.

### Mensageria parece obrigatória

Compare com fluxo síncrono.

### Não consigo estimar

Use ordem de grandeza.

### O avaliador muda o cenário

Reavalie atributos e trade-offs.

### Diagrama ficou ilegível

Separe níveis.

### Esqueci operação

Inclua observabilidade, deploy e recuperação.

### Quero resolver código

Essa etapa pertence à aula 713.

---

## Perguntas de revisão

1. Arquitetura começa por tecnologia?
2. O que discovery busca?
3. Requisito funcional e não funcional são iguais?
4. Assumption pode ficar oculta?
5. Estimativa é medição?
6. Boundary sempre precisa de microservice?
7. Projection é autoridade?
8. Outbox resolve dual write?
9. At-least-once exige o quê?
10. Timeout significa falha definitiva?
11. Escalar API resolve banco?
12. Cache substitui banco?
13. Alta disponibilidade é apenas réplica?
14. RPO mede o quê?
15. RTO mede o quê?
16. Trade-off precisa de custo?
17. Diagrama substitui decisão?
18. Quando separar microservice?
19. O que backpressure protege?
20. Por que registrar gatilho de mudança?
21. O que scorecard mede?
22. O que a aula 713 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Problema e restrições.
3. Não.
4. Não.
5. Não.
6. Não.
7. Não.
8. Sim, localmente.
9. Idempotência.
10. Não.
11. Não.
12. Não.
13. Não.
14. Perda aceitável.
15. Tempo de recuperação.
16. Sim.
17. Não.
18. Quando houver gatilho.
19. Downstream.
20. Evolução.
21. Qualidade do raciocínio.
22. Live coding Java.
23. Código ao vivo.
24. Live coding Java.
25. Perguntar, estimar, decidir e explicar trade-offs.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 712 - M20.42 - Entrevista arquitetura

- Continuei após Entrevista DevOps cloud.
- Criei Architecture Interview Charter.
- Criei Discovery Question Framework.
- Mapeei usuários, jornadas, volume, latência, disponibilidade, consistência, segurança e constraints.
- Registrei perguntas sem resposta.
- Criei Functional Requirements.
- Priorizei registro, consulta, acompanhamento, cancelamento, integração e administração.
- Criei Non-Functional Requirements.
- Priorizei performance, disponibilidade, durabilidade, segurança, observabilidade, recuperação, testabilidade e operabilidade.
- Criei Constraints and Assumptions.
- Registrei stack, equipe, providers e ambiente.
- Criei Capacity Estimation.
- Estimei requests, eventos, storage, bandwidth, concurrency e headroom.
- Declarei incerteza.
- Criei System Context.
- Criei Container View.
- Criei Component View.
- Criei Domain Boundaries.
- Defini Order, Inventory, Payment, Fulfillment e Projection.
- Defini gatilhos de separação.
- Criei API Contract Strategy.
- Defini idempotência, status, compatibility, errors e OpenAPI.
- Criei Data Ownership Strategy.
- Defini PostgreSQL, ownership, projection, retention, tenant e constraints.
- Criei Consistency Transaction Strategy.
- Revisei transação local, dual write, Outbox, idempotência, locking, eventual consistency, ambiguity e compensation.
- Criei Messaging Event Strategy.
- Defini events, keys, at-least-once, Inbox, retry, DLQ, replay, schema e lag.
- Criei Integration Resilience Strategy.
- Defini ACL, operation ID, timeout, retry, breaker, bulkhead, fallback e reconciliation.
- Criei Security Architecture.
- Defini Resource Server, JWT, scopes, roles, tenant, secrets, logs e negative tests.
- Criei Observability Architecture.
- Defini logs, metrics, traces, correlation, SLOs, alerts e runbooks.
- Criei Scalability Strategy.
- Tratei API, publisher, consumers, banco, cache, gargalos, backpressure e load shedding.
- Criei Availability Recovery Strategy.
- Defini zones, redundancy, RTO, RPO, backup, degradation e failover.
- Criei Cache Strategy.
- Defini key, TTL, invalidation e failure behavior.
- Criei Deployment Topology.
- Criei Cost and Complexity Analysis.
- Criei Architecture Trade-Off Matrix.
- Comparei modular monolith, microservices, sync, async, SQL, NoSQL, cache, read model, locks e managed services.
- Criei Architecture Evolution Plan.
- Defini fases e gatilhos.
- Criei Architecture Question Bank.
- Criei mudanças de contexto e perguntas adversariais.
- Criei Mock Architecture Interview.
- Executei duas rodadas.
- Desenhei diagramas em tempo real.
- Gravei entrevistas.
- Criei Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 713.
- Criei report, evidence e gate.
- Revisei gravações.
- Repeti o atributo mais fraco.
- Não antecipei live coding Java.
- Próxima aula: Live coding Java.
```

---

## Referência técnica curta

- System Design.
- Functional Requirement.
- Non-Functional Requirement.
- Constraint.
- Assumption.
- Capacity Estimate.
- System Context.
- Container View.
- Component View.
- Boundary.
- Data Ownership.
- Consistency.
- Outbox.
- Idempotency.
- Backpressure.
- Availability.
- RTO.
- RPO.
- Deployment Topology.
- Trade-Off.
- Architecture Evolution.

Regra final:

```text
A entrevista de arquitetura do OrderFlow deve começar por discovery e terminar em defesa baseada em trade-offs: discovery investiga users, journeys, volume, latency, consistency, availability, security, operations, cost and team constraints, requirements separam functional behavior and prioritized quality attributes, assumptions são declaradas e capacity estimates usam orders, events, storage, bandwidth, concurrency and headroom, context, container and component views comunicam actors, runtimes, protocols and responsibilities sem excesso, domain boundaries definem Order, Inventory, Payment, Fulfillment and Projection com gatilhos claros de separação, API strategy cobre idempotency, status, errors, versioning, compatibility, OpenAPI and rate limits, data ownership mantém PostgreSQL como autoridade e projection como leitura derivada, consistency strategy usa local transaction, audit, Outbox, optimistic locking, eventual consistency, reconciliation, ambiguity and compensation, messaging usa Kafka, aggregate key, at-least-once, Inbox, retry, DLQ, replay, schema versioning and lag monitoring, integrations usam ACL, operation ID, timeout, selective retry, breaker, bulkhead and honest fallback, security cobre Resource Server, JWT, issuer, audience, scopes, roles, tenant, object authorization, secrets and negative tests, observability cobre logs, metrics, traces, correlation, SLOs, alerts and runbooks, scalability trata API, publisher, consumers, database, cache, backpressure and load shedding sem ignorar downstream, availability cobre zones, redundancy, RTO, RPO, backup, graceful degradation and failover, cache exige tenant-aware keys, TTL and invalidation, deployment topology mostra runtimes, network, IAM, secrets, observability and rollout, cost analysis torna Kafka, Outbox, runtimes, telemetry, tests and redundancy explícitos, trade-off matrix compara modular monolith, microservices, sync, async, SQL, NoSQL, cache, read model, locking and managed services, evolution plan usa métricas e gatilhos, duas mock interviews testam cenário base e mudança adversarial, report and evidence fecham o gate, enquanto requirements clarification, algorithms, data structures, complexity, Java code, tests, refactoring and debugging permanecem reservados para a aula 713.
```
