# 366 - M14.11 - ResponseEntity status headers body

## Apresentacao da aula

Na aula 365, você conectou as principais regiões de entrada HTTP aos tipos Java usados pelo controller.

Foram praticados:

```text
@PathVariable;

@RequestParam;

@RequestBody;

ConversionService;

converter customizado;

HttpMessageConverter;

URI encoding;

400 para falha de binding;

415 para media type de entrada não suportado.
```

A aplicação passou a possuir:

```text
GET /api/v1/runtime/messages/{position};

GET /api/v1/runtime/messages;

POST /api/v1/runtime/messages/preview.
```

Esses métodos devolveram records diretamente.

Quando um controller retorna um objeto diretamente, a infraestrutura MVC aplica o status de sucesso padrão, escolhe um message converter e escreve o body.

Essa abordagem é adequada para respostas simples.

Agora surge a próxima pergunta:

```text
como controlar explicitamente
o status, os headers e a presenca
ou ausencia do body?
```

A resposta central desta aula é:

```text
ResponseEntity<T>.
```

`ResponseEntity<T>` representa o envelope HTTP devolvido pelo controller.

Ele reúne:

```text
status;

headers;

body.
```

O tipo genérico `T` representa o tipo do body.

Exemplos:

```text
ResponseEntity<RuntimeMessageResponse>:
resposta com JSON.

ResponseEntity<String>:
resposta textual.

ResponseEntity<Void>:
resposta sem body.
```

Nesta aula, você aprofundará:

- `HttpEntity`;
- `ResponseEntity`;
- `HttpStatus`;
- `HttpStatusCode`;
- constructors;
- builders;
- `ok`;
- `created`;
- `accepted`;
- `noContent`;
- `badRequest`;
- `notFound`;
- `status`;
- `body`;
- `build`;
- `HttpHeaders`;
- `Location`;
- `Content-Type`;
- `Cache-Control`;
- `ETag`;
- `Last-Modified`;
- `Retry-After`;
- headers customizados;
- body presente;
- body ausente;
- `200 OK`;
- `201 Created`;
- `202 Accepted`;
- `204 No Content`;
- `304 Not Modified`;
- `400 Bad Request`;
- `404 Not Found`;
- `409 Conflict`;
- respostas condicionais;
- testes de status, headers e body.

A implementação será dividida em duas partes.

Primeira parte:

```text
evoluir endpoints existentes
para ResponseEntity explicita.
```

O endpoint por posição passará a responder:

```text
200:
posição encontrada.

404:
posição inexistente.
```

O endpoint de consulta passará a informar:

```text
X-Result-Count;

Cache-Control.
```

O endpoint de prévia passará a informar:

```text
X-Preview;

Cache-Control: no-store.
```

Segunda parte:

```text
criar um pequeno recurso em memoria
para demonstrar criacao, leitura e exclusao.
```

O recurso será:

```text
managed runtime message.
```

Contratos:

```text
POST /api/v1/runtime/managed-messages;

GET /api/v1/runtime/managed-messages/{id};

DELETE /api/v1/runtime/managed-messages/{id}.
```

Resultados:

```text
201 Created:
mensagem criada.

400 Bad Request:
conteúdo vazio na regra transitória do laboratório.

409 Conflict:
mensagem duplicada.

200 OK:
mensagem localizada.

304 Not Modified:
ETag correspondente.

404 Not Found:
id inexistente.

204 No Content:
exclusão concluída sem body.
```

O armazenamento será em memória.

Ele existe somente para exercitar o contrato HTTP.

Ele não será tratado como persistência de produção.

Não serão adicionados:

- PostgreSQL;
- JPA;
- Flyway;
- transações;
- cache real;
- fila;
- worker assíncrono;
- event broker.

O status:

```text
202 Accepted
```

será comprovado em uma fixture de teste isolada.

A aplicação ainda não possui processamento assíncrono real.

Retornar 202 em produção sem aceitar e acompanhar trabalho de verdade criaria um contrato enganoso.

Essa decisão é intencional.

O aprofundamento da arquitetura de request e response DTOs ficará para:

```text
367 - M14.12 - DTO request response
```

Os mappers explícitos serão estudados em:

```text
368 - M14.13 - Mappers manuais
```

Nesta aula, os records serão mínimos e a adaptação continuará mecânica.

Também não serão criados:

- `@ControllerAdvice`;
- Problem Details;
- Bean Validation;
- exceptions HTTP globais;
- autenticação;
- autorização;
- paginação completa;
- documentação OpenAPI.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
367 - M14.12 - DTO request response
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
363:
primeiros endpoints.

364:
HTTP e REST de verdade.

365:
binding de path, query e body.

366:
ResponseEntity, status, headers e body.

367:
DTO request e response.

368:
mappers manuais.

369:
Bean Validation.
```

A aula 365 respondeu:

```text
como a entrada HTTP
vira argumento ou objeto Java?
```

A aula 366 responderá:

```text
como o resultado Java
vira uma resposta HTTP explicita?
```

Nesta aula:

```text
ResponseEntity:
sim.

HttpEntity:
sim.

HttpStatus:
sim.

HttpStatusCode:
sim.

builders:
sim.

status 200:
sim.

status 201:
sim.

status 202:
sim, em fixture isolada.

status 204:
sim.

status 304:
sim.

status 400:
sim.

status 404:
sim.

status 409:
sim.

Location:
sim.

ETag:
sim.

Last-Modified:
sim.

Cache-Control:
sim.

Retry-After:
sim, em fixture isolada.

headers customizados:
sim.

body presente:
sim.

body ausente:
sim.

DTO architecture:
não aprofundada.

mapper dedicado:
não.

validation:
não.

error handler:
não.
```

A regra da aula será:

```text
o status deve comunicar o resultado;

os headers devem carregar metadata HTTP;

o body deve carregar a representacao
quando a semantica permitir.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/backend
├── beans
│   └── managedmessage
│       ├── ManagedRuntimeMessage.java
│       ├── ManagedRuntimeMessageCreateOutcome.java
│       ├── ManagedRuntimeMessageCreateResult.java
│       ├── ManagedRuntimeMessageService.java
│       └── ManagedRuntimeMessageStore.java
└── web
    ├── controller
    │   ├── ManagedRuntimeMessageController.java
    │   └── RuntimeMessageController.java
    ├── request
    │   └── CreateManagedRuntimeMessageRequest.java
    └── response
        └── ManagedRuntimeMessageResponse.java
```

Testes novos:

```text
src/test/java/br/com/formacao/backend/web
├── RuntimeMessageResponseEntityWebMvcTest.java
├── ManagedRuntimeMessageControllerWebMvcTest.java
├── ManagedRuntimeMessageConditionalGetWebMvcTest.java
├── ManagedRuntimeMessageLiveServerIT.java
├── ResponseEntityBuildersTest.java
├── ResponseHeadersContractTest.java
├── NoBodyResponseContractTest.java
├── ManagedRuntimeMessageServiceTest.java
└── ResponseEntityArchitectureTest.java
```

Documentação externa:

```text
docs
├── response-entity-anatomy.md
├── response-entity-builders.md
├── http-status-code-selection.md
├── response-headers.md
├── location-created-contract.md
├── etag-conditional-get.md
├── body-present-absent.md
├── response-entity-vs-direct-body.md
├── managed-message-contract.md
└── response-contract-baseline.md
```

Scripts:

```text
scripts
├── 51_testar_response_headers.ps1
├── 52_criar_managed_message.ps1
├── 53_consultar_condicional.ps1
├── 54_excluir_managed_message.ps1
├── 55_testar_status_conflito.ps1
└── 56_executar_testes_response_entity.ps1
```

Resultados esperados:

```text
GET message position válida:
200 com body.

GET message position inexistente:
404 sem body.

GET query:
200 com X-Result-Count.

POST preview:
200 com X-Preview e no-store.

POST managed message válida:
201 com Location, ETag, Last-Modified e body.

POST conteúdo vazio:
400 sem body.

POST duplicado:
409 sem body.

GET managed message:
200 com ETag, Last-Modified e Cache-Control.

GET com If-None-Match igual:
304 sem body.

GET id inexistente:
404 sem body.

DELETE existente:
204 sem body.

DELETE inexistente:
404 sem body.

fixture accepted:
202 com Location e Retry-After.

ResponseEntity:
nenhuma regra de negócio.
```

---

## Conceito essencial

### HttpEntity

`HttpEntity<T>` representa:

```text
headers;

body.
```

Ele pode ser usado em requests e responses.

`ResponseEntity<T>` especializa essa estrutura adicionando:

```text
status code.
```

Modelo mental:

```text
HttpEntity<T>
    = headers + body.

ResponseEntity<T>
    = status + headers + body.
```

---

### ResponseEntity

`ResponseEntity<T>` é um valor retornado pelo controller.

Ele não é:

- service;
- exception;
- DTO de domínio;
- bean obrigatório;
- substituto para regra de negócio.

O controller escolhe o envelope HTTP a partir do resultado do caso de uso.

---

### Tipo generico

Exemplos:

```java
ResponseEntity<ManagedRuntimeMessageResponse>
```

indica body possível do tipo response.

Para ausência de body:

```java
ResponseEntity<Void>
```

comunica a intenção melhor que:

```java
ResponseEntity<Object>.
```

Evite curingas sem necessidade.

---

### HttpStatus

`HttpStatus` é o enum de status HTTP conhecidos pelo Spring.

Exemplos:

```text
HttpStatus.OK;

HttpStatus.CREATED;

HttpStatus.ACCEPTED;

HttpStatus.NO_CONTENT;

HttpStatus.NOT_MODIFIED;

HttpStatus.BAD_REQUEST;

HttpStatus.NOT_FOUND;

HttpStatus.CONFLICT.
```

Use o enum para status padronizados.

---

### HttpStatusCode

`HttpStatusCode` é uma abstração de código de status.

`HttpStatus` implementa esse contrato.

A abstração permite representar também códigos que não estejam declarados no enum.

Na aplicação, use:

```text
HttpStatus
```

para status comuns e conhecidos.

Não invente código customizado quando um status padrão comunica corretamente o resultado.

---

### Constructor versus builder

É possível construir diretamente:

```java
new ResponseEntity<>(
        body,
        headers,
        HttpStatus.OK
);
```

Entretanto, builders tornam a intenção mais legível:

```java
ResponseEntity
        .ok()
        .header(...)
        .body(body);
```

Nesta aula, o padrão será builder.

Constructors serão reconhecidos, mas não usados como forma principal.

---

### HeadersBuilder e BodyBuilder

Os builders possuem capacidades diferentes.

`HeadersBuilder` permite:

- headers;
- `Allow`;
- ETag;
- Last-Modified;
- Location;
- Cache-Control;
- `Vary`;
- `build()` sem body.

`BodyBuilder` adiciona:

- `contentType`;
- `contentLength`;
- `body()`.

Builders de `noContent`, `notFound` e `notModified` são naturalmente usados sem body.

---

### ok

Atalho:

```java
ResponseEntity.ok(
        body
);
```

ou:

```java
ResponseEntity
        .ok()
        .header(...)
        .body(body);
```

Representa:

```text
200 OK.
```

Use quando a operação foi concluída e existe representação.

---

### created

Atalho:

```java
ResponseEntity
        .created(location)
        .body(body);
```

Representa:

```text
201 Created.
```

O builder exige uma URI de `Location`.

Isso reforça o contrato:

```text
um recurso foi criado
e pode ser localizado.
```

Não use 201 para uma prévia não persistida.

---

### accepted

Atalho:

```java
ResponseEntity
        .accepted()
        .header(
                HttpHeaders.RETRY_AFTER,
                "5"
        )
        .location(jobLocation)
        .body(body);
```

Representa:

```text
202 Accepted.
```

O servidor aceitou a request, mas o processamento pode não ter terminado.

Sem job, fila, estado ou acompanhamento real, 202 seria enganoso.

Por isso, o exemplo ficará em fixture isolada.

---

### noContent

Atalho:

```java
ResponseEntity
        .noContent()
        .build();
```

Representa:

```text
204 No Content.
```

Não inclua body.

O cliente deve interpretar o status, não um objeto vazio.

---

### badRequest

Atalho:

```java
ResponseEntity
        .badRequest()
        .build();
```

Representa:

```text
400 Bad Request.
```

Nesta aula, ele será usado de forma transitória quando o service classificar um conteúdo vazio como inválido.

A validação declarativa será introduzida depois.

---

### notFound

Atalho:

```java
ResponseEntity
        .notFound()
        .build();
```

Representa:

```text
404 Not Found.
```

Use quando o recurso identificado não existe ou não deve ser exposto.

O body de erro padronizado ainda não será criado.

---

### status

Builder genérico:

```java
ResponseEntity
        .status(
                HttpStatus.CONFLICT
        )
        .build();
```

Use quando não existe um atalho específico ou quando a expressão explícita melhora a leitura.

---

### body e build

Use:

```text
body:
quando existe representação.

build:
quando a resposta não possui body.
```

Exemplos:

```java
ResponseEntity
        .ok()
        .body(response);
```

e:

```java
ResponseEntity
        .noContent()
        .build();
```

Não envie body em 204 ou 304.

---

### HttpHeaders

`HttpHeaders` representa headers HTTP como estrutura multivalorada.

Use constantes:

```text
HttpHeaders.LOCATION;

HttpHeaders.ETAG;

HttpHeaders.LAST_MODIFIED;

HttpHeaders.CACHE_CONTROL;

HttpHeaders.IF_NONE_MATCH;

HttpHeaders.RETRY_AFTER.
```

Evite strings quando existe constante oficial.

Headers são case-insensitive no protocolo, mas o código deve permanecer consistente.

---

### Header customizado

O laboratório utilizará:

```text
X-Result-Count;

X-Preview;

X-Resource-Version.
```

Custom headers devem ter:

- nome estável;
- finalidade documentada;
- valor simples;
- necessidade real.

Não coloque regra de negócio inteira em headers.

Representações complexas pertencem ao body.

---

### Location

`Location` identifica a URI do recurso criado ou a URI de acompanhamento de uma operação aceita.

Para 201:

```text
Location:
/api/v1/runtime/managed-messages/{id}.
```

A URI será construída com:

```text
ServletUriComponentsBuilder.
```

Não concatene host e porta manualmente.

---

### Content-Type

O message converter normalmente define o `Content-Type`.

O builder também permite:

```java
.contentType(
        MediaType.APPLICATION_JSON
)
```

Use explicitamente quando o contrato precisar ficar evidente.

Não declare um media type incompatível com o body.

---

### Cache-Control

`Cache-Control` comunica políticas de reutilização.

No laboratório:

```text
consulta de coleção dinâmica:
no-store.

recurso individual:
no-cache.
```

`no-store` impede armazenamento da representação.

`no-cache` permite armazenamento, mas exige revalidação antes do uso.

Não trate os dois como sinônimos.

---

### ETag

ETag é um identificador da versão da representação.

Exemplo:

```text
"managed-message-10-v1"
```

O valor do header precisa estar entre aspas conforme a sintaxe esperada.

Ele não deve depender de informação secreta.

O laboratório usará id e versão.

---

### If-None-Match

O cliente pode enviar:

```http
If-None-Match: "managed-message-10-v1"
```

Se a representação atual possui a mesma tag, o servidor pode responder:

```text
304 Not Modified.
```

Nesse caso, o body não é reenviado.

---

### Last-Modified

`Last-Modified` informa o instante da última alteração conhecida.

O builder recebe milissegundos desde epoch ou um instante compatível por meio das APIs disponíveis.

O laboratório usará:

```text
createdAt
```

porque o recurso não será atualizado nesta aula.

---

### 304 Not Modified

`304` é uma resposta condicional sem body.

Ela não significa erro.

Ela informa:

```text
a representação em cache continua válida.
```

O cliente reutiliza a versão já armazenada.

---

### Retry-After

`Retry-After` pode indicar quando o cliente deveria tentar novamente.

Ele é comum em respostas como:

- 202;
- 429;
- 503.

Na fixture de 202, será usado:

```text
Retry-After: 5.
```

O valor representa segundos.

Não será usado no runtime de produção sem operação assíncrona real.

---

### Status nao pertence ao service

O service deve retornar um resultado de aplicação.

Exemplo:

```text
CREATED;

INVALID;

DUPLICATE.
```

O controller traduz:

```text
CREATED:
201.

INVALID:
400.

DUPLICATE:
409.
```

O service não deve importar:

```text
ResponseEntity;

HttpStatus;

HttpHeaders.
```

Essa separação mantém o caso de uso independente de HTTP.

---

### Outcome de aplicacao

Crie:

```java
public enum ManagedRuntimeMessageCreateOutcome {
    CREATED,
    INVALID,
    DUPLICATE
}
```

O resultado será:

```java
public record ManagedRuntimeMessageCreateResult(
        ManagedRuntimeMessageCreateOutcome outcome,
        ManagedRuntimeMessage message
) {
}
```

O record será aprimorado em aulas futuras.

Nesta etapa, mantenha invariantes simples e testes explícitos.

---

### Store em memoria

`ManagedRuntimeMessageStore` usará:

- `ConcurrentHashMap`;
- `AtomicLong`;
- cópias imutáveis;
- busca por id;
- detecção de duplicidade normalizada;
- remoção.

Ele é um laboratório.

Não substitui banco.

Não adicione `@Transactional`.

---

### Body ausente

Respostas sem body:

```text
204;

304;

404 atual;

400 atual;

409 atual.
```

Os três últimos ficarão sem body apenas porque o contrato de erro ainda não foi desenhado.

Em uma API profissional, erros geralmente recebem representação padronizada.

Esse assunto terá aula própria.

---

### ResponseEntity versus objeto direto

Retorne objeto direto quando:

- status é 200;
- headers adicionais não são necessários;
- o contrato é simples.

Use `ResponseEntity` quando precisar controlar:

- status;
- headers;
- ausência de body;
- Location;
- cache;
- resposta condicional.

Não use `ResponseEntity` mecanicamente em cada método.

---

### of e ofNullable

A API oferece atalhos para construir respostas a partir de:

```text
Optional;

valor nullable.
```

Eles podem produzir:

```text
200 com body;

404 sem body.
```

Nesta aula, o GET individual será explícito porque precisa acrescentar ETag, Last-Modified e Cache-Control.

Atalhos são úteis, mas não devem esconder headers necessários.

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

Todos os testes anteriores devem permanecer verdes.

---

### 2. Evoluir messageAt no service

Altere o retorno para:

```text
Optional de resultado.
```

Posição fora da lista deve produzir:

```text
Optional.empty().
```

Não lance exception HTTP no service.

---

### 3. Evoluir endpoint por posição

Assinatura:

```java
public ResponseEntity<
        RuntimeMessageItemResponse
> messageAt(...)
```

Quando encontrado:

```java
return ResponseEntity
        .ok()
        .header(
                "X-Resource-Position",
                Integer.toString(position)
        )
        .body(response);
```

Quando ausente:

```java
return ResponseEntity
        .notFound()
        .build();
```

---

### 4. Evoluir endpoint de query

Retorne:

```java
ResponseEntity<RuntimeMessageQueryResponse>.
```

Adicione:

```text
X-Result-Count;

Cache-Control: no-store.
```

Use:

```java
CacheControl.noStore().
```

O count deve vir da lista final.

---

### 5. Evoluir endpoint de preview

Retorne:

```java
ResponseEntity<RuntimeMessagePreviewResponse>.
```

Adicione:

```text
X-Preview: true;

Cache-Control: no-store.
```

Mantenha status 200.

Não use 201 porque nenhuma representação persistente foi criada.

---

### 6. Criar ManagedRuntimeMessage

Record de aplicação:

```text
id;

value;

createdAt;

version.
```

Copie e valide somente invariantes estruturais.

Não adicione annotations web.

---

### 7. Criar outcome e result

Crie:

```text
ManagedRuntimeMessageCreateOutcome;

ManagedRuntimeMessageCreateResult.
```

Factories sugeridas:

```text
created(message);

invalid();

duplicate().
```

Evite `message=null` quando uma factory puder preservar a invariante.

---

### 8. Criar ManagedRuntimeMessageStore

Anote como repository.

Responsabilidades:

- gerar id;
- armazenar;
- buscar;
- detectar duplicidade;
- excluir;
- limpar em testes controlados.

Normalize duplicidade com:

```text
trim;

lowercase Locale.ROOT.
```

Use `Clock` no service, não no store.

---

### 9. Criar ManagedRuntimeMessageService

Use constructor injection de:

```text
store;

Clock.
```

Método create:

1. rejeita null ou blank;
2. verifica duplicidade;
3. cria recurso;
4. salva;
5. retorna outcome.

Métodos:

```text
findById;

deleteById.
```

Não importe classes HTTP.

---

### 10. Criar CreateManagedRuntimeMessageRequest

Record web:

```text
value.
```

Não adicione Bean Validation.

A verificação transitória ficará no service.

A aula 367 revisará o papel do request DTO.

---

### 11. Criar ManagedRuntimeMessageResponse

Campos:

```text
id;

value;

createdAt;

version.
```

Factory:

```text
from.
```

Não exponha a chave normalizada usada para duplicidade.

---

### 12. Criar ManagedRuntimeMessageController

Base path:

```text
/api/v1/runtime/managed-messages.
```

Use:

```java
@RestController
@RequestMapping(...)
```

Injete somente:

```text
ManagedRuntimeMessageService.
```

---

### 13. Criar POST de criação

Mapping:

```java
@PostMapping(
        consumes =
                MediaType.APPLICATION_JSON_VALUE,
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
```

Receba:

```text
@RequestBody CreateManagedRuntimeMessageRequest.
```

Não adicione `@Valid`.

---

### 14. Mapear CREATED

Construa `Location`:

```java
URI location =
        ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path("/{id}")
                .build(
                        message.id()
                );
```

Resposta:

```java
return ResponseEntity
        .created(
                location
        )
        .contentType(
                MediaType.APPLICATION_JSON
        )
        .eTag(
                etagFor(message)
        )
        .lastModified(
                message.createdAt()
                        .toEpochMilli()
        )
        .header(
                "X-Resource-Version",
                Long.toString(
                        message.version()
                )
        )
        .body(
                ManagedRuntimeMessageResponse
                        .from(message)
        );
```

---

### 15. Mapear INVALID e DUPLICATE

Use switch sobre outcome.

INVALID:

```java
ResponseEntity
        .badRequest()
        .build();
```

DUPLICATE:

```java
ResponseEntity
        .status(
                HttpStatus.CONFLICT
        )
        .build();
```

Não inclua body de erro provisório.

---

### 16. Criar GET individual

Mapping:

```text
GET /{id}.
```

Receba:

```text
@PathVariable long id;

@RequestHeader(
    name = HttpHeaders.IF_NONE_MATCH,
    required = false
)
String ifNoneMatch.
```

A aula usa request header somente para comprovar resposta condicional.

---

### 17. Criar ETag helper

Método privado mecânico:

```java
private static String etagFor(
        ManagedRuntimeMessage message
) {
    return "\"managed-message-"
            + message.id()
            + "-v"
            + message.version()
            + "\"";
}
```

Não use hash criptográfico sem necessidade.

---

### 18. Mapear 404 no GET

Quando o service não localizar:

```java
return ResponseEntity
        .notFound()
        .build();
```

Tipo:

```text
ResponseEntity<ManagedRuntimeMessageResponse>.
```

---

### 19. Mapear 304

Se:

```text
ifNoneMatch igual ao ETag atual
```

retorne:

```java
return ResponseEntity
        .status(
                HttpStatus.NOT_MODIFIED
        )
        .eTag(etag)
        .lastModified(lastModified)
        .build();
```

Não inclua body.

---

### 20. Mapear 200 no GET

Quando o recurso mudou ou não existe condição:

```java
return ResponseEntity
        .ok()
        .contentType(
                MediaType.APPLICATION_JSON
        )
        .cacheControl(
                CacheControl.noCache()
        )
        .eTag(etag)
        .lastModified(lastModified)
        .header(
                "X-Resource-Version",
                version
        )
        .body(response);
```

---

### 21. Criar DELETE

Mapping:

```text
DELETE /{id}.
```

Quando removido:

```java
return ResponseEntity
        .noContent()
        .build();
```

Quando ausente:

```java
return ResponseEntity
        .notFound()
        .build();
```

Tipo:

```text
ResponseEntity<Void>.
```

---

### 22. Criar fixture de 202

Somente em `src/test/java`, crie controller de fixture.

Endpoint:

```text
POST /fixture/accepted.
```

Resposta:

```java
ResponseEntity
        .accepted()
        .location(
                URI.create(
                        "/fixture/jobs/100"
                )
        )
        .header(
                HttpHeaders.RETRY_AFTER,
                "5"
        )
        .body(
                Map.of(
                        "jobId",
                        100
                )
        );
```

Documente que não é endpoint de produção.

---

### 23. Criar ManagedRuntimeMessageServiceTest

Teste sem Spring:

- criação válida;
- Clock fixo;
- id gerado;
- versão inicial;
- conteúdo blank inválido;
- duplicidade;
- busca;
- exclusão;
- exclusão repetida;
- independência de HTTP.

---

### 24. Criar RuntimeMessageResponseEntityWebMvcTest

Valide endpoints evoluídos:

- item encontrado 200;
- item ausente 404;
- query 200;
- `X-Result-Count`;
- `Cache-Control: no-store`;
- preview 200;
- `X-Preview`;
- body JSON.

Use `@MockitoBean` para os services necessários.

---

### 25. Criar ManagedRuntimeMessageControllerWebMvcTest

Com MockMvc e service mock, valide:

- 201;
- `Location`;
- `Content-Type`;
- `ETag`;
- `Last-Modified`;
- `X-Resource-Version`;
- body;
- 400;
- 409;
- 200;
- 404;
- 204.

Não valide ordem dos headers.

---

### 26. Criar ManagedRuntimeMessageConditionalGetWebMvcTest

Cenário um:

```text
GET sem If-None-Match:
200 com body.
```

Cenário dois:

```text
GET com ETag diferente:
200.
```

Cenário três:

```text
GET com ETag igual:
304 sem body.
```

Confirme ETag também na resposta 304.

---

### 27. Criar ResponseEntityBuildersTest

Teste unitário sem contexto.

Exercite:

```text
ok;

created;

accepted;

noContent;

badRequest;

notFound;

status conflict;

status por HttpStatusCode.
```

Valide status, headers e presença de body.

O exemplo 202 permanece nessa classe ou fixture.

---

### 28. Criar ResponseHeadersContractTest

Valide:

- constantes de header;
- Location válida;
- ETag com aspas;
- Last-Modified maior que zero;
- Cache-Control esperado;
- custom headers estáveis;
- nenhum dado sensível;
- `Retry-After` apenas na fixture.

---

### 29. Criar NoBodyResponseContractTest

Use MockMvc.

Valide body vazio para:

```text
204;

304;

400 atual;

404 atual;

409 atual.
```

Para 204 e 304, valide ausência de `Content-Type` quando aplicável.

Não transforme ausência de body de erro em decisão permanente.

---

### 30. Criar ManagedRuntimeMessageLiveServerIT

Use:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.RANDOM_PORT
)
```

Fluxo real:

1. POST cria;
2. captura `Location`;
3. captura ETag;
4. GET pela Location;
5. GET com If-None-Match;
6. POST duplicado;
7. DELETE;
8. GET após delete.

Valide:

```text
201, 200, 304, 409, 204, 404.
```

Use Java `HttpClient`.

---

### 31. Criar ResponseEntityArchitectureTest

Valide:

- service não importa `org.springframework.http`;
- store não importa pacote web;
- controller não acessa Map interno;
- `ResponseEntity` fica no package web;
- `ResponseEntity<Void>` é usado em delete;
- 204 e 304 não usam `.body`;
- 201 possui Location;
- 202 não aparece em controller de produção;
- records web não possuem stereotypes;
- nenhuma Bean Validation foi adicionada.

---

### 32. Executar aplicação

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

Porta esperada:

```text
8081.
```

---

### 33. Criar recurso por curl

Arquivo temporário:

```json
{
  "value": "response entity"
}
```

Comando:

```powershell
curl.exe -i `
  -X POST `
  -H "Content-Type: application/json" `
  --data-binary "@managed-message.json" `
  http://localhost:8081/api/v1/runtime/managed-messages
```

Registre:

- status;
- Location;
- ETag;
- Last-Modified;
- version;
- body.

Remova o arquivo.

---

### 34. Consultar recurso

Use a Location devolvida.

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/managed-messages/1
```

Confirme 200 e headers.

---

### 35. Consultar condicionalmente

Use o ETag:

```powershell
curl.exe -i `
  -H 'If-None-Match: "managed-message-1-v1"' `
  http://localhost:8081/api/v1/runtime/managed-messages/1
```

Resultado:

```text
304;

body vazio.
```

No PowerShell, ajuste aspas com cuidado.

---

### 36. Testar conflito

Repita o POST com o mesmo valor.

Resultado:

```text
409.
```

Não altere automaticamente o recurso existente.

---

### 37. Testar bad request

Envie:

```json
{
  "value": "   "
}
```

Resultado:

```text
400.
```

Registre que essa regra será substituída por validação declarativa posteriormente.

---

### 38. Excluir recurso

```powershell
curl.exe -i `
  -X DELETE `
  http://localhost:8081/api/v1/runtime/managed-messages/1
```

Resultado:

```text
204;

sem body.
```

Repita:

```text
404.
```

---

### 39. Documentar response-entity-anatomy.md

Compare:

```text
HttpEntity;

ResponseEntity;

status;

headers;

body;

tipo genérico.
```

---

### 40. Documentar response-entity-builders.md

Crie tabela:

```text
ok:
200.

created:
201 + Location.

accepted:
202.

noContent:
204.

badRequest:
400.

notFound:
404.

status:
qualquer status suportado.
```

Inclua `body` versus `build`.

---

### 41. Documentar http-status-code-selection.md

Explique os status praticados.

Inclua:

- por que preview continua 200;
- por que criação usa 201;
- por que duplicidade usa 409;
- por que delete usa 204;
- por que 202 ficou em fixture;
- por que 304 não possui body.

---

### 42. Documentar response-headers.md

Inclua:

- constants;
- Location;
- ETag;
- Last-Modified;
- Cache-Control;
- Retry-After;
- custom headers;
- headers multivalorados;
- cuidados com dados sensíveis.

---

### 43. Documentar location-created-contract.md

Explique:

- URI do recurso;
- builder;
- host e porta;
- proxies;
- testes com Location;
- diferença entre 201 e 202.

Não aprofunde forwarded headers.

---

### 44. Documentar etag-conditional-get.md

Desenhe:

```text
GET:
200 + ETag.

GET If-None-Match:
comparação.

igual:
304.

diferente:
200 + body.
```

Explique que o algoritmo de versão do laboratório é simples.

---

### 45. Documentar body-present-absent.md

Tabela:

```text
200:
body geralmente presente.

201:
body opcional, presente no laboratório.

202:
body opcional.

204:
body ausente.

304:
body ausente.

400, 404, 409:
body ausente provisoriamente.
```

---

### 46. Documentar response-entity-vs-direct-body.md

Crie critérios de escolha.

Não transforme `ResponseEntity` em padrão automático.

---

### 47. Documentar managed-message-contract.md

Registre os três endpoints com:

- método;
- path;
- input;
- status;
- headers;
- body;
- safety;
- idempotência;
- memória transitória.

---

### 48. Documentar response-contract-baseline.md

Consolide todos os endpoints atuais.

Marque dívidas futuras:

- DTO review;
- mapper;
- Bean Validation;
- error response;
- persistência;
- OpenAPI.

---

### 49. Criar scripts

`51_testar_response_headers.ps1` consulta endpoints e imprime headers.

`52_criar_managed_message.ps1` cria JSON temporário, faz POST e remove o arquivo.

`53_consultar_condicional.ps1` recebe id e ETag.

`54_excluir_managed_message.ps1` executa DELETE duas vezes.

`55_testar_status_conflito.ps1` cria e repete o mesmo valor.

`56_executar_testes_response_entity.ps1` executa a suite da aula.

---

### 50. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageResponseEntityWebMvcTest,ManagedRuntimeMessageControllerWebMvcTest,ManagedRuntimeMessageConditionalGetWebMvcTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 51. Executar testes de builders

```powershell
.\mvnw.cmd `
  -Dtest=ResponseEntityBuildersTest,ResponseHeadersContractTest,NoBodyResponseContractTest test
```

---

### 52. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageLiveServerIT test
```

Confirme limpeza do store entre cenários.

---

### 53. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 54. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 55. Revisar escopo

Confirme:

```text
ResponseEntity:
somente web.

201:
somente criação real em memória.

202:
somente fixture.

204:
sem body.

304:
sem body.

Bean Validation:
zero.

ControllerAdvice:
zero.

ProblemDetail:
zero.

JPA:
zero.

Flyway:
zero.
```

---

### 56. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- arquivo JSON temporário;
- target;
- logs;
- store serializado;
- ETag capturado;
- fixture 202 em produção;
- classe de erro provisória;
- validação antecipada.

---

## Entendendo o que foi feito

### A resposta ganhou envelope explicito

Status, headers e body passaram a ser decisões visíveis.

### O service continuou independente de HTTP

Outcomes de aplicação foram traduzidos pelo controller.

### Criacao ganhou Location

O cliente recebeu o endereço do recurso criado.

### Consulta ganhou revalidacao

ETag permitiu devolver 304 sem reenviar o body.

### Ausencia de body ganhou significado

204, 304 e respostas de erro provisórias foram testados explicitamente.

---

## Erros comuns importantes

### Retornar 201 sem recurso criado

Use 200 para preview e 201 somente quando existe recurso localizável.

### Retornar 202 sem processamento real

O status não deve fingir fila ou trabalho assíncrono inexistente.

### Enviar body em 204 ou 304

Esses status não devem carregar representação.

### Colocar HttpStatus no service

A camada de aplicação fica acoplada ao protocolo.

### Criar ETag instavel

Uma mesma versão precisa produzir a mesma tag.

---

## Comandos uteis

### Criar

```powershell
curl.exe -i -X POST `
  -H "Content-Type: application/json" `
  --data-binary "@managed-message.json" `
  http://localhost:8081/api/v1/runtime/managed-messages
```

### Consultar

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/managed-messages/1
```

### Condicional

```powershell
curl.exe -i `
  -H 'If-None-Match: "managed-message-1-v1"' `
  http://localhost:8081/api/v1/runtime/managed-messages/1
```

### Excluir

```powershell
curl.exe -i -X DELETE `
  http://localhost:8081/api/v1/runtime/managed-messages/1
```

### Testes

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Builder generico

Crie em teste:

```text
ResponseEntity.status(HttpStatusCode.valueOf(200)).
```

Compare com `ok()`.

Não use raw code no controller quando existe `HttpStatus`.

### Parte 2 — Header multivalorado

Adicione dois valores a um header de fixture.

Confirme que ambos são preservados.

Remova a fixture depois.

### Parte 3 — accepted

Crie um job fake somente em teste.

Valide 202, Location e Retry-After.

Explique por que não entrou em produção.

### Parte 4 — Cache-Control

Compare:

```text
noStore;

noCache;

maxAge.
```

Não aplique max-age ao recurso dinâmico sem decisão de negócio.

### Parte 5 — ETag alterada

Crie uma segunda versão de fixture.

Confirme que ETag antiga gera 200 com a nova representação.

### Parte 6 — No content

Tente adicionar body a uma fixture 204.

Explique por que o contrato está errado mesmo que algum código permita construir objeto inconsistente.

### Parte 7 — Direct body

Converta temporariamente um GET simples para retorno direto.

Compare legibilidade quando não existem headers adicionais.

Restaure a baseline.

### Parte 8 — ADR

Registre:

```text
ResponseEntity somente quando o envelope precisa de controle;

HttpStatus para códigos padrão;

201 sempre com Location;

202 apenas para processamento aceito real;

204 e 304 sem body;

ETag estável por versão;

service sem HTTP;

headers customizados mínimos e documentados.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 365 foi preservada;
- o mesmo projeto foi continuado;
- `HttpEntity` e `ResponseEntity` foram diferenciados;
- status, headers e body foram explicados;
- tipo genérico foi usado de forma específica;
- `ResponseEntity<Void>` foi usado para ausência de body;
- `HttpStatus` e `HttpStatusCode` foram diferenciados;
- códigos padrão usaram `HttpStatus`;
- builders foram preferidos aos constructors;
- `HeadersBuilder` e `BodyBuilder` foram explicados;
- `ok`, `created`, `accepted`, `noContent`, `badRequest`, `notFound` e `status` foram testados;
- `body()` foi usado quando existe representação;
- `build()` foi usado quando não existe body;
- `HttpHeaders` e constantes oficiais foram usados;
- headers customizados foram mínimos e documentados;
- `Location` foi criado sem concatenação manual de host e porta;
- Content-Type permaneceu compatível com o body;
- `Cache-Control.noStore()` foi usado na consulta dinâmica e preview;
- `Cache-Control.noCache()` foi usado no recurso revalidável;
- no-store e no-cache foram diferenciados;
- ETag foi criada com valor estável por versão;
- ETag foi devolvida em 200, 201 e 304 aplicáveis;
- `If-None-Match` foi lido no GET individual;
- ETag igual retornou 304;
- ETag diferente retornou 200;
- 304 não possui body;
- Last-Modified foi devolvido;
- Retry-After foi usado somente na fixture 202;
- 202 não foi exposto em produção sem processamento real;
- endpoint por posição retornou 200 ou 404;
- endpoint de query retornou `X-Result-Count`;
- preview permaneceu 200;
- preview não foi tratado como recurso criado;
- store em memória foi criado somente para o laboratório;
- store usou estrutura thread-safe;
- ids foram gerados;
- duplicidade foi normalizada;
- `ManagedRuntimeMessageService` não importa HTTP;
- outcome de aplicação foi traduzido pelo controller;
- conteúdo vazio retornou 400 provisório;
- duplicidade retornou 409;
- criação retornou 201;
- 201 possui Location;
- 201 possui body;
- GET individual retornou 200 ou 404;
- DELETE existente retornou 204;
- DELETE inexistente retornou 404;
- 204 não possui body;
- body de erro padrão ainda não foi definido;
- `ResponseEntity.of` e `ofNullable` foram apresentados sem esconder headers necessários;
- `ManagedRuntimeMessageServiceTest` foi criado;
- `RuntimeMessageResponseEntityWebMvcTest` foi criado;
- `ManagedRuntimeMessageControllerWebMvcTest` foi criado;
- `ManagedRuntimeMessageConditionalGetWebMvcTest` foi criado;
- `ResponseEntityBuildersTest` foi criado;
- `ResponseHeadersContractTest` foi criado;
- `NoBodyResponseContractTest` foi criado;
- `ManagedRuntimeMessageLiveServerIT` foi criado;
- fluxo live validou 201, 200, 304, 409, 204 e 404;
- Java `HttpClient` e porta aleatória foram usados;
- store foi limpo entre testes;
- `ResponseEntityArchitectureTest` foi criado;
- classes de aplicação não importam `org.springframework.http`;
- fixture 202 permaneceu em test source;
- records web não viraram beans;
- documentação de anatomia, builders, status, headers, Location, ETag, body, escolha de retorno e contratos foi criada;
- scripts foram criados;
- testes focados, builders, live, suite completa e package passaram;
- arquivo JSON temporário foi removido;
- nenhuma Bean Validation, ControllerAdvice, ProblemDetail, persistência, JPA, Flyway ou Security foi antecipada;
- DTOs da aula 367 não foram aprofundados;
- mappers da aula 368 não foram antecipados;
- ponte para a aula 367 está correta;
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
git commit -m "feat(m14): controlar status headers e body"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- arquivo JSON temporário;
- ETags capturadas;
- fixture 202 em produção;
- dados do store;
- validação antecipada.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a saída do controller deixou de depender apenas dos defaults do Spring MVC.

O mapa consolidado ficou:

```text
ResponseEntity:
status + headers + body.

HttpStatus:
códigos padrão.

HttpStatusCode:
abstração de status.

ok:
200.

created:
201 + Location.

accepted:
202.

noContent:
204.

notModified:
304.

badRequest:
400.

notFound:
404.

conflict:
409.

ETag:
versão da representação.

Last-Modified:
instante da alteração.

Cache-Control:
política de reutilização.
```

Você comprovou:

```text
200 com body;

201 com Location e body;

202 somente em fixture honesta;

204 sem body;

304 sem body;

400 sem body provisório;

404 sem body provisório;

409 sem body provisório;

headers customizados;

revalidação por ETag;

controller traduzindo outcomes;

service independente de HTTP.
```

A decisão central foi:

```text
ResponseEntity deve tornar explicitas
as decisoes do protocolo
sem transportar regras HTTP
para o service ou para o dominio.
```

A próxima aula será:

```text
367 - M14.12 - DTO request response
```

Nela, você continuará no mesmo projeto e estudará:

- DTO;
- request DTO;
- response DTO;
- modelo de domínio;
- modelo de aplicação;
- entidade;
- exposição acidental;
- contratos de entrada e saída;
- records;
- imutabilidade;
- nomes;
- versionamento;
- campos obrigatórios e opcionais;
- DTO específico por operação;
- over-posting;
- mass assignment;
- dados sensíveis;
- diferenças entre create, update e response;
- organização de packages;
- testes de contrato;
- evolução segura.

A aula 366 respondeu:

```text
como controlar status,
headers e body da resposta?
```

A aula 367 responderá:

```text
como desenhar objetos de transporte
sem expor o modelo interno da aplicacao?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei decompor `ResponseEntity` em status, headers e body.
- [ ] Sei escolher entre 200, 201, 202, 204, 304, 400, 404 e 409.
- [ ] Sei usar Location, ETag, Last-Modified e Cache-Control.
- [ ] Sei manter o service independente de HTTP.
- [ ] Sei quando um objeto direto é suficiente.

---

## Troubleshooting adicional

### Location nao aparece

Revise o builder `created` e a URI construída.

### ETag gera 500

Confirme aspas válidas no valor enviado ao builder.

### If-None-Match nao retorna 304

Compare exatamente a tag atual e a enviada.

### DELETE retorna body

Revise o tipo `ResponseEntity<Void>` e use `build()`.

### 202 entrou no runtime sem job

Remova o endpoint ou implemente processamento e acompanhamento reais.

### Service importa HttpStatus

Substitua por outcome de aplicação e mapeie no controller.

---

## Perguntas de revisao

1. O que `HttpEntity` representa?
2. O que `ResponseEntity` adiciona?
3. O que o tipo genérico representa?
4. Quando usar `ResponseEntity<Void>`?
5. Qual diferença entre `HttpStatus` e `HttpStatusCode`?
6. O que `ok()` cria?
7. O que `created()` exige?
8. Quando usar 202?
9. Quando usar 204?
10. 304 possui body?
11. Para que serve Location?
12. Para que serve ETag?
13. O que faz If-None-Match?
14. Qual diferença entre no-cache e no-store?
15. Para que serve Last-Modified?
16. Service deve retornar HttpStatus?
17. O que significa 409?
18. Quando retornar objeto direto?
19. Por que erros ainda não possuem body?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Headers e body.
2. Status.
3. Tipo do body.
4. Quando não existe body.
5. Enum conhecido versus abstração.
6. 200.
7. URI de Location.
8. Processamento aceito ainda não concluído.
9. Sucesso sem conteúdo.
10. Não.
11. Identificar o recurso ou acompanhamento.
12. Identificar a versão da representação.
13. Solicitar resposta apenas se mudou.
14. Revalidar versus não armazenar.
15. Informar instante da alteração.
16. Não.
17. Conflito com o estado atual.
18. Quando 200 sem headers extras basta.
19. O contrato de erros ainda será desenhado.
20. DTO request response.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 366 - M14.11 - ResponseEntity status headers body

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei `HttpEntity` de `ResponseEntity`.
- Entendi status, headers e body.
- Diferenciei `HttpStatus` de `HttpStatusCode`.
- Usei builders de `ResponseEntity`.
- Usei `ok`, `created`, `accepted`, `noContent`, `badRequest`, `notFound` e `status`.
- Diferenciei `body()` de `build()`.
- Usei `ResponseEntity<Void>` em respostas sem body.
- Usei constantes de `HttpHeaders`.
- Criei headers `X-Result-Count`, `X-Preview` e `X-Resource-Version`.
- Usei `Location` em uma criação real em memória.
- Mantive a prévia com status 200.
- Usei 201 somente quando um recurso foi criado.
- Mantive 202 em fixture porque não existe processamento assíncrono real.
- Usei 204 na exclusão.
- Usei 400 para entrada transitória inválida.
- Usei 404 para recurso inexistente.
- Usei 409 para duplicidade.
- Criei ETag estável por versão.
- Usei `If-None-Match`.
- Retornei 304 sem body.
- Usei `Last-Modified`.
- Diferenciei `no-cache` de `no-store`.
- Criei um store em memória somente para o laboratório.
- Mantive o service sem imports HTTP.
- Traduzi outcomes de aplicação no controller.
- Testei headers, status e bodies com MockMvc.
- Testei o fluxo completo com servidor real.
- Validei 201, 200, 304, 409, 204 e 404.
- Não criei body de erro definitivo.
- Não adicionei Bean Validation ou ControllerAdvice.
- Não aprofundei DTOs ou mappers.
- Próxima aula: DTO request response.
```

---

## Referencia tecnica curta

```text
ResponseEntity:
envelope.

HttpStatus:
status padrão.

Location:
recurso criado.

ETag:
versão.

Last-Modified:
instante.

Cache-Control:
cache.

body:
representação.

build:
sem body.

201:
created.

204:
no content.
```

Regra final:

```text
ResponseEntity deve ser usado quando o controller precisa controlar explicitamente status, headers ou ausencia de body; builders devem comunicar a semantica, 201 precisa identificar o recurso criado, 202 exige processamento realmente aceito, 204 e 304 nao devem carregar body, ETag e Last-Modified precisam ser estaveis, e o service deve retornar outcomes de aplicacao para que somente a camada web conheca HttpStatus, HttpHeaders e ResponseEntity.
```
