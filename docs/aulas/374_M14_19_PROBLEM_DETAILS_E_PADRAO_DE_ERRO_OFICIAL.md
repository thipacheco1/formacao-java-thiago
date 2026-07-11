# 374 - M14.19 - Problem Details e padrao de erro

## Apresentacao da aula

Na aula 373, você centralizou o tratamento de exceptions da API.

O fluxo atual é:

```text
exception MVC ou de aplicacao;

HandlerExceptionResolver;

@RestControllerAdvice;

@ExceptionHandler;

ResponseEntityExceptionHandler;

status;

headers;

body temporario.
```

A solução anterior resolveu problemas importantes:

- removeu `try/catch` dos controllers;
- preservou headers como `Allow`;
- centralizou 400, 404, 405, 409, 415 e 500;
- impediu a exposição de stack trace, SQL e mensagens internas;
- separou logging da resposta pública;
- manteve exceptions da aplicação sem dependência de HTTP.

Entretanto, o body criado na aula 373 foi deliberadamente provisório:

```text
timestamp;

status;

error;

message;

path.
```

Ele não representa um padrão interoperável.

Cada API que inventa uma estrutura diferente obriga seus consumidores a aprender:

- nomes diferentes;
- campos diferentes;
- semânticas diferentes;
- estratégias diferentes para validation errors;
- formas diferentes de identificar o tipo da falha.

A pergunta central desta aula será:

```text
como transformar a traducao global
de exceptions
em um padrao de erro interoperavel,
estavel e documentado?
```

A resposta será baseada em:

```text
RFC 9457;

ProblemDetail;

ErrorResponse;

application/problem+json.
```

RFC 9457 define o formato “Problem Details for HTTP APIs”.

Ele foi criado para transportar informações de erro legíveis por máquinas e por pessoas sem exigir que cada API invente um envelope incompatível.

RFC 9457 substitui:

```text
RFC 7807.
```

O objeto padrão possui cinco membros principais:

```text
type;

title;

status;

detail;

instance.
```

O Spring Framework representa esse formato por:

```java
org.springframework.http.ProblemDetail
```

A classe oferece os campos padronizados e um mapa para propriedades adicionais.

O Spring MVC também possui:

```java
org.springframework.web.ErrorResponse
```

Esse contrato reúne:

- status;
- headers;
- body `ProblemDetail`.

As exceptions internas atuais do Spring MVC implementam `ErrorResponse`.

A classe:

```java
org.springframework.web.ErrorResponseException
```

é uma implementação reutilizável desse contrato.

Porém, a camada de aplicação não será acoplada a essas classes.

As exceptions:

```text
ManagedRuntimeMessageNotFoundException;

ManagedRuntimeMessageConflictException;

ManagedRuntimeMessagePersistenceException.
```

continuarão puramente Java.

A tradução para `ProblemDetail` continuará dentro de:

```text
web.error.
```

O body temporário será removido.

O padrão novo utilizará:

```text
campos RFC 9457;

extensoes controladas.
```

Extensões da aplicação:

```text
code;

timestamp;

correlationId;

violations.
```

`code` será um identificador estável para decisões de máquina.

`timestamp` registrará quando a resposta foi criada.

`correlationId` ligará response e logs.

`violations` existirá somente quando houver falhas de validação detalhadas.

Cada violation terá:

```text
location;

field;

code;

message.
```

O valor rejeitado não será publicado.

Essa decisão evita vazar:

- senha;
- token;
- documento;
- payload completo;
- dado sensível;
- string muito grande.

A aula implementará um filtro de correlation id.

Ele aceitará um header válido:

```text
X-Correlation-Id.
```

Quando o header estiver ausente ou inválido, a aplicação criará um UUID.

O valor será:

- colocado em request attribute;
- adicionado ao MDC durante a request;
- devolvido no response header;
- incluído no ProblemDetail;
- removido do MDC em `finally`.

O content type de problemas será:

```text
application/problem+json.
```

A resposta 406 continuará sem body quando o cliente declarar que não aceita a representação disponível.

Essa exceção existe porque tentar escrever um `ProblemDetail` JSON para um cliente que não aceita JSON pode repetir a falha de content negotiation.

A aula também aprofundará:

- semântica de `type`;
- semântica de `title`;
- semântica de `status`;
- semântica de `detail`;
- semântica de `instance`;
- `about:blank`;
- URIs estáveis;
- extensões;
- properties map;
- serialização de properties;
- `ProblemDetail.forStatus`;
- `ProblemDetail.forStatusAndDetail`;
- `ErrorResponse`;
- `ErrorResponseException`;
- localização;
- field errors;
- object errors;
- method validation;
- path e query errors;
- error codes;
- correlation id;
- segurança;
- compatibilidade;
- testes de contrato.

A aula não iniciará ainda:

```text
CRUD completo;
PUT;
PATCH;
update command;
delete detalhado;
listagem publica paginada;
OpenAPI;
Security;
cache.
```

Esses assuntos pertencem às próximas linhas do cronograma.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
375 - M14.20 - CRUD completo parte 1
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
370:
validacoes customizadas.

371:
service layer e transacoes.

372:
repository layer Spring Data.

373:
Exception Handler global.

374:
Problem Details e padrao de erro.

375:
CRUD completo parte 1.

376:
CRUD completo parte 2.
```

A aula 373 respondeu:

```text
como centralizar a traducao
de exceptions para HTTP?
```

A aula 374 responderá:

```text
como publicar os erros
em um formato estavel,
interoperavel e seguro?
```

Nesta aula:

```text
RFC 9457:
sim.

ProblemDetail:
sim.

ErrorResponse:
sim.

ErrorResponseException:
sim, em fixture.

application/problem+json:
sim.

type:
sim.

title:
sim.

status:
sim.

detail:
sim.

instance:
sim.

extensions:
sim.

error code:
sim.

violations:
sim.

localization:
sim.

correlation id:
sim.

timestamp:
sim.

compatibilidade:
sim.

body temporario:
removido.

CRUD:
nao.

OpenAPI:
nao.
```

A regra central será:

```text
o status comunica a categoria HTTP;

o type identifica a classe do problema;

o code identifica o erro da aplicacao;

o detail explica a ocorrencia;

violations detalham entradas invalidas.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura nova:

```text
src/main/java/br/com/formacao/backend/web/error
├── ApiProblemCode.java
├── ApiProblemFactory.java
├── ApiProblemTypes.java
├── ApiViolation.java
├── CorrelationIdFilter.java
├── CorrelationIdSupport.java
├── GlobalExceptionHandler.java
├── ValidationErrorCodeResolver.java
└── ValidationViolationMapper.java
```

Arquivos removidos:

```text
TemporaryApiErrorResponse.java;

TemporaryErrorMessageResolver.java.
```

Mensagens:

```text
src/main/resources
├── messages.properties
└── messages_pt_BR.properties
```

Testes:

```text
src/test/java/br/com/formacao/backend/web/error
├── ProblemDetailStandardFieldsTest.java
├── ProblemDetailExtensionsTest.java
├── ProblemDetailValidationWebMvcTest.java
├── ProblemDetailMethodValidationWebMvcTest.java
├── ProblemDetailApplicationExceptionWebMvcTest.java
├── ProblemDetailMvcExceptionWebMvcTest.java
├── ProblemDetailLocalizationWebMvcTest.java
├── ProblemDetailErrorResponseFixtureTest.java
├── CorrelationIdFilterTest.java
├── ProblemDetailSecurityTest.java
├── ProblemDetailCompatibilityTest.java
├── ProblemDetailArchitectureTest.java
└── ProblemDetailLiveServerIT.java
```

Documentação:

```text
docs
├── rfc-9457-problem-details.md
├── problem-detail-standard-fields.md
├── problem-type-catalog.md
├── problem-detail-extensions.md
├── validation-violations-contract.md
├── error-codes.md
├── error-localization.md
├── correlation-id.md
├── problem-detail-security.md
├── problem-detail-compatibility.md
└── problem-detail-baseline.md
```

Scripts:

```text
scripts
├── 99_testar_problem_detail_validation.ps1
├── 100_testar_problem_detail_application.ps1
├── 101_testar_problem_detail_mvc.ps1
├── 102_testar_localizacao_erros.ps1
├── 103_testar_correlation_id.ps1
└── 104_executar_testes_problem_details.ps1
```

Resultados esperados:

```text
Content-Type de erro:
application/problem+json.

type:
URI estavel.

title:
resumo da categoria.

status:
igual ao status HTTP.

detail:
mensagem publica localizada.

instance:
path da request.

code:
identificador estavel.

timestamp:
Instant ISO-8601.

correlationId:
header e body iguais.

violations:
somente em validation.

rejectedValue:
ausente.

stackTrace:
ausente.

exception:
ausente.

SQL:
ausente.

406:
sem body.

TemporaryApiErrorResponse:
removido.
```

---

## Conceito essencial

### RFC 9457

RFC 9457 define um formato padronizado para detalhes de problemas em APIs HTTP.

Seu objetivo não é substituir status HTTP.

O status continua essencial.

O Problem Detail acrescenta contexto estruturado.

Exemplo:

```json
{
  "type": "urn:formacao:problem:resource-not-found",
  "title": "Resource not found",
  "status": 404,
  "detail": "The requested managed message was not found.",
  "instance": "/api/v1/runtime/managed-messages/999"
}
```

---

### RFC 7807 e RFC 9457

RFC 9457 tornou RFC 7807 obsoleta.

O modelo principal permaneceu reconhecível.

Na documentação nova, use:

```text
RFC 9457.
```

Não continue chamando o padrão de RFC 7807 como se fosse a referência atual.

---

### type

`type` é uma URI reference que identifica a categoria do problema.

Ela não identifica uma ocorrência individual.

Exemplo:

```text
urn:formacao:problem:resource-not-found.
```

Todas as ocorrências da mesma classe podem compartilhar o mesmo `type`.

Em produção, uma URI HTTPS estável e documentável costuma ser preferível.

No laboratório, URNs evitam publicar um endereço inexistente como documentação oficial.

---

### about:blank

Quando `type` é:

```text
about:blank
```

o status HTTP já representa a semântica principal.

Nesse caso, o `title` normalmente corresponde à frase padrão do status.

A aplicação utilizará types específicos para problemas públicos conhecidos.

Para falhas genéricas inesperadas, `about:blank` pode ser aceitável.

A baseline usará um type específico também para `internal-error`, garantindo catálogo uniforme.

---

### title

`title` é um resumo curto e legível do tipo do problema.

Ele deve permanecer estável entre ocorrências do mesmo type, exceto por localização.

Exemplos:

```text
Validation failed;

Resource not found;

Request conflict;

Internal server error.
```

Não coloque id, path ou valor recebido no title.

---

### status

`status` repete o status HTTP no body.

Exemplo:

```json
"status": 404
```

Ele facilita leitura do documento fora do contexto original.

O valor precisa combinar com o status real da response.

Um teste de contrato impedirá divergência.

Clientes devem considerar o status HTTP como fonte protocolar.

---

### detail

`detail` explica a ocorrência específica.

Exemplo:

```text
The requested managed message was not found.
```

Ele pode variar por locale.

Não use `detail` como error code.

Não inclua:

- stack trace;
- SQL;
- package;
- mensagem do driver;
- dados secretos;
- payload completo.

---

### instance

`instance` é uma URI reference que identifica a ocorrência.

Nesta aplicação, ela será o path:

```text
/api/v1/runtime/managed-messages/999.
```

A query string não será incluída.

Isso reduz o risco de publicar filtros sensíveis ou valores grandes.

`instance` não substitui correlation id.

---

### ProblemDetail

Criação simples:

```java
ProblemDetail problem =
        ProblemDetail.forStatus(
                HttpStatus.NOT_FOUND
        );
```

Com detail:

```java
ProblemDetail problem =
        ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                detail
        );
```

Depois:

```java
problem.setType(type);
problem.setTitle(title);
problem.setInstance(instance);
```

---

### Properties adicionais

Use:

```java
problem.setProperty(
        "code",
        code
);
```

A classe possui um mapa de properties adicionais.

Com a integração Jackson do Spring, essas properties são renderizadas como membros de nível superior.

Resultado:

```json
{
  "type": "...",
  "title": "...",
  "status": 400,
  "detail": "...",
  "instance": "...",
  "code": "validation_failed",
  "timestamp": "2026-07-11T00:00:00Z"
}
```

Não crie uma propriedade chamada:

```text
status
```

dentro do mapa.

Ela conflitaria com o membro padrão.

---

### application/problem+json

A media type padronizada para JSON é:

```text
application/problem+json.
```

Quando o corpo é `ProblemDetail`, o Spring MVC prefere essa media type sobre JSON genérico.

Os testes devem validar:

```text
Content-Type compatible with application/problem+json.
```

Não fixe charset se a infraestrutura não o acrescentar.

---

### ErrorResponse

`ErrorResponse` representa uma resposta de erro completa.

Ele expõe:

- status code;
- headers;
- body `ProblemDetail`;
- message codes para localização.

As exceptions internas do Spring MVC implementam esse contrato.

Isso permite que `ResponseEntityExceptionHandler` trabalhe de forma uniforme.

---

### ErrorResponseException

`ErrorResponseException` é uma RuntimeException que implementa `ErrorResponse`.

Ela pode ser usada diretamente ou estendida por exceptions orientadas à camada web.

Nesta arquitetura, exceptions da aplicação não estenderão essa classe.

Motivo:

```text
application layer
nao deve depender
de org.springframework.web.
```

A aula criará apenas uma fixture de teste para compreender seu comportamento.

---

### Catalogo de types

Crie:

```java
public final class ApiProblemTypes {
}
```

Constantes:

```text
INVALID_REQUEST;

VALIDATION_FAILED;

RESOURCE_NOT_FOUND;

RESOURCE_CONFLICT;

METHOD_NOT_ALLOWED;

UNSUPPORTED_MEDIA_TYPE;

NOT_ACCEPTABLE;

PERSISTENCE_FAILURE;

INTERNAL_ERROR.
```

Cada constante é `URI`.

Não crie URI dinamicamente com texto da exception.

---

### ApiProblemCode

Enum:

```java
public enum ApiProblemCode {

    INVALID_REQUEST(
            "invalid_request"
    ),

    VALIDATION_FAILED(
            "validation_failed"
    ),

    RESOURCE_NOT_FOUND(
            "resource_not_found"
    ),

    RESOURCE_CONFLICT(
            "resource_conflict"
    ),

    INTERNAL_ERROR(
            "internal_error"
    );
}
```

O valor público não depende do nome Java.

O enum pode evoluir internamente sem alterar o code serializado.

---

### code versus type

`type` identifica a categoria no padrão RFC.

`code` é uma extensão curta para consumidores da aplicação.

Exemplo:

```text
type:
urn:formacao:problem:validation-failed.

code:
validation_failed.
```

Ambos precisam ser estáveis.

Não use mensagem humana para branching.

---

### ApiViolation

Record:

```java
public record ApiViolation(
        String location,
        String field,
        String code,
        String message
) {
}
```

`location` poderá ser:

```text
body;

path;

query;

object.
```

`field` identifica o componente quando conhecido.

`code` representa a constraint ou falha pública.

`message` é localizada.

---

### Field errors

`MethodArgumentNotValidException` possui `BindingResult`.

Use:

```text
getFieldErrors;

getGlobalErrors.
```

Field error:

```text
location:
body.

field:
value.

code:
not_blank.

message:
localized message.
```

Não publique `getRejectedValue()`.

---

### Object errors

Uma class-level constraint pode gerar object error.

Exemplo:

```text
@ValidRuntimePreview.
```

Quando o validator usa:

```text
addPropertyNode("messages")
```

a falha pode aparecer como field error.

Outras constraints de objeto continuam como:

```text
location:
object.

field:
request object name ou vazio controlado.
```

Não exponha nome de classe fully qualified.

---

### Method validation

`HandlerMethodValidationException` agrupa resultados por parâmetro.

A aplicação poderá:

- iterar por `getParameterValidationResults`;
- usar `visitResults`.

A aula utilizará o visitor em um mapper dedicado.

Callbacks relevantes:

- `requestParam`;
- `pathVariable`;
- `requestHeader`;
- `modelAttribute`;
- `other`.

Cada callback define `location`.

---

### Path errors

Exemplo:

```text
GET /messages/0.
```

Violation:

```json
{
  "location": "path",
  "field": "position",
  "code": "positive",
  "message": "a posicao deve ser positiva"
}
```

Não inclua o valor rejeitado.

---

### Query errors

Exemplo:

```text
?limit=51.
```

Violation:

```json
{
  "location": "query",
  "field": "limit",
  "code": "max",
  "message": "o limite deve ser no maximo 50"
}
```

---

### Binding errors

Nem todo 400 é Bean Validation.

Exemplo:

```text
position=abc.
```

A falha é type mismatch.

O Problem Detail será:

```text
type:
invalid-request.

code:
invalid_request.

violations:
opcionalmente uma entrada de binding.
```

A baseline criará uma violation segura com:

```text
location;

field;

code:
type_mismatch;

message.
```

O valor recebido não será publicado.

---

### ValidationErrorCodeResolver

O resolver converterá códigos internos para valores públicos.

Exemplos:

```text
NotBlank:
not_blank.

NotNull:
not_null.

Size:
size.

Min:
min.

Max:
max.

Positive:
positive.

RuntimeMessageValue:
invalid_message_value.

ValidRuntimePreview:
invalid_runtime_preview.

typeMismatch:
type_mismatch.

desconhecido:
invalid.
```

Não devolva a lista completa de codes do Spring.

---

### Localizacao

O `title` e o `detail` serão resolvidos por:

```text
MessageSource.
```

Arquivos:

```text
messages.properties;

messages_pt_BR.properties.
```

As violations de Bean Validation continuam usando `ValidationMessages`.

O `MessageSource` consegue resolver `FieldError` e `ObjectError`.

A request pode definir locale por:

```text
Accept-Language.
```

O contrato estrutural permanece igual.

Somente mensagens humanas variam.

---

### Correlation id

O header será:

```text
X-Correlation-Id.
```

Regra de aceitação:

```text
1 a 64 caracteres;

letras;

numeros;

ponto;

underscore;

hifen.
```

Valor inválido não será refletido.

A aplicação criará UUID.

Isso evita header injection e valores gigantes.

---

### MDC

Durante a request:

```java
MDC.put(
        "correlationId",
        value
);
```

No final:

```java
MDC.remove(
        "correlationId"
);
```

Use `try/finally`.

Thread pools reutilizam threads.

Esquecer a limpeza pode misturar ids de requests diferentes.

---

### Timestamp

Use `Clock` injetado.

A factory cria:

```text
Instant.now(clock).
```

O timestamp será uma extension.

Não substitui logs ou tempo do evento de negócio.

---

### Seguranca

RFC 9457 não autoriza exposição de detalhes internos.

Um Problem Detail seguro não deve publicar:

- stack trace;
- SQL;
- nome de tabela;
- constraint interna;
- hostname;
- package;
- exception class;
- token;
- senha;
- request body completo;
- rejected value sensível.

O teste de segurança continuará obrigatório.

---

### Compatibilidade

Clientes podem ignorar extensions desconhecidas.

Ainda assim, mudanças podem quebrar consumidores.

Mudanças incompatíveis:

- remover `code`;
- mudar significado de um code;
- mudar violations de lista para objeto;
- renomear `field`;
- mudar location values;
- trocar type de uma categoria;
- mudar status.

Mudanças normalmente compatíveis:

- adicionar extension opcional documentada;
- adicionar novo problem type para novo erro;
- adicionar nova violation code.

Compatibilidade precisa de testes explícitos.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Docker precisa estar ativo.

---

### 2. Remover o body temporario

Remova:

```text
TemporaryApiErrorResponse;

TemporaryErrorMessageResolver.
```

Atualize testes da aula 373.

Nenhuma referência deve permanecer.

---

### 3. Criar ApiProblemTypes

Use URNs estáveis.

Exemplo:

```java
public static final URI
        VALIDATION_FAILED =
                URI.create(
                        "urn:formacao:problem:validation-failed"
                );
```

Crie construtor privado.

---

### 4. Criar ApiProblemCode

Cada enum possui:

```text
String value.
```

Expose:

```java
public String value() {
}
```

Não serialize o enum diretamente.

---

### 5. Criar ApiViolation

Use record.

No construtor compacto:

- location não blank;
- field não nulo;
- code não blank;
- message não blank.

Field pode ser string vazia para object-level error.

---

### 6. Criar CorrelationIdSupport

Constantes:

```text
HEADER_NAME;

REQUEST_ATTRIBUTE;

MDC_KEY;

MAX_LENGTH.
```

Método para validar o valor.

Use pattern pré-compilado.

---

### 7. Criar CorrelationIdFilter

Estenda:

```java
OncePerRequestFilter.
```

Fluxo:

1. ler header;
2. validar;
3. gerar UUID quando necessário;
4. setar request attribute;
5. setar response header;
6. colocar no MDC;
7. executar chain;
8. limpar MDC em finally.

Não registrar o header inválido.

---

### 8. Criar ValidationErrorCodeResolver

Use switch controlado.

Entrada:

```text
Spring error code.
```

Saída:

```text
public code.
```

Unknown vira:

```text
invalid.
```

---

### 9. Criar ValidationViolationMapper

Injete:

```text
MessageSource;

ValidationErrorCodeResolver.
```

Métodos:

```text
fromBindingResult;

fromMethodValidation;

fromTypeMismatch.
```

Retorne listas imutáveis.

---

### 10. Mapear FieldError

Para cada field error:

```text
location body;

field error.getField();

code resolvido;

messageSource.getMessage(error, locale).
```

Nunca inclua rejected value.

---

### 11. Mapear ObjectError

Use:

```text
location object;

field vazio;

code resolvido;

mensagem localizada.
```

Se o error já aponta para field por property node, ele aparecerá como field error.

---

### 12. Mapear HandlerMethodValidationException

Use:

```java
exception.visitResults(
        new Visitor() {
        }
);
```

Callbacks:

```text
pathVariable:
location path.

requestParam:
location query.

requestHeader:
location header.

modelAttribute:
location body ou object.

other:
location method.
```

Resolva o nome pelo annotation ou `MethodParameter`.

---

### 13. Criar ApiProblemFactory

Injete:

```text
Clock;

MessageSource.
```

Método principal:

```java
ProblemDetail create(
        HttpStatusCode status,
        URI type,
        String titleCode,
        String detailCode,
        ApiProblemCode code,
        URI instance,
        String correlationId,
        List<ApiViolation> violations,
        Locale locale
).
```

---

### 14. Construir ProblemDetail

Use:

```java
ProblemDetail problem =
        ProblemDetail
                .forStatusAndDetail(
                        status,
                        detail
                );
```

Depois configure:

```text
type;

title;

instance;

code;

timestamp;

correlationId;

violations quando nao vazia.
```

Use lista imutável.

---

### 15. Extrair instance

Utilize somente:

```text
request.getRequestURI().
```

Converta com:

```java
URI.create(path).
```

Não use URL completa com host interno.

Não inclua query string.

---

### 16. Refatorar GlobalExceptionHandler

Continue estendendo:

```text
ResponseEntityExceptionHandler.
```

Substitua o body temporário por `ProblemDetail`.

Mantenha handlers de aplicação.

Mantenha handler genérico.

---

### 17. Tratar MethodArgumentNotValidException

Override:

```text
handleMethodArgumentNotValid.
```

Crie violations de body.

Problem type:

```text
VALIDATION_FAILED.
```

Code:

```text
validation_failed.
```

Status:

```text
400.
```

---

### 18. Tratar HandlerMethodValidationException

Override:

```text
handleHandlerMethodValidationException.
```

Crie violations de path e query.

Se a exception for para return value:

```text
500.
```

Para input:

```text
400.
```

A aplicação atual testa somente input.

---

### 19. Tratar type mismatch

Override:

```text
handleTypeMismatch.
```

Crie violation segura.

Não publique o valor.

Use code:

```text
type_mismatch.
```

---

### 20. Tratar JSON malformado

Override:

```text
handleHttpMessageNotReadable.
```

Use:

```text
invalid_request.
```

Não publique mensagem do Jackson.

Não inclua violations detalhadas do parser nesta baseline.

---

### 21. Tratar 405 e 415

Preserve headers recebidos.

Crie Problem Detail com type e code específicos.

Valide:

```text
Allow;

media types suportados.
```

---

### 22. Tratar 406

Mantenha:

```text
status;

headers;

body null.
```

O content type de Problem Details não pode ser imposto quando o cliente o rejeita.

---

### 23. Tratar exceptions de aplicacao

Mapeamentos:

```text
NotFound:
404;
resource-not-found;
resource_not_found.

Conflict:
409;
resource-conflict;
resource_conflict.

Persistence:
500;
persistence-failure;
persistence_failure.

Unexpected:
500;
internal-error;
internal_error.
```

Messages vêm do MessageSource.

---

### 24. Adicionar messages base

Exemplos:

```properties
problem.validation.title=Validation failed
problem.validation.detail=One or more request values are invalid
problem.not-found.title=Resource not found
problem.not-found.detail=The requested resource was not found
problem.conflict.title=Request conflict
problem.conflict.detail=The request conflicts with the current state
problem.internal.title=Internal server error
problem.internal.detail=An unexpected error occurred
problem.invalid-request.title=Invalid request
problem.invalid-request.detail=The request could not be processed
```

Inclua os demais tipos.

---

### 25. Adicionar messages pt-BR

Exemplos:

```properties
problem.validation.title=Falha de validacao
problem.validation.detail=Um ou mais valores da requisicao sao invalidos
problem.not-found.title=Recurso nao encontrado
problem.not-found.detail=O recurso solicitado nao foi encontrado
problem.conflict.title=Conflito na requisicao
problem.conflict.detail=A requisicao conflita com o estado atual
problem.internal.title=Erro interno do servidor
problem.internal.detail=Ocorreu um erro inesperado
```

Mantenha codes e types iguais entre locales.

---

### 26. Criar teste dos campos padrao

Valide:

- type;
- title;
- status;
- detail;
- instance;
- status HTTP igual ao body;
- type como URI;
- instance sem query.

---

### 27. Criar teste das extensions

Valide:

- code;
- timestamp;
- correlationId;
- violations quando presentes;
- ausência de violations quando vazia;
- properties no nível superior;
- nenhum campo `properties` no JSON.

---

### 28. Testar validation de body

Envie:

```json
{
  "value": " "
}
```

Espere:

- 400;
- `application/problem+json`;
- validation type;
- validation code;
- violations;
- location body;
- field value;
- code público;
- rejected value ausente.

---

### 29. Testar validation de path e query

Cenários:

```text
position=0;

limit=51.
```

Valide location, field, code e message.

Use `HandlerMethodValidationException`.

---

### 30. Testar type mismatch

Cenário:

```text
position=abc.
```

Valide:

- invalid request type;
- code `invalid_request`;
- violation `type_mismatch`;
- valor abc ausente do JSON.

---

### 31. Testar class-level validation

Envie preview inválida.

Valide violation em:

```text
messages.
```

Confirme code customizado.

---

### 32. Testar application exceptions

Valide 404 e 409.

Confirme:

- type estável;
- code estável;
- sem violations;
- detail localizada;
- correlation id presente.

---

### 33. Testar ErrorResponseException

Crie fixture em test source:

```java
new ErrorResponseException(
        HttpStatus.TOO_MANY_REQUESTS
);
```

Configure body.

Valide que o contrato `ErrorResponse` expõe status, headers e ProblemDetail.

Não mova a dependency para application layer.

---

### 34. Testar localization

Envie:

```text
Accept-Language: pt-BR.
```

Depois:

```text
Accept-Language: en.
```

Valide:

- title diferente;
- detail diferente;
- violation message diferente;
- type igual;
- code igual;
- status igual.

---

### 35. Testar correlation id fornecido

Header:

```text
X-Correlation-Id: test-123.
```

Valide:

- mesmo header na response;
- mesmo valor no Problem Detail;
- request attribute;
- MDC limpo depois.

---

### 36. Testar correlation id invalido

Envie:

- espaço;
- quebra de linha simulada quando possível;
- valor com mais de 64;
- caracteres fora da whitelist.

Valide UUID gerado.

Não reflita o valor inválido.

---

### 37. Testar seguranca

Pesquise no JSON:

```text
stackTrace;

exception;

cause;

org.springframework;

org.hibernate;

select;

insert;

constraint;

password;

rejectedValue;

payload.
```

Resultado:

```text
nenhum.
```

---

### 38. Testar compatibilidade

Crie assertions explícitas.

Campos obrigatórios:

```text
type;

title;

status;

detail;

instance;

code;

timestamp;

correlationId.
```

Validation adiciona:

```text
violations.
```

Não use snapshot opaco.

---

### 39. Criar teste arquitetural

Valide:

- Temporary classes removidas;
- um GlobalExceptionHandler;
- advice continua global;
- ProblemDetail somente na web;
- application exceptions sem Spring Web;
- correlation filter limpa MDC;
- codes em enum;
- types em catálogo;
- rejected value não existe no ApiViolation;
- zero stack trace field;
- zero CRUD novo;
- zero ErrorResponseException na application layer.

---

### 40. Criar teste live

Use:

```text
RANDOM_PORT;

PostgreSQLContainer;

@ServiceConnection.
```

Teste:

- body validation;
- query validation;
- type mismatch;
- not found;
- conflict;
- 405;
- 415;
- 406;
- 500 de fixture;
- locale;
- correlation id.

Valide media type onde existe body.

---

### 41. Criar documentacao

Em `rfc-9457-problem-details.md`, explique o RFC.

Em `problem-detail-standard-fields.md`, documente cinco campos.

Em `problem-type-catalog.md`, liste URIs.

Em `problem-detail-extensions.md`, documente extensões.

Em `validation-violations-contract.md`, documente location, field, code e message.

Em `error-codes.md`, crie catálogo estável.

Em `error-localization.md`, separe estrutura de texto.

Em `correlation-id.md`, documente geração e propagação.

Em `problem-detail-security.md`, liste dados proibidos.

Em `problem-detail-compatibility.md`, documente breaking changes.

Em `problem-detail-baseline.md`, registre exemplos JSON.

---

### 42. Criar scripts

`99_testar_problem_detail_validation.ps1` testa 400.

`100_testar_problem_detail_application.ps1` testa 404 e 409.

`101_testar_problem_detail_mvc.ps1` testa 405, 406 e 415.

`102_testar_localizacao_erros.ps1` alterna locale.

`103_testar_correlation_id.ps1` testa header válido e inválido.

`104_executar_testes_problem_details.ps1` executa a suite.

---

### 43. Executar testes de contrato

```powershell
.\mvnw.cmd `
  -Dtest=ProblemDetailStandardFieldsTest,ProblemDetailExtensionsTest,ProblemDetailCompatibilityTest test
```

---

### 44. Executar testes de validation

```powershell
.\mvnw.cmd `
  -Dtest=ProblemDetailValidationWebMvcTest,ProblemDetailMethodValidationWebMvcTest test
```

---

### 45. Executar application e MVC

```powershell
.\mvnw.cmd `
  -Dtest=ProblemDetailApplicationExceptionWebMvcTest,ProblemDetailMvcExceptionWebMvcTest test
```

---

### 46. Executar locale e correlation

```powershell
.\mvnw.cmd `
  -Dtest=ProblemDetailLocalizationWebMvcTest,CorrelationIdFilterTest test
```

---

### 47. Executar seguranca e arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=ProblemDetailSecurityTest,ProblemDetailArchitectureTest test
```

---

### 48. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=ProblemDetailLiveServerIT test
```

Docker precisa estar ativo.

---

### 49. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 50. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 51. Revisar escopo

Confirme:

```text
ProblemDetail:
presente.

application/problem+json:
presente.

TemporaryApiErrorResponse:
zero.

TemporaryErrorMessageResolver:
zero.

rejectedValue:
zero.

stack trace no body:
zero.

SQL no body:
zero.

CRUD novo:
zero.

PUT:
zero.

PATCH:
zero.

OpenAPI:
zero.
```

---

### 52. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- logs;
- payload temporário;
- correlation id capturado;
- stack trace;
- SQL;
- snapshot opaco;
- endpoint de crash;
- CRUD antecipado.

---

## Entendendo o que foi feito

### O erro ganhou um padrao interoperavel

A API deixou o envelope temporário e adotou RFC 9457.

### Os campos ganharam responsabilidades distintas

Type, title, status, detail e instance não são sinônimos.

### A aplicacao ganhou codes estaveis

Consumidores não precisam interpretar mensagens humanas.

### Validation ganhou detalhes seguros

Field, location, code e message são publicados sem rejected value.

### Logs e responses ganharam correlacao

O mesmo id atravessa header, MDC e Problem Detail.

---

## Erros comuns importantes

### Usar detail como codigo

Texto localizado não é contrato de máquina.

### Criar type diferente para cada ocorrencia

Type representa categoria, não id da request.

### Expor rejected value

O valor pode conter informação sensível.

### Mudar code sem versionamento

Clientes podem depender dele.

### Incluir query inteira em instance

Filtros e tokens podem vazar.

---

## Comandos uteis

### Validation

```powershell
curl.exe -i `
  -X POST `
  -H "Content-Type: application/json" `
  -H "Accept: application/problem+json" `
  --data '{"value":" "}' `
  http://localhost:8081/api/v1/runtime/managed-messages
```

### Locale

```powershell
curl.exe -i `
  -H "Accept-Language: pt-BR" `
  http://localhost:8081/api/v1/runtime/managed-messages/999
```

### Correlation id

```powershell
curl.exe -i `
  -H "X-Correlation-Id: lesson-374" `
  http://localhost:8081/api/v1/runtime/managed-messages/999
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — about:blank

Crie ProblemDetail de fixture sem type customizado.

Observe title e type.

Compare com o catálogo da aplicação.

### Parte 2 — Extension nova

Adicione temporariamente:

```text
documentation.
```

Analise compatibilidade.

Remova antes do commit.

### Parte 3 — Rejected value

Inclua temporariamente o valor rejeitado.

Faça o teste de segurança falhar.

Restaure.

### Parte 4 — Locale

Adicione tradução para outro locale em fixture.

Confirme estrutura estável.

### Parte 5 — Correlation id

Envie um id maior que 64 caracteres.

Confirme que não é refletido.

### Parte 6 — Type HTTPS

Projete uma URI HTTPS documentável para produção.

Não publique endereço falso no código do laboratório.

### Parte 7 — ErrorResponseException

Crie exception web específica em test source.

Compare com exception de aplicação pura.

### Parte 8 — ADR

Registre:

```text
RFC 9457;

ProblemDetail;

application/problem+json;

types estaveis;

codes estaveis;

detail localizado;

instance sem query;

violations sem rejected value;

correlation id validado;

ProblemDetail somente na web.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 373 foi preservada;
- o mesmo projeto foi continuado;
- RFC 9457 foi usada como referência atual;
- RFC 7807 foi reconhecida como obsoleta;
- Problem Details foi diferenciado de status HTTP;
- `ProblemDetail` foi usado;
- `ErrorResponse` foi explicado;
- `ErrorResponseException` foi testado em fixture;
- application layer não passou a depender de Spring Web;
- `application/problem+json` foi validado;
- `type`, `title`, `status`, `detail` e `instance` foram implementados;
- `type` representa categoria;
- `type` não representa ocorrência;
- URNs estáveis foram usadas no laboratório;
- uso futuro de HTTPS documentável foi explicado;
- `about:blank` foi explicado;
- `title` permaneceu curto e estável;
- `status` do body combina com o HTTP;
- `detail` é público e localizado;
- `instance` contém somente path;
- query não foi incluída em instance;
- properties adicionais foram usadas;
- extensions aparecem no nível superior do JSON;
- nenhum membro padrão foi duplicado no properties map;
- `ApiProblemTypes` foi criado;
- `ApiProblemCode` foi criado;
- code público não depende do nome do enum;
- `code` foi diferenciado de `type`;
- `timestamp` foi adicionado;
- `Clock` foi usado;
- `correlationId` foi adicionado;
- `violations` foi adicionado somente quando necessário;
- `ApiViolation` contém location, field, code e message;
- `ApiViolation` não contém rejected value;
- field errors foram mapeados;
- object errors foram mapeados;
- class-level validation foi preservada;
- method validation foi mapeada;
- visitor de `HandlerMethodValidationException` foi usado;
- path errors usam location path;
- query errors usam location query;
- binding error foi diferenciado de validation;
- type mismatch recebeu code público;
- `ValidationErrorCodeResolver` foi criado;
- codes internos desconhecidos viram `invalid`;
- `ValidationViolationMapper` foi criado;
- listas de violations são imutáveis;
- mensagens usam MessageSource;
- base e pt-BR foram criadas;
- title e detail foram localizados;
- violation messages foram localizadas;
- type, code e status não variam por locale;
- `CorrelationIdFilter` foi criado;
- header válido foi preservado;
- header ausente gerou UUID;
- header inválido não foi refletido;
- whitelist e limite de tamanho foram aplicados;
- request attribute foi preenchido;
- response header foi preenchido;
- MDC foi preenchido;
- MDC foi limpo em finally;
- GlobalExceptionHandler foi refatorado;
- body temporário foi removido;
- 400 de body validation usa ProblemDetail;
- 400 de method validation usa ProblemDetail;
- JSON malformado não expõe parser;
- 404 usa problem type e code estáveis;
- 409 usa problem type e code estáveis;
- 405 preserva Allow;
- 415 preserva headers;
- 406 continua sem body;
- 500 usa detail genérico;
- nenhuma mensagem interna foi publicada;
- nenhum stack trace foi publicado;
- nenhum SQL foi publicado;
- nenhum package foi publicado;
- nenhum payload foi publicado;
- `ProblemDetailStandardFieldsTest` foi criado;
- `ProblemDetailExtensionsTest` foi criado;
- `ProblemDetailValidationWebMvcTest` foi criado;
- `ProblemDetailMethodValidationWebMvcTest` foi criado;
- `ProblemDetailApplicationExceptionWebMvcTest` foi criado;
- `ProblemDetailMvcExceptionWebMvcTest` foi criado;
- `ProblemDetailLocalizationWebMvcTest` foi criado;
- `ProblemDetailErrorResponseFixtureTest` foi criado;
- `CorrelationIdFilterTest` foi criado;
- `ProblemDetailSecurityTest` foi criado;
- `ProblemDetailCompatibilityTest` foi criado;
- assertions estruturais substituem snapshot opaco;
- `ProblemDetailArchitectureTest` foi criado;
- ProblemDetail ficou na camada web;
- nenhuma exception de aplicação implementa ErrorResponse;
- `ProblemDetailLiveServerIT` foi criado;
- PostgreSQL real foi preservado;
- documentação completa foi criada;
- scripts foram criados;
- testes de contrato, validation, aplicação, MVC, locale, correlação, segurança, live, suite e package passaram;
- nenhum CRUD novo, PUT, PATCH, OpenAPI, Security, cache ou documentação automática foi antecipado;
- ponte para a aula 375 está correta;
- commit recomendado e diário de bordo estão prontos.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m14): padronizar erros com problem details"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- payload temporário;
- correlation id capturado;
- SQL;
- stack trace;
- CRUD antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a API substituiu o body temporário por um padrão interoperável.

O fluxo consolidado ficou:

```text
exception;

GlobalExceptionHandler;

ApiProblemFactory;

ProblemDetail;

application/problem+json.
```

A estrutura pública ficou:

```text
type;

title;

status;

detail;

instance;

code;

timestamp;

correlationId;

violations quando aplicavel.
```

Você comprovou:

```text
RFC 9457;

types estaveis;

codes estaveis;

mensagens localizadas;

field errors;

object errors;

path errors;

query errors;

correlation id;

MDC limpo;

media type correto;

zero rejected value;

zero stack trace;

zero SQL.
```

A decisão central foi:

```text
o contrato de erro precisa ser
padronizado, seguro, localizavel
e estavel para consumidores,
sem acoplar a aplicacao ao protocolo.
```

A próxima aula será:

```text
375 - M14.20 - CRUD completo parte 1
```

Nela, você continuará no mesmo projeto e estudará:

- definição do recurso principal do CRUD;
- create completo;
- read by id;
- listagem;
- paginação HTTP;
- sorting por whitelist;
- filtros introdutórios;
- DTOs de criação;
- DTOs de detalhe;
- DTOs de resumo;
- commands;
- results;
- mappers;
- application service;
- repository queries;
- status 201;
- status 200;
- status 404;
- Problem Details integrado;
- testes unitários;
- repository tests;
- MockMvc;
- servidor real;
- primeira metade do CRUD profissional.

A aula 374 respondeu:

```text
como publicar erros
em um formato interoperavel e estavel?
```

A aula 375 responderá:

```text
como integrar todas as camadas
na primeira metade
de um CRUD completo?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei explicar os cinco membros da RFC 9457.
- [ ] Sei diferenciar type, code, title e detail.
- [ ] Sei publicar violations sem rejected value.
- [ ] Sei usar correlation id com MDC e limpeza.
- [ ] Sei testar segurança e compatibilidade do contrato de erro.

---

## Troubleshooting adicional

### Content-Type continua application/json

Confirme que o body retornado é `ProblemDetail` e que não existe produces incompatível.

### Properties aparecem dentro de properties

Confirme módulo Jackson do Spring e não crie DTO envolvendo o mapa.

### Violations de path ficam sem nome

Revise o visitor e o nome explícito de `@PathVariable` ou `@RequestParam`.

### Locale nao muda

Confirme `Accept-Language`, MessageSource e bundles.

### Correlation id mistura requests

Confirme remoção do MDC em `finally`.

### 406 entra em loop

Mantenha resposta sem body quando a representação não é aceitável.

---

## Perguntas de revisao

1. O que RFC 9457 define?
2. Qual RFC ela substitui?
3. Quais são os cinco campos padrão?
4. O que `type` identifica?
5. O que `instance` identifica?
6. Para que serve `status` no body?
7. Qual diferença entre title e detail?
8. O que é `about:blank`?
9. Qual media type deve ser usada?
10. O que é `ProblemDetail`?
11. O que é `ErrorResponse`?
12. Application exception deve implementá-lo?
13. Como adicionar extensions?
14. Para que serve code?
15. O que contém uma violation?
16. Por que não publicar rejected value?
17. Como localizar mensagens?
18. Para que serve correlation id?
19. Por que limpar MDC?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Detalhes de problemas para APIs HTTP.
2. RFC 7807.
3. Type, title, status, detail e instance.
4. A categoria do problema.
5. A ocorrência.
6. Facilitar leitura estruturada.
7. Resumo do tipo versus explicação da ocorrência.
8. Type padrão baseado no status.
9. `application/problem+json`.
10. Representação Spring da RFC.
11. Contrato de status, headers e body.
12. Não nesta arquitetura.
13. Com `setProperty`.
14. Decisão de máquina da aplicação.
15. Location, field, code e message.
16. Pode ser sensível.
17. Com MessageSource e locale.
18. Ligar response e logs.
19. Threads são reutilizadas.
20. CRUD completo parte 1.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 374 - M14.19 - Problem Details e padrao de erro

- Continuei no projeto `formacao-java-backend-api`.
- Estudei RFC 9457.
- Entendi que RFC 9457 substitui RFC 7807.
- Adotei `ProblemDetail`.
- Estudei `ErrorResponse` e `ErrorResponseException`.
- Mantive exceptions da aplicação independentes do Spring Web.
- Removi o body temporário da aula anterior.
- Passei a responder com `application/problem+json`.
- Implementei `type`, `title`, `status`, `detail` e `instance`.
- Diferenciei categoria de problema de ocorrência.
- Usei URNs estáveis no laboratório.
- Criei um catálogo de problem types.
- Criei error codes estáveis.
- Diferenciei `type` de `code`.
- Adicionei timestamp.
- Criei violations com location, field, code e message.
- Não publiquei rejected value.
- Mapeei field errors e object errors.
- Mapeei validação de path e query.
- Usei o visitor de `HandlerMethodValidationException`.
- Diferenciei binding de validation.
- Localizei title, detail e mensagens de violations.
- Mantive type, code e status independentes do locale.
- Criei `CorrelationIdFilter`.
- Validei o header `X-Correlation-Id`.
- Gerei UUID quando necessário.
- Propaguei correlation id no header e no Problem Detail.
- Adicionei correlation id ao MDC.
- Limpei o MDC em `finally`.
- Preservei headers de 405 e 415.
- Mantive 406 sem body.
- Evitei stack trace, SQL, classes e payload no erro.
- Criei testes de segurança e compatibilidade.
- Testei contratos com MockMvc e servidor real.
- Não antecipei o CRUD.
- Próxima aula: CRUD completo parte 1.
```

---

## Referencia tecnica curta

```text
RFC 9457:
padrao.

ProblemDetail:
representacao.

Type:
categoria.

Title:
resumo.

Status:
HTTP.

Detail:
ocorrencia.

Instance:
request.

Code:
aplicacao.

Violation:
entrada.

Correlation:
rastreio.
```

Regra final:

```text
o padrao de erro deve usar RFC 9457 e ProblemDetail com type, title, status, detail e instance coerentes; extensions como code, timestamp, correlationId e violations precisam ser estaveis e documentadas, mensagens humanas podem ser localizadas mas codes e types nao devem variar, valores rejeitados e detalhes internos nunca devem ser publicados, e a camada de aplicacao deve permanecer independente de ErrorResponse e do protocolo HTTP.
```
