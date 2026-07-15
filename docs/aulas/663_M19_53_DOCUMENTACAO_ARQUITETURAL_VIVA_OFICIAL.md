# 663 - M19.53 - Documentacao arquitetural viva

## Apresentação da aula

Na aula 662, você aprofundou governança técnica leve.

Você criou decision rights, guardrails, golden paths, revisão proporcional ao risco, fóruns, lifecycle de padrões, exceções temporárias, policy as code, scorecards, métricas de fluxo e um modelo federado de governança.

Essa estrutura definiu:

- quem decide;
- o que precisa ser coordenado;
- o que pertence ao time;
- quais limites são obrigatórios;
- quando revisar;
- como automatizar verificações;
- como tratar exceções;
- como medir o custo da própria governança.

Agora aparece um problema inevitável:

```text
como manter todas essas decisões
sincronizadas com a arquitetura real?
```

A documentação arquitetural costuma falhar por motivos conhecidos:

- é criada uma vez e abandonada;
- descreve a intenção, mas não o estado real;
- usa diagramas sem owner;
- possui ADRs sem relação com código;
- mantém RFCs aprovadas, mas nunca verifica a implementação;
- publica runbooks que não correspondem ao deploy;
- preserva contratos antigos depois de breaking changes;
- replica a mesma informação em vários lugares;
- depende de atualização manual;
- não possui data de revisão;
- não possui critérios para ficar obsoleta;
- não participa do pipeline;
- não é usada em incidentes, onboarding ou decisões.

Quando isso acontece, a documentação deixa de ser fonte de confiança.

Ela passa a competir com o sistema real.

O engenheiro pergunta:

```text
qual documento está certo?

o diagrama?

o código?

o deploy?

o catálogo?

o runbook?

o ADR?

o contrato?
```

Documentação arquitetural viva é documentação que:

- possui propósito;
- possui owner;
- possui fonte;
- possui lifecycle;
- possui links com o sistema;
- é validada;
- é versionada;
- é revisada;
- é usada;
- é removida ou atualizada quando perde validade;
- participa do fluxo de mudança;
- representa tanto decisões quanto evidências.

Ela não significa atualizar todo documento automaticamente.

Também não significa gerar documentação infinita.

Significa desenhar um sistema documental coerente.

O laboratório será:

```text
labs/m19/aula-663-documentacao-arquitetural-viva/service-scheduling-living-architecture-docs
```

Você irá organizar a documentação arquitetural do ecossistema `Service Scheduling`.

O cenário incluirá:

```text
System Context;

Container Diagram;

Component Diagram;

ADRs;

RFCs;

API contracts;

event contracts;

data contracts;

guardrails;

golden paths;

runbooks;

SLOs;

threat model;

operating model;

deployment metadata;

reports;

evidence.
```

Você criará:

- Living Documentation Charter;
- catálogo de documentos;
- matriz de fontes;
- owners;
- links entre artefatos;
- regras de freshness;
- validações automáticas;
- documentação como código;
- checks de divergência;
- catálogo de decisões;
- mapa de rastreabilidade;
- geração controlada;
- critérios de depreciação;
- operating model;
- reports, evidence e gate.

A próxima aula será:

```text
664 - M19.54 - Projeto arquitetura OS parte 1
```

A aula 664 iniciará o projeto aplicado de arquitetura para o domínio de Ordens de Serviço, reunindo decisões, boundaries, contratos, dados, segurança, observabilidade e governança em um caso completo.

Nesta aula, o projeto de OS aparecerá somente como ponte.

Regra central:

```text
documentacao arquitetural viva
nao e um arquivo bonito;

e um sistema de conhecimento
versionado,
rastreavel,
validavel
e conectado
ao codigo,
ao deploy
e a operacao.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
660:
Mentoria e comunicacao tecnica.

661:
Arquitetura corporativa brasileira.

662:
Governanca tecnica leve.

663:
Documentacao arquitetural viva.

664:
Projeto arquitetura OS parte 1.
```

A progressão é:

```text
desenvolver autonomia;

organizar arquitetura em escala;

governar de forma leve;

manter conhecimento sincronizado;

aplicar tudo em um projeto realista.
```

Até aqui, você já criou vários artefatos:

- ADR;
- RFC;
- C4;
- contracts;
- policies;
- runbooks;
- SLOs;
- scorecards;
- evidence;
- reports;
- gates;
- roadmaps;
- threat models;
- data catalogs;
- decision logs;
- standards;
- golden paths.

Agora o foco será organizar esse conjunto.

A pergunta deixa de ser:

```text
qual documento devemos criar?
```

E passa a ser:

```text
qual documento precisa existir,
qual fonte o alimenta,
quem responde por ele,
como ele e validado,
quando ele deixa de ser valido
e como a equipe descobre isso?
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-663-documentacao-arquitetural-viva
└── service-scheduling-living-architecture-docs
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/livingdocs
    │   │           ├── artifact
    │   │           │   ├── ArchitectureArtifact.java
    │   │           │   ├── ArtifactType.java
    │   │           │   ├── ArtifactStatus.java
    │   │           │   ├── ArtifactOwner.java
    │   │           │   └── ArtifactCatalog.java
    │   │           ├── source
    │   │           │   ├── DocumentationSource.java
    │   │           │   ├── SourceType.java
    │   │           │   ├── SourceAuthority.java
    │   │           │   └── SourceCatalog.java
    │   │           ├── freshness
    │   │           │   ├── FreshnessPolicy.java
    │   │           │   ├── FreshnessResult.java
    │   │           │   ├── ReviewTrigger.java
    │   │           │   └── StalenessDetector.java
    │   │           ├── traceability
    │   │           │   ├── TraceabilityLink.java
    │   │           │   ├── TraceabilityType.java
    │   │           │   ├── TraceabilityGraph.java
    │   │           │   └── MissingLink.java
    │   │           ├── validation
    │   │           │   ├── DocumentationRule.java
    │   │           │   ├── DocumentationFinding.java
    │   │           │   ├── DocumentationValidator.java
    │   │           │   └── ValidationResult.java
    │   │           ├── lifecycle
    │   │           │   ├── DocumentationLifecycle.java
    │   │           │   ├── DeprecationDecision.java
    │   │           │   ├── ReplacementReference.java
    │   │           │   └── RetirementPolicy.java
    │   │           ├── generation
    │   │           │   ├── GeneratedSection.java
    │   │           │   ├── GeneratedSource.java
    │   │           │   ├── GenerationBoundary.java
    │   │           │   └── GenerationManifest.java
    │   │           └── gate
    │   │               ├── LivingDocumentationGate.java
    │   │               ├── LivingDocumentationFinding.java
    │   │               └── LivingDocumentationGateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/livingdocs
    │               ├── artifact
    │               │   ├── ArtifactOwnerTest.java
    │               │   └── ArtifactStatusTest.java
    │               ├── freshness
    │               │   ├── FreshnessPolicyTest.java
    │               │   └── StalenessDetectorTest.java
    │               ├── traceability
    │               │   ├── TraceabilityCoverageTest.java
    │               │   └── MissingLinkTest.java
    │               ├── generation
    │               │   ├── GeneratedBoundaryTest.java
    │               │   └── ManualContentPreservationTest.java
    │               └── architecture
    │                   ├── LivingDocumentationBoundaryTest.java
    │                   ├── SourceAuthorityTest.java
    │                   ├── OsProjectNonAnticipationTest.java
    │                   └── DocumentationGateTest.java
    ├── documentation
    │   ├── LIVING_DOCUMENTATION_CHARTER.md
    │   ├── ARTIFACT_CATALOG.md
    │   ├── SOURCE_OF_TRUTH_MATRIX.md
    │   ├── OWNER_MATRIX.md
    │   ├── TRACEABILITY_MAP.md
    │   ├── FRESHNESS_POLICY.md
    │   ├── REVIEW_TRIGGER_CATALOG.md
    │   ├── DOCUMENTATION_LIFECYCLE.md
    │   ├── DOCUMENTATION_AS_CODE.md
    │   ├── GENERATED_CONTENT_POLICY.md
    │   ├── MANUAL_CONTENT_POLICY.md
    │   ├── C4_SYNC_POLICY.md
    │   ├── ADR_SYNC_POLICY.md
    │   ├── RFC_SYNC_POLICY.md
    │   ├── CONTRACT_SYNC_POLICY.md
    │   ├── RUNBOOK_SYNC_POLICY.md
    │   ├── SLO_SYNC_POLICY.md
    │   ├── SECURITY_DOC_SYNC_POLICY.md
    │   ├── DATA_DOC_SYNC_POLICY.md
    │   ├── OPERATING_MODEL.md
    │   ├── RETROSPECTIVE.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_DOCUMENTATION_QUESTIONS.md
    ├── contracts
    │   ├── living-documentation-contract.yaml
    │   ├── artifact-catalog-policy.yaml
    │   ├── source-authority-policy.yaml
    │   ├── owner-policy.yaml
    │   ├── freshness-policy.yaml
    │   ├── traceability-policy.yaml
    │   ├── generation-policy.yaml
    │   ├── lifecycle-policy.yaml
    │   ├── C4-sync-policy.yaml
    │   ├── ADR-sync-policy.yaml
    │   ├── RFC-sync-policy.yaml
    │   ├── contract-sync-policy.yaml
    │   ├── runbook-sync-policy.yaml
    │   ├── SLO-sync-policy.yaml
    │   ├── evidence-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── artifact-coverage-report.yaml
        ├── owner-coverage-report.yaml
        ├── freshness-report.yaml
        ├── traceability-report.yaml
        ├── generated-content-report.yaml
        ├── stale-document-report.yaml
        ├── broken-link-report.yaml
        ├── architecture-report.yaml
        └── living-documentation-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-living-architecture-docs
├── validate-living-documentation-contract.ps1
├── validate-artifact-catalog.ps1
├── validate-source-authority.ps1
├── validate-owner-coverage.ps1
├── validate-freshness-policy.ps1
├── validate-traceability-map.ps1
├── validate-generated-content.ps1
├── validate-C4-sync.ps1
├── validate-ADR-sync.ps1
├── validate-contract-sync.ps1
├── validate-runbook-sync.ps1
├── run-living-documentation-tests.ps1
├── collect-living-documentation-evidence.ps1
└── verify-living-documentation-gate.ps1
```

---

## Conceito essencial

### Documentação é um sistema de conhecimento

Um documento isolado pode ser útil.

Mas arquitetura em escala precisa de relações.

Exemplo:

```text
RFC-004
propõe
nova estratégia de confirmação.

ADR-012
registra a decisão.

C4 Container
mostra o novo boundary.

OpenAPI
mostra o contrato.

AsyncAPI
mostra o evento.

SLO Catalog
mostra o objetivo.

Runbook
mostra operação.

Fitness Function
mostra a regra.

Evidence
mostra a validação.
```

Esses artefatos formam um grafo.

Quando um muda, outros podem precisar mudar.

### Nem toda documentação possui a mesma autoridade

Exemplos:

```text
OpenAPI:
fonte autoritativa do contrato HTTP.

AsyncAPI:
fonte autoritativa do contrato de mensagens.

ADR:
fonte autoritativa da decisão arquitetural.

C4:
fonte autoritativa da representação estrutural.

deployment manifest:
fonte autoritativa do deploy desejado.

runtime inventory:
fonte observada do deploy real.

runbook:
fonte operacional de resposta.

code:
fonte executável do comportamento.
```

Um documento vivo precisa declarar sua autoridade e seus limites.

### Freshness é uma propriedade

Freshness não significa que o documento foi editado recentemente.

Significa que ele continua consistente com as fontes que representa.

Um documento alterado ontem pode estar errado.

Um ADR de três anos pode continuar válido.

Freshness depende de:

- fonte;
- mudança;
- review trigger;
- owner;
- evidência;
- status;
- substituição;
- prazo.

### Documentação viva reduz duplicação

Se um dado pode ser gerado de uma fonte confiável, evite copiá-lo manualmente.

Exemplo:

```text
versao da API:
gerada do contrato.

lista de endpoints:
gerada do OpenAPI.

versao do artefato:
gerada do manifest.

status do SLO:
gerado de report.

owner:
referenciado do catalogo.

decisao:
referenciada do ADR.
```

Conteúdo manual deve concentrar:

- contexto;
- motivação;
- trade-offs;
- interpretação;
- limites;
- instruções;
- decisões.

### Geração precisa de boundaries

Gerar tudo automaticamente cria texto sem contexto.

Editar conteúdo gerado manualmente cria perda na próxima execução.

A política deve separar:

```text
GENERATED;

MANUAL;

DERIVED;

REFERENCE.
```

Cada seção precisa saber quem pode alterá-la.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-663-documentacao-arquitetural-viva/service-scheduling-living-architecture-docs

Set-Location `
  labs/m19/aula-663-documentacao-arquitetural-viva/service-scheduling-living-architecture-docs
```

---

### 2. Criar Living Documentation Charter

Arquivo:

```text
documentation/LIVING_DOCUMENTATION_CHARTER.md
```

Conteúdo:

```markdown
# Living Documentation Charter

Contexto

Service Scheduling.

Objetivo

Manter decisoes,
diagramas,
contratos,
runbooks
e evidencias
sincronizados com o sistema real.

Principios

- source of truth explicit;
- owner explicit;
- documentation as code;
- generation with boundaries;
- freshness by evidence;
- traceability;
- no orphan artifact;
- no permanent draft;
- stale content must fail;
- retirement is part of lifecycle.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/living-documentation-contract.yaml
```

Conteúdo:

```yaml
livingDocumentation:
  context:
    Service-Scheduling

  required:
    - artifact-catalog
    - source-of-truth-matrix
    - owner-matrix
    - traceability-map
    - freshness-policy
    - review-triggers
    - lifecycle
    - documentation-as-code
    - generated-content-policy
    - manual-content-policy
    - C4-sync
    - ADR-sync
    - RFC-sync
    - contract-sync
    - runbook-sync
    - SLO-sync
    - evidence
    - gate

  forbidden:
    - ownerless-artifact
    - source-less-artifact
    - permanent-draft
    - manual-edit-in-generated-block
    - broken-reference
    - accepted-ADR-without-implementation-link
    - active-contract-without-version
    - runbook-without-owner
    - stale-diagram-without-finding
    - OS-project-deep-dive

  nextLesson:
    code:
      M19.54
```

---

### 4. Criar Artifact Catalog

Arquivo:

```text
documentation/ARTIFACT_CATALOG.md
```

Tipos:

```text
C4_CONTEXT;

C4_CONTAINER;

C4_COMPONENT;

ADR;

RFC;

OPENAPI;

ASYNCAPI;

DATA_CONTRACT;

SLO;

RUNBOOK;

THREAT_MODEL;

STANDARD;

GOLDEN_PATH;

POLICY;

REPORT;

EVIDENCE;

OPERATING_MODEL.
```

Para cada artefato:

- ID;
- tipo;
- path;
- owner;
- status;
- source;
- consumers;
- freshness rule;
- review trigger;
- replacement;
- last validation.

---

### 5. Criar Architecture Artifact

```java
package br.com.formacao.livingdocs.artifact;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

public record ArchitectureArtifact(
        String id,
        ArtifactType type,
        String path,
        ArtifactOwner owner,
        ArtifactStatus status,
        String sourceId,
        List<String> consumers,
        Instant lastValidatedAt,
        String freshnessPolicyId) {

    public ArchitectureArtifact {
        Objects.requireNonNull(id);
        Objects.requireNonNull(type);
        Objects.requireNonNull(path);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(status);
        Objects.requireNonNull(sourceId);
        consumers = List.copyOf(consumers);
        Objects.requireNonNull(lastValidatedAt);
        Objects.requireNonNull(freshnessPolicyId);
    }
}
```

---

### 6. Definir status

Status:

```text
DRAFT;

PROPOSED;

ACTIVE;

STALE;

DEPRECATED;

RETIRED;

SUPERSEDED.
```

`STALE` não significa automaticamente remover.

Significa que a confiança foi reduzida e revisão é necessária.

---

### 7. Criar Source of Truth Matrix

Arquivo:

```text
documentation/SOURCE_OF_TRUTH_MATRIX.md
```

Exemplo:

```text
Knowledge:
HTTP contract.

Authority:
OpenAPI.

Derived:
API reference;
client examples;
endpoint inventory.

Validation:
contract tests;
breaking change check.

Owner:
Scheduling API Team.
```

Outro:

```text
Knowledge:
container relationships.

Authority:
Structurizr DSL.

Derived:
rendered diagrams;
architecture portal.

Validation:
workspace compile;
runtime inventory comparison.

Owner:
Scheduling Architecture Owner.
```

---

### 8. Criar Documentation Source

```java
package br.com.formacao.livingdocs.source;

import java.util.Objects;

public record DocumentationSource(
        String id,
        SourceType type,
        String location,
        SourceAuthority authority,
        String owner,
        String versionStrategy) {

    public DocumentationSource {
        Objects.requireNonNull(id);
        Objects.requireNonNull(type);
        Objects.requireNonNull(location);
        Objects.requireNonNull(authority);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(versionStrategy);
    }
}
```

---

### 9. Definir owners

Arquivo:

```text
documentation/OWNER_MATRIX.md
```

Papéis:

```text
artifact owner:
responde pelo conteudo.

source owner:
responde pela fonte.

consumer owner:
usa o artefato.

validator owner:
mantem a verificacao.

platform owner:
mantem geracao e portal.

governance owner:
mantem policy.
```

Uma pessoa pode ocupar mais de um papel, mas a responsabilidade precisa ser explícita.

---

### 10. Criar Traceability Map

Arquivo:

```text
documentation/TRACEABILITY_MAP.md
```

Exemplo:

```text
RFC-004
-> ADR-012
-> C4-CONTAINER-002
-> OPENAPI-SCHEDULING-V3
-> EVENT-APPOINTMENT-CONFIRMED-V2
-> SLO-CONFIRMATION-001
-> RUNBOOK-CONFIRMATION-FAILURE
-> FITNESS-CONFIRMATION-LATENCY
-> EVIDENCE-RELEASE-2026-07
```

Esse mapa permite verificar impacto.

---

### 11. Criar Traceability Link

```java
package br.com.formacao.livingdocs.traceability;

import java.util.Objects;

public record TraceabilityLink(
        String sourceArtifactId,
        String targetArtifactId,
        TraceabilityType type,
        boolean mandatory,
        String rationale) {

    public TraceabilityLink {
        Objects.requireNonNull(sourceArtifactId);
        Objects.requireNonNull(targetArtifactId);
        Objects.requireNonNull(type);
        Objects.requireNonNull(rationale);
    }
}
```

Tipos:

```text
PROPOSES;

DECIDES;

IMPLEMENTS;

DESCRIBES;

VALIDATES;

OPERATES;

SUPERSEDES;

GENERATES;

REFERENCES.
```

---

### 12. Criar Freshness Policy

Arquivo:

```text
documentation/FRESHNESS_POLICY.md
```

Freshness por tipo:

```text
ADR:
revisar quando review trigger ocorrer.

RFC:
revisar ate decisao
e encerrar apos implementacao.

C4:
validar em toda mudanca estrutural.

OpenAPI:
validar em toda mudanca de endpoint.

Runbook:
revisar apos incidente,
mudanca operacional
ou a cada 90 dias.

SLO:
revisar com mudanca de jornada
ou objetivo.

Threat Model:
revisar com novo boundary,
dado ou incidente.
```

---

### 13. Criar Freshness Policy em Java

```java
package br.com.formacao.livingdocs.freshness;

import java.time.Duration;
import java.util.List;

public record FreshnessPolicy(
        String id,
        Duration maximumReviewAge,
        List<ReviewTrigger> triggers,
        boolean eventDriven,
        String owner) {

    public FreshnessPolicy {
        triggers = List.copyOf(triggers);
    }
}
```

Age não é suficiente.

`eventDriven` indica que mudanças específicas obrigam revisão.

---

### 14. Criar Review Trigger Catalog

Arquivo:

```text
documentation/REVIEW_TRIGGER_CATALOG.md
```

Triggers:

```text
new boundary;

removed container;

new API version;

event schema change;

data authority change;

new sensitive field;

new SLO;

new deployment topology;

incident;

new provider;

standard deprecation;

guardrail change;

exception approval;

major release.
```

---

### 15. Detectar staleness

```java
package br.com.formacao.livingdocs.freshness;

import br.com.formacao.livingdocs.artifact.ArchitectureArtifact;
import java.time.Clock;
import java.time.Duration;

public final class StalenessDetector {

    private final Clock clock;

    public StalenessDetector(Clock clock) {
        this.clock = clock;
    }

    public FreshnessResult evaluate(
            ArchitectureArtifact artifact,
            FreshnessPolicy policy) {

        Duration age = Duration.between(
                artifact.lastValidatedAt(),
                clock.instant());

        if (age.compareTo(
                policy.maximumReviewAge()) > 0) {

            return FreshnessResult.stale(
                    artifact.id(),
                    "MAXIMUM_REVIEW_AGE_EXCEEDED");
        }

        return FreshnessResult.fresh(
                artifact.id());
    }
}
```

O laboratório complementará idade com triggers.

---

### 16. Criar lifecycle documental

Arquivo:

```text
documentation/DOCUMENTATION_LIFECYCLE.md
```

Fluxo:

```text
identify need;

assign owner;

define source;

create;

review;

activate;

validate;

use;

update;

deprecate;

supersede;

retire.
```

Um artefato sem consumidor pode ser candidato a retirada.

---

### 17. Deprecar documento

Depreciação exige:

- motivo;
- owner;
- replacement;
- prazo;
- consumers;
- migração;
- redirects;
- remoção de links;
- status.

Não apague histórico de decisões aceitas.

Use `SUPERSEDED`.

---

### 18. Criar Retirement Policy

```java
package br.com.formacao.livingdocs.lifecycle;

import java.util.List;

public record RetirementPolicy(
        String artifactType,
        List<String> prerequisites,
        boolean preserveHistory,
        String archiveLocation,
        String owner) {

    public RetirementPolicy {
        prerequisites = List.copyOf(prerequisites);
    }
}
```

---

### 19. Criar Documentation as Code

Arquivo:

```text
documentation/DOCUMENTATION_AS_CODE.md
```

Práticas:

```text
versionar com codigo;

review em pull request;

usar formatos textuais;

validar links;

validar schemas;

gerar diagramas;

gerar referencias;

executar testes;

publicar portal;

manter historico;

usar owners;

bloquear staleness critico.
```

---

### 20. Separar conteúdo gerado e manual

Arquivo:

```text
documentation/GENERATED_CONTENT_POLICY.md
```

Markers:

```text
BEGIN GENERATED;

END GENERATED.
```

Regras:

```text
nao editar manualmente;

source declarada;

generator versionado;

output deterministico;

diff revisavel;

failure visivel;

manual content preservado.
```

---

### 21. Criar Generation Manifest

```java
package br.com.formacao.livingdocs.generation;

import java.util.List;

public record GenerationManifest(
        String generatorId,
        String generatorVersion,
        List<GeneratedSource> sources,
        List<GeneratedSection> outputs,
        String owner) {

    public GenerationManifest {
        sources = List.copyOf(sources);
        outputs = List.copyOf(outputs);
    }
}
```

---

### 22. Definir manual content policy

Arquivo:

```text
documentation/MANUAL_CONTENT_POLICY.md
```

Conteúdo manual deve responder:

- por que existe;
- qual contexto;
- qual trade-off;
- qual limite;
- quando usar;
- quando revisar;
- quem é owner.

Não copie listas geráveis.

---

### 23. Sincronizar C4

Arquivo:

```text
documentation/C4_SYNC_POLICY.md
```

Validações:

```text
workspace compila;

containers possuem owner;

relações apontam endpoints reais;

protocolos existem;

deployment nodes correspondem ao manifest;

removed service nao permanece ativo;

new service possui diagram;

boundary possui rationale;

links para ADR e RFC existem.
```

---

### 24. Comparar desired e observed architecture

Fontes:

```text
desired:
Structurizr DSL;
manifests;
ADRs.

observed:
service catalog;
runtime inventory;
telemetry;
deploy metadata.
```

Diferença pode indicar:

- deploy não documentado;
- serviço abandonado;
- relação não declarada;
- shadow dependency;
- drift;
- documentação stale.

---

### 25. Sincronizar ADR

Arquivo:

```text
documentation/ADR_SYNC_POLICY.md
```

ADRs aceitos precisam de:

- implementation link;
- code owner;
- rollout status;
- review trigger;
- supersession link;
- evidence;
- status real.

ADR aceito e nunca implementado deve ficar como:

```text
ACCEPTED_NOT_IMPLEMENTED
```

ou ser revisado.

---

### 26. Sincronizar RFC

Arquivo:

```text
documentation/RFC_SYNC_POLICY.md
```

RFC lifecycle:

```text
DRAFT;

IN_REVIEW;

ACCEPTED;

REJECTED;

IMPLEMENTING;

COMPLETED;

ABANDONED.
```

`COMPLETED` exige:

- decisão;
- implementação;
- links;
- evidence;
- documentação atualizada;
- cleanup.

---

### 27. Sincronizar contratos

Arquivo:

```text
documentation/CONTRACT_SYNC_POLICY.md
```

Contratos:

```text
OpenAPI;

AsyncAPI;

JSON Schema;

data contract;

policy contract.
```

Valide:

- versão;
- owner;
- compatibility;
- examples;
- consumers;
- deprecation;
- release;
- implementation;
- tests.

---

### 28. Sincronizar runbooks

Arquivo:

```text
documentation/RUNBOOK_SYNC_POLICY.md
```

Runbook precisa corresponder a:

- alerta;
- dashboard;
- serviço;
- dependência;
- comando;
- permissão;
- rollback;
- recovery;
- owner;
- escalation.

Comandos destrutivos devem ser claramente marcados.

---

### 29. Testar runbook

Game day:

```text
alert:
Confirmation Saga Stuck.

operator:
abre runbook.

runbook:
localiza dashboard;
consulta estado;
executa diagnostico;
aplica acao segura;
verifica recuperacao.
```

Se comando, dashboard ou permissão não existe, o runbook está stale.

---

### 30. Sincronizar SLO

Arquivo:

```text
documentation/SLO_SYNC_POLICY.md
```

Valide:

- journey existe;
- SLI query existe;
- owner existe;
- dashboard existe;
- alert existe;
- runbook existe;
- objective existe;
- window existe;
- error budget policy existe.

---

### 31. Sincronizar segurança

Arquivo:

```text
documentation/SECURITY_DOC_SYNC_POLICY.md
```

Valide:

- trust boundary atual;
- threat model atualizado;
- workload identity presente;
- authorization matrix;
- secret policy;
- audit events;
- incident runbook;
- last game day.

---

### 32. Sincronizar dados

Arquivo:

```text
documentation/DATA_DOC_SYNC_POLICY.md
```

Valide:

- authority;
- owner;
- data contract;
- quality rules;
- retention;
- lineage;
- access policy;
- migration status.

O objetivo é sincronização documental, não repetir a aula 657.

---

### 33. Criar Documentation Validator

```java
package br.com.formacao.livingdocs.validation;

import br.com.formacao.livingdocs.artifact.ArchitectureArtifact;
import java.util.ArrayList;
import java.util.List;

public final class DocumentationValidator {

    private final List<DocumentationRule> rules;

    public DocumentationValidator(
            List<DocumentationRule> rules) {

        this.rules = List.copyOf(rules);
    }

    public ValidationResult validate(
            ArchitectureArtifact artifact) {

        List<DocumentationFinding> findings =
                new ArrayList<>();

        for (DocumentationRule rule : rules) {
            rule.evaluate(artifact)
                    .ifPresent(findings::add);
        }

        return ValidationResult.from(findings);
    }
}
```

---

### 34. Criar regras

Regras mínimas:

```text
owner required;

source required;

status valid;

links valid;

replacement required for superseded;

review date required;

generated blocks unchanged;

accepted ADR linked;

active contract versioned;

runbook linked to alert;

SLO linked to owner;

critical stale blocks release.
```

---

### 35. Classificar findings

Severidades:

```text
INFO;

WARNING;

ERROR;

BLOCKER.
```

Exemplos:

```text
INFO:
documento sem consumidor recente.

WARNING:
review vence em 10 dias.

ERROR:
link quebrado.

BLOCKER:
contrato ativo sem versao;
ADR aceito sem implementation;
runbook critico stale.
```

---

### 36. Validar links

Tipos:

```text
relative file;

artifact ID;

URL permitida;

source path;

report reference;

code symbol;

dashboard reference;

runbook reference.
```

Evite URLs internas reais no laboratório.

Use referências fictícias e sanitizadas.

---

### 37. Criar matriz de atualização

Mudança:

```text
novo evento
AppointmentConfirmationRequestedV2.
```

Artefatos afetados:

```text
RFC;

ADR;

C4;

AsyncAPI;

consumer catalog;

data contract;

SLO;

runbook;

threat model;

evidence.
```

A matriz evita atualização parcial.

---

### 38. Criar trigger por diff

Exemplo:

```text
changed:
contracts/events/appointment-confirmation-v2.yaml.

required reviews:
event owner;
consumer owners;
data owner;
security owner.

required documentation:
AsyncAPI;
traceability;
C4 relation;
runbook if critical.
```

---

### 39. Testar owner ausente

Artefato:

```text
RUNBOOK-CONFIRMATION-FAILURE
```

Sem owner.

Resultado:

```text
FAIL_ARTIFACT_OWNER
```

---

### 40. Testar source ausente

Artefato:

```text
API-ENDPOINT-INVENTORY
```

Sem fonte declarada.

Resultado:

```text
FAIL_SOURCE_AUTHORITY
```

---

### 41. Testar ADR aceito sem implementação

ADR:

```text
status:
ACCEPTED.

implementation:
missing.
```

Resultado:

```text
FAIL_ADR_IMPLEMENTATION_LINK
```

---

### 42. Testar diagrama stale

C4 contém:

```text
Communication Sync Client
```

Código e runtime mostram mensageria assíncrona.

Resultado:

```text
FAIL_C4_DRIFT
```

---

### 43. Testar contrato breaking

OpenAPI remove campo sem versão ou depreciação.

Resultado:

```text
FAIL_CONTRACT_COMPATIBILITY
```

---

### 44. Testar runbook stale

Runbook aponta comando removido.

Resultado:

```text
FAIL_RUNBOOK_COMMAND
```

---

### 45. Testar edição de bloco gerado

Conteúdo entre markers foi alterado manualmente.

Resultado:

```text
FAIL_GENERATED_CONTENT_INTEGRITY
```

---

### 46. Testar documentação sem consumidor

Artefato não possui links de consumo, acesso ou uso.

Resultado:

```text
WARNING_ORPHAN_ARTIFACT
```

O owner decide atualizar, integrar ou retirar.

---

### 47. Criar portal documental

O laboratório pode publicar:

```text
C4 diagrams;

decision catalog;

contracts;

SLO catalog;

runbooks;

standards;

owners;

reports;

evidence.
```

O portal é uma view.

As fontes continuam no repositório.

---

### 48. Definir busca

Metadata:

```text
artifact ID;

title;

type;

owner;

domain;

status;

service;

decision;

contract;

tag;

last validated.
```

Busca sem metadata vira pesquisa textual imprecisa.

---

### 49. Criar Operating Model

Arquivo:

```text
documentation/OPERATING_MODEL.md
```

Defina:

- documentation owner;
- artifact owners;
- source owners;
- generator owners;
- portal owner;
- validator owner;
- review cadence;
- incident trigger;
- release trigger;
- deprecation process;
- communication;
- escalation;
- evidence owner.

---

### 50. Medir uso da documentação

Métricas:

```text
artifact owner coverage;

freshness coverage;

broken links;

stale artifacts;

orphan artifacts;

runbook usage;

time to find owner;

time to identify decision;

generation failures;

manual edit violations;

review SLA;

incident documentation gaps.
```

Não use acesso bruto como única medida de valor.

---

### 51. Criar retrospectiva

Arquivo:

```text
documentation/RETROSPECTIVE.md
```

Perguntas:

```text
qual artefato evitou retrabalho?

qual documento estava stale?

qual informacao foi duplicada?

qual fonte ficou ambigua?

qual link quebrou?

qual runbook falhou?

qual geracao removeu trabalho?

qual check gerou ruido?

qual documento pode ser retirado?

qual trigger precisa ser criado?
```

---

### 52. Criar reports

Exemplo:

```yaml
livingDocumentation:
  artifacts:
    total:
      86
    active:
      61
    stale:
      3
    deprecated:
      8
    retired:
      14

  ownership:
    coveragePercent:
      100

  sources:
    authorityCoveragePercent:
      100

  traceability:
    mandatoryLinks:
      127
    missingLinks:
      0

  freshness:
    withinPolicyPercent:
      96

  links:
    broken:
      0

  generatedContent:
    manualEditViolations:
      0

  gate:
    PASS
```

---

### 53. Criar evidence

Arquivo:

```text
contracts/living-documentation-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- artifact count;
- active artifact count;
- stale artifact count;
- deprecated artifact count;
- retired artifact count;
- owner coverage;
- source authority coverage;
- mandatory traceability link count;
- missing link count;
- freshness coverage;
- broken link count;
- generated section count;
- manual edit violation count;
- orphan artifact count;
- ADR implementation coverage;
- contract version coverage;
- runbook validation status;
- SLO sync status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- URLs privadas;
- nomes reais;
- topologia real;
- credenciais;
- tokens;
- payloads;
- incidentes reais;
- decisões confidenciais;
- detalhes do projeto de OS da aula 664.

---

### 54. Criar o Gate

O gate valida:

- charter;
- artifact catalog;
- source matrix;
- owners;
- traceability;
- freshness;
- review triggers;
- lifecycle;
- documentation as code;
- generated content;
- manual content;
- C4 sync;
- ADR sync;
- RFC sync;
- contract sync;
- runbook sync;
- SLO sync;
- security sync;
- data sync;
- operating model;
- tests;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_ARTIFACT_CATALOG;

FAIL_ARTIFACT_OWNER;

FAIL_SOURCE_AUTHORITY;

FAIL_TRACEABILITY;

FAIL_FRESHNESS;

FAIL_REVIEW_TRIGGER;

FAIL_LIFECYCLE;

FAIL_GENERATED_CONTENT;

FAIL_MANUAL_CONTENT;

FAIL_C4_SYNC;

FAIL_ADR_SYNC;

FAIL_RFC_SYNC;

FAIL_CONTRACT_SYNC;

FAIL_RUNBOOK_SYNC;

FAIL_SLO_SYNC;

FAIL_SECURITY_SYNC;

FAIL_DATA_SYNC;

FAIL_LINK;

FAIL_ORPHAN_CRITICAL_ARTIFACT;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 55. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\validate-living-documentation-contract.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-artifact-catalog.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-source-authority.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-owner-coverage.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-freshness-policy.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-traceability-map.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-generated-content.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-C4-sync.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-ADR-sync.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-contract-sync.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\validate-runbook-sync.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\run-living-documentation-tests.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\collect-living-documentation-evidence.ps1

.\scripts\m19\service-scheduling-living-architecture-docs\verify-living-documentation-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 56. Encerrar o laboratório

Confirme:

- charter;
- artifact catalog;
- source of truth matrix;
- owner matrix;
- traceability map;
- freshness policies;
- review triggers;
- lifecycle;
- deprecation;
- retirement;
- documentation as code;
- generated boundaries;
- manual content rules;
- C4 sync;
- ADR sync;
- RFC sync;
- contract sync;
- runbook sync;
- SLO sync;
- security sync;
- data sync;
- portal;
- search metadata;
- operating model;
- metrics;
- retrospective;
- reports;
- evidence;
- gate aprovado;
- projeto de OS não antecipado.

---

## Entendendo o que foi feito

### A documentação ganhou arquitetura

Você deixou de tratar documentos como arquivos isolados.

Criou catálogo, fontes, owners, links, triggers, lifecycle e gate.

### A autoridade ficou explícita

OpenAPI, AsyncAPI, ADR, C4, manifests, runtime inventory e runbooks passaram a declarar o que representam e quais limites possuem.

### Freshness deixou de ser data de edição

A validade passou a depender de fontes, eventos, owners, revisões e evidências.

### A duplicação foi reduzida

Conteúdo gerável passou a vir de fontes confiáveis.

Conteúdo manual ficou reservado para contexto, decisão, trade-off e operação.

### A documentação entrou no pipeline

Links, contracts, diagrams, owners, status, freshness e traceability passaram a ser validados.

### Drift ficou visível

Diferenças entre arquitetura desejada, código, deploy e runtime passaram a gerar findings.

### Retirada passou a fazer parte do processo

Documentos podem ser deprecados, superseded ou retired sem apagar histórico relevante.

---

## Erros comuns importantes

### Criar documento sem owner

Ninguém atualiza, revisa ou retira.

### Confiar em data de modificação

Arquivo recente pode estar errado.

### Duplicar dados geráveis

Listas de endpoints, serviços e versões ficam divergentes.

### Editar conteúdo gerado

A próxima geração apaga a mudança.

### Gerar contexto humano automaticamente

Ferramentas não substituem motivação, trade-offs e decisões.

### Manter ADR aceito sem implementação

A decisão parece ativa, mas o sistema não mudou.

### Atualizar contrato sem consumidores

Breaking changes aparecem tarde.

### Não testar runbook

O comando pode não existir quando o incidente ocorre.

### Criar portal como nova fonte

O portal deve publicar views, não competir com o repositório.

### Guardar tudo para sempre

Artefatos sem consumidor aumentam ruído.

### Antecipar o projeto de OS

A aula atual prepara o sistema documental; o projeto aplicado começa na aula 664.

---

## Comandos úteis

### Validar catálogo

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\validate-artifact-catalog.ps1
```

### Validar freshness

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\validate-freshness-policy.ps1
```

### Validar rastreabilidade

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\validate-traceability-map.ps1
```

### Validar C4

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\validate-C4-sync.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\run-living-documentation-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-living-architecture-docs\verify-living-documentation-gate.ps1
```

---

## Exercício guiado

Modele a documentação viva para:

```text
Reschedule Appointment.
```

Crie:

1. artifact catalog;
2. source matrix;
3. owner matrix;
4. traceability map;
5. freshness policy;
6. review triggers;
7. ADR link;
8. C4 link;
9. OpenAPI link;
10. event contract link;
11. SLO link;
12. runbook link;
13. generated sections;
14. validators;
15. reports;
16. gate.

Depois simule uma mudança de evento e identifique todos os artefatos afetados.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 662 e ponte para a aula 664 foram preservadas;
- laboratório `service-scheduling-living-architecture-docs` foi criado;
- Living Documentation Charter foi criado;
- Artifact Catalog foi criado;
- tipos de artefatos foram catalogados;
- cada artefato possui owner, status, fonte e freshness policy;
- Source of Truth Matrix foi criada;
- limites de autoridade foram definidos;
- Owner Matrix foi criada;
- Traceability Map foi criado;
- links obrigatórios foram definidos;
- Freshness Policy foi criada;
- freshness foi diferenciada de data de edição;
- Review Trigger Catalog foi criado;
- Staleness Detector foi implementado;
- Documentation Lifecycle foi criado;
- depreciação, supersessão e retirement foram definidos;
- Documentation as Code foi criada;
- Generated Content Policy foi criada;
- manual edit em bloco gerado foi proibido;
- Manual Content Policy foi criada;
- C4 Sync Policy foi criada;
- desired e observed architecture foram comparadas;
- ADR Sync Policy foi criada;
- ADR aceito sem implementação foi bloqueado;
- RFC Sync Policy foi criada;
- Contract Sync Policy foi criada;
- breaking changes foram validadas;
- Runbook Sync Policy foi criada;
- runbook stale foi testado;
- SLO Sync Policy foi criada;
- Security Doc Sync Policy foi criada;
- Data Doc Sync Policy foi criada;
- Documentation Validator foi criado;
- findings foram classificados;
- links foram validados;
- matriz de atualização foi criada;
- triggers por diff foram definidos;
- owner ausente foi testado;
- source ausente foi testado;
- diagrama stale foi testado;
- contrato breaking foi testado;
- bloco gerado alterado foi testado;
- artefato órfão foi detectado;
- portal foi tratado como view;
- busca por metadata foi definida;
- Operating Model foi criado;
- métricas de uso e freshness foram criadas;
- Retrospective foi criada;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- projeto de arquitetura de OS não foi antecipado.

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
  labs/m19/aula-663-documentacao-arquitetural-viva/service-scheduling-living-architecture-docs `
  scripts/m19/service-scheduling-living-architecture-docs `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|privateUrl|realIncident|realEmployee|productionTopology|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): criar documentacao arquitetural viva"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- URLs privadas;
- nomes reais;
- incidentes reais;
- decisões confidenciais;
- topologia real;
- credenciais;
- tokens;
- payloads;
- detalhes do projeto de OS da aula 664.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou documentação arquitetural viva.

Você criou:

```text
Living Documentation Charter;

Artifact Catalog;

Source of Truth Matrix;

Owner Matrix;

Traceability Map;

Freshness Policy;

Review Trigger Catalog;

Documentation Lifecycle;

Documentation as Code;

Generated Content Policy;

Manual Content Policy;

C4 Sync Policy;

ADR Sync Policy;

RFC Sync Policy;

Contract Sync Policy;

Runbook Sync Policy;

SLO Sync Policy;

Security Doc Sync Policy;

Data Doc Sync Policy;

Documentation Validator;

Operating Model;

Retrospective;

reports, evidence e gate.
```

Você comprovou que documentação viva não é sinônimo de muito texto.

Ela depende de propósito, autoridade, owner, lifecycle, links, validação, uso e retirada.

Você diferenciou conteúdo manual, gerado, derivado e referenciado.

Você conectou RFCs, ADRs, C4, contracts, SLOs, runbooks, policies, reports e evidence.

Você transformou freshness em uma propriedade verificável.

Você identificou drift entre arquitetura desejada, código, deploy e runtime.

Você também incorporou documentação ao pipeline sem tornar o portal uma nova fonte concorrente.

A próxima aula será:

```text
664 - M19.54 - Projeto arquitetura OS parte 1
```

Nela, você iniciará um projeto aplicado de arquitetura para o domínio de Ordens de Serviço, reunindo contexto, capabilities, boundaries, decisões, C4, dados, segurança, observabilidade, governança e documentação viva.

Nenhum aprofundamento completo do projeto de arquitetura de OS foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei artefatos.
- [ ] Defini fontes.
- [ ] Defini owners.
- [ ] Criei rastreabilidade.
- [ ] Defini freshness.
- [ ] Criei lifecycle.
- [ ] Separei conteúdo gerado e manual.
- [ ] Sincronizei C4, ADR e contracts.
- [ ] Validei runbooks e SLOs.
- [ ] Detectei drift.
- [ ] Criei reports.
- [ ] Executei o gate.

---

## Troubleshooting adicional

### O diagrama compila, mas está errado

Compare com runtime inventory, manifests e telemetry.

### O ADR está aceito há meses

Verifique implementação, evidence e review trigger.

### O portal mostra endpoint removido

Confirme se a página é gerada do OpenAPI atual.

### O runbook aponta comando inválido

Execute game day e revise owner, permissão e versão.

### O documento tem owner, mas ninguém atualiza

Defina trigger, SLA, gate e escalation.

### O conteúdo gerado foi alterado manualmente

Reverta e altere a fonte ou o generator.

### Existem documentos duplicados

Escolha uma autoridade e transforme os demais em references ou retire.

### O contrato mudou, mas o C4 não

Crie trigger por diff e link obrigatório.

### O score de freshness está alto, mas incidentes sofrem

Meça uso real, runbook validation e tempo para encontrar decisão.

### O time quer documentar todo método

Documente decisões, boundaries, contracts e operação, não cada detalhe transitório.

### A equipe quer iniciar o projeto de OS

Preserve o aprofundamento para a aula 664.

---

## Perguntas de revisão

1. O que é documentação arquitetural viva?
2. Por que documentação pode competir com o sistema?
3. O que é source of truth?
4. O que é Artifact Catalog?
5. Por que owner é obrigatório?
6. O que é Traceability Map?
7. O que é freshness?
8. Freshness é data de edição?
9. O que é review trigger?
10. Qual lifecycle de um artefato?
11. O que significa superseded?
12. O que é documentation as code?
13. Quando gerar conteúdo?
14. O que deve continuar manual?
15. O que é drift?
16. Como sincronizar C4?
17. Como sincronizar ADR?
18. Como sincronizar contracts?
19. Por que testar runbooks?
20. O que é orphan artifact?
21. O portal deve ser fonte?
22. O que o gate valida?
23. Quando retirar documento?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Conhecimento arquitetural versionado, validado e conectado ao sistema.
2. Porque pode divergir da realidade.
3. Fonte autoritativa de uma informação.
4. Catálogo de artefatos, owners, status e fontes.
5. Para existir responsabilidade por validade.
6. Grafo de relações entre decisões, código, contratos e operação.
7. Consistência atual com fontes e triggers.
8. Não.
9. Evento que exige revisão.
10. Criar, ativar, validar, atualizar, deprecar e retirar.
11. Substituído, com histórico preservado.
12. Documentação versionada e testada como código.
13. Quando a informação possui fonte confiável.
14. Contexto, decisão, trade-off e instrução.
15. Diferença entre estado documentado e real.
16. Comparando DSL, manifests e runtime.
17. Ligando decisão, implementação, rollout e evidence.
18. Versionando, testando compatibilidade e consumidores.
19. Para validar comandos, links, permissões e recovery.
20. Artefato sem consumidor ou relação.
21. Não, deve publicar views.
22. Catálogo, owners, sources, freshness, links e sync.
23. Quando não possui consumidor ou foi substituído.
24. Projeto arquitetura OS parte 1.
25. Projeto arquitetura OS parte 1.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 663 - M19.53 - Documentacao arquitetural viva

- Continuei após Governança técnica leve.
- Tratei documentação como sistema de conhecimento.
- Criei o laboratório `service-scheduling-living-architecture-docs`.
- Criei Living Documentation Charter.
- Criei Artifact Catalog.
- Cataloguei C4, ADR, RFC, contracts, SLOs, runbooks, policies, reports e evidence.
- Criei Source of Truth Matrix.
- Defini limites de autoridade.
- Criei Owner Matrix.
- Criei Traceability Map.
- Modelei links entre propostas, decisões, implementação, operação e validação.
- Criei Freshness Policy.
- Diferenciei freshness de data de edição.
- Criei Review Trigger Catalog.
- Implementei Staleness Detector.
- Criei Documentation Lifecycle.
- Modelei depreciação, supersessão e retirement.
- Criei Documentation as Code.
- Separei conteúdo gerado, manual, derivado e referenciado.
- Criei Generation Manifest.
- Criei C4 Sync Policy.
- Comparei desired e observed architecture.
- Criei ADR Sync Policy.
- Bloqueei ADR aceito sem implementação.
- Criei RFC Sync Policy.
- Criei Contract Sync Policy.
- Validei breaking changes.
- Criei Runbook Sync Policy.
- Testei runbook em game day.
- Criei SLO Sync Policy.
- Criei Security Doc Sync Policy.
- Criei Data Doc Sync Policy.
- Criei Documentation Validator.
- Classifiquei findings.
- Validei links e triggers por diff.
- Detectei owner ausente, source ausente, C4 drift, contract breaking e manual edit.
- Tratei portal como view.
- Criei Operating Model.
- Medi freshness, uso, links e artefatos órfãos.
- Criei Retrospective.
- Criei reports, evidence e gate.
- Não antecipei o projeto de arquitetura de OS.
- Próxima aula: Projeto arquitetura OS parte 1.
```

---

## Referência técnica curta

- Living Documentation.
- Source of Truth.
- Artifact Catalog.
- Artifact Owner.
- Traceability.
- Freshness.
- Review Trigger.
- Documentation Lifecycle.
- Documentation as Code.
- Generated Content.
- Manual Content.
- Architecture Drift.
- C4 Sync.
- ADR Sync.
- Contract Sync.
- Runbook Validation.
- Documentation Gate.

Regra final:

```text
Documentação arquitetural viva deve funcionar como um sistema de conhecimento versionado, rastreável e verificável, não como uma coleção de arquivos estáticos: cada artefato possui ID, tipo, owner, status, source of truth, consumers, freshness policy, review triggers e lifecycle, e OpenAPI, AsyncAPI, ADR, RFC, C4, manifests, runtime inventory, runbooks, SLOs, policies, reports e evidence declaram claramente o que representam; traceability conecta proposta, decisão, estrutura, contrato, implementação, operação e validação, freshness depende de fontes e eventos, não apenas de data de edição, e mudanças em boundaries, APIs, eventos, dados, deploy, SLOs, ameaças ou standards acionam revisão proporcional; conteúdo gerável vem de fontes confiáveis com boundaries e manifests, conteúdo manual preserva contexto, motivação, trade-offs e instruções, manual edit em bloco gerado é proibido, e drift entre desired architecture, código, deploy e runtime produz findings; ADRs aceitos precisam de implementação e evidence, RFCs precisam encerrar lifecycle, contratos precisam de versão e compatibilidade, runbooks precisam ser exercitados, SLOs precisam de owner, dashboard e alert, e artefatos órfãos, stale, quebrados ou substituídos são atualizados, deprecados ou retirados; o gate termina com charter, catalog, sources, owners, traceability, freshness, lifecycle, generation, C4, ADR, RFC, contracts, runbooks, SLOs, security, data, tests, reports e evidence aprovados, enquanto o projeto de arquitetura de OS permanece reservado para a aula 664.
```
