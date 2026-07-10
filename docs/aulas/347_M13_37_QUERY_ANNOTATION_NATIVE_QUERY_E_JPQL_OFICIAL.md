# 347 - M13.37 - Query annotation native query e JPQL

## Apresentacao da aula

Na aula 346, você criou consultas sem escrever JPQL ou SQL.

O Spring Data analisou nomes como:

```java
findByCodigo(...)

findByStatusOrderByCreatedAtDescIdDesc(...)

findByCliente_NomeContainingIgnoreCase(...)

findTop3ByStatusOrderByCreatedAtDescIdDesc(...)
```

O nome do método descreveu:

- propriedades;
- operadores;
- composição;
- limite;
- ordenação;
- tipo de retorno.

Essa abordagem funciona muito bem quando a consulta permanece curta e evidente.

Entretanto, alguns casos ultrapassam o limite da derivação.

Considere uma busca que precisa:

```text
filtrar status;

aceitar texto em código, descrição ou Cliente;

preservar agrupamento lógico;

carregar Cliente sem N+1;

retornar projection;

paginar com count específico;

ordenar de forma estável.
```

Tentar expressar tudo no nome produziria um método difícil de ler e manter.

Para esses casos, Spring Data JPA oferece:

```java
@Query
```

A annotation permite declarar uma consulta diretamente no repository.

Por padrão, o texto é JPQL:

```java
@Query(
        """
        select o
        from OrdemServico o
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity> findExplicitlyByStatus(
        @Param("status") String status
);
```

A JPQL utiliza:

```text
nome da entidade;

atributos Java;

associações Java.
```

Ela não usa diretamente:

```text
nome físico da tabela;

nome físico da coluna.
```

Quando a consulta precisa de recursos específicos do banco, você poderá declarar SQL nativo:

```java
@Query(
        value = """
                select
                    o.id,
                    o.codigo,
                    o.status
                from jpa_347.ordem_servico o
                where o.status = :status
                order by
                    o.created_at desc,
                    o.id desc
                """,
        nativeQuery = true
)
```

Nesse caso, o texto usa:

```text
schema;

tabela;

coluna;

sintaxe PostgreSQL.
```

Nesta aula, você aprenderá:

- `@Query`;
- JPQL explícita;
- parâmetros nomeados;
- `@Param`;
- parâmetros posicionais;
- text blocks;
- aliases;
- `join`;
- `left join`;
- `join fetch`;
- `distinct`;
- projections por interface;
- projections por record;
- constructor expression;
- paginação;
- `countQuery`;
- ordenação estática;
- `Sort`;
- SQL nativo;
- `nativeQuery = true`;
- aliases físicos;
- mapeamento de projection nativa;
- funções do PostgreSQL;
- portabilidade;
- `@Modifying`;
- update bulk;
- delete bulk;
- quantidade de linhas afetadas;
- `flushAutomatically`;
- `clearAutomatically`;
- auditoria explícita em bulk;
- versão explícita em bulk;
- critérios entre derivação, JPQL e native query.

A infraestrutura permanecerá:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O database será:

```text
formacao_java_jpa_347
```

O schema será:

```text
jpa_347
```

Flyway continuará responsável pelo DDL.

Hibernate permanecerá em:

```text
validate.
```

O modelo terá:

```text
ClienteEntity;

OrdemServicoEntity.
```

As entidades continuarão:

- auditáveis;
- versionadas;
- com relacionamento `ManyToOne LAZY`;
- sem setters públicos de auditoria.

O repository demonstrará três famílias de operação:

```text
JPQL de leitura;

SQL nativo de leitura;

JPQL bulk de escrita.
```

O laboratório comprovará:

```text
JPQL:
usa entidade e atributos.

native:
usa schema, tabela e colunas.

join fetch:
carrega Cliente em uma consulta.

projection:
retorna somente dados necessários.

Page:
usa consulta de conteúdo e countQuery.

@Modifying:
retorna quantidade de linhas.

bulk:
não executa callback individual.

flushAutomatically:
sincroniza antes do bulk.

clearAutomatically:
remove estado potencialmente obsoleto.

auditoria e versão:
precisam ser tratadas explicitamente no bulk.

estado final:
zero CLI-JPA-347-% e OS-JPA-347-%.
```

A próxima aula será:

```text
348 - M13.38 - Transacoes com Spring Data
```

Por isso, esta aula tratará somente a necessidade imediata de uma transação para operações modificadoras.

Ficarão para a aula 348:

- `@Transactional` em profundidade;
- proxy transacional;
- propagação;
- `REQUIRED`;
- `REQUIRES_NEW`;
- `MANDATORY`;
- isolamento;
- timeout transacional;
- read-only;
- rollback rules;
- checked exceptions;
- self-invocation;
- eventos após commit.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
345:
Spring Data Repository conceitos.

346:
Queries derivadas.

347:
Query annotation native query e JPQL.

348:
Transacoes com Spring Data.

349:
Testes de Repository com Testcontainers.
```

A progressão é:

```text
CRUD herdado:
operações comuns.

query derivada:
consulta curta por convenção.

@Query JPQL:
consulta explícita e portável no modelo JPA.

@Query native:
consulta específica do banco.

@Modifying:
DML explícita no repository.

transação:
fronteira completa na próxima aula.
```

Nesta aula:

```text
@Query:
sim.

JPQL:
sim.

nativeQuery:
sim.

@Param:
sim.

join fetch:
sim.

projection:
sim.

Page:
sim.

countQuery:
sim.

@Modifying:
sim.

bulk auditado:
sim.

propagação:
não.

Testcontainers:
não.

Spring Boot:
não.
```

A arquitetura será:

```text
método do repository
    -> annotation @Query
        -> JPQL ou SQL nativo
            -> parâmetros
                -> EntityManager
                    -> Hibernate
                        -> PostgreSQL.
```

Para operações modificadoras:

```text
método
    -> @Modifying
        -> transação ativa
            -> bulk update ou delete
                -> row count
                    -> clear do contexto.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-347-query-annotation-native-jpql
```

Estrutura final:

```text
labs
└── m13
    └── aula-347-query-annotation-native-jpql
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── query-jpql.md
        │   ├── query-native.md
        │   ├── parametros-e-aliases.md
        │   ├── pagination-count-query.md
        │   ├── modifying-bulk-e-contexto.md
        │   └── criterios-escolha-query.md
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
            │   │                   └── aula347
            │   │                       ├── Main.java
            │   │                       ├── audit
            │   │                       │   ├── AuditActor.java
            │   │                       │   ├── AuditContext.java
            │   │                       │   ├── AuditEntityListener.java
            │   │                       │   ├── AuditableEntity.java
            │   │                       │   └── AuditScope.java
            │   │                       ├── config
            │   │                       │   ├── JpaSettings.java
            │   │                       │   ├── JpaSettingsLoader.java
            │   │                       │   └── SpringDataJpaConfig.java
            │   │                       ├── entity
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── AnnotatedQueryLab.java
            │   │                       │   ├── AnnotatedQueryObservation.java
            │   │                       │   └── AnnotatedQueryReport.java
            │   │                       ├── projection
            │   │                       │   ├── OrdemResumoRecord.java
            │   │                       │   └── OrdemResumoView.java
            │   │                       ├── repository
            │   │                       │   ├── ClienteRepository.java
            │   │                       │   └── OrdemServicoRepository.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_347.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula347
                                        ├── JpqlQueryIT.java
                                        ├── FetchJoinQueryIT.java
                                        ├── ProjectionQueryIT.java
                                        ├── PaginatedAnnotatedQueryIT.java
                                        ├── NativeQueryIT.java
                                        ├── ModifyingQueryIT.java
                                        ├── PersistenceContextBulkIT.java
                                        ├── AnnotatedQueryArchitectureTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
12 Ordens;

3 Clientes;

consulta JPQL por status;

busca textual agrupada;

join fetch sem SELECT adicional do Cliente;

record projection;

interface projection;

Page com total correto;

native query com função PostgreSQL;

bulk update com row count;

contexto limpo após bulk;

bulk delete de fixture isolada;

zero callbacks individuais no bulk;

zero fixtures ao final.
```

---

## Conceito essencial

### O que faz @Query

`@Query` associa um texto de consulta a um método do repository.

Exemplo:

```java
@Query(
        """
        select o
        from OrdemServico o
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity>
findExplicitlyByStatus(
        @Param("status") String status
);
```

A annotation substitui a derivação para aquele método.

O nome pode ser curto e orientado ao caso de uso:

```text
findExplicitlyByStatus.
```

O comportamento principal está no texto.

---

### JPQL usa o modelo Java

Na JPQL:

```text
OrdemServico:
nome definido em @Entity.

status:
atributo Java.

cliente:
associação Java.

createdAt:
atributo herdado Java.
```

Não use:

```text
jpa_347.ordem_servico;

cliente_id;

created_at.
```

Esses são nomes físicos do banco.

---

### Text block

Java 21 permite:

```java
"""
select o
from OrdemServico o
where o.status = :status
"""
```

Vantagens:

- consulta legível;
- menos concatenação;
- formatação próxima da JPQL real;
- revisão mais simples.

Não concatene entrada do usuário no text block.

---

### Parametros nomeados

Exemplo:

```java
where o.status = :status
```

Ligação:

```java
@Param("status") String status
```

O nome precisa coincidir.

Parâmetros nomeados melhoram leitura e reduzem dependência da posição.

---

### Busca textual agrupada

Uma query explícita permite:

```java
@Query(
        """
        select o
        from OrdemServico o
        join o.cliente c
        where o.status in :statuses
          and (
                lower(o.codigo)
                    like lower(concat('%', :term, '%'))
             or lower(o.descricao)
                    like lower(concat('%', :term, '%'))
             or lower(c.nome)
                    like lower(concat('%', :term, '%'))
          )
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity> search(
        @Param("statuses")
        Collection<String> statuses,
        @Param("term")
        String term
);
```

O agrupamento fica explícito.

Esse caso seria inadequado como nome derivado.

---

### Colecoes em IN

JPQL aceita:

```java
o.status in :statuses
```

Valide antes da chamada:

- coleção não nula;
- coleção não vazia;
- valores permitidos;
- quantidade limitada.

Não gere listas ilimitadas.

---

### Join

`join o.cliente c` permite filtrar ou selecionar atributos do Cliente.

Isso não significa fetch automático.

Se o método retorna entidades e o código acessa `o.getCliente().getNome()`, a associação pode continuar lazy.

---

### Join fetch

Para carregar Cliente junto:

```java
@Query(
        """
        select o
        from OrdemServico o
        join fetch o.cliente c
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity>
findWithClientByStatus(
        @Param("status") String status
);
```

O teste deve comprovar:

```text
Cliente loaded;

zero SELECT adicional ao acessar nome.
```

---

### Projection por record

Crie:

```java
public record OrdemResumoRecord(
        Long id,
        String codigo,
        String status,
        String clienteNome,
        Instant createdAt
) {
}
```

JPQL:

```java
@Query(
        """
        select new br.com.formacao.m13.aula347.projection.OrdemResumoRecord(
            o.id,
            o.codigo,
            o.status,
            c.nome,
            o.createdAt
        )
        from OrdemServico o
        join o.cliente c
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemResumoRecord>
findSummariesByStatus(
        @Param("status") String status
);
```

A constructor expression usa o nome totalmente qualificado.

---

### Projection por interface

Interface:

```java
public interface OrdemResumoView {

    Long getId();

    String getCodigo();

    String getStatus();

    String getClienteNome();

    Instant getCreatedAt();
}
```

Consulta:

```java
@Query(
        """
        select
            o.id as id,
            o.codigo as codigo,
            o.status as status,
            c.nome as clienteNome,
            o.createdAt as createdAt
        from OrdemServico o
        join o.cliente c
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemResumoView>
findViewsByStatus(
        @Param("status") String status
);
```

Os aliases precisam corresponder aos accessors da interface.

---

### Page com @Query

Método:

```java
@Query(
        value = """
                select o
                from OrdemServico o
                join o.cliente c
                where o.status in :statuses
                  and c.ativo = true
                """,
        countQuery = """
                select count(o)
                from OrdemServico o
                join o.cliente c
                where o.status in :statuses
                  and c.ativo = true
                """
)
Page<OrdemServicoEntity>
findActiveClientOrders(
        @Param("statuses")
        Collection<String> statuses,
        Pageable pageable
);
```

A consulta de conteúdo recebe paginação e ordenação.

A `countQuery` calcula o total.

---

### Por que declarar countQuery

Spring Data pode derivar count em consultas simples.

Consultas com:

- fetch join;
- distinct;
- projection;
- agrupamento;
- native SQL;
- joins complexos;

podem exigir uma count query explícita.

O count não precisa de:

- fetch;
- order by;
- projection completa.

Ele precisa aplicar os mesmos filtros.

---

### Ordenacao com Pageable

O `Pageable` pode carregar `Sort`.

Para JPQL simples, Spring Data pode anexar ordenação dinâmica.

Não aceite propriedades arbitrárias de uma requisição.

Mapeie valores externos para propriedades conhecidas.

Em consultas com aliases ou funções, a ordenação dinâmica exige testes específicos.

---

### SQL nativo

Exemplo:

```java
@Query(
        value = """
                select
                    o.id as id,
                    o.codigo as codigo,
                    o.status as status,
                    c.nome as clienteNome,
                    o.created_at as createdAt
                from jpa_347.ordem_servico o
                join jpa_347.cliente c
                    on c.id = o.cliente_id
                where o.status = :status
                order by
                    o.created_at desc,
                    o.id desc
                """,
        nativeQuery = true
)
List<OrdemResumoView>
findNativeViewsByStatus(
        @Param("status") String status
);
```

Agora os nomes são físicos.

---

### Portabilidade

JPQL tende a ser mais portátil entre bancos.

Native query pode depender de:

- schema;
- nomes físicos;
- funções;
- casts;
- operadores;
- sintaxe de paginação;
- tipos;
- CTE;
- JSON;
- arrays;
- full-text search.

Use SQL nativo quando o benefício é concreto.

---

### Funcao PostgreSQL

A consulta nativa demonstrará:

```sql
unaccent
```

somente se a extensão for criada pela migration.

Para evitar dependência externa oculta, a migration poderá usar uma função mais simples e nativa já disponível, como:

```sql
char_length
```

Exemplo:

```sql
where char_length(o.descricao) >= :minimumLength
```

O objetivo é provar dependência física sem adicionar extensão.

---

### Alias em native projection

Para interface projection, aliases devem corresponder ao contrato Java.

Exemplo:

```sql
o.created_at as "createdAt"
```

Dependendo do driver e do tratamento de caixa, aspas podem preservar o alias camelCase.

O laboratório testará o mapeamento real.

Outra opção é usar aliases simples e uma projection compatível.

---

### @Modifying

`@Query` sozinho é tratado como consulta de leitura.

Para update ou delete bulk, adicione:

```java
@Modifying
```

Exemplo:

```java
@Modifying
@Query(
        """
        update OrdemServico o
        set o.status = :newStatus
        where o.status = :oldStatus
        """
)
int updateStatus(
        @Param("oldStatus")
        String oldStatus,
        @Param("newStatus")
        String newStatus
);
```

O retorno `int` representa linhas afetadas.

---

### Transacao obrigatoria para DML

Update e delete precisam de transação ativa.

Nesta aula, o laboratório usará `TransactionTemplate` já configurado.

A aula 348 aprofundará `@Transactional`.

A regra imediata é:

```text
@Modifying não cria sozinho
a fronteira transacional completa do caso de uso.
```

---

### Bulk ignora lifecycle individual

JPQL bulk atua diretamente no banco.

Ele não executa por entidade:

- dirty checking;
- `@PreUpdate`;
- `@PreRemove`;
- auditoria listener;
- incremento automático de `@Version`.

Isso já foi demonstrado na aula 344.

Agora o repository declarará uma bulk query que trata os campos críticos explicitamente.

---

### Bulk auditado e versionado

Método:

```java
@Modifying(
        flushAutomatically = true,
        clearAutomatically = true
)
@Query(
        """
        update OrdemServico o
        set
            o.status = :newStatus,
            o.updatedAt = :updatedAt,
            o.updatedBy = :updatedBy,
            o.versao = o.versao + 1
        where o.status = :oldStatus
          and o.codigo like :codePrefix
        """
)
int bulkChangeStatus(
        @Param("oldStatus")
        String oldStatus,
        @Param("newStatus")
        String newStatus,
        @Param("updatedAt")
        Instant updatedAt,
        @Param("updatedBy")
        String updatedBy,
        @Param("codePrefix")
        String codePrefix
);
```

O ator e o tempo são parâmetros explícitos porque callbacks não serão executados.

---

### flushAutomatically

Antes do bulk, podem existir mudanças pendentes no persistence context.

Com:

```java
flushAutomatically = true
```

Spring Data solicita flush antes de executar a modifying query.

Isso reduz o risco de o bulk ignorar alterações ainda não enviadas.

Flush continua não sendo commit.

---

### clearAutomatically

Depois do bulk, entidades managed podem estar desatualizadas.

Com:

```java
clearAutomatically = true
```

o persistence context é limpo após a operação.

As instâncias antigas ficam detached.

O código deve recarregar se precisar do novo estado.

---

### Risco do clear

Limpar o contexto descarta o gerenciamento das entidades.

Sem flush prévio, mudanças pendentes poderiam ser perdidas.

Por isso, no método oficial serão usados:

```text
flushAutomatically = true;

clearAutomatically = true.
```

Ainda assim, operações bulk devem ser raras e testadas.

---

### Delete bulk

Exemplo:

```java
@Modifying(
        flushAutomatically = true,
        clearAutomatically = true
)
@Query(
        """
        delete from OrdemServico o
        where o.codigo like :prefix
          and o.status = :status
        """
)
int deleteTemporaryOrders(
        @Param("prefix")
        String prefix,
        @Param("status")
        String status
);
```

Esse delete não executa callbacks individuais.

Use somente em fixture isolada no laboratório.

---

### Derivada versus @Query versus native

Use query derivada quando:

- método curto;
- propriedade simples;
- operador comum;
- leitura evidente.

Use JPQL em `@Query` quando:

- agrupamento explícito;
- join;
- fetch;
- projection;
- count customizado;
- nome derivado ficou longo.

Use native query quando:

- função específica;
- CTE;
- operador PostgreSQL;
- otimização física necessária;
- consulta legada;
- recurso não representável adequadamente em JPQL.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\projection"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\java\br\com\formacao\m13\aula347\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-347-query-annotation-native-jpql\src\test\java\br\com\formacao\m13\aula347"

Set-Location `
  "labs\m13\aula-347-query-annotation-native-jpql"
```

---

### 2. Criar pom e configuracao

Reutilize a stack da aula 346.

Ajuste:

```text
artifactId:
aula-347-query-annotation-native-jpql.

database:
formacao_java_jpa_347.

schema:
jpa_347.

persistence unit:
aula347PU.
```

Não adicione Spring Boot.

---

### 3. Criar migration

Tabelas:

```text
cliente;

ordem_servico.
```

Mantenha:

- IDs por sequence;
- código unique;
- status com check;
- foreign key;
- `versao`;
- quatro campos de auditoria;
- índice em status;
- índice em Cliente;
- índice em createdAt;
- índice composto em status, createdAt e ID.

---

### 4. Reutilizar entidades e auditoria

Copie a estrutura da aula 346.

A Ordem continua:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
private ClienteEntity cliente;
```

Adicione getter de Cliente para testes de fetch.

Não altere o mapping para EAGER.

---

### 5. Criar projections

`OrdemResumoRecord`:

```java
public record OrdemResumoRecord(
        Long id,
        String codigo,
        String status,
        String clienteNome,
        Instant createdAt
) {
}
```

`OrdemResumoView`:

```java
public interface OrdemResumoView {

    Long getId();

    String getCodigo();

    String getStatus();

    String getClienteNome();

    Instant getCreatedAt();
}
```

---

### 6. Criar ClienteRepository.java

Use apenas CRUD para preparar fixtures.

Nenhuma query customizada é necessária.

---

### 7. Criar OrdemServicoRepository.java

Além de `JpaRepository`, declare os métodos JPQL, native e modifying descritos nos próximos passos.

Evite manter métodos derivados equivalentes no mesmo repository.

O objetivo é comparar estratégias sem duplicidade confusa.

---

### 8. Criar query JPQL simples

```java
@Query(
        """
        select o
        from OrdemServico o
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity>
findExplicitlyByStatus(
        @Param("status") String status
);
```

Teste com `ABERTA`.

---

### 9. Criar busca agrupada

```java
@Query(
        """
        select o
        from OrdemServico o
        join o.cliente c
        where o.status in :statuses
          and (
                lower(o.codigo)
                    like lower(concat('%', :term, '%'))
             or lower(o.descricao)
                    like lower(concat('%', :term, '%'))
             or lower(c.nome)
                    like lower(concat('%', :term, '%'))
          )
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity> search(
        @Param("statuses")
        Collection<String> statuses,
        @Param("term")
        String term
);
```

Valide coleção e termo em uma facade de laboratório.

---

### 10. Criar join fetch

```java
@Query(
        """
        select o
        from OrdemServico o
        join fetch o.cliente c
        where o.status = :status
        order by o.createdAt desc, o.id desc
        """
)
List<OrdemServicoEntity>
findWithClientByStatus(
        @Param("status") String status
);
```

O teste mede loaded state e SELECTs.

---

### 11. Criar projection record

Use constructor expression com o pacote completo.

Confirme:

- campos corretos;
- nenhuma entidade de Cliente no retorno;
- uma consulta;
- zero dirty checking.

---

### 12. Criar projection interface

Use aliases:

```text
id;

codigo;

status;

clienteNome;

createdAt.
```

Confirme getters.

Não dependa da classe interna gerada pelo proxy.

---

### 13. Criar Page com countQuery

Método:

```java
@Query(
        value = """
                select o
                from OrdemServico o
                join o.cliente c
                where o.status in :statuses
                  and c.ativo = true
                """,
        countQuery = """
                select count(o)
                from OrdemServico o
                join o.cliente c
                where o.status in :statuses
                  and c.ativo = true
                """
)
Page<OrdemServicoEntity>
findActiveClientOrders(
        @Param("statuses")
        Collection<String> statuses,
        Pageable pageable
);
```

Use ID como desempate no `Pageable`.

---

### 14. Criar native projection

```java
@Query(
        value = """
                select
                    o.id as id,
                    o.codigo as codigo,
                    o.status as status,
                    c.nome as "clienteNome",
                    o.created_at as "createdAt"
                from jpa_347.ordem_servico o
                join jpa_347.cliente c
                    on c.id = o.cliente_id
                where o.status = :status
                order by
                    o.created_at desc,
                    o.id desc
                """,
        nativeQuery = true
)
List<OrdemResumoView>
findNativeViewsByStatus(
        @Param("status") String status
);
```

Teste aliases no PostgreSQL real.

---

### 15. Criar native query com funcao

Método:

```java
@Query(
        value = """
                select
                    o.id as id,
                    o.codigo as codigo,
                    o.status as status,
                    c.nome as "clienteNome",
                    o.created_at as "createdAt"
                from jpa_347.ordem_servico o
                join jpa_347.cliente c
                    on c.id = o.cliente_id
                where char_length(o.descricao)
                    >= :minimumLength
                order by
                    char_length(o.descricao) desc,
                    o.id desc
                """,
        nativeQuery = true
)
List<OrdemResumoView>
findWithMinimumDescriptionLength(
        @Param("minimumLength")
        int minimumLength
);
```

Documente a dependência PostgreSQL.

---

### 16. Criar Page nativa

Declare conteúdo e count físicos.

Use os mesmos filtros e parâmetros.

Confirme total e ordenação.

Não use `select *` na projection.

---

### 17. Criar bulk update

```java
@Modifying(
        flushAutomatically = true,
        clearAutomatically = true
)
@Query(
        """
        update OrdemServico o
        set
            o.status = :newStatus,
            o.updatedAt = :updatedAt,
            o.updatedBy = :updatedBy,
            o.versao = o.versao + 1
        where o.status = :oldStatus
          and o.codigo like :codePrefix
        """
)
int bulkChangeStatus(
        @Param("oldStatus")
        String oldStatus,
        @Param("newStatus")
        String newStatus,
        @Param("updatedAt")
        Instant updatedAt,
        @Param("updatedBy")
        String updatedBy,
        @Param("codePrefix")
        String codePrefix
);
```

O método será chamado dentro de `TransactionTemplate`.

---

### 18. Criar bulk delete isolado

```java
@Modifying(
        flushAutomatically = true,
        clearAutomatically = true
)
@Query(
        """
        delete from OrdemServico o
        where o.codigo like :prefix
          and o.status = :status
        """
)
int deleteTemporaryOrders(
        @Param("prefix")
        String prefix,
        @Param("status")
        String status
);
```

Use somente fixtures `OS-JPA-347-TEMP-%`.

---

### 19. Criar fixtures

Clientes:

```text
CLI-JPA-347-ALFA:
ativo.

CLI-JPA-347-BETA:
ativo.

CLI-JPA-347-GAMA:
inativo.
```

Ordens:

```text
OS-JPA-347-001
até
OS-JPA-347-012.
```

Distribua status, descrições e datas de forma determinística.

Inclua termos:

```text
painel;

móvel;

vistoria;

entrega.
```

Crie duas fixtures temporárias para bulk delete.

---

### 20. Criar AnnotatedQueryObservation.java

```java
public record AnnotatedQueryObservation(
        String scenario,
        int resultCount,
        long selectCount,
        long countSelectCount,
        long updateCount,
        long deleteCount,
        boolean clientLoaded,
        boolean projection,
        boolean nativeQuery,
        int affectedRows
) {
}
```

---

### 21. Criar AnnotatedQueryReport.java

```java
public record AnnotatedQueryReport(
        List<AnnotatedQueryObservation> observations,
        boolean jpqlWorked,
        boolean groupedSearchWorked,
        boolean fetchJoinWorked,
        boolean recordProjectionWorked,
        boolean interfaceProjectionWorked,
        boolean paginatedCountWorked,
        boolean nativeProjectionWorked,
        boolean modifyingUpdateWorked,
        boolean persistenceContextWasCleared,
        boolean bulkDeleteWorked
) {

    public AnnotatedQueryReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 22. Testar JPQL simples

Confirme:

- resultado por status;
- ordem por data e ID;
- JPQL usa entidade;
- SQL usa tabela;
- uma consulta.

---

### 23. Testar busca agrupada

Use:

```text
statuses:
ABERTA e AGENDADA.

term:
painel.
```

Confirme somente linhas que atendem aos dois blocos lógicos.

Crie um caso em que o termo apareça no Cliente.

---

### 24. Testar fetch join

Dentro de transação:

1. limpe inspector;
2. execute método;
3. verifique `PersistenceUnitUtil.isLoaded`;
4. acesse nome do Cliente;
5. confirme zero SELECT adicional.

Compare com consulta sem fetch.

---

### 25. Testar projections

Record:

- classe concreta;
- valores;
- imutabilidade.

Interface:

- getters;
- aliases;
- objeto não é entidade;
- ausência de dirty checking.

---

### 26. Testar paginação JPQL

Use página zero, tamanho três e ordenação estável.

Confirme:

```text
conteúdo;

totalElements;

totalPages;

SELECT de conteúdo;

SELECT de count.
```

Teste filtro que exclui Cliente inativo.

---

### 27. Testar native query

Confirme:

- projection mapeada;
- nomes físicos;
- schema explícito;
- função PostgreSQL;
- resultado correto.

Documente menor portabilidade.

---

### 28. Testar bulk update

Dentro de `TransactionTemplate`:

1. carregue uma Ordem managed;
2. altere outra entidade pendente para testar flush automático;
3. execute bulk;
4. capture row count;
5. confirme que o contexto foi limpo;
6. recarregue;
7. valide status, ator, instante e versão.

Não espere callbacks individuais.

---

### 29. Testar zero linhas

Execute bulk com prefixo inexistente.

Confirme retorno zero.

O caso de uso deve interpretar o resultado.

---

### 30. Testar bulk delete

Crie duas Ordens temporárias com status `CANCELADA`.

Execute delete bulk.

Confirme retorno dois.

Confirme que nenhuma outra fixture foi removida.

---

### 31. Criar Main.java

O `Main`:

1. inicia contexto;
2. prepara fixtures;
3. executa laboratório;
4. imprime relatório;
5. remove fixtures;
6. fecha contexto.

Formato:

```text
cenário | resultados | SELECTs | count | UPDATEs | DELETEs | loaded | projection | native | afetadas
```

---

### 32. Criar JpqlQueryIT.java

Casos:

- status;
- parâmetros nomeados;
- busca agrupada;
- IN;
- termo no código;
- termo na descrição;
- termo no Cliente;
- ordenação estável;
- coleção vazia rejeitada.

---

### 33. Criar FetchJoinQueryIT.java

Casos:

- consulta sem fetch;
- consulta com fetch;
- loaded state;
- SELECT adicional;
- mapping continua LAZY;
- uma consulta no cenário fetch.

---

### 34. Criar ProjectionQueryIT.java

Casos:

- record constructor;
- interface aliases;
- valores;
- ausência de entidade;
- uma consulta;
- SQL seleciona campos necessários.

---

### 35. Criar PaginatedAnnotatedQueryIT.java

Casos:

- página zero;
- página seguinte;
- total;
- totalPages;
- countQuery;
- mesmos filtros;
- Cliente inativo excluído;
- ordenação por ID.

---

### 36. Criar NativeQueryIT.java

Casos:

- projection;
- aliases;
- schema;
- colunas;
- função `char_length`;
- página nativa;
- count nativo;
- portabilidade documentada.

---

### 37. Criar ModifyingQueryIT.java

Casos:

- transação ativa;
- row count;
- auditoria explícita;
- versão incrementada;
- zero linhas;
- delete temporário;
- ausência de callback individual;
- rollback em cenário isolado.

---

### 38. Criar PersistenceContextBulkIT.java

Casos:

- entidade managed antes do bulk;
- flush automático;
- clear automático;
- instância anterior detached;
- recarga necessária;
- estado novo no banco;
- nenhuma entidade stale reutilizada.

---

### 39. Criar AnnotatedQueryArchitectureTest.java

Valide:

- métodos de consulta usam `@Query`;
- JPQL não usa nomes físicos;
- native usa `nativeQuery=true`;
- parâmetros possuem `@Param`;
- Page complexa possui `countQuery`;
- DML possui `@Modifying`;
- bulk possui flush e clear automáticos;
- zero `@Transactional` aprofundada no repository;
- zero query derivada complexa equivalente;
- ponte correta para aula 348.

---

### 40. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_347.ordem_servico
WHERE codigo LIKE 'OS-JPA-347-%';

DELETE FROM jpa_347.cliente
WHERE codigo LIKE 'CLI-JPA-347-%';
```

Use JDBC de teste.

---

### 41. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_347.
```

`02_executar_migration.ps1` executa Flyway.

`03_executar_laboratorio.ps1`:

```powershell
mvn clean verify
mvn exec:java
```

`04_validar_estado_final.ps1` exige:

```text
zero Clientes;

zero Ordens;

foreign key;

índices;

auditoria;

versão;

schema history V1.
```

`05_limpar_database.ps1` remove o database.

---

### 42. Executar o laboratorio

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
JPQL explícita;

parâmetros nomeados;

agrupamento;

fetch join;

record;

interface;

Page e countQuery;

native projection;

função PostgreSQL;

bulk update;

row count;

flush;

clear;

bulk delete;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 43. Criar documentacao

`query-jpql.md` deve registrar entidades, atributos, aliases, joins, fetch, projections e parâmetros.

`query-native.md` deve registrar schema, tabelas, colunas, aliases, funções e portabilidade.

`parametros-e-aliases.md` deve comparar nomeados, posicionais, projection interface e native aliases.

`pagination-count-query.md` deve comparar conteúdo e count.

`modifying-bulk-e-contexto.md` deve registrar:

- transação;
- row count;
- callbacks;
- versão;
- auditoria;
- flush;
- clear;
- recarga.

`criterios-escolha-query.md` deve comparar:

```text
derivada;

JPQL;

native;

Criteria;

Specification.
```

---

## Entendendo o que foi feito

### A consulta ficou explicita

O agrupamento e os joins deixaram de depender de um nome extenso.

### JPQL preservou o modelo JPA

Entidades e atributos Java continuaram centrais.

### Native query abriu recursos fisicos

A consulta passou a depender do PostgreSQL e do schema.

### Projections reduziram o resultado

Records e interfaces evitaram carregar entidades completas.

### Bulk exigiu responsabilidade extra

Auditoria, versão e persistence context precisaram de tratamento explícito.

---

## Erros comuns importantes

### Usar coluna SQL em JPQL

JPQL usa atributos Java.

### Esquecer countQuery em pagina complexa

O total pode falhar ou ficar incorreto.

### Usar native sem necessidade

A portabilidade diminui.

### Executar @Modifying sem transacao

DML exige fronteira transacional.

### Reutilizar entidade managed depois do bulk

O estado pode estar obsoleto ou detached.

---

## Comandos uteis

### Dependencias

```powershell
mvn dependency:tree
```

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

### Consultar fixtures

```sql
SELECT
    o.codigo,
    o.status,
    o.versao,
    o.updated_at,
    o.updated_by,
    c.nome
FROM jpa_347.ordem_servico o
JOIN jpa_347.cliente c
    ON c.id = o.cliente_id
WHERE o.codigo LIKE 'OS-JPA-347-%'
ORDER BY o.id;
```

---

## Exercicio guiado

### Parte 1 — Parametro posicional

Reescreva uma query simples com `?1`.

Compare legibilidade e restaure parâmetros nomeados.

### Parte 2 — Left join

Crie projection de Clientes com quantidade de Ordens.

Preserve Cliente sem Ordem.

### Parte 3 — Count incorreto

Remova propositalmente um filtro da count query.

Observe metadados errados e restaure.

### Parte 4 — Native por CTE

Em branch experimental, crie uma CTE PostgreSQL.

Documente por que JPQL não foi usada.

### Parte 5 — NativeQuery

Troque uma native query para a annotation composta `@NativeQuery`.

Compare legibilidade e mantenha a forma oficial escolhida.

### Parte 6 — Bulk sem clear

Desative `clearAutomatically` em teste experimental.

Observe entidade stale e restaure.

### Parte 7 — Bulk e versao esperada

Crie update de uma única Ordem com:

```text
ID;

versão esperada.
```

Retorne row count e trate zero como conflito.

### Parte 8 — ADR

Registre:

```text
derivada para consulta simples;

JPQL para modelo JPA explícito;

native para recurso físico necessário;

countQuery em pagina complexa;

@Modifying somente com row count verificado;

bulk com auditoria, versão, flush e clear;

transação aprofundada na aula 348.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 347 existe;
- continuidade com a aula 346 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data BOM 2026.0.0 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- Spring Boot não foi usado;
- Hibernate 7.4.4.Final foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_347` foi criado;
- configuração real está fora do Git;
- Cliente e Ordem foram mantidos;
- auditoria foi preservada;
- versão foi preservada;
- mapping LAZY foi preservado;
- `@Query` foi definida;
- JPQL explícita foi usada;
- entidade e atributos Java foram usados;
- tabela e colunas não foram usadas em JPQL;
- aliases foram usados;
- text blocks foram usados;
- parâmetros nomeados foram usados;
- `@Param` foi usado;
- parâmetros posicionais foram comparados;
- concatenação de entrada foi evitada;
- coleção IN foi validada;
- agrupamento lógico foi explícito;
- join foi usado;
- join fetch foi usado;
- Cliente foi carregado sem SELECT adicional;
- mapping não foi alterado para EAGER;
- `distinct` foi explicado;
- record projection foi criada;
- constructor expression foi usada;
- nome totalmente qualificado foi usado;
- interface projection foi criada;
- aliases corresponderam aos accessors;
- projection não foi tratada como entidade;
- `Page` foi retornada;
- `Pageable` foi usado;
- `countQuery` foi declarada;
- filtros de conteúdo e count foram iguais;
- count não recebeu fetch;
- ordenação estável foi usada;
- Sort externo livre foi proibido;
- SQL nativo foi declarado;
- `nativeQuery=true` foi usado;
- schema, tabela e colunas foram usados na native;
- projection nativa foi mapeada;
- aliases camelCase foram testados;
- função PostgreSQL foi usada;
- portabilidade foi discutida;
- `@NativeQuery` foi apresentada como atalho;
- página nativa teve countQuery;
- `@Modifying` foi usada;
- update bulk foi criado;
- delete bulk isolado foi criado;
- transação ativa foi exigida;
- aprofundamento transacional foi adiado;
- row count foi retornado;
- row count zero foi testado;
- callbacks individuais não foram esperados;
- auditoria foi atualizada explicitamente;
- versão foi incrementada explicitamente;
- `flushAutomatically` foi usado;
- `clearAutomatically` foi usado;
- risco do clear foi explicado;
- estado managed anterior não foi reutilizado;
- recarga após bulk foi exigida;
- flush foi diferenciado de commit;
- derivada, JPQL e native foram comparadas;
- native não foi usada sem motivo;
- SQL foi observado sem bindings;
- testes JPQL foram criados;
- testes de fetch foram criados;
- testes de projection foram criados;
- testes de paginação foram criados;
- testes native foram criados;
- testes modifying foram criados;
- testes de contexto bulk foram criados;
- teste de arquitetura foi criado;
- fixtures foram removidas;
- estado final ficou vazio;
- propagação não foi antecipada;
- rollback rules não foram antecipadas;
- self-invocation não foi antecipada;
- Testcontainers não foi antecipado;
- ponte para a aula 348 está correta;
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
  labs/m13/aula-347-query-annotation-native-jpql
```

Commit recomendado:

```powershell
git commit -m "feat(m13): declarar consultas jpql e native com query"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você ultrapassou o limite das queries derivadas com consultas explícitas.

Aprendeu:

```text
@Query:
declara a consulta.

JPQL:
usa entidades e atributos.

nativeQuery:
usa banco físico.

@Param:
liga parâmetros.

join fetch:
carrega associação.

projection:
reduz resultado.

countQuery:
calcula total.

@Modifying:
executa DML.

row count:
mede linhas afetadas.

flush e clear:
controlam contexto no bulk.
```

O laboratório comprovou:

```text
JPQL por status;

busca agrupada;

IN;

join;

fetch join;

record projection;

interface projection;

Page com count;

native projection;

função PostgreSQL;

bulk update;

auditoria e versão explícitas;

bulk delete;

limpeza do contexto.
```

A decisão arquitetural foi:

```text
derivada:
consulta simples.

JPQL:
consulta explícita sobre o modelo.

native:
recurso físico necessário.

bulk:
operação excepcional e controlada.

transação:
próxima fronteira a aprofundar.
```

A próxima aula será:

```text
348 - M13.38 - Transacoes com Spring Data
```

Nela, você aprenderá:

- `@Transactional`;
- proxy transacional;
- fronteira no service;
- `REQUIRED`;
- `REQUIRES_NEW`;
- `MANDATORY`;
- read-only;
- timeout;
- isolamento;
- rollback em runtime exception;
- checked exception;
- `rollbackFor`;
- `noRollbackFor`;
- self-invocation;
- método público e proxy;
- múltiplos repositories;
- auditoria dentro da transação;
- flush e commit;
- eventos depois do commit;
- testes de propagação.

A aula 347 declarou as consultas.

A aula 348 definirá com precisão em qual unidade de trabalho essas consultas e alterações devem acontecer.

---

# Material complementar

## Checkpoint final

- [ ] Declarei JPQL com `@Query`.
- [ ] Usei native query somente para necessidade física.
- [ ] Criei projections e paginação com countQuery.
- [ ] Executei DML com `@Modifying`.
- [ ] Tratei auditoria, versão, flush e clear no bulk.

---

## Troubleshooting adicional

### JPQL nao encontra tabela

Use entidade e atributos, não nomes físicos.

### Parametro nao foi ligado

Confira `:nome` e `@Param("nome")`.

### Projection interface veio nula

Revise aliases.

### Page total ficou errado

Revise `countQuery`.

### Bulk deixou entidade antiga

Use clear e recarregue.

---

## Perguntas de revisao

1. O que faz `@Query`?
2. Qual linguagem é padrão?
3. JPQL usa tabela ou entidade?
4. Para que serve `@Param`?
5. O que faz join fetch?
6. Projection record usa qual construção?
7. Interface projection depende de quê?
8. Por que Page pode precisar de countQuery?
9. O que muda em native query?
10. Quando usar native?
11. O que faz `@Modifying`?
12. O que retorna um bulk int?
13. Bulk chama PreUpdate?
14. Bulk incrementa versão automaticamente?
15. Para que serve flushAutomatically?
16. Para que serve clearAutomatically?
17. Flush é commit?
18. Qual estratégia usar para consulta simples?
19. Transações foram aprofundadas?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Declara consulta no repository.
2. JPQL.
3. Entidade e atributos.
4. Ligar parâmetro nomeado.
5. Carregar associação na consulta.
6. Constructor expression.
7. Aliases compatíveis.
8. Para total correto.
9. Usa SQL físico.
10. Quando há necessidade específica.
11. Marca DML.
12. Linhas afetadas.
13. Não individualmente.
14. Não.
15. Flush antes do bulk.
16. Limpar contexto depois.
17. Não.
18. Derivada.
19. Não.
20. Transacoes com Spring Data.

---

## Desafio opcional

Crie:

```java
AnnotatedQueryPolicyVerifier
```

Entrada:

```text
método;

annotations;

query;

countQuery;

parâmetros;

retorno.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- alertar concatenação;
- exigir `@Param` em consulta nomeada;
- exigir countQuery em página complexa;
- alertar native sem justificativa;
- exigir `@Modifying` em DML;
- alertar bulk sem clear;
- alertar update de entidade versionada sem incremento;
- não iniciar Spring;
- possuir testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 347 - M13.37 - Query annotation native query e JPQL

- Usei `@Query` para consultas explícitas.
- Diferenciei JPQL de SQL nativo.
- Mantive JPQL baseada em entidades e atributos Java.
- Usei aliases e text blocks.
- Usei parâmetros nomeados.
- Usei `@Param`.
- Evitei concatenação de entrada.
- Criei busca com agrupamento lógico.
- Usei `IN`.
- Usei join.
- Usei join fetch.
- Mantive associação LAZY no mapping.
- Evitei SELECT adicional do Cliente.
- Criei record projection.
- Usei constructor expression.
- Criei interface projection.
- Mapeei aliases para accessors.
- Retornei `Page`.
- Declarei `countQuery`.
- Mantive filtros iguais no conteúdo e count.
- Usei `Pageable` com ordenação estável.
- Criei native query com schema, tabela e colunas.
- Usei função específica do PostgreSQL.
- Documentei perda de portabilidade.
- Conheci `@NativeQuery` como atalho.
- Criei página nativa com countQuery.
- Usei `@Modifying`.
- Criei update bulk.
- Criei delete bulk isolado.
- Usei row count.
- Testei zero linhas afetadas.
- Entendi que bulk ignora callbacks individuais.
- Atualizei auditoria explicitamente.
- Incrementei versão explicitamente.
- Usei `flushAutomatically`.
- Usei `clearAutomatically`.
- Recarreguei dados após bulk.
- Diferenciei flush de commit.
- Comparei derivada, JPQL e native.
- Mantive Flyway no DDL e Hibernate em validate.
- Não aprofundei propagação transacional.
- Próxima aula: Transacoes com Spring Data.
```

---

## Referencia tecnica curta

```text
@Query:
consulta explícita.

JPQL:
modelo Java.

Native:
modelo físico.

@Param:
binding nomeado.

Fetch:
carregamento.

Projection:
resultado enxuto.

CountQuery:
total.

@Modifying:
DML.

RowCount:
linhas afetadas.

Clear:
contexto renovado.
```

Regra final:

```text
@Query deve ser usada quando a derivacao deixa de comunicar a consulta com clareza; JPQL preserva o modelo JPA, SQL nativo deve ter justificativa fisica, projections e countQuery precisam de contratos testados e qualquer bulk com @Modifying deve tratar transacao, row count, auditoria, versao, flush e limpeza do persistence context de forma explicita.
```
