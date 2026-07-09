# 262 — M11.18 — Pipeline Maven com testes, JaCoCo, relatórios e artefatos

## 1. Objetivo da aula

Na aula 261, você criou seu primeiro workflow com GitHub Actions.

Você estudou:

```text
CI;
CD;
pipeline;
GitHub Actions;
workflow;
gatilhos;
push;
pull_request;
workflow_dispatch;
job;
runner;
step;
action;
checkout;
setup-java;
Java 21;
working-directory;
mvn clean test;
logs de execução;
validação em Pull Request.
```

Aquela aula foi propositalmente inicial.

Ela respondeu:

```text
como um workflow nasce?
quando ele roda?
onde ele roda?
como preparar Java?
como rodar Maven?
como saber se passou ou falhou?
```

Agora vamos evoluir.

Nesta aula, o foco será transformar aquele pipeline básico em um pipeline Maven mais profissional.

Você vai aprender a gerar evidências.

Em projeto real, um pipeline não serve apenas para dizer:

```text
passou
```

ou:

```text
falhou
```

Ele precisa gerar rastreabilidade técnica.

Isso inclui:

```text
resultado dos testes;
relatórios;
cobertura de código;
artefatos de build;
logs úteis;
evidência para Pull Request;
insumos para quality gate futuro.
```

Ao final desta aula, você deve conseguir:

```text
entender o papel do Maven em um pipeline;
entender lifecycle Maven aplicado a CI;
entender diferença entre test, verify e package;
configurar JaCoCo em projeto Maven;
gerar relatório de cobertura local;
gerar relatório de cobertura no pipeline;
separar testes e empacotamento;
gerar JAR como artefato;
publicar relatórios como artifacts do GitHub Actions;
publicar o JAR como artifact;
entender o que é artifact em CI;
entender por que relatórios são evidência técnica;
diagnosticar falhas comuns de Maven, testes e JaCoCo;
preparar a base para quality gate, SonarQube e pipelines mais maduros.
```

Esta aula continua o M11.

Ainda não vamos para SQL.

Ainda não vamos para Spring Boot.

Ainda não vamos para Docker no pipeline.

Docker entra na aula 263.

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

A aula 261 ensinou a estrutura de um workflow.

A aula 262 ensina a tornar esse workflow útil para um projeto Java Maven.

A evolução é esta:

```text
Aula 261:
rodar mvn clean test.

Aula 262:
rodar testes, gerar cobertura, empacotar, publicar relatórios e artefatos.

Aula 263:
buildar imagem Docker, versionar tag e preparar publicação.
```

Perceba o desenho pedagógico.

Primeiro você entende o workflow.

Depois entende build e evidência.

Depois entende imagem e entrega.

Isso forma raciocínio, não apenas cópia de YAML.

---

## 3. O que vamos construir

Vamos criar um laboratório em:

```text
labs/m11/aula-262-pipeline-maven-jacoco
```

E um workflow em:

```text
.github/workflows/aula-262-pipeline-maven.yml
```

A estrutura final será:

```text
.github
└── workflows
    └── aula-262-pipeline-maven.yml

labs
└── m11
    └── aula-262-pipeline-maven-jacoco
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula262
            │                       ├── CalculadoraDeFrete.java
            │                       ├── Pedido.java
            │                       └── TipoCliente.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula262
                                    └── CalculadoraDeFreteTest.java
```

O projeto será simples, mas com uma regra de negócio um pouco mais real que a aula anterior.

Vamos simular cálculo de frete para pedido.

O pipeline fará:

```text
checkout do repositório;
setup do Java 21;
cache Maven;
execução de testes;
execução de verify;
geração do relatório JaCoCo;
empacotamento do JAR;
upload do relatório de testes;
upload do relatório JaCoCo;
upload do JAR gerado.
```

A ideia é você sair da aula sabendo montar uma primeira esteira de CI com evidências.

---

## 4. Conceitos essenciais antes da prática

### 4.1 Pipeline Maven não é só mvn test

Na aula 261, usamos:

```bash
mvn -B clean test
```

Isso é bom para começar.

Mas em projetos profissionais, normalmente queremos mais.

Exemplo:

```text
compilar;
rodar testes;
gerar relatório de testes;
medir cobertura;
validar fase verify;
gerar pacote;
guardar artefatos.
```

O Maven tem um ciclo de vida.

Esse ciclo é chamado de lifecycle.

---

### 4.2 Lifecycle Maven aplicado ao pipeline

Algumas fases importantes:

```text
validate;
compile;
test;
package;
verify;
install;
deploy.
```

Explicando de forma prática:

```text
validate:
verifica se o projeto está minimamente correto.

compile:
compila o código principal.

test:
roda testes automatizados.

package:
empacota o projeto, por exemplo em JAR.

verify:
executa verificações adicionais.

install:
instala artefato no repositório local Maven.

deploy:
publica artefato em repositório remoto Maven.
```

Nesta aula, vamos usar principalmente:

```text
test;
verify;
package.
```

Na prática, o comando mais importante será:

```bash
mvn -B clean verify
```

Por quê?

Porque `verify` é uma fase mais completa que `test`.

Quando você roda `verify`, o Maven executa as fases anteriores necessárias.

Então ele passa por:

```text
validate;
compile;
test;
package;
verify.
```

Dependendo dos plugins configurados, `verify` também pode disparar validações extras.

É por isso que muitos pipelines usam:

```bash
mvn clean verify
```

em vez de apenas:

```bash
mvn clean test
```

---

### 4.3 O que é JaCoCo

JaCoCo é uma ferramenta de cobertura de código para Java.

Cobertura de código responde:

```text
quais partes do código foram executadas pelos testes?
```

Exemplo simples:

```text
Classe com 100 linhas.
Testes executaram 80 linhas.
Cobertura aproximada de linhas: 80%.
```

Mas cuidado.

Cobertura não significa qualidade absoluta.

Um teste pode executar uma linha e mesmo assim não validar direito.

Exemplo ruim:

```java
servico.processarPedido(pedido);
assertThat(true).isTrue();
```

Esse teste pode aumentar cobertura, mas não prova comportamento.

Então a regra é:

```text
cobertura ajuda, mas não substitui teste bem escrito.
```

---

### 4.4 Tipos comuns de cobertura

JaCoCo mostra métricas como:

```text
instructions;
branches;
lines;
methods;
classes.
```

Para começar, foque em:

```text
line coverage;
branch coverage.
```

Line coverage indica linhas executadas.

Branch coverage indica caminhos condicionais cobertos.

Exemplo:

```java
if (clienteVip) {
    aplicarDesconto();
} else {
    calcularNormal();
}
```

Se seu teste só cobre cliente VIP, o outro caminho fica descoberto.

Em backend, branch coverage ajuda muito porque regras de negócio costumam ter:

```text
if;
switch;
validações;
status;
regras por tipo;
caminhos de erro;
exceções.
```

---

### 4.5 O que é relatório de teste

Quando Maven roda testes com Surefire, ele gera relatórios em:

```text
target/surefire-reports
```

Ali ficam arquivos que mostram:

```text
quais testes rodaram;
quantos passaram;
quantos falharam;
tempo de execução;
erros;
stack traces.
```

Em pipeline, esses arquivos são úteis para diagnóstico.

Se o pipeline falha, o relatório ajuda a responder:

```text
qual teste quebrou?
qual mensagem?
qual stack trace?
em qual classe?
em qual método?
```

---

### 4.6 O que é artifact no GitHub Actions

Artifact é um arquivo ou pasta que o workflow guarda ao final da execução.

Exemplos:

```text
relatório de teste;
relatório de cobertura;
JAR gerado;
logs;
evidências;
HTML de relatório;
arquivo compactado.
```

Na interface do GitHub Actions, você consegue baixar esses artifacts depois da execução.

Isso é importante porque o runner é descartável.

Quando o job termina, a máquina some.

Se você não publicar o que precisa, perde os arquivos gerados.

Por isso usamos:

```yaml
actions/upload-artifact
```

---

### 4.7 Diferença entre build artifact e deployment artifact

Nesta aula, artifact significa:

```text
arquivo gerado pelo pipeline e armazenado como evidência.
```

Exemplo:

```text
JAR;
relatório JaCoCo;
relatório Surefire.
```

Em deploy, artifact pode significar o pacote que será entregue em ambiente.

Exemplo:

```text
JAR publicado;
imagem Docker;
chart Helm;
pacote versionado.
```

Na aula 263, o artifact mais importante começará a ser a imagem Docker.

Nesta aula, o foco é Maven.

---

### 4.8 Por que publicar relatórios no pipeline

Sem relatório, o pipeline vira uma caixa preta.

Você só vê:

```text
passou;
falhou.
```

Com relatórios, você tem evidência.

Exemplo:

```text
testes executados;
cobertura gerada;
JAR empacotado;
arquivos baixáveis;
histórico de execução.
```

Isso ajuda em:

```text
Pull Request;
auditoria;
investigação de falhas;
acompanhamento de qualidade;
quality gate futuro;
evolução do projeto.
```

Um backend profissional precisa gerar evidência.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-262-pipeline-maven-jacoco
cd labs\m11\aula-262-pipeline-maven-jacoco

mkdir src\main\java\br\com\curso\aula262
mkdir src\test\java\br\com\curso\aula262
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-262-pipeline-maven-jacoco/src/main/java/br/com/curso/aula262
mkdir -p labs/m11/aula-262-pipeline-maven-jacoco/src/test/java/br/com/curso/aula262
cd labs/m11/aula-262-pipeline-maven-jacoco
```

---

### 5.2 Criar o pom.xml com JaCoCo

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
    <artifactId>aula-262-pipeline-maven-jacoco</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <jacoco.version>0.8.12</jacoco.version>
    </properties>

    <dependencies>
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
        <finalName>aula-262-pipeline-maven-jacoco</finalName>

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

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.4.1</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>br.com.curso.aula262.CalculadoraDeFrete</mainClass>
                        </manifest>
                    </archive>
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
        </plugins>
    </build>
</project>
```

---

### 5.3 Entender a configuração do JaCoCo

Este bloco:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>${jacoco.version}</version>
    ...
</plugin>
```

adiciona o plugin JaCoCo ao build Maven.

A execução:

```xml
<goal>prepare-agent</goal>
```

prepara o agente do JaCoCo para acompanhar a execução dos testes.

A execução:

```xml
<goal>report</goal>
```

gera o relatório.

E este trecho:

```xml
<phase>verify</phase>
```

diz que o relatório será gerado na fase `verify`.

Por isso usaremos:

```bash
mvn clean verify
```

Se você rodar apenas:

```bash
mvn clean test
```

os testes rodam, mas o relatório HTML do JaCoCo pode não ser gerado, porque o report está preso à fase `verify`.

---

### 5.4 Criar o enum TipoCliente

Crie:

```text
src/main/java/br/com/curso/aula262/TipoCliente.java
```

Conteúdo:

```java
package br.com.curso.aula262;

public enum TipoCliente {
    COMUM,
    VIP,
    CORPORATIVO
}
```

---

### 5.5 Criar o record Pedido

Crie:

```text
src/main/java/br/com/curso/aula262/Pedido.java
```

Conteúdo:

```java
package br.com.curso.aula262;

import java.math.BigDecimal;
import java.util.Objects;

public record Pedido(
        BigDecimal valor,
        BigDecimal distanciaKm,
        TipoCliente tipoCliente
) {
    public Pedido {
        Objects.requireNonNull(valor, "valor não pode ser nulo");
        Objects.requireNonNull(distanciaKm, "distanciaKm não pode ser nula");
        Objects.requireNonNull(tipoCliente, "tipoCliente não pode ser nulo");

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("valor deve ser maior que zero");
        }

        if (distanciaKm.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("distanciaKm deve ser maior que zero");
        }
    }
}
```

Aqui já temos um pouco de regra de domínio.

Um pedido não pode ter:

```text
valor nulo;
distância nula;
tipo de cliente nulo;
valor menor ou igual a zero;
distância menor ou igual a zero.
```

Isso gera caminhos de teste interessantes para cobertura.

---

### 5.6 Criar a CalculadoraDeFrete

Crie:

```text
src/main/java/br/com/curso/aula262/CalculadoraDeFrete.java
```

Conteúdo:

```java
package br.com.curso.aula262;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculadoraDeFrete {

    private static final BigDecimal VALOR_POR_KM = new BigDecimal("1.25");
    private static final BigDecimal FRETE_MINIMO = new BigDecimal("12.00");
    private static final BigDecimal LIMITE_FRETE_GRATIS = new BigDecimal("500.00");

    public BigDecimal calcular(Pedido pedido) {
        BigDecimal freteBase = pedido.distanciaKm().multiply(VALOR_POR_KM);

        BigDecimal freteComMinimo = aplicarFreteMinimo(freteBase);

        BigDecimal freteComDesconto = aplicarDescontoPorTipoCliente(freteComMinimo, pedido.tipoCliente());

        BigDecimal freteFinal = aplicarFreteGratisParaPedidoAltoValor(freteComDesconto, pedido.valor());

        return freteFinal.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal aplicarFreteMinimo(BigDecimal freteBase) {
        if (freteBase.compareTo(FRETE_MINIMO) < 0) {
            return FRETE_MINIMO;
        }

        return freteBase;
    }

    private BigDecimal aplicarDescontoPorTipoCliente(BigDecimal frete, TipoCliente tipoCliente) {
        return switch (tipoCliente) {
            case COMUM -> frete;
            case VIP -> frete.multiply(new BigDecimal("0.80"));
            case CORPORATIVO -> frete.multiply(new BigDecimal("0.70"));
        };
    }

    private BigDecimal aplicarFreteGratisParaPedidoAltoValor(BigDecimal frete, BigDecimal valorPedido) {
        if (valorPedido.compareTo(LIMITE_FRETE_GRATIS) >= 0) {
            return BigDecimal.ZERO;
        }

        return frete;
    }
}
```

Essa classe tem regras suficientes para mostrar cobertura.

Temos:

```text
frete por km;
frete mínimo;
desconto por tipo de cliente;
frete grátis para pedido acima de certo valor;
uso de BigDecimal;
switch moderno;
métodos privados coesos.
```

---

### 5.7 Criar testes de comportamento

Crie:

```text
src/test/java/br/com/curso/aula262/CalculadoraDeFreteTest.java
```

Conteúdo:

```java
package br.com.curso.aula262;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("CalculadoraDeFrete")
class CalculadoraDeFreteTest {

    private final CalculadoraDeFrete calculadora = new CalculadoraDeFrete();

    @Test
    @DisplayName("deve aplicar frete mínimo quando cálculo por distância for baixo")
    void deveAplicarFreteMinimo() {
        Pedido pedido = new Pedido(
                new BigDecimal("100.00"),
                new BigDecimal("2.00"),
                TipoCliente.COMUM
        );

        BigDecimal frete = calculadora.calcular(pedido);

        assertThat(frete).isEqualByComparingTo("12.00");
    }

    @Test
    @DisplayName("deve calcular frete comum com base na distância")
    void deveCalcularFreteComumComBaseNaDistancia() {
        Pedido pedido = new Pedido(
                new BigDecimal("100.00"),
                new BigDecimal("20.00"),
                TipoCliente.COMUM
        );

        BigDecimal frete = calculadora.calcular(pedido);

        assertThat(frete).isEqualByComparingTo("25.00");
    }

    @Test
    @DisplayName("deve aplicar desconto para cliente VIP")
    void deveAplicarDescontoParaClienteVip() {
        Pedido pedido = new Pedido(
                new BigDecimal("100.00"),
                new BigDecimal("20.00"),
                TipoCliente.VIP
        );

        BigDecimal frete = calculadora.calcular(pedido);

        assertThat(frete).isEqualByComparingTo("20.00");
    }

    @Test
    @DisplayName("deve aplicar desconto para cliente corporativo")
    void deveAplicarDescontoParaClienteCorporativo() {
        Pedido pedido = new Pedido(
                new BigDecimal("100.00"),
                new BigDecimal("20.00"),
                TipoCliente.CORPORATIVO
        );

        BigDecimal frete = calculadora.calcular(pedido);

        assertThat(frete).isEqualByComparingTo("17.50");
    }

    @Test
    @DisplayName("deve aplicar frete grátis para pedido de alto valor")
    void deveAplicarFreteGratisParaPedidoDeAltoValor() {
        Pedido pedido = new Pedido(
                new BigDecimal("500.00"),
                new BigDecimal("40.00"),
                TipoCliente.COMUM
        );

        BigDecimal frete = calculadora.calcular(pedido);

        assertThat(frete).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("deve rejeitar pedido com valor zero")
    void deveRejeitarPedidoComValorZero() {
        assertThatThrownBy(() -> new Pedido(
                BigDecimal.ZERO,
                new BigDecimal("10.00"),
                TipoCliente.COMUM
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("valor deve ser maior que zero");
    }

    @Test
    @DisplayName("deve rejeitar pedido com distância zero")
    void deveRejeitarPedidoComDistanciaZero() {
        assertThatThrownBy(() -> new Pedido(
                new BigDecimal("100.00"),
                BigDecimal.ZERO,
                TipoCliente.COMUM
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("distanciaKm deve ser maior que zero");
    }

    @Test
    @DisplayName("deve rejeitar pedido com tipo de cliente nulo")
    void deveRejeitarTipoClienteNulo() {
        assertThatThrownBy(() -> new Pedido(
                new BigDecimal("100.00"),
                new BigDecimal("10.00"),
                null
        ))
                .isInstanceOf(NullPointerException.class)
                .hasMessage("tipoCliente não pode ser nulo");
    }
}
```

Esses testes cobrem:

```text
caminho comum;
frete mínimo;
VIP;
corporativo;
frete grátis;
valor inválido;
distância inválida;
tipo nulo.
```

É um exemplo pequeno, mas suficiente para gerar relatório útil.

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

Agora execute:

```powershell
mvn clean verify
```

Resultado esperado:

```text
BUILD SUCCESS
```

Depois verifique a pasta:

```powershell
dir target
```

Você deve ver itens como:

```text
classes
generated-sources
generated-test-sources
maven-archiver
maven-status
site
surefire-reports
test-classes
aula-262-pipeline-maven-jacoco.jar
```

---

### 5.9 Ver relatório do JaCoCo localmente

Depois de rodar:

```powershell
mvn clean verify
```

abra:

```text
target/site/jacoco/index.html
```

No Windows, você pode abrir pelo Explorer.

Ou no PowerShell:

```powershell
start target\site\jacoco\index.html
```

No Linux:

```bash
xdg-open target/site/jacoco/index.html
```

No macOS:

```bash
open target/site/jacoco/index.html
```

Observe:

```text
cobertura por pacote;
cobertura por classe;
linhas cobertas;
linhas não cobertas;
branches;
métodos.
```

Não fique obcecado com 100%.

O objetivo é entender a evidência.

---

### 5.10 Criar o workflow da aula 262

Volte para a raiz do repositório.

No PowerShell, se estiver dentro do laboratório:

```powershell
cd ..\..\..
```

Crie a pasta se ainda não existir:

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
.github/workflows/aula-262-pipeline-maven.yml
```

Conteúdo:

```yaml
name: Aula 262 - Pipeline Maven com JaCoCo

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
  pipeline-maven:
    name: Testes, cobertura e artefatos Maven
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-262-pipeline-maven-jacoco

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Configurar Java 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Exibir versões
        run: |
          java -version
          mvn -version

      - name: Rodar testes e gerar cobertura
        run: mvn -B clean verify

      - name: Listar arquivos gerados
        run: |
          echo "Conteúdo de target:"
          ls -la target
          echo "Relatórios Surefire:"
          ls -la target/surefire-reports
          echo "Relatório JaCoCo:"
          ls -la target/site/jacoco

      - name: Publicar relatórios de testes
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-262-surefire-reports
          path: labs/m11/aula-262-pipeline-maven-jacoco/target/surefire-reports
          if-no-files-found: error

      - name: Publicar relatório JaCoCo
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-262-jacoco-report
          path: labs/m11/aula-262-pipeline-maven-jacoco/target/site/jacoco
          if-no-files-found: error

      - name: Publicar JAR
        uses: actions/upload-artifact@v4
        with:
          name: aula-262-jar
          path: labs/m11/aula-262-pipeline-maven-jacoco/target/*.jar
          if-no-files-found: error
```

Esse workflow já é bem mais profissional que o da aula 261.

Ele gera evidências e permite baixar relatórios.

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que usar mvn clean verify

Usamos:

```bash
mvn -B clean verify
```

porque queremos:

```text
limpar build anterior;
compilar;
rodar testes;
empacotar;
gerar relatório JaCoCo na fase verify.
```

Se usássemos apenas:

```bash
mvn clean test
```

os testes passariam, mas a fase `verify` não seria executada.

Como o relatório JaCoCo foi configurado para `verify`, ele não seria gerado da mesma forma.

---

### 6.2 Por que usar if: always nos relatórios

Observe:

```yaml
if: always()
```

nos steps de upload dos relatórios.

Isso significa:

```text
tente publicar os relatórios mesmo se um step anterior falhar.
```

Por que isso é útil?

Porque se os testes falharem, ainda queremos baixar os relatórios para investigar.

Sem isso, em algumas falhas, você perde a evidência.

Atenção:

```text
if: always() não conserta pipeline quebrado.
Ele apenas ajuda a preservar evidências.
```

---

### 6.3 Por que publicar o JAR

Este step:

```yaml
- name: Publicar JAR
  uses: actions/upload-artifact@v4
```

guarda o JAR gerado.

Em um projeto real, esse JAR poderia ser:

```text
artefato para teste;
artefato para análise;
entrada para imagem Docker;
pacote publicado em repositório interno;
evidência de build.
```

Nesta aula, não vamos fazer deploy do JAR.

Apenas vamos publicá-lo como artifact.

---

### 6.4 Por que usar if-no-files-found: error

Este trecho:

```yaml
if-no-files-found: error
```

diz ao pipeline:

```text
se o arquivo ou pasta esperada não existir, falhe.
```

Isso evita falso positivo.

Sem esse cuidado, você poderia achar que publicou relatório, mas o caminho estava errado.

Em pipeline profissional, falso positivo é perigoso.

Pipeline verde sem evidência pode esconder problema.

---

### 6.5 Por que listar arquivos gerados

Este step:

```yaml
- name: Listar arquivos gerados
```

ajuda a diagnosticar.

Quando você está aprendendo ou montando pipeline novo, listar arquivos mostra:

```text
se target existe;
se o JAR foi gerado;
se surefire-reports existe;
se site/jacoco existe;
se o caminho usado no upload está correto.
```

Em pipeline maduro, talvez você remova esse step ou deixe apenas em modo diagnóstico.

Mas durante construção, ele é excelente.

---

### 6.6 O que os artifacts provam

Ao final da execução, você deve conseguir baixar:

```text
aula-262-surefire-reports;
aula-262-jacoco-report;
aula-262-jar.
```

Isso prova que:

```text
testes foram executados;
relatório de teste foi gerado;
cobertura foi calculada;
JAR foi empacotado;
pipeline gerou evidência.
```

Esse é um passo importante para maturidade.

---

### 6.7 Onde isso aparece em empresa

Em um projeto Java Backend real, um pipeline Maven costuma gerar:

```text
relatório de testes unitários;
relatório de testes de integração;
cobertura JaCoCo;
relatório Sonar;
artefato JAR;
imagem Docker;
SBOM;
resultado de scan;
evidências de qualidade.
```

Em Pull Request, o time pode olhar:

```text
se os testes passaram;
se a cobertura caiu;
se o quality gate falhou;
se o build quebrou;
se o artefato foi gerado.
```

Em ambientes regulados ou empresas grandes, evidência técnica importa muito.

---

### 6.8 Quando evitar pipeline pesado demais

Pipeline ajuda, mas pipeline exagerado atrapalha.

Exemplos ruins:

```text
rodar teste lento em todo commit pequeno;
fazer deploy em todo push sem controle;
rodar scan pesado em branch de rascunho;
misturar CI com deploy sem aprovação;
colocar tudo em um job gigante impossível de diagnosticar.
```

Critério profissional:

```text
pipeline deve proteger sem travar o time desnecessariamente.
```

Por isso, muitas empresas separam:

```text
pipeline de PR;
pipeline de branch principal;
pipeline noturno;
pipeline de release;
pipeline manual de deploy.
```

Nesta formação, vamos evoluir aos poucos.

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Relatório JaCoCo não aparece

Possíveis causas:

```text
rodou mvn test em vez de mvn verify;
plugin JaCoCo não está no pom.xml;
fase report não está vinculada a verify;
testes não rodaram;
caminho target/site/jacoco está errado.
```

Verifique:

```bash
mvn clean verify
```

E confirme:

```text
target/site/jacoco/index.html
```

---

### 7.2 Upload artifact falha por caminho errado

Erro comum:

```text
No files were found with the provided path
```

Causas:

```text
working-directory confundiu o caminho;
path do upload está relativo à raiz do repositório;
relatório não foi gerado;
nome da pasta está diferente.
```

Atenção importante:

```text
defaults.run.working-directory afeta comandos run.
Não muda o caminho do upload-artifact.
```

Por isso usamos caminho completo relativo à raiz:

```yaml
path: labs/m11/aula-262-pipeline-maven-jacoco/target/site/jacoco
```

---

### 7.3 Teste falha no pipeline mas passa local

Possíveis causas:

```text
arquivo não commitado;
teste dependente de horário;
teste dependente de idioma/localidade;
teste dependente de sistema operacional;
teste dependente de ordem;
diferença de Java;
diferença de Maven;
dependência local que só existe na sua máquina.
```

Diagnóstico:

```text
confira logs;
baixe surefire-reports;
confira java -version;
confira mvn -version;
rode mvn clean verify local;
confira git status.
```

---

### 7.4 JAR não é publicado

Possíveis causas:

```text
mvn verify falhou antes do package;
finalName diferente;
path target/*.jar incorreto;
projeto não empacota JAR;
upload não encontrou arquivo.
```

Verifique no step:

```yaml
Listar arquivos gerados
```

Procure:

```text
target/aula-262-pipeline-maven-jacoco.jar
```

---

### 7.5 Pipeline verde mesmo sem validar o que importa

Esse é um erro conceitual.

Exemplo:

```yaml
run: echo "ok"
```

O pipeline passa, mas não valida nada.

Outro exemplo:

```yaml
run: mvn -DskipTests package
```

Pode gerar pacote sem rodar testes.

Isso pode ser intencional em alguns contextos, mas não deve ser usado sem critério.

Regra:

```text
pipeline precisa validar aquilo que promete validar.
```

---

### 7.6 Cobertura baixa não significa necessariamente pipeline quebrado

Nesta aula, apenas geramos relatório.

Ainda não configuramos uma regra para falhar se cobertura ficar abaixo de um limite.

Isso será tratado com mais critério em aulas futuras, especialmente com qualidade e governança.

Por enquanto:

```text
JaCoCo mede;
pipeline publica;
você analisa.
```

Mais tarde:

```text
quality gate decide;
pipeline bloqueia;
time governa.
```

---

### 7.7 Erro de permissão em GitHub Actions

Para esta aula, usamos:

```yaml
permissions:
  contents: read
```

Isso basta para:

```text
checkout;
rodar Maven;
publicar artifacts.
```

Se no futuro você publicar packages, imagens ou comentar em PR, permissões extras podem ser necessárias.

Não aumente permissão por chute.

Aumente por necessidade.

---

## 8. Exercício prático principal

### Missão

Criar um pipeline Maven com testes, JaCoCo, relatórios e artefatos.

Você deve criar:

```text
labs/m11/aula-262-pipeline-maven-jacoco
.github/workflows/aula-262-pipeline-maven.yml
```

O projeto deve ter:

```text
pom.xml com JUnit 5, AssertJ e JaCoCo;
TipoCliente.java;
Pedido.java;
CalculadoraDeFrete.java;
CalculadoraDeFreteTest.java.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21 Temurin;
usar cache Maven;
rodar mvn -B clean verify;
gerar relatório Surefire;
gerar relatório JaCoCo;
gerar JAR;
publicar surefire-reports como artifact;
publicar relatório JaCoCo como artifact;
publicar JAR como artifact.
```

---

### Roteiro de validação local

Dentro da pasta do laboratório:

```powershell
mvn clean test
mvn clean verify
dir target
```

Abra:

```powershell
start target\site\jacoco\index.html
```

Confirme:

```text
testes passaram;
JAR foi criado;
relatório JaCoCo foi criado;
surefire-reports foi criado.
```

---

### Roteiro de validação no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-262-pipeline-maven-jacoco
git add .github/workflows/aula-262-pipeline-maven.yml
git commit -m "Aula 262: pipeline Maven com JaCoCo e artefatos"
git push
```

Depois no GitHub:

```text
Actions;
Aula 262 - Pipeline Maven com JaCoCo;
abrir execução;
abrir job;
conferir steps;
baixar artifacts.
```

Confirme que existem:

```text
aula-262-surefire-reports;
aula-262-jacoco-report;
aula-262-jar.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. Por que mvn verify é mais completo que mvn test?
2. O que o JaCoCo mede?
3. Cobertura alta garante teste bom?
4. Onde o Maven gera relatórios Surefire?
5. Onde o JaCoCo gera relatório HTML?
6. O que é artifact no GitHub Actions?
7. Por que publicar artifacts?
8. Por que usar if: always() nos relatórios?
9. Por que upload-artifact usa caminho relativo à raiz?
10. O que pode causar relatório JaCoCo ausente?
11. O que pode causar JAR ausente?
12. Por que pipeline verde sem evidência pode ser perigoso?
13. Por que listar arquivos gerados ajuda no diagnóstico?
14. Qual diferença entre artifact de build e artifact de deploy?
15. Como essa aula prepara a aula 263?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 262.
[ ] Configurei pom.xml com JaCoCo.
[ ] Criei regra de negócio simples.
[ ] Criei testes com JUnit 5 e AssertJ.
[ ] Rodei mvn clean test.
[ ] Rodei mvn clean verify.
[ ] Abri o relatório JaCoCo local.
[ ] Criei workflow da aula 262.
[ ] Publiquei relatório Surefire como artifact.
[ ] Publiquei relatório JaCoCo como artifact.
[ ] Publiquei JAR como artifact.
[ ] Entendi por que artifacts são evidência.
[ ] Entendi diferença entre test, package e verify.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você evoluiu de um workflow básico para um pipeline Maven com evidências.

Você estudou:

```text
lifecycle Maven;
test;
package;
verify;
JaCoCo;
cobertura de código;
line coverage;
branch coverage;
relatórios Surefire;
relatório HTML do JaCoCo;
artifacts no GitHub Actions;
upload-artifact;
if: always();
JAR como artefato;
diagnóstico de caminhos;
evidência técnica em Pull Request.
```

A ideia principal é:

```text
pipeline profissional não apenas executa comandos; ele produz evidências confiáveis sobre a qualidade e o estado do projeto.
```

A partir de agora, quando você olhar um pipeline Java, precisa perguntar:

```text
o que ele valida?
o que ele gera?
que evidência fica disponível?
se falhar, consigo diagnosticar?
se passar, posso confiar?
```

Na próxima aula, vamos continuar a evolução natural.

A próxima aula será:

```text
263 — M11.19 — Pipeline Docker: build, tags, registry, secrets e imagem versionada
```

Nela, vamos sair do artifact JAR e entrar no artifact de runtime moderno:

```text
imagem Docker.
```

Vamos estudar:

```text
docker build no pipeline;
tags;
hash de commit;
versionamento de imagem;
registry;
GitHub Container Registry;
secrets;
permissões;
boas práticas iniciais de supply chain.
```

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL.

Vamos fechar ferramentas profissionais antes de avançar.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-262-pipeline-maven-jacoco
git add .github/workflows/aula-262-pipeline-maven.yml
git commit -m "Aula 262: pipeline Maven com JaCoCo e artefatos"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-262-pipeline-maven
git add labs/m11/aula-262-pipeline-maven-jacoco
git add .github/workflows/aula-262-pipeline-maven.yml
git commit -m "Aula 262: pipeline Maven com JaCoCo e artefatos"
git push -u origin feature/aula-262-pipeline-maven
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 262 — M11.18 — Pipeline Maven com testes, JaCoCo, relatórios e artefatos

Nesta aula, evoluí o workflow básico de CI para um pipeline Maven com evidências técnicas.

Criei o laboratório `labs/m11/aula-262-pipeline-maven-jacoco`, configurei um projeto Maven com Java 21, JUnit 5, AssertJ e JaCoCo, e implementei uma regra simples de cálculo de frete para praticar testes automatizados.

Aprendi a diferença prática entre `mvn test`, `mvn package` e `mvn verify`, entendendo por que a fase `verify` é importante para gerar relatórios como o JaCoCo.

Configurei o GitHub Actions em `.github/workflows/aula-262-pipeline-maven.yml` para rodar `mvn -B clean verify`, gerar relatórios de teste, gerar relatório de cobertura, empacotar o JAR e publicar tudo como artifacts.

Também entendi que um pipeline profissional não serve apenas para passar ou falhar: ele precisa produzir evidências confiáveis para diagnóstico, Pull Request, qualidade e evolução do projeto.
```
