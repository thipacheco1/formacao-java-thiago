# 316 - M13.06 - Repository Pattern sem Spring

## Apresentacao da aula

Na aula 315, você criou o primeiro DAO JDBC com responsabilidade clara.

O laboratório anterior separou:

```text
Cliente:
dados independentes de JDBC.

ClienteMapper:
linha atual do ResultSet para Cliente.

ClienteDao:
SQL, parâmetros, cursor e recursos.

Main:
composição e demonstração.
```

Essa organização retirou SQL e `ResultSet` da camada de apresentação.

Entretanto, o código que usa `ClienteDao` ainda depende diretamente de uma classe voltada à persistência.

Considere uma regra de aplicação:

```text
consultar um Cliente pelo código
e decidir se ele está disponível para atendimento.
```

Se a classe responsável pela regra depender diretamente de:

```java
ClienteDao
```

ela passa a conhecer uma escolha de infraestrutura.

O caso de uso sabe que existe um DAO JDBC, mesmo que sua necessidade real seja apenas:

```text
encontrar um Cliente pelo código.
```

Nesta aula, você estudará o Repository Pattern sem Spring.

A palavra repository significa:

```text
repositório.
```

Conceitualmente, um repository apresenta objetos de domínio como se viessem de uma coleção especializada.

O consumidor pede:

```java
clienteRepository.buscarPorCodigo(codigo);
```

Ele não precisa conhecer:

- PostgreSQL;
- JDBC;
- `Connection`;
- DAO;
- SQL;
- tabela;
- mapper;
- `ResultSet`;
- aliases.

A interface será:

```java
ClienteRepository
```

A implementação real será:

```java
JdbcClienteRepository
```

Ela utilizará o DAO da aula anterior:

```java
ClienteDao
```

Fluxo:

```text
caso de uso
    -> ClienteRepository
        -> JdbcClienteRepository
            -> ClienteDao
                -> JDBC
                    -> PostgreSQL.
```

O repository não substituirá o DAO por mudança de nome. A interface define o contrato da aplicação; o adapter JDBC delega ao DAO, que continua responsável pelo acesso técnico e pelo mapper.

Você também criará:

```java
FakeClienteRepository
```

Ele ficará nos testes e armazenará Clientes em memória.

Com isso, o caso de uso poderá ser testado sem:

- Docker;
- PostgreSQL;
- driver;
- variável de ambiente;
- conexão;
- SQL.

A interface agora possui necessidade concreta: o caso de uso depende de um contrato da aplicação, e os testes podem trocar o adapter JDBC por um fake.

O caso de uso será:

```java
ConsultarClienteParaAtendimento
```

Ele aplicará uma decisão simples:

```text
Cliente ausente:
NAO_ENCONTRADO.

Cliente existente e inativo:
INATIVO.

Cliente existente e ativo:
DISPONIVEL.
```

O repository busca; o caso de uso classifica. JDBC não conhece a regra de disponibilidade.

Nesta aula, a interface ainda declarará:

```java
throws SQLException
```

Essa é uma limitação consciente.

Uma abstração de aplicação ideal não deveria depender de uma exceção JDBC.

Mas o tratamento e a tradução de exceções possuem a próxima aula oficial:

```text
317 - M13.07 - Tratamento de excecoes em JDBC.
```

Criar agora uma exceção própria sem aprofundar SQLState, encadeamento e classificação anteciparia o conteúdo.

Portanto, a aula 316 fará duas coisas:

```text
aplicará Repository Pattern corretamente;

registrará a SQLException como vazamento temporário.
```

Não serão introduzidos:

- Spring;
- `@Repository`;
- injeção automática;
- container IoC;
- JPA;
- Spring Data;
- CRUD;
- transação manual;
- pool de conexões;
- tradução definitiva de exceções.

A próxima aula será:

```text
317 - M13.07 - Tratamento de excecoes em JDBC
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

A evolução entre as duas últimas aulas é:

```text
aula 315:
encapsular detalhes JDBC em um DAO.

aula 316:
impedir que o caso de uso dependa do DAO concreto.
```

A pergunta principal agora é:

```text
de qual contrato a regra de aplicação realmente precisa?
```

---

## Objetivo pratico

Você vai criar:

```text
labs/m13/aula-316-repository-pattern-sem-spring
```

Estrutura final:

```text
labs
└── m13
    └── aula-316-repository-pattern-sem-spring
        ├── README.md
        ├── .gitignore
        ├── pom.xml
        ├── config
        │   ├── database.local.env.example
        │   └── database.local.env
        ├── docs
        │   ├── contrato-cliente-repository.md
        │   ├── dao-vs-repository.md
        │   ├── decisoes-arquiteturais.md
        │   ├── porta-e-adaptador.md
        │   └── troubleshooting-repository.md
        ├── scripts
        │   ├── 01_verificar_pre_requisitos.ps1
        │   ├── 02_executar_repository.ps1
        │   └── 03_validar_arquitetura.ps1
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── formacao
            │                   └── m13
            │                       └── aula316
            │                           ├── Main.java
            │                           ├── application
            │                           │   ├── ClienteRepository.java
            │                           │   ├── ConsultaClienteResultado.java
            │                           │   ├── ConsultarClienteParaAtendimento.java
            │                           │   └── ListarClientesAtivos.java
            │                           ├── domain
            │                           │   ├── Cliente.java
            │                           │   └── ClienteCodigo.java
            │                           └── infrastructure
            │                               └── jdbc
            │                                   ├── ClienteDao.java
            │                                   ├── ClienteMapper.java
            │                                   ├── ConnectionProvider.java
            │                                   ├── DatabaseSettings.java
            │                                   ├── DriverManagerConnectionProvider.java
            │                                   └── JdbcClienteRepository.java
            └── test
                └── java
                    └── br
                        └── com
                            └── formacao
                                └── m13
                                    └── aula316
                                        ├── application
                                        │   ├── ConsultarClienteParaAtendimentoTest.java
                                        │   ├── FakeClienteRepository.java
                                        │   └── ListarClientesAtivosTest.java
                                        ├── domain
                                        │   └── ClienteCodigoTest.java
                                        └── infrastructure
                                            └── jdbc
                                                └── JdbcClienteRepositoryIT.java
```

Resultados esperados com PostgreSQL:

```text
CLI-POF-ALFA:
DISPONIVEL.

CLI-POF-GAMA:
DISPONIVEL;
email nulo preservado.

CLI-INEXISTENTE:
NAO_ENCONTRADO.

Clientes ativos:
4;
ordenados por nome e ID.
```

Resultados esperados nos testes unitários com fake:

```text
Cliente ativo:
DISPONIVEL.

Cliente inativo:
INATIVO.

Cliente ausente:
NAO_ENCONTRADO.

nenhuma conexão aberta.
```

---

## Conceito essencial

### O que e Repository Pattern

Repository Pattern oferece à aplicação uma coleção especializada de objetos persistidos. O consumidor pede `buscarPorCodigo` ou `listarAtivos` sem conhecer SQL, tabela, driver ou cursor. O contrato expõe apenas operações necessárias ao sistema.

### Repository, DAO, porta e adaptador

Repository não é DAO renomeado. O DAO permanece orientado à fonte de dados e ao JDBC; o Repository expressa o contrato que a aplicação necessita.

`ClienteRepository` fica em `application` e funciona como porta de saída. `JdbcClienteRepository` fica em `infrastructure` e adapta essa porta ao DAO JDBC. O caso de uso depende da interface; a implementação técnica depende do contrato.

Produção:

```text
caso de uso
    -> ClienteRepository
        -> JdbcClienteRepository
            -> ClienteDao
                -> PostgreSQL.
```

Teste:

```text
caso de uso
    -> FakeClienteRepository
        -> memória.
```

Essa direção aplica inversão de dependência: a aplicação não importa `ClienteDao`, `PreparedStatement`, driver ou PostgreSQL.

### Contrato pequeno

O repository terá somente `buscarPorCodigo` e `listarAtivos`. Não antecipe salvar, excluir, ordenar livremente ou executar SQL. O contrato nasce das necessidades atuais dos casos de uso, não de todas as capacidades do DAO.

### Linguagem do dominio e value object

A interface usa `ClienteCodigo` em vez de `String` solta. O record normaliza, valida formato, limita tamanho e fornece igualdade por valor. Dois códigos equivalentes representam o mesmo conceito do domínio, e a infraestrutura recebe um valor já válido.

### Caso de uso e regra de disponibilidade

`ConsultarClienteParaAtendimento` pede ao repository pelo código e classifica o resultado. Ausência vira `NAO_ENCONTRADO`; Cliente ativo vira `DISPONIVEL`; inativo vira `INATIVO`.

O repository não deve ocultar Clientes inativos, pois o caso de uso precisa diferenciar inatividade de ausência. Persistência encontra objetos; aplicação decide o comportamento.

### Resultado explicito

`ConsultaClienteResultado` combina `Situacao` com `Optional<Cliente>`. `DISPONIVEL` e `INATIVO` exigem Cliente presente; `NAO_ENCONTRADO` exige ausência. O construtor impede combinações inválidas.

### Fake nao e mock

`FakeClienteRepository` é uma implementação funcional em memória. Diferente de um mock, ele executa operações sobre um `Map` sem biblioteca de expectativas, conexão ou SQL.

### Testes, adaptador e escolha arquitetural

O teste unitário usa `FakeClienteRepository` para validar ativo, inativo e ausente sem Docker ou banco. O teste de integração usa `JdbcClienteRepository`, DAO, driver e seed real.

O adaptador JDBC converte `ClienteCodigo` em texto e delega ao DAO, sem duplicar SQL. Manter DAO e adapter separados é útil nesta sequência para comparar responsabilidades; em um projeto pequeno, uma única classe JDBC pode cumprir os dois papéis quando a coesão continuar clara.

### SQLException temporaria

A interface ainda declara `throws SQLException`, vazando JDBC para a aplicação. A escolha é deliberada para não antecipar tradução de erros. A aula 317 removerá esse acoplamento com uma exceção de persistência bem definida.

### Composicao manual

O `Main` monta configurações, provider, DAO, adapter e casos de uso. Nenhum framework faz injeção; as dependências e a implementação escolhida ficam visíveis.

## Mao na massa guiada

### 1. Criar o laboratorio

Na raiz:

```powershell
New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\config"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\docs"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\scripts"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\src\main\java\br\com\formacao\m13\aula316\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\src\main\java\br\com\formacao\m13\aula316\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\src\main\java\br\com\formacao\m13\aula316\infrastructure\jdbc"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\src\test\java\br\com\formacao\m13\aula316\application"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\src\test\java\br\com\formacao\m13\aula316\domain"

New-Item -ItemType Directory -Force `
  -Path "labs\m13\aula-316-repository-pattern-sem-spring\src\test\java\br\com\formacao\m13\aula316\infrastructure\jdbc"

Set-Location `
  "labs\m13\aula-316-repository-pattern-sem-spring"
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
    <artifactId>aula-316-repository-pattern</artifactId>
    <version>1.0.0-SNAPSHOT</version>

    <name>
        Aula 316 - Repository Pattern sem Spring
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
                        br.com.formacao.m13.aula316.Main
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
JDBC_APPLICATION_NAME=aula-316-repository
JDBC_LOGIN_TIMEOUT_SECONDS=5
JDBC_CONNECT_TIMEOUT_SECONDS=5
JDBC_SOCKET_TIMEOUT_SECONDS=10
```

Copie para:

```text
config/database.local.env
```

O arquivo real permanece ignorado.

---

### 5. Reutilizar infraestrutura da aula 315

Copie e ajuste os packages:

```text
DatabaseSettings;

ConnectionProvider;

DriverManagerConnectionProvider;

ClienteMapper;

ClienteDao.
```

Destino:

```text
infrastructure/jdbc.
```

Ajustes:

```java
package br.com.formacao.m13.aula316.infrastructure.jdbc;
```

`ClienteMapper` deve importar:

```java
br.com.formacao.m13.aula316.domain.Cliente;
```

`ClienteDao` também deve usar o `Cliente` do pacote `domain`.

Mantenha apenas os métodos necessários:

```text
findByCode;

findAllActive.
```

Não copie `findById` e `countAll` sem necessidade do contrato atual.

---

### 6. Criar Cliente.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/domain/Cliente.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.domain;

import java.time.OffsetDateTime;

public record Cliente(
        long id,
        ClienteCodigo codigo,
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

        if (codigo == null) {
            throw new IllegalArgumentException(
                    "codigo é obrigatório"
            );
        }

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

A diferença para a aula 315 é:

```text
codigo agora é ClienteCodigo.
```

---

### 7. Criar ClienteCodigo.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/domain/ClienteCodigo.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.domain;

import java.util.Locale;
import java.util.regex.Pattern;

public record ClienteCodigo(
        String valor
) {

    private static final Pattern FORMAT =
            Pattern.compile(
                    "CLI-[A-Z0-9-]{1,46}"
            );

    public ClienteCodigo {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(
                    "Código do Cliente é obrigatório"
            );
        }

        valor = valor
                .trim()
                .toUpperCase(Locale.ROOT);

        if (valor.length() > 50) {
            throw new IllegalArgumentException(
                    "Código do Cliente excede "
                            + "50 caracteres"
            );
        }

        if (!FORMAT.matcher(valor).matches()) {
            throw new IllegalArgumentException(
                    "Código do Cliente inválido: "
                            + valor
            );
        }
    }
}
```

Uma entrada em minúsculas será normalizada.

---

### 8. Ajustar ClienteMapper.java

O mapper deve construir o value object:

```java
new ClienteCodigo(
        resultSet.getString(
                "cliente_codigo"
        )
)
```

Conteúdo central:

```java
return new Cliente(
        resultSet.getLong("cliente_id"),
        new ClienteCodigo(
                resultSet.getString(
                        "cliente_codigo"
                )
        ),
        resultSet.getString("cliente_nome"),
        resultSet.getString(
                "cliente_documento"
        ),
        resultSet.getString("cliente_email"),
        resultSet.getBoolean("cliente_ativo"),
        resultSet.getObject(
                "cliente_criado_em",
                OffsetDateTime.class
        ),
        resultSet.getObject(
                "cliente_atualizado_em",
                OffsetDateTime.class
        )
);
```

---

### 9. Criar ClienteRepository.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/application/ClienteRepository.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.application;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import br.com.formacao.m13.aula316.domain.Cliente;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;

public interface ClienteRepository {

    Optional<Cliente> buscarPorCodigo(
            ClienteCodigo codigo
    ) throws SQLException;

    List<Cliente> listarAtivos(
            int limite
    ) throws SQLException;
}
```

---

### 10. Criar JdbcClienteRepository.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/infrastructure/jdbc/JdbcClienteRepository.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.infrastructure.jdbc;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import br.com.formacao.m13.aula316.application.ClienteRepository;
import br.com.formacao.m13.aula316.domain.Cliente;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;

public final class JdbcClienteRepository
        implements ClienteRepository {

    private final ClienteDao clienteDao;

    public JdbcClienteRepository(
            ClienteDao clienteDao
    ) {
        this.clienteDao =
                Objects.requireNonNull(
                        clienteDao,
                        "clienteDao é obrigatório"
                );
    }

    @Override
    public Optional<Cliente> buscarPorCodigo(
            ClienteCodigo codigo
    ) throws SQLException {
        Objects.requireNonNull(
                codigo,
                "codigo é obrigatório"
        );

        return clienteDao.findByCode(
                codigo.valor()
        );
    }

    @Override
    public List<Cliente> listarAtivos(
            int limite
    ) throws SQLException {
        if (limite < 1 || limite > 100) {
            throw new IllegalArgumentException(
                    "limite deve estar "
                            + "entre 1 e 100"
            );
        }

        return clienteDao.findAllActive(
                limite
        );
    }
}
```

Nenhum SQL foi repetido.

---

### 11. Criar ConsultaClienteResultado.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/application/ConsultaClienteResultado.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.application;

import java.util.Optional;

import br.com.formacao.m13.aula316.domain.Cliente;

public record ConsultaClienteResultado(
        Situacao situacao,
        Optional<Cliente> cliente
) {

    public enum Situacao {
        DISPONIVEL,
        INATIVO,
        NAO_ENCONTRADO
    }

    public ConsultaClienteResultado {
        if (situacao == null) {
            throw new IllegalArgumentException(
                    "situacao é obrigatória"
            );
        }

        if (cliente == null) {
            throw new IllegalArgumentException(
                    "cliente é obrigatório"
            );
        }

        boolean exigeCliente =
                situacao == Situacao.DISPONIVEL
                || situacao == Situacao.INATIVO;

        if (exigeCliente && cliente.isEmpty()) {
            throw new IllegalArgumentException(
                    "Situação exige Cliente"
            );
        }

        if (
            situacao == Situacao.NAO_ENCONTRADO
            && cliente.isPresent()
        ) {
            throw new IllegalArgumentException(
                    "Cliente não pode estar presente"
            );
        }
    }

    public static ConsultaClienteResultado disponivel(
            Cliente cliente
    ) {
        return new ConsultaClienteResultado(
                Situacao.DISPONIVEL,
                Optional.of(cliente)
        );
    }

    public static ConsultaClienteResultado inativo(
            Cliente cliente
    ) {
        return new ConsultaClienteResultado(
                Situacao.INATIVO,
                Optional.of(cliente)
        );
    }

    public static ConsultaClienteResultado naoEncontrado() {
        return new ConsultaClienteResultado(
                Situacao.NAO_ENCONTRADO,
                Optional.empty()
        );
    }
}
```

---

### 12. Criar ConsultarClienteParaAtendimento.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/application/ConsultarClienteParaAtendimento.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.application;

import java.sql.SQLException;
import java.util.Objects;

import br.com.formacao.m13.aula316.domain.Cliente;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;

public final class ConsultarClienteParaAtendimento {

    private final ClienteRepository repository;

    public ConsultarClienteParaAtendimento(
            ClienteRepository repository
    ) {
        this.repository =
                Objects.requireNonNull(
                        repository,
                        "repository é obrigatório"
                );
    }

    public ConsultaClienteResultado executar(
            ClienteCodigo codigo
    ) throws SQLException {
        Objects.requireNonNull(
                codigo,
                "codigo é obrigatório"
        );

        return repository
                .buscarPorCodigo(codigo)
                .map(
                        ConsultarClienteParaAtendimento
                                ::classificar
                )
                .orElseGet(
                        ConsultaClienteResultado
                                ::naoEncontrado
                );
    }

    private static ConsultaClienteResultado classificar(
            Cliente cliente
    ) {
        if (cliente.ativo()) {
            return ConsultaClienteResultado
                    .disponivel(cliente);
        }

        return ConsultaClienteResultado
                .inativo(cliente);
    }
}
```

O caso de uso depende somente de `ClienteRepository`.

---

### 13. Criar ListarClientesAtivos.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/application/ListarClientesAtivos.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.application;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;

import br.com.formacao.m13.aula316.domain.Cliente;

public final class ListarClientesAtivos {

    private final ClienteRepository repository;

    public ListarClientesAtivos(
            ClienteRepository repository
    ) {
        this.repository =
                Objects.requireNonNull(
                        repository,
                        "repository é obrigatório"
                );
    }

    public List<Cliente> executar(
            int limite
    ) throws SQLException {
        if (limite < 1 || limite > 100) {
            throw new IllegalArgumentException(
                    "limite deve estar "
                            + "entre 1 e 100"
            );
        }

        List<Cliente> clientes =
                repository.listarAtivos(
                        limite
                );

        if (clientes.stream().anyMatch(
                cliente -> !cliente.ativo()
        )) {
            throw new IllegalStateException(
                    "Repository devolveu "
                            + "Cliente inativo"
            );
        }

        return List.copyOf(clientes);
    }
}
```

O caso de uso valida o contrato recebido.

---

### 14. Criar Main.java

Crie:

```text
src/main/java/br/com/formacao/m13/aula316/Main.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316;

import java.sql.SQLException;

import br.com.formacao.m13.aula316.application.ClienteRepository;
import br.com.formacao.m13.aula316.application.ConsultaClienteResultado;
import br.com.formacao.m13.aula316.application.ConsultarClienteParaAtendimento;
import br.com.formacao.m13.aula316.application.ListarClientesAtivos;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;
import br.com.formacao.m13.aula316.infrastructure.jdbc.ClienteDao;
import br.com.formacao.m13.aula316.infrastructure.jdbc.ConnectionProvider;
import br.com.formacao.m13.aula316.infrastructure.jdbc.DatabaseSettings;
import br.com.formacao.m13.aula316.infrastructure.jdbc.DriverManagerConnectionProvider;
import br.com.formacao.m13.aula316.infrastructure.jdbc.JdbcClienteRepository;

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

            ClienteRepository repository =
                    new JdbcClienteRepository(
                            clienteDao
                    );

            ConsultarClienteParaAtendimento consulta =
                    new ConsultarClienteParaAtendimento(
                            repository
                    );

            ListarClientesAtivos listagem =
                    new ListarClientesAtivos(
                            repository
                    );

            executarConsulta(
                    consulta,
                    new ClienteCodigo(
                            "CLI-POF-ALFA"
                    )
            );

            executarConsulta(
                    consulta,
                    new ClienteCodigo(
                            "CLI-POF-GAMA"
                    )
            );

            executarConsulta(
                    consulta,
                    new ClienteCodigo(
                            "CLI-INEXISTENTE"
                    )
            );

            System.out.println();
            System.out.println(
                    "=== Clientes ativos ==="
            );

            var clientes =
                    listagem.executar(20);

            System.out.printf(
                    "quantidade: %d%n",
                    clientes.size()
            );

            clientes.forEach(cliente ->
                    System.out.printf(
                            "%s | %s | email=%s%n",
                            cliente.codigo().valor(),
                            cliente.nome(),
                            cliente.email()
                    )
            );
        } catch (SQLException exception) {
            System.err.println(
                    "Falha JDBC temporariamente "
                            + "visível na aplicação."
            );
            System.err.println(
                    "SQLState: "
                            + exception.getSQLState()
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

    private static void executarConsulta(
            ConsultarClienteParaAtendimento consulta,
            ClienteCodigo codigo
    ) throws SQLException {
        ConsultaClienteResultado resultado =
                consulta.executar(codigo);

        System.out.println();
        System.out.printf(
                "=== %s ===%n",
                codigo.valor()
        );
        System.out.printf(
                "situação: %s%n",
                resultado.situacao()
        );

        resultado.cliente().ifPresent(cliente ->
                System.out.printf(
                        "Cliente: %s | ativo=%s%n",
                        cliente.nome(),
                        cliente.ativo()
                )
        );
    }
}
```

---

### 15. Criar FakeClienteRepository.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula316/application/FakeClienteRepository.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.application;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import br.com.formacao.m13.aula316.domain.Cliente;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;

final class FakeClienteRepository
        implements ClienteRepository {

    private final Map<ClienteCodigo, Cliente> data =
            new LinkedHashMap<>();

    void adicionar(
            Cliente cliente
    ) {
        data.put(
                cliente.codigo(),
                cliente
        );
    }

    @Override
    public Optional<Cliente> buscarPorCodigo(
            ClienteCodigo codigo
    ) {
        return Optional.ofNullable(
                data.get(codigo)
        );
    }

    @Override
    public List<Cliente> listarAtivos(
            int limite
    ) {
        return data.values()
                .stream()
                .filter(Cliente::ativo)
                .sorted(
                        Comparator
                                .comparing(
                                        Cliente::nome
                                )
                                .thenComparingLong(
                                        Cliente::id
                                )
                )
                .limit(limite)
                .toList();
    }
}
```

O fake não importa `java.sql`.

A interface declara a exceção, mas a implementação pode omitir.

---

### 16. Criar ConsultarClienteParaAtendimentoTest.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula316/application/ConsultarClienteParaAtendimentoTest.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.OffsetDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.com.formacao.m13.aula316.domain.Cliente;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;

class ConsultarClienteParaAtendimentoTest {

    private FakeClienteRepository repository;
    private ConsultarClienteParaAtendimento useCase;

    @BeforeEach
    void setUp() {
        repository =
                new FakeClienteRepository();

        useCase =
                new ConsultarClienteParaAtendimento(
                        repository
                );

        repository.adicionar(
                cliente(
                        1L,
                        "CLI-ATIVO",
                        "Cliente Ativo",
                        true
                )
        );

        repository.adicionar(
                cliente(
                        2L,
                        "CLI-INATIVO",
                        "Cliente Inativo",
                        false
                )
        );
    }

    @Test
    void shouldClassifyActiveClientAsAvailable()
            throws Exception {
        ConsultaClienteResultado result =
                useCase.executar(
                        new ClienteCodigo(
                                "cli-ativo"
                        )
                );

        assertEquals(
                ConsultaClienteResultado
                        .Situacao.DISPONIVEL,
                result.situacao()
        );
        assertTrue(
                result.cliente().isPresent()
        );
    }

    @Test
    void shouldClassifyInactiveClient()
            throws Exception {
        ConsultaClienteResultado result =
                useCase.executar(
                        new ClienteCodigo(
                                "CLI-INATIVO"
                        )
                );

        assertEquals(
                ConsultaClienteResultado
                        .Situacao.INATIVO,
                result.situacao()
        );
    }

    @Test
    void shouldClassifyMissingClient()
            throws Exception {
        ConsultaClienteResultado result =
                useCase.executar(
                        new ClienteCodigo(
                                "CLI-AUSENTE"
                        )
                );

        assertEquals(
                ConsultaClienteResultado
                        .Situacao.NAO_ENCONTRADO,
                result.situacao()
        );
        assertTrue(
                result.cliente().isEmpty()
        );
    }

    private static Cliente cliente(
            long id,
            String codigo,
            String nome,
            boolean ativo
    ) {
        OffsetDateTime now =
                OffsetDateTime.parse(
                        "2026-07-10T10:00:00-03:00"
                );

        return new Cliente(
                id,
                new ClienteCodigo(codigo),
                nome,
                "DOC-" + id,
                null,
                ativo,
                now,
                now
        );
    }
}
```

Esses testes não usam PostgreSQL.

---

### 17. Criar ListarClientesAtivosTest.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula316/application/ListarClientesAtivosTest.java
```

Teste:

- fake com dois ativos e um inativo;
- somente ativos retornados;
- ordem por nome;
- limite respeitado;
- lista imutável;
- limite zero rejeitado.

Use o mesmo método auxiliar de criação ou uma fixture local clara.

---

### 18. Criar ClienteCodigoTest.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula316/domain/ClienteCodigoTest.java
```

Casos:

```text
normaliza minúsculas;

remove espaços externos;

aceita código válido;

rejeita null;

rejeita vazio;

rejeita prefixo diferente;

rejeita caractere inválido;

rejeita mais de 50 caracteres;

dois códigos iguais possuem igualdade.
```

Exemplo:

```java
assertEquals(
        new ClienteCodigo("CLI-POF-ALFA"),
        new ClienteCodigo(" cli-pof-alfa ")
);
```

---

### 19. Criar JdbcClienteRepositoryIT.java

Crie:

```text
src/test/java/br/com/formacao/m13/aula316/infrastructure/jdbc/JdbcClienteRepositoryIT.java
```

Conteúdo:

```java
package br.com.formacao.m13.aula316.infrastructure.jdbc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import br.com.formacao.m13.aula316.application.ClienteRepository;
import br.com.formacao.m13.aula316.domain.Cliente;
import br.com.formacao.m13.aula316.domain.ClienteCodigo;

class JdbcClienteRepositoryIT {

    private static ClienteRepository repository;

    @BeforeAll
    static void setUp() {
        DatabaseSettings settings =
                DatabaseSettings.fromEnvironment();

        ConnectionProvider provider =
                new DriverManagerConnectionProvider(
                        settings
                );

        repository =
                new JdbcClienteRepository(
                        new ClienteDao(provider)
                );
    }

    @Test
    void shouldFindClientByDomainCode()
            throws Exception {
        Optional<Cliente> result =
                repository.buscarPorCodigo(
                        new ClienteCodigo(
                                "cli-pof-alfa"
                        )
                );

        Cliente cliente =
                result.orElseThrow();

        assertEquals(
                307001L,
                cliente.id()
        );
        assertEquals(
                "CLI-POF-ALFA",
                cliente.codigo().valor()
        );
    }

    @Test
    void shouldPreserveNullableEmail()
            throws Exception {
        Cliente cliente =
                repository.buscarPorCodigo(
                        new ClienteCodigo(
                                "CLI-POF-GAMA"
                        )
                )
                .orElseThrow();

        assertNull(cliente.email());
    }

    @Test
    void shouldReturnEmptyForUnknownCode()
            throws Exception {
        Optional<Cliente> result =
                repository.buscarPorCodigo(
                        new ClienteCodigo(
                                "CLI-INEXISTENTE"
                        )
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldListFourActiveClients()
            throws Exception {
        List<Cliente> clientes =
                repository.listarAtivos(20);

        assertEquals(4, clientes.size());
        assertTrue(
                clientes.stream()
                        .allMatch(Cliente::ativo)
        );
    }
}
```

---

### 20. Criar scripts

Em:

```text
scripts/01_verificar_pre_requisitos.ps1
```

valide:

- Java;
- Maven;
- container;
- tabela Cliente;
- quatro registros;
- schema `projeto_os_final`.

Em:

```text
scripts/02_executar_repository.ps1
```

carregue o arquivo local e execute:

```powershell
mvn clean test
mvn verify
mvn exec:java
```

Remova as variáveis JDBC no `finally`.

---

### 21. Criar 03_validar_arquitetura.ps1

Crie:

```text
scripts/03_validar_arquitetura.ps1
```

Conteúdo:

```powershell
$ErrorActionPreference = "Stop"

$application = Get-ChildItem `
    ".\src\main\java\br\com\formacao\m13\aula316\application" `
    -Recurse `
    -Filter "*.java"

$domain = Get-ChildItem `
    ".\src\main\java\br\com\formacao\m13\aula316\domain" `
    -Recurse `
    -Filter "*.java"

$infrastructure = Get-ChildItem `
    ".\src\main\java\br\com\formacao\m13\aula316\infrastructure" `
    -Recurse `
    -Filter "*.java"

$forbiddenDomain = $domain |
    Select-String `
        -Pattern (
            "java\.sql|"
            + "jdbc|"
            + "ClienteDao|"
            + "JdbcClienteRepository"
        )

if ($forbiddenDomain) {
    throw "Domínio depende de infraestrutura."
}

$forbiddenApplication = $application |
    Select-String `
        -Pattern (
            "ClienteDao|"
            + "DriverManager|"
            + "PreparedStatement|"
            + "ResultSet|"
            + "org\.postgresql"
        )

if ($forbiddenApplication) {
    throw "Aplicação depende de implementação JDBC."
}

$requiredInfrastructure = $infrastructure |
    Select-String `
        -SimpleMatch `
        -Pattern "implements ClienteRepository"

if (-not $requiredInfrastructure) {
    throw "Adaptador JDBC não implementa a porta."
}

$spring = Get-ChildItem `
    ".\src" `
    -Recurse `
    -Filter "*.java" |
    Select-String `
        -Pattern (
            "org\.springframework|"
            + "@Repository|"
            + "@Autowired"
        )

if ($spring) {
    throw "Spring foi antecipado."
}

Write-Host "Arquitetura da aula 316 validada."
```

---

### 22. Executar o laboratorio

Execute:

```powershell
.\scripts\01_verificar_pre_requisitos.ps1
.\scripts\02_executar_repository.ps1
.\scripts\03_validar_arquitetura.ps1
```

Confirme:

```text
testes unitários passam sem banco;

testes de integração usam PostgreSQL;

Cliente ativo fica DISPONIVEL;

fake permite Cliente INATIVO;

ausente fica NAO_ENCONTRADO;

quatro Clientes ativos são listados;

camada application não conhece DAO;

camada domain não conhece JDBC;

nenhum Spring.
```

---

### 23. Criar documentacao arquitetural

Crie:

```text
docs/dao-vs-repository.md;
docs/porta-e-adaptador.md;
docs/contrato-cliente-repository.md;
docs/decisoes-arquiteturais.md.
```

Registre diferenças entre DAO e Repository, direção das dependências, contrato dos dois métodos, produção versus fake, decisões, limitações e a dívida de `SQLException`. Inclua a conclusão de que padrões devem reduzir acoplamento real, não apenas aumentar arquivos.

### 27. Criar troubleshooting-repository.md

Inclua:

#### Caso de uso importa ClienteDao

A dependência está invertida incorretamente.

Use `ClienteRepository`.

#### Repository contém SQL

Verifique se a classe é a interface ou o adaptador JDBC.

A interface não contém SQL.

#### Fake abre conexão

Ele deixou de ser fake em memória.

Use coleção Java.

#### Regra de ativo está no DAO

Mova a classificação para o caso de uso.

#### Interface copia todos os métodos do DAO

Revise quais operações a aplicação realmente precisa.

#### SQLException vazou

É uma dívida esperada somente nesta aula.

Será corrigida na aula 317.

---

## Entendendo o que foi feito

### O caso de uso depende de contrato

`ConsultarClienteParaAtendimento` recebe `ClienteRepository`.

Ele não importa classes JDBC.

---

### O adaptador real reutiliza o DAO

`JdbcClienteRepository` converte tipos de domínio e delega o acesso técnico.

SQL não foi duplicado.

---

### O fake removeu infraestrutura dos testes

Ativo, inativo e ausente foram testados em memória.

Nenhuma variável JDBC foi necessária.

---

### A regra permaneceu na aplicacao

O repository encontra o Cliente.

O caso de uso classifica a situação.

---

### A limitacao ficou explicita

`SQLException` ainda aparece na porta.

A aula 317 corrigirá a fronteira de erro.

---

## Erros comuns importantes

### Criar repository que aceita SQL

Isso destrói a abstração.

### Colocar @Repository sem Spring

A anotação nem pertence ao projeto atual.

### Duplicar SQL no adapter

Reutilize o DAO ou concentre a implementação em uma única classe.

### Fazer fake depender de PostgreSQL

Fake deve funcionar em memória.

### Colocar regra comercial no repository

O repository fornece objetos; o caso de uso decide.

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

### Validacao arquitetural

```powershell
.\scripts\03_validar_arquitetura.ps1
```

---

## Exercicio guiado

### Parte 1 — Resultado inativo

Use o fake para cadastrar um Cliente inativo.

Confirme:

```text
repository encontra;

caso de uso retorna INATIVO;

resultado contém Cliente.
```

Explique por que filtrar no repository perderia informação.

---

### Parte 2 — Fake com duplicidade

Tente adicionar dois Clientes com o mesmo `ClienteCodigo`.

Decida o contrato:

```text
substituir;

rejeitar.
```

Para o exercício, rejeite com `IllegalStateException`.

Adicione teste.

---

### Parte 3 — Repository minimo

Compare os métodos do `ClienteDao` da aula 315 com a interface atual.

Liste quais não foram expostos.

Explique por que repository não precisa espelhar toda capacidade técnica.

---

### Parte 4 — Implementacao sem DAO

Em uma branch de exercício, crie uma versão de `JdbcClienteRepository` com SQL direto.

Compare:

- quantidade de classes;
- repetição;
- coesão;
- testabilidade;
- legibilidade.

Não mantenha duas implementações JDBC no commit final.

Registre a decisão em documentação.

---

### Parte 5 — Outro adaptador em memoria

Mova uma implementação em memória para `src/main` somente como experimento.

Componha o `Main` sem PostgreSQL.

Depois remova do código principal.

Explique diferença entre fake de teste e implementação real alternativa.

---

### Parte 6 — Novo caso de uso

Crie:

```java
ContarClientesDisponiveis
```

Evite adicionar `count` ao repository imediatamente.

Primeiro use `listarAtivos(100)` e registre a limitação.

Depois discuta quando uma contagem dedicada seria necessária por performance e volume.

Não altere o contrato sem justificativa.

---

### Parte 7 — ProdutoRepository

Crie:

```text
ProdutoCodigo;

Produto;

ProdutoRepository;

JdbcProdutoRepository;

FakeProdutoRepository;

ConsultarProdutoAtivo.
```

Requisitos:

- sem Spring;
- interface em application;
- domínio sem JDBC;
- adapter em infrastructure;
- testes unitários com fake;
- teste de integração com PostgreSQL;
- sem CRUD.

---

### Parte 8 — Dependencias proibidas

Amplie o script para falhar quando:

```text
domain importa application;

domain importa infrastructure;

application importa infrastructure;

fake importa infrastructure JDBC.
```

Documente a direção permitida.

---

## Criterios de aceite

- o arquivo e o H1 seguem a grade oficial;
- o laboratório oficial da aula 316 existe;
- a continuidade com a aula 315 foi preservada;
- projeto Maven usa Java 21;
- driver PostgreSQL permanece fixado;
- configuração real está fora do Git;
- pacotes domain, application e infrastructure existem;
- `ClienteCodigo` foi criado;
- código é normalizado;
- formato inválido é rejeitado;
- `Cliente` usa `ClienteCodigo`;
- domínio não importa JDBC;
- `ClienteRepository` foi criado;
- interface fica na camada application;
- contrato possui apenas operações necessárias;
- repository não aceita SQL;
- repository não retorna ResultSet;
- `JdbcClienteRepository` implementa a interface;
- adaptador JDBC fica em infrastructure;
- adaptador reutiliza `ClienteDao`;
- SQL não foi duplicado;
- `ClienteDao` permanece detalhe técnico;
- `ConsultarClienteParaAtendimento` depende da interface;
- caso de uso não importa DAO;
- caso de uso não importa driver;
- ativo retorna DISPONIVEL;
- inativo retorna INATIVO;
- ausente retorna NAO_ENCONTRADO;
- `ConsultaClienteResultado` evita estado inválido;
- `ListarClientesAtivos` foi criado;
- lista de ativos é validada;
- `FakeClienteRepository` foi criado;
- fake usa coleção em memória;
- fake não abre conexão;
- testes unitários não precisam do PostgreSQL;
- teste de integração valida adapter JDBC;
- quatro Clientes ativos são retornados;
- email nulo é preservado;
- código inexistente retorna vazio;
- composição manual foi realizada;
- `Main` escolhe implementação concreta;
- nenhuma anotação Spring existe;
- nenhum container de injeção foi usado;
- Repository não foi confundido com DAO renomeado;
- quando não usar o padrão foi documentado;
- `SQLException` temporária foi registrada;
- tratamento da exceção não foi antecipado;
- transações não foram antecipadas;
- pool não foi antecipado;
- DML não foi executado;
- JPA e Spring Data não foram antecipados;
- schema `projeto_os_final` permaneceu intacto;
- commit recomendado pode ser realizado;
- diário de bordo está pronto;
- ponte para a aula 317 está correta.

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
  labs/m13/aula-316-repository-pattern-sem-spring
```

Confira:

```powershell
git status
```

Commit recomendado:

```powershell
git commit -m "feat(m13): aplicar repository pattern sem spring"
```

Valide:

```powershell
git log -1 --oneline
```

O commit representa:

```text
Repository Pattern;

porta;

adaptador JDBC;

fake em memória;

caso de uso;

inversão de dependência;

composição manual.
```

---

## Fechamento e ponte para a proxima aula

Nesta aula, você criou uma abstração de persistência orientada à aplicação.

Aprendeu que:

```text
DAO encapsula acesso técnico;

Repository oferece contrato para casos de uso;

Repository não é DAO renomeado;

a interface pertence ao lado consumidor;

JDBC implementa a porta;

fake implementa a mesma porta em testes;

caso de uso depende da abstração;

regra de negócio fica fora do adapter;

Spring não é necessário para aplicar o padrão.
```

O fluxo final ficou:

```text
Main
    -> caso de uso
        -> ClienteRepository
            -> JdbcClienteRepository
                -> ClienteDao
                    -> PostgreSQL.
```

Nos testes:

```text
caso de uso
    -> FakeClienteRepository
        -> memória.
```

O laboratório também identificou uma dívida:

```text
ClienteRepository ainda declara SQLException.
```

Isso impede que a interface seja completamente independente de JDBC.

A próxima aula será:

```text
317 - M13.07 - Tratamento de excecoes em JDBC
```

Nela, você vai estudar:

- anatomia de `SQLException`;
- SQLState;
- código do fornecedor;
- exceções encadeadas;
- classificação de falhas;
- mensagem técnica e mensagem segura;
- tradução de exceção;
- exceção de persistência;
- preservação da causa;
- fronteira entre infraestrutura e aplicação;
- remoção de `SQLException` da interface;
- testes de tradução;
- falhas de conexão, integridade e SQL.

A interface criada nesta aula será evoluída sem alterar os casos de uso.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei DAO e Repository.
- [ ] Criei porta na application e adapter JDBC na infrastructure.
- [ ] Testei caso de uso com fake, sem banco.
- [ ] Mantive regra de status fora da persistência.
- [ ] Registrei `SQLException` como dívida para a aula 317.

---

## Troubleshooting adicional

### Caso de uso nao compila sem JDBC

Verifique imports concretos.

A dependência deve ser `ClienteRepository`.

### Teste unitario pede variaveis de ambiente

O teste está usando adapter JDBC em vez do fake.

### Fake retorna inativos em listarAtivos

Corrija o contrato da implementação em memória.

### Adapter possui regra de atendimento

Mova a classificação para o caso de uso.

### Muitas interfaces sem consumidor

Revise se existe realmente uma porta necessária.

---

## Perguntas de revisao

1. O que é Repository Pattern?
2. Repository é apenas DAO renomeado?
3. Quem define a interface?
4. Onde fica `ClienteRepository`?
5. Onde fica `JdbcClienteRepository`?
6. O que é uma porta?
7. O que é um adaptador?
8. Quem depende da abstração?
9. O domínio conhece JDBC?
10. O caso de uso conhece DAO?
11. Para que serve o fake?
12. Fake é igual a mock?
13. Onde fica a regra de Cliente ativo?
14. Por que usar `ClienteCodigo`?
15. Repository deve copiar todo DAO?
16. Quando o padrão pode ser excesso?
17. Spring é necessário?
18. Qual dívida permanece?
19. Quem corrigirá essa dívida?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Abstração de acesso a objetos persistidos.
2. Não.
3. O lado da aplicação que consome.
4. Na camada application.
5. Na infraestrutura JDBC.
6. Contrato exigido pela aplicação.
7. Implementação que conecta tecnologia à porta.
8. O caso de uso.
9. Não.
10. Não.
11. Testar comportamento sem infraestrutura.
12. Não.
13. No caso de uso.
14. Representar e validar o valor de domínio.
15. Não.
16. Quando não reduz acoplamento real.
17. Não.
18. `SQLException` na interface.
19. A aula 317.
20. Tratamento de exceções em JDBC.

---

## Desafio opcional

Crie uma segunda implementação:

```java
CachedClienteRepository
```

Ela deve decorar outro `ClienteRepository`.

Regras:

- cache somente por `ClienteCodigo`;
- `Map` em memória;
- delegar quando não houver valor;
- não armazenar ausência;
- não alterar `listarAtivos`;
- sem biblioteca externa;
- sem TTL;
- testes com fake;
- documentar limitação.

Não use esse cache em produção.

Invalidação e concorrência não fazem parte desta aula.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 316 - M13.06 - Repository Pattern sem Spring

- Diferenciei DAO e Repository Pattern.
- Entendi que Repository não é apenas um DAO renomeado.
- Criei os pacotes domain, application e infrastructure.
- Mantive o domínio sem dependência de JDBC.
- Criei o value object `ClienteCodigo`.
- Normalizei e validei códigos de Cliente.
- Criei a interface `ClienteRepository` na aplicação.
- Mantive o contrato pequeno e orientado ao consumidor.
- Criei `JdbcClienteRepository` como adaptador.
- Reutilizei `ClienteDao` sem duplicar SQL.
- Mantive o DAO como detalhe técnico.
- Criei `ConsultarClienteParaAtendimento`.
- Mantive a regra de ativo fora do repository.
- Modelei os resultados DISPONIVEL, INATIVO e NAO_ENCONTRADO.
- Criei `ListarClientesAtivos`.
- Criei `FakeClienteRepository` para testes.
- Testei casos de uso sem PostgreSQL.
- Diferenciei fake de mock.
- Criei teste de integração do adaptador JDBC.
- Fiz composição manual no `Main`.
- Não usei Spring nem anotações.
- Documentei quando Repository ajuda e quando pode ser excesso.
- Registrei `SQLException` na interface como dívida temporária.
- Não antecipei tradução de exceções, transações, pool ou CRUD.
- Preservei `projeto_os_final`.
- Próxima aula: tratamento de exceções em JDBC.
```

---

## Referencia tecnica curta

```text
Repository:
contrato orientado à aplicação.

DAO:
acesso técnico aos dados.

Porta:
interface necessária ao consumidor.

Adaptador:
implementação da porta.

JdbcClienteRepository:
adaptador real.

FakeClienteRepository:
adaptador de teste.

Caso de uso:
regra de aplicação.

Dependency Inversion:
aplicação depende de abstração.

Spring:
não necessário.

Dívida:
SQLException temporária.
```

Regra final:

```text
Repository Pattern produz valor quando a aplicacao define um contrato pequeno, a infraestrutura o implementa e os casos de uso podem ser testados sem conhecer banco, SQL ou framework.
```
