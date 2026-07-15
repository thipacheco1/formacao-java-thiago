# 652 - M19.42 - Microservicos com criterio

## Apresentação da aula

Na aula 651, você aplicou Strangler Fig para substituir `Appointment Details` de forma incremental. Você criou uma entrada única, manteve o legado como caminho seguro, comparou respostas em shadow, controlou autoridade, promoveu cohorts e definiu critérios de retirada.

Agora surge uma decisão que muitas equipes tomam cedo demais:

```text
a capacidade extraída
precisa realmente virar
um microserviço?
```

Uma implementação nova atrás de um router não é automaticamente um microserviço. Ela pode permanecer como módulo interno, tornar-se um deployable independente ou evoluir para um serviço autônomo. Cada opção possui benefícios, custos e condições de sucesso diferentes.

Microserviços não são sinônimo de modernidade, escalabilidade ou qualidade. Eles trocam acoplamento interno por contratos de rede, falhas parciais, consistência distribuída, observabilidade, segurança entre serviços, automação de deploy e responsabilidade operacional.

A decisão correta não começa com quantidade de serviços. Ela começa com uma capacidade de negócio, um problema mensurável e uma fronteira capaz de sustentar autonomia.

A pergunta desta aula será:

```text
quando uma capacidade merece
fronteira de serviço,
autonomia de deploy,
dados próprios
e operação independente;

e quando um monólito modular
é a escolha mais madura?
```

O laboratório será:

```text
labs/m19/aula-652-microservicos-com-criterio/service-scheduling-boundary-decision
```

Você avaliará a capacidade `Appointment Details` modernizada na aula 651 e também a capacidade crítica `Appointment Lifecycle`. Criará catálogo de capacidades, mapa de dependências, scorecard, critérios obrigatórios, opções arquiteturais, readiness operacional, ownership de dados, contratos, SLOs, custo distribuído, experimentos, recommendation report, evidence e gate.

A conclusão será uma decisão justificável para cada capacidade.

A próxima aula será:

```text
653 - M19.43 - Anti patterns de microservicos
```

Distribuição por entidade, nanosserviços, banco compartilhado, chatty communication, distributed monolith e outros anti-patterns serão aprofundados na aula 653. Nesta aula, eles aparecerão apenas como sinais de bloqueio da decisão.

Regra central:

```text
microserviço é uma fronteira
organizacional, operacional,
de dados e de mudança;

se a equipe quer apenas
separar código,
um módulo costuma ser suficiente.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
650:
Modernizacao de legado.

651:
Strangler Fig.

652:
Microservicos com criterio.

653:
Anti patterns de microservicos.

654:
Transacoes distribuidas e Saga revisitada.
```

A progressão é:

```text
entender o legado;

substituir uma capacidade incrementalmente;

avaliar se a fronteira merece autonomia distribuída;

reconhecer decomposições ruins;

tratar transações entre fronteiras.
```

A aula 651 provou que uma capacidade pode ser extraída por trás de uma fronteira sem decidir ainda a topologia final. A aula 652 usa essa liberdade para comparar três destinos possíveis:

```text
módulo no monólito;

deployable independente;

microserviço autônomo.
```

A decisão será feita por capacidade, não pelo sistema inteiro.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-652-microservicos-com-criterio/service-scheduling-boundary-decision
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/microservices
│   ├── capability
│   │   ├── CapabilityId.java
│   │   ├── CapabilityProfile.java
│   │   ├── BusinessChangeRate.java
│   │   └── Criticality.java
│   ├── boundary
│   │   ├── BoundaryCandidate.java
│   │   ├── BoundaryOption.java
│   │   ├── BoundaryDecision.java
│   │   └── BoundaryDecisionService.java
│   ├── criteria
│   │   ├── Criterion.java
│   │   ├── CriterionScore.java
│   │   ├── MandatoryCriterion.java
│   │   ├── WeightedScore.java
│   │   └── DecisionThreshold.java
│   ├── dependency
│   │   ├── Dependency.java
│   │   ├── DependencyType.java
│   │   ├── CouplingMap.java
│   │   └── DependencyRisk.java
│   ├── data
│   │   ├── DataOwnership.java
│   │   ├── DataAuthority.java
│   │   ├── CrossBoundaryQuery.java
│   │   └── DataSeparationAssessment.java
│   ├── operations
│   │   ├── OperationalReadiness.java
│   │   ├── SloProfile.java
│   │   ├── OnCallReadiness.java
│   │   └── ServiceCostEstimate.java
│   ├── experiment
│   │   ├── BoundaryExperiment.java
│   │   ├── ExperimentResult.java
│   │   ├── DeployIndependenceExperiment.java
│   │   └── FailureIsolationExperiment.java
│   └── report
│       ├── BoundaryRecommendation.java
│       ├── RecommendationReason.java
│       └── DecisionEvidence.java
├── src/test/java/br/com/formacao/microservices
│   ├── criteria
│   ├── dependency
│   ├── data
│   ├── operations
│   ├── experiment
│   └── architecture
├── microservices
│   ├── MICROSERVICE_DECISION_CHARTER.md
│   ├── CAPABILITY_CATALOG.md
│   ├── OPTION_CATALOG.md
│   ├── BOUNDARY_CRITERIA.md
│   ├── MANDATORY_GATES.md
│   ├── DEPENDENCY_MAP.md
│   ├── DATA_OWNERSHIP.md
│   ├── TEAM_AND_OWNERSHIP.md
│   ├── DEPLOY_INDEPENDENCE.md
│   ├── OPERATIONAL_READINESS.md
│   ├── DISTRIBUTED_COSTS.md
│   ├── SECURITY_MODEL.md
│   ├── CONTRACT_MODEL.md
│   ├── TEST_STRATEGY.md
│   ├── MIGRATION_OPTIONS.md
│   ├── DECISION_MATRIX.md
│   └── OPEN_QUESTIONS.md
├── contracts
│   ├── microservice-decision-contract.yaml
│   ├── capability-policy.yaml
│   ├── boundary-policy.yaml
│   ├── data-ownership-policy.yaml
│   ├── deploy-independence-policy.yaml
│   ├── operational-readiness-policy.yaml
│   ├── team-ownership-policy.yaml
│   ├── contract-policy.yaml
│   ├── security-policy.yaml
│   ├── cost-policy.yaml
│   └── non-anticipation-policy.yaml
└── reports
    ├── capability-profile-report.yaml
    ├── dependency-risk-report.yaml
    ├── data-separation-report.yaml
    ├── operational-readiness-report.yaml
    ├── option-comparison-report.yaml
    ├── recommendation-report.yaml
    └── microservice-decision-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-boundary-decision
├── validate-microservice-decision-contract.ps1
├── validate-capability-catalog.ps1
├── validate-boundary-criteria.ps1
├── validate-mandatory-gates.ps1
├── validate-dependency-map.ps1
├── validate-data-ownership.ps1
├── validate-team-ownership.ps1
├── validate-deploy-independence.ps1
├── validate-operational-readiness.ps1
├── validate-distributed-costs.ps1
├── run-boundary-experiments.ps1
├── run-microservice-decision-tests.ps1
├── collect-microservice-decision-evidence.ps1
└── verify-microservice-decision-gate.ps1
```

---

## Conceito essencial

### Módulo, deployable e microserviço

Um módulo separa código e dependências dentro do mesmo processo. Ele pode ter domínio, application services, ports, adapters e regras arquiteturais próprias, mas compartilha release, runtime e falha com o restante da aplicação.

Um deployable independente pode ser construído e implantado separadamente. Ele já paga custos de rede, configuração, observabilidade e operação, mesmo que ainda compartilhe alguns dados ou ownership organizacional.

Um microserviço maduro possui autonomia coerente:

```text
capacidade de negócio clara;

time responsável;

deploy independente;

dados e invariantes sob sua autoridade;

contratos versionados;

SLO e operação próprios;

falhas contidas;

evolução sem coordenação constante.
```

Autonomia não significa isolamento absoluto. Significa que dependências são explícitas, limitadas e operáveis.

### Fronteira de negócio antes da fronteira técnica

Uma fronteira saudável costuma acompanhar linguagem, regras, ritmo de mudança, owner e dados de uma capacidade. Separar apenas porque existem controllers, tabelas ou entidades produz fronteiras técnicas frágeis.

`Appointment Details` é uma consulta composta. Ela pode ser excelente unidade de modernização, mas talvez não seja uma capacidade autônoma suficiente para possuir banco, on-call, deploy e roadmap próprios.

`Appointment Lifecycle`, por outro lado, possui comandos, invariantes, estados, políticas de confirmação, reagendamento e cancelamento. É um candidato mais forte, mas ainda precisa provar que consegue operar sem sincronização excessiva com Capacity, Customer e Field Execution.

### Critérios obrigatórios e critérios ponderados

Nem todo critério pode ser compensado por score. Um candidato não deve ser aprovado como microserviço se não possui owner, autoridade de dados, estratégia de falha, observabilidade ou capacidade de deploy independente.

Esses itens são gates obrigatórios.

Depois dos gates, critérios ponderados ajudam a comparar benefícios e custos:

```text
ritmo de mudança;

necessidade de escala diferente;

isolamento de falha;

clareza de domínio;

força da equipe;

custo de coordenação;

complexidade distribuída;

reversibilidade.
```

### O custo distribuído precisa ser pago

Ao cruzar um processo, uma chamada de método ganha timeout, retry, autenticação, serialização, tracing, versionamento e falha parcial. Transações locais podem virar consistência eventual; joins podem virar composição ou read model; o diagnóstico passa a exigir correlação entre serviços.

Se o benefício da autonomia não supera esses custos, separar é desperdício arquitetural.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-652-microservicos-com-criterio/service-scheduling-boundary-decision

Set-Location `
  labs/m19/aula-652-microservicos-com-criterio/service-scheduling-boundary-decision
```

### 2. Criar Microservice Decision Charter

Arquivo:

```text
microservices/MICROSERVICE_DECISION_CHARTER.md
```

Conteúdo:

```markdown
# Microservice Decision Charter

Contexto:

Service Scheduling.

Problema:

Decidir o destino arquitetural
de capacidades modernizadas.

Opções:

- modular monolith;
- independent deployable;
- autonomous microservice.

Regra:

Nenhuma opção recebe aprovação
apenas por preferência tecnológica.

Evidências obrigatórias:

- capability boundary;
- dependency map;
- data authority;
- team ownership;
- deploy independence;
- operational readiness;
- security model;
- cost estimate;
- experiments;
- recommendation.

Fora de escopo:

- catálogo completo de anti-patterns;
- implementação profunda de Saga;
- service mesh;
- plataforma Kubernetes detalhada.
```

### 3. Criar contrato principal

Arquivo:

```text
contracts/microservice-decision-contract.yaml
```

Conteúdo:

```yaml
microserviceDecision:
  context:
    Service-Scheduling

  options:
    - MODULAR_MONOLITH
    - INDEPENDENT_DEPLOYABLE
    - AUTONOMOUS_MICROSERVICE

  required:
    - business-capability
    - owner
    - data-authority
    - dependency-map
    - deploy-independence
    - operational-readiness
    - contract-strategy
    - security-model
    - distributed-costs
    - experiments
    - recommendation

  forbidden:
    - microservice-by-entity
    - database-sharing-without-transition-plan
    - distributed-transaction-by-default
    - deployment-lockstep-presented-as-autonomy
    - service-without-owner
    - score-without-mandatory-gates
    - antipattern-deep-dive
    - saga-deep-dive

  nextLesson:
    code:
      M19.43
```

### 4. Catalogar capacidades

Arquivo:

```text
microservices/CAPABILITY_CATALOG.md
```

Registre pelo menos:

```text
Appointment Details;

Appointment Lifecycle;

Capacity Reservation;

Customer Communication;

Field Execution Preparation;

Operational Search;

Scheduling Analytics.
```

Para cada capacidade, documente propósito, linguagem, comandos, consultas, dados, invariantes, owner atual, consumers, frequência de mudança, criticidade e SLO.

### 5. Criar Capability Profile

```java
public record CapabilityProfile(
        CapabilityId id,
        String name,
        String businessPurpose,
        Criticality criticality,
        BusinessChangeRate changeRate,
        String currentOwner,
        Set<String> commands,
        Set<String> queries,
        Set<String> authoritativeData,
        Set<String> consumers) {

    public CapabilityProfile {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(businessPurpose);
        Objects.requireNonNull(criticality);
        Objects.requireNonNull(changeRate);
        Objects.requireNonNull(currentOwner);
        commands = Set.copyOf(commands);
        queries = Set.copyOf(queries);
        authoritativeData = Set.copyOf(authoritativeData);
        consumers = Set.copyOf(consumers);
    }
}
```

O perfil deve representar a capacidade, não um pacote Java.

### 6. Avaliar `Appointment Details`

Registre:

```text
Purpose:
compor detalhes do agendamento.

Commands:
nenhum.

Queries:
get appointment details.

Authority:
nenhuma autoridade primária;
usa Appointment, Customer e Capacity.

Change rate:
moderado.

Independent scale:
possível para leitura.

Operational value:
reduzir carga e latência de composição.
```

A ausência de autoridade própria é um sinal de que essa capacidade pode ser melhor como read model, BFF, query service ou módulo, e não necessariamente como microserviço autônomo.

### 7. Avaliar `Appointment Lifecycle`

Registre:

```text
Purpose:
gerenciar confirmação,
reagendamento e cancelamento.

Commands:
confirm;
reschedule;
cancel.

Authority:
Appointment state and revision.

Invariants:
state transition;
window consistency;
expected version;
reservation relationship.

Criticality:
high.
```

Esse candidato possui autoridade clara, mas sua viabilidade depende de reduzir acoplamento síncrono com Capacity Reservation e outros contextos.

### 8. Definir opções arquiteturais

Arquivo:

```text
microservices/OPTION_CATALOG.md
```

Descreva:

```text
MODULAR_MONOLITH:
mesmo processo e deploy;
fronteira interna explícita;
dados podem compartilhar transação;
menor custo operacional.

INDEPENDENT_DEPLOYABLE:
processo e deploy separados;
contratos de rede;
possível autoridade parcial;
operação própria necessária.

AUTONOMOUS_MICROSERVICE:
capacidade, equipe, deploy,
dados, SLO e evolução autônomos;
custos distribuídos completos.
```

### 9. Criar enum de opções

```java
public enum BoundaryOption {
    MODULAR_MONOLITH,
    INDEPENDENT_DEPLOYABLE,
    AUTONOMOUS_MICROSERVICE
}
```

### 10. Criar critérios obrigatórios

Arquivo:

```text
microservices/MANDATORY_GATES.md
```

Um microserviço candidato precisa ter:

```text
business capability clara;

owner responsável;

data authority definida;

contratos explícitos;

deploy independente praticável;

SLO e observabilidade;

segurança entre fronteiras;

estratégia de falhas;

runbook e on-call;

custo aceito;

plano de migração e rollback.
```

Se um gate falhar, o resultado não pode ser aprovado apenas por média ponderada.

### 11. Criar Mandatory Criterion

```java
public record MandatoryCriterion(
        String code,
        String description,
        boolean satisfied,
        String evidence,
        String blockingReason) {

    public MandatoryCriterion {
        Objects.requireNonNull(code);
        Objects.requireNonNull(description);
        Objects.requireNonNull(evidence);
    }

    public boolean blocksMicroservice() {
        return !satisfied;
    }
}
```

### 12. Criar critérios ponderados

Arquivo:

```text
microservices/BOUNDARY_CRITERIA.md
```

Use critérios como:

```text
domain cohesion;
change independence;
independent scaling;
failure isolation;
data ownership clarity;
team autonomy;
deploy independence;
contract stability;
operational readiness;
security readiness;
distributed complexity;
coordination cost;
platform maturity;
reversibility.
```

Os benefícios recebem score positivo. Custos e riscos devem ser modelados como penalidade, não escondidos em texto livre.

### 13. Criar Criterion Score

```java
public record CriterionScore(
        String criterion,
        int weight,
        int score,
        String evidence) {

    public CriterionScore {
        if (weight < 1 || weight > 10) {
            throw new IllegalArgumentException(
                    "Weight must be between 1 and 10");
        }

        if (score < 0 || score > 5) {
            throw new IllegalArgumentException(
                    "Score must be between 0 and 5");
        }

        Objects.requireNonNull(criterion);
        Objects.requireNonNull(evidence);
    }

    public int weightedValue() {
        return weight * score;
    }
}
```

### 14. Separar benefício e custo

Crie dois grupos:

```text
benefits:
cohesion, autonomy, scale, isolation.

costs:
network, consistency, operation,
security, testing, platform,
team cognitive load.
```

Uma soma única sem mostrar os dois lados pode produzir falsa precisão.

### 15. Mapear dependências

Arquivo:

```text
microservices/DEPENDENCY_MAP.md
```

Para cada dependência, registre:

```text
source capability;

target capability;

type;

sync or async;

frequency;

latency sensitivity;

failure behavior;

data exchanged;

owner;

alternative.
```

### 16. Criar tipos de dependência

```java
public enum DependencyType {
    SYNCHRONOUS_COMMAND,
    SYNCHRONOUS_QUERY,
    DOMAIN_EVENT,
    INTEGRATION_EVENT,
    SHARED_DATA,
    BATCH_FILE,
    MANUAL_PROCESS
}
```

### 17. Criar Dependency

```java
public record Dependency(
        CapabilityId source,
        CapabilityId target,
        DependencyType type,
        String purpose,
        boolean requiredForCriticalPath,
        Duration latencyBudget,
        String failureBehavior) {
}
```

### 18. Identificar critical path

Para `Appointment Lifecycle`, o reagendamento pode depender de Capacity Reservation.

Pergunte:

```text
a reserva precisa ser confirmada
na mesma chamada?

pode existir hold temporário?

é possível usar saga?

o cancelamento precisa esperar comunicação?
```

A aula 654 aprofundará Saga. Aqui apenas registre o impacto da dependência na decisão.

### 19. Medir coupling

Classifique dependências por:

```text
runtime coupling;

data coupling;

change coupling;

release coupling;

team coupling;

failure coupling.
```

Uma fronteira que exige alteração coordenada em cinco serviços a cada mudança não possui autonomia real.

### 20. Criar Dependency Risk

```java
public record DependencyRisk(
        Dependency dependency,
        int runtimeCoupling,
        int changeCoupling,
        int failureCoupling,
        String mitigation) {

    public int total() {
        return runtimeCoupling
                + changeCoupling
                + failureCoupling;
    }
}
```

### 21. Definir data authority

Arquivo:

```text
microservices/DATA_OWNERSHIP.md
```

Para cada dado, declare:

```text
owner;

writer;

readers;

invariants;

retention;

classification;

replication policy;

migration plan.
```

Um microserviço não precisa esconder todo dado, mas deve possuir autoridade sobre seus invariantes.

### 22. Proibir banco compartilhado como estado final

Arquivo:

```text
contracts/data-ownership-policy.yaml
```

Conteúdo:

```yaml
dataOwnership:
  autonomousMicroservice:
    requires:
      - authoritative-data
      - controlled-writes
      - schema-evolution-owner
      - backup-owner
      - retention-policy

  sharedDatabase:
    allowedOnlyAs:
      - documented-transition

  crossServiceDirectWrite:
    forbidden:
      true

  readReplication:
    requires:
      - source
      - freshness-budget
      - contract
      - reconciliation
```

### 23. Avaliar queries cruzadas

`Appointment Details` compõe Appointment, Customer e Capacity. As opções incluem:

```text
API composition;

read model materializado;

event-driven projection;

query service;

reporting store.
```

Evite resolver a separação com join direto no banco de outro serviço.

### 24. Criar Data Separation Assessment

```java
public record DataSeparationAssessment(
        CapabilityId capability,
        boolean authorityClear,
        boolean directCrossWritesRemoved,
        boolean crossQueriesHaveStrategy,
        boolean migrationIsReversible,
        String evidence) {

    public boolean readyForAutonomy() {
        return authorityClear
                && directCrossWritesRemoved
                && crossQueriesHaveStrategy
                && migrationIsReversible;
    }
}
```

### 25. Definir team ownership

Arquivo:

```text
microservices/TEAM_AND_OWNERSHIP.md
```

Registre:

```text
product owner;

technical owner;

engineering team;

on-call owner;

data owner;

security contact;

incident escalation;

roadmap responsibility.
```

Um serviço sem time não é autônomo; é um componente órfão.

### 26. Avaliar cognitive load

Pergunte se o time consegue sustentar:

```text
código;

pipeline;

infraestrutura;

banco;

segurança;

observabilidade;

incidentes;

contratos;

migrações;

custos.
```

Mais serviços podem reduzir escopo de código e aumentar carga operacional.

### 27. Definir deploy independence

Arquivo:

```text
microservices/DEPLOY_INDEPENDENCE.md
```

Autonomia de deploy exige:

```text
artifact próprio;

pipeline próprio;

configuração versionada;

compatibilidade de contrato;

migração backward compatible;

rollout e rollback;

sem release lockstep obrigatório.
```

### 28. Criar experimento de deploy

Execute um experimento controlado:

```text
mude somente Appointment Lifecycle;

publique nova versão;

não altere consumers;

não publique outros deployables;

valide contratos;

meça rollback.
```

Se consumidores precisam ser atualizados simultaneamente, a independência ainda não foi provada.

### 29. Criar Deploy Independence Experiment

```java
public record DeployIndependenceExperiment(
        CapabilityId capability,
        boolean independentArtifact,
        boolean backwardCompatibleContract,
        boolean noLockstepRelease,
        Duration rollbackTime,
        String evidence) {

    public boolean passed() {
        return independentArtifact
                && backwardCompatibleContract
                && noLockstepRelease;
    }
}
```

### 30. Definir SLO do candidato

Arquivo:

```text
microservices/OPERATIONAL_READINESS.md
```

Para `Appointment Lifecycle`, registre:

```text
availability target;

latency p95 and p99;

error budget;

recovery time;

recovery point;

capacity target;

alert ownership;

incident response.
```

### 31. Criar Slo Profile

```java
public record SloProfile(
        double availabilityTarget,
        Duration p95Latency,
        Duration p99Latency,
        Duration recoveryTimeObjective,
        Duration recoveryPointObjective) {
}
```

### 32. Avaliar failure isolation

Simule indisponibilidade do candidato.

Observe:

```text
o portal inteiro cai?

busca continua?

dashboard continua?

commands retornam erro seguro?

filas crescem de forma limitada?

recovery é conhecido?
```

Separar sem isolar falha apenas move a falha para a rede.

### 33. Criar Failure Isolation Experiment

```java
public record FailureIsolationExperiment(
        CapabilityId capability,
        Set<String> unaffectedCapabilities,
        Set<String> degradedCapabilities,
        Set<String> unavailableCapabilities,
        boolean blastRadiusAccepted,
        String evidence) {
}
```

### 34. Definir readiness operacional

Um candidato precisa de:

```text
health checks;

metrics;

logs;

traces;

dashboards;

alerts;

runbook;

capacity model;

backup and restore;

on-call;

incident review.
```

### 35. Criar Operational Readiness

```java
public record OperationalReadiness(
        boolean healthChecks,
        boolean metrics,
        boolean tracing,
        boolean alerts,
        boolean runbook,
        boolean backupRestore,
        boolean onCall,
        String evidence) {

    public boolean complete() {
        return healthChecks
                && metrics
                && tracing
                && alerts
                && runbook
                && backupRestore
                && onCall;
    }
}
```

### 36. Definir contratos

Arquivo:

```text
microservices/CONTRACT_MODEL.md
```

Registre:

```text
REST or messaging;

schema owner;

versioning;

compatibility window;

consumer tests;

error model;

idempotency;

timeouts;

rate limits;

deprecation.
```

Contratos de rede são produtos mantidos, não detalhes de implementação.

### 37. Criar contract policy

Arquivo:

```text
contracts/contract-policy.yaml
```

Conteúdo:

```yaml
contracts:
  owner:
    required

  backwardCompatibility:
    required

  consumerValidation:
    required

  errorModel:
    explicit

  timeoutBudget:
    required

  versioning:
    documented

  coordinatedRelease:
    default:
      forbidden
```

### 38. Definir segurança entre serviços

Arquivo:

```text
microservices/SECURITY_MODEL.md
```

Inclua:

```text
service identity;

authentication;

authorization;

tenant propagation;

secret rotation;

encryption;

audit;

least privilege;

rate limiting;

incident response.
```

A separação cria nova superfície de ataque e novos canais de confiança.

### 39. Criar security policy

Arquivo:

```text
contracts/security-policy.yaml
```

Conteúdo:

```yaml
security:
  serviceIdentity:
    required

  authorization:
    perOperation:
      required

  tenantContext:
    trustedPropagation:
      required

  directDatabaseAccess:
    crossService:
      forbidden

  secretRotation:
    required

  audit:
    privilegedOperation:
      required
```

### 40. Definir estratégia de testes

Arquivo:

```text
microservices/TEST_STRATEGY.md
```

Inclua:

```text
unit tests;

architecture tests;

integration tests;

contract tests;

component tests;

failure tests;

security tests;

load tests;

migration tests;

end-to-end tests seletivos.
```

Não substitua testes locais rápidos por uma suíte end-to-end lenta e frágil.

### 41. Calcular custos distribuídos

Arquivo:

```text
microservices/DISTRIBUTED_COSTS.md
```

Liste:

```text
runtime;

network;

observability;

pipeline;

database;

backup;

security;

on-call;

contract maintenance;

platform support;

incident coordination.
```

### 42. Criar Service Cost Estimate

```java
public record ServiceCostEstimate(
        BigDecimal monthlyInfrastructure,
        int engineeringHoursPerMonth,
        int onCallHoursPerMonth,
        int platformDependencies,
        String assumptions) {
}
```

O custo deve incluir trabalho humano, não apenas CPU e memória.

### 43. Criar matriz de decisão

Arquivo:

```text
microservices/DECISION_MATRIX.md
```

Compare as opções para cada capacidade:

```text
Appointment Details:
modular monolith;
independent query deployable;
autonomous microservice.

Appointment Lifecycle:
modular monolith;
independent deployable;
autonomous microservice.
```

Use os mesmos critérios e evidências para todas as opções.

### 44. Aplicar gates antes do score

Pseudofluxo:

```text
validate mandatory gates;

if blocked:
recommend modular boundary
or readiness work;

else:
calculate weighted comparison;

run experiments;

review risks;

issue recommendation.
```

### 45. Criar Boundary Decision Service

```java
public final class BoundaryDecisionService {

    public BoundaryDecision decide(
            BoundaryCandidate candidate) {

        List<MandatoryCriterion> blockers =
                candidate.mandatoryCriteria()
                        .stream()
                        .filter(MandatoryCriterion::blocksMicroservice)
                        .toList();

        if (!blockers.isEmpty()) {
            return BoundaryDecision.blocked(
                    BoundaryOption.AUTONOMOUS_MICROSERVICE,
                    blockers);
        }

        return compareOptions(candidate);
    }
}
```

O serviço não deve aprovar microserviço quando os gates obrigatórios falham.

### 46. Criar thresholds

Arquivo:

```text
contracts/boundary-policy.yaml
```

Conteúdo:

```yaml
boundaryDecision:
  mandatoryGates:
    allRequired:
      true

  weightedScore:
    minimumBenefitRatio:
      1.25

  uncertainty:
    maximumHighRiskAssumptions:
      2

  experiments:
    deployIndependence:
      required
    failureIsolation:
      required

  recommendation:
    owner:
      required
    reviewDate:
      required
```

O número torna premissas e comparação auditáveis, sem substituir julgamento.

### 47. Avaliar `Appointment Details`

Resultado provável:

```text
strong read scaling benefit;

weak data authority;

high composition dependency;

limited business autonomy;

moderate operational value;

independent query deployable possible;

autonomous microservice not yet justified.
```

Uma recomendação madura pode ser:

```text
manter como módulo ou query deployable;

usar read model;

medir carga e ownership;

reavaliar após evolução da capacidade.
```

### 48. Avaliar `Appointment Lifecycle`

Resultado provável:

```text
clear domain authority;

high business criticality;

independent change rate;

need for failure isolation;

strong dependency on Capacity Reservation;

high operational cost;

team and data readiness required.
```

A recomendação pode ser condicional:

```text
independent deployable first;

remove shared writes;

prove contract compatibility;

prove on-call and rollback;

then evaluate autonomous microservice.
```

### 49. Registrar decisão negativa

Uma decisão “não separar agora” precisa incluir:

```text
motivos;

evidências;

riscos evitados;

trabalho preparatório;

gatilhos de revisão;

data de reavaliação.
```

Não separar também é uma decisão arquitetural.

### 50. Criar Boundary Recommendation

```java
public record BoundaryRecommendation(
        CapabilityId capability,
        BoundaryOption recommendedOption,
        List<String> reasons,
        List<String> blockers,
        List<String> requiredNextSteps,
        LocalDate reviewDate) {
}
```

### 51. Criar recommendation report

Arquivo:

```text
reports/recommendation-report.yaml
```

Exemplo:

```yaml
recommendations:
  appointmentDetails:
    option:
      INDEPENDENT_DEPLOYABLE
    microserviceApproved:
      false
    reasons:
      - read-scale-benefit
      - isolated-query-evolution
    blockers:
      - no-independent-business-authority
      - high-composition-dependency
    reviewAfter:
      2027-01-15

  appointmentLifecycle:
    option:
      INDEPENDENT_DEPLOYABLE
    microserviceApproved:
      conditional
    blockers:
      - capacity-runtime-coupling
      - on-call-not-proven
      - shared-write-removal-pending
```

### 52. Definir migração por estágios

Arquivo:

```text
microservices/MIGRATION_OPTIONS.md
```

Use estágios:

```text
module boundary;

internal API;

independent build;

independent deploy;

separate data authority;

contract hardening;

operational ownership;

microservice approval.
```

Não é necessário atravessar todos os estágios se o benefício parar antes.

### 53. Integrar com Strangler Fig

O router da aula 651 pode direcionar tráfego para um módulo interno, deployable ou microserviço.

A topologia não altera a regra de migração:

```text
contrato;

autoridade;

shadow;

rollout;

rollback;

decommission.
```

### 54. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson653:
    forbidden:
      - complete-antipattern-catalog
      - entity-service-deep-dive
      - nanoservice-deep-dive
      - distributed-monolith-diagnostic

  lesson654:
    forbidden:
      - saga-orchestrator-implementation
      - saga-choreography-deep-dive
      - compensation-engine

  allowed:
    - blocking-signals
    - distributed-cost-awareness
    - transaction-impact-assessment
```

### 55. Testar gates obrigatórios

Crie cenário com:

```text
no owner;

shared writes;

no on-call;

no rollback;

high weighted score.
```

O resultado deve continuar bloqueado para microserviço.

### 56. Testar opção modular

Confirme:

```text
module boundaries;

no forbidden dependencies;

local transaction preserved;

single deployment;

lower operational cost;

future extraction possible.
```

O monólito modular é um resultado válido, não uma falha.

### 57. Testar deploy independente

Valide:

```text
artifact separate;

pipeline separate;

backward compatible contract;

no lockstep release;

rollback measured;

consumer unchanged.
```

### 58. Testar data authority

Confirme que:

```text
Appointment Lifecycle writes Appointment;

outros contextos não escrevem diretamente;

read models recebem eventos;

schema evolution possui owner;

reconciliation existe.
```

### 59. Testar falha parcial

Derrube o candidato e valide:

```text
critical commands fail explicitly;

search remains available;

dashboard degrades;

queues remain bounded;

alerts fire;

recovery follows runbook.
```

### 60. Testar contrato

Valide:

```text
old consumer with new provider;

new consumer with old provider;

error compatibility;

optional fields;

timeout budget;

deprecation warning.
```

### 61. Testar segurança

Confirme:

```text
service identity;

least privilege;

tenant propagation;

no direct cross-database access;

audit for privileged commands;

secret rotation.
```

### 62. Testar custo

Compare:

```text
monthly infrastructure;

engineering operation hours;

incident load;

platform dependencies;

expected autonomy benefit.
```

Uma melhoria de arquitetura que a organização não consegue operar não está pronta.

### 63. Testar arquitetura

```java
@ArchTest
static final ArchRule capabilityPackagesMustNotDependOnDecisionInfrastructure =
        noClasses()
                .that()
                .resideInAPackage("..capability..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage("..report.." );
```

### 64. Validar catálogo

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-capability-catalog.ps1
```

Valide propósito, linguagem, dados, comandos, consultas, owner, criticidade e consumers.

### 65. Validar critérios

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-boundary-criteria.ps1
```

Valide pesos, evidências, custos, benefícios e ausência de score sem contexto.

### 66. Validar gates

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-mandatory-gates.ps1
```

Valide owner, data authority, deploy, operação, segurança, contrato, custo e rollback.

### 67. Validar dependências

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-dependency-map.ps1
```

Valide critical path, sync calls, shared data, failure behavior e mitigations.

### 68. Validar dados

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-data-ownership.ps1
```

Valide writers, invariants, replication, migration e ausência de cross-service write.

### 69. Validar ownership

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-team-ownership.ps1
```

Valide produto, engenharia, on-call, dados, segurança e incident escalation.

### 70. Validar deploy

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-deploy-independence.ps1
```

Valide artifact, pipeline, compatibilidade, migration e ausência de lockstep.

### 71. Validar operação

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-operational-readiness.ps1
```

Valide SLO, metrics, tracing, alerts, runbook, backup, restore e on-call.

### 72. Validar custos

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-distributed-costs.ps1
```

Valide infraestrutura, engenharia, segurança, incidentes e plataforma.

### 73. Executar experimentos

```powershell
.\scripts\m19\service-scheduling-boundary-decision\run-boundary-experiments.ps1
```

Execute deploy independence, failure isolation, contract compatibility e rollback.

### 74. Executar testes

```powershell
.\scripts\m19\service-scheduling-boundary-decision\run-microservice-decision-tests.ps1
```

Ou:

```powershell
mvn test
```

### 75. Criar reports

Exemplo:

```yaml
microserviceDecision:
  capabilitiesEvaluated:
    2

  mandatoryGateFailures:
    3

  deployExperiments:
    passed:
      1
    failed:
      1

  dataAuthorityReady:
    1

  operationalReadinessReady:
    0

  recommendations:
    modularMonolith:
      0
    independentDeployable:
      2
    autonomousMicroservice:
      0

  result:
    PASS_WITH_CONDITIONAL_RECOMMENDATIONS
```

### 76. Criar gate

O gate valida charter, capability catalog, opções, gates obrigatórios, critérios, dependências, dados, ownership, deploy, operação, contratos, segurança, custos, experimentos, recommendation, tests, architecture e evidence.

Status:

```text
PASS;

PASS_WITH_CONDITIONAL_RECOMMENDATIONS;

FAIL_CAPABILITY_BOUNDARY;

FAIL_MANDATORY_GATES;

FAIL_DATA_AUTHORITY;

FAIL_DEPLOY_INDEPENDENCE;

FAIL_OPERATIONAL_READINESS;

FAIL_TEAM_OWNERSHIP;

FAIL_CONTRACT;

FAIL_SECURITY;

FAIL_COST;

FAIL_EXPERIMENT;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

### 77. Coletar evidence

Arquivo:

```text
contracts/microservice-decision-evidence.yaml
```

Campos permitidos:

- lesson;
- context;
- capabilities evaluated;
- options compared;
- mandatory gate results;
- dependency risk count;
- shared write count;
- deploy experiment status;
- failure isolation status;
- data authority status;
- team ownership status;
- operational readiness status;
- contract status;
- security status;
- monthly cost estimate;
- recommendation;
- review date;
- test status;
- architecture status;
- gate status;
- timestamp.

Não inclua credenciais, endpoints privados, dados de clientes, custos contratuais confidenciais, topologia real ou catálogo aprofundado da aula 653.

### 78. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-microservice-decision-contract.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-capability-catalog.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-boundary-criteria.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-mandatory-gates.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-dependency-map.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-data-ownership.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-team-ownership.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-deploy-independence.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-operational-readiness.ps1

.\scripts\m19\service-scheduling-boundary-decision\validate-distributed-costs.ps1

.\scripts\m19\service-scheduling-boundary-decision\run-boundary-experiments.ps1

.\scripts\m19\service-scheduling-boundary-decision\run-microservice-decision-tests.ps1

.\scripts\m19\service-scheduling-boundary-decision\collect-microservice-decision-evidence.ps1

.\scripts\m19\service-scheduling-boundary-decision\verify-microservice-decision-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 79. Encerrar o laboratório

Confirme:

- capacidade, e não entidade, foi usada como unidade;
- módulo, deployable e microserviço foram comparados;
- critérios obrigatórios bloquearam score indevido;
- dependências síncronas, dados e releases foram mapeados;
- autoridade de dados foi definida;
- cross-service writes foram proibidos;
- queries cruzadas possuem estratégia;
- time e on-call possuem owner;
- deploy independente foi testado;
- failure isolation foi testado;
- contratos e segurança foram avaliados;
- custos humanos e técnicos foram estimados;
- recomendação negativa ou condicional foi aceita como resultado válido;
- review date foi definida;
- reports, evidence e gate foram gerados;
- anti-patterns e Saga não foram aprofundados.

---

## Entendendo o que foi feito

### A fronteira ganhou um problema de negócio

A decisão deixou de começar em controllers e tabelas. Cada candidato foi descrito por propósito, linguagem, comandos, consultas, invariantes, dados, owner, criticidade e consumers.

### A autonomia ganhou múltiplas dimensões

Deploy independente sem dados, time e operação próprios não basta. A análise passou a considerar mudança, dados, runtime, falha, contrato, segurança, custo e ownership.

### O score ganhou limites

Gates obrigatórios impedem que uma média esconda ausência de owner, shared writes, falta de rollback ou operação imatura. O score compara opções somente depois da viabilidade mínima.

### O monólito modular ganhou legitimidade

Manter uma fronteira no mesmo processo preserva transações locais, reduz custo operacional e pode ser a escolha mais madura. A extração futura continua possível quando as evidências mudarem.

### A decisão ganhou experimentos

Deploy independence, contract compatibility, failure isolation e rollback deixaram de ser promessas. Eles foram executados e anexados como evidence.

---

## Erros comuns importantes

### Separar por entidade ou tabela

Entidades costumam participar de várias capacidades. A fronteira fica anêmica e cria comunicação excessiva.

### Confundir deploy separado com autonomia

Se releases, dados, incidentes e decisões continuam coordenados, existe distribuição sem independência real.

### Aprovar por score apesar de blockers

Owner ausente, shared writes e falta de rollback não podem ser compensados por alta pontuação em escalabilidade.

### Ignorar custo humano

Cada serviço adiciona pipeline, alertas, segurança, contratos, plantão e incidentes. CPU barata não elimina operação cara.

### Compartilhar banco como solução permanente

Writes cruzados quebram autoridade, evolução e isolamento. Transições precisam de prazo e saída.

### Criar rede sem necessidade

Uma chamada local transformada em HTTP introduz timeout e falha parcial. O benefício precisa justificar essa troca.

### Exigir microserviço para usar Strangler Fig

O novo caminho pode ser módulo ou deployable. Strangler controla substituição, não determina topologia.

### Antecipar o catálogo de anti-patterns

Os diagnósticos completos pertencem à aula 653.

---

## Comandos úteis

### Validar gates

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-mandatory-gates.ps1
```

### Validar dados

```powershell
.\scripts\m19\service-scheduling-boundary-decision\validate-data-ownership.ps1
```

### Executar experimentos

```powershell
.\scripts\m19\service-scheduling-boundary-decision\run-boundary-experiments.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-boundary-decision\run-microservice-decision-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-boundary-decision\verify-microservice-decision-gate.ps1
```

---

## Exercício guiado

Escolha uma terceira capacidade do domínio, como `Customer Communication` ou `Operational Search`.

Crie o Capability Profile, mapeie dependências, declare autoridade de dados, avalie equipe, contratos, operação e custo, execute ao menos um experimento e compare as três opções arquiteturais.

A recomendação deve conter:

```text
opção escolhida;

opções rejeitadas;

gates;

evidências;

riscos;

trabalho preparatório;

gatilhos de revisão;

review date.
```

Não presuma que a resposta será microserviço.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 651 e ponte para a aula 653 foram preservadas;
- o laboratório `service-scheduling-boundary-decision` foi criado;
- Microservice Decision Charter foi criado;
- capacidades foram catalogadas por negócio;
- `Appointment Details` e `Appointment Lifecycle` foram avaliados;
- módulo, deployable e microserviço foram comparados;
- critérios obrigatórios e ponderados foram separados;
- blockers não podem ser compensados por score;
- dependências de runtime, dados, mudança, release e equipe foram mapeadas;
- critical paths foram identificados;
- data authority foi definida;
- cross-service writes foram proibidos;
- shared database foi permitido apenas como transição documentada;
- queries cruzadas possuem estratégia;
- owner de produto, engenharia, on-call, dados e segurança foi definido;
- cognitive load foi avaliada;
- deploy independence foi definida e testada;
- lockstep release foi rejeitado como autonomia;
- SLO, error budget, RTO e RPO foram definidos;
- failure isolation foi experimentada;
- readiness operacional foi validada;
- contratos possuem owner, versão e compatibilidade;
- segurança entre serviços foi modelada;
- custos técnicos e humanos foram estimados;
- recomendação negativa ou condicional foi aceita;
- review date e gatilhos foram registrados;
- integração com Strangler Fig foi preservada;
- tests, reports, evidence e gate foram criados;
- anti-patterns completos não foram antecipados;
- Saga não foi aprofundada;
- commit recomendado e diário de bordo estão presentes.

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
  labs/m19/aula-652-microservicos-com-criterio/service-scheduling-boundary-decision `
  scripts/m19/service-scheduling-boundary-decision `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|realCustomer|productionTopology|contractualCost|completeAntipatternCatalog|sagaOrchestrator"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): avaliar microservicos com criterio"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- endpoints privados;
- topologia real;
- dados de clientes;
- custos contratuais confidenciais;
- catálogo completo de anti-patterns;
- implementação de Saga.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você avaliou microserviços com critério.

Você criou Capability Catalog, perfis de capacidade, opções arquiteturais, gates obrigatórios, critérios ponderados, Dependency Map, Data Ownership, Team Ownership, Deploy Independence, Operational Readiness, Contract Model, Security Model, Distributed Costs, experimentos, Decision Matrix, recommendations, reports, evidence e gate.

Você comprovou que uma capacidade modernizada não precisa virar microserviço; que módulo, deployable e serviço autônomo são opções legítimas; que fronteira de negócio vem antes da fronteira técnica; que deploy separado não basta sem dados, time e operação; que shared writes e lockstep releases bloqueiam autonomia; que custo distribuído inclui pessoas e incidentes; e que uma decisão negativa ou condicional pode ser a melhor decisão arquitetural.

A próxima aula será:

```text
653 - M19.43 - Anti patterns de microservicos
```

Nela, você irá diagnosticar decomposição por entidade, nanosserviços, banco compartilhado, chatty communication, distributed monolith, gateway com regra de negócio, dependências cíclicas, releases coordenados e outros sinais de distribuição sem autonomia.

Transações distribuídas e Saga revisitada permanecem para a aula 654.

Nenhum catálogo completo de anti-patterns ou implementação profunda de Saga foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei capacidades.
- [ ] Comparei três opções arquiteturais.
- [ ] Criei gates obrigatórios.
- [ ] Mapeei dependências.
- [ ] Defini autoridade de dados.
- [ ] Validei ownership de time.
- [ ] Testei deploy independente.
- [ ] Testei isolamento de falha.
- [ ] Avaliei contratos e segurança.
- [ ] Estimei custos distribuídos.
- [ ] Registrei recommendation e review date.
- [ ] Gere reports, evidence e gate.

## Troubleshooting adicional

### A equipe exige microserviço porque o módulo cresce

Meça coesão, mudança, scale, ownership e custo. Tamanho de código isolado não prova necessidade de rede.

### O serviço possui pipeline próprio, mas o deploy é coordenado

A compatibilidade ou o contrato não estão maduros. Classifique como deployable ainda dependente.

### O banco continua compartilhado

Defina autoridade, remova writes cruzados e crie plano de migração. Não declare autonomia prematuramente.

### O time não quer assumir on-call

A fronteira operacional não possui owner. Mantenha módulo ou prepare ownership antes da extração.

### O score aprovou, mas não existe rollback

O gate obrigatório deve bloquear. Corrija a modelagem de decisão.

### A consulta exige joins entre vários serviços

Avalie read model, projection ou query service. Não recrie join distribuído em tempo real sem budget.

### O novo serviço chama cinco serviços no critical path

Redesenhe fronteira, replique dados adequados ou reduza dependências. A autonomia é baixa.

### A equipe quer um serviço por tabela

A unidade deve ser capacidade e invariantes, não persistência.

### O custo de operação ficou alto

Compare com o benefício. Um monólito modular pode entregar a separação necessária com menor custo.

### A discussão virou catálogo de falhas conhecidas

Preserve o aprofundamento de anti-patterns para a aula 653.

## Perguntas de revisão

1. Qual diferença entre módulo, deployable e microserviço?
2. Qual é a melhor unidade de decisão?
3. O que é autonomia de deploy?
4. Por que data authority importa?
5. O que são gates obrigatórios?
6. Por que score não deve compensar blockers?
7. O que é release coupling?
8. Por que banco compartilhado reduz autonomia?
9. O que é failure isolation?
10. Por que time ownership é obrigatório?
11. Quais custos distribuídos devem ser considerados?
12. Strangler Fig exige microserviço?
13. Quando o monólito modular é adequado?
14. O que deve existir em uma recomendação negativa?
15. Qual é a próxima aula?

## Roteiro de resposta

1. Eles diferem em processo, deploy, dados e operação.
2. Uma capacidade de negócio.
3. Publicar e reverter sem release coordenado.
4. Porque define invariantes e evolução.
5. Condições mínimas não compensáveis.
6. Porque média pode esconder risco crítico.
7. Necessidade de alterar ou publicar componentes juntos.
8. Porque permite writes cruzados e evolução coordenada.
9. Conter o blast radius de uma falha.
10. Porque alguém precisa evoluir e operar o serviço.
11. Rede, dados, observabilidade, segurança, pipeline, incidentes e pessoas.
12. Não.
13. Quando a autonomia distribuída não paga o custo.
14. Evidências, motivos, riscos, próximos passos e review date.
15. Anti patterns de microservicos.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 652 - M19.42 - Microservicos com criterio**

- Criei o laboratório `service-scheduling-boundary-decision`.
- Diferenciei módulo, deployable independente e microserviço autônomo.
- Cataloguei capacidades de Service Scheduling.
- Avaliei `Appointment Details` e `Appointment Lifecycle`.
- Criei gates obrigatórios e critérios ponderados.
- Impedi aprovação por score quando existem blockers.
- Mapeei dependências de runtime, dados, mudança, release e equipe.
- Defini critical paths e riscos de acoplamento.
- Defini autoridade de dados e proibi cross-service writes.
- Tratei shared database apenas como transição documentada.
- Modelei estratégias para queries cruzadas.
- Defini ownership de produto, engenharia, on-call, dados e segurança.
- Avaliei cognitive load do time.
- Modelei e testei deploy independence.
- Defini SLO, error budget, RTO e RPO.
- Executei experimento de failure isolation.
- Validei readiness operacional.
- Modelei contratos versionados e segurança entre serviços.
- Estimei custos técnicos e humanos.
- Criei Decision Matrix e recommendations condicionais.
- Integrei a decisão ao Strangler Fig.
- Criei reports, evidence e gate.
- Não antecipei Anti-patterns ou Saga.
- Próxima aula: Anti patterns de microservicos.
```

## Referência técnica curta

- Modular Monolith.
- Independent Deployable.
- Microservice.
- Business Capability.
- Data Ownership.
- Deploy Independence.
- Team Ownership.
- Failure Isolation.
- Contract Testing.
- Operational Readiness.
- Cognitive Load.
- Distributed Cost.
- Decision Gate.

Regra final:

```text
Microserviços são aprovados por autonomia comprovada, não por entusiasmo.
A unidade é uma capacidade de negócio com linguagem, invariantes e owner.
Módulo, deployable e microserviço são comparados com os mesmos critérios.
Gates obrigatórios bloqueiam ausência de dados, time, deploy, operação e rollback.
Dependências, shared writes, releases e critical paths tornam coupling visível.
Data authority, contratos, segurança, SLO, on-call e custos precisam de evidência.
Experimentos provam deploy independence, failure isolation e reversibilidade.
Se o benefício não paga a distribuição, o monólito modular é a escolha madura.
Anti-patterns serão aprofundados na aula 653 e Saga na aula 654.
```
