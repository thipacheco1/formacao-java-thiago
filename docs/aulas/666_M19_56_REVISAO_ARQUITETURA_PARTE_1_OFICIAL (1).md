# 666 - M19.56 - Revisao arquitetura parte 1

## Apresentação da aula

Na aula 665, você concluiu o projeto de arquitetura de Ordens de Serviço.

A solução passou a reunir:

- capacidades;
- jornadas;
- bounded contexts;
- C4;
- autoridade de dados;
- APIs;
- eventos;
- schemas;
- consistência;
- idempotência;
- Saga;
- Outbox;
- Inbox;
- segurança;
- multi-tenancy;
- observabilidade;
- resiliência;
- deployment;
- rollout;
- rollback;
- runbooks;
- fitness functions;
- ArchUnit;
- ADRs;
- claims;
- evidências;
- gate final.

Concluir um projeto, porém, não significa que a arquitetura está pronta para ser aceita.

Significa apenas que existe uma proposta suficientemente completa para ser revisada.

A revisão arquitetural começa quando o time pergunta:

```text
as decisões são coerentes entre si?

o desenho resolve o problema original?

as evidências sustentam os claims?

os boundaries possuem responsabilidade real?

os dados possuem autoridade inequívoca?

os contratos refletem a operação?

os riscos críticos foram realmente tratados?

o rollout funciona com o sistema antigo?

a documentação representa a arquitetura real?

o gate mede propriedades relevantes
ou apenas a presença de arquivos?
```

Arquiteturas frágeis raramente falham por ausência total de documentação.

Elas falham porque documentos isolados contam histórias diferentes.

Exemplos:

- o C4 mostra um serviço que não possui owner;
- o ADR aceita mensageria, mas não define ordering;
- o evento possui schema, mas não possui consumer conhecido;
- a matriz de dados define uma autoridade, mas o código permite outro writer;
- o SLO promete três segundos, mas a soma dos timeouts alcança oito;
- o rollout prevê rollback, mas o schema novo é irreversível;
- o runbook exige uma permissão que o operador não possui;
- a feature flag desativa o tráfego, mas não interrompe o worker;
- a arquitetura declara isolamento de tenant, mas o cache não inclui tenant;
- a fitness function existe, mas não executa no pipeline.

A revisão da Parte 1 será uma auditoria de coerência.

O laboratório continuará em:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project
```

Você adicionará:

- Review Charter;
- Architecture Review Inventory;
- Problem-to-Solution Review;
- Capability and Boundary Review;
- Data Authority Review;
- Contract Review;
- Consistency Review;
- Security Review;
- Observability Review;
- Resilience Review;
- Deployment and Rollout Review;
- ADR and Evidence Review;
- Contradiction Catalog;
- Missing Evidence Catalog;
- Risk Reassessment;
- Review Findings;
- reports, evidence e gate da Parte 1.

A próxima aula será:

```text
667 - M19.57 - Revisao arquitetura parte 2
```

A Parte 2 transformará findings em plano de correção, priorizará riscos, simulará a banca de arquitetura, revisará a defesa técnica e encerrará a revisão com decisão final.

Nesta aula, você não corrigirá toda a arquitetura.

Primeiro, irá provar onde estão as lacunas.

Regra central:

```text
revisar arquitetura
nao e procurar
se todos os documentos existem;

e verificar
se problema,
decisoes,
codigo,
dados,
operacao
e evidencias

contam a mesma historia.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
664:
Projeto arquitetura OS parte 1.

665:
Projeto arquitetura OS parte 2.

666:
Revisao arquitetura parte 1.

667:
Revisao arquitetura parte 2.

668:
Prova pratica arquitetura.
```

A progressão é:

```text
descobrir;

desenhar;

completar;

auditar;

corrigir e defender;

provar competência.
```

A revisão será aplicada ao projeto de OS, mas o método serve para:

- monólitos;
- microserviços;
- plataformas;
- sistemas legados;
- integrações;
- migrações;
- arquiteturas corporativas;
- decisões de build versus buy;
- projetos de modernização;
- novos produtos.

A arquitetura será analisada em quatro camadas:

```text
intenção:
problema, objetivos e constraints.

desenho:
boundaries, dados, contratos e decisões.

execução:
código, deploy, rollout e operação.

evidência:
testes, reports, métricas e resultados.
```

Uma arquitetura consistente precisa conectar as quatro.

---

## Objetivo prático

A estrutura será expandida:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1
└── os-architecture-project
    ├── review
    │   ├── REVIEW_CHARTER.md
    │   ├── REVIEW_INVENTORY.md
    │   ├── PROBLEM_SOLUTION_REVIEW.md
    │   ├── CAPABILITY_BOUNDARY_REVIEW.md
    │   ├── DATA_AUTHORITY_REVIEW.md
    │   ├── API_EVENT_CONTRACT_REVIEW.md
    │   ├── CONSISTENCY_REVIEW.md
    │   ├── SECURITY_REVIEW.md
    │   ├── OBSERVABILITY_REVIEW.md
    │   ├── RESILIENCE_REVIEW.md
    │   ├── DEPLOYMENT_ROLLOUT_REVIEW.md
    │   ├── ADR_EVIDENCE_REVIEW.md
    │   ├── CONTRADICTION_CATALOG.md
    │   ├── MISSING_EVIDENCE_CATALOG.md
    │   ├── RISK_REASSESSMENT.md
    │   ├── REVIEW_FINDINGS.md
    │   ├── REVIEW_PART_ONE_DECISION.md
    │   └── OPEN_REVIEW_QUESTIONS.md
    ├── contracts
    │   ├── architecture-review-part-one-contract.yaml
    │   ├── problem-solution-review-policy.yaml
    │   ├── boundary-review-policy.yaml
    │   ├── data-authority-review-policy.yaml
    │   ├── contract-review-policy.yaml
    │   ├── consistency-review-policy.yaml
    │   ├── security-review-policy.yaml
    │   ├── observability-review-policy.yaml
    │   ├── resilience-review-policy.yaml
    │   ├── rollout-review-policy.yaml
    │   ├── ADR-evidence-review-policy.yaml
    │   ├── contradiction-policy.yaml
    │   ├── finding-policy.yaml
    │   └── evidence-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/osarchitecture/review
    │   │           ├── ReviewArea.java
    │   │           ├── ReviewQuestion.java
    │   │           ├── ReviewFinding.java
    │   │           ├── FindingSeverity.java
    │   │           ├── FindingType.java
    │   │           ├── Contradiction.java
    │   │           ├── MissingEvidence.java
    │   │           ├── ReviewDecision.java
    │   │           └── ReviewPartOneGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/osarchitecture/review
    │               ├── ProblemSolutionCoherenceTest.java
    │               ├── BoundaryResponsibilityTest.java
    │               ├── DataAuthorityConsistencyTest.java
    │               ├── ContractCompletenessTest.java
    │               ├── TimeoutBudgetCoherenceTest.java
    │               ├── SecurityControlCoverageTest.java
    │               ├── SloRunbookTraceabilityTest.java
    │               ├── RollbackFeasibilityTest.java
    │               ├── AdrEvidenceCoverageTest.java
    │               └── ReviewPartOneGateTest.java
    └── reports
        ├── review-inventory-report.yaml
        ├── contradiction-report.yaml
        ├── missing-evidence-report.yaml
        ├── risk-reassessment-report.yaml
        ├── review-finding-report.yaml
        ├── review-architecture-report.yaml
        └── architecture-review-part-one-gate-report.yaml
```

Scripts:

```text
scripts/m19/os-architecture-review-part-one
├── validate-review-contract.ps1
├── validate-review-inventory.ps1
├── validate-problem-solution-coherence.ps1
├── validate-boundary-review.ps1
├── validate-data-authority-review.ps1
├── validate-contract-review.ps1
├── validate-consistency-review.ps1
├── validate-security-review.ps1
├── validate-observability-review.ps1
├── validate-resilience-review.ps1
├── validate-rollout-review.ps1
├── validate-ADR-evidence-review.ps1
├── run-architecture-review-part-one-tests.ps1
├── collect-architecture-review-part-one-evidence.ps1
└── verify-architecture-review-part-one-gate.ps1
```

---

## Conceito essencial

### Revisão arquitetural não é checklist de conformidade

Checklist ajuda a lembrar perguntas.

Mas uma revisão real precisa interpretar relações.

Exemplo:

```text
o checklist diz:
SLO existe.

a revisao pergunta:
o SLO mede a jornada certa?
a query inclui os casos elegiveis?
os timeouts cabem no budget?
o alerta aponta o runbook?
o rollout usa o mesmo SLO?
```

A presença do artefato não prova qualidade.

### Coerência é mais importante que quantidade

Um projeto com dez documentos coerentes pode ser mais forte que outro com cem documentos contraditórios.

Coerência significa:

- objetivo compatível com solução;
- boundary compatível com responsibility;
- contrato compatível com authority;
- timeout compatível com SLO;
- rollout compatível com schema;
- ADR compatível com implementação;
- claim compatível com evidence;
- runbook compatível com operação;
- guardrail compatível com pipeline.


### Revisão precisa considerar contexto temporal

Uma decisão pode ter sido correta quando foi tomada e inadequada depois de mudanças de volume, equipe, contrato, legislação, fornecedor ou operação.

Por isso, a revisão também pergunta:

- qual contexto existia na data da decisão;
- quais premissas mudaram;
- quais métricas invalidaram o desenho;
- quais riscos aumentaram;
- quais dependências perderam suporte;
- quais exceções se tornaram permanentes;
- quais triggers de revisão foram ignorados.

O objetivo não é julgar o passado com informações novas.

O objetivo é verificar se a arquitetura possui mecanismos para reconhecer quando uma decisão deixou de servir ao cenário atual.

### Finding precisa ser verificável

Finding ruim:

```text
a arquitetura esta complexa.
```

Finding bom:

```text
F-017
Severity:
HIGH.

Area:
Consistency.

Observation:
Scheduling e Order Management
podem alterar Activity.scheduleStatus.

Evidence:
Data Authority Matrix;
API Contract Catalog;
repository package scan.

Risk:
conflicting transitions
and reconciliation ambiguity.

Required action:
define single authority
and remove cross-context write.
```

### Contradição é diferente de ausência

Ausência:

```text
não existe runbook
para Outbox lag.
```

Contradição:

```text
o runbook diz
que o worker pode ser reiniciado;

a deployment policy
diz que reinício durante replay
é proibido.
```

Contradições costumam gerar decisões erradas em incidentes.

### Risco residual precisa ser reavaliado

Uma mitigação documentada pode não reduzir o risco como esperado.

Exemplo:

```text
risco:
cross-tenant access.

mitigacao declarada:
tenant_id em todas as tabelas.

problema:
queries customizadas
nao possuem enforcement automatico.
```

O risco residual continua alto.

---

## Mão na massa guiada

### 1. Criar Review Charter

Arquivo:

```text
review/REVIEW_CHARTER.md
```

Conteúdo:

```markdown
# Architecture Review Charter

Contexto

Projeto de arquitetura
de Ordens de Servico.

Objetivo

Verificar coerencia
entre problema,
boundaries,
dados,
contratos,
seguranca,
operacao
e evidence.

Escopo da Parte 1

- inventario;
- contradicoes;
- lacunas;
- riscos;
- findings;
- decisao preliminar.

Principios

- evidence before opinion;
- review the system, not the author;
- contradiction is a finding;
- missing evidence is visible;
- risk determines severity;
- no silent acceptance;
- corrections belong to part two.
```

---

### 2. Criar contrato da revisão

Arquivo:

```text
contracts/architecture-review-part-one-contract.yaml
```

Conteúdo:

```yaml
architectureReviewPartOne:
  required:
    - review-charter
    - inventory
    - problem-solution-review
    - capability-boundary-review
    - data-authority-review
    - API-event-contract-review
    - consistency-review
    - security-review
    - observability-review
    - resilience-review
    - deployment-rollout-review
    - ADR-evidence-review
    - contradiction-catalog
    - missing-evidence-catalog
    - risk-reassessment
    - findings
    - preliminary-decision
    - reports
    - evidence
    - gate

  forbidden:
    - personal-criticism
    - finding-without-evidence
    - severity-without-risk
    - silent-contradiction
    - architecture-approved-by-document-count
    - correction-plan-deep-dive
    - final-defense-deep-dive

  nextLesson:
    code:
      M19.57
```

---

### 3. Criar Review Inventory

Arquivo:

```text
review/REVIEW_INVENTORY.md
```

Inventarie:

```text
charters;

scope;

journeys;

capabilities;

domain map;

bounded contexts;

C4;

APIs;

events;

data authority;

consistency matrix;

security architecture;

observability architecture;

resilience policy;

deployment model;

rollout;

runbooks;

fitness functions;

ADRs;

claims;

reports;

evidence.
```

Para cada item:

- path;
- owner;
- status;
- version;
- last validation;
- links;
- freshness;
- consumers.

---

### 4. Criar área de revisão

```java
package br.com.formacao.osarchitecture.review;

public enum ReviewArea {
    PROBLEM_AND_SCOPE,
    CAPABILITY_AND_BOUNDARY,
    DATA_AUTHORITY,
    CONTRACTS,
    CONSISTENCY,
    SECURITY,
    OBSERVABILITY,
    RESILIENCE,
    DEPLOYMENT_AND_ROLLOUT,
    ADR_AND_EVIDENCE
}
```

---

### 5. Criar Review Finding

```java
package br.com.formacao.osarchitecture.review;

import java.util.List;
import java.util.Objects;

public record ReviewFinding(
        String id,
        ReviewArea area,
        FindingType type,
        FindingSeverity severity,
        String observation,
        List<String> evidence,
        String risk,
        String requiredAction,
        String owner) {

    public ReviewFinding {
        Objects.requireNonNull(id);
        Objects.requireNonNull(area);
        Objects.requireNonNull(type);
        Objects.requireNonNull(severity);
        Objects.requireNonNull(observation);
        evidence = List.copyOf(evidence);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(requiredAction);
        Objects.requireNonNull(owner);

        if (evidence.isEmpty()) {
            throw new IllegalArgumentException(
                    "Finding requires evidence");
        }
    }
}
```

---

### 6. Definir severidade

```text
BLOCKER:
risco inaceitável;
impede avanço.

HIGH:
risco significativo;
precisa de correção antes do rollout.

MEDIUM:
reduz qualidade;
pode entrar em plano controlado.

LOW:
melhoria desejável.

INFO:
observação ou oportunidade.
```

Severidade depende de risco, não de preferência.

---

### 7. Revisar problema e solução

Arquivo:

```text
review/PROBLEM_SOLUTION_REVIEW.md
```

Perguntas:

```text
o problema original continua valido?

a solucao resolve
os fluxos prioritarios?

o escopo cresceu sem decisao?

os nao objetivos foram respeitados?

a arquitetura resolve
risco operacional real
ou apenas reorganiza tecnologia?

qual capacidade justifica
cada grande componente?
```

---

### 8. Testar excesso de solução

Exemplo:

```text
componente:
Compensation Streaming Platform.

capability:
calcular poucas transacoes
apos conclusao.

volume:
baixo.

justificativa:
nao documentada.
```

Finding:

```text
F-001
Type:
OVERENGINEERING.

Severity:
MEDIUM.
```

---

### 9. Revisar capability e boundary

Arquivo:

```text
review/CAPABILITY_BOUNDARY_REVIEW.md
```

Perguntas:

- toda capability possui owner?
- capabilities core recebem investimento proporcional?
- bounded context possui linguagem própria?
- aggregate pertence a um único context?
- boundary existe por responsabilidade ou por tabela?
- contexts compartilham entity?
- deploy foi confundido com boundary?
- existe context sem journey?
- existe journey sem owner?
- existe capability sem implementação conhecida?

---

### 10. Detectar boundary artificial

Cenário:

```text
Checklist Context
apenas armazena perguntas,
mas todas as regras
permanecem em Field Execution.
```

Possibilidades:

- Checklist é supporting module;
- Checklist é parte de Field Execution;
- responsabilidade ainda não foi separada.

A revisão não decide imediatamente.

Ela registra ambiguidade e evidência necessária.

---

### 11. Revisar autoridade de dados

Arquivo:

```text
review/DATA_AUTHORITY_REVIEW.md
```

Verifique:

- autoridade única;
- allowed writers;
- réplicas;
- freshness;
- conflict policy;
- migration;
- retention;
- access;
- lineage;
- repair.

Pergunta central:

```text
quem pode tomar
a decisao final
sobre este dado?
```

---

### 12. Detectar write cruzado

Exemplo:

```text
Field Execution Repository
atualiza activity.status
na tabela de Order Management.
```

Finding:

```text
F-006
Area:
DATA_AUTHORITY.

Type:
CROSS_CONTEXT_WRITE.

Severity:
BLOCKER.
```

---

### 13. Revisar APIs e eventos

Arquivo:

```text
review/API_EVENT_CONTRACT_REVIEW.md
```

APIs:

- owner;
- intent;
- version;
- authorization;
- idempotency;
- errors;
- SLO;
- deprecation;
- consumer.

Eventos:

- owner;
- fact;
- schema;
- version;
- ordering;
- consumers;
- retention;
- PII;
- replay;
- compatibility.

---

### 14. Detectar evento sem fato

Evento:

```text
UpdateActivityV1.
```

Problemas:

- parece comando;
- sem semântica de negócio;
- consumers não sabem o que ocorreu;
- payload tende a crescer.

Finding:

```text
F-009
Type:
AMBIGUOUS_EVENT_SEMANTICS.

Severity:
HIGH.
```

---

### 15. Revisar consistência

Arquivo:

```text
review/CONSISTENCY_REVIEW.md
```

Verifique por operação:

- authority;
- local transaction;
- propagation;
- timeout;
- retry;
- idempotency;
- conflict;
- compensation;
- recovery;
- UX;
- reconciliation.

---

### 16. Revisar budget de timeout

Exemplo:

```text
SLO:
3 segundos.

Gateway timeout:
4 segundos.

Scheduling timeout:
3 segundos.

Capacity timeout:
2 segundos.

retry:
2 tentativas.
```

A combinação não cabe no SLO.

Finding:

```text
F-012
Type:
TIMEOUT_BUDGET_CONTRADICTION.

Severity:
HIGH.
```

---

### 17. Revisar Saga

Perguntas:

- estados persistidos?
- pivot definido?
- compensações idempotentes?
- deadline?
- late reply?
- recovery?
- manual intervention?
- audit?
- owner?
- runbook?

Saga desenhada apenas como diagrama feliz é insuficiente.

---

### 18. Revisar segurança

Arquivo:

```text
review/SECURITY_REVIEW.md
```

Verifique:

- trust boundaries;
- human identity;
- workload identity;
- tenant source;
- authorization;
- least privilege;
- secrets;
- broker ACL;
- audit;
- supply chain;
- rate limit;
- upload protection;
- incident response.

---

### 19. Testar tenant no cache

Cenário:

```text
cache key:
activity:{activityId}
```

Falta tenant.

Finding:

```text
F-015
Type:
CROSS_TENANT_CACHE_COLLISION.

Severity:
BLOCKER.
```

Correção será planejada na Parte 2.

---

### 20. Revisar observabilidade

Arquivo:

```text
review/OBSERVABILITY_REVIEW.md
```

Verifique:

- journeys;
- spans;
- correlation;
- logs de decisão;
- métricas bounded;
- SLI eligibility;
- SLO;
- alert;
- dashboard;
- runbook;
- cost;
- retention;
- failure policy.

---

### 21. Detectar SLO sem ação

Exemplo:

```text
SLO:
Schedule Activity 99%.

alert:
missing.

runbook:
missing.
```

Finding:

```text
F-018
Type:
SLO_WITHOUT_OPERATIONAL_RESPONSE.

Severity:
HIGH.
```

---

### 22. Revisar cardinalidade

Procure labels:

```text
work_order_id;

activity_id;

tenant_id;

customer_id;

trace_id;

exception_message.
```

Qualquer uma em métrica operacional precisa de finding.

---

### 23. Revisar resiliência

Arquivo:

```text
review/RESILIENCE_REVIEW.md
```

Verifique:

- timeouts;
- retries;
- backoff;
- jitter;
- circuit breaker;
- bulkhead;
- fallback;
- load shedding;
- degraded mode;
- recovery;
- idempotency;
- observability.

---

### 24. Detectar retry perigoso

Cenário:

```text
POST /activities/{id}/complete
retry automatico
sem idempotency key.
```

Finding:

```text
F-021
Type:
RETRY_WITHOUT_IDEMPOTENCY.

Severity:
BLOCKER.
```

---

### 25. Revisar deployment e rollout

Arquivo:

```text
review/DEPLOYMENT_ROLLOUT_REVIEW.md
```

Verifique:

- deploy units;
- ownership;
- scaling;
- isolation;
- database migration;
- compatibility;
- feature flags;
- canary;
- stop conditions;
- dual write;
- backfill;
- reconciliation;
- rollback;
- cleanup.

---

### 26. Detectar rollback impossível

Exemplo:

```text
migration:
DROP COLUMN legacy_status.

rollout:
rollback to previous version.
```

A versão anterior depende da coluna removida.

Finding:

```text
F-024
Type:
IRREVERSIBLE_MIGRATION.

Severity:
BLOCKER.
```

---

### 27. Revisar ADRs e evidências

Arquivo:

```text
review/ADR_EVIDENCE_REVIEW.md
```

Para cada ADR:

- contexto;
- alternativas;
- decisão;
- consequências;
- owner;
- status;
- implementation link;
- evidence;
- review trigger;
- supersession.

---

### 28. Detectar ADR sem implementação

ADR:

```text
status:
ACCEPTED.

implementation:
missing.
```

Finding:

```text
F-027
Type:
ACCEPTED_NOT_IMPLEMENTED.

Severity:
HIGH.
```

---

### 29. Revisar claims

Claim:

```text
zero evento duplicado
gera efeito duplicado.
```

Evidence necessária:

- Inbox;
- unique constraint;
- duplicate event test;
- replay report.

Sem evidence, o claim permanece hipótese.

---

### 30. Criar Contradiction Catalog

Arquivo:

```text
review/CONTRADICTION_CATALOG.md
```

Campos:

- ID;
- source A;
- statement A;
- source B;
- statement B;
- affected area;
- risk;
- owner;
- status.

Exemplo:

```text
C-003

Source A:
Data Authority Matrix.

Statement A:
Scheduling owns schedule state.

Source B:
Order Management API.

Statement B:
Order Management updates schedule state.

Risk:
shared authority.
```

---

### 31. Criar Contradiction

```java
package br.com.formacao.osarchitecture.review;

import java.util.Objects;

public record Contradiction(
        String id,
        String sourceA,
        String statementA,
        String sourceB,
        String statementB,
        ReviewArea area,
        String risk,
        String owner) {

    public Contradiction {
        Objects.requireNonNull(id);
        Objects.requireNonNull(sourceA);
        Objects.requireNonNull(statementA);
        Objects.requireNonNull(sourceB);
        Objects.requireNonNull(statementB);
        Objects.requireNonNull(area);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(owner);
    }
}
```

---

### 32. Criar Missing Evidence Catalog

Arquivo:

```text
review/MISSING_EVIDENCE_CATALOG.md
```

Tipos de evidência:

```text
test;

benchmark;

load test;

contract validation;

security test;

game day;

runtime report;

reconciliation report;

deployment proof;

migration rehearsal;

audit sample;

SLO query;

runbook execution.
```

---

### 33. Criar Missing Evidence

```java
package br.com.formacao.osarchitecture.review;

import java.util.Objects;

public record MissingEvidence(
        String id,
        String claimId,
        String requiredEvidence,
        FindingSeverity severity,
        String risk,
        String owner) {

    public MissingEvidence {
        Objects.requireNonNull(id);
        Objects.requireNonNull(claimId);
        Objects.requireNonNull(requiredEvidence);
        Objects.requireNonNull(severity);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(owner);
    }
}
```

---

### 34. Reavaliar riscos

Arquivo:

```text
review/RISK_REASSESSMENT.md
```

Para cada risco:

- risk original;
- mitigation declarada;
- evidence;
- residual probability;
- residual impact;
- new severity;
- owner;
- decision.

Exemplo:

```text
RISK:
duplicate OS intake.

Mitigation:
Idempotency-Key.

Gap:
batch intake
does not use same scope.

Residual risk:
HIGH.
```

---

### 35. Criar catálogo de findings

Arquivo:

```text
review/REVIEW_FINDINGS.md
```

Ordene por:

```text
BLOCKER;

HIGH;

MEDIUM;

LOW;

INFO.
```

Cada finding deve possuir:

- ID;
- area;
- type;
- observation;
- evidence;
- risk;
- required action;
- owner;
- dependency;
- status.

---

### 36. Evitar finding genérico

Não escreva:

```text
melhorar seguranca.
```

Escreva:

```text
authorization policy
for COMPLETE_ACTIVITY
does not validate
assigned provider identity.
```

Ação:

```text
add provider assignment check
and negative authorization test.
```

---

### 37. Definir decisão preliminar

Arquivo:

```text
review/REVIEW_PART_ONE_DECISION.md
```

Status possíveis:

```text
READY_FOR_CORRECTION_PLAN;

CONDITIONALLY_READY;

NOT_READY;

INCONCLUSIVE.
```

Exemplo:

```text
Decision:
NOT_READY.

Reason:
3 blockers;
7 high findings;
4 missing critical evidences;
2 contradictory authorities.

Next:
Part Two correction plan.
```

---

### 38. Criar Review Decision

```java
package br.com.formacao.osarchitecture.review;

import java.util.List;

public record ReviewDecision(
        String status,
        List<String> blockerFindings,
        List<String> highFindings,
        List<String> requiredEvidence,
        String rationale,
        String nextStep) {

    public ReviewDecision {
        blockerFindings = List.copyOf(blockerFindings);
        highFindings = List.copyOf(highFindings);
        requiredEvidence = List.copyOf(requiredEvidence);
    }
}
```

---

### 39. Testar coerência problema-solução

Cenário:

- objetivo é reduzir tempo de operação;
- solução adiciona cinco serviços no caminho síncrono;
- não existe benchmark.

Resultado:

```text
FAIL_PROBLEM_SOLUTION_COHERENCE
```

---

### 40. Testar boundary sem owner

Context:

```text
Audit and Compliance.
```

Owner ausente.

Resultado:

```text
FAIL_BOUNDARY_OWNER
```

---

### 41. Testar autoridade contraditória

Data Authority Matrix e API divergem.

Resultado:

```text
FAIL_DATA_AUTHORITY_CONTRADICTION
```

---

### 42. Testar contrato incompleto

API crítica sem:

- idempotência;
- error codes;
- owner;
- SLO.

Resultado:

```text
FAIL_CRITICAL_API_CONTRACT
```

---

### 43. Testar timeout budget

A soma do caminho crítico excede o SLO.

Resultado:

```text
FAIL_TIMEOUT_BUDGET
```

---

### 44. Testar controle de segurança

A autorização não verifica tenant ou provider assignment.

Resultado:

```text
FAIL_AUTHORIZATION_COVERAGE
```

---

### 45. Testar traceabilidade operacional

SLO sem alert ou runbook.

Resultado:

```text
FAIL_SLO_RUNBOOK_TRACEABILITY
```

---

### 46. Testar rollback

Migration destrutiva sem expand-contract.

Resultado:

```text
FAIL_ROLLBACK_FEASIBILITY
```

---

### 47. Testar ADR e evidence

ADR aceito sem implementation ou test.

Resultado:

```text
FAIL_ADR_EVIDENCE_COVERAGE
```

---

### 48. Criar perguntas abertas

Arquivo:

```text
review/OPEN_REVIEW_QUESTIONS.md
```

Perguntas:

```text
o isolamento logico
de bancos e suficiente?

Checklist permanece
em Field Execution?

qual provider identity
funciona offline?

qual volume real
de evidence upload?

qual budget de manual intervention?

qual limite de stale dashboard?

qual compatibilidade
com clientes antigos?

qual custo operacional
dos deploy units?
```

---

### 49. Criar reports

Exemplo:

```yaml
architectureReviewPartOne:
  inventory:
    artifacts:
      94
    ownerCoveragePercent:
      98
    stale:
      4

  contradictions:
    total:
      6
    blocker:
      2

  missingEvidence:
    total:
      11
    critical:
      4

  findings:
    blocker:
      3
    high:
      7
    medium:
      9
    low:
      5

  residualRisks:
    critical:
      1
    high:
      5

  decision:
    NOT_READY

  gate:
    PASS
```

O gate pode passar mesmo com arquitetura `NOT_READY`.

Ele valida a qualidade da revisão, não a aprovação da solução.

---

### 50. Criar evidence da revisão

Arquivo:

```text
contracts/architecture-review-part-one-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- reviewed artifact count;
- owner coverage;
- stale artifact count;
- contradiction count;
- blocker contradiction count;
- missing evidence count;
- critical missing evidence count;
- blocker finding count;
- high finding count;
- medium finding count;
- low finding count;
- residual critical risk count;
- residual high risk count;
- problem solution coherence status;
- boundary review status;
- data authority review status;
- contract review status;
- consistency review status;
- security review status;
- observability review status;
- resilience review status;
- rollout review status;
- ADR evidence review status;
- preliminary decision;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais;
- clientes reais;
- endpoints privados;
- vulnerabilidades exploráveis;
- credenciais;
- dados pessoais;
- incidentes reais;
- plano completo de correção da aula 667.

---

### 51. Criar gate da Parte 1

O gate valida:

- charter;
- inventory;
- review coverage;
- findings com evidence;
- severidade por risco;
- contradiction catalog;
- missing evidence;
- residual risk;
- preliminary decision;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_REVIEW_CHARTER;

FAIL_REVIEW_INVENTORY;

FAIL_REVIEW_COVERAGE;

FAIL_FINDING_EVIDENCE;

FAIL_FINDING_SEVERITY;

FAIL_CONTRADICTION_CATALOG;

FAIL_MISSING_EVIDENCE;

FAIL_RISK_REASSESSMENT;

FAIL_PRELIMINARY_DECISION;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 52. Executar validação completa

```powershell
.\scripts\m19\os-architecture-review-part-one\validate-review-contract.ps1

.\scripts\m19\os-architecture-review-part-one\validate-review-inventory.ps1

.\scripts\m19\os-architecture-review-part-one\validate-problem-solution-coherence.ps1

.\scripts\m19\os-architecture-review-part-one\validate-boundary-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-data-authority-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-contract-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-consistency-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-security-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-observability-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-resilience-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-rollout-review.ps1

.\scripts\m19\os-architecture-review-part-one\validate-ADR-evidence-review.ps1

.\scripts\m19\os-architecture-review-part-one\run-architecture-review-part-one-tests.ps1

.\scripts\m19\os-architecture-review-part-one\collect-architecture-review-part-one-evidence.ps1

.\scripts\m19\os-architecture-review-part-one\verify-architecture-review-part-one-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 53. Encerrar a Parte 1

Confirme:

- inventário;
- owners;
- freshness;
- problem-solution review;
- capability review;
- boundary review;
- data authority review;
- API review;
- event review;
- consistency review;
- Saga review;
- security review;
- observability review;
- resilience review;
- rollout review;
- ADR review;
- claims review;
- contradiction catalog;
- missing evidence;
- residual risks;
- findings;
- preliminary decision;
- reports;
- evidence;
- gate aprovado.

---

## Entendendo o que foi feito

### A revisão começou pela coerência

Você não verificou apenas se os documentos existiam.

Comparou problema, capabilities, boundaries, dados, contratos, operação e evidências.

### Findings ganharam estrutura

Observações passaram a incluir evidência, risco, severidade, owner e ação necessária.

### Contradições ficaram visíveis

Fontes diferentes que declaravam autoridades, fluxos ou políticas incompatíveis foram registradas.

### Claims perderam imunidade

Afirmações arquiteturais sem teste, report ou operação foram reclassificadas como hipóteses.

### Riscos foram reavaliados

Mitigação declarada não foi aceita automaticamente.

A revisão verificou se o controle realmente reduzia probabilidade e impacto.

### A decisão preliminar ficou separada do gate

O gate aprova a qualidade da revisão.

A decisão preliminar informa se a arquitetura está pronta, condicionada ou não pronta.

---

## Erros comuns importantes

### Revisar somente documentos

Código, deploy e runtime também precisam ser comparados.

### Procurar culpado

A revisão examina o sistema e a decisão, não a identidade do autor.

### Criar finding sem evidência

A observação vira opinião.

### Definir severidade por gosto

Severidade vem do risco.

### Ignorar contradição pequena

Pequenas divergências podem causar decisões erradas em incidentes.

### Aprovar por quantidade de artefatos

Volume documental não prova coerência.

### Aceitar claim sem teste

A arquitetura parece mais madura do que é.

### Corrigir durante a descoberta

Correções prematuras podem esconder outras relações.

### Misturar review gate e approval

Uma revisão pode estar excelente e a arquitetura continuar não pronta.

### Antecipar a Parte 2

Priorização, correção e defesa final ficam para a aula 667.

---

## Comandos úteis

### Validar inventário

```powershell
.\scripts\m19\os-architecture-review-part-one\validate-review-inventory.ps1
```

### Validar boundaries

```powershell
.\scripts\m19\os-architecture-review-part-one\validate-boundary-review.ps1
```

### Validar consistência

```powershell
.\scripts\m19\os-architecture-review-part-one\validate-consistency-review.ps1
```

### Validar segurança

```powershell
.\scripts\m19\os-architecture-review-part-one\validate-security-review.ps1
```

### Executar testes

```powershell
.\scripts\m19\os-architecture-review-part-one\run-architecture-review-part-one-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\os-architecture-review-part-one\verify-architecture-review-part-one-gate.ps1
```

---

## Exercício guiado

Revise o claim:

```text
falha de Communication
nao bloqueia conclusao
da atividade.
```

Verifique:

1. diagrama;
2. contrato;
3. chamada síncrona;
4. evento;
5. timeout;
6. retry;
7. transação;
8. Saga;
9. SLO;
10. alerta;
11. runbook;
12. teste;
13. rollout;
14. evidence.

Crie findings verificáveis quando alguma fonte contradizer o claim.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 665 e ponte para a aula 667 foram preservadas;
- Review Charter foi criado;
- contrato da revisão foi criado;
- Review Inventory foi criado;
- artefatos, owners, status e freshness foram inventariados;
- áreas de revisão foram definidas;
- Review Finding foi criado;
- severidades foram definidas por risco;
- Problem-to-Solution Review foi criado;
- excesso de solução foi testado;
- Capability and Boundary Review foi criado;
- boundary artificial foi detectado;
- Data Authority Review foi criado;
- cross-context write foi detectado;
- API and Event Contract Review foi criado;
- evento sem semântica foi detectado;
- Consistency Review foi criado;
- timeout budget foi revisado;
- Saga foi revisada;
- Security Review foi criado;
- tenant em cache foi testado;
- Observability Review foi criado;
- SLO sem alerta e runbook foi detectado;
- cardinalidade foi revisada;
- Resilience Review foi criado;
- retry sem idempotência foi detectado;
- Deployment and Rollout Review foi criado;
- rollback impossível foi detectado;
- ADR and Evidence Review foi criado;
- ADR aceito sem implementação foi detectado;
- claims foram revisados;
- Contradiction Catalog foi criado;
- Missing Evidence Catalog foi criado;
- Risk Reassessment foi criado;
- Review Findings foi criado;
- findings possuem evidence, risk, action e owner;
- decisão preliminar foi criada;
- testes de coerência, boundary, autoridade, contrato, timeout, segurança, SLO, rollback e ADR foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- correções e defesa final não foram antecipadas.

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
  scripts/m19/os-architecture-review-part-one `
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
git commit -m "docs(m19): revisar arquitetura de OS parte 1"
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
- plano completo de correção da aula 667.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou a revisão crítica da arquitetura de Ordens de Serviço.

Você criou:

```text
Review Charter;

Review Inventory;

Problem Solution Review;

Capability Boundary Review;

Data Authority Review;

API Event Contract Review;

Consistency Review;

Security Review;

Observability Review;

Resilience Review;

Deployment Rollout Review;

ADR Evidence Review;

Contradiction Catalog;

Missing Evidence Catalog;

Risk Reassessment;

Review Findings;

Preliminary Decision;

reports, evidence e gate.
```

Você comprovou que revisar arquitetura não significa apenas verificar se existem ADRs, diagramas, contratos e runbooks.

A revisão precisa provar que esses artefatos são coerentes entre si e com código, deploy, operação e evidências.

Você separou ausência de contradição.

Você classificou findings por risco.

Você reavaliou riscos residuais.

Você também separou o gate da revisão da decisão sobre a arquitetura.

A próxima aula será:

```text
667 - M19.57 - Revisao arquitetura parte 2
```

Nela, você irá priorizar findings, criar o plano de correção, fechar evidências faltantes, revisar a defesa técnica, simular uma banca arquitetural e emitir a decisão final.

Nenhum plano completo de correção ou defesa final foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei artefatos.
- [ ] Revisei problema e solução.
- [ ] Revisei capabilities e boundaries.
- [ ] Revisei autoridade de dados.
- [ ] Revisei APIs e eventos.
- [ ] Revisei consistência e Saga.
- [ ] Revisei segurança.
- [ ] Revisei observabilidade.
- [ ] Revisei resiliência.
- [ ] Revisei rollout e rollback.
- [ ] Revisei ADRs e claims.
- [ ] Registrei findings e decisão preliminar.

---

## Troubleshooting adicional

### Existem muitos findings

Agrupe por causa raiz, não apenas por sintoma.

### O owner discorda da severidade

Retorne ao risco, impacto, probabilidade e reversibilidade.

### O documento parece correto, mas o código diverge

Registre contradição e determine a autoridade.

### O claim não pode ser testado

Transforme em hipótese ou crie evidence alternativa.

### O review virou debate de tecnologia

Retorne ao problema, boundary, risco e qualidade.

### Todos querem corrigir imediatamente

Feche primeiro o inventário e as relações.

### O gate passa, mas a decisão é NOT_READY

Isso é válido. O gate avalia a revisão.

### A revisão está demorando demais

Priorize áreas críticas e use risk-based review.

### O finding cita uma pessoa

Reescreva para comportamento, decisão ou sistema.

### O mesmo problema aparece em vários lugares

Crie finding de causa raiz e links para os sintomas.

### A equipe quer preparar a defesa final

Preserve essa etapa para a aula 667.

---

## Perguntas de revisão

1. O que uma revisão arquitetural verifica?
2. Por que checklist não é suficiente?
3. O que é coerência arquitetural?
4. O que é finding?
5. O que torna finding verificável?
6. Qual diferença entre ausência e contradição?
7. Como severidade é definida?
8. O que revisar no Problem Statement?
9. O que revisar em bounded contexts?
10. O que revisar em autoridade de dados?
11. O que revisar em APIs?
12. O que revisar em eventos?
13. O que revisar em consistência?
14. O que revisar em Saga?
15. O que revisar em segurança?
16. O que revisar em observabilidade?
17. O que revisar em resiliência?
18. O que revisar em rollout?
19. O que revisar em ADR?
20. O que é missing evidence?
21. O que é risco residual?
22. Por que o gate pode passar com arquitetura NOT_READY?
23. Quando um claim vira hipótese?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Coerência entre intenção, desenho, execução e evidence.
2. Porque presença não prova qualidade.
3. Quando todas as fontes contam a mesma história.
4. Problema arquitetural registrado.
5. Observation, evidence, risk, action e owner.
6. Algo inexistente versus fontes incompatíveis.
7. Pelo risco.
8. Problema, objetivo, escopo e constraints.
9. Responsibility, language, authority e ownership.
10. Writers, replicas, conflict e repair.
11. Owner, intent, auth, errors, version e SLO.
12. Semântica, schema, owner, consumers e ordering.
13. Authority, propagation, timeout, retry e recovery.
14. State, compensation, deadline, late reply e intervention.
15. Boundaries, identity, tenant, authorization e secrets.
16. Journey, SLO, alert, dashboard e runbook.
17. Timeout, retry, bulkhead, fallback e recovery.
18. Compatibility, canary, stop condition e rollback.
19. Alternatives, decision, implementation e evidence.
20. Prova necessária ainda não existente.
21. Risco restante após os controles.
22. Porque gate avalia a qualidade da revisão.
23. Quando não possui evidence suficiente.
24. Correção e defesa final.
25. Revisao arquitetura parte 2.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 666 - M19.56 - Revisao arquitetura parte 1

- Continuei após o Projeto arquitetura OS parte 2.
- Iniciei a revisão crítica da solução.
- Criei Review Charter.
- Criei o contrato da revisão.
- Criei Review Inventory.
- Inventariei artefatos, owners, status e freshness.
- Defini áreas de revisão.
- Criei Review Finding.
- Classifiquei severidades por risco.
- Revisei coerência entre problema e solução.
- Detectei excesso de solução.
- Revisei capabilities e boundaries.
- Detectei boundary artificial.
- Revisei autoridade de dados.
- Detectei cross-context write.
- Revisei APIs e eventos.
- Detectei evento sem semântica.
- Revisei consistência.
- Detectei timeout budget incoerente.
- Revisei Saga.
- Revisei segurança.
- Detectei cache sem tenant.
- Revisei observabilidade.
- Detectei SLO sem resposta operacional.
- Revisei cardinalidade.
- Revisei resiliência.
- Detectei retry sem idempotência.
- Revisei deployment e rollout.
- Detectei migration irreversível.
- Revisei ADRs e evidence.
- Detectei ADR aceito sem implementação.
- Revisei claims.
- Criei Contradiction Catalog.
- Criei Missing Evidence Catalog.
- Reavaliei riscos residuais.
- Criei Review Findings.
- Criei decisão preliminar.
- Executei testes de coerência.
- Criei reports, evidence e gate.
- Não antecipei correções e defesa final.
- Próxima aula: Revisao arquitetura parte 2.
```

---

## Referência técnica curta

- Architecture Review.
- Review Inventory.
- Review Finding.
- Finding Severity.
- Contradiction.
- Missing Evidence.
- Residual Risk.
- Problem-Solution Coherence.
- Boundary Review.
- Data Authority Review.
- Contract Review.
- Consistency Review.
- Security Review.
- Observability Review.
- Rollout Review.
- Preliminary Decision.

Regra final:

```text
A primeira parte da revisão arquitetural deve verificar coerência entre intenção, desenho, execução e evidence, não apenas a presença de documentos: o inventário identifica artefatos, owners, status, versões, freshness e links, a revisão de problema confirma que a solução atende objetivos e não objetivos sem overengineering, capabilities e bounded contexts são verificados por responsibility, language, authority e ownership, e dados são auditados por writers, replicas, consistency, conflict e repair; APIs e eventos precisam de owner, intent, security, idempotency, schema, version, consumers, ordering e lifecycle, consistency decisions precisam caber nos SLOs e budgets de timeout, Sagas precisam de state, pivot, compensation, deadlines, late replies, recovery e intervention, segurança precisa proteger trust boundaries, humans, workloads, tenants, secrets e broker, observabilidade precisa conectar journeys, SLOs, alerts, dashboards e runbooks, e resilience e rollout precisam provar retry seguro, compatibility, migration, canary, stop conditions e rollback; ADRs aceitos precisam de implementation e evidence, claims sem teste permanecem hipóteses, contradições entre fontes são registradas, evidências faltantes ficam explícitas, riscos residuais são reclassificados, findings possuem observation, evidence, risk, severity, action e owner, e a decisão preliminar pode declarar NOT_READY mesmo quando o gate da revisão passa, enquanto priorização, correção, banca e decisão final permanecem reservadas para a aula 667.
```
