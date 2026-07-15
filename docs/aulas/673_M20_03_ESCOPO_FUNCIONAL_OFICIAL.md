# 673 - M20.03 - Escopo funcional

## Apresentação da aula

Na aula 672, você transformou a definição do OrderFlow em um backlog profissional.

Foram criados:

- Backlog Charter;
- tipos de item;
- épicos candidatos;
- histórias candidatas;
- enablers;
- spikes;
- itens de redução de risco;
- prioridades;
- dependências;
- vertical slices;
- milestones;
- Definition of Ready;
- Definition of Done;
- critérios de aceite;
- rastreabilidade de evidências;
- entregas de portfólio;
- governança do backlog.

O backlog organizou possibilidades.

Agora é necessário decidir o que o produto realmente fará.

Essa decisão será registrada como escopo funcional.

Escopo funcional responde:

```text
quais atores usam o produto;

quais jornadas entram;

quais comportamentos existem;

quais regras precisam ser respeitadas;

quais estados sao visiveis;

quais erros devem ser tratados;

quais integracoes participam;

quais resultados sao esperados;

quais limites impedem
que o projeto cresca sem controle.
```

O erro mais comum seria tentar implementar todos os épicos candidatos.

Outro erro seria transformar o escopo em uma lista de telas e endpoints.

Exemplo fraco:

```text
tela de pedido;

endpoint de estoque;

endpoint de pagamento;

tela de cancelamento.
```

Essa lista não explica:

- qual problema é resolvido;
- quem inicia a ação;
- quais regras existem;
- como o fluxo termina;
- o que acontece em falhas;
- qual estado é observado;
- qual evidência comprova o comportamento.

O escopo funcional do OrderFlow será orientado por jornadas.

O projeto final deverá demonstrar um fluxo de orquestração completo, mas concluível por uma pessoa.

O recorte escolhido será:

```text
receber pedido;

validar tenant e idempotencia;

solicitar reserva de estoque;

solicitar autorizacao de pagamento;

iniciar fulfillment;

acompanhar progresso;

cancelar quando elegivel;

executar compensacoes;

consultar estado e historico;

produzir eventos e evidencias operacionais.
```

O projeto não será:

- marketplace;
- catálogo completo;
- checkout completo;
- gateway de pagamento;
- WMS;
- transportadora;
- ERP;
- CRM;
- plataforma de analytics;
- sistema de identidade;
- frontend completo.

Essas capacidades serão representadas por atores, providers simulados ou integrações abstratas quando necessário.

O laboratório será:

```text
labs/m20/aula-673-escopo-funcional/orderflow-functional-scope
```

Você criará:

- Functional Scope Charter;
- atores;
- jornadas;
- casos de uso;
- fluxos principais;
- fluxos alternativos;
- regras funcionais;
- catálogo de estados funcionais;
- comandos e consultas em nível funcional;
- eventos de negócio candidatos;
- catálogo de erros;
- critérios de aceite;
- matriz de inclusão e exclusão;
- MVP;
- releases funcionais;
- rastreabilidade com o backlog;
- reports, evidence e gate.

A próxima aula será:

```text
674 - M20.04 - Modelagem dominio final
```

Na aula 674, o escopo funcional será traduzido em linguagem de domínio, aggregates, entities, value objects, invariantes, domain services, commands, events e boundaries.

Nesta aula, a modelagem de domínio final não será antecipada.

Regra central:

```text
escopo funcional forte
define o comportamento
que sera entregue

e tambem declara
o que nao sera entregue.
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
```

A aula 671 escolheu o projeto.

A aula 672 organizou o trabalho.

A aula 673 fecha o recorte funcional.

A aula 674 transformará comportamento em modelo de domínio.

Essa ordem evita dois problemas.

Primeiro:

```text
modelar entidades
para funcionalidades
que nunca serao implementadas.
```

Segundo:

```text
fechar arquitetura
antes de entender
as jornadas reais.
```

O escopo precisa ser suficientemente detalhado para orientar a modelagem.

Mas não deve antecipar:

- classes finais;
- nomes finais de aggregates;
- entidades JPA;
- schemas;
- tabelas;
- tópicos;
- containers;
- tecnologias de infraestrutura;
- organização final do repositório.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-673-escopo-funcional
└── orderflow-functional-scope
    ├── README.md
    ├── scope
    │   ├── FUNCTIONAL_SCOPE_CHARTER.md
    │   ├── ACTOR_CATALOG.md
    │   ├── JOURNEY_CATALOG.md
    │   ├── USE_CASE_CATALOG.md
    │   ├── PRIMARY_FLOWS.md
    │   ├── ALTERNATIVE_FLOWS.md
    │   ├── FUNCTIONAL_RULES.md
    │   ├── FUNCTIONAL_STATE_CATALOG.md
    │   ├── FUNCTIONAL_COMMANDS.md
    │   ├── FUNCTIONAL_QUERIES.md
    │   ├── BUSINESS_EVENT_CANDIDATES.md
    │   ├── FUNCTIONAL_ERROR_CATALOG.md
    │   ├── FUNCTIONAL_ACCEPTANCE_CRITERIA.md
    │   ├── IN_SCOPE.md
    │   ├── OUT_OF_SCOPE.md
    │   ├── MVP_SCOPE.md
    │   ├── FUNCTIONAL_RELEASE_PLAN.md
    │   ├── BACKLOG_TRACEABILITY.md
    │   ├── FUNCTIONAL_RISK_REGISTER.md
    │   ├── FUNCTIONAL_OPEN_QUESTIONS.md
    │   └── NEXT_LESSON_BOUNDARY.md
    ├── contracts
    │   ├── functional-scope-contract.yaml
    │   ├── actor-policy.yaml
    │   ├── journey-policy.yaml
    │   ├── use-case-policy.yaml
    │   ├── functional-rule-policy.yaml
    │   ├── state-policy.yaml
    │   ├── error-policy.yaml
    │   ├── acceptance-policy.yaml
    │   ├── inclusion-exclusion-policy.yaml
    │   ├── MVP-policy.yaml
    │   ├── traceability-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/finalproject/scope
    │   │           ├── FunctionalActor.java
    │   │           ├── FunctionalJourney.java
    │   │           ├── FunctionalUseCase.java
    │   │           ├── FunctionalRule.java
    │   │           ├── FunctionalState.java
    │   │           ├── FunctionalError.java
    │   │           ├── ScopeDecision.java
    │   │           ├── FunctionalAcceptance.java
    │   │           └── FunctionalScopeGate.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/finalproject/scope
    │               ├── ActorOwnershipTest.java
    │               ├── JourneyCompletenessTest.java
    │               ├── UseCaseOutcomeTest.java
    │               ├── FunctionalRuleTest.java
    │               ├── StateTransitionCoverageTest.java
    │               ├── ErrorCatalogTest.java
    │               ├── DomainModelNonAnticipationTest.java
    │               └── FunctionalScopeGateTest.java
    └── reports
        ├── actor-report.yaml
        ├── journey-report.yaml
        ├── use-case-report.yaml
        ├── functional-rule-report.yaml
        ├── state-report.yaml
        ├── error-report.yaml
        ├── MVP-report.yaml
        ├── traceability-report.yaml
        ├── architecture-report.yaml
        └── functional-scope-gate-report.yaml
```

Scripts:

```text
scripts/m20/orderflow-functional-scope
├── validate-functional-scope-contract.ps1
├── validate-actors.ps1
├── validate-journeys.ps1
├── validate-use-cases.ps1
├── validate-functional-rules.ps1
├── validate-functional-states.ps1
├── validate-functional-errors.ps1
├── validate-MVP-scope.ps1
├── validate-backlog-traceability.ps1
├── run-functional-scope-tests.ps1
├── collect-functional-scope-evidence.ps1
└── verify-functional-scope-gate.ps1
```

---

## Conceito essencial

### Escopo é uma decisão

Escopo não é tudo o que poderia existir.

É o conjunto de comportamentos escolhidos para uma entrega.

Uma decisão de escopo considera:

- valor;
- aprendizagem;
- risco;
- esforço;
- dependências;
- capacidade;
- demonstrabilidade;
- portfólio;
- prazo;
- evolução futura.

### Funcionalidade é comportamento observável

Exemplo:

```text
registrar pedido
sem duplicidade.
```

Isso é comportamento.

Exemplo:

```text
usar annotation @Transactional.
```

Isso é decisão técnica.

A funcionalidade deve permanecer compreensível para pessoas de produto, operação, QA e engenharia.

### Jornada conecta casos de uso

Uma jornada mostra como vários comportamentos produzem um resultado.

Exemplo:

```text
receber pedido;

reservar estoque;

autorizar pagamento;

iniciar fulfillment;

concluir pedido.
```

Cada etapa pode possuir falhas e alternativas.

### Regra funcional não é detalhe de implementação

Regra:

```text
um pedido cancelado
nao pode iniciar fulfillment.
```

Detalhe técnico:

```text
usar optimistic locking.
```

A regra pertence ao escopo.

O mecanismo será decidido depois.

### Estado funcional é percepção do negócio

Estados funcionais ajudam a comunicar a jornada.

Eles não obrigam uma enum Java final.

Exemplo:

```text
RECEBIDO;

EM_PROCESSAMENTO;

AGUARDANDO_ESTOQUE;

AGUARDANDO_PAGAMENTO;

EM_FULFILLMENT;

CONCLUIDO;

CANCELADO;

FALHA.
```

A modelagem de domínio poderá revisar nomes, agrupamentos e transições.

### Erro funcional precisa ser previsível

Erros esperados fazem parte do comportamento:

- pedido duplicado;
- tenant inválido;
- estoque indisponível;
- pagamento recusado;
- cancelamento não permitido;
- provider indisponível;
- versão de estado conflitante.

Eles não devem ser tratados como exceções desconhecidas.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-673-escopo-funcional/orderflow-functional-scope

Set-Location `
  labs/m20/aula-673-escopo-funcional/orderflow-functional-scope
```

---

### 2. Criar Functional Scope Charter

Arquivo:

```text
scope/FUNCTIONAL_SCOPE_CHARTER.md
```

Conteúdo:

```markdown
# Functional Scope Charter

Projeto

OrderFlow.

Objetivo

Definir o comportamento
que sera implementado
e demonstrado
no projeto final.

Principios

- journey before endpoint;
- behavior before technology;
- explicit inclusion;
- explicit exclusion;
- predictable errors;
- observable outcomes;
- MVP must be finishable;
- domain modeling belongs to lesson 674;
- every function traces to backlog and evidence.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/functional-scope-contract.yaml
```

Conteúdo:

```yaml
functionalScope:
  project:
    OrderFlow

  required:
    - charter
    - actors
    - journeys
    - use-cases
    - primary-flows
    - alternative-flows
    - functional-rules
    - functional-states
    - functional-commands
    - functional-queries
    - business-event-candidates
    - functional-errors
    - acceptance-criteria
    - in-scope
    - out-of-scope
    - MVP
    - release-plan
    - backlog-traceability
    - risks
    - reports
    - evidence
    - gate

  forbidden:
    - use-case-without-outcome
    - rule-without-scenario
    - state-without-meaning
    - error-without-consumer-response
    - hidden-out-of-scope
    - all-backlog-items-in-MVP
    - final-aggregate-model
    - final-entity-model
    - final-value-object-model
    - final-database-model
    - final-C4

  nextLesson:
    code:
      M20.04
```

---

### 4. Criar catálogo de atores

Arquivo:

```text
scope/ACTOR_CATALOG.md
```

Atores:

```text
Canal de Venda;

Operador do Tenant;

Administrador do Tenant;

Sistema de Estoque;

Provedor de Pagamento;

Sistema de Fulfillment;

Operador de Suporte;

Auditor;

Worker de Orquestracao;

Observador de Operacoes.
```

Para cada ator:

- objetivo;
- ações;
- dados visíveis;
- permissões;
- erros relevantes;
- criticidade;
- owner da relação.

---

### 5. Criar FunctionalActor

```java
package br.com.formacao.finalproject.scope;

import java.util.List;
import java.util.Objects;

public record FunctionalActor(
        String id,
        String name,
        String objective,
        List<String> allowedActions,
        List<String> visibleInformation,
        String relationOwner) {

    public FunctionalActor {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(objective);
        allowedActions = List.copyOf(allowedActions);
        visibleInformation =
                List.copyOf(visibleInformation);
        Objects.requireNonNull(relationOwner);
    }
}
```

---

### 6. Definir ator primário

Ator primário do fluxo de entrada:

```text
Canal de Venda.
```

Objetivo:

```text
registrar um pedido
e receber identificacao
e estado inicial confiaveis.
```

O canal não controla:

- estoque;
- pagamento;
- fulfillment;
- estado interno da orquestração.

---

### 7. Definir atores externos simulados

Providers:

```text
Sistema de Estoque;

Provedor de Pagamento;

Sistema de Fulfillment.
```

Cada provider será simulado por contrato.

O escopo não inclui construir esses sistemas.

---

### 8. Criar catálogo de jornadas

Arquivo:

```text
scope/JOURNEY_CATALOG.md
```

Jornadas selecionadas:

```text
J-01:
Registrar e processar pedido.

J-02:
Acompanhar pedido.

J-03:
Cancelar pedido elegivel.

J-04:
Recuperar processamento falho.

J-05:
Auditar historico do pedido.
```

Jornadas adiadas:

```text
devolucao;

troca;

split shipment;

pagamento parcial;

multiplos estoques;

roteirizacao;

faturamento;

promocao;

catalogo.
```

---

### 9. Criar FunctionalJourney

```java
package br.com.formacao.finalproject.scope;

import java.util.List;
import java.util.Objects;

public record FunctionalJourney(
        String id,
        String name,
        String primaryActor,
        String outcome,
        List<String> useCaseIds,
        List<String> alternativeFlowIds,
        String successMeasure) {

    public FunctionalJourney {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(primaryActor);
        Objects.requireNonNull(outcome);
        useCaseIds = List.copyOf(useCaseIds);
        alternativeFlowIds =
                List.copyOf(alternativeFlowIds);
        Objects.requireNonNull(successMeasure);
    }
}
```

---

### 10. Detalhar jornada J-01

Fluxo:

```text
1. canal envia comando;

2. tenant e identificado;

3. chave idempotente e validada;

4. pedido e registrado;

5. reserva de estoque e solicitada;

6. autorizacao de pagamento e solicitada;

7. fulfillment e iniciado;

8. progresso e registrado;

9. pedido e concluido;

10. estado e historico ficam consultaveis.
```

Resultado:

```text
pedido processado
sem duplicidade
e com historico rastreavel.
```

---

### 11. Definir fluxo com estoque indisponível

Alternativa:

```text
pedido registrado;

reserva solicitada;

estoque rejeita;

pedido recebe resultado funcional
de indisponibilidade;

pagamento nao deve ser autorizado;

fulfillment nao deve iniciar;

historico registra a decisao.
```

O destino final poderá ser:

```text
FALHA
```

ou:

```text
CANCELADO
```

A modelagem de domínio decidirá a semântica final.

---

### 12. Definir fluxo com pagamento recusado

Alternativa:

```text
estoque reservado;

pagamento recusado;

reserva deve ser liberada;

fulfillment nao inicia;

pedido registra falha;

historico registra compensacao.
```

Essa jornada demonstra Saga e compensação.

---

### 13. Definir fluxo com timeout ambíguo

Cenário:

```text
provider recebeu a solicitacao,
mas o OrderFlow nao recebeu resposta.
```

Comportamento funcional:

- marcar processamento pendente;
- não repetir cegamente;
- consultar ou reconciliar;
- impedir efeito duplicado;
- permitir intervenção controlada;
- registrar histórico.

Mecanismos técnicos serão detalhados depois.

---

### 14. Criar catálogo de casos de uso

Arquivo:

```text
scope/USE_CASE_CATALOG.md
```

Casos selecionados:

```text
UC-01:
Registrar pedido.

UC-02:
Consultar pedido.

UC-03:
Listar historico.

UC-04:
Solicitar reserva de estoque.

UC-05:
Registrar resultado de estoque.

UC-06:
Solicitar autorizacao de pagamento.

UC-07:
Registrar resultado de pagamento.

UC-08:
Iniciar fulfillment.

UC-09:
Registrar progresso de fulfillment.

UC-10:
Concluir fulfillment.

UC-11:
Solicitar cancelamento.

UC-12:
Executar compensacoes.

UC-13:
Reconciliar processamento pendente.

UC-14:
Reprocessar efeito seguro.

UC-15:
Consultar visao operacional.
```

---

### 15. Criar FunctionalUseCase

```java
package br.com.formacao.finalproject.scope;

import java.util.List;
import java.util.Objects;

public record FunctionalUseCase(
        String id,
        String name,
        String actor,
        String trigger,
        String outcome,
        List<String> preconditions,
        List<String> businessRules,
        List<String> expectedErrors,
        List<String> evidence) {

    public FunctionalUseCase {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
        Objects.requireNonNull(actor);
        Objects.requireNonNull(trigger);
        Objects.requireNonNull(outcome);
        preconditions = List.copyOf(preconditions);
        businessRules = List.copyOf(businessRules);
        expectedErrors = List.copyOf(expectedErrors);
        evidence = List.copyOf(evidence);
    }
}
```

---

### 16. Detalhar UC-01 Registrar pedido

Ator:

```text
Canal de Venda.
```

Precondições:

- tenant reconhecido;
- comando autenticado;
- dados mínimos presentes;
- chave idempotente presente.

Outcome:

```text
um pedido identificavel
e registrado uma unica vez.
```

Erros:

- tenant inválido;
- comando inválido;
- chave idempotente conflitante;
- versão de contrato incompatível.

---

### 17. Definir UC-02 Consultar pedido

A consulta deve retornar:

- identificação;
- tenant;
- estado funcional atual;
- etapa atual;
- falha conhecida;
- resultado das integrações;
- timestamps relevantes;
- versão da visão;
- links funcionais permitidos.

Não inclua dados internos desnecessários.

---

### 18. Definir UC-03 Listar histórico

Histórico funcional inclui:

- mudança;
- instante;
- ator ou sistema;
- causa;
- correlation;
- resultado;
- observação sanitizada.

O histórico deve ser imutável do ponto de vista funcional.

---

### 19. Definir UC-04 Solicitar reserva

Precondições:

- pedido registrado;
- pedido elegível;
- nenhuma reserva confirmada;
- nenhuma solicitação equivalente ativa.

Outcome:

```text
solicitacao de reserva
registrada e rastreavel.
```

Erros:

- pedido inexistente;
- estado incompatível;
- solicitação duplicada;
- provider indisponível.

---

### 20. Definir UC-06 Solicitar pagamento

Precondições:

- estoque reservado;
- valor total válido;
- pedido não cancelado;
- autorização ainda não confirmada.

Outcome:

```text
solicitacao de autorizacao
registrada uma unica vez.
```

Pagamento real fica fora do sistema.

---

### 21. Definir UC-08 Iniciar fulfillment

Precondições:

- estoque reservado;
- pagamento autorizado;
- pedido elegível;
- fulfillment ainda não iniciado.

Outcome:

```text
fulfillment iniciado
com referencia rastreavel.
```

---

### 22. Definir UC-11 Solicitar cancelamento

Ator:

```text
Operador do Tenant
```

ou:

```text
Canal de Venda.
```

O cancelamento será aceito quando:

- pedido existe;
- tenant coincide;
- estado permite;
- fulfillment não ultrapassou ponto irreversível;
- nenhuma conclusão final ocorreu.

---

### 23. Definir cancelamento não elegível

Erros:

```text
ORDER_ALREADY_COMPLETED;

FULFILLMENT_IRREVERSIBLE;

CANCELLATION_ALREADY_REQUESTED;

ORDER_NOT_FOUND;

TENANT_MISMATCH.
```

O sistema deve retornar motivo funcional previsível.

---

### 24. Definir UC-12 Executar compensações

Compensações candidatas:

```text
liberar estoque;

cancelar autorizacao
ou registrar reversao simulada;

cancelar fulfillment
quando permitido;

registrar resultado;

emitir fatos;

atualizar historico.
```

Nem toda compensação garante reversão total.

O estado funcional deve representar resultado parcial quando necessário.

---

### 25. Criar fluxos principais

Arquivo:

```text
scope/PRIMARY_FLOWS.md
```

Fluxos principais:

```text
PF-01:
pedido concluido com sucesso.

PF-02:
consulta de estado.

PF-03:
cancelamento antes do fulfillment.

PF-04:
reconciliacao de processamento pendente.

PF-05:
auditoria de historico.
```

Cada fluxo aponta para casos de uso e acceptance criteria.

---

### 26. Criar fluxos alternativos

Arquivo:

```text
scope/ALTERNATIVE_FLOWS.md
```

Alternativas:

```text
AF-01:
pedido duplicado.

AF-02:
estoque indisponivel.

AF-03:
pagamento recusado.

AF-04:
timeout de estoque.

AF-05:
timeout de pagamento.

AF-06:
fulfillment falha.

AF-07:
cancelamento nao permitido.

AF-08:
compensacao parcial.

AF-09:
evento duplicado.

AF-10:
resposta fora de ordem.
```

---

### 27. Criar catálogo de regras funcionais

Arquivo:

```text
scope/FUNCTIONAL_RULES.md
```

Regras:

```text
FR-001:
uma chave idempotente
nao pode criar dois pedidos
no mesmo tenant e operacao.

FR-002:
a mesma chave com payload diferente
deve gerar conflito.

FR-003:
pagamento so pode ser solicitado
apos reserva confirmada.

FR-004:
fulfillment so pode iniciar
apos estoque e pagamento aprovados.

FR-005:
pedido concluido
nao pode ser cancelado.

FR-006:
falha de comunicacao
nao altera fato ja confirmado.

FR-007:
todo efeito externo
deve ser rastreavel.

FR-008:
toda mudanca funcional
deve entrar no historico.

FR-009:
tenant de um comando
deve coincidir com o recurso.

FR-010:
reprocessamento
nao pode duplicar efeitos.
```

---

### 28. Criar FunctionalRule

```java
package br.com.formacao.finalproject.scope;

import java.util.List;
import java.util.Objects;

public record FunctionalRule(
        String id,
        String statement,
        List<String> useCaseIds,
        List<String> positiveScenarios,
        List<String> negativeScenarios,
        String owner) {

    public FunctionalRule {
        Objects.requireNonNull(id);
        Objects.requireNonNull(statement);
        useCaseIds = List.copyOf(useCaseIds);
        positiveScenarios =
                List.copyOf(positiveScenarios);
        negativeScenarios =
                List.copyOf(negativeScenarios);
        Objects.requireNonNull(owner);
    }
}
```

---

### 29. Criar catálogo de estados funcionais

Arquivo:

```text
scope/FUNCTIONAL_STATE_CATALOG.md
```

Estados candidatos:

```text
RECEIVED;

PROCESSING;

AWAITING_STOCK;

STOCK_RESERVED;

AWAITING_PAYMENT;

PAYMENT_AUTHORIZED;

AWAITING_FULFILLMENT;

IN_FULFILLMENT;

COMPLETED;

CANCELLATION_REQUESTED;

COMPENSATING;

CANCELLED;

FAILED;

PENDING_RECONCILIATION.
```

Esses estados representam comunicação funcional.

A aula 674 poderá:

- agrupar;
- renomear;
- separar;
- substituir por múltiplas máquinas de estado.

---

### 30. Criar FunctionalState

```java
package br.com.formacao.finalproject.scope;

import java.util.List;
import java.util.Objects;

public record FunctionalState(
        String code,
        String meaning,
        boolean terminal,
        List<String> allowedFunctionalActions) {

    public FunctionalState {
        Objects.requireNonNull(code);
        Objects.requireNonNull(meaning);
        allowedFunctionalActions =
                List.copyOf(allowedFunctionalActions);
    }
}
```

---

### 31. Criar matriz funcional de transições

Exemplos:

```text
RECEIVED
-> PROCESSING.

PROCESSING
-> AWAITING_STOCK.

AWAITING_STOCK
-> STOCK_RESERVED.

STOCK_RESERVED
-> AWAITING_PAYMENT.

PAYMENT_AUTHORIZED
-> AWAITING_FULFILLMENT.

IN_FULFILLMENT
-> COMPLETED.

CANCELLATION_REQUESTED
-> COMPENSATING.

COMPENSATING
-> CANCELLED.
```

Também registre transições para `FAILED` e `PENDING_RECONCILIATION`.

---

### 32. Criar comandos funcionais

Arquivo:

```text
scope/FUNCTIONAL_COMMANDS.md
```

Comandos candidatos:

```text
RegisterOrder;

RequestStockReservation;

RecordStockResult;

RequestPaymentAuthorization;

RecordPaymentResult;

StartFulfillment;

RecordFulfillmentProgress;

CompleteFulfillment;

RequestCancellation;

RunCompensation;

ReconcilePendingProcessing;

RetrySafeEffect.
```

Nomes finais serão revisados no domínio.

---

### 33. Criar consultas funcionais

Arquivo:

```text
scope/FUNCTIONAL_QUERIES.md
```

Consultas:

```text
GetOrder;

GetOrderHistory;

GetOrderProcessingView;

ListOrdersByStatus;

ListPendingReconciliation;

ListFailedEffects;

GetTenantOperationalSummary.
```

Paginação, filtros e contratos finais serão definidos posteriormente.

---

### 34. Criar eventos candidatos

Arquivo:

```text
scope/BUSINESS_EVENT_CANDIDATES.md
```

Eventos:

```text
OrderRegistered;

StockReservationRequested;

StockReserved;

StockReservationRejected;

PaymentAuthorizationRequested;

PaymentAuthorized;

PaymentRejected;

FulfillmentStarted;

FulfillmentProgressed;

FulfillmentCompleted;

OrderCancellationRequested;

OrderCompensationStarted;

OrderCancelled;

OrderFailed;

OrderReconciliationRequired.
```

Ainda são candidatos.

A aula 674 decidirá eventos de domínio.

A arquitetura posterior decidirá eventos de integração.

---

### 35. Criar catálogo de erros

Arquivo:

```text
scope/FUNCTIONAL_ERROR_CATALOG.md
```

Erros:

```text
ORDER_NOT_FOUND;

TENANT_MISMATCH;

INVALID_COMMAND;

INVALID_ORDER_STATE;

IDEMPOTENCY_KEY_REQUIRED;

IDEMPOTENCY_KEY_CONFLICT;

STOCK_UNAVAILABLE;

STOCK_PROVIDER_UNAVAILABLE;

PAYMENT_REJECTED;

PAYMENT_PROVIDER_UNAVAILABLE;

FULFILLMENT_REJECTED;

FULFILLMENT_IRREVERSIBLE;

CANCELLATION_NOT_ALLOWED;

DUPLICATE_EFFECT;

RECONCILIATION_REQUIRED;

VERSION_CONFLICT.
```

---

### 36. Criar FunctionalError

```java
package br.com.formacao.finalproject.scope;

import java.util.List;
import java.util.Objects;

public record FunctionalError(
        String code,
        String meaning,
        boolean retryable,
        String consumerResponse,
        List<String> relatedUseCases) {

    public FunctionalError {
        Objects.requireNonNull(code);
        Objects.requireNonNull(meaning);
        Objects.requireNonNull(consumerResponse);
        relatedUseCases =
                List.copyOf(relatedUseCases);
    }
}
```

---

### 37. Diferenciar retryable e não retryable

Possivelmente retryable:

```text
STOCK_PROVIDER_UNAVAILABLE;

PAYMENT_PROVIDER_UNAVAILABLE;

VERSION_CONFLICT;

RECONCILIATION_REQUIRED.
```

Não retryable automaticamente:

```text
TENANT_MISMATCH;

INVALID_COMMAND;

PAYMENT_REJECTED;

CANCELLATION_NOT_ALLOWED;

IDEMPOTENCY_KEY_CONFLICT.
```

Retry real dependerá de política técnica e idempotência.

---

### 38. Criar critérios de aceite funcionais

Arquivo:

```text
scope/FUNCTIONAL_ACCEPTANCE_CRITERIA.md
```

Exemplo:

```text
AC-001

Given:
tenant valido,
comando valido
e nova chave idempotente.

When:
Registrar pedido.

Then:
um pedido e criado,
um identificador e retornado
e o historico registra o recebimento.
```

Outro:

```text
AC-002

Given:
pedido existente
e mesma chave
com mesmo payload.

When:
Registrar pedido novamente.

Then:
nenhum novo pedido e criado
e a resposta funcional anterior
e devolvida.
```

---

### 39. Criar FunctionalAcceptance

```java
package br.com.formacao.finalproject.scope;

import java.util.List;

public record FunctionalAcceptance(
        String id,
        String useCaseId,
        String given,
        String when,
        String then,
        List<String> requiredEvidence) {

    public FunctionalAcceptance {
        requiredEvidence =
                List.copyOf(requiredEvidence);
    }
}
```

---

### 40. Criar matriz In Scope

Arquivo:

```text
scope/IN_SCOPE.md
```

Incluído:

- registro idempotente;
- isolamento por tenant;
- estado e histórico;
- provider de estoque simulado;
- provider de pagamento simulado;
- fulfillment simulado;
- Saga funcional;
- cancelamento elegível;
- compensações;
- reconciliação;
- eventos candidatos;
- consultas operacionais;
- auditoria;
- evidências de qualidade;
- documentação e portfólio.

---

### 41. Criar matriz Out of Scope

Arquivo:

```text
scope/OUT_OF_SCOPE.md
```

Excluído:

- interface web completa;
- aplicativo móvel;
- catálogo;
- preço e promoção;
- antifraude;
- captura financeira real;
- estorno financeiro real;
- múltiplos centros de distribuição;
- split de pedido;
- devolução;
- troca;
- frete;
- transportadora;
- roteirização;
- nota fiscal;
- analytics corporativo;
- identidade própria;
- produção em cloud real.

---

### 42. Criar ScopeDecision

```java
package br.com.formacao.finalproject.scope;

import java.util.Objects;

public record ScopeDecision(
        String capability,
        boolean included,
        String rationale,
        String targetRelease,
        String reviewTrigger) {

    public ScopeDecision {
        Objects.requireNonNull(capability);
        Objects.requireNonNull(rationale);
        Objects.requireNonNull(targetRelease);
        Objects.requireNonNull(reviewTrigger);
    }
}
```

---

### 43. Fechar MVP

Arquivo:

```text
scope/MVP_SCOPE.md
```

MVP:

```text
1. registrar pedido idempotente;

2. consultar pedido e historico;

3. simular reserva de estoque;

4. simular autorizacao de pagamento;

5. iniciar e concluir fulfillment;

6. tratar estoque indisponivel;

7. tratar pagamento recusado;

8. cancelar antes de ponto irreversivel;

9. executar compensacoes;

10. reconciliar timeout ambiguo;

11. observar jornada principal;

12. demonstrar isolamento de tenant.
```

---

### 44. Definir releases funcionais

Arquivo:

```text
scope/FUNCTIONAL_RELEASE_PLAN.md
```

Releases:

```text
F0:
scope e contratos funcionais.

F1:
registro e consulta local.

F2:
estoque simulado.

F3:
pagamento e fulfillment simulados.

F4:
cancelamento e compensacoes.

F5:
reconciliacao e operacao.

F6:
portfolio e defesa.
```

A ordem pode mudar conforme evidências.

---

### 45. Rastrear backlog para escopo

Arquivo:

```text
scope/BACKLOG_TRACEABILITY.md
```

Exemplo:

```text
UC-01 Registrar pedido
<- B-010;
<- B-100;
<- B-103;
<- B-121;
<- E-02.

UC-12 Executar compensacoes
<- B-060;
<- B-062;
<- B-064;
<- B-101;
<- B-102;
<- E-07.
```

Itens não selecionados permanecem no backlog como candidatos ou removidos.

---

### 46. Atualizar backlog

Mudanças:

- itens do MVP passam para `SELECTED`;
- itens adiados permanecem `CANDIDATE`;
- itens excluídos passam para `REMOVED`;
- rationale é registrado;
- dependências são revisadas;
- milestones são ajustados.

---

### 47. Criar riscos funcionais

Arquivo:

```text
scope/FUNCTIONAL_RISK_REGISTER.md
```

Riscos:

```text
scope grande demais;

Saga complexa demais;

estados ambiguos;

cancelamento irreversivel;

provider simulado irreal;

erros sem resposta clara;

reconciliacao incompleta;

tenant misturado;

historico insuficiente;

portfolio sem jornada demonstravel.
```

---

### 48. Criar perguntas abertas

Arquivo:

```text
scope/FUNCTIONAL_OPEN_QUESTIONS.md
```

Perguntas:

```text
estoque e pagamento
serao sequenciais
ou parcialmente paralelos?

qual o ponto irreversivel
do fulfillment?

qual estado representa
compensacao parcial?

qual consulta operacional
sera demonstrada?

qual volume de pedidos
sera usado nos testes?

quais detalhes do provider
precisam aparecer?

qual jornada sera gravada
para portfolio?
```

A aula 674 poderá responder perguntas sem alterar o escopo principal.

---

### 49. Criar boundary da próxima aula

Arquivo:

```text
scope/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 673 define:

- atores;
- jornadas;
- casos de uso;
- regras;
- estados funcionais;
- erros;
- MVP;
- inclusoes;
- exclusoes.

A aula 674 define:

- linguagem ubiqua;
- aggregates;
- entities;
- value objects;
- invariantes;
- commands;
- domain events;
- domain services;
- boundaries de dominio.

Nenhuma classe de dominio
e considerada final
nesta aula.
```

---

### 50. Testar ator sem objetivo

Ator:

```text
Worker.
```

Sem objetivo ou ações.

Resultado:

```text
FAIL_ACTOR_OBJECTIVE
```

---

### 51. Testar jornada incompleta

Jornada sem outcome, alternativas ou medida.

Resultado:

```text
FAIL_JOURNEY_COMPLETENESS
```

---

### 52. Testar caso de uso sem resultado

Caso:

```text
Criar endpoint de pagamento.
```

Resultado:

```text
FAIL_USE_CASE_OUTCOME
```

---

### 53. Testar regra sem cenário

Regra:

```text
pedido deve ser valido.
```

Sem cenário positivo ou negativo.

Resultado:

```text
FAIL_FUNCTIONAL_RULE_SCENARIO
```

---

### 54. Testar estado sem significado

Estado:

```text
STATUS_7.
```

Resultado:

```text
FAIL_STATE_MEANING
```

---

### 55. Testar erro sem resposta

Erro:

```text
PROVIDER_ERROR.
```

Sem indicar retry, resposta ou use case.

Resultado:

```text
FAIL_ERROR_CONSUMER_RESPONSE
```

---

### 56. Criar reports

Exemplo:

```yaml
functionalScope:
  actors:
    total:
      10
    withObjective:
      10

  journeys:
    selected:
      5
    deferred:
      8

  useCases:
    selected:
      15
    withOutcome:
      15

  rules:
    total:
      10
    withScenarios:
      10

  states:
    candidate:
      14
    withMeaning:
      14

  errors:
    total:
      16
    withConsumerResponse:
      16

  MVP:
    capabilities:
      12

  backlog:
    selectedItems:
      34
    removedItems:
      11

  domainModel:
    finalized:
      false

  gate:
    PASS
```

---

### 57. Criar evidence

Arquivo:

```text
contracts/functional-scope-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- actor count;
- actor objective coverage;
- selected journey count;
- deferred journey count;
- selected use case count;
- use case outcome coverage;
- functional rule count;
- rule scenario coverage;
- functional state count;
- state meaning coverage;
- functional error count;
- error consumer response coverage;
- in-scope capability count;
- out-of-scope capability count;
- MVP capability count;
- selected backlog item count;
- removed backlog item count;
- traceability coverage;
- domain model finalized;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- classes finais;
- aggregates finais;
- entities finais;
- value objects finais;
- tabelas;
- schemas;
- endpoints definitivos;
- credenciais;
- dados reais;
- conteúdo detalhado da aula 674.

---

### 58. Criar gate

O gate valida:

- charter;
- actors;
- journeys;
- use cases;
- primary flows;
- alternatives;
- rules;
- states;
- commands;
- queries;
- events;
- errors;
- acceptance;
- in scope;
- out of scope;
- MVP;
- release plan;
- backlog traceability;
- risks;
- open questions;
- reports;
- evidence;
- não antecipação.

Status:

```text
PASS;

FAIL_SCOPE_CHARTER;

FAIL_ACTOR;

FAIL_JOURNEY;

FAIL_USE_CASE;

FAIL_PRIMARY_FLOW;

FAIL_ALTERNATIVE_FLOW;

FAIL_FUNCTIONAL_RULE;

FAIL_FUNCTIONAL_STATE;

FAIL_FUNCTIONAL_COMMAND;

FAIL_FUNCTIONAL_QUERY;

FAIL_EVENT_CANDIDATE;

FAIL_FUNCTIONAL_ERROR;

FAIL_ACCEPTANCE;

FAIL_SCOPE_DECISION;

FAIL_MVP;

FAIL_BACKLOG_TRACEABILITY;

FAIL_RISK_REGISTER;

FAIL_DOMAIN_ANTICIPATION;

FAIL_TEST;

INCONCLUSIVE.
```

---

### 59. Executar validação completa

```powershell
.\scripts\m20\orderflow-functional-scope\validate-functional-scope-contract.ps1

.\scripts\m20\orderflow-functional-scope\validate-actors.ps1

.\scripts\m20\orderflow-functional-scope\validate-journeys.ps1

.\scripts\m20\orderflow-functional-scope\validate-use-cases.ps1

.\scripts\m20\orderflow-functional-scope\validate-functional-rules.ps1

.\scripts\m20\orderflow-functional-scope\validate-functional-states.ps1

.\scripts\m20\orderflow-functional-scope\validate-functional-errors.ps1

.\scripts\m20\orderflow-functional-scope\validate-MVP-scope.ps1

.\scripts\m20\orderflow-functional-scope\validate-backlog-traceability.ps1

.\scripts\m20\orderflow-functional-scope\run-functional-scope-tests.ps1

.\scripts\m20\orderflow-functional-scope\collect-functional-scope-evidence.ps1

.\scripts\m20\orderflow-functional-scope\verify-functional-scope-gate.ps1
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
- atores;
- jornadas;
- casos de uso;
- fluxos principais;
- fluxos alternativos;
- regras;
- estados funcionais;
- comandos;
- consultas;
- eventos candidatos;
- erros;
- critérios de aceite;
- inclusões;
- exclusões;
- MVP;
- releases;
- rastreabilidade;
- riscos;
- perguntas abertas;
- reports;
- evidence;
- gate aprovado;
- domínio não finalizado.

---

## Entendendo o que foi feito

### O backlog ganhou compromisso

Itens candidatos foram avaliados e parte deles entrou no MVP.

### O projeto ganhou fronteiras funcionais

O que entra e o que não entra ficou explícito.

### As jornadas orientaram o escopo

O produto não foi definido por telas, tabelas ou frameworks.

### Regras ganharam cenários

Cada regra passou a poder ser testada e discutida.

### Estados ganharam significado funcional

O projeto passou a comunicar progresso, falhas, cancelamentos e reconciliações.

### Erros ganharam resposta previsível

Consumers poderão distinguir conflito, rejeição, indisponibilidade e retry.

### A modelagem de domínio permaneceu aberta

Os estados, comandos e eventos ainda são funcionais.

A aula 674 transformará esses conceitos em modelo de domínio.

---

## Erros comuns importantes

### Incluir tudo no MVP

O projeto se torna inconcluível.

### Definir escopo por endpoints

Comportamento e regras ficam escondidos.

### Misturar domínio e persistência

Entidades e tabelas surgem cedo demais.

### Criar ator genérico

Responsabilidade e autorização ficam ambíguas.

### Jornada sem resultado

O fluxo vira sequência de ações.

### Regra sem cenário negativo

A exceção aparece tarde.

### Estado técnico

`STATUS_7` não comunica comportamento.

### Erro genérico

`INTERNAL_ERROR` não orienta consumer nem operação.

### Excluir sem rationale

A decisão de escopo perde rastreabilidade.

### Antecipar aggregates

A modelagem pertence à aula 674.

---

## Comandos úteis

### Validar atores

```powershell
.\scripts\m20\orderflow-functional-scope\validate-actors.ps1
```

### Validar jornadas

```powershell
.\scripts\m20\orderflow-functional-scope\validate-journeys.ps1
```

### Validar regras

```powershell
.\scripts\m20\orderflow-functional-scope\validate-functional-rules.ps1
```

### Validar estados

```powershell
.\scripts\m20\orderflow-functional-scope\validate-functional-states.ps1
```

### Executar testes

```powershell
.\scripts\m20\orderflow-functional-scope\run-functional-scope-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m20\orderflow-functional-scope\verify-functional-scope-gate.ps1
```

---

## Exercício guiado

Escolha a jornada:

```text
J-03:
Cancelar pedido elegivel.
```

Crie:

1. ator;
2. trigger;
3. precondições;
4. fluxo principal;
5. quatro fluxos alternativos;
6. regras;
7. estados funcionais;
8. erros;
9. comandos candidatos;
10. eventos candidatos;
11. acceptance criteria;
12. evidências;
13. itens do backlog relacionados;
14. itens explicitamente fora do escopo.

Não crie aggregate final.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 672 e ponte para a aula 674 foram preservadas;
- laboratório `orderflow-functional-scope` foi criado;
- Functional Scope Charter foi criado;
- contrato principal foi criado;
- Actor Catalog foi criado;
- FunctionalActor foi criado;
- ator primário foi definido;
- providers externos foram tratados como atores simulados;
- Journey Catalog foi criado;
- FunctionalJourney foi criado;
- jornada principal foi detalhada;
- estoque indisponível foi tratado;
- pagamento recusado foi tratado;
- timeout ambíguo foi tratado;
- Use Case Catalog foi criado;
- FunctionalUseCase foi criado;
- registro de pedido foi detalhado;
- consulta e histórico foram definidos;
- reserva de estoque foi definida;
- pagamento foi definido;
- fulfillment foi definido;
- cancelamento foi definido;
- compensações foram definidas;
- Primary Flows foi criado;
- Alternative Flows foi criado;
- Functional Rules foi criado;
- FunctionalRule foi criado;
- Functional State Catalog foi criado;
- FunctionalState foi criado;
- transições funcionais foram registradas;
- Functional Commands foi criado;
- Functional Queries foi criado;
- Business Event Candidates foi criado;
- Functional Error Catalog foi criado;
- FunctionalError foi criado;
- retryable foi diferenciado de não retryable;
- critérios de aceite foram criados;
- FunctionalAcceptance foi criado;
- In Scope foi criado;
- Out of Scope foi criado;
- ScopeDecision foi criado;
- MVP Scope foi fechado;
- Functional Release Plan foi criado;
- Backlog Traceability foi criada;
- backlog foi atualizado;
- Functional Risk Register foi criado;
- perguntas abertas foram registradas;
- boundary da aula 674 foi criado;
- testes de ator, jornada, use case, regra, estado e erro foram executados;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- modelagem de domínio final não foi antecipada.

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
  labs/m20/aula-673-escopo-funcional/orderflow-functional-scope `
  scripts/m20/orderflow-functional-scope `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|realCustomer|privateEndpoint|finalAggregate|finalEntity|finalTable"
```

Commit recomendado:

```powershell
git commit -m "docs(m20): definir escopo funcional do OrderFlow"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- clientes reais;
- dados sensíveis;
- endpoints definitivos;
- aggregates finais;
- entities finais;
- banco final;
- C4 final;
- conteúdo detalhado da aula 674.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você fechou o escopo funcional do OrderFlow.

Você criou:

```text
Functional Scope Charter;

Actor Catalog;

Journey Catalog;

Use Case Catalog;

Primary Flows;

Alternative Flows;

Functional Rules;

Functional State Catalog;

Functional Commands;

Functional Queries;

Business Event Candidates;

Functional Error Catalog;

Functional Acceptance Criteria;

In Scope;

Out of Scope;

MVP Scope;

Functional Release Plan;

Backlog Traceability;

Functional Risk Register;

reports, evidence e gate.
```

Você selecionou um MVP concluível.

Você definiu o comportamento principal de registro, estoque, pagamento, fulfillment, cancelamento, compensação, reconciliação, consulta e auditoria.

Você também tornou explícito o que não será construído.

A próxima aula será:

```text
674 - M20.04 - Modelagem dominio final
```

Nela, você transformará o escopo funcional em linguagem ubíqua, aggregates, entities, value objects, invariantes, commands, domain events, domain services e boundaries.

Nenhuma modelagem de domínio final foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini atores.
- [ ] Selecionei jornadas.
- [ ] Criei casos de uso.
- [ ] Detalhei fluxos principais.
- [ ] Detalhei alternativas.
- [ ] Criei regras.
- [ ] Criei estados funcionais.
- [ ] Criei comandos e consultas.
- [ ] Criei eventos candidatos.
- [ ] Criei erros previsíveis.
- [ ] Fechei MVP.
- [ ] Declarei exclusões.
- [ ] Atualizei backlog.
- [ ] Preservei a modelagem da aula 674.

---

## Troubleshooting adicional

### O MVP ainda parece grande

Remova integrações ou alternativas menos demonstráveis.

### Os estados parecem excessivos

Mantenha significado funcional e deixe simplificação para a modelagem.

### Não sei se um erro deve ser retryable

Registre como pergunta aberta e não imponha mecanismo técnico.

### O caso de uso parece endpoint

Reescreva em termos de ator, trigger e outcome.

### A regra depende de tecnologia

Retorne ao comportamento de negócio.

### O provider simulado está detalhado demais

Mantenha apenas contrato funcional e respostas relevantes.

### O cancelamento ficou complexo

Escolha um ponto irreversível simples e demonstrável.

### A compensação pode falhar

Inclua estado parcial e reconciliação.

### Quero definir tabela de histórico

Essa decisão pertence à modelagem de dados.

### Quero criar classes de domínio

Essa etapa pertence à aula 674.

### O backlog e o escopo divergem

Atualize a rastreabilidade e registre itens removidos.

---

## Perguntas de revisão

1. O que é escopo funcional?
2. Por que escopo é uma decisão?
3. O que é comportamento observável?
4. O que é jornada?
5. O que é caso de uso?
6. O que é regra funcional?
7. O que é estado funcional?
8. Estado funcional é enum final?
9. O que é fluxo alternativo?
10. Por que erro faz parte do escopo?
11. Quem é o ator primário?
12. Quais providers são simulados?
13. Qual é a jornada principal?
14. Quando pagamento pode ser solicitado?
15. Quando fulfillment pode iniciar?
16. O que acontece quando pagamento é recusado?
17. O que é timeout ambíguo?
18. O que entra no MVP?
19. O que fica fora do escopo?
20. Por que backlog precisa ser atualizado?
21. O que são eventos candidatos?
22. O que a aula 674 fará?
23. O que não foi definido nesta aula?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Conjunto de comportamentos escolhidos.
2. Porque capacidade e prazo são limitados.
3. Resultado percebido por ator ou sistema.
4. Sequência que entrega outcome.
5. Comportamento iniciado por trigger.
6. Restrição funcional testável.
7. Percepção do progresso do negócio.
8. Não.
9. Variação do fluxo principal.
10. Para produzir resposta previsível.
11. Canal de Venda.
12. Estoque, pagamento e fulfillment.
13. Registrar e processar pedido.
14. Após estoque reservado.
15. Após estoque e pagamento aprovados.
16. Reserva é compensada e fulfillment não inicia.
17. Provider pode ter executado sem resposta recebida.
18. Fluxo principal, falhas, cancelamento, compensação e reconciliação.
19. Catálogo, logística completa, pagamento real e frontend completo.
20. Para refletir itens selecionados e removidos.
21. Fatos funcionais ainda não finalizados.
22. Criar modelo de domínio.
23. Aggregates, entities e value objects finais.
24. Modelagem domínio final.
25. Definir o que entra e o que não entra.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 673 - M20.03 - Escopo funcional

- Continuei após Backlog projeto final.
- Criei o laboratório `orderflow-functional-scope`.
- Criei Functional Scope Charter.
- Criei o contrato principal.
- Criei Actor Catalog.
- Criei FunctionalActor.
- Defini Canal de Venda como ator primário.
- Tratei estoque, pagamento e fulfillment como providers simulados.
- Criei Journey Catalog.
- Criei FunctionalJourney.
- Detalhei a jornada de registro e processamento.
- Modelei estoque indisponível.
- Modelei pagamento recusado.
- Modelei timeout ambíguo.
- Criei Use Case Catalog.
- Criei FunctionalUseCase.
- Detalhei registro de pedido.
- Defini consulta e histórico.
- Defini reserva de estoque.
- Defini autorização de pagamento.
- Defini fulfillment.
- Defini cancelamento.
- Defini compensações.
- Criei Primary Flows.
- Criei Alternative Flows.
- Criei Functional Rules.
- Criei FunctionalRule.
- Criei Functional State Catalog.
- Criei FunctionalState.
- Registrei transições funcionais.
- Criei Functional Commands.
- Criei Functional Queries.
- Criei Business Event Candidates.
- Criei Functional Error Catalog.
- Criei FunctionalError.
- Diferenciei retryable e não retryable.
- Criei critérios de aceite.
- Criei FunctionalAcceptance.
- Criei In Scope.
- Criei Out of Scope.
- Criei ScopeDecision.
- Fechei MVP Scope.
- Criei Functional Release Plan.
- Criei Backlog Traceability.
- Atualizei o backlog.
- Criei Functional Risk Register.
- Registrei perguntas abertas.
- Criei boundary para a aula 674.
- Executei testes funcionais de escopo.
- Criei reports, evidence e gate.
- Não antecipei a modelagem de domínio final.
- Próxima aula: Modelagem dominio final.
```

---

## Referência técnica curta

- Functional Scope.
- Actor.
- Journey.
- Use Case.
- Primary Flow.
- Alternative Flow.
- Functional Rule.
- Functional State.
- Functional Command.
- Functional Query.
- Business Event Candidate.
- Functional Error.
- Acceptance Criteria.
- In Scope.
- Out of Scope.
- MVP.
- Backlog Traceability.
- Scope Decision.

Regra final:

```text
O escopo funcional do OrderFlow deve definir comportamentos observáveis, atores, jornadas, casos de uso, regras, estados, erros, inclusões e exclusões sem antecipar classes ou persistência: o Canal de Venda registra pedidos de forma idempotente, tenant e chave são validados, o pedido solicita reserva de estoque, autorização de pagamento e início de fulfillment, progresso e histórico ficam consultáveis, estoque indisponível impede pagamento e fulfillment, pagamento recusado libera a reserva, timeout ambíguo leva a estado pendente e reconciliação, cancelamento depende de elegibilidade e ponto irreversível, compensações podem liberar estoque, registrar reversão simulada e interromper fulfillment quando permitido, e todo efeito externo precisa ser rastreável e não duplicável; estados funcionais comunicam received, processing, awaiting stock, reserved, awaiting payment, authorized, fulfillment, completed, cancellation, compensating, cancelled, failed e pending reconciliation sem obrigar enum final, comandos, consultas e eventos permanecem candidatos, erros possuem significado, retryability e resposta ao consumer, o MVP inclui registro, consulta, providers simulados, falhas, cancelamento, compensação, reconciliação, observabilidade e isolamento de tenant, enquanto catálogo, pagamento real, WMS, logística completa, frontend e analytics ficam fora; o gate termina com charter, actors, journeys, use cases, flows, rules, states, commands, queries, events, errors, acceptance, scope decisions, MVP, releases, backlog traceability, risks, reports e evidence aprovados, enquanto aggregates, entities, value objects, invariantes, domain services e domain events finais permanecem reservados para a aula 674.
```
