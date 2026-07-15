# 642 - M19.32 - Design de sistemas parte 2

## Apresentação da aula

Na aula 641, você iniciou um design completo para `Service Scheduling`.

Você definiu problema, escopo, atores, jornadas, requisitos funcionais, requisitos de qualidade, SLOs, premissas, perguntas abertas, estimativas, domínio, catálogo de dados, APIs, componentes, ownership, fluxos e rastreabilidade.

O desenho inicial respondeu:

```text
o que o sistema precisa fazer;
quais qualidades precisa entregar;
quais dados existem;
quem altera cada dado;
quais APIs e componentes participam;
como os fluxos principais acontecem.
```

Isso ainda não torna o desenho pronto para operação.

Um sistema pode parecer correto no diagrama e falhar quando recebe dez vezes mais tráfego, quando um tenant concentra 40% do volume, quando o banco fica lento, quando a fila cresce, quando uma dependência externa para, quando uma migration demora, quando uma credencial é revogada ou quando o custo aumenta mais rápido que a receita.

A segunda parte do design submeterá o desenho a pressão.

A pergunta desta aula será:

```text
como revisar um design
contra crescimento,
gargalos,
falhas,
consistência,
segurança,
observabilidade,
deployment,
custo
e evolução
antes de levá-lo para produção?
```

O laboratório será:

```text
labs/m19/aula-642-design-sistemas-parte-2/service-scheduling-system-design-review
```

Você reutilizará as decisões da aula 641 e produzirá quality attribute scenarios, critical paths, mapa de gargalos, plano de capacidade, matriz de consistência, failure model, modos degradados, objetivos de recuperação, security boundaries, observability map, deployment topology, rollout plan, cost model, evolution scenarios, testes, reports, evidence e gate.

A próxima aula será:

```text
643 - M19.33 - Trade offs tecnicos
```

Nela, você aprofundará como comparar alternativas técnicas de maneira explícita, defendendo benefícios, custos, riscos, reversibilidade e evidências. Nesta aula, as decisões terão justificativa concreta, mas o framework geral de avaliação de trade-offs permanecerá reservado para a aula 643.

Regra central:

```text
design de sistemas
não termina quando o fluxo funciona;
termina quando o desenho
explica como cresce,
como falha,
como se protege,
como é operado,
quanto custa
e como evolui.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
639 Escalabilidade horizontal vertical;
640 Resiliencia arquitetural;
641 Design de sistemas parte 1;
642 Design de sistemas parte 2;
643 Trade offs tecnicos;
644 ADR.
```

A aula 641 criou o baseline funcional e estrutural. A aula 642 fará uma revisão arquitetural sobre esse baseline.

Você combinará conceitos já estudados:

- consistência eventual, CAP e PACELC;
- idempotência e mensageria;
- multi-tenancy;
- escala vertical e horizontal;
- resiliência;
- segurança;
- observabilidade;
- banco de dados;
- CI/CD e operação.

O objetivo não é adicionar todas as técnicas possíveis. É selecionar controles coerentes com requisitos, volume, risco e capacidade de operação.

O aprofundamento formal de trade-offs fica para a aula 643. A documentação por ADR fica para a aula 644.

---

Objetivo: prático

O laboratório será organizado assim:

```text
service-scheduling-system-design-review
├── README.md
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/systemdesignreview
│   │           ├── scenario
│   │           ├── capacity
│   │           ├── bottleneck
│   │           ├── consistency
│   │           ├── failure
│   │           ├── security
│   │           ├── observability
│   │           ├── deployment
│   │           ├── cost
│   │           ├── evolution
│   │           └── validation
│   └── test
│       └── java
│           └── br/com/formacao/systemdesignreview
├── design
├── contracts
└── reports
```

Em `design`, ficarão os artefatos de revisão. Em `contracts`, ficarão políticas verificáveis. O código Java representará cenários, capacidade, gargalos, falhas, dependências, deployment, custo e evolução. Os testes verificarão coerência e não antecipação.

Scripts:

```text
scripts/m19/service-scheduling-system-design-part-two
├── validate-review-contract.ps1
├── validate-quality-attribute-scenarios.ps1
├── validate-capacity-and-bottlenecks.ps1
├── validate-consistency-and-failures.ps1
├── validate-security-and-observability.ps1
├── validate-deployment-and-recovery.ps1
├── validate-cost-and-evolution.ps1
├── run-system-design-part-two-tests.ps1
├── collect-system-design-part-two-evidence.ps1
└── verify-system-design-part-two-gate.ps1
```

---

## Conceito essencial

### Revisão de design é um teste de hipóteses

O desenho da aula 641 contém hipóteses:

```text
o pico será aproximadamente 120 requests por segundo;
o banco suportará as escritas de confirmação;
a busca poderá usar uma projeção eventual;
a fila absorverá os picos;
uma região será suficiente no início;
o time conseguirá operar os componentes propostos.
```

A revisão transforma hipóteses em cenários, métricas, limites, riscos, controles, evidências e gatilhos de mudança.

### Quality Attribute Scenario

Uma qualidade abstrata precisa virar cenário observável.

“Alta disponibilidade” é vago.

Um cenário útil declara:

```text
fonte do estímulo;
estímulo;
ambiente;
artefato afetado;
resposta esperada;
medida da resposta.
```

Exemplo:

```text
Durante o pico de segunda-feira,
com 300 confirmações por segundo,
o endpoint de confirmação
mantém p95 abaixo de 700 ms,
erro abaixo de 0,5%
e nenhuma dupla reserva confirmada.
```

### Critical path e failure domain

Critical path reúne os passos indispensáveis para concluir uma operação. Failure domain é a fronteira atingida pela mesma falha, como zona, banco, fila, tenant ou fornecedor. O desenho deve separar dependências bloqueantes, trabalho adiável, isolamento e recuperação.

### Steady state e degraded mode

Steady state é a operação normal. Degraded mode é o comportamento reduzido e intencional quando uma capacidade ou dependência está indisponível.

Exemplos:

```text
busca continua com dados atrasados;
confirmação rejeita com segurança;
notificação entra em fila;
dashboard mostra atraso;
exportação fica suspensa;
novos tenants não são provisionados.
```

Degradação controlada é diferente de falha silenciosa.

### Operabilidade é parte da arquitetura

Logs, métricas, traces, alertas, runbooks, rollout, rollback, migração, custo e ownership não são detalhes posteriores. Eles determinam se o sistema pode ser mantido com segurança.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-642-design-sistemas-parte-2/service-scheduling-system-design-review

Set-Location `
  labs/m19/aula-642-design-sistemas-parte-2/service-scheduling-system-design-review
```

Crie as pastas `design`, `contracts`, `reports`, `src/main/java` e `src/test/java`.

Não altere a aula 641. Trate seus artefatos como baseline de entrada.

---

### 2. Criar o Design Review Charter

Arquivo:

```text
design/DESIGN_REVIEW_CHARTER.md
```

Conteúdo:

```markdown
# Design Review Charter

Sistema:

Service Scheduling.

Baseline:

Aula 641 - Design de sistemas parte 1.

Objetivo:

Submeter o design a cenários de crescimento,
gargalo, falha, segurança,
operação, deployment, custo e evolução.

Saída:

- riscos explícitos;
- controles verificáveis;
- limites conhecidos;
- gatilhos de revisão;
- evidence;
- gate.

Fora de escopo:

- framework genérico de trade-offs;
- comparação ponderada de alternativas;
- ADR completo;
- implementação produtiva do sistema.
```

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/system-design-review-contract.yaml
```

Conteúdo:

```yaml
systemDesignReview:
  context:
    Service-Scheduling

  baseline:
    lesson:
      641

  required:
    - quality-attribute-scenarios
    - critical-paths
    - capacity-model
    - bottleneck-map
    - consistency-matrix
    - failure-model
    - degraded-modes
    - recovery-objectives
    - security-boundaries
    - observability-map
    - deployment-topology
    - rollout-and-rollback
    - cost-model
    - evolution-scenarios
    - tests
    - evidence
    - gate

  forbidden:
    - unbounded-capacity-claim
    - silent-degradation
    - shared-data-without-owner
    - retry-without-budget
    - recovery-without-objective
    - deployment-without-rollback
    - cost-free-architecture
    - formal-tradeoff-framework-deep-dive
    - ADR-deep-dive

  nextLesson:
    code:
      M19.33
```

---

### 4. Importar o baseline da aula 641

Crie:

```text
design/BASELINE_MANIFEST.md
```

Registre os artefatos usados:

```text
Problem Statement;
Scope;
Functional Requirements;
Quality Requirements;
SLO Catalog;
Assumptions;
Open Questions;
Workload Estimate;
Domain Model;
Data Catalog;
API Catalog;
Component Map;
Data Ownership;
Flow Catalog;
Requirement Traceability.
```

Para cada item, registre versão, origem, data da revisão e owner.

Isso impede que a Parte 2 revise um baseline imaginário.

---

### 5. Criar Quality Attribute Scenarios

Arquivo:

```text
design/QUALITY_ATTRIBUTE_SCENARIOS.md
```

Crie cenários para:

- performance;
- disponibilidade;
- consistência;
- escalabilidade;
- segurança;
- recuperabilidade;
- observabilidade;
- modificabilidade;
- custo.

Exemplo:

```text
ID:
QAS-PERF-001.

Source:
Customer Portal.

Stimulus:
300 confirmacoes por segundo.

Environment:
Monday peak.

Artifact:
Confirmation API.

Response:
Process confirmation or reject safely.

Measure:
p95 <= 700 ms;
error rate <= 0.5%;
zero confirmed double booking.
```

---

### 6. Modelar o cenário em Java

```java
package br.com.formacao.systemdesignreview.scenario;

import java.util.Objects;

public record QualityAttributeScenario(
        String id,
        QualityAttribute attribute,
        String source,
        String stimulus,
        String environment,
        String artifact,
        String expectedResponse,
        ResponseMeasure measure) {

    public QualityAttributeScenario {
        Objects.requireNonNull(id);
        Objects.requireNonNull(attribute);
        Objects.requireNonNull(source);
        Objects.requireNonNull(stimulus);
        Objects.requireNonNull(environment);
        Objects.requireNonNull(artifact);
        Objects.requireNonNull(expectedResponse);
        Objects.requireNonNull(measure);
    }
}
```

`ResponseMeasure` deve conter unidade, target e janela de observação.

---

### 7. Criar o Critical Path Catalog

Arquivo:

```text
design/CRITICAL_PATHS.md
```

Mapeie pelo menos:

```text
Confirm Appointment;
Reschedule Appointment;
Cancel Appointment;
Search Appointments;
Publish Scheduling Event.
```

Para confirmação:

```text
API Gateway;
Authentication;
Tenant Resolution;
Confirmation Application Service;
Appointment Store;
Capacity Reservation Store;
Outbox;
Transaction Commit.
```

Notificação, analytics e atualização de dashboard não devem bloquear a confirmação.

---

### 8. Classificar dependências do caminho crítico

Use:

```text
REQUIRED_SYNCHRONOUS;
REQUIRED_TRANSACTIONAL;
ASYNCHRONOUS_AFTER_COMMIT;
OPTIONAL;
OBSERVABILITY_ONLY.
```

Crie:

```java
package br.com.formacao.systemdesignreview.failure;

public record CriticalDependency(
        String operation,
        String dependency,
        DependencyRole role,
        long timeoutMillis,
        FailureBehavior failureBehavior) {
}
```

Uma dependência `OBSERVABILITY_ONLY` não pode impedir o resultado de negócio.

---

### 9. Criar o Capacity Model

Arquivo:

```text
design/CAPACITY_MODEL.md
```

Use o baseline da aula 641 e registre:

```text
average requests per second;
peak requests per second;
peak factor;
write ratio;
read ratio;
concurrent requests;
average service time;
database transactions per second;
connection demand;
event production rate;
consumer processing rate;
storage growth;
headroom.
```

Capacidade depende do recurso limitante, não apenas de CPU média.

---

### 10. Modelar uma estimativa de capacidade

```java
package br.com.formacao.systemdesignreview.capacity;

public record CapacityEstimate(
        String resource,
        double demandPerSecond,
        double capacityPerUnit,
        int units,
        double targetUtilization,
        double headroomPercent) {

    public double totalCapacity() {
        return capacityPerUnit * units;
    }

    public double projectedUtilization() {
        return demandPerSecond / totalCapacity();
    }

    public boolean withinTarget() {
        return projectedUtilization() <= targetUtilization;
    }
}
```

A classe revela premissas, mas não substitui teste de carga.

---

### 11. Criar o Bottleneck Map

Arquivo:

```text
design/BOTTLENECK_MAP.md
```

Para cada recurso, registre:

```text
resource;
workload;
limit;
metric;
current estimate;
failure symptom;
mitigation;
scaling option;
owner;
review trigger.
```

Inclua:

- pool de conexões;
- lock de capacidade;
- índice de busca;
- outbox relay;
- broker partition;
- consumer throughput;
- cache;
- rate limiter;
- external provider.

---

### 12. Analisar o hot spot de capacidade

No domínio, a reserva por área e janela pode concentrar concorrência.

Exemplo:

```text
workzone 123;
manha de segunda-feira;
produto de alta demanda;
200 tentativas concorrentes;
20 vagas restantes.
```

O design deve responder:

- qual chave sofre contenção;
- onde a invariável é protegida;
- como evitar dupla reserva;
- quanto tempo o lock pode durar;
- qual erro o cliente recebe;
- como medir conflitos;
- quando particionar a carga.

Médias globais não podem esconder hot spots.

---

### 13. Revisar statelessness e afinidade

Confirme que instâncias da API não guardam estado de sessão necessário à operação.

Arquivo:

```text
contracts/stateless-service-policy.yaml
```

```yaml
statelessService:
  apiInstances:
    localBusinessState:
      forbidden

  sessionAffinity:
    required:
      false

  sharedState:
    allowedStores:
      - database
      - cache
      - broker

  localCache:
    invalidationPolicy:
      required
```

Afinidade pode existir por otimização, mas não pode ser requisito oculto de correção.

---

### 14. Revisar a capacidade do banco

Crie:

```text
design/DATABASE_CAPACITY.md
```

Registre:

- write transactions por segundo;
- read transactions por segundo;
- conexões por instância;
- limite total de conexões;
- consultas mais caras;
- índices necessários;
- tamanho das tabelas;
- crescimento;
- vacuum ou manutenção;
- replicação;
- backup;
- restore testado.

Use orçamento global de conexões:

```text
API instances * pool size
+
workers * pool size
+
admin jobs
<= safe database connection limit.
```

---

### 15. Revisar cache com propósito explícito

Arquivo:

```text
design/CACHE_PLAN.md
```

Para cada cache, defina:

```text
purpose;
key;
owner;
TTL;
consistency expectation;
invalidation;
miss behavior;
maximum stale age;
tenant isolation;
metrics.
```

Exemplos adequados:

- catálogo de produtos;
- configuração de tenant;
- disponibilidade derivada para consulta;
- resultado de busca não crítica.

Não use cache para esconder consulta ruim sem medir hit ratio, miss latency e staleness.

---

### 16. Criar a Consistency Matrix

Arquivo:

```text
design/CONSISTENCY_MATRIX.md
```

Modelo:

```text
Operation:
Confirm Appointment.

Source of truth:
Appointment Store.

Consistency:
strong transactional decision.

Partition behavior:
reject when coordination is unavailable.

Normal-operation priority:
consistency over minimum latency.

Read model:
not authority.
```

Classifique confirmação, reagendamento, cancelamento, detalhe, busca, dashboard, auditoria e notificação.

A matriz deve reutilizar CAP, PACELC e consistência eventual sem repetir as aulas anteriores.

---

### 17. Criar consistency policy

Arquivo:

```text
contracts/consistency-review-policy.yaml
```

```yaml
consistencyReview:
  criticalCommands:
    sourceOfTruth:
      required
    expectedVersion:
      required
    staleDecision:
      forbidden

  search:
    eventualRead:
      allowed
    staleIndicator:
      requiredWhenBudgetExceeded

  dashboard:
    eventualRead:
      allowed

  audit:
    loss:
      forbidden

  undocumentedConsistency:
    forbidden
```

---

### 18. Criar o Failure Model

Arquivo:

```text
design/FAILURE_MODEL.md
```

Inclua:

```text
API instance crash;
database timeout;
database failover;
broker unavailable;
outbox relay stopped;
consumer lag;
cache unavailable;
identity provider unavailable;
notification provider unavailable;
network partition;
partial deployment;
invalid schema migration;
tenant configuration failure;
region outage.
```

Para cada falha, registre detecção, impacto, comportamento, recuperação, owner e evidência.

---

### 19. Modelar um Failure Scenario

```java
package br.com.formacao.systemdesignreview.failure;

import java.time.Duration;
import java.util.List;

public record FailureScenario(
        String id,
        String failedDependency,
        List<String> affectedOperations,
        FailureBehavior behavior,
        Duration detectionTarget,
        Duration recoveryTarget,
        String owner) {
}
```

Falhas diferentes não devem receber o mesmo fallback automaticamente.

---

### 20. Definir timeout, deadline e retry budget

Arquivo:

```text
design/DEPENDENCY_BUDGETS.md
```

Exemplo para confirmação:

```text
end-to-end deadline:
700 ms.

authentication budget:
80 ms.

tenant resolution budget:
30 ms.

database transaction budget:
350 ms.

remaining budget:
240 ms.
```

Retries só podem consumir o tempo restante e devem ser seguros.

```yaml
dependencyBudget:
  confirmation:
    deadlineMillis:
      700
    maximumAttempts:
      2
    retryOnlyWhen:
      - idempotent
      - transient-failure
      - remaining-budget
    retryStormProtection:
      required
```

---

### 21. Criar Degraded Modes

Arquivo:

```text
design/DEGRADED_MODES.md
```

Exemplos:

```text
Database unavailable:
critical commands reject;
search may use bounded stale replica;
no false confirmation.

Broker unavailable:
command commits with outbox;
publication waits;
backlog metric rises.

Notification provider unavailable:
appointment remains confirmed;
notification retries asynchronously.

Search projection delayed:
customer details may use authoritative fallback;
global search displays update delay.
```

Cada modo precisa ter entrada, saída, limite de duração e comunicação.

---

### 22. Criar degraded-mode policy

Arquivo:

```text
contracts/degraded-mode-policy.yaml
```

```yaml
degradedMode:
  requires:
    - trigger
    - affected-operations
    - allowed-behavior
    - forbidden-behavior
    - user-message
    - metric
    - alert
    - exit-condition
    - maximum-duration

  silentActivation:
    forbidden

  falseSuccess:
    forbidden
```

---

### 23. Definir RTO e RPO

Arquivo:

```text
design/RECOVERY_OBJECTIVES.md
```

Exemplo:

```text
Appointment transactional data:
RPO <= 5 minutes;
RTO <= 30 minutes.

Search projection:
RPO rebuildable from events;
RTO <= 60 minutes.

Audit records:
RPO 0 for committed records;
RTO <= 30 minutes.
```

RTO define tempo de recuperação. RPO define perda de dados tolerável.

Não declare RPO zero sem tecnologia, operação e teste que sustentem a promessa.

---

### 24. Criar Recovery Plan

Arquivo:

```text
design/RECOVERY_PLAN.md
```

Registre:

```text
backup frequency;
point-in-time recovery;
restore procedure;
restore test frequency;
replica promotion;
DNS or routing change;
queue recovery;
projection rebuild;
credential recovery;
owner;
communication;
post-incident verification.
```

Backup sem restore comprovado é apenas expectativa.

---

### 25. Mapear Security Boundaries

Arquivo:

```text
design/SECURITY_BOUNDARIES.md
```

Defina fronteiras entre:

- internet e edge;
- edge e APIs;
- identidade e aplicação;
- tenant e tenant;
- aplicação e banco;
- producer e broker;
- consumer e stores;
- operador e ferramentas administrativas;
- sistema e fornecedor externo.

Para cada fronteira, registre autenticação, autorização, criptografia, validação, rate limit, auditoria e dados permitidos.

---

### 26. Criar Threat Scenarios focados

Arquivo:

```text
design/THREAT_SCENARIOS.md
```

Inclua cenários relevantes:

```text
cross-tenant read;
IDOR em Appointment;
replay de confirmacao;
credential stuffing;
abuso de busca;
payload excessivo;
mensagem forjada;
secret exposto;
privileged repair sem auditoria;
log com dado pessoal.
```

O objetivo é cobrir os riscos principais, não fazer threat modeling completo.

---

### 27. Criar security review policy

Arquivo:

```text
contracts/security-review-policy.yaml
```

```yaml
securityReview:
  tenantIsolation:
    required

  objectAuthorization:
    appointmentAccess:
      required

  privilegedOperations:
    require:
      - strong-authentication
      - authorization
      - justification
      - audit

  dataInTransit:
    encryption:
      required

  secrets:
    sourceCode:
      forbidden

  logs:
    rawPersonalData:
      forbidden

  abuseProtection:
    required
```

---

### 28. Revisar multi-tenancy no desenho

Confirme:

- `TenantContext` vem de identidade validada;
- queries filtram tenant;
- cache inclui tenant na chave;
- mensagens carregam tenant confiável;
- métricas não criam cardinalidade ilimitada;
- quotas isolam noisy neighbors;
- exportações e jobs mantêm fronteira de tenant;
- operações administrativas exigem autorização especial.

A decisão de isolamento adotada na aula 638 precisa aparecer no design final.

---

### 29. Criar o Observability Map

Arquivo:

```text
design/OBSERVABILITY_MAP.md
```

Para cada operação crítica, registre:

```text
SLI;
metric;
trace span;
structured log;
correlation fields;
dashboard;
alert;
runbook;
owner.
```

Para confirmação:

```text
request rate;
success rate;
p50, p95, p99;
timeout count;
conflict count;
database latency;
outbox pending age;
event publication latency;
trace ID;
tenant-safe context.
```

---

### 30. Ligar SLO a sinais

Arquivo:

```text
contracts/slo-observability-policy.yaml
```

```yaml
sloObservability:
  eachSlo:
    requires:
      - sli
      - data-source
      - query
      - dashboard
      - alert
      - owner
      - runbook

  alertWithoutAction:
    forbidden

  metricWithoutUnit:
    forbidden
```

SLO sem fonte de medição não é verificável.

---

### 31. Definir tracing e logging

O trace deve propagar:

```text
traceId;
requestId;
operation;
tenant-safe identifier;
appointmentId quando permitido;
idempotency reference sanitizada;
dependency;
outcome.
```

Logs não devem incluir token, senha, payload completo ou dados pessoais desnecessários.

Crie sampling diferenciado para erros e alta latência, sem destruir a capacidade de investigação.

---

### 32. Criar Alert Catalog

Arquivo:

```text
design/ALERT_CATALOG.md
```

Exemplos:

```text
Confirmation error budget burn;
Database pool saturation;
Capacity lock contention;
Outbox oldest pending age;
Consumer lag;
Search staleness beyond budget;
Cross-tenant authorization denial spike;
Backup failure;
Restore test overdue;
Cost anomaly.
```

Cada alerta precisa de severidade, condição, janela, owner, runbook e supressão de ruído.

---

### 33. Desenhar Deployment Topology

Arquivo:

```text
design/DEPLOYMENT_TOPOLOGY.md
```

Diferencie componente lógico de unidade de deployment.

Exemplo inicial:

```text
Edge;
Scheduling API replicas;
Scheduling Worker replicas;
PostgreSQL primary and replica;
Redis;
Message Broker;
Observability Collector;
Secret Manager.
```

Registre zona, redundância, autoscaling, statefulness, storage, network policy e owner.

Não declare multi-region ativo-ativo sem necessidade e capacidade operacional.

---

### 34. Modelar Deployment Unit

```java
package br.com.formacao.systemdesignreview.deployment;

import java.util.List;

public record DeploymentUnit(
        String name,
        DeploymentKind kind,
        int minimumReplicas,
        int maximumReplicas,
        boolean stateful,
        List<String> zones,
        String owner) {
}
}
```

O teste deve impedir `minimumReplicas = 1` para uma API que promete alta disponibilidade sem justificativa.

---

### 35. Criar Rollout Strategy

Arquivo:

```text
design/ROLLOUT_STRATEGY.md
```

Defina:

```text
rolling update;
readiness;
liveness;
startup probe;
canary percentage;
metric gates;
automatic rollback;
manual approval;
feature flags;
compatibility window.
```

Exemplo:

```text
5% canary por 15 minutos;
error rate <= baseline + 0.2%;
p95 <= baseline + 10%;
zero migration error;
zero cross-tenant alert;
then expand to 25%, 50% and 100%.
```

---

### 36. Planejar rollback e roll-forward

Rollback de aplicação pode falhar quando o schema já mudou.

Crie:

```text
design/ROLLBACK_AND_COMPATIBILITY.md
```

Inclua:

- expand-and-contract migration;
- versões compatíveis de eventos;
- readers tolerantes;
- feature flags;
- rollback de configuração;
- roll-forward quando rollback não é seguro;
- owner da decisão.

A implantação precisa considerar aplicação, banco, mensagens e configurações como um conjunto evolutivo.

---

### 37. Criar Migration Safety Policy

Arquivo:

```text
contracts/migration-safety-policy.yaml
```

```yaml
migrationSafety:
  productionChange:
    requires:
      - backward-compatible-step
      - estimated-duration
      - lock-risk-analysis
      - backup-status
      - rollback-or-roll-forward-plan
      - observability
      - owner

  destructiveChange:
    directExecution:
      forbidden

  applicationBeforeSchemaCompatibility:
    forbidden
```

---

### 38. Planejar testes de falha

Arquivo:

```text
design/FAILURE_DRILLS.md
```

Defina exercícios controlados:

```text
kill one API replica;
slow database query;
exhaust small connection pool in test;
pause outbox relay;
stop one consumer;
make notification provider fail;
introduce stale search projection;
execute restore test;
abort canary rollout.
```

Cada drill precisa de hipótese, ambiente, limite, abort condition e evidência.

---

### 39. Criar Cost Model

Arquivo:

```text
design/COST_MODEL.md
```

Separe:

```text
compute;
database;
storage;
backup;
cache;
broker;
network egress;
observability;
security services;
licenses;
operational labor.
```

Estime custo base e custo por crescimento.

Exemplo:

```text
cost per 1 million appointments;
cost per tenant tier;
cost per retained event-month;
cost per GB of logs;
cost of high availability;
cost of recovery objectives.
```

---

### 40. Modelar estimativa de custo

```java
package br.com.formacao.systemdesignreview.cost;

import java.math.BigDecimal;

public record MonthlyCostItem(
        String category,
        BigDecimal fixedCost,
        BigDecimal variableUnitCost,
        long variableUnits) {

    public BigDecimal total() {
        return fixedCost.add(
                variableUnitCost.multiply(
                        BigDecimal.valueOf(variableUnits)));
    }
}
```

O valor exato pode mudar por fornecedor. O modelo deve revelar os drivers.

---

### 41. Criar Cost Guardrails

Arquivo:

```text
contracts/cost-guardrail-policy.yaml
```

```yaml
costGuardrails:
  monthlyBudget:
    required

  anomalyDetection:
    required

  logRetention:
    owner:
      required

  autoscaling:
    maximumLimit:
      required

  tenantCostAttribution:
    required

  architectureWithoutCostEstimate:
    forbidden
```

Autoscaling sem limite superior pode transformar incidente técnico em incidente financeiro.

---

### 42. Criar Evolution Scenarios

Arquivo:

```text
design/EVOLUTION_SCENARIOS.md
```

Exemplos:

```text
volume cresce 10x;
um tenant exige banco dedicado;
confirmação precisa operar em nova região;
novo canal de atendimento é adicionado;
SLA de busca cai de 2 segundos para 500 ms;
retenção legal aumenta para sete anos;
fornecedor de mensageria muda;
modelo de capacidade passa a usar previsão.
```

Para cada cenário, registre componentes afetados, dados, contratos, risco, compatibilidade e gatilho.

---

### 43. Modelar Change Scenario

```java
package br.com.formacao.systemdesignreview.evolution;

import java.util.List;

public record ChangeScenario(
        String id,
        String stimulus,
        List<String> affectedComponents,
        List<String> affectedContracts,
        ChangeMagnitude magnitude,
        String trigger,
        String owner) {
}
}
```

Modificabilidade exige mudanças concretas, não a frase “arquitetura flexível”.

---

### 44. Criar gatilhos de evolução

Arquivo:

```text
design/EVOLUTION_TRIGGERS.md
```

Exemplos:

```text
database write utilization > 70% por 30 dias;
connection wait p95 > 50 ms;
consumer lag fora do budget em 1% das janelas;
tenant representa > 25% do tráfego;
search index > 500 million documents;
restore test excede RTO;
custo por Appointment cresce 20%;
change failure rate supera target.
```

Gatilhos evitam mudança prematura ou tardia.

---


### 45. Criar o Review Verifier

```java
package br.com.formacao.systemdesignreview.validation;

import java.util.ArrayList;
import java.util.List;

public final class DesignReviewVerifier {

    public ReviewResult verify(
            DesignReview review) {

        List<String> failures =
                new ArrayList<>();

        requireScenarios(review, failures);
        requireCapacity(review, failures);
        requireFailureModes(review, failures);
        requireSecurity(review, failures);
        requireObservability(review, failures);
        requireDeploymentSafety(review, failures);
        requireCostModel(review, failures);
        requireEvolutionTriggers(review, failures);

        return ReviewResult.from(failures);
    }
}
```

O verifier impede omissões; não decide a arquitetura.

---

### 46. Criar a Design Review Matrix

Arquivo:

```text
design/DESIGN_REVIEW_MATRIX.md
```

Colunas:

```text
review area;
scenario;
requirement;
current design;
limit;
risk;
control;
metric;
owner;
evidence;
status.
```

Status permitidos:

```text
PASS;
PASS_WITH_ASSUMPTION;
RISK_ACCEPTED;
ACTION_REQUIRED;
BLOCKED;
INCONCLUSIVE.
```

Não use pontuação ponderada ou ranking genérico. Isso será aprofundado na aula 643.

---

### 47. Executar testes de revisão

Crie uma suíte que falhe quando o design não sustentar suas promessas. Valide:

- cenários críticos com medida, unidade e owner;
- demanda, capacidade, headroom, conexões e throughput;
- hot spots e backlog acima do budget;
- banco indisponível sem falso sucesso;
- broker indisponível com outbox preservada;
- busca stale com sinalização;
- retries dentro do deadline;
- tenant isolation em banco, cache e mensagens;
- logs sem tokens ou dados pessoais desnecessários;
- SLO ligado a SLI, dashboard, alerta e runbook;
- canary com metric gate e rollback;
- migration backward compatible;
- backup com restore testável;
- custos fixos e variáveis;
- evolução 10x com trigger mensurável.

O gate deve falhar diante de capacidade insuficiente, fallback inconsistente, degraded mode sem saída, deployment sem rollback ou objetivo de recuperação sem evidência.

### 48. Criar Reports

Arquivos:

```text
reports/quality-scenario-report.yaml
reports/capacity-report.yaml
reports/bottleneck-report.yaml
reports/failure-report.yaml
reports/security-report.yaml
reports/observability-report.yaml
reports/deployment-report.yaml
reports/recovery-report.yaml
reports/cost-report.yaml
reports/evolution-report.yaml
reports/system-design-review-gate-report.yaml
```

Exemplo:

```yaml
systemDesignReview:
  criticalRequirements:
    12

  qualityScenarios:
    18

  identifiedBottlenecks:
    7

  blockingRisks:
    0

  acceptedRisks:
    3

  degradedModes:
    5

  recoveryObjectives:
    4

  securityBoundaries:
    9

  deploymentChecks:
    PASS

  monthlyCostEstimated:
    true

  evolutionScenarios:
    8

  result:
    PASS_WITH_ASSUMPTIONS
```

---

### 49. Criar o Gate

O gate valida:

```text
baseline;
quality scenarios;
critical paths;
capacity;
bottlenecks;
consistency;
failures;
degraded modes;
recovery;
security;
observability;
deployment;
rollout;
migrations;
cost;
evolution;
tests;
documentation;
evidence.
```

Status:

```text
PASS;
PASS_WITH_ASSUMPTIONS;
FAIL_BASELINE;
FAIL_SCENARIOS;
FAIL_CAPACITY;
FAIL_BOTTLENECK;
FAIL_CONSISTENCY;
FAIL_FAILURE_MODEL;
FAIL_DEGRADED_MODE;
FAIL_RECOVERY;
FAIL_SECURITY;
FAIL_OBSERVABILITY;
FAIL_DEPLOYMENT;
FAIL_MIGRATION;
FAIL_COST;
FAIL_EVOLUTION;
FAIL_TEST;
INCONCLUSIVE.
```

---

### 50. Coletar Evidence

Arquivo:

```text
contracts/system-design-review-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- baseline lesson;
- requirement count;
- quality scenario count;
- critical path count;
- capacity model status;
- bottleneck count;
- consistency matrix status;
- failure scenario count;
- degraded mode count;
- RTO and RPO status;
- security boundary count;
- SLO observability coverage;
- deployment check status;
- restore test status;
- cost model status;
- evolution scenario count;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua credenciais, dados pessoais, topologia real, custos confidenciais, endpoints privados ou segredos.

---

### 51. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

```yaml
nonAnticipation:
  lesson643:
    forbidden:
      - generic-tradeoff-framework-deep-dive
      - weighted-option-scoring
      - formal-benefit-cost-risk-comparison-method
      - ATAM-deep-dive

  lesson644:
    forbidden:
      - ADR-template-deep-dive
      - ADR-lifecycle-deep-dive
      - ADR-governance-deep-dive

  allowed:
    - design-specific-rationale
    - explicit-limit
    - risk
    - control
    - review-trigger
```

---

### 52. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-system-design-part-two\validate-review-contract.ps1

.\scripts\m19\service-scheduling-system-design-part-two\validate-quality-attribute-scenarios.ps1

.\scripts\m19\service-scheduling-system-design-part-two\validate-capacity-and-bottlenecks.ps1

.\scripts\m19\service-scheduling-system-design-part-two\validate-consistency-and-failures.ps1

.\scripts\m19\service-scheduling-system-design-part-two\validate-security-and-observability.ps1

.\scripts\m19\service-scheduling-system-design-part-two\validate-deployment-and-recovery.ps1

.\scripts\m19\service-scheduling-system-design-part-two\validate-cost-and-evolution.ps1

.\scripts\m19\service-scheduling-system-design-part-two\run-system-design-part-two-tests.ps1

.\scripts\m19\service-scheduling-system-design-part-two\collect-system-design-part-two-evidence.ps1

.\scripts\m19\service-scheduling-system-design-part-two\verify-system-design-part-two-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 53. Encerrar o laboratório

Confirme:

- baseline da aula 641 referenciado;
- quality scenarios mensuráveis;
- critical paths explícitos;
- dependências classificadas;
- capacidade calculada;
- headroom registrado;
- gargalos e hot spots visíveis;
- banco e conexões orçados;
- cache com propósito e budget;
- consistência por operação;
- failure model criado;
- retries limitados;
- degraded modes explícitos;
- RTO e RPO definidos;
- restore planejado e testável;
- security boundaries documentadas;
- isolamento de tenant revisado;
- SLOs ligados a observabilidade;
- deployment e rollout seguros;
- migrations compatíveis;
- custo estimado;
- evolution scenarios e triggers definidos;
- reports, evidence e gate gerados;
- trade-offs formais não aprofundados;
- ADR não antecipado.

---

## Entendendo o que foi feito

### O desenho ganhou cenários verificáveis

Qualidades abstratas viraram estímulos, ambientes, respostas e medidas. Agora “rápido”, “disponível” e “seguro” possuem critérios observáveis.

### A capacidade ganhou limites

Demanda, throughput, utilização, conexões, headroom, hot spots e crescimento foram conectados. O design deixou de prometer escala infinita.

### As falhas ganharam comportamento

Dependências, timeouts, retries, degraded modes, RTO, RPO e recovery passaram a explicar como o sistema reage quando partes falham.

### Segurança e observabilidade ganharam fronteiras

Tenant, objeto, mensagens, logs, secrets, SLOs, métricas, traces, alertas e runbooks foram ligados às operações reais.

### Deployment, custo e evolução ganharam espaço

O sistema agora possui topologia, rollout, rollback, migration safety, drivers de custo e gatilhos de evolução.

---

## Erros comuns importantes

### Revisar apenas o happy path

Um fluxo funcional não comprova comportamento sob pico, falha, atraso ou deployment parcial.

### Usar média para esconder pico e hot spot

A média global não revela a workzone, tenant ou janela que concentra disputa.

### Declarar escala sem recurso limitante

Adicionar instâncias não corrige banco saturado, lock global, fila mal particionada ou fornecedor limitado.

### Colocar tudo no caminho crítico

Notificação, analytics e dashboard não devem bloquear confirmação quando podem ocorrer depois do commit.

### Retry sem deadline

Tentativas aumentam latência, carga e risco de tempestade.

### Fallback que viola regra de negócio

Responder com dado stale para decisão crítica pode ser pior que rejeitar explicitamente.

### Ter backup sem restore testado

A existência do arquivo não prova RTO nem integridade.

### Observar infraestrutura e esquecer operação

CPU saudável não significa confirmação saudável. Meça outcomes e SLOs.

### Implantar sem compatibilidade

Código novo, schema antigo e eventos de versões diferentes podem coexistir durante rollout.

### Ignorar custo

Redundância, logs, replicação e baixa latência possuem custo técnico e financeiro.

### Chamar tudo de trade-off

Nesta aula, registre justificativas concretas. O método formal de comparação será aprofundado na aula 643.

---

## Comandos úteis

### Validar cenários

```powershell
.\scripts\m19\service-scheduling-system-design-part-two\validate-quality-attribute-scenarios.ps1
```

### Validar capacidade

```powershell
.\scripts\m19\service-scheduling-system-design-part-two\validate-capacity-and-bottlenecks.ps1
```

### Validar falhas

```powershell
.\scripts\m19\service-scheduling-system-design-part-two\validate-consistency-and-failures.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-system-design-part-two\run-system-design-part-two-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-system-design-part-two\verify-system-design-part-two-gate.ps1
```

---

## Exercício guiado

Use o design da aula 641 como baseline e execute uma revisão completa.

Escolha três cenários obrigatórios:

```text
pico 10x;
database latency de 2 segundos;
notification provider indisponível por 30 minutos.
```

Para cada cenário:

1. identifique requisitos e SLOs afetados;
2. percorra o critical path;
3. calcule capacidade e limite;
4. identifique gargalo ou failure domain;
5. defina comportamento normal e degradado;
6. estabeleça métricas e alertas;
7. registre recovery;
8. avalie segurança e tenant isolation;
9. estime efeito de custo;
10. defina gatilho de evolução;
11. produza evidence;
12. execute o gate.

O exercício termina quando o design explica o que acontece antes, durante e depois de cada cenário.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 641 e ponte para a aula 643 foram preservadas;
- baseline, charter e contrato de revisão foram criados;
- quality scenarios possuem estímulo, ambiente, resposta, medida e owner;
- critical paths e dependências foram classificados;
- capacidade, headroom, conexões, gargalos e hot spots foram analisados;
- banco, cache e consistência possuem limites e políticas explícitas;
- failure model, deadlines, retries e degraded modes foram definidos;
- RTO, RPO, recovery e restore test foram documentados;
- security boundaries, tenant isolation e ameaças principais foram revisados;
- SLOs estão ligados a SLIs, dashboards, alertas e runbooks;
- deployment, canary, rollback e migration safety foram planejados;
- cost model, guardrails, evolution scenarios e triggers foram criados;
- testes, reports, evidence e gate foram gerados;
- trade-offs formais e ADR não foram antecipados;
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
  labs/m19/aula-642-design-sistemas-parte-2/service-scheduling-system-design-review `
  scripts/m19/service-scheduling-system-design-part-two `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realTopology|privateEndpoint|productionCost|customerData|weightedTradeoffScore|ADRTemplate"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): concluir design de sistemas"
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
- custos confidenciais;
- configurações de produção;
- framework formal da aula 643;
- ADR completo da aula 644.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu a revisão de design de `Service Scheduling`.

Você criou quality attribute scenarios, critical paths, capacity model, bottleneck map, hot spot analysis, database budget, cache plan, consistency matrix, failure model, dependency budgets, degraded modes, recovery objectives, security boundaries, threat scenarios, observability map, deployment topology, rollout strategy, migration safety, failure drills, cost model, evolution scenarios, reports, evidence e gate.

Você comprovou que um design não fica pronto apenas porque o happy path fecha; que escala depende do recurso limitante; que picos e hot spots precisam ser medidos; que dependências do caminho crítico devem ser mínimas; que falhas precisam de comportamento e recuperação explícitos; que segurança, observabilidade e multi-tenancy atravessam toda a arquitetura; que deployment exige compatibilidade e rollback; que RTO e RPO precisam de testes; que custo possui drivers; e que evolução precisa de cenários e gatilhos.

A próxima aula será:

```text
643 - M19.33 - Trade offs tecnicos
```

Nela, você aprofundará como comparar alternativas técnicas sem procurar uma solução universalmente melhor, tornando explícitos benefícios, custos, riscos, reversibilidade, evidências e contexto.

Nenhum framework formal de trade-offs ou aprofundamento de ADR foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei quality attribute scenarios.
- [ ] Mapeei critical paths.
- [ ] Calculei capacidade e headroom.
- [ ] Identifiquei gargalos e hot spots.
- [ ] Revisei consistência e falhas.
- [ ] Defini degraded modes, RTO e RPO.
- [ ] Revisei segurança e observabilidade.
- [ ] Desenhei deployment e rollout.
- [ ] Modelei custo e evolução.
- [ ] Executei testes e gate.

---

## Troubleshooting adicional

### O design suporta tudo no papel

Procure limites numéricos, capacidade por recurso e cenários que façam o gate falhar.

### O banco virou gargalo em todas as análises

Revise queries, índices, transações, pool, hot spots, read models e ownership antes de propor sharding.

### O cache melhora a latência, mas retorna dado antigo

Defina staleness budget, invalidação, fallback e operações que não podem usar cache.

### O retry piora o incidente

Reduza tentativas, aplique backoff, jitter, deadline, circuit breaker e load shedding.

### O degraded mode nunca termina

Crie exit condition, maximum duration, alert e owner.

### A equipe promete RPO zero

Exija mecanismo, replicação, backup, journal, teste de failover e evidência.

### Há muitos alertas sem ação

Ligue cada alerta a SLO, owner e runbook; remova sinais sem decisão operacional.

### O canary parece saudável, mas a migration falha

Inclua métricas de schema, compatibilidade, lock e duração no gate de rollout.

### O custo cresce sem tráfego equivalente

Verifique retenção de logs, recursos ociosos, egress, réplicas, cardinalidade e autoscaling máximo.

### A equipe quer escolher tecnologia agora

Use os cenários e limites desta aula. A comparação estruturada será feita na aula 643.

---

## Perguntas de revisão

1. Por que a Parte 2 não começa redesenhando tudo?
2. O que é Quality Attribute Scenario?
3. O que é critical path?
4. O que é failure domain?
5. Por que capacidade precisa de headroom?
6. O que é hot spot?
7. O que diferencia degraded mode de falha silenciosa?
8. Qual diferença entre RTO e RPO?
9. Por que SLO precisa de SLI e runbook?
10. Por que deployment precisa de compatibilidade?
11. Por que custo faz parte do design?
12. O que é evolution trigger?
13. O que ficou para a aula 643?
14. Qual é a próxima aula?

---

## Roteiro de resposta

1. Porque o baseline precisa ser testado, não substituído sem evidência.
2. Cenário com estímulo, ambiente, artefato, resposta e medida.
3. Passos indispensáveis para concluir uma operação crítica.
4. Fronteira em que uma falha pode afetar recursos relacionados.
5. Para absorver pico, variação e recuperação sem operar no limite.
6. Chave, tenant, região ou recurso que concentra demanda e contenção.
7. O degraded mode é intencional, mensurado, comunicado e possui saída.
8. RTO mede tempo de recuperação; RPO mede perda de dados tolerável.
9. Para medir, alertar e agir sobre a promessa.
10. Porque versões coexistem durante rollout e rollback.
11. Porque redundância, desempenho, retenção e operação consomem recursos.
12. Métrica ou condição que indica necessidade de mudar o desenho.
13. Método explícito de comparação de alternativas técnicas.
14. Trade offs tecnicos.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 642 - M19.32 - Design de sistemas parte 2

- Continuei o design de Service Scheduling a partir do baseline da aula 641.
- Criei Design Review Charter, Quality Attribute Scenarios e Critical Paths.
- Modelei capacidade, headroom, gargalos, hot spots, banco e cache.
- Criei Consistency Matrix, Failure Model, deadlines e retry budgets.
- Defini Degraded Modes, RTO, RPO, Recovery Plan e restore test.
- Revisei Security Boundaries, tenant isolation e Threat Scenarios.
- Liguei SLOs a métricas, traces, alertas, owners e runbooks.
- Desenhei Deployment Topology, canary, rollback e migration safety.
- Planejei failure drills, Cost Model, guardrails e Evolution Triggers.
- Criei testes, reports, evidence e gate.
- Não antecipei Trade-offs técnicos nem ADR.
- Próxima aula: Trade offs tecnicos.
```

---

## Referência técnica curta

- Quality Attribute Scenario.
- Critical Path.
- Failure Domain.
- Capacity Model.
- Bottleneck e Hot Spot.
- Consistency Matrix.
- Failure Model.
- Degraded Mode.
- RTO e RPO.
- Security Boundary.
- SLI, SLO e Runbook.
- Deployment Topology.
- Canary e Rollback.
- Cost Driver.
- Evolution Scenario.

Regra final:

```text
A Parte 2 transforma o baseline funcional em uma arquitetura revisada sob pressão. Quality Attribute Scenarios tornam qualidades mensuráveis; Critical Paths removem dependências desnecessárias; Capacity Model, headroom, conexões, gargalos e hot spots impedem promessas de escala infinita. Consistency Matrix, Failure Model, deadlines, retry budgets, Degraded Modes, RTO, RPO e recovery definem comportamento sem falso sucesso. Security Boundaries, tenant isolation, observabilidade ligada a SLOs, deployment compatível, canary, rollback, migration safety, Cost Model e Evolution Triggers tornam o sistema operável e evolutivo. O gate só aprova quando cenários, capacidade, falhas, segurança, observabilidade, deployment, custo, evolução, testes e evidence estão coerentes; o método formal de trade-offs permanece para a aula 643 e ADR para a aula 644.
```
