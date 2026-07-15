# 657 - M19.47 - Dados como decisao arquitetural

## Apresentação da aula

Na aula 656, você tratou segurança como decisão arquitetural.

A jornada `Confirm Appointment` passou a declarar ativos, atores, trust boundaries, ameaças, identidades humanas e de workload, autenticação, autorização, privilégio mínimo, proteção de dados, secrets, mensageria, supply chain, auditoria, observabilidade de segurança, incident response e gate.

A segurança definiu quais dados podem atravessar cada fronteira, quais campos precisam ser minimizados e quem pode executar operações críticas.

Agora a pergunta muda:

```text
quem é responsável por cada dado,
qual sistema é autoridade,
qual qualidade é necessária,
como o dado nasce,
evolui,
se distribui,
é consumido,
retido,
reconciliado
e removido?
```

Uma arquitetura pode possuir autenticação forte e ainda produzir dados contraditórios.

Pode criptografar bancos e, mesmo assim, não saber qual tabela é a fonte oficial.

Pode publicar eventos versionados, mas não possuir contrato de significado, owner, regra de compatibilidade ou lineage.

Pode manter réplicas rápidas, porém permitir que elas decidam invariantes usando estado atrasado.

Pode armazenar tudo “para o futuro”, aumentar risco, custo e complexidade, e ainda não responder às perguntas do negócio.

Dados como decisão arquitetural significa definir explicitamente:

- quais dados representam o domínio;
- qual bounded context possui autoridade sobre cada conceito;
- quem responde pela definição, qualidade e operação;
- quais consumidores existem;
- quais contratos governam leitura, escrita e eventos;
- quais níveis de consistência cada uso exige;
- como dados são distribuídos sem perder ownership;
- como versões e schemas evoluem;
- como qualidade é medida;
- como lineage e metadados permitem rastreabilidade;
- quanto tempo cada classe de dado permanece;
- como correções, backfills e migrações são executados;
- como o sistema reconcilia divergências;
- como acesso e propósito permanecem controlados;
- quais evidências bloqueiam ou liberam mudanças.

O laboratório será:

```text
labs/m19/aula-657-dados-como-decisao-arquitetural/service-scheduling-data-architecture
```

Você irá modelar a arquitetura de dados de `Service Scheduling` para:

```text
Appointment;

Capacity Reservation;

Confirmation Saga;

Customer Appointment View;

Operational Scheduling View;

Field Execution Preparation View;

Audit Timeline;

Analytics Dataset.
```

Você criará:

- Data Architecture Charter;
- catálogo de domínios e produtos de dados;
- matriz de ownership e autoridade;
- contratos de dados;
- catálogo de schemas;
- política de qualidade;
- lifecycle e retenção;
- lineage;
- classificação de consistência;
- distribuição e replicação;
- regras para leitura e escrita;
- migração e backfill;
- reconciliation e repair;
- acesso e propósito;
- observabilidade de dados;
- reports, evidence e gate.

A próxima aula será:

```text
658 - M19.48 - Custo performance e operacao
```

A aula 658 aprofundará custo, capacidade, latência, throughput, eficiência, operação e compromissos econômicos da arquitetura.

Nesta aula, custo e performance aparecerão apenas como restrições que influenciam decisões de armazenamento, retenção, replicação e acesso, sem aprofundar o modelo operacional completo.

Regra central:

```text
dado não é um efeito colateral
do código;

é um ativo arquitetural
com significado,
autoridade,
owner,
contrato,
qualidade,
lifecycle,
acesso
e evidência.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
655:
Observabilidade como decisao arquitetural.

656:
Seguranca como decisao arquitetural.

657:
Dados como decisao arquitetural.

658:
Custo performance e operacao.

659:
Lideranca tecnica.
```

A progressão é:

```text
explicar o sistema;

proteger identidades e ativos;

tratar dados como responsabilidade;

equilibrar custo, performance e operação;

liderar decisões técnicas.
```

O curso já trabalhou modelagem relacional, PostgreSQL, SQL, JPA, Hibernate, transações, índices, cache, Redis, MongoDB, eventos, Event Sourcing conceitual, consistência eventual, CAP, PACELC, multi-tenancy, mensageria, Outbox, Inbox, Saga, segurança e observabilidade.

A aula atual não repete a configuração dessas tecnologias.

O foco será combinar o conhecimento anterior para responder:

```text
qual dado pertence a quem,
quem pode modificá-lo,
como ele é distribuído,
qual qualidade precisa ter,
como evolui sem quebra
e como sua história é provada?
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-657-dados-como-decisao-arquitetural
└── service-scheduling-data-architecture
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/dataarchitecture
    │   │           ├── domain
    │   │           │   ├── DataDomain.java
    │   │           │   ├── DataAsset.java
    │   │           │   ├── DataOwner.java
    │   │           │   ├── AuthorityType.java
    │   │           │   └── DataCatalog.java
    │   │           ├── contract
    │   │           │   ├── DataContract.java
    │   │           │   ├── FieldContract.java
    │   │           │   ├── ContractVersion.java
    │   │           │   ├── CompatibilityMode.java
    │   │           │   └── ContractValidator.java
    │   │           ├── quality
    │   │           │   ├── DataQualityRule.java
    │   │           │   ├── DataQualityDimension.java
    │   │           │   ├── DataQualityFinding.java
    │   │           │   ├── DataQualityResult.java
    │   │           │   └── DataQualityGate.java
    │   │           ├── lifecycle
    │   │           │   ├── DataLifecycle.java
    │   │           │   ├── RetentionClass.java
    │   │           │   ├── RetentionPolicy.java
    │   │           │   ├── DeletionPolicy.java
    │   │           │   └── LegalHold.java
    │   │           ├── consistency
    │   │           │   ├── DataConsistencyRequirement.java
    │   │           │   ├── ReadFreshness.java
    │   │           │   ├── SourceOfTruth.java
    │   │           │   ├── ReplicaContract.java
    │   │           │   └── ReconciliationPolicy.java
    │   │           ├── lineage
    │   │           │   ├── LineageNode.java
    │   │           │   ├── LineageEdge.java
    │   │           │   ├── Transformation.java
    │   │           │   ├── LineageGraph.java
    │   │           │   └── LineageImpactAnalysis.java
    │   │           ├── migration
    │   │           │   ├── DataMigrationPlan.java
    │   │           │   ├── MigrationPhase.java
    │   │           │   ├── BackfillPlan.java
    │   │           │   ├── MigrationCheckpoint.java
    │   │           │   └── MigrationGate.java
    │   │           ├── access
    │   │           │   ├── DataAccessPurpose.java
    │   │           │   ├── DataAccessPolicy.java
    │   │           │   ├── DataConsumer.java
    │   │           │   └── DataExposureDecision.java
    │   │           └── gate
    │   │               ├── DataArchitectureGate.java
    │   │               ├── GateFinding.java
    │   │               └── GateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/dataarchitecture
    │               ├── ownership
    │               │   ├── DataOwnershipTest.java
    │               │   └── SourceOfTruthTest.java
    │               ├── contract
    │               │   ├── DataContractCompatibilityTest.java
    │               │   └── RequiredFieldEvolutionTest.java
    │               ├── quality
    │               │   ├── DataQualityRuleTest.java
    │               │   └── DataQualityGateTest.java
    │               ├── consistency
    │               │   ├── ReplicaAuthorityTest.java
    │               │   └── ReconciliationPolicyTest.java
    │               ├── lifecycle
    │               │   ├── RetentionPolicyTest.java
    │               │   └── DeletionPolicyTest.java
    │               └── architecture
    │                   ├── DataBoundaryTest.java
    │                   ├── CrossContextWriteTest.java
    │                   ├── CostPerformanceNonAnticipationTest.java
    │                   └── LeadershipNonAnticipationTest.java
    ├── data
    │   ├── DATA_ARCHITECTURE_CHARTER.md
    │   ├── DATA_DOMAIN_CATALOG.md
    │   ├── DATA_OWNERSHIP_MATRIX.md
    │   ├── SOURCE_OF_TRUTH_MAP.md
    │   ├── DATA_PRODUCT_CATALOG.md
    │   ├── DATA_CONTRACT_POLICY.md
    │   ├── SCHEMA_CATALOG.md
    │   ├── DATA_QUALITY_POLICY.md
    │   ├── CONSISTENCY_REQUIREMENTS.md
    │   ├── REPLICA_CATALOG.md
    │   ├── LINEAGE_MODEL.md
    │   ├── LIFECYCLE_POLICY.md
    │   ├── RETENTION_POLICY.md
    │   ├── ACCESS_AND_PURPOSE_POLICY.md
    │   ├── MIGRATION_POLICY.md
    │   ├── BACKFILL_POLICY.md
    │   ├── RECONCILIATION_POLICY.md
    │   ├── DATA_OBSERVABILITY.md
    │   ├── OPERATING_MODEL.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_DATA_QUESTIONS.md
    ├── contracts
    │   ├── data-architecture-contract.yaml
    │   ├── ownership-policy.yaml
    │   ├── source-of-truth-policy.yaml
    │   ├── data-contract-policy.yaml
    │   ├── schema-evolution-policy.yaml
    │   ├── data-quality-policy.yaml
    │   ├── consistency-policy.yaml
    │   ├── replica-policy.yaml
    │   ├── lineage-policy.yaml
    │   ├── lifecycle-policy.yaml
    │   ├── retention-policy.yaml
    │   ├── access-purpose-policy.yaml
    │   ├── migration-policy.yaml
    │   ├── backfill-policy.yaml
    │   ├── reconciliation-policy.yaml
    │   ├── observability-policy.yaml
    │   ├── failure-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── ownership-coverage-report.yaml
        ├── contract-compatibility-report.yaml
        ├── data-quality-report.yaml
        ├── replica-freshness-report.yaml
        ├── lineage-coverage-report.yaml
        ├── retention-compliance-report.yaml
        ├── migration-readiness-report.yaml
        ├── architecture-report.yaml
        └── data-architecture-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-data-architecture
├── validate-data-architecture-contract.ps1
├── validate-data-ownership.ps1
├── validate-source-of-truth.ps1
├── validate-data-contracts.ps1
├── validate-schema-evolution.ps1
├── validate-data-quality.ps1
├── validate-replica-policies.ps1
├── validate-lineage.ps1
├── validate-retention.ps1
├── validate-migration-readiness.ps1
├── run-data-architecture-tests.ps1
├── collect-data-architecture-evidence.ps1
└── verify-data-architecture-gate.ps1
```

---

## Conceito essencial

### Dado possui significado e autoridade

Uma coluna não é apenas um valor.

Ela representa uma decisão de domínio.

Exemplo:

```text
Appointment.status
```

Esse status influencia:

- confirmação;
- cancelamento;
- capacidade;
- execução de campo;
- comunicação;
- cobrança;
- auditoria;
- indicadores.

A autoridade sobre `Appointment.status` pertence a `Service Scheduling`.

Uma réplica, dashboard ou relatório pode exibir o status, mas não deve alterá-lo nem decidir transições.

### Ownership é responsabilidade operacional

Ownership não significa apenas “time que criou a tabela”.

O owner responde por:

- definição;
- contrato;
- qualidade;
- disponibilidade;
- segurança;
- mudança;
- documentação;
- suporte;
- incidentes;
- depreciação.

Sem owner, findings viram backlog sem decisão.

### Source of Truth não significa único armazenamento

Um dado pode existir em:

- banco transacional;
- cache;
- read model;
- índice de busca;
- data warehouse;
- lake;
- relatório;
- backup.

A pergunta é:

```text
qual representação decide o estado oficial
para este uso?
```

A resposta pode variar por atributo e contexto, mas precisa ser explícita.

### Data Contract define promessa

Contrato de dados descreve:

- significado;
- schema;
- tipos;
- obrigatoriedade;
- regras;
- qualidade;
- owner;
- versão;
- compatibilidade;
- consumidores;
- lifecycle;
- SLO.

Um evento, tabela compartilhada ou dataset sem contrato transfere risco aos consumidores.

### Qualidade depende do uso

Qualidade não é perfeição abstrata.

Ela é adequação ao uso.

Dimensões comuns:

```text
completude;

validade;

unicidade;

consistência;

acurácia;

atualidade;

integridade referencial;

rastreabilidade.
```

Um dashboard pode tolerar cinco minutos de atraso.

Uma decisão de reagendamento não pode usar reserva de capacidade desatualizada.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-657-dados-como-decisao-arquitetural/service-scheduling-data-architecture

Set-Location `
  labs/m19/aula-657-dados-como-decisao-arquitetural/service-scheduling-data-architecture
```

---

### 2. Criar Data Architecture Charter

Arquivo:

```text
data/DATA_ARCHITECTURE_CHARTER.md
```

Conteúdo:

```markdown
# Data Architecture Charter

Contexto: Service Scheduling.

Princípios:

- autoridade explícita;
- owner obrigatório;
- escrita somente no contexto responsável;
- contratos versionados;
- qualidade orientada ao uso;
- réplicas não decidem invariantes;
- lineage para transformações críticas;
- retenção por propósito;
- correção auditada;
- migração com evidência;
- acesso mínimo e justificado.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/data-architecture-contract.yaml
```

Conteúdo:

```yaml
dataArchitecture:
  context:
    Service-Scheduling

  required:
    - data-domain-catalog
    - ownership-matrix
    - source-of-truth-map
    - data-contracts
    - schema-evolution
    - quality-policy
    - consistency-requirements
    - replica-catalog
    - lineage
    - lifecycle
    - retention
    - access-purpose
    - migration-policy
    - backfill-policy
    - reconciliation
    - observability
    - tests
    - evidence
    - gate

  forbidden:
    - ownerless-critical-data
    - cross-context-direct-write
    - replica-as-authority
    - undocumented-schema-change
    - unlimited-retention
    - blind-backfill
    - silent-data-repair
    - cost-performance-deep-dive
    - technical-leadership-deep-dive

  nextLesson:
    code:
      M19.48
```

---

### 4. Criar Data Domain Catalog

Arquivo:

```text
data/DATA_DOMAIN_CATALOG.md
```

Domínios:

```text
Service Scheduling:
Appointment e lifecycle.

Capacity:
reservas e disponibilidade.

Field Execution:
preparação e execução.

Communication:
solicitações e resultados de envio.

Analytics:
medidas derivadas e históricas.

Audit:
trilha de ações e decisões.
```

Cada domínio deve registrar boundaries, owner, entidades, eventos, consumidores e armazenamento principal.

---

### 5. Criar Data Asset

```java
package br.com.formacao.dataarchitecture.domain;

import java.util.Objects;
import java.util.Set;

public record DataAsset(
        String id,
        String name,
        DataDomain domain,
        DataOwner owner,
        AuthorityType authority,
        Set<String> consumers) {

    public DataAsset {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(domain);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(authority);
        consumers = Set.copyOf(consumers);

        if (consumers.isEmpty()) {
            throw new IllegalArgumentException(
                    "Data asset must have consumers");
        }
    }
}
```

---

### 6. Criar Data Ownership Matrix

Arquivo:

```text
data/DATA_OWNERSHIP_MATRIX.md
```

Exemplo:

```text
Data Asset:
Appointment.

Business Owner:
Scheduling Product.

Technical Owner:
Scheduling Team.

Authority:
Appointment Write Store.

Allowed Writers:
Scheduling application only.

Consumers:
Customer View;
Operational View;
Field Execution;
Communication;
Analytics;
Audit.

Quality Owner:
Scheduling Team.

Incident Owner:
Scheduling on-call.
```

---

### 7. Separar owner, steward e custodian

Papéis possíveis:

```text
Business Owner:
define significado e uso.

Technical Owner:
implementa e opera.

Data Steward:
acompanha qualidade, catálogo e políticas.

Custodian:
opera armazenamento e controles técnicos.
```

---

### 8. Criar Source of Truth Map

Arquivo:

```text
data/SOURCE_OF_TRUTH_MAP.md
```

Exemplo:

```text
Concept:
Appointment lifecycle.

Authoritative representation:
Scheduling database.

Authoritative aggregate:
Appointment.

Derived representations:
Customer Appointment View;
Operational Scheduling View;
Analytics Appointment Fact.

Strong decisions:
confirm;
reschedule;
cancel.

Forbidden:
write from replica;
state transition from dashboard;
manual SQL without controlled repair.
```

---

### 9. Criar Source of Truth

```java
package br.com.formacao.dataarchitecture.consistency;

import java.util.List;
import java.util.Objects;

public record SourceOfTruth(
        String concept,
        String context,
        String storage,
        String authority,
        List<String> derivedRepresentations) {

    public SourceOfTruth {
        Objects.requireNonNull(concept);
        Objects.requireNonNull(context);
        Objects.requireNonNull(storage);
        Objects.requireNonNull(authority);
        derivedRepresentations = List.copyOf(
                derivedRepresentations);
    }
}
```

---

### 10. Definir regra de escrita

Arquivo:

```text
contracts/source-of-truth-policy.yaml
```

Conteúdo:

```yaml
sourceOfTruth:
  appointment:
    context:
      Service-Scheduling
    authority:
      Appointment-Write-Store
    allowedWriters:
      - Scheduling-Application
    directExternalWrite:
      forbidden
    replicaWrite:
      forbidden
    repair:
      controlled:
        required
```

A integração ocorre por API, command ou evento autorizado, não por escrita direta no banco alheio.

---

### 11. Criar Data Product Catalog

Arquivo:

```text
data/DATA_PRODUCT_CATALOG.md
```

Produtos de dados do laboratório:

```text
Appointment Operational View;

Customer Appointment View;

Appointment Audit Timeline;

Scheduling Analytics Dataset.
```

Cada produto possui:

- propósito;
- consumidores;
- owner;
- contrato;
- qualidade;
- atualização;
- retenção;
- acesso;
- suporte;
- depreciação.

---

### 12. Criar Data Contract

```java
package br.com.formacao.dataarchitecture.contract;

import java.util.List;
import java.util.Objects;

public record DataContract(
        String id,
        String name,
        ContractVersion version,
        String owner,
        CompatibilityMode compatibility,
        List<FieldContract> fields,
        List<String> consumers) {

    public DataContract {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(version);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(compatibility);
        fields = List.copyOf(fields);
        consumers = List.copyOf(consumers);

        if (fields.isEmpty()) {
            throw new IllegalArgumentException(
                    "Contract must contain fields");
        }
    }
}
```

---

### 13. Criar Field Contract

```java
package br.com.formacao.dataarchitecture.contract;

import java.util.Objects;

public record FieldContract(
        String name,
        String type,
        boolean required,
        String meaning,
        String classification,
        String qualityRule) {

    public FieldContract {
        Objects.requireNonNull(name);
        Objects.requireNonNull(type);
        Objects.requireNonNull(meaning);
        Objects.requireNonNull(classification);
        Objects.requireNonNull(qualityRule);
    }
}
```

O significado não pode depender apenas do nome da coluna.

---

### 14. Criar contrato do Appointment View

Arquivo:

```text
data/SCHEMA_CATALOG.md
```

Exemplo:

```text
Contract:
customer-appointment-view-v1.

Fields:
appointmentId UUID required;
status enum required;
startsAt instant required;
endsAt instant required;
lastUpdatedAt instant required;
sourceVersion long required;
syncStatus enum required.

Owner:
Scheduling Team.

Consumers:
Customer Portal.

Freshness:
maximum 3 seconds.
```

---

### 15. Definir compatibilidade

Modos:

```text
BACKWARD:
novo producer mantém consumidores antigos.

FORWARD:
consumer novo lê dados antigos.

FULL:
ambas as direções.

NONE:
migração coordenada obrigatória.
```

A escolha depende do canal e do risco.

Eventos amplamente consumidos normalmente exigem compatibilidade mais forte.

---

### 16. Validar evolução de schema

Mudanças normalmente compatíveis:

```text
adicionar campo opcional;

adicionar novo valor quando consumers toleram desconhecido;

ampliar documentação;

adicionar metadado sem alterar semântica.
```

Mudanças perigosas:

```text
renomear campo;

mudar tipo;

tornar opcional obrigatório;

mudar unidade;

mudar timezone;

reutilizar campo com novo significado;

remover valor aceito.
```

---

### 17. Criar Contract Validator

```java
package br.com.formacao.dataarchitecture.contract;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class ContractValidator {

    public List<String> validateBackwardCompatibility(
            DataContract previous,
            DataContract candidate) {

        Map<String, FieldContract> candidateFields =
                candidate.fields()
                        .stream()
                        .collect(Collectors.toMap(
                                FieldContract::name,
                                Function.identity()));

        List<String> findings = new ArrayList<>();

        for (FieldContract oldField : previous.fields()) {
            FieldContract newField = candidateFields.get(
                    oldField.name());

            if (newField == null) {
                findings.add(
                        "REMOVED_FIELD:" + oldField.name());
                continue;
            }

            if (!oldField.type().equals(newField.type())) {
                findings.add(
                        "TYPE_CHANGED:" + oldField.name());
            }
        }

        return findings;
    }
}
```

---

### 18. Criar Data Quality Policy

Arquivo:

```text
data/DATA_QUALITY_POLICY.md
```

Para cada ativo crítico, defina:

- dimensão;
- regra;
- threshold;
- frequência;
- owner;
- severidade;
- ação;
- prazo;
- evidence.

Exemplo:

```text
Asset:
Appointment Operational View.

Rule:
sourceVersion must not regress.

Threshold:
zero regressions.

Frequency:
continuous.

Action:
quarantine projection and alert.
```

---

### 19. Criar Data Quality Rule

```java
package br.com.formacao.dataarchitecture.quality;

import java.util.Objects;

public record DataQualityRule(
        String id,
        String assetId,
        DataQualityDimension dimension,
        String expression,
        double minimumPassRate,
        String severity,
        String owner) {

    public DataQualityRule {
        Objects.requireNonNull(id);
        Objects.requireNonNull(assetId);
        Objects.requireNonNull(dimension);
        Objects.requireNonNull(expression);
        Objects.requireNonNull(severity);
        Objects.requireNonNull(owner);

        if (minimumPassRate < 0 || minimumPassRate > 1) {
            throw new IllegalArgumentException(
                    "Pass rate must be between 0 and 1");
        }
    }
}
```

---

### 20. Definir regras de qualidade

Regras do laboratório:

```text
Appointment ID:
100% não nulo e único.

Status:
100% dentro do domínio conhecido.

Window:
endsAt maior que startsAt.

Source Version:
sem regressão.

Customer View Freshness:
99% dentro de 3 segundos.

Operational View Freshness:
99,5% dentro de 30 segundos.

Audit Timeline:
100% dos commands críticos representados.
```

---

### 21. Criar Quality Gate

```java
package br.com.formacao.dataarchitecture.quality;

import java.util.List;

public final class DataQualityGate {

    public DataQualityResult evaluate(
            List<DataQualityFinding> findings) {

        boolean critical = findings.stream()
                .anyMatch(finding ->
                        "CRITICAL".equals(
                                finding.severity()));

        if (critical) {
            return DataQualityResult.fail(findings);
        }

        return DataQualityResult.pass(findings);
    }
}
```

Quality gate deve bloquear release, pipeline ou publicação conforme a regra.

---

### 22. Definir consistência por uso

Arquivo:

```text
data/CONSISTENCY_REQUIREMENTS.md
```

Matriz:

```text
Confirm Appointment:
authoritative current state.

Reschedule Appointment:
authoritative state and capacity.

Customer Appointment Details:
read-your-writes;
maximum staleness 3 seconds.

Operational Search:
eventual;
maximum staleness 30 seconds.

Field Preparation:
bounded staleness 60 seconds.

Analytics:
eventual;
processing window documented.

Audit:
complete and append-oriented.
```

---

### 23. Criar Data Consistency Requirement

```java
package br.com.formacao.dataarchitecture.consistency;

import java.time.Duration;
import java.util.Objects;

public record DataConsistencyRequirement(
        String useCase,
        String mode,
        Duration maximumStaleness,
        String fallback,
        String owner) {

    public DataConsistencyRequirement {
        Objects.requireNonNull(useCase);
        Objects.requireNonNull(mode);
        Objects.requireNonNull(maximumStaleness);
        Objects.requireNonNull(fallback);
        Objects.requireNonNull(owner);
    }
}
```

Reutilize o raciocínio de consistência eventual, CAP e PACELC.

---

### 24. Criar Replica Catalog

Arquivo:

```text
data/REPLICA_CATALOG.md
```

Para cada réplica:

- purpose;
- source;
- owner;
- schema;
- version;
- checkpoint;
- target lag;
- maximum lag;
- rebuild;
- reconciliation;
- allowed use;
- forbidden use.

Réplica não é cópia anônima.

Ela possui contrato operacional.

---

### 25. Proibir réplica como autoridade

Arquivo:

```text
contracts/replica-policy.yaml
```

Conteúdo:

```yaml
replica:
  allowedFor:
    - search
    - dashboard
    - customer-view
    - analytics

  forbiddenFor:
    - domain-transition
    - expected-version
    - critical-authorization
    - capacity-reservation
    - manual-repair-source

  requires:
    - owner
    - source-version
    - freshness-budget
    - reconciliation
    - rebuild-strategy
```

---

### 26. Modelar lineage

Arquivo:

```text
data/LINEAGE_MODEL.md
```

Fluxo:

```text
Appointment Write Store
-> AppointmentConfirmed event
-> Customer View projector
-> Customer Appointment View
-> Portal API
-> Customer Portal.
```

Outro:

```text
Appointment Write Store
-> Outbox
-> broker
-> Analytics consumer
-> Appointment Fact
-> Scheduling KPI dashboard.
```

Lineage responde origem, transformação, destino, owner e impacto.

---

### 27. Criar Lineage Graph

```java
package br.com.formacao.dataarchitecture.lineage;

import java.util.List;

public record LineageGraph(
        List<LineageNode> nodes,
        List<LineageEdge> edges) {

    public LineageGraph {
        nodes = List.copyOf(nodes);
        edges = List.copyOf(edges);
    }

    public List<LineageEdge> outgoing(String nodeId) {
        return edges.stream()
                .filter(edge ->
                        edge.sourceId().equals(nodeId))
                .toList();
    }
}
```

---

### 28. Usar lineage para impacto

Antes de remover `sourceVersion`, consulte:

```text
quais views usam?

quais testes dependem?

quais dashboards consultam?

qual reconciliation usa?

qual contrato será quebrado?
```

Sem lineage, mudança de schema vira descoberta em produção.

---

### 29. Definir lifecycle

Arquivo:

```text
data/LIFECYCLE_POLICY.md
```

Estados:

```text
created;

active;

updated;

replicated;

archived;

expired;

deleted;

held.
```

Cada classe de dado possui transições e owner.

---

### 30. Criar Retention Policy

Arquivo:

```text
data/RETENTION_POLICY.md
```

Exemplo didático:

```text
Appointment operational state:
active lifecycle plus required history.

Customer view cache:
while active;
rebuildable.

Audit records:
according to legal and business policy.

Analytics raw events:
bounded retention.

Aggregated metrics:
longer retention.

Temporary migration staging:
remove after verification.
```

Não use esses prazos como política legal real.

A empresa precisa validar requisitos aplicáveis.

---

### 31. Criar Retention Class

```java
package br.com.formacao.dataarchitecture.lifecycle;

import java.time.Duration;

public record RetentionClass(
        String name,
        Duration activeRetention,
        Duration archiveRetention,
        boolean deletionRequired,
        boolean legalHoldSupported) {
}
```

---

### 32. Tratar deletion e legal hold

Regras:

```text
deleção precisa de autorização;

legal hold suspende remoção;

réplicas e backups entram no plano;

derivados precisam ser localizados por lineage;

evidence não contém dado removido;

remoção precisa ser verificável.
```

A segurança e o jurídico participam da definição.

---

### 33. Criar Access and Purpose Policy

Arquivo:

```text
data/ACCESS_AND_PURPOSE_POLICY.md
```

Para cada consumidor:

- principal;
- purpose;
- campos;
- frequência;
- volume;
- tenant;
- retenção local;
- exportação;
- owner;
- revisão.

Acesso técnico não implica direito de uso irrestrito.

---

### 34. Criar Data Access Policy

```java
package br.com.formacao.dataarchitecture.access;

import java.util.Set;

public record DataAccessPolicy(
        String consumer,
        DataAccessPurpose purpose,
        Set<String> allowedAssets,
        Set<String> allowedFields,
        String owner) {

    public DataAccessPolicy {
        allowedAssets = Set.copyOf(allowedAssets);
        allowedFields = Set.copyOf(allowedFields);
    }

    public boolean allows(
            String asset,
            String field) {

        return allowedAssets.contains(asset)
                && allowedFields.contains(field);
    }
}
```

---

### 35. Planejar migração de schema

Arquivo:

```text
data/MIGRATION_POLICY.md
```

Fluxo recomendado:

```text
expand;

write compatible;

backfill;

validate;

switch reads;

observe;

stop old writes;

contract;

remove temporary data.
```

Evite mudança destrutiva em uma única release.

---

### 36. Criar Data Migration Plan

```java
package br.com.formacao.dataarchitecture.migration;

import java.util.List;

public record DataMigrationPlan(
        String id,
        String assetId,
        String owner,
        List<MigrationPhase> phases,
        String rollback,
        String successCriteria) {

    public DataMigrationPlan {
        phases = List.copyOf(phases);
    }
}
```

---

### 37. Modelar backfill

Arquivo:

```text
data/BACKFILL_POLICY.md
```

Backfill precisa definir:

- source;
- target;
- query;
- ordering;
- batch size;
- checkpoint;
- idempotência;
- rate limit;
- concorrência;
- validação;
- retry;
- rollback;
- owner;
- janela operacional.

Backfill não é “rodar UPDATE em produção”.

---

### 38. Criar Backfill Plan

```java
package br.com.formacao.dataarchitecture.migration;

import java.time.Duration;

public record BackfillPlan(
        String id,
        String source,
        String target,
        int batchSize,
        Duration pauseBetweenBatches,
        String checkpointStrategy,
        String validationQuery,
        String owner) {

    public BackfillPlan {
        if (batchSize < 1) {
            throw new IllegalArgumentException(
                    "Batch size must be positive");
        }
    }
}
```

---

### 39. Definir reconciliation

Arquivo:

```text
data/RECONCILIATION_POLICY.md
```

Compare:

- count;
- keys;
- version;
- checksum;
- status;
- timestamps;
- missing records;
- unexpected records;
- freshness;
- transformations.

Classifique findings:

```text
expected lag;

missing projection;

schema mismatch;

value mismatch;

orphan record;

duplicate;

unauthorized write;

unknown origin.
```

---

### 40. Criar Reconciliation Policy

```java
package br.com.formacao.dataarchitecture.consistency;

import java.util.List;

public record ReconciliationPolicy(
        String sourceAsset,
        String targetAsset,
        List<String> comparisonKeys,
        String schedule,
        String repairDirection,
        String owner) {

    public ReconciliationPolicy {
        comparisonKeys = List.copyOf(comparisonKeys);
    }
}
```

Repair normalmente segue da autoridade para o derivado.

---

### 41. Proibir repair silencioso

Repair exige:

- finding;
- source of truth;
- expected version;
- autorização;
- justificativa;
- audit;
- limite;
- pós-verificação;
- relatório.

Correções frequentes indicam defeito estrutural.

---

### 42. Criar Data Observability

Arquivo:

```text
data/DATA_OBSERVABILITY.md
```

Sinais:

```text
freshness;

volume;

schema change;

quality pass rate;

null rate;

duplicate rate;

version lag;

lineage coverage;

reconciliation findings;

backfill progress;

retention failures;

unauthorized access;

ownerless assets.
```

Observabilidade de dados complementa logs, métricas e traces da aplicação.

---

### 43. Criar Operating Model

Arquivo:

```text
data/OPERATING_MODEL.md
```

Defina:

- business owner;
- technical owner;
- steward;
- platform custodian;
- contract approver;
- quality owner;
- migration owner;
- incident owner;
- retention owner;
- access reviewer;
- review frequency;
- escalation;
- deprecation process.

---

### 44. Definir triggers de revisão

Revisar arquitetura de dados quando houver:

- novo campo crítico;
- novo consumer;
- novo dataset;
- nova réplica;
- mudança de autoridade;
- mudança de schema;
- nova região;
- mudança de retenção;
- backfill;
- migração;
- novo uso analítico;
- incidente de qualidade;
- acesso cross-tenant;
- aumento relevante de volume.

---

### 45. Testar ownership

`DataOwnershipTest` valida:

- todo ativo crítico possui business owner;
- todo ativo crítico possui technical owner;
- source of truth existe;
- quality owner existe;
- incident owner existe;
- nenhum ativo possui owner genérico `team` sem identificação.

---

### 46. Testar cross-context write

Cenário:

```text
Analytics tenta atualizar
Appointment.status.
```

O teste deve falhar.

Analytics consome fatos e produz derivados.

A transição pertence a Scheduling.

---

### 47. Testar contrato compatível

Versão 1:

```text
appointmentId;
status;
startsAt;
endsAt.
```

Versão 2 adiciona:

```text
syncStatus opcional.
```

Backward compatibility deve passar.

Depois altere `startsAt` de instant para string livre.

O gate deve falhar.

---

### 48. Testar campo obrigatório

Adicione um campo obrigatório sem default e sem migração.

O teste deve gerar:

```text
BREAKING_REQUIRED_FIELD.
```

A correção pode ser:

- campo opcional inicial;
- default semântico;
- backfill;
- fase de compatibilidade;
- nova versão de contrato.

---

### 49. Testar qualidade

Introduza:

- status desconhecido;
- janela invertida;
- versão regressiva;
- registro duplicado;
- view atrasada.

Valide regra, finding, severidade, owner e ação.

---

### 50. Testar réplica

Confirme:

- réplica possui source version;
- lag é calculado;
- leitura respeita freshness budget;
- réplica não executa transição;
- rebuild é possível;
- reconciliation detecta divergência.

---

### 51. Testar lineage

Remova um campo do source contract.

A análise de impacto deve localizar:

- projector;
- Customer View;
- Portal API;
- dashboard;
- quality rule;
- reconciliation.

Lineage incompleto bloqueia mudança crítica.

---

### 52. Testar retention

Cenários:

- dado expirado;
- legal hold ativo;
- réplica não removida;
- backup fora da política;
- staging de migração esquecido;
- evidence contendo dado proibido.

O gate deve gerar findings específicos.

---

### 53. Testar backfill

Execute uma simulação com:

- 10.000 registros;
- batches de 500;
- checkpoint;
- falha no batch 7;
- restart;
- idempotência;
- validação final.

O processo deve retomar sem duplicar efeitos.

---

### 54. Testar reconciliation

Crie:

- source versão 9;
- replica versão 8;
- mesmo version com valor diferente;
- registro ausente;
- registro órfão.

Classifique e aplique a ação definida.

---

### 55. Testar acesso e propósito

Cenário:

```text
Analytics solicita
customerPhone
para calcular taxa de confirmação.
```

O acesso deve ser negado.

O propósito não exige o campo.

Use dados agregados ou pseudonimizados adequados.

---

### 56. Testar arquitetura

```java
package br.com.formacao.dataarchitecture.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

public class CrossContextWriteTest {

    @ArchTest
    static final ArchRule analyticsMustNotWriteSchedulingDomain =
            noClasses()
                    .that()
                    .resideInAPackage("..analytics..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..scheduling.write..");
}
```

---

### 57. Criar reports

Exemplo:

```yaml
dataArchitecture:
  assets:
    total:
      22
    critical:
      8
    ownerCoverage:
      1.0

  authority:
    concepts:
      14
    mapped:
      14
    crossContextWriters:
      0

  contracts:
    total:
      9
    compatible:
      9
    breaking:
      0

  quality:
    rules:
      24
    criticalFailures:
      0

  replicas:
    total:
      4
    beyondFreshnessBudget:
      0

  lineage:
    criticalCoverage:
      1.0

  retention:
    nonCompliantAssets:
      0

  gate:
    PASS
```

---

### 58. Criar evidence

Arquivo:

```text
contracts/data-architecture-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- data asset count;
- critical asset count;
- owner coverage;
- source of truth coverage;
- cross-context writer count;
- data contract count;
- compatible contract count;
- breaking contract count;
- quality rule count;
- critical quality finding count;
- replica count;
- replica beyond budget count;
- lineage critical coverage;
- retention non-compliance count;
- migration readiness status;
- reconciliation status;
- access purpose status;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- payloads;
- valores reais;
- connection strings;
- nomes privados de tabelas;
- topologia de produção;
- secrets;
- credenciais;
- custos contratuais;
- análise profunda de performance;
- conteúdo de liderança técnica.

---

### 59. Criar o Gate

O gate valida:

- charter;
- domínios;
- ativos;
- ownership;
- autoridade;
- produtos de dados;
- contratos;
- schemas;
- compatibilidade;
- qualidade;
- consistência;
- réplicas;
- lineage;
- lifecycle;
- retenção;
- acesso;
- migração;
- backfill;
- reconciliation;
- observabilidade;
- ownership operacional;
- testes;
- arquitetura;
- reports;
- evidence.

Status:

```text
PASS;

FAIL_DATA_DOMAIN;

FAIL_OWNERSHIP;

FAIL_SOURCE_OF_TRUTH;

FAIL_CROSS_CONTEXT_WRITE;

FAIL_DATA_CONTRACT;

FAIL_SCHEMA_COMPATIBILITY;

FAIL_DATA_QUALITY;

FAIL_CONSISTENCY_REQUIREMENT;

FAIL_REPLICA_POLICY;

FAIL_LINEAGE;

FAIL_LIFECYCLE;

FAIL_RETENTION;

FAIL_ACCESS_PURPOSE;

FAIL_MIGRATION;

FAIL_BACKFILL;

FAIL_RECONCILIATION;

FAIL_OBSERVABILITY;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 60. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-data-architecture\validate-data-architecture-contract.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-data-ownership.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-source-of-truth.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-data-contracts.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-schema-evolution.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-data-quality.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-replica-policies.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-lineage.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-retention.ps1

.\scripts\m19\service-scheduling-data-architecture\validate-migration-readiness.ps1

.\scripts\m19\service-scheduling-data-architecture\run-data-architecture-tests.ps1

.\scripts\m19\service-scheduling-data-architecture\collect-data-architecture-evidence.ps1

.\scripts\m19\service-scheduling-data-architecture\verify-data-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 61. Encerrar o laboratório

Confirme:

- domínios catalogados;
- ativos com owners;
- source of truth explícita;
- writers controlados;
- produtos de dados com propósito;
- contratos versionados;
- schemas compatíveis;
- regras de qualidade;
- consistência por uso;
- réplicas com budgets;
- lineage crítico;
- lifecycle e retenção;
- acesso por propósito;
- migração por fases;
- backfill idempotente;
- reconciliation e repair controlados;
- observabilidade de dados;
- Operating Model;
- reports e evidence;
- gate aprovado;
- custo, performance e operação não aprofundados;
- liderança técnica não antecipada.

---

## Entendendo o que foi feito

### O domínio ganhou autoridade explícita

`Appointment` pertence a `Service Scheduling`.

Réplicas, analytics e dashboards consomem o estado, mas não assumem o direito de modificá-lo.

### Ownership ganhou responsabilidade completa

O owner responde por significado, contrato, qualidade, acesso, mudança, operação e incidentes.

### Contratos substituíram dependências implícitas

Schemas, tipos, regras, consumidores, compatibilidade e lifecycle passaram a ser verificáveis.

### Qualidade ganhou critérios por uso

Atualidade, validade, completude e integridade são medidas conforme o risco do caso de uso.

### Distribuição ganhou limites

Cada réplica possui purpose, owner, freshness budget, rebuild e reconciliation.

### Lineage tornou mudança analisável

A equipe consegue localizar consumers e transformações antes de alterar um dado crítico.

### Lifecycle e retenção reduziram acúmulo indefinido

Dados ativos, derivados, temporários, auditáveis e analíticos receberam regras distintas.

### Migrações ganharam fases e evidências

Expand, backfill, validate, switch e contract substituíram mudanças destrutivas em uma única release.

---

## Erros comuns importantes

### Tratar banco como owner

Tecnologia armazena; domínio e equipe possuem responsabilidade.

### Compartilhar tabela para integrar serviços

A escrita direta atravessa boundaries, remove contratos e cria acoplamento de release.

### Confundir réplica com autoridade

Read model atrasado não deve decidir transição, autorização crítica ou expected version.

### Mudar schema sem consumidores conhecidos

A quebra aparece tarde porque não existe catálogo ou lineage.

### Definir qualidade como “não ter null”

Qualidade inclui semântica, atualidade, unicidade, consistência e adequação ao uso.

### Reter tudo indefinidamente

O sistema aumenta risco, custo, superfície e dificuldade de correção.

### Fazer backfill sem checkpoint

Falhas exigem reinício completo ou produzem duplicação e inconsistência.

### Corrigir dado diretamente em produção

Repair sem finding, autoridade, expected version e auditoria perde rastreabilidade.

### Criar dataset sem owner

Consumers dependem de uma oferta que ninguém suporta ou evolui.

### Antecipar custo e performance

A aula atual registra restrições; a análise operacional completa pertence à aula 658.

---

## Comandos úteis

### Validar ownership

```powershell
.\scripts\m19\service-scheduling-data-architecture\validate-data-ownership.ps1
```

### Validar contratos

```powershell
.\scripts\m19\service-scheduling-data-architecture\validate-data-contracts.ps1
```

### Validar qualidade

```powershell
.\scripts\m19\service-scheduling-data-architecture\validate-data-quality.ps1
```

### Validar lineage

```powershell
.\scripts\m19\service-scheduling-data-architecture\validate-lineage.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-data-architecture\run-data-architecture-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-data-architecture\verify-data-architecture-gate.ps1
```

---

## Exercício guiado

Escolha o conceito:

```text
Capacity Reservation
```

Crie:

1. domínio e owner;
2. source of truth;
3. allowed writers;
4. consumers;
5. data contract;
6. schema catalog;
7. quality rules;
8. consistency requirements;
9. replica catalog;
10. lineage;
11. lifecycle;
12. retention;
13. access purpose;
14. migration plan;
15. backfill plan;
16. reconciliation;
17. observability;
18. evidence;
19. gate.

Explique por que `Scheduling` pode referenciar a reserva, mas `Capacity` continua autoridade sobre sua validade.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 656 e ponte para a aula 658 foram preservadas;
- laboratório `service-scheduling-data-architecture` foi criado;
- Data Architecture Charter foi criado;
- Data Domain Catalog foi criado;
- Data Ownership Matrix foi criada;
- ativos críticos possuem business e technical owner;
- Source of Truth Map foi criado;
- writers foram limitados ao contexto responsável;
- cross-context direct write foi proibido;
- Data Product Catalog foi criado;
- Data Contracts foram criados;
- contratos possuem versão, owner, fields e consumers;
- compatibilidade foi definida;
- mudanças incompatíveis foram detectadas;
- Data Quality Policy foi criada;
- regras possuem dimensão, threshold, owner e ação;
- qualidade foi orientada ao uso;
- Consistency Requirements foram definidos;
- decisões fortes usam autoridade;
- Replica Catalog foi criado;
- réplicas possuem source version, freshness e rebuild;
- réplica não decide invariantes;
- Lineage Model foi criado;
- análise de impacto foi testada;
- Lifecycle Policy foi criada;
- Retention Policy foi criada;
- deletion e legal hold foram considerados;
- Access and Purpose Policy foi criada;
- minimização por consumidor foi aplicada;
- Migration Policy foi criada;
- expand, backfill, validate, switch e contract foram modelados;
- Backfill Policy foi criada;
- checkpoint, idempotência e rate limit foram definidos;
- Reconciliation Policy foi criada;
- repair silencioso foi proibido;
- Data Observability foi criada;
- Operating Model foi criado;
- triggers de revisão foram definidos;
- testes de ownership, contrato, qualidade, réplica, lineage, retention, backfill e reconciliation foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- custo, performance e operação não foram aprofundados;
- liderança técnica não foi antecipada.

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
  labs/m19/aula-657-dados-como-decisao-arquitetural/service-scheduling-data-architecture `
  scripts/m19/service-scheduling-data-architecture `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|customer_email|customer_phone|customer_document|connection_string|privateEndpoint|productionTopology|realTableName"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): tratar dados como decisao arquitetural"
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
- payloads reais;
- nomes privados de tabelas;
- connection strings;
- endpoints privados;
- topologia real;
- custos contratuais;
- benchmark de produção;
- conteúdo da aula 658;
- conteúdo da aula 659.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou dados como decisão arquitetural.

Você criou:

```text
Data Architecture Charter;

Data Domain Catalog;

Data Ownership Matrix;

Source of Truth Map;

Data Product Catalog;

Data Contracts;

Schema Catalog;

Data Quality Policy;

Consistency Requirements;

Replica Catalog;

Lineage Model;

Lifecycle Policy;

Retention Policy;

Access and Purpose Policy;

Migration Policy;

Backfill Policy;

Reconciliation Policy;

Data Observability;

Operating Model;

reports, evidence e gate.
```

Você comprovou que dado não pertence automaticamente ao banco, à tabela ou à equipe de plataforma.

O dado pertence a um domínio com responsabilidade explícita.

`Service Scheduling` decide o lifecycle do `Appointment`; `Capacity` decide a validade da reserva; réplicas servem usos específicos, mas não substituem autoridade; analytics produz derivados, mas não reescreve o estado operacional.

Você transformou schemas em contratos, contratos em compatibilidade verificável, qualidade em regras orientadas ao uso, distribuição em réplicas com freshness budget, lineage em análise de impacto, retenção em lifecycle controlado, acesso em propósito explícito e migração em processo por fases com backfill, checkpoint, reconciliation e evidence.

A próxima aula será:

```text
658 - M19.48 - Custo performance e operacao
```

Nela, você irá aprofundar como custo, latência, throughput, capacidade, armazenamento, rede, observabilidade, suporte, disponibilidade e carga operacional influenciam decisões de arquitetura.

Nenhum aprofundamento completo de custo, performance, operação ou liderança técnica foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei domínios e ativos.
- [ ] Defini owners e autoridade.
- [ ] Criei contratos versionados.
- [ ] Modelei qualidade por uso.
- [ ] Classifiquei consistência.
- [ ] Cataloguei réplicas.
- [ ] Criei lineage.
- [ ] Defini lifecycle e retenção.
- [ ] Modelei acesso por propósito.
- [ ] Planejei migração e backfill.
- [ ] Criei reconciliation.
- [ ] Executei reports, evidence e gate.

---

## Troubleshooting adicional

### Dois times dizem ser owner do mesmo dado

Separe significado, autoridade de escrita, stewardship e consumo. Registre a decisão em ADR quando necessário.

### O dashboard mostra valor diferente da API

Compare source version, freshness, transformação, contract version e lineage.

### Um consumer quebra após campo novo

Revise compatibilidade, tolerância a campos desconhecidos e versão do contrato.

### O backfill bloqueia o banco

Reduza batch, limite concorrência, use pausa, checkpoint e janela operacional. O aprofundamento de performance fica para a aula 658.

### A réplica está correta em versão, mas errada em valor

Compare checksum, transformação e schema. Gere finding e repair controlado.

### Ninguém sabe quem corrige o dataset

O produto de dados está sem owner operacional.

### A retenção não remove cópias derivadas

Use lineage para localizar réplicas, exports, staging e backups conforme a política.

### O time quer escrever diretamente no banco de outro serviço

Exija contrato de integração e preserve a autoridade do contexto.

### A qualidade está “verde”, mas o usuário reclama

Revise dimensões e thresholds. A métrica pode não representar adequação ao uso.

### A discussão virou custo de storage e tuning

Preserve o aprofundamento para a aula 658.

---

## Perguntas de revisão

1. O que significa tratar dados como decisão arquitetural?
2. Qual diferença entre armazenamento e autoridade?
3. O que é data ownership?
4. O que é source of truth?
5. O que é data product?
6. O que é data contract?
7. O que é compatibilidade backward?
8. Por que significado de campo deve ser documentado?
9. O que é qualidade orientada ao uso?
10. Quais dimensões de qualidade são comuns?
11. Por que réplica não deve decidir invariantes?
12. O que é freshness budget?
13. O que é data lineage?
14. Como lineage ajuda mudanças?
15. O que é lifecycle de dados?
16. Por que retenção ilimitada é problemática?
17. O que é acesso por propósito?
18. Qual sequência de migração foi usada?
19. O que um backfill precisa controlar?
20. O que é reconciliation?
21. Qual direção normal de repair?
22. O que Data Observability mede?
23. O que o gate valida?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Definir significado, autoridade, owner, contrato e lifecycle.
2. Lugar que guarda versus representação que decide.
3. Responsabilidade por definição, qualidade, acesso, mudança e operação.
4. Representação autoritativa para um conceito e uso.
5. Oferta de dados consumível com contrato e suporte.
6. Promessa versionada entre producer e consumers.
7. Producer novo mantém consumers antigos.
8. Porque nome e tipo não explicam semântica completa.
9. Dados adequados ao risco e à decisão.
10. Completude, validade, unicidade, consistência, acurácia e atualidade.
11. Porque pode estar atrasada ou derivada.
12. Atraso máximo tolerado.
13. Rastro de origem, transformação e destino.
14. Localiza consumers e impactos.
15. Nascimento, uso, arquivamento, retenção e remoção.
16. Aumenta risco, custo e complexidade.
17. Permitir campos conforme necessidade legítima.
18. Expand, backfill, validate, switch e contract.
19. Batch, checkpoint, idempotência, rate limit e validação.
20. Comparação entre autoridade e derivados.
21. Da autoridade para o derivado.
22. Freshness, volume, schema, qualidade, lineage e findings.
23. Ownership, contratos, qualidade, lifecycle, migração e evidence.
24. Custo, performance e operação.
25. Custo, performance e operação.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 657 - M19.47 - Dados como decisao arquitetural

- Continuei após Segurança como decisão arquitetural.
- Tratei dados como ativo arquitetural.
- Criei o laboratório `service-scheduling-data-architecture`.
- Criei Data Architecture Charter.
- Cataloguei domínios e ativos.
- Criei Data Ownership Matrix.
- Defini business owner, technical owner, steward e custodian.
- Criei Source of Truth Map.
- Limitei writers ao contexto responsável.
- Proibi cross-context direct write.
- Criei Data Product Catalog.
- Criei Data Contracts e Field Contracts.
- Defini versões e compatibilidade.
- Testei mudanças compatíveis e incompatíveis.
- Criei Data Quality Policy.
- Modelei completude, validade, unicidade, consistência e atualidade.
- Criei Data Quality Gate.
- Defini consistência por caso de uso.
- Criei Replica Catalog.
- Proibi réplica como autoridade.
- Criei Lineage Model e análise de impacto.
- Criei Lifecycle Policy e Retention Policy.
- Modelei deletion e legal hold.
- Criei Access and Purpose Policy.
- Criei Migration Policy.
- Modelei expand, backfill, validate, switch e contract.
- Criei Backfill Policy com checkpoint e idempotência.
- Criei Reconciliation Policy.
- Proibi repair silencioso.
- Criei Data Observability e Operating Model.
- Executei testes, reports, evidence e gate.
- Não antecipei custo, performance e operação.
- Próxima aula: Custo performance e operacao.
```

---

## Referência técnica curta

- Data Architecture.
- Data Domain.
- Data Asset.
- Data Ownership.
- Source of Truth.
- Data Product.
- Data Contract.
- Schema Evolution.
- Backward Compatibility.
- Data Quality.
- Freshness.
- Replica.
- Data Lineage.
- Data Lifecycle.
- Retention.
- Access Purpose.
- Data Migration.
- Backfill.
- Reconciliation.
- Data Observability.

Regra final:

```text
Dados devem ser tratados como ativos arquiteturais com significado, autoridade, owner, contrato, qualidade, lifecycle, acesso e evidência: Service Scheduling é autoridade do Appointment, Capacity é autoridade da reserva, réplicas e produtos de dados possuem propósito, owner, source version, freshness budget, rebuild e reconciliation, mas nunca decidem invariantes ou executam writes cruzados; cada ativo crítico possui business owner, technical owner, quality owner e incident owner, Data Contracts versionam schema, tipos, semântica, classificação, consumidores e compatibilidade, e mudanças destrutivas exigem nova versão ou migração coordenada; qualidade é orientada ao uso por completude, validade, unicidade, consistência, acurácia, atualidade e integridade, lineage conecta source, eventos, projectors, views, APIs e dashboards para permitir análise de impacto, lifecycle separa dados ativos, derivados, temporários, arquivados e removidos, retenção segue propósito e legal hold, e acesso é concedido por consumer, finalidade e campo; migrações usam expand, write compatible, backfill, validate, switch e contract, backfills são bounded, idempotentes, checkpointed e observáveis, divergências geram reconciliation findings e repair controlado da autoridade para o derivado com autorização e pós-verificação; o gate termina com domínios, ownership, source of truth, produtos, contratos, schemas, qualidade, consistência, réplicas, lineage, lifecycle, retenção, acesso, migração, backfill, reconciliation, observabilidade, testes, reports e evidence aprovados, enquanto custo, performance e operação permanecem reservados para a aula 658 e liderança técnica para a aula 659.
```
