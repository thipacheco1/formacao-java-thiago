# 672 - M20.02 - Backlog projeto final

## Apresentação da aula

Na aula 671, você definiu oficialmente o projeto final do Módulo 20.

O projeto escolhido foi:

```text
OrderFlow

Plataforma multi-tenant
de orquestracao de pedidos
e fulfillment.
```

A definição registrou:

- contexto de negócio;
- problema;
- visão;
- objetivos;
- não objetivos;
- usuários;
- jornadas em alto nível;
- hipóteses de capacidades;
- hipóteses de qualidade;
- restrições;
- premissas;
- critérios de sucesso;
- objetivos de aprendizagem;
- plano de evidências;
- narrativa de portfólio;
- governança;
- guardrails de escopo;
- riscos iniciais.

Agora o projeto precisa ser transformado em trabalho ordenado.

O erro mais comum nesta etapa seria criar uma lista de tarefas técnicas:

```text
criar controller;

criar entity;

configurar banco;

adicionar Kafka;

adicionar Redis;

criar Dockerfile.
```

Essa lista não representa valor, risco, aprendizagem, dependência ou entrega.

Outro erro seria escrever dezenas de histórias detalhadas antes de fechar o escopo funcional.

A aula seguinte existe justamente para isso.

Nesta aula, o backlog será construído como um sistema de planejamento progressivo.

Ele deverá responder:

```text
quais resultados o projeto precisa produzir;

quais epicos organizam o trabalho;

quais itens entregam valor demonstravel;

quais enablers reduzem risco;

quais spikes produzem evidencia;

quais dependencias controlam a ordem;

quais milestones tornam o progresso visivel;

quais criterios permitem iniciar e concluir;

quais artefatos fortalecem o portfolio;

quais decisoes permanecem abertas
para a aula de escopo funcional.
```

O backlog não será uma promessa de implementar tudo.

Ele será um mapa ordenado de possibilidades e compromissos.

O laboratório será:

```text
labs/m20/aula-672-backlog-projeto-final/orderflow-final-project-backlog
```

Você criará:

- Backlog Charter;
- catálogo de tipos de item;
- catálogo de épicos candidatos;
- backlog inicial ordenado;
- modelo de prioridade;
- mapa de dependências;
- estratégia de vertical slices;
- milestones;
- critérios de Ready e Done;
- catálogo de spikes;
- mapa de riscos;
- rastreabilidade de evidências;
- plano de entregas para portfólio;
- governança do backlog;
- reports, evidence e gate.

A próxima aula será:

```text
673 - M20.03 - Escopo funcional
```

Na aula 673, os itens funcionais candidatos serão avaliados, recortados e transformados em escopo funcional explícito, com fluxos, regras, estados, atores, entradas, saídas, erros e limites.

Nesta aula, o escopo funcional detalhado não será antecipado.

Regra central:

```text
backlog forte
nao e lista de tarefas;

e uma sequencia de resultados,
riscos,
evidencias
e entregas
organizada para tornar
o projeto concluivel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
671:
Definicao projeto final.

672:
Backlog projeto final.

673:
Escopo funcional.

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
```

A ordem protege o projeto contra decisões prematuras.

Na aula 671, o projeto foi escolhido.

Na aula 672, o trabalho será organizado.

Na aula 673, o produto funcional será recortado.

Somente depois serão detalhados domínio, dados, arquitetura, decisões e repositório.

O backlog desta aula precisa preservar essa sequência.

Por isso:

- épicos podem ser candidatos;
- histórias podem representar resultados em alto nível;
- dependências podem ser registradas;
- milestones podem ser planejados;
- critérios de evidência podem ser definidos;
- endpoints finais não serão fechados;
- agregados finais não serão definidos;
- tabelas finais não serão desenhadas;
- containers finais não serão aprovados;
- tecnologias ainda não justificadas não serão impostas.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-672-backlog-projeto-final
└── orderflow-final-project-backlog
    ├── README.md
    ├── backlog
    │   ├── BACKLOG_CHARTER.md
    │   ├── BACKLOG_ITEM_TYPES.md
    │   ├── EPIC_CATALOG.md
    │   ├── INITIAL_ORDERED_BACKLOG.md
    │   ├── PRIORITIZATION_MODEL.md
    │   ├── DEPENDENCY_MAP.md
    │   ├── VERTICAL_SLICE_STRATEGY.md
    │   ├── MILESTONE_PLAN.md
    │   ├── RELEASE_HYPOTHESES.md
    │   ├── DEFINITION_OF_READY.md
    │   ├── DEFINITION_OF_DONE.md
    │   ├── ACCEPTANCE_CRITERIA_GUIDE.md
    │   ├── RISK_SPIKE_CATALOG.md
    │   ├── EVIDENCE_TRACEABILITY.md
    │   ├── PORTFOLIO_DELIVERY_PLAN.md
    │   ├── BACKLOG_GOVERNANCE.md
    │   ├── BACKLOG_RETROSPECTIVE.md
    │   ├── OPEN_BACKLOG_QUESTIONS.md
    │   └── NEXT_LESSON_BOUNDARY.md
    ├── contracts
    │   ├── final-project-backlog-contract.yaml
    │   ├── backlog-item-policy.yaml
    │   ├── epic-policy.yaml
    │   ├── priority-policy.yaml
    │   ├── dependency-policy.yaml
    │   ├── milestone-policy.yaml
    │   ├── ready-policy.yaml
    │   ├── done-policy.yaml
    │   ├── evidence-traceability-policy.yaml
    │   ├── portfolio-delivery-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/finalproject/backlog
    │   │           ├── BacklogItem.java
    │   │           ├── BacklogItemType.java
    │   │           ├── BacklogStatus.java
    │   │           ├── PriorityScore.java
    │   │           ├── BacklogDependency.java
    │   │           ├── Milestone.java
    │   │           ├── AcceptanceCriterion.java
    │   │           ├── EvidenceRequirement.java
    │   │           └── FinalProjectBacklogGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/finalproject/backlog
    │               ├── BacklogItemTest.java
    │               ├── PriorityScoreTest.java
    │               ├── DependencyCycleTest.java
    │               ├── VerticalSliceTest.java
    │               ├── AcceptanceCriteriaTest.java
    │               ├── FunctionalScopeNonAnticipationTest.java
    │               └── FinalProjectBacklogGateTest.java
    └── reports
        ├── backlog-item-report.yaml
        ├── epic-coverage-report.yaml
        ├── priority-report.yaml
        ├── dependency-report.yaml
        ├── milestone-report.yaml
        ├── evidence-traceability-report.yaml
        ├── portfolio-delivery-report.yaml
        ├── architecture-report.yaml
        └── final-project-backlog-gate-report.yaml
```

Scripts:

```text
scripts/m20/orderflow-final-project-backlog
├── validate-backlog-contract.ps1
├── validate-backlog-items.ps1
├── validate-epics.ps1
├── validate-priorities.ps1
├── validate-dependencies.ps1
├── validate-milestones.ps1
├── validate-ready-done.ps1
├── validate-evidence-traceability.ps1
├── validate-portfolio-deliveries.ps1
├── run-final-project-backlog-tests.ps1
├── collect-final-project-backlog-evidence.ps1
└── verify-final-project-backlog-gate.ps1
```

---

## Conceito essencial

### Backlog não é plano imutável

O backlog representa o melhor conhecimento disponível agora.

Ele muda quando:

- o escopo é refinado;
- uma hipótese é invalidada;
- um risco aumenta;
- uma dependência aparece;
- uma evidência muda a decisão;
- o tempo disponível muda;
- uma entrega perde valor;
- uma solução mais simples é encontrada.

Mudança controlada não significa falta de planejamento.

Significa aprendizagem.

### Épico organiza resultado, não camada técnica

Épico ruim:

```text
Banco de dados.
```

Épico melhor:

```text
Persistência confiável
do ciclo do pedido.
```

O primeiro descreve tecnologia.

O segundo descreve uma capacidade de engenharia ligada a um resultado.

### História não é tarefa de programação

História candidata:

```text
Como operador de um tenant,
quero registrar um pedido
de forma idempotente,
para evitar duplicidade
quando um canal repetir a requisicao.
```

Tarefas técnicas podem surgir depois.

O backlog principal precisa preservar intenção.

### Enabler viabiliza entrega

Nem todo item entrega valor diretamente ao usuário.

Enablers podem criar:

- automação;
- pipeline;
- observabilidade;
- segurança;
- testes;
- migrations;
- ambientes;
- contratos;
- documentação.

Eles precisam estar ligados a uma entrega ou risco.

### Spike produz conhecimento

Spike não é investigação ilimitada.

Ele possui:

- pergunta;
- hipótese;
- timebox;
- método;
- evidência;
- critério de encerramento;
- decisão esperada.

### Vertical slice reduz risco de integração tardia

Um vertical slice atravessa camadas suficientes para provar um fluxo.

Exemplo candidato:

```text
receber um pedido minimo;

validar tenant;

aplicar idempotencia;

persistir;

retornar resultado;

emitir telemetry;

executar teste;
```

Esse slice não fecha todo o escopo funcional.

Ele apenas orienta a ordem de entrega.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-672-backlog-projeto-final/orderflow-final-project-backlog

Set-Location `
  labs/m20/aula-672-backlog-projeto-final/orderflow-final-project-backlog
```

---

### 2. Criar Backlog Charter

Arquivo:

```text
backlog/BACKLOG_CHARTER.md
```

Conteúdo:

```markdown
# Backlog Charter

Projeto

OrderFlow.

Objetivo

Transformar a definicao
do projeto final
em trabalho ordenado,
concluivel,
rastreavel
e defensavel.

Principios

- outcome before task;
- value and risk drive order;
- vertical slices before horizontal completion;
- evidence is backlog work;
- enablers need a consumer;
- spikes are timeboxed;
- dependencies are visible;
- scope belongs to lesson 673;
- backlog evolves by learning.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/final-project-backlog-contract.yaml
```

Conteúdo:

```yaml
finalProjectBacklog:
  project:
    OrderFlow

  required:
    - backlog-charter
    - item-types
    - epic-catalog
    - ordered-backlog
    - prioritization-model
    - dependency-map
    - vertical-slice-strategy
    - milestone-plan
    - release-hypotheses
    - definition-of-ready
    - definition-of-done
    - acceptance-criteria-guide
    - risk-spikes
    - evidence-traceability
    - portfolio-delivery-plan
    - backlog-governance
    - reports
    - evidence
    - gate

  forbidden:
    - technical-task-only-backlog
    - item-without-outcome
    - priority-without-rationale
    - hidden-dependency
    - spike-without-timebox
    - milestone-without-evidence
    - done-without-test
    - final-functional-scope
    - final-domain-model
    - final-database-model
    - final-C4
    - repository-professional-setup

  nextLesson:
    code:
      M20.03
```

---

### 4. Definir tipos de item

Arquivo:

```text
backlog/BACKLOG_ITEM_TYPES.md
```

Tipos:

```text
EPIC;

STORY;

ENABLER;

SPIKE;

RISK_REDUCTION;

EVIDENCE;

DOCUMENTATION;

PORTFOLIO;

REVIEW.
```

Definições:

- `EPIC`: resultado amplo;
- `STORY`: comportamento demonstrável;
- `ENABLER`: capacidade técnica necessária;
- `SPIKE`: redução de incerteza;
- `RISK_REDUCTION`: controle de risco;
- `EVIDENCE`: prova executável ou documental;
- `DOCUMENTATION`: conhecimento necessário;
- `PORTFOLIO`: entrega pública sanitizada;
- `REVIEW`: validação de decisão ou resultado.

---

### 5. Criar BacklogItem

```java
package br.com.formacao.finalproject.backlog;

import java.util.List;
import java.util.Objects;

public record BacklogItem(
        String id,
        BacklogItemType type,
        String title,
        String outcome,
        String owner,
        BacklogStatus status,
        PriorityScore priority,
        List<String> dependencies,
        List<AcceptanceCriterion> acceptanceCriteria,
        List<EvidenceRequirement> evidenceRequirements,
        String targetMilestone) {

    public BacklogItem {
        Objects.requireNonNull(id);
        Objects.requireNonNull(type);
        Objects.requireNonNull(title);
        Objects.requireNonNull(outcome);
        Objects.requireNonNull(owner);
        Objects.requireNonNull(status);
        Objects.requireNonNull(priority);
        dependencies = List.copyOf(dependencies);
        acceptanceCriteria =
                List.copyOf(acceptanceCriteria);
        evidenceRequirements =
                List.copyOf(evidenceRequirements);
        Objects.requireNonNull(targetMilestone);

        if (outcome.isBlank()) {
            throw new IllegalArgumentException(
                    "Backlog item requires outcome");
        }
    }
}
```

---

### 6. Definir status

Status:

```text
CANDIDATE;

READY_FOR_SCOPE_REVIEW;

SELECTED;

IN_PROGRESS;

BLOCKED;

VALIDATING;

DONE;

REMOVED.
```

Nesta aula, itens funcionais permanecem principalmente:

```text
CANDIDATE
```

ou:

```text
READY_FOR_SCOPE_REVIEW.
```

A seleção funcional será feita na aula 673.

---

### 7. Criar catálogo de épicos candidatos

Arquivo:

```text
backlog/EPIC_CATALOG.md
```

Épicos candidatos:

```text
E-01:
Fundacao do projeto final.

E-02:
Entrada confiavel de pedidos.

E-03:
Ciclo de vida do pedido.

E-04:
Reserva externa de estoque.

E-05:
Autorizacao externa de pagamento.

E-06:
Coordenacao de fulfillment.

E-07:
Cancelamento e compensacoes.

E-08:
Comunicacao orientada a eventos.

E-09:
Seguranca e isolamento de tenant.

E-10:
Observabilidade e operacao.

E-11:
Qualidade, testes e entrega continua.

E-12:
Documentacao, portfolio e defesa.
```

Esses épicos ainda são candidatos.

A aula 673 poderá:

- unir;
- remover;
- dividir;
- limitar;
- adiar;
- selecionar.

---

### 8. Definir resultado de cada épico

Exemplo:

```text
E-02:
Entrada confiavel de pedidos.

Outcome:
aceitar comandos de canais
sem duplicar pedidos
e sem misturar tenants.
```

Outro:

```text
E-10:
Observabilidade e operacao.

Outcome:
identificar rapidamente
onde uma jornada falhou,
qual release foi afetada
e qual acao operacional executar.
```

---

### 9. Criar modelo de prioridade

Arquivo:

```text
backlog/PRIORITIZATION_MODEL.md
```

Dimensões:

```text
Business Value;

Learning Value;

Risk Reduction;

Portfolio Value;

Dependency Enablement;

Urgency;

Effort;

Change Risk.
```

Escala:

```text
1 a 5.
```

Fórmula didática:

```text
priority =
business
+ learning
+ risk reduction
+ portfolio
+ dependency
+ urgency
- effort
- change risk.
```

A fórmula não substitui julgamento.

---

### 10. Criar PriorityScore

```java
package br.com.formacao.finalproject.backlog;

public record PriorityScore(
        int businessValue,
        int learningValue,
        int riskReduction,
        int portfolioValue,
        int dependencyEnablement,
        int urgency,
        int effort,
        int changeRisk) {

    public int total() {
        return businessValue
                + learningValue
                + riskReduction
                + portfolioValue
                + dependencyEnablement
                + urgency
                - effort
                - changeRisk;
    }
}
```

---

### 11. Priorizar fundação sem antecipar repositório

Itens candidatos:

```text
B-001:
confirmar definition artifacts.

B-002:
criar backlog governance.

B-003:
definir evidence conventions.

B-004:
preparar mapa de dependencies.

B-005:
registrar quality hypotheses.
```

Não configure ainda:

- branch protection;
- pipeline;
- templates profissionais;
- release automation.

Esses itens podem existir no backlog, mas a execução pertence às aulas posteriores.

---

### 12. Criar histórias candidatas de entrada

Exemplos:

```text
B-010

Type:
STORY.

Title:
Registrar pedido de forma confiavel.

Outcome:
um comando repetido
nao cria pedidos duplicados.

Status:
READY_FOR_SCOPE_REVIEW.
```

```text
B-011

Type:
RISK_REDUCTION.

Title:
Isolar comandos por tenant.

Outcome:
nenhum pedido
e processado
fora do tenant autorizado.
```

Não detalhe ainda payload, endpoint ou regras finais.

---

### 13. Criar histórias candidatas de ciclo de vida

Exemplos:

```text
B-020:
acompanhar progresso do pedido.

B-021:
bloquear transicao invalida.

B-022:
registrar historico auditavel.

B-023:
expor estado atual
para consulta operacional.
```

Estados finais serão definidos na aula de escopo funcional e aprofundados na modelagem de domínio.

---

### 14. Criar candidatos de integração de estoque

Itens:

```text
B-030:
consultar capacidade externa.

B-031:
solicitar reserva.

B-032:
tratar indisponibilidade.

B-033:
evitar reserva duplicada.

B-034:
reconciliar resposta ambigua.

B-035:
liberar reserva em compensacao.
```

Todos permanecem candidatos até a aula 673.

---

### 15. Criar candidatos de pagamento

Itens:

```text
B-040:
solicitar autorizacao externa.

B-041:
tratar timeout ambiguo.

B-042:
deduplicar solicitacao.

B-043:
registrar autorizacao.

B-044:
compensar quando aplicavel.

B-045:
simular provider indisponivel.
```

O projeto não implementará uma plataforma de pagamentos.

Ele integrará um provider simulado ou abstrato.

---

### 16. Criar candidatos de fulfillment

Itens:

```text
B-050:
iniciar preparacao.

B-051:
registrar progresso.

B-052:
concluir preparacao.

B-053:
tratar falha operacional.

B-054:
emitir fatos de fulfillment.

B-055:
consultar visao operacional.
```

Detalhes de logística, transportadora ou WMS permanecem fora do projeto.

---

### 17. Criar candidatos de cancelamento

Itens:

```text
B-060:
solicitar cancelamento.

B-061:
validar elegibilidade.

B-062:
liberar reserva externa.

B-063:
cancelar efeitos pendentes.

B-064:
registrar compensacoes.

B-065:
comunicar resultado.
```

A aula 673 decidirá quais cenários entram no MVP.

---

### 18. Criar enablers arquiteturais

Exemplos:

```text
B-100:
enabler de idempotencia.

B-101:
enabler de Outbox.

B-102:
enabler de Inbox.

B-103:
enabler de tenant context.

B-104:
enabler de audit.

B-105:
enabler de correlation.

B-106:
enabler de migrations.

B-107:
enabler de contract testing.
```

Cada enabler deve apontar:

- histórias consumidoras;
- risco reduzido;
- evidence esperada;
- milestone.

---

### 19. Criar itens de qualidade

Itens:

```text
B-120:
teste de concorrencia.

B-121:
teste de duplicidade.

B-122:
teste cross-tenant.

B-123:
teste de contrato.

B-124:
teste de integracao.

B-125:
teste de arquitetura.

B-126:
teste de recovery.

B-127:
teste de rollback.
```

Qualidade não será deixada para o final.

---

### 20. Criar itens de operação

Itens:

```text
B-140:
definir SLO de jornada.

B-141:
instrumentar traces.

B-142:
criar metricas bounded.

B-143:
criar alertas acionaveis.

B-144:
criar dashboard operacional.

B-145:
criar runbooks.

B-146:
executar game day.

B-147:
coletar evidence operacional.
```

---

### 21. Criar itens de portfólio

Itens:

```text
B-160:
README executivo.

B-161:
diagrama publicavel.

B-162:
catalogo de ADRs sanitizado.

B-163:
demonstracao gravavel.

B-164:
relatorio de testes.

B-165:
relatorio de observabilidade.

B-166:
narrativa de trade-offs.

B-167:
roteiro de defesa tecnica.
```

Portfólio é trabalho do backlog, não tarefa esquecida no encerramento.

---

### 22. Criar guia de histórias

Arquivo:

```text
backlog/ACCEPTANCE_CRITERIA_GUIDE.md
```

Estrutura de história:

```text
Como:
ator ou sistema.

Quero:
capacidade ou comportamento.

Para:
resultado ou risco reduzido.
```

Campos adicionais:

- outcome;
- owner;
- dependencies;
- risks;
- acceptance criteria;
- evidence;
- milestone;
- review trigger.

---

### 23. Definir critérios de aceite

Critérios devem ser:

- observáveis;
- testáveis;
- específicos;
- ligados ao outcome;
- livres de detalhe prematuro;
- compatíveis com a fase.

Exemplo:

```text
dado o mesmo tenant,
operacao
e chave idempotente,

quando o comando valido
for repetido,

entao apenas um pedido
deve ser criado.
```

---

### 24. Criar AcceptanceCriterion

```java
package br.com.formacao.finalproject.backlog;

import java.util.Objects;

public record AcceptanceCriterion(
        String id,
        String given,
        String when,
        String then) {

    public AcceptanceCriterion {
        Objects.requireNonNull(id);
        Objects.requireNonNull(given);
        Objects.requireNonNull(when);
        Objects.requireNonNull(then);
    }
}
```

---

### 25. Criar catálogo de spikes

Arquivo:

```text
backlog/RISK_SPIKE_CATALOG.md
```

Spikes:

```text
S-001:
estrategia de consistencia
para reserva externa.

S-002:
modelo de isolamento
multi-tenant.

S-003:
latencia aceitavel
da orquestracao.

S-004:
estrategia de Outbox.

S-005:
recovery apos timeout ambiguo.

S-006:
escopo de observabilidade.

S-007:
coexistencia com provider simulado.
```

Cada spike possui:

- pergunta;
- hipótese;
- timebox;
- método;
- evidence;
- decisão;
- owner.

---

### 26. Definir spike timeboxed

Exemplo:

```text
S-001

Question:
como evitar inconsistencias
ao reservar estoque externo?

Timebox:
4 horas.

Methods:
sequence diagram;
failure table;
prototype;
duplicate test.

Evidence:
decision note;
test output;
trade-off comparison.

Expected decision:
sync command,
async workflow
ou modelo hibrido.
```

---

### 27. Criar mapa de dependências

Arquivo:

```text
backlog/DEPENDENCY_MAP.md
```

Exemplo:

```text
B-010 Registrar pedido
depends on:
B-103 Tenant Context;
B-100 Idempotency;
B-106 Migrations.

B-031 Solicitar reserva
depends on:
S-001 Consistency Spike;
B-107 Contract Testing.

B-064 Registrar compensacoes
depends on:
B-031 Reserva;
B-040 Pagamento;
B-101 Outbox;
B-102 Inbox.
```

---

### 28. Criar BacklogDependency

```java
package br.com.formacao.finalproject.backlog;

import java.util.Objects;

public record BacklogDependency(
        String sourceItemId,
        String targetItemId,
        String rationale,
        boolean hardDependency) {

    public BacklogDependency {
        Objects.requireNonNull(sourceItemId);
        Objects.requireNonNull(targetItemId);
        Objects.requireNonNull(rationale);

        if (sourceItemId.equals(targetItemId)) {
            throw new IllegalArgumentException(
                    "Item cannot depend on itself");
        }
    }
}
```

---

### 29. Detectar ciclos

Ciclo inválido:

```text
B-010 -> B-100;

B-100 -> B-010.
```

Resultado:

```text
FAIL_DEPENDENCY_CYCLE
```

Um enabler pode ser desenvolvido junto do primeiro consumer.

Mas o backlog precisa representar a relação sem ciclo lógico.

---

### 30. Criar estratégia de vertical slices

Arquivo:

```text
backlog/VERTICAL_SLICE_STRATEGY.md
```

Slices candidatos:

```text
VS-01:
pedido minimo confiavel.

VS-02:
pedido com integracao externa simulada.

VS-03:
pedido com efeitos assincronos.

VS-04:
cancelamento com compensacao.

VS-05:
jornada observavel e operavel.

VS-06:
entrega publicavel de portfolio.
```

Cada slice atravessa:

- comportamento;
- domínio;
- persistência;
- contrato;
- teste;
- observabilidade;
- documentação.

A profundidade exata será refinada depois.

---

### 31. Evitar horizontal slicing

Sequência problemática:

```text
todas as entities;

todos os repositories;

todos os services;

todos os controllers;

todos os testes.
```

Essa ordem adia feedback de integração.

Prefira:

```text
um fluxo pequeno,
testado
e demonstravel.
```

---

### 32. Criar milestone plan

Arquivo:

```text
backlog/MILESTONE_PLAN.md
```

Milestones:

```text
M0:
definicao e planejamento.

M1:
fundacao arquitetural validada.

M2:
primeiro vertical slice demonstravel.

M3:
orquestracao com integracao externa.

M4:
eventos, compensacao e recovery.

M5:
seguranca, observabilidade e operacao.

M6:
qualidade, CI/CD e entrega containerizada.

M7:
portfolio, defesa e fechamento.
```

Datas não precisam ser inventadas.

Use ordem e critérios de saída.

---

### 33. Definir saída do M0

Critérios:

- projeto definido;
- backlog ordenado;
- escopo funcional aprovado;
- domínio inicial modelado;
- arquitetura documentada;
- decisões críticas registradas;
- riscos principais visíveis.

Alguns desses critérios serão produzidos nas próximas aulas.

---

### 34. Definir saída do M1

Critérios candidatos:

- boundaries aprovados;
- modelo de dados inicial;
- C4;
- ADRs;
- repositório configurado;
- testes básicos;
- primeira migration;
- gate de arquitetura.

A execução ainda não acontece nesta aula.

---

### 35. Definir saída do primeiro vertical slice

Critérios candidatos:

- comportamento demonstrável;
- tenant validado;
- idempotência testada;
- persistência;
- contrato;
- teste automatizado;
- trace básico;
- documentação;
- evidence.

A aula 673 decidirá qual comportamento entra.

---

### 36. Criar Release Hypotheses

Arquivo:

```text
backlog/RELEASE_HYPOTHESES.md
```

Hipóteses:

```text
R0:
documentacao e planejamento.

R1:
primeiro fluxo local.

R2:
integracao externa simulada.

R3:
efeitos assincronos.

R4:
resiliencia e operacao.

R5:
portfolio defensavel.
```

Release hypothesis não é release prometida.

Ela orienta aprendizagem.

---

### 37. Criar Definition of Ready

Arquivo:

```text
backlog/DEFINITION_OF_READY.md
```

Um item pode entrar em execução quando possui:

- outcome;
- owner;
- prioridade;
- dependências conhecidas;
- riscos conhecidos;
- critérios de aceite;
- evidence esperada;
- milestone;
- tamanho adequado;
- nenhuma decisão crítica invisível.

---

### 38. Criar Definition of Done

Arquivo:

```text
backlog/DEFINITION_OF_DONE.md
```

Um item está concluído quando:

- comportamento foi implementado;
- testes passam;
- critérios de aceite passam;
- segurança foi verificada;
- observabilidade necessária existe;
- documentação foi atualizada;
- evidence foi coletada;
- revisão foi concluída;
- nenhum blocker permanece;
- artefato está reproduzível.

`Done` não significa apenas código compilando.

---

### 39. Criar evidence traceability

Arquivo:

```text
backlog/EVIDENCE_TRACEABILITY.md
```

Exemplo:

```text
Claim:
comando duplicado
nao duplica pedido.

Backlog items:
B-010;
B-100;
B-121.

Evidence:
duplicate test;
unique constraint;
idempotency report;
audit sample.

Portfolio artifact:
reliability case study.
```

---

### 40. Criar EvidenceRequirement

```java
package br.com.formacao.finalproject.backlog;

import java.util.Objects;

public record EvidenceRequirement(
        String id,
        String claim,
        String evidenceType,
        String acceptance,
        String artifactPath) {

    public EvidenceRequirement {
        Objects.requireNonNull(id);
        Objects.requireNonNull(claim);
        Objects.requireNonNull(evidenceType);
        Objects.requireNonNull(acceptance);
        Objects.requireNonNull(artifactPath);
    }
}
```

---

### 41. Criar plano de portfólio

Arquivo:

```text
backlog/PORTFOLIO_DELIVERY_PLAN.md
```

Entregas:

```text
P-01:
README executivo.

P-02:
demo do fluxo principal.

P-03:
C4 sanitizado.

P-04:
ADRs selecionados.

P-05:
relatorio de testes.

P-06:
caso de idempotencia.

P-07:
caso de observabilidade.

P-08:
caso de rollout.

P-09:
roteiro de entrevista.

P-10:
defesa final.
```

Cada entrega possui milestone e source artifacts.

---

### 42. Criar governança do backlog

Arquivo:

```text
backlog/BACKLOG_GOVERNANCE.md
```

Regras:

- revisar ordem ao final de cada aula;
- não iniciar item sem Ready;
- não concluir sem evidence;
- registrar item removido e motivo;
- limitar trabalho em progresso;
- priorizar blockers;
- preservar vertical slices;
- evitar épicos sem owner;
- revisar riscos semanalmente;
- manter itens funcionais condicionados à aula 673.

---

### 43. Limitar trabalho em progresso

Política candidata:

```text
um item principal;

um enabler associado;

um item de evidence;

por ciclo de trabalho.
```

O limite reduz dispersão.

Não significa que todas as atividades serão sequenciais.

---

### 44. Criar perguntas abertas

Arquivo:

```text
backlog/OPEN_BACKLOG_QUESTIONS.md
```

Perguntas:

```text
qual fluxo sera o MVP?

estoque e pagamento
entram no mesmo milestone?

qual profundidade
de fulfillment?

qual cenario de cancelamento
sera implementado?

qual volume sera simulado?

qual evidencia
mais fortalece o portfolio?

qual item pode ser removido
sem perder demonstracao?
```

Essas perguntas serão tratadas no recorte funcional.

---

### 45. Criar boundary da próxima aula

Arquivo:

```text
backlog/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 672 organiza candidatos,
prioridades,
dependencies,
milestones
e evidence.

A aula 673 decide:

- o que entra;
- o que sai;
- quais atores;
- quais fluxos;
- quais regras;
- quais estados;
- quais erros;
- quais limites funcionais.

Nenhum escopo funcional
e considerado final
nesta aula.
```

---

### 46. Testar item sem outcome

Cenário:

```text
Title:
Criar Redis.

Outcome:
ausente.
```

Resultado:

```text
FAIL_BACKLOG_ITEM_OUTCOME
```

Tecnologia só entra quando ligada a problema ou risco.

---

### 47. Testar prioridade sem rationale

Item possui score alto, mas não explica:

- valor;
- risco;
- dependência;
- evidence.

Resultado:

```text
FAIL_PRIORITY_RATIONALE
```

---

### 48. Testar spike sem timebox

Spike:

```text
pesquisar Kafka.
```

Sem pergunta, método ou prazo.

Resultado:

```text
FAIL_SPIKE_TIMEBOX
```

---

### 49. Testar milestone sem evidence

Milestone declara:

```text
orquestracao concluida.
```

Sem teste, demo, report ou gate.

Resultado:

```text
FAIL_MILESTONE_EVIDENCE
```

---

### 50. Criar reports

Exemplo:

```yaml
finalProjectBacklog:
  epics:
    candidate:
      12

  items:
    total:
      68
    candidate:
      44
    readyForScopeReview:
      24
    selected:
      0

  dependencies:
    total:
      31
    cycles:
      0

  spikes:
    total:
      7
    timeboxed:
      7

  milestones:
    total:
      8
    withExitCriteria:
      8
    withEvidence:
      8

  portfolio:
    deliveries:
      10

  functionalScope:
    finalized:
      false

  gate:
    PASS
```

---

### 51. Criar evidence

Arquivo:

```text
contracts/final-project-backlog-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- epic count;
- backlog item count;
- candidate item count;
- ready for scope review count;
- selected item count;
- dependency count;
- dependency cycle count;
- spike count;
- timeboxed spike count;
- milestone count;
- milestone exit criteria coverage;
- milestone evidence coverage;
- ready policy status;
- done policy status;
- evidence traceability coverage;
- portfolio delivery count;
- backlog governance status;
- functional scope finalized;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- dados reais;
- clientes reais;
- endpoints finais;
- regras funcionais finais;
- agregados finais;
- tabelas finais;
- topologia final;
- credenciais;
- conteúdo detalhado da aula 673.

---

### 52. Criar gate

O gate valida:

- charter;
- tipos;
- épicos;
- outcomes;
- prioridades;
- dependências;
- ausência de ciclos;
- spikes;
- milestones;
- Ready;
- Done;
- evidence traceability;
- portfolio plan;
- governance;
- reports;
- evidence;
- não antecipação.

Status:

```text
PASS;

FAIL_BACKLOG_CHARTER;

FAIL_ITEM_TYPE;

FAIL_ITEM_OUTCOME;

FAIL_EPIC_OWNER;

FAIL_PRIORITY;

FAIL_DEPENDENCY;

FAIL_DEPENDENCY_CYCLE;

FAIL_SPIKE;

FAIL_MILESTONE;

FAIL_READY;

FAIL_DONE;

FAIL_EVIDENCE_TRACEABILITY;

FAIL_PORTFOLIO_PLAN;

FAIL_GOVERNANCE;

FAIL_SCOPE_ANTICIPATION;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 53. Executar validação completa

```powershell
.\scripts\m20\orderflow-final-project-backlog\validate-backlog-contract.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-backlog-items.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-epics.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-priorities.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-dependencies.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-milestones.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-ready-done.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-evidence-traceability.ps1

.\scripts\m20\orderflow-final-project-backlog\validate-portfolio-deliveries.ps1

.\scripts\m20\orderflow-final-project-backlog\run-final-project-backlog-tests.ps1

.\scripts\m20\orderflow-final-project-backlog\collect-final-project-backlog-evidence.ps1

.\scripts\m20\orderflow-final-project-backlog\verify-final-project-backlog-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 54. Encerrar o laboratório

Confirme:

- charter;
- tipos de item;
- épicos candidatos;
- backlog ordenado;
- outcomes;
- priorities;
- dependencies;
- absence of cycles;
- vertical slices;
- milestones;
- release hypotheses;
- Ready;
- Done;
- acceptance criteria;
- spikes;
- evidence traceability;
- portfolio deliveries;
- governance;
- reports;
- evidence;
- gate aprovado;
- escopo funcional não finalizado.

---

## Entendendo o que foi feito

### O projeto ganhou ordem

A definição abstrata do OrderFlow foi transformada em itens, épicos, dependências, milestones e evidências.

### O backlog preservou intenção

Itens não foram reduzidos a tarefas de framework.

Cada item possui outcome, owner, risco, aceite e evidence.

### Risco entrou na prioridade

A ordem não foi definida apenas por valor funcional.

Aprendizagem, redução de risco, dependências e portfólio também influenciaram.

### Spikes ganharam limite

Investigações passaram a possuir pergunta, timebox, método e decisão esperada.

### Milestones ganharam saída verificável

Um milestone não termina por calendário.

Ele termina quando critérios e evidências passam.

### Portfólio entrou no planejamento

README, diagramas, ADRs, demos, relatórios e defesa passaram a ser entregas explícitas.

### O escopo funcional permaneceu aberto

O backlog organizou candidatos.

A aula 673 decidirá o recorte funcional real.

---

## Erros comuns importantes

### Backlog de tarefas técnicas

O projeto perde conexão com valor e risco.

### Épico por camada

`Frontend`, `Backend` e `Banco` não representam outcomes.

### Prioridade por preferência

Sem rationale, a ordem vira opinião.

### Tudo classificado como urgente

Nenhum trade-off é realizado.

### Spike sem pergunta

A pesquisa não termina.

### Enabler sem consumer

A infraestrutura vira finalidade.

### Dependência escondida

O item bloqueia tarde.

### Milestone sem evidence

A conclusão não pode ser provada.

### Done igual a código compilando

Segurança, teste, observabilidade e documentação ficam incompletos.

### Portfólio deixado para o final

As melhores evidências se perdem.

### Antecipar escopo funcional

Detalhamento de fluxos e regras pertence à aula 673.

---

## Comandos úteis

### Validar backlog

```powershell
.\scripts\m20\orderflow-final-project-backlog\validate-backlog-items.ps1
```

### Validar prioridades

```powershell
.\scripts\m20\orderflow-final-project-backlog\validate-priorities.ps1
```

### Validar dependências

```powershell
.\scripts\m20\orderflow-final-project-backlog\validate-dependencies.ps1
```

### Validar milestones

```powershell
.\scripts\m20\orderflow-final-project-backlog\validate-milestones.ps1
```

### Executar testes

```powershell
.\scripts\m20\orderflow-final-project-backlog\run-final-project-backlog-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m20\orderflow-final-project-backlog\verify-final-project-backlog-gate.ps1
```

---

## Exercício guiado

Selecione o épico candidato:

```text
E-07:
Cancelamento e compensacoes.
```

Crie:

1. outcome;
2. cinco histórias candidatas;
3. dois enablers;
4. um spike;
5. riscos;
6. dependências;
7. prioridade;
8. milestone;
9. acceptance criteria;
10. evidence;
11. portfolio artifact;
12. perguntas para a aula 673.

Não feche regras finais de cancelamento.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 671 e ponte para a aula 673 foram preservadas;
- laboratório `orderflow-final-project-backlog` foi criado;
- Backlog Charter foi criado;
- contrato principal foi criado;
- tipos de item foram definidos;
- BacklogItem foi criado;
- status foram definidos;
- Epic Catalog foi criado;
- épicos possuem outcomes;
- modelo de prioridade foi criado;
- PriorityScore foi criado;
- itens candidatos de entrada foram criados;
- itens candidatos de ciclo de vida foram criados;
- candidatos de estoque foram criados;
- candidatos de pagamento foram criados;
- candidatos de fulfillment foram criados;
- candidatos de cancelamento foram criados;
- enablers arquiteturais foram criados;
- itens de qualidade foram criados;
- itens de operação foram criados;
- itens de portfólio foram criados;
- guia de histórias foi criado;
- critérios de aceite são testáveis;
- AcceptanceCriterion foi criado;
- Risk Spike Catalog foi criado;
- spikes possuem timebox;
- Dependency Map foi criado;
- BacklogDependency foi criado;
- ciclos foram proibidos;
- Vertical Slice Strategy foi criada;
- horizontal slicing foi evitado;
- Milestone Plan foi criado;
- critérios de saída foram definidos;
- Release Hypotheses foi criada;
- Definition of Ready foi criada;
- Definition of Done foi criada;
- Evidence Traceability foi criada;
- EvidenceRequirement foi criado;
- Portfolio Delivery Plan foi criado;
- Backlog Governance foi criada;
- trabalho em progresso foi limitado;
- perguntas abertas foram registradas;
- boundary da aula 673 foi criado;
- testes de outcome, prioridade, spike e milestone foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- escopo funcional detalhado não foi antecipado.

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
  labs/m20/aula-672-backlog-projeto-final/orderflow-final-project-backlog `
  scripts/m20/orderflow-final-project-backlog `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|privateEndpoint|productionTopology|finalFunctionalScope"
```

Commit recomendado:

```powershell
git commit -m "docs(m20): organizar backlog do projeto final"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- clientes reais;
- dados sensíveis;
- endpoints finais;
- regras funcionais finais;
- agregados finais;
- banco final;
- C4 final;
- conteúdo detalhado da aula 673.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você transformou a definição do OrderFlow em um backlog profissional.

Você criou:

```text
Backlog Charter;

Backlog Item Types;

Epic Catalog;

Initial Ordered Backlog;

Prioritization Model;

Dependency Map;

Vertical Slice Strategy;

Milestone Plan;

Release Hypotheses;

Definition of Ready;

Definition of Done;

Acceptance Criteria Guide;

Risk Spike Catalog;

Evidence Traceability;

Portfolio Delivery Plan;

Backlog Governance;

reports, evidence e gate.
```

Você comprovou que backlog não é uma lista de tarefas técnicas.

Ele organiza outcomes, riscos, aprendizagem, dependências, milestones, evidências e entregas de portfólio.

Você também preservou a natureza progressiva do planejamento.

Os itens funcionais continuam candidatos.

A próxima aula será:

```text
673 - M20.03 - Escopo funcional
```

Nela, você irá decidir o recorte funcional do OrderFlow, detalhar atores, fluxos, regras, estados, entradas, saídas, erros, limites e critérios de aceitação do produto final.

Nenhum escopo funcional detalhado foi finalizado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o charter.
- [ ] Defini tipos de item.
- [ ] Criei épicos candidatos.
- [ ] Ordenei o backlog.
- [ ] Defini prioridades.
- [ ] Mapeei dependências.
- [ ] Evitei ciclos.
- [ ] Planejei vertical slices.
- [ ] Criei milestones.
- [ ] Defini Ready e Done.
- [ ] Criei spikes.
- [ ] Mapeei evidence.
- [ ] Planejei portfólio.
- [ ] Preservei o escopo da aula 673.

---

## Troubleshooting adicional

### O backlog possui centenas de itens

Agrupe por épicos e mantenha detalhe progressivo.

### Não sei estimar esforço

Use faixas relativas e registre incerteza.

### Todas as histórias dependem de tudo

Revise boundaries e slices.

### O enabler parece grande

Associe ao primeiro consumer e divida por evidence.

### O spike não produz decisão

Reescreva pergunta e acceptance.

### O milestone depende de calendário

Defina critérios de saída verificáveis.

### O portfólio não aparece no backlog

Crie itens explícitos e fontes de evidence.

### Um item funcional já parece fechado

Mude para `READY_FOR_SCOPE_REVIEW` e preserve a decisão para a aula 673.

### Existe item de tecnologia sem outcome

Remova ou conecte a risco, capacidade ou entrega.

### O backlog muda com frequência

Registre rationale e preserve histórico das decisões.

### Quero detalhar regras de negócio agora

Essa etapa pertence à aula 673.

---

## Perguntas de revisão

1. O que é backlog de projeto final?
2. Por que backlog não é lista de tarefas?
3. O que é épico?
4. O que é story?
5. O que é enabler?
6. O que é spike?
7. O que é risk reduction item?
8. O que deve orientar prioridade?
9. O que é dependency?
10. Por que ciclos são perigosos?
11. O que é vertical slice?
12. Qual problema do horizontal slicing?
13. O que é milestone?
14. Como um milestone termina?
15. O que é release hypothesis?
16. O que é Definition of Ready?
17. O que é Definition of Done?
18. Por que evidence entra no backlog?
19. Por que portfólio entra no backlog?
20. O que é WIP limit?
21. Por que itens funcionais permanecem candidatos?
22. O que a aula 673 fará?
23. O que não foi definido nesta aula?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Sistema ordenado de outcomes, riscos e entregas.
2. Porque tarefas não representam valor e evidence.
3. Resultado amplo que organiza itens.
4. Comportamento demonstrável.
5. Capacidade técnica que viabiliza entrega.
6. Investigação timeboxed.
7. Item que reduz risco explícito.
8. Valor, aprendizagem, risco, dependência e esforço.
9. Relação de precedência entre itens.
10. Porque impedem ordem executável.
11. Entrega pequena atravessando camadas.
12. Feedback de integração tardio.
13. Estado verificável do projeto.
14. Com exit criteria e evidence.
15. Hipótese de pacote demonstrável.
16. Critérios para iniciar.
17. Critérios para concluir.
18. Porque claims precisam de prova.
19. Porque a apresentação também é entrega.
20. Limite de trabalho simultâneo.
21. Porque o escopo será decidido depois.
22. Fechar escopo funcional.
23. Fluxos e regras finais.
24. Escopo funcional.
25. Backlog organiza resultados, não tarefas.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 672 - M20.02 - Backlog projeto final

- Continuei após Definição projeto final.
- Criei o laboratório `orderflow-final-project-backlog`.
- Criei Backlog Charter.
- Criei o contrato principal.
- Defini tipos de item.
- Criei BacklogItem.
- Defini status progressivos.
- Criei Epic Catalog.
- Registrei épicos candidatos do OrderFlow.
- Defini outcomes dos épicos.
- Criei Prioritization Model.
- Criei PriorityScore.
- Criei candidatos de entrada de pedidos.
- Criei candidatos de ciclo de vida.
- Criei candidatos de estoque.
- Criei candidatos de pagamento.
- Criei candidatos de fulfillment.
- Criei candidatos de cancelamento.
- Criei enablers arquiteturais.
- Criei itens de qualidade.
- Criei itens de operação.
- Criei itens de portfólio.
- Criei guia de histórias.
- Criei critérios de aceite testáveis.
- Criei AcceptanceCriterion.
- Criei Risk Spike Catalog.
- Defini spikes timeboxed.
- Criei Dependency Map.
- Criei BacklogDependency.
- Proibi ciclos.
- Criei Vertical Slice Strategy.
- Evitei horizontal slicing.
- Criei Milestone Plan.
- Defini critérios de saída.
- Criei Release Hypotheses.
- Criei Definition of Ready.
- Criei Definition of Done.
- Criei Evidence Traceability.
- Criei EvidenceRequirement.
- Criei Portfolio Delivery Plan.
- Criei Backlog Governance.
- Limitei trabalho em progresso.
- Registrei perguntas abertas.
- Criei boundary para a aula 673.
- Executei testes de backlog.
- Criei reports, evidence e gate.
- Não antecipei o escopo funcional.
- Próxima aula: Escopo funcional.
```

---

## Referência técnica curta

- Product Backlog.
- Epic.
- Story.
- Enabler.
- Spike.
- Risk Reduction.
- Outcome.
- Priority Score.
- Dependency Map.
- Vertical Slice.
- Milestone.
- Release Hypothesis.
- Definition of Ready.
- Definition of Done.
- Acceptance Criterion.
- Evidence Traceability.
- WIP Limit.
- Backlog Governance.

Regra final:

```text
O backlog do projeto final OrderFlow deve organizar resultados, riscos, aprendizagem, dependências, evidências e entregas de portfólio, nunca apenas tarefas técnicas: épicos representam outcomes amplos, stories representam comportamentos demonstráveis, enablers viabilizam consumers conhecidos, spikes possuem pergunta, timebox, método, evidence e decisão esperada, risk reduction items tratam ameaças explícitas, e prioridades consideram valor de negócio, aprendizagem, redução de risco, valor de portfólio, dependências, urgência, esforço e risco de mudança; dependências são visíveis e sem ciclos, vertical slices atravessam comportamento, domínio, persistência, contrato, teste, observabilidade e documentação, milestones terminam por exit criteria e evidence, release hypotheses orientam aprendizagem sem prometer escopo, Definition of Ready impede início prematuro, Definition of Done exige comportamento, testes, segurança, observabilidade, documentação e evidence, e o plano de portfólio transforma README, C4, ADRs, demos, relatórios e defesa em entregas explícitas; o gate termina com charter, tipos, épicos, backlog ordenado, prioridades, dependencies, slices, milestones, Ready, Done, spikes, evidence traceability, portfolio plan, governance, reports e tests aprovados, enquanto atores, fluxos, regras, estados, erros e limites funcionais permanecem reservados para a aula 673.
```
