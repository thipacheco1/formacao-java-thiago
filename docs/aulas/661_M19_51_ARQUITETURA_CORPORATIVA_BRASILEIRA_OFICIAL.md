# 661 - M19.51 - Arquitetura corporativa brasileira

## Apresentação da aula

Na aula 660, você aprofundou mentoria e comunicação técnica.

Você criou um sistema para desenvolver autonomia: mapa de competências, comportamentos observáveis, objetivos de desenvolvimento, acordo de mentoria, perguntas, prática deliberada, níveis de autonomia, feedback específico, code review orientado ao aprendizado, comunicação por audiência, registro de progresso e critérios de conclusão.

Agora o foco se amplia novamente.

Até aqui, muitas decisões foram trabalhadas dentro de um produto, um domínio ou um conjunto controlado de serviços. Em uma organização real, porém, `Service Scheduling` raramente vive sozinho.

Ele pode depender de:

```text
ERP corporativo;

CRM;

portal de clientes;

aplicativo de campo;

provedor de identidade;

data lake ou plataforma analítica;

sistemas fiscais;

mensageria corporativa;

integrações com parceiros;

soluções SaaS;

bancos legados;

processos manuais;

planilhas críticas;

fornecedores terceirizados;

infraestrutura on-premises e cloud.
```

Também pode existir em uma empresa que cresceu por aquisições, possui várias marcas, unidades de negócio, contratos antigos, tecnologias diferentes, exigências regulatórias, equipes distribuídas e níveis desiguais de maturidade.

Esse cenário aparece com frequência em organizações brasileiras de varejo, indústria, serviços, telecomunicações, saúde, seguros, bancos, logística, utilities, governo e grandes grupos empresariais.

A expressão “arquitetura corporativa brasileira” não significa que exista uma arquitetura tecnicamente exclusiva do Brasil. Os fundamentos continuam universais.

O que muda é o contexto em que as decisões precisam sobreviver:

- forte presença de legado;
- integrações fiscais e regulatórias;
- convivência entre on-premises, cloud e SaaS;
- terceirização relevante;
- contratos de longo prazo;
- aquisição e fusão de empresas;
- restrições orçamentárias e cambiais;
- dependência de fornecedores;
- exigências de privacidade e auditoria;
- processos manuais que ainda sustentam operações críticas;
- equipes com maturidade técnica heterogênea;
- necessidade de modernizar sem interromper o negócio.

Arquitetura corporativa não é desenhar um diagrama gigante de toda a empresa.

Também não é criar um comitê que aprova tecnologias de forma centralizada.

É conectar estratégia, capacidades de negócio, dados, aplicações, integrações, tecnologia, segurança, operação e evolução em uma direção coerente.

A pergunta central será:

```text
como evoluir uma organização complexa,
com legado, fornecedores,
restrições regulatórias,
ambientes híbridos
e múltiplas unidades,

sem tentar padronizar tudo,
sem paralisar os times
e sem transformar arquitetura
em documentação distante da execução?
```

O laboratório será:

```text
labs/m19/aula-661-arquitetura-corporativa-brasileira/service-scheduling-enterprise-architecture
```

Você modelará uma empresa fictícia chamada:

```text
Grupo Nacional de Serviços.
```

O grupo possui:

```text
três marcas;

duas empresas adquiridas;

ERP central;

CRM SaaS;

Service Scheduling moderno;

sistema de campo legado;

data platform;

operações em cloud e datacenter;

fornecedores externos;

integrações fiscais e regulatórias;

processos manuais ainda críticos.
```

Você criará:

- Enterprise Architecture Charter;
- mapa de capacidades de negócio;
- mapa de domínios;
- portfólio de aplicações;
- matriz de unidades e marcas;
- mapa de integrações;
- catálogo de dados corporativos;
- mapa de plataformas;
- mapa de fornecedores;
- matriz de restrições;
- princípios de arquitetura;
- arquiteturas de referência;
- estratégia de coexistência;
- modelo federado;
- roadmap de racionalização;
- plano de transição;
- critérios de investimento;
- reports, evidence e gate.

A próxima aula será:

```text
662 - M19.52 - Governanca tecnica leve
```

A aula 662 aprofundará como aplicar guardrails, fóruns, ownership, exceções, métricas e cadências de decisão sem criar burocracia excessiva.

Nesta aula, governança aparecerá apenas como contexto mínimo para manter coerência e responsabilidade. O processo operacional detalhado ficará para a aula seguinte.

Regra central:

```text
arquitetura corporativa
não existe para controlar
cada solução;

existe para conectar
estratégia, capacidades,
dados, aplicações,
plataformas e evolução

com direção compartilhada
e autonomia responsável.
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

liderar alinhamento e execução;

desenvolver autonomia;

conectar decisões ao contexto empresarial;

criar governança proporcional.
```

Até aqui, você praticou arquitetura em profundidade técnica.

Agora precisa ampliar a unidade de análise.

Em vez de perguntar apenas:

```text
qual é a arquitetura correta
para Service Scheduling?
```

Você também perguntará:

```text
qual capacidade de negócio
este sistema sustenta?

quais aplicações duplicam
essa capacidade?

qual dado é corporativo?

qual plataforma deve ser compartilhada?

qual dependência pertence ao produto
e qual pertence à empresa?

qual legado deve ser modernizado,
encapsulado, substituído ou mantido?

como uma aquisição será integrada?

como evitar que uma padronização
crie mais custo do que valor?
```

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-661-arquitetura-corporativa-brasileira
└── service-scheduling-enterprise-architecture
    ├── pom.xml
    ├── README.md
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/enterprisearchitecture
    │   │           ├── capability
    │   │           │   ├── BusinessCapability.java
    │   │           │   ├── CapabilityLevel.java
    │   │           │   ├── CapabilityOwner.java
    │   │           │   ├── CapabilityMaturity.java
    │   │           │   └── CapabilityMap.java
    │   │           ├── portfolio
    │   │           │   ├── ApplicationAsset.java
    │   │           │   ├── ApplicationLifecycle.java
    │   │           │   ├── BusinessFit.java
    │   │           │   ├── TechnicalFit.java
    │   │           │   └── ApplicationPortfolio.java
    │   │           ├── domain
    │   │           │   ├── EnterpriseDomain.java
    │   │           │   ├── DomainRelationship.java
    │   │           │   ├── DomainOwner.java
    │   │           │   └── DomainMap.java
    │   │           ├── integration
    │   │           │   ├── EnterpriseIntegration.java
    │   │           │   ├── IntegrationCriticality.java
    │   │           │   ├── IntegrationPattern.java
    │   │           │   └── IntegrationCatalog.java
    │   │           ├── platform
    │   │           │   ├── EnterprisePlatform.java
    │   │           │   ├── PlatformCapability.java
    │   │           │   ├── PlatformOwner.java
    │   │           │   └── PlatformCatalog.java
    │   │           ├── vendor
    │   │           │   ├── VendorDependency.java
    │   │           │   ├── VendorRisk.java
    │   │           │   ├── ContractConstraint.java
    │   │           │   └── ExitStrategy.java
    │   │           ├── transition
    │   │           │   ├── TransitionState.java
    │   │           │   ├── TransformationWave.java
    │   │           │   ├── InvestmentDecision.java
    │   │           │   └── EnterpriseRoadmap.java
    │   │           └── gate
    │   │               ├── EnterpriseArchitectureGate.java
    │   │               ├── GateFinding.java
    │   │               └── GateResult.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/enterprisearchitecture
    │               ├── capability
    │               │   ├── CapabilityOwnershipTest.java
    │               │   └── CapabilityDuplicationTest.java
    │               ├── portfolio
    │               │   ├── ApplicationLifecycleTest.java
    │               │   └── PortfolioDecisionTest.java
    │               ├── integration
    │               │   ├── IntegrationOwnershipTest.java
    │               │   └── CriticalIntegrationTest.java
    │               ├── vendor
    │               │   ├── VendorExitStrategyTest.java
    │               │   └── ContractConstraintTest.java
    │               └── architecture
    │                   ├── EnterpriseBoundaryTest.java
    │                   ├── FederatedOwnershipTest.java
    │                   ├── GovernanceNonAnticipationTest.java
    │                   └── LivingDocumentationTest.java
    ├── enterprise
    │   ├── ENTERPRISE_ARCHITECTURE_CHARTER.md
    │   ├── COMPANY_CONTEXT.md
    │   ├── BUSINESS_CAPABILITY_MAP.md
    │   ├── ENTERPRISE_DOMAIN_MAP.md
    │   ├── BUSINESS_UNIT_MATRIX.md
    │   ├── APPLICATION_PORTFOLIO.md
    │   ├── APPLICATION_RATIONALIZATION.md
    │   ├── ENTERPRISE_DATA_CATALOG.md
    │   ├── INTEGRATION_LANDSCAPE.md
    │   ├── PLATFORM_MAP.md
    │   ├── VENDOR_DEPENDENCY_MAP.md
    │   ├── REGULATORY_AND_CONTRACTUAL_CONSTRAINTS.md
    │   ├── ARCHITECTURE_PRINCIPLES.md
    │   ├── REFERENCE_ARCHITECTURES.md
    │   ├── FEDERATED_ARCHITECTURE_MODEL.md
    │   ├── MERGER_AND_ACQUISITION_PLAYBOOK.md
    │   ├── COEXISTENCE_STRATEGY.md
    │   ├── ENTERPRISE_ROADMAP.md
    │   ├── INVESTMENT_CRITERIA.md
    │   ├── OPERATING_MODEL.md
    │   ├── TRADE_OFFS.md
    │   └── OPEN_ENTERPRISE_QUESTIONS.md
    ├── contracts
    │   ├── enterprise-architecture-contract.yaml
    │   ├── capability-policy.yaml
    │   ├── domain-policy.yaml
    │   ├── application-portfolio-policy.yaml
    │   ├── data-ownership-policy.yaml
    │   ├── integration-policy.yaml
    │   ├── platform-policy.yaml
    │   ├── vendor-policy.yaml
    │   ├── constraint-policy.yaml
    │   ├── reference-architecture-policy.yaml
    │   ├── transition-policy.yaml
    │   ├── investment-policy.yaml
    │   ├── evidence-policy.yaml
    │   └── non-anticipation-policy.yaml
    └── reports
        ├── capability-coverage-report.yaml
        ├── application-portfolio-report.yaml
        ├── integration-risk-report.yaml
        ├── platform-coverage-report.yaml
        ├── vendor-risk-report.yaml
        ├── transformation-roadmap-report.yaml
        ├── architecture-report.yaml
        └── enterprise-architecture-gate-report.yaml
```

Scripts:

```text
scripts/m19/service-scheduling-enterprise-architecture
├── validate-enterprise-architecture-contract.ps1
├── validate-capability-map.ps1
├── validate-domain-map.ps1
├── validate-application-portfolio.ps1
├── validate-integration-landscape.ps1
├── validate-platform-map.ps1
├── validate-vendor-dependencies.ps1
├── validate-reference-architectures.ps1
├── validate-enterprise-roadmap.ps1
├── run-enterprise-architecture-tests.ps1
├── collect-enterprise-architecture-evidence.ps1
└── verify-enterprise-architecture-gate.ps1
```

---

## Conceito essencial

### Arquitetura corporativa conecta estratégia e execução

Estratégia empresarial define direção, prioridades e resultados esperados.

Arquitetura corporativa traduz essa direção em capacidades, domínios, aplicações, dados, integrações, plataformas e transições.

Ela não substitui produto, engenharia, segurança, dados ou operação.

Ela conecta essas áreas.

Exemplo:

```text
estratégia:
reduzir o tempo de atendimento nacional.

capacidade:
Service Scheduling.

domínios:
Scheduling;
Capacity;
Field Execution;
Customer Communication.

aplicações:
portal;
API;
ERP;
aplicativo de campo;
CRM.

plataformas:
identity;
observability;
messaging;
data platform.

transição:
encapsular legado;
migrar jornadas;
retirar integrações duplicadas.
```

### Capacidade de negócio não é sistema

Uma capacidade representa o que a organização consegue fazer.

Exemplos:

```text
vender;

agendar;

entregar;

faturar;

remunerar prestadores;

atender clientes;

gerenciar identidade;

analisar operações.
```

Um sistema pode atender várias capacidades.

Uma capacidade pode ser atendida por vários sistemas.

Confundir capacidade com aplicação dificulta modernização, porque a organização começa a defender sistemas em vez de resultados.

### Arquitetura corporativa não é padronização total

Padronizar tudo parece reduzir complexidade, mas pode criar:

- solução inadequada para contextos diferentes;
- fila central de aprovação;
- dependência de plataforma imatura;
- perda de velocidade;
- exceções informais;
- inovação clandestina;
- custo de migração sem benefício.

A direção correta combina:

```text
poucos princípios obrigatórios;

plataformas reutilizáveis;

arquiteturas de referência;

autonomia por domínio;

exceções explícitas;

evidência de resultado.
```

A operacionalização detalhada dessa combinação será aprofundada na aula 662.

### O contexto brasileiro exige coexistência

Muitas empresas não podem substituir todo o legado de uma vez.

Existem dependências fiscais, operacionais, contratuais e históricas.

A arquitetura precisa projetar coexistência:

```text
legado como autoridade temporária;

novo sistema como consumidor;

anti-corruption layer;

replicação controlada;

migração por capacidade;

Strangler Fig;

reconciliation;

critérios de retirada.
```

Coexistência sem prazo vira permanência acidental.

Cada estado transitório precisa de owner, custo e critério de saída.

### Fornecedores fazem parte da arquitetura

SaaS, consultorias, integradores, cloud, telecom, ERPs e plataformas de mercado não são apenas decisões de compras.

Eles influenciam:

- disponibilidade;
- segurança;
- integração;
- custo;
- tempo de mudança;
- portabilidade;
- soberania operacional;
- suporte;
- retenção de dados;
- continuidade de negócio.

Contrato e arquitetura precisam conversar.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-661-arquitetura-corporativa-brasileira/service-scheduling-enterprise-architecture

Set-Location `
  labs/m19/aula-661-arquitetura-corporativa-brasileira/service-scheduling-enterprise-architecture
```

---

### 2. Criar Enterprise Architecture Charter

Arquivo:

```text
enterprise/ENTERPRISE_ARCHITECTURE_CHARTER.md
```

Conteúdo:

```markdown
# Enterprise Architecture Charter

Contexto: Grupo Nacional de Serviços.

Missão: conectar estratégia, capacidades, dados, aplicações, plataformas e evolução.

Princípios:
- capacidade antes de aplicação;
- domínio com ownership;
- dado com autoridade;
- integração com contrato;
- plataforma como produto;
- segurança e observabilidade por padrão;
- coexistência com prazo;
- fornecedor com exit strategy;
- decisão baseada em risco e valor;
- autonomia federada.
```

---

### 3. Criar o contexto empresarial

Arquivo:

```text
enterprise/COMPANY_CONTEXT.md
```

Cenário:

```text
Grupo Nacional de Serviços.

Marcas:
Alpha;
Beta;
Gamma.

Aquisições recentes:
Regional Sul;
Operação Nordeste.

Canais:
portal;
mobile;
central telefônica;
lojas;
parceiros.

Ambientes:
cloud pública;
datacenter próprio;
SaaS.

Sistemas centrais:
ERP;
CRM;
Service Scheduling;
Field Legacy;
Data Platform.
```

Registre também objetivos estratégicos, restrições, crescimento, aquisições previstas e principais riscos.

---

### 4. Criar o contrato principal

Arquivo:

```text
contracts/enterprise-architecture-contract.yaml
```

Conteúdo:

```yaml
enterpriseArchitecture:
  context:
    Grupo-Nacional-de-Servicos

  required:
    - business-capability-map
    - domain-map
    - business-unit-matrix
    - application-portfolio
    - data-ownership
    - integration-landscape
    - platform-map
    - vendor-map
    - constraints
    - architecture-principles
    - reference-architectures
    - federated-model
    - coexistence-strategy
    - enterprise-roadmap
    - investment-criteria
    - evidence
    - gate

  forbidden:
    - application-as-capability
    - central-team-owning-all-decisions
    - undocumented-critical-integration
    - vendor-without-exit-strategy
    - transition-without-exit-criteria
    - shared-data-without-authority
    - standardization-without-value
    - governance-process-deep-dive

  nextLesson:
    code:
      M19.52
```

---

### 5. Mapear capacidades de negócio

Arquivo:

```text
enterprise/BUSINESS_CAPABILITY_MAP.md
```

Nível 1:

```text
Customer Management;
Sales;
Service Scheduling;
Field Execution;
Supply and Capacity;
Billing;
Provider Management;
Finance;
Risk and Compliance;
Data and Analytics;
Corporate Technology.
```

Nível 2 para `Service Scheduling`:

```text
Create Appointment;
Confirm Appointment;
Reschedule Appointment;
Cancel Appointment;
Allocate Capacity;
Notify Customer;
Prepare Field Execution;
Track Service Status.
```

---

### 6. Criar Business Capability

```java
package br.com.formacao.enterprisearchitecture.capability;

import java.util.List;
import java.util.Objects;

public record BusinessCapability(
        String id,
        String name,
        CapabilityLevel level,
        String owner,
        CapabilityMaturity maturity,
        List<String> strategicObjectives) {

    public BusinessCapability {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(level);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(maturity);
        strategicObjectives = List.copyOf(strategicObjectives);
    }
}
```

A capacidade possui owner de negócio.

Arquitetura apoia, mas não substitui esse ownership.

---

### 7. Avaliar maturidade da capacidade

Escala:

```text
1 - ad hoc;
2 - repetível;
3 - padronizada;
4 - medida;
5 - adaptativa.
```

Avalie:

- processo;
- tecnologia;
- dados;
- pessoas;
- controles;
- indicadores;
- dependências.

Não use maturidade para comparar equipes publicamente.

Use para priorizar investimento.

---

### 8. Mapear domínios empresariais

Arquivo:

```text
enterprise/ENTERPRISE_DOMAIN_MAP.md
```

Domínios:

```text
Customer;
Commercial;
Scheduling;
Capacity;
Field Execution;
Provider;
Billing;
Finance;
Identity;
Communication;
Analytics.
```

Para cada domínio, registre:

- propósito;
- linguagem;
- owner;
- sistemas;
- dados autoritativos;
- upstream;
- downstream;
- riscos;
- estado de modernização.

---

### 9. Distinguir capacidade, domínio e aplicação

Exemplo:

```text
capacidade:
Confirm Appointment.

domínio:
Scheduling.

aplicação:
Service Scheduling API.
```

A capacidade descreve resultado.

O domínio organiza conhecimento e regras.

A aplicação implementa parte da solução.

---

### 10. Criar matriz de unidades e marcas

Arquivo:

```text
enterprise/BUSINESS_UNIT_MATRIX.md
```

Exemplo:

```text
Capability:
Service Scheduling.

Alpha:
plataforma moderna.

Beta:
ERP customizado.

Gamma:
solução SaaS.

Regional Sul:
sistema adquirido.

Operação Nordeste:
planilha e central telefônica.
```

Essa matriz revela duplicação e diferenças legítimas.

Não presuma que todas as marcas precisam da mesma solução imediatamente.

---

### 11. Criar portfólio de aplicações

Arquivo:

```text
enterprise/APPLICATION_PORTFOLIO.md
```

Para cada aplicação:

- nome;
- owner;
- fornecedor;
- capacidades atendidas;
- domínios;
- usuários;
- criticidade;
- business fit;
- technical fit;
- custo;
- risco;
- integrações;
- dados;
- lifecycle;
- contrato;
- estratégia.

---

### 12. Criar Application Asset

```java
package br.com.formacao.enterprisearchitecture.portfolio;

import java.util.Set;

public record ApplicationAsset(
        String id,
        String name,
        String owner,
        BusinessFit businessFit,
        TechnicalFit technicalFit,
        ApplicationLifecycle lifecycle,
        Set<String> capabilities,
        Set<String> domains,
        boolean vendorManaged) {

    public ApplicationAsset {
        capabilities = Set.copyOf(capabilities);
        domains = Set.copyOf(domains);
    }
}
```

---

### 13. Aplicar racionalização TIME

Arquivo:

```text
enterprise/APPLICATION_RATIONALIZATION.md
```

Classifique aplicações como:

```text
Tolerate;
Invest;
Migrate;
Eliminate.
```

Exemplo:

```text
Field Legacy:
Migrate.

ERP Finance:
Tolerate.

Service Scheduling:
Invest.

Planilha de agendamento:
Eliminate.
```

A classificação precisa de evidência, owner e horizonte.

---

### 14. Evitar eliminação simplista

Uma planilha pode parecer tecnicamente inadequada, mas sustentar uma exceção de negócio não modelada.

Antes de eliminar:

- observar processo;
- entrevistar usuários;
- mapear dados;
- identificar controles;
- medir volume;
- registrar exceções;
- criar substituto;
- validar operação.

---

### 15. Criar catálogo de dados corporativos

Arquivo:

```text
enterprise/ENTERPRISE_DATA_CATALOG.md
```

Dados principais:

```text
Customer;
Appointment;
Capacity;
Provider;
Service Order;
Payment;
Contract;
Product;
Location;
Identity.
```

Para cada dado:

- domínio autoritativo;
- steward;
- classificação;
- consumers;
- qualidade;
- retenção;
- integrações;
- réplicas;
- conflitos conhecidos.

A aula 657 já aprofundou decisões de dados. Aqui você conecta esse trabalho ao portfólio corporativo.

---

### 16. Identificar “dados corporativos” com cuidado

Nem todo campo compartilhado precisa de um banco central.

O fato de várias áreas usarem `Customer` não significa que todos os contextos compartilhem o mesmo modelo interno.

Use:

- autoridade explícita;
- contratos;
- identificadores estáveis;
- projeções;
- eventos;
- APIs;
- lineage.

Evite criar um “modelo canônico universal” que tente representar todas as semânticas.

---

### 17. Mapear integrações

Arquivo:

```text
enterprise/INTEGRATION_LANDSCAPE.md
```

Integrações:

```text
ERP -> Scheduling;
CRM -> Customer;
Scheduling -> Capacity;
Scheduling -> Field Legacy;
Scheduling -> Communication;
Scheduling -> Data Platform;
ERP -> sistemas fiscais;
parceiros -> portal de integração.
```

Campos:

- source;
- target;
- purpose;
- owner;
- protocolo;
- contrato;
- frequência;
- criticidade;
- dados;
- autenticação;
- SLO;
- retry;
- observabilidade;
- fallback;
- lifecycle.

---

### 18. Criar Enterprise Integration

```java
package br.com.formacao.enterprisearchitecture.integration;

import java.util.Objects;

public record EnterpriseIntegration(
        String id,
        String source,
        String target,
        String purpose,
        IntegrationPattern pattern,
        IntegrationCriticality criticality,
        String owner,
        String contractId,
        String lifecycle) {

    public EnterpriseIntegration {
        Objects.requireNonNull(id);
        Objects.requireNonNull(source);
        Objects.requireNonNull(target);
        Objects.requireNonNull(purpose);
        Objects.requireNonNull(pattern);
        Objects.requireNonNull(criticality);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(contractId);
        Objects.requireNonNull(lifecycle);
    }
}
```

---

### 19. Classificar integrações críticas

Critérios:

```text
impacto financeiro;

impacto operacional;

impacto regulatório;

volume;

latência;

recuperação;

substituição;

visibilidade;

dependência de fornecedor.
```

Integração crítica sem owner e runbook é risco corporativo.

---

### 20. Tratar integrações fiscais e regulatórias

Não implemente detalhes legais no laboratório.

Registre apenas que integrações desse tipo exigem:

- owner de negócio;
- owner técnico;
- calendário de mudança;
- ambiente de homologação;
- certificado ou identidade controlada;
- versionamento;
- auditoria;
- contingência;
- monitoramento;
- atualização contratual.

A arquitetura precisa prever mudança externa obrigatória.

---

### 21. Criar mapa de plataformas

Arquivo:

```text
enterprise/PLATFORM_MAP.md
```

Plataformas possíveis:

```text
Identity Platform;

API Platform;

Messaging Platform;

Observability Platform;

Data Platform;

Developer Platform;

Cloud Landing Zone;

Secrets Platform;

Integration Platform.
```

Para cada plataforma:

- produto oferecido;
- consumidores;
- owner;
- SLO;
- onboarding;
- custo;
- limites;
- roadmap;
- suporte;
- exit strategy.

---

### 22. Tratar plataforma como produto

Uma plataforma não é obrigatória apenas porque existe.

Ela precisa oferecer:

- problema claro;
- interface simples;
- documentação;
- suporte;
- confiabilidade;
- feedback;
- roadmap;
- medição de adoção;
- custo transparente.

Uma plataforma ruim cria shadow infrastructure.

---

### 23. Criar Enterprise Platform

```java
package br.com.formacao.enterprisearchitecture.platform;

import java.util.List;

public record EnterprisePlatform(
        String id,
        String name,
        String owner,
        List<PlatformCapability> capabilities,
        String serviceLevel,
        String onboardingModel,
        String exitStrategy) {

    public EnterprisePlatform {
        capabilities = List.copyOf(capabilities);
    }
}
```

---

### 24. Mapear fornecedores

Arquivo:

```text
enterprise/VENDOR_DEPENDENCY_MAP.md
```

Categorias:

```text
SaaS;
cloud;
ERP;
consultoria;
integrador;
telecom;
banco de dados;
observabilidade;
segurança;
mensageria.
```

Campos:

- serviço;
- owner;
- contrato;
- renovação;
- moeda;
- dados processados;
- SLO;
- suporte;
- subcontratados;
- portabilidade;
- lock-in;
- continuidade;
- exit strategy.

---

### 25. Criar Vendor Dependency

```java
package br.com.formacao.enterprisearchitecture.vendor;

import java.util.List;

public record VendorDependency(
        String vendorId,
        String service,
        VendorRisk risk,
        List<ContractConstraint> constraints,
        ExitStrategy exitStrategy,
        String owner) {

    public VendorDependency {
        constraints = List.copyOf(constraints);
    }
}
```

---

### 26. Definir exit strategy

Exit strategy pode incluir:

```text
exportação de dados;

formato de exportação;

migração de identidade;

substituição de API;

período de coexistência;

transferência de conhecimento;

remoção de agentes;

revogação de acessos;

encerramento de contrato;

validação de exclusão.
```

Não significa que a troca será barata.

Significa que a dependência é conhecida.

---

### 27. Mapear restrições

Arquivo:

```text
enterprise/REGULATORY_AND_CONTRACTUAL_CONSTRAINTS.md
```

Categorias:

- privacidade;
- auditoria;
- retenção;
- segurança;
- localização;
- disponibilidade;
- contratos;
- licenciamento;
- propriedade intelectual;
- suporte;
- certificações;
- integrações obrigatórias.

Registre fonte, owner, impacto e data de revisão.

Não invente requisito jurídico. Valide com especialistas responsáveis.

---

### 28. Criar princípios de arquitetura

Arquivo:

```text
enterprise/ARCHITECTURE_PRINCIPLES.md
```

Princípios:

```text
1. capacidade antes de aplicação;

2. domínio possui autoridade;

3. APIs e eventos possuem contrato;

4. segurança e observabilidade por padrão;

5. plataformas são produtos;

6. coexistência possui prazo;

7. dados são minimizados e governados;

8. automação antes de processo manual repetitivo;

9. fornecedor possui exit strategy;

10. padrão precisa demonstrar valor.
```

Princípio deve orientar decisão, não apenas inspirar.

---

### 29. Registrar implicações dos princípios

Exemplo:

```text
Princípio:
domínio possui autoridade.

Implica:
nenhum serviço grava
banco de outro domínio.

Exceção:
migração temporária aprovada,
com owner e data de retirada.
```

Sem implicação, o princípio é abstrato.

---

### 30. Criar arquiteturas de referência

Arquivo:

```text
enterprise/REFERENCE_ARCHITECTURES.md
```

Referências:

```text
API transacional;

event-driven integration;

batch regulatório;

aplicação web corporativa;

processamento de dados;

workload multi-tenant;

modernização de legado.
```

Cada referência contém:

- quando usar;
- quando evitar;
- componentes;
- boundaries;
- segurança;
- observabilidade;
- dados;
- deployment;
- custo;
- exemplos;
- variabilidade permitida.

---

### 31. Evitar arquitetura de referência como template rígido

Referência não deve obrigar todos os produtos a usar:

- mesmo banco;
- mesmo framework;
- mesma topologia;
- mesma linguagem;
- mesmo número de serviços.

Ela fornece caminho seguro e acelerador.

A decisão final continua contextual.

---

### 32. Criar modelo federado

Arquivo:

```text
enterprise/FEDERATED_ARCHITECTURE_MODEL.md
```

Responsabilidades:

```text
Enterprise Architecture:
direção, capacidades,
portfólio e princípios.

Domain Architecture:
fronteiras, modelos,
contratos e evolução.

Platform Architecture:
serviços compartilhados.

Solution Architecture:
desenho de iniciativas.

Teams:
implementação e operação.
```

A federação evita dois extremos:

```text
centralização total;

fragmentação total.
```

---

### 33. Definir ownership de decisão

Exemplos:

```text
capacidade:
owner de negócio.

domínio:
domain owner.

plataforma:
platform owner.

tecnologia local:
time de produto.

risco corporativo:
owner de segurança,
dados ou finanças.
```

A arquitetura corporativa não deve tomar todas as decisões.

---

### 34. Tratar aquisições

Arquivo:

```text
enterprise/MERGER_AND_ACQUISITION_PLAYBOOK.md
```

Fases:

```text
1. discovery;
2. inventory;
3. security containment;
4. identity integration;
5. data classification;
6. capability comparison;
7. application rationalization;
8. integration transition;
9. platform adoption;
10. decommission.
```

Integração apressada pode destruir valor da aquisição.

Integração lenta demais perpetua duplicação e risco.

---

### 35. Criar estratégia de coexistência

Arquivo:

```text
enterprise/COEXISTENCE_STRATEGY.md
```

Cenário:

```text
Alpha usa Service Scheduling.

Beta usa módulo do ERP.

Regional Sul usa sistema adquirido.
```

Estratégia:

```text
identidade corporativa comum;

contrato canônico externo mínimo;

adapters por sistema;

migração por jornada;

data reconciliation;

feature flags;

retirada por unidade.
```

---

### 36. Definir autoridade durante transição

Para cada dado:

```text
Appointment:
autoridade por marca.

Customer reference:
Customer Domain.

Capacity:
autoridade local
até migração.

Analytics:
réplica corporativa.
```

Autoridade ambígua cria conflito silencioso.

---

### 37. Criar Enterprise Roadmap

Arquivo:

```text
enterprise/ENTERPRISE_ROADMAP.md
```

Ondas:

```text
Wave 0:
inventário e ownership.

Wave 1:
identity e observability comuns.

Wave 2:
contratos de integração.

Wave 3:
migração da marca Beta.

Wave 4:
integração da Regional Sul.

Wave 5:
retirada de planilhas e interfaces duplicadas.
```

Cada wave possui outcome, owner, dependências, custo, risco, entrada e saída.

---

### 38. Criar Transformation Wave

```java
package br.com.formacao.enterprisearchitecture.transition;

import java.util.List;

public record TransformationWave(
        String id,
        String outcome,
        String owner,
        List<String> capabilities,
        List<String> dependencies,
        List<String> entryCriteria,
        List<String> exitCriteria,
        String rollbackOrContainment) {

    public TransformationWave {
        capabilities = List.copyOf(capabilities);
        dependencies = List.copyOf(dependencies);
        entryCriteria = List.copyOf(entryCriteria);
        exitCriteria = List.copyOf(exitCriteria);
    }
}
```

---

### 39. Criar critérios de investimento

Arquivo:

```text
enterprise/INVESTMENT_CRITERIA.md
```

Critérios:

```text
alinhamento estratégico;

capacidade impactada;

risco reduzido;

valor ao cliente;

custo de atraso;

custo total;

reversibilidade;

dependências;

maturidade da plataforma;

capacidade das equipes;

obrigação regulatória;

redução de duplicação.
```

Evite priorizar somente pela visibilidade política do projeto.

---

### 40. Criar Investment Decision

```java
package br.com.formacao.enterprisearchitecture.transition;

import java.math.BigDecimal;
import java.util.Map;

public record InvestmentDecision(
        String initiative,
        Map<String, BigDecimal> criterionScores,
        BigDecimal totalScore,
        String recommendation,
        String owner,
        String reviewTrigger) {

    public InvestmentDecision {
        criterionScores = Map.copyOf(criterionScores);
    }
}
```

Score apoia a decisão.

Não substitui contexto e responsabilidade.

---

### 41. Tratar orçamento e moeda

Soluções importadas podem possuir custo sensível a câmbio, consumo, transferência de dados, licenciamento e suporte.

Registre:

- moeda;
- faixa de variação;
- crescimento;
- unidade de cobrança;
- compromisso mínimo;
- custo de saída;
- custo de coexistência;
- custo operacional interno.

A análise detalhada de custo e performance já foi trabalhada anteriormente; aqui o foco é decisão de portfólio.

---

### 42. Tratar terceirização

Terceirização pode acelerar entrega, mas exige:

- ownership interno;
- acesso controlado;
- padrões de segurança;
- qualidade verificável;
- documentação;
- repositório corporativo;
- transferência de conhecimento;
- responsabilidade de operação;
- critérios de saída.

Terceirizar execução não terceiriza responsabilidade arquitetural.

---

### 43. Definir Operating Model

Arquivo:

```text
enterprise/OPERATING_MODEL.md
```

Registre apenas responsabilidades mínimas:

- enterprise architect;
- domain architect;
- platform owner;
- product team;
- security;
- data;
- finance;
- procurement;
- legal;
- vendor manager.

Fóruns, cadências, exceções e métricas de governança serão aprofundados na aula 662.

---

### 44. Criar Open Questions

Arquivo:

```text
enterprise/OPEN_ENTERPRISE_QUESTIONS.md
```

Perguntas:

```text
quais capacidades são estratégicas?

quais aplicações duplicam valor?

quais dados não possuem owner?

quais integrações são invisíveis?

quais fornecedores não possuem saída?

quais transições viraram permanentes?

quais plataformas não possuem consumidores satisfeitos?

quais aquisições ainda operam isoladas?

qual risco o roadmap reduz primeiro?
```

---

### 45. Testar ownership de capacidades

`CapabilityOwnershipTest` valida:

- toda capacidade crítica possui owner;
- owner não é apenas “TI”;
- objetivo estratégico existe;
- maturidade foi registrada;
- aplicações associadas existem.

---

### 46. Testar duplicação de capacidade

Cenário:

```text
cinco aplicações
implementam reagendamento.
```

O teste não deve falhar automaticamente.

Ele deve gerar finding quando:

- não existe justificativa;
- custos são desconhecidos;
- contratos divergem;
- dados conflitam;
- roadmap não existe.

---

### 47. Testar lifecycle de aplicação

Aplicação marcada como `Eliminate` precisa possuir:

- owner;
- substituto;
- consumidores;
- plano de migração;
- extração de dados;
- data de retirada;
- rollback ou contingência.

Sem isso, a classificação é desejo, não plano.

---

### 48. Testar integração crítica

Integração crítica deve possuir:

- owner;
- contrato;
- autenticação;
- observabilidade;
- SLO;
- retry;
- fallback;
- runbook;
- lifecycle.

---

### 49. Testar fornecedor sem saída

`VendorExitStrategyTest` falha quando um serviço crítico não define:

- exportação;
- formato;
- prazo;
- conhecimento;
- substituição;
- revogação;
- owner.

---

### 50. Testar princípio sem implicação

Princípio:

```text
cloud first.
```

Sem contexto, implicação ou exceção, o teste deve gerar finding.

Reescreva:

```text
preferir serviços gerenciados
quando requisitos de segurança,
latência, custo, portabilidade
e operação forem atendidos.
```

---

### 51. Testar transição sem saída

Coexistência entre ERP e Service Scheduling existe há três anos sem critério de retirada.

Resultado:

```text
FAIL_TRANSITION_EXIT_CRITERIA
```

Estado transitório precisa de prazo ou trigger explícito.

---

### 52. Testar arquitetura federada

Valide:

- decisões corporativas limitadas;
- ownership por domínio;
- plataformas com owner;
- times com autonomia local;
- riscos corporativos com owner;
- nenhuma equipe central aprova tudo.

---

### 53. Criar reports

Exemplo:

```yaml
enterpriseArchitecture:
  capabilities:
    total:
      42
    critical:
      11
    withoutOwner:
      0

  applications:
    total:
      68
    invest:
      14
    tolerate:
      27
    migrate:
      19
    eliminate:
      8

  integrations:
    total:
      123
    critical:
      21
    withoutOwner:
      0

  vendors:
    critical:
      9
    withoutExitStrategy:
      1

  transitions:
    active:
      7
    withoutExitCriteria:
      0

  gate:
    PASS_WITH_VENDOR_ACTION
```

---

### 54. Criar evidence

Arquivo:

```text
contracts/enterprise-architecture-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- capability count;
- critical capability count;
- capability owner coverage;
- domain count;
- application count;
- lifecycle distribution;
- application without owner count;
- critical integration count;
- integration owner coverage;
- platform count;
- vendor count;
- vendor exit coverage;
- active transition count;
- transition exit criteria coverage;
- roadmap wave count;
- reference architecture count;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- nomes reais de empresas;
- contratos reais;
- preços reais;
- dados pessoais;
- credenciais;
- certificados;
- endpoints privados;
- vulnerabilidades reais;
- topologia de produção;
- decisões de aquisição reais;
- detalhes de governança da aula 662.

---

### 55. Criar o Gate

O gate valida:

- charter;
- contexto;
- capacidades;
- domínios;
- unidades;
- aplicações;
- dados;
- integrações;
- plataformas;
- fornecedores;
- restrições;
- princípios;
- referências;
- modelo federado;
- aquisições;
- coexistência;
- roadmap;
- investimento;
- ownership;
- testes;
- reports;
- evidence.

Status:

```text
PASS;

PASS_WITH_ACTIONS;

FAIL_CAPABILITY_MAP;

FAIL_DOMAIN_OWNERSHIP;

FAIL_APPLICATION_PORTFOLIO;

FAIL_DATA_AUTHORITY;

FAIL_INTEGRATION_LANDSCAPE;

FAIL_PLATFORM_MODEL;

FAIL_VENDOR_RISK;

FAIL_CONSTRAINTS;

FAIL_REFERENCE_ARCHITECTURE;

FAIL_FEDERATED_MODEL;

FAIL_COEXISTENCE;

FAIL_ROADMAP;

FAIL_INVESTMENT_CRITERIA;

FAIL_TEST;

FAIL_ARCHITECTURE;

INCONCLUSIVE.
```

---

### 56. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\validate-enterprise-architecture-contract.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-capability-map.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-domain-map.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-application-portfolio.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-integration-landscape.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-platform-map.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-vendor-dependencies.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-reference-architectures.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\validate-enterprise-roadmap.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\run-enterprise-architecture-tests.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\collect-enterprise-architecture-evidence.ps1

.\scripts\m19\service-scheduling-enterprise-architecture\verify-enterprise-architecture-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 57. Encerrar o laboratório

Confirme:

- estratégia e contexto;
- capacidades e owners;
- domínios e autoridades;
- unidades e marcas;
- portfólio de aplicações;
- racionalização;
- dados corporativos;
- integrações críticas;
- plataformas como produtos;
- fornecedores e saídas;
- restrições;
- princípios com implicações;
- arquiteturas de referência;
- modelo federado;
- aquisições;
- coexistência;
- roadmap;
- investimento;
- reports;
- evidence;
- gate aprovado;
- governança detalhada não antecipada.

---

## Entendendo o que foi feito

### A estratégia ganhou tradução arquitetural

Objetivos empresariais foram conectados a capacidades, domínios, aplicações, dados, integrações e plataformas.

### O portfólio ganhou visibilidade

Aplicações deixaram de ser avaliadas somente por tecnologia.

Business fit, technical fit, custo, risco e lifecycle passaram a orientar decisões.

### O legado ganhou contexto

Legado não foi tratado automaticamente como problema.

Cada ativo recebeu estratégia: tolerar, investir, migrar ou eliminar.

### Os fornecedores entraram na arquitetura

Contratos, dados, suporte, lock-in, moeda, continuidade e exit strategy passaram a influenciar decisões.

### A empresa ganhou modelo federado

Direção corporativa, ownership de domínio, plataformas e autonomia de times foram separados.

### A transformação ganhou ondas

O roadmap passou a organizar outcomes, dependências, riscos e critérios de saída.

### O contexto brasileiro foi tratado sem caricatura

Legado, ambiente híbrido, integrações externas, aquisições, terceirização, restrições e diversidade de maturidade foram tratados como condições de projeto, não como desculpas para baixa qualidade.

---

## Erros comuns importantes

### Desenhar um diagrama enorme e chamá-lo de arquitetura corporativa

Sem owner, decisão, lifecycle e roadmap, o desenho envelhece rapidamente.

### Confundir capacidade com sistema

Isso faz a organização defender aplicações antigas em vez de resultados de negócio.

### Centralizar todas as decisões

O time central vira fila e perde contexto local.

### Padronizar sem demonstrar valor

Padrão inadequado gera exceções informais e shadow technology.

### Criar um modelo de dados universal

Semânticas de domínios diferentes são apagadas e o acoplamento aumenta.

### Ignorar planilhas e processos manuais

Eles podem ser parte crítica da operação e precisam ser descobertos antes da retirada.

### Tratar fornecedor como problema apenas de compras

Contrato, dados, suporte e saída influenciam arquitetura e continuidade.

### Criar transição sem critério de saída

Dois sistemas permanecem indefinidamente, duplicando custo e risco.

### Migrar aquisição imediatamente para o padrão central

A integração pode destruir capacidades que justificaram a aquisição.

### Fazer roadmap de projetos, não de outcomes

A organização entrega componentes sem reduzir risco ou duplicação.

### Antecipar governança detalhada

Fóruns, exceções, cadências e métricas operacionais pertencem à aula 662.

---

## Comandos úteis

### Validar capacidades

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\validate-capability-map.ps1
```

### Validar portfólio

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\validate-application-portfolio.ps1
```

### Validar integrações

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\validate-integration-landscape.ps1
```

### Validar fornecedores

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\validate-vendor-dependencies.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\run-enterprise-architecture-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-enterprise-architecture\verify-enterprise-architecture-gate.ps1
```

---

## Exercício guiado

Modele uma nova aquisição fictícia:

```text
Empresa Centro-Oeste.
```

Ela possui:

```text
ERP próprio;

agendamento SaaS;

aplicativo terceirizado;

banco local;

integrações por arquivo;

processos manuais;

contrato de cinco anos.
```

Crie:

1. capabilities;
2. domain map;
3. application inventory;
4. data authority;
5. integration map;
6. vendor map;
7. constraints;
8. coexistence strategy;
9. transformation waves;
10. investment decision;
11. evidence;
12. gate.

Explique o que será integrado imediatamente, o que será mantido, o que será migrado e o que será retirado.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 660 e ponte para a aula 662 foram preservadas;
- laboratório `service-scheduling-enterprise-architecture` foi criado;
- Enterprise Architecture Charter foi criado;
- contexto fictício brasileiro foi definido;
- capacidades de negócio foram mapeadas;
- cada capacidade crítica possui owner;
- maturidade foi avaliada;
- capacidade, domínio e aplicação foram diferenciados;
- Enterprise Domain Map foi criado;
- unidades, marcas e aquisições foram mapeadas;
- Application Portfolio foi criado;
- business fit e technical fit foram avaliados;
- racionalização TIME foi aplicada;
- processos manuais foram considerados;
- catálogo de dados corporativos foi criado;
- autoridade de dados foi preservada;
- modelo canônico universal foi evitado;
- Integration Landscape foi criado;
- integrações críticas possuem owner, contrato, SLO e runbook;
- integrações externas obrigatórias foram tratadas com ownership;
- Platform Map foi criado;
- plataformas foram tratadas como produtos;
- Vendor Dependency Map foi criado;
- fornecedores críticos possuem exit strategy;
- restrições regulatórias e contratuais foram registradas;
- princípios possuem implicações;
- arquiteturas de referência possuem variabilidade;
- modelo federado foi criado;
- ownership de decisão foi distribuído;
- playbook de aquisição foi criado;
- estratégia de coexistência foi criada;
- autoridade durante transição foi definida;
- Enterprise Roadmap foi criado;
- waves possuem outcomes e critérios de saída;
- critérios de investimento foram definidos;
- orçamento, moeda e custo de coexistência foram considerados;
- terceirização preserva ownership interno;
- Operating Model mínimo foi criado;
- testes de ownership, duplicação, lifecycle, integração, vendor e transição foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
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
  labs/m19/aula-661-arquitetura-corporativa-brasileira/service-scheduling-enterprise-architecture `
  scripts/m19/service-scheduling-enterprise-architecture `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCompany|realContract|realPrice|productionTopology|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): modelar arquitetura corporativa brasileira"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- nomes reais de empresas;
- contratos reais;
- preços reais;
- dados pessoais;
- credenciais;
- certificados;
- endpoints privados;
- topologia real;
- vulnerabilidades reais;
- decisões de aquisição reais;
- detalhes completos de governança da aula 662.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou arquitetura corporativa brasileira.

Você criou:

```text
Enterprise Architecture Charter;

Company Context;

Business Capability Map;

Enterprise Domain Map;

Business Unit Matrix;

Application Portfolio;

Application Rationalization;

Enterprise Data Catalog;

Integration Landscape;

Platform Map;

Vendor Dependency Map;

Constraints;

Architecture Principles;

Reference Architectures;

Federated Architecture Model;

Merger and Acquisition Playbook;

Coexistence Strategy;

Enterprise Roadmap;

Investment Criteria;

Operating Model;

reports, evidence e gate.
```

Você comprovou que arquitetura corporativa não é um diagrama centralizado nem uma lista de tecnologias aprovadas.

Ela conecta estratégia, capacidades, domínios, aplicações, dados, integrações, plataformas, fornecedores e transições.

Você diferenciou capacidade de sistema, tratou legado por evidência, mapeou marcas e aquisições, avaliou portfólio, protegeu autoridade de dados, catalogou integrações, tratou plataformas como produtos, trouxe contratos e fornecedores para a decisão arquitetural, criou exit strategies, definiu coexistência e organizou transformação por waves.

Também tratou o contexto brasileiro como realidade de engenharia: ambientes híbridos, integrações externas, terceirização, contratos, diversidade de maturidade e modernização progressiva.

A próxima aula será:

```text
662 - M19.52 - Governanca tecnica leve
```

Nela, você irá aprofundar como criar guardrails, fóruns, ownership, exceções, cadências e métricas proporcionais, mantendo velocidade e autonomia.

Nenhum aprofundamento completo do processo de governança técnica foi realizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei capacidades.
- [ ] Defini owners.
- [ ] Mapeei domínios.
- [ ] Inventariei aplicações.
- [ ] Classifiquei lifecycle.
- [ ] Mapeei dados e integrações.
- [ ] Tratei plataformas como produtos.
- [ ] Avaliei fornecedores.
- [ ] Criei coexistência e roadmap.
- [ ] Defini investimento.
- [ ] Criei reports e evidence.
- [ ] Executei o gate.

---

## Troubleshooting adicional

### A equipe quer começar pelo inventário de servidores

Comece pelas capacidades e decisões. Infraestrutura sem contexto de negócio vira catálogo sem prioridade.

### Todos chamam seus sistemas de estratégicos

Conecte cada aplicação a objetivos, capacidades, impacto e evidência.

### O portfólio possui owner “TI”

Defina owner de negócio, técnico e operacional conforme a responsabilidade.

### A empresa quer uma única solução para todas as marcas

Verifique diferenças legítimas, custo de migração, contratos e risco operacional.

### A plataforma corporativa tem baixa adoção

Trate-a como produto: pesquise consumidores, reduza fricção, publique SLO e roadmap.

### O fornecedor não permite exportação simples

Registre risco, custo de saída, mitigação e decisão de renovação.

### A integração por arquivo não pode ser removida agora

Catalogue, monitore, proteja, defina owner e crie transição.

### A aquisição usa tecnologia diferente

Avalie capacidades, contratos e risco antes de impor o padrão central.

### O roadmap possui apenas datas

Inclua outcomes, owners, dependências, riscos e critérios de saída.

### A arquitetura central virou fila

Reforce modelo federado e decisões no nível mais próximo do contexto.

### A equipe quer desenhar todos os fóruns agora

Preserve governança técnica leve para a aula 662.

---

## Perguntas de revisão

1. O que é arquitetura corporativa?
2. O que é capacidade de negócio?
3. Qual diferença entre capacidade, domínio e aplicação?
4. Por que arquitetura corporativa não é um diagrama gigante?
5. O que é application portfolio?
6. O que significa TIME?
7. Por que legado não deve ser eliminado automaticamente?
8. O que é business fit?
9. O que é technical fit?
10. Por que dados compartilhados não exigem banco central?
11. O que deve existir em uma integração crítica?
12. O que significa plataforma como produto?
13. Por que fornecedor faz parte da arquitetura?
14. O que é exit strategy?
15. O que é arquitetura federada?
16. Por que padronização total é perigosa?
17. O que é arquitetura de referência?
18. O que é coexistência arquitetural?
19. Por que transição precisa de saída?
20. Como tratar aquisições?
21. O que uma transformation wave contém?
22. Como priorizar investimento?
23. Por que terceirização não transfere responsabilidade?
24. O que ficou para a próxima aula?
25. Qual é a próxima aula?

---

## Roteiro de resposta

1. Conexão entre estratégia, capacidades, dados, aplicações, tecnologia e evolução.
2. Algo que a organização consegue fazer.
3. Resultado, conhecimento e implementação.
4. Porque desenho sem ownership e decisão não orienta evolução.
5. Catálogo das aplicações e seu valor, risco, custo e lifecycle.
6. Tolerate, Invest, Migrate e Eliminate.
7. Porque pode sustentar capacidade crítica e regras não descobertas.
8. Adequação ao negócio.
9. Adequação técnica e operacional.
10. Porque domínios possuem semânticas e autoridades diferentes.
11. Owner, contrato, segurança, SLO, observabilidade e recuperação.
12. Serviço compartilhado com consumidores, SLO, suporte e roadmap.
13. Porque influencia continuidade, dados, custo e mudança.
14. Plano para reduzir ou encerrar dependência.
15. Direção compartilhada com ownership distribuído.
16. Porque contextos diferentes podem exigir soluções diferentes.
17. Caminho recomendado com variabilidade explícita.
18. Operação controlada de estados antigo e novo.
19. Para não virar permanência acidental.
20. Com discovery, inventário, segurança, capabilities e roadmap.
21. Outcome, owner, dependências, entrada e saída.
22. Por estratégia, valor, risco, custo e capacidade.
23. Porque a organização continua responsável pelo resultado.
24. Governança técnica leve.
25. Governança técnica leve.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
Aula 661 - M19.51 - Arquitetura corporativa brasileira

- Continuei após Mentoria e comunicação técnica.
- Tratei arquitetura corporativa como conexão entre estratégia e execução.
- Criei o laboratório `service-scheduling-enterprise-architecture`.
- Criei Enterprise Architecture Charter.
- Modelei o Grupo Nacional de Serviços.
- Criei Business Capability Map.
- Diferenciei capacidade, domínio e aplicação.
- Avaliei maturidade de capacidades.
- Criei Enterprise Domain Map.
- Mapeei marcas, unidades e aquisições.
- Criei Application Portfolio.
- Avaliei business fit e technical fit.
- Apliquei racionalização TIME.
- Considerei processos manuais e planilhas críticas.
- Criei Enterprise Data Catalog.
- Preservei autoridade por domínio.
- Evitei modelo canônico universal.
- Criei Integration Landscape.
- Classifiquei integrações críticas.
- Tratei integrações externas obrigatórias com ownership.
- Criei Platform Map.
- Tratei plataformas como produtos.
- Criei Vendor Dependency Map.
- Modelei exit strategies.
- Registrei restrições regulatórias e contratuais.
- Criei Architecture Principles com implicações.
- Criei Reference Architectures com variabilidade.
- Criei Federated Architecture Model.
- Criei Merger and Acquisition Playbook.
- Criei Coexistence Strategy.
- Defini autoridade durante transições.
- Criei Enterprise Roadmap por waves.
- Criei Investment Criteria.
- Considerei moeda, contrato e custo de coexistência.
- Preservei ownership interno em terceirização.
- Criei Operating Model mínimo.
- Executei testes de capabilities, portfolio, integrations, vendors e transitions.
- Criei reports, evidence e gate.
- Não antecipei governança técnica leve.
- Próxima aula: Governanca tecnica leve.
```

---

## Referência técnica curta

- Enterprise Architecture.
- Business Capability.
- Domain Map.
- Application Portfolio.
- TIME Model.
- Business Fit.
- Technical Fit.
- Integration Landscape.
- Platform as a Product.
- Vendor Risk.
- Exit Strategy.
- Reference Architecture.
- Federated Architecture.
- Merger and Acquisition.
- Coexistence Strategy.
- Transformation Wave.
- Investment Criteria.

Regra final:

```text
Arquitetura corporativa deve conectar estratégia e execução sem centralizar todas as decisões: o Grupo Nacional de Serviços começa por capacidades de negócio com owners e maturidade, diferencia capacidades, domínios e aplicações, mapeia marcas e aquisições, avalia o portfólio por business fit, technical fit, custo, risco e lifecycle, e usa Tolerate, Invest, Migrate e Eliminate com evidência e plano; dados possuem autoridades de domínio, integrações críticas possuem owner, contrato, segurança, SLO, observabilidade, recuperação e lifecycle, plataformas são produtos com consumidores, suporte, roadmap e exit strategy, e fornecedores entram na arquitetura por contrato, dados, suporte, lock-in, moeda, continuidade e portabilidade; princípios possuem implicações, arquiteturas de referência oferecem caminhos com variabilidade, o modelo federado separa direção corporativa, ownership de domínio, plataformas e autonomia dos times, aquisições passam por discovery, inventário, contenção, comparação de capacidades e racionalização, e coexistência define autoridade, adapters, reconciliation e saída; o roadmap organiza transformation waves por outcomes, dependências, riscos e critérios de entrada e saída, investimento considera estratégia, valor, risco, custo, reversibilidade e capacidade, e terceirização preserva ownership interno; o gate termina com capabilities, domains, units, applications, data, integrations, platforms, vendors, constraints, principles, references, federation, acquisitions, coexistence, roadmap, investment, testes, reports e evidence aprovados, enquanto governança técnica leve permanece reservada para a aula 662.
```
