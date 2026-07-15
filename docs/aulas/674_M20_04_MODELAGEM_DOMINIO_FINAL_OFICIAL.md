# 674 - M20.04 - Modelagem dominio final

## Apresentação da aula

Na aula 673, você fechou o escopo funcional do OrderFlow.

O projeto passou a possuir:

- atores;
- jornadas;
- casos de uso;
- fluxos principais;
- fluxos alternativos;
- regras funcionais;
- estados funcionais;
- comandos candidatos;
- consultas candidatas;
- eventos candidatos;
- erros previsíveis;
- critérios de aceite;
- inclusões;
- exclusões;
- MVP;
- releases funcionais;
- rastreabilidade com o backlog;
- riscos;
- perguntas abertas.

O comportamento agora está definido.

O próximo passo é transformar esse comportamento em um modelo de domínio capaz de proteger regras e orientar a implementação.

Modelagem de domínio não significa criar classes para cada substantivo encontrado no documento.

Também não significa copiar o catálogo de estados para um `enum` e concentrar toda a lógica em um service.

O modelo precisa responder:

```text
qual linguagem sera usada;

qual objeto protege as invariantes;

qual mudanca precisa ser atomica;

quais conceitos possuem identidade;

quais conceitos sao definidos por valor;

quais decisoes pertencem ao dominio;

quais fatos precisam ser publicados;

quais integracoes ficam fora do modelo;

quais ambiguidades precisam
ser resolvidas antes do banco.
```

O erro clássico seria criar:

```text
OrderEntity;

OrderService;

OrderRepository;

OrderController.
```

Essa estrutura não explica:

- o que torna um pedido válido;
- quando estoque pode ser solicitado;
- quando pagamento pode ser autorizado;
- quando fulfillment pode iniciar;
- quando cancelamento é permitido;
- como compensações são planejadas;
- como resultados duplicados são tratados;
- como timeout ambíguo aparece no domínio;
- quais transições são impossíveis;
- quais fatos surgem de cada decisão.

Outro erro seria transformar cada provider externo em entidade interna.

Estoque, pagamento e fulfillment possuem modelos próprios.

O OrderFlow não deve copiar esses modelos.

Ele precisa manter apenas os conceitos necessários para orquestrar a jornada.

Nesta aula, o domínio principal será nomeado:

```text
Order Orchestration.
```

O aggregate principal será:

```text
OrderProcess.
```

Ele representará a execução coordenada de um pedido dentro do OrderFlow.

O laboratório será:

```text
labs/m20/aula-674-modelagem-dominio-final/orderflow-domain-model
```

Você criará:

- Domain Model Charter;
- linguagem ubíqua;
- mapa de subdomínios;
- boundary do domínio;
- aggregate `OrderProcess`;
- entities internas;
- value objects;
- invariantes;
- políticas;
- comandos de aplicação;
- decisões de domínio;
- domain events;
- ports;
- anti-corruption mappings;
- testes de unidade do domínio;
- testes de transição;
- reports, evidence e gate.

A próxima aula será:

```text
675 - M20.05 - Modelagem banco final
```

Na aula 675, o modelo de domínio será traduzido para persistência, schemas, tabelas, chaves, constraints, índices, migrations, Outbox, Inbox, auditoria e estratégias de consulta.

Nesta aula, nenhuma tabela ou entidade JPA final será criada.

Regra central:

```text
o modelo de dominio
deve proteger decisoes
e invariantes;

persistencia
e apenas uma forma
de guardar esse modelo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
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

A aula 673 definiu o que o produto fará.

A aula 674 define como o negócio será representado.

A aula 675 definirá como o estado será persistido.

Essa ordem evita que o banco dite o domínio.

O modelo desta aula precisa ser suficientemente completo para orientar:

- regras;
- transações;
- eventos;
- repositories;
- testes;
- integração;
- persistência;
- arquitetura;
- documentação.

Mas não deve antecipar:

- annotations JPA;
- nomes de tabelas;
- tipos SQL;
- índices;
- chaves estrangeiras;
- estratégia de particionamento;
- migration scripts;
- engine de banco;
- C4 final;
- deploy units;
- estrutura profissional do repositório.

---

## Objetivo prático

Será criada a estrutura:

```text
labs/m20/aula-674-modelagem-dominio-final
└── orderflow-domain-model
    ├── README.md
    ├── domain
    │   ├── DOMAIN_MODEL_CHARTER.md
    │   ├── UBIQUITOUS_LANGUAGE.md
    │   ├── SUBDOMAIN_MAP.md
    │   ├── DOMAIN_BOUNDARY.md
    │   ├── AGGREGATE_CATALOG.md
    │   ├── ENTITY_CATALOG.md
    │   ├── VALUE_OBJECT_CATALOG.md
    │   ├── INVARIANT_CATALOG.md
    │   ├── DOMAIN_POLICY_CATALOG.md
    │   ├── COMMAND_CATALOG.md
    │   ├── DOMAIN_EVENT_CATALOG.md
    │   ├── PORT_CATALOG.md
    │   ├── ANTI_CORRUPTION_MAPPING.md
    │   ├── DOMAIN_ERROR_CATALOG.md
    │   ├── DOMAIN_TRACEABILITY.md
    │   ├── DOMAIN_RISK_REGISTER.md
    │   ├── DOMAIN_OPEN_QUESTIONS.md
    │   └── NEXT_LESSON_BOUNDARY.md
    ├── contracts
    │   ├── final-domain-model-contract.yaml
    │   ├── aggregate-policy.yaml
    │   ├── entity-policy.yaml
    │   ├── value-object-policy.yaml
    │   ├── invariant-policy.yaml
    │   ├── domain-event-policy.yaml
    │   ├── port-policy.yaml
    │   ├── anti-corruption-policy.yaml
    │   ├── domain-test-policy.yaml
    │   └── non-anticipation-policy.yaml
    ├── src
    │   ├── main
    │   │   └── java
    │   │       └── br/com/formacao/orderflow/domain
    │   │           ├── model
    │   │           │   ├── OrderProcess.java
    │   │           │   ├── OrderLine.java
    │   │           │   ├── ProcessingStep.java
    │   │           │   ├── CompensationAction.java
    │   │           │   └── OrderProcessStatus.java
    │   │           ├── value
    │   │           │   ├── OrderId.java
    │   │           │   ├── TenantId.java
    │   │           │   ├── ProductCode.java
    │   │           │   ├── Quantity.java
    │   │           │   ├── Money.java
    │   │           │   ├── IdempotencyKey.java
    │   │           │   ├── ExternalOperationId.java
    │   │           │   ├── CorrelationId.java
    │   │           │   └── OrderVersion.java
    │   │           ├── result
    │   │           │   ├── StockReservationResult.java
    │   │           │   ├── PaymentAuthorizationResult.java
    │   │           │   ├── FulfillmentResult.java
    │   │           │   └── ReconciliationResult.java
    │   │           ├── policy
    │   │           │   ├── CancellationEligibilityPolicy.java
    │   │           │   ├── CompensationPlanner.java
    │   │           │   └── NextProcessingStepPolicy.java
    │   │           ├── event
    │   │           │   ├── DomainEvent.java
    │   │           │   ├── OrderRegistered.java
    │   │           │   ├── StockReservationRequested.java
    │   │           │   ├── StockReserved.java
    │   │           │   ├── PaymentAuthorizationRequested.java
    │   │           │   ├── PaymentAuthorized.java
    │   │           │   ├── FulfillmentStarted.java
    │   │           │   ├── OrderCompleted.java
    │   │           │   ├── OrderCancellationRequested.java
    │   │           │   ├── OrderCompensationStarted.java
    │   │           │   ├── OrderCancelled.java
    │   │           │   └── OrderReconciliationRequired.java
    │   │           ├── port
    │   │           │   ├── OrderProcessRepository.java
    │   │           │   ├── StockReservationPort.java
    │   │           │   ├── PaymentAuthorizationPort.java
    │   │           │   ├── FulfillmentPort.java
    │   │           │   ├── DomainEventPublisher.java
    │   │           │   ├── DomainClock.java
    │   │           │   └── DomainIdentifierGenerator.java
    │   │           └── error
    │   │               ├── DomainRuleViolation.java
    │   │               ├── InvalidOrderTransition.java
    │   │               ├── DuplicateExternalResult.java
    │   │               └── CancellationNotAllowed.java
    │   └── test
    │       └── java
    │           └── br/com/formacao/orderflow/domain
    │               ├── OrderProcessRegistrationTest.java
    │               ├── StockReservationTransitionTest.java
    │               ├── PaymentAuthorizationTransitionTest.java
    │               ├── FulfillmentTransitionTest.java
    │               ├── CancellationPolicyTest.java
    │               ├── CompensationPlannerTest.java
    │               ├── DuplicateResultTest.java
    │               ├── ReconciliationTest.java
    │               ├── DomainEventTest.java
    │               ├── PersistenceNonAnticipationTest.java
    │               └── FinalDomainModelGateTest.java
    └── reports
        ├── aggregate-report.yaml
        ├── value-object-report.yaml
        ├── invariant-report.yaml
        ├── transition-report.yaml
        ├── domain-event-report.yaml
        ├── port-report.yaml
        ├── domain-test-report.yaml
        ├── traceability-report.yaml
        ├── architecture-report.yaml
        └── final-domain-model-gate-report.yaml
```

Scripts:

```text
scripts/m20/orderflow-domain-model
├── validate-domain-contract.ps1
├── validate-ubiquitous-language.ps1
├── validate-aggregate-model.ps1
├── validate-value-objects.ps1
├── validate-invariants.ps1
├── validate-domain-events.ps1
├── validate-ports.ps1
├── validate-domain-traceability.ps1
├── run-orderflow-domain-tests.ps1
├── collect-orderflow-domain-evidence.ps1
└── verify-orderflow-domain-gate.ps1
```

---

## Conceito essencial

### Aggregate protege consistência

Aggregate define um limite de consistência transacional.

Tudo que precisa mudar de forma atômica para preservar invariantes deve estar dentro do mesmo aggregate.

Isso não significa colocar toda a jornada em um objeto gigante.

O `OrderProcess` protegerá apenas decisões locais da orquestração.

Resultados de estoque, pagamento e fulfillment chegam como fatos externos já traduzidos.

### Entity possui identidade

`OrderLine` pode possuir identidade própria dentro do pedido quando alterações e rastreabilidade por item forem necessárias.

`ProcessingStep` possui identidade porque representa uma tentativa ou etapa específica.

A identidade não precisa ser uma chave de banco nesta aula.

Ela representa continuidade conceitual.

### Value Object é definido por valor

Exemplos:

- `OrderId`;
- `TenantId`;
- `ProductCode`;
- `Quantity`;
- `Money`;
- `CorrelationId`;
- `ExternalOperationId`.

Value objects devem:

- validar criação;
- ser imutáveis;
- expressar intenção;
- evitar primitive obsession;
- possuir igualdade por valor.

### Domain event registra fato

Evento de domínio descreve algo que aconteceu dentro do modelo.

Exemplo:

```text
StockReserved.
```

Ele não deve ser criado apenas porque existe um tópico.

A arquitetura poderá transformar eventos de domínio em eventos de integração depois.

### Port protege o domínio

Port representa uma necessidade do domínio ou da aplicação sem acoplamento ao provider.

Exemplo:

```text
StockReservationPort.
```

O domínio não conhece HTTP, Kafka, SDK ou banco.

### Idempotência possui mais de uma camada

A aceitação idempotente de comandos pertence principalmente à aplicação e à persistência.

O domínio, porém, precisa rejeitar ou ignorar resultados externos já aplicados.

Por isso, o modelo registra operações externas conhecidas e protege efeitos duplicados.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m20/aula-674-modelagem-dominio-final/orderflow-domain-model

Set-Location `
  labs/m20/aula-674-modelagem-dominio-final/orderflow-domain-model
```

---

### 2. Criar Domain Model Charter

Arquivo:

```text
domain/DOMAIN_MODEL_CHARTER.md
```

Conteúdo:

```markdown
# Domain Model Charter

Projeto

OrderFlow.

Dominio principal

Order Orchestration.

Objetivo

Proteger regras,
transicoes,
decisoes
e fatos
da jornada do pedido.

Principios

- model behavior, not tables;
- aggregate protects invariants;
- value objects express meaning;
- external models stay outside;
- duplicate effects are rejected;
- ambiguous outcomes require reconciliation;
- persistence belongs to lesson 675;
- domain decisions must be testable.
```

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/final-domain-model-contract.yaml
```

Conteúdo:

```yaml
finalDomainModel:
  project:
    OrderFlow

  required:
    - charter
    - ubiquitous-language
    - subdomain-map
    - domain-boundary
    - aggregate-catalog
    - entity-catalog
    - value-object-catalog
    - invariant-catalog
    - domain-policies
    - commands
    - domain-events
    - ports
    - anti-corruption-mapping
    - domain-errors
    - traceability
    - risks
    - tests
    - reports
    - evidence
    - gate

  forbidden:
    - anemic-domain
    - public-state-mutation
    - external-provider-entity
    - primitive-obsession
    - domain-depending-on-framework
    - event-without-fact
    - duplicated-effect
    - final-JPA-entity
    - final-table-model
    - SQL-schema
    - final-C4

  nextLesson:
    code:
      M20.05
```

---

### 4. Criar linguagem ubíqua

Arquivo:

```text
domain/UBIQUITOUS_LANGUAGE.md
```

Termos:

```text
Order Process:
orquestracao de um pedido.

Order Line:
item solicitado dentro do pedido.

Processing Step:
etapa ou tentativa rastreavel.

Stock Reservation:
confirmacao externa
de disponibilidade reservada.

Payment Authorization:
confirmacao externa
de autorizacao do valor.

Fulfillment:
preparacao operacional do pedido.

Compensation:
acao para reduzir
efeitos de uma jornada interrompida.

Reconciliation:
processo que resolve
resultado externo ambiguo.

Irreversible Point:
momento apos o qual
cancelamento completo
nao e mais garantido.

Terminal State:
estado sem nova transicao normal.
```

Evite usar o mesmo termo com dois significados.

---

### 5. Criar mapa de subdomínios

Arquivo:

```text
domain/SUBDOMAIN_MAP.md
```

Subdomínios:

```text
Order Orchestration:
CORE.

Tenant Access:
SUPPORTING.

Stock Integration:
SUPPORTING.

Payment Integration:
SUPPORTING.

Fulfillment Integration:
SUPPORTING.

Audit:
SUPPORTING.

Identity:
GENERIC.

Observability:
GENERIC.
```

O foco da aula será `Order Orchestration`.

---

### 6. Definir boundary do domínio

Arquivo:

```text
domain/DOMAIN_BOUNDARY.md
```

Dentro:

- identidade do processo;
- tenant;
- linhas do pedido;
- valor esperado;
- estado da orquestração;
- etapas realizadas;
- resultados externos traduzidos;
- cancelamento;
- compensações;
- reconciliação;
- fatos de domínio.

Fora:

- saldo real de estoque;
- conta financeira;
- captura;
- armazém;
- catálogo;
- endereço completo;
- transporte;
- credenciais;
- protocolo HTTP;
- tópico;
- tabela;
- retry técnico.

---

### 7. Criar OrderId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;
import java.util.UUID;

public record OrderId(UUID value) {

    public OrderId {
        Objects.requireNonNull(value);
    }

    public static OrderId from(String raw) {
        return new OrderId(UUID.fromString(raw));
    }
}
```

---

### 8. Criar TenantId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;

public record TenantId(String value) {

    public TenantId {
        Objects.requireNonNull(value);

        if (value.isBlank()) {
            throw new IllegalArgumentException(
                    "TenantId cannot be blank");
        }
    }
}
```

Tenant não deve ser `String` solta no domínio.

---

### 9. Criar ProductCode

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Locale;
import java.util.Objects;

public record ProductCode(String value) {

    public ProductCode {
        Objects.requireNonNull(value);

        value = value.trim()
                .toUpperCase(Locale.ROOT);

        if (value.isBlank()) {
            throw new IllegalArgumentException(
                    "ProductCode cannot be blank");
        }
    }
}
```

---

### 10. Criar Quantity

```java
package br.com.formacao.orderflow.domain.value;

public record Quantity(int value) {

    public Quantity {
        if (value <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be positive");
        }
    }
}
```

---

### 11. Criar Money

```java
package br.com.formacao.orderflow.domain.value;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;
import java.util.Objects;

public record Money(
        BigDecimal amount,
        Currency currency) {

    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currency);

        amount = amount.setScale(
                currency.getDefaultFractionDigits(),
                RoundingMode.HALF_EVEN);

        if (amount.signum() < 0) {
            throw new IllegalArgumentException(
                    "Money cannot be negative");
        }
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency())) {
            throw new IllegalArgumentException(
                    "Currencies must match");
        }

        return new Money(
                amount.add(other.amount()),
                currency);
    }
}
```

---

### 12. Criar IdempotencyKey

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;

public record IdempotencyKey(String value) {

    public IdempotencyKey {
        Objects.requireNonNull(value);

        if (value.isBlank()
                || value.length() > 120) {
            throw new IllegalArgumentException(
                    "Invalid idempotency key");
        }
    }
}
```

O registro de comandos idempotentes será aplicado fora do aggregate.

O value object preserva significado e contrato.

---

### 13. Criar ExternalOperationId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;

public record ExternalOperationId(
        String provider,
        String value) {

    public ExternalOperationId {
        Objects.requireNonNull(provider);
        Objects.requireNonNull(value);

        if (provider.isBlank()
                || value.isBlank()) {
            throw new IllegalArgumentException(
                    "External operation is invalid");
        }
    }
}
```

---

### 14. Criar OrderLine

```java
package br.com.formacao.orderflow.domain.model;

import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.ProductCode;
import br.com.formacao.orderflow.domain.value.Quantity;
import java.util.Objects;

public record OrderLine(
        ProductCode productCode,
        Quantity quantity,
        Money unitPrice) {

    public OrderLine {
        Objects.requireNonNull(productCode);
        Objects.requireNonNull(quantity);
        Objects.requireNonNull(unitPrice);
    }

    public Money subtotal() {
        return new Money(
                unitPrice.amount().multiply(
                        java.math.BigDecimal.valueOf(
                                quantity.value())),
                unitPrice.currency());
    }
}
```

Neste recorte, `OrderLine` pode ser value object.

Ela não precisa de identidade própria porque não será editada individualmente depois do registro.

---

### 15. Definir aggregate principal

Arquivo:

```text
domain/AGGREGATE_CATALOG.md
```

Aggregate:

```text
OrderProcess.
```

Responsabilidade:

- proteger jornada;
- proteger transições;
- registrar resultados;
- impedir efeitos duplicados;
- decidir próximo passo;
- iniciar cancelamento;
- planejar compensações;
- indicar reconciliação;
- produzir eventos.

Não pertence ao aggregate:

- estado real do provider;
- política de retry técnico;
- envio HTTP;
- publicação em broker;
- persistência;
- consulta analítica.

---

### 16. Definir estados do aggregate

```java
package br.com.formacao.orderflow.domain.model;

public enum OrderProcessStatus {
    RECEIVED,
    AWAITING_STOCK,
    STOCK_RESERVED,
    AWAITING_PAYMENT,
    PAYMENT_AUTHORIZED,
    AWAITING_FULFILLMENT,
    IN_FULFILLMENT,
    COMPLETED,
    CANCELLATION_REQUESTED,
    COMPENSATING,
    CANCELLED,
    FAILED,
    PENDING_RECONCILIATION
}
```

O estado `PROCESSING` funcional foi removido porque não acrescentava uma decisão específica.

Essa é uma melhoria da modelagem em relação ao escopo funcional.

---

### 17. Criar catálogo de invariantes

Arquivo:

```text
domain/INVARIANT_CATALOG.md
```

Invariantes:

```text
INV-001:
tenant nunca muda.

INV-002:
pedido possui ao menos uma linha.

INV-003:
todas as linhas usam
a mesma moeda.

INV-004:
pagamento so pode ser solicitado
com estoque reservado.

INV-005:
fulfillment so pode iniciar
com estoque e pagamento confirmados.

INV-006:
pedido concluido e terminal.

INV-007:
resultado externo duplicado
nao reaplica efeito.

INV-008:
cancelamento depende
de elegibilidade.

INV-009:
compensacao considera
somente efeitos confirmados.

INV-010:
resultado ambiguo
leva a reconciliacao.

INV-011:
historico de decisao
nao e removido.

INV-012:
transicao invalida
nao altera estado.
```

---

### 18. Criar OrderProcess

```java
package br.com.formacao.orderflow.domain.model;

import br.com.formacao.orderflow.domain.event.DomainEvent;
import br.com.formacao.orderflow.domain.event.OrderRegistered;
import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public final class OrderProcess {

    private final OrderId id;
    private final TenantId tenantId;
    private final List<OrderLine> lines;
    private final Money total;
    private final List<ProcessingStep> steps;
    private final List<DomainEvent> pendingEvents;
    private OrderProcessStatus status;
    private boolean stockConfirmed;
    private boolean paymentConfirmed;
    private boolean fulfillmentStarted;
    private long version;

    private OrderProcess(
            OrderId id,
            TenantId tenantId,
            List<OrderLine> lines,
            Money total,
            Instant occurredAt,
            CorrelationId correlationId) {

        this.id = Objects.requireNonNull(id);
        this.tenantId = Objects.requireNonNull(
                tenantId);
        this.lines = List.copyOf(lines);
        this.total = Objects.requireNonNull(total);
        this.steps = new ArrayList<>();
        this.pendingEvents = new ArrayList<>();
        this.status = OrderProcessStatus.RECEIVED;
        this.version = 0L;

        pendingEvents.add(new OrderRegistered(
                id,
                tenantId,
                total,
                occurredAt,
                correlationId));
    }

    public static OrderProcess register(
            OrderId id,
            TenantId tenantId,
            List<OrderLine> lines,
            Instant occurredAt,
            CorrelationId correlationId) {

        if (lines == null || lines.isEmpty()) {
            throw new IllegalArgumentException(
                    "Order requires lines");
        }

        Money total = lines.stream()
                .map(OrderLine::subtotal)
                .reduce(Money::add)
                .orElseThrow();

        return new OrderProcess(
                id,
                tenantId,
                lines,
                total,
                occurredAt,
                correlationId);
    }

    public OrderProcessStatus status() {
        return status;
    }

    public List<DomainEvent> pullEvents() {
        List<DomainEvent> copy =
                List.copyOf(pendingEvents);

        pendingEvents.clear();
        return copy;
    }
}
```

O aggregate ainda receberá comportamentos nos próximos passos.

---

### 19. Criar ProcessingStep

```java
package br.com.formacao.orderflow.domain.model;

import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import java.time.Instant;
import java.util.Objects;

public record ProcessingStep(
        String type,
        String outcome,
        ExternalOperationId externalOperationId,
        Instant occurredAt) {

    public ProcessingStep {
        Objects.requireNonNull(type);
        Objects.requireNonNull(outcome);
        Objects.requireNonNull(occurredAt);
    }
}
```

Uma etapa registra decisão relevante, não log técnico.

---

### 20. Criar resultados externos traduzidos

```java
package br.com.formacao.orderflow.domain.result;

import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import java.util.Objects;

public sealed interface StockReservationResult {

    ExternalOperationId operationId();

    record Reserved(
            ExternalOperationId operationId)
            implements StockReservationResult {

        public Reserved {
            Objects.requireNonNull(operationId);
        }
    }

    record Rejected(
            ExternalOperationId operationId,
            String reason)
            implements StockReservationResult {

        public Rejected {
            Objects.requireNonNull(operationId);
            Objects.requireNonNull(reason);
        }
    }

    record Ambiguous(
            ExternalOperationId operationId)
            implements StockReservationResult {

        public Ambiguous {
            Objects.requireNonNull(operationId);
        }
    }
}
```

O modelo externo pode possuir dezenas de campos.

O domínio recebe apenas o significado necessário.

---

### 21. Solicitar reserva de estoque

Adicione ao aggregate:

```java
public void requestStockReservation(
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(OrderProcessStatus.RECEIVED);

    status = OrderProcessStatus.AWAITING_STOCK;
    version++;

    pendingEvents.add(
            new StockReservationRequested(
                    id,
                    tenantId,
                    total,
                    occurredAt,
                    correlationId));
}
```

A ação externa será executada pela aplicação após o evento ou por um command handler.

---

### 22. Aplicar resultado reservado

```java
public void recordStockReserved(
        StockReservationResult.Reserved result,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.AWAITING_STOCK);
    ensureNewOperation(result.operationId());

    stockConfirmed = true;
    status = OrderProcessStatus.STOCK_RESERVED;
    steps.add(new ProcessingStep(
            "STOCK",
            "RESERVED",
            result.operationId(),
            occurredAt));
    version++;

    pendingEvents.add(new StockReserved(
            id,
            tenantId,
            result.operationId(),
            occurredAt,
            correlationId));
}
```

---

### 23. Aplicar estoque rejeitado

Comportamento:

```text
status:
FAILED.

payment:
nao solicitado.

fulfillment:
nao iniciado.

event:
StockReservationRejected.

history:
preservado.
```

O aggregate não deve tentar compensar uma reserva que nunca foi confirmada.

---

### 24. Aplicar resultado ambíguo

```java
public void recordAmbiguousStockResult(
        StockReservationResult.Ambiguous result,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.AWAITING_STOCK);
    ensureNewOperation(result.operationId());

    status =
            OrderProcessStatus.PENDING_RECONCILIATION;
    steps.add(new ProcessingStep(
            "STOCK",
            "AMBIGUOUS",
            result.operationId(),
            occurredAt));
    version++;

    pendingEvents.add(
            new OrderReconciliationRequired(
                    id,
                    tenantId,
                    "STOCK",
                    occurredAt,
                    correlationId));
}
```

---

### 25. Solicitar pagamento

Regra:

```text
somente STOCK_RESERVED.
```

A decisão produz:

```text
PaymentAuthorizationRequested.
```

O total autorizado deve ser o total do pedido.

---

### 26. Aplicar pagamento autorizado

Resultado:

- marca pagamento confirmado;
- registra operação externa;
- altera para `PAYMENT_AUTHORIZED`;
- produz `PaymentAuthorized`;
- habilita início do fulfillment.

---

### 27. Aplicar pagamento recusado

Resultado:

- pagamento não confirmado;
- status entra em `COMPENSATING`;
- compensação de estoque é planejada;
- produz fato de falha;
- fulfillment não inicia.

Não transforme recusa em exception técnica.

Ela é resultado de negócio esperado.

---

### 28. Iniciar fulfillment

```java
public void startFulfillment(
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.PAYMENT_AUTHORIZED);

    if (!stockConfirmed || !paymentConfirmed) {
        throw new DomainRuleViolation(
                "Stock and payment are required");
    }

    fulfillmentStarted = true;
    status =
            OrderProcessStatus.IN_FULFILLMENT;
    version++;

    pendingEvents.add(new FulfillmentStarted(
            id,
            tenantId,
            occurredAt,
            correlationId));
}
```

---

### 29. Concluir fulfillment

Precondições:

- fulfillment iniciado;
- resultado não duplicado;
- status compatível.

Resultado:

- registra operação;
- altera para `COMPLETED`;
- produz `OrderCompleted`;
- impede cancelamento normal;
- encerra jornada principal.

---

### 30. Criar policy de cancelamento

```java
package br.com.formacao.orderflow.domain.policy;

import br.com.formacao.orderflow.domain.model.OrderProcessStatus;

public final class CancellationEligibilityPolicy {

    public boolean canCancel(
            OrderProcessStatus status,
            boolean irreversiblePointReached) {

        if (irreversiblePointReached) {
            return false;
        }

        return switch (status) {
            case RECEIVED,
                 AWAITING_STOCK,
                 STOCK_RESERVED,
                 AWAITING_PAYMENT,
                 PAYMENT_AUTHORIZED,
                 AWAITING_FULFILLMENT,
                 IN_FULFILLMENT,
                 PENDING_RECONCILIATION -> true;
            default -> false;
        };
    }
}
```

O ponto irreversível será informado pelo fulfillment traduzido para o domínio.

---

### 31. Solicitar cancelamento

O aggregate deve:

- consultar a policy;
- rejeitar estado terminal;
- registrar motivo;
- alterar para `CANCELLATION_REQUESTED`;
- produzir `OrderCancellationRequested`;
- não executar integração diretamente.

---

### 32. Criar CompensationAction

```java
package br.com.formacao.orderflow.domain.model;

import java.util.Objects;

public record CompensationAction(
        String type,
        String reason,
        boolean required) {

    public CompensationAction {
        Objects.requireNonNull(type);
        Objects.requireNonNull(reason);
    }
}
```

---

### 33. Criar CompensationPlanner

```java
package br.com.formacao.orderflow.domain.policy;

import br.com.formacao.orderflow.domain.model.CompensationAction;
import java.util.ArrayList;
import java.util.List;

public final class CompensationPlanner {

    public List<CompensationAction> plan(
            boolean stockConfirmed,
            boolean paymentConfirmed,
            boolean fulfillmentStarted,
            boolean fulfillmentReversible) {

        List<CompensationAction> actions =
                new ArrayList<>();

        if (fulfillmentStarted
                && fulfillmentReversible) {
            actions.add(new CompensationAction(
                    "CANCEL_FULFILLMENT",
                    "Order cancellation",
                    true));
        }

        if (paymentConfirmed) {
            actions.add(new CompensationAction(
                    "REVERSE_PAYMENT_AUTHORIZATION",
                    "Order cancellation",
                    true));
        }

        if (stockConfirmed) {
            actions.add(new CompensationAction(
                    "RELEASE_STOCK",
                    "Order cancellation",
                    true));
        }

        return List.copyOf(actions);
    }
}
```

A policy decide ações necessárias.

A aplicação executará essas ações pelos ports.

---

### 34. Iniciar compensação

Resultado:

- status `COMPENSATING`;
- plano registrado;
- evento `OrderCompensationStarted`;
- cada ação possui resultado separado;
- falha parcial leva a reconciliação.

---

### 35. Concluir cancelamento

Somente quando todas as ações obrigatórias estiverem concluídas.

Resultado:

```text
status:
CANCELLED.

event:
OrderCancelled.

terminal:
true.
```

---

### 36. Tratar compensação parcial

Se uma ação falhar ou ficar ambígua:

```text
status:
PENDING_RECONCILIATION.
```

O domínio não deve declarar `CANCELLED` enquanto efeito obrigatório permanecer desconhecido.

---

### 37. Proteger resultados duplicados

Crie uma coleção de `ExternalOperationId` aplicados.

Regra:

```text
a mesma operacao externa
nao pode alterar o aggregate
duas vezes.
```

Possibilidades:

- ignorar de forma idempotente;
- retornar resultado `ALREADY_APPLIED`;
- lançar erro de domínio controlado.

Para o projeto, escolha:

```text
ignorar e registrar
sem novo domain event.
```

Payload divergente para a mesma operação deve gerar finding de reconciliação.

---

### 38. Criar helper de transição

```java
private void requireStatus(
        OrderProcessStatus expected) {

    if (status != expected) {
        throw new InvalidOrderTransition(
                status,
                expected);
    }
}
```

Não exponha setter de status.

Toda transição precisa de método com intenção.

---

### 39. Criar DomainEvent

```java
package br.com.formacao.orderflow.domain.event;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;

public interface DomainEvent {

    OrderId orderId();

    TenantId tenantId();

    Instant occurredAt();

    CorrelationId correlationId();
}
```

---

### 40. Criar OrderRegistered

```java
package br.com.formacao.orderflow.domain.event;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;

public record OrderRegistered(
        OrderId orderId,
        TenantId tenantId,
        Money total,
        Instant occurredAt,
        CorrelationId correlationId)
        implements DomainEvent {
}
```

---

### 41. Criar catálogo de eventos

Arquivo:

```text
domain/DOMAIN_EVENT_CATALOG.md
```

Eventos finais do domínio:

```text
OrderRegistered;

StockReservationRequested;

StockReserved;

StockReservationRejected;

PaymentAuthorizationRequested;

PaymentAuthorized;

PaymentRejected;

FulfillmentStarted;

FulfillmentProgressRecorded;

OrderCompleted;

OrderCancellationRequested;

OrderCompensationStarted;

CompensationActionCompleted;

OrderCancelled;

OrderFailed;

OrderReconciliationRequired.
```

Eventos de integração poderão ser diferentes.

---

### 42. Criar catálogo de commands

Arquivo:

```text
domain/COMMAND_CATALOG.md
```

Application commands:

```text
RegisterOrderCommand;

RequestStockReservationCommand;

RecordStockReservationResultCommand;

RequestPaymentAuthorizationCommand;

RecordPaymentAuthorizationResultCommand;

StartFulfillmentCommand;

RecordFulfillmentResultCommand;

RequestOrderCancellationCommand;

RecordCompensationResultCommand;

ReconcileOrderCommand.
```

Commands não são métodos públicos genéricos de atualização.

---

### 43. Criar port de repository

```java
package br.com.formacao.orderflow.domain.port;

import br.com.formacao.orderflow.domain.model.OrderProcess;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Optional;

public interface OrderProcessRepository {

    Optional<OrderProcess> find(
            TenantId tenantId,
            OrderId orderId);

    void save(OrderProcess orderProcess);
}
```

Nenhuma annotation de persistência aparece.

---

### 44. Criar port de estoque

```java
package br.com.formacao.orderflow.domain.port;

import br.com.formacao.orderflow.domain.model.OrderLine;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.List;

public interface StockReservationPort {

    void requestReservation(
            TenantId tenantId,
            OrderId orderId,
            List<OrderLine> lines);
}
```

O formato externo será responsabilidade do adapter.

---

### 45. Criar ports de pagamento e fulfillment

`PaymentAuthorizationPort` recebe:

- tenant;
- order;
- total;
- correlation.

`FulfillmentPort` recebe:

- tenant;
- order;
- linhas;
- referência de processamento.

Os ports não retornam DTO de provider diretamente.

---

### 46. Criar DomainClock

```java
package br.com.formacao.orderflow.domain.port;

import java.time.Instant;

public interface DomainClock {

    Instant now();
}
```

Isso torna testes determinísticos.

---

### 47. Criar anti-corruption mapping

Arquivo:

```text
domain/ANTI_CORRUPTION_MAPPING.md
```

Exemplo de estoque:

```text
provider:
ALLOCATED.

domain:
Reserved.
```

```text
provider:
NO_SUPPLY.

domain:
Rejected.
```

```text
provider:
TIMEOUT_UNKNOWN.

domain:
Ambiguous.
```

O domínio não usa enums do provider.

---

### 48. Criar catálogo de erros

Arquivo:

```text
domain/DOMAIN_ERROR_CATALOG.md
```

Erros:

```text
INVALID_ORDER_TRANSITION;

EMPTY_ORDER;

MIXED_CURRENCY;

DUPLICATE_EXTERNAL_RESULT;

CANCELLATION_NOT_ALLOWED;

COMPENSATION_INCOMPLETE;

RECONCILIATION_REQUIRED;

TENANT_MISMATCH;

INVALID_MONEY;

INVALID_QUANTITY.
```

Erros do domínio não incluem:

- HTTP status;
- SQL error;
- broker timeout;
- JSON mapping.

---

### 49. Criar domain service somente quando necessário

Use domain service quando:

- decisão pertence ao domínio;
- não cabe naturalmente em uma entity;
- depende de múltiplas informações de domínio;
- continua sem infraestrutura.

Exemplos válidos:

- `CancellationEligibilityPolicy`;
- `CompensationPlanner`;
- `NextProcessingStepPolicy`.

Evite criar:

```text
OrderDomainService
```

com todos os comportamentos.

---

### 50. Criar traceability

Arquivo:

```text
domain/DOMAIN_TRACEABILITY.md
```

Exemplo:

```text
UC-01 Registrar pedido
-> OrderProcess.register
-> INV-002
-> OrderRegistered
-> RegisterOrderCommand.

FR-004 Fulfillment apos aprovacao
-> startFulfillment
-> INV-005
-> FulfillmentStarted.

UC-12 Executar compensacoes
-> CompensationPlanner
-> INV-009
-> OrderCompensationStarted.
```

---

### 51. Criar riscos do domínio

Arquivo:

```text
domain/DOMAIN_RISK_REGISTER.md
```

Riscos:

```text
aggregate grande demais;

estado unico
esconder etapas independentes;

eventos excessivos;

provider model vazando;

compensacao incompleta;

idempotencia colocada
somente no dominio;

historico confundido
com log tecnico;

regra duplicada
em application service;

status terminal incorreto;

reconciliacao sem owner.
```

---

### 52. Criar perguntas abertas

Arquivo:

```text
domain/DOMAIN_OPEN_QUESTIONS.md
```

Perguntas:

```text
OrderLine precisa
de identidade propria?

estoque e pagamento
devem ser sequenciais?

fulfillment progress
pertence ao aggregate?

historico completo
fica no aggregate
ou em projection?

qual resultado divergente
deve forcar reconciliacao?

compensacao possui
subprocesso proprio?

version pertence
ao dominio
ou apenas persistencia?
```

Decisão atual:

- `OrderLine` é value object;
- histórico completo será derivado por eventos;
- versão é necessária para concorrência, mas o mecanismo de persistência será definido na aula 675.

---

### 53. Criar boundary da próxima aula

Arquivo:

```text
domain/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 674 define:

- linguagem;
- aggregate;
- entities;
- value objects;
- invariantes;
- policies;
- commands;
- domain events;
- ports;
- erros.

A aula 675 define:

- schemas;
- tabelas;
- colunas;
- primary keys;
- foreign keys;
- constraints;
- indexes;
- optimistic locking;
- Outbox;
- Inbox;
- audit persistence;
- migrations;
- query models.

Nenhuma tabela
e considerada final
nesta aula.
```

---

### 54. Testar registro

Cenários:

- pedido válido;
- nenhuma linha;
- quantidade inválida;
- moedas diferentes;
- total calculado;
- evento registrado.

Resultado esperado:

```text
OrderProcessRegistrationTest:
PASS.
```

---

### 55. Testar transição de estoque

Cenários:

- solicitar após `RECEIVED`;
- rejeitar solicitação duplicada;
- aplicar reservado;
- aplicar rejeitado;
- aplicar ambíguo;
- impedir pagamento antes da reserva.

---

### 56. Testar pagamento

Cenários:

- solicitar após reserva;
- autorizar;
- recusar;
- impedir fulfillment antes de autorização;
- evitar resultado duplicado;
- iniciar compensação após recusa.

---

### 57. Testar fulfillment

Cenários:

- iniciar com pré-condições;
- registrar progresso;
- concluir;
- impedir conclusão duplicada;
- impedir cancelamento após conclusão;
- tratar resultado ambíguo.

---

### 58. Testar cancelamento

Cenários:

- cancelar antes de estoque;
- cancelar após estoque;
- cancelar após pagamento;
- cancelar fulfillment reversível;
- rejeitar após ponto irreversível;
- rejeitar em estado terminal.

---

### 59. Testar compensação

Cenários:

- liberar apenas estoque confirmado;
- reverter apenas pagamento confirmado;
- cancelar fulfillment apenas se iniciado e reversível;
- concluir somente após ações obrigatórias;
- reconciliar falha parcial.

---

### 60. Testar domain events

Valide:

- fato correto;
- tenant;
- order;
- occurred at;
- correlation;
- ausência de evento duplicado;
- ordem causal local;
- `pullEvents` limpa pendências.

---

### 61. Criar reports

Exemplo:

```yaml
finalDomainModel:
  subdomains:
    total:
      8
    core:
      1

  aggregates:
    total:
      1
    root:
      OrderProcess

  entities:
    total:
      3

  valueObjects:
    total:
      9

  invariants:
    total:
      12
    tested:
      12

  domainEvents:
    total:
      16
    withFactSemantics:
      16

  ports:
    total:
      7
    frameworkDependencies:
      0

  persistence:
    finalized:
      false

  gate:
    PASS
```

---

### 62. Criar evidence

Arquivo:

```text
contracts/final-domain-model-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- domain name;
- subdomain count;
- core subdomain count;
- aggregate count;
- aggregate root name;
- entity count;
- value object count;
- invariant count;
- tested invariant count;
- domain policy count;
- application command count;
- domain event count;
- fact semantic coverage;
- port count;
- framework dependency count;
- transition test count;
- duplicate result test status;
- reconciliation test status;
- traceability coverage;
- persistence finalized;
- architecture test status;
- documentation status;
- gate status;
- timestamp.

Não inclua:

- annotations JPA;
- tabelas;
- colunas;
- schemas;
- SQL;
- migrations;
- índices;
- engine de banco;
- C4 final;
- credenciais;
- conteúdo detalhado da aula 675.

---

### 63. Criar gate

O gate valida:

- charter;
- linguagem;
- subdomínios;
- boundary;
- aggregate;
- entities;
- value objects;
- invariantes;
- policies;
- commands;
- events;
- ports;
- mappings;
- errors;
- traceability;
- risks;
- tests;
- reports;
- evidence;
- não antecipação.

Status:

```text
PASS;

FAIL_DOMAIN_CHARTER;

FAIL_UBIQUITOUS_LANGUAGE;

FAIL_SUBDOMAIN_MAP;

FAIL_DOMAIN_BOUNDARY;

FAIL_AGGREGATE;

FAIL_ENTITY;

FAIL_VALUE_OBJECT;

FAIL_INVARIANT;

FAIL_DOMAIN_POLICY;

FAIL_COMMAND;

FAIL_DOMAIN_EVENT;

FAIL_PORT;

FAIL_ANTI_CORRUPTION;

FAIL_DOMAIN_ERROR;

FAIL_TRACEABILITY;

FAIL_DOMAIN_TEST;

FAIL_PERSISTENCE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 64. Executar validação completa

```powershell
.\scripts\m20\orderflow-domain-model\validate-domain-contract.ps1

.\scripts\m20\orderflow-domain-model\validate-ubiquitous-language.ps1

.\scripts\m20\orderflow-domain-model\validate-aggregate-model.ps1

.\scripts\m20\orderflow-domain-model\validate-value-objects.ps1

.\scripts\m20\orderflow-domain-model\validate-invariants.ps1

.\scripts\m20\orderflow-domain-model\validate-domain-events.ps1

.\scripts\m20\orderflow-domain-model\validate-ports.ps1

.\scripts\m20\orderflow-domain-model\validate-domain-traceability.ps1

.\scripts\m20\orderflow-domain-model\run-orderflow-domain-tests.ps1

.\scripts\m20\orderflow-domain-model\collect-orderflow-domain-evidence.ps1

.\scripts\m20\orderflow-domain-model\verify-orderflow-domain-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 65. Encerrar o laboratório

Confirme:

- charter;
- linguagem ubíqua;
- subdomínios;
- boundary;
- aggregate;
- entities;
- value objects;
- invariantes;
- policies;
- commands;
- events;
- ports;
- anti-corruption;
- errors;
- traceability;
- risks;
- open questions;
- tests;
- reports;
- evidence;
- gate aprovado;
- persistência não finalizada.

---

## Entendendo o que foi feito

### O comportamento virou modelo

Casos de uso e regras foram traduzidos para métodos, invariantes, policies e eventos.

### O aggregate ganhou responsabilidade clara

`OrderProcess` protege a jornada e não copia os providers.

### Value objects reduziram ambiguidade

Tenant, pedido, produto, quantidade, dinheiro, correlation e operação externa ganharam tipos próprios.

### Estados funcionais foram refinados

O estado genérico `PROCESSING` foi removido.

Estados agora correspondem a decisões específicas.

### Providers ficaram fora do domínio

Mappings traduzem respostas externas para `Reserved`, `Rejected` ou `Ambiguous`.

### Compensação virou decisão explícita

A policy considera apenas efeitos confirmados e reconhece falhas parciais.

### Persistência permaneceu separada

O domínio não possui JPA, SQL ou detalhes de schema.

A aula 675 projetará o banco a partir das necessidades do modelo.

---

## Erros comuns importantes

### Aggregate com toda a empresa

O limite transacional se torna inviável.

### Modelo anêmico

Regras ficam em services e setters.

### Entidade para tudo

Conceitos definidos por valor ganham identidade artificial.

### Primitive obsession

`String tenant`, `String order` e `BigDecimal total` perdem significado.

### Provider dentro do domínio

Enums e DTOs externos contaminam a linguagem.

### Domain event como mensagem técnica

O fato perde semântica.

### Idempotência somente no aggregate

Deduplicação de comando exige application e persistência.

### Setter de status

Transições ficam sem intenção.

### Compensação presumida como sucesso

Falhas parciais ficam invisíveis.

### Criar JPA agora

A persistência passa a controlar o domínio antes da aula 675.

---

## Comandos úteis

### Validar aggregate

```powershell
.\scripts\m20\orderflow-domain-model\validate-aggregate-model.ps1
```

### Validar value objects

```powershell
.\scripts\m20\orderflow-domain-model\validate-value-objects.ps1
```

### Validar invariantes

```powershell
.\scripts\m20\orderflow-domain-model\validate-invariants.ps1
```

### Validar eventos

```powershell
.\scripts\m20\orderflow-domain-model\validate-domain-events.ps1
```

### Executar testes

```powershell
.\scripts\m20\orderflow-domain-model\run-orderflow-domain-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m20\orderflow-domain-model\verify-orderflow-domain-gate.ps1
```

---

## Exercício guiado

Modele o caso:

```text
pagamento recusado
apos estoque reservado.
```

Crie:

1. estado inicial;
2. command;
3. resultado externo traduzido;
4. método do aggregate;
5. invariantes;
6. novo estado;
7. ações de compensação;
8. domain events;
9. erros;
10. testes positivos;
11. testes negativos;
12. traceability;
13. evidence;
14. pergunta aberta para o banco.

Não crie tabela.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 673 e ponte para a aula 675 foram preservadas;
- laboratório `orderflow-domain-model` foi criado;
- Domain Model Charter foi criado;
- contrato principal foi criado;
- linguagem ubíqua foi criada;
- mapa de subdomínios foi criado;
- boundary foi definido;
- Order Orchestration foi classificado como core;
- OrderId foi criado;
- TenantId foi criado;
- ProductCode foi criado;
- Quantity foi criado;
- Money foi criado;
- IdempotencyKey foi criado;
- ExternalOperationId foi criado;
- OrderLine foi modelada;
- OrderProcess foi definido como aggregate root;
- estados do aggregate foram definidos;
- catálogo de invariantes foi criado;
- OrderProcess foi criado;
- ProcessingStep foi criado;
- resultados externos foram traduzidos;
- reserva de estoque foi modelada;
- estoque rejeitado foi modelado;
- resultado ambíguo foi modelado;
- pagamento foi modelado;
- fulfillment foi modelado;
- policy de cancelamento foi criada;
- compensações foram planejadas;
- compensação parcial foi tratada;
- resultados duplicados foram protegidos;
- transições não usam setter;
- DomainEvent foi criado;
- eventos de domínio foram catalogados;
- commands foram catalogados;
- repository port foi criado;
- ports externos foram criados;
- DomainClock foi criado;
- Anti-Corruption Mapping foi criado;
- erros do domínio foram catalogados;
- domain services foram limitados;
- traceability foi criada;
- riscos e perguntas abertas foram registrados;
- boundary da aula 675 foi criado;
- testes de registro, estoque, pagamento, fulfillment, cancelamento, compensação, duplicidade e reconciliação foram definidos;
- reports, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- modelagem de banco final não foi antecipada.

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
  labs/m20/aula-674-modelagem-dominio-final/orderflow-domain-model `
  scripts/m20/orderflow-domain-model `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|private_key|@Entity|@Table|CREATE TABLE|ALTER TABLE|privateEndpoint"
```

Commit recomendado:

```powershell
git commit -m "feat(m20): modelar dominio final do OrderFlow"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- annotations JPA;
- tabelas;
- SQL;
- migrations;
- índices;
- C4 final;
- credenciais;
- conteúdo detalhado da aula 675.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você criou o modelo de domínio final do OrderFlow.

Você definiu:

```text
Order Orchestration;

Ubiquitous Language;

Subdomain Map;

Domain Boundary;

OrderProcess Aggregate;

OrderLine;

ProcessingStep;

CompensationAction;

Value Objects;

Invariants;

Cancellation Policy;

Compensation Planner;

Commands;

Domain Events;

Ports;

Anti-Corruption Mappings;

Domain Errors;

Traceability;

tests, reports, evidence e gate.
```

Você transformou o escopo funcional em comportamento protegido.

Você também refinou estados, separou resultados externos, tratou duplicidade, timeout ambíguo, cancelamento, compensação e reconciliação.

A próxima aula será:

```text
675 - M20.05 - Modelagem banco final
```

Nela, você traduzirá o modelo para persistência, schemas, tabelas, constraints, índices, locking, Outbox, Inbox, auditoria, projections e migrations.

Nenhuma modelagem de banco final foi realizada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei linguagem ubíqua.
- [ ] Defini subdomínios.
- [ ] Defini boundary.
- [ ] Criei aggregate.
- [ ] Criei value objects.
- [ ] Criei invariantes.
- [ ] Modelei transições.
- [ ] Traduzi providers.
- [ ] Criei policies.
- [ ] Criei domain events.
- [ ] Criei ports.
- [ ] Criei testes.
- [ ] Preservei persistência para a aula 675.

---

## Troubleshooting adicional

### O aggregate ficou grande

Revise se histórico, projections ou integrações entraram no limite transacional.

### O domínio conhece HTTP

Crie port e mapping.

### O evento parece comando

Renomeie como fato ocorrido.

### A regra está no handler

Mova para aggregate ou policy quando for regra de domínio.

### O value object possui setter

Value object deve ser imutável.

### A compensação altera provider diretamente

O domínio deve decidir e a aplicação deve executar pelo port.

### O duplicate result gera novo evento

Proteja `ExternalOperationId`.

### O estado não explica decisão

Remova estado genérico ou refine a linguagem.

### A versão parece técnica

Mantenha a necessidade de concorrência e deixe a persistência decidir o mecanismo.

### Quero adicionar annotation JPA

Essa etapa pertence à aula 675.

### O provider possui muitos campos

Mapeie somente o significado necessário.

---

## Perguntas de revisão

1. O que é modelagem de domínio?
2. O que é aggregate?
3. O que o OrderProcess protege?
4. O que fica fora do aggregate?
5. O que é entity?
6. O que é value object?
7. Por que usar TenantId?
8. Por que usar Money?
9. OrderLine é entity ou value object?
10. O que é invariant?
11. Quando pagamento pode ser solicitado?
12. Quando fulfillment pode iniciar?
13. O que acontece no resultado ambíguo?
14. O que é compensation?
15. O que CompensationPlanner faz?
16. Como resultado duplicado é tratado?
17. O que é domain event?
18. Domain event é tópico?
19. O que é port?
20. O que é Anti-Corruption Layer?
21. Onde fica idempotência de comando?
22. O domínio usa JPA?
23. O que a aula 675 fará?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Representação de linguagem, regras e decisões.
2. Limite de consistência.
3. Jornada, transições, efeitos e fatos.
4. Providers, protocolo, banco e analytics.
5. Objeto com identidade.
6. Objeto definido por valor.
7. Para expressar tenant e evitar primitive obsession.
8. Para proteger moeda, escala e operações.
9. Value object neste recorte.
10. Regra que sempre deve ser verdadeira.
11. Após estoque reservado.
12. Após estoque e pagamento confirmados.
13. Vai para reconciliação.
14. Ação para reduzir efeitos confirmados.
15. Decide ações compensatórias.
16. Ignorado sem novo efeito.
17. Fato ocorrido no domínio.
18. Não.
19. Contrato abstrato com mundo externo.
20. Tradução entre modelos.
21. Aplicação e persistência.
22. Não.
23. Modelar persistência.
24. Modelagem banco final.
25. Domínio protege decisões; banco persiste.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 674 - M20.04 - Modelagem dominio final

- Continuei após Escopo funcional.
- Criei o laboratório `orderflow-domain-model`.
- Criei Domain Model Charter.
- Criei o contrato principal.
- Criei linguagem ubíqua.
- Criei mapa de subdomínios.
- Defini Order Orchestration como core.
- Defini Domain Boundary.
- Criei OrderId.
- Criei TenantId.
- Criei ProductCode.
- Criei Quantity.
- Criei Money.
- Criei IdempotencyKey.
- Criei ExternalOperationId.
- Modelei OrderLine como value object.
- Defini OrderProcess como aggregate root.
- Refinei estados do aggregate.
- Criei catálogo de invariantes.
- Criei OrderProcess.
- Criei ProcessingStep.
- Traduzi resultados externos.
- Modelei solicitação e resultado de estoque.
- Modelei resultado ambíguo.
- Modelei pagamento autorizado e recusado.
- Modelei início e conclusão de fulfillment.
- Criei CancellationEligibilityPolicy.
- Modelei solicitação de cancelamento.
- Criei CompensationAction.
- Criei CompensationPlanner.
- Modelei compensação parcial.
- Protegi resultados duplicados.
- Impedi setter de status.
- Criei DomainEvent.
- Criei OrderRegistered.
- Criei catálogo de eventos de domínio.
- Criei catálogo de commands.
- Criei OrderProcessRepository.
- Criei ports externos.
- Criei DomainClock.
- Criei Anti-Corruption Mapping.
- Criei catálogo de erros.
- Limitei domain services.
- Criei traceability.
- Criei riscos e perguntas abertas.
- Criei boundary para a aula 675.
- Defini testes do domínio.
- Criei reports, evidence e gate.
- Não antecipei modelagem de banco.
- Próxima aula: Modelagem banco final.
```

---

## Referência técnica curta

- Domain Model.
- Ubiquitous Language.
- Core Subdomain.
- Aggregate.
- Aggregate Root.
- Entity.
- Value Object.
- Invariant.
- Domain Policy.
- Domain Event.
- Application Command.
- Port.
- Anti-Corruption Layer.
- Compensation.
- Reconciliation.
- Idempotency.
- State Transition.

Regra final:

```text
O modelo de domínio final do OrderFlow deve representar Order Orchestration sem copiar banco ou providers: OrderProcess é o aggregate root responsável por tenant imutável, linhas, total, estado, etapas, resultados externos, cancelamento, compensação, reconciliação e domain events, OrderLine é value object neste recorte, OrderId, TenantId, ProductCode, Quantity, Money, IdempotencyKey, ExternalOperationId e CorrelationId eliminam primitive obsession, e invariantes garantem ao menos uma linha, moeda única, pagamento somente após estoque, fulfillment somente após estoque e pagamento, terminalidade de completed, não repetição de efeitos, elegibilidade de cancelamento, compensação apenas de efeitos confirmados e reconciliação de resultado ambíguo; respostas externas são traduzidas para Reserved, Rejected ou Ambiguous por Anti-Corruption Mapping, setters de status são proibidos, métodos expressam intenção, CancellationEligibilityPolicy decide cancelabilidade, CompensationPlanner cria ações de release, reversão e cancelamento quando aplicáveis, resultado duplicado é ignorado sem novo efeito, falha parcial mantém pending reconciliation, domain events registram fatos locais e podem ser convertidos em eventos de integração depois, ports abstraem repository, estoque, pagamento, fulfillment, clock, identifiers e publicação, e testes verificam registro, transições, duplicidade, cancelamento, compensação e reconciliação; o gate termina com charter, language, subdomains, boundary, aggregate, entities, value objects, invariants, policies, commands, events, ports, mappings, errors, traceability, risks, tests, reports e evidence aprovados, enquanto schemas, tabelas, constraints, índices, locking, Outbox, Inbox, auditoria e migrations permanecem reservados para a aula 675.
```
