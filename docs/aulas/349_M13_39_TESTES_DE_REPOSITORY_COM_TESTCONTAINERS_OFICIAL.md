# 349 - M13.39 - Testes de Repository com Testcontainers

## Apresentacao da aula

Na aula 348, você definiu a fronteira transacional dos casos de uso com Spring Data.

Foram praticados:

```text
@Transactional;

service como unidade de trabalho;

Propagation.REQUIRED;

Propagation.REQUIRES_NEW;

Propagation.MANDATORY;

rollbackFor;

noRollbackFor;

rollback-only;

UnexpectedRollbackException;

readOnly;

timeout;

isolamento;

self-invocation;

afterCommit.
```

Esses comportamentos foram executados contra um PostgreSQL local configurado manualmente.

Agora surge uma necessidade de engenharia:

```text
como executar testes de repository
em um banco real, descartável e reproduzível?
```

Testar repository apenas com mock não valida:

- mapping JPA;
- schema;
- migration;
- constraint;
- tipo PostgreSQL;
- foreign key;
- sequence;
- índice;
- JPQL;
- SQL nativo;
- paginação;
- lock;
- versão;
- auditoria;
- comportamento real do driver.

Um mock consegue afirmar:

```text
o método save foi chamado.
```

Ele não consegue provar:

```text
o INSERT é válido;

a coluna existe;

a constraint rejeita valor inválido;

o countQuery está correto;

a native query funciona no PostgreSQL;

o rollback realmente desfaz a escrita.
```

Também não é suficiente substituir PostgreSQL por H2 apenas porque os dois aceitam SQL.

Eles diferem em:

- tipos;
- funções;
- sintaxe;
- casts;
- tratamento de identificadores;
- constraints;
- sequences;
- locking;
- planos;
- JSON;
- arrays;
- timestamps;
- isolamento.

Nesta aula, você usará:

```text
Testcontainers.
```

Testcontainers cria dependências descartáveis dentro de containers.

Para o laboratório:

```text
uma imagem PostgreSQL;

porta aleatória no host;

database de teste;

usuário e senha temporários;

lifecycle controlado pela suíte;

destruição ao terminar.
```

O teste utilizará o mesmo mecanismo de produção:

```text
PostgreSQL real;

pgJDBC real;

Flyway real;

Hibernate real;

Spring Data JPA real.
```

A stack será:

```text
Java 21;

Spring Framework 7.0.8;

Spring Data BOM 2026.0.0;

Spring Data JPA 4.1.0;

JUnit 6.1.1;

Testcontainers 2.0.5;

PostgreSQL 17 em container;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0.
```

O Testcontainers 2 utiliza módulos com prefixo:

```text
testcontainers-postgresql;

testcontainers-junit-jupiter.
```

A classe do módulo PostgreSQL será importada de:

```java
org.testcontainers.postgresql.PostgreSQLContainer
```

O laboratório continuará sem Spring Boot.

Você configurará explicitamente:

- container;
- DataSource;
- Flyway;
- `EntityManagerFactory`;
- transaction manager;
- scanning de repositories;
- Spring TestContext;
- limpeza de fixtures.

O container utilizará uma imagem fixada:

```text
postgres:17.6-alpine
```

Fixar a tag torna a execução mais previsível.

Evite:

```text
postgres:latest
```

porque a suíte pode mudar de comportamento sem alteração no código.

Os testes validarão:

```text
contexto Spring inicia;

container está ativo;

porta é dinâmica;

Flyway aplica migration;

Hibernate valida o schema;

repository proxy é criado;

mapping persiste e lê;

constraints reais falham;

queries derivadas funcionam;

@Query JPQL funciona;

native query funciona;

paginação e count funcionam;

versionamento funciona;

rollback funciona;

fixtures são isoladas;

container encerra ao final.
```

A próxima aula será:

```text
350 - M13.40 - Migrations integradas com persistencia
```

Por isso, esta aula usará apenas uma migration consolidada para preparar o banco de teste.

Ficarão para a aula 350:

- evolução por múltiplas migrations;
- baseline;
- schema history em profundidade;
- migration incompatível;
- checksum;
- repair;
- callbacks;
- repetíveis;
- migração antes da aplicação;
- compatibilidade entre versões da aplicação;
- expand and contract;
- rollback de deployment;
- integração de migrations no pipeline.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
347:
Query annotation native query e JPQL.

348:
Transacoes com Spring Data.

349:
Testes de Repository com Testcontainers.

350:
Migrations integradas com persistencia.

351:
Projeto persistencia OS parte 1.
```

Até aqui, você já sabe implementar:

```text
entidades;

repositories;

queries derivadas;

JPQL;

native query;

projections;

paginação;

transações;

auditoria;

locks.
```

Nesta aula, você validará essa infraestrutura contra o banco real usado pelo sistema.

O foco será:

```text
teste de integração de persistência.
```

Não será foco:

```text
teste unitário de regra pura;

teste HTTP;

teste end-to-end de browser;

performance benchmark;

teste de caos;

produção efêmera completa.
```

Nesta aula:

```text
Docker:
pré-requisito de execução.

Testcontainers:
sim.

PostgreSQLContainer:
sim.

JUnit 6:
sim.

Spring TestContext:
sim.

Flyway:
sim.

Spring Boot:
não.

H2:
não.

mocks de repository:
não.

CI:
orientação e critérios.

migration avançada:
não.
```

A arquitetura da suíte será:

```text
JUnit
    -> base de teste
        -> PostgreSQLContainer
            -> banco descartável
                -> Flyway migrate
                    -> contexto Spring
                        -> EntityManagerFactory
                            -> repository proxy
                                -> testes reais.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-349-repository-testcontainers
```

Estrutura final:

```text
labs
└── m13
    └── aula-349-repository-testcontainers
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── docs
        │   ├── piramide-testes-persistencia.md
        │   ├── lifecycle-container.md
        │   ├── configuracao-spring-test.md
        │   ├── isolamento-fixtures.md
        │   ├── execucao-local-ci.md
        │   └── troubleshooting-testcontainers.md
        ├── scripts
        │   ├── 01_validar_docker.ps1
        │   ├── 02_executar_testes.ps1
        │   ├── 03_executar_teste_especifico.ps1
        │   └── 04_diagnosticar_ambiente.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula349
            │   │                       ├── audit
            │   │                       │   ├── AuditActor.java
            │   │                       │   ├── AuditContext.java
            │   │                       │   ├── AuditEntityListener.java
            │   │                       │   ├── AuditableEntity.java
            │   │                       │   └── AuditScope.java
            │   │                       ├── config
            │   │                       │   └── PersistenceConfig.java
            │   │                       ├── entity
            │   │                       │   ├── ClienteEntity.java
            │   │                       │   └── OrdemServicoEntity.java
            │   │                       ├── projection
            │   │                       │   └── OrdemResumoView.java
            │   │                       └── repository
            │   │                           ├── ClienteRepository.java
            │   │                           └── OrdemServicoRepository.java
            │   └── resources
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_349.sql
            └── test
                ├── java
                │   └── br
                │       └── com
                │           └── formacao
                │               └── m13
                │                   └── aula349
                │                       ├── AbstractPostgreSqlContainerIT.java
                │                       ├── ContainerLifecycleIT.java
                │                       ├── FlywaySchemaIT.java
                │                       ├── RepositoryMappingIT.java
                │                       ├── ConstraintIntegrationIT.java
                │                       ├── DerivedQueryContainerIT.java
                │                       ├── AnnotatedQueryContainerIT.java
                │                       ├── NativeQueryContainerIT.java
                │                       ├── PaginationContainerIT.java
                │                       ├── OptimisticVersionContainerIT.java
                │                       ├── TransactionRollbackContainerIT.java
                │                       ├── TestDataCleaner.java
                │                       └── TestPersistenceConfig.java
                └── resources
                    └── logback-test.xml
```

Resultados esperados:

```text
Docker disponível;

container PostgreSQL iniciado uma vez;

porta host não fixa;

database aula349_test;

migration V1 aplicada;

schema jpa_349 criado;

contexto Spring carregado;

repositories injetados;

INSERT e SELECT reais;

constraint unique validada;

foreign key validada;

query derivada validada;

JPQL validada;

native query validada;

Page e count validados;

@Version validada;

rollback validado;

zero fixtures ao final;

container encerrado.
```

---

## Conceito essencial

### Teste unitario versus integracao

Teste unitário deve validar uma unidade pequena sem infraestrutura real.

Exemplo:

```text
validação de command;

cálculo;

policy;

value object;

regra de domínio.
```

Teste de repository é integração porque depende de:

- JPA;
- provider;
- driver;
- banco;
- schema;
- transação.

Não force um repository a parecer unitário por meio de mocks.

---

### O que mock de repository testa

Um mock é útil ao testar um service isolado.

Exemplo:

```text
dado repository simulado;

quando service chama save;

então regra de coordenação foi executada.
```

Ele não valida a implementação do repository.

Portanto:

```text
service unit test:
mock pode ser adequado.

repository integration test:
banco real é necessário.
```

---

### Por que nao usar H2

H2 é um banco real, mas não é PostgreSQL.

Ele pode ser útil em determinados projetos.

Nesta formação, o objetivo é validar compatibilidade com PostgreSQL.

Uma query nativa como:

```sql
select
    char_length(o.descricao)
from jpa_349.ordem_servico o
```

pode até funcionar em mais de um banco.

Outras funcionalidades podem divergir.

O teste deve usar a tecnologia que precisa ser certificada.

---

### Container descartavel

O container possui:

```text
filesystem temporário;

processo PostgreSQL isolado;

porta mapeada;

credenciais de teste;

rede gerenciada.
```

Ao terminar, ele é removido.

Isso reduz dependência de um database local previamente configurado.

---

### Docker continua necessario

Testcontainers não implementa um runtime de containers.

Ele precisa encontrar um ambiente compatível, normalmente Docker Desktop no Windows.

Antes dos testes, confirme:

```powershell
docker version
docker info
```

O daemon precisa estar ativo.

---

### Testcontainers BOM

No Maven:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>testcontainers-bom</artifactId>
            <version>${testcontainers.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Isso mantém os módulos Testcontainers na mesma versão.

---

### Modulos 2.0

Dependências:

```xml
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

Não use os nomes antigos dos módulos da série 1.x.

---

### PostgreSQLContainer

Declaração:

```java
private static final PostgreSQLContainer POSTGRES =
        new PostgreSQLContainer(
                DockerImageName.parse(
                        "postgres:17.6-alpine"
                )
        )
                .withDatabaseName(
                        "aula349_test"
                )
                .withUsername(
                        "formacao_test"
                )
                .withPassword(
                        "formacao_test"
                );
```

A porta interna é:

```text
5432.
```

A porta no host será escolhida dinamicamente.

---

### Porta dinamica

Não assuma:

```text
localhost:5432.
```

Use:

```java
POSTGRES.getJdbcUrl();

POSTGRES.getUsername();

POSTGRES.getPassword();
```

Assim, testes paralelos e outras instalações locais não disputam uma porta fixa.

---

### Imagem fixada

Use tag específica.

Benefícios:

- previsibilidade;
- diagnóstico;
- reprodução em CI;
- atualização consciente.

Atualizar a imagem deve ser uma mudança revisada e testada.

---

### Lifecycle por classe e por suite

A extensão JUnit oferece:

```text
container static:
compartilhado pelos métodos da classe.

container de instância:
reiniciado por método.
```

Reiniciar PostgreSQL para cada método aumenta isolamento, mas torna a suíte muito lenta.

O laboratório utilizará um container compartilhado entre as classes de integração por meio de uma base singleton.

As tabelas serão limpas entre métodos.

---

### Singleton container

Base:

```java
public abstract class AbstractPostgreSqlContainerIT {

    protected static final PostgreSQLContainer POSTGRES;

    static {
        POSTGRES =
                new PostgreSQLContainer(
                        DockerImageName.parse(
                                "postgres:17.6-alpine"
                        )
                )
                        .withDatabaseName(
                                "aula349_test"
                        )
                        .withUsername(
                                "formacao_test"
                        )
                        .withPassword(
                                "formacao_test"
                        );

        POSTGRES.start();
    }
}
```

O processo da JVM encerra o recurso pelo lifecycle do Testcontainers.

Também pode existir fechamento explícito em uma suíte controlada.

---

### Extensao JUnit Jupiter

Para demonstrar a integração oficial, uma classe isolada usará:

```java
@Testcontainers
class ContainerLifecycleIT {

    @Container
    static final PostgreSQLContainer POSTGRES =
            new PostgreSQLContainer(
                    DockerImageName.parse(
                            "postgres:17.6-alpine"
                    )
            );
}
```

O fluxo principal usará a base singleton para compartilhar a mesma instância entre classes.

Não misture dois padrões no mesmo conjunto sem entender o lifecycle.

---

### Spring TestContext

A annotation:

```java
@SpringJUnitConfig(
        classes = TestPersistenceConfig.class,
        initializers =
                PostgreSqlContainerInitializer.class
)
```

combina Spring Test e JUnit Jupiter.

O initializer adicionará propriedades do container antes da criação do DataSource.

---

### ApplicationContextInitializer

Exemplo:

```java
public final class PostgreSqlContainerInitializer
        implements ApplicationContextInitializer<
                ConfigurableApplicationContext
        > {

    @Override
    public void initialize(
            ConfigurableApplicationContext context
    ) {
        TestPropertyValues.of(
                "test.jdbc.url="
                        + POSTGRES.getJdbcUrl(),
                "test.jdbc.user="
                        + POSTGRES.getUsername(),
                "test.jdbc.password="
                        + POSTGRES.getPassword()
        ).applyTo(
                context
        );
    }
}
```

Como o projeto não usa Spring Boot, prefira adicionar propriedades com APIs do Spring Core, como `MapPropertySource`, sem depender de `TestPropertyValues`.

---

### PropertySource explicito

O initializer oficial criará:

```java
Map<String, Object> properties =
        Map.of(
                "test.jdbc.url",
                POSTGRES.getJdbcUrl(),
                "test.jdbc.user",
                POSTGRES.getUsername(),
                "test.jdbc.password",
                POSTGRES.getPassword()
        );
```

Depois adicionará:

```java
context.getEnvironment()
        .getPropertySources()
        .addFirst(
                new MapPropertySource(
                        "testcontainers",
                        properties
                )
        );
```

---

### Ordem de inicializacao

A ordem será:

1. classe base inicia container;
2. initializer publica conexão;
3. configuração cria DataSource;
4. Flyway executa migration;
5. `EntityManagerFactory` inicia;
6. Hibernate valida o schema;
7. repositories são criados;
8. testes executam.

Hibernate não pode validar antes de Flyway criar as tabelas.

---

### Bean Flyway

Na configuração de teste:

```java
@Bean(
        initMethod = "migrate"
)
Flyway flyway(
        DataSource dataSource
) {
    return Flyway.configure()
            .dataSource(
                    dataSource
            )
            .locations(
                    "classpath:db/migration"
            )
            .schemas(
                    "jpa_349"
            )
            .load();
}
```

O `EntityManagerFactory` precisa depender de Flyway.

---

### DependsOn

Na factory:

```java
@Bean
@DependsOn("flyway")
LocalContainerEntityManagerFactoryBean
entityManagerFactory(
        DataSource dataSource
) {
}
```

Isso garante migration antes da validação Hibernate.

---

### Configuracao de producao e teste

A entidade e os repositories ficam em `src/main`.

A infraestrutura de teste pode substituir somente:

- URL;
- usuário;
- senha;
- pool name;
- tamanho;
- logging.

Não crie mappings diferentes para teste.

O objetivo é validar o mesmo modelo.

---

### Migration no classpath principal

A migration pertence ao código da aplicação:

```text
src/main/resources/db/migration.
```

O teste executa essa mesma migration.

Não mantenha uma cópia divergente em `src/test/resources`.

---

### Flyway clean

Não use:

```text
flyway.clean
```

como limpeza por método.

O container é descartável, mas a suíte compartilha a instância.

`clean` removeria schema e exigiria nova migration.

Use DELETE ordenado ou transações de teste.

---

### Limpeza por DELETE

Ordem:

```sql
DELETE FROM jpa_349.ordem_servico;

DELETE FROM jpa_349.cliente;
```

Quando existirem dependências, remova filhos antes dos pais.

Neste laboratório, Ordem referencia Cliente.

O cleaner usará `JdbcTemplate`.

---

### Rollback por teste

Spring TestContext pode executar testes transacionais e desfazer ao final.

Entretanto, essa técnica pode esconder o commit real e callbacks after-commit.

Para testes de repository simples, rollback automático é útil.

Para testes de commit, transação e versão, use transações explicitamente controladas.

O laboratório escolherá limpeza por fixture para tornar commits observáveis.

---

### Dados unicos

Use códigos com prefixo:

```text
CLI-JPA-349-%;

OS-JPA-349-%.
```

Cada teste pode usar um sufixo próprio.

Não dependa da ordem de execução.

---

### Testes paralelos

A extensão Testcontainers JUnit não deve ser tratada como automaticamente segura para execução paralela de todos os cenários.

Com banco compartilhado, testes paralelos podem interferir nas fixtures.

Política desta aula:

```text
integração de repository sequencial.
```

Paralelismo será habilitado somente depois de isolamento por schema, database ou container.

---

### Reuse

Testcontainers possui opções de reutilização de containers.

Não serão habilitadas no laboratório oficial.

O reuse pode acelerar execução local, mas altera o lifecycle e exige configuração do ambiente.

Para aprender o comportamento básico:

```text
container novo por execução da JVM.
```

---

### Ryuk

Testcontainers usa infraestrutura de limpeza para remover containers e recursos quando o processo termina.

Não desabilite mecanismos de limpeza sem entender o ambiente.

Em CI restrito, mudanças precisam ser justificadas e documentadas.

---

### Wait strategy

O módulo PostgreSQL já possui estratégia adequada para aguardar disponibilidade do banco.

Não use apenas:

```text
container iniciou.
```

A aplicação deve aguardar o serviço estar pronto.

Testcontainers cuida desse readiness pelo módulo.

---

### Startup timeout

Ambientes CI podem ser mais lentos.

Configure um limite explícito quando necessário:

```java
.withStartupTimeout(
        Duration.ofSeconds(
                90
        )
)
```

Não aumente indefinidamente para esconder falhas de Docker, rede ou recursos.

---

### Teste de mapping

O teste deve persistir:

```text
Cliente;

Ordem ligada ao Cliente.
```

Depois recarregar em novo contexto e confirmar:

- ID;
- código;
- status;
- foreign key;
- auditoria;
- versão;
- lazy mapping.

---

### Teste de constraint unique

Persista dois Clientes com o mesmo código.

Force:

```java
entityManager.flush();
```

Espere uma exception de integridade.

Faça rollback.

Não compare a mensagem integral do PostgreSQL.

---

### Teste de foreign key

Tente inserir uma Ordem apontando para ID de Cliente inexistente por JDBC controlado.

Espere falha de foreign key.

O teste comprova schema real.

---

### Teste de check constraint

Tente status inválido por JDBC ou bulk controlado.

Espere falha.

A entidade pode impedir o valor antes do banco; o teste de constraint deve atingir o banco conscientemente.

---

### Teste de query derivada

Valide:

```java
findByStatusOrderByCreatedAtDescIdDesc
```

Confirme:

- filtro;
- quantidade;
- ordem;
- desempate;
- SQL real.

---

### Teste de JPQL

Valide uma `@Query` com join de Cliente.

Confirme:

- aliases;
- parâmetros;
- resultados;
- uma consulta;
- ausência de erro de property path.

---

### Teste de native query

Valide uma projection baseada em:

```sql
jpa_349.ordem_servico;

jpa_349.cliente;

char_length.
```

Esse teste é uma das razões principais para usar PostgreSQL real.

---

### Teste de Page

Use:

```text
PageRequest.of(0, 3).
```

Confirme:

- content;
- totalElements;
- totalPages;
- count query;
- ordenação estável.

---

### Teste de versionamento

Cenário:

1. crie Ordem;
2. abra dois contextos;
3. carregue mesma versão;
4. confirme alteração A;
5. tente alteração B;
6. espere conflito otimista.

O container usa transações reais e duas conexões.

---

### Teste de rollback

Dentro de service transacional:

1. persista Cliente;
2. persista Ordem;
3. lance runtime exception;
4. consulte em nova transação;
5. confirme zero linhas.

Isso valida Spring, JPA, JDBC e banco juntos.

---

### Repository proxy

Confirme:

```java
AopUtils.isAopProxy(
        ordemRepository
)
```

O teste garante que o bean veio da infraestrutura Spring Data, não de uma implementação fake.

---

### Context cache

Spring TestContext pode reutilizar o mesmo `ApplicationContext` entre classes com configuração equivalente.

Isso acelera a suíte.

Evite marcar:

```java
@DirtiesContext
```

sem necessidade.

Cada novo contexto pode criar outro pool e aumentar o tempo.

---

### Pool de teste

Use pool pequeno:

```text
maximumPoolSize:
4.
```

Isso atende:

- consultas comuns;
- conflito otimista;
- transações paralelas controladas.

Feche o contexto para devolver conexões antes do encerramento do container.

---

### Logging

O `logback-test.xml` deve manter:

```text
INFO para Testcontainers;

WARN para detalhes excessivos;

SQL por inspector quando necessário.
```

Não exponha senha do container.

As credenciais são temporárias, mas logs devem continuar seguros.

---

### Ambiente local

Pré-requisitos:

```text
Docker Desktop iniciado;

acesso à imagem;

espaço em disco;

virtualização disponível;

Maven com acesso às dependências.
```

No Windows, WSL2 pode ser o backend do Docker Desktop.

---

### CI

O agente precisa:

- runtime de containers;
- permissão de acesso;
- memória;
- CPU;
- rede para baixar imagem ou registry interno;
- cache de Maven;
- timeout suficiente.

Não use:

```text
ignorar testes quando Docker falta
```

silenciosamente em um job obrigatório.

O pipeline deve falhar com diagnóstico claro.

---

### Registry corporativo

Empresas podem bloquear Docker Hub.

Nesse caso, use:

- mirror corporativo;
- image substitution;
- tag aprovada;
- credenciais do CI.

Não altere o teste para uma imagem não equivalente sem declarar compatibilidade.

---

### Testes deterministas

O container resolve dependência de banco, mas não torna todo teste determinístico automaticamente.

Ainda evite:

- horário real sem Clock;
- ordem global;
- dados compartilhados;
- sleeps;
- IDs fixos;
- dependência de teste anterior;
- consulta sem order by.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\main\java\br\com\formacao\m13\aula349\audit"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\main\java\br\com\formacao\m13\aula349\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\main\java\br\com\formacao\m13\aula349\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\main\java\br\com\formacao\m13\aula349\projection"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\main\java\br\com\formacao\m13\aula349\repository"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\test\java\br\com\formacao\m13\aula349"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-349-repository-testcontainers\src\test\resources"

Set-Location `
  "labs\m13\aula-349-repository-testcontainers"
```

---

### 2. Criar pom.xml

Defina:

```xml
<properties>
    <maven.compiler.release>21</maven.compiler.release>

    <spring.framework.version>
        7.0.8
    </spring.framework.version>

    <spring.data.bom.version>
        2026.0.0
    </spring.data.bom.version>

    <junit.version>
        6.1.1
    </junit.version>

    <testcontainers.version>
        2.0.5
    </testcontainers.version>

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
</properties>
```

Importe:

```text
spring-framework-bom;

spring-data-bom;

junit-bom;

testcontainers-bom.
```

---

### 3. Adicionar dependencias

Aplicação:

```text
spring-context;

spring-orm;

spring-tx;

spring-data-jpa;

hibernate-core;

jakarta.persistence-api;

HikariCP;

postgresql;

flyway-core;

flyway-database-postgresql.
```

Teste:

```text
spring-test;

junit-jupiter;

testcontainers-postgresql;

testcontainers-junit-jupiter;

assertj-core.
```

Não adicione:

```text
Spring Boot starter;

H2;

Mockito para repository;

embedded PostgreSQL.
```

---

### 4. Configurar Surefire

Use versão compatível com JUnit Platform 6.

Exemplo:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.5.4</version>
    <configuration>
        <useModulePath>false</useModulePath>
    </configuration>
</plugin>
```

Padronize testes de integração com sufixo:

```text
IT.
```

Configure Surefire para incluí-los neste laboratório ou use Failsafe de forma explícita.

A decisão oficial será:

```text
Surefire executa Test e IT no mvn verify.
```

---

### 5. Criar migration V1

Crie schema:

```text
jpa_349.
```

Tabelas:

```text
cliente;

ordem_servico.
```

Inclua:

- sequences;
- primary keys;
- unique de código;
- status com check;
- foreign key;
- versão;
- auditoria;
- índices em status, Cliente e createdAt.

---

### 6. Criar entidades

`ClienteEntity`:

```text
id;

codigo;

nome;

ativo;

versao;

auditoria.
```

`OrdemServicoEntity`:

```text
id;

codigo;

descricao;

status;

cliente;

versao;

auditoria.
```

A relação será:

```java
@ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
)
```

---

### 7. Criar repositories

`ClienteRepository` usa CRUD.

`OrdemServicoRepository` declara:

```java
List<OrdemServicoEntity>
findByStatusOrderByCreatedAtDescIdDesc(
        String status
);

@Query JPQL
List<OrdemServicoEntity>
findByClientName(
        String clientName
);

@Query native
List<OrdemResumoView>
findNativeSummaries(
        String status
);

Page<OrdemServicoEntity>
findByStatus(
        String status,
        Pageable pageable
);
```

Mantenha os contratos pequenos.

---

### 8. Criar PersistenceConfig.java

Configure:

```text
@EnableJpaRepositories;

@EnableTransactionManagement;

DataSource;

EntityManagerFactory;

JpaTransactionManager.
```

O DataSource lê:

```text
test.jdbc.url;

test.jdbc.user;

test.jdbc.password.
```

Hibernate:

```text
validate;

default_schema jpa_349;

statistics true;

shared cache none.
```

---

### 9. Criar TestPersistenceConfig.java

Importe `PersistenceConfig`.

Declare Flyway com:

```java
@Bean(
        initMethod = "migrate"
)
Flyway flyway(
        DataSource dataSource
) {
}
```

Garanta `@DependsOn("flyway")` na factory de teste.

Se preferir uma única configuração, separe beans por classes claras.

---

### 10. Criar base do container

```java
public abstract class AbstractPostgreSqlContainerIT {

    protected static final PostgreSQLContainer POSTGRES =
            new PostgreSQLContainer(
                    DockerImageName.parse(
                            "postgres:17.6-alpine"
                    )
            )
                    .withDatabaseName(
                            "aula349_test"
                    )
                    .withUsername(
                            "formacao_test"
                    )
                    .withPassword(
                            "formacao_test"
                    )
                    .withStartupTimeout(
                            Duration.ofSeconds(
                                    90
                            )
                    );

    static {
        POSTGRES.start();
    }
}
```

---

### 11. Criar initializer

Dentro da base ou em classe separada:

```java
public static final class Initializer
        implements ApplicationContextInitializer<
                ConfigurableApplicationContext
        > {

    @Override
    public void initialize(
            ConfigurableApplicationContext context
    ) {
        Map<String, Object> values =
                Map.of(
                        "test.jdbc.url",
                        POSTGRES.getJdbcUrl(),
                        "test.jdbc.user",
                        POSTGRES.getUsername(),
                        "test.jdbc.password",
                        POSTGRES.getPassword()
                );

        context.getEnvironment()
                .getPropertySources()
                .addFirst(
                        new MapPropertySource(
                                "testcontainers",
                                values
                        )
                );
    }
}
```

---

### 12. Anotar classes de integracao

```java
@SpringJUnitConfig(
        classes = TestPersistenceConfig.class,
        initializers =
                AbstractPostgreSqlContainerIT.Initializer.class
)
class RepositoryMappingIT
        extends AbstractPostgreSqlContainerIT {
}
```

Injete repositories, `JdbcTemplate`, `EntityManagerFactory` e transaction manager quando necessário.

---

### 13. Criar TestDataCleaner.java

Use:

```java
@Component
public class TestDataCleaner {

    private final JdbcTemplate jdbcTemplate;

    public void clean() {
        jdbcTemplate.update(
                """
                DELETE FROM jpa_349.ordem_servico
                WHERE codigo LIKE 'OS-JPA-349-%'
                """
        );

        jdbcTemplate.update(
                """
                DELETE FROM jpa_349.cliente
                WHERE codigo LIKE 'CLI-JPA-349-%'
                """
        );
    }
}
```

Execute em `@BeforeEach` e `@AfterEach`.

---

### 14. Criar ContainerLifecycleIT.java

Confirme:

```text
POSTGRES.isRunning true;

JDBC URL começa com jdbc:postgresql;

porta mapeada maior que zero;

porta não foi configurada manualmente;

databaseName correto;

conexão válida.
```

Não faça assert de uma porta específica.

---

### 15. Criar FlywaySchemaIT.java

Consulte:

```text
flyway_schema_history;

information_schema.tables;

information_schema.columns;

pg_indexes.
```

Confirme:

- V1 success;
- schema existe;
- tabelas existem;
- coluna `versao`;
- quatro colunas de auditoria;
- foreign key;
- índices.

---

### 16. Criar RepositoryMappingIT.java

Dentro de `AuditScope` e transação:

1. persista Cliente;
2. persista Ordem;
3. commit;
4. abra nova transação;
5. busque por ID;
6. valide campos.

Confirme:

```text
ID gerado;

versão 0;

auditoria;

Cliente ligado;

status ABERTA.
```

---

### 17. Criar ConstraintIntegrationIT.java

Casos:

```text
código duplicado;

status inválido;

foreign key inexistente;

created_by vazio;

versão negativa.
```

Force flush ou execute JDBC.

Capture tipo de integridade, não mensagem integral.

Faça rollback e limpe.

---

### 18. Criar DerivedQueryContainerIT.java

Crie Ordens:

```text
ABERTA;

AGENDADA;

ABERTA.
```

Execute query derivada por status.

Confirme:

- duas ABERTAS;
- ordem por createdAt e ID;
- resultado estável.

---

### 19. Criar AnnotatedQueryContainerIT.java

Crie dois Clientes.

Execute JPQL por nome do Cliente.

Confirme join e parâmetros.

Use inspector para contar SELECTs quando necessário.

---

### 20. Criar NativeQueryContainerIT.java

Execute projection nativa.

Confirme:

- aliases;
- schema;
- status;
- Cliente;
- função PostgreSQL;
- tipos retornados.

Esse teste não deve passar por uma implementação H2 escondida.

---

### 21. Criar PaginationContainerIT.java

Crie sete Ordens do mesmo status.

Página:

```text
number 0;

size 3.
```

Confirme:

```text
content 3;

totalElements 7;

totalPages 3;

hasNext true.
```

Teste a última página.

---

### 22. Criar OptimisticVersionContainerIT.java

Use duas transações independentes.

As duas carregam versão zero.

A confirma versão um.

B tenta confirmar e recebe conflito.

Confirme estado vencedor no banco.

---

### 23. Criar TransactionRollbackContainerIT.java

Crie um service transacional de teste ou reutilize uma fixture service.

Persista Cliente e Ordem.

Lance `RuntimeException`.

Em nova transação, confirme zero linhas.

Não valide apenas o estado do persistence context antigo.

---

### 24. Criar logback-test.xml

Configure saída concisa.

Mantenha logs de startup Testcontainers em nível útil.

Ative DEBUG apenas durante troubleshooting.

Não registre credenciais.

---

### 25. Criar scripts

`01_validar_docker.ps1`:

```powershell
docker version
docker info
```

Retorne erro claro se o daemon não responder.

`02_executar_testes.ps1`:

```powershell
mvn clean verify
```

`03_executar_teste_especifico.ps1`:

```powershell
mvn -Dtest=NativeQueryContainerIT test
```

`04_diagnosticar_ambiente.ps1`:

```powershell
docker version
docker info
docker system df
mvn -version
java -version
```

Não apague imagens automaticamente.

---

### 26. Executar o laboratorio

Primeiro:

```powershell
.\scripts\01_validar_docker.ps1
```

Depois:

```powershell
.\scripts\02_executar_testes.ps1
```

Confirme:

```text
imagem baixada;

container iniciado;

migration aplicada;

contexto carregado;

testes executados;

fixtures limpas;

container removido.
```

Uma primeira execução pode demorar mais por causa do download da imagem.

---

### 27. Diagnosticar falha de Docker

Se aparecer erro de ambiente:

1. confirme Docker Desktop aberto;
2. execute `docker version`;
3. execute `docker info`;
4. valide virtualização;
5. confira WSL2;
6. confira proxy;
7. confira registry;
8. confira espaço em disco;
9. execute teste específico;
10. leia causa raiz.

Não aumente timeout antes de confirmar o ambiente.

---

### 28. Diagnosticar falha de migration

Confirme:

- resource no classpath;
- nome `V1__...sql`;
- plugin PostgreSQL Flyway;
- schema;
- credenciais;
- logs;
- `flyway_schema_history`.

A factory JPA deve depender de Flyway.

---

### 29. Diagnosticar teste intermitente

Revise:

- dados globais;
- limpeza;
- ordem;
- horários;
- paralelismo;
- transações abertas;
- query sem order by;
- container compartilhado;
- context cache;
- sleeps.

Intermitência não é característica aceitável de teste de integração.

---

### 30. Criar documentacao

`piramide-testes-persistencia.md` deve comparar unitário, integração e end-to-end.

`lifecycle-container.md` deve registrar imagem, start, readiness, porta, stop e cleanup.

`configuracao-spring-test.md` deve documentar initializer, Flyway, DataSource, context cache e transaction manager.

`isolamento-fixtures.md` deve registrar prefixes, cleaner, sequência e paralelismo.

`execucao-local-ci.md` deve listar requisitos locais e do agente.

`troubleshooting-testcontainers.md` deve cobrir Docker, WSL2, registry, timeout, migration, container logs, portas e recursos.

---

## Entendendo o que foi feito

### O repository foi testado como integracao

JPA, Hibernate, driver, Flyway e PostgreSQL participaram da execução.

### O ambiente ficou descartavel

Nenhum database local precisou ser preparado manualmente.

### A migration virou parte do teste

Hibernate validou o schema criado pelo Flyway.

### PostgreSQL deixou de ser aproximado

Constraints, native query, versão e transações foram executadas no banco real.

### Isolamento continuou sendo responsabilidade da suite

Container compartilhado exigiu fixtures únicas e limpeza determinística.

---

## Erros comuns importantes

### Usar latest na imagem

A suíte pode mudar sem commit no projeto.

### Fixar porta do host

Isso causa conflito com outras execuções.

### Criar schema diferente no teste

O teste deixa de validar a aplicação real.

### Compartilhar dados entre testes

A ordem de execução passa a influenciar resultados.

### Pular testes quando Docker falha

Um pipeline obrigatório deve falhar com diagnóstico.

---

## Comandos uteis

### Docker

```powershell
docker version
docker info
docker ps
```

### Maven

```powershell
mvn clean verify
```

### Teste especifico

```powershell
mvn -Dtest=RepositoryMappingIT test
```

### Dependencias

```powershell
mvn dependency:tree
```

### Imagens locais

```powershell
docker images
```

Não remova imagens durante o laboratório sem necessidade.

---

## Exercicio guiado

### Parte 1 — Container por classe

Troque uma classe para `@Testcontainers` e `@Container`.

Compare o tempo com o singleton.

### Parte 2 — Porta aleatoria

Execute duas JVMs de teste.

Confirme portas diferentes.

### Parte 3 — Constraint nova

Adicione check de tamanho de descrição.

Crie teste que o valida.

### Parte 4 — Paralelismo

Habilite paralelismo experimental.

Observe interferência e restaure execução sequencial.

### Parte 5 — Schema por classe

Desenhe estratégia com um schema por classe para permitir paralelismo.

Não implemente migrations avançadas ainda.

### Parte 6 — Registry interno

Substitua a imagem por mirror com `asCompatibleSubstituteFor`.

Documente a política.

### Parte 7 — Context cache

Adicione `@DirtiesContext` temporariamente.

Meça o impacto e remova.

### Parte 8 — ADR

Registre:

```text
repository test usa PostgreSQL real;

Testcontainers 2.0.5;

imagem fixada;

porta dinâmica;

Flyway antes do Hibernate;

container por JVM;

fixtures por prefixo;

execução sequencial;

Docker obrigatório no job de integração;

sem H2 e sem mocks de repository.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 349 existe;
- continuidade com a aula 348 foi preservada;
- Java 21 foi mantido;
- Spring Framework 7.0.8 foi mantido;
- Spring Data BOM 2026.0.0 foi mantido;
- Spring Data JPA 4.1.0 foi mantido;
- JUnit 6.1.1 foi definido;
- Testcontainers 2.0.5 foi definido;
- Testcontainers BOM foi importado;
- módulos 2.0 foram usados;
- `testcontainers-postgresql` foi usado;
- `testcontainers-junit-jupiter` foi usado;
- pacote PostgreSQL 2.0 foi usado;
- Spring Boot não foi usado;
- H2 não foi usado;
- mock de repository não foi usado;
- PostgreSQL real foi usado;
- imagem possui tag fixa;
- latest não foi usado;
- porta host não foi fixada;
- URL veio do container;
- usuário veio do container;
- senha veio do container;
- database de teste foi definido;
- startup timeout foi limitado;
- Docker foi declarado como pré-requisito;
- lifecycle do container foi explicado;
- extension JUnit foi demonstrada;
- singleton foi adotado para a suíte;
- patterns não foram misturados sem critério;
- Spring TestContext foi usado;
- `@SpringJUnitConfig` foi usado;
- initializer foi criado;
- `MapPropertySource` foi usado;
- DataSource recebeu propriedades dinâmicas;
- Flyway foi configurado;
- migration principal foi usada;
- migration duplicada de teste não foi criada;
- Flyway executou antes do Hibernate;
- `@DependsOn` foi usado;
- Hibernate permaneceu em validate;
- schema `jpa_349` foi criado;
- schema history foi validado;
- tabelas foram validadas;
- colunas foram validadas;
- índices foram validados;
- foreign key foi validada;
- unique foi validada;
- check constraint foi validada;
- versionamento foi validado;
- auditoria foi validada;
- relationship LAZY foi preservada;
- repository proxy foi validado;
- mapping foi testado;
- INSERT real foi testado;
- SELECT real foi testado;
- query derivada foi testada;
- JPQL foi testada;
- native query foi testada;
- função PostgreSQL foi testada;
- projection foi testada;
- paginação foi testada;
- count query foi testada;
- conflito otimista foi testado;
- rollback real foi testado;
- dois contextos foram usados na concorrência;
- transação antiga não foi reutilizada;
- cleaner foi criado;
- filhos foram limpos antes dos pais;
- prefixes de fixture foram usados;
- before e after cleanup foram usados;
- testes não dependeram de ordem;
- horários foram controlados;
- queries ordenadas foram usadas;
- paralelismo ficou desabilitado;
- reuse não foi habilitado;
- mecanismos de cleanup não foram desabilitados;
- context cache foi preservado;
- `@DirtiesContext` não foi usado sem motivo;
- pool de teste foi limitado;
- logs não expuseram senha;
- scripts de Docker foram criados;
- diagnóstico local foi documentado;
- execução em CI foi documentada;
- registry corporativo foi discutido;
- falha de Docker não foi ignorada;
- primeira execução e download foram explicados;
- timeout não foi aumentado cegamente;
- teste intermitente foi tratado como defeito;
- documentação operacional foi criada;
- container foi encerrado;
- estado final não deixou fixtures;
- migrations avançadas não foram antecipadas;
- Testcontainers não foi transformado em benchmark;
- projeto final não foi antecipado;
- ponte para a aula 350 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
```

Adicione:

```powershell
git add `
  labs/m13/aula-349-repository-testcontainers
```

Commit recomendado:

```powershell
git commit -m "test(m13): validar repositories com testcontainers"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você executou testes de repository contra um PostgreSQL descartável.

Aprendeu:

```text
Testcontainers:
dependência real em container.

PostgreSQLContainer:
banco de teste.

Docker:
runtime necessário.

porta dinâmica:
isolamento.

Flyway:
schema real.

Spring TestContext:
contexto de integração.

cleaner:
isolamento de fixtures.

repository test:
integração, não mock.
```

O laboratório comprovou:

```text
container ativo;

conexão dinâmica;

migration aplicada;

Hibernate validate;

repository proxy;

mapping;

constraints;

query derivada;

JPQL;

native query;

Page;

versão;

rollback;

limpeza.
```

A decisão arquitetural foi:

```text
repository:
testado em PostgreSQL real.

imagem:
tag fixa.

lifecycle:
container por JVM.

schema:
mesma migration da aplicação.

isolamento:
fixtures únicas e cleanup.

CI:
Docker obrigatório e falha explícita.

H2:
não usado como substituto.
```

A próxima aula será:

```text
350 - M13.40 - Migrations integradas com persistencia
```

Nela, você aprenderá:

- sequência real de migrations;
- criação e evolução do schema;
- `flyway_schema_history`;
- versioned migrations;
- repeatable migrations;
- checksum;
- validation;
- migration falha;
- repair com critério;
- baseline;
- callbacks;
- dados de referência;
- compatibilidade entre aplicação e banco;
- expand and contract;
- deploy sem indisponibilidade;
- integração do Flyway no startup;
- integração no pipeline;
- testes de migration com Testcontainers;
- rollback operacional.

A aula 349 provou que uma migration cria um banco válido.

A aula 350 mostrará como evoluir esse banco com segurança ao longo das versões da aplicação.

---

# Material complementar

## Checkpoint final

- [ ] Executei PostgreSQL real em Testcontainers.
- [ ] Apliquei a migration da aplicação antes do Hibernate.
- [ ] Testei mapping, constraints e queries reais.
- [ ] Isolei fixtures sem depender da ordem.
- [ ] Documentei execução local e CI.

---

## Troubleshooting adicional

### Docker environment was not found

Inicie Docker Desktop e valide `docker info`.

### Container startup failed

Confira imagem, registry, rede, disco e logs.

### Hibernate encontrou tabela ausente

Flyway não executou antes da factory JPA.

### Teste passa sozinho e falha na suite

Revise fixture compartilhada, paralelismo e cleanup.

### Native query falhou

Confirme schema, aliases, tipos e PostgreSQL real.

---

## Perguntas de revisao

1. Por que repository test é integração?
2. Mock valida SQL?
3. H2 é igual a PostgreSQL?
4. O que Testcontainers fornece?
5. Docker ainda é necessário?
6. Por que fixar a imagem?
7. Pode fixar a porta host?
8. Como obter a JDBC URL?
9. Quando Flyway deve rodar?
10. Por que Hibernate usa validate?
11. Onde ficam as migrations?
12. Como limpar fixtures?
13. Por que usar prefixos?
14. Container por método é sempre melhor?
15. O que faz o context cache?
16. Reuse foi habilitado?
17. Testes paralelos foram habilitados?
18. O que o teste native comprova?
19. Spring Boot foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Depende de várias tecnologias reais.
2. Não.
3. Não.
4. Dependências descartáveis em containers.
5. Sim.
6. Para reprodução.
7. Não.
8. Pelo container.
9. Antes do EntityManagerFactory.
10. Para conferir o schema.
11. Em resources da aplicação.
12. DELETE ordenado ou transação adequada.
13. Para isolamento.
14. Não; pode ser lento.
15. Reutiliza contexto Spring.
16. Não.
17. Não.
18. Compatibilidade física com PostgreSQL.
19. Não.
20. Migrations integradas com persistencia.

---

## Desafio opcional

Crie:

```java
RepositoryIntegrationTestPolicyVerifier
```

Entrada:

```text
classe de teste;

dependências;

container;

imagem;

configuração Spring;

migrations;

cleanup.
```

Saída:

```text
PASS;

WARN;

FAIL;

relatório Markdown.
```

Regras:

- reprovar H2 como substituto declarado do PostgreSQL;
- alertar imagem latest;
- alertar porta fixa;
- exigir migration principal;
- exigir cleanup;
- alertar `@DirtiesContext`;
- alertar paralelismo com database compartilhado;
- alertar repository mockado;
- não iniciar Docker;
- possuir testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 349 - M13.39 - Testes de Repository com Testcontainers

- Diferenciei teste unitário de teste de integração.
- Entendi que mock não valida repository.
- Evitei substituir PostgreSQL por H2.
- Usei Testcontainers 2.0.5.
- Usei JUnit 6.1.1.
- Usei `testcontainers-postgresql`.
- Usei `testcontainers-junit-jupiter`.
- Usei `PostgreSQLContainer` do pacote 2.0.
- Fixei uma tag de imagem PostgreSQL.
- Evitei `latest`.
- Usei porta dinâmica.
- Obtive JDBC URL, usuário e senha do container.
- Mantive Docker como pré-requisito.
- Conheci `@Testcontainers` e `@Container`.
- Adotei container compartilhado por JVM.
- Usei Spring TestContext.
- Usei `@SpringJUnitConfig`.
- Criei initializer com `MapPropertySource`.
- Configurei DataSource dinamicamente.
- Executei Flyway antes do Hibernate.
- Reutilizei a migration da aplicação.
- Mantive Hibernate em `validate`.
- Validei schema history.
- Validei tabelas, colunas, foreign keys e índices.
- Testei mapping real.
- Testei unique e check constraints.
- Testei query derivada.
- Testei JPQL.
- Testei native query PostgreSQL.
- Testei projection.
- Testei paginação e count.
- Testei `@Version` com duas transações.
- Testei rollback real.
- Criei cleaner de fixtures.
- Limpei filhos antes dos pais.
- Usei prefixos exclusivos.
- Evitei dependência da ordem de testes.
- Mantive execução sequencial.
- Não habilitei container reuse.
- Preservei o context cache.
- Criei scripts para validar Docker.
- Documentei execução local e CI.
- Mantive Spring sem Boot.
- Não antecipei migrations avançadas.
- Próxima aula: Migrations integradas com persistencia.
```

---

## Referencia tecnica curta

```text
Testcontainers:
infra descartável.

PostgreSQLContainer:
banco real.

Docker:
runtime.

Image tag:
reprodução.

Dynamic port:
isolamento.

Flyway:
schema.

Validate:
mapping versus banco.

Cleaner:
fixtures.

Repository test:
integração.

CI:
Docker obrigatório.
```

Regra final:

```text
repositories Spring Data devem ser validados como integracao contra o mesmo PostgreSQL usado pelo sistema; Testcontainers fornece um banco descartavel com imagem fixada e porta dinamica, Flyway deve criar o schema antes do Hibernate validate e a suite precisa controlar lifecycle, fixtures, transacoes, logs e requisitos de Docker local e de CI sem recorrer a mocks ou a um banco in-memory incompatível.
```
