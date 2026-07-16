# 717 - M20.47 - Banca tecnica simulada

## Apresentação da aula

Na aula 716, você concluiu a produção de uma aula ensinável final sobre Transactional Outbox.

O material anterior consolidou:

- perfil do aluno;
- pré-requisitos;
- objetivos observáveis;
- proteção de escopo;
- preparação do ambiente;
- explicação de dual write;
- modelagem da Outbox;
- migration;
- transaction boundary;
- publisher;
- retry;
- testes;
- observabilidade;
- troubleshooting;
- exercício independente;
- avaliação;
- acessibilidade;
- publicação;
- clean clone;
- revisões técnica, pedagógica e iniciante;
- report, evidence e gate.

Agora você realizará uma banca técnica simulada integrada.

Essa banca representa o momento em que todas as partes da formação precisam aparecer como um conjunto coerente.

Você não será avaliado apenas por saber responder uma pergunta isolada.

A banca observará se você consegue:

- apresentar sua trajetória;
- explicar o projeto final;
- defender decisões;
- reconhecer limites;
- responder perguntas técnicas;
- conectar código e arquitetura;
- executar live coding;
- conduzir system design;
- explicar segurança;
- discutir operação;
- ensinar um conceito;
- receber objeções;
- corrigir uma resposta;
- manter clareza sob pressão;
- registrar feedback.

A banca será baseada no OrderFlow.

Você apresentará o projeto como uma solução de engenharia construída para demonstrar:

- domínio;
- application boundaries;
- persistência;
- APIs;
- segurança;
- integrações;
- mensageria;
- observabilidade;
- testes;
- performance;
- containers;
- CI/CD;
- documentação;
- capacidade de defesa;
- capacidade de ensino.

A banca não deve virar uma lista decorada.

O avaliador poderá interromper, aprofundar, alterar o cenário ou pedir evidência.

Você precisará diferenciar:

```text
o que foi implementado;

o que foi testado;

o que foi simulado;

o que foi medido;

o que foi planejado;

o que seria evolucao futura.
```

Uma resposta fraca tenta parecer perfeita:

```text
o sistema resolve qualquer escala,
nao duplica mensagens,
nao perde eventos
e esta pronto para producao global.
```

Uma resposta profissional declara:

```text
o projeto demonstra
transacao local,
Outbox,
at-least-once,
idempotencia,
observabilidade,
testes
e simulacao de deploy;

nao representa
operacao real em producao global,
e os limites estao documentados.
```

A próxima aula será:

```text
718 - M20.48 - Plano de evolucao pos formacao
```

Na aula 718, você transformará os resultados da banca em um plano de evolução pós-formação com metas, lacunas, prioridades, projetos, prática deliberada, posicionamento profissional e ciclos de revisão.

Nesta aula, o plano final de evolução não será produzido.

O laboratório será:

```text
labs/m20/aula-717-banca-tecnica-simulada/orderflow-technical-board
```

Regra central:

```text
uma banca tecnica forte
nao depende de respostas perfeitas;

ela depende de
fundamento,
evidence,
honestidade,
raciocinio,
adaptacao
e comunicacao.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
714:
System design interview.

715:
Como ensinar o que aprendeu.

716:
Aula ensinavel final.

717:
Banca tecnica simulada.

718:
Plano de evolucao pos formacao.

719:
Entrega final portfolio.
```

A aula 717 utiliza como fonte:

- currículo;
- LinkedIn;
- GitHub;
- README;
- portfólio;
- OpenAPI;
- Postman;
- runbook;
- guia local;
- ADRs;
- diagrams;
- código;
- testes;
- reports;
- evidence;
- entrevistas Java;
- entrevistas Spring/JPA;
- entrevistas SQL;
- entrevista de segurança;
- entrevista DevOps/cloud;
- live coding;
- system design;
- aula ensinável final;
- diário de bordo.

A banca será a integração desses artifacts.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/technical-board
├── TECHNICAL_BOARD_CHARTER.md
├── BOARD_AGENDA.md
├── CANDIDATE_BRIEFING.md
├── PROJECT_PRESENTATION_SCRIPT.md
├── ORDERFLOW_ONE_PAGE.md
├── EVIDENCE_INDEX.md
├── ARCHITECTURE_DEFENSE.md
├── JAVA_QUESTION_BANK.md
├── SPRING_JPA_QUESTION_BANK.md
├── SQL_DATABASE_QUESTION_BANK.md
├── API_INTEGRATION_QUESTION_BANK.md
├── SECURITY_QUESTION_BANK.md
├── MESSAGING_QUESTION_BANK.md
├── OBSERVABILITY_QUESTION_BANK.md
├── DEVOPS_CLOUD_QUESTION_BANK.md
├── TESTING_QUESTION_BANK.md
├── PERFORMANCE_QUESTION_BANK.md
├── LIVE_CODING_CHALLENGE.md
├── SYSTEM_DESIGN_CHALLENGE.md
├── TEACHING_DEFENSE.md
├── BEHAVIORAL_TECHNICAL_STORIES.md
├── OBJECTION_HANDLING.md
├── UNCERTAINTY_RESPONSE_GUIDE.md
├── BOARD_SCORECARD.md
├── BOARD_REVIEW_CHECKLIST.md
├── BOARD_MATRIX.md
├── BOARD_RISK_REGISTER.md
├── BOARD_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Artifacts:

```text
reports/technical-board-report.yaml

contracts/technical-board-evidence.yaml
```

Scripts:

```text
scripts/technical-board
├── collect-board-sources.ps1
├── validate-board-claims.ps1
├── validate-evidence-index.ps1
├── run-board-timer.ps1
├── run-live-coding-challenge.ps1
├── run-system-design-challenge.ps1
├── generate-board-report.ps1
└── collect-board-evidence.ps1
```

---

## Conceito essencial

### A banca avalia coerência

Uma boa resposta precisa combinar:

- conceito;
- decisão;
- exemplo;
- evidence;
- limite.

### Evidence protege a credibilidade

Quando disser que algo foi testado, mostre o teste.

Quando disser que algo foi medido, mostre o report.

### Limite não é fraqueza

Reconhecer o que não foi validado demonstra maturidade.

### Objeção faz parte da banca

O avaliador pode discordar para observar sua capacidade de raciocínio.

### Feedback precisa virar dado

O resultado da banca alimentará a aula 718.

---

## Mão na massa guiada

### 1. Criar Technical Board Charter

Arquivo:

```text
docs/technical-board/TECHNICAL_BOARD_CHARTER.md
```

Princípios:

```text
claims require evidence;

implemented is different from simulated;

answers start with conclusions;

trade-offs are explicit;

uncertainty is admitted;

feedback is recorded;

the post-formation plan belongs to lesson 718.
```

---

## Agenda da banca

### 2. Criar Board Agenda

Arquivo:

```text
docs/technical-board/BOARD_AGENDA.md
```

Duração total:

```text
180 minutos.
```

Distribuição:

```text
0 a 15:
apresentacao profissional.

15 a 35:
OrderFlow.

35 a 55:
arquitetura.

55 a 75:
Java.

75 a 95:
Spring JPA e SQL.

95 a 115:
seguranca,
mensageria
e observabilidade.

115 a 135:
DevOps,
cloud
e testes.

135 a 155:
live coding.

155 a 170:
system design.

170 a 178:
defesa de ensino.

178 a 180:
fechamento.
```

---

### 3. Definir dois avaliadores

Perfis:

- avaliador técnico principal;
- avaliador de arquitetura e comunicação.

---

### 4. Definir regras

- interrupções são permitidas;
- consulta a documentação apenas quando solicitada;
- nenhuma resposta deve ser lida;
- evidence pode ser aberta;
- correções são permitidas;
- o tempo continua correndo.

---

### 5. Preparar gravação

Grave:

- tela;
- voz;
- cronômetro;
- diagramas;
- terminal.

---

### 6. Criar checkpoints

Ao final de cada bloco, o avaliador registra:

- ponto forte;
- lacuna;
- dúvida;
- score.

---

## Briefing do candidato

### 7. Criar Candidate Briefing

Arquivo:

```text
docs/technical-board/CANDIDATE_BRIEFING.md
```

Inclua:

- duração;
- blocos;
- artifacts permitidos;
- critérios;
- comportamento esperado;
- política de feedback;
- tratamento de incerteza.

---

### 8. Preparar ambiente

Abra:

- IDE;
- terminal;
- repository;
- diagrams;
- OpenAPI;
- reports;
- evidence;
- README;
- apresentação.

---

### 9. Executar baseline

```powershell
mvn test
```

---

### 10. Verificar Git

```powershell
git status --short
```

---

### 11. Verificar containers

```powershell
docker compose `
  -f `
  compose.local.yml `
  ps
```

---

### 12. Fechar dados sensíveis

---

## Apresentação profissional

### 13. Preparar abertura de dois minutos

Estrutura:

1. quem você é;
2. experiência;
3. transição ou evolução;
4. foco Java Backend;
5. projeto final;
6. valor demonstrado.

---

### 14. Evitar autobiografia longa

---

### 15. Conectar experiência anterior

Exemplo:

```text
minha experiencia com qualidade,
automacao,
APIs
e analise de falhas
fortaleceu minha forma
de construir backends testaveis
e observaveis.
```

---

### 16. Preparar resposta de trinta segundos

---

### 17. Preparar resposta de cinco minutos

---

### 18. Treinar interrupção

O avaliador pode pedir:

```text
va direto ao projeto.
```

---

## Apresentação do projeto

### 19. Criar Project Presentation Script

Arquivo:

```text
docs/technical-board/PROJECT_PRESENTATION_SCRIPT.md
```

Estrutura:

1. problema;
2. objetivo;
3. escopo;
4. arquitetura;
5. fluxo principal;
6. confiabilidade;
7. segurança;
8. testes;
9. operação;
10. limites.

---

### 20. Criar OrderFlow One Page

Arquivo:

```text
docs/technical-board/ORDERFLOW_ONE_PAGE.md
```

Inclua:

- resumo;
- stack;
- módulos;
- fluxo;
- decisões;
- evidence;
- execução local;
- links.

---

### 21. Explicar o problema

```text
processar pedidos
com jornada distribuida,
integracoes externas,
mensageria confiavel,
isolamento por tenant
e acompanhamento observavel.
```

---

### 22. Explicar o fluxo principal

```text
API
-> application
-> domain
-> PostgreSQL
-> Outbox
-> Kafka
-> workers
-> providers
-> projection.
```

---

### 23. Declarar escopo real

---

### 24. Declarar o que foi simulado

---

### 25. Declarar o que foi medido

---

### 26. Declarar o que não foi validado

---

## Índice de evidence

### 27. Criar Evidence Index

Arquivo:

```text
docs/technical-board/EVIDENCE_INDEX.md
```

Categorias:

- arquitetura;
- domínio;
- API;
- persistência;
- mensageria;
- segurança;
- testes;
- performance;
- observabilidade;
- CI/CD;
- deploy;
- ensino.

---

### 28. Mapear cada claim

Exemplo:

```text
claim:
Order e Outbox confirmam juntos.

evidence:
RegisterOrderTransactionIT.

claim:
backlog possui metrica.

evidence:
observability report.
```

---

### 29. Validar links

---

### 30. Evitar evidence ornamental

Cada artifact precisa provar algo.

---

## Defesa de arquitetura

### 31. Criar Architecture Defense

Arquivo:

```text
docs/technical-board/ARCHITECTURE_DEFENSE.md
```

---

### 32. Defender modularidade

Explique por que boundaries existem sem exigir microservices imediatos.

---

### 33. Defender domain isolation

O domínio não depende de Spring, JPA ou Kafka.

---

### 34. Defender PostgreSQL

Critérios:

- transações;
- constraints;
- consultas;
- maturidade;
- operação.

---

### 35. Defender Kafka

Use somente onde existe necessidade assíncrona e desacoplamento.

---

### 36. Defender Outbox

Explique dual write e custo operacional.

---

### 37. Defender Inbox

Explique at-least-once e idempotência.

---

### 38. Defender projection

Leitura derivada não substitui autoridade.

---

### 39. Defender runtimes separados

Relacionar carga, responsabilidade e isolamento.

---

### 40. Declarar gatilhos de evolução

---

## Perguntas Java

### 41. Criar Java Question Bank

Arquivo:

```text
docs/technical-board/JAVA_QUESTION_BANK.md
```

---

### 42. Responder JVM, JDK e bytecode

---

### 43. Responder igualdade e `hashCode`

---

### 44. Responder imutabilidade

---

### 45. Responder records

---

### 46. Responder generics e PECS

---

### 47. Responder collections

---

### 48. Responder exceptions

---

### 49. Responder Streams

---

### 50. Responder concorrência

---

### 51. Responder virtual threads

---

### 52. Relacionar respostas ao código do projeto

---

## Perguntas Spring e JPA

### 53. Criar Spring JPA Question Bank

Arquivo:

```text
docs/technical-board/SPRING_JPA_QUESTION_BANK.md
```

---

### 54. Explicar IoC e DI

---

### 55. Explicar lifecycle e proxies

---

### 56. Explicar self-invocation

---

### 57. Explicar `@Transactional`

---

### 58. Diferenciar flush e commit

---

### 59. Explicar propagation

---

### 60. Diferenciar JPA e Hibernate

---

### 61. Explicar persistence context

---

### 62. Explicar dirty checking

---

### 63. Explicar N+1

---

### 64. Explicar optimistic locking

---

## Perguntas SQL e banco

### 65. Criar SQL Database Question Bank

Arquivo:

```text
docs/technical-board/SQL_DATABASE_QUESTION_BANK.md
```

---

### 66. Explicar modelagem e constraints

---

### 67. Explicar índices compostos

---

### 68. Explicar selectivity

---

### 69. Ler um execution plan

---

### 70. Explicar MVCC

---

### 71. Explicar níveis de isolamento

---

### 72. Explicar deadlock

---

### 73. Comparar offset e keyset

---

### 74. Explicar migrations seguras

---

### 75. Relacionar query ao OrderFlow

---

## APIs e integrações

### 76. Criar API Integration Question Bank

Arquivo:

```text
docs/technical-board/API_INTEGRATION_QUESTION_BANK.md
```

---

### 77. Defender REST contracts

---

### 78. Explicar idempotency key

---

### 79. Explicar status codes

---

### 80. Explicar versionamento

---

### 81. Explicar timeout

---

### 82. Explicar retry seletivo

---

### 83. Explicar circuit breaker

---

### 84. Explicar resultado ambíguo

---

### 85. Explicar ACL

---

### 86. Explicar reconciliação

---

## Segurança

### 87. Criar Security Question Bank

Arquivo:

```text
docs/technical-board/SECURITY_QUESTION_BANK.md
```

---

### 88. Diferenciar autenticação e autorização

---

### 89. Explicar OAuth2 Resource Server

---

### 90. Validar issuer e audience

---

### 91. Explicar scopes e roles

---

### 92. Explicar tenant isolation

---

### 93. Explicar IDOR

---

### 94. Explicar secrets

---

### 95. Explicar logs sanitizados

---

### 96. Explicar testes negativos

---

## Mensageria

### 97. Criar Messaging Question Bank

Arquivo:

```text
docs/technical-board/MESSAGING_QUESTION_BANK.md
```

---

### 98. Explicar at-least-once

---

### 99. Explicar ordering por key

---

### 100. Explicar retry e DLQ

---

### 101. Explicar replay

---

### 102. Explicar schema evolution

---

### 103. Explicar consumer lag

---

### 104. Explicar poison message

---

### 105. Explicar duplicidade após publish

---

## Observabilidade

### 106. Criar Observability Question Bank

Arquivo:

```text
docs/technical-board/OBSERVABILITY_QUESTION_BANK.md
```

---

### 107. Diferenciar logs, métricas e traces

---

### 108. Explicar correlation ID

---

### 109. Explicar SLI, SLO e SLA

---

### 110. Explicar golden signals

---

### 111. Explicar Outbox age

---

### 112. Explicar projection freshness

---

### 113. Explicar alertas acionáveis

---

### 114. Abrir um runbook como evidence

---

## DevOps e cloud

### 115. Criar DevOps Cloud Question Bank

Arquivo:

```text
docs/technical-board/DEVOPS_CLOUD_QUESTION_BANK.md
```

---

### 116. Diferenciar imagem e container

---

### 117. Explicar multi-stage build

---

### 118. Explicar non-root

---

### 119. Explicar CI/CD

---

### 120. Explicar artifact promotion

---

### 121. Explicar Kubernetes Deployment e Service

---

### 122. Diferenciar liveness e readiness

---

### 123. Explicar requests e limits

---

### 124. Explicar HPA

---

### 125. Explicar IAM

---

### 126. Explicar rollout e rollback

---

## Testes

### 127. Criar Testing Question Bank

Arquivo:

```text
docs/technical-board/TESTING_QUESTION_BANK.md
```

---

### 128. Explicar pirâmide de testes

---

### 129. Diferenciar unitário e integração

---

### 130. Explicar Testcontainers

---

### 131. Explicar contract tests

---

### 132. Explicar testes de segurança

---

### 133. Explicar testes de concorrência

---

### 134. Explicar teste de rollback

---

### 135. Explicar estabilidade dos testes

---

## Performance

### 136. Criar Performance Question Bank

Arquivo:

```text
docs/technical-board/PERFORMANCE_QUESTION_BANK.md
```

---

### 137. Explicar baseline

---

### 138. Explicar p95 e p99

---

### 139. Explicar throughput

---

### 140. Explicar saturação

---

### 141. Explicar connection pool

---

### 142. Explicar query plan

---

### 143. Explicar gargalo

---

### 144. Declarar limites da medição

---

## Live coding

### 145. Criar Live Coding Challenge

Arquivo:

```text
docs/technical-board/LIVE_CODING_CHALLENGE.md
```

Problema:

```text
receber eventos de pedido
e retornar
faltantes,
duplicados
e inesperados.
```

---

### 146. Confirmar contrato

---

### 147. Modelar identidade

---

### 148. Escolher mapas de contagem

---

### 149. Implementar resultado estruturado

---

### 150. Escrever testes

---

### 151. Explicar complexidade

---

### 152. Tratar entrada vazia

---

### 153. Refatorar nomes

---

### 154. Limitar tempo a vinte minutos

---

## System design

### 155. Criar System Design Challenge

Arquivo:

```text
docs/technical-board/SYSTEM_DESIGN_CHALLENGE.md
```

Cenário:

```text
o OrderFlow precisa suportar
dez vezes mais volume
e um tenant exige banco dedicado.
```

---

### 156. Fazer discovery curto

---

### 157. Recalcular capacidade

---

### 158. Revisar routing

---

### 159. Revisar dados

---

### 160. Revisar mensageria

---

### 161. Revisar observabilidade

---

### 162. Revisar custo

---

### 163. Defender mudança incremental

---

### 164. Limitar tempo a quinze minutos

---

## Defesa de ensino

### 165. Criar Teaching Defense

Arquivo:

```text
docs/technical-board/TEACHING_DEFENSE.md
```

---

### 166. Explicar dual write em três minutos

---

### 167. Mostrar um diagrama

---

### 168. Fazer uma pergunta diagnóstica

---

### 169. Mostrar limite da analogia

---

### 170. Pedir teach-back

---

### 171. Defender critérios da aula 716

---

## Histórias comportamentais técnicas

### 172. Criar Behavioral Technical Stories

Arquivo:

```text
docs/technical-board/BEHAVIORAL_TECHNICAL_STORIES.md
```

Prepare histórias sobre:

- bug difícil;
- decisão contestada;
- falha de teste;
- prazo;
- feedback;
- aprendizado;
- incidente simulado;
- colaboração;
- simplificação;
- erro próprio.

---

### 173. Usar estrutura STAR adaptada

- situação;
- tarefa;
- ação;
- resultado;
- aprendizado.

---

### 174. Evitar resultado inventado

---

### 175. Relacionar aprendizado à engenharia

---

## Objeções

### 176. Criar Objection Handling

Arquivo:

```text
docs/technical-board/OBJECTION_HANDLING.md
```

---

### 177. Objeção: “isso é overengineering”

Responda pelo requisito e pelo custo.

---

### 178. Objeção: “Kafka é desnecessário”

Compare fluxo síncrono e assíncrono.

---

### 179. Objeção: “microservices seriam melhores”

Pergunte qual problema exigiria deploy independente.

---

### 180. Objeção: “Outbox ainda duplica”

Concorde e explique Inbox e idempotência.

---

### 181. Objeção: “o teste não representa produção”

Concorde com o limite e declare o que a evidence prova.

---

### 182. Não responder de forma defensiva

---

## Incerteza

### 183. Criar Uncertainty Response Guide

Arquivo:

```text
docs/technical-board/UNCERTAINTY_RESPONSE_GUIDE.md
```

Estrutura:

```text
nao tenho certeza desse detalhe;

o comportamento que preciso garantir e este;

eu validaria pela documentacao,
por um experimento
e por um teste.
```

---

### 184. Diferenciar não saber de não ter medido

---

### 185. Corrigir resposta quando necessário

Use:

```text
vou corrigir o que disse:
flush nao e commit.
```

---

### 186. Registrar perguntas não respondidas

---

## Scorecard

### 187. Criar Board Scorecard

Arquivo:

```text
docs/technical-board/BOARD_SCORECARD.md
```

Critérios de um a cinco:

- apresentação;
- projeto;
- arquitetura;
- Java;
- Spring/JPA;
- SQL;
- APIs;
- segurança;
- mensageria;
- observabilidade;
- DevOps/cloud;
- testes;
- performance;
- live coding;
- system design;
- ensino;
- comunicação;
- evidence;
- honestidade;
- adaptação.

---

### 188. Definir nota mínima por bloco

Nenhum bloco crítico abaixo de três.

---

### 189. Definir peso

Maior peso para:

- arquitetura;
- Java;
- confiabilidade;
- comunicação;
- evidence.

---

### 190. Criar Board Review Checklist

Arquivo:

```text
docs/technical-board/BOARD_REVIEW_CHECKLIST.md
```

Perguntas:

- diferenciei implementação e simulação?
- comecei pela conclusão?
- mostrei evidence?
- declarei trade-off?
- reconheci limite?
- corrigi erros?
- controlei tempo?
- ouvi objeções?
- ensinei com clareza?
- evitei antecipar a aula 718?

---

### 191. Criar Board Matrix

Arquivo:

```text
docs/technical-board/BOARD_MATRIX.md
```

Colunas:

- bloco;
- pergunta;
- resposta;
- evidence;
- score;
- feedback;
- prioridade.

---

### 192. Criar Risk Register

Arquivo:

```text
docs/technical-board/BOARD_RISK_REGISTER.md
```

Riscos:

```text
apresentacao longa;

claim sem evidence;

producao simulada como real;

resposta decorada;

objeção tratada como ataque;

live coding sem teste;

system design sem discovery;

ensino sem diagnostico;

feedback perdido;

plano pos-formacao antecipado.
```

---

### 193. Criar Traceability

Arquivo:

```text
docs/technical-board/BOARD_TRACEABILITY.md
```

Exemplo:

```text
claim:
dual write protegido
-> Outbox
-> transaction integration test
-> architecture defense.

claim:
tenant isolation
-> JWT claim
-> repository predicate
-> negative test.

claim:
aula executavel
-> clean clone
-> publication checklist
-> beginner review.
```

---

### 194. Criar boundary da próxima aula

Arquivo:

```text
docs/technical-board/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 717 define:

- integrated technical board;
- professional introduction;
- project presentation;
- evidence index;
- architecture defense;
- Java;
- Spring JPA;
- SQL;
- APIs;
- security;
- messaging;
- observability;
- DevOps cloud;
- testing;
- performance;
- live coding;
- system design;
- teaching defense;
- behavioral stories;
- objections;
- uncertainty;
- integrated scoring;
- final feedback.

A aula 718 define:

- post-formation evolution plan;
- gap analysis;
- skill priorities;
- deliberate practice;
- study cycles;
- portfolio evolution;
- interview practice;
- market positioning;
- metrics;
- quarterly review;
- career roadmap.

Nenhum plano de evolucao pos-formacao
e produzido nesta aula.
```

---

## Execução da banca

### 195. Executar rodada principal

Duração:

```text
180 minutos.
```

---

### 196. Não pausar cronômetro

---

### 197. Registrar score após cada bloco

---

### 198. Registrar perguntas sem resposta

---

### 199. Registrar correções

---

### 200. Registrar interrupções

---

### 201. Registrar uso de evidence

---

### 202. Executar rodada reduzida

Duração:

```text
90 minutos.
```

Objetivo:

- respostas mais objetivas;
- evidence mais rápida;
- melhor gestão de tempo.

---

### 203. Comparar rodadas

---

### 204. Selecionar três forças

---

### 205. Selecionar três lacunas

---

### 206. Selecionar duas respostas corrigidas

---

### 207. Selecionar um risco profissional

---

### 208. Não criar ainda o plano de ação completo

Esse trabalho pertence à aula 718.

---

## Relatório e evidence

### 209. Criar report

Arquivo:

```text
reports/technical-board-report.yaml
```

Exemplo:

```yaml
technicalBoard:
  rounds:
    full:
      durationMinutes:
        measured
      completed:
        true
    reduced:
      durationMinutes:
        measured
      completed:
        true

  scores:
    project:
      measured
    architecture:
      measured
    Java:
      measured
    SpringJPA:
      measured
    SQL:
      measured
    security:
      measured
    messaging:
      measured
    DevOpsCloud:
      measured
    testing:
      measured
    liveCoding:
      measured
    systemDesign:
      measured
    teaching:
      measured
    communication:
      measured

  integrity:
    unsupportedClaims:
      0
    productionMisrepresentations:
      0
    unansweredQuestions:
      measured
    correctedAnswers:
      measured

  postFormationPlan:
    completed:
      false

  gate:
    PASS
```

---

### 210. Criar evidence

Arquivo:

```text
contracts/technical-board-evidence.yaml
```

Campos:

- lesson;
- project;
- full round duration;
- reduced round duration;
- presentation score;
- project score;
- architecture score;
- Java score;
- Spring JPA score;
- SQL score;
- API score;
- security score;
- messaging score;
- observability score;
- DevOps cloud score;
- testing score;
- performance score;
- live coding score;
- system design score;
- teaching score;
- communication score;
- evidence score;
- honesty score;
- adaptation score;
- question count;
- answered question count;
- unanswered question count;
- corrected answer count;
- objection count;
- evidence opened count;
- unsupported claim count;
- production misrepresentation count;
- strongest block;
- weakest block;
- post-formation plan completed;
- documentation status;
- gate status;
- timestamp.

---

### 211. Criar gate

Status:

```text
PASS;

FAIL_PRESENTATION;

FAIL_PROJECT_DEFENSE;

FAIL_ARCHITECTURE;

FAIL_JAVA;

FAIL_SPRING_JPA;

FAIL_SQL_DATABASE;

FAIL_API_INTEGRATION;

FAIL_SECURITY;

FAIL_MESSAGING;

FAIL_OBSERVABILITY;

FAIL_DEVOPS_CLOUD;

FAIL_TESTING;

FAIL_PERFORMANCE;

FAIL_LIVE_CODING;

FAIL_SYSTEM_DESIGN;

FAIL_TEACHING_DEFENSE;

FAIL_COMMUNICATION;

FAIL_EVIDENCE;

FAIL_HONESTY;

FAIL_ADAPTATION;

FAIL_TIME_MANAGEMENT;

FAIL_UNSUPPORTED_CLAIM;

FAIL_PRODUCTION_MISREPRESENTATION;

FAIL_FULL_ROUND;

FAIL_REDUCED_ROUND;

FAIL_POST_FORMATION_PLAN_ANTICIPATION;

INCONCLUSIVE.
```

---

### 212. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\technical-board\collect-board-sources.ps1

.\scripts\technical-board\validate-board-claims.ps1

.\scripts\technical-board\validate-evidence-index.ps1

.\scripts\technical-board\run-live-coding-challenge.ps1

.\scripts\technical-board\run-system-design-challenge.ps1

.\scripts\technical-board\collect-board-evidence.ps1
```

---

### 213. Revisar gravação

Analise:

- tempo;
- clareza;
- interrupções;
- evidence;
- erros;
- correções;
- linguagem corporal;
- ritmo;
- objetividade.

---

### 214. Transcrever perguntas críticas

---

### 215. Classificar lacunas

Categorias:

- conhecimento;
- prática;
- comunicação;
- evidence;
- tempo;
- confiança.

---

### 216. Encerrar o laboratório

Confirme:

- Charter;
- agenda;
- briefing;
- ambiente;
- apresentação;
- projeto;
- evidence index;
- arquitetura;
- Java;
- Spring/JPA;
- SQL;
- APIs;
- segurança;
- mensageria;
- observabilidade;
- DevOps/cloud;
- testes;
- performance;
- live coding;
- system design;
- ensino;
- histórias;
- objeções;
- incerteza;
- rodada completa;
- rodada reduzida;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 718 preservada.

---

## Entendendo o que foi feito

### A formação ganhou integração

Os assuntos deixaram de aparecer como módulos isolados.

### O projeto ganhou defesa completa

Código, arquitetura, operação e documentação foram conectados.

### Evidence ganhou velocidade

Você passou a localizar rapidamente a prova de cada afirmação.

### A incerteza ganhou método

Não saber deixou de gerar improviso.

### Objeções ganharam diálogo

Você aprendeu a discutir critérios sem agir defensivamente.

### Live coding ganhou contexto

O exercício foi usado para demonstrar raciocínio e teste.

### System design ganhou adaptação

Mudanças de volume e tenancy foram incorporadas.

### Ensino ganhou valor técnico

A capacidade de explicar passou a fazer parte da banca.

### Feedback ganhou estrutura

Forças e lacunas ficaram registradas para a aula 718.

---

## Erros comuns importantes

### Falar demais na apresentação

O tempo técnico diminui.

### Exibir artifacts sem explicar

Evidence não fala sozinha.

### Confundir simulação e produção

A credibilidade é comprometida.

### Responder antes de entender

A pergunta pode ser diferente.

### Discutir objeção como confronto

O raciocínio fica fechado.

### Live coding sem teste

A solução não foi comprovada.

### System design sem estimativa

Escala vira opinião.

### Ensinar sem avaliar o ouvinte

A explicação pode não funcionar.

### Esconder erro

Uma correção honesta é melhor.

### Criar o plano pós-formação agora

Essa etapa pertence à aula 718.

---

## Comandos úteis

### Executar baseline

```powershell
mvn test
```

### Validar claims

```powershell
.\scripts\technical-board\validate-board-claims.ps1
```

### Validar evidence

```powershell
.\scripts\technical-board\validate-evidence-index.ps1
```

### Coletar evidence

```powershell
.\scripts\technical-board\collect-board-evidence.ps1
```

---

## Exercício principal

Realize duas bancas técnicas simuladas.

A rodada completa deve incluir:

1. apresentação;
2. projeto;
3. arquitetura;
4. Java;
5. Spring/JPA;
6. SQL;
7. APIs;
8. segurança;
9. mensageria;
10. observabilidade;
11. DevOps/cloud;
12. testes;
13. performance;
14. live coding;
15. system design;
16. ensino;
17. histórias;
18. objeções;
19. incerteza;
20. feedback.

A rodada reduzida deve repetir os mesmos blocos em noventa minutos.

Não produza ainda o plano de evolução pós-formação.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 716 e ponte para a aula 718 foram preservadas;
- Technical Board Charter foi criado;
- Board Agenda de 180 minutos foi criada;
- avaliadores, regras, gravação e checkpoints foram definidos;
- Candidate Briefing foi criado;
- ambiente, baseline, Git e containers foram validados;
- dados sensíveis foram fechados;
- apresentação profissional curta e longa foi preparada;
- experiência anterior foi conectada ao backend;
- interrupção foi treinada;
- Project Presentation Script foi criado;
- OrderFlow One Page foi criado;
- problema, fluxo, escopo, simulação, medição e limites foram explicados;
- Evidence Index foi criado;
- claims foram ligados a evidence;
- links foram validados;
- evidence ornamental foi evitada;
- Architecture Defense foi criada;
- modularidade, domínio, PostgreSQL, Kafka, Outbox, Inbox, projection e runtimes foram defendidos;
- gatilhos de evolução foram declarados;
- Java Question Bank foi criado;
- JVM, igualdade, imutabilidade, records, generics, collections, exceptions, Streams, concorrência e virtual threads foram respondidos;
- respostas Java foram ligadas ao projeto;
- Spring JPA Question Bank foi criado;
- IoC, DI, proxies, self-invocation, transações, flush, commit, propagation, JPA, Hibernate, context, dirty checking, N+1 e locking foram respondidos;
- SQL Database Question Bank foi criado;
- modelagem, constraints, índices, selectivity, plans, MVCC, isolamento, deadlocks, paginação e migrations foram respondidos;
- API Integration Question Bank foi criado;
- REST, idempotência, status, versionamento, timeout, retry, breaker, ambiguity, ACL e reconciliation foram respondidos;
- Security Question Bank foi criado;
- autenticação, autorização, OAuth2, JWT, tenant, IDOR, secrets, logs e testes negativos foram respondidos;
- Messaging Question Bank foi criado;
- delivery, ordering, retry, DLQ, replay, schema, lag, poison e duplicidade foram respondidos;
- Observability Question Bank foi criado;
- logs, metrics, traces, correlation, SLI, SLO, SLA, golden signals, Outbox age, freshness e runbooks foram respondidos;
- DevOps Cloud Question Bank foi criado;
- containers, Docker, CI/CD, artifacts, Kubernetes, probes, resources, HPA, IAM e rollback foram respondidos;
- Testing Question Bank foi criado;
- unit, integração, Testcontainers, contracts, segurança, concorrência, rollback e estabilidade foram respondidos;
- Performance Question Bank foi criado;
- baseline, percentis, throughput, saturação, pool, plan, gargalo e limites foram respondidos;
- Live Coding Challenge foi criado;
- contrato, identidade, mapas, resultado, testes, complexidade e refatoração foram executados;
- System Design Challenge foi criado;
- volume, tenant dedicado, routing, dados, mensageria, observabilidade e custo foram tratados;
- Teaching Defense foi criada;
- dual write foi explicado, diagramado, diagnosticado e ensinado;
- Behavioral Technical Stories foi criado;
- dez histórias foram preparadas com STAR adaptada;
- resultados inventados foram evitados;
- Objection Handling foi criado;
- overengineering, Kafka, microservices, Outbox e limites de testes foram tratados;
- postura defensiva foi evitada;
- Uncertainty Response Guide foi criado;
- incerteza, ausência de medição, correção e perguntas abertas foram tratadas;
- Board Scorecard foi criado;
- notas mínimas e pesos foram definidos;
- Board Review Checklist foi criado;
- Board Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 718 foi criado;
- rodada principal foi executada;
- cronômetro não foi pausado;
- scores, perguntas, correções, interrupções e evidence foram registrados;
- rodada reduzida foi executada;
- rodadas foram comparadas;
- forças, lacunas, correções e risco profissional foram selecionados;
- plano completo não foi antecipado;
- report, evidence e gate foram criados;
- validators foram executados;
- gravação foi revisada;
- perguntas críticas foram transcritas;
- lacunas foram classificadas;
- commit recomendado e diário de bordo estão presentes;
- plano pós-formação não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

mvn test

.\scripts\technical-board\validate-board-claims.ps1

.\scripts\technical-board\validate-evidence-index.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/technical-board `
  scripts/technical-board `
  reports/technical-board-report.yaml `
  contracts/technical-board-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-proof-without-evidence|realTenant|realCustomer|post-formation-plan"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(board): complete integrated technical simulation"
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

- secret;
- dado real;
- claim sem evidence;
- plano detalhado da aula 718.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou uma banca técnica simulada integrada.

Você apresentou e defendeu:

```text
trajetoria;

OrderFlow;

arquitetura;

Java;

Spring JPA;

SQL;

APIs;

seguranca;

mensageria;

observabilidade;

DevOps cloud;

testes;

performance;

live coding;

system design;

capacidade de ensino;

historias tecnicas;

objeções;

incerteza;

evidence;

feedback.
```

Você executou uma rodada completa e uma rodada reduzida.

Agora existem dados concretos sobre seus pontos fortes, suas lacunas, seu tempo, sua comunicação e sua capacidade técnica.

A próxima aula será:

```text
718 - M20.48 - Plano de evolucao pos formacao
```

Nela, você transformará esses resultados em um plano sustentável de evolução profissional após a formação.

Nenhum plano de evolução pós-formação foi produzido nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Preparei a agenda.
- [ ] Validei ambiente.
- [ ] Apresentei trajetória.
- [ ] Defendi o projeto.
- [ ] Abri evidence.
- [ ] Respondi Java.
- [ ] Respondi Spring/JPA.
- [ ] Respondi SQL.
- [ ] Respondi segurança.
- [ ] Respondi mensageria.
- [ ] Respondi DevOps/cloud.
- [ ] Executei live coding.
- [ ] Executei system design.
- [ ] Ensinei um conceito.
- [ ] Preservei o plano para a aula 718.

---

## Troubleshooting adicional

### A apresentação ultrapassou o tempo

Reduza contexto pessoal e vá ao projeto.

### Não encontrei a evidence

Melhore o índice e os nomes.

### Dei uma resposta incorreta

Corrija explicitamente e explique a diferença.

### A objeção me deixou defensivo

Volte ao requisito e ao trade-off.

### Travei no live coding

Repita o contrato e crie caso pequeno.

### O system design ficou complexo

Volte ao must-have e às assumptions.

### Não soube uma pergunta de cloud

Explique o comportamento necessário e como validaria.

### A aula de ensino ficou técnica demais

Faça diagnóstico e use exemplo menor.

### A rodada reduzida ficou superficial

Comece pela conclusão e evidence.

### Quero montar o plano de melhoria

Essa etapa pertence à aula 718.

---

## Perguntas de revisão

1. A banca exige respostas perfeitas?
2. O que claim precisa possuir?
3. Simulação é produção?
4. Limite reduz credibilidade?
5. Por que abrir evidence?
6. Como começar uma resposta?
7. O que fazer diante de objeção?
8. O que fazer quando não sabe?
9. Flush é commit?
10. Outbox elimina duplicidade?
11. Projection é autoridade?
12. HPA resolve banco?
13. Live coding termina sem teste?
14. System design começa por tecnologia?
15. Ensino começa por conteúdo?
16. O que a rodada reduzida treina?
17. O que scorecard registra?
18. O que matrix conecta?
19. O que risk register mostra?
20. Por que gravar?
21. O que a aula 718 fará?
22. O que não foi produzido?
23. Qual é a próxima aula?
24. Qual é a regra central?
25. Como corrigir uma resposta?

---

## Roteiro de resposta

1. Não.
2. Evidence.
3. Não.
4. Não.
5. Provar.
6. Pela conclusão.
7. Voltar aos critérios.
8. Admitir e investigar.
9. Não.
10. Não.
11. Não.
12. Não.
13. Não.
14. Não.
15. Não.
16. Objetividade.
17. Desempenho.
18. Pergunta e evidence.
19. Riscos.
20. Revisar comportamento.
21. Plano pós-formação.
22. Plano de evolução.
23. Plano de evolucao pos formacao.
24. Fundamentar, provar e adaptar.
25. Declarar a correção.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 717 - M20.47 - Banca tecnica simulada

- Continuei após Aula ensinável final.
- Criei Technical Board Charter.
- Criei Board Agenda de 180 minutos.
- Defini dois avaliadores, regras, gravação e checkpoints.
- Criei Candidate Briefing.
- Validei ambiente, baseline, Git e containers.
- Protegi dados sensíveis.
- Preparei apresentação profissional curta e longa.
- Conectei experiência anterior ao backend.
- Criei Project Presentation Script.
- Criei OrderFlow One Page.
- Declarei implementação, simulação, medição e limites.
- Criei Evidence Index.
- Liguei claims a evidence.
- Validei links.
- Criei Architecture Defense.
- Defendi modularidade, domínio, PostgreSQL, Kafka, Outbox, Inbox, projection e runtimes.
- Criei Java Question Bank.
- Revisei JVM, igualdade, imutabilidade, records, generics, collections, exceptions, Streams, concorrência e virtual threads.
- Criei Spring JPA Question Bank.
- Revisei IoC, DI, proxies, transactions, JPA, Hibernate, context, dirty checking, N+1 e locking.
- Criei SQL Database Question Bank.
- Revisei modelagem, constraints, índices, plans, MVCC, isolamento, deadlocks, paginação e migrations.
- Criei API Integration Question Bank.
- Revisei REST, idempotência, timeout, retry, breaker, ambiguity, ACL e reconciliação.
- Criei Security Question Bank.
- Revisei autenticação, autorização, OAuth2, JWT, tenant, IDOR, secrets, logs e testes.
- Criei Messaging Question Bank.
- Revisei at-least-once, ordering, retry, DLQ, replay, schema, lag, poison e duplicidade.
- Criei Observability Question Bank.
- Revisei logs, métricas, traces, SLOs, golden signals, Outbox age e freshness.
- Criei DevOps Cloud Question Bank.
- Revisei containers, Docker, CI/CD, artifacts, Kubernetes, probes, resources, HPA, IAM e rollback.
- Criei Testing Question Bank.
- Revisei unit, integração, Testcontainers, contracts, segurança, concorrência e rollback.
- Criei Performance Question Bank.
- Revisei baseline, percentis, throughput, saturação, pool, plans e gargalos.
- Criei Live Coding Challenge.
- Executei reconciliação de eventos com testes.
- Criei System Design Challenge.
- Adaptei volume e tenant dedicado.
- Criei Teaching Defense.
- Ensinei dual write em três minutos.
- Criei Behavioral Technical Stories.
- Preparei dez histórias.
- Criei Objection Handling.
- Tratei objeções sem defensividade.
- Criei Uncertainty Response Guide.
- Pratiquei admitir, validar e corrigir.
- Criei Board Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 718.
- Executei rodada completa de 180 minutos.
- Executei rodada reduzida de 90 minutos.
- Registrei scores, perguntas, correções, interrupções e evidence.
- Comparei rodadas.
- Selecionei forças, lacunas e risco profissional.
- Criei report, evidence e gate.
- Revisei gravação.
- Transcrevi perguntas críticas.
- Classifiquei lacunas.
- Não antecipei o plano pós-formação.
- Próxima aula: Plano de evolucao pos formacao.
```

---

## Referência técnica curta

- Technical Board.
- Evidence Index.
- Architecture Defense.
- Java Interview.
- Spring JPA Interview.
- SQL Interview.
- Security Interview.
- Messaging Interview.
- DevOps Cloud Interview.
- Live Coding.
- System Design.
- Teaching Defense.
- Objection Handling.
- Uncertainty.
- Integrated Scorecard.
- Corrected Answer.
- Technical Feedback.

Regra final:

```text
A banca tecnica simulada do OrderFlow deve integrar projeto, conhecimento, evidence and communication: board agenda controla presentation, project, architecture, Java, Spring JPA, SQL, security, messaging, observability, DevOps cloud, testing, performance, live coding, system design and teaching defense, professional introduction conecta experiencia anterior ao backend sem consumir o tempo tecnico, project presentation explica problem, scope, flow, reliability, security, tests, operation and limits, evidence index liga cada claim a code, test, report, diagram or runbook, architecture defense justifica modular boundaries, domain isolation, PostgreSQL, Kafka, Outbox, Inbox, projection and runtime separation, Java answers cobrem JVM, equality, immutability, records, generics, collections, exceptions, streams and concurrency, Spring JPA cobre IoC, proxies, transactions, persistence context, dirty checking, fetching and locking, SQL cobre modeling, indexes, plans, MVCC, isolation and migrations, APIs cobrem idempotency, contracts, timeout, retry, breaker, ambiguity and reconciliation, security cobre OAuth2, JWT validation, tenant, object authorization, secrets and negative tests, messaging cobre at-least-once, ordering, retry, DLQ, replay, schema and lag, observability cobre signals, SLOs, Outbox age, freshness and runbooks, DevOps cloud cobre containers, pipelines, immutable artifacts, Kubernetes, probes, resources, IAM and rollback, tests and performance usam evidence and measured limits, live coding demonstra clarification, data structures, tests and complexity, system design adapta tenfold volume and dedicated tenant without total redesign, teaching defense explica dual write com diagnosis and teach-back, objections are answered by requirements and trade-offs, uncertainty is admitted and corrected explicitly, full and reduced rounds produce integrated scores, report and evidence close the gate, enquanto gap prioritization, deliberate practice, quarterly cycles, portfolio growth and career roadmap permanecem reservados para a aula 718.
```
