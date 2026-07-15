# 665 - M19.55 - Projeto arquitetura OS parte 2

## Apresentação da aula

Na aula 664, você iniciou o projeto de arquitetura de Ordens de Serviço.

A Parte 1 criou a base do problema:

- Project Charter;
- Problem Statement;
- escopo e não objetivos;
- atores e stakeholders;
- jornadas de negócio;
- mapa de capacidades;
- domínio e subdomínios;
- bounded contexts candidatos;
- Context Map;
- requisitos funcionais;
- atributos de qualidade;
- C4 System Context;
- C4 Container inicial;
- matriz de autoridade de dados;
- mapa de integrações;
- catálogo inicial de eventos;
- riscos;
- ADRs propostos;
- backlog da Parte 2.

Agora o projeto precisa sair do nível de descoberta e alcançar um desenho arquitetural completo.

A Parte 2 responderá:

```text
como os contexts se comunicam?

quais APIs e eventos existem?

como schemas evoluem?

como a consistencia e tratada?

onde entra idempotencia?

como o sistema se protege?

como a jornada e observada?

como os containers sao implantados?

como a mudanca entra em producao?

como incidentes sao operados?

como as decisoes sao verificadas?

como a arquitetura e defendida?
```

O erro comum nesta etapa é transformar o projeto em uma coleção de tecnologias.

Exemplo:

```text
Spring Boot;

Kafka;

PostgreSQL;

Redis;

Kubernetes;

OpenTelemetry.
```

Essa lista não prova arquitetura.

Ela não explica:

- responsabilidade;
- autoridade;
- fluxo;
- failure mode;
- segurança;
- consistência;
- operação;
- trade-off;
- custo;
- evolução;
- critério de sucesso.

O objetivo desta aula é fechar a solução com decisões verificáveis.

O laboratório continuará em:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project
```

Você adicionará:

- API contracts;
- event contracts;
- schema evolution;
- consistency matrix;
- idempotency strategy;
- security architecture;
- observability architecture;
- deployment model;
- resilience policy;
- migration and rollout;
- runbooks;
- fitness functions;
- ArchUnit rules;
- evidence final;
- Architecture Defense Pack;
- gate final da Parte 2.

A próxima aula será:

```text
666 - M19.56 - Revisao arquitetura parte 1
```

A aula 666 revisará criticamente o conjunto de decisões arquiteturais já construído, procurando inconsistências, lacunas, trade-offs mal defendidos, riscos não tratados e evidências insuficientes.

Nesta aula, a revisão ampla do M19 não será antecipada.

Regra central:

```text
uma arquitetura completa
nao e a que possui
mais tecnologias;

e a que conecta
boundaries,
contratos,
dados,
seguranca,
observabilidade,
operacao,
rollout
e evidencias

em uma decisao defensavel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
662:
Governanca tecnica leve.

663:
Documentacao arquitetural viva.

664:
Projeto arquitetura OS parte 1.

665:
Projeto arquitetura OS parte 2.

666:
Revisao arquitetura parte 1.
```

A progressão é:

```text
governar decisões;

manter conhecimento vivo;

descobrir e desenhar;

completar e defender;

revisar criticamente.
```

A Parte 2 reaproveitará decisões anteriores do curso:

- arquitetura hexagonal;
- DDD;
- bounded contexts;
- eventos;
- Outbox;
- Inbox;
- Saga;
- idempotência;
- multi-tenancy;
- CAP;
- PACELC;
- resiliência;
- SLOs;
- segurança;
- dados;
- governança;
- documentação viva.

O objetivo é mostrar como esses temas se conectam em uma solução única.

---

## Objetivo prático

A estrutura será expandida:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1
└── os-architecture-project
    ├── architecture
    │   ├── API_CONTRACT_CATALOG.md
    │   ├── EVENT_CONTRACT_CATALOG.md
    │   ├── SCHEMA_EVOLUTION_POLICY.md
    │   ├── CONSISTENCY_MATRIX.md
    │   ├── IDEMPOTENCY_STRATEGY.md
    │   ├── SECURITY_ARCHITECTURE.md
    │   ├── OBSERVABILITY_ARCHITECTURE.md
    │   ├── RESILIENCE_POLICY.md
    │   ├── DEPLOYMENT_MODEL.md
    │   ├── ROLLOUT_AND_MIGRATION.md
    │   ├── RUNBOOK_CATALOG.md
    │   ├── FITNESS_FUNCTION_CATALOG.md
    │   ├── ARCHUNIT_POLICY.md
    │   ├── FINAL_ADR_CATALOG.md
    │   ├── ARCHITECTURE_DEFENSE_PACK.md
    │   ├── FINAL_TRACEABILITY_MAP.md
    │   ├── FINAL_TRADE_OFFS.md
    │   └── FINAL_OPEN_QUESTIONS.md
    ├── contracts
    │   ├── os-architecture-part-two-contract.yaml
    │   ├── API-contract-policy.yaml
    │   ├── event-contract-policy.yaml
    │   ├── schema-evolution-policy.yaml
    │   ├── consistency-policy.yaml
    │   ├── idempotency-policy.yaml
    │   ├── security-policy.yaml
    │   ├── observability-policy.yaml
    │   ├── resilience-policy.yaml
    │   ├── deployment-policy.yaml
    │   ├── rollout-policy.yaml
    │   ├── runbook-policy.yaml
    │   ├── fitness-function-policy.yaml
    │   ├── ArchUnit-policy.yaml
    │   ├── defense-policy.yaml
    │   └── evidence-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/osarchitecture
    │   │           ├── contract
    │   │           │   ├── ApiContract.java
    │   │           │   ├── EventContract.java
    │   │           │   ├── ContractVersion.java
    │   │           │   └── CompatibilityResult.java
    │   │           ├── consistency
    │   │           │   ├── ConsistencyDecision.java
    │   │           │   ├── ConsistencyLevel.java
    │   │           │   ├── ConsistencyScope.java
    │   │           │   └── ConsistencyCatalog.java
    │   │           ├── idempotency
    │   │           │   ├── IdempotencyPolicy.java
    │   │           │   ├── IdempotencyKey.java
    │   │           │   ├── IdempotencyScope.java
    │   │           │   └── DuplicateDecision.java
    │   │           ├── security
    │   │           │   ├── SecurityBoundary.java
    │   │           │   ├── AuthorizationRule.java
    │   │           │   ├── WorkloadIdentityRule.java
    │   │           │   └── SecurityDecision.java
    │   │           ├── observability
    │   │           │   ├── JourneySignal.java
    │   │           │   ├── SloContract.java
    │   │           │   ├── CardinalityRule.java
    │   │           │   └── AlertContract.java
    │   │           ├── resilience
    │   │           │   ├── TimeoutPolicy.java
    │   │           │   ├── RetryPolicy.java
    │   │           │   ├── CircuitPolicy.java
    │   │           │   └── RecoveryPolicy.java
    │   │           ├── rollout
    │   │           │   ├── RolloutStage.java
    │   │           │   ├── RolloutGate.java
    │   │           │   ├── RollbackDecision.java
    │   │           │   └── MigrationStep.java
    │   │           └── defense
    │   │               ├── ArchitectureClaim.java
    │   │               ├── ArchitectureEvidence.java
    │   │               ├── ArchitectureQuestion.java
    │   │               └── DefenseResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/osarchitecture
    │               ├── contract
    │               │   ├── ApiCompatibilityTest.java
    │               │   └── EventCompatibilityTest.java
    │               ├── consistency
    │               │   ├── ConsistencyMatrixTest.java
    │               │   └── CrossBoundaryTransactionTest.java
    │               ├── idempotency
    │               │   ├── DuplicateCommandTest.java
    │               │   └── DuplicateEventTest.java
    │               ├── security
    │               │   ├── CrossTenantAccessTest.java
    │               │   └── WorkloadAuthorizationTest.java
    │               ├── observability
    │               │   ├── JourneyTraceabilityTest.java
    │               │   └── CardinalityBudgetTest.java
    │               ├── rollout
    │               │   ├── RolloutGateTest.java
    │               │   └── RollbackReadinessTest.java
    │               └── architecture
    │                   ├── ContextIsolationTest.java
    │                   ├── DataAuthorityRuleTest.java
    │                   ├── FitnessFunctionCoverageTest.java
    │                   └── FinalArchitectureGateTest.java
    └── reports
        ├── API-contract-report.yaml
        ├── event-contract-report.yaml
        ├── consistency-report.yaml
        ├── idempotency-report.yaml
        ├── security-report.yaml
        ├── observability-report.yaml
        ├── resilience-report.yaml
        ├── rollout-report.yaml
        ├── fitness-function-report.yaml
        ├── architecture-defense-report.yaml
        └── os-architecture-final-gate-report.yaml
```

Scripts:

```text
scripts/m19/os-architecture-project-part-two
├── validate-API-contracts.ps1
├── validate-event-contracts.ps1
├── validate-schema-evolution.ps1
├── validate-consistency-matrix.ps1
├── validate-idempotency-strategy.ps1
├── validate-security-architecture.ps1
├── validate-observability-architecture.ps1
├── validate-resilience-policy.ps1
├── validate-deployment-model.ps1
├── validate-rollout-plan.ps1
├── validate-runbook-catalog.ps1
├── validate-fitness-functions.ps1
├── run-os-architecture-final-tests.ps1
├── collect-os-architecture-final-evidence.ps1
└── verify-os-architecture-final-gate.ps1
```

---

## Conceito essencial

### Contrato é boundary executável

Um contrato define o que atravessa uma fronteira.

Ele inclui:

- operação;
- intenção;
- schema;
- versão;
- owner;
- segurança;
- compatibilidade;
- erro;
- timeout;
- idempotência;
- observabilidade;
- lifecycle.

Contrato não é apenas DTO.

### Consistência é escolhida por operação

O projeto não precisa escolher entre:

```text
forte em tudo;
eventual em tudo.
```

Ele precisa decidir por operação.

Exemplos:

```text
reservar capacidade:
consistencia forte
na autoridade local.

propagar status:
consistencia eventual
entre contexts.

consultar dashboard:
eventual com freshness.

autorizar tenant:
forte no request.

enviar notificacao:
eventual e retryable.
```

### Segurança precisa atravessar todos os boundaries

Autenticar no Gateway não basta.

O projeto precisa de:

- identidade humana;
- workload identity;
- tenant context;
- autorização;
- least privilege;
- secrets;
- proteção de mensagens;
- auditoria;
- supply chain;
- incident response.

### Observabilidade precisa representar jornadas

Métricas isoladas de CPU não explicam:

```text
por que a OS nao encerrou?
```

A arquitetura precisa observar:

- jornada;
- passo;
- estado;
- boundary;
- outcome;
- latência;
- backlog;
- timeout;
- compensação;
- intervenção manual.

### Rollout faz parte da arquitetura

Uma arquitetura que só funciona depois da migração completa não é suficiente.

Ela precisa explicar:

- coexistência;
- compatibilidade;
- dual run;
- backfill;
- feature flag;
- canary;
- rollback;
- cleanup.

---

## Mão na massa guiada

### 1. Criar contrato da Parte 2

Arquivo:

```text
contracts/os-architecture-part-two-contract.yaml
```

Conteúdo:

```yaml
osArchitecturePartTwo:
  context:
    Work-Order-Management

  required:
    - API-contracts
    - event-contracts
    - schema-evolution
    - consistency-matrix
    - idempotency
    - security-architecture
    - observability-architecture
    - resilience-policy
    - deployment-model
    - rollout-and-migration
    - runbooks
    - fitness-functions
    - ArchUnit-rules
    - final-ADRs
    - defense-pack
    - final-traceability
    - final-evidence
    - final-gate

  forbidden:
    - contract-without-owner
    - shared-write-authority
    - retry-without-idempotency
    - cross-tenant-access
    - high-cardinality-label
    - rollout-without-rollback
    - runbook-without-test
    - decision-without-evidence
    - review-lesson-deep-dive

  nextLesson:
    code:
      M19.56
```

---

### 2. Criar catálogo de APIs

Arquivo:

```text
architecture/API_CONTRACT_CATALOG.md
```

APIs principais:

```text
POST /work-orders;

GET /work-orders/{id};

POST /work-orders/{id}/activities;

POST /activities/{id}/schedule;

POST /activities/{id}/reschedule;

POST /activities/{id}/confirm;

POST /activities/{id}/cancel;

POST /activities/{id}/execution/start;

POST /activities/{id}/execution/complete;

GET /activities/{id}/checklist;

POST /activities/{id}/checklist-answers;

POST /activities/{id}/transactions.
```

Cada API registra:

- owner;
- consumer;
- tenant;
- authorization;
- idempotency;
- request;
- response;
- errors;
- SLO;
- version;
- deprecation.

---

### 3. Criar ApiContract

```java
package br.com.formacao.osarchitecture.contract;

import java.util.List;
import java.util.Objects;

public record ApiContract(
        String operationId,
        String method,
        String path,
        String owner,
        ContractVersion version,
        boolean idempotent,
        List<String> authorizationRules,
        List<String> errorCodes,
        String SLOId) {

    public ApiContract {
        Objects.requireNonNull(operationId);
        Objects.requireNonNull(method);
        Objects.requireNonNull(path);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(version);
        authorizationRules =
                List.copyOf(authorizationRules);
        errorCodes = List.copyOf(errorCodes);
        Objects.requireNonNull(SLOId);
    }
}
```

---

### 4. Definir erro contratual

Exemplo:

```text
ACTIVITY_NOT_FOUND;

TENANT_MISMATCH;

INVALID_ACTIVITY_STATUS;

SCHEDULE_CONFLICT;

CAPACITY_UNAVAILABLE;

IDEMPOTENCY_KEY_CONFLICT;

CHECKLIST_INCOMPLETE;

EVIDENCE_REQUIRED;

AUTHORIZATION_DENIED.
```

Evite retornar stack trace ou detalhes internos.

---

### 5. Definir idempotência HTTP

Operações:

```text
create work order;

schedule;

reschedule;

confirm;

cancel;

complete execution;

add transaction.
```

Regras:

- `Idempotency-Key`;
- escopo por tenant e operação;
- hash do payload;
- resposta persistida;
- conflito se mesma chave receber payload diferente;
- TTL;
- auditoria;
- replay seguro.

---

### 6. Criar catálogo de eventos

Arquivo:

```text
architecture/EVENT_CONTRACT_CATALOG.md
```

Eventos finais:

```text
WorkOrderCreatedV1;

ActivityCreatedV1;

SchedulingRequestedV1;

ActivityScheduledV1;

ActivityRescheduledV1;

CapacityReservedV1;

CapacityReservationFailedV1;

ActivityStartedV1;

ChecklistCompletedV1;

ActivityExecutionCompletedV1;

ActivityCancelledV1;

WorkOrderCompletedV1;

CompensationCalculatedV1;

CustomerNotificationRequestedV1.
```

Cada evento possui:

- owner;
- aggregate ID;
- event ID;
- tenant ID;
- occurred at;
- schema version;
- correlation ID;
- causation ID;
- payload mínimo;
- PII classification;
- consumers;
- ordering key;
- retention.

---

### 7. Criar EventContract

```java
package br.com.formacao.osarchitecture.contract;

import java.util.List;
import java.util.Objects;

public record EventContract(
        String eventName,
        ContractVersion version,
        String owner,
        String aggregateType,
        String orderingKey,
        List<String> consumers,
        String schemaLocation,
        boolean containsPersonalData) {

    public EventContract {
        Objects.requireNonNull(eventName);
        Objects.requireNonNull(version);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(aggregateType);
        Objects.requireNonNull(orderingKey);
        consumers = List.copyOf(consumers);
        Objects.requireNonNull(schemaLocation);
    }
}
```

---

### 8. Definir schema evolution

Arquivo:

```text
architecture/SCHEMA_EVOLUTION_POLICY.md
```

Regras:

```text
adicionar campo opcional:
compatível.

remover campo:
breaking.

renomear campo:
breaking.

alterar semântica:
breaking.

alterar tipo:
breaking.

nova versão:
necessária quando
consumers não puderem migrar
sem coordenação.
```

Consumers devem tolerar campos desconhecidos.

---

### 9. Criar matriz de consistência

Arquivo:

```text
architecture/CONSISTENCY_MATRIX.md
```

Exemplos:

```text
Create Work Order:
forte dentro de Order Management.

Schedule Activity:
Saga entre Scheduling e Capacity.

Cancel Activity:
forte no estado autoritativo;
eventual nos efeitos derivados.

Complete Activity:
forte em Field Execution;
eventual em Order Management.

Close Work Order:
forte em Order Management
após fatos elegíveis.

Calculate Compensation:
eventual,
idempotente,
reconciliável.

Send Notification:
eventual,
retryable,
não bloqueante.

Operational Dashboard:
eventual,
freshness de 60 segundos.
```

---

### 10. Criar Consistency Decision

```java
package br.com.formacao.osarchitecture.consistency;

import java.util.Objects;

public record ConsistencyDecision(
        String operation,
        ConsistencyScope scope,
        ConsistencyLevel level,
        String authority,
        String propagation,
        String conflictPolicy,
        String recoveryPolicy) {

    public ConsistencyDecision {
        Objects.requireNonNull(operation);
        Objects.requireNonNull(scope);
        Objects.requireNonNull(level);
        Objects.requireNonNull(authority);
        Objects.requireNonNull(propagation);
        Objects.requireNonNull(conflictPolicy);
        Objects.requireNonNull(recoveryPolicy);
    }
}
```

---

### 11. Desenhar Saga de agendamento

Fluxo:

```text
Scheduling recebe comando;

valida estado;

inicia saga;

solicita reserva;

Capacity reserva;

Scheduling confirma janela;

Order Management recebe fato;

Communication recebe evento;

saga conclui.
```

Falha:

```text
Capacity indisponível:
saga espera ou falha.

Scheduling falha depois da reserva:
compensa liberação.

timeout ambíguo:
consulta estado.

late reply:
aplica state machine.

manual intervention:
somente com audit.
```

---

### 12. Definir Outbox e Inbox

Outbox por contexto:

- grava estado e evento na mesma transação;
- publica de forma assíncrona;
- monitora age;
- reprocessa com retry bounded.

Inbox por consumer:

- deduplica event ID;
- registra resultado;
- impede efeito duplicado;
- suporta replay controlado.

---

### 13. Criar estratégia de idempotência

Arquivo:

```text
architecture/IDEMPOTENCY_STRATEGY.md
```

Escopos:

```text
HTTP:
tenant + operation + key.

message:
consumer + event ID.

saga step:
saga ID + step.

external provider:
provider + operation + external key.

batch:
file ID + row ID.

manual repair:
finding ID + action.
```

---

### 14. Tratar conflito de chave

Se a mesma chave receber payload diferente:

```text
409 IDEMPOTENCY_KEY_CONFLICT.
```

Não execute novamente.

Registre audit e evidence sanitizada.

---

### 15. Criar arquitetura de segurança

Arquivo:

```text
architecture/SECURITY_ARCHITECTURE.md
```

Trust boundaries:

```text
client -> Gateway;

Gateway -> OS API;

service -> broker;

service -> database;

worker -> provider;

operator -> admin tool;

pipeline -> registry;

runtime -> secret manager.
```

Controles:

- OIDC para humanos;
- workload identity para serviços;
- tenant derivado de claim confiável;
- autorização por action e resource;
- mTLS ou canal protegido;
- least privilege;
- secrets curtos;
- audit;
- supply chain;
- rate limiting;
- input validation.

---

### 16. Definir autorização crítica

Exemplo:

```text
COMPLETE_ACTIVITY
```

Requer:

- principal autenticado;
- tenant igual ao recurso;
- técnico atribuído ou supervisor;
- atividade em estado permitido;
- checklist completo;
- evidências obrigatórias;
- janela válida;
- policy version;
- audit.

---

### 17. Proteger multi-tenancy

Regras:

```text
tenant context obrigatório;

tenant nunca confiado
apenas no payload;

queries filtradas;

keys incluem tenant;

cache inclui tenant;

idempotency inclui tenant;

events incluem tenant;

logs não expõem tenant bruto
quando desnecessário;

testes cross-tenant obrigatórios.
```

---

### 18. Criar arquitetura de observabilidade

Arquivo:

```text
architecture/OBSERVABILITY_ARCHITECTURE.md
```

Jornadas críticas:

```text
Create Work Order;

Schedule Activity;

Execute Activity;

Complete Work Order.
```

Sinais:

- journey started;
- journey completed;
- journey failed;
- step duration;
- saga state;
- outbox age;
- inbox duplicate count;
- consumer lag;
- integration error;
- manual intervention;
- cross-tenant denial;
- compensation count.

---

### 19. Definir SLOs

Exemplos:

```text
Create Work Order:
99,5% sucesso em 30 dias;
p95 <= 800 ms.

Read Work Order:
99,9%;
p95 <= 500 ms.

Schedule Activity:
99,0%;
p95 <= 3 segundos.

Complete Activity:
99,5%;
p95 <= 2 segundos.

Event propagation:
99% <= 60 segundos.
```

---

### 20. Controlar cardinalidade

Labels permitidas:

```text
service;

operation;

journey;

step;

outcome;

environment;

release.
```

Labels proibidas:

```text
work_order_id;

activity_id;

customer_id;

provider_id;

tenant_id;

trace_id;

exception_message.
```

---

### 21. Criar alertas

Alertas:

```text
Work Order Create SLO Burn;

Scheduling Saga Stuck;

Outbox Age High;

Consumer Lag High;

Capacity Error Rate High;

Cross-Tenant Attempt Detected;

Manual Intervention Backlog;

Checklist Completion Failure;

Event Compatibility Failure.
```

Cada alerta possui owner, dashboard, runbook e recovery.

---

### 22. Criar política de resiliência

Arquivo:

```text
architecture/RESILIENCE_POLICY.md
```

Por integração:

- timeout;
- retry;
- backoff;
- jitter;
- circuit breaker;
- bulkhead;
- fallback;
- idempotency;
- recovery;
- observability.

---

### 23. Evitar retry inadequado

Não retry automático para:

- validação;
- autorização;
- conflito de estado;
- payload incompatível;
- regra de negócio.

Retry possível para:

- timeout transitório;
- indisponibilidade;
- erro de rede;
- rate limit com policy;
- publish failure.

---

### 24. Criar deployment model

Arquivo:

```text
architecture/DEPLOYMENT_MODEL.md
```

Ambientes:

```text
development;

integration;

homologation;

production.
```

Deploy units iniciais:

```text
OS API;

Order Management;

Scheduling;

Field Execution;

Compensation Worker;

Communication Worker;

Integration Gateway.
```

Infra:

- PostgreSQL por ownership lógico;
- broker;
- object storage;
- secret manager;
- telemetry collector;
- API Gateway;
- registry.

---

### 25. Definir isolamento de deploy

Nem todo bounded context precisa de serviço separado.

Agrupe quando:

- equipe é a mesma;
- escala é semelhante;
- deploy separado não traz valor;
- acoplamento operacional seria alto.

Separe quando:

- carga é distinta;
- risco é distinto;
- ownership é distinto;
- lifecycle é distinto;
- dependência externa exige isolamento;
- falha precisa ser contida.

---

### 26. Criar rollout e migração

Arquivo:

```text
architecture/ROLLOUT_AND_MIGRATION.md
```

Fases:

```text
0. baseline;

1. contracts e observability;

2. shadow read;

3. dual write controlado;

4. backfill;

5. canary por tenant;

6. expandir trafego;

7. remover write legado;

8. validar reconciliacao;

9. cleanup;

10. deprecar contrato antigo.
```

---

### 27. Definir rollback

Rollback deve responder:

- qual versão retorna;
- como dados novos são tratados;
- como eventos são reprocessados;
- como feature flag desativa;
- como dual write é encerrado;
- como estado é reconciliado;
- quem autoriza;
- qual evidência prova recuperação.

---

### 28. Criar Rollout Gate

```java
package br.com.formacao.osarchitecture.rollout;

import java.util.List;

public record RolloutGate(
        String stage,
        List<String> entryCriteria,
        List<String> exitCriteria,
        List<String> stopConditions,
        String owner) {

    public RolloutGate {
        entryCriteria = List.copyOf(entryCriteria);
        exitCriteria = List.copyOf(exitCriteria);
        stopConditions = List.copyOf(stopConditions);
    }
}
```

---

### 29. Definir stop conditions

Exemplos:

```text
cross-tenant finding > 0;

error budget burn acima do limite;

double reservation > 0;

reconciliation mismatch > 0,1%;

manual intervention acima do budget;

p95 acima de 3 segundos;

event lag acima de 5 minutos.
```

---

### 30. Criar catálogo de runbooks

Arquivo:

```text
architecture/RUNBOOK_CATALOG.md
```

Runbooks:

```text
Scheduling Saga Stuck;

Outbox Lag;

Inbox Duplicate Spike;

Capacity Provider Down;

Evidence Upload Failure;

Cross-Tenant Denial Spike;

Compensation Backlog;

Event Schema Incompatibility;

Rollback OS Platform;

Manual Reconciliation.
```

---

### 31. Testar runbooks

Cada runbook precisa de:

- sintoma;
- impacto;
- dashboard;
- queries;
- diagnóstico;
- ação segura;
- ação destrutiva marcada;
- rollback;
- escalation;
- recovery;
- evidence.

Execute game day para pelo menos três runbooks.

---

### 32. Criar fitness functions

Arquivo:

```text
architecture/FITNESS_FUNCTION_CATALOG.md
```

Fitness functions:

```text
FF-001:
zero cross-context database write.

FF-002:
zero cross-tenant access.

FF-003:
100% de eventos com owner e schema.

FF-004:
100% de APIs críticas com idempotência.

FF-005:
zero metric label de alta cardinalidade.

FF-006:
100% de serviços críticos com SLO e runbook.

FF-007:
100% de migrations com rollback.

FF-008:
zero ADR accepted sem implementation link.

FF-009:
zero exception expirada.

FF-010:
C4 sem container órfão.
```

---

### 33. Criar policy ArchUnit

Arquivo:

```text
architecture/ARCHUNIT_POLICY.md
```

Regras:

```text
domain não depende de adapter;

context A não importa domain de B;

application depende de ports;

adapters implementam ports;

JPA não aparece em domain;

controllers não acessam repositories;

contexts não compartilham entity;

security vendor não entra no domain;

telemetry vendor não entra no domain.
```

---

### 34. Implementar regra de isolamento

```java
package br.com.formacao.osarchitecture.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

public class ContextIsolationTest {

    @ArchTest
    static final ArchRule schedulingMustNotDependOnFieldDomain =
            noClasses()
                    .that()
                    .resideInAPackage(
                            "..scheduling..domain..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage(
                            "..fieldexecution..domain..");
}
```

---

### 35. Finalizar ADRs

Arquivo:

```text
architecture/FINAL_ADR_CATALOG.md
```

Status esperado:

```text
ADR-001:
ACCEPTED.

ADR-002:
ACCEPTED.

ADR-003:
ACCEPTED.

ADR-004:
ACCEPTED_WITH_REVIEW_TRIGGER.

ADR-005:
ACCEPTED.

ADR-006:
ACCEPTED.

ADR-007:
ACCEPTED_AS_INITIAL_STAGE.

ADR-008:
ACCEPTED.
```

Cada ADR possui:

- contexto;
- opções;
- decisão;
- consequências;
- evidência;
- implementação;
- owner;
- trigger;
- supersession policy.

---

### 36. Criar trade-offs finais

Arquivo:

```text
architecture/FINAL_TRADE_OFFS.md
```

Trade-offs:

```text
mais boundaries
vs
mais custo operacional;

eventual consistency
vs
UX imediata;

isolamento de tenant
vs
complexidade;

mensageria
vs
debug distribuído;

separação de bancos
vs
queries corporativas;

golden paths
vs
flexibilidade;

feature flags
vs
código transitório;

observabilidade profunda
vs
custo.
```

---

### 37. Criar perguntas finais abertas

Arquivo:

```text
architecture/FINAL_OPEN_QUESTIONS.md
```

Perguntas aceitáveis:

```text
qual volume real de fotos?

qual SLA contratual por cliente?

qual estratégia offline?

qual isolamento físico de tenants premium?

qual provedor de mensageria?

qual modelo de cobrança?

qual retenção legal de evidências?

qual tecnologia de workflow?
```

Pergunta aberta não invalida a arquitetura quando:

- impacto é conhecido;
- owner existe;
- prazo existe;
- decisão está isolada;
- fallback existe.

---

### 38. Criar Architecture Defense Pack

Arquivo:

```text
architecture/ARCHITECTURE_DEFENSE_PACK.md
```

Estrutura:

```text
1. problema;

2. objetivos;

3. não objetivos;

4. capacidades;

5. journeys;

6. bounded contexts;

7. C4;

8. autoridade de dados;

9. APIs e eventos;

10. consistência;

11. segurança;

12. observabilidade;

13. resiliência;

14. deploy;

15. rollout;

16. riscos;

17. ADRs;

18. fitness functions;

19. evidências;

20. open questions.
```

---

### 39. Criar claims arquiteturais

Claims:

```text
a dupla reserva e impedida
pela autoridade local de Capacity.

cross-tenant access e bloqueado
por tenant context,
authorization
e testes negativos.

falha de Communication
nao bloqueia conclusao.

eventos duplicados
nao causam efeitos duplicados.

rollout pode ser interrompido
sem perda irreversivel.
```

Cada claim precisa de evidência.

---

### 40. Criar Architecture Claim

```java
package br.com.formacao.osarchitecture.defense;

import java.util.List;

public record ArchitectureClaim(
        String claimId,
        String statement,
        List<ArchitectureEvidence> evidence,
        List<String> limitations,
        String owner) {

    public ArchitectureClaim {
        evidence = List.copyOf(evidence);
        limitations = List.copyOf(limitations);
    }
}
```

---

### 41. Preparar perguntas de defesa

Perguntas:

```text
por que estes bounded contexts?

por que não um monólito modular?

por que mensageria?

quem é autoridade de Activity?

como evitar dupla reserva?

como tratar timeout ambíguo?

como impedir cross-tenant?

como reprocessar evento?

como detectar drift?

como fazer rollback?

qual maior risco residual?

qual decisão você mudaria
com dez vezes mais volume?
```

---

### 42. Responder com estrutura

Formato:

```text
decisão;

contexto;

alternativas;

evidência;

trade-off;

limitação;

trigger de revisão.
```

Evite respostas baseadas apenas em preferência.

---

### 43. Criar rastreabilidade final

Arquivo:

```text
architecture/FINAL_TRACEABILITY_MAP.md
```

Exemplo:

```text
J-005 Execute Activity
-> BC Field Execution
-> API complete execution
-> Event ActivityExecutionCompletedV1
-> Data Checklist Answer
-> QA Security and Audit
-> SLO Complete Activity
-> Runbook Checklist Failure
-> ADR-003
-> FF-002
-> Evidence E-021.
```

---

### 44. Testar contrato HTTP

Casos:

- campo opcional adicionado;
- campo removido;
- erro novo;
- versão antiga;
- idempotency conflict;
- tenant mismatch.

O breaking change sem versão deve falhar.

---

### 45. Testar contrato de evento

Casos:

- campo opcional;
- campo obrigatório;
- sem owner;
- sem version;
- PII sem classificação;
- ordering key alterada;
- consumer incompatível.

---

### 46. Testar consistência

Cenários:

- reserva concorrente;
- conclusão duplicada;
- cancelamento durante execução;
- late reply;
- out-of-order event;
- stale dashboard;
- recovery após timeout.

---

### 47. Testar idempotência

Reenvie:

```text
POST complete activity;

ActivityExecutionCompletedV1;

CompensationCalculatedV1;

CustomerNotificationRequestedV1.
```

Valide zero efeito duplicado.

---

### 48. Testar segurança

Cenários:

- tenant A acessa tenant B;
- workload de Communication acessa banco de Order;
- token expirado;
- scope insuficiente;
- secret no log;
- mensagem de producer indevido;
- upload excessivo.

---

### 49. Testar observabilidade

Valide:

- trace da jornada;
- correlation;
- step duration;
- outcome;
- release;
- alert;
- dashboard;
- runbook;
- sem label proibida.

---

### 50. Testar rollout

Cenários:

- canary saudável;
- error budget acelera;
- reconciliation diverge;
- rollback;
- replay;
- cleanup pendente;
- contrato antigo ainda consumido.

---

### 51. Criar reports finais

Exemplo:

```yaml
osArchitectureFinal:
  APIs:
    total:
      12
    critical:
      7
    withIdempotency:
      7
    breaking:
      0

  events:
    total:
      14
    withOwner:
      14
    compatible:
      14

  consistency:
    operations:
      11
    explicitDecisions:
      11

  security:
    crossTenantFailures:
      0
    secretFindings:
      0

  observability:
    criticalJourneys:
      4
    traceable:
      4
    forbiddenLabels:
      0

  rollout:
    stages:
      10
    rollbackReady:
      true

  fitnessFunctions:
    total:
      10
    passing:
      10

  gate:
    PASS
```

---

### 52. Criar evidence final

Arquivo:

```text
contracts/os-architecture-final-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- API count;
- critical API count;
- idempotent critical API count;
- breaking API count;
- event count;
- event owner coverage;
- event compatibility status;
- consistency operation count;
- explicit consistency coverage;
- duplicated authority count;
- cross-tenant test status;
- secret finding count;
- critical journey count;
- traceable journey count;
- forbidden metric label count;
- resilience policy count;
- runbook count;
- tested runbook count;
- rollout stage count;
- rollback readiness;
- fitness function count;
- passing fitness function count;
- ArchUnit status;
- accepted ADR count;
- claim evidence coverage;
- architecture defense status;
- documentation status;
- final gate status;
- timestamp.

Não inclua:

- dados reais;
- clientes reais;
- topologia real;
- endpoints privados;
- credentials;
- tokens;
- payloads;
- incidentes reais;
- valores contratuais;
- conteúdo da revisão da aula 666.

---

### 53. Criar o Gate final

O gate valida:

- APIs;
- events;
- schemas;
- consistency;
- idempotency;
- security;
- observability;
- resilience;
- deployment;
- rollout;
- rollback;
- runbooks;
- fitness functions;
- ArchUnit;
- ADRs;
- claims;
- trade-offs;
- traceability;
- evidence;
- defense pack.

Status:

```text
PASS;

FAIL_API_CONTRACT;

FAIL_EVENT_CONTRACT;

FAIL_SCHEMA_EVOLUTION;

FAIL_CONSISTENCY;

FAIL_IDEMPOTENCY;

FAIL_SECURITY;

FAIL_MULTI_TENANCY;

FAIL_OBSERVABILITY;

FAIL_RESILIENCE;

FAIL_DEPLOYMENT;

FAIL_ROLLOUT;

FAIL_ROLLBACK;

FAIL_RUNBOOK;

FAIL_FITNESS_FUNCTION;

FAIL_ARCHUNIT;

FAIL_ADR;

FAIL_CLAIM_EVIDENCE;

FAIL_TRACEABILITY;

FAIL_DEFENSE_PACK;

INCONCLUSIVE.
```

---

### 54. Executar validação completa

```powershell
.\scripts\m19\os-architecture-project-part-two\validate-API-contracts.ps1

.\scripts\m19\os-architecture-project-part-two\validate-event-contracts.ps1

.\scripts\m19\os-architecture-project-part-two\validate-schema-evolution.ps1

.\scripts\m19\os-architecture-project-part-two\validate-consistency-matrix.ps1

.\scripts\m19\os-architecture-project-part-two\validate-idempotency-strategy.ps1

.\scripts\m19\os-architecture-project-part-two\validate-security-architecture.ps1

.\scripts\m19\os-architecture-project-part-two\validate-observability-architecture.ps1

.\scripts\m19\os-architecture-project-part-two\validate-resilience-policy.ps1

.\scripts\m19\os-architecture-project-part-two\validate-deployment-model.ps1

.\scripts\m19\os-architecture-project-part-two\validate-rollout-plan.ps1

.\scripts\m19\os-architecture-project-part-two\validate-runbook-catalog.ps1

.\scripts\m19\os-architecture-project-part-two\validate-fitness-functions.ps1

.\scripts\m19\os-architecture-project-part-two\run-os-architecture-final-tests.ps1

.\scripts\m19\os-architecture-project-part-two\collect-os-architecture-final-evidence.ps1

.\scripts\m19\os-architecture-project-part-two\verify-os-architecture-final-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 55. Encerrar o projeto

Confirme:

- APIs;
- events;
- schemas;
- consistency matrix;
- idempotency;
- Saga;
- Outbox;
- Inbox;
- security;
- multi-tenancy;
- observability;
- SLOs;
- cardinality;
- alerts;
- resilience;
- deployment;
- rollout;
- rollback;
- runbooks;
- fitness functions;
- ArchUnit;
- final ADRs;
- trade-offs;
- open questions;
- defense pack;
- traceability;
- reports;
- evidence;
- final gate aprovado.

---

## Entendendo o que foi feito

### O desenho virou contrato

APIs e eventos deixaram de ser caixas abstratas.

Ganharam owner, versão, segurança, compatibilidade, idempotência, SLO e lifecycle.

### A consistência virou explícita

Cada operação passou a declarar autoridade, nível de consistência, propagação, conflito e recuperação.

### A segurança atravessou o sistema

Human identities, workloads, tenants, broker, bancos, secrets, uploads e pipelines passaram a fazer parte do desenho.

### A observabilidade virou uma propriedade da jornada

O projeto passou a responder onde a OS falhou, qual step atrasou, qual release impactou e qual runbook deve ser executado.

### O rollout entrou na solução

Coexistência, canary, backfill, dual write, reconciliation, stop conditions e rollback foram modelados.

### As decisões ganharam defesa

Claims, evidências, limitações e triggers transformaram opinião em argumento arquitetural.

---

## Erros comuns importantes

### Tratar contrato como DTO

Faltam owner, versão, erros, segurança e lifecycle.

### Aplicar retry sem idempotência

A falha transitória vira efeito duplicado.

### Usar consistência eventual sem UX

O usuário recebe estado enganoso.

### Confiar apenas no Gateway

Serviços, mensagens e bancos continuam expostos.

### Adicionar IDs em métricas

Cardinalidade explode.

### Criar canary sem stop condition

O rollout continua mesmo com dano.

### Criar rollback sem dados

Versão anterior pode não compreender o novo estado.

### Criar runbook sem game day

O procedimento pode falhar no incidente.

### Aprovar ADR sem claim e evidence

A decisão continua baseada em preferência.

### Usar tecnologia como defesa

Kafka ou Kubernetes não explicam boundaries, autoridade e trade-offs.

### Antecipar a revisão

A análise crítica mais ampla será feita na aula 666.

---

## Comandos úteis

### Validar contratos

```powershell
.\scripts\m19\os-architecture-project-part-two\validate-API-contracts.ps1

.\scripts\m19\os-architecture-project-part-two\validate-event-contracts.ps1
```

### Validar consistência

```powershell
.\scripts\m19\os-architecture-project-part-two\validate-consistency-matrix.ps1
```

### Validar segurança

```powershell
.\scripts\m19\os-architecture-project-part-two\validate-security-architecture.ps1
```

### Validar rollout

```powershell
.\scripts\m19\os-architecture-project-part-two\validate-rollout-plan.ps1
```

### Executar testes finais

```powershell
.\scripts\m19\os-architecture-project-part-two\run-os-architecture-final-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\os-architecture-project-part-two\verify-os-architecture-final-gate.ps1
```

---

## Exercício guiado

Defenda a decisão:

```text
Field Execution
deve ser um deploy separado
de Order Management?
```

Sua resposta deve conter:

1. contexto;
2. alternativas;
3. workload;
4. ownership;
5. failure isolation;
6. security;
7. dados;
8. deploy;
9. custo;
10. observabilidade;
11. rollout;
12. evidência;
13. limitação;
14. trigger de revisão.

Não responda apenas:

```text
sim,
porque microservicos escalam.
```

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 664 e ponte para a aula 666 foram preservadas;
- contrato da Parte 2 foi criado;
- API Contract Catalog foi criado;
- APIs possuem owner, authorization, errors, SLO, version e deprecation;
- idempotência HTTP foi definida;
- Event Contract Catalog foi criado;
- eventos possuem owner, schema, version, ordering e consumers;
- Schema Evolution Policy foi criada;
- breaking changes foram bloqueadas;
- Consistency Matrix foi criada;
- consistência foi definida por operação;
- Saga de agendamento foi detalhada;
- Outbox e Inbox foram definidos;
- Idempotency Strategy foi criada;
- conflito de chave foi tratado;
- Security Architecture foi criada;
- trust boundaries foram mapeados;
- autorização crítica foi definida;
- multi-tenancy foi protegido;
- Observability Architecture foi criada;
- jornadas críticas foram definidas;
- SLOs foram definidos;
- cardinalidade foi controlada;
- alertas possuem owner, dashboard e runbook;
- Resilience Policy foi criada;
- retries inadequados foram proibidos;
- Deployment Model foi criado;
- bounded context não foi confundido com deploy;
- Rollout and Migration foi criado;
- rollback foi detalhado;
- stop conditions foram definidas;
- Runbook Catalog foi criado;
- runbooks foram testados;
- Fitness Function Catalog foi criado;
- ArchUnit Policy foi criada;
- isolamento entre contexts foi testado;
- ADRs foram finalizados;
- Final Trade-offs foi criado;
- perguntas abertas possuem owner;
- Architecture Defense Pack foi criado;
- claims possuem evidências;
- perguntas de defesa foram preparadas;
- Final Traceability Map foi criado;
- contratos, consistência, idempotência, segurança, observabilidade e rollout foram testados;
- reports, evidence e gate final foram criados;
- commit recomendado e diário de bordo estão presentes;
- a revisão ampla da aula 666 não foi antecipada.

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
  labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project `
  scripts/m19/os-architecture-project-part-two `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|realProvider|realEndpoint|productionTopology|privateContract|realIncident"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): concluir projeto de arquitetura de OS"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- clientes reais;
- prestadores reais;
- endpoints privados;
- contratos reais;
- credenciais;
- topologia real;
- dados pessoais;
- incidentes reais;
- conteúdo da revisão da aula 666.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu o projeto de arquitetura de Ordens de Serviço.

Você criou:

```text
API Contract Catalog;

Event Contract Catalog;

Schema Evolution Policy;

Consistency Matrix;

Idempotency Strategy;

Security Architecture;

Observability Architecture;

Resilience Policy;

Deployment Model;

Rollout and Migration;

Runbook Catalog;

Fitness Function Catalog;

ArchUnit Policy;

Final ADR Catalog;

Final Trade-offs;

Final Open Questions;

Architecture Defense Pack;

Final Traceability Map;

reports, evidence e final gate.
```

Você conectou boundaries, APIs, eventos, schemas, dados, consistência, idempotência, segurança, multi-tenancy, observabilidade, resiliência, deploy, rollout, rollback, operação, fitness functions, decisões e evidências.

O projeto deixou de ser uma lista de tecnologias.

Ele passou a ser uma solução arquitetural defensável.

A próxima aula será:

```text
666 - M19.56 - Revisao arquitetura parte 1
```

Nela, você revisará criticamente a arquitetura construída no módulo, identificando lacunas, inconsistências, riscos residuais, decisões frágeis, documentação divergente e evidências insuficientes.

Nenhuma revisão ampla do M19 foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei APIs e eventos.
- [ ] Defini schema evolution.
- [ ] Modelei consistência.
- [ ] Apliquei idempotência.
- [ ] Modelei segurança.
- [ ] Modelei observabilidade.
- [ ] Criei resiliência.
- [ ] Defini deployment.
- [ ] Criei rollout e rollback.
- [ ] Testei runbooks.
- [ ] Criei fitness functions.
- [ ] Preparei defesa e evidence.

---

## Troubleshooting adicional

### A API precisa de dez operações genéricas

Revise linguagem e use cases. APIs genéricas podem esconder responsabilidades.

### O evento muda toda semana

O boundary ou a semântica ainda não estão maduros.

### A mesma entidade aparece em vários bancos

Várias representações são aceitáveis; vários writers não.

### A Saga não termina

Revise deadlines, state machine, replies tardios, reconciliation e manual intervention.

### O retry cria duplicidade

Falta idempotency scope ou Inbox.

### O trace não conecta consumer

Revise propagação de contexto na mensagem.

### O rollout depende de migração instantânea

Introduza compatibilidade, expand-contract, backfill e canary.

### O rollback não funciona

Revise schema, eventos novos, flags e estado persistido.

### O runbook exige acesso inexistente

Teste permissões em game day.

### O claim não possui evidência

Classifique como hipótese ou produza teste.

### A equipe quer revisar todo o módulo agora

Preserve a revisão estruturada para a aula 666.

---

## Perguntas de revisão

1. O que transforma API em contrato?
2. O que transforma evento em contrato?
3. O que é schema evolution?
4. Qual mudança costuma ser breaking?
5. Por que consistência é definida por operação?
6. Onde a reserva deve ser forte?
7. Onde eventual consistency é adequada?
8. O que Outbox resolve?
9. O que Inbox resolve?
10. Qual escopo de idempotência HTTP?
11. Como proteger multi-tenancy?
12. Por que workload identity é necessária?
13. O que deve ser observado em uma jornada?
14. Por que IDs não são metric labels?
15. O que uma resilience policy contém?
16. Quando retry não deve ocorrer?
17. Bounded context é deploy unit?
18. O que é rollout gate?
19. O que é stop condition?
20. Por que testar runbook?
21. O que é fitness function?
22. O que ArchUnit protege?
23. O que é architecture claim?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Owner, schema, version, security, errors e lifecycle.
2. Semântica, owner, schema, version, consumers e ordering.
3. Política de mudança compatível.
4. Remover ou mudar significado de campo.
5. Porque risco e autoridade variam.
6. Na autoridade de Capacity.
7. Propagação, dashboards e comunicação.
8. Publicação confiável após transação local.
9. Deduplicação do consumer.
10. Tenant, operação e chave.
11. Tenant confiável, autorização, queries e testes.
12. Para identificar e limitar serviços.
13. Steps, outcome, latência, estado e falhas.
14. Porque geram alta cardinalidade.
15. Timeout, retry, circuit, bulkhead e recovery.
16. Em erro de negócio, autorização ou validação.
17. Não.
18. Critérios para avançar ou parar.
19. Condição que interrompe rollout.
20. Para validar ação e recovery.
21. Regra que mede propriedade arquitetural.
22. Dependências e boundaries no código.
23. Afirmação arquitetural sustentada por evidence.
24. Revisão arquitetura parte 1.
25. Revisão arquitetura parte 1.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 665 - M19.55 - Projeto arquitetura OS parte 2

- Continuei o projeto iniciado na aula 664.
- Criei o contrato da Parte 2.
- Criei API Contract Catalog.
- Defini owner, authorization, errors, SLO, version e deprecation.
- Modelei idempotência HTTP.
- Criei Event Contract Catalog.
- Defini owner, schema, version, ordering e consumers.
- Criei Schema Evolution Policy.
- Bloqueei breaking changes incompatíveis.
- Criei Consistency Matrix.
- Defini consistência por operação.
- Detalhei a Saga de agendamento.
- Modelei Outbox e Inbox.
- Criei Idempotency Strategy.
- Tratei conflito de chave.
- Criei Security Architecture.
- Mapeei trust boundaries.
- Defini autorização crítica.
- Protegi multi-tenancy.
- Criei Observability Architecture.
- Defini jornadas críticas e SLOs.
- Controlei cardinalidade.
- Criei alertas e runbooks.
- Criei Resilience Policy.
- Diferenciei retries técnicos e erros de negócio.
- Criei Deployment Model.
- Evitei confundir bounded context e deploy.
- Criei Rollout and Migration.
- Modelei canary, backfill, stop conditions e rollback.
- Criei Runbook Catalog.
- Testei runbooks em game days.
- Criei Fitness Function Catalog.
- Criei ArchUnit Policy.
- Testei isolamento entre contexts.
- Finalizei ADRs.
- Criei Final Trade-offs e Final Open Questions.
- Criei Architecture Defense Pack.
- Criei claims e evidências.
- Criei Final Traceability Map.
- Executei testes finais.
- Criei reports, evidence e final gate.
- Não antecipei a revisão ampla do M19.
- Próxima aula: Revisao arquitetura parte 1.
```

---

## Referência técnica curta

- API Contract.
- Event Contract.
- Schema Evolution.
- Consistency Matrix.
- Saga.
- Outbox.
- Inbox.
- Idempotency.
- Security Architecture.
- Multi-Tenancy.
- Observability Architecture.
- SLO.
- Resilience Policy.
- Deployment Model.
- Rollout Gate.
- Runbook.
- Fitness Function.
- ArchUnit.
- Architecture Claim.
- Defense Pack.

Regra final:

```text
A Parte 2 do projeto de arquitetura de Ordens de Serviço deve transformar o desenho inicial em uma solução verificável e defensável: APIs possuem owner, autorização, erros, idempotência, SLO, versão e depreciação, eventos possuem semântica, schema, owner, ordering, consumers e classificação, schema evolution bloqueia mudanças incompatíveis, e a Consistency Matrix define autoridade, nível, propagação, conflito e recovery por operação; reservas são fortes na autoridade de Capacity, propagação entre contexts é eventual, Sagas coordenam efeitos distribuídos, Outbox garante publicação, Inbox deduplica consumers e idempotency scopes cobrem HTTP, mensagens, saga steps, providers, batches e reparos; segurança usa identidade humana e de workload, tenant confiável, autorização contextual, least privilege, secrets, broker protegido, audit e supply chain, observabilidade acompanha journeys, steps, outcomes, saga states, outbox age, lag, compensações e intervenções com SLOs, alertas e cardinalidade bounded, e resilience policies definem timeout, retry, backoff, circuit breaker, bulkhead, fallback e recovery; deployment respeita ownership e failure isolation sem criar um serviço por context, rollout usa baseline, shadow read, dual write, backfill, canary, reconciliation, stop conditions, rollback e cleanup, runbooks são testados em game days, fitness functions e ArchUnit verificam boundaries, segurança, contratos, SLOs, migrations e documentação, ADRs conectam decisão e implementação, claims conectam afirmações e evidence, e o final gate termina com contracts, consistency, idempotency, security, observability, resilience, deploy, rollout, runbooks, fitness functions, ADRs, traceability, defense pack, reports e evidence aprovados, enquanto a revisão crítica ampla permanece reservada para a aula 666.
```
