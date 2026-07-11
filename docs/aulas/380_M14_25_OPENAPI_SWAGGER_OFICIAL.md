# 380 - M14.25 - OpenAPI Swagger

## Apresentacao da aula

Na aula 379, você concluiu a construção funcional da API de `managed runtime messages`.

O projeto já possui:

```text
CRUD completo;

PUT;

JSON Merge Patch;

JSON Patch;

If-Match;

ETag;

optimistic locking;

paginacao;

ordenacao multipla;

filtros dinamicos;

Specifications;

Problem Details;

PostgreSQL;

testes de integracao.
```

Os consumidores conseguem utilizar a API quando conhecem previamente:

- os endpoints;
- os métodos HTTP;
- os parâmetros;
- os media types;
- os headers;
- os schemas;
- os status;
- os códigos de erro;
- a semântica de paginação;
- a semântica de filtros;
- as preconditions;
- as diferenças entre PUT e PATCH.

Entretanto, esse conhecimento ainda está distribuído em:

- código;
- testes;
- documentação Markdown;
- scripts;
- decisões das aulas anteriores.

A pergunta central desta aula será:

```text
como transformar os contratos
da API em documentacao OpenAPI
navegavel e verificavel?
```

A solução utilizará:

```text
OpenAPI;

springdoc-openapi;

Swagger UI;

swagger annotations.
```

Esses nomes não significam a mesma coisa.

```text
OpenAPI:
especificacao para descrever APIs HTTP.

Swagger UI:
ferramenta que renderiza uma descricao OpenAPI
e permite explorar operacoes.

springdoc-openapi:
biblioteca que inspeciona a aplicacao Spring
e gera a descricao OpenAPI.
```

O projeto continuará code-first nesta aula.

Isso significa:

```text
controllers, DTOs, annotations
e configuracao da aplicacao
alimentam a descricao gerada.
```

A próxima aula será dedicada a:

```text
381 - M14.26 - OpenAPI contract first e governanca de contrato
```

Nela, você estudará um contrato versionado como artefato principal, validação de breaking changes, lint, diff e geração.

Por isso, esta aula não antecipará:

- arquivo OpenAPI como fonte principal;
- geração de interfaces a partir de YAML;
- geração automática de clients;
- OpenAPI Generator;
- lint corporativo;
- Spectral;
- breaking change gate;
- contract diff obrigatório;
- aprovação de contrato;
- versionamento formal da descrição.

A baseline utilizará:

```text
Spring Boot:
4.1.0.

springdoc-openapi:
3.0.3.

OpenAPI gerada:
3.1.

Swagger UI:
fornecida pelo starter.
```

O springdoc 3.x é a linha compatível com Spring Boot 4.x.

A versão será declarada explicitamente porque não pertence ao dependency management padrão do Spring Boot utilizado pelo projeto.

Dependency:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>${springdoc.version}</version>
</dependency>
```

Property:

```xml
<springdoc.version>3.0.3</springdoc.version>
```

Endpoints esperados:

```text
JSON:
GET /v3/api-docs.

YAML:
GET /v3/api-docs.yaml.

Swagger UI:
GET /swagger-ui.html.
```

A documentação da feature será agrupada:

```text
group:
managed-runtime-messages.

group JSON:
GET /v3/api-docs/managed-runtime-messages.
```

A descrição utilizará OpenAPI 3.1.

A OpenAPI Initiative já publicou uma linha 3.2, mas a baseline desta formação continuará explicitamente em 3.1 porque essa é a versão configurada e suportada pelo fluxo springdoc adotado nesta aula.

O objetivo não é produzir uma página bonita que diverge do sistema.

O objetivo é produzir um contrato navegável que represente:

```text
request real;

response real;

headers reais;

media types reais;

erros reais;

validacoes reais.
```

A documentação cobrirá:

- metadata global;
- servers;
- tags;
- operation ids;
- descriptions;
- parâmetros de path;
- query parameters;
- headers condicionais;
- request bodies;
- response bodies;
- headers de resposta;
- schemas;
- exemplos;
- Problem Details;
- pagination;
- multiple sorting;
- dynamic filters;
- PUT;
- Merge Patch;
- JSON Patch;
- OPTIONS;
- ETag;
- `If-Match`;
- `If-None-Match`;
- `Accept-Patch`;
- 304;
- 400;
- 404;
- 405;
- 406;
- 409;
- 412;
- 415;
- 422;
- 428;
- 500.

A API não terá Security nesta aula.

Portanto, a descrição não inventará:

- Bearer token;
- OAuth2;
- API key;
- scopes;
- roles;
- authorization requirements.

Uma documentação falsa é pior do que uma documentação incompleta.

A exposição também será controlada.

Profile de laboratório:

```text
openapi-lab.
```

Nesse profile:

```text
api docs:
habilitada.

Swagger UI:
habilitada.

Try it out:
habilitado para laboratorio local.
```

Em um profile de produção sem proteção adequada:

```text
api docs:
desabilitada ou publicada por rota controlada.

Swagger UI:
desabilitada.
```

A aula não adicionará Spring Security apenas para proteger Swagger UI.

Essa integração virá quando Security fizer parte do cronograma.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
376:
CRUD completo parte 2.

377:
PUT vs PATCH.

378:
Paginacao e ordenacao em API.

379:
Filtros dinamicos e Specifications.

380:
OpenAPI Swagger.

381:
OpenAPI contract first e governanca de contrato.

382:
Versionamento de APIs compatibilidade e depreciacao.
```

A aula 379 respondeu:

```text
como compor filtros opcionais
sem explodir o repository?
```

A aula 380 responderá:

```text
como descrever a superficie HTTP
de forma navegavel,
interativa e verificavel?
```

Nesta aula:

```text
OpenAPI:
sim.

OpenAPI 3.1:
sim.

springdoc:
sim.

Swagger UI:
sim.

code first:
sim.

metadata:
sim.

operations:
sim.

parameters:
sim.

schemas:
sim.

examples:
sim.

headers:
sim.

Problem Details:
sim.

PATCH media types:
sim.

testes do documento:
sim.

exposicao controlada:
sim.

contract first:
nao.

governanca:
nao.

Security:
nao.
```

A regra central será:

```text
a documentacao deve nascer
dos contratos reais da camada web
e ser testada como qualquer outro
artefato executavel da API.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura nova:

```text
src/main/java/br/com/formacao/backend
├── config
│   └── openapi
│       ├── ManagedRuntimeMessagesOpenApiConfiguration.java
│       ├── OpenApiMetadataConfiguration.java
│       └── OpenApiProfiles.java
└── web
    ├── controller
    │   └── ManagedRuntimeMessageController.java
    └── openapi
        ├── OpenApiHeaders.java
        ├── OpenApiMediaTypes.java
        ├── OpenApiProblemResponses.java
        └── model
            ├── ApiProblemDocumentation.java
            ├── ApiViolationDocumentation.java
            ├── ManagedRuntimeMessageMergePatchDocumentation.java
            └── ManagedRuntimeMessageSortOrderDocumentation.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-openapi-lab.yaml
└── application-production.yaml
```

Testes:

```text
src/test/java/br/com/formacao/backend/openapi
├── OpenApiEndpointSmokeTest.java
├── OpenApiMetadataTest.java
├── OpenApiManagedMessageOperationsTest.java
├── OpenApiRequestSchemaTest.java
├── OpenApiResponseSchemaTest.java
├── OpenApiProblemDetailsTest.java
├── OpenApiHeadersTest.java
├── OpenApiPaginationFilterTest.java
├── OpenApiPatchMediaTypesTest.java
├── OpenApiExamplesTest.java
├── OpenApiRuntimeCompatibilityTest.java
├── OpenApiExposureConfigurationTest.java
├── OpenApiArchitectureTest.java
└── OpenApiLiveServerIT.java
```

Documentação:

```text
docs
├── openapi-vs-swagger.md
├── springdoc-openapi-setup.md
├── openapi-global-metadata.md
├── openapi-operation-documentation.md
├── openapi-schema-documentation.md
├── openapi-problem-details.md
├── openapi-pagination-filters.md
├── openapi-patch-contracts.md
├── swagger-ui-exposure.md
├── openapi-document-tests.md
└── openapi-code-first-baseline.md
```

Scripts:

```text
scripts
├── 135_iniciar_swagger_ui.ps1
├── 136_exportar_openapi_json.ps1
├── 137_exportar_openapi_yaml.ps1
├── 138_validar_openapi_endpoints.ps1
├── 139_testar_swagger_ui.ps1
└── 140_executar_testes_openapi.ps1
```

Resultados esperados:

```text
/v3/api-docs:
200 application/json.

/v3/api-docs.yaml:
200 YAML.

/swagger-ui.html:
redirect ou pagina da UI.

openapi:
3.1.x.

info.title:
Formacao Java Backend API.

info.version:
v1.

tag:
Managed Runtime Messages.

operationIds:
unicos.

schemas:
requests e responses.

ProblemDetail:
documentado com extensions.

PATCH:
dois media types.

headers:
Location, ETag, Last-Modified,
X-Correlation-Id, Link,
X-Total-Count, X-Total-Pages,
Accept-Patch e Allow.

profile production:
UI desabilitada.

Security schemes:
zero.
```

---

## Conceito essencial

### OpenAPI

OpenAPI é uma especificação independente de linguagem para descrever APIs HTTP.

Uma descrição pode ser serializada em:

```text
JSON;

YAML.
```

Ela descreve:

- metadata;
- servers;
- paths;
- operations;
- parameters;
- request bodies;
- responses;
- callbacks;
- webhooks;
- components;
- security.

A API atual utilizará paths, operations, components e responses.

---

### Swagger

Swagger é um ecossistema de ferramentas criado ao redor da especificação que deu origem ao OpenAPI.

Nesta aula, a ferramenta visível será:

```text
Swagger UI.
```

Não chame o arquivo OpenAPI de “arquivo do Swagger” como se fossem sinônimos absolutos.

---

### Swagger UI

Swagger UI lê uma descrição OpenAPI e a transforma em uma interface navegável.

Ela permite:

- abrir tags;
- visualizar operations;
- observar schemas;
- examinar examples;
- preencher parameters;
- enviar requests com Try it out;
- visualizar responses.

Ela não cria a semântica da API.

Se a descrição estiver errada, a UI exibirá o erro com aparência profissional.

---

### springdoc-openapi

springdoc inspeciona:

- mappings Spring MVC;
- method signatures;
- Bean Validation;
- Jackson models;
- Swagger annotations;
- ControllerAdvice;
- tipos de request e response.

Depois, produz um objeto OpenAPI.

Inferência automática é um ponto de partida.

Ela não conhece todas as decisões de negócio.

Exemplos que precisam de documentação explícita:

- If-Match obrigatório;
- ETag `"vN"`;
- 428;
- 412;
- JSON Merge Patch;
- JSON Patch;
- filtros;
- sorts repetidos;
- tie-breaker implícito;
- Problem Detail extensions;
- 406 sem body.

---

### Code first

No fluxo code-first:

```text
codigo executavel
    -> descricao OpenAPI.
```

Vantagens:

- integração rápida;
- schemas inferidos dos DTOs;
- Bean Validation reaproveitada;
- menor duplicação inicial;
- documentação próxima do controller.

Riscos:

- documentação incompleta;
- annotation excessiva;
- alteração acidental do contrato;
- divergência de examples;
- resposta global não inferida corretamente;
- falta de governança.

A aula 381 tratará esses riscos de forma estrutural.

---

### OpenAPI 3.1

Configure:

```yaml
springdoc:
  api-docs:
    version: OPENAPI_3_1
```

OpenAPI 3.1 aproxima o Schema Object do JSON Schema 2020-12.

A aula usará recursos comuns e interoperáveis.

Não dependerá de construções exóticas apenas porque a versão permite.

---

### Dependency compatibility

Property Maven:

```xml
<springdoc.version>3.0.3</springdoc.version>
```

Dependency:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>${springdoc.version}</version>
</dependency>
```

springdoc 3.x é a linha para Spring Boot 4.x.

Não use a linha 2.x neste projeto.

Não adicione Springfox.

---

### Documento JSON

Endpoint padrão:

```text
/v3/api-docs.
```

Esse JSON é o artefato principal gerado.

Swagger UI é uma visualização dele.

Os testes devem validar o documento, não somente abrir a interface.

---

### Documento YAML

Endpoint:

```text
/v3/api-docs.yaml.
```

YAML é útil para:

- revisão humana;
- export;
- diff;
- pipeline;
- ferramentas externas.

Nesta aula, ele será exportado para `target`, não versionado como fonte oficial.

---

### Metadata global

O documento precisa de:

```text
title;

description;

version;

contact;

license quando aplicavel.
```

Não invente dados legais.

A baseline utilizará:

```text
title:
Formacao Java Backend API.

version:
v1.

description:
API didatica do modulo M14.
```

Contato e licença serão omitidos quando não houver informação oficial.

---

### OpenAPI bean

Crie:

```java
@Bean
OpenAPI formacaoJavaBackendOpenApi() {
}
```

Configure:

- `Info`;
- servers relativos ou de ambiente;
- external docs somente se existirem;
- tags globais.

Evite host de produção hardcoded.

Use servidor relativo:

```text
/.
```

---

### @OpenAPIDefinition

A metadata também pode ser declarada por annotation.

A aula preferirá um bean `OpenAPI` para composição testável.

`@OpenAPIDefinition` será estudada e poderá ser usada em fixture.

Não misture duas fontes definindo os mesmos campos sem uma regra clara.

---

### GroupedOpenApi

Crie:

```java
@Bean
GroupedOpenApi managedRuntimeMessagesOpenApi() {
    return GroupedOpenApi
            .builder()
            .group(
                    "managed-runtime-messages"
            )
            .pathsToMatch(
                    "/api/v1/runtime/managed-messages/**"
            )
            .build();
}
```

Resultado:

```text
/v3/api-docs/managed-runtime-messages.
```

O grupo permite separar grandes superfícies sem criar outra aplicação.

---

### Tag

Use:

```java
@Tag(
        name = "Managed Runtime Messages",
        description =
                "CRUD, consultas, filtros e patches de mensagens gerenciadas"
)
```

Tag organiza operations.

Não use uma tag diferente por método.

---

### @Operation

Cada endpoint recebe:

- `operationId`;
- `summary`;
- `description`;
- `tags`.

Exemplo:

```java
@Operation(
        operationId =
                "createManagedRuntimeMessage",
        summary =
                "Cria uma mensagem gerenciada"
)
```

Operation ids precisam ser únicos e estáveis.

Eles podem ser usados por geradores de client.

---

### Description

Summary deve ser curto.

Description pode explicar:

- preconditions;
- idempotência;
- semântica de null;
- paginação;
- filtros;
- ordenação;
- PATCH;
- erros.

Não copie toda a aula para a annotation.

Mantenha detalhes longos na documentação complementar.

---

### @Parameter

Use para documentar:

- path id;
- page;
- size;
- sort;
- filters;
- If-Match;
- If-None-Match;
- Accept-Language;
- X-Correlation-Id quando aceito.

Exemplo de If-Match:

```java
@Parameter(
        name = "If-Match",
        description =
                "ETag forte recebida no GET anterior",
        required = true,
        example = "\"v3\""
)
```

---

### Parameter array

`sort` é repetível.

Documente como array com:

```text
style:
form.

explode:
true.
```

Example:

```text
updatedAt,desc.
```

A descrição informa que a prioridade segue a ordem de repetição.

---

### Request body

Use:

```java
@io.swagger.v3.oas.annotations.parameters.RequestBody
```

Esse tipo possui o mesmo nome de um conceito Spring.

Use import explícito ou nome fully qualified quando necessário.

Documente:

- required;
- description;
- content;
- schema;
- examples.

---

### @Schema

DTOs podem receber:

- name;
- description;
- example;
- accessMode;
- requiredMode;
- nullable;
- allowableValues;
- format;
- minLength;
- maxLength.

Bean Validation continuará sendo a fonte executável dos limites.

`@Schema` complementa significado e exemplos.

---

### @ArraySchema

Use para arrays, como:

```text
content;

orders;

violations;

JSON Patch operations.
```

Não aplique `@Schema` e `@ArraySchema` ao mesmo elemento de forma conflitante.

---

### Examples

Examples precisam ser:

- válidos;
- pequenos;
- coerentes;
- sem secrets;
- sem ids reais;
- compatíveis com o schema.

Crie exemplos para:

- create;
- PUT;
- Merge Patch;
- JSON Patch;
- page response;
- Problem Detail;
- 409;
- 412;
- 422.

Não documente timestamp dinâmico como valor fixo obrigatório.

---

### Responses

Use:

```java
@ApiResponse(
        responseCode = "201",
        description = "Mensagem criada"
)
```

Cada operation precisa documentar respostas realmente possíveis.

Não copie todos os status para todas as operations.

Exemplo:

```text
GET collection:
200, 400, 406, 500.

DELETE:
204, 400, 404, 412, 428, 500.
```

---

### No content

Respostas:

```text
204;

304;

406 nesta baseline.
```

não possuem body de sucesso.

Não declare schema JSON nessas respostas.

---

### Response headers

Documente:

- `Location`;
- `ETag`;
- `Last-Modified`;
- `Cache-Control`;
- `X-Correlation-Id`;
- `X-Total-Count`;
- `X-Total-Pages`;
- `Link`;
- `Allow`;
- `Accept-Patch`.

Use schema e example adequados.

---

### Problem Details

O runtime retorna:

```text
ProblemDetail.
```

Com extensions:

```text
code;

timestamp;

correlationId;

violations.
```

A inferência padrão não conhece todas essas extensions.

Crie um modelo somente de documentação:

```text
ApiProblemDocumentation.
```

Ele descreve o JSON real.

Esse tipo não será retornado pelo controller.

---

### Documentation-only model

O modelo terá:

- type URI;
- title;
- status;
- detail;
- instance URI;
- code;
- timestamp;
- correlationId;
- violations.

Marque claramente:

```text
uso exclusivo para OpenAPI.
```

O teste de compatibilidade comparará esse schema com uma resposta real.

Isso reduz o risco de drift.

A aula 381 criará governança mais forte.

---

### Violations

`ApiViolationDocumentation` terá:

- location;
- field;
- code;
- message.

Não documente:

- rejectedValue;
- stackTrace;
- exception;
- cause.

---

### Pagination schema

Documente:

- content;
- page;
- size;
- totalElements;
- totalPages;
- first;
- last;
- sort;
- direction;
- orders;
- filter.

Inclua limits:

```text
size:
1 a 50.

page:
zero ou positiva.
```

---

### Dynamic filters

Documente cada parâmetro.

Exemplo:

```text
createdFrom:
Instant inclusivo.

createdTo:
Instant exclusivo.

description:
any, present ou absent.
```

Não documente filtros inexistentes.

---

### PUT schema

O PUT representa replacement completo.

A description deve informar:

```text
description ausente ou null
remove a descricao anterior.
```

O request não deve parecer parcial na UI.

---

### Merge Patch schema

O body é um object parcial.

Modelo de documentação:

```text
ManagedRuntimeMessageMergePatchDocumentation.
```

Campos opcionais:

- value;
- description.

A description explica:

```text
membro ausente preserva;

description null remove;

value null e invalido.
```

---

### JSON Patch schema

Documente array de:

```text
JsonPatchOperationRequest.
```

Operações permitidas:

- add;
- remove;
- replace;
- move;
- copy;
- test.

Paths permitidos:

- `/value`;
- `/description`.

Máximo:

```text
20 operations.
```

---

### Content type

PATCH Merge:

```text
application/merge-patch+json.
```

PATCH JSON:

```text
application/json-patch+json.
```

Não documente `application/json` para PATCH.

Isso precisa combinar com o controller real.

---

### If-Match

PUT, PATCH e DELETE documentam `If-Match`.

A descrição informa:

- formato `"vN"`;
- ETag forte;
- 428 se ausente;
- 400 se inválida;
- 412 se desatualizada.

Não exponha a versão atual dentro do Problem Detail.

---

### Conditional GET

GET individual documenta:

```text
If-None-Match;

304;

ETag;

Last-Modified.
```

O body 304 permanece ausente.

---

### Swagger UI e Try it out

No laboratório:

```yaml
springdoc:
  swagger-ui:
    try-it-out-enabled: true
```

Isso permite enviar requests.

Em ambientes compartilhados, avalie:

- autenticação;
- autorização;
- dados;
- CORS;
- rate limiting;
- exposição pública.

Não habilite automaticamente em produção.

---

### Determinismo do documento

Configure:

```yaml
springdoc:
  writer-with-order-by-keys: true
  writer-with-default-pretty-printer: true
```

Isso melhora leitura e diffs.

Não garante sozinho estabilidade semântica.

---

### Generic responses do advice

springdoc pode acrescentar responses de `@ControllerAdvice`.

A baseline desabilitará a aplicação genérica automática:

```yaml
springdoc:
  override-with-generic-response: false
```

Motivo:

```text
cada operation deve declarar
somente os erros aplicaveis.
```

O handler global continua funcionando em runtime.

---

### Exposição

Base:

```yaml
springdoc:
  api-docs:
    enabled: false
  swagger-ui:
    enabled: false
```

Profile `openapi-lab`:

```yaml
springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    enabled: true
```

Os testes ativam o profile.

Essa política evita exposição acidental.

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

Docker precisa estar ativo para a suite completa.

---

### 2. Adicionar a property Maven

No `pom.xml`:

```xml
<properties>
    <java.version>21</java.version>
    <springdoc.version>3.0.3</springdoc.version>
</properties>
```

Preserve as properties existentes.

---

### 3. Adicionar o starter

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>${springdoc.version}</version>
</dependency>
```

Não adicione Springfox.

Não adicione swagger-ui manualmente.

---

### 4. Inspecionar dependencies

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springdoc:*,io.swagger.core.v3:*,org.webjars:swagger-ui"
```

Confirme springdoc 3.x.

---

### 5. Configurar application base

```yaml
springdoc:
  api-docs:
    enabled: false
    version: OPENAPI_3_1
  swagger-ui:
    enabled: false
```

A documentação não fica exposta por acidente.

---

### 6. Criar profile openapi-lab

```yaml
springdoc:
  api-docs:
    enabled: true
    path: "/v3/api-docs"
    version: OPENAPI_3_1

  swagger-ui:
    enabled: true
    path: "/swagger-ui.html"
    try-it-out-enabled: true
    display-request-duration: true
    operations-sorter: method
    tags-sorter: alpha

  writer-with-order-by-keys: true
  writer-with-default-pretty-printer: true
  override-with-generic-response: false
  packages-to-scan:
    - "br.com.formacao.backend.web.controller"
  paths-to-match:
    - "/api/v1/**"
```

---

### 7. Criar metadata configuration

Bean `OpenAPI`.

Configure:

```text
Info;

Server relativo;

Tag global.
```

Não hardcode hostname de produção.

---

### 8. Criar GroupedOpenApi

Group:

```text
managed-runtime-messages.
```

Path:

```text
/api/v1/runtime/managed-messages/**.
```

Valide o endpoint do grupo.

---

### 9. Criar constantes OpenAPI

`OpenApiHeaders`:

```text
IF_MATCH;

IF_NONE_MATCH;

ETAG;

LOCATION;

LAST_MODIFIED;

CORRELATION_ID;

TOTAL_COUNT;

TOTAL_PAGES;

LINK;

ACCEPT_PATCH;

ALLOW.
```

`OpenApiMediaTypes`:

```text
APPLICATION_JSON;

APPLICATION_PROBLEM_JSON;

MERGE_PATCH_JSON;

JSON_PATCH_JSON.
```

Use somente para annotations e documentação.

---

### 10. Anotar o controller com Tag

Uma tag para a feature.

Não use nome técnico de classe como tag.

---

### 11. Documentar POST

Adicione:

- operationId;
- summary;
- request body;
- create example;
- 201 response;
- Location;
- ETag;
- Last-Modified;
- correlation id;
- 400;
- 409;
- 415;
- 500.

Confirme que o schema é o request DTO real.

---

### 12. Documentar GET item

Adicione:

- id path;
- If-None-Match;
- 200;
- detail schema;
- ETag;
- Last-Modified;
- 304 sem body;
- 400;
- 404;
- 406;
- 500.

---

### 13. Documentar GET collection

Documente:

- page;
- size;
- sort repetido;
- value;
- createdFrom;
- createdTo;
- updatedFrom;
- updatedTo;
- minVersion;
- maxVersion;
- description.

Responses:

- 200 com page schema;
- total headers;
- Link;
- correlation id;
- 400 Problem Detail;
- 406 sem body;
- 500.

---

### 14. Documentar PUT

Request de replacement.

If-Match obrigatório.

Responses:

- 200;
- 400;
- 404;
- 409;
- 412;
- 415;
- 428;
- 500.

Documente no-op.

---

### 15. Documentar Merge Patch

OperationId único:

```text
mergePatchManagedRuntimeMessage.
```

Consumes:

```text
application/merge-patch+json.
```

Use schema de documentação.

Documente ausência e null.

Responses incluem 422.

---

### 16. Documentar JSON Patch

OperationId:

```text
jsonPatchManagedRuntimeMessage.
```

Consumes:

```text
application/json-patch+json.
```

Use array schema de operations.

Documente paths e limite.

---

### 17. Documentar DELETE

If-Match obrigatório.

Responses:

- 204 sem body;
- 400;
- 404;
- 412;
- 428;
- 500.

---

### 18. Documentar OPTIONS

Responses:

```text
204.
```

Headers:

```text
Allow;

Accept-Patch.
```

Sem body.

---

### 19. Anotar request DTOs

Adicione descriptions e examples.

Mantenha Bean Validation.

Não duplique limites com valores divergentes.

---

### 20. Anotar response DTOs

Documente:

- id int64;
- value;
- description nullable;
- createdAt date-time;
- updatedAt date-time;
- version int64.

Summary continua sem description.

---

### 21. Documentar page response

Documente lista de summaries e metadata.

`orders` utiliza schema específico.

Inclua exemplos coerentes com múltiplos sorts.

---

### 22. Criar ApiViolationDocumentation

Somente documentação.

Marque o package como:

```text
web.openapi.model.
```

Não retorne esse tipo em runtime.

---

### 23. Criar ApiProblemDocumentation

Inclua os campos reais.

Use:

```text
type:
uri.

timestamp:
date-time.

violations:
array.
```

Não inclua rejected value.

---

### 24. Criar MergePatchDocumentation

Campos opcionais.

Examples:

```json
{
  "description": null
}
```

e:

```json
{
  "value": "Spring Web MVC"
}
```

Não declare value obrigatório no Merge Patch.

---

### 25. Criar responses reutilizaveis

Se o tamanho das annotations ficar excessivo, crie meta-annotations ou constantes de description.

Não esconda media type ou schema.

Evite uma abstraction que torne a operation ilegível.

---

### 26. Criar OpenApiEndpointSmokeTest

Profile:

```text
openapi-lab.
```

Use MockMvc.

Valide:

```text
/v3/api-docs:
200;

/v3/api-docs.yaml:
200;

/swagger-ui.html:
3xx ou 200.
```

---

### 27. Criar MetadataTest

Valide:

- openapi começa com 3.1;
- title;
- version;
- server;
- tag;
- ausência de security schemes.

---

### 28. Criar OperationsTest

Valide paths e methods.

Confirme operation ids únicos.

Confirme nenhum endpoint interno inesperado.

---

### 29. Criar RequestSchemaTest

Valide:

- create schema;
- PUT schema;
- Merge Patch schema;
- JSON Patch array;
- constraints;
- nullable description;
- examples parseáveis.

---

### 30. Criar ResponseSchemaTest

Valide:

- created;
- detail;
- summary;
- page;
- updated;
- no body em 204 e 304.

---

### 31. Criar ProblemDetailsTest

Confirme:

```text
application/problem+json;

ApiProblemDocumentation;

code;

timestamp;

correlationId;

violations.
```

Confirme ausência de:

- stackTrace;
- exception;
- cause;
- rejectedValue.

---

### 32. Criar HeadersTest

Valide presença por operation.

Exemplos:

```text
POST 201:
Location, ETag, Last-Modified.

GET 200:
ETag, Last-Modified.

GET collection 200:
X-Total-Count, X-Total-Pages, Link.

OPTIONS 204:
Allow, Accept-Patch.
```

---

### 33. Criar PaginationFilterTest

Valide:

- defaults;
- limits;
- repeated sort array;
- allowable description values;
- formats date-time;
- minVersion mínimo zero;
- descriptions inclusivo/exclusivo.

---

### 34. Criar PatchMediaTypesTest

Confirme dois PATCH operations ou mappings documentados com media types distintos.

Confirme ausência de `application/json`.

---

### 35. Criar ExamplesTest

Parseie JSON examples com Jackson.

Confirme que:

- examples são JSON válido;
- requests satisfazem DTOs;
- response examples possuem campos esperados;
- nenhum secret existe.

---

### 36. Criar RuntimeCompatibilityTest

Para cada cenário principal:

1. executar request real;
2. capturar status, media type e body;
3. localizar response no OpenAPI;
4. confirmar schema e media type documentados.

Cenários:

- create 201;
- validation 400;
- not found 404;
- conflict 409;
- stale 412;
- patch invalid 422;
- missing If-Match 428.

---

### 37. Criar ExposureConfigurationTest

Base profile:

```text
/v3/api-docs:
404.
```

Profile `openapi-lab`:

```text
200.
```

Não confunda feature desabilitada com autorização.

---

### 38. Criar ArchitectureTest

Valide:

- springdoc 3.x;
- zero Springfox;
- config em package apropriado;
- documentation models somente na web;
- application sem Swagger annotations;
- domain sem Swagger annotations;
- persistence sem Swagger annotations;
- controllers documentados;
- operation ids únicos;
- zero SecurityScheme;
- zero contrato YAML versionado como source;
- zero OpenAPI Generator.

---

### 39. Criar LiveServerIT

Use:

- RANDOM_PORT;
- profile openapi-lab;
- PostgreSQLContainer;
- ServiceConnection.

Valide:

- docs JSON;
- docs YAML;
- UI;
- group;
- Try it out endpoint carrega config;
- operations existentes;
- responses principais.

---

### 40. Exportar JSON

Script:

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:8081/v3/api-docs" `
  -OutFile "target/generated-openapi/openapi.json"
```

Crie diretório quando necessário.

Não versionar em source nesta aula.

---

### 41. Exportar YAML

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:8081/v3/api-docs.yaml" `
  -OutFile "target/generated-openapi/openapi.yaml"
```

A aula 381 decidirá como governar o artefato.

---

### 42. Abrir Swagger UI

Execute:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,persistence-lab,openapi-lab"
```

Abra:

```text
http://localhost:8081/swagger-ui.html.
```

Teste a feature com dados de laboratório.

---

### 43. Criar documentacao

`openapi-vs-swagger.md` diferencia conceitos.

`springdoc-openapi-setup.md` registra dependency e endpoints.

`openapi-global-metadata.md` documenta Info, servers e tags.

`openapi-operation-documentation.md` registra annotations.

`openapi-schema-documentation.md` registra DTOs e examples.

`openapi-problem-details.md` documenta extensions.

`openapi-pagination-filters.md` documenta parâmetros.

`openapi-patch-contracts.md` documenta media types.

`swagger-ui-exposure.md` registra profiles.

`openapi-document-tests.md` define estratégia.

`openapi-code-first-baseline.md` consolida decisões.

---

### 44. Criar scripts

`135_iniciar_swagger_ui.ps1` inicia profiles.

`136_exportar_openapi_json.ps1` exporta JSON.

`137_exportar_openapi_yaml.ps1` exporta YAML.

`138_validar_openapi_endpoints.ps1` valida status e content type.

`139_testar_swagger_ui.ps1` valida UI e config.

`140_executar_testes_openapi.ps1` executa a suite.

---

### 45. Executar smoke e metadata

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiEndpointSmokeTest,OpenApiMetadataTest test
```

---

### 46. Executar operation e schemas

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiManagedMessageOperationsTest,OpenApiRequestSchemaTest,OpenApiResponseSchemaTest test
```

---

### 47. Executar errors e headers

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiProblemDetailsTest,OpenApiHeadersTest,OpenApiPatchMediaTypesTest test
```

---

### 48. Executar examples e compatibilidade

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiExamplesTest,OpenApiRuntimeCompatibilityTest test
```

---

### 49. Executar exposure e architecture

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiExposureConfigurationTest,OpenApiArchitectureTest test
```

---

### 50. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=OpenApiLiveServerIT test
```

Docker precisa estar ativo.

---

### 51. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 52. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 53. Revisar escopo

Confirme:

```text
springdoc 3.x:
presente.

OpenAPI 3.1:
presente.

Swagger UI:
presente.

code first:
presente.

contract first:
zero.

OpenAPI Generator:
zero.

Springfox:
zero.

SecurityScheme:
zero.

UI production:
desabilitada por baseline.
```

---

### 54. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- openapi exportado em target;
- screenshots;
- responses capturadas;
- server URL privada;
- token;
- documentação de Security inexistente;
- arquivo contract-first antecipado.

---

## Entendendo o que foi feito

### A superficie HTTP ficou navegavel

Consumers conseguem localizar operations, parameters, schemas e responses.

### A UI deixou de ser a fonte

O documento OpenAPI é o artefato; Swagger UI apenas o renderiza.

### Contratos complexos ficaram explicitos

PATCH, preconditions, paginação, filtros e Problem Details não dependem somente de inferência.

### A documentação ganhou testes

Status, media types, headers e schemas são verificados.

### A exposição ganhou política

Docs e UI são habilitadas por profile, não por acidente.

---

## Erros comuns importantes

### Instalar Springfox

A biblioteca não corresponde à stack moderna desta formação.

### Usar springdoc 2.x com Boot 4

A linha compatível é springdoc 3.x.

### Confiar somente em inferencia

Headers, 428, PATCH e extensions ficam incompletos.

### Documentar Security inexistente

Consumers recebem uma promessa falsa.

### Deixar Swagger UI aberta sem politica

Try it out pode executar operações reais.

---

## Comandos uteis

### Iniciar UI

```powershell
.\scripts\135_iniciar_swagger_ui.ps1
```

### Exportar JSON

```powershell
.\scripts\136_exportar_openapi_json.ps1
```

### Exportar YAML

```powershell
.\scripts\137_exportar_openapi_yaml.ps1
```

### Validar endpoints

```powershell
.\scripts\138_validar_openapi_endpoints.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Remover annotation de response

Remova temporariamente 428 do PUT.

Faça o teste do documento falhar.

Restaure.

### Parte 2 — Example invalido

Crie example JSON quebrado.

Faça `OpenApiExamplesTest` rejeitar.

Restaure.

### Parte 3 — Schema divergente

Remova `correlationId` do modelo de documentação.

Compare com response real.

Restaure.

### Parte 4 — OperationId duplicado

Repita um operationId.

Faça o teste de unicidade falhar.

Restaure.

### Parte 5 — Profile

Inicie sem `openapi-lab`.

Confirme docs indisponíveis.

Depois habilite o profile.

### Parte 6 — Generic advice responses

Ative temporariamente:

```text
override-with-generic-response.
```

Observe responses adicionadas.

Restaure a documentação explícita.

### Parte 7 — Group

Crie um grupo de fixture para endpoints internos.

Não mantenha paths inexistentes.

### Parte 8 — ADR

Registre:

```text
springdoc 3.x para Boot 4;

OpenAPI 3.1;

code first nesta aula;

Swagger UI como renderer;

operation ids estaveis;

responses explicitas;

Problem Details documentado;

profiles controlam exposicao;

exports ficam em target;

governanca na aula 381.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 379 foi preservada;
- o mesmo projeto foi continuado;
- OpenAPI foi definida;
- Swagger foi diferenciado de OpenAPI;
- Swagger UI foi diferenciada do documento;
- springdoc-openapi foi definido;
- fluxo code-first foi explicado;
- vantagens de code-first foram explicadas;
- riscos de code-first foram explicados;
- contract first não foi antecipado;
- springdoc 3.0.3 foi adicionado;
- property Maven foi criada;
- springdoc 3.x foi alinhado ao Boot 4.x;
- springdoc 2.x não foi usado;
- Springfox não foi usado;
- starter WebMVC UI foi usado;
- Swagger UI não foi adicionada manualmente;
- dependency tree foi inspecionada;
- OpenAPI 3.1 foi configurada;
- publicação atual de OpenAPI 3.2 foi reconhecida sem trocar a baseline;
- JSON `/v3/api-docs` foi habilitado no profile;
- YAML `/v3/api-docs.yaml` foi habilitado;
- Swagger UI `/swagger-ui.html` foi habilitada;
- documentação ficou desabilitada no profile base;
- profile `openapi-lab` foi criado;
- Try it out ficou restrito ao laboratório;
- exposição de produção foi documentada;
- Security não foi inventada;
- SecurityScheme não foi criado;
- metadata global foi criada;
- title foi definido;
- version foi definida;
- description foi definida;
- server relativo foi usado;
- hostname de produção não foi hardcoded;
- tag global foi criada;
- `GroupedOpenApi` foi criado;
- group path foi validado;
- `@Tag` foi usado;
- `@Operation` foi usado;
- operation ids foram explícitos;
- operation ids são únicos;
- summaries foram criados;
- descriptions foram criadas;
- `@Parameter` foi usado;
- path id foi documentado;
- page e size foram documentados;
- sort repetido foi documentado;
- filtros dinâmicos foram documentados;
- inclusive e exclusive foram explicados;
- description presence foi documentada;
- `If-Match` foi documentado;
- `If-None-Match` foi documentado;
- formato de ETag foi documentado;
- `@RequestBody` OpenAPI foi usado;
- create request foi documentado;
- PUT request foi documentado como replacement;
- Merge Patch foi documentado;
- JSON Patch foi documentado;
- `@Schema` foi usado;
- `@ArraySchema` foi usado;
- exemplos válidos foram criados;
- examples não contêm secrets;
- `@ApiResponse` foi usado;
- POST documenta 201;
- GET item documenta 200 e 304;
- GET collection documenta 200;
- PUT documenta 200;
- PATCH documenta 200;
- DELETE documenta 204;
- OPTIONS documenta 204;
- 400 foi documentado onde aplicável;
- 404 foi documentado onde aplicável;
- 405 foi documentado onde aplicável;
- 406 sem body foi documentado;
- 409 foi documentado onde aplicável;
- 412 foi documentado;
- 415 foi documentado;
- 422 foi documentado;
- 428 foi documentado;
- 500 foi documentado;
- responses sem conteúdo não receberam schema JSON;
- Location foi documentado;
- ETag foi documentada;
- Last-Modified foi documentado;
- Cache-Control foi documentado;
- X-Correlation-Id foi documentado;
- X-Total-Count foi documentado;
- X-Total-Pages foi documentado;
- Link foi documentado;
- Allow foi documentado;
- Accept-Patch foi documentado;
- schema de create response foi documentado;
- detail response foi documentado;
- summary response foi documentado;
- page response foi documentado;
- updated response foi documentado;
- description nullable foi documentada;
- Instants usam date-time;
- ids e versions usam int64;
- Problem Details foi documentado;
- modelo documentation-only foi criado;
- modelo de Problem não é retornado em runtime;
- `type` URI foi documentado;
- `code` foi documentado;
- `timestamp` foi documentado;
- `correlationId` foi documentado;
- violations foram documentadas;
- rejectedValue não foi documentado;
- stackTrace não foi documentado;
- exception não foi documentada;
- Merge Patch usa media type correto;
- JSON Patch usa media type correto;
- PATCH não documenta application/json;
- JSON Patch documenta seis operations;
- paths permitidos foram documentados;
- limite de 20 operations foi documentado;
- response de paginação documenta orders;
- ordenação implícita foi documentada;
- springdoc writer ordering foi habilitado;
- pretty printer foi habilitado;
- generic advice response automático foi desabilitado;
- responses foram documentadas por operation;
- `OpenApiEndpointSmokeTest` foi criado;
- `OpenApiMetadataTest` foi criado;
- `OpenApiManagedMessageOperationsTest` foi criado;
- `OpenApiRequestSchemaTest` foi criado;
- `OpenApiResponseSchemaTest` foi criado;
- `OpenApiProblemDetailsTest` foi criado;
- `OpenApiHeadersTest` foi criado;
- `OpenApiPaginationFilterTest` foi criado;
- `OpenApiPatchMediaTypesTest` foi criado;
- `OpenApiExamplesTest` foi criado;
- examples foram parseados;
- `OpenApiRuntimeCompatibilityTest` foi criado;
- responses reais foram comparadas com a descrição;
- `OpenApiExposureConfigurationTest` foi criado;
- profile base não expõe docs;
- profile lab expõe docs;
- `OpenApiArchitectureTest` foi criado;
- annotations Swagger ficaram na web/config;
- application não recebeu Swagger annotations;
- domain não recebeu Swagger annotations;
- persistence não recebeu Swagger annotations;
- `OpenApiLiveServerIT` foi criado;
- PostgreSQL real foi preservado;
- JSON, YAML, UI e group foram testados;
- export JSON foi criado;
- export YAML foi criado;
- exports ficaram em target;
- documentação completa foi criada;
- scripts foram criados;
- testes smoke, metadata, operations, schemas, errors, headers, examples, compatibilidade, exposição, arquitetura, live, suite e package passaram;
- nenhum contract first, Generator, lint, diff, breaking change gate, Security, versionamento ou depreciação foi antecipado;
- ponte para a aula 381 está correta;
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
git commit -m "docs(m14): publicar contratos com openapi e swagger ui"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- exports OpenAPI;
- screenshots;
- responses capturadas;
- URLs privadas;
- secrets;
- Security inexistente;
- contrato first antecipado.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a API ganhou uma descrição OpenAPI navegável.

O fluxo consolidado ficou:

```text
controllers e DTOs;

Bean Validation;

Swagger annotations;

springdoc;

OpenAPI 3.1 JSON e YAML;

Swagger UI;

testes do documento.
```

Você comprovou:

```text
metadata global;

tags;

operation ids;

parameters;

request bodies;

schemas;

examples;

responses;

headers;

Problem Details;

pagination;

filters;

PUT;

PATCH;

preconditions;

exposicao por profile.
```

A decisão central foi:

```text
Swagger UI nao e o contrato;

o contrato e a descricao OpenAPI,
e ela precisa ser comparada
com o comportamento real da API.
```

A próxima aula será:

```text
381 - M14.26 - OpenAPI contract first e governanca de contrato
```

Nela, você continuará no mesmo projeto e estudará:

- contract first;
- arquivo OpenAPI versionado;
- source of truth;
- design before implementation;
- lint;
- validação de schema;
- diff;
- breaking changes;
- backward compatibility;
- code generation;
- server stubs;
- clients;
- Maven plugin;
- templates;
- generated source;
- ownership;
- review;
- aprovação;
- CI gate;
- artifact publication;
- sincronização entre contrato e runtime;
- governança de exemplos;
- overlays conceituais;
- migração gradual do code-first.

A aula 380 respondeu:

```text
como gerar e testar
documentacao OpenAPI
a partir da aplicacao?
```

A aula 381 responderá:

```text
como transformar o contrato
em uma fonte governada,
versionada e protegida
contra mudancas incompatíveis?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei diferenciar OpenAPI, Swagger UI e springdoc.
- [ ] Sei documentar operations, schemas, headers e responses.
- [ ] Sei representar Problem Details, PATCH e preconditions.
- [ ] Sei testar o documento gerado contra o runtime.
- [ ] Sei controlar a exposição da documentação por profile.

---

## Troubleshooting adicional

### /v3/api-docs retorna 404

Confirme profile `openapi-lab` e `springdoc.api-docs.enabled`.

### Swagger UI abre sem operations

Revise packages-to-scan, paths-to-match e GroupedOpenApi.

### Documento usa OpenAPI 3.0

Confirme `springdoc.api-docs.version=OPENAPI_3_1`.

### Problem Detail nao mostra extensions

Use o modelo de documentação explícito e teste contra runtime.

### PATCH aparece como application/json

Revise `consumes` do mapping e `@Content`.

### UI funciona em producao sem querer

Desabilite docs e UI no profile base/produção.

---

## Perguntas de revisao

1. O que OpenAPI define?
2. O que Swagger UI faz?
3. O que springdoc faz?
4. Qual fluxo foi usado?
5. Qual versão springdoc?
6. Qual linha é compatível com Boot 4?
7. Qual versão OpenAPI da baseline?
8. Qual endpoint JSON?
9. Qual endpoint YAML?
10. Qual endpoint da UI?
11. Para que serve GroupedOpenApi?
12. O que é operationId?
13. Para que serve @Schema?
14. Como documentar arrays?
15. Como documentar responses?
16. Swagger UI é o contrato?
17. Problem Details exige modelo explícito?
18. Security foi documentada?
19. Docs ficam abertas por padrão?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma descrição padronizada de API HTTP.
2. Renderiza e explora a descrição.
3. Gera OpenAPI a partir do Spring.
4. Code-first.
5. 3.0.3.
6. 3.x.
7. 3.1.
8. `/v3/api-docs`.
9. `/v3/api-docs.yaml`.
10. `/swagger-ui.html`.
11. Separar superfícies documentadas.
12. Identificador estável da operation.
13. Descrever modelos e properties.
14. Com `@ArraySchema`.
15. Com `@ApiResponse`.
16. Não.
17. Para extensions específicas, sim.
18. Não.
19. Não, somente por profile.
20. OpenAPI contract first e governança de contrato.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 380 - M14.25 - OpenAPI Swagger

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei OpenAPI, Swagger UI e springdoc-openapi.
- Adotei o fluxo code-first nesta aula.
- Adicionei springdoc-openapi 3.0.3.
- Mantive compatibilidade com Spring Boot 4.x.
- Configurei geração OpenAPI 3.1.
- Habilitei JSON, YAML e Swagger UI por profile.
- Mantive a documentação desabilitada na configuração base.
- Criei metadata global com Info, server e tags.
- Criei um `GroupedOpenApi` para managed runtime messages.
- Documentei operation ids únicos.
- Documentei summaries e descriptions.
- Documentei path, query e header parameters.
- Documentei requests de POST e PUT.
- Documentei JSON Merge Patch e JSON Patch.
- Documentei media types específicos de PATCH.
- Documentei schemas e examples.
- Documentei responses de sucesso e erro.
- Documentei Location, ETag, Last-Modified e correlation id.
- Documentei paginação, filtros, totals e Link.
- Documentei If-Match, If-None-Match e Accept-Patch.
- Criei modelo de documentação para Problem Details.
- Documentei code, timestamp, correlationId e violations.
- Mantive stack trace, exception e rejected value fora do contrato.
- Testei JSON, YAML, group e Swagger UI.
- Testei metadata, operations, schemas, headers e examples.
- Comparei a descrição com responses reais.
- Controlei a exposição por profile.
- Não inventei Security.
- Mantive exports em `target`.
- Não antecipei contract first ou governança.
- Próxima aula: OpenAPI contract first e governança de contrato.
```

---

## Referencia tecnica curta

```text
OpenAPI:
contrato.

Swagger UI:
renderer.

springdoc:
gerador.

Operation:
endpoint.

Parameter:
entrada.

Schema:
modelo.

Response:
saida.

Example:
amostra.

Profile:
exposicao.

Test:
confianca.
```

Regra final:

```text
a documentacao OpenAPI deve representar a superficie HTTP real da aplicacao, usando springdoc compativel com a versao do Spring Boot, metadata global, operation ids estaveis, parameters, request bodies, schemas, examples, responses e headers explicitos; Swagger UI deve ser tratada apenas como uma visualizacao do documento, Problem Details e media types especiais precisam de schemas verificaveis, a descricao deve ser comparada com o runtime por testes e sua exposicao deve ser controlada por profile, sem inventar Security ou antecipar contract first e governanca.
```
