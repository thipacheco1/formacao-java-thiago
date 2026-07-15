# 684 - M20.14 - Implementacao integracoes

## Apresentação da aula

Na aula 683, você implementou a segurança do OrderFlow.

A API passou a possuir:

- OAuth2 Resource Server;
- validação de issuer;
- validação de audience;
- validação de expiração;
- tenant derivado da claim;
- scopes;
- roles;
- policies;
- method security;
- proteção contra IDOR;
- workload identity;
- audit de segurança;
- Problem Details para `401` e `403`;
- OpenAPI protegido;
- testes de autenticação;
- testes de autorização;
- testes multi-tenant.

O próximo passo é conectar o OrderFlow aos sistemas externos que participam da jornada.

O projeto final possui três providers principais:

```text
Stock Provider;

Payment Provider;

Fulfillment Provider.
```

Esses sistemas possuem responsabilidades diferentes.

O Stock Provider:

- reserva estoque;
- libera estoque;
- consulta situação de uma operação.

O Payment Provider:

- autoriza pagamento;
- reverte autorização;
- consulta situação de uma operação.

O Fulfillment Provider:

- inicia fulfillment;
- cancela fulfillment;
- consulta situação de uma operação.

O domínio não deve conhecer:

- endpoint;
- JSON externo;
- header do provider;
- status HTTP;
- timeout técnico;
- SDK;
- token de workload;
- código proprietário;
- formato de erro;
- retry;
- circuit breaker.

Esses detalhes pertencem ao Integration Gateway.

O Integration Gateway funciona como uma Anti-Corruption Layer.

Ele recebe um contrato interno do OrderFlow, chama o provider e devolve um resultado normalizado.

Exemplo:

```text
HTTP 409 STOCK_ALREADY_RESERVED
```

pode ser normalizado para:

```text
StockReservationResult.Reserved
```

quando o provider comprova que a mesma operação já foi concluída.

Outro exemplo:

```text
HTTP 504
```

não significa automaticamente rejeição.

Pode significar:

```text
resultado ambiguo.
```

A operação externa pode ter sido executada, mas a resposta não chegou.

Nesse caso, o resultado correto é:

```text
Ambiguous.
```

e o OrderFlow entra em reconciliação.

Nesta aula, você implementará:

```text
apps/integration-gateway
```

O foco será:

- ports internos de integração;
- contracts normalizados;
- clients HTTP;
- workload token provider;
- headers técnicos;
- deadlines;
- timeout;
- retry seguro;
- circuit breaker;
- bulkhead;
- rate limit local;
- idempotência externa;
- normalização de respostas;
- error taxonomy;
- contract tests;
- WireMock;
- testes de resiliência;
- observabilidade;
- evidence.

A mensageria ainda não será implementada.

O Integration Gateway será chamado por uma interface interna de execução.

Na aula 685, essa interface será conectada ao broker, com consumers, producers, topics, schemas, ordering, retry topics, dead letter queue e Inbox.

O laboratório será:

```text
labs/m20/aula-684-implementacao-integracoes/orderflow-integration-gateway
```

A próxima aula será:

```text
685 - M20.15 - Implementacao mensageria
```

Regra central:

```text
provider externo
nao entra no dominio;

o Integration Gateway
traduz contratos,
controla resiliencia
e devolve resultados
normalizados.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
681:
Implementacao persistencia.

682:
Implementacao API REST.

683:
Implementacao seguranca.

684:
Implementacao integracoes.

685:
Implementacao mensageria.

686:
Implementacao observabilidade.
```

A API já recebe comandos protegidos.

Os casos de uso já produzem eventos de integração na Outbox.

A persistência já armazena esses eventos.

Agora os adapters externos serão implementados.

Porém, o caminho:

```text
Outbox
-> broker
-> Integration Gateway
```

será implementado apenas na aula 685.

Nesta aula, será criada uma porta interna:

```text
ProviderOperationExecutor
```

Ela permitirá testar cada integração sem depender de mensageria.

Essa decisão mantém o foco:

```text
684:
contratos e resiliencia externa.

685:
transporte assincrono.
```

---

## Objetivo prático

Será criada a estrutura:

```text
apps/integration-gateway
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/orderflow/integration
│   │   │       ├── IntegrationGatewayApplication.java
│   │   │       ├── config
│   │   │       │   ├── IntegrationConfiguration.java
│   │   │       │   ├── ProviderProperties.java
│   │   │       │   ├── ResilienceConfiguration.java
│   │   │       │   └── HttpClientConfiguration.java
│   │   │       ├── contract
│   │   │       │   ├── ProviderOperation.java
│   │   │       │   ├── ProviderOperationType.java
│   │   │       │   ├── ProviderOperationResult.java
│   │   │       │   ├── StockOperation.java
│   │   │       │   ├── PaymentOperation.java
│   │   │       │   ├── FulfillmentOperation.java
│   │   │       │   ├── NormalizedProviderError.java
│   │   │       │   └── ProviderResultStatus.java
│   │   │       ├── port
│   │   │       │   ├── ProviderOperationExecutor.java
│   │   │       │   ├── StockProviderPort.java
│   │   │       │   ├── PaymentProviderPort.java
│   │   │       │   ├── FulfillmentProviderPort.java
│   │   │       │   ├── WorkloadTokenProvider.java
│   │   │       │   └── ProviderClock.java
│   │   │       ├── client
│   │   │       │   ├── stock
│   │   │       │   │   ├── HttpStockProviderClient.java
│   │   │       │   │   ├── StockProviderApi.java
│   │   │       │   │   ├── StockProviderMapper.java
│   │   │       │   │   └── StockProviderResponse.java
│   │   │       │   ├── payment
│   │   │       │   │   ├── HttpPaymentProviderClient.java
│   │   │       │   │   ├── PaymentProviderApi.java
│   │   │       │   │   ├── PaymentProviderMapper.java
│   │   │       │   │   └── PaymentProviderResponse.java
│   │   │       │   └── fulfillment
│   │   │       │       ├── HttpFulfillmentProviderClient.java
│   │   │       │       ├── FulfillmentProviderApi.java
│   │   │       │       ├── FulfillmentProviderMapper.java
│   │   │       │       └── FulfillmentProviderResponse.java
│   │   │       ├── service
│   │   │       │   ├── DefaultProviderOperationExecutor.java
│   │   │       │   ├── ProviderRequestFactory.java
│   │   │       │   ├── ProviderResponseNormalizer.java
│   │   │       │   ├── ExternalIdempotencyPolicy.java
│   │   │       │   ├── ProviderDeadlinePolicy.java
│   │   │       │   └── ProviderTelemetry.java
│   │   │       └── error
│   │   │           ├── ProviderClientException.java
│   │   │           ├── ProviderAuthenticationException.java
│   │   │           ├── ProviderRateLimitException.java
│   │   │           ├── ProviderContractException.java
│   │   │           └── ProviderUnavailableException.java
│   │   └── resources
│   │       ├── application.yml
│   │       └── application-test.yml
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/integration
│               ├── StockProviderContractTest.java
│               ├── PaymentProviderContractTest.java
│               ├── FulfillmentProviderContractTest.java
│               ├── ProviderTimeoutTest.java
│               ├── ProviderRetryTest.java
│               ├── ProviderCircuitBreakerTest.java
│               ├── ProviderIdempotencyTest.java
│               ├── ProviderAmbiguousResultTest.java
│               ├── WorkloadAuthenticationTest.java
│               ├── IntegrationTelemetryTest.java
│               └── IntegrationArchitectureTest.java
└── target
```

Documentação:

```text
docs/integrations
├── INTEGRATION_CHARTER.md
├── PROVIDER_CONTRACT_CATALOG.md
├── PROVIDER_ERROR_TAXONOMY.md
├── DEADLINE_POLICY.md
├── RETRY_POLICY.md
├── CIRCUIT_BREAKER_POLICY.md
├── EXTERNAL_IDEMPOTENCY_POLICY.md
├── WORKLOAD_AUTHENTICATION.md
├── CONTRACT_TEST_MATRIX.md
├── INTEGRATION_RISK_REGISTER.md
├── INTEGRATION_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Integração é uma boundary

O domínio fala:

```text
Reserved;

Rejected;

Ambiguous.
```

O provider pode falar:

```text
200;

409;

422;

500;

504;

STK-001;

PAY-908;

FUL-300.
```

O mapper traduz o contrato externo para o vocabulário interno.

### Retry não é sempre seguro

Retry pode repetir efeito externo.

Por isso, toda operação precisa ser classificada:

```text
idempotente;

idempotente com key;

nao idempotente;

consulta.
```

Reserva de estoque e autorização de pagamento devem usar uma chave externa estável.

### Timeout pode produzir ambiguidade

Um timeout significa:

```text
nao recebemos resposta
dentro do deadline.
```

Ele não prova que o provider não executou.

### Circuit breaker protege o sistema

Quando um provider falha repetidamente, novas chamadas podem ser bloqueadas temporariamente.

Isso evita:

- consumo de threads;
- fila crescente;
- cascata de timeouts;
- pressão adicional no provider;
- latência imprevisível.

### Contract test protege mapeamento

O teste de contrato valida:

- request;
- headers;
- status;
- body;
- error mapping;
- idempotency;
- timeout;
- compatibilidade.

---

## Mão na massa guiada

### 1. Configurar o módulo

No `apps/integration-gateway/pom.xml`, adicione dependências para:

- `orderflow-domain`;
- `orderflow-application`;
- Spring Boot;
- Spring Web;
- OAuth2 Client;
- Resilience4j;
- Micrometer;
- WireMock;
- JUnit 5;
- ArchUnit.

O Gateway não depende de JPA.

---

### 2. Criar aplicação Spring Boot

```java
package br.com.formacao.orderflow.integration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages =
                "br.com.formacao.orderflow.integration")
public class IntegrationGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                IntegrationGatewayApplication.class,
                args);
    }
}
```

---

### 3. Criar Integration Charter

Arquivo:

```text
docs/integrations/INTEGRATION_CHARTER.md
```

Princípios:

```text
provider contracts stay outside domain;

every write uses external idempotency;

deadline is explicit;

retry requires safety classification;

timeout can be ambiguous;

circuit breaker protects capacity;

workloads authenticate independently;

telemetry never exposes secrets;

messaging belongs to lesson 685.
```

---

### 4. Criar ProviderOperationType

```java
package br.com.formacao.orderflow.integration.contract;

public enum ProviderOperationType {
    RESERVE_STOCK,
    RELEASE_STOCK,
    AUTHORIZE_PAYMENT,
    REVERSE_PAYMENT,
    START_FULFILLMENT,
    CANCEL_FULFILLMENT,
    QUERY_OPERATION
}
```

---

### 5. Criar ProviderOperation

```java
package br.com.formacao.orderflow.integration.contract;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;

public record ProviderOperation(
        TenantId tenantId,
        OrderId orderId,
        ProviderOperationType type,
        ExternalOperationId operationId,
        CorrelationId correlationId,
        Instant deadline,
        Map<String, Object> payload) {

    public ProviderOperation {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(orderId);
        Objects.requireNonNull(type);
        Objects.requireNonNull(operationId);
        Objects.requireNonNull(correlationId);
        Objects.requireNonNull(deadline);
        payload = Map.copyOf(payload);
    }
}
```

---

### 6. Criar ProviderResultStatus

```java
package br.com.formacao.orderflow.integration.contract;

public enum ProviderResultStatus {
    SUCCESS,
    REJECTED,
    AMBIGUOUS,
    UNAVAILABLE,
    INVALID_CONTRACT,
    AUTHENTICATION_FAILED,
    RATE_LIMITED
}
```

---

### 7. Criar ProviderOperationResult

```java
package br.com.formacao.orderflow.integration.contract;

import br.com.formacao.orderflow.domain.value.ExternalOperationId;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;

public record ProviderOperationResult(
        ExternalOperationId operationId,
        ProviderResultStatus status,
        String code,
        String message,
        boolean retryable,
        Instant occurredAt,
        Map<String, Object> attributes) {

    public ProviderOperationResult {
        Objects.requireNonNull(operationId);
        Objects.requireNonNull(status);
        Objects.requireNonNull(code);
        Objects.requireNonNull(occurredAt);
        attributes = Map.copyOf(attributes);
    }
}
```

---

### 8. Criar ProviderOperationExecutor

```java
package br.com.formacao.orderflow.integration.port;

import br.com.formacao.orderflow.integration.contract.ProviderOperation;
import br.com.formacao.orderflow.integration.contract.ProviderOperationResult;

public interface ProviderOperationExecutor {

    ProviderOperationResult execute(
            ProviderOperation operation);
}
```

Na aula 685, um consumer chamará esse port.

---

### 9. Criar ports específicos

Crie:

```text
StockProviderPort;

PaymentProviderPort;

FulfillmentProviderPort.
```

Exemplo:

```java
package br.com.formacao.orderflow.integration.port;

import br.com.formacao.orderflow.integration.contract.ProviderOperation;
import br.com.formacao.orderflow.integration.contract.ProviderOperationResult;

public interface StockProviderPort {

    ProviderOperationResult reserve(
            ProviderOperation operation);

    ProviderOperationResult release(
            ProviderOperation operation);

    ProviderOperationResult query(
            ProviderOperation operation);
}
```

---

### 10. Criar WorkloadTokenProvider

```java
package br.com.formacao.orderflow.integration.port;

import java.time.Instant;

public interface WorkloadTokenProvider {

    AccessToken tokenFor(
            String audience,
            Instant now);

    record AccessToken(
            String value,
            Instant expiresAt) {
    }
}
```

O token nunca deve aparecer em logs.

---

### 11. Criar ProviderProperties

Cada provider possui:

- base URL;
- audience;
- connect timeout;
- read timeout;
- max attempts;
- backoff;
- circuit breaker threshold;
- open duration;
- bulkhead size;
- rate limit.

Valores vêm do ambiente.

---

### 12. Configurar YAML

Exemplo:

```yaml
orderflow:
  providers:
    stock:
      base-url: ${STOCK_PROVIDER_URL}
      audience: ${STOCK_PROVIDER_AUDIENCE}
      connect-timeout: 500ms
      read-timeout: 1500ms
      max-attempts: 2
    payment:
      base-url: ${PAYMENT_PROVIDER_URL}
      audience: ${PAYMENT_PROVIDER_AUDIENCE}
      connect-timeout: 500ms
      read-timeout: 2000ms
      max-attempts: 2
    fulfillment:
      base-url: ${FULFILLMENT_PROVIDER_URL}
      audience: ${FULFILLMENT_PROVIDER_AUDIENCE}
      connect-timeout: 500ms
      read-timeout: 2000ms
      max-attempts: 2
```

Não inclua client secret.

---

### 13. Criar ProviderDeadlinePolicy

```java
package br.com.formacao.orderflow.integration.service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

public final class ProviderDeadlinePolicy {

    private final Clock clock;

    public ProviderDeadlinePolicy(Clock clock) {
        this.clock = clock;
    }

    public Duration remaining(
            Instant deadline) {

        Duration duration = Duration.between(
                clock.instant(),
                deadline);

        if (duration.isNegative()
                || duration.isZero()) {
            throw new IllegalStateException(
                    "Provider deadline expired");
        }

        return duration;
    }
}
```

O timeout real nunca ultrapassa o deadline restante.

---

### 14. Criar ExternalIdempotencyPolicy

Chave externa:

```text
tenant
+ order
+ operation type
+ operation ID.
```

A chave precisa permanecer estável em retries.

Não gere uma nova key em cada tentativa.

---

### 15. Criar ProviderRequestFactory

O factory monta:

- URI;
- body;
- idempotency key;
- correlation header;
- tenant técnico permitido;
- authorization header;
- deadline header quando suportado;
- content type.

Ele não executa a chamada.

---

### 16. Criar headers técnicos

Headers recomendados:

```text
Authorization;

Idempotency-Key;

X-Correlation-Id;

X-Operation-Id;

X-Request-Deadline.
```

Evite propagar headers externos sem lista permitida.

---

### 17. Criar StockProviderApi

Contrato externo simulado:

```text
POST /stock/reservations;

DELETE /stock/reservations/{operationId};

GET /stock/operations/{operationId}.
```

Request de reserva:

- order reference;
- items;
- tenant reference;
- operation ID.

---

### 18. Criar StockProviderResponse

Campos:

- provider operation ID;
- status;
- rejection code;
- message;
- occurred at.

O DTO pertence ao package do provider.

---

### 19. Criar StockProviderMapper

Mapeamentos:

```text
RESERVED
-> SUCCESS.

REJECTED
-> REJECTED.

UNKNOWN
-> INVALID_CONTRACT.

PENDING
-> AMBIGUOUS.
```

Status HTTP e body são avaliados juntos.

---

### 20. Implementar HttpStockProviderClient

Fluxo:

```text
obter token;

calcular deadline;

montar request;

executar com resiliencia;

mapear resposta;

registrar telemetry;

retornar resultado normalizado.
```

Não devolva DTO externo.

---

### 21. Mapear idempotência de estoque

Cenário:

```text
409 ALREADY_RESERVED
com mesmo operation ID.
```

Resultado:

```text
SUCCESS.
```

Cenário:

```text
409 OPERATION_CONFLICT
com payload diferente.
```

Resultado:

```text
INVALID_CONTRACT
ou reconciliation finding.
```

---

### 22. Criar PaymentProviderApi

Contrato simulado:

```text
POST /payment/authorizations;

DELETE /payment/authorizations/{operationId};

GET /payment/operations/{operationId}.
```

O request inclui:

- order reference;
- amount;
- currency;
- operation ID;
- idempotency key.

---

### 23. Criar PaymentProviderMapper

Mapeamentos:

```text
AUTHORIZED
-> SUCCESS.

DECLINED
-> REJECTED.

PENDING
-> AMBIGUOUS.

NOT_FOUND na consulta
-> REJECTED
somente quando o provider
garante ausencia de efeito.

UNKNOWN
-> INVALID_CONTRACT.
```

---

### 24. Tratar recusas de pagamento

Recusa de negócio:

```text
cartao recusado;

limite insuficiente;

risco rejeitado.
```

Resultado:

```text
REJECTED
retryable false.
```

Erro técnico:

```text
503.
```

Resultado:

```text
UNAVAILABLE
retryable true.
```

---

### 25. Criar FulfillmentProviderApi

Contrato simulado:

```text
POST /fulfillments;

DELETE /fulfillments/{operationId};

GET /fulfillment-operations/{operationId}.
```

O request inclui:

- order;
- itens;
- operação;
- correlation;
- instruções mínimas.

---

### 26. Criar FulfillmentProviderMapper

Mapeamentos:

```text
STARTED
-> SUCCESS.

COMPLETED
-> SUCCESS.

REJECTED
-> REJECTED.

IN_PROGRESS
-> AMBIGUOUS
quando a operação esperava terminalidade.

UNKNOWN
-> INVALID_CONTRACT.
```

---

### 27. Criar error taxonomy

Arquivo:

```text
docs/integrations/PROVIDER_ERROR_TAXONOMY.md
```

Categorias:

```text
BUSINESS_REJECTION;

AUTHENTICATION;

AUTHORIZATION;

RATE_LIMIT;

TIMEOUT;

CONNECTION;

SERVER_ERROR;

CONTRACT_ERROR;

DUPLICATE_SAME_PAYLOAD;

DUPLICATE_DIFFERENT_PAYLOAD;

UNKNOWN_OUTCOME.
```

Cada categoria possui:

- resultado normalizado;
- retryable;
- audit;
- métrica;
- ação de recovery.

---

### 28. Criar exceptions técnicas

Crie:

- `ProviderAuthenticationException`;
- `ProviderRateLimitException`;
- `ProviderContractException`;
- `ProviderUnavailableException`.

Essas exceptions são capturadas no executor e convertidas para resultados normalizados.

Elas não chegam ao domínio.

---

## Resiliência

### 29. Criar Retry Policy

Arquivo:

```text
docs/integrations/RETRY_POLICY.md
```

Retry permitido:

- connection reset antes de resposta;
- `502`;
- `503`;
- `504`;
- `429` com `Retry-After`;
- timeout quando operação usa idempotency key estável.

Retry proibido:

- `400`;
- `401`;
- `403`;
- business rejection;
- contract error;
- payload conflict.

---

### 30. Definir quantidade de tentativas

Baseline:

```text
max attempts:
2.

backoff:
curto,
com jitter.

deadline:
sempre respeitado.
```

Poucas tentativas evitam amplificação.

---

### 31. Implementar retry com Resilience4j

O decorator deve:

- verificar exception permitida;
- manter operation ID;
- manter idempotency key;
- respeitar deadline;
- registrar attempt;
- nunca logar token;
- nunca repetir business rejection.

---

### 32. Criar Circuit Breaker Policy

Arquivo:

```text
docs/integrations/CIRCUIT_BREAKER_POLICY.md
```

Estados:

```text
CLOSED;

OPEN;

HALF_OPEN.
```

Falhas contabilizadas:

- connection;
- timeout;
- `5xx`;
- rate limit persistente.

Não contabilizar:

- business rejection;
- validation error do OrderFlow;
- duplicate same payload.

---

### 33. Configurar circuit breaker por provider

Não use um breaker único para todos.

Crie:

```text
stockProvider;

paymentProvider;

fulfillmentProvider.
```

Uma falha de pagamento não deve bloquear estoque.

---

### 34. Criar bulkhead

Cada provider possui limite de concorrência.

Quando o limite é atingido:

```text
UNAVAILABLE
retryable true.
```

Isso protege threads e conexões.

---

### 35. Criar rate limiter local

O rate limiter local reduz chamadas acima do contrato.

Ele não substitui rate limit do provider.

---

### 36. Definir fallback correto

Fallback não inventa sucesso.

Quando o circuit breaker está aberto:

```text
UNAVAILABLE.
```

Quando timeout deixa resultado incerto:

```text
AMBIGUOUS.
```

Nunca retorne `REJECTED` apenas para encerrar o fluxo.

---

## Autenticação de workload

### 37. Criar Workload Authentication

Arquivo:

```text
docs/integrations/WORKLOAD_AUTHENTICATION.md
```

Regras:

- client credentials ou workload identity;
- audience específica;
- token curto;
- cache até margem segura;
- refresh antes de expirar;
- nenhuma senha em código;
- token não persistido;
- token não logado.

---

### 38. Implementar token cache

O `WorkloadTokenProvider` pode reutilizar token enquanto:

```text
expiresAt
> now + safety margin.
```

Em falha de obtenção:

```text
AUTHENTICATION_FAILED.
```

Não tente provider sem token válido.

---

### 39. Propagar correlation

Toda chamada externa inclui correlation.

O provider operation ID também aparece em logs e traces.

Evite colocar tenant ou order como label de métrica de alta cardinalidade.

---

## Executor central

### 40. Criar DefaultProviderOperationExecutor

```java
package br.com.formacao.orderflow.integration.service;

import br.com.formacao.orderflow.integration.contract.ProviderOperation;
import br.com.formacao.orderflow.integration.contract.ProviderOperationResult;
import br.com.formacao.orderflow.integration.contract.ProviderOperationType;
import br.com.formacao.orderflow.integration.port.FulfillmentProviderPort;
import br.com.formacao.orderflow.integration.port.PaymentProviderPort;
import br.com.formacao.orderflow.integration.port.ProviderOperationExecutor;
import br.com.formacao.orderflow.integration.port.StockProviderPort;

public final class DefaultProviderOperationExecutor
        implements ProviderOperationExecutor {

    private final StockProviderPort stock;
    private final PaymentProviderPort payment;
    private final FulfillmentProviderPort fulfillment;

    public DefaultProviderOperationExecutor(
            StockProviderPort stock,
            PaymentProviderPort payment,
            FulfillmentProviderPort fulfillment) {

        this.stock = stock;
        this.payment = payment;
        this.fulfillment = fulfillment;
    }

    @Override
    public ProviderOperationResult execute(
            ProviderOperation operation) {

        return switch (operation.type()) {
            case RESERVE_STOCK ->
                    stock.reserve(operation);
            case RELEASE_STOCK ->
                    stock.release(operation);
            case AUTHORIZE_PAYMENT ->
                    payment.authorize(operation);
            case REVERSE_PAYMENT ->
                    payment.reverse(operation);
            case START_FULFILLMENT ->
                    fulfillment.start(operation);
            case CANCEL_FULFILLMENT ->
                    fulfillment.cancel(operation);
            case QUERY_OPERATION ->
                    query(operation);
        };
    }

    private ProviderOperationResult query(
            ProviderOperation operation) {

        return switch (
                operation.operationId()
                        .provider()) {
            case "STOCK" -> stock.query(operation);
            case "PAYMENT" -> payment.query(operation);
            case "FULFILLMENT" ->
                    fulfillment.query(operation);
            default -> throw new IllegalArgumentException(
                    "Unknown provider");
        };
    }
}
```

---

### 41. Normalizar todas as exceptions

O executor externo captura:

- authentication;
- rate limit;
- contract;
- unavailable;
- timeout;
- unexpected.

E converte para:

```text
ProviderOperationResult.
```

O resultado sempre preserva operation ID.

---

### 42. Criar ProviderTelemetry

Registre:

- provider;
- operation type;
- normalized status;
- latency;
- retry count;
- circuit state;
- timeout;
- result ambiguity.

Não use:

- token;
- request body completo;
- order ID como métrica;
- mensagem sensível do provider.

---

### 43. Criar logs estruturados

Campos:

- correlation ID;
- operation ID;
- provider;
- operation type;
- attempt;
- result;
- latency;
- error category.

Dados sensíveis permanecem fora.

---

## Contract tests

### 44. Configurar WireMock

Cada contract test inicia um servidor local.

Ele valida request e simula response.

Não dependa de sandbox externo para teste unitário ou de integração local.

---

### 45. Testar reserva de estoque

Cenários:

- `201 RESERVED`;
- `422 REJECTED`;
- `409 ALREADY_RESERVED`;
- `409 OPERATION_CONFLICT`;
- `500`;
- timeout;
- body desconhecido.

Valide request, headers e resultado normalizado.

---

### 46. Testar liberação de estoque

Cenários:

- release concluído;
- reserva inexistente;
- release já concluído;
- timeout;
- provider indisponível.

A operação deve ser idempotente.

---

### 47. Testar autorização de pagamento

Cenários:

- autorizada;
- recusada;
- duplicada com mesmo payload;
- duplicada com payload divergente;
- rate limit;
- timeout;
- `5xx`.

---

### 48. Testar reversão de pagamento

Valide:

- operação original;
- idempotency key;
- valor;
- currency;
- sucesso repetido;
- resultado ambíguo.

---

### 49. Testar fulfillment

Cenários:

- start;
- cancel;
- already started;
- already cancelled;
- irreversible;
- timeout;
- contrato inválido.

---

### 50. Testar autenticação de workload

Valide:

- audience;
- authorization header;
- token cache;
- token expirado;
- falha de obtenção;
- token ausente dos logs.

---

### 51. Testar retry

Valide:

- `503` seguido de sucesso;
- business rejection sem retry;
- `401` sem retry;
- tentativas máximas;
- mesma idempotency key;
- deadline respeitado.

---

### 52. Testar circuit breaker

Fluxo:

1. falhas consecutivas;
2. breaker abre;
3. chamada não chega ao WireMock;
4. espera controlada;
5. half-open;
6. sucesso fecha breaker.

---

### 53. Testar timeout ambíguo

O provider recebe a operação, mas a resposta atrasa.

Resultado:

```text
AMBIGUOUS.
```

O OrderFlow deverá reconciliar depois.

---

### 54. Testar contract drift

Provider retorna campo ou status inesperado.

Resultado:

```text
INVALID_CONTRACT.
```

Crie finding e métrica.

Não tente adivinhar significado.

---

## Arquitetura e qualidade

### 55. Criar IntegrationArchitectureTest

Regras:

- clients externos ficam no Gateway;
- domínio não depende de clients;
- aplicação não depende de DTOs externos;
- API não chama provider diretamente;
- mappers externos não ficam no domínio;
- token provider não vaza token;
- mensageria ainda não está implementada;
- cada provider possui breaker próprio.

---

### 56. Criar Contract Test Matrix

Arquivo:

```text
docs/integrations/CONTRACT_TEST_MATRIX.md
```

Linhas:

- provider;
- operação;
- sucesso;
- rejeição;
- duplicidade;
- timeout;
- rate limit;
- autenticação;
- contrato inválido;
- retry;
- breaker.

---

### 57. Criar Integration Risk Register

Arquivo:

```text
docs/integrations/INTEGRATION_RISK_REGISTER.md
```

Riscos:

```text
retry duplicar efeito;

timeout tratado como rejeicao;

token em log;

provider contract drift;

breaker compartilhado;

deadline ignorado;

payload divergente com mesma key;

rate limit amplificado;

fallback inventando sucesso;

consulta de reconciliacao incorreta.
```

---

### 58. Criar Integration Traceability

Arquivo:

```text
docs/integrations/INTEGRATION_TRACEABILITY.md
```

Exemplo:

```text
ADR-004 Integration Gateway
-> DefaultProviderOperationExecutor
-> StockProviderPort
-> PaymentProviderPort
-> FulfillmentProviderPort.

INV-007 resultado duplicado
-> ExternalIdempotencyPolicy
-> ProviderIdempotencyTest.

PENDING_RECONCILIATION
-> timeout ambiguous
-> ProviderAmbiguousResultTest.
```

---

### 59. Criar boundary da próxima aula

Arquivo:

```text
docs/integrations/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 684 define:

- provider contracts;
- clients;
- workload authentication;
- deadlines;
- retries;
- circuit breakers;
- bulkheads;
- rate limits;
- normalizacao;
- contract tests.

A aula 685 define:

- broker;
- topics;
- producers;
- consumers;
- schemas;
- ordering;
- retry topics;
- dead letter queue;
- Inbox;
- Outbox publisher;
- replay;
- event tests.

Nenhum transporte por broker
e implementado nesta aula.
```

---

### 60. Executar testes do Gateway

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -am `
  clean `
  test
```

---

### 61. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

---

### 62. Validar configuração externa

Confirme:

- URLs vêm do ambiente;
- audiences vêm do ambiente;
- nenhum token está versionado;
- nenhum client secret está no YAML;
- timeout é explícito;
- retry é limitado;
- breaker é separado por provider.

---

### 63. Criar report

Arquivo:

```text
reports/integration-implementation-report.yaml
```

Exemplo:

```yaml
integrationImplementation:
  module:
    integration-gateway

  providers:
    total:
      3

  operations:
    total:
      7

  resilience:
    deadline:
      true
    retry:
      true
    circuitBreaker:
      true
    bulkhead:
      true
    rateLimiter:
      true

  workloadAuthentication:
    true

  contractTests:
    total:
      29
    failures:
      0

  messaging:
    implemented:
      false

  gate:
    PASS
```

---

### 64. Criar evidence

Arquivo:

```text
contracts/integration-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- provider count;
- operation count;
- provider port count;
- client count;
- contract test count;
- test failure count;
- deadline status;
- retry status;
- circuit breaker status;
- bulkhead status;
- rate limiter status;
- workload authentication status;
- idempotency test status;
- ambiguous timeout test status;
- contract drift test status;
- token leak count;
- architecture test status;
- messaging implemented;
- documentation status;
- gate status;
- timestamp.

---

### 65. Criar gate de integrações

Status:

```text
PASS;

FAIL_INTEGRATION_MODULE;

FAIL_PROVIDER_CONTRACT;

FAIL_PROVIDER_PORT;

FAIL_PROVIDER_CLIENT;

FAIL_WORKLOAD_AUTHENTICATION;

FAIL_DEADLINE;

FAIL_RETRY_POLICY;

FAIL_CIRCUIT_BREAKER;

FAIL_BULKHEAD;

FAIL_RATE_LIMIT;

FAIL_EXTERNAL_IDEMPOTENCY;

FAIL_RESPONSE_NORMALIZATION;

FAIL_AMBIGUOUS_RESULT;

FAIL_CONTRACT_TEST;

FAIL_TOKEN_LEAK;

FAIL_ARCHITECTURE_TEST;

FAIL_MESSAGING_ANTICIPATION;

INCONCLUSIVE.
```

---


### 66. Revisar o contrato antes do gate

Antes de aprovar cada provider, confirme:

- operação interna e endpoint externo estão ligados;
- request possui apenas campos necessários;
- idempotency key permanece estável;
- correlation é propagada;
- deadline é menor que o budget do fluxo;
- códigos de negócio não viram falha técnica;
- timeout não vira rejeição;
- resposta desconhecida gera `INVALID_CONTRACT`;
- retry respeita classificação de segurança;
- breaker, bulkhead e rate limiter possuem métricas;
- token e payload sensível não aparecem em logs;
- contract test cobre sucesso, rejeição, duplicidade, indisponibilidade e ambiguidade.

Essa revisão reduz o risco de um client aparentemente funcional esconder decisões incorretas que somente apareceriam em produção.

---

### 67. Executar validação final

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

- três providers;
- contracts normalizados;
- token de workload;
- idempotency key estável;
- deadline;
- retry seguro;
- breaker por provider;
- timeout ambíguo;
- contract tests;
- nenhum broker implementado.

---

### 68. Encerrar o laboratório

Confirme:

- POM;
- application bootstrap;
- contracts;
- ports;
- properties;
- clients;
- mappers;
- token provider;
- deadline policy;
- idempotency policy;
- retry;
- breaker;
- bulkhead;
- rate limiter;
- executor;
- telemetry;
- contract tests;
- architecture test;
- report;
- evidence;
- gate aprovado;
- mensageria não implementada.

---

## Entendendo o que foi feito

### Providers ficaram fora do domínio

Cada contrato externo foi isolado no Gateway.

### Resultados ganharam vocabulário comum

Sucesso, rejeição, ambiguidade e indisponibilidade possuem semântica interna.

### Retry ficou condicionado à segurança

Operações usam key estável e deadline.

### Timeout deixou de ser rejeição

Resultado incerto leva a reconciliação.

### Circuit breakers ficaram isolados

Falha de um provider não bloqueia os outros.

### Workloads ganharam autenticação própria

Tokens de usuário não são reutilizados.

### Contract tests viraram proteção

Mudanças externas passam a gerar falha visível.

### Mensageria permaneceu separada

O executor está pronto para receber operações por broker na aula 685.

---

## Erros comuns importantes

### DTO externo no domínio

A Anti-Corruption Layer deixa de existir.

### Retry com nova key

O provider pode repetir efeito.

### Timeout igual a falha definitiva

O estado pode ficar incorreto.

### Um breaker para tudo

Uma dependência derruba as outras.

### Fallback retornando sucesso

O sistema confirma algo não comprovado.

### Token em log

A credencial pode ser reutilizada.

### `401` com retry

Credencial inválida não melhora por repetição.

### Business rejection com retry

O provider já tomou uma decisão funcional.

### Contract drift ignorado

O mapper pode produzir decisão errada.

### Implementar Kafka agora

Mensageria pertence à aula 685.

---

## Comandos úteis

### Testar Gateway

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -am `
  test
```

### Testar estoque

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -Dtest=StockProviderContractTest `
  test
```

### Testar circuit breaker

```powershell
.\mvnw.cmd `
  -pl `
  apps/integration-gateway `
  -Dtest=ProviderCircuitBreakerTest `
  test
```

### Build completo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

---

## Exercício guiado

Implemente:

```text
autorizacao de pagamento
com timeout ambiguo.
```

Inclua:

1. ProviderOperation;
2. operation ID;
3. idempotency key;
4. workload token;
5. audience;
6. deadline;
7. request;
8. timeout;
9. retry seguro;
10. mesma key;
11. resultado `AMBIGUOUS`;
12. telemetry;
13. contract test;
14. retry test;
15. token leak test;
16. circuit breaker test;
17. traceability;
18. evidence.

Não publique evento no broker.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 683 e ponte para a aula 685 foram preservadas;
- módulo `integration-gateway` foi configurado;
- aplicação Spring Boot foi criada;
- Integration Charter foi criado;
- ProviderOperationType foi criado;
- ProviderOperation foi criado;
- ProviderResultStatus foi criado;
- ProviderOperationResult foi criado;
- ProviderOperationExecutor foi criado;
- ports de estoque, pagamento e fulfillment foram criados;
- WorkloadTokenProvider foi criado;
- ProviderProperties foi criada;
- configuração externa foi criada;
- ProviderDeadlinePolicy foi criada;
- ExternalIdempotencyPolicy foi criada;
- ProviderRequestFactory foi criada;
- headers técnicos foram definidos;
- StockProviderApi foi criada;
- StockProviderResponse foi criado;
- StockProviderMapper foi criado;
- HttpStockProviderClient foi criado;
- idempotência de estoque foi mapeada;
- PaymentProviderApi foi criada;
- PaymentProviderMapper foi criado;
- recusas foram diferenciadas de erro técnico;
- FulfillmentProviderApi foi criada;
- FulfillmentProviderMapper foi criado;
- error taxonomy foi criada;
- exceptions técnicas foram criadas;
- Retry Policy foi criada;
- tentativas foram limitadas;
- retry seguro foi implementado;
- Circuit Breaker Policy foi criada;
- breaker por provider foi configurado;
- bulkhead foi criado;
- rate limiter foi criado;
- fallback não inventa sucesso;
- workload authentication foi documentada;
- token cache foi definido;
- correlation foi propagada;
- DefaultProviderOperationExecutor foi criado;
- exceptions foram normalizadas;
- ProviderTelemetry foi criada;
- logs estruturados foram definidos;
- WireMock foi configurado;
- reserva de estoque foi testada;
- liberação de estoque foi testada;
- autorização de pagamento foi testada;
- reversão de pagamento foi testada;
- fulfillment foi testado;
- autenticação de workload foi testada;
- retry foi testado;
- circuit breaker foi testado;
- timeout ambíguo foi testado;
- contract drift foi testado;
- teste arquitetural foi criado;
- Contract Test Matrix foi criada;
- Risk Register foi criado;
- traceability foi criada;
- boundary da aula 685 foi criado;
- build do módulo passou;
- build completo passou;
- configuração externa foi validada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- mensageria não foi antecipada.

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
  apps/integration-gateway `
  docs/integrations `
  reports/integration-implementation-report.yaml `
  contracts/integration-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "client_secret|private_key|access_token|refresh_token|Bearer ey|realProviderUrl|KafkaTemplate|@KafkaListener"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(integration): implement provider gateway"
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

- token real;
- secret;
- URL real;
- Kafka producer;
- Kafka consumer;
- topics;
- schemas de evento;
- conteúdo detalhado da aula 685.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou as integrações do OrderFlow.

Você criou:

```text
Integration Gateway;

provider contracts;

provider ports;

HTTP clients;

workload authentication;

external idempotency;

deadlines;

timeouts;

retries;

circuit breakers;

bulkheads;

rate limits;

response normalization;

error taxonomy;

telemetry;

contract tests;

architecture test;

report, evidence e gate.
```

O Gateway agora consegue executar operações de estoque, pagamento e fulfillment sem contaminar o domínio com contratos externos.

A próxima aula será:

```text
685 - M20.15 - Implementacao mensageria
```

Nela, você implementará o transporte assíncrono do OrderFlow, com Outbox Publisher, producers, consumers, topics, event schemas, ordering, retry topics, dead letter queue, Inbox, replay e testes de integração com broker.

Nenhuma mensageria foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contracts normalizados.
- [ ] Criei ports de providers.
- [ ] Criei clients HTTP.
- [ ] Implementei workload authentication.
- [ ] Implementei idempotência externa.
- [ ] Defini deadlines.
- [ ] Defini retries seguros.
- [ ] Criei breakers separados.
- [ ] Criei bulkheads.
- [ ] Criei rate limits.
- [ ] Normalizei respostas.
- [ ] Testei timeout ambíguo.
- [ ] Criei contract tests.
- [ ] Preservei mensageria para a aula 685.

---

## Troubleshooting adicional

### Provider retorna `401`

Não aplique retry; renove credencial ou gere finding.

### Timeout retorna rejected

Corrija o normalizador para `AMBIGUOUS`.

### Retry cria operation ID novo

Mantenha a mesma identidade externa.

### Breaker abre para recusa de negócio

Remova business rejection da lista de falhas.

### Contract test passa sem validar request

Adicione verificação de body, headers e path.

### Token aparece no log

Sanitize headers e exceptions.

### Payment e Stock compartilham breaker

Crie instâncias separadas.

### Deadline já expirou

Não faça a chamada.

### Provider retorna campo desconhecido

Gere `INVALID_CONTRACT`.

### Quero criar listener Kafka

Essa etapa pertence à aula 685.

---

## Perguntas de revisão

1. Qual papel do Integration Gateway?
2. O domínio conhece DTO externo?
3. O que é Anti-Corruption Layer?
4. O que é resultado normalizado?
5. Retry é sempre seguro?
6. O que garante idempotência externa?
7. A key muda no retry?
8. O que timeout prova?
9. O que é resultado ambíguo?
10. Para que serve deadline?
11. O que circuit breaker protege?
12. Deve existir um breaker único?
13. O que bulkhead protege?
14. O que rate limiter local faz?
15. Fallback pode inventar sucesso?
16. Workload usa token de usuário?
17. O que contract test valida?
18. O que é contract drift?
19. Business rejection recebe retry?
20. `401` recebe retry?
21. O que o executor central faz?
22. O que a aula 685 fará?
23. O que não foi implementado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Isolar e traduzir providers.
2. Não.
3. Boundary de tradução.
4. Vocabulário interno comum.
5. Não.
6. Operation ID e key estáveis.
7. Não.
8. Apenas ausência de resposta no prazo.
9. Efeito externo desconhecido.
10. Limitar tempo total.
11. Capacidade e cascata de falhas.
12. Não.
13. Concorrência por dependência.
14. Reduz chamadas acima do contrato.
15. Não.
16. Não.
17. Request, response e mapping.
18. Mudança inesperada do provider.
19. Não.
20. Não.
21. Roteia operação ao provider correto.
22. Implementar mensageria.
23. Broker, producers e consumers.
24. Implementação mensageria.
25. Gateway traduz e normaliza.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 684 - M20.14 - Implementacao integracoes

- Continuei após Implementação segurança.
- Configurei o módulo `integration-gateway`.
- Criei o bootstrap Spring Boot.
- Criei Integration Charter.
- Criei ProviderOperationType.
- Criei ProviderOperation.
- Criei ProviderResultStatus.
- Criei ProviderOperationResult.
- Criei ProviderOperationExecutor.
- Criei ports de estoque, pagamento e fulfillment.
- Criei WorkloadTokenProvider.
- Criei ProviderProperties.
- Externalizei URLs e audiences.
- Criei ProviderDeadlinePolicy.
- Criei ExternalIdempotencyPolicy.
- Criei ProviderRequestFactory.
- Defini headers técnicos.
- Criei StockProviderApi.
- Criei StockProviderResponse.
- Criei StockProviderMapper.
- Criei HttpStockProviderClient.
- Mapeei idempotência de estoque.
- Criei PaymentProviderApi.
- Criei PaymentProviderMapper.
- Diferenciei recusa de erro técnico.
- Criei FulfillmentProviderApi.
- Criei FulfillmentProviderMapper.
- Criei Provider Error Taxonomy.
- Criei exceptions técnicas.
- Criei Retry Policy.
- Limitei tentativas.
- Implementei retry seguro.
- Criei Circuit Breaker Policy.
- Configurei breaker por provider.
- Criei bulkhead.
- Criei rate limiter.
- Evitei fallback falso.
- Documentei workload authentication.
- Defini token cache.
- Propaguei correlation.
- Criei DefaultProviderOperationExecutor.
- Normalizei exceptions.
- Criei ProviderTelemetry.
- Defini logs estruturados.
- Configurei WireMock.
- Testei reserva e liberação de estoque.
- Testei autorização e reversão de pagamento.
- Testei fulfillment.
- Testei workload authentication.
- Testei retry.
- Testei circuit breaker.
- Testei timeout ambíguo.
- Testei contract drift.
- Criei teste arquitetural.
- Criei Contract Test Matrix.
- Criei Integration Risk Register.
- Criei Integration Traceability.
- Criei boundary para a aula 685.
- Executei build do módulo.
- Executei build completo.
- Validei configuração externa.
- Criei report, evidence e gate.
- Não antecipei mensageria.
- Próxima aula: Implementacao mensageria.
```

---

## Referência técnica curta

- Integration Gateway.
- Anti-Corruption Layer.
- Workload Identity.
- External Idempotency.
- Deadline.
- Timeout.
- Retry.
- Jitter.
- Circuit Breaker.
- Bulkhead.
- Rate Limiter.
- Contract Test.
- WireMock.
- Normalization.
- Ambiguous Result.
- Contract Drift.
- Provider Telemetry.

Regra final:

```text
A implementação de integrações do OrderFlow deve isolar Stock, Payment e Fulfillment Providers no Integration Gateway: ProviderOperation carrega tenant, order, type, operation ID, correlation, deadline e payload interno, ports específicos definem reserve, release, authorize, reverse, start, cancel e query, HTTP clients usam WorkloadTokenProvider com audience específica, correlation e idempotency key estável, ProviderRequestFactory controla headers permitidos, deadlines limitam o tempo total, retry ocorre apenas para falhas transitórias e operações idempotentes, mantendo operation ID e key, business rejection, 400, 401, 403 e contract error não recebem retry, timeout pode produzir AMBIGUOUS e nunca é convertido automaticamente em rejeição, circuit breakers são separados por provider, bulkheads limitam concorrência, rate limiters evitam amplificação, fallbacks nunca inventam sucesso, mappers convertem contratos externos para SUCCESS, REJECTED, AMBIGUOUS, UNAVAILABLE, RATE_LIMITED, AUTHENTICATION_FAILED ou INVALID_CONTRACT, Duplicate Same Payload é sucesso idempotente e Duplicate Different Payload gera finding, telemetry registra provider, operation, result, latency, attempts e circuit state sem token ou payload sensível, e WireMock valida requests, headers, responses, timeout, retry, breaker, authentication e contract drift; o gate termina com contracts, ports, clients, workload identity, idempotency, deadlines, resilience, normalization, tests, report e evidence aprovados, enquanto broker, topics, producers, consumers, event schemas, ordering, retry topics, DLQ, replay e Outbox Publisher permanecem reservados para a aula 685.
```
