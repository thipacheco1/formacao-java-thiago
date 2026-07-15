# 667 - M19.57 - Revisao arquitetura parte 2

## Apresentação da aula

Na aula 666, você iniciou a revisão crítica da arquitetura de Ordens de Serviço.

A Parte 1 produziu:

- Review Charter;
- Review Inventory;
- Problem Solution Review;
- Capability Boundary Review;
- Data Authority Review;
- API Event Contract Review;
- Consistency Review;
- Security Review;
- Observability Review;
- Resilience Review;
- Deployment Rollout Review;
- ADR Evidence Review;
- Contradiction Catalog;
- Missing Evidence Catalog;
- Risk Reassessment;
- Review Findings;
- Preliminary Decision;
- reports;
- evidence;
- gate da revisão.

O resultado esperado da Parte 1 não era aprovar a arquitetura.

Era tornar visível:

- o que está coerente;
- o que está contraditório;
- o que está incompleto;
- o que está sem evidência;
- o que representa risco residual;
- o que impede avanço;
- o que pode ser corrigido depois;
- o que exige decisão de negócio.

Agora começa a Parte 2.

Nesta etapa, você irá transformar findings em execução.

A pergunta deixa de ser:

```text
onde estão as lacunas?
```

E passa a ser:

```text
qual lacuna corrigir primeiro?

qual é a causa raiz?

qual risco precisa ser reduzido?

qual evidência precisa ser produzida?

qual decisão precisa ser revisada?

qual mudança pode ser adiada?

qual finding exige bloqueio?

qual finding pode ser aceito?

quem deve decidir?

como defender a arquitetura
depois das correções?
```

O erro comum é reagir à revisão com uma lista de tarefas desconectadas:

```text
corrigir cache;

ajustar timeout;

criar runbook;

adicionar teste;

atualizar ADR;

revisar evento.
```

Essa lista trata sintomas.

Uma revisão sênior precisa encontrar causas raiz.

Exemplo:

```text
sintomas:
cache sem tenant;
idempotency sem tenant;
eventos sem tenant confiável;
queries customizadas sem filtro.

causa raiz:
tenant context não é tratado
como boundary obrigatório
em toda a plataforma.
```

Uma correção isolada reduz um problema.

Uma correção arquitetural reduz uma classe inteira de riscos.

A Parte 2 também irá simular uma banca de arquitetura.

Você precisará responder objeções sobre:

- boundaries;
- monólito modular;
- microserviços;
- autoridade de dados;
- consistência;
- mensageria;
- segurança;
- observabilidade;
- custo;
- rollout;
- rollback;
- operação;
- risco residual;
- decisões que ainda não estão fechadas.

O laboratório continuará em:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project
```

Você adicionará:

- Finding Prioritization;
- Root Cause Analysis;
- Correction Plan;
- Evidence Closure Plan;
- Decision Reopen Catalog;
- Risk Acceptance Register;
- Remediation Roadmap;
- Revalidation Matrix;
- Architecture Board Simulation;
- Objection Catalog;
- Defense Rehearsal;
- Final Review Decision;
- Final Review Pack;
- reports, evidence e gate final da revisão.

A próxima aula será:

```text
668 - M19.58 - Prova pratica arquitetura
```

A aula 668 colocará você diante de um caso novo para desenhar, revisar e defender uma arquitetura sob restrições e critérios de avaliação.

Nesta aula, a prova prática não será antecipada.

Regra central:

```text
uma boa revisao
nao termina em findings;

ela termina em
prioridades,
causas raiz,
correcoes,
evidencias,
decisoes
e uma defesa
tecnicamente sustentavel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
665:
Projeto arquitetura OS parte 2.

666:
Revisao arquitetura parte 1.

667:
Revisao arquitetura parte 2.

668:
Prova pratica arquitetura.

669:
Checklist de arquiteto Java.
```

A progressão é:

```text
construir;

auditar;

corrigir e defender;

provar competência;

consolidar critérios.
```

A Parte 2 fecha um ciclo completo:

```text
problema;

desenho;

implementacao;

evidence;

review;

correcao;

revalidacao;

decisao final.
```

Esse ciclo é mais importante que qualquer tecnologia específica.

Ele pode ser aplicado em:

- arquitetura de produto;
- modernização;
- migração;
- arquitetura corporativa;
- revisão de segurança;
- integração;
- plataforma;
- sistemas distribuídos;
- dados;
- operações;
- aquisição técnica;
- incident review.

---

## Objetivo prático

A estrutura será expandida:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1
└── os-architecture-project
    ├── review
    │   ├── FINDING_PRIORITIZATION.md
    │   ├── ROOT_CAUSE_ANALYSIS.md
    │   ├── CORRECTION_PLAN.md
    │   ├── EVIDENCE_CLOSURE_PLAN.md
    │   ├── DECISION_REOPEN_CATALOG.md
    │   ├── RISK_ACCEPTANCE_REGISTER.md
    │   ├── REMEDIATION_ROADMAP.md
    │   ├── REVALIDATION_MATRIX.md
    │   ├── ARCHITECTURE_BOARD_SIMULATION.md
    │   ├── OBJECTION_CATALOG.md
    │   ├── DEFENSE_REHEARSAL.md
    │   ├── FINAL_REVIEW_DECISION.md
    │   ├── FINAL_REVIEW_PACK.md
    │   ├── FINAL_REVIEW_TRADE_OFFS.md
    │   └── FINAL_REVIEW_OPEN_QUESTIONS.md
    ├── contracts
    │   ├── architecture-review-part-two-contract.yaml
    │   ├── prioritization-policy.yaml
    │   ├── root-cause-policy.yaml
    │   ├── correction-policy.yaml
    │   ├── evidence-closure-policy.yaml
    │   ├── decision-reopen-policy.yaml
    │   ├── risk-acceptance-policy.yaml
    │   ├── remediation-roadmap-policy.yaml
    │   ├── revalidation-policy.yaml
    │   ├── board-simulation-policy.yaml
    │   ├── defense-policy.yaml
    │   ├── final-decision-policy.yaml
    │   └── evidence-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/osarchitecture/reviewfinal
    │   │           ├── PrioritizedFinding.java
    │   │           ├── PriorityScore.java
    │   │           ├── RootCause.java
    │   │           ├── CorrectionAction.java
    │   │           ├── EvidenceClosure.java
    │   │           ├── DecisionReopen.java
    │   │           ├── RiskAcceptance.java
    │   │           ├── RevalidationRule.java
    │   │           ├── BoardQuestion.java
    │   │           ├── DefenseAnswer.java
    │   │           ├── FinalReviewDecision.java
    │   │           └── ReviewPartTwoGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/osarchitecture/reviewfinal
    │               ├── FindingPrioritizationTest.java
    │               ├── RootCauseCoverageTest.java
    │               ├── CorrectionOwnershipTest.java
    │               ├── EvidenceClosureTest.java
    │               ├── RiskAcceptanceTest.java
    │               ├── DecisionReopenTest.java
    │               ├── RevalidationCoverageTest.java
    │               ├── DefenseAnswerTest.java
    │               ├── FinalDecisionTest.java
    │               └── ReviewPartTwoGateTest.java
    └── reports
        ├── finding-prioritization-report.yaml
        ├── root-cause-report.yaml
        ├── correction-plan-report.yaml
        ├── evidence-closure-report.yaml
        ├── risk-acceptance-report.yaml
        ├── decision-reopen-report.yaml
        ├── revalidation-report.yaml
        ├── board-simulation-report.yaml
        ├── final-review-decision-report.yaml
        └── architecture-review-final-gate-report.yaml
```

Scripts:

```text
scripts/m19/os-architecture-review-part-two
├── validate-review-part-two-contract.ps1
├── validate-finding-prioritization.ps1
├── validate-root-causes.ps1
├── validate-correction-plan.ps1
├── validate-evidence-closure.ps1
├── validate-decision-reopen.ps1
├── validate-risk-acceptance.ps1
├── validate-remediation-roadmap.ps1
├── validate-revalidation-matrix.ps1
├── validate-board-simulation.ps1
├── validate-defense-rehearsal.ps1
├── validate-final-review-decision.ps1
├── run-architecture-review-part-two-tests.ps1
├── collect-architecture-review-final-evidence.ps1
└── verify-architecture-review-final-gate.ps1
```

---

## Conceito essencial

### Prioridade não é igual a severidade

Severidade mede o impacto do finding.

Prioridade mede quando agir.

Um finding `HIGH` pode precisar ser corrigido depois de um `MEDIUM` se o `MEDIUM` bloquear a evidência necessária para vários itens.

Prioridade considera:

- severidade;
- probabilidade;
- blast radius;
- urgência;
- dependências;
- reversibilidade;
- custo de atraso;
- esforço;
- capacidade do time;
- risco de mudança;
- valor de aprendizado.

### Causa raiz reduz classes de problema

Exemplo:

```text
finding:
cache sem tenant.

correcao local:
adicionar tenant na key.

causa raiz:
nenhuma policy central
define tenant propagation.

correcao arquitetural:
criar Tenant Context Contract;
propagar tenant;
validar em API, cache,
eventos, idempotencia,
queries e testes.
```

A correção arquitetural evita recorrência.

### Evidência fecha claim

Um claim pode ser aceito quando existe evidência suficiente.

Exemplo:

```text
claim:
eventos duplicados
nao geram efeitos duplicados.

evidence:
Inbox table;
unique constraint;
duplicate event test;
replay report;
consumer implementation;
operational metric.
```

Sem evidence, o claim permanece provisório.

### Aceitar risco é uma decisão explícita

Nem todo risco será eliminado.

Risco pode ser:

- mitigado;
- transferido;
- evitado;
- aceito;
- monitorado.

Aceitar exige:

- owner;
- contexto;
- probabilidade;
- impacto;
- justificativa;
- compensating controls;
- prazo;
- review trigger;
- autoridade competente.

### Reabrir ADR é sinal de maturidade

ADR não é dogma.

Uma decisão deve ser reaberta quando:

- premissa mudou;
- volume mudou;
- custo mudou;
- risco mudou;
- tecnologia perdeu suporte;
- novo requisito apareceu;
- evidence invalidou o claim;
- operação mostrou falha;
- boundary amadureceu;
- aquisição alterou o contexto.

---

## Mão na massa guiada

### 1. Criar contrato da Parte 2

Arquivo:

```text
contracts/architecture-review-part-two-contract.yaml
```

Conteúdo:

```yaml
architectureReviewPartTwo:
  required:
    - finding-prioritization
    - root-cause-analysis
    - correction-plan
    - evidence-closure
    - decision-reopen
    - risk-acceptance
    - remediation-roadmap
    - revalidation-matrix
    - board-simulation
    - objection-catalog
    - defense-rehearsal
    - final-review-decision
    - final-review-pack
    - reports
    - evidence
    - gate

  forbidden:
    - priority-without-risk
    - correction-without-owner
    - evidence-closed-by-document-only
    - risk-accepted-without-authority
    - ADR-reopened-without-trigger
    - final-approval-with-blocker
    - defense-by-technology-name
    - practical-exam-deep-dive

  nextLesson:
    code:
      M19.58
```

---

### 2. Criar Finding Prioritization

Arquivo:

```text
review/FINDING_PRIORITIZATION.md
```

Campos:

- finding ID;
- severity;
- probability;
- blast radius;
- urgency;
- dependency score;
- reversibility;
- effort;
- risk of change;
- priority;
- owner;
- target milestone.

Escala:

```text
P0:
corrigir imediatamente;
bloqueia avanço.

P1:
corrigir antes do rollout.

P2:
corrigir em milestone próximo.

P3:
backlog controlado.

P4:
oportunidade.
```

---

### 3. Criar Priority Score

```java
package br.com.formacao.osarchitecture.reviewfinal;

public record PriorityScore(
        int severity,
        int probability,
        int blastRadius,
        int urgency,
        int dependency,
        int reversibility,
        int effort,
        int changeRisk) {

    public int value() {
        int impact =
                severity
                + probability
                + blastRadius
                + urgency
                + dependency
                + reversibility;

        int cost =
                effort
                + changeRisk;

        return impact - cost;
    }
}
```

A fórmula é didática.

A decisão continua exigindo julgamento.

---

### 4. Priorizar blockers

Findings:

```text
F-006:
cross-context write.

F-015:
cache sem tenant.

F-021:
retry sem idempotencia.

F-024:
migration irreversivel.
```

Prioridade inicial:

```text
P0:
F-015;
F-021.

P1:
F-006;
F-024.
```

Justificativa:

- cross-tenant e duplicidade podem causar dano imediato;
- autoridade e migration bloqueiam rollout seguro;
- dependências entre correções precisam ser consideradas.

---

### 5. Criar Root Cause Analysis

Arquivo:

```text
review/ROOT_CAUSE_ANALYSIS.md
```

Técnicas:

```text
Five Whys;

Fault Tree;

Causal Map;

Timeline;

Control Gap Analysis;

Boundary Analysis;

Policy Gap Analysis.
```

Não use uma técnica mecanicamente.

Escolha conforme o finding.

---

### 6. Analisar tenant context

Finding group:

- cache sem tenant;
- event sem tenant confiável;
- idempotency sem tenant;
- query customizada sem filtro;
- logs com tenant bruto.

Causa raiz:

```text
tenant context
foi tratado como campo,
nao como boundary arquitetural.
```

Correção sistêmica:

```text
Tenant Context Contract;

trusted extraction;

propagation;

storage policy;

cache policy;

idempotency policy;

event envelope;

negative tests;

observability policy.
```

---

### 7. Criar Root Cause

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record RootCause(
        String id,
        String statement,
        List<String> relatedFindings,
        List<String> contributingFactors,
        String systemicCorrection,
        String owner) {

    public RootCause {
        relatedFindings =
                List.copyOf(relatedFindings);
        contributingFactors =
                List.copyOf(contributingFactors);
    }
}
```

---

### 8. Criar Correction Plan

Arquivo:

```text
review/CORRECTION_PLAN.md
```

Cada ação possui:

- action ID;
- root cause;
- findings;
- outcome;
- owner;
- contributors;
- changes;
- evidence;
- risk;
- dependency;
- rollback;
- target;
- status.

---

### 9. Corrigir autoridade de Activity

Plano:

```text
Action:
CP-003.

Outcome:
Order Management
e autoridade de Activity state.

Changes:
remove cross-context repository;
create execution event;
apply transition in authority;
create reconciliation;
update C4;
update ADR;
add ArchUnit;
add integration test.

Evidence:
repository scan;
event test;
authority report;
reconciliation report.
```

---

### 10. Corrigir timeout budget

Plano:

```text
Action:
CP-006.

Outcome:
Schedule Activity
cabe no SLO de 3 segundos.

Changes:
Gateway 3 s;
Scheduling 2,2 s;
Capacity 1,5 s;
single bounded retry;
deadline propagation;
no retry after deadline;
fallback to pending state.

Evidence:
load test;
timeout budget test;
trace samples;
SLO report.
```

---

### 11. Criar Correction Action

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record CorrectionAction(
        String id,
        String rootCauseId,
        List<String> findingIds,
        String outcome,
        String owner,
        List<String> changes,
        List<String> requiredEvidence,
        String rollback,
        String targetMilestone) {

    public CorrectionAction {
        findingIds = List.copyOf(findingIds);
        changes = List.copyOf(changes);
        requiredEvidence =
                List.copyOf(requiredEvidence);
    }
}
```

---

### 12. Criar Evidence Closure Plan

Arquivo:

```text
review/EVIDENCE_CLOSURE_PLAN.md
```

Para cada missing evidence:

- claim;
- evidence type;
- producer;
- environment;
- dataset;
- acceptance criteria;
- sanitizer;
- owner;
- target;
- status.

---

### 13. Fechar evidence de idempotência

Plano:

```text
Claim:
duplicate complete request
does not duplicate effects.

Evidence:
concurrent duplicate test;
same-key same-payload test;
same-key different-payload test;
database unique constraint;
outbox count;
transaction count;
notification count.

Acceptance:
one state transition;
one transaction;
one event;
one notification request.
```

---

### 14. Fechar evidence de rollback

Plano:

```text
rehearsal:
deploy new version;
run migration expand;
write new state;
trigger rollback;
start old version;
read data;
replay events;
validate reconciliation.

Acceptance:
no data loss;
old version operates;
new fields preserved;
rollback under target time.
```

---

### 15. Criar Evidence Closure

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record EvidenceClosure(
        String evidenceId,
        String claimId,
        String evidenceType,
        List<String> acceptanceCriteria,
        String producer,
        String owner,
        String status) {

    public EvidenceClosure {
        acceptanceCriteria =
                List.copyOf(acceptanceCriteria);
    }
}
```

---

### 16. Criar Decision Reopen Catalog

Arquivo:

```text
review/DECISION_REOPEN_CATALOG.md
```

ADRs reabertos:

```text
ADR-003:
event propagation.

Trigger:
ordering assumption invalid.

ADR-004:
Integration Gateway.

Trigger:
latency budget exceeded.

ADR-007:
logical database separation.

Trigger:
cross-context writes found.

ADR-008:
asynchronous communication.

Trigger:
critical consumer lag
without recovery.
```

---

### 17. Criar Decision Reopen

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record DecisionReopen(
        String ADRId,
        String trigger,
        List<String> invalidatedAssumptions,
        List<String> newEvidence,
        String owner,
        String decisionDeadline) {

    public DecisionReopen {
        invalidatedAssumptions =
                List.copyOf(invalidatedAssumptions);
        newEvidence = List.copyOf(newEvidence);
    }
}
```

---

### 18. Reabrir ADR de banco lógico

Contexto original:

```text
separacao logica
e suficiente
na fase inicial.
```

Nova evidência:

- dois contexts acessam mesma tabela;
- migration exige coordenação;
- incidentes dependem de locks;
- owners não conseguem deploy independente.

Opções:

```text
manter schema compartilhado
com enforcement forte;

separar schemas;

separar databases;

modular monolith
com ownership interno.
```

A revisão não escolhe por moda.

Ela escolhe pela evidência.

---

### 19. Criar Risk Acceptance Register

Arquivo:

```text
review/RISK_ACCEPTANCE_REGISTER.md
```

Campos:

- risk ID;
- description;
- probability;
- impact;
- residual severity;
- rationale;
- controls;
- owner;
- accepting authority;
- accepted until;
- trigger;
- monitoring;
- status.

---

### 20. Aceitar risco temporário

Exemplo:

```text
risk:
dashboard freshness
pode chegar a 90 segundos.

business impact:
baixo.

control:
source-of-truth view disponível.

monitoring:
projection lag alert.

accepted until:
nova projeção.

authority:
Operations Product Owner.
```

Não aceite risco de cross-tenant ou perda financeira sem autoridade adequada.

---

### 21. Criar Risk Acceptance

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.time.Instant;
import java.util.List;

public record RiskAcceptance(
        String riskId,
        String rationale,
        List<String> compensatingControls,
        String owner,
        String acceptingAuthority,
        Instant acceptedUntil,
        String reviewTrigger) {

    public RiskAcceptance {
        compensatingControls =
                List.copyOf(compensatingControls);

        if (acceptedUntil.isBefore(
                Instant.now())) {
            throw new IllegalArgumentException(
                    "Acceptance already expired");
        }
    }
}
```

---

### 22. Criar Remediation Roadmap

Arquivo:

```text
review/REMEDIATION_ROADMAP.md
```

Ondas:

```text
Wave 0:
freeze unsafe rollout.

Wave 1:
tenant and idempotency blockers.

Wave 2:
authority and consistency.

Wave 3:
rollback and migration.

Wave 4:
SLO, alerts and runbooks.

Wave 5:
ADR, C4 and documentation sync.

Wave 6:
cleanup and revalidation.
```

Cada onda possui:

- outcome;
- findings;
- owners;
- dependencies;
- entry criteria;
- exit criteria;
- rollback;
- evidence.

---

### 23. Proteger capacidade de entrega

Correção arquitetural não pode consumir toda a equipe indefinidamente.

Defina:

- capacity allocation;
- P0 lane;
- P1 milestone;
- operational support;
- feature freeze scope;
- progress metric;
- communication cadence;
- executive decisions.

---

### 24. Criar Revalidation Matrix

Arquivo:

```text
review/REVALIDATION_MATRIX.md
```

Para cada correction action:

- finding;
- test;
- report;
- artifact;
- owner;
- environment;
- acceptance;
- gate;
- reviewer.

Exemplo:

```text
CP-003
-> CrossContextWriteTest
-> Data Authority Report
-> C4 Container
-> ADR-002
-> FF-001
-> reviewer: Domain Architecture.
```

---

### 25. Criar Revalidation Rule

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record RevalidationRule(
        String correctionId,
        List<String> tests,
        List<String> reports,
        List<String> artifacts,
        String acceptanceCriteria,
        String reviewer) {

    public RevalidationRule {
        tests = List.copyOf(tests);
        reports = List.copyOf(reports);
        artifacts = List.copyOf(artifacts);
    }
}
```

---

### 26. Reexecutar fitness functions

Valide:

```text
zero cross-context write;

zero cross-tenant access;

all critical APIs idempotent;

all events owned and versioned;

no forbidden metric labels;

all critical SLOs linked to runbooks;

all migrations rollback-ready;

all accepted ADRs implemented;

no expired exception;

C4 without orphan container.
```

---

### 27. Criar Architecture Board Simulation

Arquivo:

```text
review/ARCHITECTURE_BOARD_SIMULATION.md
```

Participantes fictícios:

```text
Product;

Domain Architecture;

Security;

Data;

Platform;

Operations;

Finance;

Engineering;

Support.
```

Cada participante deve formular perguntas a partir de sua responsabilidade.

---

### 28. Criar Objection Catalog

Arquivo:

```text
review/OBJECTION_CATALOG.md
```

Objeções:

```text
o desenho tem contexts demais;

por que nao monolito modular?

mensageria aumenta complexidade;

separar bancos aumenta custo;

observabilidade está cara;

rollout tem etapas demais;

SLO de 3 segundos e arbitrario;

runbooks nao evitam incidentes;

multi-tenancy deveria ser fisico;

o time nao possui capacidade operacional.
```

---

### 29. Responder objeção sobre microserviços

Resposta ruim:

```text
microservicos escalam melhor.
```

Resposta estruturada:

```text
Decision:
separar Field Execution
como deploy independente.

Context:
workload móvel,
upload de evidências,
risco operacional
e escala diferente.

Alternatives:
modulo no monolito;
servico separado.

Evidence:
load profile;
incident isolation;
team ownership;
deployment frequency.

Trade-off:
mais operacao distribuida.

Limitation:
mais observabilidade
e contract testing.

Review trigger:
se volume ou ownership mudar.
```

---

### 30. Responder objeção sobre monólito modular

Uma resposta madura pode concluir:

```text
Order Management
e Activity Management
permanecem no mesmo deploy
como monolito modular,

mas preservam
boundaries internos,
ports,
schemas logicos
e ArchUnit.
```

Arquitetura não precisa maximizar distribuição.

---

### 31. Criar Board Question

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record BoardQuestion(
        String id,
        String role,
        String question,
        List<String> expectedTopics,
        FindingSeverity criticality) {

    public BoardQuestion {
        expectedTopics =
                List.copyOf(expectedTopics);
    }
}
```

---

### 32. Criar Defense Answer

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record DefenseAnswer(
        String questionId,
        String decision,
        String context,
        List<String> alternatives,
        List<String> evidence,
        List<String> tradeoffs,
        List<String> limitations,
        String reviewTrigger) {

    public DefenseAnswer {
        alternatives = List.copyOf(alternatives);
        evidence = List.copyOf(evidence);
        tradeoffs = List.copyOf(tradeoffs);
        limitations = List.copyOf(limitations);
    }
}
```

---

### 33. Criar Defense Rehearsal

Arquivo:

```text
review/DEFENSE_REHEARSAL.md
```

Roteiro de 20 minutos:

```text
2 min:
problema e objetivos.

3 min:
capabilities e journeys.

3 min:
boundaries e C4.

3 min:
dados e contratos.

3 min:
consistencia e seguranca.

2 min:
observabilidade e operacao.

2 min:
rollout e risco.

2 min:
evidence e open questions.
```

Reserve tempo para perguntas.

---

### 34. Treinar resposta curta

Estrutura de 90 segundos:

```text
decisao;

por que;

alternativas;

evidence;

trade-off;

trigger.
```

Resposta longa sem estrutura parece insegurança.

---

### 35. Treinar incerteza

Exemplo:

```text
a decisao atual
e manter isolamento logico.

a evidencia ainda nao sustenta
separacao fisica.

o trigger e:
conflito de lock,
escala independente
ou requisito contratual.
```

Reconhecer limite aumenta credibilidade.

---

### 36. Treinar objeção legítima

Quando a banca encontrar um problema real:

```text
concordo com o finding.

a arquitetura atual
nao prova rollback
apos a migration.

a decisao deve ficar condicionada
ao rehearsal CP-009.
```

Não defenda um erro por orgulho.

---

### 37. Criar Final Review Pack

Arquivo:

```text
review/FINAL_REVIEW_PACK.md
```

Conteúdo:

- executive summary;
- original decision;
- preliminary decision;
- blockers found;
- root causes;
- corrections;
- evidence closed;
- ADRs reopened;
- risks accepted;
- residual risks;
- remediation roadmap;
- revalidation;
- defense summary;
- final decision;
- open questions.

---

### 38. Criar decisão final

Arquivo:

```text
review/FINAL_REVIEW_DECISION.md
```

Status:

```text
APPROVED;

APPROVED_WITH_CONDITIONS;

REJECTED;

DEFERRED;

INCONCLUSIVE.
```

Exemplo:

```text
Decision:
APPROVED_WITH_CONDITIONS.

Conditions:
complete rollback rehearsal;
close tenant isolation evidence;
remove cross-context write;
publish runbooks;
revalidate SLO.

Deadline:
before production rollout.

Authority:
Architecture Board.
```

---

### 39. Criar Final Review Decision

```java
package br.com.formacao.osarchitecture.reviewfinal;

import java.util.List;

public record FinalReviewDecision(
        String status,
        List<String> closedBlockers,
        List<String> remainingConditions,
        List<String> acceptedRisks,
        List<String> residualRisks,
        String authority,
        String rationale,
        String nextReviewTrigger) {

    public FinalReviewDecision {
        closedBlockers =
                List.copyOf(closedBlockers);
        remainingConditions =
                List.copyOf(remainingConditions);
        acceptedRisks =
                List.copyOf(acceptedRisks);
        residualRisks =
                List.copyOf(residualRisks);
    }
}
```

---

### 40. Proibir aprovação com blocker

Se existir blocker aberto:

```text
APPROVED
```

deve falhar.

Resultado:

```text
FAIL_APPROVAL_WITH_BLOCKER
```

---

### 41. Testar priorização

Cenário:

- finding de documentação recebe P0;
- cross-tenant recebe P2.

Resultado:

```text
FAIL_PRIORITY_RISK_ALIGNMENT
```

---

### 42. Testar causa raiz

Cinco findings semelhantes sem causa raiz.

Resultado:

```text
FAIL_ROOT_CAUSE_COVERAGE
```

---

### 43. Testar correction owner

Ação sem owner.

Resultado:

```text
FAIL_CORRECTION_OWNER
```

---

### 44. Testar evidence closure

Evidence marcada como fechada apenas porque um documento foi atualizado.

Resultado:

```text
FAIL_EVIDENCE_CLOSURE
```

Documento pode ser parte da prova.

Não é prova suficiente para comportamento runtime.

---

### 45. Testar risk acceptance

Risco crítico aceito por owner sem autoridade.

Resultado:

```text
FAIL_RISK_ACCEPTANCE_AUTHORITY
```

---

### 46. Testar ADR reopen

ADR reaberto sem trigger ou nova evidence.

Resultado:

```text
FAIL_DECISION_REOPEN_TRIGGER
```

---

### 47. Testar revalidation

Correction action sem teste ou report.

Resultado:

```text
FAIL_REVALIDATION_COVERAGE
```

---

### 48. Testar resposta de defesa

Resposta usa apenas:

```text
Kafka;
Kubernetes;
microservices.
```

Sem contexto, alternativa, evidence e trade-off.

Resultado:

```text
FAIL_DEFENSE_QUALITY
```

---

### 49. Testar decisão final

Condições:

- blockers fechados;
- HIGH findings com plano;
- risks aceitos;
- evidence suficiente;
- revalidation executada;
- authority definida.

Resultado esperado:

```text
APPROVED_WITH_CONDITIONS
```

---

### 50. Criar reports

Exemplo:

```yaml
architectureReviewFinal:
  findings:
    blocker:
      total:
        3
      closed:
        3
    high:
      total:
        7
      closed:
        5
      conditioned:
        2

  rootCauses:
    total:
      6
    coveragePercent:
      100

  corrections:
    total:
      14
    withOwner:
      14
    revalidated:
      12

  evidence:
    missing:
      11
    closed:
      9
    conditioned:
      2

  risks:
    accepted:
      2
    expiredAcceptance:
      0
    residualCritical:
      0

  decisions:
    reopened:
      3
    resolved:
      2

  finalDecision:
    APPROVED_WITH_CONDITIONS

  gate:
    PASS
```

---

### 51. Criar evidence final da revisão

Arquivo:

```text
contracts/architecture-review-final-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- total blocker findings;
- closed blocker findings;
- total high findings;
- closed high findings;
- conditioned high findings;
- root cause count;
- root cause coverage;
- correction action count;
- correction owner coverage;
- revalidated correction count;
- missing evidence count;
- closed evidence count;
- conditioned evidence count;
- accepted risk count;
- expired risk acceptance count;
- residual critical risk count;
- reopened ADR count;
- resolved reopened ADR count;
- board question count;
- defense answer coverage;
- final decision;
- condition count;
- architecture test status;
- documentation status;
- final review gate status;
- timestamp.

Não inclua:

- nomes reais;
- clientes reais;
- vulnerabilidades exploráveis;
- endpoints privados;
- credenciais;
- incidentes reais;
- decisões confidenciais;
- conteúdo da prova prática da aula 668.

---

### 52. Criar gate final da revisão

O gate valida:

- prioritization;
- root cause coverage;
- correction ownership;
- evidence closure;
- decision reopen;
- risk acceptance;
- remediation roadmap;
- revalidation;
- board simulation;
- defense quality;
- final decision;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_PRIORITY;

FAIL_ROOT_CAUSE;

FAIL_CORRECTION_PLAN;

FAIL_CORRECTION_OWNER;

FAIL_EVIDENCE_CLOSURE;

FAIL_DECISION_REOPEN;

FAIL_RISK_ACCEPTANCE;

FAIL_REMEDIATION_ROADMAP;

FAIL_REVALIDATION;

FAIL_BOARD_SIMULATION;

FAIL_DEFENSE;

FAIL_FINAL_DECISION;

FAIL_APPROVAL_WITH_BLOCKER;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 53. Executar validação completa

```powershell
.\scripts\m19\os-architecture-review-part-two\validate-review-part-two-contract.ps1

.\scripts\m19\os-architecture-review-part-two\validate-finding-prioritization.ps1

.\scripts\m19\os-architecture-review-part-two\validate-root-causes.ps1

.\scripts\m19\os-architecture-review-part-two\validate-correction-plan.ps1

.\scripts\m19\os-architecture-review-part-two\validate-evidence-closure.ps1

.\scripts\m19\os-architecture-review-part-two\validate-decision-reopen.ps1

.\scripts\m19\os-architecture-review-part-two\validate-risk-acceptance.ps1

.\scripts\m19\os-architecture-review-part-two\validate-remediation-roadmap.ps1

.\scripts\m19\os-architecture-review-part-two\validate-revalidation-matrix.ps1

.\scripts\m19\os-architecture-review-part-two\validate-board-simulation.ps1

.\scripts\m19\os-architecture-review-part-two\validate-defense-rehearsal.ps1

.\scripts\m19\os-architecture-review-part-two\validate-final-review-decision.ps1

.\scripts\m19\os-architecture-review-part-two\run-architecture-review-part-two-tests.ps1

.\scripts\m19\os-architecture-review-part-two\collect-architecture-review-final-evidence.ps1

.\scripts\m19\os-architecture-review-part-two\verify-architecture-review-final-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 54. Encerrar a revisão

Confirme:

- findings priorizados;
- causas raiz;
- correction actions;
- owners;
- dependencies;
- evidence closure;
- ADRs reabertos;
- risks aceitos;
- authority;
- remediation roadmap;
- revalidation matrix;
- fitness functions reexecutadas;
- board simulation;
- objection catalog;
- defense rehearsal;
- final review pack;
- final decision;
- reports;
- evidence;
- gate aprovado.

---

## Entendendo o que foi feito

### Findings viraram prioridades

Você deixou de tratar todos os problemas como equivalentes.

A prioridade passou a considerar risco, dependência, urgência, reversibilidade, esforço e capacidade.

### Sintomas viraram causas raiz

Problemas repetidos foram agrupados em falhas sistêmicas de policy, boundary, ownership ou operação.

### Correções ganharam outcome

Cada ação passou a ter owner, mudanças, evidências, rollback, milestone e critério de aceitação.

### Evidência ganhou fechamento real

Atualizar um documento deixou de ser suficiente para provar comportamento.

Testes, reports, rehearsals e runtime evidence passaram a sustentar claims.

### ADRs puderam ser reabertos

Premissas inválidas foram tratadas como trigger legítimo de revisão.

### Riscos passaram a ser aceitos conscientemente

Risco aceito ganhou autoridade, prazo, controles e monitoring.

### A defesa ganhou estrutura

Decisão, contexto, alternativas, evidence, trade-offs, limitações e triggers passaram a orientar respostas.

### A decisão final ganhou condições explícitas

A arquitetura pôde ser aprovada, condicionada, rejeitada ou adiada de forma rastreável.

---

## Erros comuns importantes

### Priorizar apenas por severidade

Dependências e urgência também importam.

### Corrigir sintomas

O problema reaparece em outro ponto.

### Fechar evidence com documento

Comportamento precisa de prova executável ou operacional.

### Reabrir ADR por preferência

É necessário trigger e nova evidence.

### Aceitar risco sem autoridade

O owner técnico pode não possuir poder para aceitar impacto financeiro, regulatório ou de segurança.

### Criar roadmap sem capacity

A correção nunca termina.

### Aprovar com blocker aberto

A decisão perde credibilidade.

### Defender tecnologia em vez de decisão

Nome de ferramenta não responde contexto e trade-off.

### Esconder incerteza

A banca percebe inconsistência.

### Reagir defensivamente

Uma objeção válida deve melhorar a arquitetura.

### Antecipar a prova

A aula 668 será um caso novo.

---

## Comandos úteis

### Validar priorização

```powershell
.\scripts\m19\os-architecture-review-part-two\validate-finding-prioritization.ps1
```

### Validar causas raiz

```powershell
.\scripts\m19\os-architecture-review-part-two\validate-root-causes.ps1
```

### Validar correções

```powershell
.\scripts\m19\os-architecture-review-part-two\validate-correction-plan.ps1
```

### Validar evidence

```powershell
.\scripts\m19\os-architecture-review-part-two\validate-evidence-closure.ps1
```

### Executar testes

```powershell
.\scripts\m19\os-architecture-review-part-two\run-architecture-review-part-two-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\os-architecture-review-part-two\verify-architecture-review-final-gate.ps1
```

---

## Exercício guiado

Considere três findings:

```text
F-015:
cache sem tenant.

F-021:
retry sem idempotencia.

F-024:
migration irreversivel.
```

Crie:

1. prioridade;
2. causa raiz;
3. correction actions;
4. owners;
5. dependencies;
6. evidence;
7. rollback;
8. risk acceptance, se aplicável;
9. revalidation;
10. board questions;
11. defense answers;
12. final decision.

A decisão não pode ser `APPROVED` enquanto existir blocker aberto.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 666 e ponte para a aula 668 foram preservadas;
- contrato da Parte 2 foi criado;
- Finding Prioritization foi criado;
- prioridade foi diferenciada de severidade;
- prioridade considera risco, dependência, urgência, reversibilidade e esforço;
- Priority Score foi criado;
- blockers foram priorizados;
- Root Cause Analysis foi criado;
- findings relacionados foram agrupados;
- tenant context foi tratado como boundary;
- Root Cause foi criado;
- Correction Plan foi criado;
- actions possuem outcome, owner, changes, evidence e rollback;
- autoridade de Activity foi corrigida;
- timeout budget foi corrigido;
- Correction Action foi criado;
- Evidence Closure Plan foi criado;
- idempotência foi comprovada;
- rollback rehearsal foi definido;
- Evidence Closure foi criado;
- Decision Reopen Catalog foi criado;
- ADRs foram reabertos somente com trigger;
- banco lógico foi reavaliado;
- Risk Acceptance Register foi criado;
- risk acceptance possui authority, prazo e control;
- risco temporário foi modelado;
- Risk Acceptance foi criado;
- Remediation Roadmap foi criado;
- ondas possuem entry e exit criteria;
- capacidade de entrega foi protegida;
- Revalidation Matrix foi criada;
- corrections possuem testes, reports e reviewers;
- fitness functions foram reexecutadas;
- Architecture Board Simulation foi criada;
- Objection Catalog foi criado;
- respostas estruturadas foram praticadas;
- monólito modular foi considerado;
- Board Question foi criado;
- Defense Answer foi criado;
- Defense Rehearsal foi criado;
- resposta curta foi treinada;
- incerteza foi comunicada;
- objeção legítima foi aceita;
- Final Review Pack foi criado;
- Final Review Decision foi criado;
- aprovação com blocker foi proibida;
- testes de priority, root cause, owner, evidence, risk, ADR, revalidation, defense e decisão foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- a prova prática não foi antecipada.

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
  labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project/review `
  labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project/contracts `
  labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project/reports `
  scripts/m19/os-architecture-review-part-two `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|realProvider|privateEndpoint|realIncident|productionTopology"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): concluir revisao de arquitetura de OS"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- pessoas reais;
- clientes reais;
- vulnerabilidades exploráveis;
- endpoints privados;
- credenciais;
- dados pessoais;
- topologia real;
- conteúdo da prova prática da aula 668.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu a revisão arquitetural do projeto de Ordens de Serviço.

Você criou:

```text
Finding Prioritization;

Root Cause Analysis;

Correction Plan;

Evidence Closure Plan;

Decision Reopen Catalog;

Risk Acceptance Register;

Remediation Roadmap;

Revalidation Matrix;

Architecture Board Simulation;

Objection Catalog;

Defense Rehearsal;

Final Review Decision;

Final Review Pack;

reports, evidence e gate.
```

Você transformou findings em prioridades.

Você agrupou sintomas por causas raiz.

Você criou correções com owner, outcome, evidence, rollback e milestone.

Você reabriu ADRs quando premissas foram invalidadas.

Você aceitou riscos apenas com autoridade, prazo e controles.

Você revalidou fitness functions, contratos, segurança, rollout e operação.

Você praticou respostas de defesa baseadas em contexto, alternativas, evidências, trade-offs, limitações e triggers.

Você também aprendeu que uma arquitetura pode ser `APPROVED_WITH_CONDITIONS` sem fingir que todas as incertezas foram eliminadas.

A próxima aula será:

```text
668 - M19.58 - Prova pratica arquitetura
```

Nela, você receberá um caso novo e precisará produzir uma solução arquitetural sob tempo, restrições, riscos e critérios de avaliação.

Nenhum conteúdo completo da prova prática foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Priorizei findings.
- [ ] Identifiquei causas raiz.
- [ ] Criei correction actions.
- [ ] Fechei evidências.
- [ ] Reabri ADRs quando necessário.
- [ ] Registrei riscos aceitos.
- [ ] Criei remediation roadmap.
- [ ] Revalidei correções.
- [ ] Simulei banca.
- [ ] Respondi objeções.
- [ ] Criei decisão final.
- [ ] Executei o gate.

---

## Troubleshooting adicional

### Tudo virou P0

Revise risco, urgência e dependências.

### As ações corrigem apenas sintomas

Agrupe findings e procure policy ou boundary ausente.

### Evidence não pode ser produzida

Classifique o claim como hipótese ou altere a decisão.

### O ADR reaberto não possui nova informação

Não reabra por preferência.

### O risco não tem authority para aceitar

Escalone.

### O roadmap não cabe na capacidade

Reduza escopo, crie ondas e proteja P0/P1.

### A banca rejeita uma decisão

Verifique se a objeção revela um gap real.

### A resposta fica muito longa

Use decisão, contexto, evidence, trade-off e trigger.

### A arquitetura continua com condições

Isso pode ser aceitável quando não existem blockers e os riscos estão controlados.

### A decisão final diverge dos reports

Registre contradição e bloqueie o gate.

### A equipe quer fazer a prova agora

Preserve o caso novo para a aula 668.

---

## Perguntas de revisão

1. Qual diferença entre severidade e prioridade?
2. O que uma prioridade considera?
3. O que é causa raiz?
4. Por que agrupar findings?
5. O que uma correction action precisa conter?
6. O que fecha uma evidence?
7. Documento sozinho prova runtime?
8. Quando reabrir ADR?
9. O que é risk acceptance?
10. Quem pode aceitar risco?
11. Por que risk acceptance expira?
12. O que é remediation roadmap?
13. O que é revalidation matrix?
14. Por que reexecutar fitness functions?
15. O que é Architecture Board Simulation?
16. Como responder objeção?
17. Qual estrutura de uma defesa?
18. Como comunicar incerteza?
19. O que fazer diante de objeção válida?
20. O que é Final Review Pack?
21. Quais decisões finais existem?
22. Pode aprovar com blocker?
23. O que significa approved with conditions?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Impacto versus ordem de execução.
2. Risco, urgência, dependência, reversibilidade e esforço.
3. Condição sistêmica que produz findings.
4. Para corrigir classes de problema.
5. Outcome, owner, changes, evidence, rollback e target.
6. Teste, report ou prova operacional aceita.
7. Não.
8. Quando premissa ou evidence muda.
9. Decisão explícita de manter risco residual.
10. Autoridade compatível com o impacto.
11. Para exigir revisão.
12. Ondas de correção.
13. Ligação entre correction, tests, reports e acceptance.
14. Para provar que a propriedade foi restaurada.
15. Simulação de banca multidisciplinar.
16. Com decisão, contexto, alternativas e evidence.
17. Decisão, contexto, alternativas, evidence, trade-off, limitação e trigger.
18. Declarando limite e trigger.
19. Incorporar ao plano.
20. Pacote final da revisão.
21. Approved, conditioned, rejected, deferred ou inconclusive.
22. Não.
23. Aprovação dependente de condições explícitas.
24. Prova prática arquitetura.
25. Prova prática arquitetura.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 667 - M19.57 - Revisao arquitetura parte 2

- Continuei após Revisão arquitetura parte 1.
- Criei o contrato da Parte 2.
- Diferenciei severidade e prioridade.
- Criei Finding Prioritization.
- Modelei Priority Score.
- Priorizei blockers.
- Criei Root Cause Analysis.
- Agrupei findings por causa raiz.
- Tratei tenant context como boundary.
- Criei Root Cause.
- Criei Correction Plan.
- Corrigi autoridade de Activity.
- Corrigi timeout budget.
- Criei Correction Action.
- Criei Evidence Closure Plan.
- Fechei evidence de idempotência.
- Planejei rollback rehearsal.
- Criei Evidence Closure.
- Criei Decision Reopen Catalog.
- Reabri ADRs somente com trigger e nova evidence.
- Reavaliei separação lógica de banco.
- Criei Risk Acceptance Register.
- Modelei aceitação temporária de risco.
- Criei Risk Acceptance.
- Criei Remediation Roadmap.
- Organizei correções em ondas.
- Protegi capacidade de entrega.
- Criei Revalidation Matrix.
- Criei Revalidation Rule.
- Reexecutei fitness functions.
- Criei Architecture Board Simulation.
- Criei Objection Catalog.
- Pratiquei respostas estruturadas.
- Considerei monólito modular.
- Criei Board Question.
- Criei Defense Answer.
- Criei Defense Rehearsal.
- Treinei resposta curta.
- Comuniquei incerteza.
- Aceitei objeções legítimas.
- Criei Final Review Pack.
- Criei Final Review Decision.
- Proibi aprovação com blocker.
- Executei testes finais da revisão.
- Criei reports, evidence e gate.
- Não antecipei a prova prática.
- Próxima aula: Prova pratica arquitetura.
```

---

## Referência técnica curta

- Finding Prioritization.
- Priority Score.
- Root Cause Analysis.
- Correction Plan.
- Evidence Closure.
- Decision Reopen.
- Risk Acceptance.
- Remediation Roadmap.
- Revalidation Matrix.
- Architecture Board.
- Objection Catalog.
- Defense Rehearsal.
- Final Review Decision.
- Approved with Conditions.

Regra final:

```text
A segunda parte da revisão arquitetural deve transformar findings em prioridades, causas raiz, correções, evidências e decisão final: prioridade considera severidade, probabilidade, blast radius, urgência, dependências, reversibilidade, esforço e risco de mudança, findings relacionados são agrupados em falhas sistêmicas de boundary, policy, ownership ou operação, e correction actions possuem outcome, owner, changes, evidence, rollback, milestone e acceptance; claims só são fechados por testes, reports, rehearsals ou provas operacionais adequadas, ADRs são reabertos quando triggers ou novas evidências invalidam premissas, riscos residuais são aceitos apenas por autoridade compatível, com controles, monitoring, prazo e revisão, e o remediation roadmap organiza ondas, capacidade e gates; a Revalidation Matrix conecta cada correção a testes, reports, artifacts, fitness functions e reviewers, a banca simulada questiona boundaries, monólito modular, microserviços, dados, consistência, mensageria, segurança, observabilidade, custo, rollout e operação, e respostas usam decisão, contexto, alternativas, evidence, trade-offs, limitações e triggers; a decisão final pode ser approved, approved with conditions, rejected, deferred ou inconclusive, nunca approved com blocker aberto, e o gate termina com prioritization, root cause, correction, evidence closure, decision reopen, risk acceptance, roadmap, revalidation, board simulation, defense, reports e evidence aprovados, enquanto o caso novo da prova prática permanece reservado para a aula 668.
```
