# 311 - M13.01 - JDBC visao geral e driver PostgreSQL

## Apresentacao da aula

Você iniciou o módulo M13 — Persistência Java: JDBC, JPA, Hibernate e Spring Data.

No módulo M12, o PostgreSQL foi acessado principalmente por:

```text
psql;
DBeaver;
scripts SQL;
Flyway;
pg_dump;
pg_restore.
```

Agora uma aplicação Java começará a conversar com o banco.

Essa comunicação não acontece diretamente entre uma classe Java e uma tabela.

Existe uma cadeia de responsabilidades:

```text
código Java;

API JDBC;

driver PostgreSQL;

protocolo de comunicação;

servidor PostgreSQL;

database;

schema;

tabelas e views.
```

JDBC significa:

```text
Java Database Connectivity.
```

Ele é a API padrão da plataforma Java para trabalhar com bancos relacionais por meio de drivers.

A API define contratos como:

```text
Driver;
Connection;
Statement;
PreparedStatement;
ResultSet;
SQLException;
DataSource.
```

O driver PostgreSQL implementa esses contratos e sabe converter chamadas JDBC em comunicação compatível com o PostgreSQL.

Nesta aula, você não executará `SELECT`, `INSERT`, `UPDATE` ou `DELETE` pelo Java.

Também não abrirá uma conexão real.

Essas operações serão introduzidas gradualmente nas próximas aulas.

O objetivo desta primeira aula é compreender e comprovar:

- o que é JDBC;
- o que pertence ao JDK;
- o que pertence ao driver;
- como adicionar o driver ao Maven;
- como o Java encontra o driver;
- como uma URL JDBC identifica o destino;
- como preparar credenciais locais;
- como validar o driver sem conectar;
- quais erros pertencem ao classpath;
- quais erros pertencem à configuração;
- quais responsabilidades ainda não foram estudadas.

O laboratório utilizará o ambiente consolidado no M12:

```text
host:
localhost.

porta:
5433.

database:
formacao_java.

schema principal:
projeto_os_final.

usuário local:
formacao.

senha local:
formacao_local.
```

Esses valores pertencem exclusivamente ao ambiente didático local criado no módulo anterior.

A senha será armazenada em um arquivo ignorado pelo Git.

O programa Java nunca imprimirá a senha.

A dependência usada nesta aula será:

```xml
<groupId>org.postgresql</groupId>
<artifactId>postgresql</artifactId>
<version>42.7.13</version>
```

A versão será fixada no `pom.xml`.

Fixar uma versão torna o build reproduzível e impede que a dependência mude silenciosamente.

O laboratório criará um pequeno catálogo do driver.

Ele deverá informar:

```text
classe do driver;

versão encontrada no JAR;

versão principal;

versão secundária;

se aceita a URL PostgreSQL;

se aceita uma URL incompatível;

se declara conformidade JDBC completa;

quantidade de drivers encontrados.
```

Nenhuma conexão será aberta.

A próxima aula será:

```text
312 - M13.02 - Connection DriverManager e DataSource conceitual
```

Nela, você estudará o objeto `Connection`, a abertura de conexão por `DriverManager`, o conceito de `DataSource`, o ciclo de vida do recurso e as diferenças entre obter uma conexão e administrar conexões.

---

## Onde estamos na formacao

A transição entre M12 e M13 é:

```text
M12:
entender e operar o banco.

M13:
integrar o banco à aplicação Java.
```

A sequência inicial do M13 será:

```text
311:
visão geral do JDBC e driver PostgreSQL.

312:
Connection, DriverManager e DataSource.

313:
primeira conexão real e fechamento seguro.

314:
Statement e execução de SQL simples.

315:
PreparedStatement e parâmetros.
```

O aprendizado será progressivo.

Nesta aula:

```text
driver disponível:
sim.

URL validada:
sim.

configuração local:
sim.

conexão aberta:
não.

SQL executado:
não.
```

Essa separação é intencional.

Quando uma conexão falhar no futuro, você precisará distinguir:

```text
dependência ausente;

driver não carregado;

URL inválida;

porta inacessível;

database inexistente;

credencial incorreta;

permissão negada;

SQL inválido;

transação incorreta.
```

Se todas essas responsabilidades forem apresentadas ao mesmo tempo, o diagnóstico fica confuso.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-311-jdbc-visao-geral-driver-postgresql
```

Estrutura final:

```text
labs
└── m13
    └── aula-311-jdbc-visao-geral-driver-postgresql
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-configuracao.md
        │   ├── mapa-camadas-jdbc.md
        │   └── troubleshooting-driver.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   └── 02_executar_inspecao.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula311
            │                           ├── DatabaseSettings.java
            │                           ├── DriverReport.java
            │                           ├── JdbcDriverCatalog.java
            │                           └── Main.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula311
                                        ├── DatabaseSettingsTest.java
                                        └── JdbcDriverCatalogTest.java
```

Resultado esperado da aplicação:

```text
JDBC_URL configurada:
jdbc:postgresql://localhost:5433/formacao_java

usuário:
formacao

senha configurada:
true

driver PostgreSQL encontrado:
true

classe:
org.postgresql.Driver

versão do JAR:
42.7.13

aceita URL PostgreSQL:
true

aceita URL MySQL:
false
```

O campo `jdbcCompliant` pode aparecer como `false`.

Isso não significa que o driver esteja quebrado.

O método informa se o driver declara conformidade completa com toda a especificação JDBC e com o nível exigido de SQL.

O critério importante desta aula é:

```text
driver encontrado;

versão identificada;

URL PostgreSQL aceita;

URL incompatível rejeitada.
```

---

## Conceito essencial

### JDBC pertence ao Java

As interfaces principais estão no módulo:

```text
java.sql
```

Exemplos:

```java
java.sql.Driver;
java.sql.Connection;
java.sql.PreparedStatement;
java.sql.ResultSet;
java.sql.SQLException;
```

Você não precisa adicionar uma dependência Maven para obter essas interfaces.

Elas fazem parte do JDK.

Entretanto, o JDK não conhece os detalhes de cada banco.

Ele não sabe, sozinho:

- autenticar no PostgreSQL;
- interpretar propriedades específicas;
- negociar o protocolo;
- converter tipos PostgreSQL;
- enviar mensagens ao servidor;
- receber respostas do PostgreSQL.

Essa parte pertence ao driver.

---

### Driver pertence ao fornecedor

O driver PostgreSQL é distribuído como um JAR.

Coordenadas Maven:

```text
groupId:
org.postgresql.

artifactId:
postgresql.
```

Quando o Maven resolve a dependência, o JAR entra no classpath de execução.

Dentro dele existem:

- implementação de `java.sql.Driver`;
- classes de conexão;
- conversores;
- suporte a tipos;
- propriedades específicas;
- integração com o protocolo do PostgreSQL;
- metadados para descoberta automática.

A aplicação deve programar principalmente contra as interfaces JDBC.

Ela não deve espalhar classes específicas do driver pelo domínio sem necessidade.

---

### API e implementacao

Considere:

```java
Driver driver;
```

`Driver` é a interface da API JDBC.

O objeto real pode ser:

```text
org.postgresql.Driver.
```

Essa separação permite que o código conheça o contrato e o classpath forneça a implementação.

A mesma ideia aparecerá novamente com:

```text
Connection;

DataSource.
```

---

### Classpath

Classpath é o conjunto de locais onde a JVM procura classes e recursos.

Uma dependência pode estar:

```text
declarada no pom;

baixada no repositório local;

presente na compilação;

presente nos testes;

presente na execução.
```

Esses estados não são equivalentes.

Se o driver não estiver no classpath de execução, a aplicação pode compilar porque usa somente `java.sql`, mas não encontrará uma implementação PostgreSQL ao executar.

Esse é um diagnóstico importante:

```text
compilou:
a API JDBC existe.

não encontrou driver:
a implementação não está disponível em runtime.
```

---

### Escopo runtime

O código desta aula usa somente interfaces do JDK.

Ele não importa diretamente:

```java
org.postgresql.Driver;
```

Por isso, a dependência será declarada com:

```xml
<scope>runtime</scope>
```

Significado:

```text
não é necessária para compilar o código principal;

é necessária para executar a aplicação;

é disponibilizada durante os testes.
```

Esse escopo reforça a separação entre API e implementação.

Se uma classe específica do PostgreSQL fosse importada no código principal, o escopo `runtime` não seria suficiente para a compilação.

---

### Descoberta automatica

Em versões antigas do JDBC, era comum escrever:

```java
Class.forName("org.postgresql.Driver");
```

A chamada forçava o carregamento da classe.

Desde JDBC 4, drivers modernos podem ser descobertos automaticamente por meio do mecanismo de service provider.

O JAR informa que fornece uma implementação de:

```text
java.sql.Driver.
```

A JVM e a infraestrutura JDBC podem carregar o provider sem uma chamada manual a `Class.forName`.

Nesta aula, você usará:

```java
ServiceLoader.load(Driver.class)
```

para tornar essa descoberta visível.

Isso não abre uma conexão.

Apenas instancia providers disponíveis.

---

### META-INF services

Um JAR pode declarar providers por um recurso como:

```text
META-INF/services/java.sql.Driver
```

O arquivo contém o nome da implementação.

O mecanismo `ServiceLoader` lê esse registro.

Essa explicação ajuda a compreender por que:

```text
adicionar o JAR correto ao runtime
```

pode ser suficiente para o driver aparecer.

---

### DriverManager

`DriverManager` mantém uma infraestrutura de drivers registrados e pode selecionar um driver para uma URL.

Nesta aula, ele será citado apenas como parte da arquitetura.

A abertura de conexão por:

```java
DriverManager.getConnection(...)
```

pertence às próximas aulas.

Não use `getConnection` ainda.

A aula 312 comparará conceitualmente `DriverManager` e `DataSource`.

---

### URL JDBC

Uma URL local PostgreSQL típica é:

```text
jdbc:postgresql://localhost:5433/formacao_java
```

Partes:

```text
jdbc:
indica a família JDBC.

postgresql:
subprotocolo e banco esperado.

localhost:
host acessível pela aplicação.

5433:
porta publicada no computador.

formacao_java:
database.
```

A porta do container é:

```text
5432.
```

A porta acessível pelo Java no host é:

```text
5433.
```

Isso decorre do mapeamento criado no M12:

```text
5433:5432.
```

O Java não deve utilizar `5432` ao executar fora do container, a menos que o ambiente tenha outro mapeamento.

---

### URL nao contem schema por padrao

A URL informa o database.

Ela não seleciona automaticamente:

```text
projeto_os_final.
```

O schema poderá ser tratado por:

- nomes qualificados no SQL;
- `search_path`;
- propriedade de conexão específica;
- configuração da aplicação.

No início do M13, use nomes qualificados:

```sql
projeto_os_final.cliente
```

Isso reduz ambiguidades.

---

### URL aceita nao significa conexao valida

O método:

```java
driver.acceptsURL(url)
```

verifica se o driver reconhece o formato e o subprotocolo.

Ele não comprova:

- servidor em execução;
- porta acessível;
- database existente;
- usuário válido;
- senha correta;
- autorização;
- TLS;
- rede;
- timeout.

Por isso, o relatório desta aula é uma validação do driver e da forma da URL, não uma prova de conexão.

---

### Configuracao e segredo

A aplicação precisa de:

```text
URL;

usuário;

senha.
```

Esses valores não devem ficar hardcoded em uma classe Java.

Motivos:

- mudam entre ambientes;
- podem conter segredos;
- dificultam rotação;
- podem vazar no Git;
- misturam configuração e código.

Nesta aula, um script PowerShell lerá:

```text
config/database.local.env
```

e exportará valores apenas para o processo que executa o Maven.

O arquivo real ficará no `.gitignore`.

O arquivo `.example` documentará o contrato local.

---

### Variaveis de ambiente

Nomes usados:

```text
JDBC_URL;

JDBC_USER;

JDBC_PASSWORD.
```

O Java acessará por:

```java
System.getenv("JDBC_URL")
```

A classe de configuração falhará cedo quando uma variável estiver ausente ou vazia.

Essa estratégia é chamada:

```text
fail fast.
```

É melhor encerrar com uma mensagem objetiva do que avançar com valores nulos e falhar longe da causa.

---

### Nao imprimir senha

Um diagnóstico pode mostrar:

```text
senha configurada:
true.
```

Ele não deve mostrar:

```text
senha:
formacao_local.
```

Logs podem ser enviados para:

- console;
- arquivo;
- observabilidade;
- suporte;
- pipelines;
- plataformas externas.

Segredo exposto em log deixa de ser segredo.

---

### Versao do driver

O driver oferece informações por:

```java
getMajorVersion();

getMinorVersion();
```

O JAR também pode disponibilizar:

```java
Package.getImplementationVersion();
```

A versão completa ajuda a responder:

```text
qual artefato realmente foi executado?
```

Isso é diferente de olhar apenas o `pom.xml`.

O `pom.xml` mostra a intenção.

O relatório em runtime mostra o artefato carregado.

---

### Dependencia transitiva

Uma dependência é transitiva quando chega por meio de outra biblioteca.

No início do M13, o driver será declarado diretamente.

Isso torna explícito que a aplicação depende dele.

Não confie em um driver que apareceu acidentalmente por outra dependência.

Uma atualização futura poderia removê-lo.

---

### Driver e protocolo

JDBC não envia SQL diretamente por mágica.

O driver:

1. recebe chamadas Java;
2. interpreta URL e propriedades;
3. estabelece comunicação quando solicitado;
4. converte dados;
5. envia mensagens compatíveis;
6. transforma respostas em objetos JDBC.

Detalhes de rede permanecem encapsulados.

Isso permite que o código Java trabalhe com interfaces padronizadas.

---

### JDBC nao e ORM

JDBC é uma API de baixo nível em relação a JPA e Hibernate.

Com JDBC, a aplicação normalmente controla explicitamente:

- SQL;
- parâmetros;
- conexão;
- transação;
- leitura do resultado;
- conversão para objetos;
- fechamento de recursos.

JPA é uma especificação de persistência orientada a entidades.

Hibernate é uma implementação muito usada dessa especificação e também oferece recursos próprios.

Spring Data adiciona abstrações de repositório.

Essas camadas serão estudadas depois.

Compreender JDBC reduz a sensação de magia quando abstrações superiores forem usadas.

---

### Responsabilidades ainda nao implementadas

Esta aula não implementa:

```text
Connection;

Statement;

PreparedStatement;

ResultSet;

commit;

rollback;

pool de conexões;

CRUD;

DAO;

Repository;

JPA;

Hibernate.
```

A ausência desses itens não torna o laboratório incompleto.

Ela preserva o escopo correto da primeira aula.

---

## Mao na massa guiada

### 1. Verificar o ambiente herdado

Na raiz do repositório:

```powershell
java -version
javac -version
mvn -version
docker ps --filter "name=formacao-postgres-m12"
```

Resultados mínimos:

```text
Java 21;

Maven disponível;

container formacao-postgres-m12 em execução.
```

Verifique a porta:

```powershell
Test-NetConnection `
  -ComputerName localhost `
  -Port 5433
```

O campo:

```text
TcpTestSucceeded
```

deve ser `True`.

Esse teste confirma o endpoint TCP.

Ele não autentica no PostgreSQL.

---

### 2. Criar o laboratorio

Execute:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-311-jdbc-visao-geral-driver-postgresql\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-311-jdbc-visao-geral-driver-postgresql\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-311-jdbc-visao-geral-driver-postgresql\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-311-jdbc-visao-geral-driver-postgresql\src\main\java\br\com\formacao\m13\aula311"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-311-jdbc-visao-geral-driver-postgresql\src\test\java\br\com\formacao\m13\aula311"

Set-Location `
  "labs\m13\aula-311-jdbc-visao-geral-driver-postgresql"
```

---

### 3. Criar .gitignore

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

O arquivo local de configuração não será versionado.

---

### 4. Criar pom.xml

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
    <artifactId>aula-311-jdbc-driver-postgresql</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <name>Aula 311 - JDBC e driver PostgreSQL</name>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>
            UTF-8
        </project.build.sourceEncoding>

        <postgresql.version>42.7.13</postgresql.version>
        <junit.version>5.10.2</junit.version>
        <surefire.version>3.2.5</surefire.version>
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
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>${exec.version}</version>
                <configuration>
                    <mainClass>
                        br.com.formacao.m13.aula311.Main
                    </mainClass>
                    <classpathScope>runtime</classpathScope>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

A dependência do driver está em `runtime`.

---

### 5. Inspecionar a dependencia

Execute:

```powershell
mvn dependency:tree
```

Procure:

```text
org.postgresql:postgresql:jar:42.7.13:runtime
```

Depois:

```powershell
mvn dependency:build-classpath `
  "-Dmdep.outputFile=target\classpath.txt"
```

Abra:

```powershell
Get-Content ".\target\classpath.txt"
```

O caminho do JAR PostgreSQL deve aparecer.

Não versione `target`.

---

### 6. Criar database.local.env.example

Crie:

```text
config/database.local.env.example
```

Conteúdo:

```properties
JDBC_URL=jdbc:postgresql://localhost:5433/formacao_java
JDBC_USER=formacao
JDBC_PASSWORD=formacao_local
```

Copie para o arquivo local:

```powershell
Copy-Item `
  ".\config\database.local.env.example" `
  ".\config\database.local.env"
```

Confirme:

```powershell
git status
```

O arquivo:

```text
config/database.local.env
```

não deve aparecer.

O `.example` deve aparecer como novo arquivo versionável.

---

### 7. Criar DatabaseSettings.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula311/DatabaseSettings.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula311;

import java.util.Map;
import java.util.Objects;

public record DatabaseSettings(
        String url,
        String user,
        String password
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
                environment.get("JDBC_PASSWORD")
        );
    }

    public boolean passwordConfigured() {
        return !password.isBlank();
    }

    public String safeDescription() {
        return """
                JDBC_URL configurada: %s
                usuário: %s
                senha configurada: %s
                """.formatted(
                url,
                user,
                passwordConfigured()
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
}
```

A senha permanece no record porque será necessária nas próximas aulas.

O método de descrição não a expõe.

---

### 8. Criar DriverReport.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula311/DriverReport.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula311;

public record DriverReport(
        String className,
        String implementationVersion,
        int majorVersion,
        int minorVersion,
        boolean jdbcCompliant,
        boolean acceptsPostgreSqlUrl,
        boolean acceptsIncompatibleUrl
) {

    public DriverReport {
        if (className == null || className.isBlank()) {
            throw new IllegalArgumentException(
                    "className é obrigatório"
            );
        }
    }

    public String formatted() {
        return """
                classe: %s
                versão do JAR: %s
                versão principal: %d
                versão secundária: %d
                JDBC compliant: %s
                aceita URL PostgreSQL: %s
                aceita URL MySQL: %s
                """.formatted(
                className,
                implementationVersion,
                majorVersion,
                minorVersion,
                jdbcCompliant,
                acceptsPostgreSqlUrl,
                acceptsIncompatibleUrl
        ).strip();
    }
}
```

---

### 9. Criar JdbcDriverCatalog.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula311/JdbcDriverCatalog.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula311;

import java.sql.Driver;
import java.sql.SQLException;
import java.util.List;
import java.util.ServiceLoader;

public final class JdbcDriverCatalog {

    private static final String POSTGRESQL_DRIVER =
            "org.postgresql.Driver";

    private static final String INCOMPATIBLE_URL =
            "jdbc:mysql://localhost:3306/exemplo";

    private JdbcDriverCatalog() {
    }

    public static List<Driver> loadDrivers() {
        return ServiceLoader
                .load(Driver.class)
                .stream()
                .map(ServiceLoader.Provider::get)
                .toList();
    }

    public static Driver findPostgreSqlDriver(
            List<Driver> drivers
    ) {
        return drivers.stream()
                .filter(driver ->
                        driver.getClass()
                                .getName()
                                .equals(POSTGRESQL_DRIVER)
                )
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Driver PostgreSQL "
                                        + "não encontrado "
                                        + "no classpath runtime"
                        )
                );
    }

    public static DriverReport inspect(
            Driver driver,
            String postgreSqlUrl
    ) throws SQLException {
        String implementationVersion =
                driver.getClass()
                        .getPackage()
                        .getImplementationVersion();

        if (implementationVersion == null) {
            implementationVersion =
                    "não informada pelo JAR";
        }

        return new DriverReport(
                driver.getClass().getName(),
                implementationVersion,
                driver.getMajorVersion(),
                driver.getMinorVersion(),
                driver.jdbcCompliant(),
                driver.acceptsURL(postgreSqlUrl),
                driver.acceptsURL(INCOMPATIBLE_URL)
        );
    }
}
```

`acceptsURL` não abre conexão.

---

### 10. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula311/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula311;

import java.sql.Driver;
import java.util.List;

public final class Main {

    private Main() {
    }

    public static void main(String[] args) {
        try {
            DatabaseSettings settings =
                    DatabaseSettings.fromEnvironment();

            List<Driver> drivers =
                    JdbcDriverCatalog.loadDrivers();

            Driver postgreSqlDriver =
                    JdbcDriverCatalog
                            .findPostgreSqlDriver(
                                    drivers
                            );

            DriverReport report =
                    JdbcDriverCatalog.inspect(
                            postgreSqlDriver,
                            settings.url()
                    );

            System.out.println(
                    "=== Configuração segura ==="
            );
            System.out.println(
                    settings.safeDescription()
            );

            System.out.println();
            System.out.println(
                    "=== Catálogo JDBC ==="
            );
            System.out.printf(
                    "drivers encontrados: %d%n",
                    drivers.size()
            );
            System.out.println(
                    "driver PostgreSQL encontrado: true"
            );
            System.out.println(
                    report.formatted()
            );

            if (!report.acceptsPostgreSqlUrl()) {
                throw new IllegalStateException(
                        "O driver não aceitou "
                                + "a JDBC_URL configurada"
                );
            }

            if (report.acceptsIncompatibleUrl()) {
                throw new IllegalStateException(
                        "O driver aceitou uma URL "
                                + "de subprotocolo incompatível"
                );
            }

            System.out.println();
            System.out.println(
                    "Nenhuma conexão foi aberta."
            );
        } catch (Exception exception) {
            System.err.println(
                    "Falha na inspeção JDBC: "
                            + exception.getMessage()
            );
            System.exit(1);
        }
    }
}
```

O programa termina com código diferente de zero em caso de falha.

---

### 11. Criar DatabaseSettingsTest.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula311/DatabaseSettingsTest.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula311;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;

import org.junit.jupiter.api.Test;

class DatabaseSettingsTest {

    @Test
    void shouldCreateSettingsFromValidValues() {
        DatabaseSettings settings =
                DatabaseSettings.from(
                        Map.of(
                                "JDBC_URL",
                                "jdbc:postgresql://"
                                        + "localhost:5433/"
                                        + "formacao_java",
                                "JDBC_USER",
                                "formacao",
                                "JDBC_PASSWORD",
                                "formacao_local"
                        )
                );

        assertTrue(
                settings.url()
                        .startsWith(
                                "jdbc:postgresql://"
                        )
        );
        assertTrue(
                settings.passwordConfigured()
        );
        assertFalse(
                settings.safeDescription()
                        .contains(
                                "formacao_local"
                        )
        );
    }

    @Test
    void shouldRejectMissingPassword() {
        Map<String, String> environment =
                Map.of(
                        "JDBC_URL",
                        "jdbc:postgresql://"
                                + "localhost:5433/"
                                + "formacao_java",
                        "JDBC_USER",
                        "formacao"
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> DatabaseSettings.from(
                        environment
                )
        );
    }

    @Test
    void shouldRejectNonPostgreSqlUrl() {
        assertThrows(
                IllegalArgumentException.class,
                () -> new DatabaseSettings(
                        "jdbc:mysql://"
                                + "localhost:3306/"
                                + "formacao_java",
                        "formacao",
                        "formacao_local"
                )
        );
    }
}
```

---

### 12. Criar JdbcDriverCatalogTest.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula311/JdbcDriverCatalogTest.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula311;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Driver;
import java.util.List;

import org.junit.jupiter.api.Test;

class JdbcDriverCatalogTest {

    private static final String POSTGRESQL_URL =
            "jdbc:postgresql://"
                    + "localhost:5433/"
                    + "formacao_java";

    @Test
    void shouldDiscoverPostgreSqlDriver() {
        List<Driver> drivers =
                JdbcDriverCatalog.loadDrivers();

        Driver driver =
                JdbcDriverCatalog
                        .findPostgreSqlDriver(
                                drivers
                        );

        assertEquals(
                "org.postgresql.Driver",
                driver.getClass().getName()
        );
    }

    @Test
    void shouldAcceptOnlyCompatibleUrl()
            throws Exception {
        Driver driver =
                JdbcDriverCatalog
                        .findPostgreSqlDriver(
                                JdbcDriverCatalog
                                        .loadDrivers()
                        );

        DriverReport report =
                JdbcDriverCatalog.inspect(
                        driver,
                        POSTGRESQL_URL
                );

        assertNotNull(report);
        assertTrue(
                report.acceptsPostgreSqlUrl()
        );
        assertFalse(
                report.acceptsIncompatibleUrl()
        );
        assertTrue(
                report.majorVersion() > 0
        );
    }
}
```

O teste não precisa do PostgreSQL em execução.

Ele valida o JAR e a URL.

---

### 13. Criar 01_verificar_pre_requisitos.ps1

Crie:

```text
scripts/01_verificar_pre_requisitos.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

Write-Host "=== Java ==="
java -version

if ($LASTEXITCODE -ne 0) {
    throw "Java indisponível."
}

Write-Host "=== Javac ==="
javac -version

if ($LASTEXITCODE -ne 0) {
    throw "Javac indisponível."
}

Write-Host "=== Maven ==="
mvn -version

if ($LASTEXITCODE -ne 0) {
    throw "Maven indisponível."
}

Write-Host "=== Container ==="
$container = docker ps `
    --filter "name=formacao-postgres-m12" `
    --format "{{.Names}}"

if ($container -ne "formacao-postgres-m12") {
    throw (
        "Container formacao-postgres-m12 "
        + "não está em execução."
    )
}

Write-Host "=== Porta local ==="
$porta = Test-NetConnection `
    -ComputerName localhost `
    -Port 5433 `
    -WarningAction SilentlyContinue

if (-not $porta.TcpTestSucceeded) {
    throw "A porta localhost:5433 não respondeu."
}

Write-Host "Pré-requisitos validados."
```

---

### 14. Criar 02_executar_inspecao.ps1

Crie:

```text
scripts/02_executar_inspecao.ps1
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
    throw (
        "Arquivo database.local.env ausente. "
        + "Copie o .example."
    )
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
            throw "Linha inválida no arquivo local."
        }

        $name = $parts[0].Trim()
        $value = $parts[1].Trim()

        if ([string]::IsNullOrWhiteSpace($value)) {
            throw "Valor vazio para $name"
        }

        $variables[$name] = $value
    }

$required = @(
    "JDBC_URL",
    "JDBC_USER",
    "JDBC_PASSWORD"
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
        throw "Testes falharam."
    }

    mvn exec:java

    if ($LASTEXITCODE -ne 0) {
        throw "Inspeção do driver falhou."
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

O script remove as variáveis do processo ao terminar.

---

### 15. Executar o laboratorio

Primeiro:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
```

Depois:

```powershell
.\scripts\02_executar_inspecao.ps1
```

O Maven deve:

1. baixar dependências;
2. compilar;
3. executar cinco testes;
4. iniciar `Main`;
5. encontrar `org.postgresql.Driver`;
6. validar a URL;
7. não abrir conexão.

Confira também:

```powershell
mvn -q test
```

---

### 16. Confirmar que nenhuma conexao foi aberta

O código não contém:

```java
DriverManager.getConnection(...);
```

Procure:

```powershell
Get-ChildItem `
  -Path ".\src" `
  -Recurse `
  -Filter "*.java" |
  Select-String `
    -Pattern "getConnection"
```

O resultado deve estar vazio.

Essa validação protege o escopo.

---

### 17. Criar mapa-camadas-jdbc.md

Em:

```text
docs/mapa-camadas-jdbc.md
```

documente:

```text
Camada | Exemplo | Responsabilidade | Presente nesta aula
```

Inclua:

```text
Aplicação:
Main.

API JDBC:
java.sql.Driver.

Driver:
org.postgresql.Driver.

Configuração:
DatabaseSettings.

Rede:
localhost:5433.

Servidor:
PostgreSQL no container.

Database:
formacao_java.

Schema:
projeto_os_final.
```

Marque:

```text
conexão:
ainda não implementada.

SQL:
ainda não executado.
```

---

### 18. Criar contrato-configuracao.md

Em:

```text
docs/contrato-configuracao.md
```

registre:

```text
JDBC_URL:
obrigatória;
prefixo jdbc:postgresql://;
não contém senha.

JDBC_USER:
obrigatória;
usuário local formacao.

JDBC_PASSWORD:
obrigatória;
não imprimir;
não versionar.

arquivo local:
config/database.local.env.

arquivo versionado:
config/database.local.env.example.
```

Inclua uma tabela de ambientes:

```text
Ambiente | Origem da configuração | Segredo | Pode versionar
```

Para o laboratório local:

```text
arquivo ignorado;
senha didática;
não versionar o arquivo real.
```

Para produção:

```text
secret manager ou mecanismo equivalente;
segredo rotacionável;
nunca versionar.
```

---

### 19. Criar troubleshooting-driver.md

Em:

```text
docs/troubleshooting-driver.md
```

registre os diagnósticos:

#### Maven não baixa o driver

Verifique:

- internet;
- coordenadas;
- versão;
- proxy;
- repositório local;
- mensagem completa do Maven.

#### Driver não encontrado

Verifique:

- dependência no `pom.xml`;
- escopo runtime;
- classpath do `exec-maven-plugin`;
- `mvn dependency:tree`;
- execução pelo diretório correto.

#### URL rejeitada

Verifique:

- prefixo `jdbc:postgresql://`;
- host;
- porta;
- database;
- espaços;
- subprotocolo incorreto.

#### Porta não responde

Verifique:

- container;
- mapeamento `5433:5432`;
- firewall;
- outro processo;
- `docker ps`.

#### Senha aparece no log

Interrompa a execução.

Remova o print, revise histórico e rotacione a credencial quando necessário.

---

## Entendendo o que foi feito

### A API veio do JDK

O projeto compilou usando interfaces de `java.sql`.

O Maven não forneceu a API básica.

---

### A implementacao veio do JAR

O driver PostgreSQL apareceu somente no classpath runtime.

O `ServiceLoader` encontrou `org.postgresql.Driver`.

---

### O driver reconheceu o destino

A URL PostgreSQL foi aceita.

A URL MySQL foi rejeitada.

Nenhum socket JDBC foi aberto por essa validação.

---

### A configuracao ficou fora do codigo

URL, usuário e senha vieram do ambiente.

A senha não apareceu no relatório.

---

### O build ficou reproduzivel

A versão do driver foi fixada.

O relatório também mostrou a versão carregada pelo JAR.

---

### O escopo permaneceu controlado

Nenhum `Connection` foi aberto.

Nenhum SQL foi executado.

A aula preparou a base para compreender a conexão na aula 312.

---

## Erros comuns importantes

### Importar org.postgresql.Driver sem necessidade

Isso acopla o código principal à implementação.

Use interfaces JDBC quando o recurso específico do fornecedor não for necessário.

### Usar Class.forName por copiar exemplo antigo

Drivers JDBC 4 podem ser descobertos automaticamente.

Compreenda o motivo antes de adicionar carregamento manual.

### Colocar senha no Main

Configuração não deve ser hardcoded.

Use fonte externa e proteja o segredo.

### Confundir acceptsURL com conexao

Aceitar a URL não autentica nem acessa o servidor.

### Usar porta 5432 no host

O laboratório publica o PostgreSQL em `localhost:5433`.

---

## Comandos uteis

### Dependencias

```powershell
mvn dependency:tree
```

### Testes

```powershell
mvn clean test
```

### Execucao

```powershell
mvn exec:java
```

### Porta

```powershell
Test-NetConnection localhost -Port 5433
```

### Container

```powershell
docker ps --filter "name=formacao-postgres-m12"
```

---

## Exercicio guiado

O exercício principal será ampliar o catálogo sem abrir conexão.

### Parte 1 — Catalogar todos os drivers

Adicione um método que transforme cada driver encontrado em uma linha contendo:

```text
classe;

versão principal;

versão secundária;

versão do JAR.
```

Não filtre antes de montar a lista.

Depois identifique o PostgreSQL.

---

### Parte 2 — Validar tres URLs

Crie uma lista:

```text
jdbc:postgresql://localhost:5433/formacao_java;

jdbc:mysql://localhost:3306/formacao_java;

http://localhost:5433/formacao_java.
```

Para cada URL, informe se o driver PostgreSQL aceita.

Esperado:

```text
true;

false;

false.
```

---

### Parte 3 — Nao expor segredo

Adicione um teste que confirme:

```text
safeDescription não contém a senha;

DriverReport não possui campo de senha;

Main não imprime JDBC_PASSWORD.
```

O teste deve usar uma senha diferente da senha local para evitar falso positivo.

---

### Parte 4 — Falha de configuracao

Execute o `Main` sem `JDBC_PASSWORD`.

Confirme:

```text
código de saída diferente de zero;

mensagem aponta a variável ausente;

nenhuma stack trace extensa é necessária para o usuário do laboratório.
```

Depois restaure a configuração.

---

### Parte 5 — Remover o driver temporariamente

Dentro de uma cópia temporária do `pom.xml`:

1. remova a dependência PostgreSQL;
2. execute `mvn clean test`;
3. observe o teste de descoberta falhar;
4. restaure o `pom.xml`;
5. execute novamente;
6. confirme sucesso.

Não faça commit da versão sem driver.

---

### Parte 6 — Explicar a arquitetura

Sem consultar o material, explique em voz alta:

```text
por que o código compila sem importar PostgreSQL;

por que falha em runtime sem o JAR;

como ServiceLoader encontra a implementação;

por que acceptsURL não abre conexão;

qual é a porta usada pelo Java;

por que a senha não entra no Git.
```

Registre a explicação em:

```text
docs/mapa-camadas-jdbc.md
```

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade;
- o laboratório oficial da aula 311 existe;
- o módulo M13 foi iniciado;
- Java 21 foi validado;
- Maven foi validado;
- container PostgreSQL foi validado;
- porta `5433` respondeu;
- projeto Maven foi criado;
- driver `42.7.13` foi fixado;
- dependência usa escopo runtime;
- JUnit foi configurado;
- exec Maven usa classpath runtime;
- arquivo local de configuração está no `.gitignore`;
- arquivo `.example` possui os valores didáticos corretos;
- `DatabaseSettings` falha com variável ausente;
- URL não PostgreSQL é rejeitada pela configuração;
- senha não aparece na descrição segura;
- `ServiceLoader` foi usado;
- `org.postgresql.Driver` foi encontrado;
- versão do JAR foi identificada;
- versão principal e secundária foram identificadas;
- URL PostgreSQL foi aceita;
- URL MySQL foi rejeitada;
- `jdbcCompliant` foi interpretado corretamente;
- testes não abriram conexão;
- `Main` não chama `getConnection`;
- nenhum SQL foi executado;
- troubleshooting foi documentado;
- mapa de camadas foi documentado;
- contrato de configuração foi documentado;
- exercício principal foi concluído;
- schema `projeto_os_final` foi preservado;
- conexão real não foi antecipada;
- `DriverManager` e `DataSource` não foram aprofundados antes da aula 312;
- commit recomendado pode ser realizado;
- diário de bordo está pronto;
- ponte para a aula 312 está correta.

---

## Commit recomendado

Antes de adicionar:

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
  labs/m13/aula-311-jdbc-visao-geral-driver-postgresql
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): configurar jdbc e driver postgresql"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
início do M13;

API JDBC;

driver PostgreSQL;

classpath runtime;

ServiceLoader;

configuração segura.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você iniciou a persistência Java pela base correta.

Aprendeu que:

```text
JDBC é uma API do Java;

o driver é uma implementação externa;

java.sql pertence ao JDK;

org.postgresql pertence ao JAR;

Maven coloca o driver no classpath;

JDBC 4 permite descoberta automática;

ServiceLoader torna o provider visível;

URL JDBC identifica o destino;

acceptsURL não abre conexão;

configuração não deve ficar hardcoded;

senha não deve aparecer no log.
```

O laboratório comprovou:

```text
driver presente;

classe correta;

versão conhecida;

URL compatível aceita;

URL incompatível rejeitada;

segredo protegido;

nenhuma conexão aberta.
```

A próxima aula será:

```text
312 - M13.02 - Connection DriverManager e DataSource conceitual
```

Nela, você vai estudar:

- o que representa uma `Connection`;
- como `DriverManager` escolhe um driver;
- o que acontece durante `getConnection`;
- por que uma conexão é um recurso;
- estados aberto e fechado;
- `AutoCloseable`;
- propriedades de conexão;
- timeouts introdutórios;
- conceito de `DataSource`;
- diferença entre obter e administrar conexões;
- por que aplicações profissionais usam pools;
- fronteira entre configuração e uso.

A primeira conexão real será construída de forma controlada dentro da sequência oficial do M13.

---

# Material complementar

## Checkpoint final

- [ ] O Maven resolveu o driver PostgreSQL.
- [ ] O ServiceLoader encontrou `org.postgresql.Driver`.
- [ ] A URL PostgreSQL foi aceita sem abrir conexão.
- [ ] A senha permaneceu fora do código e do Git.
- [ ] Os testes passaram e o commit foi realizado.

---

## Troubleshooting adicional

### No suitable driver

Esse erro normalmente aparece quando uma conexão é solicitada e nenhum driver aceita a URL.

Nesta aula, verifique primeiro o catálogo e o classpath.

### ServiceLoader nao retorna driver

Execute:

```powershell
mvn dependency:tree
mvn clean test
```

Confirme o escopo runtime e a configuração do plugin de execução.

### ImplementationVersion retorna null

Alguns JARs podem não expor essa informação no manifesto.

O relatório deve continuar mostrando versão principal e secundária.

### O teste exige banco em execucao

Os testes desta aula não deveriam abrir conexão.

Revise qualquer chamada introduzida indevidamente.

### O arquivo local apareceu no Git

Confirme o caminho exato no `.gitignore`.

Se foi adicionado ao staging:

```powershell
git restore --staged `
  config/database.local.env
```

---

## Perguntas de revisao

1. O que significa JDBC?
2. Onde está a API JDBC?
3. Onde está a implementação PostgreSQL?
4. O que é um driver?
5. Por que o código usa `java.sql.Driver`?
6. Para que serve o classpath?
7. O que significa escopo runtime?
8. Como JDBC 4 descobre drivers?
9. Para que serve `ServiceLoader`?
10. `acceptsURL` abre conexão?
11. Qual é a URL local?
12. Qual porta o Java usa no host?
13. Qual porta o PostgreSQL usa no container?
14. A URL seleciona o schema?
15. Por que usar nome qualificado?
16. Onde ficam as credenciais locais?
17. A senha pode ser impressa?
18. JDBC é ORM?
19. Qual recurso não foi criado nesta aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Java Database Connectivity.
2. No módulo `java.sql` do JDK.
3. No JAR `org.postgresql:postgresql`.
4. Implementação que comunica JDBC com o banco.
5. Programar contra o contrato padrão.
6. Localizar classes e recursos em compilação e execução.
7. Necessária em execução, não no código principal compilado.
8. Pelo mecanismo de service provider.
9. Descobrir implementações registradas.
10. Não.
11. `jdbc:postgresql://localhost:5433/formacao_java`.
12. 5433.
13. 5432.
14. Não por padrão.
15. Evitar ambiguidade.
16. Em arquivo ignorado e variáveis de processo.
17. Não.
18. Não.
19. `Connection`.
20. Connection, DriverManager e DataSource conceitual.

---

## Desafio opcional

Crie uma classe:

```text
JdbcUrlSummary
```

Ela deve receber apenas o formato local adotado no curso:

```text
jdbc:postgresql://host:porta/database
```

E retornar:

```text
subprotocolo;

host;

porta;

database.
```

Regras:

- não aceitar senha na URL;
- porta entre 1 e 65535;
- database não vazio;
- falhar com URL MySQL;
- possuir testes;
- não abrir conexão.

Documente claramente que o parser cobre o contrato didático local e não todas as formas aceitas pelo driver PostgreSQL.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 311 - M13.01 - JDBC visao geral e driver PostgreSQL

- Iniciei o módulo M13 de persistência Java.
- Entendi JDBC como a API padrão de acesso relacional do Java.
- Diferenciei a API `java.sql` da implementação PostgreSQL.
- Configurei um projeto Maven com Java 21.
- Adicionei o driver PostgreSQL com versão fixada.
- Usei escopo `runtime` porque o código principal depende das interfaces JDBC.
- Inspecionei a dependência e o classpath Maven.
- Configurei URL, usuário e senha fora do código.
- Mantive o arquivo local de credenciais fora do Git.
- Criei validação fail fast das variáveis obrigatórias.
- Garanti que a senha não aparece na descrição segura.
- Usei `ServiceLoader` para descobrir drivers JDBC.
- Encontrei `org.postgresql.Driver`.
- Identifiquei a versão carregada pelo JAR.
- Validei que o driver aceita a URL PostgreSQL.
- Validei que o driver rejeita uma URL MySQL.
- Entendi que `acceptsURL` não abre conexão.
- Diferenciei a porta do host da porta interna do container.
- Documentei as camadas entre Java e PostgreSQL.
- Criei testes sem acessar o banco.
- Preservei `projeto_os_final` para as próximas aulas.
- Próxima aula: Connection, DriverManager e DataSource conceitual.
```

---

## Referencia tecnica curta

```text
JDBC:
API padrão Java.

java.sql:
interfaces do JDK.

Driver:
implementação do fornecedor.

pgJDBC:
driver PostgreSQL.

Classpath:
classes e recursos disponíveis.

runtime:
dependência necessária ao executar.

ServiceLoader:
descoberta de providers.

JDBC URL:
identificação do destino.

acceptsURL:
compatibilidade de formato.

Connection:
recurso da próxima etapa.
```

Regra final:

```text
antes de abrir uma conexao, confirme que a API, o driver, o classpath, a URL e a configuracao possuem responsabilidades claras e podem ser validados separadamente.
```
