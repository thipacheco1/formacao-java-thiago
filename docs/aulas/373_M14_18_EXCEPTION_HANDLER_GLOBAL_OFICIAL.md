# 373 - M14.18 - Exception Handler global

## Apresentacao da aula

Na aula 372, a aplicação passou a persistir a feature de mensagens gerenciadas em PostgreSQL real.

O fluxo atual é:

```text
controller;

input port;

application service;

repository port;

Spring Data adapter;

JpaRepository;

Hibernate;

PostgreSQL.
```

Também foram comprovados:

```text
Flyway como dono do schema;

Hibernate em validate;

constraint unica;

exception translation;

transaction manager JPA;

rollback real;

Testcontainers;

contratos HTTP preservados.
```

A aplicação agora pode falhar em diferentes etapas.

Exemplos:

```text
binding:
path ou query nao convertida.

JSON:
body ausente ou malformado.

validation:
constraint pronta ou customizada violada.

aplicacao:
recurso nao encontrado ou conflito.

persistencia:
falha inesperada no adapter.

MVC:
metodo ou media type nao suportado.

programacao:
exception inesperada.
```

Até este ponto, parte desses erros utiliza a resposta padrão do Spring MVC.

Outros ainda são convertidos por ramificações dentro do controller.

Exemplo conceitual:

```java
if (result.isDuplicate()) {
    return ResponseEntity
            .status(
                    HttpStatus.CONFLICT
            )
            .build();
}
```

Essa abordagem funciona em uma API pequena.

Porém, conforme o número de controllers cresce, ela tende a produzir:

- `try/catch` repetido;
- respostas diferentes para a mesma falha;
- mensagens internas expostas;
- status inconsistentes;
- logging duplicado;
- headers perdidos;
- testes espalhados;
- controllers com responsabilidades demais.

A pergunta central desta aula será:

```text
como transformar exceptions
em respostas HTTP consistentes
em um ponto global?
```

A solução utilizará:

```text
@RestControllerAdvice;

@ExceptionHandler;

ResponseEntityExceptionHandler.
```

A classe principal será:

```text
GlobalExceptionHandler.
```

Ela será um componente global da camada web.

O handler tratará quatro famílias.

Primeira:

```text
exceptions internas do Spring MVC.
```

Exemplos:

- `MethodArgumentNotValidException`;
- `HandlerMethodValidationException`;
- `HttpMessageNotReadableException`;
- `TypeMismatchException`;
- `HttpRequestMethodNotSupportedException`;
- `HttpMediaTypeNotSupportedException`;
- `HttpMediaTypeNotAcceptableException`;
- `MissingServletRequestParameterException`;
- `NoResourceFoundException`.

Segunda:

```text
exceptions da camada de aplicacao.
```

Exemplos:

- `ManagedRuntimeMessageNotFoundException`;
- `ManagedRuntimeMessageConflictException`.

Terceira:

```text
exception traduzida da persistencia.
```

Exemplo:

- `ManagedRuntimeMessagePersistenceException`.

Quarta:

```text
falha inesperada.
```

Exemplo:

- `Exception`.

A aula criará um body temporário:

```text
TemporaryApiErrorResponse.
```

Ele terá somente:

- timestamp;
- status;
- error;
- message;
- path.

Esse body não será apresentado como o contrato definitivo da API.

A próxima aula será:

```text
374 - M14.19 - Problem Details e padrao de erro
```

Nela, o body temporário será substituído por um padrão baseado em RFC 9457, com estrutura oficial, extensões, violations e códigos de erro.

Por isso, esta aula não implementará:

- `ProblemDetail`;
- `ErrorResponse` customizado;
- `application/problem+json`;
- URI de `type`;
- `title` definitivo;
- `instance` padronizada;
- lista pública de field errors;
- error code público;
- documentação final do contrato;
- trace id como campo obrigatório;
- versionamento do formato de erro.

O objetivo atual é dominar o mecanismo de resolução global.

O handler preservará informações HTTP importantes.

Exemplo:

```text
405:
header Allow preservado.

415:
media types suportados preservados.

406:
sem body para nao repetir
a falha de content negotiation.
```

O handler não devolverá:

- stack trace;
- nome de classe;
- package;
- SQL;
- constraint name;
- mensagem do driver;
- caminho de arquivo;
- segredo;
- payload recebido.

O logging seguirá uma política inicial:

```text
4xx esperado:
log resumido sem stack trace.

5xx inesperado:
log interno com stack trace.

response:
mensagem publica segura.
```

Correlação será estudada conceitualmente.

Não será criado ainda um filtro de correlation id.

A aula também refatorará a service layer.

Os casos de uso passarão a lançar exceptions de aplicação para:

```text
not found;

conflict.
```

Os controllers deixarão de decidir esses erros.

Eles continuarão responsáveis por:

- mappings;
- request DTO;
- mappers;
- status de sucesso;
- headers de sucesso;
- `Location`;
- ETag;
- body de sucesso.

A infraestrutura global será responsável por falhas.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
369:
Bean Validation.

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
```

A aula 372 respondeu:

```text
como implementar o port
com Spring Data e PostgreSQL?
```

A aula 373 responderá:

```text
como transformar exceptions
em respostas HTTP globais
sem poluir os controllers?
```

Nesta aula:

```text
@ControllerAdvice:
sim.

@RestControllerAdvice:
sim.

@ExceptionHandler:
sim.

ResponseEntityExceptionHandler:
sim.

exceptions MVC:
sim.

exceptions de aplicacao:
sim.

exception de persistencia:
sim.

handler generico:
sim.

prioridade:
sim.

local versus global:
sim.

root versus cause:
sim.

logging:
sim.

body temporario:
sim.

stack trace no JSON:
nao.

ProblemDetail:
nao.

padrao definitivo:
nao.
```

A regra central será:

```text
exceptions expressam falhas;

o advice traduz essas falhas
para o protocolo HTTP;

o body definitivo pertence
a uma decisao de contrato separada.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura de aplicação:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageUseCases.java
│       ├── ManagedRuntimeMessageApplicationService.java
│       └── exception
│           ├── ManagedRuntimeMessageConflictException.java
│           ├── ManagedRuntimeMessageNotFoundException.java
│           └── ManagedRuntimeMessagePersistenceException.java
├── infrastructure
│   └── persistence
│       └── jpa
│           └── adapter
│               └── SpringDataManagedRuntimeMessageRepositoryAdapter.java
└── web
    └── error
        ├── GlobalExceptionHandler.java
        ├── TemporaryApiErrorResponse.java
        └── TemporaryErrorMessageResolver.java
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageExceptionFlowTest.java
│       └── ManagedRuntimeMessageUseCasesContractTest.java
└── web
    └── error
        ├── GlobalMvcExceptionHandlerWebMvcTest.java
        ├── ApplicationExceptionHandlerWebMvcTest.java
        ├── PersistenceExceptionHandlerWebMvcTest.java
        ├── UnexpectedExceptionHandlerWebMvcTest.java
        ├── LocalExceptionHandlerPrecedenceTest.java
        ├── ControllerAdviceOrderTest.java
        ├── ExceptionCauseMatchingTest.java
        ├── ExceptionHeadersPreservationTest.java
        ├── SensitiveErrorResponseTest.java
        ├── GlobalExceptionHandlerArchitectureTest.java
        └── GlobalExceptionHandlerLiveServerIT.java
```

Documentação:

```text
docs
├── spring-mvc-exception-resolution.md
├── controller-advice.md
├── exception-handler-mapping.md
├── response-entity-exception-handler.md
├── mvc-exception-matrix.md
├── application-exception-matrix.md
├── exception-handler-precedence.md
├── exception-logging-policy.md
├── sensitive-error-data.md
├── error-correlation-concept.md
└── global-exception-handler-baseline.md
```

Scripts:

```text
scripts
├── 93_testar_binding_validation_errors.ps1
├── 94_testar_method_media_errors.ps1
├── 95_testar_application_exceptions.ps1
├── 96_testar_unexpected_error.ps1
├── 97_validar_resposta_sem_dados_sensiveis.ps1
└── 98_executar_testes_exception_handler.ps1
```

Resultados esperados:

```text
body invalido:
400.

validation do body:
400.

validation de path ou query:
400.

type mismatch:
400.

method not allowed:
405 com Allow.

media type nao suportado:
415.

Accept incompativel:
406 sem body.

rota inexistente:
404.

recurso da aplicacao ausente:
404.

conflito de aplicacao:
409.

falha de persistencia:
500 seguro.

exception inesperada:
500 seguro.

controller com try/catch:
zero.

stack trace no body:
zero.

classe da exception no body:
zero.

SQL no body:
zero.

ProblemDetail:
zero.
```

---

## Conceito essencial

### Exception handling no Spring MVC

O `DispatcherServlet` coordena a request.

Quando um handler lança exception, a infraestrutura consulta a cadeia de:

```text
HandlerExceptionResolver.
```

Resolvers podem:

- localizar `@ExceptionHandler`;
- aplicar status conhecidos;
- tratar exceptions MVC;
- produzir uma resposta;
- permitir que a cadeia continue.

O global advice participa desse mecanismo.

---

### @ExceptionHandler local

Um controller pode declarar:

```java
@ExceptionHandler(
        MinhaException.class
)
public ResponseEntity<?> handle(
        MinhaException exception
) {
}
```

Esse handler é local ao controller e à sua hierarquia.

Ele pode ser útil quando uma falha é exclusiva daquela superfície.

Entretanto, erros comuns da API não devem ser repetidos em cada controller.

---

### @ControllerAdvice

`@ControllerAdvice` é um component global.

Ele pode compartilhar:

- `@ExceptionHandler`;
- `@InitBinder`;
- `@ModelAttribute`.

Nesta aula, somente exception handling será usado.

Como ele é component, o component scan registra o bean.

---

### @RestControllerAdvice

`@RestControllerAdvice` combina:

```text
@ControllerAdvice;

@ResponseBody.
```

Os retornos dos handlers passam pelos message converters.

Para uma API JSON, essa composição é mais direta que um advice orientado a views.

---

### Escopo do advice

Um advice pode ser limitado por:

- packages;
- annotations;
- tipos atribuíveis.

A aplicação atual utilizará um advice global sem selector.

Isso garante consistência entre todos os REST controllers.

Selectors adicionais somente devem ser usados quando existem políticas realmente diferentes.

---

### Local antes do global

Handlers locais são avaliados antes dos handlers globais.

Um controller com handler local pode substituir o comportamento global para aquela exception.

A aula comprovará isso em fixture de teste.

Nenhum handler local será mantido nos controllers de produção.

---

### @ExceptionHandler mapping

O método pode declarar a exception no argumento:

```java
@ExceptionHandler(
        ManagedRuntimeMessageNotFoundException.class
)
ResponseEntity<?> handleNotFound(
        ManagedRuntimeMessageNotFoundException exception,
        WebRequest request
) {
}
```

Prefira argumentos específicos.

Isso reduz ambiguidades e facilita leitura.

---

### Root e cause

O Spring pode encontrar uma exception:

- no nível raiz;
- em causes aninhadas.

Dentro do mesmo controller ou advice, um match de raiz é normalmente preferido a um match em cause.

A profundidade da exception participa da escolha.

Não crie handlers genéricos demais quando um tipo específico representa a falha.

---

### Multiplos advices

Vários advices podem possuir:

```text
@Order;

Ordered.
```

Um advice de prioridade maior pode vencer outro advice.

Uma correspondência por cause em advice prioritário pode ser escolhida antes de uma correspondência raiz em advice de prioridade menor.

Mantenha a quantidade de advices pequena e a ordem documentada.

Nesta baseline, haverá somente um advice de produção.

---

### Rethrow

Um handler pode relançar a mesma exception quando decide não tratá-la naquele contexto.

A resolução continua como se o handler não tivesse resolvido a falha.

Esse recurso é avançado.

Não será usado na baseline.

---

### Media type no handler

`@ExceptionHandler` pode declarar `produces`.

Isso permite respostas diferentes para JSON e HTML.

A aplicação é uma API JSON.

O handler temporário produzirá JSON quando a negociação permitir.

O 406 será tratado sem body porque o cliente declarou não aceitar a representação disponível.

---

### Argumentos do handler

Um handler pode receber:

- exception;
- `WebRequest`;
- `HttpServletRequest`;
- `HttpMethod`;
- locale;
- principal;
- `HandlerMethod`.

A baseline utilizará:

```text
exception;

WebRequest.
```

O path será extraído de `ServletWebRequest` quando disponível.

---

### Retornos do handler

Um handler pode retornar:

- `ResponseEntity`;
- objeto com `@ResponseBody`;
- `ProblemDetail`;
- `ErrorResponse`;
- view;
- `ModelAndView`;
- void.

Nesta aula:

```text
ResponseEntity<Object>.
```

Problem Details ficará para a aula 374.

---

### ResponseEntityExceptionHandler

`ResponseEntityExceptionHandler` é uma classe base conveniente para um advice REST.

Ela possui um `@ExceptionHandler` para várias exceptions internas do Spring MVC.

Ela oferece métodos protegidos para customização.

Exemplos:

- `handleMethodArgumentNotValid`;
- `handleHandlerMethodValidationException`;
- `handleHttpMessageNotReadable`;
- `handleTypeMismatch`;
- `handleHttpRequestMethodNotSupported`;
- `handleHttpMediaTypeNotSupported`;
- `handleHttpMediaTypeNotAcceptable`;
- `handleNoResourceFoundException`;
- `handleExceptionInternal`.

A baseline estenderá essa classe.

---

### handleExceptionInternal

Esse método centraliza a criação final de `ResponseEntity`.

Assinatura conceitual:

```java
protected ResponseEntity<Object>
        handleExceptionInternal(
                Exception exception,
                Object body,
                HttpHeaders headers,
                HttpStatusCode status,
                WebRequest request
        ) {
}
```

A implementação da aula substituirá o body recebido por:

```text
TemporaryApiErrorResponse.
```

Assim, exceptions MVC diferentes compartilham a mesma forma provisória.

---

### Cuidado com ProblemDetail implicito

O Spring Framework moderno utiliza `ProblemDetail` em vários caminhos padrão de `ResponseEntityExceptionHandler`.

Como a aula 374 será dedicada a esse padrão, a aula 373 substituirá explicitamente o body interno.

O teste arquitetural confirmará:

```text
nenhum ProblemDetail
no contrato desta aula.
```

---

### 406 sem body

Considere:

```text
Accept: text/plain.
```

A API só consegue produzir JSON.

A tentativa original resulta em:

```text
406 Not Acceptable.
```

Se o exception handler tentar responder com JSON, a content negotiation pode falhar novamente.

Por isso:

```text
406:
status e headers;
sem body.
```

Essa é uma decisão técnica da baseline, não o padrão final de erros.

---

### Headers do resolver

A infraestrutura pode fornecer headers relevantes.

Exemplo:

```text
405:
Allow.

415:
Accept ou media types suportados.
```

O handler deve reutilizar o objeto `HttpHeaders` recebido.

Não crie um `ResponseEntity` novo descartando esses headers.

---

### Exception de aplicacao

Uma exception de aplicação representa uma falha reconhecida pelo caso de uso.

Exemplo:

```text
ManagedRuntimeMessageNotFoundException.
```

Ela não conhece:

- HTTP 404;
- `ResponseEntity`;
- JSON;
- controller;
- `HttpStatus`.

O advice traduz a exception para HTTP.

---

### Not found

O use case pode oferecer:

```text
ManagedRuntimeMessage getById(
        long id
).
```

Quando o port retorna vazio:

```java
throw new ManagedRuntimeMessageNotFoundException(
        id
);
```

O controller não recebe `Optional`.

O handler global converte para:

```text
404.
```

---

### Conflict

A criação pode detectar duplicidade por:

- precheck;
- constraint única concorrente.

Nos dois casos, o application service lança:

```text
ManagedRuntimeMessageConflictException.
```

O handler converte para:

```text
409.
```

O mesmo status é preservado, mas a decisão deixa de estar no controller.

---

### Exception de persistencia traduzida

O adapter já não deve vazar `DataAccessException`.

Falhas inesperadas serão convertidas para:

```text
ManagedRuntimeMessagePersistenceException.
```

A classe pertence à fronteira da aplicação.

O handler devolve:

```text
500.
```

A mensagem pública não revela banco, SQL ou driver.

---

### Handler generico

Um handler:

```java
@ExceptionHandler(
        Exception.class
)
```

funciona como última proteção.

Ele não deve substituir handlers específicos.

Ele registra stack trace internamente e devolve mensagem segura.

Não capture:

```text
Throwable.
```

Erros graves da JVM não devem ser tratados como exceptions comuns da aplicação.

---

### Body temporario

O record será:

```java
public record TemporaryApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path
) {
}
```

Ele é temporário.

O nome torna a intenção explícita.

Não inclua:

- exception;
- trace;
- SQL;
- cause;
- localizedMessage;
- stackTrace;
- validation object.

---

### Mensagem publica

`TemporaryErrorMessageResolver` escolhe mensagens seguras.

Exemplos:

```text
400:
The request is invalid.

404:
The requested resource was not found.

409:
The request conflicts with the current state.

500:
An unexpected error occurred.
```

O resolver não reutiliza:

```java
exception.getMessage()
```

como resposta pública.

---

### Logging

Política inicial:

```text
4xx:
debug ou info resumido.

5xx reconhecido:
error com exception.

5xx inesperado:
error com stack trace.
```

O log pode conter:

- método;
- path;
- status;
- tipo da exception;
- error id futuro.

Não registre:

- senha;
- token;
- body completo;
- SQL com dados;
- header Authorization;
- stack trace em toda falha 400.

---

### Correlacao conceitual

Uma API profissional normalmente associa logs e responses a um identificador.

Possíveis fontes:

- gateway;
- header de entrada;
- filtro da aplicação;
- tracing distribuído.

Nesta aula, o campo não será adicionado ao body temporário.

A implementação correta exige política de geração, propagação e logging.

Ela será integrada ao padrão definitivo posteriormente.

---

### Status e mensagem

Status HTTP é parte do protocolo.

Mensagem é conteúdo humano.

Não use a mensagem para o cliente tomar decisões de máquina.

A aula 374 introduzirá um formato mais adequado para códigos e detalhes estruturados.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Docker precisa estar ativo para a suite persistente.

---

### 2. Criar exceptions de aplicacao

Package:

```text
br.com.formacao.backend.application.managedmessage.exception.
```

Crie:

```text
ManagedRuntimeMessageNotFoundException;

ManagedRuntimeMessageConflictException;

ManagedRuntimeMessagePersistenceException.
```

Todas estendem:

```text
RuntimeException.
```

Nenhuma importa Spring Web.

---

### 3. Proteger mensagens internas

`ManagedRuntimeMessageNotFoundException` pode guardar:

```text
id.
```

`ManagedRuntimeMessageConflictException` não precisa guardar o valor completo.

`ManagedRuntimeMessagePersistenceException` recebe cause, mas usa mensagem interna genérica.

O body HTTP não reutilizará essas mensagens.

---

### 4. Simplificar o input port

Evolua:

```java
ManagedRuntimeMessage create(
        ManagedRuntimeMessageCreateCommand command
);

ManagedRuntimeMessage getById(
        long id
);

void deleteById(
        long id
);
```

Remova outcomes que deixaram de ser necessários.

Faça a alteração somente depois de atualizar os testes.

---

### 5. Evoluir create no application service

No precheck:

```java
if (
    repository.existsByNormalizedValue(
            normalizedValue
    )
) {
    throw new ManagedRuntimeMessageConflictException();
}
```

Ao receber exception de duplicidade da porta:

```text
traduzir para conflict.
```

Ao receber falha genérica da porta:

```text
propagar persistence exception.
```

---

### 6. Evoluir getById

```java
return repository
        .findById(id)
        .orElseThrow(
                () ->
                        new ManagedRuntimeMessageNotFoundException(
                                id
                        )
        );
```

O application service continua read-only.

---

### 7. Evoluir deleteById

Quando o port retorna false:

```java
throw new ManagedRuntimeMessageNotFoundException(
        id
);
```

Quando retorna true:

```text
retorno void.
```

O controller produzirá 204 após conclusão.

---

### 8. Traduzir persistence exceptions no adapter

No adapter:

- unique constraint conhecida vira exception de duplicidade da porta;
- `DataAccessException` inesperada vira `ManagedRuntimeMessagePersistenceException`;
- não capture `Exception`;
- preserve cause para o log interno;
- não exponha mensagem do driver.

---

### 9. Simplificar controller

POST:

```text
mapper request para command;

use case create;

mapper model para response;

201.
```

GET:

```text
use case getById;

mapper detail;

200 ou 304.
```

DELETE:

```text
use case deleteById;

204.
```

Remova:

- `try/catch`;
- `Optional` branching;
- conflict branching;
- not-found branching.

---

### 10. Criar TemporaryApiErrorResponse

Package:

```text
br.com.formacao.backend.web.error.
```

Use record.

No construtor compacto:

- `timestamp` não nulo;
- `status` positivo;
- `error` não blank;
- `message` não blank;
- `path` não nulo.

Não adicione annotations Jackson sem necessidade.

---

### 11. Criar TemporaryErrorMessageResolver

Use component stateless.

Método:

```java
String resolve(
        Exception exception,
        HttpStatusCode status
).
```

Faça matching específico para exceptions da aplicação.

Para exceptions MVC, use mensagens públicas por família.

Para 5xx, retorne sempre mensagem genérica.

---

### 12. Criar GlobalExceptionHandler

Estrutura:

```java
@RestControllerAdvice
@Order(
        Ordered.LOWEST_PRECEDENCE
)
public class GlobalExceptionHandler
        extends ResponseEntityExceptionHandler {
}
```

Injete:

```text
Clock;

TemporaryErrorMessageResolver.
```

Use `Clock` para testes determinísticos.

---

### 13. Criar handlers de aplicacao

Adicione métodos específicos:

```java
@ExceptionHandler(
        ManagedRuntimeMessageNotFoundException.class
)
```

Status:

```text
404.
```

Conflict:

```text
409.
```

Persistence:

```text
500.
```

Use `handleExceptionInternal`.

---

### 14. Criar handler inesperado

```java
@ExceptionHandler(
        Exception.class
)
```

Status:

```text
500.
```

Registre stack trace.

Retorne mensagem pública segura.

Não inclua `exception.getMessage()` no body.

---

### 15. Override handleExceptionInternal

Fluxo:

1. verificar se response já foi committed conforme superclass;
2. preservar headers;
3. se status 406, body null;
4. resolver mensagem pública;
5. extrair path;
6. criar body temporário;
7. logar;
8. delegar ao superclass com o novo body.

Não modifique status fornecido pelo Spring sem justificativa.

---

### 16. Extrair path

Se:

```java
request instanceof ServletWebRequest servletRequest
```

use:

```java
servletRequest
        .getRequest()
        .getRequestURI();
```

Fallback:

```text
request.getDescription(false).
```

Não inclua query completa quando ela puder conter dados sensíveis.

---

### 17. Preservar headers

Passe:

```text
headers
```

ao superclass.

Teste:

```text
405:
Allow contém métodos.

415:
headers informativos preservados.
```

Não reconstrua todos os headers manualmente.

---

### 18. Tratar 406 sem body

Override opcional:

```text
handleHttpMediaTypeNotAcceptable.
```

Ou especialize em `handleExceptionInternal`.

Resultado:

```text
406;

body vazio.
```

O teste deve enviar `Accept` incompatível.

---

### 19. Testar body validation

Envie create request blank.

Valide:

- 400;
- content type JSON;
- body temporário;
- path;
- message segura;
- service não chamado;
- nenhum field error público ainda.

---

### 20. Testar method validation

Envie:

```text
limit=0;

position=0.
```

Valide:

- 400;
- handler global;
- body temporário;
- nenhuma classe da exception.

---

### 21. Testar malformed JSON

Envie body quebrado.

Valide:

- 400;
- mensagem pública;
- nenhuma mensagem do Jackson;
- nenhum trecho do payload.

---

### 22. Testar type mismatch

Envie:

```text
position=abc.
```

Valide:

- 400;
- mensagem pública;
- path correto.

---

### 23. Testar method not allowed

Envie PUT para endpoint somente GET.

Valide:

- 405;
- `Allow`;
- body temporário;
- status coerente.

---

### 24. Testar media type

Envie POST com:

```text
Content-Type: text/plain.
```

Valide:

- 415;
- body temporário;
- headers preservados.

---

### 25. Testar Accept incompatível

Envie:

```text
Accept: text/plain.
```

a endpoint JSON.

Valide:

- 406;
- body vazio;
- sem segunda exception de escrita.

---

### 26. Testar rota inexistente

Chame uma rota inexistente.

Valide:

- 404;
- body temporário quando resolvida por `NoResourceFoundException`;
- path correto.

Não altere configurações de recursos estáticos sem necessidade.

---

### 27. Testar not found da aplicacao

Mocke use case para lançar:

```text
ManagedRuntimeMessageNotFoundException.
```

Valide:

- 404;
- mensagem pública;
- nenhum id sensível além do path;
- mapper não executado após a falha.

---

### 28. Testar conflict

Mocke:

```text
ManagedRuntimeMessageConflictException.
```

Valide:

- 409;
- mensagem pública;
- valor duplicado ausente do body.

---

### 29. Testar persistence failure

Mocke:

```text
ManagedRuntimeMessagePersistenceException.
```

com cause de fixture contendo:

```text
SQL;

constraint;

hostname.
```

Valide:

- 500;
- body sem esses dados;
- log interno registra exception.

---

### 30. Testar unexpected exception

Crie controller somente em test source que lança:

```text
IllegalStateException.
```

Valide:

- 500;
- body seguro;
- stack trace não serializado;
- advice usado.

Não crie endpoint de crash em produção.

---

### 31. Testar precedencia local

Controller fixture com:

```text
@ExceptionHandler.
```

Global advice também consegue tratar a mesma exception.

Valide que o handler local vence.

Remova qualquer handler local dos controllers reais.

---

### 32. Testar order entre advices

Crie dois advices somente em test source:

```text
@Order(1);

@Order(2).
```

Use exception de fixture.

Valide que a prioridade documentada vence.

Não adicione múltiplos advices de produção.

---

### 33. Testar root e cause

Crie exception wrapper com cause específica.

Configure handlers de fixture.

Valide:

- root match dentro do mesmo advice;
- cause match quando não existe root específico;
- comportamento documentado.

Não escreva lógica manual para percorrer causes no advice real.

---

### 34. Testar dados sensiveis

Para todos os bodies, confirme ausência de strings:

```text
java.;

org.springframework.;

org.hibernate.;

select ;

insert ;

constraint;

password;

stackTrace;

exception;

cause.
```

Use case-insensitive quando adequado.

---

### 35. Criar teste arquitetural

Valide:

- um `@RestControllerAdvice` de produção;
- ele estende `ResponseEntityExceptionHandler`;
- controllers sem `@ExceptionHandler`;
- controllers sem `try/catch` genérico;
- exceptions de aplicação sem imports web;
- body temporário somente em `web.error`;
- zero `ProblemDetail`;
- zero `ErrorResponse` customizado;
- zero stack trace field;
- zero SQL field;
- handler genérico usa `Exception`, não `Throwable`;
- advice não acessa repository;
- advice não acessa EntityManager.

---

### 36. Criar teste live

Use:

```text
@SpringBootTest;

RANDOM_PORT;

PostgreSQLContainer;

@ServiceConnection.
```

Fluxo:

- create inválido 400;
- create válido 201;
- duplicate 409;
- get ausente 404;
- content type inválido 415;
- method inválido 405;
- Accept inválido 406;
- fixture inesperada 500 somente no contexto de teste.

Confirme JSON provisório onde aplicável.

---

### 37. Criar documentacao

Em `spring-mvc-exception-resolution.md`, desenhe resolvers.

Em `controller-advice.md`, compare local e global.

Em `exception-handler-mapping.md`, documente root, cause e media type.

Em `response-entity-exception-handler.md`, liste métodos protegidos.

Em `mvc-exception-matrix.md`, mapeie exceptions MVC.

Em `application-exception-matrix.md`, mapeie 404, 409 e 500.

Em `exception-handler-precedence.md`, registre local, global e order.

Em `exception-logging-policy.md`, registre níveis e dados proibidos.

Em `sensitive-error-data.md`, liste informações nunca públicas.

Em `error-correlation-concept.md`, desenhe propagação futura.

Em `global-exception-handler-baseline.md`, registre o body temporário.

---

### 38. Criar scripts

`93_testar_binding_validation_errors.ps1` testa 400.

`94_testar_method_media_errors.ps1` testa 405, 406 e 415.

`95_testar_application_exceptions.ps1` testa 404 e 409.

`96_testar_unexpected_error.ps1` executa somente fixture de teste.

`97_validar_resposta_sem_dados_sensiveis.ps1` pesquisa conteúdo proibido.

`98_executar_testes_exception_handler.ps1` executa a suite da aula.

---

### 39. Executar testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=GlobalMvcExceptionHandlerWebMvcTest,ApplicationExceptionHandlerWebMvcTest,PersistenceExceptionHandlerWebMvcTest test
```

---

### 40. Executar precedencia

```powershell
.\mvnw.cmd `
  -Dtest=LocalExceptionHandlerPrecedenceTest,ControllerAdviceOrderTest,ExceptionCauseMatchingTest test
```

---

### 41. Executar seguranca

```powershell
.\mvnw.cmd `
  -Dtest=SensitiveErrorResponseTest,GlobalExceptionHandlerArchitectureTest test
```

---

### 42. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=GlobalExceptionHandlerLiveServerIT test
```

Docker precisa estar ativo.

---

### 43. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 44. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 45. Revisar escopo

Confirme:

```text
@RestControllerAdvice:
um.

handler local em producao:
zero.

try/catch em controller:
zero.

ProblemDetail:
zero.

application/problem+json:
zero.

field errors publicos:
zero.

stack trace no body:
zero.

SQL no body:
zero.

ControllerAdvice acessando repository:
zero.
```

---

### 46. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- logs de stack trace;
- payload inválido temporário;
- endpoint de crash;
- SQL;
- dump;
- body definitivo de erro;
- Problem Details antecipado.

---

## Entendendo o que foi feito

### O controller deixou de decidir falhas repetidas

Not found e conflict passaram a ser traduzidos globalmente.

### As exceptions MVC ganharam uma porta comum

`ResponseEntityExceptionHandler` centralizou os caminhos internos.

### Headers importantes foram preservados

405 e 415 mantiveram metadata do protocolo.

### O body permaneceu deliberadamente temporario

A aula treinou o mecanismo sem antecipar o padrão da aula 374.

### Dados internos ficaram protegidos

Stack trace, SQL, packages e causes não foram serializados.

---

## Erros comuns importantes

### Retornar exception.getMessage no JSON

Mensagens internas podem conter SQL, ids, paths ou detalhes do driver.

### Capturar Exception no controller

A regra global fica duplicada e o controller cresce.

### Perder o header Allow

Um novo `ResponseEntity` sem os headers fornecidos quebra a semântica do 405.

### Responder JSON durante 406

A negociação pode falhar novamente.

### Criar um handler Throwable

Erros graves da JVM não devem ser tratados como falhas comuns.

---

## Comandos uteis

### Testes de exceptions MVC

```powershell
.\mvnw.cmd `
  -Dtest=GlobalMvcExceptionHandlerWebMvcTest test
```

### Testes de aplicacao

```powershell
.\mvnw.cmd `
  -Dtest=ApplicationExceptionHandlerWebMvcTest test
```

### Testes de seguranca

```powershell
.\mvnw.cmd `
  -Dtest=SensitiveErrorResponseTest,GlobalExceptionHandlerArchitectureTest test
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Handler local

Crie handler local em fixture.

Compare com o advice global.

Remova depois.

### Parte 2 — Cause aninhada

Crie uma exception com três níveis de cause.

Observe o match específico.

### Parte 3 — Headers

Quebre temporariamente a preservação de headers.

Faça o teste de 405 falhar.

Restaure.

### Parte 4 — Mensagem sensivel

Use uma exception de fixture com senha e SQL na mensagem.

Confirme que o body não publica.

### Parte 5 — 406

Tente devolver body JSON para Accept text/plain.

Observe o risco e restaure a resposta sem body.

### Parte 6 — Handler generico

Remova temporariamente o handler específico de conflito.

Observe o 500 incorreto.

Restaure.

### Parte 7 — Order

Inverta a ordem dos advices de fixture.

Confirme a mudança.

### Parte 8 — ADR

Registre:

```text
um advice global;

handlers especificos antes do generico;

ResponseEntityExceptionHandler para MVC;

headers preservados;

406 sem body;

exceptions de aplicacao sem HTTP;

mensagens publicas seguras;

4xx sem stack trace;

5xx com log interno;

Problem Details somente na aula seguinte.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 372 foi preservada;
- o mesmo projeto foi continuado;
- mecanismo `HandlerExceptionResolver` foi explicado;
- handler local foi diferenciado de global;
- `@ControllerAdvice` foi explicado;
- `@RestControllerAdvice` foi usado;
- shortcut com `@ResponseBody` foi explicado;
- advice foi registrado por component scan;
- escopo global foi documentado;
- selectors foram apresentados sem uso desnecessário;
- handlers locais foram reconhecidos como prioritários;
- nenhum handler local permaneceu em controller de produção;
- `@ExceptionHandler` usou argumentos específicos;
- root match foi explicado;
- cause match foi explicado;
- nested causes foram testadas;
- ordem entre advices foi testada;
- um único advice permaneceu em produção;
- rethrow foi explicado sem uso desnecessário;
- media type mapping foi explicado;
- `ResponseEntity` foi usado como retorno;
- `ResponseEntityExceptionHandler` foi estendido;
- exceptions MVC suportadas foram mapeadas;
- `handleExceptionInternal` foi sobrescrito;
- body padrão moderno foi substituído temporariamente;
- nenhum `ProblemDetail` foi usado;
- 406 retornou sem body;
- 405 preservou `Allow`;
- 415 preservou headers relevantes;
- status fornecido pelo Spring foi preservado;
- `TemporaryApiErrorResponse` foi criado;
- body contém somente timestamp, status, error, message e path;
- body foi documentado como temporário;
- stack trace não foi incluído;
- exception class não foi incluída;
- cause não foi incluída;
- SQL não foi incluído;
- mensagem do driver não foi incluída;
- payload não foi incluído;
- `TemporaryErrorMessageResolver` foi criado;
- mensagens públicas não reutilizam `exception.getMessage`;
- 5xx usa mensagem genérica;
- path foi extraído sem query sensível;
- `Clock` foi injetado para testes determinísticos;
- `ManagedRuntimeMessageNotFoundException` foi criada;
- `ManagedRuntimeMessageConflictException` foi criada;
- `ManagedRuntimeMessagePersistenceException` foi criada;
- exceptions de aplicação não importam Spring Web;
- input port foi simplificado;
- controller não recebe Optional para not found;
- controller não decide conflict;
- controller não possui `try/catch` genérico;
- create lança conflict em precheck;
- corrida de unique constraint também vira conflict;
- get lança not found;
- delete lança not found;
- adapter traduz falhas inesperadas;
- `DataAccessException` não vaza;
- not found retorna 404;
- conflict retorna 409;
- persistence failure retorna 500;
- exception inesperada retorna 500;
- handler genérico usa `Exception`, não `Throwable`;
- 4xx possui logging resumido;
- 5xx possui logging interno com stack trace;
- dados sensíveis não são logados deliberadamente;
- correlation id foi explicado sem implementação prematura;
- `GlobalMvcExceptionHandlerWebMvcTest` foi criado;
- body validation, method validation, malformed JSON e type mismatch foram testados;
- method not allowed foi testado;
- media type não suportado foi testado;
- Accept incompatível foi testado;
- rota inexistente foi testada;
- `ApplicationExceptionHandlerWebMvcTest` foi criado;
- `PersistenceExceptionHandlerWebMvcTest` foi criado;
- `UnexpectedExceptionHandlerWebMvcTest` foi criado;
- endpoint de crash ficou somente em test source;
- `LocalExceptionHandlerPrecedenceTest` foi criado;
- `ControllerAdviceOrderTest` foi criado;
- `ExceptionCauseMatchingTest` foi criado;
- `ExceptionHeadersPreservationTest` foi criado;
- `SensitiveErrorResponseTest` foi criado;
- `GlobalExceptionHandlerArchitectureTest` foi criado;
- `GlobalExceptionHandlerLiveServerIT` foi criado;
- teste live usou PostgreSQL real;
- documentação completa foi criada;
- scripts foram criados;
- testes MVC, precedência, segurança, live, suite e package passaram;
- nenhum Problem Details, ErrorResponse customizado, field errors públicos, error code definitivo, ControllerAdvice adicional, cache ou Security foi antecipado;
- ponte para a aula 374 está correta;
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
git commit -m "feat(m14): centralizar tratamento global de exceptions"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- payload temporário;
- endpoint de crash;
- SQL;
- stack trace;
- Problem Details antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, o tratamento de falhas deixou de ficar distribuído pelos controllers.

O fluxo consolidado ficou:

```text
exception MVC ou aplicacao;

HandlerExceptionResolver;

handler local quando existir;

@RestControllerAdvice;

@ExceptionHandler;

ResponseEntityExceptionHandler;

status, headers e body temporario.
```

Você comprovou:

```text
400 para binding e validation;

404 para recurso ausente;

405 com Allow;

406 sem body;

409 para conflito;

415 para media type;

500 seguro;

headers preservados;

logging separado da resposta;

zero stack trace publico;

zero SQL publico;

controllers sem try/catch.
```

A decisão central foi:

```text
o advice global deve traduzir exceptions
para HTTP com consistencia e seguranca,
sem definir prematuramente
o contrato definitivo do erro.
```

A próxima aula será:

```text
374 - M14.19 - Problem Details e padrao de erro
```

Nela, você continuará no mesmo projeto e estudará:

- RFC 9457;
- `ProblemDetail`;
- `ErrorResponse`;
- `ErrorResponseException`;
- `application/problem+json`;
- `type`;
- `title`;
- `status`;
- `detail`;
- `instance`;
- properties adicionais;
- error code;
- violations;
- field errors;
- object errors;
- path e query errors;
- localization;
- correlation id;
- timestamp;
- versionamento;
- segurança;
- documentação;
- compatibilidade;
- testes de contrato;
- migração do body temporário.

A aula 373 respondeu:

```text
como centralizar a traducao
de exceptions para HTTP?
```

A aula 374 responderá:

```text
como transformar essa traducao
em um padrao de erro interoperavel,
estavel e documentado?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar handler local e advice global.
- [ ] Sei usar `ResponseEntityExceptionHandler`.
- [ ] Sei preservar status e headers das exceptions MVC.
- [ ] Sei mapear exceptions da aplicação sem acoplar HTTP.
- [ ] Sei impedir vazamento de stack trace e mensagens internas.

---

## Troubleshooting adicional

### Advice nao executa

Confirme component scan, annotation e se outro handler local resolveu antes.

### 405 perdeu Allow

Preserve o `HttpHeaders` recebido pelo método base.

### 406 gera nova exception

Não tente escrever uma representação incompatível com o `Accept`.

### Teste recebe ProblemDetail

Confirme override de `handleExceptionInternal` e ausência de caminho não customizado.

### 500 publica mensagem interna

Não use `exception.getMessage()` como mensagem pública.

### Handler especifico nao vence

Revise tipo, ordem dos advices e root versus cause.

---

## Perguntas de revisao

1. O que é `HandlerExceptionResolver`?
2. Qual diferença entre handler local e global?
3. O que `@RestControllerAdvice` combina?
4. Para que serve `@ExceptionHandler`?
5. Root e cause podem ser usados no matching?
6. Como ordenar vários advices?
7. O que faz `ResponseEntityExceptionHandler`?
8. Para que serve `handleExceptionInternal`?
9. Por que preservar headers recebidos?
10. Por que 406 fica sem body?
11. Onde ficam exceptions de aplicação?
12. Elas devem conhecer HttpStatus?
13. Qual status representa not found?
14. Qual status representa conflict?
15. Como tratar falha de persistência?
16. Para que serve o handler genérico?
17. Deve capturar Throwable?
18. O body temporário é definitivo?
19. Stack trace pode sair no JSON?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Resolver exceptions no DispatcherServlet.
2. Um vale para controller; outro para todos.
3. ControllerAdvice e ResponseBody.
4. Mapear tipo de exception para handler.
5. Sim.
6. Com Order ou Ordered.
7. Base para exceptions MVC.
8. Centralizar ResponseEntity.
9. Manter semântica HTTP.
10. Evitar nova falha de negociação.
11. Camada de aplicação.
12. Não.
13. 404.
14. 409.
15. Traduzir e responder 500 seguro.
16. Última proteção.
17. Não.
18. Não.
19. Não.
20. Problem Details e padrão de erro.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 373 - M14.18 - Exception Handler global

- Continuei no projeto `formacao-java-backend-api`.
- Entendi a cadeia de `HandlerExceptionResolver`.
- Diferenciei `@ControllerAdvice` de `@RestControllerAdvice`.
- Diferenciei handler local de global.
- Usei `@ExceptionHandler`.
- Estudei matching por root e cause.
- Estudei prioridade entre múltiplos advices.
- Criei `GlobalExceptionHandler`.
- Estendi `ResponseEntityExceptionHandler`.
- Sobrescrevi `handleExceptionInternal`.
- Centralizei exceptions internas do Spring MVC.
- Tratei binding, validation, JSON, método e media type.
- Preservei headers como `Allow`.
- Retornei 406 sem body.
- Criei um body temporário de erro.
- Mantive Problem Details para a próxima aula.
- Criei exceptions de aplicação para not found e conflict.
- Mantive as exceptions sem dependência de HTTP.
- Simplifiquei os controllers.
- Removi ramificações de not found e conflict.
- Traduzi falhas inesperadas de persistência.
- Criei handler genérico para Exception.
- Não capturei Throwable.
- Separei mensagem pública de mensagem interna.
- Evitei stack trace, SQL, packages e causes no JSON.
- Defini política inicial de logging para 4xx e 5xx.
- Estudei correlação sem antecipar um filtro.
- Testei precedência local e global.
- Testei order entre advices.
- Testei root e cause.
- Testei headers, dados sensíveis e servidor real.
- Não criei ProblemDetail ou contrato definitivo.
- Próxima aula: Problem Details e padrão de erro.
```

---

## Referencia tecnica curta

```text
Advice:
escopo global.

ExceptionHandler:
mapping.

Resolver:
cadeia MVC.

ResponseEntityExceptionHandler:
base MVC.

Local:
prioridade.

Order:
prioridade global.

404:
not found.

409:
conflict.

500:
unexpected.

Temporary:
nao definitivo.
```

Regra final:

```text
o tratamento global deve usar RestControllerAdvice e ExceptionHandler para traduzir exceptions MVC, de aplicacao e de persistencia em respostas HTTP seguras; ResponseEntityExceptionHandler centraliza exceptions do framework, headers fornecidos pelo resolver devem ser preservados, 406 nao deve tentar produzir um body inaceitavel, handlers especificos devem preceder o generico e nenhuma resposta pode expor stack trace, classe, cause, SQL ou mensagens internas, enquanto o contrato definitivo permanece reservado para Problem Details.
```
