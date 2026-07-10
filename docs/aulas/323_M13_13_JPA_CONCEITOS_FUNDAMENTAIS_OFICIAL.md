# 323 - M13.13 - JPA conceitos fundamentais

## Apresentacao da aula

Na aula 322, você colocou o schema do banco dentro de um processo versionado com Flyway.

Agora existe uma separação clara:

```text
Flyway:
cria e evolui a estrutura.

aplicação:
persiste e consulta dados.

PostgreSQL:
armazena e protege integridade.
```

Nas aulas de JDBC, você controlou diretamente:

- `Connection`;
- `PreparedStatement`;
- parâmetros;
- `ResultSet`;
- mapeamento;
- commit;
- rollback;
- fechamento de recursos.

Esse conhecimento continua necessário.

JPA não elimina JDBC, SQL ou banco relacional.

JPA cria uma abstração padronizada para persistência de objetos Java em bancos relacionais.

A sigla histórica significa:

```text
Java Persistence API.
```

O nome atual da especificação é:

```text
Jakarta Persistence.
```

O pacote utilizado é:

```java
jakarta.persistence
```

JPA é uma especificação.

Ela define contratos, anotações, interfaces e comportamentos.

Ela não é, sozinha, o mecanismo que executa SQL.

Uma implementação concreta é necessária.

Nesta aula, o provider será:

```text
Hibernate ORM.
```

A diferença central é:

```text
Jakarta Persistence:
especificação.

Hibernate ORM:
implementação e provider.
```

A aula 324 aprofundará Hibernate como implementação, SQL gerado, dialeto, configurações e trade-offs.

Nesta aula, Hibernate aparece apenas porque um provider é necessário para executar JPA.

O foco será o modelo mental de:

- persistence unit;
- `EntityManagerFactory`;
- `EntityManager`;
- persistence context;
- identidade de entidades;
- estados `transient`, `managed`, `detached` e `removed`;
- `persist`;
- `find`;
- `merge`;
- `remove`;
- `flush`;
- transações resource-local;
- fechamento do contexto;
- limites de thread safety.

O laboratório será executado sem Spring.

A aplicação criará manualmente:

```text
HikariDataSource;

EntityManagerFactory;

EntityManager;

EntityTransaction.
```

O schema será isolado:

```text
database:
formacao_java_jpa_323.

schema:
jpa_323.
```

Flyway continuará responsável pelo DDL.

JPA não criará nem atualizará tabelas automaticamente.

Isso evita misturar:

```text
evolução de schema;

mapeamento objeto-relacional.
```

A entidade didática será:

```java
ClienteEntity
```

Ela usará somente o mapeamento mínimo necessário.

As anotações `@Entity`, `@Id`, `@GeneratedValue`, `@Column` e outras serão aprofundadas em aulas específicas.

O objetivo agora não é decorar anotações.

É entender o ciclo de vida de uma entidade.

Ao final, você deverá conseguir explicar:

```text
por que uma entidade nova é transient;

quando persist a torna managed;

por que find devolve uma entidade managed;

como o persistence context garante identidade;

como detach interrompe o gerenciamento;

por que merge devolve outra referência;

quando remove marca uma entidade para exclusão;

por que flush não é commit;

por que EntityManager não deve ser global;

por que EntityManagerFactory deve ser reutilizada.
```

A próxima aula será:

```text
324 - M13.14 - Hibernate como implementacao
```

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection e DataSource.

313:
PreparedStatement e SQL Injection.

314:
ResultSet e tipos.

315:
DAO.

316:
Repository Pattern.

317:
tratamento de exceções.

318:
transações JDBC.

319:
HikariCP.

320 e 321:
mini projeto JDBC CRUD.

322:
Flyway.

323:
JPA conceitos fundamentais.

324:
Hibernate como implementação.
```

A formação entrou em ORM somente depois de:

- SQL;
- modelagem;
- constraints;
- índices;
- transações;
- JDBC;
- pool;
- migrations.

Essa ordem evita tratar JPA como mágica.

Nesta aula:

```text
Jakarta Persistence:
sim.

Hibernate provider:
somente bootstrap.

EntityManager:
sim.

persistence context:
sim.

estados da entidade:
sim.

mapeamento avançado:
não.

relacionamentos:
não.

JPQL:
não.

Spring:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-323-jpa-conceitos-fundamentais
```

Estrutura final:

```text
labs
└── m13
    └── aula-323-jpa-conceitos-fundamentais
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── jpa.local.env.example
        │   └── jpa.local.env
        ├── docs
        │   ├── jpa-vs-hibernate.md
        │   ├── mapa-persistence-context.md
        │   ├── estados-entidade.md
        │   └── troubleshooting-jpa.md
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
            │   │                   └── aula323
            │   │                       ├── Main.java
            │   │                       ├── config
            │   │                       │   ├── DatabaseSettings.java
            │   │                       │   ├── JpaRuntime.java
            │   │                       │   └── JpaRuntimeFactory.java
            │   │                       ├── entity
            │   │                       │   └── ClienteEntity.java
            │   │                       └── lab
            │   │                           ├── ClienteLifecycleLab.java
            │   │                           └── LifecycleReport.java
            │   └── resources
            │       ├── META-INF
            │       │   └── persistence.xml
            │       └── db
            │           └── migration
            │               └── V1__criar_schema_jpa_323.sql
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula323
                                        ├── JpaLifecycleIT.java
                                        └── TestDataCleaner.java
```

Resultados esperados:

```text
transient:
sem ID;
EntityManager.contains false.

managed após persist:
ID gerado;
contains true.

find repetido no mesmo contexto:
mesma referência Java.

detached:
contains false;
mudança posterior não persistida.

merge:
retorna referência managed;
objeto original continua detached.

remove:
registro excluído após commit.

rollback:
registro não permanece.

estado final:
zero Clientes didáticos.
```

---

## Conceito essencial

### JPA e Jakarta Persistence

JPA é o nome histórico amplamente usado.

A especificação atual pertence ao ecossistema Jakarta e utiliza:

```java
jakarta.persistence
```

Não use imports antigos:

```java
javax.persistence
```

em projetos modernos baseados em Jakarta Persistence.

A especificação define comportamento portável.

O provider implementa esse comportamento e conversa com JDBC.

---

### Provider

Um provider JPA implementa os contratos da especificação.

Exemplos conhecidos incluem Hibernate ORM e EclipseLink.

Nesta aula:

```text
provider:
Hibernate ORM 7.4.4.Final.

Jakarta Persistence API:
3.2.0.
```

O código da aplicação usará interfaces de:

```java
jakarta.persistence
```

e não APIs nativas do Hibernate.

Essa decisão mantém o laboratório focado na especificação.

---

### ORM

ORM significa:

```text
Object-Relational Mapping.
```

O mundo Java trabalha com:

```text
classes;

objetos;

referências;

herança;

coleções.
```

O banco relacional trabalha com:

```text
tabelas;

linhas;

colunas;

chaves;

foreign keys;

joins.
```

ORM coordena o mapeamento entre esses modelos.

Ele reduz código repetitivo, mas não elimina diferenças entre os paradigmas.

---

### Persistence unit

Uma persistence unit reúne a configuração JPA de um conjunto de classes gerenciadas.

Ela recebe um nome:

```text
aula323PU.
```

O arquivo padrão fica em:

```text
META-INF/persistence.xml.
```

Ele declara:

- nome;
- tipo de transação;
- provider;
- classes gerenciadas;
- cache;
- validação.

Credenciais não ficarão no XML.

Elas serão fornecidas em runtime.

---

### EntityManagerFactory

`EntityManagerFactory` é uma fábrica de `EntityManager`.

Características:

```text
custosa para criar;

thread-safe;

vida longa;

normalmente uma por persistence unit.
```

Não crie uma fábrica por operação.

No laboratório, ela será criada no startup e fechada no shutdown.

---

### EntityManager

`EntityManager` representa uma unidade de interação com o persistence context.

Ele oferece operações como:

```java
persist
find
merge
remove
flush
clear
detach
contains
```

Características:

```text
vida curta;

não thread-safe;

não deve ser global;

deve ser fechado.
```

Em uma aplicação web futura, normalmente cada unidade de trabalho receberá seu próprio contexto.

---

### Persistence context

Persistence context é o conjunto de entidades gerenciadas por um `EntityManager`.

Ele funciona como:

```text
mapa de identidade;

rastreador de estado;

unidade de sincronização.
```

Para uma mesma classe e o mesmo identificador, um persistence context mantém uma única instância gerenciada.

Exemplo:

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

first == second
```

Dentro do mesmo contexto, o resultado esperado é:

```text
true.
```

Isso é identidade de objeto no persistence context.

Não significa que a JVM inteira terá uma única instância.

Outro `EntityManager` pode produzir outra referência Java para a mesma linha.

---

### Estado transient

Uma entidade recém-criada com `new` é transient.

Exemplo:

```java
ClienteEntity cliente =
        new ClienteEntity(
                "CLI-JPA-323-001",
                "Cliente Transient"
        );
```

Características:

```text
não pertence ao contexto;

não representa ainda uma linha persistida;

normalmente não possui ID gerado;

contains retorna false.
```

Apenas criar o objeto não executa `INSERT`.

---

### Estado managed

Depois de:

```java
entityManager.persist(cliente);
```

a entidade entra no estado managed.

Características:

```text
pertence ao persistence context;

possui identidade persistente;

é monitorada pelo provider;

contains retorna true.
```

O momento exato do `INSERT` depende da estratégia de ID, do provider e do flush.

No laboratório, a sequence permite obter o identificador sem depender de `IDENTITY`.

---

### Estado detached

Uma entidade detached possui identidade persistente, mas não é mais gerenciada pelo contexto atual.

Ela pode ficar detached por:

```java
entityManager.detach(cliente);

entityManager.clear();

entityManager.close();
```

Alterar um objeto detached não sincroniza automaticamente a mudança.

Ele continua sendo um objeto Java normal.

---

### Estado removed

Uma entidade managed passada para:

```java
entityManager.remove(cliente);
```

é marcada para remoção.

O `DELETE` é sincronizado no flush ou commit.

Depois da conclusão, uma nova consulta não encontra a linha.

`remove` exige uma entidade managed.

Passar diretamente um objeto detached normalmente provoca erro.

---

### Persist

`persist` torna uma entidade nova gerenciada.

Ele não deve ser usado para uma entidade detached como se fosse update.

Persistir outra instância com identidade já existente pode gerar conflito.

Conceito:

```text
persist:
nova entidade.
```

---

### Find

`find` procura pela classe e pelo identificador.

Exemplo:

```java
ClienteEntity cliente =
        entityManager.find(
                ClienteEntity.class,
                1L
        );
```

Quando não encontra:

```text
null.
```

Diferente do repository JDBC anterior, a API padrão `find` não retorna `Optional`.

A aplicação pode envolver o resultado em `Optional`.

---

### Merge

`merge` copia o estado de uma entidade para uma instância managed.

Regra crítica:

```java
ClienteEntity managed =
        entityManager.merge(detached);
```

A referência retornada é a entidade managed.

O objeto passado continua detached.

Não faça:

```java
entityManager.merge(detached);

detached.alterarNome(...);
```

esperando sincronização.

Use o retorno:

```java
ClienteEntity managed =
        entityManager.merge(detached);

managed.alterarNome(...);
```

---

### Remove

Para remover uma entidade detached:

1. recupere uma managed com `find`;
2. ou use o retorno managed de `merge`;
3. chame `remove` na instância managed.

Nesta aula, o caminho recomendado é:

```java
ClienteEntity managed =
        entityManager.find(
                ClienteEntity.class,
                id
        );

entityManager.remove(managed);
```

---

### Flush

`flush` sincroniza alterações pendentes do persistence context com o banco.

Ele não finaliza a transação.

Depois de `flush`, ainda pode ocorrer:

```java
transaction.rollback();
```

e as alterações serem desfeitas.

Conceito:

```text
flush:
sincronizar.

commit:
confirmar.
```

O provider também executa flush automaticamente em momentos definidos.

---

### Transacao resource-local

O laboratório roda em Java SE.

O tipo será:

```text
RESOURCE_LOCAL.
```

A transação é controlada por:

```java
EntityTransaction transaction =
        entityManager.getTransaction();

transaction.begin();

transaction.commit();
```

Em falha:

```java
if (transaction.isActive()) {
    transaction.rollback();
}
```

Spring e JTA não serão usados.

---

### Clear e close

`clear()` desassocia todas as entidades do contexto, mas mantém o `EntityManager` aberto.

`close()` encerra o `EntityManager`.

Depois de fechado:

```text
não reutilize.
```

As entidades antes managed tornam-se detached.

---

### Thread safety

`EntityManagerFactory` pode ser compartilhada.

`EntityManager` não deve ser compartilhado entre threads concorrentes.

Errado:

```text
static EntityManager global.
```

Correto:

```text
factory compartilhada;

EntityManager criado por unidade de trabalho;

EntityManager fechado ao final.
```

---

### JPA nao substitui Flyway

JPA conhece mapeamento.

Flyway controla evolução do schema.

No laboratório:

```text
Flyway:
CREATE SCHEMA;
CREATE SEQUENCE;
CREATE TABLE.

JPA:
persist;
find;
merge;
remove.
```

Nenhuma propriedade de geração automática do schema será ativada.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\src\main\java\br\com\formacao\m13\aula323\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\src\main\java\br\com\formacao\m13\aula323\entity"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\src\main\java\br\com\formacao\m13\aula323\lab"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\src\main\resources\META-INF"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\src\main\resources\db\migration"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-323-jpa-conceitos-fundamentais\src\test\java\br\com\formacao\m13\aula323"

Set-Location `
  "labs\m13\aula-323-jpa-conceitos-fundamentais"
```

---

### 2. Criar .gitignore

```text
target/
.idea/
*.iml

config/jpa.local.env
```

---

### 3. Criar pom.xml

Use:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
             http://maven.apache.org/POM/4.0.0
             https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.formacao</groupId>
    <artifactId>aula-323-jpa-fundamentos</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>
            UTF-8
        </project.build.sourceEncoding>

        <jakarta.persistence.version>
            3.2.0
        </jakarta.persistence.version>
        <hibernate.version>
            7.4.4.Final
        </hibernate.version>
        <hikaricp.version>7.1.0</hikaricp.version>
        <postgresql.version>42.7.13</postgresql.version>
        <flyway.version>12.5.0</flyway.version>
        <slf4j.version>2.0.17</slf4j.version>
        <junit.version>5.10.2</junit.version>
        <failsafe.version>3.2.5</failsafe.version>
        <exec.version>3.1.0</exec.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>jakarta.persistence</groupId>
            <artifactId>
                jakarta.persistence-api
            </artifactId>
            <version>
                ${jakarta.persistence.version}
            </version>
        </dependency>

        <dependency>
            <groupId>org.hibernate.orm</groupId>
            <artifactId>hibernate-core</artifactId>
            <version>${hibernate.version}</version>
        </dependency>

        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>${hikaricp.version}</version>
        </dependency>

        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>${slf4j.version}</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.flywaydb</groupId>
                <artifactId>
                    flyway-maven-plugin
                </artifactId>
                <version>${flyway.version}</version>

                <configuration>
                    <url>${env.JPA_JDBC_URL}</url>
                    <user>${env.JPA_JDBC_USER}</user>
                    <password>
                        ${env.JPA_JDBC_PASSWORD}
                    </password>
                    <defaultSchema>jpa_323</defaultSchema>
                    <schemas>
                        <schema>jpa_323</schema>
                    </schemas>
                    <locations>
                        <location>
                            classpath:db/migration
                        </location>
                    </locations>
                    <cleanDisabled>true</cleanDisabled>
                </configuration>

                <dependencies>
                    <dependency>
                        <groupId>org.flywaydb</groupId>
                        <artifactId>
                            flyway-database-postgresql
                        </artifactId>
                        <version>${flyway.version}</version>
                    </dependency>

                    <dependency>
                        <groupId>org.postgresql</groupId>
                        <artifactId>postgresql</artifactId>
                        <version>
                            ${postgresql.version}
                        </version>
                    </dependency>
                </dependencies>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>
                    maven-failsafe-plugin
                </artifactId>
                <version>${failsafe.version}</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>integration-test</goal>
                            <goal>verify</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>${exec.version}</version>
                <configuration>
                    <mainClass>
                        br.com.formacao.m13.aula323.Main
                    </mainClass>
                    <classpathScope>runtime</classpathScope>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

### 4. Criar configuracao local

`config/jpa.local.env.example`:

```properties
JPA_JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java_jpa_323
JPA_JDBC_USER=formacao
JPA_JDBC_PASSWORD=formacao_local
JPA_APPLICATION_NAME=aula-323-jpa
JPA_POOL_NAME=aula-323-pool
JPA_POOL_SIZE=3
```

Copie para:

```text
config/jpa.local.env
```

Não versione o arquivo real.

---

### 5. Criar migration

`V1__criar_schema_jpa_323.sql`:

```sql
CREATE SCHEMA IF NOT EXISTS jpa_323;

CREATE SEQUENCE jpa_323.cliente_id_seq
    START WITH 323001
    INCREMENT BY 1;

CREATE TABLE jpa_323.cliente (
    id bigint NOT NULL
        DEFAULT nextval(
            'jpa_323.cliente_id_seq'
        ),
    codigo varchar(60) NOT NULL,
    nome varchar(120) NOT NULL,
    email varchar(160),
    ativo boolean NOT NULL DEFAULT true,
    versao integer NOT NULL DEFAULT 0,
    criado_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamptz NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_jpa_323_cliente
        PRIMARY KEY (id),

    CONSTRAINT uk_jpa_323_cliente_codigo
        UNIQUE (codigo),

    CONSTRAINT ck_jpa_323_cliente_codigo
        CHECK (btrim(codigo) <> ''),

    CONSTRAINT ck_jpa_323_cliente_nome
        CHECK (btrim(nome) <> '')
);
```

Flyway cria o schema.

JPA não gera DDL.

---

### 6. Criar persistence.xml

`src/main/resources/META-INF/persistence.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence
    xmlns="https://jakarta.ee/xml/ns/persistence"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="
        https://jakarta.ee/xml/ns/persistence
        https://jakarta.ee/xml/ns/persistence/persistence_3_2.xsd"
    version="3.2">

    <persistence-unit
        name="aula323PU"
        transaction-type="RESOURCE_LOCAL">

        <provider>
            org.hibernate.jpa.HibernatePersistenceProvider
        </provider>

        <class>
            br.com.formacao.m13.aula323.entity.ClienteEntity
        </class>

        <exclude-unlisted-classes>
            true
        </exclude-unlisted-classes>

        <shared-cache-mode>
            NONE
        </shared-cache-mode>

        <validation-mode>
            NONE
        </validation-mode>
    </persistence-unit>
</persistence>
```

Credenciais e DataSource serão fornecidos em runtime.

---

### 7. Criar ClienteEntity.java

```java
package br.com.formacao.m13.aula323.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(
        name = "cliente",
        schema = "jpa_323"
)
public class ClienteEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "cliente_seq"
    )
    @SequenceGenerator(
            name = "cliente_seq",
            sequenceName =
                    "jpa_323.cliente_id_seq",
            allocationSize = 1
    )
    private Long id;

    @Column(
            name = "codigo",
            nullable = false,
            unique = true,
            length = 60
    )
    private String codigo;

    @Column(
            name = "nome",
            nullable = false,
            length = 120
    )
    private String nome;

    @Column(
            name = "email",
            length = 160
    )
    private String email;

    @Column(
            name = "ativo",
            nullable = false
    )
    private boolean ativo;

    @Version
    @Column(
            name = "versao",
            nullable = false
    )
    private int versao;

    @Column(
            name = "criado_em",
            nullable = false
    )
    private OffsetDateTime criadoEm;

    @Column(
            name = "atualizado_em",
            nullable = false
    )
    private OffsetDateTime atualizadoEm;

    protected ClienteEntity() {
    }

    public ClienteEntity(
            String codigo,
            String nome,
            String email,
            OffsetDateTime agora
    ) {
        requireText(codigo, "codigo");
        requireText(nome, "nome");

        if (agora == null) {
            throw new IllegalArgumentException(
                    "agora é obrigatório"
            );
        }

        this.codigo = codigo.trim();
        this.nome = nome.trim();
        this.email = normalizeNullable(email);
        this.ativo = true;
        this.criadoEm = agora;
        this.atualizadoEm = agora;
    }

    public void alterarNome(
            String novoNome,
            OffsetDateTime agora
    ) {
        requireText(novoNome, "novoNome");

        if (agora == null) {
            throw new IllegalArgumentException(
                    "agora é obrigatório"
            );
        }

        this.nome = novoNome.trim();
        this.atualizadoEm = agora;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public int getVersao() {
        return versao;
    }

    private static void requireText(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " é obrigatório"
            );
        }
    }

    private static String normalizeNullable(
            String value
    ) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
```

O construtor sem argumentos existe para o provider.

Os detalhes das anotações serão aprofundados depois.

---

### 8. Criar DatabaseSettings.java

Crie um record que leia:

```text
JPA_JDBC_URL;

JPA_JDBC_USER;

JPA_JDBC_PASSWORD;

JPA_APPLICATION_NAME;

JPA_POOL_NAME;

JPA_POOL_SIZE.
```

Valide:

- textos obrigatórios;
- URL PostgreSQL;
- pool entre 1 e 10;
- senha nunca exposta em `toString`.

Use um `toString` manual com senha mascarada.

---

### 9. Criar JpaRuntime.java

```java
package br.com.formacao.m13.aula323.config;

import com.zaxxer.hikari.HikariDataSource;

import jakarta.persistence.EntityManagerFactory;

public final class JpaRuntime
        implements AutoCloseable {

    private final HikariDataSource dataSource;
    private final EntityManagerFactory entityManagerFactory;

    public JpaRuntime(
            HikariDataSource dataSource,
            EntityManagerFactory entityManagerFactory
    ) {
        this.dataSource = dataSource;
        this.entityManagerFactory =
                entityManagerFactory;
    }

    public EntityManagerFactory entityManagerFactory() {
        return entityManagerFactory;
    }

    @Override
    public void close() {
        try {
            if (entityManagerFactory.isOpen()) {
                entityManagerFactory.close();
            }
        } finally {
            dataSource.close();
        }
    }
}
```

A fábrica fecha antes do DataSource.

---

### 10. Criar JpaRuntimeFactory.java

```java
package br.com.formacao.m13.aula323.config;

import java.util.Map;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public final class JpaRuntimeFactory {

    public JpaRuntime create(
            DatabaseSettings settings
    ) {
        HikariConfig hikari =
                new HikariConfig();

        hikari.setPoolName(
                settings.poolName()
        );
        hikari.setJdbcUrl(
                settings.url()
        );
        hikari.setUsername(
                settings.user()
        );
        hikari.setPassword(
                settings.password()
        );
        hikari.setMaximumPoolSize(
                settings.poolSize()
        );
        hikari.setMinimumIdle(1);
        hikari.setAutoCommit(true);

        hikari.addDataSourceProperty(
                "ApplicationName",
                settings.applicationName()
        );

        HikariDataSource dataSource =
                new HikariDataSource(hikari);

        try {
            Map<String, Object> overrides =
                    Map.of(
                            "jakarta.persistence.dataSource",
                            dataSource
                    );

            EntityManagerFactory factory =
                    Persistence
                            .createEntityManagerFactory(
                                    "aula323PU",
                                    overrides
                            );

            return new JpaRuntime(
                    dataSource,
                    factory
            );
        } catch (RuntimeException exception) {
            dataSource.close();
            throw exception;
        }
    }
}
```

A propriedade `jakarta.persistence.dataSource` é padrão.

---

### 11. Criar LifecycleReport.java

```java
package br.com.formacao.m13.aula323.lab;

public record LifecycleReport(
        long id,
        boolean transientContained,
        boolean managedContained,
        boolean sameReferenceOnFind,
        boolean detachedContained,
        boolean mergeReturnedSameReference,
        boolean removedFromDatabase
) {
}
```

O report torna a demonstração verificável.

---

### 12. Criar ClienteLifecycleLab.java

Crie métodos privados para cada unidade de trabalho.

Método principal:

```java
public LifecycleReport execute()
```

Fluxo:

#### Etapa transient e persist

```java
ClienteEntity cliente =
        new ClienteEntity(
                "CLI-JPA-323-MAIN",
                "Cliente JPA Inicial",
                "jpa323@exemplo.com",
                OffsetDateTime.parse(
                        "2026-07-10T15:00:00-03:00"
                )
        );

boolean transientContained;

try (
    EntityManager entityManager =
            factory.createEntityManager()
) {
    transientContained =
            entityManager.contains(cliente);

    EntityTransaction transaction =
            entityManager.getTransaction();

    transaction.begin();

    entityManager.persist(cliente);

    boolean managedContained =
            entityManager.contains(cliente);

    entityManager.flush();

    transaction.commit();
}
```

Depois do fechamento:

```text
cliente está detached.
```

Guarde o ID.

#### Etapa identidade

Em novo `EntityManager`:

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

boolean sameReference =
        first == second;
```

#### Etapa detach

```java
entityManager.detach(first);

boolean detachedContained =
        entityManager.contains(first);

first.alterarNome(
        "Nome alterado fora do contexto",
        agora
);
```

Feche sem merge.

Em outro contexto, confirme que o nome não mudou.

#### Etapa merge

Use o objeto detached:

```java
EntityTransaction transaction =
        entityManager.getTransaction();

transaction.begin();

ClienteEntity managed =
        entityManager.merge(first);

boolean sameReference =
        managed == first;

managed.alterarNome(
        "Cliente JPA Mesclado",
        agora
);

transaction.commit();
```

Esperado:

```text
sameReference:
false.
```

#### Etapa remove

Em novo contexto:

```java
transaction.begin();

ClienteEntity managed =
        entityManager.find(
                ClienteEntity.class,
                id
        );

entityManager.remove(managed);

transaction.commit();
```

Em outro contexto:

```java
entityManager.find(
        ClienteEntity.class,
        id
)
```

deve retornar `null`.

Sempre trate rollback:

```java
catch (RuntimeException exception) {
    if (transaction.isActive()) {
        transaction.rollback();
    }

    throw exception;
}
```

---

### 13. Criar Main.java

```java
package br.com.formacao.m13.aula323;

import br.com.formacao.m13.aula323.config.DatabaseSettings;
import br.com.formacao.m13.aula323.config.JpaRuntimeFactory;
import br.com.formacao.m13.aula323.lab.ClienteLifecycleLab;

public final class Main {

    private Main() {
    }

    public static void main(String[] args) {
        DatabaseSettings settings =
                DatabaseSettings.fromEnvironment();

        try (
            var runtime =
                    new JpaRuntimeFactory()
                            .create(settings)
        ) {
            var report =
                    new ClienteLifecycleLab(
                            runtime
                                    .entityManagerFactory()
                    )
                            .execute();

            System.out.printf(
                    "ID: %d%n",
                    report.id()
            );
            System.out.printf(
                    "transient contido: %s%n",
                    report.transientContained()
            );
            System.out.printf(
                    "managed contido: %s%n",
                    report.managedContained()
            );
            System.out.printf(
                    "find preservou identidade: %s%n",
                    report.sameReferenceOnFind()
            );
            System.out.printf(
                    "detached contido: %s%n",
                    report.detachedContained()
            );
            System.out.printf(
                    "merge retornou o original: %s%n",
                    report.mergeReturnedSameReference()
            );
            System.out.printf(
                    "removido do banco: %s%n",
                    report.removedFromDatabase()
            );
        }
    }
}
```

Valores esperados:

```text
transient contido:
false.

managed contido:
true.

find preservou identidade:
true.

detached contido:
false.

merge retornou o original:
false.

removido do banco:
true.
```

---

### 14. Criar TestDataCleaner.java

A limpeza de testes usa JDBC diretamente no pacote de teste.

SQL:

```sql
DELETE FROM jpa_323.cliente
WHERE codigo LIKE 'CLI-JPA-323-%'
```

Use o mesmo `HikariDataSource` do runtime quando possível.

A classe não pertence à aplicação.

Ela existe para proteger repetibilidade dos testes.

---

### 15. Criar JpaLifecycleIT.java

Casos obrigatórios:

#### Transient para managed

1. criar entidade;
2. confirmar `contains=false`;
3. iniciar transação;
4. chamar `persist`;
5. confirmar `contains=true`;
6. confirmar ID;
7. rollback para não manter dado;
8. confirmar registro ausente.

#### Identidade do contexto

1. inserir fixture;
2. abrir novo `EntityManager`;
3. chamar `find` duas vezes;
4. confirmar `first == second`;
5. chamar `clear`;
6. buscar novamente;
7. confirmar referência diferente.

#### Detached nao sincroniza

1. carregar entidade;
2. chamar `detach`;
3. alterar nome;
4. commit sem merge;
5. abrir novo contexto;
6. confirmar nome original.

#### Merge retorna managed

1. carregar e desanexar;
2. alterar objeto detached;
3. chamar `merge`;
4. confirmar retorno diferente;
5. confirmar retorno managed;
6. confirmar original não managed;
7. commit;
8. verificar nome persistido.

#### Remove

1. carregar entidade managed;
2. chamar `remove`;
3. commit;
4. confirmar `find` nulo em novo contexto.

#### Flush nao e commit

1. persistir;
2. chamar `flush`;
3. confirmar ID;
4. executar rollback;
5. confirmar registro ausente.

---

### 16. Criar scripts

`01_criar_database.ps1` cria somente:

```text
formacao_java_jpa_323.
```

Use nome constante.

Não aceite entrada livre.

`02_executar_migration.ps1` carrega variáveis e executa:

```powershell
mvn flyway:info
mvn flyway:migrate
mvn flyway:validate
```

`03_executar_laboratorio.ps1` executa:

```powershell
mvn clean verify
mvn exec:java
```

`04_validar_estado_final.ps1` valida:

```sql
SELECT count(*) = 0
FROM jpa_323.cliente
WHERE codigo LIKE 'CLI-JPA-323-%';
```

Resultado:

```text
t.
```

`05_limpar_database.ps1` remove apenas o database do laboratório depois das evidências.

---

### 17. Executar o laboratorio

Ordem:

```powershell
.\scripts\01_criar_database.ps1
.\scripts\02_executar_migration.ps1
.\scripts\03_executar_laboratorio.ps1
.\scripts\04_validar_estado_final.ps1
```

Confirme:

```text
Flyway criou o schema;

EntityManagerFactory abriu;

persist criou ID;

contains identificou managed;

find preservou identidade;

detach interrompeu gerenciamento;

merge retornou outra instância;

remove excluiu;

flush seguido de rollback não persistiu;

pool e factory fecharam.
```

Depois de registrar evidências:

```powershell
.\scripts\05_limpar_database.ps1
```

---

### 18. Criar documentacao

`jpa-vs-hibernate.md` deve comparar:

```text
JPA:
especificação.

Hibernate:
provider.

jakarta.persistence:
API padrão.

org.hibernate:
API específica.
```

`mapa-persistence-context.md` deve desenhar:

```text
EntityManagerFactory
    -> EntityManager
        -> persistence context
            -> Cliente ID 323001
                -> uma instância managed.
```

`estados-entidade.md` deve documentar as transições:

```text
new:
transient.

persist:
managed.

detach/clear/close:
detached.

merge:
cópia para managed.

remove:
removed.

commit:
sincronização confirmada.
```

`troubleshooting-jpa.md` deve cobrir:

- persistence unit não encontrada;
- provider ausente;
- entidade não listada;
- tabela inexistente;
- sequence inexistente;
- transação não ativa;
- entidade detached em `remove`;
- `EntityManager` fechado;
- DataSource fechado cedo;
- migration não executada.

---

## Entendendo o que foi feito

### JPA foi usada sem Spring

O bootstrap ocorreu com `Persistence`, `EntityManagerFactory` e `EntityManager`.

### Hibernate apareceu como provider

O código do laboratório permaneceu nas APIs de `jakarta.persistence`.

### Flyway continuou dono do schema

O provider não criou nem alterou tabelas.

### O persistence context foi observado

Identidade, gerenciamento, detach e merge foram comprovados.

### Flush foi separado de commit

A operação sincronizou, mas o rollback removeu o resultado.

---

## Erros comuns importantes

### Confundir JPA com Hibernate

JPA é especificação; Hibernate é implementação.

### Criar EntityManagerFactory por operacao

A fábrica é cara e deve ser reutilizada.

### Compartilhar EntityManager entre threads

Ele não é thread-safe.

### Ignorar retorno de merge

O objeto original continua detached.

### Usar flush como commit

Flush não confirma a transação.

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

### Estado do schema

```sql
SELECT
    id,
    codigo,
    nome,
    versao
FROM jpa_323.cliente
ORDER BY id;
```

---

## Exercicio guiado

### Parte 1 — Clear

1. carregue uma entidade;
2. confirme `contains=true`;
3. execute `clear`;
4. confirme `contains=false`;
5. busque novamente;
6. confirme referência diferente.

Explique por que `clear` afeta todas as entidades do contexto.

### Parte 2 — Dois EntityManagers

Abra dois contextos.

Busque o mesmo ID em ambos.

Confirme:

```text
mesma linha;

referências Java diferentes.
```

### Parte 3 — Remove detached

1. carregue;
2. feche o `EntityManager`;
3. abra outro;
4. tente `remove` diretamente;
5. observe a falha;
6. corrija com `find`.

Não use `merge` automaticamente sem entender o custo.

### Parte 4 — Flush e rollback

Persista, execute `flush`, consulte a linha pela mesma transação e depois execute rollback.

Confirme ausência em novo contexto.

### Parte 5 — Merge

Altere um objeto detached.

Faça merge.

Compare:

```text
original;

retorno;

contains de cada um.
```

### Parte 6 — Factory

Crie um teste que use uma única `EntityManagerFactory` para dez contextos sequenciais.

Feche cada `EntityManager`.

Feche a fábrica somente ao final.

### Parte 7 — Falha de constraint

Tente persistir dois Clientes com o mesmo código.

Confirme:

- falha durante flush ou commit;
- rollback;
- transação não reutilizada;
- apenas um registro existente.

### Parte 8 — Arquitetura

Crie um script que proíba:

```text
static EntityManager;

new EntityManagerFactory em método de negócio;

jakarta.persistence no domínio puro;

org.hibernate fora da configuração.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- laboratório oficial da aula 323 existe;
- continuidade com a aula 322 foi preservada;
- Java 21 foi mantido;
- Jakarta Persistence API 3.2.0 foi configurada;
- Hibernate ORM foi usado somente como provider;
- HikariCP foi configurado;
- pgJDBC foi configurado;
- Flyway foi mantido para DDL;
- database isolado foi criado;
- schema `jpa_323` foi criado;
- `projeto_os_final` não foi alterado;
- configuração real está fora do Git;
- senha não aparece em `persistence.xml`;
- persistence unit foi criada;
- tipo `RESOURCE_LOCAL` foi usado;
- classe gerenciada foi listada;
- classes não listadas foram excluídas;
- cache compartilhado ficou desativado;
- `EntityManagerFactory` foi criada uma vez;
- fábrica foi fechada no shutdown;
- `EntityManager` foi criado por unidade;
- `EntityManager` foi fechado;
- nenhum `EntityManager` global existe;
- `ClienteEntity` foi criada;
- construtor protegido sem argumentos existe;
- entidade possui identidade;
- transient foi demonstrado;
- managed foi demonstrado;
- detached foi demonstrado;
- removed foi demonstrado;
- `persist` foi executado;
- `find` foi executado;
- identidade no mesmo contexto foi comprovada;
- `detach` foi executado;
- mudança detached não persistiu;
- `merge` foi executado;
- retorno de merge foi usado;
- original continuou detached;
- `remove` foi executado em managed;
- `flush` foi executado;
- flush foi diferenciado de commit;
- rollback após flush foi comprovado;
- `clear` foi estudado;
- fechamento desanexou entidades;
- transação resource-local foi usada;
- rollback em falha foi implementado;
- testes de integração foram criados;
- fixtures usam prefixo reservado;
- fixtures foram removidas;
- estado final ficou limpo;
- JPA não gerou schema;
- relacionamentos não foram antecipados;
- JPQL não foi antecipada;
- detalhes nativos do Hibernate não foram aprofundados;
- Spring não foi usado;
- JPA e Hibernate foram diferenciados;
- ponte para a aula 324 está correta;
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
  labs/m13/aula-323-jpa-conceitos-fundamentais
```

Commit recomendado:

```powershell
git commit -m "feat(m13): praticar fundamentos e ciclo de vida jpa"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou JPA sem Spring e sem abandonar os fundamentos de SQL e JDBC.

Aprendeu:

```text
JPA é especificação;

Hibernate é provider;

persistence unit organiza configuração;

EntityManagerFactory cria contextos;

EntityManager possui vida curta;

persistence context gerencia identidade;

transient ainda não é persistida;

managed pertence ao contexto;

detached possui identidade sem gerenciamento;

removed está marcada para exclusão;

persist gerencia entidade nova;

find busca por identidade;

merge copia estado e retorna managed;

remove exige managed;

flush sincroniza;

commit confirma.
```

O laboratório comprovou:

```text
mesma identidade no mesmo contexto;

referência diferente após clear;

detach impedindo sincronização;

merge retornando outra instância;

remove excluindo após commit;

rollback desfazendo flush;

Flyway controlando o schema;

HikariCP fornecendo DataSource.
```

A próxima aula será:

```text
324 - M13.14 - Hibernate como implementacao
```

Nela, você aprofundará:

- papel do Hibernate;
- arquitetura interna;
- `SessionFactory` e `Session`;
- relação com `EntityManagerFactory`;
- dialeto;
- SQL gerado;
- logging;
- propriedades de configuração;
- bootstrapping;
- integração com HikariCP;
- schema validation;
- estatísticas;
- trade-offs;
- recursos nativos;
- portabilidade;
- quando usar API JPA e quando usar API Hibernate.

JPA continuará sendo o contrato principal.

Hibernate será estudado como implementação concreta.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei JPA de Hibernate.
- [ ] Expliquei persistence unit, factory, manager e context.
- [ ] Pratiquei os quatro estados de entidade.
- [ ] Entendi que merge retorna outra referência.
- [ ] Diferenciei flush de commit.

---

## Troubleshooting adicional

### No Persistence provider

Confirme `hibernate-core` e o provider no XML.

### No Persistence provider for EntityManager named aula323PU

Confirme:

```text
src/main/resources/META-INF/persistence.xml.
```

### Unknown entity

Confirme a classe no persistence unit e `@Entity`.

### Relation does not exist

Execute Flyway antes de iniciar JPA.

### Sequence does not exist

Confirme `cliente_id_seq` e o schema configurado.

---

## Perguntas de revisao

1. O que é JPA?
2. Qual é o nome atual da especificação?
3. JPA executa sozinha?
4. O que é provider?
5. Qual provider foi usado?
6. O que é persistence unit?
7. O que é EntityManagerFactory?
8. Ela é thread-safe?
9. O que é EntityManager?
10. Ele é thread-safe?
11. O que é persistence context?
12. O que é transient?
13. O que é managed?
14. O que é detached?
15. O que é removed?
16. O que faz persist?
17. O que find retorna quando não encontra?
18. O que merge retorna?
19. Flush é commit?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Especificação de persistência e ORM.
2. Jakarta Persistence.
3. Não; precisa de provider.
4. Implementação da especificação.
5. Hibernate ORM.
6. Unidade de configuração JPA.
7. Fábrica de EntityManagers.
8. Sim.
9. Contexto de interação com persistência.
10. Não.
11. Conjunto de entidades gerenciadas.
12. Objeto novo não gerenciado.
13. Entidade gerenciada.
14. Entidade persistente não gerenciada.
15. Entidade marcada para remoção.
16. Torna nova entidade managed.
17. `null`.
18. Uma instância managed.
19. Não.
20. Hibernate como implementação.

---

## Desafio opcional

Crie:

```java
PersistenceContextInspector
```

Entrada:

```text
EntityManager;

Object.
```

Saída:

```text
managed;

factory aberta;

manager aberto;

transaction ativa;

classe;

identificador, quando disponível.
```

Use:

```java
EntityManagerFactory
        .getPersistenceUnitUtil()
        .getIdentifier(entity)
```

Regras:

- não usar APIs nativas Hibernate;
- não alterar estado;
- não imprimir senha;
- testar transient, managed e detached;
- tratar entidade sem ID;
- não transformar o inspector em regra de negócio.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 323 - M13.13 - JPA conceitos fundamentais

- Iniciei o estudo de Jakarta Persistence sem Spring.
- Diferenciei JPA de Hibernate.
- Entendi JPA como especificação e Hibernate como provider.
- Mantive Flyway responsável pelo schema.
- Criei uma persistence unit `RESOURCE_LOCAL`.
- Usei `persistence.xml`.
- Forneci um HikariDataSource por configuração padrão.
- Criei uma única `EntityManagerFactory`.
- Criei e fechei `EntityManager` por unidade de trabalho.
- Entendi que `EntityManager` não é thread-safe.
- Entendi o persistence context como mapa de identidade.
- Criei `ClienteEntity` com mapeamento mínimo.
- Pratiquei o estado transient.
- Pratiquei o estado managed.
- Pratiquei o estado detached.
- Pratiquei o estado removed.
- Usei `persist`.
- Usei `find`.
- Comprovei identidade no mesmo contexto.
- Usei `detach`.
- Entendi que mudanças detached não sincronizam.
- Usei `merge`.
- Entendi que merge retorna uma instância managed diferente.
- Usei `remove` em entidade managed.
- Usei `flush`.
- Diferenciei flush de commit.
- Comprovei rollback depois de flush.
- Usei `clear` para desanexar todas as entidades.
- Mantive credenciais fora do Git.
- Preservei o schema oficial.
- Não antecipei relacionamentos, JPQL ou Spring.
- Próxima aula: Hibernate como implementação.
```

---

## Referencia tecnica curta

```text
JPA:
especificação.

Jakarta Persistence:
API atual.

Hibernate:
provider.

Persistence unit:
configuração.

EntityManagerFactory:
fábrica longa.

EntityManager:
contexto curto.

Persistence context:
identidade e gerenciamento.

Transient:
novo.

Managed:
gerenciado.

Detached:
desanexado.

Removed:
marcado para exclusão.

Flush:
sincronizar.

Commit:
confirmar.
```

Regra final:

```text
entender JPA exige compreender o persistence context e o ciclo de vida das entidades; sem esse modelo mental, persist, merge, remove e flush parecem magica e produzem erros dificeis de diagnosticar.
```
