# 556 - M18.01 - Logs estruturados

## Apresentação da aula

O Módulo 17 terminou com uma aplicação capaz de atravessar um fluxo completo de entrega:

```text
source;

build;

testes;

artifact;

imagem;

Kubernetes;

release;

deploy;

smoke test;

rollback;

evidence.
```

Esse fluxo resolveu uma pergunta importante:

```text
como entregar
a aplicação
com segurança operacional?
```

O Módulo 18 começa com outra pergunta:

```text
quando a aplicação
está executando,

como descobrir
o que aconteceu?
```

Em ambiente local, é comum acompanhar o console e reconhecer rapidamente o fluxo.

Em produção, a realidade é diferente:

- várias instâncias executam ao mesmo tempo;
- requisições se misturam;
- consumers processam mensagens em paralelo;
- dependências falham de formas diferentes;
- o volume de eventos cresce;
- um incidente precisa ser investigado depois;
- o operador não possui a IDE;
- logs são coletados por ferramentas;
- dados sensíveis não podem ser expostos;
- o texto precisa ser consultável por campos.

Um log como:

```text
deu erro no pedido
```

não permite responder:

- qual pedido;
- qual operação;
- qual resultado;
- qual dependência;
- qual duração;
- qual versão;
- qual ambiente;
- qual tipo de falha;
- se pode haver retry;
- se houve exposição de dado.

Logs estruturados transformam o registro em um evento com significado operacional.

Exemplo conceitual:

```json
{
  "timestamp": "2026-01-01T10:15:30.000Z",
  "level": "INFO",
  "application": "orders-api",
  "environment": "local",
  "release_id": "orders-api-local",
  "event": "order.created",
  "order_id": "ord-123",
  "customer_id": "cus-456",
  "duration_ms": 42,
  "outcome": "success",
  "message": "Order created"
}
```

Agora é possível consultar:

```text
event = order.created;

outcome = failure;

duration_ms > 500;

release_id = orders-api-1.0.0-a1b2c3d.
```

A pergunta central desta aula será:

```text
como registrar
eventos estruturados

que sejam úteis
para operação,
diagnóstico,
auditoria técnica
e observabilidade

sem expor dados
e sem transformar
o código em ruído?
```

Você irá preparar a `orders-api` para produzir logs consistentes e verificáveis.

A aula abordará:

- evento de log;
- mensagem e campos;
- estrutura JSON;
- key-value logging;
- níveis;
- nomes de eventos;
- outcome;
- duração;
- identidade da aplicação;
- ambiente;
- release;
- exceções;
- sanitização;
- dados pessoais;
- Secrets;
- cardinalidade;
- volume;
- testes;
- configuração por ambiente;
- troubleshooting;
- contrato de logging.

A aula não aprofundará:

- geração de correlation ID;
- propagação entre serviços;
- trace ID;
- span ID;
- OpenTelemetry;
- distributed tracing;
- baggage;
- amostragem de traces.

Esses assuntos pertencem à próxima aula oficial:

```text
557 - M18.02 - Correlation ID trace ID
```

Nesta aula, campos de contexto já existentes poderão aparecer no output, mas sua criação e propagação não serão implementadas antecipadamente.

A regra central será:

```text
cada log
precisa representar
um evento relevante,

com nome estável,
campos úteis,
nível correto
e conteúdo seguro.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
555:
Fechamento do Modulo 17.

556:
Logs estruturados.

557:
Correlation ID trace ID.
```

A aula 555 encerrou o ciclo de entrega.

A aula 556 inicia o ciclo de observabilidade.

O novo módulo irá aprofundar:

```text
logs;

métricas;

tracing;

performance;

concorrência;

diagnóstico;

produção;

runbooks.
```

Nesta aula:

```text
SLF4J:
sim.

Logback:
sim.

event names:
sim.

key-value:
sim.

JSON:
sim.

levels:
sim.

exceptions:
sim.

sanitization:
sim.

PII:
sim.

Secrets:
sim.

cardinality:
sim.

tests:
sim.

correlation ID generation:
não.

trace ID propagation:
não.

metrics:
não.

distributed tracing:
não.
```

A progressão será:

```text
1.
entender log como evento.

2.
definir contrato.

3.
configurar saída.

4.
instrumentar casos relevantes.

5.
proteger dados.

6.
testar.

7.
diagnosticar.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
src/main/java
└── .../observability/logging
    ├── LogEventNames.java
    ├── LogFieldNames.java
    ├── LogOutcome.java
    ├── SafeLogValue.java
    ├── LoggingSanitizer.java
    └── OperationalLogger.java

src/main/resources
├── application-observability.yml
└── logback-spring.xml

src/test/java
└── .../observability/logging
    ├── LoggingSanitizerTest.java
    ├── OperationalLoggerTest.java
    └── StructuredLoggingContractTest.java

observability/logging
├── structured-logging-contract.yaml
├── log-level-policy.yaml
├── log-data-classification.yaml
├── log-event-catalog.yaml
├── log-volume-policy.yaml
├── log-exception-policy.yaml
└── structured-logging-evidence.yaml

scripts/observability/logging
├── validate-log-configuration.ps1
├── validate-log-event-catalog.ps1
├── validate-log-levels.ps1
├── scan-logs-for-sensitive-data.ps1
├── simulate-structured-log-events.ps1
├── verify-structured-log-output.ps1
├── collect-structured-logging-evidence.ps1
└── verify-structured-logging-baseline.ps1

docs/observability/logging
├── STRUCTURED_LOGGING.md
├── LOG_EVENT_CATALOG.md
├── LOG_LEVEL_POLICY.md
├── LOG_DATA_PROTECTION.md
├── LOGGING_TEST_MATRIX.md
└── LOGGING_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de logging;

catálogo de eventos;

campos padronizados;

níveis definidos;

saída estruturada;

sanitização;

exceções seguras;

testes automatizados;

scan de dados sensíveis;

evidence.
```

Você irá:

1. revisar a baseline;
2. definir eventos;
3. definir campos;
4. definir outcomes;
5. definir níveis;
6. classificar dados;
7. configurar output;
8. criar utilitários;
9. instrumentar fluxo HTTP;
10. instrumentar regra de negócio;
11. instrumentar persistência;
12. instrumentar mensageria;
13. registrar exceções;
14. medir duração;
15. evitar duplicação;
16. evitar cardinalidade excessiva;
17. testar estrutura;
18. testar sanitização;
19. simular eventos;
20. coletar evidence;
21. executar o gate;
22. commitar;
23. preparar a aula 557.

---

## Conceito essencial

### Log event

Registro de uma ocorrência relevante no sistema.

---

### Structured log

Log representado por campos estáveis e consultáveis.

---

### Event name

Identificador semântico e estável do evento.

Exemplo:

```text
order.created.
```

---

### Message

Descrição humana curta do evento.

---

### Field

Atributo estruturado usado para consulta e análise.

---

### Outcome

Resultado do evento.

Exemplos:

```text
success;

failure;

rejected;

timeout;

cancelled.
```

---

### Log level

Classificação da importância operacional do evento.

---

### Cardinality

Quantidade de valores distintos de um campo.

---

### PII

Informação que identifica ou pode ajudar a identificar uma pessoa.

---

### Secret

Credencial ou material que permite acesso ou autenticação.

---

### Sanitization

Processo de remover, mascarar ou rejeitar conteúdo inseguro.

---

### Log contract

Regras que definem formato, campos, eventos, níveis e proteção.

---

## Mão na massa guiada

### 1. Validar a baseline do projeto

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Confirme:

- Java 21;
- build aprovado;
- testes aprovados;
- aplicação inicia;
- endpoint de release existe;
- environment está resolvido;
- nenhum Secret real;
- logs atuais conhecidos;
- configuração anterior preservada.

Inicie localmente:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability"
```

Observe o formato atual antes de alterar.

Registre:

- timestamp;
- level;
- logger;
- thread;
- message;
- application;
- environment;
- release;
- event;
- outcome.

O estado anterior será comparado com o novo.

---

### 2. Tratar log como evento

Evite mensagens soltas:

```java
log.info("Pedido criado");
```

Prefira um evento identificável:

```java
log.atInfo()
    .addKeyValue("event", "order.created")
    .addKeyValue("order_id", orderId)
    .addKeyValue("outcome", "success")
    .log("Order created");
```

O texto humano pode mudar.

O nome do evento deve permanecer estável.

Consultas e alertas devem depender de campos, não de frases frágeis.

---

### 3. Criar catálogo de nomes

Arquivo:

```text
LogEventNames.java
```

Exemplo:

```java
package com.formacao.orders.observability.logging;

public final class LogEventNames {

    public static final String APPLICATION_STARTED =
            "application.started";

    public static final String HTTP_REQUEST_COMPLETED =
            "http.request.completed";

    public static final String ORDER_CREATION_STARTED =
            "order.creation.started";

    public static final String ORDER_CREATED =
            "order.created";

    public static final String ORDER_CREATION_REJECTED =
            "order.creation.rejected";

    public static final String ORDER_CREATION_FAILED =
            "order.creation.failed";

    public static final String DATABASE_OPERATION_COMPLETED =
            "database.operation.completed";

    public static final String MESSAGE_PROCESSING_COMPLETED =
            "message.processing.completed";

    private LogEventNames() {
    }
}
```

O catálogo evita variações como:

```text
order-created;

order_created;

created-order;

pedido.criado.
```

Escolha uma convenção e mantenha.

Nesta aula:

```text
domínio.ação
```

será a convenção principal.

---

### 4. Criar catálogo de campos

Arquivo:

```text
LogFieldNames.java
```

Exemplo:

```java
package com.formacao.orders.observability.logging;

public final class LogFieldNames {

    public static final String EVENT = "event";
    public static final String OUTCOME = "outcome";
    public static final String APPLICATION = "application";
    public static final String ENVIRONMENT = "environment";
    public static final String RELEASE_ID = "release_id";
    public static final String ORDER_ID = "order_id";
    public static final String CUSTOMER_ID = "customer_id";
    public static final String OPERATION = "operation";
    public static final String DURATION_MS = "duration_ms";
    public static final String ERROR_TYPE = "error_type";
    public static final String ERROR_CODE = "error_code";
    public static final String RETRYABLE = "retryable";
    public static final String HTTP_METHOD = "http_method";
    public static final String HTTP_ROUTE = "http_route";
    public static final String HTTP_STATUS = "http_status";

    private LogFieldNames() {
    }
}
```

Use nomes:

- em minúsculas;
- com `snake_case`;
- semanticamente estáveis;
- sem espaços;
- sem abreviações obscuras.

---

### 5. Definir outcomes

Arquivo:

```text
LogOutcome.java
```

Conteúdo:

```java
package com.formacao.orders.observability.logging;

public enum LogOutcome {
    SUCCESS("success"),
    FAILURE("failure"),
    REJECTED("rejected"),
    TIMEOUT("timeout"),
    CANCELLED("cancelled");

    private final String value;

    LogOutcome(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
```

Evite outcomes diferentes para o mesmo significado.

Exemplo ruim:

```text
ok;

done;

completed;

success.
```

---

### 6. Criar contrato de logs

Arquivo:

```text
structured-logging-contract.yaml
```

Conteúdo:

```yaml
logging:
  format:
    machineReadable:
      required

  timestamp:
    timezone:
      UTC

  requiredFields:
    - timestamp
    - level
    - application
    - environment
    - release_id
    - event
    - outcome
    - message

  naming:
    event:
      convention:
        domain-action

    fields:
      convention:
        snake_case

  sensitiveData:
    secrets:
      forbidden

    personalData:
      minimized

  exception:
    type:
      requiredOnFailure

    stackTrace:
      controlled

  context:
    correlationId:
      acceptedWhenPresent

    traceId:
      deferredToLesson557
```

O contrato define o mínimo esperado.

---

### 7. Definir política de níveis

Arquivo:

```text
log-level-policy.yaml
```

Regras:

```yaml
levels:
  ERROR:
    useWhen:
      - operation-failed
      - operator-action-required
      - invariant-broken

  WARN:
    useWhen:
      - degraded-behavior
      - recoverable-anomaly
      - rejected-input-with-operational-impact

  INFO:
    useWhen:
      - business-milestone
      - lifecycle-change
      - deployment-identity
      - operation-completed

  DEBUG:
    useWhen:
      - diagnostic-detail
      - decision-branch
      - internal-state-without-sensitive-data

  TRACE:
    useWhen:
      - highly-detailed-local-diagnosis
```

Não use `ERROR` para erro de validação esperado do cliente.

Não use `INFO` em cada linha do método.

Não use `DEBUG` para esconder dados sensíveis.

---

### 8. Configurar profile de observabilidade

Arquivo:

```text
application-observability.yml
```

Conteúdo conceitual:

```yaml
logging:
  level:
    root: INFO
    com.formacao.orders: INFO

  structured:
    format:
      console: logstash

spring:
  application:
    name: orders-api
```

Em versões modernas do Spring Boot, a saída estruturada pode ser habilitada por configuração.

Quando a versão usada no projeto não oferecer esse recurso, use o encoder JSON aprovado pelo projeto e preserve o mesmo contrato.

Não acople o código de negócio a uma implementação de encoder.

---

### 9. Criar configuração Logback

Arquivo:

```text
logback-spring.xml
```

Estrutura:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <springProperty
        scope="context"
        name="applicationName"
        source="spring.application.name"
        defaultValue="orders-api"/>

    <springProperty
        scope="context"
        name="environment"
        source="app.environment"
        defaultValue="unknown"/>

    <springProperty
        scope="context"
        name="releaseId"
        source="app.release-id"
        defaultValue="unknown"/>

    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <springProfile name="local">
        <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>

        <root level="INFO">
            <appender-ref ref="CONSOLE"/>
        </root>
    </springProfile>

    <springProfile name="observability">
        <!--
        Configure aqui o appender estruturado aprovado
        pela versão do projeto.
        -->
    </springProfile>

</configuration>
```

O arquivo precisa respeitar o mecanismo adotado pelo projeto.

Não mantenha duas configurações conflitantes para o mesmo appender.

---

### 10. Definir contexto fixo da aplicação

Campos fixos:

```text
application;

environment;

release_id.
```

Eles podem vir de:

- `spring.application.name`;
- properties tipadas;
- variáveis de ambiente;
- configuração da plataforma.

Nunca derive `release_id` de uma frase manual.

O valor precisa ser o mesmo usado em:

- artifact;
- image labels;
- manifests;
- endpoint de release;
- evidence.

---

### 11. Criar sanitizador

Arquivo:

```text
LoggingSanitizer.java
```

Exemplo:

```java
package com.formacao.orders.observability.logging;

import java.util.Objects;
import java.util.regex.Pattern;

public final class LoggingSanitizer {

    private static final Pattern CONTROL_CHARACTERS =
            Pattern.compile("[\\r\\n\\t]");

    private static final int MAX_LENGTH = 160;

    private LoggingSanitizer() {
    }

    public static String safeIdentifier(String value) {
        if (value == null || value.isBlank()) {
            return "unknown";
        }

        var normalized = CONTROL_CHARACTERS
                .matcher(value)
                .replaceAll("_")
                .trim();

        if (normalized.length() > MAX_LENGTH) {
            return normalized.substring(0, MAX_LENGTH);
        }

        return normalized;
    }

    public static String maskEmail(String value) {
        if (value == null || !value.contains("@")) {
            return "masked";
        }

        var parts = value.split("@", 2);
        var domain = parts[1];

        return "***@" + domain;
    }

    public static String requireSafeValue(String value) {
        return safeIdentifier(Objects.requireNonNull(value));
    }
}
```

Sanitização não autoriza registrar qualquer dado.

Primeiro pergunte:

```text
o campo é necessário?
```

Só depois considere mascaramento.

---

### 12. Criar wrapper de valor seguro

Arquivo:

```text
SafeLogValue.java
```

Exemplo:

```java
package com.formacao.orders.observability.logging;

public record SafeLogValue(String value) {

    public SafeLogValue {
        value = LoggingSanitizer.safeIdentifier(value);
    }

    public static SafeLogValue of(String value) {
        return new SafeLogValue(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
```

O wrapper torna explícita a intenção de sanitização.

Ele não deve ser usado para senhas, tokens ou documentos completos.

Esses dados devem permanecer ausentes.

---

### 13. Criar classificação de dados

Arquivo:

```text
log-data-classification.yaml
```

Conteúdo:

```yaml
data:
  public:
    examples:
      - application-name
      - event-name

  internal:
    examples:
      - release-id
      - route-template
      - operation-name

  confidential:
    examples:
      - customer-id
      - order-id

    logging:
      allowed:
        conditional-and-minimized

  restricted:
    examples:
      - password
      - access-token
      - refresh-token
      - private-key
      - session-cookie
      - credit-card-number

    logging:
      forbidden
```

Identificadores de domínio também precisam de governança.

---

### 14. Criar serviço de logging operacional

Arquivo:

```text
OperationalLogger.java
```

Exemplo:

```java
package com.formacao.orders.observability.logging;

import java.time.Duration;
import org.slf4j.Logger;

public final class OperationalLogger {

    private OperationalLogger() {
    }

    public static void completed(
            Logger logger,
            String event,
            String operation,
            Duration duration) {

        logger.atInfo()
                .addKeyValue(
                        LogFieldNames.EVENT,
                        event)
                .addKeyValue(
                        LogFieldNames.OPERATION,
                        operation)
                .addKeyValue(
                        LogFieldNames.OUTCOME,
                        LogOutcome.SUCCESS.value())
                .addKeyValue(
                        LogFieldNames.DURATION_MS,
                        duration.toMillis())
                .log("Operation completed");
    }

    public static void failed(
            Logger logger,
            String event,
            String operation,
            Duration duration,
            Throwable error) {

        logger.atError()
                .setCause(error)
                .addKeyValue(
                        LogFieldNames.EVENT,
                        event)
                .addKeyValue(
                        LogFieldNames.OPERATION,
                        operation)
                .addKeyValue(
                        LogFieldNames.OUTCOME,
                        LogOutcome.FAILURE.value())
                .addKeyValue(
                        LogFieldNames.DURATION_MS,
                        duration.toMillis())
                .addKeyValue(
                        LogFieldNames.ERROR_TYPE,
                        error.getClass().getSimpleName())
                .log("Operation failed");
    }
}
```

O helper padroniza eventos repetidos.

Não o transforme em uma abstração que esconde o significado do domínio.

---

### 15. Instrumentar criação de pedido

Exemplo no application service:

```java
var startedAt = System.nanoTime();

log.atDebug()
        .addKeyValue(
                LogFieldNames.EVENT,
                LogEventNames.ORDER_CREATION_STARTED)
        .addKeyValue(
                LogFieldNames.ORDER_ID,
                LoggingSanitizer.safeIdentifier(orderId))
        .addKeyValue(
                LogFieldNames.OUTCOME,
                "started")
        .log("Order creation started");

try {
    var order = createOrder(command);

    var duration = Duration.ofNanos(
            System.nanoTime() - startedAt);

    log.atInfo()
            .addKeyValue(
                    LogFieldNames.EVENT,
                    LogEventNames.ORDER_CREATED)
            .addKeyValue(
                    LogFieldNames.ORDER_ID,
                    order.id())
            .addKeyValue(
                    LogFieldNames.OUTCOME,
                    LogOutcome.SUCCESS.value())
            .addKeyValue(
                    LogFieldNames.DURATION_MS,
                    duration.toMillis())
            .log("Order created");

    return order;
} catch (BusinessRuleException exception) {
    var duration = Duration.ofNanos(
            System.nanoTime() - startedAt);

    log.atWarn()
            .addKeyValue(
                    LogFieldNames.EVENT,
                    LogEventNames.ORDER_CREATION_REJECTED)
            .addKeyValue(
                    LogFieldNames.OUTCOME,
                    LogOutcome.REJECTED.value())
            .addKeyValue(
                    LogFieldNames.ERROR_CODE,
                    exception.code())
            .addKeyValue(
                    LogFieldNames.DURATION_MS,
                    duration.toMillis())
            .log("Order creation rejected");

    throw exception;
}
```

A rejeição de negócio pode ser `WARN` ou `INFO` conforme impacto operacional.

Documente a escolha.

---

### 16. Registrar falha inesperada

Exemplo:

```java
catch (RuntimeException exception) {
    var duration = Duration.ofNanos(
            System.nanoTime() - startedAt);

    log.atError()
            .setCause(exception)
            .addKeyValue(
                    LogFieldNames.EVENT,
                    LogEventNames.ORDER_CREATION_FAILED)
            .addKeyValue(
                    LogFieldNames.ORDER_ID,
                    LoggingSanitizer.safeIdentifier(orderId))
            .addKeyValue(
                    LogFieldNames.OUTCOME,
                    LogOutcome.FAILURE.value())
            .addKeyValue(
                    LogFieldNames.ERROR_TYPE,
                    exception.getClass().getSimpleName())
            .addKeyValue(
                    LogFieldNames.DURATION_MS,
                    duration.toMillis())
            .log("Order creation failed");

    throw exception;
}
```

Não use:

```java
log.error(
    "Erro: {}",
    exception.getMessage());
```

Esse formato pode perder stack trace.

Use `setCause` ou o overload correto.

---

### 17. Evitar duplicação de exceções

Uma mesma exceção pode passar por:

```text
repository;

service;

controller advice.
```

Registrar stack trace em todas as camadas gera ruído.

Regra:

```text
registre a exceção
onde existe contexto suficiente
e responsabilidade operacional.
```

Camadas intermediárias podem:

- adicionar contexto;
- traduzir exceção;
- não registrar novamente.

O handler HTTP pode registrar o resultado externo sem repetir stack trace já registrada.

---

### 18. Instrumentar HTTP por rota, não URL bruta

Campo recomendado:

```text
http_route:
"/orders/{orderId}".
```

Evite:

```text
http_path:
"/orders/123".
```

URLs brutas aumentam cardinalidade e podem expor dados.

Registre:

- method;
- route template;
- status;
- duration;
- outcome.

Não registre body completo por padrão.

---

### 19. Instrumentar persistência

Um evento de banco pode conter:

```text
event:
database.operation.completed.

operation:
order.insert.

duration_ms:
18.

outcome:
success.
```

Evite registrar:

- SQL com dados;
- parâmetros completos;
- senha;
- connection string;
- stack trace em toda query;
- resultado completo.

Queries lentas devem ser observadas de forma controlada.

Logs não substituem métricas de pool e banco.

---

### 20. Instrumentar mensageria

Evento:

```text
message.processing.completed.
```

Campos:

- message type;
- destination logical name;
- attempt;
- outcome;
- duration;
- retryable;
- business identifier sanitizado.

Evite payload completo.

Uma mensagem rejeitada por schema e uma falha temporária precisam de outcomes diferentes.

---

### 21. Medir duração corretamente

Use relógio monotônico:

```java
long startedAt = System.nanoTime();
```

Depois:

```java
Duration.ofNanos(
    System.nanoTime() - startedAt);
```

Não use `currentTimeMillis` para duração quando um relógio monotônico está disponível.

Registre unidade no nome:

```text
duration_ms.
```

Nunca deixe unidade implícita.

---

### 22. Definir política de exceções

Arquivo:

```text
log-exception-policy.yaml
```

Conteúdo:

```yaml
exceptions:
  expectedBusinessRejection:
    level:
      WARN-or-INFO

    stackTrace:
      notRequiredByDefault

  invalidClientInput:
    level:
      INFO-or-WARN

    stackTrace:
      false

  unexpectedApplicationFailure:
    level:
      ERROR

    stackTrace:
      true

  externalTimeout:
    level:
      WARN-or-ERROR

    fields:
      - dependency
      - timeout_ms
      - retryable

  sensitiveMessage:
    rawExceptionMessage:
      reviewedBeforeLogging
```

Mensagens de bibliotecas podem conter URLs, parâmetros ou valores sensíveis.

---

### 23. Controlar cardinalidade

Campos com baixa ou média cardinalidade:

- event;
- outcome;
- environment;
- release;
- operation;
- status;
- error type.

Campos de alta cardinalidade:

- order ID;
- customer ID;
- message ID;
- URL bruta;
- stack trace;
- texto livre.

Alta cardinalidade não é sempre proibida em logs.

Entretanto, ela afeta:

- custo;
- índice;
- busca;
- retenção;
- agregação.

Não transforme todos os valores em labels de métricas futuras.

---

### 24. Controlar volume

Arquivo:

```text
log-volume-policy.yaml
```

Regras:

```yaml
volume:
  requestCompleted:
    level:
      INFO

    sampling:
      evaluatedByEnvironment

  successfulRepositoryOperation:
    level:
      DEBUG

  repeatedRetry:
    strategy:
      aggregate-or-rate-limit

  healthEndpoint:
    successfulRequest:
      avoidAtInfo

  largePayload:
    logging:
      forbidden

  localDebug:
    productionDefault:
      disabled
```

Health probes podem gerar milhares de logs inúteis.

Filtre ou reduza o nível de eventos rotineiros sem perder falhas.

---

### 25. Criar catálogo de eventos

Arquivo:

```text
log-event-catalog.yaml
```

Exemplo:

```yaml
events:
  - name:
      application.started

    level:
      INFO

    requiredFields:
      - application
      - environment
      - release_id
      - outcome

  - name:
      order.created

    level:
      INFO

    requiredFields:
      - order_id
      - duration_ms
      - outcome

  - name:
      order.creation.failed

    level:
      ERROR

    requiredFields:
      - error_type
      - duration_ms
      - outcome
```

Cada evento precisa ter owner e finalidade.

---

### 26. Testar sanitização

Arquivo:

```text
LoggingSanitizerTest.java
```

Cenários:

```java
@Test
void shouldRemoveControlCharacters() {
    var result = LoggingSanitizer
            .safeIdentifier("abc\r\nforged");

    assertThat(result)
            .isEqualTo("abc__forged");
}

@Test
void shouldLimitValueLength() {
    var value = "x".repeat(500);

    var result = LoggingSanitizer
            .safeIdentifier(value);

    assertThat(result)
            .hasSize(160);
}

@Test
void shouldMaskEmail() {
    var result = LoggingSanitizer
            .maskEmail("person@example.com");

    assertThat(result)
            .isEqualTo("***@example.com");
}
```

O teste de controle de caracteres reduz risco de log forging.

---

### 27. Testar evento estruturado

Use um appender de teste para capturar o evento.

Valide:

- level;
- message;
- event;
- outcome;
- duration;
- identifier;
- exception;
- ausência de Secret.

O teste não deve depender da ordem textual de um JSON inteiro quando o contrato é baseado em campos.

Prefira parsear o output ou inspecionar key-values.

---

### 28. Criar contract test

Arquivo:

```text
StructuredLoggingContractTest.java
```

Cenários:

- evento possui nome;
- evento possui outcome;
- duration usa `_ms`;
- release não é `unknown` em profile de deploy;
- Secret não aparece;
- body não aparece;
- stack trace existe em falha inesperada;
- stack trace não existe em rejeição esperada;
- controle de caracteres é removido;
- nome do evento pertence ao catálogo.

---

### 29. Criar scanner de dados sensíveis

Script:

```text
scan-logs-for-sensitive-data.ps1
```

Procure padrões:

```text
password;

authorization;

bearer;

access_token;

refresh_token;

client_secret;

private key;

cookie;

session;

jdbc com senha;

access key.
```

O scanner deve usar amostras geradas no laboratório.

Não capture ambiente completo.

Falsos positivos precisam ser revisados, não ignorados globalmente.

---

### 30. Simular eventos

Script:

```text
simulate-structured-log-events.ps1
```

Cenários:

- startup;
- criação bem-sucedida;
- rejeição de negócio;
- falha inesperada;
- timeout externo;
- mensagem processada;
- sanitização;
- health sem ruído excessivo.

A saída deve ser salva temporariamente em:

```text
target/observability/logging/sample.log
```

Esse arquivo não deve ser versionado.

---

### 31. Verificar output

Script:

```text
verify-structured-log-output.ps1
```

Valide:

- uma linha por evento;
- timestamp UTC;
- level;
- application;
- environment;
- release;
- event;
- outcome;
- message;
- JSON ou formato estruturado válido;
- nenhuma quebra injetada;
- nenhum Secret;
- campos numéricos como número;
- nomes padronizados.

Resultado:

```text
STRUCTURED_LOGGING_APPROVED
ou
STRUCTURED_LOGGING_BLOCKED.
```

---

### 32. Documentar troubleshooting

Arquivo:

```text
LOGGING_TROUBLESHOOTING.md
```

Inclua:

- output não é JSON;
- key-values não aparecem;
- duas configurações Logback conflitantes;
- release `unknown`;
- stack trace ausente;
- stack trace duplicada;
- log forging;
- Secret detectado;
- cardinalidade alta;
- health gerando volume;
- mensagens truncadas;
- timestamp local;
- evento fora do catálogo;
- level incorreto;
- logger muito verboso.

---

### 33. Criar matriz de testes

Arquivo:

```text
LOGGING_TEST_MATRIX.md
```

Cenários:

- startup estruturado;
- success;
- rejection;
- failure;
- timeout;
- duration;
- numeric fields;
- sanitization;
- email masking;
- no password;
- no token;
- no request body;
- exception policy;
- event catalog;
- production level;
- local debugging;
- health noise;
- one-line output;
- UTC timestamp;
- release identity.

---

### 34. Coletar evidence

Script:

```text
collect-structured-logging-evidence.ps1
```

Arquivo:

```text
structured-logging-evidence.json.
```

Campos permitidos:

- lesson;
- application;
- environment;
- release status;
- output format;
- event catalog status;
- required fields status;
- level policy status;
- sanitization status;
- sensitive scan status;
- tests status;
- sample count;
- timestamp.

Não inclua linhas completas que contenham identificadores desnecessários.

---

### 35. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\logging\validate-log-configuration.ps1

.\scripts\observability\logging\validate-log-event-catalog.ps1

.\scripts\observability\logging\validate-log-levels.ps1

.\scripts\observability\logging\simulate-structured-log-events.ps1

.\scripts\observability\logging\verify-structured-log-output.ps1

.\scripts\observability\logging\scan-logs-for-sensitive-data.ps1

.\scripts\observability\logging\collect-structured-logging-evidence.ps1

.\scripts\observability\logging\verify-structured-logging-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- build aprovado;
- eventos catalogados;
- campos padronizados;
- saída estruturada;
- timestamp UTC;
- níveis coerentes;
- exceções controladas;
- sanitização aprovada;
- nenhum Secret;
- testes aprovados;
- evidence completa;
- correlation e trace ainda não aprofundados.

---

## Entendendo o que foi feito

### Log virou evento

A aplicação deixou de produzir apenas frases.

### Campos ganharam contrato

Consultas deixaram de depender de parsing frágil.

### Nomes ganharam estabilidade

Eventos passaram a possuir identidade semântica.

### Níveis ganharam significado

`ERROR`, `WARN`, `INFO` e `DEBUG` deixaram de representar preferência pessoal.

### Duração ganhou unidade

`duration_ms` passou a ser consultável e comparável.

### Exceções ganharam política

Falhas esperadas e inesperadas foram separadas.

### Dados ganharam proteção

Secrets foram proibidos e PII foi minimizada.

### Volume ganhou controle

Health, retries e operações internas deixaram de gerar ruído indiscriminado.

### Logs ganharam testes

Formato, campos, níveis e segurança passaram a ser verificáveis.

### O Módulo 18 ganhou base

As próximas aulas poderão adicionar contexto, métricas e tracing sobre um contrato consistente.

---

## Erros comuns importantes

### Escrever frases livres

A busca depende de texto instável.

### Usar IDs dentro da mensagem

O campo deixa de ser consultável.

### Registrar body completo

Dados sensíveis e volume aumentam.

### Usar `ERROR` em validação normal

Alertas perdem valor.

### Registrar stack trace em todas as camadas

O incidente fica ruidoso.

### Registrar somente `exception.getMessage()`

A causa técnica pode ser perdida.

### Usar URL bruta

Cardinalidade e exposição aumentam.

### Registrar health em INFO

O custo cresce sem benefício.

### Mascarar Secret e manter parte dele

O valor ainda pode ser explorável.

### Antecipar tracing

A aula 557 possui correlation e trace IDs como foco.

---

## Comandos úteis

### Executar testes

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Iniciar com observabilidade

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability"
```

### Simular eventos

```powershell
.\scripts\observability\logging\simulate-structured-log-events.ps1
```

### Verificar output

```powershell
.\scripts\observability\logging\verify-structured-log-output.ps1
```

### Escanear dados sensíveis

```powershell
.\scripts\observability\logging\scan-logs-for-sensitive-data.ps1
```

---

## Exercício guiado

### Parte 1 — Contrato

Defina campos e convenções.

### Parte 2 — Catálogo

Crie eventos estáveis.

### Parte 3 — Levels

Classifique success, rejection e failure.

### Parte 4 — Output

Configure formato estruturado.

### Parte 5 — Domain

Instrumente criação de pedido.

### Parte 6 — Exceptions

Separe falhas esperadas e inesperadas.

### Parte 7 — Protection

Remova Secrets e minimize PII.

### Parte 8 — Tests

Valide campos e sanitização.

### Parte 9 — Volume

Reduza health e retries repetitivos.

### Parte 10 — Evidence

Simule, escaneie e aprove o baseline.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 555 e ponte para a aula 557 foram preservadas;
- a aula abre o Módulo 18 sem antecipar tracing;
- log event, structured log, event name, field, outcome, level, cardinality, PII, Secret, sanitization e contrato foram definidos;
- baseline anterior foi registrada;
- eventos usam nomes estáveis;
- campos usam `snake_case`;
- outcomes são padronizados;
- catálogo de eventos foi criado;
- catálogo de campos foi criado;
- contrato exige application, environment, release, event, outcome e message;
- timestamp usa UTC;
- política de níveis foi criada;
- `ERROR` não é usado para validação esperada;
- profile de observabilidade foi criado;
- saída estruturada foi configurada;
- código de negócio não depende do encoder;
- application, environment e release são propagados;
- sanitizador remove caracteres de controle;
- valores possuem limite;
- PII é minimizada;
- Secrets são proibidos;
- data classification foi criada;
- helper operacional foi criado sem esconder semântica;
- criação de pedido foi instrumentada;
- rejeição de negócio foi diferenciada;
- falha inesperada preserva stack trace;
- duplicação de exceção foi evitada;
- HTTP usa route template;
- body completo não é registrado;
- persistência não registra parâmetros sensíveis;
- mensageria não registra payload completo;
- duração usa relógio monotônico;
- unidade `_ms` é explícita;
- exception policy foi criada;
- cardinalidade foi analisada;
- volume e health noise foram controlados;
- sanitização possui testes;
- output estruturado possui contract test;
- stack trace esperada e inesperada foi testada;
- scanner de dados sensíveis foi criado;
- eventos foram simulados;
- output foi verificado;
- troubleshooting e test matrix foram criados;
- evidence é sanitizada;
- nenhum Secret real foi usado;
- correlation ID existente é apenas aceito quando presente;
- geração e propagação de correlation ID e trace ID não foram antecipadas;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-observability.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/logback-spring.xml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/logging `
  scripts/observability/logging `
  docs/observability/logging `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|BEGIN PRIVATE KEY|session_cookie"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): implementar logs estruturados"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- amostras temporárias;
- logs completos;
- Secret;
- token;
- body de requisição;
- dados pessoais;
- arquivos da aula 557;
- configuração completa de tracing.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o Módulo 18 foi iniciado com uma base de logs estruturados.

A aplicação passou a registrar:

```text
evento;

campos;

outcome;

nível;

duração;

aplicação;

ambiente;

release;

erro;

mensagem.
```

Você comprovou que logs operacionais precisam representar eventos estáveis; mensagens humanas não substituem campos; níveis precisam refletir impacto; durations precisam de unidade; exceções esperadas e inesperadas precisam de políticas diferentes; stack traces não devem ser duplicadas; route templates são melhores que URLs brutas; payloads e bodies não devem ser registrados indiscriminadamente; Secrets são proibidos; PII precisa ser minimizada; cardinalidade e volume afetam custo e operação; e o contrato de logging precisa ser testado.

A próxima aula será:

```text
557 - M18.02 - Correlation ID trace ID
```

Nela, você irá criar e propagar identificadores de correlação e rastreamento entre requisições, threads, mensagens e dependências, conectando eventos pertencentes ao mesmo fluxo.

Nenhuma implementação completa de correlation ID, trace ID, span ID ou tracing distribuído foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei contrato e catálogo de eventos.
- [ ] Padronizei campos, outcomes e níveis.
- [ ] Configurei saída estruturada.
- [ ] Instrumentei eventos relevantes.
- [ ] Protegi Secrets e minimizei PII.
- [ ] Controlei exceções, cardinalidade e volume.
- [ ] Testei estrutura e sanitização.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### Os key-values não aparecem

Revise a versão do SLF4J, o encoder e o appender ativo.

### O output possui duas linhas por evento

Revise propagação de appenders e configuração duplicada.

### O JSON fica inválido

Use encoder estruturado compatível; não monte JSON manualmente no código.

### A release aparece como `unknown`

Revise properties, profile e variáveis do ambiente.

### A stack trace não aparece

Use `setCause` ou o overload correto do logger.

### A stack trace aparece várias vezes

Escolha uma camada responsável pelo registro técnico.

### O scanner encontra senha

Remova o campo, revogue quando real e repita a evidence.

### O custo de logs cresce

Revise health, DEBUG, payloads, retries e retenção.

### O mesmo evento possui nomes diferentes

Centralize no catálogo e adicione contract test.

### Trace ID começou a ser implementado

Preserve a implementação completa para a aula 557.

---

## Perguntas de revisão

1. O que é um log event?
2. O que torna um log estruturado?
3. Para que serve event name?
4. Qual a diferença entre message e field?
5. O que é outcome?
6. Quando usar `ERROR`?
7. Quando usar `WARN`?
8. Por que usar route template?
9. Por que evitar body completo?
10. O que é cardinalidade?
11. Como registrar duração?
12. Por que usar UTC?
13. Como registrar exceção?
14. Por que evitar duplicação?
15. O que é log forging?
16. Como tratar PII?
17. Onde Secrets não podem aparecer?
18. O que testar no output?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Ocorrência operacional relevante.
2. Campos estáveis e consultáveis.
3. Identificar semântica.
4. Texto humano e atributo.
5. Resultado do evento.
6. Falha inesperada relevante.
7. Degradação ou anomalia recuperável.
8. Reduzir cardinalidade.
9. Proteger dados e volume.
10. Valores distintos.
11. Relógio monotônico e unidade.
12. Comparação consistente.
13. Cause e campos.
14. Reduzir ruído.
15. Injeção de linhas.
16. Minimizar ou mascarar.
17. Git, logs, image e evidence.
18. Campos, tipos, níveis e proteção.
19. Correlation e trace IDs.
20. Correlation ID trace ID.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 556 - M18.01 - Logs estruturados

- Iniciei o Módulo 18 de observabilidade, performance, concorrência e produção.
- Diferenciei frases de eventos estruturados.
- Criei catálogo de nomes de eventos.
- Padronizei campos em `snake_case`.
- Padronizei outcomes.
- Criei contrato de logging.
- Defini política de níveis.
- Configurei profile de observabilidade.
- Propaguei application, environment e release ID.
- Criei sanitização contra caracteres de controle.
- Minimizei PII e proibi Secrets.
- Criei classificação de dados.
- Instrumentei criação e rejeição de pedidos.
- Registrei falhas inesperadas com stack trace.
- Evitei duplicação entre camadas.
- Usei route templates em eventos HTTP.
- Evitei bodies, payloads e parâmetros sensíveis.
- Registrei duração em milissegundos usando relógio monotônico.
- Criei política de exceções.
- Revisei cardinalidade e volume.
- Reduzi ruído de health checks.
- Criei testes de contrato e sanitização.
- Criei scanner de dados sensíveis.
- Simulei e verifiquei logs estruturados.
- Coletei evidence sanitizada.
- Não antecipei geração e propagação de correlation ID ou trace ID.
- Próxima aula: Correlation ID trace ID.
```

---

## Referência técnica curta

- SLF4J Fluent Logging API.
- Spring Boot Logging.
- Logback Configuration.
- Structured Logging.
- JSON Log Events.
- Log Levels.
- Sensitive Data in Logs.
- Log Injection Prevention.
- Log Cardinality and Volume.
- Logging Contract Tests.

Regra final:

```text
logs estruturados precisam representar eventos estáveis e seguros: event names seguem catálogo, campos usam convenção consistente, outcome descreve resultado, levels refletem impacto, duration possui unidade e application, environment e release identificam o runtime; mensagens humanas complementam, mas não substituem campos consultáveis; rejeições esperadas não geram o mesmo tratamento de falhas inesperadas, stack traces são registradas com cause e sem duplicação, HTTP usa route templates, bodies e payloads completos permanecem ausentes, Secrets são proibidos e PII é minimizada; sanitização bloqueia caracteres de controle, políticas controlam cardinalidade, health noise e volume, enquanto testes validam estrutura, tipos, níveis, exceções e ausência de dados sensíveis; correlation ID e trace ID podem ser aceitos quando já presentes, mas sua criação e propagação ficam reservadas para a aula 557.
```
