# 644 - M19.34 - ADR

## Apresentação da aula

Na aula 643, você transformou preferência técnica em decisão defensável. Você definiu problema, baseline, forças, restrições, alternativas, critérios, evidências, riscos, reversibilidade, sensibilidade, experimentos e gatilhos de revisão.

Agora a equipe precisa preservar essa decisão para responder, meses depois:

```text
qual problema existia;
qual decisão foi tomada;
por que ela foi tomada;
quais alternativas foram consideradas;
quais consequências foram aceitas;
quando a decisão deve ser revista;
qual decisão nova substituiu a anterior.
```

Sem esse registro, a arquitetura perde memória. Pessoas mudam, restrições evoluem e discussões antigas reaparecem sem o contexto original.

Um Architecture Decision Record, ou ADR, registra uma decisão arquitetural relevante em formato curto, versionado, rastreável e evolutivo. Ele não é ata de reunião, documento completo de arquitetura nem justificativa posterior para uma preferência. Sua função é preservar o raciocínio mínimo necessário para compreender e revisar a escolha.

A pergunta desta aula será:

```text
como registrar decisões arquiteturais
sem criar um cemitério de documentos,
sem apagar a história
e sem confundir análise,
proposta e decisão aceita?
```

O laboratório será:

```text
labs/m19/aula-644-adr/service-scheduling-architecture-decisions
```

Você transformará a recomendação da aula 643 em um ADR real para `Service Scheduling`, criando template, naming, lifecycle, índice, supersessão, validações, reports, evidence e gate.

A decisão registrada será:

```text
confirmar o Appointment
com commit síncrono do estado autoritativo
e executar efeitos externos
por processamento assíncrono confiável.
```

A próxima aula será `645 - M19.35 - RFC tecnico`. O fluxo colaborativo completo de proposta, comentários e aprovação ficará reservado para ela.

Regra central:

```text
ADR não substitui o raciocínio;
ADR preserva a decisão,
seu contexto,
consequências,
evidências,
status
e caminho de evolução.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
641 Design de sistemas parte 1;
642 Design de sistemas parte 2;
643 Trade offs tecnicos;
644 ADR;
645 RFC tecnico;
646 C4 Model.
```

As aulas 641 e 642 construíram e pressionaram um design. A aula 643 comparou alternativas e produziu uma recomendação. Agora a aula 644 registra a decisão aceita.

Você reutilizará conhecimentos anteriores:

- domínio e fronteiras;
- requisitos e atributos de qualidade;
- SLOs e riscos;
- consistência, disponibilidade e latência;
- idempotência;
- resiliência;
- segurança;
- observabilidade;
- custo operacional;
- reversibilidade;
- evidências e gatilhos de revisão.

Esses elementos não serão repetidos integralmente. Eles serão resumidos e referenciados no ADR.

A diferença é importante:

```text
análise de trade-off:
expande opções e compara alternativas;

ADR:
registra a decisão tomada
e suas consequências;

RFC:
organiza uma proposta para revisão
antes de uma decisão relevante.
```

Nem toda análise vira ADR. Nem todo ADR exige RFC. Nem toda mudança de código é uma decisão arquitetural.

Nesta aula, o foco será reconhecer decisões significativas, registrá-las com precisão e manter a história de evolução. O processo colaborativo de RFC ficará para a aula 645.

---

## Objetivo prático

O laboratório será criado em:

```text
labs/m19/aula-644-adr/service-scheduling-architecture-decisions
```

Estrutura principal:

```text
service-scheduling-architecture-decisions
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/adr
│   ├── model
│   ├── catalog
│   ├── lifecycle
│   ├── validation
│   └── gate
├── src/test/java/br/com/formacao/adr
├── architecture
│   ├── decisions
│   │   ├── README.md
│   │   ├── ADR-0000-template.md
│   │   ├── ADR-0001-confirmacao-sincrona-efeitos-assincronos.md
│   │   └── index.md
│   ├── ADR_POLICY.md
│   ├── ADR_LIFECYCLE.md
│   ├── ADR_NAMING.md
│   ├── ADR_REVIEW_POLICY.md
│   ├── ADR_SUPERSESSION.md
│   ├── ADR_OWNERSHIP.md
│   └── ADR_TRACEABILITY.md
├── contracts
└── reports
```

Scripts:

```text
scripts/m19/service-scheduling-adr
├── validate-adr-contract.ps1
├── validate-adr-naming.ps1
├── validate-adr-required-sections.ps1
├── validate-adr-lifecycle.ps1
├── validate-adr-traceability.ps1
├── validate-adr-supersession.ps1
├── validate-adr-index.ps1
├── run-adr-tests.ps1
├── collect-adr-evidence.ps1
└── verify-adr-gate.ps1
```

Ao final, você terá um ADR aceito, catálogo navegável, regras de evolução e validação automatizada para conteúdo incompleto, status inválido, referência quebrada e supersessão inconsistente.

---

## Conceito essencial

### O que merece ADR

Uma decisão merece ADR quando altera estrutura, atributos de qualidade, fronteiras, risco, custo ou capacidade de evolução do sistema. Exemplos incluem modelo de consistência, comunicação entre contextos, isolamento multi-tenant, banco, broker, protocolo, segurança, deploy e dependências difíceis de remover.

Mudanças locais, correções de bug, formatação e escolhas já cobertas por convenção normalmente não precisam de ADR.

Pergunta de triagem:

```text
se esta escolha for questionada daqui a um ano,
a equipe precisará conhecer contexto,
alternativas e consequências
para alterá-la com segurança?
```

### O que o ADR preserva

ADR registra a decisão, não toda a discussão. A análise detalhada permanece em relatórios e experimentos. O registro preserva:

```text
contexto suficiente;
decisão clara;
status;
consequências positivas e negativas;
alternativas relevantes;
evidências principais;
riscos;
gatilhos de revisão;
links para detalhes.
```

### Status e história

Modelo desta aula:

```text
PROPOSED;
ACCEPTED;
REJECTED;
DEPRECATED;
SUPERSEDED.
```

`PROPOSED` ainda está em avaliação. `ACCEPTED` orienta a arquitetura. `REJECTED` registra uma proposta recusada. `DEPRECATED` não deve orientar trabalho novo. `SUPERSEDED` foi substituído por outra decisão.

Quando a escolha muda, crie novo ADR e ligue os registros. O antigo permanece versionado. Correções editoriais podem ocorrer no mesmo arquivo; mudança de significado exige novo ID.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-644-adr/service-scheduling-architecture-decisions

Set-Location `
  labs/m19/aula-644-adr/service-scheduling-architecture-decisions
```

Crie as pastas principais:

```powershell
New-Item -ItemType Directory -Force architecture/decisions
New-Item -ItemType Directory -Force contracts
New-Item -ItemType Directory -Force reports
New-Item -ItemType Directory -Force src/main/java/br/com/formacao/adr
New-Item -ItemType Directory -Force src/test/java/br/com/formacao/adr
```

### 2. Criar a política de ADR

Arquivo:

```text
architecture/ADR_POLICY.md
```

Conteúdo:

```markdown
# ADR Policy

Usamos Architecture Decision Records
para decisões que alteram estrutura,
atributos de qualidade,
fronteiras,
risco,
custo operacional
ou capacidade de evolução.

Cada ADR deve ser:

- focado em uma decisão principal;
- curto o suficiente para ser lido;
- completo o suficiente para ser entendido;
- versionado com o código;
- ligado a evidências e artefatos;
- atualizado por supersessão,
  não por apagamento de história.

Decisões locais e reversíveis
cobertas por convenções existentes
não exigem ADR.
```

A política evita dois extremos:

```text
nenhuma decisão é registrada;

tudo vira ADR.
```

### 3. Definir convenção de nomes

Arquivo:

```text
architecture/ADR_NAMING.md
```

Convenção:

```text
ADR-NNNN-titulo-curto-em-kebab-case.md
```

Exemplos:

```text
ADR-0001-confirmacao-sincrona-efeitos-assincronos.md
ADR-0002-isolamento-multi-tenant-hibrido.md
ADR-0003-eventos-de-integracao-com-outbox.md
```

Regras:

- sequência numérica com quatro dígitos;
- ID nunca reutilizado;
- título curto e orientado à decisão;
- arquivo Markdown;
- renomeação apenas antes de referências externas estáveis;
- ID permanece mesmo se o título editorial mudar.

### 4. Criar o template

Arquivo:

```text
architecture/decisions/ADR-0000-template.md
```

Conteúdo:

```markdown
# ADR-0000 - Modelo de decisao arquitetural

Status: Proposed

Data: 2026-07-14

Decisores: Architecture Group

Escopo: estrutura documental de ADR

**Contexto**

O time precisa de uma estrutura padrao
para registrar decisoes arquiteturais.

**Decisao**

Usar as secoes deste arquivo
como modelo para novos ADRs.

**Consequencias positivas**

- registros ficam consistentes e navegaveis;

**Consequencias negativas**

- o modelo precisa evoluir junto com a politica;

**Alternativas consideradas**

Documentacao livre foi rejeitada
por dificultar validacao e descoberta.

**Evidencias**

- architecture/ADR_POLICY.md;

**Riscos e mitigações**

- risco de burocracia;
  mitigacao por criterio de triagem;

**Gatilhos de revisão**

- alteracao da ADR Policy;

**Relações**

Supersedes: nenhum.

Superseded by: nenhum.

**Links**

- architecture/ADR_POLICY.md;
```

O template é simples. Ele não precisa conter todas as seções possíveis de todos os times. Precisa conter o mínimo necessário para este contexto.

### 5. Definir conteúdo obrigatório

Arquivo:

```text
contracts/adr-content-policy.yaml
```

Conteúdo:

```yaml
adrContent:
  required:
    - id
    - title
    - status
    - date
    - context
    - decision
    - positive-consequences
    - negative-consequences
    - alternatives
    - evidence
    - review-triggers
    - relations

  acceptedDecision:
    decisionMustBeUnambiguous:
      true
    evidenceReference:
      required
    negativeConsequence:
      required

  forbidden:
    - technology-name-without-context
    - only-positive-consequences
    - silent-status
    - hidden-supersession
    - decision-without-owner
```

Uma decisão aceita sem consequência negativa normalmente indica análise incompleta ou texto promocional.

### 6. Criar o ADR real

Arquivo:

```text
architecture/decisions/ADR-0001-confirmacao-sincrona-efeitos-assincronos.md
```

Conteúdo:

```markdown
# ADR-0001 - Confirmacao sincrona com efeitos assincronos

Status: Accepted

Data: 2026-07-14

Decisores: Service Scheduling Architecture Group

Escopo: fluxo de confirmacao de Appointment

**Contexto**

A confirmacao altera o estado autoritativo
do Appointment e precisa devolver
resultado claro ao cliente.

O fluxo tambem dispara notificacao,
atualizacao de dashboard,
preparacao de execucao de campo
e auditoria derivada.

Executar todos os efeitos no request
aumenta latencia, acoplamento
e probabilidade de falha parcial.

Aceitar toda a confirmacao
apenas de forma assincrona
reduz a clareza do resultado imediato
e aumenta a complexidade de UX.

A analise da aula 643 comparou:

- fluxo integralmente sincrono;
- commit sincrono com efeitos assincronos;
- processamento integralmente assincrono.

**Decisao**

A confirmacao persistira de forma sincrona
o novo estado autoritativo do Appointment
e o registro de outbox
na mesma transacao.

A resposta de sucesso sera devolvida
somente apos o commit local.

Notificacao, dashboard,
preparacao de campo
e demais efeitos externos
serao processados de forma assincrona,
com entrega at-least-once,
idempotencia,
retry limitado,
dead letter,
observabilidade
e reconciliacao.

**Consequencias positivas**

- resultado imediato e claro para o cliente;
- invariantes permanecem no commit autoritativo;
- efeitos externos nao ampliam a latencia critica;
- falhas de consumidores nao desfazem a confirmacao;
- consumidores podem escalar de forma independente;
- recovery e replay ficam possiveis.

**Consequencias negativas**

- read models podem ficar temporariamente atrasados;
- consumidores precisam ser idempotentes;
- outbox, relay, retries e dead letter precisam ser operados;
- a UX deve diferenciar confirmacao concluida de sincronizacao pendente;
- observabilidade e reconciliation tornam-se obrigatorias;
- o sistema aceita complexidade assincrona permanente.

**Alternativas consideradas**

**Fluxo integralmente sincrono**

Rejeitado porque efeitos externos
ampliam latencia, acoplamento
e risco de falha parcial no request.

**Processamento integralmente assincrono**

Rejeitado porque a confirmacao exige
resposta imediata sobre o commit autoritativo
e experiencia clara de sucesso ou falha.

**Evidencias**

- tradeoffs/DECISION_RECOMMENDATION.md;
- reports/trade-off-analysis-report.yaml;
- reports/load-experiment-report.yaml;
- reports/failure-drill-report.yaml;
- SLO de confirmacao de Appointment;
- testes de outbox e idempotencia.

**Riscos e mitigações**

- risco: atraso de consumidores;
  mitigacao: lag SLO, alerta, replay e reconciliation;
- risco: evento duplicado;
  mitigacao: inbox e idempotencia por efeito;
- risco: schema incompatível;
  mitigacao: versionamento e contract tests;
- risco: crescimento da outbox;
  mitigacao: retenção, monitoramento e cleanup seguro.

**Gatilhos de revisao**

- p95 do commit local ultrapassar o SLO por trinta dias;
- lag de efeitos criticos ultrapassar o budget recorrente;
- custo operacional da mensageria superar o limite aprovado;
- necessidade de confirmacao totalmente offline;
- alteracao regulatoria exigir efeito externo no mesmo commit;
- taxa de reconciliacao manual ultrapassar o limite definido.

**Relações**

Supersedes: nenhum.

Superseded by: nenhum.

**Links**

- aula 633 - arquitetura orientada a eventos;
- aula 634 - consistencia eventual;
- aula 637 - idempotencia avancada;
- aula 643 - trade offs tecnicos;
- runbook de consumidores;
- dashboard de lag.
```

Observe que o ADR não repete toda a matriz de decisão. Ele aponta para as evidências detalhadas.

### 7. Tornar a decisão objetiva

Uma decisão fraca diz:

```text
usaremos mensageria.
```

A decisão real precisa declarar:

- qual operação;
- o que permanece síncrono;
- o que se torna assíncrono;
- qual limite transacional;
- qual garantia de entrega;
- quais condições operacionais são obrigatórias;
- qual resultado o cliente recebe.

A clareza evita interpretações incompatíveis por equipes diferentes.

### 8. Declarar consequências negativas

ADR não é material de venda.

Ao escolher processamento assíncrono, você também escolhe:

- atraso temporário;
- duplicação possível;
- necessidade de idempotência;
- observabilidade de lag;
- dead letter;
- reconciliação;
- complexidade operacional.

A consequência negativa ajuda a equipe a reconhecer o custo aceito e detectar quando ele deixou de ser aceitável.

### 9. Separar alternativa rejeitada de erro

Uma alternativa rejeitada não precisa ser ruim.

O fluxo integralmente síncrono pode ser adequado em outro contexto. O processamento integralmente assíncrono pode ser melhor em um workflow offline.

O ADR deve dizer:

```text
não escolhemos nesta decisão,
por estas forças,
neste momento.
```

Evite frases absolutas como:

```text
mensageria sempre escala melhor;
REST é ultrapassado;
monólito não funciona;
consistência forte é impossível.
```

### 10. Criar o status em Java

Arquivo:

```text
src/main/java/br/com/formacao/adr/model/AdrStatus.java
```

```java
package br.com.formacao.adr.model;

public enum AdrStatus {
    PROPOSED,
    ACCEPTED,
    REJECTED,
    DEPRECATED,
    SUPERSEDED
}
```

### 11. Criar o identificador

Arquivo:

```text
src/main/java/br/com/formacao/adr/model/AdrId.java
```

```java
package br.com.formacao.adr.model;

import java.util.Objects;
import java.util.regex.Pattern;

public record AdrId(String value) {

    private static final Pattern PATTERN = Pattern.compile("ADR-\\d{4}");

    public AdrId {
        Objects.requireNonNull(value);

        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("ADR id must match ADR-NNNN");
        }
    }
}
```

O ID é estável e não depende do título.

### 12. Criar o modelo principal

Arquivo:

```text
src/main/java/br/com/formacao/adr/model/ArchitectureDecision.java
```

```java
package br.com.formacao.adr.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public record ArchitectureDecision(
        AdrId id,
        String title,
        AdrStatus status,
        LocalDate date,
        String scope,
        String context,
        String decision,
        List<String> positiveConsequences,
        List<String> negativeConsequences,
        List<String> alternatives,
        List<String> evidenceReferences,
        List<ReviewTrigger> reviewTriggers,
        List<DecisionLink> links) {

    public ArchitectureDecision {
        Objects.requireNonNull(id);
        Objects.requireNonNull(title);
        Objects.requireNonNull(status);
        Objects.requireNonNull(date);
        Objects.requireNonNull(scope);
        Objects.requireNonNull(context);
        Objects.requireNonNull(decision);
        positiveConsequences = List.copyOf(positiveConsequences);
        negativeConsequences = List.copyOf(negativeConsequences);
        alternatives = List.copyOf(alternatives);
        evidenceReferences = List.copyOf(evidenceReferences);
        reviewTriggers = List.copyOf(reviewTriggers);
        links = List.copyOf(links);
    }
}
```

### 13. Criar gatilhos de revisão

```java
package br.com.formacao.adr.model;

import java.util.Objects;

public record ReviewTrigger(
        String condition,
        String metric,
        String threshold,
        String owner) {

    public ReviewTrigger {
        Objects.requireNonNull(condition);
        Objects.requireNonNull(owner);
    }
}
```

Um gatilho útil é observável.

Fraco:

```text
revisar se necessário.
```

Melhor:

```text
revisar se o lag p95 dos efeitos críticos
ultrapassar 30 segundos
em mais de 1% das confirmações
por sete dias consecutivos.
```

### 14. Criar relações entre decisões

```java
package br.com.formacao.adr.model;

import java.util.Objects;

public record DecisionLink(
        AdrId target,
        LinkType type) {

    public DecisionLink {
        Objects.requireNonNull(target);
        Objects.requireNonNull(type);
    }

    public enum LinkType {
        SUPERSEDES,
        SUPERSEDED_BY,
        RELATED_TO,
        DEPENDS_ON
    }
}
```

### 15. Definir lifecycle

Arquivo:

```text
architecture/ADR_LIFECYCLE.md
```

Fluxo recomendado:

```text
Proposed
-> Accepted
-> Deprecated
-> Superseded
```

Também pode ocorrer:

```text
Proposed
-> Rejected.
```

Regras:

- `Accepted` não volta silenciosamente para `Proposed`;
- `Rejected` permanece como histórico quando sua existência for relevante;
- `Deprecated` sinaliza que não deve orientar trabalho novo;
- `Superseded` exige referência ao novo ADR;
- mudança de significado exige novo ADR.

### 16. Criar política de lifecycle

Arquivo:

```text
contracts/adr-lifecycle-policy.yaml
```

```yaml
adrLifecycle:
  statuses:
    - PROPOSED
    - ACCEPTED
    - REJECTED
    - DEPRECATED
    - SUPERSEDED

  transitions:
    PROPOSED:
      - ACCEPTED
      - REJECTED
    ACCEPTED:
      - DEPRECATED
      - SUPERSEDED
    DEPRECATED:
      - SUPERSEDED
    REJECTED: []
    SUPERSEDED: []

  acceptedToProposed:
    forbidden:
      true

  superseded:
    requiresReplacement:
      true
```

### 17. Implementar lifecycle

```java
package br.com.formacao.adr.lifecycle;

import br.com.formacao.adr.model.AdrStatus;
import java.util.Map;
import java.util.Set;

public final class AdrLifecycle {

    private static final Map<AdrStatus, Set<AdrStatus>> ALLOWED = Map.of(
            AdrStatus.PROPOSED, Set.of(AdrStatus.ACCEPTED, AdrStatus.REJECTED),
            AdrStatus.ACCEPTED, Set.of(AdrStatus.DEPRECATED, AdrStatus.SUPERSEDED),
            AdrStatus.DEPRECATED, Set.of(AdrStatus.SUPERSEDED),
            AdrStatus.REJECTED, Set.of(),
            AdrStatus.SUPERSEDED, Set.of());

    public void requireAllowed(AdrStatus current, AdrStatus next) {
        if (!ALLOWED.getOrDefault(current, Set.of()).contains(next)) {
            throw new IllegalStateException(
                    "Invalid ADR transition: " + current + " -> " + next);
        }
    }
}
```

### 18. Definir supersessão

Arquivo:

```text
architecture/ADR_SUPERSESSION.md
```

Regra:

```text
uma nova decisão substitui a anterior;

a anterior não é apagada;

as duas referências precisam ser consistentes;

o motivo da mudança fica no novo ADR;

a data e o owner da mudança são registrados.
```

Exemplo futuro:

```text
ADR-0017 supersedes ADR-0001.
ADR-0001 is superseded by ADR-0017.
```

### 19. Criar política de supersessão

```yaml
adrSupersession:
  replacement:
    mustExist:
      true
    statusMustBe:
      ACCEPTED

  previousDecision:
    statusMustBe:
      SUPERSEDED
    mustReferenceReplacement:
      true

  replacementDecision:
    mustReferencePrevious:
      true

  deletePreviousFile:
    forbidden:
      true

  reusePreviousId:
    forbidden:
      true
```

### 20. Implementar serviço de supersessão

```java
package br.com.formacao.adr.lifecycle;

import br.com.formacao.adr.catalog.AdrCatalog;
import br.com.formacao.adr.model.AdrId;
import br.com.formacao.adr.model.AdrStatus;

public final class SupersessionService {

    private final AdrCatalog catalog;

    public SupersessionService(AdrCatalog catalog) {
        this.catalog = catalog;
    }

    public SupersessionResult supersede(AdrId previousId, AdrId replacementId) {
        var previous = catalog.require(previousId);
        var replacement = catalog.require(replacementId);

        if (replacement.status() != AdrStatus.ACCEPTED) {
            throw new IllegalStateException("Replacement ADR must be accepted");
        }

        catalog.markSuperseded(previousId, replacementId);
        catalog.linkSupersedes(replacementId, previousId);

        return new SupersessionResult(previousId, replacementId, true);
    }
}
```

### 21. Criar catálogo

O catálogo oferece busca por ID, status, escopo e relação.

```java
package br.com.formacao.adr.catalog;

import br.com.formacao.adr.model.AdrId;
import br.com.formacao.adr.model.ArchitectureDecision;
import java.util.List;

public interface AdrCatalog {

    ArchitectureDecision require(AdrId id);

    List<ArchitectureDecision> findAll();

    void save(ArchitectureDecision decision);

    void markSuperseded(AdrId previous, AdrId replacement);

    void linkSupersedes(AdrId replacement, AdrId previous);
}
```

O laboratório usa catálogo em memória para validar semântica. Em produção, os arquivos Markdown continuam sendo a fonte versionada.

### 22. Criar índice navegável

Arquivo:

```text
architecture/decisions/index.md
```

Conteúdo:

```markdown
# Architecture Decision Index

| ID | Título | Status | Data | Escopo | Substitui | Substituída por |
|---|---|---|---|---|---|---|
| ADR-0001 | Confirmação síncrona com efeitos assíncronos | Accepted | 2026-07-14 | Appointment confirmation | - | - |
```

O índice não substitui os ADRs. Ele reduz custo de descoberta.

### 23. Automatizar o índice

`DecisionIndex` deve ordenar por ID e produzir entradas consistentes.

```java
package br.com.formacao.adr.catalog;

import java.util.Comparator;
import java.util.List;

public final class DecisionIndex {

    public List<DecisionIndexEntry> build(AdrCatalog catalog) {
        return catalog.findAll()
                .stream()
                .sorted(Comparator.comparing(decision -> decision.id().value()))
                .map(DecisionIndexEntry::from)
                .toList();
    }
}
```

### 24. Definir ownership e rastreabilidade

Cada ADR precisa de decisores, owner do domínio, reviewers necessários e owner dos gatilhos. Relacione o registro à análise de trade-off, experimentos, issues, componentes C4, contratos, dashboards, runbooks e eventual decisão substituta.

Arquivo `contracts/adr-traceability-policy.yaml`:

```yaml
adrTraceability:
  accepted:
    requires:
      - decision-owner
      - evidence-reference
      - implementation-reference
      - affected-scope
      - review-trigger

  brokenReference:
    action:
      FAIL
```

### 25. Criar validator

```java
package br.com.formacao.adr.validation;

import br.com.formacao.adr.model.AdrStatus;
import br.com.formacao.adr.model.ArchitectureDecision;
import java.util.ArrayList;
import java.util.List;

public final class AdrValidator {

    public List<ValidationFinding> validate(ArchitectureDecision adr) {
        List<ValidationFinding> findings = new ArrayList<>();

        requireText(adr.context(), "CONTEXT_REQUIRED", findings);
        requireText(adr.decision(), "DECISION_REQUIRED", findings);

        if (adr.status() == AdrStatus.ACCEPTED
                && adr.evidenceReferences().isEmpty()) {
            findings.add(ValidationFinding.error("ACCEPTED_ADR_REQUIRES_EVIDENCE"));
        }

        if (adr.status() == AdrStatus.ACCEPTED
                && adr.negativeConsequences().isEmpty()) {
            findings.add(ValidationFinding.error("NEGATIVE_CONSEQUENCE_REQUIRED"));
        }

        return List.copyOf(findings);
    }

    private void requireText(String value, String code, List<ValidationFinding> findings) {
        if (value == null || value.isBlank()) {
            findings.add(ValidationFinding.error(code));
        }
    }
}
```

### 26. Validar arquivo, naming e placeholders

Os scripts verificam nome, H1, status, data, seções, decisão, consequência negativa, evidência, owner, relações, links e ausência de placeholders.

Em ADR aceito, proíba marcadores de pendência, datas-modelo não substituídas, owner ausente e texto instrucional que não represente uma decisão real.

O `ADR-0000` é um modelo totalmente preenchido e fica explicitamente fora do catálogo de decisões publicadas.

Arquivo `contracts/adr-naming-policy.yaml`:

```yaml
adrNaming:
  filePattern:
    ADR-\d{4}-[a-z0-9-]+\.md
  duplicateId:
    action:
      FAIL
  idReuse:
    forbidden:
      true
```

### 27. Definir revisão por gatilho

Revise uma decisão quando um gatilho for atingido, uma premissa falhar, ocorrer incidente relacionado ou surgir mudança estrutural incompatível. A revisão conclui por manter, deprecar, criar ADR substituto ou abrir RFC.

Evite validade artificial para todos os ADRs. Decisões são revistas por risco e condição mensurável, não apenas por calendário.

### 28. Ligar ADR ao código sem dependência de runtime

Use o ID em README, `package-info.java`, pull request, C4 ou comentário arquitetural pontual. Não duplique o texto completo no código e não faça o serviço produtivo ler Markdown para decidir comportamento.

```java
package br.com.formacao.scheduling.confirmation;

/**
 * Confirmation boundary defined by ADR-0001.
 */
public final class ConfirmAppointmentService {
}
```

### 29. Criar testes de naming e seções

Valide nomes aceitos como `ADR-0001-confirmacao-sincrona-efeitos-assincronos.md` e rejeite formatos com espaço, underscore, ID curto ou título ausente.

`RequiredSectionsTest` confirma contexto, decisão, consequências, alternativas, evidências, gatilhos, relações e links sem exigir tamanho artificial.

### 30. Criar teste de decisão aceita

Um ADR `ACCEPTED` precisa de decisão clara, evidência, consequência negativa, owner, gatilho e validação aprovada.

### 31. Criar teste de lifecycle

Confirme transições permitidas e rejeite `ACCEPTED -> PROPOSED`, `SUPERSEDED -> ACCEPTED` e reativação de `REJECTED` no mesmo registro.

### 32. Criar teste de supersessão

Valide que o novo ADR aceito aponta para o anterior, o anterior fica `SUPERSEDED`, o índice mostra as duas relações e nenhum arquivo é apagado.

### 33. Criar teste de referência quebrada

Referência obrigatória ausente gera `FAIL_TRACEABILITY`.

### 34. Criar teste de placeholder

Marcadores de pendência, data-modelo e owner ausente falham em ADR publicado. O ADR-0000 usa conteúdo didático completo e não entra no catálogo.

### 35. Criar Data Quality Policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

```yaml
quality:
  duplicateAdrId:
    action:
      FAIL

  acceptedWithoutEvidence:
    action:
      FAIL

  acceptedWithoutNegativeConsequence:
    action:
      FAIL

  supersededWithoutReplacement:
    action:
      FAIL

  brokenMandatoryLink:
    action:
      FAIL

  placeholderInAcceptedAdr:
    action:
      FAIL

  undocumentedStatus:
    action:
      FAIL

  titleMismatch:
    action:
      FAIL
```

### 36. Criar contrato principal

Arquivo:

```text
contracts/adr-contract.yaml
```

```yaml
adr:
  context:
    Service-Scheduling

  required:
    - policy
    - naming
    - template
    - lifecycle
    - status
    - context
    - decision
    - consequences
    - alternatives
    - evidence
    - ownership
    - review-triggers
    - supersession
    - index
    - validation
    - tests
    - gate

  forbidden:
    - history-deletion
    - accepted-decision-with-placeholder
    - only-positive-consequences
    - status-inferred-by-file-age
    - runtime-dependency-on-markdown
    - RFC-deep-dive

  nextLesson:
    code:
      M19.35
```

### 37. Criar Non-Anticipation Policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

```yaml
nonAnticipation:
  lesson645:
    forbidden:
      - RFC-comment-workflow
      - RFC-review-rounds
      - RFC-approval-quorum
      - RFC-consultation-process
      - RFC-objection-resolution
      - RFC-rollout-governance-deep-dive

  allowed:
    - ADR-reviewer-reference
    - ADR-decision-owner
    - link-to-future-RFC
```

A aula pode explicar a diferença entre ADR e RFC, mas não deve implementar o fluxo colaborativo completo da próxima aula.

### 38. Criar reports

Exemplo de `reports/adr-catalog-report.yaml`:

```yaml
adrCatalog:
  total:
    1

  byStatus:
    proposed:
      0
    accepted:
      1
    rejected:
      0
    deprecated:
      0
    superseded:
      0

  duplicateIds:
    0

  brokenLinks:
    0

  missingReviewTriggers:
    0

  result:
    PASS
```

### 39. Criar relatório de validação

```yaml
adrValidation:
  adrId:
    ADR-0001

  fileName:
    PASS

  h1:
    PASS

  requiredSections:
    PASS

  acceptedEvidence:
    PASS

  negativeConsequences:
    PASS

  lifecycle:
    PASS

  traceability:
    PASS

  placeholders:
    PASS

  result:
    PASS
```

### 40. Criar gate

O gate valida:

- política;
- nome e ID;
- template;
- conteúdo obrigatório;
- decisão clara;
- consequências positivas e negativas;
- alternativas;
- evidências;
- ownership;
- gatilhos;
- lifecycle;
- supersessão;
- índice;
- rastreabilidade;
- ausência de placeholders;
- testes;
- arquitetura;
- documentação.

Status:

```text
PASS;

FAIL_POLICY;

FAIL_NAMING;

FAIL_REQUIRED_SECTION;

FAIL_DECISION_CLARITY;

FAIL_CONSEQUENCE;

FAIL_EVIDENCE;

FAIL_OWNERSHIP;

FAIL_REVIEW_TRIGGER;

FAIL_LIFECYCLE;

FAIL_SUPERSESSION;

FAIL_INDEX;

FAIL_TRACEABILITY;

FAIL_PLACEHOLDER;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

### 41. Implementar gate

```java
package br.com.formacao.adr.gate;

import br.com.formacao.adr.model.ArchitectureDecision;
import br.com.formacao.adr.validation.AdrValidator;

public final class AdrGate {

    private final AdrValidator validator;

    public AdrGate(AdrValidator validator) {
        this.validator = validator;
    }

    public AdrGateResult verify(ArchitectureDecision decision) {
        var findings = validator.validate(decision);

        boolean hasError = findings.stream()
                .anyMatch(finding -> finding.severity().isError());

        if (hasError) {
            return AdrGateResult.failed(AdrGateStatus.FAIL_REQUIRED_SECTION, findings);
        }

        return AdrGateResult.passed(findings);
    }
}
```

Em uma implementação completa, cada categoria do gate terá validador próprio para produzir status preciso.

### 42. Coletar evidence

Arquivo:

```text
contracts/adr-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- ADR count;
- accepted count;
- proposed count;
- rejected count;
- deprecated count;
- superseded count;
- duplicate ID count;
- broken link count;
- missing section count;
- placeholder count;
- lifecycle status;
- supersession status;
- index status;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- credenciais;
- tokens;
- dados pessoais;
- links privados com segredo;
- conteúdo confidencial desnecessário;
- detalhes completos de RFC da aula 645.

### 43. Validar contrato

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-contract.ps1
```

Valide política, template, conteúdo, lifecycle, supersessão, índice e não antecipação.

### 44. Validar naming

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-naming.ps1
```

Valide padrão de arquivo, H1, ID, duplicidade e estabilidade.

### 45. Validar seções

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-required-sections.ps1
```

Valide seções obrigatórias, conteúdo mínimo, decisão clara e consequências negativas.

### 46. Validar lifecycle

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-lifecycle.ps1
```

Valide status conhecido, transições e proibição de retorno silencioso.

### 47. Validar rastreabilidade

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-traceability.ps1
```

Valide owner, evidências, artefatos, escopo, links e gatilhos.

### 48. Validar supersessão

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-supersession.ps1
```

Valide referências bidirecionais, status e preservação do arquivo antigo.

### 49. Validar índice

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-index.ps1
```

Valide que todos os ADRs publicados aparecem uma vez no índice, com status e relações corretos.

### 50. Executar testes

```powershell
.\scripts\m19\service-scheduling-adr\run-adr-tests.ps1
```

Ou:

```powershell
mvn test
```

Valide naming, seções, evidências, consequências, lifecycle, supersessão, links, placeholders, catálogo, índice, gate e arquitetura.

### 51. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-contract.ps1

.\scripts\m19\service-scheduling-adr\validate-adr-naming.ps1

.\scripts\m19\service-scheduling-adr\validate-adr-required-sections.ps1

.\scripts\m19\service-scheduling-adr\validate-adr-lifecycle.ps1

.\scripts\m19\service-scheduling-adr\validate-adr-traceability.ps1

.\scripts\m19\service-scheduling-adr\validate-adr-supersession.ps1

.\scripts\m19\service-scheduling-adr\validate-adr-index.ps1

.\scripts\m19\service-scheduling-adr\run-adr-tests.ps1

.\scripts\m19\service-scheduling-adr\collect-adr-evidence.ps1

.\scripts\m19\service-scheduling-adr\verify-adr-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

### 52. Encerrar o laboratório

Confirme:

- política de ADR criada;
- decisão significativa identificada;
- nome e ID estáveis;
- template criado;
- ADR-0001 preenchido sem placeholders;
- status `Accepted` explícito;
- contexto resumido;
- decisão objetiva;
- consequências positivas e negativas;
- alternativas registradas;
- evidências ligadas;
- riscos e mitigações presentes;
- gatilhos mensuráveis;
- ownership definido;
- lifecycle documentado;
- supersessão preserva história;
- índice navegável;
- links obrigatórios válidos;
- código não depende do Markdown em runtime;
- testes aprovados;
- reports e evidence sanitizados;
- gate aprovado;
- RFC não aprofundado.

---

## Entendendo o que foi feito

### A análise virou memória arquitetural

A aula 643 produziu uma recomendação detalhada. Nesta aula, a decisão foi resumida em um ADR que mantém o contexto essencial, a escolha, as consequências e os gatilhos.

### A decisão ganhou lifecycle

O ADR deixou de ser um arquivo estático e passou a possuir status, transições permitidas e política de supersessão.

### A história ficou preservada

Uma decisão futura não apagará `ADR-0001`. Ela criará novo ID, explicará a mudança e ligará os registros.

### A documentação ganhou validação

Nome, H1, seções, evidências, consequências, links, placeholders, lifecycle, índice e supersessão passaram a ser verificáveis.

### O repositório ganhou navegação

O índice permite descobrir decisões por ID, status, data, escopo e relação, reduzindo o custo de encontrar contexto arquitetural.

---

## Erros comuns importantes

### Criar ADR para tudo

Excesso de registros reduz sinal e aumenta manutenção. Use ADR para decisões com impacto estrutural ou difícil revisão.

### Registrar apenas a tecnologia escolhida

“Usar Kafka” não explica problema, escopo, garantia, consequência ou alternativa.

### Escrever somente benefícios

Toda decisão relevante possui custo. Ausência de consequência negativa é sinal de incompletude.

### Alterar o ADR antigo até parecer que a decisão sempre foi outra

Isso destrói história. Crie novo ADR e use supersessão.

### Manter status implícito

Arquivo antigo não significa aceito. Documento novo não significa proposto. Declare status.

### Copiar toda a análise para o ADR

O ADR precisa ser lido. Referencie relatórios e experimentos detalhados.

### Usar links frágeis

Referências que somem impedem auditoria. Prefira artefatos versionados e URLs estáveis.

### Não definir gatilhos

Sem condição de revisão, uma decisão pode permanecer mesmo após suas premissas falharem.

### Transformar ADR em configuração de runtime

Documentação não deve controlar comportamento produtivo. Código, contratos e testes implementam a decisão.

### Confundir ADR com RFC

ADR registra a decisão. RFC estrutura a proposta e a revisão antes da decisão. O fluxo de RFC será aprofundado na aula 645.

---

## Comandos úteis

### Validar naming

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-naming.ps1
```

### Validar seções

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-required-sections.ps1
```

### Validar supersessão

```powershell
.\scripts\m19\service-scheduling-adr\validate-adr-supersession.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-adr\run-adr-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-adr\verify-adr-gate.ps1
```

---

## Exercício guiado

Escolha uma decisão arquitetural relevante do seu projeto e execute o fluxo:

1. confirme que a escolha merece ADR;
2. recupere análise, baseline e evidências;
3. atribua ID e nome estável;
4. declare status e decisores;
5. escreva contexto sem antecipar a resposta;
6. declare a decisão de forma objetiva;
7. registre consequências positivas e negativas;
8. resuma alternativas consideradas;
9. ligue evidências reproduzíveis;
10. registre riscos e mitigações;
11. defina gatilhos mensuráveis;
12. adicione o ADR ao índice;
13. execute validações e gate.

O exercício não termina quando o Markdown parece bonito. Ele termina quando outra pessoa consegue compreender, localizar, validar e revisar a decisão.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 643 e ponte para a aula 645 foram preservadas;
- laboratório `service-scheduling-architecture-decisions` criado;
- política, naming, template e índice criados;
- ADR-0001 registra a decisão analisada na aula 643;
- contexto, decisão, consequências positivas e negativas estão separados;
- alternativas, evidências, riscos, mitigações, owners e gatilhos estão presentes;
- IDs são estáveis e não reutilizados;
- lifecycle possui transições controladas;
- supersessão é bidirecional e preserva história;
- rastreabilidade e links obrigatórios são validados;
- placeholders são proibidos em ADR aceito;
- runtime não depende de Markdown;
- testes de naming, conteúdo, lifecycle, supersessão, links e gate foram criados;
- reports e evidence foram sanitizados;
- RFC técnico não foi aprofundado;
- commit, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-644-adr/service-scheduling-architecture-decisions `
  scripts/m19/service-scheduling-adr `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|unresolvedPlaceholder|RFCApprovalFlow"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): registrar decisao arquitetural com ADR"
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
- placeholders em ADR aceito;
- links temporários;
- detalhes completos do fluxo de RFC.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou Architecture Decision Records.

Você criou:

```text
ADR Policy;

ADR Naming;

ADR Template;

ADR-0001;

AdrId;

AdrStatus;

ArchitectureDecision;

ReviewTrigger;

DecisionLink;

AdrLifecycle;

SupersessionService;

AdrCatalog;

DecisionIndex;

AdrValidator;

AdrGate;

contracts;

reports;

evidence.
```

Você comprovou que ADR existe para preservar uma decisão arquitetural relevante; que contexto, decisão e consequência são partes diferentes; que decisão aceita precisa de evidência, custo e ownership; que status deve ser explícito; que a história não deve ser apagada; que mudança de decisão exige novo ADR e supersessão; que um índice reduz custo de descoberta; que gatilhos tornam a revisão objetiva; e que documentação arquitetural também pode possuir contratos, testes e gate.

A próxima aula será:

```text
645 - M19.35 - RFC tecnico
```

Nela, você aprenderá a estruturar uma proposta técnica antes da decisão final, conduzir revisão, reunir objeções, registrar alternativas, resolver comentários e transformar uma proposta aprovada em trabalho implementável e, quando necessário, em ADR.

Nenhum aprofundamento completo do workflow de RFC foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Identifiquei uma decisão que merece ADR.
- [ ] Criei política, naming e template.
- [ ] Registrei contexto, decisão e consequências.
- [ ] Incluí alternativas e evidências.
- [ ] Defini ownership e gatilhos.
- [ ] Modelei lifecycle e supersessão.
- [ ] Atualizei o índice.
- [ ] Executei testes e gate.

---

## Troubleshooting adicional

### O ADR ficou longo demais

Mova matrizes, logs e medições para artefatos ligados. Preserve apenas contexto, decisão, consequências e referências.

### A decisão parece genérica

Declare operação, escopo, limite transacional, garantia e consequência concreta.

### Não existe consequência negativa

Revise complexidade, operação, risco, lock-in, migração, observabilidade e recuperação.

### O time quer editar o ADR antigo

Correção editorial é permitida; mudança de decisão exige novo ID e supersessão.

### O índice divergiu dos arquivos

Gere ou valide o índice automaticamente no CI.

### A supersessão possui link em apenas um lado

Falhe o gate. A relação deve ser bidirecional.

### A equipe quer comentários formais e aprovação

Esse processo pertence ao RFC técnico da aula 645.

---

## Perguntas de revisão

1. O que é um ADR?
2. Quando uma decisão merece ADR?
3. Quando não é necessário criar ADR?
4. Qual diferença entre contexto e decisão?
5. Por que registrar consequências negativas?
6. Qual diferença entre análise de trade-off e ADR?
7. Quais status foram adotados?
8. O que significa `Proposed`?
9. O que significa `Accepted`?
10. O que significa `Superseded`?
11. Por que não apagar ADR antigo?
12. O que é supersessão bidirecional?
13. Para que serve o índice?
14. O que é um gatilho de revisão?
15. Por que o ID deve ser estável?
16. O runtime deve ler ADR para funcionar?
17. O que deve acontecer com links quebrados?
18. Qual diferença entre ADR e RFC?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Registro versionado de uma decisão arquitetural relevante.
2. Quando afeta estrutura, qualidades, risco, custo ou evolução.
3. Em mudanças locais, rotineiras ou cobertas por convenção.
4. Contexto explica o problema; decisão declara a escolha.
5. Para explicitar o custo aceito.
6. A análise compara opções; o ADR preserva a decisão.
7. Proposed, Accepted, Rejected, Deprecated e Superseded.
8. Ainda está em avaliação.
9. Foi aprovada e orienta a arquitetura.
10. Outra decisão a substituiu.
11. Para preservar história e rationale.
12. Novo ADR aponta para o antigo e o antigo para o novo.
13. Facilitar descoberta e navegação.
14. Condição observável que exige reavaliar a decisão.
15. Para manter referências duráveis.
16. Não.
17. A validação deve falhar ou marcar inconclusão conforme política.
18. ADR registra decisão; RFC conduz proposta e revisão.
19. RFC técnico.
20. RFC técnico.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 644 - M19.34 - ADR**

- Aprofundei Architecture Decision Records.
- Criei o laboratório `service-scheduling-architecture-decisions`.
- Diferenciei decisão arquitetural de mudança local.
- Criei ADR Policy e convenção de nomes.
- Criei o template ADR-0000.
- Transformei a análise da aula 643 no ADR-0001.
- Registrei confirmação síncrona com efeitos assíncronos.
- Separei contexto, decisão e consequências.
- Registrei consequências positivas e negativas.
- Resumi alternativas consideradas.
- Liguei evidências, riscos e mitigações.
- Defini gatilhos mensuráveis de revisão.
- Criei `AdrId`, `AdrStatus` e `ArchitectureDecision`.
- Modelei ownership e rastreabilidade.
- Criei lifecycle com transições controladas.
- Proibi retorno silencioso de Accepted para Proposed.
- Modelei supersessão bidirecional.
- Preservei ADRs antigos como histórico.
- Criei catálogo e índice navegável.
- Criei validator para seções, evidências e placeholders.
- Proibi dependência de Markdown em runtime.
- Criei testes de naming, lifecycle, supersessão e links.
- Criei reports, evidence e gate.
- Não antecipei o workflow completo de RFC.
- Próxima aula: RFC técnico.
```

---

## Referência técnica curta

- Architecture Decision Record.
- Architectural Decision.
- Decision Context.
- Decision Outcome.
- Consequence.
- Alternative.
- Evidence.
- Review Trigger.
- Decision Owner.
- ADR Status.
- Proposed.
- Accepted.
- Rejected.
- Deprecated.
- Superseded.
- Supersession.
- Decision Index.
- Traceability.
- Decision History.
- RFC.

Regra final:

```text
Architecture Decision Records preservam decisões arquiteturais relevantes sem substituir a análise que as produziu. Cada ADR possui ID estável, título, status, data, decisores, escopo, contexto, decisão objetiva, consequências positivas e negativas, alternativas, evidências, riscos, gatilhos de revisão e relações. Decisões aceitas não podem conter placeholders, depender apenas de opinião ou esconder custos; links obrigatórios precisam permanecer válidos e o índice deve permitir descoberta por ID, status, data e escopo. O lifecycle controla Proposed, Accepted, Rejected, Deprecated e Superseded, transições inválidas são rejeitadas e uma mudança de significado cria novo ADR em vez de reescrever a história. Supersessão é bidirecional, o arquivo antigo permanece versionado e o novo registro explica por que o contexto mudou. Código, contratos e testes implementam a decisão, enquanto o Markdown documenta o rationale e nunca se torna dependência de runtime. O gate só aprova quando política, naming, conteúdo, evidências, ownership, gatilhos, lifecycle, supersessão, rastreabilidade, índice, testes, arquitetura, reports e evidence estão coerentes; o fluxo colaborativo completo de proposta, comentários e aprovação permanece reservado ao RFC técnico da aula 645.
```
