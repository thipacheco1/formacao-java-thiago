# 664 - M19.54 - Projeto arquitetura OS parte 1

## Apresentação da aula

Na aula 663, você aprofundou documentação arquitetural viva.

Você transformou C4, ADRs, RFCs, contratos, runbooks, SLOs, standards, policies, reports e evidence em um sistema de conhecimento versionado, rastreável, validável e conectado ao código, ao deploy e à operação.

Agora chegou o momento de reunir tudo o que foi construído no M19 em um projeto aplicado.

O domínio será:

```text
gestão de Ordens de Serviço.
```

Uma Ordem de Serviço, ou OS, representa uma demanda operacional que precisa ser recebida, validada, planejada, atribuída, executada, acompanhada, comprovada e encerrada.

Esse tipo de domínio aparece em:

- montagem;
- manutenção;
- instalação;
- assistência técnica;
- telecomunicações;
- energia;
- facilities;
- logística;
- serviços em campo;
- atendimento residencial;
- atendimento corporativo.

Apesar de parecer apenas um fluxo de status, uma plataforma de OS reúne problemas arquiteturais complexos:

- múltiplos canais de entrada;
- regras diferentes por cliente;
- produtos e serviços;
- janelas de atendimento;
- capacidade territorial;
- técnicos e prestadores;
- agendamento;
- checklists;
- fotos e evidências;
- pagamentos;
- mensageria;
- integrações externas;
- auditoria;
- dados pessoais;
- execução offline;
- conflitos;
- reprocessamento;
- indicadores;
- SLA;
- multi-tenancy;
- observabilidade;
- segurança;
- consistência eventual.

O erro clássico é começar por uma tabela chamada `ordem_servico` e uma API CRUD.

Isso produz um modelo que concentra responsabilidades, mistura contextos, espalha regras e cria dependências difíceis de evoluir.

O projeto arquitetural começará por perguntas:

```text
qual problema a plataforma resolve?

quais capacidades existem?

quem toma cada decisão?

quais dados são autoritativos?

quais jornadas são críticas?

quais boundaries precisam existir?

quais integrações são síncronas?

quais eventos são necessários?

quais riscos são inaceitáveis?

quais evidências provarão a arquitetura?
```

A Parte 1 será dedicada à descoberta, ao framing e ao desenho inicial.

O laboratório será:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project
```

Você criará:

- Project Charter;
- Problem Statement;
- atores e stakeholders;
- jornadas;
- catálogo de capacidades;
- mapa de domínio;
- bounded contexts;
- context map;
- requisitos funcionais;
- requisitos de qualidade;
- premissas e restrições;
- C4 System Context;
- C4 Container inicial;
- matriz de autoridade de dados;
- mapa de integrações;
- catálogo inicial de eventos;
- threat and risk register;
- ADRs iniciais;
- roadmap para a Parte 2;
- reports, evidence e gate.

A próxima aula será:

```text
665 - M19.55 - Projeto arquitetura OS parte 2
```

A Parte 2 irá aprofundar APIs, eventos, dados, segurança, observabilidade, decisões operacionais, rollout, testes arquiteturais, documentação viva e defesa da solução.

Nesta aula, você não implementará o sistema inteiro.

O objetivo é construir uma base arquitetural defensável.

Regra central:

```text
um projeto de arquitetura
nao comeca por tecnologia;

comeca por problema,
capacidades,
decisoes,
riscos,
boundaries
e evidencias.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
661:
Arquitetura corporativa brasileira.

662:
Governanca tecnica leve.

663:
Documentacao arquitetural viva.

664:
Projeto arquitetura OS parte 1.

665:
Projeto arquitetura OS parte 2.
```

A progressão é:

```text
organizar arquitetura em escala;

governar decisões;

manter conhecimento vivo;

aplicar o método em um domínio realista;

completar e defender a solução.
```

O projeto de OS será uma síntese do M19.

Você reutilizará:

- DDD;
- bounded contexts;
- context map;
- arquitetura hexagonal;
- C4;
- ADR;
- RFC;
- sistemas distribuídos;
- CAP;
- PACELC;
- idempotência;
- multi-tenancy;
- resiliência;
- observabilidade;
- segurança;
- dados;
- governança;
- documentação viva.

A aula não pretende criar uma resposta universal.

O objetivo é ensinar um processo de decisão.

Duas equipes podem criar arquiteturas diferentes e ambas serem válidas, desde que:

- o problema esteja claro;
- os boundaries sejam coerentes;
- as responsabilidades estejam explícitas;
- os riscos tenham tratamento;
- os trade-offs sejam reconhecidos;
- as evidências sustentem a decisão;
- a solução seja operável e evolutiva.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-664-projeto-arquitetura-os-parte-1
└── os-architecture-project
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/osarchitecture
    │   │           ├── project
    │   │           │   ├── ArchitectureProject.java
    │   │           │   ├── ProjectObjective.java
    │   │           │   ├── ProjectConstraint.java
    │   │           │   └── ProjectScope.java
    │   │           ├── capability
    │   │           │   ├── BusinessCapability.java
    │   │           │   ├── CapabilityType.java
    │   │           │   ├── CapabilityOwner.java
    │   │           │   └── CapabilityCatalog.java
    │   │           ├── domain
    │   │           │   ├── DomainArea.java
    │   │           │   ├── SubdomainType.java
    │   │           │   ├── BoundedContextCandidate.java
    │   │           │   └── DomainMap.java
    │   │           ├── journey
    │   │           │   ├── BusinessJourney.java
    │   │           │   ├── JourneyStep.java
    │   │           │   ├── JourneyCriticality.java
    │   │           │   └── JourneyCatalog.java
    │   │           ├── quality
    │   │           │   ├── QualityAttributeScenario.java
    │   │           │   ├── QualityAttribute.java
    │   │           │   ├── QualityMeasure.java
    │   │           │   └── QualityCatalog.java
    │   │           ├── data
    │   │           │   ├── DataAuthority.java
    │   │           │   ├── DataOwnership.java
    │   │           │   ├── DataClassification.java
    │   │           │   └── DataAuthorityMatrix.java
    │   │           ├── integration
    │   │           │   ├── IntegrationBoundary.java
    │   │           │   ├── IntegrationMode.java
    │   │           │   ├── IntegrationRisk.java
    │   │           │   └── IntegrationCatalog.java
    │   │           ├── decision
    │   │           │   ├── ArchitectureDecision.java
    │   │           │   ├── DecisionStatus.java
    │   │           │   ├── DecisionEvidence.java
    │   │           │   └── DecisionCatalog.java
    │   │           └── gate
    │   │               ├── OsArchitecturePartOneGate.java
    │   │               ├── GateFinding.java
    │   │               └── GateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/osarchitecture
    │               ├── capability
    │               │   ├── CapabilityOwnershipTest.java
    │               │   └── CapabilityCoverageTest.java
    │               ├── domain
    │               │   ├── BoundedContextResponsibilityTest.java
    │               │   └── SharedModelRiskTest.java
    │               ├── quality
    │               │   ├── QualityAttributeScenarioTest.java
    │               │   └── MeasurableQualityRequirementTest.java
    │               ├── data
    │               │   ├── DataAuthorityTest.java
    │               │   └── CrossContextWriteTest.java
    │               └── architecture
    │                   ├── ProjectScopeTest.java
    │                   ├── DecisionTraceabilityTest.java
    │                   ├── PartTwoNonAnticipationTest.java
    │                   └── ArchitectureGateTest.java
    ├── architecture
    │   ├── PROJECT_CHARTER.md
    │   ├── PROBLEM_STATEMENT.md
    │   ├── SCOPE.md
    │   ├── ACTOR_CATALOG.md
    │   ├── STAKEHOLDER_MAP.md
    │   ├── BUSINESS_JOURNEYS.md
    │   ├── CAPABILITY_MAP.md
    │   ├── DOMAIN_MAP.md
    │   ├── BOUNDED_CONTEXT_CANDIDATES.md
    │   ├── CONTEXT_MAP.md
    │   ├── FUNCTIONAL_REQUIREMENTS.md
    │   ├── QUALITY_ATTRIBUTE_SCENARIOS.md
    │   ├── ASSUMPTIONS_AND_CONSTRAINTS.md
    │   ├── C4_SYSTEM_CONTEXT.md
    │   ├── C4_CONTAINER.md
    │   ├── DATA_AUTHORITY_MATRIX.md
    │   ├── INTEGRATION_MAP.md
    │   ├── INITIAL_EVENT_CATALOG.md
    │   ├── SECURITY_AND_RISK_REGISTER.md
    │   ├── INITIAL_ADR_CATALOG.md
    │   ├── PART_TWO_BACKLOG.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_ARCHITECTURE_QUESTIONS.md
    ├── contracts
    │   ├── os-architecture-part-one-contract.yaml
    │   ├── capability-policy.yaml
    │   ├── domain-policy.yaml
    │   ├── bounded-context-policy.yaml
    │   ├── quality-policy.yaml
    │   ├── data-authority-policy.yaml
    │   ├── integration-policy.yaml
    │   ├── security-risk-policy.yaml
    │   ├── decision-policy.yaml
    │   ├── traceability-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── scope-report.yaml
        ├── capability-report.yaml
        ├── domain-report.yaml
        ├── quality-report.yaml
        ├── data-authority-report.yaml
        ├── integration-report.yaml
        ├── decision-report.yaml
        ├── architecture-report.yaml
        └── os-architecture-part-one-gate-report.yaml
```

Scripts:

```text
scripts/m19/os-architecture-project-part-one
├── validate-project-charter.ps1
├── validate-scope.ps1
├── validate-capability-map.ps1
├── validate-domain-map.ps1
├── validate-bounded-contexts.ps1
├── validate-quality-attributes.ps1
├── validate-data-authority.ps1
├── validate-integration-map.ps1
├── validate-initial-decisions.ps1
├── run-os-architecture-part-one-tests.ps1
├── collect-os-architecture-part-one-evidence.ps1
└── verify-os-architecture-part-one-gate.ps1
```

---

## Conceito essencial

### Arquitetura começa por framing

Framing define:

- problema;
- contexto;
- objetivos;
- não objetivos;
- escopo;
- stakeholders;
- restrições;
- critérios de sucesso;
- prazo;
- decisão necessária.

Sem framing, a equipe pode produzir uma arquitetura elegante para o problema errado.

### Capacidade de negócio não é sistema

Capacidade responde:

```text
o que a organização precisa ser capaz de fazer?
```

Exemplo:

```text
receber demanda;

planejar atendimento;

reservar capacidade;

executar serviço;

comprovar execução;

remunerar prestador;

comunicar cliente;

auditar operação.
```

Sistema é uma implementação possível.

Uma capacidade pode ser suportada por vários sistemas.

Um sistema pode suportar várias capacidades.

### Bounded context não é microserviço

Bounded context define limite semântico e responsabilidade.

Ele pode ser implementado como:

- módulo;
- aplicação;
- serviço;
- conjunto de componentes;
- sistema legado encapsulado.

Microserviço é uma decisão de deploy e operação.

O projeto primeiro define boundaries conceituais.

### Requisito de qualidade precisa ser mensurável

Exemplo ruim:

```text
o sistema deve ser rapido.
```

Exemplo melhor:

```text
durante o pico,
95% das consultas de detalhe
devem responder
em ate 500 ms.
```

Arquitetura responde a cenários mensuráveis.

### Autoridade de dados precisa ser única por decisão

Várias cópias podem existir.

Mas a decisão crítica precisa saber:

```text
qual contexto e autoridade?
```

Exemplos:

```text
status da OS:
Order Management.

janela da atividade:
Scheduling.

reserva de capacidade:
Capacity.

resultado do checklist:
Field Execution.

regra de pagamento:
Compensation.

mensagem enviada:
Communication.
```

Sem autoridade explícita, surgem writes cruzados e conflitos.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project

Set-Location `
  labs/m19/aula-664-projeto-arquitetura-os-parte-1/os-architecture-project
```

---

### 2. Criar Project Charter

Arquivo:

```text
architecture/PROJECT_CHARTER.md
```

Conteúdo:

```markdown
# Project Charter

Contexto

Plataforma multi-tenant
de Ordens de Servico.

Missao

Receber, planejar,
executar e acompanhar
servicos em campo
com seguranca,
rastreabilidade
e capacidade de evolucao.

Resultado esperado da Parte 1

- problema enquadrado;
- capacidades mapeadas;
- boundaries candidatos;
- requisitos de qualidade;
- C4 inicial;
- autoridade de dados;
- integracoes;
- riscos;
- decisoes iniciais.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/os-architecture-part-one-contract.yaml
```

Conteúdo:

```yaml
osArchitecturePartOne:
  context:
    Work-Order-Management

  required:
    - project-charter
    - problem-statement
    - scope
    - actors
    - stakeholders
    - business-journeys
    - capability-map
    - domain-map
    - bounded-context-candidates
    - context-map
    - functional-requirements
    - quality-attribute-scenarios
    - assumptions
    - constraints
    - C4-system-context
    - C4-container
    - data-authority
    - integration-map
    - event-catalog
    - security-risk-register
    - initial-ADRs
    - part-two-backlog
    - evidence
    - gate

  forbidden:
    - start-from-database-table
    - CRUD-only-model
    - bounded-context-equals-microservice
    - shared-write-authority
    - unmeasurable-quality-requirement
    - hidden-external-dependency
    - implementation-deep-dive
    - part-two-complete-design

  nextLesson:
    code:
      M19.55
```

---

### 4. Escrever o Problem Statement

Arquivo:

```text
architecture/PROBLEM_STATEMENT.md
```

Problema:

```text
a organizacao precisa coordenar
milhares de Ordens de Servico
para diferentes clientes,
regioes, produtos e prestadores.

o fluxo atual possui
dependencias manuais,
regras espalhadas,
integracoes frageis,
baixa rastreabilidade
e dificuldade de evolucao.
```

Objetivo:

```text
criar uma arquitetura
que permita receber,
planejar,
executar,
acompanhar
e encerrar Ordens de Servico
com limites claros,
dados autoritativos,
integracoes controladas
e operacao observavel.
```

---

### 5. Definir não objetivos

Não objetivos da primeira fase:

```text
substituir todos os legados;

implementar aplicativo mobile;

criar algoritmo avançado de roteirização;

automatizar toda remuneração;

migrar todos os clientes;

resolver analytics corporativo;

definir tecnologia final de cada componente.
```

Não objetivos protegem o escopo.

---

### 6. Criar Scope

Arquivo:

```text
architecture/SCOPE.md
```

Dentro do escopo:

- recebimento de OS;
- validação;
- atividades;
- planejamento;
- agendamento;
- capacidade;
- atribuição;
- execução;
- checklist;
- evidências;
- status;
- comunicação;
- auditoria;
- transações operacionais;
- integrações;
- multi-tenancy.

Fora do escopo inicial:

- contabilidade completa;
- folha de pagamento;
- CRM completo;
- otimização de rotas;
- gestão de estoque;
- BI corporativo;
- gestão contratual completa.

---

### 7. Criar Architecture Project

```java
package br.com.formacao.osarchitecture.project;

import java.util.List;
import java.util.Objects;

public record ArchitectureProject(
        String id,
        String name,
        String mission,
        ProjectScope scope,
        List<ProjectObjective> objectives,
        List<ProjectConstraint> constraints) {

    public ArchitectureProject {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(mission);
        Objects.requireNonNull(scope);
        objectives = List.copyOf(objectives);
        constraints = List.copyOf(constraints);

        if (objectives.isEmpty()) {
            throw new IllegalArgumentException(
                    "Project requires objectives");
        }
    }
}
```

---

### 8. Criar catálogo de atores

Arquivo:

```text
architecture/ACTOR_CATALOG.md
```

Atores:

```text
cliente final;

operador do cliente;

analista de operacoes;

planejador;

prestador;

tecnico de campo;

supervisor;

backoffice;

financeiro;

auditor;

administrador de tenant;

sistemas externos;

robos e workers.
```

Para cada ator:

- objetivo;
- ações;
- dados;
- risco;
- canal;
- criticidade;
- autorização.

---

### 9. Criar Stakeholder Map

Arquivo:

```text
architecture/STAKEHOLDER_MAP.md
```

Stakeholders:

- produto;
- operações;
- tecnologia;
- segurança;
- dados;
- plataforma;
- financeiro;
- jurídico;
- clientes;
- prestadores;
- suporte;
- auditoria;
- fornecedores.

Registre:

- interesse;
- influência;
- concern;
- decision right;
- evidência necessária.

---

### 10. Mapear jornadas

Arquivo:

```text
architecture/BUSINESS_JOURNEYS.md
```

Jornadas:

```text
J-001:
criar Ordem de Servico.

J-002:
agendar atividade.

J-003:
reagendar atividade.

J-004:
confirmar atendimento.

J-005:
executar atividade.

J-006:
preencher checklist.

J-007:
cancelar atividade.

J-008:
encerrar Ordem de Servico.

J-009:
calcular transacao.

J-010:
notificar cliente.
```

---

### 11. Criar Business Journey

```java
package br.com.formacao.osarchitecture.journey;

import java.util.List;
import java.util.Objects;

public record BusinessJourney(
        String id,
        String name,
        JourneyCriticality criticality,
        String owner,
        List<JourneyStep> steps,
        String successMeasure) {

    public BusinessJourney {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(criticality);
        Objects.requireNonNull(owner);
        steps = List.copyOf(steps);
        Objects.requireNonNull(successMeasure);
    }
}
```

---

### 12. Escolher jornada crítica

Jornada crítica:

```text
Executar atividade.
```

Passos:

```text
1. técnico recebe atividade;

2. identidade é validada;

3. status permitido é verificado;

4. checklist aplicável é carregado;

5. respostas são registradas;

6. evidências são anexadas;

7. resultado é calculado;

8. atividade é concluída;

9. OS é reavaliada;

10. transações e mensagens são iniciadas.
```

Essa jornada atravessa vários contextos.

---

### 13. Criar Capability Map

Arquivo:

```text
architecture/CAPABILITY_MAP.md
```

Capacidades principais:

```text
Work Intake;

Order Management;

Activity Management;

Scheduling;

Capacity Management;

Provider Management;

Field Execution;

Checklist Management;

Evidence Management;

Communication;

Compensation;

Audit;

Tenant Configuration;

Reference Data;

Integration Management;

Operational Analytics.
```

Classifique:

```text
CORE;

SUPPORTING;

GENERIC.
```

---

### 14. Criar Business Capability

```java
package br.com.formacao.osarchitecture.capability;

import java.util.Objects;

public record BusinessCapability(
        String id,
        String name,
        CapabilityType type,
        CapabilityOwner owner,
        String outcome,
        String maturity,
        String strategicImportance) {

    public BusinessCapability {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(type);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(outcome);
        Objects.requireNonNull(maturity);
        Objects.requireNonNull(strategicImportance);
    }
}
```

---

### 15. Classificar capacidades

Exemplo:

```text
Activity Management:
CORE.

Scheduling:
CORE.

Field Execution:
CORE.

Communication:
SUPPORTING.

Identity:
GENERIC.

Object Storage:
GENERIC.

Audit:
SUPPORTING.
```

A classificação orienta investimento.

---

### 16. Criar Domain Map

Arquivo:

```text
architecture/DOMAIN_MAP.md
```

Subdomínios:

```text
Order Lifecycle;

Activity Lifecycle;

Scheduling;

Capacity;

Field Execution;

Checklist;

Provider;

Compensation;

Communication;

Audit;

Tenant Configuration;

Integration;

Analytics.
```

Para cada subdomínio:

- problema;
- linguagem;
- regras;
- autoridade;
- core/supporting/generic;
- owner;
- mudança esperada.

---

### 17. Criar candidatos a bounded context

Arquivo:

```text
architecture/BOUNDED_CONTEXT_CANDIDATES.md
```

Candidatos:

```text
Order Management;

Scheduling;

Capacity;

Provider Network;

Field Execution;

Compensation;

Communication;

Tenant Administration;

Audit and Compliance;

Integration Gateway.
```

Não transforme automaticamente cada candidato em serviço.

---

### 18. Avaliar responsabilidades

`Order Management`:

- OS;
- atividades;
- estado geral;
- regras de encerramento;
- vínculo com cliente;
- produto;
- histórico de negócio.

`Scheduling`:

- janelas;
- agenda;
- confirmação;
- reagendamento;
- conflitos temporais.

`Capacity`:

- disponibilidade;
- território;
- slots;
- reserva;
- liberação.

`Field Execution`:

- início;
- checklist;
- evidências;
- resultado;
- execução offline futura.

`Compensation`:

- regras;
- adicionais;
- descontos;
- cálculo;
- aprovação.

---

### 19. Criar Bounded Context Candidate

```java
package br.com.formacao.osarchitecture.domain;

import java.util.Set;

public record BoundedContextCandidate(
        String name,
        String responsibility,
        Set<String> ownedAggregates,
        Set<String> publishedEvents,
        Set<String> consumedEvents,
        String owner) {

    public BoundedContextCandidate {
        ownedAggregates = Set.copyOf(ownedAggregates);
        publishedEvents = Set.copyOf(publishedEvents);
        consumedEvents = Set.copyOf(consumedEvents);
    }
}
```

---

### 20. Criar Context Map

Arquivo:

```text
architecture/CONTEXT_MAP.md
```

Relações:

```text
Order Management
-> Scheduling:
customer-supplier.

Scheduling
-> Capacity:
conformist only at transport;
anti-corruption at domain.

Field Execution
-> Order Management:
published language by events.

Compensation
<- Field Execution:
event consumer.

Communication
<- all business contexts:
event-driven supporting context.

Integration Gateway
<-> external systems:
anti-corruption layer.
```

---

### 21. Identificar Shared Kernel perigoso

Evite compartilhar:

```text
Order entity;

Activity entity;

Status enum global;

Customer DTO global;

Provider DTO global;

shared JPA entities.
```

Compartilhe apenas:

- identifiers;
- technical envelope;
- common error contract;
- observability context;
- primitive value conventions.

---

### 22. Criar requisitos funcionais

Arquivo:

```text
architecture/FUNCTIONAL_REQUIREMENTS.md
```

Exemplos:

```text
FR-001:
receber OS por API e arquivo.

FR-002:
criar atividades conforme servico.

FR-003:
consultar disponibilidade.

FR-004:
agendar e reagendar.

FR-005:
atribuir prestador.

FR-006:
registrar checklist e evidencias.

FR-007:
cancelar ou concluir atividade.

FR-008:
recalcular estado da OS.

FR-009:
gerar transacoes.

FR-010:
enviar comunicacoes.

FR-011:
auditar alteracoes.

FR-012:
isolar tenants.
```

---

### 23. Criar Quality Attribute Scenarios

Arquivo:

```text
architecture/QUALITY_ATTRIBUTE_SCENARIOS.md
```

Cenários:

```text
Performance:
consulta de detalhe p95 <= 500 ms.

Availability:
leitura operacional 99,9%.

Consistency:
dupla reserva nao permitida.

Resilience:
falha de comunicacao
nao bloqueia conclusao.

Security:
zero cross-tenant access.

Audit:
100% das mudancas criticas
possuem ator e timestamp.

Scalability:
pico de 300 criacoes por segundo.

Recovery:
RTO de 30 minutos;
RPO de 5 minutos.

Maintainability:
novo status sem alterar
mais de dois contexts.

Observability:
jornada critica rastreavel.
```

---

### 24. Criar Quality Attribute Scenario

```java
package br.com.formacao.osarchitecture.quality;

import java.util.Objects;

public record QualityAttributeScenario(
        String id,
        QualityAttribute attribute,
        String source,
        String stimulus,
        String environment,
        String artifact,
        String response,
        QualityMeasure measure) {

    public QualityAttributeScenario {
        Objects.requireNonNull(id);
        Objects.requireNonNull(attribute);
        Objects.requireNonNull(source);
        Objects.requireNonNull(stimulus);
        Objects.requireNonNull(environment);
        Objects.requireNonNull(artifact);
        Objects.requireNonNull(response);
        Objects.requireNonNull(measure);
    }
}
```

---

### 25. Criar premissas e restrições

Arquivo:

```text
architecture/ASSUMPTIONS_AND_CONSTRAINTS.md
```

Premissas:

```text
sistema multi-tenant;

integracoes externas continuarao existindo;

alguns clientes exigem customizacao;

prestadores usam dispositivos moveis;

eventos podem atrasar;

operacao exige auditoria.
```

Restrições:

```text
Java 21;

PostgreSQL;

mensageria corporativa;

deploy em ambiente containerizado;

LGPD;

coexistencia com legados;

budget de conexoes;

equipes pequenas por dominio.
```

Premissa precisa de validação.

Restrição precisa de owner.

---

### 26. Criar C4 System Context

Arquivo:

```text
architecture/C4_SYSTEM_CONTEXT.md
```

Sistema central:

```text
OS Platform.
```

Pessoas:

- Customer Operator;
- Operations Analyst;
- Field Technician;
- Supervisor;
- Auditor.

Sistemas externos:

- Customer ERP;
- Capacity Provider;
- Messaging Provider;
- Identity Provider;
- Financial System;
- Object Storage;
- Analytics Platform.

---

### 27. Criar C4 Container inicial

Arquivo:

```text
architecture/C4_CONTAINER.md
```

Containers candidatos:

```text
OS Portal;

OS API;

Order Management Application;

Scheduling Application;

Capacity Adapter;

Field Execution API;

Compensation Application;

Communication Worker;

Integration Gateway;

PostgreSQL databases;

Message Broker;

Object Storage;

Observability Platform.
```

Este desenho ainda é inicial.

Na Parte 2, ele será revisado com contratos, deploy, segurança e operação.

---

### 28. Definir autoridade de dados

Arquivo:

```text
architecture/DATA_AUTHORITY_MATRIX.md
```

Matriz:

```text
Work Order:
Order Management.

Activity:
Order Management.

Schedule:
Scheduling.

Capacity Reservation:
Capacity.

Provider Profile:
Provider Network.

Checklist Definition:
Field Execution or Checklist context.

Checklist Answer:
Field Execution.

Evidence Metadata:
Field Execution.

Evidence Binary:
Object Storage.

Compensation Rule:
Compensation.

Transaction:
Compensation.

Message Delivery:
Communication.

Tenant Policy:
Tenant Administration.

Audit Record:
Audit and Compliance.
```

---

### 29. Criar Data Authority

```java
package br.com.formacao.osarchitecture.data;

import java.util.Set;

public record DataAuthority(
        String dataProduct,
        String authoritativeContext,
        Set<String> allowedWriters,
        Set<String> consumers,
        String consistencyModel,
        DataClassification classification) {

    public DataAuthority {
        allowedWriters = Set.copyOf(allowedWriters);
        consumers = Set.copyOf(consumers);
    }
}
```

---

### 30. Proibir cross-context write

Exemplo:

```text
Field Execution
nao atualiza diretamente
a tabela de Order Management.

ele publica
ActivityExecutionCompleted.
```

O contexto autoritativo aplica a transição.

---

### 31. Criar Integration Map

Arquivo:

```text
architecture/INTEGRATION_MAP.md
```

Integrações:

```text
Customer ERP -> Integration Gateway:
OS intake.

Order Management -> Scheduling:
schedule request.

Scheduling -> Capacity:
availability and reservation.

Field Execution -> Object Storage:
evidence upload.

Field Execution -> Order Management:
execution events.

Compensation -> Financial System:
provisioning.

Communication -> Messaging Provider:
notifications.

All contexts -> Audit:
audit events.
```

---

### 32. Classificar integração

Modos:

```text
SYNCHRONOUS_QUERY;

SYNCHRONOUS_COMMAND;

ASYNCHRONOUS_EVENT;

BATCH;

FILE;

WEBHOOK;

CDC;

MANUAL.
```

Para cada integração, registre:

- purpose;
- owner;
- protocol;
- timeout;
- retry;
- idempotency;
- consistency;
- schema;
- security;
- observability;
- recovery.

---

### 33. Criar Integration Boundary

```java
package br.com.formacao.osarchitecture.integration;

import java.util.Objects;

public record IntegrationBoundary(
        String id,
        String source,
        String target,
        IntegrationMode mode,
        String purpose,
        String contract,
        IntegrationRisk risk,
        String owner) {

    public IntegrationBoundary {
        Objects.requireNonNull(id);
        Objects.requireNonNull(source);
        Objects.requireNonNull(target);
        Objects.requireNonNull(mode);
        Objects.requireNonNull(purpose);
        Objects.requireNonNull(contract);
        Objects.requireNonNull(risk);
        Objects.requireNonNull(owner);
    }
}
```

---

### 34. Criar catálogo inicial de eventos

Arquivo:

```text
architecture/INITIAL_EVENT_CATALOG.md
```

Eventos:

```text
WorkOrderCreated;

ActivityCreated;

SchedulingRequested;

ActivityScheduled;

ActivityRescheduled;

CapacityReserved;

CapacityReleased;

ActivityStarted;

ChecklistCompleted;

ActivityExecutionCompleted;

ActivityCancelled;

WorkOrderCompleted;

CompensationCalculated;

CustomerNotificationRequested.
```

Para cada evento:

- owner;
- significado;
- aggregate;
- version;
- consumers;
- ordering;
- retention;
- PII;
- idempotency.

---

### 35. Diferenciar evento e comando

Comando:

```text
ReserveCapacity.
```

Evento:

```text
CapacityReserved.
```

Comando pede uma ação.

Evento registra um fato ocorrido.

Essa diferença será aprofundada nos contratos da Parte 2.

---

### 36. Criar Security and Risk Register

Arquivo:

```text
architecture/SECURITY_AND_RISK_REGISTER.md
```

Riscos:

```text
cross-tenant access;

double capacity reservation;

duplicate external request;

evidence leakage;

provider impersonation;

shared database write;

stale authorization;

message replay;

event schema breaking;

external provider outage;

manual repair without audit;

large file abuse;

notification duplication;

payment miscalculation.
```

---

### 37. Classificar riscos

Campos:

- ID;
- scenario;
- asset;
- probability;
- impact;
- severity;
- owner;
- mitigation;
- evidence;
- residual risk;
- review trigger.

Risco sem owner não está tratado.

---

### 38. Criar ADRs iniciais

Arquivo:

```text
architecture/INITIAL_ADR_CATALOG.md
```

ADRs:

```text
ADR-001:
arquitetura orientada a bounded contexts.

ADR-002:
autoridade de dados por contexto.

ADR-003:
eventos para propagacao de estado.

ADR-004:
Integration Gateway para legados.

ADR-005:
armazenamento externo de evidencias.

ADR-006:
multi-tenancy com tenant context obrigatorio.

ADR-007:
PostgreSQL por contexto logico inicial.

ADR-008:
mensageria para comunicacao e efeitos derivados.
```

Não detalhe todas as decisões ainda.

Registre status `PROPOSED`.

---

### 39. Criar Architecture Decision

```java
package br.com.formacao.osarchitecture.decision;

import java.util.List;

public record ArchitectureDecision(
        String id,
        String title,
        DecisionStatus status,
        String context,
        List<String> options,
        String proposedDecision,
        List<DecisionEvidence> requiredEvidence,
        String owner,
        String reviewTrigger) {

    public ArchitectureDecision {
        options = List.copyOf(options);
        requiredEvidence = List.copyOf(requiredEvidence);
    }
}
```

---

### 40. Criar rastreabilidade

Ligações:

```text
Capability
-> Bounded Context
-> Journey
-> Requirement
-> Quality Attribute
-> Container
-> Data Authority
-> Integration
-> ADR
-> Risk.
```

Exemplo:

```text
Field Execution
-> J-005
-> FR-006
-> QA-SEC-001
-> Field Execution API
-> Checklist Answer
-> ActivityExecutionCompleted
-> ADR-003
-> RISK-005.
```

---

### 41. Criar backlog da Parte 2

Arquivo:

```text
architecture/PART_TWO_BACKLOG.md
```

Itens:

```text
detalhar APIs;

detalhar eventos;

definir schemas;

revisar C4;

modelar deploy;

definir SLOs;

definir threat model;

definir autorizacao;

definir observabilidade;

definir retries e timeouts;

definir idempotencia;

definir migrations;

definir rollout;

definir runbooks;

executar fitness functions;

criar ArchUnit;

criar evidence final;

defender arquitetura.
```

---

### 42. Criar perguntas abertas

Arquivo:

```text
architecture/OPEN_ARCHITECTURE_QUESTIONS.md
```

Perguntas:

```text
Order e Activity
devem ficar no mesmo context?

Checklist merece context proprio?

Capacity e externa ou interna?

Compensation participa
do caminho critico?

qual consistencia
para cancelamento?

qual operacao funciona offline?

qual isolamento
por tenant?

qual estrategia
para customizacoes?

qual dependencia
pode degradar?

qual dado exige retencao legal?
```

Pergunta aberta precisa de owner e prazo.

---

### 43. Testar capacidade sem owner

Uma capability sem owner deve falhar:

```text
FAIL_CAPABILITY_OWNER
```

---

### 44. Testar bounded context sem responsabilidade

Candidato criado apenas porque existe uma tabela.

Resultado:

```text
FAIL_CONTEXT_RESPONSIBILITY
```

---

### 45. Testar requisito não mensurável

Requisito:

```text
sistema rapido.
```

Resultado:

```text
FAIL_QUALITY_MEASURE
```

---

### 46. Testar autoridade duplicada

`Activity.status` com writers:

```text
Order Management;

Field Execution.
```

Resultado:

```text
FAIL_SHARED_WRITE_AUTHORITY
```

---

### 47. Testar integração oculta

Código depende de sistema externo, mas o Integration Map não contém a relação.

Resultado:

```text
FAIL_HIDDEN_INTEGRATION
```

---

### 48. Testar evento sem owner

Evento:

```text
ActivityExecutionCompleted
```

Sem owner.

Resultado:

```text
FAIL_EVENT_OWNER
```

---

### 49. Testar risco sem mitigação

Risco crítico:

```text
cross-tenant access.
```

Sem controle.

Resultado:

```text
FAIL_CRITICAL_RISK
```

---

### 50. Testar ADR sem evidência

ADR propõe mensageria, mas não define:

- volume;
- ordering;
- idempotência;
- operação;
- custo.

Resultado:

```text
FAIL_DECISION_EVIDENCE
```

---

### 51. Criar reports

Exemplo:

```yaml
osArchitecturePartOne:
  scope:
    objectives:
      6
    nonObjectives:
      7

  actors:
    total:
      12

  journeys:
    total:
      10
    critical:
      3

  capabilities:
    total:
      16
    core:
      4
    withoutOwner:
      0

  boundedContexts:
    candidates:
      10
    withoutResponsibility:
      0

  qualityAttributes:
    total:
      10
    measurable:
      10

  dataAuthority:
    products:
      14
    duplicatedAuthority:
      0

  integrations:
    total:
      8
    hidden:
      0

  decisions:
    proposed:
      8

  gate:
    PASS
```

---

### 52. Criar evidence

Arquivo:

```text
contracts/os-architecture-part-one-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- objective count;
- non-objective count;
- actor count;
- stakeholder count;
- journey count;
- critical journey count;
- capability count;
- core capability count;
- capability owner coverage;
- bounded context candidate count;
- context responsibility coverage;
- functional requirement count;
- quality scenario count;
- measurable quality coverage;
- data product count;
- duplicated authority count;
- integration count;
- hidden integration count;
- initial event count;
- event owner coverage;
- critical risk count;
- unmitigated critical risk count;
- proposed ADR count;
- decision evidence coverage;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- clientes reais;
- nomes reais;
- contratos;
- endpoints privados;
- credenciais;
- topologia real;
- dados pessoais;
- decisões corporativas reais;
- detalhes completos da Parte 2.

---

### 53. Criar o Gate

O gate valida:

- charter;
- problem statement;
- scope;
- actors;
- stakeholders;
- journeys;
- capabilities;
- domain map;
- bounded contexts;
- context map;
- functional requirements;
- quality scenarios;
- assumptions;
- constraints;
- C4;
- data authority;
- integrations;
- events;
- risks;
- ADRs;
- traceability;
- open questions;
- part-two backlog;
- tests;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_PROJECT_CHARTER;

FAIL_PROBLEM_STATEMENT;

FAIL_SCOPE;

FAIL_ACTOR_CATALOG;

FAIL_STAKEHOLDER_MAP;

FAIL_JOURNEY_MAP;

FAIL_CAPABILITY_MAP;

FAIL_DOMAIN_MAP;

FAIL_BOUNDED_CONTEXT;

FAIL_CONTEXT_MAP;

FAIL_FUNCTIONAL_REQUIREMENT;

FAIL_QUALITY_ATTRIBUTE;

FAIL_ASSUMPTION;

FAIL_C4;

FAIL_DATA_AUTHORITY;

FAIL_INTEGRATION_MAP;

FAIL_EVENT_CATALOG;

FAIL_RISK_REGISTER;

FAIL_INITIAL_ADR;

FAIL_TRACEABILITY;

FAIL_PART_TWO_BACKLOG;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 54. Executar validação completa

```powershell
.\scripts\m19\os-architecture-project-part-one\validate-project-charter.ps1

.\scripts\m19\os-architecture-project-part-one\validate-scope.ps1

.\scripts\m19\os-architecture-project-part-one\validate-capability-map.ps1

.\scripts\m19\os-architecture-project-part-one\validate-domain-map.ps1

.\scripts\m19\os-architecture-project-part-one\validate-bounded-contexts.ps1

.\scripts\m19\os-architecture-project-part-one\validate-quality-attributes.ps1

.\scripts\m19\os-architecture-project-part-one\validate-data-authority.ps1

.\scripts\m19\os-architecture-project-part-one\validate-integration-map.ps1

.\scripts\m19\os-architecture-project-part-one\validate-initial-decisions.ps1

.\scripts\m19\os-architecture-project-part-one\run-os-architecture-part-one-tests.ps1

.\scripts\m19\os-architecture-project-part-one\collect-os-architecture-part-one-evidence.ps1

.\scripts\m19\os-architecture-project-part-one\verify-os-architecture-part-one-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 55. Encerrar a Parte 1

Confirme:

- problema;
- escopo;
- não objetivos;
- atores;
- stakeholders;
- jornadas;
- capabilities;
- domain map;
- bounded contexts;
- context map;
- requisitos funcionais;
- qualidade mensurável;
- premissas;
- restrições;
- C4 inicial;
- autoridade de dados;
- integrações;
- eventos;
- riscos;
- ADRs;
- rastreabilidade;
- perguntas abertas;
- backlog da Parte 2;
- reports;
- evidence;
- gate aprovado.

---

## Entendendo o que foi feito

### O projeto começou pelo problema

Você evitou partir de tabelas, endpoints ou frameworks.

Primeiro definiu contexto, missão, objetivos, não objetivos e escopo.

### Capacidades revelaram o negócio

Você mapeou o que a organização precisa fazer e classificou capacidades core, supporting e generic.

### Boundaries surgiram da responsabilidade

Os bounded contexts candidatos foram extraídos de linguagem, regras, autoridade e mudança.

Eles não foram definidos por tabelas ou equipes atuais.

### Qualidade virou requisito mensurável

Performance, segurança, consistência, disponibilidade, recuperação, escalabilidade e observabilidade ganharam cenários.

### Dados ganharam autoridade

Cada produto de dados possui contexto autoritativo e writers permitidos.

### Integrações ficaram visíveis

Protocolos, owners, riscos, contratos, timeouts e recovery entraram no mapa.

### Decisões iniciais ficaram rastreáveis

ADRs propostos passaram a depender de evidências e links com capacidades, journeys, dados, integrações e riscos.

---

## Erros comuns importantes

### Começar pela tabela de OS

Isso mistura capacidades e cria aggregate gigante.

### Criar um microserviço por entidade

Entidade não define autonomia de negócio.

### Confundir capability com bounded context

Capability descreve o que o negócio faz; context define modelo e responsabilidade.

### Criar boundary por organograma

Equipes mudam. Responsabilidades e linguagem devem orientar o desenho.

### Aceitar vários writers

A autoridade fica ambígua e conflitos surgem.

### Criar requisito de qualidade genérico

Sem medida, não existe gate.

### Esconder dependência externa

A arquitetura parece mais simples do que é.

### Criar evento sem semântica

Evento precisa representar fato, não apenas transportar DTO.

### Aprovar ADR sem evidência

A decisão vira preferência formalizada.

### Antecipar a Parte 2

O foco atual é framing e desenho inicial.

---

## Comandos úteis

### Validar capabilities

```powershell
.\scripts\m19\os-architecture-project-part-one\validate-capability-map.ps1
```

### Validar bounded contexts

```powershell
.\scripts\m19\os-architecture-project-part-one\validate-bounded-contexts.ps1
```

### Validar qualidade

```powershell
.\scripts\m19\os-architecture-project-part-one\validate-quality-attributes.ps1
```

### Validar autoridade

```powershell
.\scripts\m19\os-architecture-project-part-one\validate-data-authority.ps1
```

### Executar testes

```powershell
.\scripts\m19\os-architecture-project-part-one\run-os-architecture-part-one-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\os-architecture-project-part-one\verify-os-architecture-part-one-gate.ps1
```

---

## Exercício guiado

Escolha a jornada:

```text
Reagendar atividade.
```

Crie:

1. atores;
2. passos;
3. capabilities;
4. bounded contexts;
5. contexto autoritativo;
6. dados;
7. integrações;
8. eventos;
9. requisitos de qualidade;
10. riscos;
11. ADRs;
12. rastreabilidade;
13. perguntas abertas;
14. backlog da Parte 2.

Defenda por que reagendamento não deve ser apenas um `UPDATE activity`.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 663 e ponte para a aula 665 foram preservadas;
- laboratório `os-architecture-project` foi criado;
- Project Charter foi criado;
- Problem Statement foi criado;
- missão, objetivo e resultado foram definidos;
- não objetivos foram definidos;
- Scope foi criado;
- atores foram catalogados;
- stakeholders foram mapeados;
- jornadas foram criadas;
- jornada crítica foi detalhada;
- Capability Map foi criado;
- capabilities foram classificadas;
- capabilities possuem owner;
- Domain Map foi criado;
- subdomínios foram classificados;
- bounded context candidates foram criados;
- bounded context não foi confundido com microserviço;
- responsabilidades foram definidas;
- Shared Kernel perigoso foi evitado;
- Context Map foi criado;
- requisitos funcionais foram definidos;
- Quality Attribute Scenarios foram criados;
- requisitos de qualidade são mensuráveis;
- premissas e restrições foram registradas;
- C4 System Context foi criado;
- C4 Container inicial foi criado;
- Data Authority Matrix foi criada;
- cross-context write foi proibido;
- Integration Map foi criado;
- modos de integração foram classificados;
- contratos, owners, timeout, retry e recovery foram registrados;
- Initial Event Catalog foi criado;
- eventos possuem significado, owner e version;
- comandos e eventos foram diferenciados;
- Security and Risk Register foi criado;
- riscos críticos possuem mitigação;
- Initial ADR Catalog foi criado;
- ADRs permanecem `PROPOSED`;
- decisões possuem evidências necessárias;
- rastreabilidade foi criada;
- backlog da Parte 2 foi criado;
- perguntas abertas possuem owner;
- testes de owner, boundary, qualidade, autoridade, integração, eventos, riscos e ADRs foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- a Parte 2 não foi antecipada.

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
  scripts/m19/os-architecture-project-part-one `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|realProvider|realEndpoint|productionTopology|privateContract"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): iniciar projeto de arquitetura de OS"
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
- detalhes completos da Parte 2.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou o projeto de arquitetura de Ordens de Serviço.

Você criou:

```text
Project Charter;

Problem Statement;

Scope;

Actor Catalog;

Stakeholder Map;

Business Journeys;

Capability Map;

Domain Map;

Bounded Context Candidates;

Context Map;

Functional Requirements;

Quality Attribute Scenarios;

Assumptions and Constraints;

C4 System Context;

C4 Container;

Data Authority Matrix;

Integration Map;

Initial Event Catalog;

Security and Risk Register;

Initial ADR Catalog;

Part Two Backlog;

reports, evidence e gate.
```

Você comprovou que uma arquitetura não deve começar por tabelas, endpoints ou microserviços.

Ela começa pelo problema, pelas capacidades, pela linguagem, pelas decisões, pelos dados, pelos riscos e pelos critérios de qualidade.

Você também tornou explícito que bounded context não é sinônimo de serviço, que várias cópias podem existir sem dividir autoridade e que integrações precisam de owner, contrato, segurança, observabilidade e recovery.

A próxima aula será:

```text
665 - M19.55 - Projeto arquitetura OS parte 2
```

Nela, você irá transformar o desenho inicial em uma solução arquitetural completa, detalhando APIs, eventos, schemas, segurança, observabilidade, consistência, idempotência, deploy, rollout, runbooks, fitness functions, ArchUnit, documentação viva e defesa técnica.

Nenhum aprofundamento completo da Parte 2 foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini problema e escopo.
- [ ] Mapeei atores e jornadas.
- [ ] Criei capabilities.
- [ ] Modelei subdomínios.
- [ ] Defini bounded contexts.
- [ ] Criei quality scenarios.
- [ ] Defini autoridade de dados.
- [ ] Mapeei integrações.
- [ ] Cataloguei eventos.
- [ ] Registrei riscos.
- [ ] Criei ADRs iniciais.
- [ ] Preparei a Parte 2.

---

## Troubleshooting adicional

### O modelo ainda parece um CRUD

Revise capabilities, journeys, invariantes e autoridades.

### Order Management ficou grande demais

Verifique se scheduling, execution, checklist, compensation e communication foram misturados.

### Dois contexts precisam alterar Activity

Defina autoridade e use comandos ou eventos.

### O evento contém todos os campos

Revise semântica, minimização e consumidores.

### O C4 tem muitos containers

Lembre que bounded context não precisa virar deploy independente.

### O requisito de performance não possui volume

Inclua ambiente, carga, percentil e limite.

### O risco crítico não possui owner

O projeto não pode avançar.

### A integração depende de arquivo manual

Registre como modo real, owner, SLA e recovery.

### O ADR já está `ACCEPTED`

Mantenha `PROPOSED` até obter evidência e concluir a Parte 2.

### A equipe quer começar implementação

Feche primeiro authority, contracts, risks e quality scenarios.

### A discussão entrou em deploy detalhado

Preserve o aprofundamento para a aula 665.

---

## Perguntas de revisão

1. Por que o projeto não começa por tecnologia?
2. O que é framing?
3. Qual diferença entre objetivo e não objetivo?
4. O que é capability?
5. Capability é bounded context?
6. Bounded context é microserviço?
7. O que orienta um boundary?
8. O que é context map?
9. Por que requisito de qualidade precisa ser mensurável?
10. O que é Quality Attribute Scenario?
11. O que é autoridade de dados?
12. Várias réplicas significam várias autoridades?
13. O que é cross-context write?
14. Qual diferença entre comando e evento?
15. O que um Integration Map registra?
16. Por que evento precisa de owner?
17. O que um risco precisa conter?
18. Por que ADR começa como proposed?
19. O que é rastreabilidade?
20. Para que serve o C4 System Context?
21. Para que serve o C4 Container?
22. O que a Parte 1 entrega?
23. O que fica para a Parte 2?
24. Qual é a próxima aula?
25. Qual é a regra central desta aula?

---

## Roteiro de resposta

1. Porque tecnologia vem depois do problema e dos limites.
2. Enquadramento do problema, objetivos, restrições e decisão.
3. Resultado desejado versus limite de escopo.
4. Capacidade que o negócio precisa executar.
5. Não.
6. Não.
7. Linguagem, responsabilidade, autoridade e mudança.
8. Relações entre bounded contexts.
9. Para permitir validação.
10. Estímulo, contexto, resposta e medida.
11. Contexto responsável por uma decisão de dado.
12. Não.
13. Escrita direta em dado de outro contexto.
14. Pedido de ação versus fato ocorrido.
15. Purpose, owner, protocolo, contrato e risco.
16. Para responsabilidade e evolução.
17. Cenário, impacto, owner, mitigação e residual risk.
18. Porque ainda depende de evidência.
19. Ligações entre capacidades, decisões e implementação.
20. Mostrar pessoas e sistemas externos.
21. Mostrar grandes unidades executáveis.
22. Framing e desenho inicial defensável.
23. Contratos, deploy, segurança, operação e defesa.
24. Projeto arquitetura OS parte 2.
25. Arquitetura começa por problema, capacidades e evidências.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 664 - M19.54 - Projeto arquitetura OS parte 1

- Continuei após Documentação arquitetural viva.
- Iniciei o projeto aplicado de arquitetura de Ordens de Serviço.
- Criei o laboratório `os-architecture-project`.
- Criei Project Charter.
- Criei Problem Statement.
- Defini objetivos, não objetivos e escopo.
- Cataloguei atores.
- Mapeei stakeholders.
- Criei jornadas de negócio.
- Detalhei a jornada Executar atividade.
- Criei Capability Map.
- Classifiquei capabilities como core, supporting e generic.
- Criei Domain Map.
- Modelei subdomínios.
- Criei bounded context candidates.
- Evitei confundir bounded context e microserviço.
- Defini responsabilidades.
- Criei Context Map.
- Evitei Shared Kernel de entidades.
- Criei requisitos funcionais.
- Criei Quality Attribute Scenarios.
- Tornei qualidade mensurável.
- Registrei premissas e restrições.
- Criei C4 System Context.
- Criei C4 Container inicial.
- Criei Data Authority Matrix.
- Proibi cross-context write.
- Criei Integration Map.
- Classifiquei modos de integração.
- Criei Initial Event Catalog.
- Diferenciei comando e evento.
- Criei Security and Risk Register.
- Criei Initial ADR Catalog.
- Mantive ADRs como proposed.
- Criei rastreabilidade.
- Criei Part Two Backlog.
- Criei reports, evidence e gate.
- Não antecipei a Parte 2.
- Próxima aula: Projeto arquitetura OS parte 2.
```

---

## Referência técnica curta

- Architecture Project.
- Problem Framing.
- Scope.
- Business Capability.
- Subdomain.
- Bounded Context.
- Context Map.
- Business Journey.
- Quality Attribute Scenario.
- C4 System Context.
- C4 Container.
- Data Authority.
- Integration Map.
- Domain Event.
- Risk Register.
- Proposed ADR.
- Traceability.

Regra final:

```text
O projeto de arquitetura de Ordens de Serviço deve começar pelo problema e pelas capacidades, não por tabelas, endpoints ou microserviços: o Project Charter define missão, escopo e resultados, atores e stakeholders revelam objetivos e riscos, jornadas descrevem valor ponta a ponta, capabilities mostram o que a organização precisa fazer, subdomínios e bounded contexts organizam linguagem, regras, autoridade e mudança, e o Context Map explicita relações sem compartilhar entidades de negócio; requisitos funcionais definem comportamento, Quality Attribute Scenarios tornam performance, disponibilidade, consistência, segurança, auditoria, recuperação, escalabilidade e observabilidade mensuráveis, premissas e restrições possuem owner, C4 System Context mostra pessoas e sistemas externos, C4 Container apresenta unidades executáveis iniciais sem obrigar um microserviço por context, e a Data Authority Matrix define writers únicos para OS, Activity, Schedule, Capacity, Checklist, Evidence, Compensation, Communication, Tenant e Audit; o Integration Map registra purpose, owner, protocolo, contrato, timeout, retry, idempotência, segurança, observabilidade e recovery, o catálogo de eventos diferencia pedidos de fatos, riscos críticos possuem owner e mitigação, ADRs permanecem proposed até obter evidência, e traceability conecta capability, context, journey, requirement, quality, container, data, integration, decision e risk; o gate termina com charter, scope, actors, journeys, capabilities, domain map, bounded contexts, quality scenarios, C4, data authority, integrations, events, risks, ADRs, backlog, tests, reports e evidence aprovados, enquanto APIs, schemas, deploy, segurança, observabilidade, rollout, runbooks, fitness functions e defesa técnica permanecem reservados para a aula 665.
```
