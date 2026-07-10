# 315 - M13.05 - DAO inicial com responsabilidade clara

## Apresentacao da aula

Na aula 314, você aprofundou o uso de `ResultSet` e transformou linhas do PostgreSQL em records Java.

O laboratório anterior tornou explícitas estas responsabilidades:

```text
abrir a conexão;

preparar o SQL;

executar a consulta;

percorrer o cursor;

ler labels;

converter tipos;

preservar SQL NULL;

criar objetos Java;

fechar ResultSet, PreparedStatement e Connection.
```

Todo esse trabalho estava concentrado em uma classe didática chamada:

```text
ResultSetLab.
```

Ela foi adequada para estudar o cursor, os getters e os tipos.

Entretanto, uma aplicação backend precisa organizar o código de persistência de modo que outras partes não conheçam detalhes como:

- SQL;
- `PreparedStatement`;
- `ResultSet`;
- aliases;
- parâmetros JDBC;
- ciclo de conexão;
- mapeamento de linhas.

Nesta aula, você criará seu primeiro DAO.

DAO significa:

```text
Data Access Object.
```

Um DAO encapsula o acesso a uma fonte de dados para uma responsabilidade específica.

No laboratório, a responsabilidade será:

```text
acessar dados de Cliente no PostgreSQL por JDBC.
```

A classe `ClienteDao` oferecerá `findById`, `findByCode`, `findAllActive` e `countAll`.

Quem chama o DAO não precisará saber:

- qual tabela foi consultada;
- qual SQL foi usado;
- como os parâmetros foram associados;
- como o `ResultSet` foi percorrido;
- como os tipos foram convertidos;
- como os recursos foram fechados.

O chamador receberá:

```text
Optional<Cliente>;

List<Cliente>;

long.
```

A aula separará `ClienteMapper`, responsável por transformar a linha atual em `Cliente`. O DAO coordena JDBC; o `Main` apenas monta objetos e exibe resultados. Essa divisão evita misturar persistência, regra de negócio e apresentação.

O DAO desta aula será uma classe concreta.

Você não criará uma interface apenas por padrão.

Uma abstração deve existir quando há necessidade real de:

- múltiplas implementações;
- fronteira arquitetural;
- testes isolados;
- substituição da tecnologia;
- contrato independente.

A próxima aula tratará especificamente:

```text
Repository Pattern sem Spring.
```

Por isso, esta aula não chamará o DAO de repository e não criará uma camada de repository disfarçada.

Também não serão introduzidos:

- `INSERT`;
- `UPDATE`;
- `DELETE`;
- transações manuais;
- tradução própria de exceções;
- pool de conexões;
- HikariCP;
- JPA;
- Hibernate;
- Spring Data.

Cada método do DAO abrirá e fechará sua própria conexão.

Ele possui uma limitação importante:

```text
duas chamadas ao DAO usam duas conexões e não formam uma única transação.
```

Nesta aula, `SQLException` continuará sendo propagada.

O tratamento especializado de exceções possui uma aula própria:

```text
317 - M13.07 - Tratamento de excecoes em JDBC
```

A próxima aula será:

```text
316 - M13.06 - Repository Pattern sem Spring
```

---

## Onde estamos na formacao

A sequência atual do M13 é:

```text
311:
driver PostgreSQL.

312:
Connection e DataSource conceitual.

313:
PreparedStatement e SQL Injection.

314:
ResultSet, mapeamento manual e tipos.

315:
DAO inicial com responsabilidade clara.

316:
Repository Pattern sem Spring.

317:
tratamento de exceções em JDBC.

318:
transações com JDBC.

319:
connection pool e HikariCP conceitual.

320 e 321:
mini projeto JDBC CRUD de Ordem de Serviço.
```

Os mecanismos estudados separadamente agora serão reunidos em uma unidade de acesso a dados.

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-315-dao-inicial-responsabilidade-clara
```

Estrutura final:

```text
labs
└── m13
    └── aula-315-dao-inicial-responsabilidade-clara
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-cliente-dao.md
        │   ├── dao-responsabilidades.md
        │   ├── decisoes-arquiteturais.md
        │   └── troubleshooting-dao.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_dao.ps1
        │   └── 03_validar_escopo.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula315
            │                           ├── Cliente.java
            │                           ├── ClienteDao.java
            │                           ├── ClienteMapper.java
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
                                    └── aula315
                                        ├── ClienteDaoIT.java
                                        └── DatabaseSettingsTest.java
```

Resultados esperados:

```text
countAll:
4.

findById 307001:
Cliente Final Alfa.

findByCode CLI-POF-GAMA:
Cliente Final Gama;
email nulo.

findAllActive:
4 Clientes;
ordenados por nome e ID;
lista imutável.

ID inexistente:
Optional vazio.

código malicioso:
Optional vazio.
```

O schema `projeto_os_final` será apenas consultado.

Nenhuma linha será inserida, alterada ou excluída.

---

## Conceito essencial

### O que e DAO

DAO é um padrão de organização do acesso a dados.

Ele oferece métodos Java e esconde detalhes da tecnologia persistente.

Exemplo externo:

```java
Optional<Cliente> cliente =
        clienteDao.findByCode(
                "CLI-POF-ALFA"
        );
```

O chamador não executa:

```java
connection.prepareStatement(...);
```

Não percorre:

```java
resultSet.next();
```

Não conhece:

```text
projeto_os_final.cliente.
```

O DAO transforma uma intenção de acesso a dados em operações JDBC.

---

### Responsabilidade do ClienteDao

O `ClienteDao` será responsável por:

- manter o SQL de Cliente;
- validar parâmetros técnicos;
- obter conexão;
- criar `PreparedStatement`;
- associar parâmetros;
- executar a consulta;
- percorrer o `ResultSet`;
- delegar mapeamento;
- fechar recursos;
- devolver objetos Java;
- propagar `SQLException`.

Ele não será responsável por:

- imprimir no console;
- ler variáveis de ambiente;
- decidir regra comercial;
- validar autorização do usuário;
- enviar HTTP;
- controlar interface gráfica;
- manter conexão global;
- abrir transação envolvendo vários DAOs;
- converter exceção em mensagem de negócio.

---

### DAO nao e service

Considere uma regra futura:

```text
Cliente inativo não pode abrir nova Ordem.
```

Essa decisão não pertence ao `ClienteDao`.

O DAO pode consultar:

```text
cliente.ativo.
```

A regra de permitir ou rejeitar a criação pertence a uma camada de serviço ou caso de uso.

O DAO responde:

```text
quais dados existem?
```

O serviço decide:

```text
o que a aplicação pode fazer com eles?
```

---

### DAO nao e controller

Uma camada HTTP futura poderá receber:

```text
GET /clientes/{codigo}
```

O controller trata:

- entrada HTTP;
- status HTTP;
- serialização;
- autenticação da requisição;
- validação de formato;
- resposta.

Ele pode chamar um serviço ou caso de uso.

Não deve conter SQL.

O DAO também não deve conhecer HTTP.

---

### DAO nao e mapper

O DAO coordena a operação JDBC.

O mapper conhece o contrato entre colunas e objeto.

Separação:

```text
ClienteDao:
controla fluxo de acesso.

ClienteMapper:
converte uma linha.

Cliente:
representa dados lidos.
```

O mapper não abre conexão.

O mapper não escolhe SQL.

O mapper não percorre todas as linhas.

Ele recebe o cursor já posicionado na linha atual.

---

### DAO nao deve retornar ResultSet

O retorno de um `ResultSet` vazaria detalhes JDBC.

O chamador precisaria saber:

- se existe conexão aberta;
- quando chamar `next`;
- quais labels existem;
- quem fecha os recursos.

Retornos adequados nesta aula:

```text
Optional<Cliente>;

List<Cliente>;

long.
```

Esses valores permanecem utilizáveis depois que os recursos são fechados.

---

### Classe concreta primeiro

O laboratório usa `public final class ClienteDao`, sem interface. Existe apenas uma implementação e o objetivo é compreender responsabilidade. Evite `IClienteDao` e `ClienteDaoImpl` sem necessidade concreta.

### Injeção por construtor

O DAO receberá:

```java
ConnectionProvider
```

por construtor.

Vantagens:

- dependência explícita;
- objeto sempre válido;
- origem da conexão substituível;
- ausência de configuração global;
- facilidade de teste futuro.

O DAO não criará internamente:

```java
new DriverManagerConnectionProvider(...)
```

Essa montagem pertence ao ponto de composição da aplicação, representado pelo `Main`.

---

### SQL dentro do DAO

Os SQLs serão constantes privadas:

```java
private static final String FIND_BY_ID = """
        ...
        """;
```

Benefícios:

- ficam próximos dos métodos que os usam;
- são explícitos;
- podem ser revisados;
- não aparecem espalhados pelo `Main`;
- continuam versionados;
- não dependem de arquivos ocultos.

Em sistemas maiores, SQL pode ser organizado de outras formas.

Nesta etapa, text blocks privados são suficientes.

---

### Metodo orientado a uma intencao

Bom:

```java
findById;

findByCode;

findAllActive;

countAll.
```

Fraco:

```java
executeSql(String sql);

query(String sql);

run(String text).
```

Um método genérico que aceita SQL externo destrói o encapsulamento e permite que qualquer camada controle a persistência.

O DAO deve oferecer intenções conhecidas.

---

### Optional para zero ou um

`findById` e `findByCode` possuem retorno:

```java
Optional<Cliente>
```

Porque:

```text
zero linhas:
Cliente não encontrado.

uma linha:
Cliente encontrado.

mais de uma linha:
inconsistência.
```

`Optional` não significa erro.

Ausência pode ser resultado normal de uma consulta.

O DAO verificará se uma segunda linha apareceu e lançará `IllegalStateException`, pois `id` e `codigo` são únicos no modelo.

---

### Lista para zero ou muitos

`findAllActive` devolve:

```java
List<Cliente>
```

Uma consulta sem resultado devolve:

```text
lista vazia.
```

Não devolva:

```text
null.
```

A lista será convertida com:

```java
List.copyOf(...)
```

O chamador recebe coleção imutável.

---

### Contagem

`countAll` devolve:

```java
long
```

O PostgreSQL `count(*)` retorna uma linha.

O método verifica:

- existência da linha;
- ausência de linha extra.

Embora a ausência seja improvável para `count(*)`, a validação documenta a expectativa do contrato.

---

### Validacao tecnica

O DAO valida parâmetros necessários para executar a consulta corretamente.

Exemplos:

```text
ID maior que zero;

código não nulo;

código não vazio;

limite entre 1 e 100.
```

Isso é validação técnica de contrato.

Regra de negócio mais complexa deve ficar fora.

Exemplo fora do DAO:

```text
Cliente precisa estar ativo para receber desconto.
```

---

### Uma conexao por metodo

Cada operação abre e fecha sua própria conexão em `try-with-resources`. Isso deixa o ciclo de vida explícito, mas duas chamadas não compartilham transação. A limitação será tratada na aula 318, sem conexão global.

### Leitura e autocommit

As operações são somente `SELECT`.

A conexão permanece com:

```text
autocommit true.
```

Não execute:

```java
setAutoCommit(false);
```

Não chame:

```java
commit();

rollback();
```

Transações manuais possuem aula própria.

---

### Excecoes nesta etapa

Os métodos ainda declaram `throws SQLException`. A escolha é temporária: classificação e tradução de falhas serão estudadas na aula 317. Não crie uma hierarquia superficial agora.

### Mapper reutilizavel

O mapper será package-private:

```java
final class ClienteMapper
```

Ele não precisa fazer parte da API pública do laboratório.

Método:

```java
static Cliente map(ResultSet resultSet)
```

O mapper usará aliases estáveis:

```text
cliente_id;

cliente_codigo;

cliente_nome;

cliente_documento;

cliente_email;

cliente_ativo;

cliente_criado_em;

cliente_atualizado_em.
```

Todos os SQLs do DAO usarão o mesmo conjunto de aliases.

---

### Colunas explicitas

Nenhum método usa `SELECT *`. Cada SQL lista e nomeia as colunas exigidas pelo mapper, mantendo o contrato visível mesmo com alguma repetição.

### Ordenacao do findAllActive

A consulta usará:

```sql
ORDER BY
    cliente.nome,
    cliente.id
```

O ID resolve empates.

O método recebe:

```text
limit.
```

O limite será parametrizado com `setInt`.

A ordenação não será fornecida livremente pelo usuário.

---

### SQL Injection continua bloqueada

`findByCode` mantém `WHERE cliente.codigo = ?`. Entradas maliciosas continuam como valores literais. Organizar o código em DAO não substitui `PreparedStatement` nem menor privilégio.

### Nome DAO e escopo

`ClienteDao` possui uma responsabilidade nomeável. Evite classes genéricas como `SistemaDao` ou `BancoDao`, que acumulam consultas sem coesão.

### DAO e a tabela

Neste laboratório, `ClienteDao` está próximo da tabela Cliente. Um DAO também pode usar joins quando a responsabilidade continua coesa, mas não deve virar um relatório universal ou concentrar entidades sem relação.

### Main como composition root

`Main` monta `DatabaseSettings`, `ConnectionProvider` e `ClienteDao`. Ele conhece implementações concretas, enquanto o DAO depende apenas de `ConnectionProvider`. Essa composição manual prepara conceitos futuros sem framework.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz do repositório:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-315-dao-inicial-responsabilidade-clara\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-315-dao-inicial-responsabilidade-clara\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-315-dao-inicial-responsabilidade-clara\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-315-dao-inicial-responsabilidade-clara\src\main\java\br\com\formacao\m13\aula315"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-315-dao-inicial-responsabilidade-clara\src\test\java\br\com\formacao\m13\aula315"

Set-Location `
  "labs\m13\aula-315-dao-inicial-responsabilidade-clara"
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
    <artifactId>aula-315-dao-inicial</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <name>
        Aula 315 - DAO inicial
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
                        br.com.formacao.m13.aula315.Main
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
JDBC_APPLICATION_NAME=aula-315-dao
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

Confirme que o arquivo real não aparece em:

```powershell
git status
```

---

### 5. Reutilizar infraestrutura JDBC

Copie da aula 314 e altere o package para:

```java
package br.com.formacao.m13.aula315;
```

Arquivos:

```text
DatabaseSettings.java;

ConnectionProvider.java;

DriverManagerConnectionProvider.java.
```

Não copie:

```text
ResultSetLab;

ResultSetMetadataInspector;

OrdemRow.
```

A aula reorganizará somente a persistência de Cliente.

---

### 6. Criar Cliente.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula315/Cliente.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula315;

import java.time.OffsetDateTime;

public record Cliente(
        long id,
        String codigo,
        String nome,
        String documento,
        String email,
        boolean ativo,
        OffsetDateTime criadoEm,
        OffsetDateTime atualizadoEm
) {

    public Cliente {
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

O record é independente da infraestrutura JDBC.

---

### 7. Criar ClienteMapper.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula315/ClienteMapper.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula315;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;

final class ClienteMapper {

    private ClienteMapper() {
    }

    static Cliente map(
            ResultSet resultSet
    ) throws SQLException {
        return new Cliente(
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
}
```

A classe é package-private.

---

### 8. Criar ClienteDao.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula315/ClienteDao.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula315;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public final class ClienteDao {

    private static final String FIND_BY_ID = """
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
            WHERE cliente.id = ?
            """;

    private static final String FIND_BY_CODE = """
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
            WHERE cliente.codigo = ?
            """;

    private static final String FIND_ALL_ACTIVE = """
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
            WHERE cliente.ativo = ?
            ORDER BY
                cliente.nome,
                cliente.id
            LIMIT ?
            """;

    private static final String COUNT_ALL = """
            SELECT count(*) AS quantidade
            FROM projeto_os_final.cliente
            """;

    private final ConnectionProvider connectionProvider;

    public ClienteDao(
            ConnectionProvider connectionProvider
    ) {
        this.connectionProvider =
                Objects.requireNonNull(
                        connectionProvider,
                        "connectionProvider é obrigatório"
                );
    }

    public Optional<Cliente> findById(
            long id
    ) throws SQLException {
        if (id <= 0) {
            throw new IllegalArgumentException(
                    "id deve ser positivo"
            );
        }

        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            FIND_BY_ID
                    )
        ) {
            statement.setLong(1, id);

            return readOptional(statement);
        }
    }

    public Optional<Cliente> findByCode(
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

            return readOptional(statement);
        }
    }

    public List<Cliente> findAllActive(
            int limit
    ) throws SQLException {
        if (limit < 1 || limit > 100) {
            throw new IllegalArgumentException(
                    "limit deve estar entre 1 e 100"
            );
        }

        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            FIND_ALL_ACTIVE
                    )
        ) {
            statement.setBoolean(1, true);
            statement.setInt(2, limit);

            try (
                ResultSet resultSet =
                        statement.executeQuery()
            ) {
                List<Cliente> clientes =
                        new ArrayList<>();

                while (resultSet.next()) {
                    clientes.add(
                            ClienteMapper.map(
                                    resultSet
                            )
                    );
                }

                return List.copyOf(clientes);
            }
        }
    }

    public long countAll()
            throws SQLException {
        try (
            Connection connection =
                    connectionProvider.open();
            PreparedStatement statement =
                    connection.prepareStatement(
                            COUNT_ALL
                    );
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

    private static Optional<Cliente> readOptional(
            PreparedStatement statement
    ) throws SQLException {
        try (
            ResultSet resultSet =
                    statement.executeQuery()
        ) {
            if (!resultSet.next()) {
                return Optional.empty();
            }

            Cliente cliente =
                    ClienteMapper.map(resultSet);

            if (resultSet.next()) {
                throw new IllegalStateException(
                        "Consulta única retornou "
                                + "mais de uma linha"
                );
            }

            return Optional.of(cliente);
        }
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

O helper `readOptional` recebe um statement já parametrizado.

---

### 9. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula315/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula315;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

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

            ClienteDao clienteDao =
                    new ClienteDao(provider);

            long total =
                    clienteDao.countAll();

            System.out.println(
                    "=== Contagem ==="
            );
            System.out.printf(
                    "Clientes: %d%n",
                    total
            );

            Optional<Cliente> byId =
                    clienteDao.findById(
                            307001L
                    );

            System.out.println();
            System.out.println(
                    "=== Busca por ID ==="
            );
            byId.ifPresentOrElse(
                    Main::printCliente,
                    () -> System.out.println(
                            "Cliente não encontrado."
                    )
            );

            Optional<Cliente> byCode =
                    clienteDao.findByCode(
                            "CLI-POF-GAMA"
                    );

            System.out.println();
            System.out.println(
                    "=== Busca por código ==="
            );
            byCode.ifPresentOrElse(
                    Main::printCliente,
                    () -> System.out.println(
                            "Cliente não encontrado."
                    )
            );

            List<Cliente> ativos =
                    clienteDao.findAllActive(
                            20
                    );

            System.out.println();
            System.out.println(
                    "=== Clientes ativos ==="
            );
            System.out.printf(
                    "quantidade: %d%n",
                    ativos.size()
            );
            ativos.forEach(
                    Main::printCliente
            );

            Optional<Cliente> malicious =
                    clienteDao.findByCode(
                            "CLI-POF-ALFA' OR '1'='1"
                    );

            System.out.println();
            System.out.println(
                    "=== Entrada maliciosa ==="
            );
            System.out.printf(
                    "retorno vazio: %s%n",
                    malicious.isEmpty()
            );
        } catch (SQLException exception) {
            System.err.println(
                    "Falha JDBC no DAO."
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

    private static void printCliente(
            Cliente cliente
    ) {
        System.out.printf(
                "%d | %s | %s | "
                        + "email=%s | ativo=%s%n",
                cliente.id(),
                cliente.codigo(),
                cliente.nome(),
                cliente.email(),
                cliente.ativo()
        );
    }
}
```

O `Main` não conhece SQL.

---

### 10. Criar ClienteDaoIT.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula315/ClienteDaoIT.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula315;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ClienteDaoIT {

    private static ClienteDao clienteDao;

    @BeforeAll
    static void setUp() {
        DatabaseSettings settings =
                DatabaseSettings.fromEnvironment();

        clienteDao = new ClienteDao(
                new DriverManagerConnectionProvider(
                        settings
                )
        );
    }

    @Test
    void shouldCountAllClients()
            throws Exception {
        assertEquals(
                4L,
                clienteDao.countAll()
        );
    }

    @Test
    void shouldFindById()
            throws Exception {
        Cliente cliente =
                clienteDao.findById(
                        307001L
                )
                .orElseThrow();

        assertEquals(
                "Cliente Final Alfa",
                cliente.nome()
        );
    }

    @Test
    void shouldFindByCodeAndPreserveNull()
            throws Exception {
        Cliente cliente =
                clienteDao.findByCode(
                        "CLI-POF-GAMA"
                )
                .orElseThrow();

        assertEquals(
                307003L,
                cliente.id()
        );
        assertNull(cliente.email());
    }

    @Test
    void shouldReturnEmptyForUnknownId()
            throws Exception {
        Optional<Cliente> result =
                clienteDao.findById(
                        999999L
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldTreatMaliciousCodeAsData()
            throws Exception {
        Optional<Cliente> result =
                clienteDao.findByCode(
                        "CLI-POF-ALFA' OR '1'='1"
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldListActiveClientsInOrder()
            throws Exception {
        List<Cliente> clientes =
                clienteDao.findAllActive(
                        20
                );

        assertEquals(4, clientes.size());

        assertEquals(
                List.of(
                        "Cliente Final Alfa",
                        "Cliente Final Beta",
                        "Cliente Final Gama",
                        "Cliente sem Ordem"
                ),
                clientes.stream()
                        .map(Cliente::nome)
                        .toList()
        );
    }

    @Test
    void shouldReturnImmutableList()
            throws Exception {
        List<Cliente> clientes =
                clienteDao.findAllActive(
                        20
                );

        assertThrows(
                UnsupportedOperationException.class,
                () -> clientes.clear()
        );
    }

    @Test
    void shouldRejectInvalidArguments() {
        assertThrows(
                IllegalArgumentException.class,
                () -> clienteDao.findById(0)
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> clienteDao.findByCode(" ")
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> clienteDao.findAllActive(101)
        );
    }
}
```

---

### 11. Reutilizar DatabaseSettingsTest.java

Copie da aula 314 e altere o package:

```java
package br.com.formacao.m13.aula315;
```

Mantenha testes para:

- URL;
- usuário;
- senha não exposta;
- schema;
- application name;
- timeouts.

---

### 12. Criar 01_verificar_pre_requisitos.ps1

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
        "(SELECT count(*) " +
        "FROM projeto_os_final.cliente) = 4;"
    )

if ($LASTEXITCODE -ne 0) {
    throw "Falha ao validar PostgreSQL."
}

if ($estado.Trim() -ne "t") {
    throw "Estado de Cliente inválido."
}

Write-Host "Pré-requisitos validados."
```

---

### 13. Criar 02_executar_dao.ps1

Reutilize o carregamento seguro das variáveis JDBC das aulas anteriores.

Depois execute:

```powershell
mvn clean test

mvn verify

mvn exec:java
```

Valide o código de saída depois de cada comando.

No `finally`, remova todas as variáveis JDBC do processo.

---

### 14. Criar 03_validar_escopo.ps1

Crie:

```text
scripts/03_validar_escopo.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$mainFiles = Get-ChildItem `
    -Path ".\src\main\java" `
    -Recurse `
    -Filter "*.java"

$daoFile = Get-Item `
    ".\src\main\java\br\com\formacao\m13\aula315\ClienteDao.java"

$mainFile = Get-Item `
    ".\src\main\java\br\com\formacao\m13\aula315\Main.java"

$requiredDao = @(
    "class ClienteDao",
    "findById",
    "findByCode",
    "findAllActive",
    "countAll",
    "prepareStatement",
    "ClienteMapper.map"
)

foreach ($pattern in $requiredDao) {
    if (-not (
        Select-String `
            -Path $daoFile `
            -SimpleMatch `
            -Pattern $pattern
    )) {
        throw "Item obrigatório ausente: $pattern"
    }
}

$forbiddenMain = Select-String `
    -Path $mainFile `
    -Pattern (
        "PreparedStatement|ResultSet|"
        + "prepareStatement|SELECT "
    )

if ($forbiddenMain) {
    throw "Main contém detalhe de persistência."
}

$forbiddenProject = $mainFiles |
    Select-String `
        -Pattern (
            "executeUpdate|"
            + "INSERT INTO|"
            + "UPDATE projeto_os_final|"
            + "DELETE FROM|"
            + "interface ClienteDao|"
            + "class ClienteRepository"
        )

if ($forbiddenProject) {
    $forbiddenProject | ForEach-Object {
        Write-Host $_
    }

    throw "Conteúdo fora do escopo da aula 315."
}

Write-Host "Escopo do DAO validado."
```

---

### 15. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_dao.ps1
.\scripts\03_validar_escopo.ps1
```

Confirme:

```text
4 Clientes;

Cliente Alfa por ID;

Cliente Gama por código;

email nulo preservado;

4 Clientes ativos ordenados;

entrada maliciosa sem resultado;

Main sem SQL;

nenhum DML.
```

---

### 16. Criar dao-responsabilidades.md

Em:

```text
docs/dao-responsabilidades.md
```

crie duas seções:

```text
Pertence ao DAO;

Não pertence ao DAO.
```

Inclua pelo menos:

```text
SQL;
parâmetros;
cursor;
mapper;
ciclo JDBC;
retorno tipado;
validação técnica.
```

E fora:

```text
regra de negócio;
HTTP;
console;
autorização;
formatação de tela;
transação entre vários DAOs;
mensageria;
cache;
notificação.
```

---

### 17. Criar contrato-cliente-dao.md

Em:

```text
docs/contrato-cliente-dao.md
```

documente cada método:

```text
nome;

entrada;

validação;

SQL;

parâmetros;

granularidade;

retorno;

ordenação;

ausência;

exceções;

conexão.
```

Exemplo de `findByCode`:

```text
entrada:
código obrigatório.

granularidade:
zero ou um Cliente.

retorno:
Optional.

segurança:
PreparedStatement e setString.

ausência:
Optional.empty.

conexão:
uma por chamada.
```

---

### 18. Criar decisoes-arquiteturais.md

Em:

```text
docs/decisoes-arquiteturais.md
```

registre:

1. DAO concreto sem interface.
2. `ConnectionProvider` injetado.
3. SQL privado dentro do DAO.
4. mapper separado e package-private.
5. `SQLException` propagada temporariamente.
6. uma conexão por método.
7. apenas operações de leitura.
8. listas imutáveis.
9. nenhum repository nesta aula.
10. nenhuma transação manual.

Para cada decisão:

```text
contexto;

decisão;

benefício;

limitação;

aula futura relacionada.
```

---

### 19. Criar troubleshooting-dao.md

Em:

```text
docs/troubleshooting-dao.md
```

registre:

#### DAO retorna vazio inesperadamente

Verifique:

- parâmetro;
- trim;
- seed;
- database;
- schema;
- filtro;
- conexão.

#### Mapper falha com coluna ausente

Verifique:

- aliases;
- SQL do método;
- contrato compartilhado;
- alteração não refletida.

#### Main contém SQL

Mova o acesso para o DAO.

O `Main` deve apenas compor e chamar.

#### Conexões ficam abertas

Verifique cada `try-with-resources`.

O DAO não deve manter `Connection` em campo.

#### Duas operações precisam ser atomicas

Não tente compartilhar conexão global.

Registre a necessidade para a aula de transações.

#### SQLException aparece no Main

Isso é esperado nesta etapa.

A tradução será estudada na aula 317.

---

## Entendendo o que foi feito

### O acesso a Cliente ganhou uma fronteira

O `Main` chama métodos com significado e não conhece SQL.

---

### O DAO coordenou recursos

Cada método abriu conexão, preparou statement, executou, mapeou e fechou recursos.

---

### O mapper ficou pequeno

`ClienteMapper` transforma somente a linha atual em `Cliente`.

Ele não controla consulta nem coleção.

---

### Os retornos ficaram independentes do JDBC

`Cliente`, `Optional` e `List` continuam válidos depois do fechamento da conexão.

---

### As limitacoes ficaram documentadas

O DAO ainda propaga `SQLException` e abre uma conexão por método.

Essas decisões serão evoluídas em aulas específicas.

---

## Erros comuns importantes

### Criar um GenericDao cedo demais

A generalização esconde SQL e responsabilidades antes de existir repetição comprovada.

### Colocar regra de negocio no DAO

O DAO acessa dados; o serviço decide comportamentos.

### Retornar ResultSet

Isso vaza recursos e detalhes JDBC.

### Guardar Connection em campo

A conexão passa a viver além da operação e pode ser compartilhada indevidamente.

### Criar interface sem necessidade

Interface não é sinônimo automático de boa arquitetura.

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

### Validar escopo

```powershell
.\scripts\03_validar_escopo.ps1
```

---

## Exercicio guiado

### Parte 1 — Buscar por documento

Adicione:

```java
Optional<Cliente> findByDocument(
        String document
)
```

Use:

```sql
WHERE cliente.documento = ?
```

Regras:

- texto obrigatório;
- `setString`;
- retorno `Optional`;
- segunda linha representa inconsistência;
- teste para `DOC-POF-002`;
- teste para documento inexistente.

---

### Parte 2 — Listar pagina

Crie:

```java
List<Cliente> findPage(
        int limit,
        int offset
)
```

SQL:

```sql
ORDER BY
    cliente.id
LIMIT ?
OFFSET ?
```

Valide:

```text
limit:
1 a 100.

offset:
zero ou positivo.
```

Teste duas páginas de dois registros sem repetição.

---

### Parte 3 — Contar ativos

Crie:

```java
long countActive()
```

Não reutilize `findAllActive().size()`.

A contagem deve ser feita no banco:

```sql
SELECT count(*)
FROM projeto_os_final.cliente
WHERE ativo = ?
```

Use `setBoolean`.

---

### Parte 4 — Nao colocar regra comercial no DAO

Considere:

```text
Cliente sem email não pode receber comunicação.
```

Escreva em `decisoes-arquiteturais.md`:

- por que a consulta pode devolver email nulo;
- por que a decisão de enviar não pertence ao DAO;
- qual camada futura deveria decidir.

Não implemente envio.

---

### Parte 5 — Mapper quebrado

Em uma cópia temporária, remova o alias:

```text
cliente_email.
```

Execute o teste e observe a falha.

Restaure.

Registre que SQL e mapper formam um contrato interno do DAO.

---

### Parte 6 — Provar fechamento

Crie um `ConnectionProvider` decorador de teste que:

- conta conexões abertas;
- envolve `Connection` com `Proxy`;
- conta chamadas a `close`;
- delega ao provider real.

Execute `findById`, `findByCode` e `countAll`.

Confirme uma abertura e um fechamento por chamada.

Não crie pool.

---

### Parte 7 — Avaliar interface

Responda:

```text
há duas implementações de ClienteDao?

o domínio depende de um contrato de persistência?

existe necessidade de mock?

a próxima aula criará uma abstração diferente?
```

Conclua se uma interface DAO é necessária agora.

A resposta esperada para o laboratório atual é:

```text
não.
```

---

### Parte 8 — Criar ProdutoDao

Como desafio maior, crie um DAO de leitura para Produto:

```text
findById;

findByCode;

findAllActive;

countAll.
```

Crie:

```text
Produto;

ProdutoMapper;

ProdutoDao;

ProdutoDaoIT.
```

Mapeie `valor_referencia` como `BigDecimal`.

Não crie classe genérica compartilhada nesta etapa.

Compare a repetição e apenas registre possíveis padrões.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade oficial;
- o laboratório oficial da aula 315 existe;
- a continuidade com a aula 314 foi preservada;
- o projeto Maven usa Java 21;
- o driver PostgreSQL permanece fixado;
- configuração real está fora do Git;
- infraestrutura de conexão foi reutilizada;
- `Cliente` é independente de JDBC;
- `ClienteMapper` foi criado;
- mapper é package-private;
- mapper não abre conexão;
- mapper não executa SQL;
- `ClienteDao` foi criado;
- DAO é classe concreta final;
- nenhuma interface DAO artificial foi criada;
- `ConnectionProvider` foi injetado;
- SQL ficou privado no DAO;
- `findById` foi implementado;
- `findByCode` foi implementado;
- `findAllActive` foi implementado;
- `countAll` foi implementado;
- parâmetros foram validados;
- `PreparedStatement` foi utilizado;
- SQL Injection permaneceu bloqueada;
- `Optional` representa zero ou um;
- lista vazia representa zero ou muitos;
- lista retornada é imutável;
- `ResultSet` não foi retornado;
- `PreparedStatement` não foi retornado;
- `Connection` não foi retornada;
- uma conexão foi aberta por método;
- recursos foram fechados;
- `Main` não contém SQL;
- `Main` não contém `ResultSet`;
- `Main` apenas compõe e chama;
- regra de negócio não foi colocada no DAO;
- quatro Clientes foram contados;
- Cliente foi encontrado por ID;
- Cliente foi encontrado por código;
- email nulo foi preservado;
- entrada maliciosa retornou vazio;
- Clientes ativos vieram ordenados;
- testes de integração foram criados;
- responsabilidades foram documentadas;
- decisões arquiteturais foram documentadas;
- limitações foram documentadas;
- `SQLException` ainda é propagada conscientemente;
- transação manual não foi criada;
- pool não foi criado;
- DML não foi executado;
- Repository Pattern não foi antecipado;
- JPA e Hibernate não foram antecipados;
- schema `projeto_os_final` permaneceu intacto;
- commit recomendado pode ser realizado;
- diário de bordo está pronto;
- ponte para a aula 316 está correta.

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
  labs/m13/aula-315-dao-inicial-responsabilidade-clara
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): criar dao jdbc inicial para cliente"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
DAO;

responsabilidade de persistência;

SQL encapsulado;

mapper;

retornos independentes;

testes de integração.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você organizou o código JDBC em uma fronteira de acesso a dados.

Aprendeu que um DAO deve:

```text
encapsular SQL;

obter conexão;

parametrizar;

executar;

percorrer ResultSet;

mapear;

fechar recursos;

retornar objetos Java.
```

Também aprendeu o que ele não deve fazer:

```text
imprimir;

tratar HTTP;

decidir regra comercial;

manter conexão global;

controlar transações de vários DAOs;

enviar mensagens;

virar classe genérica sem coesão.
```

Laboratório criou:

```text
Cliente;

ClienteMapper;

ClienteDao;

Main como ponto de composição;

testes de integração.
```

As decisões foram mantidas simples:

```text
DAO concreto;

sem interface artificial;

uma conexão por método;

SQLException propagada;

somente leitura;

sem pool;

sem transação manual.
```

A próxima aula será:

```text
316 - M13.06 - Repository Pattern sem Spring
```

Nela, você vai estudar:

- diferença conceitual entre DAO e Repository;
- linguagem orientada ao domínio;
- contrato de coleção;
- interface de repository;
- implementação JDBC;
- dependência do caso de uso em abstração;
- composição manual sem Spring;
- testes com implementação fake;
- limites entre repository, DAO e service;
- quando não criar repository;
- como evitar uma interface que apenas copia todos os métodos do DAO.

O DAO desta aula será usado como referência de contraste.

---

# Material complementar

## Checkpoint final

- [ ] Criei `ClienteDao` com responsabilidade limitada.
- [ ] Mantive SQL, cursor e conexão fora do `Main`.
- [ ] Retornei objetos, Optional e listas imutáveis.
- [ ] Documentei limites, decisões e responsabilidades.
- [ ] Não antecipei Repository, transações, pool ou CRUD.

---

## Troubleshooting adicional

### Main ainda conhece SQL

Mova a consulta para o DAO e mantenha no `Main` apenas composição e chamada.

### DAO ficou muito grande

Verifique se há consultas de outras entidades, regras comerciais, formatação ou HTTP.

### Optional nunca fica vazio

Teste ID e código inexistentes.

Não invente um objeto vazio.

### Lista retorna null

Retorne lista vazia.

`findAllActive` nunca deve devolver `null`.

### SQLException precisa de mensagem melhor

Registre a necessidade, mas preserve o escopo.

O tratamento será aprofundado na aula 317.

---

## Perguntas de revisao

1. O que significa DAO?
2. Qual é a responsabilidade do `ClienteDao`?
3. O DAO deve imprimir no console?
4. O DAO decide regra comercial?
5. O DAO pode manter uma conexão global?
6. Quem cria o DAO?
7. Por que injetar `ConnectionProvider`?
8. Onde o SQL ficou?
9. Qual é a responsabilidade do mapper?
10. O mapper percorre todas as linhas?
11. Por que não retornar `ResultSet`?
12. Quando usar `Optional`?
13. O que retornar para zero itens em uma lista?
14. Por que a lista é imutável?
15. Por que não criar interface automaticamente?
16. Quantas conexões cada método abre?
17. Duas chamadas formam uma transação?
18. Como a `SQLException` é tratada agora?
19. Repository foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Data Access Object.
2. Encapsular acesso JDBC de Cliente.
3. Não.
4. Não.
5. Não.
6. O ponto de composição.
7. Tornar dependência explícita e substituível.
8. Em constantes privadas do DAO.
9. Transformar linha atual em objeto.
10. Não.
11. Evitar vazamento de recurso e tecnologia.
12. Para zero ou um resultado.
13. Lista vazia.
14. Evitar alteração acidental.
15. Porque abstração precisa de necessidade.
16. Uma.
17. Não.
18. É propagada.
19. Não.
20. Repository Pattern sem Spring.

---

## Desafio opcional

Crie uma classe:

```java
DaoExecutionMetrics
```

Ela deve registrar somente:

```text
operação;

duração;

quantidade de linhas;

sucesso;

SQLState em falha.
```

Não registre:

- SQL completo;
- parâmetros;
- senha;
- documento;
- email.

Adicione um decorador:

```java
ClienteDaoMetrics
```

Não altere o contrato de retorno.

Não use framework de observabilidade.

O objetivo é perceber que métricas são responsabilidade transversal e não precisam ser misturadas ao SQL principal.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 315 - M13.05 - DAO inicial com responsabilidade clara

- Entendi DAO como Data Access Object.
- Criei uma fronteira de acesso JDBC para Cliente.
- Diferenciei DAO de service e controller.
- Mantive regras comerciais fora do DAO.
- Criei o record `Cliente` independente de JDBC.
- Criei `ClienteMapper` para mapear uma linha.
- Mantive o mapper sem conexão e sem SQL.
- Criei `ClienteDao` como classe concreta.
- Evitei criar interface sem necessidade.
- Injetei `ConnectionProvider` pelo construtor.
- Mantive SQL em constantes privadas.
- Implementei `findById`.
- Implementei `findByCode`.
- Implementei `findAllActive`.
- Implementei `countAll`.
- Usei PreparedStatement e parâmetros tipados.
- Retornei `Optional` para zero ou um resultado.
- Retornei lista vazia ou imutável para coleções.
- Não retornei ResultSet, Statement ou Connection.
- Abri e fechei uma conexão por método.
- Mantive SQL e JDBC fora do Main.
- Preservei a proteção contra SQL Injection.
- Documentei responsabilidades e limitações.
- Mantive SQLException propagada para a aula específica.
- Não implementei transações, pool ou DML.
- Preservei `projeto_os_final`.
- Próxima aula: Repository Pattern sem Spring.
```

---

## Referencia tecnica curta

```text
DAO:
objeto de acesso a dados.

Responsabilidade:
persistência coesa.

ConnectionProvider:
origem de conexões.

Mapper:
linha para objeto.

Optional:
zero ou um.

List:
zero ou muitos.

SQL privado:
encapsulamento.

Main:
composition root didático.

Limitação:
uma conexão por método.

Próximo passo:
Repository Pattern.
```

Regra final:

```text
um DAO inicial deve esconder detalhes JDBC, devolver objetos independentes e manter uma responsabilidade pequena, sem absorver regras de negocio, transacoes globais ou abstracoes que pertencem a outras camadas.
```
