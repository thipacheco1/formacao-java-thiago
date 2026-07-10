# 324 - M13.14 - Hibernate como implementacao JPA

## Apresentacao da aula

Na aula 323, você começou a utilizar Jakarta Persistence sem Spring.

O laboratório mostrou:

```text
persistence unit;

EntityManagerFactory;

EntityManager;

persistence context;

transient;

managed;

detached;

removed;

persist;

find;

merge;

remove;

flush;

commit e rollback.
```

O código principal utilizou interfaces do pacote:

```java
jakarta.persistence
```

Entretanto, essas interfaces precisam de uma implementação concreta.

O provider escolhido foi:

```text
Hibernate ORM.
```

Na aula anterior, o Hibernate permaneceu quase invisível. Ele aparecia no `pom.xml`, no provider declarado em `persistence.xml` e no comportamento executado por trás do `EntityManager`.

Nesta aula, você vai olhar conscientemente para essa camada de implementação.

A diferença central continua sendo:

```text
Jakarta Persistence:
especificação e contrato padronizado.

Hibernate ORM:
implementação concreta e recursos adicionais.
```

O objetivo não é abandonar JPA.

O objetivo é entender:

- o que o Hibernate constrói no bootstrap;
- como `EntityManagerFactory` se relaciona com `SessionFactory`;
- como `EntityManager` se relaciona com `Session`;
- como o provider escolhe o dialeto;
- como o estado gerenciado vira SQL;
- como observar SQL sem confundir log com contrato;
- como o dirty checking produz `UPDATE`;
- como validar o schema criado pelo Flyway;
- como obter estatísticas;
- quais APIs são portáveis;
- quais APIs criam dependência específica do Hibernate;
- quando um recurso nativo é justificável;
- quais riscos aparecem ao tratar ORM como mágica.

A versão usada seguirá a continuidade da aula 323:

```text
Jakarta Persistence API:
3.2.0.

Hibernate ORM:
7.4.4.Final.

HikariCP:
7.1.0.

pgJDBC:
42.7.13.

Flyway:
12.5.0.

Java:
21.
```

O laboratório será isolado:

```text
database:
formacao_java_hibernate_324.

schema:
hibernate_324.
```

Flyway continuará responsável pelo DDL.

O Hibernate será configurado para:

```text
validar o schema;

não criar tabelas;

não alterar tabelas;

não apagar objetos.
```

Você criará um `StatementInspector` didático para capturar SQL gerado sem registrar valores de parâmetros.

Também ativará as estatísticas do Hibernate para observar:

```text
inserts;

loads;

updates;

deletes;

flushes;

prepared statements.
```

A prática comprovará:

```text
persist gera INSERT;

find repetido usa o primeiro nível de cache;

dirty checking gera UPDATE sem chamada explícita;

remove gera DELETE;

Session e EntityManager compartilham o mesmo contexto;

SessionFactory e EntityManagerFactory representam a mesma infraestrutura;

o dialeto PostgreSQL foi resolvido;

schema incompatível impede o bootstrap.
```

O escopo não inclui ainda aprofundamento das anotações de mapeamento.

Esse conteúdo pertence à próxima aula:

```text
325 - M13.15 - Entity Id GeneratedValue Column
```

Também não serão usados:

- Spring;
- Spring Boot;
- Spring Data;
- relacionamentos;
- JPQL;
- HQL como mecanismo principal;
- Criteria;
- cache de segundo nível;
- Envers;
- bytecode enhancement;
- batching de escrita em produção;
- multitenancy;
- APIs reativas.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection e DataSource.

313:
PreparedStatement.

314:
ResultSet.

315:
DAO.

316:
Repository Pattern.

317:
exceções JDBC.

318:
transações.

319:
HikariCP.

320 e 321:
mini projeto JDBC.

322:
Flyway.

323:
JPA conceitos fundamentais.

324:
Hibernate como implementação JPA.

325:
Entity, Id, GeneratedValue e Column.
```

A formação chegou ao provider somente depois de construir a base de SQL, JDBC, transações, pool e migrations.

Isso permite interpretar o Hibernate como uma camada sobre mecanismos já conhecidos.

Nesta aula:

```text
API JPA:
contrato principal.

API Hibernate:
usada somente para observação e comparação.

SessionFactory:
sim.

Session:
sim.

dialeto:
sim.

SQL gerado:
sim.

estatísticas:
sim.

schema validation:
sim.

mapeamento avançado:
não.

Spring:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-324-hibernate-como-implementacao-jpa
```

Estrutura final:

```text
labs
└── m13
    └── aula-324-hibernate-como-implementacao-jpa
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── hibernate.local.env.example
        │   └── hibernate.local.env
        ├── docs
        │   ├── arquitetura-hibernate.md
        │   ├── jpa-portavel-vs-hibernate-nativo.md
        │   ├── observabilidade-sql.md
        │   └── troubleshooting-hibernate.md
        ├── scripts
        │   ├── 01_criar_databases.ps1
        │   ├── 02_executar_migrations.ps1
        │   ├── 03_executar_laboratorio.ps1
        │   ├── 04_demo_schema_incompativel.ps1
        │   ├── 05_validar_estado_final.ps1
        │   └── 06_limpar_databases.ps1
        └── src
            ├── main
            │   ├── java
            │   │   └── br
            │   │       └── com
            │   │           └── formacao
            │   │               └── m13
            │   │                   └── aula324
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── DatabaseSettings.java
            │   │                       │   ├── HibernateRuntime.java
            │   │                       │   └── HibernateRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       ├── hibernate
            │   │                       │   ├── HibernateProbe.java
            │   │                       │   ├── HibernateSnapshot.java
            │   │                       │   └── SqlCaptureInspector.java
            │   │                       └── lab
            │   │                           ├── HibernateImplementationLab.java
            │   │                           └── HibernateReport.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_hibernate_324.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula324
                                        ├── HibernateProviderIT.java
                                        ├── HibernateStatisticsIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
provider:
Hibernate ORM.

factory unwrap:
SessionFactory.

manager unwrap:
Session.

dialeto:
PostgreSQLDialect ou implementação PostgreSQL equivalente.

persist:
1 INSERT.

dois find no mesmo contexto:
1 SELECT;
mesma referência.

dirty checking:
1 UPDATE;
nenhum método update explícito.

remove:
1 DELETE.

schema incompatível:
bootstrap falha na validação.

estado final:
zero fixtures CLI-HIB-324-%.
```

---

## Conceito essencial

### Hibernate e JPA nao sao sinonimos

JPA define interfaces e regras.

Hibernate implementa essas interfaces e adiciona recursos próprios.

Código portável:

```java
EntityManagerFactory factory;
EntityManager entityManager;
```

Código específico:

```java
SessionFactory sessionFactory;
Session session;
```

Uma aplicação pode usar Hibernate como provider sem importar nenhuma classe do Hibernate em suas regras de negócio.

---

### SessionFactory e EntityManagerFactory

No Hibernate, a infraestrutura concreta por trás de `EntityManagerFactory` é também uma `SessionFactory`.

Você pode obter a visão nativa com:

```java
SessionFactory sessionFactory =
        entityManagerFactory.unwrap(
                SessionFactory.class
        );
```

As duas referências representam a mesma fábrica subjacente, vistas por contratos diferentes.

Características:

```text
vida longa;

thread-safe;

construção custosa;

metadados de mapeamento;

serviços JDBC;

cache e estatísticas;
```

A aplicação deve criar uma fábrica no startup e fechá-la no shutdown.

---

### Session e EntityManager

No Hibernate, uma `Session` implementa a função de contexto de persistência e também pode ser obtida a partir do `EntityManager`:

```java
Session session =
        entityManager.unwrap(
                Session.class
        );
```

As duas referências usam o mesmo persistence context.

Uma entidade contida por uma também está contida pela outra.

A diferença está na API exposta.

`EntityManager` favorece portabilidade.

`Session` oferece recursos nativos.

---

### Unwrap

`unwrap` pede ao provider uma visão específica da implementação.

Ele é adequado quando:

- o recurso não existe em JPA;
- o benefício é concreto;
- o acoplamento é isolado;
- existe teste;
- a decisão foi documentada.

Ele não deve ser usado por curiosidade em todas as classes.

Ao importar `org.hibernate.Session`, o código passa a depender do Hibernate.

---

### Arquitetura interna simplificada

Fluxo conceitual:

```text
aplicação
    -> EntityManager
        -> Session
            -> persistence context
            -> action queue
            -> dirty checking
            -> SQL AST e tradução
            -> JDBC
                -> HikariCP
                    -> PostgreSQL.
```

O Hibernate não ignora JDBC.

Ele constrói e executa comandos JDBC por baixo da abstração ORM.

---

### Dialeto

Bancos relacionais possuem diferenças:

- tipos;
- funções;
- paginação;
- sequences;
- identidade;
- locking;
- sintaxe;
- recursos SQL.

O dialeto informa ao Hibernate como gerar SQL compatível com o database.

No laboratório, o provider detectará PostgreSQL pelos metadados JDBC.

Não será necessário configurar manualmente:

```text
hibernate.dialect.
```

A detecção funciona quando o provider consegue abrir conexão durante o bootstrap.

Configuração explícita pode ser útil em cenários controlados, mas também pode ficar incorreta se o banco mudar.

---

### SQL gerado

Hibernate transforma operações de entidade em SQL.

Exemplos:

```text
persist:
INSERT.

find:
SELECT.

dirty checking:
UPDATE.

remove:
DELETE.
```

O SQL continua sujeito a:

- índices;
- constraints;
- locks;
- plano;
- latência;
- volume;
- contenção.

ORM não torna uma query eficiente automaticamente.

---

### Dirty checking

Uma entidade managed é monitorada pelo persistence context.

Exemplo:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                id
        );

cliente.alterarNome(
        "Novo nome",
        agora
);
```

Não existe chamada:

```java
entityManager.update(cliente);
```

Durante flush, o provider compara o estado atual com o snapshot conhecido e agenda um `UPDATE`.

Isso é dirty checking.

Ele funciona apenas enquanto a entidade está managed.

Alterar um objeto detached não gera update automático.

---

### Action queue

Operações de persistência são organizadas internamente antes de chegar ao JDBC.

A fila pode conter:

- inserts;
- updates;
- deletes;
- ações sobre coleções.

O momento do SQL depende de:

- estratégia de ID;
- flush;
- commit;
- consultas;
- necessidades de integridade.

Não deduza que a linha Java de `persist` corresponde imediatamente a uma linha SQL executada naquele instante.

---

### Primeiro nivel de cache

O persistence context funciona como cache de primeiro nível.

Ele é obrigatório e pertence ao `Session` ou `EntityManager`.

Se o mesmo ID é buscado duas vezes no mesmo contexto:

```text
uma instância managed;

normalmente um SELECT;
segunda busca resolvida pelo contexto.
```

Esse cache não é compartilhado entre contextos.

Não confunda com cache de segundo nível.

---

### Flush mode

O modo padrão JPA é normalmente:

```text
AUTO.
```

O provider pode executar flush antes de uma consulta quando precisa manter consistência entre estado gerenciado e resultado SQL.

Outro modo é:

```text
COMMIT.
```

Nesta aula, o laboratório manterá o padrão.

Alterar flush mode sem compreender efeitos pode produzir resultados inesperados.

---

### StatementInspector

`StatementInspector` é um recurso nativo do Hibernate.

Ele recebe SQL antes do envio ao JDBC.

Pode ser usado para:

- diagnóstico;
- testes;
- correlação;
- observação;
- comentários controlados.

No laboratório, ele somente armazenará SQL normalizado.

Ele não registrará valores de parâmetros.

Não use para reescrever queries de negócio de forma obscura.

---

### Logging de SQL

Propriedades como:

```text
hibernate.show_sql;
hibernate.format_sql;
hibernate.highlight_sql.
```

ajudam localmente.

Em aplicações profissionais, logging estruturado costuma ser melhor que `show_sql`.

Categorias conhecidas incluem SQL e binding de parâmetros.

Bindings podem conter dados sensíveis.

Nunca habilite logs detalhados indiscriminadamente em produção.

---

### Estatisticas

Com:

```text
hibernate.generate_statistics=true
```

o `SessionFactory` expõe métricas como:

- entity insert count;
- entity load count;
- entity update count;
- entity delete count;
- flush count;
- prepared statement count.

As estatísticas têm custo.

Use conscientemente e integre com observabilidade apropriada em produção.

No laboratório, elas ficam ativadas para aprendizado.

---

### Schema validation

Flyway cria o schema.

Hibernate valida o mapeamento com:

```text
hibernate.hbm2ddl.auto=validate.
```

Se uma coluna ou tabela esperada estiver ausente, o bootstrap falha.

O modo `validate`:

- não cria;
- não altera;
- não apaga;
- apenas compara metadados essenciais.

Essa combinação é segura para o laboratório:

```text
Flyway migrate;

Hibernate validate.
```

---

### create e update nao sao migrations

Configurações como:

```text
create;

create-drop;

update.
```

podem ser úteis em experimentos descartáveis, mas não substituem migrations profissionais.

Riscos de `update`:

- mudança implícita;
- falta de revisão;
- diferença entre ambientes;
- ausência de estratégia de dados;
- dificuldade de rollback;
- pouca previsibilidade operacional.

Nesta aula, qualquer modo diferente de `validate` será proibido.

---

### Portabilidade e recurso nativo

Use JPA quando o contrato atende.

Use Hibernate nativo quando existe necessidade concreta.

Exemplos possíveis:

- estatísticas do provider;
- `StatementInspector`;
- recursos específicos de sessão;
- tipos avançados;
- filtros;
- operações em lote especializadas.

A decisão deve documentar:

```text
benefício;

custo de acoplamento;

alternativa portável;

impacto de teste;

impacto de upgrade.
```

---

### Custo do contexto e tamanho da unidade de trabalho

O persistence context mantém referências e snapshots enquanto o `EntityManager` permanece aberto. Uma unidade de trabalho muito longa pode acumular muitas entidades managed, aumentar consumo de memória e ampliar o custo do dirty checking.

Isso não significa executar `clear()` aleatoriamente. Significa desenhar limites coerentes:

```text
abrir contexto;

iniciar transação;

carregar somente o necessário;

alterar;

confirmar ou desfazer;

fechar contexto.
```

Em rotinas de volume, processamento em lotes pode exigir `flush` e `clear` periódicos. Esse assunto será retomado quando batching e performance ORM forem estudados. Nesta aula, as unidades são curtas e cada cenário usa um novo `EntityManager`.

Outro risco é manter uma entidade managed enquanto a aplicação executa processamento demorado ou chamadas externas. A transação e a conexão podem permanecer ocupadas, e o snapshot pode ficar desatualizado em relação a outros fluxos. O contexto deve acompanhar uma unidade de negócio curta, não uma sessão indefinida do usuário.

---

### SQL capturado nao representa custo completo

O `StatementInspector` mostra a instrução que o Hibernate pretende executar, mas não informa sozinho:

- tempo de rede;
- espera por conexão;
- tempo de lock;
- linhas lidas;
- plano escolhido;
- buffers;
- quantidade de dados transferidos;
- custo de materialização de entidades.

Para investigar performance, combine observação do ORM com ferramentas do banco:

```text
EXPLAIN ANALYZE;

pg_stat_activity;

métricas do pool;

logs lentos;

estatísticas do Hibernate;

profiling da aplicação.
```

Uma query curta em texto pode ser cara. Uma query longa pode usar um bom índice e ser rápida. Não avalie SQL apenas por aparência.

---

### Critério para usar API nativa

Antes de usar uma API do Hibernate, registre quatro respostas:

```text
qual limitação da JPA está sendo resolvida?

qual benefício mensurável existe?

como o acoplamento ficará isolado?

como o comportamento será testado?
```

Se não houver resposta concreta, prefira a API JPA.

No laboratório, `StatementInspector`, `Statistics` e acesso ao dialeto justificam a dependência nativa porque são capacidades de diagnóstico do provider. As regras de criação, leitura, alteração e remoção continuam usando Jakarta Persistence.

Esse equilíbrio evita dois extremos:

```text
fingir que o provider não existe;

espalhar Hibernate por toda a aplicação.
```

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\main\java\br\com\formacao\m13\aula324\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\main\java\br\com\formacao\m13\aula324\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\main\java\br\com\formacao\m13\aula324\hibernate"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\main\java\br\com\formacao\m13\aula324\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-324-hibernate-como-implementacao-jpa\src\test\java\br\com\formacao\m13\aula324"

Set-Location `
  "labs\m13\aula-324-hibernate-como-implementacao-jpa"
```

---

### 2. Criar .gitignore e pom.xml

Use o `.gitignore` da aula 323 e ignore:

```text
config/hibernate.local.env
```

No `pom.xml`, mantenha:

```text
Java 21;

Jakarta Persistence API 3.2.0;

Hibernate ORM 7.4.4.Final;

HikariCP 7.1.0;

pgJDBC 42.7.13;

Flyway 12.5.0;

SLF4J Simple 2.0.17;

JUnit 5.10.2.
```

Artifact:

```text
aula-324-hibernate-implementacao-jpa.
```

Main:

```text
br.com.formacao.m13.aula324.Main.
```

---

### 3. Criar configuracao local

`config/hibernate.local.env.example`:

```properties
HIBERNATE_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_hibernate_324
HIBERNATE_BROKEN_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_hibernate_324_broken
HIBERNATE_JDBC_USER=formacao
HIBERNATE_JDBC_PASSWORD=formacao_local
HIBERNATE_APPLICATION_NAME=aula-324-hibernate
HIBERNATE_POOL_NAME=aula-324-pool
HIBERNATE_POOL_SIZE=3
```

Copie para:

```text
config/hibernate.local.env
```

O arquivo real permanece fora do Git.

---

### 4. Criar migration

`V1__criar_schema_hibernate_324.sql`:

```sql
CREATE SCHEMA IF NOT EXISTS hibernate_324;

CREATE SEQUENCE
    hibernate_324.cliente_id_seq
START WITH 324001
INCREMENT BY 1;

CREATE TABLE hibernate_324.cliente (
    id bigint NOT NULL
        DEFAULT nextval(
            'hibernate_324.cliente_id_seq'
        ),
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,
    email varchar(160),
    ativo boolean NOT NULL DEFAULT true,
    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL,
    atualizado_em timestamptz NOT NULL,

    CONSTRAINT pk_hibernate_324_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_hibernate_324_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_hibernate_324_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_hibernate_324_cliente_nome
        CHECK (btrim(nome) <> '')
);
```

---

### 5. Reutilizar ClienteEntity e persistence.xml

Copie `ClienteEntity` da aula 323 e ajuste:

```text
package:
aula324.

schema:
hibernate_324.

sequence:
hibernate_324.cliente_id_seq.
```

O `persistence.xml` deve usar:

```text
persistence unit:
aula324PU.

provider:
org.hibernate.jpa.HibernatePersistenceProvider.

transaction type:
RESOURCE_LOCAL.

classe:
ClienteEntity.

shared cache:
NONE.

validation:
NONE.
```

Não coloque propriedades nativas no XML.

Elas serão centralizadas na factory.

---

### 6. Criar SqlCaptureInspector.java

```java
package br.com.formacao.m13.aula324.hibernate;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.hibernate.resource.jdbc.spi.StatementInspector;

public final class SqlCaptureInspector
        implements StatementInspector {

    private final List<String> statements =
            new CopyOnWriteArrayList<>();

    @Override
    public String inspect(
            String sql
    ) {
        if (sql != null && !sql.isBlank()) {
            statements.add(
                    normalize(sql)
            );
        }

        return sql;
    }

    public List<String> snapshot() {
        return List.copyOf(statements);
    }

    public void clear() {
        statements.clear();
    }

    public long countContaining(
            String fragment
    ) {
        String normalized =
                fragment.toLowerCase();

        return statements.stream()
                .filter(sql ->
                        sql.toLowerCase()
                                .contains(normalized)
                )
                .count();
    }

    private static String normalize(
            String sql
    ) {
        return sql
                .replaceAll("\\s+", " ")
                .trim();
    }
}
```

O inspector devolve o SQL original.

Ele não altera a query.

---

### 7. Criar HibernateSnapshot.java

```java
package br.com.formacao.m13.aula324.hibernate;

public record HibernateSnapshot(
        long inserts,
        long loads,
        long updates,
        long deletes,
        long flushes,
        long preparedStatements
) {
}
```

---

### 8. Criar HibernateProbe.java

```java
package br.com.formacao.m13.aula324.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.stat.Statistics;

import jakarta.persistence.EntityManagerFactory;

public final class HibernateProbe {

    private HibernateProbe() {
    }

    public static SessionFactory sessionFactory(
            EntityManagerFactory factory
    ) {
        return factory.unwrap(
                SessionFactory.class
        );
    }

    public static String dialectName(
            EntityManagerFactory factory
    ) {
        SessionFactoryImplementor implementor =
                factory.unwrap(
                        SessionFactoryImplementor.class
                );

        return implementor
                .getJdbcServices()
                .getDialect()
                .getClass()
                .getName();
    }

    public static Statistics statistics(
            EntityManagerFactory factory
    ) {
        return sessionFactory(factory)
                .getStatistics();
    }

    public static HibernateSnapshot snapshot(
            Statistics statistics
    ) {
        return new HibernateSnapshot(
                statistics
                        .getEntityInsertCount(),
                statistics
                        .getEntityLoadCount(),
                statistics
                        .getEntityUpdateCount(),
                statistics
                        .getEntityDeleteCount(),
                statistics.getFlushCount(),
                statistics
                        .getPrepareStatementCount()
        );
    }
}
```

`SessionFactoryImplementor` é SPI interna.

Seu uso fica isolado em uma classe de diagnóstico.

---

### 9. Criar HibernateRuntimeFactory.java

A factory cria `HikariDataSource` e passa propriedades ao bootstrap JPA.

Propriedades:

```java
Map<String, Object> overrides =
        new HashMap<>();

overrides.put(
        "jakarta.persistence.dataSource",
        dataSource
);

overrides.put(
        "hibernate.hbm2ddl.auto",
        "validate"
);

overrides.put(
        "hibernate.generate_statistics",
        "true"
);

overrides.put(
        "hibernate.show_sql",
        "false"
);

overrides.put(
        "hibernate.format_sql",
        "true"
);

overrides.put(
        "hibernate.highlight_sql",
        "false"
);

overrides.put(
        "hibernate.session_factory.statement_inspector",
        inspector
);
```

Não configure:

```text
hibernate.dialect;

create;

update;

create-drop.
```

A factory devolve `HibernateRuntime` contendo:

```text
DataSource;

EntityManagerFactory;

SqlCaptureInspector.
```

No fechamento:

1. fechar `EntityManagerFactory`;
2. fechar DataSource.

Se o bootstrap falhar, feche o DataSource no `catch`.

---

### 10. Criar HibernateReport.java

```java
package br.com.formacao.m13.aula324.lab;

import br.com.formacao.m13.aula324.hibernate.HibernateSnapshot;

public record HibernateReport(
        String providerClass,
        String dialectClass,
        boolean factoryUnwrapped,
        boolean sessionUnwrapped,
        boolean samePersistenceContext,
        boolean firstLevelCacheWorked,
        boolean dirtyCheckingWorked,
        HibernateSnapshot statistics
) {
}
```

---

### 11. Criar HibernateImplementationLab.java

A classe recebe:

```text
EntityManagerFactory;

SqlCaptureInspector.
```

Fluxo:

#### Identificar provider

```java
String providerClass =
        factory.getClass().getName();

SessionFactory sessionFactory =
        factory.unwrap(
                SessionFactory.class
        );
```

Confirme a fábrica aberta.

#### Persistir

Limpe inspector e estatísticas.

Abra `EntityManager`, inicie transação e crie:

```text
CLI-HIB-324-MAIN.
```

Execute:

```java
entityManager.persist(cliente);
entityManager.flush();
transaction.commit();
```

Confirme:

```text
ID positivo;

1 INSERT capturado;

insert count 1.
```

#### Comparar EntityManager e Session

No mesmo contexto:

```java
Session session =
        entityManager.unwrap(
                Session.class
        );

boolean same =
        entityManager.contains(cliente)
        && session.contains(cliente);
```

Não abra uma segunda `Session`.

#### Primeiro nivel de cache

Em contexto novo:

```java
ClienteEntity first =
        entityManager.find(
                ClienteEntity.class,
                id
        );

ClienteEntity second =
        entityManager.find(
                ClienteEntity.class,
                id
        );
```

Confirme:

```text
first == second;

somente um SELECT capturado.
```

#### Dirty checking

Em nova transação:

```java
ClienteEntity managed =
        entityManager.find(
                ClienteEntity.class,
                id
        );

managed.alterarNome(
        "Cliente atualizado por dirty checking",
        agora
);

transaction.commit();
```

Não chame `merge`.

Confirme um `UPDATE`.

#### Remove

Em nova transação:

```java
ClienteEntity managed =
        entityManager.find(
                ClienteEntity.class,
                id
        );

entityManager.remove(managed);

transaction.commit();
```

Confirme um `DELETE` e `find` nulo em novo contexto.

---

### 12. Criar Main.java

O `Main`:

1. carrega settings;
2. cria runtime;
3. executa o laboratório;
4. imprime provider;
5. imprime dialeto;
6. imprime resultados booleanos;
7. imprime estatísticas;
8. fecha runtime.

Não imprima SQL completo no console principal.

Mostre apenas:

```text
quantidade de INSERT;

quantidade de SELECT;

quantidade de UPDATE;

quantidade de DELETE.
```

O SQL capturado fica disponível para testes e diagnóstico local.

---

### 13. Criar HibernateProviderIT.java

Casos:

#### Deve usar Hibernate como provider

Confirme que a factory pode ser unwrapped para:

```text
SessionFactory.
```

#### Deve usar mesma infraestrutura

Abra `EntityManager`, unwrap para `Session` e confirme:

```text
isOpen;

contains consistente.
```

#### Deve detectar PostgreSQL

Confirme que o nome do dialeto contém:

```text
PostgreSQL.
```

Não compare o nome completo com igualdade rígida.

#### Deve validar schema

O bootstrap normal deve concluir sem gerar DDL.

---

### 14. Criar HibernateStatisticsIT.java

No início:

```java
statistics.clear();
inspector.clear();
```

Teste `persist`:

```text
insert count 1;

SQL contém insert into hibernate_324.cliente.
```

Teste primeiro nível:

```text
dois find;

mesma referência;

load count 1;

um SELECT.
```

Teste dirty checking:

```text
nenhum merge;

update count 1;

SQL contém update hibernate_324.cliente.
```

Teste remove:

```text
delete count 1;

SQL contém delete from hibernate_324.cliente.
```

Limpe fixtures no `@AfterEach`.

---

### 15. Criar TestDataCleaner.java

Use JDBC de teste:

```sql
DELETE FROM hibernate_324.cliente
WHERE codigo LIKE 'CLI-HIB-324-%'
```

A limpeza não pertence ao domínio.

Ela protege a repetibilidade.

---

### 16. Criar scripts

`01_criar_databases.ps1` cria:

```text
formacao_java_hibernate_324;

formacao_java_hibernate_324_broken.
```

Use nomes constantes.

`02_executar_migrations.ps1`:

1. carrega variáveis;
2. executa Flyway na base principal;
3. aponta temporariamente para a base broken;
4. executa a mesma migration;
5. restaura a URL principal.

`03_executar_laboratorio.ps1`:

```powershell
mvn clean verify
mvn exec:java
```

`05_validar_estado_final.ps1` exige zero linhas com prefixo reservado.

`06_limpar_databases.ps1` remove somente os dois databases depois das evidências.

---

### 17. Demonstrar schema incompativel

`scripts/04_demo_schema_incompativel.ps1`:

1. garante migration na base broken;
2. executa:

```sql
ALTER TABLE hibernate_324.cliente
DROP COLUMN email;
```

3. aponta `HIBERNATE_JDBC_URL` para broken;
4. executa o bootstrap;
5. exige falha;
6. valida que a mensagem indica schema incompatível;
7. restaura a URL principal;
8. não executa `update` automático;
9. descarta a base broken depois da evidência.

A correção não é:

```text
hibernate.hbm2ddl.auto=update.
```

A correção é criar uma migration apropriada ou restaurar o schema esperado.

---

### 18. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_databases.ps1
.\scripts\02_executar_migrations.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_demo_schema_incompativel.ps1
.\scripts\05_validar_estado_final.ps1
```

Confirme:

```text
provider Hibernate;

factory e session unwrapped;

dialeto PostgreSQL;

INSERT observado;

primeiro nível evitou SELECT duplicado;

dirty checking gerou UPDATE;

remove gerou DELETE;

estatísticas coerentes;

schema inválido falhou;

base principal permaneceu limpa.
```

Depois:

```powershell
.\scripts\06_limpar_databases.ps1
```

---

### 19. Criar documentacao

`arquitetura-hibernate.md` deve desenhar:

```text
EntityManagerFactory
    -> SessionFactory
        -> metadados
        -> serviços JDBC
        -> estatísticas.

EntityManager
    -> Session
        -> persistence context
        -> action queue
        -> JDBC.
```

`jpa-portavel-vs-hibernate-nativo.md` deve criar uma tabela:

```text
Necessidade | JPA | Hibernate | Decisão
```

Inclua:

- persistência básica;
- transação;
- find;
- estatísticas;
- statement inspector;
- dialeto;
- portabilidade.

`observabilidade-sql.md` deve registrar:

- SQL gerado;
- placeholders;
- bindings sensíveis;
- estatísticas;
- custo;
- ambientes;
- proibição de logs indiscriminados.

`troubleshooting-hibernate.md` deve cobrir:

- provider não encontrado;
- unwrap falhando;
- dialect não resolvido;
- schema validation;
- SQL inesperado;
- update não gerado;
- entidade detached;
- factory fechada;
- pool fechado cedo;
- estatísticas zeradas.

---

## Entendendo o que foi feito

### JPA continuou sendo o contrato

A lógica principal utilizou `EntityManagerFactory` e `EntityManager`.

### Hibernate ficou visivel como implementacao

`unwrap` revelou `SessionFactory` e `Session`.

### SQL deixou de ser invisivel

O inspector capturou comandos sem expor bindings.

### Dirty checking foi comprovado

Uma alteração em entidade managed produziu `UPDATE` no flush.

### Flyway e validate trabalharam juntos

Flyway criou o schema e Hibernate rejeitou uma estrutura incompatível.

---

## Erros comuns importantes

### Usar API nativa em toda camada

Isole dependências específicas e documente o motivo.

### Ativar hbm2ddl update em ambiente real

Use migrations versionadas.

### Confiar apenas em show_sql

Use observabilidade controlada e testes.

### Ignorar o SQL gerado

ORM ainda executa SQL e pode produzir consultas caras.

### Manter estatisticas sem avaliar custo

Ative conforme necessidade e ambiente.

---

## Comandos uteis

### Migrations

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

### Sessoes do laboratorio

```sql
SELECT
    pid,
    application_name,
    state,
    query
FROM pg_stat_activity
WHERE application_name
    LIKE 'aula-324%';
```

---

## Exercicio guiado

### Parte 1 — Primeiro nivel

Carregue o mesmo ID três vezes no mesmo contexto.

Confirme uma referência e um SELECT.

Depois execute `clear` e busque novamente.

Confirme novo SELECT.

### Parte 2 — Entidade detached

Carregue, feche o `EntityManager`, altere o nome e abra outro contexto.

Confirme que nenhum update ocorre até `merge`.

### Parte 3 — Flush explicito

Altere uma entidade managed, chame `flush`, observe o UPDATE e execute rollback.

Confirme que o banco mantém o valor anterior.

### Parte 4 — Estatisticas

Capture snapshots:

```text
antes;

depois do persist;

depois do find;

depois do update;

depois do remove.
```

Explique cada contador.

### Parte 5 — Log de bindings

Em ambiente local isolado, habilite temporariamente binding detalhado.

Use dados não sensíveis.

Depois desative e documente por que não deve permanecer em produção.

### Parte 6 — Dialeto

Remova qualquer configuração explícita de dialeto e confirme detecção.

Depois configure um dialeto incompatível em base descartável e observe a falha ou SQL incorreto.

Restaure imediatamente.

### Parte 7 — SPI interna

Localize o único import de:

```text
SessionFactoryImplementor.
```

Confirme que está isolado em diagnóstico.

Escreva o risco de upgrade.

### Parte 8 — ADR

Crie um ADR curto:

```text
usar JPA como API principal;

permitir Hibernate nativo somente em infraestrutura;

exigir justificativa e teste.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- arquivo usa o nome exato da grade;
- laboratório oficial da aula 324 existe;
- continuidade com a aula 323 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence API foi mantida;
- Hibernate ORM foi mantido como provider;
- HikariCP foi mantido;
- pgJDBC foi mantido;
- Flyway foi mantido para DDL;
- database principal é isolado;
- database broken é descartável;
- schema oficial não foi alterado;
- configuração real está fora do Git;
- senha não aparece em logs;
- persistence unit foi criada;
- factory foi criada uma vez;
- factory foi fechada;
- DataSource foi fechado;
- `EntityManagerFactory` foi unwrapped;
- `SessionFactory` foi obtida;
- `EntityManager` foi unwrapped;
- `Session` foi obtida;
- mesmo persistence context foi comprovado;
- API JPA permaneceu principal;
- API Hibernate ficou isolada;
- dialeto PostgreSQL foi detectado;
- dialeto não foi fixado desnecessariamente;
- SQL gerado foi capturado;
- bindings não foram armazenados;
- `StatementInspector` foi criado;
- inspector não alterou SQL;
- estatísticas foram ativadas;
- inserts foram contados;
- loads foram contados;
- updates foram contados;
- deletes foram contados;
- flushes foram contados;
- statements foram contados;
- persist gerou INSERT;
- find repetido usou primeiro nível;
- mesma referência foi comprovada;
- dirty checking gerou UPDATE;
- nenhum método update foi criado;
- remove gerou DELETE;
- schema validation ficou em `validate`;
- create não foi usado;
- update automático não foi usado;
- create-drop não foi usado;
- schema incompatível falhou no bootstrap;
- correção por migration foi documentada;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou limpo;
- relacionamentos não foram antecipados;
- JPQL não foi antecipada;
- mapeamento detalhado não foi antecipado;
- Spring não foi usado;
- portabilidade foi discutida;
- trade-offs foram documentados;
- ponte para a aula 325 está correta;
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
config/hibernate.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-324-hibernate-como-implementacao-jpa
```

Commit recomendado:

```powershell
git commit -m "feat(m13): observar hibernate como implementacao jpa"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você tornou visível a implementação que estava por trás de JPA.

Aprendeu:

```text
JPA define contratos;

Hibernate implementa esses contratos;

EntityManagerFactory pode ser vista como SessionFactory;

EntityManager pode ser visto como Session;

unwrap cria dependência específica;

dialeto adapta SQL ao database;

dirty checking agenda updates;

primeiro nível preserva identidade;

StatementInspector observa SQL;

estatísticas medem operações;

Flyway cria schema;

Hibernate validate verifica compatibilidade.
```

O laboratório comprovou:

```text
persist gerando INSERT;

find repetido evitando SELECT duplicado;

entidade managed gerando UPDATE;

remove gerando DELETE;

Session compartilhando contexto com EntityManager;

SessionFactory expondo estatísticas;

schema incompatível impedindo bootstrap.
```

Agora você entende melhor a máquina por trás do contrato JPA.

A próxima aula será:

```text
325 - M13.15 - Entity Id GeneratedValue Column
```

Nela, você aprofundará o mapeamento básico:

- `@Entity`;
- nome da entidade;
- `@Table`;
- `@Id`;
- identidade;
- `@GeneratedValue`;
- `SEQUENCE`;
- `IDENTITY`;
- `AUTO`;
- `TABLE` conceitual;
- `@SequenceGenerator`;
- `@Column`;
- nullable;
- unique;
- length;
- precision;
- scale;
- insertable;
- updatable;
- constraints no banco;
- alinhamento entre entidade e migration;
- erros de mapeamento;
- testes de schema.

O provider continuará sendo Hibernate, mas o foco passará para a descrição precisa da entidade.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei contrato JPA de implementação Hibernate.
- [ ] Relacionei factory/manager com SessionFactory/Session.
- [ ] Observei SQL, dirty checking e primeiro nível de cache.
- [ ] Consultei estatísticas sem expor parâmetros.
- [ ] Mantive Flyway no DDL e Hibernate em `validate`.

---

## Troubleshooting adicional

### Unable to unwrap

Confirme que o provider é Hibernate e que a classe está no classpath.

### Unable to determine Dialect

Confirme URL, driver, credenciais e disponibilidade do PostgreSQL.

### Schema-validation missing column

Execute migrations ou corrija o mapeamento.

Não habilite `update` como atalho.

### Update nao aparece

Confirme que a entidade está managed, que houve transação e flush e que o valor realmente mudou.

### Statistics retornam zero

Confirme `hibernate.generate_statistics=true` e limpe os contadores no momento correto.

---

## Perguntas de revisao

1. JPA e Hibernate são a mesma coisa?
2. O que é provider?
3. Qual API é portável?
4. O que é SessionFactory?
5. Como obtê-la?
6. O que é Session?
7. Como obtê-la?
8. O que faz unwrap?
9. O que é dialeto?
10. O dialeto foi fixado?
11. O que é dirty checking?
12. Ele funciona em detached?
13. O que é primeiro nível de cache?
14. Ele é global?
15. O que faz StatementInspector?
16. Ele deve registrar parâmetros?
17. Para que servem estatísticas?
18. Quem cria o schema?
19. Qual modo de DDL foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Não.
2. Implementação da especificação.
3. Jakarta Persistence.
4. Fábrica nativa Hibernate.
5. Com `unwrap`.
6. Contexto nativo Hibernate.
7. Com `unwrap`.
8. Expõe implementação específica.
9. Estratégia SQL por database.
10. Não; foi detectado.
11. Detecção de mudança managed.
12. Não.
13. Cache do persistence context.
14. Não.
15. Inspeciona SQL.
16. Não por padrão.
17. Observar operações do provider.
18. Flyway.
19. `validate`.
20. Entity Id GeneratedValue Column.

---

## Desafio opcional

Crie:

```java
HibernateDiagnostics
```

Saída:

```text
provider;

versão do Hibernate;

dialeto;

factory aberta;

statistics habilitadas;

insert count;

load count;

update count;

delete count;

statement count.
```

Regras:

- classe restrita à infraestrutura;
- nenhuma senha;
- nenhum SQL completo;
- nenhuma dependência no domínio;
- testes de integração;
- tratar factory fechada;
- documentar dependência de API específica.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 324 - M13.14 - Hibernate como implementacao JPA

- Aprofundei a diferença entre JPA e Hibernate.
- Mantive Jakarta Persistence como contrato principal.
- Entendi Hibernate como provider ORM.
- Relacionei `EntityManagerFactory` com `SessionFactory`.
- Relacionei `EntityManager` com `Session`.
- Usei `unwrap` de forma controlada.
- Entendi o custo de acoplamento à API nativa.
- Estudei a arquitetura interna simplificada do Hibernate.
- Entendi o papel do dialeto.
- Usei detecção do dialeto PostgreSQL.
- Não fixei dialeto sem necessidade.
- Observei SQL gerado por persistência.
- Criei `SqlCaptureInspector`.
- Evitei registrar valores de parâmetros.
- Ativei estatísticas do Hibernate.
- Observei inserts, loads, updates, deletes e flushes.
- Comprovei o cache de primeiro nível.
- Comprovei identidade no mesmo persistence context.
- Comprovei dirty checking sem método update.
- Entendi o papel da action queue.
- Diferenciei flush de commit.
- Mantive Flyway responsável pelo schema.
- Configurei Hibernate em modo `validate`.
- Simulei schema incompatível em database descartável.
- Rejeitei `hbm2ddl update` como substituto de migration.
- Isolei APIs específicas do provider na infraestrutura.
- Não antecipei relacionamentos, JPQL ou Spring.
- Próxima aula: Entity Id GeneratedValue Column.
```

---

## Referencia tecnica curta

```text
JPA:
contrato.

Hibernate:
implementação.

SessionFactory:
factory nativa.

Session:
contexto nativo.

unwrap:
acesso específico.

dialect:
SQL por database.

dirty checking:
UPDATE automático de managed.

first-level cache:
identidade do contexto.

StatementInspector:
observação de SQL.

Statistics:
métricas do provider.

validate:
schema deve existir e ser compatível.
```

Regra final:

```text
usar Hibernate com criterio significa manter JPA como contrato quando possivel, observar o SQL real, entender dirty checking e contexto, isolar APIs nativas e nunca trocar migrations versionadas por geracao implicita de schema.
```
