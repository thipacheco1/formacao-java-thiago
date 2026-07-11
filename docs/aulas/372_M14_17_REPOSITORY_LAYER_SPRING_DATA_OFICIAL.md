# 372 - M14.17 - Repository layer Spring Data

## Apresentacao da aula

Na aula 371, você organizou a aplicação em torno de casos de uso e fronteiras transacionais.

O fluxo passou a ser:

```text
controller;

input port;

application service;

repository port;

adapter em memoria.
```

Também foram estabelecidas responsabilidades claras:

```text
controller:
HTTP.

mapper:
transformacao.

application service:
orquestracao e regra dependente de estado.

repository port:
necessidades de persistencia.

adapter:
tecnologia concreta.

transaction boundary:
application service.
```

A aula 371 preparou a aplicação para receber um recurso transacional real.

Até agora, a persistência da feature `managed runtime message` utiliza:

```text
ConcurrentHashMap;

AtomicLong.
```

Esse adapter foi útil para:

- construir o caso de uso;
- validar a arquitetura;
- testar idempotência;
- separar input e output ports;
- preparar `@Transactional`.

Porém, ele não oferece:

- durabilidade;
- integridade relacional;
- constraint única real;
- transação de banco;
- rollback de dados;
- consultas paginadas pelo banco;
- concorrência coordenada pelo SGBD;
- migrations versionadas.

Nesta aula, você substituirá o adapter em memória por uma implementação com:

```text
Spring Data JPA;

Hibernate;

PostgreSQL;

Flyway;

HikariCP;

Testcontainers.
```

A pergunta central será:

```text
como implementar a porta de persistencia
com Spring Data
sem acoplar a aplicacao
ao framework ou ao modelo relacional?
```

A resposta utilizará quatro tipos principais:

```text
ManagedRuntimeMessageJpaEntity;

ManagedRuntimeMessageSpringDataRepository;

ManagedRuntimeMessagePersistenceMapper;

SpringDataManagedRuntimeMessageRepositoryAdapter.
```

A entity representará o modelo relacional.

A interface Spring Data representará o acesso JPA.

O mapper converterá:

```text
domain draft
    -> entity;

entity
    -> domain model.
```

O adapter implementará:

```text
ManagedRuntimeMessageRepositoryPort.
```

O application service continuará dependendo somente do port.

O controller não conhecerá:

- `JpaRepository`;
- `EntityManager`;
- entity JPA;
- query method;
- tabela;
- Flyway;
- DataSource.

A aula adicionará as dependencies:

```text
spring-boot-starter-data-jpa;

spring-boot-starter-flyway;

postgresql;

flyway-database-postgresql;

spring-boot-testcontainers;

testcontainers-postgresql;

testcontainers-junit-jupiter.
```

As versões permanecerão gerenciadas pelo Spring Boot.

A baseline técnica continuará usando:

```text
Spring Boot:
4.1.0.

Spring Data JPA:
4.1.0.

Hibernate:
7.4.4.Final.

Flyway:
12.5.0.

pgJDBC:
42.7.13.

HikariCP:
7.1.0.

Testcontainers:
2.0.5.

PostgreSQL image:
postgres:17.6-alpine.
```

Não adicione versões individuais no `pom.xml`.

O banco será inicializado somente por:

```text
Flyway.
```

Hibernate utilizará:

```text
ddl-auto:
validate.
```

Isso significa:

```text
Flyway cria e evolui o schema;

Hibernate valida se entity e schema combinam.
```

Não use:

- `create`;
- `create-drop`;
- `update`;
- `schema.sql`;
- auto-DDL em testes;
- H2;
- banco diferente de produção.

A aplicação continuará utilizando PostgreSQL também nos testes de repository.

O objetivo é evitar resultados falsamente verdes provocados por diferenças de dialect, tipos, identity, constraint ou SQL.

Os testes utilizarão:

```text
@DataJpaTest;

@AutoConfigureTestDatabase(
    replace = NONE
);

@Testcontainers;

@ServiceConnection;

PostgreSQLContainer.
```

No Spring Boot 4.1, o import da slice é:

```java
org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest
```

O import da configuração de database de teste é:

```java
org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase
```

O container atual será:

```java
org.testcontainers.postgresql.PostgreSQLContainer
```

A aula também introduzirá:

- repository interfaces;
- `JpaRepository`;
- proxy de repository;
- `SimpleJpaRepository`;
- entity scanning;
- repository scanning;
- derived query;
- `Optional`;
- `save`;
- `findById`;
- `existsBy...`;
- `deleteById`;
- `flush`;
- persistence context;
- dirty checking;
- identity generation;
- `@Version`;
- constraint única;
- paginação;
- ordenação;
- `Page`;
- `Pageable`;
- `Sort`;
- tradução de exceptions;
- `DataIntegrityViolationException`;
- transaction manager JPA;
- rollback real;
- teste slice;
- teste de integração completo.

A aula não criará:

- tratamento global de exceptions;
- body de erro definitivo;
- `@ControllerAdvice`;
- Problem Details;
- cache;
- Specifications;
- QueryDSL;
- projections avançadas;
- N+1 complexo;
- relacionamentos entre entities;
- auditing Spring Data;
- soft delete;
- multi-tenancy;
- Redis;
- paginação HTTP pública completa.

A paginação ficará restrita ao repository e ao caso de uso.

A próxima aula será:

```text
373 - M14.18 - Exception Handler global
```

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual é:

```text
368:
mappers manuais.

369:
Bean Validation.

370:
validacoes customizadas.

371:
service layer, use cases e transacoes.

372:
repository layer Spring Data.

373:
Exception Handler global.

374:
Problem Details e padrao de erro.
```

A aula 371 respondeu:

```text
onde termina o caso de uso
e onde fica a transacao?
```

A aula 372 responderá:

```text
como persistir o caso de uso
em PostgreSQL
mantendo as fronteiras?
```

Nesta aula:

```text
Spring Data JPA:
sim.

PostgreSQL:
sim.

Flyway:
sim.

Hibernate validate:
sim.

HikariCP:
sim.

Testcontainers:
sim.

entity separada:
sim.

adapter:
sim.

derived queries:
sim.

pagination:
introducao.

sorting:
sim.

transaction manager real:
sim.

rollback real:
sim.

H2:
nao.

schema.sql:
nao.

Hibernate update:
nao.

global error handler:
nao.
```

A regra central será:

```text
o port pertence a aplicacao;

a entity e o repository Spring Data
pertencem a infraestrutura;

Flyway e dono do schema;

Hibernate valida e persiste.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura principal:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       ├── ManagedRuntimeMessageUseCases.java
│       ├── ManagedRuntimeMessageApplicationService.java
│       ├── command
│       │   └── ManagedRuntimeMessageCreateCommand.java
│       ├── port
│       │   ├── ManagedRuntimeMessageAlreadyExistsException.java
│       │   └── ManagedRuntimeMessageRepositoryPort.java
│       └── result
├── domain
│   └── managedmessage
│       ├── ManagedRuntimeMessage.java
│       └── NewManagedRuntimeMessage.java
└── infrastructure
    └── persistence
        └── jpa
            ├── adapter
            │   └── SpringDataManagedRuntimeMessageRepositoryAdapter.java
            ├── entity
            │   └── ManagedRuntimeMessageJpaEntity.java
            ├── mapper
            │   └── ManagedRuntimeMessagePersistenceMapper.java
            └── repository
                └── ManagedRuntimeMessageSpringDataRepository.java
```

Migration:

```text
src/main/resources/db/migration
└── V1__create_managed_runtime_message.sql
```

Profile:

```text
src/main/resources
└── application-persistence-lab.yaml
```

Testes:

```text
src/test/java/br/com/formacao/backend
├── infrastructure
│   └── persistence
│       └── jpa
│           ├── ManagedRuntimeMessageEntityMappingTest.java
│           ├── ManagedRuntimeMessageSpringDataRepositoryTest.java
│           ├── ManagedRuntimeMessageDerivedQueryTest.java
│           ├── ManagedRuntimeMessagePaginationTest.java
│           ├── ManagedRuntimeMessageUniqueConstraintTest.java
│           ├── ManagedRuntimeMessagePersistenceMapperTest.java
│           └── SpringDataManagedRuntimeMessageRepositoryAdapterTest.java
└── integration
    ├── PostgreSqlContainerBase.java
    ├── FlywaySchemaIntegrationTest.java
    ├── HibernateSchemaValidationIT.java
    ├── JpaTransactionRollbackIT.java
    ├── ManagedRuntimeMessagePersistenceFlowIT.java
    └── RepositoryLayerArchitectureTest.java
```

Documentação:

```text
docs
├── spring-data-jpa-repository-layer.md
├── domain-entity-separation.md
├── jpa-entity-mapping.md
├── spring-data-query-methods.md
├── pagination-and-sorting.md
├── flyway-schema-ownership.md
├── hibernate-validate.md
├── postgres-testcontainers.md
├── persistence-exception-translation.md
├── jpa-transaction-manager.md
└── repository-layer-baseline.md
```

Scripts:

```text
scripts
├── 87_iniciar_postgresql_lab.ps1
├── 88_executar_migrations.ps1
├── 89_executar_testes_repository.ps1
├── 90_testar_constraint_unica.ps1
├── 91_testar_rollback_real.ps1
└── 92_validar_arquitetura_repository.ps1
```

Resultados esperados:

```text
DataSource:
HikariDataSource.

database:
PostgreSQL 17.6.

Flyway:
V1 aplicada.

Hibernate:
validate com sucesso.

repository Spring Data:
proxy ativo.

save:
id gerado pelo banco.

findById:
Optional.

existsByNormalizedValue:
derived query.

unique constraint:
ativa.

duplicate race:
protegida pelo banco.

pagination:
Page funcional.

sorting:
createdAt desc.

application service:
usa port.

adapter em memoria:
nao ativo no profile persistence-lab.

transaction manager:
JpaTransactionManager.

rollback:
dados realmente revertidos.

H2:
ausente.
```

---

## Conceito essencial

### Repository layer

Repository layer encapsula acesso a dados.

Ela oferece uma interface orientada às necessidades da aplicação.

Ela não deve espalhar:

- SQL;
- `EntityManager`;
- JPA entities;
- query names;
- nomes de tabelas;
- detalhes de datasource.

O port já define a necessidade.

A infraestrutura implementa.

---

### Spring Data

Spring Data constrói repositories a partir de interfaces e cria implementações em runtime.

Exemplo:

```java
public interface ManagedRuntimeMessageSpringDataRepository
        extends JpaRepository<
                ManagedRuntimeMessageJpaEntity,
                Long
        > {
}
```

Você não implementa manualmente os métodos básicos.

---

### Spring Data JPA

Spring Data JPA integra o modelo de repositories ao Jakarta Persistence.

Ele não substitui JPA.

Ele usa JPA e o provider configurado.

Na aplicação:

```text
Spring Data JPA:
repository abstraction.

Jakarta Persistence:
API de mapping e EntityManager.

Hibernate:
provider JPA.

PostgreSQL:
database.
```

---

### JpaRepository

`JpaRepository<T, ID>` oferece operações como:

- `save`;
- `findById`;
- `findAll`;
- `deleteById`;
- `existsById`;
- `count`;
- `flush`;
- paginação;
- ordenação.

Não exponha essa interface diretamente ao application service.

O adapter usa o repository Spring Data e implementa o port da aplicação.

---

### Proxy de repository

Spring cria um proxy para a interface.

O proxy combina:

- implementação base;
- query methods;
- interceptors;
- exception translation;
- metadata transacional.

Você não escreve o bean concreto.

---

### SimpleJpaRepository

A implementação base comum é `SimpleJpaRepository`.

Você não deve depender diretamente dela.

Conhecer sua existência ajuda a entender que:

```text
interface Spring Data
nao e uma implementacao vazia.
```

---

### Entity

Entity JPA representa estado persistente.

Ela possui:

- identidade;
- lifecycle JPA;
- mapping;
- version;
- colunas;
- construtor para o provider.

Ela não é response DTO.

Ela não é request DTO.

Ela não precisa ser o mesmo tipo do domínio.

---

### Separacao domain e entity

O domínio atual publica:

```text
ManagedRuntimeMessage.
```

A persistência utilizará:

```text
ManagedRuntimeMessageJpaEntity.
```

A separação permite mudar tabela sem mudar API, adicionar campos técnicos, manter o domínio sem JPA e trocar a tecnologia de persistência.

---

### NewManagedRuntimeMessage

O banco gerará o id.

Por isso, o application service não deve gerar identity com `AtomicLong`.

Crie:

```java
public record NewManagedRuntimeMessage(
        String value,
        String normalizedValue,
        Instant createdAt
) {
}
```

O port recebe esse draft.

O adapter salva e retorna o modelo persistido com id e version.

---

### Repository port revisado

O port será:

```java
public interface ManagedRuntimeMessageRepositoryPort {

    ManagedRuntimeMessage save(
            NewManagedRuntimeMessage message
    );

    Optional<ManagedRuntimeMessage> findById(
            long id
    );

    boolean existsByNormalizedValue(
            String normalizedValue
    );

    boolean deleteById(
            long id
    );
}
```

`nextId()` é removido.

A geração passa a ser responsabilidade da persistência.

---

### @Entity e @Table

A classe JPA utiliza:

```java
@Entity
@Table(
        name = "managed_runtime_message"
)
```

O nome explícito reduz dependência de naming strategy.

A constraint única também existe no migration.

Annotation não substitui migration.

---

### @Id e @GeneratedValue

O id será:

```java
@Id
@GeneratedValue(
        strategy = GenerationType.IDENTITY
)
private Long id;
```

O PostgreSQL gerará o valor.

A entity usa `Long` porque um objeto novo ainda não possui id.

O domínio persistido continua usando `long`.

---

### Identity generation

Com identity, o insert precisa ocorrer para obter o id.

O provider pode precisar executar SQL antes do final do método.

Não conclua que `save()` sempre executa todo SQL imediatamente em qualquer estratégia.

O comportamento depende do mapping e do flush.

---

### @Column

Use nomes explícitos:

```java
@Column(
        name = "normalized_value",
        nullable = false,
        length = 120
)
```

A annotation descreve o mapping.

O schema real continua sob Flyway.

---

### Instant e timestamptz

O campo:

```text
createdAt
```

será `Instant`.

No PostgreSQL:

```text
timestamp with time zone.
```

Use:

```text
timestamptz.
```

O valor representa um instante global.

Não use `LocalDateTime` para esconder timezone quando o conceito é instantâneo.

---

### @Version

Adicione:

```java
@Version
private long version;
```

Hibernate usa esse campo para optimistic locking em updates e deletes aplicáveis.

Nesta aula, não haverá endpoint de update.

Ainda assim, a versão já faz parte do recurso.

O schema possui coluna `version`.

---

### Construtor protegido

JPA precisa de construtor sem argumentos.

Use:

```java
protected ManagedRuntimeMessageJpaEntity() {
}
```

Não torne público apenas para o provider.

Crie construtor de package ou factory para novas entities.

---

### Equality de entity

Não baseie `equals` em todos os campos mutáveis.

Nesta aula, evite criar equality complexa.

Os testes compararão ids e campos explicitamente.

O tema será aprofundado em módulo de JPA avançado.

---

### Persistence mapper

`ManagedRuntimeMessagePersistenceMapper` converte:

```text
NewManagedRuntimeMessage
    -> entity nova;

entity
    -> ManagedRuntimeMessage.
```

Ele pertence à infraestrutura.

Ele não é o web mapper.

Não cria status HTTP.

---

### Derived query

A interface declarará:

```java
boolean existsByNormalizedValue(
        String normalizedValue
);
```

Spring Data deriva a query do nome.

Partes:

```text
exists:
projecao booleana.

By:
inicio do predicado.

NormalizedValue:
property da entity.
```

O nome usa property Java, não nome da coluna SQL.

---

### Optional

`findById` retorna:

```java
Optional<ManagedRuntimeMessageJpaEntity>.
```

O adapter mapeia:

```java
.map(
    mapper::toDomain
)
```

Não use `Optional.get()` sem verificar.

Não armazene Optional em field.

---

### save

Para entity nova, `save` executa persist.

Para entity considerada existente, pode usar merge.

A detecção de novo considera identidade e estratégias Spring Data.

Como o id começa null, a entity da aula é nova.

---

### flush

Flush sincroniza mudanças do persistence context com o banco.

Ele não é commit.

Pode ocorrer:

- antes de query;
- no commit;
- explicitamente;
- conforme flush mode.

Para testar constraint única no ponto desejado, use:

```text
saveAndFlush.
```

Não espalhe flush em produção sem necessidade.

---

### Persistence context

O persistence context acompanha entities gerenciadas.

Benefícios:

- identidade por contexto;
- dirty checking;
- write-behind;
- cache de primeiro nível.

A entity não precisa ser salva novamente após cada setter quando gerenciada.

Nesta aula, a feature não terá update.

---

### Flyway

Flyway versiona o schema por migrations.

Arquivo:

```text
V1__create_managed_runtime_message.sql.
```

O nome possui:

```text
V1:
versao.

__:
separador.

create_managed_runtime_message:
descricao.
```

Migration aplicada não deve ser editada em ambientes compartilhados.

Crie uma nova versão para mudanças futuras.

---

### Flyway history

Flyway cria a tabela:

```text
flyway_schema_history.
```

Ela registra:

- versão;
- descrição;
- script;
- checksum;
- data;
- sucesso.

Não altere seus dados manualmente.

---

### PostgreSQL module do Flyway

O suporte PostgreSQL do Flyway é um módulo separado.

Por isso, adicione:

```text
org.flywaydb:flyway-database-postgresql.
```

O driver continua:

```text
org.postgresql:postgresql.
```

São responsabilidades distintas.

---

### Hibernate validate

Configure:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: "validate"
```

Na inicialização, Hibernate compara mappings e schema.

Se faltar tabela ou coluna, o contexto falha.

Isso é desejável.

A aplicação não deve iniciar com mapping incompatível.

---

### Open EntityManager in View

Configure:

```yaml
spring:
  jpa:
    open-in-view: false
```

A camada web não deve carregar dados lazy depois do service.

Esta feature não possui relacionamentos, mas a regra arquitetural começa agora.

---

### HikariCP

O starter JPA traz suporte JDBC e HikariCP.

O DataSource esperado é:

```text
HikariDataSource.
```

Configure limites modestos no laboratório.

Não aumente pool sem medir concorrência e capacidade do banco.

---

### Constraint unica

O schema terá:

```sql
constraint uk_managed_runtime_message_normalized_value
    unique (normalized_value)
```

O precheck:

```text
existsByNormalizedValue
```

melhora o fluxo comum.

Mas não elimina corrida:

```text
request A consulta:
nao existe.

request B consulta:
nao existe.

A insere.

B tenta inserir.
```

A constraint do banco é a proteção final.

---

### Exception translation

Spring traduz exceptions de persistência para a hierarquia:

```text
DataAccessException.
```

Violação de integridade pode aparecer como:

```text
DataIntegrityViolationException.
```

O adapter captura somente o caso necessário e traduz para uma exception da porta:

```text
ManagedRuntimeMessageAlreadyExistsException.
```

Não vaze exception Spring para o application service.

---

### Transaction manager real

Com JPA e DataSource, Spring Boot configura um transaction manager JPA.

Agora:

```text
@Transactional
```

envolve um recurso real.

Rollback de RuntimeException reverte mudanças ainda não confirmadas no banco.

Essa é a diferença em relação ao recording manager da aula 371.

---

### Pagination

Spring Data reconhece:

```text
Pageable;

Page;

Sort.
```

O repository pode utilizar:

```java
Page<ManagedRuntimeMessageJpaEntity>
        findAllBy(
                Pageable pageable
        );
```

Ou `findAll(pageable)` herdado.

A aula usará paginação no adapter e em testes.

Não publicará ainda uma resposta HTTP paginada completa.

---

### Sort

Use:

```java
PageRequest.of(
        page,
        size,
        Sort.by(
                Sort.Direction.DESC,
                "createdAt"
        )
);
```

A propriedade usa nome Java da entity.

Evite receber nomes arbitrários do cliente e repassá-los sem whitelist.

---

### Page

`Page<T>` contém:

- conteúdo;
- página atual;
- tamanho;
- total de elementos;
- total de páginas;
- informação de primeira e última.

O adapter converte o conteúdo.

O port pode retornar uma abstração própria quando a paginação virar caso de uso público.

Nesta aula, `Page` fica na infraestrutura e nos testes.

---

### @DataJpaTest

`@DataJpaTest` carrega uma slice focada em:

- entities;
- JPA repositories;
- infraestrutura JPA relevante.

Por padrão, os testes são transacionais e sofrem rollback ao final.

A annotation não deve carregar controllers e toda a aplicação.

---

### Database de teste real

`@DataJpaTest` pode substituir DataSource por banco embedded.

Como o curso não usa H2, configure:

```java
@AutoConfigureTestDatabase(
        replace =
                AutoConfigureTestDatabase.Replace.NONE
)
```

O Testcontainer fornece PostgreSQL.

---

### @ServiceConnection

`@ServiceConnection` permite que o Boot obtenha dados de conexão do container.

Para um PostgreSQLContainer, o Boot pode criar connection details JDBC e Flyway.

Isso substitui propriedades de conexão no teste.

Não use `@DynamicPropertySource` quando a service connection resolve o caso de forma mais clara.

---

### Testcontainers

Container base:

```java
@Testcontainers
abstract class PostgreSqlContainerBase {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer postgres =
            new PostgreSQLContainer(
                    "postgres:17.6-alpine"
            );
}
```

Use campo static para compartilhar o container dentro da classe de teste.

Docker precisa estar disponível.

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

### 2. Atualizar dependencies

Adicione sem versões:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-flyway</artifactId>
</dependency>

<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-testcontainers</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers-postgresql</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers-junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

Mantenha `spring-tx`; ele pode tornar-se transitivo, mas a aula anterior o declarou intencionalmente.

---

### 3. Inspecionar dependency tree

```powershell
.\mvnw.cmd dependency:tree
```

Confirme:

- Spring Data JPA;
- Hibernate;
- HikariCP;
- pgJDBC;
- Flyway;
- PostgreSQL Flyway module;
- Testcontainers 2.0.5.

Falhe se aparecer H2.

---

### 4. Criar NewManagedRuntimeMessage

No domínio:

```java
public record NewManagedRuntimeMessage(
        String value,
        String normalizedValue,
        Instant createdAt
) {

    public NewManagedRuntimeMessage {
        Objects.requireNonNull(value);
        Objects.requireNonNull(normalizedValue);
        Objects.requireNonNull(createdAt);
    }
}
```

Não adicione JPA.

---

### 5. Revisar repository port

Remova:

```text
nextId.
```

Mude `save` para receber o draft e retornar o modelo persistido.

O application service deixa de gerar id.

---

### 6. Evoluir application service

Fluxo de create:

1. normalizar;
2. precheck de duplicidade;
3. criar draft com Clock;
4. chamar port save;
5. retornar CREATED;
6. capturar exception de duplicidade do port;
7. retornar DUPLICATE.

A regra permanece independente de Spring Data.

---

### 7. Criar migration V1

```sql
create table managed_runtime_message (
    id bigint generated by default as identity,
    value varchar(120) not null,
    normalized_value varchar(120) not null,
    created_at timestamptz not null,
    version bigint not null default 0,

    constraint pk_managed_runtime_message
        primary key (id),

    constraint uk_managed_runtime_message_normalized_value
        unique (normalized_value),

    constraint ck_managed_runtime_message_value_length
        check (
            char_length(value)
            between 3 and 120
        )
);

create index ix_managed_runtime_message_created_at
    on managed_runtime_message (
        created_at desc
    );
```

Flyway será o único responsável por aplicar.

---

### 8. Criar JpaEntity

Campos:

```text
Long id;

String value;

String normalizedValue;

Instant createdAt;

long version.
```

Annotations:

```text
@Entity;

@Table;

@Id;

@GeneratedValue(IDENTITY);

@Column;

@Version.
```

Crie construtor protegido vazio.

Crie factory package-private para entity nova.

---

### 9. Criar repository Spring Data

```java
public interface ManagedRuntimeMessageSpringDataRepository
        extends JpaRepository<
                ManagedRuntimeMessageJpaEntity,
                Long
        > {

    boolean existsByNormalizedValue(
            String normalizedValue
    );
}
```

Não anote a interface com `@Repository`.

Spring Data registra o bean.

---

### 10. Criar persistence mapper

Métodos:

```text
toNewEntity(NewManagedRuntimeMessage);

toDomain(ManagedRuntimeMessageJpaEntity).
```

Use mapping explícito.

Não use BeanUtils ou ObjectMapper.

---

### 11. Criar exception da porta

```java
public class ManagedRuntimeMessageAlreadyExistsException
        extends RuntimeException {
}
```

Ela representa conflito de persistência reconhecido pela aplicação.

Não inclua `DataIntegrityViolationException` no construtor público.

---

### 12. Criar adapter Spring Data

Use:

```java
@Repository
@Primary
public class SpringDataManagedRuntimeMessageRepositoryAdapter
        implements ManagedRuntimeMessageRepositoryPort {
}
```

Injete repository e mapper.

O `@Primary` garante escolha quando o adapter em memória permanecer disponível.

Alternativamente, restrinja o adapter em memória a profile `memory`.

Documente a decisão.

---

### 13. Implementar save

Fluxo:

1. mapear draft para entity;
2. executar `saveAndFlush`;
3. mapear entity salva;
4. capturar `DataIntegrityViolationException`;
5. lançar exception da porta.

Use `saveAndFlush` para detectar a constraint no escopo do adapter.

Não capture `Exception`.

---

### 14. Implementar find

Use:

```java
return repository
        .findById(id)
        .map(
                mapper::toDomain
        );
```

---

### 15. Implementar exists

Delegue:

```text
existsByNormalizedValue.
```

Não reimplemente busca completa.

---

### 16. Implementar delete

Não chame `deleteById` cegamente quando o contrato precisa retornar boolean.

Fluxo possível:

1. localizar;
2. se ausente, false;
3. deletar entity;
4. flush quando necessário;
5. true.

Mantenha o comportamento anterior.

---

### 17. Configurar profile persistence-lab

```yaml
spring:
  datasource:
    url: "${DB_URL:jdbc:postgresql://localhost:5432/formacao_java}"
    username: "${DB_USERNAME:formacao}"
    password: "${DB_PASSWORD:formacao}"
    hikari:
      maximum-pool-size: 5
      minimum-idle: 1
      connection-timeout: 3000

  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: "validate"
    properties:
      hibernate:
        format_sql: true

  flyway:
    enabled: true
    locations:
      - "classpath:db/migration"
```

Não configure dialect manualmente sem necessidade.

---

### 18. Criar container base

Use imports atuais:

```java
import org.testcontainers.postgresql.PostgreSQLContainer;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
```

Imagem:

```text
postgres:17.6-alpine.
```

---

### 19. Criar repository slice test

Use:

```java
@DataJpaTest
@AutoConfigureTestDatabase(
        replace =
                AutoConfigureTestDatabase.Replace.NONE
)
@Testcontainers
```

Estenda a base do container ou declare o campo na classe.

---

### 20. Testar save

Crie entity nova.

Execute:

```text
saveAndFlush.
```

Confirme:

- id não nulo;
- version inicial;
- data preservada;
- texto preservado;
- normalized value preservado.

---

### 21. Testar findById

Persistir, limpar o persistence context e buscar.

Use `TestEntityManager` ou `EntityManager`.

A limpeza evita validar apenas cache de primeiro nível.

---

### 22. Testar derived query

Persistir valores diferentes.

Validar:

```text
existsByNormalizedValue:
true para existente;
false para ausente.
```

Confirme case normalizada conforme regra da aplicação.

---

### 23. Testar unique constraint

Insira duas entities com mesmo normalized value.

Na segunda:

```text
saveAndFlush.
```

Espere exception de integridade.

Confirme nome da constraint somente se o provider expuser de forma estável.

Não faça assertion frágil de mensagem completa.

---

### 24. Testar adapter

Importe:

- adapter;
- mapper;
- repository Spring Data.

Valide o contrato do port:

- save draft;
- find;
- exists;
- delete;
- Optional;
- mapping;
- exception traduzida.

---

### 25. Testar paginação

Insira pelo menos cinco rows.

Crie:

```java
PageRequest.of(
        0,
        2,
        Sort.by(
                DESC,
                "createdAt"
        )
);
```

Valide:

- dois itens;
- total cinco;
- três páginas;
- ordem decrescente.

---

### 26. Testar Flyway

Em teste completo, injete:

```text
Flyway.
```

Confirme:

- migration aplicada;
- versão 1;
- tabela history;
- tabela de negócio;
- checksum válido.

Não execute DDL manual antes.

---

### 27. Testar Hibernate validate

Inicie contexto com migration habilitada e `ddl-auto=validate`.

Confirme sucesso.

Depois, em fixture isolada, desative migration ou altere mapping temporário e confirme falha.

Não mantenha a fixture quebrada em produção.

---

### 28. Testar transaction manager real

Injete:

```text
PlatformTransactionManager.
```

Confirme implementação JPA compatível.

Não fixe nome concreto se proxy ou decorator variar.

Confirme que não é o recording manager.

---

### 29. Testar rollback real

Crie bean de fixture transacional.

Dentro do método:

1. salvar entity;
2. flush;
3. lançar RuntimeException.

Depois da exception, use outra transação para contar rows.

Resultado:

```text
zero rows persistidas.
```

Agora existe prova de rollback de dados.

---

### 30. Testar fluxo completo

Use `@SpringBootTest` com container.

Execute:

1. application service create;
2. repository real;
3. commit;
4. find;
5. duplicate;
6. delete;
7. find vazio.

Valide outcomes e estado do PostgreSQL.

---

### 31. Testar HTTP sem mudar contrato

Com servidor real:

- POST retorna 201;
- GET retorna 200;
- duplicate retorna 409;
- DELETE retorna 204;
- GET após delete retorna 404.

O storage mudou.

O contrato HTTP não.

---

### 32. Criar teste arquitetural

Valide:

- application port sem Spring Data;
- application service sem entity JPA;
- domain sem Jakarta Persistence;
- entity somente em infrastructure;
- repository Spring Data somente em infrastructure;
- adapter implementa port;
- mapper persistence explícito;
- controller sem repository Spring Data;
- web sem entity;
- migration presente;
- `ddl-auto=validate`;
- open-in-view false;
- zero H2;
- zero schema.sql;
- zero create-drop;
- zero update.

---

### 33. Iniciar PostgreSQL local

```powershell
docker run `
  --name formacao-java-postgres `
  --rm `
  -e POSTGRES_DB=formacao_java `
  -e POSTGRES_USER=formacao `
  -e POSTGRES_PASSWORD=formacao `
  -p 5432:5432 `
  postgres:17.6-alpine
```

Não versionar credenciais reais.

Esses valores são somente do laboratório local.

---

### 34. Executar aplicacao

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,persistence-lab"
```

Confirme:

- Hikari inicia;
- Flyway aplica V1;
- Hibernate valida;
- Tomcat inicia.

---

### 35. Inspecionar banco

Com `psql` ou cliente:

```sql
select *
from flyway_schema_history
order by installed_rank;

select *
from managed_runtime_message
order by id;
```

Não altere a tabela history.

---

### 36. Criar documentacao

Em `spring-data-jpa-repository-layer.md`, explique as camadas.

Em `domain-entity-separation.md`, compare domínio e entity.

Em `jpa-entity-mapping.md`, registre cada annotation.

Em `spring-data-query-methods.md`, documente derived queries.

Em `pagination-and-sorting.md`, explique `Page`, `Pageable` e `Sort`.

Em `flyway-schema-ownership.md`, registre Flyway como dono.

Em `hibernate-validate.md`, explique failure fast.

Em `postgres-testcontainers.md`, documente service connection e Docker.

Em `persistence-exception-translation.md`, documente a tradução.

Em `jpa-transaction-manager.md`, compare com a aula 371.

Em `repository-layer-baseline.md`, consolide a arquitetura.

---

### 37. Criar scripts

`87_iniciar_postgresql_lab.ps1` inicia o container local.

`88_executar_migrations.ps1` inicia a aplicação e valida history.

`89_executar_testes_repository.ps1` executa slice tests.

`90_testar_constraint_unica.ps1` executa o cenário duplicado.

`91_testar_rollback_real.ps1` executa rollback.

`92_validar_arquitetura_repository.ps1` executa proteção arquitetural.

---

### 38. Executar testes de repository

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSpringDataRepositoryTest,ManagedRuntimeMessageDerivedQueryTest,ManagedRuntimeMessagePaginationTest test
```

---

### 39. Executar constraint e adapter

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageUniqueConstraintTest,SpringDataManagedRuntimeMessageRepositoryAdapterTest test
```

---

### 40. Executar migrations e schema

```powershell
.\mvnw.cmd `
  -Dtest=FlywaySchemaIntegrationTest,HibernateSchemaValidationIT test
```

---

### 41. Executar rollback real

```powershell
.\mvnw.cmd `
  -Dtest=JpaTransactionRollbackIT test
```

Confirme banco vazio depois da exception.

---

### 42. Executar fluxo completo

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePersistenceFlowIT test
```

---

### 43. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Docker precisa estar ativo.

Todos os testes anteriores devem permanecer verdes.

---

### 44. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 45. Revisar escopo

Confirme:

```text
Spring Data:
presente.

PostgreSQL:
presente.

Flyway:
presente.

Hibernate validate:
presente.

H2:
zero.

schema.sql:
zero.

ddl create:
zero.

ddl update:
zero.

entity na web:
zero.

JpaRepository na application:
zero.

ControllerAdvice:
zero.
```

---

### 46. Revisar Git

```powershell
git status
git diff
git diff --check
```

Não inclua:

- target;
- volume de banco;
- dump;
- senha real;
- logs SQL extensos;
- container id;
- migration temporária;
- script com segredo;
- H2;
- schema gerado pelo Hibernate.

---

## Entendendo o que foi feito

### O port ganhou uma implementacao real

O application service continua igual em intenção, mas agora usa PostgreSQL.

### O dominio permaneceu limpo

Annotations JPA ficaram na entity de infraestrutura.

### Flyway assumiu o schema

Migrations criam; Hibernate valida.

### A duplicidade ganhou protecao concorrente

O precheck continua, mas a constraint única é a garantia final.

### A transacao passou a controlar dados reais

Rollback deixou de ser apenas evento registrado e passou a reverter rows.

---

## Erros comuns importantes

### Expor JpaRepository ao controller

A web passa a decidir persistência e ignora o caso de uso.

### Usar update de Hibernate

O schema muda sem migration auditável.

### Testar com H2

Diferenças de SQL e tipos podem esconder problemas de PostgreSQL.

### Confiar somente no exists

Duas requests concorrentes ainda podem tentar inserir.

### Retornar entity no JSON

Contrato web e modelo relacional ficam acoplados.

---

## Comandos uteis

### PostgreSQL local

```powershell
docker run `
  --name formacao-java-postgres `
  --rm `
  -e POSTGRES_DB=formacao_java `
  -e POSTGRES_USER=formacao `
  -e POSTGRES_PASSWORD=formacao `
  -p 5432:5432 `
  postgres:17.6-alpine
```

### Testes repository

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessageSpringDataRepositoryTest test
```

### Rollback

```powershell
.\mvnw.cmd `
  -Dtest=JpaTransactionRollbackIT test
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Derived query adicional

Crie temporariamente:

```text
findByValueContainingIgnoreCase.
```

Teste e remova antes do commit.

### Parte 2 — Sort whitelist

Crie fixture que aceita somente:

```text
createdAt;

id.
```

Rejeite nome arbitrário de property.

### Parte 3 — Migration V2

Crie temporariamente coluna `updated_at`.

Valide migration e Hibernate.

Remova a fixture ou mantenha somente se fizer parte do contrato final.

### Parte 4 — Constraint concorrente

Execute duas criações paralelas com mesmo normalized value.

Confirme um único row.

Não dependa da ordem dos outcomes.

### Parte 5 — Flush

Compare `save` e `saveAndFlush` no teste de constraint.

Explique quando a exception aparece.

### Parte 6 — Entity leakage

Retorne entity em controller de fixture.

Faça o teste arquitetural rejeitar.

### Parte 7 — Rollback checked

Use banco real e checked exception com e sem `rollbackFor`.

Compare com o recording manager.

### Parte 8 — ADR

Registre:

```text
PostgreSQL em producao e testes;

Flyway dono do DDL;

Hibernate validate;

open-in-view false;

domain separado de entity;

port separado de JpaRepository;

constraint unica como garantia final;

Testcontainers com ServiceConnection;

sem H2.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 371 foi preservada;
- o mesmo projeto foi continuado;
- Spring Data JPA foi definido;
- `spring-boot-starter-data-jpa` foi adicionado sem versão;
- Flyway foi adicionado sem versão;
- módulo PostgreSQL do Flyway foi adicionado;
- driver PostgreSQL foi adicionado;
- Testcontainers modules foram adicionados;
- H2 não foi adicionado;
- dependency tree foi inspecionada;
- `NewManagedRuntimeMessage` foi criado;
- id deixou de ser gerado pela application service;
- `nextId` foi removido do port;
- port continua sem Spring Data;
- domain continua sem JPA;
- `ManagedRuntimeMessageJpaEntity` foi criada;
- entity possui `@Entity` e `@Table`;
- id usa identity do PostgreSQL;
- colunas possuem nomes explícitos;
- `Instant` foi mapeado para timestamptz;
- `@Version` foi usado;
- construtor protegido foi criado;
- entity não foi usada como request ou response;
- repository Spring Data estende `JpaRepository`;
- derived query `existsByNormalizedValue` foi criada;
- repository não recebeu implementação manual;
- persistence mapper foi criado;
- mapping é explícito;
- BeanUtils e ObjectMapper não foram usados;
- adapter Spring Data implementa o port;
- application service não depende do adapter;
- controller não depende de repository;
- `saveAndFlush` foi usado conscientemente;
- `Optional` foi preservado;
- delete mantém contrato boolean;
- exception Spring foi traduzida;
- `DataIntegrityViolationException` não vazou para application;
- Flyway migration V1 foi criada;
- migration cria tabela, PK, identity, unique, check e index;
- migration aplicada não foi editada depois da baseline;
- `flyway_schema_history` foi validada;
- Flyway é dono do DDL;
- Hibernate usa `ddl-auto=validate`;
- create, update e create-drop não foram usados;
- `schema.sql` não foi criado;
- `open-in-view=false` foi configurado;
- HikariCP foi confirmado;
- pool recebeu limites modestos;
- dialect não foi fixado sem necessidade;
- constraint única protege corrida;
- precheck não foi tratado como garantia final;
- paginação foi testada;
- ordenação decrescente foi testada;
- `Page`, `Pageable` e `Sort` foram explicados;
- nomes de sort arbitrários não foram expostos;
- `@DataJpaTest` usa package do Boot 4.1;
- `@AutoConfigureTestDatabase` usa package atual;
- replace NONE foi configurado;
- PostgreSQLContainer usa package Testcontainers 2;
- imagem `postgres:17.6-alpine` foi usada;
- `@ServiceConnection` foi usada;
- `@DynamicPropertySource` não foi usado sem necessidade;
- tests slice usam PostgreSQL real;
- save gerou id;
- find limpou persistence context;
- derived query foi validada;
- constraint única foi validada;
- adapter foi testado pelo port;
- Flyway foi testado;
- Hibernate validate foi testado;
- transaction manager JPA foi confirmado;
- rollback real foi provado por contagem posterior;
- fluxo application service até PostgreSQL foi testado;
- contratos HTTP anteriores foram preservados;
- status 201, 200, 409, 204 e 404 permaneceram;
- teste arquitetural foi criado;
- application não importa JPA;
- web não importa entity;
- infrastructure concentra JPA;
- documentação completa foi criada;
- scripts foram criados;
- testes de repository, constraint, migration, rollback, fluxo e suite passaram;
- package passou;
- nenhum ControllerAdvice, ProblemDetail, cache, Specification, QueryDSL, relationship, auditing ou soft delete foi antecipado;
- ponte para a aula 373 está correta;
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
git commit -m "feat(m14): implementar repository layer com spring data"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- dump de banco;
- volume;
- senha real;
- logs SQL;
- container id;
- migration temporária;
- H2.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a aplicação passou a persistir dados em PostgreSQL real.

O fluxo consolidado ficou:

```text
controller;

input port;

application service;

repository port;

Spring Data adapter;

JpaRepository;

Hibernate;

PostgreSQL.
```

A governança do schema ficou:

```text
Flyway:
cria e evolui.

Hibernate:
valida.

Spring Data:
acessa.

application service:
orquestra.

transaction manager:
garante a unidade de trabalho.
```

Você comprovou:

```text
entity separada;

domain limpo;

id gerado pelo banco;

derived query;

Optional;

save;

delete;

pagination;

sorting;

constraint unica;

exception translation;

migration;

schema validation;

Testcontainers;

rollback real.
```

A decisão central foi:

```text
Spring Data deve implementar
a porta de persistencia
sem atravessar para controller,
DTO ou application service.
```

A próxima aula será:

```text
373 - M14.18 - Exception Handler global
```

Nela, você continuará no mesmo projeto e estudará:

- `@ControllerAdvice`;
- `@RestControllerAdvice`;
- `@ExceptionHandler`;
- exceptions de binding;
- exceptions de validation;
- exceptions de aplicação;
- exceptions de persistência;
- prioridade de handlers;
- escopo global;
- status;
- headers;
- body provisório;
- logging;
- correlação conceitual;
- não exposição de stack trace;
- testes MockMvc;
- testes com servidor real;
- separação entre exception e representação.

A aula 372 respondeu:

```text
como implementar o port
com Spring Data e PostgreSQL?
```

A aula 373 responderá:

```text
como transformar exceptions
em respostas HTTP consistentes
em um ponto global?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei separar domain model de JPA entity.
- [ ] Sei implementar um port com adapter Spring Data.
- [ ] Sei usar Flyway como dono do schema.
- [ ] Sei testar PostgreSQL com Testcontainers sem H2.
- [ ] Sei provar rollback real e constraint única.

---

## Troubleshooting adicional

### Contexto falha em validate

Revise migration, nomes de colunas, tipos e profile ativo.

### Flyway nao reconhece PostgreSQL

Confirme `flyway-database-postgresql`.

### DataJpaTest tenta banco embedded

Confirme `replace = NONE` e ausência de H2.

### ServiceConnection nao funciona

Confirme `spring-boot-testcontainers`, annotation e container tipado.

### Duplicidade passa no precheck

A corrida é protegida pela unique constraint; revise tradução da exception.

### Entity aparece no JSON

Revise controller, web mapper e teste arquitetural.

---

## Perguntas de revisao

1. O que Spring Data JPA adiciona?
2. O que `JpaRepository` oferece?
3. Por que o application service não depende dele?
4. Qual diferença entre domain e entity?
5. Quem gera o id?
6. Para que serve `@Version`?
7. O que é derived query?
8. Qual property o nome do método utiliza?
9. O que `saveAndFlush` ajuda a observar?
10. Flyway ou Hibernate cria o schema?
11. O que significa `ddl-auto=validate`?
12. Por que `open-in-view=false`?
13. Para que serve a unique constraint?
14. `existsBy` elimina corrida?
15. O que é exception translation?
16. Por que não usar H2?
17. O que faz `@DataJpaTest`?
18. O que faz `@ServiceConnection`?
19. O rollback agora é real?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Repositories e queries sobre JPA.
2. CRUD, paginação, sorting e flush.
3. Para preservar o port.
4. Regra interna versus mapping relacional.
5. PostgreSQL.
6. Optimistic locking.
7. Query derivada do nome.
8. Property Java da entity.
9. SQL e constraint no ponto do teste.
10. Flyway.
11. Validar mapping contra schema.
12. Evitar lazy loading na web.
13. Garantir integridade concorrente.
14. Não.
15. Converter exceptions de tecnologia.
16. Evitar diferenças do PostgreSQL.
17. Carregar slice JPA.
18. Fornecer connection details do container.
19. Sim, sobre o banco.
20. Exception Handler global.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 372 - M14.17 - Repository layer Spring Data

- Continuei no projeto `formacao-java-backend-api`.
- Adicionei Spring Data JPA.
- Adicionei PostgreSQL, Flyway e Testcontainers.
- Mantive versões gerenciadas pelo Spring Boot.
- Não adicionei H2.
- Criei `NewManagedRuntimeMessage`.
- Removi a geração de id da application service.
- Mantive o repository port independente de Spring Data.
- Criei uma JPA entity separada do domínio.
- Mapeei id identity, colunas, Instant e version.
- Criei repository Spring Data com `JpaRepository`.
- Criei derived query para normalized value.
- Criei persistence mapper explícito.
- Criei adapter Spring Data implementando o port.
- Mantive controller e application service sem JPA.
- Traduzi `DataIntegrityViolationException`.
- Criei migration V1 com Flyway.
- Defini PK, unique constraint, check e index.
- Mantive Flyway como dono do DDL.
- Configurei Hibernate com `ddl-auto=validate`.
- Desativei Open EntityManager in View.
- Confirmei HikariCP.
- Testei `save`, `findById`, `exists` e `delete`.
- Testei paginação e ordenação.
- Entendi persistence context e flush.
- Testei unique constraint real.
- Entendi por que `existsBy` não elimina corrida.
- Usei `@DataJpaTest` do Boot 4.1.
- Evitei substituição por banco embedded.
- Usei PostgreSQLContainer do Testcontainers 2.
- Usei `@ServiceConnection`.
- Usei a imagem `postgres:17.6-alpine`.
- Testei Flyway e Hibernate validate.
- Confirmei transaction manager JPA.
- Provei rollback real no PostgreSQL.
- Preservei contratos HTTP anteriores.
- Não criei Exception Handler global.
- Próxima aula: Exception Handler global.
```

---

## Referencia tecnica curta

```text
Port:
contrato da aplicacao.

Adapter:
implementacao.

JpaRepository:
repository framework.

Entity:
modelo relacional.

Flyway:
schema.

Hibernate:
provider e validate.

PostgreSQL:
recurso real.

Testcontainers:
teste real.

Unique:
integridade.

Transaction:
atomicidade.
```

Regra final:

```text
a repository layer deve implementar output ports por adapters de infraestrutura, mantendo JpaRepository e entities fora da aplicacao e da web; Flyway deve ser o unico dono do DDL, Hibernate deve operar em validate, PostgreSQL deve ser usado em producao e testes, constraints unicas devem proteger concorrencia, exceptions de persistencia devem ser traduzidas e a transacao da application service deve ser comprovada com rollback real sobre o banco.
```
