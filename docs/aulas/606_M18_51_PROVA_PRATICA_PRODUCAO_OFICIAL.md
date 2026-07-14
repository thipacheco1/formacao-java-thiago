# 606 - M18.51 - Prova pratica producao

## Apresentação da aula

Esta aula é a avaliação prática do módulo de observabilidade, performance, concorrência e produção.

Nas aulas anteriores, você construiu repertório para:

```text
instrumentar uma API;

produzir logs estruturados;

criar métricas bounded;

propagar contexto;

analisar traces;

definir health,
liveness
e readiness;

criar SLIs,
SLOs
e alertas;

diagnosticar CPU;

diagnosticar memória;

analisar concorrência;

identificar race condition;

identificar deadlock;

aplicar backpressure;

definir timeout hierarchy;

diagnosticar banco lento;

coordenar incidentes;

otimizar com before/after.
```

Agora você deverá aplicar esse conhecimento em um cenário integrado.

A prova não é uma lista de perguntas teóricas isoladas.

Você receberá uma API observável funcional e um incidente sintético de produção.

Seu trabalho será:

```text
detectar;

declarar;

organizar;

coletar evidência;

formular hipóteses;

diagnosticar;

mitigar;

corrigir;

validar;

comunicar;

encerrar.
```

A aplicação de referência continuará sendo:

```text
observable-orders-api
```

Todo o cenário será executado com:

- dados sintéticos;
- ambiente local;
- PostgreSQL local;
- Prometheus;
- Grafana;
- OpenTelemetry Collector;
- degradação controlada;
- scripts bounded;
- artefatos sanitizados.

Nenhum sistema real será acessado.

A prova avalia o processo técnico, não apenas o resultado final.

Uma conclusão correta sem evidência suficiente não recebe a mesma avaliação de um diagnóstico reproduzível.

Uma alteração que “parece resolver”, mas:

- remove observabilidade;
- quebra o SLO;
- aumenta error rate;
- cria leak;
- perde eventos;
- ignora rollback;
- usa dado sensível;
- executa ação destrutiva;

não será considerada uma solução aprovada.

O cenário principal será liberado por um script de prova.

Ele poderá combinar sinais como:

```text
p99 elevado;

5xx intermitente;

readiness oscilando;

Hikari pending;

fila próxima da capacidade;

timeout;

lock wait;

CPU elevada;

allocation alta;

trace com span lento;

logs correlacionados;

mudança recente de release.
```

Você não deve presumir que todos os sinais possuem a mesma causa.

Um incidente pode conter:

- causa principal;
- consequência;
- proteção;
- ruído;
- limitação de capacidade;
- problema secundário;
- hipótese descartada.

A avaliação exige decomposição.

A pergunta central será:

```text
você consegue operar
e diagnosticar
uma API Java em produção

usando sinais confiáveis,
mudanças seguras
e validação reproduzível?
```

A próxima aula oficial será:

```text
607 - M18.52 - Refatoracao final producao
```

Na aula 607, os resultados da prova serão usados para organizar refatorações finais.

Por isso, esta aula não executará essa refatoração.

Ela irá produzir:

- diagnóstico;
- solução candidata;
- evidência;
- relatório;
- pendências;
- pontos de melhoria.

A regra central será:

```text
na prova,
não vence
quem altera mais código;

vence quem demonstra
a causa,
reduz o impacto,
preserva contratos
e comprova o resultado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
604:
Revisao producao parte 1.

605:
Revisao producao parte 2.

606:
Prova pratica producao.

607:
Refatoracao final producao.

608:
Aula ensinavel producao.
```

A progressão é:

```text
revisar fundamentos;

revisar diagnóstico;

executar avaliação;

refatorar;

ensinar.
```

Nesta aula:

```text
cenário integrado:
sim.

alerta:
sim.

dashboard:
sim.

logs:
sim.

traces:
sim.

profiling:
quando necessário.

banco:
quando necessário.

concorrência:
quando necessário.

incident response:
sim.

mitigação:
sim.

correção:
sim.

before/after:
sim.

rollback:
sim.

refatoração final:
não.

gabarito:
não.
```

Você deverá trabalhar sobre a baseline aprovada nas aulas 601, 602 e 603.

Também deverá usar os critérios revisados nas aulas 604 e 605.

A prova não autoriza:

- apagar histórico para esconder falha;
- editar relatório depois do resultado sem registrar;
- alterar workload para melhorar comparação;
- excluir requests ruins do SLI;
- remover alertas;
- remover logs essenciais;
- aumentar recursos sem análise;
- criar fila ilimitada;
- usar cache ilimitado;
- versionar raw artifacts;
- inventar evidência.

---

## Objetivo prático

Será criada a área da prova:

```text
assessments/production-practical-exam
├── production-practical-exam-contract.yaml
├── production-practical-exam-rules.yaml
├── production-practical-exam-scenario.yaml
├── production-practical-exam-injects.yaml
├── production-practical-exam-deliverables.yaml
├── production-practical-exam-rubric.yaml
├── production-practical-exam-security-policy.yaml
├── production-practical-exam-data-quality-policy.yaml
├── production-practical-exam-failure-policy.yaml
├── production-practical-exam-evidence.yaml
├── workspace
│   ├── incident-declaration.md
│   ├── incident-timeline.md
│   ├── evidence-index.md
│   ├── hypothesis-log.md
│   ├── diagnosis-report.md
│   ├── mitigation-plan.md
│   ├── change-record.md
│   ├── rollback-plan.md
│   ├── before-after-report.md
│   ├── recovery-report.md
│   ├── incident-closure.md
│   └── refactoring-backlog.md
└── reports
    ├── exam-readiness-report.yaml
    ├── exam-observability-report.yaml
    ├── exam-diagnosis-report.yaml
    ├── exam-mitigation-report.yaml
    ├── exam-correction-report.yaml
    ├── exam-regression-report.yaml
    ├── exam-communication-report.yaml
    └── production-practical-exam-gate-report.yaml
```

Scripts:

```text
scripts/assessments/production-practical-exam
├── validate-production-practical-exam-contract.ps1
├── prepare-production-practical-exam.ps1
├── start-production-practical-exam.ps1
├── reveal-production-practical-inject.ps1
├── collect-exam-observability-snapshot.ps1
├── validate-exam-evidence-index.ps1
├── validate-exam-timeline.ps1
├── validate-exam-diagnosis.ps1
├── validate-exam-mitigation.ps1
├── validate-exam-change-record.ps1
├── validate-exam-before-after.ps1
├── validate-exam-recovery.ps1
├── validate-exam-security.ps1
├── validate-exam-regression.ps1
├── collect-production-practical-exam-evidence.ps1
├── finish-production-practical-exam.ps1
└── verify-production-practical-exam.ps1
```

Ao final, você deverá entregar:

```text
incidente declarado;

timeline;

evidence index;

hipóteses;

diagnóstico;

mitigação;

mudança;

rollback;

before/after;

recovery;

closure;

backlog para refatoração;

gate final.
```

---

## Conceito essencial

### Fato

Informação observada e verificável.

Exemplo:

```text
Hikari pending
permaneceu acima de zero
durante a janela medida.
```

---

### Hipótese

Explicação provisória que ainda precisa ser testada.

Exemplo:

```text
transações longas
podem estar retendo conexões.
```

---

### Causa principal

Fator que explica o comportamento central do incidente dentro do escopo avaliado.

---

### Fator contribuinte

Condição que aumentou impacto, duração ou dificuldade de diagnóstico.

---

### Sintoma

Manifestação observável do problema.

---

### Mitigação

Ação que reduz impacto antes da correção definitiva.

---

### Correção

Mudança que remove ou reduz a causa demonstrada.

---

### Regressão

Piora funcional ou operacional introduzida pela mudança.

---

### Evidência suficiente

Conjunto de sinais independentes e coerentes que sustenta uma conclusão.

---

### Evidência sanitizada

Evidência que preserva valor técnico sem expor dados sensíveis.

---

### Critério de recuperação

Condição observável que comprova retorno controlado à saúde.

---

### Critério de encerramento

Conjunto de requisitos para fechar formalmente o incidente.

---

## Mão na massa guiada

### 1. Validar pré-requisitos

Antes da prova:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part3-baseline.ps1

.\scripts\reviews\production-part-1\verify-production-review-part1.ps1

.\scripts\reviews\production-part-2\verify-production-review-part2.ps1

git status

git diff --check
```

A prova só começa com baseline aprovada.

---

### 2. Criar contrato da prova

Arquivo:

```text
production-practical-exam-contract.yaml
```

Conteúdo:

```yaml
productionPracticalExam:
  required:
    - readiness
    - incident-declaration
    - severity
    - timeline
    - evidence-index
    - hypotheses
    - diagnosis
    - mitigation
    - correction
    - rollback
    - before-after
    - recovery
    - closure
    - security
    - regression

  baseline:
    required

  syntheticData:
    required

  rootCauseWithoutEvidence:
    rejected

  destructiveAction:
    forbidden

  nextLesson:
    code:
      M18.52
```

---

### 3. Criar regras

Arquivo:

```text
production-practical-exam-rules.yaml
```

Conteúdo:

```yaml
rules:
  time:
    bounded:
      required

  work:
    individual:
      required

  evidence:
    fabricated:
      forbidden

  changes:
    onePrimaryChangePerComparison:
      required

  workload:
    preserve:
      required

  rawArtifacts:
    repository:
      forbidden

  communication:
    factual:
      required

  unknown:
    mayBeExplicit:
      true
```

Dizer “ainda não sei” é aceitável quando acompanhado da próxima evidência necessária.

---

### 4. Preparar a prova

Execute:

```powershell
.\scripts\assessments\production-practical-exam\prepare-production-practical-exam.ps1
```

O script deverá:

- validar baseline;
- resetar degradações;
- limpar artefatos temporários;
- preparar fixtures;
- registrar versão;
- registrar ambiente;
- validar capacidade;
- criar diretório temporário;
- gerar seed;
- confirmar zero processos residuais.

---

### 5. Iniciar o cenário

Execute:

```powershell
.\scripts\assessments\production-practical-exam\start-production-practical-exam.ps1
```

O script poderá ativar uma combinação sintética de:

- latência;
- falha;
- contenção;
- saturação;
- erro de configuração;
- problema de query;
- fila;
- timeout;
- workload adversarial.

O aluno não deve abrir o script para descobrir a resposta.

Ele deve usar telemetria e comportamento do sistema.

---

### 6. Declarar o incidente

Preencha:

```text
workspace/incident-declaration.md
```

Campos obrigatórios:

```markdown
# Declaração do incidente

- Horário de detecção:
- Horário de declaração:
- Serviço:
- Ambiente:
- Release:
- Severidade:
- Impacto observado:
- SLO ou fluxo afetado:
- Tendência:
- Risco de dados:
- Risco de segurança:
- Incident commander:
- Technical lead:
- Scribe:
- Próxima atualização:
```

A declaração não exige causa raiz.

---

### 7. Classificar severidade

Use impacto, não emoção.

Considere:

- indisponibilidade;
- taxa de erro;
- latência;
- usuários afetados;
- criticidade;
- duração;
- risco de expansão;
- risco de dados;
- workaround;
- SLO.

Registre justificativa.

---

### 8. Criar timeline

Arquivo:

```text
workspace/incident-timeline.md
```

Formato:

```markdown
| Horário | Tipo | Fato | Papel | Evidência | Resultado |
|---|---|---|---|---|---|
```

Tipos permitidos:

- detecção;
- declaração;
- hipótese;
- coleta;
- decisão;
- ação;
- resultado;
- comunicação;
- recovery;
- closure.

Não reescreva o passado para parecer mais linear.

---

### 9. Criar evidence index

Arquivo:

```text
workspace/evidence-index.md
```

Para cada item:

```markdown
## Evidência E-001

- Categoria:
- Horário:
- Ambiente:
- Release:
- Fonte:
- Método de coleta:
- Pergunta respondida:
- Resultado:
- Limitação:
- Local autorizado:
```

Não inclua raw data no documento quando houver risco.

---

### 10. Coletar snapshot inicial

Execute:

```powershell
.\scripts\assessments\production-practical-exam\collect-exam-observability-snapshot.ps1
```

O snapshot deve incluir categorias:

```text
HTTP rate;

5xx;

p50;

p95;

p99;

readiness;

liveness;

CPU;

heap after GC;

GC time;

Hikari active;

Hikari pending;

pool acquisition;

repository latency;

queue utilization;

oldest event age;

trace status;

release.
```

---

### 11. Abrir dashboards

Ordem sugerida:

```text
overview;

HTTP;

dependencies;

SLO.
```

Registre fatos.

Exemplo de fato:

```text
p99 aumentou
após a entrada
da release atual.
```

Exemplo de conclusão prematura:

```text
a release causou o incidente.
```

Correlação temporal orienta, mas não prova.

---

### 12. Abrir traces

Escolha traces relacionados a:

- falha;
- alta latência;
- operação crítica;
- exemplar;
- release afetada.

Observe:

- span inbound;
- application;
- repository;
- publisher;
- duração;
- erro;
- parent-child;
- atributos;
- ausência de gaps.

---

### 13. Correlacionar logs

Use trace ID somente no backend autorizado.

Confirme:

- operation;
- outcome;
- release;
- request category;
- error category;
- duration;
- dependency;
- contexto.

Não persista o ID no relatório versionado.

---

### 14. Criar hypothesis log

Arquivo:

```text
workspace/hypothesis-log.md
```

Formato:

```markdown
## Hipótese H-001

- Sinal observado:
- Explicação proposta:
- Evidência necessária:
- Experimento seguro:
- Resultado esperado:
- Critério de descarte:
- Estado:
```

Estados:

```text
ABERTA;

CONFIRMADA;

DESCARTADA;

INCONCLUSIVA.
```

---

### 15. Evitar múltiplas mudanças

Durante investigação:

- não altere pool;
- não altere timeout;
- não reinicie;
- não mude query;
- não aumente fila;
- não troque collector;

ao mesmo tempo.

Primeiro, preserve a capacidade de atribuir resultado.

---

### 16. Escolher ferramentas adicionais

Use JFR se houver:

- CPU;
- allocation;
- GC;
- contenção;
- hot method;
- pinning.

Use thread dumps se houver:

- hot thread;
- BLOCKED;
- deadlock;
- progresso parado;
- executor preso.

Use histogramas ou heap dump se houver:

- live set crescente;
- suspeita de retenção;
- OOM;
- owner desconhecido.

Use PostgreSQL diagnostics se houver:

- repository lento;
- pool pending;
- lock wait;
- query duration;
- aquisição lenta.

---

### 17. Preservar segurança

Antes de coletar:

```text
heap dump;

thread dump;

JFR;

SQL;

activity;

profile;
```

valide:

- necessidade;
- autorização;
- espaço;
- duração;
- impacto;
- local de armazenamento;
- descarte posterior.

---

### 18. Produzir diagnóstico

Arquivo:

```text
workspace/diagnosis-report.md
```

Estrutura:

```markdown
# Diagnóstico

## Sintoma principal

## Impacto

## Causa principal demonstrada

## Fatores contribuintes

## Hipóteses descartadas

## Evidências utilizadas

## Limitações

## Risco de recorrência

## Próxima ação recomendada
```

A causa deve apontar para evidências.

---

### 19. Diferenciar causa e consequência

Exemplo:

```text
pool pending:
pode ser consequência
de queries retendo conexões.
```

Outro:

```text
timeout:
pode ser proteção
acionada pela latência,
não a causa.
```

Outro:

```text
CPU alta:
pode ser consequência
de retries e serialização,
não a origem inicial.
```

---

### 20. Criar mitigation plan

Arquivo:

```text
workspace/mitigation-plan.md
```

Campos:

```markdown
# Plano de mitigação

- Impacto a reduzir:
- Ação:
- Owner:
- Evidência:
- Risco:
- Resultado esperado:
- Métrica de validação:
- Tempo de observação:
- Trigger de rollback:
- Dependências:
- Aprovação:
```

Prefira ação reversível.

---

### 21. Exemplos de mitigação permitida

Dependendo da evidência:

- rollback de release;
- feature flag;
- reset de modo lab;
- limitação de concorrência;
- load shedding;
- pause de consumer;
- isolamento de dependência;
- restart controlado;
- scale temporário;
- cancelamento de sessão sintética;
- redução de tráfego de laboratório.

A prova não define antecipadamente qual é a correta.

---

### 22. Registrar mudança

Arquivo:

```text
workspace/change-record.md
```

Campos:

```markdown
# Change record

- Identificador:
- Horário:
- Problema:
- Hipótese:
- Mudança:
- Escopo:
- Owner:
- Aprovação:
- Risco:
- Resultado esperado:
- Rollback:
- Evidência antes:
- Evidência depois:
```

---

### 23. Criar rollback plan

Arquivo:

```text
workspace/rollback-plan.md
```

Inclua:

- versão anterior;
- comando;
- feature flag;
- compatibilidade de schema;
- estado da fila;
- dados já escritos;
- validação posterior;
- trigger objetivo.

Rollback de código não reverte automaticamente efeitos de dados.

---

### 24. Aplicar uma correção primária

A correção deve estar associada à causa demonstrada.

Exemplos de categorias possíveis:

- query;
- índice;
- transação;
- pool;
- timeout;
- lock;
- concorrência;
- fila;
- backpressure;
- serialização;
- logging;
- allocation;
- cache;
- retry;
- context propagation.

Não use uma lista genérica de “boas práticas” como correção.

---

### 25. Preservar contratos

Depois da mudança, confirme:

- API;
- status HTTP;
- payload;
- logs;
- métricas;
- traces;
- health;
- readiness;
- SLI;
- alertas;
- shutdown;
- segurança.

Uma correção de performance não pode quebrar comportamento funcional.

---

### 26. Executar testes

Execute:

```powershell
.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1
```

Depois execute testes específicos do cenário.

Registre:

- testes executados;
- resultado;
- limitações;
- falhas;
- decisão.

---

### 27. Executar carga comparável

Use o mesmo perfil da baseline.

Não altere:

- concorrência;
- duração;
- dataset;
- quota;
- pool;
- versão do PostgreSQL;
- warmup;

sem declarar.

---

### 28. Criar before/after report

Arquivo:

```text
workspace/before-after-report.md
```

Tabela:

```markdown
| Indicador | Antes | Depois | Budget | Resultado |
|---|---:|---:|---:|---|
| Throughput | | | | |
| p50 | | | | |
| p95 | | | | |
| p99 | | | | |
| Error rate | | | | |
| CPU/operação | | | | |
| Allocation/operação | | | | |
| Repository p95 | | | | |
| Pool acquisition p95 | | | | |
| Queue utilization | | | | |
```

Inclua pelo menos três execuções quando aplicável.

---

### 29. Validar SLO

Confirme:

- disponibilidade;
- latência;
- error budget;
- burn rate;
- volume;
- elegibilidade;
- release.

A mudança não é aprovada se apenas melhorar uma métrica técnica e piorar o SLO.

---

### 30. Validar observabilidade

Confirme:

- logs continuam estruturados;
- trace ID aparece no backend de log;
- spans continuam parent-child;
- métricas continuam bounded;
- histogramas continuam disponíveis;
- readiness continua semântica;
- alertas continuam válidos;
- runbook continua navegável.

---

### 31. Validar leaks

Confirme:

- zero task leaks;
- zero connection leaks;
- fila em estado conhecido;
- contexts limpos;
- executors encerráveis;
- datasource saudável;
- modos lab resetáveis.

---

### 32. Revelar inject

Durante a prova, execute quando orientado:

```powershell
.\scripts\assessments\production-practical-exam\reveal-production-practical-inject.ps1
```

Um inject pode introduzir:

- informação nova;
- piora;
- recuperação parcial;
- mudança de severidade;
- necessidade de handoff;
- falha da mitigação;
- risco adicional.

Atualize timeline e decisão.

---

### 33. Comunicar status

Use formato:

```markdown
## Status update

- Severidade:
- Impacto atual:
- Sinais principais:
- Mitigação:
- Resultado:
- Risco:
- Próxima ação:
- Próxima atualização:
```

Não comunique causa como fato antes de confirmá-la.

---

### 34. Validar recovery

Arquivo:

```text
workspace/recovery-report.md
```

Critérios:

- error rate dentro do budget;
- p95 e p99 recuperados;
- readiness estável;
- liveness estável;
- backlog drenando;
- pool pending controlado;
- dependências saudáveis;
- sem novos alertas críticos;
- ausência de perda silenciosa;
- janela de estabilidade concluída.

---

### 35. Encerrar o incidente

Arquivo:

```text
workspace/incident-closure.md
```

Inclua:

- início;
- detecção;
- declaração;
- mitigação;
- recovery;
- encerramento;
- duração;
- impacto;
- causa;
- fatores contribuintes;
- riscos pendentes;
- follow-ups;
- owner;
- decisão de postmortem.

---

### 36. Criar backlog para refatoração

Arquivo:

```text
workspace/refactoring-backlog.md
```

Itens possíveis:

- duplicação;
- acoplamento;
- falta de teste;
- policy inconsistente;
- nome ruim;
- script frágil;
- regra repetida;
- observabilidade dispersa;
- configuração não tipada;
- runbook incompleto.

Não execute a refatoração final nesta aula.

---

### 37. Criar rubrica

Arquivo:

```text
production-practical-exam-rubric.yaml
```

Distribuição:

```yaml
rubric:
  readiness:
    weight:
      5

  declarationAndSeverity:
    weight:
      10

  evidence:
    weight:
      15

  hypothesisAndDiagnosis:
    weight:
      20

  mitigation:
    weight:
      10

  correction:
    weight:
      15

  beforeAfterAndRegression:
    weight:
      15

  communicationAndClosure:
    weight:
      5

  securityAndCleanup:
    weight:
      5
```

Total:

```text
100 pontos.
```

---

### 38. Critérios de desempenho

Faixas:

```text
90 a 100:
domínio excelente.

80 a 89:
domínio consistente.

70 a 79:
aprovado com pontos de reforço.

60 a 69:
resultado insuficiente,
refazer pontos críticos.

abaixo de 60:
reavaliação necessária.
```

Falhas eliminatórias podem impedir aprovação mesmo com pontuação numérica.

---

### 39. Falhas eliminatórias

Exemplos:

- inventar evidência;
- versionar segredo;
- vazar dado pessoal;
- executar ação destrutiva não autorizada;
- esconder erro do SLI;
- alterar workload sem declarar;
- apagar telemetria para melhorar resultado;
- criar fila ilimitada;
- deixar processo residual;
- deixar connection leak;
- declarar causa sem evidência e ignorar sinais contrários;
- entregar solução sem rollback;
- não validar recuperação.

---

### 40. Criar security policy

Arquivo:

```text
production-practical-exam-security-policy.yaml
```

Conteúdo:

```yaml
security:
  syntheticData:
    required

  rawHeapDump:
    repository:
      forbidden

  rawJFR:
    repository:
      forbidden

  rawThreadDump:
    repository:
      forbidden

  SQL:
    rawBusinessValue:
      forbidden

  identifier:
    persistentEvidence:
      forbidden

  credential:
    forbidden

  destructiveAction:
    authorization:
      required
```

---

### 41. Criar data quality policy

Arquivo:

```text
production-practical-exam-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  factWithoutSource:
    result:
      unsupported

  hypothesisPresentedAsFact:
    action:
      deduct

  singleSample:
    result:
      limited

  differentWorkload:
    result:
      invalid-comparison

  missingWindow:
    result:
      invalid-metric

  missingVolume:
    result:
      limited

  mixedChanges:
    result:
      inconclusive
```

---

### 42. Criar failure policy

Arquivo:

```text
production-practical-exam-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  fabricatedEvidence:
    action:
      fail-exam

  sensitiveDataCommitted:
    action:
      fail-exam

  destructiveAction:
    action:
      fail-exam

  zeroRollback:
    action:
      reject-change

  noRecoveryValidation:
    action:
      incomplete

  rawArtifactCommitted:
    action:
      fail-security

  finalRefactoring:
    deferredToLesson607
```

---

### 43. Criar scenario contract

Arquivo:

```text
production-practical-exam-scenario.yaml
```

O contrato deve garantir:

```yaml
scenario:
  service:
    observable-orders-api

  environment:
    lab

  symptoms:
    multiple:
      required

  rootCause:
    notExposedInFile:
      true

  evidence:
    sufficient:
      true

  mitigation:
    reversibleCandidate:
      required

  correction:
    testable:
      required

  recovery:
    observable:
      required
```

---

### 44. Criar injects

Arquivo:

```text
production-practical-exam-injects.yaml
```

O arquivo versionado descreve apenas categorias:

```yaml
injects:
  categories:
    - new-impact-information
    - severity-change
    - mitigation-result
    - dependency-update
    - handoff-request
    - recovery-signal

  hiddenValues:
    generatedAtRuntime:
      true
```

---

### 45. Criar deliverables contract

Arquivo:

```text
production-practical-exam-deliverables.yaml
```

Conteúdo:

```yaml
deliverables:
  required:
    - incident-declaration
    - timeline
    - evidence-index
    - hypothesis-log
    - diagnosis-report
    - mitigation-plan
    - change-record
    - rollback-plan
    - before-after-report
    - recovery-report
    - incident-closure
    - refactoring-backlog
    - sanitized-evidence

  missingCriticalDeliverable:
    result:
      incomplete
```

---

### 46. Executar validação de evidência

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-evidence-index.ps1
```

O script valida:

- IDs locais;
- categorias;
- timestamp;
- fonte;
- pergunta;
- resultado;
- limitação;
- ausência de raw sensitive data.

---

### 47. Executar validação da timeline

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-timeline.ps1
```

Valide:

- ordem;
- timestamps;
- fatos;
- hipóteses rotuladas;
- decisões;
- ações;
- resultados;
- atualizações.

---

### 48. Executar validação do diagnóstico

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-diagnosis.ps1
```

Valide:

- causa;
- evidências;
- fatores;
- hipóteses descartadas;
- limitações;
- coerência com telemetria.

O script não revela a resposta.

---

### 49. Executar validação da mitigação

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-mitigation.ps1
```

Valide:

- impacto alvo;
- ação;
- owner;
- risco;
- resultado esperado;
- métrica;
- rollback;
- autorização.

---

### 50. Executar validação do change record

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-change-record.ps1
```

Confirme uma mudança primária por comparação.

---

### 51. Executar before/after

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-before-after.ps1
```

Valide:

- mesmo workload;
- mesma capacidade;
- warmup;
- duração;
- volume;
- várias execuções;
- budgets;
- regressão;
- observabilidade.

---

### 52. Executar regressão

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-regression.ps1
```

Cobertura:

- funcional;
- API;
- logs;
- métricas;
- traces;
- health;
- SLO;
- alertas;
- concorrência;
- banco;
- shutdown;
- leaks.

---

### 53. Validar segurança

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-security.ps1
```

Procure:

- secrets;
- IDs;
- payloads;
- SQL sensível;
- raw logs;
- dumps;
- JFR;
- profiles;
- contatos.

---

### 54. Finalizar a prova

Execute:

```powershell
.\scripts\assessments\production-practical-exam\finish-production-practical-exam.ps1
```

O script deve:

- resetar injects;
- resetar degradações;
- encerrar carga;
- encerrar processos filhos;
- validar fila;
- validar datasource;
- fechar stack quando apropriado;
- coletar relatórios;
- preservar evidence sanitizada;
- remover temporários.

---

### 55. Verificar prova

Execute:

```powershell
.\scripts\assessments\production-practical-exam\verify-production-practical-exam.ps1
```

Status possíveis:

```text
PASS;

FAIL_READINESS;

FAIL_DECLARATION;

FAIL_EVIDENCE;

FAIL_DIAGNOSIS;

FAIL_MITIGATION;

FAIL_CORRECTION;

FAIL_REGRESSION;

FAIL_RECOVERY;

FAIL_SECURITY;

INCOMPLETE;

INCONCLUSIVE.
```

---

## Entendendo o que foi feito

### A avaliação ganhou cenário integrado

Os sinais deixaram de ser apresentados por tema isolado.

### O diagnóstico ganhou disciplina

Fatos, hipóteses e conclusões passaram a ser separados.

### A evidência ganhou índice

Cada conclusão passou a apontar para uma fonte.

### A mitigação ganhou rollback

A ação emergencial deixou de ser improvisada.

### A correção ganhou comparação

Before/after passou a usar workload equivalente.

### A regressão ganhou escopo operacional

Logs, métricas, traces, health e SLO passaram a ser preservados.

### A comunicação ganhou timeline

Decisões e mudanças ficaram auditáveis.

### A recuperação ganhou critérios

O incidente deixou de fechar no primeiro sinal verde.

### A refatoração ganhou backlog

Melhorias estruturais foram registradas sem antecipar a aula 607.

---

## Erros comuns importantes

### Procurar a causa no script

A prova avalia observabilidade e diagnóstico.

### Alterar várias coisas

A comparação fica inconclusiva.

### Chamar correlação de causa

Release recente não prova defeito.

### Coletar tudo sem pergunta

Custo e risco aumentam.

### Reiniciar imediatamente

A evidência pode desaparecer.

### Aumentar pool ou fila

A pressão pode apenas mudar de lugar.

### Esconder erro do SLI

O resultado deixa de representar usuários.

### Melhorar p50 e ignorar p99

A cauda pode ter piorado.

### Entregar correção sem rollback

A mudança não está operacionalmente pronta.

### Encerrar sem stable window

A recuperação pode ser temporária.

---

## Comandos úteis

### Preparar a prova

```powershell
.\scripts\assessments\production-practical-exam\prepare-production-practical-exam.ps1
```

### Iniciar o cenário

```powershell
.\scripts\assessments\production-practical-exam\start-production-practical-exam.ps1
```

### Coletar snapshot

```powershell
.\scripts\assessments\production-practical-exam\collect-exam-observability-snapshot.ps1
```

### Validar regressão

```powershell
.\scripts\assessments\production-practical-exam\validate-exam-regression.ps1
```

### Verificar resultado

```powershell
.\scripts\assessments\production-practical-exam\verify-production-practical-exam.ps1
```

---

## Exercício guiado

### Parte 1 — Readiness

Valide baseline, ambiente e segurança.

### Parte 2 — Incidente

Declare severidade, papéis e impacto.

### Parte 3 — Evidência

Colete dashboard, trace, log e dependências.

### Parte 4 — Hipóteses

Defina perguntas e critérios de descarte.

### Parte 5 — Diagnóstico

Demonstre causa e fatores contribuintes.

### Parte 6 — Mitigação

Reduza impacto com ação reversível.

### Parte 7 — Correção

Aplique uma mudança primária vinculada à evidência.

### Parte 8 — Before/after

Compare com workload equivalente.

### Parte 9 — Recovery

Valide SLO, backlog, readiness e leaks.

### Parte 10 — Closure

Entregue timeline, fechamento e backlog de refatoração.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 605 e ponte para a aula 607 foram preservadas;
- a baseline das partes 1, 2 e 3 foi validada;
- as revisões 604 e 605 permanecem aprovadas;
- contrato, regras, cenário, injects, deliverables, rubrica e policies foram criados;
- o cenário usa apenas dados sintéticos;
- o incidente foi declarado sem exigir causa raiz;
- severidade foi justificada por impacto;
- papéis e próxima atualização foram definidos;
- timeline diferencia fatos, hipóteses, decisões, ações e resultados;
- evidence index registra fonte, método, pergunta, resultado e limitação;
- dashboards, traces e logs foram correlacionados;
- hipóteses possuem evidência necessária e critério de descarte;
- ferramentas adicionais foram escolhidas conforme a pergunta;
- raw artifacts foram protegidos;
- diagnóstico diferencia sintoma, causa e fator contribuinte;
- mitigação possui owner, risco, resultado, métrica e rollback trigger;
- change record possui aprovação e evidência before/after;
- correção está ligada à causa demonstrada;
- uma mudança primária foi comparada por vez;
- workload, capacidade, warmup e duração foram preservados;
- p50, p95, p99, erros, throughput e recursos foram comparados;
- SLI, SLO, error budget e alertas foram revalidados;
- logs, métricas, traces, health e runbooks foram preservados;
- testes funcionais e operacionais foram executados;
- zero task leaks e zero connection leaks foram validados;
- recovery exige stable window;
- closure registra riscos e follow-ups;
- backlog de refatoração foi criado sem executar a aula 607;
- nenhuma evidência foi inventada;
- nenhum segredo, ID real, payload ou raw artifact foi commitado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/assessments/production-practical-exam `
  scripts/assessments/production-practical-exam `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestIdValue|traceIdValue|spanIdValue|rawJfr|heapDump|threadDump|rawSql|queryParameter|personalPhone|privateEmail|fabricatedEvidence"
```

Commit recomendado:

```powershell
git commit -m "test(m18): executar prova pratica producao"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- `.env`;
- credenciais;
- IDs reais;
- payloads;
- raw logs;
- raw traces;
- raw JFR;
- profiles;
- dumps;
- SQL sensível;
- temporários;
- refatoração final da aula 607.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você executou a prova prática de produção.

Você demonstrou capacidade para:

```text
validar baseline;

declarar incidente;

classificar severidade;

organizar papéis;

registrar timeline;

indexar evidências;

formular hipóteses;

correlacionar sinais;

diagnosticar;

mitigar;

corrigir;

comparar before/after;

validar regressão;

comunicar;

confirmar recovery;

encerrar.
```

A prova não avalia apenas se o serviço voltou.

Ela avalia se você consegue explicar por que voltou, qual mudança produziu o resultado, quais riscos permanecem e como evitar recorrência.

A próxima aula será:

```text
607 - M18.52 - Refatoracao final producao
```

Nela, você irá usar o backlog, os relatórios e as fragilidades reveladas pela prova para executar refatorações finais sem mudar indevidamente o comportamento do projeto.

Nenhuma refatoração final foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei a baseline antes da prova.
- [ ] Declarei e classifiquei o incidente.
- [ ] Registrei timeline e evidências.
- [ ] Diferenciei fatos e hipóteses.
- [ ] Demonstrei a causa com sinais correlacionados.
- [ ] Mitiguei com rollback.
- [ ] Comparei before/after.
- [ ] Validei recovery, leaks e segurança.

---

## Troubleshooting adicional

### O cenário não inicia

Valide baseline, portas, containers, profile lab e temporários.

### Prometheus não coleta

Revise target, actuator e rede local.

### Trace não aparece

Valide collector, OTLP e sampling.

### A hipótese não fecha

Registre como inconclusiva e busque nova evidência.

### Mitigação não funciona

Execute rollback e atualize a timeline.

### Before/after varia muito

Revise warmup, workload, capacidade e gerador.

### Recovery parece parcial

Verifique backlog, p99, readiness e stable window.

### A mudança resolve e quebra logs

A correção não está aprovada.

### O relatório contém IDs

Sanitize antes do commit.

### A atividade começou a refatorar toda a aplicação

Registre no backlog e preserve a aula 607.

---

## Perguntas de revisão

1. Por que validar baseline antes da prova?
2. Qual diferença entre fato e hipótese?
3. Qual diferença entre sintoma e causa?
4. O que é fator contribuinte?
5. Por que criar evidence index?
6. Por que uma única mudança primária?
7. Quando usar JFR?
8. Quando usar thread dump?
9. Quando usar heap dump?
10. Quando usar diagnóstico PostgreSQL?
11. O que uma mitigação precisa registrar?
12. O que um rollback plan precisa considerar?
13. O que deve ser preservado no before/after?
14. Por que revalidar o SLO?
15. O que significa observabilidade preservada?
16. O que comprova recovery?
17. Por que usar stable window?
18. Para que serve o backlog de refatoração?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Garantir comparação e ambiente confiável.
2. Observação comprovada versus explicação provisória.
3. Manifestação versus origem demonstrada.
4. Condição que amplia impacto ou duração.
5. Ligar conclusão a uma fonte.
6. Atribuir corretamente o resultado.
7. CPU, allocation, GC, locks e eventos temporais.
8. Hot threads, estados, contenção e deadlock.
9. Retenção e path to GC root.
10. Pool, waits, statements e planos.
11. Owner, risco, métrica e rollback.
12. Versão, schema, dados, fila e validação.
13. Workload, capacidade, warmup e contratos.
14. Evitar melhora técnica com piora do usuário.
15. Logs, métricas, traces, health e alertas funcionando.
16. Sinais saudáveis, backlog e ausência de alertas.
17. Evitar encerramento por recuperação temporária.
18. Preparar a refatoração final.
19. Refatoração final produção.
20. Refatoração final produção.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 606 - M18.51 - Prova pratica producao

- Executei a avaliação prática do módulo.
- Validei as baselines da API observável e das revisões.
- Preparei o cenário sintético e confirmei zero processos residuais.
- Declarei incidente, severidade, papéis e próxima atualização.
- Registrei timeline e evidence index.
- Diferenciei fatos, hipóteses, causa e fatores contribuintes.
- Correlacionei dashboards, métricas, traces e logs.
- Escolhi profiling, thread dumps, memória ou PostgreSQL conforme a hipótese.
- Produzi diagnóstico sustentado por evidências.
- Criei mitigação com owner, risco, métrica e rollback.
- Registrei change record e rollback plan.
- Apliquei uma mudança primária por comparação.
- Executei before/after com workload equivalente.
- Revalidei funcionalidade, SLO, alertas e observabilidade.
- Validei zero task leaks e zero connection leaks.
- Confirmei recovery com stable window.
- Encerrei o incidente e registrei follow-ups.
- Criei backlog para a refatoração final.
- Mantive raw artifacts e dados sensíveis fora do Git.
- Próxima aula: Refatoração final produção.
```

---

## Referência técnica curta

- Production incident assessment.
- Evidence-driven diagnosis.
- Observability correlation.
- Java Flight Recorder.
- Thread and memory diagnostics.
- PostgreSQL diagnostics.
- Mitigation and rollback.
- Before-and-after validation.
- Operational regression.
- Incident recovery and closure.

Regra final:

```text
a prova prática de produção precisa avaliar processo técnico reproduzível, não adivinhação: a baseline é validada antes do cenário, o incidente é declarado e classificado por impacto, timeline e evidence index separam fatos, hipóteses, decisões e resultados, e dashboards, métricas, traces, logs, profiling, thread dumps, memória e PostgreSQL são usados somente quando respondem a perguntas explícitas; a causa principal precisa ser sustentada por evidências, fatores contribuintes e hipóteses descartadas, mitigação e correção possuem owner, risco, resultado esperado e rollback trigger, uma mudança primária é comparada por vez e before/after preserva workload, capacidade, warmup, duração, funcionalidade, SLO e observabilidade; recovery exige error rate, latência, readiness, backlog, dependências, leaks e stable window saudáveis, closure registra riscos e follow-ups, nenhum segredo ou raw artifact é versionado e toda melhoria estrutural encontrada entra no backlog, pois a refatoração final começa somente na aula 607.
```
