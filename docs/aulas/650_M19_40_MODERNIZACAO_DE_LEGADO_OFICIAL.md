# 650 - M19.40 - Modernizacao de legado

## Apresentação da aula

Na aula 649, você transformou evolução arquitetural em uma sequência controlada, com estado atual, estado alvo, ondas, critérios, compatibility windows, checkpoints e gate.

Agora o problema é mais difícil:

```text
como modernizar um sistema legado
que continua sustentando o negócio,
possui conhecimento escondido,
integrações frágeis
e pouca margem para interrupção?
```

Legado não significa apenas código antigo. Um sistema recente também pode ser legado quando ninguém compreende suas decisões, mudanças simples são arriscadas, deploys falham, dados não possuem ownership e o negócio depende de especialistas específicos.

Modernização também não significa reescrever tudo. O sistema antigo contém regras implícitas, exceções operacionais e contratos que podem não estar documentados.

A modernização profissional começa pelo entendimento de capacidades, componentes, dados, dependências, riscos e comportamento. Depois, escolhe estratégias como manter, remediar, encapsular, replatformar, refatorar, rearquitetar, substituir ou retirar.

O laboratório será:

```text
labs/m19/aula-650-modernizacao-legado/service-scheduling-legacy-modernization
```

Você criará um Legacy Modernization Charter, inventário técnico e funcional, mapa de capacidades, classificação de componentes, análise de risco, baseline operacional, matriz de estratégias, roadmap, modernization waves, controles de compatibilidade, plano de dados, testes de caracterização, observabilidade, reports, evidence e gate.

O domínio continuará sendo `Service Scheduling`.

O cenário central será um monólito legado chamado `legacy-scheduling-core`, responsável por agendamento, confirmação, reagendamento, cancelamento, busca, integrações e relatórios.

A próxima aula será:

```text
651 - M19.41 - Strangler Fig
```

A aplicação detalhada do padrão Strangler Fig, com facade, roteamento progressivo, extração de capacidades, coexistência e retirada do caminho antigo, fica reservada para a aula 651.

Regra central:

```text
modernizar legado
não é trocar tecnologia;

é reduzir risco,
aumentar capacidade de mudança
e preservar o negócio
por meio de decisões graduais,
evidências,
fronteiras,
compatibilidade
e retirada planejada.
```

## Onde estamos na formação

A sequência oficial é:

```text
648 ArchUnit avancado;
649 Evolucao controlada da arquitetura;
650 Modernizacao de legado;
651 Strangler Fig;
652 Microservicos com criterio;
653 Anti patterns de microservicos.
```

A progressão é:

```text
proteger fronteiras;
controlar evolução;
avaliar e modernizar legado;
aplicar extração incremental;
decidir microserviços com critério;
reconhecer anti-patterns.
```

Na aula 649, você aprendeu a conduzir mudanças arquiteturais com ondas, checkpoints e critérios. Nesta aula, esse processo será aplicado a sistemas que possuem acoplamento histórico, conhecimento implícito, alto risco operacional e baixa testabilidade.

O foco será decidir:

- o que realmente precisa mudar;
- o que deve permanecer;
- qual risco deve ser reduzido primeiro;
- quais componentes podem ser encapsulados;
- quais capacidades podem ser extraídas;
- quais partes devem ser substituídas ou retiradas;
- como provar equivalência;
- como preservar dados e contratos;
- como impedir que a modernização vire um programa infinito.

A aula não implementará o Strangler Fig completo. Ela preparará o diagnóstico e o plano que tornarão essa estratégia possível na aula seguinte.

## Objetivo prático

Ao final, você terá construído um laboratório com quatro áreas principais:

```text
service-scheduling-legacy-modernization
├── src/main/java/br/com/formacao/legacy
│   ├── assessment
│   ├── strategy
│   ├── dependency
│   ├── characterization
│   ├── data
│   ├── roadmap
│   └── report
├── src/test/java/br/com/formacao/legacy
│   ├── assessment
│   ├── strategy
│   ├── characterization
│   ├── data
│   └── architecture
├── modernization
│   ├── diagnóstico, capacidades e inventário
│   ├── dependências, dados e integrações
│   ├── baseline, hotspots e riscos
│   ├── estratégias, compatibilidade e roadmap
│   └── operação, segurança, custo e retirada
├── contracts
│   └── políticas executáveis da modernização
└── reports
    └── inventário, readiness, riscos, evidence e gate
```

As classes principais modelarão componentes legados, avaliações, dependências, hotspots, estratégias, cenários de caracterização, ativos de dados, regras de reconciliação, ondas e gates.

Scripts:

```text
scripts/m19/service-scheduling-legacy-modernization
├── validate-legacy-modernization-contract.ps1
├── validate-business-capabilities.ps1
├── validate-legacy-inventory.ps1
├── validate-dependency-map.ps1
├── validate-operational-baseline.ps1
├── validate-hotspots.ps1
├── validate-strategy-decisions.ps1
├── validate-characterization-plan.ps1
├── validate-data-readiness.ps1
├── validate-compatibility-policy.ps1
├── validate-modernization-roadmap.ps1
├── run-legacy-modernization-tests.ps1
├── collect-legacy-modernization-evidence.ps1
└── verify-legacy-modernization-gate.ps1
```

## Conceito essencial

### Legado é uma condição, não uma idade

Um componente se torna legado quando sua capacidade de mudança é menor que a necessidade do negócio. Idade pode contribuir, mas não define sozinha o problema.

### Modernização deve reduzir risco e aumentar fluxo

A modernização precisa melhorar frequência de mudança, segurança de deploy, testabilidade, observabilidade, ownership e capacidade de atender novas necessidades.

### Estratégia depende do componente

Um mesmo sistema pode combinar partes que devem ser mantidas, encapsuladas, refatoradas, replatformadas, substituídas ou retiradas.

### Conhecimento implícito é um ativo crítico

Comportamentos não documentados, scripts manuais, regras operacionais e exceções de dados precisam ser descobertos antes de qualquer substituição.

### Equivalência precisa ser provada

Testes de caracterização, contratos, golden master, métricas e reconciliação reduzem o risco de mudar algo que ninguém compreendia por completo.

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-650-modernizacao-legado/service-scheduling-legacy-modernization

Set-Location `
  labs/m19/aula-650-modernizacao-legado/service-scheduling-legacy-modernization
```

### 2. Criar Legacy Modernization Charter

Arquivo:

```text
modernization/LEGACY_MODERNIZATION_CHARTER.md
```

Conteúdo:

```markdown
# Legacy Modernization Charter

Sistema:
legacy-scheduling-core.

Missão:
Reduzir risco operacional
e aumentar capacidade de mudança
sem interromper o fluxo
de Service Scheduling.

Princípios:
- evidência antes de estratégia;
- capacidade de negócio antes de tecnologia;
- mudança incremental;
- compatibilidade explícita;
- dados com ownership;
- comportamento caracterizado;
- retirada planejada;
- custo e risco observáveis.

Proibido:
- reescrita total sem prova;
- substituição sem baseline;
- remoção sem telemetria;
- dupla autoridade escondida;
- migração sem reconciliação;
- modernização sem owner.
```

### 3. Criar contrato principal

Arquivo:

```text
contracts/legacy-modernization-contract.yaml
```

Conteúdo:

```yaml
legacyModernization:
  context:
    Service-Scheduling

  required:
    - business-capability-map
    - legacy-inventory
    - dependency-map
    - operational-baseline
    - change-hotspots
    - component-assessment
    - strategy-per-component
    - characterization-tests
    - data-ownership
    - compatibility-policy
    - modernization-roadmap
    - decommission-policy
    - evidence
    - gate

  forbidden:
    - rewrite-everything-by-default
    - technology-only-roadmap
    - undocumented-authority
    - migration-without-reconciliation
    - retirement-without-usage-evidence
    - permanent-compatibility-layer
    - Strangler-Fig-deep-dive

  nextLesson:
    code:
      M19.41
```

### 4. Descrever o contexto do sistema

Arquivo:

```text
modernization/SYSTEM_CONTEXT.md
```

Registre:

- usuários internos e externos;
- capacidades atendidas;
- integrações;
- bancos;
- jobs;
- relatórios;
- arquivos;
- protocolos;
- janelas operacionais;
- SLAs;
- incidentes conhecidos;
- restrições legais e contratuais.

O objetivo não é produzir um documento perfeito. É criar uma visão verificável do que o sistema realmente sustenta.

### 5. Criar mapa de capacidades de negócio

Arquivo:

```text
modernization/BUSINESS_CAPABILITY_MAP.md
```

Exemplo:

```text
Capability:
Schedule Appointment.

Business criticality:
HIGH.

Primary users:
Operations and Customer Portal.

Current owner:
Service Scheduling Team.

Current implementation:
legacy-scheduling-core.

Change demand:
HIGH.

Incident impact:
HIGH.

Modernization priority:
CANDIDATE.
```

Capacidade de negócio não é endpoint nem módulo Java. É algo que a organização precisa conseguir fazer.

### 6. Separar capacidade de componente

O mesmo componente pode atender várias capacidades.

Exemplo:

```text
LegacySchedulingService:

- Schedule Appointment;
- Confirm Appointment;
- Reschedule Appointment;
- Cancel Appointment;
- Search Appointment;
- Produce Operational Report.
```

Essa concentração aumenta blast radius e dificulta ownership.

### 7. Criar inventário legado

Arquivo:

```text
modernization/LEGACY_INVENTORY.md
```

Para cada item, registre:

```text
name;
type;
owner;
technology;
runtime;
repository;
deployment;
data;
dependencies;
consumers;
change-frequency;
incident-frequency;
criticality;
knowledge-level;
support-status.
```

Inventarie aplicações, bibliotecas, bancos, filas, jobs, relatórios, scripts, planilhas operacionais e integrações manuais.

### 8. Modelar Legacy Component

```java
public record LegacyComponent(
        String id,
        String name,
        ComponentType type,
        BusinessCriticality criticality,
        ChangeFrequency changeFrequency,
        IncidentFrequency incidentFrequency,
        KnowledgeLevel knowledgeLevel,
        SupportStatus supportStatus,
        Set<String> capabilities,
        Set<String> owners) {

    public LegacyComponent {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(type);
        Objects.requireNonNull(criticality);
        Objects.requireNonNull(changeFrequency);
        Objects.requireNonNull(incidentFrequency);
        Objects.requireNonNull(knowledgeLevel);
        Objects.requireNonNull(supportStatus);
        capabilities = Set.copyOf(capabilities);
        owners = Set.copyOf(owners);
    }
}
```

### 9. Criar mapa de dependências

Arquivo:

```text
modernization/DEPENDENCY_MAP.md
```

Classifique relações como:

```text
SYNC_API;
DATABASE;
SHARED_TABLE;
FILE;
MESSAGE;
BATCH;
LIBRARY;
MANUAL_PROCESS;
REPORT;
UNKNOWN.
```

Dependência desconhecida é risco, não ausência de dependência.

### 10. Modelar Dependency Edge

```java
public record DependencyEdge(
        String source,
        String target,
        DependencyType type,
        Criticality criticality,
        boolean documented,
        boolean monitored,
        String contractOwner) {
}
```

### 11. Identificar shared database

O banco compartilhado costuma ser uma das maiores restrições.

Registre:

- tabelas acessadas por múltiplos módulos;
- writes externos;
- triggers;
- procedures;
- relatórios diretos;
- jobs;
- usuários técnicos;
- integrações por consulta direta;
- ausência de owner.

Não tente quebrar o banco antes de entender quem depende dele.

### 12. Criar catálogo de integrações

Arquivo:

```text
modernization/INTEGRATION_CATALOG.md
```

Inclua:

```text
consumer;
provider;
protocol;
contract;
authentication;
timeout;
retry;
volume;
peak;
failure-mode;
owner;
version;
deprecation-status.
```

Integrações sem owner ou sem contrato devem entrar no Risk Register.

### 13. Criar catálogo de ativos de dados

Arquivo:

```text
modernization/DATA_ASSET_CATALOG.md
```

Para cada ativo:

```text
data asset;
business meaning;
authoritative source;
writers;
readers;
retention;
classification;
quality issues;
reconciliation method;
owner.
```

### 14. Definir autoridade de dados

Exemplo:

```text
Appointment status:
legacy-scheduling-core
é autoridade atual.

Operational search index:
é derivado.

Customer portal cache:
é derivado.

Spreadsheet manual:
não é autoridade,
mesmo que seja usada operacionalmente.
```

A modernização precisa documentar quando e como a autoridade mudará.

### 15. Criar baseline operacional

Arquivo:

```text
modernization/OPERATIONAL_BASELINE.md
```

Registre:

- throughput;
- latência p50, p95 e p99;
- taxa de erro;
- disponibilidade;
- incidentes;
- MTTR;
- change failure rate;
- frequência de deploy;
- lead time;
- rollback rate;
- backlog manual;
- custo;
- tempo de onboarding;
- cobertura de testes;
- tempo para reproduzir falhas.

Sem baseline, qualquer melhoria vira opinião.

### 16. Criar baseline de mudança

Além da operação, meça a capacidade de alteração:

```text
tempo médio para mudança simples;
arquivos afetados;
módulos afetados;
quantidade de times envolvidos;
tempo de homologação;
dependência de especialista;
janela de deploy;
tempo de rollback;
taxa de retrabalho.
```

### 17. Criar Change Hotspots

Arquivo:

```text
modernization/CHANGE_HOTSPOTS.md
```

Um hotspot combina:

```text
alta frequência de mudança;
alta complexidade;
alta taxa de falha;
alta criticidade;
baixo conhecimento;
muitas dependências.
```

Nem todo código ruim é prioridade. Priorize onde custo de mudança e risco de negócio se encontram.

### 18. Modelar Hotspot

```java
public record Hotspot(
        String componentId,
        int changeFrequency,
        int complexity,
        int failureRate,
        int businessCriticality,
        int knowledgeRisk,
        int dependencyCount) {

    public int priorityScore() {
        return changeFrequency
                * complexity
                * businessCriticality
                + failureRate
                + knowledgeRisk
                + dependencyCount;
    }
}
```

A fórmula é apenas uma heurística. Os pesos precisam ser revisados pelo contexto.

### 19. Criar dimensões de avaliação

Use dimensões como:

```text
business criticality;
change demand;
operational risk;
security risk;
data risk;
coupling;
testability;
observability;
supportability;
knowledge concentration;
vendor support;
cost;
retirement potential.
```

### 20. Criar Component Assessment

```java
public record ComponentAssessment(
        String componentId,
        Map<AssessmentDimension, AssessmentScore> scores,
        Set<String> evidence,
        Set<String> unknowns,
        AssessmentStatus status) {

    public ComponentAssessment {
        scores = Map.copyOf(scores);
        evidence = Set.copyOf(evidence);
        unknowns = Set.copyOf(unknowns);
    }
}
```

### 21. Diferenciar fato, hipótese e desconhecido

Exemplo:

```text
Fato:
95% das falhas de reagendamento
passam por LegacySchedulingService.

Hipótese:
a extração reduzirá 40%
do lead time.

Desconhecido:
quantos consumidores
leem diretamente
a tabela appointment.
```

Desconhecidos devem gerar investigação, não confiança artificial.

### 22. Criar Risk Register

Arquivo:

```text
modernization/RISK_REGISTER.md
```

Inclua:

```text
risk;
trigger;
probability;
impact;
exposure;
owner;
mitigation;
contingency;
evidence;
review-date.
```

Riscos típicos:

- comportamento implícito;
- dependência desconhecida;
- dado inconsistente;
- especialista único;
- biblioteca sem suporte;
- contrato não versionado;
- efeito externo duplicado;
- janela operacional restrita;
- rollback inviável;
- custo de coexistência.

### 23. Conhecer as estratégias

Crie o enum:

```java
public enum ModernizationStrategy {
    RETAIN,
    REMEDIATE,
    ENCAPSULATE,
    REHOST,
    REPLATFORM,
    REFACTOR,
    REARCHITECT,
    REPLACE,
    RETIRE
}
```

O nome exato pode variar entre organizações. O importante é explicitar a intenção.

### 24. Comparar estratégias de modernização

Use a estratégia que ataca a restrição real:

- `RETAIN`: manter quando risco e demanda de mudança são baixos;
- `REMEDIATE`: corrigir vulnerabilidades, observabilidade, backup, deploy ou suporte;
- `ENCAPSULATE`: criar facade, adapter ou anti-corruption layer ao redor do núcleo;
- `REHOST`: mudar o ambiente com pouca alteração da aplicação;
- `REPLATFORM`: aproveitar uma plataforma suportada sem redesenhar todo o domínio;
- `REFACTOR`: melhorar a estrutura preservando comportamento;
- `REARCHITECT`: alterar fronteiras, responsabilidades e relações;
- `REPLACE`: adotar outra solução quando a capacidade não diferencia o negócio;
- `RETIRE`: remover uma capacidade ou componente comprovadamente desnecessário.

Uma aplicação pode combinar várias estratégias. Atualizar runtime não resolve acoplamento; encapsular não elimina dívida; substituir exige avaliar migração, integração e saída do fornecedor; retirar exige telemetria, retenção e remoção de consumidores.

### 25. Criar Strategy Decision

```java
public record StrategyDecision(
        String componentId,
        ModernizationStrategy strategy,
        String businessReason,
        Set<String> evidence,
        Set<String> constraints,
        Set<String> expectedOutcomes,
        Set<String> risks,
        String owner,
        LocalDate reviewDate) {
}
```

### 26. Criar matriz de estratégias

Arquivo:

```text
modernization/MODERNIZATION_STRATEGY_MATRIX.md
```

Exemplo:

```text
Component:
LegacySchedulingService.

Strategy:
ENCAPSULATE_THEN_REARCHITECT.

Reason:
high change demand,
high incident impact,
shared database,
critical business rules.

First outcome:
all external consumers
use a controlled facade.

Evidence:
change hotspot;
incident history;
dependency map;
baseline.

Review:
after compatibility gate.
```

### 27. Proibir estratégia sem evidência

Arquivo:

```text
contracts/strategy-policy.yaml
```

Conteúdo:

```yaml
strategy:
  requires:
    - component
    - business-capability
    - evidence
    - constraints
    - expected-outcomes
    - risks
    - owner
    - review-date

  rewriteEverything:
    default:
      forbidden

  technologyPreferenceOnly:
    accepted:
      false

  unknownDependency:
    action:
      INVESTIGATE_BEFORE_IRREVERSIBLE_CHANGE
```

### 28. Criar testes de caracterização

Modernizar sem compreender o comportamento é arriscado.

Teste de caracterização registra o que o sistema faz hoje, inclusive comportamentos estranhos que ainda precisam ser discutidos.

Exemplo:

```java
@Test
void shouldCaptureCurrentRescheduleBehavior() {
    CharacterizationResult result =
            legacyScheduling.reschedule(
                    scenario());

    assertThat(result.status())
            .isEqualTo("CONFIRMED");

    assertThat(result.capacityReleased())
            .isTrue();

    assertThat(result.messages())
            .containsExactly(
                    "RESCHEDULED",
                    "CUSTOMER_NOTIFIED");
}
```

Esse teste não afirma que o comportamento é ideal. Ele cria uma referência.

### 29. Criar Characterization Test Plan

Arquivo:

```text
modernization/CHARACTERIZATION_TEST_PLAN.md
```

Priorize:

- fluxos críticos;
- regras com maior mudança;
- incidentes recorrentes;
- efeitos externos;
- cálculos;
- relatórios legais;
- contratos consumidos;
- manipulação de dados;
- cenários de erro;
- recovery.

### 30. Criar Golden Master

Golden master captura saída conhecida para comparação.

```java
public record GoldenMaster(
        String scenarioId,
        String normalizedInput,
        String normalizedOutput,
        String checksum,
        Instant capturedAt) {
}
```

Normalize campos variáveis como timestamps, IDs aleatórios e ordem irrelevante.

### 31. Não transformar bug em contrato eterno

Classifique diferenças como:

```text
EXPECTED_EQUIVALENCE;
ACCEPTED_IMPROVEMENT;
KNOWN_LEGACY_DEFECT;
UNEXPLAINED_DIFFERENCE;
BLOCKING_DIFFERENCE.
```

Um comportamento antigo só deve ser preservado quando o negócio realmente depende dele.

### 32. Capturar contratos

Crie snapshots de:

- APIs;
- eventos;
- arquivos;
- relatórios;
- schemas;
- códigos de erro;
- headers;
- regras de ordenação;
- campos opcionais;
- timeouts observados.

### 33. Criar contract snapshot

```java
public record ContractSnapshot(
        String contractId,
        String version,
        String schemaHash,
        Set<String> consumers,
        CompatibilityMode compatibilityMode) {
}
```

### 34. Criar data readiness

A modernização pode falhar mesmo quando o código está correto.

Avalie:

- ownership;
- qualidade;
- duplicidade;
- chaves;
- referências órfãs;
- timestamps;
- histórico;
- retenção;
- classificação;
- volume;
- crescimento;
- backup;
- restore;
- reconciliação;
- dependências de leitura e escrita.

### 35. Modelar Data Migration Readiness

```java
public record DataMigrationReadiness(
        String dataAsset,
        boolean ownerDefined,
        boolean qualityMeasured,
        boolean reconciliationDefined,
        boolean rollbackDefined,
        boolean retentionDefined,
        Set<String> blockers) {

    public boolean ready() {
        return ownerDefined
                && qualityMeasured
                && reconciliationDefined
                && rollbackDefined
                && retentionDefined
                && blockers.isEmpty();
    }
}
```

### 36. Criar Data Modernization Plan

Arquivo:

```text
modernization/DATA_MODERNIZATION_PLAN.md
```

Inclua:

```text
current authority;
target authority;
readers;
writers;
schema changes;
backfill;
validation;
reconciliation;
cutover;
rollback;
retention;
archive;
deletion;
owner.
```

### 37. Criar regras de reconciliação

```java
public record ReconciliationRule(
        String ruleId,
        String sourceQuery,
        String targetQuery,
        String comparison,
        BigDecimal tolerance,
        Severity severity) {
}
```

Compare contagem, soma, estado, versão, checksum e regras de negócio relevantes.

### 38. Criar Compatibility Policy

Arquivo:

```text
modernization/COMPATIBILITY_POLICY.md
```

Defina:

- quais contratos coexistirão;
- por quanto tempo;
- qual caminho é autoritativo;
- como divergências serão detectadas;
- como consumidores serão migrados;
- como a remoção será aprovada;
- qual rollback existe;
- quais métricas encerram a janela.

### 39. Proibir camada de compatibilidade permanente

Arquivo:

```text
contracts/compatibility-policy.yaml
```

Conteúdo:

```yaml
compatibility:
  requires:
    - owner
    - start-date
    - end-date
    - authoritative-path
    - consumers
    - telemetry
    - removal-criteria

  permanentLayer:
    forbidden

  hiddenDualAuthority:
    forbidden

  consumerWithoutMigrationPlan:
    action:
      FAIL
```

### 40. Criar roadmap por resultado

Arquivo:

```text
modernization/ROADMAP.md
```

Organize por outcomes:

```text
Wave 1:
make behavior observable.

Wave 2:
characterize critical flows.

Wave 3:
establish controlled boundaries.

Wave 4:
reduce shared-database writes.

Wave 5:
move selected capability.

Wave 6:
retire obsolete path.
```

A implementação detalhada da extração progressiva será feita na aula 651.

### 41. Criar Modernization Wave

```java
public record ModernizationWave(
        String id,
        String outcome,
        Set<String> capabilities,
        Set<String> components,
        Set<String> dependencies,
        WaveEntryCriteria entryCriteria,
        WaveExitCriteria exitCriteria,
        String owner,
        RiskLevel riskLevel) {
}
```

### 42. Definir entry criteria

Exemplos:

- baseline coletada;
- owner definido;
- contratos conhecidos;
- testes de caracterização aprovados;
- dependências críticas mapeadas;
- rollback validado;
- dados reconciliáveis;
- SLO definido;
- janela aprovada.

### 43. Definir exit criteria

Exemplos:

- comportamento equivalente ou diferença aprovada;
- métricas dentro do limite;
- consumidores migrados;
- divergências abaixo do threshold;
- incidentes críticos zerados;
- runbook validado;
- caminho antigo sem uso;
- decommission readiness aprovado.

### 44. Criar custo de coexistência

Arquivo:

```text
modernization/COST_MODEL.md
```

Meça:

- infraestrutura duplicada;
- desenvolvimento;
- suporte;
- observabilidade;
- operação;
- testes;
- sincronização;
- incidentes;
- licenças;
- treinamento;
- custo de atraso;
- custo de oportunidade.

Coexistência longa pode custar mais que a modernização.

### 45. Criar Operating Model

Arquivo:

```text
modernization/OPERATING_MODEL.md
```

Registre:

- patrocinador;
- owner técnico;
- owner de negócio;
- data owner;
- security reviewer;
- platform owner;
- operação;
- incident commander;
- gate authority;
- frequência de revisão;
- escalonamento;
- comunicação.

Modernização sem ownership organizacional tende a parar no meio.

### 46. Criar Observability

Arquivo:

```text
modernization/OBSERVABILITY.md
```

Observe:

- uso por capacidade;
- chamadas por consumidor;
- dependências;
- erros;
- latência;
- efeitos externos;
- divergências;
- fallback;
- tráfego legado e novo;
- change failure rate;
- lead time;
- rollback;
- uso de caminhos em depreciação;
- custo de coexistência.

### 47. Criar Security Policy

Arquivo:

```text
modernization/SECURITY_POLICY.md
```

Inclua:

- classificação de dados;
- autenticação;
- autorização;
- secrets;
- criptografia;
- trilha de auditoria;
- privilégio mínimo;
- bibliotecas sem suporte;
- vulnerabilidades;
- segregação de funções;
- retenção;
- descarte seguro;
- risco durante coexistência.

Modernização não pode abrir uma segunda superfície sem controle.

### 48. Criar Decommission Policy

Arquivo:

```text
modernization/DECOMMISSION_POLICY.md
```

Conteúdo mínimo:

```text
usage is zero or approved;
consumers removed;
data archived;
retention satisfied;
contracts deprecated;
jobs disabled;
credentials revoked;
traffic blocked;
dashboards updated;
alerts removed;
runbook archived;
rollback window closed;
owner approved.
```

### 49. Modelar decisão de retirada

```java
public record DecommissionDecision(
        String componentId,
        boolean noActiveConsumers,
        boolean dataPreserved,
        boolean legalRetentionSatisfied,
        boolean credentialsRevoked,
        boolean rollbackWindowClosed,
        Set<String> approvals) {

    public boolean approved() {
        return noActiveConsumers
                && dataPreserved
                && legalRetentionSatisfied
                && credentialsRevoked
                && rollbackWindowClosed
                && !approvals.isEmpty();
    }
}
```

### 50. Criar Open Questions

Arquivo:

```text
modernization/OPEN_QUESTIONS.md
```

Pergunte:

- quais regras existem apenas na operação?
- quem lê o banco diretamente?
- quais consumers não aparecem na documentação?
- que dados possuem problemas conhecidos?
- qual capacidade muda mais?
- qual incidente mais afeta o negócio?
- onde existe especialista único?
- qual caminho não pode ficar indisponível?
- quais efeitos externos não podem duplicar?
- quais contratos podem ser descontinuados?
- qual custo de coexistência é aceitável?
- o que pode ser retirado sem substituir?

### 51. Criar Decision Log

Arquivo:

```text
modernization/DECISION_LOG.md
```

Registre decisões menores da avaliação:

```text
date;
decision;
reason;
evidence;
owner;
review-condition.
```

Decisões arquiteturais relevantes ainda devem gerar ADR.

### 52. Criar política de avaliação

Arquivo:

```text
contracts/assessment-policy.yaml
```

Conteúdo:

```yaml
assessment:
  requiredDimensions:
    - business-criticality
    - change-demand
    - operational-risk
    - security-risk
    - data-risk
    - coupling
    - testability
    - observability
    - knowledge-risk
    - retirement-potential

  unknown:
    acceptedAsZeroRisk:
      false

  evidence:
    required

  specialistOpinionOnly:
    sufficient:
      false
```

### 53. Criar política de caracterização

Arquivo:

```text
contracts/characterization-policy.yaml
```

Conteúdo:

```yaml
characterization:
  criticalFlows:
    required

  includes:
    - success
    - validation-error
    - dependency-failure
    - timeout
    - retry
    - duplicate
    - recovery
    - external-effect

  unexplainedDifference:
    action:
      BLOCK

  knownLegacyDefect:
    requires:
      - business-decision
      - expected-new-behavior
      - evidence
```

### 54. Criar política de dados

Arquivo:

```text
contracts/data-policy.yaml
```

Conteúdo:

```yaml
data:
  requires:
    - authoritative-source
    - owner
    - readers
    - writers
    - quality-baseline
    - reconciliation
    - retention
    - rollback-or-roll-forward

  migrationWithoutReconciliation:
    forbidden

  unknownWriter:
    action:
      BLOCK_AUTHORITY_CHANGE
```

### 55. Criar Non-Anticipation Policy

Arquivo:

```text
contracts/non-anticipation-policy.yaml
```

Conteúdo:

```yaml
nonAnticipation:
  lesson651:
    forbidden:
      - complete-Strangler-Fig-routing
      - facade-cutover-implementation
      - capability-by-capability-extraction
      - progressive-traffic-switch
      - legacy-route-retirement-execution

  lesson652:
    forbidden:
      - microservice-extraction-decision-framework
      - independent-deployability-deep-dive
      - service-boundary-scoring

  allowed:
    - modernization-assessment
    - strategy-selection
    - characterization
    - compatibility-planning
    - roadmap
    - decommission-policy
```

### 56. Testar inventário, estratégia e caracterização

Os testes devem provar que:

- componentes críticos possuem owner e capabilities;
- dependências desconhecidas aparecem como risco;
- código complexo, mas estável, não vira prioridade automaticamente;
- componente crítico, alterado e incidente sobe no ranking;
- reescrita ou rearchitecture são rejeitadas sem caracterização;
- golden master normaliza timestamps, IDs e ordem irrelevante;
- diferenças não explicadas bloqueiam o gate;
- contratos registram schema, campos, erros, consumidores e owner;
- data readiness falha sem authority, qualidade, reconciliação ou recuperação;
- retirada falha quando existe tráfego, job, credencial, consumidor ou retenção pendente.

Exemplo:

```java
@Test
void shouldRejectLargeChangeWithoutEvidence() {
    StrategyDecision decision =
            selector.select(
                    candidateWithoutCharacterization());

    assertThat(decision.constraints())
            .contains(
                    "CHARACTERIZATION_REQUIRED");
}
```

### 57. Testar arquitetura

```java
@ArchTest
static final ArchRule strategyMustDependOnAssessment =
        classes()
                .that()
                .resideInAPackage(
                        "..strategy..")
                .should()
                .onlyDependOnClassesThat()
                .resideInAnyPackage(
                        "..strategy..",
                        "..assessment..",
                        "java..");
```

A regra impede que uma estratégia seja escolhida diretamente por detalhes de adapter ou framework.

### 58. Criar reports

Exemplo:

```yaml
legacyModernization:
  components:
    total:
      24

    critical:
      7

    unknownOwner:
      2

    unsupportedRuntime:
      3

  dependencies:
    total:
      61

    undocumented:
      8

    sharedDatabase:
      12

  hotspots:
    high:
      4

  strategies:
    retain:
      5

    remediate:
      4

    encapsulate:
      6

    refactor:
      3

    rearchitect:
      2

    replace:
      1

    retire:
      3

  characterization:
    criticalFlowCoveragePercent:
      84

    unexplainedDifferences:
      0

  data:
    readyAssets:
      5

    blockedAssets:
      2

  result:
    READY_WITH_BLOCKERS
```

### 59. Criar gate

O gate valida:

- charter;
- capacidades;
- inventário;
- dependências;
- baseline;
- hotspots;
- riscos;
- estratégias;
- caracterização;
- contratos;
- dados;
- compatibilidade;
- roadmap;
- ownership;
- observabilidade;
- segurança;
- custo;
- retirada;
- testes;
- evidence.

Status:

```text
PASS;

READY_WITH_BLOCKERS;

FAIL_CAPABILITY_MAP;

FAIL_INVENTORY;

FAIL_DEPENDENCY_MAP;

FAIL_BASELINE;

FAIL_HOTSPOT_ANALYSIS;

FAIL_STRATEGY_EVIDENCE;

FAIL_CHARACTERIZATION;

FAIL_DATA_READINESS;

FAIL_COMPATIBILITY;

FAIL_ROADMAP;

FAIL_SECURITY;

FAIL_DECOMMISSION;

FAIL_TEST;

INCONCLUSIVE.
```

### 60. Coletar evidence

Arquivo:

```text
contracts/legacy-modernization-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- component count;
- critical component count;
- unknown owner count;
- undocumented dependency count;
- hotspot count;
- strategy distribution;
- characterization coverage;
- unexplained difference count;
- data readiness count;
- risk count;
- roadmap wave count;
- decommission candidate count;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- credenciais;
- endpoints privados;
- nomes reais de clientes;
- diagramas de produção;
- connection strings;
- detalhes exploráveis de vulnerabilidade.

### 61. Executar validação completa

Execute:

```powershell
.\scripts\m19\service-scheduling-legacy-modernizationalidate-legacy-modernization-contract.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-business-capabilities.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-legacy-inventory.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-dependency-map.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-operational-baseline.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-hotspots.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-strategy-decisions.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-characterization-plan.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-data-readiness.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-compatibility-policy.ps1

.\scripts\m19\service-scheduling-legacy-modernizationalidate-modernization-roadmap.ps1

.\scripts\m19\service-scheduling-legacy-modernization
un-legacy-modernization-tests.ps1

.\scripts\m19\service-scheduling-legacy-modernization\collect-legacy-modernization-evidence.ps1

.\scripts\m19\service-scheduling-legacy-modernizationerify-legacy-modernization-gate.ps1
```

Ou execute os testes Java:

```powershell
mvn test
```

Finalize:

```powershell
git diff --check

git status
```

### 62. Encerrar o laboratório

Confirme:

- charter criado;
- capacidades mapeadas;
- inventário completo;
- dependências conhecidas ou classificadas como risco;
- ativos de dados com owner;
- baseline operacional e de mudança;
- hotspots priorizados;
- riscos registrados;
- estratégias decididas por componente;
- reescrita total não foi assumida;
- testes de caracterização existem;
- golden master normalizado;
- contratos capturados;
- diferenças não explicadas bloqueiam;
- data readiness validada;
- compatibilidade possui prazo;
- roadmap usa outcomes;
- ondas possuem entry e exit criteria;
- custo de coexistência foi estimado;
- observabilidade foi definida;
- segurança foi revisada;
- retirada possui critérios;
- evidence e gate foram produzidos;
- Strangler Fig não foi aprofundado.

## Entendendo o que foi feito

### O legado ganhou um diagnóstico verificável

O sistema deixou de ser tratado como uma caixa-preta homogênea. Capacidades, componentes, dependências, dados, integrações, riscos e hotspots passaram a ser observáveis.

### A estratégia deixou de ser uma preferência tecnológica

Cada componente recebeu uma estratégia compatível com criticidade, demanda de mudança, risco, testabilidade, custo, dependências e potencial de retirada.

### O comportamento ganhou proteção

Testes de caracterização, golden master e snapshots de contrato criaram evidências antes da mudança.

### Dados e compatibilidade ganharam ownership

Authority, writers, readers, qualidade, reconciliação, retenção e compatibility windows passaram a fazer parte do plano.

### A modernização ganhou começo, meio e fim

Roadmap, ondas, critérios, custo de coexistência e política de decommission impedem que a transição se torne permanente.

## Erros comuns importantes

### Chamar todo código antigo de lixo

O legado pode conter regras essenciais e conhecimento que ninguém documentou.

### Reescrever tudo

A organização perde feedback, acumula risco e descobre regras tarde demais.

### Modernizar pela versão da tecnologia

Atualizar framework pode ser útil, mas não resolve automaticamente fronteiras, dados, ownership ou fluxo de mudança.

### Avaliar apenas código

Jobs, bancos, relatórios, scripts, integrações e processos manuais também fazem parte do sistema.

### Ignorar consumidores desconhecidos

A ausência de documentação não significa ausência de uso.

### Migrar dados sem reconciliação

A aplicação pode funcionar enquanto os números divergem silenciosamente.

### Manter dupla autoridade

Dois caminhos decidindo o mesmo estado geram conflitos e efeitos contraditórios.

### Criar camada de compatibilidade eterna

A dívida muda de lugar e o custo de coexistência cresce.

### Retirar sem telemetria

Consumidores invisíveis aparecem somente depois da interrupção.

### Não reservar capacidade organizacional

Modernização disputa espaço com produto, operação e incidentes; sem sponsorship e ownership, ela para.

## Comandos úteis

### Validar inventário

```powershell
.\scripts\m19\service-scheduling-legacy-modernization\validate-legacy-inventory.ps1
```

### Validar estratégias

```powershell
.\scripts\m19\service-scheduling-legacy-modernization\validate-strategy-decisions.ps1
```

### Validar caracterização

```powershell
.\scripts\m19\service-scheduling-legacy-modernization\validate-characterization-plan.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-legacy-modernization\run-legacy-modernization-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-legacy-modernization\verify-legacy-modernization-gate.ps1
```

## Exercício guiado

Avalie o `legacy-scheduling-core`.

1. Mapeie capacidades.
2. Inventarie componentes, bancos, jobs, integrações e relatórios.
3. Identifique dependências desconhecidas.
4. Colete baseline operacional e de mudança.
5. Priorize hotspots.
6. Avalie risco, criticidade, testabilidade e knowledge risk.
7. Escolha uma estratégia por componente.
8. Crie testes de caracterização para confirmação, reagendamento e cancelamento.
9. Capture contratos.
10. Defina authority e data readiness.
11. Crie compatibility windows.
12. Organize modernization waves.
13. Defina critérios de retirada.
14. Gere reports, evidence e gate.

## Critérios de aceite

- arquivo, H1, número, módulo e título seguem a grade oficial;
- continuidade com a aula 649 e ponte para a aula 651 foram preservadas;
- o laboratório `service-scheduling-legacy-modernization` foi criado;
- charter, mapa de capacidades, inventário, dependências, integrações e dados existem;
- autoridade atual, owners, baseline operacional e baseline de mudança foram definidos;
- hotspots, riscos, fatos, hipóteses e unknowns foram registrados;
- cada componente recebeu estratégia apoiada por evidência;
- reescrita total e decisão por preferência tecnológica foram proibidas;
- testes de caracterização, golden master e snapshots de contrato existem;
- diferenças não explicadas bloqueiam;
- defeitos legados exigem decisão explícita;
- data readiness inclui qualidade, reconciliação, retenção e recuperação;
- compatibility windows possuem prazo, telemetria e critérios de remoção;
- dupla autoridade oculta foi proibida;
- roadmap e waves usam outcomes, entry criteria e exit criteria;
- custo de coexistência, observabilidade, segurança e Operating Model foram definidos;
- Decommission Policy exige ausência de uso, preservação de dados e revogação de acessos;
- reports, evidence, gate, commit e diário de bordo estão presentes;
- Strangler Fig não foi aprofundado.

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
  labs/m19/aula-650-modernizacao-legado/service-scheduling-legacy-modernization `
  scripts/m19/service-scheduling-legacy-modernization `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|realCustomer|productionEndpoint|connectionString|completeStranglerRouting|microserviceExtraction"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): planejar modernizacao de legado"
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
- nomes reais de clientes;
- endpoints privados;
- topologia de produção;
- connection strings;
- detalhes exploráveis de vulnerabilidade;
- implementação completa de Strangler Fig;
- decisão aprofundada de extração para microserviços.

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou modernização de legado.

Você criou:

```text
Legacy Modernization Charter;

Business Capability Map;

Legacy Inventory;

Dependency Map;

Integration Catalog;

Data Asset Catalog;

Operational Baseline;

Change Baseline;

Change Hotspots;

Component Assessment;

Risk Register;

Modernization Strategy Matrix;

Characterization Test Plan;

Golden Master;

Contract Snapshots;

Data Modernization Plan;

Compatibility Policy;

Modernization Roadmap;

Modernization Waves;

Operating Model;

Observability;

Security Policy;

Cost Model;

Decommission Policy;

reports;

evidence;

gate.
```

Você comprovou que legado é uma condição de baixa capacidade de mudança, não apenas idade; que modernização precisa começar pelo negócio e pelo risco; que o sistema deve ser decomposto em capacidades, componentes, dependências, dados e integrações; que unknowns precisam ser tratados como risco; que hotspots surgem da combinação entre demanda, complexidade, falha e criticidade; que uma única aplicação pode exigir múltiplas estratégias; que reescrita total não é padrão; que comportamento precisa ser caracterizado; que dados exigem authority, quality baseline e reconciliação; que compatibilidade precisa de prazo; e que retirada depende de telemetria, preservação de dados, remoção de consumers e revogação de acessos.

A próxima aula será:

```text
651 - M19.41 - Strangler Fig
```

Nela, você aplicará uma estratégia incremental de substituição ao redor do sistema legado, criando uma fronteira de entrada, roteamento progressivo, extração por capacidade, coexistência observável e retirada segura do caminho antigo.

Nenhum aprofundamento completo de Strangler Fig ou de decisão de microserviços foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei capacidades de negócio.
- [ ] Inventariei componentes e dependências.
- [ ] Defini ownership de dados.
- [ ] Coletei baseline operacional e de mudança.
- [ ] Identifiquei hotspots.
- [ ] Escolhi estratégia por componente.
- [ ] Criei testes de caracterização.
- [ ] Capturei contratos.
- [ ] Avaliei data readiness.
- [ ] Criei roadmap e ondas.
- [ ] Defini compatibility windows.
- [ ] Criei critérios de retirada.
- [ ] Gere reports, evidence e gate.

## Troubleshooting adicional

### A equipe quer começar reescrevendo

Exija capacidade, baseline, caracterização, dependências, dados, risco e estratégia por componente.

### O inventário nunca termina

Comece pelas capacidades críticas e refine por ondas. Não espere conhecimento perfeito para produzir a primeira evidência.

### Ninguém sabe quem usa uma tabela

Use telemetria, logs, consultas, credenciais, jobs, relatórios, entrevistas e janela de observação.

### Os testes de caracterização registram um bug

Classifique como defeito conhecido e exija decisão de negócio sobre o comportamento futuro.

### O golden master muda a cada execução

Normalize timestamps, IDs aleatórios, ordem e dados voláteis.

### A nova aplicação depende do mesmo banco compartilhado

Registre como arquitetura de transição, defina authority e crie plano de redução de dependência.

### A modernização não melhora lead time

Revise se o gargalo está em processo, homologação, dependências, ownership ou plataforma, e não apenas no código.

### A camada de compatibilidade cresce

Defina prazo, owner, métricas de uso e critérios de remoção.

### O sistema antigo não pode ser desligado

Verifique consumers, jobs, dados, retenção, contratos, credenciais e runbooks ainda ativos.

### A discussão virou implementação do Strangler Fig

Preserve o padrão completo para a aula 651.

## Perguntas de revisão

1. O que torna um sistema legado?
2. Por que idade não é suficiente?
3. Qual objetivo real da modernização?
4. Por que começar por capacidades de negócio?
5. O que deve entrar no inventário?
6. O que é uma dependência desconhecida?
7. O que é baseline operacional?
8. O que é baseline de mudança?
9. O que é hotspot?
10. Por que nem todo código ruim é prioridade?
11. Quais estratégias podem ser usadas?
12. Quando usar encapsulamento?
13. Qual diferença entre rehost e replatform?
14. Qual diferença entre refactor e rearchitect?
15. Por que reescrita total é arriscada?
16. O que é teste de caracterização?
17. O que é golden master?
18. Como tratar defeito legado?
19. O que é data readiness?
20. Por que compatibilidade precisa de prazo?
21. O que uma wave precisa possuir?
22. Por que medir custo de coexistência?
23. Quando um componente pode ser retirado?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

## Roteiro de resposta

1. Baixa capacidade de mudança diante da necessidade do negócio.
2. Sistemas recentes também podem ser difíceis e arriscados de alterar.
3. Reduzir risco e aumentar fluxo de mudança preservando o negócio.
4. Para relacionar tecnologia ao valor e à criticidade.
5. Aplicações, bancos, jobs, integrações, relatórios, scripts e processos.
6. Relação não mapeada que deve ser tratada como risco.
7. Métricas do comportamento atual em produção.
8. Métricas do processo e do esforço de alteração.
9. Área com muita mudança, complexidade, falha e criticidade.
10. Porque prioridade depende de impacto e demanda.
11. Retain, remediate, encapsulate, rehost, replatform, refactor, rearchitect, replace e retire.
12. Quando o núcleo permanece, mas precisa de fronteira controlada.
13. Rehost muda ambiente; replatform altera parte da plataforma.
14. Refactor melhora estrutura; rearchitect muda fronteiras.
15. Porque acumula risco e descobre regras tarde.
16. Teste que registra o comportamento atual.
17. Saída conhecida usada para comparação.
18. Classificar e decidir explicitamente o comportamento futuro.
19. Condição de ownership, qualidade, reconciliação e recuperação.
20. Para impedir coexistência permanente.
21. Outcome, owner, dependências, critérios, risco e evidence.
22. Porque dois mundos mantidos ao mesmo tempo têm custo crescente.
23. Após telemetria, migração, preservação de dados e aprovações.
24. Strangler Fig.
25. Strangler Fig.

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 650 - M19.40 - Modernizacao de legado**

- Aprofundei modernização de legado.
- Criei o laboratório `service-scheduling-legacy-modernization`.
- Criei Legacy Modernization Charter.
- Mapeei capacidades de negócio.
- Separei capacidades de componentes técnicos.
- Criei inventário de aplicações, bancos, jobs, integrações, relatórios e processos.
- Criei Dependency Map.
- Classifiquei dependências desconhecidas como risco.
- Criei Integration Catalog.
- Criei Data Asset Catalog.
- Defini autoridade de dados.
- Coletei baseline operacional.
- Coletei baseline de mudança.
- Identifiquei Change Hotspots.
- Avaliei criticidade, demanda, risco, coupling, testabilidade e conhecimento.
- Separei fatos, hipóteses e unknowns.
- Criei Risk Register.
- Avaliei estratégias Retain, Remediate, Encapsulate, Rehost, Replatform, Refactor, Rearchitect, Replace e Retire.
- Criei Strategy Decision por componente.
- Proibi reescrita total sem evidência.
- Criei testes de caracterização.
- Criei Golden Master.
- Capturei contratos e consumers.
- Classifiquei diferenças de comportamento.
- Avaliei Data Migration Readiness.
- Criei regras de reconciliação.
- Criei Compatibility Policy com prazo.
- Proibi dupla autoridade oculta.
- Criei roadmap por outcomes.
- Organizei Modernization Waves.
- Defini entry e exit criteria.
- Estimei custo de coexistência.
- Criei Operating Model, Observability e Security Policy.
- Criei Decommission Policy.
- Criei reports, evidence e gate.
- Não antecipei Strangler Fig.
- Próxima aula: Strangler Fig.
```

## Referência técnica curta

- Legacy System.
- Legacy Modernization.
- Business Capability.
- Legacy Inventory.
- Dependency Mapping.
- Change Hotspot.
- Characterization Test.
- Golden Master.
- Contract Snapshot.
- Modernization Strategy.
- Data Readiness.
- Compatibility Window.
- Modernization Wave.
- Decommission.

Regra final:

```text
Modernização de legado começa pelo negócio e pelo risco. Service Scheduling transforma o legacy-scheduling-core em capacidades, componentes, dependências, integrações, dados e comportamentos observáveis. Unknowns viram risco; baseline mede operação e capacidade de mudança; hotspots combinam demanda, complexidade, falha e criticidade. Cada componente recebe uma estratégia própria, sustentada por evidências, constraints, outcomes e owner, sem assumir reescrita total. Testes de caracterização, golden master e snapshots protegem contratos; diferenças são classificadas para que defeitos antigos não virem regras eternas. Dados possuem authority, qualidade, reconciliação, retenção e recuperação. Compatibility windows têm prazo, telemetria e remoção; roadmap e waves possuem entry e exit criteria; retirada exige uso encerrado, dados preservados, consumers removidos e acessos revogados. Reports, evidence e gate determinam readiness, enquanto o Strangler Fig fica reservado para a aula 651.
```
