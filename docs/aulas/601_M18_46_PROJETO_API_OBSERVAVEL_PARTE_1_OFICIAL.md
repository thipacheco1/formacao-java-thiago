# 601 - M18.46 - Projeto API observavel parte 1

## Apresentação da aula

Você chegou à primeira etapa do projeto prático que encerra o módulo de observabilidade, performance, concorrência e produção.

Até aqui, os conteúdos foram estudados separadamente.

Você trabalhou com:

```text
logs estruturados;

correlation ID;

métricas;

Micrometer;

Prometheus;

Grafana;

tracing distribuído;

health checks;

readiness;

liveness;

SLO;

error budget;

alertas;

JFR;

thread dumps;

concorrência;

virtual threads;

backpressure;

timeouts;

memory leak;

CPU alta;

banco lento;

runbooks de incidente.
```

Agora esses conhecimentos começarão a ser reunidos em uma única aplicação.

O projeto será dividido em três partes oficiais:

```text
601:
Projeto API observavel parte 1.

602:
Projeto API observavel parte 2.

603:
Projeto API observavel parte 3 otimizacao.
```

A divisão existe para evitar uma aplicação grande, confusa e difícil de validar.

Na parte 1, você irá construir a fundação operacional.

O objetivo não será apenas criar endpoints que funcionem.

A API deverá nascer com condições mínimas para responder perguntas como:

```text
qual request falhou?

qual operação está lenta?

qual versão está executando?

a aplicação está viva?

ela está pronta para receber tráfego?

o banco está acessível?

quantas operações foram processadas?

quantas falharam?

quanto tempo cada fluxo levou?

há fila ou trabalho pendente?

o shutdown encerra corretamente?
```

A aplicação do projeto será uma API sintética de pedidos observáveis.

Ela não representará um sistema comercial real.

Todos os dados serão artificiais.

O domínio será simples o suficiente para permitir foco operacional:

```text
criar pedido;

consultar pedido;

listar pedidos;

confirmar pedido;

cancelar pedido;

consultar resumo operacional.
```

A arquitetura inicial será:

```text
HTTP;

controller;

application service;

repository PostgreSQL;

event publisher;

observability components;

health indicators;

metrics;

structured logs.
```

Nesta primeira parte, você irá implementar:

- contrato operacional;
- estrutura do projeto;
- modelo sintético;
- migrations;
- endpoints básicos;
- tratamento centralizado de erros;
- logs estruturados;
- request ID;
- correlation ID;
- context propagation local;
- sanitização;
- métricas de requests;
- métricas de operações de negócio;
- métricas de repository;
- métricas de fila sintética;
- health;
- liveness;
- readiness;
- informações de build;
- graceful shutdown;
- testes de contrato;
- scripts de validação;
- evidências sanitizadas.

A parte 1 não irá construir ainda:

- tracing distribuído completo;
- exportação definitiva de traces;
- dashboards finais;
- alertas finais;
- SLO final do projeto;
- error budget final;
- correlação completa entre logs, métricas e traces;
- cenários de degradação da parte 2;
- profiling e otimizações da parte 3;
- tuning de banco;
- otimização de alocação;
- otimização de CPU;
- load test final.

A próxima aula será:

```text
602 - M18.47 - Projeto API observavel parte 2
```

Nela, a API receberá a segunda camada de observabilidade e operação.

A regra central desta aula será:

```text
a API observável
não começa pelo dashboard;

ela começa
por contratos,
instrumentação,
contexto,
health
e métricas confiáveis.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
599:
Banco lento diagnostico.

600:
Runbook de incidente.

601:
Projeto API observavel parte 1.

602:
Projeto API observavel parte 2.

603:
Projeto API observavel parte 3 otimizacao.
```

A progressão é:

```text
diagnosticar;

responder a incidentes;

construir uma API observável;

integrar operação;

otimizar com evidência.
```

A aula 600 preparou o modelo operacional.

Agora você começará a construir o sistema que será operado por esse modelo.

Nesta parte:

```text
API funcional:
sim.

PostgreSQL:
sim.

migrations:
sim.

logs estruturados:
sim.

correlation ID:
sim.

request ID:
sim.

métricas-base:
sim.

health:
sim.

readiness:
sim.

liveness:
sim.

graceful shutdown:
sim.

tracing completo:
não.

dashboards finais:
não.

alertas finais:
não.

otimização:
não.
```

O projeto continuará dentro do laboratório já utilizado no módulo:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

A nova API será organizada em um diretório próprio para não misturar os experimentos anteriores com a aplicação consolidada.

---

## Objetivo prático

Será criada a seguinte estrutura:

```text
projects/observable-orders-api
├── pom.xml
├── compose.yaml
├── README.md
├── .env.example
├── .gitignore
├── config
│   ├── application.yml
│   ├── application-local.yml
│   └── logback-spring.xml
├── contracts
│   ├── observable-api-contract.yaml
│   ├── observable-api-log-policy.yaml
│   ├── observable-api-metrics-policy.yaml
│   ├── observable-api-health-policy.yaml
│   ├── observable-api-security-policy.yaml
│   ├── observable-api-shutdown-policy.yaml
│   ├── observable-api-data-quality-policy.yaml
│   ├── observable-api-failure-policy.yaml
│   ├── observable-api-scenarios.yaml
│   └── observable-api-evidence.yaml
├── src/main/java/br/com/formacao/observableorders
│   ├── ObservableOrdersApplication.java
│   ├── api
│   │   ├── OrderController.java
│   │   ├── OperationalController.java
│   │   ├── ApiError.java
│   │   ├── ApiExceptionHandler.java
│   │   ├── CreateOrderRequest.java
│   │   ├── OrderResponse.java
│   │   └── OperationalSummaryResponse.java
│   ├── application
│   │   ├── OrderApplicationService.java
│   │   ├── OrderCommand.java
│   │   ├── OrderQueryService.java
│   │   └── OperationalSummaryService.java
│   ├── domain
│   │   ├── Order.java
│   │   ├── OrderId.java
│   │   ├── OrderStatus.java
│   │   ├── OrderItem.java
│   │   └── DomainException.java
│   ├── infrastructure
│   │   ├── persistence
│   │   │   ├── OrderEntity.java
│   │   │   ├── SpringDataOrderRepository.java
│   │   │   └── PostgresOrderRepository.java
│   │   ├── messaging
│   │   │   ├── OrderEventPublisher.java
│   │   │   └── InMemoryOrderEventPublisher.java
│   │   └── config
│   │       ├── ClockConfiguration.java
│   │       └── BuildInfoConfiguration.java
│   └── observability
│       ├── RequestContext.java
│       ├── RequestContextFilter.java
│       ├── CorrelationIdGenerator.java
│       ├── SensitiveDataSanitizer.java
│       ├── OrderMetrics.java
│       ├── RepositoryMetrics.java
│       ├── QueueMetrics.java
│       ├── DatabaseReadinessIndicator.java
│       ├── EventPublisherReadinessIndicator.java
│       └── GracefulShutdownObserver.java
├── src/main/resources
│   ├── application.yml
│   ├── application-local.yml
│   ├── logback-spring.xml
│   └── db/migration
│       ├── V1__create_orders.sql
│       └── V2__create_order_items.sql
├── src/test/java/br/com/formacao/observableorders
│   ├── OrderControllerTest.java
│   ├── OrderApplicationServiceTest.java
│   ├── ApiExceptionHandlerTest.java
│   ├── RequestContextFilterTest.java
│   ├── SensitiveDataSanitizerTest.java
│   ├── OrderMetricsTest.java
│   ├── DatabaseReadinessIndicatorTest.java
│   ├── ObservableApiContractTest.java
│   └── GracefulShutdownTest.java
├── reports
│   ├── observable-api-baseline-report.yaml
│   ├── observable-api-log-report.yaml
│   ├── observable-api-metrics-report.yaml
│   ├── observable-api-health-report.yaml
│   └── observable-api-gate-report.yaml
└── docs
    ├── OBSERVABLE_API_OVERVIEW.md
    ├── API_CONTRACT.md
    ├── STRUCTURED_LOGGING_GUIDE.md
    ├── METRICS_BASELINE.md
    ├── HEALTH_READINESS_LIVENESS.md
    ├── GRACEFUL_SHUTDOWN.md
    ├── OBSERVABLE_API_TEST_MATRIX.md
    └── OBSERVABLE_API_TROUBLESHOOTING.md
```

Também serão criados scripts:

```text
scripts/projects/observable-orders-api
├── validate-observable-api-contract.ps1
├── start-observable-api-dependencies.ps1
├── stop-observable-api-dependencies.ps1
├── run-observable-api.ps1
├── run-observable-api-tests.ps1
├── validate-observable-api-logs.ps1
├── validate-observable-api-metrics.ps1
├── validate-observable-api-health.ps1
├── validate-observable-api-readiness.ps1
├── validate-observable-api-liveness.ps1
├── validate-observable-api-shutdown.ps1
├── scan-observable-api-output.ps1
├── collect-observable-api-evidence.ps1
└── verify-observable-api-baseline.ps1
```

Ao final, você terá uma API funcional e instrumentada em sua camada básica.

---

## Conceito essencial

### Observabilidade por construção

Observabilidade adicionada durante o desenho da aplicação, e não apenas depois de um incidente.

---

### Signal

Informação operacional produzida pelo sistema.

Exemplos:

- log;
- métrica;
- health status;
- trace;
- evento de deployment.

---

### Request ID

Identificador de uma requisição específica recebida pela API.

---

### Correlation ID

Identificador usado para relacionar operações pertencentes à mesma jornada.

---

### Structured log

Log composto por campos, não apenas por texto livre.

---

### Health

Visão geral do estado operacional da aplicação.

---

### Liveness

Sinal que responde se o processo está vivo e capaz de continuar executando.

---

### Readiness

Sinal que responde se a aplicação está pronta para receber tráfego.

---

### Business metric

Métrica relacionada ao fluxo funcional.

Exemplo:

```text
pedidos criados;

pedidos confirmados;

pedidos cancelados.
```

---

### Technical metric

Métrica relacionada à infraestrutura ou execução.

Exemplo:

```text
tempo de repository;

pending events;

erros por operação.
```

---

### Cardinalidade

Quantidade de combinações distintas de labels de uma métrica.

---

### Graceful shutdown

Encerramento que para novas entradas, conclui ou cancela trabalho em andamento e libera recursos.

---

## Mão na massa guiada

### 1. Criar o diretório do projeto

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  projects/observable-orders-api
```

Entre no diretório:

```powershell
Set-Location `
  projects/observable-orders-api
```

Confirme:

```powershell
Get-Location
```

---

### 2. Criar o contrato principal

Arquivo:

```text
contracts/observable-api-contract.yaml
```

Conteúdo:

```yaml
observableApi:
  required:
    - functional-endpoints
    - structured-logs
    - request-context
    - metrics
    - health
    - liveness
    - readiness
    - build-info
    - graceful-shutdown
    - tests
    - evidence

  data:
    synthetic:
      required

  logs:
    sensitiveData:
      forbidden

  metrics:
    highCardinalityLabels:
      forbidden

  health:
    businessPayload:
      forbidden

  nextLesson:
    code:
      M18.47
```

---

### 3. Criar o `pom.xml`

Dependências essenciais:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>

    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

Use a versão de Spring Boot já definida na formação.

Não atualize dependências durante esta aula sem necessidade.

---

### 4. Criar aplicação principal

```java
@SpringBootApplication
public class ObservableOrdersApplication {

    public static void main(
            String[] args) {

        SpringApplication.run(
                ObservableOrdersApplication.class,
                args);
    }
}
```

---

### 5. Criar configuração base

Arquivo:

```yaml
spring:
  application:
    name: observable-orders-api

  lifecycle:
    timeout-per-shutdown-phase: 20s

  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate

  flyway:
    enabled: true

server:
  shutdown: graceful

management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
          - metrics
          - prometheus

  endpoint:
    health:
      probes:
        enabled: true
      show-details: never

  health:
    livenessstate:
      enabled: true
    readinessstate:
      enabled: true
```

Credenciais serão fornecidas por variáveis de ambiente.

---

### 6. Criar `.env.example`

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/observable_orders
DATABASE_USERNAME=observable_user
DATABASE_PASSWORD=change-me-locally
```

O arquivo real `.env` ficará fora do Git.

---

### 7. Criar `compose.yaml`

Serviço PostgreSQL sintético:

```yaml
services:
  postgres:
    image: postgres
    environment:
      POSTGRES_DB: observable_orders
      POSTGRES_USER: observable_user
      POSTGRES_PASSWORD: observable_password
    ports:
      - "5432:5432"
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U observable_user -d observable_orders
      interval: 5s
      timeout: 3s
      retries: 10
```

O password é apenas local e sintético.

Não reutilize credenciais reais.

---

### 8. Criar migration de pedidos

Arquivo:

```sql
create table orders (
    id uuid primary key,
    customer_reference varchar(80) not null,
    status varchar(30) not null,
    total_amount numeric(15, 2) not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    version bigint not null
);

create index idx_orders_status_created_at
    on orders (status, created_at desc);
```

---

### 9. Criar migration de itens

```sql
create table order_items (
    id uuid primary key,
    order_id uuid not null,
    product_reference varchar(80) not null,
    quantity integer not null,
    unit_price numeric(15, 2) not null,

    constraint fk_order_items_order
        foreign key (order_id)
        references orders (id)
);

create index idx_order_items_order_id
    on order_items (order_id);
```

---

### 10. Criar status do pedido

```java
public enum OrderStatus {
    CREATED,
    CONFIRMED,
    CANCELLED
}
```

As transições serão controladas no domínio.

---

### 11. Criar entidade de domínio

```java
public final class Order {

    private final OrderId id;
    private final String customerReference;
    private final List<OrderItem> items;
    private final Instant createdAt;

    private OrderStatus status;
    private Instant updatedAt;
    private long version;

    public void confirm(
            Clock clock) {

        if (status != OrderStatus.CREATED) {
            throw new DomainException(
                    "Order cannot be confirmed");
        }

        status = OrderStatus.CONFIRMED;
        updatedAt = clock.instant();
        version++;
    }

    public void cancel(
            Clock clock) {

        if (status != OrderStatus.CREATED) {
            throw new DomainException(
                    "Order cannot be cancelled");
        }

        status = OrderStatus.CANCELLED;
        updatedAt = clock.instant();
        version++;
    }
}
```

Não inclua dados pessoais reais.

---

### 12. Criar request de entrada

```java
public record CreateOrderRequest(
        String customerReference,
        List<CreateOrderItemRequest> items) {
}
```

Validações:

- referência obrigatória;
- tamanho limitado;
- lista não vazia;
- quantidade positiva;
- preço positivo;
- máximo de itens por pedido.

---

### 13. Criar controller

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderApplicationService service;

    public OrderController(
            OrderApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @Valid
            @RequestBody
            CreateOrderRequest request) {

        OrderResponse response =
                service.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public OrderResponse findById(
            @PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping("/{id}/confirm")
    public OrderResponse confirm(
            @PathVariable UUID id) {
        return service.confirm(id);
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(
            @PathVariable UUID id) {
        return service.cancel(id);
    }
}
```

---

### 14. Criar tratamento de erros

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiError> handleDomain(
            DomainException exception,
            HttpServletRequest request) {

        ApiError error =
                ApiError.of(
                        "DOMAIN_RULE_VIOLATION",
                        "The requested operation is invalid",
                        request.getRequestURI());

        return ResponseEntity
                .unprocessableEntity()
                .body(error);
    }
}
```

Não devolva stack trace.

Não devolva mensagem bruta de banco.

---

### 15. Criar `ApiError`

```java
public record ApiError(
        String code,
        String message,
        String path,
        String requestId,
        Instant occurredAt) {

    public static ApiError of(
            String code,
            String message,
            String path) {

        return new ApiError(
                code,
                message,
                path,
                RequestContext.currentRequestId(),
                Instant.now());
    }
}
```

---

### 16. Criar policy de logs

Arquivo:

```text
contracts/observable-api-log-policy.yaml
```

Conteúdo:

```yaml
logs:
  format:
    structured:
      required

  requiredFields:
    - timestamp
    - level
    - service
    - environment
    - release
    - request-id
    - correlation-id
    - operation
    - outcome
    - duration-category

  forbidden:
    - password
    - token
    - authorization-header
    - customer-name
    - full-payload
    - SQL-parameter
    - stack-trace-in-success-log

  exception:
    stack:
      errorOnly:
        true
```

---

### 17. Criar request context

```java
public record RequestContext(
        String requestId,
        String correlationId) {

    private static final ThreadLocal<RequestContext>
            CURRENT =
            new ThreadLocal<>();

    public static void set(
            RequestContext context) {
        CURRENT.set(context);
    }

    public static RequestContext current() {
        return CURRENT.get();
    }

    public static String currentRequestId() {
        RequestContext context =
                CURRENT.get();

        return context == null
                ? "unavailable"
                : context.requestId();
    }

    public static void clear() {
        CURRENT.remove();
    }
}
```

O cleanup é obrigatório.

---

### 18. Criar filtro de contexto

```java
@Component
public class RequestContextFilter
        extends OncePerRequestFilter {

    private final CorrelationIdGenerator generator;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        String requestId =
                generator.generateRequestId();

        String correlationId =
                generator.resolveCorrelationId(
                        request.getHeader(
                                "X-Correlation-Id"));

        RequestContext context =
                new RequestContext(
                        requestId,
                        correlationId);

        long started =
                System.nanoTime();

        try {
            RequestContext.set(context);

            MDC.put(
                    "requestId",
                    requestId);

            MDC.put(
                    "correlationId",
                    correlationId);

            response.setHeader(
                    "X-Request-Id",
                    requestId);

            response.setHeader(
                    "X-Correlation-Id",
                    correlationId);

            chain.doFilter(
                    request,
                    response);

        } finally {
            long elapsed =
                    System.nanoTime()
                            - started;

            logRequestCompletion(
                    request,
                    response,
                    elapsed);

            MDC.clear();
            RequestContext.clear();
        }
    }
}
```

O `finally` evita vazamento de contexto em threads reutilizadas.

---

### 19. Validar correlation ID recebido

O valor recebido precisa:

- ter tamanho máximo;
- usar caracteres permitidos;
- não conter quebra de linha;
- não conter conteúdo de header adicional;
- não ser usado diretamente em nome de arquivo;
- ser substituído se inválido.

Exemplo:

```java
private static final Pattern SAFE_ID =
        Pattern.compile(
                "[A-Za-z0-9._-]{1,64}");
```

---

### 20. Criar sanitizador

```java
public final class SensitiveDataSanitizer {

    public String sanitize(
            String value) {

        if (value == null) {
            return "null";
        }

        String sanitized =
                value.replaceAll(
                        "(?i)bearer\\s+[a-z0-9._-]+",
                        "Bearer [REDACTED]");

        return sanitized.length() > 200
                ? sanitized.substring(0, 200)
                : sanitized;
    }
}
```

O sanitizador não substitui a decisão de não logar payloads.

---

### 21. Configurar log estruturado

Arquivo:

```xml
<configuration>
    <springProperty
        scope="context"
        name="serviceName"
        source="spring.application.name"/>

    <appender
        name="CONSOLE"
        class="ch.qos.logback.core.ConsoleAppender">

        <encoder>
            <pattern>
                {"timestamp":"%d{ISO8601}",
                "level":"%level",
                "service":"${serviceName}",
                "logger":"%logger{36}",
                "requestId":"%X{requestId}",
                "correlationId":"%X{correlationId}",
                "message":"%replace(%msg){'[\r\n]',' '}"}
                %n
            </pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

Na evolução do projeto, o encoder poderá ser substituído por uma solução JSON dedicada.

---

### 22. Definir eventos de log

Eventos mínimos:

```text
request.received;

request.completed;

order.create.started;

order.create.completed;

order.confirm.completed;

order.cancel.completed;

repository.operation.completed;

event.publish.completed;

application.startup.completed;

application.shutdown.started;

application.shutdown.completed.
```

Evite logs redundantes em cada linha do código.

---

### 23. Criar métricas de pedidos

```java
@Component
public final class OrderMetrics {

    private final MeterRegistry registry;

    public void created(
            String outcome) {

        registry.counter(
                "observable_orders_created_total",
                "outcome",
                outcome)
                .increment();
    }

    public Timer.Sample start() {
        return Timer.start(registry);
    }

    public void stop(
            Timer.Sample sample,
            String operation,
            String outcome) {

        sample.stop(
                Timer.builder(
                                "observable_order_operation_duration")
                        .tag(
                                "operation",
                                operation)
                        .tag(
                                "outcome",
                                outcome)
                        .register(registry));
    }
}
```

Labels devem ser bounded.

---

### 24. Criar policy de métricas

Arquivo:

```text
contracts/observable-api-metrics-policy.yaml
```

Conteúdo:

```yaml
metrics:
  required:
    - HTTP-duration
    - HTTP-errors
    - order-operation-duration
    - order-outcome-count
    - repository-duration
    - event-publish-duration
    - pending-events
    - datasource-active
    - datasource-idle
    - datasource-pending

  labels:
    allowed:
      - method
      - route
      - status-class
      - operation
      - outcome
      - repository-operation

    forbidden:
      - order-id
      - customer-reference
      - request-id
      - correlation-id
      - exception-message
      - raw-URL

  histogram:
    latency:
      required
```

---

### 25. Instrumentar application service

```java
@Service
public class OrderApplicationService {

    private final OrderRepository repository;
    private final OrderEventPublisher publisher;
    private final OrderMetrics metrics;
    private final Clock clock;

    public OrderResponse create(
            CreateOrderRequest request) {

        Timer.Sample sample =
                metrics.start();

        String outcome =
                "success";

        try {
            Order order =
                    OrderFactory.create(
                            request,
                            clock);

            repository.save(order);
            publisher.publishCreated(order);

            metrics.created(
                    "success");

            return OrderResponse.from(order);

        } catch (RuntimeException exception) {
            outcome = "failure";

            metrics.created(
                    "failure");

            throw exception;

        } finally {
            metrics.stop(
                    sample,
                    "create",
                    outcome);
        }
    }
}
```

---

### 26. Instrumentar repository

```java
@Component
public final class RepositoryMetrics {

    private final MeterRegistry registry;

    public <T> T measure(
            String operation,
            Supplier<T> supplier) {

        Timer.Sample sample =
                Timer.start(registry);

        String outcome =
                "success";

        try {
            return supplier.get();

        } catch (RuntimeException exception) {
            outcome = "failure";
            throw exception;

        } finally {
            sample.stop(
                    Timer.builder(
                                    "observable_repository_duration")
                            .tag(
                                    "operation",
                                    operation)
                            .tag(
                                    "outcome",
                                    outcome)
                            .register(registry));
        }
    }
}
```

---

### 27. Criar publisher sintético

```java
@Component
public final class InMemoryOrderEventPublisher
        implements OrderEventPublisher {

    private final BlockingQueue<OrderEvent>
            queue =
            new ArrayBlockingQueue<>(100);

    private final AtomicInteger pending =
            new AtomicInteger();

    @Override
    public void publishCreated(
            Order order) {

        OrderEvent event =
                OrderEvent.created(order);

        if (!queue.offer(event)) {
            throw new EventQueueFullException();
        }

        pending.incrementAndGet();
    }

    public int pendingEvents() {
        return pending.get();
    }
}
```

A fila é bounded.

A parte 2 poderá evoluir a integração operacional.

---

### 28. Criar gauge de fila

```java
@Component
public final class QueueMetrics {

    public QueueMetrics(
            MeterRegistry registry,
            InMemoryOrderEventPublisher publisher) {

        Gauge.builder(
                        "observable_order_events_pending",
                        publisher,
                        InMemoryOrderEventPublisher
                                ::pendingEvents)
                .register(registry);
    }
}
```

Não use ID de evento como label.

---

### 29. Criar health policy

Arquivo:

```text
contracts/observable-api-health-policy.yaml
```

Conteúdo:

```yaml
health:
  liveness:
    mustNotDependOn:
      - database
      - external-dependency

  readiness:
    dependOn:
      - database
      - event-publisher-capacity

  response:
    forbidden:
      - credential
      - SQL
      - hostname-sensitive
      - business-data

  failure:
    status:
      DOWN
```

---

### 30. Criar readiness do banco

```java
@Component
public final class DatabaseReadinessIndicator
        implements HealthIndicator {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Health health() {

        try {
            Integer value =
                    jdbcTemplate.queryForObject(
                            "select 1",
                            Integer.class);

            if (Integer.valueOf(1)
                    .equals(value)) {
                return Health.up()
                        .withDetail(
                                "category",
                                "database")
                        .build();
            }

            return Health.down()
                    .withDetail(
                            "category",
                            "database")
                    .build();

        } catch (DataAccessException exception) {
            return Health.down()
                    .withDetail(
                            "category",
                            "database")
                    .build();
        }
    }
}
```

Não devolva exception bruta.

---

### 31. Criar readiness do publisher

```java
@Component
public final class EventPublisherReadinessIndicator
        implements HealthIndicator {

    private final InMemoryOrderEventPublisher publisher;

    @Override
    public Health health() {

        int pending =
                publisher.pendingEvents();

        if (pending >= 90) {
            return Health.down()
                    .withDetail(
                            "category",
                            "event-capacity")
                    .build();
        }

        return Health.up()
                .withDetail(
                        "category",
                        "event-capacity")
                .build();
    }
}
```

O threshold é didático e deve ser documentado.

---

### 32. Separar liveness e readiness

Liveness responde:

```text
o processo está vivo?
```

Readiness responde:

```text
a instância pode receber tráfego?
```

Banco indisponível pode tornar readiness `DOWN`.

Isso não deve obrigatoriamente tornar liveness `DOWN`.

Caso contrário, o orquestrador pode reiniciar continuamente uma aplicação saudável diante de uma dependência indisponível.

---

### 33. Expor probes

Endpoints esperados:

```text
/actuator/health/liveness;

/actuator/health/readiness;

/actuator/health;

/actuator/info;

/actuator/prometheus.
```

Proteja exposição conforme ambiente.

A configuração local pode ser mais aberta do que produção.

---

### 34. Criar build info

Inclua:

```text
service;

version;

commit category;

build time;

Java version;

environment.
```

Não exponha:

- caminhos internos;
- usuário da máquina;
- secret;
- branch privada;
- URL de repositório restrito.

---

### 35. Criar endpoint operacional

```java
@RestController
@RequestMapping("/api/operations")
public class OperationalController {

    private final OperationalSummaryService service;

    @GetMapping("/summary")
    public OperationalSummaryResponse summary() {
        return service.summary();
    }
}
```

Resposta permitida:

```json
{
  "service": "observable-orders-api",
  "status": "RUNNING",
  "pendingEventsCategory": "LOW",
  "databaseCategory": "AVAILABLE"
}
```

Não exponha contadores internos sensíveis sem necessidade.

---

### 36. Criar graceful shutdown observer

```java
@Component
public final class GracefulShutdownObserver {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    GracefulShutdownObserver.class);

    @EventListener(
            ContextClosedEvent.class)
    public void onShutdown() {

        LOGGER.info(
                "event=application.shutdown.started");

        LOGGER.info(
                "event=application.shutdown.completed");
    }
}
```

O encerramento real também precisa fechar filas, executors e recursos.

---

### 37. Criar shutdown policy

Arquivo:

```text
contracts/observable-api-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewHTTP:
    required

  inFlightRequests:
    wait:
      bounded:
        required

  eventQueue:
    policy:
      required

  databasePool:
    close:
      required

  executors:
    terminate:
      required

  context:
    cleanup:
      required

  taskLeaks:
    zero:
      required
```

---

### 38. Criar security policy

Arquivo:

```text
contracts/observable-api-security-policy.yaml
```

Conteúdo:

```yaml
security:
  logs:
    forbidden:
      - password
      - token
      - authorization
      - cookie
      - payload
      - customer-reference

  metrics:
    businessIdentifier:
      forbidden

  health:
    internalDetail:
      forbidden

  errors:
    stackTrace:
      forbidden

  evidence:
    synthetic:
      required
```

---

### 39. Criar data quality policy

Arquivo:

```text
contracts/observable-api-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingCorrelationId:
    action:
      generate

  invalidCorrelationId:
    action:
      replace

  missingMetricOutcome:
    action:
      fail-test

  unknownHealthDependency:
    result:
      incomplete

  logWithoutOperation:
    result:
      limited

  singleScenario:
    result:
      limited
```

---

### 40. Criar failure policy

Arquivo:

```text
contracts/observable-api-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  repositoryUnavailable:
    readiness:
      DOWN

  queueFull:
    action:
      reject-explicitly

  domainError:
    HTTP:
      422

  notFound:
    HTTP:
      404

  unexpectedError:
    HTTP:
      500

  tracingFinal:
    deferredToLesson602

  optimization:
    deferredToLesson603
```

---

### 41. Criar cenários oficiais

Arquivo:

```text
contracts/observable-api-scenarios.yaml
```

Cenários:

```text
startup-success;

startup-database-unavailable;

create-order-success;

create-order-validation-error;

find-order-success;

find-order-not-found;

confirm-order-success;

confirm-invalid-state;

cancel-order-success;

invalid-correlation-id;

request-context-cleanup;

structured-log-success;

structured-log-error;

sensitive-data-redaction;

business-metric-success;

business-metric-failure;

repository-metric-success;

repository-metric-failure;

event-queue-pending;

event-queue-full;

liveness-up;

readiness-up;

readiness-database-down;

readiness-queue-capacity-down;

graceful-shutdown;

zero-task-leak.
```

---

### 42. Criar baseline report

Arquivo:

```text
reports/observable-api-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  service:
    observable-orders-api

  Java:
    version:
      21

  endpoints:
    functional:
      true

  logs:
    structured:
      true

  context:
    cleanup:
      true

  metrics:
    available:
      true

  health:
    liveness:
      UP

    readiness:
      UP

  shutdown:
    taskLeaks:
      zero

  result:
    PASS
```

---

### 43. Testar request context

```java
@Test
void shouldClearContextAfterRequest() {

    mockMvc.perform(
                    get("/api/orders/"
                            + UUID.randomUUID())
                            .header(
                                    "X-Correlation-Id",
                                    "test-correlation"))
            .andExpect(
                    header().exists(
                            "X-Request-Id"));

    assertNull(
            RequestContext.current());
}
```

---

### 44. Testar sanitização

Casos:

```text
Bearer token;

quebra de linha;

string longa;

authorization;

payload parcial;

valor nulo.
```

Confirme que nenhum segredo aparece no resultado.

---

### 45. Testar métricas

Fluxo:

1. executar criação com sucesso;
2. consultar `MeterRegistry`;
3. validar counter;
4. executar falha;
5. validar outcome;
6. confirmar labels bounded;
7. confirmar ausência de IDs.

---

### 46. Testar readiness

Com banco disponível:

```text
UP.
```

Com dependência simulada indisponível:

```text
DOWN.
```

A liveness deve continuar:

```text
UP.
```

---

### 47. Testar queue full

Preencha a fila bounded.

Execute nova criação.

Confirme:

- falha explícita;
- counter de rejeição;
- readiness degradada conforme policy;
- nenhum item perdido silenciosamente;
- log sanitizado;
- resposta estável.

---

### 48. Testar graceful shutdown

Valide:

- nova entrada bloqueada;
- requests em andamento recebem janela bounded;
- fila segue sua policy;
- datasource fecha;
- contextos são removidos;
- não existem threads residuais;
- processo termina.

---

### 49. Criar matriz de testes

Arquivo:

```text
docs/OBSERVABLE_API_TEST_MATRIX.md
```

Cobertura:

- startup;
- migrations;
- create;
- find;
- confirm;
- cancel;
- validation;
- not found;
- domain error;
- unexpected error;
- request ID;
- correlation ID;
- invalid header;
- MDC cleanup;
- structured logs;
- sanitization;
- business metrics;
- repository metrics;
- queue metrics;
- health;
- liveness;
- readiness;
- build info;
- shutdown;
- task leaks;
- evidence.

---

### 50. Criar troubleshooting

Arquivo:

```text
docs/OBSERVABLE_API_TROUBLESHOOTING.md
```

Inclua:

- PostgreSQL não sobe;
- migration falha;
- actuator retorna 404;
- Prometheus endpoint ausente;
- correlation ID não aparece;
- MDC vaza entre requests;
- log deixa de ser JSON válido;
- métrica não aparece;
- label contém ID;
- readiness e liveness ficam iguais;
- fila cheia não altera status;
- shutdown não termina;
- teste deixa thread viva;
- tracing da parte 2 foi antecipado;
- otimização da parte 3 foi antecipada.

---

### 51. Executar validação completa

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-contract.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\run-observable-api.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-logs.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-metrics.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-health.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-readiness.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-liveness.ps1

.\scripts\projects\observable-orders-api\validate-observable-api-shutdown.ps1

.\scripts\projects\observable-orders-api\scan-observable-api-output.ps1

.\scripts\projects\observable-orders-api\collect-observable-api-evidence.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-baseline.ps1

.\scripts\projects\observable-orders-api\stop-observable-api-dependencies.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 52. Criar gate

O gate valida:

```text
contrato;

build;

migrations;

API;

tratamento de erros;

logs;

contexto;

sanitização;

métricas;

health;

liveness;

readiness;

build info;

shutdown;

task leaks;

segurança;

evidence.
```

Status:

```text
PASS;

FAIL_BUILD;

FAIL_MIGRATION;

FAIL_API;

FAIL_LOGGING;

FAIL_CONTEXT;

FAIL_METRICS;

FAIL_HEALTH;

FAIL_READINESS;

FAIL_LIVENESS;

FAIL_SHUTDOWN;

FAIL_TASK_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 53. Coletar evidence

Arquivo:

```text
contracts/observable-api-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- environment;
- release category;
- build status;
- migration status;
- API status;
- logging status;
- context status;
- metrics status;
- health status;
- readiness status;
- liveness status;
- shutdown status;
- task leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- request body;
- customer reference;
- order ID real;
- token;
- password;
- connection string;
- SQL com parâmetros;
- raw logs;
- implementação da aula 602;
- otimizações da aula 603.

---

### 54. Encerrar o laboratório

Confirme:

- API encerrada;
- PostgreSQL local encerrado;
- datasource fechado;
- fila tratada;
- nenhuma thread residual;
- nenhum contexto residual;
- `.env` fora do Git;
- logs brutos fora do Git;
- evidence sanitizada;
- baseline aprovada.

---

## Entendendo o que foi feito

### O projeto ganhou contrato

A API passou a ter requisitos operacionais verificáveis.

### O domínio ganhou simplicidade

Pedidos sintéticos mantiveram o foco em observabilidade.

### Os logs ganharam estrutura

Request, correlation, operation, outcome e duração passaram a ser pesquisáveis.

### O contexto ganhou lifecycle

MDC e `ThreadLocal` passaram a ser limpos em `finally`.

### As métricas ganharam limites

Labels foram restringidas a conjuntos bounded.

### O repository ganhou tempo próprio

Latência de persistência deixou de ficar escondida no tempo total.

### A fila ganhou visibilidade

Pending events e capacidade passaram a produzir sinal operacional.

### Health ganhou significado

Liveness e readiness deixaram de representar a mesma coisa.

### O erro ganhou contrato

A API deixou de devolver detalhes internos ou stacks.

### O shutdown ganhou validação

A aplicação passou a encerrar sem task leaks.

### A próxima parte ganhou fronteira

Tracing completo, dashboards e operação integrada ficam para a aula 602.

---

## Erros comuns importantes

### Começar pelo dashboard

Sem sinais confiáveis, o dashboard apenas organiza dados ruins.

### Usar correlation ID como label

A cardinalidade cresce por request.

### Logar payload completo

Dados sensíveis e volume aumentam.

### Não limpar MDC

Contexto de uma request pode aparecer em outra.

### Tornar liveness dependente do banco

Uma indisponibilidade externa pode gerar restart loop.

### Expor detalhes no health

Informações internas podem vazar.

### Criar fila ilimitada

Backpressure vira memória e latência.

### Contar apenas sucesso

Falhas e rejeições desaparecem das métricas.

### Medir apenas controller

Repository, fila e aplicação ficam sem decomposição.

### Antecipar otimização

A baseline ainda precisa ser consolidada nas partes seguintes.

---

## Comandos úteis

### Subir dependências

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1
```

### Executar testes

```powershell
.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1
```

### Validar métricas

```powershell
.\scripts\projects\observable-orders-api\validate-observable-api-metrics.ps1
```

### Validar readiness

```powershell
.\scripts\projects\observable-orders-api\validate-observable-api-readiness.ps1
```

### Validar shutdown

```powershell
.\scripts\projects\observable-orders-api\validate-observable-api-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Estrutura

Crie o projeto e os contratos.

### Parte 2 — Domínio

Implemente pedidos sintéticos e transições.

### Parte 3 — Persistência

Crie migrations e repository.

### Parte 4 — API

Implemente endpoints e erros.

### Parte 5 — Contexto

Adicione request ID, correlation ID e cleanup.

### Parte 6 — Logs

Produza eventos estruturados e sanitizados.

### Parte 7 — Métricas

Instrumente negócio, repository e fila.

### Parte 8 — Health

Separe health, liveness e readiness.

### Parte 9 — Shutdown

Encerre recursos sem leaks.

### Parte 10 — Gate

Valide contrato, testes e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 600 e ponte para a aula 602 foram preservadas;
- a estrutura oficial da API observável foi criada;
- o projeto utiliza Java 21 e a baseline tecnológica da formação;
- domínio e dados são sintéticos;
- migrations de pedidos e itens foram criadas;
- endpoints de criação, consulta, confirmação e cancelamento foram definidos;
- transições inválidas produzem erro estável;
- stack traces e mensagens internas não são retornados;
- contrato principal e policies foram criados;
- request ID é gerado por request;
- correlation ID recebido é validado;
- correlation ID inválido é substituído;
- request ID e correlation ID retornam em headers;
- MDC e ThreadLocal são limpos em `finally`;
- logs são estruturados e sanitizados;
- payloads, tokens, passwords e identificadores não são logados;
- métricas de negócio possuem outcome;
- métricas de repository possuem operação e outcome;
- métricas de fila possuem gauge bounded;
- nenhuma métrica usa IDs como labels;
- health, liveness e readiness foram separados;
- banco indisponível derruba readiness sem derrubar liveness;
- fila próxima da capacidade afeta readiness conforme policy;
- build info não expõe dados sensíveis;
- graceful shutdown foi configurado;
- zero task leaks foram validados;
- matriz, troubleshooting, gate e evidence foram criados;
- `.env`, raw logs e credenciais não foram commitados;
- tracing completo, dashboards finais e alertas finais não foram antecipados;
- otimizações da parte 3 não foram antecipadas;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api `
  scripts/projects/observable-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|rawPayload|DATABASE_PASSWORD=observable_password|traceIdLabel|orderIdLabel|rawLogFile"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): iniciar API observavel parte 1"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- `.env`;
- credenciais;
- dados reais;
- raw logs;
- IDs como labels;
- dashboards finais;
- alertas finais;
- tracing definitivo;
- otimizações;
- material das aulas 602 e 603.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você iniciou a API observável pela fundação.

Você construiu:

```text
contrato;

estrutura;

domínio sintético;

migrations;

endpoints;

erros;

request ID;

correlation ID;

MDC;

logs estruturados;

sanitização;

métricas de negócio;

métricas de repository;

métricas de fila;

health;

liveness;

readiness;

build info;

graceful shutdown;

gate;

evidence.
```

Você comprovou que observabilidade começa antes de dashboards; que contexto precisa ser validado e limpo; que logs não podem carregar dados sensíveis; que métricas precisam de labels bounded; que health, readiness e liveness têm funções diferentes; que fila bounded precisa de sinal operacional; e que shutdown faz parte da confiabilidade.

A próxima aula será:

```text
602 - M18.47 - Projeto API observavel parte 2
```

Nela, você irá evoluir a aplicação com tracing, propagação de contexto entre componentes, correlação entre sinais, Prometheus, Grafana, dashboards, SLOs, alertas e cenários de degradação controlada.

Nenhum tracing completo, dashboard definitivo, alerta definitivo, SLO final ou cenário integrado da parte 2 foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contrato e estrutura.
- [ ] Implementei domínio e endpoints.
- [ ] Configurei migrations.
- [ ] Adicionei request e correlation ID.
- [ ] Estruturei e sanitizei logs.
- [ ] Instrumentei métricas bounded.
- [ ] Separei liveness e readiness.
- [ ] Validei shutdown sem task leaks.

---

## Troubleshooting adicional

### Migration não inicia

Confirme URL, usuário, password local, banco e versão dos scripts.

### Correlation ID não aparece

Revise filtro, ordem dos filtros e headers.

### Contexto vaza

Garanta `MDC.clear()` e `RequestContext.clear()` em `finally`.

### Métrica não é encontrada

Confirme registro do bean, nome, endpoint Prometheus e cenário executado.

### Readiness fica sempre UP

Revise indicadores customizados e grupos de health.

### Liveness cai com banco

Remova dependências externas do grupo de liveness.

### Log JSON quebra

Sanitize quebras de linha e use encoder apropriado.

### Fila cheia perde evento

A rejeição precisa ser explícita e medida.

### Shutdown fica preso

Revise requests em andamento, filas, datasource e executors.

### O projeto começou a criar dashboards finais

Preserve essa evolução para a aula 602.

---

## Perguntas de revisão

1. O que significa observabilidade por construção?
2. Qual diferença entre request ID e correlation ID?
3. Por que validar correlation ID recebido?
4. Por que limpar MDC?
5. O que é structured log?
6. Por que não logar payload?
7. O que é label bounded?
8. Por que request ID não pode ser label?
9. Qual diferença entre health e readiness?
10. Qual diferença entre readiness e liveness?
11. Banco indisponível deve derrubar liveness?
12. O que uma métrica de negócio mede?
13. O que uma métrica técnica mede?
14. Por que instrumentar repository?
15. Por que a fila deve ser bounded?
16. O que deve acontecer quando a fila enche?
17. O que é graceful shutdown?
18. O que o gate valida?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Instrumentar durante o desenho.
2. Request individual versus jornada correlacionada.
3. Evitar injeção, cardinalidade e valores inválidos.
4. Impedir vazamento entre requests.
5. Log com campos pesquisáveis.
6. Segurança, volume e privacidade.
7. Label com conjunto limitado de valores.
8. Cada request cria uma série.
9. Estado geral versus aptidão para tráfego.
10. Pronta para tráfego versus processo vivo.
11. Não necessariamente.
12. Resultado funcional.
13. Comportamento de infraestrutura.
14. Separar persistência do tempo total.
15. Impedir crescimento ilimitado.
16. Rejeição explícita e observável.
17. Encerramento coordenado.
18. Contrato, sinais, segurança e cleanup.
19. Projeto API observável parte 2.
20. Projeto API observável parte 2.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 601 - M18.46 - Projeto API observavel parte 1

- Iniciei o projeto final do módulo.
- Criei o contrato operacional da API observável.
- Estruturei o projeto `observable-orders-api`.
- Modelei pedidos sintéticos e transições de status.
- Criei migrations PostgreSQL.
- Implementei endpoints de criação, consulta, confirmação e cancelamento.
- Criei tratamento centralizado de erros.
- Adicionei request ID e correlation ID.
- Validei e normalizei headers de correlação.
- Implementei cleanup de MDC e ThreadLocal.
- Configurei logs estruturados e sanitização.
- Instrumentei métricas de negócio, repository e fila.
- Proibi labels de alta cardinalidade.
- Criei health, liveness e readiness.
- Adicionei build info seguro.
- Configurei graceful shutdown.
- Criei testes, scripts, gate e evidence sanitizada.
- Não antecipei tracing, dashboards ou alertas finais.
- Próxima aula: Projeto API observável parte 2.
```

---

## Referência técnica curta

- Spring Boot Actuator.
- Micrometer.
- Prometheus metrics.
- Structured logging.
- MDC.
- Correlation IDs.
- Health indicators.
- Liveness and readiness probes.
- Graceful shutdown.
- Operational contracts.

Regra final:

```text
a primeira parte da API observável precisa estabelecer sinais confiáveis antes de qualquer dashboard: o projeto possui domínio sintético, migrations, endpoints, erros estáveis, request ID, correlation ID validado, contexto local com cleanup em finally, logs estruturados e sanitizados, métricas de negócio, repository e fila com labels bounded, health, liveness, readiness, build info, graceful shutdown, testes, scripts, gate e evidence; payloads, credentials, IDs de negócio e valores por request não entram em logs ou labels, banco e capacidade da fila podem derrubar readiness sem transformar dependência externa em falha de liveness, e fila cheia produz rejeição explícita em vez de perda silenciosa; a baseline termina com zero task leaks e recursos fechados, enquanto tracing completo, correlação entre sinais, Prometheus e Grafana integrados, dashboards, SLOs, alertas e cenários de degradação ficam para a aula 602, e otimização permanece reservada à aula 603.
```
