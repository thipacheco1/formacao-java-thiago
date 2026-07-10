# 313 - M13.03 - PreparedStatement e SQL Injection

## Apresentacao da aula

Na aula 312, você abriu a primeira conexão JDBC real com PostgreSQL.

O laboratório anterior comprovou:

```text
driver disponível;

URL válida;

credenciais corretas;

database formacao_java acessível;

schema projeto_os_final configurado;

Connection aberta;

Connection válida;

Connection fechada com try-with-resources.
```

Agora a aplicação Java executará sua primeira consulta SQL.

O objeto central desta aula será:

```java
java.sql.PreparedStatement
```

O `PreparedStatement` representa uma instrução SQL parametrizada.

Em vez de concatenar valores diretamente no texto:

```java
String sql =
        "SELECT ..."
        + " WHERE codigo = '"
        + codigo
        + "'";
```

você escreverá:

```java
String sql = """
        SELECT ...
        FROM projeto_os_final.cliente
        WHERE codigo = ?
        """;
```

Depois associará o valor:

```java
statement.setString(
        1,
        codigo
);
```

A diferença é essencial:

```text
o SQL continua sendo SQL;

o valor continua sendo dado.
```

Esse princípio ajuda a prevenir SQL Injection.

SQL Injection ocorre quando uma entrada controlada por usuário ou sistema externo consegue alterar a estrutura de uma instrução SQL.

Exemplo de entrada maliciosa:

```text
CLI-POF-ALFA' OR '1'='1
```

Em uma consulta construída por concatenação, esse texto pode modificar o filtro.

Em um `PreparedStatement`, ele será tratado como um único valor de parâmetro.

O PostgreSQL procurará literalmente um código igual ao texto informado.

Não encontrará todos os Clientes.

Nesta aula, você trabalhará com consultas de leitura sobre:

```text
projeto_os_final.cliente;

projeto_os_final.ordem_servico.
```

O foco será:

- placeholders `?`;
- índice dos parâmetros;
- setters tipados;
- `executeQuery`;
- fechamento dos recursos;
- tratamento de `SQLException`;
- diferença entre SQL seguro e concatenação;
- entradas maliciosas;
- consultas opcionais com SQL estático;
- validação dos resultados.

Haverá um primeiro contato controlado com:

```java
java.sql.ResultSet
```

Entretanto, a leitura aprofundada de tipos, cursor, colunas, nulos e mapeamento pertence à aula seguinte.

Nesta aula, o `ResultSet` será usado apenas para:

- verificar se existe linha;
- ler poucas colunas conhecidas;
- contar resultados;
- demonstrar segurança dos parâmetros.

Você não criará DAO completo.

Não criará repository.

Não fará `INSERT`, `UPDATE` ou `DELETE`.

Não estudará transação manual.

A conexão continuará com autocommit padrão porque todas as operações serão apenas `SELECT`.

A próxima aula será:

```text
314 - M13.04 - ResultSet e leitura de dados
```

Nela, você aprofundará o cursor, getters tipados, aliases, ordem das colunas, SQL `NULL`, `wasNull`, conversões e leitura de múltiplas linhas.

---

## Onde estamos na formacao

A sequência inicial do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection e ciclo de vida.

313:
PreparedStatement e SQL Injection.

314:
ResultSet e leitura de dados.

315:
mapeamento manual de linha para objeto.
```

Nesta aula:

```text
Connection:
sim.

PreparedStatement:
sim.

ResultSet:
uso introdutório.

parâmetros:
sim.

SQL Injection:
demonstrada e bloqueada.

DML:
não.

transação manual:
não.

mapeamento completo:
não.
```

O objetivo é aprender a executar SQL de leitura sem misturar código e dados.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-313-preparedstatement-sql-injection
```

Estrutura final:

```text
labs
└── m13
    └── aula-313-preparedstatement-sql-injection
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-consultas.md
        │   ├── preparedstatement-vs-concatenacao.md
        │   ├── roteiro-sql-injection.md
        │   └── troubleshooting-preparedstatement.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_consultas.ps1
        │   └── 03_validar_ausencia_concatenacao.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula313
            │                           ├── ClienteResumo.java
            │                           ├── ClienteSearch.java
            │                           ├── ConnectionProvider.java
            │                           ├── DatabaseSettings.java
            │                           ├── DriverManagerConnectionProvider.java
            │                           └── Main.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula313
                                        ├── ClienteSearchIT.java
                                        └── DatabaseSettingsTest.java
```

Consultas obrigatórias:

```text
buscar Cliente pelo código exato;

buscar Clientes ativos por trecho do nome;

contar Ordens de um Cliente;

testar entrada maliciosa.
```

Resultados esperados:

```text
CLI-POF-ALFA:
1 Cliente.

Cliente:
3 Clientes com nome contendo "Cliente".

Ordens de CLI-POF-ALFA:
2.

entrada maliciosa:
0 Clientes.
```

O seed oficial possui quatro Clientes, mas o Cliente sem Ordem também contém a palavra `Cliente`.

A consulta de nome deverá retornar quatro linhas quando o termo for:

```text
Cliente.
```

Para tornar o resultado principal mais seletivo, o laboratório usará:

```text
Final.
```

Esperado:

```text
3 Clientes.
```

---

## Conceito essencial

### O problema da concatenacao

Considere:

```java
String sql =
        "SELECT id, codigo, nome "
        + "FROM projeto_os_final.cliente "
        + "WHERE codigo = '"
        + codigo
        + "'";
```

Se `codigo` for:

```text
CLI-POF-ALFA
```

o SQL resultante parece correto.

Mas se for:

```text
CLI-POF-ALFA' OR '1'='1
```

o texto pode se tornar:

```sql
SELECT
    id,
    codigo,
    nome
FROM projeto_os_final.cliente
WHERE codigo = 'CLI-POF-ALFA'
   OR '1'='1'
```

A condição adicional é verdadeira para todas as linhas.

O dado modificou a estrutura da instrução.

Esse é o problema.

---

### PreparedStatement separa estrutura e valor

Com:

```java
String sql = """
        SELECT
            id,
            codigo,
            nome
        FROM projeto_os_final.cliente
        WHERE codigo = ?
        """;
```

o SQL é enviado com um placeholder.

Depois:

```java
statement.setString(
        1,
        codigo
);
```

O driver trata o valor de acordo com seu tipo.

A entrada maliciosa não fecha aspas da instrução.

Ela continua sendo apenas texto.

---

### Placeholder nao substitui identificador

O `?` representa valor.

Ele não pode substituir diretamente:

```text
nome da tabela;

nome da coluna;

ASC ou DESC;

operador;

trecho inteiro de SQL.
```

Inválido conceitualmente:

```java
SELECT ? FROM ?
```

Para elementos estruturais, use:

- lista fechada;
- enum;
- mapeamento explícito;
- SQL predefinido;
- validação rigorosa.

Nunca permita que o usuário forneça livremente um nome de coluna concatenado ao SQL.

---

### Indices dos parametros

Os parâmetros JDBC começam em:

```text
1.
```

Não em zero.

Exemplo:

```java
statement.setBoolean(1, true);
statement.setString(2, "%Final%");
```

O primeiro `?` recebe índice 1.

O segundo recebe índice 2.

Erro comum:

```java
statement.setString(0, valor);
```

Isso gera `SQLException`.

---

### Setters tipados

Use o setter correspondente ao tipo esperado.

Exemplos:

```java
setString;

setLong;

setInt;

setBoolean;

setBigDecimal;

setDate;

setTimestamp;

setObject.
```

O setter comunica intenção ao driver.

Evite converter tudo para string.

A coluna:

```text
cliente.id
```

é `bigint`.

O parâmetro Java adequado é:

```java
setLong.
```

---

### setObject

`setObject` é útil quando:

- o tipo Java é conhecido pelo driver;
- existe valor opcional;
- tipos modernos precisam de conversão;
- a API é genérica.

Entretanto, no começo, prefira setters explícitos para tornar o contrato visível.

---

### SQL NULL em parametros

Para enviar `NULL`, use:

```java
statement.setNull(
        indice,
        Types.VARCHAR
);
```

ou `setObject` com tipo adequado.

Não use:

```java
setString(indice, null)
```

como regra genérica sem compreender o comportamento do driver.

Nesta aula, os filtros obrigatórios não aceitam `null`.

---

### executeQuery

Para uma consulta que retorna linhas:

```java
ResultSet resultSet =
        statement.executeQuery();
```

Use `executeQuery` para `SELECT`.

Outros métodos:

```text
executeUpdate:
DML e alguns DDLs.

execute:
resultado genérico.
```

Nesta aula, apenas `executeQuery` será usado.

---

### Ciclo de recursos

A ordem de criação será:

```text
Connection;

PreparedStatement;

ResultSet.
```

A ordem de fechamento será inversa:

```text
ResultSet;

PreparedStatement;

Connection.
```

Use:

```java
try (
    Connection connection = provider.open();
    PreparedStatement statement =
            connection.prepareStatement(sql)
) {
    ...
}
```

E, dentro:

```java
try (
    ResultSet resultSet =
            statement.executeQuery()
) {
    ...
}
```

Também é possível declarar os três no mesmo `try`.

A separação em blocos deixa visível que o parâmetro é configurado antes da execução.

---

### ResultSet como cursor

O cursor começa antes da primeira linha.

Por isso, é necessário chamar:

```java
resultSet.next()
```

Se retornar:

```text
true:
há linha atual.

false:
não há mais linhas.
```

A aula 314 aprofundará essa mecânica.

---

### Consulta exata

Para código:

```sql
WHERE codigo = ?
```

o parâmetro é o texto exato.

Não adicione aspas manualmente:

```java
statement.setString(
        1,
        "'" + codigo + "'"
);
```

O driver cuida da representação.

---

### LIKE parametrizado

Para busca por trecho:

```sql
WHERE nome ILIKE ?
```

o valor pode ser:

```java
"%" + termo + "%"
```

A concatenação ocorre no valor Java, não na estrutura SQL.

Isso não é SQL Injection.

O SQL continua fixo.

Entretanto, `%` e `_` possuem significado em `LIKE`.

Se o requisito for busca literal, será necessário escapar esses caracteres.

Nesta aula, o comportamento de padrão será aceito e documentado.

---

### ILIKE

PostgreSQL oferece:

```sql
ILIKE
```

para comparação sem diferenciar maiúsculas e minúsculas conforme regras do banco.

Essa operação é específica do PostgreSQL.

A camada de acesso deve documentar essa dependência.

---

### String vazia

Uma busca por:

```text
""
```

com padrão:

```text
%%
```

retornaria todas as linhas.

Por isso, o método rejeitará termo vazio.

Segurança não é apenas SQL Injection.

Também envolve contrato de entrada e limite de resultado.

---

### LIMIT parametrizado

PostgreSQL aceita parâmetro em:

```sql
LIMIT ?
```

O método de busca por nome receberá um limite controlado.

Validação:

```text
mínimo:
1.

máximo:
50.
```

O setter será:

```java
setInt.
```

---

### Ordenacao deterministica

A consulta de nome usará:

```sql
ORDER BY
    nome,
    id
```

O ID resolve empates.

Mesmo um resultado pequeno precisa de contrato de ordenação.

---

### SQL Injection de primeira ordem

O caso clássico ocorre quando a entrada altera imediatamente a instrução atual.

Exemplos:

```text
' OR '1'='1;

'; DROP TABLE ...;

comentários como --.
```

Prepared statements tratam esses textos como valores.

---

### SQL Injection de segunda ordem

Pode ocorrer quando um texto malicioso é armazenado corretamente como dado e, em outro momento, é concatenado em uma nova instrução.

Usar parâmetros apenas na entrada inicial não protege usos futuros inseguros.

A regra vale em toda execução SQL.

---

### Validacao nao substitui parametro

Validar formato de código é útil.

Exemplo:

```text
CLI-POF-ALFA.
```

Mas validação não substitui `PreparedStatement`.

As duas práticas possuem objetivos diferentes:

```text
validação:
contrato do domínio.

parametrização:
separação entre SQL e dado.
```

---

### PreparedStatement nao autoriza

Parametrização não substitui permissões.

Se a role possui `DROP`, uma instrução legítima pode apagar objetos.

Segurança completa envolve:

- menor privilégio;
- parametrização;
- validação;
- limites;
- observabilidade;
- tratamento de erros.

---

### PreparedStatement nao melhora qualquer performance automaticamente

O nome pode sugerir preparação completa no servidor em todas as execuções.

O comportamento real depende do driver, quantidade de execuções, configuração e protocolo.

O ganho obrigatório desta aula é:

```text
segurança;

clareza;

tipagem;

reutilização do SQL.
```

Não prometa ganho de performance sem medir.

---

### Log seguro

É útil registrar:

```text
nome da operação;

tempo;

quantidade de resultados;

SQLState em erro.
```

Evite registrar:

- senha;
- token;
- documento sensível;
- SQL completo com dados;
- entrada maliciosa sem sanitização em contexto público.

O laboratório exibirá o termo apenas porque usa dados didáticos controlados.

---

### Consulta estatica com filtro opcional

Evite montar SQL por concatenação:

```java
if (ativo != null) {
    sql += " AND ativo = " + ativo;
}
```

Uma alternativa didática:

```sql
WHERE (? IS NULL OR ativo = ?)
```

Mas isso pode afetar planos e precisa repetir parâmetro.

Outra alternativa:

- escolher entre dois SQLs predefinidos;
- usar um builder seguro;
- compor somente fragmentos internos fechados.

Nesta aula, os métodos usarão SQLs fixos e parâmetros obrigatórios.

---

### Erros de parametros

Possíveis falhas:

```text
índice inexistente;

tipo incompatível;

parâmetro não preenchido;

valor fora do domínio;

SQL inválido;

coluna inexistente.
```

A mensagem e SQLState ajudam no diagnóstico.

Não transforme toda `SQLException` em:

```text
Erro ao acessar banco.
```

Preserve a causa técnica em logs internos.

---

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-313-preparedstatement-sql-injection\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-313-preparedstatement-sql-injection\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-313-preparedstatement-sql-injection\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-313-preparedstatement-sql-injection\src\main\java\br\com\formacao\m13\aula313"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-313-preparedstatement-sql-injection\src\test\java\br\com\formacao\m13\aula313"

Set-Location `
  "labs\m13\aula-313-preparedstatement-sql-injection"
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
    <artifactId>aula-313-preparedstatement</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <name>
        Aula 313 - PreparedStatement e SQL Injection
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
                        br.com.formacao.m13.aula313.Main
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
JDBC_APPLICATION_NAME=aula-313-preparedstatement
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

---

### 5. Reutilizar as classes de conexao

Copie da aula 312, ajustando o package para:

```java
package br.com.formacao.m13.aula313;
```

Arquivos:

```text
DatabaseSettings.java;

ConnectionProvider.java;

DriverManagerConnectionProvider.java.
```

Não copie:

```text
ConnectionSnapshot;

ConnectionInspector;

DataSourceConnectionProvider.
```

O escopo agora é execução segura de consultas.

---

### 6. Criar ClienteResumo.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula313/ClienteResumo.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula313;

public record ClienteResumo(
        long id,
        String codigo,
        String nome,
        boolean ativo
) {

    public ClienteResumo {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException(
                    "codigo é obrigatório"
            );
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "nome é obrigatório"
            );
        }
    }
}
```

Este record é um resultado mínimo.

O mapeamento aprofundado será feito na aula 315.

---

### 7. Criar ClienteSearch.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula313/ClienteSearch.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula313;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public final class ClienteSearch {

    private static final String FIND_BY_CODE = """
            SELECT
                id,
                codigo,
                nome,
                ativo
            FROM projeto_os_final.cliente
            WHERE codigo = ?
            """;

    private static final String FIND_ACTIVE_BY_NAME = """
            SELECT
                id,
                codigo,
                nome,
                ativo
            FROM projeto_os_final.cliente
            WHERE ativo = ?
              AND nome ILIKE ?
            ORDER BY
                nome,
                id
            LIMIT ?
            """;

    private static final String COUNT_ORDERS = """
            SELECT count(*) AS quantidade
            FROM projeto_os_final.ordem_servico
            WHERE cliente_id = ?
            """;

    private final ConnectionProvider connectionProvider;

    public ClienteSearch(
            ConnectionProvider connectionProvider
    ) {
        this.connectionProvider =
                Objects.requireNonNull(
                        connectionProvider,
                        "connectionProvider é obrigatório"
                );
    }

    public Optional<ClienteResumo> findByCode(
            String code
    ) throws SQLException {
        String normalizedCode =
                requireText(code, "code");

        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            FIND_BY_CODE
                    )
        ) {
            statement.setString(
                    1,
                    normalizedCode
            );

            try (
                ResultSet resultSet =
                        statement.executeQuery()
            ) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }

                ClienteResumo cliente =
                        readCliente(resultSet);

                if (resultSet.next()) {
                    throw new IllegalStateException(
                            "Código retornou mais de "
                                    + "um Cliente"
                    );
                }

                return Optional.of(cliente);
            }
        }
    }

    public List<ClienteResumo> findActiveByName(
            String nameFragment,
            int limit
    ) throws SQLException {
        String normalizedName =
                requireText(
                        nameFragment,
                        "nameFragment"
                );

        if (limit < 1 || limit > 50) {
            throw new IllegalArgumentException(
                    "limit deve estar entre 1 e 50"
            );
        }

        String pattern =
                "%" + normalizedName + "%";

        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            FIND_ACTIVE_BY_NAME
                    )
        ) {
            statement.setBoolean(
                    1,
                    true
            );
            statement.setString(
                    2,
                    pattern
            );
            statement.setInt(
                    3,
                    limit
            );

            List<ClienteResumo> clientes =
                    new ArrayList<>();

            try (
                ResultSet resultSet =
                        statement.executeQuery()
            ) {
                while (resultSet.next()) {
                    clientes.add(
                            readCliente(resultSet)
                    );
                }
            }

            return List.copyOf(clientes);
        }
    }

    public long countOrdersByClientId(
            long clientId
    ) throws SQLException {
        if (clientId <= 0) {
            throw new IllegalArgumentException(
                    "clientId deve ser positivo"
            );
        }

        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            COUNT_ORDERS
                    )
        ) {
            statement.setLong(
                    1,
                    clientId
            );

            try (
                ResultSet resultSet =
                        statement.executeQuery()
            ) {
                if (!resultSet.next()) {
                    throw new IllegalStateException(
                            "COUNT não retornou linha"
                    );
                }

                long count =
                        resultSet.getLong(
                                "quantidade"
                        );

                if (resultSet.next()) {
                    throw new IllegalStateException(
                            "COUNT retornou mais "
                                    + "de uma linha"
                    );
                }

                return count;
            }
        }
    }

    private static ClienteResumo readCliente(
            ResultSet resultSet
    ) throws SQLException {
        return new ClienteResumo(
                resultSet.getLong("id"),
                resultSet.getString("codigo"),
                resultSet.getString("nome"),
                resultSet.getBoolean("ativo")
        );
    }

    private static String requireText(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " é obrigatório"
            );
        }

        return value.trim();
    }
}
```

O SQL permanece constante.

Somente valores variam.

---

### 8. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula313/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula313;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public final class Main {

    private static final String SAFE_CODE =
            "CLI-POF-ALFA";

    private static final String MALICIOUS_CODE =
            "CLI-POF-ALFA' OR '1'='1";

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

            ClienteSearch search =
                    new ClienteSearch(provider);

            Optional<ClienteResumo> exact =
                    search.findByCode(
                            SAFE_CODE
                    );

            System.out.println(
                    "=== Busca exata ==="
            );
            System.out.printf(
                    "encontrado: %s%n",
                    exact.isPresent()
            );

            exact.ifPresent(cliente ->
                    System.out.printf(
                            "%d | %s | %s | ativo=%s%n",
                            cliente.id(),
                            cliente.codigo(),
                            cliente.nome(),
                            cliente.ativo()
                    )
            );

            List<ClienteResumo> byName =
                    search.findActiveByName(
                            "Final",
                            10
                    );

            System.out.println();
            System.out.println(
                    "=== Busca por nome ==="
            );
            System.out.printf(
                    "quantidade: %d%n",
                    byName.size()
            );

            byName.forEach(cliente ->
                    System.out.printf(
                            "%d | %s | %s%n",
                            cliente.id(),
                            cliente.codigo(),
                            cliente.nome()
                    )
            );

            long orderCount =
                    exact.map(
                            ClienteResumo::id
                    )
                    .map(id -> {
                        try {
                            return search
                                    .countOrdersByClientId(
                                            id
                                    );
                        } catch (SQLException exception) {
                            throw new QueryRuntimeException(
                                    exception
                            );
                        }
                    })
                    .orElse(0L);

            System.out.println();
            System.out.println(
                    "=== Ordens do Cliente ==="
            );
            System.out.printf(
                    "quantidade: %d%n",
                    orderCount
            );

            Optional<ClienteResumo> malicious =
                    search.findByCode(
                            MALICIOUS_CODE
                    );

            System.out.println();
            System.out.println(
                    "=== Tentativa maliciosa ==="
            );
            System.out.printf(
                    "entrada tratada como dado: %s%n",
                    malicious.isEmpty()
            );
            System.out.printf(
                    "quantidade retornada: %d%n",
                    malicious.stream().count()
            );
        } catch (QueryRuntimeException exception) {
            handleSqlException(
                    exception.getSqlException()
            );
        } catch (SQLException exception) {
            handleSqlException(exception);
        } catch (RuntimeException exception) {
            System.err.println(
                    "Falha de configuração ou contrato: "
                            + exception.getMessage()
            );
            System.exit(1);
        }
    }

    private static void handleSqlException(
            SQLException exception
    ) {
        System.err.println(
                "Falha JDBC ao executar consulta."
        );
        System.err.println(
                "SQLState: "
                        + exception.getSQLState()
        );
        System.err.println(
                "Código: "
                        + exception.getErrorCode()
        );
        System.err.println(
                "Mensagem: "
                        + exception.getMessage()
        );
        System.exit(2);
    }

    private static final class QueryRuntimeException
            extends RuntimeException {

        private final SQLException sqlException;

        private QueryRuntimeException(
                SQLException sqlException
        ) {
            super(sqlException);
            this.sqlException = sqlException;
        }

        private SQLException getSqlException() {
            return sqlException;
        }
    }
}
```

O wrapper interno existe apenas porque `Optional.map` não aceita checked exception.

No exercício, você poderá simplificar o fluxo sem usar `Optional.map`.

---

### 9. Criar DatabaseSettingsTest.java

Reutilize os testes de configuração da aula 312.

Ajuste:

```java
package br.com.formacao.m13.aula313;
```

Valide:

- URL PostgreSQL;
- senha não exposta;
- timeouts;
- schema;
- propriedades de conexão.

---

### 10. Criar ClienteSearchIT.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula313/ClienteSearchIT.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula313;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ClienteSearchIT {

    private static ClienteSearch search;

    @BeforeAll
    static void setUp() {
        DatabaseSettings settings =
                DatabaseSettings.fromEnvironment();

        search = new ClienteSearch(
                new DriverManagerConnectionProvider(
                        settings
                )
        );
    }

    @Test
    void shouldFindClientByExactCode()
            throws Exception {
        Optional<ClienteResumo> result =
                search.findByCode(
                        "CLI-POF-ALFA"
                );

        assertTrue(result.isPresent());
        assertEquals(
                307001L,
                result.orElseThrow().id()
        );
    }

    @Test
    void shouldTreatInjectionAttemptAsData()
            throws Exception {
        Optional<ClienteResumo> result =
                search.findByCode(
                        "CLI-POF-ALFA' OR '1'='1"
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldFindActiveClientsByName()
            throws Exception {
        List<ClienteResumo> result =
                search.findActiveByName(
                        "Final",
                        10
                );

        assertEquals(
                3,
                result.size()
        );
        assertTrue(
                result.stream()
                        .allMatch(
                                ClienteResumo::ativo
                        )
        );
    }

    @Test
    void shouldCountOrdersByClient()
            throws Exception {
        long count =
                search.countOrdersByClientId(
                        307001L
                );

        assertEquals(2L, count);
    }

    @Test
    void shouldRejectEmptyName() {
        assertThrows(
                IllegalArgumentException.class,
                () -> search.findActiveByName(
                        " ",
                        10
                )
        );
    }

    @Test
    void shouldRejectInvalidLimit() {
        assertThrows(
                IllegalArgumentException.class,
                () -> search.findActiveByName(
                        "Final",
                        0
                )
        );
    }

    @Test
    void shouldNotFindUnknownCode()
            throws Exception {
        Optional<ClienteResumo> result =
                search.findByCode(
                        "CLI-INEXISTENTE"
                );

        assertFalse(result.isPresent());
    }
}
```

A tentativa maliciosa não altera o SQL.

---

### 11. Criar scripts/01_verificar_pre_requisitos.ps1

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

$estado = docker exec formacao-postgres-m12 `
    psql `
    -X `
    -tA `
    -U formacao `
    -d formacao_java `
    -c (
        "SELECT " +
        "to_regclass(" +
        "'projeto_os_final.cliente'" +
        ") IS NOT NULL " +
        "AND " +
        "(SELECT count(*) " +
        "FROM projeto_os_final.cliente) = 4;"
    )

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao validar o banco."
}

if ($estado.Trim() -ne "t") {
    throw "Seed de Cliente inválido."
}

Write-Host "Pré-requisitos validados."
```

---

### 12. Criar scripts/02_executar_consultas.ps1

Use o mesmo carregamento seguro do arquivo de ambiente da aula 312.

Depois execute:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

Falhe imediatamente quando `$LASTEXITCODE` for diferente de zero.

No `finally`, remova do processo:

```text
JDBC_URL;

JDBC_USER;

JDBC_PASSWORD;

JDBC_SCHEMA;

JDBC_APPLICATION_NAME;

JDBC_LOGIN_TIMEOUT_SECONDS;

JDBC_CONNECT_TIMEOUT_SECONDS;

JDBC_SOCKET_TIMEOUT_SECONDS.
```

---

### 13. Criar scripts/03_validar_ausencia_concatenacao.ps1

Crie:

```text
scripts/03_validar_ausencia_concatenacao.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$files = Get-ChildItem `
    -Path ".\src\main\java" `
    -Recurse `
    -Filter "*.java"

$forbidden = $files |
    Select-String `
        -Pattern (
            "WHERE.*\+|"
            + "SELECT.*\+|"
            + "FROM.*\+|"
            + "ORDER BY.*\+"
        )

if ($forbidden) {
    $forbidden | ForEach-Object {
        Write-Host $_
    }

    throw (
        "Possível concatenação estrutural "
        + "de SQL encontrada."
    )
}

$prepared = $files |
    Select-String `
        -Pattern "prepareStatement"

if (-not $prepared) {
    throw "Nenhum PreparedStatement encontrado."
}

$statement = $files |
    Select-String `
        -Pattern "createStatement"

if ($statement) {
    throw "Statement simples fora do escopo."
}

Write-Host "Validação estática concluída."
```

Esse script é um apoio didático.

Ele não substitui revisão de código nem ferramenta especializada.

---

### 14. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_consultas.ps1
.\scripts\03_validar_ausencia_concatenacao.ps1
```

Saída esperada:

```text
Busca exata:
encontrado true.

Busca por nome:
3.

Ordens:
2.

Tentativa maliciosa:
entrada tratada como dado true;
quantidade 0.
```

---

### 15. Demonstrar a consulta vulneravel sem executar

Em:

```text
docs/roteiro-sql-injection.md
```

escreva o exemplo vulnerável.

Mostre a transformação textual com:

```text
entrada normal;

entrada maliciosa;

SQL resultante.
```

Não crie um método que execute a consulta vulnerável.

A demonstração textual é suficiente.

O objetivo é aprender sem introduzir uma função insegura reutilizável.

---

### 16. Criar contrato-consultas.md

Em:

```text
docs/contrato-consultas.md
```

documente:

#### findByCode

```text
entrada:
código obrigatório.

granularidade:
zero ou um Cliente.

ordenação:
não necessária por unique.

retorno:
Optional.

segurança:
setString.

SQL:
fixo.
```

#### findActiveByName

```text
entrada:
trecho obrigatório.

limite:
1 a 50.

granularidade:
uma linha por Cliente.

ordenação:
nome e ID.

retorno:
lista imutável.

segurança:
setBoolean, setString, setInt.
```

#### countOrdersByClientId

```text
entrada:
ID positivo.

retorno:
long.

granularidade:
uma linha agregada.

segurança:
setLong.
```

---

### 17. Criar preparedstatement-vs-concatenacao.md

Em:

```text
docs/preparedstatement-vs-concatenacao.md
```

crie a tabela:

```text
Critério | Concatenação | PreparedStatement
```

Inclua:

- separação SQL/dado;
- aspas;
- tipos;
- SQL Injection;
- legibilidade;
- reutilização;
- logs;
- manutenção;
- identificadores dinâmicos;
- desempenho.

Conclusão:

```text
valores sempre devem ser parametrizados;

estruturas dinâmicas exigem lista fechada ou SQL predefinido.
```

---

### 18. Criar troubleshooting-preparedstatement.md

Em:

```text
docs/troubleshooting-preparedstatement.md
```

registre:

#### The column index is out of range

Causa:

- índice zero;
- índice maior que quantidade de placeholders;
- SQL alterado sem atualizar setters.

#### No value specified for parameter

Causa:

- algum `?` não recebeu valor.

#### Bad value for type

Causa:

- setter ou conteúdo incompatível com coluna.

#### Relation does not exist

Verifique:

- schema;
- nome qualificado;
- database;
- migration.

#### Resultado vazio

Verifique:

- valor exato;
- espaços;
- caixa;
- wildcard;
- filtro `ativo`;
- seed.

#### Todos os registros aparecem

Investigue:

- concatenação vulnerável;
- termo vazio com `%%`;
- filtro opcional mal formulado.

---

## Entendendo o que foi feito

### O SQL ficou constante

Os métodos usam text blocks fixos.

Entradas são associadas depois.

---

### Cada parametro recebeu tipo

Código usou `setString`.

Ativo usou `setBoolean`.

Limite usou `setInt`.

ID usou `setLong`.

---

### A tentativa maliciosa virou dado

O driver procurou um código literal contendo aspas e operadores.

Nenhum registro foi encontrado.

---

### Os recursos foram fechados

Cada método fecha:

```text
ResultSet;

PreparedStatement;

Connection.
```

---

### O contrato limitou abuso

Termo vazio e limites inválidos foram rejeitados antes do banco.

Parametrização e validação atuaram juntas.

---

## Erros comuns importantes

### Colocar aspas no parametro

Errado:

```java
setString(1, "'" + codigo + "'");
```

Use o valor puro.

### Comecar no indice zero

Parâmetros começam em 1.

### Parametrizar nome de coluna

Placeholder representa valor, não estrutura.

### Usar Statement com entrada externa

Prefira `PreparedStatement`.

### Achar que validacao substitui parametrizacao

Use as duas práticas.

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

### Aplicacao

```powershell
mvn exec:java
```

### Busca manual equivalente

```sql
SELECT
    id,
    codigo,
    nome,
    ativo
FROM projeto_os_final.cliente
WHERE codigo = 'CLI-POF-ALFA';
```

---

## Exercicio guiado

### Parte 1 — Buscar por ID

Crie:

```java
Optional<ClienteResumo> findById(long id)
```

Use:

```sql
WHERE id = ?
```

Rejeite ID menor ou igual a zero.

Use `setLong`.

---

### Parte 2 — Buscar por status de Ordem

Crie método que retorne a quantidade de Ordens por status.

Aceite apenas:

```text
ABERTA;

AGENDADA;

EM_ATENDIMENTO;

CONCLUIDA;

CANCELADA.
```

Use enum Java e `setString`.

Não concatene o status.

---

### Parte 3 — Testar mais entradas maliciosas

Teste:

```text
' OR TRUE --;

'; DROP TABLE projeto_os_final.cliente; --;

CLI-POF-ALFA' UNION SELECT ...
```

Todos devem retornar zero na busca por código.

A tabela deve continuar com quatro Clientes.

---

### Parte 4 — Wildcards de LIKE

Teste termos:

```text
Final;

%;

_.
```

Explique por que `%` e `_` alteram o padrão do `ILIKE`.

Implemente uma variante de busca literal que escape os caracteres e use:

```sql
ESCAPE '\'
```

Documente o contrato.

---

### Parte 5 — Ordenacao dinamica segura

Permita ordenar Clientes por:

```text
NOME;

CODIGO.
```

Crie enum:

```java
ClienteSort
```

Mapeie internamente para dois SQLs fixos.

Não aceite texto de coluna livre.

---

### Parte 6 — Limite

Teste:

```text
0;

1;

50;

51.
```

Confirme que somente 1 a 50 são aceitos.

---

### Parte 7 — Fechamento em falha

Provoque um SQL inválido em uma cópia temporária do método.

Confirme:

- `SQLException`;
- SQLState presente quando aplicável;
- conexão fechada;
- statement fechado;
- cópia restaurada.

Não faça commit do SQL inválido.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade;
- o laboratório oficial da aula 313 existe;
- continuidade com a aula 312 foi preservada;
- Maven usa Java 21;
- driver PostgreSQL permanece fixado;
- configuração real está fora do Git;
- `ConnectionProvider` foi reutilizado;
- `PreparedStatement` foi utilizado;
- nenhum `Statement` simples foi criado;
- SQL foi definido em text blocks fixos;
- código exato usa placeholder;
- busca por nome usa placeholders;
- limite usa placeholder;
- ID usa placeholder;
- índices de parâmetro começam em 1;
- `setString` foi utilizado;
- `setBoolean` foi utilizado;
- `setInt` foi utilizado;
- `setLong` foi utilizado;
- `executeQuery` foi utilizado;
- `ResultSet.next` foi utilizado de forma introdutória;
- busca exata retornou o Cliente esperado;
- busca por nome retornou três Clientes;
- contagem de Ordens retornou dois;
- entrada maliciosa retornou zero;
- SQL vulnerável foi demonstrado apenas em documentação;
- nenhum método vulnerável foi executado;
- termo vazio foi rejeitado;
- limite inválido foi rejeitado;
- lista retornada é imutável;
- `Optional` foi usado para zero ou uma linha;
- recursos foram fechados com try-with-resources;
- testes de integração foram criados;
- validação estática de concatenação foi criada;
- prepared statement não foi tratado como autorização;
- identificadores dinâmicos não foram parametrizados incorretamente;
- DML não foi antecipado;
- transação manual não foi antecipada;
- leitura aprofundada de ResultSet ficou para a aula 314;
- schema `projeto_os_final` permaneceu intacto;
- commit recomendado pode ser realizado;
- diário de bordo está pronto;
- ponte para a aula 314 está correta.

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
  labs/m13/aula-313-preparedstatement-sql-injection
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): executar consultas seguras com preparedstatement"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
PreparedStatement;

parâmetros tipados;

SQL Injection;

consultas seguras;

fechamento de recursos.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você executou as primeiras consultas SQL pelo Java.

Aprendeu:

```text
concatenação mistura SQL e entrada;

PreparedStatement separa estrutura e dado;

? representa valor;

parâmetros começam em 1;

setters comunicam tipos;

executeQuery retorna ResultSet;

next move o cursor;

LIKE pode receber padrão parametrizado;

validação não substitui parametrização;

PreparedStatement não substitui menor privilégio;

identificadores dinâmicos exigem lista fechada.
```

O laboratório comprovou:

```text
Cliente encontrado por código;

Clientes encontrados por nome;

Ordens contadas por ID;

entrada maliciosa tratada como dado;

nenhuma tabela alterada;

recursos fechados.
```

A próxima aula será:

```text
314 - M13.04 - ResultSet e leitura de dados
```

Nela, você vai estudar:

- posição inicial do cursor;
- `next`;
- getters tipados;
- acesso por label e por índice;
- aliases;
- leitura de `String`, `long`, `boolean`, `BigDecimal`, `LocalDate` e timestamps;
- diferença entre SQL `NULL` e valores default dos getters;
- `wasNull`;
- ordem das colunas;
- múltiplas linhas;
- metadata do resultado;
- fechamento do cursor;
- tratamento de tipos e conversões.

O objetivo será transformar resultados JDBC em dados Java com precisão.

---

# Material complementar

## Checkpoint final

- [ ] Usei SQL fixo com placeholders.
- [ ] Associei parâmetros com setters tipados.
- [ ] Bloqueei a tentativa de SQL Injection.
- [ ] Fechei Connection, PreparedStatement e ResultSet.
- [ ] Mantive DML e mapeamento completo fora da aula.

---

## Troubleshooting adicional

### Parameter index out of range

Conte os `?` e revise os índices.

O primeiro é 1.

### ResultSet is closed

O cursor foi usado depois do fechamento do bloco.

Consuma dentro do `try`.

### PreparedStatement is closed

O statement saiu do escopo ou foi fechado antes da execução.

### Consulta retorna todos com termo vazio

Rejeite entrada vazia.

Não permita `%%` sem intenção.

### SQLState 42P01

Relação não existe.

Confirme database, schema e nome da tabela.

---

## Perguntas de revisao

1. O que é `PreparedStatement`?
2. Qual problema ele ajuda a prevenir?
3. O que representa `?`?
4. O placeholder substitui tabela?
5. Qual é o primeiro índice de parâmetro?
6. Quando usar `setString`?
7. Quando usar `setLong`?
8. Para que serve `executeQuery`?
9. Onde o cursor começa?
10. O que `next` retorna?
11. Por que não adicionar aspas ao valor?
12. Como parametrizar `LIKE`?
13. `%` é literal em `LIKE`?
14. Validação substitui parametrização?
15. PreparedStatement substitui grants?
16. A entrada maliciosa alterou o SQL?
17. Por que limitar resultados?
18. Qual a ordem de fechamento?
19. DML foi executado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Instrução SQL parametrizada.
2. SQL Injection.
3. Um valor.
4. Não.
5. 1.
6. Para valores textuais.
7. Para `bigint`.
8. Executar consulta que retorna linhas.
9. Antes da primeira linha.
10. Se existe uma próxima linha.
11. O driver cuida da representação.
12. Passando o padrão como valor.
13. Não; é wildcard.
14. Não.
15. Não.
16. Não.
17. Evitar abuso e resultados excessivos.
18. ResultSet, PreparedStatement, Connection.
19. Não.
20. ResultSet e leitura de dados.

---

## Desafio opcional

Crie:

```java
SqlParameterAudit
```

Ele não deve guardar valores.

Registre somente:

```text
nome da operação;

quantidade de parâmetros;

tipos Java;

tempo;

quantidade de linhas;

sucesso ou falha;

SQLState.
```

Exemplo:

```text
operacao=findByCode;
parametros=1;
tipos=String;
linhas=1;
sucesso=true.
```

Não registre:

- código pesquisado;
- nome;
- senha;
- SQL com valores.

Use o auditor nos três métodos e crie testes unitários.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 313 - M13.03 - PreparedStatement e SQL Injection

- Executei minhas primeiras consultas SQL pelo Java.
- Entendi o risco de concatenar entrada em SQL.
- Diferenciei estrutura SQL de valores.
- Usei placeholders `?`.
- Aprendi que índices de parâmetros começam em 1.
- Usei `setString`, `setBoolean`, `setInt` e `setLong`.
- Executei consultas com `executeQuery`.
- Usei `ResultSet.next` de forma introdutória.
- Busquei Cliente por código exato.
- Busquei Clientes ativos por trecho do nome.
- Contei Ordens por Cliente.
- Testei uma entrada de SQL Injection.
- Confirmei que a entrada maliciosa foi tratada como dado.
- Mantive o SQL fixo em text blocks.
- Rejeitei termo vazio e limite inválido.
- Entendi que placeholders não substituem identificadores.
- Entendi que PreparedStatement não substitui menor privilégio.
- Fechei Connection, PreparedStatement e ResultSet.
- Criei testes de integração.
- Documentei a diferença entre concatenação e parametrização.
- Preservei o schema `projeto_os_final`.
- Próxima aula: ResultSet e leitura de dados.
```

---

## Referencia tecnica curta

```text
PreparedStatement:
SQL parametrizado.

?:
placeholder de valor.

setString:
texto.

setLong:
bigint.

setBoolean:
boolean.

setInt:
integer.

executeQuery:
consulta com resultado.

ResultSet:
cursor de linhas.

SQL Injection:
entrada alterando estrutura SQL.

Regra:
SQL fixo, dados parametrizados.
```

Regra final:

```text
todo valor externo deve permanecer como dado, nunca como trecho de SQL; use PreparedStatement, setters tipados, validacao de contrato e menor privilegio em conjunto.
```
