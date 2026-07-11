# 378 - M14.23 - Paginacao e ordenacao em API

## Apresentacao da aula

Na aula 375, você criou a primeira versão pública da listagem de `managed runtime messages`.

O endpoint passou a aceitar:

```text
page;

size;

sort;

direction;

value.
```

A resposta passou a fornecer:

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

Também foram adicionados:

```text
X-Total-Count;

X-Total-Pages;

Link.
```

Essa baseline foi suficiente para integrar:

- controller;
- query de aplicação;
- repository port;
- `PageRequest`;
- Spring Data;
- PostgreSQL;
- DTO de resumo;
- links de navegação.

Nas aulas 376 e 377, o recurso ganhou:

- `updatedAt`;
- controle de versão;
- PUT;
- DELETE versionado;
- JSON Merge Patch;
- JSON Patch;
- `description`.

A listagem continua funcionando.

Porém, uma paginação profissional precisa resolver problemas que não aparecem com poucos registros.

Exemplo:

```text
dez rows possuem o mesmo createdAt.
```

Se a ordenação utiliza somente:

```text
createdAt desc
```

o banco pode devolver essas rows em ordens diferentes entre duas requests.

Resultado possível:

- um item aparece na página zero e depois na página um;
- outro item é pulado;
- links produzem conteúdo instável;
- testes passam localmente e oscilam em produção;
- o cliente acredita que houve duplicidade.

A paginação não fica estável apenas porque possui `ORDER BY`.

Ela precisa de uma ordenação total e determinística.

A pergunta central desta aula será:

```text
como desenhar paginacao
e ordenacao de API
de forma estavel, segura,
compativel e escalavel?
```

A baseline anterior será evoluída.

O endpoint continuará offset-based:

```text
GET /api/v1/runtime/managed-messages.
```

Parâmetros básicos permanecem:

```text
page:
indice iniciado em zero.

size:
quantidade por pagina.

value:
filtro textual existente.
```

A ordenação passará a aceitar parâmetros repetidos:

```http
?sort=updatedAt,desc&sort=value,asc
```

Cada item representa:

```text
campo publico;

direcao.
```

A API aceitará no máximo:

```text
tres campos informados pelo cliente.
```

Campos públicos permitidos:

```text
id;

value;

createdAt;

updatedAt.
```

`description` não será ordenável nesta baseline.

Motivos:

- não aparece no summary;
- é nullable;
- pode ser longa;
- não possui índice;
- não possui caso de uso claro.

Quando o cliente não informar `id`, a aplicação acrescentará:

```text
id asc
```

como desempate implícito.

Exemplo recebido:

```text
updatedAt desc.
```

Ordenação efetiva:

```text
updatedAt desc;

id asc.
```

Exemplo recebido:

```text
value asc;

createdAt desc.
```

Ordenação efetiva:

```text
value asc;

createdAt desc;

id asc.
```

Se o cliente informar `id`, nenhum desempate adicional será acrescentado.

A API rejeitará:

- campo desconhecido;
- direção desconhecida;
- campo repetido;
- item vazio;
- mais de três itens;
- formato com mais de uma vírgula;
- whitespace interno inválido.

O contrato anterior continuará compatível.

Os campos:

```text
sort;

direction.
```

continuarão representando a ordenação primária.

A resposta ganhará:

```text
orders.
```

Cada item informará:

```text
field;

direction;

implicit.
```

Exemplo:

```json
{
  "sort": "updatedAt",
  "direction": "desc",
  "orders": [
    {
      "field": "updatedAt",
      "direction": "desc",
      "implicit": false
    },
    {
      "field": "id",
      "direction": "asc",
      "implicit": true
    }
  ]
}
```

Essa evolução é aditiva.

Clientes antigos continuam lendo `sort` e `direction`.

Clientes novos conseguem observar toda a ordenação efetiva.

A aula também aprofundará:

- offset pagination;
- zero-based versus one-based;
- `Page`;
- `Slice`;
- count query;
- custo de offsets altos;
- overflow aritmético;
- página acima do total;
- stable sort;
- tie-breaker;
- ordenação múltipla;
- whitelist;
- null handling;
- case sensitivity;
- collation;
- links canônicos;
- parâmetros repetidos;
- metadata;
- compatibilidade;
- cursor pagination;
- keyset pagination;
- critérios de migração;
- testes determinísticos.

A implementação continuará utilizando:

```text
Page
```

porque o contrato público atual inclui:

```text
totalElements;

totalPages.
```

A aula explicará por que `Page` pode executar count query.

`Slice` e cursor/keyset serão estudados como alternativas.

Eles não substituirão o contrato nesta aula.

A próxima aula será:

```text
379 - M14.24 - Filtros dinamicos e Specifications
```

Por isso, esta aula não adicionará:

- novos filtros dinâmicos;
- `Specification`;
- Criteria API;
- predicates combináveis;
- intervalos de data;
- filtro por descrição;
- filtro por versão;
- busca avançada;
- QueryDSL.

O filtro simples `value` continuará existindo apenas para preservar a feature.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
374:
Problem Details e padrao de erro.

375:
CRUD completo parte 1.

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
```

A aula 377 respondeu:

```text
quando usar PUT,
quando usar PATCH
e como aplicar alteracoes parciais?
```

A aula 378 responderá:

```text
como garantir que colecoes paginadas
tenham ordem deterministica,
contrato previsivel
e custo conhecido?
```

Nesta aula:

```text
offset pagination:
sim.

page e size:
sim.

ordenacao multipla:
sim.

sort repetido:
sim.

whitelist:
sim.

tie-breaker:
sim.

stable sort:
sim.

links canonicos:
sim.

Page:
sim.

Slice:
conceitual.

cursor:
conceitual.

keyset:
conceitual.

count query:
sim.

overflow:
sim.

pagina fora do total:
sim.

Specifications:
nao.

filtros dinamicos:
nao.
```

A regra central será:

```text
uma pagina so e reproduzivel
quando a ordenacao efetiva
define uma posicao deterministica
para cada item.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura evoluída:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── query
│       │   └── ManagedRuntimeMessageListQuery.java
│       └── result
│           ├── ManagedRuntimeMessagePage.java
│           ├── ManagedRuntimeMessageSort.java
│           ├── ManagedRuntimeMessageSortDirection.java
│           ├── ManagedRuntimeMessageSortField.java
│           └── ManagedRuntimeMessageSortOrder.java
├── infrastructure
│   └── persistence
│       └── jpa
│           └── adapter
│               └── SpringDataManagedRuntimeMessageRepositoryAdapter.java
└── web
    ├── controller
    │   └── ManagedRuntimeMessageController.java
    ├── pagination
    │   ├── ManagedRuntimeMessageSortParser.java
    │   ├── PaginationLinkBuilder.java
    │   └── PaginationLimits.java
    └── response
        ├── ManagedRuntimeMessagePageResponse.java
        └── ManagedRuntimeMessageSortOrderResponse.java
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageSortTest.java
│       ├── ManagedRuntimeMessageStableOrderTest.java
│       ├── ManagedRuntimeMessagePaginationBoundsTest.java
│       └── ManagedRuntimeMessagePageMetadataTest.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── ManagedRuntimeMessageMultiSortRepositoryTest.java
│           ├── ManagedRuntimeMessageStablePaginationIT.java
│           ├── ManagedRuntimeMessagePageCountQueryIT.java
│           └── ManagedRuntimeMessageOutOfRangePageIT.java
└── web
    ├── ManagedRuntimeMessageSortParserTest.java
    ├── ManagedRuntimeMessagePaginationWebMvcTest.java
    ├── ManagedRuntimeMessageMultiSortWebMvcTest.java
    ├── ManagedRuntimeMessagePaginationLinkCanonicalizationTest.java
    ├── ManagedRuntimeMessagePaginationCompatibilityTest.java
    ├── ManagedRuntimeMessagePaginationArchitectureTest.java
    └── ManagedRuntimeMessagePaginationLiveServerIT.java
```

Documentação:

```text
docs
├── offset-pagination.md
├── pagination-indexing-contract.md
├── stable-sort-and-tie-breaker.md
├── multiple-sort-contract.md
├── pagination-metadata.md
├── count-query-cost.md
├── page-vs-slice.md
├── offset-vs-cursor-keyset.md
├── pagination-link-canonicalization.md
├── pagination-compatibility.md
└── pagination-ordering-baseline.md
```

Scripts:

```text
scripts
├── 123_testar_ordenacao_multipla.ps1
├── 124_testar_desempate_estavel.ps1
├── 125_testar_paginas_fora_do_total.ps1
├── 126_testar_links_canonicos.ps1
├── 127_testar_limites_de_paginacao.ps1
└── 128_executar_testes_paginacao_ordenacao.ps1
```

Resultados esperados:

```text
sem sort:
createdAt desc;
id asc implicito.

um sort:
campo pedido;
id asc implicito.

sort com id:
sem tie-breaker adicional.

sort repetido:
400 Problem Detail.

quatro sorts:
400 Problem Detail.

campo desconhecido:
400 Problem Detail.

direction desconhecida:
400 Problem Detail.

registros empatados:
ordem estavel.

page acima do total:
200 com content vazio.

page negativa:
400.

size 0:
400.

size 51:
400.

offset fora da janela:
400.

links:
preservam sorts repetidos.

Page:
count observavel.

Specifications:
zero.
```

---

## Conceito essencial

### Paginacao offset-based

Offset pagination divide o conjunto por:

```text
page;

size.
```

O offset conceitual é:

```text
page * size.
```

Exemplo:

```text
page 0;
size 20;
offset 0.

page 1;
size 20;
offset 20.

page 5;
size 20;
offset 100.
```

Spring Data representa isso por `PageRequest`.

---

### Zero-based

A API mantém índice iniciado em zero.

Benefícios:

- alinhamento com `PageRequest`;
- ausência de conversões escondidas;
- cálculo simples;
- consistência com a baseline.

Custo:

- alguns consumidores esperam página iniciada em um.

O contrato precisa ser explícito.

Não aceite os dois modelos simultaneamente.

---

### Page versus offset

`page` é uma abstração pública.

`offset` é um detalhe calculado.

A API não aceitará ambos.

Aceitar `page` e `offset` ao mesmo tempo criaria combinações contraditórias.

O port continua orientado a page e size.

---

### Limite de size

A baseline permanece:

```text
min:
1.

default:
20.

max:
50.
```

Um máximo protege:

- memória;
- serialização;
- banco;
- rede;
- tempo de resposta.

O cliente não escolhe um payload ilimitado.

---

### Janela maxima de offset

Mesmo com size limitado, uma página enorme pode gerar offset caro.

Exemplo:

```text
page 2_000_000;
size 50.
```

O banco precisa localizar e descartar uma quantidade muito grande de rows antes de devolver os itens.

Crie:

```text
MAX_OFFSET = 100_000.
```

Validação:

```text
page * size <= 100_000.
```

Quando exceder:

```text
400 pagination_window_exceeded.
```

O limite é parte do contrato operacional.

Ele precisa ser documentado e monitorado.

---

### Overflow aritmetico

Não calcule:

```java
int offset =
        page * size;
```

O produto pode transbordar antes da comparação.

Use:

```java
long offset =
        Math.multiplyExact(
                (long) page,
                (long) size
        );
```

Ou faça o cálculo em `long`.

Uma entrada HTTP `int` válida ainda pode produzir produto maior que `Integer.MAX_VALUE`.

---

### Pagina acima do total

Exemplo:

```text
totalElements:
35.

size:
20.

page:
99.
```

A baseline responde:

```text
200 OK;

content vazio;

page 99;

totalElements 35;

totalPages 2;

first false;

last true.
```

Uma página da coleção não é um recurso individual inexistente.

Por isso, não use 404.

---

### Page

`Page<T>` contém:

- content;
- número;
- tamanho;
- total de elementos;
- total de páginas;
- first;
- last;
- sorting;
- existência de próxima página.

Para calcular totais, o repository normalmente precisa de:

```text
content query;

count query.
```

Isso tem custo.

---

### Count query

A count query pode ser barata em tabelas pequenas e cara em consultas complexas.

Ela pode piorar com:

- joins;
- filtros;
- grouping;
- predicates;
- tabelas grandes;
- estatísticas ruins;
- concorrência.

A aula 379 adicionará filtros dinâmicos.

Por isso, o custo do count precisa ser conhecido antes.

---

### Slice

`Slice<T>` informa:

- content;
- número;
- tamanho;
- tem próxima;
- tem anterior.

Ele não fornece totalElements ou totalPages.

Frequentemente busca:

```text
size + 1
```

para descobrir se há próxima página.

Use quando o total não é necessário.

A API atual mantém `Page` porque já prometeu totais.

---

### Cursor e keyset

Cursor pagination utiliza um token que representa a posição.

Keyset pagination utiliza valores da última row.

Exemplo conceitual:

```text
updatedAt < ultimoUpdatedAt
ou
updatedAt = ultimoUpdatedAt
e id > ultimoId.
```

Benefícios:

- evita offsets altos;
- funciona melhor em feeds;
- pode reduzir inconsistência durante inserções;
- utiliza índice de forma eficiente.

Custos:

- navegação para página arbitrária é difícil;
- total normalmente não existe;
- cursor precisa ser opaco e versionado;
- ordenação precisa ser compatível;
- links e testes mudam.

A aula não implementará cursor.

---

### Stable sort

Uma ordenação é estável para paginação quando define uma ordem total.

Exemplo insuficiente:

```text
ORDER BY updated_at DESC.
```

Duas rows podem ter o mesmo timestamp.

Exemplo determinístico:

```text
ORDER BY updated_at DESC,
         id ASC.
```

O id resolve o empate.

---

### Tie-breaker

Tie-breaker é o campo final que desempata rows equivalentes nos campos anteriores.

Requisitos:

- não nulo;
- comparável;
- estável;
- único no conjunto.

O id atende esses requisitos.

A baseline usa:

```text
id asc.
```

como desempate implícito.

---

### Sort publico versus property interna

O cliente usa:

```text
createdAt.
```

O adapter mapeia para:

```text
createdAt.
```

Mesmo quando os nomes coincidem, o mapping explícito permanece.

A igualdade atual é coincidência controlada, não autorização para repassar texto.

---

### Ordenacao multipla

O parâmetro será repetido:

```http
sort=updatedAt,desc&sort=value,asc
```

A ordem dos parâmetros define a prioridade.

Primeiro:

```text
updatedAt desc.
```

Segundo:

```text
value asc.
```

Terceiro implícito:

```text
id asc.
```

Não ordene alfabeticamente os parâmetros.

---

### Formato de sort

Cada item possui exatamente:

```text
field,direction.
```

Exemplos válidos:

```text
id,asc;

value,desc;

createdAt,asc;

updatedAt,desc.
```

Exemplos inválidos:

```text
value;

value,asc,nullsLast;

value,sideways;

,value;

value,;

value,asc,extra.
```

---

### Direction

A API aceita:

```text
asc;

desc.
```

Parsing case-insensitive pode aceitar:

```text
ASC;

Desc.
```

A resposta canônica sempre devolve lowercase.

---

### Campos duplicados

Request:

```http
?sort=value,asc&sort=value,desc
```

é ambígua.

A baseline retorna:

```text
400 duplicate_sort_field.
```

Não deixe “a última vencer”.

Isso esconderia erro do cliente.

---

### Limite de campos

Máximo:

```text
3.
```

O id implícito não conta contra o limite informado pelo cliente.

Motivos:

- contrato simples;
- SQL controlado;
- índice previsível;
- links menores;
- menor superfície de abuso.

---

### Ordenacao default

Quando nenhum sort é enviado:

```text
createdAt desc;

id asc implicito.
```

O contrato primário anterior permanece:

```text
sort:
createdAt.

direction:
desc.
```

A resposta `orders` mostra o desempate.

---

### Compatibilidade da resposta

A response mantém:

```text
sort;

direction.
```

Ela adiciona:

```text
orders.
```

Essa é uma mudança aditiva.

Não remova campos antigos sem nova versão da API.

---

### SortOrderResponse

Record:

```java
public record ManagedRuntimeMessageSortOrderResponse(
        String field,
        String direction,
        boolean implicit
) {
}
```

O cliente consegue distinguir:

- escolha própria;
- regra aplicada pelo servidor.

---

### Links canonicos

Todos os links precisam preservar cada sort separadamente.

Exemplo:

```text
sort=updatedAt,desc;

sort=value,asc.
```

Não compacte para uma string incompatível.

O link canônico utiliza:

- page;
- size;
- cada sort;
- value quando presente.

---

### Ordem de query parameters

Semântica HTTP não depende da ordem geral dos parâmetros.

Entretanto, a ordem entre parâmetros `sort` repetidos é significativa.

O builder precisa preservar:

```text
sort primario;

sort secundario.
```

Para testes, parseie a URI.

Não faça assertion frágil sobre a string inteira quando outros parâmetros podem mudar de posição.

---

### Encoding

Filtro:

```text
Spring MVC avançado.
```

precisa aparecer percent-encoded nos links.

Use `UriComponentsBuilder`.

Não concatene:

```text
"&value=" + value.
```

---

### Null handling

Nenhum campo público ordenável desta baseline é nullable.

`description` é nullable e não é ordenável.

Quando uma API permite sort de nullable, precisa definir:

```text
nulls first;

nulls last.
```

Não dependa silenciosamente do default do banco.

---

### Case sensitivity e collation

Ordenar `value` depende da collation do PostgreSQL.

Resultados podem diferir entre ambientes com collations diferentes.

A baseline não altera collation.

O teste utiliza valores não ambíguos.

Para ordem textual linguística estável, seria necessário definir:

- collation;
- normalização;
- case folding;
- índice compatível.

Não esconda esse custo.

---

### Indices

A tabela possui índice por:

```text
created_at desc.
```

A ordenação default também usa id como desempate.

Em produção, um índice composto pode ser:

```sql
create index ...
on managed_runtime_message (
    created_at desc,
    id asc
);
```

Esta aula não cria uma migration automaticamente.

Primeiro, valide o plano de execução e o volume.

Não crie índice para toda combinação possível.

---

### Problem Details

Novos errors:

```text
invalid_sort;

duplicate_sort_field;

too_many_sort_fields;

pagination_window_exceeded.
```

Todos usam:

```text
400;

application/problem+json;

correlationId.
```

O handler não publica property JPA interna.

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

### 2. Criar PaginationLimits

Constantes:

```text
DEFAULT_PAGE = 0;

DEFAULT_SIZE = 20;

MAX_SIZE = 50;

MAX_OFFSET = 100_000;

MAX_SORT_FIELDS = 3.
```

Classe final com construtor privado.

---

### 3. Evoluir sort model

Transforme a ordenação em:

```java
public record ManagedRuntimeMessageSort(
        List<ManagedRuntimeMessageSortOrder> orders
) {
}
```

A lista deve ser imutável.

Ela nunca pode ficar vazia depois da normalização.

---

### 4. Criar SortOrder

Campos:

```text
field;

direction;

implicit.
```

O application model pode carregar `implicit` para que a web documente a ordem efetiva.

Não contém property JPA.

---

### 5. Criar SortParser

Entrada:

```text
List<String> rawSorts.
```

Saída:

```text
ManagedRuntimeMessageSort.
```

Passos:

1. usar default quando lista vazia;
2. validar quantidade;
3. separar por vírgula;
4. validar duas partes;
5. parsear field;
6. parsear direction;
7. rejeitar duplicidade;
8. acrescentar id quando ausente;
9. marcar tie-breaker como implicit.

---

### 6. Criar exceptions de entrada

Crie exceptions sem dependência de persistence:

```text
InvalidSortException;

DuplicateSortFieldException;

TooManySortFieldsException;

PaginationWindowExceededException.
```

Como representam parsing HTTP, elas podem permanecer em `web.pagination.exception`.

O application model continua recebendo somente valores válidos.

---

### 7. Evoluir controller

Receba:

```java
@RequestParam(
        name = "sort",
        required = false
)
List<String> sorts
```

Mantenha:

```text
page;

size;

value.
```

Não receba `Pageable`.

---

### 8. Validar janela

No web mapper ou factory da query:

```java
long offset =
        (long) page * size;
```

Se:

```text
offset > MAX_OFFSET
```

lance exception reconhecida.

Mantenha Bean Validation para page e size.

---

### 9. Evoluir list query

Substitua sort único por:

```text
ManagedRuntimeMessageSort.
```

Mantenha filter.

Invariantes continuam independentes de Spring.

---

### 10. Evoluir search criteria

O port recebe a lista de orders.

Nenhuma string livre.

O adapter decide properties JPA.

---

### 11. Evoluir adapter

Crie:

```java
private Sort toSpringSort(
        ManagedRuntimeMessageSort sort
)
```

Mapeie cada order na sequência.

Use:

```java
Sort.by(
        List<Sort.Order>
)
```

Não reordene a lista.

---

### 12. Mapear fields

Switch:

```text
ID:
id.

VALUE:
value.

CREATED_AT:
createdAt.

UPDATED_AT:
updatedAt.
```

Sem default silencioso.

Uma enum nova precisa exigir atualização do switch.

---

### 13. Evoluir page result

A page da aplicação carrega a ordenação efetiva.

Não leia a ordenação de volta do objeto Spring Data.

A criteria enviada é a fonte do contrato.

---

### 14. Criar SortOrderResponse

Campos:

```text
field;

direction;

implicit.
```

A resposta usa nomes públicos.

Não use enum name diretamente sem mapper.

---

### 15. Evoluir PageResponse

Preserve:

```text
sort;

direction.
```

Adicione:

```text
orders.
```

`sort` e `direction` vêm do primeiro order.

---

### 16. Evoluir links

Para cada order não implícito, adicione:

```text
sort=field,direction.
```

Não publique o id implícito como query param.

O servidor pode continuar aplicando o tie-breaker.

A response body mostra a ordem efetiva.

---

### 17. Canonicalizar defaults

Quando o cliente não envia sort, os links podem omitir sort e depender do default.

A baseline escolherá links explícitos:

```text
sort=createdAt,desc.
```

Isso torna o link autocontido.

O id implícito continua omitido.

---

### 18. Tratar coleção vazia

Para total zero:

```text
page:
valor solicitado.

content:
vazio.

totalPages:
0.

first:
page == 0.

last:
true.
```

Link:

```text
first.
```

Nenhum last com índice negativo.

---

### 19. Tratar página fora do total

Não reescreva page para última página.

Retorne a page pedida com content vazio.

Links podem incluir:

- first;
- prev quando page > 0;
- last quando totalPages > 0.

Não inclua next.

---

### 20. Evoluir Problem Types e Codes

Adicione categorias:

```text
INVALID_SORT;

DUPLICATE_SORT_FIELD;

TOO_MANY_SORT_FIELDS;

PAGINATION_WINDOW_EXCEEDED.
```

Use details públicos.

Não exponha properties internas.

---

### 21. Criar SortParserTest

Cenários:

- null;
- lista vazia;
- default;
- um sort;
- múltiplos sorts;
- id explícito;
- direction uppercase;
- field desconhecido;
- direction desconhecida;
- formato incompleto;
- formato excedente;
- duplicidade;
- quatro fields.

---

### 22. Criar StableOrderTest

Construa itens com:

```text
mesmo createdAt;

ids diferentes.
```

Confirme ordem por id.

Repita o mapping várias vezes.

O teste não pode depender da ordem de inserção do `HashMap`.

---

### 23. Criar RepositoryMultiSortTest

No PostgreSQL:

1. insira rows com timestamps iguais;
2. use `createdAt desc, id asc`;
3. valide ordem;
4. use `value asc, id asc`;
5. valide prioridade;
6. teste page zero e page um.

---

### 24. Criar StablePaginationIT

Insira pelo menos seis rows empatadas.

Consulte:

```text
page 0 size 3;

page 1 size 3.
```

Valide:

- nenhum id duplicado;
- nenhum id ausente;
- ordem reproduzível em requests repetidas.

---

### 25. Criar CountQueryIT

Use datasource proxy, Hibernate statistics ou statement inspector de test source.

Confirme que a consulta com `Page` executa:

```text
content;

count.
```

Não fixe SQL literal inteiro.

Valide a categoria da operação.

---

### 26. Criar OutOfRangePageIT

Total cinco.

Consulte page 99.

Espere:

- 200 no fluxo HTTP;
- content vazio;
- total preservado;
- nenhuma exception do repository.

---

### 27. Criar PaginationBoundsTest

Teste:

- page zero;
- size um;
- size cinquenta;
- offset exatamente 100000;
- offset 100001;
- produto em long;
- valor próximo de Integer.MAX_VALUE.

---

### 28. Criar PaginationWebMvcTest

Valide defaults e limites.

Confirme Problem Details para:

- page negativa;
- size zero;
- size 51;
- janela excedida.

---

### 29. Criar MultiSortWebMvcTest

Request:

```text
sort=updatedAt,desc;

sort=value,asc.
```

Valide query enviada ao use case.

Confirme response:

- primary sort;
- primary direction;
- orders;
- id implicit.

---

### 30. Criar LinkCanonicalizationTest

Valide:

- parâmetros repetidos;
- prioridade preservada;
- filtro encoded;
- page atual substituída;
- size preservado;
- id implicit não publicado;
- first, prev, next e last.

Parseie as URIs.

---

### 31. Criar CompatibilityTest

Confirme que continuam presentes:

```text
sort;

direction.
```

Confirme que:

```text
orders
```

é aditivo.

Não altere nomes antigos.

---

### 32. Criar ArchitectureTest

Valide:

- zero Pageable no controller;
- zero Page no application;
- zero Sort Spring no application;
- parser somente na web;
- mapping JPA somente no adapter;
- tie-breaker obrigatório;
- id implicit não conta como input;
- maximum sort fields definido;
- zero Specification;
- zero Criteria API;
- zero QueryDSL.

---

### 33. Criar teste live

Use PostgreSQLContainer.

Fluxo:

1. criar rows com timestamp controlado em fixture;
2. listar default;
3. listar múltiplos sorts;
4. seguir next;
5. repetir requests;
6. validar estabilidade;
7. consultar página fora;
8. testar sort inválido;
9. testar janela excedida.

---

### 34. Inspecionar plano

Em ambiente local:

```sql
explain analyze
select id,
       value,
       created_at,
       updated_at
from managed_runtime_message
order by created_at desc,
         id asc
limit 20
offset 0;
```

Depois teste offset alto em massa de dados de fixture.

Não crie índice sem evidência.

---

### 35. Criar documentacao

`offset-pagination.md` documenta cálculo e custos.

`pagination-indexing-contract.md` documenta zero-based, defaults e limites.

`stable-sort-and-tie-breaker.md` explica ordem total.

`multiple-sort-contract.md` define parâmetros repetidos.

`pagination-metadata.md` documenta body e headers.

`count-query-cost.md` explica count.

`page-vs-slice.md` compara resultados.

`offset-vs-cursor-keyset.md` cria matriz de decisão.

`pagination-link-canonicalization.md` define links.

`pagination-compatibility.md` registra evolução aditiva.

`pagination-ordering-baseline.md` consolida exemplos.

---

### 36. Criar scripts

`123_testar_ordenacao_multipla.ps1` envia sorts repetidos.

`124_testar_desempate_estavel.ps1` repete páginas.

`125_testar_paginas_fora_do_total.ps1` consulta page alta.

`126_testar_links_canonicos.ps1` percorre relações.

`127_testar_limites_de_paginacao.ps1` testa size e offset.

`128_executar_testes_paginacao_ordenacao.ps1` executa a suite.

---

### 37. Executar unit tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSortTest,ManagedRuntimeMessageStableOrderTest,ManagedRuntimeMessagePaginationBoundsTest,ManagedRuntimeMessagePageMetadataTest test
```

---

### 38. Executar repository tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageMultiSortRepositoryTest,ManagedRuntimeMessageStablePaginationIT,ManagedRuntimeMessagePageCountQueryIT,ManagedRuntimeMessageOutOfRangePageIT test
```

Docker precisa estar ativo.

---

### 39. Executar WebMvc tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSortParserTest,ManagedRuntimeMessagePaginationWebMvcTest,ManagedRuntimeMessageMultiSortWebMvcTest test
```

---

### 40. Executar links e compatibilidade

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePaginationLinkCanonicalizationTest,ManagedRuntimeMessagePaginationCompatibilityTest,ManagedRuntimeMessagePaginationArchitectureTest test
```

---

### 41. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePaginationLiveServerIT test
```

---

### 42. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 43. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 44. Revisar escopo

Confirme:

```text
offset pagination:
presente.

multiple sort:
presente.

tie-breaker:
presente.

Page:
presente.

Slice:
somente conceito.

cursor:
somente conceito.

Specifications:
zero.

Criteria API:
zero.

novos filtros:
zero.
```

---

### 45. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- logs SQL;
- dump;
- fixture massiva;
- link capturado;
- sort experimental;
- índice sem justificativa;
- Specification.

---

## Entendendo o que foi feito

### A ordenacao ficou total

O id desempata todos os valores equivalentes.

### A API ganhou ordenacao multipla

A ordem dos parâmetros define prioridade.

### O contrato antigo foi preservado

Sort e direction continuam; orders foi adicionado.

### O custo da pagina ficou explicito

Page oferece totais, mas pode executar count query.

### A estrategia ganhou limite operacional

Offsets excessivos são rejeitados antes de chegar ao banco.

---

## Erros comuns importantes

### Ordenar por campo nao unico

Páginas podem duplicar ou pular itens.

### Repassar sort livre para Spring Data

A estrutura interna vira contrato e a entrada fica insegura.

### Usar int no calculo do offset

O produto pode transbordar antes da validação.

### Retornar 404 para pagina vazia

A coleção existe; somente o recorte não possui itens.

### Criar indice para toda combinacao

Escritas ficam mais caras e o banco acumula índices inúteis.

---

## Comandos uteis

### Ordenacao multipla

```powershell
.\scripts\123_testar_ordenacao_multipla.ps1 `
  -Sort "updatedAt,desc","value,asc"
```

### Desempate

```powershell
.\scripts\124_testar_desempate_estavel.ps1 `
  -Size 3
```

### Pagina fora do total

```powershell
.\scripts\125_testar_paginas_fora_do_total.ps1 `
  -Page 99
```

### Limites

```powershell
.\scripts\127_testar_limites_de_paginacao.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Remover tie-breaker

Retire temporariamente id.

Insira timestamps iguais.

Execute requests repetidas.

Restaure.

### Parte 2 — Id explicito

Envie:

```text
sort=updatedAt,desc;

sort=id,desc.
```

Confirme que não existe id implícito adicional.

### Parte 3 — Campo duplicado

Envie value asc e value desc.

Confirme 400.

### Parte 4 — Offset limite

Teste exatamente 100000 e depois 100001.

Confirme a fronteira.

### Parte 5 — Slice

Crie repository fixture retornando Slice.

Compare queries e metadata.

Não altere o contrato público.

### Parte 6 — Keyset

Escreva SQL de laboratório usando:

```text
updatedAt;

id.
```

Compare com offset.

Não crie endpoint novo.

### Parte 7 — Collation

Insira:

```text
abacaxi;

Árvore;

Zebra.
```

Observe a ordem do ambiente.

Documente que collation é parte da decisão.

### Parte 8 — ADR

Registre:

```text
zero-based;

size maxima 50;

offset maximo 100000;

sort repetido;

maximo tres fields;

whitelist publica;

id asc como tie-breaker;

Page porque totais sao contrato;

cursor futuro para conjuntos grandes;

Specifications somente na aula 379.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 377 foi preservada;
- o mesmo projeto foi continuado;
- paginação offset-based foi aprofundada;
- page continua zero-based;
- size default continua 20;
- size máxima continua 50;
- page e offset não foram aceitos simultaneamente;
- offset é calculado em long;
- overflow de multiplicação foi tratado;
- `MAX_OFFSET` foi criado;
- offset 100000 foi aceito;
- offset acima de 100000 foi rejeitado;
- `pagination_window_exceeded` foi criado;
- página acima do total retorna 200;
- content de página fora do total é vazio;
- totalElements e totalPages são preservados;
- página não é reescrita silenciosamente;
- ordenação default continua createdAt desc;
- ordenação default recebe id asc implícito;
- ordenação múltipla foi implementada;
- parâmetros sort repetidos foram usados;
- prioridade segue a ordem da request;
- no máximo três fields do cliente foram aceitos;
- id implícito não conta no limite;
- id, value, createdAt e updatedAt foram permitidos;
- description não foi tornado ordenável;
- campo desconhecido foi rejeitado;
- direction desconhecida foi rejeitada;
- formato incompleto foi rejeitado;
- formato com partes extras foi rejeitado;
- field duplicado foi rejeitado;
- `duplicate_sort_field` foi criado;
- `too_many_sort_fields` foi criado;
- directions aceitam parsing case-insensitive;
- response devolve lowercase;
- sort público não foi repassado diretamente ao Spring;
- mapping para property JPA é explícito;
- switch não possui fallback silencioso;
- application model não conhece Spring Sort;
- application não conhece Page;
- controller não recebe Pageable;
- repository port não conhece Spring Data;
- adapter cria Sort e PageRequest;
- ordem dos Sort.Order é preservada;
- stable sort foi definido;
- id foi escolhido como tie-breaker;
- tie-breaker é único, estável e não nulo;
- id explícito impede desempate adicional;
- registros empatados foram testados;
- páginas repetidas produziram ordem determinística;
- nenhum item foi duplicado entre páginas;
- nenhum item foi omitido entre páginas de fixture;
- response preserva sort e direction anteriores;
- `orders` foi adicionado de forma compatível;
- `implicit` diferencia regra do servidor;
- primary sort vem do primeiro order;
- links preservam sorts repetidos;
- links preservam prioridade;
- links preservam size e filter;
- filtro foi codificado corretamente;
- id implícito não foi publicado na query;
- links default são autocontidos;
- coleção vazia não gera last negativo;
- first, prev, next e last seguem regras documentadas;
- `Page` foi explicado;
- count query foi observada em teste;
- `Slice` foi explicado sem alterar contrato;
- cursor pagination foi explicada;
- keyset pagination foi explicada;
- critérios de migração foram documentados;
- nenhum cursor endpoint foi criado;
- null handling foi discutido;
- campo nullable não foi exposto para sort sem política;
- collation foi documentada;
- case sensitivity foi documentada;
- índice composto foi discutido sem migration prematura;
- EXPLAIN foi praticado;
- Problem Details foi integrado aos novos erros;
- nenhuma property JPA foi exposta no erro;
- `ManagedRuntimeMessageSortParserTest` foi criado;
- `ManagedRuntimeMessageSortTest` foi criado;
- `ManagedRuntimeMessageStableOrderTest` foi criado;
- `ManagedRuntimeMessagePaginationBoundsTest` foi criado;
- `ManagedRuntimeMessagePageMetadataTest` foi criado;
- `ManagedRuntimeMessageMultiSortRepositoryTest` foi criado;
- `ManagedRuntimeMessageStablePaginationIT` foi criado;
- `ManagedRuntimeMessagePageCountQueryIT` foi criado;
- `ManagedRuntimeMessageOutOfRangePageIT` foi criado;
- `ManagedRuntimeMessagePaginationWebMvcTest` foi criado;
- `ManagedRuntimeMessageMultiSortWebMvcTest` foi criado;
- `ManagedRuntimeMessagePaginationLinkCanonicalizationTest` foi criado;
- `ManagedRuntimeMessagePaginationCompatibilityTest` foi criado;
- `ManagedRuntimeMessagePaginationArchitectureTest` foi criado;
- `ManagedRuntimeMessagePaginationLiveServerIT` foi criado;
- PostgreSQL real foi usado;
- documentação completa foi criada;
- scripts foram criados;
- testes unitários, repository, MVC, links, compatibilidade, arquitetura, live, suite e package passaram;
- nenhum filtro dinâmico, Specification, Criteria API, QueryDSL, OpenAPI, Security ou cache foi antecipado;
- ponte para a aula 379 está correta;
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
git commit -m "feat(m14): aprofundar paginacao e ordenacao estaveis"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs SQL;
- dump;
- fixture massiva;
- links capturados;
- índice sem evidência;
- Specifications antecipadas.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a coleção passou a possuir uma ordem total e observável.

O fluxo consolidado ficou:

```text
query params;

sort parser;

whitelist;

sort orders;

tie-breaker;

application query;

search criteria;

Spring Sort;

PageRequest;

PostgreSQL;

application page;

response metadata;

canonical links.
```

Você comprovou:

```text
page zero-based;

size limitada;

offset protegido;

multiple sort;

ordem de prioridade;

id como desempate;

paginas estaveis;

compatibilidade do response;

count query;

Page versus Slice;

offset versus cursor.
```

A decisão central foi:

```text
paginacao baseada em offset
so e confiavel quando
a ordenacao efetiva e deterministica,
o custo do count e do offset e conhecido
e o contrato limita entradas arbitrarias.
```

A próxima aula será:

```text
379 - M14.24 - Filtros dinamicos e Specifications
```

Nela, você continuará no mesmo projeto e estudará:

- filtros opcionais;
- composição AND;
- filtros textuais;
- intervalos de data;
- version;
- presença de description;
- normalização;
- `Specification`;
- `JpaSpecificationExecutor`;
- Criteria API;
- predicates;
- joins conceituais;
- paginação combinada;
- sorting combinado;
- count query com Specifications;
- whitelist;
- filtros desconhecidos;
- Problem Details;
- testes de repository;
- testes HTTP;
- limites de complexidade.

A aula 378 respondeu:

```text
como construir paginacao
e ordenacao estaveis?
```

A aula 379 responderá:

```text
como combinar filtros opcionais
sem criar um metodo de repository
para cada combinacao?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei explicar por que `ORDER BY` não único não estabiliza páginas.
- [ ] Sei implementar múltiplos sorts com whitelist e desempate.
- [ ] Sei diferenciar `Page`, `Slice`, offset e cursor.
- [ ] Sei proteger size, offset, links e compatibilidade.
- [ ] Sei manter Spring Data restrito à infraestrutura.

---

## Troubleshooting adicional

### Itens aparecem em duas paginas

Confirme tie-breaker único no final da ordenação.

### Sort repetido não gera erro

Revise controle de fields já vistos.

### Links mudam a prioridade

Preserve a ordem dos parâmetros sort.

### Offset negativo aparece

Calcule em long depois de validar page e size.

### Count deixa teste lento

Confirme uso de Page e avalie Slice ou cursor em outro contrato.

### Texto ordena diferente em outro ambiente

Revise collation do PostgreSQL.

---

## Perguntas de revisao

1. O que é offset pagination?
2. A API é zero-based ou one-based?
3. Qual size máxima?
4. Qual offset máximo?
5. Por que calcular em long?
6. O que é stable sort?
7. O que é tie-breaker?
8. Qual tie-breaker foi usado?
9. Quantos sorts o cliente pode enviar?
10. Como enviar múltiplos sorts?
11. Campo duplicado é aceito?
12. Page executa count?
13. Slice oferece total?
14. O que cursor representa?
15. Qual vantagem do keyset?
16. Página fora do total retorna 404?
17. O que acontece com sort antigo no response?
18. O id implícito aparece no link?
19. Specifications foram criadas?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Page e size calculando deslocamento.
2. Zero-based.
3. Cinquenta.
4. Cem mil.
5. Evitar overflow.
6. Ordem determinística total.
7. Campo final de desempate.
8. Id asc.
9. Três.
10. Repetindo `sort=field,direction`.
11. Não.
12. Normalmente sim.
13. Não.
14. Posição opaca.
15. Evitar offsets altos.
16. Não, retorna 200 vazio.
17. Continua compatível.
18. Não.
19. Não.
20. Filtros dinâmicos e Specifications.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 378 - M14.23 - Paginacao e ordenacao em API

- Continuei no projeto `formacao-java-backend-api`.
- Aprofundei paginação offset-based.
- Mantive a API zero-based.
- Mantive size padrão 20 e máxima 50.
- Criei uma janela máxima de offset.
- Passei a calcular offset em `long`.
- Mantive página acima do total como 200 com conteúdo vazio.
- Implementei ordenação múltipla com parâmetros `sort` repetidos.
- Limitei a três campos informados pelo cliente.
- Mantive whitelist de campos públicos.
- Permiti id, value, createdAt e updatedAt.
- Rejeitei campos e direções desconhecidos.
- Rejeitei campos duplicados.
- Acrescentei id asc como tie-breaker implícito.
- Entendi por que ordenação não única torna páginas instáveis.
- Testei registros com timestamps iguais.
- Comprovei ausência de duplicidade e omissão entre páginas.
- Preservei `sort` e `direction` do contrato anterior.
- Adicionei `orders` de forma compatível.
- Diferenciei ordenação explícita de implícita.
- Atualizei Link headers para múltiplos sorts.
- Preservei filtros e encoding nos links.
- Mantive Page e Pageable fora da aplicação e da web.
- Observei o custo da count query.
- Comparei Page com Slice.
- Comparei offset com cursor e keyset.
- Documentei collation, null handling e índices.
- Mantive Specifications para a próxima aula.
- Próxima aula: Filtros dinâmicos e Specifications.
```

---

## Referencia tecnica curta

```text
Page:
totais.

Slice:
proxima pagina.

Offset:
deslocamento.

Cursor:
posicao.

Stable sort:
ordem total.

Tie-breaker:
desempate.

Whitelist:
seguranca.

Count:
custo.

Link:
navegacao.

Id:
estabilidade.
```

Regra final:

```text
uma API paginada por offset deve limitar page, size e janela de deslocamento, calcular o offset sem overflow, responder paginas fora do total como colecao vazia e aplicar uma ordenacao total; sorts precisam ser publicos, validados, limitados e mapeados explicitamente para a infraestrutura, campos repetidos devem ser rejeitados e um identificador unico deve encerrar a ordenacao como tie-breaker, enquanto Page, Slice, count, cursor e keyset precisam ser escolhidos conforme o contrato e o volume sem permitir que Pageable, Sort ou detalhes JPA atravessem para a camada de aplicacao.
```
