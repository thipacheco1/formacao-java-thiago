# 677 - M20.07 - ADRs do projeto

## Apresentação da aula

Na aula 676, você consolidou a arquitetura C4 final do OrderFlow.

O projeto passou a possuir:

- pessoas;
- sistemas externos;
- System Context;
- containers;
- componentes;
- relações síncronas;
- relações assíncronas;
- Dynamic Views;
- Deployment View;
- trust boundaries;
- mapa de dados;
- mapa de observabilidade;
- matriz de responsabilidades;
- constraints arquiteturais;
- entradas candidatas para ADRs;
- rastreabilidade;
- riscos;
- testes;
- reports;
- evidence;
- gate arquitetural.

A arquitetura já mostra o que existe e como as partes se relacionam.

Agora é necessário registrar por que as principais decisões foram tomadas.

Esse registro será feito com ADRs:

```text
Architecture Decision Records.
```

Um ADR não é um documento longo de arquitetura.

Ele registra uma decisão específica e relevante.

Cada ADR deve responder:

```text
qual problema exigiu decisao;

qual contexto existia;

quais alternativas foram avaliadas;

qual alternativa foi escolhida;

quais consequencias surgiram;

qual evidencia sustenta a decisao;

quem possui a decisao;

quando ela deve ser revisada;

qual decisao anterior
ela substitui ou complementa.
```

O erro comum seria transformar ADR em justificativa posterior.

Exemplo:

```text
Decidimos usar Kafka
porque Kafka e escalavel.
```

Essa frase não informa:

- qual problema existia;
- quais opções foram comparadas;
- qual volume foi considerado;
- qual risco foi aceito;
- qual custo operacional apareceu;
- qual evidence sustenta a escolha;
- quando a decisão deve ser reaberta.

Outro erro seria criar ADR para toda escolha pequena.

Exemplos que normalmente não precisam de ADR:

- nome de variável;
- biblioteca de teste unitário sem impacto relevante;
- organização interna de um package local;
- pequena refatoração reversível;
- configuração temporária de ambiente.

ADRs devem ser usados quando a decisão possui:

- impacto amplo;
- custo de reversão;
- risco relevante;
- múltiplas alternativas;
- influência sobre times ou componentes;
- efeito sobre segurança, dados ou operação;
- necessidade de memória organizacional.

Nesta aula, você formalizará as principais decisões do OrderFlow.

Serão criados ADRs para:

```text
ADR-001:
Aplicacao Java modular
com workers assincronos.

ADR-002:
PostgreSQL como autoridade
do OrderFlow.

ADR-003:
Outbox e Inbox
para confiabilidade de eventos.

ADR-004:
Integration Gateway
para isolar providers.

ADR-005:
Schema logico unico
com ownership explicito.

ADR-006:
Orquestracao orientada a eventos.

ADR-007:
Projection operacional separada.

ADR-008:
Optimistic locking
para concorrencia do aggregate.

ADR-009:
Chaves e acesso
com escopo de tenant.

ADR-010:
OpenTelemetry
como padrao de observabilidade.

ADR-011:
Idempotency Registry
para comandos criticos.

ADR-012:
Expand-contract
para evolucao de banco.
```

O laboratório será:

```text
labs/m20/aula-677-adrs-do-projeto/orderflow-architecture-decisions
```

Você criará:

- ADR Charter;
- policy de ADR;
- template;
- catálogo de decisões;
- 12 ADRs;
- Decision Log;
- status model;
- supersession map;
- review trigger catalog;
- evidence catalog;
- traceability;
- validações;
- reports;
- evidence;
- gate.

A próxima aula será:

```text
678 - M20.08 - Configuracao repositorio profissional
```

Na aula 678, os artefatos produzidos serão organizados em um repositório profissional com estrutura, convenções, branch strategy, templates, quality gates, automações, documentação e proteção do fluxo de contribuição.

Nesta aula, a configuração completa do repositório não será antecipada.

Regra central:

```text
ADR nao documenta
o que foi construido;

documenta
por que uma decisao relevante
foi escolhida
e quando ela deve mudar.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

679:
Implementacao dominio.
```

A modelagem do domínio definiu comportamento.

A modelagem do banco definiu persistência.

O C4 definiu estrutura e relações.

Os ADRs agora registram as decisões de maior impacto.

A configuração profissional do repositório virá depois.

Essa ordem permite que o repositório seja organizado com base em decisões já conhecidas.

Os ADRs desta aula não devem antecipar:

- implementação completa do domínio;
- classes finais de aplicação;
- controllers;
- build completo;
- pipelines finais;
- branch protection;
- templates de issue e pull request;
- configuração definitiva de CI/CD;
- releases;
- deploy real.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-677-adrs-do-projeto
└── orderflow-architecture-decisions
    ├── README.md
    ├── adr
    │   ├── ADR_CHARTER.md
    │   ├── ADR_POLICY.md
    │   ├── ADR_TEMPLATE.md
    │   ├── ADR_CATALOG.md
    │   ├── ADR-001-MODULAR-APPLICATION-AND-WORKERS.md
    │   ├── ADR-002-POSTGRESQL-AS-AUTHORITY.md
    │   ├── ADR-003-OUTBOX-AND-INBOX.md
    │   ├── ADR-004-INTEGRATION-GATEWAY.md
    │   ├── ADR-005-LOGICAL-SCHEMA-AND-OWNERSHIP.md
    │   ├── ADR-006-EVENT-DRIVEN-ORCHESTRATION.md
    │   ├── ADR-007-OPERATIONAL-PROJECTION.md
    │   ├── ADR-008-OPTIMISTIC-LOCKING.md
    │   ├── ADR-009-TENANT-SCOPED-ACCESS.md
    │   ├── ADR-010-OPENTELEMETRY-OBSERVABILITY.md
    │   ├── ADR-011-IDEMPOTENCY-REGISTRY.md
    │   ├── ADR-012-EXPAND-CONTRACT-MIGRATIONS.md
    │   ├── DECISION_LOG.md
    │   ├── SUPERSESSION_MAP.md
    │   ├── REVIEW_TRIGGER_CATALOG.md
    │   ├── ADR_EVIDENCE_CATALOG.md
    │   ├── ADR_TRACEABILITY.md
    │   ├── ADR_RISK_REGISTER.md
    │   ├── ADR_OPEN_QUESTIONS.md
    │   └── NEXT_LESSON_BOUNDARY.md
    ├── contracts
    │   ├── project-ADR-contract.yaml
    │   ├── ADR-status-policy.yaml
    │   ├── ADR-content-policy.yaml
    │   ├── ADR-alternative-policy.yaml
    │   ├── ADR-evidence-policy.yaml
    │   ├── ADR-review-trigger-policy.yaml
    │   ├── ADR-supersession-policy.yaml
    │   ├── ADR-traceability-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/orderflow/adr
    │   │           ├── ArchitectureDecision.java
    │   │           ├── ArchitectureDecisionStatus.java
    │   │           ├── DecisionAlternative.java
    │   │           ├── DecisionConsequence.java
    │   │           ├── DecisionEvidence.java
    │   │           ├── DecisionReviewTrigger.java
    │   │           ├── DecisionSupersession.java
    │   │           └── ProjectAdrGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/orderflow/adr
    │               ├── AdrContentTest.java
    │               ├── AdrAlternativeTest.java
    │               ├── AdrEvidenceTest.java
    │               ├── AdrReviewTriggerTest.java
    │               ├── AdrSupersessionTest.java
    │               ├── AdrTraceabilityTest.java
    │               ├── RepositorySetupNonAnticipationTest.java
    │               └── ProjectAdrGateTest.java
    └── reports
        ├── ADR-catalog-report.yaml
        ├── ADR-status-report.yaml
        ├── ADR-alternative-report.yaml
        ├── ADR-evidence-report.yaml
        ├── ADR-review-trigger-report.yaml
        ├── ADR-traceability-report.yaml
        └── project-ADR-gate-report.yaml
```

Scripts:

```text
scripts/m20/orderflow-architecture-decisions
├── validate-ADR-contract.ps1
├── validate-ADR-catalog.ps1
├── validate-ADR-content.ps1
├── validate-ADR-alternatives.ps1
├── validate-ADR-evidence.ps1
├── validate-ADR-review-triggers.ps1
├── validate-ADR-supersession.ps1
├── validate-ADR-traceability.ps1
├── run-orderflow-ADR-tests.ps1
├── collect-orderflow-ADR-evidence.ps1
└── verify-orderflow-ADR-gate.ps1
```

---

## Conceito essencial

### ADR registra uma decisão, não uma solução inteira

Um ADR deve possuir foco.

Exemplo bom:

```text
Usar optimistic locking
para proteger atualizacoes
do OrderProcess.
```

Exemplo amplo demais:

```text
Arquitetura do OrderFlow.
```

Uma decisão ampla demais fica difícil de revisar, substituir ou rastrear.

### Status representa lifecycle

Status recomendados:

```text
PROPOSED;

ACCEPTED;

REJECTED;

DEPRECATED;

SUPERSEDED.
```

`PROPOSED` significa que a decisão ainda está em avaliação.

`ACCEPTED` significa que existe autoridade e compromisso.

`SUPERSEDED` significa que outra decisão a substituiu.

### Alternativas precisam ser reais

Não use uma alternativa fraca apenas para justificar a escolha.

Exemplo inadequado:

```text
A:
PostgreSQL.

B:
guardar tudo em arquivo texto.
```

Alternativas reais:

- PostgreSQL;
- event store;
- banco documental;
- múltiplos bancos por contexto;
- schema lógico único;
- schemas separados.

### Consequências positivas e negativas

Toda decisão relevante possui custos.

Exemplo:

```text
Outbox aumenta confiabilidade,
mas exige publisher,
cleanup,
monitoramento
e operacao de backlog.
```

Uma decisão sem consequência negativa parece propaganda.

### Evidence sustenta a decisão

Evidence pode ser:

- benchmark;
- load test;
- failure test;
- incident analysis;
- constraint;
- prototype;
- architecture fitness function;
- operational report;
- trace;
- query plan;
- rollback rehearsal;
- trade-off matrix.

### Review trigger evita dogma

Uma decisão deve ser reavaliada quando o contexto muda.

Exemplos:

- volume aumenta dez vezes;
- ownership muda;
- lock contention aparece;
- provider exige compliance específico;
- custo operacional cresce;
- latência excede SLO;
- novo requisito de isolamento surge.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-677-adrs-do-projeto/orderflow-architecture-decisions

Set-Location `
  labs/m20/aula-677-adrs-do-projeto/orderflow-architecture-decisions
```

---

### 2. Criar ADR Charter

Arquivo:

```text
adr/ADR_CHARTER.md
```

Conteúdo:

```markdown
# ADR Charter

Projeto

OrderFlow.

Objetivo

Registrar decisoes
arquiteturais relevantes,
suas alternativas,
consequencias,
evidencias
e gatilhos de revisao.

Principios

- one decision per ADR;
- context before choice;
- alternatives are credible;
- consequences include costs;
- evidence supports confidence;
- owner is explicit;
- review trigger prevents dogma;
- supersession preserves history;
- repository setup belongs to lesson 678.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/project-ADR-contract.yaml
```

Conteúdo:

```yaml
projectADRs:
  project:
    OrderFlow

  required:
    - charter
    - policy
    - template
    - catalog
    - modular-application-decision
    - PostgreSQL-decision
    - Outbox-Inbox-decision
    - Integration-Gateway-decision
    - schema-ownership-decision
    - event-orchestration-decision
    - projection-decision
    - optimistic-locking-decision
    - tenant-scoped-access-decision
    - observability-decision
    - idempotency-decision
    - migration-decision
    - decision-log
    - supersession-map
    - review-triggers
    - evidence-catalog
    - traceability
    - tests
    - reports
    - evidence
    - gate

  forbidden:
    - ADR-without-context
    - ADR-with-one-alternative
    - ADR-without-negative-consequence
    - ADR-without-owner
    - ADR-without-evidence
    - ADR-without-review-trigger
    - silent-supersession
    - implementation-task-as-ADR
    - repository-professional-setup
    - final-CI-configuration

  nextLesson:
    code:
      M20.08
```

---

### 4. Criar ADR Policy

Arquivo:

```text
adr/ADR_POLICY.md
```

Regras:

- criar ADR para decisões de alto impacto;
- manter um foco por arquivo;
- numerar sequencialmente;
- usar linguagem objetiva;
- registrar alternativas rejeitadas;
- registrar consequências positivas e negativas;
- incluir evidence;
- definir owner;
- definir status;
- definir review trigger;
- nunca apagar ADR antigo;
- usar supersession;
- revisar quando trigger ocorrer;
- ligar ao C4, domínio, banco e testes.

---

### 5. Criar ADR Template

Arquivo:

```text
adr/ADR_TEMPLATE.md
```

Conteúdo:

```text
ADR-NNN - Titulo

Status

PROPOSED | ACCEPTED | REJECTED | DEPRECATED | SUPERSEDED

Date

Data da decisao.

Decision Owner

Papel responsavel.

Context

Problema, restricoes, premissas e forces.

Decision Drivers

Criterios que orientam a escolha.

Considered Alternatives

Alternative A

Descricao, beneficios e custos.

Alternative B

Descricao, beneficios e custos.

Decision

Escolha objetiva.

Positive Consequences

Resultados positivos.

Negative Consequences

Custos e riscos aceitos.

Evidence

Provas que sustentam a decisao.

Validation

Como verificar que a decisao foi aplicada.

Review Triggers

Mudancas que exigem reavaliacao.

Related Artifacts

C4, tests, contracts, reports e outros ADRs.

Supersedes

ADR anterior, quando aplicavel.

Superseded By

ADR posterior, quando aplicavel.
```

---

### 6. Criar modelo de status

```java
package br.com.formacao.orderflow.adr;

public enum ArchitectureDecisionStatus {
    PROPOSED,
    ACCEPTED,
    REJECTED,
    DEPRECATED,
    SUPERSEDED
}
```

---

### 7. Criar ArchitectureDecision

```java
package br.com.formacao.orderflow.adr;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public record ArchitectureDecision(
        String id,
        String title,
        ArchitectureDecisionStatus status,
        LocalDate decisionDate,
        String owner,
        String context,
        List<String> decisionDrivers,
        List<DecisionAlternative> alternatives,
        String decision,
        List<DecisionConsequence> consequences,
        List<DecisionEvidence> evidence,
        List<DecisionReviewTrigger> reviewTriggers,
        List<String> relatedArtifacts) {

    public ArchitectureDecision {
        Objects.requireNonNull(id);
        Objects.requireNonNull(title);
        Objects.requireNonNull(status);
        Objects.requireNonNull(decisionDate);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(context);
        decisionDrivers = List.copyOf(decisionDrivers);
        alternatives = List.copyOf(alternatives);
        Objects.requireNonNull(decision);
        consequences = List.copyOf(consequences);
        evidence = List.copyOf(evidence);
        reviewTriggers = List.copyOf(reviewTriggers);
        relatedArtifacts = List.copyOf(relatedArtifacts);

        if (alternatives.size() < 2) {
            throw new IllegalArgumentException(
                    "ADR requires credible alternatives");
        }

        if (evidence.isEmpty()) {
            throw new IllegalArgumentException(
                    "ADR requires evidence");
        }

        if (reviewTriggers.isEmpty()) {
            throw new IllegalArgumentException(
                    "ADR requires review trigger");
        }
    }
}
```

---

### 8. Criar DecisionAlternative

```java
package br.com.formacao.orderflow.adr;

import java.util.List;
import java.util.Objects;

public record DecisionAlternative(
        String name,
        String description,
        List<String> benefits,
        List<String> costs,
        boolean selected) {

    public DecisionAlternative {
        Objects.requireNonNull(name);
        Objects.requireNonNull(description);
        benefits = List.copyOf(benefits);
        costs = List.copyOf(costs);
    }
}
```

---

### 9. Criar DecisionConsequence

```java
package br.com.formacao.orderflow.adr;

import java.util.Objects;

public record DecisionConsequence(
        String description,
        boolean positive,
        String owner,
        String validation) {

    public DecisionConsequence {
        Objects.requireNonNull(description);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(validation);
    }
}
```

---

### 10. Criar catálogo de ADRs

Arquivo:

```text
adr/ADR_CATALOG.md
```

Registre:

- ID;
- título;
- status;
- owner;
- data;
- related artifacts;
- review trigger principal;
- supersession.

Todos os ADRs desta aula começam como:

```text
ACCEPTED
```

porque refletem a baseline aprovada do projeto.

---

## ADR-001 — Aplicação modular e workers

### 11. Definir contexto do ADR-001

Problema:

```text
o projeto precisa
de consistencia local,
dominio compartilhado
e processamento assincrono
sem criar microservicos demais.
```

Forces:

- projeto individual;
- escopo concluível;
- workers com backlog próprio;
- providers externos;
- necessidade de isolamento de falha;
- domínio único;
- custo operacional limitado.

---

### 12. Comparar alternativas do ADR-001

Alternativas:

```text
A:
monolito unico
com API e jobs no mesmo processo.

B:
microservico para cada capacidade.

C:
aplicacao Java modular
com workers assincronos separados.
```

Escolha:

```text
C.
```

Consequência negativa:

- mais processos;
- contracts internos;
- observabilidade distribuída;
- operação de broker.

---

### 13. Registrar review triggers do ADR-001

Triggers:

- worker sem escala independente;
- custo operacional excessivo;
- ownership separado;
- falha de um worker afetando outros;
- necessidade de deploy independente;
- domínio divergente entre API e workers.

---

## ADR-002 — PostgreSQL como autoridade

### 14. Definir contexto do ADR-002

Necessidades:

- transação local;
- constraints;
- optimistic locking;
- idempotência;
- Outbox;
- Inbox;
- audit;
- queries operacionais;
- migrations controladas.

---

### 15. Comparar alternativas do ADR-002

Alternativas:

```text
A:
PostgreSQL.

B:
banco documental.

C:
event store como autoridade.

D:
banco separado
para cada componente.
```

Escolha:

```text
PostgreSQL
como autoridade inicial.
```

Consequência negativa:

- ponto crítico de disponibilidade;
- crescimento de tabelas;
- necessidade de tuning;
- coordenação de migrations.

---

### 16. Definir evidence do ADR-002

Evidence:

- schema model;
- transaction tests;
- constraint tests;
- optimistic locking test;
- Outbox atomicity test;
- restore test;
- query plan.

Trigger:

- lock contention;
- volume dez vezes maior;
- RTO incompatível;
- isolamento físico obrigatório;
- necessidade comprovada de event sourcing.

---

## ADR-003 — Outbox e Inbox

### 17. Definir contexto do ADR-003

Problema:

```text
estado e mensagens
nao podem divergir,

e consumers
nao podem repetir efeitos.
```

Alternativas:

- publicar diretamente após salvar;
- transação distribuída;
- Outbox e Inbox;
- broker como autoridade.

Escolha:

```text
Outbox e Inbox.
```

---

### 18. Registrar consequências do ADR-003

Positivas:

- atomicidade local;
- retry seguro;
- deduplicação;
- replay controlado;
- operação visível.

Negativas:

- tabelas adicionais;
- cleanup;
- publisher;
- lag;
- métricas;
- DLQ e runbook.

Evidence:

- Outbox atomicity test;
- Inbox duplicate test;
- failure injection;
- backlog report.

---

## ADR-004 — Integration Gateway

### 19. Definir contexto do ADR-004

Providers possuem:

- contratos diferentes;
- erros diferentes;
- deadlines diferentes;
- autenticação diferente;
- modelos externos;
- SDKs;
- versões.

O domínio não deve conhecer essas diferenças.

---

### 20. Comparar alternativas do ADR-004

Alternativas:

```text
A:
cada handler chama provider.

B:
adapter por provider
dentro da API e worker.

C:
Integration Gateway
com adapters separados.

D:
servico independente
para cada provider.
```

Escolha:

```text
C.
```

Consequência negativa:

- risco de God Container;
- roteamento interno;
- necessidade de isolamento por component;
- gateway pode virar gargalo.

Trigger:

- provider com escala diferente;
- owner diferente;
- compliance próprio;
- falhas contaminando outros adapters.

---

## ADR-005 — Schema lógico e ownership

### 21. Definir contexto do ADR-005

O projeto possui múltiplos processos, mas um domínio central.

Alternativas:

- tabela compartilhada sem boundary;
- schema lógico único com ownership;
- schema por component;
- database por worker.

Escolha:

```text
schema orderflow
com ownership explicito.
```

---

### 22. Registrar consequências do ADR-005

Positivas:

- transações simples;
- autoridade clara;
- migrations centralizadas;
- projeto concluível;
- menor custo operacional.

Negativas:

- coordenação de schema;
- risco de acesso indevido;
- necessidade de roles;
- acoplamento de disponibilidade.

Trigger:

- equipes independentes;
- conflitos frequentes;
- isolamento regulatório;
- deploys bloqueados por migrations.

---

## ADR-006 — Orquestração orientada a eventos

### 23. Definir contexto do ADR-006

A jornada possui:

- estoque;
- pagamento;
- fulfillment;
- cancelamento;
- compensação;
- timeout ambíguo;
- reconciliação.

Uma chamada síncrona longa ultrapassaria budgets e aumentaria acoplamento.

---

### 24. Comparar alternativas do ADR-006

Alternativas:

```text
A:
fluxo sincrono completo.

B:
workflow engine externo.

C:
orquestracao por eventos
com estado no OrderProcess.

D:
coreografia pura.
```

Escolha:

```text
C.
```

Consequências negativas:

- eventual consistency;
- estados intermediários;
- broker;
- ordering;
- replay;
- observabilidade distribuída.

Trigger:

- complexidade de workflow crescer;
- necessidade de timers sofisticados;
- operações humanas;
- volume exigir engine dedicado.

---

## ADR-007 — Projection operacional

### 25. Definir contexto do ADR-007

Consultas operacionais precisam de:

- filtros;
- status;
- etapa atual;
- falha;
- compensação;
- freshness;
- paginação.

O aggregate não deve ser carregado para toda leitura.

---

### 26. Comparar alternativas do ADR-007

Alternativas:

- consultar tabelas autoritativas;
- materialized view;
- tabela de projection por eventos;
- sistema analítico externo.

Escolha:

```text
projection operacional
atualizada por consumer.
```

Negativas:

- consistência eventual;
- rebuild;
- version guard;
- freshness;
- consumer adicional.

Trigger:

- queries simples o suficiente para voltar ao root;
- freshness insuficiente;
- projection muito cara;
- necessidade analítica maior.

---

## ADR-008 — Optimistic locking

### 27. Definir contexto do ADR-008

Múltiplos resultados podem chegar para o mesmo pedido.

É necessário impedir overwrite silencioso.

Alternativas:

- last write wins;
- pessimistic lock;
- optimistic lock;
- serialização global por fila.

Escolha:

```text
optimistic locking
por version.
```

---

### 28. Registrar consequências do ADR-008

Positivas:

- baixa contenção;
- conflito explícito;
- modelo simples;
- compatibilidade com aggregate.

Negativas:

- reload;
- retry controlado;
- possíveis conflitos sob carga;
- tratamento de versão.

Trigger:

- conflito frequente;
- starvation;
- comandos longos;
- alta contenção por aggregate.

---

## ADR-009 — Acesso tenant-scoped

### 29. Definir contexto do ADR-009

OrderFlow é multi-tenant.

Falha de isolamento é crítica.

Alternativas:

- tenant apenas em token;
- tenant em coluna;
- chave composta com tenant;
- schema por tenant;
- database por tenant.

Escolha:

```text
tenant em identidade,
chaves,
queries,
idempotencia,
Inbox,
Outbox,
audit
e projection.
```

---

### 30. Registrar consequências do ADR-009

Positivas:

- defesa em profundidade;
- queries explícitas;
- unicidade correta;
- audit consistente.

Negativas:

- chaves compostas;
- índices maiores;
- mappings mais verbosos;
- disciplina em todas as relações.

Trigger:

- necessidade de isolamento físico;
- volume por tenant;
- requisitos contratuais;
- noisy neighbor;
- backup individual.

---

## ADR-010 — OpenTelemetry

### 31. Definir contexto do ADR-010

A jornada atravessa:

- API;
- banco;
- Outbox;
- broker;
- worker;
- gateway;
- providers;
- projection.

É necessário manter correlação entre essas etapas.

---

### 32. Comparar alternativas do ADR-010

Alternativas:

- logging proprietário;
- library específica de vendor;
- OpenTelemetry;
- instrumentação manual sem padrão.

Escolha:

```text
OpenTelemetry
para traces, metrics e logs correlacionados.
```

Negativas:

- collector;
- custo de telemetry;
- sampling;
- cardinalidade;
- governança de atributos.

Trigger:

- overhead excessivo;
- incompatibilidade de plataforma;
- custo fora do budget;
- novo padrão corporativo.

---

## ADR-011 — Idempotency Registry

### 33. Definir contexto do ADR-011

Clients podem repetir comandos após timeout.

O mesmo comando não pode criar dois pedidos.

Alternativas:

- deduplicação em memória;
- unique order ID fornecido pelo client;
- Idempotency Registry;
- broker como única entrada.

Escolha:

```text
registry persistente
por tenant,
operacao
e idempotency key.
```

---

### 34. Registrar consequências do ADR-011

Positivas:

- resposta anterior reutilizável;
- detecção de payload divergente;
- segurança em restart;
- ownership concorrente.

Negativas:

- TTL;
- cleanup;
- estado `PROCESSING`;
- recovery de registro preso;
- armazenamento de resposta.

Trigger:

- volume muito alto;
- resposta grande;
- key fornecida de forma inadequada;
- necessidade de escopo diferente.

---

## ADR-012 — Expand-contract

### 35. Definir contexto do ADR-012

Aplicação e schema evoluem em releases diferentes.

Migration destrutiva impediria rollback.

Alternativas:

- migration destrutiva;
- manutenção com downtime;
- expand-contract;
- database versionada por release isolada.

Escolha:

```text
expand-contract
com backfill idempotente.
```

---

### 36. Registrar consequências do ADR-012

Positivas:

- compatibilidade;
- rollout progressivo;
- rollback de aplicação;
- validação antes de contract.

Negativas:

- releases adicionais;
- duplicidade temporária;
- cleanup;
- observabilidade de backfill;
- disciplina.

Trigger:

- ferramenta de migration incompatível;
- tamanho de tabela;
- locks;
- necessidade de zero downtime;
- mudança de engine.

---

## Catálogos e governança

### 37. Criar Decision Log

Arquivo:

```text
adr/DECISION_LOG.md
```

Colunas:

- ADR;
- título;
- status;
- owner;
- date;
- decisão;
- evidence;
- trigger;
- supersedes;
- superseded by.

O log é índice.

O ADR continua sendo a fonte detalhada.

---

### 38. Criar Supersession Map

Arquivo:

```text
adr/SUPERSESSION_MAP.md
```

Situação inicial:

```text
nenhum ADR superseded.
```

Exemplo futuro:

```text
ADR-004
SUPERSEDED BY
ADR-021.
```

Nunca edite silenciosamente uma decisão antiga para parecer que ela sempre esteve correta.

---

### 39. Criar DecisionSupersession

```java
package br.com.formacao.orderflow.adr;

import java.time.LocalDate;
import java.util.Objects;

public record DecisionSupersession(
        String previousAdrId,
        String nextAdrId,
        String reason,
        LocalDate effectiveDate) {

    public DecisionSupersession {
        Objects.requireNonNull(previousAdrId);
        Objects.requireNonNull(nextAdrId);
        Objects.requireNonNull(reason);
        Objects.requireNonNull(effectiveDate);

        if (previousAdrId.equals(nextAdrId)) {
            throw new IllegalArgumentException(
                    "ADR cannot supersede itself");
        }
    }
}
```

---

### 40. Criar Review Trigger Catalog

Arquivo:

```text
adr/REVIEW_TRIGGER_CATALOG.md
```

Categorias:

```text
VOLUME;

LATENCY;

COST;

OWNERSHIP;

SECURITY;

COMPLIANCE;

OPERABILITY;

RELIABILITY;

TEAM_STRUCTURE;

TECHNOLOGY_LIFECYCLE;

PROVIDER_CHANGE;

DATA_ISOLATION.
```

Cada trigger aponta para ADRs afetados.

---

### 41. Criar DecisionReviewTrigger

```java
package br.com.formacao.orderflow.adr;

import java.util.Objects;

public record DecisionReviewTrigger(
        String category,
        String condition,
        String expectedAction,
        String owner) {

    public DecisionReviewTrigger {
        Objects.requireNonNull(category);
        Objects.requireNonNull(condition);
        Objects.requireNonNull(expectedAction);
        Objects.requireNonNull(owner);
    }
}
```

---

### 42. Criar Evidence Catalog

Arquivo:

```text
adr/ADR_EVIDENCE_CATALOG.md
```

Evidence:

```text
EV-001:
Domain invariant tests.

EV-002:
Database constraint tests.

EV-003:
Optimistic locking test.

EV-004:
Outbox atomicity test.

EV-005:
Inbox deduplication test.

EV-006:
Idempotency concurrency test.

EV-007:
C4 relationship report.

EV-008:
Trust boundary report.

EV-009:
Projection freshness test.

EV-010:
Migration compatibility test.

EV-011:
Rollback rehearsal.

EV-012:
Telemetry correlation report.
```

---

### 43. Criar DecisionEvidence

```java
package br.com.formacao.orderflow.adr;

import java.util.Objects;

public record DecisionEvidence(
        String id,
        String type,
        String description,
        String artifactPath,
        String acceptance) {

    public DecisionEvidence {
        Objects.requireNonNull(id);
        Objects.requireNonNull(type);
        Objects.requireNonNull(description);
        Objects.requireNonNull(artifactPath);
        Objects.requireNonNull(acceptance);
    }
}
```

---

### 44. Criar ADR Traceability

Arquivo:

```text
adr/ADR_TRACEABILITY.md
```

Exemplo:

```text
ADR-003 Outbox and Inbox
-> C4:
Outbox Publisher;
Orchestration Worker;
Projection Worker.

-> Database:
outbox_event;
inbox_message.

-> Tests:
OutboxAtomicityTest;
InboxDeduplicationTest.

-> Evidence:
EV-004;
EV-005.
```

---

### 45. Criar risco de ADR

Arquivo:

```text
adr/ADR_RISK_REGISTER.md
```

Riscos:

```text
ADR escrito depois
sem alternativa real;

status incorreto;

owner ausente;

evidence fraca;

decisao contradiz C4;

decisao contradiz banco;

trigger generico;

ADR nunca revisado;

supersession silenciosa;

catalogo divergente
dos arquivos.
```

---

### 46. Criar perguntas abertas

Arquivo:

```text
adr/ADR_OPEN_QUESTIONS.md
```

Perguntas:

```text
qual broker sera escolhido?

Outbox Publisher
fica separado desde o inicio?

qual mecanismo
de schema registry?

qual runtime platform?

qual estrategia
de secrets?

qual policy
de branch protection?

qual pipeline
sera minimo?

qual cadence
de revisao dos ADRs?
```

Perguntas de repositório e CI serão tratadas na aula 678.

---

### 47. Criar boundary da próxima aula

Arquivo:

```text
adr/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 677 define:

- ADR charter;
- policy;
- template;
- decisions;
- alternatives;
- consequences;
- evidence;
- triggers;
- owners;
- supersession;
- traceability.

A aula 678 define:

- repository structure;
- naming;
- branches;
- commits;
- pull requests;
- issue templates;
- CODEOWNERS;
- CI quality gates;
- documentation entry points;
- contribution workflow.

Nenhuma configuracao profissional
de repositorio
e finalizada nesta aula.
```

---

## Validações dos ADRs

### 48. Testar ADR sem contexto

ADR possui decisão, mas não explica problema.

Resultado:

```text
FAIL_ADR_CONTEXT
```

---

### 49. Testar ADR com alternativa falsa

Uma alternativa é obviamente inviável e não possui análise.

Resultado:

```text
FAIL_ADR_ALTERNATIVE_QUALITY
```

---

### 50. Testar ADR sem consequência negativa

Resultado:

```text
FAIL_ADR_NEGATIVE_CONSEQUENCE
```

---

### 51. Testar ADR sem evidence

Resultado:

```text
FAIL_ADR_EVIDENCE
```

---

### 52. Testar ADR sem review trigger

Resultado:

```text
FAIL_ADR_REVIEW_TRIGGER
```

---

### 53. Testar supersession silenciosa

ADR antigo foi alterado, mas nenhum novo ADR foi criado.

Resultado:

```text
FAIL_ADR_SUPERSESSION
```

---

### 54. Testar contradição com C4

ADR declara:

```text
API publica diretamente.
```

C4 declara:

```text
Outbox Publisher publica.
```

Resultado:

```text
FAIL_ADR_C4_CONTRADICTION
```

---

### 55. Testar contradição com banco

ADR declara:

```text
idempotencia em memoria.
```

Banco possui registry durável.

Resultado:

```text
FAIL_ADR_DATABASE_CONTRADICTION
```

---

### 56. Criar reports

Exemplo:

```yaml
projectADRs:
  total:
    12

  status:
    accepted:
      12
    proposed:
      0
    superseded:
      0

  alternatives:
    total:
      38
    credibleCoveragePercent:
      100

  consequences:
    positive:
      31
    negative:
      29

  evidence:
    total:
      12
    coveragePercent:
      100

  reviewTriggers:
    total:
      34
    coveragePercent:
      100

  ownership:
    coveragePercent:
      100

  traceability:
    coveragePercent:
      100

  repositorySetup:
    finalized:
      false

  gate:
    PASS
```

---

### 57. Criar evidence

Arquivo:

```text
contracts/project-ADR-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- ADR count;
- accepted ADR count;
- proposed ADR count;
- superseded ADR count;
- alternative count;
- credible alternative coverage;
- positive consequence count;
- negative consequence count;
- evidence count;
- evidence coverage;
- review trigger count;
- review trigger coverage;
- owner coverage;
- C4 traceability coverage;
- database traceability coverage;
- supersession integrity status;
- contradiction count;
- repository setup finalized;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- credenciais;
- topologia real;
- providers reais;
- branch protection final;
- pipeline final;
- secrets;
- tokens;
- conteúdo detalhado da aula 678.

---

### 58. Criar gate

O gate valida:

- charter;
- policy;
- template;
- catalog;
- 12 ADRs;
- context;
- alternatives;
- decision;
- positive consequences;
- negative consequences;
- evidence;
- validation;
- owner;
- status;
- review trigger;
- supersession;
- Decision Log;
- traceability;
- risks;
- tests;
- reports;
- evidence;
- não antecipação.

Status:

```text
PASS;

FAIL_ADR_CHARTER;

FAIL_ADR_POLICY;

FAIL_ADR_TEMPLATE;

FAIL_ADR_CATALOG;

FAIL_ADR_CONTEXT;

FAIL_ADR_ALTERNATIVE;

FAIL_ADR_DECISION;

FAIL_ADR_CONSEQUENCE;

FAIL_ADR_EVIDENCE;

FAIL_ADR_OWNER;

FAIL_ADR_STATUS;

FAIL_ADR_REVIEW_TRIGGER;

FAIL_ADR_SUPERSESSION;

FAIL_ADR_TRACEABILITY;

FAIL_ADR_CONTRADICTION;

FAIL_REPOSITORY_ANTICIPATION;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 59. Executar validação completa

```powershell
.\scripts\m20\orderflow-architecture-decisions\validate-ADR-contract.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-catalog.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-content.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-alternatives.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-evidence.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-review-triggers.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-supersession.ps1

.\scripts\m20\orderflow-architecture-decisions\validate-ADR-traceability.ps1

.\scripts\m20\orderflow-architecture-decisions\run-orderflow-ADR-tests.ps1

.\scripts\m20\orderflow-architecture-decisions\collect-orderflow-ADR-evidence.ps1

.\scripts\m20\orderflow-architecture-decisions\verify-orderflow-ADR-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 60. Encerrar o laboratório

Confirme:

- charter;
- policy;
- template;
- catalog;
- ADR-001;
- ADR-002;
- ADR-003;
- ADR-004;
- ADR-005;
- ADR-006;
- ADR-007;
- ADR-008;
- ADR-009;
- ADR-010;
- ADR-011;
- ADR-012;
- Decision Log;
- Supersession Map;
- Review Trigger Catalog;
- Evidence Catalog;
- traceability;
- risks;
- open questions;
- tests;
- reports;
- evidence;
- gate aprovado;
- repositório profissional não finalizado.

---

## Entendendo o que foi feito

### A arquitetura ganhou memória

As principais escolhas deixaram de depender da lembrança do autor.

### Alternativas ficaram visíveis

Cada decisão mostra opções reais e por que foram rejeitadas.

### Custos foram aceitos conscientemente

Workers, Outbox, Inbox, projection, Gateway e telemetry possuem benefícios e custos explícitos.

### Evidence passou a sustentar decisões

Testes, reports, diagrams e rehearsals foram ligados aos ADRs.

### Evolução ganhou gatilhos

As decisões não foram tratadas como permanentes.

### Histórico foi preservado

Supersession substitui edição silenciosa.

### O repositório ainda não foi configurado

A aula 678 usará os ADRs para organizar o fluxo profissional do projeto.

---

## Erros comuns importantes

### ADR escrito como tutorial

O foco deve ser a decisão.

### Contexto genérico

Sem forces, a escolha não pode ser avaliada.

### Alternativa artificial

A decisão parece manipulada.

### Apenas consequências positivas

O ADR vira propaganda.

### Evidence apenas documental

Decisão operacional precisa de prova operacional.

### Trigger “quando necessário”

Não é verificável.

### ADR para tarefa pequena

Cria burocracia.

### ADR alterado silenciosamente

O histórico deixa de ser confiável.

### Contradição com C4

Documentação perde autoridade.

### Antecipar CI e repositório

Essa etapa pertence à aula 678.

---

## Comandos úteis

### Validar catálogo

```powershell
.\scripts\m20\orderflow-architecture-decisions\validate-ADR-catalog.ps1
```

### Validar conteúdo

```powershell
.\scripts\m20\orderflow-architecture-decisions\validate-ADR-content.ps1
```

### Validar evidence

```powershell
.\scripts\m20\orderflow-architecture-decisions\validate-ADR-evidence.ps1
```

### Validar triggers

```powershell
.\scripts\m20\orderflow-architecture-decisions\validate-ADR-review-triggers.ps1
```

### Executar testes

```powershell
.\scripts\m20\orderflow-architecture-decisions\run-orderflow-ADR-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m20\orderflow-architecture-decisions\verify-orderflow-ADR-gate.ps1
```

---

## Exercício guiado

Crie um ADR para:

```text
usar Projection Worker
para consulta operacional.
```

Inclua:

1. título;
2. status;
3. owner;
4. contexto;
5. drivers;
6. três alternativas;
7. decisão;
8. consequências positivas;
9. consequências negativas;
10. evidence;
11. validação;
12. review triggers;
13. related artifacts;
14. risco;
15. possibilidade de supersession.

Não configure pipeline.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 676 e ponte para a aula 678 foram preservadas;
- laboratório `orderflow-architecture-decisions` foi criado;
- ADR Charter foi criado;
- contrato principal foi criado;
- ADR Policy foi criada;
- ADR Template foi criado;
- ArchitectureDecisionStatus foi criado;
- ArchitectureDecision foi criado;
- DecisionAlternative foi criado;
- DecisionConsequence foi criado;
- ADR Catalog foi criado;
- ADR-001 documenta aplicação modular e workers;
- ADR-002 documenta PostgreSQL;
- ADR-003 documenta Outbox e Inbox;
- ADR-004 documenta Integration Gateway;
- ADR-005 documenta schema lógico e ownership;
- ADR-006 documenta orquestração orientada a eventos;
- ADR-007 documenta projection operacional;
- ADR-008 documenta optimistic locking;
- ADR-009 documenta acesso tenant-scoped;
- ADR-010 documenta OpenTelemetry;
- ADR-011 documenta Idempotency Registry;
- ADR-012 documenta expand-contract;
- alternativas reais foram comparadas;
- consequências positivas e negativas foram registradas;
- evidence foi ligada às decisões;
- owners foram definidos;
- review triggers foram definidos;
- Decision Log foi criado;
- Supersession Map foi criado;
- DecisionSupersession foi criado;
- Review Trigger Catalog foi criado;
- DecisionReviewTrigger foi criado;
- Evidence Catalog foi criado;
- DecisionEvidence foi criado;
- ADR Traceability foi criada;
- riscos e perguntas abertas foram registrados;
- boundary da aula 678 foi criado;
- testes de conteúdo, alternativas, evidence, triggers, supersession e contradições foram definidos;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- configuração profissional do repositório não foi antecipada.

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
  labs/m20/aula-677-adrs-do-projeto/orderflow-architecture-decisions `
  scripts/m20/orderflow-architecture-decisions `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|productionHost|realCluster|realNamespace|realProvider"
```

Commit recomendado:

```powershell
git commit -m "docs(m20): registrar ADRs do OrderFlow"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- providers reais;
- hosts;
- credenciais;
- topologia de produção;
- branch rules finais;
- pipelines finais;
- conteúdo detalhado da aula 678.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você formalizou as principais decisões arquiteturais do OrderFlow.

Você criou:

```text
ADR Charter;

ADR Policy;

ADR Template;

ADR Catalog;

12 Architecture Decision Records;

Decision Log;

Supersession Map;

Review Trigger Catalog;

Evidence Catalog;

ADR Traceability;

tests, reports, evidence e gate.
```

Você registrou decisões sobre:

- aplicação modular e workers;
- PostgreSQL;
- Outbox e Inbox;
- Integration Gateway;
- schema lógico;
- orquestração orientada a eventos;
- projection operacional;
- optimistic locking;
- multi-tenancy;
- OpenTelemetry;
- idempotência;
- migrations.

Você também tornou explícitos:

- contexto;
- alternativas;
- consequências;
- evidências;
- owners;
- triggers;
- supersession.

A próxima aula será:

```text
678 - M20.08 - Configuracao repositorio profissional
```

Nela, você organizará o OrderFlow em um repositório profissional, com estrutura, convenções, templates, branch strategy, commits, pull requests, CODEOWNERS, quality gates e fluxo de contribuição.

Nenhuma configuração profissional completa do repositório foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei ADR Charter.
- [ ] Criei policy.
- [ ] Criei template.
- [ ] Registrei 12 ADRs.
- [ ] Comparei alternativas.
- [ ] Registrei custos.
- [ ] Liguei evidence.
- [ ] Defini owners.
- [ ] Defini triggers.
- [ ] Criei supersession.
- [ ] Criei traceability.
- [ ] Preservei a aula 678.

---

## Troubleshooting adicional

### O ADR ficou longo demais

Separe decisões.

### Não existem alternativas

Verifique se a escolha é realmente arquitetural.

### A decisão já foi implementada

Ainda registre contexto e evidence, sem inventar histórico.

### A consequência negativa parece grave

Avalie se a decisão continua aceitável.

### O trigger não é mensurável

Reescreva com condição observável.

### ADR e C4 divergem

Bloqueie o gate e escolha uma fonte correta.

### O ADR perdeu validade

Crie novo ADR e supersede o anterior.

### Evidence ainda não existe

Mantenha status `PROPOSED` ou crie condição de aceitação.

### Quero criar branch protection

Essa etapa pertence à aula 678.

### Existem decisões pequenas demais

Mantenha em commit, issue ou documentação local.

---

## Perguntas de revisão

1. O que é ADR?
2. Quando criar ADR?
3. O que não precisa de ADR?
4. O que é status?
5. O que significa accepted?
6. O que significa superseded?
7. Por que comparar alternativas?
8. O que é decision driver?
9. Por que registrar consequência negativa?
10. O que é evidence?
11. O que é review trigger?
12. O que é supersession?
13. Por que não apagar ADR antigo?
14. O que ADR-001 decidiu?
15. O que ADR-002 decidiu?
16. O que ADR-003 decidiu?
17. O que ADR-004 decidiu?
18. O que ADR-006 decidiu?
19. O que ADR-008 decidiu?
20. O que ADR-009 decidiu?
21. O que ADR-011 decidiu?
22. O que ADR-012 decidiu?
23. O que a aula 678 fará?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Registro de decisão arquitetural.
2. Quando impacto e reversão são relevantes.
3. Escolhas pequenas e locais.
4. Lifecycle da decisão.
5. Decisão aprovada.
6. Decisão substituída.
7. Para demonstrar trade-off real.
8. Critério que orienta escolha.
9. Para tornar custo consciente.
10. Prova que sustenta a decisão.
11. Condição que reabre a decisão.
12. Substituição preservando histórico.
13. Para manter memória confiável.
14. Aplicação modular com workers.
15. PostgreSQL como autoridade.
16. Outbox e Inbox.
17. Integration Gateway.
18. Orquestração por eventos.
19. Optimistic locking.
20. Acesso tenant-scoped.
21. Idempotency Registry.
22. Expand-contract.
23. Configurar repositório profissional.
24. Configuração repositório profissional.
25. ADR explica por que e quando mudar.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 677 - M20.07 - ADRs do projeto

- Continuei após Arquitetura C4 final.
- Criei o laboratório `orderflow-architecture-decisions`.
- Criei ADR Charter.
- Criei o contrato principal.
- Criei ADR Policy.
- Criei ADR Template.
- Criei ArchitectureDecisionStatus.
- Criei ArchitectureDecision.
- Criei DecisionAlternative.
- Criei DecisionConsequence.
- Criei ADR Catalog.
- Criei ADR-001 sobre aplicação modular e workers.
- Criei ADR-002 sobre PostgreSQL.
- Criei ADR-003 sobre Outbox e Inbox.
- Criei ADR-004 sobre Integration Gateway.
- Criei ADR-005 sobre schema lógico e ownership.
- Criei ADR-006 sobre orquestração orientada a eventos.
- Criei ADR-007 sobre projection operacional.
- Criei ADR-008 sobre optimistic locking.
- Criei ADR-009 sobre acesso tenant-scoped.
- Criei ADR-010 sobre OpenTelemetry.
- Criei ADR-011 sobre Idempotency Registry.
- Criei ADR-012 sobre expand-contract.
- Registrei alternativas reais.
- Registrei consequências positivas e negativas.
- Liguei evidence aos ADRs.
- Defini owners.
- Defini review triggers.
- Criei Decision Log.
- Criei Supersession Map.
- Criei DecisionSupersession.
- Criei Review Trigger Catalog.
- Criei DecisionReviewTrigger.
- Criei Evidence Catalog.
- Criei DecisionEvidence.
- Criei ADR Traceability.
- Registrei riscos e perguntas abertas.
- Criei boundary para a aula 678.
- Defini testes dos ADRs.
- Criei reports, evidence e gate.
- Não antecipei a configuração profissional do repositório.
- Próxima aula: Configuracao repositorio profissional.
```

---

## Referência técnica curta

- Architecture Decision Record.
- Decision Status.
- Decision Driver.
- Alternative.
- Consequence.
- Evidence.
- Validation.
- Review Trigger.
- Supersession.
- Decision Log.
- ADR Catalog.
- Traceability.
- Accepted.
- Proposed.
- Superseded.

Regra final:

```text
Os ADRs do OrderFlow devem registrar decisões específicas, alternativas reais, consequências positivas e negativas, evidence, owner e review trigger: ADR-001 escolhe aplicação Java modular com workers assíncronos para equilibrar consistência local, isolamento e custo operacional, ADR-002 escolhe PostgreSQL como autoridade por transações, constraints, locking, idempotência, Outbox, Inbox e queries, ADR-003 escolhe Outbox e Inbox para atomicidade e deduplicação, ADR-004 escolhe Integration Gateway para isolar providers, ADR-005 escolhe schema lógico único com ownership explícito, ADR-006 escolhe orquestração orientada a eventos com estado no OrderProcess, ADR-007 escolhe projection operacional separada, ADR-008 escolhe optimistic locking, ADR-009 escolhe tenant em identidades, chaves, queries, idempotência, mensagens, audit e projection, ADR-010 escolhe OpenTelemetry, ADR-011 escolhe Idempotency Registry persistente e ADR-012 escolhe expand-contract; cada decisão possui contexto, drivers, alternativas, decisão, consequências, evidence, validação, related artifacts e triggers mensuráveis, status segue lifecycle proposed, accepted, rejected, deprecated ou superseded, decisões antigas nunca são apagadas, supersession preserva histórico, traceability conecta C4, domínio, banco, tests e reports, e o gate termina com charter, policy, template, catalog, ADRs, Decision Log, Supersession Map, Review Trigger Catalog, Evidence Catalog, traceability, risks, tests, reports e evidence aprovados, enquanto estrutura, branches, commits, pull requests, CODEOWNERS e quality gates do repositório permanecem reservados para a aula 678.
```
