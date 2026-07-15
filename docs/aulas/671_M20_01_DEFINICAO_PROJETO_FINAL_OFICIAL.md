# 671 - M20.01 - Definicao projeto final

## Apresentação da aula

Na aula 670, você encerrou oficialmente o Módulo 19.

O fechamento comprovou competências em:

- modelagem de domínio;
- arquitetura hexagonal;
- sistemas distribuídos;
- consistência;
- idempotência;
- dados;
- segurança;
- observabilidade;
- resiliência;
- governança;
- documentação viva;
- liderança técnica;
- revisão e defesa arquitetural.

O Módulo 20 inicia uma etapa diferente.

Até aqui, muitos laboratórios foram construídos para ensinar uma habilidade específica. Agora você precisará reunir essas habilidades em um único projeto final, com continuidade, coerência, evidências, apresentação profissional e capacidade de defesa.

O primeiro erro possível seria abrir a IDE e começar a programar.

O segundo seria escolher um projeto apenas porque parece popular.

O terceiro seria tentar demonstrar todas as tecnologias conhecidas ao mesmo tempo.

Um projeto final forte não nasce da quantidade de frameworks. Ele nasce de uma definição clara sobre:

```text
qual problema será resolvido;

por que esse problema é relevante;

qual projeto cabe no tempo disponível;

quais competências ele precisa demonstrar;

quais riscos serão controlados;

quais evidências serão produzidas;

como ele será apresentado em portfólio;

como suas decisões serão defendidas em entrevista.
```

Nesta aula, você não criará o backlog, não detalhará o escopo funcional, não modelará agregados, não desenhará o banco, não fechará o C4 e não configurará o repositório profissional.

Essas etapas possuem aulas próprias.

O objetivo atual é tomar uma decisão de projeto consciente e registrá-la de maneira profissional.

O projeto escolhido será:

```text
OrderFlow

Plataforma multi-tenant
de orquestracao de pedidos
e fulfillment.
```

O OrderFlow representará uma plataforma backend usada por empresas que recebem pedidos por diferentes canais e precisam coordenar validação, reserva de estoque, autorização externa de pagamento, preparação, expedição, acompanhamento, cancelamento, auditoria e comunicação.

A escolha desse domínio não significa que o sistema implementará um e-commerce completo.

O foco será a orquestração backend do ciclo de pedido.

Esse recorte permite demonstrar:

- Java 21;
- Spring Boot;
- DDD;
- arquitetura modular;
- casos de uso;
- PostgreSQL;
- migrations;
- APIs REST;
- eventos;
- Outbox e Inbox;
- idempotência;
- segurança;
- multi-tenancy;
- cache quando justificado;
- observabilidade;
- testes;
- Docker;
- CI/CD;
- documentação;
- decisões arquiteturais;
- operação;
- narrativa de portfólio.

O laboratório desta aula será:

```text
labs/m20/aula-671-definicao-projeto-final/orderflow-final-project-definition
```

Você criará:

- Final Project Definition Charter;
- catálogo de projetos candidatos;
- critérios de seleção;
- scorecard de candidatos;
- decisão do projeto final;
- contexto de negócio;
- visão do produto;
- objetivos e não objetivos;
- usuários-alvo;
- restrições e premissas;
- hipóteses de qualidade;
- critérios de sucesso;
- objetivos de aprendizagem;
- plano de evidências;
- narrativa de portfólio;
- governança do projeto;
- guardrails de escopo;
- riscos iniciais;
- reports, evidence e gate.

A próxima aula será:

```text
672 - M20.02 - Backlog projeto final
```

Na aula 672, a definição será transformada em um backlog ordenado, com épicos, histórias técnicas, dependências, critérios de aceite, milestones e estratégia de entrega.

Nesta aula, o backlog não será antecipado.

Regra central:

```text
antes de construir
o projeto final,

defina o problema,
o valor,
os limites,
as competencias
e as evidencias
que justificam sua existencia.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
670:
Fechamento do Modulo 19.

671:
Definicao projeto final.

672:
Backlog projeto final.

673:
Escopo funcional.

674:
Modelagem dominio final.

675:
Modelagem banco final.

676:
Arquitetura C4 final.

677:
ADRs do projeto.

678:
Configuracao repositorio profissional.
```

A ordem é intencional.

Primeiro, o projeto é definido.

Depois, o trabalho é organizado.

Em seguida, o escopo funcional é fechado, o domínio é modelado, os dados são desenhados, a arquitetura é documentada, as decisões são registradas e o repositório profissional é preparado.

Somente depois começa a implementação.

Essa sequência evita que o código determine o problema.

O M20 também possui um objetivo profissional.

O projeto final deverá ser útil para:

- demonstrar capacidade técnica;
- orientar conversas em entrevistas;
- produzir artefatos públicos sanitizados;
- mostrar evolução de decisões;
- comprovar domínio de backend Java;
- demonstrar qualidade e operação;
- sustentar uma defesa técnica;
- formar uma narrativa de carreira.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-671-definicao-projeto-final
└── orderflow-final-project-definition
    ├── README.md
    ├── definition
    │   ├── FINAL_PROJECT_DEFINITION_CHARTER.md
    │   ├── PROJECT_CANDIDATES.md
    │   ├── SELECTION_CRITERIA.md
    │   ├── CANDIDATE_SCORECARD.md
    │   ├── FINAL_PROJECT_DECISION.md
    │   ├── BUSINESS_CONTEXT.md
    │   ├── PROBLEM_STATEMENT.md
    │   ├── PROJECT_VISION.md
    │   ├── PROJECT_GOALS.md
    │   ├── PROJECT_NON_GOALS.md
    │   ├── TARGET_USERS.md
    │   ├── HIGH_LEVEL_JOURNEYS.md
    │   ├── CAPABILITY_HYPOTHESES.md
    │   ├── QUALITY_HYPOTHESES.md
    │   ├── CONSTRAINTS.md
    │   ├── ASSUMPTIONS.md
    │   ├── SUCCESS_CRITERIA.md
    │   ├── LEARNING_OBJECTIVES.md
    │   ├── EVIDENCE_PLAN.md
    │   ├── PORTFOLIO_NARRATIVE.md
    │   ├── PROJECT_GOVERNANCE.md
    │   ├── SCOPE_GUARDRAILS.md
    │   ├── INITIAL_RISK_HYPOTHESES.md
    │   ├── OPEN_DEFINITION_QUESTIONS.md
    │   └── NEXT_LESSON_BOUNDARY.md
    ├── contracts
    │   ├── final-project-definition-contract.yaml
    │   ├── candidate-selection-policy.yaml
    │   ├── project-goal-policy.yaml
    │   ├── project-non-goal-policy.yaml
    │   ├── evidence-plan-policy.yaml
    │   ├── portfolio-policy.yaml
    │   ├── scope-guardrail-policy.yaml
    │   ├── risk-hypothesis-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/finalproject/definition
    │   │           ├── ProjectCandidate.java
    │   │           ├── SelectionCriterion.java
    │   │           ├── CandidateScore.java
    │   │           ├── FinalProjectDefinition.java
    │   │           ├── ProjectGoal.java
    │   │           ├── SuccessMetric.java
    │   │           ├── ProjectConstraint.java
    │   │           ├── EvidenceCommitment.java
    │   │           └── ProjectDefinitionGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/finalproject/definition
    │               ├── CandidateSelectionTest.java
    │               ├── ProjectGoalTest.java
    │               ├── NonGoalProtectionTest.java
    │               ├── EvidenceCommitmentTest.java
    │               ├── ScopeGuardrailTest.java
    │               ├── BacklogNonAnticipationTest.java
    │               └── ProjectDefinitionGateTest.java
    └── reports
        ├── candidate-selection-report.yaml
        ├── project-definition-report.yaml
        ├── evidence-commitment-report.yaml
        ├── portfolio-readiness-report.yaml
        ├── architecture-report.yaml
        └── final-project-definition-gate-report.yaml
```

Scripts:

```text
scripts/m20/orderflow-final-project-definition
├── validate-definition-contract.ps1
├── validate-candidate-selection.ps1
├── validate-project-goals.ps1
├── validate-project-non-goals.ps1
├── validate-evidence-plan.ps1
├── validate-portfolio-narrative.ps1
├── validate-scope-guardrails.ps1
├── validate-risk-hypotheses.ps1
├── run-project-definition-tests.ps1
├── collect-project-definition-evidence.ps1
└── verify-project-definition-gate.ps1
```

---

## Conceito essencial

### Projeto final é um instrumento de demonstração

O projeto final não serve apenas para praticar programação.

Ele precisa demonstrar uma combinação de competências.

Exemplo:

```text
um endpoint funcionando
prova implementacao basica.

um caso de uso com dominio,
idempotencia,
testes,
observabilidade,
seguranca,
ADRs,
runbook
e evidence
prova engenharia.
```

A definição precisa escolher um problema que produza evidências variadas.

### Projeto grande não significa projeto forte

Um projeto pode possuir vinte módulos e não concluir nenhum fluxo com qualidade.

Outro pode possuir quatro jornadas bem escolhidas e demonstrar:

- modelagem;
- contratos;
- consistência;
- segurança;
- operação;
- testes;
- evolução.

O segundo tende a ser mais defensável.

### Domínio precisa permitir decisões reais

Um CRUD simples de cadastro não produz decisões suficientes.

O domínio escolhido precisa conter:

- estado;
- invariantes;
- concorrência;
- integrações;
- falhas;
- dados;
- segurança;
- operação;
- trade-offs.

OrderFlow atende a esses critérios sem exigir uma empresa real ou dados sensíveis reais.

### Portfólio precisa contar uma história

O repositório final não deve comunicar apenas:

```text
usei Spring Boot,
PostgreSQL e Kafka.
```

Ele deve comunicar:

```text
havia um problema de orquestracao;

modelei boundaries;

defini autoridade;

protegi comandos duplicados;

tratei efeitos assincronos;

criei observabilidade de jornada;

planejei rollout;

produzi evidence;

defendi trade-offs.
```

### Definição precisa proteger o futuro

Uma boa definição também registra o que não será construído.

Isso evita que o projeto se transforme em:

- e-commerce completo;
- ERP;
- plataforma de pagamentos;
- WMS;
- CRM;
- sistema de transportadora;
- marketplace;
- ferramenta de analytics completa.

OrderFlow coordenará o ciclo do pedido, mas integrará ou simulará capacidades externas quando necessário.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-671-definicao-projeto-final/orderflow-final-project-definition

Set-Location `
  labs/m20/aula-671-definicao-projeto-final/orderflow-final-project-definition
```

---

### 2. Criar o Final Project Definition Charter

Arquivo:

```text
definition/FINAL_PROJECT_DEFINITION_CHARTER.md
```

Conteúdo:

```markdown
# Final Project Definition Charter

Contexto

Inicio do Modulo 20.

Objetivo

Escolher e definir
um projeto final
executavel,
defensavel
e adequado ao portfolio.

Resultados esperados

- projeto escolhido;
- problema registrado;
- objetivos definidos;
- nao objetivos protegidos;
- competencias demonstraveis;
- evidencias planejadas;
- riscos iniciais;
- ponte para backlog.

Principios

- problem before framework;
- depth before feature count;
- evidence before claim;
- scope must be finishable;
- architecture must be defensible;
- portfolio must be sanitized;
- backlog belongs to lesson 672.
```

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/final-project-definition-contract.yaml
```

Conteúdo:

```yaml
finalProjectDefinition:
  module:
    M20

  required:
    - definition-charter
    - project-candidates
    - selection-criteria
    - candidate-scorecard
    - final-project-decision
    - business-context
    - problem-statement
    - vision
    - goals
    - non-goals
    - target-users
    - quality-hypotheses
    - constraints
    - assumptions
    - success-criteria
    - learning-objectives
    - evidence-plan
    - portfolio-narrative
    - governance
    - scope-guardrails
    - risk-hypotheses
    - reports
    - evidence
    - gate

  forbidden:
    - technology-showcase-without-problem
    - unlimited-scope
    - project-without-non-goals
    - project-without-evidence-plan
    - real-sensitive-data
    - detailed-backlog
    - detailed-functional-scope
    - final-domain-model
    - final-database-model
    - final-C4
    - repository-professional-setup

  nextLesson:
    code:
      M20.02
```

---

### 4. Criar o catálogo de candidatos

Arquivo:

```text
definition/PROJECT_CANDIDATES.md
```

Candidatos:

```text
Candidate A:
Digital Wallet.

Candidate B:
Diagnostic Booking.

Candidate C:
Order and Fulfillment Orchestration.

Candidate D:
Field Service Platform.
```

Não escolha por preferência imediata.

Primeiro, registre vantagens, riscos e capacidade de conclusão.

---

### 5. Definir critérios de seleção

Arquivo:

```text
definition/SELECTION_CRITERIA.md
```

Critérios:

```text
Portfolio Value;

Domain Richness;

Java Backend Coverage;

Architecture Evidence;

Operational Evidence;

Security Relevance;

Interview Narrative;

Scope Control;

Implementation Feasibility;

Originality in the Formation.
```

Cada critério receberá peso de `1` a `5`.

---

### 6. Criar SelectionCriterion

```java
package br.com.formacao.finalproject.definition;

import java.util.Objects;

public record SelectionCriterion(
        String id,
        String name,
        int weight,
        String rationale) {

    public SelectionCriterion {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(rationale);

        if (weight < 1 || weight > 5) {
            throw new IllegalArgumentException(
                    "Weight must be between 1 and 5");
        }
    }
}
```

---

### 7. Criar ProjectCandidate

```java
package br.com.formacao.finalproject.definition;

import java.util.List;
import java.util.Objects;

public record ProjectCandidate(
        String id,
        String name,
        String problem,
        List<String> strengths,
        List<String> risks,
        String scopeAssessment) {

    public ProjectCandidate {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(problem);
        strengths = List.copyOf(strengths);
        risks = List.copyOf(risks);
        Objects.requireNonNull(scopeAssessment);
    }
}
```

---

### 8. Criar o scorecard de candidatos

Arquivo:

```text
definition/CANDIDATE_SCORECARD.md
```

Exemplo resumido:

```text
Digital Wallet:
portfolio 5;
domain 5;
feasibility 2;
risk 1.

Diagnostic Booking:
portfolio 4;
domain 5;
feasibility 4;
originality 2.

OrderFlow:
portfolio 5;
domain 5;
feasibility 4;
architecture evidence 5;
originality 5.

Field Service:
portfolio 4;
domain 5;
feasibility 4;
originality 2.
```

A nota final precisa considerar pesos.

---

### 9. Modelar CandidateScore

```java
package br.com.formacao.finalproject.definition;

import java.util.Map;

public record CandidateScore(
        String candidateId,
        Map<String, Integer> scores) {

    public CandidateScore {
        scores = Map.copyOf(scores);

        scores.forEach((criterion, value) -> {
            if (value < 0 || value > 5) {
                throw new IllegalArgumentException(
                        "Score must be between 0 and 5");
            }
        });
    }

    public int weightedTotal(
            Map<String, SelectionCriterion> criteria) {

        return scores.entrySet()
                .stream()
                .mapToInt(entry ->
                        entry.getValue()
                        * criteria.get(entry.getKey()).weight())
                .sum();
    }
}
```

---

### 10. Avaliar o candidato Digital Wallet

Pontos fortes:

- estados ricos;
- segurança;
- idempotência;
- ledger;
- eventos;
- ótima narrativa de engenharia.

Riscos:

- domínio financeiro exige precisão elevada;
- pode gerar interpretações regulatórias;
- ledger completo aumenta muito o escopo;
- risco de priorizar complexidade sobre conclusão.

Decisão:

```text
nao selecionado.
```

---

### 11. Avaliar Diagnostic Booking

Pontos fortes:

- concorrência de agenda;
- dados sensíveis;
- disponibilidade;
- integração;
- jornadas claras.

Riscos:

- domínio usado na prova prática da aula 668;
- baixa originalidade dentro da formação;
- repetição de decisões já demonstradas.

Decisão:

```text
nao selecionado.
```

---

### 12. Avaliar Field Service Platform

Pontos fortes:

- domínio rico;
- execução distribuída;
- checklist;
- capacidade;
- operação.

Riscos:

- forte sobreposição com o projeto de arquitetura de OS;
- portfólio ficaria repetitivo;
- menor demonstração de transferência para outro domínio.

Decisão:

```text
nao selecionado.
```

---

### 13. Selecionar OrderFlow

Pontos fortes:

- domínio conhecido pelo mercado;
- estados e invariantes;
- integrações externas;
- concorrência de estoque;
- comandos idempotentes;
- efeitos assíncronos;
- segurança e tenants;
- ótima narrativa de entrevistas;
- escopo controlável;
- possibilidade de vertical slices.

Riscos:

- virar e-commerce completo;
- incluir pagamento real;
- incluir estoque real completo;
- incluir transportadora completa;
- tentar implementar muitos serviços.

Decisão:

```text
selecionado
com guardrails de escopo.
```

---

### 14. Criar a decisão oficial

Arquivo:

```text
definition/FINAL_PROJECT_DECISION.md
```

Conteúdo mínimo:

- contexto;
- candidatos;
- critérios;
- score;
- decisão;
- justificativa;
- riscos;
- limitações;
- evidence esperada;
- trigger de revisão.

Trigger de revisão:

```text
se o backlog indicar
que o projeto nao cabe
nos milestones do M20,
reabrir a definicao
e reduzir o dominio.
```

---

### 15. Definir o contexto de negócio

Arquivo:

```text
definition/BUSINESS_CONTEXT.md
```

Contexto fictício:

```text
empresas recebem pedidos
por portal,
marketplace
e integracoes B2B.

cada canal possui
identificadores,
regras
e formatos diferentes.

estoque,
pagamento,
expedicao
e comunicacao
sao capacidades externas
ou separadas.

OrderFlow coordena
o ciclo do pedido
com rastreabilidade,
seguranca
e consistencia explicita.
```

---

### 16. Criar o Problem Statement

Arquivo:

```text
definition/PROBLEM_STATEMENT.md
```

Problema:

```text
pedidos recebidos
por diferentes canais
podem ser duplicados,
ficar presos,
perder sincronizacao
ou gerar efeitos inconsistentes.
```

Impactos:

- reserva duplicada;
- cobrança duplicada simulada;
- expedição indevida;
- cancelamento incompleto;
- baixa rastreabilidade;
- dificuldade operacional;
- integrações frágeis.

---

### 17. Criar a visão do projeto

Arquivo:

```text
definition/PROJECT_VISION.md
```

Visão:

```text
OrderFlow sera uma plataforma backend
multi-tenant
que recebe,
valida,
orquestra
e acompanha pedidos,

mantendo autoridade de estado,
contratos claros,
efeitos idempotentes,
observabilidade de jornada
e operacao defensavel.
```

---

### 18. Definir usuários-alvo

Arquivo:

```text
definition/TARGET_USERS.md
```

Usuários e sistemas:

- operador de e-commerce;
- analista de operações;
- administrador do tenant;
- suporte técnico;
- auditor;
- canal de vendas;
- serviço de estoque;
- provedor de pagamento simulado;
- serviço de expedição;
- serviço de comunicação.

O projeto será backend-first.

Interfaces gráficas completas não serão necessárias para provar o objetivo principal.

---

### 19. Criar objetivos do projeto

Arquivo:

```text
definition/PROJECT_GOALS.md
```

Objetivos:

```text
G-001:
receber pedidos
com idempotencia.

G-002:
controlar ciclo de vida
com invariantes.

G-003:
coordenar efeitos externos
sem transacao distribuida implicita.

G-004:
isolar tenants.

G-005:
produzir rastreabilidade
ponta a ponta.

G-006:
permitir operacao,
reprocessamento
e recovery.

G-007:
produzir portfolio
e defesa tecnica.
```

---

### 20. Modelar ProjectGoal

```java
package br.com.formacao.finalproject.definition;

import java.util.List;
import java.util.Objects;

public record ProjectGoal(
        String id,
        String statement,
        String businessOutcome,
        List<String> expectedEvidence) {

    public ProjectGoal {
        Objects.requireNonNull(id);
        Objects.requireNonNull(statement);
        Objects.requireNonNull(businessOutcome);
        expectedEvidence =
                List.copyOf(expectedEvidence);

        if (expectedEvidence.isEmpty()) {
            throw new IllegalArgumentException(
                    "Goal requires expected evidence");
        }
    }
}
```

---

### 21. Criar não objetivos

Arquivo:

```text
definition/PROJECT_NON_GOALS.md
```

Não objetivos:

```text
NG-001:
nao criar storefront completo.

NG-002:
nao implementar adquirencia real.

NG-003:
nao criar WMS completo.

NG-004:
nao criar ERP financeiro.

NG-005:
nao implementar roteirizacao.

NG-006:
nao criar marketplace.

NG-007:
nao criar analytics corporativo completo.

NG-008:
nao distribuir cada modulo
como microservico automaticamente.
```

---

### 22. Definir jornadas em alto nível

Arquivo:

```text
definition/HIGH_LEVEL_JOURNEYS.md
```

Jornadas candidatas:

```text
Receive Order;

Validate Order;

Reserve Inventory;

Authorize Payment;

Release Order;

Cancel Order;

Track Fulfillment;

Reprocess Failed Effect.
```

Não detalhe passos, APIs ou histórias.

Isso pertence às próximas aulas.

---

### 23. Registrar hipóteses de capabilities

Arquivo:

```text
definition/CAPABILITY_HYPOTHESES.md
```

Hipóteses:

- Order Intake;
- Order Management;
- Inventory Coordination;
- Payment Coordination;
- Fulfillment Coordination;
- Communication;
- Audit;
- Tenant Administration;
- Operational Recovery.

O termo `hipótese` é importante.

A modelagem de domínio final ocorrerá na aula 674.

---

### 24. Definir hipóteses de qualidade

Arquivo:

```text
definition/QUALITY_HYPOTHESES.md
```

Hipóteses:

```text
zero efeito duplicado
para o mesmo comando idempotente;

zero acesso cross-tenant;

pedidos consultaveis
com baixa latencia;

efeitos externos
reprocessaveis;

falha de notificacao
nao bloqueia estado principal;

trilha de auditoria
para mudancas criticas;

rollout reversivel;

jornada observavel.
```

Métricas exatas serão refinadas em aulas posteriores.

---

### 25. Registrar restrições

Arquivo:

```text
definition/CONSTRAINTS.md
```

Restrições iniciais:

- Java 21;
- Spring Boot;
- PostgreSQL;
- migrations versionadas;
- execução local por Docker;
- testes automatizados;
- dados fictícios;
- documentação em repositório;
- projeto executável por uma pessoa;
- artefatos públicos sanitizados;
- conclusão dentro do M20.

---

### 26. Registrar premissas

Arquivo:

```text
definition/ASSUMPTIONS.md
```

Premissas:

- estoque será interno simplificado ou provider simulado;
- pagamento será provider simulado;
- expedição será integração simulada;
- tenants compartilharão plataforma com isolamento lógico inicial;
- mensageria poderá ser executada localmente;
- o projeto priorizará profundidade sobre volume de features;
- uma vertical slice completa será mais valiosa que vários fluxos incompletos.

Toda premissa precisa de trigger de revisão.

---

### 27. Definir critérios de sucesso

Arquivo:

```text
definition/SUCCESS_CRITERIA.md
```

Critérios de sucesso:

```text
SC-001:
projeto sobe localmente
por procedimento documentado.

SC-002:
fluxo principal executa
com testes automatizados.

SC-003:
comandos criticos
sao idempotentes.

SC-004:
tenant isolation
e testado.

SC-005:
efeitos assincronos
possuem recovery.

SC-006:
metricas, logs e traces
explicam a jornada.

SC-007:
decisoes possuem ADRs.

SC-008:
README conta a historia.

SC-009:
portfolio e sanitizado.

SC-010:
solucao pode ser defendida.
```

---

### 28. Modelar SuccessMetric

```java
package br.com.formacao.finalproject.definition;

import java.util.Objects;

public record SuccessMetric(
        String id,
        String description,
        String measurement,
        String acceptanceCriteria,
        String owner) {

    public SuccessMetric {
        Objects.requireNonNull(id);
        Objects.requireNonNull(description);
        Objects.requireNonNull(measurement);
        Objects.requireNonNull(acceptanceCriteria);
        Objects.requireNonNull(owner);
    }
}
```

---

### 29. Definir objetivos de aprendizagem

Arquivo:

```text
definition/LEARNING_OBJECTIVES.md
```

Ao finalizar o projeto, você deve conseguir:

- explicar o problema sem mencionar framework;
- modelar um domínio com invariantes;
- separar responsabilidades;
- construir casos de uso;
- versionar banco;
- proteger contratos;
- tratar duplicidade;
- coordenar efeitos externos;
- proteger tenants;
- escrever testes em camadas;
- observar a jornada;
- operar falhas;
- justificar trade-offs;
- apresentar o repositório;
- defender decisões em entrevista.

---

### 30. Criar o plano de evidências

Arquivo:

```text
definition/EVIDENCE_PLAN.md
```

Evidências esperadas:

- domain tests;
- use case tests;
- integration tests;
- contract tests;
- idempotency tests;
- tenant isolation tests;
- migration tests;
- architecture tests;
- observability screenshots sanitizados;
- runbook execution;
- CI report;
- ADRs;
- C4;
- API documentation;
- event schemas;
- load test básico;
- defense pack.

---

### 31. Criar EvidenceCommitment

```java
package br.com.formacao.finalproject.definition;

import java.util.List;
import java.util.Objects;

public record EvidenceCommitment(
        String capability,
        List<String> evidenceTypes,
        String acceptance,
        String targetMilestone) {

    public EvidenceCommitment {
        Objects.requireNonNull(capability);
        evidenceTypes = List.copyOf(evidenceTypes);
        Objects.requireNonNull(acceptance);
        Objects.requireNonNull(targetMilestone);

        if (evidenceTypes.isEmpty()) {
            throw new IllegalArgumentException(
                    "Evidence commitment cannot be empty");
        }
    }
}
```

---

### 32. Criar narrativa de portfólio

Arquivo:

```text
definition/PORTFOLIO_NARRATIVE.md
```

Narrativa inicial:

```text
OrderFlow demonstra
como uma plataforma Java Backend
pode receber pedidos
por canais distintos,

preservar autoridade de estado,
evitar duplicidade,
coordenar integracoes,
isolar tenants,
observar jornadas
e operar falhas.
```

Estrutura futura da narrativa:

- contexto;
- problema;
- responsabilidade;
- decisões;
- alternativas;
- trade-offs;
- evidências;
- resultados;
- aprendizados.

---

### 33. Criar narrativa para entrevista

Registre uma resposta inicial de 90 segundos:

```text
Meu projeto final e o OrderFlow,
um backend multi-tenant
para orquestrar o ciclo de pedidos.

Escolhi esse dominio
porque ele exige estado,
idempotencia,
integracoes,
consistencia,
seguranca,
observabilidade
e operacao.

O foco nao e criar
um e-commerce completo,
mas demonstrar engenharia backend
em um fluxo defensavel,
com testes,
ADRs,
C4,
runbooks
e evidence.
```

A resposta será refinada ao longo do M20.

---

### 34. Criar governança do projeto

Arquivo:

```text
definition/PROJECT_GOVERNANCE.md
```

Defina:

- owner do projeto;
- fonte da verdade;
- processo de decisão;
- status semanal;
- controle de escopo;
- critérios para reabrir definição;
- registro de riscos;
- revisão de evidências;
- decisão de milestone;
- tratamento de blockers.

Como projeto individual, você pode ocupar vários papéis.

Mesmo assim, os papéis devem ser explícitos.

---

### 35. Criar guardrails de escopo

Arquivo:

```text
definition/SCOPE_GUARDRAILS.md
```

Guardrails:

```text
SG-001:
nenhuma feature nova
sem ligacao com objetivo.

SG-002:
nenhum provider real
necessario para demo.

SG-003:
nenhum microservico
sem justificativa.

SG-004:
nenhum frontend completo
antes do backend defensavel.

SG-005:
nenhum framework
apenas para aumentar stack.

SG-006:
nenhum fluxo critico
sem teste e evidence.

SG-007:
backlog detalhado
somente na aula 672.
```

---

### 36. Registrar riscos iniciais

Arquivo:

```text
definition/INITIAL_RISK_HYPOTHESES.md
```

Riscos:

```text
R-001:
escopo crescer.

R-002:
projeto virar vitrine de tecnologia.

R-003:
integracoes consumirem tempo excessivo.

R-004:
dominio ficar superficial.

R-005:
documentacao atrasar.

R-006:
evidencias ficarem para o final.

R-007:
infra local ficar pesada.

R-008:
fluxos incompletos prejudicarem defesa.
```

Cada risco precisa de owner, mitigação e trigger.

---

### 37. Criar perguntas abertas

Arquivo:

```text
definition/OPEN_DEFINITION_QUESTIONS.md
```

Perguntas permitidas:

- qual será a vertical slice inicial?
- quais providers serão simulados?
- qual nível de isolamento de tenant?
- mensageria entra no primeiro milestone?
- quais fluxos entram no MVP?
- qual evidência será pública?
- qual orçamento de infraestrutura local?

Essas perguntas serão respondidas pelo backlog, pelo escopo e pelas decisões futuras.

---

### 38. Criar a fronteira da próxima aula

Arquivo:

```text
definition/NEXT_LESSON_BOUNDARY.md
```

Registre:

```text
Aula 671:
define projeto,
problema,
valor,
limites,
competencias
e evidence.

Aula 672:
organiza trabalho
em backlog,
epicos,
historias,
dependencias,
prioridades
e milestones.
```

---

### 39. Criar FinalProjectDefinition

```java
package br.com.formacao.finalproject.definition;

import java.util.List;
import java.util.Objects;

public record FinalProjectDefinition(
        String projectName,
        String tagline,
        String problemStatement,
        String vision,
        List<ProjectGoal> goals,
        List<String> nonGoals,
        List<ProjectConstraint> constraints,
        List<EvidenceCommitment> evidenceCommitments,
        String nextLesson) {

    public FinalProjectDefinition {
        Objects.requireNonNull(projectName);
        Objects.requireNonNull(tagline);
        Objects.requireNonNull(problemStatement);
        Objects.requireNonNull(vision);
        goals = List.copyOf(goals);
        nonGoals = List.copyOf(nonGoals);
        constraints = List.copyOf(constraints);
        evidenceCommitments =
                List.copyOf(evidenceCommitments);
        Objects.requireNonNull(nextLesson);

        if (goals.isEmpty()) {
            throw new IllegalArgumentException(
                    "Final project requires goals");
        }

        if (nonGoals.isEmpty()) {
            throw new IllegalArgumentException(
                    "Final project requires non-goals");
        }
    }
}
```

---

### 40. Testar seleção por critérios

Cenário:

- candidato com alta popularidade;
- baixa viabilidade;
- nenhuma evidência operacional;
- escopo ilimitado.

Resultado:

```text
FAIL_CANDIDATE_SELECTION
```

---

### 41. Testar projeto sem não objetivos

Definição sem `nonGoals`.

Resultado:

```text
FAIL_PROJECT_NON_GOALS
```

---

### 42. Testar objetivo sem evidência

Goal:

```text
sistema confiavel.
```

Sem teste, métrica ou aceitação.

Resultado:

```text
FAIL_GOAL_EVIDENCE
```

---

### 43. Testar antecipação do backlog

A definição contém:

- histórias detalhadas;
- story points;
- sprints;
- dependências completas.

Resultado:

```text
FAIL_BACKLOG_ANTICIPATION
```

---

### 44. Criar reports

Exemplo:

```yaml
finalProjectDefinition:
  candidates:
    total:
      4
    evaluated:
      4
    selected:
      OrderFlow

  definition:
    goals:
      7
    nonGoals:
      8
    constraints:
      10
    assumptions:
      7
    successCriteria:
      10

  evidence:
    commitments:
      16
    uncoveredGoals:
      0

  portfolio:
    narrativeStatus:
      READY_INITIAL

  scope:
    guardrails:
      7

  gate:
    PASS
```

---

### 45. Criar evidence

Arquivo:

```text
contracts/final-project-definition-evidence.yaml
```

Campos permitidos:

- lesson;
- module;
- candidate count;
- evaluated candidate count;
- selected project;
- selection criterion count;
- goal count;
- non-goal count;
- target user count;
- high-level journey count;
- capability hypothesis count;
- quality hypothesis count;
- constraint count;
- assumption count;
- success criterion count;
- learning objective count;
- evidence commitment count;
- goal evidence coverage;
- scope guardrail count;
- initial risk count;
- portfolio narrative status;
- backlog anticipation status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados reais de empresas;
- clientes reais;
- credenciais;
- endpoints privados;
- valores financeiros reais;
- backlog detalhado;
- modelagem final de domínio;
- conteúdo futuro do M20.

---

### 46. Criar o gate

O gate valida:

- charter;
- candidates;
- criteria;
- scorecard;
- decision;
- problem;
- vision;
- goals;
- non-goals;
- users;
- hypotheses;
- constraints;
- assumptions;
- success;
- learning objectives;
- evidence plan;
- portfolio narrative;
- governance;
- guardrails;
- risks;
- next lesson boundary;
- tests;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_DEFINITION_CHARTER;

FAIL_CANDIDATE_CATALOG;

FAIL_SELECTION_CRITERIA;

FAIL_CANDIDATE_SCORECARD;

FAIL_FINAL_DECISION;

FAIL_PROBLEM_STATEMENT;

FAIL_PROJECT_VISION;

FAIL_PROJECT_GOAL;

FAIL_PROJECT_NON_GOAL;

FAIL_SUCCESS_CRITERIA;

FAIL_EVIDENCE_PLAN;

FAIL_PORTFOLIO_NARRATIVE;

FAIL_SCOPE_GUARDRAIL;

FAIL_RISK_HYPOTHESIS;

FAIL_BACKLOG_ANTICIPATION;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 47. Executar validação completa

```powershell
.\scripts\m20\orderflow-final-project-definition\validate-definition-contract.ps1

.\scripts\m20\orderflow-final-project-definition\validate-candidate-selection.ps1

.\scripts\m20\orderflow-final-project-definition\validate-project-goals.ps1

.\scripts\m20\orderflow-final-project-definition\validate-project-non-goals.ps1

.\scripts\m20\orderflow-final-project-definition\validate-evidence-plan.ps1

.\scripts\m20\orderflow-final-project-definition\validate-portfolio-narrative.ps1

.\scripts\m20\orderflow-final-project-definition\validate-scope-guardrails.ps1

.\scripts\m20\orderflow-final-project-definition\validate-risk-hypotheses.ps1

.\scripts\m20\orderflow-final-project-definition\run-project-definition-tests.ps1

.\scripts\m20\orderflow-final-project-definition\collect-project-definition-evidence.ps1

.\scripts\m20\orderflow-final-project-definition\verify-project-definition-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 48. Encerrar a definição

Confirme:

- projeto escolhido;
- candidatos avaliados;
- critérios ponderados;
- decisão registrada;
- problema claro;
- visão clara;
- objetivos;
- não objetivos;
- usuários-alvo;
- jornadas de alto nível;
- hipóteses de capabilities;
- hipóteses de qualidade;
- restrições;
- premissas;
- critérios de sucesso;
- objetivos de aprendizagem;
- plano de evidências;
- narrativa de portfólio;
- governança;
- guardrails;
- riscos;
- perguntas abertas;
- ponte para backlog;
- reports;
- evidence;
- gate aprovado.

---

## Entendendo o que foi feito

### O projeto foi escolhido por critérios

Você evitou selecionar um domínio apenas por popularidade ou gosto pessoal.

Comparou valor de portfólio, riqueza de domínio, viabilidade, evidências e controle de escopo.

### OrderFlow foi recortado como plataforma de orquestração

O projeto não será um e-commerce completo.

Ele coordenará o ciclo de pedido e tratará capacidades externas por contratos e simulações controladas.

### Objetivos e não objetivos ficaram explícitos

Os objetivos mostram o que o projeto precisa provar.

Os não objetivos impedem expansão silenciosa.

### Evidências entraram desde a definição

Testes, reports, ADRs, C4, runbooks, observabilidade e CI não ficarão para o final.

Eles fazem parte do produto final desde o primeiro dia.

### O portfólio ganhou uma narrativa

A história não será “usei tecnologias”.

Será “resolvi um problema de orquestração por decisões verificáveis”.

### A próxima etapa ficou protegida

Você não detalhou backlog, domínio, banco, C4 ou repositório antes da hora.

A definição criou boundaries para as próximas aulas.

---

## Erros comuns importantes

### Escolher projeto por hype

Tecnologia popular não garante domínio defensável.

### Criar escopo enorme

Projeto inacabado produz pouca evidence.

### Não registrar não objetivos

Toda ideia parece obrigatória.

### Usar provider real cedo demais

A integração externa domina o projeto.

### Tratar portfólio como screenshot

Portfólio precisa de contexto, decisão e evidence.

### Deixar testes para o final

Claims importantes ficam sem prova.

### Criar muitos microserviços

O custo operacional cresce antes de existir necessidade.

### Definir stack antes do problema

O projeto vira demonstração de framework.

### Detalhar backlog nesta aula

A ordenação do trabalho pertence à aula 672.

### Definir domínio final agora

A modelagem aprofundada pertence à aula 674.

---

## Comandos úteis

### Validar a seleção

```powershell
.\scripts\m20\orderflow-final-project-definition\validate-candidate-selection.ps1
```

### Validar objetivos

```powershell
.\scripts\m20\orderflow-final-project-definition\validate-project-goals.ps1
```

### Validar evidências

```powershell
.\scripts\m20\orderflow-final-project-definition\validate-evidence-plan.ps1
```

### Executar testes

```powershell
.\scripts\m20\orderflow-final-project-definition\run-project-definition-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m20\orderflow-final-project-definition\verify-project-definition-gate.ps1
```

---

## Exercício guiado

Crie uma definição alternativa para um projeto chamado:

```text
SupportFlow

Plataforma multi-tenant
de atendimento e escalonamento tecnico.
```

Produza:

1. problema;
2. candidatos comparáveis;
3. critérios;
4. scorecard;
5. decisão;
6. objetivos;
7. não objetivos;
8. usuários;
9. hipóteses de qualidade;
10. restrições;
11. critérios de sucesso;
12. evidence plan;
13. narrativa de portfólio;
14. riscos;
15. gate.

Depois compare SupportFlow com OrderFlow e explique qual projeto tem maior valor para o objetivo profissional desta formação.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 670 e ponte para a aula 672 foram preservadas;
- Módulo 20 foi iniciado;
- laboratório `orderflow-final-project-definition` foi criado;
- Final Project Definition Charter foi criado;
- contrato principal foi criado;
- candidatos foram catalogados;
- critérios de seleção foram definidos;
- pesos foram registrados;
- ProjectCandidate foi criado;
- SelectionCriterion foi criado;
- CandidateScore foi criado;
- candidatos foram avaliados;
- OrderFlow foi selecionado;
- decisão oficial foi criada;
- contexto de negócio foi registrado;
- Problem Statement foi criado;
- Project Vision foi criada;
- usuários-alvo foram definidos;
- objetivos foram criados;
- objetivos possuem evidence;
- ProjectGoal foi criado;
- não objetivos foram criados;
- jornadas foram mantidas em alto nível;
- capability hypotheses foram registradas;
- quality hypotheses foram registradas;
- restrições foram definidas;
- premissas foram definidas;
- critérios de sucesso foram criados;
- SuccessMetric foi criado;
- objetivos de aprendizagem foram definidos;
- Evidence Plan foi criado;
- EvidenceCommitment foi criado;
- narrativa de portfólio foi criada;
- narrativa de entrevista foi criada;
- governança foi definida;
- guardrails de escopo foram criados;
- riscos iniciais foram registrados;
- perguntas abertas foram registradas;
- fronteira da aula 672 foi criada;
- FinalProjectDefinition foi criado;
- seleção, non-goals, evidence e antecipação foram testados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- backlog detalhado não foi antecipado;
- escopo funcional detalhado não foi antecipado;
- domínio, banco, C4, ADRs e repositório não foram antecipados.

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
  labs/m20/aula-671-definicao-projeto-final/orderflow-final-project-definition `
  scripts/m20/orderflow-final-project-definition `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|privateEndpoint|productionTopology|realPaymentData"
```

Commit recomendado:

```powershell
git commit -m "docs(m20): definir projeto final OrderFlow"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- empresas reais;
- clientes reais;
- credenciais;
- dados financeiros reais;
- endpoints privados;
- topologia corporativa;
- backlog detalhado;
- conteúdo futuro do M20.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou o Módulo 20 e definiu oficialmente o projeto final da formação.

O projeto escolhido foi:

```text
OrderFlow

Plataforma multi-tenant
de orquestracao de pedidos
e fulfillment.
```

Você criou:

```text
Final Project Definition Charter;

Project Candidates;

Selection Criteria;

Candidate Scorecard;

Final Project Decision;

Business Context;

Problem Statement;

Project Vision;

Project Goals;

Project Non-Goals;

Target Users;

High-Level Journeys;

Capability Hypotheses;

Quality Hypotheses;

Constraints;

Assumptions;

Success Criteria;

Learning Objectives;

Evidence Plan;

Portfolio Narrative;

Project Governance;

Scope Guardrails;

Initial Risk Hypotheses;

reports, evidence e gate.
```

Você comprovou que um projeto final profissional começa antes do código.

Ele começa pela escolha consciente de um problema, pela definição de limites, pela seleção das competências a demonstrar e pelo planejamento das evidências.

A próxima aula será:

```text
672 - M20.02 - Backlog projeto final
```

Nela, você transformará a definição do OrderFlow em um backlog executável, priorizado e conectado a milestones, dependências, critérios de aceite e evidências.

Nenhum backlog detalhado foi produzido nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Avaliei candidatos.
- [ ] Defini critérios.
- [ ] Selecionei OrderFlow.
- [ ] Registrei problema e visão.
- [ ] Defini objetivos e não objetivos.
- [ ] Registrei restrições e premissas.
- [ ] Planejei evidências.
- [ ] Criei narrativa de portfólio.
- [ ] Protegi o escopo.
- [ ] Preservei a aula 672.

---

## Troubleshooting adicional

### Ainda estou em dúvida sobre o projeto

Retorne aos critérios e compare evidence, viabilidade e valor de portfólio.

### OrderFlow parece grande

Mantenha o domínio e reduza o número de jornadas no backlog.

### Quero implementar pagamento real

Use provider simulado até existir justificativa e segurança suficiente.

### Quero criar frontend completo

Priorize backend, contratos, testes e operação.

### Quero usar muitos serviços

Espere C4 e ADRs demonstrarem necessidade.

### Não sei quais evidências produzir

Ligue cada objetivo a pelo menos um teste, report, artefato ou rehearsal.

### A narrativa parece genérica

Explique problema, decisão, trade-off e prova.

### O projeto não parece original

A originalidade está na qualidade das decisões e da execução, não apenas no tema.

### Já quero criar as histórias

O backlog será construído na aula 672.

### Já quero modelar Order

A modelagem aprofundada pertence à aula 674.

---

## Perguntas de revisão

1. Por que o projeto final não começa pelo código?
2. Para que serve o catálogo de candidatos?
3. Quais critérios orientaram a escolha?
4. Por que Digital Wallet não foi selecionado?
5. Por que Diagnostic Booking não foi selecionado?
6. Por que Field Service não foi selecionado?
7. Qual projeto foi escolhido?
8. Qual problema o OrderFlow resolve?
9. O OrderFlow é um e-commerce completo?
10. O que são objetivos?
11. O que são não objetivos?
12. Por que objetivos precisam de evidence?
13. O que são hypotheses de capability?
14. Por que ainda são hipóteses?
15. O que são quality hypotheses?
16. Para que servem guardrails de escopo?
17. O que entra no Evidence Plan?
18. O que uma narrativa de portfólio precisa contar?
19. Por que definir governance em projeto individual?
20. O que são initial risk hypotheses?
21. Quando a definição deve ser reaberta?
22. O que o gate valida?
23. O backlog foi criado?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Porque problema, limites e evidence vêm antes da implementação.
2. Comparar alternativas conscientemente.
3. Valor, domínio, viabilidade, evidence, escopo e narrativa.
4. Escopo e risco elevados.
5. Já foi usado na prova prática.
6. Sobreposição com o projeto de OS.
7. OrderFlow.
8. Orquestração confiável do ciclo de pedidos.
9. Não.
10. Resultados que o projeto precisa demonstrar.
11. Limites explícitos do projeto.
12. Para transformar claim em prova.
13. Capacidades candidatas do negócio.
14. Porque o domínio será modelado depois.
15. Propriedades de qualidade ainda a refinar.
16. Impedir crescimento silencioso.
17. Testes, reports, decisões, operação e defesa.
18. Contexto, decisão, trade-off, evidence e aprendizado.
19. Para tornar responsabilidades e decisões explícitas.
20. Riscos conhecidos antes do backlog.
21. Quando não couber no M20 ou perder coerência.
22. Integridade da definição.
23. Não.
24. Backlog projeto final.
25. Backlog projeto final.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 671 - M20.01 - Definicao projeto final

- Continuei após o fechamento do Módulo 19.
- Iniciei oficialmente o Módulo 20.
- Criei o laboratório `orderflow-final-project-definition`.
- Criei Final Project Definition Charter.
- Criei o contrato da definição.
- Cataloguei projetos candidatos.
- Defini critérios de seleção.
- Criei SelectionCriterion.
- Criei ProjectCandidate.
- Criei Candidate Scorecard.
- Criei CandidateScore.
- Avaliei Digital Wallet.
- Avaliei Diagnostic Booking.
- Avaliei Field Service Platform.
- Selecionei OrderFlow.
- Criei Final Project Decision.
- Registrei Business Context.
- Criei Problem Statement.
- Criei Project Vision.
- Defini Target Users.
- Criei Project Goals.
- Criei ProjectGoal.
- Criei Project Non-Goals.
- Registrei High-Level Journeys.
- Registrei Capability Hypotheses.
- Registrei Quality Hypotheses.
- Registrei Constraints.
- Registrei Assumptions.
- Criei Success Criteria.
- Criei SuccessMetric.
- Defini Learning Objectives.
- Criei Evidence Plan.
- Criei EvidenceCommitment.
- Criei Portfolio Narrative.
- Criei narrativa inicial para entrevistas.
- Criei Project Governance.
- Criei Scope Guardrails.
- Registrei Initial Risk Hypotheses.
- Registrei Open Definition Questions.
- Criei Next Lesson Boundary.
- Criei FinalProjectDefinition.
- Testei seleção, non-goals, evidence e antecipação.
- Criei reports, evidence e gate.
- Não antecipei backlog, escopo, domínio, banco, C4, ADRs ou repositório.
- Próxima aula: Backlog projeto final.
```

---

## Referência técnica curta

- Final Project Definition.
- Project Candidate.
- Selection Criterion.
- Candidate Scorecard.
- Problem Statement.
- Project Vision.
- Project Goal.
- Project Non-Goal.
- Success Criterion.
- Evidence Plan.
- Portfolio Narrative.
- Scope Guardrail.
- Risk Hypothesis.
- Definition Gate.

Regra final:

```text
A definição do projeto final deve escolher conscientemente um problema que caiba no M20 e produza evidências profissionais: candidatos são comparados por valor de portfólio, riqueza de domínio, cobertura Java Backend, arquitetura, operação, segurança, narrativa, viabilidade e controle de escopo, e OrderFlow é selecionado como plataforma multi-tenant de orquestração de pedidos e fulfillment porque permite demonstrar estado, invariantes, concorrência, idempotência, integrações, eventos, segurança, observabilidade, recovery e defesa sem exigir um e-commerce completo; o contexto registra canais heterogêneos, efeitos externos e risco de inconsistência, a visão concentra autoridade e rastreabilidade, goals possuem business outcomes e expected evidence, non-goals excluem storefront, adquirência, WMS, ERP, marketplace, roteirização e distribuição automática, journeys e capabilities permanecem hipóteses até as aulas apropriadas, quality hypotheses orientam zero duplicidade, isolamento de tenant, recovery, auditoria e rollout reversível, constraints e assumptions mantêm execução individual e providers simulados, success criteria medem execução, testes, idempotência, segurança, observabilidade, ADRs, documentação, portfólio e defesa, o Evidence Plan compromete testes, reports, C4, ADRs, contracts, runbooks, CI e defense pack, a narrativa conta problema, decisão, trade-off e evidence, governance e scope guardrails impedem crescimento silencioso, riscos iniciais possuem mitigação e trigger, e o gate encerra a aula com candidates, criteria, decision, problem, vision, goals, non-goals, success, evidence, portfolio, governance, risks, reports e tests aprovados, enquanto o backlog detalhado permanece reservado para a aula 672.
```
