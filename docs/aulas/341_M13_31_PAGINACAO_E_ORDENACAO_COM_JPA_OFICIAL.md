# 341 - M13.31 - Paginacao e ordenacao com JPA

## Apresentacao da aula

Na aula 340, você separou o modelo persistente do modelo de leitura.

Foram praticados:

```text
DTO clássico;

record;

interface como contrato;

Tuple;

constructor expression;

count;

group by.
```

A consulta de resumo passou a retornar somente os campos necessários:

```text
ID da Ordem;

código;

status;

nome do Cliente;

quantidade de Atividades;

data de criação.
```

Isso reduziu o acoplamento com entidades e eliminou dirty checking do resultado.

Entretanto, uma listagem real não deve carregar todos os registros de uma vez.

Considere uma base com:

```text
50 Ordens;

5.000 Ordens;

500.000 Ordens.
```

Mesmo usando projection, retornar tudo pode causar:

- consumo elevado de memória;
- resposta lenta;
- tráfego desnecessário;
- conexão ocupada por mais tempo;
- pressão no banco;
- tempo de serialização;
- dificuldade de navegação;
- resultados instáveis entre requisições.

Nesta aula, você implementará paginação e ordenação diretamente com JPA.

As operações centrais serão:

```java
setFirstResult(int startPosition)

setMaxResults(int maxResult)
```

A ideia será:

```text
página:
qual bloco o consumidor deseja.

tamanho:
quantos itens cabem no bloco.

offset:
quantos itens devem ser ignorados.
```

Para uma paginação baseada em zero:

```text
página 0:
primeiros itens.

página 1:
segundo bloco.

página 2:
terceiro bloco.
```

Fórmula:

```text
offset = pageNumber * pageSize.
```

Exemplo:

```text
pageNumber:
2.

pageSize:
10.

offset:
20.
```

A consulta de conteúdo precisa ser acompanhada por uma consulta de total.

Sem o total, o consumidor não consegue calcular com segurança:

- total de elementos;
- total de páginas;
- primeira página;
- última página;
- página além do final.

O laboratório criará contratos próprios:

```text
PageRequest;

PageResult<T>;

OrderSort;

SortDirection.
```

Nenhum tipo do Spring Data será usado.

Também serão aplicados critérios profissionais:

- página baseada em zero;
- tamanho mínimo;
- tamanho máximo;
- validação de overflow;
- ordenação permitida;
- desempate obrigatório por ID;
- consulta de conteúdo;
- consulta de count;
- mesmos filtros nas duas consultas;
- projection paginada;
- página vazia;
- página além do final;
- total de páginas;
- resultado imutável;
- SQL observado;
- risco de fetch join de coleção;
- introdução conceitual a keyset pagination.

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
formacao_java_jpa_341
```

O schema será:

```text
jpa_341
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

A leitura paginada usará:

```text
OrdemResumoRecord.
```

O laboratório comprovará:

```text
20 Ordens didáticas;

página 0 com 5 itens;

página 1 com 5 itens;

última página com 5 itens;

página além do final vazia;

total de elementos 20;

total de páginas 4;

ordenação estável;

desempate por ID;

count coerente com filtro;

tamanho acima do limite rejeitado;

offset inválido rejeitado;

zero fixtures ao final.
```

A próxima aula será:

```text
342 - M13.32 - Lock otimista
```

Por isso, esta aula não aprofundará:

- concorrência de atualização;
- conflito de versão;
- `OptimisticLockException`;
- retries;
- lock pessimista;
- `SELECT FOR UPDATE`;
- transações concorrentes;
- Spring Data `Page`;
- `Pageable`;
- cursor HTTP;
- implementação completa de keyset pagination.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
338:
JPQL select join fetch.

339:
Criteria API e Specifications.

340:
Projections DTO interface e record.

341:
Paginacao e ordenacao com JPA.

342:
Lock otimista.

343:
Lock pessimista.
```

A aula 338 planejou o carregamento.

A aula 339 tornou os filtros dinâmicos.

A aula 340 definiu resultados de leitura enxutos.

Agora você controlará:

```text
quantos resultados retornar;

em que ordem retornar;

como calcular o total.
```

Nesta aula:

```text
setFirstResult:
sim.

setMaxResults:
sim.

page number:
sim.

page size:
sim.

offset:
sim.

count query:
sim.

projection paginada:
sim.

ordenação estável:
sim.

tamanho máximo:
sim.

página vazia:
sim.

collection fetch paginado:
desaconselhado.

keyset:
somente introdução.

Spring Data:
não.
```

A arquitetura será:

```text
PageRequest
    -> valida página, tamanho e ordenação
        -> repository
            -> consulta de conteúdo
            -> consulta de total
                -> PageResult<OrdemResumoRecord>.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-341-paginacao-ordenacao-jpa
```

Estrutura final:

```text
labs
└── m13
    └── aula-341-paginacao-ordenacao-jpa
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── contrato-page-request.md
        │   ├── contrato-page-result.md
        │   ├── ordenacao-estavel.md
        │   ├── content-e-count.md
        │   ├── offset-vs-keyset.md
        │   └── troubleshooting-paginacao.md
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
            │   │                   └── aula341
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   ├── AtividadeEntity.java
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── PaginationLab.java
            │   │                       │   ├── PaginationObservation.java
            │   │                       │   └── PaginationReport.java
            │   │                       ├── pagination
            │   │                       │   ├── OrderSort.java
            │   │                       │   ├── PageRequest.java
            │   │                       │   ├── PageResult.java
            │   │                       │   └── SortDirection.java
            │   │                       ├── projection
            │   │                       │   └── OrdemResumoRecord.java
            │   │                       ├── query
            │   │                       │   ├── OrdemPageFilter.java
            │   │                       │   └── PaginatedOrderRepository.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_341.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula341
                                        ├── PageRequestTest.java
                                        ├── PageResultTest.java
                                        ├── JpaOffsetPaginationIT.java
                                        ├── StableOrderingIT.java
                                        ├── FilteredCountIT.java
                                        ├── PaginationBoundaryIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
page 0 size 5:
itens 1 a 5.

page 1 size 5:
itens 6 a 10.

page 3 size 5:
itens 16 a 20.

page 4 size 5:
conteúdo vazio.

total:
20.

totalPages:
4.

first:
true somente na página 0.

last:
true na página 3 e também em página vazia além do total.

hasNext:
false na última página válida.

hasPrevious:
false na primeira página.
```

---

## Conceito essencial

### Paginacao por offset

A paginação tradicional baseada em offset informa ao banco:

```text
ignore os primeiros X registros;

retorne no máximo Y registros.
```

Em JPA:

```java
typedQuery.setFirstResult(offset);
typedQuery.setMaxResults(pageSize);
```

O provider traduz para a sintaxe adequada ao banco.

No PostgreSQL, o SQL normalmente usa:

```text
offset;

fetch first;
ou limit.
```

O código JPA permanece portável.

---

### Pagina baseada em zero

O laboratório adotará:

```text
primeira página:
0.
```

Vantagens:

- combina com `setFirstResult`;
- fórmula simples;
- comum em APIs;
- evita subtração interna escondida.

Contrato:

```text
pageNumber >= 0.
```

Se uma interface externa usar página baseada em um, a conversão deve ocorrer na borda.

---

### Tamanho da pagina

Contrato:

```text
1 <= pageSize <= 100.
```

O limite máximo evita que o consumidor transforme uma consulta paginada em exportação completa.

Exportação precisa de outro caso de uso:

- streaming;
- lote;
- arquivo;
- job;
- limite próprio.

Não aumente o máximo apenas para atender uma tela mal projetada.

---

### Calculo do offset

Fórmula:

```java
long offset =
        Math.multiplyExact(
                pageNumber,
                pageSize
        );
```

`pageNumber` e `pageSize` podem ser `int`, mas o cálculo intermediário deve usar `long`.

Depois, JPA exige:

```java
setFirstResult(int)
```

Logo, valide:

```text
offset <= Integer.MAX_VALUE.
```

Se ultrapassar, rejeite a requisição.

Não faça cast silencioso.

---

### PageRequest

Contrato:

```java
public record PageRequest(
        int pageNumber,
        int pageSize,
        OrderSort sort,
        SortDirection direction
) {
}
```

Responsabilidades:

- validar página;
- validar tamanho;
- exigir sort;
- exigir direção;
- calcular offset;
- proteger overflow.

Ele não conhece JPA.

---

### OrderSort

Enum de campos permitidos:

```java
public enum OrderSort {
    CODIGO,
    STATUS,
    CLIENTE_NOME,
    CRIADA_EM
}
```

O repository traduz cada opção para atributo Criteria ou JPQL conhecida.

Nunca faça:

```java
root.get(userInput)
```

com entrada arbitrária.

---

### Ordenacao estavel

Uma ordenação é estável para paginação quando a posição de cada registro é determinística.

Considere ordenar somente por status:

```text
ABERTA;
ABERTA;
ABERTA.
```

O banco pode devolver empates em qualquer ordem se não houver desempate.

Isso pode causar:

- item repetido entre páginas;
- item omitido;
- resultado variando entre execuções.

A solução é acrescentar uma chave única:

```text
ORDER BY status ASC, id ASC.
```

O ID será sempre o último critério de desempate.

---

### Consulta de conteudo

A consulta de conteúdo retorna:

```java
List<OrdemResumoRecord>
```

Ela possui:

- filtros;
- joins necessários;
- projection;
- ordenação;
- offset;
- limite.

Exemplo conceitual:

```java
TypedQuery<OrdemResumoRecord> query =
        entityManager.createQuery(
                contentJpql,
                OrdemResumoRecord.class
        );

query.setFirstResult(
        pageRequest.offsetAsInt()
);

query.setMaxResults(
        pageRequest.pageSize()
);
```

---

### Consulta de total

A consulta de count retorna:

```java
Long
```

Ela deve aplicar os mesmos filtros da consulta de conteúdo.

Ela não precisa de:

- projection;
- order by;
- fetch join;
- offset;
- limite.

Exemplo:

```java
select count(o)
from OrdemServico o
join o.cliente c
where ...
```

---

### Conteudo e count precisam concordar

Erro comum:

```text
content:
filtra status e Cliente.

count:
filtra somente status.
```

Resultado:

```text
conteúdo:
3 itens.

total:
20.
```

A página fica incorreta.

A aula criará um método central para montar as cláusulas de filtro ou manterá duas JPQLs lado a lado com testes de coerência.

---

### Count com join to-many

Se o filtro usa Atividade:

```text
uma Ordem pode ter várias Atividades correspondentes.
```

A consulta de count precisa evitar duplicidade:

```java
count(distinct o.id)
```

A consulta de conteúdo pode usar:

```text
select distinct new ...
```

ou uma estratégia que não multiplique linhas.

O laboratório terá um filtro opcional por status de Atividade para testar esse cenário.

---

### PageResult

Contrato:

```java
public record PageResult<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean hasNext,
        boolean hasPrevious
) {
}
```

O conteúdo deve ser copiado:

```java
content = List.copyOf(content);
```

O resultado será imutável.

---

### Total de paginas

Fórmula sem ponto flutuante:

```java
int totalPages =
        totalElements == 0
                ? 0
                : Math.toIntExact(
                        (
                            totalElements
                            + pageSize
                            - 1
                        ) / pageSize
                );
```

Exemplo:

```text
20 elementos;
pageSize 5;
totalPages 4.
```

Exemplo:

```text
21 elementos;
pageSize 5;
totalPages 5.
```

---

### Last

Política do laboratório:

```text
last = !hasNext.
```

Assim:

- última página válida é last;
- página além do final também é last;
- base vazia na página 0 é last.

Outra política poderia distinguir:

```text
outOfRange.
```

O laboratório adicionará um método:

```java
boolean outOfRange()
```

definido como:

```text
totalElements > 0
e pageNumber >= totalPages.
```

---

### Pagina alem do final

O JPA retorna:

```text
lista vazia.
```

Isso não deve ser tratado como erro técnico.

O caso de uso pode decidir:

- retornar página vazia;
- responder 404;
- redirecionar para última;
- rejeitar índice.

No laboratório, o repository retorna página vazia e marca `outOfRange`.

---

### Base vazia

Com zero elementos:

```text
content:
vazio.

totalElements:
0.

totalPages:
0.

first:
true para page 0.

last:
true.

hasNext:
false.

hasPrevious:
false para page 0.

outOfRange:
false.
```

A página 0 representa uma consulta válida sem resultados.

---

### Collection fetch e paginacao

Não use:

```java
select distinct c
from Cliente c
left join fetch c.ordens
```

com `setMaxResults` como solução geral.

A coleção multiplica linhas.

O provider pode aplicar paginação em memória ou produzir resultado difícil de prever.

A aula 338 já documentou esse limite.

Nesta aula, a consulta paginada não fará fetch join de coleção.

---

### Offset em paginas profundas

Offset alto pode ficar caro.

Exemplo:

```text
pageNumber:
100.000.

pageSize:
20.

offset:
2.000.000.
```

O banco pode precisar localizar e descartar muitos registros.

A paginação por offset é simples e adequada para muitos casos, mas não escala igualmente para páginas profundas.

---

### Keyset pagination

A keyset pagination busca registros depois de uma chave conhecida.

Exemplo conceitual:

```text
WHERE
    criada_em < :ultimaData
OR (
    criada_em = :ultimaData
    AND id < :ultimoId
)
ORDER BY
    criada_em DESC,
    id DESC
LIMIT 20.
```

Vantagens:

- não precisa descartar milhões de linhas;
- navegação seguinte eficiente;
- estabilidade em feeds.

Limitações:

- não pula diretamente para página 500;
- exige cursor;
- precisa da mesma ordenação única;
- implementação mais complexa.

Nesta aula, keyset será apenas introduzida.

---

### Mudancas entre paginas

Mesmo com ordenação estável, inserções e remoções entre duas requisições podem deslocar registros na paginação por offset.

Exemplo:

1. usuário lê página 0;
2. nova Ordem é inserida no início;
3. usuário lê página 1;
4. um item pode repetir.

A ordenação determinística resolve empates, não cria snapshot entre requisições.

Para snapshot consistente seriam necessárias outras estratégias:

- transação longa, geralmente inadequada;
- filtro por corte temporal;
- cursor;
- versão do conjunto;
- keyset.

---

### Limites de count

Em tabelas grandes, `count` com filtros e joins pode ser caro.

Nem toda interface precisa do total exato.

Alternativas futuras:

- Slice com `pageSize + 1`;
- total aproximado;
- count assíncrono;
- navegação por cursor;
- limite conhecido.

O laboratório implementará total exato porque esse é o contrato da aula.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\pagination"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\projection"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\query"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\java\br\com\formacao\m13\aula341\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-341-paginacao-ordenacao-jpa\src\test\java\br\com\formacao\m13\aula341"

Set-Location `
  "labs\m13\aula-341-paginacao-ordenacao-jpa"
```

---

### 2. Criar pom e configuracao

Reutilize as versões da aula 340.

Ajuste:

```text
artifactId:
aula-341-paginacao-ordenacao-jpa.

persistence unit:
aula341PU.

Main:
br.com.formacao.m13.aula341.Main.
```

Configuração:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_341
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-341-jpa
JPA_POOL_NAME=aula-341-pool
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
341001.

ordem:
341101.

atividade:
341201.
```

Mantenha:

- foreign keys;
- índices;
- status;
- timestamps;
- versão;
- sem delete cascade físico.

Crie índice composto:

```sql
CREATE INDEX idx_jpa_341_ordem_criada_id
    ON jpa_341.ordem_servico (
        criada_em DESC,
        id DESC
    );
```

Ele apoia a ordenação didática por data e ID.

---

### 4. Reutilizar entidades

Mappings:

```text
Ordem -> Cliente:
ManyToOne LAZY.

Ordem -> Atividades:
OneToMany LAZY.

Cliente -> Ordens:
OneToMany LAZY.
```

A projection não navegará pelas coleções.

---

### 5. Criar OrdemResumoRecord.java

```java
package br.com.formacao.m13.aula341.projection;

import java.time.OffsetDateTime;

public record OrdemResumoRecord(
        Long ordemId,
        String codigo,
        String status,
        String clienteNome,
        OffsetDateTime criadaEm
) {
}
```

---

### 6. Criar SortDirection.java

```java
package br.com.formacao.m13.aula341.pagination;

public enum SortDirection {
    ASC,
    DESC
}
```

---

### 7. Criar OrderSort.java

```java
package br.com.formacao.m13.aula341.pagination;

public enum OrderSort {
    CODIGO,
    STATUS,
    CLIENTE_NOME,
    CRIADA_EM
}
```

---

### 8. Criar PageRequest.java

```java
package br.com.formacao.m13.aula341.pagination;

import java.util.Objects;

public record PageRequest(
        int pageNumber,
        int pageSize,
        OrderSort sort,
        SortDirection direction
) {

    public static final int MAX_PAGE_SIZE = 100;

    public PageRequest {
        if (pageNumber < 0) {
            throw new IllegalArgumentException(
                    "pageNumber não pode ser negativo"
            );
        }

        if (
            pageSize < 1
            || pageSize > MAX_PAGE_SIZE
        ) {
            throw new IllegalArgumentException(
                    "pageSize deve estar entre 1 e "
                    + MAX_PAGE_SIZE
            );
        }

        Objects.requireNonNull(
                sort,
                "sort é obrigatório"
        );

        Objects.requireNonNull(
                direction,
                "direction é obrigatória"
        );

        long offset =
                Math.multiplyExact(
                        (long) pageNumber,
                        (long) pageSize
                );

        if (offset > Integer.MAX_VALUE) {
            throw new IllegalArgumentException(
                    "offset excede o limite da JPA"
            );
        }
    }

    public int offset() {
        return Math.toIntExact(
                Math.multiplyExact(
                        (long) pageNumber,
                        (long) pageSize
                )
        );
    }
}
```

---

### 9. Criar PageResult.java

```java
package br.com.formacao.m13.aula341.pagination;

import java.util.List;

public record PageResult<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean hasNext,
        boolean hasPrevious,
        boolean outOfRange
) {

    public PageResult {
        content = List.copyOf(content);

        if (
            pageNumber < 0
            || pageSize < 1
            || totalElements < 0
            || totalPages < 0
        ) {
            throw new IllegalArgumentException(
                    "Metadados de página inválidos"
            );
        }
    }

    public static <T> PageResult<T> of(
            List<T> content,
            PageRequest request,
            long totalElements
    ) {
        int totalPages =
                totalElements == 0
                        ? 0
                        : Math.toIntExact(
                                (
                                    totalElements
                                    + request.pageSize()
                                    - 1
                                ) / request.pageSize()
                        );

        boolean hasNext =
                request.pageNumber() + 1
                        < totalPages;

        boolean outOfRange =
                totalElements > 0
                && request.pageNumber()
                        >= totalPages;

        return new PageResult<>(
                content,
                request.pageNumber(),
                request.pageSize(),
                totalElements,
                totalPages,
                request.pageNumber() == 0,
                !hasNext,
                hasNext,
                request.pageNumber() > 0,
                outOfRange
        );
    }
}
```

---

### 10. Criar OrdemPageFilter.java

```java
package br.com.formacao.m13.aula341.query;

import java.util.Locale;

public record OrdemPageFilter(
        String codigo,
        String status,
        String clienteNome,
        String atividadeStatus
) {

    public OrdemPageFilter {
        codigo = normalize(codigo);
        clienteNome = normalize(clienteNome);
        status = upper(status);
        atividadeStatus = upper(
                atividadeStatus
        );
    }

    private static String normalize(
            String value
    ) {
        return value == null
                || value.isBlank()
                ? null
                : value.trim();
    }

    private static String upper(
            String value
    ) {
        String normalized =
                normalize(value);

        return normalized == null
                ? null
                : normalized.toUpperCase(
                        Locale.ROOT
                );
    }
}
```

Valide status permitidos.

---

### 11. Criar PaginatedOrderRepository.java

Método:

```java
public PageResult<OrdemResumoRecord> search(
        OrdemPageFilter filter,
        PageRequest pageRequest
)
```

O método:

1. valida argumentos;
2. executa count;
3. retorna vazio cedo se total zero;
4. monta conteúdo;
5. aplica parâmetros;
6. aplica offset;
7. aplica limite;
8. cria `PageResult`.

---

### 12. Montar filtros

Use uma estrutura interna:

```java
private record QueryParts(
        String joins,
        String where,
        Map<String, Object> parameters,
        boolean distinct
) {
}
```

Ou use Criteria API.

Para reforçar a aula 339, o laboratório pode usar Criteria API para conteúdo e count.

A decisão oficial será:

```text
Criteria API:
filtros e ordenação dinâmica.

constructor expression JPQL:
não usada dentro da Criteria.

CriteriaQuery<OrdemResumoRecord>:
builder.construct.
```

---

### 13. Criar consulta de conteudo com Criteria

```java
CriteriaBuilder builder =
        entityManager.getCriteriaBuilder();

CriteriaQuery<OrdemResumoRecord> query =
        builder.createQuery(
                OrdemResumoRecord.class
        );

Root<OrdemServicoEntity> root =
        query.from(
                OrdemServicoEntity.class
        );

Join<OrdemServicoEntity, ClienteEntity> cliente =
        root.join(
                "cliente",
                JoinType.INNER
        );

query.select(
        builder.construct(
                OrdemResumoRecord.class,
                root.get("id"),
                root.get("codigo"),
                root.get("status"),
                cliente.get("nome"),
                root.get("criadaEm")
        )
);
```

Aplique predicates compartilhados.

---

### 14. Criar consulta de count

```java
CriteriaQuery<Long> countQuery =
        builder.createQuery(
                Long.class
        );

Root<OrdemServicoEntity> countRoot =
        countQuery.from(
                OrdemServicoEntity.class
        );

countRoot.join(
        "cliente",
        JoinType.INNER
);
```

Se houver filtro por Atividade:

```java
countQuery.select(
        builder.countDistinct(
                countRoot.get("id")
        )
);
```

Caso contrário:

```java
countQuery.select(
        builder.count(
                countRoot
        )
);
```

Aplique os mesmos valores do filtro.

---

### 15. Centralizar predicates

Crie helper genérico por contexto:

```java
private List<Predicate> predicates(
        OrdemPageFilter filter,
        Root<OrdemServicoEntity> root,
        Join<OrdemServicoEntity, ClienteEntity> cliente,
        CriteriaQuery<?> query,
        CriteriaBuilder builder
)
```

Quando `atividadeStatus` existir:

```java
Join<OrdemServicoEntity, AtividadeEntity> atividade =
        root.join(
                "atividades",
                JoinType.INNER
        );

query.distinct(true);
```

No count, use `countDistinct`.

Evite aplicar join de Atividade quando o filtro estiver ausente.

---

### 16. Aplicar ordenacao

Crie:

```java
private List<Order> orders(
        PageRequest request,
        Root<OrdemServicoEntity> root,
        Join<OrdemServicoEntity, ClienteEntity> cliente,
        CriteriaBuilder builder
)
```

Mapeamento:

```text
CODIGO:
root.codigo.

STATUS:
root.status.

CLIENTE_NOME:
cliente.nome.

CRIADA_EM:
root.criadaEm.
```

Depois adicione:

```text
root.id
```

como desempate.

---

### 17. Aplicar direcao

Helper:

```java
private Order order(
        CriteriaBuilder builder,
        Expression<?> expression,
        SortDirection direction
) {
    return direction == SortDirection.ASC
            ? builder.asc(expression)
            : builder.desc(expression);
}
```

A lista final contém duas ordens:

```text
campo escolhido;

ID.
```

---

### 18. Aplicar offset e limite

```java
TypedQuery<OrdemResumoRecord> typedQuery =
        entityManager.createQuery(query);

typedQuery.setFirstResult(
        pageRequest.offset()
);

typedQuery.setMaxResults(
        pageRequest.pageSize()
);
```

Não aplique offset ou limite na count query.

---

### 19. Criar PaginationObservation.java

```java
package br.com.formacao.m13.aula341.lab;

public record PaginationObservation(
        String scenario,
        int pageNumber,
        int pageSize,
        int contentSize,
        long totalElements,
        int totalPages,
        String firstCode,
        String lastCode,
        long selectCount
) {

    public PaginationObservation {
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

### 20. Criar PaginationReport.java

```java
package br.com.formacao.m13.aula341.lab;

import java.util.List;

public record PaginationReport(
        List<PaginationObservation> observations,
        boolean firstPageWorked,
        boolean middlePageWorked,
        boolean lastPageWorked,
        boolean beyondLastReturnedEmpty,
        boolean totalMatchedFilter,
        boolean stableOrderingWorked,
        boolean sizeLimitWasEnforced,
        boolean offsetOverflowWasRejected,
        boolean noSpringPaginationWasUsed
) {

    public PaginationReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 21. Criar fixtures

Crie quatro Clientes:

```text
CLI-JPA-341-ALFA;

CLI-JPA-341-BETA;

CLI-JPA-341-GAMA;

CLI-JPA-341-DELTA.
```

Crie 20 Ordens:

```text
OS-JPA-341-001;
...
OS-JPA-341-020.
```

Distribua:

```text
cinco por Cliente.
```

Status:

```text
ABERTA:
8.

AGENDADA:
5.

CONCLUIDA:
4.

CANCELADA:
3.
```

Datas:

```text
2026-07-01T09:00-03:00
até
2026-07-20T09:00-03:00.
```

Adicione Atividades em algumas Ordens para testar count distinct.

---

### 22. Primeira pagina

Request:

```text
pageNumber:
0.

pageSize:
5.

sort:
CODIGO.

direction:
ASC.
```

Confirme:

```text
001 a 005;

contentSize 5;

totalElements 20;

totalPages 4;

first true;

last false;

hasNext true;

hasPrevious false;

outOfRange false.
```

---

### 23. Pagina intermediaria

Request:

```text
pageNumber:
1.

pageSize:
5.
```

Confirme:

```text
006 a 010;

first false;

last false;

hasNext true;

hasPrevious true.
```

---

### 24. Ultima pagina

Request:

```text
pageNumber:
3;

pageSize:
5.
```

Confirme:

```text
016 a 020;

last true;

hasNext false;

outOfRange false.
```

---

### 25. Pagina alem do final

Request:

```text
pageNumber:
4;

pageSize:
5.
```

Confirme:

```text
conteúdo vazio;

totalElements 20;

totalPages 4;

last true;

hasNext false;

hasPrevious true;

outOfRange true.
```

---

### 26. Tamanho que nao divide o total

Request:

```text
pageNumber:
2;

pageSize:
7.
```

Confirme:

```text
totalPages 3;

conteúdo 015 a 020;

seis itens;

last true.
```

---

### 27. Filtro por status

Filtro:

```text
ABERTA.
```

Confirme:

```text
totalElements 8;

pageSize 3;

totalPages 3;

conteúdo coerente em todas as páginas.
```

A count query precisa usar o mesmo status.

---

### 28. Filtro por Cliente

Filtro:

```text
clienteNome contém BETA.
```

Confirme:

```text
cinco Ordens;

totalElements 5;

totalPages 1 com size 10.
```

---

### 29. Filtro por Atividade

Crie duas Atividades com mesmo status em uma única Ordem.

Filtro:

```text
atividadeStatus CONCLUIDA.
```

Confirme:

```text
a Ordem aparece uma vez;

content usa distinct;

count usa countDistinct;

totalElements corresponde às Ordens, não às Atividades.
```

---

### 30. Ordenacao por status

Use:

```text
STATUS ASC;
ID ASC.
```

Crie vários empates.

Execute a mesma página duas vezes em managers novos.

Confirme códigos na mesma ordem.

---

### 31. Ordenacao por data descendente

Use:

```text
CRIADA_EM DESC;
ID DESC.
```

Confirme:

```text
020 primeiro;

016 quinto na primeira página de tamanho 5.
```

---

### 32. Ordenacao por Cliente

Use:

```text
CLIENTE_NOME ASC;
ID ASC.
```

Confirme agrupamento por nome e desempate estável.

---

### 33. Entrada invalida

Teste:

```text
pageNumber -1;

pageSize 0;

pageSize 101;

sort null;

direction null;

offset acima de Integer.MAX_VALUE.
```

Todas devem falhar antes de SQL.

Limpe inspector e confirme:

```text
zero SELECT.
```

---

### 34. Base vazia

Use prefixo sem correspondência.

Request página 0.

Confirme:

```text
content vazio;

total 0;

totalPages 0;

first true;

last true;

hasNext false;

hasPrevious false;

outOfRange false;

somente count executado.
```

---

### 35. Criar Main.java

O `Main`:

1. carrega settings;
2. abre runtime;
3. prepara fixtures;
4. executa cenários;
5. imprime relatório;
6. remove fixtures;
7. não imprime entidades;
8. não imprime SQL integral;
9. fecha runtime.

Formato:

```text
cenário | página | tamanho | itens | total | páginas | primeiro código | último código | SELECTs
```

---

### 36. Criar PageRequestTest.java

Casos:

- página válida;
- tamanho mínimo;
- tamanho máximo;
- página negativa;
- tamanho zero;
- tamanho acima do máximo;
- sort nulo;
- direção nula;
- offset normal;
- overflow rejeitado.

Esse teste é unitário e não usa banco.

---

### 37. Criar PageResultTest.java

Casos:

- total exato;
- total com resto;
- total zero;
- primeira página;
- página intermediária;
- última página;
- além do final;
- conteúdo imutável;
- flags coerentes.

---

### 38. Criar JpaOffsetPaginationIT.java

Casos:

- página 0;
- página 1;
- página 3;
- tamanho 7;
- página além;
- SQL com limite e offset observado;
- duas consultas por página não vazia;
- uma consulta para total zero.

Não compare sintaxe SQL integral.

---

### 39. Criar StableOrderingIT.java

Casos:

- código ascendente;
- status com empates;
- data descendente;
- Cliente;
- repetição em managers diferentes;
- nenhum item duplicado entre páginas consecutivas com base imutável.

---

### 40. Criar FilteredCountIT.java

Casos:

- status;
- Cliente;
- código;
- Atividade;
- duas Atividades na mesma Ordem;
- count distinct;
- content e total coerentes.

---

### 41. Criar PaginationBoundaryIT.java

Casos:

- base vazia;
- página além;
- último bloco incompleto;
- tamanho máximo;
- entradas inválidas sem SQL;
- offset profundo rejeitado quando excede a API.

---

### 42. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_341.atividade
WHERE codigo LIKE 'ATV-JPA-341-%';

DELETE FROM jpa_341.ordem_servico
WHERE codigo LIKE 'OS-JPA-341-%';

DELETE FROM jpa_341.cliente
WHERE codigo LIKE 'CLI-JPA-341-%';
```

Use antes e depois dos testes.

---

### 43. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_341.
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
zero CLI-JPA-341-%;

zero OS-JPA-341-%;

zero ATV-JPA-341-%;

foreign keys e índices existentes;

índice criada_em + id existente;

schema history com V1.
```

`05_limpar_database.ps1` remove o database isolado.

---

### 44. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
páginas corretas;

offset correto;

limite correto;

total correto;

totalPages correto;

flags corretas;

ordenação estável;

desempate por ID;

count filtrado;

count distinct;

limites rejeitados;

projections retornadas;

nenhum Spring Data;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 45. Criar documentacao

`contrato-page-request.md` deve registrar:

- base zero;
- tamanho;
- máximo;
- offset;
- overflow;
- sort;
- direção;
- conversão da borda.

`contrato-page-result.md` deve registrar:

- content;
- totalElements;
- totalPages;
- first;
- last;
- hasNext;
- hasPrevious;
- outOfRange;
- base vazia.

`ordenacao-estavel.md` deve explicar:

```text
campo principal;

empates;

ID como desempate;

direção;

mudanças concorrentes;

índices.
```

`content-e-count.md` deve comparar:

- objetivo;
- filtros;
- join;
- distinct;
- projection;
- order by;
- offset;
- limit.

`offset-vs-keyset.md` deve registrar:

- simplicidade;
- página arbitrária;
- custo profundo;
- cursor;
- estabilidade;
- casos de uso.

`troubleshooting-paginacao.md` deve cobrir:

- total incorreto;
- item repetido;
- item ausente;
- página vazia;
- overflow;
- tamanho excessivo;
- count duplicado;
- collection fetch;
- ordenação arbitrária;
- índice ausente.

---

## Entendendo o que foi feito

### A pagina virou contrato

Página, tamanho, ordenação e direção passaram por validação antes do SQL.

### Conteudo e total foram separados

Uma consulta recuperou o bloco e outra calculou o universo filtrado.

### Ordenacao ganhou desempate

O ID tornou a sequência determinística em empates.

### Projection continuou enxuta

A página retornou records de leitura, não entidades completas.

### Limites ficaram explicitos

Tamanho máximo, overflow, página vazia e página além do final foram testados.

---

## Erros comuns importantes

### Paginar sem order by

O resultado pode variar entre requisições.

### Ordenar por campo nao unico

Adicione ID como desempate.

### Count usar filtros diferentes

Total e conteúdo ficam incoerentes.

### Usar collection fetch com limite

As linhas do join não representam páginas de raízes.

### Aceitar tamanho ilimitado

Exportação não é paginação.

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

### Conferir ordem

```sql
SELECT
    ordem.id,
    ordem.codigo,
    ordem.status,
    cliente.nome AS cliente_nome,
    ordem.criada_em
FROM jpa_341.ordem_servico AS ordem
JOIN jpa_341.cliente AS cliente
    ON cliente.id = ordem.cliente_id
WHERE ordem.codigo LIKE 'OS-JPA-341-%'
ORDER BY
    ordem.criada_em DESC,
    ordem.id DESC
LIMIT 5
OFFSET 0;
```

---

## Exercicio guiado

### Parte 1 — Pagina baseada em um

Crie um adapter externo:

```text
1 -> 0;

2 -> 1.
```

Mantenha o domínio interno baseado em zero.

### Parte 2 — Novo sort

Adicione:

```text
CLIENTE_NOME_DESC.
```

Sem aceitar atributo arbitrário.

### Parte 3 — Count sem total

Crie uma operação tipo Slice:

```text
pageSize + 1.
```

Retorne apenas `hasNext`.

Não substitua o contrato oficial.

### Parte 4 — Pagina profunda

Crie 10.000 fixtures em base descartável.

Compare offsets baixos e altos.

Registre plano e tempo apenas como observação.

### Parte 5 — Mudanca entre paginas

Insira uma Ordem entre a leitura da página 0 e da página 1.

Observe possível deslocamento.

Explique por que o ID resolve empates, mas não cria snapshot.

### Parte 6 — Keyset conceitual

Desenhe cursor para:

```text
criadaEm DESC;
id DESC.
```

Defina os dois valores necessários.

Não implemente endpoint.

### Parte 7 — Count distinct

Crie três Atividades correspondentes na mesma Ordem.

Confirme que total de Ordens permanece um.

### Parte 8 — ADR

Registre:

```text
página interna baseada em zero;

tamanho máximo 100;

projection como conteúdo;

content e count separados;

mesmos filtros;

ID como desempate;

sem collection fetch paginado;

keyset para navegação profunda futura.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 341 existe;
- continuidade com a aula 340 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence foi mantida;
- Hibernate foi mantido como provider;
- HikariCP foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_341` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- entidades anteriores foram reutilizadas;
- projection de resumo foi criada;
- paginação por offset foi definida;
- `setFirstResult` foi usado;
- `setMaxResults` foi usado;
- página baseada em zero foi definida;
- fórmula do offset foi aplicada;
- cálculo intermediário usou long;
- overflow foi rejeitado;
- tamanho mínimo foi validado;
- tamanho máximo foi validado;
- `PageRequest` foi criado;
- `PageResult` foi criado;
- conteúdo foi copiado de forma imutável;
- totalElements foi calculado;
- totalPages foi calculado sem ponto flutuante;
- first foi calculado;
- last foi calculado;
- hasNext foi calculado;
- hasPrevious foi calculado;
- outOfRange foi calculado;
- base vazia foi tratada;
- página além do final foi tratada;
- página incompleta foi tratada;
- consulta de conteúdo foi criada;
- consulta de count foi criada;
- count não recebeu order by;
- count não recebeu offset;
- count não recebeu limit;
- filtros de content e count ficaram coerentes;
- filtro por status foi testado;
- filtro por Cliente foi testado;
- filtro por Atividade foi testado;
- count distinct foi usado no join to-many;
- content não duplicou Ordem;
- ordenação por código foi criada;
- ordenação por status foi criada;
- ordenação por Cliente foi criada;
- ordenação por data foi criada;
- entrada de sort usou enum;
- direção usou enum;
- entrada arbitrária não foi aceita;
- ID foi usado como desempate;
- empates foram testados;
- repetição entre managers foi estável;
- projection permaneceu fora do lifecycle;
- duas consultas constantes foram diferenciadas de N+1;
- total zero evitou consulta de conteúdo;
- collection fetch paginado não foi usado;
- paginação to-one foi diferenciada;
- custo de offset profundo foi discutido;
- keyset pagination foi introduzida;
- mudanças entre páginas foram discutidas;
- count caro foi discutido;
- alternativa Slice foi citada;
- índice por data e ID foi criado;
- SQL foi observado sem bindings;
- testes unitários de request foram criados;
- testes unitários de result foram criados;
- testes de paginação foram criados;
- testes de ordenação foram criados;
- testes de count foram criados;
- testes de limites foram criados;
- fixtures foram removidas;
- estado final ficou vazio;
- Spring Data Page não foi usado;
- Pageable não foi usado;
- lock otimista não foi antecipado;
- lock pessimista não foi antecipado;
- Spring não foi usado;
- ponte para a aula 342 está correta;
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
  labs/m13/aula-341-paginacao-ordenacao-jpa
```

Commit recomendado:

```powershell
git commit -m "feat(m13): paginar e ordenar consultas jpa"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você criou paginação e ordenação sem depender de Spring Data.

Aprendeu:

```text
setFirstResult:
offset.

setMaxResults:
limite.

PageRequest:
entrada validada.

PageResult:
conteúdo e metadados.

count query:
total exato.

stable order:
campo e ID.

projection:
conteúdo enxuto.

outOfRange:
página além do total.
```

O laboratório comprovou:

```text
primeira página;

página intermediária;

última página;

página incompleta;

página além do final;

base vazia;

total filtrado;

count distinct;

sort permitido;

desempate por ID;

limites de entrada;

overflow protegido.
```

A decisão arquitetural foi:

```text
offset pagination:
simples e permite página arbitrária.

keyset pagination:
candidata para navegação profunda.

content e count:
duas consultas constantes.

collection fetch paginado:
não adotado.

projection:
modelo de leitura da página.
```

A próxima aula será:

```text
342 - M13.32 - Lock otimista
```

Nela, você aprenderá:

- concorrência sobre a mesma entidade;
- `@Version`;
- valor de versão;
- duas transações lendo o mesmo estado;
- primeira atualização;
- segunda atualização conflitante;
- `OptimisticLockException`;
- rollback obrigatório;
- mensagem de negócio;
- recarregamento;
- retry consciente;
- conflito em entidade detached;
- merge e versão;
- lost update;
- testes concorrentes determinísticos;
- diferença entre controle otimista e pessimista.

A aula 341 garantiu uma leitura paginada previsível.

A aula 342 garantirá que alterações concorrentes não sobrescrevam silenciosamente o trabalho de outro usuário.

---

# Material complementar

## Checkpoint final

- [ ] Usei `setFirstResult` e `setMaxResults`.
- [ ] Criei PageRequest e PageResult próprios.
- [ ] Mantive content e count coerentes.
- [ ] Usei ordenação estável com ID.
- [ ] Tratei limites, página vazia e página além do final.

---

## Troubleshooting adicional

### Itens repetidos entre paginas

Revise ordenação única e mudanças concorrentes.

### Total diferente do conteudo

Compare filtros e joins das duas consultas.

### Count maior com Atividades

Use `countDistinct` para raízes.

### Offset ficou negativo

Valide página, tamanho e overflow.

### Consulta paginada carregou coleção

Remova collection fetch da consulta paginada.

---

## Perguntas de revisao

1. O que faz `setFirstResult`?
2. O que faz `setMaxResults`?
3. Qual é a base da página?
4. Como calcular offset?
5. Por que usar long no cálculo?
6. Qual é o tamanho máximo?
7. O que representa totalElements?
8. Como calcular totalPages?
9. O que significa first?
10. O que significa hasNext?
11. O que é outOfRange?
12. Por que existe count query?
13. Content e count usam os mesmos filtros?
14. Por que ordenar por ID?
15. Pode aceitar campo de sort livre?
16. Collection fetch combina com paginação?
17. O que é keyset?
18. Duas queries fixas são N+1?
19. Spring Data foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Define o offset.
2. Define o limite.
3. Zero.
4. Página vezes tamanho.
5. Para detectar overflow.
6. Cem.
7. Total filtrado.
8. Divisão inteira com arredondamento.
9. Página zero.
10. Existe página seguinte.
11. Índice além do total.
12. Para metadados completos.
13. Sim.
14. Para desempate estável.
15. Não.
16. Não como solução geral.
17. Paginação por chave.
18. Não.
19. Não.
20. Lock otimista.

---

## Desafio opcional

Crie:

```java
PaginationContractVerifier
```

Entrada:

```text
pageNumber;

pageSize;

totalElements;

contentSize;

sort;

direction;

firstCode;

lastCode.
```

Saída:

```text
metadados esperados;

inconsistências;

relatório Markdown.
```

Regras:

- validar totalPages;
- validar flags;
- validar tamanho do conteúdo;
- validar página além do fim;
- não acessar banco;
- não depender de Spring;
- possuir testes unitários;
- não inferir ordenação apenas pelo nome do campo.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 341 - M13.31 - Paginacao e ordenacao com JPA

- Implementei paginação por offset com JPA.
- Usei `setFirstResult`.
- Usei `setMaxResults`.
- Adotei página interna baseada em zero.
- Calculei offset como página vezes tamanho.
- Usei `long` no cálculo intermediário.
- Rejeitei overflow antes do SQL.
- Criei `PageRequest`.
- Defini tamanho mínimo e máximo.
- Criei enums de campo e direção.
- Rejeitei ordenação arbitrária.
- Criei `PageResult<T>`.
- Mantive conteúdo imutável.
- Calculei total de elementos.
- Calculei total de páginas.
- Calculei first, last, hasNext e hasPrevious.
- Criei indicador outOfRange.
- Criei consulta de conteúdo.
- Criei consulta de count.
- Mantive os mesmos filtros nas duas consultas.
- Evitei order by, offset e limit no count.
- Usei projection no conteúdo.
- Testei primeira página.
- Testei página intermediária.
- Testei última página.
- Testei página incompleta.
- Testei página além do final.
- Testei base vazia.
- Usei ID como desempate.
- Testei ordenação por código, status, Cliente e data.
- Usei count distinct em filtro to-many.
- Evitei collection fetch na consulta paginada.
- Diferenciei duas consultas constantes de N+1.
- Introduzi keyset pagination.
- Documentei custo de offset profundo.
- Mantive Flyway no DDL e Hibernate em validate.
- Não usei Spring Data Page ou Pageable.
- Não antecipei locks.
- Próxima aula: Lock otimista.
```

---

## Referencia tecnica curta

```text
Page:
bloco.

Size:
limite.

Offset:
page vezes size.

Content:
itens.

Count:
total.

TotalPages:
divisão arredondada.

Stable sort:
campo e ID.

Projection:
conteúdo enxuto.

OutOfRange:
além do final.

Keyset:
cursor por chave.
```

Regra final:

```text
uma pagina JPA profissional exige entrada validada, offset protegido, tamanho limitado, consulta de conteudo e count com os mesmos filtros, ordenacao deterministica com desempate unico e um contrato imutavel que trate base vazia, ultima pagina e pagina alem do final sem depender de Spring Data.
```
