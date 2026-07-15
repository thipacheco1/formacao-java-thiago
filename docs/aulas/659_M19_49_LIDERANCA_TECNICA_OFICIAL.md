# 659 - M19.49 - Lideranca tecnica

## Apresentação da aula

Na aula 658, você praticou code review arquitetural.

Você classificou o risco de uma mudança, construiu um `Change Impact Map`, selecionou reviewers por ownership, transformou opiniões em findings verificáveis, exigiu evidências proporcionais e bloqueou alterações que violavam boundaries, autoridade de dados, contratos, segurança, observabilidade, performance ou rollback.

Essa prática mostrou uma verdade importante:

```text
arquitetura não é preservada
somente por documentos
ou ferramentas;

ela é preservada
por pessoas capazes de
alinhar decisões,
resolver conflitos,
distribuir responsabilidade
e manter foco no risco real.
```

Agora o problema deixa de ser apenas técnico.

Considere a mudança `Express Appointment Confirmation`.

A equipe de produto quer reduzir o tempo de confirmação.

A equipe de `Capacity` teme dupla reserva.

A equipe de `Scheduling` quer manter a Saga.

A equipe de plataforma alerta sobre custo e complexidade.

A equipe de segurança exige autorização contextual.

A operação quer previsibilidade de rollout.

A liderança executiva quer uma data.

Todos podem estar corretos dentro de sua própria perspectiva.

Liderança técnica é a capacidade de construir uma decisão coletiva tecnicamente defensável sem transformar o processo em disputa de autoridade.

O líder técnico não precisa ser gerente.

Também não precisa ser a pessoa que escreve mais código, participa de todas as reuniões ou aprova cada mudança.

Seu papel é aumentar a capacidade do grupo de tomar boas decisões.

Isso envolve:

- criar contexto compartilhado;
- tornar objetivos e restrições explícitos;
- separar fatos, hipóteses e preferências;
- estruturar discussões;
- dar voz aos owners corretos;
- identificar conflitos de interesse;
- comunicar trade-offs;
- priorizar risco e impacto;
- delegar com contexto;
- registrar decisões;
- acompanhar execução;
- escalonar quando necessário;
- proteger segurança psicológica;
- desenvolver ownership distribuído;
- evitar dependência de uma única pessoa.

A pergunta central será:

```text
como liderar uma decisão técnica
quando existem
pressão de prazo,
incerteza,
dependências,
conflitos,
riscos e múltiplos stakeholders?
```

O laboratório será:

```text
labs/m19/aula-659-lideranca-tecnica/service-scheduling-technical-leadership
```

Você conduzirá um cenário fictício:

```text
programa:
Fast Confirmation.

objetivo:
reduzir o tempo percebido
de confirmação de Appointment.

restrições:
sem dupla reserva;
sem perda de autorização;
sem esconder estado inconsistente;
sem depender de deploy coordenado;
sem ultrapassar o error budget;
sem romper o contrato atual.
```

Você criará:

- Technical Leadership Charter;
- mapa de stakeholders;
- mapa de decisão;
- framing do problema;
- catálogo de fatos e hipóteses;
- matriz de objetivos e restrições;
- modelo de influência;
- agenda de alinhamento;
- protocolo de conflito;
- matriz de delegação;
- decision log;
- plano de comunicação;
- roadmap de execução;
- risk register;
- critérios de escalonamento;
- cadência operacional;
- health checks;
- retrospectiva;
- evidence e gate.

A próxima aula será:

```text
660 - M19.50 - Mentoria e code review senior
```

A aula 660 aprofundará desenvolvimento de pessoas, feedback, perguntas de mentoria, delegação progressiva, review como ferramenta de aprendizado e formação de autonomia.

Nesta aula, mentoria aparecerá apenas como responsabilidade geral de criar contexto e distribuir ownership, sem aprofundar técnicas de acompanhamento individual.

Regra central:

```text
liderança técnica
não é controlar
todas as decisões;

é criar condições
para que o time
tome decisões melhores,
execute com clareza
e aprenda com o resultado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
657:
Dados como decisao arquitetural.

658:
Code review arquitetural.

659:
Lideranca tecnica.

660:
Mentoria e code review senior.

661:
Arquitetura corporativa brasileira.
```

A progressão é:

```text
tratar dados como responsabilidade;

verificar decisões no código;

liderar decisões e pessoas;

desenvolver autonomia técnica;

aplicar arquitetura em contexto organizacional.
```

Até aqui, o curso trabalhou DDD, bounded contexts, arquitetura hexagonal, sistemas distribuídos, consistência, microserviços, ADR, RFC, C4, fitness functions, ArchUnit, modernização, segurança, observabilidade, dados e code review arquitetural.

Agora esses conhecimentos serão usados em uma capacidade diferente:

```text
conduzir uma decisão
com pessoas reais,
interesses distintos,
limites de tempo
e responsabilidade compartilhada.
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-659-lideranca-tecnica
└── service-scheduling-technical-leadership
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/technicalleadership
    │   │           ├── stakeholder
    │   │           │   ├── Stakeholder.java
    │   │           │   ├── StakeholderRole.java
    │   │           │   ├── InfluenceLevel.java
    │   │           │   ├── InterestLevel.java
    │   │           │   └── StakeholderMap.java
    │   │           ├── decision
    │   │           │   ├── DecisionContext.java
    │   │           │   ├── DecisionOption.java
    │   │           │   ├── DecisionConstraint.java
    │   │           │   ├── DecisionOutcome.java
    │   │           │   ├── DecisionOwner.java
    │   │           │   └── DecisionRecord.java
    │   │           ├── alignment
    │   │           │   ├── AlignmentQuestion.java
    │   │           │   ├── AlignmentSession.java
    │   │           │   ├── AlignmentResult.java
    │   │           │   └── Disagreement.java
    │   │           ├── delegation
    │   │           │   ├── DelegationLevel.java
    │   │           │   ├── DelegationAssignment.java
    │   │           │   ├── DecisionBoundary.java
    │   │           │   └── DelegationReview.java
    │   │           ├── conflict
    │   │           │   ├── ConflictType.java
    │   │           │   ├── ConflictFrame.java
    │   │           │   ├── ConflictResolution.java
    │   │           │   └── EscalationDecision.java
    │   │           ├── communication
    │   │           │   ├── Audience.java
    │   │           │   ├── CommunicationMessage.java
    │   │           │   ├── CommunicationCadence.java
    │   │           │   └── CommunicationPlan.java
    │   │           ├── execution
    │   │           │   ├── TechnicalRoadmap.java
    │   │           │   ├── Milestone.java
    │   │           │   ├── RiskItem.java
    │   │           │   ├── HealthCheck.java
    │   │           │   └── LeadershipGate.java
    │   │           └── evidence
    │   │               ├── LeadershipEvidence.java
    │   │               ├── EvidenceType.java
    │   │               └── EvidenceSanitizer.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/technicalleadership
    │               ├── decision
    │               │   ├── DecisionOwnershipTest.java
    │               │   ├── ConstraintCoverageTest.java
    │               │   └── DecisionRecordTest.java
    │               ├── alignment
    │               │   ├── AlignmentSessionTest.java
    │               │   └── DisagreementVisibilityTest.java
    │               ├── delegation
    │               │   ├── DelegationBoundaryTest.java
    │               │   └── DelegationReviewTest.java
    │               ├── conflict
    │               │   ├── ConflictResolutionTest.java
    │               │   └── EscalationCriteriaTest.java
    │               └── architecture
    │                   ├── LeadershipBoundaryTest.java
    │                   ├── DecisionEvidenceTest.java
    │                   ├── MentoringNonAnticipationTest.java
    │                   └── CorporateArchitectureNonAnticipationTest.java
    ├── leadership
    │   ├── TECHNICAL_LEADERSHIP_CHARTER.md
    │   ├── PROGRAM_CONTEXT.md
    │   ├── STAKEHOLDER_MAP.md
    │   ├── DECISION_MAP.md
    │   ├── FACTS_HYPOTHESES_PREFERENCES.md
    │   ├── OBJECTIVES_AND_CONSTRAINTS.md
    │   ├── INFLUENCE_PLAN.md
    │   ├── ALIGNMENT_SESSION.md
    │   ├── CONFLICT_PROTOCOL.md
    │   ├── DELEGATION_MATRIX.md
    │   ├── DECISION_LOG.md
    │   ├── COMMUNICATION_PLAN.md
    │   ├── TECHNICAL_ROADMAP.md
    │   ├── RISK_REGISTER.md
    │   ├── ESCALATION_POLICY.md
    │   ├── OPERATING_CADENCE.md
    │   ├── TEAM_HEALTH_CHECK.md
    │   ├── RETROSPECTIVE.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_LEADERSHIP_QUESTIONS.md
    ├── contracts
    │   ├── technical-leadership-contract.yaml
    │   ├── stakeholder-policy.yaml
    │   ├── decision-policy.yaml
    │   ├── alignment-policy.yaml
    │   ├── conflict-policy.yaml
    │   ├── delegation-policy.yaml
    │   ├── communication-policy.yaml
    │   ├── roadmap-policy.yaml
    │   ├── risk-policy.yaml
    │   ├── escalation-policy.yaml
    │   ├── health-policy.yaml
    │   ├── evidence-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── stakeholder-coverage-report.yaml
        ├── decision-clarity-report.yaml
        ├── alignment-report.yaml
        ├── delegation-report.yaml
        ├── conflict-report.yaml
        ├── communication-report.yaml
        ├── roadmap-health-report.yaml
        ├── architecture-report.yaml
        └── technical-leadership-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-technical-leadership
├── validate-leadership-contract.ps1
├── validate-stakeholder-map.ps1
├── validate-decision-ownership.ps1
├── validate-alignment-record.ps1
├── validate-conflict-protocol.ps1
├── validate-delegation-matrix.ps1
├── validate-communication-plan.ps1
├── validate-roadmap-health.ps1
├── validate-escalation-policy.ps1
├── run-technical-leadership-tests.ps1
├── collect-technical-leadership-evidence.ps1
└── verify-technical-leadership-gate.ps1
```

---

## Conceito essencial

### Liderança técnica é influência aplicada ao contexto

Autoridade formal pode obrigar uma ação.

Influência ajuda o grupo a compreender por que a ação faz sentido.

A liderança técnica sustentável depende de credibilidade, contexto, clareza, escuta, evidência, coerência, responsabilidade, síntese, coragem para decidir e humildade para revisar.

A influência não é manipulação. Ela precisa ser transparente sobre objetivo, restrições, risco, incerteza, impacto, interesse e decisão necessária.

### Decisão coletiva não significa unanimidade

Nem toda decisão terá consenso completo.

O objetivo é obter contexto compartilhado, discordâncias registradas, owner definido, critério de decisão, prazo, compromisso com a execução e gatilho de revisão.

Depois que o processo é justo e a decisão foi tomada, pessoas podem discordar e ainda assim se comprometer.

Esse comportamento é frequentemente chamado de:

```text
disagree and commit.
```

Ele não deve ser usado para silenciar risco crítico ou ignorar owners.

### O líder técnico reduz ambiguidade

Ambiguidade aparece quando ninguém sabe qual problema está sendo resolvido, quem decide, quais restrições são obrigatórias, quais opções existem, qual evidência falta, quando a decisão precisa ser tomada, como sucesso será medido, quem executa e quando revisar.

O líder técnico transforma essa ambiguidade em um sistema de trabalho.

### Conflito técnico pode ser saudável

Conflito de ideias ajuda a revelar riscos escondidos, premissas diferentes, objetivos incompatíveis, gaps de conhecimento, dependências e limites organizacionais.

Conflito se torna destrutivo quando migra de ideias para identidade, status, sarcasmo, medo ou disputa de poder.

O líder técnico protege a discussão técnica e interrompe ataques pessoais.

### Delegação não é abandono

Delegar significa transferir decisão ou execução com contexto, boundary, resultado esperado, autonomia, restrições, recursos, prazo, checkpoint e critério de escalonamento.

Sem esses elementos, existe apenas transferência de tarefa.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-659-lideranca-tecnica/service-scheduling-technical-leadership

Set-Location `
  labs/m19/aula-659-lideranca-tecnica/service-scheduling-technical-leadership
```

### 2. Criar Technical Leadership Charter

Arquivo:

```text
leadership/TECHNICAL_LEADERSHIP_CHARTER.md
```

Conteúdo:

```markdown
# Technical Leadership Charter

Contexto:

Service Scheduling.

Programa:

Fast Confirmation.

Missão:

Conduzir decisões técnicas
com contexto, evidência,
ownership e execução.

Princípios:

- problema antes da solução;
- fato separado de hipótese;
- risco explícito;
- owner explícito;
- discordância registrada;
- decisão no nível correto;
- delegação com boundary;
- comunicação por audiência;
- escalonamento sem surpresa;
- revisão baseada em resultado.
```

### 3. Criar contrato principal

Arquivo:

```text
contracts/technical-leadership-contract.yaml
```

Conteúdo:

```yaml
technicalLeadership:
  context:
    Service-Scheduling

  required:
    - shared-problem-frame
    - stakeholder-map
    - decision-owner
    - facts-and-hypotheses
    - objectives-and-constraints
    - alternatives
    - disagreement-record
    - delegation-boundaries
    - communication-plan
    - roadmap
    - risk-register
    - escalation-policy
    - operating-cadence
    - health-check
    - retrospective
    - evidence
    - gate

  forbidden:
    - authority-by-title-only
    - hidden-decision
    - meeting-without-decision
    - personal-attack
    - delegation-without-context
    - escalation-as-punishment
    - silent-risk-acceptance
    - hero-dependency
    - mentoring-deep-dive
    - corporate-architecture-deep-dive

  nextLesson:
    code:
      M19.50
```

### 4. Escrever o contexto do programa

Arquivo:

```text
leadership/PROGRAM_CONTEXT.md
```

Registre:

```text
Problema:
clientes percebem demora
na confirmação.

Baseline:
p95 de 4,8 segundos.

Objetivo:
p95 menor que 2,5 segundos.

Não objetivos:
remover a Saga;
aceitar dupla reserva;
reduzir autorização;
reconstruir todos os serviços.

Prazo de decisão:
cinco dias úteis.

Prazo de experimento:
duas semanas.

Owner de negócio:
Product Manager.

Owner técnico:
Scheduling Technical Lead.
```

O framing reduz discussões sobre soluções que não atendem ao problema real.

### 5. Criar Stakeholder Map

Arquivo:

```text
leadership/STAKEHOLDER_MAP.md
```

Inclua Product, Scheduling, Capacity, Field Execution, Communication, Platform, Security, Data, Operations, Support, Finance, Architecture e Engineering Management.

Para cada stakeholder, registre interesse, influência, risco percebido, decisão que possui, informação necessária, cadência e conflito potencial.

### 6. Criar Stakeholder

```java
package br.com.formacao.technicalleadership.stakeholder;

import java.util.Objects;
import java.util.Set;

public record Stakeholder(
        String id,
        String name,
        StakeholderRole role,
        InfluenceLevel influence,
        InterestLevel interest,
        Set<String> ownedDecisions,
        Set<String> concerns) {

    public Stakeholder {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(role);
        Objects.requireNonNull(influence);
        Objects.requireNonNull(interest);
        ownedDecisions = Set.copyOf(ownedDecisions);
        concerns = Set.copyOf(concerns);
    }
}
```

Não use nomes reais no laboratório. Represente papéis e responsabilidades.

### 7. Classificar stakeholders

Estratégias:

```text
alta influência, alto interesse:
envolver diretamente.

alta influência, baixo interesse:
manter informado
com síntese executiva.

baixa influência, alto interesse:
consultar e dar visibilidade.

baixa influência, baixo interesse:
comunicar mudanças relevantes.
```

Influência não define importância humana. Ela ajuda a planejar comunicação e decisão.

### 8. Criar Decision Map

Arquivo:

```text
leadership/DECISION_MAP.md
```

Decisões:

```text
D-001:
qual hipótese de latência testar?

D-002:
qual boundary pode sair
do caminho crítico?

D-003:
qual risco de consistência
é aceitável?

D-004:
qual experimento será executado?

D-005:
quem aprova rollout?

D-006:
qual condição interrompe rollout?
```

Para cada decisão, registre owner, contributors, consulted, informed, prazo, critérios, evidência e reversibilidade.

### 9. Criar Decision Context

```java
package br.com.formacao.technicalleadership.decision;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

public record DecisionContext(
        String decisionId,
        String problem,
        DecisionOwner owner,
        List<DecisionConstraint> constraints,
        Instant deadline,
        String reviewTrigger) {

    public DecisionContext {
        Objects.requireNonNull(decisionId);
        Objects.requireNonNull(problem);
        Objects.requireNonNull(owner);
        constraints = List.copyOf(constraints);
        Objects.requireNonNull(deadline);
        Objects.requireNonNull(reviewTrigger);
    }
}
```

Decisão sem owner tende a ficar parada ou ser tomada informalmente por quem fala mais alto.

### 10. Separar fato, hipótese e preferência

Arquivo:

```text
leadership/FACTS_HYPOTHESES_PREFERENCES.md
```

Exemplo:

```text
Fato:
p95 atual é 4,8 segundos
em tráfego de pico.

Fato:
Communication não altera
a confirmação do Appointment.

Hipótese:
retirar Communication
do caminho crítico
reduzirá 700 ms.

Hipótese:
Capacity é o maior hotspot.

Preferência:
usar fluxo totalmente assíncrono.

Preferência:
evitar novo tópico.
```

Preferência não é inválida. Ela apenas não deve ser apresentada como fato.

### 11. Criar objetivos e restrições

Arquivo:

```text
leadership/OBJECTIVES_AND_CONSTRAINTS.md
```

Objetivos:

```text
reduzir p95;

manter integridade;

preservar UX honesta;

reduzir risco operacional;

permitir rollback.
```

Restrições:

```text
sem dupla reserva;

sem autorização cross-tenant;

sem contrato incompatível;

sem deploy coordenado;

sem ultrapassar error budget;

sem aumentar intervenção manual.
```

### 12. Criar plano de influência

Arquivo:

```text
leadership/INFLUENCE_PLAN.md
```

Para cada stakeholder, registre o que ele precisa compreender, qual risco protege, qual evidência é relevante, qual formato funciona, qual decisão é esperada, quando envolver e o que não prometer.

Influência eficaz adapta a mensagem sem alterar os fatos.

### 13. Preparar reunião de alinhamento

Arquivo:

```text
leadership/ALIGNMENT_SESSION.md
```

Agenda:

```text
1. objetivo e decisão necessária;

2. baseline e evidências;

3. restrições obrigatórias;

4. opções;

5. riscos e impactos;

6. discordâncias;

7. decisão ou experimento;

8. owner e prazo;

9. comunicação;

10. gatilho de revisão.
```

A reunião não deve começar com cinquenta slides. Comece pela decisão necessária.

### 14. Criar perguntas de alinhamento

Perguntas úteis:

```text
qual problema estamos resolvendo?

qual risco é inaceitável?

qual premissa não foi provada?

quem possui esta decisão?

qual evidência mudaria sua opinião?

a decisão é reversível?

qual experimento reduz incerteza?

o que acontece se não decidirmos?

qual prazo real existe?

como saberemos que funcionou?
```

Perguntas reduzem defesa de posição.

### 15. Criar Alignment Session

```java
package br.com.formacao.technicalleadership.alignment;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

public record AlignmentSession(
        String id,
        String decisionId,
        String facilitator,
        List<AlignmentQuestion> questions,
        List<String> participants,
        Instant scheduledAt,
        String expectedOutcome) {

    public AlignmentSession {
        Objects.requireNonNull(id);
        Objects.requireNonNull(decisionId);
        Objects.requireNonNull(facilitator);
        questions = List.copyOf(questions);
        participants = List.copyOf(participants);
        Objects.requireNonNull(scheduledAt);
        Objects.requireNonNull(expectedOutcome);
    }
}
```

### 16. Tornar discordância visível

Registre:

```text
Discordância:
Communication deve ou não
sair do caminho crítico?

Parte A:
sim,
porque não altera o estado final.

Parte B:
não,
porque a UX depende da confirmação.

Evidência faltante:
medir abandono
quando a mensagem chega depois.

Decisão:
executar experimento
com comunicação assíncrona.

Review:
após sete dias.
```

Discordância registrada evita reabrir a mesma discussão sem nova evidência.

### 17. Criar protocolo de conflito

Arquivo:

```text
leadership/CONFLICT_PROTOCOL.md
```

Regras:

```text
criticar ideia,
não pessoa;

explicitar objetivo;

pedir evidência;

resumir a posição oposta;

identificar interesse protegido;

separar risco de preferência;

propor experimento;

registrar discordância;

definir owner;

interromper ataque pessoal;

escalonar somente quando necessário.
```

### 18. Classificar conflito

Categorias:

```text
conflito de dados:
fontes ou métricas diferentes.

conflito de objetivo:
times otimizam resultados distintos.

conflito de risco:
tolerâncias diferentes.

conflito de ownership:
decisão sem autoridade clara.

conflito de recurso:
capacidade limitada.

conflito relacional:
histórico ou confiança.

conflito de valor:
princípios incompatíveis.
```

Cada tipo exige abordagem diferente.

### 19. Resolver conflito técnico

Fluxo:

```text
1. reconstruir o problema;

2. confirmar fatos;

3. listar hipóteses;

4. registrar interesses;

5. definir critérios;

6. criar opções;

7. medir reversibilidade;

8. escolher decisão ou experimento;

9. registrar owner;

10. revisar resultado.
```

### 20. Criar Conflict Frame

```java
package br.com.formacao.technicalleadership.conflict;

import java.util.List;

public record ConflictFrame(
        String conflictId,
        ConflictType type,
        String sharedGoal,
        List<String> positions,
        List<String> protectedInterests,
        List<String> knownFacts,
        List<String> unknowns,
        String decisionOwner) {

    public ConflictFrame {
        positions = List.copyOf(positions);
        protectedInterests = List.copyOf(protectedInterests);
        knownFacts = List.copyOf(knownFacts);
        unknowns = List.copyOf(unknowns);
    }
}
```

### 21. Escolher entre decisão e experimento

Decida quando a evidência é suficiente, o risco é compreendido, existe owner, o prazo exige ação e a reversibilidade é aceitável.

Experimente quando a incerteza é alta, o custo do teste é baixo, o impacto é controlável, a hipótese pode ser medida e o rollback é simples.

Não use experimento para adiar decisão indefinidamente.

### 22. Definir matriz de delegação

Arquivo:

```text
leadership/DELEGATION_MATRIX.md
```

Níveis:

```text
1. diga o que fazer;

2. pesquise e recomende;

3. decida e confirme antes de executar;

4. decida e informe;

5. execute e reporte resultado;

6. possua a área e evolua a política.
```

O nível depende de risco, experiência, contexto e reversibilidade.

### 23. Criar Delegation Assignment

```java
package br.com.formacao.technicalleadership.delegation;

import java.time.Instant;
import java.util.List;

public record DelegationAssignment(
        String assignmentId,
        String owner,
        DelegationLevel level,
        String expectedOutcome,
        List<DecisionBoundary> boundaries,
        List<String> availableResources,
        Instant checkpoint,
        List<String> escalationTriggers) {

    public DelegationAssignment {
        boundaries = List.copyOf(boundaries);
        availableResources = List.copyOf(availableResources);
        escalationTriggers = List.copyOf(escalationTriggers);
    }
}
```

### 24. Delegar o experimento

Exemplo:

```text
Owner:
Capacity Engineer.

Nível:
decida e informe.

Resultado:
provar impacto
de cache bounded
na consulta de disponibilidade.

Boundaries:
sem alterar autoridade;
sem cache para confirmação crítica;
TTL máximo de 10 segundos;
feature flag obrigatória.

Checkpoint:
sexta-feira.

Escalonar se:
erro acima de 1%;
staleness acima do budget;
custo acima do limite.
```

### 25. Evitar hero dependency

Sinais:

- uma pessoa participa de todas as decisões;
- ninguém faz deploy sem ela;
- documentos não refletem conhecimento;
- incidentes dependem de memória;
- férias bloqueiam trabalho;
- reviews acumulam;
- decisões são explicadas apenas verbalmente.

Ações:

- distribuir ownership;
- registrar contexto;
- criar runbooks;
- delegar decisões;
- automatizar checks;
- rotacionar facilitação;
- criar backups de owner.

### 26. Criar Decision Log

Arquivo:

```text
leadership/DECISION_LOG.md
```

Campos:

```text
decision ID;

context;

owner;

date;

options;

constraints;

evidence;

decision;

dissent;

commitment;

actions;

review trigger;

status.
```

O Decision Log não substitui ADR. Ele registra decisões operacionais e de condução do programa. Decisões arquiteturais duráveis continuam em ADR.

### 27. Criar comunicação por audiência

Arquivo:

```text
leadership/COMMUNICATION_PLAN.md
```

Audiências:

```text
executiva:
impacto, risco, data e decisão.

produto:
experiência, escopo e métrica.

engenharia:
boundary, contrato, implementação e rollout.

operação:
mudança, alerta, runbook e rollback.

segurança:
ameaça, autorização e evidência.

suporte:
mensagem ao cliente e estados esperados.
```

Não envie o mesmo nível de detalhe para todas as pessoas.

### 28. Criar Communication Message

```java
package br.com.formacao.technicalleadership.communication;

import java.util.List;

public record CommunicationMessage(
        Audience audience,
        String purpose,
        String summary,
        List<String> decisions,
        List<String> risks,
        List<String> actions,
        String owner,
        String nextUpdate) {

    public CommunicationMessage {
        decisions = List.copyOf(decisions);
        risks = List.copyOf(risks);
        actions = List.copyOf(actions);
    }
}
```

### 29. Comunicar incerteza

Exemplo ruim:

```text
o novo fluxo reduzirá
a latência em 50%.
```

Exemplo correto:

```text
o experimento busca reduzir
entre 20% e 35%.

a maior incerteza
é o tempo de Capacity.

o rollout será interrompido
se o error budget acelerar.
```

Transparência aumenta confiança.

### 30. Criar Technical Roadmap

Arquivo:

```text
leadership/TECHNICAL_ROADMAP.md
```

Fases:

```text
0. baseline e alinhamento;

1. instrumentar caminho crítico;

2. testar Communication assíncrona;

3. reduzir latência de Capacity;

4. canário controlado;

5. rollout gradual;

6. remover código transitório;

7. revisar resultado.
```

Cada fase possui outcome, owner, dependências, risco, evidência, entrada, saída e rollback.

### 31. Criar Risk Register

Arquivo:

```text
leadership/RISK_REGISTER.md
```

Riscos:

```text
dupla reserva;

autorização incompleta;

mensagem atrasada;

capacidade saturada;

rollout sem rollback;

telemetria insuficiente;

owner indisponível;

dependência externa;

prazo político;

acúmulo de código transitório.
```

Campos: probabilidade, impacto, owner, mitigação, trigger, contingency e status.

### 32. Priorizar por risco e valor

Evite priorizar apenas pela urgência verbal.

Use critérios:

```text
impacto no cliente;

risco de integridade;

risco de segurança;

error budget;

reversibilidade;

custo de atraso;

dependência;

esforço;

aprendizado;

capacidade do time.
```

### 33. Criar política de escalonamento

Arquivo:

```text
leadership/ESCALATION_POLICY.md
```

Escalone quando:

- owner não existe;
- conflito cruza autoridade;
- risco crítico não pode ser mitigado;
- prazo exige trade-off executivo;
- orçamento precisa mudar;
- SLO será conscientemente violado;
- segurança ou compliance bloqueia;
- dependência externa não responde;
- conflito relacional impede decisão.

Escalonamento não é punição. É mover a decisão para o nível que possui autoridade e contexto.

### 34. Criar Escalation Decision

```java
package br.com.formacao.technicalleadership.conflict;

import java.time.Instant;
import java.util.List;

public record EscalationDecision(
        String escalationId,
        String decisionId,
        String reason,
        String targetAuthority,
        List<String> attemptedActions,
        List<String> options,
        List<String> risks,
        Instant neededBy) {

    public EscalationDecision {
        attemptedActions = List.copyOf(attemptedActions);
        options = List.copyOf(options);
        risks = List.copyOf(risks);
    }
}
```

### 35. Escalonar sem surpresa

Antes do escalonamento:

- informe as partes;
- resuma fatos;
- registre tentativas;
- apresente opções;
- explique risco de não decidir;
- indique prazo;
- evite culpar pessoas.

A surpresa destrói confiança.

### 36. Criar Operating Cadence

Arquivo:

```text
leadership/OPERATING_CADENCE.md
```

Cadência:

```text
daily async update:
bloqueios e riscos.

twice-weekly technical sync:
decisões e experimentos.

weekly stakeholder update:
resultado, risco e próximos passos.

release checkpoint:
go, no-go e rollback.

monthly architecture review:
tendência e dívida.

post-milestone retrospective:
aprendizado.
```

Reunião existe quando há necessidade de interação. Status pode ser assíncrono.

### 37. Proteger tempo de foco

Práticas:

- agenda clara;
- decisão assíncrona quando possível;
- documentos antes da reunião;
- limite de participantes;
- delegação;
- horários de foco;
- owners locais;
- cancelamento de reunião sem propósito.

### 38. Criar Team Health Check

Arquivo:

```text
leadership/TEAM_HEALTH_CHECK.md
```

Perguntas:

```text
sabemos qual problema resolvemos?

sabemos quem decide?

discordâncias podem ser expressas?

riscos são visíveis?

ownership está distribuído?

reuniões geram decisões?

há confiança para pedir ajuda?

existe tempo de foco?

a equipe aprende com experimentos?

o líder é gargalo?
```

A resposta pode usar escala de 1 a 5 com comentários. Não transforme health check em ranking de pessoas.

### 39. Observar sinais de liderança

Métricas possíveis:

```text
decision lead time;

decision reopen rate;

owner coverage;

delegation coverage;

blocked work age;

escalation count;

surprise escalation count;

meeting decision rate;

risk without owner;

action overdue;

review trigger executed.
```

Métricas apoiam conversa. Não devem ser usadas isoladamente para avaliar pessoas.

### 40. Criar Leadership Gate

O gate valida problema claro, stakeholders mapeados, owner definido, fatos separados, restrições explícitas, discordâncias registradas, delegação com boundary, comunicação planejada, roadmap executável, riscos com owner, escalonamento definido, cadência ativa, health check, retrospectiva e evidence.

### 41. Testar owner ausente

```java
package br.com.formacao.technicalleadership.decision;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class DecisionOwnershipTest {

    @Test
    void shouldRejectDecisionWithoutOwner() {
        assertThrows(
                NullPointerException.class,
                () -> new DecisionContext(
                        "D-001",
                        "Reduce confirmation latency",
                        null,
                        java.util.List.of(),
                        java.time.Instant.now(),
                        "After experiment"));
    }
}
```

### 42. Testar restrições não cobertas

Cenário:

- opção reduz latência;
- não preserva autorização;
- não possui rollback;
- decision record tenta aprovar.

O gate deve falhar. Liderança técnica não pode compensar risco crítico apenas com comunicação.

### 43. Testar discordância oculta

Uma sessão termina com decisão, mas não registra objeção da equipe de `Capacity`.

O relatório deve indicar:

```text
FAIL_DISAGREEMENT_VISIBILITY
```

Discordância relevante precisa ficar associada ao risco e ao review trigger.

### 44. Testar delegação sem boundary

Assignment possui owner e prazo, mas não possui limites.

O teste deve falhar.

Autonomia sem boundary em mudança crítica produz risco invisível.

### 45. Testar conflito pessoal

Entrada:

```text
"essa solução é irresponsável
porque o autor não entende
sistemas distribuídos."
```

Saída esperada:

```text
finding:
a opção não demonstra
como evita dupla reserva.

evidence required:
teste de concorrência
e matriz de consistência.
```

Ataque pessoal deve ser rejeitado. O risco técnico deve ser preservado.

### 46. Testar escalonamento prematuro

Cenário:

- owner existe;
- critérios existem;
- experimento ainda não terminou;
- alguém escala por impaciência.

Resultado:

```text
ESCALATION_NOT_READY
```

Escalonar cedo demais remove autonomia.

### 47. Testar escalonamento necessário

Cenário:

- segurança bloqueia;
- produto exige prazo;
- mitigação aumenta custo;
- owner técnico não possui orçamento.

Resultado:

```text
ESCALATE_TO_EXECUTIVE_SPONSOR
```

A decisão ultrapassou autoridade técnica.

### 48. Testar comunicação

Valide audiência, propósito, decisão, risco, ação, owner, próxima atualização, ausência de detalhes sensíveis e ausência de promessa não suportada.

### 49. Testar roadmap

Confirme outcomes, owners, dependências, gates, rollback, critérios de saída, código transitório com remoção e milestones sem datas impossíveis.

### 50. Executar retrospectiva

Arquivo:

```text
leadership/RETROSPECTIVE.md
```

Perguntas:

```text
o que ajudou a decisão?

o que gerou atraso?

qual risco apareceu tarde?

onde o owner estava confuso?

qual reunião poderia ser assíncrona?

qual delegação funcionou?

onde houve hero dependency?

qual hipótese foi invalidada?

o que mudar na próxima decisão?
```

A retrospectiva deve produzir ações com owner e prazo.

### 51. Criar reports

Exemplo:

```yaml
technicalLeadership:
  stakeholders:
    total:
      12
    withEngagementPlan:
      12

  decisions:
    total:
      8
    withOwner:
      8
    withDeadline:
      8
    reopenedWithoutEvidence:
      0

  disagreements:
    registered:
      3
    unresolved:
      0

  delegation:
    assignments:
      6
    withoutBoundary:
      0

  risks:
    total:
      14
    withoutOwner:
      0
    criticalOpen:
      0

  escalations:
    total:
      1
    surprises:
      0

  gate:
    PASS
```

### 52. Criar evidence

Arquivo:

```text
contracts/technical-leadership-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- stakeholder count;
- stakeholder plan coverage;
- decision count;
- decision owner coverage;
- decision deadline coverage;
- disagreement count;
- unresolved disagreement count;
- delegation assignment count;
- delegation boundary coverage;
- risk count;
- risk owner coverage;
- critical open risk count;
- escalation count;
- surprise escalation count;
- communication audience count;
- roadmap milestone count;
- health check status;
- retrospective status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua nomes reais, avaliações individuais, dados pessoais, mensagens privadas, conflitos reais, informação salarial, credenciais, endpoints privados, topologia real, detalhes de mentoria da aula 660 ou políticas corporativas da aula 661.

### 53. Criar Gate Status

Status:

```text
PASS;

FAIL_PROBLEM_FRAME;

FAIL_STAKEHOLDER_MAP;

FAIL_DECISION_OWNER;

FAIL_FACT_HYPOTHESIS_SEPARATION;

FAIL_CONSTRAINT_COVERAGE;

FAIL_DISAGREEMENT_VISIBILITY;

FAIL_CONFLICT_PROTOCOL;

FAIL_DELEGATION_BOUNDARY;

FAIL_COMMUNICATION_PLAN;

FAIL_ROADMAP;

FAIL_RISK_OWNERSHIP;

FAIL_ESCALATION_POLICY;

FAIL_OPERATING_CADENCE;

FAIL_TEAM_HEALTH;

FAIL_RETROSPECTIVE;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

### 54. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-technical-leadership\validate-leadership-contract.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-stakeholder-map.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-decision-ownership.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-alignment-record.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-conflict-protocol.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-delegation-matrix.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-communication-plan.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-roadmap-health.ps1

.\scripts\m19\service-scheduling-technical-leadership\validate-escalation-policy.ps1

.\scripts\m19\service-scheduling-technical-leadership\run-technical-leadership-tests.ps1

.\scripts\m19\service-scheduling-technical-leadership\collect-technical-leadership-evidence.ps1

.\scripts\m19\service-scheduling-technical-leadership\verify-technical-leadership-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 55. Encerrar o laboratório

Confirme:

- problema compartilhado;
- baseline;
- objetivos e não objetivos;
- stakeholders;
- owners;
- fatos e hipóteses;
- opções;
- restrições;
- discordâncias;
- conflito tratado;
- experimento definido;
- delegação com boundary;
- Decision Log;
- comunicação por audiência;
- roadmap;
- risk register;
- escalonamento;
- cadência;
- health check;
- retrospectiva;
- reports;
- evidence;
- gate aprovado;
- mentoria aprofundada não antecipada;
- arquitetura corporativa não antecipada.

---

## Entendendo o que foi feito

### A liderança ganhou um sistema de trabalho

Você não dependeu de carisma, cargo ou improviso.

Criou mapa de stakeholders, owners, decisões, cadência, riscos, comunicação e gate.

### A discussão ganhou qualidade

Fatos, hipóteses e preferências foram separados.

Discordâncias ficaram visíveis e conectadas a evidências.

### Conflitos ganharam protocolo

O conflito deixou de ser disputa pessoal.

Objetivos, interesses, riscos e critérios foram reconstruídos.

### Delegação ganhou boundaries

Autonomia passou a incluir resultado, limites, recursos, checkpoints e triggers de escalonamento.

### Comunicação ganhou audiência

Produto, engenharia, operação, segurança e liderança executiva receberam mensagens adequadas ao seu papel.

### Escalonamento ganhou responsabilidade

O escalonamento deixou de ser ameaça.

Passou a mover decisões para o nível que possui autoridade, orçamento ou responsabilidade.

### A equipe ganhou proteção contra dependência heroica

Ownership, documentação, automação, backup de owner e delegação reduziram concentração de conhecimento.

---

## Erros comuns importantes

### Confundir liderança com controle

Centralizar decisões reduz autonomia e cria gargalo.

### Tentar obter consenso absoluto

Algumas decisões exigem owner, prazo, critérios e compromisso, não unanimidade.

### Esconder discordância

Risco reaparece depois como resistência, retrabalho ou incidente.

### Usar reunião para status

Status pode ser assíncrono. Reunião deve produzir entendimento ou decisão.

### Delegar somente tarefa

Sem contexto e boundary, a pessoa executa sem autonomia real.

### Escalonar como punição

Isso destrói confiança e faz o time esconder riscos.

### Comunicar certeza inexistente

Promessas não suportadas geram perda de credibilidade.

### Decidir sem owner

A decisão fica órfã e ninguém responde pelo resultado.

### Ser o herói

Resolver tudo sozinho impede aprendizado e cria risco operacional.

### Ignorar conflito relacional

Mais dados não resolvem falta de confiança ou ataque pessoal.

### Antecipar mentoria detalhada

Feedback individual e code review como desenvolvimento de pessoas ficam para a aula 660.

---

## Comandos úteis

### Validar stakeholders

```powershell
.\scripts\m19\service-scheduling-technical-leadership\validate-stakeholder-map.ps1
```

### Validar decisões

```powershell
.\scripts\m19\service-scheduling-technical-leadership\validate-decision-ownership.ps1
```

### Validar delegação

```powershell
.\scripts\m19\service-scheduling-technical-leadership\validate-delegation-matrix.ps1
```

### Validar escalonamento

```powershell
.\scripts\m19\service-scheduling-technical-leadership\validate-escalation-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-technical-leadership\run-technical-leadership-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-technical-leadership\verify-technical-leadership-gate.ps1
```

---

## Exercício guiado

Conduza o cenário:

```text
o time deseja
substituir o fluxo atual
de confirmação
por uma chamada síncrona direta
entre Scheduling e Capacity.
```

Crie framing, stakeholder map, decision owner, fatos e hipóteses, objetivos e restrições, opções, perguntas de alinhamento, discordâncias, plano de experimento, matriz de delegação, communication plan, roadmap, risk register, escalation policy, evidence e gate.

Defenda uma decisão sem usar cargo como argumento.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 658 e ponte para a aula 660 foram preservadas;
- laboratório `service-scheduling-technical-leadership` foi criado;
- Technical Leadership Charter foi criado;
- contexto `Fast Confirmation` foi definido;
- problema, baseline, objetivo, não objetivos e prazo foram registrados;
- Stakeholder Map foi criado;
- decisões possuídas por cada stakeholder foram registradas;
- Decision Map foi criado;
- cada decisão possui owner, prazo, critérios e review trigger;
- fatos, hipóteses e preferências foram separados;
- objetivos e restrições foram definidos;
- Influence Plan foi criado;
- Alignment Session foi criada;
- perguntas de alinhamento foram registradas;
- discordâncias foram tornadas visíveis;
- Conflict Protocol foi criado;
- conflitos foram classificados;
- ataques pessoais foram proibidos;
- decisão e experimento foram diferenciados;
- Delegation Matrix foi criada;
- delegações possuem boundary, recursos, checkpoint e triggers;
- hero dependency foi tratada;
- Decision Log foi criado;
- Communication Plan foi criado;
- mensagens foram adaptadas por audiência;
- incerteza foi comunicada;
- Technical Roadmap foi criado;
- milestones possuem outcomes, owners e gates;
- Risk Register foi criado;
- riscos possuem owner e contingência;
- priorização considerou valor e risco;
- Escalation Policy foi criada;
- escalonamento sem surpresa foi praticado;
- Operating Cadence foi criada;
- tempo de foco foi protegido;
- Team Health Check foi criado;
- métricas de liderança foram usadas com cuidado;
- Leadership Gate foi criado;
- testes de ownership, discordância, delegação, conflito, escalonamento e comunicação foram executados;
- Retrospective foi criada;
- reports e evidence foram criados;
- commit recomendado e diário de bordo estão presentes;
- mentoria e code review sênior não foram antecipados;
- arquitetura corporativa brasileira não foi antecipada.

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
  labs/m19/aula-659-lideranca-tecnica/service-scheduling-technical-leadership `
  scripts/m19/service-scheduling-technical-leadership `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realEmployee|salary|personalConflict|privateMessage|productionTopology|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): praticar lideranca tecnica"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua nomes reais, avaliações individuais, conflitos privados, informação salarial, dados pessoais, credenciais, endpoints privados, topologia real, conteúdo aprofundado de mentoria ou decisões corporativas reais.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou liderança técnica.

Você criou:

```text
Technical Leadership Charter;

Program Context;

Stakeholder Map;

Decision Map;

Facts, Hypotheses and Preferences;

Objectives and Constraints;

Influence Plan;

Alignment Session;

Conflict Protocol;

Delegation Matrix;

Decision Log;

Communication Plan;

Technical Roadmap;

Risk Register;

Escalation Policy;

Operating Cadence;

Team Health Check;

Retrospective;

reports, evidence e gate.
```

Você comprovou que liderança técnica não depende apenas de cargo, experiência ou capacidade de falar mais alto.

Ela depende de construir contexto, separar fatos de hipóteses, tornar objetivos e restrições explícitos, envolver os owners corretos, tratar discordâncias, conduzir conflitos, decidir com critérios, delegar com boundaries, comunicar risco e incerteza, proteger foco, escalonar sem surpresa e revisar o resultado.

Você também tratou hero dependency como risco arquitetural e organizacional.

Um líder técnico saudável não se torna indispensável.

Ele aumenta a capacidade do time de decidir, executar e aprender.

A próxima aula será:

```text
660 - M19.50 - Mentoria e code review senior
```

Nela, você irá aprofundar como desenvolver pessoas por meio de contexto, perguntas, feedback, delegação progressiva, pareamento, planos de evolução e code review orientado a aprendizado.

Nenhum aprofundamento completo de mentoria, feedback individual ou arquitetura corporativa foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini o problema.
- [ ] Mapeei stakeholders.
- [ ] Defini owners.
- [ ] Separei fatos e hipóteses.
- [ ] Registrei restrições.
- [ ] Tornei discordâncias visíveis.
- [ ] Tratei conflitos.
- [ ] Deleguei com boundaries.
- [ ] Criei roadmap e risk register.
- [ ] Planejei comunicação.
- [ ] Defini escalonamento.
- [ ] Executei health check e retrospectiva.

---

## Troubleshooting adicional

### A reunião termina sem decisão

Defina a decisão esperada, owner, critérios e prazo antes da reunião.

### Duas equipes usam métricas diferentes

Reconcilie fontes e definições antes de discutir solução.

### O stakeholder dominante interrompe todos

Use facilitação, rodada estruturada e perguntas por owner.

### A equipe concorda na reunião e resiste depois

Registre discordância, commitment e ações.

### O líder recebe todas as perguntas

Crie owner local, Decision Log e matriz de delegação.

### A pessoa delegada pede aprovação em tudo

Revise nível de delegação, boundary e segurança psicológica.

### O escalonamento surpreende a equipe

Informe intenção, tentativas, opções, risco e prazo antes de subir.

### O prazo executivo não cabe

Apresente opções de escopo, risco, custo e data. Não esconda o trade-off.

### O conflito virou pessoal

Interrompa o ataque, reconstrua o objetivo e trate o aspecto relacional fora da disputa técnica.

### O roadmap possui muitas tarefas

Reescreva por outcomes, dependências, gates e riscos.

### A equipe quer discutir feedback individual

Preserve o aprofundamento para a aula 660.

---

## Perguntas de revisão

1. O que é liderança técnica?
2. Influência é o mesmo que autoridade?
3. Decisão coletiva exige unanimidade?
4. O que significa disagree and commit?
5. Por que separar fato, hipótese e preferência?
6. O que é Stakeholder Map?
7. O que é Decision Map?
8. Por que decisão precisa de owner?
9. O que uma Alignment Session deve produzir?
10. Por que registrar discordância?
11. Quais tipos de conflito existem?
12. Como transformar conflito em decisão?
13. Quando experimentar?
14. O que é delegation boundary?
15. O que é hero dependency?
16. Qual diferença entre Decision Log e ADR?
17. Por que comunicar por audiência?
18. Como comunicar incerteza?
19. O que é Risk Register?
20. Quando escalonar?
21. Por que escalonar sem surpresa?
22. O que é Operating Cadence?
23. O que Team Health Check avalia?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Capacidade de aumentar a qualidade das decisões e execução do time.
2. Não. Influência constrói entendimento e compromisso.
3. Não.
4. Discordar e apoiar a execução após processo justo.
5. Para não apresentar opinião como evidência.
6. Mapa de interesses, influência e ownership.
7. Catálogo de decisões, owners e critérios.
8. Para existir responsabilidade e prazo.
9. Entendimento, decisão, experimento ou próximo passo.
10. Para preservar risco e evitar reabertura sem evidência.
11. Dados, objetivos, risco, ownership, recurso, relação e valor.
12. Reconstruindo objetivo, fatos, critérios, opções e owner.
13. Quando a incerteza é alta e o teste é seguro.
14. Limites dentro dos quais existe autonomia.
15. Dependência excessiva de uma pessoa.
16. Decisão operacional versus decisão arquitetural durável.
17. Porque necessidades e níveis de detalhe diferem.
18. Com hipótese, faixa, risco e gatilho.
19. Catálogo de riscos, owners e respostas.
20. Quando a decisão ultrapassa autoridade, orçamento ou risco.
21. Para preservar confiança.
22. Ritmo de decisões, comunicação e revisão.
23. Clareza, confiança, foco, ownership e aprendizado.
24. Mentoria e code review sênior.
25. Mentoria e code review sênior.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 659 - M19.49 - Lideranca tecnica

- Continuei após Code review arquitetural.
- Tratei liderança técnica como influência e sistema de trabalho.
- Criei o laboratório `service-scheduling-technical-leadership`.
- Criei Technical Leadership Charter.
- Defini o programa `Fast Confirmation`.
- Registrei problema, baseline, objetivo e não objetivos.
- Criei Stakeholder Map.
- Classifiquei influência, interesse, concerns e ownership.
- Criei Decision Map.
- Exigi owner, prazo, critérios e review trigger.
- Separei fatos, hipóteses e preferências.
- Criei Objectives and Constraints.
- Criei Influence Plan.
- Estruturei Alignment Session.
- Criei perguntas de alinhamento.
- Tornei discordâncias visíveis.
- Criei Conflict Protocol.
- Classifiquei conflitos.
- Diferenciei decisão de experimento.
- Criei Delegation Matrix.
- Modelei delegation boundaries.
- Tratei hero dependency.
- Criei Decision Log.
- Criei Communication Plan por audiência.
- Comuniquei incerteza explicitamente.
- Criei Technical Roadmap.
- Criei Risk Register.
- Priorizei por valor e risco.
- Criei Escalation Policy.
- Pratiquei escalonamento sem surpresa.
- Criei Operating Cadence.
- Protegi tempo de foco.
- Criei Team Health Check.
- Criei Leadership Gate.
- Testei owner, restrições, discordância, delegação, conflito, escalonamento e comunicação.
- Criei Retrospective.
- Criei reports e evidence.
- Não antecipei mentoria aprofundada.
- Próxima aula: Mentoria e code review senior.
```

---

## Referência técnica curta

- Technical Leadership.
- Influence.
- Stakeholder Map.
- Decision Owner.
- Alignment.
- Disagreement.
- Conflict Protocol.
- Delegation Boundary.
- Decision Log.
- Communication Plan.
- Technical Roadmap.
- Risk Register.
- Escalation.
- Operating Cadence.
- Team Health.
- Hero Dependency.
- Disagree and Commit.

Regra final:

```text
Liderança técnica deve aumentar a capacidade coletiva de decidir, executar e aprender, não concentrar autoridade em uma pessoa: o programa Fast Confirmation começa com problema, baseline, objetivos, não objetivos, stakeholders e decisões explícitas; fatos, hipóteses e preferências são separados, restrições de integridade, segurança, contratos, SLO e rollback permanecem visíveis, cada decisão possui owner, contributors, prazo, critérios, evidência e review trigger, e reuniões de alinhamento começam pela decisão necessária, registram discordâncias e terminam com decisão, experimento ou próximo passo; conflitos são enquadrados por dados, objetivos, risco, ownership, recursos, relação ou valores, ataques pessoais são interrompidos e a discussão retorna ao objetivo compartilhado, enquanto delegação transfere autonomia com resultado esperado, boundaries, recursos, checkpoint e gatilhos de escalonamento; comunicação muda por audiência sem mudar os fatos, incerteza é declarada, roadmap é organizado por outcomes, riscos possuem owner e contingência, escalonamento move a decisão para o nível correto sem surpresa ou punição, e a cadência protege foco, visibilidade e revisão; o gate termina com problem frame, stakeholders, decisions, disagreement, conflict protocol, delegation, communication, roadmap, risk register, escalation, health check, retrospective, testes, reports e evidence aprovados, enquanto mentoria e code review sênior permanecem reservados para a aula 660 e arquitetura corporativa brasileira para a aula 661.
```
