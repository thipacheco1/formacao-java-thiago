# 662 - M19.52 - Governanca tecnica leve

## Apresentação da aula

Na aula 661, você aprofundou arquitetura corporativa brasileira.

Você modelou capacidades de negócio, domínios, portfólio de aplicações, sistemas legados, ERP, SaaS, integrações críticas, dados corporativos, fornecedores, aquisições, ambientes híbridos, princípios, arquiteturas de referência, plataformas, roadmaps e um modelo federado de arquitetura.

Esse desenho criou direção.

Mas direção sem mecanismo de execução tende a permanecer em documentos.

Agora surge o próximo problema:

```text
como garantir coerência técnica
em dezenas de times,

sem transformar arquitetura
em um processo lento,
centralizador
e burocrático?
```

Governança técnica é frequentemente associada a:

- comitês extensos;
- aprovações em cadeia;
- documentos longos;
- filas de arquitetura;
- padrões impostos de cima para baixo;
- reuniões sem decisão;
- exceções permanentes;
- controles que aparecem apenas perto do deploy.

Esse modelo cria resistência.

Times começam a contornar o processo.

Decisões migram para canais informais.

Padrões perdem legitimidade.

A arquitetura vira um departamento distante da entrega.

Governança técnica leve segue outro princípio:

```text
governar menos decisões,
mas governá-las melhor.
```

Ela define:

- quais decisões precisam de coordenação;
- quais decisões pertencem aos times;
- quais guardrails são obrigatórios;
- quais caminhos recomendados reduzem esforço;
- quando uma revisão arquitetural é necessária;
- quais evidências devem existir;
- como exceções são concedidas e encerradas;
- como padrões evoluem;
- como automação substitui verificação manual;
- como métricas mostram se a governança ajuda ou atrapalha;
- como ownership é distribuído.

A governança deve proteger:

- segurança;
- integridade;
- interoperabilidade;
- dados;
- confiabilidade;
- custo;
- operabilidade;
- compliance;
- capacidade de mudança.

Ao mesmo tempo, ela deve preservar:

- autonomia;
- velocidade;
- aprendizado;
- experimentação;
- ownership;
- proximidade com o domínio.

O laboratório será:

```text
labs/m19/aula-662-governanca-tecnica-leve/service-scheduling-lightweight-governance
```

Você irá modelar um sistema leve de governança para o ecossistema `Service Scheduling`.

O cenário terá:

```text
12 times de produto;

3 plataformas compartilhadas;

servicos Java e sistemas legados;

mensageria;

APIs internas e externas;

dados multi-tenant;

fornecedores;

ambientes cloud e on-premises;

requisitos de seguranca e auditoria.
```

Você criará:

- Technical Governance Charter;
- catálogo de decisões;
- matriz de decision rights;
- catálogo de guardrails;
- golden paths;
- critérios de revisão por risco;
- fóruns de arquitetura;
- lifecycle de padrões;
- processo de exceção;
- policy as code;
- scorecard;
- métricas de fluxo;
- operating model;
- reports, evidence e gate.

A próxima aula será:

```text
663 - M19.53 - Documentacao arquitetural viva
```

A aula 663 aprofundará como manter C4, ADRs, RFCs, contratos, decisões, diagramas, runbooks e evidências sincronizados com o sistema real.

Nesta aula, documentação será usada apenas como suporte aos mecanismos de governança.

Regra central:

```text
governanca tecnica leve
nao tenta decidir tudo;

ela define
decision rights,
guardrails,
caminhos seguros,
evidencias
e feedback

para que os times
decidam com autonomia
dentro de limites claros.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
659:
Lideranca tecnica.

660:
Mentoria e comunicacao tecnica.

661:
Arquitetura corporativa brasileira.

662:
Governanca tecnica leve.

663:
Documentacao arquitetural viva.
```

A progressão é:

```text
liderar decisões;

desenvolver autonomia;

organizar arquitetura em escala corporativa;

criar mecanismos leves de coerência;

manter conhecimento arquitetural vivo.
```

Até aqui, você já criou instrumentos de decisão:

- ADR;
- RFC;
- C4;
- fitness functions;
- ArchUnit;
- code review arquitetural;
- risk registers;
- roadmaps;
- contracts;
- policies;
- gates;
- evidence.

A aula atual organiza esses instrumentos em um sistema de governança.

O objetivo não é criar uma nova camada de aprovação.

O objetivo é determinar:

```text
quando cada instrumento
deve ser usado;

quem decide;

quem precisa ser consultado;

qual risco exige escalonamento;

qual evidencia permite seguir;

como aprender com o resultado.
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-662-governanca-tecnica-leve
└── service-scheduling-lightweight-governance
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/lightgovernance
    │   │           ├── decision
    │   │           │   ├── GovernedDecision.java
    │   │           │   ├── DecisionCategory.java
    │   │           │   ├── DecisionRisk.java
    │   │           │   ├── DecisionRight.java
    │   │           │   ├── DecisionOwner.java
    │   │           │   └── DecisionCatalog.java
    │   │           ├── guardrail
    │   │           │   ├── Guardrail.java
    │   │           │   ├── GuardrailType.java
    │   │           │   ├── GuardrailSeverity.java
    │   │           │   ├── GuardrailEvaluation.java
    │   │           │   └── GuardrailCatalog.java
    │   │           ├── path
    │   │           │   ├── GoldenPath.java
    │   │           │   ├── GoldenPathStep.java
    │   │           │   ├── GoldenPathVersion.java
    │   │           │   └── GoldenPathAdoption.java
    │   │           ├── review
    │   │           │   ├── ReviewTrigger.java
    │   │           │   ├── ReviewScope.java
    │   │           │   ├── ReviewEvidence.java
    │   │           │   ├── ReviewDecision.java
    │   │           │   └── RiskBasedReview.java
    │   │           ├── exception
    │   │           │   ├── GovernanceException.java
    │   │           │   ├── ExceptionStatus.java
    │   │           │   ├── ExceptionControl.java
    │   │           │   └── ExceptionLifecycle.java
    │   │           ├── standard
    │   │           │   ├── TechnicalStandard.java
    │   │           │   ├── StandardStatus.java
    │   │           │   ├── StandardVersion.java
    │   │           │   └── StandardLifecycle.java
    │   │           ├── metric
    │   │           │   ├── GovernanceMetric.java
    │   │           │   ├── FlowMetric.java
    │   │           │   ├── OutcomeMetric.java
    │   │           │   └── GovernanceScorecard.java
    │   │           └── gate
    │   │               ├── GovernanceGate.java
    │   │               ├── GovernanceFinding.java
    │   │               └── GovernanceGateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/lightgovernance
    │               ├── decision
    │               │   ├── DecisionRightsTest.java
    │               │   └── RiskClassificationTest.java
    │               ├── guardrail
    │               │   ├── MandatoryGuardrailTest.java
    │               │   └── GuardrailEvidenceTest.java
    │               ├── exception
    │               │   ├── ExceptionExpirationTest.java
    │               │   └── ExceptionCompensatingControlTest.java
    │               ├── review
    │               │   ├── RiskBasedReviewTest.java
    │               │   └── ReviewSlaTest.java
    │               └── architecture
    │                   ├── GovernanceBoundaryTest.java
    │                   ├── PolicyAsCodeTest.java
    │                   ├── LivingDocumentationNonAnticipationTest.java
    │                   └── DecisionOwnershipTest.java
    ├── governance
    │   ├── TECHNICAL_GOVERNANCE_CHARTER.md
    │   ├── GOVERNANCE_PRINCIPLES.md
    │   ├── DECISION_CATALOG.md
    │   ├── DECISION_RIGHTS_MATRIX.md
    │   ├── RISK_CLASSIFICATION.md
    │   ├── GUARDRAIL_CATALOG.md
    │   ├── GOLDEN_PATH_CATALOG.md
    │   ├── REVIEW_TRIGGER_CATALOG.md
    │   ├── ARCHITECTURE_FORUMS.md
    │   ├── STANDARD_LIFECYCLE.md
    │   ├── EXCEPTION_POLICY.md
    │   ├── POLICY_AS_CODE.md
    │   ├── GOVERNANCE_SCORECARD.md
    │   ├── GOVERNANCE_FLOW_METRICS.md
    │   ├── OPERATING_MODEL.md
    │   ├── FEDERATED_GOVERNANCE.md
    │   ├── COMMUNICATION_PLAN.md
    │   ├── RETROSPECTIVE.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_GOVERNANCE_QUESTIONS.md
    ├── contracts
    │   ├── lightweight-governance-contract.yaml
    │   ├── decision-rights-policy.yaml
    │   ├── risk-classification-policy.yaml
    │   ├── guardrail-policy.yaml
    │   ├── golden-path-policy.yaml
    │   ├── review-policy.yaml
    │   ├── standard-lifecycle-policy.yaml
    │   ├── exception-policy.yaml
    │   ├── policy-as-code-policy.yaml
    │   ├── scorecard-policy.yaml
    │   ├── flow-metric-policy.yaml
    │   ├── ownership-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── decision-rights-report.yaml
        ├── guardrail-coverage-report.yaml
        ├── golden-path-adoption-report.yaml
        ├── review-flow-report.yaml
        ├── exception-report.yaml
        ├── standard-lifecycle-report.yaml
        ├── governance-scorecard-report.yaml
        ├── architecture-report.yaml
        └── lightweight-governance-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-lightweight-governance
├── validate-governance-contract.ps1
├── validate-decision-rights.ps1
├── validate-risk-classification.ps1
├── validate-guardrail-catalog.ps1
├── validate-golden-paths.ps1
├── validate-review-triggers.ps1
├── validate-standard-lifecycle.ps1
├── validate-exception-policy.ps1
├── validate-policy-as-code.ps1
├── validate-governance-scorecard.ps1
├── run-lightweight-governance-tests.ps1
├── collect-lightweight-governance-evidence.ps1
└── verify-lightweight-governance-gate.ps1
```

---

## Conceito essencial

### Governança não é gestão de todas as decisões

Times de produto precisam decidir rapidamente sobre:

- implementação local;
- refatoração;
- organização interna;
- testes;
- detalhes de API dentro de contrato;
- escolha de algoritmo;
- experiência de desenvolvimento.

Coordenação corporativa é necessária quando a decisão afeta:

- múltiplos domínios;
- segurança;
- dados compartilhados;
- contratos externos;
- compliance;
- plataformas;
- custo significativo;
- fornecedores;
- disponibilidade;
- padrões corporativos;
- irreversibilidade.

A governança leve diferencia esses níveis.

### Decision rights tornam ownership explícito

Decision right responde:

```text
quem pode decidir?

quem precisa ser consultado?

quem pode bloquear?

quem precisa ser informado?

qual evidencia e obrigatoria?

quando escalar?
```

Sem decision rights, decisões ficam sujeitas a:

- influência informal;
- cargo;
- disponibilidade;
- histórico;
- política interna;
- voz mais alta.

### Guardrail é um limite verificável

Guardrail define comportamento obrigatório.

Exemplos:

```text
nenhum acesso cross-tenant;

nenhum secret em codigo;

nenhum evento sem schema versionado;

nenhum deploy sem rollback;

nenhum dado pessoal em metric label;

nenhuma tabela compartilhada entre servicos
sem owner e decisao explicita.
```

Guardrail deve possuir:

- propósito;
- escopo;
- owner;
- severidade;
- método de verificação;
- tratamento de falha;
- processo de exceção;
- revisão.

### Golden path reduz esforço

Golden path é um caminho suportado e recomendável.

Exemplo:

```text
template Spring Boot;

observabilidade pronta;

autenticacao integrada;

pipeline padrao;

deploy progressivo;

secrets gerenciados;

runbook basico;

policy checks.
```

O golden path não deve ser uma prisão.

Ele deve tornar o caminho seguro mais fácil que o caminho improvisado.

### Revisão precisa ser proporcional ao risco

Mudança pequena e reversível não deve enfrentar o mesmo processo de uma decisão crítica e irreversível.

A governança leve usa classificação de risco.

Baixo risco:

```text
time decide;
checks automatizados;
registro local.
```

Médio risco:

```text
review por owner;
ADR ou RFC curto;
evidencias proporcionais.
```

Alto risco:

```text
review multidisciplinar;
experimentos;
rollout;
security and data review;
decision authority explicita.
```

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-662-governanca-tecnica-leve/service-scheduling-lightweight-governance

Set-Location `
  labs/m19/aula-662-governanca-tecnica-leve/service-scheduling-lightweight-governance
```

---

### 2. Criar Technical Governance Charter

Arquivo:

```text
governance/TECHNICAL_GOVERNANCE_CHARTER.md
```

Conteúdo:

```markdown
# Technical Governance Charter

Contexto

Service Scheduling.

Objetivo

Aumentar coerencia,
seguranca e capacidade de mudanca
sem centralizar todas as decisoes.

Principios

- autonomy with boundaries;
- risk-based review;
- policy as code;
- golden paths;
- explicit ownership;
- temporary exceptions;
- evidence over opinion;
- feedback loops;
- no hidden approval;
- governance must measure its own cost.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/lightweight-governance-contract.yaml
```

Conteúdo:

```yaml
lightweightGovernance:
  context:
    Service-Scheduling

  required:
    - governance-charter
    - decision-catalog
    - decision-rights
    - risk-classification
    - guardrails
    - golden-paths
    - review-triggers
    - forums
    - standard-lifecycle
    - exception-policy
    - policy-as-code
    - scorecard
    - flow-metrics
    - ownership
    - retrospective
    - evidence
    - gate

  forbidden:
    - central-approval-for-all
    - hidden-decision-right
    - exception-without-expiration
    - standard-without-owner
    - manual-check-when-automatable
    - meeting-without-decision
    - permanent-waiver
    - governance-metric-as-individual-ranking
    - living-documentation-deep-dive

  nextLesson:
    code:
      M19.53
```

---

### 4. Criar princípios de governança

Arquivo:

```text
governance/GOVERNANCE_PRINCIPLES.md
```

Princípios:

```text
decisao no nivel mais proximo do problema;

coordenacao proporcional ao impacto;

automacao antes de aprovacao manual;

padrao com owner e lifecycle;

excecao temporaria;

evidence antes de opiniao;

governanca observavel;

feedback dos times;

seguranca e dados como guardrails;

autonomia dentro de boundaries.
```

---

### 5. Criar Decision Catalog

Arquivo:

```text
governance/DECISION_CATALOG.md
```

Categorias:

```text
produto;

dominio;

API;

eventos;

dados;

seguranca;

plataforma;

cloud;

observabilidade;

resiliencia;

fornecedor;

open source;

compliance;

arquitetura corporativa.
```

Para cada categoria, registre:

- exemplos;
- owner;
- risco padrão;
- artefato esperado;
- fórum;
- SLA;
- guardrails;
- escalonamento.

---

### 6. Criar Governed Decision

```java
package br.com.formacao.lightgovernance.decision;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

public record GovernedDecision(
        String id,
        String title,
        DecisionCategory category,
        DecisionRisk risk,
        DecisionOwner owner,
        List<DecisionRight> rights,
        Instant neededBy,
        String evidenceRequirement) {

    public GovernedDecision {
        Objects.requireNonNull(id);
        Objects.requireNonNull(title);
        Objects.requireNonNull(category);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(owner);
        rights = List.copyOf(rights);
        Objects.requireNonNull(neededBy);
        Objects.requireNonNull(evidenceRequirement);
    }
}
```

---

### 7. Criar Decision Rights Matrix

Arquivo:

```text
governance/DECISION_RIGHTS_MATRIX.md
```

Exemplo:

```text
Decision:
internal package organization.

Decider:
product team.

Consulted:
none by default.

Evidence:
tests and local review.

Escalation:
not required.
```

Outro:

```text
Decision:
new cross-domain event.

Decider:
event owner and consuming domains.

Consulted:
data;
security;
platform when shared broker is affected.

Evidence:
schema;
compatibility;
ownership;
retention;
observability;
rollback.

Escalation:
architecture forum
when ownership is disputed.
```

---

### 8. Definir tipos de decision right

Use:

```text
DECIDE;

CONTRIBUTE;

CONSULT;

BLOCK_ON_GUARDRAIL;

INFORM;

ESCALATE.
```

`BLOCK_ON_GUARDRAIL` não significa veto por preferência.

O bloqueio precisa apontar um guardrail obrigatório violado.

---

### 9. Testar decision rights

Cenário:

```text
um arquiteto central
tenta bloquear
uma refatoracao interna
sem violacao de guardrail.
```

Resultado:

```text
BLOCK_NOT_ALLOWED
```

A decisão pertence ao time.

---

### 10. Criar Risk Classification

Arquivo:

```text
governance/RISK_CLASSIFICATION.md
```

Dimensões:

```text
blast radius;

reversibility;

data impact;

security impact;

customer impact;

regulatory impact;

cost;

operational complexity;

cross-domain coupling;

vendor lock-in.
```

Escala:

```text
LOW;

MEDIUM;

HIGH;

CRITICAL.
```

---

### 11. Implementar classificação

```java
package br.com.formacao.lightgovernance.decision;

public final class DecisionRiskClassifier {

    public DecisionRisk classify(
            int blastRadius,
            int reversibility,
            int dataImpact,
            int securityImpact,
            int regulatoryImpact) {

        int score = blastRadius
                + reversibility
                + dataImpact
                + securityImpact
                + regulatoryImpact;

        if (securityImpact >= 5
                || regulatoryImpact >= 5
                || score >= 20) {
            return DecisionRisk.CRITICAL;
        }

        if (score >= 15) {
            return DecisionRisk.HIGH;
        }

        if (score >= 8) {
            return DecisionRisk.MEDIUM;
        }

        return DecisionRisk.LOW;
    }
}
```

A pontuação é didática.

A política real precisa ser calibrada com incidentes e contexto.

---

### 12. Criar catálogo de guardrails

Arquivo:

```text
governance/GUARDRAIL_CATALOG.md
```

Guardrails obrigatórios:

```text
GR-SEC-001:
zero cross-tenant access.

GR-SEC-002:
zero secret in repository.

GR-DATA-001:
data authority explicit.

GR-DATA-002:
schema evolution compatible.

GR-API-001:
breaking change requires version strategy.

GR-OPS-001:
critical service requires SLO and runbook.

GR-REL-001:
critical release requires rollback.

GR-OBS-001:
no high-cardinality identifier in metrics.

GR-MSG-001:
event requires owner and schema.

GR-COST-001:
shared platform usage requires budget.
```

---

### 13. Criar Guardrail

```java
package br.com.formacao.lightgovernance.guardrail;

import java.util.List;
import java.util.Objects;

public record Guardrail(
        String id,
        String name,
        GuardrailType type,
        GuardrailSeverity severity,
        String owner,
        String purpose,
        List<String> evidence,
        String failureAction,
        boolean exceptionAllowed) {

    public Guardrail {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(type);
        Objects.requireNonNull(severity);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(purpose);
        evidence = List.copyOf(evidence);
        Objects.requireNonNull(failureAction);
    }
}
```

---

### 14. Diferenciar guardrail e guideline

Guardrail:

```text
obrigatorio;
falha bloqueia ou exige excecao.
```

Guideline:

```text
recomendacao;
desvio precisa de justificativa local,
mas nao necessariamente escalonamento.
```

Confundir ambos gera burocracia.

---

### 15. Criar golden paths

Arquivo:

```text
governance/GOLDEN_PATH_CATALOG.md
```

Golden paths:

```text
Java REST Service;

Event Consumer;

Scheduled Worker;

Internal API;

Public API;

PostgreSQL Migration;

Observability Baseline;

Secure Service-to-Service;

Progressive Delivery.
```

Cada path deve incluir:

- template;
- documentação;
- owner;
- versão;
- suporte;
- exemplos;
- guardrails;
- automação;
- feedback;
- deprecation.

---

### 16. Criar Golden Path

```java
package br.com.formacao.lightgovernance.path;

import java.util.List;
import java.util.Objects;

public record GoldenPath(
        String id,
        String name,
        GoldenPathVersion version,
        String owner,
        List<GoldenPathStep> steps,
        List<String> includedGuardrails,
        String supportChannel,
        String deprecationPolicy) {

    public GoldenPath {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(version);
        Objects.requireNonNull(owner);
        steps = List.copyOf(steps);
        includedGuardrails = List.copyOf(includedGuardrails);
        Objects.requireNonNull(supportChannel);
        Objects.requireNonNull(deprecationPolicy);
    }
}
```

---

### 17. Medir adoção do golden path

Não force adoção apenas por mandato.

Meça:

```text
tempo para primeiro deploy;

taxa de sucesso;

incidentes;

customizacoes;

tempo de suporte;

satisfacao;

abandono;

motivo do desvio;

versoes antigas.
```

Se os times evitam o caminho, investigue o produto de plataforma.

---

### 18. Criar Review Trigger Catalog

Arquivo:

```text
governance/REVIEW_TRIGGER_CATALOG.md
```

Triggers:

```text
novo boundary;

novo dado sensivel;

nova integracao externa;

novo fornecedor;

breaking API;

mudanca de autoridade de dados;

nova tecnologia corporativa;

novo custo recorrente relevante;

mudanca cross-tenant;

novo protocolo;

SLO critico;

decisao irreversivel;

excecao de guardrail.
```

Mudanças sem trigger seguem ownership local.

---

### 19. Criar revisão por risco

Arquivo:

```text
contracts/review-policy.yaml
```

Conteúdo:

```yaml
review:
  LOW:
    owner:
      product-team
    artifact:
      local-decision-record
    SLAHours:
      0

  MEDIUM:
    owner:
      domain-owner
    artifact:
      short-ADR
    SLAHours:
      24

  HIGH:
    owner:
      cross-functional-review
    artifact:
      RFC-and-ADR
    SLAHours:
      72

  CRITICAL:
    owner:
      decision-authority
    artifact:
      RFC-experiments-executive-risk
    SLAHours:
      120

  hiddenApproval:
    forbidden
```

---

### 20. Criar Risk Based Review

```java
package br.com.formacao.lightgovernance.review;

import br.com.formacao.lightgovernance.decision.DecisionRisk;
import java.util.List;

public record RiskBasedReview(
        String reviewId,
        DecisionRisk risk,
        ReviewScope scope,
        List<ReviewTrigger> triggers,
        List<ReviewEvidence> evidence,
        String owner,
        int SLAHours) {

    public RiskBasedReview {
        triggers = List.copyOf(triggers);
        evidence = List.copyOf(evidence);
    }
}
```

---

### 21. Criar fóruns

Arquivo:

```text
governance/ARCHITECTURE_FORUMS.md
```

Fóruns:

```text
Team Design Review:
decisoes locais de medio risco.

Domain Architecture Sync:
boundaries e contratos.

Platform Council:
golden paths e plataformas.

Security and Data Review:
riscos especificos.

Enterprise Architecture Forum:
cross-domain, fornecedor e portfolio.

Executive Risk Forum:
trade-offs de risco, custo e prazo.
```

Cada fórum define:

- escopo;
- decisões aceitas;
- participantes;
- frequência;
- SLA;
- artefato;
- método assíncrono;
- owner;
- anti-patterns.

---

### 22. Evitar meeting-first governance

Antes de marcar reunião:

- existe decisão clara?
- owner está definido?
- documento foi lido?
- comentários assíncronos foram resolvidos?
- existe conflito real?
- a decisão precisa de interação?

Muitas revisões podem ocorrer assíncronamente.

---

### 23. Criar lifecycle de padrões

Arquivo:

```text
governance/STANDARD_LIFECYCLE.md
```

Status:

```text
DRAFT;

PROPOSED;

ACTIVE;

DEPRECATED;

RETIRED.
```

Transições exigem:

- owner;
- motivação;
- evidência;
- impacto;
- migração;
- adoção;
- exceções;
- depreciação;
- comunicação.

---

### 24. Criar Technical Standard

```java
package br.com.formacao.lightgovernance.standard;

import java.time.Instant;
import java.util.List;

public record TechnicalStandard(
        String id,
        String name,
        StandardVersion version,
        StandardStatus status,
        String owner,
        String scope,
        List<String> mandatoryRules,
        List<String> migrationSteps,
        Instant reviewAt) {

    public TechnicalStandard {
        mandatoryRules = List.copyOf(mandatoryRules);
        migrationSteps = List.copyOf(migrationSteps);
    }
}
```

---

### 25. Deprecar padrão

Depreciação precisa informar:

```text
por que;

substituto;

quem e afetado;

prazo;

ferramenta de migracao;

suporte;

excecoes;

data de retirada.
```

Não remova suporte sem visibilidade.

---

### 26. Criar Exception Policy

Arquivo:

```text
governance/EXCEPTION_POLICY.md
```

Toda exceção exige:

- guardrail;
- escopo;
- owner;
- justificativa;
- risco;
- controle compensatório;
- prazo;
- plano de remoção;
- approver;
- evidência;
- revisão;
- status.

Exceção sem expiração vira padrão oculto.

---

### 27. Criar Governance Exception

```java
package br.com.formacao.lightgovernance.exception;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

public record GovernanceException(
        String id,
        String guardrailId,
        String scope,
        String owner,
        String justification,
        List<ExceptionControl> compensatingControls,
        Instant approvedAt,
        Instant expiresAt,
        String removalPlan,
        ExceptionStatus status) {

    public GovernanceException {
        Objects.requireNonNull(id);
        Objects.requireNonNull(guardrailId);
        Objects.requireNonNull(scope);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(justification);
        compensatingControls =
                List.copyOf(compensatingControls);
        Objects.requireNonNull(approvedAt);
        Objects.requireNonNull(expiresAt);
        Objects.requireNonNull(removalPlan);
        Objects.requireNonNull(status);

        if (!expiresAt.isAfter(approvedAt)) {
            throw new IllegalArgumentException(
                    "Exception must expire");
        }
    }
}
```

---

### 28. Testar exceção expirada

Cenário:

- exceção aprovada;
- prazo vencido;
- mudança tenta usar exceção;
- pipeline verifica;
- resultado `FAIL_EXCEPTION_EXPIRED`.

Renovação precisa de nova análise.

---

### 29. Criar Policy as Code

Arquivo:

```text
governance/POLICY_AS_CODE.md
```

Automatize:

```text
secret scan;

dependency policy;

license policy;

API compatibility;

event schema compatibility;

ArchUnit;

tenant isolation;

metric cardinality;

SLO presence;

runbook presence;

rollback declaration;

exception expiration;

artifact provenance.
```

Automação reduz fila e variabilidade.

---

### 30. Definir níveis de enforcement

Níveis:

```text
INFORM:
gera feedback.

WARN:
gera finding nao bloqueante.

BLOCK:
impede merge ou release.

ESCALATE:
exige decisao explicita.
```

Novas policies podem começar em `INFORM`, medir falsos positivos e evoluir para `BLOCK`.

---

### 31. Criar contrato de policy as code

Arquivo:

```text
contracts/policy-as-code-policy.yaml
```

Conteúdo:

```yaml
policyAsCode:
  required:
    - policy-id
    - owner
    - severity
    - scope
    - version
    - evidence
    - failure-message
    - remediation
    - exception-process

  rollout:
    stages:
      - INFORM
      - WARN
      - BLOCK

  silentFailure:
    forbidden

  manualCheckWhenAutomatable:
    discouraged
```

---

### 32. Criar scorecard

Arquivo:

```text
governance/GOVERNANCE_SCORECARD.md
```

Dimensões:

```text
ownership;

security;

data;

contracts;

reliability;

observability;

cost;

delivery;

documentation;

exceptions.
```

Scorecard deve apoiar melhoria.

Não deve ser ranking público de equipes.

---

### 33. Criar Governance Scorecard

```java
package br.com.formacao.lightgovernance.metric;

import java.util.Map;

public record GovernanceScorecard(
        String scope,
        Map<String, Integer> dimensions,
        String owner,
        String improvementPlan) {

    public GovernanceScorecard {
        dimensions = Map.copyOf(dimensions);

        dimensions.forEach((name, value) -> {
            if (value < 0 || value > 100) {
                throw new IllegalArgumentException(
                        "Score must be between 0 and 100");
            }
        });
    }
}
```

---

### 34. Medir fluxo da governança

Arquivo:

```text
governance/GOVERNANCE_FLOW_METRICS.md
```

Métricas:

```text
review lead time;

time waiting for review;

first response time;

rework rate;

decision reopen rate;

exception count;

expired exceptions;

guardrail failure rate;

golden path adoption;

policy false positive rate;

forum decision rate;

review SLA compliance;

team satisfaction.
```

Governança lenta precisa ser tratada como problema do sistema.

---

### 35. Medir outcomes

Não meça apenas processo.

Outcomes:

```text
incidentes por violacao;

breaking changes;

cross-tenant findings;

rollback success;

tempo de onboarding;

tempo para primeiro deploy;

custo evitado;

redução de tecnologia duplicada;

migração de padrões;

exceções encerradas.
```

---

### 36. Criar modelo federado

Arquivo:

```text
governance/FEDERATED_GOVERNANCE.md
```

Papéis:

```text
product teams:
decisoes locais.

domain architects:
boundaries e contracts.

platform teams:
golden paths.

security and data:
guardrails especializados.

enterprise architecture:
portfolio e cross-domain.

executive authority:
risco, investimento e prazo.
```

A federação distribui decisão sem perder alinhamento.

---

### 37. Criar Operating Model

Arquivo:

```text
governance/OPERATING_MODEL.md
```

Registre:

- governance owner;
- domain owners;
- platform owners;
- guardrail owners;
- forum owners;
- exception approvers;
- SLA;
- cadência;
- comunicação;
- revisão de métricas;
- revisão de standards;
- retrospectiva;
- escalation;
- evidence owner.

---

### 38. Criar Communication Plan

Arquivo:

```text
governance/COMMUNICATION_PLAN.md
```

Comunicações:

```text
novo guardrail;

novo golden path;

standard deprecado;

excecao vencendo;

mudanca de forum;

policy em modo WARN;

policy em modo BLOCK;

resultado do scorecard;

melhoria de SLA.
```

Governança escondida perde legitimidade.

---

### 39. Testar revisão de baixo risco

Mudança:

```text
refatorar package interno.
```

Resultado:

- time decide;
- testes locais;
- sem fórum;
- sem ADR corporativo;
- nenhum bloqueio central.

---

### 40. Testar revisão de médio risco

Mudança:

```text
novo endpoint interno
sem breaking change.
```

Resultado:

- owner do domínio revisa;
- contrato atualizado;
- observabilidade;
- ADR curto quando necessário;
- SLA de 24 horas.

---

### 41. Testar revisão de alto risco

Mudança:

```text
novo evento cross-domain
com dado pessoal.
```

Resultado:

- owners de produtor e consumers;
- data review;
- security review;
- schema;
- compatibilidade;
- retenção;
- autorização;
- observabilidade;
- RFC e ADR;
- rollout;
- evidence.

---

### 42. Testar guardrail violado

Cenário:

```text
metric label:
appointment_id.
```

Resultado:

```text
BLOCK_GR_OBS_001
```

A mensagem deve explicar:

- guardrail;
- risco;
- correção;
- owner;
- processo de exceção.

---

### 43. Testar golden path desatualizado

Cenário:

- template usa biblioteca vulnerável;
- times seguem golden path;
- finding aparece em vários serviços.

A responsabilidade não é apenas dos times.

O owner do path precisa atualizar, comunicar e apoiar migração.

---

### 44. Testar standard sem owner

Padrão ativo sem owner deve falhar.

Resultado:

```text
FAIL_STANDARD_OWNER
```

Sem owner, não existe evolução, suporte ou depreciação responsável.

---

### 45. Testar exceção sem controle compensatório

Exceção para desabilitar mTLS sem controle alternativo.

Resultado:

```text
FAIL_EXCEPTION_CONTROL
```

Alguns guardrails críticos podem proibir exceção.

---

### 46. Testar policy com falso positivo

Cenário:

- policy bloqueia artefato legítimo;
- falsos positivos ultrapassam threshold;
- enforcement muda temporariamente de `BLOCK` para `WARN`;
- owner corrige a regra;
- evidence é preservada.

Policies também precisam de lifecycle.

---

### 47. Testar review SLA

Cenário:

- review HIGH;
- SLA 72 horas;
- primeira resposta ocorre em 96 horas.

Resultado:

```text
FAIL_REVIEW_SLA
```

O fórum precisa revisar capacidade, agenda ou escopo.

---

### 48. Criar retrospectiva

Arquivo:

```text
governance/RETROSPECTIVE.md
```

Perguntas:

```text
qual guardrail evitou risco?

qual policy gerou ruido?

qual review demorou?

qual forum decidiu?

qual forum apenas discutiu?

qual excecao virou divida?

qual golden path reduziu trabalho?

qual padrao precisa ser deprecado?

onde ownership esta confuso?

qual verificacao pode ser automatizada?
```

---

### 49. Testar arquitetura

```java
package br.com.formacao.lightgovernance.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

public class GovernanceBoundaryTest {

    @ArchTest
    static final ArchRule domainMustNotDependOnGovernanceEngine =
            noClasses()
                    .that()
                    .resideInAPackage("..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..governanceengine..");
}
```

Governança verifica e orienta o sistema.

O domínio não deve depender de uma ferramenta central de governança.

---

### 50. Criar reports

Exemplo:

```yaml
lightweightGovernance:
  decisions:
    total:
      42
    withOwner:
      42
    local:
      29
    coordinated:
      13

  guardrails:
    total:
      18
    automated:
      15
    violated:
      1

  goldenPaths:
    total:
      8
    adoptionPercent:
      74

  reviews:
    total:
      16
    SLACompliancePercent:
      93
    averageLeadTimeHours:
      21

  exceptions:
    active:
      4
    expired:
      0
    withoutRemovalPlan:
      0

  gate:
    PASS
```

---

### 51. Criar evidence

Arquivo:

```text
contracts/lightweight-governance-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- decision category count;
- decision owner coverage;
- local decision count;
- coordinated decision count;
- guardrail count;
- automated guardrail count;
- guardrail violation count;
- golden path count;
- golden path adoption;
- review count;
- review SLA compliance;
- average review lead time;
- standard count;
- ownerless standard count;
- active exception count;
- expired exception count;
- exception removal plan coverage;
- policy false positive rate;
- forum decision rate;
- scorecard status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais;
- decisões confidenciais;
- fornecedores reais;
- contratos;
- custos reais;
- vulnerabilidades exploráveis;
- credenciais;
- endpoints privados;
- topologia real;
- documentação viva aprofundada da aula 663.

---

### 52. Criar o Gate

O gate valida:

- charter;
- princípios;
- decision catalog;
- decision rights;
- risk classification;
- guardrails;
- golden paths;
- review triggers;
- forums;
- standard lifecycle;
- exceptions;
- policy as code;
- scorecard;
- flow metrics;
- federated governance;
- ownership;
- communication;
- retrospective;
- tests;
- architecture;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_GOVERNANCE_CHARTER;

FAIL_DECISION_CATALOG;

FAIL_DECISION_RIGHTS;

FAIL_RISK_CLASSIFICATION;

FAIL_GUARDRAIL;

FAIL_GOLDEN_PATH;

FAIL_REVIEW_TRIGGER;

FAIL_REVIEW_SLA;

FAIL_FORUM;

FAIL_STANDARD_LIFECYCLE;

FAIL_STANDARD_OWNER;

FAIL_EXCEPTION;

FAIL_EXCEPTION_EXPIRATION;

FAIL_POLICY_AS_CODE;

FAIL_SCORECARD;

FAIL_FLOW_METRIC;

FAIL_FEDERATED_OWNERSHIP;

FAIL_COMMUNICATION;

FAIL_RETROSPECTIVE;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 53. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\validate-governance-contract.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-decision-rights.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-risk-classification.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-guardrail-catalog.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-golden-paths.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-review-triggers.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-standard-lifecycle.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-exception-policy.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-policy-as-code.ps1

.\scripts\m19\service-scheduling-lightweight-governance\validate-governance-scorecard.ps1

.\scripts\m19\service-scheduling-lightweight-governance\run-lightweight-governance-tests.ps1

.\scripts\m19\service-scheduling-lightweight-governance\collect-lightweight-governance-evidence.ps1

.\scripts\m19\service-scheduling-lightweight-governance\verify-lightweight-governance-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 54. Encerrar o laboratório

Confirme:

- charter;
- princípios;
- decisões governadas;
- decisões locais;
- decision rights;
- classificação de risco;
- guardrails;
- guidelines;
- golden paths;
- review triggers;
- fóruns;
- lifecycle de padrões;
- exceções temporárias;
- controles compensatórios;
- policy as code;
- níveis de enforcement;
- scorecard;
- métricas de fluxo;
- modelo federado;
- ownership;
- comunicação;
- retrospectiva;
- reports;
- evidence;
- gate aprovado;
- documentação viva não antecipada.

---

## Entendendo o que foi feito

### A governança ganhou limites

Nem toda decisão precisa de fórum.

Mudanças locais e reversíveis permanecem com os times.

Decisões cross-domain, críticas ou irreversíveis recebem coordenação proporcional.

### Decision rights reduziram política informal

Ficou explícito quem decide, quem contribui, quem pode bloquear por guardrail, quem deve ser informado e quando escalonar.

### Guardrails substituíram preferências

Bloqueios passaram a apontar riscos verificáveis.

Preferências continuam como guidelines.

### Golden paths reduziram custo de conformidade

O caminho recomendado passou a incluir templates, automação, segurança, observabilidade e suporte.

Governança deixou de exigir que cada time descubra tudo sozinho.

### Revisão passou a considerar risco

Baixo risco segue fluxo local.

Médio risco usa owner e evidência curta.

Alto risco envolve revisão multidisciplinar.

### Exceções ganharam lifecycle

Exceção possui owner, prazo, controle compensatório e plano de remoção.

Não existe waiver permanente silencioso.

### A própria governança tornou-se observável

Lead time, SLA, falsos positivos, adoção, exceções e satisfação passaram a ser medidos.

Governança que atrasa entrega precisa melhorar seu próprio sistema.

---

## Erros comuns importantes

### Centralizar todas as decisões

O centro vira gargalo e perde contexto de domínio.

### Confundir guideline com guardrail

Preferências passam a bloquear entrega sem risco real.

### Criar fórum sem decision right

A reunião discute, mas ninguém sabe quem decide.

### Exigir documento longo para risco baixo

O custo do processo supera o benefício.

### Criar golden path sem suporte

O template envelhece e os times abandonam o caminho.

### Deixar padrão sem owner

Ninguém atualiza, suporta ou deprecia.

### Conceder exceção sem expiração

A dívida vira estado permanente.

### Automatizar policy com mensagem ruim

O time recebe bloqueio sem compreender risco ou correção.

### Medir governança por quantidade de aprovações

Mais aprovações não significam mais qualidade.

### Usar scorecard para punir equipes

A métrica perde confiança e gera comportamento defensivo.

### Ignorar custo da governança

Filas, reuniões e retrabalho também são desperdício.

### Antecipar documentação viva

Lifecycle e registros aparecem aqui, mas sincronização documental completa fica para a aula 663.

---

## Comandos úteis

### Validar decision rights

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\validate-decision-rights.ps1
```

### Validar guardrails

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\validate-guardrail-catalog.ps1
```

### Validar exceções

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\validate-exception-policy.ps1
```

### Validar policy as code

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\validate-policy-as-code.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\run-lightweight-governance-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-lightweight-governance\verify-lightweight-governance-gate.ps1
```

---

## Exercício guiado

Modele a governança para:

```text
adotar um novo banco
para workloads analiticos
de Service Scheduling.
```

Crie:

1. categoria da decisão;
2. decision owner;
3. contributors;
4. classificação de risco;
5. guardrails;
6. review triggers;
7. evidências;
8. fórum;
9. standard lifecycle;
10. golden path;
11. policy as code;
12. exception policy;
13. scorecard;
14. flow metrics;
15. gate.

Explique quais decisões permanecem com o time e quais exigem coordenação corporativa.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 661 e ponte para a aula 663 foram preservadas;
- laboratório `service-scheduling-lightweight-governance` foi criado;
- Technical Governance Charter foi criado;
- princípios de governança foram definidos;
- Decision Catalog foi criado;
- categorias de decisão foram registradas;
- Decision Rights Matrix foi criada;
- direitos `DECIDE`, `CONTRIBUTE`, `CONSULT`, `BLOCK_ON_GUARDRAIL`, `INFORM` e `ESCALATE` foram definidos;
- decisões locais permanecem com os times;
- bloqueio por preferência foi proibido;
- Risk Classification foi criada;
- blast radius, reversibility, dados, segurança, compliance, custo e coupling foram considerados;
- Guardrail Catalog foi criado;
- guardrails possuem owner, propósito, evidência e failure action;
- guidelines foram diferenciadas de guardrails;
- Golden Path Catalog foi criado;
- paths possuem owner, versão, suporte e depreciação;
- adoção e satisfação foram medidas;
- Review Trigger Catalog foi criado;
- revisão foi proporcional ao risco;
- SLAs de revisão foram definidos;
- Architecture Forums foram definidos;
- meeting-first governance foi evitada;
- Standard Lifecycle foi criado;
- padrões possuem owner e review date;
- depreciação possui substituto e plano;
- Exception Policy foi criada;
- exceções possuem prazo, controle compensatório e plano de remoção;
- exceção expirada foi bloqueada;
- Policy as Code foi criada;
- níveis `INFORM`, `WARN`, `BLOCK` e `ESCALATE` foram definidos;
- policies possuem mensagens e remediação;
- Governance Scorecard foi criado;
- scorecard não foi usado como ranking de pessoas;
- métricas de fluxo foram criadas;
- outcomes foram medidos;
- modelo federado foi criado;
- Operating Model foi criado;
- Communication Plan foi criado;
- revisão de baixo, médio e alto risco foi testada;
- guardrail violado foi testado;
- golden path desatualizado foi tratado;
- standard sem owner foi bloqueado;
- exceção sem controle foi bloqueada;
- falso positivo de policy foi tratado;
- Review SLA foi testado;
- Retrospective foi criada;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- documentação arquitetural viva não foi antecipada.

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
  labs/m19/aula-662-governanca-tecnica-leve/service-scheduling-lightweight-governance `
  scripts/m19/service-scheduling-lightweight-governance `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realVendor|contractValue|realEmployee|privateDecision|productionTopology|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): modelar governanca tecnica leve"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- nomes reais;
- decisões confidenciais;
- contratos reais;
- custos reais;
- avaliações individuais;
- credenciais;
- endpoints privados;
- topologia real;
- documentação viva da aula 663.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou governança técnica leve.

Você criou:

```text
Technical Governance Charter;

Governance Principles;

Decision Catalog;

Decision Rights Matrix;

Risk Classification;

Guardrail Catalog;

Golden Path Catalog;

Review Trigger Catalog;

Architecture Forums;

Standard Lifecycle;

Exception Policy;

Policy as Code;

Governance Scorecard;

Governance Flow Metrics;

Federated Governance;

Operating Model;

Communication Plan;

Retrospective;

reports, evidence e gate.
```

Você comprovou que governança não precisa significar centralização.

Decisões locais, reversíveis e de baixo risco permanecem com os times.

Decisões críticas, cross-domain ou irreversíveis recebem revisão proporcional.

Decision rights tornam ownership explícito.

Guardrails protegem limites obrigatórios.

Guidelines orientam sem bloquear.

Golden paths reduzem o custo de fazer o certo.

Policies automatizadas diminuem filas.

Exceções possuem prazo e plano de remoção.

Padrões possuem lifecycle.

A governança mede o próprio lead time, seus falsos positivos, sua adoção e seus outcomes.

A próxima aula será:

```text
663 - M19.53 - Documentacao arquitetural viva
```

Nela, você irá aprofundar como manter decisões, diagramas, contratos, runbooks, standards, evidências e contexto sincronizados com a arquitetura real, evitando documentação abandonada ou divergente.

Nenhum aprofundamento completo de documentação arquitetural viva foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini decision rights.
- [ ] Classifiquei riscos.
- [ ] Criei guardrails.
- [ ] Diferenciei guidelines.
- [ ] Criei golden paths.
- [ ] Defini review triggers.
- [ ] Criei fóruns.
- [ ] Modelei lifecycle de padrões.
- [ ] Criei exceções temporárias.
- [ ] Automatizei policies.
- [ ] Criei scorecard.
- [ ] Medi fluxo e outcomes.

---

## Troubleshooting adicional

### Tudo precisa passar pelo fórum

Revise decision rights e classificação de risco.

### O arquiteto bloqueia por preferência

Exija guardrail, risco e evidência.

### O time evita o golden path

Meça atrito, suporte, limitações e tempo para primeiro deploy.

### A exceção nunca termina

Exija expiração, owner, remoção e revisão.

### A policy gera muitos falsos positivos

Reduza enforcement, corrija regra e acompanhe métrica.

### O review demora dias

Revise SLA, escopo, capacidade e async-first.

### O standard não possui adoção

Verifique valor, suporte, migração e legitimidade.

### O scorecard gera competição ruim

Remova ranking e use plano de melhoria.

### O fórum discute sem decidir

Defina decision owner, opções, critérios e prazo.

### O time não sabe quem consultar

Atualize Decision Rights Matrix e catálogo de owners.

### A documentação diverge da realidade

Preserve o aprofundamento para a aula 663.

---

## Perguntas de revisão

1. O que é governança técnica leve?
2. Qual diferença entre governança e centralização?
3. O que são decision rights?
4. Quem pode bloquear uma decisão?
5. O que é guardrail?
6. Qual diferença entre guardrail e guideline?
7. O que é golden path?
8. Por que medir adoção?
9. O que é revisão baseada em risco?
10. Qual decisão deve ficar com o time?
11. Quando usar fórum?
12. O que é meeting-first governance?
13. Qual lifecycle de um padrão?
14. Por que padrão precisa de owner?
15. O que uma exceção precisa conter?
16. Por que exceção precisa expirar?
17. O que é policy as code?
18. Quais níveis de enforcement existem?
19. O que o scorecard deve apoiar?
20. Por que medir lead time de governança?
21. O que é governança federada?
22. Como evitar veto por preferência?
23. O que torna um fórum eficaz?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Coordenação proporcional por limites, ownership e evidência.
2. Governança distribui decisões; centralização concentra.
3. Direitos explícitos de decidir, contribuir, bloquear e escalar.
4. Quem possui direito associado a guardrail obrigatório.
5. Limite técnico verificável.
6. Obrigação versus recomendação.
7. Caminho suportado para executar com segurança.
8. Para saber se reduz atrito.
9. Processo proporcional ao impacto e reversibilidade.
10. Mudança local, reversível e dentro de guardrails.
11. Quando existe decisão cross-domain ou conflito relevante.
12. Marcar reunião antes de tentar decisão assíncrona.
13. Draft, proposed, active, deprecated e retired.
14. Para evolução, suporte e depreciação.
15. Owner, prazo, risco, controle e remoção.
16. Para não virar padrão oculto.
17. Regra de governança automatizada.
18. Inform, warn, block e escalate.
19. Melhoria de capacidade e risco.
20. Porque governança também pode gerar desperdício.
21. Distribuição de decisão por níveis e owners.
22. Exigindo guardrail, risco e evidência.
23. Escopo, owner, decisão e SLA claros.
24. Documentação arquitetural viva.
25. Documentação arquitetural viva.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 662 - M19.52 - Governanca tecnica leve

- Continuei após Arquitetura corporativa brasileira.
- Tratei governança como coordenação proporcional.
- Criei o laboratório `service-scheduling-lightweight-governance`.
- Criei Technical Governance Charter.
- Defini princípios de autonomia com boundaries.
- Criei Decision Catalog.
- Criei Decision Rights Matrix.
- Defini direitos de decidir, contribuir, consultar, bloquear, informar e escalar.
- Mantive decisões locais com os times.
- Criei Risk Classification.
- Classifiquei blast radius, reversibility, dados, segurança, compliance, custo e coupling.
- Criei Guardrail Catalog.
- Diferenciei guardrails e guidelines.
- Criei Golden Path Catalog.
- Modelei owner, versão, suporte e depreciação.
- Medi adoção dos golden paths.
- Criei Review Trigger Catalog.
- Apliquei review proporcional ao risco.
- Defini SLAs de review.
- Criei Architecture Forums.
- Evitei meeting-first governance.
- Criei Standard Lifecycle.
- Exigi owner e review date.
- Criei Exception Policy.
- Exigi prazo, controle compensatório e plano de remoção.
- Testei exceção expirada.
- Criei Policy as Code.
- Defini enforcement INFORM, WARN, BLOCK e ESCALATE.
- Criei Governance Scorecard.
- Evitei ranking de pessoas.
- Criei métricas de fluxo e outcomes.
- Modelei governança federada.
- Criei Operating Model e Communication Plan.
- Testei reviews de baixo, médio e alto risco.
- Testei guardrails, standards, exceções e policies.
- Criei Retrospective.
- Criei reports, evidence e gate.
- Não antecipei documentação arquitetural viva.
- Próxima aula: Documentacao arquitetural viva.
```

---

## Referência técnica curta

- Lightweight Governance.
- Decision Rights.
- Risk Classification.
- Guardrail.
- Guideline.
- Golden Path.
- Risk-Based Review.
- Architecture Forum.
- Standard Lifecycle.
- Governance Exception.
- Compensating Control.
- Policy as Code.
- Enforcement Level.
- Governance Scorecard.
- Flow Metric.
- Federated Governance.

Regra final:

```text
Governança técnica leve deve coordenar decisões proporcionais ao risco sem retirar autonomia dos times: o catálogo de decisões separa mudanças locais de decisões cross-domain, decision rights definem quem decide, contribui, consulta, bloqueia por guardrail, informa ou escala, e nenhum veto é aceito apenas por preferência; risco considera blast radius, reversibilidade, dados, segurança, compliance, custo, operação e coupling, guardrails protegem limites verificáveis enquanto guidelines orientam, e golden paths tornam o caminho seguro mais simples por meio de templates, automação, suporte, versões e depreciação; reviews de baixo risco permanecem locais, médio risco exige owner e evidência curta, alto ou crítico envolve owners multidisciplinares, RFC, ADR, experimentos, rollout e autoridade explícita, fóruns possuem escopo, decisão, SLA e operação assíncrona, padrões percorrem lifecycle com owner e migração, exceções possuem prazo, risco, controle compensatório e plano de remoção, e policy as code evolui de INFORM para WARN e BLOCK com mensagem e remediação; scorecards, lead time, falsos positivos, adoção, exceções e outcomes tornam a própria governança observável, o modelo federado distribui decisões entre times, domínios, plataformas, segurança, dados e arquitetura corporativa, e o gate termina com charter, decision rights, risk classification, guardrails, golden paths, reviews, standards, exceptions, policies, scorecard, metrics, ownership, testes, reports e evidence aprovados, enquanto documentação arquitetural viva permanece reservada para a aula 663.
```
