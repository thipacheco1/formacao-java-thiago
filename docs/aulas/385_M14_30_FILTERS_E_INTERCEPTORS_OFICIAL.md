# 385 - M14.30 - Filters e interceptors

## Apresentacao da aula

Na aula 384, você estruturou o logging profissional da API.

A aplicação passou a utilizar:

```text
SLF4J;

Logback;

niveis;

event names;

key-values;

MDC;

correlation id;

duracao;

JSON estruturado;

politica de exceptions;

protecao de dados.
```

O ciclo HTTP já possui componentes transversais.

Exemplos atuais:

```text
CorrelationIdFilter;

ApiVersionLifecycleFilter;

GlobalExceptionHandler.
```

O `CorrelationIdFilter` atua na fronteira Servlet.

Ele:

- aceita ou gera correlation id;
- inclui o header na response;
- abre o contexto MDC;
- mede duração;
- registra a conclusão da request;
- limpa o contexto no `finally`.

O `ApiVersionLifecycleFilter` atua nas rotas v1.

Ele:

- adiciona `Deprecation`;
- adiciona `Sunset`;
- adiciona links de migração;
- não altera body;
- não remove a v1.

Esses componentes já utilizam filtros.

Porém, ainda não houve um estudo sistemático da cadeia Servlet e do pipeline MVC.

Também existe uma necessidade de handler.

As operações:

```text
PUT;

PATCH;

DELETE.
```

exigem:

```text
If-Match.
```

Até aqui, cada controller participa da validação do header.

Essa regra é transversal a várias operações e versões da API.

Ao mesmo tempo, ela depende de saber:

```text
qual metodo de controller
foi selecionado.
```

Um servlet filter executa antes de o `DispatcherServlet` escolher o handler.

Ele conhece:

- request;
- response;
- path;
- method;
- headers;
- dispatcher type.

Ele não conhece naturalmente:

- `HandlerMethod`;
- annotations do método;
- controller selecionado;
- metadata do mapping.

Um interceptor MVC executa depois que o Spring encontrou o handler.

Ele pode examinar:

```text
HandlerMethod;

classe do controller;

metodo Java;

annotations.
```

A pergunta central desta aula será:

```text
onde implementar preocupacoes
transversais do ciclo HTTP
e quando escolher filter
ou interceptor?
```

A resposta será construída com três decisões práticas.

Primeira:

```text
registrar filters explicitamente,
com ordem, dispatcher type
e URL patterns conhecidos.
```

Segunda:

```text
criar um gate operacional de escrita
na fronteira Servlet.
```

Terceira:

```text
usar interceptors MVC
para metadata de handler
e preconditions declaradas
por annotation.
```

O novo filter será:

```text
ApiWriteTrafficGateFilter.
```

Ele permitirá suspender temporariamente:

- POST;
- PUT;
- PATCH;
- DELETE.

Quando a escrita estiver desabilitada:

```text
GET:
continua funcionando.

HEAD:
continua funcionando.

OPTIONS:
continua funcionando.

POST, PUT, PATCH, DELETE:
503 Service Unavailable.
```

A response terá:

```text
application/problem+json;

Retry-After;

X-Correlation-Id;

headers de lifecycle v1,
quando a rota for v1.
```

O gate é operacional.

Ele não é autorização.

Ele não substitui Spring Security.

Ele não decide quem pode escrever.

Ele decide se a plataforma está aceitando tráfego de escrita naquele momento.

Esse cenário demonstra:

```text
short-circuit da FilterChain.
```

Quando o gate bloqueia:

```text
chain.doFilter nao e chamado;

DispatcherServlet nao e alcançado;

interceptors nao executam;

controller nao executa.
```

Como a falha ocorre antes do MVC, o `GlobalExceptionHandler` não é responsável por essa response.

Será criado:

```text
ServletProblemDetailWriter.
```

Ele reutilizará o formato público de Problem Details e escreverá diretamente na response Servlet.

A classe não chamará controller ou `HandlerExceptionResolver`.

No MVC, serão criados dois interceptors.

Primeiro:

```text
ApiHandlerContextInterceptor.
```

Ele identifica o `HandlerMethod` e grava atributos seguros no request:

- handler type;
- handler method;
- API version.

O filter de logging poderá ler esses atributos depois da chain e enriquecer o evento de conclusão.

Segundo:

```text
IfMatchRequiredInterceptor.
```

Ele procura:

```text
@RequireIfMatch.
```

A annotation será aplicada às operações versionadas de:

- PUT;
- Merge Patch;
- JSON Patch;
- DELETE.

Quando o header estiver ausente, o interceptor lançará:

```text
MissingIfMatchHeaderException.
```

Como isso ocorre dentro do pipeline MVC:

```text
GlobalExceptionHandler
produz 428 Problem Details.
```

O parser existente continuará responsável pela sintaxe da ETag.

Assim:

```text
interceptor:
presenca.

parser:
formato.

application:
versao esperada.

JPA:
optimistic locking final.
```

Essa separação evita duplicar parsing no interceptor.

A aula também aprofundará:

- `jakarta.servlet.Filter`;
- `FilterChain`;
- `OncePerRequestFilter`;
- `FilterRegistrationBean`;
- ordem;
- URL patterns;
- dispatcher types;
- REQUEST;
- ASYNC;
- ERROR;
- `shouldNotFilter`;
- short-circuit;
- request wrappers;
- response wrappers;
- `HandlerInterceptor`;
- `preHandle`;
- `postHandle`;
- `afterCompletion`;
- include patterns;
- exclude patterns;
- ordem de interceptors;
- handler metadata;
- annotations;
- exceptions;
- testes da cadeia completa.

A próxima aula será:

```text
386 - M14.31 - Eventos internos Spring
```

Portanto, esta aula não adicionará:

- `ApplicationEventPublisher`;
- domain events;
- transactional events;
- `@EventListener`;
- `@TransactionalEventListener`;
- eventos pós-commit;
- listeners assíncronos.

A aula 387 continuará com Async.

O projeto permanece em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
381:
OpenAPI contract first e governanca de contrato.

382:
Versionamento de APIs compatibilidade e depreciacao.

383:
Profiles por ambiente e configuracao segura.

384:
Logging em APIs.

385:
Filters e interceptors.

386:
Eventos internos Spring.

387:
Async no Spring.
```

A aula 384 respondeu:

```text
como produzir logs
uteis, estruturados e seguros?
```

A aula 385 responderá:

```text
como organizar preocupacoes
antes do DispatcherServlet
e ao redor do HandlerMethod?
```

Nesta aula:

```text
Filter:
sim.

OncePerRequestFilter:
sim.

FilterChain:
sim.

FilterRegistrationBean:
sim.

ordem:
sim.

dispatcher types:
sim.

short-circuit:
sim.

Problem Details no filter:
sim.

HandlerInterceptor:
sim.

preHandle:
sim.

postHandle:
sim.

afterCompletion:
sim.

HandlerMethod:
sim.

annotation transversal:
sim.

If-Match presence:
sim.

eventos Spring:
nao.

Async:
nao.

Security:
nao.
```

A regra central será:

```text
use filter quando a preocupacao
pertence a fronteira Servlet;

use interceptor quando a decisao
depende do handler MVC selecionado.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura principal:

```text
src/main/java/br/com/formacao/backend
├── config
│   └── web
│       ├── ApiFilterOrder.java
│       ├── ApiFilterRegistrationConfiguration.java
│       └── ApiWebMvcConfiguration.java
├── shared
│   └── http
│       └── HttpMethodClassification.java
└── web
    ├── annotation
    │   └── RequireIfMatch.java
    ├── filter
    │   ├── CorrelationIdFilter.java
    │   ├── ApiVersionLifecycleFilter.java
    │   └── ApiWriteTrafficGateFilter.java
    ├── interceptor
    │   ├── ApiHandlerContext.java
    │   ├── ApiHandlerContextInterceptor.java
    │   └── IfMatchRequiredInterceptor.java
    ├── problem
    │   └── ServletProblemDetailWriter.java
    └── traffic
        └── ApiWriteTrafficProperties.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
├── application-hml.yaml
└── application-production.yaml
```

Testes:

```text
src/test/java/br/com/formacao/backend/web
├── filter
│   ├── CorrelationFilterRegistrationTest.java
│   ├── ApiLifecycleFilterRegistrationTest.java
│   ├── ApiWriteTrafficGateFilterTest.java
│   ├── ApiFilterOrderTest.java
│   ├── ApiFilterDispatcherTypeTest.java
│   ├── ApiFilterShortCircuitTest.java
│   ├── ApiFilterPathScopeTest.java
│   └── ServletProblemDetailWriterTest.java
├── interceptor
│   ├── ApiHandlerContextInterceptorTest.java
│   ├── IfMatchRequiredInterceptorTest.java
│   ├── InterceptorExecutionOrderTest.java
│   ├── InterceptorIncludeExcludeTest.java
│   ├── InterceptorLifecycleTest.java
│   └── HandlerMethodMetadataTest.java
├── FilterInterceptorInteractionWebMvcTest.java
├── FilterInterceptorArchitectureTest.java
└── FilterInterceptorLiveServerIT.java
```

Documentação:

```text
docs
├── servlet-filter-chain.md
├── once-per-request-filter.md
├── filter-registration-and-order.md
├── servlet-dispatcher-types.md
├── filter-short-circuit.md
├── servlet-problem-details.md
├── request-response-wrappers.md
├── spring-mvc-interceptors.md
├── interceptor-lifecycle.md
├── filters-vs-interceptors.md
├── if-match-interceptor.md
├── cross-cutting-boundaries.md
└── filters-interceptors-baseline.md
```

Scripts:

```text
scripts
├── 169_testar_ordem_dos_filters.ps1
├── 170_suspender_escritas_da_api.ps1
├── 171_testar_gate_de_escrita.ps1
├── 172_testar_if_match_interceptor.ps1
├── 173_testar_contexto_do_handler.ps1
├── 174_testar_short_circuit.ps1
└── 175_executar_testes_filters_interceptors.ps1
```

Resultados esperados:

```text
correlation filter:
primeiro.

lifecycle filter:
segundo.

write gate:
terceiro.

GET com gate fechado:
200.

POST com gate fechado:
503.

controller em 503:
nao executa.

interceptor em 503:
nao executa.

v1 em 503:
headers de lifecycle presentes.

PUT sem If-Match:
428.

PUT com If-Match:
controller executa.

OPTIONS:
nao exige If-Match.

handler metadata:
disponivel no request completion log.

Swagger:
fora do escopo dos filters API.

ERROR dispatcher:
politica explicita.

eventos Spring:
zero.
```

---

## Conceito essencial

### Servlet filter

`Filter` pertence à especificação Servlet.

Ele pode atuar sobre:

```text
request;

response;

ambos.
```

Ele é executado pelo container dentro de uma cadeia.

Não depende de um controller específico.

---

### FilterChain

O filter recebe:

```java
doFilter(
        ServletRequest request,
        ServletResponse response,
        FilterChain chain
)
```

Para continuar:

```java
chain.doFilter(
        request,
        response
);
```

Se não chamar a chain:

```text
o fluxo termina naquele filter.
```

O filter precisa produzir uma response completa quando faz short-circuit.

---

### Ordem de entrada e saida

Três filters:

```text
A;

B;

C.
```

Entrada:

```text
A before;

B before;

C before;

controller.
```

Saída:

```text
C after;

B after;

A after.
```

A cadeia funciona como camadas aninhadas.

Isso explica por que o correlation filter precisa envolver os demais.

---

### OncePerRequestFilter

`OncePerRequestFilter` é uma base Spring para executar uma vez por dispatch da request dentro da política configurada.

Ela oferece:

```java
doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
)
```

Também permite controlar:

- ASYNC dispatch;
- ERROR dispatch;
- exclusão por request.

Não interprete o nome como:

```text
uma vez para sempre
em qualquer dispatcher.
```

A política depende do dispatch e dos métodos de exclusão.

---

### shouldNotFilter

Use:

```java
protected boolean shouldNotFilter(
        HttpServletRequest request
)
```

quando a exclusão depende da request.

Exemplos:

- path fora de `/api`;
- método seguro;
- endpoint técnico;
- health check.

Não espalhe `if` de exclusão no meio do fluxo principal.

---

### DispatcherType.REQUEST

Representa o dispatch inicial da request.

A baseline registra os filters da API para:

```text
REQUEST.
```

A maioria dos fluxos MVC será resolvida nesse dispatch.

---

### DispatcherType.ERROR

Um error dispatch pode ocorrer quando o container despacha para tratamento de erro.

`FilterRegistrationBean` não inclui `ERROR` automaticamente na configuração padrão utilizada pela baseline.

Nesta aula:

```text
correlation, lifecycle e gate:
REQUEST.
```

Os erros tratados pelo `GlobalExceptionHandler` continuam dentro do dispatch inicial.

Não habilite ERROR sem testar duplicidade de headers e logs.

---

### DispatcherType.ASYNC

Em processamento assíncrono, pode ocorrer novo dispatch.

A aula 387 tratará Async.

A baseline não inclui ASYNC nesta aula.

Não marque o filter como async sem compreender:

- thread switch;
- MDC;
- múltiplos dispatches;
- conclusão;
- timeout.

---

### FORWARD e INCLUDE

Esses dispatcher types são comuns em aplicações com encaminhamento e views.

A API REST atual não depende deles.

Eles não serão registrados.

---

### FilterRegistrationBean

O Spring Boot registra `Filter` beans automaticamente.

Quando a aplicação precisa controlar:

- ordem;
- URL patterns;
- dispatcher types;
- nome;
- enabled;
- async support;

use `FilterRegistrationBean`.

Não registre o mesmo filter como `@Component` e como registration bean.

Isso pode causar dupla registration.

---

### Ordem explicita

Crie:

```java
public final class ApiFilterOrder {

    public static final int
            CORRELATION =
                    Ordered.HIGHEST_PRECEDENCE + 50;

    public static final int
            VERSION_LIFECYCLE =
                    Ordered.HIGHEST_PRECEDENCE + 60;

    public static final int
            WRITE_TRAFFIC_GATE =
                    Ordered.HIGHEST_PRECEDENCE + 70;
}
```

Os intervalos deixam espaço para evolução.

Não use números mágicos em cada bean.

---

### Correlation primeiro

O correlation filter precisa executar antes do gate.

Assim, uma response 503 também recebe:

- correlation id;
- logging context;
- duração;
- completion event.

---

### Lifecycle antes do gate

A lifecycle filter v1 adiciona headers antes de prosseguir.

Se o gate bloquear depois:

```text
Deprecation;

Sunset;

Link
```

continuam presentes.

Isso mantém a política da versão também durante indisponibilidade de escrita.

---

### Gate depois

O write gate decide se chama a chain.

Quando fechado:

```text
escreve 503;

nao chama chain.
```

Os filters externos ainda executam sua saída.

---

### Short-circuit

Short-circuit precisa:

- status correto;
- content type;
- body;
- correlation id;
- headers obrigatórios;
- response não comprometida previamente;
- retorno imediato.

Não escreva body e depois chame a chain.

---

### Problem Details fora do MVC

`@ControllerAdvice` pertence ao pipeline MVC.

Um filter executa fora desse pipeline.

Quando o filter decide a response, ele precisa:

- escrever diretamente;
- delegar para um componente Servlet;
- ou encaminhar conscientemente.

A baseline usa:

```text
ServletProblemDetailWriter.
```

---

### ServletProblemDetailWriter

Responsabilidades:

- criar ou receber `ProblemDetail`;
- adicionar extensions públicas;
- setar status;
- setar `application/problem+json`;
- usar Jackson;
- impedir escrita quando response já está committed;
- não expor stack trace.

Ele não substitui o `ApiProblemFactory`.

As duas implementações compartilham convenções públicas.

---

### 503 e Retry-After

O gate devolve:

```text
503 Service Unavailable.
```

Header:

```http
Retry-After: 120
```

O valor é configurado em segundos.

Não use 429.

429 representa limitação de taxa.

503 representa indisponibilidade temporária do serviço.

---

### Metodos de escrita

A baseline classifica como escrita:

```text
POST;

PUT;

PATCH;

DELETE.
```

Classifica como leitura ou descoberta:

```text
GET;

HEAD;

OPTIONS.
```

Método desconhecido não é bloqueado pelo gate.

O pipeline normal decide 405.

---

### Properties do gate

```java
@ConfigurationProperties(
        "app.http.write-traffic"
)
public record ApiWriteTrafficProperties(
        boolean enabled,

        @Positive
        long retryAfterSeconds
) {
}
```

Default seguro:

```text
enabled=true.
```

Production pode desligar externamente.

O gate não lê environment diretamente.

---

### Request wrapper

`HttpServletRequestWrapper` permite alterar ou adaptar a visão da request.

Exemplos legítimos:

- normalizar header conhecido;
- fornecer request especializada;
- controlar leitura de body em mecanismo específico.

A baseline não envolve body.

O body pode ser stream de leitura única.

Caching indiscriminado aumenta memória e risco de dados sensíveis.

---

### Response wrapper

`HttpServletResponseWrapper` permite observar ou adaptar a response.

Exemplos:

- capturar status;
- adicionar comportamento de commit;
- calcular digest;
- adaptar headers.

A baseline não cacheia response body.

O status já pode ser consultado depois da chain.

---

### ContentCaching wrappers

Spring fornece wrappers de caching.

Eles não devem ser ativados apenas para logging.

Riscos:

- consumo de memória;
- duplicação de payload;
- dados sensíveis;
- necessidade de copiar body de volta;
- comportamento em streaming;
- comportamento em async.

Serão estudados em fixture, não em produção.

---

### HandlerInterceptor

`HandlerInterceptor` pertence ao Spring MVC.

Ele participa da cadeia associada ao handler selecionado.

Métodos:

```text
preHandle;

postHandle;

afterCompletion.
```

---

### preHandle

Executa depois que o `HandlerMapping` selecionou o handler e antes de o `HandlerAdapter` invocá-lo.

Retorno:

```text
true:
continua.

false:
interrompe a cadeia MVC.
```

Na baseline, o If-Match interceptor lança uma exception em vez de escrever a response.

O advice converte a exception em 428.

---

### postHandle

Executa depois do handler bem-sucedido e antes da renderização de view.

Em APIs REST com `@ResponseBody` e `ResponseEntity`, ele é menos adequado para alterar o body, pois a response pode já ter sido processada pelo adapter.

A baseline não modifica response body em `postHandle`.

---

### afterCompletion

Executa após a conclusão do processamento MVC quando `preHandle` retornou true.

É útil para:

- cleanup;
- métricas específicas;
- liberação de recurso.

A exception recebida pode ser null quando um resolver tratou o erro.

Não use esse parâmetro como única fonte de status final.

---

### Ordem dos interceptors

Registro:

```text
handler context primeiro;

If-Match depois.
```

Entrada:

```text
context preHandle;

If-Match preHandle;

controller.
```

Saída:

```text
If-Match afterCompletion;

context afterCompletion.
```

A saída ocorre em ordem inversa.

---

### HandlerMethod

Quando:

```java
handler instanceof HandlerMethod
```

é possível consultar:

- bean type;
- method;
- annotations;
- return type;
- parameters.

Quando não for `HandlerMethod`, o interceptor deve prosseguir.

Recursos estáticos e outros handlers não podem causar cast inválido.

---

### ApiHandlerContext

Atributos seguros:

```text
handlerType;

handlerMethod;

apiVersion.
```

Não armazene:

- arguments;
- DTO;
- body;
- model;
- return value.

O filter de logging lê o atributo depois da chain.

---

### @RequireIfMatch

Annotation:

```java
@Target(
        {
            ElementType.METHOD,
            ElementType.TYPE
        }
)
@Retention(
        RetentionPolicy.RUNTIME
)
public @interface RequireIfMatch {
}
```

Na baseline, ela será usada em método.

A annotation não recebe o nome do header.

Esse detalhe é constante da política.

---

### Encontrar annotation

Use:

```text
AnnotatedElementUtils.
```

Isso respeita annotations compostas e hierarquia.

Não procure apenas com reflexão simplista quando a aplicação usa meta-annotations.

---

### Interceptor e Security

Interceptors não serão usados como camada de autorização.

A seleção de paths MVC e os mappings de segurança podem divergir.

Spring Security será adotado em módulo próprio.

`@RequireIfMatch` é uma precondition HTTP, não identidade ou permissão.

---

### Include e exclude patterns

Configure:

```text
include:
/api/v1/runtime/managed-messages/**
/api/v2/runtime/managed-messages/**

exclude:
Swagger;
api docs;
static;
error.
```

O interceptor pode também depender da annotation.

Path e annotation formam defesa em profundidade de escopo.

---

### Filter versus interceptor

Use filter para:

- correlation;
- headers globais;
- CORS na camada apropriada;
- encoding;
- request wrapping;
- response wrapping;
- short-circuit antes do MVC;
- preocupações de container.

Use interceptor para:

- `HandlerMethod`;
- annotations;
- metadata de controller;
- precondition vinculada ao método;
- contexto MVC.

Não use interceptor quando o comportamento precisa abranger recursos fora do MVC.

---

### Filter versus ControllerAdvice

Filter:

```text
antes e depois do DispatcherServlet.
```

ControllerAdvice:

```text
resolução de exceptions MVC.
```

Exception lançada no controller pode chegar ao advice.

Exception não resolvida no filter não chega naturalmente ao mesmo advice.

---

### Filter versus argument resolver

Um interceptor valida uma regra transversal.

Um argument resolver cria um argumento de método.

Se no futuro o expectedVersion virar um tipo injetado diretamente no controller, um resolver poderá ser mais adequado.

Não será criado nesta aula.

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

---

### 2. Remover registrations implicitas

Confirme que os filters não estão anotados simultaneamente com:

```text
@Component;

@WebFilter.
```

Eles serão registrados por configuration.

---

### 3. Criar ApiFilterOrder

Adicione constants.

Crie construtor privado.

Teste ordem crescente.

---

### 4. Criar registration do correlation filter

Use:

```java
FilterRegistrationBean<
        CorrelationIdFilter
>
```

Configure:

- name;
- `/api/*`;
- REQUEST;
- order;
- asyncSupported false.

---

### 5. Registrar lifecycle filter

Mesmo padrão.

O filter continua decidindo internamente se a path é v1.

Ele executa antes do gate.

---

### 6. Criar ApiWriteTrafficProperties

Prefix:

```text
app.http.write-traffic.
```

Valide `retryAfterSeconds`.

Adicione configuração por ambiente.

---

### 7. Criar HttpMethodClassification

Método puro:

```text
isWriteMethod.
```

Use `HttpMethod`.

Não compare strings espalhadas.

---

### 8. Criar ServletProblemDetailWriter

Injete:

- ObjectMapper;
- correlation support;
- clock quando timestamp for necessário.

Escreva formato compatível com o Problem Details atual.

---

### 9. Criar ApiWriteTrafficGateFilter

Estenda:

```text
OncePerRequestFilter.
```

Quando enabled:

```text
chain.
```

Quando disabled e write method:

```text
503;
Retry-After;
Problem Details;
return.
```

---

### 10. Implementar shouldNotFilter

Ignore:

- paths fora de `/api`;
- GET;
- HEAD;
- OPTIONS.

O método principal fica concentrado no gate.

---

### 11. Registrar gate

Order após lifecycle.

URL `/api/*`.

Dispatcher REQUEST.

---

### 12. Atualizar contrato OpenAPI

Antes do runtime, adicione 503 às operações de escrita v1 e v2.

Documente:

- Problem Details;
- Retry-After;
- write traffic temporarily disabled.

Execute lint e diff.

---

### 13. Criar @RequireIfMatch

Package web annotation.

Sem dependência de application.

---

### 14. Anotar operações

V1 e v2:

- PUT;
- Merge Patch;
- JSON Patch;
- DELETE.

Não anote POST.

Não anote GET.

Não anote OPTIONS.

---

### 15. Criar IfMatchRequiredInterceptor

Em `preHandle`:

1. verificar HandlerMethod;
2. encontrar annotation;
3. quando ausente, prosseguir;
4. quando presente, ler If-Match;
5. quando blank, lançar missing exception;
6. retornar true.

Não parseie ETag.

---

### 16. Criar ApiHandlerContext

Defina attribute name.

Record:

```text
handlerType;

handlerMethod;

apiVersion.
```

API version é derivada do mapping/path controlado.

---

### 17. Criar context interceptor

No `preHandle`:

- verificar HandlerMethod;
- criar context;
- setar request attribute;
- retornar true.

`postHandle` vazio.

`afterCompletion` não remove request attribute.

A request será descartada.

---

### 18. Evoluir logging filter

Depois da chain, leia `ApiHandlerContext`.

Inclua:

- handlerType;
- handlerMethod.

Não coloque nomes de arguments.

---

### 19. Criar WebMvcConfigurer

Registre:

1. context interceptor;
2. If-Match interceptor.

Adicione include patterns.

Não inclua Swagger UI.

---

### 20. Testar ordem de filters

Use filters de probe em test configuration.

Confirme:

```text
correlation before;
lifecycle before;
gate before;
gate after;
lifecycle after;
correlation after.
```

Quando gate bloqueia, não existe trecho interno.

---

### 21. Testar dispatcher types

Inspecione registration beans.

Confirme somente REQUEST.

Adicione fixture ERROR e comprove ausência deliberada.

---

### 22. Testar gate aberto

POST alcança controller.

Response normal.

Sem 503.

---

### 23. Testar gate fechado

POST retorna 503.

Confirme:

- Problem Details;
- Retry-After;
- correlation id;
- controller zero invocations;
- interceptor zero invocations.

---

### 24. Testar leitura com gate fechado

GET continua 200.

OPTIONS continua 204.

---

### 25. Testar v1 gate fechado

Confirme:

- Deprecation;
- Sunset;
- successor-version;
- 503.

Isso valida a ordem.

---

### 26. Testar writer

Cenários:

- response livre;
- response committed;
- ObjectMapper failure de fixture;
- correlation id presente;
- timestamp;
- media type.

Quando committed, não tente sobrescrever.

---

### 27. Testar annotation

Confirme presence em todas as operations de update e delete.

Architecture test impede esquecimento em v2.

---

### 28. Testar If-Match ausente

PUT e PATCH retornam 428.

Controller não executa.

O GlobalExceptionHandler produz a response.

---

### 29. Testar If-Match invalido

Header presente passa pelo interceptor.

Parser do controller rejeita.

Resultado:

```text
400 invalid_entity_tag.
```

Isso confirma divisão de responsabilidades.

---

### 30. Testar If-Match valido

Interceptor permite.

Controller, service e repository executam.

---

### 31. Testar HandlerMethod

Confirme metadata para:

- controller v1;
- controller v2;
- collection;
- item;
- OPTIONS.

Handler não MVC prossegue sem cast.

---

### 32. Testar lifecycle do interceptor

Cenários:

- preHandle true;
- controller sucesso;
- controller exception;
- exception resolvida;
- preHandle failure.

Confirme quando `afterCompletion` executa.

---

### 33. Testar postHandle

Registre probe.

Confirme execução em sucesso.

Não altere body REST.

---

### 34. Testar include e exclude

Confirme interceptor em:

```text
/api/v1/runtime/managed-messages;

/api/v2/runtime/managed-messages.
```

Confirme ausência em:

```text
/v3/api-docs;

/swagger-ui;

/error.
```

---

### 35. Testar interactions

Request normal:

```text
filters;
interceptors;
controller;
interceptors reverse;
filters reverse.
```

Request bloqueada:

```text
filters externos;
gate;
filters externos reverse.
```

---

### 36. Testar wrappers em fixture

Crie wrapper de response de laboratório.

Capture status.

Não capture body.

Documente que wrapper não é necessário para o status atual.

---

### 37. Criar ArchitectureTest

Valide:

- filters sem `@Component`;
- registration explícita;
- order constants;
- REQUEST dispatcher;
- zero double registration;
- interceptors somente na web;
- application sem Servlet;
- domain sem MVC;
- persistence sem request;
- If-Match annotation em operations corretas;
- zero Security em interceptor;
- zero body caching em produção;
- zero Spring events;
- zero Async.

---

### 38. Criar LiveServerIT

Use PostgreSQLContainer.

Fluxo:

1. gate aberto;
2. POST v1;
3. GET v2;
4. PUT sem If-Match;
5. PUT válido;
6. gate fechado;
7. PATCH retorna 503;
8. GET continua 200;
9. validar headers;
10. validar logs com handler metadata.

---

### 39. Criar documentacao

`servlet-filter-chain.md` explica a cadeia.

`once-per-request-filter.md` explica dispatch.

`filter-registration-and-order.md` documenta registration.

`servlet-dispatcher-types.md` define REQUEST, ERROR e ASYNC.

`filter-short-circuit.md` documenta 503.

`servlet-problem-details.md` diferencia advice e writer.

`request-response-wrappers.md` registra limites.

`spring-mvc-interceptors.md` explica HandlerMethod.

`interceptor-lifecycle.md` documenta callbacks.

`filters-vs-interceptors.md` cria matriz.

`if-match-interceptor.md` documenta annotation.

`cross-cutting-boundaries.md` registra escolhas.

`filters-interceptors-baseline.md` consolida a aula.

---

### 40. Criar scripts

`169_testar_ordem_dos_filters.ps1` executa probe.

`170_suspender_escritas_da_api.ps1` inicia com gate fechado.

`171_testar_gate_de_escrita.ps1` compara GET e POST.

`172_testar_if_match_interceptor.ps1` testa 428 e 400.

`173_testar_contexto_do_handler.ps1` valida logs.

`174_testar_short_circuit.ps1` confirma controller não executado.

`175_executar_testes_filters_interceptors.ps1` executa a suite.

---

### 41. Executar testes de filter

```powershell
.\mvnw.cmd `
  -Dtest=CorrelationFilterRegistrationTest,ApiLifecycleFilterRegistrationTest,ApiWriteTrafficGateFilterTest,ApiFilterOrderTest test
```

---

### 42. Executar dispatcher e short-circuit

```powershell
.\mvnw.cmd `
  -Dtest=ApiFilterDispatcherTypeTest,ApiFilterShortCircuitTest,ApiFilterPathScopeTest,ServletProblemDetailWriterTest test
```

---

### 43. Executar interceptor tests

```powershell
.\mvnw.cmd `
  -Dtest=ApiHandlerContextInterceptorTest,IfMatchRequiredInterceptorTest,InterceptorExecutionOrderTest,InterceptorIncludeExcludeTest,InterceptorLifecycleTest,HandlerMethodMetadataTest test
```

---

### 44. Executar interaction e arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=FilterInterceptorInteractionWebMvcTest,FilterInterceptorArchitectureTest test
```

---

### 45. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=FilterInterceptorLiveServerIT test
```

Docker precisa estar ativo.

---

### 46. Executar governanca OpenAPI

```powershell
.\scripts\147_executar_governanca_openapi.ps1
```

A response 503 precisa estar documentada.

---

### 47. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 48. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 49. Revisar escopo

Confirme:

```text
filter order:
explicita.

short-circuit:
presente.

interceptor:
presente.

If-Match:
annotation.

Security:
zero.

eventos Spring:
zero.

Async:
zero.

body caching:
zero.
```

---

### 50. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- probe output;
- logs;
- payload;
- body cache;
- secret;
- event publisher;
- executor async;
- Security.

---

## Entendendo o que foi feito

### A cadeia Servlet ficou explicita

Filters possuem ordem, patterns e dispatcher type conhecidos.

### O gate demonstrou short-circuit real

Uma response 503 nasce antes do MVC sem alcançar controller.

### O interceptor ganhou metadata de handler

A aplicação consegue agir com base no método selecionado.

### If-Match saiu da repeticao

A presença do header virou uma precondition declarativa por annotation.

### As fronteiras ficaram claras

Filter, interceptor e advice possuem responsabilidades diferentes.

---

## Erros comuns importantes

### Registrar filter duas vezes

`@Component` mais `FilterRegistrationBean` pode duplicar execução.

### Lançar exception no filter esperando ControllerAdvice

O filter está fora do pipeline MVC.

### Usar interceptor para autorização

Path matching e segurança podem divergir.

### Cachear body para qualquer log

Memória e dados sensíveis aumentam sem necessidade.

### Habilitar ASYNC ou ERROR sem testes

O mesmo filter pode executar em dispatches adicionais.

---

## Comandos uteis

### Testar ordem

```powershell
.\scripts\169_testar_ordem_dos_filters.ps1
```

### Gate fechado

```powershell
.\scripts\170_suspender_escritas_da_api.ps1
```

### Testar 503

```powershell
.\scripts\171_testar_gate_de_escrita.ps1
```

### Testar If-Match

```powershell
.\scripts\172_testar_if_match_interceptor.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Ordem errada

Coloque o gate antes do correlation filter.

Execute 503.

Observe ausência de contexto.

Restaure.

### Parte 2 — Chain depois do body

Chame `chain.doFilter` depois do short-circuit em fixture.

Observe tentativa de dupla response.

Restaure.

### Parte 3 — ERROR dispatcher

Inclua ERROR em fixture.

Provoque erro.

Observe execução adicional.

Documente antes de remover.

### Parte 4 — Interceptor false

Crie interceptor de fixture que retorna false.

Confirme que o handler não executa.

Não mantenha response vazia.

### Parte 5 — Annotation ausente

Remova `@RequireIfMatch` de uma operation v2.

Faça o architecture test falhar.

Restaure.

### Parte 6 — Handler nao MVC

Execute static resource fixture.

Confirme que o interceptor prossegue.

### Parte 7 — Response wrapper

Capture somente status.

Compare com `response.getStatus()`.

Remova wrapper desnecessário.

### Parte 8 — ADR

Registre:

```text
correlation primeiro;

lifecycle segundo;

write gate terceiro;

REQUEST dispatcher;

filter para fronteira Servlet;

interceptor para HandlerMethod;

503 escrita suspensa;

Problem Details writer no filter;

@RequireIfMatch no MVC;

sem body cache;

eventos na aula 386;

Async na aula 387.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 384 foi preservada;
- o mesmo projeto foi continuado;
- Servlet Filter foi definido;
- FilterChain foi definida;
- ordem de entrada e saída foi explicada;
- `chain.doFilter` foi usado no fluxo permitido;
- short-circuit não chama a chain;
- short-circuit produz response completa;
- `OncePerRequestFilter` foi usado;
- uma execução por dispatch foi explicada;
- REQUEST, ERROR, ASYNC, FORWARD e INCLUDE foram diferenciados;
- baseline registra REQUEST;
- ERROR não foi habilitado sem teste;
- ASYNC não foi antecipado;
- `shouldNotFilter` foi usado;
- exclusions não ficaram espalhadas;
- FilterRegistrationBean foi usado;
- filters não possuem double registration;
- filters não ficaram simultaneamente como Component;
- URL pattern `/api/*` foi configurado;
- order constants foram criados;
- correlation filter executa primeiro;
- lifecycle filter executa segundo;
- gate executa terceiro;
- gaps de order foram mantidos;
- correlation id existe em 503;
- lifecycle headers existem no 503 v1;
- gate de escrita foi criado;
- gate é operacional;
- gate não foi tratado como Security;
- GET continua permitido;
- HEAD continua permitido;
- OPTIONS continua permitido;
- POST pode ser suspenso;
- PUT pode ser suspenso;
- PATCH pode ser suspenso;
- DELETE pode ser suspenso;
- método desconhecido segue para o pipeline;
- 503 foi usado;
- 429 não foi usado;
- Retry-After foi criado;
- properties do gate foram externalizadas;
- retryAfterSeconds foi validado;
- gate não consulta environment diretamente;
- ServletProblemDetailWriter foi criado;
- filter não depende do ControllerAdvice;
- Problem Details do filter é compatível;
- response committed foi tratada;
- stack trace não foi exposta;
- contrato OpenAPI recebeu 503;
- diff de contrato foi executado;
- request wrapper foi explicado;
- response wrapper foi explicado;
- body caching não foi adicionado em produção;
- ContentCaching wrappers foram estudados em fixture;
- riscos de memória foram documentados;
- riscos de dados sensíveis foram documentados;
- HandlerInterceptor foi definido;
- `preHandle` foi implementado;
- `postHandle` foi testado;
- `afterCompletion` foi testado;
- ordem inversa de saída foi explicada;
- `afterCompletion` depende de preHandle true;
- exception resolvida pode não aparecer no parâmetro ex;
- REST body não foi alterado em postHandle;
- HandlerMethod foi verificado com instanceof;
- handlers não MVC não provocam cast;
- ApiHandlerContext foi criado;
- context contém somente metadata segura;
- request arguments não foram armazenados;
- body não foi armazenado;
- return value não foi armazenado;
- completion log recebeu handler type;
- completion log recebeu handler method;
- `@RequireIfMatch` foi criada;
- annotation possui runtime retention;
- annotation foi aplicada em PUT;
- annotation foi aplicada em Merge Patch;
- annotation foi aplicada em JSON Patch;
- annotation foi aplicada em DELETE;
- POST não exige If-Match;
- GET não exige If-Match;
- OPTIONS não exige If-Match;
- IfMatchRequiredInterceptor foi criado;
- AnnotatedElementUtils foi usado;
- interceptor valida presença;
- parser continua validando formato;
- application continua comparando version;
- JPA continua protegendo corrida;
- header ausente retorna 428;
- header inválido continua 400;
- header stale continua 412;
- controller não executa quando falta header;
- interceptor não foi usado para autorização;
- include patterns foram definidos;
- exclude patterns foram definidos;
- Swagger UI não foi interceptada;
- api docs não foram interceptadas;
- error path não foi interceptado;
- WebMvcConfigurer foi criado;
- context interceptor executa antes do If-Match interceptor;
- interactions entre filters e interceptors foram testadas;
- request normal percorre toda a cadeia;
- request bloqueada não percorre interceptors;
- controller não executa em 503;
- CorrelationFilterRegistrationTest foi criado;
- ApiLifecycleFilterRegistrationTest foi criado;
- ApiWriteTrafficGateFilterTest foi criado;
- ApiFilterOrderTest foi criado;
- ApiFilterDispatcherTypeTest foi criado;
- ApiFilterShortCircuitTest foi criado;
- ApiFilterPathScopeTest foi criado;
- ServletProblemDetailWriterTest foi criado;
- ApiHandlerContextInterceptorTest foi criado;
- IfMatchRequiredInterceptorTest foi criado;
- InterceptorExecutionOrderTest foi criado;
- InterceptorIncludeExcludeTest foi criado;
- InterceptorLifecycleTest foi criado;
- HandlerMethodMetadataTest foi criado;
- FilterInterceptorInteractionWebMvcTest foi criado;
- FilterInterceptorArchitectureTest foi criado;
- application não conhece Servlet;
- domain não conhece MVC;
- persistence não conhece request;
- nenhum body logger foi criado;
- FilterInterceptorLiveServerIT foi criado;
- PostgreSQL real foi preservado;
- OpenAPI governance foi reexecutada;
- documentação completa foi criada;
- scripts 169 a 175 foram criados;
- testes de filters, dispatchers, interceptors, interaction, arquitetura, live, governança, suite e package passaram;
- nenhum evento Spring, listener, Async, executor, Security ou body caching foi antecipado;
- ponte para a aula 386 está correta;
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
git commit -m "feat(m14): organizar filters e interceptors da api"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- probes;
- body cache;
- payload;
- secret;
- evento Spring;
- executor;
- Security.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você organizou as preocupações transversais do ciclo HTTP.

O fluxo consolidado ficou:

```text
container;

correlation filter;

lifecycle filter;

write traffic gate;

DispatcherServlet;

handler mapping;

handler context interceptor;

If-Match interceptor;

controller;

interceptors em ordem inversa;

filters em ordem inversa.
```

Você comprovou:

```text
ordem explicita;

dispatcher type conhecido;

short-circuit com 503;

Problem Details fora do MVC;

GET durante bloqueio;

headers de lifecycle;

HandlerMethod metadata;

If-Match declarativo;

428 antes do controller;

logging enriquecido;

sem duplicar responsabilidade.
```

A decisão central foi:

```text
filter protege e adapta
a fronteira Servlet;

interceptor atua depois
que o Spring MVC conhece o handler;

ControllerAdvice resolve
exceptions do pipeline MVC;

cada mecanismo deve permanecer
na sua fronteira.
```

A próxima aula será:

```text
386 - M14.31 - Eventos internos Spring
```

Nela, você continuará no mesmo projeto e estudará:

- eventos internos;
- `ApplicationEventPublisher`;
- eventos imutáveis;
- producer;
- listener;
- `@EventListener`;
- múltiplos listeners;
- ordem;
- sincronismo;
- propagação de exception;
- eventos de domínio;
- eventos de aplicação;
- boundaries;
- payload mínimo;
- coupling;
- transaction;
- `@TransactionalEventListener`;
- BEFORE_COMMIT;
- AFTER_COMMIT;
- AFTER_ROLLBACK;
- AFTER_COMPLETION;
- fallbackExecution;
- testes;
- idempotência;
- observabilidade;
- limites antes de mensageria externa.

A aula 385 respondeu:

```text
quando usar filter
e quando usar interceptor?
```

A aula 386 responderá:

```text
como desacoplar reacoes internas
a uma operacao da aplicacao
sem transformar chamadas diretas
em dependencias ocultas?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei explicar a ordem de entrada e saída da FilterChain.
- [ ] Sei registrar filters com order, patterns e dispatcher types explícitos.
- [ ] Sei fazer short-circuit com uma response completa.
- [ ] Sei usar HandlerInterceptor quando preciso de HandlerMethod.
- [ ] Sei separar filter, interceptor, advice e controller.

---

## Troubleshooting adicional

### Filter executa duas vezes

Procure double registration ou dispatcher adicional.

### 503 nao recebe correlation id

O gate está antes do correlation filter.

### ControllerAdvice nao captura erro do filter

Use o ServletProblemDetailWriter na fronteira Servlet.

### If-Match ausente chega ao controller

Confirme annotation, include pattern e registration do interceptor.

### Handler metadata nao aparece no log

Confirme request attribute e leitura depois da chain.

### Swagger recebe interceptor

Revise include e exclude patterns.

---

## Perguntas de revisao

1. O que é um Filter?
2. O que a FilterChain faz?
3. O que acontece se a chain não for chamada?
4. Para que serve OncePerRequestFilter?
5. Qual dispatcher foi usado?
6. Qual filter executa primeiro?
7. Qual filter pode produzir 503?
8. Por que o advice não resolve o gate?
9. O que o writer produz?
10. O que é HandlerInterceptor?
11. Quando preHandle executa?
12. O que false significa?
13. Quando afterCompletion executa?
14. O que é HandlerMethod?
15. Qual annotation foi criada?
16. Quem valida a sintaxe da ETag?
17. Interceptor implementa autorização?
18. Body caching foi ativado?
19. Eventos Spring foram criados?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Componente da fronteira Servlet.
2. Invoca o próximo elemento.
3. O fluxo é encerrado.
4. Controlar execução por dispatch.
5. REQUEST.
6. CorrelationIdFilter.
7. ApiWriteTrafficGateFilter.
8. O filter executa fora do MVC.
9. Problem Details diretamente na response.
10. Componente da cadeia MVC.
11. Após seleção do handler.
12. Interromper a cadeia MVC.
13. Se preHandle concluiu com true.
14. Metadata do método de controller.
15. `@RequireIfMatch`.
16. O parser existente.
17. Não.
18. Não.
19. Não.
20. Eventos internos Spring.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 385 - M14.30 - Filters e interceptors

- Continuei no projeto `formacao-java-backend-api`.
- Estudei a cadeia de servlet filters.
- Entendi a ordem de entrada e saída da FilterChain.
- Aprofundei `OncePerRequestFilter`.
- Diferenciei REQUEST, ERROR, ASYNC, FORWARD e INCLUDE.
- Registrei filters com `FilterRegistrationBean`.
- Criei uma ordem explícita para os filters.
- Mantive o correlation filter como primeiro.
- Mantive o lifecycle filter da v1 como segundo.
- Criei o `ApiWriteTrafficGateFilter` como terceiro.
- Implementei short-circuit para suspender escritas.
- Mantive GET, HEAD e OPTIONS disponíveis.
- Retornei 503 com `Retry-After`.
- Criei Problem Details diretamente na fronteira Servlet.
- Entendi por que `ControllerAdvice` não resolve exceptions do filter.
- Mantive correlation e lifecycle headers nas responses bloqueadas.
- Estudei request e response wrappers.
- Não ativei body caching em produção.
- Estudei `HandlerInterceptor`.
- Entendi `preHandle`, `postHandle` e `afterCompletion`.
- Criei contexto seguro de `HandlerMethod`.
- Enriquecei o completion log com controller e método.
- Criei `@RequireIfMatch`.
- Criei `IfMatchRequiredInterceptor`.
- Passei a exigir If-Match antes do controller.
- Mantive parsing da ETag no parser existente.
- Mantive comparação de versão na aplicação e locking no JPA.
- Não usei interceptor para autorização.
- Configurei include e exclude patterns.
- Testei ordem, short-circuit, dispatcher, lifecycle e interactions.
- Reexecutei a governança OpenAPI para o novo 503.
- Não criei eventos internos ou Async.
- Próxima aula: Eventos internos Spring.
```

---

## Referencia tecnica curta

```text
Filter:
fronteira.

Chain:
continuidade.

Order:
sequencia.

Dispatcher:
fase.

Short-circuit:
interrupcao.

Writer:
response.

Interceptor:
handler.

preHandle:
antes.

afterCompletion:
limpeza.

Annotation:
politica.
```

Regra final:

```text
filters devem ser usados para preocupacoes da fronteira Servlet e registrados com order, URL patterns e dispatcher types explicitos; um filter que encerra a chain precisa produzir status, headers e body completos sem depender do ControllerAdvice, enquanto interceptors devem ser usados quando a regra depende do HandlerMethod ou de annotations MVC; o pipeline deve preservar correlation, logging e lifecycle em todos os resultados, evitar double registration, body caching e autorizacao em interceptors, e manter parsing, regra de negocio e persistencia fora das camadas transversais.
```
