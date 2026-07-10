# 314 - M13.04 - ResultSet mapeamento manual e tipos

## Apresentacao da aula

Na aula 313, executou as primeiras consultas SQL pelo Java usando `PreparedStatement`.

O laboratório comprovou:

```text
a conexão JDBC funciona;

o SQL permanece fixo;

valores externos usam placeholders;

parâmetros começam no índice 1;

entradas maliciosas permanecem como dados;

Connection, PreparedStatement e ResultSet são fechados.
```

`ResultSet` apareceu de forma introdutória.

Você utilizou:

```java
resultSet.next();
resultSet.getLong(...);
resultSet.getString(...);
resultSet.getBoolean(...);
```

Agora será o centro da aula.

Um `ResultSet` representa o conjunto de linhas retornado por uma instrução JDBC. Ele mantém um cursor que começa antes da primeira linha e precisa avançar por meio de `next()`.

Ler um resultado corretamente exige compreender:

- posição do cursor;
- ordem das linhas;
- labels e índices;
- getters tipados;
- tipos SQL e tipos Java;
- aliases;
- valores obrigatórios;
- valores nulos;
- `wasNull()`;
- datas;
- timestamps;
- precisão monetária;
- metadados das colunas;
- mapeamento manual;
- fechamento do recurso.

A grade combina `ResultSet`, mapeamento manual e tipos. Por isso, o laboratório não ficará limitado a imprimir colunas.

Você criará registros Java que representam linhas lidas do banco:

```text
ClienteRow;

OrdemRow.
```

Também criará uma classe responsável por transformar a linha atual do `ResultSet` nesses records:

```text
ResultSetMapper.
```

O mapeamento será manual e explícito.

Exemplo:

```java
new ClienteRow(
        resultSet.getLong("cliente_id"),
        resultSet.getString("cliente_codigo"),
        resultSet.getString("cliente_nome"),
        ...
);
```

O mapeamento explícito revela o trabalho que abstrações futuras precisarão executar: percorrer linhas, converter tipos, tratar nulos, criar objetos e fechar recursos.

Você utilizará tipos Java adequados:

```text
PostgreSQL bigint:
long ou Long.

text:
String.

boolean:
boolean.

numeric:
BigDecimal.

date:
LocalDate.

timestamptz:
OffsetDateTime.

jsonb convertido para text:
String.
```

Para colunas obrigatórias, tipos primitivos são adequados quando o contrato garante `NOT NULL`.

Para colunas opcionais, será necessário preservar a ausência.

Exemplos:

```text
email:
String nula.

data_agendada:
LocalDate nula.

concluida_em:
OffsetDateTime nulo.

primeiro_pagamento_id:
Long nulo.
```

O caso `primeiro_pagamento_id` será usado para demonstrar `wasNull()`.

O método:

```java
resultSet.getLong(...)
```

retorna `0` quando a coluna SQL contém `NULL`.

Esse zero sozinho não permite saber se:

- o banco retornou zero;
- o banco retornou `NULL`.

Logo depois do getter, você consultará:

```java
resultSet.wasNull()
```

A próxima aula será:

```text
315 - M13.05 - DAO inicial com responsabilidade clara
```

Nela, o código de consulta e mapeamento será organizado dentro de um DAO inicial, separando responsabilidade de persistência do restante da aplicação.

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
ResultSet, mapeamento manual e tipos.

315:
DAO inicial com responsabilidade clara.
```

Na aula 313, a pergunta principal foi:

```text
como enviar dados ao SQL sem alterar a estrutura da instrução?
```

Na aula 314, a pergunta é:

```text
como transformar linhas SQL em dados Java sem perder tipo, nulabilidade e significado?
```

Nesta aula:

```text
SELECT:
sim.

PreparedStatement:
sim.

ResultSet:
aprofundado.

mapeamento manual:
sim.

tipos de data modernos:
sim.

SQL NULL:
sim.

ResultSetMetaData:
sim.

DAO:
não.

INSERT, UPDATE e DELETE:
não.

JPA e Hibernate:
não.
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-314-resultset-mapeamento-manual-tipos
```

Estrutura final:

```text
labs
└── m13
    └── aula-314-resultset-mapeamento-manual-tipos
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-mapeamento.md
        │   ├── matriz-tipos-jdbc.md
        │   ├── resultset-cursor-e-null.md
        │   └── troubleshooting-resultset.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_leitura.ps1
        │   └── 03_validar_escopo.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula314
            │                           ├── ClienteRow.java
            │                           ├── ConnectionProvider.java
            │                           ├── DatabaseSettings.java
            │                           ├── DriverManagerConnectionProvider.java
            │                           ├── Main.java
            │                           ├── OrdemRow.java
            │                           ├── ResultColumn.java
            │                           ├── ResultSetLab.java
            │                           ├── ResultSetMapper.java
            │                           └── ResultSetMetadataInspector.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula314
                                        ├── DatabaseSettingsTest.java
                                        └── ResultSetLabIT.java
```

Resultados esperados:

```text
Clientes lidos:
4.

Ordens lidas:
6.

Cliente Alfa:
email preenchido.

Cliente Gama:
email nulo.

Ordem 307301:
data agendada preenchida;
conclusão preenchida;
primeiro Pagamento 307501.

Ordem 307303:
data agendada nula;
conclusão nula;
primeiro Pagamento 307505.

Ordem 307304:
primeiro Pagamento nulo.

metadados da consulta de Ordem:
13 colunas.
```

---

## Conceito essencial

### ResultSet e um cursor

O `ResultSet` não posiciona automaticamente a aplicação na primeira linha.

Estado inicial:

```text
antes da primeira linha.
```

Para avançar:

```java
boolean hasRow = resultSet.next();
```

Quando `next()` retorna `true`, a linha atual pode ser lida.

Quando retorna `false`, não existem mais linhas.

Padrão para várias linhas:

```java
while (resultSet.next()) {
    // ler linha atual
}
```

Padrão para zero ou uma linha:

```java
if (!resultSet.next()) {
    return Optional.empty();
}

var value = map(resultSet);

if (resultSet.next()) {
    throw new IllegalStateException(
            "Mais de uma linha"
    );
}
```

O cursor é mutável.

Cada chamada a `next()` muda sua posição.

---

### ResultSet e conectado

O cursor depende do statement e da conexão que o produziram. Não retorne um `ResultSet` aberto para outra camada: faça o mapeamento dentro do escopo JDBC e devolva objetos Java independentes.

### Leitura por indice

`getLong(1)` e `getString(2)` dependem da ordem do `SELECT`. Índices também começam em 1. A técnica é válida em código muito controlado, mas mudanças de posição podem quebrar o mapper silenciosamente.

### Leitura por label

`getLong("cliente_id")` expressa significado, combina com aliases e resiste melhor a mudanças na ordem das colunas. O laboratório usará labels; posições serão praticadas apenas no exercício.

### Alias como contrato

Consulta:

```sql
SELECT
    cliente.id AS cliente_id,
    cliente.codigo AS cliente_codigo
```

Mapeamento:

```java
resultSet.getLong("cliente_id");
resultSet.getString("cliente_codigo");
```

O alias cria um contrato claro entre SQL e Java.

Ele é especialmente importante quando:

- duas tabelas possuem `id`;
- duas tabelas possuem `nome`;
- uma expressão não possui nome simples;
- uma coluna precisa de nome estável;
- a consulta usa agregação.

Prefira labels únicos.

---

### getColumnLabel e getColumnName

`ResultSetMetaData` diferencia:

```text
getColumnLabel:
alias usado pelo resultado.

getColumnName:
nome físico da coluna quando disponível.
```

Quando existe:

```sql
cliente.id AS cliente_id
```

o label esperado é:

```text
cliente_id.
```

O nome físico pode continuar:

```text
id.
```

O mapper deve depender do label documentado.

---

### Getters tipados

Use o getter correspondente ao contrato SQL:

```java
getLong;
getInt;
getBoolean;
getString;
getBigDecimal;
getObject(label, LocalDate.class);
getObject(label, OffsetDateTime.class);
```

Ler dinheiro ou datas como `String` elimina tipagem e transfere conversões para outra etapa.

### BigDecimal para numeric

`numeric(12, 2)` deve ser lido como `BigDecimal`, preservando precisão decimal. Em testes, `compareTo` compara o valor numérico sem transformar dinheiro em `double`.

### LocalDate para date

PostgreSQL `date` representa dia sem horário ou fuso. Leia com:

```java
resultSet.getObject(
        "data_agendada",
        LocalDate.class
);
```

`LocalDate` comunica melhor o domínio que `java.sql.Date`.

### OffsetDateTime para timestamptz

Para `timestamp with time zone`, o pgJDBC suporta leitura JDBC 4.2 como `OffsetDateTime`. PostgreSQL preserva o instante, não o offset textual original; por isso, testes podem comparar `toInstant()`.

### String e SQL NULL

`getString` devolve `null` para SQL `NULL`. Isso é diferente de `""`, que representa texto presente e vazio.

### Primitivos e SQL NULL

Getters primitivos não devolvem `null`. `getLong` retorna zero para SQL `NULL`; chame `wasNull()` imediatamente para distinguir ausência de valor real.

### Tipos primitivos e wrappers

Use primitivos para colunas `NOT NULL` e wrappers para colunas opcionais: `long/Long`, `int/Integer` e `boolean/Boolean`. A escolha deve refletir a nulabilidade do contrato.

### getObject com Class

JDBC moderno permite `getObject(label, Classe.class)`. O driver lança `SQLException` quando a conversão solicitada não é suportada.

### JSONB no ResultSet

Para evitar dependência de uma classe específica do driver, o SQL converte `metadados::text AS metadados_json`. O Java lê `String`; desserialização ficará fora do escopo.

### ResultSetMetaData

`resultSet.getMetaData()` expõe quantidade, label, nome físico, tipo JDBC, tipo SQL, classe Java sugerida e nulabilidade. É útil para diagnóstico e ferramentas genéricas, mas não substitui o mapper explícito quando o contrato é conhecido.

### Ordem do SELECT

Mesmo com labels, liste colunas explicitamente. `SELECT *` cria contrato invisível, pode trazer dados extras e favorece colisões de nomes.

### Uma linha por objeto

Clientes e Ordens mantêm granularidade de uma linha por entidade. O primeiro Pagamento é obtido por `LEFT JOIN LATERAL ... LIMIT 1`, evitando multiplicação das Ordens.

### Colecoes retornadas

Os métodos usam `ArrayList` internamente e retornam `List.copyOf(rows)`. Records e listas ficam imutáveis e independentes da conexão.

### Excecoes de mapeamento

Labels ausentes, tipos incompatíveis, cursor fora de posição ou recurso fechado geram `SQLException`. A aula propaga a causa; o DAO da aula 315 definirá a fronteira de tratamento.

### Fechamento

`ResultSet` é `AutoCloseable`. No `try-with-resources`, o fechamento ocorre na ordem inversa: `ResultSet`, `PreparedStatement` e `Connection`. Não armazene nem use o cursor fora do bloco.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-314-resultset-mapeamento-manual-tipos\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-314-resultset-mapeamento-manual-tipos\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-314-resultset-mapeamento-manual-tipos\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-314-resultset-mapeamento-manual-tipos\src\main\java\br\com\formacao\m13\aula314"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-314-resultset-mapeamento-manual-tipos\src\test\java\br\com\formacao\m13\aula314"

Set-Location `
  "labs\m13\aula-314-resultset-mapeamento-manual-tipos"
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
    <artifactId>aula-314-resultset-mapeamento</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <name>
        Aula 314 - ResultSet mapeamento e tipos
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
                        br.com.formacao.m13.aula314.Main
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
JDBC_APPLICATION_NAME=aula-314-resultset
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

O arquivo real permanece fora do Git.

---

### 5. Reutilizar infraestrutura de conexao

Copie da aula 313 e altere o package para:

```java
package br.com.formacao.m13.aula314;
```

Arquivos:

```text
DatabaseSettings.java;

ConnectionProvider.java;

DriverManagerConnectionProvider.java.
```

Não adicione DAO ainda.

---

### 6. Criar ClienteRow.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/ClienteRow.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import java.time.OffsetDateTime;

public record ClienteRow(
        long id,
        String codigo,
        String nome,
        String documento,
        String email,
        boolean ativo,
        OffsetDateTime criadoEm,
        OffsetDateTime atualizadoEm
) {

    public ClienteRow {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        requireText(codigo, "codigo");
        requireText(nome, "nome");
        requireText(documento, "documento");

        if (criadoEm == null) {
            throw new IllegalArgumentException(
                    "criadoEm é obrigatório"
            );
        }

        if (atualizadoEm == null) {
            throw new IllegalArgumentException(
                    "atualizadoEm é obrigatório"
            );
        }
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
}
```

`email` pode ser nulo.

---

### 7. Criar OrdemRow.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/OrdemRow.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record OrdemRow(
        long id,
        String codigo,
        String clienteNome,
        String produtoNome,
        String status,
        String prioridade,
        LocalDate dataAgendada,
        OffsetDateTime abertaEm,
        OffsetDateTime concluidaEm,
        BigDecimal valorPrevisto,
        int versao,
        Long primeiroPagamentoId,
        String metadadosJson
) {

    public OrdemRow {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        requireText(codigo, "codigo");
        requireText(clienteNome, "clienteNome");
        requireText(produtoNome, "produtoNome");
        requireText(status, "status");
        requireText(prioridade, "prioridade");

        if (abertaEm == null) {
            throw new IllegalArgumentException(
                    "abertaEm é obrigatório"
            );
        }

        if (valorPrevisto == null) {
            throw new IllegalArgumentException(
                    "valorPrevisto é obrigatório"
            );
        }

        if (versao < 0) {
            throw new IllegalArgumentException(
                    "versao não pode ser negativa"
            );
        }

        requireText(
                metadadosJson,
                "metadadosJson"
        );
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
}
```

Campos opcionais:

```text
dataAgendada;

concluidaEm;

primeiroPagamentoId.
```

---

### 8. Criar ResultColumn.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/ResultColumn.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

public record ResultColumn(
        int position,
        String label,
        String columnName,
        int jdbcType,
        String sqlTypeName,
        String javaClassName,
        String nullability
) {

    public ResultColumn {
        if (position <= 0) {
            throw new IllegalArgumentException(
                    "position deve ser positiva"
            );
        }
    }
}
```

---

### 9. Criar ResultSetMapper.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/ResultSetMapper.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public final class ResultSetMapper {

    private ResultSetMapper() {
    }

    public static ClienteRow readCliente(
            ResultSet resultSet
    ) throws SQLException {
        return new ClienteRow(
                resultSet.getLong("cliente_id"),
                resultSet.getString(
                        "cliente_codigo"
                ),
                resultSet.getString(
                        "cliente_nome"
                ),
                resultSet.getString(
                        "cliente_documento"
                ),
                resultSet.getString(
                        "cliente_email"
                ),
                resultSet.getBoolean(
                        "cliente_ativo"
                ),
                resultSet.getObject(
                        "cliente_criado_em",
                        OffsetDateTime.class
                ),
                resultSet.getObject(
                        "cliente_atualizado_em",
                        OffsetDateTime.class
                )
        );
    }

    public static OrdemRow readOrdem(
            ResultSet resultSet
    ) throws SQLException {
        return new OrdemRow(
                resultSet.getLong("ordem_id"),
                resultSet.getString(
                        "ordem_codigo"
                ),
                resultSet.getString(
                        "cliente_nome"
                ),
                resultSet.getString(
                        "produto_nome"
                ),
                resultSet.getString(
                        "ordem_status"
                ),
                resultSet.getString(
                        "ordem_prioridade"
                ),
                resultSet.getObject(
                        "data_agendada",
                        LocalDate.class
                ),
                resultSet.getObject(
                        "aberta_em",
                        OffsetDateTime.class
                ),
                resultSet.getObject(
                        "concluida_em",
                        OffsetDateTime.class
                ),
                resultSet.getBigDecimal(
                        "valor_previsto"
                ),
                resultSet.getInt("versao"),
                readNullableLong(
                        resultSet,
                        "primeiro_pagamento_id"
                ),
                resultSet.getString(
                        "metadados_json"
                )
        );
    }

    static Long readNullableLong(
            ResultSet resultSet,
            String label
    ) throws SQLException {
        long value = resultSet.getLong(label);

        return resultSet.wasNull()
                ? null
                : value;
    }
}
```

`wasNull()` é chamado imediatamente depois de `getLong`.

---

### 10. Criar ResultSetMetadataInspector.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/ResultSetMetadataInspector.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public final class ResultSetMetadataInspector {

    private ResultSetMetadataInspector() {
    }

    public static List<ResultColumn> inspect(
            ResultSetMetaData metadata
    ) throws SQLException {
        int columnCount =
                metadata.getColumnCount();

        List<ResultColumn> columns =
                new ArrayList<>(columnCount);

        for (
                int position = 1;
                position <= columnCount;
                position++
        ) {
            columns.add(
                    new ResultColumn(
                            position,
                            metadata.getColumnLabel(
                                    position
                            ),
                            metadata.getColumnName(
                                    position
                            ),
                            metadata.getColumnType(
                                    position
                            ),
                            metadata.getColumnTypeName(
                                    position
                            ),
                            metadata.getColumnClassName(
                                    position
                            ),
                            nullabilityLabel(
                                    metadata.isNullable(
                                            position
                                    )
                            )
                    )
            );
        }

        return List.copyOf(columns);
    }

    private static String nullabilityLabel(
            int nullability
    ) {
        return switch (nullability) {
            case ResultSetMetaData.columnNoNulls ->
                    "NOT_NULL";
            case ResultSetMetaData.columnNullable ->
                    "NULLABLE";
            case ResultSetMetaData
                    .columnNullableUnknown ->
                    "UNKNOWN";
            default ->
                    "INVALID(" + nullability + ")";
        };
    }
}
```

A posição das colunas também começa em 1.

---

### 11. Criar ResultSetLab.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/ResultSetLab.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public final class ResultSetLab {

    private static final String LIST_CLIENTS = """
            SELECT
                cliente.id
                    AS cliente_id,
                cliente.codigo
                    AS cliente_codigo,
                cliente.nome
                    AS cliente_nome,
                cliente.documento
                    AS cliente_documento,
                cliente.email
                    AS cliente_email,
                cliente.ativo
                    AS cliente_ativo,
                cliente.criado_em
                    AS cliente_criado_em,
                cliente.atualizado_em
                    AS cliente_atualizado_em
            FROM projeto_os_final.cliente
                AS cliente
            ORDER BY cliente.id
            """;

    private static final String LIST_ORDERS = """
            SELECT
                ordem.id
                    AS ordem_id,
                ordem.codigo
                    AS ordem_codigo,
                cliente.nome
                    AS cliente_nome,
                produto.nome
                    AS produto_nome,
                ordem.status
                    AS ordem_status,
                ordem.prioridade
                    AS ordem_prioridade,
                ordem.data_agendada,
                ordem.aberta_em,
                ordem.concluida_em,
                ordem.valor_previsto,
                ordem.versao,
                primeiro_pagamento.id
                    AS primeiro_pagamento_id,
                ordem.metadados::text
                    AS metadados_json
            FROM projeto_os_final.ordem_servico
                AS ordem
            INNER JOIN projeto_os_final.cliente
                AS cliente
                ON cliente.id = ordem.cliente_id
            INNER JOIN projeto_os_final.produto
                AS produto
                ON produto.id = ordem.produto_id
            LEFT JOIN LATERAL (
                SELECT pagamento.id
                FROM projeto_os_final.pagamento
                    AS pagamento
                WHERE pagamento.ordem_servico_id
                    = ordem.id
                ORDER BY
                    pagamento.parcela,
                    pagamento.id
                LIMIT 1
            ) AS primeiro_pagamento
                ON true
            ORDER BY ordem.id
            """;

    private final ConnectionProvider connectionProvider;

    public ResultSetLab(
            ConnectionProvider connectionProvider
    ) {
        this.connectionProvider =
                Objects.requireNonNull(
                        connectionProvider,
                        "connectionProvider é obrigatório"
                );
    }

    public List<ClienteRow> listClients()
            throws SQLException {
        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            LIST_CLIENTS
                    );
            ResultSet resultSet =
                    statement.executeQuery()
        ) {
            List<ClienteRow> rows =
                    new ArrayList<>();

            while (resultSet.next()) {
                rows.add(
                        ResultSetMapper.readCliente(
                                resultSet
                        )
                );
            }

            return List.copyOf(rows);
        }
    }

    public List<OrdemRow> listOrders()
            throws SQLException {
        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            LIST_ORDERS
                    );
            ResultSet resultSet =
                    statement.executeQuery()
        ) {
            List<OrdemRow> rows =
                    new ArrayList<>();

            while (resultSet.next()) {
                rows.add(
                        ResultSetMapper.readOrdem(
                                resultSet
                        )
                );
            }

            return List.copyOf(rows);
        }
    }

    public List<ResultColumn> inspectOrderColumns()
            throws SQLException {
        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            LIST_ORDERS
                    );
            ResultSet resultSet =
                    statement.executeQuery()
        ) {
            return ResultSetMetadataInspector.inspect(
                    resultSet.getMetaData()
            );
        }
    }
}
```

Ele recebe apenas a linha atual.

---

### 12. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula314/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import java.sql.SQLException;
import java.util.List;

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

            ResultSetLab lab =
                    new ResultSetLab(provider);

            List<ClienteRow> clientes =
                    lab.listClients();

            System.out.println(
                    "=== Clientes ==="
            );
            System.out.printf(
                    "quantidade: %d%n",
                    clientes.size()
            );

            clientes.forEach(cliente ->
                    System.out.printf(
                            "%d | %s | %s | email=%s%n",
                            cliente.id(),
                            cliente.codigo(),
                            cliente.nome(),
                            cliente.email()
                    )
            );

            List<OrdemRow> ordens =
                    lab.listOrders();

            System.out.println();
            System.out.println(
                    "=== Ordens ==="
            );
            System.out.printf(
                    "quantidade: %d%n",
                    ordens.size()
            );

            ordens.forEach(ordem ->
                    System.out.printf(
                            "%d | %s | %s | "
                                    + "agendada=%s | "
                                    + "concluida=%s | "
                                    + "valor=%s | "
                                    + "primeiroPagamento=%s%n",
                            ordem.id(),
                            ordem.codigo(),
                            ordem.status(),
                            ordem.dataAgendada(),
                            ordem.concluidaEm(),
                            ordem.valorPrevisto(),
                            ordem.primeiroPagamentoId()
                    )
            );

            List<ResultColumn> columns =
                    lab.inspectOrderColumns();

            System.out.println();
            System.out.println(
                    "=== Metadata da consulta ==="
            );
            System.out.printf(
                    "colunas: %d%n",
                    columns.size()
            );

            columns.forEach(column ->
                    System.out.printf(
                            "%02d | label=%s | "
                                    + "name=%s | "
                                    + "sql=%s | "
                                    + "java=%s | "
                                    + "null=%s%n",
                            column.position(),
                            column.label(),
                            column.columnName(),
                            column.sqlTypeName(),
                            column.javaClassName(),
                            column.nullability()
                    )
            );
        } catch (SQLException exception) {
            System.err.println(
                    "Falha JDBC durante leitura."
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
        } catch (RuntimeException exception) {
            System.err.println(
                    "Falha de contrato: "
                            + exception.getMessage()
            );
            System.exit(1);
        }
    }
}
```

---

### 13. Criar ResultSetLabIT.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula314/ResultSetLabIT.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula314;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ResultSetLabIT {

    private static ResultSetLab lab;

    @BeforeAll
    static void setUp() {
        DatabaseSettings settings =
                DatabaseSettings.fromEnvironment();

        lab = new ResultSetLab(
                new DriverManagerConnectionProvider(
                        settings
                )
        );
    }

    @Test
    void shouldReadAllClientsAndNullableEmail()
            throws Exception {
        List<ClienteRow> clientes =
                lab.listClients();

        assertEquals(4, clientes.size());

        ClienteRow alfa =
                clientes.getFirst();

        assertEquals(
                "alfa@example.invalid",
                alfa.email()
        );

        ClienteRow gama =
                clientes.stream()
                        .filter(cliente ->
                                cliente.id() == 307003L
                        )
                        .findFirst()
                        .orElseThrow();

        assertNull(gama.email());
        assertTrue(gama.ativo());
    }

    @Test
    void shouldReadOrderTypesAndRequiredValues()
            throws Exception {
        OrdemRow ordem =
                lab.listOrders()
                        .stream()
                        .filter(row ->
                                row.id() == 307301L
                        )
                        .findFirst()
                        .orElseThrow();

        assertEquals(
                LocalDate.of(2026, 1, 11),
                ordem.dataAgendada()
        );
        assertEquals(
                0,
                ordem.valorPrevisto()
                        .compareTo(
                                new BigDecimal(
                                        "1000.00"
                                )
                        )
        );
        assertEquals(
                307501L,
                ordem.primeiroPagamentoId()
        );
        assertEquals(0, ordem.versao());

        assertEquals(
                Instant.parse(
                        "2026-01-10T12:00:00Z"
                ),
                ordem.abertaEm().toInstant()
        );

        assertFalse(
                ordem.metadadosJson().isBlank()
        );
    }

    @Test
    void shouldPreserveNullableDateAndTimestamp()
            throws Exception {
        OrdemRow ordem =
                lab.listOrders()
                        .stream()
                        .filter(row ->
                                row.id() == 307303L
                        )
                        .findFirst()
                        .orElseThrow();

        assertNull(ordem.dataAgendada());
        assertNull(ordem.concluidaEm());
        assertEquals(
                307505L,
                ordem.primeiroPagamentoId()
        );
    }

    @Test
    void shouldUseWasNullForNullableLong()
            throws Exception {
        OrdemRow ordem =
                lab.listOrders()
                        .stream()
                        .filter(row ->
                                row.id() == 307304L
                        )
                        .findFirst()
                        .orElseThrow();

        assertNull(
                ordem.primeiroPagamentoId()
        );
    }

    @Test
    void shouldExposeStableColumnLabels()
            throws Exception {
        List<ResultColumn> columns =
                lab.inspectOrderColumns();

        assertEquals(13, columns.size());

        assertEquals(
                "ordem_id",
                columns.getFirst().label()
        );

        assertEquals(
                "metadados_json",
                columns.getLast().label()
        );

        assertTrue(
                columns.stream()
                        .anyMatch(column ->
                                column.label()
                                        .equals(
                                                "valor_previsto"
                                        )
                                        && column
                                        .sqlTypeName()
                                        .equals(
                                                "numeric"
                                        )
                        )
        );
    }

    @Test
    void shouldReturnImmutableLists()
            throws Exception {
        List<ClienteRow> clientes =
                lab.listClients();

        org.junit.jupiter.api.Assertions
                .assertThrows(
                        UnsupportedOperationException.class,
                        () -> clientes.clear()
                );
    }
}
```

O teste compara o instante de abertura, não o offset textual original.

---

### 14. Reutilizar DatabaseSettingsTest.java

Copie o teste da aula 313 e ajuste o package para:

```java
package br.com.formacao.m13.aula314;
```

Mantenha validações de:

- URL;
- schema;
- timeouts;
- senha não exposta;
- propriedades da conexão.

---

### 15. Criar 01_verificar_pre_requisitos.ps1

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
        "to_regclass(" +
        "'projeto_os_final.ordem_servico'" +
        ") IS NOT NULL " +
        "AND " +
        "(SELECT count(*) " +
        "FROM projeto_os_final.cliente) = 4 " +
        "AND " +
        "(SELECT count(*) " +
        "FROM projeto_os_final.ordem_servico) = 6;"
    )

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao validar PostgreSQL."
}

if ($estado.Trim() -ne "t") {
    throw "Estado do projeto final inválido."
}

Write-Host "Pré-requisitos validados."
```

---

### 16. Criar 02_executar_leitura.ps1

Reutilize o carregamento do arquivo local das aulas 312 e 313.

Depois execute:

```powershell
mvn clean test

mvn verify

mvn exec:java
```

Em cada etapa, valide `$LASTEXITCODE`.

No `finally`, remova as variáveis JDBC do processo.

O script deve falhar caso o arquivo local esteja ausente ou incompleto.

---

### 17. Criar 03_validar_escopo.ps1

Crie:

```text
scripts/03_validar_escopo.ps1
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
            "executeUpdate|"
            + "INSERT INTO|"
            + "UPDATE projeto|"
            + "DELETE FROM|"
            + "class .*Dao|"
            + "interface .*Repository"
        )

if ($forbidden) {
    $forbidden | ForEach-Object {
        Write-Host $_
    }

    throw "Conteúdo fora do escopo da aula 314."
}

$required = @(
    "ResultSet",
    "getBigDecimal",
    "LocalDate.class",
    "OffsetDateTime.class",
    "wasNull",
    "getMetaData"
)

foreach ($pattern in $required) {
    $found = $files |
        Select-String `
            -SimpleMatch `
            -Pattern $pattern

    if (-not $found) {
        throw "Recurso obrigatório ausente: $pattern"
    }
}

Write-Host "Escopo da aula 314 validado."
```

---

### 18. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_leitura.ps1
.\scripts\03_validar_escopo.ps1
```

Confirme:

```text
4 Clientes;

6 Ordens;

campos nulos preservados;

BigDecimal preservado;

LocalDate lido;

OffsetDateTime lido;

Long nulo preservado com wasNull;

13 colunas inspecionadas.
```

---

### 19. Criar contrato-mapeamento.md

Em:

```text
docs/contrato-mapeamento.md
```

documente cada record.

Para `ClienteRow`:

```text
Campo Java | Label SQL | Tipo PostgreSQL | Tipo Java | Nulável
```

Para `OrdemRow`, inclua todos os 13 campos.

Registre:

```text
uma linha SQL produz um record;

labels são parte do contrato;

colunas obrigatórias são validadas;

campos opcionais preservam null;

o mapper não abre conexão;

o mapper não executa SQL.
```

---

### 20. Criar matriz-tipos-jdbc.md

Em:

```text
docs/matriz-tipos-jdbc.md
```

inclua:

```text
bigint NOT NULL:
long / getLong.

bigint NULL:
Long / getLong + wasNull.

integer NOT NULL:
int / getInt.

boolean NOT NULL:
boolean / getBoolean.

text:
String / getString.

numeric:
BigDecimal / getBigDecimal.

date:
LocalDate / getObject.

timestamptz:
OffsetDateTime / getObject.

jsonb convertido para text:
String / getString.
```

Inclua uma coluna:

```text
erro comum.
```

Exemplos:

- `double` para dinheiro;
- `String` para datas;
- primitivo em coluna nula;
- depender de offset original;
- usar classe específica do driver sem necessidade.

---

### 21. Criar resultset-cursor-e-null.md

Em:

```text
docs/resultset-cursor-e-null.md
```

desenhe:

```text
antes da primeira linha;

linha 1;

linha 2;

fim.
```

Explique:

```text
next() altera a posição;

getter exige linha atual;

wasNull refere-se ao último getter;

ResultSet fechado não pode ser lido;

ResultSet não deve sair da camada JDBC.
```

Inclua exemplos corretos e incorretos de `wasNull()`.

---

### 22. Criar troubleshooting-resultset.md

Em:

```text
docs/troubleshooting-resultset.md
```

registre:

#### ResultSet not positioned properly

Causa:

- getter antes de `next`;
- getter depois do fim.

#### Column label not found

Causa:

- alias divergente;
- erro de digitação;
- mapper e SQL fora de sincronia.

#### Cannot convert type

Causa:

- getter incompatível;
- classe não suportada;
- cast SQL ausente.

#### Valor zero inesperado

Verifique:

- coluna SQL nula;
- uso de getter primitivo;
- `wasNull()`.

#### Data com offset diferente

Compare o instante.

`timestamptz` não preserva o offset original como atributo separado.

#### ResultSet closed

O cursor saiu do `try`, ou a conexão/statement foi fechado.

---

## Entendendo o que foi feito

### O cursor foi percorrido corretamente

As listas usam:

```java
while (resultSet.next())
```

Cada iteração mapeia uma linha.

---

### O SQL criou labels estaveis

IDs e nomes de tabelas diferentes receberam aliases únicos.

O Java não depende de posições mágicas.

---

### Tipos do dominio foram preservados

Dinheiro permaneceu `BigDecimal`.

Datas e instantes usaram `java.time`.

Nulos não foram convertidos em valores artificiais.

---

### wasNull resolveu a ambiguidade

O ID opcional do primeiro Pagamento tornou-se `Long`.

A ausência permaneceu `null`, não zero.

---

### Metadata tornou o contrato visivel

O laboratório mostrou label, nome físico, tipo SQL, classe Java e nulabilidade informada pelo driver.

---

### Os objetos sairam independentes do JDBC

Depois do mapeamento, records e listas não dependem da conexão aberta.

Isso prepara a organização em DAO na aula 315.

---

## Erros comuns importantes

### Ler antes de next

O cursor ainda não está em uma linha.

### Usar getLong em nullable sem wasNull

`NULL` pode virar zero silenciosamente.

### Usar SELECT estrela

O contrato fica instável e ambíguo.

### Mapear dinheiro para double

A precisão decimal pode ser perdida.

### Retornar ResultSet para outra camada

O ciclo de vida dos recursos fica indefinido.

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

### Consulta manual de tipos

```sql
SELECT
    pg_typeof(valor_previsto),
    pg_typeof(data_agendada),
    pg_typeof(aberta_em),
    pg_typeof(metadados)
FROM projeto_os_final.ordem_servico
LIMIT 1;
```

---

## Exercicio guiado

### Parte 1 — Leitura por indice

Crie um método didático que leia somente:

```text
id;

codigo;

nome.
```

Use posições 1, 2 e 3.

Depois altere a ordem do `SELECT` e observe o risco.

Restaure o SQL.

Documente por que o projeto principal usa labels.

---

### Parte 2 — Nullable integer

Crie uma consulta que retorne:

```text
Ordem;

menor número de parcela.
```

Ordens sem Pagamento devem produzir `Integer null`.

Implemente:

```java
readNullableInteger(
        ResultSet,
        String
)
```

Use `getInt` e `wasNull`.

---

### Parte 3 — Timestamp sem fuso

No schema auxiliar temporário, crie uma expressão:

```sql
SELECT
    TIMESTAMP '2026-07-10 10:30:00'
        AS horario_local
```

Leia como:

```java
LocalDateTime
```

Compare conceitualmente com `OffsetDateTime` de `timestamptz`.

Não altere o schema persistente.

---

### Parte 4 — Precisao monetaria

Some em Java os valores previstos das seis Ordens usando `BigDecimal`.

Esperado:

```text
5200.00.
```

Use:

```java
BigDecimal.ZERO;
BigDecimal::add.
```

Não converta para `double`.

---

### Parte 5 — Metadata validada

Crie um teste que confirme:

- 13 labels;
- ausência de labels duplicados;
- `valor_previsto` é `numeric`;
- `ordem_id` está na posição 1;
- `metadados_json` está na última posição.

---

### Parte 6 — Alias quebrado

Em uma cópia temporária da consulta, altere:

```text
cliente_nome
```

para:

```text
nome_cliente.
```

Execute e observe a falha do mapper.

Restaure.

Explique por que SQL e mapper formam um contrato.

---

### Parte 7 — ResultSet fechado

Dentro de um teste controlado:

1. declare a variável do `ResultSet`;
2. leia dentro do `try`;
3. saia do bloco;
4. confirme `isClosed()`;
5. não tente usar o cursor em código de produção.

---

### Parte 8 — Novo record

Crie:

```text
PagamentoRow.
```

Campos:

- ID;
- código da Ordem;
- parcela;
- status;
- vencimento;
- pago em;
- valor;
- meio de pagamento.

Mapeie:

```text
date;
timestamptz nullable;
numeric;
text nullable.
```

Não crie DAO.

Adicione um método didático em `ResultSetLab`.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade oficial;
- o laboratório oficial da aula 314 existe;
- o título inclui ResultSet, mapeamento manual e tipos;
- a continuidade com a aula 313 foi preservada;
- o projeto Maven usa Java 21;
- o driver PostgreSQL permanece fixado;
- configuração real está fora do Git;
- infraestrutura de conexão foi reutilizada;
- `ClienteRow` foi criado;
- `OrdemRow` foi criado;
- campos obrigatórios foram validados;
- campos opcionais preservam `null`;
- `ResultSetMapper` foi criado;
- o mapper não abre conexão;
- o mapper não executa SQL;
- consulta de Cliente usa aliases;
- consulta de Ordem usa aliases;
- nenhuma consulta usa `SELECT *`;
- granularidade de uma linha por Ordem foi preservada;
- `LEFT JOIN LATERAL` não multiplicou linhas;
- `while (resultSet.next())` foi utilizado;
- `getLong` foi utilizado;
- `getInt` foi utilizado;
- `getBoolean` foi utilizado;
- `getString` foi utilizado;
- `getBigDecimal` foi utilizado;
- `LocalDate` foi lido com `getObject`;
- `OffsetDateTime` foi lido com `getObject`;
- `wasNull()` foi usado imediatamente;
- ID opcional foi mapeado para `Long`;
- `jsonb` foi convertido explicitamente para text;
- lista de Clientes possui quatro linhas;
- lista de Ordens possui seis linhas;
- email nulo foi preservado;
- datas opcionais foram preservadas;
- valor monetário preservou precisão;
- instante foi comparado corretamente;
- lista retornada é imutável;
- `ResultSetMetaData` foi inspecionado;
- labels e nomes físicos foram diferenciados;
- metadata possui 13 colunas;
- recursos foram fechados com try-with-resources;
- testes de integração foram criados;
- escopo foi validado por script;
- nenhum DAO foi criado;
- nenhum repository foi criado;
- nenhum DML foi executado;
- JPA e Hibernate não foram antecipados;
- schema `projeto_os_final` permaneceu intacto;
- ponte para a aula 315 está correta;
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
  labs/m13/aula-314-resultset-mapeamento-manual-tipos
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): mapear resultset manualmente com tipos"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
ResultSet;

cursor;

getters tipados;

SQL NULL;

wasNull;

java.time;

BigDecimal;

mapeamento manual;

metadata.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você aprofundou a leitura de resultados JDBC.

Aprendeu que:

```text
ResultSet é um cursor;

o cursor começa antes da primeira linha;

next move a posição;

labels criam contrato entre SQL e Java;

índices de colunas começam em 1;

getters precisam respeitar tipos;

BigDecimal preserva numeric;

LocalDate representa date;

OffsetDateTime representa timestamptz;

String pode representar text nulo;

primitivos exigem wasNull;

wasNull pertence ao último getter;

ResultSetMetaData descreve colunas;

o cursor precisa ser fechado;

objetos mapeados não dependem da conexão.
```

O laboratório transformou linhas do PostgreSQL em records Java imutáveis.

Esse mapeamento ainda está dentro de uma classe didática chamada:

```text
ResultSetLab.
```

A próxima aula será:

```text
315 - M13.05 - DAO inicial com responsabilidade clara
```

Nela, você vai organizar a persistência em uma camada dedicada.

O foco será:

- o que é DAO;
- qual responsabilidade pertence ao DAO;
- o que não pertence ao DAO;
- interface ou classe concreta;
- SQL centralizado;
- mapeamento reutilizado;
- métodos orientados a casos de uso;
- tratamento de ausência;
- propagação ou tradução de exceções;
- ciclo de conexão;
- testes de integração;
- fronteira entre domínio e infraestrutura.

A aula 315 não transformará JDBC em framework.

Ela apenas organizará o código já compreendido.

---

# Material complementar

## Checkpoint final

- [ ] Percorri ResultSet com `next()`.
- [ ] Mapeei tipos SQL para tipos Java adequados.
- [ ] Preservei SQL NULL com wrappers e `wasNull()`.
- [ ] Criei records independentes dos recursos JDBC.
- [ ] Mantive DAO e DML fora desta aula.

---

## Troubleshooting adicional

### Before start of result set

Um getter foi chamado antes do primeiro `next()`.

### After end of result set

O loop terminou e o código tentou ler novamente.

### Column not found

O label do mapper não coincide com o alias do SQL.

### Cannot cast to LocalDate

Confirme que a coluna é `date` e que o driver suporta JDBC 4.2.

### BigDecimal possui escala inesperada

Compare com `compareTo` quando o requisito é valor numérico.

Use `setScale` somente quando a regra de negócio exigir.

---

## Perguntas de revisao

1. O que é `ResultSet`?
2. Onde o cursor começa?
3. O que `next()` faz?
4. Índices de coluna começam em zero?
5. Qual diferença entre label e nome físico?
6. Por que usar aliases?
7. Qual tipo Java representa `numeric`?
8. Qual tipo representa `date`?
9. Qual tipo representa `timestamptz`?
10. `getString` retorna o quê para SQL NULL?
11. `getLong` retorna o quê para SQL NULL?
12. Como distinguir zero de NULL?
13. Quando chamar `wasNull()`?
14. Por que usar wrapper em coluna opcional?
15. Por que evitar `SELECT *`?
16. ResultSet deve sair da camada JDBC?
17. Para que serve metadata?
18. Qual é a ordem de fechamento?
19. DAO foi criado nesta aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Cursor sobre linhas retornadas.
2. Antes da primeira linha.
3. Avança e informa se existe linha.
4. Não, começam em 1.
5. Label considera alias; nome físico identifica a coluna original.
6. Criar contrato estável e evitar colisões.
7. `BigDecimal`.
8. `LocalDate`.
9. `OffsetDateTime`.
10. `null`.
11. Zero.
12. Com `wasNull()`.
13. Imediatamente após o getter.
14. Preservar ausência.
15. Evitar contrato instável e dados extras.
16. Não.
17. Inspecionar colunas e tipos.
18. ResultSet, PreparedStatement, Connection.
19. Não.
20. DAO inicial com responsabilidade clara.

---

## Desafio opcional

Crie uma interface funcional genérica:

```java
@FunctionalInterface
public interface RowMapper<T> {

    T map(ResultSet resultSet)
            throws SQLException;
}
```

Depois:

```java
RowMapper<ClienteRow>;

RowMapper<OrdemRow>.
```

Use os mappers dentro de um método genérico didático:

```java
<T> List<T> readAll(
        String sql,
        RowMapper<T> mapper
)
```

Restrições:

- sem parâmetros dinâmicos;
- sem DAO;
- sem repository;
- sem reflection;
- sem esconder fechamento;
- SQL continua explícito;
- testes de integração obrigatórios.

O objetivo é reconhecer um padrão de mapeamento sem antecipar frameworks.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 314 - M13.04 - ResultSet mapeamento manual e tipos

- Aprofundei o uso de `ResultSet`.
- Entendi o cursor antes da primeira linha.
- Usei `next()` para percorrer múltiplas linhas.
- Diferenciei leitura por índice e por label.
- Usei aliases como contrato entre SQL e Java.
- Diferenciei `getColumnLabel` e `getColumnName`.
- Mapeei `bigint` para `long` e `Long`.
- Mapeei `text` para `String`.
- Mapeei `boolean` para `boolean`.
- Mapeei `numeric` para `BigDecimal`.
- Mapeei `date` para `LocalDate`.
- Mapeei `timestamptz` para `OffsetDateTime`.
- Comparei instantes sem depender do offset original.
- Preservei campos textuais nulos.
- Usei `wasNull()` para um ID opcional.
- Entendi que `wasNull()` se refere ao último getter.
- Converti JSONB para texto de forma explícita no SQL.
- Criei `ClienteRow` e `OrdemRow`.
- Criei um mapper manual de linhas.
- Mantive uma linha por Ordem na consulta.
- Inspecionei `ResultSetMetaData`.
- Retornei listas imutáveis.
- Fechei ResultSet, PreparedStatement e Connection.
- Não criei DAO nem executei DML.
- Preservei `projeto_os_final`.
- Próxima aula: DAO inicial com responsabilidade clara.
```

---

## Referencia tecnica curta

```text
ResultSet:
cursor de linhas.

next:
avança o cursor.

label:
nome exposto pela consulta.

getter:
conversão tipada.

BigDecimal:
valor decimal exato.

LocalDate:
data sem horário.

OffsetDateTime:
instante com offset.

wasNull:
detecta SQL NULL após getter primitivo.

ResultSetMetaData:
descrição das colunas.

Mapper:
linha para objeto Java.
```

Regra final:

```text
ler um ResultSet corretamente significa preservar granularidade, labels, tipos, nulabilidade e ciclo de vida antes de transformar cada linha em um objeto Java independente.
```
