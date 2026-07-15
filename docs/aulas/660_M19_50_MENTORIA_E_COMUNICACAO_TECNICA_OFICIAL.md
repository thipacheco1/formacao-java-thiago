# 660 - M19.50 - Mentoria e comunicacao tecnica

## Apresentação da aula

Na aula 659, você aprofundou liderança técnica.

Você transformou o programa fictício `Fast Confirmation` em um sistema de trabalho com problema compartilhado, stakeholders, owners, fatos, hipóteses, restrições, discordâncias, protocolo de conflito, delegação, comunicação por audiência, roadmap, riscos, escalonamento, cadência e retrospectiva.

A principal conclusão foi:

```text
liderança técnica
não deve concentrar decisões;

deve aumentar a capacidade
do time de decidir,
executar e aprender.
```

Agora o foco passa da condução coletiva para o desenvolvimento intencional de pessoas e para a comunicação que sustenta esse desenvolvimento.

Considere uma engenheira fictícia responsável por uma mudança em `Service Scheduling`.

Ela domina Java e Spring, mas ainda apresenta dificuldades para:

- explicar trade-offs;
- identificar boundaries;
- comunicar riscos;
- escolher evidências;
- escrever uma proposta técnica;
- conduzir uma revisão;
- defender uma decisão sem se apoiar em autoridade;
- pedir ajuda no momento correto.

Uma resposta inadequada do líder técnico seria:

```text
corrigir tudo sozinho;
reescrever a solução;
aprovar somente quando
ficar igual ao que ele faria;
centralizar as decisões;
explicar pouco;
medir apenas velocidade.
```

O resultado pode ser uma entrega tecnicamente correta, mas uma equipe mais dependente.

Mentoria técnica busca o efeito oposto:

```text
melhorar a decisão atual
sem impedir que a pessoa
desenvolva capacidade
para decisões futuras.
```

Comunicação técnica é parte dessa mentoria.

Não basta possuir conhecimento. É necessário conseguir adaptá-lo ao contexto, à audiência, ao risco e à decisão esperada.

Um documento técnico pode estar correto e ainda ser inútil se:

- não define o problema;
- esconde premissas;
- usa linguagem inacessível;
- não diferencia fato de opinião;
- não possui owner;
- não apresenta riscos;
- não explica consequência;
- não indica ação;
- não registra o que permanece desconhecido.

A pergunta central será:

```text
como desenvolver autonomia técnica
por meio de contexto,
perguntas,
feedback,
delegação progressiva,
code review,
documentação
e comunicação orientada à decisão?
```

O laboratório será:

```text
labs/m19/aula-660-mentoria-e-comunicacao-tecnica/service-scheduling-technical-mentoring
```

O cenário será:

```text
mudança:
reduzir o tempo da confirmação
sem violar consistência,
segurança ou observabilidade.

mentorada:
Engineer A.

objetivo de desenvolvimento:
conduzir uma decisão técnica
com autonomia progressiva.
```

Você criará:

- Mentoring Charter;
- mapa de competências;
- objetivo de desenvolvimento;
- contrato de mentoria;
- plano de observação;
- banco de perguntas;
- níveis de delegação;
- plano de prática deliberada;
- protocolo de feedback;
- code review orientado a aprendizado;
- plano de comunicação técnica;
- simulação de apresentação;
- registro de progresso;
- critérios de autonomia;
- reports, evidence e gate.

A próxima aula será:

```text
661 - M19.51 - Arquitetura corporativa brasileira
```

A aula 661 aprofundará arquitetura em organizações brasileiras, governança, regulação, legado, fornecedores, integração, orçamento, estruturas de decisão e pragmatismo corporativo.

Nesta aula, o contexto corporativo aparecerá apenas como ambiente de comunicação e mentoria. Governança corporativa completa ficará para a aula seguinte.

Regra central:

```text
mentoria técnica
não entrega respostas prontas
como padrão;

ela cria contexto,
perguntas,
feedback,
prática e responsabilidade
para desenvolver autonomia.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
658:
Code review arquitetural.

659:
Lideranca tecnica.

660:
Mentoria e comunicacao tecnica.

661:
Arquitetura corporativa brasileira.

662:
Governanca tecnica leve.
```

A progressão é:

```text
verificar decisões no código;

liderar decisões coletivas;

desenvolver pessoas
e comunicar decisões;

atuar em contexto corporativo;

criar governança proporcional.
```

Esta aula reutiliza conhecimentos anteriores:

- code review;
- ADR;
- RFC;
- C4;
- trade-offs;
- liderança técnica;
- delegação;
- segurança psicológica;
- evidências;
- feedback;
- documentação.

O foco não será criar uma nova arquitetura.

O foco será desenvolver a capacidade de outra pessoa para compreender, propor, explicar, revisar e evoluir uma arquitetura.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-660-mentoria-e-comunicacao-tecnica
└── service-scheduling-technical-mentoring
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/technicalmentoring
    │   │           ├── competency
    │   │           │   ├── Competency.java
    │   │           │   ├── CompetencyArea.java
    │   │           │   ├── CompetencyLevel.java
    │   │           │   ├── CompetencyEvidence.java
    │   │           │   └── CompetencyMap.java
    │   │           ├── goal
    │   │           │   ├── DevelopmentGoal.java
    │   │           │   ├── GoalOutcome.java
    │   │           │   ├── GoalMilestone.java
    │   │           │   └── GoalReview.java
    │   │           ├── session
    │   │           │   ├── MentoringSession.java
    │   │           │   ├── MentoringQuestion.java
    │   │           │   ├── SessionObservation.java
    │   │           │   └── SessionAction.java
    │   │           ├── delegation
    │   │           │   ├── AutonomyLevel.java
    │   │           │   ├── PracticeAssignment.java
    │   │           │   ├── DecisionBoundary.java
    │   │           │   └── AutonomyAssessment.java
    │   │           ├── feedback
    │   │           │   ├── FeedbackContext.java
    │   │           │   ├── FeedbackObservation.java
    │   │           │   ├── FeedbackImpact.java
    │   │           │   ├── FeedbackRequest.java
    │   │           │   └── FeedbackAgreement.java
    │   │           ├── review
    │   │           │   ├── LearningReview.java
    │   │           │   ├── ReviewComment.java
    │   │           │   ├── ReviewQuestion.java
    │   │           │   ├── ReviewSeverity.java
    │   │           │   └── ReviewOutcome.java
    │   │           ├── communication
    │   │           │   ├── TechnicalAudience.java
    │   │           │   ├── TechnicalMessage.java
    │   │           │   ├── CommunicationObjective.java
    │   │           │   ├── CommunicationReview.java
    │   │           │   └── DecisionNarrative.java
    │   │           ├── progress
    │   │           │   ├── ProgressEvidence.java
    │   │           │   ├── ProgressSnapshot.java
    │   │           │   ├── MentoringHealth.java
    │   │           │   └── MentoringGate.java
    │   │           └── evidence
    │   │               ├── MentoringEvidence.java
    │   │               ├── EvidenceType.java
    │   │               └── EvidenceSanitizer.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/technicalmentoring
    │               ├── competency
    │               │   ├── CompetencyEvidenceTest.java
    │               │   └── CompetencyMapTest.java
    │               ├── goal
    │               │   ├── DevelopmentGoalTest.java
    │               │   └── GoalReviewTest.java
    │               ├── feedback
    │               │   ├── FeedbackSpecificityTest.java
    │               │   └── FeedbackAgreementTest.java
    │               ├── review
    │               │   ├── ReviewQuestionTest.java
    │               │   ├── ReviewToneTest.java
    │               │   └── ReviewLearningOutcomeTest.java
    │               └── architecture
    │                   ├── MentoringBoundaryTest.java
    │                   ├── PersonalDataProtectionTest.java
    │                   ├── CorporateArchitectureNonAnticipationTest.java
    │                   └── GovernanceNonAnticipationTest.java
    ├── mentoring
    │   ├── MENTORING_CHARTER.md
    │   ├── MENTORING_CONTEXT.md
    │   ├── COMPETENCY_MAP.md
    │   ├── DEVELOPMENT_GOAL.md
    │   ├── MENTORING_AGREEMENT.md
    │   ├── OBSERVATION_PLAN.md
    │   ├── QUESTION_BANK.md
    │   ├── AUTONOMY_LADDER.md
    │   ├── DELIBERATE_PRACTICE_PLAN.md
    │   ├── FEEDBACK_PROTOCOL.md
    │   ├── LEARNING_CODE_REVIEW.md
    │   ├── TECHNICAL_COMMUNICATION_PLAN.md
    │   ├── PRESENTATION_REHEARSAL.md
    │   ├── PROGRESS_LOG.md
    │   ├── MENTORING_HEALTH_CHECK.md
    │   ├── COMPLETION_CRITERIA.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_MENTORING_QUESTIONS.md
    ├── contracts
    │   ├── technical-mentoring-contract.yaml
    │   ├── competency-policy.yaml
    │   ├── goal-policy.yaml
    │   ├── session-policy.yaml
    │   ├── question-policy.yaml
    │   ├── delegation-policy.yaml
    │   ├── feedback-policy.yaml
    │   ├── review-policy.yaml
    │   ├── communication-policy.yaml
    │   ├── progress-policy.yaml
    │   ├── evidence-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── competency-baseline-report.yaml
        ├── goal-progress-report.yaml
        ├── session-quality-report.yaml
        ├── delegation-report.yaml
        ├── feedback-report.yaml
        ├── review-learning-report.yaml
        ├── communication-report.yaml
        ├── architecture-report.yaml
        └── technical-mentoring-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-technical-mentoring
├── validate-mentoring-contract.ps1
├── validate-competency-map.ps1
├── validate-development-goal.ps1
├── validate-mentoring-agreement.ps1
├── validate-question-bank.ps1
├── validate-autonomy-ladder.ps1
├── validate-feedback-protocol.ps1
├── validate-learning-review.ps1
├── validate-technical-communication.ps1
├── validate-progress-evidence.ps1
├── run-technical-mentoring-tests.ps1
├── collect-technical-mentoring-evidence.ps1
└── verify-technical-mentoring-gate.ps1
```

---

## Conceito essencial

### Mentoria, coaching, ensino e gestão não são iguais

Mentoria técnica usa experiência para ajudar outra pessoa a interpretar contexto, escolher práticas e reconhecer padrões.

Coaching enfatiza perguntas e reflexão para que a pessoa construa suas próprias respostas.

Ensino estrutura conhecimento e prática para desenvolver uma competência.

Gestão define prioridades, responsabilidades, desempenho e condições de trabalho.

Na prática, um líder técnico pode usar elementos dos quatro, mas precisa saber qual papel está exercendo.

Um problema de prioridade não deve ser disfarçado como mentoria.

Uma avaliação formal de desempenho não deve ser apresentada como conversa confidencial de desenvolvimento.

### Autonomia é resultado, não ausência de apoio

Autonomia técnica significa conseguir:

- compreender o problema;
- buscar contexto;
- identificar riscos;
- propor opções;
- pedir evidência;
- decidir dentro do boundary;
- comunicar incerteza;
- executar;
- verificar resultado;
- escalonar quando necessário.

Abandonar uma pessoa sem contexto não desenvolve autonomia.

Aumenta apenas a chance de erro silencioso.

### Perguntas desenvolvem raciocínio

Perguntas úteis não são armadilhas para provar conhecimento.

Elas ajudam a pessoa a tornar o raciocínio visível.

Exemplos:

```text
qual problema esta mudança resolve?

qual boundary é afetado?

qual estado é autoritativo?

qual falha pode produzir efeito duplicado?

qual evidência reduziria a incerteza?

qual decisão é reversível?

como você explicaria isso
para produto e operação?
```

### Feedback deve ser específico e acionável

Feedback vago produz ansiedade.

Compare:

```text
seja mais sênior.
```

Com:

```text
na revisão do RFC,
você apresentou a solução
antes de registrar o problema,
as restrições e as alternativas.

isso dificultou a validação
do trade-off.

na próxima proposta,
use a sequência:
problema, baseline,
restrições, opções,
evidência e recomendação.
```

O segundo feedback descreve contexto, observação, impacto e ação.

### Code review pode formar ou limitar

Um review pode desenvolver raciocínio quando:

- explica o risco;
- faz perguntas;
- diferencia obrigatório de sugestão;
- conecta comentário a princípio;
- reconhece boa decisão;
- registra evidência;
- evita humilhação;
- permite resposta;
- ajusta profundidade ao risco.

Um review limita quando:

- impõe preferência como regra;
- reescreve tudo;
- usa sarcasmo;
- acumula dezenas de comentários cosméticos;
- esconde o critério;
- bloqueia sem explicar;
- transforma review em prova de superioridade.

### Comunicação técnica deve terminar em decisão ou entendimento

Toda comunicação técnica precisa declarar:

- audiência;
- objetivo;
- contexto;
- mensagem principal;
- evidências;
- riscos;
- ação esperada;
- owner;
- próximo passo.

Sem isso, informação circula, mas a decisão não avança.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-660-mentoria-e-comunicacao-tecnica/service-scheduling-technical-mentoring

Set-Location `
  labs/m19/aula-660-mentoria-e-comunicacao-tecnica/service-scheduling-technical-mentoring
```

---

### 2. Criar Mentoring Charter

Arquivo:

```text
mentoring/MENTORING_CHARTER.md
```

Conteúdo:

```markdown
# Mentoring Charter

Contexto

Service Scheduling.

Objetivo

Desenvolver autonomia
para conduzir uma decisão técnica.

Princípios

- contexto antes de conselho;
- pergunta antes de resposta pronta;
- feedback específico;
- prática com risco controlado;
- delegação progressiva;
- segurança psicológica;
- evidência de evolução;
- confidencialidade proporcional;
- nenhuma avaliação pessoal secreta;
- nenhum dado sensível em reports.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/technical-mentoring-contract.yaml
```

Conteúdo:

```yaml
technicalMentoring:
  context:
    Service-Scheduling

  required:
    - mentoring-charter
    - competency-baseline
    - development-goal
    - mentoring-agreement
    - observation-plan
    - question-bank
    - autonomy-ladder
    - deliberate-practice
    - feedback-protocol
    - learning-code-review
    - technical-communication-plan
    - progress-evidence
    - completion-criteria
    - health-check
    - gate

  forbidden:
    - hidden-performance-evaluation
    - personal-data-in-report
    - answer-everything-for-mentee
    - humiliation
    - sarcasm-in-review
    - preference-as-rule
    - delegation-without-boundary
    - dependency-on-single-mentor
    - corporate-architecture-deep-dive
    - governance-deep-dive

  nextLesson:
    code:
      M19.51
```

---

### 4. Definir o contexto de mentoria

Arquivo:

```text
mentoring/MENTORING_CONTEXT.md
```

Registre:

```text
Pessoa fictícia:
Engineer A.

Responsabilidade atual:
implementar mudanças em Scheduling.

Objetivo de desenvolvimento:
conduzir uma decisão técnica
com autonomia progressiva.

Cenário:
reduzir latência de confirmação.

Risco controlado:
experimento protegido
por feature flag.

Duração:
seis semanas.

Mentor:
Technical Lead.
```

Não inclua nomes reais, avaliações reais ou informações pessoais.

---

### 5. Criar mapa de competências

Arquivo:

```text
mentoring/COMPETENCY_MAP.md
```

Áreas:

```text
problem framing;

domain and boundaries;

trade-off analysis;

distributed systems;

security reasoning;

observability reasoning;

technical writing;

verbal communication;

code review;

execution and verification;

escalation.
```

Para cada competência, defina comportamentos observáveis.

---

### 6. Criar Competency

```java
package br.com.formacao.technicalmentoring.competency;

import java.util.List;
import java.util.Objects;

public record Competency(
        String id,
        CompetencyArea area,
        CompetencyLevel currentLevel,
        CompetencyLevel targetLevel,
        List<String> observableBehaviors,
        List<CompetencyEvidence> evidence) {

    public Competency {
        Objects.requireNonNull(id);
        Objects.requireNonNull(area);
        Objects.requireNonNull(currentLevel);
        Objects.requireNonNull(targetLevel);
        observableBehaviors = List.copyOf(observableBehaviors);
        evidence = List.copyOf(evidence);
    }
}
```

Nível não deve ser baseado em impressão genérica.

Ele precisa de comportamento e evidência.

---

### 7. Definir níveis de competência

Exemplo:

```text
FOUNDATIONAL:
executa com orientação próxima.

ASSISTED:
propõe e valida antes de decidir.

INDEPENDENT:
decide dentro do boundary.

GUIDING:
ajuda outras pessoas
a raciocinar.
```

Evite associar nível a cargo de forma automática.

Uma pessoa pode ser independente em Java e assistida em sistemas distribuídos.

---

### 8. Criar baseline

Baseline da `Engineer A`:

```text
problem framing:
ASSISTED.

trade-off analysis:
ASSISTED.

technical writing:
ASSISTED.

verbal communication:
FOUNDATIONAL.

code review:
ASSISTED.

execution:
INDEPENDENT.
```

O baseline é hipótese inicial e deve ser revisado com evidências.

---

### 9. Criar objetivo de desenvolvimento

Arquivo:

```text
mentoring/DEVELOPMENT_GOAL.md
```

Objetivo:

```text
Em seis semanas,
Engineer A deve conduzir
uma decisão técnica reversível
sobre latência de confirmação,
produzindo framing,
alternativas, evidências,
recomendação, apresentação,
plano de rollout e revisão.
```

Critérios:

- boundary correto;
- risco explícito;
- opções reais;
- evidência suficiente;
- comunicação por audiência;
- decisão dentro do prazo;
- pedido de ajuda no trigger correto;
- retrospectiva.

---

### 10. Criar Development Goal

```java
package br.com.formacao.technicalmentoring.goal;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public record DevelopmentGoal(
        String id,
        String outcome,
        LocalDate targetDate,
        List<GoalMilestone> milestones,
        List<String> successEvidence,
        String owner) {

    public DevelopmentGoal {
        Objects.requireNonNull(id);
        Objects.requireNonNull(outcome);
        Objects.requireNonNull(targetDate);
        milestones = List.copyOf(milestones);
        successEvidence = List.copyOf(successEvidence);
        Objects.requireNonNull(owner);
    }
}
```

---

### 11. Criar acordo de mentoria

Arquivo:

```text
mentoring/MENTORING_AGREEMENT.md
```

Defina:

- objetivo;
- frequência;
- duração;
- responsabilidades;
- confidencialidade;
- limites;
- feedback;
- cancelamento;
- escalonamento;
- evidências;
- revisão do acordo.

A pessoa mentorada precisa participar do acordo.

---

### 12. Separar mentoria de avaliação formal

Registre:

```text
Mentoring evidence:
serve para orientar desenvolvimento.

Performance process:
segue política formal separada.

Mentoring report:
não contém julgamento secreto,
diagnóstico pessoal
ou informação sensível.
```

Quando os papéis se sobrepõem, seja transparente.

---

### 13. Criar plano de observação

Arquivo:

```text
mentoring/OBSERVATION_PLAN.md
```

Observe:

```text
uma proposta escrita;

uma sessão de refinamento;

um code review;

uma apresentação;

uma decisão sob incerteza;

uma retrospectiva.
```

Não observe tudo o tempo inteiro.

Defina purpose e consentimento.

---

### 14. Criar banco de perguntas

Arquivo:

```text
mentoring/QUESTION_BANK.md
```

Categorias:

```text
problema;

domínio;

boundary;

consistência;

falha;

segurança;

observabilidade;

evidência;

comunicação;

execução;

aprendizado.
```

---

### 15. Usar perguntas de profundidade progressiva

Exemplo:

```text
Nível 1:
qual é o objetivo?

Nível 2:
qual restrição limita a opção?

Nível 3:
qual hipótese ainda não foi provada?

Nível 4:
qual falha produz estado incorreto?

Nível 5:
como a decisão muda
se o volume multiplicar por dez?
```

A pergunta deve caber no nível atual sem remover desafio.

---

### 16. Criar Mentoring Question

```java
package br.com.formacao.technicalmentoring.session;

public record MentoringQuestion(
        String id,
        String category,
        String question,
        String purpose,
        int depthLevel) {

    public MentoringQuestion {
        if (depthLevel < 1 || depthLevel > 5) {
            throw new IllegalArgumentException(
                    "Depth level must be between 1 and 5");
        }
    }
}
```

---

### 17. Evitar interrogatório

Uma sessão não deve ser uma sequência de perguntas destinadas a fazer a pessoa adivinhar a resposta do mentor.

Quando a lacuna é de conhecimento básico, ensine diretamente.

Quando o risco é crítico, interrompa e explique.

Quando a pessoa possui contexto suficiente, use perguntas.

---

### 18. Criar Autonomy Ladder

Arquivo:

```text
mentoring/AUTONOMY_LADDER.md
```

Níveis:

```text
OBSERVE:
acompanha o mentor.

EXECUTE_WITH_GUIDANCE:
executa com passos definidos.

PROPOSE:
pesquisa e recomenda.

DECIDE_WITH_CHECKPOINT:
decide e valida antes da ação.

DECIDE_AND_INFORM:
decide dentro do boundary.

OWN_AND_TEACH:
possui a capacidade
e orienta outras pessoas.
```

---

### 19. Criar Practice Assignment

```java
package br.com.formacao.technicalmentoring.delegation;

import java.time.LocalDate;
import java.util.List;

public record PracticeAssignment(
        String id,
        String owner,
        AutonomyLevel autonomyLevel,
        String expectedOutcome,
        List<DecisionBoundary> boundaries,
        List<String> availableSupport,
        LocalDate checkpoint,
        List<String> escalationTriggers) {

    public PracticeAssignment {
        boundaries = List.copyOf(boundaries);
        availableSupport = List.copyOf(availableSupport);
        escalationTriggers = List.copyOf(escalationTriggers);
    }
}
```

---

### 20. Delegar a proposta técnica

Assignment:

```text
Outcome:
RFC curto para reduzir latência.

Autonomia:
PROPOSE.

Boundaries:
sem remover Saga;
sem aceitar dupla reserva;
sem reduzir autorização;
sem contrato incompatível;
rollback obrigatório.

Support:
baseline;
diagramas;
traces;
consulta com Capacity.

Checkpoint:
em três dias.

Escalonar se:
SLO ou consistência
não puderem ser preservados.
```

---

### 21. Criar prática deliberada

Arquivo:

```text
mentoring/DELIBERATE_PRACTICE_PLAN.md
```

Ciclo:

```text
competência específica;

tarefa curta;

critério claro;

feedback rápido;

nova tentativa;

complexidade crescente;

reflexão.
```

Exemplo:

```text
prática:
explicar o mesmo trade-off
em cinco minutos
para engenharia,
produto e operação.
```

---

### 22. Criar protocolo de feedback

Arquivo:

```text
mentoring/FEEDBACK_PROTOCOL.md
```

Estrutura:

```text
Contexto:
onde ocorreu.

Observação:
comportamento verificável.

Impacto:
efeito produzido.

Pergunta:
como a pessoa interpreta.

Pedido:
ação específica.

Acordo:
próximo passo e revisão.
```

---

### 23. Criar Feedback Context

```java
package br.com.formacao.technicalmentoring.feedback;

import java.time.Instant;
import java.util.Objects;

public record FeedbackContext(
        String activity,
        Instant occurredAt,
        String goalId,
        String evidenceReference) {

    public FeedbackContext {
        Objects.requireNonNull(activity);
        Objects.requireNonNull(occurredAt);
        Objects.requireNonNull(goalId);
        Objects.requireNonNull(evidenceReference);
    }
}
```

---

### 24. Dar feedback positivo específico

Exemplo:

```text
Na apresentação do RFC,
você abriu com problema,
baseline e decisão necessária.

Isso permitiu que Produto
e Capacity discutissem
o mesmo objetivo.

Mantenha essa estrutura
nas próximas propostas.
```

Reconhecimento específico reforça comportamento reproduzível.

---

### 25. Dar feedback corretivo específico

Exemplo:

```text
No diagrama,
Communication apareceu
como autoridade da confirmação.

Isso criou confusão
sobre ownership do estado.

Na próxima versão,
represente Scheduling
como autoridade
e Communication
como consumer de evento.
```

---

### 26. Receber feedback

O mentor também deve perguntar:

```text
o que nesta sessão ajudou?

onde eu entreguei resposta cedo demais?

qual parte ficou confusa?

qual nível de autonomia
pareceu inadequado?

que suporte está faltando?
```

Mentoria é uma relação revisável.

---

### 27. Criar code review orientado a aprendizado

Arquivo:

```text
mentoring/LEARNING_CODE_REVIEW.md
```

Fluxo:

```text
1. compreender intenção;

2. identificar risco;

3. reconhecer boa decisão;

4. separar blocker de sugestão;

5. fazer perguntas;

6. explicar princípio;

7. pedir evidência;

8. combinar follow-up;

9. registrar aprendizado.
```

---

### 28. Classificar comentários

Use:

```text
BLOCKER:
risco de correção,
segurança, dados ou operação.

IMPORTANT:
melhoria necessária
antes de consolidar a decisão.

QUESTION:
pede raciocínio ou contexto.

SUGGESTION:
opção não obrigatória.

PRAISE:
reconhece boa prática específica.
```

---

### 29. Criar Review Comment

```java
package br.com.formacao.technicalmentoring.review;

public record ReviewComment(
        ReviewSeverity severity,
        String location,
        String observation,
        String riskOrPrinciple,
        String questionOrRequest,
        boolean learningRelevant) {
}
```

---

### 30. Transformar ordem em pergunta

Ordem:

```text
use Outbox aqui.
```

Pergunta formativa:

```text
O que acontece se a transação
confirmar no banco,
mas a publicação falhar?

Que mecanismo preserva
a entrega posterior
sem dual write?
```

Se o risco já é conhecido e crítico, marque também o blocker.

Pergunta não deve esconder obrigatoriedade.

---

### 31. Evitar excesso de comentários

Agrupe comentários repetidos por princípio.

Priorize:

- correção;
- segurança;
- dados;
- contrato;
- operação;
- legibilidade relevante.

Não use review para impor cada detalhe pessoal.

---

### 32. Pedir auto-review

Antes de enviar o PR, a pessoa responde:

```text
qual risco principal?

qual decisão é reversível?

qual evidência foi executada?

qual boundary mudou?

qual rollback existe?

qual ponto merece atenção do reviewer?
```

Auto-review desenvolve metacognição.

---

### 33. Criar plano de comunicação técnica

Arquivo:

```text
mentoring/TECHNICAL_COMMUNICATION_PLAN.md
```

Audiências:

```text
engenharia;

produto;

operação;

segurança;

liderança executiva.
```

Para cada uma, defina:

- decisão;
- contexto necessário;
- profundidade;
- evidência;
- risco;
- ação esperada;
- tempo disponível.

---

### 34. Criar Decision Narrative

Estrutura:

```text
1. situação atual;

2. problema;

3. impacto;

4. restrições;

5. opções;

6. recomendação;

7. riscos;

8. evidências;

9. plano;

10. decisão necessária.
```

---

### 35. Criar Technical Message

```java
package br.com.formacao.technicalmentoring.communication;

import java.util.List;

public record TechnicalMessage(
        TechnicalAudience audience,
        CommunicationObjective objective,
        String mainMessage,
        List<String> evidence,
        List<String> risks,
        String expectedAction,
        int maximumMinutes) {

    public TechnicalMessage {
        evidence = List.copyOf(evidence);
        risks = List.copyOf(risks);

        if (maximumMinutes < 1) {
            throw new IllegalArgumentException(
                    "Maximum minutes must be positive");
        }
    }
}
```

---

### 36. Adaptar a mesma decisão

Para engenharia:

```text
boundary;
protocolo;
consistência;
falha;
testes;
rollout.
```

Para produto:

```text
impacto no cliente;
escopo;
risco;
experimento;
resultado esperado.
```

Para operação:

```text
mudança;
sinais;
alerta;
runbook;
rollback.
```

A mensagem muda de profundidade, não de verdade.

---

### 37. Ensaiar apresentação

Arquivo:

```text
mentoring/PRESENTATION_REHEARSAL.md
```

Rodadas:

```text
primeira:
10 minutos sem interrupção.

segunda:
perguntas técnicas.

terceira:
perguntas executivas.

quarta:
resumo de 2 minutos.
```

Avalie clareza, sequência, evidência, resposta a incerteza e pedido de decisão.

---

### 38. Ensinar a dizer “não sei”

Resposta madura:

```text
não tenho essa evidência agora.

a hipótese é X.

posso validar com Y
até amanhã.

sem essa validação,
não recomendo rollout amplo.
```

Inventar certeza é pior que declarar lacuna.

---

### 39. Tratar comunicação escrita

Checklist:

- título específico;
- resumo inicial;
- problema;
- decisão necessária;
- links internos;
- seções curtas;
- termos definidos;
- diagramas legíveis;
- riscos;
- owner;
- prazo;
- histórico de mudança.

---

### 40. Tratar conversas difíceis

Quando a entrega não atende ao esperado:

```text
prepare evidências;

converse em privado;

seja direto;

separe pessoa de comportamento;

escute contexto;

explique impacto;

combine ação;

ofereça suporte;

registre somente o necessário;

revise.
```

Não use indiretas públicas.

---

### 41. Definir critérios de escalonamento

A pessoa mentorada deve pedir ajuda quando:

- risco de segurança é alto;
- dado pode ser corrompido;
- boundary não possui owner;
- contrato será quebrado;
- rollback não existe;
- SLO pode ser violado;
- decisão ultrapassa autonomia;
- conflito impede progresso;
- evidência essencial não está disponível.

Pedir ajuda no momento correto é autonomia, não fraqueza.

---

### 42. Criar registro de progresso

Arquivo:

```text
mentoring/PROGRESS_LOG.md
```

Registre por semana:

- prática;
- evidência;
- feedback;
- decisão tomada;
- ajuda solicitada;
- resultado;
- aprendizado;
- próximo passo.

Não registre rótulos pessoais.

---

### 43. Criar Progress Snapshot

```java
package br.com.formacao.technicalmentoring.progress;

import java.time.LocalDate;
import java.util.List;

public record ProgressSnapshot(
        LocalDate date,
        String goalId,
        List<ProgressEvidence> evidence,
        List<String> observedGrowth,
        List<String> nextPractices,
        MentoringHealth health) {

    public ProgressSnapshot {
        evidence = List.copyOf(evidence);
        observedGrowth = List.copyOf(observedGrowth);
        nextPractices = List.copyOf(nextPractices);
    }
}
```

---

### 44. Revisar nível de autonomia

Aumente autonomia quando a pessoa demonstra:

- framing consistente;
- risco visível;
- decisão dentro do boundary;
- evidência proporcional;
- comunicação honesta;
- escalonamento correto;
- execução e verificação;
- aprendizado registrado.

Reduza temporariamente quando o risco aumenta ou o contexto muda.

Isso não é punição.

---

### 45. Criar Mentoring Health Check

Arquivo:

```text
mentoring/MENTORING_HEALTH_CHECK.md
```

Perguntas:

```text
o objetivo está claro?

a pessoa possui autonomia real?

o mentor responde cedo demais?

o feedback é específico?

a prática é relevante?

há segurança para discordar?

existe dependência excessiva?

o progresso possui evidência?

o acordo precisa mudar?
```

---

### 46. Definir conclusão

Arquivo:

```text
mentoring/COMPLETION_CRITERIA.md
```

A mentoria pode concluir quando:

- objetivo foi atingido;
- evidências são suficientes;
- autonomia alvo foi demonstrada;
- próxima prática está clara;
- dependência do mentor diminuiu;
- retrospectiva foi realizada;
- novo acordo não é necessário.

Encerrar bem é parte da mentoria.

---

### 47. Testar competência sem evidência

Cenário:

```text
current level:
INDEPENDENT.

evidence:
empty.
```

O teste deve falhar.

Nível sem comportamento e evidência é opinião.

---

### 48. Testar objetivo vago

Entrada:

```text
ser mais sênior.
```

Resultado:

```text
FAIL_GOAL_OUTCOME
```

O objetivo precisa de outcome, prazo e evidência.

---

### 49. Testar pergunta manipulativa

Pergunta:

```text
você não acha que deveria
usar Outbox?
```

O teste deve indicar pergunta direcionada.

Reescreva para explorar falha e requisito.

---

### 50. Testar feedback vago

Entrada:

```text
melhore sua comunicação.
```

O teste deve falhar por ausência de contexto, observação, impacto e pedido.

---

### 51. Testar review hostil

Entrada:

```text
isso é básico.
como você não percebeu?
```

Resultado:

```text
FAIL_REVIEW_TONE
```

O risco técnico deve ser reescrito sem humilhação.

---

### 52. Testar preferência como regra

Comentário:

```text
use meu padrão de nomes
porque é melhor.
```

Sem convenção ou risco, classifique como sugestão, não blocker.

---

### 53. Testar autonomia sem boundary

Assignment possui outcome, mas não define:

- limites;
- checkpoint;
- triggers;
- suporte.

O gate deve falhar.

---

### 54. Testar comunicação por audiência

A mesma mensagem técnica completa é enviada para liderança executiva sem resumo ou decisão esperada.

O teste deve falhar por audiência inadequada.

---

### 55. Testar pedido de ajuda

Cenário:

- risco cross-tenant;
- autonomia `DECIDE_AND_INFORM`;
- pessoa decide sozinha.

O teste deve falhar.

O trigger exige escalonamento.

---

### 56. Testar progresso real

Evidências:

```text
RFC aprovado;

apresentação concluída;

review com perguntas;

rollout controlado;

retrospectiva;

pedido de ajuda no trigger correto.
```

O gate pode elevar autonomia para `DECIDE_WITH_CHECKPOINT` ou `DECIDE_AND_INFORM`, conforme o risco.

---

### 57. Criar reports

Exemplo:

```yaml
technicalMentoring:
  competencies:
    total:
      11
    withObservableBehavior:
      11
    withEvidence:
      11

  goal:
    defined:
      true
    milestones:
      5
    completed:
      5

  sessions:
    total:
      6
    withActions:
      6

  delegation:
    assignments:
      4
    withoutBoundary:
      0

  feedback:
    total:
      8
    vague:
      0

  reviews:
    totalComments:
      24
    hostile:
      0
    learningRelevant:
      18

  communication:
    audiencesCovered:
      4

  gate:
    PASS
```

---

### 58. Criar evidence

Arquivo:

```text
contracts/technical-mentoring-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- competency count;
- competency evidence coverage;
- goal status;
- milestone count;
- completed milestone count;
- session count;
- session action coverage;
- practice assignment count;
- delegation boundary coverage;
- feedback count;
- vague feedback count;
- review comment count;
- hostile review count;
- learning relevant review count;
- communication audience count;
- autonomy level;
- health check status;
- completion status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais;
- dados pessoais;
- avaliação de desempenho real;
- informações médicas;
- conflitos privados;
- mensagens privadas;
- salários;
- credenciais;
- endpoints privados;
- decisões corporativas reais;
- conteúdo aprofundado da aula 661.

---

### 59. Criar Gate Status

Status:

```text
PASS;

FAIL_MENTORING_CHARTER;

FAIL_COMPETENCY_BASELINE;

FAIL_GOAL_OUTCOME;

FAIL_MENTORING_AGREEMENT;

FAIL_OBSERVATION_PLAN;

FAIL_QUESTION_QUALITY;

FAIL_AUTONOMY_BOUNDARY;

FAIL_PRACTICE_PLAN;

FAIL_FEEDBACK_SPECIFICITY;

FAIL_REVIEW_TONE;

FAIL_REVIEW_LEARNING;

FAIL_COMMUNICATION_AUDIENCE;

FAIL_PROGRESS_EVIDENCE;

FAIL_MENTORING_HEALTH;

FAIL_COMPLETION_CRITERIA;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 60. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\validate-mentoring-contract.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-competency-map.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-development-goal.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-mentoring-agreement.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-question-bank.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-autonomy-ladder.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-feedback-protocol.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-learning-review.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-technical-communication.ps1

.\scripts\m19\service-scheduling-technical-mentoring\validate-progress-evidence.ps1

.\scripts\m19\service-scheduling-technical-mentoring\run-technical-mentoring-tests.ps1

.\scripts\m19\service-scheduling-technical-mentoring\collect-technical-mentoring-evidence.ps1

.\scripts\m19\service-scheduling-technical-mentoring\verify-technical-mentoring-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 61. Encerrar o laboratório

Confirme:

- charter;
- contexto fictício;
- competência;
- baseline;
- objetivo;
- acordo;
- observação;
- perguntas;
- autonomia;
- prática deliberada;
- feedback;
- learning review;
- comunicação;
- ensaio;
- progresso;
- health check;
- conclusão;
- reports;
- evidence;
- gate aprovado;
- dados pessoais ausentes;
- arquitetura corporativa não antecipada;
- governança técnica não antecipada.

---

## Entendendo o que foi feito

### A mentoria ganhou objetivo verificável

Você substituiu intenções vagas por outcome, prazo, milestones e evidências.

### Competência ganhou comportamento observável

Níveis deixaram de ser rótulos abstratos.

Cada competência passou a possuir comportamento e evidência.

### Autonomia ganhou progressão

A pessoa não foi abandonada nem controlada em excesso.

Autonomia cresceu por níveis, boundaries, checkpoints e triggers.

### Feedback ganhou precisão

Contexto, observação, impacto, pergunta, pedido e acordo substituíram avaliações vagas.

### Code review ganhou função educativa

O review continuou protegendo qualidade, mas passou também a desenvolver raciocínio, metacognição e comunicação.

### Comunicação ganhou propósito

A mesma verdade técnica foi adaptada para engenharia, produto, operação e liderança sem manipular o conteúdo.

### O mentor deixou de ser centro permanente

Conclusão e redução de dependência passaram a fazer parte do sucesso.

---

## Erros comuns importantes

### Dar respostas cedo demais

A entrega avança, mas o raciocínio não se desenvolve.

### Transformar mentoria em avaliação secreta

A confiança desaparece e a pessoa evita expor dúvidas.

### Usar objetivo vago

“Ser mais sênior” não define comportamento, prazo ou evidência.

### Fazer perguntas manipulativas

A pessoa tenta adivinhar a resposta do mentor em vez de raciocinar.

### Abandonar em nome da autonomia

Sem contexto e boundary, a pessoa recebe risco, não autonomia.

### Dar feedback sobre identidade

“Você é confuso” é diferente de descrever uma comunicação específica e seu impacto.

### Usar sarcasmo em review

Humilhação reduz segurança psicológica e esconde dúvidas.

### Corrigir cada detalhe pessoal

Review vira disputa de estilo e obscurece riscos importantes.

### Comunicar a mesma forma para todos

Audiências possuem decisões, vocabulários e profundidades diferentes.

### Nunca encerrar a mentoria

Dependência contínua não é sucesso.

### Antecipar arquitetura corporativa

A aplicação organizacional ampla pertence à aula 661.

---

## Comandos úteis

### Validar competências

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\validate-competency-map.ps1
```

### Validar objetivo

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\validate-development-goal.ps1
```

### Validar feedback

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\validate-feedback-protocol.ps1
```

### Validar review

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\validate-learning-review.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\run-technical-mentoring-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-technical-mentoring\verify-technical-mentoring-gate.ps1
```

---

## Exercício guiado

Crie um segundo cenário fictício:

```text
Engineer B precisa conduzir
uma análise de incidente
causado por consumer lag.
```

Defina:

1. competência alvo;
2. baseline;
3. outcome;
4. milestones;
5. observações;
6. perguntas;
7. autonomia;
8. prática deliberada;
9. feedback;
10. code review ou runbook review;
11. comunicação para operação;
12. comunicação para produto;
13. progress evidence;
14. completion criteria;
15. gate.

Demonstre como apoiar sem escrever toda a análise pela pessoa.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 659 e ponte para a aula 661 foram preservadas;
- laboratório `service-scheduling-technical-mentoring` foi criado;
- Mentoring Charter foi criado;
- contexto usa pessoa fictícia;
- Competency Map foi criado;
- competências possuem comportamento observável;
- baseline possui evidência;
- Development Goal possui outcome, prazo e milestones;
- Mentoring Agreement foi criado;
- mentoria foi separada de avaliação formal;
- Observation Plan foi criado;
- Question Bank foi criado;
- perguntas possuem propósito e profundidade;
- interrogatório manipulativo foi evitado;
- Autonomy Ladder foi criada;
- Practice Assignment possui boundaries, suporte, checkpoint e triggers;
- Deliberate Practice Plan foi criado;
- Feedback Protocol foi criado;
- feedback positivo e corretivo são específicos;
- mentor solicita feedback;
- Learning Code Review foi criado;
- comentários possuem severidade e propósito;
- blockers foram diferenciados de sugestões;
- hostilidade e sarcasmo foram proibidos;
- auto-review foi praticado;
- Technical Communication Plan foi criado;
- mensagens foram adaptadas por audiência;
- Decision Narrative foi criada;
- apresentação foi ensaiada;
- incerteza foi comunicada honestamente;
- comunicação escrita foi revisada;
- conversas difíceis possuem protocolo;
- triggers de ajuda foram definidos;
- Progress Log foi criado;
- autonomia foi revisada por evidência;
- Mentoring Health Check foi criado;
- Completion Criteria foram definidos;
- testes de competência, objetivo, perguntas, feedback, review, autonomia e comunicação foram executados;
- reports e evidence foram criados;
- nenhum dado pessoal real foi incluído;
- commit recomendado e diário de bordo estão presentes;
- arquitetura corporativa brasileira não foi antecipada;
- governança técnica leve não foi antecipada.

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
  labs/m19/aula-660-mentoria-e-comunicacao-tecnica/service-scheduling-technical-mentoring `
  scripts/m19/service-scheduling-technical-mentoring `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realEmployee|salary|medical|personalConflict|privateMessage|performanceRating|productionTopology|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): praticar mentoria e comunicacao tecnica"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- nomes reais;
- dados pessoais;
- avaliações de desempenho;
- informações médicas;
- conflitos privados;
- mensagens privadas;
- salários;
- credenciais;
- endpoints privados;
- topologia real;
- decisões corporativas reais;
- conteúdo aprofundado da aula 661.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou mentoria e comunicação técnica.

Você criou:

```text
Mentoring Charter;

Mentoring Context;

Competency Map;

Development Goal;

Mentoring Agreement;

Observation Plan;

Question Bank;

Autonomy Ladder;

Deliberate Practice Plan;

Feedback Protocol;

Learning Code Review;

Technical Communication Plan;

Presentation Rehearsal;

Progress Log;

Mentoring Health Check;

Completion Criteria;

reports, evidence e gate.
```

Você comprovou que mentoria técnica não consiste em entregar respostas prontas, corrigir tudo ou criar dependência.

Ela combina contexto, perguntas, ensino quando necessário, prática deliberada, feedback específico, delegação progressiva e revisão baseada em evidência.

Você transformou code review em uma oportunidade de aprendizado sem reduzir sua responsabilidade de proteger correção, segurança, dados, contratos e operação.

Também aprendeu a adaptar a mesma decisão técnica para engenharia, produto, operação e liderança, mantendo verdade, risco, evidência e ação esperada.

A próxima aula será:

```text
661 - M19.51 - Arquitetura corporativa brasileira
```

Nela, você irá aprofundar como decisões de arquitetura acontecem em empresas brasileiras com legado, regulação, orçamento, fornecedores, estruturas hierárquicas, centros de excelência, múltiplas áreas e diferentes níveis de maturidade.

Nenhum aprofundamento completo de arquitetura corporativa ou governança técnica leve foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o charter.
- [ ] Mapeei competências.
- [ ] Defini objetivo verificável.
- [ ] Criei acordo de mentoria.
- [ ] Preparei perguntas.
- [ ] Defini autonomia e boundaries.
- [ ] Criei prática deliberada.
- [ ] Dei feedback específico.
- [ ] Usei code review para ensinar.
- [ ] Adaptei comunicação.
- [ ] Registrei progresso.
- [ ] Defini conclusão e gate.

---

## Troubleshooting adicional

### A pessoa sempre pergunta a solução

Responda com contexto e uma pergunta adequada ao nível. Ensine diretamente quando faltar conhecimento fundamental.

### O mentor fala a sessão inteira

Use agenda, tempo de fala, perguntas e síntese da pessoa mentorada.

### O objetivo não evolui

Reduza escopo, revise evidências, aumente frequência de prática e verifique se o objetivo é relevante.

### A autonomia aumentou cedo demais

Retorne temporariamente a um nível com checkpoint e explique o risco.

### O feedback gera defesa

Revise especificidade, momento, tom, contexto e espaço para a interpretação da outra pessoa.

### O review possui comentários demais

Agrupe por princípio e priorize blockers, riscos e aprendizado de maior valor.

### A pessoa evita apresentar

Use ensaio curto, audiência segura e complexidade progressiva.

### A mensagem técnica fica longa

Comece por resumo, decisão necessária, risco e ação. Mova detalhes para anexos.

### O mentor virou gargalo

Distribua sessões, crie pares, documente contexto e aumente autonomia.

### A equipe quer discutir governança corporativa

Preserve o aprofundamento para as aulas 661 e 662.

---

## Perguntas de revisão

1. Qual diferença entre mentoria, coaching, ensino e gestão?
2. O que é autonomia técnica?
3. Por que perguntas desenvolvem raciocínio?
4. Quando o mentor deve ensinar diretamente?
5. O que torna feedback específico?
6. O que é prática deliberada?
7. O que é um comportamento observável?
8. Por que baseline precisa de evidência?
9. Como definir um objetivo de desenvolvimento?
10. O que deve existir em um acordo de mentoria?
11. O que é Autonomy Ladder?
12. Por que delegação precisa de boundary?
13. Como code review pode desenvolver pessoas?
14. Qual diferença entre blocker e sugestão?
15. Por que sarcasmo é inadequado?
16. O que é auto-review?
17. Como adaptar comunicação por audiência?
18. Como comunicar incerteza?
19. Quando pedir ajuda demonstra autonomia?
20. O que registrar no Progress Log?
21. Como revisar autonomia?
22. O que o Mentoring Health Check avalia?
23. Quando a mentoria pode terminar?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Experiência, reflexão, conhecimento e responsabilidade formal.
2. Decidir e executar dentro de boundaries, pedindo ajuda no trigger correto.
3. Porque tornam o raciocínio visível.
4. Quando falta conhecimento fundamental ou existe risco crítico.
5. Contexto, observação, impacto, pedido e acordo.
6. Tarefa focada com critério, feedback e repetição.
7. Ação que pode ser observada e verificada.
8. Para evitar rótulo baseado em impressão.
9. Com outcome, prazo, milestones e evidências.
10. Objetivo, responsabilidades, frequência, limites e revisão.
11. Progressão de níveis de autonomia.
12. Para definir limites e risco.
13. Explicando princípios, fazendo perguntas e reconhecendo boas decisões.
14. Obrigatório por risco versus melhoria opcional.
15. Porque humilha e reduz segurança psicológica.
16. Revisão realizada pelo próprio autor antes do PR.
17. Ajustando profundidade e ação sem mudar os fatos.
18. Declarando hipótese, lacuna, plano e limite da decisão.
19. Quando reconhece risco ou limite de autonomia.
20. Prática, evidência, feedback, resultado e próximo passo.
21. Por comportamento e evidência.
22. Clareza, apoio, feedback, autonomia, confiança e dependência.
23. Quando o objetivo e a autonomia alvo foram demonstrados.
24. Arquitetura corporativa brasileira.
25. Arquitetura corporativa brasileira.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 660 - M19.50 - Mentoria e comunicacao tecnica

- Continuei após Liderança técnica.
- Tratei mentoria como desenvolvimento de autonomia.
- Criei o laboratório `service-scheduling-technical-mentoring`.
- Criei Mentoring Charter.
- Usei pessoa fictícia no cenário.
- Criei Competency Map.
- Defini comportamentos observáveis e evidências.
- Criei Development Goal com outcome, prazo e milestones.
- Criei Mentoring Agreement.
- Separei mentoria de avaliação formal.
- Criei Observation Plan.
- Criei Question Bank.
- Modelei perguntas por profundidade.
- Evitei interrogatório manipulativo.
- Criei Autonomy Ladder.
- Modelei Practice Assignment com boundaries e triggers.
- Criei Deliberate Practice Plan.
- Criei Feedback Protocol.
- Pratiquei feedback positivo e corretivo específico.
- Solicitei feedback sobre a própria mentoria.
- Criei Learning Code Review.
- Classifiquei blockers, perguntas, sugestões e reconhecimento.
- Proibi hostilidade e sarcasmo.
- Pratiquei auto-review.
- Criei Technical Communication Plan.
- Adaptei mensagens por audiência.
- Criei Decision Narrative.
- Ensaiei apresentação técnica.
- Comuniquei incerteza honestamente.
- Modelei conversas difíceis.
- Defini triggers de ajuda.
- Criei Progress Log.
- Revisei autonomia por evidência.
- Criei Mentoring Health Check.
- Criei Completion Criteria.
- Executei testes de competência, objetivo, feedback, review, autonomia e comunicação.
- Criei reports, evidence e gate.
- Não antecipei arquitetura corporativa brasileira.
- Próxima aula: Arquitetura corporativa brasileira.
```

---

## Referência técnica curta

- Technical Mentoring.
- Coaching Question.
- Competency Map.
- Observable Behavior.
- Development Goal.
- Mentoring Agreement.
- Deliberate Practice.
- Autonomy Ladder.
- Delegation Boundary.
- Specific Feedback.
- Learning Code Review.
- Self Review.
- Technical Communication.
- Decision Narrative.
- Psychological Safety.
- Progress Evidence.
- Mentoring Health.

Regra final:

```text
Mentoria e comunicação técnica devem desenvolver autonomia verificável, não dependência do mentor: o cenário usa uma pessoa fictícia, competências possuem comportamentos observáveis, baseline e evidências, o objetivo define outcome, prazo, milestones e critérios, e o acordo separa desenvolvimento de avaliação formal; sessões combinam ensino direto quando falta base, perguntas quando existe contexto, prática deliberada com risco controlado, feedback específico por contexto, observação, impacto, pedido e acordo, e uma Autonomy Ladder que progride de observar para executar, propor, decidir com checkpoint, decidir e informar e possuir a capacidade; code review continua bloqueando riscos de correção, segurança, dados, contratos e operação, mas diferencia blocker, pergunta, sugestão e reconhecimento, evita sarcasmo, explica princípios, pede evidência e estimula auto-review; comunicação adapta profundidade para engenharia, produto, operação e liderança sem alterar fatos, declara incertezas, decisão esperada, owner e próximo passo, enquanto conversas difíceis preservam respeito e clareza; progresso é medido por RFCs, decisões, apresentações, reviews, pedidos de ajuda, rollout e retrospectivas, nunca por rótulos pessoais, e a mentoria termina quando a autonomia alvo é demonstrada e a dependência diminui; o gate final valida charter, competency map, goal, agreement, questions, autonomy, practice, feedback, review, communication, progress, health, completion, testes, reports e evidence, enquanto arquitetura corporativa brasileira permanece reservada para a aula 661 e governança técnica leve para a aula 662.
```
