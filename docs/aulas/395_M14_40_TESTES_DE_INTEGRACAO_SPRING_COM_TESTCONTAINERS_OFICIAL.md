# 395 - M14.40 - Testes de integração Spring com Testcontainers

## Apresentação da aula

Na aula 394, você testou um service Spring como uma classe Java comum.

O fluxo ficou:

```text
JUnit 5;

MockitoExtension;

service real;

JavaMailSender mockado;

Clock fixo;

NotificationIdGenerator mockado;

resultado;

exceptions;

verificações de interação.
```

Aquela aula respondeu:

```text
como comprovar regras e colaborações
de um service
sem iniciar o Spring
e sem acessar infraestrutura?
```

O teste unitário foi rápido e determinístico.

Porém, ele não comprovou que:

- o Spring cria os beans corretamente;
- o profile de teste carrega;
- o datasource conecta;
- o PostgreSQL aceita o schema;
- o Flyway aplica as migrations;
- o Hibernate conversa com o banco real;
- o repository executa SQL válido;
- as constraints existem;
- uma transação realmente confirma ou faz rollback;
- tipos específicos do PostgreSQL funcionam.

Mocks não conseguem responder essas perguntas.

A pergunta central desta aula será:

```text
como executar um teste de integração
com o ApplicationContext real
e um PostgreSQL descartável,
sem depender de um banco instalado manualmente?
```

A solução utilizará:

```text
@SpringBootTest;

Testcontainers;

JUnit Jupiter;

PostgreSQLContainer;

@Container;

@ServiceConnection;

Flyway;

JdbcTemplate;

Spring Data JPA;

transações reais;

Docker.
```

O Testcontainers iniciará um PostgreSQL em Docker para a classe de teste.

O fluxo será:

```text
JUnit inicia a classe;

Testcontainers cria o container;

PostgreSQL fica pronto;

@ServiceConnection fornece
os dados de conexão ao Spring Boot;

ApplicationContext inicia;

DataSource conecta no container;

Flyway aplica migrations;

JPA e repositories são criados;

testes executam;

container é encerrado.
```

A base não será:

- banco local compartilhado;
- H2 fingindo ser PostgreSQL;
- schema criado manualmente pelo desenvolvedor;
- datasource fixo na porta 5432;
- banco de homologação;
- banco reaproveitado entre builds.

Cada execução começa com uma infraestrutura descartável.

A imagem oficial da baseline será:

```text
postgres:17.6-alpine
```

Ela será fixada explicitamente no teste.

Não use:

```text
postgres:latest.
```

A porta publicada no host será escolhida dinamicamente pelo Testcontainers.

O teste não pode presumir:

```text
localhost:5432.
```

O Spring Boot receberá a conexão por `@ServiceConnection`.

Essa annotation transforma os detalhes do container em connection details usados pela auto-configuração.

Assim, você não precisará escrever manualmente:

```text
spring.datasource.url;
spring.datasource.username;
spring.datasource.password.
```

A classe principal do laboratório será:

```text
ManagedRuntimeMessagePostgreSqlIT
```

Ela usará:

```text
@SpringBootTest(
    webEnvironment = NONE
)
```

O contexto da aplicação será real.

O servidor HTTP não será iniciado porque o objetivo é integrar:

- Spring;
- datasource;
- Flyway;
- JPA;
- repository;
- application service;
- PostgreSQL.

A camada web não será o foco.

A baseline validará quatro comportamentos:

1. conexão realmente aponta para PostgreSQL;
2. migrations foram aplicadas;
3. criação e leitura persistem dados reais;
4. uma falha dentro de transação faz rollback.

Os testes não serão anotados globalmente com:

```text
@Transactional.
```

Uma transação automática ao redor de cada teste poderia mascarar commits e listeners vinculados a fases transacionais.

A limpeza será explícita antes de cada cenário.

O projeto já possui tabelas da feature principal e da auditoria de eventos:

```text
managed_runtime_message;

managed_runtime_message_event_audit.
```

A limpeza ocorrerá na ordem correta ou com `TRUNCATE ... CASCADE`.

A próxima aula será:

```text
396 - M14.41 - Testes de contrato introdução
```

Por isso, esta aula não comparará OpenAPI, não validará compatibilidade entre versões e não criará consumer-driven contracts.

Também não serão adicionados:

- RedisContainer;
- Mailpit em container;
- browser;
- servidor HTTP real;
- mocks de controller;
- testes de carga;
- paralelismo avançado;
- reutilização global de containers;
- pipeline completo.

O objetivo é dominar uma integração real e pequena com PostgreSQL.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
391:
Scheduler.

392:
Email e notificação simples.

393:
Testes de controller com MockMvc.

394:
Testes de service em Spring.

395:
Testes de integração Spring com Testcontainers.

396:
Testes de contrato introdução.

397:
Observabilidade inicial com Actuator.
```

A aula 394 respondeu:

```text
o service toma a decisão correta
quando suas dependências
são controladas?
```

A aula 395 responderá:

```text
Spring, Flyway, JPA e PostgreSQL
funcionam realmente juntos?
```

Nesta aula:

```text
@SpringBootTest:
sim.

ApplicationContext:
sim.

Testcontainers:
sim.

PostgreSQL real:
sim.

Docker:
sim.

@ServiceConnection:
sim.

Flyway:
sim.

JPA:
sim.

repository:
sim.

transação:
sim.

rollback:
sim.

servidor HTTP:
não.

Redis real:
não.

SMTP real:
não.

contrato:
não.

observabilidade:
não.
```

A regra central será:

```text
teste de integração usa
componentes reais nas fronteiras importantes;

o ambiente é descartável,
reproduzível e controlado pelo teste.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
ManagedRuntimeMessagePostgreSqlIT
```

executando contra PostgreSQL real em container.

A classe deverá comprovar:

```text
database product:
PostgreSQL.

Flyway:
migrations aplicadas.

create:
linha persistida.

read:
valor recuperado.

event audit:
linha criada quando aplicável.

rollback:
nenhuma linha confirmada.
```

Você irá:

1. adicionar dependências de Testcontainers;
2. criar um `PostgreSQLContainer`;
3. usar `@Testcontainers`;
4. usar `@Container`;
5. usar `@ServiceConnection`;
6. iniciar o contexto com `@SpringBootTest`;
7. impedir servidor web;
8. limpar o banco explicitamente;
9. verificar Flyway;
10. persistir pelo application service;
11. consultar pelo service e pelo JDBC;
12. criar uma probe transacional de rollback;
13. executar repetidamente;
14. commitar.

Estrutura:

```text
src/test/java/br/com/formacao/backend
└── integration
    └── postgres
        ├── ManagedRuntimeMessagePostgreSqlIT.java
        └── TransactionRollbackProbe.java
```

Não será criado um framework interno de testes.

Uma classe simples é suficiente para esta etapa.

---

## Conceito essencial

### O que é teste de integração

Teste de integração comprova que componentes reais colaboram corretamente.

Nesta aula, a integração inclui:

```text
Spring Boot;

configuração;

DataSource;

Flyway;

Hibernate;

Spring Data JPA;

application service;

repository;

PostgreSQL.
```

O teste não substitui todas essas partes por mocks.

A pergunta deixa de ser:

```text
o service chamou o repository?
```

E passa a ser:

```text
o service persistiu corretamente
no PostgreSQL configurado pelo Spring?
```

---

### Por que não usar banco instalado manualmente

Um PostgreSQL local compartilhado cria diferenças:

- porta;
- versão;
- usuário;
- senha;
- banco existente;
- schema sujo;
- extensions;
- timezone;
- dados anteriores;
- permissões.

O teste passa na máquina de uma pessoa e falha em outra.

Com Testcontainers:

```text
a versão fica no código de teste;

o banco nasce para o teste;

a porta é dinâmica;

o estado é descartável;

o build controla o ciclo de vida.
```

---

### Por que não usar H2

H2 é um banco útil em alguns contextos.

Porém, ele não é PostgreSQL.

Diferenças podem aparecer em:

- tipos;
- funções;
- sequences;
- identity;
- constraints;
- SQL;
- timezone;
- JSON;
- arrays;
- locking;
- índices;
- migrations.

Se a produção usa PostgreSQL e a integração precisa validar persistência real:

```text
teste com PostgreSQL.
```

Não configure Hibernate para “imitar” PostgreSQL em outro banco e chame isso de equivalência completa.

---

### Testcontainers

Testcontainers é uma biblioteca Java que gerencia containers durante testes.

Ela oferece:

- lifecycle;
- espera pela disponibilidade;
- portas dinâmicas;
- logs;
- módulos específicos;
- integração com JUnit;
- cleanup.

A aplicação do teste usa o serviço do container como qualquer outra dependência externa.

---

### Docker continua necessário

Testcontainers não implementa um banco em memória.

Ele solicita que um runtime de containers execute a imagem.

No laboratório:

```text
Docker Desktop ou Docker Engine
precisa estar disponível.
```

Se Docker não estiver acessível, a integração deve falhar de forma clara.

A pipeline oficial que executa esses testes também precisa oferecer runtime compatível.

---

### @Testcontainers

A annotation:

```java
@Testcontainers
```

ativa a extension JUnit Jupiter do Testcontainers.

Ela gerencia campos anotados com:

```text
@Container.
```

O container será iniciado antes dos testes que dependem dele e encerrado no final do lifecycle definido.

---

### Container estático

Exemplo:

```java
@Container
static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>(
                DockerImageName.parse(
                        "postgres:17.6-alpine"
                )
        );
```

Campo estático:

```text
um container compartilhado
entre os métodos da classe.
```

Campo de instância:

```text
um container por método.
```

A baseline usa estático porque:

- startup de PostgreSQL possui custo;
- a classe limpa o estado entre testes;
- todos usam a mesma versão;
- o lifecycle continua limitado à classe.

Compartilhar container não significa compartilhar dados sem limpeza.

---

### @ServiceConnection

A annotation será:

```java
@ServiceConnection
```

Ela informa ao Spring Boot que o container fornece um serviço para a aplicação.

Para `PostgreSQLContainer`, o Boot consegue produzir connection details para JDBC.

Esses detalhes têm precedência sobre properties de conexão comuns.

Resultado:

```text
DataSource usa host dinâmico;

porta dinâmica;

database;

username;

password.
```

O teste não precisa copiar getters do container para o Environment.

---

### DynamicPropertySource

Outra estratégia comum é:

```java
@DynamicPropertySource
```

com:

```text
postgres.getJdbcUrl();
postgres.getUsername();
postgres.getPassword().
```

Ela continua válida quando:

- não existe service connection adequada;
- properties customizadas precisam ser registradas;
- a integração não é reconhecida automaticamente.

A baseline prefere `@ServiceConnection` porque o Spring Boot conhece PostgreSQLContainer.

Não implemente as duas estratégias simultaneamente.

---

### @SpringBootTest

`@SpringBootTest` procura a configuração principal da aplicação e cria um contexto amplo.

A baseline usa:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.NONE
)
```

Isso carrega services, repositories e infraestrutura da aplicação, mas não inicia servidor web.

O teste de controller da aula 393 utilizou um slice.

Aqui o contexto amplo é intencional.

---

### @ActiveProfiles

Use:

```java
@ActiveProfiles("test")
```

O profile de teste deve:

- evitar scheduler;
- evitar Mailpit;
- não ativar cache Redis;
- usar logging controlado;
- permitir que a service connection forneça o datasource.

Não configure H2 no profile de integração.

Se `application-test.yaml` define uma URL H2, `@ServiceConnection` deve substituí-la, mas manter duas estratégias concorrentes dificulta leitura. Remova a dependência H2 quando não for necessária ao projeto.

---

### Flyway no startup

Quando o contexto inicia:

```text
DataSource conecta;

Flyway lê db/migration;

migrations são aplicadas;

Hibernate valida ou utiliza o schema.
```

O container nasce vazio.

Isso comprova que uma aplicação nova consegue criar o banco a partir das migrations versionadas.

Não prepare as tabelas manualmente no teste.

---

### ddl-auto

A baseline deve manter:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

Flyway cria o schema.

Hibernate valida os mappings.

Não use:

```text
create;
create-drop;
update.
```

Esses modos podem esconder migrations incompletas.

---

### Limpeza de estado

O container é compartilhado entre métodos.

O estado precisa ser limpo.

Use:

```sql
truncate table
    managed_runtime_message_event_audit,
    managed_runtime_message
restart identity cascade;
```

A limpeza ocorre em `@BeforeEach`.

Não use dados deixados por outro teste.

Não dependa da ordem dos métodos.

---

### @Transactional no teste

Quando um teste é anotado com `@Transactional`, o Spring normalmente inicia uma transação e faz rollback no final.

Isso pode ser útil.

Porém, pode esconder:

- commit real;
- `AFTER_COMMIT`;
- comportamento fora da transação de teste;
- flush tardio;
- boundary do application service.

A baseline não coloca `@Transactional` na classe.

Cada método da aplicação usa sua transação normal.

A limpeza explícita mantém isolamento.

---

### Flush e commit

JPA pode adiar SQL até:

- flush;
- commit;
- query que exige sincronização.

Um teste de integração precisa compreender essa diferença.

Quando o application service retorna após um método `@Transactional`:

```text
a transação já confirmou,
salvo exception.
```

Uma consulta JDBC depois disso consegue observar a linha.

---

### Verificação por duas perspectivas

No teste de criação:

```text
application service:
prova comportamento público da aplicação.

JdbcTemplate:
prova estado real no banco.
```

Não use apenas:

```text
service.create;
service.findById.
```

Os dois métodos poderiam compartilhar o mesmo bug.

Uma consulta independente ao banco aumenta confiança.

Não transforme todo teste em SQL duplicado.

Use uma verificação pequena e relevante.

---

### Rollback real

Para comprovar rollback, crie uma probe Spring:

```text
abre transação;

chama criação;

lança exception;

transação faz rollback.
```

Depois, consulte o banco fora da transação que falhou.

Resultado:

```text
zero linhas confirmadas.
```

A probe existe somente em `src/test`.

Ela não entra no jar de produção.

---

### @TestConfiguration

Uma classe de configuração de teste pode registrar a probe.

Exemplo:

```java
@TestConfiguration(
        proxyBeanMethods = false
)
class IntegrationTestConfiguration {
}
```

Ela é importada somente pelo teste.

Não adicione a probe em `src/main/java`.

---

### Constraints reais

O PostgreSQL aplica:

- primary keys;
- unique constraints;
- check constraints;
- not null;
- foreign keys.

Um mock de repository não executa essas regras.

A integração pode provar uma constraint relevante.

A baseline principal ficará em create, read, migration e rollback para não transformar a aula em catálogo de todas as constraints.

---

### Container reuse

Testcontainers possui mecanismos de reutilização.

A baseline oficial não usa:

```java
.withReuse(true)
```

Motivos:

- estado pode sobreviver;
- execução perde isolamento;
- CI pode se comportar diferente;
- configuração externa é necessária;
- diagnóstico fica mais difícil.

O container estático por classe já reduz custo suficiente para esta etapa.

---

### Paralelismo

Se testes alteram as mesmas tabelas e fazem `TRUNCATE`, execução paralela pode causar conflito.

A baseline não habilita paralelismo para esta classe.

Primeiro garanta:

```text
isolamento;
determinismo;
clareza.
```

Paralelismo exige banco por classe, schema por teste ou estratégia equivalente.

---

### Nome IT

A classe termina em:

```text
IT.
```

Isso comunica:

```text
integration test.
```

O Maven Surefire, por default, pode não selecionar `*IT` em todos os projetos.

Nesta aula, o comando usa:

```text
-Dtest=ManagedRuntimeMessagePostgreSqlIT
```

Em uma evolução de build, o Failsafe pode executar `*IT` em uma fase dedicada.

Essa separação não será aprofundada agora.

---

## Mão na massa guiada

### 1. Confirmar Docker

Execute:

```powershell
docker version
```

Depois:

```powershell
docker info
```

O daemon precisa responder.

Não inicie manualmente um PostgreSQL para o teste.

---

### 2. Adicionar dependências

No `pom.xml`, em `test`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-testcontainers</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>
```

Mantenha também:

```text
spring-boot-starter-test.
```

Não fixe versões.

O dependency management do Spring Boot controla a linha compatível.

---

### 3. Inspecionar dependências

Execute:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dscope=test" `
  "-Dincludes=org.springframework.boot:spring-boot-testcontainers,org.testcontainers:*"
```

Confirme:

```text
spring-boot-testcontainers;

junit-jupiter;

postgresql;

testcontainers core.
```

---

### 4. Preparar application-test.yaml

Mantenha:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate

  cache:
    type: none

app:
  scheduler:
    stored-file-cleanup:
      enabled: false

  notification:
    email:
      enabled: false
```

Não ative:

```text
cache-redis;
mail-lab.
```

Não configure uma porta fixa de PostgreSQL para essa integração.

---

### 5. Criar a classe de integração

Arquivo:

```text
ManagedRuntimeMessagePostgreSqlIT.java
```

Estrutura:

```java
package br.com.formacao.backend.integration
        .postgres;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation
        .Autowired;
import org.springframework.boot.test.context
        .SpringBootTest;
import org.springframework.boot.testcontainers
        .service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context
        .ActiveProfiles;

import org.testcontainers.containers
        .PostgreSQLContainer;
import org.testcontainers.junit.jupiter
        .Container;
import org.testcontainers.junit.jupiter
        .Testcontainers;
import org.testcontainers.utility
        .DockerImageName;

@Testcontainers
@ActiveProfiles(
        "test"
)
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.NONE,
        properties = {
            "app.scheduler.stored-file-cleanup.enabled=false",
            "app.notification.email.enabled=false",
            "spring.cache.type=none"
        }
)
class ManagedRuntimeMessagePostgreSqlIT {
}
```

Não use RANDOM_PORT.

---

### 6. Declarar o container

Dentro da classe:

```java
@Container
@ServiceConnection
static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>(
                DockerImageName.parse(
                        "postgres:17.6-alpine"
                )
        )
        .withDatabaseName(
                "formacao_integration"
        )
        .withUsername(
                "formacao"
        )
        .withPassword(
                "formacao"
        );
```

Essas credenciais existem somente dentro do container descartável.

Não reutilize credentials reais.

---

### 7. Injetar componentes reais

Adicione:

```java
@Autowired
JdbcTemplate jdbcTemplate;

@Autowired
ManagedRuntimeMessageApplicationService
        applicationService;

@Autowired
Flyway flyway;
```

Imports:

```java
import org.flywaydb.core.Flyway;
```

O service e repositories são reais.

---

### 8. Limpar antes de cada cenário

```java
@BeforeEach
void cleanDatabase() {

    jdbcTemplate.execute(
            """
            truncate table
                managed_runtime_message_event_audit,
                managed_runtime_message
            restart identity cascade
            """
    );
}
```

Se a migration atual usa outro nome físico, mantenha o nome oficial da migration do projeto.

A regra permanece:

```text
audit primeiro;
recurso depois;
ou CASCADE.
```

---

### 9. Comprovar PostgreSQL real

```java
@Test
void shouldConnectToPostgreSql()
        throws Exception {

    try (
        Connection connection =
                jdbcTemplate
                        .getDataSource()
                        .getConnection()
    ) {
        String productName =
                connection
                        .getMetaData()
                        .getDatabaseProductName();

        assertThat(
                productName
        ).isEqualTo(
                "PostgreSQL"
        );
    }
}
```

Esse teste falharia se o contexto usasse H2.

---

### 10. Comprovar migrations

```java
@Test
void shouldApplyFlywayMigrations() {

    MigrationInfo[] applied =
            flyway
                .info()
                .applied();

    assertThat(
            applied
    ).isNotEmpty();

    Integer messageTable =
            jdbcTemplate.queryForObject(
                    """
                    select count(*)
                    from information_schema.tables
                    where table_schema = 'public'
                      and table_name =
                          'managed_runtime_message'
                    """,
                    Integer.class
            );

    assertThat(
            messageTable
    ).isEqualTo(
            1
    );
}
```

Não crie tabela no teste.

A migration precisa fazer isso.

---

### 11. Testar create e read

Utilize o command já existente no projeto:

```java
@Test
void shouldPersistAndReadManagedRuntimeMessage() {

    ManagedRuntimeMessage created =
            applicationService.create(
                    new CreateManagedRuntimeMessageCommand(
                            "Testcontainers",
                            "Integracao real com PostgreSQL"
                    )
            );

    ManagedRuntimeMessage found =
            applicationService.findById(
                    created.id()
            );

    assertThat(
            found.id()
    ).isEqualTo(
            created.id()
    );

    assertThat(
            found.value()
    ).isEqualTo(
            "Testcontainers"
    );

    assertThat(
            found.description()
    ).isEqualTo(
            "Integracao real com PostgreSQL"
    );

    Integer rowCount =
            jdbcTemplate.queryForObject(
                    """
                    select count(*)
                    from managed_runtime_message
                    where id = ?
                      and value = ?
                    """,
                    Integer.class,
                    created.id(),
                    "Testcontainers"
            );

    assertThat(
            rowCount
    ).isEqualTo(
            1
    );
}
```

Mantenha os nomes reais dos commands e resultados construídos nas aulas de CRUD.

O comportamento esperado é o mesmo.

---

### 12. Verificar auditoria do evento

Como a aplicação já possui listener de auditoria transacional:

```java
Integer auditCount =
        jdbcTemplate.queryForObject(
                """
                select count(*)
                from managed_runtime_message_event_audit
                where resource_id = ?
                  and event_type = 'CREATED'
                """,
                Integer.class,
                created.id()
        );

assertThat(
        auditCount
).isEqualTo(
        1
);
```

Esse teste comprova integração entre:

- service;
- evento;
- listener síncrono;
- JPA;
- PostgreSQL.

Não valide o log pós-commit nesse mesmo método.

---

### 13. Criar a probe de rollback

Arquivo:

```text
TransactionRollbackProbe.java
```

Conteúdo:

```java
package br.com.formacao.backend.integration
        .postgres;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation
        .Transactional;

@Component
class TransactionRollbackProbe {

    private final ManagedRuntimeMessageApplicationService
            applicationService;

    TransactionRollbackProbe(
            ManagedRuntimeMessageApplicationService
                    applicationService
    ) {
        this.applicationService =
                applicationService;
    }

    @Transactional
    void createThenFail() {

        applicationService.create(
                new CreateManagedRuntimeMessageCommand(
                        "Rollback",
                        "Esta linha nao pode confirmar"
                )
        );

        throw new IllegalStateException(
                "forced rollback"
        );
    }
}
```

Como a classe está em `src/test`, ela não entra na aplicação de produção.

Para garantir scan no teste, importe-a explicitamente.

---

### 14. Importar a probe

Na classe de integração:

```java
@Import(
        TransactionRollbackProbe.class
)
```

Injete:

```java
@Autowired
TransactionRollbackProbe
        rollbackProbe;
```

Não mova a probe para `src/main/java`.

---

### 15. Testar rollback

```java
@Test
void shouldRollbackDatabaseChangesWhenTransactionFails() {

    assertThatThrownBy(
            () ->
                    rollbackProbe
                            .createThenFail()
    )
    .isInstanceOf(
            IllegalStateException.class
    )
    .hasMessage(
            "forced rollback"
    );

    Integer messages =
            jdbcTemplate.queryForObject(
                    """
                    select count(*)
                    from managed_runtime_message
                    where value = 'Rollback'
                    """,
                    Integer.class
            );

    Integer audits =
            jdbcTemplate.queryForObject(
                    """
                    select count(*)
                    from managed_runtime_message_event_audit
                    where event_type = 'CREATED'
                    """,
                    Integer.class
            );

    assertThat(
            messages
    ).isZero();

    assertThat(
            audits
    ).isZero();
}
```

A entity e a auditoria participam da mesma transação.

---

### 16. Não anotar o teste com @Transactional

Confirme ausência de:

```java
@Transactional
class ManagedRuntimeMessagePostgreSqlIT {
}
```

O teste precisa observar commits reais do application service.

A probe controla somente o cenário de rollback.

---

### 17. Executar a integração

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePostgreSqlIT `
  test
```

Na primeira execução, Docker pode baixar a imagem.

As próximas utilizam o cache local de imagem.

Não confunda download da imagem com lentidão permanente do teste.

---

### 18. Observar o lifecycle

Durante a execução, em outro terminal:

```powershell
docker ps `
  --filter "ancestor=postgres:17.6-alpine"
```

O container existe enquanto a classe está ativa.

No final:

```powershell
docker ps -a `
  --filter "ancestor=postgres:17.6-alpine"
```

O cleanup do Testcontainers remove o container conforme o lifecycle.

Não dependa de nome fixo.

---

### 19. Provar porta dinâmica

Adicione temporariamente um log de teste:

```java
System.out.println(
        postgres.getJdbcUrl()
);
```

Observe que a porta não precisa ser 5432 no host.

Remova o `System.out` depois.

A aplicação recebe os details por `@ServiceConnection`.

---

### 20. Executar repetidamente

```powershell
1..3 | ForEach-Object {

    .\mvnw.cmd `
      -q `
      -Dtest=ManagedRuntimeMessagePostgreSqlIT `
      test

    if ($LASTEXITCODE -ne 0) {
        throw "Integration execution $_ failed"
    }
}
```

Cada execução cria infraestrutura limpa.

---

### 21. Executar unitários e integração

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,SimpleEmailNotificationServiceTest,ManagedRuntimeMessagePostgreSqlIT" `
  test
```

Agora existem três níveis:

```text
controller:
HTTP isolado.

service:
unidade.

integração:
Spring + PostgreSQL.
```

---

### 22. Inspecionar falhas de migration

Para exercício, crie temporariamente uma migration inválida em uma branch de laboratório.

Execute a integração.

O `ApplicationContext` deve falhar no startup.

Remova a migration inválida.

Não configure:

```text
spring.flyway.enabled=false
```

apenas para deixar o teste verde.

---

### 23. Revisar ausência de infraestrutura indevida

A integração desta aula não precisa de:

- Redis;
- Mailpit;
- filesystem externo;
- porta HTTP;
- browser.

Se o contexto exigir esses componentes, revise:

- profiles;
- conditional beans;
- configurações da aula 388;
- configuração de e-mail;
- scheduler.

O ApplicationContext de integração precisa carregar somente dependências necessárias ou corretamente desabilitadas.

---

## Entendendo o que foi feito

### O banco real entrou no teste

PostgreSQL executou migrations, constraints e SQL reais.

### O ambiente ficou descartável

Não existe banco manual compartilhado.

### A conexão ficou dinâmica

`@ServiceConnection` entregou os details ao Spring Boot.

### O contexto foi amplo, mas sem servidor

Services, JPA e migrations participaram.

HTTP ficou fora.

### O estado foi limpo explicitamente

Os testes não dependem de ordem.

### O commit real foi observado

A classe não possui transação externa automática.

### O rollback foi comprovado

A probe lançou exception e nenhuma linha confirmou.

### Os níveis de teste ficaram complementares

Mocks não foram abandonados.

Eles continuam adequados para controller e service.

---

## Erros comuns importantes

### Usar banco de desenvolvimento

Dados e schema compartilhados tornam o teste imprevisível.

### Usar porta fixa

Testcontainers publica porta dinâmica.

### Configurar datasource manual e @ServiceConnection juntos

Duas fontes de verdade dificultam diagnóstico.

### Usar postgres:latest

O teste muda sem alteração no código.

### Desabilitar Flyway

O teste deixa de validar o startup real.

### Usar ddl-auto=create

Hibernate pode esconder migration faltante.

### Deixar dados entre métodos

O resultado passa a depender da ordem.

### Colocar @Transactional na classe sem entender

Commit e AFTER_COMMIT podem ficar mascarados.

### Usar withReuse(true) no build oficial

Estado pode sobreviver entre execuções.

### Tratar integração como substituta dos unitários

Feedback fica lento e falhas menos localizadas.

---

## Comandos úteis

### Verificar Docker

```powershell
docker version
docker info
```

### Executar integração

```powershell
.\mvnw.cmd `
  -Dtest=ManagedRuntimeMessagePostgreSqlIT `
  test
```

### Executar um método

```powershell
.\mvnw.cmd `
  "-Dtest=ManagedRuntimeMessagePostgreSqlIT#shouldPersistAndReadManagedRuntimeMessage" `
  test
```

### Ver containers ativos

```powershell
docker ps
```

### Ver imagens PostgreSQL

```powershell
docker images `
  postgres
```

### Controller, service e integração

```powershell
.\mvnw.cmd `
  "-Dtest=EmailNotificationControllerTest,SimpleEmailNotificationServiceTest,ManagedRuntimeMessagePostgreSqlIT" `
  test
```

---

## Exercício guiado

### Parte 1 — PostgreSQL real

Valide o product name.

### Parte 2 — Migrations

Confirme tabela e migrations aplicadas.

### Parte 3 — Round trip

Crie pelo service e leia pelo service.

Confirme a linha por JDBC.

### Parte 4 — Evento e auditoria

Confirme uma linha `CREATED`.

### Parte 5 — Rollback

Use a probe.

Confirme zero linhas nas duas tabelas.

### Parte 6 — Estado independente

Crie dois métodos que usam o mesmo valor.

Confirme que a limpeza evita conflito.

### Parte 7 — Porta dinâmica

Observe o JDBC URL sem hardcode.

Remova logs temporários.

### Parte 8 — Registrar decisão

Anote:

```text
@SpringBootTest;

webEnvironment NONE;

@Testcontainers;

@Container static;

PostgreSQLContainer;

postgres:17.6-alpine;

@ServiceConnection;

profile test;

Flyway ativo;

ddl-auto validate;

limpeza explícita;

sem @Transactional na classe;

create e read reais;

verificação por JdbcTemplate;

probe de rollback;

sem H2;

sem porta fixa;

sem container reuse;

contrato somente na aula 396.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 394 foi preservada;
- dependência `spring-boot-testcontainers` foi adicionada;
- dependência `junit-jupiter` foi adicionada;
- dependência `postgresql` foi adicionada;
- todas possuem scope test;
- versões não foram fixadas no Maven;
- Docker foi validado;
- `@Testcontainers` foi usado;
- `@Container` foi usado;
- container é static;
- `PostgreSQLContainer` foi usado;
- imagem PostgreSQL foi fixada;
- `latest` não foi usado;
- database de teste foi nomeado;
- credentials são somente do container;
- `@ServiceConnection` foi usado;
- `DynamicPropertySource` não foi duplicado;
- porta fixa não foi usada;
- `@SpringBootTest` foi usado;
- `webEnvironment=NONE` foi usado;
- servidor HTTP não foi iniciado;
- profile test foi ativado;
- scheduler foi desabilitado;
- e-mail foi desabilitado;
- cache Redis foi desabilitado;
- Flyway permaneceu ativo;
- `ddl-auto=validate` foi mantido;
- H2 não substituiu PostgreSQL;
- JdbcTemplate foi injetado;
- application service real foi injetado;
- Flyway foi injetado;
- banco real foi comprovado;
- migrations aplicadas foram verificadas;
- tabela criada por migration foi verificada;
- cleanup explícito foi criado;
- cleanup ocorre antes de cada teste;
- testes não dependem de ordem;
- classe não usa `@Transactional`;
- criação real foi executada;
- leitura real foi executada;
- row count foi conferido por JDBC;
- auditoria foi conferida;
- probe transacional foi criada em test source;
- probe foi importada;
- exception forçada foi usada;
- rollback da mensagem foi comprovado;
- rollback da auditoria foi comprovado;
- container reuse não foi habilitado;
- paralelismo não foi antecipado;
- RedisContainer não foi antecipado;
- Mailpit container não foi antecipado;
- servidor real não foi antecipado;
- testes de contrato não foram antecipados;
- observabilidade não foi antecipada;
- integração foi executada repetidamente;
- unitários e integração foram executados juntos;
- commit recomendado está pronto;
- ponte para a aula 396 está correta.

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
git commit -m "test(m14): integrar Spring com PostgreSQL em Testcontainers"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- logs de container;
- dumps PostgreSQL;
- credentials reais;
- arquivos temporários;
- reports;
- volumes locais.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você saiu do isolamento de mocks e integrou a aplicação com PostgreSQL real.

O fluxo ficou:

```text
JUnit;

Testcontainers;

PostgreSQLContainer;

@ServiceConnection;

Spring Boot context;

DataSource;

Flyway;

Hibernate;

application service;

repository;

PostgreSQL;

assertions.
```

Você comprovou:

```text
banco real;

porta dinâmica;

migrations;

schema;

persistência;

leitura;

auditoria;

commit;

rollback;

isolamento de estado.
```

A decisão central foi:

```text
teste de integração precisa
validar fronteiras reais
em ambiente reproduzível;

Testcontainers fornece
infraestrutura descartável;

@ServiceConnection liga
o container à auto-configuração;

Flyway continua sendo
a fonte do schema.
```

A próxima aula será:

```text
396 - M14.41 - Testes de contrato introdução
```

Nela, o foco não será apenas executar a aplicação.

Você começará a verificar se produtor e consumidor concordam sobre:

- endpoints;
- requests;
- responses;
- schemas;
- status;
- mudanças compatíveis.

Esses testes de contrato não foram antecipados aqui.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei Testcontainers no scope de teste.
- [ ] Iniciei PostgreSQL descartável.
- [ ] Conectei com `@ServiceConnection`.
- [ ] Validei Flyway, JPA, persistência e rollback.
- [ ] Executei sem banco instalado manualmente.

---

## Troubleshooting adicional

### Could not find a valid Docker environment

Confirme:

- Docker ativo;
- `docker info`;
- permissões;
- contexto Docker;
- variáveis `DOCKER_HOST`;
- integração WSL, quando aplicável.

### Container inicia, mas Spring não conecta

Confirme:

- `@ServiceConnection`;
- dependency `spring-boot-testcontainers`;
- campo `@Container`;
- tipo `PostgreSQLContainer`;
- datasource concorrente no profile.

### Flyway não encontra migration

Confirme:

```text
src/main/resources/db/migration;
nomes V...__....sql;
Flyway ativo.
```

### Hibernate cria tabela sozinho

Revise:

```text
ddl-auto.
```

Use `validate`.

### Teste passa sozinho e falha junto

Revise cleanup, transações e estado estático.

### Audit row não aparece

Confirme:

- listener síncrono;
- evento publicado;
- transação confirmada;
- tabela correta;
- cleanup não executado depois do Act.

### Rollback deixa uma linha

A probe pode não estar atravessando proxy transacional.

Ela precisa ser bean Spring e chamada pelo teste.

### Porta 5432 já está ocupada

Não deveria importar.

Testcontainers usa porta dinâmica no host.

---

## Observações para aulas futuras

Integrações podem incluir:

- Redis;
- SMTP;
- object storage;
- Kafka;
- RabbitMQ;
- APIs externas simuladas;
- múltiplos containers;
- redes;
- wait strategies;
- reusable test fixtures.

Esses cenários aumentam custo e devem existir quando respondem perguntas reais.

O próximo passo é contrato.

Depois virão observabilidade e empacotamento da aplicação.

Não transforme todo teste em Testcontainers.

Mantenha a pirâmide:

```text
muitos unitários;

testes de slice relevantes;

integrações focadas;

poucos fluxos amplos.
```

---

## Perguntas de revisão

1. O que o teste integra?
2. Por que não usar banco local?
3. Por que não usar H2?
4. Qual annotation ativa Testcontainers?
5. Qual annotation marca o container?
6. Por que o campo é static?
7. Qual imagem foi usada?
8. Por que não usar latest?
9. Para que serve `@ServiceConnection`?
10. Existe porta fixa?
11. Qual annotation inicia o contexto?
12. O servidor HTTP inicia?
13. Quem cria o schema?
14. Qual ddl-auto foi usado?
15. Como o estado é limpo?
16. A classe usa `@Transactional`?
17. Como o rollback foi testado?
18. Redis participa?
19. Mailpit participa?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Spring, Flyway, JPA, service, repository e PostgreSQL.
2. Para evitar estado e configuração compartilhados.
3. Porque não reproduz PostgreSQL completamente.
4. `@Testcontainers`.
5. `@Container`.
6. Para compartilhar por classe.
7. `postgres:17.6-alpine`.
8. Para evitar mudança invisível.
9. Fornecer connection details ao Boot.
10. Não.
11. `@SpringBootTest`.
12. Não.
13. Flyway.
14. `validate`.
15. TRUNCATE antes de cada teste.
16. Não.
17. Com uma probe Spring transacional.
18. Não.
19. Não.
20. Testes de contrato introdução.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 395 - M14.40 - Testes de integração Spring com Testcontainers

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei teste unitário de integração.
- Mantive os testes unitários das aulas anteriores.
- Adicionei `spring-boot-testcontainers`.
- Adicionei Testcontainers JUnit Jupiter.
- Adicionei o módulo PostgreSQL.
- Mantive todas as dependencies em scope test.
- Validei o Docker local.
- Criei `ManagedRuntimeMessagePostgreSqlIT`.
- Usei `@Testcontainers`.
- Usei `@Container`.
- Criei um `PostgreSQLContainer` estático.
- Fixei `postgres:17.6-alpine`.
- Não usei `latest`.
- Usei `@ServiceConnection`.
- Não configurei porta fixa.
- Usei `@SpringBootTest`.
- Usei `webEnvironment=NONE`.
- Ativei o profile test.
- Desabilitei scheduler, e-mail e cache Redis.
- Mantive Flyway ativo.
- Mantive `ddl-auto=validate`.
- Não usei H2 como substituto.
- Comprovei que o database product é PostgreSQL.
- Comprovei migrations aplicadas.
- Limpei as tabelas antes de cada teste.
- Não usei `@Transactional` na classe.
- Testei criação e leitura reais.
- Conferi a linha com JdbcTemplate.
- Conferi auditoria de evento.
- Criei uma probe transacional em test source.
- Comprovei rollback da mensagem e da auditoria.
- Não habilitei container reuse.
- Executei a integração repetidamente.
- Não antecipei contrato ou observabilidade.
- Próxima aula: Testes de contrato introdução.
```

---

## Referência técnica curta

- [Spring Boot — Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [Spring Boot — Testing Spring Boot Applications](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Testcontainers — PostgreSQL](https://java.testcontainers.org/modules/databases/postgres/)
- [Testcontainers — JUnit 5](https://java.testcontainers.org/test_framework_integration/junit_5/)

Regra final:

```text
um teste de integração precisa usar componentes reais nas fronteiras que deseja validar, controlar o ciclo de vida da infraestrutura, começar com estado conhecido e observar commits e rollbacks reais; nesta baseline, Testcontainers inicia PostgreSQL descartável, @ServiceConnection fornece a conexão ao Spring Boot, Flyway cria o schema, JPA e o application service executam contra o banco real e uma limpeza explícita mantém cada cenário independente.
```
