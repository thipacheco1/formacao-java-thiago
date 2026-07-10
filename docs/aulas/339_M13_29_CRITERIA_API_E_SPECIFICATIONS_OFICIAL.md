# 339 - M13.29 - Criteria API e Specifications

## Apresentacao da aula

Na aula 338, você utilizou JPQL para resolver consultas conhecidas e estáticas.

Os casos principais foram:

```text
listar Ordens com Cliente;

listar Clientes com Ordens;

eliminar N+1;

preservar associações LAZY no mapping;

usar join fetch por caso de uso.
```

A JPQL ficou clara porque a estrutura da consulta era conhecida antecipadamente.

Exemplo:

```java
select o
from OrdemServico o
join fetch o.cliente
where o.status = :status
order by o.id
```

Mas aplicações reais também possuem buscas dinâmicas.

Considere uma tela de pesquisa de Ordens com filtros opcionais:

```text
código;

status;

nome do Cliente;

Cliente ativo;

data inicial;

data final;

somente Ordens com Atividades;

qualquer um dos status permitidos.
```

O usuário pode preencher:

- apenas o status;
- status e Cliente;
- somente um intervalo de datas;
- código e dois status;
- nenhum filtro;
- qualquer combinação válida.

Montar uma JPQL por concatenação tende a produzir:

- vários `if`;
- strings difíceis de revisar;
- parâmetros esquecidos;
- espaços incorretos;
- branches não testados;
- duplicação;
- risco de concatenação insegura;
- baixa reutilização de regras;
- dificuldade para compor `AND` e `OR`.

Nesta aula, você usará a Criteria API.

Ela permite construir consultas programaticamente com objetos tipados da API JPA:

```java
CriteriaBuilder;

CriteriaQuery;

Root;

Path;

Predicate;

Join;

Order.
```

Você também criará um contrato próprio chamado:

```java
JpaSpecification<T>
```

Esse contrato não será o `Specification` do Spring Data.

O laboratório permanecerá:

```text
sem Spring;

sem Spring Data.
```

A specification da aula será uma abstração pequena e explícita sobre Criteria API.

Ela permitirá escrever regras como:

```java
statusIgualA("ABERTA");

clienteNomeContem("silva");

criadaEntre(inicio, fim);

clienteAtivo();

temAlgumStatus(statuses);
```

Depois, essas regras poderão ser compostas:

```java
statusAberta
        .and(clienteAtivo)
        .and(criadaNoPeriodo);
```

ou:

```java
statusAberta
        .or(statusAgendada);
```

A diferença principal será:

```text
Criteria API:
mecanismo de construção da consulta.

Specification:
regra reutilizável que produz Predicate.
```

Nesta aula, você aprenderá:

- `CriteriaBuilder`;
- `CriteriaQuery`;
- `Root`;
- `Path`;
- `Predicate`;
- `ParameterExpression`;
- `Join`;
- `JoinType`;
- composição `AND`;
- composição `OR`;
- negação;
- filtros opcionais;
- igualdade;
- `like`;
- intervalo;
- `in`;
- nulidade;
- ordenação dinâmica controlada;
- joins sem fetch;
- fetch opcional por caso de uso;
- `distinct` quando join multiplica raízes;
- contrato de specification;
- composição de specifications;
- separação entre filtro e execução;
- testes de combinações;
- limites de legibilidade;
- comparação com JPQL estática.

A infraestrutura continuará:

```text
Java 21;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O database será:

```text
formacao_java_jpa_339
```

O schema será:

```text
jpa_339
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

As entidades serão:

```text
ClienteEntity;

OrdemServicoEntity;

AtividadeEntity.
```

O laboratório criará:

```text
OrdemServicoSearchFilter;

JpaSpecification<T>;

OrdemServicoSpecifications;

CriteriaOrderRepository;

OrderByOption;

CriteriaObservation;

CriteriaReport.
```

Os cenários provarão:

```text
nenhum filtro:
todas as Ordens do prefixo didático.

status:
somente Ordens do status.

nome do Cliente:
join dinâmico.

período:
between com limites inclusivos.

vários status:
IN.

AND:
todas as regras precisam ser verdadeiras.

OR:
qualquer regra pode ser verdadeira.

filtro ausente:
nenhum Predicate inútil.

ordenação:
somente opções permitidas.

join de Atividades:
distinct evita raízes duplicadas.

specification:
mesma regra reutilizada em consultas diferentes.

estado final:
zero fixtures CLI-JPA-339-%,
OS-JPA-339-% e ATV-JPA-339-%.
```

A próxima aula será:

```text
340 - M13.30 - Projections DTO interface e record
```

Por isso, todas as consultas desta aula retornarão entidades.

Não serão antecipados:

- constructor expression;
- DTO projection;
- interface projection;
- record projection;
- `Tuple`;
- paginação completa;
- count query paginada;
- Spring Data Specification;
- QueryDSL;
- API HTTP.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
337:
Problema N mais um.

338:
JPQL select join fetch.

339:
Criteria API e Specifications.

340:
Projections DTO interface e record.

341:
Paginacao e ordenacao com JPA.
```

A aula 338 mostrou que JPQL é excelente quando a consulta possui estrutura estática.

A aula 339 tratará consultas cujo conjunto de filtros varia em tempo de execução.

A progressão será:

```text
JPQL estática:
consulta conhecida.

Criteria API:
consulta montada com objetos.

Specification:
regra de filtro reutilizável.

Projection:
resultado específico do caso de uso.
```

Nesta aula:

```text
CriteriaBuilder:
sim.

CriteriaQuery:
sim.

Root:
sim.

Path:
sim.

Predicate:
sim.

Join:
sim.

AND e OR:
sim.

Specification própria:
sim.

Spring Data:
não.

Projection:
não.

Paginação completa:
não.
```

A arquitetura será:

```text
filtro de entrada
    -> specifications
        -> predicates
            -> CriteriaQuery
                -> TypedQuery
                    -> entidades managed.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-339-criteria-api-specifications
```

Estrutura final:

```text
labs
└── m13
    └── aula-339-criteria-api-specifications
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── fundamentos-criteria-api.md
        │   ├── contrato-specification.md
        │   ├── composicao-and-or.md
        │   ├── filtros-opcionais.md
        │   ├── criterios-de-escolha-jpql-vs-criteria.md
        │   └── troubleshooting-criteria.md
        ├── scripts
        │   ├── 01_criar_database.ps1
        │   ├── 02_executar_migration.ps1
        │   ├── 03_executar_laboratorio.ps1
        │   ├── 04_validar_estado_final.ps1
        │   └── 05_limpar_database.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula339
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── CriteriaLab.java
            │   │                       │   ├── CriteriaObservation.java
            │   │                       │   └── CriteriaReport.java
            │   │                       ├── query
            │   │                       │   ├── CriteriaOrderRepository.java
            │   │                       │   ├── JpaSpecification.java
            │   │                       │   ├── OrderByOption.java
            │   │                       │   ├── OrdemServicoSearchFilter.java
            │   │                       │   └── OrdemServicoSpecifications.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_339.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula339
                                        ├── CriteriaFundamentalsIT.java
                                        ├── DynamicFiltersIT.java
                                        ├── SpecificationCompositionIT.java
                                        ├── CriteriaJoinDistinctIT.java
                                        ├── SafeOrderingIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
consulta base:
seis Ordens.

status ABERTA:
três Ordens.

Cliente ativo e status:
interseção correta.

nome do Cliente:
case-insensitive.

período:
limites corretos.

status ABERTA ou AGENDADA:
união lógica.

atividade CONCLUIDA:
join e distinct.

ordenação:
código ascendente;
data descendente.

filtros nulos:
ignorados.

entrada de ordenação arbitrária:
rejeitada.
```

---

## Conceito essencial

### O que e Criteria API

Criteria API é a API programática de consultas da Jakarta Persistence.

Em vez de escrever uma string JPQL completa, você cria objetos que representam partes da consulta.

Fluxo básico:

```java
CriteriaBuilder builder =
        entityManager.getCriteriaBuilder();

CriteriaQuery<OrdemServicoEntity> query =
        builder.createQuery(
                OrdemServicoEntity.class
        );

Root<OrdemServicoEntity> root =
        query.from(
                OrdemServicoEntity.class
        );

query.select(root);

List<OrdemServicoEntity> result =
        entityManager.createQuery(query)
                .getResultList();
```

---

### CriteriaBuilder

`CriteriaBuilder` cria elementos da consulta.

Exemplos:

```java
builder.equal(...);

builder.like(...);

builder.between(...);

builder.and(...);

builder.or(...);

builder.not(...);

builder.asc(...);

builder.desc(...);

builder.lower(...);

builder.conjunction();

builder.disjunction();
```

Ele funciona como uma fábrica de expressões e predicates.

---

### CriteriaQuery

`CriteriaQuery<T>` representa a consulta completa e o tipo esperado do resultado.

Exemplo:

```java
CriteriaQuery<OrdemServicoEntity>
```

significa:

```text
a consulta retorna OrdemServicoEntity.
```

Nesta aula, o resultado será sempre entidade.

A aula 340 mudará o tipo de resultado para DTOs e records.

---

### Root

`Root<T>` representa a entidade principal da cláusula `from`.

Exemplo:

```java
Root<OrdemServicoEntity> root =
        query.from(
                OrdemServicoEntity.class
        );
```

Ele equivale conceitualmente a:

```text
from OrdemServico o
```

O `root` permite navegar por atributos:

```java
root.get("status");

root.get("codigo");

root.get("criadaEm");

root.join("cliente");
```

---

### Path

Um `Path<X>` representa um caminho até um atributo.

Exemplo:

```java
Path<String> status =
        root.get("status");
```

ou:

```java
Path<String> nomeCliente =
        root.join("cliente")
                .get("nome");
```

Strings de atributos continuam sujeitas a erro de digitação.

A API é tipada no resultado do caminho, mas sem metamodelo estático o nome do atributo ainda é textual.

O laboratório não gerará metamodelo nesta aula.

---

### Predicate

`Predicate` representa uma condição booleana.

Exemplo:

```java
Predicate statusAberta =
        builder.equal(
                root.get("status"),
                "ABERTA"
        );
```

Você pode combinar predicates:

```java
builder.and(
        statusAberta,
        clienteAtivo
);
```

ou:

```java
builder.or(
        statusAberta,
        statusAgendada
);
```

---

### Conjunction

Uma conjunction vazia representa:

```text
verdadeiro.
```

Criação:

```java
builder.conjunction()
```

Ela é útil para specification sem restrição.

Exemplo:

```text
filtro ausente:
retorna conjunction.
```

Isso evita `null` espalhado pela montagem.

---

### Disjunction

Uma disjunction vazia representa:

```text
falso.
```

Criação:

```java
builder.disjunction()
```

Use com cuidado.

Ela pode representar:

```text
nenhum valor permitido.
```

Por exemplo, uma lista de status explicitamente vazia pode significar zero resultados, enquanto `null` pode significar sem filtro.

A semântica deve ser definida no filtro.

---

### Parametros

Criteria API pode criar parâmetros explícitos:

```java
ParameterExpression<String> statusParameter =
        builder.parameter(
                String.class,
                "status"
        );
```

Depois:

```java
query.where(
        builder.equal(
                root.get("status"),
                statusParameter
        )
);
```

E no `TypedQuery`:

```java
typedQuery.setParameter(
        "status",
        "ABERTA"
);
```

Também é possível fornecer valores diretamente nas expressões.

O laboratório usará valores vinculados pelo provider e nunca concatenará entrada em SQL ou JPQL.

---

### Filtros opcionais

Um filtro de busca será representado por record:

```java
public record OrdemServicoSearchFilter(
        String codigo,
        String status,
        String clienteNome,
        Boolean clienteAtivo,
        OffsetDateTime criadaDe,
        OffsetDateTime criadaAte,
        Set<String> qualquerStatus,
        String atividadeStatus,
        OrderByOption orderBy
) {
}
```

Cada campo pode estar ausente.

A aplicação monta somente specifications relevantes.

---

### Normalizacao

Antes de criar predicates:

- remova espaços;
- transforme vazio em ausência;
- normalize status para caixa alta;
- preserve datas;
- copie sets;
- valide intervalo;
- rejeite status desconhecido;
- rejeite ordenação desconhecida.

Não espalhe normalização por todas as specifications.

O record pode validar no construtor compacto ou uma factory pode criar o filtro normalizado.

---

### Intervalo de datas

Para limites inclusivos:

```java
builder.between(
        root.get("criadaEm"),
        inicio,
        fim
)
```

Quando somente o início existe:

```java
builder.greaterThanOrEqualTo(
        root.get("criadaEm"),
        inicio
)
```

Quando somente o fim existe:

```java
builder.lessThanOrEqualTo(
        root.get("criadaEm"),
        fim
)
```

Valide:

```text
inicio <= fim.
```

---

### Like case-insensitive

Exemplo:

```java
builder.like(
        builder.lower(
                root.join("cliente")
                        .get("nome")
        ),
        "%" + termo.toLowerCase(
                Locale.ROOT
        ) + "%"
)
```

O valor continua vinculado pelo provider.

A inclusão de `%` no valor não transforma a estrutura em concatenação insegura.

Ela apenas define o padrão do `LIKE`.

---

### IN

Para vários status:

```java
root.get("status")
        .in(statuses)
```

Semântica:

```text
status pertence ao conjunto.
```

Defina claramente:

```text
null:
sem filtro.

set vazio:
nenhum resultado;
ou sem filtro.
```

No laboratório:

```text
null:
sem filtro.

set vazio:
filtro inválido.
```

Isso evita busca acidental ampla.

---

### Join

Para filtrar pelo Cliente:

```java
Join<OrdemServicoEntity, ClienteEntity> cliente =
        root.join(
                "cliente",
                JoinType.INNER
        );
```

Para filtrar Atividades sem excluir Ordem sem Atividade, seria possível usar `LEFT`.

Nesta aula, o filtro `atividadeStatus` busca apenas Ordens que possuem uma Atividade correspondente.

Logo:

```text
INNER JOIN.
```

---

### Join pode multiplicar raizes

Uma Ordem com duas Atividades correspondentes pode aparecer em múltiplas linhas SQL.

A consulta deve definir:

```java
query.distinct(true);
```

quando uma specification cria join to-many.

A specification precisa comunicar essa necessidade de maneira controlada.

No laboratório, a specification de Atividade aplicará `query.distinct(true)`.

---

### Fetch nao e o foco da specification

Uma specification deve descrever filtros.

Misturar fetch indiscriminadamente dentro de cada specification pode:

- duplicar joins;
- quebrar count futuro;
- esconder plano;
- dificultar composição;
- causar fetch em casos que não precisam.

O repository terá uma opção explícita:

```java
boolean fetchCliente
```

Quando verdadeira, ele adicionará o fetch de Cliente uma única vez.

A regra de filtro continuará separada.

---

### Specification

Contrato:

```java
@FunctionalInterface
public interface JpaSpecification<T> {

    Predicate toPredicate(
            Root<T> root,
            CriteriaQuery<?> query,
            CriteriaBuilder builder
    );
}
```

Ele recebe os componentes necessários e devolve uma condição.

---

### Specification irrestrita

Crie:

```java
static <T> JpaSpecification<T> unrestricted() {
    return (
            root,
            query,
            builder
    ) -> builder.conjunction();
}
```

Essa specification representa ausência de filtro.

---

### Composicao AND

Método default:

```java
default JpaSpecification<T> and(
        JpaSpecification<T> other
) {
    return (
            root,
            query,
            builder
    ) -> builder.and(
            this.toPredicate(
                    root,
                    query,
                    builder
            ),
            other.toPredicate(
                    root,
                    query,
                    builder
            )
    );
}
```

O resultado exige as duas condições.

---

### Composicao OR

Método:

```java
default JpaSpecification<T> or(
        JpaSpecification<T> other
) {
    return (
            root,
            query,
            builder
    ) -> builder.or(
            this.toPredicate(
                    root,
                    query,
                    builder
            ),
            other.toPredicate(
                    root,
                    query,
                    builder
            )
    );
}
```

A precedência fica explícita pela composição de objetos.

---

### Negacao

Método:

```java
default JpaSpecification<T> not() {
    return (
            root,
            query,
            builder
    ) -> builder.not(
            this.toPredicate(
                    root,
                    query,
                    builder
            )
    );
}
```

Use somente quando a regra negativa é clara.

Exemplo:

```text
não cancelada.
```

---

### Specification e estado

Specifications devem ser:

- pequenas;
- imutáveis;
- sem `EntityManager` armazenado;
- sem transação;
- sem consulta executada internamente;
- sem efeitos colaterais;
- determinísticas para os mesmos argumentos.

Elas constroem predicates.

O repository executa a consulta.

---

### JPQL ou Criteria

Prefira JPQL quando:

- consulta é estática;
- estrutura é curta;
- poucos filtros;
- legibilidade é superior;
- fetch plan é conhecido.

Prefira Criteria quando:

- filtros são opcionais;
- combinações crescem;
- predicates são reutilizados;
- joins dependem da entrada;
- ordenação é dinâmica e controlada;
- a consulta precisa ser montada programaticamente.

Não reescreva toda JPQL em Criteria por moda.

---

### Specifications nao eliminam complexidade

Uma árvore de specifications mal organizada pode ficar tão difícil quanto uma string dinâmica.

Sinais de problema:

- dezenas de classes minúsculas sem valor;
- joins duplicados;
- effects em `query`;
- regras de negócio misturadas;
- predicates com nomes genéricos;
- composição impossível de entender;
- ausência de testes de combinação.

Use specifications para regras de consulta com nome e significado.

---

### Ordenacao segura

Não aceite uma string arbitrária e faça:

```java
root.get(input)
```

Isso permite atributos inválidos e expõe detalhes internos.

Use enum:

```java
public enum OrderByOption {
    CODIGO_ASC,
    CRIADA_EM_DESC,
    STATUS_ASC
}
```

O repository traduz cada opção para:

```java
builder.asc(...);

builder.desc(...).
```

A aula 341 aprofundará paginação e ordenação.

Aqui, a ordenação servirá somente para provar Criteria API segura.

---

### Resultado managed

A consulta retorna entidades managed.

Logo:

- participam do persistence context;
- podem inicializar associações;
- podem sofrer dirty checking;
- não são DTOs;
- não devem ser serializadas diretamente.

A próxima aula tratará resultados específicos.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\java\br\com\formacao\m13\aula339\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\java\br\com\formacao\m13\aula339\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\java\br\com\formacao\m13\aula339\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\java\br\com\formacao\m13\aula339\query"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\java\br\com\formacao\m13\aula339\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-339-criteria-api-specifications\src\test\java\br\com\formacao\m13\aula339"

Set-Location `
  "labs\m13\aula-339-criteria-api-specifications"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 338.

Ajuste:

```text
artifactId:
aula-339-criteria-api-specifications.

persistence unit:
aula339PU.

Main:
br.com.formacao.m13.aula339.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_339
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-339-jpa
JPA_POOL_NAME=aula-339-pool
JPA_POOL_SIZE=4
```

---

### 3. Criar migration

Crie:

```text
cliente;

ordem_servico;

atividade.
```

Sequences:

```text
cliente:
339001.

ordem:
339101.

atividade:
339201.
```

Mantenha:

- foreign keys;
- índices;
- status;
- timestamps;
- versões;
- sem delete cascade físico.

---

### 4. Reutilizar entidades

Mappings:

```text
Ordem -> Cliente:
ManyToOne LAZY.

Cliente -> Ordens:
OneToMany LAZY.

Ordem -> Atividades:
OneToMany LAZY.
```

Adicione getters simples para:

```text
codigo;

status;

criadaEm;

cliente;

atividades.
```

Não adicione DTOs.

---

### 5. Criar OrderByOption.java

```java
package br.com.formacao.m13.aula339.query;

public enum OrderByOption {
    CODIGO_ASC,
    CRIADA_EM_DESC,
    STATUS_ASC
}
```

Não aceite nomes de atributos vindos diretamente do usuário.

---

### 6. Criar OrdemServicoSearchFilter.java

```java
package br.com.formacao.m13.aula339.query;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.Set;

public record OrdemServicoSearchFilter(
        String codigo,
        String status,
        String clienteNome,
        Boolean clienteAtivo,
        OffsetDateTime criadaDe,
        OffsetDateTime criadaAte,
        Set<String> qualquerStatus,
        String atividadeStatus,
        OrderByOption orderBy,
        boolean fetchCliente
) {

    public OrdemServicoSearchFilter {
        codigo = normalizeText(codigo);
        status = normalizeUpper(status);
        clienteNome = normalizeText(clienteNome);
        atividadeStatus =
                normalizeUpper(
                        atividadeStatus
                );

        qualquerStatus =
                qualquerStatus == null
                        ? null
                        : qualquerStatus.stream()
                                .map(
                                        value ->
                                                normalizeUpper(
                                                        value
                                                )
                                )
                                .collect(
                                        java.util.stream
                                                .Collectors
                                                .toUnmodifiableSet()
                                );

        if (
            qualquerStatus != null
            && qualquerStatus.isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "qualquerStatus não pode ser vazio"
            );
        }

        if (
            criadaDe != null
            && criadaAte != null
            && criadaDe.isAfter(criadaAte)
        ) {
            throw new IllegalArgumentException(
                    "criadaDe deve ser anterior a criadaAte"
            );
        }

        orderBy =
                orderBy == null
                        ? OrderByOption.CODIGO_ASC
                        : orderBy;
    }

    private static String normalizeText(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private static String normalizeUpper(
            String value
    ) {
        String normalized =
                normalizeText(value);

        return normalized == null
                ? null
                : normalized.toUpperCase(
                        Locale.ROOT
                );
    }
}
```

Valide status permitidos em método separado ou enum de domínio.

---

### 7. Criar JpaSpecification.java

```java
package br.com.formacao.m13.aula339.query;

import java.util.Objects;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@FunctionalInterface
public interface JpaSpecification<T> {

    Predicate toPredicate(
            Root<T> root,
            CriteriaQuery<?> query,
            CriteriaBuilder builder
    );

    default JpaSpecification<T> and(
            JpaSpecification<T> other
    ) {
        Objects.requireNonNull(other);

        return (
                root,
                query,
                builder
        ) -> builder.and(
                toPredicate(
                        root,
                        query,
                        builder
                ),
                other.toPredicate(
                        root,
                        query,
                        builder
                )
        );
    }

    default JpaSpecification<T> or(
            JpaSpecification<T> other
    ) {
        Objects.requireNonNull(other);

        return (
                root,
                query,
                builder
        ) -> builder.or(
                toPredicate(
                        root,
                        query,
                        builder
                ),
                other.toPredicate(
                        root,
                        query,
                        builder
                )
        );
    }

    default JpaSpecification<T> not() {
        return (
                root,
                query,
                builder
        ) -> builder.not(
                toPredicate(
                        root,
                        query,
                        builder
                )
        );
    }

    static <T> JpaSpecification<T> unrestricted() {
        return (
                root,
                query,
                builder
        ) -> builder.conjunction();
    }
}
```

---

### 8. Criar OrdemServicoSpecifications.java

Factories:

```java
static JpaSpecification<OrdemServicoEntity>
codigoContem(String codigo)

static JpaSpecification<OrdemServicoEntity>
statusIgualA(String status)

static JpaSpecification<OrdemServicoEntity>
clienteNomeContem(String nome)

static JpaSpecification<OrdemServicoEntity>
clienteAtivo(boolean ativo)

static JpaSpecification<OrdemServicoEntity>
criadaDe(OffsetDateTime inicio)

static JpaSpecification<OrdemServicoEntity>
criadaAte(OffsetDateTime fim)

static JpaSpecification<OrdemServicoEntity>
statusEm(Set<String> statuses)

static JpaSpecification<OrdemServicoEntity>
possuiAtividadeComStatus(String status)
```

Cada factory retorna unrestricted quando o valor é ausente, exceto set vazio, que já foi rejeitado pelo filtro.

---

### 9. Implementar specification de status

```java
public static JpaSpecification<OrdemServicoEntity>
statusIgualA(
        String status
) {
    if (status == null) {
        return JpaSpecification.unrestricted();
    }

    return (
            root,
            query,
            builder
    ) -> builder.equal(
            root.get("status"),
            status
    );
}
```

---

### 10. Implementar nome do Cliente

```java
public static JpaSpecification<OrdemServicoEntity>
clienteNomeContem(
        String nome
) {
    if (nome == null) {
        return JpaSpecification.unrestricted();
    }

    String pattern =
            "%" + nome.toLowerCase(
                    Locale.ROOT
            ) + "%";

    return (
            root,
            query,
            builder
    ) -> builder.like(
            builder.lower(
                    root.join(
                            "cliente",
                            JoinType.INNER
                    )
                            .get("nome")
            ),
            pattern
    );
}
```

---

### 11. Implementar periodo

Use duas specifications separadas:

```java
criadaDe(inicio);

criadaAte(fim);
```

Isso facilita composição.

Exemplo:

```java
return (
        root,
        query,
        builder
) -> builder.greaterThanOrEqualTo(
        root.get("criadaEm"),
        inicio
);
```

---

### 12. Implementar IN

```java
public static JpaSpecification<OrdemServicoEntity>
statusEm(
        Set<String> statuses
) {
    if (statuses == null) {
        return JpaSpecification.unrestricted();
    }

    return (
            root,
            query,
            builder
    ) -> root.get("status")
            .in(statuses);
}
```

---

### 13. Implementar join de Atividade

```java
public static JpaSpecification<OrdemServicoEntity>
possuiAtividadeComStatus(
        String status
) {
    if (status == null) {
        return JpaSpecification.unrestricted();
    }

    return (
            root,
            query,
            builder
    ) -> {
        query.distinct(true);

        return builder.equal(
                root.join(
                        "atividades",
                        JoinType.INNER
                )
                        .get("status"),
                status
        );
    };
}
```

O `distinct` evita raízes duplicadas.

---

### 14. Criar CriteriaOrderRepository.java

Método:

```java
public List<OrdemServicoEntity> search(
        OrdemServicoSearchFilter filter
)
```

Passos:

1. obter builder;
2. criar query;
3. criar root;
4. adicionar fetch opcional de Cliente;
5. montar specification;
6. obter predicate;
7. definir `where`;
8. definir ordenação;
9. criar TypedQuery;
10. executar.

---

### 15. Montar specification do filtro

```java
JpaSpecification<OrdemServicoEntity> specification =
        JpaSpecification
                .<OrdemServicoEntity>unrestricted()
                .and(
                        codigoContem(
                                filter.codigo()
                        )
                )
                .and(
                        statusIgualA(
                                filter.status()
                        )
                )
                .and(
                        clienteNomeContem(
                                filter.clienteNome()
                        )
                )
                .and(
                        clienteAtivoOpcional(
                                filter.clienteAtivo()
                        )
                )
                .and(
                        criadaDe(
                                filter.criadaDe()
                        )
                )
                .and(
                        criadaAte(
                                filter.criadaAte()
                        )
                )
                .and(
                        statusEm(
                                filter.qualquerStatus()
                        )
                )
                .and(
                        possuiAtividadeComStatus(
                                filter.atividadeStatus()
                        )
                );
```

Não misture `status` simples com `qualquerStatus` sem definir a semântica.

No laboratório, se ambos forem informados, as regras serão combinadas com `AND`.

---

### 16. Aplicar fetch opcional

```java
if (filter.fetchCliente()) {
    root.fetch(
            "cliente",
            JoinType.INNER
    );
}
```

Não coloque fetch dentro de cada specification.

---

### 17. Aplicar ordenacao

```java
switch (filter.orderBy()) {
    case CODIGO_ASC ->
            query.orderBy(
                    builder.asc(
                            root.get("codigo")
                    )
            );

    case CRIADA_EM_DESC ->
            query.orderBy(
                    builder.desc(
                            root.get("criadaEm")
                    )
            );

    case STATUS_ASC ->
            query.orderBy(
                    builder.asc(
                            root.get("status")
                    ),
                    builder.asc(
                            root.get("codigo")
                    )
            );
}
```

A ordenação recebe desempate previsível quando necessário.

---

### 18. Criar CriteriaObservation.java

```java
package br.com.formacao.m13.aula339.lab;

public record CriteriaObservation(
        String scenario,
        int resultCount,
        long selectCount,
        boolean distinctApplied,
        boolean clienteLoaded,
        String firstCode,
        String lastCode
) {

    public CriteriaObservation {
        if (
            scenario == null
            || scenario.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "cenário obrigatório"
            );
        }
    }
}
```

---

### 19. Criar CriteriaReport.java

```java
package br.com.formacao.m13.aula339.lab;

import java.util.List;

public record CriteriaReport(
        List<CriteriaObservation> observations,
        boolean optionalFiltersWorked,
        boolean andCompositionWorked,
        boolean orCompositionWorked,
        boolean inPredicateWorked,
        boolean dateRangeWorked,
        boolean joinFilterWorked,
        boolean distinctPreventedDuplicates,
        boolean safeOrderingWorked,
        boolean noSpringSpecificationWasUsed
) {

    public CriteriaReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 20. Criar fixtures

Crie três Clientes:

```text
CLI-JPA-339-ALFA:
ativo.

CLI-JPA-339-BETA:
ativo.

CLI-JPA-339-GAMA:
inativo.
```

Crie seis Ordens:

```text
OS-JPA-339-001:
ALFA;
ABERTA;
2026-07-01.

OS-JPA-339-002:
ALFA;
AGENDADA;
2026-07-02.

OS-JPA-339-003:
BETA;
ABERTA;
2026-07-03.

OS-JPA-339-004:
BETA;
CONCLUIDA;
2026-07-04.

OS-JPA-339-005:
GAMA;
ABERTA;
2026-07-05.

OS-JPA-339-006:
GAMA;
CANCELADA;
2026-07-06.
```

Adicione Atividades:

```text
001:
duas CONCLUIDAS.

002:
uma PENDENTE.

003:
uma CONCLUIDA.

004:
uma CANCELADA.

005:
nenhuma.

006:
uma PENDENTE.
```

O cenário de duas Atividades CONCLUIDAS na Ordem 001 comprovará `distinct`.

---

### 21. Cenário sem filtros

Crie filtro com todos os campos opcionais ausentes e ordenação por código.

Confirme:

```text
seis resultados;

ordem 001 primeiro;

ordem 006 último;

um SELECT.
```

O repository pode sempre aplicar um prefixo interno de fixture no laboratório, ou o filtro deve incluir código `OS-JPA-339-`.

Não execute busca irrestrita contra dados externos.

---

### 22. Cenário status

Filtro:

```text
status ABERTA.
```

Esperado:

```text
001;

003;

005.
```

Confirme três resultados.

---

### 23. Cenário AND

Combine:

```text
status ABERTA;

clienteAtivo true.
```

Esperado:

```text
001;

003.
```

A Ordem 005 pertence a Cliente inativo e deve ser excluída.

---

### 24. Cenário nome do Cliente

Filtro:

```text
clienteNome contém "beta".
```

Esperado:

```text
003;

004.
```

A comparação deve ser case-insensitive.

---

### 25. Cenário periodo

Filtro:

```text
criadaDe:
2026-07-02T00:00-03:00.

criadaAte:
2026-07-04T23:59:59-03:00.
```

Esperado:

```text
002;

003;

004.
```

Confirme limites inclusivos.

---

### 26. Cenário IN

Filtro:

```text
qualquerStatus:
ABERTA;
AGENDADA.
```

Esperado:

```text
001;

002;

003;

005.
```

---

### 27. Cenário OR explícito

Fora do filtro padrão, crie specification:

```java
statusIgualA("CONCLUIDA")
        .or(
                statusIgualA(
                        "CANCELADA"
                )
        );
```

Execute método overload do repository:

```java
search(
        specification,
        OrderByOption.CODIGO_ASC,
        false
);
```

Esperado:

```text
004;

006.
```

Isso prova composição OR sem criar uma string JPQL alternativa.

---

### 28. Cenário Atividade e distinct

Filtro:

```text
atividadeStatus:
CONCLUIDA.
```

Esperado:

```text
001;

003.
```

A Ordem 001 possui duas Atividades correspondentes, mas deve aparecer uma vez.

Confirme:

```text
query.distinct true;

dois resultados únicos.
```

---

### 29. Cenário fetch Cliente

Execute a mesma busca com:

```text
fetchCliente true.
```

Confirme:

```text
Cliente loaded;

acesso ao nome sem SELECT adicional.
```

A specification de filtro permanece a mesma.

---

### 30. Cenário ordenacao

Teste:

```text
CODIGO_ASC;

CRIADA_EM_DESC;

STATUS_ASC.
```

Confirme primeiro e último elementos esperados.

Não aceite um nome arbitrário de coluna.

---

### 31. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. prepara fixtures;
4. executa cenários;
5. imprime observações;
6. remove fixtures;
7. não imprime entidades completas;
8. não imprime SQL integral;
9. fecha runtime.

Formato:

```text
cenário | resultados | SELECTs | distinct | cliente loaded | primeiro | último
```

---

### 32. Criar CriteriaFundamentalsIT.java

Casos:

#### Consulta base

- builder;
- criteria query;
- root;
- select;
- order by;
- resultado correto.

#### Equal

- status;
- quantidade.

#### Like

- código contém;
- case-insensitive quando aplicável.

#### Range

- data inicial;
- data final;
- between.

---

### 33. Criar DynamicFiltersIT.java

Casos:

#### Todos ausentes

- nenhuma exceção;
- resultados do prefixo.

#### Um filtro

- status.

#### Vários filtros

- status;
- Cliente ativo;
- período.

#### Intervalo inválido

- construtor do filtro rejeita.

#### Set vazio

- filtro rejeita.

#### Strings em branco

- normalizadas para ausência.

---

### 34. Criar SpecificationCompositionIT.java

Casos:

#### AND

- duas specifications;
- interseção.

#### OR

- dois status;
- união.

#### NOT

- não cancelada;
- cinco resultados.

#### Unrestricted

- não altera resultado.

#### Reuso

- mesma specification aplicada em dois managers;
- mesmo resultado;
- sem estado interno.

---

### 35. Criar CriteriaJoinDistinctIT.java

Casos:

#### Join Cliente

- filtrar nome;
- resultado correto.

#### Join Atividade

- filtrar status;
- Ordem com duas Atividades aparece uma vez.

#### Fetch separado

- filtro sem fetch;
- Cliente lazy.

- mesmo filtro com fetch;
- Cliente loaded.

#### JoinType

- inner join de Atividade exclui Ordem sem Atividade correspondente.

---

### 36. Criar SafeOrderingIT.java

Casos:

#### Código ascendente

- ordem esperada.

#### Data descendente

- 006 primeiro;
- 001 último.

#### Status e desempate

- grupos por status;
- código estável.

#### Entrada externa

O código de aplicação converte entrada para enum antes do repository.

Valor desconhecido deve falhar antes de chegar à Criteria API.

---

### 37. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_339.atividade
WHERE codigo LIKE 'ATV-JPA-339-%';

DELETE FROM jpa_339.ordem_servico
WHERE codigo LIKE 'OS-JPA-339-%';

DELETE FROM jpa_339.cliente
WHERE codigo LIKE 'CLI-JPA-339-%';
```

Use antes e depois de cada teste.

---

### 38. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_339.
```

`02_executar_migration.ps1`:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

`03_executar_laboratorio.ps1`:

```powershell
mvn clean verify
mvn exec:java
```

`04_validar_estado_final.ps1` exige:

```text
zero CLI-JPA-339-%;

zero OS-JPA-339-%;

zero ATV-JPA-339-%;

foreign keys e índices existentes;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 39. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
filtros opcionais funcionaram;

AND funcionou;

OR funcionou;

NOT funcionou;

IN funcionou;

período funcionou;

join de Cliente funcionou;

join de Atividade usou distinct;

fetch ficou separado;

ordenação foi segura;

nenhum Spring Data foi usado;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 40. Criar documentacao

`fundamentos-criteria-api.md` deve registrar:

- builder;
- query;
- root;
- path;
- predicate;
- join;
- order;
- typed query;
- resultado managed.

`contrato-specification.md` deve registrar:

```text
entrada;

saída;

imutabilidade;

ausência de EntityManager;

ausência de execução;

composição;

unrestricted.
```

`composicao-and-or.md` deve mostrar árvores:

```text
AND(
    status ABERTA,
    cliente ATIVO
)

OR(
    status CONCLUIDA,
    status CANCELADA
)
```

`filtros-opcionais.md` deve registrar:

- null;
- blank;
- set vazio;
- intervalo inválido;
- normalização;
- semântica de ausência.

`criterios-de-escolha-jpql-vs-criteria.md` deve comparar:

```text
estrutura estática;

estrutura dinâmica;

legibilidade;

reuso;

teste;

join;

manutenção.
```

`troubleshooting-criteria.md` deve cobrir:

- atributo incorreto;
- tipo incompatível;
- predicate ausente;
- join duplicado;
- raiz duplicada;
- `distinct`;
- OR com precedência;
- ordenação arbitrária;
- specification com estado;
- fetch em count futuro.

---

## Entendendo o que foi feito

### Criteria API deixou a consulta dinamica

Somente filtros presentes produziram predicates.

### Specification separou regras de consulta

Cada condição recebeu nome, teste e composição.

### AND e OR ficaram explicitos

A árvore de objetos substituiu concatenação de strings.

### Joins foram adicionados quando necessarios

Filtros por Cliente e Atividade criaram navegação controlada.

### Fetch permaneceu decisao do caso de uso

A regra de filtro não passou a controlar automaticamente o plano de carregamento.

---

## Erros comuns importantes

### Reescrever toda JPQL em Criteria

Use Criteria quando a estrutura realmente varia.

### Retornar null em toda specification

Prefira uma política consistente como unrestricted.

### Misturar fetch e filtro sem criterio

Isso dificulta composição e consultas futuras.

### Aceitar atributo de ordenacao livre

Mapeie entrada para enum.

### Esquecer distinct em join to-many

A raiz pode aparecer repetida.

---

## Comandos uteis

### Migration

```powershell
mvn flyway:migrate
mvn flyway:validate
```

### Testes

```powershell
mvn clean verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Conferir fixtures

```sql
SELECT
    ordem.codigo,
    ordem.status,
    cliente.codigo AS cliente_codigo,
    ordem.criada_em,
    count(atividade.id) AS atividades
FROM jpa_339.ordem_servico AS ordem
JOIN jpa_339.cliente AS cliente
    ON cliente.id = ordem.cliente_id
LEFT JOIN jpa_339.atividade AS atividade
    ON atividade.ordem_servico_id = ordem.id
GROUP BY
    ordem.codigo,
    ordem.status,
    cliente.codigo,
    ordem.criada_em
ORDER BY ordem.codigo;
```

---

## Exercicio guiado

### Parte 1 — Filtro por codigo exato

Crie:

```java
codigoIgualA
```

Compare com `codigoContem`.

Documente quando cada um é correto.

### Parte 2 — OR agrupado

Monte:

```text
cliente ativo
AND
(status ABERTA OR status AGENDADA).
```

Confirme a precedência pela composição.

### Parte 3 — Sem Atividades

Crie specification usando subquery ou left join controlado para encontrar Ordens sem Atividades.

Não antecipe projection.

### Parte 4 — Join reutilizado

Estude uma forma de evitar joins duplicados quando duas specifications usam Cliente.

Documente a complexidade antes de abstrair.

### Parte 5 — ParameterExpression

Reescreva uma specification usando parâmetro nomeado explícito.

Compare legibilidade e binding.

### Parte 6 — Ordenacao

Adicione:

```text
CLIENTE_NOME_ASC.
```

Use join somente quando necessário.

### Parte 7 — Criteria versus JPQL

Implemente a mesma consulta estática nas duas formas.

Compare:

- linhas de código;
- clareza;
- segurança;
- flexibilidade;
- teste.

### Parte 8 — ADR

Registre:

```text
JPQL para consultas estáticas;

Criteria para filtros combináveis;

Specification própria sem Spring;

fetch separado do predicate;

enum para ordenação;

entidades como resultado apenas nesta aula.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 339 existe;
- continuidade com a aula 338 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_339` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- três entidades foram reutilizadas;
- Criteria API foi definida;
- `CriteriaBuilder` foi usado;
- `CriteriaQuery` foi usado;
- `Root` foi usado;
- `Path` foi explicado;
- `Predicate` foi usado;
- TypedQuery foi usada;
- igualdade foi praticada;
- like foi praticado;
- lower case foi praticado;
- intervalo foi praticado;
- limites inclusivos foram definidos;
- IN foi praticado;
- join foi praticado;
- JoinType foi discutido;
- AND foi praticado;
- OR foi praticado;
- NOT foi praticado;
- conjunction foi explicada;
- disjunction foi explicada;
- parâmetros seguros foram discutidos;
- concatenação insegura não foi usada;
- filtro record foi criado;
- strings em branco foram normalizadas;
- status foi normalizado;
- intervalo inválido foi rejeitado;
- set vazio foi rejeitado;
- ausência de filtro foi definida;
- specification própria foi criada;
- Spring Data Specification não foi usada;
- `toPredicate` foi definido;
- `unrestricted` foi criado;
- composição `and` foi criada;
- composição `or` foi criada;
- composição `not` foi criada;
- specifications foram imutáveis;
- specifications não armazenaram EntityManager;
- specifications não executaram query;
- factories de regras foram criadas;
- status foi filtrado;
- nome de Cliente foi filtrado;
- Cliente ativo foi filtrado;
- período foi filtrado;
- vários status foram filtrados;
- Atividade por status foi filtrada;
- join to-many aplicou distinct;
- Ordem com duas Atividades apareceu uma vez;
- fetch de Cliente ficou separado;
- mapping permaneceu LAZY;
- acesso com fetch evitou SELECT posterior;
- ordenação usou enum;
- entrada arbitrária foi rejeitada;
- desempate foi definido;
- resultado continuou entidade managed;
- projection não foi antecipada;
- Criteria foi comparada com JPQL;
- limites de legibilidade foram discutidos;
- SQL foi observado sem bindings;
- testes de fundamentos foram criados;
- testes de filtros dinâmicos foram criados;
- testes de composição foram criados;
- testes de join e distinct foram criados;
- testes de ordenação foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- paginação completa não foi antecipada;
- count paginado não foi antecipado;
- projections não foram antecipadas;
- Spring não foi usado;
- ponte para a aula 340 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Confirme que não aparece:

```text
config/jpa.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-339-criteria-api-specifications
```

Commit recomendado:

```powershell
git commit -m "feat(m13): compor consultas com criteria e specifications"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você construiu consultas dinâmicas sem concatenar JPQL.

Aprendeu:

```text
CriteriaBuilder:
cria expressões.

CriteriaQuery:
representa a consulta.

Root:
entidade principal.

Path:
atributo navegado.

Predicate:
condição.

Join:
navegação entre entidades.

Specification:
regra reutilizável.

AND, OR e NOT:
composição lógica.

OrderByOption:
ordenação controlada.
```

O laboratório comprovou:

```text
filtros opcionais;

normalização;

status;

nome de Cliente;

Cliente ativo;

período;

IN;

AND;

OR;

NOT;

join de Atividade;

distinct;

fetch separado;

ordenação segura.
```

A decisão arquitetural foi:

```text
JPQL:
consulta estática e legível.

Criteria:
estrutura dinâmica.

Specification:
predicate reutilizável.

Spring Data:
não necessário para compreender o padrão.
```

A próxima aula será:

```text
340 - M13.30 - Projections DTO interface e record
```

Nela, você aprenderá:

- diferença entre entidade e resultado de leitura;
- selecionar somente colunas necessárias;
- constructor expression em JPQL;
- DTO clássico;
- interface projection como contrato;
- record projection;
- alias;
- mapeamento manual;
- `Tuple`;
- tipos;
- imutabilidade;
- consultas de relatório;
- redução de dados;
- ausência de dirty checking em projections;
- limites de projections aninhadas;
- comparação de custo e clareza;
- testes de resultado.

A aula 339 construiu dinamicamente o filtro.

A aula 340 construirá resultados específicos sem carregar entidades completas.

---

# Material complementar

## Checkpoint final

- [ ] Usei CriteriaBuilder, CriteriaQuery e Root.
- [ ] Criei predicates opcionais e compostos.
- [ ] Implementei Specification própria sem Spring.
- [ ] Separei filtro, fetch e execução.
- [ ] Mantive retorno de entidades para preparar a aula de projections.

---

## Troubleshooting adicional

### Could not resolve attribute

Use o nome do atributo Java.

### Resultado duplicado

Aplique `query.distinct(true)` em join to-many.

### Filtro ausente eliminou resultados

Use unrestricted ou conjunction conforme a política.

### OR retornou dados errados

Revise agrupamento e precedência.

### Ordenacao falhou

Converta entrada para enum permitido.

---

## Perguntas de revisao

1. O que é Criteria API?
2. O que faz CriteriaBuilder?
3. O que representa CriteriaQuery?
4. O que é Root?
5. O que é Path?
6. O que é Predicate?
7. Como combinar AND?
8. Como combinar OR?
9. O que faz conjunction?
10. Quando usar distinct?
11. O que é Specification?
12. Ela executa consulta?
13. Ela armazena EntityManager?
14. Spring Data foi usado?
15. Quando preferir JPQL?
16. Quando preferir Criteria?
17. Por que usar enum na ordenação?
18. O resultado foi DTO?
19. Paginação foi aprofundada?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. API programática de consultas.
2. Cria expressões.
3. Consulta tipada.
4. Entidade principal.
5. Caminho de atributo.
6. Condição booleana.
7. Builder ou specification and.
8. Builder ou specification or.
9. Predicate verdadeiro.
10. Quando join multiplica raízes.
11. Regra que cria Predicate.
12. Não.
13. Não.
14. Não.
15. Em consultas estáticas.
16. Em filtros dinâmicos.
17. Para segurança e controle.
18. Não; entidade managed.
19. Não.
20. Projections DTO interface e record.

---

## Desafio opcional

Crie:

```java
SpecificationTreePrinter
```

Entrada:

```text
AND;

OR;

NOT;

nome das regras;

valores mascarados.
```

Saída:

```text
árvore Markdown.
```

Regras:

- não expor valores sensíveis;
- não depender de Hibernate;
- não executar query;
- preservar precedência;
- produzir saída determinística;
- possuir testes unitários;
- ajudar troubleshooting sem substituir predicates reais.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 339 - M13.29 - Criteria API e Specifications

- Aprofundei Criteria API.
- Usei `CriteriaBuilder`.
- Usei `CriteriaQuery`.
- Usei `Root`.
- Entendi `Path`.
- Criei `Predicate`.
- Criei consultas tipadas.
- Pratiquei igualdade.
- Pratiquei `like` case-insensitive.
- Pratiquei intervalos de datas.
- Pratiquei `IN`.
- Pratiquei joins.
- Combinei predicates com `AND`.
- Combinei predicates com `OR`.
- Pratiquei negação.
- Entendi conjunction e disjunction.
- Criei filtro record normalizado.
- Rejeitei intervalo inválido.
- Rejeitei conjunto vazio.
- Criei `JpaSpecification<T>` própria.
- Não usei Spring Data.
- Criei `unrestricted`.
- Criei composição `and`, `or` e `not`.
- Mantive specifications imutáveis.
- Separei criação de predicate da execução.
- Criei factories para regras de Ordem.
- Filtrei por Cliente e Atividade.
- Usei `distinct` em join to-many.
- Separei fetch de Cliente das specifications.
- Mantive mappings LAZY.
- Criei ordenação segura por enum.
- Comparei JPQL estática com Criteria dinâmica.
- Mantive retorno de entidades nesta aula.
- Não antecipei projections ou paginação completa.
- Mantive Flyway no DDL e Hibernate em validate.
- Próxima aula: Projections DTO interface e record.
```

---

## Referencia tecnica curta

```text
CriteriaBuilder:
fábrica.

CriteriaQuery:
consulta.

Root:
from.

Path:
atributo.

Predicate:
condição.

Join:
associação.

Specification:
regra reutilizável.

AND:
interseção.

OR:
união.

Distinct:
raízes únicas.

Enum:
ordenação segura.
```

Regra final:

```text
Criteria API deve ser usada quando a estrutura da consulta realmente varia; specifications pequenas, imutaveis e sem efeitos colaterais permitem compor predicates com clareza, enquanto fetch, ordenacao, execucao e formato do resultado permanecem decisoes explicitas do caso de uso.
```
