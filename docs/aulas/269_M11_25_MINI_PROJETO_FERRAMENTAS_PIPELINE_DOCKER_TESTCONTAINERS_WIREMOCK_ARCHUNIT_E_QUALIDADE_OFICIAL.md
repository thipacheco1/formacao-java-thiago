# 269 — M11.25 — Mini-projeto ferramentas: pipeline, Docker, Testcontainers, WireMock, ArchUnit e qualidade

## 1. Objetivo da aula

Na aula 268, você estudou ArchUnit.

Você aprendeu a transformar decisões arquiteturais em testes automatizados, protegendo:

```text
pacotes;
camadas;
dependências;
nomes;
fluxo arquitetural;
ausência de ciclos;
domínio contra acoplamento indevido;
controller contra acesso direto ao repository.
```

Agora vamos fazer uma aula diferente.

Esta aula é um mini-projeto de consolidação.

O objetivo não é introduzir uma ferramenta nova.

O objetivo é juntar as principais ferramentas do M11 em um único projeto pequeno, realista e controlado.

Até aqui, no M11, você estudou:

```text
Maven;
Gradle;
Git profissional;
JUnit;
Mockito;
AssertJ;
TDD;
JaCoCo;
SonarQube introdutório;
Docker;
Docker Compose;
PostgreSQL;
Redis;
GitHub Actions;
pipeline Maven;
pipeline Docker;
Checkstyle;
Spotless;
SCA;
SBOM;
Dependabot;
Testcontainers;
WireMock;
ArchUnit.
```

Nesta aula, vamos integrar parte desse conjunto.

Ao final desta aula, você deve conseguir:

```text
criar um mini-projeto Java Backend sem Spring Boot ainda;
organizar pacotes em camadas simples;
implementar regra de domínio;
implementar repository JDBC;
implementar cliente HTTP externo;
testar regra de negócio com teste unitário;
testar PostgreSQL real com Testcontainers;
testar serviço HTTP externo fake com WireMock;
proteger arquitetura com ArchUnit;
medir cobertura com JaCoCo;
validar formatação com Spotless;
validar estilo com Checkstyle;
gerar SBOM com CycloneDX;
criar Dockerfile multi-stage;
criar .dockerignore;
criar pipeline GitHub Actions integrando tudo;
publicar relatórios e artifacts;
entender como essas ferramentas se conectam em um fluxo profissional.
```

Esta aula continua o M11.

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar o módulo SQL completo.

Ainda não vamos criar arquitetura hexagonal formal.

O objetivo é consolidar ferramentas.

A próxima aula será:

```text
270 — M11.26 — Fechamento do M11 e transição para SQL, PostgreSQL e modelagem relacional
```

---

## 2. Onde estamos na formação

Estamos no módulo:

```text
M11 — Ferramentas essenciais do Java Backend profissional
```

A sequência final do módulo é:

```text
260 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes e healthcheck
261 — CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos
262 — Pipeline Maven com testes, JaCoCo, relatórios e artefatos
263 — Pipeline Docker: build, tags, registry, secrets e imagem versionada
264 — Checkstyle, Spotless e formatação automatizada com critério
265 — Segurança de dependências: SCA, SBOM, Dependabot e supply chain
266 — Testcontainers com PostgreSQL
267 — WireMock, contratos HTTP e serviços externos fake
268 — ArchUnit: regras arquiteturais automatizadas e proteção de camadas
269 — Mini-projeto ferramentas
270 — Fechamento do M11
```

A aula 269 funciona como uma simulação de projeto profissional pequeno.

Não é um projeto grande.

Não é uma API REST completa.

Não é Spring Boot.

Mas já tem elementos importantes:

```text
domínio;
serviço;
repository;
cliente externo;
banco real em teste;
serviço HTTP fake em teste;
regras arquiteturais;
pipeline;
Docker;
qualidade;
segurança de dependências;
artifacts.
```

Esse tipo de consolidação é importante porque, no mercado, as ferramentas não aparecem isoladas.

Você não usa JaCoCo sozinho.

Você não usa Docker sozinho.

Você não usa Testcontainers sozinho.

Você combina tudo em um fluxo.

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-269-mini-projeto-ferramentas
```

E o workflow:

```text
.github/workflows/aula-269-mini-projeto-ferramentas.yml
```

A estrutura será:

```text
.github
└── workflows
    └── aula-269-mini-projeto-ferramentas.yml

labs
└── m11
    └── aula-269-mini-projeto-ferramentas
        ├── .dockerignore
        ├── checkstyle.xml
        ├── Dockerfile
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula269
            │                       ├── app
            │                       │   └── MiniProjetoApp.java
            │                       ├── controller
            │                       │   └── OrdemServicoController.java
            │                       ├── domain
            │                       │   ├── OrdemServico.java
            │                       │   └── StatusOrdemServico.java
            │                       ├── external
            │                       │   ├── ClienteExternoException.java
            │                       │   └── ClienteScoreHttp.java
            │                       ├── repository
            │                       │   ├── OrdemServicoRepository.java
            │                       │   └── OrdemServicoRepositoryJdbc.java
            │                       └── service
            │                           └── OrdemServicoService.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula269
                                    ├── ArchitectureTest.java
                                    ├── ClienteScoreHttpTest.java
                                    ├── OrdemServicoRepositoryJdbcIT.java
                                    └── OrdemServicoServiceTest.java
```

O mini-projeto terá uma regra simples:

```text
Cadastrar uma ordem de serviço;
consultar score externo do cliente;
permitir aprovação quando score for suficiente;
salvar no PostgreSQL;
proteger arquitetura;
validar tudo em pipeline.
```

A regra será didática:

```text
score >= 70:
ordem aprovada.

score < 70:
ordem em análise.
```

Isso nos dá espaço para usar:

```text
domínio;
serviço;
cliente HTTP externo fake;
repository JDBC;
Testcontainers;
WireMock;
ArchUnit;
pipeline.
```

---

## 4. Conceitos essenciais antes da prática

### 4.1 Mini-projeto não é projeto final

Este mini-projeto não é o projeto final do curso.

Ele não tem:

```text
Spring Boot;
API REST real;
JPA;
Hibernate;
Flyway;
camadas avançadas;
DDD formal;
mensageria;
observabilidade.
```

Isso virá mais adiante.

Aqui o objetivo é consolidar ferramentas do M11.

A pergunta da aula é:

```text
consigo juntar qualidade, pipeline, Docker, testes reais e regras arquiteturais em um projeto Java simples?
```

A resposta deve ser sim.

---

### 4.2 Ferramentas precisam conversar

Em projeto real, ferramentas não são ilhas.

Exemplo:

```text
JUnit roda testes.
JaCoCo mede cobertura.
Surefire gera relatório.
Spotless valida formatação.
Checkstyle valida convenção.
ArchUnit valida arquitetura.
Testcontainers valida banco real.
WireMock valida cliente HTTP.
CycloneDX gera SBOM.
Dockerfile empacota aplicação.
GitHub Actions orquestra tudo.
```

O pipeline vira o ponto de convergência.

Ele responde:

```text
o código compila?
os testes passam?
a cobertura foi gerada?
a arquitetura foi respeitada?
o estilo está correto?
o SBOM foi gerado?
a imagem Docker builda?
os relatórios ficaram disponíveis?
```

---

### 4.3 O papel do mini-projeto no aprendizado

Até agora você aprendeu ferramentas por aula.

Isso é necessário.

Mas se ficar só nisso, você pode decorar comandos sem entender fluxo.

O mini-projeto força você a pensar em conjunto.

Exemplo:

```text
se eu criar repository JDBC, preciso testar com banco real;
se eu criar cliente HTTP, preciso testar com WireMock;
se eu criar camadas, preciso proteger com ArchUnit;
se eu criar projeto Maven, posso medir cobertura;
se eu uso dependências, posso gerar SBOM;
se eu quero entrega moderna, posso buildar imagem Docker;
se eu quero confiança, coloco no pipeline.
```

Isso é visão de engenharia.

---

### 4.4 Ordem correta de validação

Um pipeline profissional costuma validar em ordem lógica.

Exemplo:

```text
1. Checkout
2. Setup Java
3. Formatação
4. Testes e verificações
5. Relatórios
6. SBOM
7. Docker build
8. Upload de artifacts
```

Se a formatação falha, nem sempre faz sentido gastar tempo com Docker.

Se os testes falham, não faz sentido publicar imagem.

Se o SBOM não é gerado, falta evidência.

Nesta aula, vamos montar uma versão didática, mas com raciocínio profissional.

---

### 4.5 Teste unitário, integração e arquitetura no mesmo projeto

O projeto terá tipos diferentes de teste:

```text
OrdemServicoServiceTest:
teste unitário de regra de negócio.

OrdemServicoRepositoryJdbcIT:
teste de integração com PostgreSQL real via Testcontainers.

ClienteScoreHttpTest:
teste de integração HTTP fake com WireMock.

ArchitectureTest:
teste arquitetural com ArchUnit.
```

Cada teste responde uma pergunta diferente.

Não existe um único tipo de teste que resolva tudo.

---

### 4.6 Por que ainda não usar Spring Boot

Seria tentador usar Spring Boot agora.

Mas a formação tem ordem.

Spring Boot começa no M14.

Antes disso, você precisa entender:

```text
Java puro;
Maven;
JDBC;
Docker;
pipeline;
testes;
ferramentas;
arquitetura básica.
```

Quando Spring Boot chegar, você vai entender melhor o que ele automatiza.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-269-mini-projeto-ferramentas
cd labs\m11\aula-269-mini-projeto-ferramentas

mkdir src\main\java\br\com\curso\aula269\app
mkdir src\main\java\br\com\curso\aula269\controller
mkdir src\main\java\br\com\curso\aula269\domain
mkdir src\main\java\br\com\curso\aula269\external
mkdir src\main\java\br\com\curso\aula269\repository
mkdir src\main\java\br\com\curso\aula269\service
mkdir src\test\java\br\com\curso\aula269
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/main/java/br/com/curso/aula269/app
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/main/java/br/com/curso/aula269/controller
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/main/java/br/com/curso/aula269/domain
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/main/java/br/com/curso/aula269/external
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/main/java/br/com/curso/aula269/repository
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/main/java/br/com/curso/aula269/service
mkdir -p labs/m11/aula-269-mini-projeto-ferramentas/src/test/java/br/com/curso/aula269
cd labs/m11/aula-269-mini-projeto-ferramentas
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
    <artifactId>aula-269-mini-projeto-ferramentas</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <mockito.version>5.12.0</mockito.version>
        <postgresql.version>42.7.3</postgresql.version>
        <testcontainers.version>1.21.4</testcontainers.version>
        <wiremock.version>3.13.2</wiremock.version>
        <archunit.version>1.4.2</archunit.version>
        <jacoco.version>0.8.12</jacoco.version>
        <spotless.version>2.43.0</spotless.version>
        <checkstyle.version>10.17.0</checkstyle.version>
        <maven.checkstyle.plugin.version>3.3.1</maven.checkstyle.plugin.version>
        <cyclonedx.maven.plugin.version>2.8.0</cyclonedx.maven.plugin.version>
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
            <groupId>org.wiremock</groupId>
            <artifactId>wiremock</artifactId>
            <version>${wiremock.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>com.tngtech.archunit</groupId>
            <artifactId>archunit-junit5</artifactId>
            <version>${archunit.version}</version>
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

        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <version>${mockito.version}</version>
            <scope>test</scope>
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
    </dependencies>

    <build>
        <finalName>aula-269-mini-projeto-ferramentas</finalName>

        <plugins>
            <plugin>
                <groupId>com.diffplug.spotless</groupId>
                <artifactId>spotless-maven-plugin</artifactId>
                <version>${spotless.version}</version>
                <configuration>
                    <java>
                        <googleJavaFormat/>
                        <removeUnusedImports/>
                        <trimTrailingWhitespace/>
                        <endWithNewline/>
                    </java>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-checkstyle-plugin</artifactId>
                <version>${maven.checkstyle.plugin.version}</version>
                <dependencies>
                    <dependency>
                        <groupId>com.puppycrawl.tools</groupId>
                        <artifactId>checkstyle</artifactId>
                        <version>${checkstyle.version}</version>
                    </dependency>
                </dependencies>
                <configuration>
                    <configLocation>checkstyle.xml</configLocation>
                    <consoleOutput>true</consoleOutput>
                    <failsOnError>true</failsOnError>
                    <includeTestSourceDirectory>true</includeTestSourceDirectory>
                </configuration>
                <executions>
                    <execution>
                        <id>checkstyle-validate</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>check</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.cyclonedx</groupId>
                <artifactId>cyclonedx-maven-plugin</artifactId>
                <version>${cyclonedx.maven.plugin.version}</version>
                <configuration>
                    <projectType>application</projectType>
                    <schemaVersion>1.5</schemaVersion>
                    <outputFormat>all</outputFormat>
                    <outputName>bom</outputName>
                    <includeTestScope>false</includeTestScope>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>${jacoco.version}</version>
                <executions>
                    <execution>
                        <id>prepare-agent</id>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>

                    <execution>
                        <id>report</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

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

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.1</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>br.com.curso.aula269.app.MiniProjetoApp</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

Este `pom.xml` concentra várias ferramentas do M11.

Ele é maior que os anteriores porque esta aula é integradora.

---

### 5.3 Criar checkstyle.xml

Crie:

```text
checkstyle.xml
```

Conteúdo:

```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
    <property name="charset" value="UTF-8"/>

    <module name="NewlineAtEndOfFile"/>

    <module name="TreeWalker">
        <module name="AvoidStarImport"/>
        <module name="UnusedImports"/>
        <module name="OneTopLevelClass"/>
        <module name="LocalVariableName"/>
        <module name="MemberName"/>
        <module name="MethodName"/>
        <module name="PackageName"/>
        <module name="ParameterName"/>
        <module name="TypeName"/>
        <module name="NeedBraces"/>
        <module name="EqualsHashCode"/>
    </module>
</module>
```

---

### 5.4 Criar domínio

Crie:

```text
src/main/java/br/com/curso/aula269/domain/StatusOrdemServico.java
```

Conteúdo:

```java
package br.com.curso.aula269.domain;

public enum StatusOrdemServico {
    EM_ANALISE,
    APROVADA
}
```

Crie:

```text
src/main/java/br/com/curso/aula269/domain/OrdemServico.java
```

Conteúdo:

```java
package br.com.curso.aula269.domain;

import java.math.BigDecimal;
import java.util.Objects;

public record OrdemServico(
        Long id,
        String codigo,
        String cliente,
        BigDecimal valor,
        StatusOrdemServico status
) {
    public OrdemServico {
        Objects.requireNonNull(codigo, "codigo não pode ser nulo");
        Objects.requireNonNull(cliente, "cliente não pode ser nulo");
        Objects.requireNonNull(valor, "valor não pode ser nulo");
        Objects.requireNonNull(status, "status não pode ser nulo");

        if (codigo.isBlank()) {
            throw new IllegalArgumentException("codigo não pode ser vazio");
        }

        if (cliente.isBlank()) {
            throw new IllegalArgumentException("cliente não pode ser vazio");
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("valor deve ser maior que zero");
        }
    }

    public static OrdemServico nova(String codigo, String cliente, BigDecimal valor, int score) {
        StatusOrdemServico status = score >= 70
                ? StatusOrdemServico.APROVADA
                : StatusOrdemServico.EM_ANALISE;

        return new OrdemServico(null, codigo, cliente, valor, status);
    }

    public OrdemServico comId(Long id) {
        return new OrdemServico(id, codigo, cliente, valor, status);
    }
}
```

A regra principal ficou no domínio:

```text
score >= 70:
APROVADA.

score < 70:
EM_ANALISE.
```

---

### 5.5 Criar cliente externo

Crie:

```text
src/main/java/br/com/curso/aula269/external/ClienteExternoException.java
```

Conteúdo:

```java
package br.com.curso.aula269.external;

public class ClienteExternoException extends RuntimeException {

    public ClienteExternoException(String mensagem) {
        super(mensagem);
    }

    public ClienteExternoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula269/external/ClienteScoreHttp.java
```

Conteúdo:

```java
package br.com.curso.aula269.external;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

public class ClienteScoreHttp {

    private final HttpClient httpClient;
    private final URI baseUri;

    public ClienteScoreHttp(URI baseUri) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(500))
                .build();
        this.baseUri = baseUri;
    }

    public int consultarScore(String cliente) {
        String clienteTratado = validarCliente(cliente);
        URI uri = baseUri.resolve("/score/" + encode(clienteTratado));

        HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofMillis(800))
                .header("Accept", "application/json")
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() != 200) {
                throw new ClienteExternoException(
                        "Erro ao consultar score. Status HTTP: " + response.statusCode()
                );
            }

            return extrairScore(response.body());
        } catch (IOException exception) {
            throw new ClienteExternoException("Erro de comunicação ao consultar score", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ClienteExternoException("Consulta de score interrompida", exception);
        }
    }

    private String validarCliente(String cliente) {
        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("cliente não pode ser vazio");
        }

        return cliente.trim();
    }

    private String encode(String valor) {
        return URLEncoder.encode(valor, StandardCharsets.UTF_8);
    }

    private int extrairScore(String json) {
        String marcador = "\"score\":";
        int inicio = json.indexOf(marcador);

        if (inicio < 0) {
            throw new ClienteExternoException("Campo score ausente na resposta");
        }

        int inicioValor = inicio + marcador.length();
        int fimValor = json.indexOf("}", inicioValor);

        if (fimValor < 0) {
            throw new ClienteExternoException("Campo score inválido na resposta");
        }

        String valor = json.substring(inicioValor, fimValor).trim();

        return Integer.parseInt(valor);
    }
}
```

---

### 5.6 Criar repository

Crie:

```text
src/main/java/br/com/curso/aula269/repository/OrdemServicoRepository.java
```

Conteúdo:

```java
package br.com.curso.aula269.repository;

import br.com.curso.aula269.domain.OrdemServico;

import java.util.Optional;

public interface OrdemServicoRepository {

    OrdemServico salvar(OrdemServico ordemServico);

    Optional<OrdemServico> buscarPorCodigo(String codigo);

    int contar();
}
```

Crie:

```text
src/main/java/br/com/curso/aula269/repository/OrdemServicoRepositoryJdbc.java
```

Conteúdo:

```java
package br.com.curso.aula269.repository;

import br.com.curso.aula269.domain.OrdemServico;
import br.com.curso.aula269.domain.StatusOrdemServico;

import javax.sql.DataSource;
import java.sql.*;
import java.util.Optional;

public class OrdemServicoRepositoryJdbc implements OrdemServicoRepository {

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
                    valor numeric(12, 2) not null,
                    status varchar(40) not null
                )
                """;

        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute(sql);
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao criar tabela ordem_servico", exception);
        }
    }

    @Override
    public OrdemServico salvar(OrdemServico ordemServico) {
        String sql = """
                insert into ordem_servico (codigo, cliente, valor, status)
                values (?, ?, ?, ?)
                returning id
                """;

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, ordemServico.codigo());
            statement.setString(2, ordemServico.cliente());
            statement.setBigDecimal(3, ordemServico.valor());
            statement.setString(4, ordemServico.status().name());

            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();

                return ordemServico.comId(resultSet.getLong("id"));
            }
        } catch (SQLException exception) {
            throw new IllegalStateException("Erro ao salvar ordem de serviço", exception);
        }
    }

    @Override
    public Optional<OrdemServico> buscarPorCodigo(String codigo) {
        String sql = """
                select id, codigo, cliente, valor, status
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
            throw new IllegalStateException("Erro ao buscar ordem de serviço", exception);
        }
    }

    @Override
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
                resultSet.getBigDecimal("valor"),
                StatusOrdemServico.valueOf(resultSet.getString("status"))
        );
    }
}
```

---

### 5.7 Criar service

Crie:

```text
src/main/java/br/com/curso/aula269/service/OrdemServicoService.java
```

Conteúdo:

```java
package br.com.curso.aula269.service;

import br.com.curso.aula269.domain.OrdemServico;
import br.com.curso.aula269.external.ClienteScoreHttp;
import br.com.curso.aula269.repository.OrdemServicoRepository;

import java.math.BigDecimal;

public class OrdemServicoService {

    private final OrdemServicoRepository repository;
    private final ClienteScoreHttp clienteScoreHttp;

    public OrdemServicoService(
            OrdemServicoRepository repository,
            ClienteScoreHttp clienteScoreHttp
    ) {
        this.repository = repository;
        this.clienteScoreHttp = clienteScoreHttp;
    }

    public OrdemServico criar(String codigo, String cliente, BigDecimal valor) {
        int score = clienteScoreHttp.consultarScore(cliente);
        OrdemServico ordemServico = OrdemServico.nova(codigo, cliente, valor, score);

        return repository.salvar(ordemServico);
    }
}
```

---

### 5.8 Criar controller didático

Crie:

```text
src/main/java/br/com/curso/aula269/controller/OrdemServicoController.java
```

Conteúdo:

```java
package br.com.curso.aula269.controller;

import br.com.curso.aula269.domain.OrdemServico;
import br.com.curso.aula269.service.OrdemServicoService;

import java.math.BigDecimal;

public class OrdemServicoController {

    private final OrdemServicoService service;

    public OrdemServicoController(OrdemServicoService service) {
        this.service = service;
    }

    public OrdemServico criar(String codigo, String cliente, BigDecimal valor) {
        return service.criar(codigo, cliente, valor);
    }
}
```

Ainda não é controller HTTP real.

É uma classe didática representando camada de entrada.

Spring Boot virá depois.

---

### 5.9 Criar aplicação mínima

Crie:

```text
src/main/java/br/com/curso/aula269/app/MiniProjetoApp.java
```

Conteúdo:

```java
package br.com.curso.aula269.app;

public class MiniProjetoApp {

    public static void main(String[] args) {
        System.out.println("Aula 269 - Mini-projeto ferramentas do M11");
        System.out.println("Pipeline, Docker, Testcontainers, WireMock, ArchUnit e qualidade.");
    }
}
```

A aplicação é mínima porque o foco está nas ferramentas.

---

## 6. Testes do mini-projeto

### 6.1 Teste unitário do service

Crie:

```text
src/test/java/br/com/curso/aula269/OrdemServicoServiceTest.java
```

Conteúdo:

```java
package br.com.curso.aula269;

import br.com.curso.aula269.domain.OrdemServico;
import br.com.curso.aula269.domain.StatusOrdemServico;
import br.com.curso.aula269.external.ClienteScoreHttp;
import br.com.curso.aula269.repository.OrdemServicoRepository;
import br.com.curso.aula269.service.OrdemServicoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@DisplayName("OrdemServicoService")
class OrdemServicoServiceTest {

    private final OrdemServicoRepository repository = mock(OrdemServicoRepository.class);
    private final ClienteScoreHttp clienteScoreHttp = mock(ClienteScoreHttp.class);
    private final OrdemServicoService service = new OrdemServicoService(repository, clienteScoreHttp);

    @Test
    @DisplayName("deve criar ordem aprovada quando score for suficiente")
    void deveCriarOrdemAprovadaQuandoScoreForSuficiente() {
        when(clienteScoreHttp.consultarScore("Cliente A")).thenReturn(85);
        when(repository.salvar(any())).thenAnswer(invocation -> {
            OrdemServico ordemServico = invocation.getArgument(0);
            return ordemServico.comId(1L);
        });

        OrdemServico criada = service.criar("OS-269-001", "Cliente A", new BigDecimal("150.00"));

        assertThat(criada.id()).isEqualTo(1L);
        assertThat(criada.status()).isEqualTo(StatusOrdemServico.APROVADA);

        verify(clienteScoreHttp).consultarScore("Cliente A");
        verify(repository).salvar(any(OrdemServico.class));
    }

    @Test
    @DisplayName("deve criar ordem em análise quando score for baixo")
    void deveCriarOrdemEmAnaliseQuandoScoreForBaixo() {
        when(clienteScoreHttp.consultarScore("Cliente B")).thenReturn(50);
        when(repository.salvar(any())).thenAnswer(invocation -> {
            OrdemServico ordemServico = invocation.getArgument(0);
            return ordemServico.comId(2L);
        });

        OrdemServico criada = service.criar("OS-269-002", "Cliente B", new BigDecimal("200.00"));

        assertThat(criada.id()).isEqualTo(2L);
        assertThat(criada.status()).isEqualTo(StatusOrdemServico.EM_ANALISE);

        verify(clienteScoreHttp).consultarScore("Cliente B");
        verify(repository).salvar(any(OrdemServico.class));
    }
}
```

Esse teste usa Mockito porque o foco é a regra do service, não integração externa.

---

### 6.2 Teste WireMock do cliente externo

Crie:

```text
src/test/java/br/com/curso/aula269/ClienteScoreHttpTest.java
```

Conteúdo:

```java
package br.com.curso.aula269;

import br.com.curso.aula269.external.ClienteExternoException;
import br.com.curso.aula269.external.ClienteScoreHttp;
import com.github.tomakehurst.wiremock.junit5.WireMockRuntimeInfo;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.net.URI;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@WireMockTest
@DisplayName("ClienteScoreHttp")
class ClienteScoreHttpTest {

    @Test
    @DisplayName("deve consultar score com sucesso")
    void deveConsultarScoreComSucesso(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/score/Cliente%20A"))
                .willReturn(okJson("""
                        {
                          "score": 85
                        }
                        """)));

        ClienteScoreHttp cliente = new ClienteScoreHttp(URI.create(wireMock.getHttpBaseUrl()));

        int score = cliente.consultarScore("Cliente A");

        assertThat(score).isEqualTo(85);

        verify(getRequestedFor(urlEqualTo("/score/Cliente%20A"))
                .withHeader("Accept", equalTo("application/json")));
    }

    @Test
    @DisplayName("deve lançar exceção quando serviço externo falhar")
    void deveLancarExcecaoQuandoServicoExternoFalhar(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/score/Cliente%20B"))
                .willReturn(serverError()));

        ClienteScoreHttp cliente = new ClienteScoreHttp(URI.create(wireMock.getHttpBaseUrl()));

        assertThatThrownBy(() -> cliente.consultarScore("Cliente B"))
                .isInstanceOf(ClienteExternoException.class)
                .hasMessage("Erro ao consultar score. Status HTTP: 500");
    }
}
```

---

### 6.3 Teste Testcontainers do repository

Crie:

```text
src/test/java/br/com/curso/aula269/OrdemServicoRepositoryJdbcIT.java
```

Conteúdo:

```java
package br.com.curso.aula269;

import br.com.curso.aula269.domain.OrdemServico;
import br.com.curso.aula269.domain.StatusOrdemServico;
import br.com.curso.aula269.repository.OrdemServicoRepositoryJdbc;
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
@DisplayName("OrdemServicoRepositoryJdbc")
class OrdemServicoRepositoryJdbcIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("aula269")
            .withUsername("aula269")
            .withPassword("aula269");

    private OrdemServicoRepositoryJdbc repository;

    @BeforeEach
    void setUp() {
        repository = new OrdemServicoRepositoryJdbc(dataSource());
        repository.criarTabela();
        repository.limpar();
    }

    @Test
    @DisplayName("deve salvar e buscar ordem de serviço")
    void deveSalvarEBuscarOrdemServico() {
        OrdemServico ordemServico = new OrdemServico(
                null,
                "OS-269-003",
                "Cliente Banco",
                new BigDecimal("350.00"),
                StatusOrdemServico.APROVADA
        );

        OrdemServico salva = repository.salvar(ordemServico);

        Optional<OrdemServico> encontrada = repository.buscarPorCodigo("OS-269-003");

        assertThat(salva.id()).isNotNull();
        assertThat(encontrada).isPresent();
        assertThat(encontrada.get().cliente()).isEqualTo("Cliente Banco");
        assertThat(encontrada.get().status()).isEqualTo(StatusOrdemServico.APROVADA);
        assertThat(repository.contar()).isEqualTo(1);
    }

    private DataSource dataSource() {
        PGSimpleDataSource dataSource = new PGSimpleDataSource();
        dataSource.setURL(postgres.getJdbcUrl());
        dataSource.setUser(postgres.getUsername());
        dataSource.setPassword(postgres.getPassword());

        return dataSource;
    }
}
```

---

### 6.4 Teste ArchUnit

Crie:

```text
src/test/java/br/com/curso/aula269/ArchitectureTest.java
```

Conteúdo:

```java
package br.com.curso.aula269;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(
        packages = "br.com.curso.aula269",
        importOptions = ImportOption.DoNotIncludeTests.class
)
class ArchitectureTest {

    @ArchTest
    static final ArchRule dominio_nao_deve_depender_das_outras_camadas = classes()
            .that().resideInAPackage("..domain..")
            .should().onlyDependOnClassesThat().resideInAnyPackage(
                    "java..",
                    "br.com.curso.aula269.domain.."
            );

    @ArchTest
    static final ArchRule controller_nao_deve_acessar_repository = classes()
            .that().resideInAPackage("..controller..")
            .should().onlyAccessClassesThat().resideOutsideOfPackage("..repository..");

    @ArchTest
    static final ArchRule external_nao_deve_depender_de_controller = classes()
            .that().resideInAPackage("..external..")
            .should().onlyDependOnClassesThat().resideOutsideOfPackage("..controller..");

    @ArchTest
    static final ArchRule fluxo_de_camadas_deve_ser_respeitado = layeredArchitecture()
            .consideringOnlyDependenciesInLayers()
            .layer("App").definedBy("..app..")
            .layer("Controller").definedBy("..controller..")
            .layer("Service").definedBy("..service..")
            .layer("Repository").definedBy("..repository..")
            .layer("External").definedBy("..external..")
            .layer("Domain").definedBy("..domain..")
            .whereLayer("App").mayNotBeAccessedByAnyLayer()
            .whereLayer("Controller").mayOnlyBeAccessedByLayers("App")
            .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
            .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service")
            .whereLayer("External").mayOnlyBeAccessedByLayers("Service")
            .whereLayer("Domain").mayOnlyBeAccessedByLayers("Controller", "Service", "Repository");

    @ArchTest
    static final ArchRule pacotes_nao_devem_ter_ciclos = slices()
            .matching("br.com.curso.aula269.(*)..")
            .should().beFreeOfCycles();
}
```

---

## 7. Docker do mini-projeto

### 7.1 Criar Dockerfile

Crie:

```text
Dockerfile
```

Conteúdo:

```dockerfile
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /build

COPY pom.xml .
COPY checkstyle.xml .

RUN mvn -B dependency:go-offline

COPY src ./src

RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /build/target/aula-269-mini-projeto-ferramentas.jar app.jar

ENV APP_ENV=docker

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Neste Dockerfile, usamos:

```text
multi-stage;
Maven no build;
JRE na imagem final;
JAR final como app.jar.
```

---

### 7.2 Criar .dockerignore

Crie:

```text
.dockerignore
```

Conteúdo:

```dockerignore
.git
.github
target
*.log
.idea
.vscode
.env
.DS_Store
```

---

### 7.3 Testar localmente

Dentro do laboratório:

```powershell
mvn spotless:apply
mvn spotless:check
mvn clean verify
mvn cyclonedx:makeBom
docker build -t aula-269-mini-projeto:local .
docker run --rm aula-269-mini-projeto:local
```

Resultado esperado do container:

```text
Aula 269 - Mini-projeto ferramentas do M11
Pipeline, Docker, Testcontainers, WireMock, ArchUnit e qualidade.
```

---

## 8. Workflow integrador

### 8.1 Criar workflow

Volte para a raiz do repositório.

Crie:

```text
.github/workflows/aula-269-mini-projeto-ferramentas.yml
```

Conteúdo:

```yaml
name: Aula 269 - Mini-projeto ferramentas

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
  qualidade-e-testes:
    name: Qualidade, testes e evidências
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-269-mini-projeto-ferramentas

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

      - name: Exibir versões
        run: |
          java -version
          mvn -version

      - name: Validar formatação com Spotless
        run: mvn -B spotless:check

      - name: Rodar testes, Checkstyle, ArchUnit e JaCoCo
        run: mvn -B clean verify

      - name: Gerar SBOM CycloneDX
        run: mvn -B cyclonedx:makeBom

      - name: Listar arquivos gerados
        run: |
          echo "Target:"
          ls -la target
          echo "Surefire:"
          ls -la target/surefire-reports
          echo "JaCoCo:"
          ls -la target/site/jacoco
          echo "SBOM:"
          ls -la target/bom.*

      - name: Publicar relatórios Surefire
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-269-surefire-reports
          path: labs/m11/aula-269-mini-projeto-ferramentas/target/surefire-reports
          if-no-files-found: error

      - name: Publicar relatório JaCoCo
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-269-jacoco-report
          path: labs/m11/aula-269-mini-projeto-ferramentas/target/site/jacoco
          if-no-files-found: error

      - name: Publicar SBOM
        uses: actions/upload-artifact@v4
        with:
          name: aula-269-sbom
          path: |
            labs/m11/aula-269-mini-projeto-ferramentas/target/bom.json
            labs/m11/aula-269-mini-projeto-ferramentas/target/bom.xml
          if-no-files-found: error

      - name: Publicar JAR
        uses: actions/upload-artifact@v4
        with:
          name: aula-269-jar
          path: labs/m11/aula-269-mini-projeto-ferramentas/target/*.jar
          if-no-files-found: error

  docker-build:
    name: Build Docker
    runs-on: ubuntu-latest
    needs: qualidade-e-testes

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Configurar Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Buildar imagem Docker
        uses: docker/build-push-action@v6
        with:
          context: labs/m11/aula-269-mini-projeto-ferramentas
          file: labs/m11/aula-269-mini-projeto-ferramentas/Dockerfile
          push: false
          tags: aula-269-mini-projeto:ci
```

Esse workflow tem dois jobs:

```text
qualidade-e-testes;
docker-build.
```

O segundo depende do primeiro:

```yaml
needs: qualidade-e-testes
```

Isso significa:

```text
só builda Docker se qualidade e testes passarem.
```

Esse é um desenho profissional.

---

## 9. Entendendo as decisões técnicas

### 9.1 Por que separar jobs

Separar jobs ajuda a deixar claro:

```text
primeiro qualidade;
depois Docker.
```

Se qualidade falha, Docker nem roda.

Isso economiza tempo e evita gerar imagem de código ruim.

---

### 9.2 Por que Docker build não faz push

Na aula 263, você aprendeu push para registry.

Aqui, como mini-projeto didático, vamos apenas buildar.

Motivo:

```text
o objetivo da aula é integração de ferramentas;
não precisamos publicar imagem novamente;
já estudamos publicação na aula 263.
```

Em projeto real, poderíamos reaproveitar tags e GHCR.

---

### 9.3 Por que Spotless roda antes

Formatação é validação rápida.

Se falhar, corrige com:

```powershell
mvn spotless:apply
```

Não vale gastar tempo com Testcontainers, JaCoCo e Docker se o código nem segue o padrão.

---

### 9.4 Por que Testcontainers exige Docker no job

O teste `OrdemServicoRepositoryJdbcIT` sobe PostgreSQL real.

Por isso o workflow verifica:

```bash
docker version
docker info
```

Se Docker não estiver disponível, a falha fica explícita.

---

### 9.5 Por que publicar tantos artifacts

Artifacts são evidências.

Publicamos:

```text
Surefire:
resultado dos testes.

JaCoCo:
cobertura.

SBOM:
inventário de dependências.

JAR:
artefato Java.
```

Isso cria rastreabilidade.

---

### 9.6 Como esse mini-projeto se aproxima de uma empresa

Mesmo pequeno, ele simula práticas reais:

```text
pipeline automático;
testes em camadas;
infraestrutura descartável;
serviço externo fake;
regras arquiteturais;
relatórios de qualidade;
SBOM;
Docker build.
```

Em uma empresa, isso poderia evoluir para:

```text
Spring Boot;
PostgreSQL real com migrations;
OpenAPI;
SonarQube;
Docker registry;
scan de imagem;
deploy;
observabilidade;
Kubernetes.
```

Mas a base mental já está aqui.

---

## 10. Erros comuns e troubleshooting essencial

### 10.1 Spotless falha

Rode localmente:

```powershell
mvn spotless:apply
mvn spotless:check
```

Depois commite os arquivos alterados.

---

### 10.2 Checkstyle falha

Leia a mensagem.

Possíveis causas:

```text
import não usado;
import com wildcard;
nome fora de padrão;
arquivo sem newline final.
```

Corrija e rode:

```powershell
mvn clean verify
```

---

### 10.3 Testcontainers falha

Verifique Docker:

```powershell
docker version
docker ps
```

Se falhar no CI, veja o step:

```text
Verificar Docker disponível
```

---

### 10.4 WireMock retorna 404 inesperado

Confira:

```text
path;
encoding de espaço;
urlEqualTo;
base URL;
método GET.
```

Nesta aula usamos:

```text
/score/Cliente%20A
```

porque espaço vira `%20`.

---

### 10.5 ArchUnit falha

Leia qual regra falhou.

Exemplos:

```text
controller acessou repository;
domain dependeu de camada externa;
ciclo entre pacotes;
fluxo de camadas violado.
```

Corrija a arquitetura, não apenas o teste.

---

### 10.6 JaCoCo não gera relatório

Rode:

```powershell
mvn clean verify
```

O relatório deve aparecer em:

```text
target/site/jacoco
```

Se rodar apenas `mvn test`, pode não gerar o relatório HTML.

---

### 10.7 SBOM não aparece

Rode:

```powershell
mvn cyclonedx:makeBom
```

Confira:

```text
target/bom.json
target/bom.xml
```

---

### 10.8 Docker build falha

Rode localmente:

```powershell
docker build -t aula-269-mini-projeto:local .
```

Causas comuns:

```text
contexto errado;
pom.xml não copiado;
checkstyle.xml não copiado;
classe main errada;
JAR não gerado.
```

---

## 11. Exercício prático principal

### Missão

Criar o mini-projeto integrador da aula 269.

Você deve criar:

```text
labs/m11/aula-269-mini-projeto-ferramentas
.github/workflows/aula-269-mini-projeto-ferramentas.yml
```

O mini-projeto deve conter:

```text
domínio de ordem de serviço;
service com regra de score;
cliente HTTP externo;
repository JDBC;
teste unitário com Mockito;
teste HTTP com WireMock;
teste de integração com Testcontainers;
teste arquitetural com ArchUnit;
Spotless;
Checkstyle;
JaCoCo;
CycloneDX SBOM;
Dockerfile;
.dockerignore;
workflow integrador.
```

---

### Roteiro local

Dentro do laboratório:

```powershell
mvn spotless:apply
mvn spotless:check
mvn clean verify
mvn cyclonedx:makeBom
docker build -t aula-269-mini-projeto:local .
docker run --rm aula-269-mini-projeto:local
```

---

### Roteiro no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-269-mini-projeto-ferramentas
git add .github/workflows/aula-269-mini-projeto-ferramentas.yml
git commit -m "Aula 269: mini projeto ferramentas do M11"
git push
```

Depois no GitHub:

```text
Actions;
Aula 269 - Mini-projeto ferramentas;
abrir execução;
verificar job qualidade-e-testes;
verificar job docker-build;
baixar artifacts.
```

Artifacts esperados:

```text
aula-269-surefire-reports;
aula-269-jacoco-report;
aula-269-sbom;
aula-269-jar.
```

---

### Critérios de aceite

A aula está concluída quando:

```text
Spotless passa;
Checkstyle passa;
testes unitários passam;
teste WireMock passa;
teste Testcontainers passa;
teste ArchUnit passa;
JaCoCo gera relatório;
SBOM é gerado;
JAR é gerado;
Docker build funciona;
workflow roda no GitHub Actions;
artifacts são publicados;
você entende o papel de cada ferramenta.
```

---

## 12. Checkpoint final

Responda mentalmente:

```text
1. Por que esta aula é um mini-projeto e não uma ferramenta nova?
2. Qual papel do JUnit neste projeto?
3. Qual papel do Mockito?
4. Qual papel do WireMock?
5. Qual papel do Testcontainers?
6. Qual papel do ArchUnit?
7. Qual papel do JaCoCo?
8. Qual papel do Spotless?
9. Qual papel do Checkstyle?
10. Qual papel do CycloneDX?
11. Qual papel do Dockerfile?
12. Qual papel do GitHub Actions?
13. Por que separar qualidade e Docker em jobs diferentes?
14. Por que Docker depende do job de qualidade?
15. Por que publicar artifacts?
16. Por que não usar Spring Boot ainda?
17. Como este projeto prepara o M12?
18. Como este projeto prepara Spring Boot no futuro?
19. Como este projeto ajuda sua visão de engenheiro?
20. O que você explicaria em uma entrevista sobre essa aula?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 269.
[ ] Criei domínio.
[ ] Criei service.
[ ] Criei cliente externo.
[ ] Criei repository JDBC.
[ ] Criei controller didático.
[ ] Criei teste unitário.
[ ] Criei teste com WireMock.
[ ] Criei teste com Testcontainers.
[ ] Criei teste com ArchUnit.
[ ] Configurei Spotless.
[ ] Configurei Checkstyle.
[ ] Configurei JaCoCo.
[ ] Configurei CycloneDX.
[ ] Criei Dockerfile.
[ ] Criei .dockerignore.
[ ] Criei workflow integrador.
[ ] Rodei tudo localmente.
[ ] Entendi como as ferramentas trabalham juntas.
```

---

## 13. Fechamento e ponte para a próxima aula

Nesta aula, você consolidou o M11 em um mini-projeto.

Você juntou:

```text
Maven;
JUnit;
Mockito;
AssertJ;
JaCoCo;
Spotless;
Checkstyle;
CycloneDX;
Docker;
GitHub Actions;
Testcontainers;
WireMock;
ArchUnit.
```

Você criou um projeto com:

```text
camadas;
domínio;
service;
repository JDBC;
cliente externo HTTP;
teste unitário;
teste de integração com banco real;
teste de contrato HTTP fake;
teste arquitetural;
pipeline;
artifacts;
Docker build.
```

A ideia principal é:

```text
ferramentas profissionais não são acessórios.
Elas criam confiança, rastreabilidade, consistência e governança para o desenvolvimento backend.
```

A partir daqui, você já tem uma base muito mais madura para entrar no próximo grande bloco.

A próxima aula será:

```text
270 — M11.26 — Fechamento do M11 e transição para SQL, PostgreSQL e modelagem relacional
```

Nela, vamos fazer:

```text
revisão estratégica do M11;
mapa das ferramentas estudadas;
como cada ferramenta aparece em backend real;
o que você já consegue fazer;
o que ainda falta;
ponte para M12;
preparação para SQL, PostgreSQL e modelagem relacional.
```

Depois disso, entraremos no M12.

Ainda não vamos pular para Spring Boot.

O próximo módulo será base de banco de dados, essencial para backend Java profissional.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-269-mini-projeto-ferramentas
git add .github/workflows/aula-269-mini-projeto-ferramentas.yml
git commit -m "Aula 269: mini projeto ferramentas do M11"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-269-mini-projeto-ferramentas
git add labs/m11/aula-269-mini-projeto-ferramentas
git add .github/workflows/aula-269-mini-projeto-ferramentas.yml
git commit -m "Aula 269: mini projeto ferramentas do M11"
git push -u origin feature/aula-269-mini-projeto-ferramentas
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 269 — M11.25 — Mini-projeto ferramentas: pipeline, Docker, Testcontainers, WireMock, ArchUnit e qualidade

Nesta aula, consolidei as principais ferramentas do M11 em um mini-projeto Java Backend sem Spring Boot.

Criei o laboratório `labs/m11/aula-269-mini-projeto-ferramentas`, com camadas simples de `app`, `controller`, `service`, `repository`, `external` e `domain`.

Implementei uma regra didática de ordem de serviço baseada em score externo, com domínio, service, cliente HTTP, repository JDBC e controller didático.

Também criei testes unitários com Mockito, testes de integração com PostgreSQL real usando Testcontainers, testes de serviço externo fake com WireMock e testes arquiteturais com ArchUnit.

Configurei Spotless, Checkstyle, JaCoCo e CycloneDX para validar formatação, estilo, cobertura e geração de SBOM.

Criei Dockerfile multi-stage, `.dockerignore` e um workflow no GitHub Actions com jobs de qualidade/testes e Docker build.

O principal aprendizado foi entender como ferramentas profissionais trabalham juntas para criar confiança, rastreabilidade, consistência e governança em um projeto Java Backend.
```
