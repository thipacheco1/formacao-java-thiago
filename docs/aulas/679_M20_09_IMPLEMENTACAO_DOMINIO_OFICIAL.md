# 679 - M20.09 - Implementacao dominio

## Apresentação da aula

Na aula 678, você configurou o repositório profissional do OrderFlow com monorepo Maven, módulos, documentação, governança, quality gates, CI, ADRs, C4 e evidências.

Agora começa a implementação.

A primeira entrega será o domínio.


O módulo de domínio deve ser implementado antes de controllers, repositories, mensageria e providers porque ele contém:

- linguagem;
- invariantes;
- estados;
- decisões;
- transições;
- políticas;
- fatos de negócio;
- erros previsíveis.

O domínio não deve depender de Spring Boot, JPA, Jackson, HTTP, Kafka, PostgreSQL, OpenTelemetry, SDKs de provider ou annotations de framework.

O erro mais comum seria implementar apenas classes de dados.

Exemplo fraco:

```java
public class Order {
    private String status;

    public void setStatus(String status) {
        this.status = status;
    }
}
```

Esse modelo permite qualquer transição.

Ele não protege:

- pedido sem item;
- quantidade inválida;
- moeda divergente;
- pagamento antes do estoque;
- fulfillment antes do pagamento;
- cancelamento depois do ponto irreversível;
- resultado externo duplicado;
- compensação incompleta;
- reconciliação obrigatória.

Nesta aula, você implementará o módulo:

```text
libs/orderflow-domain
```

O foco será:

```text
Java 21;

imutabilidade;

value objects;

aggregate root;

invariantes;

transicoes explicitas;

domain events;

policies;

erros de dominio;

testes unitarios;

testes de arquitetura.
```

O laboratório será:

```text
labs/m20/aula-679-implementacao-dominio/orderflow-domain-implementation
```

A próxima aula será:

```text
680 - M20.10 - Implementacao casos de uso
```

Na aula 680, o domínio será utilizado por application services, commands, handlers, ports de entrada, ports de saída, controle transacional e coordenação dos casos de uso.

Nesta aula, nenhum caso de uso de aplicação será implementado.

Regra central:

```text
o dominio deve impedir
estados invalidos
por construcao
e por comportamento.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
676:
Arquitetura C4 final.

677:
ADRs do projeto.

678:
Configuracao repositorio profissional.

679:
Implementacao dominio.

680:
Implementacao casos de uso.

681:
Implementacao API REST.
```

As aulas anteriores definiram o que será implementado.

Agora o código precisa respeitar:

- escopo funcional;
- linguagem ubíqua;
- aggregate boundary;
- ADRs;
- dependency policy;
- multi-tenancy;
- idempotência em múltiplas camadas;
- ausência de framework no domínio.

A aula 679 implementa apenas regras internas do domínio.

A aula 680 coordenará essas regras em casos de uso.

Por isso, não serão criados nesta aula:

- command handlers de aplicação;
- transaction managers;
- controllers;
- request DTOs;
- response DTOs;
- repository adapters;
- JPA entities;
- consumers;
- producers;
- provider clients;
- migrations.

---

## Objetivo prático

Será criada a estrutura:

```text
libs/orderflow-domain
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/orderflow/domain
│   │           ├── event
│   │           │   ├── DomainEvent.java
│   │           │   ├── OrderRegistered.java
│   │           │   ├── StockReservationRequested.java
│   │           │   ├── StockReserved.java
│   │           │   ├── StockReservationRejected.java
│   │           │   ├── PaymentAuthorizationRequested.java
│   │           │   ├── PaymentAuthorized.java
│   │           │   ├── PaymentRejected.java
│   │           │   ├── FulfillmentStarted.java
│   │           │   ├── OrderCompleted.java
│   │           │   ├── OrderCancellationRequested.java
│   │           │   ├── OrderCompensationStarted.java
│   │           │   ├── OrderCancelled.java
│   │           │   └── OrderReconciliationRequired.java
│   │           ├── exception
│   │           │   ├── DomainException.java
│   │           │   ├── InvalidOrderTransition.java
│   │           │   ├── CancellationNotAllowed.java
│   │           │   ├── DuplicateExternalResult.java
│   │           │   └── MixedCurrency.java
│   │           ├── model
│   │           │   ├── OrderProcess.java
│   │           │   ├── OrderLine.java
│   │           │   ├── ProcessingStep.java
│   │           │   ├── CompensationAction.java
│   │           │   ├── CompensationStatus.java
│   │           │   └── OrderProcessStatus.java
│   │           ├── policy
│   │           │   ├── CancellationEligibilityPolicy.java
│   │           │   └── CompensationPlanner.java
│   │           ├── result
│   │           │   ├── StockReservationResult.java
│   │           │   ├── PaymentAuthorizationResult.java
│   │           │   ├── FulfillmentResult.java
│   │           │   └── ReconciliationResult.java
│   │           └── value
│   │               ├── CorrelationId.java
│   │               ├── ExternalOperationId.java
│   │               ├── IdempotencyKey.java
│   │               ├── Money.java
│   │               ├── OrderId.java
│   │               ├── ProductCode.java
│   │               ├── Quantity.java
│   │               └── TenantId.java
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/domain
│               ├── MoneyTest.java
│               ├── OrderProcessRegistrationTest.java
│               ├── StockReservationTest.java
│               ├── PaymentAuthorizationTest.java
│               ├── FulfillmentTest.java
│               ├── CancellationTest.java
│               ├── CompensationTest.java
│               ├── DuplicateExternalResultTest.java
│               ├── ReconciliationTest.java
│               └── DomainArchitectureTest.java
└── target
```

---

## Conceito essencial

### Value object protege significado

Um value object deve:

- validar criação;
- ser imutável;
- possuir igualdade por valor;
- oferecer operações coerentes;
- evitar `String`, `int` e `BigDecimal` sem contexto.

Exemplo:

```text
TenantId
```

é diferente de:

```text
String tenant.
```

O primeiro comunica intenção e centraliza validação.

### Aggregate root controla transições

Somente o aggregate root pode alterar o estado interno relevante.

Ele expõe métodos com intenção:

```text
requestStockReservation;

recordStockReserved;

requestPaymentAuthorization;

recordPaymentAuthorized;

startFulfillment;

completeFulfillment;

requestCancellation;

startCompensation;

completeCancellation.
```

Ele não expõe:

```text
setStatus.
```

### Domain event registra fato

Um domain event representa algo ocorrido.

Ele não é um comando.

Exemplo:

```text
StockReserved.
```

Não use:

```text
ReserveStockEvent.
```

O primeiro é fato.

O segundo parece instrução.

### Policy representa decisão sem entidade natural

A política de cancelamento depende de:

- estado;
- ponto irreversível;
- efeitos confirmados.

Ela pertence ao domínio, mas não precisa ser uma entity.

### Factory de reconstituição não produz eventos

Criar um aggregate novo e reconstruir um aggregate salvo são ações diferentes.

Criação:

```text
publica OrderRegistered.
```

Reconstituição:

```text
restaura estado
sem publicar evento novo.
```

---

## Mão na massa guiada

### 1. Abrir o módulo do domínio

No repositório OrderFlow:

```powershell
Set-Location `
  libs/orderflow-domain
```

Valide:

```powershell
Get-ChildItem
```

---

### 2. Configurar o POM do domínio

Arquivo:

```text
libs/orderflow-domain/pom.xml
```

Conteúdo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
           http://maven.apache.org/POM/4.0.0
           https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>br.com.formacao</groupId>
        <artifactId>orderflow-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../../pom.xml</relativePath>
    </parent>

    <artifactId>orderflow-domain</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>com.tngtech.archunit</groupId>
            <artifactId>archunit-junit5</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

O domínio possui apenas dependências de teste.

---

### 3. Criar estrutura de packages

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  src/main/java/br/com/formacao/orderflow/domain/event,
  src/main/java/br/com/formacao/orderflow/domain/exception,
  src/main/java/br/com/formacao/orderflow/domain/model,
  src/main/java/br/com/formacao/orderflow/domain/policy,
  src/main/java/br/com/formacao/orderflow/domain/result,
  src/main/java/br/com/formacao/orderflow/domain/value,
  src/test/java/br/com/formacao/orderflow/domain
```

---

## Implementação dos value objects

### 4. Implementar OrderId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;
import java.util.UUID;

public record OrderId(UUID value) {

    public OrderId {
        Objects.requireNonNull(value);
    }

    public static OrderId generate() {
        return new OrderId(UUID.randomUUID());
    }

    public static OrderId from(String raw) {
        Objects.requireNonNull(raw);
        return new OrderId(UUID.fromString(raw));
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
```

A geração aleatória é aceitável no exemplo inicial.

Nos casos de uso, um port de geração poderá ser injetado para tornar o fluxo determinístico.

---

### 5. Implementar TenantId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

public record TenantId(String value) {

    private static final Pattern PATTERN =
            Pattern.compile("[a-z0-9][a-z0-9-]{2,79}");

    public TenantId {
        Objects.requireNonNull(value);

        value = value.trim()
                .toLowerCase(Locale.ROOT);

        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(
                    "Invalid tenant identifier");
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
```

---

### 6. Implementar ProductCode

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

public record ProductCode(String value) {

    private static final Pattern PATTERN =
            Pattern.compile("[A-Z0-9][A-Z0-9_-]{2,39}");

    public ProductCode {
        Objects.requireNonNull(value);

        value = value.trim()
                .toUpperCase(Locale.ROOT);

        if (!PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(
                    "Invalid product code");
        }
    }
}
```

---

### 7. Implementar Quantity

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

### 8. Implementar Money

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

    public static Money of(
            String amount,
            String currency) {

        return new Money(
                new BigDecimal(amount),
                Currency.getInstance(currency));
    }

    public Money add(Money other) {
        requireSameCurrency(other);

        return new Money(
                amount.add(other.amount),
                currency);
    }

    public Money multiply(Quantity quantity) {
        return new Money(
                amount.multiply(
                        BigDecimal.valueOf(
                                quantity.value())),
                currency);
    }

    private void requireSameCurrency(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                    "Currencies must match");
        }
    }
}
```

---

### 9. Testar Money

```java
package br.com.formacao.orderflow.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.Quantity;
import org.junit.jupiter.api.Test;

class MoneyTest {

    @Test
    void shouldAddValuesWithSameCurrency() {
        Money first = Money.of("10.00", "BRL");
        Money second = Money.of("5.50", "BRL");

        Money total = first.add(second);

        assertEquals(
                Money.of("15.50", "BRL"),
                total);
    }

    @Test
    void shouldRejectDifferentCurrencies() {
        Money brl = Money.of("10.00", "BRL");
        Money usd = Money.of("10.00", "USD");

        assertThrows(
                IllegalArgumentException.class,
                () -> brl.add(usd));
    }

    @Test
    void shouldMultiplyByQuantity() {
        Money unitPrice = Money.of("7.25", "BRL");

        Money total = unitPrice.multiply(
                new Quantity(3));

        assertEquals(
                Money.of("21.75", "BRL"),
                total);
    }
}
```

---

### 10. Implementar CorrelationId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;
import java.util.UUID;

public record CorrelationId(String value) {

    public CorrelationId {
        Objects.requireNonNull(value);

        if (value.isBlank()
                || value.length() > 120) {
            throw new IllegalArgumentException(
                    "Invalid correlation identifier");
        }
    }

    public static CorrelationId generate() {
        return new CorrelationId(
                UUID.randomUUID().toString());
    }
}
```

---

### 11. Implementar ExternalOperationId

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Locale;
import java.util.Objects;

public record ExternalOperationId(
        String provider,
        String value) {

    public ExternalOperationId {
        Objects.requireNonNull(provider);
        Objects.requireNonNull(value);

        provider = provider.trim()
                .toUpperCase(Locale.ROOT);
        value = value.trim();

        if (provider.isBlank()
                || value.isBlank()
                || value.length() > 160) {
            throw new IllegalArgumentException(
                    "Invalid external operation");
        }
    }
}
```

---

### 12. Implementar IdempotencyKey

```java
package br.com.formacao.orderflow.domain.value;

import java.util.Objects;

public record IdempotencyKey(String value) {

    public IdempotencyKey {
        Objects.requireNonNull(value);

        value = value.trim();

        if (value.isBlank()
                || value.length() > 120) {
            throw new IllegalArgumentException(
                    "Invalid idempotency key");
        }
    }
}
```

A persistência e o fluxo de aquisição da chave serão implementados nas camadas de aplicação e infraestrutura.

---

## Implementação dos modelos auxiliares

### 13. Implementar OrderLine

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
        return unitPrice.multiply(quantity);
    }
}
```

`OrderLine` permanece value object porque não será alterada individualmente neste escopo.

---

### 14. Implementar OrderProcessStatus

```java
package br.com.formacao.orderflow.domain.model;

public enum OrderProcessStatus {
    RECEIVED,
    AWAITING_STOCK,
    STOCK_RESERVED,
    AWAITING_PAYMENT,
    PAYMENT_AUTHORIZED,
    IN_FULFILLMENT,
    COMPLETED,
    CANCELLATION_REQUESTED,
    COMPENSATING,
    CANCELLED,
    FAILED,
    PENDING_RECONCILIATION;

    public boolean terminal() {
        return this == COMPLETED
                || this == CANCELLED
                || this == FAILED;
    }
}
```

---

### 15. Implementar ProcessingStep

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

        if (type.isBlank() || outcome.isBlank()) {
            throw new IllegalArgumentException(
                    "Processing step requires type and outcome");
        }
    }
}
```

---

### 16. Implementar compensação

```java
package br.com.formacao.orderflow.domain.model;

public enum CompensationStatus {
    PLANNED,
    COMPLETED,
    FAILED,
    AMBIGUOUS
}
```

```java
package br.com.formacao.orderflow.domain.model;

import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import java.util.Objects;
import java.util.UUID;

public final class CompensationAction {

    private final UUID id;
    private final String type;
    private final boolean required;
    private CompensationStatus status;
    private ExternalOperationId externalOperationId;

    public CompensationAction(
            UUID id,
            String type,
            boolean required) {

        this.id = Objects.requireNonNull(id);
        this.type = Objects.requireNonNull(type);
        this.required = required;
        this.status = CompensationStatus.PLANNED;
    }

    public void complete(
            ExternalOperationId operationId) {

        requirePlanned();
        this.externalOperationId =
                Objects.requireNonNull(operationId);
        this.status = CompensationStatus.COMPLETED;
    }

    public void fail() {
        requirePlanned();
        this.status = CompensationStatus.FAILED;
    }

    public void markAmbiguous() {
        requirePlanned();
        this.status = CompensationStatus.AMBIGUOUS;
    }

    public boolean completed() {
        return status == CompensationStatus.COMPLETED;
    }

    public boolean unresolved() {
        return status == CompensationStatus.FAILED
                || status == CompensationStatus.AMBIGUOUS;
    }

    public boolean required() {
        return required;
    }

    public String type() {
        return type;
    }

    private void requirePlanned() {
        if (status != CompensationStatus.PLANNED) {
            throw new IllegalStateException(
                    "Compensation already resolved");
        }
    }
}
```

---

## Implementação dos resultados externos

### 17. Implementar StockReservationResult

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

---

### 18. Implementar PaymentAuthorizationResult

```java
package br.com.formacao.orderflow.domain.result;

import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import java.util.Objects;

public sealed interface PaymentAuthorizationResult {

    ExternalOperationId operationId();

    record Authorized(
            ExternalOperationId operationId)
            implements PaymentAuthorizationResult {

        public Authorized {
            Objects.requireNonNull(operationId);
        }
    }

    record Rejected(
            ExternalOperationId operationId,
            String reason)
            implements PaymentAuthorizationResult {

        public Rejected {
            Objects.requireNonNull(operationId);
            Objects.requireNonNull(reason);
        }
    }

    record Ambiguous(
            ExternalOperationId operationId)
            implements PaymentAuthorizationResult {

        public Ambiguous {
            Objects.requireNonNull(operationId);
        }
    }
}
```

---

### 19. Implementar FulfillmentResult

```java
package br.com.formacao.orderflow.domain.result;

import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import java.util.Objects;

public sealed interface FulfillmentResult {

    ExternalOperationId operationId();

    record Completed(
            ExternalOperationId operationId)
            implements FulfillmentResult {

        public Completed {
            Objects.requireNonNull(operationId);
        }
    }

    record Failed(
            ExternalOperationId operationId,
            boolean reversible,
            String reason)
            implements FulfillmentResult {

        public Failed {
            Objects.requireNonNull(operationId);
            Objects.requireNonNull(reason);
        }
    }

    record Ambiguous(
            ExternalOperationId operationId)
            implements FulfillmentResult {

        public Ambiguous {
            Objects.requireNonNull(operationId);
        }
    }
}
```

---

## Implementação dos erros

### 20. Criar DomainException

```java
package br.com.formacao.orderflow.domain.exception;

public abstract class DomainException
        extends RuntimeException {

    private final String code;

    protected DomainException(
            String code,
            String message) {

        super(message);
        this.code = code;
    }

    public String code() {
        return code;
    }
}
```

---

### 21. Criar InvalidOrderTransition

```java
package br.com.formacao.orderflow.domain.exception;

import br.com.formacao.orderflow.domain.model.OrderProcessStatus;

public final class InvalidOrderTransition
        extends DomainException {

    public InvalidOrderTransition(
            OrderProcessStatus current,
            String action) {

        super(
                "INVALID_ORDER_TRANSITION",
                "Action " + action
                        + " is not allowed from "
                        + current);
    }
}
```

---

### 22. Criar erros específicos

```java
package br.com.formacao.orderflow.domain.exception;

public final class CancellationNotAllowed
        extends DomainException {

    public CancellationNotAllowed(String reason) {
        super("CANCELLATION_NOT_ALLOWED", reason);
    }
}
```

```java
package br.com.formacao.orderflow.domain.exception;

public final class DuplicateExternalResult
        extends DomainException {

    public DuplicateExternalResult() {
        super(
                "DUPLICATE_EXTERNAL_RESULT",
                "External operation was already applied");
    }
}
```

```java
package br.com.formacao.orderflow.domain.exception;

public final class MixedCurrency
        extends DomainException {

    public MixedCurrency() {
        super(
                "MIXED_CURRENCY",
                "All order lines must use the same currency");
    }
}
```

---

## Implementação dos eventos

### 23. Criar DomainEvent

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

    String eventType();
}
```

---

### 24. Implementar eventos principais

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

    @Override
    public String eventType() {
        return "OrderRegistered";
    }
}
```

```java
package br.com.formacao.orderflow.domain.event;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;

public record StockReservationRequested(
        OrderId orderId,
        TenantId tenantId,
        Instant occurredAt,
        CorrelationId correlationId)
        implements DomainEvent {

    @Override
    public String eventType() {
        return "StockReservationRequested";
    }
}
```

Os demais eventos seguem o mesmo contrato.

Cada um carrega apenas dados necessários ao fato.

---

## Implementação das policies

### 25. Implementar CancellationEligibilityPolicy

```java
package br.com.formacao.orderflow.domain.policy;

import br.com.formacao.orderflow.domain.model.OrderProcessStatus;

public final class CancellationEligibilityPolicy {

    public boolean canCancel(
            OrderProcessStatus status,
            boolean irreversiblePointReached) {

        if (irreversiblePointReached
                || status.terminal()) {
            return false;
        }

        return status != OrderProcessStatus.COMPENSATING
                && status
                != OrderProcessStatus.CANCELLATION_REQUESTED;
    }
}
```

---

### 26. Implementar CompensationPlanner

```java
package br.com.formacao.orderflow.domain.policy;

import br.com.formacao.orderflow.domain.model.CompensationAction;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
                    UUID.randomUUID(),
                    "CANCEL_FULFILLMENT",
                    true));
        }

        if (paymentConfirmed) {
            actions.add(new CompensationAction(
                    UUID.randomUUID(),
                    "REVERSE_PAYMENT_AUTHORIZATION",
                    true));
        }

        if (stockConfirmed) {
            actions.add(new CompensationAction(
                    UUID.randomUUID(),
                    "RELEASE_STOCK",
                    true));
        }

        return List.copyOf(actions);
    }
}
```

Na aula 680, a geração de identificadores será movida para um port determinístico.

---

## Implementação do aggregate

### 27. Criar estrutura do OrderProcess

```java
package br.com.formacao.orderflow.domain.model;

import br.com.formacao.orderflow.domain.event.DomainEvent;
import br.com.formacao.orderflow.domain.event.OrderRegistered;
import br.com.formacao.orderflow.domain.exception.InvalidOrderTransition;
import br.com.formacao.orderflow.domain.exception.MixedCurrency;
import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public final class OrderProcess {

    private final OrderId id;
    private final TenantId tenantId;
    private final List<OrderLine> lines;
    private final Money total;
    private final List<ProcessingStep> steps;
    private final List<CompensationAction> compensations;
    private final Set<ExternalOperationId> appliedOperations;
    private final List<DomainEvent> pendingEvents;

    private OrderProcessStatus status;
    private boolean stockConfirmed;
    private boolean paymentConfirmed;
    private boolean fulfillmentStarted;
    private boolean irreversiblePointReached;
    private long version;

    private OrderProcess(
            OrderId id,
            TenantId tenantId,
            List<OrderLine> lines,
            Money total) {

        this.id = id;
        this.tenantId = tenantId;
        this.lines = List.copyOf(lines);
        this.total = total;
        this.steps = new ArrayList<>();
        this.compensations = new ArrayList<>();
        this.appliedOperations = new HashSet<>();
        this.pendingEvents = new ArrayList<>();
        this.status = OrderProcessStatus.RECEIVED;
    }
}
```

---

### 28. Implementar factory de criação

Adicione:

```java
public static OrderProcess register(
        OrderId id,
        TenantId tenantId,
        List<OrderLine> lines,
        Instant occurredAt,
        CorrelationId correlationId) {

    Objects.requireNonNull(id);
    Objects.requireNonNull(tenantId);
    Objects.requireNonNull(occurredAt);
    Objects.requireNonNull(correlationId);

    if (lines == null || lines.isEmpty()) {
        throw new IllegalArgumentException(
                "Order requires at least one line");
    }

    Money total = calculateTotal(lines);

    OrderProcess process = new OrderProcess(
            id,
            tenantId,
            lines,
            total);

    process.pendingEvents.add(
            new OrderRegistered(
                    id,
                    tenantId,
                    total,
                    occurredAt,
                    correlationId));

    return process;
}
```

---

### 29. Implementar cálculo do total

```java
private static Money calculateTotal(
        List<OrderLine> lines) {

    Money first = lines.getFirst().subtotal();

    for (OrderLine line : lines) {
        if (!first.currency()
                .equals(line.unitPrice().currency())) {
            throw new MixedCurrency();
        }
    }

    return lines.stream()
            .map(OrderLine::subtotal)
            .reduce(Money::add)
            .orElseThrow();
}
```

---

### 30. Solicitar reserva de estoque

```java
public void requestStockReservation(
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.RECEIVED,
            "request stock reservation");

    status = OrderProcessStatus.AWAITING_STOCK;
    version++;

    pendingEvents.add(
            new StockReservationRequested(
                    id,
                    tenantId,
                    occurredAt,
                    correlationId));
}
```

---

### 31. Registrar reserva confirmada

```java
public void recordStockReserved(
        ExternalOperationId operationId,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.AWAITING_STOCK,
            "record stock reserved");

    if (!registerOperation(operationId)) {
        return;
    }

    stockConfirmed = true;
    status = OrderProcessStatus.STOCK_RESERVED;

    steps.add(new ProcessingStep(
            "STOCK",
            "RESERVED",
            operationId,
            occurredAt));

    version++;
}
```

O evento `StockReserved` também deve ser adicionado à lista de pendências.

---

### 32. Registrar rejeição de estoque

Comportamento:

```java
public void recordStockRejected(
        ExternalOperationId operationId,
        String reason,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.AWAITING_STOCK,
            "record stock rejected");

    if (!registerOperation(operationId)) {
        return;
    }

    steps.add(new ProcessingStep(
            "STOCK",
            "REJECTED:" + reason,
            operationId,
            occurredAt));

    status = OrderProcessStatus.FAILED;
    version++;
}
```

Pagamento e fulfillment permanecem não confirmados.

---

### 33. Registrar resultado ambíguo

```java
public void recordStockAmbiguous(
        ExternalOperationId operationId,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.AWAITING_STOCK,
            "record ambiguous stock result");

    if (!registerOperation(operationId)) {
        return;
    }

    steps.add(new ProcessingStep(
            "STOCK",
            "AMBIGUOUS",
            operationId,
            occurredAt));

    status =
            OrderProcessStatus.PENDING_RECONCILIATION;
    version++;
}
```

O método também publica `OrderReconciliationRequired`.

---

### 34. Solicitar autorização de pagamento

```java
public void requestPaymentAuthorization(
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.STOCK_RESERVED,
            "request payment authorization");

    if (!stockConfirmed) {
        throw new IllegalStateException(
                "Stock must be confirmed");
    }

    status =
            OrderProcessStatus.AWAITING_PAYMENT;
    version++;
}
```

O evento `PaymentAuthorizationRequested` inclui o total.

---

### 35. Registrar pagamento autorizado

```java
public void recordPaymentAuthorized(
        ExternalOperationId operationId,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.AWAITING_PAYMENT,
            "record payment authorized");

    if (!registerOperation(operationId)) {
        return;
    }

    paymentConfirmed = true;
    status =
            OrderProcessStatus.PAYMENT_AUTHORIZED;

    steps.add(new ProcessingStep(
            "PAYMENT",
            "AUTHORIZED",
            operationId,
            occurredAt));

    version++;
}
```

---

### 36. Registrar pagamento recusado

Resultado:

- operação registrada;
- step `PAYMENT/REJECTED`;
- status `COMPENSATING`;
- actions de compensação criadas;
- evento `PaymentRejected`;
- evento `OrderCompensationStarted`.

A recusa não é exception.

Ela é resultado funcional esperado.

---

### 37. Iniciar fulfillment

```java
public void startFulfillment(
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.PAYMENT_AUTHORIZED,
            "start fulfillment");

    if (!stockConfirmed || !paymentConfirmed) {
        throw new IllegalStateException(
                "Stock and payment must be confirmed");
    }

    fulfillmentStarted = true;
    status = OrderProcessStatus.IN_FULFILLMENT;
    version++;
}
```

---

### 38. Concluir fulfillment

```java
public void completeFulfillment(
        ExternalOperationId operationId,
        Instant occurredAt,
        CorrelationId correlationId) {

    requireStatus(
            OrderProcessStatus.IN_FULFILLMENT,
            "complete fulfillment");

    if (!registerOperation(operationId)) {
        return;
    }

    steps.add(new ProcessingStep(
            "FULFILLMENT",
            "COMPLETED",
            operationId,
            occurredAt));

    status = OrderProcessStatus.COMPLETED;
    irreversiblePointReached = true;
    version++;
}
```

O evento `OrderCompleted` é adicionado.

---

### 39. Solicitar cancelamento

```java
public void requestCancellation(
        String reason,
        Instant occurredAt,
        CorrelationId correlationId,
        CancellationEligibilityPolicy policy,
        CompensationPlanner planner) {

    Objects.requireNonNull(reason);
    Objects.requireNonNull(policy);
    Objects.requireNonNull(planner);

    if (!policy.canCancel(
            status,
            irreversiblePointReached)) {
        throw new CancellationNotAllowed(
                "Order cannot be cancelled from "
                        + status);
    }

    status =
            OrderProcessStatus.CANCELLATION_REQUESTED;

    compensations.addAll(
            planner.plan(
                    stockConfirmed,
                    paymentConfirmed,
                    fulfillmentStarted,
                    !irreversiblePointReached));

    if (compensations.isEmpty()) {
        status = OrderProcessStatus.CANCELLED;
    } else {
        status = OrderProcessStatus.COMPENSATING;
    }

    version++;
}
```

---

### 40. Resolver compensação

```java
public void completeCompensation(
        String actionType,
        ExternalOperationId operationId) {

    CompensationAction action = findCompensation(
            actionType);

    action.complete(operationId);

    if (allRequiredCompensationsCompleted()) {
        status = OrderProcessStatus.CANCELLED;
    }

    version++;
}
```

Falha ou ambiguidade leva a:

```text
PENDING_RECONCILIATION.
```

---

### 41. Proteger duplicidade externa

```java
private boolean registerOperation(
        ExternalOperationId operationId) {

    Objects.requireNonNull(operationId);
    return appliedOperations.add(operationId);
}
```

A mesma operação retorna sem novo efeito.

Se o mesmo identificador chegar com resultado divergente, a camada de aplicação deverá comparar fingerprint e iniciar reconciliação.

---

### 42. Implementar helper de status

```java
private void requireStatus(
        OrderProcessStatus expected,
        String action) {

    if (status != expected) {
        throw new InvalidOrderTransition(
                status,
                action);
    }
}
```

Nenhum setter de status será criado.

---

### 43. Implementar pullEvents

```java
public List<DomainEvent> pullEvents() {
    List<DomainEvent> events =
            List.copyOf(pendingEvents);

    pendingEvents.clear();
    return events;
}
```

O adapter de persistência usará essa lista para criar registros de Outbox.

---

### 44. Implementar getters defensivos

Exponha:

- `id`;
- `tenantId`;
- `lines`;
- `total`;
- `status`;
- `steps`;
- `compensations`;
- `version`.

Collections retornam:

```java
List.copyOf(...)
```

Não retorne coleção mutável interna.

---

### 45. Implementar reconstituição

```java
public static OrderProcess reconstitute(
        OrderId id,
        TenantId tenantId,
        List<OrderLine> lines,
        Money total,
        OrderProcessStatus status,
        boolean stockConfirmed,
        boolean paymentConfirmed,
        boolean fulfillmentStarted,
        boolean irreversiblePointReached,
        long version,
        List<ProcessingStep> steps,
        List<CompensationAction> compensations,
        Set<ExternalOperationId> appliedOperations) {

    Objects.requireNonNull(status);

    OrderProcess process = new OrderProcess(
            Objects.requireNonNull(id),
            Objects.requireNonNull(tenantId),
            List.copyOf(lines),
            Objects.requireNonNull(total));

    process.status = status;
    process.stockConfirmed = stockConfirmed;
    process.paymentConfirmed = paymentConfirmed;
    process.fulfillmentStarted = fulfillmentStarted;
    process.irreversiblePointReached =
            irreversiblePointReached;
    process.version = version;
    process.steps.addAll(List.copyOf(steps));
    process.compensations.addAll(
            List.copyOf(compensations));
    process.appliedOperations.addAll(
            Set.copyOf(appliedOperations));

    process.validateSnapshot();
    return process;
}

private void validateSnapshot() {
    if (lines.isEmpty() || version < 0) {
        throw new IllegalArgumentException(
                "Invalid aggregate snapshot");
    }

    if (!calculateTotal(lines).equals(total)) {
        throw new IllegalArgumentException(
                "Snapshot total does not match lines");
    }

    if (paymentConfirmed && !stockConfirmed) {
        throw new IllegalArgumentException(
                "Payment requires confirmed stock");
    }

    if (status == OrderProcessStatus.COMPLETED
            && !fulfillmentStarted) {
        throw new IllegalArgumentException(
                "Completed order requires fulfillment");
    }

    boolean pendingRequired =
            compensations.stream()
                    .anyMatch(action ->
                            action.required()
                                    && !action.completed());

    if (status == OrderProcessStatus.CANCELLED
            && pendingRequired) {
        throw new IllegalArgumentException(
                "Cancelled order has pending compensation");
    }
}
```

A reconstituição restaura estado válido e não publica eventos.

---

### 46. Validar snapshot reconstituído

Teste linhas vazias, total divergente, versão negativa, pagamento sem estoque, conclusão sem fulfillment e cancelamento com compensação obrigatória pendente.

---

## Testes do aggregate

### 47. Testar registro válido

```java
package br.com.formacao.orderflow.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;

import br.com.formacao.orderflow.domain.event.OrderRegistered;
import br.com.formacao.orderflow.domain.model.OrderLine;
import br.com.formacao.orderflow.domain.model.OrderProcess;
import br.com.formacao.orderflow.domain.model.OrderProcessStatus;
import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.ProductCode;
import br.com.formacao.orderflow.domain.value.Quantity;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;

class OrderProcessRegistrationTest {

    @Test
    void shouldRegisterValidOrder() {
        OrderProcess process = OrderProcess.register(
                OrderId.generate(),
                new TenantId("tenant-demo"),
                List.of(new OrderLine(
                        new ProductCode("SKU-001"),
                        new Quantity(2),
                        Money.of("15.00", "BRL"))),
                Instant.parse("2026-07-15T18:00:00Z"),
                new CorrelationId("corr-001"));

        assertEquals(
                OrderProcessStatus.RECEIVED,
                process.status());

        assertEquals(
                Money.of("30.00", "BRL"),
                process.total());

        assertEquals(
                OrderRegistered.class,
                process.pullEvents()
                        .getFirst()
                        .getClass());
    }
}
```

---

### 48. Testar pedido vazio e moeda mista

Valide:

```text
empty lines:
IllegalArgumentException.

BRL + USD:
MixedCurrency.
```

Nenhum aggregate é criado.

---

### 49. Testar sequência de estoque

Cenários:

- `RECEIVED -> AWAITING_STOCK`;
- reserved;
- rejected;
- ambiguous;
- chamada duplicada;
- ação em estado inválido.

O teste deve verificar estado, steps, version e eventos.

---

### 50. Testar sequência de pagamento

Cenários:

- pagamento antes do estoque falha;
- autorização após estoque passa;
- recusa inicia compensação;
- resultado duplicado não altera versão;
- resultado ambíguo entra em reconciliação.

---

### 51. Testar fulfillment

Cenários:

- início sem pagamento falha;
- início com estoque e pagamento passa;
- conclusão torna o pedido terminal;
- conclusão duplicada não produz novo efeito;
- cancelamento depois da conclusão falha.

---

### 52. Testar cancelamento

Cenários:

- antes de estoque;
- após estoque;
- após pagamento;
- durante fulfillment reversível;
- após ponto irreversível;
- em estado terminal;
- cancelamento repetido.

---

### 53. Testar compensações

Cenários:

- estoque confirmado gera `RELEASE_STOCK`;
- pagamento confirmado gera reversão;
- fulfillment reversível gera cancelamento;
- ação concluída atualiza status;
- falha parcial entra em reconciliação;
- todas obrigatórias concluídas geram `CANCELLED`.

---

### 54. Testar eventos pendentes

Valide:

```text
pullEvents
retorna os eventos;

segunda chamada
retorna lista vazia;

reconstituicao
nao produz eventos.
```

---

### 55. Criar teste de arquitetura

```java
package br.com.formacao.orderflow.domain;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(
        packages =
                "br.com.formacao.orderflow.domain")
class DomainArchitectureTest {

    @ArchTest
    static final ArchRule DOMAIN_HAS_NO_FRAMEWORK =
            noClasses()
                    .should()
                    .dependOnClassesThat()
                    .resideInAnyPackage(
                            "org.springframework..",
                            "jakarta.persistence..",
                            "com.fasterxml.jackson..",
                            "org.apache.kafka..");
}
```

---

### 56. Executar testes do módulo

Na raiz do repositório:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -am `
  clean `
  test
```

Resultado esperado:

```text
BUILD SUCCESS.
```

---

### 57. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

O build completo precisa continuar verde.

---

### 58. Validar ausência de framework

Execute:

```powershell
Get-ChildItem `
  libs/orderflow-domain/src `
  -Recurse `
  -Filter *.java `
| Select-String `
    -Pattern `
    "org.springframework|jakarta.persistence|com.fasterxml.jackson|org.apache.kafka"
```

Resultado esperado:

```text
nenhuma ocorrencia.
```

---

### 59. Criar report de domínio

Arquivo:

```text
reports/domain-implementation-report.yaml
```

Exemplo:

```yaml
domainImplementation:
  module:
    orderflow-domain

  valueObjects:
    total:
      8
    tested:
      8

  aggregate:
    root:
      OrderProcess

  invariants:
    total:
      12
    tested:
      12

  policies:
    total:
      2

  domainEvents:
    total:
      14

  externalResults:
    total:
      3

  tests:
    unit:
      42
    architecture:
      1
    failures:
      0

  frameworkDependencies:
    total:
      0

  applicationUseCases:
    implemented:
      false

  gate:
    PASS
```

---

### 60. Criar evidence

Arquivo:

```text
contracts/domain-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- value object count;
- tested value object count;
- aggregate count;
- invariant count;
- tested invariant count;
- policy count;
- domain event count;
- external result type count;
- unit test count;
- architecture test count;
- test failure count;
- framework dependency count;
- mutable status setter count;
- duplicate operation test status;
- reconciliation test status;
- reconstitution test status;
- application use cases implemented;
- documentation status;
- gate status;
- timestamp.

---

### 61. Criar gate do domínio

Status:

```text
PASS;

FAIL_DOMAIN_MODULE;

FAIL_VALUE_OBJECT;

FAIL_AGGREGATE;

FAIL_INVARIANT;

FAIL_TRANSITION;

FAIL_DOMAIN_EVENT;

FAIL_DOMAIN_POLICY;

FAIL_EXTERNAL_RESULT;

FAIL_DOMAIN_ERROR;

FAIL_DUPLICATE_PROTECTION;

FAIL_RECONSTITUTION;

FAIL_MUTABLE_COLLECTION;

FAIL_STATUS_SETTER;

FAIL_FRAMEWORK_DEPENDENCY;

FAIL_UNIT_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_USE_CASE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 62. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Confirme:

- domínio compilando;
- testes passando;
- nenhuma dependência proibida;
- nenhum setter de status;
- nenhuma collection mutável exposta;
- nenhuma implementação de caso de uso.

---

### 63. Encerrar o laboratório

Confirme:

- POM;
- packages;
- value objects;
- models;
- resultados externos;
- exceptions;
- domain events;
- policies;
- aggregate;
- transitions;
- duplicate protection;
- compensation;
- reconciliation;
- reconstitution;
- unit tests;
- architecture test;
- report;
- evidence;
- gate aprovado;
- casos de uso não implementados.

---

## Entendendo o que foi feito

O domínio agora existe como código executável: value objects protegem significado, o aggregate controla transições, resultados externos são traduzidos, duplicidades não reaplicam efeitos, reconstituição não produz eventos e nenhuma dependência de framework entrou no módulo.

---

## Erros comuns importantes

### Usar record para aggregate mutável

Aggregate possui ciclo de vida e comportamento.

### Colocar Spring no domínio

O modelo perde independência.

### Criar setter de status

Transições ficam desprotegidas.

### Expor lista mutável

Consumer altera estado sem regra.

### Tratar recusa como exception

Resultado de negócio vira falha técnica.

### Publicar evento na reconstituição

O histórico é duplicado.

### Gerar UUID dentro de toda policy

A aula 680 moverá geração para ports determinísticos.

### Ignorar resultado duplicado sem validar fingerprint

A aplicação deverá tratar divergência como reconciliação.

### Criar repository agora

Persistência pertence às aulas posteriores de implementação.

### Criar handler agora

Casos de uso pertencem à aula 680.

---

## Comandos úteis

### Executar testes do domínio

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -am `
  test
```

### Executar um teste

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-domain `
  -Dtest=OrderProcessRegistrationTest `
  test
```

### Executar build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Procurar dependência proibida

```powershell
Get-ChildItem `
  libs/orderflow-domain/src `
  -Recurse `
  -Filter *.java `
| Select-String `
    -Pattern `
    "springframework|persistence|jackson|kafka"
```

---

## Exercício guiado

Implemente completamente o cenário:

```text
pagamento recusado
apos estoque reservado.
```

Inclua:

1. pedido válido;
2. solicitação de estoque;
3. estoque confirmado;
4. solicitação de pagamento;
5. pagamento recusado;
6. step de pagamento;
7. criação de compensação;
8. evento de rejeição;
9. evento de início de compensação;
10. status `COMPENSATING`;
11. conclusão da liberação de estoque;
12. status final;
13. proteção contra resultado duplicado;
14. teste positivo;
15. teste de transição inválida;
16. teste de duplicidade;
17. evidence.

Não implemente handler.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 678 e ponte para a aula 680 foram preservadas;
- módulo `orderflow-domain` foi implementado;
- POM possui apenas dependências necessárias;
- packages foram criados;
- OrderId foi criado;
- TenantId foi criado;
- ProductCode foi criado;
- Quantity foi criada;
- Money foi criado;
- CorrelationId foi criado;
- ExternalOperationId foi criado;
- IdempotencyKey foi criado;
- Money foi testado;
- OrderLine foi criado;
- OrderProcessStatus foi criado;
- ProcessingStep foi criado;
- CompensationStatus foi criado;
- CompensationAction foi criado;
- resultados de estoque foram criados;
- resultados de pagamento foram criados;
- resultados de fulfillment foram criados;
- DomainException foi criado;
- erros específicos foram criados;
- DomainEvent foi criado;
- eventos principais foram criados;
- CancellationEligibilityPolicy foi criada;
- CompensationPlanner foi criado;
- OrderProcess foi criado;
- factory de registro foi criada;
- cálculo do total foi implementado;
- moedas diferentes foram rejeitadas;
- solicitação de estoque foi implementada;
- estoque reservado foi implementado;
- estoque rejeitado foi implementado;
- estoque ambíguo foi implementado;
- solicitação de pagamento foi implementada;
- pagamento autorizado foi implementado;
- pagamento recusado foi implementado;
- início de fulfillment foi implementado;
- conclusão de fulfillment foi implementada;
- cancelamento foi implementado;
- compensações foram implementadas;
- duplicidade externa foi protegida;
- transições usam métodos com intenção;
- pullEvents foi implementado;
- getters defensivos foram usados;
- reconstituição foi separada da criação;
- snapshot inválido foi rejeitado;
- testes de registro foram criados;
- testes de estoque foram criados;
- testes de pagamento foram criados;
- testes de fulfillment foram criados;
- testes de cancelamento foram criados;
- testes de compensação foram criados;
- testes de eventos foram criados;
- teste de arquitetura foi criado;
- build do módulo passou;
- build completo passou;
- nenhuma dependência de framework existe no domínio;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- casos de uso não foram antecipados.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "password|client_secret|access_token|private_key|@Entity|@RestController|@Service|KafkaTemplate"
```

Adicione:

```powershell
git add `
  libs/orderflow-domain `
  reports/domain-implementation-report.yaml `
  contracts/domain-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(domain): implement OrderFlow domain model"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- JPA;
- controllers;
- handlers;
- transaction manager;
- consumers;
- provider clients;
- conteúdo detalhado da aula 680.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou o domínio do OrderFlow.

Você criou:

```text
value objects;

OrderLine;

ProcessingStep;

CompensationAction;

external results;

domain exceptions;

domain events;

CancellationEligibilityPolicy;

CompensationPlanner;

OrderProcess aggregate;

transitions;

duplicate protection;

reconstitution;

unit tests;

architecture tests;

report, evidence e gate.
```

O domínio agora protege:

- pedido com itens;
- moeda única;
- estoque antes de pagamento;
- pagamento antes de fulfillment;
- transições válidas;
- terminalidade;
- cancelamento;
- compensação;
- reconciliação;
- duplicidade externa;
- ausência de framework.

A próxima aula será:

```text
680 - M20.10 - Implementacao casos de uso
```

Nela, você criará commands, handlers, ports, transaction boundary, idempotency coordination, carregamento e salvamento do aggregate, publicação via Outbox e respostas de aplicação.

Nenhum caso de uso foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Implementei value objects.
- [ ] Implementei aggregate.
- [ ] Protegi invariantes.
- [ ] Implementei policies.
- [ ] Implementei eventos.
- [ ] Protegi duplicidade.
- [ ] Implementei compensação.
- [ ] Separei reconstituição.
- [ ] Criei testes.
- [ ] Validei arquitetura.
- [ ] Mantive domínio puro.
- [ ] Preservei casos de uso para a aula 680.

---

## Troubleshooting adicional

### O domínio depende de Spring

Remova annotations e abstrações de framework.

### O teste precisa de contexto Spring

O domínio está acoplado demais.

### O aggregate possui dezenas de setters

Substitua por métodos com intenção.

### A factory de reconstituição publica evento

Separe criação e restauração.

### Resultado duplicado incrementa versão

Retorne sem novo efeito.

### Pagamento recusado lança exception

Modele como resultado funcional.

### Compensação conclui com ação pendente

Mantenha estado de reconciliação.

### O total diverge das linhas

Rejeite o snapshot.

### A lista de eventos é mutável

Retorne cópia e limpe internamente.

### Quero implementar handler

Essa etapa pertence à aula 680.

---

## Perguntas de revisão

1. Por que implementar domínio primeiro?
2. O domínio depende de Spring?
3. O que é value object?
4. O que é aggregate root?
5. Por que evitar setter de status?
6. O que é domain event?
7. Domain event é comando?
8. O que é policy?
9. O que Money protege?
10. O que TenantId protege?
11. OrderLine é entity?
12. Quando estoque pode ser solicitado?
13. Quando pagamento pode ser solicitado?
14. Quando fulfillment pode iniciar?
15. O que acontece no resultado ambíguo?
16. Como duplicidade externa é protegida?
17. O que é compensação?
18. Quando cancelamento falha?
19. O que reconstituição deve fazer?
20. Reconstituição publica evento?
21. O que o teste de arquitetura protege?
22. O que a aula 680 implementará?
23. O que não foi criado nesta aula?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Para proteger regras antes da infraestrutura.
2. Não.
3. Objeto imutável definido por valor.
4. Limite de consistência e comportamento.
5. Para impedir transições inválidas.
6. Fato ocorrido no domínio.
7. Não.
8. Decisão de domínio sem entity natural.
9. Valor, moeda, escala e operações.
10. Identidade e validação de tenant.
11. Value object neste escopo.
12. Após registro.
13. Após estoque reservado.
14. Após estoque e pagamento confirmados.
15. Vai para reconciliação.
16. Por ExternalOperationId aplicado.
17. Ação para reduzir efeitos confirmados.
18. Em estado terminal ou ponto irreversível.
19. Restaurar snapshot válido.
20. Não.
21. Ausência de dependências proibidas.
22. Commands, handlers, ports e transações.
23. API, JPA, consumers e providers.
24. Implementação casos de uso.
25. Domínio impede estados inválidos.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 679 - M20.09 - Implementacao dominio

- Continuei após Configuração repositório profissional.
- Implementei o módulo `orderflow-domain`.
- Configurei o POM do domínio.
- Criei os packages do domínio.
- Implementei OrderId.
- Implementei TenantId.
- Implementei ProductCode.
- Implementei Quantity.
- Implementei Money.
- Testei Money.
- Implementei CorrelationId.
- Implementei ExternalOperationId.
- Implementei IdempotencyKey.
- Implementei OrderLine.
- Implementei OrderProcessStatus.
- Implementei ProcessingStep.
- Implementei CompensationStatus.
- Implementei CompensationAction.
- Implementei resultados de estoque.
- Implementei resultados de pagamento.
- Implementei resultados de fulfillment.
- Implementei DomainException.
- Implementei erros específicos.
- Implementei DomainEvent.
- Implementei eventos principais.
- Implementei CancellationEligibilityPolicy.
- Implementei CompensationPlanner.
- Implementei OrderProcess.
- Implementei factory de registro.
- Implementei cálculo do total.
- Protegi moeda única.
- Implementei reserva de estoque.
- Implementei rejeição de estoque.
- Implementei resultado ambíguo.
- Implementei autorização de pagamento.
- Implementei pagamento recusado.
- Implementei fulfillment.
- Implementei cancelamento.
- Implementei compensações.
- Protegi duplicidade externa.
- Impedi setter de status.
- Implementei pullEvents.
- Usei getters defensivos.
- Separei reconstituição de criação.
- Validei snapshots.
- Criei testes de registro.
- Criei testes de estoque.
- Criei testes de pagamento.
- Criei testes de fulfillment.
- Criei testes de cancelamento.
- Criei testes de compensação.
- Criei testes de eventos.
- Criei teste de arquitetura.
- Executei build do módulo.
- Executei build completo.
- Validei ausência de framework.
- Criei report, evidence e gate.
- Não antecipei os casos de uso.
- Próxima aula: Implementacao casos de uso.
```

---

## Referência técnica curta

- Domain Implementation.
- Value Object.
- Aggregate Root.
- Invariant.
- Domain Event.
- Domain Policy.
- Sealed Interface.
- Immutable Collection.
- State Transition.
- Compensation.
- Reconciliation.
- Reconstitution.
- Architecture Test.
- ArchUnit.
- Java 21.
- JUnit 5.

Regra final:

```text
A implementação do domínio do OrderFlow deve permanecer pura, imutável e orientada a comportamento: value objects protegem identidade, quantidade, dinheiro, tenant, correlação e operações externas; OrderProcess controla registro, estoque, pagamento, fulfillment, cancelamento, compensação e reconciliação por métodos com intenção; invariantes impedem pedido vazio, moeda mista, pagamento sem estoque, fulfillment sem autorização e transições terminais; resultados externos são traduzidos para tipos internos, duplicidades não reaplicam efeitos, falhas ambíguas exigem reconciliação, domain events registram fatos e reconstituição restaura snapshots sem criar novos eventos. Testes unitários e ArchUnit comprovam regras, transições, collections defensivas e ausência de Spring, JPA, Jackson ou Kafka. Commands, handlers, ports e transações permanecem reservados para a aula 680.
```
