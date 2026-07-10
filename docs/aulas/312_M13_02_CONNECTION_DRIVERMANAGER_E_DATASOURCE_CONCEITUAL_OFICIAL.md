# 312 - M13.02 - Connection DriverManager e DataSource conceitual

## Apresentacao da aula

Na aula 311, você iniciou o módulo M13 compreendendo a base da comunicação entre Java e PostgreSQL.

O laboratório anterior comprovou:

```text
a API JDBC pertence ao JDK;

o driver PostgreSQL vem de um JAR externo;

o Maven coloca o driver no classpath de runtime;

o ServiceLoader encontra org.postgresql.Driver;

o driver aceita a URL PostgreSQL;

a configuração fica fora do código;

nenhuma conexão foi aberta.
```

Agora será aberta a primeira conexão real.

O objeto central da aula é:

```java
java.sql.Connection
```

Uma `Connection` representa uma sessão ativa entre a aplicação Java e o database PostgreSQL.

Ela não representa:

```text
uma tabela;

um repositório;

uma consulta;

uma transação completa por definição;

um pool;

um singleton global.
```

A conexão mantém estado.

Exemplos:

- usuário autenticado;
- database atual;
- schema atual;
- modo de autocommit;
- isolamento;
- modo de leitura;
- timeout de rede;
- transação em andamento;
- recursos associados.

Por isso, ela precisa possuir ciclo de vida claro.

A aplicação deve saber:

```text
quando obter;

quem usa;

por quanto tempo;

quando fechar;

o que acontece em caso de erro.
```

Nesta aula, a conexão será obtida por:

```java
DriverManager.getConnection(...)
```

O `DriverManager` utilizará os drivers JDBC disponíveis e escolherá aquele que aceita a URL:

```text
jdbc:postgresql://localhost:5433/formacao_java
```

A senha usará `Properties`.

Ela não será colocada na URL e não será impressa.

A conexão será fechada com:

```java
try-with-resources
```

Você também conhecerá conceitualmente:

```java
javax.sql.DataSource
```

`DataSource` é uma abstração para obtenção de conexões.

Ele pode representar:

- configuração do fornecedor;
- recurso administrado por container;
- origem registrada por JNDI;
- pool de conexões;
- adaptador da aplicação.

Entretanto:

```text
DataSource não significa pool automaticamente.
```

Uma implementação simples pode criar uma conexão física a cada chamada.

Uma implementação com pool pode entregar uma conexão lógica e devolver o recurso ao pool quando `close()` é chamado.

O laboratório não adicionará pool nem classe específica do fornecedor.

O conceito será demonstrado por uma abstração própria:

```java
ConnectionProvider
```

e por dois adaptadores:

```text
DriverManagerConnectionProvider:
implementado e utilizado nesta aula.

DataSourceConnectionProvider:
implementado contra javax.sql.DataSource,
mas não instanciado.
```

A aplicação continuará independente da origem. Ela abrirá a sessão, inspecionará metadados e fechará o recurso, sem criar `Statement`, `PreparedStatement`, `ResultSet` ou executar SQL de negócio.

Próxima aula:

```text
313 - M13.03 - PreparedStatement e SQL Injection
```

Nela, a conexão será usada para executar SQL parametrizado com segurança.

---

## Onde estamos na formacao

A sequência inicial do M13 é:

```text
311:
JDBC e driver PostgreSQL.

312:
Connection, DriverManager e DataSource conceitual.

313:
PreparedStatement e SQL Injection.

314:
ResultSet e leitura de dados.

315:
Mapeamento manual de linha para objeto.
```

Na aula 311:

```text
driver encontrado:
sim.

conexão:
não.
```

Na aula 312:

```text
driver encontrado:
sim.

conexão aberta:
sim.

sessão inspecionada:
sim.

conexão fechada:
sim.

SQL executado:
não.
```

Essa separação valida infraestrutura, autenticação, database, schema e fechamento antes de adicionar consultas. Se a aula 313 falhar, o diagnóstico começará depois da camada de conexão.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-312-connection-drivermanager-datasource-conceitual
```

Estrutura final:

```text
labs
└── m13
    └── aula-312-connection-drivermanager-datasource-conceitual
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── ciclo-vida-connection.md
        │   ├── contrato-configuracao.md
        │   ├── drivermanager-vs-datasource.md
        │   └── troubleshooting-conexao.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_conexao.ps1
        │   └── 03_testar_falhas_controladas.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula312
            │                           ├── ConnectionInspector.java
            │                           ├── ConnectionProvider.java
            │                           ├── ConnectionSnapshot.java
            │                           ├── DatabaseSettings.java
            │                           ├── DataSourceConnectionProvider.java
            │                           ├── DriverManagerConnectionProvider.java
            │                           └── Main.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula312
                                        ├── ConnectionLifecycleIT.java
                                        └── DatabaseSettingsTest.java
```

Resultado esperado:

```text
database:
formacao_java.

schema:
projeto_os_final.

usuário:
formacao.

produto:
PostgreSQL.

driver:
PostgreSQL JDBC Driver.

autocommit:
true.

read only:
false.

isolamento:
READ_COMMITTED.

conexão válida:
true.

fechada dentro do try:
false.

fechada depois do try:
true.
```

A versão exata do PostgreSQL e do driver dependerá do ambiente instalado.

---

## Conceito essencial

### Connection representa uma sessao

Uma conexão mantém usuário, database, schema, autocommit, isolamento, transação, locks e recursos associados. Ela consome recursos na JVM, rede e servidor; por isso, deve ser obtida, usada e fechada em escopo claro.

### Conexao fisica e conexao logica

Com `DriverManager`, a chamada abre uma sessão física e `close()` a encerra. Em um pool, a aplicação normalmente recebe uma conexão lógica; `close()` devolve o recurso para reutilização. O consumidor deve fechar a conexão nos dois modelos.

### DriverManager

`DriverManager` é uma classe estática do JDBC.

Responsabilidades:

- conhecer drivers registrados;
- perguntar qual driver aceita a URL;
- encaminhar propriedades;
- solicitar uma conexão;
- aplicar login timeout global quando configurado;
- devolver `Connection` ou lançar `SQLException`.

Exemplo central:

```java
DriverManager.getConnection(
        url,
        properties
)
```

O método não precisa receber a classe `org.postgresql.Driver`.

A seleção ocorre pela URL e pelos drivers disponíveis.

---

### Sequencia conceitual do getConnection

`DriverManager.getConnection` seleciona o driver pela URL, interpreta host, porta e database, inicia a comunicação, autentica o usuário, negocia a sessão e devolve uma implementação de `Connection`. Falhas podem ocorrer em qualquer etapa e são relatadas por `SQLException`.

### SQLState

SQLState é um código padronizado de cinco caracteres.

A classe é indicada pelos dois primeiros.

Exemplos relevantes:

```text
08:
falha de conexão.

28:
autorização ou autenticação.

3D:
database inválido.
```

Códigos PostgreSQL que podem aparecer:

```text
08001:
não foi possível estabelecer a conexão.

28P01:
senha inválida.

3D000:
database não existe.
```

A mensagem humana pode mudar.

O SQLState é mais apropriado para classificação programática.

Nesta aula, o `Main` exibirá SQLState sem imprimir credenciais.

---

### Properties em vez de senha na URL

Evite:

```text
jdbc:postgresql://host:porta/database?user=...&password=...
```

URLs aparecem facilmente em:

- logs;
- mensagens;
- métricas;
- configurações;
- ferramentas;
- traces.

Use:

```java
Properties properties = new Properties();

properties.setProperty(
        "user",
        settings.user()
);

properties.setProperty(
        "password",
        settings.password()
);
```

O segredo ainda existe em memória.

A vantagem é reduzir exposição acidental na URL.

---

### Propriedades PostgreSQL usadas

O laboratório enviará `user`, `password`, `ApplicationName`, `currentSchema`, `connectTimeout`, `socketTimeout` e `tcpKeepAlive`.

`ApplicationName` identifica a sessão; `currentSchema` define o schema inicial; `connectTimeout` limita a abertura; `socketTimeout` limita leituras no socket; `tcpKeepAlive` solicita keepalive TCP. Essas propriedades pertencem ao driver PostgreSQL.

### Login timeout do DriverManager

O método:

```java
DriverManager.setLoginTimeout(...)
```

configura um valor global para o processo Java.

Isso significa:

```text
não pertence a uma Connection específica;

pode afetar chamadas concorrentes na mesma JVM.
```

O provider salvará o valor anterior, aplicará o timeout durante a abertura e o restaurará.

---

### Autocommit

Uma nova conexão JDBC normalmente começa com:

```java
connection.getAutoCommit()
```

igual a:

```text
true.
```

Nesse modo, cada comando SQL executado individualmente é confirmado automaticamente quando termina com sucesso.

Esta aula não executará comandos.

Apenas observará o estado.

Transações manuais serão aprofundadas em aulas posteriores.

Regra importante:

```text
autocommit não significa ausência de transação no banco.
```

Cada comando ainda executa dentro de uma transação.

O que muda é quem controla o limite.

---

### Read only

O método:

```java
connection.isReadOnly()
```

mostra a intenção configurada na conexão.

`setReadOnly(true)` é uma indicação e pode influenciar comportamento do driver e do banco.

Não trate `readOnly` como mecanismo de autorização.

Segurança real depende de:

- grants;
- roles;
- políticas;
- transações;
- permissões do servidor.

A role `formacao` do ambiente didático possui acesso maior que uma role de runtime profissional.

---

### Isolamento

O PostgreSQL usa normalmente:

```text
READ COMMITTED
```

como nível padrão.

A API JDBC representa níveis por constantes:

```java
Connection.TRANSACTION_READ_COMMITTED;

Connection.TRANSACTION_REPEATABLE_READ;

Connection.TRANSACTION_SERIALIZABLE.
```

O snapshot converterá o inteiro para um nome legível.

---

### Catalog e schema

No PostgreSQL, `catalog` corresponde normalmente ao database e `schema` é um namespace interno. Com `currentSchema=projeto_os_final`, o snapshot deve mostrar `formacao_java` e `projeto_os_final`.

### DatabaseMetaData

Uma `Connection` fornece:

```java
connection.getMetaData()
```

O objeto `DatabaseMetaData` descreve:

- produto do banco;
- versão;
- driver;
- versão JDBC;
- URL;
- usuário;
- capacidades;
- limites;
- recursos suportados.

Nesta aula, ele será usado somente para inspeção.

Não serão listadas tabelas nem executadas consultas de negócio.

---

### isValid

O método:

```java
connection.isValid(2)
```

verifica se a conexão continua válida dentro do timeout informado.

O driver pode realizar comunicação com o servidor.

Isso não substitui estratégia de health check nem validação de uma transação de negócio.

Também não deve ser chamado antes de toda consulta por hábito.

Pools possuem mecanismos próprios de validação.

---

### isClosed

`isClosed()` informa se o objeto foi fechado.

Antes do `close()`:

```text
false.
```

Depois:

```text
true.
```

Ele não testa necessariamente toda a saúde da rede.

Uma conexão pode ainda não estar marcada como fechada e falhar na próxima operação.

Para o ciclo de vida local, será usado como evidência do fechamento.

---

### AutoCloseable e try-with-resources

`Connection` implementa `AutoCloseable`. O `try-with-resources` chama `close()` em sucesso ou exceção. Desde Java 9, uma variável efetivamente final pode ser declarada antes do bloco e inspecionada depois.

### Ordem de fechamento

Em um futuro `try` com `Connection`, `PreparedStatement` e `ResultSet`, os recursos serão fechados na ordem inversa. Nesta aula, existe apenas a conexão.

### Connection nao deve ser singleton global

Uma conexão global compartilha estado transacional entre threads, pode ser fechada pelo consumidor errado e dificulta recuperação. Obtenha por unidade de trabalho e libere rapidamente; com pool, `close()` devolve o recurso.

### DataSource

`javax.sql.DataSource` abstrai a obtenção de conexões. Ele centraliza configuração, facilita injeção, permite implementação do fornecedor, recurso gerenciado ou pool e melhora a testabilidade. O consumidor pode depender apenas de `ConnectionProvider`, sem conhecer a origem concreta.

### DataSource nao e necessariamente pool

Esta distinção é obrigatória.

Uma implementação como um datasource simples pode abrir uma conexão física a cada chamada.

Um datasource de pooling mantém um conjunto reutilizável.

Ambos implementam a mesma interface.

Portanto:

```text
usa DataSource
```

não é evidência suficiente de que existe pooling.

É necessário identificar a implementação concreta.

---

### DataSourceConnectionProvider

O adaptador recebe `DataSource` e chama `getConnection()`. Nenhuma implementação concreta será criada; o código apenas demonstra a troca da origem mantendo `ConnectionProvider`.

### Pool de conexoes

Um pool mantém conexões físicas reutilizáveis e entrega conexões lógicas. Ao receber `close()`, restaura o estado e devolve o recurso. Ele não corrige SQL lento, transações ruins, vazamentos ou credenciais excessivas. Pooling será aprofundado depois.

### Fronteira da aula

O Java pode consultar metadados da conexão sem criar um `Statement`.

Isso não será usado como atalho para executar SQL.

O projeto não conterá:

```java
createStatement();

prepareStatement();

execute();

executeQuery();

executeUpdate();
```

Essa ausência será validada por script.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-312-connection-drivermanager-datasource-conceitual\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-312-connection-drivermanager-datasource-conceitual\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-312-connection-drivermanager-datasource-conceitual\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-312-connection-drivermanager-datasource-conceitual\src\main\java\br\com\formacao\m13\aula312"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-312-connection-drivermanager-datasource-conceitual\src\test\java\br\com\formacao\m13\aula312"

Set-Location `
  "labs\m13\aula-312-connection-drivermanager-datasource-conceitual"
```

---

### 2. Criar .gitignore

Crie:

```text
.gitignore
```

Conteúdo:

```text
target/
.idea/
*.iml

config/database.local.env
```

---

### 3. Criar pom.xml

Crie:

```text
pom.xml
```

Conteúdo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="
             http://maven.apache.org/POM/4.0.0
             https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.formacao</groupId>
    <artifactId>aula-312-jdbc-connection</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <name>
        Aula 312 - Connection DriverManager e DataSource
    </name>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>
            UTF-8
        </project.build.sourceEncoding>

        <postgresql.version>42.7.13</postgresql.version>
        <junit.version>5.10.2</junit.version>
        <surefire.version>3.2.5</surefire.version>
        <failsafe.version>3.2.5</failsafe.version>
        <exec.version>3.1.0</exec.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
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
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${surefire.version}</version>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-failsafe-plugin</artifactId>
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
                        br.com.formacao.m13.aula312.Main
                    </mainClass>
                    <classpathScope>runtime</classpathScope>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

`mvn test` executará testes unitários.

`mvn verify` também executará arquivos terminados em `IT`.

---

### 4. Criar a configuracao local

Crie:

```text
config/database.local.env.example
```

Conteúdo:

```properties
JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java
JDBC_USER=formacao
JDBC_PASSWORD=formacao_local
JDBC_SCHEMA=projeto_os_final
JDBC_APPLICATION_NAME=aula-312-jdbc
JDBC_LOGIN_TIMEOUT_SECONDS=5
JDBC_CONNECT_TIMEOUT_SECONDS=5
JDBC_SOCKET_TIMEOUT_SECONDS=10
```

Copie:

```powershell
Copy-Item `
  ".\config\database.local.env.example" `
  ".\config\database.local.env"
```

Confirme que o arquivo real não aparece no Git.

---

### 5. Criar DatabaseSettings.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/DatabaseSettings.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import java.util.Map;
import java.util.Objects;
import java.util.Properties;

public record DatabaseSettings(
        String url,
        String user,
        String password,
        String schema,
        String applicationName,
        int loginTimeoutSeconds,
        int connectTimeoutSeconds,
        int socketTimeoutSeconds
) {

    private static final String POSTGRESQL_PREFIX =
            "jdbc:postgresql://";

    public DatabaseSettings {
        url = requireText(url, "JDBC_URL");
        user = requireText(user, "JDBC_USER");
        password = requireText(
                password,
                "JDBC_PASSWORD"
        );
        schema = requireText(
                schema,
                "JDBC_SCHEMA"
        );
        applicationName = requireText(
                applicationName,
                "JDBC_APPLICATION_NAME"
        );

        requirePositive(
                loginTimeoutSeconds,
                "JDBC_LOGIN_TIMEOUT_SECONDS"
        );
        requirePositive(
                connectTimeoutSeconds,
                "JDBC_CONNECT_TIMEOUT_SECONDS"
        );
        requirePositive(
                socketTimeoutSeconds,
                "JDBC_SOCKET_TIMEOUT_SECONDS"
        );

        if (!url.startsWith(POSTGRESQL_PREFIX)) {
            throw new IllegalArgumentException(
                    "JDBC_URL deve começar com "
                            + POSTGRESQL_PREFIX
            );
        }
    }

    public static DatabaseSettings fromEnvironment() {
        return from(System.getenv());
    }

    static DatabaseSettings from(
            Map<String, String> environment
    ) {
        Objects.requireNonNull(
                environment,
                "environment não pode ser nulo"
        );

        return new DatabaseSettings(
                environment.get("JDBC_URL"),
                environment.get("JDBC_USER"),
                environment.get("JDBC_PASSWORD"),
                environment.get("JDBC_SCHEMA"),
                environment.get(
                        "JDBC_APPLICATION_NAME"
                ),
                parsePositiveInt(
                        environment.get(
                                "JDBC_LOGIN_TIMEOUT_SECONDS"
                        ),
                        "JDBC_LOGIN_TIMEOUT_SECONDS"
                ),
                parsePositiveInt(
                        environment.get(
                                "JDBC_CONNECT_TIMEOUT_SECONDS"
                        ),
                        "JDBC_CONNECT_TIMEOUT_SECONDS"
                ),
                parsePositiveInt(
                        environment.get(
                                "JDBC_SOCKET_TIMEOUT_SECONDS"
                        ),
                        "JDBC_SOCKET_TIMEOUT_SECONDS"
                )
        );
    }

    public Properties connectionProperties() {
        Properties properties = new Properties();

        properties.setProperty(
                "user",
                user
        );
        properties.setProperty(
                "password",
                password
        );
        properties.setProperty(
                "ApplicationName",
                applicationName
        );
        properties.setProperty(
                "currentSchema",
                schema
        );
        properties.setProperty(
                "connectTimeout",
                Integer.toString(
                        connectTimeoutSeconds
                )
        );
        properties.setProperty(
                "socketTimeout",
                Integer.toString(
                        socketTimeoutSeconds
                )
        );
        properties.setProperty(
                "tcpKeepAlive",
                Boolean.TRUE.toString()
        );

        return properties;
    }

    public String safeDescription() {
        return """
                URL: %s
                usuário: %s
                schema: %s
                aplicação: %s
                login timeout: %d s
                connect timeout: %d s
                socket timeout: %d s
                senha configurada: true
                """.formatted(
                url,
                user,
                schema,
                applicationName,
                loginTimeoutSeconds,
                connectTimeoutSeconds,
                socketTimeoutSeconds
        ).strip();
    }

    private static String requireText(
            String value,
            String variableName
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Variável obrigatória ausente: "
                            + variableName
            );
        }

        return value.trim();
    }

    private static int parsePositiveInt(
            String value,
            String variableName
    ) {
        String normalized = requireText(
                value,
                variableName
        );

        try {
            int parsed = Integer.parseInt(
                    normalized
            );

            requirePositive(
                    parsed,
                    variableName
            );

            return parsed;
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException(
                    "Variável deve ser inteira: "
                            + variableName,
                    exception
            );
        }
    }

    private static void requirePositive(
            int value,
            String variableName
    ) {
        if (value <= 0 || value > 60) {
            throw new IllegalArgumentException(
                    "Variável deve estar entre 1 e 60: "
                            + variableName
            );
        }
    }
}
```

As propriedades PostgreSQL ficam concentradas em uma única classe.

---

### 6. Criar ConnectionProvider.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/ConnectionProvider.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import java.sql.Connection;
import java.sql.SQLException;

@FunctionalInterface
public interface ConnectionProvider {

    Connection open() throws SQLException;
}
```

A camada consumidora depende de um contrato pequeno.

---

### 7. Criar DriverManagerConnectionProvider.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/DriverManagerConnectionProvider.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Objects;

public final class DriverManagerConnectionProvider
        implements ConnectionProvider {

    private final DatabaseSettings settings;

    public DriverManagerConnectionProvider(
            DatabaseSettings settings
    ) {
        this.settings = Objects.requireNonNull(
                settings,
                "settings não pode ser nulo"
        );
    }

    @Override
    public Connection open() throws SQLException {
        int previousLoginTimeout =
                DriverManager.getLoginTimeout();

        try {
            DriverManager.setLoginTimeout(
                    settings.loginTimeoutSeconds()
            );

            return DriverManager.getConnection(
                    settings.url(),
                    settings.connectionProperties()
            );
        } finally {
            DriverManager.setLoginTimeout(
                    previousLoginTimeout
            );
        }
    }
}
```

O provider restaura a configuração global depois da tentativa.

---

### 8. Criar DataSourceConnectionProvider.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/DataSourceConnectionProvider.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Objects;

import javax.sql.DataSource;

public final class DataSourceConnectionProvider
        implements ConnectionProvider {

    private final DataSource dataSource;

    public DataSourceConnectionProvider(
            DataSource dataSource
    ) {
        this.dataSource = Objects.requireNonNull(
                dataSource,
                "dataSource não pode ser nulo"
        );
    }

    @Override
    public Connection open() throws SQLException {
        return dataSource.getConnection();
    }
}
```

A classe compila sem pool.

Ela não será instanciada no `Main`.

---

### 9. Criar ConnectionSnapshot.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/ConnectionSnapshot.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

public record ConnectionSnapshot(
        String databaseProduct,
        String databaseVersion,
        String driverName,
        String driverVersion,
        int jdbcMajorVersion,
        int jdbcMinorVersion,
        String url,
        String userName,
        String catalog,
        String schema,
        boolean autoCommit,
        boolean readOnly,
        String transactionIsolation,
        int networkTimeoutMillis,
        boolean valid
) {

    public String formatted() {
        return """
                produto: %s
                versão do database: %s
                driver: %s
                versão do driver: %s
                versão JDBC: %d.%d
                URL: %s
                usuário autenticado: %s
                catalog: %s
                schema: %s
                autocommit: %s
                read only: %s
                isolamento: %s
                network timeout: %d ms
                conexão válida: %s
                """.formatted(
                databaseProduct,
                databaseVersion,
                driverName,
                driverVersion,
                jdbcMajorVersion,
                jdbcMinorVersion,
                url,
                userName,
                catalog,
                schema,
                autoCommit,
                readOnly,
                transactionIsolation,
                networkTimeoutMillis,
                valid
        ).strip();
    }
}
```

A URL do metadata não contém a senha porque ela não foi colocada na URL original.

---

### 10. Criar ConnectionInspector.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/ConnectionInspector.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

public final class ConnectionInspector {

    private ConnectionInspector() {
    }

    public static ConnectionSnapshot inspect(
            Connection connection
    ) throws SQLException {
        DatabaseMetaData metadata =
                connection.getMetaData();

        return new ConnectionSnapshot(
                metadata.getDatabaseProductName(),
                metadata.getDatabaseProductVersion(),
                metadata.getDriverName(),
                metadata.getDriverVersion(),
                metadata.getJDBCMajorVersion(),
                metadata.getJDBCMinorVersion(),
                metadata.getURL(),
                metadata.getUserName(),
                connection.getCatalog(),
                connection.getSchema(),
                connection.getAutoCommit(),
                connection.isReadOnly(),
                isolationLabel(
                        connection
                                .getTransactionIsolation()
                ),
                connection.getNetworkTimeout(),
                connection.isValid(2)
        );
    }

    static String isolationLabel(int isolation) {
        return switch (isolation) {
            case Connection.TRANSACTION_NONE ->
                    "NONE";
            case Connection.TRANSACTION_READ_UNCOMMITTED ->
                    "READ_UNCOMMITTED";
            case Connection.TRANSACTION_READ_COMMITTED ->
                    "READ_COMMITTED";
            case Connection.TRANSACTION_REPEATABLE_READ ->
                    "REPEATABLE_READ";
            case Connection.TRANSACTION_SERIALIZABLE ->
                    "SERIALIZABLE";
            default ->
                    "DESCONHECIDO(" + isolation + ")";
        };
    }
}
```

A inspeção usa a API JDBC.

---

### 11. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula312/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import java.sql.Connection;
import java.sql.SQLException;

public final class Main {

    private Main() {
    }

    public static void main(String[] args) {
        try {
            DatabaseSettings settings =
                    DatabaseSettings.fromEnvironment();

            ConnectionProvider provider =
                    new DriverManagerConnectionProvider(
                            settings
                    );

            System.out.println(
                    "=== Configuração segura ==="
            );
            System.out.println(
                    settings.safeDescription()
            );

            Connection connection =
                    provider.open();

            System.out.println();
            System.out.println(
                    "=== Ciclo de vida ==="
            );
            System.out.printf(
                    "fechada antes do try: %s%n",
                    connection.isClosed()
            );

            try (connection) {
                ConnectionSnapshot snapshot =
                        ConnectionInspector.inspect(
                                connection
                        );

                System.out.println();
                System.out.println(
                        "=== Sessão JDBC ==="
                );
                System.out.println(
                        snapshot.formatted()
                );
                System.out.printf(
                        "fechada dentro do try: %s%n",
                        connection.isClosed()
                );
            }

            System.out.printf(
                    "fechada depois do try: %s%n",
                    connection.isClosed()
            );

            System.out.println();
            System.out.println(
                    "Nenhum Statement foi criado."
            );
            System.out.println(
                    "Nenhum SQL de negócio foi executado."
            );
        } catch (SQLException exception) {
            System.err.println(
                    "Falha JDBC ao abrir ou inspecionar "
                            + "a conexão."
            );
            System.err.println(
                    "SQLState: "
                            + exception.getSQLState()
            );
            System.err.println(
                    "Código do fornecedor: "
                            + exception.getErrorCode()
            );
            System.err.println(
                    "Mensagem: "
                            + exception.getMessage()
            );
            System.exit(2);
        } catch (RuntimeException exception) {
            System.err.println(
                    "Falha de configuração: "
                            + exception.getMessage()
            );
            System.exit(1);
        }
    }
}
```

O fechamento ocorre mesmo se `inspect` lançar exceção.

---

### 12. Criar DatabaseSettingsTest.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula312/DatabaseSettingsTest.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Map;
import java.util.Properties;

import org.junit.jupiter.api.Test;

class DatabaseSettingsTest {

    private static final Map<String, String> VALID =
            Map.of(
                    "JDBC_URL",
                    "jdbc:postgresql://"
                            + "localhost:5433/"
                            + "formacao_java",
                    "JDBC_USER",
                    "formacao",
                    "JDBC_PASSWORD",
                    "segredo-teste-312",
                    "JDBC_SCHEMA",
                    "projeto_os_final",
                    "JDBC_APPLICATION_NAME",
                    "aula-312-jdbc",
                    "JDBC_LOGIN_TIMEOUT_SECONDS",
                    "5",
                    "JDBC_CONNECT_TIMEOUT_SECONDS",
                    "5",
                    "JDBC_SOCKET_TIMEOUT_SECONDS",
                    "10"
            );

    @Test
    void shouldBuildConnectionProperties() {
        DatabaseSettings settings =
                DatabaseSettings.from(VALID);

        Properties properties =
                settings.connectionProperties();

        assertEquals(
                "formacao",
                properties.getProperty("user")
        );
        assertEquals(
                "projeto_os_final",
                properties.getProperty(
                        "currentSchema"
                )
        );
        assertEquals(
                "aula-312-jdbc",
                properties.getProperty(
                        "ApplicationName"
                )
        );
    }

    @Test
    void shouldNotExposePassword() {
        DatabaseSettings settings =
                DatabaseSettings.from(VALID);

        assertFalse(
                settings.safeDescription()
                        .contains(
                                "segredo-teste-312"
                        )
        );
    }

    @Test
    void shouldRejectInvalidTimeout() {
        Map<String, String> invalid =
                new java.util.HashMap<>(VALID);

        invalid.put(
                "JDBC_CONNECT_TIMEOUT_SECONDS",
                "0"
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> DatabaseSettings.from(
                        invalid
                )
        );
    }

    @Test
    void shouldRejectNonPostgreSqlUrl() {
        Map<String, String> invalid =
                new java.util.HashMap<>(VALID);

        invalid.put(
                "JDBC_URL",
                "jdbc:mysql://localhost:3306/"
                        + "formacao_java"
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> DatabaseSettings.from(
                        invalid
                )
        );
    }
}
```

Esses testes não abrem conexão.

---

### 13. Criar ConnectionLifecycleIT.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula312/ConnectionLifecycleIT.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula312;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;

import org.junit.jupiter.api.Test;

class ConnectionLifecycleIT {

    @Test
    void shouldOpenInspectAndCloseConnection()
            throws Exception {
        DatabaseSettings settings =
                DatabaseSettings.fromEnvironment();

        ConnectionProvider provider =
                new DriverManagerConnectionProvider(
                        settings
                );

        Connection connection =
                provider.open();

        assertFalse(connection.isClosed());

        try (connection) {
            ConnectionSnapshot snapshot =
                    ConnectionInspector.inspect(
                            connection
                    );

            assertTrue(snapshot.valid());
            assertEquals(
                    "PostgreSQL",
                    snapshot.databaseProduct()
            );
            assertEquals(
                    "formacao_java",
                    snapshot.catalog()
            );
            assertEquals(
                    "projeto_os_final",
                    snapshot.schema()
            );
            assertEquals(
                    "READ_COMMITTED",
                    snapshot.transactionIsolation()
            );
            assertTrue(snapshot.autoCommit());
            assertFalse(connection.isClosed());
        }

        assertTrue(connection.isClosed());
    }
}
```

Esse é um teste de integração.

Ele exige PostgreSQL e variáveis locais.

---

### 14. Criar 01_verificar_pre_requisitos.ps1

Crie:

```text
scripts/01_verificar_pre_requisitos.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

java -version

if ($LASTEXITCODE -ne 0) {
    throw "Java indisponível."
}

mvn -version

if ($LASTEXITCODE -ne 0) {
    throw "Maven indisponível."
}

$container = docker ps `
    --filter "name=formacao-postgres-m12" `
    --format "{{.Names}}"

if ($container -ne "formacao-postgres-m12") {
    throw "Container PostgreSQL indisponível."
}

$porta = Test-NetConnection `
    -ComputerName localhost `
    -Port 5433 `
    -WarningAction SilentlyContinue

if (-not $porta.TcpTestSucceeded) {
    throw "localhost:5433 não respondeu."
}

$schema = docker exec formacao-postgres-m12 `
    psql `
    -X `
    -tA `
    -U formacao `
    -d formacao_java `
    -c (
        "SELECT to_regnamespace(" +
        "'projeto_os_final')" +
        " IS NOT NULL;"
    )

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao consultar PostgreSQL."
}

if ($schema.Trim() -ne "t") {
    throw "Schema projeto_os_final ausente."
}

Write-Host "Pré-requisitos validados."
```

---

### 15. Criar 02_executar_conexao.ps1

Crie:

```text
scripts/02_executar_conexao.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$labRoot = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)
$envFile = Join-Path `
    $labRoot `
    "config\database.local.env"

if (-not (Test-Path $envFile)) {
    throw "Copie database.local.env.example."
}

$variables = @{}

Get-Content $envFile |
    Where-Object {
        $_ -and
        -not $_.TrimStart().StartsWith("#")
    } |
    ForEach-Object {
        $parts = $_ -split "=", 2

        if ($parts.Count -ne 2) {
            throw "Linha inválida na configuração."
        }

        $name = $parts[0].Trim()
        $value = $parts[1].Trim()

        if ([string]::IsNullOrWhiteSpace($value)) {
            throw "Valor vazio: $name"
        }

        $variables[$name] = $value
    }

$required = @(
    "JDBC_URL",
    "JDBC_USER",
    "JDBC_PASSWORD",
    "JDBC_SCHEMA",
    "JDBC_APPLICATION_NAME",
    "JDBC_LOGIN_TIMEOUT_SECONDS",
    "JDBC_CONNECT_TIMEOUT_SECONDS",
    "JDBC_SOCKET_TIMEOUT_SECONDS"
)

foreach ($name in $required) {
    if (-not $variables.ContainsKey($name)) {
        throw "Variável ausente: $name"
    }

    [Environment]::SetEnvironmentVariable(
        $name,
        $variables[$name],
        "Process"
    )
}

Push-Location $labRoot

try {
    mvn clean test

    if ($LASTEXITCODE -ne 0) {
        throw "Testes unitários falharam."
    }

    mvn verify

    if ($LASTEXITCODE -ne 0) {
        throw "Teste de integração falhou."
    }

    mvn exec:java

    if ($LASTEXITCODE -ne 0) {
        throw "Aplicação falhou."
    }

    $forbidden = Get-ChildItem `
        -Path ".\src" `
        -Recurse `
        -Filter "*.java" |
        Select-String `
            -Pattern (
                "createStatement|prepareStatement|" +
                "executeQuery|executeUpdate"
            )

    if ($forbidden) {
        throw (
            "Foi encontrado SQL fora do escopo "
            + "da aula 312."
        )
    }
}
finally {
    Pop-Location

    foreach ($name in $required) {
        [Environment]::SetEnvironmentVariable(
            $name,
            $null,
            "Process"
        )
    }
}
```

O script executa unidade, integração e aplicação.

---

### 16. Criar 03_testar_falhas_controladas.ps1

Crie:

```text
scripts/03_testar_falhas_controladas.ps1
```

O script deve reutilizar o carregamento seguro do arquivo local.

Depois:

1. definir senha temporariamente incorreta;
2. executar `mvn -q exec:java`;
3. exigir código diferente de zero;
4. confirmar que a saída contém `28P01`;
5. restaurar a senha correta;
6. trocar o database da URL para `database_inexistente_312`;
7. executar novamente;
8. exigir falha;
9. confirmar SQLState `3D000`;
10. restaurar a URL;
11. executar com sucesso.

Não imprima nenhuma senha.

Use captura combinada:

```powershell
$output = & mvn -q exec:java 2>&1
$exitCode = $LASTEXITCODE
```

O teste de falha não modifica o arquivo local.

---

### 17. Executar

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_conexao.ps1
```

Depois, opcionalmente:

```powershell
.\scripts\03_testar_falhas_controladas.ps1
```

Resultado obrigatório:

```text
Connection aberta;

metadata lido;

schema projeto_os_final;

Connection válida;

Connection fechada depois do try.
```

---

### 18. Criar ciclo-vida-connection.md

Em:

```text
docs/ciclo-vida-connection.md
```

documente:

```text
obter;

validar;

usar;

encerrar;

tratar falha.
```

Inclua:

```text
origem:
DriverManager.

tipo:
conexão física.

escopo:
um bloco try.

autocommit:
true.

isolamento:
READ_COMMITTED.

fechamento:
automático.

compartilhamento entre threads:
não.
```

Desenhe a sequência:

```text
Main
  -> ConnectionProvider
  -> DriverManager
  -> driver PostgreSQL
  -> servidor
  -> Connection
  -> inspeção
  -> close
```

---

### 19. Criar drivermanager-vs-datasource.md

Em:

```text
docs/drivermanager-vs-datasource.md
```

crie a comparação:

```text
Critério | DriverManager | DataSource
```

Inclua:

```text
API estática;

configuração;

injeção;

vendor;

pool;

container;

testabilidade;

uso didático;

uso profissional.
```

Conclusões obrigatórias:

```text
DriverManager é adequado para a primeira conexão didática;

DataSource desacopla a obtenção;

DataSource não implica pool;

pool será estudado separadamente;

Connection deve ser fechada em ambos os casos.
```

---

### 20. Criar contrato-configuracao.md

Em:

```text
docs/contrato-configuracao.md
```

documente cada variável:

- obrigatoriedade;
- tipo;
- limite;
- exemplo;
- segredo;
- responsável;
- comportamento de falha.

Registre:

```text
JDBC_PASSWORD:
segredo.

JDBC_URL:
não deve conter senha.

timeouts:
1 a 60 segundos no laboratório.

schema:
projeto_os_final.

ApplicationName:
aula-312-jdbc.
```

---

### 21. Criar troubleshooting-conexao.md

Em:

```text
docs/troubleshooting-conexao.md
```

registre:

#### SQLState 08001

Possíveis causas:

- container parado;
- porta errada;
- host incorreto;
- firewall;
- timeout;
- servidor indisponível.

#### SQLState 28P01

Causa provável:

```text
senha inválida.
```

Não imprima a senha esperada nem a recebida.

#### SQLState 3D000

Causa:

```text
database inexistente.
```

#### Schema diferente

Verifique:

- `JDBC_SCHEMA`;
- propriedade `currentSchema`;
- existência de `projeto_os_final`;
- espaços no arquivo local.

#### Connection nao fecha

Verifique:

- uso de `try-with-resources`;
- retorno antecipado;
- recurso armazenado em campo global;
- exceção ignorada;
- provider fora do escopo.

---

## Entendendo o que foi feito

A primeira sessão JDBC foi aberta com `DriverManager`, autenticada e inspecionada por metadata. `Main` dependeu de `ConnectionProvider`, permitindo futura troca por `DataSource`.

O `try-with-resources` fechou a conexão em sucesso ou falha, e o teste de integração comprovou os estados antes, durante e depois. Nenhum SQL foi antecipado.

## Erros comuns importantes

### Manter Connection em campo static

Compartilha sessão, transação e falhas entre fluxos. Não use conexão global.

### Esquecer try-with-resources

Exceções podem deixar recursos abertos.

### Colocar senha na URL

A URL pode aparecer em logs e metadata.

### Achar que DataSource sempre tem pool

A interface não garante pooling.

### Usar readOnly como seguranca

`readOnly` não substitui grants do PostgreSQL.

## Comandos uteis

### Testes unitarios

```powershell
mvn clean test
```

### Integracao

```powershell
mvn verify
```

### Aplicacao

```powershell
mvn exec:java
```

### Porta

```powershell
Test-NetConnection localhost -Port 5433
```

### Sessoes PostgreSQL

No `psql`:

```sql
SELECT
    application_name,
    usename,
    datname,
    state
FROM pg_stat_activity
WHERE application_name = 'aula-312-jdbc';
```

A consulta pode ser executada manualmente enquanto a aplicação estiver conectada em um exercício com pausa controlada.

Não adicione SQL ao Java para essa validação.

---

## Exercicio guiado

### Parte 1 — Provider alternativo

Crie um teste unitário para `DataSourceConnectionProvider`.

Use uma implementação fake de `DataSource` que devolva uma `Connection` criada por `Proxy`.

O objetivo é validar:

```text
getConnection foi chamado;

o provider devolveu o mesmo objeto;

nenhuma classe PostgreSQL foi importada.
```

Não implemente pool.

---

### Parte 2 — Falha por senha

Execute o script de falhas controladas.

Registre:

- SQLState;
- código;
- mensagem sanitizada;
- camada responsável.

Classifique como:

```text
configuração e autenticação.
```

---

### Parte 3 — Falha por database

Troque temporariamente somente o database da URL.

Confirme:

```text
driver aceita a URL;

conexão falha;

SQLState indica database inválido.
```

Explique por que `acceptsURL` da aula 311 não detectaria esse problema.

---

### Parte 4 — Fechamento em excecao

Dentro de um teste de integração:

1. abra a conexão;
2. entre no `try`;
3. lance uma exceção proposital depois da inspeção;
4. capture a exceção fora do bloco;
5. confirme `connection.isClosed()`.

Não execute SQL.

---

### Parte 5 — Estado da sessao

Adicione ao snapshot:

```text
warnings;

client info;

type map vazio ou não;

holdability.
```

Pesquise os significados na API JDBC.

Não altere estados da conexão sem compreender o efeito.

---

### Parte 6 — Comparacao arquitetural

Para cada cenário, escolha `DriverManager`, `DataSource` simples ou `DataSource` com pool:

```text
programa de linha de comando que executa uma vez;

aplicação web com muitas requisições;

teste isolado;

servidor administrado por container;

laboratório didático inicial.
```

Justifique.

---

### Parte 7 — Connection nao compartilhada

Escreva um parecer explicando por que a conexão não será:

```java
public static final Connection CONNECTION;
```

Inclua:

- threads;
- estado;
- transação;
- falha;
- fechamento;
- recuperação;
- pool.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade;
- o laboratório oficial da aula 312 existe;
- a continuidade com a aula 311 foi preservada;
- projeto Maven usa Java 21;
- driver PostgreSQL permanece fixado;
- configuração local está fora do Git;
- senha não está na URL;
- propriedades PostgreSQL foram centralizadas;
- timeouts inválidos são rejeitados;
- `ConnectionProvider` foi criado;
- provider por DriverManager foi implementado;
- provider conceitual por DataSource foi implementado;
- `javax.sql.DataSource` foi compreendido;
- DataSource não foi confundido com pool;
- primeira conexão real foi aberta;
- `DriverManager.getConnection` foi utilizado;
- login timeout foi restaurado;
- `Connection` foi inspecionada;
- database é `formacao_java`;
- schema é `projeto_os_final`;
- produto é PostgreSQL;
- isolamento é `READ_COMMITTED`;
- autocommit foi observado;
- read only foi observado;
- `isValid` retornou sucesso;
- conexão estava aberta dentro do try;
- conexão estava fechada depois do try;
- teste unitário não depende do banco;
- teste de integração depende do ambiente;
- SQLState foi documentado;
- falha de senha foi diagnosticada;
- falha de database foi diagnosticada;
- `try-with-resources` foi aplicado;
- conexão global não foi criada;
- nenhum `Statement` foi criado;
- nenhum `PreparedStatement` foi criado;
- nenhum `ResultSet` foi criado;
- nenhum SQL de negócio foi executado;
- pool não foi implementado;
- documentação de ciclo de vida foi criada;
- comparação DriverManager e DataSource foi criada;
- troubleshooting foi criado;
- schema `projeto_os_final` permaneceu intacto;
- ponte para a aula 313 está correta;
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
config/database.local.env.
```

Adicione:

```powershell
git add `
  labs/m13/aula-312-connection-drivermanager-datasource-conceitual
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): abrir e fechar conexao jdbc com seguranca"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
Connection;

DriverManager;

DataSource conceitual;

try-with-resources;

metadata;

diagnóstico de conexão.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você transformou o driver disponível em uma sessão JDBC real.

Aprendeu:

```text
Connection representa uma sessão;

DriverManager seleciona o driver;

Properties transporta configuração;

senha não deve ficar na URL;

autocommit é estado da conexão;

isolamento pode ser inspecionado;

readOnly não é autorização;

metadata descreve banco e driver;

isValid verifica a conexão;

try-with-resources garante fechamento;

Connection não deve ser singleton;

DataSource desacopla a obtenção;

DataSource não significa pool automaticamente.
```

O laboratório mostrou:

```text
servidor acessível;

autenticação válida;

database correto;

schema correto;

Connection aberta;

Connection válida;

Connection fechada.
```

A próxima aula será:

```text
313 - M13.03 - PreparedStatement e SQL Injection
```

Nela, você vai estudar:

- por que concatenar entrada em SQL é perigoso;
- diferença entre SQL e dado;
- placeholders `?`;
- criação de `PreparedStatement`;
- associação de parâmetros;
- tipos em parâmetros;
- consultas com filtros;
- prevenção de SQL Injection;
- execução de `SELECT`;
- primeiro contato com resultado da consulta;
- fechamento conjunto de recursos;
- testes com entradas maliciosas.

O objetivo será executar SQL de forma parametrizada e segura.

---

# Material complementar

## Checkpoint final

- [ ] Abri a primeira conexão com `DriverManager`.
- [ ] Inspecionei metadata e estados da sessão.
- [ ] Fechei a conexão com `try-with-resources`.
- [ ] Diferenciei DataSource de pool.
- [ ] Mantive SQL e PreparedStatement fora desta aula.

---

## Troubleshooting adicional

### Connection refused

Verifique:

```powershell
docker ps
Test-NetConnection localhost -Port 5433
```

Confirme host e porta.

### Password authentication failed

SQLState provável:

```text
28P01.
```

Revise o arquivo local sem imprimir a senha.

### Database does not exist

SQLState provável:

```text
3D000.
```

Confirme o último segmento da URL.

### getSchema retorna valor inesperado

Revise `JDBC_SCHEMA`, `currentSchema` e existência do schema.

### Teste IT nao executa

Use:

```powershell
mvn verify
```

O Surefire não executa arquivos `*IT` por padrão; o Failsafe executa.

---

## Perguntas de revisao

1. O que representa uma `Connection`?
2. Ela representa uma tabela?
3. Qual classe abre a conexão nesta aula?
4. Como o driver é selecionado?
5. Por que usar `Properties`?
6. Onde fica a senha?
7. O que é SQLState?
8. O que indica a classe `08`?
9. O que indica `28P01`?
10. O que indica `3D000`?
11. O que é autocommit?
12. Qual isolamento foi observado?
13. `readOnly` é autorização?
14. Para que serve `DatabaseMetaData`?
15. Para que serve `isValid`?
16. Por que usar try-with-resources?
17. Connection deve ser global?
18. O que é DataSource?
19. DataSource sempre usa pool?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma sessão JDBC com o database.
2. Não.
3. `DriverManager`.
4. Pela URL e drivers disponíveis.
5. Separar configuração e senha da URL.
6. Em configuração local e memória do processo.
7. Código padronizado de erro SQL.
8. Falha de conexão.
9. Senha inválida.
10. Database inexistente.
11. Confirmação automática por comando.
12. `READ_COMMITTED`.
13. Não.
14. Inspecionar banco, driver e capacidades.
15. Verificar validade da conexão.
16. Garantir fechamento em sucesso e erro.
17. Não.
18. Abstração para obtenção de conexões.
19. Não.
20. PreparedStatement e SQL Injection.

---

## Desafio opcional

Crie:

```text
ConnectionFailureClassifier
```

Entrada:

```java
SQLException
```

Saída:

```text
NETWORK;

AUTHENTICATION;

DATABASE_NOT_FOUND;

UNKNOWN.
```

Use o prefixo ou valor do SQLState.

Regras:

- não analisar senha;
- não depender apenas da mensagem;
- tratar SQLState nulo;
- possuir testes unitários;
- não abrir conexão durante os testes.

Integre o classificador ao `Main` apenas para exibir a categoria.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 312 - M13.02 - Connection DriverManager e DataSource conceitual

- Entendi `Connection` como uma sessão ativa com o PostgreSQL.
- Diferenciei conexão física de conexão lógica.
- Usei `DriverManager` para abrir a primeira conexão JDBC.
- Enviei usuário e senha por `Properties`.
- Mantive a senha fora da URL e dos logs.
- Configurei application name, schema e timeouts.
- Entendi que o login timeout do DriverManager é global.
- Criei uma abstração `ConnectionProvider`.
- Implementei um provider por DriverManager.
- Modelei um provider conceitual por `DataSource`.
- Entendi que DataSource não implica pool automaticamente.
- Inspecionei `DatabaseMetaData`.
- Confirmei database, schema, usuário e driver.
- Observei autocommit e modo read only.
- Confirmei isolamento `READ_COMMITTED`.
- Validei a sessão com `isValid`.
- Usei `try-with-resources`.
- Confirmei a conexão fechada depois do bloco.
- Separei testes unitários de teste de integração.
- Documentei SQLStates de rede, senha e database.
- Não criei Statement, PreparedStatement ou ResultSet.
- Preservei `projeto_os_final`.
- Próxima aula: PreparedStatement e SQL Injection.
```

---

## Referencia tecnica curta

```text
Connection:
sessão JDBC.

DriverManager:
seleção e abertura.

Properties:
configuração separada.

SQLState:
categoria de falha.

autocommit:
limite automático por comando.

isValid:
verificação da conexão.

try-with-resources:
fechamento automático.

DataSource:
origem abstrata de conexões.

pool:
reutilização administrada.

close:
encerrar ou devolver o recurso.
```

Regra final:

```text
uma Connection deve ser obtida por uma origem clara, usada no menor escopo possivel, inspecionada sem expor segredos e sempre fechada, independentemente de sucesso ou falha.
```
