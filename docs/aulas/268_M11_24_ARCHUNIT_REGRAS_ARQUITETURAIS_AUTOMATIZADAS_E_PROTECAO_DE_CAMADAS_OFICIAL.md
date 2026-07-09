# 268 — M11.24 — ArchUnit: regras arquiteturais automatizadas e proteção de camadas

## 1. Objetivo da aula

Na aula 267, você estudou WireMock.

Você trabalhou com:

```text
serviços HTTP externos fake;
mock de objeto vs fake HTTP;
contratos HTTP;
stubs;
status 200;
status 404;
status 500;
timeout;
headers;
verificação de request;
porta dinâmica;
testes com Java HttpClient;
execução no GitHub Actions.
```

Agora vamos estudar uma ferramenta que aproxima você ainda mais do pensamento de engenheiro e arquiteto Java:

```text
ArchUnit.
```

Até aqui, você já automatizou várias dimensões de qualidade:

```text
testes unitários;
testes de integração;
cobertura;
artefatos;
Docker;
pipeline;
formatação;
estilo;
segurança de dependências;
serviços externos fake.
```

Mas existe uma dimensão que costuma quebrar devagar:

```text
arquitetura.
```

Arquitetura raramente quebra de uma vez.

Ela costuma quebrar em pequenas decisões:

```text
um controller acessa repository direto;
uma camada de domínio importa infraestrutura;
uma classe utilitária começa a ser usada em todo lugar;
um pacote interno vira público na prática;
um serviço começa a depender de outro módulo indevido;
uma regra de negócio vai parar na camada errada;
uma exceção de infraestrutura vaza para domínio;
um pacote começa a gerar ciclo de dependência.
```

No começo parece pequeno.

Depois vira dívida técnica.

ArchUnit ajuda a transformar regras arquiteturais em testes automatizados.

Ao final desta aula, você deve conseguir:

```text
entender por que arquitetura quebra aos poucos;
entender o que é teste arquitetural;
entender o papel do ArchUnit;
diferenciar regra de estilo, regra de teste e regra arquitetural;
configurar ArchUnit com JUnit 5;
criar uma estrutura simples em camadas;
criar regras para proteger controller, service, repository e domain;
impedir dependência indevida entre pacotes;
validar que domain não depende de infra;
validar que repository não é acessado por controller;
validar convenções de nomes;
validar ausência de ciclos simples entre pacotes;
rodar ArchUnit localmente;
integrar ArchUnit ao GitHub Actions;
entender quando usar e quando evitar regras arquiteturais;
preparar base para arquitetura limpa, hexagonal, DDD e governança técnica.
```

Esta aula continua o M11.

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL completo.

Ainda não vamos para o mini-projeto da aula 269.

A próxima aula será:

```text
269 — M11.25 — Mini-projeto ferramentas: pipeline, Docker, Testcontainers, WireMock, ArchUnit e qualidade
```

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
267 — WireMock, contratos HTTP e serviços externos fake
268 — ArchUnit: regras arquiteturais automatizadas e proteção de camadas
269 — Mini-projeto ferramentas
270 — Fechamento do M11
```

A aula 268 é especial porque muda o tipo de pergunta.

Até agora, muitos testes perguntavam:

```text
o método retorna o resultado certo?
o banco salva corretamente?
o cliente HTTP chama a URL certa?
o pipeline gera artefato?
a imagem Docker builda?
```

Com ArchUnit, a pergunta muda para:

```text
o código continua respeitando a arquitetura combinada?
```

Exemplo:

```text
camada domain continua independente?
controller continua sem acessar repository?
repository continua sem chamar controller?
pacotes continuam sem ciclo?
classes seguem convenção de nome?
```

Isso é mentalidade de arquitetura.

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-268-archunit-regras-arquiteturais
```

E o workflow:

```text
.github/workflows/aula-268-archunit.yml
```

A estrutura será:

```text
.github
└── workflows
    └── aula-268-archunit.yml

labs
└── m11
    └── aula-268-archunit-regras-arquiteturais
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula268
            │                       ├── controller
            │                       │   └── PedidoController.java
            │                       ├── domain
            │                       │   ├── Pedido.java
            │                       │   └── StatusPedido.java
            │                       ├── repository
            │                       │   ├── PedidoRepository.java
            │                       │   └── PedidoRepositoryEmMemoria.java
            │                       └── service
            │                           └── PedidoService.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula268
                                    └── ArchitectureTest.java
```

A arquitetura didática será:

```text
controller -> service -> repository -> domain
service -> domain
repository -> domain
domain -> ninguém do projeto
```

Em outras palavras:

```text
controller pode chamar service;
service pode chamar repository e domain;
repository pode usar domain;
domain não deve depender de controller, service ou repository.
```

Vamos criar regras para proteger isso.

---

## 4. Conceitos essenciais antes da prática

### 4.1 Arquitetura quebra aos poucos

Arquitetura raramente quebra com um commit enorme e óbvio.

Ela quebra assim:

```text
só dessa vez o controller chama repository;
só dessa vez o domain importa uma classe de infra;
só dessa vez criamos uma classe Utils global;
só dessa vez pulamos a service;
só dessa vez colocamos regra de negócio no controller;
só dessa vez uma classe de repository chama service.
```

Cada exceção parece pequena.

Depois de meses, ninguém entende mais as fronteiras.

O código vira:

```text
camadas misturadas;
dependências circulares;
regras duplicadas;
testes difíceis;
alterações arriscadas;
manutenção lenta.
```

ArchUnit ajuda a bloquear esse desgaste.

---

### 4.2 O que é teste arquitetural

Teste arquitetural é um teste que valida estrutura do código.

Ele não valida necessariamente comportamento de negócio.

Ele valida regras como:

```text
classes do pacote domain não devem depender de repository;
classes controller devem terminar com Controller;
classes service devem terminar com Service;
repositories devem implementar interfaces;
controllers não devem acessar repositories diretamente;
não deve haver ciclos entre pacotes;
camada superior não deve ser acessada por camada inferior.
```

Exemplo de pergunta:

```text
o pacote service depende do pacote controller?
```

Se depender, provavelmente há inversão errada.

---

### 4.3 O que é ArchUnit

ArchUnit é uma biblioteca Java para verificar arquitetura de código.

Ela analisa bytecode Java e permite escrever regras em código Java.

A documentação oficial define ArchUnit como uma biblioteca simples e extensível para verificar arquitetura de código Java, incluindo dependências entre pacotes e classes, camadas, slices e ciclos.

A grande vantagem é:

```text
você testa arquitetura usando JUnit.
```

Então a arquitetura entra no pipeline como teste.

Se alguém violar uma regra, o build falha.

---

### 4.4 ArchUnit não substitui arquiteto

ArchUnit não decide arquitetura por você.

Ele apenas automatiza regras que você definiu.

Você precisa saber:

```text
qual arquitetura deseja proteger;
quais pacotes representam camadas;
quais dependências são permitidas;
quais exceções fazem sentido;
quais regras agregam valor;
quais regras são exageradas.
```

Ferramenta sem critério vira burocracia.

Ferramenta com critério vira governança técnica.

---

### 4.5 Regra arquitetural vs regra de estilo

Checkstyle e Spotless cuidam de coisas como:

```text
formatação;
imports;
nomes;
chaves;
linhas;
padrão mecânico.
```

ArchUnit cuida de coisas como:

```text
dependência entre pacotes;
camadas;
ciclos;
acesso indevido;
convenção arquitetural;
separação de responsabilidades.
```

Exemplo:

```text
Nome de método fora do padrão:
Checkstyle.

Controller acessando repository diretamente:
ArchUnit.
```

---

### 4.6 Pacotes como fronteiras

Em Java, pacotes ajudam a expressar arquitetura.

Exemplo:

```text
br.com.curso.aula268.controller
br.com.curso.aula268.service
br.com.curso.aula268.repository
br.com.curso.aula268.domain
```

Esses pacotes comunicam intenção.

Mas sem teste, nada impede alguém de criar dependência indevida.

ArchUnit usa pacotes para criar regras.

Exemplo:

```text
classes em ..domain.. não devem depender de ..repository..
```

---

### 4.7 Dependência permitida vs dependência proibida

Uma arquitetura em camadas normalmente permite fluxo em uma direção.

Exemplo:

```text
controller -> service -> repository -> domain
```

Mas não deveria permitir:

```text
domain -> repository
repository -> controller
service -> controller
controller -> repository direto
```

Regra profissional:

```text
dependência deve apontar para partes mais estáveis e menos externas.
```

Em arquiteturas mais avançadas, como hexagonal, domínio fica no centro e infraestrutura depende do domínio, não o contrário.

---

### 4.8 Ciclos de dependência

Ciclo acontece quando componentes dependem uns dos outros em círculo.

Exemplo:

```text
pacote A depende de B;
B depende de C;
C depende de A.
```

Ciclos dificultam:

```text
testes;
refatoração;
entendimento;
build;
modularização;
evolução.
```

ArchUnit pode detectar ciclos entre slices/pacotes.

Nesta aula, veremos uma regra simples de ausência de ciclos.

---

### 4.9 Quando usar ArchUnit

Use ArchUnit para proteger regras arquiteturais importantes.

Exemplos:

```text
camadas;
módulos;
fronteiras;
dependências proibidas;
convenções de nome;
regras de acesso;
ausência de ciclos;
domínio independente de infraestrutura;
controllers sem regra de negócio;
repositories não acessando camada web.
```

---

### 4.10 Quando evitar exagero

Não use ArchUnit para criar prisão artificial.

Exemplos ruins:

```text
mil regras frágeis;
regras que mudam toda semana;
regras sem motivo;
regras que bloqueiam refatoração saudável;
regras impossíveis em legado;
regras que ninguém entende.
```

Critério profissional:

```text
uma regra arquitetural deve proteger uma decisão importante.
```

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-268-archunit-regras-arquiteturais
cd labs\m11\aula-268-archunit-regras-arquiteturais

mkdir src\main\java\br\com\curso\aula268\controller
mkdir src\main\java\br\com\curso\aula268\domain
mkdir src\main\java\br\com\curso\aula268\repository
mkdir src\main\java\br\com\curso\aula268\service
mkdir src\test\java\br\com\curso\aula268
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-268-archunit-regras-arquiteturais/src/main/java/br/com/curso/aula268/controller
mkdir -p labs/m11/aula-268-archunit-regras-arquiteturais/src/main/java/br/com/curso/aula268/domain
mkdir -p labs/m11/aula-268-archunit-regras-arquiteturais/src/main/java/br/com/curso/aula268/repository
mkdir -p labs/m11/aula-268-archunit-regras-arquiteturais/src/main/java/br/com/curso/aula268/service
mkdir -p labs/m11/aula-268-archunit-regras-arquiteturais/src/test/java/br/com/curso/aula268
cd labs/m11/aula-268-archunit-regras-arquiteturais
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
    <artifactId>aula-268-archunit-regras-arquiteturais</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <archunit.version>1.4.2</archunit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.tngtech.archunit</groupId>
            <artifactId>archunit-junit5</artifactId>
            <version>${archunit.version}</version>
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
        <finalName>aula-268-archunit-regras-arquiteturais</finalName>

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
            </plugin>
        </plugins>
    </build>
</project>
```

Observação:

```text
A documentação oficial do ArchUnit informa a versão 1.4.2 no guia de usuário e mostra a dependência com.tngtech.archunit:archunit-junit5 para JUnit 5.
```

Em projeto real, confirme a versão mais atual antes de atualizar dependências.

---

### 5.3 Criar o domínio

Crie:

```text
src/main/java/br/com/curso/aula268/domain/StatusPedido.java
```

Conteúdo:

```java
package br.com.curso.aula268.domain;

public enum StatusPedido {
    NOVO,
    PAGO,
    CANCELADO
}
```

Agora crie:

```text
src/main/java/br/com/curso/aula268/domain/Pedido.java
```

Conteúdo:

```java
package br.com.curso.aula268.domain;

import java.math.BigDecimal;
import java.util.Objects;

public record Pedido(
        String codigo,
        BigDecimal valor,
        StatusPedido status
) {
    public Pedido {
        Objects.requireNonNull(codigo, "codigo não pode ser nulo");
        Objects.requireNonNull(valor, "valor não pode ser nulo");
        Objects.requireNonNull(status, "status não pode ser nulo");

        if (codigo.isBlank()) {
            throw new IllegalArgumentException("codigo não pode ser vazio");
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("valor deve ser maior que zero");
        }
    }

    public boolean podeFaturar() {
        return status == StatusPedido.PAGO;
    }
}
```

O pacote `domain` deve ser o mais independente.

Ele não deve depender de:

```text
controller;
service;
repository;
infraestrutura;
framework web.
```

Nesta aula, vamos proteger isso.

---

### 5.4 Criar repository

Crie:

```text
src/main/java/br/com/curso/aula268/repository/PedidoRepository.java
```

Conteúdo:

```java
package br.com.curso.aula268.repository;

import br.com.curso.aula268.domain.Pedido;

import java.util.Optional;

public interface PedidoRepository {

    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);
}
```

Agora crie:

```text
src/main/java/br/com/curso/aula268/repository/PedidoRepositoryEmMemoria.java
```

Conteúdo:

```java
package br.com.curso.aula268.repository;

import br.com.curso.aula268.domain.Pedido;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class PedidoRepositoryEmMemoria implements PedidoRepository {

    private final Map<String, Pedido> pedidos = new HashMap<>();

    @Override
    public void salvar(Pedido pedido) {
        pedidos.put(pedido.codigo(), pedido);
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        return Optional.ofNullable(pedidos.get(codigo));
    }
}
```

Repository depende do domínio.

Isso faz sentido.

O repository manipula `Pedido`.

Mas o domínio não deve depender do repository.

---

### 5.5 Criar service

Crie:

```text
src/main/java/br/com/curso/aula268/service/PedidoService.java
```

Conteúdo:

```java
package br.com.curso.aula268.service;

import br.com.curso.aula268.domain.Pedido;
import br.com.curso.aula268.repository.PedidoRepository;

import java.math.BigDecimal;

public class PedidoService {

    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public void registrar(Pedido pedido) {
        repository.salvar(pedido);
    }

    public BigDecimal calcularValorFaturavel(String codigo) {
        Pedido pedido = repository.buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("pedido não encontrado: " + codigo));

        if (!pedido.podeFaturar()) {
            return BigDecimal.ZERO;
        }

        return pedido.valor();
    }
}
```

Service depende de:

```text
domain;
repository.
```

Isso faz sentido na arquitetura didática desta aula.

---

### 5.6 Criar controller

Crie:

```text
src/main/java/br/com/curso/aula268/controller/PedidoController.java
```

Conteúdo:

```java
package br.com.curso.aula268.controller;

import br.com.curso.aula268.domain.Pedido;
import br.com.curso.aula268.service.PedidoService;

import java.math.BigDecimal;

public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    public void criarPedido(Pedido pedido) {
        service.registrar(pedido);
    }

    public BigDecimal consultarValorFaturavel(String codigo) {
        return service.calcularValorFaturavel(codigo);
    }
}
```

Controller depende de:

```text
service;
domain.
```

Nesta arquitetura, o controller não deve depender diretamente de repository.

Se um controller chama repository, ele pula a camada de serviço.

Isso é o tipo de coisa que ArchUnit pode bloquear.

---

### 5.7 Criar teste de arquitetura

Crie:

```text
src/test/java/br/com/curso/aula268/ArchitectureTest.java
```

Conteúdo:

```java
package br.com.curso.aula268;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(
        packages = "br.com.curso.aula268",
        importOptions = ImportOption.DoNotIncludeTests.class
)
class ArchitectureTest {

    @ArchTest
    static final ArchRule domain_nao_deve_depender_das_outras_camadas = classes()
            .that().resideInAPackage("..domain..")
            .should().onlyDependOnClassesThat().resideInAnyPackage(
                    "java..",
                    "javax..",
                    "br.com.curso.aula268.domain.."
            );

    @ArchTest
    static final ArchRule controller_nao_deve_acessar_repository_diretamente = classes()
            .that().resideInAPackage("..controller..")
            .should().onlyAccessClassesThat().resideOutsideOfPackage("..repository..");

    @ArchTest
    static final ArchRule repository_nao_deve_depender_de_controller = classes()
            .that().resideInAPackage("..repository..")
            .should().onlyDependOnClassesThat().resideOutsideOfPackage("..controller..");

    @ArchTest
    static final ArchRule services_devem_ter_nome_service = classes()
            .that().resideInAPackage("..service..")
            .should().haveSimpleNameEndingWith("Service");

    @ArchTest
    static final ArchRule controllers_devem_ter_nome_controller = classes()
            .that().resideInAPackage("..controller..")
            .should().haveSimpleNameEndingWith("Controller");

    @ArchTest
    static final ArchRule repositories_devem_ter_nome_repository = classes()
            .that().resideInAPackage("..repository..")
            .and().areInterfaces()
            .should().haveSimpleNameEndingWith("Repository");

    @ArchTest
    static final ArchRule camadas_devem_respeitar_fluxo_definido = layeredArchitecture()
            .consideringOnlyDependenciesInLayers()
            .layer("Controller").definedBy("..controller..")
            .layer("Service").definedBy("..service..")
            .layer("Repository").definedBy("..repository..")
            .layer("Domain").definedBy("..domain..")
            .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
            .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
            .whereLayer("Repository").mayOnlyBeAccessedByLayers("Service")
            .whereLayer("Domain").mayOnlyBeAccessedByLayers("Controller", "Service", "Repository");

    @ArchTest
    static final ArchRule pacotes_nao_devem_ter_ciclos = slices()
            .matching("br.com.curso.aula268.(*)..")
            .should().beFreeOfCycles();
}
```

Esse teste é o centro da aula.

Ele transforma decisões arquiteturais em regras automatizadas.

---

### 5.8 Rodar testes localmente

Execute:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar, leia a mensagem do ArchUnit.

As mensagens costumam indicar:

```text
qual regra falhou;
qual classe violou;
qual dependência indevida aconteceu.
```

---

### 5.9 Criar violação proposital

Para entender o valor do ArchUnit, faça um teste controlado.

Abra:

```text
PedidoController.java
```

E altere temporariamente para depender de repository direto:

```java
package br.com.curso.aula268.controller;

import br.com.curso.aula268.domain.Pedido;
import br.com.curso.aula268.repository.PedidoRepository;
import br.com.curso.aula268.service.PedidoService;

import java.math.BigDecimal;

public class PedidoController {

    private final PedidoService service;
    private final PedidoRepository repository;

    public PedidoController(PedidoService service, PedidoRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    public void criarPedido(Pedido pedido) {
        repository.salvar(pedido);
    }

    public BigDecimal consultarValorFaturavel(String codigo) {
        return service.calcularValorFaturavel(codigo);
    }
}
```

Rode:

```powershell
mvn clean test
```

O ArchUnit deve falhar.

Isso mostra que a regra protege a arquitetura.

Depois volte o controller para a versão correta.

Rode novamente:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Esse experimento é importante.

Ele mostra que ArchUnit não é teoria.

Ele bloqueia violação real.

---

### 5.10 Criar workflow da aula 268

Volte para a raiz do repositório.

No PowerShell:

```powershell
cd ..\..\..
```

Crie a pasta de workflows se necessário:

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
.github/workflows/aula-268-archunit.yml
```

Conteúdo:

```yaml
name: Aula 268 - ArchUnit

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
  arquitetura:
    name: Regras arquiteturais com ArchUnit
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-268-archunit-regras-arquiteturais

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Configurar Java 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Exibir versões Java e Maven
        run: |
          java -version
          mvn -version

      - name: Rodar testes arquiteturais
        run: mvn -B clean test

      - name: Publicar relatórios Surefire
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-268-surefire-reports
          path: labs/m11/aula-268-archunit-regras-arquiteturais/target/surefire-reports
          if-no-files-found: error
```

Esse workflow faz a arquitetura virar parte da esteira.

Se alguém violar as regras, o Pull Request falha.

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que usar @AnalyzeClasses

```java
@AnalyzeClasses(
        packages = "br.com.curso.aula268",
        importOptions = ImportOption.DoNotIncludeTests.class
)
```

Essa anotação diz ao ArchUnit:

```text
importe as classes do pacote br.com.curso.aula268;
ignore classes de teste.
```

ArchUnit analisa bytecode.

Por isso, ele consegue enxergar dependências reais entre classes.

---

### 6.2 Por que usar @ArchTest

```java
@ArchTest
static final ArchRule regra = ...
```

`@ArchTest` marca uma regra arquitetural.

O suporte JUnit 5 do ArchUnit executa essas regras como testes.

Isso reduz boilerplate e integra com o ciclo normal do Maven.

---

### 6.3 Por que proteger domain

A regra:

```java
domain_nao_deve_depender_das_outras_camadas
```

é uma das mais importantes.

Domínio é onde ficam conceitos de negócio.

Se domínio começa a depender de controller, repository ou infraestrutura, a regra de negócio fica acoplada.

Isso dificulta:

```text
testar;
reusar;
evoluir;
migrar tecnologia;
trocar banco;
trocar interface.
```

Em arquiteturas mais avançadas, domínio deve ser ainda mais protegido.

---

### 6.4 Por que controller não deve acessar repository direto

Controller representa entrada.

Repository representa persistência.

Se controller chama repository diretamente, a camada de serviço perde sentido.

Problemas:

```text
regra de negócio pode ir para controller;
validação fica espalhada;
transação fica confusa;
testes ficam acoplados;
fluxo de aplicação fica difícil de seguir.
```

Por isso, a regra protege:

```text
controller -> service -> repository
```

---

### 6.5 Por que validar nomes

Regras como:

```java
services_devem_ter_nome_service
controllers_devem_ter_nome_controller
```

parecem simples, mas ajudam em consistência.

Em projetos grandes, convenções ajudam a navegar.

Exemplo:

```text
PedidoService;
PedidoController;
PedidoRepository.
```

Isso não garante qualidade, mas reduz ambiguidade.

---

### 6.6 Por que validar camadas

A regra com:

```java
layeredArchitecture()
```

é mais expressiva.

Ela declara:

```text
quais camadas existem;
quais pacotes pertencem a cada camada;
quem pode acessar quem.
```

Isso transforma uma decisão arquitetural em código.

Em vez de ficar só no README:

```text
controllers não acessam repositories
```

você coloca isso no teste.

---

### 6.7 Por que validar ciclos

A regra:

```java
slices()
        .matching("br.com.curso.aula268.(*)..")
        .should().beFreeOfCycles();
```

tenta detectar ciclos entre pacotes principais.

Ciclo é perigoso porque cria acoplamento circular.

Arquiteturas boas tendem a ter dependências mais direcionais.

---

### 6.8 Por que não criar regras demais agora

Nesta aula, criamos regras essenciais.

Poderíamos criar muitas outras, mas isso pode atrapalhar.

Exemplos de regras futuras:

```text
exceptions devem ficar em pacote específico;
DTOs não devem entrar no domínio;
controllers não devem conter BigDecimal;
repositories devem ser interfaces;
classes de domínio não devem ter sufixo Entity;
serviços não devem acessar java.sql;
nenhuma classe deve depender de System.out;
nenhuma classe fora de infra deve usar HttpClient direto.
```

Essas regras podem ser úteis.

Mas precisam fazer sentido para a arquitetura escolhida.

---

### 6.9 ArchUnit em legado

Em projeto legado, ligar muitas regras de uma vez pode quebrar tudo.

Estratégia possível:

```text
começar com poucas regras;
proteger código novo;
criar baseline;
corrigir violações por etapa;
não bloquear entrega crítica sem plano;
documentar exceções temporárias;
remover exceções com prazo.
```

Em projeto novo, é mais fácil começar com regra desde o início.

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Regra falha e mensagem parece grande

ArchUnit pode mostrar mensagens longas.

Leia por partes:

```text
qual regra falhou;
qual classe violou;
qual dependência foi detectada;
de onde para onde;
em qual método ou campo.
```

Não apague regra no desespero.

Entenda a violação.

---

### 7.2 Pacote errado na regra

Se você escreveu:

```text
..services..
```

mas o pacote real é:

```text
..service..
```

a regra pode não pegar nada.

Atenção ao nome exato dos pacotes.

Use:

```text
controller
service
repository
domain
```

conforme criado no laboratório.

---

### 7.3 Regra não encontra classes

Causas comuns:

```text
package base errado;
classes não compilaram;
teste não está rodando;
surefire não encontrou teste;
classe está fora do pacote importado.
```

Verifique:

```java
@AnalyzeClasses(packages = "br.com.curso.aula268")
```

E rode:

```powershell
mvn clean test
```

---

### 7.4 Regra muito rígida

Se uma regra gera mais dor que valor, revise.

Pergunte:

```text
essa regra protege uma decisão real?
ela evita problema recorrente?
ela está clara para o time?
há exceções legítimas?
o pacote está bem modelado?
```

ArchUnit deve ajudar, não virar armadilha.

---

### 7.5 Camada domain precisa usar biblioteca Java

Na regra do domain, permitimos:

```text
java..
javax..
br.com.curso.aula268.domain..
```

Isso permite classes padrão da JDK.

Se você usar outra dependência legítima no domínio, talvez precise ajustar.

Mas cuidado.

Adicionar dependência externa ao domínio deve ser decisão consciente.

---

### 7.6 Classes de teste interferindo

Por isso usamos:

```java
ImportOption.DoNotIncludeTests.class
```

Sem isso, ArchUnit pode analisar testes também.

Normalmente, regras arquiteturais miram produção.

---

### 7.7 Falha no pipeline mas local passa

Possíveis causas:

```text
arquivo não commitado;
Java diferente;
Maven diferente;
path errado no workflow;
teste não rodou local com clean;
alteração local não enviada.
```

Rode:

```bash
git status
mvn clean test
```

No GitHub Actions, veja os relatórios Surefire.

---

### 7.8 Regra de ciclo aponta dependência difícil

Ciclos podem ser confusos.

Quando ArchUnit apontar ciclo:

```text
A -> B -> C -> A
```

não tente quebrar no chute.

Pergunte:

```text
qual pacote deveria ser mais estável?
qual direção correta da dependência?
preciso extrair interface?
preciso mover classe?
preciso separar responsabilidade?
```

Ciclo é sintoma de acoplamento.

---

## 8. Exercício prático principal

### Missão

Criar testes arquiteturais com ArchUnit para proteger camadas.

Você deve criar:

```text
labs/m11/aula-268-archunit-regras-arquiteturais
.github/workflows/aula-268-archunit.yml
```

O projeto deve conter:

```text
pom.xml;
domain/Pedido.java;
domain/StatusPedido.java;
repository/PedidoRepository.java;
repository/PedidoRepositoryEmMemoria.java;
service/PedidoService.java;
controller/PedidoController.java;
test/ArchitectureTest.java.
```

O teste arquitetural deve validar:

```text
domain não depende das outras camadas;
controller não acessa repository diretamente;
repository não depende de controller;
services terminam com Service;
controllers terminam com Controller;
interfaces de repository terminam com Repository;
camadas respeitam fluxo definido;
pacotes principais não têm ciclos.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21;
rodar mvn clean test;
publicar relatórios Surefire.
```

---

### Roteiro local

Dentro do laboratório:

```powershell
mvn clean test
```

Faça uma violação proposital:

```text
controller importando repository
```

Rode:

```powershell
mvn clean test
```

Confirme que falha.

Depois corrija e rode de novo:

```powershell
mvn clean test
```

---

### Roteiro no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-268-archunit-regras-arquiteturais
git add .github/workflows/aula-268-archunit.yml
git commit -m "Aula 268: archunit regras arquiteturais"
git push
```

Depois no GitHub:

```text
Actions;
Aula 268 - ArchUnit;
abrir execução;
verificar testes arquiteturais;
baixar surefire reports se necessário.
```

---

### Critérios de aceite

A aula está concluída quando:

```text
mvn clean test passa localmente;
ArchUnit está configurado com JUnit 5;
@AnalyzeClasses importa o pacote correto;
@ArchTest executa regras;
domain está protegido;
controller não acessa repository;
repository não depende de controller;
nomes de camadas são validados;
layeredArchitecture valida fluxo;
slices valida ausência de ciclos;
workflow roda no GitHub Actions;
você consegue explicar por que cada regra existe.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. Por que arquitetura quebra aos poucos?
2. O que é teste arquitetural?
3. O que é ArchUnit?
4. ArchUnit substitui arquiteto?
5. Qual diferença entre Checkstyle e ArchUnit?
6. Para que serve @AnalyzeClasses?
7. Para que serve @ArchTest?
8. Por que proteger o pacote domain?
9. Por que controller não deve acessar repository direto?
10. Por que repository não deve depender de controller?
11. Para que serve layeredArchitecture?
12. Para que serve slices().should().beFreeOfCycles()?
13. O que é ciclo de dependência?
14. Quando criar regra arquitetural?
15. Quando evitar regra arquitetural?
16. Como ArchUnit ajuda no Pull Request?
17. Como ArchUnit prepara DDD e arquitetura hexagonal?
18. O que fazer quando uma regra falha?
19. Como lidar com legado?
20. Como essa aula prepara o mini-projeto da aula 269?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 268.
[ ] Configurei ArchUnit no pom.xml.
[ ] Criei pacotes controller, service, repository e domain.
[ ] Criei código respeitando a arquitetura.
[ ] Criei ArchitectureTest.
[ ] Usei @AnalyzeClasses.
[ ] Usei @ArchTest.
[ ] Criei regra para proteger domain.
[ ] Criei regra para controller não acessar repository.
[ ] Criei regra para repository não depender de controller.
[ ] Criei regra de nomes.
[ ] Criei regra de layeredArchitecture.
[ ] Criei regra contra ciclos.
[ ] Rodei mvn clean test local.
[ ] Testei violação proposital.
[ ] Criei workflow da aula 268.
[ ] Entendi por que ArchUnit é ferramenta de arquitetura.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a automatizar regras arquiteturais com ArchUnit.

Você estudou:

```text
arquitetura quebrando aos poucos;
teste arquitetural;
ArchUnit;
bytecode;
pacotes como fronteiras;
dependências permitidas;
dependências proibidas;
camadas;
domain;
controller;
service;
repository;
@AnalyzeClasses;
@ArchTest;
layeredArchitecture;
slices;
ciclos;
convenções de nome;
validação em pipeline.
```

A ideia principal é:

```text
arquitetura não deve existir apenas em desenho, reunião ou README.
As decisões arquiteturais importantes podem e devem ser protegidas por testes automatizados.
```

Agora o M11 está quase fechado.

Você já acumulou ferramentas profissionais importantes:

```text
Docker Compose;
PostgreSQL;
Redis;
CI/CD;
GitHub Actions;
Maven pipeline;
JaCoCo;
Docker pipeline;
Checkstyle;
Spotless;
SCA;
SBOM;
Dependabot;
Testcontainers;
WireMock;
ArchUnit.
```

A próxima aula será uma consolidação prática.

A próxima aula será:

```text
269 — M11.25 — Mini-projeto ferramentas: pipeline, Docker, Testcontainers, WireMock, ArchUnit e qualidade
```

Nela, vamos juntar as principais ferramentas do M11 em um mini-projeto controlado, preparando o fechamento do módulo 270.

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL completo.

Vamos consolidar ferramentas antes de avançar para o próximo módulo.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-268-archunit-regras-arquiteturais
git add .github/workflows/aula-268-archunit.yml
git commit -m "Aula 268: archunit regras arquiteturais"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-268-archunit
git add labs/m11/aula-268-archunit-regras-arquiteturais
git add .github/workflows/aula-268-archunit.yml
git commit -m "Aula 268: archunit regras arquiteturais"
git push -u origin feature/aula-268-archunit
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 268 — M11.24 — ArchUnit: regras arquiteturais automatizadas e proteção de camadas

Nesta aula, aprendi a usar ArchUnit para transformar decisões arquiteturais em testes automatizados.

Criei o laboratório `labs/m11/aula-268-archunit-regras-arquiteturais`, configurei Maven com Java 21, JUnit 5 e `archunit-junit5`, e montei uma estrutura simples com pacotes `controller`, `service`, `repository` e `domain`.

Implementei regras arquiteturais com `@AnalyzeClasses` e `@ArchTest`, protegendo o domínio contra dependências indevidas, impedindo controller de acessar repository diretamente, validando convenções de nomes, verificando fluxo de camadas com `layeredArchitecture` e evitando ciclos entre pacotes com `slices`.

Também criei um workflow em `.github/workflows/aula-268-archunit.yml` para rodar as regras arquiteturais no GitHub Actions.

O principal aprendizado foi que arquitetura não deve ficar apenas em documentação ou combinados verbais: decisões importantes podem ser validadas automaticamente no pipeline.
```

---

## Referências oficiais consultadas

Esta aula foi elaborada considerando a documentação oficial do ArchUnit.

Pontos importantes utilizados:

```text
ArchUnit é uma biblioteca Java para verificar arquitetura de código;
a ferramenta pode checar dependências entre pacotes e classes, camadas, slices e ciclos;
ArchUnit analisa bytecode Java;
ArchUnit possui suporte para JUnit 5 por meio do artefato com.tngtech.archunit:archunit-junit5;
a versão 1.4.2 aparece na documentação oficial como versão atual no guia consultado;
@AnalyzeClasses e @ArchTest fazem parte do suporte de ArchUnit para testes arquiteturais com JUnit 5.
```
