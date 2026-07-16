# 718 - M20.48 - Plano de evolucao pos formacao

## Apresentação da aula

Na aula 717, você realizou uma banca técnica simulada integrada.

A banca reuniu:

- apresentação profissional;
- defesa do OrderFlow;
- arquitetura;
- Java;
- Spring e JPA;
- SQL e banco;
- APIs e integrações;
- segurança;
- mensageria;
- observabilidade;
- DevOps e cloud;
- testes;
- performance;
- live coding;
- system design;
- capacidade de ensino;
- histórias técnicas;
- tratamento de objeções;
- resposta a incertezas;
- rodada completa;
- rodada reduzida;
- scorecard;
- report, evidence e gate.

Agora você possui dados sobre sua formação.

Você sabe quais blocos estão fortes, quais ainda oscilam, onde faltou prática, onde faltou evidence, onde a comunicação ficou longa e onde o tempo foi mal distribuído.

A formação não termina quando a última aula é concluída.

Ela muda de fase.

Durante o curso, a sequência foi definida por uma grade.

Depois da formação, você precisará assumir responsabilidade sobre:

- o que estudar;
- por que estudar;
- em qual ordem;
- com qual profundidade;
- por quanto tempo;
- qual evidence produzir;
- quando revisar;
- quando parar;
- quando transformar conhecimento em projeto;
- quando buscar feedback;
- quando se candidatar;
- quando ajustar posicionamento.

Um plano ruim diz:

```text
continuar estudando Java,
Spring,
cloud
e arquitetura.
```

Isso não define ação.

Um plano profissional diz:

```text
durante as proximas doze semanas,
reduzir a lacuna de concorrencia Java
de score dois para score quatro,
por meio de tres laboratorios,
duas sessoes de live coding,
um artigo tecnico
e uma entrevista simulada,
com revisao quinzenal
e evidence versionada.
```

Nesta aula, você construirá um sistema de evolução pós-formação.

O plano não será uma lista infinita de tecnologias.

Ele será organizado por:

- lacuna;
- impacto;
- prioridade;
- objetivo;
- prática;
- projeto;
- evidence;
- métrica;
- prazo;
- revisão;
- decisão.

A próxima aula será:

```text
719 - M20.49 - Entrega final portfolio
```

Na aula 719, você consolidará os artifacts finais do projeto, carreira, entrevistas, documentação, aula ensinável e plano de evolução em uma entrega única de portfólio.

Nesta aula, a entrega final do portfólio não será fechada.

O laboratório será:

```text
labs/m20/aula-718-plano-evolucao-pos-formacao/orderflow-post-formation-growth-plan
```

Regra central:

```text
evolucao profissional
nao acontece por acumulo aleatorio;

ela acontece quando
lacunas sao priorizadas,
pratica e deliberada,
evidence e produzida,
feedback e incorporado
e o plano e revisado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

720:
Fechamento da formacao.
```

A aula 718 utiliza como fonte:

- scorecard da banca;
- gravações;
- perguntas não respondidas;
- respostas corrigidas;
- riscos profissionais;
- matriz de competências;
- currículo;
- LinkedIn;
- GitHub;
- portfólio;
- diário de bordo;
- reports;
- evidence;
- feedback técnico;
- feedback pedagógico;
- feedback de iniciante;
- objetivos de carreira;
- disponibilidade semanal.

O plano precisa refletir a realidade.

Não crie uma rotina de vinte horas semanais se você dispõe de cinco.

Não defina dez projetos simultâneos.

Não transforme toda lacuna em nova certificação.

Não trate cada tecnologia popular como prioridade.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/post-formation-growth
├── GROWTH_CHARTER.md
├── BOARD_RESULTS_SUMMARY.md
├── SKILL_GAP_ANALYSIS.md
├── SKILL_PRIORITY_MATRIX.md
├── CAREER_TARGET.md
├── TWELVE_MONTH_ROADMAP.md
├── QUARTERLY_PLAN_Q1.md
├── QUARTERLY_PLAN_Q2.md
├── QUARTERLY_PLAN_Q3.md
├── QUARTERLY_PLAN_Q4.md
├── DELIBERATE_PRACTICE_SYSTEM.md
├── WEEKLY_OPERATING_SYSTEM.md
├── PROJECT_EVOLUTION_BACKLOG.md
├── INTERVIEW_PRACTICE_PLAN.md
├── TECHNICAL_WRITING_PLAN.md
├── TEACHING_PRACTICE_PLAN.md
├── OPEN_SOURCE_PLAN.md
├── MARKET_POSITIONING_PLAN.md
├── NETWORKING_PLAN.md
├── CERTIFICATION_DECISION_GUIDE.md
├── LEARNING_SOURCE_POLICY.md
├── FEEDBACK_SYSTEM.md
├── METRICS_DASHBOARD.md
├── MONTHLY_REVIEW.md
├── QUARTERLY_REVIEW.md
├── STOP_DOING_LIST.md
├── RISK_REGISTER.md
├── TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/post-formation-growth
├── collect-board-results.ps1
├── calculate-skill-priority.ps1
├── validate-roadmap-capacity.ps1
├── generate-growth-dashboard.ps1
├── run-monthly-review.ps1
├── run-quarterly-review.ps1
├── generate-growth-report.ps1
└── collect-growth-evidence.ps1
```

Artifacts:

```text
reports/post-formation-growth-report.yaml

contracts/post-formation-growth-evidence.yaml
```

---

## Conceito essencial

### Lacuna não é fracasso

Lacuna é diferença entre o nível atual e o nível necessário para um objetivo.

### Prioridade depende do alvo

Uma lacuna em Kubernetes pode ser menos importante do que uma lacuna em Java, dependendo da vaga desejada.

### Prática deliberada possui feedback

Repetir mecanicamente não garante evolução.

### Projeto precisa gerar evidence

Projeto sem demonstração, teste, documentação ou reflexão perde valor profissional.

### Plano precisa permitir mudança

A revisão não é desvio.

A revisão faz parte do plano.

---

## Mão na massa guiada

### 1. Criar Growth Charter

Arquivo:

```text
docs/post-formation-growth/GROWTH_CHARTER.md
```

Princípios:

```text
career target guides priorities;

gaps are measured;

practice is deliberate;

projects produce evidence;

feedback changes the plan;

capacity is respected;

progress is reviewed;

final portfolio delivery belongs to lesson 719.
```

---

## Consolidar resultados da banca

### 2. Criar Board Results Summary

Arquivo:

```text
docs/post-formation-growth/BOARD_RESULTS_SUMMARY.md
```

---

### 3. Registrar score por bloco

Inclua:

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

### 4. Registrar nota mínima

---

### 5. Registrar bloco mais forte

---

### 6. Registrar bloco mais fraco

---

### 7. Registrar perguntas não respondidas

---

### 8. Registrar respostas corrigidas

---

### 9. Registrar feedback recorrente

Se dois avaliadores apontaram o mesmo problema, marque maior confiança.

---

### 10. Registrar dificuldade de tempo

---

### 11. Registrar dificuldade de evidence

---

### 12. Separar fato de percepção

Fato:

```text
nao respondeu propagacao REQUIRED versus REQUIRES_NEW.
```

Percepção:

```text
pareceu inseguro.
```

Os dois podem ser úteis, mas não são a mesma coisa.

---

## Análise de lacunas

### 13. Criar Skill Gap Analysis

Arquivo:

```text
docs/post-formation-growth/SKILL_GAP_ANALYSIS.md
```

---

### 14. Definir nível atual

Escala:

```text
0:
nao conhece.

1:
reconhece.

2:
explica com apoio.

3:
aplica sozinho.

4:
defende e diagnostica.

5:
ensina e evolui.
```

---

### 15. Definir nível necessário

Baseado no alvo profissional.

---

### 16. Calcular diferença

```text
gap = nivel necessario - nivel atual.
```

---

### 17. Classificar tipo de lacuna

- conhecimento;
- implementação;
- diagnóstico;
- comunicação;
- evidence;
- velocidade;
- experiência.

---

### 18. Identificar causa provável

Exemplos:

- pouca prática;
- conceito incompleto;
- ausência de projeto;
- nervosismo;
- falta de revisão;
- escopo excessivo.

---

### 19. Evitar concluir que toda dificuldade é falta de conhecimento

---

### 20. Criar evidence da lacuna

Use:

- trecho de gravação;
- pergunta;
- teste;
- score;
- feedback;
- artifact ausente.

---

## Priorização

### 21. Criar Skill Priority Matrix

Arquivo:

```text
docs/post-formation-growth/SKILL_PRIORITY_MATRIX.md
```

Colunas:

- competência;
- nível atual;
- nível alvo;
- gap;
- impacto na vaga;
- frequência em entrevistas;
- dependência;
- esforço;
- evidence;
- prioridade.

---

### 22. Calcular impacto

Escala de um a cinco.

---

### 23. Calcular urgência

---

### 24. Calcular dependência

Java fundamental pode desbloquear Spring, concorrência e performance.

---

### 25. Calcular esforço

---

### 26. Criar fórmula de prioridade

Exemplo:

```text
prioridade =
impacto
+ urgencia
+ dependencia
+ frequencia
- esforço relativo.
```

A fórmula orienta.

Ela não substitui julgamento.

---

### 27. Selecionar no máximo três prioridades trimestrais

---

### 28. Criar backlog para o restante

---

### 29. Evitar estudar apenas o que é confortável

---

### 30. Evitar estudar apenas o que está popular

---

## Alvo profissional

### 31. Criar Career Target

Arquivo:

```text
docs/post-formation-growth/CAREER_TARGET.md
```

Defina:

- cargo;
- senioridade;
- tipo de empresa;
- domínio;
- modelo de trabalho;
- stack central;
- responsabilidades;
- faixa temporal.

---

### 32. Criar alvo principal

Exemplo:

```text
desenvolvedor Java Backend
em equipe de produto,
atuando com APIs,
PostgreSQL,
mensageria,
testes
e cloud,
em ate doze meses.
```

---

### 33. Criar alvo adjacente

Exemplo:

```text
QA automation ou quality engineer
com forte atuacao backend
e transicao planejada.
```

---

### 34. Definir competências obrigatórias

---

### 35. Definir competências diferenciais

---

### 36. Definir o que não é prioridade agora

---

### 37. Revisar alvo com vagas reais

Use descrições de vaga como evidence, não como lista para copiar.

---

## Roadmap de doze meses

### 38. Criar Twelve Month Roadmap

Arquivo:

```text
docs/post-formation-growth/TWELVE_MONTH_ROADMAP.md
```

---

### 39. Dividir em quatro trimestres

---

### 40. Definir tema por trimestre

Exemplo:

```text
Q1:
profundidade Java,
Spring
e SQL.

Q2:
mensageria,
concorrencia
e confiabilidade.

Q3:
cloud,
observabilidade
e operacao.

Q4:
entrevistas,
portfolio
e candidatura.
```

---

### 41. Definir resultado por trimestre

---

### 42. Definir projeto ou evolução

---

### 43. Definir evidence

---

### 44. Definir métrica

---

### 45. Definir critério de conclusão

---

### 46. Preservar folga

Não planeje cem por cento da capacidade.

---

## Primeiro trimestre

### 47. Criar Quarterly Plan Q1

Arquivo:

```text
docs/post-formation-growth/QUARTERLY_PLAN_Q1.md
```

---

### 48. Selecionar três competências

Exemplo:

- concorrência Java;
- transações Spring;
- tuning SQL.

---

### 49. Criar objetivo de concorrência

```text
implementar e explicar
race condition,
locks,
atomics,
executors,
CompletableFuture
e virtual threads,
com testes reproduziveis.
```

---

### 50. Criar objetivo de transações

---

### 51. Criar objetivo de SQL

---

### 52. Criar três laboratórios

---

### 53. Criar uma evolução do OrderFlow

---

### 54. Criar duas entrevistas simuladas

---

### 55. Criar um artigo técnico

---

### 56. Criar review do trimestre

---

## Segundo trimestre

### 57. Criar Quarterly Plan Q2

Arquivo:

```text
docs/post-formation-growth/QUARTERLY_PLAN_Q2.md
```

Temas:

- Kafka;
- idempotência;
- retry;
- schema evolution;
- consumer lag;
- resiliência.

---

### 58. Criar laboratório de duplicidade

---

### 59. Criar laboratório de poison message

---

### 60. Criar laboratório de replay

---

### 61. Evoluir observabilidade

---

### 62. Medir backlog

---

### 63. Publicar case study

---

### 64. Simular incidente

---

### 65. Executar entrevista de mensageria

---

## Terceiro trimestre

### 66. Criar Quarterly Plan Q3

Arquivo:

```text
docs/post-formation-growth/QUARTERLY_PLAN_Q3.md
```

Temas:

- Docker;
- Kubernetes;
- cloud;
- IAM;
- observabilidade;
- custo;
- recuperação.

---

### 67. Criar deployment reproduzível

---

### 68. Criar probes e resources

---

### 69. Criar dashboard operacional

---

### 70. Criar runbook de incidente

---

### 71. Executar restore testado

---

### 72. Criar análise de custo

---

### 73. Executar entrevista DevOps/cloud

---

## Quarto trimestre

### 74. Criar Quarterly Plan Q4

Arquivo:

```text
docs/post-formation-growth/QUARTERLY_PLAN_Q4.md
```

Temas:

- currículo;
- GitHub;
- LinkedIn;
- candidatura;
- entrevistas;
- negociação;
- revisão técnica.

---

### 75. Atualizar currículo

---

### 76. Atualizar portfólio

---

### 77. Executar uma banca por mês

---

### 78. Executar live coding semanal

---

### 79. Criar lista de empresas-alvo

---

### 80. Acompanhar candidaturas

---

### 81. Registrar feedback de processos

---

### 82. Ajustar narrativa

---

## Prática deliberada

### 83. Criar Deliberate Practice System

Arquivo:

```text
docs/post-formation-growth/DELIBERATE_PRACTICE_SYSTEM.md
```

Ciclo:

1. escolher lacuna;
2. definir comportamento;
3. executar tarefa;
4. coletar evidence;
5. receber feedback;
6. corrigir;
7. repetir;
8. aumentar dificuldade.

---

### 84. Criar exercício específico

Evite:

```text
estudar concorrencia.
```

Prefira:

```text
reproduzir uma race condition
em cem execucoes
e elimina-la
com duas abordagens,
comparando custo.
```

---

### 85. Definir dificuldade progressiva

---

### 86. Definir limite de tempo

---

### 87. Definir feedback

---

### 88. Definir repetição

---

### 89. Definir transferência

Use o conceito em outro contexto.

---

### 90. Registrar reflexão

---

## Sistema semanal

### 91. Criar Weekly Operating System

Arquivo:

```text
docs/post-formation-growth/WEEKLY_OPERATING_SYSTEM.md
```

Exemplo de cinco horas semanais:

```text
segunda:
45 minutos de teoria dirigida.

terca:
60 minutos de laboratorio.

quarta:
45 minutos de revisao e flashcards.

quinta:
60 minutos de projeto.

sabado:
90 minutos de entrevista,
escrita
ou teach-back.
```

---

### 92. Definir mínimo viável semanal

Exemplo:

```text
duas horas.
```

---

### 93. Definir semana normal

---

### 94. Definir semana intensa

---

### 95. Evitar culpa quando a capacidade cair

Replaneje.

---

### 96. Criar bloco de revisão

---

### 97. Criar bloco de produção

---

### 98. Criar bloco de comunicação

---

## Backlog de projetos

### 99. Criar Project Evolution Backlog

Arquivo:

```text
docs/post-formation-growth/PROJECT_EVOLUTION_BACKLOG.md
```

Itens possíveis:

- rate limiting distribuído;
- schema registry;
- consumer idempotency avançada;
- partitioning;
- cache;
- tracing;
- chaos testing;
- restore automation;
- multi-tenant routing;
- performance regression gate.

---

### 100. Classificar por valor

---

### 101. Classificar por aprendizagem

---

### 102. Classificar por custo

---

### 103. Selecionar um item por trimestre

---

### 104. Definir definition of done

Inclua:

- código;
- teste;
- docs;
- report;
- evidence;
- defesa.

---

### 105. Evitar reescrever o projeto inteiro

---

## Entrevistas

### 106. Criar Interview Practice Plan

Arquivo:

```text
docs/post-formation-growth/INTERVIEW_PRACTICE_PLAN.md
```

---

### 107. Definir frequência

- live coding semanal;
- entrevista técnica quinzenal;
- system design mensal;
- banca trimestral.

---

### 108. Criar banco de perguntas erradas

---

### 109. Criar banco de respostas corrigidas

---

### 110. Repetir perguntas até explicar sem apoio

---

### 111. Gravar sessões

---

### 112. Medir tempo por resposta

---

### 113. Medir uso de evidence

---

### 114. Alternar entrevistadores

---

## Escrita técnica

### 115. Criar Technical Writing Plan

Arquivo:

```text
docs/post-formation-growth/TECHNICAL_WRITING_PLAN.md
```

---

### 116. Criar um texto por mês

Formatos:

- artigo;
- ADR comentado;
- case study;
- troubleshooting;
- post técnico;
- tutorial.

---

### 117. Usar problemas reais do laboratório

---

### 118. Evitar conteúdo genérico

---

### 119. Incluir trade-offs

---

### 120. Incluir evidence

---

### 121. Pedir revisão

---

## Prática de ensino

### 122. Criar Teaching Practice Plan

Arquivo:

```text
docs/post-formation-growth/TEACHING_PRACTICE_PLAN.md
```

---

### 123. Realizar um teach-back mensal

---

### 124. Alternar público iniciante e experiente

---

### 125. Ensinar uma lacuna recém-dominada

---

### 126. Registrar dúvidas do público

---

### 127. Melhorar material

---

### 128. Não confundir ensinar com evitar prática

---

## Open source

### 129. Criar Open Source Plan

Arquivo:

```text
docs/post-formation-growth/OPEN_SOURCE_PLAN.md
```

---

### 130. Começar por documentação

---

### 131. Corrigir issue pequena

---

### 132. Criar teste

---

### 133. Submeter PR

---

### 134. Aprender revisão pública

---

### 135. Não escolher projeto apenas pelo tamanho

---

## Posicionamento profissional

### 136. Criar Market Positioning Plan

Arquivo:

```text
docs/post-formation-growth/MARKET_POSITIONING_PLAN.md
```

Mensagem principal:

```text
profissional de qualidade e automacao
com evolucao para Java Backend,
forte em testes,
APIs,
confiabilidade,
observabilidade
e investigacao de falhas.
```

---

### 137. Definir provas da mensagem

---

### 138. Definir palavras-chave

---

### 139. Definir histórias

---

### 140. Definir tipos de vaga

---

### 141. Evitar parecer especialista em tudo

---

## Networking

### 142. Criar Networking Plan

Arquivo:

```text
docs/post-formation-growth/NETWORKING_PLAN.md
```

---

### 143. Criar rotina sustentável

Exemplo:

- duas interações técnicas por semana;
- uma conversa por mês;
- um evento por trimestre;
- um pedido de feedback por mês.

---

### 144. Compartilhar aprendizado real

---

### 145. Evitar pedir vaga no primeiro contato

---

### 146. Registrar contatos e contexto

---

### 147. Fazer follow-up respeitoso

---

## Certificações

### 148. Criar Certification Decision Guide

Arquivo:

```text
docs/post-formation-growth/CERTIFICATION_DECISION_GUIDE.md
```

Perguntas:

- a vaga exige?
- organiza conhecimento relevante?
- possui laboratório?
- gera evidence?
- cabe no orçamento?
- substitui prática?

---

### 149. Não usar certificação como fuga de projeto

---

### 150. Definir decisão por trimestre

---

## Política de fontes

### 151. Criar Learning Source Policy

Arquivo:

```text
docs/post-formation-growth/LEARNING_SOURCE_POLICY.md
```

Prioridade:

1. documentação oficial;
2. código e testes;
3. livros;
4. cursos selecionados;
5. artigos técnicos;
6. vídeos;
7. discussões.

---

### 152. Limitar fontes simultâneas

---

### 153. Registrar o que foi aplicado

---

### 154. Evitar colecionar cursos

---

## Feedback

### 155. Criar Feedback System

Arquivo:

```text
docs/post-formation-growth/FEEDBACK_SYSTEM.md
```

Fontes:

- mentor;
- colega;
- avaliador;
- recrutador;
- usuário;
- métricas;
- testes;
- incidentes simulados.

---

### 156. Pedir feedback específico

---

### 157. Registrar comportamento observado

---

### 158. Definir ação

---

### 159. Reavaliar depois

---

### 160. Evitar obedecer todo feedback automaticamente

---

## Métricas

### 161. Criar Metrics Dashboard

Arquivo:

```text
docs/post-formation-growth/METRICS_DASHBOARD.md
```

Métricas:

- horas de prática deliberada;
- laboratórios concluídos;
- testes criados;
- artigos publicados;
- entrevistas realizadas;
- score médio;
- perguntas corrigidas;
- PRs;
- candidaturas;
- respostas;
- conversões;
- feedback incorporado.

---

### 162. Evitar métrica de vaidade

Seguidores não substituem competência.

---

### 163. Medir resultado e processo

---

### 164. Definir baseline

---

### 165. Definir meta trimestral

---

## Revisões

### 166. Criar Monthly Review

Arquivo:

```text
docs/post-formation-growth/MONTHLY_REVIEW.md
```

Perguntas:

- o que avancei?
- o que produzi?
- qual evidence?
- onde travei?
- o que parei?
- o que ajustarei?

---

### 167. Criar Quarterly Review

Arquivo:

```text
docs/post-formation-growth/QUARTERLY_REVIEW.md
```

Inclua:

- scores;
- artifacts;
- entrevistas;
- projeto;
- mercado;
- capacidade;
- decisão do próximo trimestre.

---

### 168. Criar Stop Doing List

Arquivo:

```text
docs/post-formation-growth/STOP_DOING_LIST.md
```

Exemplos:

- iniciar curso sem concluir objetivo atual;
- refatorar portfólio toda semana;
- estudar sem produzir;
- adicionar tecnologia sem necessidade;
- comparar rotina com outra pessoa;
- esconder lacunas;
- acumular notas sem revisão.

---

## Riscos e rastreabilidade

### 169. Criar Risk Register

Arquivo:

```text
docs/post-formation-growth/RISK_REGISTER.md
```

Riscos:

```text
plano maior que a capacidade;

muitas prioridades;

projeto sem entrega;

estudo passivo;

feedback ausente;

metricas de vaidade;

candidatura adiada;

burnout;

mudanca de alvo sem criterio;

portfolio final antecipado.
```

---

### 170. Criar mitigação por risco

---

### 171. Criar Traceability

Arquivo:

```text
docs/post-formation-growth/TRACEABILITY.md
```

Exemplo:

```text
lacuna:
concorrencia Java
-> laboratorio
-> tests
-> article
-> interview score.

lacuna:
system design
-> monthly simulation
-> diagram
-> feedback
-> board score.

alvo:
Java Backend
-> OrderFlow
-> portfolio
-> applications
-> interview conversion.
```

---

### 172. Criar boundary da próxima aula

Arquivo:

```text
docs/post-formation-growth/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 718 define:

- board result consolidation;
- skill gap analysis;
- priority matrix;
- career target;
- twelve-month roadmap;
- quarterly plans;
- deliberate practice;
- weekly system;
- project backlog;
- interview practice;
- technical writing;
- teaching practice;
- open source;
- market positioning;
- networking;
- certification decisions;
- learning source policy;
- feedback;
- metrics;
- monthly review;
- quarterly review;
- stop-doing list;
- growth risks.

A aula 719 define:

- final portfolio delivery;
- repository curation;
- final README;
- architecture package;
- evidence package;
- API package;
- testing package;
- operational package;
- teaching package;
- career package;
- final links;
- publication;
- final review;
- portfolio handoff.

Nenhuma entrega final de portfolio
e fechada nesta aula.
```

---

## Relatório e evidence

### 173. Criar report

Arquivo:

```text
reports/post-formation-growth-report.yaml
```

Exemplo:

```yaml
postFormationGrowth:
  careerTarget:
    defined:
      true

  gaps:
    total:
      measured
    prioritized:
      3

  roadmap:
    months:
      12
    quarters:
      4
    capacityValidated:
      true

  practice:
    deliberatePracticeSystem:
      PASS
    weeklySystem:
      PASS
    interviewPlan:
      PASS
    writingPlan:
      PASS
    teachingPlan:
      PASS

  metrics:
    dashboard:
      PASS
    monthlyReview:
      PASS
    quarterlyReview:
      PASS

  finalPortfolioDelivery:
    completed:
      false

  gate:
    PASS
```

---

### 174. Criar evidence

Arquivo:

```text
contracts/post-formation-growth-evidence.yaml
```

Campos:

- lesson;
- project;
- board block count;
- gap count;
- high-priority gap count;
- target role;
- roadmap month count;
- quarterly plan count;
- planned weekly hours;
- minimum weekly hours;
- laboratory count;
- project evolution count;
- interview frequency;
- writing frequency;
- teaching frequency;
- open-source target count;
- networking target count;
- metric count;
- monthly review status;
- quarterly review status;
- stop-doing item count;
- risk count;
- capacity validation status;
- final portfolio delivery completed;
- documentation status;
- gate status;
- timestamp.

---

### 175. Criar gate

Status:

```text
PASS;

FAIL_BOARD_RESULTS;

FAIL_GAP_ANALYSIS;

FAIL_PRIORITY_MATRIX;

FAIL_CAREER_TARGET;

FAIL_TWELVE_MONTH_ROADMAP;

FAIL_Q1_PLAN;

FAIL_Q2_PLAN;

FAIL_Q3_PLAN;

FAIL_Q4_PLAN;

FAIL_DELIBERATE_PRACTICE;

FAIL_WEEKLY_SYSTEM;

FAIL_PROJECT_BACKLOG;

FAIL_INTERVIEW_PLAN;

FAIL_WRITING_PLAN;

FAIL_TEACHING_PLAN;

FAIL_OPEN_SOURCE_PLAN;

FAIL_MARKET_POSITIONING;

FAIL_NETWORKING;

FAIL_CERTIFICATION_POLICY;

FAIL_SOURCE_POLICY;

FAIL_FEEDBACK_SYSTEM;

FAIL_METRICS;

FAIL_MONTHLY_REVIEW;

FAIL_QUARTERLY_REVIEW;

FAIL_STOP_DOING_LIST;

FAIL_CAPACITY_VALIDATION;

FAIL_RISK_REGISTER;

FAIL_FINAL_PORTFOLIO_ANTICIPATION;

INCONCLUSIVE.
```

---

### 176. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\post-formation-growth\collect-board-results.ps1

.\scripts\post-formation-growth\calculate-skill-priority.ps1

.\scripts\post-formation-growth\validate-roadmap-capacity.ps1

.\scripts\post-formation-growth\generate-growth-dashboard.ps1

.\scripts\post-formation-growth\collect-growth-evidence.ps1
```

---

### 177. Validar capacidade

Some as horas de cada atividade.

Compare com disponibilidade real.

---

### 178. Remover excesso

---

### 179. Selecionar três prioridades

---

### 180. Criar calendário do primeiro mês

---

### 181. Executar primeira semana piloto

---

### 182. Registrar fricção

---

### 183. Ajustar rotina

---

### 184. Fazer revisão com mentor ou colega

---

### 185. Fechar report e evidence

---

### 186. Encerrar o laboratório

Confirme:

- Charter;
- resultados;
- gaps;
- prioridades;
- alvo;
- roadmap;
- quatro trimestres;
- prática deliberada;
- semana;
- projetos;
- entrevistas;
- escrita;
- ensino;
- open source;
- posicionamento;
- networking;
- certificações;
- fontes;
- feedback;
- métricas;
- revisões;
- stop doing;
- riscos;
- traceability;
- capacidade validada;
- semana piloto;
- report;
- evidence;
- gate aprovado;
- aula 719 preservada.

---

## Entendendo o que foi feito

### O feedback virou plano

A banca deixou de ser apenas avaliação.

### As lacunas ganharam prioridade

Nem tudo precisa ser resolvido agora.

### O alvo profissional ganhou influência

O roadmap passou a servir à carreira desejada.

### A prática ganhou comportamento observável

Estudar foi substituído por implementar, testar, medir, explicar e defender.

### O tempo ganhou limite

A capacidade real passou a restringir o plano.

### Os projetos ganharam definição de pronto

Código sem teste, documentação e evidence deixou de ser suficiente.

### A comunicação ganhou rotina

Entrevistas, escrita e ensino passaram a fazer parte da evolução.

### O plano ganhou revisão

Mês e trimestre passaram a produzir decisões.

---

## Erros comuns importantes

### Criar vinte prioridades

Nenhuma recebe profundidade.

### Planejar pela empolgação

A capacidade é ignorada.

### Estudar sem aplicar

Conhecimento não vira comportamento.

### Refazer o projeto inteiro

A entrega nunca termina.

### Buscar certificação para evitar prática

A lacuna permanece.

### Medir apenas horas

Tempo não prova competência.

### Adiar candidaturas até se sentir perfeito

Feedback de mercado nunca chega.

### Aceitar todo feedback

O plano perde direção.

### Manter tudo na agenda

O descanso desaparece.

### Antecipar a entrega final

Essa etapa pertence à aula 719.

---

## Comandos úteis

### Calcular prioridade

```powershell
.\scripts\post-formation-growth\calculate-skill-priority.ps1
```

### Validar capacidade

```powershell
.\scripts\post-formation-growth\validate-roadmap-capacity.ps1
```

### Gerar dashboard

```powershell
.\scripts\post-formation-growth\generate-growth-dashboard.ps1
```

### Coletar evidence

```powershell
.\scripts\post-formation-growth\collect-growth-evidence.ps1
```

---

## Exercício principal

Crie um plano de evolução de doze meses.

Inclua:

1. consolidar banca;
2. registrar scores;
3. registrar perguntas;
4. classificar lacunas;
5. definir níveis;
6. calcular gaps;
7. criar matriz;
8. escolher três prioridades;
9. definir alvo;
10. revisar vagas;
11. dividir quatro trimestres;
12. criar objetivos;
13. criar laboratórios;
14. definir projetos;
15. definir evidence;
16. criar sistema semanal;
17. definir mínimo viável;
18. criar plano de entrevistas;
19. criar plano de escrita;
20. criar plano de ensino;
21. criar plano open source;
22. criar posicionamento;
23. criar networking;
24. decidir certificações;
25. limitar fontes;
26. criar feedback;
27. criar métricas;
28. criar revisão mensal;
29. criar revisão trimestral;
30. criar stop-doing;
31. criar riscos;
32. validar capacidade;
33. executar semana piloto;
34. ajustar plano;
35. fechar gate.

Não finalize o pacote de portfólio da aula 719.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 717 e ponte para a aula 719 foram preservadas;
- Growth Charter foi criado;
- Board Results Summary foi criado;
- scores, forças, lacunas, perguntas, correções, tempo e evidence foram registrados;
- fato e percepção foram separados;
- Skill Gap Analysis foi criada;
- níveis atual e necessário foram definidos;
- gaps foram calculados;
- tipos e causas foram classificados;
- evidence de lacuna foi criada;
- Skill Priority Matrix foi criada;
- impacto, urgência, dependência, esforço e frequência foram tratados;
- fórmula de prioridade foi usada com julgamento;
- no máximo três prioridades trimestrais foram selecionadas;
- backlog foi criado;
- conforto e popularidade não definiram prioridade;
- Career Target foi criado;
- alvo principal e adjacente foram definidos;
- competências obrigatórias, diferenciais e fora de prioridade foram definidas;
- vagas reais foram usadas como evidence;
- Twelve Month Roadmap foi criado;
- quatro trimestres, temas, resultados, projetos, evidence, métricas e critérios foram definidos;
- folga foi preservada;
- planos Q1, Q2, Q3 e Q4 foram criados;
- laboratórios, evoluções, entrevistas, artigos e reviews foram definidos;
- Deliberate Practice System foi criado;
- tarefa específica, dificuldade, tempo, feedback, repetição, transferência e reflexão foram definidos;
- Weekly Operating System foi criado;
- mínimo viável, semana normal e intensa foram definidos;
- culpa por redução de capacidade foi evitada;
- revisão, produção e comunicação foram incluídas;
- Project Evolution Backlog foi criado;
- valor, aprendizagem, custo e definition of done foram definidos;
- reescrita total foi evitada;
- Interview Practice Plan foi criado;
- frequências, perguntas erradas, respostas corrigidas, gravação e tempo foram definidos;
- Technical Writing Plan foi criado;
- frequência, problemas, trade-offs, evidence e revisão foram definidos;
- Teaching Practice Plan foi criado;
- teach-back, públicos, dúvidas e melhoria foram definidos;
- ensino não substituiu prática;
- Open Source Plan foi criado;
- documentação, issue, teste, PR e revisão pública foram definidos;
- Market Positioning Plan foi criado;
- mensagem, provas, palavras-chave, histórias e vagas foram definidas;
- especialização universal foi evitada;
- Networking Plan foi criado;
- rotina, conteúdo, contatos e follow-up foram definidos;
- Certification Decision Guide foi criado;
- critérios e decisão trimestral foram definidos;
- certificação não substituiu projeto;
- Learning Source Policy foi criada;
- prioridade, limite e aplicação foram definidos;
- coleção de cursos foi evitada;
- Feedback System foi criado;
- fontes, pedido, comportamento, ação e reavaliação foram definidos;
- todo feedback não foi obedecido automaticamente;
- Metrics Dashboard foi criado;
- métricas de processo e resultado foram definidas;
- métricas de vaidade foram evitadas;
- baseline e metas foram criadas;
- Monthly Review foi criada;
- Quarterly Review foi criada;
- Stop Doing List foi criada;
- Risk Register foi criado;
- mitigação foi definida;
- Traceability foi criada;
- boundary da aula 719 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- capacidade foi validada;
- excesso foi removido;
- três prioridades foram confirmadas;
- calendário do primeiro mês foi criado;
- semana piloto foi executada;
- fricção foi registrada;
- rotina foi ajustada;
- revisão externa foi realizada;
- commit recomendado e diário de bordo estão presentes;
- entrega final de portfólio não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\post-formation-growth\validate-roadmap-capacity.ps1

.\scripts\post-formation-growth\calculate-skill-priority.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/post-formation-growth `
  scripts/post-formation-growth `
  reports/post-formation-growth-report.yaml `
  contracts/post-formation-growth-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|realTenant|realCustomer|final-portfolio-delivery"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(growth): define post-formation evolution plan"
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
- meta incompatível com a capacidade;
- pacote final da aula 719.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou resultados da banca em um plano de evolução pós-formação.

Você criou:

```text
board summary;

gap analysis;

priority matrix;

career target;

twelve-month roadmap;

four quarterly plans;

deliberate practice;

weekly operating system;

project backlog;

interview plan;

technical writing;

teaching practice;

open source plan;

market positioning;

networking;

certification guide;

source policy;

feedback system;

metrics;

monthly review;

quarterly review;

stop-doing list;

risk register;

report e evidence.
```

Agora você possui um plano executável, limitado pela capacidade real e conectado ao objetivo profissional.

A próxima aula será:

```text
719 - M20.49 - Entrega final portfolio
```

Nela, você reunirá os principais artifacts da formação em uma entrega final de portfólio, pronta para apresentação, publicação, candidatura e revisão técnica.

Nenhuma entrega final de portfólio foi fechada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Consolidei a banca.
- [ ] Analisei lacunas.
- [ ] Priorizei três competências.
- [ ] Defini alvo profissional.
- [ ] Criei roadmap de doze meses.
- [ ] Criei quatro trimestres.
- [ ] Criei prática deliberada.
- [ ] Defini sistema semanal.
- [ ] Planejei projetos e entrevistas.
- [ ] Planejei escrita e ensino.
- [ ] Defini métricas.
- [ ] Criei revisões.
- [ ] Validei capacidade.
- [ ] Executei semana piloto.
- [ ] Preservei o portfólio para a aula 719.

---

## Troubleshooting adicional

### O plano não cabe na semana

Reduza prioridades e tamanho das entregas.

### Toda lacuna parece urgente

Volte ao alvo profissional.

### O roadmap perdeu sentido

Revise vagas, feedback e capacidade.

### Não consigo manter rotina

Use o mínimo viável semanal.

### Estudo muito e produzo pouco

Crie definition of done com artifact.

### Evito entrevistas porque ainda erro

Use entrevistas como prática e feedback.

### Quero começar outra formação inteira

Verifique se existe lacuna específica.

### As métricas viraram pressão

Reduza quantidade e preserve saúde.

### O projeto ficou grande demais

Escolha uma evolução por trimestre.

### Quero publicar tudo agora

Essa etapa pertence à aula 719.

---

## Perguntas de revisão

1. Lacuna significa fracasso?
2. Prioridade depende de quê?
3. Toda lacuna deve ser resolvida agora?
4. O que prática deliberada exige?
5. Horas provam competência?
6. Quantas prioridades trimestrais?
7. Por que criar alvo profissional?
8. Por que usar vagas reais?
9. Roadmap precisa de folga?
10. O que mínimo viável semanal protege?
11. Projeto precisa gerar o quê?
12. Entrevista serve apenas para seleção?
13. Escrita técnica precisa de evidence?
14. Ensino substitui prática?
15. Certificação substitui projeto?
16. Toda fonte deve ser consumida?
17. Todo feedback deve ser seguido?
18. Métrica de vaidade ajuda?
19. O que revisão mensal produz?
20. O que stop-doing protege?
21. O que a aula 719 fará?
22. O que não foi fechado?
23. Qual é a próxima aula?
24. Qual é a regra central?
25. O que fazer quando o plano não cabe?

---

## Roteiro de resposta

1. Não.
2. Alvo.
3. Não.
4. Feedback e repetição.
5. Não.
6. Três.
7. Orientar decisões.
8. Evidence de mercado.
9. Sim.
10. Continuidade.
11. Evidence.
12. Não.
13. Sim.
14. Não.
15. Não.
16. Não.
17. Não.
18. Pouco.
19. Ajustes.
20. Foco.
21. Entrega final portfólio.
22. Pacote final.
23. Entrega final portfolio.
24. Priorizar, praticar, medir e revisar.
25. Reduzir escopo.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 718 - M20.48 - Plano de evolucao pos formacao

- Continuei após Banca técnica simulada.
- Criei Growth Charter.
- Criei Board Results Summary.
- Consolidei scores, forças, lacunas, perguntas, correções, tempo e evidence.
- Separei fatos e percepções.
- Criei Skill Gap Analysis.
- Defini níveis atual e necessário.
- Calculei gaps.
- Classifiquei conhecimento, prática, diagnóstico, comunicação, evidence, velocidade e experiência.
- Registrei causas e provas.
- Criei Skill Priority Matrix.
- Avaliei impacto, urgência, dependência, frequência e esforço.
- Selecionei três prioridades trimestrais.
- Criei backlog.
- Criei Career Target.
- Defini alvo principal e adjacente.
- Revisei vagas reais.
- Criei Twelve Month Roadmap.
- Dividi em quatro trimestres.
- Defini temas, resultados, projetos, evidence, métricas e critérios.
- Preservei folga.
- Criei Q1 com Java, Spring e SQL.
- Criei Q2 com mensageria e confiabilidade.
- Criei Q3 com cloud, observabilidade e operação.
- Criei Q4 com entrevistas, portfólio e candidaturas.
- Criei Deliberate Practice System.
- Defini tarefas específicas, dificuldade, tempo, feedback, repetição e transferência.
- Criei Weekly Operating System.
- Defini mínimo viável, semana normal e intensa.
- Incluí revisão, produção e comunicação.
- Criei Project Evolution Backlog.
- Defini valor, aprendizagem, custo e definition of done.
- Evitei reescrita total.
- Criei Interview Practice Plan.
- Defini live coding semanal, entrevista quinzenal, system design mensal e banca trimestral.
- Criei Technical Writing Plan.
- Defini um texto mensal com trade-offs e evidence.
- Criei Teaching Practice Plan.
- Defini teach-back mensal.
- Criei Open Source Plan.
- Planejei documentação, issue, teste e PR.
- Criei Market Positioning Plan.
- Posicionei qualidade, automação e Java Backend.
- Criei Networking Plan.
- Criei Certification Decision Guide.
- Evitei certificação como fuga.
- Criei Learning Source Policy.
- Limitei fontes e cursos.
- Criei Feedback System.
- Defini fontes, comportamento, ação e revisão.
- Criei Metrics Dashboard.
- Medi processo e resultado.
- Evitei métricas de vaidade.
- Criei Monthly Review.
- Criei Quarterly Review.
- Criei Stop Doing List.
- Criei Risk Register.
- Criei mitigações.
- Criei Traceability.
- Criei boundary para a aula 719.
- Criei report, evidence e gate.
- Validei capacidade.
- Removi excesso.
- Criei calendário do primeiro mês.
- Executei semana piloto.
- Registrei fricção.
- Ajustei rotina.
- Solicitei revisão externa.
- Não antecipei a entrega final do portfólio.
- Próxima aula: Entrega final portfolio.
```

---

## Referência técnica curta

- Skill Gap.
- Priority Matrix.
- Career Target.
- Deliberate Practice.
- Weekly Operating System.
- Quarterly Plan.
- Definition of Done.
- Interview Practice.
- Technical Writing.
- Teach-Back.
- Open Source.
- Market Positioning.
- Feedback Loop.
- Process Metric.
- Outcome Metric.
- Monthly Review.
- Quarterly Review.
- Stop-Doing List.

Regra final:

```text
O plano de evolucao pos-formacao deve transformar feedback em acao sustentável: board results consolidam scores, unanswered questions, corrected answers, timing and evidence, skill gap analysis compara current and target levels e classifica knowledge, implementation, diagnosis, communication, evidence, speed and experience gaps, priority matrix combina career impact, urgency, dependency, interview frequency and effort para limitar o trimestre a tres prioridades, career target define role, seniority, company context, stack and adjacent path, twelve-month roadmap distribui Java Spring SQL, messaging reliability, cloud operations and interviews portfolio em quatro trimestres com results, projects, evidence, metrics and completion criteria, deliberate practice escolhe um comportamento, executa tarefa, coleta evidence, recebe feedback, corrige, repete and transfere, weekly operating system respeita minimum viable, normal and intensive capacity, project backlog seleciona uma evolução por trimestre com code, tests, docs, report and defense, interview practice combina weekly live coding, biweekly technical interview, monthly system design and quarterly board, writing and teaching tornam raciocínio público e revisável, open source adiciona revisão externa, market positioning conecta quality automation background a Java Backend reliability, networking permanece sustentável, certification guide evita fuga de projeto, source policy prioriza official documentation and applied learning, feedback system transforma comportamento observado em ação, metrics medem practice, artifacts, interviews, applications and conversions sem depender de vanity metrics, monthly and quarterly reviews alteram o plano, stop-doing list protege foco and health, pilot week valida capacidade, report and evidence fecham o gate, enquanto repository curation, final README, architecture package, API package, test package, operational package, teaching package, career package and publication handoff permanecem reservados para a aula 719.
```
