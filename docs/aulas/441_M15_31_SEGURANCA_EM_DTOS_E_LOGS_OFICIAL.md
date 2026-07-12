# 441 - M15.31 - Seguranca em DTOs e logs

## Apresentação da aula

Na aula 440, a fronteira HTTP passou a utilizar allowlists explícitas.

O fluxo de entrada ficou:

```text
JSON;

request DTO mínimo;

Bean Validation;

mapper explícito;

command;

contexto derivado pelo servidor;

aggregate;

persistência;

auditoria.
```

O cliente deixou de controlar:

- ID;
- tenant;
- owner;
- status inicial;
- version;
- timestamps;
- authorities;
- campos de auditoria.

Propriedades desconhecidas passaram a retornar:

```text
400 unknown_request_property.
```

Também foram proibidos:

```text
@RequestBody Entity;

BeanUtils.copyProperties;

ObjectMapper.convertValue;

ModelMapper genérico;

@JsonAnySetter;

ignoreUnknown = true;

Map<String, Object>
para updates.
```

Essa defesa controla o que entra.

Ainda precisamos controlar:

```text
o que circula entre camadas;

o que sai na response;

o que aparece em exceptions;

o que entra no MDC;

o que é enviado ao logger;

o que surge em toString();

o que é capturado por testes,
traces e observabilidade.
```

Considere um request de login:

```java
record LoginRequest(
        String username,
        String password
) {
}
```

Records geram automaticamente:

```text
toString();

equals();

hashCode();
```

Um log aparentemente inocente:

```java
log.debug(
    "Login request: {}",
    request
);
```

poderia produzir:

```text
LoginRequest[
    username=usuario@example.test,
    password=Segredo123!
]
```

`@JsonProperty(access = WRITE_ONLY)` impediria a serialização da password em JSON, mas não protegeria `toString`, debugger, heap, exception, logger, eventos, métricas ou auditoria.

Agora considere uma response construída diretamente da entity:

```java
return ResponseEntity.ok(
    serviceOrder
);
```

Uma nova propriedade adicionada à entity no futuro poderia surgir automaticamente no contrato público:

- `tenantId`;
- `ownerUserId`;
- `internalNotes`;
- `deleted`;
- `riskScore`;
- `createdBy`;
- associação JPA;
- metadata interna.

A pergunta central desta aula será:

```text
como projetar DTOs,
responses, exceptions e logs
para que informações sensíveis
não atravessem fronteiras
por serialização automática,
toString, MDC ou observabilidade?
```

A solução será uma política por objeto, classificando dados como PUBLIC, INTERNAL, PERSONAL, SENSITIVE ou SECRET.

Cada tipo de objeto terá uma finalidade:

```text
Request DTO:
input externo permitido.

Command:
intenção interna validada.

Result:
resultado interno do caso de uso.

Response DTO:
allowlist pública.

Domain Event:
fato mínimo entre componentes.

Audit Event:
accountability sem payload.

Log Event:
diagnóstico técnico
com vocabulário fechado.
```

A regra será: nenhum objeto atravessa uma fronteira diferente daquela para a qual foi projetado.

A aula criará:

```text
DtoDataClassification;

SensitiveValue;

SafeLogValue;

LogValueSanitizer;

SecurityLoggingEventCatalog;

ServiceOrderResponse;

LoginRequest seguro;

RefreshTokenRequest seguro;

ApiProblemSanitizer;

SafeLoggingPolicyTest;

DtoSerializationSecurityTest;

SensitiveDtoToStringTest;

ProblemDetailDisclosureTest;

StructuredLoggingSentinelTest.
```

Documentos:

```text
docs/security/
├── M15_DTO_DATA_CLASSIFICATION.md
├── M15_LOGGING_FIELD_CATALOG.md
└── M15_SAFE_ERROR_RESPONSE_CONTRACT.md
```

O logging estruturado criado na aula 384 continuará sendo utilizado.

O audit trail da aula 430 continuará separado do application log.

A privacidade da aula 438 continuará impedindo PII em logs.

O rate limiting da aula 439 continuará usando métricas sem identificadores.

Ficam fora desta aula SCA, SAST, pipeline de segurança, SIEM, DLP externo e tracing distribuído completo.

A próxima aula será:

```text
442 - M15.32 - Vulnerabilidades em dependencias
```

Nela, o projeto verificará bibliotecas, CVEs, SBOM, fontes de advisory, severidade, exploitability e processo de atualização.

---

## Onde estamos na formação

A sequência oficial é:

```text
439:
Rate limiting seguranca.

440:
Protecao contra mass assignment.

441:
Seguranca em DTOs e logs.

442:
Vulnerabilidades em dependencias.

443:
SAST e analise estatica.

444:
DAST e testes dinamicos.
```

A aula 440 respondeu:

```text
quais campos
um request pode controlar?
```

A aula 441 responderá:

```text
quais dados podem
circular, ser serializados
ou aparecer em observabilidade?
```

Nesta aula:

```text
classificação de DTO:
sim.

request e response separados:
sim.

toString seguro:
sim.

serialização allowlist:
sim.

Problem Details seguro:
sim.

logging estruturado:
sim.

MDC mínimo:
sim.

log injection:
sim.

sentinelas:
sim.

audit trail:
preservado.

SCA:
próxima aula.
```

A regra central será:

```text
um dado só aparece
na response ou no log
quando existe decisão explícita
para aquela fronteira.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
application/security/data/
├── DtoDataClassification.java
├── SensitiveValue.java
└── SafeLogValue.java
```

Logging:

```text
configuration/logging/
├── LogValueSanitizer.java
├── SecurityLoggingEventCatalog.java
├── SafeStructuredLogger.java
└── LoggingContextKeys.java
```

Web:

```text
web/v2/serviceorder/
└── ServiceOrderResponse.java

web/auth/
├── LoginRequest.java
└── RefreshTokenRequest.java

web/error/
└── ApiProblemSanitizer.java
```

Testes:

```text
DtoSerializationSecurityTest;

SensitiveDtoToStringTest;

ProblemDetailDisclosureTest;

StructuredLoggingSentinelTest;

SafeLoggingPolicyTest;

MdcLifecycleTest.
```

Documentação:

```text
docs/security/
├── M15_DTO_DATA_CLASSIFICATION.md
├── M15_LOGGING_FIELD_CATALOG.md
└── M15_SAFE_ERROR_RESPONSE_CONTRACT.md
```

Você irá:

1. classificar os tipos de DTO;
2. classificar dados por exposição;
3. separar result e response;
4. criar response allowlist;
5. proteger DTOs com secret;
6. controlar `toString`;
7. evitar Lombok `@Data`;
8. limitar detalhes de exception;
9. proteger Problem Details;
10. criar catálogo de logs;
11. definir campos permitidos;
12. criar sanitização contra CRLF;
13. limitar tamanho de valores;
14. reduzir MDC;
15. limpar MDC em `finally`;
16. evitar PII em métricas;
17. testar serialização;
18. testar logs com sentinelas;
19. criar policy test;
20. preparar análise de dependências.

---

## Conceito essencial

### Request DTO

Request DTO representa somente o input permitido de uma operação. Ele pode conter valores externos e constraints, mas não entity, autenticação, tenant, repository, logger, timestamps do servidor ou authorities.
### Command

Command traduz a intenção para a camada de aplicação e remove detalhes HTTP. Ele deve carregar somente os valores necessários ao caso de uso e reduzir o tempo de vida de secrets.
### Result

Result é o retorno interno do caso de uso. Ele apoia mappers, auditoria e eventos, mas não é serializado automaticamente e também deve permanecer mínimo.
### Response DTO

Response DTO é a allowlist de saída. Entity, result e principal autenticado não são responses; um mapper escolhe explicitamente os campos públicos.
### Domain event

Domain event representa um fato mínimo, com identificadores, tempo, tipo e dados indispensáveis. Não copia aggregate, request, response ou token.
### Audit event

Audit event registra actor, tenant, action, target, outcome, reason code e correlation ID sem copiar payload de negócio.
### Log event

Log event serve ao diagnóstico técnico e usa nome de evento, outcome, correlation ID, route template, duração e reason code seguro.
### Classificação

Enum:

```java
public enum DtoDataClassification {
    PUBLIC,
    INTERNAL,
    PERSONAL,
    SENSITIVE,
    SECRET
}
```

A classificação não protege sozinha.

Ela apoia:

- documentação;
- review;
- testes;
- decisões de serialização;
- catálogo de logs.

---

### PUBLIC

Dados públicos podem aparecer no contrato, como status HTTP, code catalogado e status público da OS, sem se tornarem labels de cardinalidade ilimitada.
### INTERNAL

Dados internos apoiam a execução, mas não integram o contrato público. Sua presença em logs exige decisão explícita.
### PERSONAL

Nome, e-mail, endereço, username, subject, IP e IDs ligados a pessoas são minimizados e ficam fora de logs comuns e MDC.
### SENSITIVE

Dados de alto impacto ou categorias protegidas exigem controles reforçados. A API OS não precisa deles no laboratório.
### SECRET

Passwords, tokens, codes, cookies, nonces, verifiers, chaves e credenciais nunca aparecem em log, response, exception pública, métrica, MDC, audit payload ou `toString`.
### Records e toString

Records geram `toString()` com todos os componentes. Eles são adequados para DTOs públicos simples, mas não para objetos com secrets nesta baseline.
### JsonProperty WRITE_ONLY

`WRITE_ONLY` impede serialização Jackson, mas não protege logger, debugger, heap, mapper, exception ou `toString`; portanto, é apenas defesa complementar.
### Lombok Data

`@Data` gera setters e representação automática. Ele é proibido em DTOs de autenticação, tokens, principals, audit events, secret holders e entities.
### Safe toString

Objetos com secret retornam somente `<redacted>` ou um texto fixo. A melhor prática continua sendo não logar o objeto.
### Response minimizada

`ServiceOrderResponse` pode conter:

```text
id;

customerName;

serviceType;

description quando contratual;

serviceAddress quando autorizado;

scheduledFor;

status;

createdAt;

updatedAt.
```

O contrato decide se address e description são necessários.

Ele não inclui automaticamente:

- tenantId;
- ownerUserId;
- optimistic version no body;
- entity relations;
- audit metadata.

A version continua no ETag.

---

### Problem Details seguro

Problem Details expõe somente type, title, status, detail genérico, instance, code, correlation ID e extensões catalogadas. Stack trace, SQL, constraints, paths, hosts, tokens, body e rejected values ficam fora.
### Validation errors

Erros de validação podem informar field, rule e mensagem pública, nunca o valor rejeitado. Fields sensíveis recebem detalhes mínimos.
### Exceptions internas

Handlers traduzem exceptions para codes públicos. Logs usam event, class, correlation ID e reason seguro, evitando `exception.getMessage()` quando ela pode conter input.
### Logging parametrizado

Prefira:

```java
log.info(
    "Service order updated: event={}, outcome={}",
    event,
    outcome
);
```

ou API estruturada.

Não use concatenação:

```java
log.info(
    "Request: " + request
);
```

Logging parametrizado evita construção desnecessária.

Ele não torna um objeto sensível seguro.

---

### Structured logging

A baseline da aula 384 já utiliza logging estruturado.

Exemplo:

```java
log.atInfo()
    .addKeyValue(
        "event",
        "service_order_updated"
    )
    .addKeyValue(
        "outcome",
        "success"
    )
    .addKeyValue(
        "correlation_id",
        correlationId
    )
    .log(
        "Service order update completed"
    );
```

Os campos possuem nomes fechados.

---

### MDC mínimo

A baseline permite apenas `correlation_id`, `trace_id` e `span_id`. PII, IDs de usuário ou tenant, IP, token, sessão e body não entram no MDC.
### Lifecycle do MDC

O filtro precisa:

1. validar correlation ID;
2. colocar valor no MDC;
3. processar a chain;
4. remover no `finally`.

Sem limpeza, pools de threads podem carregar contexto de uma request para outra.

Use:

```java
try (
    MDC.MDCCloseable ignored =
        MDC.putCloseable(
            "correlation_id",
            correlationId
        )
) {
    filterChain.doFilter(
        request,
        response
    );
}
```

---

### Async

Fluxos assíncronos transportam correlation ID no evento ou command, recriam o contexto durante o processamento e o limpam, sem copiar todo o MDC.
### Log injection

Input com:

```text
CR;

LF;

tab;

caracteres de controle;

delimitadores.
```

pode forjar linhas ou quebrar parsers.

Structured JSON reduz riscos, mas valores ainda precisam de:

- normalização;
- limite de tamanho;
- remoção de controles;
- encoding correto.

---

### Sanitização não transforma secret em seguro

Um token sem CRLF continua secreto.

`LogValueSanitizer` serve para valores aprovados para log.

Ele não deve receber password e “sanitizá-la”.

Primeiro classifique.

Depois decida se o campo pode ser logado.

---

### Métricas

Labels usam vocabulário fechado e baixa cardinalidade, como route template, outcome, method e reason code. IDs, URLs completas, correlation ID, usuário, tenant, IP e exception message são proibidos.
## Mão na massa guiada

### 1. Criar a matriz de classificação

Arquivo:

```text
docs/security/M15_DTO_DATA_CLASSIFICATION.md
```

Inclua:

| Objeto/campo | Classe | Response | Log | Audit | Observação |
|---|---|---:|---:|---:|---|
| correlationId | INTERNAL | sim | sim | sim | valor validado |
| serviceOrder.id | INTERNAL | sim | não padrão | target | contrato |
| tenantId | INTERNAL | não | não | sim | contexto validado |
| ownerUserId | PERSONAL | não | não | actor/target quando necessário | UUID |
| customerName | PERSONAL | conforme contrato | não | não | minimização |
| serviceAddress | PERSONAL | conforme autorização | não | não | alto impacto |
| password | SECRET | não | não | não | transitório |
| accessToken | SECRET | não | não | não | bearer |
| refreshToken | SECRET | não | não | não | rotacionado |
| exception class | INTERNAL | não | sim em erro | não | sem message |
| reason code | PUBLIC/INTERNAL | sim quando catalogado | sim | sim | vocabulário fechado |

---

### 2. Criar SensitiveValue

```java
public final class SensitiveValue {

    private char[] value;

    private SensitiveValue(
            char[] value
    ) {
        this.value =
                Objects.requireNonNull(
                        value
                );
    }

    public static SensitiveValue of(
            char[] value
    ) {
        return new SensitiveValue(
                Arrays.copyOf(
                        value,
                        value.length
                )
        );
    }

    public char[] copy() {
        return Arrays.copyOf(
                value,
                value.length
        );
    }

    public void destroy() {
        Arrays.fill(
                value,
                '\0'
        );

        value = new char[0];
    }

    @Override
    public String toString() {
        return "<redacted>";
    }
}
```

O wrapper reduz exposição acidental.

Ele não garante remoção de todas as cópias na JVM.

---

### 3. Atualizar LoginRequest

Evite record:

```java
public final class LoginRequest {

    private final String username;

    @JsonProperty(
        access = JsonProperty.Access.WRITE_ONLY
    )
    private final String password;

    @JsonCreator
    public LoginRequest(
            @JsonProperty("username")
            String username,

            @JsonProperty("password")
            String password
    ) {
        this.username = username;
        this.password = password;
    }

    public String username() {
        return username;
    }

    public String password() {
        return password;
    }

    @Override
    public String toString() {
        return "LoginRequest[redacted]";
    }
}
```

A aplicação existente ainda recebe String do Jackson.

Minimize seu uso e não crie cópias.

---

### 4. Atualizar RefreshTokenRequest

```java
public final class RefreshTokenRequest {

    private final String refreshToken;

    @JsonCreator
    public RefreshTokenRequest(
            @JsonProperty("refreshToken")
            String refreshToken
    ) {
        this.refreshToken =
                refreshToken;
    }

    @JsonProperty(
        access = JsonProperty.Access.WRITE_ONLY
    )
    public String refreshToken() {
        return refreshToken;
    }

    @Override
    public String toString() {
        return "RefreshTokenRequest[redacted]";
    }
}
```

Não implemente `equals()` ou `hashCode()` usando token sem necessidade.

---

### 5. Criar ServiceOrderResponse

```java
public record ServiceOrderResponse(
        UUID id,
        String customerName,
        String serviceType,
        String description,
        String serviceAddress,
        OffsetDateTime scheduledFor,
        ServiceOrderStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
```

Revise se description e address são necessários para cada endpoint.

Uma futura listagem resumida pode usar outro response.

---

### 6. Criar mapper de response

```java
@Component
public class ServiceOrderResponseMapper {

    public ServiceOrderResponse toResponse(
            ServiceOrderResult result
    ) {
        return new ServiceOrderResponse(
                result.id(),
                result.customerName(),
                result.serviceType(),
                result.description(),
                result.serviceAddress(),
                result.scheduledFor(),
                result.status(),
                result.createdAt(),
                result.updatedAt()
        );
    }
}
```

O mapper não copia tenant, owner ou audit metadata.

---

### 7. Criar response de listagem reduzido

```java
public record ServiceOrderSummaryResponse(
        UUID id,
        String customerName,
        String serviceType,
        OffsetDateTime scheduledFor,
        ServiceOrderStatus status
) {
}
```

A listagem não precisa devolver description e address quando a tela não usa esses campos.

Isso reduz exposição e payload.

---

### 8. Criar LogValueSanitizer

```java
@Component
public class LogValueSanitizer {

    private static final int MAX_LENGTH =
            200;

    public SafeLogValue sanitize(
            String value
    ) {
        if (value == null) {
            return SafeLogValue.of(
                    "<null>"
            );
        }

        String normalized =
                value
                    .replace(
                        '\r',
                        ' '
                    )
                    .replace(
                        '\n',
                        ' '
                    )
                    .replace(
                        '\t',
                        ' '
                    )
                    .replaceAll(
                        "\\p{Cc}",
                        "?"
                    );

        if (
            normalized.length()
            > MAX_LENGTH
        ) {
            normalized =
                    normalized.substring(
                        0,
                        MAX_LENGTH
                    )
                    + "...";
        }

        return SafeLogValue.of(
                normalized
        );
    }
}
```

Use somente para campos aprovados.

---

### 9. Criar SafeLogValue

```java
public record SafeLogValue(
        String value
) {
    public SafeLogValue {
        Objects.requireNonNull(
                value
        );
    }

    public static SafeLogValue of(
            String value
    ) {
        return new SafeLogValue(
                value
        );
    }

    @Override
    public String toString() {
        return value;
    }
}
```

O tipo torna a decisão visível no review.

---

### 10. Criar catálogo de eventos

```java
public enum SecurityLoggingEventCatalog {

    HTTP_REQUEST_COMPLETED,

    AUTHENTICATION_FAILED,

    AUTHENTICATION_SUCCEEDED,

    AUTHORIZATION_DENIED,

    SERVICE_ORDER_CREATED,

    SERVICE_ORDER_UPDATED,

    SERVICE_ORDER_STATUS_CHANGED,

    SERVICE_ORDER_DELETED,

    SECURITY_RATE_LIMIT_EXCEEDED,

    SECURITY_RATE_LIMIT_UNAVAILABLE,

    PERSONAL_DATA_EXPORT_COMPLETED,

    INTERNAL_ERROR
}
```

O enum não contém dados.

---

### 11. Criar catálogo de campos

Arquivo:

```text
docs/security/M15_LOGGING_FIELD_CATALOG.md
```

Campos permitidos:

```text
event;

outcome;

correlation_id;

trace_id;

span_id;

http_method;

route_template;

http_status;

duration_ms;

reason_code;

component.
```

Campos condicionais e restritos:

```text
target_type;

actor_type;

tenant_access_mode.
```

Campos proibidos:

```text
request_body;

response_body;

password;

token;

authorization;

cookie;

email;

address;

description;

username;

subject;

user_id;

tenant_id;

ip;

user_agent raw;

exception_message.
```

---

### 12. Criar SafeStructuredLogger

```java
@Component
public class SafeStructuredLogger {

    private static final Logger log =
            LoggerFactory.getLogger(
                    "APPLICATION_SECURITY"
            );

    public void authenticationFailed(
            String correlationId,
            String reasonCode
    ) {
        log.atWarn()
            .addKeyValue(
                "event",
                "authentication_failed"
            )
            .addKeyValue(
                "outcome",
                "failure"
            )
            .addKeyValue(
                "correlation_id",
                correlationId
            )
            .addKeyValue(
                "reason_code",
                reasonCode
            )
            .log(
                "Authentication failed"
            );
    }
}
```

O método não recebe username ou exception message.

---

### 13. Atualizar login failure

Antes:

```java
log.warn(
    "Login failed for {}: {}",
    username,
    exception.getMessage()
);
```

Depois:

```java
safeStructuredLogger
        .authenticationFailed(
                correlationId,
                "INVALID_CREDENTIALS"
        );
```

A response continua uniforme.

---

### 14. Atualizar logs de OS

Não registre a entity:

```java
log.info(
    "Created {}",
    serviceOrder
);
```

Use:

```java
log.atInfo()
    .addKeyValue(
        "event",
        "service_order_created"
    )
    .addKeyValue(
        "outcome",
        "success"
    )
    .addKeyValue(
        "correlation_id",
        correlationId
    )
    .log(
        "Service order creation completed"
    );
```

O ID fica no audit trail quando necessário.

---

### 15. Atualizar error handler

`ApiProblemSanitizer` recebe um `ProblemDetail` já criado.

Ele valida extensões permitidas:

```text
code;

correlationId;

retryAfterSeconds;

violations.
```

Para violations:

```text
field;

rule;

message.
```

Ele remove qualquer `rejectedValue`.

---

### 16. Mapear erro interno

```java
@ExceptionHandler(
    Exception.class
)
ResponseEntity<ProblemDetail>
handleUnexpected(
        Exception exception,
        HttpServletRequest request
) {
    String correlationId =
            correlationIdResolver
                    .resolve(
                        request
                    );

    safeInternalErrorLogger.log(
            correlationId,
            exception.getClass()
                    .getSimpleName()
    );

    ProblemDetail problem =
            apiProblemFactory.create(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "urn:problem:internal-error",
                    "Internal server error",
                    "The request could not be completed.",
                    "internal_error",
                    request
            );

    return ResponseEntity
            .status(
                HttpStatus.INTERNAL_SERVER_ERROR
            )
            .cacheControl(
                CacheControl.noStore()
            )
            .body(problem);
}
```

O body não usa `exception.getMessage()`.

---

### 17. Proteger exceptions de banco

Mapeie:

```text
DataIntegrityViolationException;

OptimisticLockingFailureException;

QueryTimeoutException.
```

Para responses catalogadas.

Não devolva:

- constraint name;
- SQL state;
- query;
- column;
- table;
- database host.

No log, registre exception class e event code.

A stack trace fica somente no erro interno aprovado.

---

### 18. Atualizar MDC

Crie constantes:

```java
public final class LoggingContextKeys {

    public static final String CORRELATION_ID =
            "correlation_id";

    public static final String TRACE_ID =
            "trace_id";

    public static final String SPAN_ID =
            "span_id";

    private LoggingContextKeys() {
    }
}
```

Não adicione chaves de identidade.

---

### 19. Limpar MDC

No filtro de correlation ID:

```java
try (
    MDC.MDCCloseable ignored =
        MDC.putCloseable(
            CORRELATION_ID,
            correlationId
        )
) {
    filterChain.doFilter(
            request,
            response
    );
}
```

Teste a limpeza mesmo quando a chain lança exception.

---

### 20. Tratar User-Agent

Se houver necessidade técnica, não registre o valor raw.

Classifique em categorias controladas:

```text
browser;

mobile;

api-client;

unknown.
```

A classificação não deve executar parser inseguro ou criar labels de alta cardinalidade.

Nesta baseline, User-Agent permanece fora dos logs de aplicação.

---

### 21. Proteger logs de rate limit

A aula 439 já proíbe dimensões raw.

Atualize o logger para aceitar somente:

```text
policy ID;

outcome;

correlation ID.
```

Policy ID vem de enum ou configuração validada.

---

### 22. Proteger logs de privacidade

Não registre:

- export;
- request body;
- request type com texto livre;
- nome;
- e-mail;
- endereço.

Use:

```text
event:
personal_data_export_completed.

outcome:
success.

correlationId.
```

O audit trail contém metadata controlada.

---

### 23. Criar DtoSerializationSecurityTest

Use um `ServiceOrderResult` com sentinelas:

```text
tenant-secret-sentinel;

owner-secret-sentinel;

internal-note-secret-sentinel.
```

Serialize `ServiceOrderResponse`.

Confirme que as sentinelas internas não aparecem.

Valide também os nomes proibidos:

```text
tenantId;

ownerUserId;

version;

internalNotes.
```

---

### 24. Testar LoginRequest

Serialize um `LoginRequest`.

Confirme:

```text
password:
ausente.
```

Chame:

```java
request.toString()
```

Confirme:

```text
password raw:
ausente.

username raw:
ausente.

texto:
LoginRequest[redacted].
```

---

### 25. Testar RefreshTokenRequest

Use:

```text
refresh-token-sentinel.
```

Valide ausência em:

- JSON;
- `toString`;
- logs;
- exception;
- audit.

O token continua disponível somente ao serviço que precisa validá-lo.

---

### 26. Criar ProblemDetailDisclosureTest

Lance uma exception com message:

```text
jdbc:postgresql://internal-db:5432/app
password=secret-sentinel
constraint=uk_user_email
```

A response deve conter somente:

```text
internal_error;

correlationId;

detail genérico.
```

Nenhuma sentinela aparece.

---

### 27. Criar StructuredLoggingSentinelTest

Sentinelas:

```text
password-sentinel;

access-token-sentinel;

refresh-token-sentinel;

email-sentinel@example.test;

address-sentinel;

description-sentinel;

subject-sentinel;

tenant-sentinel;

203.0.113.99.
```

Execute:

- login failure;
- authorization deny;
- OS create;
- rate limit;
- privacy export;
- internal error.

Capture Logback com `ListAppender`.

Confirme ausência de todas as sentinelas.

---

### 28. Testar log injection

Use valor aprovado para log com:

```text
line-one\r\n
forged-event=true\t
control-char.
```

Passe pelo sanitizer.

Valide:

- sem CR;
- sem LF;
- sem tab;
- tamanho máximo;
- uma única entrada;
- JSON válido.

Não faça esse teste com secret.

---

### 29. Criar MdcLifecycleTest

Simule duas requests na mesma thread de teste.

Primeira:

```text
correlation:
corr-a.
```

Segunda:

```text
correlation:
corr-b.
```

Confirme que `corr-a` não aparece na segunda.

Teste também exception na primeira chain.

---

### 30. Criar SafeLoggingPolicyTest

Escaneie `src/main/java`.

Procure padrões proibidos:

```text
log.*request;

log.*response;

log.*authentication;

log.*principal;

log.*getPassword;

log.*getTokenValue;

log.*getEmail;

log.*getServiceAddress;

log.*getDescription;

log.*getClaims;

log.*exception.getMessage;

MDC.put.*user;

MDC.put.*tenant;

MDC.put.*email;

@Data
em security DTO.
```

O teste é guardrail e não substitui revisão humana.

---

### 31. Proibir entity em response

O policy test procura controllers que retornem:

```text
ResponseEntity<ServiceOrder>;

List<ServiceOrder>;

Page<ServiceOrder>;

ApplicationUser;

TenantMembership entity.
```

Responses precisam ser DTOs.

---

### 32. Atualizar OpenAPI

Revise schemas de response.

Remova:

- tenant;
- owner;
- version no body;
- audit fields;
- internal flags.

Documente ETag no header.

Problem Details documenta apenas extensões públicas.

---

### 33. Atualizar collections

As collections devem:

- não imprimir tokens no console;
- não salvar secrets em examples;
- não persistir response de login como evidence;
- verificar ausência de campos internos;
- verificar `no-store` em errors sensíveis;
- usar environment local ignorado.

---

### 34. Atualizar configuração estruturada

Preserve o formato estruturado da aula 384.

Exemplo:

```yaml
logging:
  structured:
    format:
      console: logstash
```

Confirme que MDC permitido e key-values aparecem como propriedades JSON.

Não adicione o body da request ao encoder.

---

### 35. Criar contrato de erros seguros

Arquivo:

```text
docs/security/M15_SAFE_ERROR_RESPONSE_CONTRACT.md
```

Inclua:

```markdown
# Erros seguros

## Campos públicos

- type.
- title.
- status.
- detail genérico.
- instance.
- code.
- correlationId.
- retryAfterSeconds quando aplicável.
- violations sem rejectedValue.

## Proibidos

- stack trace.
- exception class.
- exception message.
- SQL.
- constraint.
- host interno.
- filesystem path.
- secret.
- PII.
- body.
```

---

### 36. Atualizar threat model

Adicione:

```text
THR-217:
record de login vaza password
em toString.

THR-218:
entity serializada expõe
campo novo.

THR-219:
result interno vira response.

THR-220:
exception message aparece
em Problem Details.

THR-221:
rejectedValue expõe secret.

THR-222:
request ou response completa
é logada.

THR-223:
MDC contém PII.

THR-224:
MDC não é limpo
entre requests.

THR-225:
CRLF forja evento de log.

THR-226:
métrica usa user ID
como label.

THR-227:
domain event copia aggregate.

THR-228:
collection persiste token.
```

Controles:

- classes finais;
- `toString` redigido;
- response DTO;
- mappers;
- detail genérico;
- allowlist de extensions;
- catálogo de logs;
- MDC mínimo;
- closeable context;
- sanitizer;
- labels fechadas;
- evento mínimo;
- environment ignorado.

---

### 37. Atualizar OWASP e baseline

A02 Security Misconfiguration:

```text
serialização:
allowlist.

Problem Details:
sem detalhes internos.
```

A04 Insecure Design:

```text
DTO por finalidade;

response separada;

log event fechado.
```

A09 Security Logging and Monitoring Failures:

```text
eventos estruturados;

log injection mitigada;

secrets e PII excluídos;

MDC limpo;

testes com sentinela.
```

Baseline:

```text
request DTO:
mínimo.

command:
interno.

result:
não serializado.

response:
allowlist.

secret toString:
redigido.

Problem Details:
catalogado.

log:
estruturado.

MDC:
correlation e tracing.

PII:
fora dos logs.

produção pública:
NO-GO.
```

---

### 38. Executar o gate

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=DtoSerializationSecurityTest,SensitiveDtoToStringTest,ProblemDetailDisclosureTest,StructuredLoggingSentinelTest,SafeLoggingPolicyTest,MdcLifecycleTest `
  test
```

Suítes anteriores:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderMassAssignmentIntegrationTest,SecurityAuditIntegrationTest,PrivacyLoggingPolicyTest,SecurityRateLimitLoggingPolicyTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Revise:

```powershell
git grep `
  -n `
  -E `
  "log\\..*(request|response|password|token|email|address|description|claims)"
```

Confirme:

- request DTOs;
- response DTOs;
- secret serialization;
- `toString`;
- errors;
- rejected values;
- structured logs;
- MDC;
- CRLF;
- metrics;
- collections;
- OpenAPI;
- nenhuma sentinela;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### DTOs ganharam finalidade explícita

Request, command, result e response deixaram de ser intercambiáveis.

### Responses ficaram protegidas por allowlist

Uma alteração na entity não altera automaticamente o contrato público.

### Secrets deixaram de usar toString automático

Login e refresh não imprimem conteúdo.

### Problem Details ficou restrito

Exception, SQL e rejected values não chegam ao cliente.

### Logs ganharam catálogo fechado

Eventos e fields são escolhidos em vez de copiar objetos.

### MDC foi minimizado

Somente correlation e tracing atravessam logs da request.

### Log injection recebeu defesa

Valores aprovados passam por normalização e limite.

### Testes com sentinelas verificaram vazamentos

Falhas de serialização e observabilidade passam a quebrar o build.

---

## Erros comuns importantes

### Achar que WRITE_ONLY resolve tudo

Ele só controla serialização Jackson.

### Usar record para password

O `toString()` automático pode expor o valor.

### Retornar result diretamente

Campos internos podem virar contrato público.

### Logar request para depurar

O objeto pode conter PII ou secret.

### Logar exception message

A message pode incorporar SQL ou input.

### Colocar userId no MDC

Ele aparece em todos os logs e aumenta exposição.

### Sanitizar token e depois logar

Sanitização não torna secret seguro.

### Usar resource ID como label

A cardinalidade fica sem limite.

### Não limpar MDC

Threads reutilizadas misturam contextos.

### Confiar somente no policy test

Análise estática simples não entende todo o fluxo.

---

## Comandos úteis

### Testes de DTO e logs

```powershell
.\mvnw.cmd `
  -Dtest=DtoSerializationSecurityTest,StructuredLoggingSentinelTest,SafeLoggingPolicyTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar logs perigosos

```powershell
git grep `
  -n `
  -E `
  "log\\..*(request|response|password|token|email|address|description|claims)"
```

### Procurar entity em response

```powershell
git grep `
  -n `
  -E `
  "ResponseEntity<(ServiceOrder|ApplicationUser|TenantMembership)>"
```

### Procurar MDC com identidade

```powershell
git grep `
  -n `
  -E `
  "MDC\\.(put|putCloseable).*(user|tenant|email|ip|subject)"
```

---

## Exercício guiado

### Parte 1 — Classificação

Classifique campos como public, internal, personal, sensitive ou secret.

### Parte 2 — Fronteiras

Separe request, command, result e response.

### Parte 3 — Secrets

Proteja login e refresh contra serialização e `toString`.

### Parte 4 — Responses

Crie allowlists detalhada e resumida.

### Parte 5 — Errors

Remova exception, SQL e rejected values.

### Parte 6 — Logging

Crie catálogo de events e fields.

### Parte 7 — MDC

Mantenha somente correlation e tracing.

### Parte 8 — Injection

Sanitize valores aprovados e limite tamanho.

### Parte 9 — Testes

Use sentinelas em JSON, logs e errors.

### Parte 10 — Governança

Atualize documentos, threat model e baseline.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 440 foi preservada;
- request, command, result, response, event, audit e log foram diferenciados;
- classificação PUBLIC, INTERNAL, PERSONAL, SENSITIVE e SECRET foi criada;
- matriz de classificação foi documentada;
- entity não é response;
- result não é serializado diretamente;
- response DTO usa allowlist;
- response resumida minimiza campos;
- tenant, owner, version e audit metadata não vazam;
- LoginRequest e RefreshTokenRequest possuem `toString` redigido;
- secrets não usam record automático;
- `WRITE_ONLY` foi tratado como defesa complementar;
- Lombok `@Data` foi proibido em objetos sensíveis;
- `SensitiveValue` foi criado;
- Problem Details usa extensions fechadas;
- rejected values não aparecem;
- exception message, SQL e stack trace não aparecem;
- logs usam eventos estruturados;
- requests, responses, principals e entities não são logados;
- catálogo de fields permitidos e proibidos foi criado;
- MDC contém somente correlation e tracing;
- MDC é limpo em `finally`;
- async transporta correlation ID explicitamente;
- CRLF e controles foram normalizados;
- sanitizer não é usado para secrets;
- métricas não usam labels pessoais ou de alta cardinalidade;
- DTO serialization foi testada;
- `toString` foi testado;
- Problem Details foi testado com sentinelas;
- logging foi testado com sentinelas;
- lifecycle do MDC foi testado;
- policy tests foram criados;
- OpenAPI e collections foram revisados;
- contrato de erros seguros foi criado;
- threat model e OWASP foram atualizados;
- vulnerabilidades em dependências não foram antecipadas;
- produção pública permaneceu NO-GO;
- gate completo foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check

git grep `
  -n `
  -E `
  "log\\..*(request|response|password|token|email|address|description|claims)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/security `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m15): proteger DTOs errors e logs sensiveis"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- password;
- token;
- e-mail real;
- endereço real;
- dump de request;
- dump de response;
- stack trace em documentação;
- log capturado com sentinela;
- environment de collection;
- DTO interno exposto como response.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto passou a tratar cada objeto conforme sua fronteira.

O fluxo ficou:

```text
Request DTO:
input externo.

Command:
intenção interna.

Result:
retorno do caso de uso.

Response DTO:
allowlist pública.

Domain Event:
fato mínimo.

Audit Event:
accountability.

Log Event:
diagnóstico seguro.
```

Os dados passaram a ser classificados como:

```text
PUBLIC;

INTERNAL;

PERSONAL;

SENSITIVE;

SECRET.
```

Secrets deixaram de aparecer em:

- JSON;
- `toString`;
- logs;
- metrics;
- MDC;
- audit payload;
- Problem Details.

Responses deixaram de depender da entity.

Errors deixaram de refletir exceptions internas.

O logging passou a utilizar:

```text
event catalog;

fields fechados;

structured logging;

correlation ID;

sanitização;

limite de tamanho;

testes com sentinelas.
```

A decisão central foi:

```text
cada exposição exige
finalidade,
allowlist
e teste negativo.
```

A aplicação agora possui um contrato mais seguro.

O código ainda depende de bibliotecas externas:

- Spring Boot;
- Spring Security;
- Jackson;
- PostgreSQL driver;
- Redis client;
- JWT;
- Testcontainers;
- Logback;
- Flyway.

Mesmo código bem projetado pode herdar vulnerabilidades dessas dependências.

A próxima aula será:

```text
442 - M15.32 - Vulnerabilidades em dependencias
```

Nela, você irá:

- entender CVE e advisory;
- diferenciar vulnerabilidade direta e transitiva;
- gerar árvore de dependências;
- criar SBOM;
- usar base de vulnerabilidades;
- analisar CVSS e exploitability;
- reduzir falsos positivos;
- definir SLA de atualização;
- testar Dependabot ou ferramenta equivalente;
- bloquear builds conforme policy aprovada.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei DTOs e campos.
- [ ] Separei result e response.
- [ ] Protegi `toString` de secrets.
- [ ] Restrigi MDC e Problem Details.
- [ ] Testei serialização e logs com sentinelas.

---

## Troubleshooting adicional

### Password aparece no toString

O DTO ainda é record ou usa Lombok automático.

Substitua por classe final com representação redigida.

### Campo interno aparece no JSON

O controller pode estar retornando result ou entity.

Use response mapper.

### Exception message aparece no body

Revise o handler genérico e `ProblemDetail`.

Nunca use `exception.getMessage()` no detail público.

### Sentinela aparece no log

Localize o primeiro logger que recebeu objeto ou valor raw.

Não apenas masque o teste.

### MDC de outra request aparece

O filtro não removeu contexto no `finally`.

Use `putCloseable`.

### Log estruturado quebra com CRLF

O valor não passou pelo sanitizer ou o encoder foi configurado incorretamente.

### Campo necessário desapareceu da response

Atualize a allowlist somente após confirmar requisito, autorização e privacidade.

### Policy test acusa falso positivo

Crie uma exceção estreita e documentada, não desabilite o teste inteiro.

---

## Perguntas de revisão

1. O que representa Request DTO?
2. Command pode ser response?
3. Result deve ser serializado?
4. Qual objeto define a saída pública?
5. Quais são as cinco classificações?
6. Password pode usar record?
7. WRITE_ONLY protege toString?
8. Entity pode ser response?
9. O que Problem Details pode conter?
10. Rejected value pode aparecer?
11. O que pode entrar no MDC?
12. User ID pode entrar no MDC?
13. O que é log injection?
14. Sanitização torna token seguro?
15. Resource ID pode ser metric label?
16. Como limpar MDC?
17. O que um log event contém?
18. Audit e log são iguais?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Input permitido da operação.
2. Não.
3. Não diretamente.
4. Response DTO.
5. Public, internal, personal, sensitive e secret.
6. Não na baseline.
7. Não.
8. Não.
9. Campos públicos catalogados.
10. Não.
11. Correlation e tracing.
12. Não.
13. Forjar ou quebrar registros por input.
14. Não.
15. Não.
16. Com `finally` ou closeable.
17. Event, outcome e contexto seguro.
18. Não.
19. Vulnerabilidades em dependencias.
20. CVEs, SBOM e atualização segura.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 441 - M15.31 - Seguranca em DTOs e logs

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei Request DTO, Command, Result e Response DTO.
- Diferenciei Domain Event, Audit Event e Log Event.
- Criei classificação PUBLIC, INTERNAL, PERSONAL, SENSITIVE e SECRET.
- Criei `M15_DTO_DATA_CLASSIFICATION.md`.
- Mantive entities fora das responses.
- Mantive results internos fora da serialização direta.
- Criei `ServiceOrderResponse`.
- Criei `ServiceOrderSummaryResponse`.
- Minimizei campos em listagens.
- Mantive tenant, owner e version fora do body.
- Criei `SensitiveValue`.
- Substituí records de login e refresh por classes com `toString` redigido.
- Usei `WRITE_ONLY` apenas como defesa complementar.
- Proibi Lombok `@Data` em objetos sensíveis.
- Criei `LogValueSanitizer`.
- Criei `SafeLogValue`.
- Criei catálogo de eventos de logging.
- Criei `M15_LOGGING_FIELD_CATALOG.md`.
- Removi username e exception message dos logs de login.
- Removi entities dos logs de Ordem de Serviço.
- Mantive application log separado do audit trail.
- Criei `ApiProblemSanitizer`.
- Removi rejected values de erros.
- Mantive SQL, constraint, stack trace e host interno fora das responses.
- Limitei MDC a correlation ID, trace ID e span ID.
- Limpei MDC com `putCloseable`.
- Transporte de async passou a carregar correlation ID explicitamente.
- Normalizei CRLF, tabs e controles em valores aprovados para log.
- Registrei que sanitização não torna secret seguro.
- Mantive PII e IDs fora de labels de métricas.
- Criei testes de serialização de DTOs.
- Criei testes de `toString`.
- Criei testes de Problem Details com sentinelas.
- Criei testes de logging com sentinelas.
- Criei `MdcLifecycleTest`.
- Criei `SafeLoggingPolicyTest`.
- Proibi entities em responses de controllers.
- Revisei OpenAPI e collections.
- Criei `M15_SAFE_ERROR_RESPONSE_CONTRACT.md`.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Vulnerabilidades em dependencias.
```

---

## Referência técnica curta

- [Spring Boot — Logging](https://docs.spring.io/spring-boot/reference/features/logging.html)
- [Spring Framework — Error Responses](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Logging Vocabulary Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html)
- [OWASP Java Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html)
- [Jackson JsonProperty Access](https://fasterxml.github.io/jackson-annotations/javadoc/2.6/com/fasterxml/jackson/annotation/JsonProperty.Access.html)
- [SLF4J MDC](https://www.slf4j.org/api/org/slf4j/MDC.html)

Regra final:

```text
segurança em DTOs e logs exige que cada objeto possua finalidade e classificação explícitas: requests aceitam somente input permitido, commands e results permanecem internos, responses usam allowlist, entities não atravessam a API, secrets não usam toString automático nem aparecem em serialização, Problem Details ou observabilidade, logs estruturados recebem somente events e fields catalogados, MDC contém apenas correlation e tracing, valores aprovados são protegidos contra log injection e testes com sentinelas impedem regressões de exposição.
```
