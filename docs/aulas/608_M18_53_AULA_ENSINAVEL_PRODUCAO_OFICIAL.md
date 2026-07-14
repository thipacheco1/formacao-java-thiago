# 608 - M18.53 - Aula ensinavel producao

## Apresentação da aula

Você concluiu a refatoração final de produção na aula 607.

Até aqui, você já foi capaz de:

```text
construir uma API observável;

instrumentar logs, métricas e traces;

definir health, liveness e readiness;

modelar SLIs e SLOs;

criar alertas e dashboards;

diagnosticar CPU, memória e banco;

trabalhar com concorrência e backpressure;

estruturar timeout hierarchy;

coordenar incidentes;

executar otimização com before/after;

realizar prova prática;

refatorar o projeto final.
```

Agora o desafio muda.

Saber fazer não significa automaticamente saber ensinar.

Uma aula ensinável precisa transformar conhecimento técnico em uma experiência que outra pessoa consiga acompanhar.

Isso exige:

- objetivo claro;
- pré-requisitos;
- narrativa;
- ordem pedagógica;
- exemplos;
- demonstração;
- exercício;
- critérios de aceite;
- troubleshooting;
- perguntas de revisão;
- linguagem adequada;
- controle de escopo;
- fechamento;
- ponte para o próximo conteúdo.

A pergunta central desta aula será:

```text
como transformar
um tema complexo de produção

em uma aula
que outra pessoa
consiga entender,
executar,
explicar
e revisar?
```

A aula ensinável não será um resumo superficial de todo o módulo.

Ela também não será uma palestra abstrata.

Você irá construir uma aula prática curta, reproduzível e orientada a um problema real:

```text
uma API Java
apresenta aumento de latência;

o aluno precisa
usar logs,
métricas,
traces
e health

para identificar
onde investigar primeiro.
```

O foco pedagógico será ensinar uma sequência de raciocínio.

A aula deverá levar o aluno de:

```text
“a API está lenta”
```

para:

```text
“o p95 aumentou,
o repository span concentra a latência,
o pool não está saturado,
o error rate permanece estável
e a próxima evidência necessária
é o plano da query.”
```

Perceba a diferença.

A primeira frase é um sintoma amplo.

A segunda organiza fatos, correla sinais e evita uma conclusão prematura.

Nesta aula, você irá criar:

- contrato pedagógico;
- definição de público;
- mapa de pré-requisitos;
- objetivo observável;
- roteiro de aula;
- narrativa do incidente;
- demonstração guiada;
- checkpoints;
- laboratório;
- rubrica;
- perguntas;
- respostas esperadas;
- troubleshooting;
- material de apoio;
- roteiro do instrutor;
- roteiro do aluno;
- evidência de execução;
- gate de ensinabilidade.

A próxima aula oficial será:

```text
609 - M18.54 - Checklist SRE para Backend Java
```

Por isso, esta aula não irá montar ainda um checklist SRE completo para uso em projetos.

Ela poderá mencionar alguns itens técnicos dentro da aula ensinável, mas não irá organizar:

- checklist de pré-produção;
- checklist de deploy;
- checklist de observabilidade;
- checklist de incidentes;
- checklist de capacidade;
- checklist de segurança;
- checklist final de SRE.

Esses itens pertencem à aula 609.

A regra central desta aula será:

```text
uma aula é ensinável
quando o aluno
consegue reproduzir
o raciocínio

e não apenas
copiar os comandos.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
606:
Prova pratica producao.

607:
Refatoracao final producao.

608:
Aula ensinavel producao.

609:
Checklist SRE para Backend Java.

610:
Fechamento do Modulo 18.
```

A progressão é:

```text
resolver;

refatorar;

ensinar;

operacionalizar;

fechar o módulo.
```

Nesta aula:

```text
planejamento pedagógico:
sim.

definição de público:
sim.

objetivos:
sim.

roteiro:
sim.

demonstração:
sim.

laboratório:
sim.

checkpoints:
sim.

rubrica:
sim.

troubleshooting:
sim.

roteiro do instrutor:
sim.

roteiro do aluno:
sim.

checklist SRE completo:
não.

fechamento do módulo:
não.
```

O projeto de referência continuará sendo:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

A aula ensinável utilizará apenas uma parte controlada desse projeto.

O aluno não precisa conhecer todo o histórico do módulo para acompanhar.

Por isso, a aula deverá oferecer:

- contexto mínimo;
- comandos mínimos;
- sinais mínimos;
- um incidente sintético;
- uma pergunta principal;
- uma conclusão verificável.

---

## Objetivo prático

Será criada a área pedagógica:

```text
teaching/production-observability-lesson
├── teachable-production-contract.yaml
├── teachable-production-audience.yaml
├── teachable-production-prerequisites.yaml
├── teachable-production-objectives.yaml
├── teachable-production-scope-policy.yaml
├── teachable-production-demo-policy.yaml
├── teachable-production-lab-policy.yaml
├── teachable-production-assessment-policy.yaml
├── teachable-production-accessibility-policy.yaml
├── teachable-production-security-policy.yaml
├── teachable-production-data-quality-policy.yaml
├── teachable-production-failure-policy.yaml
├── teachable-production-scenarios.yaml
└── teachable-production-evidence.yaml

teaching/production-observability-lesson/instructor
├── instructor-guide.md
├── speaking-script.md
├── demo-script.md
├── checkpoint-guide.md
├── troubleshooting-guide.md
└── debrief-guide.md

teaching/production-observability-lesson/student
├── student-handout.md
├── lab-instructions.md
├── observation-sheet.md
├── hypothesis-sheet.md
├── exercise.md
├── acceptance-criteria.md
└── review-questions.md

teaching/production-observability-lesson/reports
├── teachability-review-report.yaml
├── demo-reproducibility-report.yaml
├── lab-execution-report.yaml
├── student-outcome-report.yaml
└── teachable-production-gate-report.yaml
```

Scripts:

```text
scripts/teaching/production-observability-lesson
├── validate-teachable-production-contract.ps1
├── prepare-teachable-production-environment.ps1
├── validate-teachable-prerequisites.ps1
├── run-teachable-production-demo.ps1
├── run-teachable-production-lab.ps1
├── validate-teachable-checkpoints.ps1
├── validate-teachable-student-output.ps1
├── validate-teachable-accessibility.ps1
├── validate-teachable-security.ps1
├── collect-teachable-production-evidence.ps1
└── verify-teachable-production-lesson.ps1
```

Ao final, você terá uma aula que pode ser aplicada por outro instrutor e executada por outro aluno com o mesmo resultado esperado.

---

## Conceito essencial

### Aula ensinável

Aula com objetivo, sequência, materiais, prática e avaliação suficientemente claros para ser reproduzida.

---

### Público-alvo

Grupo de alunos para o qual a aula foi desenhada.

---

### Pré-requisito

Conhecimento ou recurso necessário antes do início.

---

### Objetivo observável

Resultado que pode ser verificado ao final da aula.

---

### Escopo

Limite do que será e do que não será ensinado.

---

### Narrativa pedagógica

Sequência de ideias que conecta problema, conceito, prática e conclusão.

---

### Demonstração

Execução guiada pelo instrutor para tornar um raciocínio visível.

---

### Laboratório

Atividade executada pelo aluno.

---

### Checkpoint

Momento de verificação intermediária.

---

### Critério de aceite

Condição objetiva que comprova a conclusão da atividade.

---

### Rubrica

Conjunto de critérios usado para avaliar a qualidade do resultado.

---

### Debrief

Discussão posterior à prática para consolidar decisões, erros e aprendizados.

---

### Cognitive load

Quantidade de informação que o aluno precisa processar simultaneamente.

---

### Scaffolding

Apoio temporário oferecido ao aluno até que ele consiga executar sozinho.

---

## Mão na massa guiada

### 1. Validar a baseline do projeto

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\refactoring\production-final\verify-production-final-refactoring.ps1

git status

git diff --check
```

Confirme:

- aplicação funcional;
- stack disponível;
- logs estruturados;
- métricas disponíveis;
- traces exportados;
- dashboards provisionados;
- modos lab resetados;
- nenhum processo residual;
- nenhum dado sensível.

---

### 2. Criar contrato pedagógico

Arquivo:

```text
teachable-production-contract.yaml
```

Conteúdo:

```yaml
teachableProductionLesson:
  required:
    - audience
    - prerequisites
    - objective
    - scope
    - narrative
    - demo
    - lab
    - checkpoints
    - assessment
    - troubleshooting
    - debrief
    - evidence

  reproducibleByAnotherInstructor:
    required

  reproducibleByAnotherStudent:
    required

  SREChecklist:
    deferredToLesson609

  nextLesson:
    code:
      M18.54
```

---

### 3. Definir público-alvo

Arquivo:

```text
teachable-production-audience.yaml
```

Conteúdo:

```yaml
audience:
  profile:
    backend-developer-junior-to-mid

  knows:
    - Java-basics
    - Spring-Boot-basics
    - HTTP
    - REST
    - basic-SQL
    - terminal-basics

  doesNotNeedToKnow:
    - advanced-PromQL
    - advanced-JVM-internals
    - Kubernetes-administration
    - SRE-formal-practice

  language:
    Portuguese-Brazil
```

O público define profundidade e vocabulário.

---

### 4. Definir pré-requisitos

Arquivo:

```text
teachable-production-prerequisites.yaml
```

Conteúdo:

```yaml
prerequisites:
  software:
    - JDK-21
    - Maven
    - Docker
    - PowerShell
    - browser

  concepts:
    - endpoint
    - HTTP-status
    - log
    - latency
    - database-query

  environment:
    - project-cloned
    - ports-available
    - Docker-running

  validationScript:
    validate-teachable-prerequisites.ps1
```

---

### 5. Definir objetivo observável

Arquivo:

```text
teachable-production-objectives.yaml
```

Conteúdo:

```yaml
objective:
  byTheEndTheStudentCan:
    - identify-latency-symptom
    - read-RED-signals
    - open-a-trace
    - correlate-trace-and-log
    - distinguish-fact-and-hypothesis
    - recommend-next-evidence

  successStatement:
    student-produces-a-supported-diagnosis

  forbiddenAsSuccess:
    - copied-command-only
    - unsupported-root-cause
```

---

### 6. Escrever objetivo da aula

Objetivo recomendado:

```text
Ao final da aula,
o aluno será capaz de
investigar uma elevação de latência
em uma API Java,
usando dashboard,
trace e log,
e produzir uma hipótese
sustentada por evidências.
```

Esse objetivo contém:

- ação;
- contexto;
- ferramentas;
- resultado verificável.

Objetivo ruim:

```text
entender observabilidade.
```

Ele é amplo e difícil de medir.

---

### 7. Criar scope policy

Arquivo:

```text
teachable-production-scope-policy.yaml
```

Conteúdo:

```yaml
scope:
  include:
    - RED-overview
    - trace-navigation
    - log-correlation
    - fact-vs-hypothesis
    - next-evidence
    - controlled-recovery

  exclude:
    - heap-dump-analysis
    - async-profiler
    - full-SLO-design
    - full-incident-command
    - advanced-PromQL
    - production-SRE-checklist
```

Controle de escopo reduz sobrecarga cognitiva.

---

### 8. Definir duração

Duração sugerida:

```text
10 minutos:
contexto e objetivo.

15 minutos:
conceitos mínimos.

20 minutos:
demonstração.

30 minutos:
laboratório.

10 minutos:
debrief e revisão.

total:
85 minutos.
```

A aula pode ser adaptada, mas a sequência deve ser preservada.

---

### 9. Criar narrativa

A narrativa será:

```text
1. A API parece lenta.

2. O dashboard confirma p95 elevado.

3. Error rate permanece estável.

4. Pool não está saturado.

5. Um trace lento é selecionado.

6. O repository span concentra duração.

7. O log correlacionado confirma a operação.

8. A causa ainda não está provada.

9. A próxima evidência é o plano da query.

10. O aluno produz hipótese sustentada.
```

A narrativa ensina a não pular de sintoma para causa.

---

### 10. Criar roteiro do instrutor

Arquivo:

```text
instructor/instructor-guide.md
```

Seções:

```markdown
# Guia do instrutor

## Público

## Pré-requisitos

## Objetivo

## Resultado esperado

## Escopo

## Ambiente

## Sequência

## Checkpoints

## Perguntas para a turma

## Erros comuns

## Debrief

## Cleanup
```

---

### 11. Criar speaking script

Arquivo:

```text
instructor/speaking-script.md
```

Exemplo de abertura:

```markdown
Hoje não vamos tentar decorar todas as ferramentas de produção.

Vamos praticar uma pergunta específica:

quando uma API fica lenta,
qual sinal devemos abrir primeiro
e como evitamos culpar o banco
sem evidência?
```

O speaking script não precisa ser lido mecanicamente.

Ele preserva:

- ordem;
- termos;
- perguntas;
- transições;
- mensagens principais.

---

### 12. Criar demo policy

Arquivo:

```text
teachable-production-demo-policy.yaml
```

Conteúdo:

```yaml
demo:
  scenario:
    deterministic:
      required

  commands:
    prevalidated:
      required

  expectedOutput:
    documented:
      required

  failureRecovery:
    documented:
      required

  hiddenManualStep:
    forbidden

  sensitiveData:
    forbidden
```

---

### 13. Preparar cenário da demonstração

Cenário sintético:

```text
endpoint:
GET /api/orders/{id}.

sintoma:
p95 acima de 500 ms.

error rate:
normal.

repository span:
aproximadamente 420 ms.

Hikari pending:
zero.

CPU:
normal.

readiness:
UP.
```

Conclusão correta:

```text
a latência se concentra
na etapa de repository.
```

Conclusão ainda não provada:

```text
falta índice.
```

---

### 14. Criar demo script

Arquivo:

```text
instructor/demo-script.md
```

Passos:

1. validar stack;
2. ativar degradação sintética;
3. gerar tráfego;
4. abrir overview;
5. verificar RED;
6. abrir dashboard de dependências;
7. escolher trace lento;
8. localizar repository span;
9. abrir log correlacionado;
10. registrar fato;
11. formular hipótese;
12. resetar degradação;
13. validar recovery.

---

### 15. Preparar ambiente

Execute:

```powershell
.\scripts\teaching\production-observability-lesson\prepare-teachable-production-environment.ps1
```

O script deve:

- validar portas;
- validar Docker;
- validar Java;
- validar Maven;
- subir dependências;
- subir stack;
- iniciar API;
- resetar degradações;
- criar fixtures;
- verificar dashboards;
- confirmar cleanup.

---

### 16. Criar handout do aluno

Arquivo:

```text
student/student-handout.md
```

Conteúdo mínimo:

```markdown
# Investigação de latência

## Objetivo

## Sintoma

## Sinais disponíveis

## Ordem recomendada

1. Overview.
2. RED.
3. Dependencies.
4. Trace.
5. Log.
6. Próxima evidência.

## Regras

- Separe fato de hipótese.
- Não altere configuração durante diagnóstico.
- Não use IDs reais no relatório.
- Não declare causa sem evidência.
```

---

### 17. Criar observation sheet

Arquivo:

```text
student/observation-sheet.md
```

Modelo:

```markdown
# Observações

| Sinal | Fato observado | Janela | Limitação |
|---|---|---|---|
| Request rate | | | |
| Error rate | | | |
| p95 | | | |
| Hikari pending | | | |
| Repository p95 | | | |
| Readiness | | | |
| Trace | | | |
| Log | | | |
```

---

### 18. Criar hypothesis sheet

Arquivo:

```text
student/hypothesis-sheet.md
```

Modelo:

```markdown
# Hipóteses

## H-001

- Sinal:
- Hipótese:
- Evidência que sustenta:
- Evidência que falta:
- Critério de descarte:
- Estado:
```

---

### 19. Criar laboratório

Arquivo:

```text
student/lab-instructions.md
```

Problema:

```text
A API apresenta
aumento de latência
em consultas de pedido.

O aluno precisa
identificar a etapa lenta
e recomendar
a próxima evidência.
```

O laboratório não exige corrigir a query.

O foco é diagnóstico inicial.

---

### 20. Criar lab policy

Arquivo:

```text
teachable-production-lab-policy.yaml
```

Conteúdo:

```yaml
lab:
  studentMust:
    - inspect-dashboard
    - inspect-trace
    - inspect-log
    - record-facts
    - create-hypothesis
    - recommend-next-evidence
    - validate-recovery

  studentMustNot:
    - inspect-hidden-script
    - change-workload
    - change-pool
    - change-timeout
    - claim-root-cause-without-proof

  output:
    documented:
      required
```

---

### 21. Criar checkpoint 1

Após o contexto, pergunte:

```text
qual é o sintoma?

qual é o impacto?

qual sinal confirma
que existe latência?
```

Resposta esperada:

```text
p95 ou p99
acima do budget
na rota crítica.
```

---

### 22. Criar checkpoint 2

Após o dashboard, pergunte:

```text
o serviço está falhando
ou está lento?
```

Resposta deve usar:

- error rate;
- latency;
- volume;
- janela.

Não aceitar:

```text
o gráfico está vermelho.
```

---

### 23. Criar checkpoint 3

Após o trace, pergunte:

```text
qual span concentra
a maior parte da duração?
```

O aluno deve apontar:

- nome;
- duração;
- parent;
- outcome.

---

### 24. Criar checkpoint 4

Após o log, pergunte:

```text
o que agora é fato
e o que continua hipótese?
```

Fato:

```text
repository span concentra duração.
```

Hipótese:

```text
query plan inadequado.
```

---

### 25. Criar checkpoint guide

Arquivo:

```text
instructor/checkpoint-guide.md
```

Para cada checkpoint, registre:

- pergunta;
- resposta mínima;
- resposta excelente;
- erro comum;
- intervenção do instrutor;
- tempo máximo.

---

### 26. Criar exercício

Arquivo:

```text
student/exercise.md
```

Entrega:

```markdown
# Diagnóstico inicial

## Sintoma confirmado

## Sinais analisados

## Fatos

## Hipótese principal

## Hipóteses descartadas

## Evidência ainda necessária

## Ação segura recomendada

## Critério de recovery
```

---

### 27. Criar critérios de aceite

Arquivo:

```text
student/acceptance-criteria.md
```

Critérios:

- sintoma descrito com indicador e janela;
- error rate avaliado;
- pool avaliado;
- trace analisado;
- span lento identificado;
- log correlacionado;
- fato separado de hipótese;
- próxima evidência definida;
- nenhuma alteração indevida;
- recovery validado;
- dados sanitizados.

---

### 28. Criar assessment policy

Arquivo:

```text
teachable-production-assessment-policy.yaml
```

Conteúdo:

```yaml
assessment:
  criteria:
    observation:
      weight:
        25

    signalCorrelation:
      weight:
        25

    factVsHypothesis:
      weight:
        20

    nextEvidence:
      weight:
        15

    communication:
      weight:
        10

    security:
      weight:
        5

  unsupportedRootCause:
    action:
      deduct

  copiedCommandsWithoutReasoning:
    result:
      insufficient
```

---

### 29. Criar rubrica simplificada

Faixas:

```text
excelente:
correlaciona sinais,
explicita limites
e recomenda evidência adequada.

adequado:
identifica etapa lenta
e separa fato de hipótese.

parcial:
encontra sinal,
mas conclui cedo demais.

insuficiente:
copia comandos
sem interpretar.
```

---

### 30. Criar troubleshooting guide

Arquivo:

```text
instructor/troubleshooting-guide.md
```

Inclua:

- Docker indisponível;
- porta ocupada;
- API não inicia;
- Prometheus target down;
- Grafana sem datasource;
- trace não aparece;
- trace ID não aparece no log;
- degradação não ativa;
- tráfego insuficiente;
- aluno culpa banco cedo demais;
- aluno altera pool;
- recovery não ocorre;
- cleanup deixa processo residual.

---

### 31. Criar accessibility policy

Arquivo:

```text
teachable-production-accessibility-policy.yaml
```

Conteúdo:

```yaml
accessibility:
  instructions:
    plainLanguage:
      required

  screenshots:
    alternativeText:
      requiredWhenUsed

  color:
    mustNotBeOnlySignal:
      true

  commands:
    copyableText:
      required

  abbreviations:
    explainFirstUse:
      required

  pace:
    checkpoints:
      required
```

---

### 32. Reduzir cognitive load

Evite apresentar simultaneamente:

- 20 dashboards;
- 10 queries PromQL;
- heap dump;
- JFR;
- banco;
- fila;
- alertas;
- SLO completo.

A aula escolhe uma jornada.

A profundidade vem da qualidade do raciocínio, não da quantidade de ferramentas.

---

### 33. Aplicar scaffolding

Primeira tentativa:

```text
ordem sugerida
e perguntas disponíveis.
```

Segunda tentativa:

```text
apenas checkpoints.
```

Terceira tentativa:

```text
aluno executa sem roteiro.
```

O apoio diminui conforme a autonomia cresce.

---

### 34. Criar debrief

Arquivo:

```text
instructor/debrief-guide.md
```

Perguntas:

1. Qual sinal abriu a investigação?
2. Qual sinal descartou saturação do pool?
3. O que o trace mostrou?
4. O que o log acrescentou?
5. Qual conclusão ainda não podia ser feita?
6. Qual ferramenta seria usada depois?
7. Qual ação seria perigosa?
8. Como validar recovery?

---

### 35. Criar review questions

Arquivo:

```text
student/review-questions.md
```

Inclua perguntas sobre:

- sintoma;
- indicador;
- janela;
- RED;
- trace;
- span;
- log;
- correlação;
- hipótese;
- próxima evidência;
- recovery.

---

### 36. Criar material de apoio

O material deve conter:

```text
glossário curto;

mapa de sinais;

ordem de investigação;

exemplo de fato;

exemplo de hipótese;

exemplo de conclusão inválida;

comandos essenciais;

cleanup.
```

Não transforme o apoio em um livro paralelo.

---

### 37. Criar security policy

Arquivo:

```text
teachable-production-security-policy.yaml
```

Conteúdo:

```yaml
security:
  lesson:
    syntheticData:
      required

  screenshots:
    identifier:
      forbidden

  logs:
    rawPayload:
      forbidden

  traces:
    persistentTraceId:
      forbidden

  environment:
    credential:
      forbidden

  studentOutput:
    sanitize:
      required
```

---

### 38. Criar data quality policy

Arquivo:

```text
teachable-production-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingWindow:
    result:
      weak-observation

  missingVolume:
    result:
      limited

  unsupportedConclusion:
    result:
      invalid

  demoDifferentFromLab:
    result:
      confusing

  hiddenPrerequisite:
    result:
      nonReproducible

  missingExpectedOutput:
    result:
      incomplete
```

---

### 39. Criar failure policy

Arquivo:

```text
teachable-production-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  anotherInstructorCannotRun:
    action:
      fail-teachability

  studentCannotIdentifyObjective:
    action:
      fail-clarity

  hiddenManualStep:
    action:
      fail-reproducibility

  sensitiveDataFound:
    action:
      fail-security

  unsupportedRootCausePresentedAsAnswer:
    action:
      fail-assessment

  SREChecklist:
    deferredToLesson609
```

---

### 40. Criar cenários oficiais

Arquivo:

```text
teachable-production-scenarios.yaml
```

Cenários:

```text
prerequisite-pass;

prerequisite-fail;

environment-prepared;

demo-latency-visible;

RED-read-correctly;

pool-not-saturated;

trace-found;

repository-span-slow;

log-correlated;

fact-recorded;

hypothesis-recorded;

unsupported-root-cause-rejected;

next-evidence-query-plan;

degradation-reset;

recovery-validated;

student-output-complete;

student-output-sensitive-rejected;

another-instructor-reproduction;

accessibility-pass;

teachability-gate-pass.
```

---

### 41. Executar demonstração

Execute:

```powershell
.\scripts\teaching\production-observability-lesson\run-teachable-production-demo.ps1
```

Confirme:

- cenário ativado;
- tráfego gerado;
- p95 visível;
- error rate estável;
- pool saudável;
- trace disponível;
- log correlacionado;
- reset executado;
- recovery visível.

---

### 42. Executar laboratório

Execute:

```powershell
.\scripts\teaching\production-observability-lesson\run-teachable-production-lab.ps1
```

O script não deve revelar a conclusão.

Ele apenas prepara o cenário e coleta o output do aluno.

---

### 43. Validar checkpoints

Execute:

```powershell
.\scripts\teaching\production-observability-lesson\validate-teachable-checkpoints.ps1
```

Valide:

- ordem;
- resposta mínima;
- feedback;
- avanço;
- tempo;
- ausência de resposta revelada antes da tentativa.

---

### 44. Validar output do aluno

Execute:

```powershell
.\scripts\teaching\production-observability-lesson\validate-teachable-student-output.ps1
```

O output precisa conter:

- sintoma;
- janela;
- sinais;
- fatos;
- hipótese;
- evidência faltante;
- ação segura;
- recovery.

---

### 45. Validar outro instrutor

Peça a uma segunda pessoa ou a uma execução independente que siga apenas:

```text
instructor-guide.md
```

A pessoa deve conseguir:

- preparar ambiente;
- executar demo;
- explicar checkpoints;
- iniciar laboratório;
- validar entrega;
- executar cleanup.

Dependência de conhecimento oculto reduz ensinabilidade.

---

### 46. Criar teachability report

Arquivo:

```text
reports/teachability-review-report.yaml
```

Exemplo:

```yaml
teachability:
  audience:
    clear:
      true

  objective:
    observable:
      true

  prerequisites:
    explicit:
      true

  demo:
    reproducible:
      true

  lab:
    executable:
      true

  assessment:
    aligned:
      true

  result:
    PASS
```

---

### 47. Criar demo reproducibility report

Arquivo:

```text
reports/demo-reproducibility-report.yaml
```

Registre:

- ambiente;
- versão;
- duração;
- comandos;
- resultado esperado;
- resultado observado;
- falhas;
- recuperação;
- cleanup.

---

### 48. Criar student outcome report

Arquivo:

```text
reports/student-outcome-report.yaml
```

Campos:

- objective understood;
- symptom identified;
- RED interpreted;
- trace opened;
- log correlated;
- fact/hypothesis separated;
- next evidence recommended;
- recovery validated;
- security passed.

Não inclua dados pessoais do aluno.

---

### 49. Criar gate

O gate valida:

```text
contrato;

público;

pré-requisitos;

objetivo;

escopo;

narrativa;

demo;

laboratório;

checkpoints;

avaliação;

troubleshooting;

acessibilidade;

reprodutibilidade;

segurança;

evidence.
```

Status:

```text
PASS;

FAIL_AUDIENCE;

FAIL_PREREQUISITES;

FAIL_OBJECTIVE;

FAIL_SCOPE;

FAIL_NARRATIVE;

FAIL_DEMO;

FAIL_LAB;

FAIL_CHECKPOINT;

FAIL_ASSESSMENT;

FAIL_ACCESSIBILITY;

FAIL_REPRODUCIBILITY;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 50. Coletar evidence

Arquivo:

```text
teachable-production-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- audience status;
- prerequisites status;
- objective status;
- scope status;
- demo status;
- lab status;
- checkpoint status;
- assessment status;
- accessibility status;
- reproducibility status;
- student outcome category;
- security status;
- gate status;
- timestamp.

Não inclua:

- nome do aluno;
- e-mail;
- request ID;
- trace ID;
- order ID;
- screenshots com identificadores;
- raw logs;
- credenciais;
- checklist SRE da aula 609.

---

### 51. Executar validação completa

Execute:

```powershell
.\scripts\teaching\production-observability-lesson\validate-teachable-production-contract.ps1

.\scripts\teaching\production-observability-lesson\prepare-teachable-production-environment.ps1

.\scripts\teaching\production-observability-lesson\validate-teachable-prerequisites.ps1

.\scripts\teaching\production-observability-lesson\run-teachable-production-demo.ps1

.\scripts\teaching\production-observability-lesson\run-teachable-production-lab.ps1

.\scripts\teaching\production-observability-lesson\validate-teachable-checkpoints.ps1

.\scripts\teaching\production-observability-lesson\validate-teachable-student-output.ps1

.\scripts\teaching\production-observability-lesson\validate-teachable-accessibility.ps1

.\scripts\teaching\production-observability-lesson\validate-teachable-security.ps1

.\scripts\teaching\production-observability-lesson\collect-teachable-production-evidence.ps1

.\scripts\teaching\production-observability-lesson\verify-teachable-production-lesson.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 52. Encerrar o laboratório

Confirme:

- degradação resetada;
- tráfego encerrado;
- API encerrada quando aplicável;
- stack encerrada;
- PostgreSQL encerrado;
- nenhum processo residual;
- nenhuma thread residual;
- relatórios sanitizados;
- material do instrutor completo;
- material do aluno completo;
- checklist SRE não antecipado.

---

## Entendendo o que foi feito

### O conhecimento ganhou público

A profundidade passou a considerar o repertório do aluno.

### O objetivo ganhou verificação

“Entender” foi substituído por uma ação observável.

### O escopo ganhou limite

Temas avançados deixaram de competir com o objetivo principal.

### A narrativa ganhou progressão

Sintoma, sinais, trace, log e hipótese passaram a formar uma sequência.

### A demonstração ganhou contrato

Comandos, outputs e recovery passaram a ser reproduzíveis.

### O laboratório ganhou autonomia

O aluno passou a executar o raciocínio, não apenas assistir.

### Os checkpoints ganharam função

Erros foram detectados antes do final da aula.

### A avaliação ganhou alinhamento

A rubrica passou a medir exatamente o objetivo definido.

### O troubleshooting ganhou previsibilidade

Falhas de ambiente e falhas conceituais foram separadas.

### A acessibilidade ganhou responsabilidade

Cor, jargão e screenshots deixaram de ser a única forma de comunicação.

### A próxima aula ganhou fronteira

O checklist SRE completo fica para a aula 609.

---

## Erros comuns importantes

### Tentar ensinar o módulo inteiro

O aluno perde a pergunta principal.

### Usar objetivo abstrato

Não é possível validar aprendizado.

### Fazer demo perfeita e frágil

Um passo oculto impede reprodução.

### Mostrar muitos dashboards

A quantidade aumenta cognitive load.

### Revelar a conclusão cedo demais

O laboratório vira cópia.

### Avaliar comandos em vez de raciocínio

O aluno pode executar sem compreender.

### Confundir hipótese com causa

A aula ensina um erro operacional.

### Usar cor como único sinal

A acessibilidade fica limitada.

### Criar material diferente da prática

O aluno recebe instruções inconsistentes.

### Antecipar checklist SRE

O foco pedagógico se perde.

---

## Comandos úteis

### Validar pré-requisitos

```powershell
.\scripts\teaching\production-observability-lesson\validate-teachable-prerequisites.ps1
```

### Executar demonstração

```powershell
.\scripts\teaching\production-observability-lesson\run-teachable-production-demo.ps1
```

### Executar laboratório

```powershell
.\scripts\teaching\production-observability-lesson\run-teachable-production-lab.ps1
```

### Validar entrega

```powershell
.\scripts\teaching\production-observability-lesson\validate-teachable-student-output.ps1
```

### Verificar aula

```powershell
.\scripts\teaching\production-observability-lesson\verify-teachable-production-lesson.ps1
```

---

## Exercício guiado

### Parte 1 — Público

Defina quem aprenderá e o que já conhece.

### Parte 2 — Objetivo

Escreva um resultado observável.

### Parte 3 — Escopo

Defina inclusões e exclusões.

### Parte 4 — Narrativa

Ligue sintoma, sinais e hipótese.

### Parte 5 — Demonstração

Crie uma execução reproduzível.

### Parte 6 — Laboratório

Entregue autonomia ao aluno.

### Parte 7 — Checkpoints

Valide compreensão durante a aula.

### Parte 8 — Avaliação

Alinhe rubrica e objetivo.

### Parte 9 — Debrief

Consolide decisões e limites.

### Parte 10 — Gate

Valide ensinabilidade, acessibilidade e segurança.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 607 e ponte para a aula 609 foram preservadas;
- a baseline final do projeto permanece aprovada;
- contrato, público, pré-requisitos, objetivos, policies, cenários e evidence foram criados;
- o público-alvo está explícito;
- pré-requisitos técnicos e conceituais estão explícitos;
- objetivo é observável e verificável;
- o escopo inclui investigação inicial de latência;
- temas avançados não necessários foram excluídos;
- a narrativa separa sintoma, fato, hipótese e próxima evidência;
- o cenário da demonstração é determinístico;
- comandos e outputs esperados estão documentados;
- não existem passos manuais ocultos;
- o instrutor possui guia, speaking script, demo, checkpoints, troubleshooting e debrief;
- o aluno possui handout, laboratório, folhas de observação e hipótese, exercício e critérios;
- checkpoints possuem resposta mínima e intervenção;
- laboratório não revela a conclusão;
- avaliação mede observação, correlação, hipótese, evidência e comunicação;
- aluno precisa identificar repository span lento sem afirmar causa não provada;
- próxima evidência recomendada é coerente;
- recovery é validado;
- outro instrutor consegue executar a aula;
- outro aluno consegue seguir o laboratório;
- instruções usam linguagem clara;
- cor não é o único sinal;
- comandos são fornecidos como texto;
- dados são sintéticos e sanitizados;
- nenhuma informação pessoal, segredo ou raw artifact foi commitado;
- o checklist SRE e o fechamento do módulo não foram antecipados;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/teaching/production-observability-lesson `
  scripts/teaching/production-observability-lesson `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|studentName|studentEmail|customerReference|orderId|requestIdValue|traceIdValue|rawLog|sreChecklist|moduleClosure"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): criar aula ensinavel producao"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- IDs reais;
- raw logs;
- raw traces;
- screenshots sensíveis;
- checklist completo da aula 609;
- fechamento do módulo 18.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou conhecimento técnico em uma experiência pedagógica reproduzível.

Você criou:

```text
contrato;

público;

pré-requisitos;

objetivo;

escopo;

narrativa;

guia do instrutor;

speaking script;

demonstração;

handout;

laboratório;

observation sheet;

hypothesis sheet;

checkpoints;

rubrica;

troubleshooting;

debrief;

gate;

evidence.
```

Você comprovou que uma aula ensinável precisa de objetivo verificável; que escopo reduz cognitive load; que demonstração precisa de resultado esperado e recovery; que laboratório deve exigir raciocínio; que checkpoints evitam que o aluno chegue ao final com uma compreensão incorreta; que a avaliação precisa medir o objetivo; que fatos e hipóteses não podem ser confundidos; e que outro instrutor precisa conseguir reproduzir a aula sem conhecimento oculto.

A próxima aula será:

```text
609 - M18.54 - Checklist SRE para Backend Java
```

Nela, você irá transformar os aprendizados do módulo em um checklist operacional para avaliar uma aplicação Java antes e durante sua operação em produção.

Nenhum checklist SRE completo, gate SRE de aplicação ou checklist de fechamento do módulo foi criado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini público e pré-requisitos.
- [ ] Escrevi objetivo observável.
- [ ] Limitei o escopo.
- [ ] Criei narrativa de diagnóstico.
- [ ] Preparei demo reproduzível.
- [ ] Criei laboratório autônomo.
- [ ] Alinhei checkpoints e rubrica.
- [ ] Validei acessibilidade, segurança e reprodução.

---

## Troubleshooting adicional

### Outro instrutor não consegue iniciar

Revise pré-requisitos, scripts, portas e passos ocultos.

### O aluno não sabe qual dashboard abrir

A narrativa ou o handout estão vagos.

### O aluno culpa o banco imediatamente

Reforce fatos, hipóteses e evidência faltante.

### O trace não aparece

Revise collector, sampling e tráfego da demo.

### O p95 não muda

Verifique ativação da degradação e volume de requests.

### O laboratório entrega a resposta

Remova textos que nomeiam a causa.

### A rubrica mede detalhes não ensinados

Alinhe avaliação ao objetivo e ao escopo.

### O material depende apenas de cores

Adicione labels, texto e valores.

### A aula leva muito mais tempo

Reduza temas e preserve a jornada principal.

### O conteúdo virou checklist operacional completo

Reserve essa organização para a aula 609.

---

## Perguntas de revisão

1. O que torna uma aula ensinável?
2. Por que definir público-alvo?
3. O que é objetivo observável?
4. Por que controlar escopo?
5. O que é narrativa pedagógica?
6. Qual diferença entre demo e laboratório?
7. O que é checkpoint?
8. O que é scaffolding?
9. O que é cognitive load?
10. Por que documentar output esperado?
11. Por que outro instrutor deve reproduzir a aula?
12. Por que não revelar a conclusão antes do laboratório?
13. O que a rubrica deve medir?
14. Por que separar fato e hipótese?
15. O que é debrief?
16. Por que validar recovery na demo?
17. Como melhorar acessibilidade?
18. O que caracteriza um passo oculto?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Objetivo, sequência, prática e avaliação reproduzíveis.
2. Ajustar profundidade e linguagem.
3. Resultado que pode ser verificado.
4. Evitar sobrecarga e dispersão.
5. Sequência que conecta problema e conclusão.
6. Instrutor mostra; aluno executa.
7. Verificação intermediária.
8. Apoio temporário ao aprendizado.
9. Carga mental simultânea.
10. Validar reprodução.
11. Evitar dependência de conhecimento oculto.
12. Preservar raciocínio autônomo.
13. O objetivo da aula.
14. Evitar causa sem evidência.
15. Consolidação após a prática.
16. Fechar a jornada operacional.
17. Linguagem clara, texto, alt text e múltiplos sinais.
18. Ação necessária não documentada.
19. Checklist SRE para Backend Java.
20. Checklist SRE para Backend Java.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 608 - M18.53 - Aula ensinavel producao

- Transformei o conteúdo de produção em uma aula reproduzível.
- Defini público-alvo e pré-requisitos.
- Criei objetivo observável para investigação inicial de latência.
- Controlei o escopo para reduzir cognitive load.
- Estruturei narrativa com sintoma, dashboard, trace, log e hipótese.
- Criei guia do instrutor e speaking script.
- Preparei demonstração determinística com recovery.
- Criei handout e laboratório para o aluno.
- Criei observation sheet e hypothesis sheet.
- Estruturei checkpoints com respostas mínimas.
- Criei exercício, critérios de aceite e rubrica.
- Diferenciei demonstração e prática autônoma.
- Usei scaffolding progressivo.
- Criei troubleshooting e debrief.
- Validei execução por outro instrutor.
- Validei output do aluno.
- Apliquei requisitos de acessibilidade.
- Mantive dados sintéticos e evidence sanitizada.
- Não antecipei o checklist SRE.
- Próxima aula: Checklist SRE para Backend Java.
```

---

## Referência técnica curta

- Instructional design.
- Learning objectives.
- Scaffolding.
- Cognitive load.
- Demonstration-based teaching.
- Guided practice.
- Formative checkpoints.
- Assessment rubrics.
- Technical workshop reproducibility.
- Accessible technical education.

Regra final:

```text
uma aula ensinável de produção precisa transformar conhecimento técnico em uma jornada reproduzível: público e pré-requisitos definem linguagem e profundidade, o objetivo descreve um resultado observável, o escopo limita a carga cognitiva, a narrativa conecta sintoma, dashboard, métricas, trace, log, fato, hipótese e próxima evidência, e a demonstração possui ambiente, comandos, outputs, recovery e cleanup documentados; o aluno recebe handout, laboratório, folhas de observação e hipótese, checkpoints, exercício e critérios de aceite, mas não recebe a conclusão antes de raciocinar, a rubrica mede observação, correlação, evidência e comunicação, outro instrutor consegue aplicar a aula sem passos ocultos, acessibilidade não depende apenas de cor ou jargão e toda telemetria permanece sintética e sanitizada; a aula termina com recuperação validada e gate de ensinabilidade aprovado, enquanto o checklist SRE operacional completo permanece reservado à aula 609.
```
