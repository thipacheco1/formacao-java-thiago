# 266 — M11.22 — Testcontainers com PostgreSQL: testes de integração reais e descartáveis

## 1. Objetivo da aula

Na aula 265, você estudou segurança de dependências e supply chain.

Você trabalhou com:

```text
dependência direta;
dependência transitiva;
SCA;
SBOM;
CycloneDX;
Dependabot;
Dependency Review;
CVE;
severidade;
falso positivo;
mvn dependency:tree;
artifact de SBOM;
supply chain em Java Backend.
```

Agora vamos voltar para testes, mas em outro nível.

Até aqui, você já escreveu muitos testes unitários.

Testes unitários são fundamentais, mas nem tudo deve ser testado com mock.

Há cenários em que você precisa de um serviço real.

Exemplo:

```text
PostgreSQL real;
Redis real;
RabbitMQ real;
Kafka real;
serviço HTTP fake;
browser real;
container de infraestrutura.
```

Nesta aula, vamos estudar:

```text
Testcontainers com PostgreSQL.
```

Testcontainers permite subir containers descartáveis durante os testes.

A ideia é:

```text
o teste inicia um PostgreSQL real em Docker;
executa código Java contra esse banco real;
valida comportamento;
ao final, o container é descartado.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Testcontainers resolve;
diferenciar teste unitário, integração fake e integração real;
entender por que mock não substitui banco em todos os casos;
configurar Testcontainers com JUnit 5;
subir PostgreSQL descartável para teste;
criar schema no banco durante o teste;
inserir dados com JDBC;
consultar dados com JDBC;
validar comportamento real;
entender lifecycle de container;
entender @Testcontainers e @Container;
usar PostgreSQLContainer;
obter JDBC URL, usuário e senha do container;
rodar teste localmente;
entender requisitos de Docker;
integrar Testcontainers ao GitHub Actions;
diagnosticar erros comuns;
preparar base para JDBC, JPA, Spring Boot e testes de integração profissionais.
```

Esta aula continua o M11.

Ainda não vamos iniciar o módulo SQL completo.

Ainda não vamos entrar em Spring Boot.

Vamos usar SQL mínimo apenas para validar o teste com PostgreSQL.

O foco é ferramenta profissional de teste.

---

## 2. Onde estamos na formação

Estamos no módulo:

```text
M11 — Ferramentas essenciais do Java Backend profissional
```

A sequência atual é:

```text
260 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes e healthcheck
261 — CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos
262 — Pipeline Maven com testes, JaCoCo, relatórios e artefatos
263 — Pipeline Docker: build, tags, registry, secrets e imagem versionada
264 — Checkstyle, Spotless e formatação automatizada com critério
265 — Segurança de dependências: SCA, SBOM, Dependabot e supply chain
266 — Testcontainers com PostgreSQL
267 — WireMock
268 — ArchUnit
269 — Mini-projeto ferramentas
270 — Fechamento do M11
```

A aula 266 fecha uma lacuna muito importante.

Você já sabe:

```text
subir PostgreSQL com Docker Compose;
rodar pipeline;
testar com JUnit;
usar Maven;
usar Docker.
```

Agora vamos juntar isso em um cenário de teste real.

A pergunta desta aula é:

```text
como testar código Java contra um PostgreSQL real sem depender de banco instalado manualmente na máquina?
```

Resposta:

```text
Testcontainers.
```

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-266-testcontainers-postgresql
```

E o workflow:

```text
.github/workflows/aula-266-testcontainers-postgresql.yml
```

A estrutura será:

```text
.github
└── workflows
    └── aula-266-testcontainers-postgresql.yml

labs
└── m11
    └── aula-266-testcontainers-postgresql
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula266
            │                       ├── OrdemServico.java
            │                       └── OrdemServicoRepositoryJdbc.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula266
                                    └── OrdemServicoRepositoryJdbcIT.java
```

O laboratório terá:

```text
record OrdemServico;
repository JDBC simples;
teste de integração com PostgreSQL real;
container descartável;
schema criado no teste;
dados inseridos no teste;
consulta validada no teste;
workflow rodando no GitHub Actions.
```

A classe de teste terá sufixo:

```text
IT
```

De:

```text
Integration Test
```

Exemplo:

```text
OrdemServicoRepositoryJdbcIT.java
```

Isso ajuda a diferenciar teste unitário de teste de integração.

---

## 4. Conceitos essenciais antes da prática

### 4.1 Teste unitário

Teste unitário valida uma unidade pequena do código.

Normalmente:

```text
não sobe banco;
não sobe rede;
não depende de arquivo externo;
não depende de serviço real;
é rápido;
é isolado;
testa regra de negócio ou comportamento de uma classe.
```

Exemplo:

```text
calcular frete;
validar CPF;
normalizar texto;
aplicar regra de desconto;
gerar status.
```

Teste unitário é indispensável.

Mas ele não prova tudo.

---

### 4.2 Teste de integração

Teste de integração valida a comunicação entre partes.

Exemplos:

```text
Java + PostgreSQL;
Java + Redis;
Java + API externa fake;
Repository + banco;
mensagem + broker;
controller + camada de serviço;
serviço + cliente HTTP.
```

O foco é responder:

```text
essas partes funcionam juntas?
```

Nesta aula, vamos testar:

```text
Java + PostgreSQL real.
```

---

### 4.3 Mock não é banco

Mock é útil.

Mas mock não se comporta como banco real.

Um mock não valida:

```text
SQL real;
tipo de coluna;
constraint;
índice;
transação;
erro de conexão;
conversão de tipo;
nome de tabela;
nome de coluna;
driver JDBC;
dialeto PostgreSQL;
comportamento real do banco.
```

Exemplo:

```java
when(repository.buscarPorCodigo("OS-001")).thenReturn(...)
```

Isso testa o código que usa o repository, mas não testa se o repository conversa corretamente com o PostgreSQL.

Para isso, você precisa de integração real.

---

### 4.4 O problema do banco compartilhado de teste

Antes de Testcontainers, era comum usar:

```text
banco local instalado;
banco de teste compartilhado;
banco em servidor de homologação;
schema reaproveitado;
dados manuais.
```

Isso cria problemas:

```text
teste depende da máquina;
teste depende de estado anterior;
um dev quebra dado do outro;
pipeline precisa de banco configurado;
teste passa local e falha no CI;
dados ficam sujos;
reset é manual;
ambiente é frágil.
```

Testcontainers resolve boa parte disso com containers descartáveis.

---

### 4.5 O que é Testcontainers

Testcontainers é uma biblioteca Java para testes que sobe containers Docker durante a execução dos testes.

Ela é integrada com frameworks como JUnit.

Com Testcontainers, você pode usar containers descartáveis para:

```text
PostgreSQL;
MySQL;
MariaDB;
MongoDB;
Redis;
RabbitMQ;
Kafka;
Selenium;
serviços HTTP;
containers genéricos.
```

Nesta aula, vamos usar:

```text
PostgreSQLContainer.
```

A documentação oficial descreve Testcontainers como uma biblioteca Java que suporta testes JUnit fornecendo instâncias leves e descartáveis de bancos, navegadores e outros serviços que possam rodar em container.

---

### 4.6 O que significa descartável

Descartável significa:

```text
o container nasce para o teste;
o teste usa;
ao final, o container pode ser removido.
```

Isso ajuda a garantir:

```text
ambiente limpo;
reprodutibilidade;
menos dependência manual;
menos conflito entre devs;
menos sujeira de dados;
pipeline mais confiável.
```

Em vez de depender de um PostgreSQL instalado, o teste sobe o seu PostgreSQL.

---

### 4.7 Testcontainers exige Docker

Testcontainers precisa de um runtime de container.

Na prática, você precisa de Docker ou ambiente compatível.

Localmente:

```text
Docker Desktop;
Docker Engine;
Colima;
Rancher Desktop;
Podman compatível, dependendo da configuração.
```

No GitHub Actions com runner Ubuntu, Docker normalmente já está disponível.

Nesta aula, vamos usar GitHub Actions com:

```yaml
runs-on: ubuntu-latest
```

---

### 4.8 @Testcontainers e @Container

Com JUnit 5, Testcontainers usa anotações como:

```java
@Testcontainers
```

e:

```java
@Container
```

`@Testcontainers` ativa a integração com JUnit Jupiter.

`@Container` indica que aquele container será gerenciado pelo ciclo de vida do teste.

Exemplo:

```java
@Testcontainers
class MeuTesteIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");
}
```

A integração JUnit 5 do Testcontainers é disponibilizada em um módulo separado chamado `junit-jupiter`.

---

### 4.9 Container por classe vs por método

Você pode ter container:

```text
estático;
não estático.
```

Container estático:

```java
static PostgreSQLContainer<?> postgres = ...
```

Normalmente é iniciado uma vez para a classe de teste.

Container não estático:

```java
PostgreSQLContainer<?> postgres = ...
```

Pode ser reiniciado com mais frequência, dependendo do ciclo de vida.

Nesta aula, vamos usar container estático para reduzir tempo.

Mas vamos limpar dados entre testes quando necessário.

---

### 4.10 JDBC URL dinâmica

Quando Testcontainers sobe PostgreSQL, ele escolhe porta dinâmica.

Você não deve assumir:

```text
localhost:5432
```

Em vez disso, você pergunta ao container:

```java
postgres.getJdbcUrl()
postgres.getUsername()
postgres.getPassword()
```

Isso é muito importante.

O teste não precisa saber a porta real.

O Testcontainers fornece.

---

### 4.11 Teste de integração não substitui teste unitário

Testcontainers é poderoso, mas não deve ser usado para tudo.

Teste com container é mais lento que teste unitário.

Use para validar integração real.

Exemplos bons:

```text
repository JDBC;
JPA repository;
migration;
query específica de PostgreSQL;
constraint;
transação.
```

Exemplos ruins:

```text
testar if simples;
testar cálculo puro;
testar formatação de texto;
testar regra que não depende de infraestrutura.
```

Regra profissional:

```text
teste unitário valida lógica isolada;
teste de integração valida contrato com infraestrutura real.
```

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-266-testcontainers-postgresql
cd labs\m11\aula-266-testcontainers-postgresql

mkdir src\main\java\br\com\curso\aula266
mkdir src\test\java\br\com\curso\aula266
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-266-testcontainers-postgresql/src/main/java/br/com/curso/aula266
mkdir -p labs/m11/aula-266-testcontainers-postgresql/src/test/java/br/com/curso/aula266
cd labs/m11/aula-266-testcontainers-postgresql
```

---

### 5.2 Criar o pom.xml

Crie:

```text
pom.xml
```

Conteúdo:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula-266-testcontainers-postgresql</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <postgresql.version>42.7.3</postgresql.version>
        <testcontainers.version>1.21.4</testcontainers.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.testcontainers</groupId>
                <artifactId>testcontainers-bom</artifactId>
                <version>${testcontainers.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>${assertj.version}</version>
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
    </dependencies>

    <build>
        <finalName>aula-266-testcontainers-postgresql</finalName>

        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>21</release>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                        <include>**/*IT.java</include>
                    </includes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

Observação:

```text
A versão 1.21.4 dos módulos Testcontainers foi confirmada no Maven Central no momento da criação desta aula.
```

Em projeto real, antes de fixar versão, confira a versão mais atual e a política do time.

---

### 5.3 Entender dependências do pom.xml

Temos o driver PostgreSQL:

```xml
<artifactId>postgresql</artifactId>
```

Ele permite Java conversar com PostgreSQL via JDBC.

Temos JUnit e AssertJ:

```text
JUnit:
framework de teste.

AssertJ:
assertions mais expressivas.
```

Temos Testcontainers:

```text
junit-jupiter:
integração com JUnit 5.

postgresql:
módulo específico para PostgreSQLContainer.
```

E usamos o BOM:

```xml
<artifactId>testcontainers-bom</artifactId>
```

BOM significa:

```text
Bill of Materials
```

No Maven, um BOM ajuda a centralizar versões compatíveis de um conjunto de dependências.

Assim você define:

```text
testcontainers.version
```

uma vez e não precisa repetir a versão em cada módulo Testcontainers.

---

### 5.4 Criar o record OrdemServico

Crie:

```text
src/main/java/br/com/curso/aula266/OrdemServico.java
```

Conteúdo:

```java
package br.com.curso.aula266;

import java.math.BigDecimal;
import java.util.Objects;

public record OrdemServico(
        Long id,
        String codigo,
        String cliente,
        String status,
        BigDecimal valor
) {
    public OrdemServico {
        Objects.requireNonNull(codigo, "codigo não pode ser nulo");
        Objects.requireNonNull(cliente, "cliente não pode ser nulo");
        Objects.requireNonNull(status, "status não pode ser nulo");
        Objects.requireNonNull(valor, "valor não pode ser nulo");

        if (codigo.isBlank()) {
            throw new IllegalArgumentException("codigo não pode ser vazio");
        }

        if (cliente.isBlank()) {
            throw new IllegalArgumentException("cliente não pode ser vazio");
        }

        if (status.isBlank()) {
            throw new IllegalArgumentException("status não pode ser vazio");
        }

        if (valor.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("valor não pode ser negativo");
        }
    }

    public OrdemServico semId() {
        return new OrdemServico(null, codigo, cliente, status, valor);
    }
}
```

Esse record representa uma ordem de serviço simples.

Ainda não estamos modelando domínio profundamente.

O foco é integração com PostgreSQL.

---

### 5.5 Criar repository JDBC

Crie:

```text
src/main/java/br/com/curso/aula266/OrdemServicoRepositoryJdbc.java
```

Conteúdo:

```java
package br.com.curso.aula266;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;

public class OrdemServicoRepositoryJdbc {

    private final DataSource dataSource;

    public OrdemServicoRepositoryJdbc(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void criarTabela() {
        String sql = """
                create table if not exists ordem_servico (
                    id bigserial primary key,
                    codigo varchar(50) not null unique,
                    cliente varchar(120) not null,
                    status varchar(40) not null,
                    valor numeric(12, 2) not null
                )
                """;

        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute(sql);
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao criar tabela ordem_servico", exception);
        }
    }

    public OrdemServico salvar(OrdemServico ordemServico) {
        String sql = """
                insert into ordem_servico (codigo, cliente, status, valor)
                values (?, ?, ?, ?)
                returning id
                """;

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, ordemServico.codigo());
            statement.setString(2, ordemServico.cliente());
            statement.setString(3, ordemServico.status());
            statement.setBigDecimal(4, ordemServico.valor());

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    Long id = resultSet.getLong("id");

                    return new OrdemServico(
                            id,
                            ordemServico.codigo(),
                            ordemServico.cliente(),
                            ordemServico.status(),
                            ordemServico.valor()
                    );
                }

                throw new IllegalStateException("Insert não retornou id");
            }
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao salvar ordem de serviço", exception);
        }
    }

    public Optional<OrdemServico> buscarPorCodigo(String codigo) {
        String sql = """
                select id, codigo, cliente, status, valor
                from ordem_servico
                where codigo = ?
                """;

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, codigo);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return Optional.of(mapear(resultSet));
                }

                return Optional.empty();
            }
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao buscar ordem de serviço por código", exception);
        }
    }

    public int contar() {
        String sql = "select count(*) from ordem_servico";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            resultSet.next();

            return resultSet.getInt(1);
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao contar ordens de serviço", exception);
        }
    }

    public void limpar() {
        String sql = "delete from ordem_servico";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.executeUpdate();
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao limpar ordens de serviço", exception);
        }
    }

    private OrdemServico mapear(ResultSet resultSet) throws SQLException {
        return new OrdemServico(
                resultSet.getLong("id"),
                resultSet.getString("codigo"),
                resultSet.getString("cliente"),
                resultSet.getString("status"),
                resultSet.getBigDecimal("valor")
        );
    }
}
```

Esse repository usa JDBC puro.

Não estamos usando Spring.

Não estamos usando JPA.

Isso é intencional.

Queremos ver a integração real com PostgreSQL de forma explícita.

---

### 5.6 Criar teste de integração com Testcontainers

Crie:

```text
src/test/java/br/com/curso/aula266/OrdemServicoRepositoryJdbcIT.java
```

Conteúdo:

```java
package br.com.curso.aula266;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.postgresql.ds.PGSimpleDataSource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DisplayName("OrdemServicoRepositoryJdbc com PostgreSQL real")
class OrdemServicoRepositoryJdbcIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("aula266")
            .withUsername("aula266")
            .withPassword("aula266");

    private OrdemServicoRepositoryJdbc repository;

    @BeforeEach
    void setUp() {
        repository = new OrdemServicoRepositoryJdbc(criarDataSource());
        repository.criarTabela();
        repository.limpar();
    }

    @Test
    @DisplayName("deve salvar e buscar ordem de serviço por código")
    void deveSalvarEBuscarOrdemServicoPorCodigo() {
        OrdemServico ordemServico = new OrdemServico(
                null,
                "OS-266-001",
                "Cliente Testcontainers",
                "ABERTA",
                new BigDecimal("199.90")
        );

        OrdemServico salva = repository.salvar(ordemServico);

        Optional<OrdemServico> encontrada = repository.buscarPorCodigo("OS-266-001");

        assertThat(salva.id()).isNotNull();
        assertThat(encontrada).isPresent();
        assertThat(encontrada.get().codigo()).isEqualTo("OS-266-001");
        assertThat(encontrada.get().cliente()).isEqualTo("Cliente Testcontainers");
        assertThat(encontrada.get().status()).isEqualTo("ABERTA");
        assertThat(encontrada.get().valor()).isEqualByComparingTo("199.90");
    }

    @Test
    @DisplayName("deve retornar vazio quando código não existir")
    void deveRetornarVazioQuandoCodigoNaoExistir() {
        Optional<OrdemServico> encontrada = repository.buscarPorCodigo("OS-INEXISTENTE");

        assertThat(encontrada).isEmpty();
    }

    @Test
    @DisplayName("deve contar ordens de serviço salvas")
    void deveContarOrdensServicoSalvas() {
        repository.salvar(new OrdemServico(
                null,
                "OS-266-002",
                "Cliente A",
                "ABERTA",
                new BigDecimal("100.00")
        ));

        repository.salvar(new OrdemServico(
                null,
                "OS-266-003",
                "Cliente B",
                "CONCLUIDA",
                new BigDecimal("250.00")
        ));

        int total = repository.contar();

        assertThat(total).isEqualTo(2);
    }

    private DataSource criarDataSource() {
        PGSimpleDataSource dataSource = new PGSimpleDataSource();
        dataSource.setURL(postgres.getJdbcUrl());
        dataSource.setUser(postgres.getUsername());
        dataSource.setPassword(postgres.getPassword());

        return dataSource;
    }
}
```

Esse é o coração da aula.

Aqui o teste sobe um PostgreSQL real e testa SQL real.

---

### 5.7 Entender o teste por partes

#### @Testcontainers

```java
@Testcontainers
```

Ativa a integração Testcontainers com JUnit 5.

---

#### @Container

```java
@Container
static PostgreSQLContainer<?> postgres = ...
```

Diz ao Testcontainers que esse container deve ser gerenciado no ciclo de vida do teste.

Como está `static`, o container é compartilhado pela classe.

---

#### PostgreSQLContainer

```java
new PostgreSQLContainer<>("postgres:16-alpine")
```

Define a imagem Docker usada no teste.

Estamos usando:

```text
postgres:16-alpine
```

É uma imagem menor baseada em Alpine.

Em projeto real, o time pode padronizar uma versão específica conforme ambiente.

---

#### withDatabaseName, withUsername e withPassword

```java
.withDatabaseName("aula266")
.withUsername("aula266")
.withPassword("aula266")
```

Configura o banco inicial do container.

Esses dados são do laboratório.

Não são credenciais reais.

---

#### getJdbcUrl

```java
postgres.getJdbcUrl()
```

Retorna a URL JDBC real do container.

A porta será dinâmica.

Não assuma 5432.

---

#### setUp

```java
@BeforeEach
void setUp() {
    repository = new OrdemServicoRepositoryJdbc(criarDataSource());
    repository.criarTabela();
    repository.limpar();
}
```

Antes de cada teste:

```text
criamos repository;
garantimos tabela;
limpamos dados.
```

Isso reduz interferência entre testes.

---

### 5.8 Rodar os testes localmente

Antes de rodar, confirme se Docker está ativo.

Teste:

```powershell
docker version
```

Agora rode:

```powershell
mvn clean test
```

Na primeira execução, pode demorar mais, porque o Docker precisa baixar imagem:

```text
postgres:16-alpine
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se quiser ver containers durante a execução, em outro terminal rode:

```powershell
docker ps
```

O container pode aparecer rapidamente e depois sumir.

---

### 5.9 Ver logs e comportamento

Se o teste falhar, rode:

```powershell
mvn test -DtrimStackTrace=false
```

Também confira se Docker está rodando:

```powershell
docker ps
```

Erros comuns incluem:

```text
Docker não está ativo;
imagem não baixou;
porta bloqueada;
sem permissão para acessar Docker;
internet indisponível para baixar imagem;
teste falhou por SQL;
driver PostgreSQL ausente.
```

---

### 5.10 Criar workflow para Testcontainers

Volte para a raiz do repositório.

No PowerShell:

```powershell
cd ..\..\..
```

Crie a pasta:

```powershell
mkdir .github
mkdir .github\workflows
```

No Linux/macOS:

```bash
mkdir -p .github/workflows
```

Crie:

```text
.github/workflows/aula-266-testcontainers-postgresql.yml
```

Conteúdo:

```yaml
name: Aula 266 - Testcontainers PostgreSQL

on:
  push:
    branches:
      - main
      - develop
      - "feature/**"
  pull_request:
    branches:
      - main
      - develop
  workflow_dispatch:

permissions:
  contents: read

jobs:
  testcontainers-postgresql:
    name: Testes de integração com PostgreSQL real
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-266-testcontainers-postgresql

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Configurar Java 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Verificar Docker disponível
        run: |
          docker version
          docker info

      - name: Exibir versões Java e Maven
        run: |
          java -version
          mvn -version

      - name: Rodar testes de integração com Testcontainers
        run: mvn -B clean test

      - name: Publicar relatórios Surefire
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-266-surefire-reports
          path: labs/m11/aula-266-testcontainers-postgresql/target/surefire-reports
          if-no-files-found: error
```

Esse workflow valida se os testes com PostgreSQL real rodam no GitHub Actions.

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que usar JDBC puro nesta aula

Poderíamos usar Spring Boot.

Mas isso quebraria a ordem do curso.

Spring Boot começa no M14.

Aqui usamos JDBC puro porque:

```text
mostra a integração real com banco;
não esconde conexão;
não depende de framework;
reforça fundamentos;
prepara o módulo de persistência;
mantém foco em Testcontainers.
```

Quando chegarmos em Spring Boot, essa base será reaproveitada.

---

### 6.2 Por que o teste cria a tabela

O teste executa:

```java
repository.criarTabela();
```

Isso garante que o schema existe.

Em projeto real, poderíamos usar:

```text
Flyway;
Liquibase;
scripts SQL;
migrations da aplicação;
schema gerenciado pelo teste.
```

Ainda não estudamos Flyway profundamente.

Então criamos a tabela direto para manter o laboratório focado.

Mais tarde, testes de integração podem subir banco e rodar migrations reais.

---

### 6.3 Por que limpar dados antes de cada teste

Usamos:

```java
repository.limpar();
```

em `@BeforeEach`.

Objetivo:

```text
cada teste começa com estado previsível.
```

Sem isso, um teste poderia interferir no outro.

Exemplo:

```text
teste A insere OS;
teste B conta registros;
teste B falha porque encontrou dado do A.
```

Teste confiável precisa controlar estado.

---

### 6.4 Por que não fixar porta

Não usamos:

```text
localhost:5432
```

Usamos:

```java
postgres.getJdbcUrl()
```

Porque Testcontainers pode mapear PostgreSQL para uma porta aleatória no host.

Isso evita conflito com:

```text
PostgreSQL local;
Docker Compose;
outros testes;
outros containers;
outros projetos.
```

Porta dinâmica é uma vantagem.

---

### 6.5 Por que usar container estático

O container está definido como:

```java
static PostgreSQLContainer<?> postgres
```

Isso permite compartilhar o container entre testes da classe.

Vantagem:

```text
menos tempo de execução.
```

Cuidado:

```text
você precisa controlar limpeza de dados.
```

Se cada teste precisar de isolamento absoluto por container, é possível usar outro ciclo de vida, mas fica mais lento.

---

### 6.6 Por que rodar Testcontainers no CI

Se você só roda Testcontainers localmente, ainda falta evidência.

No pipeline, você prova que:

```text
o teste sobe container;
PostgreSQL real funciona;
SQL está correto;
driver está correto;
ambiente limpo passa;
não depende da sua máquina.
```

Isso aumenta confiança no PR.

---

### 6.7 Testcontainers vs Docker Compose

Docker Compose da aula 260 sobe stack local para desenvolvimento.

Testcontainers sobe container para teste automatizado.

Resumo:

```text
Docker Compose:
ambiente local manual/controlado pelo dev.

Testcontainers:
infraestrutura descartável controlada pelo teste.
```

Os dois usam Docker, mas têm objetivos diferentes.

---

### 6.8 Quando usar Testcontainers

Use Testcontainers quando quiser validar integração real com infraestrutura.

Exemplos:

```text
repository JDBC;
JPA repository;
migration Flyway;
query específica de PostgreSQL;
constraint;
transação;
integração com Redis;
integração com RabbitMQ;
contrato com Kafka;
serviço HTTP fake em container.
```

Evite Testcontainers para:

```text
regra pura;
cálculo simples;
validação de string;
método sem infraestrutura;
teste que deveria ser unitário.
```

---

### 6.9 Custo de Testcontainers

Testcontainers é mais pesado que teste unitário.

Ele pode exigir:

```text
Docker ativo;
download de imagem;
tempo de inicialização;
mais recursos de máquina;
configuração do CI.
```

Por isso, use com critério.

Uma boa suíte tem camadas:

```text
muitos testes unitários rápidos;
alguns testes de integração importantes;
poucos testes end-to-end mais caros.
```

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Docker não está rodando

Erro típico:

```text
Could not find a valid Docker environment
```

Solução:

```powershell
docker version
docker ps
```

Se falhar:

```text
abra Docker Desktop;
verifique Docker Engine;
reinicie Docker;
confirme permissões.
```

No CI, verifique se o runner suporta Docker.

---

### 7.2 Imagem não baixa

Erro pode ocorrer por:

```text
sem internet;
Docker Hub indisponível;
proxy corporativo;
rate limit;
nome de imagem errado.
```

Imagem usada:

```text
postgres:16-alpine
```

Tente localmente:

```powershell
docker pull postgres:16-alpine
```

---

### 7.3 Teste demora na primeira execução

Isso é normal.

Na primeira vez, Docker precisa baixar a imagem.

Depois, a imagem fica em cache local.

No CI, dependendo do runner, a imagem pode ser baixada novamente.

---

### 7.4 SQL falha no PostgreSQL real

O erro pode estar no SQL.

Exemplo:

```text
nome de coluna errado;
tipo incompatível;
constraint violada;
tabela não existe;
syntax error.
```

Veja stack trace.

Rode com:

```powershell
mvn test -DtrimStackTrace=false
```

Teste de integração revela erro que mock não revelaria.

Isso é bom.

---

### 7.5 Driver PostgreSQL ausente

Erro típico:

```text
No suitable driver found
```

Verifique se o POM tem:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

Sem driver, Java não conversa com PostgreSQL.

---

### 7.6 Teste passa sozinho, mas falha com a classe inteira

Causa comum:

```text
estado compartilhado entre testes.
```

Solução:

```text
limpar dados no @BeforeEach;
usar transação com rollback;
recriar schema;
usar dados únicos por teste.
```

Nesta aula usamos:

```java
repository.limpar();
```

---

### 7.7 Porta 5432 ocupada

Com Testcontainers isso normalmente não importa.

Ele usa porta dinâmica.

Se você estiver tentando acessar manualmente 5432, está indo contra a ideia.

Use:

```java
postgres.getJdbcUrl()
```

---

### 7.8 Pipeline falha no GitHub Actions

Abra logs.

Confira steps:

```text
Verificar Docker disponível;
Exibir versões Java e Maven;
Rodar testes de integração.
```

Se Docker não estiver disponível, o primeiro step mostra.

Se Maven falhar, veja o surefire report publicado como artifact.

---

### 7.9 Uso incorreto de latest

Evite usar imagem solta:

```text
postgres:latest
```

Prefira versão explícita:

```text
postgres:16-alpine
```

Isso ajuda reprodutibilidade.

Em empresa, a versão pode seguir padrão corporativo.

---

## 8. Exercício prático principal

### Missão

Criar teste de integração real e descartável com PostgreSQL usando Testcontainers.

Você deve criar:

```text
labs/m11/aula-266-testcontainers-postgresql
.github/workflows/aula-266-testcontainers-postgresql.yml
```

O projeto deve conter:

```text
pom.xml;
OrdemServico.java;
OrdemServicoRepositoryJdbc.java;
OrdemServicoRepositoryJdbcIT.java.
```

O teste deve:

```text
subir PostgreSQL com Testcontainers;
criar tabela;
limpar dados antes de cada teste;
salvar ordem de serviço;
buscar ordem por código;
contar registros;
validar comportamento com AssertJ.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21;
verificar Docker disponível;
rodar mvn clean test;
publicar relatórios Surefire.
```

---

### Roteiro local

Dentro do laboratório:

```powershell
docker version
mvn clean test
```

Se quiser ver logs completos:

```powershell
mvn test -DtrimStackTrace=false
```

Se quiser conferir imagens:

```powershell
docker images
```

Se quiser observar containers durante execução:

```powershell
docker ps
```

---

### Roteiro no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-266-testcontainers-postgresql
git add .github/workflows/aula-266-testcontainers-postgresql.yml
git commit -m "Aula 266: testcontainers com postgresql"
git push
```

Depois no GitHub:

```text
Actions;
Aula 266 - Testcontainers PostgreSQL;
abrir execução;
verificar Docker disponível;
verificar testes;
baixar surefire reports se necessário.
```

---

### Critérios de aceite

A aula está concluída quando:

```text
Docker está rodando localmente;
mvn clean test passa;
PostgreSQLContainer sobe corretamente;
tabela é criada no teste;
dados são inseridos no PostgreSQL real;
busca por código funciona;
contagem funciona;
teste usa JDBC URL dinâmica do container;
workflow roda no GitHub Actions;
pipeline publica relatórios Surefire;
você entende quando usar Testcontainers;
você entende quando não usar Testcontainers.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. Qual diferença entre teste unitário e teste de integração?
2. Por que mock não substitui banco real em todos os casos?
3. Qual problema Testcontainers resolve?
4. O que significa container descartável?
5. O que é PostgreSQLContainer?
6. Para que serve @Testcontainers?
7. Para que serve @Container?
8. Por que usamos postgres.getJdbcUrl()?
9. Por que não assumimos localhost:5432?
10. Por que limpar dados antes de cada teste?
11. Por que container estático pode ser mais rápido?
12. Qual custo de usar Testcontainers?
13. Quando usar Testcontainers?
14. Quando evitar Testcontainers?
15. Qual diferença entre Docker Compose e Testcontainers?
16. O que fazer quando Docker não está rodando?
17. Como rodar Testcontainers no GitHub Actions?
18. Por que publicar Surefire reports?
19. Como isso prepara JDBC, JPA e Spring Boot?
20. Como isso melhora confiança no pipeline?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 266.
[ ] Configurei Testcontainers no pom.xml.
[ ] Configurei driver PostgreSQL.
[ ] Criei record OrdemServico.
[ ] Criei repository JDBC.
[ ] Criei teste IT.
[ ] Usei @Testcontainers.
[ ] Usei @Container.
[ ] Usei PostgreSQLContainer.
[ ] Usei getJdbcUrl, getUsername e getPassword.
[ ] Criei tabela durante o teste.
[ ] Limpei dados antes de cada teste.
[ ] Rodei mvn clean test local.
[ ] Criei workflow da aula 266.
[ ] Rodei no GitHub Actions.
[ ] Entendi quando usar Testcontainers.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a usar Testcontainers com PostgreSQL.

Você estudou:

```text
teste unitário;
teste de integração;
limites de mock;
banco real em teste;
container descartável;
Testcontainers;
JUnit 5 integration;
@Testcontainers;
@Container;
PostgreSQLContainer;
JDBC URL dinâmica;
DataSource;
repository JDBC;
schema criado no teste;
limpeza de dados;
execução local;
execução no GitHub Actions;
troubleshooting com Docker;
diferença entre Docker Compose e Testcontainers.
```

A ideia principal é:

```text
Testcontainers permite validar integração real com infraestrutura sem depender de ambiente manual compartilhado.
```

Isso aumenta muito a confiabilidade dos testes de backend.

Você agora consegue testar uma camada de persistência contra PostgreSQL real, de forma automatizada e descartável.

Isso será importante quando estudarmos:

```text
JDBC;
JPA;
Hibernate;
Spring Data;
Spring Boot;
migrations;
testes de integração;
pipeline profissional.
```

Na próxima aula, vamos sair do banco e olhar para outro tipo de integração comum:

```text
serviços HTTP externos.
```

A próxima aula será:

```text
267 — M11.23 — WireMock, contratos HTTP e serviços externos fake
```

Nela, vamos estudar:

```text
por que não testar chamando API externa real;
como simular serviço HTTP;
como criar stubs;
como validar request;
como responder JSON fake;
como preparar integração com sistemas externos;
como isso aparece em backend corporativo.
```

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL completo.

Vamos continuar fechando ferramentas profissionais do M11.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-266-testcontainers-postgresql
git add .github/workflows/aula-266-testcontainers-postgresql.yml
git commit -m "Aula 266: testcontainers com postgresql"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-266-testcontainers-postgresql
git add labs/m11/aula-266-testcontainers-postgresql
git add .github/workflows/aula-266-testcontainers-postgresql.yml
git commit -m "Aula 266: testcontainers com postgresql"
git push -u origin feature/aula-266-testcontainers-postgresql
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 266 — M11.22 — Testcontainers com PostgreSQL: testes de integração reais e descartáveis

Nesta aula, aprendi a usar Testcontainers para criar testes de integração com PostgreSQL real e descartável.

Criei o laboratório `labs/m11/aula-266-testcontainers-postgresql`, configurei Maven com Java 21, driver PostgreSQL, JUnit 5, AssertJ e Testcontainers.

Implementei um `OrdemServicoRepositoryJdbc` usando JDBC puro e escrevi um teste de integração `OrdemServicoRepositoryJdbcIT` com `@Testcontainers`, `@Container` e `PostgreSQLContainer`.

Aprendi a usar `getJdbcUrl()`, `getUsername()` e `getPassword()` para conectar no banco criado dinamicamente pelo Testcontainers, sem depender de `localhost:5432`.

Também entendi a diferença entre teste unitário e teste de integração, os limites de mocks, o papel de containers descartáveis, a importância de limpar dados entre testes e como rodar esse tipo de teste no GitHub Actions.

O principal aprendizado foi que Testcontainers permite validar integrações reais com infraestrutura sem depender de banco manual instalado, ambiente compartilhado ou dados sujos.
```

---

## Referências oficiais consultadas

Esta aula foi elaborada considerando a documentação oficial do Testcontainers para Java e do módulo PostgreSQL.

Pontos importantes utilizados:

```text
Testcontainers é uma biblioteca Java para testes JUnit que fornece instâncias descartáveis de bancos, navegadores e outros serviços em containers;
a integração com JUnit 5 usa o módulo junit-jupiter;
o módulo PostgreSQL fornece PostgreSQLContainer;
PostgreSQLContainer fornece JDBC URL, usuário e senha dinâmicos para conexão durante o teste;
os artefatos org.testcontainers:junit-jupiter e org.testcontainers:postgresql estão disponíveis no Maven Central.
```
