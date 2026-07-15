# 680 - M20.10 - Implementacao casos de uso

## Apresentação da aula

Na aula 679, você implementou o domínio do OrderFlow.

O módulo `orderflow-domain` passou a possuir:

- `OrderId`;
- `TenantId`;
- `ProductCode`;
- `Quantity`;
- `Money`;
- `CorrelationId`;
- `ExternalOperationId`;
- `IdempotencyKey`;
- `OrderLine`;
- `ProcessingStep`;
- `CompensationAction`;
- resultados externos traduzidos;
- erros de domínio;
- domain events;
- policies;
- aggregate root `OrderProcess`;
- transições protegidas;
- proteção contra duplicidade;
- reconstituição;
- testes unitários;
- teste arquitetural.

O domínio agora sabe decidir.

Mas ele ainda não sabe coordenar uma solicitação completa.

Por exemplo, registrar um pedido exige mais do que chamar:

```text
OrderProcess.register.
```

O fluxo também precisa:

- validar o comando;
- adquirir a chave idempotente;
- gerar identificadores;
- obter o instante atual;
- abrir uma transação;
- criar o aggregate;
- salvar o aggregate;
- registrar auditoria;
- converter domain events em registros de Outbox;
- concluir a idempotência;
- montar a resposta;
- tratar conflito;
- garantir rollback em falha.

Essas responsabilidades não pertencem ao aggregate.

Elas pertencem à camada de aplicação.

A camada de aplicação coordena o caso de uso sem absorver regras do domínio.

Regra importante:

```text
application decide a ordem;

domain decide a validade.
```

Um application handler não deve possuir lógica como:

```text
se status for X,
entao permitir Y.
```

Essa regra já pertence ao `OrderProcess`.

O handler deve:

```text
carregar;

invocar;

persistir;

publicar de forma confiavel;

responder.
```

Nesta aula, você implementará:

```text
libs/orderflow-application
```

Serão criados:

- commands;
- input ports;
- output ports;
- handlers;
- transaction boundary;
- idempotency coordinator;
- repository port;
- audit port;
- Outbox port;
- clock;
- identifier generator;
- result types;
- application errors;
- fakes;
- testes de casos de uso;
- testes de rollback;
- testes de idempotência;
- testes arquiteturais.

O laboratório será:

```text
labs/m20/aula-680-implementacao-casos-de-uso/orderflow-application-implementation
```

A próxima aula será:

```text
681 - M20.11 - Implementacao persistencia
```

Na aula 681, os ports desta aula receberão adapters concretos para PostgreSQL, JPA, optimistic locking, Idempotency Registry, Outbox, Inbox, auditoria e migrations.

Nesta aula, nenhuma implementação JPA será criada.

Regra central:

```text
um caso de uso profissional
coordena dominio,
transacao,
idempotencia,
persistencia,
auditoria
e eventos

sem mover regras
para fora do aggregate.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
677:
ADRs do projeto.

678:
Configuracao repositorio profissional.

679:
Implementacao dominio.

680:
Implementacao casos de uso.

681:
Implementacao persistencia.

682:
Implementacao API REST.
```

O domínio foi implementado primeiro.

Agora os casos de uso utilizarão esse domínio.

A persistência concreta virá depois.

A API REST virá somente quando a aplicação já possuir contratos internos estáveis.

Essa ordem protege o projeto contra controllers que:

- conhecem JPA;
- controlam transações;
- duplicam regras;
- publicam mensagens diretamente;
- montam entidades;
- possuem lógica de idempotência;
- acessam providers.

A aula 680 cria uma camada de aplicação independente de framework.

Ela pode ser usada depois por:

- API REST;
- consumer de mensageria;
- job;
- ferramenta administrativa;
- teste de integração;
- interface de linha de comando.

---

## Objetivo prático

Será criada a estrutura:

```text
libs/orderflow-application
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── br/com/formacao/orderflow/application
│   │           ├── command
│   │           │   ├── RegisterOrderCommand.java
│   │           │   ├── RequestStockReservationCommand.java
│   │           │   ├── RecordStockReservationResultCommand.java
│   │           │   ├── RequestPaymentAuthorizationCommand.java
│   │           │   ├── RecordPaymentAuthorizationResultCommand.java
│   │           │   ├── StartFulfillmentCommand.java
│   │           │   ├── RecordFulfillmentResultCommand.java
│   │           │   ├── RequestCancellationCommand.java
│   │           │   ├── CompleteCompensationCommand.java
│   │           │   └── ReconcileOrderCommand.java
│   │           ├── error
│   │           │   ├── ApplicationException.java
│   │           │   ├── OrderNotFound.java
│   │           │   ├── IdempotencyConflict.java
│   │           │   ├── IdempotencyInProgress.java
│   │           │   └── ConcurrencyConflict.java
│   │           ├── handler
│   │           │   ├── RegisterOrderHandler.java
│   │           │   ├── RequestStockReservationHandler.java
│   │           │   ├── RecordStockReservationResultHandler.java
│   │           │   ├── RequestPaymentAuthorizationHandler.java
│   │           │   ├── RecordPaymentAuthorizationResultHandler.java
│   │           │   ├── StartFulfillmentHandler.java
│   │           │   ├── RecordFulfillmentResultHandler.java
│   │           │   ├── RequestCancellationHandler.java
│   │           │   ├── CompleteCompensationHandler.java
│   │           │   └── ReconcileOrderHandler.java
│   │           ├── port
│   │           │   ├── in
│   │           │   │   ├── RegisterOrderUseCase.java
│   │           │   │   ├── RequestStockReservationUseCase.java
│   │           │   │   ├── RecordStockReservationResultUseCase.java
│   │           │   │   ├── RequestPaymentAuthorizationUseCase.java
│   │           │   │   ├── RecordPaymentAuthorizationResultUseCase.java
│   │           │   │   ├── StartFulfillmentUseCase.java
│   │           │   │   ├── RecordFulfillmentResultUseCase.java
│   │           │   │   ├── RequestCancellationUseCase.java
│   │           │   │   ├── CompleteCompensationUseCase.java
│   │           │   │   └── ReconcileOrderUseCase.java
│   │           │   └── out
│   │           │       ├── OrderProcessRepository.java
│   │           │       ├── IdempotencyStore.java
│   │           │       ├── OutboxStore.java
│   │           │       ├── AuditStore.java
│   │           │       ├── TransactionManager.java
│   │           │       ├── ApplicationClock.java
│   │           │       ├── IdentifierGenerator.java
│   │           │       └── RequestFingerprint.java
│   │           ├── result
│   │           │   ├── RegisterOrderResult.java
│   │           │   ├── OrderApplicationResult.java
│   │           │   ├── IdempotencyAcquisition.java
│   │           │   └── ApplicationEventEnvelope.java
│   │           └── service
│   │               ├── IdempotencyCoordinator.java
│   │               ├── DomainEventCollector.java
│   │               ├── OrderLoader.java
│   │               └── ApplicationAuditService.java
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/application
│               ├── RegisterOrderHandlerTest.java
│               ├── IdempotentRegisterOrderTest.java
│               ├── RequestStockReservationHandlerTest.java
│               ├── RecordStockResultHandlerTest.java
│               ├── PaymentUseCaseTest.java
│               ├── FulfillmentUseCaseTest.java
│               ├── CancellationUseCaseTest.java
│               ├── TransactionRollbackTest.java
│               ├── ConcurrencyConflictTest.java
│               └── ApplicationArchitectureTest.java
└── target
```

---

## Conceito essencial

### Command representa intenção

Um command possui os dados necessários para iniciar uma ação.

Exemplo:

```text
RegisterOrderCommand.
```

Ele não representa:

- request HTTP;
- entidade JPA;
- evento externo;
- resposta do provider.

O command pertence ao contrato interno da aplicação.

### Input port define capacidade

Um input port descreve o que a aplicação oferece.

Exemplo:

```java
RegisterOrderResult handle(
        RegisterOrderCommand command);
```

Controllers e consumers dependerão desse port.

Eles não dependerão do handler concreto.

### Output port define necessidade

Um output port descreve o que a aplicação precisa.

Exemplos:

- carregar aggregate;
- salvar aggregate;
- adquirir idempotência;
- persistir Outbox;
- registrar auditoria;
- executar transação;
- obter horário;
- gerar identificador.

A infraestrutura implementará esses ports na aula 681.

### Transaction boundary pertence ao caso de uso

A transação deve envolver:

```text
estado autoritativo;

auditoria;

Outbox;

Inbox ou idempotencia
quando aplicavel.
```

Publicação no broker não participa da transação.

A publicação será feita depois pelo Outbox Publisher.

### Idempotência não é apenas unique constraint

A aplicação precisa interpretar estados:

- `ACQUIRED`;
- `COMPLETED`;
- `IN_PROGRESS`;
- `CONFLICT`;
- `EXPIRED`.

Ela precisa saber quando:

- executar;
- devolver resposta anterior;
- bloquear conflito;
- iniciar recovery;
- não repetir efeito.

---

## Mão na massa guiada

### 1. Abrir o módulo de aplicação

Na raiz do repositório:

```powershell
Set-Location `
  libs/orderflow-application
```

Valide:

```powershell
Get-ChildItem
```

---

### 2. Configurar o POM

Arquivo:

```text
libs/orderflow-application/pom.xml
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

    <artifactId>orderflow-application</artifactId>

    <dependencies>
        <dependency>
            <groupId>br.com.formacao</groupId>
            <artifactId>orderflow-domain</artifactId>
            <version>${project.version}</version>
        </dependency>

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

A aplicação depende do domínio.

O domínio não depende da aplicação.

---

### 3. Criar packages

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  src/main/java/br/com/formacao/orderflow/application/command,
  src/main/java/br/com/formacao/orderflow/application/error,
  src/main/java/br/com/formacao/orderflow/application/handler,
  src/main/java/br/com/formacao/orderflow/application/port/in,
  src/main/java/br/com/formacao/orderflow/application/port/out,
  src/main/java/br/com/formacao/orderflow/application/result,
  src/main/java/br/com/formacao/orderflow/application/service,
  src/test/java/br/com/formacao/orderflow/application
```

---

## Commands e resultados

### 4. Implementar RegisterOrderCommand

```java
package br.com.formacao.orderflow.application.command;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.IdempotencyKey;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.ProductCode;
import br.com.formacao.orderflow.domain.value.Quantity;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.List;
import java.util.Objects;

public record RegisterOrderCommand(
        TenantId tenantId,
        IdempotencyKey idempotencyKey,
        CorrelationId correlationId,
        List<Line> lines) {

    public RegisterOrderCommand {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(idempotencyKey);
        Objects.requireNonNull(correlationId);
        lines = List.copyOf(lines);

        if (lines.isEmpty()) {
            throw new IllegalArgumentException(
                    "Register order requires lines");
        }
    }

    public record Line(
            ProductCode productCode,
            Quantity quantity,
            Money unitPrice) {

        public Line {
            Objects.requireNonNull(productCode);
            Objects.requireNonNull(quantity);
            Objects.requireNonNull(unitPrice);
        }
    }
}
```

---

### 5. Implementar RegisterOrderResult

```java
package br.com.formacao.orderflow.application.result;

import br.com.formacao.orderflow.domain.model.OrderProcessStatus;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;

public record RegisterOrderResult(
        TenantId tenantId,
        OrderId orderId,
        OrderProcessStatus status,
        Money total,
        boolean replayed) {
}
```

`replayed` informa que a resposta veio de uma execução idempotente anterior.

---

### 6. Implementar command de pedido existente

```java
package br.com.formacao.orderflow.application.command;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Objects;

public record RequestStockReservationCommand(
        TenantId tenantId,
        OrderId orderId,
        CorrelationId correlationId) {

    public RequestStockReservationCommand {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(orderId);
        Objects.requireNonNull(correlationId);
    }
}
```

Os outros commands seguem o mesmo padrão:

- tenant;
- order;
- correlation;
- dados específicos da ação.

---

### 7. Implementar command de resultado externo

```java
package br.com.formacao.orderflow.application.command;

import br.com.formacao.orderflow.domain.result.StockReservationResult;
import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Objects;

public record RecordStockReservationResultCommand(
        TenantId tenantId,
        OrderId orderId,
        CorrelationId correlationId,
        String messageId,
        String payloadFingerprint,
        StockReservationResult result) {

    public RecordStockReservationResultCommand {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(orderId);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(messageId);
        Objects.requireNonNull(payloadFingerprint);
        Objects.requireNonNull(result);
    }
}
```

A infraestrutura usará `messageId` e fingerprint para Inbox e divergência.

---

## Input ports

### 8. Criar RegisterOrderUseCase

```java
package br.com.formacao.orderflow.application.port.in;

import br.com.formacao.orderflow.application.command.RegisterOrderCommand;
import br.com.formacao.orderflow.application.result.RegisterOrderResult;

public interface RegisterOrderUseCase {

    RegisterOrderResult handle(
            RegisterOrderCommand command);
}
```

---

### 9. Criar ports dos demais casos

Crie interfaces para:

```text
RequestStockReservationUseCase;

RecordStockReservationResultUseCase;

RequestPaymentAuthorizationUseCase;

RecordPaymentAuthorizationResultUseCase;

StartFulfillmentUseCase;

RecordFulfillmentResultUseCase;

RequestCancellationUseCase;

CompleteCompensationUseCase;

ReconcileOrderUseCase.
```

Cada port possui uma única operação principal.

Evite uma interface:

```text
OrderService
```

com dezenas de métodos não relacionados.

---

## Output ports

### 10. Criar OrderProcessRepository

```java
package br.com.formacao.orderflow.application.port.out;

import br.com.formacao.orderflow.domain.model.OrderProcess;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Optional;

public interface OrderProcessRepository {

    Optional<OrderProcess> find(
            TenantId tenantId,
            OrderId orderId);

    void insert(OrderProcess process);

    void update(
            OrderProcess process,
            long expectedVersion);
}
```

`insert` e `update` são separados para tornar conflito explícito.

---

### 11. Criar TransactionManager

```java
package br.com.formacao.orderflow.application.port.out;

import java.util.function.Supplier;

public interface TransactionManager {

    <T> T execute(Supplier<T> operation);

    void execute(Runnable operation);
}
```

A implementação concreta poderá usar Spring Transaction Management na infraestrutura.

A aplicação conhece apenas o contrato.

---

### 12. Criar ApplicationClock

```java
package br.com.formacao.orderflow.application.port.out;

import java.time.Instant;

public interface ApplicationClock {

    Instant now();
}
```

---

### 13. Criar IdentifierGenerator

```java
package br.com.formacao.orderflow.application.port.out;

import br.com.formacao.orderflow.domain.value.OrderId;
import java.util.UUID;

public interface IdentifierGenerator {

    OrderId nextOrderId();

    UUID nextActionId();
}
```

Isso remove geração aleatória de handlers e policies.

---

### 14. Criar AuditStore

```java
package br.com.formacao.orderflow.application.port.out;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;

public interface AuditStore {

    void append(
            TenantId tenantId,
            OrderId orderId,
            String action,
            String previousStatus,
            String newStatus,
            CorrelationId correlationId,
            Instant occurredAt);
}
```

Audit registra decisão da aplicação.

Ele não substitui domain event.

---

### 15. Criar OutboxStore

```java
package br.com.formacao.orderflow.application.port.out;

import br.com.formacao.orderflow.application.result.ApplicationEventEnvelope;
import java.util.List;

public interface OutboxStore {

    void appendAll(
            List<ApplicationEventEnvelope> events);
}
```

---

### 16. Criar ApplicationEventEnvelope

```java
package br.com.formacao.orderflow.application.result;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record ApplicationEventEnvelope(
        UUID eventId,
        TenantId tenantId,
        OrderId aggregateId,
        String eventType,
        int eventVersion,
        CorrelationId correlationId,
        Instant occurredAt,
        Map<String, Object> payload) {

    public ApplicationEventEnvelope {
        payload = Map.copyOf(payload);
    }
}
```

A serialização JSON pertence ao adapter.

---

### 17. Criar IdempotencyStore

```java
package br.com.formacao.orderflow.application.port.out;

import br.com.formacao.orderflow.application.result.IdempotencyAcquisition;
import br.com.formacao.orderflow.domain.value.IdempotencyKey;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;

public interface IdempotencyStore {

    IdempotencyAcquisition acquire(
            TenantId tenantId,
            String operation,
            IdempotencyKey key,
            String requestHash,
            Instant now,
            Instant expiresAt);

    void complete(
            TenantId tenantId,
            String operation,
            IdempotencyKey key,
            String responseFingerprint,
            String serializedResponse,
            Instant completedAt);

    void fail(
            TenantId tenantId,
            String operation,
            IdempotencyKey key,
            String errorCode,
            Instant failedAt);
}
```

---

### 18. Criar IdempotencyAcquisition

```java
package br.com.formacao.orderflow.application.result;

public sealed interface IdempotencyAcquisition {

    record Acquired()
            implements IdempotencyAcquisition {
    }

    record Completed(
            String requestHash,
            String serializedResponse)
            implements IdempotencyAcquisition {
    }

    record InProgress(
            String requestHash)
            implements IdempotencyAcquisition {
    }

    record Conflict(
            String existingRequestHash)
            implements IdempotencyAcquisition {
    }
}
```

---

### 19. Criar RequestFingerprint

```java
package br.com.formacao.orderflow.application.port.out;

public interface RequestFingerprint {

    String calculate(Object request);
}
```

O adapter poderá usar SHA-256 sobre uma representação canônica.

O handler não conhece JSON.

---

## Serviços de aplicação

### 20. Implementar IdempotencyCoordinator

```java
package br.com.formacao.orderflow.application.service;

import br.com.formacao.orderflow.application.error.IdempotencyConflict;
import br.com.formacao.orderflow.application.error.IdempotencyInProgress;
import br.com.formacao.orderflow.application.port.out.IdempotencyStore;
import br.com.formacao.orderflow.application.result.IdempotencyAcquisition;
import br.com.formacao.orderflow.domain.value.IdempotencyKey;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Duration;
import java.time.Instant;

public final class IdempotencyCoordinator {

    private static final Duration PROCESSING_TTL =
            Duration.ofMinutes(5);

    private final IdempotencyStore store;

    public IdempotencyCoordinator(
            IdempotencyStore store) {

        this.store = store;
    }

    public IdempotencyAcquisition acquire(
            TenantId tenantId,
            String operation,
            IdempotencyKey key,
            String requestHash,
            Instant now) {

        IdempotencyAcquisition result =
                store.acquire(
                        tenantId,
                        operation,
                        key,
                        requestHash,
                        now,
                        now.plus(PROCESSING_TTL));

        if (result
                instanceof IdempotencyAcquisition.Conflict) {
            throw new IdempotencyConflict();
        }

        if (result
                instanceof IdempotencyAcquisition.InProgress) {
            throw new IdempotencyInProgress();
        }

        return result;
    }
}
```

---

### 21. Criar erros de aplicação

```java
package br.com.formacao.orderflow.application.error;

public abstract class ApplicationException
        extends RuntimeException {

    private final String code;

    protected ApplicationException(
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

```java
package br.com.formacao.orderflow.application.error;

public final class OrderNotFound
        extends ApplicationException {

    public OrderNotFound() {
        super(
                "ORDER_NOT_FOUND",
                "Order was not found");
    }
}
```

Crie também:

- `IdempotencyConflict`;
- `IdempotencyInProgress`;
- `ConcurrencyConflict`.

---

### 22. Criar OrderLoader

```java
package br.com.formacao.orderflow.application.service;

import br.com.formacao.orderflow.application.error.OrderNotFound;
import br.com.formacao.orderflow.application.port.out.OrderProcessRepository;
import br.com.formacao.orderflow.domain.model.OrderProcess;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;

public final class OrderLoader {

    private final OrderProcessRepository repository;

    public OrderLoader(
            OrderProcessRepository repository) {

        this.repository = repository;
    }

    public OrderProcess required(
            TenantId tenantId,
            OrderId orderId) {

        return repository
                .find(tenantId, orderId)
                .orElseThrow(OrderNotFound::new);
    }
}
```

Toda busca inclui tenant.

---

### 23. Criar DomainEventCollector

Responsabilidades:

- chamar `pullEvents`;
- mapear eventos para envelopes;
- gerar `eventId`;
- preservar tenant;
- preservar aggregate;
- preservar correlation;
- preservar occurredAt;
- definir event version;
- montar payload sanitizado.

Ele não publica no broker.

---

### 24. Criar ApplicationAuditService

Responsabilidades:

- receber estado anterior;
- receber estado posterior;
- registrar apenas mudança relevante;
- usar correlation;
- usar clock;
- evitar dados sensíveis;
- manter action padronizada.

---

## Implementação do registro de pedido

### 25. Criar RegisterOrderHandler

```java
package br.com.formacao.orderflow.application.handler;

import br.com.formacao.orderflow.application.command.RegisterOrderCommand;
import br.com.formacao.orderflow.application.port.in.RegisterOrderUseCase;
import br.com.formacao.orderflow.application.port.out.ApplicationClock;
import br.com.formacao.orderflow.application.port.out.IdentifierGenerator;
import br.com.formacao.orderflow.application.port.out.IdempotencyStore;
import br.com.formacao.orderflow.application.port.out.OrderProcessRepository;
import br.com.formacao.orderflow.application.port.out.OutboxStore;
import br.com.formacao.orderflow.application.port.out.RequestFingerprint;
import br.com.formacao.orderflow.application.port.out.TransactionManager;
import br.com.formacao.orderflow.application.result.IdempotencyAcquisition;
import br.com.formacao.orderflow.application.result.RegisterOrderResult;
import br.com.formacao.orderflow.application.service.DomainEventCollector;
import br.com.formacao.orderflow.application.service.IdempotencyCoordinator;
import br.com.formacao.orderflow.domain.model.OrderLine;
import br.com.formacao.orderflow.domain.model.OrderProcess;
import java.util.List;

public final class RegisterOrderHandler
        implements RegisterOrderUseCase {

    private static final String OPERATION =
            "REGISTER_ORDER";

    private final TransactionManager transactions;
    private final OrderProcessRepository repository;
    private final IdempotencyCoordinator idempotency;
    private final IdempotencyStore idempotencyStore;
    private final RequestFingerprint fingerprint;
    private final IdentifierGenerator identifiers;
    private final ApplicationClock clock;
    private final DomainEventCollector eventCollector;
    private final OutboxStore outbox;

    public RegisterOrderHandler(
            TransactionManager transactions,
            OrderProcessRepository repository,
            IdempotencyCoordinator idempotency,
            IdempotencyStore idempotencyStore,
            RequestFingerprint fingerprint,
            IdentifierGenerator identifiers,
            ApplicationClock clock,
            DomainEventCollector eventCollector,
            OutboxStore outbox) {

        this.transactions = transactions;
        this.repository = repository;
        this.idempotency = idempotency;
        this.idempotencyStore = idempotencyStore;
        this.fingerprint = fingerprint;
        this.identifiers = identifiers;
        this.clock = clock;
        this.eventCollector = eventCollector;
        this.outbox = outbox;
    }
}
```

---

### 26. Implementar fluxo idempotente do handler

Fluxo:

```text
1. calcular request hash;

2. adquirir key;

3. se completed,
desserializar resposta anterior;

4. se acquired,
abrir transacao;

5. criar aggregate;

6. salvar;

7. persistir audit;

8. persistir Outbox;

9. concluir idempotencia;

10. commit;

11. retornar resposta.
```

A serialização da resposta deve ficar em um port específico ou codec de aplicação.

---

### 27. Criar as linhas do domínio

Dentro do handler:

```java
List<OrderLine> lines = command.lines()
        .stream()
        .map(line -> new OrderLine(
                line.productCode(),
                line.quantity(),
                line.unitPrice()))
        .toList();
```

O command já usa value objects, mas o aggregate recebe o modelo de domínio.

---

### 28. Executar transação de registro

Exemplo conceitual completo:

```java
return transactions.execute(() -> {
    var now = clock.now();
    var orderId = identifiers.nextOrderId();

    OrderProcess process =
            OrderProcess.register(
                    orderId,
                    command.tenantId(),
                    lines,
                    now,
                    command.correlationId());

    repository.insert(process);

    outbox.appendAll(
            eventCollector.collect(process));

    RegisterOrderResult result =
            new RegisterOrderResult(
                    command.tenantId(),
                    orderId,
                    process.status(),
                    process.total(),
                    false);

    idempotencyStore.complete(
            command.tenantId(),
            OPERATION,
            command.idempotencyKey(),
            fingerprint.calculate(result),
            result.toString(),
            now);

    return result;
});
```

No laboratório, use um `ApplicationResponseCodec` em vez de `toString` para serialização estável.

---

### 29. Tratar resposta idempotente anterior

Quando `acquire` retornar `Completed`:

- validar request hash;
- desserializar resposta;
- marcar `replayed = true`;
- não abrir nova transação;
- não gerar novo ID;
- não criar aggregate;
- não criar Outbox;
- não registrar novo audit de negócio.

---

### 30. Tratar falha do registro

Se a transação falhar:

- rollback de aggregate;
- rollback de Outbox;
- rollback de audit;
- idempotência passa para `FAILED` ou expira;
- erro é propagado;
- nenhuma resposta de sucesso é armazenada.

O comportamento exato de recuperação será implementado pelo adapter.

---

## Casos de uso sobre pedido existente

### 31. Criar padrão de mutation handler

Todo handler de mutação segue:

```text
begin transaction;

load tenant + order;

capture previous status;

invoke aggregate method;

update with expected version;

append audit;

append Outbox;

commit;

return result.
```

O expected version é capturado antes da mutação.

---

### 32. Implementar RequestStockReservationHandler

Fluxo:

```java
OrderProcess process =
        loader.required(
                command.tenantId(),
                command.orderId());

long expectedVersion = process.version();
String previousStatus =
        process.status().name();

process.requestStockReservation(
        clock.now(),
        command.correlationId());

repository.update(
        process,
        expectedVersion);

audit.recordTransition(
        process,
        previousStatus,
        "REQUEST_STOCK_RESERVATION",
        command.correlationId());

outbox.appendAll(
        eventCollector.collect(process));
```

Tudo acontece na mesma transação.

---

### 33. Implementar RecordStockReservationResultHandler

Responsabilidades adicionais:

- deduplicar mensagem via Inbox port;
- validar fingerprint;
- traduzir resultado já normalizado;
- aplicar ao aggregate;
- salvar;
- persistir Outbox;
- marcar Inbox como processada.

Nesta aula, crie o port:

```text
InboxStore.
```

A implementação concreta virá na aula 681.

---

### 34. Criar InboxStore

```java
package br.com.formacao.orderflow.application.port.out;

import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;

public interface InboxStore {

    boolean tryReceive(
            String consumerName,
            String messageId,
            TenantId tenantId,
            String payloadFingerprint,
            Instant receivedAt);

    void markProcessed(
            String consumerName,
            String messageId,
            String resultCode,
            Instant processedAt);
}
```

Se `tryReceive` retornar `false`, o handler não repete efeito.

Fingerprint divergente precisa produzir finding de reconciliação.

---

### 35. Implementar handlers de pagamento

`RequestPaymentAuthorizationHandler`:

- carrega;
- captura versão;
- chama `requestPaymentAuthorization`;
- atualiza;
- registra audit;
- persiste Outbox.

`RecordPaymentAuthorizationResultHandler`:

- Inbox;
- carrega;
- aplica `Authorized`, `Rejected` ou `Ambiguous`;
- atualiza;
- registra audit;
- persiste Outbox;
- conclui Inbox.

---

### 36. Implementar handlers de fulfillment

`StartFulfillmentHandler`:

- carrega;
- invoca domínio;
- salva;
- Outbox.

`RecordFulfillmentResultHandler`:

- deduplica;
- aplica completed, failed ou ambiguous;
- salva;
- registra;
- Outbox;
- Inbox.

Nenhum handler chama provider diretamente.

---

### 37. Implementar RequestCancellationHandler

Command:

- tenant;
- order;
- reason;
- correlation.

Handler:

- carrega;
- captura versão;
- obtém clock;
- invoca policy e planner;
- salva;
- registra audit;
- persiste eventos;
- retorna estado e compensações planejadas.

---

### 38. Implementar CompleteCompensationHandler

Responsabilidades:

- deduplicar resultado externo;
- encontrar ação;
- concluir, falhar ou marcar ambígua;
- atualizar aggregate;
- persistir novos eventos;
- atualizar Inbox;
- retornar estado.

---

### 39. Implementar ReconcileOrderHandler

Reconciliation é iniciada por:

- timeout ambíguo;
- payload divergente;
- compensação incerta;
- resultado fora de ordem.

O handler deve:

- carregar aggregate;
- aplicar resultado reconciliado;
- registrar audit;
- persistir;
- gerar eventos;
- deixar trilha explícita.

Ele não consulta provider diretamente.

A consulta é responsabilidade do Integration Gateway.

---

## Concorrência e erros

### 40. Mapear version conflict

O repository port pode lançar:

```text
ConcurrencyConflict.
```

O handler não deve repetir automaticamente qualquer comando.

Estratégia:

- comandos naturalmente idempotentes podem ser recarregados;
- comandos com efeito externo exigem análise;
- resultado externo duplicado usa Inbox;
- conflito é registrado em telemetry;
- resposta é previsível.

---

### 41. Evitar retry dentro da transação

Não faça:

```text
catch conflict;
loop infinito;
recarregar;
tentar novamente.
```

Retry precisa considerar:

- natureza do comando;
- idempotência;
- efeito externo;
- deadline;
- quantidade máxima;
- observabilidade.

---

### 42. Criar OrderApplicationResult

```java
package br.com.formacao.orderflow.application.result;

import br.com.formacao.orderflow.domain.model.OrderProcessStatus;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;

public record OrderApplicationResult(
        TenantId tenantId,
        OrderId orderId,
        OrderProcessStatus status,
        long version) {
}
```

Ele é resposta interna.

A API criará DTO próprio na aula 682.

---

## Testes com fakes

### 43. Criar InMemoryOrderProcessRepository

O fake deve:

- armazenar por tenant e order;
- distinguir insert e update;
- validar expected version;
- simular conflict;
- manter cópia isolada;
- permitir inspeção no teste.

Não use banco em teste unitário de aplicação.

---

### 44. Criar FakeTransactionManager

O fake registra:

- quantidade de transações;
- commit;
- rollback;
- ordem das operações;
- falha injetada.

Ele permite comprovar que Outbox e aggregate participam da mesma boundary lógica.

---

### 45. Criar FakeIdempotencyStore

Cenários configuráveis:

- acquired;
- completed;
- in progress;
- conflict;
- failure.

Ele também registra chamadas a `complete` e `fail`.

---

### 46. Criar FakeOutboxStore e FakeAuditStore

`FakeOutboxStore` registra envelopes.

`FakeAuditStore` registra transições.

Os testes devem validar conteúdo, não apenas quantidade.

---

### 47. Testar registro de pedido

Cenário:

- command válido;
- key adquirida;
- clock fixo;
- ID fixo;
- transaction executada;
- aggregate inserido;
- Outbox criada;
- idempotência concluída;
- resposta correta.

---

### 48. Testar replay idempotente

Cenário:

- key já `COMPLETED`;
- mesmo hash;
- resposta anterior existente.

Valide:

- `replayed = true`;
- repository não chamado;
- identifier não chamado;
- Outbox não chamada;
- transaction não aberta.

---

### 49. Testar conflito idempotente

Cenário:

- mesma key;
- hash diferente.

Resultado:

```text
IDEMPOTENCY_CONFLICT.
```

Nenhuma mudança é persistida.

---

### 50. Testar transação com falha de Outbox

Cenário:

- aggregate salvo;
- Outbox falha antes do commit.

Resultado esperado no fake transacional:

- rollback;
- aggregate não visível;
- idempotência não concluída;
- resposta não retornada.

---

### 51. Testar pedido inexistente

Qualquer handler de pedido existente recebe tenant e order não encontrados.

Resultado:

```text
ORDER_NOT_FOUND.
```

Nenhum audit ou Outbox é criado.

---

### 52. Testar tenant incorreto

Existe pedido com mesmo `orderId` em outro tenant.

A busca por tenant não retorna o recurso.

Resultado:

```text
ORDER_NOT_FOUND.
```

Não revele existência em outro tenant.

---

### 53. Testar version conflict

Cenário:

- handler carrega version 3;
- update encontra version 4.

Resultado:

```text
CONCURRENCY_CONFLICT.
```

Nenhum evento é publicado pelo Outbox Publisher porque a transação não conclui.

---

### 54. Testar mensagem duplicada

`InboxStore.tryReceive` retorna `false`.

Valide:

- aggregate não é carregado;
- nenhuma transição;
- nenhuma Outbox;
- retorno idempotente de consumo;
- mensagem não causa erro operacional.

---

### 55. Testar pagamento recusado

Fluxo:

- pedido com estoque reservado;
- solicitação de pagamento;
- resultado `Rejected`;
- status `COMPENSATING`;
- compensação criada;
- eventos persistidos;
- Inbox concluída;
- audit correto.

Esse teste conecta a aula 679 ao caso de uso real.

---

### 56. Criar teste arquitetural

```java
package br.com.formacao.orderflow.application;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(
        packages =
                "br.com.formacao.orderflow.application")
class ApplicationArchitectureTest {

    @ArchTest
    static final ArchRule APPLICATION_HAS_NO_ADAPTERS =
            noClasses()
                    .should()
                    .dependOnClassesThat()
                    .resideInAnyPackage(
                            "org.springframework..",
                            "jakarta.persistence..",
                            "org.apache.kafka..",
                            "com.fasterxml.jackson..");

    @ArchTest
    static final ArchRule PORTS_DO_NOT_DEPEND_ON_HANDLERS =
            noClasses()
                    .that()
                    .resideInAPackage("..port..")
                    .should()
                    .dependOnClassesThat()
                    .resideInAPackage("..handler..");
}
```

---

### 57. Executar testes do módulo

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-application `
  -am `
  clean `
  test
```

Resultado esperado:

```text
BUILD SUCCESS.
```

---

### 58. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

O domínio e a aplicação devem permanecer verdes.

---

### 59. Validar dependências proibidas

```powershell
Get-ChildItem `
  libs/orderflow-application/src/main `
  -Recurse `
  -Filter *.java `
| Select-String `
    -Pattern `
    "org.springframework|jakarta.persistence|org.apache.kafka|com.fasterxml.jackson"
```

Resultado esperado:

```text
nenhuma ocorrencia.
```

---

### 60. Criar report de aplicação

Arquivo:

```text
reports/application-use-case-report.yaml
```

Exemplo:

```yaml
applicationUseCases:
  module:
    orderflow-application

  inputPorts:
    total:
      10

  outputPorts:
    total:
      10

  handlers:
    total:
      10

  idempotentUseCases:
    total:
      4

  transactionalUseCases:
    total:
      10

  tests:
    unit:
      36
    architecture:
      2
    failures:
      0

  frameworkDependencies:
    total:
      0

  persistenceAdapters:
    implemented:
      false

  gate:
    PASS
```

---

### 61. Criar evidence

Arquivo:

```text
contracts/application-use-case-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- command count;
- input port count;
- output port count;
- handler count;
- transactional handler count;
- idempotent handler count;
- Inbox-aware handler count;
- application error count;
- unit test count;
- architecture test count;
- test failure count;
- rollback test status;
- idempotency replay test status;
- idempotency conflict test status;
- tenant isolation test status;
- concurrency conflict test status;
- framework dependency count;
- persistence adapter implemented;
- documentation status;
- gate status;
- timestamp.

---

### 62. Criar gate dos casos de uso

Status:

```text
PASS;

FAIL_APPLICATION_MODULE;

FAIL_COMMAND;

FAIL_INPUT_PORT;

FAIL_OUTPUT_PORT;

FAIL_HANDLER;

FAIL_TRANSACTION_BOUNDARY;

FAIL_IDEMPOTENCY;

FAIL_INBOX_COORDINATION;

FAIL_REPOSITORY_COORDINATION;

FAIL_OUTBOX_COORDINATION;

FAIL_AUDIT_COORDINATION;

FAIL_APPLICATION_ERROR;

FAIL_TENANT_SCOPE;

FAIL_CONCURRENCY_HANDLING;

FAIL_ROLLBACK;

FAIL_FRAMEWORK_DEPENDENCY;

FAIL_UNIT_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_PERSISTENCE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 63. Executar validação final

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

- domínio verde;
- aplicação verde;
- ports completos;
- handlers transacionais;
- idempotência testada;
- Inbox testada;
- rollback testado;
- nenhum adapter concreto.

---

### 64. Encerrar o laboratório

Confirme:

- POM;
- packages;
- commands;
- input ports;
- output ports;
- handlers;
- transaction boundary;
- idempotency coordinator;
- repository port;
- Inbox port;
- Outbox port;
- audit port;
- clock;
- identifier generator;
- errors;
- results;
- fakes;
- unit tests;
- architecture tests;
- report;
- evidence;
- gate aprovado;
- persistência não implementada.

---

## Entendendo o que foi feito

### O domínio ganhou coordenação

Handlers transformam intenções externas em chamadas seguras ao aggregate.

### A aplicação permaneceu independente

Nenhum framework ou adapter concreto entrou no módulo.

### Transações ganharam boundary explícita

Aggregate, audit, Inbox, idempotência e Outbox podem ser persistidos atomicamente.

### Idempotência ganhou comportamento

A aplicação distingue execução nova, replay, conflito e processamento em andamento.

### Mensagens ganharam deduplicação

Handlers de resultados usam Inbox antes de alterar o aggregate.

### Erros ficaram previsíveis

Not found, conflito idempotente e conflito de concorrência possuem semântica própria.

### A persistência permaneceu adiada

Os ports estão prontos.

A aula 681 implementará PostgreSQL e JPA.

---

## Erros comuns importantes

### Regra de domínio no handler

A aplicação deve coordenar, não decidir invariantes.

### Handler dependendo de controller

A direção de dependência fica invertida.

### Publicação direta no broker

Estado e evento podem divergir.

### Transaction annotation no contrato

O port fica acoplado ao framework.

### Idempotência somente no controller

Consumers e outros adapters ficam desprotegidos.

### Retry automático de version conflict

Efeito externo pode ser repetido.

### Busca sem tenant

Isolamento fica incompleto.

### Inbox depois da mutação

Mensagem duplicada pode reaplicar efeito.

### Resposta HTTP dentro da aplicação

A camada perde reutilização.

### Implementar JPA nesta aula

Persistência pertence à aula 681.

---

## Comandos úteis

### Testar aplicação

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-application `
  -am `
  test
```

### Executar teste específico

```powershell
.\mvnw.cmd `
  -pl `
  libs/orderflow-application `
  -Dtest=RegisterOrderHandlerTest `
  test
```

### Build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Procurar framework

```powershell
Get-ChildItem `
  libs/orderflow-application/src/main `
  -Recurse `
  -Filter *.java `
| Select-String `
    -Pattern `
    "springframework|persistence|kafka|jackson"
```

---

## Exercício guiado

Implemente o caso de uso:

```text
pagamento recusado
apos estoque reservado.
```

Inclua:

1. command;
2. input port;
3. handler;
4. Inbox;
5. OrderLoader;
6. expected version;
7. chamada ao aggregate;
8. repository update;
9. audit;
10. Outbox;
11. Inbox processed;
12. transaction boundary;
13. resposta;
14. teste de sucesso;
15. teste de duplicidade;
16. teste de rollback;
17. teste de version conflict;
18. evidence.

Não implemente JPA.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 679 e ponte para a aula 681 foram preservadas;
- módulo `orderflow-application` foi implementado;
- POM depende do domínio;
- packages foram criados;
- RegisterOrderCommand foi criado;
- RegisterOrderResult foi criado;
- commands de pedido existente foram criados;
- commands de resultado externo foram criados;
- input ports foram criados;
- OrderProcessRepository foi criado;
- TransactionManager foi criado;
- ApplicationClock foi criado;
- IdentifierGenerator foi criado;
- AuditStore foi criado;
- OutboxStore foi criado;
- ApplicationEventEnvelope foi criado;
- IdempotencyStore foi criado;
- IdempotencyAcquisition foi criado;
- RequestFingerprint foi criado;
- IdempotencyCoordinator foi criado;
- erros de aplicação foram criados;
- OrderLoader foi criado;
- DomainEventCollector foi definido;
- ApplicationAuditService foi definido;
- RegisterOrderHandler foi criado;
- fluxo idempotente foi implementado;
- criação das linhas foi implementada;
- transação de registro foi definida;
- replay idempotente foi tratado;
- falha transacional foi tratada;
- mutation handler pattern foi definido;
- RequestStockReservationHandler foi criado;
- RecordStockReservationResultHandler foi criado;
- InboxStore foi criado;
- handlers de pagamento foram criados;
- handlers de fulfillment foram criados;
- RequestCancellationHandler foi criado;
- CompleteCompensationHandler foi criado;
- ReconcileOrderHandler foi criado;
- version conflict foi tratado;
- retry automático foi evitado;
- OrderApplicationResult foi criado;
- fakes foram criados;
- registro foi testado;
- replay foi testado;
- conflito idempotente foi testado;
- rollback por falha de Outbox foi testado;
- pedido inexistente foi testado;
- tenant incorreto foi tratado como not found;
- version conflict foi testado;
- mensagem duplicada foi testada;
- pagamento recusado foi testado;
- teste arquitetural foi criado;
- build do módulo passou;
- build completo passou;
- nenhuma dependência de framework existe na aplicação;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- persistência concreta não foi antecipada.

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

Adicione:

```powershell
git add `
  libs/orderflow-application `
  reports/application-use-case-report.yaml `
  contracts/application-use-case-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "password|client_secret|access_token|private_key|@Entity|JpaRepository|EntityManager|JdbcTemplate|@RestController"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(application): implement OrderFlow use cases"
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

- JPA entities;
- repositories concretos;
- SQL;
- migrations;
- controllers;
- request DTOs;
- conteúdo detalhado da aula 681.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou os casos de uso do OrderFlow.

Você criou:

```text
commands;

input ports;

output ports;

handlers;

transaction boundary;

idempotency coordinator;

repository port;

Inbox port;

Outbox port;

audit port;

clock;

identifier generator;

application errors;

application results;

fakes;

unit tests;

architecture tests;

report, evidence e gate.
```

A aplicação agora coordena:

- registro idempotente;
- reserva de estoque;
- pagamento;
- fulfillment;
- cancelamento;
- compensação;
- reconciliação;
- auditoria;
- Outbox;
- Inbox;
- concorrência.

A próxima aula será:

```text
681 - M20.11 - Implementacao persistencia
```

Nela, você implementará os adapters concretos de PostgreSQL e JPA, incluindo aggregate mapping, optimistic locking, Idempotency Registry, Outbox, Inbox, audit, migrations e testes com banco real em container.

Nenhuma persistência concreta foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei commands.
- [ ] Criei input ports.
- [ ] Criei output ports.
- [ ] Criei handlers.
- [ ] Criei transaction boundary.
- [ ] Implementei idempotência.
- [ ] Implementei Inbox.
- [ ] Coordenei Outbox.
- [ ] Coordenei audit.
- [ ] Tratei concorrência.
- [ ] Criei fakes.
- [ ] Criei testes.
- [ ] Mantive aplicação sem framework.
- [ ] Preservei persistência para a aula 681.

---

## Troubleshooting adicional

### O handler possui muitos `if`

Verifique se regras de domínio vazaram.

### O port possui tipo HTTP

Substitua por command ou result interno.

### O teste precisa de Spring

Use fakes para teste unitário.

### O replay cria novo order ID

Retorne a resposta anterior antes da transação.

### A Outbox é gravada depois do commit

Inclua no mesmo transaction boundary.

### A Inbox é verificada tarde

Deduplicate antes de carregar e alterar o aggregate.

### O handler chama provider

Produza evento ou use um port de aplicação apropriado.

### O conflito de versão é ignorado

Mapeie para erro previsível.

### O tenant não aparece na busca

Corrija o repository port.

### Quero criar entity JPA

Essa etapa pertence à aula 681.

---

## Perguntas de revisão

1. Qual papel da camada de aplicação?
2. Qual papel do domínio?
3. O que é command?
4. O que é input port?
5. O que é output port?
6. Por que o handler não depende do controller?
7. O que entra na transação?
8. O broker entra na transação?
9. O que é IdempotencyAcquisition?
10. O que significa `Completed`?
11. O que significa `Conflict`?
12. O que é Inbox?
13. Quando verificar Inbox?
14. Por que usar tenant na busca?
15. O que OrderLoader faz?
16. O que DomainEventCollector faz?
17. Por que criar envelope?
18. O que é version conflict?
19. Retry sempre é seguro?
20. Por que usar fakes?
21. A aplicação usa Spring?
22. O que a aula 681 fará?
23. O que não foi implementado nesta aula?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Coordenar casos de uso.
2. Proteger regras e invariantes.
3. Intenção interna da aplicação.
4. Capacidade oferecida.
5. Necessidade externa abstrata.
6. Para preservar direção de dependência.
7. Estado, audit, Outbox, Inbox e idempotência.
8. Não.
9. Resultado da aquisição idempotente.
10. Resposta anterior disponível.
11. Key reutilizada com conteúdo diferente.
12. Registro durável de consumo.
13. Antes da mutação.
14. Para isolamento multi-tenant.
15. Carrega ou lança not found.
16. Converte domain events para Outbox.
17. Para persistência e publicação estáveis.
18. Snapshot desatualizado.
19. Não.
20. Para testar coordenação sem infraestrutura.
21. Não.
22. Implementar persistência.
23. JPA, SQL, migrations e API.
24. Implementação persistência.
25. Application coordena; domain decide.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 680 - M20.10 - Implementacao casos de uso

- Continuei após Implementação domínio.
- Implementei o módulo `orderflow-application`.
- Configurei o POM da aplicação.
- Criei packages.
- Criei RegisterOrderCommand.
- Criei RegisterOrderResult.
- Criei commands de pedido existente.
- Criei commands de resultados externos.
- Criei input ports.
- Criei OrderProcessRepository.
- Criei TransactionManager.
- Criei ApplicationClock.
- Criei IdentifierGenerator.
- Criei AuditStore.
- Criei OutboxStore.
- Criei ApplicationEventEnvelope.
- Criei IdempotencyStore.
- Criei IdempotencyAcquisition.
- Criei RequestFingerprint.
- Criei IdempotencyCoordinator.
- Criei erros de aplicação.
- Criei OrderLoader.
- Criei DomainEventCollector.
- Criei ApplicationAuditService.
- Criei RegisterOrderHandler.
- Implementei fluxo idempotente.
- Implementei criação de linhas.
- Defini transaction boundary do registro.
- Tratei replay idempotente.
- Tratei falha transacional.
- Defini mutation handler pattern.
- Criei RequestStockReservationHandler.
- Criei RecordStockReservationResultHandler.
- Criei InboxStore.
- Criei handlers de pagamento.
- Criei handlers de fulfillment.
- Criei RequestCancellationHandler.
- Criei CompleteCompensationHandler.
- Criei ReconcileOrderHandler.
- Tratei version conflict.
- Evitei retry automático inseguro.
- Criei OrderApplicationResult.
- Criei repository fake.
- Criei transaction fake.
- Criei idempotency fake.
- Criei Outbox e audit fakes.
- Testei registro.
- Testei replay.
- Testei conflito idempotente.
- Testei rollback.
- Testei pedido inexistente.
- Testei isolamento por tenant.
- Testei version conflict.
- Testei mensagem duplicada.
- Testei pagamento recusado.
- Criei teste arquitetural.
- Executei build do módulo.
- Executei build completo.
- Validei ausência de framework.
- Criei report, evidence e gate.
- Não antecipei persistência concreta.
- Próxima aula: Implementacao persistencia.
```

---

## Referência técnica curta

- Application Layer.
- Use Case.
- Command.
- Input Port.
- Output Port.
- Handler.
- Transaction Boundary.
- Idempotency.
- Idempotency Replay.
- Inbox.
- Outbox.
- Audit.
- Optimistic Concurrency.
- Fake.
- Architecture Test.
- Hexagonal Architecture.
- Clean Architecture.

Regra final:

```text
A implementação dos casos de uso do OrderFlow deve coordenar o domínio sem copiar suas regras: commands carregam tenant, identidade, correlation e dados da intenção, input ports expõem capacidades para adapters de entrada, output ports abstraem repository, transaction manager, clock, identifiers, fingerprint, idempotency, Inbox, Outbox e audit, handlers carregam o aggregate por tenant e order, capturam expected version, invocam métodos de domínio, persistem estado, audit e Outbox na mesma transação e retornam resultados internos; RegisterOrderHandler calcula fingerprint, adquire Idempotency Registry, devolve resposta anterior em replay sem nova transação, rejeita key conflitante, cria ID e aggregate somente quando adquirido, persiste eventos e conclui idempotência apenas no sucesso, handlers de resultados externos usam Inbox antes da mutação, fingerprint divergente inicia reconciliação, version conflict não recebe retry cego, providers nunca são chamados pelo handler, DomainEventCollector converte fatos para envelopes sem publicar, OrderLoader nunca busca sem tenant, erros de aplicação distinguem not found, idempotency conflict, in progress e concurrency conflict, testes com fakes comprovam registro, replay, conflito, rollback, isolamento, duplicidade, pagamento recusado e atomicidade lógica, e ArchUnit impede dependências de Spring, JPA, Kafka e Jackson; o gate termina com commands, ports, handlers, transaction boundaries, idempotency, Inbox, Outbox, audit, errors, results, fakes, tests, reports e evidence aprovados, enquanto entities JPA, repositories concretos, migrations, PostgreSQL e Testcontainers permanecem reservados para a aula 681.
```
