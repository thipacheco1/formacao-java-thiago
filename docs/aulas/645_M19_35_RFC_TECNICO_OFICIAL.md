# 645 - M19.35 - RFC tecnico

## Apresentação da aula

Na aula 644, você aprendeu a preservar decisões arquiteturais com ADRs. O ADR registra contexto, escolha, consequências, evidências, riscos e gatilhos de revisão.

Antes da decisão aceita, porém, existe outra necessidade: submeter uma proposta relevante à crítica de pessoas que enxergam riscos diferentes.

Quando a discussão ocorre apenas em reuniões ou mensagens soltas, partes interessadas ficam de fora, comentários desaparecem, segurança e operação entram tarde e o silêncio pode ser confundido com concordância.

Um Request for Comments, ou RFC técnico, organiza uma proposta para revisão colaborativa antes da decisão final. Ele combina documento e processo: autores, revisores, prazo, estados, comentários rastreáveis, critérios de aprovação e saída explícita.

A pergunta desta aula será:

```text
como conduzir uma proposta técnica
até uma decisão clara,
sem burocracia excessiva,
sem aprovação silenciosa
e sem confundir opinião com evidência?
```

O laboratório será:

```text
labs/m19/aula-645-rfc-tecnico/service-scheduling-rfc
```

Você criará um RFC para evoluir a confirmação de `Appointment`: o estado autoritativo continuará síncrono, enquanto efeitos externos serão processados de forma assíncrona confiável. O laboratório terá template, lifecycle, reviewers, comentários, decisão, reports, evidence e gate.

A próxima aula será:

```text
646 - M19.36 - C4 Model
```

System Context, Container, Component e representação visual estruturada ficam reservados para a aula 646.

Regra central:

```text
RFC não anuncia decisão pronta;

torna uma proposta
compreensível,
criticável,
rastreável
e decidível.
```

## Onde estamos na formação

A sequência oficial é:

```text
641 Design de sistemas parte 1;
642 Design de sistemas parte 2;
643 Trade offs tecnicos;
644 ADR;
645 RFC tecnico;
646 C4 Model;
647 Fitness functions arquiteturais.
```

As aulas 641 e 642 construíram e pressionaram um design. A aula 643 comparou opções. A aula 644 registrou uma decisão aceita. Agora você trabalhará o caminho anterior à aceitação:

```text
problema;
proposta;
revisão;
comentários;
decisão;
saída;
ADR quando necessário.
```

A diferença é:

```text
trade-off compara;
RFC submete à revisão;
ADR registra a decisão;
C4 representa a arquitetura.
```

Nem toda mudança exige RFC. O processo deve ser proporcional ao risco. Nesta aula, o foco é tornar propostas criticáveis e decidíveis; diagramas C4 ficam para a aula 646.

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-645-rfc-tecnico/service-scheduling-rfc
```

A estrutura principal terá:

```text
src/main/java/br/com/formacao/rfc
├── model
├── review
├── lifecycle
├── validation
├── registry
├── decision
└── application

src/test/java/br/com/formacao/rfc
├── lifecycle
├── review
├── validation
├── decision
└── architecture

rfc
├── RFC_POLICY.md
├── RFC_LIFECYCLE.md
├── REVIEW_POLICY.md
├── DECISION_AUTHORITY.md
├── SECURITY_REVIEW.md
├── DATA_REVIEW.md
├── OPERABILITY_REVIEW.md
├── RFC_INDEX.md
├── RFC-0000-TEMPLATE.md
├── RFC-0001-ASYNC-APPOINTMENT-EFFECTS.md
└── RFC-0001-DECISION-SUMMARY.md

contracts
├── rfc-contract.yaml
├── lifecycle-policy.yaml
├── reviewer-policy.yaml
├── comment-policy.yaml
├── approval-policy.yaml
├── decision-policy.yaml
├── adr-handoff-policy.yaml
├── quality-policy.yaml
└── non-anticipation-policy.yaml

reports
├── rfc-validation-report.yaml
├── reviewer-coverage-report.yaml
├── comment-resolution-report.yaml
├── decision-readiness-report.yaml
├── adr-handoff-report.yaml
└── rfc-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-rfc
├── validate-rfc-contract.ps1
├── validate-rfc-lifecycle.ps1
├── validate-required-sections.ps1
├── validate-reviewer-coverage.ps1
├── validate-comment-resolution.ps1
├── validate-decision-readiness.ps1
├── validate-adr-handoff.ps1
├── run-rfc-tests.ps1
├── collect-rfc-evidence.ps1
└── verify-rfc-gate.ps1
```

Ao final, você terá um processo reproduzível para propor, revisar, decidir e registrar mudanças técnicas relevantes.

## Conceito essencial

### RFC é proposta, não decisão

Um RFC descreve uma mudança candidata. Enquanto estiver em revisão, seu conteúdo pode evoluir. O documento precisa deixar explícito o que está sendo proposto, por que agora, quais alternativas existem, quem será afetado e qual autoridade decide.

### Revisão exige cobertura adequada

Nem todo revisor avalia o mesmo risco. Backend, dados, segurança, plataforma, operação e produto observam dimensões diferentes. A cobertura deve ser proporcional ao impacto.

### Comentário precisa de estado

Comentários relevantes não podem desaparecer em conversas paralelas. Eles precisam ser classificados, respondidos e resolvidos ou explicitamente aceitos como risco.

### Silêncio não é aprovação

A ausência de comentário pode significar concordância, falta de tempo, desconhecimento ou falta de visibilidade. RFCs relevantes exigem manifestação explícita dos revisores obrigatórios.

### A saída precisa ser objetiva

Ao final, o RFC deve informar decisão, autoridade, data, condições, ações e relação com ADR. Um RFC aceito não substitui o ADR quando a mudança representa decisão arquitetural durável.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-645-rfc-tecnico/service-scheduling-rfc

Set-Location `
  labs/m19/aula-645-rfc-tecnico/service-scheduling-rfc
```

Crie as pastas de código, RFCs, contratos e reports.

---

### 2. Definir a RFC Policy

Arquivo:

```text
rfc/RFC_POLICY.md
```

Registre quando um RFC é obrigatório:

```text
mudança em fronteira de domínio;
novo serviço ou datastore;
alteração relevante de consistência;
nova dependência operacional crítica;
migração com risco de indisponibilidade;
mudança de segurança ou isolamento;
alteração de contrato público;
impacto relevante em custo ou SLO;
decisão difícil de reverter.
```

Registre também quando não é necessário:

```text
refatoração local sem mudança de comportamento;
correção pequena coberta por padrão existente;
atualização rotineira e reversível;
implementação já governada por ADR aceito;
mudança cosmética ou editorial.
```

O objetivo não é documentar tudo. É revisar o que pode alterar arquitetura, risco ou operação.

---

### 3. Criar o contrato principal

Arquivo:

```text
contracts/rfc-contract.yaml
```

Conteúdo:

```yaml
rfc:
  context:
    Service-Scheduling

  required:
    - stable-id
    - status
    - authors
    - decision-authority
    - review-window
    - problem
    - goals
    - non-goals
    - current-state
    - proposal
    - alternatives
    - impact-analysis
    - security-review
    - data-review
    - operability-review
    - rollout
    - rollback
    - evidence
    - open-questions
    - reviewers
    - comment-resolution
    - final-outcome

  forbidden:
    - announce-predecided-outcome
    - silent-approval
    - unresolved-blocking-comment-on-acceptance
    - missing-decision-authority
    - hidden-operational-impact
    - runtime-dependency-on-rfc-markdown
    - C4-deep-dive

  nextLesson:
    code:
      M19.36
```

---

### 4. Definir IDs estáveis

Crie:

```java
package br.com.formacao.rfc.model;

public record RfcId(int value) {

    public RfcId {
        if (value < 1) {
            throw new IllegalArgumentException(
                    "RFC id must be positive");
        }
    }

    public String formatted() {
        return "RFC-%04d".formatted(value);
    }
}
```

O ID não muda quando o título é ajustado. Links, comentários, decisões e ADRs referenciam esse identificador.

---

### 5. Criar os status

```java
package br.com.formacao.rfc.model;

public enum RfcStatus {
    DRAFT,
    IN_REVIEW,
    CHANGES_REQUESTED,
    ACCEPTED,
    REJECTED,
    WITHDRAWN,
    SUPERSEDED
}
```

Sem status explícito, o leitor não sabe se o documento é rascunho, proposta ativa ou decisão encerrada.

---

### 6. Definir o lifecycle

Arquivo:

```text
rfc/RFC_LIFECYCLE.md
```

Fluxo principal:

```text
DRAFT
-> IN_REVIEW
-> CHANGES_REQUESTED
-> IN_REVIEW
-> ACCEPTED ou REJECTED.
```

Saídas adicionais:

```text
DRAFT ou IN_REVIEW
-> WITHDRAWN;

ACCEPTED
-> SUPERSEDED
quando outro RFC substitui a proposta.
```

`ACCEPTED` não significa implementação concluída. Significa que a proposta foi aprovada sob condições registradas.

---

### 7. Implementar transições controladas

```java
package br.com.formacao.rfc.lifecycle;

import br.com.formacao.rfc.model.RfcStatus;
import java.util.Map;
import java.util.Set;

public final class RfcTransitionPolicy {

    private final Map<RfcStatus, Set<RfcStatus>> allowed = Map.of(
            RfcStatus.DRAFT,
            Set.of(RfcStatus.IN_REVIEW, RfcStatus.WITHDRAWN),
            RfcStatus.IN_REVIEW,
            Set.of(
                    RfcStatus.CHANGES_REQUESTED,
                    RfcStatus.ACCEPTED,
                    RfcStatus.REJECTED,
                    RfcStatus.WITHDRAWN),
            RfcStatus.CHANGES_REQUESTED,
            Set.of(RfcStatus.IN_REVIEW, RfcStatus.WITHDRAWN),
            RfcStatus.ACCEPTED,
            Set.of(RfcStatus.SUPERSEDED));

    public void requireAllowed(
            RfcStatus current,
            RfcStatus target) {

        if (!allowed.getOrDefault(current, Set.of()).contains(target)) {
            throw new IllegalStateException(
                    "Invalid RFC transition: " + current + " -> " + target);
        }
    }
}
```

Estados encerrados não retornam silenciosamente para revisão. Uma nova proposta relevante recebe novo RFC.

---

### 8. Definir metadata

```java
package br.com.formacao.rfc.model;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

public record RfcMetadata(
        RfcId id,
        String title,
        RfcStatus status,
        List<RfcAuthor> authors,
        DecisionAuthority decisionAuthority,
        ReviewWindow reviewWindow,
        Instant createdAt,
        Instant updatedAt) {

    public RfcMetadata {
        Objects.requireNonNull(id);
        Objects.requireNonNull(title);
        Objects.requireNonNull(status);
        authors = List.copyOf(authors);
        Objects.requireNonNull(decisionAuthority);
        Objects.requireNonNull(reviewWindow);
    }
}
```

A metadata separa identidade e governança do texto da proposta.

---

### 9. Criar o template

Arquivo:

```text
rfc/RFC-0000-TEMPLATE.md
```

Seções obrigatórias:

```text
Título e metadata;
Resumo executivo;
Problema;
Motivação e urgência;
Objetivos;
Não objetivos;
Estado atual;
Proposta;
Alternativas;
Impacto funcional;
Impacto arquitetural;
Impacto em dados;
Impacto em segurança;
Impacto operacional;
Impacto financeiro;
Compatibilidade;
Migração;
Rollout;
Rollback;
Observabilidade;
Testes e evidências;
Riscos e mitigações;
Perguntas abertas;
Revisores;
Histórico de alterações;
Resultado final.
```

O template orienta o raciocínio, mas não deve produzir seções artificiais. Quando uma dimensão não se aplica, o autor explica por quê.

---

### 10. Criar a proposta real

Arquivo:

```text
rfc/RFC-0001-ASYNC-APPOINTMENT-EFFECTS.md
```

Metadata:

```yaml
id: RFC-0001
title: Processar efeitos externos da confirmacao de Appointment de forma assincrona confiavel
status: IN_REVIEW
authors:
  - Scheduling Architecture
  - Scheduling Backend
decisionAuthority:
  - Principal Engineer
  - Service Scheduling Owner
reviewWindow:
  startsAt: 2026-07-14T09:00:00Z
  endsAt: 2026-07-21T18:00:00Z
related:
  tradeOffAnalysis: M19.33
  proposedAdr: ADR-0001
```

Não inclua dados pessoais reais. Os nomes representam papéis.

---

### 11. Escrever o resumo executivo

O resumo deve permitir que um revisor entenda a proposta em poucos minutos:

```text
A confirmação do Appointment continuará gravando de forma síncrona
somente o estado autoritativo e a intenção transacional de publicação.

Notificações, atualização de read models, integração com Field Execution
e demais efeitos externos serão processados de forma assíncrona confiável.

A proposta reduz o acoplamento entre a latência do command crítico
e a disponibilidade das dependências externas,
sem transformar a confirmação em sucesso antes do commit autoritativo.
```

O resumo não substitui as seções detalhadas.

---

### 12. Definir o problema

Descreva comportamento observável, não apenas solução desejada:

```text
A confirmação atual depende sequencialmente de quatro integrações.
O p95 do command é 1,8 segundo.
Falha transitória em comunicação impede confirmação.
Retries do cliente podem repetir efeitos.
Deploy de uma integração aumenta risco do fluxo inteiro.
A operação não consegue distinguir commit de domínio de efeito externo.
```

Inclua baseline, evidências e período de observação.

---

### 13. Registrar objetivos

Objetivos do RFC:

```text
preservar commit autoritativo forte;
reduzir p95 da confirmação para até 500 ms;
tolerar indisponibilidade temporária de integrações;
processar efeitos com retry e deduplicação;
medir lag e falhas por efeito;
permitir rollout e rollback seguros;
manter experiência honesta para o usuário.
```

Objetivos devem ser verificáveis.

---

### 14. Registrar não objetivos

Não objetivos evitam expansão silenciosa:

```text
não redesenhar todo o domínio de Appointment;
não trocar o banco principal;
não introduzir novo modelo multi-tenant;
não substituir toda a mensageria corporativa;
não implementar C4 completo neste RFC;
não resolver idempotência de todos os serviços da organização.
```

Essa seção protege prazo e clareza.

---

### 15. Descrever o estado atual

Registre o fluxo atual:

```text
API recebe confirmação;
valida autorização e versão;
grava Appointment;
chama comunicação;
chama Field Execution;
atualiza projeção operacional;
registra auditoria externa;
responde ao cliente.
```

Mostre onde existem acoplamentos, timeouts e ambiguidades.

---

### 16. Escrever a proposta

A proposta será:

```text
validar command e expected version;
confirmar Appointment e Outbox Event na mesma transação;
responder somente após commit;
relay publicar Integration Event;
consumers processarem efeitos externos;
consumers registrarem inbox e effect ledger;
falhas seguirem retry, quarantine e reconciliation;
UI indicar efeitos ainda em processamento quando necessário.
```

O RFC descreve comportamento, fronteiras e responsabilidades. Detalhes locais de código ficam para implementação.

---

### 17. Declarar invariantes

Invariantes propostas:

```text
Appointment não é confirmado sem commit autoritativo;
Outbox e estado mudam atomicamente;
efeito externo não decide status do Appointment;
consumer não processa o mesmo efeito duas vezes;
falha externa não reverte silenciosamente o commit;
lag acima do budget gera alerta;
reprocessamento exige rastreabilidade.
```

Invariantes ajudam os revisores a identificar violações.

---

### 18. Comparar alternativas

Registre pelo menos:

```text
Alternativa A:
manter tudo síncrono.

Alternativa B:
commit síncrono e efeitos assíncronos confiáveis.

Alternativa C:
aceitar command em fila e confirmar domínio depois.

Alternativa D:
processar apenas parte dos efeitos de forma assíncrona.
```

Para cada alternativa, compare latência, consistência, disponibilidade, complexidade, observabilidade, custo e reversibilidade.

A recomendação não deve esconder uma alternativa plausível.

---

### 19. Registrar impacto funcional

Explique o que muda para usuário e operação:

```text
confirmação responde após commit do Appointment;
notificação pode chegar alguns segundos depois;
tela pode mostrar processamento de efeitos;
falha de comunicação não transforma confirmação em falha;
operador recebe status de efeito quando necessário;
reenvio manual deixa de ser ação implícita.
```

O RFC técnico também precisa tratar comportamento visível.

---

### 20. Registrar impacto arquitetural

Inclua:

```text
novo Outbox Relay;
novos consumers;
Inbox por consumer;
Effect Ledger para integrações externas;
ownership por efeito;
contratos de evento versionados;
política de retry e dead letter;
reconciliation periódica.
```

Não crie ainda diagramas C4 detalhados. Liste componentes e relações textualmente.

---

### 21. Fazer a revisão de dados

Arquivo:

```text
rfc/DATA_REVIEW.md
```

Perguntas obrigatórias:

```text
qual dado é autoritativo;
qual dado é derivado;
quais tabelas ou streams serão criados;
qual retenção é necessária;
como ocorre migração;
como evitar duplicidade;
como tratar schema evolution;
qual volume esperado;
como executar purge;
como comprovar integridade.
```

Para o RFC-0001, declare que `Appointment` permanece autoritativo e que Outbox, Inbox e Effect Ledger são estruturas operacionais com retenção explícita.

---

### 22. Fazer a revisão de segurança

Arquivo:

```text
rfc/SECURITY_REVIEW.md
```

Avalie:

```text
autorização do command;
identidade propagada;
tenant e escopo;
dados sensíveis em eventos;
segredos de integrações;
permissão de replay;
auditoria de reprocessamento;
proteção de endpoints operacionais;
rate limit;
risco de cross-tenant processing.
```

Evento não deve carregar informação sensível desnecessária.

---

### 23. Fazer a revisão de operabilidade

Arquivo:

```text
rfc/OPERABILITY_REVIEW.md
```

Inclua:

```text
SLO do command;
SLO de publicação;
budget de consumer lag;
taxas de retry;
oldest pending age;
dead letters;
runbook;
replay seguro;
reconciliation;
on-call ownership;
capacidade;
custo;
plano de incidente.
```

Uma proposta não está pronta quando depende de operação manual indefinida.

---

### 24. Definir reviewers por risco

Arquivo:

```text
rfc/REVIEW_POLICY.md
```

Cobertura recomendada:

```text
Backend:
contratos, transação e implementação.

Dados:
autoridade, retenção, migração e integridade.

Segurança:
autorização, segredos, replay e exposição.

Plataforma:
mensageria, capacidade, deploy e observabilidade.

Operação:
runbook, alertas, suporte e incidentes.

Produto ou operação de negócio:
UX, SLA e comportamento funcional.
```

Nem todo RFC exige todas as áreas, mas exclusões precisam ser justificadas.

---

### 25. Modelar reviewers

Modele reviewer por identificador, papéis e obrigatoriedade. Os papéis são mais importantes que nomes pessoais, porque deixam claro qual risco cada participação cobre.

```java
public record RfcReviewer(
        String reviewerId,
        Set<RfcRole> roles,
        boolean required) {
}
```

### 26. Criar reviewer policy

Arquivo:

```text
contracts/reviewer-policy.yaml
```

Conteúdo:

```yaml
reviewers:
  requiredForRFC0001:
    - backend
    - data
    - security
    - platform
    - operations
    - product

  eachRequiredRole:
    explicitDecision:
      required

  authorSelfApproval:
    forbidden

  missingCoverage:
    outcome:
      NOT_READY
```

Silêncio não cumpre `explicitDecision`.

---

### 27. Definir tipos de comentário

```java
package br.com.formacao.rfc.review;

public enum CommentType {
    QUESTION,
    SUGGESTION,
    CONCERN,
    BLOCKING_CONCERN,
    APPROVAL_NOTE
}
```

Nem todo comentário bloqueia. A classificação evita tratar sugestão editorial como objeção arquitetural.

---

### 28. Definir status de comentário

```java
package br.com.formacao.rfc.review;

public enum CommentStatus {
    OPEN,
    ANSWERED,
    RESOLVED,
    ACCEPTED_RISK,
    REJECTED_WITH_REASON
}
```

`ANSWERED` não significa necessariamente `RESOLVED`. O revisor pode considerar a resposta insuficiente.

---

### 29. Criar Review Comment

Modele o comentário com ID, seção, revisor, tipo, mensagem, status, resolução e timestamps. A resolução deve explicar a mudança realizada, o risco aceito ou o motivo de rejeição.

```java
public record ReviewComment(
        UUID commentId,
        String section,
        String reviewerId,
        CommentType type,
        String message,
        CommentStatus status,
        String resolution) {
}
```

### 30. Criar comment policy

Arquivo:

```text
contracts/comment-policy.yaml
```

Conteúdo:

```yaml
comments:
  blockingConcern:
    acceptanceWhileOpen:
      forbidden

  concern:
    requires:
      - response
      - resolution-status
      - resolution-text

  acceptedRisk:
    requires:
      - decision-authority
      - justification
      - mitigation
      - review-trigger

  deletionAfterDiscussion:
    forbidden

  sideConversationWithoutSummary:
    forbidden
```

Comentários podem ser discutidos em reunião, mas o resultado volta ao RFC.

---

### 31. Registrar comentários reais

Inclua no RFC-0001:

```text
BLOCKING_CONCERN — Data:
Como garantir que Outbox e Appointment sejam atômicos?

Resposta:
Mesma transação local, mesma unidade de persistência,
teste de rollback e constraint de integridade.

Status:
RESOLVED.
```

```text
CONCERN — Operações:
Como identificar efeito parado sem depender de reclamação?

Resposta:
oldest pending age, consumer lag, retry rate,
dead-letter count e reconciliation report.

Status:
RESOLVED.
```

```text
CONCERN — Segurança:
Quem pode solicitar replay de um efeito?

Resposta:
endpoint administrativo protegido,
autorização específica, justificativa,
auditoria e fencing contra replay concorrente.

Status:
RESOLVED.
```

---

### 32. Definir votos explícitos

```java
package br.com.formacao.rfc.review;

public enum ReviewerVote {
    APPROVE,
    APPROVE_WITH_CONDITIONS,
    REQUEST_CHANGES,
    REJECT,
    ABSTAIN_WITH_REASON
}
```

`ABSTAIN_WITH_REASON` não conta como aprovação. Pode indicar conflito de interesse ou falta de competência no tema.

---

### 33. Criar Review Decision

Cada revisor registra voto, condições e rationale. Condições precisam ser verificáveis e possuir owner.

```java
public record ReviewDecision(
        String reviewerId,
        ReviewerVote vote,
        List<String> conditions,
        String rationale) {
}
```

### 34. Definir a autoridade de decisão

Arquivo:

```text
rfc/DECISION_AUTHORITY.md
```

Para o RFC-0001:

```text
Decision authority:
Principal Engineer
com o Service Scheduling Owner.

Required consultation:
Backend, Data, Security, Platform, Operations e Product.

Tie-break:
Head of Engineering Architecture.
```

A autoridade não pode ser inferida depois da revisão.

---

### 35. Criar approval policy

Arquivo:

```text
contracts/approval-policy.yaml
```

Conteúdo:

```yaml
approval:
  requires:
    - review-window-closed-or-all-required-reviewed
    - required-reviewer-coverage
    - zero-open-blocking-comments
    - resolved-security-concerns
    - resolved-data-concerns
    - operability-ready
    - rollout-defined
    - rollback-defined
    - measurable-success-criteria
    - decision-authority-outcome

  silenceCountsAsApproval:
    false

  conditionalApproval:
    requires:
      - conditions
      - owners
      - due-dates
      - verification

  authorMayFinalizeAlone:
    false
```

---

### 36. Validar readiness

```java
package br.com.formacao.rfc.validation;

public final class ApprovalReadinessValidator {

    public RfcValidationResult validate(
            TechnicalProposal proposal,
            ReviewSummary reviewSummary) {

        RfcValidationResult result = new RfcValidationResult();

        result.require(
                reviewSummary.hasRequiredCoverage(),
                "REQUIRED_REVIEWER_COVERAGE");

        result.require(
                reviewSummary.openBlockingComments() == 0,
                "OPEN_BLOCKING_COMMENTS");

        result.require(
                proposal.hasRolloutPlan(),
                "ROLLOUT_PLAN");

        result.require(
                proposal.hasRollbackPlan(),
                "ROLLBACK_PLAN");

        result.require(
                proposal.hasMeasurableSuccessCriteria(),
                "SUCCESS_CRITERIA");

        return result;
    }
}
```

O validator não toma a decisão. Ele informa se a proposta está pronta para ser decidida.

---

### 37. Definir rollout

O RFC-0001 usará:

```text
fase 0:
infraestrutura criada sem tráfego;

fase 1:
dual observation sem efeitos externos;

fase 2:
5% dos Appointments elegíveis;

fase 3:
25%;

fase 4:
50%;

fase 5:
100% após budgets aprovados.
```

Cada fase define duração mínima, métricas, owner e critério de avanço.

---

### 38. Definir rollback

Rollback precisa distinguir:

```text
desabilitar novos efeitos assíncronos;
drenar ou quarentenizar backlog;
impedir duplicidade ao voltar ao síncrono;
manter auditoria dos efeitos já executados;
reconciliar Appointments confirmados;
preservar eventos para investigação.
```

Rollback não é apenas desligar feature flag.

---

### 39. Definir critérios de sucesso

Exemplo:

```text
confirmation command p95 <= 500 ms;
publication p99 <= 2 s;
consumer lag p99 <= 10 s;
duplicate external effect = 0;
unresolved dead letter older than 15 min = 0;
manual replay without audit = 0;
critical security finding = 0;
rollback rehearsal = PASS.
```

Critérios de sucesso conectam decisão a evidência operacional.

---

### 40. Definir critérios de interrupção

Exemplo:

```text
duplicidade de efeito externo;
perda de evento;
lag acima de 60 segundos;
aumento de erro do command;
falha de autorização em replay;
reconciliation inconclusiva;
rollback não executável.
```

Ao atingir um critério, o rollout pausa automaticamente ou por decisão operacional explícita.

---

### 41. Criar histórico de alterações

O RFC deve registrar:

```text
versão;
data;
autor;
seções alteradas;
motivo;
comentários relacionados.
```

Não reescreva silenciosamente a proposta durante a revisão.

---

### 42. Criar o catálogo

Arquivo:

```text
rfc/RFC_INDEX.md
```

Colunas:

```text
ID;
título;
status;
autores;
decision authority;
review deadline;
updated at;
related ADR;
superseded by.
```

O índice precisa permitir localizar propostas ativas, encerradas e substituídas.

---

### 43. Implementar o registry

O registry permite salvar, localizar e listar RFCs por ID, status, autor, prazo ou ADR relacionado. No laboratório ele será em memória; o Markdown continua versionado e não se torna dependência de runtime.

### 44. Finalizar a decisão

A decisão proposta será:

```text
ACCEPTED_WITH_CONDITIONS.
```

Condições:

```text
executar teste de rollback antes de 25%;
validar autorização de replay;
publicar runbook de dead letters;
comprovar atomicidade de Appointment e Outbox;
criar dashboard de consumer lag.
```

Quando todas forem verificadas, o resultado final torna-se `ACCEPTED`.

---

### 45. Criar Decision Service

O serviço de decisão primeiro executa o `ApprovalReadinessValidator`. Se houver reviewer obrigatório ausente, bloqueio aberto, rollout incompleto ou autoridade inválida, retorna `NOT_READY`.

Quando as pré-condições passam, a autoridade autorizada escolhe `ACCEPT`, `REJECT` ou `REQUEST_CHANGES`. O serviço registra outcome, rationale, condições e histórico; ele não substitui o julgamento técnico.

### 46. Criar o resumo de decisão

Arquivo:

```text
rfc/RFC-0001-DECISION-SUMMARY.md
```

Inclua:

```text
outcome;
decision date;
decision authority;
accepted scope;
conditions;
rejected alternatives;
key rationale;
remaining risks;
implementation owners;
related ADR;
review triggers.
```

O resumo facilita leitura sem apagar o RFC completo.

---

### 47. Fazer handoff para ADR

Um RFC aceito que altera arquitetura durável deve gerar ou atualizar ADR.

Para o laboratório:

```text
RFC-0001
-> ADR-0001.
```

O RFC preserva discussão, comentários e revisão. O ADR preserva a decisão final e suas consequências.

---

### 48. Criar Adr Handoff

O handoff contém RFC ID, ADR ID, resumo da decisão, escopo aceito, condições, consequências e referência de evidência. Ele transfere a decisão consolidada, não toda a discussão.

### 49. Criar adr-handoff policy

Arquivo:

```text
contracts/adr-handoff-policy.yaml
```

Conteúdo:

```yaml
adrHandoff:
  whenAcceptedRfcChangesArchitecture:
    required: true

  requires:
    - rfc-id
    - decision-outcome
    - decision-authority
    - accepted-scope
    - consequences
    - conditions
    - evidence
    - review-triggers

  copyEntireDiscussionIntoAdr:
    forbidden

  acceptedRfcWithoutDecisionRecord:
    outcome:
      FAIL
```

---

### 50. Tratar rejeição

RFC rejeitado mantém:

```text
problema;
proposta;
alternativas;
comentários;
evidências;
motivo da rejeição;
condições que poderiam mudar a decisão.
```

Não apague o documento. Uma futura equipe pode evitar repetir a mesma análise.

---

### 51. Tratar retirada

`WITHDRAWN` significa que autores retiraram a proposta antes da decisão.

Motivos podem incluir:

```text
premissa inválida;
prioridade alterada;
dependência cancelada;
nova alternativa superior;
escopo excessivo;
evidência insuficiente.
```

Retirada não deve ser usada para esconder objeções relevantes.

---

### 52. Tratar supersessão

Quando outro RFC substitui o anterior:

```text
RFC antigo -> SUPERSEDED;
novo RFC referencia o anterior;
índice registra a relação;
discussão antiga permanece disponível.
```

Supersessão não reabre o documento encerrado.

---

### 53. Criar quality policy

Arquivo:

```text
contracts/quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingRequiredSection:
    action: FAIL

  acceptedWithOpenBlockingComment:
    action: FAIL

  missingRequiredReviewer:
    action: FAIL

  silentApproval:
    action: FAIL

  decisionWithoutAuthority:
    action: FAIL

  acceptedArchitectureChangeWithoutAdrHandoff:
    action: FAIL

  rolloutWithoutStopCriteria:
    action: FAIL

  rollbackWithoutReconciliation:
    action: FAIL

  unresolvedSecurityConcern:
    action: FAIL
```

---

### 54. Criar non-anticipation policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson646:
    forbidden:
      - C4-system-context-deep-dive
      - C4-container-diagram-deep-dive
      - C4-component-diagram-deep-dive
      - Structurizr-implementation
      - diagram-as-code-pipeline

  allowed:
    - textual-component-list
    - relationship-summary
    - boundary-description
    - C4-handoff-reference
```

---

### 55. Testar lifecycle

`RfcLifecycleTest` valida:

```text
DRAFT -> IN_REVIEW;
IN_REVIEW -> CHANGES_REQUESTED;
CHANGES_REQUESTED -> IN_REVIEW;
IN_REVIEW -> ACCEPTED;
IN_REVIEW -> REJECTED;
ACCEPTED -> SUPERSEDED.
```

`InvalidTransitionTest` rejeita:

```text
DRAFT -> ACCEPTED;
REJECTED -> IN_REVIEW;
ACCEPTED -> DRAFT;
WITHDRAWN -> ACCEPTED.
```

---

### 56. Testar reviewer coverage

`RequiredReviewerTest` cria proposta sem revisão de segurança.

Resultado esperado:

```text
NOT_READY;
finding REQUIRED_REVIEWER_COVERAGE;
nenhuma decisão final permitida.
```

---

### 57. Testar blocking comment

`BlockingCommentTest` mantém um `BLOCKING_CONCERN` aberto.

A tentativa de aceitar o RFC deve falhar com:

```text
OPEN_BLOCKING_COMMENTS.
```

Responder sem resolver não é suficiente.

---

### 58. Testar silêncio

`SilentApprovalForbiddenTest` encerra a janela sem voto do revisor de dados.

Resultado:

```text
silêncio não vira APPROVE;
proposta permanece NOT_READY;
autoridade pode estender a janela
ou substituir formalmente o reviewer.
```

---

### 59. Testar resolução de comentário

Valide:

```text
comentário aberto;
resposta do autor;
revisor confirma resolução;
status muda para RESOLVED;
texto de resolução permanece;
histórico registra a mudança.
```

---

### 60. Testar segurança e dados

`SecurityAndDataReviewTest` exige:

```text
autorização de replay;
auditoria;
retenção de Outbox e Inbox;
classificação dos dados de evento;
proteção cross-tenant;
owner de purge;
reconciliation.
```

---

### 61. Testar readiness

`ApprovalReadinessTest` valida proposta pronta apenas quando:

```text
seções obrigatórias existem;
reviewers obrigatórios votaram;
bloqueios foram resolvidos;
rollout e rollback existem;
critérios são mensuráveis;
segurança, dados e operação aprovaram;
autoridade está definida.
```

---

### 62. Testar handoff para ADR

`AcceptedRfcAdrHandoffTest` confirma:

```text
RFC aceito;
decisão arquitetural durável;
AdrHandoff criado;
ADR referencia RFC;
RFC referencia ADR;
condições e triggers preservados.
```

---

### 63. Testar runtime independence

A aplicação não pode ler arquivos Markdown do RFC para decidir comportamento.

```java
@ArchTest
static final ArchRule runtimeMustNotDependOnRfcMarkdown =
        noClasses()
                .that()
                .resideInAPackage("..application..")
                .should()
                .dependOnClassesThat()
                .haveSimpleNameMatching(".*Markdown.*");
```

A decisão é implementada em código e configuração controlada.

---

### 64. Executar as validações documentais

Execute:

```powershell
.\scripts\m19\service-scheduling-rfc\validate-rfc-contract.ps1

.\scripts\m19\service-scheduling-rfc\validate-rfc-lifecycle.ps1

.\scripts\m19\service-scheduling-rfc\validate-required-sections.ps1

.\scripts\m19\service-scheduling-rfc\validate-reviewer-coverage.ps1

.\scripts\m19\service-scheduling-rfc\validate-comment-resolution.ps1

.\scripts\m19\service-scheduling-rfc\validate-decision-readiness.ps1

.\scripts\m19\service-scheduling-rfc\validate-adr-handoff.ps1

.\scripts\m19\service-scheduling-rfc\validate-rfc-security.ps1

.\scripts\m19\service-scheduling-rfc\validate-rfc-operability.ps1
```

Valide metadata, lifecycle, seções, cobertura, comentários, segurança, dados, operação, decisão e handoff. Qualquer falha mantém o RFC como `NOT_READY`.

### 65. Executar testes

```powershell
.\scripts\m19\service-scheduling-rfc\run-rfc-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide lifecycle, reviewers, comentários, readiness, segurança, dados, decisão, ADR e arquitetura.

---

### 66. Criar reports

Exemplo:

```yaml
rfc:
  id: RFC-0001
  status: ACCEPTED
  requiredReviewerRoles: 6
  coveredReviewerRoles: 6
  explicitApprovals: 5
  conditionalApprovals: 1
  openQuestions: 0
  openBlockingComments: 0
  resolvedConcerns: 7
  acceptedRisks: 1
  rolloutDefined: true
  rollbackDefined: true
  adrHandoff: ADR-0001
  result: PASS
```

---

### 67. Criar o gate

O gate valida:

```text
policy;
ID e naming;
metadata;
lifecycle;
seções;
problema e objetivos;
alternativas;
impactos;
reviewer coverage;
comentários;
segurança;
dados;
operabilidade;
rollout;
rollback;
critérios;
autoridade;
decisão;
ADR handoff;
testes;
arquitetura;
documentação;
evidence.
```

Status:

```text
PASS;
FAIL_POLICY;
FAIL_METADATA;
FAIL_LIFECYCLE;
FAIL_REQUIRED_SECTIONS;
FAIL_REVIEWER_COVERAGE;
FAIL_OPEN_BLOCKING_COMMENT;
FAIL_SECURITY_REVIEW;
FAIL_DATA_REVIEW;
FAIL_OPERABILITY_REVIEW;
FAIL_ROLLOUT;
FAIL_ROLLBACK;
FAIL_DECISION_AUTHORITY;
FAIL_ADR_HANDOFF;
FAIL_TEST;
FAIL_ARCHITECTURE;
INCONCLUSIVE.
```

---

### 68. Coletar evidence

Arquivo:

```text
contracts/rfc-evidence.yaml
```

Campos permitidos:

```text
lesson;
project;
rfc ID;
status;
author count;
required reviewer role count;
covered reviewer role count;
approval count;
conditional approval count;
open blocking comment count;
resolved concern count;
accepted risk count;
security review status;
data review status;
operability review status;
rollout status;
rollback status;
ADR handoff status;
test status;
architecture status;
documentation status;
gate status;
timestamp.
```

Não inclua comentários com dados pessoais, tokens, endpoints privados ou segredos.

---

### 69. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-rfc\validate-rfc-contract.ps1

.\scripts\m19\service-scheduling-rfc\validate-rfc-lifecycle.ps1

.\scripts\m19\service-scheduling-rfc\validate-required-sections.ps1

.\scripts\m19\service-scheduling-rfc\validate-reviewer-coverage.ps1

.\scripts\m19\service-scheduling-rfc\validate-comment-resolution.ps1

.\scripts\m19\service-scheduling-rfc\validate-decision-readiness.ps1

.\scripts\m19\service-scheduling-rfc\validate-adr-handoff.ps1

.\scripts\m19\service-scheduling-rfc\validate-rfc-security.ps1

.\scripts\m19\service-scheduling-rfc\validate-rfc-operability.ps1

.\scripts\m19\service-scheduling-rfc\run-rfc-tests.ps1

.\scripts\m19\service-scheduling-rfc\collect-rfc-evidence.ps1

.\scripts\m19\service-scheduling-rfc\verify-rfc-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 70. Encerrar o laboratório

Confirme:

```text
RFC Policy criada;
ID estável;
status explícito;
lifecycle validado;
decision authority definida;
review window definida;
problema e baseline documentados;
objetivos mensuráveis;
não objetivos explícitos;
proposta compreensível;
alternativas comparadas;
impactos avaliados;
reviewers cobrem os riscos;
silêncio não conta como aprovação;
comentários bloqueantes resolvidos;
riscos aceitos possuem autoridade;
rollout e rollback são executáveis;
critérios de sucesso e parada existem;
decisão final foi publicada;
ADR handoff foi criado;
Markdown não é dependência de runtime;
C4 não foi aprofundado;
reports e evidence estão sanitizados.
```

---

## Entendendo o que foi feito

### A proposta ganhou forma decidível

O RFC-0001 deixou de ser uma ideia genérica. Ele passou a conter problema, baseline, objetivos, não objetivos, estado atual, proposta, alternativas, impactos, rollout, rollback e critérios.

### A revisão ganhou cobertura e rastreabilidade

Revisores foram escolhidos pelo risco. Comentários receberam tipo, status, resolução e histórico. Silêncio deixou de ser tratado como aprovação.

### A decisão ganhou autoridade

O documento definiu quem revisa, quem decide, quais pré-condições existem e quais resultados são possíveis.

### A saída ganhou continuidade

A proposta aceita foi conectada ao ADR sem copiar toda a discussão. RFC e ADR passaram a cumprir papéis complementares.

---

## Erros comuns importantes

### Escrever o RFC depois da decisão

Isso transforma revisão em anúncio e reduz confiança.

### Tornar todo comentário bloqueante

A revisão fica impraticável e perde prioridade.

### Confundir resposta com resolução

Um comentário pode estar respondido e ainda não ter sido aceito pelo revisor.

### Usar silêncio como aprovação

Revisores obrigatórios precisam se manifestar.

### Pedir revisão de pessoas erradas

Muitos revisores sem relação com o risco criam ruído; poucos revisores deixam lacunas.

### Omitir não objetivos

O escopo cresce durante a discussão.

### Ignorar operação, segurança ou dados

A implementação descobre riscos tarde demais.

### Chamar feature flag de rollback

Backlog, efeitos já executados e reconciliação continuam existindo.

### Aceitar com bloqueio aberto

A decisão nasce inconsistente.

### Copiar o RFC inteiro para o ADR

Os artefatos perdem seus papéis.

### Transformar Markdown em runtime

Documentação passa a controlar produção de forma frágil.

### Antecipar C4 Model

A representação visual estruturada pertence à aula 646.

---

## Comandos úteis

### Validar lifecycle

```powershell
.\scripts\m19\service-scheduling-rfc\validate-rfc-lifecycle.ps1
```

### Validar reviewers

```powershell
.\scripts\m19\service-scheduling-rfc\validate-reviewer-coverage.ps1
```

### Validar comentários

```powershell
.\scripts\m19\service-scheduling-rfc\validate-comment-resolution.ps1
```

### Validar decisão

```powershell
.\scripts\m19\service-scheduling-rfc\validate-decision-readiness.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-rfc\run-rfc-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-rfc\verify-rfc-gate.ps1
```

---

## Exercício guiado

Crie um RFC para substituir uma integração síncrona crítica por processamento assíncrono confiável.

Defina problema, baseline, objetivos, não objetivos, proposta, alternativas, impactos, reviewers, comentários, rollout, rollback, critérios, decisão e handoff para ADR.

Simule pelo menos:

```text
um blocking concern de dados;
um concern de segurança;
um pedido de mudança operacional;
um voto condicional;
um risco aceito;
uma decisão final.
```

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 644 e ponte para a aula 646 foram preservadas;
- o laboratório `service-scheduling-rfc` foi criado;
- RFC Policy, contrato, template e índice foram criados;
- ID estável, status, metadata e lifecycle foram modelados;
- transições inválidas foram proibidas;
- RFC-0001 contém problema, baseline, objetivos e não objetivos;
- estado atual, proposta, invariantes e alternativas foram registrados;
- impactos funcionais, arquiteturais, de dados, segurança e operação foram avaliados;
- reviewers foram selecionados por risco;
- autoaprovação e aprovação silenciosa foram proibidas;
- comentários possuem tipo, estado e resolução;
- blocking concern aberto impede aceitação;
- resposta foi diferenciada de resolução;
- votos explícitos e aprovação condicional foram modelados;
- decision authority foi definida;
- readiness validator foi implementado;
- rollout possui fases, métricas e critérios de avanço;
- rollback considera backlog, efeitos e reconciliation;
- critérios de sucesso e interrupção foram definidos;
- decisão final e resumo foram registrados;
- handoff para ADR foi criado;
- rejeição, retirada e supersessão preservam história;
- testes cobrem lifecycle, reviewers, comentários, readiness e ADR;
- runtime não depende de Markdown;
- C4 Model não foi antecipado;
- reports, gate, evidence, commit e diário de bordo estão presentes.

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
  labs/m19/aula-645-rfc-tecnico/service-scheduling-rfc `
  scripts/m19/service-scheduling-rfc `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|productionTopology|personalData|StructurizrDeepDive|C4ContainerDiagram"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): conduzir RFC tecnico"
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
- comentários com nomes pessoais;
- diagramas C4 aprofundados.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou RFC técnico.

Você criou policy, contrato, ID, status, lifecycle, template, RFC-0001, reviewers, comentários, votos, approval policy, decision authority, readiness, rollout, rollback, critérios, índice, resumo de decisão, ADR handoff, reports, evidence e gate.

Você comprovou que propostas relevantes precisam ser revisáveis antes da decisão; reviewers são escolhidos pelo risco; silêncio não é aprovação; comentários precisam de resolução; bloqueios abertos impedem aceitação; rollout e rollback tratam estado e efeitos; e um RFC aceito pode produzir ADR sem substituir a discussão completa.

A próxima aula será:

```text
646 - M19.36 - C4 Model
```

Nela, você representará arquitetura em níveis, distinguindo System Context, Container, Component, pessoas, sistemas externos, responsabilidades e relações.

C4 Model não foi aprofundado nesta aula.

## Checkpoint final

- [ ] Defini quando RFC é obrigatório.
- [ ] Criei template e lifecycle.
- [ ] Escrevi problema, objetivos e não objetivos.
- [ ] Comparei alternativas.
- [ ] Analisei dados, segurança e operação.
- [ ] Defini reviewers por risco.
- [ ] Resolvi comentários bloqueantes.
- [ ] Proibi aprovação silenciosa.
- [ ] Defini rollout e rollback.
- [ ] Registrei decisão e ADR handoff.

---

## Troubleshooting adicional

### O RFC está enorme e ninguém revisa

Crie resumo executivo, separe anexos e reduza detalhes de implementação que não alteram a decisão.

### O documento parece defender apenas uma opção

Inclua alternativas plausíveis, evidências contrárias e condições que mudariam a recomendação.

### O comentário recebeu resposta, mas continua aberto

Solicite confirmação do revisor ou registre decisão explícita da autoridade sobre o risco.

### Existe discussão em reunião, mas nada no RFC

Adicione resumo, participantes por papel, decisões e comentários relacionados.

### O rollout só possui percentuais

Inclua duração, métricas, critérios de avanço, owner e condições de pausa.

### O rollback ignora mensagens pendentes

Defina drenagem, quarentena, deduplicação, efeitos já executados e reconciliation.

### O RFC aceito não gerou ADR

Avalie se existe decisão arquitetural durável. Se existir, crie o handoff.

### O RFC começou a desenhar C4 completo

Mantenha apenas componentes e relações textuais. Aprofunde C4 na aula 646.

---

## Perguntas de revisão

1. O que é um RFC técnico?
2. Qual diferença entre RFC e ADR?
3. Quando um RFC é necessário?
4. O que é decision authority?
5. Por que não objetivos são importantes?
6. O que significa `IN_REVIEW`?
7. O que significa `CHANGES_REQUESTED`?
8. Silêncio conta como aprovação?
9. Qual diferença entre resposta e resolução?
10. O que é blocking concern?
11. Como reviewers devem ser escolhidos?
12. O autor pode aprovar sozinho?
13. O que é conditional approval?
14. O que um rollout precisa conter?
15. Por que rollback não é apenas feature flag?
16. O que deve acontecer com RFC rejeitado?
17. Quando criar handoff para ADR?
18. O runtime deve depender do Markdown do RFC?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Processo e documento para revisar uma proposta técnica antes da decisão.
2. RFC conduz a proposta; ADR preserva a decisão tomada.
3. Em mudanças relevantes de arquitetura, risco, custo, segurança ou operação.
4. Papel ou grupo autorizado a decidir.
5. Impedem expansão silenciosa de escopo.
6. A proposta está recebendo revisão.
7. Precisa de alterações antes de nova avaliação.
8. Não.
9. Resposta explica; resolução encerra a preocupação conforme política.
10. Objeção que impede aceitação enquanto estiver aberta.
11. Pelo risco e impacto da proposta.
12. Não quando a política exige autoridade independente.
13. Aprovação sujeita a condições verificáveis.
14. Fases, duração, métricas, owners, avanço e pausa.
15. Porque backlog e efeitos já executados continuam existindo.
16. Permanecer versionado com rationale.
17. Quando a proposta aceita cria decisão arquitetural durável.
18. Não.
19. C4 Model.
20. C4 Model.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 645 - M19.35 - RFC tecnico**

- Aprofundei Request for Comments técnico.
- Criei o laboratório `service-scheduling-rfc`.
- Diferenciei trade-off, RFC, ADR e C4.
- Criei policy, contrato, template e lifecycle.
- Modelei ID, status, metadata e review window.
- Escrevi o RFC-0001 para efeitos assíncronos do Appointment.
- Registrei problema, baseline, objetivos, não objetivos e alternativas.
- Avaliei impactos funcionais, arquiteturais, de dados, segurança e operação.
- Selecionei reviewers por risco.
- Proibi autoaprovação e aprovação silenciosa.
- Modelei comentários, votos e resolução de bloqueios.
- Defini decision authority e readiness.
- Modelei rollout, rollback, critérios de sucesso e parada.
- Registrei decisão final e resumo.
- Criei handoff do RFC para ADR.
- Preservei rejeição, retirada e supersessão.
- Criei testes, reports, evidence e gate.
- Não antecipei C4 Model.
- Próxima aula: C4 Model.
```

## Referência técnica curta

- Request for Comments.
- Technical Proposal.
- RFC Policy.
- RFC Lifecycle.
- Review Window.
- Reviewer Coverage.
- Blocking Concern.
- Comment Resolution.
- Reviewer Vote.
- Decision Authority.
- Conditional Approval.
- Rollout.
- Rollback.
- Stop Criteria.
- ADR Handoff.
- Decision Summary.

Regra final:

```text
RFC técnico transforma proposta relevante em processo revisável antes da decisão. Cada RFC possui ID, status, autores, autoridade, janela, problema, objetivos, não objetivos, alternativas, impactos, riscos, rollout, rollback, evidências e perguntas abertas. Reviewers são escolhidos pelo risco, cada papel obrigatório manifesta voto explícito e silêncio nunca vale como aprovação. Comentários têm tipo, estado e resolução; bloqueios abertos impedem aceitação, e riscos aceitos exigem autoridade, justificativa e mitigação. Readiness valida cobertura, segurança, dados, operação e critérios sem substituir a decisão humana. Resultados aceitos, rejeitados, retirados ou substituídos preservam história; decisões arquiteturais aceitas geram handoff para ADR, e o runtime nunca depende do Markdown. O gate termina com policy, lifecycle, seções, reviewers, comentários, decisão, rollout, rollback, ADR, testes, reports e evidence coerentes, enquanto o C4 Model permanece reservado à aula 646.
```

