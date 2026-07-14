# 618 - M19.08 - DDD estrategico

## Apresentação da aula

Na aula 617, você iniciou Domain-Driven Design pela descoberta do domínio.

Você criou:

```text
briefing;

roteiro de entrevista;

transcrição sintética;

glossário;

catálogo de regras;

exemplos;

contraexemplos;

registro de ambiguidades;

cenários;

mapa de conceitos;

perguntas abertas;

narrativa do modelo;

rastreabilidade entre regras,
testes
e código.
```

A conclusão mais importante foi:

```text
antes de modelar classes,
é necessário modelar
o entendimento.
```

Agora surge uma nova pergunta.

O domínio de agendamento de serviços possui muitos conceitos:

- solicitação;
- cliente;
- cobertura;
- disponibilidade;
- capacidade;
- janela;
- compromisso;
- confirmação;
- reagendamento;
- execução;
- impedimento;
- notificação;
- histórico;
- faturamento.

Todos esses conceitos precisam ficar dentro do mesmo modelo?

A resposta geralmente é:

```text
não.
```

Um sistema complexo dificilmente possui um único modelo coerente para toda a organização.

Termos como:

```text
cliente;
confirmação;
janela;
execução.
```

podem possuir significados diferentes conforme a área. Forçar todos esses significados em um modelo global mistura responsabilidades.

Tentar forçar todos esses significados em uma única classe global costuma produzir:

```text
CustomerEntity;

GenericStatus;

GlobalOrder;

SharedService;

UniversalDTO;

CommonRepository.
```

Essas estruturas parecem reutilizáveis, mas escondem diferenças importantes.

DDD estratégico ajuda a responder:

```text
quais partes do negócio
merecem modelos próprios?

onde uma linguagem
é válida?

quais fronteiras
precisam existir?

como contextos
devem se relacionar?

onde investir
mais energia de engenharia?

quais capacidades
podem ser compradas,
terceirizadas
ou simplificadas?
```

Nesta aula, você irá trabalhar com os principais elementos estratégicos de DDD:

- domínio;
- subdomínios;
- core domain;
- supporting subdomain;
- generic subdomain;
- bounded context;
- limites linguísticos;
- limites de modelo;
- contexto organizacional;
- context map;
- upstream;
- downstream;
- partnership;
- shared kernel;
- customer-supplier;
- conformist;
- anti-corruption layer;
- open host service;
- published language;
- separate ways;
- big ball of mud;
- decisões de investimento;
- riscos de integração;
- evolução de fronteiras.

O laboratório continuará usando o cenário iniciado na aula 617:

```text
agendamento de serviços técnicos.
```

O novo diretório será:

```text
labs/m19/aula-618-ddd-estrategico/service-scheduling-strategy
```

Você irá analisar o domínio e propor contextos candidatos:

```text
Customer Service;

Service Scheduling;

Capacity Management;

Field Execution;

Notifications;

Billing Integration.
```

Esses nomes são hipóteses avaliadas por:

- linguagem;
- regras;
- ritmo de mudança;
- dados;
- ownership;
- objetivos;
- integração;
- autonomia;
- necessidade de consistência;
- capacidade da equipe.

O resultado será uma decisão estratégica explícita e revisável.

A próxima aula oficial será:

```text
619 - M19.09 - DDD tatico
```

Na aula 619, você irá modelar internamente um dos contextos usando padrões como:

- entity;
- value object;
- aggregate;
- repository;
- factory;
- domain service;
- domain event.

Por isso, esta aula não irá implementar ainda um aggregate completo.

Também não irá criar:

- `AggregateRoot`;
- repositories táticos;
- factories táticas;
- value objects completos;
- domain services completos;
- entidades persistidas;
- invariantes implementadas em um aggregate.

A aula 620 será:

```text
620 - M19.10 - Ubiquitous Language
```

Nela, a linguagem ubíqua será aprofundada como prática contínua.

Nesta aula, a linguagem será usada para descobrir fronteiras, mas não será transformada ainda no laboratório dedicado da aula 620.

A regra central será:

```text
um bounded context
não é apenas
uma pasta,
um serviço
ou um banco;

é o limite
em que um modelo
e uma linguagem
mantêm significado coerente.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
616:
Modularizacao em Java.

617:
DDD fundamentos.

618:
DDD estrategico.

619:
DDD tatico.

620:
Ubiquitous Language.
```

A progressão é:

```text
proteger módulos tecnicamente;

descobrir conhecimento;

definir fronteiras estratégicas;

modelar dentro das fronteiras;

aprofundar a linguagem compartilhada.
```

Nesta aula:

```text
subdomínios:
sim.

core domain:
sim.

supporting subdomain:
sim.

generic subdomain:
sim.

bounded contexts:
sim.

context map:
sim.

relações entre contextos:
sim.

upstream e downstream:
sim.

ACL:
sim.

published language:
sim.

decisão de investimento:
sim.

aggregates:
não.

value objects táticos:
não.

repositories táticos:
não.

implementação distribuída:
não.

microservices:
não.
```

Um bounded context pode ser implementado como módulo, packages, artifact ou serviço. A topologia de deployment não define sozinha a fronteira.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m19/aula-618-ddd-estrategico/service-scheduling-strategy
├── README.md
├── discovery
│   ├── domain-scope.md
│   ├── business-capability-map.md
│   ├── terminology-conflicts.md
│   ├── rule-clusters.md
│   ├── change-cadence-analysis.md
│   ├── ownership-analysis.md
│   ├── consistency-analysis.md
│   ├── context-candidate-cards.md
│   ├── context-splitting-hypotheses.md
│   └── unresolved-strategic-questions.md
├── strategy
│   ├── subdomain-classification.md
│   ├── core-domain-investment.md
│   ├── bounded-context-canvas.md
│   ├── bounded-context-catalog.md
│   ├── context-map.md
│   ├── context-relationship-decisions.md
│   ├── integration-contract-catalog.md
│   ├── anti-corruption-layer-decisions.md
│   ├── context-evolution-plan.md
│   ├── strategic-risk-register.md
│   └── strategic-decision-log.md
├── architecture
│   ├── package-boundary-proposal.md
│   ├── deployment-options.md
│   ├── data-ownership-proposal.md
│   ├── team-ownership-proposal.md
│   ├── context-dependency-rules.md
│   └── implementation-readiness.md
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/schedulingstrategy
│   │           ├── customerservice
│   │           │   └── CustomerServiceContextApi.java
│   │           ├── scheduling
│   │           │   └── SchedulingContextApi.java
│   │           ├── capacity
│   │           │   └── CapacityContextApi.java
│   │           ├── execution
│   │           │   └── FieldExecutionContextApi.java
│   │           └── integration
│   │               └── LegacyCapacityAntiCorruptionLayer.java
│   └── test
│       └── java
│           └── br/com/formacao/schedulingstrategy
│               ├── StrategicBoundaryTest.java
│               ├── ContextDependencyTest.java
│               └── VocabularyBoundaryTest.java
├── contracts
│   ├── ddd-strategic-contract.yaml
│   ├── subdomain-classification-policy.yaml
│   ├── bounded-context-policy.yaml
│   ├── context-map-policy.yaml
│   ├── context-relationship-policy.yaml
│   ├── upstream-downstream-policy.yaml
│   ├── anti-corruption-layer-policy.yaml
│   ├── published-language-policy.yaml
│   ├── strategic-investment-policy.yaml
│   ├── data-quality-policy.yaml
│   └── failure-policy.yaml
├── reports
│   ├── subdomain-review-report.yaml
│   ├── bounded-context-review-report.yaml
│   ├── context-map-review-report.yaml
│   ├── integration-risk-report.yaml
│   ├── strategic-readiness-report.yaml
│   └── ddd-strategic-gate-report.yaml
└── pom.xml
```

Scripts:

```text
scripts/m19/service-scheduling-strategy
├── validate-ddd-strategic-contract.ps1
├── validate-subdomain-classification.ps1
├── validate-bounded-context-catalog.ps1
├── validate-context-map.ps1
├── validate-context-relationships.ps1
├── validate-context-language-boundaries.ps1
├── validate-context-data-ownership.ps1
├── validate-strategic-code-skeleton.ps1
├── run-ddd-strategic-tests.ps1
├── collect-ddd-strategic-evidence.ps1
└── verify-ddd-strategic-gate.ps1
```

Ao final, você terá uma proposta estratégica capaz de orientar a modelagem tática da aula 619.

---

## Conceito essencial

### Subdomínio

Parte do domínio que representa uma capacidade ou área de problema relevante.

---

### Core domain

Subdomínio que diferencia o negócio e merece maior investimento.

---

### Supporting subdomain

Subdomínio necessário para apoiar o core, mas que não representa a principal diferenciação.

---

### Generic subdomain

Capacidade necessária, porém comum a muitos negócios e frequentemente disponível como produto ou solução externa.

---

### Bounded context

Limite explícito em que um modelo, uma linguagem e suas regras são coerentes.

---

### Context map

Representação dos bounded contexts e das relações entre eles.

---

### Upstream

Contexto que fornece modelo, contrato ou informação para outro contexto.

---

### Downstream

Contexto que consome ou depende de um upstream.

---

### Partnership

Relação em que dois contextos precisam evoluir de forma coordenada e cooperativa.

---

### Shared kernel

Pequena parte do modelo compartilhada e mantida conjuntamente.

---

### Customer-supplier

Relação em que o downstream influencia prioridades e contratos do upstream.

---

### Conformist

Relação em que o downstream aceita o modelo do upstream sem tradução significativa.

---

### Anti-corruption layer

Camada de tradução que protege o modelo interno contra conceitos externos.

---

### Open host service

Serviço estável oferecido por um contexto para múltiplos consumidores.

---

### Published language

Contrato documentado e estável usado na integração.

---

### Separate ways

Decisão de não integrar dois contextos quando o custo supera o benefício.

---

### Big ball of mud

Área sem fronteiras confiáveis, modelo coerente ou ownership claro.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-618-ddd-estrategico/service-scheduling-strategy

Set-Location `
  labs/m19/aula-618-ddd-estrategico/service-scheduling-strategy
```

---

### 2. Importar descobertas da aula 617

Use como entrada:

- glossário;
- catálogo de regras;
- ambiguidades;
- cenários;
- mapa de conceitos;
- perguntas abertas;
- narrativa;
- decision log.

Não copie automaticamente todas as conclusões.

Registre a origem:

```text
source:
aula 617.

status:
entrada para análise estratégica.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/ddd-strategic-contract.yaml
```

Conteúdo:

```yaml
dddStrategic:
  required:
    - domain-scope
    - business-capabilities
    - subdomain-classification
    - bounded-context-candidates
    - context-boundaries
    - context-map
    - relationship-decisions
    - upstream-downstream
    - integration-contracts
    - data-ownership
    - team-ownership
    - strategic-risks
    - evolution-plan

  forbidden:
    - bounded-context-by-table
    - bounded-context-by-framework
    - microservice-per-context-automatic
    - aggregate-implementation
    - tactical-pattern-catalog

  nextLesson:
    code:
      M19.09
```

---

### 4. Delimitar o domínio analisado

Arquivo:

```text
discovery/domain-scope.md
```

Inclua:

```markdown
# Escopo do domínio

## Problema observado

## Resultado de negócio desejado

## Atores

## Capacidades envolvidas

## Processos próximos

## Processos externos

## Fora do escopo

## Perguntas estratégicas
```

Fora do escopo inicial:

- folha de pagamento;
- contabilidade geral;
- gestão completa de clientes;
- roteirização avançada;
- cobrança completa;
- recursos humanos.

---

### 5. Mapear capacidades

Arquivo:

```text
discovery/business-capability-map.md
```

Capacidades candidatas:

```text
receber solicitação;

validar cobertura;

consultar disponibilidade;

ofertar janelas;

assumir compromisso;

confirmar compromisso;

reagendar;

cancelar;

reservar capacidade;

acompanhar execução;

registrar impedimento;

notificar cliente;

integrar faturamento.
```

Capacidade não é automaticamente bounded context.

Ela é uma entrada para análise.

---

### 6. Agrupar regras

Arquivo:

```text
discovery/rule-clusters.md
```

Agrupamento inicial:

```text
Solicitação:
origem,
elegibilidade,
dados do cliente.

Agendamento:
janela,
compromisso,
confirmação,
reagendamento,
cancelamento.

Capacidade:
recursos,
região,
turno,
consumo,
liberação.

Execução:
aceite do técnico,
início,
impedimento,
conclusão.

Notificação:
template,
canal,
tentativa,
entrega.
```

Regras que mudam juntas podem indicar uma fronteira.

---

### 7. Analisar conflitos de linguagem

Arquivo:

```text
discovery/terminology-conflicts.md
```

Exemplo:

```markdown
## Termo: janela

Scheduling:
opção oferecida ao cliente.

Capacity:
intervalo com capacidade calculada.

Execution:
período esperado de chegada.

Risco:
um único tipo global pode misturar
oferta,
capacidade
e compromisso.
```

Outro:

```markdown
## Termo: confirmação

Scheduling:
cliente aceitou o compromisso.

Execution:
técnico assumiu a atividade.
```

Conflitos de significado são sinais fortes de contextos distintos.

---

### 8. Analisar ritmo de mudança

Arquivo:

```text
discovery/change-cadence-analysis.md
```

Pergunte:

- regras de capacidade mudam com frequência?
- templates de notificação mudam independentemente?
- regras de agendamento são estratégicas?
- execução depende de aplicativo externo?
- faturamento segue calendário próprio?
- uma mudança exige deploy coordenado?


---

### 9. Analisar ownership

Arquivo:

```text
discovery/ownership-analysis.md
```

Exemplo:

```text
Atendimento:
solicitação e dados de contato.

Planejamento:
regras de janela e compromisso.

Operações:
capacidade e execução.

Comunicação:
templates e canais.

Financeiro:
faturamento.
```


---

### 10. Analisar consistência

Arquivo:

```text
discovery/consistency-analysis.md
```

Pergunte:

```text
o que precisa acontecer
na mesma decisão?

o que pode ficar
eventualmente consistente?

qual falha exige rollback?

qual informação pode atrasar?

qual operação não pode duplicar?
```

Exemplo:

```text
confirmar um compromisso
e reservar capacidade
podem exigir coordenação forte.

enviar notificação
pode ocorrer depois.
```

Registre a necessidade sem escolher deployment distribuído.

---

### 11. Classificar subdomínios

Arquivo:

```text
strategy/subdomain-classification.md
```

Hipótese inicial:

```text
Core domain:
Service Scheduling.

Supporting subdomains:
Capacity Management;
Field Execution;
Customer Service.

Generic subdomains:
Notifications;
Identity;
Document storage.

External or generic integration:
Billing.
```


---

### 12. Criar policy de classificação

Arquivo:

```text
contracts/subdomain-classification-policy.yaml
```

Conteúdo:

```yaml
subdomainClassification:
  core:
    requires:
      - business-differentiation
      - strategic-value
      - complex-knowledge
      - investment-reason

  supporting:
    requires:
      - core-support
      - business-specific-need
      - lower-differentiation

  generic:
    requires:
      - common-capability
      - available-solution-or-standard-model

  classification:
    reviewable:
      required

  technologyPopularity:
    mustNotDefineCore:
      true
```

---

### 13. Justificar o core domain

Possível justificativa:

```text
A capacidade de combinar
cobertura,
disponibilidade,
restrições,
preferências
e compromisso

com baixo índice
de reagendamento

diferencia
a operação.
```

O core não é definido por tamanho, idade, banco ou tecnologia.

---

### 14. Planejar investimento

Arquivo:

```text
strategy/core-domain-investment.md
```

Para o core:

- melhores especialistas;
- modelagem frequente;
- testes mais ricos;
- observabilidade;
- revisão arquitetural;
- menor acoplamento;
- evolução cuidadosa.

Para generic subdomain:

- comprar;
- reutilizar;
- terceirizar;
- usar solução padrão;
- evitar inovação sem retorno.

---

### 15. Criar policy de investimento

Arquivo:

```text
contracts/strategic-investment-policy.yaml
```

Conteúdo:

```yaml
investment:
  coreDomain:
    priority:
      highest

  supportingSubdomain:
    fitForPurpose:
      required

  genericSubdomain:
    buildCustom:
      requiresExplicitJustification

  equalInvestmentForAllContexts:
    discouraged

  classificationChange:
    decisionLog:
      required
```

---

### 16. Criar cards de contextos candidatos

Arquivo:

```text
discovery/context-candidate-cards.md
```

Modelo:

```markdown
## Candidate: Service Scheduling

Propósito:
Assumir e manter compromissos de atendimento.

Linguagem principal:
janela,
agendamento,
confirmação,
reagendamento,
cancelamento.

Regras principais:
REG-001,
REG-003,
REG-004,
REG-005.

Dados próprios:
compromisso,
histórico de reagendamento.

Dependências:
Customer Service;
Capacity Management.

Riscos:
misturar disponibilidade com compromisso.
```

---

### 17. Definir bounded context canvas

Arquivo:

```text
strategy/bounded-context-canvas.md
```

Para cada contexto:

- nome;
- propósito;
- linguagem;
- decisões;
- regras;
- dados;
- API;
- eventos;
- upstreams;
- downstreams;
- owner;
- frequência de mudança;
- limites;
- dúvidas.

---

### 18. Criar bounded context policy

Arquivo:

```text
contracts/bounded-context-policy.yaml
```

Conteúdo:

```yaml
boundedContext:
  requires:
    - purpose
    - language
    - model
    - rules
    - data-ownership
    - owner
    - boundaries
    - integration-points

  mustNotBeDefinedOnlyBy:
    - table
    - package
    - framework
    - team-name
    - deployable-unit

  oneModelForAllContexts:
    forbidden

  boundary:
    evolutionary:
      true
```

---

### 19. Propor catálogo de contextos

Arquivo:

```text
strategy/bounded-context-catalog.md
```

Proposta:

```text
Customer Service Context:
captura e mantém a solicitação.

Service Scheduling Context:
assume e altera o compromisso.

Capacity Management Context:
calcula e reserva capacidade.

Field Execution Context:
acompanha a execução em campo.

Notification Context:
entrega comunicações.

Billing Integration Context:
traduz fatos para o sistema financeiro.
```

---

### 20. Diferenciar subdomínio e bounded context

Subdomínio:

```text
parte do espaço do problema.
```

Bounded context:

```text
limite da solução
em que um modelo é válido.
```

Eles podem se alinhar um para um.

Mas não é obrigatório.

Exemplo:

```text
um subdomínio grande
pode ter dois contextos;

dois subdomínios simples
podem compartilhar
um contexto inicial.
```

---

### 21. Criar hipóteses de divisão

Arquivo:

```text
discovery/context-splitting-hypotheses.md
```

Exemplo:

```markdown
## Hipótese H-CTX-001

Separar Capacity Management
de Service Scheduling.

Evidências:
- linguagem diferente;
- ownership diferente;
- regras de cálculo próprias;
- ritmo de mudança próprio.

Risco:
consistência na reserva.

Experimento:
modelar contrato de oferta
e reserva de capacidade.
```

---

### 22. Criar context map

Arquivo:

```text
strategy/context-map.md
```

Representação inicial:

```text
Customer Service
      |
      | Customer-Supplier
      v
Service Scheduling
      |
      | Customer-Supplier
      v
Capacity Management

Service Scheduling
      |
      | Published Events
      v
Notifications

Field Execution
      |
      | ACL
      v
Legacy Workforce System

Service Scheduling
      |
      | Published Language
      v
Billing Integration
```


---

### 23. Criar context map policy

Arquivo:

```text
contracts/context-map-policy.yaml
```

Conteúdo:

```yaml
contextMap:
  context:
    mustExistInCatalog:
      true

  relationship:
    requires:
      - type
      - upstream
      - downstream
      - contract
      - owner
      - risk

  unlabeledArrow:
    forbidden

  deploymentTopologyOnly:
    insufficient

  cycle:
    requiresReview:
      true
```

---

### 24. Identificar upstream e downstream

Exemplo:

```text
Capacity Management:
upstream da informação de capacidade.

Service Scheduling:
downstream que consome capacidade.
```


Se Scheduling é o core, ele pode precisar influenciar o contrato de Capacity.

Isso pode configurar:

```text
customer-supplier.
```

---

### 25. Criar upstream-downstream policy

Arquivo:

```text
contracts/upstream-downstream-policy.yaml
```

Conteúdo:

```yaml
relationship:
  upstream:
    owns:
      source-model

  downstream:
    owns:
      internal-model

  contract:
    versioned:
      required

  accidentalDependency:
    forbidden

  changeNotification:
    required

  ownershipUnknown:
    result:
      INCONCLUSIVE
```

---

### 26. Avaliar partnership

Use partnership quando:

- equipes possuem objetivos alinhados;
- mudanças precisam ser coordenadas;
- sucesso é compartilhado;
- contrato evolui em conjunto.

Risco:

```text
acoplamento organizacional constante.
```


---

### 27. Avaliar shared kernel

Shared kernel pode compartilhar uma pequena parte do modelo.

Exemplo possível:

```text
ServiceAreaCode.
```

Mas exige:

- ownership conjunto;
- testes conjuntos;
- processo de mudança;
- compatibilidade;
- baixo volume de elementos.

Evite compartilhar:

- entidades completas;
- repositories;
- status globais;
- DTO universal.

Nesta aula, registre a decisão.

Não implemente um catálogo tático.

---

### 28. Avaliar customer-supplier

Possível relação:

```text
Service Scheduling
é cliente de
Capacity Management.
```

Scheduling precisa de:

- ofertas de janela;
- reserva;
- liberação;
- motivo de indisponibilidade.

Capacity define sua implementação.

Scheduling influencia o contrato necessário.

---

### 29. Avaliar conformist

Conformist pode ser aceitável quando:

- upstream é externo;
- downstream tem pouca influência;
- tradução custa mais que o benefício;
- modelo externo é suficientemente adequado.

Risco:

```text
modelo externo invade
a linguagem interna.
```


---

### 30. Criar anti-corruption layer decision

Arquivo:

```text
strategy/anti-corruption-layer-decisions.md
```

Cenário:

```text
Legacy Workforce System
usa:

JOB;

SLOT_CODE;

TECH_STATE;

FAIL_REASON.
```

Field Execution Context usa:

```text
ServiceExecution;

ArrivalWindow;

TechnicianAssignment;

ExecutionImpediment.
```

Uma ACL traduz:

```text
JOB -> ServiceExecution;

SLOT_CODE -> ArrivalWindow;

FAIL_REASON -> ExecutionImpediment.
```

---

### 31. Criar ACL policy

Arquivo:

```text
contracts/anti-corruption-layer-policy.yaml
```

Conteúdo:

```yaml
antiCorruptionLayer:
  usedWhen:
    - external-model-conflicts
    - legacy-model-risk
    - vendor-contract-instability

  responsibilities:
    - translate-language
    - translate-data
    - translate-errors
    - isolate-versioning

  forbidden:
    - business-rule-duplication
    - silent-data-loss
    - external-type-inside-domain-model
```

---

### 32. Criar esqueleto de ACL

```java
public final class LegacyCapacityAntiCorruptionLayer {

    private final LegacyCapacityClient client;

    public CapacityOfferResponse findOffers(
            CapacityOfferRequest request) {

        LegacySlotRequest legacyRequest =
                LegacyCapacityMapper.toLegacy(
                        request);

        LegacySlotResponse legacyResponse =
                client.findSlots(
                        legacyRequest);

        return LegacyCapacityMapper.toInternal(
                legacyResponse);
    }
}
```

O objetivo é demonstrar tradução de fronteira.

Não implementar o domínio tático completo.

---

### 33. Avaliar open host service

Capacity Management pode oferecer um contrato estável para vários consumidores:

```text
consultar ofertas;

reservar capacidade;

liberar capacidade.
```

Isso pode ser um open host service.

Ele precisa de:

- contrato;
- versionamento;
- autenticação;
- erro;
- compatibilidade;
- documentação.


---

### 34. Avaliar published language

Exemplo de linguagem publicada:

```text
CapacityOffer;

CapacityReservation;

CapacityRelease;

ServiceAreaCode;

AppointmentWindowCandidate.
```

O contrato precisa ser:

- documentado;
- versionado;
- testável;
- independente de tabelas internas.

O aprofundamento da linguagem ubíqua ocorrerá na aula 620.

---

### 35. Criar published language policy

Arquivo:

```text
contracts/published-language-policy.yaml
```

Conteúdo:

```yaml
publishedLanguage:
  requires:
    - stable-terms
    - schema
    - examples
    - compatibility-policy
    - ownership

  internalEntityExposure:
    forbidden

  databaseRecordExposure:
    forbidden

  ambiguousTerm:
    forbidden

  versioning:
    explicit:
      required
```

---

### 36. Avaliar separate ways

Nem toda integração é necessária.

Exemplo:

```text
relatório de capacidade
e relatório de faturamento

podem manter
fontes separadas

se o custo de unificação
for maior que o benefício.
```

Separate ways reduz acoplamento quando a integração não compensa.

---

### 37. Identificar big ball of mud

Sinais incluem linguagem instável, acesso irrestrito a dados, dependências ocultas e ownership ausente. Marque a área herdada como `Big Ball of Mud` em vez de inventar boundaries confiáveis.

---

### 38. Criar catálogo de contratos

Arquivo:

```text
strategy/integration-contract-catalog.md
```

Para cada integração:

```markdown
## INT-001 — Scheduling consulta capacidade

Upstream:
Capacity Management.

Downstream:
Service Scheduling.

Relationship:
Customer-Supplier.

Contract:
Capacity Offer API.

Language:
Published Language.

Consistency:
Consulta síncrona;
reserva confirmada.

Owner:
Capacity Team.

Risk:
Mudança de regra de slot.
```

---

### 39. Definir data ownership

Arquivo:

```text
architecture/data-ownership-proposal.md
```

Proposta:

```text
Customer Service:
solicitações e contatos.

Service Scheduling:
compromissos e histórico de alteração.

Capacity Management:
capacidade e reservas.

Field Execution:
execuções e impedimentos.

Notifications:
tentativas e entrega.

Billing Integration:
estado da integração financeira.
```

Banco único não elimina ownership.

---

### 40. Definir team ownership

Arquivo:

```text
architecture/team-ownership-proposal.md
```

Evite criar um contexto sem owner.

Registre:

- equipe;
- product owner;
- especialista;
- contato;
- decisão;
- suporte;
- janela de mudança.

A topologia de equipe influencia a arquitetura.

---

### 41. Definir regras de dependência

Arquivo:

```text
architecture/context-dependency-rules.md
```

Exemplos:

```text
Scheduling não acessa
tabelas de Capacity.

Notifications não acessa
modelo interno de Scheduling.

Billing recebe
contrato publicado.

Field Execution traduz
modelo legado por ACL.

Customer Service não altera
compromissos diretamente.
```

---

### 42. Criar package proposal

Arquivo:

```text
architecture/package-boundary-proposal.md
```

Exemplo:

```text
br.com.formacao.services
├── customerservice
├── scheduling
├── capacity
├── execution
├── notifications
└── billingintegration
```

Cada raiz possuirá:

- API;
- internal;
- integration;
- tests.

Essa é apenas uma opção de implementação.

Bounded context não é sinônimo de package.

---

### 43. Criar APIs de contexto mínimas

```java
public interface SchedulingContextApi {

    SchedulingResult schedule(
            ScheduleServiceCommand command);

    SchedulingResult confirm(
            ConfirmAppointmentCommand command);

    SchedulingResult reschedule(
            RescheduleAppointmentCommand command);
}
```

Use nomes estratégicos.

Não implemente aggregate nesta aula.

---

### 44. Criar Capacity API

```java
public interface CapacityContextApi {

    List<CapacityOfferResponse> findOffers(
            CapacityOfferRequest request);

    CapacityReservationResponse reserve(
            CapacityReservationRequest request);

    void release(
            CapacityReleaseRequest request);
}
```

A API não expõe repository ou entity.

---

### 45. Criar teste de boundary

```java
@ArchTest
static final ArchRule schedulingMustNotAccessCapacityInternals =
        noClasses()
                .that()
                .resideInAPackage(
                        "..scheduling..")
                .should()
                .dependOnClassesThat()
                .resideInAPackage(
                        "..capacity.internal..");
```

---

### 46. Criar vocabulary boundary test

O teste verifica se termos externos não entram no contexto.

Exemplo:

```text
SLOT_CODE
não deve aparecer
em scheduling.
```

O termo deve ser traduzido para:

```text
AppointmentWindowCandidate.
```

---

### 47. Criar context dependency test

Valide:

- dependências permitidas;
- internals proibidos;
- ciclos;
- APIs;
- ACL;
- contratos publicados.

O esqueleto não substitui o context map.

Ele apenas valida a viabilidade da proposta.

---

### 48. Criar strategic risk register

Arquivo:

```text
strategy/strategic-risk-register.md
```

Riscos:

- boundary baseado apenas na organização atual;
- core domain classificado incorretamente;
- contexto grande demais;
- contexto pequeno demais;
- integração síncrona excessiva;
- shared kernel crescente;
- ACL duplicando regra;
- linguagem ambígua publicada;
- ownership inexistente;
- consistência não definida;
- microservice prematuro.

---

### 49. Criar plano de evolução

Arquivo:

```text
strategy/context-evolution-plan.md
```

Etapas possíveis:

```text
1. proteger packages;

2. publicar APIs internas;

3. remover acesso direto a dados;

4. criar ACL para legado;

5. versionar contratos;

6. medir dependências;

7. revisar ownership;

8. avaliar deployment separado
somente se necessário.
```


---

### 50. Criar decision log

Arquivo:

```text
strategy/strategic-decision-log.md
```

Exemplo:

```markdown
## STR-DEC-001

Decisão:
Service Scheduling será o core domain inicial.

Motivo:
Otimização de compromisso
é diferenciação operacional.

Alternativas:
Capacity como core;
contexto único Scheduling + Capacity.

Riscos:
Dependência forte de Capacity.

Revisão:
Após três meses de métricas de reagendamento.
```

---

### 51. Criar data quality policy

Arquivo:

```text
contracts/data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  contextWithoutPurpose:
    result:
      incomplete

  subdomainWithoutJustification:
    result:
      unsupported

  unlabeledRelationship:
    action:
      FAIL

  upstreamWithoutOwner:
    action:
      FAIL

  internalTypeInPublishedContract:
    action:
      FAIL

  boundedContextEqualToMicroserviceAutomatically:
    action:
      FAIL
```

---

### 52. Criar failure policy

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  contextByTableOnly:
    action:
      FAIL

  contextMapWithoutRelationships:
    action:
      FAIL

  ambiguousPublishedLanguage:
    action:
      FAIL

  directInternalDependency:
    action:
      FAIL

  TacticalDDD:
    deferredToLesson619

  UbiquitousLanguageDeepDive:
    deferredToLesson620
```

---

### 53. Validar classificação

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\validate-subdomain-classification.ps1
```

Confirme:

- justificativa;
- valor estratégico;
- complexidade;
- diferenciação;
- investimento;
- revisão.

---

### 54. Validar contextos

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\validate-bounded-context-catalog.ps1
```

Procure:

- contexto sem propósito;
- linguagem indefinida;
- modelo global;
- owner ausente;
- dados sem ownership;
- fronteira por tabela;
- contexto sem integração explícita.

---

### 55. Validar context map

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\validate-context-map.ps1
```

Toda seta precisa de:

- tipo;
- upstream;
- downstream;
- contrato;
- owner;
- risco.

---

### 56. Validar relações

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\validate-context-relationships.ps1
```

Confirme:

- partnership justificado;
- shared kernel pequeno;
- conformist consciente;
- ACL documentada;
- published language versionada;
- separate ways explícito.

---

### 57. Validar linguagem por contexto

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\validate-context-language-boundaries.ps1
```

Procure:

- termos globais ambíguos;
- vocabulário legado vazando;
- mesmo termo com definições conflitantes;
- contrato publicado sem definição.

A prática completa de linguagem será aprofundada na aula 620.

---

### 58. Validar data ownership

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\validate-context-data-ownership.ps1
```

Confirme:

- um owner por dado;
- acesso cruzado proibido;
- integração por contrato;
- migração com owner;
- ausência de repository compartilhado.

---

### 59. Executar testes

Execute:

```powershell
.\scripts\m19\service-scheduling-strategy\run-ddd-strategic-tests.ps1
```

Ou:

```powershell
mvn test
```

Os testes validam o esqueleto arquitetural.

Eles não provam que a estratégia está correta.

A estratégia também precisa de validação com especialistas e equipes.

---

### 60. Criar reports

Exemplo:

```yaml
subdomainReview:
  core:
    Service-Scheduling

  supporting:
    - Capacity-Management
    - Field-Execution
    - Customer-Service

  generic:
    - Notifications
    - Identity

  unsupportedClassifications:
    0

  result:
    PASS
```

---

### 61. Criar gate

O gate valida:

```text
escopo;

capacidades;

subdomínios;

classificação;

bounded contexts;

linguagem por contexto;

dados;

ownership;

context map;

relações;

upstream e downstream;

ACL;

published language;

riscos;

evolução;

esqueleto arquitetural;

evidence.
```

Status:

```text
PASS;

PASS_WITH_OPEN_QUESTIONS;

FAIL_SUBDOMAIN;

FAIL_CORE_DOMAIN;

FAIL_BOUNDED_CONTEXT;

FAIL_CONTEXT_MAP;

FAIL_RELATIONSHIP;

FAIL_OWNERSHIP;

FAIL_DATA_BOUNDARY;

FAIL_INTEGRATION_CONTRACT;

FAIL_STRATEGIC_ALIGNMENT;

INCONCLUSIVE.
```

---

### 62. Coletar evidence

Arquivo:

```text
contracts/ddd-strategic-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- domain scope status;
- capability map status;
- core domain;
- supporting subdomains;
- generic subdomains;
- bounded context count;
- context catalog status;
- context map status;
- relationship status;
- ownership status;
- data boundary status;
- ACL status;
- published language status;
- strategic risk count;
- open question count;
- architecture skeleton status;
- test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados pessoais;
- segredos;
- nomes reais de empresas;
- contratos reais;
- aggregate implementation;
- repository tático;
- conteúdo completo da aula 619;
- laboratório dedicado da aula 620.

---

### 63. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-strategy\validate-ddd-strategic-contract.ps1

.\scripts\m19\service-scheduling-strategy\validate-subdomain-classification.ps1

.\scripts\m19\service-scheduling-strategy\validate-bounded-context-catalog.ps1

.\scripts\m19\service-scheduling-strategy\validate-context-map.ps1

.\scripts\m19\service-scheduling-strategy\validate-context-relationships.ps1

.\scripts\m19\service-scheduling-strategy\validate-context-language-boundaries.ps1

.\scripts\m19\service-scheduling-strategy\validate-context-data-ownership.ps1

.\scripts\m19\service-scheduling-strategy\validate-strategic-code-skeleton.ps1

.\scripts\m19\service-scheduling-strategy\run-ddd-strategic-tests.ps1

.\scripts\m19\service-scheduling-strategy\collect-ddd-strategic-evidence.ps1

.\scripts\m19\service-scheduling-strategy\verify-ddd-strategic-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 64. Encerrar o laboratório

Confirme:

- classificação justificada;
- core domain explícito;
- contextos com propósito;
- linguagem por contexto;
- owners definidos;
- data ownership definido;
- context map rotulado;
- relações justificadas;
- ACLs documentadas;
- contratos publicados controlados;
- perguntas abertas registradas;
- nenhum aggregate implementado;
- nenhuma modelagem tática antecipada;
- nenhum dado sensível;
- reports sanitizados.

---

## Entendendo o que foi feito

### O domínio ganhou partes estratégicas

Capacidades deixaram de ser tratadas como um bloco único.

### O core ganhou prioridade

Investimento passou a considerar diferenciação de negócio.

### Os contextos ganharam propósito

Fronteiras deixaram de ser definidas apenas por packages ou tabelas.

### A linguagem ganhou limite

Termos passaram a possuir significado dentro de contextos específicos.

### O mapa ganhou relações

Setas deixaram de representar dependências genéricas.

### Upstream e downstream ganharam ownership

Integrações passaram a reconhecer quem fornece e quem consome.

### A ACL ganhou função protetora

Modelos externos deixaram de invadir silenciosamente o núcleo.

### A published language ganhou contrato

Integração deixou de depender de records internos.

### O deployment ganhou independência da modelagem

Bounded context deixou de ser tratado automaticamente como microservice.

### A próxima aula ganhou fronteira

DDD tático fica para a aula 619.

---

## Erros comuns importantes

### Definir contexto por tabela

O banco passa a controlar o modelo.

### Definir contexto por microservice

Deployment substitui análise do domínio.

### Tratar todo subdomínio como core

Investimento perde prioridade.

### Criar contexto pequeno demais

Coordenação e contratos aumentam sem benefício.

### Criar contexto grande demais

A linguagem perde coerência.

### Usar shared kernel como pasta global

Acoplamento cresce.

### Publicar entidades internas

A fronteira fica frágil.

### Usar ACL para duplicar regra

A tradução assume política indevida.

### Desenhar caixas sem relações

O context map fica incompleto.

### Antecipar aggregates

A estratégia é substituída por implementação prematura.

---

## Comandos úteis

### Validar subdomínios

```powershell
.\scripts\m19\service-scheduling-strategy\validate-subdomain-classification.ps1
```

### Validar contextos

```powershell
.\scripts\m19\service-scheduling-strategy\validate-bounded-context-catalog.ps1
```

### Validar context map

```powershell
.\scripts\m19\service-scheduling-strategy\validate-context-map.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-strategy\run-ddd-strategic-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-strategy\verify-ddd-strategic-gate.ps1
```

---

## Exercício guiado

### Parte 1 — Escopo

Defina problema, atores e capacidades.

### Parte 2 — Regras agrupadas

Agrupe regras que mudam juntas.

### Parte 3 — Subdomínios

Classifique core, supporting e generic.

### Parte 4 — Contextos

Crie bounded context canvases.

### Parte 5 — Linguagem

Identifique termos que mudam de significado.

### Parte 6 — Context map

Modele relações rotuladas.

### Parte 7 — Integração

Escolha ACL, published language ou outra relação.

### Parte 8 — Ownership

Defina equipes e dados.

### Parte 9 — Evolução

Crie plano incremental.

### Parte 10 — Gate

Valide estratégia, riscos e perguntas abertas.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 617 e ponte para a aula 619 foram preservadas;
- o laboratório `service-scheduling-strategy` foi criado;
- escopo do domínio e capacidades foram documentados;
- regras foram agrupadas por responsabilidade;
- conflitos de linguagem foram usados como sinal de fronteira;
- ritmo de mudança, ownership e consistência foram analisados;
- subdomínios core, supporting e generic foram classificados;
- classificação possui justificativa e possibilidade de revisão;
- core domain possui estratégia de investimento;
- bounded contexts possuem propósito, linguagem, regras, dados e owner;
- bounded contexts não foram definidos apenas por tabela, package ou framework;
- diferença entre subdomínio e bounded context foi registrada;
- context map contém relacionamentos rotulados;
- upstream e downstream foram definidos;
- partnership, shared kernel, customer-supplier e conformist foram avaliados;
- ACL foi proposta para modelo legado conflitante;
- open host service e published language foram avaliados;
- separate ways foi tratado como decisão possível;
- big ball of mud foi reconhecido quando aplicável;
- contratos de integração possuem owner, risco e compatibilidade;
- data ownership e team ownership foram definidos;
- regras de dependência entre contextos foram documentadas;
- esqueleto Java não acessa internals de outro contexto;
- testes protegem boundaries e vocabulário externo;
- plano de evolução não começa por microservices;
- perguntas abertas e riscos foram registrados;
- nenhum aggregate, repository tático ou value object formal foi implementado;
- o laboratório dedicado de Ubiquitous Language não foi antecipado;
- reports, gate e evidence foram criados;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-618-ddd-estrategico/service-scheduling-strategy `
  scripts/m19/service-scheduling-strategy `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerRealName|companyRealName|aggregateRootImplementation|valueObjectCatalog|repositoryTacticalImplementation|ubiquitousLanguageWorkshopComplete"
```

Commit recomendado:

```powershell
git commit -m "docs(m19): modelar DDD estrategico"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- dados pessoais;
- nomes reais;
- contratos corporativos reais;
- aggregates;
- repositories táticos;
- microservices;
- conteúdo completo da aula 620.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aplicou DDD estratégico.

Você criou:

```text
mapa de capacidades;

agrupamento de regras;

classificação de subdomínios;

core domain;

supporting subdomains;

generic subdomains;

bounded context canvases;

catálogo de contextos;

context map;

relações upstream/downstream;

ACL decisions;

published language;

data ownership;

team ownership;

riscos;

plano de evolução.
```

Você comprovou que modelos e palavras possuem validade contextual; que o core orienta investimento; que context maps precisam de relações; que ACL protege contra modelos externos; que published language estabiliza integração; e que bounded context não significa microservice.

A próxima aula será:

```text
619 - M19.09 - DDD tatico
```

Nela, você escolherá um bounded context e irá modelar entities, value objects, aggregates, repositories, factories, domain services e domain events de forma alinhada às decisões estratégicas.

Nenhum aggregate completo, repository tático, factory de domínio, value object formal ou domain service tático foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei subdomínios.
- [ ] Justifiquei o core domain.
- [ ] Criei bounded context canvases.
- [ ] Modelei context map com relações.
- [ ] Defini upstream e downstream.
- [ ] Avaliei ACL e published language.
- [ ] Defini data e team ownership.
- [ ] Registrei riscos e evolução.

---

## Troubleshooting adicional

### Todo contexto parece core

Revise diferenciação, valor e investimento.

### Contextos coincidem com tabelas

Volte às regras, linguagem e ownership.

### O context map possui apenas setas

Rotule relações, contratos e direção.

### Dois contextos usam o mesmo termo

Registre significados locais e traduções.

### Shared kernel cresce

Reduza o compartilhamento e publique contratos.

### ACL contém regras de negócio

Mantenha tradução e isolamento como foco.

### O downstream não influencia o upstream

Avalie conformist ou proteção por ACL.

### A equipe quer um microservice por contexto

Separe boundary lógico de deployment.

### O contexto não possui owner

A fronteira provavelmente não será sustentável.

### O laboratório começou a implementar aggregates

Preserve a implementação tática para a aula 619.

---

## Perguntas de revisão

1. O que é subdomínio?
2. O que é core domain?
3. O que é supporting subdomain?
4. O que é generic subdomain?
5. O que é bounded context?
6. Qual diferença entre subdomínio e bounded context?
7. O que é context map?
8. O que é upstream?
9. O que é downstream?
10. O que é partnership?
11. O que é shared kernel?
12. O que é customer-supplier?
13. O que é conformist?
14. O que é anti-corruption layer?
15. O que é open host service?
16. O que é published language?
17. O que é separate ways?
18. Por que bounded context não é microservice?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Parte relevante do espaço do problema.
2. Parte diferenciadora que merece maior investimento.
3. Parte específica que apoia o core.
4. Capacidade comum que pode usar solução padrão.
5. Limite em que modelo e linguagem são coerentes.
6. Problema versus limite da solução.
7. Mapa dos contextos e relações.
8. Contexto que fornece modelo ou contrato.
9. Contexto que consome.
10. Evolução cooperativa entre contextos.
11. Pequena parte compartilhada com ownership conjunto.
12. Downstream influencia contrato do upstream.
13. Downstream aceita modelo do upstream.
14. Camada de tradução protetora.
15. Serviço estável para múltiplos consumidores.
16. Linguagem de integração documentada.
17. Decisão de não integrar.
18. Deployment é decisão diferente da fronteira do modelo.
19. DDD tático.
20. DDD tático.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 618 - M19.08 - DDD estrategico

- Analisei o domínio de agendamento em partes estratégicas.
- Criei mapa de capacidades de negócio.
- Agrupei regras por responsabilidade e ritmo de mudança.
- Analisei conflitos de linguagem, ownership e consistência.
- Classifiquei core, supporting e generic subdomains.
- Justifiquei Service Scheduling como core domain inicial.
- Criei estratégia de investimento por tipo de subdomínio.
- Criei bounded context canvases.
- Propus Customer Service, Service Scheduling, Capacity Management, Field Execution, Notifications e Billing Integration.
- Diferenciei subdomínio de bounded context.
- Criei context map com relações rotuladas.
- Defini upstream e downstream.
- Avaliei partnership, shared kernel, customer-supplier e conformist.
- Propus ACL para sistemas legados.
- Modelei open host service e published language.
- Defini data ownership e team ownership.
- Criei contratos de integração, riscos e plano de evolução.
- Protegi boundaries com testes arquiteturais.
- Não antecipei DDD tático ou o laboratório dedicado de Ubiquitous Language.
- Próxima aula: DDD tático.
```

---

## Referência técnica curta

- Strategic Domain-Driven Design.
- Subdomains.
- Core Domain.
- Supporting Subdomain.
- Generic Subdomain.
- Bounded Context.
- Context Mapping.
- Upstream and Downstream.
- Anti-Corruption Layer.
- Published Language.

Regra final:

```text
DDD estratégico precisa transformar conhecimento em decisões explícitas de fronteira e investimento: capacidades, regras, conflitos de linguagem, ritmo de mudança, ownership e consistência ajudam a classificar core, supporting e generic subdomains, enquanto bounded contexts definem onde um modelo, uma linguagem, regras, dados e responsabilidades permanecem coerentes; subdomínio pertence ao espaço do problema e bounded context ao desenho da solução, portanto a relação não é automaticamente um para um e nenhum contexto é definido apenas por tabela, package, framework ou microservice; o context map registra upstream, downstream, contrato, owner, risco e padrão de relação, partnership exige coordenação real, shared kernel permanece mínimo, customer-supplier explicita influência, conformist é consciente, ACL traduz modelos externos, open host service oferece contrato estável, published language evita exposição de internals e separate ways pode ser melhor que integração forçada; o gate valida classificação, contextos, relações, data ownership, team ownership, contratos, riscos e evolução, enquanto entities, value objects, aggregates, repositories, factories e domain services começam somente na aula 619, e o aprofundamento dedicado de Ubiquitous Language permanece reservado à aula 620.
```
