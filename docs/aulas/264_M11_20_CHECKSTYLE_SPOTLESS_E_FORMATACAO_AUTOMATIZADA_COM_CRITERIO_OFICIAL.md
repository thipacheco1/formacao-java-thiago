# 264 — M11.20 — Checkstyle, Spotless e formatação automatizada com critério

## 1. Objetivo da aula

Na aula 263, você evoluiu o pipeline para trabalhar com Docker.

Você estudou:

```text
Docker image como artifact de runtime;
diferença entre JAR e imagem Docker;
registry;
GitHub Container Registry;
tags;
latest;
sha;
imagem versionada;
GITHUB_TOKEN;
packages: write;
Docker Buildx;
docker/login-action;
docker/metadata-action;
docker/build-push-action;
Dockerfile multi-stage;
.dockerignore;
build local;
container local;
publicação condicional;
Pull Request sem push de imagem.
```

Agora vamos tratar de um problema muito comum em times de desenvolvimento:

```text
padrão de código.
```

Em projetos reais, muitas discussões de code review não são sobre regra de negócio.

São sobre coisas como:

```text
indentação;
espaço;
linha em branco;
ordem de import;
chave na linha certa;
nome de variável;
arquivo sem quebra de linha final;
classe grande demais;
método longo demais;
import não usado;
formatação diferente entre devs;
estilo inconsistente.
```

Parte disso pode e deve ser automatizada.

Nesta aula, vamos estudar duas ferramentas importantes:

```text
Checkstyle;
Spotless.
```

O objetivo não é transformar estilo em religião.

O objetivo é aprender a criar um padrão técnico que reduz ruído, protege consistência e melhora a vida do time.

Ao final desta aula, você deve conseguir:

```text
entender por que padronização importa;
diferenciar estilo, formatação e qualidade;
entender o papel do Checkstyle;
entender o papel do Spotless;
configurar Checkstyle em projeto Maven;
configurar Spotless em projeto Maven;
criar regras mínimas de estilo;
rodar verificação local;
rodar formatação automática local;
integrar validação no GitHub Actions;
entender quando usar check e quando usar apply;
evitar discussões inúteis em code review;
diagnosticar erros comuns de formatação e estilo;
preparar base para quality gate, governança e padrão de time.
```

Esta aula continua o M11.

Ainda não vamos para SQL.

Ainda não vamos para Spring Boot.

Ainda não vamos para segurança de dependências.

A próxima aula será sobre:

```text
SCA, SBOM, Dependabot e supply chain.
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
267 — WireMock
268 — ArchUnit
269 — Mini-projeto ferramentas
270 — Fechamento do M11
```

A aula 264 entra em uma habilidade que diferencia times maduros de times improvisados.

Um time imaturo costuma discutir estilo manualmente em todo Pull Request.

Um time maduro automatiza boa parte disso.

Exemplo de comentário ruim em PR:

```text
faltou espaço aqui
quebra essa linha
organiza imports
essa chave deveria estar em outra posição
esse arquivo está sem quebra de linha final
```

Exemplo de postura mais profissional:

```text
o padrão está automatizado;
rode mvn spotless:apply;
o pipeline valida;
o review humano foca em design, regra de negócio, testes e riscos.
```

Essa mudança parece pequena, mas melhora muito a produtividade.

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-264-checkstyle-spotless
```

E o workflow:

```text
.github/workflows/aula-264-checkstyle-spotless.yml
```

A estrutura será:

```text
.github
└── workflows
    └── aula-264-checkstyle-spotless.yml

labs
└── m11
    └── aula-264-checkstyle-spotless
        ├── checkstyle.xml
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula264
            │                       ├── Pedido.java
            │                       ├── PedidoService.java
            │                       └── StatusPedido.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula264
                                    └── PedidoServiceTest.java
```

Neste laboratório, você vai configurar:

```text
maven-checkstyle-plugin;
spotless-maven-plugin;
arquivo checkstyle.xml;
formatação Google Java Format via Spotless;
remoção de imports não usados;
organização básica;
validação no pipeline.
```

O fluxo será:

```text
1. Criar projeto Java Maven.
2. Criar código simples.
3. Criar testes.
4. Configurar Checkstyle.
5. Configurar Spotless.
6. Rodar validações localmente.
7. Rodar formatação automática.
8. Integrar ao GitHub Actions.
```

---

## 4. Conceitos essenciais antes da prática

### 4.1 Estilo não é só estética

Quando falamos de estilo de código, muita gente pensa:

```text
isso é frescura.
```

Mas em projeto grande, consistência importa.

Código inconsistente causa:

```text
mais ruído em code review;
mais dificuldade de leitura;
mais conflitos desnecessários;
mais tempo discutindo detalhe;
menos foco em regra de negócio;
padrão diferente por desenvolvedor;
custo maior de manutenção.
```

Um padrão automatizado ajuda o time a falar:

```text
não vamos discutir gosto pessoal;
vamos seguir o padrão combinado e automatizado.
```

Isso libera o code review para assuntos melhores:

```text
arquitetura;
responsabilidade;
testes;
regra de negócio;
risco;
segurança;
performance;
legibilidade real.
```

---

### 4.2 Formatação vs estilo vs qualidade

Esses conceitos se misturam, mas não são iguais.

## Formatação

Formatação envolve aparência mecânica.

Exemplos:

```text
indentação;
quebra de linha;
espaços;
chaves;
ordem visual;
linha final.
```

Ferramenta típica:

```text
Spotless.
```

## Estilo

Estilo envolve convenções.

Exemplos:

```text
nome de classe;
nome de variável;
tamanho de linha;
import com wildcard;
classe utilitária;
visibilidade;
Javadoc obrigatório em alguns casos.
```

Ferramenta típica:

```text
Checkstyle.
```

## Qualidade

Qualidade envolve risco, manutenção e comportamento.

Exemplos:

```text
complexidade;
duplicação;
bugs;
vulnerabilidades;
testabilidade;
cobertura;
design.
```

Ferramentas típicas:

```text
SonarQube;
JaCoCo;
ArchUnit;
SCA;
testes.
```

Nesta aula, o foco é:

```text
formatação e estilo.
```

---

### 4.3 O que é Checkstyle

Checkstyle é uma ferramenta que verifica se o código Java segue regras de estilo.

Ele pode validar coisas como:

```text
nome de classe;
nome de método;
tamanho máximo de linha;
imports com wildcard;
chaves;
espaços;
linha final;
modificadores;
Javadoc;
estrutura do código.
```

Checkstyle normalmente falha o build quando encontra violação.

Ou seja:

```text
não corrige automaticamente;
aponta o problema;
obriga o time a corrigir.
```

Ele é útil para regras de convenção.

---

### 4.4 O que é Spotless

Spotless é uma ferramenta de formatação.

No Java, ele pode usar formatadores como:

```text
google-java-format;
Eclipse formatter;
Palantir Java Format.
```

Nesta aula, vamos usar:

```text
googleJavaFormat
```

Spotless pode fazer duas coisas principais:

```text
spotless:check;
spotless:apply.
```

`spotless:check` verifica se o código está formatado.

`spotless:apply` corrige automaticamente.

Regra prática:

```text
dev local usa apply;
pipeline usa check.
```

Por quê?

Porque pipeline não deve sair alterando código.

Pipeline deve validar.

Quem altera é o desenvolvedor localmente.

---

### 4.5 Checkstyle e Spotless competem?

Não.

Eles se complementam.

Exemplo:

```text
Spotless:
corrige formatação automaticamente.

Checkstyle:
valida regras de estilo e convenção.
```

Pode haver sobreposição.

Se você configurar regras duplicadas demais, o time sofre.

O ideal é ter critério.

Não automatize tudo de qualquer jeito.

Automatize aquilo que reduz ruído e melhora consistência.

---

### 4.6 Quando usar com rigor e quando aliviar

Em projeto profissional, padrão importa.

Mas rigidez sem contexto atrapalha.

Exemplos de excesso:

```text
exigir Javadoc em todo getter;
falhar build por detalhe irrelevante;
regras que brigam com o formatador;
limite de linha impossível;
configuração difícil de entender;
muitas regras logo no começo do projeto.
```

Exemplos saudáveis:

```text
bloquear import com wildcard;
garantir newline no fim do arquivo;
aplicar formatador único;
evitar linha longa demais;
validar nomes básicos;
rodar no pipeline;
documentar como corrigir.
```

Regra profissional:

```text
padrão bom é aquele que o time entende, aceita e consegue manter.
```

---

### 4.7 Por que colocar no pipeline

Se o padrão só roda na máquina de quem lembra, ele não é padrão.

Ele é sugestão.

Quando entra no pipeline, vira regra de qualidade.

O pipeline responde:

```text
os testes passam?
a cobertura foi gerada?
o Docker build funciona?
o código segue o padrão mínimo?
```

Isso evita que código fora do padrão entre na branch principal.

---

### 4.8 O papel do IDE

IntelliJ, Eclipse e VS Code podem formatar código.

Mas em time, cada pessoa pode ter configuração diferente.

Por isso, a fonte da verdade não deve ser apenas a IDE.

A fonte da verdade deve estar no repositório:

```text
pom.xml;
checkstyle.xml;
configuração Spotless;
workflow.
```

A IDE ajuda.

O pipeline garante.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-264-checkstyle-spotless
cd labs\m11\aula-264-checkstyle-spotless

mkdir src\main\java\br\com\curso\aula264
mkdir src\test\java\br\com\curso\aula264
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-264-checkstyle-spotless/src/main/java/br/com/curso/aula264
mkdir -p labs/m11/aula-264-checkstyle-spotless/src/test/java/br/com/curso/aula264
cd labs/m11/aula-264-checkstyle-spotless
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
    <artifactId>aula-264-checkstyle-spotless</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>

        <maven.checkstyle.plugin.version>3.3.1</maven.checkstyle.plugin.version>
        <checkstyle.version>10.17.0</checkstyle.version>
        <spotless.version>2.43.0</spotless.version>
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
        <finalName>aula-264-checkstyle-spotless</finalName>

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
                    <pom>
                        <sortPom>
                            <expandEmptyElements>false</expandEmptyElements>
                        </sortPom>
                    </pom>
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
        </plugins>
    </build>
</project>
```

Esse `pom.xml` configura:

```text
Java 21;
JUnit 5;
AssertJ;
Spotless;
Checkstyle;
Surefire;
Compiler plugin.
```

---

### 5.3 Entender os plugins configurados

O plugin Spotless:

```xml
<artifactId>spotless-maven-plugin</artifactId>
```

vai permitir rodar:

```powershell
mvn spotless:check
mvn spotless:apply
```

O plugin Checkstyle:

```xml
<artifactId>maven-checkstyle-plugin</artifactId>
```

vai permitir rodar:

```powershell
mvn checkstyle:check
```

E também será executado na fase:

```text
verify
```

porque configuramos:

```xml
<phase>verify</phase>
```

Isso significa que:

```powershell
mvn clean verify
```

também executará o Checkstyle.

---

### 5.4 Criar o checkstyle.xml

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

        <module name="ClassTypeParameterName"/>
        <module name="MethodTypeParameterName"/>

        <module name="LocalVariableName"/>
        <module name="MemberName"/>
        <module name="MethodName"/>
        <module name="PackageName"/>
        <module name="ParameterName"/>
        <module name="TypeName"/>

        <module name="NeedBraces"/>

        <module name="EqualsHashCode"/>

        <module name="MissingSwitchDefault"/>
    </module>
</module>
```

Essa configuração é propositalmente moderada.

Ela valida pontos úteis:

```text
arquivo com quebra de linha no final;
evitar import com wildcard;
evitar import não usado;
uma classe top-level por arquivo;
padrão básico de nomes;
uso de chaves em if/else/for/while;
equals e hashCode juntos;
switch com default.
```

Não colocamos regras exageradas.

O objetivo é criar padrão sem transformar a aula em sofrimento.

---

### 5.5 Criar o enum StatusPedido

Crie:

```text
src/main/java/br/com/curso/aula264/StatusPedido.java
```

Conteúdo:

```java
package br.com.curso.aula264;

public enum StatusPedido {
  NOVO,
  PAGO,
  CANCELADO
}
```

Observe que a formatação está simples.

O Spotless poderá ajustar conforme o padrão do formatador.

---

### 5.6 Criar o record Pedido

Crie:

```text
src/main/java/br/com/curso/aula264/Pedido.java
```

Conteúdo:

```java
package br.com.curso.aula264;

import java.math.BigDecimal;
import java.util.Objects;

public record Pedido(String codigo, BigDecimal valor, StatusPedido status) {

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

  public boolean pago() {
    return status == StatusPedido.PAGO;
  }

  public boolean cancelado() {
    return status == StatusPedido.CANCELADO;
  }
}
```

Essa classe usa:

```text
record;
BigDecimal;
Objects.requireNonNull;
validação;
métodos de conveniência.
```

---

### 5.7 Criar PedidoService

Crie:

```text
src/main/java/br/com/curso/aula264/PedidoService.java
```

Conteúdo:

```java
package br.com.curso.aula264;

import java.math.BigDecimal;

public class PedidoService {

  public BigDecimal calcularValorParaFaturamento(Pedido pedido) {
    if (pedido.cancelado()) {
      return BigDecimal.ZERO;
    }

    if (!pedido.pago()) {
      return BigDecimal.ZERO;
    }

    return pedido.valor();
  }

  public String gerarResumo(Pedido pedido) {
    return "Pedido " + pedido.codigo() + " - " + pedido.status();
  }
}
```

Aqui temos uma regra simples:

```text
pedido cancelado não fatura;
pedido não pago não fatura;
pedido pago fatura o valor.
```

---

### 5.8 Criar testes

Crie:

```text
src/test/java/br/com/curso/aula264/PedidoServiceTest.java
```

Conteúdo:

```java
package br.com.curso.aula264;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("PedidoService")
class PedidoServiceTest {

  private final PedidoService service = new PedidoService();

  @Test
  @DisplayName("deve faturar pedido pago")
  void deveFaturarPedidoPago() {
    Pedido pedido = new Pedido("PED-001", new BigDecimal("150.00"), StatusPedido.PAGO);

    BigDecimal valor = service.calcularValorParaFaturamento(pedido);

    assertThat(valor).isEqualByComparingTo("150.00");
  }

  @Test
  @DisplayName("deve retornar zero para pedido novo")
  void deveRetornarZeroParaPedidoNovo() {
    Pedido pedido = new Pedido("PED-002", new BigDecimal("150.00"), StatusPedido.NOVO);

    BigDecimal valor = service.calcularValorParaFaturamento(pedido);

    assertThat(valor).isEqualByComparingTo("0.00");
  }

  @Test
  @DisplayName("deve retornar zero para pedido cancelado")
  void deveRetornarZeroParaPedidoCancelado() {
    Pedido pedido = new Pedido("PED-003", new BigDecimal("150.00"), StatusPedido.CANCELADO);

    BigDecimal valor = service.calcularValorParaFaturamento(pedido);

    assertThat(valor).isEqualByComparingTo("0.00");
  }

  @Test
  @DisplayName("deve gerar resumo do pedido")
  void deveGerarResumoDoPedido() {
    Pedido pedido = new Pedido("PED-004", new BigDecimal("99.90"), StatusPedido.PAGO);

    String resumo = service.gerarResumo(pedido);

    assertThat(resumo).isEqualTo("Pedido PED-004 - PAGO");
  }

  @Test
  @DisplayName("deve rejeitar código vazio")
  void deveRejeitarCodigoVazio() {
    assertThatThrownBy(() -> new Pedido(" ", new BigDecimal("10.00"), StatusPedido.NOVO))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("codigo não pode ser vazio");
  }
}
```

---

### 5.9 Rodar testes

Execute:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar, corrija antes de seguir.

---

### 5.10 Rodar Spotless check

Execute:

```powershell
mvn spotless:check
```

Se o código não estiver formatado conforme o padrão, você verá mensagem de erro.

Isso é esperado se o formatador quiser alterar algo.

Agora rode:

```powershell
mvn spotless:apply
```

Esse comando aplica a formatação.

Depois rode novamente:

```powershell
mvn spotless:check
```

Resultado esperado:

```text
BUILD SUCCESS
```

Regra profissional:

```text
localmente você usa spotless:apply;
no pipeline você usa spotless:check.
```

---

### 5.11 Rodar Checkstyle

Execute:

```powershell
mvn checkstyle:check
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar, leia a mensagem.

Exemplo de falha possível:

```text
Using the '.*' form of import should be avoided
```

Isso indica import com wildcard.

Exemplo ruim:

```java
import java.util.*;
```

Exemplo correto:

```java
import java.util.List;
import java.util.Map;
```

---

### 5.12 Rodar verify completo

Execute:

```powershell
mvn clean verify
```

Esse comando deve rodar:

```text
compilação;
testes;
Checkstyle na fase verify.
```

O Spotless não foi preso automaticamente ao `verify` no nosso `pom.xml`.

Por quê?

Porque queremos separar:

```text
formatação:
mvn spotless:check

build/validação:
mvn clean verify
```

No pipeline, vamos rodar os dois explicitamente.

Isso deixa claro o que falhou.

---

### 5.13 Criar workflow da aula 264

Volte para a raiz do repositório.

No PowerShell:

```powershell
cd ..\..\..
```

Crie a pasta se necessário:

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
.github/workflows/aula-264-checkstyle-spotless.yml
```

Conteúdo:

```yaml
name: Aula 264 - Checkstyle e Spotless

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
  estilo-e-formatacao:
    name: Validar estilo e formatação
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-264-checkstyle-spotless

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

      - name: Validar formatação com Spotless
        run: mvn -B spotless:check

      - name: Validar testes e Checkstyle
        run: mvn -B clean verify
```

Esse workflow valida:

```text
formatação;
testes;
estilo.
```

Se alguém subir código fora do padrão, o pipeline fica vermelho.

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que Spotless roda antes do verify

O workflow faz:

```yaml
- name: Validar formatação com Spotless
  run: mvn -B spotless:check
```

antes de:

```yaml
- name: Validar testes e Checkstyle
  run: mvn -B clean verify
```

Motivo:

```text
erro de formatação é rápido de detectar;
mensagem fica clara;
não mistura falha de estilo com teste quebrado;
facilita diagnóstico.
```

Em alguns projetos, tudo roda em um comando só.

Mas para ensino e clareza, separar é melhor.

---

### 6.2 Por que não rodar spotless:apply no pipeline

`spotless:apply` altera arquivos.

Pipeline não deve alterar código e commitar automaticamente sem uma política muito clara.

O padrão saudável é:

```text
desenvolvedor roda apply localmente;
pipeline roda check.
```

Se o pipeline falhar, o dev corrige localmente:

```powershell
mvn spotless:apply
```

Depois commita a correção.

---

### 6.3 Por que Checkstyle roda no verify

Checkstyle foi configurado na fase:

```xml
<phase>verify</phase>
```

Assim:

```powershell
mvn clean verify
```

executa o Checkstyle.

Isso faz sentido porque `verify` é uma fase de validação mais completa.

Na aula 262, você já viu que `verify` é uma fase importante para CI.

Agora ela ganhou mais uma responsabilidade.

---

### 6.4 Por que não exagerar nas regras

A configuração de Checkstyle poderia ser muito mais rígida.

Mas isso nem sempre é bom.

Excesso de regra pode gerar:

```text
frustração;
falso senso de qualidade;
muito tempo corrigindo detalhe;
code review robotizado demais;
time burlando a ferramenta;
pipeline vermelho por motivos pouco importantes.
```

Neste laboratório, usamos regras de bom custo-benefício.

Mais tarde, quando estudarmos arquitetura e governança, regras podem ficar mais sofisticadas.

---

### 6.5 Por que formatar pom.xml

No Spotless configuramos:

```xml
<pom>
    <sortPom>
        <expandEmptyElements>false</expandEmptyElements>
    </sortPom>
</pom>
```

Isso mostra que Spotless pode formatar não apenas Java, mas também outros arquivos.

Em projetos reais, ele pode formatar:

```text
Java;
pom.xml;
Markdown;
YAML;
JSON;
SQL;
Gradle;
Kotlin.
```

Nesta aula, vamos manter foco em Java e POM.

---

### 6.6 Como isso melhora code review

Sem automação, o code review vira:

```text
remove esse espaço;
quebra essa linha;
organiza esse import;
ajusta esse padrão.
```

Com automação, o review humano pode focar em:

```text
essa regra de negócio está correta?
esse teste prova comportamento?
essa classe tem responsabilidade adequada?
essa decisão técnica faz sentido?
há risco de manutenção?
há risco de performance?
há risco de segurança?
```

Essa é a diferença entre um time amador e um time mais maduro.

---

### 6.7 Como isso se conecta com qualidade maior

Checkstyle e Spotless não substituem:

```text
testes;
SonarQube;
JaCoCo;
SCA;
ArchUnit;
review humano.
```

Eles resolvem uma camada específica:

```text
consistência de escrita.
```

A qualidade completa nasce da combinação:

```text
formatação;
estilo;
testes;
cobertura;
análise estática;
arquitetura;
segurança;
observabilidade;
review técnico.
```

---

### 6.8 Quando evitar bloquear demais

Em projetos legados, ativar Checkstyle rígido de uma vez pode quebrar tudo.

Estratégia mais madura:

```text
começar com regras mínimas;
aplicar em código novo;
corrigir aos poucos;
usar baseline quando ferramenta permitir;
evitar travar entregas críticas por estilo antigo;
ter plano de evolução.
```

Em projeto novo, é mais fácil começar certo.

Em legado, é preciso estratégia.

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Spotless falha no pipeline

Erro típico:

```text
The following files had format violations
```

Solução local:

```powershell
mvn spotless:apply
mvn spotless:check
```

Depois:

```bash
git status
git add .
git commit -m "Corrige formatacao Spotless"
git push
```

Não tente corrigir manualmente tudo se a ferramenta pode aplicar.

---

### 7.2 Checkstyle acusa import com wildcard

Erro comum:

```text
Using the '.*' form of import should be avoided
```

Código ruim:

```java
import java.util.*;
```

Código correto:

```java
import java.util.List;
import java.util.Map;
```

No IntelliJ, configure para evitar wildcard imports ou aumente o limite antes de trocar por `*`.

---

### 7.3 Checkstyle acusa MissingSwitchDefault

Se você criar um `switch`, pode aparecer erro exigindo `default`.

Exemplo:

```java
switch (status) {
  case PAGO -> "Pago";
  case NOVO -> "Novo";
}
```

Adicione default quando fizer sentido:

```java
default -> "Desconhecido";
```

Observação:

```text
em alguns casos com enum e switch expression, essa regra pode ser debatida.
```

Regra não é verdade absoluta.

Ela precisa servir ao projeto.

---

### 7.4 Spotless e Checkstyle brigando

Isso pode acontecer quando:

```text
Checkstyle exige uma formatação;
Spotless aplica outra;
as regras são incompatíveis.
```

Solução:

```text
reduzir sobreposição;
deixar formatação para Spotless;
deixar convenções para Checkstyle;
ajustar regras conflitantes.
```

Evite ter duas ferramentas brigando pelo mesmo detalhe.

---

### 7.5 Pipeline falha mas local passa

Possíveis causas:

```text
você esqueceu de commitar arquivo formatado;
Java local diferente;
Maven local diferente;
arquivo com encoding diferente;
quebra de linha Windows/Linux;
configuração local da IDE mascarando problema.
```

Diagnóstico:

```bash
git status
mvn spotless:check
mvn clean verify
```

No GitHub Actions, abra logs dos steps:

```text
Validar formatação com Spotless;
Validar testes e Checkstyle.
```

---

### 7.6 checkstyle.xml não encontrado

Erro comum:

```text
Unable to find configuration file at location: checkstyle.xml
```

Causas:

```text
arquivo não está na pasta do projeto;
nome está errado;
working-directory no pipeline está errado;
arquivo não foi commitado.
```

Verifique:

```text
labs/m11/aula-264-checkstyle-spotless/checkstyle.xml
```

---

### 7.7 Regra boa no papel, ruim no time

Nem toda regra que existe deve ser ativada.

Pergunte:

```text
essa regra melhora legibilidade?
reduz erro real?
ajuda manutenção?
é fácil corrigir?
o time entende?
o benefício compensa o custo?
```

Se a resposta for não, repense.

Ferramenta boa com regra ruim vira obstáculo.

---

## 8. Exercício prático principal

### Missão

Criar um projeto Maven com Checkstyle e Spotless, validado por GitHub Actions.

Você deve criar:

```text
labs/m11/aula-264-checkstyle-spotless
.github/workflows/aula-264-checkstyle-spotless.yml
```

O projeto deve conter:

```text
pom.xml;
checkstyle.xml;
StatusPedido.java;
Pedido.java;
PedidoService.java;
PedidoServiceTest.java.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21;
rodar Spotless check;
rodar testes;
rodar Checkstyle via mvn clean verify.
```

---

### Roteiro local

Dentro do laboratório:

```powershell
mvn clean test
mvn spotless:check
mvn spotless:apply
mvn spotless:check
mvn checkstyle:check
mvn clean verify
```

Se tudo passar, volte para a raiz.

---

### Roteiro no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-264-checkstyle-spotless
git add .github/workflows/aula-264-checkstyle-spotless.yml
git commit -m "Aula 264: checkstyle spotless e formatacao automatizada"
git push
```

Depois, no GitHub:

```text
Actions;
Aula 264 - Checkstyle e Spotless;
abrir execução;
verificar step de Spotless;
verificar step de Maven verify;
confirmar pipeline verde.
```

---

### Experimento didático

Faça um teste controlado.

Altere um arquivo Java deixando formatação ruim.

Exemplo:

```java
public class PedidoService {public String teste(){return "x";}}
```

Rode:

```powershell
mvn spotless:check
```

Deve falhar.

Agora rode:

```powershell
mvn spotless:apply
```

Veja o arquivo corrigido.

Depois rode:

```powershell
mvn spotless:check
```

Deve passar.

Esse exercício mostra o papel real da ferramenta.

---

### Critérios de aceite

A aula está concluída quando:

```text
projeto compila;
testes passam;
spotless:check passa;
spotless:apply corrige formatação;
checkstyle:check passa;
mvn clean verify passa;
workflow roda no GitHub Actions;
pipeline falha se formatação estiver fora do padrão;
pipeline falha se Checkstyle encontrar violação;
você entende diferença entre Spotless e Checkstyle;
você sabe quando usar apply e quando usar check.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. Por que padronização de código importa?
2. Qual diferença entre formatação, estilo e qualidade?
3. Para que serve Spotless?
4. Para que serve Checkstyle?
5. Spotless e Checkstyle fazem a mesma coisa?
6. Qual diferença entre spotless:check e spotless:apply?
7. Por que pipeline deve rodar check e não apply?
8. Para que serve checkstyle.xml?
9. Por que não exagerar nas regras?
10. O que é import com wildcard?
11. Por que formatador reduz ruído em code review?
12. Como Checkstyle se conecta com mvn verify?
13. Por que configuração deve estar no repositório?
14. O que fazer quando Spotless falha?
15. O que fazer quando Checkstyle falha?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 264.
[ ] Configurei Spotless no pom.xml.
[ ] Configurei Checkstyle no pom.xml.
[ ] Criei checkstyle.xml.
[ ] Criei código Java do laboratório.
[ ] Criei testes.
[ ] Rodei mvn clean test.
[ ] Rodei mvn spotless:check.
[ ] Rodei mvn spotless:apply.
[ ] Rodei mvn checkstyle:check.
[ ] Rodei mvn clean verify.
[ ] Criei workflow da aula 264.
[ ] Entendi check vs apply.
[ ] Entendi formatação vs estilo.
[ ] Entendi por que isso melhora code review.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a automatizar formatação e estilo de código Java.

Você estudou:

```text
padronização de código;
diferença entre formatação, estilo e qualidade;
Checkstyle;
Spotless;
googleJavaFormat;
spotless:check;
spotless:apply;
checkstyle:check;
checkstyle.xml;
maven-checkstyle-plugin;
spotless-maven-plugin;
validação no GitHub Actions;
padrão de time;
code review com menos ruído;
riscos de regras exageradas;
troubleshooting de estilo e formatação.
```

A ideia principal é:

```text
um time profissional não deveria gastar energia discutindo detalhe mecânico de formatação em todo Pull Request.
Esse tipo de regra deve ser automatizado, versionado e validado em pipeline.
```

Agora o seu pipeline começa a validar mais do que testes.

Ele já consegue validar:

```text
compilação;
testes;
cobertura;
artefatos;
imagem Docker;
formatação;
estilo.
```

Na próxima aula, vamos subir mais um nível de maturidade.

A próxima aula será:

```text
265 — M11.21 — Segurança de dependências: SCA, SBOM, Dependabot e supply chain
```

Nela, vamos estudar:

```text
por que dependência é risco;
o que é SCA;
o que é SBOM;
o que é supply chain;
como Dependabot ajuda;
como vulnerabilidades entram por bibliotecas;
como pensar segurança no pipeline;
como isso aparece em projetos Java Backend reais.
```

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL.

Vamos concluir a base de ferramentas profissionais com segurança e governança antes de avançar.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-264-checkstyle-spotless
git add .github/workflows/aula-264-checkstyle-spotless.yml
git commit -m "Aula 264: checkstyle spotless e formatacao automatizada"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-264-checkstyle-spotless
git add labs/m11/aula-264-checkstyle-spotless
git add .github/workflows/aula-264-checkstyle-spotless.yml
git commit -m "Aula 264: checkstyle spotless e formatacao automatizada"
git push -u origin feature/aula-264-checkstyle-spotless
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 264 — M11.20 — Checkstyle, Spotless e formatação automatizada com critério

Nesta aula, aprendi a automatizar padrão de código Java usando Checkstyle e Spotless.

Criei o laboratório `labs/m11/aula-264-checkstyle-spotless`, configurei um projeto Maven com Java 21, testes, `spotless-maven-plugin` e `maven-checkstyle-plugin`.

Entendi a diferença entre formatação, estilo e qualidade, e aprendi que Spotless é mais voltado para formatação automática, enquanto Checkstyle valida regras de convenção e estilo.

Também pratiquei os comandos `mvn spotless:check`, `mvn spotless:apply`, `mvn checkstyle:check` e `mvn clean verify`.

Configurei um workflow em `.github/workflows/aula-264-checkstyle-spotless.yml` para validar formatação e estilo no GitHub Actions.

O principal aprendizado foi que um time profissional deve automatizar discussões mecânicas de formatação, deixando o code review focado em regra de negócio, testes, arquitetura, riscos e decisões técnicas.
```
