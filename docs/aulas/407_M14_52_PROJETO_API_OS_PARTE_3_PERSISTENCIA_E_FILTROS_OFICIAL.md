# 407 - M14.52 - Projeto API OS parte 3 persistencia e filtros

## Apresentação da aula

Na aula 406, a API de Ordem de Serviço deixou de ser um CRUD irrestrito.

A feature passou a proteger:

```text
commands;

agendamento;

estado atual;

transições;

update;

delete;

concorrência;

representação HTTP.
```

O ciclo de vida ficou:

```text
OPEN
  |
  +--> IN_PROGRESS
  |       |
  |       +--> COMPLETED
  |       |
  |       +--> CANCELED
  |
  +--> CANCELED
```

As mutações passaram a utilizar:

```text
ETag;

If-Match;

@Version;

428;

412;

409.
```

Aquela aula respondeu:

```text
como impedir estados inválidos
e lost update
sem acoplar o domínio ao HTTP?
```

Agora a feature precisa responder perguntas operacionais reais.

Exemplos:

```text
quais OS estão abertas?

quais pertencem a determinado cliente?

quais são de um tipo de serviço?

quais possuem agendamento
dentro de uma janela?

como combinar esses filtros?

como paginar sem repetir
ou perder itens entre páginas?

quais índices apoiam as consultas?
```

A listagem criada na aula 405 aceita paginação e ordenação, mas ainda retorna todas as ordens.

Uma abordagem ingênua seria criar vários métodos:

```text
findByStatus;

findByCustomerNameContaining;

findByStatusAndCustomerNameContaining;

findByStatusAndServiceType;

findByStatusAndServiceTypeAndScheduledForBetween;

findByCustomerNameContainingAndScheduledForBetween.
```

À medida que os filtros opcionais aumentam, a quantidade de combinações cresce.

Outro erro seria carregar todos os registros e filtrar em Java:

```text
SELECT sem filtro;

lista completa em memória;

stream.filter;

paginação manual.
```

Esse desenho desperdiça:

- memória;
- rede;
- CPU;
- tempo;
- capacidade do PostgreSQL.

A pergunta central desta aula será:

```text
como construir filtros opcionais,
compor predicates no banco,
preservar paginação e ordenação
e criar índices coerentes
com as consultas reais?
```

A solução utilizará:

```text
JpaSpecificationExecutor;

Specification;

Criteria API;

Specification.allOf;

Specification.unrestricted;

Pageable;

PageRequest;

Sort;

allowlist de ordenação;

índices PostgreSQL;

EXPLAIN.
```

A documentação atual do Spring Data JPA apresenta `Specification` como um predicate sobre uma entity construído pela Criteria API. O repository pode combinar `JpaRepository` com `JpaSpecificationExecutor` para executar specifications sem criar um método para cada combinação.

A versão atual também oferece:

```text
Specification.allOf;

Specification.anyOf;

Specification.unrestricted.
```

Nesta aula será usado:

```text
allOf.
```

Todos os filtros fornecidos serão combinados com:

```text
AND.
```

Exemplo:

```text
status = OPEN
AND customerName contém "silva"
AND serviceType = "instalação"
AND scheduledFor >= início
AND scheduledFor < fim.
```

Os filtros serão:

`status`

```text
comparação exata pelo enum.
```

`customerName`

```text
contém, sem diferenciar maiúsculas
e minúsculas.
```

`serviceType`

```text
igualdade sem diferenciar maiúsculas
e minúsculas.
```

`scheduledFrom`

```text
limite inferior inclusivo.
```

`scheduledTo`

```text
limite superior exclusivo.
```

A janela será:

```text
[scheduledFrom, scheduledTo)
```

Ou seja:

```text
inclui o início;

exclui o fim.
```

Essa convenção evita sobreposição quando períodos consecutivos são consultados.

Exemplo:

```text
dia 15:
[2026-07-15T00:00-03:00,
 2026-07-16T00:00-03:00)

dia 16:
[2026-07-16T00:00-03:00,
 2026-07-17T00:00-03:00)
```

Um agendamento exatamente à meia-noite do dia 16 pertence somente à segunda janela.

A busca não criará um endpoint diferente para cada filtro.

Continuará:

```http
GET /api/v2/service-orders
```

Exemplo:

```http
GET /api/v2/service-orders
    ?status=OPEN
    &customerName=silva
    &serviceType=instalação
    &scheduledFrom=2026-07-15T00:00:00-03:00
    &scheduledTo=2026-07-20T00:00:00-03:00
    &page=0
    &size=20
    &sort=createdAt
    &direction=desc
```

A URL real precisa codificar caracteres especiais.

O cliente Postman, Insomnia ou navegador faz isso quando os parâmetros são configurados corretamente.

A ordenação não aceitará qualquer nome de propriedade.

Allowlist:

```text
createdAt;

customerName;

serviceType;

status.
```

Isso evita:

- exposição de campos internos;
- tentativa de ordenar por propriedade inexistente;
- contrato acoplado à entity;
- erros de runtime por sort arbitrário.

O tamanho máximo será:

```text
100.
```

A ordenação sempre ganhará um desempate por:

```text
id ASC.
```

Exemplo:

```text
createdAt DESC,
id ASC.
```

O desempate evita uma ordem parcial quando dois registros possuem o mesmo `createdAt`.

Sem ordem total, itens podem trocar de página entre execuções.

A persistência ganhará uma nova migration:

```text
V7__add_service_order_search_indexes.sql.
```

Índices:

```text
created_at + id;

status + created_at + id;

lower(service_type);

scheduled_for parcial.
```

Não será criado um índice B-tree comum para:

```text
customerName contém "%texto%".
```

Um B-tree tradicional não atende bem um padrão iniciado por wildcard.

Uma evolução possível seria:

```text
pg_trgm;

GIN;

estratégia de busca textual.
```

Ela não será adicionada sem:

- volume real;
- frequência de consulta;
- medição;
- decisão de infraestrutura.

A próxima aula será:

```text
408 - M14.53 - Projeto API OS parte 4 testes e documentacao
```

Por isso, esta aula não criará a suíte completa de controller, service, repository, integração e contrato.

Serão realizados testes manuais e alguns testes focados na composição da busca.

---

## Onde estamos na formação

A sequência do projeto API OS é:

```text
405:
domínio e CRUD.

406:
validações e erros.

407:
persistência e filtros.

408:
testes e documentação.
```

A aula 406 respondeu:

```text
como proteger as regras
e a concorrência da OS?
```

A aula 407 responderá:

```text
como consultar muitas OS
com filtros opcionais
sem carregar tudo em memória
e sem criar dezenas
de métodos de repository?
```

Nesta aula:

```text
criteria de busca:
sim.

status:
sim.

customerName:
sim.

serviceType:
sim.

scheduledFrom:
sim.

scheduledTo:
sim.

JpaSpecificationExecutor:
sim.

Specification:
sim.

AND dinâmico:
sim.

paginação:
sim.

sort allowlist:
sim.

tamanho máximo:
sim.

índices:
sim.

EXPLAIN:
sim.

OR complexo:
não.

full-text search:
não.

pg_trgm:
não.

cursor pagination:
não.

testes completos:
não.
```

A regra central será:

```text
filtros pertencem à consulta do banco;

paginação precisa de ordem total;

índices precisam nascer
de predicates reais,
não de adivinhação.
```

---

## Objetivo prático

Ao final da aula, a API aceitará:

```text
status;

customerName;

serviceType;

scheduledFrom;

scheduledTo;

page;

size;

sort;

direction.
```

Estrutura nova:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── serviceorder
│       ├── ServiceOrderSearchCriteria.java
│       └── ServiceOrderSearchValidator.java
├── persistence
│   └── serviceorder
│       └── ServiceOrderSpecifications.java
└── web
    └── v2
        └── serviceorder
            ├── ServiceOrderPageRequestFactory.java
            └── ServiceOrderQueryParameterException.java
```

Alterações:

```text
ServiceOrderRepository:
JpaSpecificationExecutor.

ServiceOrderApplicationService:
search.

ServiceOrderController:
query parameters.

ServiceOrderErrorHandler:
erro de query parameter.
```

Migration:

```text
V7__add_service_order_search_indexes.sql.
```

Você irá:

1. definir a semântica dos filtros;
2. criar o criteria;
3. validar e normalizar os filtros;
4. criar specifications pequenas;
5. compor com `allOf`;
6. executar `findAll(spec, pageable)`;
7. limitar página e ordenação;
8. adicionar desempate por ID;
9. criar índices;
10. aplicar Flyway;
11. executar combinações;
12. inspecionar SQL;
13. usar `EXPLAIN`;
14. registrar limites;
15. commitar.

---

## Conceito essencial

### Query derivada funciona até certo ponto

Spring Data JPA cria queries a partir de nomes de métodos.

Exemplo:

```java
findByStatus(
        ServiceOrderStatus status
);
```

Para uma busca fixa, isso é simples.

O problema aparece com filtros independentes e opcionais.

Com cinco filtros, existem muitas combinações possíveis.

Não é necessário criar um método para cada uma.

---

### Specification

Uma `Specification<ServiceOrder>` representa um predicate.

Exemplo:

```java
(root, query, criteriaBuilder) ->
        criteriaBuilder.equal(
                root.get("status"),
                ServiceOrderStatus.OPEN
        );
```

Ela não executa a query sozinha.

Ela descreve uma parte do `WHERE`.

---

### JpaSpecificationExecutor

O repository passa a oferecer:

```text
findAll(specification);

findAll(specification, pageable);

count(specification);

exists(specification).
```

Nesta aula será usado:

```java
findAll(
        specification,
        pageable
);
```

O resultado continua sendo `Page<ServiceOrder>`.

---

### Specification.unrestricted

Um filtro opcional ausente não deve restringir a query.

Exemplo:

```java
if (status == null) {
    return Specification.unrestricted();
}
```

Essa specification não contribui com predicate.

Isso permite montar uma lista fixa de specifications sem vários `if` externos.

---

### Specification.allOf

Composição:

```java
Specification.allOf(
        hasStatus(...),
        customerNameContains(...),
        serviceTypeEquals(...),
        scheduledAtOrAfter(...),
        scheduledBefore(...)
);
```

Specifications irrestritas são ignoradas na composição.

O resultado contém somente filtros presentes.

---

### Criteria não é DTO web

`ServiceOrderSearchCriteria` pertence à aplicação.

Ele representa a intenção de consulta.

O controller converte query parameters para o criteria.

Uma futura entrada interna pode reutilizar a busca sem depender de annotations web.

---

### Normalização de filtros

Comportamento:

```text
null:
ausente.

blank:
ausente.

texto:
trim.

serviceType:
comparação por lower.

customerName:
contains por lower.
```

Um filtro composto apenas por espaços não deve gerar:

```text
LIKE '%%'.
```

Ele é tratado como ausente.

---

### Contains e caracteres especiais

No SQL `LIKE`:

```text
%:
qualquer sequência.

_:
um caractere.
```

Se o usuário busca literalmente:

```text
100%;
```

o `%` não deve virar wildcard acidental.

A specification escapará:

- barra;
- `%`;
- `_`.

Depois usará um escape explícito.

---

### Igualdade case-insensitive

Para `serviceType`:

```sql
lower(service_type) = lower(?)
```

A migration criará:

```sql
create index ...
on service_order (lower(service_type));
```

O índice por expressão fica alinhado ao predicate.

---

### Janela semiaberta

A busca de agendamento utilizará:

```text
>= scheduledFrom;

< scheduledTo.
```

Não usará `BETWEEN`.

O limite superior exclusivo é mais fácil de compor em períodos consecutivos.

---

### Agendamento nulo

Quando existe filtro de período, registros com:

```text
scheduled_for is null
```

não satisfazem comparações de intervalo.

Eles ficam fora automaticamente.

Quando nenhum filtro de período existe, registros sem agendamento permanecem na listagem.

---

### Paginação no banco

O repository produz SQL com:

```text
limit;

offset;

order by.
```

O banco devolve somente a página solicitada.

A aplicação não carrega toda a tabela.

---

### Count query

`Page` precisa conhecer:

```text
totalElements;

totalPages.
```

Por isso, normalmente existe:

- query de conteúdo;
- query de count.

Filtros caros afetam as duas.

Em grandes volumes, uma evolução possível é usar `Slice`, que não exige total.

Nesta baseline, o contrato existente utiliza `Page`.

---

### Ordenação controlada

O cliente usa nomes públicos:

```text
createdAt;

customerName;

serviceType;

status.
```

A factory converte para propriedades da entity.

Um campo não permitido gera:

```text
400;

service_order_invalid_query_parameter.
```

Não repasse diretamente qualquer string ao `Sort`.

---

### Ordem total

Suponha cem registros com o mesmo `createdAt`.

Ordenar somente por esse campo não determina a posição relativa entre eles.

A factory adicionará:

```text
id ASC.
```

Isso produz uma ordem determinística dentro do snapshot consultado.

Offset pagination ainda pode sofrer mudanças quando novos registros entram entre duas chamadas.

Cursor pagination ficaria para uma evolução futura.

---

### Limite de tamanho

`size=100000` não deve ser aceito.

A baseline limita:

```text
1 a 100.
```

Esse limite protege:

- banco;
- memória;
- rede;
- serialização;
- consumidor.

---

### Índices não são gratuitos

Índice melhora certas leituras.

Ele também custa:

- espaço;
- escrita;
- manutenção;
- vacuum;
- cache;
- tempo de migration.

Não crie índice para cada coluna.

Crie para predicates e ordenações relevantes.

---

### Índice multicoluna

Índice:

```sql
(status, created_at desc, id asc)
```

apoia a busca típica:

```text
status exato;

ordenação por createdAt e id.
```

A ordem das colunas importa.

A primeira coluna serve ao predicate de igualdade.

As seguintes ajudam a ordenação e o desempate.

---

### Índice parcial

Índice:

```sql
scheduled_for
where scheduled_for is not null.
```

Registros sem agendamento não ocupam esse índice.

As consultas de intervalo usam comparações que já excluem `null`.

---

### Planner pode escolher seq scan

Em uma tabela pequena, `Seq Scan` pode ser mais barato que usar índice.

Isso não significa que o índice está quebrado.

O PostgreSQL compara custos.

O `EXPLAIN` deve ser interpretado com:

- volume;
- seletividade;
- distribuição;
- estatísticas;
- buffers;
- tempo.

---

## Mão na massa guiada

### 1. Atualizar o repository

```java
package br.com.formacao.backend.persistence
        .serviceorder;

import java.util.UUID;

import org.springframework.data.jpa.repository
        .JpaRepository;
import org.springframework.data.jpa.repository
        .JpaSpecificationExecutor;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrder;

public interface ServiceOrderRepository
        extends JpaRepository<
                ServiceOrder,
                UUID
        >,
        JpaSpecificationExecutor<
                ServiceOrder
        > {
}
```

Não remova o `JpaRepository`.

---

### 2. Criar o criteria

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.time.OffsetDateTime;

import br.com.formacao.backend.domain
        .serviceorder.ServiceOrderStatus;

public record ServiceOrderSearchCriteria(
        ServiceOrderStatus status,
        String customerName,
        String serviceType,
        OffsetDateTime scheduledFrom,
        OffsetDateTime scheduledTo
) {
}
```

---

### 3. Criar o validator

```java
package br.com.formacao.backend.application
        .serviceorder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ServiceOrderSearchValidator {

    public ServiceOrderSearchCriteria
            validateAndNormalize(
                    ServiceOrderSearchCriteria
                            criteria
            ) {

        List<ServiceOrderViolation>
                violations =
                new ArrayList<>();

        String customerName =
                normalize(
                        criteria.customerName()
                );

        String serviceType =
                normalize(
                        criteria.serviceType()
                );

        validateLength(
                violations,
                "customerName",
                customerName,
                120
        );

        validateLength(
                violations,
                "serviceType",
                serviceType,
                120
        );

        if (
            criteria.scheduledFrom() != null
            && criteria.scheduledTo() != null
            && !criteria
                    .scheduledFrom()
                    .isBefore(
                            criteria.scheduledTo()
                    )
        ) {
            violations.add(
                    new ServiceOrderViolation(
                            "scheduledTo",
                            "must be after scheduledFrom"
                    )
            );
        }

        if (!violations.isEmpty()) {
            throw new ServiceOrderValidationException(
                    violations
            );
        }

        return new ServiceOrderSearchCriteria(
                criteria.status(),
                customerName,
                serviceType,
                criteria.scheduledFrom(),
                criteria.scheduledTo()
        );
    }

    private String normalize(
            String value
    ) {
        if (value == null) {
            return null;
        }

        String normalized =
                value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }

    private void validateLength(
            List<ServiceOrderViolation>
                    violations,
            String field,
            String value,
            int maxLength
    ) {
        if (
            value != null
            && value.length() > maxLength
        ) {
            violations.add(
                    new ServiceOrderViolation(
                            field,
                            "must have at most "
                            + maxLength
                            + " characters"
                    )
            );
        }
    }
}
```

Uma janela com somente início ou somente fim é válida.

---

### 4. Criar as specifications

```java
package br.com.formacao.backend.persistence
        .serviceorder;

import java.time.OffsetDateTime;
import java.util.Locale;

import org.springframework.data.jpa.domain
        .Specification;

import br.com.formacao.backend.application
        .serviceorder.ServiceOrderSearchCriteria;
import br.com.formacao.backend.domain
        .serviceorder.ServiceOrder;
import br.com.formacao.backend.domain
        .serviceorder.ServiceOrderStatus;

public final class ServiceOrderSpecifications {

    private ServiceOrderSpecifications() {
    }

    public static Specification<ServiceOrder>
            withFilters(
                    ServiceOrderSearchCriteria
                            criteria
            ) {
        return Specification.allOf(
                hasStatus(
                        criteria.status()
                ),
                customerNameContains(
                        criteria.customerName()
                ),
                serviceTypeEquals(
                        criteria.serviceType()
                ),
                scheduledAtOrAfter(
                        criteria.scheduledFrom()
                ),
                scheduledBefore(
                        criteria.scheduledTo()
                )
        );
    }

    private static Specification<ServiceOrder>
            hasStatus(
                    ServiceOrderStatus status
            ) {
        if (status == null) {
            return Specification.unrestricted();
        }

        return (
                root,
                query,
                criteriaBuilder
        ) ->
                criteriaBuilder.equal(
                        root.get(
                                "status"
                        ),
                        status
                );
    }

    private static Specification<ServiceOrder>
            customerNameContains(
                    String customerName
            ) {
        if (customerName == null) {
            return Specification.unrestricted();
        }

        String pattern =
                "%"
                + escapeLike(
                        customerName
                            .toLowerCase(
                                    Locale.ROOT
                            )
                )
                + "%";

        return (
                root,
                query,
                criteriaBuilder
        ) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(
                                root.get(
                                        "customerName"
                                )
                        ),
                        pattern,
                        '\\'
                );
    }

    private static Specification<ServiceOrder>
            serviceTypeEquals(
                    String serviceType
            ) {
        if (serviceType == null) {
            return Specification.unrestricted();
        }

        String normalized =
                serviceType.toLowerCase(
                        Locale.ROOT
                );

        return (
                root,
                query,
                criteriaBuilder
        ) ->
                criteriaBuilder.equal(
                        criteriaBuilder.lower(
                                root.get(
                                        "serviceType"
                                )
                        ),
                        normalized
                );
    }

    private static Specification<ServiceOrder>
            scheduledAtOrAfter(
                    OffsetDateTime from
            ) {
        if (from == null) {
            return Specification.unrestricted();
        }

        return (
                root,
                query,
                criteriaBuilder
        ) ->
                criteriaBuilder
                        .greaterThanOrEqualTo(
                                root.get(
                                        "scheduledFor"
                                ),
                                from
                        );
    }

    private static Specification<ServiceOrder>
            scheduledBefore(
                    OffsetDateTime to
            ) {
        if (to == null) {
            return Specification.unrestricted();
        }

        return (
                root,
                query,
                criteriaBuilder
        ) ->
                criteriaBuilder.lessThan(
                        root.get(
                                "scheduledFor"
                        ),
                        to
                );
    }

    private static String escapeLike(
            String value
    ) {
        return value
                .replace(
                        "\\",
                        "\\\\"
                )
                .replace(
                        "%",
                        "\\%"
                )
                .replace(
                        "_",
                        "\\_"
                );
    }
}
```

A classe não recebe repository.

Ela somente constrói predicates.

---

### 5. Criar exception de query parameter

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

public class ServiceOrderQueryParameterException
        extends RuntimeException {

    private final String parameter;

    public ServiceOrderQueryParameterException(
            String parameter
    ) {
        super(
                "Invalid service order query parameter"
        );

        this.parameter =
                parameter;
    }

    public String parameter() {
        return parameter;
    }
}
```

Não armazene o valor bruto na mensagem pública.

---

### 6. Criar a factory de Pageable

```java
package br.com.formacao.backend.web.v2
        .serviceorder;

import java.util.Map;

import org.springframework.data.domain
        .PageRequest;
import org.springframework.data.domain
        .Pageable;
import org.springframework.data.domain
        .Sort;

public final class ServiceOrderPageRequestFactory {

    private static final int MAX_SIZE =
            100;

    private static final Map<
            String,
            String
    > ALLOWED_SORTS =
            Map.of(
                    "createdAt",
                    "createdAt",
                    "customerName",
                    "customerName",
                    "serviceType",
                    "serviceType",
                    "status",
                    "status"
            );

    private ServiceOrderPageRequestFactory() {
    }

    public static Pageable create(
            int page,
            int size,
            String sort,
            String direction
    ) {
        if (page < 0) {
            throw new ServiceOrderQueryParameterException(
                    "page"
            );
        }

        if (
            size < 1
            || size > MAX_SIZE
        ) {
            throw new ServiceOrderQueryParameterException(
                    "size"
            );
        }

        String property =
                ALLOWED_SORTS.get(
                        sort
                );

        if (property == null) {
            throw new ServiceOrderQueryParameterException(
                    "sort"
            );
        }

        Sort.Direction sortDirection;

        try {
            sortDirection =
                    Sort.Direction
                            .fromString(
                                    direction
                            );
        }
        catch (IllegalArgumentException exception) {
            throw new ServiceOrderQueryParameterException(
                    "direction"
            );
        }

        Sort order =
                Sort.by(
                        sortDirection,
                        property
                )
                .and(
                        Sort.by(
                                Sort.Direction.ASC,
                                "id"
                        )
                );

        return PageRequest.of(
                page,
                size,
                order
        );
    }
}
```

A factory define o contrato público de ordenação.

---

### 7. Atualizar o application service

Injete:

```java
ServiceOrderSearchValidator
        searchValidator.
```

Substitua o `findAll(Pageable)` por:

```java
@Transactional(
        readOnly = true
)
public Page<ServiceOrderResult> search(
        ServiceOrderSearchCriteria criteria,
        Pageable pageable
) {
    ServiceOrderSearchCriteria
            normalized =
            searchValidator
                    .validateAndNormalize(
                            criteria
                    );

    return repository
            .findAll(
                    ServiceOrderSpecifications
                            .withFilters(
                                    normalized
                            ),
                    pageable
            )
            .map(
                    this::toResult
            );
}
```

O application service coordena validation e repository.

---

### 8. Atualizar o controller

Substitua o método de listagem:

```java
@GetMapping
public ServiceOrderPageResponse findAll(

        @RequestParam(
                required = false
        )
        ServiceOrderStatus status,

        @RequestParam(
                required = false
        )
        String customerName,

        @RequestParam(
                required = false
        )
        String serviceType,

        @RequestParam(
                required = false
        )
        OffsetDateTime scheduledFrom,

        @RequestParam(
                required = false
        )
        OffsetDateTime scheduledTo,

        @RequestParam(
                defaultValue = "0"
        )
        int page,

        @RequestParam(
                defaultValue = "20"
        )
        int size,

        @RequestParam(
                defaultValue = "createdAt"
        )
        String sort,

        @RequestParam(
                defaultValue = "desc"
        )
        String direction
) {
    Pageable pageable =
            ServiceOrderPageRequestFactory
                    .create(
                            page,
                            size,
                            sort,
                            direction
                    );

    ServiceOrderSearchCriteria criteria =
            new ServiceOrderSearchCriteria(
                    status,
                    customerName,
                    serviceType,
                    scheduledFrom,
                    scheduledTo
            );

    return ServiceOrderPageResponse.from(
            applicationService.search(
                    criteria,
                    pageable
            )
    );
}
```

Imports:

```text
@RequestParam;

OffsetDateTime;

Pageable;

ServiceOrderStatus.
```

---

### 9. Adicionar o handler

```java
@ExceptionHandler(
        ServiceOrderQueryParameterException.class
)
public ProblemDetail handleQueryParameter(
        ServiceOrderQueryParameterException
                exception
) {
    ProblemDetail problem =
            ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Invalid service order query parameter."
            );

    problem.setTitle(
            "Invalid search parameter"
    );

    problem.setProperty(
            "code",
            "service_order_invalid_query_parameter"
    );

    problem.setProperty(
            "parameter",
            exception.parameter()
    );

    return problem;
}
```

O response não devolve o valor rejeitado.

---

### 10. Criar a migration V7

Arquivo:

```text
V7__add_service_order_search_indexes.sql
```

Conteúdo:

```sql
create index ix_service_order_created_at_id
    on service_order (
        created_at desc,
        id asc
    );

create index ix_service_order_status_created_at_id
    on service_order (
        status,
        created_at desc,
        id asc
    );

create index ix_service_order_service_type_lower
    on service_order (
        lower(service_type)
    );

create index ix_service_order_scheduled_for
    on service_order (
        scheduled_for
    )
    where scheduled_for is not null;
```

Não crie um índice B-tree para o contains de customerName.

---

### 11. Compilar

```powershell
.\mvnw.cmd clean compile
```

Confirme:

- imports;
- overload de `like`;
- tipos de `OffsetDateTime`;
- `Specification.unrestricted`;
- `Specification.allOf`.

---

### 12. Aplicar a migration

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Logs:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow `
  "api"
```

Flyway deve aplicar V7.

---

### 13. Criar dados variados

Crie OS com combinações:

```text
clientes:
Silva Comércio;
Oficina Norte;
Silva Residencial.

tipos:
Instalação;
Manutenção;
Vistoria.

status:
OPEN;
IN_PROGRESS;
COMPLETED;
CANCELED.

agendamentos:
antes;
dentro;
depois;
nulo.
```

Use os endpoints das aulas 405 e 406.

Não altere status diretamente no banco.

---

### 14. Filtrar por status

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/service-orders?status=OPEN&page=0&size=20&sort=createdAt&direction=desc" `
  -Headers @{
    "X-Client-Id" =
      "api-os-aula-407"
  }
```

Confirme que todos os itens têm:

```text
status OPEN.
```

---

### 15. Filtrar por cliente

Use URL encoding:

```powershell
$customerName =
  [uri]::EscapeDataString(
      "silva"
  )

Invoke-RestMethod `
  -Uri "http://localhost:8081/api/v2/service-orders?customerName=$customerName"
```

Resultado esperado:

```text
Silva Comércio;

Silva Residencial.
```

Maiúsculas não mudam o resultado.

---

### 16. Testar wildcard literal

Crie um cliente:

```text
Loja 100%.
```

Busque:

```text
100%.
```

A busca deve tratar `%` como caractere literal.

Ela não pode retornar todos os registros.

Repita com `_`.

---

### 17. Filtrar por tipo

```powershell
$serviceType =
  [uri]::EscapeDataString(
      "instalação"
  )

Invoke-RestMethod `
  -Uri "http://localhost:8081/api/v2/service-orders?serviceType=$serviceType"
```

A comparação é exata, ignorando caixa.

Não deve retornar:

```text
Instalação técnica
```

se o tipo persistido for diferente.

---

### 18. Filtrar por janela

```powershell
$from =
  [uri]::EscapeDataString(
      "2026-07-15T00:00:00-03:00"
  )

$to =
  [uri]::EscapeDataString(
      "2026-07-20T00:00:00-03:00"
  )

Invoke-RestMethod `
  -Uri "http://localhost:8081/api/v2/service-orders?scheduledFrom=$from&scheduledTo=$to"
```

Confirme:

```text
início incluído;

fim excluído;

nulos fora.
```

---

### 19. Combinar filtros

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/v2/service-orders?status=OPEN&customerName=silva&serviceType=instala%C3%A7%C3%A3o&page=0&size=10&sort=createdAt&direction=desc"
```

Todos os predicates usam `AND`.

---

### 20. Testar filtro blank

```http
?customerName=%20%20%20
```

O filtro é normalizado para ausente.

A API não deve gerar erro nem `LIKE '%%'` intencional.

---

### 21. Testar período inválido

Use:

```text
scheduledFrom:
20 de julho.

scheduledTo:
15 de julho.
```

Resultado:

```text
400;

service_order_validation_failed;

field:
scheduledTo.
```

---

### 22. Testar page e size

Inválidos:

```text
page=-1;

size=0;

size=101.
```

Resultado:

```text
400;

service_order_invalid_query_parameter.
```

---

### 23. Testar sort allowlist

Válidos:

```text
createdAt;

customerName;

serviceType;

status.
```

Inválido:

```text
version;

description;

campoInexistente.
```

Resultado:

```text
400.
```

A versão interna não vira ordenação pública.

---

### 24. Testar direção

Aceitos:

```text
asc;

desc;

ASC;

DESC.
```

Inválido:

```text
down.
```

Resultado:

```text
400.
```

---

### 25. Comprovar desempate

Crie registros com o mesmo instante controlado em teste ou muito próximos.

Consulte ordenação.

Confirme no SQL gerado:

```text
order by <campo>, id.
```

A ordem secundária não aparece como query parameter, mas faz parte da implementação estável da página.

---

### 26. Inspecionar índices

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "\d service_order"
```

Confirme os quatro índices da V7.

---

### 27. Executar EXPLAIN

Status e ordenação:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "explain (analyze, buffers) select * from service_order where status = 'OPEN' order by created_at desc, id asc limit 20;"
```

Tipo de serviço:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "explain (analyze, buffers) select * from service_order where lower(service_type) = lower('Instalação') order by created_at desc, id asc limit 20;"
```

Tabela pequena pode usar `Seq Scan`.

Registre o plano sem forçar índice.

---

### 28. Revisar SQL do Hibernate

Em profile de laboratório, habilite temporariamente:

```text
org.hibernate.SQL:
DEBUG.
```

Não habilite bind values com dados sensíveis em produção.

Confirme:

- `where` dinâmico;
- `order by`;
- `offset`;
- `fetch first`;
- count query.

Depois restaure o nível de log.

---

### 29. Criar testes focados

Crie:

```text
ServiceOrderSearchValidatorTest;

ServiceOrderPageRequestFactoryTest.
```

Cenários:

```text
blank vira null;

intervalo válido passa;

intervalo invertido falha;

size 100 passa;

size 101 falha;

sort permitido passa;

sort interno falha;

ordem contém ID.
```

A suíte completa de repository e integração ficará para 408.

---

## Entendendo o que foi feito

### Filtros foram empurrados para o banco

A aplicação não carrega a tabela inteira.

### Specifications ficaram pequenas

Cada predicate possui uma responsabilidade.

### Composição evitou explosão de métodos

Filtros opcionais usam `allOf`.

### Textos foram normalizados

Blank não produz filtro vazio.

### Wildcards foram escapados

Busca literal não vira padrão acidental.

### A paginação ganhou contrato controlado

Tamanho e ordenação possuem allowlist.

### A ordem ganhou desempate

Páginas ficaram mais determinísticas.

### Índices nasceram das queries

A migration V7 reflete predicates e ordenações reais.

### EXPLAIN foi usado com contexto

Seq scan em tabela pequena não foi tratado como bug.

---

## Erros comuns importantes

### Filtrar em memória

Paginação e consumo de recursos ficam incorretos.

### Criar método para cada combinação

O repository cresce de forma combinatória.

### Concatenar SQL manualmente

Aumenta complexidade e risco de injeção.

### Aceitar qualquer sort

O contrato vaza detalhes da entity.

### Não limitar size

Uma request pode consumir recursos excessivos.

### Ordenar sem desempate

Itens podem trocar de página.

### Usar BETWEEN sem definir bordas

Períodos consecutivos podem se sobrepor.

### Não escapar LIKE

`%` e `_` mudam a semântica.

### Criar índice para toda coluna

Escritas ficam mais caras sem benefício comprovado.

### Forçar index scan no laboratório

O planner pode estar correto ao escolher seq scan.

---

## Comandos úteis

### Compilar

```powershell
.\mvnw.cmd clean compile
```

### Testes focados

```powershell
.\mvnw.cmd `
  "-Dtest=ServiceOrderSearchValidatorTest,ServiceOrderPageRequestFactoryTest" `
  test
```

### Subir a stack

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

### Ver tabela e índices

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  psql -U formacao -d formacao_java `
  -c "\d service_order"
```

### Consultar OPEN

```powershell
Invoke-RestMethod `
  "http://localhost:8081/api/v2/service-orders?status=OPEN"
```

### Parar preservando volumes

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

---

## Exercício guiado

### Parte 1 — Criteria

Crie e normalize os cinco filtros.

### Parte 2 — Specifications

Implemente um predicate por filtro.

### Parte 3 — Composição

Use `Specification.allOf`.

### Parte 4 — Paginação

Limite page, size, sort e direction.

### Parte 5 — Ordem estável

Adicione ID como desempate.

### Parte 6 — Índices

Crie e aplique a migration V7.

### Parte 7 — Consultas

Teste filtros isolados e combinados.

### Parte 8 — Plano

Execute `EXPLAIN (ANALYZE, BUFFERS)`.

### Parte 9 — Limites

Registre contains sem índice B-tree e offset pagination.

### Parte 10 — Decisão

Anote:

```text
status exato;

customerName contains ignore case;

serviceType equals ignore case;

scheduledFrom inclusivo;

scheduledTo exclusivo;

Specification.allOf;

Specification.unrestricted;

size máximo 100;

sort allowlist;

ID como desempate;

índices orientados à consulta;

sem pg_trgm;

sem cursor pagination.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 406 foi preservada;
- filtros opcionais foram definidos;
- status exato foi implementado;
- customerName contains foi implementado;
- customerName ignora caixa;
- serviceType exato foi implementado;
- serviceType ignora caixa;
- scheduledFrom inclusivo foi implementado;
- scheduledTo exclusivo foi implementado;
- janela semiaberta foi explicada;
- agendamento nulo foi tratado;
- criteria de aplicação foi criado;
- criteria não depende de web;
- validator de busca foi criado;
- blank foi normalizado para null;
- comprimento de customerName foi validado;
- comprimento de serviceType foi validado;
- período invertido foi rejeitado;
- uma única borda foi permitida;
- repository estende JpaSpecificationExecutor;
- JpaRepository foi preservado;
- classe de specifications foi criada;
- cada filtro possui specification própria;
- filtro ausente usa unrestricted;
- filtros são combinados por allOf;
- OR não foi antecipado;
- LIKE usa lower;
- wildcard `%` foi escapado;
- wildcard `_` foi escapado;
- barra de escape foi tratada;
- serviceType usa lower equality;
- intervalo usa comparisons;
- filtro não é executado em memória;
- application service usa findAll com specification e pageable;
- list antigo foi substituído por search;
- controller aceita query parameters;
- page default é zero;
- size default é 20;
- size máximo é 100;
- sort default é createdAt;
- direction default é desc;
- allowlist foi criada;
- campo interno não pode ser usado no sort;
- direction inválida retorna 400;
- page inválida retorna 400;
- size inválido retorna 400;
- code de query parameter foi criado;
- valor rejeitado não foi publicado;
- ID foi adicionado como desempate;
- ordenação total foi explicada;
- limites de offset pagination foram registrados;
- migration V7 foi criada;
- índice createdAt e ID foi criado;
- índice status, createdAt e ID foi criado;
- índice lower(serviceType) foi criado;
- índice parcial scheduledFor foi criado;
- índice B-tree para contains não foi criado;
- custo de índices foi explicado;
- Flyway aplicou V7;
- dados variados foram criados;
- filtro por status foi testado;
- filtro por cliente foi testado;
- filtro por tipo foi testado;
- filtro por período foi testado;
- combinação foi testada;
- blank foi testado;
- wildcard literal foi testado;
- período inválido foi testado;
- page inválida foi testada;
- size inválido foi testado;
- sort inválido foi testado;
- direction inválida foi testada;
- índices foram inspecionados;
- EXPLAIN foi executado;
- seq scan em tabela pequena foi explicado;
- SQL dinâmico foi observado;
- count query foi observada;
- bind values sensíveis não foram habilitados em produção;
- teste de validator foi criado;
- teste de page factory foi criado;
- Specifications completas de integração não foram antecipadas;
- full-text search não foi antecipada;
- pg_trgm não foi antecipado;
- cursor pagination não foi antecipada;
- documentação final não foi antecipada;
- commit recomendado está pronto;
- ponte para a aula 408 está correta.

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
git commit -m "feat(m14): filtrar e paginar ordens de servico"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- env files;
- credentials;
- logs SQL;
- planos com dados sensíveis;
- dados PostgreSQL;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a listagem de Ordem de Serviço deixou de ser uma consulta genérica.

O fluxo ficou:

```text
query parameters;

ServiceOrderSearchCriteria;

ServiceOrderSearchValidator;

ServiceOrderSpecifications;

JpaSpecificationExecutor;

Pageable;

PostgreSQL;

ServiceOrderPageResponse.
```

Você implementou:

```text
filtros opcionais;

composição dinâmica;

paginação no banco;

ordenação controlada;

desempate por ID;

índices;

análise de plano.
```

A decisão central foi:

```text
uma busca profissional
não carrega tudo em memória,
não cria um método por combinação
e não aceita ordenação arbitrária;

ela compõe predicates,
limita o contrato
e mede o banco.
```

A próxima aula será:

```text
408 - M14.53 - Projeto API OS parte 4 testes e documentacao
```

Nela, o projeto API OS será consolidado com:

- testes de domínio;
- testes de validator;
- testes de application service;
- testes de controller;
- testes de repository;
- integração PostgreSQL;
- testes de filtros;
- ETag e If-Match;
- OpenAPI;
- collection;
- documentação técnica;
- revisão final do projeto.

Nenhum novo filtro será criado sem necessidade nessa etapa.

---

# Material complementar

## Checkpoint final

- [ ] Criei criteria e validator.
- [ ] Compus filtros com Specifications.
- [ ] Limitei paginação e ordenação.
- [ ] Criei índices pela migration V7.
- [ ] Testei combinações e analisei o plano.

---

## Troubleshooting adicional

### Specification.unrestricted não é encontrada

Confirme a versão atual do Spring Data JPA gerenciada pelo projeto.

Não fixe uma versão isolada fora do BOM.

### allOf gera erro de inferência

Declare os retornos como:

```text
Specification<ServiceOrder>.
```

Confirme imports do package JPA.

### OffsetDateTime não converte no query parameter

Use formato ISO-8601 com offset e aplique URL encoding.

Exemplo:

```text
2026-07-15T00:00:00-03:00.
```

### LIKE não encontra acentos diferentes

Ignore case não significa remover acentos.

`instalacao` e `instalação` continuam diferentes.

Normalização linguística exigiria outra decisão.

### Wildcard ainda funciona

Confirme o overload de `like` com caractere de escape e a função `escapeLike`.

### Sort interno continua aceito

Confirme que o controller não recebe `Pageable` diretamente.

Toda ordenação deve passar pela factory.

### Índice não aparece no plano

Tabela pequena ou filtro pouco seletivo pode favorecer seq scan.

Execute `ANALYZE` e interprete custos antes de concluir.

### Count ficou lento

Page executa count.

Uma evolução pode avaliar `Slice` ou count specification específica, mas não antecipe sem medição.

---

## Perguntas de revisão

1. Por que evitar muitos query methods?
2. O que é Specification?
3. O que JpaSpecificationExecutor oferece?
4. O que unrestricted representa?
5. Como os filtros são combinados?
6. customerName usa igualdade?
7. serviceType usa contains?
8. scheduledFrom é inclusivo?
9. scheduledTo é inclusivo?
10. Por que usar janela semiaberta?
11. Blank gera filtro?
12. Por que escapar `%`?
13. Qual é o size máximo?
14. Quais sorts são permitidos?
15. Por que adicionar ID?
16. Page executa count?
17. Redis participa da busca?
18. Por que não indexar contains com B-tree comum?
19. Seq scan sempre é ruim?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. As combinações crescem rapidamente.
2. Predicate reutilizável da Criteria API.
3. Execução de consultas por specifications.
4. Ausência de restrição.
5. Com `allOf`, usando AND.
6. Não, usa contains.
7. Não, usa igualdade.
8. Sim.
9. Não.
10. Para evitar sobreposição.
11. Não.
12. Para tratar wildcard como literal.
13. 100.
14. createdAt, customerName, serviceType e status.
15. Para desempate determinístico.
16. Sim.
17. Não.
18. O padrão começa com wildcard.
19. Não.
20. Testes e documentação da API OS.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 407 - M14.52 - Projeto API OS parte 3 persistencia e filtros

- Continuei no projeto `formacao-java-backend-api`.
- Defini filtros opcionais da API OS.
- Criei `ServiceOrderSearchCriteria`.
- Criei `ServiceOrderSearchValidator`.
- Normalizei strings blank para filtro ausente.
- Validei comprimentos e janela temporal.
- Mantive início inclusivo e fim exclusivo.
- Adicionei `JpaSpecificationExecutor`.
- Mantive `JpaRepository`.
- Criei `ServiceOrderSpecifications`.
- Usei `Specification.unrestricted`.
- Usei `Specification.allOf`.
- Combinei filtros com AND.
- Filtrei status por igualdade.
- Filtrei customerName por contains sem diferenciar caixa.
- Escapei `%`, `_` e barra no LIKE.
- Filtrei serviceType por igualdade sem diferenciar caixa.
- Filtrei scheduledFor por intervalo.
- Mantive registros sem agendamento quando não há período.
- Executei filtros no PostgreSQL.
- Não filtrei em memória.
- Criei factory de paginação.
- Limitei size a 100.
- Criei allowlist de sort.
- Rejeitei campos internos.
- Adicionei ID como desempate.
- Criei code de erro para query parameter.
- Criei `V7__add_service_order_search_indexes.sql`.
- Indexei ordenação, status, tipo e agendamento.
- Não criei B-tree para contains de cliente.
- Testei filtros isolados e combinados.
- Testei wildcard literal.
- Testei período, page, size, sort e direction inválidos.
- Inspecionei índices.
- Executei `EXPLAIN (ANALYZE, BUFFERS)`.
- Entendi que seq scan pode ser correto em tabela pequena.
- Observei query de conteúdo e count.
- Criei testes focados de validator e page factory.
- Não antecipei pg_trgm, cursor pagination ou documentação final.
- Próxima aula: Projeto API OS parte 4 testes e documentação.
```

---

## Referência técnica curta

- [Spring Data JPA — Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)
- [Spring Data — Pageable e Sort](https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html)
- [Spring Data JPA — JpaSpecificationExecutor](https://docs.spring.io/spring-data/jpa/docs/current/api/org/springframework/data/jpa/repository/JpaSpecificationExecutor.html)
- [PostgreSQL — Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL — Indexes on Expressions](https://www.postgresql.org/docs/current/indexes-expressional.html)
- [PostgreSQL — Multicolumn Indexes](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

Regra final:

```text
a listagem da API OS precisa aplicar filtros no banco, compor predicates opcionais sem explosão de métodos, controlar paginação e ordenar de forma determinística; nesta baseline, ServiceOrderSearchCriteria é validado e normalizado, Specifications usam allOf e unrestricted, customerName usa contains escapado, serviceType usa igualdade case-insensitive, o período é semiaberto, a factory limita size e sort e a migration V7 cria índices alinhados às consultas que realmente existem.
```
