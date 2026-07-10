# 319 - M13.09 - Connection pool e HikariCP conceitual

## Apresentacao da aula

Na aula 318, você criou uma unidade de trabalho JDBC com uma única `Connection`, autocommit desativado, `commit` no sucesso, `rollback` na falha, restauração do estado e fechamento garantido.

Até agora, a origem da conexão foi baseada em `DriverManager`. Cada chamada precisava estabelecer uma sessão física com PostgreSQL. Esse processo envolve socket, autenticação, negociação do protocolo, criação de sessão e configuração inicial.

Uma aplicação backend executa muitas operações curtas:

```text
consultar Cliente;

listar Ordens;

alterar status;

consultar Pagamentos.
```

Abrir e encerrar uma sessão física em cada operação gera custo repetido na aplicação e no banco.

Connection pool resolve esse problema mantendo um conjunto controlado de conexões físicas reutilizáveis.

A aplicação continua pedindo:

```java
dataSource.getConnection()
```

mas recebe normalmente uma conexão lógica. Ao chamar:

```java
connection.close()
```

o recurso é devolvido ao pool. A sessão física pode permanecer aberta e ser reutilizada por outro fluxo.

Nesta aula, você utilizará:

```text
HikariCP 7.1.0.
```

A implementação principal será:

```java
HikariDataSource
```

que implementa:

```java
javax.sql.DataSource
```

O laboratório comprovará:

```text
conexão lógica obtida do pool;

close devolvendo o recurso;

reutilização da mesma sessão PostgreSQL;

limite de conexões físicas;

timeout quando o pool satura;

métricas active, idle, total e awaiting;

transaction manager funcionando sobre DataSource;

estado da Connection restaurado antes da devolução.
```

Nenhum dado de `projeto_os_final` será alterado.

A próxima aula será:

```text
320 - M13.10 - Mini projeto JDBC CRUD OS parte 1
```

Ela iniciará o CRUD. A aula 319 permanecerá focada em pool, ciclo de vida, limites e observabilidade.

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection, DriverManager e DataSource conceitual.

313:
PreparedStatement e SQL Injection.

314:
ResultSet, mapeamento e tipos.

315:
DAO inicial.

316:
Repository Pattern sem Spring.

317:
tratamento de exceções JDBC.

318:
transações com commit e rollback.

319:
connection pool e HikariCP conceitual.

320:
mini projeto JDBC CRUD OS parte 1.
```

Na aula 312, `DataSource` foi apresentado como abstração.

Agora você utilizará uma implementação concreta e real:

```text
HikariDataSource.
```

Na aula 318, `close()` encerrava uma conexão física criada por `DriverManager`.

Nesta aula, `close()` da conexão lógica devolve o recurso ao pool.

Pergunta central:

```text
como reutilizar conexões com limite, timeout, métricas e ciclo de vida seguro?
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-319-connection-pool-hikaricp-conceitual
```

Estrutura final:

```text
labs
└── m13
    └── aula-319-connection-pool-hikaricp-conceitual
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-pool.md
        │   ├── dimensionamento-inicial.md
        │   ├── metricas-e-saturacao.md
        │   └── troubleshooting-hikaricp.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_pool.ps1
        │   └── 03_validar_escopo.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula319
            │                           ├── Main.java
            │                           ├── config
            │                           │   ├── DatabaseSettings.java
            │                           │   └── PoolSettings.java
            │                           └── infrastructure
            │                               └── jdbc
            │                                   ├── ConnectionProvider.java
            │                                   ├── ConnectionState.java
            │                                   ├── DataSourceConnectionProvider.java
            │                                   ├── HikariDataSourceFactory.java
            │                                   ├── JdbcTransactionManager.java
            │                                   ├── PoolMetricsReader.java
            │                                   ├── PoolProbe.java
            │                                   ├── PoolSnapshot.java
            │                                   └── TransactionWork.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula319
                                        ├── config
                                        │   └── PoolSettingsTest.java
                                        └── infrastructure
                                            └── jdbc
                                                ├── HikariPoolIT.java
                                                └── PooledTransactionManagerIT.java
```

Resultados esperados:

```text
pool principal:
maximumPoolSize 3;
minimumIdle 1.

consulta:
4 Clientes.

conexão emprestada:
active 1.

conexão devolvida:
active 0.

pool de slot único:
mesmo pg_backend_pid em duas aquisições.

pool de saturação:
2 conexões ativas;
terceira aquisição expira.

transaction manager:
autocommit restaurado para true.

shutdown:
HikariDataSource fechado.
```

---

## Conceito essencial

### Conexao fisica e conexao logica

Uma conexão física representa sessão real com PostgreSQL, socket e backend associados.

Uma conexão lógica é o objeto temporário entregue pelo pool.

Com HikariCP, a implementação concreta costuma ser um proxy, mas a aplicação deve depender somente de:

```java
java.sql.Connection
```

Não faça cast para classes do HikariCP ou do driver.

---

### Semantica de close

Sem pool:

```text
close:
encerra a sessão física.
```

Com pool:

```text
close:
devolve a conexão lógica;
a sessão física pode continuar.
```

A regra permanece:

```text
sempre use try-with-resources.
```

Não fechar a conexão impede a devolução e pode saturar o pool.

---

### DataSource como origem

O adapter da aula 312 continua válido:

```java
public final class DataSourceConnectionProvider
        implements ConnectionProvider {

    private final DataSource dataSource;

    @Override
    public Connection open() throws SQLException {
        return dataSource.getConnection();
    }
}
```

O `JdbcTransactionManager` da aula 318 depende de `ConnectionProvider`, não de HikariCP.

Por isso, a origem pode mudar sem alterar o protocolo transacional.

---

### Ciclo de vida do DataSource

O pool deve existir do startup ao shutdown da aplicação.

Não crie um pool por:

- requisição;
- método;
- DAO;
- transação;
- usuário.

No laboratório:

```java
try (
    HikariDataSource dataSource =
            factory.create(database, pool)
) {
    // execução da aplicação
}
```

Fechar o DataSource encerra conexões físicas e threads internas.

---

### maximumPoolSize

`maximumPoolSize` limita o total de conexões físicas do pool, incluindo ativas e ociosas.

Exemplo:

```text
maximumPoolSize:
3.
```

Quando três conexões estão emprestadas, uma quarta solicitação espera até uma conexão ser devolvida ou o timeout expirar.

Mais conexões não significam automaticamente maior throughput. O banco pode sofrer mais contenção.

---

### minimumIdle

`minimumIdle` indica quantas conexões ociosas o pool tenta manter.

Laboratório:

```text
minimumIdle:
1.

maximumPoolSize:
3.
```

Essa configuração permite observar crescimento do pool.

Em produção, o valor precisa ser definido por medição. Uma configuração de tamanho fixo pode responder melhor a picos; uma configuração elástica pode reduzir conexões ociosas.

---

### connectionTimeout e validationTimeout

`connectionTimeout` limita quanto tempo o chamador espera para obter uma conexão do pool.

Ele não limita a execução de SQL.

`validationTimeout` limita o teste de validade da conexão e precisa ser menor que `connectionTimeout`.

Laboratório:

```text
connectionTimeout:
2000 ms.

validationTimeout:
1000 ms.
```

No perfil de saturação:

```text
connectionTimeout:
500 ms.
```

---

### connectionTestQuery

O pgJDBC implementa JDBC 4 e suporta:

```java
Connection.isValid(...)
```

Por isso, o laboratório não define:

```text
connectionTestQuery.
```

Não adicione `SELECT 1` por hábito quando o driver suporta validação JDBC.

---

### idleTimeout, maxLifetime e keepaliveTime

`idleTimeout` controla retirada de conexões ociosas acima de `minimumIdle`.

`maxLifetime` limita a vida física de uma conexão no pool.

`keepaliveTime` valida conexões ociosas para reduzir expiração silenciosa pela infraestrutura.

Relações importantes:

```text
keepaliveTime < maxLifetime;

maxLifetime deve ficar abaixo do limite
imposto por banco, proxy ou rede.
```

Valores didáticos:

```text
idleTimeout:
60000 ms.

maxLifetime:
600000 ms.

keepaliveTime:
120000 ms.
```

Eles não são recomendação universal.

---

### initializationFailTimeout

Valor positivo permite falhar durante a inicialização quando host, database ou credenciais estão inválidos.

Laboratório:

```text
5000 ms.
```

A falha aparece no startup, em vez de apenas durante uma operação futura.

---

### leakDetectionThreshold

Leak detection registra aviso quando uma conexão permanece fora do pool além do limite.

Valor zero desativa.

O limite mínimo para habilitar é:

```text
2000 ms.
```

Leak detection é diagnóstico. Ele não substitui `try-with-resources` e não fecha automaticamente o recurso.

O fluxo principal usará zero.

---

### Estado da Connection

Uma conexão pode ter:

- autocommit alterado;
- read only alterado;
- isolamento alterado;
- schema alterado;
- network timeout alterado.

O HikariCP acompanha estados conhecidos e restaura a conexão lógica ao devolvê-la.

O transaction manager da aula 318 também restaura explicitamente o que alterou.

Essa disciplina evita contaminação entre unidades de trabalho.

---

### Metricas basicas

O laboratório observará:

```text
active:
conexões emprestadas.

idle:
conexões disponíveis.

total:
conexões físicas conhecidas.

threadsAwaiting:
threads esperando uma conexão.
```

`active` significa emprestada, não necessariamente executando SQL naquele instante.

---

### Saturacao

Saturação ocorre quando:

```text
active == maximumPoolSize;

idle == 0;

novas solicitações aguardam.
```

O pool didático de saturação terá:

```text
maximumPoolSize:
2.

minimumIdle:
0.

connectionTimeout:
500 ms.
```

Duas conexões ficarão abertas e a terceira aquisição deverá expirar.

---

### Dimensionamento global

Considere:

```text
10 instâncias;

maximumPoolSize 20.
```

Potencial:

```text
200 conexões.
```

O banco ainda precisa reservar capacidade para administração, migrations, observabilidade e outros serviços.

Dimensionamento deve considerar o sistema inteiro.

---

### Pool nao torna Connection compartilhavel

O pool é concorrente.

Uma conexão emprestada continua pertencendo a uma unidade de trabalho.

Não compartilhe uma mesma `Connection` livremente entre threads.

Cada fluxo deve obter, usar e fechar rapidamente.

---

### Backpressure e capacidade real

O pool não cria capacidade infinita; ele transforma excesso de concorrência em espera controlada. Quando todos os slots estão ocupados, novas threads aguardam até uma conexão ser devolvida ou até `connectionTimeout` expirar.

Esse comportamento é backpressure. Ele protege o PostgreSQL contra crescimento ilimitado de sessões, mas também revela gargalos.

A investigação deve considerar:

```text
tempo médio de empréstimo;

quantidade de requisições concorrentes;

queries lentas;

transações longas;

pool por instância;

limite global do banco.
```

Aumentar apenas `maximumPoolSize` pode trocar timeout na aplicação por contenção no PostgreSQL. O ajuste correto exige medir aquisição, uso da conexão, tempo de query e saturação global.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\src\main\java\br\com\formacao\m13\aula319\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\src\main\java\br\com\formacao\m13\aula319\infrastructure\jdbc"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\src\test\java\br\com\formacao\m13\aula319\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-319-connection-pool-hikaricp-conceitual\src\test\java\br\com\formacao\m13\aula319\infrastructure\jdbc"

Set-Location `
  "labs\m13\aula-319-connection-pool-hikaricp-conceitual"
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
    <artifactId>aula-319-hikaricp</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>
            UTF-8
        </project.build.sourceEncoding>

        <postgresql.version>42.7.13</postgresql.version>
        <hikaricp.version>7.1.0</hikaricp.version>
        <slf4j.version>2.0.17</slf4j.version>
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
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>${hikaricp.version}</version>
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
                        br.com.formacao.m13.aula319.Main
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
JDBC_APPLICATION_NAME=aula-319-hikari

HIKARI_POOL_NAME=aula-319-principal
HIKARI_MAXIMUM_POOL_SIZE=3
HIKARI_MINIMUM_IDLE=1
HIKARI_CONNECTION_TIMEOUT_MS=2000
HIKARI_VALIDATION_TIMEOUT_MS=1000
HIKARI_IDLE_TIMEOUT_MS=60000
HIKARI_MAX_LIFETIME_MS=600000
HIKARI_KEEPALIVE_TIME_MS=120000
HIKARI_LEAK_DETECTION_THRESHOLD_MS=0
HIKARI_INITIALIZATION_FAIL_TIMEOUT_MS=5000
```

Copie para:

```text
config/database.local.env
```

O arquivo real permanece fora do Git.

---

### 5. Criar DatabaseSettings.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula319/config/DatabaseSettings.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.config;

import java.util.Map;

public record DatabaseSettings(
        String url,
        String user,
        String password,
        String schema,
        String applicationName
) {

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

        if (!url.startsWith(
                "jdbc:postgresql://"
        )) {
            throw new IllegalArgumentException(
                    "JDBC_URL deve usar PostgreSQL"
            );
        }
    }

    public static DatabaseSettings fromEnvironment() {
        Map<String, String> env =
                System.getenv();

        return new DatabaseSettings(
                env.get("JDBC_URL"),
                env.get("JDBC_USER"),
                env.get("JDBC_PASSWORD"),
                env.get("JDBC_SCHEMA"),
                env.get(
                        "JDBC_APPLICATION_NAME"
                )
        );
    }

    private static String requireText(
            String value,
            String name
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Variável ausente: " + name
            );
        }

        return value.trim();
    }
}
```

---

### 6. Criar PoolSettings.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula319/config/PoolSettings.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.config;

public record PoolSettings(
        String poolName,
        int maximumPoolSize,
        int minimumIdle,
        long connectionTimeoutMs,
        long validationTimeoutMs,
        long idleTimeoutMs,
        long maxLifetimeMs,
        long keepaliveTimeMs,
        long leakDetectionThresholdMs,
        long initializationFailTimeoutMs
) {

    public PoolSettings {
        if (
            poolName == null
            || poolName.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "poolName é obrigatório"
            );
        }

        if (
            maximumPoolSize < 1
            || maximumPoolSize > 20
        ) {
            throw new IllegalArgumentException(
                    "maximumPoolSize deve estar "
                            + "entre 1 e 20"
            );
        }

        if (
            minimumIdle < 0
            || minimumIdle > maximumPoolSize
        ) {
            throw new IllegalArgumentException(
                    "minimumIdle inválido"
            );
        }

        if (connectionTimeoutMs < 250) {
            throw new IllegalArgumentException(
                    "connectionTimeout mínimo: 250 ms"
            );
        }

        if (
            validationTimeoutMs < 250
            || validationTimeoutMs
                    >= connectionTimeoutMs
        ) {
            throw new IllegalArgumentException(
                    "validationTimeout inválido"
            );
        }

        if (
            idleTimeoutMs != 0
            && idleTimeoutMs < 10_000
        ) {
            throw new IllegalArgumentException(
                    "idleTimeout mínimo: 10000 ms"
            );
        }

        if (
            maxLifetimeMs != 0
            && maxLifetimeMs < 30_000
        ) {
            throw new IllegalArgumentException(
                    "maxLifetime mínimo: 30000 ms"
            );
        }

        if (
            keepaliveTimeMs != 0
            && keepaliveTimeMs < 30_000
        ) {
            throw new IllegalArgumentException(
                    "keepaliveTime mínimo: 30000 ms"
            );
        }

        if (
            maxLifetimeMs > 0
            && keepaliveTimeMs >= maxLifetimeMs
        ) {
            throw new IllegalArgumentException(
                    "keepaliveTime deve ser menor "
                            + "que maxLifetime"
            );
        }

        if (
            leakDetectionThresholdMs != 0
            && leakDetectionThresholdMs < 2_000
        ) {
            throw new IllegalArgumentException(
                    "leak threshold mínimo: 2000 ms"
            );
        }
    }

    public static PoolSettings fromEnvironment() {
        var env = System.getenv();

        return new PoolSettings(
                required(env, "HIKARI_POOL_NAME"),
                integer(env, "HIKARI_MAXIMUM_POOL_SIZE"),
                integer(env, "HIKARI_MINIMUM_IDLE"),
                number(env, "HIKARI_CONNECTION_TIMEOUT_MS"),
                number(env, "HIKARI_VALIDATION_TIMEOUT_MS"),
                number(env, "HIKARI_IDLE_TIMEOUT_MS"),
                number(env, "HIKARI_MAX_LIFETIME_MS"),
                number(env, "HIKARI_KEEPALIVE_TIME_MS"),
                number(
                        env,
                        "HIKARI_LEAK_DETECTION_THRESHOLD_MS"
                ),
                number(
                        env,
                        "HIKARI_INITIALIZATION_FAIL_TIMEOUT_MS"
                )
        );
    }

    public PoolSettings singleSlot(
            String name
    ) {
        return new PoolSettings(
                name,
                1,
                1,
                connectionTimeoutMs,
                validationTimeoutMs,
                idleTimeoutMs,
                maxLifetimeMs,
                keepaliveTimeMs,
                0,
                initializationFailTimeoutMs
        );
    }

    public PoolSettings saturationProfile(
            String name
    ) {
        return new PoolSettings(
                name,
                2,
                0,
                500,
                250,
                idleTimeoutMs,
                maxLifetimeMs,
                keepaliveTimeMs,
                0,
                initializationFailTimeoutMs
        );
    }

    private static String required(
            java.util.Map<String, String> env,
            String name
    ) {
        String value = env.get(name);

        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    "Variável ausente: " + name
            );
        }

        return value.trim();
    }

    private static int integer(
            java.util.Map<String, String> env,
            String name
    ) {
        return Math.toIntExact(
                number(env, name)
        );
    }

    private static long number(
            java.util.Map<String, String> env,
            String name
    ) {
        return Long.parseLong(
                required(env, name)
        );
    }
}
```

---

### 7. Criar HikariDataSourceFactory.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula319/infrastructure/jdbc/HikariDataSourceFactory.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.infrastructure.jdbc;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import br.com.formacao.m13.aula319.config.DatabaseSettings;
import br.com.formacao.m13.aula319.config.PoolSettings;

public final class HikariDataSourceFactory {

    public HikariDataSource create(
            DatabaseSettings database,
            PoolSettings pool
    ) {
        HikariConfig config =
                new HikariConfig();

        config.setPoolName(pool.poolName());
        config.setJdbcUrl(database.url());
        config.setUsername(database.user());
        config.setPassword(database.password());
        config.setSchema(database.schema());

        config.setMaximumPoolSize(
                pool.maximumPoolSize()
        );
        config.setMinimumIdle(
                pool.minimumIdle()
        );
        config.setConnectionTimeout(
                pool.connectionTimeoutMs()
        );
        config.setValidationTimeout(
                pool.validationTimeoutMs()
        );
        config.setIdleTimeout(
                pool.idleTimeoutMs()
        );
        config.setMaxLifetime(
                pool.maxLifetimeMs()
        );
        config.setKeepaliveTime(
                pool.keepaliveTimeMs()
        );
        config.setLeakDetectionThreshold(
                pool.leakDetectionThresholdMs()
        );
        config.setInitializationFailTimeout(
                pool.initializationFailTimeoutMs()
        );

        config.setAutoCommit(true);
        config.setReadOnly(false);

        config.addDataSourceProperty(
                "ApplicationName",
                database.applicationName()
        );
        config.addDataSourceProperty(
                "tcpKeepAlive",
                "true"
        );

        return new HikariDataSource(
                config
        );
    }
}
```

Não configure `driverClassName` nem `connectionTestQuery`.

---

### 8. Criar DataSourceConnectionProvider.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula319/infrastructure/jdbc/DataSourceConnectionProvider.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.infrastructure.jdbc;

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
        this.dataSource =
                Objects.requireNonNull(
                        dataSource,
                        "dataSource é obrigatório"
                );
    }

    @Override
    public Connection open()
            throws SQLException {
        return dataSource.getConnection();
    }
}
```

Copie da aula 318:

```text
ConnectionProvider;

ConnectionState;

TransactionWork;

JdbcTransactionManager.
```

Ajuste apenas o package para `aula319`.

---

### 9. Criar PoolSnapshot.java e PoolMetricsReader.java

Crie:

```text
PoolSnapshot.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.infrastructure.jdbc;

public record PoolSnapshot(
        int active,
        int idle,
        int total,
        int threadsAwaiting
) {

    public String formatted() {
        return """
                active=%d;
                idle=%d;
                total=%d;
                threadsAwaiting=%d.
                """.formatted(
                active,
                idle,
                total,
                threadsAwaiting
        ).strip();
    }
}
```

Crie:

```text
PoolMetricsReader.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.infrastructure.jdbc;

import com.zaxxer.hikari.HikariDataSource;

public final class PoolMetricsReader {

    private PoolMetricsReader() {
    }

    public static PoolSnapshot read(
            HikariDataSource dataSource
    ) {
        var bean =
                dataSource.getHikariPoolMXBean();

        if (bean == null) {
            throw new IllegalStateException(
                    "Pool ainda não inicializado"
            );
        }

        return new PoolSnapshot(
                bean.getActiveConnections(),
                bean.getIdleConnections(),
                bean.getTotalConnections(),
                bean.getThreadsAwaitingConnection()
        );
    }
}
```

---

### 10. Criar PoolProbe.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula319/infrastructure/jdbc/PoolProbe.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319.infrastructure.jdbc;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

public final class PoolProbe {

    private PoolProbe() {
    }

    public static int backendPid(
            Connection connection
    ) throws SQLException {
        try (
            var statement =
                    connection.prepareStatement(
                            "SELECT pg_backend_pid() "
                                    + "AS backend_pid"
                    );
            var resultSet =
                    statement.executeQuery()
        ) {
            resultSet.next();

            return resultSet.getInt(
                    "backend_pid"
            );
        }
    }

    public static long countClients(
            Connection connection
    ) throws SQLException {
        try (
            var statement =
                    connection.prepareStatement(
                            """
                            SELECT count(*)
                                AS quantidade
                            FROM projeto_os_final.cliente
                            """
                    );
            var resultSet =
                    statement.executeQuery()
        ) {
            resultSet.next();

            return resultSet.getLong(
                    "quantidade"
            );
        }
    }

    public static boolean reusedBackend(
            DataSource dataSource
    ) throws SQLException {
        int firstPid;

        try (
            Connection first =
                    dataSource.getConnection()
        ) {
            firstPid =
                    backendPid(first);
        }

        int secondPid;

        try (
            Connection second =
                    dataSource.getConnection()
        ) {
            secondPid =
                    backendPid(second);
        }

        return firstPid == secondPid;
    }
}
```

O teste de PID deve usar pool de um slot e ocorrer imediatamente.

---

### 11. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula319/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula319;

import java.sql.Connection;
import java.sql.SQLTransientConnectionException;

import com.zaxxer.hikari.HikariDataSource;

import br.com.formacao.m13.aula319.config.DatabaseSettings;
import br.com.formacao.m13.aula319.config.PoolSettings;
import br.com.formacao.m13.aula319.infrastructure.jdbc.DataSourceConnectionProvider;
import br.com.formacao.m13.aula319.infrastructure.jdbc.HikariDataSourceFactory;
import br.com.formacao.m13.aula319.infrastructure.jdbc.PoolMetricsReader;
import br.com.formacao.m13.aula319.infrastructure.jdbc.PoolProbe;

public final class Main {

    private Main() {
    }

    public static void main(String[] args)
            throws Exception {
        DatabaseSettings database =
                DatabaseSettings.fromEnvironment();

        PoolSettings settings =
                PoolSettings.fromEnvironment();

        HikariDataSourceFactory factory =
                new HikariDataSourceFactory();

        try (
            HikariDataSource dataSource =
                    factory.create(
                            database,
                            settings
                    )
        ) {
            System.out.println(
                    "=== Pool principal ==="
            );
            printMetrics(dataSource);

            try (
                Connection connection =
                        dataSource.getConnection()
            ) {
                System.out.printf(
                        "classe lógica: %s%n",
                        connection.getClass()
                                .getName()
                );
                System.out.printf(
                        "backend PID: %d%n",
                        PoolProbe.backendPid(
                                connection
                        )
                );
                System.out.printf(
                        "Clientes: %d%n",
                        PoolProbe.countClients(
                                connection
                        )
                );
                printMetrics(dataSource);
            }

            System.out.println(
                    "=== Depois do close lógico ==="
            );
            printMetrics(dataSource);

            var provider =
                    new DataSourceConnectionProvider(
                            dataSource
                    );

            try (
                Connection connection =
                        provider.open()
            ) {
                System.out.printf(
                        "provider usa conexão lógica: %s%n",
                        connection.getClass()
                                .getName()
                                .contains("Hikari")
                );
            }
        }

        try (
            HikariDataSource single =
                    factory.create(
                            database,
                            settings.singleSlot(
                                    "aula-319-single"
                            )
                    )
        ) {
            System.out.printf(
                    "mesmo backend reutilizado: %s%n",
                    PoolProbe.reusedBackend(
                            single
                    )
            );
        }

        try (
            HikariDataSource saturated =
                    factory.create(
                            database,
                            settings.saturationProfile(
                                    "aula-319-saturacao"
                            )
                    );
            Connection first =
                    saturated.getConnection();
            Connection second =
                    saturated.getConnection()
        ) {
            printMetrics(saturated);

            try {
                saturated.getConnection();
                throw new IllegalStateException(
                        "Terceira conexão obtida"
                );
            } catch (
                SQLTransientConnectionException expected
            ) {
                System.out.println(
                        "timeout de aquisição confirmado."
                );
            }
        }
    }

    private static void printMetrics(
            HikariDataSource dataSource
    ) {
        System.out.println(
                PoolMetricsReader
                        .read(dataSource)
                        .formatted()
        );
    }
}
```

No laboratório completo, reutilize o `JdbcTransactionManager` da aula 318 e execute:

```java
long count =
        transactionManager.execute(
                "contar Clientes com pool",
                PoolProbe::countClients
        );
```

Depois obtenha outra conexão do mesmo pool e confirme:

```text
autoCommit:
true.

readOnly:
false.

isolamento:
READ_COMMITTED.
```

---

### 12. Criar testes

Em `PoolSettingsTest.java`, valide:

- máximo zero;
- mínimo maior que máximo;
- connection timeout menor que 250;
- validation timeout maior ou igual ao connection timeout;
- idle timeout abaixo de 10 segundos;
- max lifetime abaixo de 30 segundos;
- keepalive maior ou igual ao max lifetime;
- leak threshold entre 1 e 1999;
- perfil de um slot;
- perfil de saturação.

Em `HikariPoolIT.java`, crie os cenários:

```text
emprestar e devolver;

consultar quatro Clientes;

reutilizar backend com um slot;

saturar dois slots;

fechar DataSource.
```

Para saturação:

```java
try (
    Connection first =
            dataSource.getConnection();
    Connection second =
            dataSource.getConnection()
) {
    assertThrows(
            SQLTransientConnectionException.class,
            dataSource::getConnection
    );
}
```

Em `PooledTransactionManagerIT.java`, use pool de um slot, execute uma transação de leitura e confirme depois:

```java
assertTrue(
        connection.getAutoCommit()
);

assertFalse(
        connection.isReadOnly()
);

assertEquals(
        Connection.TRANSACTION_READ_COMMITTED,
        connection.getTransactionIsolation()
);
```

Nenhum teste executa DML.

---

### 13. Criar scripts

`01_verificar_pre_requisitos.ps1` deve validar:

- Java 21;
- Maven;
- container PostgreSQL;
- porta 5433;
- schema `projeto_os_final`;
- quatro Clientes;
- dependência HikariCP.

Comando:

```powershell
mvn -q dependency:tree `
  -Dincludes=com.zaxxer:HikariCP
```

`02_executar_pool.ps1` deve carregar o arquivo local e executar:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

No `finally`, remova variáveis JDBC e Hikari do processo.

`03_validar_escopo.ps1` deve exigir:

```text
HikariConfig;

HikariDataSource;

DataSource;

maximumPoolSize;

connectionTimeout;

PoolMetricsReader;

try-with-resources.
```

E proibir:

```text
org.springframework;

@Entity;

@Transactional;

INSERT INTO;

UPDATE projeto_os_final;

DELETE FROM;

new HikariDataSource dentro de DAO.
```

---

### 14. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_pool.ps1
.\scripts\03_validar_escopo.ps1
```

Confirme:

```text
pool inicia;

count retorna 4;

active aumenta no empréstimo;

active volta a zero após close;

single slot reutiliza backend;

saturação produz timeout;

transaction manager restaura estado;

DataSource fecha no final.
```

---

### 15. Criar documentacao

Em `docs/contrato-pool.md`, registre:

```text
dono:
aplicação.

vida:
startup até shutdown.

obtenção:
DataSource.getConnection.

devolução:
Connection.close.

limite:
maximumPoolSize.

espera:
connectionTimeout.

transação:
uma conexão por unidade.

DAO:
não cria pool.
```

Em `docs/dimensionamento-inicial.md`, registre:

- quantidade de instâncias;
- pool por instância;
- potencial total;
- limite do PostgreSQL;
- reserva operacional;
- duração média do empréstimo;
- concorrência;
- transações longas;
- queries lentas.

Em `docs/metricas-e-saturacao.md`, documente:

```text
active;

idle;

total;

threadsAwaiting;

timeout;

tempo de uso;

suspeita de leak.
```

Crie a tabela:

```text
Sinal | Hipótese | Investigação
```

Em `docs/troubleshooting-hikaricp.md`, cubra:

- falha de inicialização;
- timeout de aquisição;
- max lifetime inválido;
- keepalive incompatível;
- leak detectado;
- pool fechado cedo;
- active que não volta a zero.

---

## Entendendo o que foi feito

### DataSource virou origem real

`ConnectionProvider` passou a obter conexões do HikariCP sem alterar o transaction manager.

### Close virou devolucao

As métricas mostraram a conexão saindo de active e voltando para idle.

### A sessao fisica foi reutilizada

O pool de um slot devolveu o mesmo `pg_backend_pid` em aquisições sequenciais.

### O limite gerou backpressure

A terceira aquisição esperou até `connectionTimeout` e falhou sem ultrapassar o máximo.

### O estado transacional permaneceu limpo

Depois do transaction manager, a próxima conexão voltou com os estados esperados.

---

## Erros comuns importantes

### Criar pool por requisicao

Isso multiplica recursos e elimina reutilização.

### Esquecer close

A conexão permanece active e pode saturar o pool.

### Aumentar maximumPoolSize sem medir

O banco pode sofrer mais contenção.

### Confundir connectionTimeout com query timeout

Um limita aquisição; o outro limita execução.

### Guardar Connection em singleton

Compartilhe o DataSource, não uma conexão.

---

## Comandos uteis

### Testes unitarios

```powershell
mvn clean test
```

### Testes de integracao

```powershell
mvn verify
```

### Executar aplicacao

```powershell
mvn exec:java
```

### Sessoes PostgreSQL

```sql
SELECT
    pid,
    application_name,
    state,
    backend_start,
    xact_start,
    query_start
FROM pg_stat_activity
WHERE application_name
    LIKE 'aula-319%';
```

---

## Exercicio guiado

### Parte 1 — Pool fixo

Crie um perfil com:

```text
maximumPoolSize 3;

minimumIdle 3.
```

Compare total e idle com o perfil elástico.

Não conclua qual é melhor sem medir o ambiente.

### Parte 2 — Tempo de aquisicao

Meça com `System.nanoTime()`:

- conexão disponível;
- conexão aguardando devolução;
- timeout.

Registre como experimento, não como benchmark profissional.

### Parte 3 — Leak detection

Crie pool separado com:

```text
leakDetectionThreshold:
2500 ms.
```

Segure uma conexão por três segundos e depois feche no `finally`.

Observe o log.

### Parte 4 — Calculo global

Considere:

```text
8 instâncias;

maximumPoolSize 15;

2 serviços;

20 conexões reservadas para operação.
```

Calcule o potencial e compare com PostgreSQL configurado para 300 conexões.

### Parte 5 — Transacao e saturacao

Com pool de dois slots:

1. abra duas transações;
2. tente uma terceira aquisição;
3. confirme espera;
4. finalize as primeiras;
5. confirme recuperação.

### Parte 6 — Estado contaminado

Altere `readOnly`, isolamento e autocommit em um experimento controlado.

Feche a conexão e observe o próximo empréstimo.

Mantenha a restauração explícita do transaction manager.

### Parte 7 — Shutdown

Abra o DataSource, execute consulta, feche, confirme `isClosed` e valide que uma nova aquisição falha.

### Parte 8 — Health report

Crie:

```java
PoolHealthReport
```

Campos:

```text
poolName;

active;

idle;

total;

threadsAwaiting;

maximumPoolSize;

saturated;

healthy.
```

Não inclua credenciais.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade oficial;
- o laboratório oficial da aula 319 existe;
- a continuidade com a aula 318 foi preservada;
- projeto Maven usa Java 21;
- pgJDBC permanece fixado;
- HikariCP 7.1.0 foi configurado;
- configuração real está fora do Git;
- `DatabaseSettings` foi criado;
- `PoolSettings` foi criado;
- configurações inválidas são rejeitadas;
- `HikariDataSourceFactory` foi criado;
- `HikariConfig` foi utilizado;
- `HikariDataSource` foi utilizado;
- poolName foi definido;
- schema foi definido;
- maximumPoolSize foi definido;
- minimumIdle foi definido;
- connectionTimeout foi definido;
- validationTimeout foi definido;
- idleTimeout foi definido;
- maxLifetime foi definido;
- keepaliveTime foi definido;
- leak detection ficou desativada no fluxo principal;
- initializationFailTimeout foi definido;
- autoCommit padrão é true;
- readOnly padrão é false;
- driverClassName não foi configurado;
- connectionTestQuery não foi configurada;
- `DataSourceConnectionProvider` foi criado;
- transaction manager foi reutilizado;
- `ConnectionProvider` não depende de HikariCP;
- conexão lógica foi obtida;
- close devolveu a conexão;
- métricas active foram observadas;
- métricas idle foram observadas;
- total foi observado;
- threadsAwaiting foi observado;
- quatro Clientes foram consultados;
- backend PID foi lido;
- pool de um slot reutilizou sessão física;
- pool de saturação respeitou máximo dois;
- terceira aquisição expirou;
- `SQLTransientConnectionException` foi observada;
- autocommit foi restaurado;
- read only foi restaurado;
- isolamento foi preservado;
- DataSource foi fechado no shutdown;
- nenhum pool foi criado por DAO;
- nenhuma Connection global foi criada;
- testes unitários foram criados;
- testes de integração foram criados;
- dimensionamento global foi documentado;
- saturação foi documentada;
- nenhum DML foi executado;
- CRUD não foi antecipado;
- nenhum Spring foi usado;
- nenhum JPA ou Hibernate foi usado;
- schema `projeto_os_final` permaneceu intacto;
- ponte para a aula 320 está correta;
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
  labs/m13/aula-319-connection-pool-hikaricp-conceitual
```

Commit recomendado:

```powershell
git commit -m "feat(m13): configurar pool jdbc com hikaricp"
```

Valide:

```powershell
git log -1 --oneline
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você substituiu abertura repetitiva de conexões físicas por um pool controlado.

Aprendeu que:

```text
HikariDataSource implementa DataSource;

o pool mantém conexões físicas;

a aplicação recebe conexões lógicas;

close devolve ao pool;

maximumPoolSize limita capacidade;

connectionTimeout limita espera;

minimumIdle influencia ociosidade;

idleTimeout remove excedentes;

maxLifetime aposenta conexões;

keepalive valida conexões ociosas;

leak detection auxilia diagnóstico;

métricas revelam uso e saturação;

DataSource vive do startup ao shutdown.
```

O laboratório comprovou:

```text
active cresce durante empréstimo;

close devolve o recurso;

sessão física pode ser reutilizada;

saturação produz timeout;

transaction manager funciona sobre DataSource;

estado é restaurado;

pool fecha no final.
```

A próxima aula será:

```text
320 - M13.10 - Mini projeto JDBC CRUD OS parte 1
```

Nela, você reunirá:

- HikariCP;
- transaction manager;
- tratamento de exceções;
- Repository Pattern;
- DAO;
- PreparedStatement;
- ResultSet;
- mapeamento;
- validação;
- criação de Ordem;
- consulta por ID e código;
- listagem;
- testes de integração.

---

# Material complementar

## Checkpoint final

- [ ] Configurei HikariCP sem Spring.
- [ ] Diferenciei conexão física de conexão lógica.
- [ ] Comprovei que `close()` devolve ao pool.
- [ ] Observei métricas e saturação.
- [ ] Reutilizei o transaction manager com DataSource.

---

## Troubleshooting adicional

### Terceira conexao nao expira

Confirme que as duas primeiras continuam abertas e que o máximo é dois.

### PID mudou no pool single slot

A conexão pode ter sido invalidada ou aposentada. Repita imediatamente em ambiente local saudável.

### active nao volta a zero

Existe conexão fora de `try-with-resources`.

### idle permanece zero

O pool pode estar inicializando, saturado ou configurado com `minimumIdle=0`.

### Aplicacao nao termina

Confirme que `HikariDataSource.close()` foi chamado.

---

## Perguntas de revisao

1. O que é connection pool?
2. Qual diferença entre conexão física e lógica?
3. O que `close()` faz com HikariCP?
4. O que implementa `HikariDataSource`?
5. Quem deve possuir o DataSource?
6. Pode criar pool por requisição?
7. O que limita `maximumPoolSize`?
8. O que faz `connectionTimeout`?
9. Ele limita query?
10. O que faz `minimumIdle`?
11. Quando `idleTimeout` atua?
12. O que faz `maxLifetime`?
13. Qual relação entre keepalive e maxLifetime?
14. Para que serve leak detection?
15. Active significa query executando?
16. O que é `threadsAwaiting`?
17. Mais conexões sempre aumentam throughput?
18. Por que restaurar estado?
19. Spring foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Conjunto reutilizável de conexões.
2. Sessão real versus empréstimo lógico.
3. Devolve a conexão.
4. `DataSource`.
5. A aplicação durante todo o ciclo.
6. Não.
7. Total de conexões físicas.
8. Espera por conexão disponível.
9. Não.
10. Ociosas mínimas desejadas.
11. Acima do mínimo ocioso.
12. Vida física máxima.
13. Keepalive deve ser menor.
14. Detectar retenção longa.
15. Não necessariamente.
16. Threads esperando conexão.
17. Não.
18. Evitar contaminação.
19. Não.
20. Mini projeto JDBC CRUD OS parte 1.

---

## Desafio opcional

Crie um relatório de saúde do pool e exiba:

```text
nome;

active;

idle;

total;

awaiting;

saturado;

saudável.
```

Regras:

```text
saturado:
active igual ao máximo e idle zero.

saudável:
DataSource aberto,
total maior que zero,
awaiting igual a zero.
```

O relatório é didático e não substitui health check de produção.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 319 - M13.09 - Connection pool e HikariCP conceitual

- Entendi o custo de abrir conexões físicas.
- Diferenciei conexão física de conexão lógica.
- Entendi `close()` como devolução ao pool.
- Usei `HikariDataSource` como `DataSource`.
- Configurei HikariCP sem Spring.
- Fixei a versão 7.1.0 no laboratório.
- Criei `PoolSettings`.
- Validei relações entre timeouts.
- Criei `HikariDataSourceFactory`.
- Mantive senha fora do Git.
- Configurei maximumPoolSize e minimumIdle.
- Configurei connectionTimeout e validationTimeout.
- Entendi idleTimeout, maxLifetime e keepaliveTime.
- Mantive connectionTestQuery ausente com driver JDBC 4.
- Entendi initializationFailTimeout.
- Estudei leakDetectionThreshold.
- Criei `DataSourceConnectionProvider`.
- Reutilizei o transaction manager da aula 318.
- Criei leitura das métricas do pool.
- Observei active, idle, total e awaiting.
- Consultei quatro Clientes pelo pool.
- Comprovei reutilização pelo `pg_backend_pid`.
- Simulei saturação com dois slots.
- Observei timeout na terceira aquisição.
- Confirmei restauração de autocommit.
- Entendi dimensionamento por instância e global.
- Fechei o DataSource no shutdown.
- Não iniciei CRUD, Spring, JPA ou Hibernate.
- Preservei `projeto_os_final`.
- Próxima aula: mini projeto JDBC CRUD OS parte 1.
```

---

## Referencia tecnica curta

```text
HikariDataSource:
pool e DataSource.

physical connection:
sessão PostgreSQL.

logical connection:
empréstimo do pool.

close:
devolução.

maximumPoolSize:
limite físico.

connectionTimeout:
espera por slot.

minimumIdle:
ociosidade mínima.

maxLifetime:
vida física máxima.

keepalive:
validação ociosa.

leak detection:
diagnóstico.

metrics:
active, idle, total, awaiting.
```

Regra final:

```text
um pool profissional precisa de ciclo de vida unico, limites medidos, conexoes sempre devolvidas, estado restaurado e metricas observadas; aumentar conexoes sem diagnostico nao substitui arquitetura nem performance.
```
