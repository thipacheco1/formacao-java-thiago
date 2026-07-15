# 682 - M20.12 - Implementacao API REST

## Apresentação da aula

Na aula 681, você implementou a persistência do OrderFlow.

O módulo `orderflow-persistence` passou a possuir:

- migrations Flyway;
- schema PostgreSQL;
- entities JPA;
- chaves compostas por tenant;
- repositories Spring Data;
- mapper entre aggregate e persistência;
- repository adapter;
- optimistic locking;
- transaction manager;
- Idempotency Registry;
- Outbox Store;
- Inbox Store;
- Audit Store;
- clock;
- geração de identificadores;
- testes com PostgreSQL real;
- testes de migrations;
- testes de rollback;
- testes de isolamento;
- testes arquiteturais.

O OrderFlow já possui:

```text
dominio;

casos de uso;

ports;

handlers;

persistencia concreta;

transacoes;

idempotencia;

Outbox;

Inbox;

auditoria.
```

Agora o projeto precisa de um adapter de entrada HTTP.

Esse adapter receberá chamadas externas e transformará dados de transporte em commands da camada de aplicação.

Ele também converterá resultados internos em respostas HTTP.

A API REST não deve:

- conhecer entities JPA;
- acessar Spring Data diretamente;
- iniciar regras de domínio;
- decidir transições;
- publicar no broker;
- montar SQL;
- controlar Outbox;
- duplicar idempotência;
- vazar stack trace;
- devolver exception técnica.

O controller deve permanecer fino.

Regra:

```text
HTTP conhece a aplicacao;

HTTP nao conhece
a persistencia concreta.
```

Nesta aula, você implementará:

```text
apps/orderflow-api
```

A tecnologia será:

```text
Java 21;

Spring Boot;

Spring Web;

Bean Validation;

Problem Details;

OpenAPI;

MockMvc;

Testcontainers
nos testes de integracao.
```

O adapter HTTP deverá tratar:

- registro de pedido;
- consulta de pedido;
- solicitação de reserva;
- resultados internos expostos apenas quando necessário;
- autorização de pagamento;
- fulfillment;
- cancelamento;
- reconciliação operacional;
- idempotency header;
- tenant context provisório;
- correlation ID;
- status codes;
- validação;
- erros previsíveis;
- documentação OpenAPI;
- testes de contrato HTTP.

A autenticação e a autorização completas ainda não serão implementadas.

Nesta aula, o tenant será resolvido por um header controlado:

```text
X-Tenant-Id.
```

Esse mecanismo é provisório e existe apenas para integrar a API às camadas já implementadas.

A aula seguinte será:

```text
683 - M20.13 - Implementacao seguranca
```

Na aula 683, o header provisório será protegido por autenticação, claims, autorização por ação, workload identity, políticas de acesso e testes de segurança.

O laboratório será:

```text
labs/m20/aula-682-implementacao-api-rest/orderflow-api-implementation
```

Regra central:

```text
a API traduz
HTTP para casos de uso

e traduz resultados
para HTTP,

sem mover
regra de negocio
para o controller.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
679:
Implementacao dominio.

680:
Implementacao casos de uso.

681:
Implementacao persistencia.

682:
Implementacao API REST.

683:
Implementacao seguranca.

684:
Mensageria e eventos.
```

A aula 682 cria o adapter HTTP.

A aula 683 protege esse adapter.

A aula 684 implementará mensageria e publicação assíncrona.

Essa ordem permite testar primeiro:

- contrato;
- DTO;
- validação;
- mapping;
- status;
- erros;
- documentação.

Depois, autenticação e autorização serão adicionadas sem alterar os casos de uso.

A API precisa respeitar:

- commands internos;
- input ports;
- tenant scope;
- idempotência;
- correlation;
- erros de aplicação;
- erros de domínio;
- contratos estáveis;
- ausência de JPA no controller.

---

## Objetivo prático

Será criada a estrutura:

```text
apps/orderflow-api
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br/com/formacao/orderflow/api
│   │   │       ├── OrderFlowApiApplication.java
│   │   │       ├── config
│   │   │       │   ├── ApiConfiguration.java
│   │   │       │   ├── OpenApiConfiguration.java
│   │   │       │   └── UseCaseConfiguration.java
│   │   │       ├── controller
│   │   │       │   ├── OrderCommandController.java
│   │   │       │   ├── OrderQueryController.java
│   │   │       │   ├── OrderOperationController.java
│   │   │       │   └── ReconciliationController.java
│   │   │       ├── dto
│   │   │       │   ├── RegisterOrderRequest.java
│   │   │       │   ├── RegisterOrderResponse.java
│   │   │       │   ├── OrderLineRequest.java
│   │   │       │   ├── OrderResponse.java
│   │   │       │   ├── RequestCancellationRequest.java
│   │   │       │   ├── ReconciliationRequest.java
│   │   │       │   └── ApiErrorResponse.java
│   │   │       ├── error
│   │   │       │   ├── ApiExceptionHandler.java
│   │   │       │   ├── ApiProblemFactory.java
│   │   │       │   ├── ValidationProblemMapper.java
│   │   │       │   └── RequestContextException.java
│   │   │       ├── mapper
│   │   │       │   ├── OrderApiMapper.java
│   │   │       │   └── ApiMappingException.java
│   │   │       ├── query
│   │   │       │   ├── OrderQueryPort.java
│   │   │       │   ├── OrderView.java
│   │   │       │   └── OrderHistoryView.java
│   │   │       └── web
│   │   │           ├── RequestContext.java
│   │   │           ├── RequestContextResolver.java
│   │   │           ├── CorrelationIdFilter.java
│   │   │           ├── TenantContextFilter.java
│   │   │           └── ApiHeaders.java
│   │   └── resources
│   │       ├── application.yml
│   │       └── application-test.yml
│   └── test
│       └── java
│           └── br/com/formacao/orderflow/api
│               ├── OrderCommandControllerTest.java
│               ├── OrderQueryControllerTest.java
│               ├── OrderOperationControllerTest.java
│               ├── ApiValidationTest.java
│               ├── ApiProblemDetailsTest.java
│               ├── ApiIdempotencyTest.java
│               ├── ApiTenantIsolationTest.java
│               ├── ApiOpenApiTest.java
│               ├── ApiIntegrationTest.java
│               └── ApiArchitectureTest.java
└── target
```

---

## Conceito essencial

### DTO não é command

O DTO representa HTTP.

O command representa intenção interna.

Exemplo:

```text
RegisterOrderRequest
```

pode possuir:

- campos em JSON;
- annotations de validação;
- nomes externos;
- formatos de dinheiro;
- detalhes de documentação.

`RegisterOrderCommand` possui:

- value objects;
- tenant;
- correlation;
- idempotency key;
- linhas já convertidas.

O mapper separa os dois modelos.

### Status HTTP não é erro de domínio

A aplicação retorna códigos internos.

A API converte para HTTP.

Exemplo:

```text
ORDER_NOT_FOUND
-> 404.

IDEMPOTENCY_CONFLICT
-> 409.

INVALID_ORDER_TRANSITION
-> 409.

INVALID_REQUEST
-> 400.

INTERNAL_ERROR
-> 500.
```

O domínio não conhece esses status.

### Problem Details padroniza erros

Uma resposta de erro deve conter:

- type;
- title;
- status;
- detail;
- instance;
- error code;
- correlation ID;
- violations quando aplicável.

Não devolva:

- stack trace;
- nome da tabela;
- query SQL;
- classe interna;
- token;
- payload sensível.

### Idempotency key pertence ao contrato HTTP

O client envia:

```text
Idempotency-Key.
```

O controller transforma o valor em `IdempotencyKey`.

O handler decide replay e conflito.

O controller não mantém cache próprio.

### Tenant context ainda é provisório

Nesta aula:

```text
X-Tenant-Id
```

será resolvido por filtro.

Na aula 683, tenant e identidade serão derivados de contexto autenticado e autorizados.

---

## Mão na massa guiada

### 1. Abrir o módulo da API

Na raiz do repositório:

```powershell
Set-Location `
  apps/orderflow-api
```

---

### 2. Configurar o POM

Arquivo:

```text
apps/orderflow-api/pom.xml
```

Conteúdo essencial:

```xml
<dependencies>
    <dependency>
        <groupId>br.com.formacao</groupId>
        <artifactId>orderflow-application</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>br.com.formacao</groupId>
        <artifactId>orderflow-persistence</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

As versões são controladas no parent POM.

---

### 3. Criar aplicação Spring Boot

```java
package br.com.formacao.orderflow.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        scanBasePackages =
                "br.com.formacao.orderflow")
public class OrderFlowApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                OrderFlowApiApplication.class,
                args);
    }
}
```

---

### 4. Criar ApiHeaders

```java
package br.com.formacao.orderflow.api.web;

public final class ApiHeaders {

    public static final String TENANT_ID =
            "X-Tenant-Id";

    public static final String CORRELATION_ID =
            "X-Correlation-Id";

    public static final String IDEMPOTENCY_KEY =
            "Idempotency-Key";

    private ApiHeaders() {
    }
}
```

---

### 5. Criar RequestContext

```java
package br.com.formacao.orderflow.api.web;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Objects;

public record RequestContext(
        TenantId tenantId,
        CorrelationId correlationId) {

    public RequestContext {
        Objects.requireNonNull(tenantId);
        Objects.requireNonNull(correlationId);
    }
}
```

---

### 6. Criar RequestContextResolver

```java
package br.com.formacao.orderflow.api.web;

import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.TenantId;
import jakarta.servlet.http.HttpServletRequest;

public final class RequestContextResolver {

    public RequestContext resolve(
            HttpServletRequest request) {

        String tenant =
                request.getHeader(
                        ApiHeaders.TENANT_ID);

        String correlation =
                request.getHeader(
                        ApiHeaders.CORRELATION_ID);

        if (tenant == null || tenant.isBlank()) {
            throw new RequestContextException(
                    "TENANT_HEADER_REQUIRED");
        }

        if (correlation == null
                || correlation.isBlank()) {
            correlation =
                    java.util.UUID.randomUUID()
                            .toString();
        }

        return new RequestContext(
                new TenantId(tenant),
                new CorrelationId(correlation));
    }
}
```

A geração automática de correlation é aceitável.

Tenant ausente deve falhar.

---

### 7. Criar filtro de correlation

O filtro deve:

- aceitar `X-Correlation-Id`;
- gerar quando ausente;
- colocar em request attribute;
- devolver no response header;
- limpar o contexto ao final;
- não usar order ID como correlation;
- não expor dados sensíveis.

---

### 8. Criar filtro de tenant provisório

O filtro valida presença e formato de:

```text
X-Tenant-Id.
```

Ele não autentica o tenant.

Essa limitação deve aparecer na documentação e no OpenAPI.

Na aula 683, esse filtro será substituído ou fortalecido.

---

## DTOs e validação

### 9. Criar OrderLineRequest

```java
package br.com.formacao.orderflow.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public record OrderLineRequest(
        @NotBlank
        @Pattern(
                regexp = "[A-Za-z0-9][A-Za-z0-9_-]{2,39}")
        String productCode,

        @Min(1)
        int quantity,

        @NotNull
        @DecimalMin("0.00")
        BigDecimal unitPrice,

        @NotBlank
        @Pattern(regexp = "[A-Z]{3}")
        String currency) {
}
```

---

### 10. Criar RegisterOrderRequest

```java
package br.com.formacao.orderflow.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record RegisterOrderRequest(
        @NotEmpty
        List<@Valid OrderLineRequest> lines) {

    public RegisterOrderRequest {
        lines = List.copyOf(lines);
    }
}
```

---

### 11. Criar RegisterOrderResponse

```java
package br.com.formacao.orderflow.api.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record RegisterOrderResponse(
        UUID orderId,
        String status,
        BigDecimal totalAmount,
        String currency,
        boolean replayed) {
}
```

---

### 12. Criar OrderResponse

A resposta de consulta deve possuir:

- order ID;
- tenant;
- status;
- total;
- currency;
- version;
- stage;
- flags operacionais;
- updated at;
- links permitidos.

Não exponha:

- entity ID técnico;
- payload de Outbox;
- detalhes de Inbox;
- stack trace;
- campos internos do provider.

---

### 13. Criar RequestCancellationRequest

```java
package br.com.formacao.orderflow.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RequestCancellationRequest(
        @NotBlank
        @Size(max = 200)
        String reason) {
}
```

---

### 14. Criar ReconciliationRequest

Campos:

- operation type;
- external operation ID;
- normalized result;
- evidence reference;
- reason.

Não permita payload arbitrário sem validação.

---

## Mapper da API

### 15. Criar OrderApiMapper

Responsabilidades:

```text
request + headers
-> command.

application result
-> response.

query view
-> response.
```

Ele não:

- acessa banco;
- decide status HTTP;
- chama handler;
- valida autorização;
- monta entity.

---

### 16. Mapear RegisterOrderRequest

```java
package br.com.formacao.orderflow.api.mapper;

import br.com.formacao.orderflow.api.dto.RegisterOrderRequest;
import br.com.formacao.orderflow.application.command.RegisterOrderCommand;
import br.com.formacao.orderflow.domain.value.CorrelationId;
import br.com.formacao.orderflow.domain.value.IdempotencyKey;
import br.com.formacao.orderflow.domain.value.Money;
import br.com.formacao.orderflow.domain.value.ProductCode;
import br.com.formacao.orderflow.domain.value.Quantity;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Currency;

public final class OrderApiMapper {

    public RegisterOrderCommand toCommand(
            RegisterOrderRequest request,
            TenantId tenantId,
            CorrelationId correlationId,
            IdempotencyKey idempotencyKey) {

        var lines = request.lines()
                .stream()
                .map(line ->
                        new RegisterOrderCommand.Line(
                                new ProductCode(
                                        line.productCode()),
                                new Quantity(
                                        line.quantity()),
                                new Money(
                                        line.unitPrice(),
                                        Currency.getInstance(
                                                line.currency()))))
                .toList();

        return new RegisterOrderCommand(
                tenantId,
                idempotencyKey,
                correlationId,
                lines);
    }
}
```

---

### 17. Validar moeda ainda no domínio

Bean Validation confirma formato de três letras.

A validade real da moeda é confirmada por:

```text
Currency.getInstance.
```

Moeda divergente entre linhas é rejeitada pelo domínio.

Não replique essa regra no controller.

---

## Controllers

### 18. Criar OrderCommandController

```java
package br.com.formacao.orderflow.api.controller;

import br.com.formacao.orderflow.api.dto.RegisterOrderRequest;
import br.com.formacao.orderflow.api.dto.RegisterOrderResponse;
import br.com.formacao.orderflow.api.mapper.OrderApiMapper;
import br.com.formacao.orderflow.api.web.ApiHeaders;
import br.com.formacao.orderflow.api.web.RequestContextResolver;
import br.com.formacao.orderflow.application.port.in.RegisterOrderUseCase;
import br.com.formacao.orderflow.domain.value.IdempotencyKey;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/orders")
public final class OrderCommandController {

    private final RegisterOrderUseCase registerOrder;
    private final RequestContextResolver contextResolver;
    private final OrderApiMapper mapper;

    public OrderCommandController(
            RegisterOrderUseCase registerOrder,
            RequestContextResolver contextResolver,
            OrderApiMapper mapper) {

        this.registerOrder = registerOrder;
        this.contextResolver = contextResolver;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<RegisterOrderResponse> register(
            @Valid
            @RequestBody
            RegisterOrderRequest body,

            @RequestHeader(
                    name = ApiHeaders.IDEMPOTENCY_KEY)
            String idempotencyKey,

            HttpServletRequest request) {

        var context =
                contextResolver.resolve(request);

        var command = mapper.toCommand(
                body,
                context.tenantId(),
                context.correlationId(),
                new IdempotencyKey(
                        idempotencyKey));

        var result =
                registerOrder.handle(command);

        var response =
                mapper.toResponse(result);

        URI location = URI.create(
                "/v1/orders/"
                        + result.orderId());

        return ResponseEntity
                .created(location)
                .header(
                        ApiHeaders.CORRELATION_ID,
                        context.correlationId().value())
                .body(response);
    }
}
```

---

### 19. Tratar replay idempotente

Quando `result.replayed()` for `true`, mantenha contrato determinístico.

Opções:

- retornar `201 Created` novamente;
- retornar `200 OK`;
- usar header adicional.

Para o OrderFlow, escolha:

```text
201 Created
com a mesma Location
e replayed true.
```

Isso simplifica clients.

A decisão deve ser documentada.

---

### 20. Criar endpoints operacionais

Endpoints:

```text
POST /v1/orders;

GET /v1/orders/{orderId};

GET /v1/orders/{orderId}/history;

POST /v1/orders/{orderId}/stock-reservation;

POST /v1/orders/{orderId}/payment-authorization;

POST /v1/orders/{orderId}/fulfillment;

POST /v1/orders/{orderId}/cancellation;

POST /v1/orders/{orderId}/reconciliation.
```

Resultados externos de providers não serão endpoints públicos de clientes.

Eles serão recebidos por mensageria em aula posterior.

---

### 21. Criar OrderOperationController

O controller de operações:

- extrai tenant;
- extrai correlation;
- converte path variable para `OrderId`;
- converte body quando houver;
- chama input port;
- devolve `202 Accepted` ou `200 OK`.

Exemplo:

```text
request stock reservation
-> 202 Accepted.
```

A ação inicia processamento assíncrono.

---

### 22. Escolher status dos comandos

Padrão:

```text
register order:
201.

request stock:
202.

request payment:
202.

start fulfillment:
202.

request cancellation:
202.

reconciliation accepted:
202.

synchronous query:
200.
```

Erro de validação:

```text
400.
```

Conflito de estado:

```text
409.
```

---

## Query port e consultas

### 23. Criar OrderQueryPort

```java
package br.com.formacao.orderflow.api.query;

import br.com.formacao.orderflow.domain.value.OrderId;
import br.com.formacao.orderflow.domain.value.TenantId;
import java.util.Optional;

public interface OrderQueryPort {

    Optional<OrderView> find(
            TenantId tenantId,
            OrderId orderId);

    OrderHistoryView history(
            TenantId tenantId,
            OrderId orderId);
}
```

O adapter concreto poderá ler a projection operacional.

---

### 24. Criar OrderView

Campos:

- tenant;
- order;
- status;
- stage;
- total;
- currency;
- version;
- reconciliation pending;
- compensations pending;
- updated at;
- freshness timestamp.

A consulta não retorna aggregate.

---

### 25. Criar OrderQueryController

Comportamento:

- resolver context;
- buscar por tenant;
- retornar `404` quando ausente;
- mapear view;
- incluir correlation;
- não revelar existência em outro tenant.

---

### 26. Criar paginação operacional

Um endpoint opcional:

```text
GET /v1/orders?status=&page=&size=
```

Regras:

- page mínimo zero;
- size entre 1 e 100;
- ordenação permitida por campos conhecidos;
- tenant obrigatório;
- filtros sanitizados;
- resposta com metadados;
- sem query arbitrária.

Não implemente analytics.

---

## Problem Details

### 27. Criar ApiProblemFactory

```java
package br.com.formacao.orderflow.api.error;

import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public final class ApiProblemFactory {

    public ProblemDetail create(
            HttpStatus status,
            String code,
            String detail,
            String instance,
            String correlationId) {

        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(
                        status,
                        detail);

        problem.setType(URI.create(
                "https://errors.orderflow.local/"
                        + code.toLowerCase()));

        problem.setTitle(code);
        problem.setInstance(
                URI.create(instance));
        problem.setProperty(
                "code",
                code);
        problem.setProperty(
                "correlationId",
                correlationId);

        return problem;
    }
}
```

A URL é identificador lógico, não endpoint obrigatório.

---

### 28. Criar ApiExceptionHandler

Use:

```java
@RestControllerAdvice
```

Mapeie:

```text
OrderNotFound
-> 404.

IdempotencyConflict
-> 409.

IdempotencyInProgress
-> 409 ou 425.

ConcurrencyConflict
-> 409.

InvalidOrderTransition
-> 409.

CancellationNotAllowed
-> 409.

MethodArgumentNotValidException
-> 400.

HttpMessageNotReadableException
-> 400.

RequestContextException
-> 400.

Exception inesperada
-> 500.
```

Para o curso, use `409` para idempotência em andamento e inclua código específico.

---

### 29. Criar ValidationProblemMapper

Converta violations para:

```json
{
  "field": "lines[0].quantity",
  "message": "must be greater than or equal to 1"
}
```

Não inclua valor sensível rejeitado.

---

### 30. Tratar JSON inválido

Retorne:

```text
400 INVALID_JSON.
```

Não devolva parser stack trace.

---

### 31. Tratar erro inesperado

Retorne:

```text
500 INTERNAL_ERROR.
```

Inclua correlation ID.

Log interno:

- exception;
- correlation;
- endpoint;
- tenant sanitizado;
- sem body completo por padrão.

---

## OpenAPI

### 32. Criar OpenApiConfiguration

Defina:

- título;
- versão;
- descrição;
- servers locais;
- tags;
- headers;
- schemas de Problem Details;
- observação de segurança pendente.

Não declare autenticação pronta antes da aula 683.

---

### 33. Documentar headers

Headers:

```text
X-Tenant-Id:
obrigatorio provisoriamente.

X-Correlation-Id:
opcional no request,
sempre devolvido.

Idempotency-Key:
obrigatorio
para registro e comandos criticos.
```

---

### 34. Documentar erros

Cada operação precisa documentar:

- 400;
- 404;
- 409;
- 500.

Operações assíncronas também documentam:

- 202;
- Location ou status resource quando aplicável.

---

### 35. Exportar OpenAPI

Disponibilize em ambiente local:

```text
/v3/api-docs;

/swagger-ui.html.
```

O artifact JSON pode ser exportado no CI e comparado em testes de contrato.

---

## Configuração e wiring

### 36. Criar UseCaseConfiguration

Registre handlers como beans.

Exemplo:

```java
package br.com.formacao.orderflow.api.config;

import br.com.formacao.orderflow.application.handler.RegisterOrderHandler;
import br.com.formacao.orderflow.application.port.in.RegisterOrderUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfiguration {

    @Bean
    RegisterOrderUseCase registerOrderUseCase(
            RegisterOrderHandler handler) {

        return handler;
    }
}
```

No projeto real, prefira construir handlers diretamente com seus ports ou registrar factories específicas.

---

### 37. Evitar annotations nos handlers

Os handlers continuam classes Java puras.

A composição acontece no módulo de bootstrap.

Isso mantém testes rápidos e boundaries claros.

---

### 38. Configurar application.yml

Inclua:

- application name;
- port;
- datasource por environment;
- Flyway;
- JPA validation;
- Problem Details;
- shutdown graceful;
- actuator básico se já disponível;
- logging sanitizado.

Não coloque senha real.

Use environment variables.

---

### 39. Configurar profile de teste

`application-test.yml`:

- datasource de Testcontainers;
- Flyway enabled;
- DDL auto `validate`;
- logs reduzidos;
- timezone UTC;
- security ainda desativada ou provisória;
- OpenAPI disponível para teste.

---

## Testes de controller

### 40. Criar OrderCommandControllerTest

Use MockMvc e fake do input port.

Teste:

- request válido;
- `201`;
- Location;
- correlation header;
- body;
- command recebido;
- tenant;
- idempotency key;
- linhas convertidas.

---

### 41. Testar validação de linhas

Casos:

- lista vazia;
- product code inválido;
- quantity zero;
- preço negativo;
- moeda inválida;
- body ausente;
- JSON malformado.

Todos retornam `400`.

---

### 42. Testar header idempotente ausente

Resultado:

```text
400
```

Código:

```text
MISSING_REQUEST_HEADER
```

Nenhum caso de uso é chamado.

---

### 43. Testar tenant ausente

Resultado:

```text
400 TENANT_HEADER_REQUIRED.
```

Na aula 683, respostas de identidade e autorização serão revisadas.

---

### 44. Testar correlation

Cenário 1:

- client envia correlation;
- API preserva.

Cenário 2:

- client não envia;
- API gera;
- response devolve.

---

### 45. Testar replay

Fake retorna:

```text
replayed = true.
```

Valide:

- `201`;
- mesma Location;
- replayed no body;
- nenhum comportamento HTTP especial inconsistente.

---

### 46. Testar conflitos

Mapeie:

- invalid transition;
- idempotency conflict;
- concurrency conflict;
- cancellation not allowed.

Todos retornam `409` com codes diferentes.

---

### 47. Testar not found por tenant

O query port não encontra o pedido no tenant atual.

Resultado:

```text
404 ORDER_NOT_FOUND.
```

Não existe tentativa de buscar sem tenant.

---

### 48. Testar Problem Details

Valide:

- content type;
- type;
- title;
- status;
- detail;
- instance;
- code;
- correlation ID;
- violations quando aplicável.

---

### 49. Testar OpenAPI

Carregue:

```text
/v3/api-docs.
```

Valide:

- endpoint de registro;
- header de idempotência;
- header de tenant;
- responses;
- schemas;
- Problem Details;
- versão da API.

---

## Testes de integração

### 50. Criar ApiIntegrationTest

Suba:

- Spring Boot;
- PostgreSQL Testcontainer;
- Flyway;
- persistence adapters;
- use cases;
- controllers.

Fluxo:

```text
POST order;

GET order;

request stock;

GET order;

confirmar estado esperado
conforme processamento disponivel.
```

Como mensageria ainda não foi implementada, o teste deve limitar-se aos comportamentos síncronos e à criação de Outbox.

---

### 51. Testar registro de ponta a ponta

Valide:

- HTTP recebido;
- command criado;
- idempotência adquirida;
- aggregate salvo;
- audit salvo;
- Outbox salva;
- response `201`;
- consulta retorna estado;
- tenant isolado.

---

### 52. Testar replay de ponta a ponta

Envie o mesmo request:

- mesmo tenant;
- mesma key;
- mesmo body.

Valide:

- mesmo order ID;
- apenas um aggregate;
- apenas um efeito de registro;
- resposta replayed;
- nenhuma duplicação de Outbox de criação.

---

### 53. Testar conflito de key

Envie:

- mesmo tenant;
- mesma key;
- body diferente.

Resultado:

```text
409 IDEMPOTENCY_CONFLICT.
```

---

### 54. Testar rollback HTTP

Injete falha de Outbox.

Resultado:

- HTTP de erro;
- aggregate ausente;
- audit ausente;
- idempotência não concluída;
- correlation presente.

---

### 55. Testar isolation multi-tenant

Registre pedido no tenant A.

Busque no tenant B.

Resultado:

```text
404.
```

Nenhum detalhe do tenant A aparece.

---

## Arquitetura e qualidade

### 56. Criar ApiArchitectureTest

Regras:

- controllers dependem de input ports;
- controllers não dependem de JPA;
- DTOs não dependem de entities;
- mapper não depende de repository;
- persistence não depende de API;
- domain não depende de API;
- handlers não possuem annotations web;
- controllers não acessam Outbox diretamente.

---

### 57. Executar testes da API

Na raiz:

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  clean `
  test
```

---

### 58. Executar build completo

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Todos os módulos devem permanecer verdes.

---

### 59. Executar API localmente

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  spring-boot:run
```

Teste:

```powershell
$headers = @{
    "X-Tenant-Id" = "tenant-demo"
    "X-Correlation-Id" = "corr-demo-001"
    "Idempotency-Key" = "register-demo-001"
}

$body = @{
    lines = @(
        @{
            productCode = "SKU-001"
            quantity = 2
            unitPrice = 15.00
            currency = "BRL"
        }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8080/v1/orders" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $body
```

---

### 60. Inspecionar resposta

Confirme:

- status `201`;
- `Location`;
- correlation;
- order ID;
- status;
- total;
- currency;
- replayed `false`.

Repita o request.

Confirme replay idempotente.

---

### 61. Criar report

Arquivo:

```text
reports/api-rest-implementation-report.yaml
```

Exemplo:

```yaml
APIImplementation:
  module:
    orderflow-API

  controllers:
    total:
      4

  endpoints:
    total:
      9

  requestDTOs:
    total:
      4

  responseDTOs:
    total:
      5

  validationRules:
    total:
      14

  errorMappings:
    total:
      10

  tests:
    controller:
      28
    integration:
      11
    architecture:
      1
    failures:
      0

  OpenAPI:
    generated:
      true

  security:
    implemented:
      false

  gate:
    PASS
```

---

### 62. Criar evidence

Arquivo:

```text
contracts/api-rest-implementation-evidence.yaml
```

Campos:

- lesson;
- project;
- module;
- controller count;
- endpoint count;
- request DTO count;
- response DTO count;
- validation rule count;
- error mapping count;
- controller test count;
- integration test count;
- architecture test count;
- test failure count;
- idempotency header test status;
- tenant header test status;
- correlation test status;
- replay test status;
- rollback test status;
- OpenAPI generation status;
- JPA leak count;
- security implemented;
- documentation status;
- gate status;
- timestamp.

---

### 63. Criar gate da API

Status:

```text
PASS;

FAIL_API_MODULE;

FAIL_CONTROLLER;

FAIL_REQUEST_DTO;

FAIL_RESPONSE_DTO;

FAIL_VALIDATION;

FAIL_API_MAPPER;

FAIL_TENANT_CONTEXT;

FAIL_CORRELATION;

FAIL_IDEMPOTENCY_HEADER;

FAIL_STATUS_CODE;

FAIL_PROBLEM_DETAILS;

FAIL_QUERY_PORT;

FAIL_OPENAPI;

FAIL_CONTROLLER_TEST;

FAIL_INTEGRATION_TEST;

FAIL_ARCHITECTURE_TEST;

FAIL_JPA_LEAK;

FAIL_SECURITY_ANTICIPATION;

INCONCLUSIVE.
```

---

### 64. Executar validação final

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

- API compila;
- controllers finos;
- DTOs validados;
- tenant obrigatório;
- correlation presente;
- idempotência funcionando;
- Problem Details funcionando;
- OpenAPI gerada;
- integração com PostgreSQL funcionando;
- segurança completa ainda não implementada.

---

### 65. Encerrar o laboratório

Confirme:

- POM;
- bootstrap Spring;
- headers;
- request context;
- filters;
- DTOs;
- validation;
- mapper;
- controllers;
- query port;
- Problem Details;
- exception handler;
- OpenAPI;
- wiring;
- application profiles;
- controller tests;
- integration tests;
- architecture test;
- execução local;
- report;
- evidence;
- gate aprovado;
- segurança não implementada.

---

## Entendendo o que foi feito

### A aplicação ganhou um adapter HTTP

Clients agora podem usar os casos de uso sem conhecer detalhes internos.

### Controllers permaneceram finos

Eles resolvem contexto, mapeiam DTOs, chamam input ports e constroem responses.

### Erros ganharam contrato

Problem Details separa erro interno de representação HTTP.

### Idempotência entrou no contrato externo

Clients enviam key e recebem replay determinístico.

### Tenant passou a ser obrigatório

O header provisório preserva escopo enquanto a segurança ainda não foi implementada.

### OpenAPI virou evidence

O contrato HTTP pode ser revisado, testado e exportado.

### O sistema ficou testável de ponta a ponta

MockMvc testa transporte.

Testcontainers testa integração real com PostgreSQL.

---

## Erros comuns importantes

### Controller acessando repository

O adapter de entrada ultrapassa a aplicação.

### DTO igual a entity

Persistência vaza para o contrato público.

### Regra no controller

O domínio perde autoridade.

### Erro com stack trace

Detalhes internos ficam expostos.

### Idempotência em cache local

Restart e múltiplas instâncias quebram o contrato.

### Tenant opcional

Acesso multi-tenant fica inseguro.

### Status HTTP aleatório

Clients não conseguem automatizar tratamento.

### OpenAPI divergente

Documentação deixa de ser confiável.

### Security fake apresentada como pronta

O header provisório deve ser explicitado.

### Antecipar autenticação completa

Essa etapa pertence à aula 683.

---

## Comandos úteis

### Testar API

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  test
```

### Executar teste de controller

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -Dtest=OrderCommandControllerTest `
  test
```

### Executar API

```powershell
.\mvnw.cmd `
  -pl `
  apps/orderflow-api `
  -am `
  spring-boot:run
```

### Abrir OpenAPI

```text
http://localhost:8080/v3/api-docs
```

---

## Exercício guiado

Implemente o fluxo HTTP:

```text
cancelar pedido elegivel.
```

Inclua:

1. endpoint;
2. path variable;
3. tenant header;
4. correlation header;
5. request DTO;
6. Bean Validation;
7. mapper;
8. command;
9. input port;
10. status `202`;
11. response;
12. Problem Details;
13. teste válido;
14. teste body inválido;
15. teste not found;
16. teste invalid transition;
17. teste tenant isolation;
18. OpenAPI;
19. integration test;
20. evidence.

Não implemente autenticação.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 681 e ponte para a aula 683 foram preservadas;
- módulo `orderflow-api` foi implementado;
- POM possui dependências corretas;
- aplicação Spring Boot foi criada;
- ApiHeaders foi criado;
- RequestContext foi criado;
- RequestContextResolver foi criado;
- filtro de correlation foi criado;
- tenant header provisório foi criado;
- OrderLineRequest foi criado;
- RegisterOrderRequest foi criado;
- RegisterOrderResponse foi criado;
- OrderResponse foi definido;
- RequestCancellationRequest foi criado;
- ReconciliationRequest foi definido;
- OrderApiMapper foi criado;
- request foi convertido para command;
- validação de moeda permaneceu no domínio;
- OrderCommandController foi criado;
- replay idempotente foi tratado;
- endpoints operacionais foram definidos;
- status HTTP foram definidos;
- OrderQueryPort foi criado;
- OrderView foi criado;
- OrderQueryController foi criado;
- paginação segura foi definida;
- ApiProblemFactory foi criada;
- ApiExceptionHandler foi criado;
- ValidationProblemMapper foi criado;
- JSON inválido foi tratado;
- erro inesperado foi sanitizado;
- OpenAPI Configuration foi criada;
- headers foram documentados;
- erros foram documentados;
- OpenAPI foi exportada;
- use cases foram compostos por configuração;
- handlers permaneceram sem annotations web;
- application.yml foi criado;
- profile de teste foi criado;
- controller de registro foi testado;
- validações foram testadas;
- idempotency header ausente foi testado;
- tenant ausente foi testado;
- correlation foi testada;
- replay foi testado;
- conflitos foram testados;
- not found por tenant foi testado;
- Problem Details foi testado;
- OpenAPI foi testada;
- integration test foi criado;
- registro de ponta a ponta foi testado;
- replay de ponta a ponta foi testado;
- conflito de key foi testado;
- rollback HTTP foi testado;
- isolamento multi-tenant foi testado;
- teste arquitetural foi criado;
- build do módulo passou;
- build completo passou;
- execução local foi testada;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- segurança completa não foi antecipada.

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
  apps/orderflow-api `
  reports/api-rest-implementation-report.yaml `
  contracts/api-rest-implementation-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "password|client_secret|access_token|private_key|SecurityFilterChain|JwtDecoder|oauth2ResourceServer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "feat(api): implement OrderFlow REST API"
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

- autenticação;
- autorização;
- JWT;
- OAuth2;
- policies de segurança;
- conteúdo detalhado da aula 683.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou a API REST do OrderFlow.

Você criou:

```text
Spring Boot bootstrap;

request context;

tenant header;

correlation filter;

idempotency header;

request DTOs;

response DTOs;

Bean Validation;

API mapper;

command controllers;

query controllers;

Problem Details;

exception handler;

OpenAPI;

controller tests;

integration tests;

architecture tests;

report, evidence e gate.
```

A API agora pode:

- registrar pedidos;
- consultar pedidos;
- solicitar etapas;
- cancelar;
- reconciliar;
- devolver erros previsíveis;
- documentar o contrato;
- executar com PostgreSQL real.

A próxima aula será:

```text
683 - M20.13 - Implementacao seguranca
```

Nela, você implementará autenticação, autorização, tenant derivado de claims, proteção de endpoints, scopes, roles, workload identity, auditoria de acesso e testes de segurança.

A autenticação e a autorização completas não foram implementadas nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei API Spring Boot.
- [ ] Criei DTOs.
- [ ] Criei Bean Validation.
- [ ] Criei mapper.
- [ ] Criei controllers.
- [ ] Criei query port.
- [ ] Criei Problem Details.
- [ ] Criei OpenAPI.
- [ ] Criei testes de controller.
- [ ] Criei integration tests.
- [ ] Testei idempotência.
- [ ] Testei tenant.
- [ ] Testei rollback.
- [ ] Preservei segurança para a aula 683.

---

## Troubleshooting adicional

### Controller retorna 500 em validação

Revise o exception handler e Bean Validation.

### Header não chega ao command

Revise RequestContextResolver e mapper.

### Replay cria novo pedido

O handler deve retornar resposta armazenada.

### Problem Details não inclui correlation

Garanta acesso ao request context no advice.

### API retorna entity JPA

Mapeie para view ou response DTO.

### OpenAPI não mostra header

Documente parâmetro global ou por operação.

### Teste de integração não encontra migration

Revise classpath e localização Flyway.

### Tenant B encontra pedido de A

Corrija query port e repository.

### Endpoint síncrono espera provider

Retorne `202` e use processamento assíncrono.

### Quero configurar JWT

Essa etapa pertence à aula 683.

---

## Perguntas de revisão

1. Qual papel da API?
2. DTO é command?
3. Controller pode acessar JPA?
4. Onde fica a regra de negócio?
5. Para que serve RequestContext?
6. Qual header informa tenant provisório?
7. Qual header controla idempotência?
8. O que correlation permite?
9. O que é Problem Details?
10. O que não deve aparecer no erro?
11. Qual status do registro?
12. Qual status de comando assíncrono?
13. Qual status de conflito?
14. Como not found por tenant é tratado?
15. O que OrderApiMapper faz?
16. O que OrderQueryPort faz?
17. Aggregate é usado para consulta?
18. Para que serve OpenAPI?
19. Como testar controller?
20. Como testar integração?
21. A segurança está pronta?
22. O que a aula 683 fará?
23. O que não foi implementado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Traduzir HTTP e casos de uso.
2. Não.
3. Não.
4. No domínio.
5. Transportar tenant e correlation.
6. `X-Tenant-Id`.
7. `Idempotency-Key`.
8. Rastrear a jornada.
9. Formato padronizado de erro.
10. Stack trace, SQL e secrets.
11. `201`.
12. `202`.
13. `409`.
14. `404` sem revelar outro tenant.
15. Converte DTOs, commands e responses.
16. Oferece consultas internas.
17. Não para projection operacional.
18. Documentar e testar contrato.
19. Com MockMvc.
20. Com Spring Boot e Testcontainers.
21. Não.
22. Autenticação e autorização.
23. JWT, OAuth2 e policies.
24. Implementação segurança.
25. HTTP traduz; domínio decide.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 682 - M20.12 - Implementacao API REST

- Continuei após Implementação persistência.
- Implementei o módulo `orderflow-api`.
- Configurei o POM.
- Criei o bootstrap Spring Boot.
- Criei ApiHeaders.
- Criei RequestContext.
- Criei RequestContextResolver.
- Criei filtro de correlation.
- Criei tenant header provisório.
- Criei OrderLineRequest.
- Criei RegisterOrderRequest.
- Criei RegisterOrderResponse.
- Criei OrderResponse.
- Criei RequestCancellationRequest.
- Criei ReconciliationRequest.
- Criei OrderApiMapper.
- Converti request para command.
- Mantive validação de moeda no domínio.
- Criei OrderCommandController.
- Tratei replay idempotente.
- Criei endpoints operacionais.
- Defini status HTTP.
- Criei OrderQueryPort.
- Criei OrderView.
- Criei OrderQueryController.
- Defini paginação segura.
- Criei ApiProblemFactory.
- Criei ApiExceptionHandler.
- Criei ValidationProblemMapper.
- Tratei JSON inválido.
- Sanitizei erro inesperado.
- Criei OpenApiConfiguration.
- Documentei headers.
- Documentei erros.
- Exportei OpenAPI.
- Configurei beans dos use cases.
- Mantive handlers sem annotations web.
- Criei application.yml.
- Criei profile de teste.
- Testei controller de registro.
- Testei validações.
- Testei header idempotente.
- Testei tenant obrigatório.
- Testei correlation.
- Testei replay.
- Testei conflitos.
- Testei not found por tenant.
- Testei Problem Details.
- Testei OpenAPI.
- Criei integration test.
- Testei registro de ponta a ponta.
- Testei replay de ponta a ponta.
- Testei conflito de key.
- Testei rollback HTTP.
- Testei isolamento multi-tenant.
- Criei teste arquitetural.
- Executei build do módulo.
- Executei build completo.
- Testei execução local.
- Criei report, evidence e gate.
- Não antecipei segurança completa.
- Próxima aula: Implementacao seguranca.
```

---

## Referência técnica curta

- REST API.
- Spring Web MVC.
- DTO.
- Bean Validation.
- Request Context.
- Correlation ID.
- Idempotency-Key.
- Problem Details.
- Controller Advice.
- OpenAPI.
- MockMvc.
- Testcontainers.
- HTTP Status.
- API Versioning.
- Tenant Context.
- Thin Controller.

Regra final:

```text
A implementação da API REST do OrderFlow deve traduzir HTTP para input ports sem mover regras ou persistência para controllers: apps/orderflow-api compõe application e persistence, requests usam DTOs com Bean Validation, OrderApiMapper converte campos para TenantId, CorrelationId, IdempotencyKey, ProductCode, Quantity e Money, RequestContext resolve X-Tenant-Id provisório e X-Correlation-Id, o registro exige Idempotency-Key, chama RegisterOrderUseCase e devolve 201 com Location e replayed, comandos assíncronos devolvem 202, queries usam OrderQueryPort e nunca aggregate ou entity JPA, tenant participa de toda consulta e outro tenant recebe 404, ApiExceptionHandler converte erros de aplicação e domínio em Problem Details com code e correlation sem stack trace ou SQL, validação e JSON inválido retornam 400, conflitos retornam 409, OpenAPI documenta endpoints, headers, schemas e erros, MockMvc comprova mapping e status, integração com Testcontainers comprova HTTP, idempotência, aggregate, audit e Outbox, e ArchUnit impede acesso de controller a JPA, repository e Outbox; o gate termina com bootstrap, contexts, DTOs, validation, mappers, controllers, queries, Problem Details, OpenAPI, tests, report e evidence aprovados, enquanto autenticação, autorização, JWT, OAuth2, scopes, roles, workload identity e tenant derivado de claims permanecem reservados para a aula 683.
```
