# 379 - M14.24 - Filtros dinamicos e Specifications

## Apresentacao da aula

Na aula 378, você aprofundou a paginação e a ordenação da coleção de `managed runtime messages`.

A listagem passou a possuir:

```text
page zero-based;

size limitada;

offset maximo;

ordenacao multipla;

sort por whitelist;

id como tie-breaker;

links canonicos;

metadata compativel;

ordem deterministica.
```

O fluxo atual da coleção é:

```text
query parameters;

sort parser;

query de aplicacao;

search criteria;

adapter Spring Data;

PageRequest;

PostgreSQL;

page da aplicacao;

response HTTP.
```

O endpoint já possui um filtro textual simples:

```text
value.
```

Esse filtro foi suficiente para introduzir consultas paginadas.

Porém, uma API real costuma precisar combinar critérios opcionais.

Exemplos:

```text
mensagens cujo valor contem "spring";

criadas a partir de uma data;

criadas antes de outra data;

atualizadas em um intervalo;

com version entre dois limites;

com description presente;

sem description;

tudo isso combinado com paginacao e ordenacao.
```

Uma estratégia ingênua seria criar um método de repository para cada combinação.

Exemplos:

```java
findByNormalizedValueContaining(...);

findByCreatedAtGreaterThanEqual(...);

findByNormalizedValueContainingAndCreatedAtGreaterThanEqual(...);

findByNormalizedValueContainingAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(...);
```

A quantidade cresce rapidamente.

Com sete critérios opcionais, existem:

```text
2 elevado a 7
```

combinações de presença ou ausência.

Isso representa:

```text
128 combinacoes.
```

Nem todas precisariam de um método específico, mas o problema fica evidente.

Outra estratégia ruim seria montar JPQL ou SQL por concatenação.

Essa abordagem tende a produzir:

- queries difíceis de revisar;
- risco de semântica inconsistente;
- parâmetros esquecidos;
- regras duplicadas;
- filtros não autorizados;
- manutenção frágil;
- testes combinatórios dispersos.

A pergunta central desta aula será:

```text
como combinar filtros opcionais
sem criar um metodo de repository
para cada combinacao?
```

A solução utilizará:

```text
Spring Data JPA Specifications;

JpaSpecificationExecutor;

Jakarta Persistence Criteria API.
```

No Spring Data JPA 4.1, existem dois pontos de entrada relacionados:

```text
PredicateSpecification;

Specification.
```

`PredicateSpecification` foi introduzida na linha 4.x como uma abstração menor e independente do tipo de query.

`Specification` continua sendo a forma consolidada e vinculada à consulta Criteria.

Nesta aula, a baseline utilizará:

```text
Specification<ManagedRuntimeMessageJpaEntity>.
```

Motivos:

- o título oficial da aula é Specifications;
- `JpaSpecificationExecutor.findAll(spec, pageable)` é direto;
- o laboratório precisa observar `Root`, `CriteriaQuery` e `CriteriaBuilder`;
- o mesmo spec participará da consulta de conteúdo e da count query;
- a infraestrutura já trabalha com `Page`.

O repository Spring Data evoluirá para:

```java
public interface ManagedRuntimeMessageSpringDataRepository
        extends JpaRepository<
                ManagedRuntimeMessageJpaEntity,
                Long
        >,
        JpaSpecificationExecutor<
                ManagedRuntimeMessageJpaEntity
        > {
}
```

Os filtros públicos serão:

```text
value;

createdFrom;

createdTo;

updatedFrom;

updatedTo;

minVersion;

maxVersion;

description.
```

O parâmetro `description` aceitará:

```text
any;

present;

absent.
```

A semântica será:

```text
any:
nao filtra.

present:
description is not null.

absent:
description is null.
```

String vazia será considerada:

```text
presente.
```

Isso ocorre porque presença é definida pela nulabilidade da coluna, não por texto não vazio.

Os intervalos temporais serão:

```text
from:
inclusivo.

to:
exclusivo.
```

Exemplo:

```text
createdFrom <= createdAt
e
createdAt < createdTo.
```

Essa escolha facilita períodos contíguos sem sobreposição.

A faixa de versão será inclusiva:

```text
minVersion <= version
e
version <= maxVersion.
```

Todos os filtros ativos serão combinados por:

```text
AND.
```

A API não oferecerá OR arbitrário nesta aula.

Também não oferecerá:

- linguagem de busca;
- operadores enviados pelo cliente;
- nomes de campos livres;
- expressions;
- RSQL;
- FIQL;
- QueryDSL;
- GraphQL filters;
- SQL fragment;
- JPQL fragment.

A camada web aceitará somente os query parameters documentados.

Ela rejeitará parâmetros desconhecidos.

Exemplo:

```text
?status=ACTIVE
```

Resultado:

```text
400 unknown_filter.
```

Isso evita que um erro de digitação seja silenciosamente ignorado.

Também serão rejeitadas repetições indevidas.

Exemplo:

```text
?minVersion=1&minVersion=2
```

Resultado:

```text
400 repeated_filter_parameter.
```

O parâmetro:

```text
sort
```

continua podendo ser repetido porque essa é sua semântica oficial.

A API aplicará limite de complexidade.

Máximo de critérios de negócio ativos:

```text
7.
```

O limite atual permite todos os filtros conhecidos, mas torna a política explícita e preparada para futuras expansões.

Parâmetros de infraestrutura como:

```text
page;

size;

sort.
```

não entram na contagem.

A implementação será separada em camadas.

Web:

```text
recebe strings e tipos HTTP;

rejeita parametros desconhecidos;

valida repeticoes;

converte datas e enums;

cria query de aplicacao.
```

Application:

```text
representa filtros por tipos proprios;

valida ranges;

normaliza texto;

define semantica AND;

nao conhece JPA.
```

Infrastructure:

```text
converte criteria em Specifications;

usa CriteriaBuilder;

executa findAll(spec, pageable);

mapeia Page para page da aplicacao.
```

A aula também aprofundará:

- predicate;
- `Root`;
- `CriteriaQuery`;
- `CriteriaBuilder`;
- igualdade;
- `like`;
- comparações;
- `isNull`;
- `isNotNull`;
- `Specification.allOf`;
- `Specification.unrestricted`;
- specifications pequenas;
- specifications compostas;
- metamodel conceitual;
- strings internas controladas;
- escape de wildcards;
- count query;
- custom count specification;
- fetch join;
- `distinct`;
- joins conceituais;
- performance;
- testes de combinações;
- limites de complexidade.

A aula não utilizará Specifications para:

- update em massa;
- delete em massa;
- autorização;
- multi-tenancy;
- soft delete;
- regras de negócio transacionais;
- parsing HTTP;
- ordenação livre;
- projeção pública.

O Spring Data JPA 4.1 também oferece:

```text
UpdateSpecification;

DeleteSpecification;

PredicateSpecification;

SpecificationFluentQuery.
```

Essas APIs serão explicadas brevemente.

A feature não executará bulk update ou bulk delete com elas.

A razão é importante:

```text
bulk operations podem ignorar
o estado sincronizado do persistence context
e exigem uma politica propria.
```

A próxima aula será:

```text
380 - M14.25 - OpenAPI Swagger
```

Por isso, esta aula não adicionará:

- springdoc;
- Swagger UI;
- annotations OpenAPI;
- geração de schema;
- documentação automática;
- contract first;
- governança de contrato.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual é:

```text
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

381:
OpenAPI contract first e governanca.
```

A aula 378 respondeu:

```text
como construir paginacao
e ordenacao estaveis?
```

A aula 379 responderá:

```text
como compor filtros opcionais
de forma segura,
testavel e paginada?
```

Nesta aula:

```text
Specification:
sim.

JpaSpecificationExecutor:
sim.

Criteria API:
sim.

filtros opcionais:
sim.

composicao AND:
sim.

texto literal:
sim.

ranges de data:
sim.

range de version:
sim.

description presence:
sim.

paginacao:
integrada.

sorting:
integrado.

count query:
sim.

joins:
conceitual.

parametros desconhecidos:
rejeitados.

OR publico:
nao.

QueryDSL:
nao.

OpenAPI:
nao.
```

A regra central será:

```text
o cliente escolhe valores
para filtros conhecidos;

a aplicacao define a semantica;

a infraestrutura constroi predicates
sem receber campos ou operadores livres.
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
│       │   ├── ManagedRuntimeMessageDescriptionPresence.java
│       │   ├── ManagedRuntimeMessageFilterQuery.java
│       │   └── ManagedRuntimeMessageListQuery.java
│       └── port
│           └── ManagedRuntimeMessageSearchCriteria.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── adapter
│           │   └── SpringDataManagedRuntimeMessageRepositoryAdapter.java
│           ├── repository
│           │   └── ManagedRuntimeMessageSpringDataRepository.java
│           └── specification
│               ├── ManagedRuntimeMessageJpaFields.java
│               ├── ManagedRuntimeMessageSpecifications.java
│               └── SqlLikeLiteralEscaper.java
└── web
    ├── controller
    │   └── ManagedRuntimeMessageController.java
    ├── filter
    │   ├── AllowedQueryParameterGuard.java
    │   ├── FilterComplexityPolicy.java
    │   ├── ManagedRuntimeMessageDescriptionPresenceParser.java
    │   └── ManagedRuntimeMessageFilterRequest.java
    └── mapper
        └── ManagedRuntimeMessageWebMapper.java
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageFilterQueryTest.java
│       ├── ManagedRuntimeMessageFilterRangeTest.java
│       └── ManagedRuntimeMessageFilterNormalizationTest.java
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── ManagedRuntimeMessageSpecificationUnitTest.java
│           ├── ManagedRuntimeMessageSpecificationRepositoryTest.java
│           ├── ManagedRuntimeMessageSpecificationCombinationIT.java
│           ├── ManagedRuntimeMessageSpecificationPaginationIT.java
│           └── ManagedRuntimeMessageSpecificationCountQueryIT.java
└── web
    ├── AllowedQueryParameterGuardTest.java
    ├── ManagedRuntimeMessageFilterWebMvcTest.java
    ├── ManagedRuntimeMessageUnknownFilterWebMvcTest.java
    ├── ManagedRuntimeMessageFilterProblemDetailTest.java
    ├── ManagedRuntimeMessageFilterCompatibilityTest.java
    ├── ManagedRuntimeMessageSpecificationArchitectureTest.java
    └── ManagedRuntimeMessageFilterLiveServerIT.java
```

Documentação:

```text
docs
├── dynamic-filter-contract.md
├── specification-anatomy.md
├── criteria-api-predicates.md
├── specification-composition.md
├── text-filter-escaping.md
├── temporal-range-filters.md
├── description-presence-filter.md
├── specifications-pagination-count.md
├── specifications-joins-concept.md
├── dynamic-filter-complexity.md
└── specifications-baseline.md
```

Scripts:

```text
scripts
├── 129_testar_filtro_textual.ps1
├── 130_testar_intervalos_de_data.ps1
├── 131_testar_version_e_description.ps1
├── 132_testar_combinacao_de_filtros.ps1
├── 133_testar_filtros_invalidos.ps1
└── 134_executar_testes_specifications.ps1
```

Resultados esperados:

```text
sem filtros:
todos os registros paginados.

value:
contains literal normalizado.

createdFrom:
inclusivo.

createdTo:
exclusivo.

updatedFrom:
inclusivo.

updatedTo:
exclusivo.

minVersion:
inclusivo.

maxVersion:
inclusivo.

description present:
is not null.

description absent:
is null.

varios filtros:
AND.

filtro desconhecido:
400.

filtro repetido:
400.

range invertido:
400.

wildcards:
tratados como texto literal.

Specification na application:
zero.

JpaSpecificationExecutor:
somente infrastructure.
```

---

## Conceito essencial

### O problema combinatorio

Métodos derivados são excelentes para consultas estáveis e simples.

Exemplo:

```java
existsByNormalizedValue(
        String normalizedValue
);
```

Eles perdem legibilidade quando critérios opcionais se multiplicam.

Specifications permitem separar cada predicate e compor somente os filtros ativos.

---

### Specification

A interface clássica possui a forma conceitual:

```java
public interface Specification<T> {

    Predicate toPredicate(
            Root<T> root,
            CriteriaQuery<?> query,
            CriteriaBuilder builder
    );
}
```

A lambda recebe a raiz da entity, a consulta e o builder.

Ela devolve um predicate.

---

### PredicateSpecification

No Spring Data JPA 4.1, `PredicateSpecification` utiliza uma assinatura menor:

```java
Predicate toPredicate(
        From<?, T> from,
        CriteriaBuilder builder
);
```

Ela é útil para composição independente do tipo de query.

A baseline permanece com `Specification` para tornar a Criteria query explícita e manter o laboratório alinhado ao executor paginado tradicional.

---

### Root

`Root<T>` representa a entity raiz da consulta.

Exemplo:

```java
root.get(
        ManagedRuntimeMessageJpaFields.VERSION
)
```

Ele não é uma entity carregada.

Ele é parte da árvore da query.

---

### CriteriaQuery

`CriteriaQuery<?>` representa a consulta em construção.

Ela pode fornecer informações sobre:

- tipo de resultado;
- distinct;
- ordering;
- grouping;
- roots.

Uma specification de filtro não deve alterar ordenação.

A ordenação continua vindo do `Pageable`.

---

### CriteriaBuilder

`CriteriaBuilder` cria expressions e predicates.

Exemplos:

```text
equal;

like;

greaterThanOrEqualTo;

lessThan;

between;

isNull;

isNotNull;

and;

or;

not.
```

A infrastructure utiliza essa API.

---

### Predicate

Predicate é uma expressão booleana da query.

Exemplo:

```java
builder.greaterThanOrEqualTo(
        root.get(
                "version"
        ),
        minVersion
)
```

Vários predicates serão combinados por AND.

---

### JpaSpecificationExecutor

O repository adiciona:

```java
JpaSpecificationExecutor<
        ManagedRuntimeMessageJpaEntity
>
```

Isso oferece operações como:

```text
findAll(spec);

findAll(spec, pageable);

findAll(spec, sort);

findOne(spec);

count(spec);

exists(spec).
```

A baseline utilizará:

```java
findAll(
        specification,
        pageable
)
```

---

### Specification.unrestricted

O executor atual exige uma specification não nula.

Quando nenhum filtro estiver ativo, use:

```java
Specification.unrestricted()
```

Ela representa ausência de restrição.

Não passe null.

Não crie uma lambda que retorna null.

---

### Specification.allOf

Crie uma lista de specs ativas.

Depois:

```java
Specification.allOf(
        specifications
)
```

A composição aplica AND.

A ordem dos predicates não define precedência de negócio.

Todos precisam ser satisfeitos.

---

### Specifications pequenas

Prefira factories como:

```text
valueContainsLiteral;

createdAtFrom;

createdAtBefore;

updatedAtFrom;

updatedAtBefore;

versionAtLeast;

versionAtMost;

descriptionPresent;

descriptionAbsent.
```

Cada factory testa uma ideia.

O adapter escolhe quais factories compor.

---

### Nao retornar null

Padrões antigos frequentemente retornam null de `toPredicate` para ignorar filtro.

A baseline não adotará isso.

Filtro ausente:

```text
specification nao e adicionada.
```

Sem filtros:

```text
Specification.unrestricted().
```

O fluxo fica explícito.

---

### Filtro textual literal

O filtro público:

```text
value=spring
```

procura no campo:

```text
normalizedValue.
```

A normalização precisa ser a mesma usada no create e update.

Exemplo:

```text
trim;

case folding definido pela policy.
```

A query usa `LIKE`.

---

### Wildcards SQL

Em `LIKE`:

```text
%:
qualquer sequencia.

_:
um caractere.
```

O cliente não receberá poder de wildcard.

Se ele enviar:

```text
100%;
```

a intenção será buscar o caractere `%`.

Por isso, escape:

- `\`;
- `%`;
- `_`.

Depois envolva:

```text
%valor-escapado%.
```

Use o overload de CriteriaBuilder com caractere de escape.

---

### SQL injection versus wildcard injection

Criteria API parametriza valores e reduz risco de SQL injection.

Mesmo assim, `%` e `_` alteram a semântica de LIKE.

Escapar continua necessário para cumprir o contrato de busca literal.

Segurança e semântica não são a mesma preocupação.

---

### Intervalo temporal

Contrato:

```text
createdFrom:
inclusive.

createdTo:
exclusive.
```

Specifications:

```java
builder.greaterThanOrEqualTo(
        root.get(
                CREATED_AT
        ),
        from
);
```

e:

```java
builder.lessThan(
        root.get(
                CREATED_AT
        ),
        to
);
```

---

### Range invalido

Se ambos existirem:

```text
from < to.
```

From igual a to representa intervalo vazio.

A baseline rejeita como:

```text
400 invalid_filter_range.
```

Essa decisão detecta erro do cliente em vez de devolver vazio silenciosamente.

---

### updatedAt

Os mesmos critérios serão aplicados a `updatedAt`.

Isso permite localizar:

- recursos modificados recentemente;
- recursos sem mudança desde um instante;
- janelas de sincronização.

A paginação ainda não é um log de mudanças.

---

### Version range

`minVersion` e `maxVersion` são inclusivos.

Regras:

- valores não negativos;
- min <= max;
- ambos opcionais.

Specifications utilizam comparações numéricas.

---

### Description presence

Enum de aplicação:

```text
ANY;

PRESENT;

ABSENT.
```

Mapping:

```text
ANY:
nenhuma specification.

PRESENT:
builder.isNotNull(...).

ABSENT:
builder.isNull(...).
```

String vazia continua PRESENT.

---

### Composicao AND

Request:

```text
value=spring;

minVersion=1;

description=present.
```

Predicate conceitual:

```text
normalizedValue contains spring
AND version >= 1
AND description is not null.
```

Não existe OR implícito.

---

### Por que nao OR publico agora

OR aumenta muito a superfície.

Perguntas que surgiriam:

- quais grupos;
- precedência;
- parênteses;
- AND dentro de OR;
- limite de clauses;
- serialização;
- segurança;
- plano de execução.

A API manterá AND previsível.

---

### Query parameters desconhecidos

Spring MVC normalmente não transforma query parameters extras em erro automaticamente.

O guard inspeciona:

```java
request.getParameterMap()
```

Whitelist:

```text
page;

size;

sort;

value;

createdFrom;

createdTo;

updatedFrom;

updatedTo;

minVersion;

maxVersion;

description.
```

Qualquer outro nome gera 400.

---

### Repeticao de parametros

`sort` pode repetir.

Todos os filtros de negócio aceitam no máximo um valor.

O guard rejeita arrays com mais de um elemento.

Isso evita semântica “primeiro vence” ou “último vence”.

---

### Complexidade

Cada filtro ativo adiciona um ponto.

Máximo:

```text
7.
```

A política atual permite todas as opções conhecidas.

Seu valor principal é impedir que expansões futuras criem uma query ilimitada sem revisão.

Também existem limites individuais:

- value até 120;
- page e size;
- offset;
- sorts;
- intervalos coerentes.

---

### Strings internas de campo

A Criteria API sem static metamodel pode usar:

```java
root.get(
        "createdAt"
)
```

Essas strings ficam em uma classe interna:

```text
ManagedRuntimeMessageJpaFields.
```

Elas nunca vêm do cliente.

O static metamodel oferece type safety maior.

A aula documentará essa alternativa sem adicionar geração de código.

---

### Join conceitual

A entity atual não possui relacionamentos.

Quando houver relação, uma specification pode utilizar:

```java
root.join(
        "owner",
        JoinType.INNER
)
```

Joins exigem atenção a:

- multiplicação de rows;
- `distinct`;
- count query;
- fetch join;
- paginação;
- N+1;
- índices.

Nenhum relacionamento será inventado nesta aula.

---

### Fetch join e count

Uma specification reutilizada em uma consulta paginada pode participar da content query e da count query.

Adicionar fetch join indiscriminadamente pode quebrar ou encarecer a contagem.

Uma specification de filtro deve, preferencialmente, criar predicates.

Estratégia de fetch pertence a uma decisão separada.

---

### Count specification separada

Spring Data JPA oferece:

```java
findAll(
        spec,
        countSpec,
        pageable
)
```

Isso permite uma specification de contagem diferente.

A baseline não precisa disso porque não possui joins.

A possibilidade será documentada para consultas complexas futuras.

---

### Fluent query

O executor atual também oferece:

```text
findBy(spec, queryFunction).
```

A fluent query pode controlar:

- sort;
- limit;
- projection;
- page;
- slice;
- scroll;
- count;
- exists.

A aula não substituirá o caminho `findAll(spec, pageable)`.

Primeiro, consolide o fundamento.

---

### Bulk update e delete

Spring Data JPA 4.x possui specifications específicas para update e delete.

Essas operações podem executar diretamente no banco.

O persistence context pode não ser sincronizado automaticamente.

A feature continuará usando entities versionadas e transações normais.

Não use bulk operations para contornar `@Version`.

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

### 2. Criar DescriptionPresence

```java
public enum ManagedRuntimeMessageDescriptionPresence {
    ANY,
    PRESENT,
    ABSENT
}
```

O enum pertence à application layer.

Não use nomes HTTP.

---

### 3. Criar FilterQuery

Record:

```text
valueContains;

createdFrom;

createdTo;

updatedFrom;

updatedTo;

minVersion;

maxVersion;

descriptionPresence.
```

Use `Optional` apenas no acesso, não como components.

Components podem ser nullable quando o contrato interno está documentado.

---

### 4. Validar ranges

No construtor compacto ou factory:

```text
createdFrom < createdTo;

updatedFrom < updatedTo;

minVersion <= maxVersion.
```

Version não pode ser negativa.

Lance exception de entrada da aplicação sem dependência web.

---

### 5. Normalizar value

Blank vira:

```text
null.
```

Valor presente:

- strip;
- normalização existente;
- máximo 120.

Não use lower-case diferente da regra já aplicada ao `normalizedValue`.

---

### 6. Evoluir ListQuery

Substitua o filtro textual isolado por:

```text
ManagedRuntimeMessageFilterQuery filters.
```

Mantenha:

- page;
- size;
- sort.

---

### 7. Evoluir SearchCriteria

Carregue os filtros normalizados.

Nenhum tipo JPA.

Nenhum `Specification`.

---

### 8. Criar FilterRequest

Record web:

```text
String value;

Instant createdFrom;

Instant createdTo;

Instant updatedFrom;

Instant updatedTo;

Long minVersion;

Long maxVersion;

String description.
```

O parser converte description.

Datas usam ISO-8601.

---

### 9. Criar DescriptionPresenceParser

Aceite case-insensitive:

```text
any;

present;

absent.
```

Valor desconhecido gera 400 `invalid_filter`.

Response links usam lowercase.

---

### 10. Criar AllowedQueryParameterGuard

Receba `HttpServletRequest`.

Defina set imutável de nomes permitidos.

Rejeite desconhecidos.

Permita repetição somente de:

```text
sort.
```

---

### 11. Criar FilterComplexityPolicy

Conte critérios ativos.

Se exceder o máximo:

```text
TooManyFiltersException.
```

Mantenha a política fora do controller.

---

### 12. Evoluir controller

Antes de mapear:

```text
guard.validate(request).
```

Receba os novos parâmetros.

Não receba `Map<String, String>` como contrato.

Não aceite fields ou operators livres.

---

### 13. Evoluir web mapper

Converta request para:

```text
FilterQuery.
```

Depois crie:

```text
ListQuery.
```

As regras de sort da aula 378 permanecem.

---

### 14. Evoluir repository interface

Adicione:

```java
JpaSpecificationExecutor<
        ManagedRuntimeMessageJpaEntity
>
```

Mantenha `JpaRepository`.

O método derivado de filtro textual pode ser removido quando não houver outro uso.

---

### 15. Criar JpaFields

Constantes:

```text
NORMALIZED_VALUE;

CREATED_AT;

UPDATED_AT;

VERSION;

DESCRIPTION.
```

Construtor privado.

Nenhuma constante recebe valor externo.

---

### 16. Criar SqlLikeLiteralEscaper

Método:

```java
String escape(
        String value
)
```

Escape nesta ordem:

1. backslash;
2. percent;
3. underscore.

Use constante:

```text
ESCAPE = '\\'.
```

Teste strings combinadas.

---

### 17. Criar Specifications

Classe final com factories estáticas.

Exemplo:

```java
static Specification<Entity>
        createdAtFrom(
                Instant from
        ) {
}
```

Cada método exige argumento não nulo.

---

### 18. Implementar valueContainsLiteral

Fluxo:

1. receber normalized literal;
2. escapar wildcards;
3. envolver em `%`;
4. usar `builder.like` com escape.

Não faça concatenação SQL.

---

### 19. Implementar ranges temporais

Factories separadas:

```text
createdAtFrom;

createdAtBefore;

updatedAtFrom;

updatedAtBefore.
```

Use `greaterThanOrEqualTo` e `lessThan`.

---

### 20. Implementar version

Factories:

```text
versionAtLeast;

versionAtMost.
```

Use expressions Long.

---

### 21. Implementar description

Factories:

```text
descriptionPresent;

descriptionAbsent.
```

Use `isNotNull` e `isNull`.

ANY não cria spec.

---

### 22. Criar composition method

No adapter:

```java
List<Specification<Entity>>
        specifications =
                new ArrayList<>();
```

Adicione somente filtros presentes.

Depois:

```java
Specification<Entity> spec =
        specifications.isEmpty()
                ? Specification.unrestricted()
                : Specification.allOf(
                        specifications
                );
```

Não passe null.

---

### 23. Executar findAll

```java
Page<Entity> page =
        repository.findAll(
                spec,
                pageable
        );
```

O Pageable continua contendo stable sort.

Mapeie para page da aplicação.

---

### 24. Preservar links

Atualize `PaginationLinkBuilder`.

Todos os links preservam:

- value;
- createdFrom;
- createdTo;
- updatedFrom;
- updatedTo;
- minVersion;
- maxVersion;
- description;
- sorts.

Omitir filtros ausentes.

---

### 25. Canonicalizar datas

Links usam:

```text
Instant.toString().
```

Isso produz formato UTC quando o valor é UTC.

Não use locale para timestamps técnicos.

---

### 26. Evoluir Problem Types

Adicione:

```text
UNKNOWN_FILTER;

REPEATED_FILTER_PARAMETER;

INVALID_FILTER;

INVALID_FILTER_RANGE;

TOO_MANY_FILTERS.
```

---

### 27. Evoluir Problem Codes

Valores:

```text
unknown_filter;

repeated_filter_parameter;

invalid_filter;

invalid_filter_range;

too_many_filters.
```

Não publique nome de property JPA.

---

### 28. Testar FilterQuery

Cenários:

- tudo ausente;
- value blank;
- value normalizado;
- ranges válidos;
- ranges iguais;
- ranges invertidos;
- version negativa;
- min maior que max;
- description default ANY.

---

### 29. Testar escaper

Valores:

```text
spring;

100%;

a_b;

c\d;

%\_.
```

Confirme escape exato.

---

### 30. Testar Specification unitariamente

Use mocks somente quando ajudam.

Confirme que cada factory chama o método CriteriaBuilder esperado.

Não dependa de implementação Hibernate.

O teste principal continuará sendo integração com PostgreSQL.

---

### 31. Criar dataset de integração

Insira rows variando:

- value;
- createdAt;
- updatedAt;
- version;
- description null;
- description vazia;
- description preenchida.

Use tempos fixos.

---

### 32. Testar cada filtro isolado

Confirme:

- value literal;
- createdFrom inclusivo;
- createdTo exclusivo;
- updatedFrom inclusivo;
- updatedTo exclusivo;
- minVersion inclusivo;
- maxVersion inclusivo;
- present;
- absent;
- any.

---

### 33. Testar wildcard literal

Insira values:

```text
100% Java;

1000 Java;

a_b;

axb.
```

Filtro:

```text
100%;
```

deve encontrar somente o percentual literal.

Filtro:

```text
a_b;
```

deve encontrar underscore literal.

---

### 34. Testar combinacao

Combine:

```text
value;

created range;

minVersion;

description present.
```

Confirme que somente rows satisfazendo todos os predicates são retornadas.

Não implemente OR escondido.

---

### 35. Testar paginacao e sort

Com specification ativa:

- page zero;
- page um;
- stable sort;
- multiple sort;
- links;
- totals.

Confirme que o count usa os mesmos filtros.

---

### 36. Observar count query

Use a instrumentação de test source da aula 378.

Confirme:

```text
content query com predicates;

count query com predicates.
```

Não fixe SQL inteiro.

---

### 37. Testar guard

Cenários:

- todos os nomes permitidos;
- sort repetido;
- value repetido;
- parâmetro desconhecido;
- case diferente;
- vazio.

Nomes de query parameter são case-sensitive.

---

### 38. Testar WebMvc

Cenários válidos e inválidos.

Valide a query enviada ao use case.

Confirme Problem Details para:

- unknown;
- repeated;
- invalid enum;
- range inválido;
- excesso de complexidade.

---

### 39. Testar compatibilidade

Request antigo:

```text
?page=0&size=20&sort=createdAt,desc&value=spring.
```

Continua funcionando.

Response antiga continua com os mesmos campos.

Novos filtros são opcionais.

---

### 40. Criar ArchitectureTest

Valide:

- `Specification` somente em infrastructure;
- `JpaSpecificationExecutor` somente no repository Spring Data;
- application sem Criteria API;
- web sem Specification;
- controller sem EntityManager;
- specs sem HttpServletRequest;
- names JPA não vêm do cliente;
- zero SQL concatenado;
- zero Map de filtros;
- zero QueryDSL;
- zero OpenAPI;
- bulk update e delete ausentes.

---

### 41. Criar teste live

Use PostgreSQLContainer.

Fluxo:

1. criar dataset;
2. filtrar value;
3. filtrar data;
4. filtrar version;
5. filtrar description;
6. combinar;
7. paginar;
8. ordenar;
9. seguir next;
10. enviar unknown;
11. enviar range inválido.

---

### 42. Criar documentacao

`dynamic-filter-contract.md` lista params e semântica.

`specification-anatomy.md` explica Root, Query e Builder.

`criteria-api-predicates.md` documenta cada predicate.

`specification-composition.md` documenta `allOf` e unrestricted.

`text-filter-escaping.md` diferencia SQL injection de wildcard.

`temporal-range-filters.md` define inclusive e exclusive.

`description-presence-filter.md` define null e vazio.

`specifications-pagination-count.md` explica duas queries.

`specifications-joins-concept.md` documenta joins, distinct e fetch.

`dynamic-filter-complexity.md` registra limites.

`specifications-baseline.md` consolida exemplos.

---

### 43. Criar scripts

`129_testar_filtro_textual.ps1` testa texto e wildcard.

`130_testar_intervalos_de_data.ps1` testa limites.

`131_testar_version_e_description.ps1` testa ranges e presença.

`132_testar_combinacao_de_filtros.ps1` aplica AND.

`133_testar_filtros_invalidos.ps1` testa Problems.

`134_executar_testes_specifications.ps1` executa a suite.

---

### 44. Executar unit tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageFilterQueryTest,ManagedRuntimeMessageFilterRangeTest,ManagedRuntimeMessageFilterNormalizationTest test
```

---

### 45. Executar specification tests

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSpecificationUnitTest,ManagedRuntimeMessageSpecificationRepositoryTest,ManagedRuntimeMessageSpecificationCombinationIT test
```

Docker precisa estar ativo.

---

### 46. Executar pagina e count

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSpecificationPaginationIT,ManagedRuntimeMessageSpecificationCountQueryIT test
```

---

### 47. Executar web tests

```powershell
.\mvnw.cmd `
  -Dtest=AllowedQueryParameterGuardTest,ManagedRuntimeMessageFilterWebMvcTest,ManagedRuntimeMessageUnknownFilterWebMvcTest,ManagedRuntimeMessageFilterProblemDetailTest test
```

---

### 48. Executar compatibilidade e arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageFilterCompatibilityTest,ManagedRuntimeMessageSpecificationArchitectureTest test
```

---

### 49. Executar teste live

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageFilterLiveServerIT test
```

---

### 50. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores devem permanecer verdes.

---

### 51. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 52. Revisar escopo

Confirme:

```text
dynamic filters:
presentes.

Specifications:
presentes.

JpaSpecificationExecutor:
presente.

AND:
presente.

OR publico:
zero.

Criteria API na application:
zero.

QueryDSL:
zero.

OpenAPI:
zero.

bulk update:
zero.

bulk delete:
zero.
```

---

### 53. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- logs SQL;
- dump;
- dataset temporário;
- filtros experimentais;
- SQL concatenado;
- OpenAPI antecipado;
- bulk operations.

---

## Entendendo o que foi feito

### O repository deixou de crescer por combinacao

Specifications compõem predicates sem criar dezenas de métodos derivados.

### A semantica permaneceu fora da JPA

Ranges, normalização e presença foram definidos antes da infrastructure.

### O cliente nao ganhou uma linguagem de query

Somente valores de filtros conhecidos são aceitos.

### Wildcards viraram texto literal

Percentual e underscore não alteram silenciosamente a busca.

### Paginacao e count usam os mesmos criterios

Totais e content permanecem coerentes.

---

## Erros comuns importantes

### Colocar Specification na application

A camada passa a depender de JPA e Criteria API.

### Retornar null de toPredicate

A composição fica implícita e frágil.

### Aceitar field e operator livres

O cliente passa a controlar detalhes da query.

### Esquecer escape de percent e underscore

O contrato literal vira wildcard sem aviso.

### Usar fetch join em spec paginada

A count query pode quebrar ou contar incorretamente.

---

## Comandos uteis

### Filtro textual

```powershell
.\scripts\129_testar_filtro_textual.ps1 `
  -Value "spring"
```

### Datas

```powershell
.\scripts\130_testar_intervalos_de_data.ps1 `
  -CreatedFrom "2026-07-01T00:00:00Z" `
  -CreatedTo "2026-08-01T00:00:00Z"
```

### Version e description

```powershell
.\scripts\131_testar_version_e_description.ps1 `
  -MinVersion 1 `
  -Description present
```

### Combinacao

```powershell
.\scripts\132_testar_combinacao_de_filtros.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — OR controlado

Crie fixture que combina duas specifications com OR.

Compare o resultado.

Não publique OR no endpoint.

### Parte 2 — Intervalo vazio

Altere temporariamente a policy para aceitar from igual a to.

Observe resposta vazia.

Restaure o erro explícito.

### Parte 3 — Wildcard

Remova o escaper.

Execute filtros com `%` e `_`.

Restaure.

### Parte 4 — Description vazia

Persista null, vazio e texto.

Compare ANY, PRESENT e ABSENT.

### Parte 5 — Count spec

Crie fixture usando:

```text
findAll(spec, countSpec, pageable).
```

Compare com a mesma spec.

Não altere a baseline sem joins.

### Parte 6 — PredicateSpecification

Reescreva uma factory em fixture.

Compare a assinatura com Specification.

Mantenha a implementação oficial alinhada ao laboratório.

### Parte 7 — Join ficticio

Desenhe um filtro por owner.

Liste riscos de distinct, count e fetch.

Não crie relacionamento em produção.

### Parte 8 — ADR

Registre:

```text
filtros publicos fechados;

AND como semantica;

ranges claros;

wildcards literais;

Specification somente infrastructure;

allOf para composicao;

unrestricted sem filtros;

count coerente;

joins somente quando necessarios;

OpenAPI na aula 380.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 378 foi preservada;
- o mesmo projeto foi continuado;
- filtros opcionais foram implementados;
- value foi preservado;
- createdFrom foi criado;
- createdTo foi criado;
- updatedFrom foi criado;
- updatedTo foi criado;
- minVersion foi criado;
- maxVersion foi criado;
- description presence foi criada;
- description aceita any, present e absent;
- null e string vazia foram diferenciados;
- from é inclusivo;
- to é exclusivo;
- version range é inclusivo;
- ranges iguais foram rejeitados;
- ranges invertidos foram rejeitados;
- version negativa foi rejeitada;
- minVersion maior que maxVersion foi rejeitado;
- todos os filtros ativos são combinados por AND;
- OR não foi exposto publicamente;
- linguagem de query não foi criada;
- operators livres não foram aceitos;
- fields livres não foram aceitos;
- parâmetros desconhecidos foram rejeitados;
- nomes de parâmetros são case-sensitive;
- parâmetros repetidos foram rejeitados;
- sort repetido continuou permitido;
- limite de complexidade foi definido;
- page, size e sort não contam como filtros de negócio;
- `ManagedRuntimeMessageFilterQuery` foi criado;
- query não possui annotations MVC;
- search criteria não possui JPA;
- normalização reutiliza a policy existente;
- blank value vira ausência;
- value máximo foi preservado;
- repository estende `JpaSpecificationExecutor`;
- `JpaRepository` foi preservado;
- `Specification` foi utilizada;
- `PredicateSpecification` foi explicada;
- current API 4.1 foi considerada;
- `Root` foi explicado;
- `CriteriaQuery` foi explicado;
- `CriteriaBuilder` foi explicado;
- `Predicate` foi explicado;
- `Specification.unrestricted()` foi usado;
- null specification não foi passada;
- `Specification.allOf` foi usado;
- specifications pequenas foram criadas;
- nenhuma specification retorna null;
- JpaFields internos foram criados;
- strings JPA não vêm do cliente;
- static metamodel foi explicado sem geração desnecessária;
- filtro textual usa normalized value;
- filtro textual usa LIKE parametrizado;
- backslash foi escapado;
- percentual foi escapado;
- underscore foi escapado;
- wildcard é tratado como literal;
- SQL injection foi diferenciada de wildcard injection;
- created range usa predicates corretos;
- updated range usa predicates corretos;
- version range usa predicates corretos;
- description usa isNull e isNotNull;
- adapter compõe somente specs ativas;
- adapter cria PageRequest com stable sort;
- `findAll(spec, pageable)` foi usado;
- Page não vazou para application;
- Specification não vazou para application;
- Criteria API não vazou para web;
- links preservam todos os filtros;
- datas nos links usam formato técnico canônico;
- filtros ausentes são omitidos;
- Problem Types foram evoluídos;
- Problem Codes foram evoluídos;
- unknown filter retorna 400;
- repeated filter retorna 400;
- invalid filter retorna 400;
- invalid range retorna 400;
- too many filters retorna 400;
- Problem Details continua RFC 9457;
- propriedade JPA não foi publicada no erro;
- dataset de teste possui valores variados;
- cada filtro foi testado isoladamente;
- limites inclusivos e exclusivos foram testados;
- wildcard literal foi testado;
- combinação AND foi testada;
- paginação com specification foi testada;
- sorting múltiplo com specification foi testado;
- totals usam os mesmos filtros;
- count query foi observada;
- `findAll(spec, countSpec, pageable)` foi explicado;
- custom count não foi aplicado sem necessidade;
- joins foram explicados conceitualmente;
- fetch join não foi adicionado;
- distinct não foi adicionado;
- bulk update não foi usado;
- bulk delete não foi usado;
- persistence context não foi contornado;
- `AllowedQueryParameterGuardTest` foi criado;
- `ManagedRuntimeMessageFilterQueryTest` foi criado;
- `ManagedRuntimeMessageFilterRangeTest` foi criado;
- `ManagedRuntimeMessageFilterNormalizationTest` foi criado;
- `ManagedRuntimeMessageSpecificationUnitTest` foi criado;
- `ManagedRuntimeMessageSpecificationRepositoryTest` foi criado;
- `ManagedRuntimeMessageSpecificationCombinationIT` foi criado;
- `ManagedRuntimeMessageSpecificationPaginationIT` foi criado;
- `ManagedRuntimeMessageSpecificationCountQueryIT` foi criado;
- `ManagedRuntimeMessageFilterWebMvcTest` foi criado;
- `ManagedRuntimeMessageUnknownFilterWebMvcTest` foi criado;
- `ManagedRuntimeMessageFilterProblemDetailTest` foi criado;
- `ManagedRuntimeMessageFilterCompatibilityTest` foi criado;
- request antigo permaneceu compatível;
- `ManagedRuntimeMessageSpecificationArchitectureTest` foi criado;
- `ManagedRuntimeMessageFilterLiveServerIT` foi criado;
- PostgreSQL real foi usado;
- documentação completa foi criada;
- scripts foram criados;
- testes unitários, specification, paginação, count, web, compatibilidade, arquitetura, live, suite e package passaram;
- nenhum QueryDSL, linguagem de busca, OpenAPI, Security, cache, bulk update ou bulk delete foi antecipado;
- ponte para a aula 380 está correta;
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
git commit -m "feat(m14): compor filtros dinamicos com specifications"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs SQL;
- dump;
- dataset temporário;
- filtros experimentais;
- SQL concatenado;
- OpenAPI;
- bulk operations.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a listagem passou a combinar filtros opcionais sem multiplicar métodos de repository.

O fluxo consolidado ficou:

```text
query params conhecidos;

guard;

filter request;

filter query;

search criteria;

specifications pequenas;

Specification.allOf;

JpaSpecificationExecutor;

Pageable;

PostgreSQL;

page da aplicacao;

response e links.
```

Você comprovou:

```text
texto literal;

ranges temporais;

range de version;

presence de description;

composicao AND;

wildcards escapados;

parametros desconhecidos rejeitados;

count coerente;

paginacao e sorting preservados;

Criteria API isolada.
```

A decisão central foi:

```text
filtros dinamicos seguros
nao oferecem uma linguagem livre;

eles compoem predicates conhecidos
sobre tipos validados
e mantem JPA restrita
a camada de infraestrutura.
```

A próxima aula será:

```text
380 - M14.25 - OpenAPI Swagger
```

Nela, você continuará no mesmo projeto e estudará:

- OpenAPI 3.1;
- Swagger UI;
- springdoc;
- dependency compatível;
- documentação gerada;
- metadata da API;
- servers;
- tags;
- operations;
- parameters;
- request bodies;
- responses;
- schemas;
- validation constraints;
- Problem Details;
- pagination;
- sorting;
- filters;
- PATCH media types;
- If-Match;
- headers;
- examples;
- segurança de documentação;
- ambientes;
- testes do documento;
- exposição controlada.

A aula 379 respondeu:

```text
como combinar filtros opcionais
sem explodir o repository?
```

A aula 380 responderá:

```text
como transformar os contratos
da API em documentacao OpenAPI
navegavel e verificavel?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei criar specifications pequenas e compô-las com AND.
- [ ] Sei manter Criteria API somente na infraestrutura.
- [ ] Sei definir ranges, presença e texto literal sem ambiguidade.
- [ ] Sei combinar Specifications com paginação, sorting e count.
- [ ] Sei rejeitar filtros desconhecidos e evitar uma linguagem livre.

---

## Troubleshooting adicional

### Nenhum filtro retorna erro

Use `Specification.unrestricted()`, não null.

### Percentual encontra registros demais

Confirme escape de wildcards e o escape char no LIKE.

### Count diferente do content

Revise predicates, joins e distinct.

### Parâmetro desconhecido é ignorado

Confirme execução do guard antes do mapper.

### Range válido retorna 400

Revise inclusive from e exclusive to.

### Specification apareceu na application

Mova a composição para o adapter de infraestrutura.

---

## Perguntas de revisao

1. Qual problema Specifications resolvem?
2. O que é `Specification`?
3. O que é `PredicateSpecification`?
4. Para que serve `JpaSpecificationExecutor`?
5. O que `Root` representa?
6. O que `CriteriaBuilder` cria?
7. O que é Predicate?
8. Como representar ausência de filtro?
9. Como combinar os filtros?
10. Qual semântica pública foi escolhida?
11. Como from e to funcionam?
12. Version range é inclusivo?
13. O que present significa?
14. String vazia é present?
15. Por que escapar `%`?
16. Parâmetro desconhecido é ignorado?
17. Specification pode ficar na application?
18. Page usa count com spec?
19. Bulk delete foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Combinações opcionais de critérios.
2. Predicate de entity com Criteria API.
3. Variante menor introduzida no Spring Data JPA 4.x.
4. Executar specifications.
5. A entity raiz da query.
6. Expressions e predicates.
7. Condição booleana.
8. `Specification.unrestricted()`.
9. `Specification.allOf`.
10. AND.
11. From inclusivo e to exclusivo.
12. Sim.
13. Description não nula.
14. Sim.
15. Para tratar wildcard como literal.
16. Não, gera 400.
17. Não.
18. Normalmente sim.
19. Não.
20. OpenAPI Swagger.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 379 - M14.24 - Filtros dinamicos e Specifications

- Continuei no projeto `formacao-java-backend-api`.
- Identifiquei o problema combinatório de métodos derivados.
- Adotei `Specification` e `JpaSpecificationExecutor`.
- Estudei a Criteria API.
- Entendi `Root`, `CriteriaQuery`, `CriteriaBuilder` e `Predicate`.
- Conheci `PredicateSpecification` do Spring Data JPA 4.1.
- Mantive Specifications somente na infraestrutura.
- Criei filtros opcionais para value, datas, version e description.
- Defini from inclusivo e to exclusivo.
- Defini version range inclusivo.
- Diferenciei description any, present e absent.
- Mantive string vazia como description presente.
- Combinei filtros com semântica AND.
- Usei `Specification.allOf`.
- Usei `Specification.unrestricted()` sem filtros.
- Evitei specifications nulas.
- Criei specifications pequenas e reutilizáveis.
- Normalizei o filtro textual.
- Escapei backslash, percentual e underscore.
- Diferenciei SQL injection de wildcard injection.
- Rejeitei parâmetros desconhecidos.
- Rejeitei parâmetros repetidos fora de sort.
- Defini limite de complexidade.
- Preservei paginação e ordenação estáveis.
- Mantive totals coerentes com os filtros.
- Observei content query e count query.
- Estudei custom count specification.
- Estudei joins, distinct e fetch de forma conceitual.
- Não usei bulk update ou bulk delete.
- Testei filtros isolados e combinados no PostgreSQL real.
- Mantive compatibilidade com o endpoint anterior.
- Não antecipei OpenAPI.
- Próxima aula: OpenAPI Swagger.
```

---

## Referencia tecnica curta

```text
Specification:
predicate.

Executor:
execucao.

Root:
entity.

Builder:
criteria.

AllOf:
AND.

Unrestricted:
sem filtro.

Range:
limites.

Presence:
nullability.

Escape:
literal.

Count:
total.
```

Regra final:

```text
filtros dinamicos devem ser definidos como parametros publicos fechados, convertidos para tipos de aplicacao e compostos somente na infraestrutura por Specifications pequenas; ausencia de filtro deve usar Specification.unrestricted, combinacoes AND podem usar Specification.allOf, ranges precisam de limites claros, LIKE deve escapar wildcards quando a busca e literal, parametros desconhecidos ou repetidos devem falhar de forma explicita, e JpaSpecificationExecutor, Criteria API, fields JPA, joins, count e demais detalhes de consulta nunca devem atravessar para controller, application service ou domain.
```
