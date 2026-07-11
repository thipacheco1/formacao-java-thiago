# 375 - M14.20 - CRUD completo parte 1

## Apresentacao da aula

Nas aulas anteriores, você construiu separadamente quase todas as peças necessárias para uma API profissional.

O projeto já possui:

```text
Spring Boot;

controllers REST;

binding de path, query e body;

ResponseEntity;

DTOs de request e response;

mappers manuais;

Bean Validation;

validacoes customizadas;

service layer;

use cases;

transacoes;

repository port;

adapter Spring Data;

PostgreSQL;

Flyway;

Hibernate validate;

Testcontainers;

Exception Handler global;

Problem Details RFC 9457.
```

Cada tema foi estudado isoladamente para que sua responsabilidade ficasse clara.

Agora começa a consolidação.

A pergunta central desta aula será:

```text
como integrar todas essas camadas
na primeira metade
de um CRUD completo?
```

CRUD significa:

```text
Create;

Read;

Update;

Delete.
```

Nesta primeira parte, o foco será:

```text
Create;

Read by id;

Read collection.
```

O recurso principal será:

```text
managed runtime message.
```

A coleção será:

```text
/api/v1/runtime/managed-messages.
```

O item individual será:

```text
/api/v1/runtime/managed-messages/{id}.
```

Contratos trabalhados:

```text
POST /api/v1/runtime/managed-messages;

GET /api/v1/runtime/managed-messages/{id};

GET /api/v1/runtime/managed-messages.
```

O endpoint DELETE já criado continuará funcionando como teste de regressão.

Entretanto, ele não será redesenhado nesta aula.

A parte 2 revisará o restante do ciclo de vida.

Não serão adicionados ainda:

- PUT;
- PATCH;
- update command;
- replace semantics;
- partial update;
- optimistic locking de update;
- delete idempotency aprofundada;
- soft delete.

A aula 377 será dedicada especificamente a:

```text
PUT vs PATCH.
```

Portanto, não antecipe essa discussão.

A feature será organizada em torno de contratos completos por operação.

Create:

```text
CreateManagedRuntimeMessageRequest;

ManagedRuntimeMessageCreateCommand;

ManagedRuntimeMessage;

ManagedRuntimeMessageCreatedResponse.
```

Read by id:

```text
long id;

ManagedRuntimeMessage;

ManagedRuntimeMessageDetailResponse.
```

Read collection:

```text
ManagedRuntimeMessageListQuery;

ManagedRuntimeMessageSearchCriteria;

ManagedRuntimeMessagePage;

ManagedRuntimeMessageSummaryResponse;

ManagedRuntimeMessagePageResponse.
```

A camada web receberá parâmetros HTTP.

O web mapper criará uma query de aplicação.

O application service validará limites dependentes do caso de uso.

O repository port receberá critérios próprios.

O adapter Spring Data criará:

```text
PageRequest;

Sort;

Page.
```

Depois converterá o resultado para uma abstração da aplicação.

O controller não receberá:

- `Pageable`;
- `Page`;
- `Sort`;
- `JpaRepository`;
- entity JPA.

O application service também não conhecerá esses tipos.

A paginação pública utilizará:

```text
page:
indice iniciado em zero.

size:
quantidade por pagina.

sort:
campo permitido.

direction:
asc ou desc.

value:
filtro textual opcional.
```

Valores padrão:

```text
page:
0.

size:
20.

sort:
createdAt.

direction:
desc.
```

Limites:

```text
page:
zero ou positivo.

size:
entre 1 e 50.

value:
ate 120 caracteres.
```

Campos permitidos para ordenação:

```text
id;

value;

createdAt.
```

O cliente não poderá fornecer diretamente qualquer nome de property da entity.

Isso evita:

- erro por property inexistente;
- exposição da estrutura interna;
- acoplamento ao mapping;
- comportamento imprevisível;
- abuso de ordenações caras.

A resposta de coleção conterá:

```text
content;

page;

size;

totalElements;

totalPages;

first;

last;

sort;

direction;

filter.
```

Headers:

```text
X-Total-Count;

X-Total-Pages;

Link.
```

O header `Link` poderá conter:

```text
first;

prev;

next;

last.
```

Somente links aplicáveis serão produzidos.

A resposta de item continuará utilizando:

- ETag;
- Last-Modified;
- Cache-Control;
- conditional GET;
- 304 sem body.

A criação continuará utilizando:

- 201;
- `Location`;
- ETag;
- Last-Modified;
- response body.

Todas as falhas continuarão utilizando:

```text
ProblemDetail;

application/problem+json;

code;

correlationId;

violations.
```

Esta aula não criará um segundo projeto.

O laboratório permanece em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
376 - M14.21 - CRUD completo parte 2
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
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

377:
PUT vs PATCH.
```

A aula 374 respondeu:

```text
como publicar erros
em um formato interoperavel,
seguro e estavel?
```

A aula 375 responderá:

```text
como integrar web, aplicacao,
persistencia, validacao e erros
em create, read e list?
```

Nesta aula:

```text
POST create:
sim.

GET by id:
sim.

GET collection:
sim.

pagination HTTP:
sim.

sorting whitelist:
sim.

filtro textual:
sim.

DTO summary:
sim.

page response:
sim.

custom application page:
sim.

Spring Data Page:
somente infrastructure.

Problem Details:
integrado.

conditional GET:
preservado.

PUT:
nao.

PATCH:
nao.

update:
nao.

delete redesign:
nao.
```

A regra central será:

```text
cada operacao deve atravessar
as camadas por contratos proprios,
sem permitir que detalhes HTTP
ou Spring Data vazem para a aplicacao.
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
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageUseCases.java
│       ├── ManagedRuntimeMessageApplicationService.java
│       ├── query
│       │   └── ManagedRuntimeMessageListQuery.java
│       ├── result
│       │   ├── ManagedRuntimeMessagePage.java
│       │   └── ManagedRuntimeMessageSort.java
│       └── port
│           ├── ManagedRuntimeMessageRepositoryPort.java
│           └── ManagedRuntimeMessageSearchCriteria.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── adapter
│           │   └── SpringDataManagedRuntimeMessageRepositoryAdapter.java
│           └── repository
│               └── ManagedRuntimeMessageSpringDataRepository.java
└── web
    ├── controller
    │   └── ManagedRuntimeMessageController.java
    ├── mapper
    │   └── ManagedRuntimeMessageWebMapper.java
    ├── pagination
    │   └── PaginationLinkBuilder.java
    └── response
        ├── ManagedRuntimeMessageSummaryResponse.java
        └── ManagedRuntimeMessagePageResponse.java
```

Testes novos:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageCreateUseCaseTest.java
│       ├── ManagedRuntimeMessageGetUseCaseTest.java
│       ├── ManagedRuntimeMessageListUseCaseTest.java
│       └── ManagedRuntimeMessageListQueryTest.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── ManagedRuntimeMessageSearchRepositoryTest.java
│           └── ManagedRuntimeMessageSearchAdapterTest.java
└── web
    ├── ManagedRuntimeMessageCreateWebMvcTest.java
    ├── ManagedRuntimeMessageGetWebMvcTest.java
    ├── ManagedRuntimeMessageListWebMvcTest.java
    ├── ManagedRuntimeMessagePaginationLinkTest.java
    ├── ManagedRuntimeMessageCrudPartOneContractTest.java
    ├── ManagedRuntimeMessageCrudPartOneArchitectureTest.java
    └── ManagedRuntimeMessageCrudPartOneLiveServerIT.java
```

Documentação:

```text
docs
├── crud-resource-contract.md
├── create-resource-contract.md
├── read-resource-contract.md
├── collection-resource-contract.md
├── http-pagination-contract.md
├── pagination-link-header.md
├── sorting-whitelist.md
├── filtering-contract.md
├── application-page-model.md
├── crud-part-one-test-strategy.md
└── crud-part-one-baseline.md
```

Scripts:

```text
scripts
├── 105_criar_managed_message.ps1
├── 106_consultar_managed_message.ps1
├── 107_listar_managed_messages.ps1
├── 108_testar_paginacao_managed_messages.ps1
├── 109_testar_filtro_e_ordenacao.ps1
└── 110_executar_testes_crud_parte_1.ps1
```

Resultados esperados:

```text
POST valido:
201.

POST duplicado:
409 Problem Detail.

GET existente:
200.

GET condicional:
304.

GET ausente:
404 Problem Detail.

GET collection:
200.

page default:
0.

size default:
20.

sort default:
createdAt desc.

size 0:
400 Problem Detail.

size 51:
400 Problem Detail.

page negativa:
400 Problem Detail.

sort desconhecido:
400 Problem Detail.

filtro:
case-insensitive normalizado.

content:
summary DTO.

Page Spring Data na application:
zero.

Pageable no controller:
zero.

JpaEntity na web:
zero.
```

---

## Conceito essencial

### CRUD como integracao

CRUD não é apenas declarar quatro métodos.

Uma operação profissional precisa integrar:

- contrato HTTP;
- DTO;
- validação;
- mapping;
- caso de uso;
- transação;
- repository;
- banco;
- resposta;
- erro;
- testes.

Nesta aula, create e read serão tratados como fluxos completos.

---

### Recurso e colecao

O item:

```text
/api/v1/runtime/managed-messages/{id}
```

representa um recurso individual.

A coleção:

```text
/api/v1/runtime/managed-messages
```

representa o conjunto consultável.

POST atua sobre a coleção para criar um novo membro.

GET na coleção consulta membros.

GET no item consulta uma identidade.

---

### Create profissional

Create começa com:

```text
request DTO.
```

A request contém somente dados controlados pelo cliente.

O command representa a intenção do caso de uso.

O domínio gera regras e estado inicial.

O repository persiste.

A response publica somente campos permitidos.

O controller acrescenta semântica HTTP.

---

### Read by id

A leitura por id utiliza:

```text
@PathVariable;

@Positive;

application service read-only;

repository Optional;

exception not found;

Problem Detail 404.
```

O controller não ramifica `Optional`.

A ausência é expressa por exception de aplicação.

---

### Collection read

Uma coleção precisa de um contrato previsível.

Retornar todos os registros sem limite é inadequado.

Problemas:

- payload crescente;
- memória;
- latência;
- tempo de banco;
- abuso;
- indisponibilidade;
- experiência ruim do cliente.

Por isso, a listagem será paginada desde a primeira versão pública.

---

### Pagination model da aplicacao

A camada de aplicação não deve importar:

```java
org.springframework.data.domain.Page
```

Crie um resultado próprio:

```java
public record ManagedRuntimeMessagePage(
        List<ManagedRuntimeMessage> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        ManagedRuntimeMessageSort sort,
        String filter
) {
}
```

A lista deve ser imutável.

---

### Query da aplicacao

A query representa a intenção:

```java
public record ManagedRuntimeMessageListQuery(
        int page,
        int size,
        ManagedRuntimeMessageSort sort,
        String valueContains
) {
}
```

Ela não possui annotations MVC.

Ela não conhece `PageRequest`.

---

### Search criteria do port

O port pode usar um tipo próprio:

```java
public record ManagedRuntimeMessageSearchCriteria(
        int page,
        int size,
        ManagedRuntimeMessageSort sort,
        String normalizedValueContains
) {
}
```

A aplicação converte query para criteria.

O adapter converte criteria para Spring Data.

---

### Sort model

Crie enums de aplicação.

Exemplo:

```java
public enum ManagedRuntimeMessageSortField {
    ID,
    VALUE,
    CREATED_AT
}
```

Direção:

```java
public enum ManagedRuntimeMessageSortDirection {
    ASC,
    DESC
}
```

Ou um record `ManagedRuntimeMessageSort`.

Nenhum valor contém diretamente o nome da property JPA.

---

### Whitelist

O web mapper converte:

```text
id:
ID.

value:
VALUE.

createdAt:
CREATED_AT.
```

Qualquer outro valor gera uma exception de entrada reconhecida ou violation adequada.

Não faça:

```java
Sort.by(
        sortFromRequest
)
```

diretamente.

---

### Mapping para property JPA

Somente o adapter conhece:

```text
ID:
id.

VALUE:
value.

CREATED_AT:
createdAt.
```

Se a entity mudar, a aplicação não precisa mudar.

O mapping de campo de ordenação pertence à infraestrutura.

---

### PageRequest

No adapter:

```java
PageRequest.of(
        criteria.page(),
        criteria.size(),
        toSpringSort(
                criteria.sort()
        )
);
```

Valide os limites antes de chegar ao adapter.

O repository não deve receber páginas negativas.

---

### Filtro textual

A API aceitará:

```text
value.
```

O filtro será:

- opcional;
- limitado a 120;
- normalizado;
- case-insensitive;
- aplicado sobre `normalizedValue`.

Não aceite regex do cliente.

Não monte `%` manual em string SQL.

---

### Derived query paginada

Repository:

```java
Page<ManagedRuntimeMessageJpaEntity>
        findByNormalizedValueContaining(
                String normalizedValue,
                Pageable pageable
        );
```

Spring Data cria a query.

Quando o filtro está ausente, use:

```text
findAll(pageable).
```

---

### Page mapping

O adapter converte:

```text
Page<JpaEntity>
    -> ManagedRuntimeMessagePage.
```

Mapeie:

- content;
- number;
- size;
- totalElements;
- totalPages;
- first;
- last;
- sort conhecido;
- filter.

Não retorne o objeto `Page` para a application service.

---

### Summary response

A listagem não precisa publicar todos os detalhes.

Crie:

```java
public record ManagedRuntimeMessageSummaryResponse(
        long id,
        String value,
        Instant createdAt
) {
}
```

A versão pode permanecer no detail response e nos headers.

A summary reduz acoplamento e payload.

---

### Page response

Crie:

```java
public record ManagedRuntimeMessagePageResponse(
        List<ManagedRuntimeMessageSummaryResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        String sort,
        String direction,
        String filter
) {
}
```

A lista deve ser imutável.

---

### Metadata no body

A metadata no body permite que clientes:

- renderizem paginação;
- conheçam totais;
- saibam primeira e última página;
- preservem filtros.

Ela funciona mesmo quando intermediários removem headers customizados.

---

### X-Total-Count

Header:

```text
X-Total-Count.
```

Ele fornece acesso rápido ao total.

O body continua sendo a fonte completa da paginação.

Não use o header como única forma de metadata.

---

### Link header

Formato conceitual:

```http
Link: </api/v1/runtime/managed-messages?page=0&size=20>; rel="first",
      </api/v1/runtime/managed-messages?page=1&size=20>; rel="next",
      </api/v1/runtime/managed-messages?page=4&size=20>; rel="last"
```

Cada URI deve preservar:

- size;
- sort;
- direction;
- filter.

---

### first, prev, next e last

Regras:

```text
first:
sempre quando existe uma pagina valida.

prev:
quando page > 0.

next:
quando page + 1 < totalPages.

last:
quando totalPages > 0.
```

Coleção vazia exige uma política.

A baseline produzirá somente `first` para page zero vazia e não inventará last negativo.

Documente a decisão.

---

### URI construction

Use:

```text
UriComponentsBuilder.
```

Não concatene query string manualmente.

Isso preserva encoding do filtro.

O builder da paginação pertence à web.

---

### Page index

A API utilizará índice iniciado em zero.

É a convenção interna do Spring Data.

A escolha precisa ser documentada.

Clientes não devem assumir índice iniciado em um.

---

### Size limit

O limite 50 protege a API.

Use Bean Validation:

```java
@Min(1)
@Max(50)
```

O application service também pode proteger invariantes caso seja chamado fora da web.

Validation da web não é a única barreira da aplicação.

---

### Default values

No controller:

```java
@RequestParam(
        defaultValue = "0"
)
int page
```

e:

```java
@RequestParam(
        defaultValue = "20"
)
int size
```

Defaults precisam aparecer na documentação e nos testes.

---

### ETag no item

O GET individual continua utilizando:

```text
If-None-Match.
```

A listagem não receberá ETag nesta aula.

Uma coleção muda com frequência e exige uma estratégia de versionamento própria.

Não crie hash do conteúdo inteiro sem necessidade.

---

### Last-Modified

O item individual usa `createdAt` enquanto não existe update.

Na parte 2, a feature poderá introduzir `updatedAt`.

Não antecipe a migration nesta aula.

---

### Location

A criação devolve:

```text
Location:
URI do GET individual.
```

O link não aponta para a coleção.

O cliente pode usar a URI imediatamente.

---

### Problem Details integrado

Exemplos:

```text
duplicidade:
409 resource_conflict.

id ausente:
404 resource_not_found.

page negativa:
400 validation_failed.

sort desconhecido:
400 invalid_request.
```

O controller não cria `ProblemDetail`.

O advice global continua responsável.

---

### Transacoes

Create:

```text
read-write.
```

Get e list:

```text
read-only.
```

O método list deve permanecer curto.

Não realize serialização dentro da transação.

O service retorna o modelo de aplicação.

A web serializa depois.

---

### Consistencia de pagina

Em bancos concorrentes, total e conteúdo podem mudar entre requests.

A paginação não representa snapshot permanente.

O cliente precisa tolerar:

- itens novos;
- itens removidos;
- mudança de total;
- última página diferente.

Não prometa consistência imutável entre páginas.

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

Docker precisa estar ativo.

---

### 2. Criar ManagedRuntimeMessageSortField

Valores:

```text
ID;

VALUE;

CREATED_AT.
```

Método de parsing não conhece JPA.

Ele recebe o valor público.

---

### 3. Criar ManagedRuntimeMessageSortDirection

Valores:

```text
ASC;

DESC.
```

Parsing case-insensitive.

Valor inválido gera exception de aplicação de entrada ou `IllegalArgumentException` traduzida para 400 pelo mapper da web.

Prefira uma exception explícita.

---

### 4. Criar ManagedRuntimeMessageSort

Record:

```text
field;

direction.
```

Ambos obrigatórios.

---

### 5. Criar ManagedRuntimeMessageListQuery

Campos:

```text
page;

size;

sort;

valueContains.
```

Invariantes:

- page >= 0;
- size entre 1 e 50;
- filter normalizado para null quando blank;
- filter máximo 120.

---

### 6. Criar ManagedRuntimeMessageSearchCriteria

O tipo pertence à porta.

Use:

```text
normalizedValueContains.
```

Não reutilize request params.

---

### 7. Criar ManagedRuntimeMessagePage

Copie `content` defensivamente.

Valide:

- page não negativo;
- size positivo;
- totalElements não negativo;
- totalPages não negativo;
- content não maior que size;
- sort não nulo.

Não execute regra HTTP.

---

### 8. Evoluir input port

Adicione:

```java
ManagedRuntimeMessagePage list(
        ManagedRuntimeMessageListQuery query
);
```

Mantenha create, get e delete existentes.

---

### 9. Evoluir repository port

Adicione:

```java
ManagedRuntimeMessagePage search(
        ManagedRuntimeMessageSearchCriteria criteria
);
```

Nenhum import Spring Data.

---

### 10. Evoluir application service

Método:

```java
@Override
@Transactional(
        readOnly = true
)
public ManagedRuntimeMessagePage list(
        ManagedRuntimeMessageListQuery query
) {
}
```

Converta query para criteria.

Normalize filtro com a mesma política da criação.

Delegue ao port.

---

### 11. Evoluir Spring Data repository

Adicione:

```java
Page<ManagedRuntimeMessageJpaEntity>
        findByNormalizedValueContaining(
                String normalizedValue,
                Pageable pageable
        );
```

Não adicione query nativa.

---

### 12. Mapear sort no adapter

Método privado:

```java
private Sort toSpringSort(
        ManagedRuntimeMessageSort sort
) {
}
```

Switch explícito.

Não use `enum.name()` como property.

---

### 13. Implementar search no adapter

Crie `PageRequest`.

Quando filter null:

```text
repository.findAll(pageable).
```

Quando presente:

```text
findByNormalizedValueContaining.
```

Mapeie content com persistence mapper.

---

### 14. Criar summary response

Campos:

```text
id;

value;

createdAt.
```

Sem version.

Sem normalized value.

Sem entity.

---

### 15. Criar page response

Campos definidos no contrato.

Copie a lista.

Não use `Page` como component.

---

### 16. Evoluir web mapper

Adicione:

```text
toListQuery;

toSummaryResponse;

toPageResponse.
```

Parsing de sort público permanece na web.

A application recebe enum válido.

---

### 17. Criar exception de sort invalido

Exemplo:

```text
ManagedRuntimeMessageInvalidSortException.
```

Ela pertence à application ou a um package comum de entrada.

Não importa HTTP.

O handler global mapeia para 400 `invalid_request`.

---

### 18. Criar PaginationLinkBuilder

Receba:

- request atual;
- page result;
- sort público;
- direction;
- filter.

Retorne:

```text
String ou List<String>.
```

Use `UriComponentsBuilder`.

---

### 19. Criar GET collection

Mapping:

```java
@GetMapping
```

Parâmetros:

```text
page;

size;

sort;

direction;

value.
```

Constraints:

- `@PositiveOrZero` em page;
- `@Min` e `@Max` em size;
- `@Size(max=120)` em value.

---

### 20. Construir response collection

Fluxo:

1. mapper cria query;
2. use case list;
3. mapper cria page response;
4. link builder cria links;
5. ResponseEntity 200;
6. headers totais;
7. body.

---

### 21. Preservar create

Revise o POST.

Confirme:

- `@Valid`;
- mapper;
- use case;
- 201;
- Location;
- ETag;
- Last-Modified;
- body created response;
- duplicate via Problem Details.

---

### 22. Preservar get by id

Confirme:

- id positivo;
- service read-only;
- not found exception;
- 200;
- 304;
- ETag;
- Last-Modified;
- detail response.

---

### 23. Manter delete como regressao

Não altere o contrato nesta aula.

Execute os testes existentes.

Registre que ele será revisitado na parte 2.

---

### 24. Criar testes de query

Teste sem Spring:

- defaults montados pelo mapper;
- page zero;
- size 20;
- sort createdAt desc;
- filtro blank vira null;
- filtro normalizado;
- page negativa rejeitada;
- size inválido rejeitado.

---

### 25. Criar teste do create use case

Use repository port fake.

Valide:

- normalização;
- draft;
- save;
- result;
- conflito;
- transação por metadata;
- nenhum tipo web.

---

### 26. Criar teste do get use case

Valide:

- modelo encontrado;
- not found exception;
- port chamado uma vez;
- método read-only.

---

### 27. Criar teste do list use case

Valide:

- query convertida;
- filter normalizado;
- criteria correto;
- page preservada;
- port chamado;
- read-only.

---

### 28. Criar repository search test

Com PostgreSQLContainer:

- inserir cinco itens;
- consultar page zero size dois;
- consultar page um;
- ordenar createdAt desc;
- ordenar value asc;
- filtrar por substring;
- filtro sem match.

---

### 29. Limpar persistence context

Antes das consultas, use:

```text
flush;

clear.
```

Evite validar somente objetos em memória.

---

### 30. Criar adapter search test

Mock ou integração.

Valide:

- sort mapping;
- property names;
- filter route;
- no-filter route;
- Page convertido;
- entity não vaza.

---

### 31. Criar create WebMvcTest

Valide:

- payload;
- 201;
- Location;
- ETag;
- body;
- correlation id;
- duplicate Problem Detail.

Use mapper real e use case mock.

---

### 32. Criar get WebMvcTest

Valide:

- 200;
- detail;
- ETag;
- 304;
- 404 Problem Detail;
- id inválido 400.

---

### 33. Criar list WebMvcTest

Cenários:

- sem params;
- page e size;
- sort id asc;
- sort value desc;
- filter;
- coleção vazia;
- primeira;
- intermediária;
- última.

Valide body e headers.

---

### 34. Criar PaginationLinkTest

Teste isolado.

Cenários:

- página vazia;
- primeira;
- intermediária;
- última;
- uma página;
- filtro com espaço;
- sort e direction preservados.

Não dependa da ordem dos parâmetros na string inteira quando não for necessário.

---

### 35. Criar ContractTest

Valide JSON estrutural:

Create response:

```text
id, value, createdAt, version.
```

Detail response:

```text
id, value, createdAt, version.
```

Summary:

```text
id, value, createdAt.
```

Page response:

```text
content e metadata.
```

---

### 36. Criar ArchitectureTest

Valide:

- controller sem `Pageable`;
- application sem `Page`;
- port sem Spring Data;
- response sem entity;
- sort whitelist explícita;
- adapter é único lugar com PageRequest;
- web é único lugar com query params;
- zero PUT;
- zero PATCH;
- delete não foi redesenhado;
- ProblemDetail permanece global.

---

### 37. Criar teste live

Use:

```text
RANDOM_PORT;

PostgreSQLContainer;

@ServiceConnection.
```

Fluxo:

1. criar cinco mensagens;
2. consultar primeira página;
3. seguir next link;
4. filtrar;
5. ordenar;
6. consultar item;
7. usar If-None-Match;
8. consultar id ausente;
9. criar duplicada.

---

### 38. Validar banco real

Após o fluxo:

```sql
select id,
       value,
       normalized_value,
       created_at,
       version
from managed_runtime_message
order by id;
```

Confirme quantidade e valores.

---

### 39. Criar documentacao

`crud-resource-contract.md` define resource e collection.

`create-resource-contract.md` documenta POST.

`read-resource-contract.md` documenta GET individual.

`collection-resource-contract.md` documenta GET collection.

`http-pagination-contract.md` documenta params e metadata.

`pagination-link-header.md` documenta relations.

`sorting-whitelist.md` documenta campos permitidos.

`filtering-contract.md` documenta value.

`application-page-model.md` explica por que Page não vaza.

`crud-part-one-test-strategy.md` relaciona camadas e testes.

`crud-part-one-baseline.md` consolida exemplos.

---

### 40. Criar scripts

`105_criar_managed_message.ps1` cria e captura Location.

`106_consultar_managed_message.ps1` consulta e testa ETag.

`107_listar_managed_messages.ps1` lista defaults.

`108_testar_paginacao_managed_messages.ps1` percorre links.

`109_testar_filtro_e_ordenacao.ps1` testa whitelist e encoding.

`110_executar_testes_crud_parte_1.ps1` executa a suite.

---

### 41. Executar unit tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageCreateUseCaseTest,ManagedRuntimeMessageGetUseCaseTest,ManagedRuntimeMessageListUseCaseTest,ManagedRuntimeMessageListQueryTest test
```

---

### 42. Executar repository tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSearchRepositoryTest,ManagedRuntimeMessageSearchAdapterTest test
```

Docker precisa estar ativo.

---

### 43. Executar WebMvc tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageCreateWebMvcTest,ManagedRuntimeMessageGetWebMvcTest,ManagedRuntimeMessageListWebMvcTest test
```

---

### 44. Executar contract e architecture

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePaginationLinkTest,ManagedRuntimeMessageCrudPartOneContractTest,ManagedRuntimeMessageCrudPartOneArchitectureTest test
```

---

### 45. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageCrudPartOneLiveServerIT test
```

---

### 46. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 47. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 48. Revisar escopo

Confirme:

```text
POST:
completo.

GET by id:
completo.

GET collection:
completo.

pagination:
completa para parte 1.

sorting whitelist:
presente.

filter:
presente.

Page na application:
zero.

Pageable no controller:
zero.

PUT:
zero.

PATCH:
zero.

update:
zero.
```

---

### 49. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- logs;
- dump;
- ids capturados;
- link temporário;
- payload;
- PUT;
- PATCH;
- migration não necessária.

---

## Entendendo o que foi feito

### Create virou um fluxo completo

Request, validation, mapper, transaction, repository, response e error contract trabalham juntos.

### Read individual preservou cache HTTP

ETag e conditional GET continuam válidos.

### A colecao nasceu paginada

A API não expõe uma listagem ilimitada.

### Spring Data ficou na infraestrutura

Page, Pageable e Sort não vazaram para aplicação ou web.

### Links tornaram a navegacao explicita

O cliente pode percorrer páginas sem reconstruir URIs manualmente.

---

## Erros comuns importantes

### Receber Pageable no controller

Detalhes do framework passam a fazer parte do contrato público.

### Repassar sort diretamente

O cliente pode depender de properties internas ou provocar erro.

### Retornar entity na lista

A infraestrutura relacional vaza para o JSON.

### Esquecer filtro nos links

O next link muda o conjunto consultado.

### Retornar todos os registros

O endpoint degrada conforme os dados crescem.

---

## Comandos uteis

### Criar

```powershell
.\scripts\105_criar_managed_message.ps1 `
  -Value "crud parte um"
```

### Consultar

```powershell
.\scripts\106_consultar_managed_message.ps1 `
  -Id 1
```

### Listar

```powershell
.\scripts\107_listar_managed_messages.ps1
```

### Paginar

```powershell
.\scripts\108_testar_paginacao_managed_messages.ps1 `
  -Size 2
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Novo sort publico

Adicione temporariamente:

```text
version.
```

Analise se summary deveria publicar esse conceito.

Remova antes do commit se não houver necessidade.

### Parte 2 — Filtro vazio

Compare:

```text
value ausente;

value vazio;

value com espacos.
```

Confirme a mesma semântica documentada.

### Parte 3 — Pagina acima do total

Consulte page 999.

Defina e teste:

```text
200 com content vazio.
```

Não transforme automaticamente em 404.

### Parte 4 — Size maxima

Teste 50 e 51.

Confirme 50 aceito e 51 Problem Detail.

### Parte 5 — Encoding

Use filtro:

```text
spring mvc.
```

Confirme links codificados.

### Parte 6 — Concorrencia

Insira um item entre page zero e page um.

Observe mudança possível no resultado.

Documente que paginação não é snapshot.

### Parte 7 — Page leakage

Retorne `Page` de fixture pelo input port.

Faça o teste arquitetural falhar.

Restaure.

### Parte 8 — ADR

Registre:

```text
CRUD parte 1 cobre create e read;

colecao paginada desde v1;

page index iniciado em zero;

size maxima 50;

sort por whitelist;

filter normalizado;

Page e Pageable restritos a infrastructure;

links preservam todos os parametros;

Problem Details integrado.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 374 foi preservada;
- o mesmo projeto foi continuado;
- o recurso principal foi definido;
- item e coleção foram diferenciados;
- POST atua sobre a coleção;
- GET individual usa identidade no path;
- GET collection foi criado;
- create foi integrado de ponta a ponta;
- read by id foi integrado de ponta a ponta;
- read collection foi integrado de ponta a ponta;
- DELETE permaneceu apenas como regressão;
- PUT não foi criado;
- PATCH não foi criado;
- update não foi antecipado;
- request DTO de criação permaneceu específico;
- created response permaneceu específico;
- detail response permaneceu específico;
- summary response foi criado;
- page response foi criado;
- summary não expõe normalized value;
- summary não expõe entity;
- application query foi criada;
- application page foi criada;
- search criteria do port foi criado;
- sort model foi criado;
- enums não dependem de property JPA;
- application não importa `Page`;
- application não importa `Pageable`;
- controller não recebe `Pageable`;
- repository port não importa Spring Data;
- adapter converte criteria para `PageRequest`;
- adapter converte `Page` para page da aplicação;
- mapping de sort é explícito;
- whitelist contém id, value e createdAt;
- sort desconhecido retorna 400;
- direction é case-insensitive;
- page default é zero;
- size default é 20;
- sort default é createdAt;
- direction default é desc;
- page aceita zero;
- page negativa é inválida;
- size aceita 1 a 50;
- size 0 é inválido;
- size 51 é inválido;
- filtro é opcional;
- filtro blank vira ausente;
- filtro máximo é 120;
- filtro é normalizado;
- filtro usa normalized value;
- derived query paginada foi criada;
- repository sem filtro usa findAll;
- repository com filtro usa query específica;
- nenhuma query nativa foi necessária;
- content é imutável;
- metadata contém page, size, totals, first e last;
- body contém sort e direction;
- body preserva filter;
- `X-Total-Count` foi criado;
- `X-Total-Pages` foi criado;
- `Link` foi criado;
- first link foi criado;
- prev link aparece quando aplicável;
- next link aparece quando aplicável;
- last link aparece quando aplicável;
- coleção vazia possui política documentada;
- links preservam page size sort direction e filter;
- links usam `UriComponentsBuilder`;
- encoding foi testado;
- create retorna 201;
- create retorna Location;
- create retorna ETag;
- create retorna Last-Modified;
- duplicate retorna 409 Problem Detail;
- get existente retorna 200;
- get condicional retorna 304;
- get ausente retorna 404 Problem Detail;
- list retorna 200;
- validações de paginação usam Problem Details;
- controller não cria ProblemDetail;
- create e delete são read-write;
- get e list são read-only;
- serialização ocorre fora da regra de negócio;
- consistência entre páginas foi documentada;
- `ManagedRuntimeMessageCreateUseCaseTest` foi criado;
- `ManagedRuntimeMessageGetUseCaseTest` foi criado;
- `ManagedRuntimeMessageListUseCaseTest` foi criado;
- `ManagedRuntimeMessageListQueryTest` foi criado;
- `ManagedRuntimeMessageSearchRepositoryTest` foi criado;
- persistence context foi limpo nos testes;
- paginação e sorting foram validados no PostgreSQL;
- filtro foi validado no PostgreSQL;
- `ManagedRuntimeMessageSearchAdapterTest` foi criado;
- `ManagedRuntimeMessageCreateWebMvcTest` foi criado;
- `ManagedRuntimeMessageGetWebMvcTest` foi criado;
- `ManagedRuntimeMessageListWebMvcTest` foi criado;
- `ManagedRuntimeMessagePaginationLinkTest` foi criado;
- `ManagedRuntimeMessageCrudPartOneContractTest` foi criado;
- contratos JSON são específicos por operação;
- `ManagedRuntimeMessageCrudPartOneArchitectureTest` foi criado;
- Spring Data ficou na infraestrutura;
- web não expõe JPA entity;
- `ManagedRuntimeMessageCrudPartOneLiveServerIT` foi criado;
- teste live usou PostgreSQL real;
- create, page, filter, sort, conditional GET, 404 e 409 foram exercitados;
- documentação completa foi criada;
- scripts foram criados;
- testes unitários, repository, MVC, contract, architecture, live, suite e package passaram;
- nenhum PUT, PATCH, update, soft delete, OpenAPI, Security ou cache de coleção foi antecipado;
- ponte para a aula 376 está correta;
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
git commit -m "feat(m14): consolidar crud parte um"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- dump;
- ids capturados;
- payloads;
- PUT;
- PATCH;
- migration desnecessária.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você integrou as camadas construídas ao longo do módulo.

O fluxo de criação ficou:

```text
POST;

request DTO;

validation;

web mapper;

create command;

application service;

transaction;

repository port;

Spring Data adapter;

PostgreSQL;

created response;

201 e Location.
```

O fluxo de leitura ficou:

```text
GET item:
detail, ETag e 304.

GET collection:
query, criteria, PageRequest,
page da aplicacao, summary DTO,
metadata e Link header.
```

Você comprovou:

```text
create completo;

read by id completo;

listagem paginada;

sorting por whitelist;

filtro;

Problem Details;

PostgreSQL real;

camadas protegidas;

contratos especificos.
```

A decisão central foi:

```text
um CRUD profissional integra
contratos, regras, persistencia,
HTTP e testes
sem vazar frameworks entre camadas.
```

A próxima aula será:

```text
376 - M14.21 - CRUD completo parte 2
```

Nela, você continuará no mesmo projeto e estudará:

- segunda metade do ciclo CRUD;
- atualização completa do recurso;
- delete revisitado;
- commands de atualização;
- response após update;
- versionamento otimista;
- `If-Match`;
- preconditions;
- 412 Precondition Failed;
- 428 Precondition Required;
- not found;
- conflict;
- idempotência;
- transações;
- repository update;
- migration para updatedAt;
- mappers;
- Problem Details;
- testes concorrentes;
- fechamento do CRUD completo.

A aula 375 respondeu:

```text
como integrar create,
read by id e listagem
em um CRUD profissional?
```

A aula 376 responderá:

```text
como completar o ciclo de vida
com atualizacao, exclusao
e controle de concorrencia?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei modelar item e coleção como recursos diferentes.
- [ ] Sei impedir vazamento de Page e Pageable.
- [ ] Sei criar paginação, filtro e sorting por whitelist.
- [ ] Sei construir Link headers preservando parâmetros.
- [ ] Sei integrar create, read e Problem Details de ponta a ponta.

---

## Troubleshooting adicional

### Sort valido gera property error

Revise o mapping explícito no adapter.

### Link perde filtro

Confirme que todos os parâmetros são reaplicados pelo builder.

### Page response serializa entity

Revise persistence mapper e web mapper.

### Collection retorna todos os dados

Confirme que o repository usa `Pageable`.

### Filtro com espaco quebra URI

Use `UriComponentsBuilder`, não concatenação.

### Page 999 retorna 404

A baseline define collection page vazia com 200.

---

## Perguntas de revisao

1. O que CRUD significa?
2. Quais operações fazem parte da aula 375?
3. Qual é a collection URI?
4. Onde o POST é aplicado?
5. O que representa o GET individual?
6. Por que paginar desde a primeira versão?
7. Application pode retornar Spring Data Page?
8. Controller deve receber Pageable?
9. Onde PageRequest é criado?
10. O que é sorting whitelist?
11. Quais campos são permitidos?
12. Qual page default?
13. Qual size default?
14. Qual size máxima?
15. O que contém o summary response?
16. Para que serve o Link header?
17. O filtro precisa ser preservado nos links?
18. Qual status de page acima do total?
19. PUT foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Create, Read, Update e Delete.
2. Create e Read.
3. `/api/v1/runtime/managed-messages`.
4. Na coleção.
5. Um recurso identificado.
6. Para controlar volume e latência.
7. Não.
8. Não.
9. No adapter.
10. Campos públicos permitidos.
11. Id, value e createdAt.
12. Zero.
13. Vinte.
14. Cinquenta.
15. Id, value e createdAt.
16. Navegação de páginas.
17. Sim.
18. 200 com content vazio.
19. Não.
20. CRUD completo parte 2.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 375 - M14.20 - CRUD completo parte 1

- Continuei no projeto `formacao-java-backend-api`.
- Consolidei a primeira metade de um CRUD profissional.
- Defini o recurso individual e a coleção.
- Mantive POST na coleção.
- Consolidei create de ponta a ponta.
- Consolidei GET por id.
- Preservei ETag, Last-Modified e conditional GET.
- Criei GET de coleção.
- Adotei paginação desde a primeira versão.
- Usei page iniciada em zero.
- Defini size padrão 20 e máximo 50.
- Criei sorting por whitelist.
- Permiti id, value e createdAt.
- Impedi nomes arbitrários de properties.
- Criei filtro textual opcional.
- Normalizei o filtro.
- Criei query de aplicação.
- Criei search criteria do port.
- Criei page model próprio da aplicação.
- Mantive Page, Pageable e Sort na infraestrutura.
- Criei summary response.
- Criei page response com metadata.
- Adicionei X-Total-Count e X-Total-Pages.
- Criei Link header com first, prev, next e last.
- Preservei filtros e ordenação nos links.
- Usei UriComponentsBuilder para encoding.
- Mantive Problem Details integrado.
- Mantive transactions read-only nas consultas.
- Testei paginação e filtro no PostgreSQL real.
- Testei create, GET, list, 304, 404 e 409.
- Mantive DELETE somente como regressão.
- Não criei PUT ou PATCH.
- Próxima aula: CRUD completo parte 2.
```

---

## Referencia tecnica curta

```text
Collection:
conjunto.

Item:
identidade.

POST:
create.

GET item:
detail.

GET collection:
page.

Query:
aplicacao.

Criteria:
port.

PageRequest:
infrastructure.

Summary:
lista.

Link:
navegacao.
```

Regra final:

```text
a primeira parte de um CRUD profissional deve integrar create, read by id e read collection com contratos especificos, validacao, mappers, use cases, transacoes, repository port, Spring Data adapter, PostgreSQL e Problem Details; a colecao deve nascer paginada, filtros e ordenacoes precisam de whitelist, links devem preservar todos os parametros e tipos como Page, Pageable, Sort e JPA entity devem permanecer restritos a infraestrutura.
```
