# 649 - M19.39 - Evolucao controlada da arquitetura

## Apresentação da aula

Na aula 648, você transformou fronteiras arquiteturais em regras executáveis com ArchUnit. Domínio, application, ports, adapters e bounded contexts passaram a ter proteção automática contra dependências indevidas, ciclos e regressões estruturais.

Agora surge outro problema.

Uma arquitetura não permanece congelada.

Novos requisitos aparecem, volume cresce, riscos mudam, integrações são substituídas, contratos precisam evoluir e decisões antigas deixam de atender ao contexto atual. Mesmo uma arquitetura bem desenhada precisa mudar.

O perigo está em mudar sem controle. Saltos grandes, contratos quebrados, caminhos duplos permanentes e ausência de rollback transformam a evolução em risco operacional.

Evolução controlada da arquitetura significa organizar a mudança como uma sequência observável, reversível quando possível e guiada por critérios explícitos.

A pergunta desta aula será:

```text
como sair do estado atual
para um estado arquitetural melhor
sem interromper o negócio,
sem esconder risco
e sem transformar a transição
em uma solução permanente?
```

O laboratório será:

```text
labs/m19/aula-649-evolucao-controlada/service-scheduling-evolution
```

Você criará um Architecture Evolution Charter, inventário do estado atual, visão de estado alvo, roadmap, ondas de mudança, critérios de entrada e saída, compatibility windows, plano de migração, checkpoints, fitness functions, reports, evidence e gate.

O domínio continuará sendo `Service Scheduling`.

O cenário central será a evolução de uma arquitetura em que controllers acessam serviços e repositórios de forma acoplada para uma estrutura com casos de uso, ports, adapters, eventos de integração e fronteiras mais claras.

A próxima aula será:

```text
650 - M19.40 - Modernizacao de legado
```

Estratégias completas de modernização de sistemas legados, classificação de legado, portfolio assessment e transformação organizacional ficam reservadas para a aula 650.

Regra central:

```text
arquitetura evolui com segurança
quando cada etapa possui
motivo,
escopo,
owner,
compatibilidade,
critério de saída,
evidência
e possibilidade explícita
de rollback ou roll-forward.
```

## Onde estamos na formação

A sequência oficial é:

```text
646 C4 Model;
647 Fitness functions arquiteturais;
648 ArchUnit avancado;
649 Evolucao controlada da arquitetura;
650 Modernizacao de legado;
651 Strangler Fig.
```

A progressão é:

```text
representar a arquitetura;
medir características;
proteger fronteiras no código;
organizar a mudança no tempo;
modernizar sistemas existentes;
substituir partes progressivamente.
```

Até aqui, você aprendeu a registrar decisões com ADR, discutir propostas com RFC, representar o sistema com C4, medir características com fitness functions e proteger dependências com ArchUnit.

Durante uma evolução arquitetural:

- o RFC explica por que a mudança é necessária;
- o ADR registra a decisão aceita;
- o C4 mostra estado atual, estado alvo e transição;
- as fitness functions medem se a arquitetura melhora;
- o ArchUnit impede regressões estruturais;
- o roadmap organiza a sequência;
- os checkpoints decidem se a próxima onda pode começar.

Nesta aula, essas peças serão conectadas em processo único.

Você não fará uma reescrita completa. Também não aprofundará ainda o diagnóstico de grandes sistemas legados. O foco é controlar a evolução de uma arquitetura conhecida, em produção, com mudança incremental e verificável.

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-649-evolucao-controlada/service-scheduling-evolution
```

Estrutura principal:

```text
service-scheduling-evolution
├── pom.xml
├── README.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/evolution
│   │           ├── model
│   │           │   ├── EvolutionItem.java
│   │           │   ├── EvolutionStatus.java
│   │           │   ├── EvolutionRisk.java
│   │           │   ├── EvolutionWave.java
│   │           │   ├── CompatibilityWindow.java
│   │           │   └── EvolutionCheckpoint.java
│   │           ├── planning
│   │           │   ├── EvolutionRoadmap.java
│   │           │   └── WavePlanner.java
│   │           ├── migration
│   │           │   ├── MigrationStrategy.java
│   │           │   └── CompatibilityMode.java
│   │           ├── governance
│   │           │   ├── EvolutionGate.java
│   │           │   ├── EvolutionPolicy.java
│   │           │   ├── TemporaryException.java
│   │           │   └── EvidenceCatalog.java
│   │           └── scenario
│   │               ├── SchedulingEvolutionScenario.java
│   │               ├── EvolutionScenarioRunner.java
│   │               └── EvolutionObservation.java
│   └── test
│       └── java
│           └── br/com/formacao/evolution
│               ├── planning
│               │   ├── WaveDependencyTest.java
│               │   ├── ExitCriteriaTest.java
│               │   └── RoadmapConsistencyTest.java
│               ├── migration
│               │   ├── CompatibilityWindowTest.java
│               │   ├── RollbackReadinessTest.java
│               │   └── DeprecationRemovalTest.java
│               ├── governance
│               │   ├── ArchitectureGateTest.java
│               │   ├── ExpiredExceptionTest.java
│               │   └── EvidenceCompletenessTest.java
│               └── architecture
│                   ├── EvolutionRuleTest.java
│                   └── LegacyModernizationNonAnticipationTest.java
├── evolution
│   ├── ARCHITECTURE_EVOLUTION_CHARTER.md
│   ├── CURRENT_STATE.md
│   ├── TARGET_STATE.md
│   ├── ARCHITECTURE_INVENTORY.md
│   ├── ARCHITECTURE_DEBT_REGISTER.md
│   ├── EVOLUTION_PRINCIPLES.md
│   ├── EVOLUTION_ROADMAP.md
│   ├── WAVE_PLAN.md
│   ├── COMPATIBILITY_POLICY.md
│   ├── DEPRECATION_POLICY.md
│   ├── DATA_MIGRATION_POLICY.md
│   ├── CHECKPOINT_POLICY.md
│   ├── ROLLBACK_POLICY.md
│   ├── OBSERVABILITY.md
│   ├── OWNERSHIP.md
│   ├── COMMUNICATION_PLAN.md
│   ├── RISK_REGISTER.md
│   └── OPEN_EVOLUTION_QUESTIONS.md
├── contracts
│   ├── evolution-contract.yaml
│   ├── roadmap-policy.yaml
│   ├── wave-policy.yaml
│   ├── compatibility-policy.yaml
│   ├── deprecation-policy.yaml
│   ├── migration-policy.yaml
│   ├── checkpoint-policy.yaml
│   ├── rollback-policy.yaml
│   ├── observability-policy.yaml
│   ├── evidence-policy.yaml
│   ├── exception-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── current-state-report.yaml
    ├── target-state-report.yaml
    ├── wave-readiness-report.yaml
    ├── compatibility-report.yaml
    ├── migration-progress-report.yaml
    ├── architecture-fitness-report.yaml
    ├── risk-report.yaml
    └── evolution-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-evolution
├── validate-evolution-contract.ps1
├── validate-current-target-state.ps1
├── validate-roadmap.ps1
├── validate-wave-plan.ps1
├── validate-compatibility-policy.ps1
├── validate-deprecation-policy.ps1
├── validate-migration-policy.ps1
├── validate-checkpoints.ps1
├── validate-rollback-readiness.ps1
├── validate-evolution-observability.ps1
├── run-evolution-tests.ps1
├── collect-evolution-evidence.ps1
└── verify-evolution-gate.ps1
```

## Conceito essencial

### Estado atual e estado alvo

Estado atual descreve o sistema como ele realmente funciona, incluindo dependências, limitações, dados, contratos, operação e dívida. Estado alvo descreve capacidades e características desejadas, não apenas um desenho idealizado.

### Arquitetura de transição

Entre os dois estados existe uma arquitetura temporária. Ela pode conter adapters, compatibilidade dupla, flags, rotas alternativas e sincronização de dados. Esses elementos precisam de prazo e critério de remoção.

### Roadmap e ondas

Roadmap organiza resultados arquiteturais ao longo do tempo. Ondas agrupam mudanças que podem ser entregues, observadas e avaliadas sem depender da conclusão total da transformação.

### Checkpoints e gates

Checkpoint avalia se a onda atingiu critérios técnicos e operacionais. Gate impede avanço quando risco, evidência, compatibilidade, rollback ou ownership estão incompletos.

### Rollback e roll-forward

Rollback restaura comportamento anterior quando isso ainda é seguro. Roll-forward corrige e avança quando reverter dados, contratos ou efeitos seria mais arriscado.

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-649-evolucao-controlada/service-scheduling-evolution

Set-Location `
  labs/m19/aula-649-evolucao-controlada/service-scheduling-evolution
```

Crie também as pastas `evolution`, `contracts`, `reports`, `src/main/java` e `src/test/java`.

### 2. Criar o Architecture Evolution Charter

Arquivo:

```text
evolution/ARCHITECTURE_EVOLUTION_CHARTER.md
```

Conteúdo inicial:

```markdown
# Architecture Evolution Charter

Purpose:
evolve Service Scheduling
without business interruption.

Current problem:
controllers and services depend
on persistence details,
integration contracts are coupled
and changes cross multiple boundaries.

Target outcome:
explicit use cases,
ports and adapters,
versioned contracts,
observable migrations
and protected boundaries.

Principles:
- incremental delivery;
- explicit compatibility;
- measurable checkpoints;
- reversible changes when possible;
- temporary structures have removal dates;
- no wave advances without evidence.
```

O charter não substitui o RFC. Ele define como a transformação será conduzida depois que a decisão de evoluir foi aceita.

### 3. Criar o contrato principal

Arquivo:

```text
contracts/evolution-contract.yaml
```

Conteúdo:

```yaml
evolution:
  context:
    Service-Scheduling

  requires:
    - current-state
    - target-state
    - transition-architecture
    - roadmap
    - waves
    - entry-criteria
    - exit-criteria
    - compatibility-window
    - deprecation-policy
    - data-migration-policy
    - rollback-or-roll-forward
    - observability
    - ownership
    - evidence
    - architecture-gate

  forbidden:
    - big-bang-without-proof
    - permanent-dual-path
    - compatibility-without-expiration
    - flag-without-removal-owner
    - migration-without-reconciliation
    - success-without-production-evidence
    - modernization-deep-dive

  nextLesson:
    code:
      M19.40
```

### 4. Documentar o estado atual real

Arquivo:

```text
evolution/CURRENT_STATE.md
```

Registre fatos observáveis:

```text
SchedulingController
calls SchedulingService.

SchedulingService
uses JpaAppointmentRepository directly.

SchedulingService
builds payload for Capacity API.

Database transaction
and remote call
are mixed in the same flow.

Search and command models
share the same persistence mapping.

Contract changes
require coordinated deployment.
```

Evite escrever apenas “arquitetura ruim”. Um estado atual útil precisa mostrar relações, ownership, riscos e evidências.

### 5. Criar o Architecture Inventory

Arquivo:

```text
evolution/ARCHITECTURE_INVENTORY.md
```

Para cada elemento, registre:

- nome;
- responsabilidade;
- owner;
- runtime;
- dados;
- dependências;
- consumidores;
- SLO;
- risco de mudança;
- evidência disponível.

Exemplo:

```text
Element:
SchedulingService.

Responsibilities:
validation,
transaction,
capacity call,
notification payload,
persistence.

Change risk:
high.

Reason:
multiple responsibilities
and synchronous coupling.
```

### 6. Criar o Architecture Debt Register

Arquivo:

```text
evolution/ARCHITECTURE_DEBT_REGISTER.md
```

Dívida arquitetural deve ser descrita como impacto, não como preferência estética.

Exemplo:

```text
Debt:
application service depends
on JPA repository implementation.

Impact:
use case cannot be tested
without persistence detail;
replacement cost is high;
transaction boundary is unclear.

Evidence:
ArchUnit violation ARCH-017.

Target wave:
Wave 1.
```

### 7. Definir baseline técnico e operacional

Antes da mudança, capture:

```text
confirmation p95 latency;
confirmation error rate;
capacity timeout rate;
database connection usage;
outbox lag;
deployment failure rate;
mean recovery time;
architecture violations;
cross-module cycle count.
```

Sem baseline, a equipe pode melhorar estrutura e piorar operação sem perceber.

### 8. Documentar o estado alvo

Arquivo:

```text
evolution/TARGET_STATE.md
```

Exemplo:

```text
SchedulingController
calls ConfirmAppointmentUseCase.

Use case depends
on AppointmentRepository port
and CapacityReservation port.

JPA and HTTP
are outbound adapters.

Domain model
has no persistence annotation.

Integration events
are emitted through outbox.

Search model
may evolve independently.
```

Inclua características esperadas:

- testabilidade;
- observabilidade;
- consistência;
- isolamento;
- capacidade;
- segurança;
- custo operacional;
- velocidade de mudança.

### 9. Não confundir estado alvo com implementação detalhada

O estado alvo define fronteiras, direção de dependência, ownership, contratos, dados autoritativos, características e restrições. Detalhes locais permanecem para cada onda.

### 10. Criar princípios de evolução

Arquivo:

```text
evolution/EVOLUTION_PRINCIPLES.md
```

Use princípios como:

```text
business continuity first;
small observable steps;
compatibility is temporary;
one source of truth per stage;
no hidden dual write;
no silent contract break;
measure before expanding;
remove transition code;
prefer roll-forward after irreversible data change.
```

Princípios ajudam quando o plano encontra situações não previstas.

### 11. Modelar um Evolution Item

```java
package br.com.formacao.evolution.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public record EvolutionItem(
        String id,
        String title,
        EvolutionStatus status,
        EvolutionRisk risk,
        String owner,
        List<String> dependencies,
        List<String> entryCriteria,
        List<String> exitCriteria,
        LocalDate targetDate) {

    public EvolutionItem {
        Objects.requireNonNull(id);
        Objects.requireNonNull(title);
        Objects.requireNonNull(status);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(owner);
        dependencies = List.copyOf(dependencies);
        entryCriteria = List.copyOf(entryCriteria);
        exitCriteria = List.copyOf(exitCriteria);
        Objects.requireNonNull(targetDate);
    }
}
```

O item representa um resultado arquitetural verificável, não uma tarefa genérica como “refatorar backend”.

### 12. Criar status explícitos

```java
package br.com.formacao.evolution.model;

public enum EvolutionStatus {
    PROPOSED,
    READY,
    IN_PROGRESS,
    OBSERVING,
    COMPLETED,
    PAUSED,
    ROLLED_BACK,
    SUPERSEDED
}
```

`OBSERVING` é importante. Código implantado não significa evolução concluída. A mudança precisa permanecer em observação até demonstrar estabilidade.

### 13. Classificar risco

```java
package br.com.formacao.evolution.model;

public enum EvolutionRisk {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
```

Considere:

- quantidade de consumidores;
- irreversibilidade de dados;
- impacto financeiro;
- segurança;
- janela operacional;
- dependência entre equipes;
- capacidade de rollback;
- conhecimento disponível.

### 14. Criar o roadmap

Arquivo:

```text
evolution/EVOLUTION_ROADMAP.md
```

O roadmap do laboratório terá quatro ondas:

```text
Wave 0:
baseline and protection.

Wave 1:
introduce use-case and repository ports.

Wave 2:
separate capacity integration
and transaction boundary.

Wave 3:
introduce outbox
and remove legacy direct publication.
```

O roadmap descreve resultados e dependências. Um cronograma de tarefas pode existir, mas não substitui o raciocínio arquitetural.

### 15. Criar Architecture Runway

Architecture runway é a capacidade técnica preparada antes de uma onda depender dela: observabilidade, flags, outbox, contract tests, ArchUnit, backfill e reconciliation. Evite tanto antecipação excessiva quanto ausência de preparo.

### 16. Criar Wave Plan

Arquivo:

```text
evolution/WAVE_PLAN.md
```

Para cada onda, registre:

- outcome;
- scope;
- dependencies;
- risks;
- compatibility mode;
- entry criteria;
- exit criteria;
- owner;
- metrics;
- rollback ou roll-forward;
- removal work.

### 17. Modelar Evolution Wave

```java
package br.com.formacao.evolution.model;

import java.util.List;

public record EvolutionWave(
        int number,
        String outcome,
        List<EvolutionItem> items,
        List<String> entryCriteria,
        List<String> exitCriteria,
        String owner) {

    public EvolutionWave {
        if (number < 0) {
            throw new IllegalArgumentException("Wave number cannot be negative");
        }
        items = List.copyOf(items);
        entryCriteria = List.copyOf(entryCriteria);
        exitCriteria = List.copyOf(exitCriteria);
    }
}
```

### 18. Definir critérios de entrada

Uma onda não deve começar apenas porque a data chegou.

Exemplo para Wave 2:

```text
Wave 1 completed;
repository port stable;
zero new boundary violations;
capacity API contract tests green;
rollback tested;
observability dashboard available;
owner and on-call confirmed.
```

### 19. Definir critérios de saída

Exemplo:

```text
100 percent of confirmation flow
uses CapacityReservationPort;

legacy direct HTTP path disabled;

p95 latency within budget;

error rate not worse than baseline;

no reconciliation mismatch;

seven days of stable observation;

removal pull request merged.
```

Critérios de saída precisam ser mensuráveis.

### 20. Implementar Exit Criteria Evaluator

```java
package br.com.formacao.evolution.planning;

import java.util.List;
import java.util.Map;

public final class ExitCriteriaEvaluator {

    public ExitEvaluation evaluate(
            List<String> requiredCriteria,
            Map<String, Boolean> evidence) {

        List<String> missing = requiredCriteria.stream()
                .filter(criterion -> !Boolean.TRUE.equals(evidence.get(criterion)))
                .toList();

        return missing.isEmpty()
                ? ExitEvaluation.passed()
                : ExitEvaluation.failed(missing);
    }
}
```

### 21. Criar compatibility window

Durante a transição, versão antiga e nova podem coexistir.

```java
package br.com.formacao.evolution.model;

import java.time.Instant;

public record CompatibilityWindow(
        String capability,
        Instant startsAt,
        Instant endsAt,
        String oldPath,
        String newPath,
        String removalOwner) {

    public CompatibilityWindow {
        if (!endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException("Compatibility window must have an end");
        }
    }
}
```

Uma compatibility window sem data final é uma arquitetura paralela permanente.

### 22. Criar Compatibility Policy

Arquivo:

```text
evolution/COMPATIBILITY_POLICY.md
```

Registre:

```text
old and new paths
may coexist only
for a declared window;

one path is authoritative;

comparison metrics are required;

fallback conditions are explicit;

removal has owner and date;

window extension requires approval.
```

### 23. Evitar dual write oculto

Dual write ocorre quando o mesmo comando grava em dois destinos independentes.

Problema:

```text
write A succeeds;
write B fails;
caller receives ambiguous result;
states diverge.
```

Se dual write for inevitável durante uma migração, defina ordem, idempotência, reconciliation, compensação e autoridade. Prefira outbox, CDC ou backfill controlado quando fizer sentido.

### 24. Criar Compatibility Mode

```java
package br.com.formacao.evolution.migration;

public enum CompatibilityMode {
    OLD_ONLY,
    SHADOW_NEW,
    DUAL_READ_COMPARE,
    NEW_WITH_OLD_FALLBACK,
    NEW_ONLY
}
```

A sequência não precisa usar todos os modos. Escolha o mínimo necessário.

`SHADOW_NEW` executa o caminho novo sem usar seu resultado para a decisão. Isso permite comparar comportamento com risco menor.

### 25. Definir autoridade por fase

Exemplo:

```text
OLD_ONLY:
legacy repository is authoritative.

SHADOW_NEW:
legacy result is authoritative;
new adapter is observed.

DUAL_READ_COMPARE:
legacy result is returned;
differences are reported.

NEW_WITH_OLD_FALLBACK:
new path is primary;
old path is emergency fallback.

NEW_ONLY:
new path is authoritative;
old path is removed.
```

Nunca deixe a autoridade implícita.

### 26. Criar Deprecation Policy

Arquivo:

```text
evolution/DEPRECATION_POLICY.md
```

Uma depreciação deve possuir:

- item depreciado;
- substituto;
- consumidores conhecidos;
- data de anúncio;
- janela de migração;
- telemetria de uso;
- owner;
- data de remoção;
- tratamento de consumidor atrasado.

Deprecar sem medir uso é apenas escrever uma anotação.

### 27. Evoluir contratos de API

Prefira campos opcionais, semântica estável, guia de migração e telemetria do contrato antigo. Breaking changes exigem consumidores conhecidos, janela e remoção.

### 28. Evoluir eventos

Use campo compatível, evento V2, upcaster ou tradução no consumer. Considere reprocessamento e nunca mude silenciosamente o significado de um campo publicado.

### 29. Criar Data Migration Policy

Arquivo:

```text
evolution/DATA_MIGRATION_POLICY.md
```

Inclua:

```text
source of truth;
backfill strategy;
batch size;
rate limit;
checkpoint;
reconciliation;
restart behavior;
validation query;
rollback limitation;
data retention;
security and audit.
```

### 30. Separar schema change de data backfill

Uma sequência segura costuma ser:

```text
expand schema;
deploy compatible code;
backfill data;
compare and reconcile;
switch reads;
switch writes;
observe;
contract schema;
remove old code.
```

Essa técnica reduz o risco de deploy coordenado e facilita rollback antes da contração.

### 31. Criar Migration Strategy

```java
package br.com.formacao.evolution.migration;

import java.util.List;

public record MigrationStrategy(
        String name,
        CompatibilityMode initialMode,
        List<MigrationStep> steps,
        RollbackPlan rollbackPlan,
        RollForwardPlan rollForwardPlan) {

    public MigrationStrategy {
        steps = List.copyOf(steps);
    }
}
```

### 32. Definir rollback e roll-forward

Rollback é apropriado quando:

- schema continua compatível;
- dados antigos não foram destruídos;
- efeitos externos podem ser ignorados ou compensados;
- versão anterior ainda entende os dados.

Roll-forward é preferível quando:

- backfill já alterou milhões de registros;
- consumidores já adotaram novo contrato;
- efeitos externos foram emitidos;
- rollback criaria nova inconsistência.

### 33. Criar Rollback Policy

Arquivo:

```text
evolution/ROLLBACK_POLICY.md
```

Para cada onda, registre:

```text
rollback trigger;
rollback deadline;
commands;
data implications;
consumer implications;
verification;
owner;
communication.
```

Rollback não pode existir apenas como “voltar a versão anterior”.

### 34. Criar checkpoints

Arquivo:

```text
evolution/CHECKPOINT_POLICY.md
```

Checkpoints do laboratório:

```text
Design Checkpoint;
Pre-Deployment Checkpoint;
Compatibility Checkpoint;
Operational Checkpoint;
Removal Checkpoint;
Closure Checkpoint.
```

Cada checkpoint responde a perguntas diferentes.

### 35. Modelar Evolution Checkpoint

```java
package br.com.formacao.evolution.model;

import java.time.Instant;
import java.util.List;

public record EvolutionCheckpoint(
        String name,
        Instant evaluatedAt,
        List<String> passedCriteria,
        List<String> failedCriteria,
        String decision,
        String evaluator) {

    public EvolutionCheckpoint {
        passedCriteria = List.copyOf(passedCriteria);
        failedCriteria = List.copyOf(failedCriteria);
    }
}
```

Decisões possíveis:

```text
GO;
GO_WITH_CONDITIONS;
PAUSE;
ROLLBACK;
ROLL_FORWARD;
CLOSE.
```

### 36. Atualizar o C4 por estado

Mantenha pelo menos:

```text
current-state workspace;
target-state workspace;
transition-state workspace.
```

O diagrama de transição mostra elementos temporários, rotas duplas e autoridade por fase.

Evite atualizar apenas o estado alvo e esconder a complexidade real da migração.

### 37. Ligar ADR e RFC ao roadmap

Cada onda deve apontar para:

- RFC que propôs a mudança;
- ADR que registrou a decisão;
- C4 do estado relevante;
- fitness functions aplicáveis;
- issues de implementação;
- reports de evidência.

Essa rastreabilidade permite compreender por que uma estrutura temporária existe.

### 38. Evoluir regras ArchUnit em etapas

Exemplo:

```text
Wave 0:
freeze current violations.

Wave 1:
new application packages
must not depend on adapters.

Wave 2:
remove baseline entries
for scheduling use cases.

Wave 3:
prohibit legacy package imports.
```

Não espere o fim para ativar todas as regras. Use guardrails progressivos.

### 39. Proibir regressão durante a migração

Mesmo quando existe dívida antiga, nenhuma onda deve aumentar:

```text
architecture violation count;
cycle count;
legacy API usage;
old table writes;
compatibility window duration;
exception count.
```

Regressão precisa falhar o gate ou exigir exceção explícita.

### 40. Criar Exception Policy

Arquivo:

```text
contracts/exception-policy.yaml
```

Conteúdo:

```yaml
exceptions:
  requires:
    - id
    - reason
    - owner
    - approved-by
    - created-at
    - expires-at
    - remediation
    - affected-wave

  mayNotHide:
    - cross-tenant-access
    - authorization-bypass
    - data-corruption
    - unknown-authority

  expired:
    result:
      FAIL
```

Exception não substitui uma mudança de roadmap. Ela trata uma condição temporária e limitada.

### 41. Definir métricas de evolução

Métricas úteis:

```text
percent traffic on new path;
legacy path request count;
comparison mismatch count;
backfill progress;
reconciliation mismatch;
architecture violation count;
expired exception count;
compatibility days remaining;
p95 latency delta;
error rate delta;
rollback readiness status.
```

Métrica de atividade como “quantidade de classes migradas” pode ajudar, mas não prova resultado.

### 42. Criar Observability Policy

Arquivo:

```text
evolution/OBSERVABILITY.md
```

Registre labels obrigatórias:

```text
wave;
path-version;
compatibility-mode;
contract-version;
migration-batch;
checkpoint;
rollback-state.
```

Não use labels de alta cardinalidade com dados pessoais ou IDs irrestritos.

### 43. Criar Risk Register

Arquivo:

```text
evolution/RISK_REGISTER.md
```

Exemplo:

```text
Risk:
new capacity adapter
returns semantically different availability.

Probability:
medium.

Impact:
high.

Detection:
shadow comparison mismatch metric.

Mitigation:
keep old path authoritative
until mismatch below threshold.

Contingency:
disable new adapter flag.

Owner:
Scheduling Platform.
```

### 44. Definir ownership

Em `evolution/OWNERSHIP.md`, registre accountable owner, implementação, revisão, dados, operação, segurança e contatos de consumidores. Sem owner, a remoção final tende a não acontecer.

### 45. Criar Communication Plan

Em `evolution/COMMUNICATION_PLAN.md`, registre afetados, mudança, janela, remoção, migração, canal de incidente e autoridade decisória. Comunicação faz parte da arquitetura entre equipes.

### 46. Cenário 1 — introduzir use case e port

Estado atual:

```text
Controller -> SchedulingService -> JpaRepository.
```

Estado de transição:

```text
Controller -> ConfirmAppointmentUseCase;
UseCase -> AppointmentRepository port;
JpaAppointmentRepositoryAdapter implements port.
```

Estratégia:

1. criar port e adapter;
2. adaptar serviço existente;
3. migrar endpoint por flag;
4. comparar resultados;
5. ativar novo caminho;
6. remover acesso direto.

Critério de saída:

```text
zero direct repository access
from inbound adapters.
```

### 47. Cenário 2 — separar Capacity API

Estado atual:

```text
transaction open;
HTTP call;
persistence update;
notification.
```

Estado alvo:

```text
use case coordinates domain;
CapacityReservationPort isolates HTTP;
timeout and retry policy are explicit;
outbox publishes confirmed fact.
```

A evolução deve primeiro extrair o adapter, depois estabilizar contrato e somente então alterar fronteira transacional.

Mudar tudo em um deploy aumenta a superfície de diagnóstico.

### 48. Cenário 3 — introduzir outbox

Sequência:

```text
create outbox table;
write event and aggregate in one transaction;
run relay in shadow;
compare produced event;
enable real publication;
stop direct publication;
observe duplicates and lag;
remove old publisher.
```

O caminho antigo permanece autoritativo até o checkpoint definido. Depois da mudança de autoridade, fallback precisa ser cuidadosamente avaliado para não publicar duas vezes.

### 49. Testar dependências entre ondas

`WaveDependencyTest` deve impedir:

```text
Wave 2 READY
while Wave 1 is not COMPLETED;

Wave 3 IN_PROGRESS
without outbox schema deployed;

Removal wave completed
while legacy usage is greater than zero.
```

### 50. Testar compatibility window

`CompatibilityWindowTest` valida:

- data final obrigatória;
- owner de remoção;
- autoridade definida;
- modo de comparação;
- extensão aprovada;
- falha após expiração.

### 51. Testar rollback readiness

`RollbackReadinessTest` confirma:

- versão anterior disponível;
- schema compatível;
- comandos testados;
- dados preservados;
- owner presente;
- critério de acionamento;
- verificação pós-rollback.

### 52. Testar depreciação e remoção

`DeprecationRemovalTest` deve falhar quando:

```text
old path has active consumers;
usage telemetry is unavailable;
removal date is missing;
migration guide is absent;
compatibility window is open.
```

### 53. Testar evidências

`EvidenceCompletenessTest` exige baseline, testes, arquitetura, métricas de produção, comparação, checkpoint, owner e timestamp.

### 54. Criar roadmap policy

Arquivo:

```text
contracts/roadmap-policy.yaml
```

Conteúdo:

```yaml
roadmap:
  requires:
    - current-state
    - target-state
    - waves
    - dependencies
    - owners
    - outcomes
    - metrics
    - removal-work

  taskListWithoutArchitecturalOutcome:
    result:
      FAIL

  waveWithoutExitCriteria:
    result:
      FAIL
```

### 55. Criar wave policy

Arquivo:

```text
contracts/wave-policy.yaml
```

Conteúdo:

```yaml
wave:
  requires:
    - outcome
    - scope
    - entry-criteria
    - exit-criteria
    - risk
    - compatibility-mode
    - rollback-or-roll-forward
    - owner
    - evidence

  nextWaveBeforeCheckpoint:
    forbidden:
      true
```

### 56. Criar migration policy

Arquivo:

```text
contracts/migration-policy.yaml
```

Conteúdo:

```yaml
migration:
  data:
    requires:
      - source-of-truth
      - checkpoint
      - restartability
      - reconciliation
      - rate-limit

  dualWrite:
    hidden:
      forbidden

  transitionCode:
    requires:
      - owner
      - removal-date
      - removal-criteria

  irreversibleChange:
    requires:
      - roll-forward-plan
      - explicit-approval
```

### 57. Criar observability policy

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  evolution:
    required:
      - wave
      - traffic-share
      - old-path-usage
      - mismatch-count
      - latency-delta
      - error-rate-delta
      - migration-progress
      - rollback-readiness

  evidenceRetentionDays:
    180

  forbidden:
    - personal-data
    - secret
    - token
```

### 58. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson650:
    forbidden:
      - legacy-portfolio-assessment-deep-dive
      - legacy-business-capability-scoring
      - modernization-program-governance
      - legacy-organization-transformation

  lesson651:
    forbidden:
      - full-strangler-fig-implementation
      - proxy-routing-deep-dive
      - branch-by-abstraction-deep-dive

  allowed:
    - incremental-wave
    - compatibility-window
    - transition-architecture
    - removal-plan
```

### 59. Criar reports

Exemplo de `reports/migration-progress-report.yaml`:

```yaml
evolution:
  wave:
    2

  status:
    OBSERVING

  trafficOnNewPathPercent:
    80

  oldPathRequestsLast24h:
    412

  comparisonMismatchPercent:
    0.02

  latencyDeltaPercent:
    3.5

  errorRateDeltaPercent:
    0.0

  rollbackReady:
    true

  compatibilityEndsAt:
    2026-09-30

  gate:
    GO_WITH_CONDITIONS
```

### 60. Criar Evolution Gate

O gate valida:

```text
charter;
current state;
target state;
inventory;
debt register;
roadmap;
wave dependencies;
entry criteria;
exit criteria;
compatibility;
deprecation;
data migration;
rollback;
observability;
risks;
ownership;
communication;
tests;
reports;
evidence;
non-anticipation.
```

Status:

```text
PASS;
PASS_OBSERVING;
PAUSE_MISSING_EVIDENCE;
FAIL_CURRENT_STATE;
FAIL_TARGET_STATE;
FAIL_ROADMAP;
FAIL_WAVE_DEPENDENCY;
FAIL_COMPATIBILITY;
FAIL_DEPRECATION;
FAIL_MIGRATION;
FAIL_ROLLBACK;
FAIL_METRIC_REGRESSION;
FAIL_EXPIRED_EXCEPTION;
FAIL_REMOVAL;
INCONCLUSIVE.
```

### 61. Coletar evidence

Arquivo:

```text
contracts/evolution-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- current state version;
- target state version;
- active wave;
- wave status;
- traffic share;
- old path usage;
- mismatch count;
- migration progress;
- architecture violation count;
- compatibility end date;
- rollback readiness;
- checkpoint decision;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua dados pessoais, secrets, tokens, endpoints privados, credenciais ou conteúdo interno de clientes.

### 62. Executar testes

```powershell
.\scripts\m19\service-scheduling-evolution\run-evolution-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide roadmap, dependências, compatibility windows, depreciação, rollback, exceptions, evidence e regras arquiteturais.

### 63. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-evolution\validate-evolution-contract.ps1

.\scripts\m19\service-scheduling-evolution\validate-current-target-state.ps1

.\scripts\m19\service-scheduling-evolution\validate-roadmap.ps1

.\scripts\m19\service-scheduling-evolution\validate-wave-plan.ps1

.\scripts\m19\service-scheduling-evolution\validate-compatibility-policy.ps1

.\scripts\m19\service-scheduling-evolution\validate-deprecation-policy.ps1

.\scripts\m19\service-scheduling-evolution\validate-migration-policy.ps1

.\scripts\m19\service-scheduling-evolution\validate-checkpoints.ps1

.\scripts\m19\service-scheduling-evolution\validate-rollback-readiness.ps1

.\scripts\m19\service-scheduling-evolution\validate-evolution-observability.ps1

.\scripts\m19\service-scheduling-evolution\run-evolution-tests.ps1

.\scripts\m19\service-scheduling-evolution\collect-evolution-evidence.ps1

.\scripts\m19\service-scheduling-evolution\verify-evolution-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 64. Encerrar o laboratório

Confirme:

- estado atual, alvo e transição explícitos;
- roadmap, ondas e critérios validados;
- authority e compatibility window definidos;
- depreciação, migração e reconciliation controladas;
- rollback ou roll-forward testado;
- C4, ADR, RFC e ArchUnit atualizados;
- métricas, exceptions, remoção, owners e evidence presentes;
- modernização de legado não aprofundada.

## Entendendo o que foi feito

### A mudança ganhou um estado inicial verificável

O estado atual deixou de ser uma opinião. Inventário, dependências, métricas, violações, contratos e riscos formaram uma baseline.

### O estado alvo ganhou limites

O desenho futuro passou a definir fronteiras, owners, dados autoritativos e características, sem congelar detalhes locais prematuramente.

### A transição ganhou arquitetura própria

Flags, adapters, rotas paralelas, shadow traffic e compatibilidade deixaram de ser improvisos. Cada elemento temporário recebeu autoridade, prazo e critério de remoção.

### O roadmap ganhou gates

Ondas não avançam apenas por calendário. Entry criteria, exit criteria, checkpoints, evidence e métricas decidem a continuidade.

### O risco ganhou respostas operacionais

Rollback, roll-forward, reconciliation, comunicação e ownership foram definidos antes da mudança crítica.

## Erros comuns importantes

### Desenhar apenas o estado alvo

A equipe não enxerga como coexistirão versões, dados e contratos durante a migração.

### Tratar roadmap como lista de tarefas

Atividades podem terminar sem produzir uma melhoria arquitetural verificável.

### Criar compatibility window sem fim

O sistema mantém caminhos duplicados, custo operacional e ambiguidade de autoridade.

### Ativar dual write sem reconciliation

Falhas parciais criam divergência silenciosa.

### Declarar sucesso no deploy

A mudança pode degradar latência, erro, custo ou operação depois da implantação.

### Não remover transition code

Feature flags, adapters e tabelas antigas se tornam nova dívida permanente.

### Migrar dados e contrair schema no mesmo passo

Rollback fica impossível e versões antigas deixam de funcionar.

### Atualizar ArchUnit apenas no final

Novas violações continuam entrando durante a transformação.

### Usar exceção sem expiração

A exceção vira política informal e invisível.

### Antecipar modernização de legado

A aula atual controla uma evolução conhecida. A avaliação ampla de legado pertence à aula 650.

## Comandos úteis

### Validar roadmap

```powershell
.\scripts\m19\service-scheduling-evolution\validate-roadmap.ps1
```

### Validar ondas

```powershell
.\scripts\m19\service-scheduling-evolution\validate-wave-plan.ps1
```

### Validar compatibilidade

```powershell
.\scripts\m19\service-scheduling-evolution\validate-compatibility-policy.ps1
```

### Validar rollback

```powershell
.\scripts\m19\service-scheduling-evolution\validate-rollback-readiness.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-evolution\verify-evolution-gate.ps1
```

## Exercício guiado

Escolha uma fronteira do `Service Scheduling` que precise evoluir.

Pode ser:

```text
repository coupling;
capacity integration;
notification publication;
search model;
API contract;
data ownership.
```

Depois:

1. descreva o estado atual com evidência;
2. desenhe o estado alvo;
3. represente a arquitetura de transição;
4. divida a mudança em três ou quatro ondas;
5. defina entry e exit criteria;
6. escolha compatibility modes;
7. determine autoridade por fase;
8. planeje migração e reconciliation;
9. defina rollback ou roll-forward;
10. crie métricas, checkpoints, reports e gate;
11. declare como transition code será removido.

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 648 e ponte para a aula 650 foram preservadas;
- o laboratório `service-scheduling-evolution` foi criado;
- charter, estado atual, inventário, dívida e baseline foram documentados;
- estado alvo e arquitetura de transição definem fronteiras, ownership, contratos e autoridade;
- roadmap, runway e ondas possuem outcomes, dependências, riscos, owners e critérios;
- entry e exit criteria são mensuráveis;
- compatibility window possui término, authority e removal owner;
- dual write oculto foi proibido;
- shadow mode, comparison, fallback e new-only foram documentados;
- depreciação possui telemetria, guia e remoção;
- APIs, eventos e dados possuem estratégia compatível;
- backfill tem checkpoint, rate limit, restart e reconciliation;
- expand, migrate e contract foram separados;
- rollback ou roll-forward foram testados;
- C4, RFC, ADR, fitness functions e ArchUnit evoluem por onda;
- regressões e exceptions expiradas falham;
- métricas, riscos, ownership e comunicação foram definidos;
- testes, reports, evidence e gate foram criados;
- modernização de legado não foi aprofundada;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-649-evolucao-controlada/service-scheduling-evolution `
  scripts/m19/service-scheduling-evolution `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|productionHost|customerData|unboundedCompatibility|permanentFlag"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): planejar evolucao arquitetural controlada"
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
- endpoints privados;
- topologia real;
- compatibility window sem fim;
- flags permanentes;
- modernização de legado aprofundada.

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou evolução controlada da arquitetura.

Você criou:

```text
Architecture Evolution Charter;

Current State;

Target State;

Architecture Inventory;

Architecture Debt Register;

Evolution Principles;

Evolution Roadmap;

Wave Plan;

Compatibility Policy;

Deprecation Policy;

Data Migration Policy;

Checkpoint Policy;

Rollback Policy;

Risk Register;

Ownership;

Communication Plan;

reports;

evidence;

gate.
```

Você comprovou que arquitetura não evolui com segurança por um salto direto entre diagramas; que o estado atual precisa ser observado; que o estado alvo precisa definir fronteiras e características; que a arquitetura de transição é uma arquitetura real; que roadmap precisa organizar resultados; que ondas exigem dependências, entry criteria e exit criteria; que compatibility windows precisam terminar; que authority deve ser explícita; que dual write exige controle; que depreciação precisa de telemetria; que migrações devem ser reiniciáveis e reconciliáveis; que rollback e roll-forward dependem da reversibilidade; que transition code precisa ser removido; e que o avanço depende de evidence e gate.

A próxima aula será:

```text
650 - M19.40 - Modernizacao de legado
```

Nela, você irá avaliar sistemas legados de forma estruturada, distinguir tipos de legado, relacionar risco técnico e valor de negócio e escolher estratégias de modernização sem cair em reescrita automática.

Modernização de legado não foi aprofundada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Documentei o estado atual.
- [ ] Defini o estado alvo.
- [ ] Modelei a arquitetura de transição.
- [ ] Organizei roadmap e ondas.
- [ ] Criei entry e exit criteria.
- [ ] Defini compatibility windows.
- [ ] Planejei migração e reconciliation.
- [ ] Testei rollback ou roll-forward.
- [ ] Criei métricas, reports e evidence.
- [ ] Verifiquei o gate final.

## Troubleshooting adicional

### O roadmap virou um Gantt de tarefas

Reescreva cada onda em termos de outcome arquitetural, capacidade protegida e evidência de saída.

### O estado atual está genérico

Adicione relações, owners, dados, contratos, métricas, violações e riscos observados.

### O estado alvo exige uma reescrita completa

Quebre a mudança por fronteiras e identifique estados intermediários que entreguem valor.

### A compatibility window precisa ser estendida

Exija justificativa, novo risco, owner, data final e aprovação. Não prorrogue automaticamente.

### Shadow traffic apresenta diferenças

Classifique se a diferença é bug, semântica distinta, dado stale ou regra não documentada antes de avançar.

### O rollback não é mais seguro

Formalize a decisão de roll-forward, restrinja tráfego e priorize correção compatível.

### O caminho antigo ainda recebe tráfego

Identifique consumidores, publique depreciação, acompanhe telemetria e não remova antes do critério.

### A discussão virou avaliação de um monólito legado inteiro

Preserve a modernização de legado para a aula 650.

## Perguntas de revisão

1. O que é evolução controlada da arquitetura?
2. Por que o estado atual precisa de evidência?
3. O que o estado alvo deve definir?
4. O que é arquitetura de transição?
5. O que é architecture runway?
6. Qual diferença entre roadmap e lista de tarefas?
7. O que é uma onda de evolução?
8. O que são entry criteria?
9. O que são exit criteria?
10. Por que existe o status OBSERVING?
11. O que é compatibility window?
12. Por que authority precisa ser explícita?
13. Qual risco do dual write?
14. O que é shadow mode?
15. O que uma depreciação precisa medir?
16. Por que separar expand, migrate e contract?
17. Quando usar rollback?
18. Quando preferir roll-forward?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

## Roteiro de resposta

1. Mudança incremental com critérios, evidências e controle de risco.
2. Para evitar planejamento baseado em suposição.
3. Fronteiras, ownership, contratos, dados e características.
4. Estado temporário entre arquitetura atual e alvo.
5. Capacidade técnica preparada para suportar próximas mudanças.
6. Roadmap organiza outcomes e dependências; tarefas organizam execução.
7. Conjunto entregável e observável de mudanças relacionadas.
8. Condições obrigatórias para iniciar uma onda.
9. Evidências obrigatórias para concluir e avançar.
10. Porque deploy não prova estabilidade.
11. Período limitado de coexistência entre versões ou caminhos.
12. Para evitar decisões inconsistentes e divergência.
13. Falha parcial entre dois destinos.
14. Executar o caminho novo sem torná-lo autoritativo.
15. Uso do caminho antigo e consumidores restantes.
16. Para preservar compatibilidade e capacidade de rollback.
17. Quando a mudança ainda é reversível com segurança.
18. Quando dados, contratos ou efeitos tornam a reversão mais arriscada.
19. Modernização de legado.
20. Modernização de legado.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 649 - M19.39 - Evolucao controlada da arquitetura**

- Aprofundei evolução controlada da arquitetura.
- Criei o laboratório `service-scheduling-evolution`.
- Criei Architecture Evolution Charter.
- Documentei estado atual com evidências.
- Criei Architecture Inventory e Architecture Debt Register.
- Registrei baseline técnica e operacional.
- Defini estado alvo com fronteiras, ownership e características.
- Modelei arquitetura de transição.
- Criei Evolution Principles.
- Modelei Evolution Item, status, risco, wave e checkpoint.
- Criei roadmap por outcomes arquiteturais.
- Organizei ondas com dependências.
- Defini entry criteria e exit criteria.
- Modelei compatibility windows com data final.
- Defini authority por fase.
- Proibi dual write oculto.
- Modelei shadow, compare, fallback e new-only.
- Criei Deprecation Policy com telemetria e remoção.
- Criei Data Migration Policy com checkpoint e reconciliation.
- Separei expand, migrate e contract.
- Planejei rollback e roll-forward.
- Atualizei C4, ADR, RFC, fitness functions e ArchUnit por onda.
- Criei Exception Policy temporária.
- Defini métricas de evolução e observabilidade.
- Criei Risk Register, Ownership e Communication Plan.
- Criei testes de roadmap, compatibilidade, rollback e remoção.
- Criei reports, evidence e gate.
- Não antecipei Modernização de legado.
- Próxima aula: Modernização de legado.
```

## Referência técnica curta

- Architecture Evolution.
- Current State.
- Target State.
- Transition Architecture.
- Architecture Roadmap.
- Evolution Wave.
- Entry Criteria.
- Exit Criteria.
- Architecture Runway.
- Compatibility Window.
- Shadow Mode.
- Deprecation.
- Data Migration.
- Expand and Contract.
- Rollback.
- Roll-forward.
- Architecture Checkpoint.
- Evolution Gate.

Regra final:

```text
Evolução controlada da arquitetura transforma mudança técnica em uma sequência verificável. Service Scheduling começa com estado atual baseado em inventário, dependências, métricas, violações e riscos, define estado alvo por fronteiras, ownership, contratos, dados e características e documenta uma arquitetura de transição com autoridade explícita. O roadmap organiza outcomes em ondas pequenas, cada uma com dependências, entry criteria, exit criteria, owner, risco, compatibility mode, rollback ou roll-forward e evidence. Compatibility windows possuem término, caminhos antigos têm telemetria e depreciação, dual write nunca é oculto, migrações de dados são reiniciáveis e reconciliáveis e expand, migrate e contract permanecem separados. C4, RFC, ADR, fitness functions e ArchUnit evoluem junto com a implementação, regras progressivas impedem regressão, exceptions expiram e transition code recebe data de remoção. Deploy inicia o período de observação, não encerra a onda; checkpoints avaliam métricas, mismatches, uso legado, readiness e estabilidade antes do próximo passo. Reports, evidence e gate distinguem progresso, pausa, rollback, roll-forward, regressão e remoção incompleta, enquanto a avaliação ampla de modernização de legado permanece reservada à aula 650.
```
