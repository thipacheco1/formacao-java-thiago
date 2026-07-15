# 658 - M19.48 - Code review arquitetural

## Apresentação da aula

Na aula 657, você tratou dados como decisão arquitetural.

Você definiu autoridade, ownership, contratos, qualidade, consistência, réplicas, lineage, lifecycle, retenção, acesso, migração, backfill, reconciliation e observabilidade de dados. O desenho deixou claro que uma tabela, um evento ou uma API não são apenas detalhes de implementação: cada um materializa responsabilidades, fronteiras e riscos.

Agora surge a pergunta que acompanha toda arquitetura depois que os diagramas, ADRs, RFCs e políticas foram aprovados:

```text
como garantir que o código novo
continua respeitando
as decisões arquiteturais
quando dezenas de mudanças
entram no repositório
semana após semana?
```

Arquitetura também se degrada por pequenas mudanças aparentemente inocentes: acesso direto a outro banco, chamada remota dentro da transação, evento que expõe entidade, métrica com ID como label, retry sem deadline, flag sem remoção ou exceção sem owner. O efeito acumulado cria acoplamento, risco operacional e dificuldade de evolução.

Code review arquitetural é a prática de revisar uma mudança não apenas para descobrir bugs locais ou problemas de estilo, mas para verificar se ela preserva:

- fronteiras de domínio;
- direção de dependências;
- autoridade sobre dados;
- invariantes;
- contratos externos;
- limites transacionais;
- comportamento distribuído;
- segurança;
- observabilidade;
- performance;
- operabilidade;
- estratégia de evolução;
- decisões registradas.

A profundidade da revisão deve ser proporcional ao risco: uma correção de texto não exige o mesmo processo que integração, schema, command crítico ou contrato externo.

O laboratório será:

```text
labs/m19/aula-658-code-review-arquitetural/service-scheduling-architecture-review
```

Você irá revisar uma proposta fictícia chamada:

```text
Express Appointment Confirmation
```

A mudança promete confirmar um `Appointment` mais rapidamente, mas o primeiro diff contém problemas arquiteturais:

- regra de negócio no controller;
- acesso direto a dados de `Capacity`;
- side effect dentro da transação;
- autorização incompleta;
- evento incompatível;
- telemetria de alta cardinalidade;
- query N+1;
- retry sem limite;
- feature flag sem lifecycle;
- ausência de estratégia de rollout e rollback.

Você criará:

- Architecture Review Charter;
- classificação de risco da mudança;
- mapa de arquivos e componentes afetados;
- change impact map;
- catálogo de concerns;
- checklist proporcional ao risco;
- modelo de finding;
- regras de bloqueio;
- evidências obrigatórias;
- seleção de reviewers;
- comentários acionáveis;
- revisão síncrona e assíncrona;
- gate automatizado;
- relatório final;
- evidence sanitizada.

A próxima aula será:

```text
659 - M19.49 - Lideranca tecnica
```

Liderança técnica, influência, alinhamento, conflitos, priorização e decisão coletiva serão aprofundados na aula 659.

Nesta aula, comunicação aparece somente no contexto de uma revisão técnica respeitosa, objetiva e acionável.

Regra central:

```text
code review arquitetural
não procura apenas
se o código funciona;

procura se a mudança
preserva fronteiras,
risco aceitável,
capacidade operacional
e possibilidade de evolução.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
655:
Observabilidade como decisao arquitetural.

656:
Seguranca como decisao arquitetural.

657:
Dados como decisao arquitetural.

658:
Code review arquitetural.

659:
Lideranca tecnica.
```

A progressão é:

```text
explicar o comportamento;

proteger ativos e boundaries;

tratar dados como responsabilidade;

verificar decisões no código;

liderar decisões e pessoas.
```

Os conhecimentos anteriores de DDD, arquitetura hexagonal, contratos, eventos, consistência, segurança, observabilidade, ADR, RFC, C4, fitness functions e ArchUnit serão reunidos em um fluxo de revisão aplicável a pull requests reais.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-658-code-review-arquitetural
└── service-scheduling-architecture-review
    ├── pom.xml
    ├── README.md
    ├── sample-change
    │   ├── BEFORE_REVIEW.md
    │   ├── AFTER_REVIEW.md
    │   ├── CHANGE_REQUEST.md
    │   └── REVIEW_THREAD.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/architecturereview
    │   │           ├── change
    │   │           │   ├── ChangeRequest.java
    │   │           │   ├── ChangeRisk.java
    │   │           │   ├── ChangedFile.java
    │   │           │   ├── ChangeImpact.java
    │   │           │   └── ChangeClassification.java
    │   │           ├── concern
    │   │           │   ├── ArchitecturalConcern.java
    │   │           │   ├── ConcernCategory.java
    │   │           │   ├── ConcernSeverity.java
    │   │           │   └── ConcernCatalog.java
    │   │           ├── finding
    │   │           │   ├── ReviewFinding.java
    │   │           │   ├── FindingStatus.java
    │   │           │   ├── FindingEvidence.java
    │   │           │   └── FindingResolution.java
    │   │           ├── reviewer
    │   │           │   ├── ReviewerRole.java
    │   │           │   ├── ReviewerProfile.java
    │   │           │   ├── ReviewerSelection.java
    │   │           │   └── OwnershipRule.java
    │   │           ├── checklist
    │   │           │   ├── ReviewChecklist.java
    │   │           │   ├── ReviewQuestion.java
    │   │           │   ├── ReviewAnswer.java
    │   │           │   └── ReviewScope.java
    │   │           ├── decision
    │   │           │   ├── ReviewDecision.java
    │   │           │   ├── DecisionOutcome.java
    │   │           │   ├── RequiredAction.java
    │   │           │   └── FollowUp.java
    │   │           └── gate
    │   │               ├── ArchitectureReviewGate.java
    │   │               ├── GatePolicy.java
    │   │               ├── GateFinding.java
    │   │               └── GateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/architecturereview
    │               ├── change
    │               │   ├── ChangeClassificationTest.java
    │               │   └── ImpactMapTest.java
    │               ├── finding
    │               │   ├── FindingQualityTest.java
    │               │   └── BlockingFindingTest.java
    │               ├── checklist
    │               │   ├── ProportionalReviewTest.java
    │               │   └── RequiredEvidenceTest.java
    │               └── architecture
    │                   ├── BoundaryReviewRuleTest.java
    │                   ├── DataAuthorityReviewRuleTest.java
    │                   ├── LeadershipNonAnticipationTest.java
    │                   └── MentoringNonAnticipationTest.java
    ├── review
    │   ├── ARCHITECTURE_REVIEW_CHARTER.md
    │   ├── CHANGE_RISK_MODEL.md
    │   ├── REVIEW_SCOPE_POLICY.md
    │   ├── ARCHITECTURAL_CONCERN_CATALOG.md
    │   ├── REVIEW_CHECKLIST.md
    │   ├── REVIEWER_SELECTION_POLICY.md
    │   ├── COMMENT_POLICY.md
    │   ├── EVIDENCE_POLICY.md
    │   ├── BLOCKING_POLICY.md
    │   ├── EXCEPTION_POLICY.md
    │   ├── REVIEW_SLA.md
    │   ├── OPERATING_MODEL.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_REVIEW_QUESTIONS.md
    ├── contracts
    │   ├── architecture-review-contract.yaml
    │   ├── change-classification-policy.yaml
    │   ├── boundary-review-policy.yaml
    │   ├── data-authority-review-policy.yaml
    │   ├── distributed-change-review-policy.yaml
    │   ├── security-review-policy.yaml
    │   ├── observability-review-policy.yaml
    │   ├── performance-review-policy.yaml
    │   ├── migration-review-policy.yaml
    │   ├── evidence-policy.yaml
    │   ├── reviewer-policy.yaml
    │   ├── blocking-policy.yaml
    │   ├── exception-policy.yaml
    │   ├── failure-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── change-impact-report.yaml
        ├── review-finding-report.yaml
        ├── reviewer-coverage-report.yaml
        ├── evidence-coverage-report.yaml
        ├── unresolved-risk-report.yaml
        ├── architecture-report.yaml
        └── architecture-review-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-architecture-review
├── validate-review-contract.ps1
├── validate-change-classification.ps1
├── validate-impact-map.ps1
├── validate-review-findings.ps1
├── validate-reviewer-coverage.ps1
├── validate-required-evidence.ps1
├── validate-blocking-policy.ps1
├── run-architecture-review-tests.ps1
├── collect-architecture-review-evidence.ps1
└── verify-architecture-review-gate.ps1
```

---

## Conceito essencial

### Code review local e code review arquitetural

Uma revisão local verifica método, nome, teste e bug evidente. Uma revisão arquitetural pergunta:

```text
a mudança pertence a este boundary?

quem continua autoridade pelo dado?

a direção da dependência permanece correta?

qual novo acoplamento foi criado?

qual falha distribuída aparece?

qual contrato externo muda?

qual risco de segurança foi introduzido?

como a mudança será observada,
liberada,
revertida
e removida?
```

As duas revisões são necessárias; a arquitetural adiciona contexto sistêmico.

### Profundidade proporcional ao risco

Nem todo pull request precisa de revisão profunda.

Classifique a mudança considerando:

- boundary afetado;
- criticidade do fluxo;
- dados alterados;
- contrato externo;
- segurança;
- distribuição;
- volume;
- irreversibilidade;
- blast radius;
- dificuldade de rollback;
- conhecimento concentrado;
- impacto operacional.

A alteração pode ser `LOW`, `MEDIUM`, `HIGH` ou `CRITICAL`. Mudanças `HIGH` e `CRITICAL` exigem evidências e reviewers especializados.

### Finding bom é verificável

Um comentário fraco diz:

```text
não gostei dessa abordagem.
```

Um finding arquitetural útil registra:

- localização;
- concern;
- evidência;
- risco;
- decisão violada;
- condição esperada;
- severidade;
- ação requerida;
- forma de validar a resolução.

A revisão discute o sistema, não a pessoa.

### Review não substitui automação

Regras determinísticas devem ser automatizadas quando possível:

- dependências proibidas;
- ciclos;
- naming;
- imports;
- contratos;
- schemas;
- segurança básica;
- cobertura obrigatória;
- secrets;
- migrations;
- compatibilidade.

O reviewer deve gastar energia com contexto, trade-offs, risco e intenção.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-658-code-review-arquitetural/service-scheduling-architecture-review

Set-Location `
  labs/m19/aula-658-code-review-arquitetural/service-scheduling-architecture-review
```

---

### 2. Criar Architecture Review Charter

Arquivo:

```text
review/ARCHITECTURE_REVIEW_CHARTER.md
```

Conteúdo:

```markdown
# Architecture Review Charter

Purpose:
preserve architectural decisions
through code changes.

Review principles:
- proportional to risk;
- evidence before opinion;
- automate deterministic rules;
- discuss code, not people;
- deny silent architectural debt;
- record exceptions;
- protect delivery flow;
- require ownership.

Critical concerns:
- domain boundary;
- data authority;
- distributed behavior;
- security;
- observability;
- performance;
- migration;
- rollback;
- operability.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/architecture-review-contract.yaml
```

Conteúdo:

```yaml
architectureReview:
  context:
    Service-Scheduling

  required:
    - change-classification
    - impact-map
    - architectural-concern-catalog
    - proportional-checklist
    - reviewer-selection
    - evidence
    - actionable-findings
    - blocking-policy
    - exception-policy
    - automated-rules
    - final-decision
    - reports
    - gate

  forbidden:
    - approval-with-unresolved-critical-finding
    - opinion-without-context
    - personal-attack
    - silent-exception
    - architecture-debt-without-owner
    - review-by-file-count-only
    - leadership-deep-dive
    - mentoring-deep-dive

  nextLesson:
    code:
      M19.49
```

---

### 4. Criar Change Request

Arquivo:

```text
sample-change/CHANGE_REQUEST.md
```

Registre:

```text
Title:
Express Appointment Confirmation.

Goal:
reduce confirmation latency
for eligible appointments.

Current behavior:
confirmation starts a Saga
and returns accepted.

Proposed behavior:
confirm synchronously
when capacity appears available.

Affected boundaries:
Scheduling;
Capacity;
Communication.

Data:
Appointment;
Capacity Reservation;
Confirmation Audit.

External contracts:
POST /appointments/{id}/confirmation;
AppointmentConfirmedV1.

Rollout:
not defined.

Rollback:
not defined.
```

A ausência de rollout e rollback já é um finding potencial.

---

### 5. Criar Change Request em Java

```java
package br.com.formacao.architecturereview.change;

import java.util.List;
import java.util.Objects;

public record ChangeRequest(
        String id,
        String title,
        String objective,
        List<String> affectedBoundaries,
        List<String> affectedContracts,
        List<ChangedFile> files) {

    public ChangeRequest {
        Objects.requireNonNull(id);
        Objects.requireNonNull(title);
        Objects.requireNonNull(objective);
        affectedBoundaries = List.copyOf(affectedBoundaries);
        affectedContracts = List.copyOf(affectedContracts);
        files = List.copyOf(files);
    }
}
```

---

### 6. Classificar risco da mudança

Arquivo:

```text
review/CHANGE_RISK_MODEL.md
```

Pontue de 0 a 3:

```text
boundary count;
critical business flow;
data authority;
external contract;
security impact;
distributed coordination;
traffic volume;
rollback difficulty;
schema migration;
operational novelty.
```

Classificação:

```text
0 a 5:
LOW.

6 a 11:
MEDIUM.

12 a 20:
HIGH.

21 a 30:
CRITICAL.
```

A mudança Express Confirmation deve ser classificada como `CRITICAL`, pois altera command crítico, dados, integração, latência, segurança e comportamento distribuído.

---

### 7. Implementar Change Classification

```java
package br.com.formacao.architecturereview.change;

public final class ChangeClassification {

    public ChangeRisk classify(int score) {
        if (score < 0 || score > 30) {
            throw new IllegalArgumentException(
                    "Score must be between 0 and 30");
        }

        if (score <= 5) {
            return ChangeRisk.LOW;
        }

        if (score <= 11) {
            return ChangeRisk.MEDIUM;
        }

        if (score <= 20) {
            return ChangeRisk.HIGH;
        }

        return ChangeRisk.CRITICAL;
    }
}
```

---

### 8. Criar Change Impact Map

Arquivo:

```text
sample-change/BEFORE_REVIEW.md
```

Mapeie:

```text
entry point;
use case;
domain rules;
database;
external calls;
messages;
cache;
telemetry;
security policy;
feature flag;
deployment;
runbook.
```

O mapa evita revisão limitada aos arquivos visíveis no diff.

Uma alteração de cinco arquivos pode afetar dez componentes externos.

---

### 9. Revisar o código inicial

Código proposto:

```java
package br.com.formacao.scheduling.api;

import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExpressConfirmationController {

    private final AppointmentRepository appointmentRepository;
    private final CapacityRepository capacityRepository;
    private final CommunicationClient communicationClient;

    @PostMapping("/appointments/{id}/express-confirmation")
    @Transactional
    public AppointmentEntity confirm(@PathVariable UUID id) {
        AppointmentEntity appointment =
                appointmentRepository.findById(id).orElseThrow();

        CapacityEntity capacity =
                capacityRepository.findAvailable(
                        appointment.getStartsAt());

        appointment.confirm(capacity.getReservationId());
        appointmentRepository.save(appointment);
        communicationClient.sendConfirmation(appointment);

        return appointment;
    }
}
```

O código pode compilar e ainda possuir problemas arquiteturais graves.

---

### 10. Finding: regra e orquestração no controller

Finding:

```text
ID:
AR-001.

Location:
ExpressConfirmationController.confirm.

Concern:
boundary and dependency direction.

Evidence:
controller loads entities,
selects capacity,
changes domain state,
persists and sends communication.

Risk:
HTTP adapter owns business flow,
reduces testability
and couples transport to domain decisions.

Severity:
BLOCKING.

Required action:
move orchestration to application use case
and expose a transport-neutral command.
```

---

### 11. Finding: acesso direto ao banco de Capacity

`CapacityRepository` dentro do módulo `Scheduling` viola ownership.

O código tenta decidir disponibilidade usando dados de outro contexto.

Isso cria schema coupling, autoridade ambígua, credencial excessiva e bypass de invariantes. O finding `AR-002` deve bloquear a aprovação.

---

### 12. Finding: transação com side effect remoto

`communicationClient.sendConfirmation` executa dentro da transação do banco.

A chamada pode enviar comunicação antes de rollback, perder resposta após commit, prolongar locks ou duplicar efeito em retry. A correção deve usar transação local e Outbox ou continuar a Saga existente.

---

### 13. Finding: retorno de entidade persistente

Retornar `AppointmentEntity`:

- vaza estrutura interna;
- dificulta evolução de schema;
- pode expor campos indevidos;
- cria lazy loading inesperado;
- mistura contrato HTTP e persistência.

Exija response model explícito.

---

### 14. Finding: autorização ausente

O método recebe apenas o ID.

Não existe evidência de:

- principal;
- tenant;
- ownership;
- estado permitido;
- janela de confirmação;
- purpose;
- audit.

A revisão deve pedir teste negativo cross-tenant e `deny by default`.

---

### 15. Finding: regra de capacidade baseada em snapshot local

Mesmo que `CapacityRepository` fosse uma réplica, `findAvailable` não prova que a reserva continua válida.

A decisão exige autoridade de `Capacity`, versão e comportamento concorrente.

O reviewer deve perguntar:

```text
qual componente autoriza a reserva?

qual invariant evita dupla alocação?

qual resposta existe para timeout ambíguo?
```

---

### 16. Finding: contrato de API novo sem semântica

O endpoint `express-confirmation` cria uma segunda forma de confirmar.

Perguntas:

- substitui ou complementa o endpoint existente?
- possui idempotency key?
- qual status HTTP?
- o retorno significa aceito ou concluído?
- qual erro é retriable?
- como clientes antigos se comportam?
- existe documentação OpenAPI?
- existe sunset da rota antiga?

Sem resposta, o contrato não está pronto.

---

### 17. Finding: evento incompatível

Suponha que o diff altere:

```java
public record AppointmentConfirmedV1(
        UUID appointmentId,
        AppointmentEntity appointment,
        CapacityEntity capacity) {
}
```

Problemas:

- entidades internas no contrato;
- campos não controlados;
- acoplamento entre contexts;
- risco de dados sensíveis;
- mudança silenciosa em V1;
- payload grande;
- consumidores frágeis.

A revisão deve exigir contrato canônico e versionamento compatível.

---

### 18. Finding: telemetria de alta cardinalidade

Exemplo proposto:

```java
registry.counter(
        "express_confirmation_total",
        "appointment_id",
        appointment.getId().toString(),
        "customer_id",
        appointment.getCustomerId().toString())
    .increment();
```

`appointment_id` e `customer_id` não podem ser labels.

Use labels bounded:

```text
outcome;
reason;
environment;
release;
mode.
```

IDs pertencem a logs ou traces protegidos quando necessários.

---

### 19. Finding: N+1 e carga não estimada

A mudança pode adicionar `findAvailable` para cada Appointment em uma lista.

O reviewer precisa verificar:

- query plan;
- número de consultas;
- índices;
- volume;
- p95 e p99;
- pool de conexões;
- cache;
- concorrência;
- teste de carga.

Performance não deve ser inferida pelo tamanho do método.

---

### 20. Finding: retry sem deadline

Exemplo:

```java
while (true) {
    try {
        return capacityClient.reserve(command);
    } catch (Exception ignored) {
        Thread.sleep(100);
    }
}
```

O finding deve apontar:

- loop infinito;
- ausência de deadline;
- retry de erro não retriable;
- falta de jitter;
- risco de duplicação;
- bloqueio de thread;
- ausência de observabilidade.

A correção precisa seguir a política de resiliência existente.

---

### 21. Finding: feature flag sem lifecycle

Uma flag como:

```text
express-confirmation-enabled
```

precisa declarar:

- owner;
- default;
- audience;
- ambientes;
- kill switch;
- métrica;
- data de revisão;
- condição de remoção.

Feature flag sem remoção vira branch permanente da arquitetura.

---

### 22. Finding: rollout e rollback ausentes

Para uma mudança crítica, o pull request deve fornecer:

```text
cohort inicial;

percentual;

critério de expansão;

métricas;

SLO;

stop condition;

rollback;

compatibilidade de dados;

owner da decisão.
```

A revisão bloqueia quando não existe caminho seguro de implantação.

---

### 23. Criar Concern Catalog

Arquivo:

```text
review/ARCHITECTURAL_CONCERN_CATALOG.md
```

Categorias:

```text
BOUNDARY;

DEPENDENCY_DIRECTION;

DOMAIN_INVARIANT;

DATA_AUTHORITY;

TRANSACTION;

DISTRIBUTED_FAILURE;

CONTRACT;

SECURITY;

OBSERVABILITY;

PERFORMANCE;

OPERABILITY;

MIGRATION;

ROLLBACK;

TESTABILITY;

DOCUMENTATION.
```

Cada categoria possui exemplos, severidade padrão e evidências esperadas.

---

### 24. Criar Architectural Concern

```java
package br.com.formacao.architecturereview.concern;

import java.util.Objects;

public record ArchitecturalConcern(
        String id,
        ConcernCategory category,
        String description,
        ConcernSeverity defaultSeverity,
        String requiredEvidence) {

    public ArchitecturalConcern {
        Objects.requireNonNull(id);
        Objects.requireNonNull(category);
        Objects.requireNonNull(description);
        Objects.requireNonNull(defaultSeverity);
        Objects.requireNonNull(requiredEvidence);
    }
}
```

---

### 25. Criar Review Finding

```java
package br.com.formacao.architecturereview.finding;

import br.com.formacao.architecturereview.concern.ConcernCategory;
import br.com.formacao.architecturereview.concern.ConcernSeverity;
import java.util.List;
import java.util.Objects;

public record ReviewFinding(
        String id,
        String location,
        ConcernCategory category,
        ConcernSeverity severity,
        String evidence,
        String risk,
        String requiredAction,
        List<String> validationSteps,
        FindingStatus status) {

    public ReviewFinding {
        Objects.requireNonNull(id);
        Objects.requireNonNull(location);
        Objects.requireNonNull(category);
        Objects.requireNonNull(severity);
        Objects.requireNonNull(evidence);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(requiredAction);
        validationSteps = List.copyOf(validationSteps);
        Objects.requireNonNull(status);
    }
}
```

---

### 26. Definir severidades

Use:

```text
INFO:
melhoria sem risco relevante.

SUGGESTION:
alternativa recomendada.

REQUIRED:
correção necessária antes do merge.

BLOCKING:
risco crítico ou violação arquitetural.
```

Use severidade por critérios explícitos, nunca como instrumento de autoridade pessoal.

---

### 27. Criar checklist proporcional

Arquivo:

```text
review/REVIEW_CHECKLIST.md
```

Checklist base:

```text
objetivo e escopo;

boundaries;

invariantes;

dados;

contratos;

transações;

falhas;

segurança;

observabilidade;

performance;

migração;

rollout;

rollback;

testes;

documentação.
```

Mudança `LOW` usa subconjunto.

Mudança `CRITICAL` exige todos os itens e evidence.

---

### 28. Criar Review Scope

```java
package br.com.formacao.architecturereview.checklist;

import br.com.formacao.architecturereview.change.ChangeRisk;
import java.util.Set;

public record ReviewScope(
        ChangeRisk risk,
        Set<String> requiredSections,
        Set<String> requiredEvidence,
        int minimumReviewers) {

    public ReviewScope {
        requiredSections = Set.copyOf(requiredSections);
        requiredEvidence = Set.copyOf(requiredEvidence);

        if (minimumReviewers < 1) {
            throw new IllegalArgumentException(
                    "At least one reviewer is required");
        }
    }
}
```

---

### 29. Selecionar reviewers por risco

Arquivo:

```text
review/REVIEWER_SELECTION_POLICY.md
```

Para Express Confirmation:

```text
Scheduling owner;

Capacity owner;

security reviewer;

data reviewer;

operability reviewer.
```

Nem toda pessoa precisa aprovar tudo.

A policy define concerns e autoridade de cada reviewer.

---

### 30. Evitar revisão por celebridade

Não selecione reviewer apenas porque é “o arquiteto”. Selecione quem conhece boundary, dados, operação, risco e decisões anteriores. Centralizar tudo em uma pessoa cria gargalo e reduz ownership.

---

### 31. Criar Comment Policy

Arquivo:

```text
review/COMMENT_POLICY.md
```

Um comentário deve ser:

- específico;
- respeitoso;
- orientado ao código;
- associado a risco;
- classificado;
- acionável;
- verificável;
- curto o suficiente para leitura;
- profundo o suficiente para decisão.

Exemplo:

```text
[BLOCKING][DATA_AUTHORITY]

Scheduling is reading Capacity tables directly.
This bypasses Capacity invariants and creates schema coupling.
Please replace the repository dependency with the existing
Capacity port and include the timeout-ambiguity scenario
in the integration tests.

Validation:
architecture test passes;
Scheduling credential cannot access Capacity database;
contract test covers unavailable Capacity.
```

---

### 32. Separar pergunta, sugestão e bloqueio

Use prefixos:

```text
[QUESTION];

[SUGGESTION];

[REQUIRED];

[BLOCKING].
```

Uma pergunta não deve parecer bloqueio oculto.

Um bloqueio precisa explicar critério.

---

### 33. Pedir evidência proporcional

Arquivo:

```text
review/EVIDENCE_POLICY.md
```

Evidências para a mudança crítica:

```text
sequence diagram;

contract diff;

architecture tests;

security negative tests;

query plan;

load test summary;

failure scenario;

migration plan;

rollout plan;

rollback proof;

observability dashboard;

ADR or RFC link.
```


---

### 34. Criar Required Evidence Test

```java
package br.com.formacao.architecturereview.checklist;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class RequiredEvidenceTest {

    @Test
    void criticalChangeRequiresRollbackEvidence() {
        ReviewScope scope = new ReviewScope(
                br.com.formacao.architecturereview.change.ChangeRisk.CRITICAL,
                Set.of("BOUNDARY", "DATA", "SECURITY", "OPERABILITY"),
                Set.of("ROLLBACK_PROOF", "FAILURE_TEST", "CONTRACT_DIFF"),
                3);

        assertTrue(
                scope.requiredEvidence().contains("ROLLBACK_PROOF"));
    }
}
```

---

### 35. Revisar a solução corrigida

Estrutura recomendada:

```text
HTTP adapter;

ConfirmAppointmentUseCase;

AuthorizationPolicy;

Appointment aggregate;

CapacityPort;

ConfirmationSagaStarter;

AppointmentRepository;

Outbox;

response mapper.
```

O caso de uso coordena abstrações, sem acessar dados de outro contexto.

---

### 36. Criar command explícito

```java
package br.com.formacao.scheduling.application;

import java.util.UUID;

public record ConfirmAppointmentCommand(
        UUID appointmentId,
        String tenantId,
        String principalId,
        String idempotencyKey,
        String confirmationMode) {
}
```

A command não carrega entidade HTTP nem token bruto.

---

### 37. Criar use case corrigido

```java
package br.com.formacao.scheduling.application;

public final class ConfirmAppointmentUseCase {

    private final AuthorizationPolicy authorizationPolicy;
    private final AppointmentRepository appointmentRepository;
    private final ConfirmationSagaStarter sagaStarter;
    private final ConfirmationTelemetry telemetry;

    public ConfirmationResult handle(
            ConfirmAppointmentCommand command) {

        Appointment appointment =
                appointmentRepository.require(
                        command.appointmentId(),
                        command.tenantId());

        authorizationPolicy.requireConfirmationAllowed(
                command,
                appointment);

        appointment.requireConfirmable();

        ConfirmationResult result =
                sagaStarter.start(
                        appointment,
                        command.idempotencyKey(),
                        command.confirmationMode());

        telemetry.recordStarted(
                command.confirmationMode(),
                result.outcome());

        return result;
    }
}
```

O use case preserva boundaries e delega coordenação distribuída à Saga.

---

### 38. Revisar transaction boundary

A revisão confirma:

```text
transação local;

estado e Outbox atômicos;

nenhum HTTP dentro da transação;

nenhuma publicação não transacional;

idempotência;

recovery;

observabilidade.
```

Não basta ver `@Transactional`. É preciso entender o que está dentro do limite.

---

### 39. Revisar Data Authority

Verifique:

- `Scheduling` escreve apenas seus dados;
- `Capacity` continua autoridade da reserva;
- views são derivadas;
- nenhuma query faz join cross-context;
- credenciais de banco são separadas;
- eventos carregam contrato mínimo;
- reconciliation possui direção definida.

---

### 40. Revisar segurança

Perguntas:

```text
quem autentica?

quem autoriza?

tenant vem de fonte confiável?

qual recurso é protegido?

qual state é permitido?

qual operação é privilegiada?

qual dado sai na resposta?

qual audit é gerado?
```

Exija teste cross-tenant e teste de ação sem policy.

---

### 41. Revisar observabilidade

Confirme:

- journey e step;
- outcome bounded;
- trace propagation;
- nenhum ID em metric label;
- logs sem token;
- SLI elegível;
- dashboard atualizado;
- alerta acionável;
- release ID presente.

---

### 42. Revisar performance

Evidências:

```text
query count;

query plan;

latency p95 and p99;

throughput;

pool saturation;

broker lag;

memory;

CPU;

load profile;

headroom.
```


---

### 43. Revisar failure modes

Cenários obrigatórios:

- Capacity indisponível;
- timeout ambíguo;
- reply duplicada;
- broker atrasado;
- Outbox parada;
- autorização indisponível;
- feature flag inconsistente;
- deploy parcial;
- rollback durante Saga ativa.

A mudança precisa declarar comportamento, não apenas lançar exceção.

---

### 44. Revisar migrations

Se houver coluna nova:

```text
expand;

write compatible;

backfill;

validate;

switch;

contract.
```

Bloqueie migration destrutiva no mesmo deploy que altera o código consumidor.

---

### 45. Revisar rollout

Exemplo:

```text
internal tenant;

1%;

5%;

20%;

50%;

100%.
```

Critérios:

- SLO saudável;
- zero cross-tenant;
- compensação dentro do budget;
- sem aumento de lag;
- erro abaixo do threshold;
- rollback testado.

---

### 46. Revisar rollback

Rollback precisa considerar:

- código;
- schema;
- eventos;
- flags;
- mensagens em trânsito;
- Sagas abertas;
- cache;
- consumers antigos;
- dados escritos pela versão nova.

“Voltar o deploy” pode não restaurar o estado anterior.

---

### 47. Revisar testes

A suíte deve incluir:

```text
unit;

domain invariant;

application;

integration;

contract;

security negative;

architecture;

failure;

load;

migration;

rollback.
```

Cobertura percentual não substitui cenários de risco.

---

### 48. Revisar documentação viva

Atualizações possíveis:

- ADR;
- RFC;
- C4;
- OpenAPI;
- event catalog;
- runbook;
- SLO;
- ownership;
- data contract;
- feature flag catalog;
- migration record.


---

### 49. Automatizar regras determinísticas

Exemplos:

```text
ArchUnit:
dependency direction.

schema compatibility:
event and API contracts.

secret scan:
credentials.

migration linter:
destructive DDL.

static analysis:
unsafe patterns.

policy test:
required evidence.
```

Automação reduz discussão repetitiva.

---

### 50. Criar Blocking Policy

Arquivo:

```text
review/BLOCKING_POLICY.md
```

Bloqueios obrigatórios:

```text
cross-context direct database write;

critical invariant bypass;

cross-tenant authorization failure;

secret exposure;

breaking contract without migration;

remote side effect inside local transaction;

unbounded retry;

critical change without rollback;

unresolved critical threat;

unknown data authority.
```

---

### 51. Criar Exception Policy

Exceção exige:

- finding;
- justificativa;
- owner;
- mitigação;
- risco residual;
- prazo;
- approver;
- tracking item;
- evidence;
- revalidação.

Exceção sem expiração vira nova arquitetura por omissão.

---

### 52. Criar Review Decision

```java
package br.com.formacao.architecturereview.decision;

import java.util.List;

public record ReviewDecision(
        DecisionOutcome outcome,
        List<String> blockingFindings,
        List<String> requiredActions,
        List<FollowUp> followUps,
        String decidedBy) {

    public ReviewDecision {
        blockingFindings = List.copyOf(blockingFindings);
        requiredActions = List.copyOf(requiredActions);
        followUps = List.copyOf(followUps);
    }
}
```

Outcomes:

```text
APPROVED;

CHANGES_REQUIRED;

REJECTED;

INCONCLUSIVE.
```

Evite “approved with critical debt”.

---

### 53. Definir Review SLA

Arquivo:

```text
review/REVIEW_SLA.md
```

Exemplo:

```text
LOW:
1 business day.

MEDIUM:
2 business days.

HIGH:
3 business days.

CRITICAL:
review kickoff within 1 business day,
completion according to evidence.
```

O SLA evita PR abandonado e gargalo invisível, sem obrigar aprovação.

---

### 54. Criar Operating Model

Arquivo:

```text
review/OPERATING_MODEL.md
```

Registre:

- change author;
- boundary owner;
- review coordinator;
- specialist reviewer;
- approver;
- escalation;
- SLA;
- exception authority;
- evidence owner;
- metrics;
- review retrospective.

---

### 55. Medir a prática de review

Métricas úteis:

```text
time to first review;

time to decision;

blocking findings by category;

rework before merge;

escaped architectural defects;

exception count;

expired exceptions;

reviewer concentration;

PR size;

automation coverage.
```


---

### 56. Testar classificação

`ChangeClassificationTest` valida:

- low score;
- boundaries;
- thresholds;
- invalid score;
- critical classification para Express Confirmation.

---

### 57. Testar qualidade dos findings

`FindingQualityTest` exige:

- location;
- category;
- evidence;
- risk;
- action;
- validation;
- status.

Finding sem risco ou ação falha.

---

### 58. Testar blocking policy

`BlockingFindingTest` valida que um finding `BLOCKING` aberto impede `APPROVED`.

```java
package br.com.formacao.architecturereview.finding;

import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.List;
import org.junit.jupiter.api.Test;

class BlockingFindingTest {

    @Test
    void openBlockingFindingPreventsApproval() {
        List<ReviewFinding> findings = List.of(
                ReviewFixtures.openBlockingDataAuthorityFinding());

        boolean mayApprove = findings.stream()
                .noneMatch(finding ->
                        finding.severity()
                                == br.com.formacao.architecturereview.concern.ConcernSeverity.BLOCKING
                        && finding.status() == FindingStatus.OPEN);

        assertFalse(mayApprove);
    }
}
```

---

### 59. Testar reviewer coverage

Para mudança crítica, valide cobertura de:

- boundary;
- data;
- security;
- operability.

Reviewer duplicado não conta como quatro papéis.

---

### 60. Testar evidence

Falhe quando faltarem:

- contract diff;
- rollback proof;
- failure test;
- security negative test;
- load evidence;
- migration plan.

---

### 61. Criar reports

Exemplo:

```yaml
architectureReview:
  change:
    id:
      CR-658-001
    risk:
      CRITICAL

  impact:
    boundaries:
      3
    contracts:
      2
    dataAssets:
      3

  findings:
    total:
      14
    blocking:
      7
    required:
      5
    resolved:
      12
    open:
      2

  reviewers:
    requiredRoles:
      5
    coveredRoles:
      5

  evidence:
    required:
      11
    available:
      11

  decision:
    CHANGES_REQUIRED
```

---

### 62. Criar evidence

Arquivo:

```text
contracts/architecture-review-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- change ID;
- risk classification;
- affected boundary count;
- affected contract count;
- affected data asset count;
- finding count;
- blocking finding count;
- open finding count;
- reviewer role count;
- reviewer coverage;
- required evidence count;
- available evidence count;
- architecture test status;
- security test status;
- contract test status;
- migration test status;
- rollback test status;
- final decision;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- tokens;
- código proprietário real;
- URLs privadas;
- credenciais;
- payloads de produção;
- comentários pessoais;
- nomes de clientes;
- detalhes de vulnerabilidade explorável.

---

### 63. Criar Gate

O Architecture Review Gate valida:

- charter;
- classificação;
- impact map;
- boundaries;
- invariants;
- data authority;
- contracts;
- transactions;
- distributed behavior;
- security;
- observability;
- performance;
- migration;
- rollout;
- rollback;
- tests;
- documentation;
- reviewers;
- findings;
- exceptions;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_CHANGE_CLASSIFICATION;

FAIL_IMPACT_MAP;

FAIL_BOUNDARY;

FAIL_DATA_AUTHORITY;

FAIL_CONTRACT;

FAIL_TRANSACTION;

FAIL_DISTRIBUTED_BEHAVIOR;

FAIL_SECURITY;

FAIL_OBSERVABILITY;

FAIL_PERFORMANCE;

FAIL_MIGRATION;

FAIL_ROLLOUT;

FAIL_ROLLBACK;

FAIL_TEST;

FAIL_REVIEWER_COVERAGE;

FAIL_FINDING_QUALITY;

FAIL_BLOCKING_FINDING;

FAIL_EXCEPTION;

INCONCLUSIVE.
```

---

### 64. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-architecture-review\validate-review-contract.ps1

.\scripts\m19\service-scheduling-architecture-review\validate-change-classification.ps1

.\scripts\m19\service-scheduling-architecture-review\validate-impact-map.ps1

.\scripts\m19\service-scheduling-architecture-review\validate-review-findings.ps1

.\scripts\m19\service-scheduling-architecture-review\validate-reviewer-coverage.ps1

.\scripts\m19\service-scheduling-architecture-review\validate-required-evidence.ps1

.\scripts\m19\service-scheduling-architecture-review\validate-blocking-policy.ps1

.\scripts\m19\service-scheduling-architecture-review\run-architecture-review-tests.ps1

.\scripts\m19\service-scheduling-architecture-review\collect-architecture-review-evidence.ps1

.\scripts\m19\service-scheduling-architecture-review\verify-architecture-review-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 65. Encerrar o laboratório

Confirme:

- objetivo da mudança;
- risco classificado;
- impact map;
- concerns aplicáveis;
- boundaries preservados;
- autoridade de dados preservada;
- invariantes protegidas;
- transação local correta;
- falhas distribuídas tratadas;
- contratos compatíveis;
- segurança validada;
- telemetria bounded;
- performance evidenciada;
- migration segura;
- rollout e rollback;
- testes proporcionais;
- reviewers adequados;
- findings acionáveis;
- blockers resolvidos;
- exceptions temporárias;
- docs atualizados;
- reports e evidence;
- gate aprovado;
- liderança técnica não antecipada;
- mentoria não antecipada.

---

## Entendendo o que foi feito

### A revisão ganhou visão sistêmica

O diff deixou de ser analisado apenas arquivo por arquivo.

A revisão passou a mapear boundaries, dados, contratos, falhas, operação e evolução.

### O risco ganhou proporcionalidade

Mudanças simples continuam rápidas.

Mudanças críticas exigem reviewers, evidências e cenários compatíveis com o blast radius.

### Findings ganharam qualidade

Comentários agora possuem localização, concern, evidência, risco, severidade, ação e validação.

Isso reduz opinião vaga e discussão pessoal.

### Automação ganhou o trabalho repetitivo

ArchUnit, contract tests, linters, scans e policy tests bloqueiam violações determinísticas.

Reviewers concentram energia em contexto e trade-offs.

### Approval ganhou significado

Aprovar significa blockers resolvidos, riscos cobertos e mudança operável.

---

## Erros comuns importantes

### Revisar apenas estilo

Naming e formatação importam, mas não revelam perda de autoridade, acoplamento ou falha distribuída.

### Aprovar porque os testes passaram

A suíte pode não cobrir cross-tenant, rollback, compatibilidade ou operação.

### Comentar sem explicar risco

“Faça diferente” não ensina nem permite decisão objetiva.

### Bloquear por preferência pessoal

Use decisão, evidência, risco e policy.

### Tratar todo PR como crítico

A prática vira gargalo e perde credibilidade.

### Tratar mudança crítica como PR comum

O sistema acumula risco invisível.

### Revisar somente arquivos alterados

Contratos, consumers, dados e operação podem ser afetados fora do diff.

### Centralizar tudo no arquiteto

Cria fila, reduz autonomia e concentra conhecimento.

### Aceitar exceção sem expiração

A dívida se torna permanente.

### Pedir benchmark sem workload

Números sem cenário não apoiam decisão.

### Ignorar rollout e rollback

Código correto ainda pode falhar durante implantação.

### Confundir review com disputa

O alvo é a qualidade da mudança, não a autoridade do reviewer.

---

## Comandos úteis

### Validar classificação

```powershell
.\scripts\m19\service-scheduling-architecture-review\validate-change-classification.ps1
```

### Validar impact map

```powershell
.\scripts\m19\service-scheduling-architecture-review\validate-impact-map.ps1
```

### Validar findings

```powershell
.\scripts\m19\service-scheduling-architecture-review\validate-review-findings.ps1
```

### Validar evidence

```powershell
.\scripts\m19\service-scheduling-architecture-review\validate-required-evidence.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-architecture-review\run-architecture-review-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-architecture-review\verify-architecture-review-gate.ps1
```

---

## Exercício guiado

Revise uma mudança fictícia chamada:

```text
Bulk Reschedule Appointments
```

A proposta recebe cem Appointments, consulta Capacity, altera janelas e publica notificações.

Produza:

1. change request;
2. classificação de risco;
3. impact map;
4. boundaries afetados;
5. invariantes;
6. autoridade de dados;
7. contrato de API;
8. comportamento parcial;
9. idempotência;
10. segurança cross-tenant;
11. observabilidade;
12. performance;
13. migration se necessária;
14. rollout;
15. rollback;
16. testes;
17. findings;
18. reviewers;
19. decisão;
20. evidence e gate.

Explique por que processamento em lote muda risco, atomicidade, tempo, retries, UX e operação.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 657 e ponte para a aula 659 foram preservadas;
- laboratório `service-scheduling-architecture-review` foi criado;
- Architecture Review Charter foi criado;
- contrato principal foi criado;
- Change Request foi registrado;
- risco foi classificado;
- mudança Express Confirmation foi classificada como crítica;
- Change Impact Map foi criado;
- revisão ultrapassou os arquivos do diff;
- Concern Catalog foi criado;
- boundaries foram revisados;
- regra no controller foi identificada;
- acesso direto a dados de Capacity foi bloqueado;
- side effect remoto dentro da transação foi bloqueado;
- retorno de entidade persistente foi bloqueado;
- autorização cross-tenant foi exigida;
- autoridade de Capacity foi preservada;
- contrato de API foi revisado;
- evento incompatível foi identificado;
- labels de alta cardinalidade foram bloqueadas;
- performance foi validada com evidência;
- retry sem deadline foi bloqueado;
- feature flag recebeu lifecycle;
- rollout e rollback foram exigidos;
- Review Finding possui localização, risco, ação e validação;
- severidades foram definidas;
- checklist proporcional foi criado;
- reviewers foram selecionados por risco e ownership;
- Comment Policy foi criada;
- perguntas, sugestões, required e blocking foram diferenciados;
- Evidence Policy foi criada;
- solução corrigida preserva use case, ports e Saga;
- transaction boundary foi revisado;
- Data Authority foi revisada;
- segurança foi revisada;
- observabilidade foi revisada;
- performance foi revisada;
- failure modes foram revisados;
- migrations foram revisadas;
- rollout e rollback foram revisados;
- testes proporcionais foram definidos;
- documentação viva foi atualizada;
- regras determinísticas foram automatizadas;
- Blocking Policy foi criada;
- Exception Policy possui owner e expiração;
- Review Decision foi criada;
- Review SLA foi definido;
- review fatigue foi tratada;
- Operating Model foi criado;
- métricas de review foram definidas;
- testes de classificação, finding, blocker, reviewer e evidence foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- liderança técnica não foi aprofundada;
- mentoria e comunicação técnica não foram antecipadas.

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
  labs/m19/aula-658-code-review-arquitetural/service-scheduling-architecture-review `
  scripts/m19/service-scheduling-architecture-review `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|customer_email|customer_phone|customer_document|productionTopology|privateEndpoint|personalAttack"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): praticar code review arquitetural"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- código proprietário real;
- endpoints privados;
- topologia de produção;
- comentários pessoais;
- nomes reais de reviewers;
- detalhes exploráveis de vulnerabilidade;
- liderança técnica aprofundada;
- mentoria da aula 660.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou code review arquitetural.

Você criou:

```text
Architecture Review Charter;

Change Risk Model;

Change Request;

Change Impact Map;

Architectural Concern Catalog;

Review Checklist;

Reviewer Selection Policy;

Comment Policy;

Evidence Policy;

Blocking Policy;

Exception Policy;

Review SLA;

Operating Model;

findings;

reports, evidence e gate.
```

Você revisou a mudança `Express Appointment Confirmation` e identificou que código compilável pode violar boundaries, autoridade de dados, transações, segurança, contratos, observabilidade, performance e capacidade de rollback.

Você transformou comentários em findings verificáveis, classificou a mudança por risco, selecionou reviewers por ownership, exigiu evidências proporcionais e automatizou regras determinísticas.

A solução corrigida preservou o use case, a autorização, o aggregate, os ports, a Saga, a Outbox, os contratos e a telemetria bounded.

A próxima aula será:

```text
659 - M19.49 - Lideranca tecnica
```

Nela, você irá aprofundar como influenciar decisões, construir alinhamento, lidar com conflitos, delegar, priorizar, comunicar trade-offs e desenvolver ownership técnico sem depender apenas de autoridade formal.

Nenhum aprofundamento completo de liderança técnica ou mentoria foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei o risco da mudança.
- [ ] Criei o impact map.
- [ ] Revisei boundaries e dados.
- [ ] Revisei contratos e transações.
- [ ] Revisei segurança e observabilidade.
- [ ] Revisei performance e falhas.
- [ ] Exigi rollout e rollback.
- [ ] Criei findings acionáveis.
- [ ] Selecionei reviewers adequados.
- [ ] Validei evidence e gate.

---

## Troubleshooting adicional

### O pull request tem arquivos demais

Divida a implementação e mantenha a visão pelo RFC, ADR e tracking.

### O reviewer não conhece o boundary

Inclua o owner responsável e use walkthrough.

### O comentário gerou discussão pessoal

Reescreva com evidência, risco, policy e ação esperada.

### O author pede aprovação antes da evidência

Classifique o risco e aplique a Evidence Policy.

### O teste passa, mas o design parece errado

Procure boundary, authority, failure mode, rollout e operação não cobertos.

### O arquiteto virou gargalo

Distribua ownership, automatize regras e crie catálogos claros.

### A exceção precisa ser aceita

Registre owner, mitigação, risco residual, prazo e tracking.

### O PR adiciona nova chamada síncrona

Revise latência acumulada, timeout, retry, circuit breaker e SLO.

### O PR altera evento V1

Execute contract diff e verifique consumers antes do merge.

### O rollback só fala em imagem anterior

Revise schema, eventos, Sagas, cache, flags e dados já escritos.

### A conversa virou gestão de conflito entre pessoas

Preserve o aprofundamento de liderança para a aula 659.

---

## Perguntas de revisão

1. O que diferencia code review local de arquitetural?
2. Por que o diff não representa todo o impacto?
3. O que é revisão proporcional ao risco?
4. Quais fatores classificam uma mudança?
5. O que é Change Impact Map?
6. O que é Architectural Concern?
7. O que um finding deve conter?
8. Qual diferença entre suggestion, required e blocking?
9. Por que regra determinística deve ser automatizada?
10. Por que acesso direto ao banco de outro contexto é blocker?
11. Qual risco existe em side effect dentro da transação?
12. Por que entidade persistente não deve ser response?
13. O que revisar na autorização?
14. O que revisar em eventos?
15. Por que IDs não devem ser metric labels?
16. O que uma evidência de performance precisa conter?
17. O que revisar em retry?
18. O que uma feature flag precisa possuir?
19. Por que rollout é parte da revisão?
20. Por que rollback não é apenas deploy anterior?
21. Como selecionar reviewers?
22. O que é Exception Policy?
23. O que impede approval?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Visão local versus impacto sistêmico.
2. Porque contracts, consumers e operação podem estar fora dele.
3. Aplicar profundidade conforme blast radius e risco.
4. Boundaries, dados, contratos, segurança, distribuição e rollback.
5. Mapa de componentes, fluxos e consequências afetadas.
6. Categoria de decisão ou risco arquitetural.
7. Local, evidência, risco, severidade, ação e validação.
8. Melhoria, correção obrigatória e impedimento crítico.
9. Para reduzir repetição e erro humano.
10. Porque viola ownership e cria coupling de schema.
11. Inconsistência entre commit e efeito externo.
12. Porque vaza persistência e campos internos.
13. Principal, tenant, recurso, estado, propósito e audit.
14. Semântica, versão, compatibilidade e consumidores.
15. Porque explodem cardinalidade.
16. Workload, volume, p95, p99, saturação e headroom.
17. Deadline, erro retriable, backoff, jitter e idempotência.
18. Owner, default, métricas, revisão e remoção.
19. Porque implantação gradual limita blast radius.
20. Porque schema, eventos e dados podem permanecer.
21. Por boundary, risco, dados, segurança e operação.
22. Regra para aceitar risco temporário de forma controlada.
23. Finding blocking aberto ou evidence obrigatória ausente.
24. Liderança técnica.
25. Liderança técnica.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 658 - M19.48 - Code review arquitetural

- Continuei após Dados como decisão arquitetural.
- Tratei code review como proteção contínua da arquitetura.
- Criei o laboratório `service-scheduling-architecture-review`.
- Criei Architecture Review Charter.
- Criei Change Risk Model.
- Classifiquei Express Confirmation como mudança crítica.
- Criei Change Request e Change Impact Map.
- Criei Architectural Concern Catalog.
- Identifiquei regra de negócio no controller.
- Bloqueei acesso direto ao banco de Capacity.
- Bloqueei side effect remoto dentro da transação.
- Bloqueei retorno de entidade persistente.
- Exigi autorização cross-tenant.
- Preservei autoridade de Capacity.
- Revisei API e evento.
- Bloqueei labels de alta cardinalidade.
- Exigi evidência de performance.
- Bloqueei retry sem deadline.
- Criei lifecycle de feature flag.
- Exigi rollout e rollback.
- Criei Review Finding com evidência, risco e validação.
- Defini severidades e blockers.
- Criei checklist proporcional.
- Selecionei reviewers por risco e ownership.
- Criei Comment Policy e Evidence Policy.
- Refatorei para use case, policy, ports, Saga e Outbox.
- Revisei data authority, segurança, observabilidade e falhas.
- Criei Blocking Policy e Exception Policy.
- Criei Review Decision e Review SLA.
- Automatizei regras determinísticas.
- Criei Operating Model e métricas de review.
- Executei testes, reports, evidence e gate.
- Não antecipei liderança técnica.
- Próxima aula: Lideranca tecnica.
```

---

## Referência técnica curta

- Architectural Code Review.
- Change Risk.
- Change Impact Map.
- Architectural Concern.
- Review Finding.
- Evidence-Based Review.
- Boundary Review.
- Data Authority Review.
- Contract Review.
- Distributed Failure Review.
- Security Review.
- Observability Review.
- Performance Review.
- Migration Review.
- Rollout.
- Rollback.
- Blocking Policy.
- Exception Policy.
- Review SLA.
- Architecture Gate.

Regra final:

```text
Code review arquitetural protege decisões sistêmicas com profundidade proporcional ao risco: o Change Impact Map conecta o diff a boundaries, dados, APIs, eventos, consumers, telemetria e operação; reviewers verificam autoridade, invariantes, dependências, contratos, transações, falhas distribuídas, segurança, observabilidade, performance, migrations, rollout, rollback, testes e documentação, enquanto regras determinísticas ficam automatizadas; findings registram localização, evidência, risco, severidade, ação e validação, blockers impedem aprovação e exceptions possuem owner, mitigação e expiração; mudanças críticas exigem reviewers adequados e evidências de falha, segurança, carga, migração e rollback; o gate termina com classificação, impacto, concerns, reviewers, findings, reports e evidence aprovados, enquanto liderança técnica permanece reservada para a aula 659 e mentoria para a aula 660.
```
