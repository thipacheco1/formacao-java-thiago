# 345 - M13.35 - Spring Data Repository conceitos

## Apresentacao da aula

Na aula 344, você concluiu a base de persistência JPA e Hibernate sem depender de Spring Data.

Ao longo do M13, você já implementou e testou:

```text
JDBC;

DAO;

Repository Pattern sem Spring;

transações;

JPA;

Hibernate;

EntityManager;

ciclo de vida;

dirty checking;

relacionamentos;

fetch;

N+1;

JPQL;

Criteria API;

projections;

paginação;

locks;

auditoria.
```

Você aprendeu o que acontece por baixo da abstração.

Agora poderá usar Spring Data JPA sem tratá-lo como magia.

O objetivo do Spring Data JPA não é substituir:

- banco de dados;
- SQL;
- JPA;
- Hibernate;
- transações;
- modelagem;
- índices;
- constraints;
- lifecycle;
- controle de concorrência.

Ele fornece uma infraestrutura de repositories sobre JPA.

Em vez de escrever manualmente uma classe para operações comuns:

```java
public final class JpaOrdemServicoRepository {

    private final EntityManager entityManager;

    public OrdemServicoEntity save(
            OrdemServicoEntity entity
    ) {
        // decidir persist ou merge;
        // tratar transação;
        // devolver instância correta.
    }

    public Optional<OrdemServicoEntity> findById(
            Long id
    ) {
        // usar EntityManager.find.
    }
}
```

você poderá declarar uma interface:

```java
public interface OrdemServicoRepository
        extends JpaRepository<
                OrdemServicoEntity,
                Long
        > {
}
```

Em runtime, Spring Data cria um objeto que implementa essa interface.

Esse objeto é um proxy de repository.

Ele encaminha operações CRUD para uma implementação base JPA, normalmente associada a:

```text
SimpleJpaRepository.
```

A interface descreve o contrato.

A infraestrutura fornece a implementação comum.

Entretanto, você continuará responsável por decisões como:

- qual entidade é o agregado;
- qual tipo representa o ID;
- onde começa a transação;
- quando retornar entidade ou projection;
- se `save` representa criação ou merge;
- se a consulta pode causar N+1;
- se `findAll` é seguro;
- se um método bulk ignora callbacks;
- se o repository expõe operações demais;
- como traduzir erros;
- como preservar auditoria e versão.

Nesta aula, você estudará:

- Spring Data;
- Spring Data Commons;
- Spring Data JPA;
- `Repository<T, ID>`;
- `CrudRepository<T, ID>`;
- `ListCrudRepository<T, ID>`;
- `PagingAndSortingRepository<T, ID>`;
- `ListPagingAndSortingRepository<T, ID>`;
- `JpaRepository<T, ID>`;
- interfaces genéricas;
- scanning de repositories;
- proxy criado em runtime;
- implementação base;
- configuração sem Spring Boot;
- `save`;
- `findById`;
- `existsById`;
- `count`;
- `findAll`;
- `delete`;
- `deleteById`;
- `flush`;
- `saveAndFlush`;
- `getReferenceById`;
- entidade nova;
- `persist`;
- entidade existente;
- `merge`;
- transação externa;
- dirty checking;
- limites da abstração.

A primeira configuração Spring do curso será propositalmente explícita.

Não haverá Spring Boot.

Você criará:

```text
AnnotationConfigApplicationContext;

@Configuration;

@EnableJpaRepositories;

@EnableTransactionManagement;

LocalContainerEntityManagerFactoryBean;

JpaTransactionManager.
```

Assim, ficará claro o que o Boot automatizará apenas no M14.

A infraestrutura será:

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
formacao_java_jpa_345
```

O schema será:

```text
jpa_345
```

Flyway continuará dono do DDL.

Hibernate permanecerá em:

```text
validate.
```

A entidade continuará:

```text
versionada;

auditável;

sem setters públicos de auditoria.
```

O laboratório comprovará:

```text
repository:
é interface no código;
é proxy em runtime.

save de entidade nova:
usa persist.

save de entidade existente detached:
usa merge.

retorno de save:
deve ser usado.

entidade managed dentro de transação:
dirty checking sem save obrigatório.

findById:
retorna Optional.

saveAndFlush:
executa flush;
não equivale a commit.

rollback após flush:
remove a alteração do banco.

existsById e count:
executam operações próprias.

delete:
respeita lifecycle JPA.

findAll:
funciona, mas exige critério de volume.

estado final:
zero OS-JPA-345-%.
```

A próxima aula será:

```text
346 - M13.36 - Queries derivadas
```

Por isso, nesta aula o repository não declarará métodos como:

```java
findByStatus(...);

findByCodigo(...);

findByClienteNome(...);
```

A criação de queries a partir de nomes ficará integralmente para a aula 346.

Também não serão usados:

- `@Query`;
- native query;
- projections Spring Data;
- Specification Spring Data;
- Query by Example;
- Spring Boot;
- API REST;
- controllers.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
343:
Lock pessimista.

344:
Auditoria CreatedAt UpdatedAt usuario.

345:
Spring Data Repository conceitos.

346:
Queries derivadas.

347:
Query annotation native query e JPQL.

348:
Specifications com Spring Data.
```

Até a aula 344, você controlou diretamente:

```text
EntityManagerFactory;

EntityManager;

EntityTransaction;

persist;

find;

merge;

remove;

flush;

queries.
```

Agora, Spring Data encapsulará parte desse boilerplate.

A progressão será:

```text
JPA manual:
compreender o mecanismo.

Spring Data Repository:
usar contratos comuns.

queries derivadas:
declarar consultas por convenção.

@Query:
declarar JPQL e SQL explícitos.

Specifications:
compor filtros.
```

Nesta aula:

```text
Spring Framework:
configuração mínima.

Spring Boot:
não.

repository proxy:
sim.

JpaRepository:
sim.

CRUD:
sim.

transações:
sim.

auditoria:
reutilizada.

query derivada:
não.

@Query:
não.

REST:
não.
```

A arquitetura será:

```text
caso de uso
    -> repository proxy
        -> interceptor transacional
            -> implementação base
                -> EntityManager
                    -> Hibernate
                        -> JDBC
                            -> PostgreSQL.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-345-spring-data-repository-conceitos
```

Estrutura final:

```text
labs
└── m13
    └── aula-345-spring-data-repository-conceitos
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── hierarquia-repositories.md
        │   ├── proxy-e-simple-jpa-repository.md
        │   ├── save-persist-merge.md
        │   ├── fronteira-transacional.md
        │   ├── limites-da-abstracao.md
        │   └── troubleshooting-spring-data.md
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
            │   │                   └── aula345
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
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── lab
            │   │                       │   ├── RepositoryConceptLab.java
            │   │                       │   ├── RepositoryObservation.java
            │   │                       │   └── RepositoryReport.java
            │   │                       ├── repository
            │   │                       │   └── OrdemServicoRepository.java
            │   │                       └── observability
            │   │                           └── SqlCaptureInspector.java
            │   └── resources
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_345.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula345
                                        ├── RepositoryProxyIT.java
                                        ├── SaveSemanticsIT.java
                                        ├── CrudRepositoryOperationsIT.java
                                        ├── TransactionBoundaryIT.java
                                        ├── FlushSemanticsIT.java
                                        ├── RepositoryArchitectureTest.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
contexto Spring:
iniciado sem Boot.

repository bean:
disponível.

classe em runtime:
proxy.

save nova:
INSERT;
versão 0;
auditoria preenchida.

findById:
Optional presente.

save detached:
UPDATE por merge;
retorno diferente ou potencialmente diferente do argumento.

dirty checking:
UPDATE sem segundo save dentro de transação externa.

saveAndFlush com rollback:
SQL executado;
linha não confirmada.

delete:
linha removida.

limpeza:
zero fixtures.
```

---

## Conceito essencial

### Spring Data nao e Spring Boot

Spring Data é uma família de projetos para acesso a dados.

Spring Data Commons fornece abstrações compartilhadas, como:

```text
Repository;

CrudRepository;

ListCrudRepository;

PagingAndSortingRepository;

Page;

Pageable;

Sort.
```

Spring Data JPA integra essas abstrações com Jakarta Persistence.

Spring Boot poderá configurar Spring Data automaticamente no próximo módulo.

Nesta aula, cada bean será declarado.

---

### Repository T ID

A interface central é:

```java
Repository<T, ID>
```

`T` representa o tipo de domínio.

`ID` representa o tipo do identificador.

Exemplo:

```java
Repository<
        OrdemServicoEntity,
        Long
>
```

A interface base funciona como marcador para a infraestrutura descobrir os tipos administrados.

---

### CrudRepository

`CrudRepository` oferece operações comuns:

```java
save;

saveAll;

findById;

existsById;

findAll;

findAllById;

count;

deleteById;

delete;

deleteAllById;

deleteAll.
```

Métodos que retornam vários elementos podem usar `Iterable`.

---

### ListCrudRepository

`ListCrudRepository` oferece operações equivalentes, mas usa `List` nos retornos múltiplos.

Para código Java moderno, `List` costuma ser mais conveniente que `Iterable`.

Isso não muda a quantidade de dados consultada.

`findAll` continua significando:

```text
buscar todos os registros compatíveis.
```

---

### PagingAndSortingRepository

Essa interface adiciona:

```java
findAll(
        Sort sort
);

findAll(
        Pageable pageable
);
```

Ela não deve ser confundida com CRUD completo.

Nas gerações atuais do Spring Data, interfaces de paginação e ordenação são combinadas explicitamente com interfaces CRUD quando necessário.

`JpaRepository` já oferece a composição JPA mais completa.

---

### JpaRepository

`JpaRepository<T, ID>` é específico para JPA.

Além de CRUD, paginação e ordenação, ele expõe recursos como:

```text
flush;

saveAndFlush;

saveAllAndFlush;

deleteAllInBatch;

deleteAllByIdInBatch;

getReferenceById.
```

Um repository não deve usar operações batch apenas porque elas existem.

Métodos bulk podem ignorar:

- callbacks;
- auditoria;
- sincronização do persistence context;
- regras por entidade.

---

### Interface sem implementacao escrita por voce

Você declarará:

```java
public interface OrdemServicoRepository
        extends JpaRepository<
                OrdemServicoEntity,
                Long
        > {
}
```

Não haverá:

```java
class OrdemServicoRepositoryImpl
```

para os métodos herdados.

Spring Data:

1. escaneia a interface;
2. descobre entidade e ID;
3. cria metadata;
4. monta uma factory;
5. cria proxy;
6. conecta o proxy à implementação base;
7. registra o bean no contexto.

---

### Proxy

O objeto recebido por injeção não é a interface.

Também não é uma classe concreta escrita no projeto.

Ele é um proxy criado em runtime.

Teste:

```java
AopUtils.isAopProxy(
        repository
)
```

deve indicar proxy.

Não compare o nome exato da classe gerada.

Nomes internos podem variar.

---

### SimpleJpaRepository

A implementação base do módulo JPA executa operações comuns usando `EntityManager`.

Conceitualmente:

```text
repository.save(entity)
    -> decidir se é nova
        -> persist ou merge.
```

e:

```text
repository.findById(id)
    -> EntityManager.find.
```

Conhecer essa implementação ajuda a lembrar:

```text
Spring Data não eliminou JPA;
ele a utiliza.
```

---

### Configuracao sem Boot

A annotation:

```java
@EnableJpaRepositories(
        basePackageClasses =
                OrdemServicoRepository.class
)
```

habilita scanning de repository interfaces.

`LocalContainerEntityManagerFactoryBean` cria a infraestrutura JPA integrada ao Spring.

`JpaTransactionManager` conecta transações Spring ao `EntityManagerFactory`.

`@EnableTransactionManagement` habilita interceptação transacional.

---

### save nao significa sempre insert

`save` decide entre:

```text
persist;

merge.
```

Para entidade nova:

```text
ID gerado ainda nulo;
persist.
```

Para entidade existente:

```text
ID preenchido;
merge.
```

A detecção pode considerar ID, versão e contratos como `Persistable`.

Nesta entidade, o ID gerado será a evidência principal de novidade.

---

### Versao primitiva e deteccao

A entidade da aula usa:

```java
@Version
private int versao;
```

Uma versão primitiva nunca é `null`.

Por isso, a detecção padrão não pode usar `null` nessa propriedade para decidir se a entidade é nova.

Com ID gerado:

```text
id null:
nova.

id preenchido:
existente.
```

Essa nuance importa em entidades com IDs atribuídos manualmente.

---

### Persist

Quando a entidade é nova, a implementação chama conceitualmente:

```java
entityManager.persist(
        entity
);
```

A própria instância se torna managed dentro da transação.

O ID gerado é preenchido nela.

O listener de auditoria recebe `@PrePersist`.

---

### Merge

Quando a entidade é considerada existente, o fluxo usa conceitualmente:

```java
entityManager.merge(
        entity
);
```

O retorno é a instância managed.

O argumento pode permanecer detached.

Regra:

```java
OrdemServicoEntity saved =
        repository.save(
                detached
        );

use saved;
```

Não continue assumindo que o argumento se tornou managed.

---

### save em entidade managed

Dentro de uma transação externa:

```java
OrdemServicoEntity ordem =
        repository.findById(id)
                .orElseThrow();

ordem.alterarStatus(
        "AGENDADA"
);
```

A entidade está managed.

O dirty checking atualizará no flush.

Chamar `save(ordem)` novamente costuma ser desnecessário nesse cenário.

O uso indiscriminado de `save` pode esconder falta de entendimento do lifecycle.

---

### Fronteira transacional

Métodos CRUD herdados possuem comportamento transacional fornecido pela infraestrutura.

Entretanto, um caso de uso com várias operações deve possuir uma transação externa.

Exemplo:

```java
transactionTemplate.executeWithoutResult(
        status -> {
            OrdemServicoEntity ordem =
                    repository.findById(id)
                            .orElseThrow();

            ordem.alterarStatus(
                    "AGENDADA"
            );

            // Dirty checking no commit.
        }
);
```

Sem transação externa, cada método do repository pode encerrar sua própria unidade de trabalho.

---

### Entidade retornada por findById

`findById` retorna:

```java
Optional<OrdemServicoEntity>
```

Dentro de uma transação externa, a entidade permanece managed até o fim dessa transação.

Ao chamar o repository isoladamente e retornar da transação interna, ela pode ficar detached.

Isso afeta:

- lazy loading;
- dirty checking;
- auditoria;
- atualização posterior.

---

### Optional

`Optional` comunica ausência possível.

Uso:

```java
OrdemServicoEntity ordem =
        repository.findById(id)
                .orElseThrow(
                        () ->
                                new IllegalStateException(
                                        "Ordem não encontrada"
                                )
                );
```

Não use:

```java
optional.get()
```

sem verificar presença.

---

### existsById

`existsById` responde se o repository encontra o ID.

Ele não deve ser usado como garantia de concorrência:

```text
exists;
depois update.
```

Entre as duas operações, outra transação pode remover a linha.

Constraints, versão e transação continuam necessárias.

---

### count

`count` retorna quantidade total do domínio administrado pelo repository.

Em tabelas grandes, count pode ser caro.

Não execute em toda operação sem necessidade.

A aula 341 já mostrou que count pertence a um contrato específico de paginação.

---

### findAll

`findAll` é conveniente para fixtures pequenas.

Em produção, pode carregar a tabela inteira.

A existência do método não significa que ele é seguro para qualquer volume.

Prefira:

- paginação;
- filtro;
- projection;
- limite;
- streaming controlado;
- exportação específica.

---

### flush

`flush` sincroniza o persistence context com o banco.

Ele não executa commit.

```text
flush:
SQL enviado.

commit:
transação confirmada.
```

Um rollback depois do flush desfaz a alteração.

---

### saveAndFlush

`saveAndFlush` combina:

```text
save;

flush.
```

Ele pode revelar constraint e conflito antes do commit.

Não significa:

```text
dados definitivamente confirmados.
```

O laboratório executará `saveAndFlush` e marcará rollback para provar essa diferença.

---

### getReferenceById

Esse método usa a capacidade equivalente a uma referência JPA.

Ele pode devolver um proxy sem buscar imediatamente a linha.

Uso possível:

```text
associar por ID
sem carregar todos os dados.
```

A existência da linha pode ser verificada apenas quando a referência for inicializada ou usada pelo SQL.

Não use como substituto universal de `findById`.

---

### delete

Operações de delete passam por semântica JPA.

Com entidade versionada, concorrência continua relevante.

Com callbacks, lembre que:

```text
@PreUpdate:
não é auditoria de delete.
```

Uma trilha de remoção exige estratégia própria.

---

### Metodos batch

Operações como:

```text
deleteAllInBatch;
deleteAllByIdInBatch.
```

podem emitir bulk SQL.

Elas podem deixar entidades managed desatualizadas e ignorar callbacks individuais.

Nesta aula, elas serão apenas documentadas.

---

### Repository de framework e repository de dominio

Um repository Spring Data é uma interface de infraestrutura.

Em projetos simples, ele pode ser usado diretamente.

Em domínios complexos, pode existir uma porta própria:

```java
public interface OrdemServicoStore {

    OrdemServico save(
            OrdemServico ordem
    );

    Optional<OrdemServico> findById(
            OrdemServicoId id
    );
}
```

Um adapter Spring Data implementa essa porta.

A escolha depende do nível de desacoplamento necessário.

Não crie camadas vazias apenas por padrão.

---

### Expor metodos demais

Estender `JpaRepository` oferece muitas operações.

Isso pode permitir:

- `findAll` sem limite;
- delete em massa;
- flush arbitrário;
- acesso por referência;
- operações não permitidas pelo domínio.

Uma alternativa futura é criar interface base seletiva com `@NoRepositoryBean`.

Nesta aula, `JpaRepository` será usado para conhecer a API completa.

---

### @NoRepositoryBean

Uma interface genérica intermediária precisa indicar que não representa um repository concreto:

```java
@NoRepositoryBean
public interface BaseRepository<
        T,
        ID
> extends Repository<T, ID> {

    Optional<T> findById(
            ID id
    );

    <S extends T> S save(
            S entity
    );
}
```

Sem `@NoRepositoryBean`, a infraestrutura pode tentar criar um bean para um tipo ainda genérico.

---

### Exception translation

Repositories Spring participam da tradução de exceções de persistência para a hierarquia Spring.

Isso não elimina:

- rollback;
- logs;
- mensagens de negócio;
- conflito otimista;
- constraint;
- timeout;
- causa original.

A aplicação deve traduzir para seu contrato externo em uma camada apropriada.

---

### Spring Data nao melhora SQL automaticamente

Um repository não corrige:

- N+1;
- ausência de índice;
- join excessivo;
- mapping EAGER;
- count caro;
- paginação profunda;
- bulk inseguro.

Você ainda precisa observar SQL e medir.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\java\br\com\formacao\m13\aula345\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\java\br\com\formacao\m13\aula345\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\java\br\com\formacao\m13\aula345\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\java\br\com\formacao\m13\aula345\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\java\br\com\formacao\m13\aula345\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\java\br\com\formacao\m13\aula345\observability"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-345-spring-data-repository-conceitos\src\test\java\br\com\formacao\m13\aula345"

Set-Location `
  "labs\m13\aula-345-spring-data-repository-conceitos"
```

---

### 2. Criar pom.xml

Use:

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>

    <spring.framework.version>
        7.0.8
    </spring.framework.version>

    <spring.data.bom.version>
        2026.0.0
    </spring.data.bom.version>

    <hibernate.version>
        7.4.4.Final
    </hibernate.version>

    <hikari.version>
        7.1.0
    </hikari.version>

    <postgresql.version>
        42.7.13
    </postgresql.version>

    <flyway.version>
        12.5.0
    </flyway.version>

    <junit.version>
        5.10.2
    </junit.version>
</properties>
```

Importe os BOMs:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-framework-bom</artifactId>
            <version>
                ${spring.framework.version}
            </version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-bom</artifactId>
            <version>
                ${spring.data.bom.version}
            </version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Dependências principais:

```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-orm</artifactId>
</dependency>

<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>${hibernate.version}</version>
</dependency>
```

Adicione HikariCP, pgJDBC, Flyway, Jakarta Persistence, JUnit e Spring Test como nos laboratórios anteriores.

Não adicione Spring Boot parent ou starter.

---

### 3. Criar configuracao local

`jpa.local.env.example`:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_345
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-345-spring-data
JPA_POOL_NAME=aula-345-pool
JPA_POOL_SIZE=4
```

O arquivo real permanece fora do Git.

---

### 4. Criar migration

Crie:

```text
schema jpa_345;

sequence iniciando em 345101;

tabela ordem_servico.
```

Colunas:

```text
id;

codigo;

descricao;

status;

versao;

created_at;

updated_at;

created_by;

updated_by.
```

Mantenha:

- primary key;
- unique em código;
- check de status;
- check de versão;
- checks de auditoria;
- índices de status e updated_at.

---

### 5. Reutilizar auditoria

Copie da aula 344:

```text
AuditActor;

AuditContext;

AuditEntityListener;

AuditableEntity;

AuditScope.
```

Não altere o contrato.

O objetivo é provar que callbacks JPA continuam funcionando por trás do repository Spring Data.

---

### 6. Criar OrdemServicoEntity.java

A entidade:

```java
@Entity(name = "OrdemServico")
@Table(
        name = "ordem_servico",
        schema = "jpa_345"
)
public class OrdemServicoEntity
        extends AuditableEntity {
```

Mantenha:

```java
@Version
private int versao;
```

Use ID gerado por sequence.

Crie factory:

```java
public static OrdemServicoEntity nova(
        String codigo,
        String descricao
)
```

Estado inicial:

```text
ABERTA.
```

---

### 7. Criar OrdemServicoRepository.java

```java
package br.com.formacao.m13.aula345.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.formacao.m13.aula345.entity.OrdemServicoEntity;

public interface OrdemServicoRepository
        extends JpaRepository<
                OrdemServicoEntity,
                Long
        > {
}
```

Não declare query derivada.

Não crie implementação manual.

---

### 8. Criar SpringDataJpaConfig.java

```java
@Configuration(
        proxyBeanMethods = false
)
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackageClasses =
                OrdemServicoRepository.class
)
public class SpringDataJpaConfig {
```

Beans obrigatórios:

```text
JpaSettings;

HikariDataSource;

SqlCaptureInspector;

LocalContainerEntityManagerFactoryBean;

JpaTransactionManager;

TransactionTemplate.
```

---

### 9. Configurar EntityManagerFactory

```java
@Bean
LocalContainerEntityManagerFactoryBean
entityManagerFactory(
        DataSource dataSource,
        SqlCaptureInspector inspector
) {
    LocalContainerEntityManagerFactoryBean factory =
            new LocalContainerEntityManagerFactoryBean();

    factory.setDataSource(
            dataSource
    );

    factory.setPackagesToScan(
            "br.com.formacao.m13.aula345.entity"
    );

    factory.setPersistenceUnitName(
            "aula345PU"
    );

    factory.setJpaVendorAdapter(
            new HibernateJpaVendorAdapter()
    );

    Properties properties =
            new Properties();

    properties.put(
            "hibernate.hbm2ddl.auto",
            "validate"
    );

    properties.put(
            "hibernate.default_schema",
            "jpa_345"
    );

    properties.put(
            "hibernate.generate_statistics",
            "true"
    );

    properties.put(
            "hibernate.session_factory.statement_inspector",
            inspector
    );

    factory.setJpaProperties(
            properties
    );

    return factory;
}
```

---

### 10. Configurar transaction manager

```java
@Bean
PlatformTransactionManager transactionManager(
        EntityManagerFactory entityManagerFactory
) {
    return new JpaTransactionManager(
            entityManagerFactory
    );
}
```

E:

```java
@Bean
TransactionTemplate transactionTemplate(
        PlatformTransactionManager transactionManager
) {
    return new TransactionTemplate(
            transactionManager
    );
}
```

---

### 11. Iniciar contexto Spring

No `Main`:

```java
try (
    AnnotationConfigApplicationContext context =
            new AnnotationConfigApplicationContext(
                    SpringDataJpaConfig.class
            )
) {
    OrdemServicoRepository repository =
            context.getBean(
                    OrdemServicoRepository.class
            );

    // Laboratório.
}
```

Não use `SpringApplication.run`.

---

### 12. Criar RepositoryObservation.java

```java
public record RepositoryObservation(
        String scenario,
        boolean repositoryProxy,
        boolean entityManagedInsideTransaction,
        boolean argumentManagedAfterSave,
        boolean returnedValueUsed,
        long insertCount,
        long selectCount,
        long updateCount,
        long deleteCount
) {
}
```

---

### 13. Criar RepositoryReport.java

```java
public record RepositoryReport(
        List<RepositoryObservation> observations,
        boolean contextStartedWithoutBoot,
        boolean repositoryProxyWasCreated,
        boolean newEntityUsedPersist,
        boolean detachedEntityUsedMerge,
        boolean dirtyCheckingWorked,
        boolean findByIdWorked,
        boolean existsAndCountWorked,
        boolean flushWasNotCommit,
        boolean deleteWorked,
        boolean derivedQueriesWereNotUsed
) {

    public RepositoryReport {
        observations =
                List.copyOf(observations);
    }
}
```

---

### 14. Provar o proxy

Obtenha o bean.

Confirme:

```java
AopUtils.isAopProxy(
        repository
)
```

Inspecione interfaces implementadas.

Não exija nome exato da classe.

Confirme que o código do projeto contém somente a interface.

---

### 15. Salvar entidade nova

Abra:

```text
AuditScope:
user:thiago;
Clock fixo.
```

Crie entidade com ID nulo.

Limpe inspector.

Execute:

```java
OrdemServicoEntity saved =
        repository.save(
                nova
        );
```

Confirme:

```text
ID preenchido;

versão 0;

auditoria preenchida;

um INSERT até o encerramento da transação;

saved representa o resultado oficial.
```

Como o método possui sua transação, o flush pode ocorrer no commit interno.

---

### 16. Buscar por ID

Execute:

```java
Optional<OrdemServicoEntity> optional =
        repository.findById(
                saved.getId()
        );
```

Confirme presente.

Não acesse lazy inexistente.

Confirme um SELECT.

---

### 17. Testar entidade detached e save

A entidade retornada por uma chamada isolada pode estar detached quando a transação do repository termina.

Altere sua descrição dentro de novo `AuditScope`.

Execute:

```java
OrdemServicoEntity merged =
        repository.save(
                detached
        );
```

Use `merged`.

Confirme:

```text
UPDATE;

versão incrementada;

updatedBy atual;

argumento não deve ser tratado como retorno managed garantido.
```

---

### 18. Dirty checking em transacao externa

Use `TransactionTemplate`:

```java
transactionTemplate.executeWithoutResult(
        status -> {
            OrdemServicoEntity ordem =
                    repository.findById(id)
                            .orElseThrow();

            ordem.alterarStatus(
                    "AGENDADA"
            );

            // Sem repository.save.
        }
);
```

Mantenha `AuditScope` aberto ao redor da transação.

Confirme update, versão e auditoria.

Esse cenário prova que JPA continua funcionando por baixo do repository.

---

### 19. save em managed

Em cenário experimental, chame `save` depois de alterar a entidade managed.

Compare SQL com o cenário anterior.

Documente:

```text
a chamada é redundante para dirty checking;
não é necessária como ritual.
```

Mantenha o fluxo oficial sem save redundante.

---

### 20. Testar saveAndFlush sem commit

Dentro de `TransactionTemplate`:

1. crie nova Ordem;
2. chame `saveAndFlush`;
3. confirme INSERT no inspector;
4. marque:

```java
status.setRollbackOnly();
```

Depois da transação, busque o ID.

Confirme:

```text
linha ausente.
```

Isso prova:

```text
flush não é commit.
```

---

### 21. Testar existsById e count

Guarde quantidade inicial.

Execute:

```java
repository.existsById(id);

repository.count();
```

Confirme valores coerentes.

Não use `existsById` como pré-condição de concorrência.

---

### 22. Testar getReferenceById

Dentro de uma transação externa:

```java
OrdemServicoEntity reference =
        repository.getReferenceById(
                id
        );
```

Observe:

- referência retornada;
- inicialização ao acessar atributo;
- comportamento para ID inexistente.

Não use fora da transação para leitura comum.

---

### 23. Testar findAll com fixtures pequenas

Crie três Ordens didáticas.

Execute:

```java
repository.findAll();
```

Confirme lista.

Documente que esse método não deve ser aplicado a tabela grande sem limite.

Não introduza query derivada.

---

### 24. Testar delete

Crie fixture separada.

Obtenha entidade atual.

Execute:

```java
repository.delete(
        entity
);
```

Confirme linha removida.

Depois teste `deleteById` com ID existente.

Não use métodos batch.

---

### 25. Criar RepositoryProxyIT.java

Casos:

- contexto inicia;
- bean existe;
- tipo declarado é interface;
- objeto é proxy;
- repository administra Ordem e Long;
- nenhuma implementação manual existe;
- Spring Boot não está no classpath.

---

### 26. Criar SaveSemanticsIT.java

Casos:

- ID nulo;
- save nova;
- insert;
- auditoria;
- versão;
- save detached;
- merge;
- retorno usado;
- update;
- versão incrementada;
- ator atualizado.

---

### 27. Criar CrudRepositoryOperationsIT.java

Casos:

- findById presente;
- findById ausente;
- Optional tratado;
- existsById;
- count;
- findAll em fixture limitada;
- delete;
- deleteById;
- getReference dentro de transação.

---

### 28. Criar TransactionBoundaryIT.java

Casos:

- entidade retornada fora da transação;
- transação externa;
- dirty checking sem save;
- AuditScope envolvendo transação;
- rollback;
- repository chamado várias vezes na mesma transação;
- versão e auditoria coerentes.

---

### 29. Criar FlushSemanticsIT.java

Casos:

- `flush`;
- `saveAndFlush`;
- SQL antes do commit;
- rollback;
- linha ausente;
- constraint revelada no flush;
- nenhuma equivalência entre flush e commit.

---

### 30. Criar RepositoryArchitectureTest.java

Valide:

- interface estende `JpaRepository`;
- genéricos Ordem e Long;
- zero métodos customizados;
- zero `@Query`;
- zero nomes `findBy...` próprios;
- configuração usa `@EnableJpaRepositories`;
- não existe dependência Spring Boot;
- entidade continua `@Version`;
- auditoria continua registrada.

---

### 31. Criar TestDataCleaner.java

Use JDBC de teste:

```sql
DELETE FROM jpa_345.ordem_servico
WHERE codigo LIKE 'OS-JPA-345-%';
```

Não use `deleteAllInBatch` para não ensinar bulk como cleaner de negócio.

---

### 32. Criar scripts

`01_criar_database.ps1` cria:

```text
formacao_java_jpa_345.
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
zero OS-JPA-345-%;

schema válido;

colunas de auditoria;

coluna de versão;

constraints;

índices;

schema history V1.
```

`05_limpar_database.ps1` remove o database.

---

### 33. Executar o laboratorio

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
Spring iniciou sem Boot;

repository proxy criado;

save nova inseriu;

save detached atualizou;

dirty checking funcionou;

findById retornou Optional;

exists e count funcionaram;

flush não confirmou;

delete funcionou;

auditoria e versão foram preservadas;

nenhuma query derivada foi criada;

estado final limpo.
```

Depois:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 34. Criar documentacao

`hierarquia-repositories.md` deve registrar:

```text
Repository;

CrudRepository;

ListCrudRepository;

PagingAndSortingRepository;

JpaRepository.
```

`proxy-e-simple-jpa-repository.md` deve explicar scanning, metadata, proxy, implementação base e interceptores.

`save-persist-merge.md` deve comparar:

```text
ID;

estado;

operação JPA;

instância retornada;

auditoria;

versão.
```

`fronteira-transacional.md` deve comparar chamada isolada e caso de uso com transação externa.

`limites-da-abstracao.md` deve registrar N+1, findAll, bulk, flush, count, lazy e constraints.

`troubleshooting-spring-data.md` deve cobrir:

- bean não encontrado;
- package scan;
- entity manager factory;
- transaction manager;
- schema validation;
- save gerou merge;
- auditoria sem contexto;
- lazy detached;
- flush;
- repository proxy.

---

## Entendendo o que foi feito

### A interface virou bean

Spring Data criou a implementação em runtime.

### A JPA continuou presente

Persist, merge, find, dirty checking e flush permaneceram sob a abstração.

### Save perdeu a aparencia de insert universal

A operação depende do estado de novidade da entidade.

### A transacao continuou sendo decisao arquitetural

Métodos isolados funcionaram, mas o caso de uso precisou de uma fronteira externa.

### A abstracao mostrou limites

FindAll, bulk, flush e referências continuaram exigindo critério.

---

## Erros comuns importantes

### Achar que save sempre insere

Entidade existente normalmente segue merge.

### Ignorar o retorno de save

No merge, o retorno é a instância managed.

### Chamar save em toda entidade managed

Dirty checking já cuida do update.

### Usar findAll sem limite

A interface não conhece o volume seguro.

### Confundir saveAndFlush com commit

Rollback ainda desfaz o SQL.

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
    id,
    codigo,
    status,
    versao,
    created_by,
    updated_by
FROM jpa_345.ordem_servico
WHERE codigo LIKE 'OS-JPA-345-%'
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — CrudRepository minimo

Crie uma interface experimental que estenda somente:

```java
CrudRepository<
        OrdemServicoEntity,
        Long
>
```

Compare os métodos disponíveis.

### Parte 2 — ListCrudRepository

Troque temporariamente para `ListCrudRepository`.

Compare retorno de `findAll`.

Não mantenha duas interfaces concretas para a mesma entidade no mesmo scan.

### Parte 3 — Base seletiva

Crie:

```java
@NoRepositoryBean
BaseRepository<T, ID>
```

Exponha somente `save`, `findById` e `existsById`.

### Parte 4 — Managed sem save

Crie teste que falha se nenhum UPDATE for gerado.

Altere managed dentro da transação sem chamar save.

### Parte 5 — Detached e retorno

Compare por referência:

```java
argument == returned
```

Não transforme um resultado específico do provider em contrato universal.

### Parte 6 — FindAll perigoso

Crie 500 fixtures descartáveis.

Observe memória e SQL.

Substitua por paginação já aprendida.

### Parte 7 — Batch risk

Leia a documentação de `deleteAllInBatch`.

Desenhe os riscos para auditoria e persistence context.

Não adote no fluxo oficial.

### Parte 8 — ADR

Registre:

```text
Spring Data reduz boilerplate;

JPA continua sendo o mecanismo;

JpaRepository apenas quando a API ampla é aceitável;

transação no caso de uso;

save não é ritual;

findAll limitado;

bulk exige política;

queries derivadas somente na aula 346.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 345 existe;
- continuidade com a aula 344 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi definido;
- Spring Data BOM 2026.0.0 foi definido;
- Spring Data JPA 4.1.0 foi usado;
- Spring Boot não foi usado;
- Jakarta Persistence 3.2 foi mantida;
- Hibernate 7.4.4.Final foi mantido;
- HikariCP foi mantido;
- pgJDBC foi mantido;
- Flyway permaneceu dono do DDL;
- database isolado foi criado;
- schema `jpa_345` foi criado;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- auditoria da aula 344 foi reutilizada;
- entidade permaneceu versionada;
- `Repository<T, ID>` foi explicado;
- `CrudRepository` foi explicado;
- `ListCrudRepository` foi explicado;
- `PagingAndSortingRepository` foi explicado;
- `ListPagingAndSortingRepository` foi citado;
- `JpaRepository` foi explicado;
- tipos genéricos foram definidos;
- interface concreta foi criada;
- nenhuma implementação manual foi criada;
- `@EnableJpaRepositories` foi usado;
- `@EnableTransactionManagement` foi usado;
- `LocalContainerEntityManagerFactoryBean` foi configurado;
- `JpaTransactionManager` foi configurado;
- `AnnotationConfigApplicationContext` foi usado;
- repository bean foi obtido;
- proxy foi confirmado;
- nome exato do proxy não foi fixado;
- implementação base foi explicada;
- `SimpleJpaRepository` foi contextualizada;
- `save` foi explicado;
- persist e merge foram diferenciados;
- detecção de entidade nova foi explicada;
- versão primitiva foi considerada;
- ID nulo identificou entidade nova;
- save nova gerou insert;
- ID foi preenchido;
- auditoria de persist funcionou;
- versão inicial foi confirmada;
- save detached foi testado;
- merge foi observado;
- retorno de save foi usado;
- argumento detached não foi tratado como managed;
- save em managed foi discutido;
- dirty checking sem save foi testado;
- transação externa foi criada;
- fronteira transacional foi explicada;
- `findById` foi usado;
- Optional foi tratado;
- entidade fora da transação foi discutida;
- lazy fora de contexto foi lembrado;
- `existsById` foi usado;
- exists não foi tratado como lock;
- `count` foi usado;
- custo de count foi discutido;
- `findAll` foi testado apenas com fixtures pequenas;
- risco de findAll foi documentado;
- `flush` foi usado;
- flush foi diferenciado de commit;
- `saveAndFlush` foi usado;
- rollback após flush foi testado;
- `getReferenceById` foi apresentado;
- delete foi testado;
- deleteById foi testado;
- métodos batch foram documentados sem adoção;
- callbacks e bulk foram diferenciados;
- repository de framework e domínio foram comparados;
- exposição excessiva de métodos foi discutida;
- `@NoRepositoryBean` foi apresentado;
- exception translation foi explicada;
- SQL continuou sendo observado;
- N+1 não foi tratado como resolvido;
- testes de proxy foram criados;
- testes de save foram criados;
- testes CRUD foram criados;
- testes transacionais foram criados;
- testes de flush foram criados;
- teste de arquitetura foi criado;
- fixtures foram removidas;
- estado final ficou vazio;
- nenhum método derivado foi criado;
- `@Query` não foi antecipada;
- native query não foi antecipada;
- Spring Data Specification não foi antecipada;
- API REST não foi antecipada;
- ponte para a aula 346 está correta;
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
  labs/m13/aula-345-spring-data-repository-conceitos
```

Commit recomendado:

```powershell
git commit -m "feat(m13): introduzir repositories com spring data jpa"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou Spring Data JPA sem esconder a infraestrutura.

Aprendeu:

```text
Repository:
interface marcadora.

CrudRepository:
operações CRUD.

ListCrudRepository:
retornos em List.

PagingAndSortingRepository:
paginação e ordenação.

JpaRepository:
recursos específicos JPA.

proxy:
implementação criada em runtime.

SimpleJpaRepository:
base que usa EntityManager.

save:
persist ou merge.

flush:
sincronização, não commit.
```

O laboratório comprovou:

```text
contexto Spring sem Boot;

repository proxy;

save de entidade nova;

save de entidade detached;

retorno de merge;

dirty checking sem save;

Optional em findById;

exists e count;

findAll limitado;

saveAndFlush com rollback;

delete;

auditoria e versão preservadas.
```

A decisão arquitetural foi:

```text
Spring Data:
reduz boilerplate.

JPA:
continua governando lifecycle.

transação:
fica no caso de uso.

save:
não é sinônimo de insert.

JpaRepository:
poder amplo com responsabilidade.

queries:
ainda não declaradas.
```

A próxima aula será:

```text
346 - M13.36 - Queries derivadas
```

Nela, você aprenderá:

- parsing de nomes de métodos;
- prefixos `find`, `read`, `get`, `query`;
- `By`;
- propriedades;
- propriedades aninhadas;
- `And`;
- `Or`;
- precedência;
- `Containing`;
- `StartingWith`;
- `EndingWith`;
- `IgnoreCase`;
- `In`;
- `Between`;
- `Before`;
- `After`;
- `True`;
- `False`;
- `OrderBy`;
- `Top`;
- `First`;
- `Distinct`;
- retornos `Optional`, `List`, `Page` e `Slice`;
- erros de propriedade no startup;
- nomes excessivamente longos;
- critérios para abandonar derivação.

A aula 345 criou o repository.

A aula 346 fará o proxy construir consultas a partir de contratos de método.

---

# Material complementar

## Checkpoint final

- [ ] Iniciei Spring Data JPA sem Spring Boot.
- [ ] Entendi a hierarquia de repository interfaces.
- [ ] Confirmei que o bean é um proxy.
- [ ] Diferenciei persist, merge, dirty checking e flush.
- [ ] Mantive queries derivadas fora desta aula.

---

## Troubleshooting adicional

### Repository bean nao foi encontrado

Revise package scan e `@EnableJpaRepositories`.

### EntityManagerFactory nao iniciou

Revise DataSource, packages de entidades e schema.

### Save gerou SELECT e UPDATE

A entidade foi considerada existente e seguiu merge.

### Auditoria falhou

Abra `AuditScope` antes da transação.

### Entidade lazy falhou fora do metodo

Defina uma transação externa ou uma consulta adequada.

---

## Perguntas de revisao

1. O que Spring Data JPA fornece?
2. Ele substitui JPA?
3. O que representa `T`?
4. O que representa `ID`?
5. O que é `Repository`?
6. O que oferece `CrudRepository`?
7. Qual diferença do `ListCrudRepository`?
8. O que acrescenta `JpaRepository`?
9. Quem cria a implementação?
10. O bean é um proxy?
11. O que `save` faz em entidade nova?
12. O que faz em entidade existente?
13. Qual instância usar após merge?
14. Managed precisa sempre de save?
15. `findById` retorna o quê?
16. Flush é commit?
17. FindAll é sempre seguro?
18. Métodos batch executam callbacks individuais?
19. Spring Boot foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Infraestrutura de repositories sobre JPA.
2. Não.
3. Tipo de domínio.
4. Tipo do identificador.
5. Interface central marcadora.
6. CRUD comum.
7. Retornos múltiplos em List.
8. Recursos específicos JPA.
9. Spring Data em runtime.
10. Sim.
11. Persist.
12. Merge, em regra.
13. O retorno.
14. Não.
15. Optional.
16. Não.
17. Não.
18. Não necessariamente.
19. Não.
20. Queries derivadas.

---

## Desafio opcional

Crie:

```java
RepositoryContractVerifier
```

Entrada:

```text
interface;

tipo de domínio;

tipo de ID;

interfaces base;

métodos declarados;

annotations.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- exigir interface;
- validar tipos genéricos;
- alertar `findAll` exposto;
- alertar métodos batch;
- alertar `@Query` prematura neste laboratório;
- reconhecer `@NoRepositoryBean`;
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
### Aula 345 - M13.35 - Spring Data Repository conceitos

- Iniciei Spring Data JPA sem Spring Boot.
- Usei Spring Framework 7.0.8.
- Usei Spring Data BOM 2026.0.0.
- Usei Spring Data JPA 4.1.0.
- Diferenciei Spring Data de Spring Boot.
- Entendi `Repository<T, ID>`.
- Entendi `CrudRepository`.
- Entendi `ListCrudRepository`.
- Entendi `PagingAndSortingRepository`.
- Entendi `JpaRepository`.
- Criei `OrdemServicoRepository`.
- Não escrevi implementação manual.
- Usei `@EnableJpaRepositories`.
- Usei `@EnableTransactionManagement`.
- Configurei `LocalContainerEntityManagerFactoryBean`.
- Configurei `JpaTransactionManager`.
- Iniciei `AnnotationConfigApplicationContext`.
- Confirmei que o repository é proxy.
- Entendi a função de `SimpleJpaRepository`.
- Entendi que `save` decide entre persist e merge.
- Considerei ID e versão na detecção de novidade.
- Salvei entidade nova.
- Usei o retorno de save.
- Atualizei entidade detached por merge.
- Mantive dirty checking dentro de transação externa.
- Evitei save redundante em entidade managed.
- Usei `findById` e `Optional`.
- Usei `existsById` e `count`.
- Testei `findAll` somente com fixtures pequenas.
- Diferenciei flush de commit.
- Testei `saveAndFlush` seguido de rollback.
- Conheci `getReferenceById`.
- Testei delete e deleteById.
- Documentei riscos dos métodos batch.
- Comparei repository de framework e domínio.
- Conheci `@NoRepositoryBean`.
- Mantive auditoria e `@Version`.
- Mantive Flyway no DDL e Hibernate em validate.
- Não criei queries derivadas.
- Próxima aula: Queries derivadas.
```

---

## Referencia tecnica curta

```text
Repository:
marcador.

CrudRepository:
CRUD.

ListCrudRepository:
List.

JpaRepository:
JPA específica.

Proxy:
implementação runtime.

Save new:
persist.

Save existing:
merge.

Managed:
dirty checking.

Flush:
SQL, não commit.

Transaction:
fronteira do caso de uso.
```

Regra final:

```text
Spring Data JPA deve ser entendido como uma infraestrutura de repositories que delega ao EntityManager e reduz boilerplate, nao como substituto de JPA, SQL ou transacoes; save precisa ser interpretado como persist ou merge conforme o estado da entidade, o retorno deve ser respeitado e a fronteira transacional continua pertencendo ao caso de uso.
```
