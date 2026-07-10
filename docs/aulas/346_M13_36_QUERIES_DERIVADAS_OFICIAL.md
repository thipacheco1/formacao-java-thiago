# 346 - M13.36 - Queries derivadas

## Apresentacao da aula

Na aula 345, você iniciou Spring Data JPA sem Spring Boot.

Você configurou explicitamente:

```text
AnnotationConfigApplicationContext;

@EnableJpaRepositories;

@EnableTransactionManagement;

LocalContainerEntityManagerFactoryBean;

JpaTransactionManager;

TransactionTemplate.
```

Também criou:

```java
public interface OrdemServicoRepository
        extends JpaRepository<
                OrdemServicoEntity,
                Long
        > {
}
```

O repository possuía somente os métodos herdados.

A infraestrutura criou um proxy em runtime e encaminhou operações comuns para a implementação base JPA.

Foram praticados:

- `save`;
- `findById`;
- `existsById`;
- `count`;
- `findAll`;
- `flush`;
- `saveAndFlush`;
- `getReferenceById`;
- `delete`;
- `deleteById`;
- persist;
- merge;
- dirty checking;
- transação externa.

Agora o repository declarará consultas próprias sem implementação manual e sem escrever JPQL.

Exemplo:

```java
Optional<OrdemServicoEntity> findByCodigo(
        String codigo
);
```

O Spring Data interpreta o nome:

```text
find:
operação de consulta.

By:
início dos critérios.

Codigo:
propriedade da entidade.
```

Outro exemplo:

```java
List<OrdemServicoEntity>
findByStatusOrderByCreatedAtDescIdDesc(
        String status
);
```

O nome expressa:

```text
filtrar por status;

ordenar createdAt descendente;

desempatar por ID descendente.
```

Esse mecanismo é chamado de:

```text
query derivation;

query method;

query derivada.
```

Spring Data analisa a assinatura durante a criação do repository.

Ele valida:

- prefixo;
- propriedades;
- operadores;
- parâmetros;
- retorno;
- ordenação;
- limite.

Se uma propriedade não existir, o contexto pode falhar durante o startup.

Essa falha antecipada é valiosa.

Ela impede que um método inválido permaneça escondido até a primeira chamada em produção.

Nesta aula, você aprenderá:

- estrutura de nomes derivados;
- subject e predicate;
- `find`, `read`, `get` e `query`;
- separador `By`;
- propriedades simples;
- propriedades herdadas;
- propriedades aninhadas;
- `_` para explicitar travessia;
- `Is` e `Equals`;
- `Not`;
- `IsNull` e `IsNotNull`;
- `True` e `False`;
- `Containing`;
- `StartingWith`;
- `EndingWith`;
- `IgnoreCase`;
- `In`;
- `Between`;
- `Before`;
- `After`;
- `GreaterThan` e `LessThan`;
- `And`;
- `Or`;
- precedência;
- `OrderBy`;
- `Asc` e `Desc`;
- `First`;
- `Top`;
- `Distinct`;
- `Optional`;
- `List`;
- `Page`;
- `Slice`;
- `Pageable`;
- `Sort`;
- validação no startup;
- limites de legibilidade;
- critérios para abandonar derivação.

A infraestrutura continuará:

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
formacao_java_jpa_346
```

O schema será:

```text
jpa_346
```

Flyway continuará dono do DDL.

Hibernate permanecerá em:

```text
validate.
```

O modelo terá:

```text
ClienteEntity;

OrdemServicoEntity.
```

As duas entidades continuarão auditáveis e versionadas.

A Ordem terá:

```text
ManyToOne LAZY para Cliente.
```

O laboratório comprovará:

```text
findByCodigo:
retorna Optional.

findByStatus:
retorna lista filtrada.

ContainingIgnoreCase:
busca textual.

propriedade aninhada:
consulta Cliente.nome.

True:
filtra Cliente ativo.

In:
filtra vários status.

Between:
filtra createdAt.

Top e First:
limitam resultado.

Page:
executa conteúdo e count.

Slice:
detecta próxima fatia sem total exato.

método inválido:
falha na criação do repository.

nome excessivamente complexo:
é rejeitado por decisão arquitetural.

estado final:
zero CLI-JPA-346-% e OS-JPA-346-%.
```

A próxima aula será:

```text
347 - M13.37 - Query annotation native query e JPQL
```

Por isso, esta aula não usará:

- `@Query`;
- JPQL declarada no repository;
- native query;
- `@Modifying`;
- named query;
- constructor expression Spring Data;
- query rewriting;
- SQL manual;
- Specification Spring Data.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
344:
Auditoria CreatedAt UpdatedAt usuario.

345:
Spring Data Repository conceitos.

346:
Queries derivadas.

347:
Query annotation native query e JPQL.

348:
Transacoes com Spring Data.
```

A aula 345 mostrou:

```text
como o repository é criado;

como o CRUD herdado funciona.
```

A aula 346 mostrará:

```text
como o nome de um método
pode virar uma consulta.
```

A progressão será:

```text
CRUD herdado:
operações gerais.

query derivada:
consulta simples por convenção.

@Query:
consulta explícita quando a convenção deixa de ajudar.

transação Spring Data:
fronteiras e propagação.
```

Nesta aula:

```text
queries derivadas:
sim.

nested properties:
sim.

Page e Slice:
sim.

Sort e Pageable:
sim.

startup failure:
sim.

SQL observado:
sim.

@Query:
não.

native:
não.

Spring Boot:
não.
```

A arquitetura será:

```text
chamada do método
    -> proxy do repository
        -> parser do nome
            -> modelo da entidade
                -> query JPA
                    -> Hibernate
                        -> SQL.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-346-queries-derivadas
```

Estrutura final:

```text
labs
└── m13
    └── aula-346-queries-derivadas
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── gramatica-query-methods.md
        │   ├── propriedades-aninhadas.md
        │   ├── precedencia-and-or.md
        │   ├── retornos-page-slice-list.md
        │   ├── criterios-abandonar-derivacao.md
        │   └── troubleshooting-queries-derivadas.md
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
            │   │                   └── aula346
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
            │   │                       │   ├── DerivedQueryLab.java
            │   │                       │   ├── DerivedQueryObservation.java
            │   │                       │   └── DerivedQueryReport.java
            │   │                       ├── repository
            │   │                       │   ├── ClienteRepository.java
            │   │                       │   └── OrdemServicoRepository.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_346.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula346
                                        ├── BasicDerivedQueriesIT.java
                                        ├── TextAndCollectionOperatorsIT.java
                                        ├── NestedPropertyQueriesIT.java
                                        ├── LogicalCompositionIT.java
                                        ├── LimitingAndOrderingIT.java
                                        ├── PageAndSliceIT.java
                                        ├── InvalidPropertyStartupTest.java
                                        ├── DerivedQueryArchitectureTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
12 Ordens;

3 Clientes;

4 status;

texto com caixa diferente;

Cliente ativo e inativo;

datas controladas;

Optional único;

listas ordenadas;

Top 3;

First 1;

Page size 3;

Slice size 3;

falha de propriedade inválida;

zero @Query.
```

---

## Conceito essencial

### Estrutura geral

Um query method pode ser lido em duas partes:

```text
subject;
predicate.
```

Exemplo:

```java
List<OrdemServicoEntity>
findDistinctTop3ByStatusOrderByCreatedAtDesc(
        String status
);
```

Subject:

```text
find;

Distinct;

Top3.
```

Predicate:

```text
Status;

OrderByCreatedAtDesc.
```

O primeiro `By` separa as partes.

---

### Prefixos

Prefixos comuns incluem:

```text
find;

read;

get;

query;

search;

stream.
```

Exemplos:

```java
findByCodigo(...);

readByCodigo(...);

getByCodigo(...);

queryByCodigo(...).
```

Eles expressam consulta.

Para consistência do projeto, o código oficial usará principalmente:

```text
find.
```

---

### By

`By` inicia a expressão de critérios.

Exemplo:

```java
findByStatus
```

Sem o `By`, o parser não interpreta `Status` como predicate da mesma forma.

Evite palavras decorativas no meio dos critérios.

---

### Propriedade simples

Entidade:

```java
private String status;
```

Método:

```java
List<OrdemServicoEntity> findByStatus(
        String status
);
```

O nome usa a propriedade Java:

```text
status.
```

Não usa a coluna:

```text
status_ordem.
```

---

### Propriedade herdada

`OrdemServicoEntity` herda:

```java
private Instant createdAt;
```

A query pode usar:

```java
List<OrdemServicoEntity>
findByCreatedAtBetween(
        Instant start,
        Instant end
);
```

O parser navega pelo modelo persistente, incluindo propriedades herdadas.

---

### Is e Equals

Os métodos:

```java
findByStatus(
        String status
);

findByStatusIs(
        String status
);

findByStatusEquals(
        String status
);
```

representam igualdade.

O laboratório manterá a forma mais curta:

```java
findByStatus.
```

---

### Not

Exemplo:

```java
List<OrdemServicoEntity>
findByStatusNot(
        String status
);
```

Isso seleciona valores diferentes.

Campos nulos precisam de atenção porque a lógica SQL com `NULL` não equivale a uma comparação comum.

---

### IsNull e IsNotNull

Para propriedade anulável:

```java
findByExternalReferenceIsNull();

findByExternalReferenceIsNotNull();
```

O modelo terá:

```java
externalReference
```

opcional apenas para praticar nulidade.

Prefira palavras explícitas em vez de depender de parâmetro `null` como contrato escondido.

---

### True e False

`ClienteEntity` possuirá:

```java
private boolean ativo;
```

Métodos:

```java
List<OrdemServicoEntity>
findByCliente_AtivoTrue();

List<OrdemServicoEntity>
findByCliente_AtivoFalse();
```

Nenhum parâmetro booleano é necessário.

---

### Containing

Método:

```java
List<OrdemServicoEntity>
findByDescricaoContaining(
        String fragment
);
```

Representa busca por fragmento.

Conceitualmente:

```text
%fragment%.
```

O desempenho de `LIKE` com wildcard inicial precisa ser medido.

Um índice B-tree comum pode não ajudar.

---

### IgnoreCase

Exemplo:

```java
List<OrdemServicoEntity>
findByDescricaoContainingIgnoreCase(
        String fragment
);
```

A comparação deixa de depender da caixa.

`IgnoreCase` faz sentido para propriedades textuais.

Não aplique a números ou datas.

---

### StartingWith e EndingWith

Exemplos:

```java
findByCodigoStartingWith(
        String prefix
);

findByCodigoEndingWith(
        String suffix
);
```

Conceitualmente:

```text
prefix%;

%suffix.
```

`StartingWith` tende a ser mais amigável a determinados índices que `EndingWith`, dependendo do banco e da configuração.

---

### In

Exemplo:

```java
List<OrdemServicoEntity>
findByStatusIn(
        Collection<String> statuses
);
```

A coleção representa:

```text
status IN (...).
```

Política do laboratório:

```text
coleção nula:
rejeitada.

coleção vazia:
rejeitada na camada de caso de uso.
```

Não dependa de SQL gerado para uma lista vazia.

---

### Between

Exemplo:

```java
findByCreatedAtBetween(
        Instant start,
        Instant end
);
```

O intervalo é inclusivo.

Valide:

```text
start <= end.
```

A query method não substitui validação de entrada.

---

### Before e After

Exemplos:

```java
findByCreatedAtBefore(
        Instant instant
);

findByCreatedAtAfter(
        Instant instant
);
```

Eles representam comparações temporais estritas.

Para inclusão do limite, escolha operadores apropriados ou abandone a derivação quando o nome não comunicar bem.

---

### GreaterThan e LessThan

Exemplos:

```java
findByVersionGreaterThan(
        int version
);

findByVersionLessThan(
        int version
);
```

O laboratório usará uma consulta didática por versão.

Em negócio real, consultar versão raramente é uma necessidade de usuário.

---

### Propriedade aninhada

A Ordem possui:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
private ClienteEntity cliente;
```

Consulta:

```java
List<OrdemServicoEntity>
findByClienteNomeContainingIgnoreCase(
        String name
);
```

O parser tenta percorrer:

```text
ordem.cliente.nome.
```

---

### Underscore de travessia

Forma explícita:

```java
findByCliente_NomeContainingIgnoreCase(
        String name
);
```

O `_` indica um ponto de travessia.

Ele ajuda quando existem nomes ambíguos.

Política do laboratório:

```text
usar underscore em propriedades aninhadas.
```

Não nomeie propriedades persistentes comuns com underscore.

---

### Ambiguidade

Imagine que a Ordem tenha:

```text
clienteNome;

cliente.nome.
```

O nome:

```java
findByClienteNome(...)
```

pode ser interpretado como a propriedade direta.

Use:

```java
findByCliente_Nome(...)
```

para explicitar a associação.

Melhor ainda, evite modelos com nomes que produzam ambiguidade recorrente.

---

### And

Exemplo:

```java
findByStatusAndCliente_AtivoTrue(
        String status
);
```

As duas condições precisam ser verdadeiras.

A ordem dos parâmetros segue a ordem das propriedades que recebem parâmetros.

---

### Or

Exemplo:

```java
findByStatusOrStatus(
        String first,
        String second
);
```

Apesar de funcionar, `In` comunica melhor uma lista de status.

Use `Or` quando as condições realmente são alternativas diferentes.

---

### Precedencia de And e Or

Em query derivada, `And` possui precedência maior que `Or`.

Exemplo:

```java
findByStatusOrCliente_AtivoTrueAndDescricaoContainingIgnoreCase(
        String status,
        String fragment
);
```

Leitura:

```text
status
OR
(
    cliente ativo
    AND descrição contém fragmento
).
```

Não representa:

```text
(
    status
    OR cliente ativo
)
AND descrição contém fragmento.
```

Se a regra exige agrupamento difícil de perceber, não force o nome.

A aula 347 usará uma consulta explícita.

---

### OrderBy estatico

Exemplo:

```java
findByStatusOrderByCreatedAtDescIdDesc(
        String status
);
```

A ordenação inclui ID como desempate.

Isso preserva estabilidade quando duas Ordens possuem o mesmo `createdAt`.

---

### Sort dinamico

Método:

```java
List<OrdemServicoEntity>
findByStatus(
        String status,
        Sort sort
);
```

O consumidor fornece uma ordenação construída com propriedades permitidas.

Não transforme diretamente entrada externa em nomes de propriedade.

Mapeie valores aceitos para `Sort`.

---

### Pageable

Método:

```java
Page<OrdemServicoEntity>
findByStatus(
        String status,
        Pageable pageable
);
```

O `Pageable` carrega:

- número da página;
- tamanho;
- ordenação.

A consulta retorna uma `Page`.

---

### Page

`Page` contém:

```text
content;

totalElements;

totalPages;

number;

size;

hasNext;

hasPrevious.
```

Para fornecer total exato, Spring Data executa uma consulta de count quando necessária.

Observe SQL:

```text
SELECT de conteúdo;

SELECT de count.
```

Duas consultas constantes não são N+1.

---

### Slice

Método:

```java
Slice<OrdemServicoEntity>
findByCliente_AtivoTrue(
        Pageable pageable
);
```

`Slice` informa:

```text
content;

hasNext;

hasPrevious.
```

Ele não promete total de elementos e páginas.

É útil quando o total exato não é necessário.

O mecanismo pode buscar um item adicional para descobrir se existe próxima fatia.

---

### Optional

Use:

```java
Optional<OrdemServicoEntity>
findByCodigo(
        String codigo
);
```

quando o banco garante unicidade.

Se a consulta retornar mais de um registro, um retorno singular pode gerar erro.

O contrato Java e a constraint precisam concordar.

---

### List

Use `List` quando múltiplos resultados são esperados.

Uma lista vazia representa ausência de resultados.

Não use `Optional<List<T>>`.

---

### First e Top

Exemplos:

```java
Optional<OrdemServicoEntity>
findFirstByStatusOrderByCreatedAtAscIdAsc(
        String status
);

List<OrdemServicoEntity>
findTop3ByStatusOrderByCreatedAtDescIdDesc(
        String status
);
```

`First` sem número implica limite um.

`Top3` limita a três.

Sempre combine limite com ordenação determinística.

---

### Distinct

Exemplo:

```java
List<OrdemServicoEntity>
findDistinctByCliente_AtivoTrue();
```

`Distinct` pode eliminar raízes duplicadas em consultas que atravessam associações.

Não use como remendo automático para modelagem ou join incorreto.

---

### Retorno Stream

Spring Data pode suportar retornos em `Stream<T>` para determinados query methods.

O stream precisa ser fechado e geralmente consumido dentro de transação.

O laboratório apenas documentará esse retorno.

Não será usado no fluxo principal.

---

### Startup validation

Uma interface inválida:

```java
public interface BrokenOrderRepository
        extends Repository<
                OrdemServicoEntity,
                Long
        > {

    List<OrdemServicoEntity>
    findByStatuus(
            String status
    );
}
```

usa uma propriedade inexistente:

```text
statuus.
```

Ao criar o repository, Spring Data falha.

O teste terá um contexto isolado para essa interface.

A aplicação principal não escaneará o repository quebrado.

---

### Nomes longos

Método tecnicamente possível:

```java
findByStatusAndCliente_AtivoTrueAndDescricaoContainingIgnoreCaseAndCreatedAtBetweenOrderByCreatedAtDescIdDesc
```

Mesmo que funcione, ele possui problemas:

- leitura lenta;
- assinatura extensa;
- muitos parâmetros;
- difícil agrupamento;
- difícil evolução;
- difícil reutilização;
- mensagem de erro complexa.

A derivação deixa de ajudar quando o nome vira uma linguagem própria difícil de revisar.

---

### Criterios para abandonar derivacao

Prefira uma consulta explícita quando houver:

- agrupamento complexo de `AND` e `OR`;
- agregação;
- subquery;
- projection específica complexa;
- joins com fetch;
- condições opcionais;
- função do banco;
- CTE;
- native SQL;
- nome muito longo;
- necessidade de comentário para entender o método.

A aula 347 apresentará `@Query`.

---

### Query derivada nao corrige fetch

Um método por propriedade aninhada pode gerar join para filtrar.

Isso não significa que a associação ficou carregada.

Se o retorno é entidade e o código navega por relações lazy, ainda pode existir N+1.

Observe o SQL.

---

### Query derivada nao cria indice

A query pode estar correta e lenta.

Índices continuam baseados em:

- filtros;
- ordenação;
- cardinalidade;
- volume;
- plano de execução.

O laboratório terá índices didáticos em código, status, Cliente e createdAt.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\java\br\com\formacao\m13\aula346\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\java\br\com\formacao\m13\aula346\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\java\br\com\formacao\m13\aula346\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\java\br\com\formacao\m13\aula346\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\java\br\com\formacao\m13\aula346\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\java\br\com\formacao\m13\aula346\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-346-queries-derivadas\src\test\java\br\com\formacao\m13\aula346"

Set-Location `
  "labs\m13\aula-346-queries-derivadas"
```

---

### 2. Criar pom e configuracao

Reutilize a stack da aula 345:

```text
Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

Hibernate 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

Ajuste:

```text
artifactId:
aula-346-queries-derivadas.

database:
formacao_java_jpa_346.

schema:
jpa_346.

persistence unit:
aula346PU.
```

---

### 3. Criar migration

Tabelas:

```text
cliente;

ordem_servico.
```

Cliente:

```text
id;

codigo;

nome;

ativo;

versao;

auditoria.
```

Ordem:

```text
id;

codigo;

descricao;

status;

external_reference;

cliente_id;

versao;

auditoria.
```

Crie:

- primary keys;
- unique nos códigos;
- foreign key;
- checks;
- índice em status;
- índice em `cliente_id`;
- índice em `created_at`;
- índice composto em status, created_at e ID.

---

### 4. Criar ClienteEntity.java

Campos:

```text
id;

codigo;

nome;

ativo;

versao;

auditoria.
```

Métodos:

```java
public static ClienteEntity novo(
        String codigo,
        String nome,
        boolean ativo
)

public void ativar()

public void inativar()
```

---

### 5. Criar OrdemServicoEntity.java

Campos:

```text
id;

codigo;

descricao;

status;

externalReference;

cliente;

versao;

auditoria.
```

Mapping:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
@JoinColumn(
        name = "cliente_id",
        nullable = false
)
private ClienteEntity cliente;
```

---

### 6. Criar ClienteRepository.java

```java
public interface ClienteRepository
        extends JpaRepository<
                ClienteEntity,
                Long
        > {
}
```

Ele será usado apenas para preparar fixtures.

Não adicione queries próprias.

---

### 7. Criar OrdemServicoRepository.java

Declare:

```java
Optional<OrdemServicoEntity>
findByCodigo(
        String codigo
);

boolean existsByCodigo(
        String codigo
);

long countByStatus(
        String status
);

List<OrdemServicoEntity>
findByStatusOrderByCreatedAtDescIdDesc(
        String status
);

List<OrdemServicoEntity>
findByDescricaoContainingIgnoreCase(
        String fragment
);

List<OrdemServicoEntity>
findByCodigoStartingWithOrderByCodigoAsc(
        String prefix
);

List<OrdemServicoEntity>
findByCodigoEndingWith(
        String suffix
);

List<OrdemServicoEntity>
findByExternalReferenceIsNull();

List<OrdemServicoEntity>
findByExternalReferenceIsNotNull();

List<OrdemServicoEntity>
findByStatusIn(
        Collection<String> statuses
);

List<OrdemServicoEntity>
findByCreatedAtBetween(
        Instant start,
        Instant end
);

List<OrdemServicoEntity>
findByCreatedAtBefore(
        Instant instant
);

List<OrdemServicoEntity>
findByCreatedAtAfter(
        Instant instant
);

List<OrdemServicoEntity>
findByCliente_NomeContainingIgnoreCase(
        String name
);

List<OrdemServicoEntity>
findByCliente_AtivoTrue();

List<OrdemServicoEntity>
findByCliente_AtivoFalse();

List<OrdemServicoEntity>
findByStatusAndCliente_AtivoTrue(
        String status
);

List<OrdemServicoEntity>
findByStatusOrStatusOrderByCodigoAsc(
        String first,
        String second
);

Optional<OrdemServicoEntity>
findFirstByStatusOrderByCreatedAtAscIdAsc(
        String status
);

List<OrdemServicoEntity>
findTop3ByStatusOrderByCreatedAtDescIdDesc(
        String status
);

Page<OrdemServicoEntity>
findByStatus(
        String status,
        Pageable pageable
);

Slice<OrdemServicoEntity>
findByCliente_AtivoTrue(
        Pageable pageable
);

List<OrdemServicoEntity>
findDistinctByCliente_AtivoTrue(
        Sort sort
);
```

Não adicione `@Query`.

---

### 8. Manter configuracao Spring explicita

Reutilize:

```text
@EnableJpaRepositories;

@EnableTransactionManagement;

LocalContainerEntityManagerFactoryBean;

JpaTransactionManager;

TransactionTemplate.
```

Ajuste packages para `aula346`.

---

### 9. Criar fixtures

Clientes:

```text
CLI-JPA-346-ALFA:
Alfa Varejo;
ativo.

CLI-JPA-346-BETA:
Beta Corporativo;
ativo.

CLI-JPA-346-GAMA:
Gama Inativo;
inativo.
```

Ordens:

```text
OS-JPA-346-001
até
OS-JPA-346-012.
```

Distribua:

```text
ALFA:
5.

BETA:
4.

GAMA:
3.
```

Status:

```text
ABERTA:
4.

AGENDADA:
3.

CONCLUIDA:
3.

CANCELADA:
2.
```

Descrições devem incluir variações de caixa:

```text
Instalação de MÓVEL;

instalação de painel;

Vistoria técnica;

Entrega especial.
```

Algumas referências externas serão nulas e outras preenchidas.

Use `Clock.fixed` com instantes crescentes por fixture.

---

### 10. Criar DerivedQueryObservation.java

```java
public record DerivedQueryObservation(
        String method,
        int resultCount,
        String firstCode,
        String lastCode,
        long selectCount,
        long countSelectCount,
        boolean ordered,
        boolean expected
) {
}
```

---

### 11. Criar DerivedQueryReport.java

```java
public record DerivedQueryReport(
        List<DerivedQueryObservation> observations,
        boolean basicEqualityWorked,
        boolean textOperatorsWorked,
        boolean nestedPropertyWorked,
        boolean logicalCompositionWorked,
        boolean limitingWorked,
        boolean pageWorked,
        boolean sliceWorked,
        boolean invalidPropertyFailedAtStartup,
        boolean noQueryAnnotationWasUsed
) {

    public DerivedQueryReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 12. Testar Optional por codigo

Execute:

```java
repository.findByCodigo(
        "OS-JPA-346-001"
);
```

Confirme presente.

Execute código inexistente.

Confirme `Optional.empty`.

A constraint unique sustenta o retorno singular.

---

### 13. Testar exists e count

Execute:

```java
repository.existsByCodigo(...);

repository.countByStatus(
        "ABERTA"
);
```

Confirme:

```text
exists true e false;

count ABERTA = 4.
```

Observe que são queries próprias.

---

### 14. Testar texto

Execute:

```java
findByDescricaoContainingIgnoreCase(
        "instalação"
);
```

Confirme resultados independentemente da caixa.

Teste `StartingWith`:

```text
OS-JPA-346-00.
```

Teste `EndingWith`:

```text
012.
```

Confirme ordenação onde foi declarada.

---

### 15. Testar nulidade

Execute:

```java
findByExternalReferenceIsNull();

findByExternalReferenceIsNotNull();
```

A soma dos resultados deve ser 12.

---

### 16. Testar In

Use:

```text
ABERTA;

AGENDADA.
```

Confirme sete resultados.

Na camada do laboratório, rejeite coleção vazia antes de chamar o repository.

---

### 17. Testar intervalo temporal

Use o instante da terceira e da sexta fixture.

Execute `Between`.

Confirme limites inclusivos.

Execute `Before` e `After`.

Não compare timestamps com tolerância porque o Clock é fixo.

---

### 18. Testar propriedade aninhada

Execute:

```java
findByCliente_NomeContainingIgnoreCase(
        "beta"
);
```

Confirme quatro Ordens.

Execute:

```java
findByCliente_AtivoTrue();
```

Confirme nove Ordens.

Execute `AtivoFalse`.

Confirme três.

Observe SQL de join.

Não assuma que `cliente` ficou initialized no resultado.

---

### 19. Testar And

Execute:

```java
findByStatusAndCliente_AtivoTrue(
        "ABERTA"
);
```

Confirme somente Ordens ABERTAS de ALFA e BETA.

---

### 20. Testar Or

Execute:

```java
findByStatusOrStatusOrderByCodigoAsc(
        "CONCLUIDA",
        "CANCELADA"
);
```

Confirme cinco resultados e ordem por código.

Documente que `In` seria mais adequado para duas alternativas da mesma propriedade.

---

### 21. Testar First e Top

Execute:

```java
findFirstByStatusOrderByCreatedAtAscIdAsc(
        "ABERTA"
);
```

Confirme a ABERTA mais antiga.

Execute:

```java
findTop3ByStatusOrderByCreatedAtDescIdDesc(
        "ABERTA"
);
```

Confirme no máximo três e ordem descendente.

---

### 22. Testar Sort

Crie:

```java
Sort sort =
        Sort.by(
                Sort.Order.asc(
                        "createdAt"
                ),
                Sort.Order.asc(
                        "id"
                )
        );
```

Passe para:

```java
findDistinctByCliente_AtivoTrue(
        sort
);
```

Em uma borda externa, não aceite nomes livres.

Mapeie opções conhecidas para `Sort`.

---

### 23. Testar Page

Crie:

```java
PageRequest.of(
        0,
        3,
        Sort.by(
                Sort.Order.desc(
                        "createdAt"
                ),
                Sort.Order.desc(
                        "id"
                )
        )
);
```

Execute:

```java
findByStatus(
        "ABERTA",
        pageable
);
```

Confirme:

```text
content size 3;

totalElements 4;

totalPages 2;

hasNext true;

SELECT de conteúdo;

SELECT de count.
```

Teste página 1.

---

### 24. Testar Slice

Use size 3 para Clientes ativos.

Execute:

```java
findByCliente_AtivoTrue(
        pageable
);
```

Confirme:

```text
content;

hasNext;

sem necessidade de totalElements no contrato.
```

Observe o SQL sem exigir uma estratégia interna exata além do comportamento da fatia.

---

### 25. Testar startup invalido

Crie no source set de teste:

```text
broken/BrokenOrderRepository.java.
```

Método:

```java
findByStatuus(
        String status
);
```

Crie configuração isolada que escaneia somente esse repository.

Ao iniciar o contexto, espere falha com uma causa relacionada a propriedade inexistente.

Não compare a mensagem integral.

A configuração principal não deve escanear o package `broken`.

---

### 26. Criar Main.java

O `Main`:

1. inicia contexto;
2. prepara fixtures;
3. executa cenários;
4. imprime relatório;
5. remove fixtures;
6. fecha contexto.

Formato:

```text
método | resultados | primeiro | último | SELECTs | count SELECTs | ordenado
```

Não imprima entidades completas.

---

### 27. Criar BasicDerivedQueriesIT.java

Casos:

- findByCodigo presente;
- findByCodigo ausente;
- exists;
- count;
- igualdade por status;
- Optional sustentado por unique.

---

### 28. Criar TextAndCollectionOperatorsIT.java

Casos:

- Containing;
- IgnoreCase;
- StartingWith;
- EndingWith;
- IsNull;
- IsNotNull;
- In;
- coleção vazia rejeitada pelo serviço de laboratório.

---

### 29. Criar NestedPropertyQueriesIT.java

Casos:

- Cliente.nome;
- Cliente ativo true;
- Cliente ativo false;
- underscore;
- SQL possui join;
- associação continua lazy quando não fetched;
- quantidade correta.

---

### 30. Criar LogicalCompositionIT.java

Casos:

- And;
- Or;
- precedência documentada;
- método complexo não criado;
- comparação entre Or e In.

---

### 31. Criar LimitingAndOrderingIT.java

Casos:

- OrderBy estático;
- ID como desempate;
- First;
- Top3;
- Sort dinâmico controlado;
- repetição em managers distintos produz mesma ordem.

---

### 32. Criar PageAndSliceIT.java

Casos:

- Page 0;
- Page 1;
- total;
- totalPages;
- count query;
- Slice 0;
- hasNext;
- ausência de contrato de total;
- tamanho máximo validado antes da chamada.

---

### 33. Criar InvalidPropertyStartupTest.java

Casos:

- contexto válido inicia;
- contexto quebrado falha;
- causa contém erro de property path;
- método inválido nunca chega à execução;
- contexto quebrado é fechado.

---

### 34. Criar DerivedQueryArchitectureTest.java

Valide:

- repository é interface;
- estende `JpaRepository`;
- métodos próprios não têm corpo;
- zero `@Query`;
- zero `@Modifying`;
- zero native query;
- propriedades usadas existem;
- nomes acima de limite acordado geram alerta;
- `findByCliente_` usa travessia explícita;
- ponte não antecipa aula 347.

---

### 35. Criar TestDataCleaner.java

Ordem:

```sql
DELETE FROM jpa_346.ordem_servico
WHERE codigo LIKE 'OS-JPA-346-%';

DELETE FROM jpa_346.cliente
WHERE codigo LIKE 'CLI-JPA-346-%';
```

Use JDBC de teste.

---

### 36. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_346.
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
zero CLI-JPA-346-%;

zero OS-JPA-346-%;

foreign key;

índices;

auditoria;

versão;

schema history V1.
```

`05_limpar_database.ps1` remove o database.

---

### 37. Executar o laboratorio

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
igualdade;

texto;

nulidade;

In;

intervalo;

nested property;

And;

Or;

OrderBy;

First;

Top;

Page;

Slice;

startup inválido;

zero @Query;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 38. Criar documentacao

`gramatica-query-methods.md` deve registrar subject, `By`, keywords, parâmetros e retorno.

`propriedades-aninhadas.md` deve explicar traversal, underscore, ambiguidade, join e lazy.

`precedencia-and-or.md` deve desenhar árvores lógicas e indicar quando abandonar derivação.

`retornos-page-slice-list.md` deve comparar:

```text
Optional;

List;

Page;

Slice;

Stream.
```

`criterios-abandonar-derivacao.md` deve incluir comprimento, agrupamento, join fetch, projection, agregação e subquery.

`troubleshooting-queries-derivadas.md` deve cobrir:

- propriedade inexistente;
- parâmetro em ordem errada;
- retorno singular com duplicidade;
- nested path;
- IgnoreCase em tipo inválido;
- lista vazia;
- page count;
- Sort inseguro;
- N+1;
- nome excessivo.

---

## Entendendo o que foi feito

### O nome virou contrato executavel

A assinatura descreveu filtro, limite e ordenação.

### O modelo foi validado no startup

Uma propriedade inválida impediu a criação do repository.

### Associacoes puderam ser navegadas

O underscore tornou a travessia explícita.

### Page e Slice tiveram contratos diferentes

Page forneceu total; Slice informou continuidade.

### A derivacao recebeu um limite

Consultas difíceis de ler ficaram reservadas para a aula de `@Query`.

---

## Erros comuns importantes

### Usar nome de coluna

O parser utiliza propriedades Java.

### Criar metodo gigante

A convenção perde valor quando a leitura fica difícil.

### Confiar em Or sem revisar precedencia

`And` possui precedência maior.

### Aceitar Sort externo livre

Mapeie somente propriedades permitidas.

### Achar que nested property faz fetch

O join de filtro não garante associação carregada.

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
    ordem.codigo,
    ordem.status,
    ordem.created_at,
    cliente.nome,
    cliente.ativo
FROM jpa_346.ordem_servico AS ordem
JOIN jpa_346.cliente AS cliente
    ON cliente.id = ordem.cliente_id
WHERE ordem.codigo LIKE 'OS-JPA-346-%'
ORDER BY ordem.codigo;
```

---

## Exercicio guiado

### Parte 1 — Prefixos equivalentes

Crie temporariamente:

```text
readByCodigo;

getByCodigo;

queryByCodigo.
```

Compare resultados e mantenha apenas `find`.

### Parte 2 — Nulidade

Adicione:

```java
findByExternalReferenceIsNullOrderByCodigoAsc();
```

Compare com parâmetro `null`.

### Parte 3 — Agrupamento impossivel

Tente expressar:

```text
(status ABERTA OR AGENDADA)
AND
(cliente ativo OR descrição urgente).
```

Explique por que o nome deve ser abandonado.

### Parte 4 — Top com Pageable

Estude a interação entre limite do subject e `Pageable`.

Documente antes de adotar.

### Parte 5 — Sort seguro

Crie enum externo e mapper para `Sort`.

Rejeite valor desconhecido.

### Parte 6 — Page versus Slice

Meça os SELECTs e escolha o contrato adequado para uma tela sem total.

### Parte 7 — Property path invalido

Troque uma letra de `Cliente_Nome`.

Confirme falha no startup e restaure.

### Parte 8 — ADR

Registre:

```text
derivação para consulta simples;

underscore em nested property;

ID como desempate;

Page somente quando total é necessário;

Slice quando basta hasNext;

Sort mapeado por enum;

@Query quando o nome deixa de ser óbvio.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 346 existe;
- continuidade com a aula 345 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data BOM 2026.0.0 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- Spring Boot não foi usado;
- Hibernate 7.4.4.Final foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_346` foi criado;
- configuração real está fora do Git;
- Cliente e Ordem foram mapeados;
- relação ManyToOne LAZY foi criada;
- auditoria foi preservada;
- versão foi preservada;
- query derivada foi definida;
- subject foi explicado;
- predicate foi explicado;
- `By` foi explicado;
- prefixos de consulta foram explicados;
- propriedade Java foi usada;
- coluna SQL não foi usada no nome;
- propriedade herdada foi consultada;
- igualdade foi praticada;
- `Not` foi explicado;
- `IsNull` foi praticado;
- `IsNotNull` foi praticado;
- `True` foi praticado;
- `False` foi praticado;
- `Containing` foi praticado;
- `StartingWith` foi praticado;
- `EndingWith` foi praticado;
- `IgnoreCase` foi praticado;
- `In` foi praticado;
- coleção vazia foi rejeitada;
- `Between` foi praticado;
- `Before` foi praticado;
- `After` foi praticado;
- comparadores foram explicados;
- propriedade aninhada foi praticada;
- underscore foi usado;
- ambiguidade foi explicada;
- join de filtro foi observado;
- associação não foi tratada como fetched;
- `And` foi praticado;
- `Or` foi praticado;
- precedência foi explicada;
- agrupamento complexo foi rejeitado;
- `OrderBy` foi praticado;
- `Asc` foi praticado;
- `Desc` foi praticado;
- ID foi usado como desempate;
- `Sort` foi praticado;
- entrada livre de Sort foi proibida;
- `Pageable` foi praticado;
- `Page` foi praticado;
- consulta de count foi observada;
- `Slice` foi praticado;
- diferença Page e Slice foi explicada;
- `Optional` foi usado para código unique;
- `List` foi usado para múltiplos;
- Optional de List não foi usado;
- `First` foi praticado;
- `Top3` foi praticado;
- limite teve ordenação;
- `Distinct` foi praticado;
- Stream foi documentado sem adoção;
- método inválido falhou no startup;
- contexto inválido ficou isolado;
- mensagem integral não foi fixada;
- nomes excessivos foram discutidos;
- critérios para abandonar derivação foram definidos;
- N+1 continuou sendo responsabilidade do desenvolvedor;
- índices continuaram necessários;
- SQL foi observado sem bindings;
- testes básicos foram criados;
- testes textuais foram criados;
- testes nested foram criados;
- testes lógicos foram criados;
- testes de limite foram criados;
- testes Page e Slice foram criados;
- teste de startup foi criado;
- teste de arquitetura foi criado;
- fixtures foram removidas;
- estado final ficou vazio;
- zero `@Query`;
- zero native query;
- zero `@Modifying`;
- Specifications não foram antecipadas;
- transações da aula 348 não foram antecipadas;
- ponte para a aula 347 está correta;
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
  labs/m13/aula-346-queries-derivadas
```

Commit recomendado:

```powershell
git commit -m "feat(m13): criar queries derivadas com spring data"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou nomes de métodos em contratos de consulta.

Aprendeu:

```text
subject:
operação, distinct e limite.

By:
início dos critérios.

property:
atributo Java.

nested property:
travessia de associação.

keyword:
operador.

OrderBy:
ordenação estática.

Page:
conteúdo e total.

Slice:
conteúdo e continuidade.

startup:
validação antecipada.
```

O laboratório comprovou:

```text
Optional por código;

igualdade por status;

texto case-insensitive;

prefixo e sufixo;

nulidade;

In;

intervalos;

Cliente.nome;

Cliente.ativo;

And;

Or;

First;

Top3;

Sort;

Page;

Slice;

falha de propriedade inválida.
```

A decisão arquitetural foi:

```text
query derivada:
consulta curta e evidente.

underscore:
travessia explícita.

Page:
quando total importa.

Slice:
quando hasNext basta.

nome longo:
sinal para abandonar derivação.

SQL:
continua sendo observado.
```

A próxima aula será:

```text
347 - M13.37 - Query annotation native query e JPQL
```

Nela, você aprenderá:

- `@Query`;
- JPQL explícita;
- parâmetros nomeados;
- `@Param`;
- consultas com `join`;
- `join fetch`;
- projections;
- count query;
- paginação;
- SpEL com critério;
- native query;
- nomes de tabela e coluna;
- portabilidade;
- `@Modifying`;
- update e delete;
- `clearAutomatically`;
- `flushAutomatically`;
- retorno por quantidade de linhas;
- transação;
- riscos de bulk;
- critérios entre derivada, JPQL e native.

A aula 346 mostrou o limite da convenção por nome.

A aula 347 permitirá declarar a consulta explicitamente quando esse limite for ultrapassado.

---

# Material complementar

## Checkpoint final

- [ ] Criei queries derivadas sem implementação manual.
- [ ] Usei propriedades simples, herdadas e aninhadas.
- [ ] Pratiquei operadores, limites e ordenação.
- [ ] Comparei Optional, List, Page e Slice.
- [ ] Defini quando abandonar a derivação.

---

## Troubleshooting adicional

### No property found

Revise o nome do atributo Java e a travessia.

### Repository nao inicia

Procure query method inválido no startup.

### Resultado singular falhou

A consulta encontrou mais de uma linha.

### Page executou duas queries

Uma busca conteúdo e outra calcula total.

### Cliente gerou SELECT adicional

A query filtrou pela associação, mas não fez fetch.

---

## Perguntas de revisao

1. O que é query derivada?
2. O que separa subject e predicate?
3. O nome usa coluna ou propriedade?
4. O que faz Containing?
5. O que faz IgnoreCase?
6. O que faz In?
7. Between inclui limites?
8. Como navegar para Cliente.nome?
9. Para que serve underscore?
10. And ou Or tem maior precedência?
11. O que faz OrderBy?
12. Por que incluir ID?
13. O que retorna Optional?
14. Quando usar List?
15. O que Page acrescenta?
16. O que Slice evita prometer?
17. O que faz Top3?
18. Quando o método inválido falha?
19. Quando abandonar derivação?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Consulta criada pelo nome do método.
2. O primeiro `By`.
3. Propriedade Java.
4. Busca fragmento.
5. Ignora caixa em texto.
6. Compara com coleção.
7. Sim.
8. `Cliente_Nome`.
9. Explicitar travessia.
10. And.
11. Ordenação estática.
12. Desempate.
13. Zero ou um.
14. Quando existem vários.
15. Total e páginas.
16. Total exato.
17. Limita a três.
18. Na criação do repository.
19. Quando o nome deixa de ser claro.
20. Query annotation native query e JPQL.

---

## Desafio opcional

Crie:

```java
DerivedQueryMethodAnalyzer
```

Entrada:

```text
nome do método;

parâmetros;

retorno;

propriedades conhecidas.
```

Saída:

```text
subject;

predicate;

keywords;

paths;

limite;

ordenação;

alertas;

relatório Markdown.
```

Regras:

- não executar Spring;
- alertar nome longo;
- alertar mistura de And e Or;
- alertar retorno singular sem unique conhecido;
- alertar Sort livre;
- possuir testes unitários;
- recomendar `@Query` quando a leitura ficar ambígua.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 346 - M13.36 - Queries derivadas

- Entendi como Spring Data deriva consultas de nomes.
- Diferenciei subject e predicate.
- Usei o primeiro `By` como separador.
- Mantive nomes baseados em propriedades Java.
- Consultei propriedade herdada de auditoria.
- Pratiquei igualdade e negação.
- Pratiquei `IsNull` e `IsNotNull`.
- Pratiquei `True` e `False`.
- Pratiquei `Containing`.
- Pratiquei `StartingWith`.
- Pratiquei `EndingWith`.
- Pratiquei `IgnoreCase`.
- Pratiquei `In`.
- Rejeitei coleção vazia.
- Pratiquei `Between`, `Before` e `After`.
- Naveguei por `Cliente.nome`.
- Usei underscore para explicitar travessia.
- Entendi ambiguidade de property path.
- Combinei regras com `And`.
- Combinei alternativas com `Or`.
- Entendi a precedência de `And`.
- Usei `OrderBy`, `Asc` e `Desc`.
- Mantive ID como desempate.
- Usei `Sort` controlado.
- Usei `Pageable`.
- Retornei `Page`.
- Retornei `Slice`.
- Diferenciei total exato de hasNext.
- Usei `Optional` em propriedade unique.
- Usei `List` para múltiplos resultados.
- Pratiquei `First`, `Top3` e `Distinct`.
- Demonstrei falha no startup por propriedade inválida.
- Evitei nomes excessivamente longos.
- Defini critérios para abandonar query derivada.
- Mantive auditoria e `@Version`.
- Mantive Flyway no DDL e Hibernate em validate.
- Não usei `@Query`, native query ou `@Modifying`.
- Próxima aula: Query annotation native query e JPQL.
```

---

## Referencia tecnica curta

```text
Find:
subject.

By:
separador.

Property:
atributo Java.

Keyword:
operador.

Nested:
associação.

And:
interseção.

Or:
alternativa.

OrderBy:
ordenação.

Top:
limite.

Page:
total.

Slice:
continuidade.
```

Regra final:

```text
queries derivadas devem ser reservadas para consultas cujo nome permanece curto, inequivoco e alinhado ao modelo Java; propriedades aninhadas, operadores, limites e ordenacao precisam ser validados por testes e SQL observado, enquanto agrupamentos complexos, joins especiais, projections e consultas extensas devem migrar para uma declaracao explicita.
```
