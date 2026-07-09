# 265 — M11.21 — Segurança de dependências: SCA, SBOM, Dependabot e supply chain

## 1. Objetivo da aula

Na aula 264, você aprendeu a automatizar padrão de código com Checkstyle e Spotless.

Você estudou:

```text
padronização de código;
diferença entre formatação, estilo e qualidade;
Spotless;
Checkstyle;
googleJavaFormat;
spotless:check;
spotless:apply;
checkstyle:check;
validação no pipeline;
redução de ruído em code review;
padrão de time.
```

Agora vamos subir mais um nível na maturidade profissional.

Vamos falar de um tema que todo desenvolvedor backend precisa conhecer:

```text
segurança de dependências e supply chain.
```

Em Java Backend, você raramente escreve tudo do zero.

Você usa bibliotecas como:

```text
Spring;
Hibernate;
Jackson;
PostgreSQL Driver;
JUnit;
AssertJ;
Mockito;
Logback;
Apache Commons;
Lombok;
Flyway;
Kafka clients;
Redis clients;
OpenAPI;
Micrometer.
```

Cada dependência ajuda, mas também cria risco.

Uma vulnerabilidade pode entrar no seu sistema não pelo seu código direto, mas por uma biblioteca que você importou.

Essa é a ideia central da aula.

Ao final desta aula, você deve conseguir:

```text
entender o que é segurança de dependências;
entender o que é supply chain em software;
entender o que é SCA;
entender o que é SBOM;
entender o que é Dependabot;
entender o que é Dependency Review;
entender dependência direta e transitiva;
entender CVE, severidade e falso positivo;
configurar Dependabot para Maven e GitHub Actions;
configurar geração de SBOM com CycloneDX;
gerar SBOM localmente;
publicar SBOM como artifact no pipeline;
configurar Dependency Review em Pull Request;
entender limites dessas ferramentas;
criar uma rotina mínima de governança de dependências;
preparar o terreno para supply chain mais avançado.
```

Esta aula continua o M11.

Ainda não vamos para SQL.

Ainda não vamos para Spring Boot.

Ainda não vamos para Testcontainers.

A próxima aula será:

```text
266 — Testcontainers com PostgreSQL: testes de integração reais e descartáveis
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

Perceba o caminho.

Você já aprendeu a:

```text
testar;
medir cobertura;
gerar artefatos;
criar imagem Docker;
versionar imagem;
validar formatação;
validar estilo.
```

Agora vamos olhar para outro risco:

```text
o que estou colocando dentro do meu projeto?
```

Um backend Java profissional precisa responder:

```text
quais dependências usamos?
quais versões?
existem vulnerabilidades conhecidas?
quais bibliotecas entram transitivamente?
consigo gerar inventário?
quem atualiza dependências?
como um Pull Request que adiciona biblioteca é revisado?
como tratar alerta crítico?
como diferenciar risco real de falso positivo?
```

Essa aula começa a construir essa mentalidade.

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-265-seguranca-dependencias
```

E dois arquivos de configuração na raiz do repositório:

```text
.github/dependabot.yml
.github/workflows/aula-265-supply-chain.yml
```

A estrutura será:

```text
.github
├── dependabot.yml
└── workflows
    └── aula-265-supply-chain.yml

labs
└── m11
    └── aula-265-seguranca-dependencias
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula265
            │                       ├── NormalizadorTexto.java
            │                       └── RelatorioDependencia.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula265
                                    └── NormalizadorTextoTest.java
```

Vamos fazer três práticas principais:

```text
1. Criar um projeto Maven com dependência externa.
2. Gerar SBOM com CycloneDX.
3. Configurar pipeline para validar dependências e publicar SBOM.
```

Também vamos configurar:

```text
Dependabot para Maven;
Dependabot para GitHub Actions;
Dependency Review para Pull Request.
```

Importante:

```text
A aula é sobre segurança de dependências.
Não vamos colocar dependência vulnerável de propósito.
```

Em ambiente real, às vezes usamos laboratório controlado para simular CVE.

Mas neste curso, vamos evitar ensinar pela instalação proposital de biblioteca insegura.

A mentalidade correta é:

```text
entender risco sem criar mau hábito.
```

---

## 4. Conceitos essenciais antes da prática

### 4.1 O que é supply chain em software

Supply chain significa cadeia de fornecimento.

No mundo físico, uma empresa depende de fornecedores.

No mundo de software, seu sistema depende de:

```text
bibliotecas;
plugins;
imagens Docker;
actions do GitHub;
runners;
registries;
pacotes Maven;
repositórios;
ferramentas de build;
scripts;
extensões;
ambientes de CI/CD.
```

Então supply chain em software é a cadeia de componentes e processos usados para construir, testar, empacotar e entregar seu sistema.

Um ataque ou falha pode entrar por:

```text
dependência vulnerável;
dependência maliciosa;
versão comprometida;
plugin de build comprometido;
action de terceiros insegura;
imagem Docker insegura;
token vazado;
registry comprometido;
script de pipeline perigoso.
```

Por isso, segurança moderna não olha apenas o código que você escreveu.

Ela olha também para o que você consome e como você entrega.

---

### 4.2 O que é dependência direta

Dependência direta é aquela que você declara no seu `pom.xml`.

Exemplo:

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
```

Você escolheu usar essa biblioteca.

Ela aparece diretamente no seu projeto.

---

### 4.3 O que é dependência transitiva

Dependência transitiva é uma dependência puxada por outra dependência.

Exemplo:

```text
seu projeto usa biblioteca A;
biblioteca A usa biblioteca B;
biblioteca B entra no seu projeto mesmo sem você declarar diretamente.
```

Isso importa porque vulnerabilidades podem aparecer em dependências transitivas.

Em Java, você pode inspecionar árvore de dependências com:

```powershell
mvn dependency:tree
```

Essa árvore ajuda a responder:

```text
de onde veio essa biblioteca?
quem puxou essa versão?
é direta ou transitiva?
posso excluir?
preciso atualizar a dependência raiz?
```

---

### 4.4 O que é SCA

SCA significa:

```text
Software Composition Analysis
```

Em português:

```text
Análise de Composição de Software
```

SCA é a prática de analisar componentes usados no seu software.

Normalmente verifica:

```text
bibliotecas usadas;
versões;
vulnerabilidades conhecidas;
licenças;
dependências transitivas;
risco de atualização;
metadados dos componentes.
```

Ferramentas de SCA podem usar bases como:

```text
GitHub Advisory Database;
NVD;
OSV;
bases comerciais;
bases internas da empresa.
```

Exemplos de ferramentas e recursos relacionados:

```text
Dependabot alerts;
Dependency Review;
OWASP Dependency-Check;
Snyk;
Mend;
Sonatype;
Trivy;
Grype;
GitHub Advanced Security.
```

Nesta aula, vamos usar abordagem com GitHub e SBOM.

---

### 4.5 O que é SBOM

SBOM significa:

```text
Software Bill of Materials
```

Em português:

```text
lista de materiais de software.
```

É um inventário dos componentes usados em uma aplicação.

Pense assim:

```text
se uma aplicação fosse um produto físico,
o SBOM seria a lista de peças.
```

Um SBOM pode conter:

```text
nome do componente;
versão;
tipo;
hash;
licença;
fornecedor;
dependência direta ou transitiva;
metadados do projeto.
```

Por que isso importa?

Porque quando surge uma vulnerabilidade nova, você precisa responder rápido:

```text
meu sistema usa essa biblioteca?
qual versão?
direta ou transitiva?
em quais serviços?
em quais imagens?
em qual release?
```

Sem inventário, você depende de chute.

Com SBOM, você tem evidência.

---

### 4.6 Formatos de SBOM

Formatos comuns:

```text
CycloneDX;
SPDX.
```

Nesta aula, vamos usar:

```text
CycloneDX
```

CycloneDX é muito usado para SBOM em contexto de segurança de aplicação e análise de supply chain.

No Maven, existe plugin para gerar SBOM do projeto.

---

### 4.7 O que é CVE

CVE significa:

```text
Common Vulnerabilities and Exposures
```

É um identificador público para vulnerabilidades conhecidas.

Exemplo de formato:

```text
CVE-2024-XXXX
CVE-2025-XXXX
```

Quando uma ferramenta aponta uma CVE, ela está dizendo:

```text
existe uma vulnerabilidade conhecida associada a esse componente ou versão.
```

Mas você ainda precisa analisar contexto.

---

### 4.8 Severidade não é tudo

Ferramentas classificam vulnerabilidades com severidade como:

```text
low;
medium;
high;
critical.
```

Mas severidade sozinha não decide tudo.

Você também precisa avaliar:

```text
a biblioteca é usada em runtime?
o código vulnerável é alcançável?
a aplicação expõe o vetor?
existe mitigação?
é dependência de teste?
é dependência transitiva?
há atualização compatível?
quebra contrato?
há falso positivo?
```

Regra profissional:

```text
alerta de segurança não deve ser ignorado;
mas também não deve ser tratado sem análise.
```

---

### 4.9 O que é Dependabot

Dependabot é um recurso do GitHub que pode abrir Pull Requests para atualizar dependências.

Ele pode ajudar em dois cenários:

```text
atualizações de versão;
atualizações de segurança.
```

Com um arquivo:

```text
.github/dependabot.yml
```

você configura:

```text
ecosystem;
diretório;
frequência;
limite de PRs;
labels;
grupos;
branches.
```

Nesta aula, vamos configurar Dependabot para:

```text
Maven;
GitHub Actions.
```

Isso cobre:

```text
dependências Java;
actions usadas nos workflows.
```

---

### 4.10 O que é Dependency Review

Dependency Review é uma validação em Pull Request.

Ela analisa mudanças de dependências e pode apontar:

```text
novas vulnerabilidades;
licenças problemáticas;
dependências adicionadas;
dependências removidas.
```

É especialmente útil porque atua no momento do PR.

Exemplo:

```text
um dev adiciona uma biblioteca nova;
o PR roda dependency review;
o pipeline alerta se ela introduz vulnerabilidade.
```

Isso evita que risco entre silenciosamente.

Dependendo do tipo de repositório e plano do GitHub, alguns recursos podem ter disponibilidade diferente.

Em ambiente corporativo, isso normalmente entra junto com políticas de segurança do GitHub.

---

### 4.11 Limites das ferramentas

Ferramentas ajudam, mas não substituem julgamento técnico.

Limites comuns:

```text
falso positivo;
falso negativo;
base de vulnerabilidade desatualizada;
dependência usada apenas em teste;
vulnerabilidade não explorável no seu contexto;
atualização que quebra compatibilidade;
alerta sem correção disponível;
biblioteca abandonada;
licença que precisa análise jurídica.
```

O objetivo de um engenheiro não é clicar em "merge" automaticamente.

O objetivo é entender o risco e agir com critério.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-265-seguranca-dependencias
cd labs\m11\aula-265-seguranca-dependencias

mkdir src\main\java\br\com\curso\aula265
mkdir src\test\java\br\com\curso\aula265
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-265-seguranca-dependencias/src/main/java/br/com/curso/aula265
mkdir -p labs/m11/aula-265-seguranca-dependencias/src/test/java/br/com/curso/aula265
cd labs/m11/aula-265-seguranca-dependencias
```

---

### 5.2 Criar o pom.xml com dependência externa e CycloneDX

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
    <artifactId>aula-265-seguranca-dependencias</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <commons.lang3.version>3.14.0</commons.lang3.version>
        <cyclonedx.maven.plugin.version>2.8.0</cyclonedx.maven.plugin.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>${commons.lang3.version}</version>
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
        <finalName>aula-265-seguranca-dependencias</finalName>

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
                <groupId>org.cyclonedx</groupId>
                <artifactId>cyclonedx-maven-plugin</artifactId>
                <version>${cyclonedx.maven.plugin.version}</version>
                <configuration>
                    <projectType>application</projectType>
                    <schemaVersion>1.5</schemaVersion>
                    <includeBomSerialNumber>true</includeBomSerialNumber>
                    <includeCompileScope>true</includeCompileScope>
                    <includeRuntimeScope>true</includeRuntimeScope>
                    <includeProvidedScope>false</includeProvidedScope>
                    <includeSystemScope>false</includeSystemScope>
                    <includeTestScope>false</includeTestScope>
                    <outputFormat>all</outputFormat>
                    <outputName>bom</outputName>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

Observação importante:

```text
em projeto real, confirme a versão mais atual dos plugins antes de adotar.
```

Nesta aula, o foco é entender o conceito e a estrutura.

---

### 5.3 Entender a dependência externa

Adicionamos:

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>${commons.lang3.version}</version>
</dependency>
```

Essa é uma dependência direta.

Ela será usada no código.

Também será listada no SBOM.

Quando você roda:

```powershell
mvn dependency:tree
```

você consegue ver a árvore de dependências.

---

### 5.4 Entender o plugin CycloneDX

O plugin:

```xml
<groupId>org.cyclonedx</groupId>
<artifactId>cyclonedx-maven-plugin</artifactId>
```

gera SBOM.

Configuramos:

```xml
<outputFormat>all</outputFormat>
```

Isso permite gerar formatos como:

```text
JSON;
XML.
```

A saída normalmente aparece em:

```text
target/bom.json
target/bom.xml
```

Esses arquivos serão publicados no pipeline como artifacts.

---

### 5.5 Criar RelatorioDependencia

Crie:

```text
src/main/java/br/com/curso/aula265/RelatorioDependencia.java
```

Conteúdo:

```java
package br.com.curso.aula265;

public record RelatorioDependencia(
        String nomeOriginal,
        String nomeNormalizado,
        boolean valido
) {
}
```

Esse record representa uma resposta simples para o laboratório.

---

### 5.6 Criar NormalizadorTexto

Crie:

```text
src/main/java/br/com/curso/aula265/NormalizadorTexto.java
```

Conteúdo:

```java
package br.com.curso.aula265;

import org.apache.commons.lang3.StringUtils;

public class NormalizadorTexto {

    public RelatorioDependencia normalizarNome(String nome) {
        if (StringUtils.isBlank(nome)) {
            return new RelatorioDependencia(nome, "NAO_INFORMADO", false);
        }

        String nomeNormalizado = StringUtils.stripAccents(nome)
                .trim()
                .replaceAll("\\s+", " ")
                .toUpperCase();

        return new RelatorioDependencia(nome, nomeNormalizado, true);
    }
}
```

Aqui usamos `StringUtils` da dependência externa.

Isso torna a dependência real, não apenas decorativa.

---

### 5.7 Criar testes

Crie:

```text
src/test/java/br/com/curso/aula265/NormalizadorTextoTest.java
```

Conteúdo:

```java
package br.com.curso.aula265;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("NormalizadorTexto")
class NormalizadorTextoTest {

    private final NormalizadorTexto normalizador = new NormalizadorTexto();

    @Test
    @DisplayName("deve normalizar nome removendo acento e espaços extras")
    void deveNormalizarNomeRemovendoAcentoEEspacosExtras() {
        RelatorioDependencia relatorio = normalizador.normalizarNome("  João   da   Silva  ");

        assertThat(relatorio.nomeOriginal()).isEqualTo("  João   da   Silva  ");
        assertThat(relatorio.nomeNormalizado()).isEqualTo("JOAO DA SILVA");
        assertThat(relatorio.valido()).isTrue();
    }

    @Test
    @DisplayName("deve retornar inválido quando nome for vazio")
    void deveRetornarInvalidoQuandoNomeForVazio() {
        RelatorioDependencia relatorio = normalizador.normalizarNome(" ");

        assertThat(relatorio.nomeNormalizado()).isEqualTo("NAO_INFORMADO");
        assertThat(relatorio.valido()).isFalse();
    }

    @Test
    @DisplayName("deve retornar inválido quando nome for nulo")
    void deveRetornarInvalidoQuandoNomeForNulo() {
        RelatorioDependencia relatorio = normalizador.normalizarNome(null);

        assertThat(relatorio.nomeOriginal()).isNull();
        assertThat(relatorio.nomeNormalizado()).isEqualTo("NAO_INFORMADO");
        assertThat(relatorio.valido()).isFalse();
    }
}
```

Rode:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

---

### 5.8 Inspecionar árvore de dependências

Execute:

```powershell
mvn dependency:tree
```

Você verá dependências diretas e transitivas.

Procure por:

```text
commons-lang3
junit-jupiter
assertj-core
```

Dependências com `scope test` são usadas em teste.

Dependências sem `scope test` entram em runtime/compile, dependendo do caso.

Essa leitura é importante.

Em um backend real, antes de adicionar biblioteca nova, pergunte:

```text
preciso mesmo dessa dependência?
ela é mantida?
qual licença?
qual tamanho?
ela puxa muitas transitivas?
tem histórico de vulnerabilidade?
existe alternativa já usada no projeto?
```

---

### 5.9 Gerar SBOM localmente

Execute:

```powershell
mvn org.cyclonedx:cyclonedx-maven-plugin:makeBom
```

Ou, se preferir usar o plugin declarado no POM:

```powershell
mvn cyclonedx:makeBom
```

Depois veja:

```powershell
dir target
```

Você deve encontrar:

```text
bom.json
bom.xml
```

Abra `target/bom.json`.

Procure por:

```text
components
commons-lang3
junit
assertj
```

O SBOM é um inventário.

Ele não é bonito como aula teórica, mas é valioso como evidência técnica.

---

### 5.10 Criar dependabot.yml

Volte para a raiz do repositório.

No PowerShell:

```powershell
cd ..\..\..
```

Crie a pasta `.github` se necessário:

```powershell
mkdir .github
```

Crie:

```text
.github/dependabot.yml
```

Conteúdo:

```yaml
version: 2

updates:
  - package-ecosystem: "maven"
    directory: "/labs/m11/aula-265-seguranca-dependencias"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "08:00"
      timezone: "America/Sao_Paulo"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "java"
      - "security"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "08:30"
      timezone: "America/Sao_Paulo"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "github-actions"
      - "security"
```

Esse arquivo configura Dependabot para:

```text
verificar dependências Maven do laboratório;
verificar actions dos workflows;
abrir Pull Requests semanalmente.
```

Em projeto real, você pode configurar:

```text
grupos;
ignore;
target-branch;
reviewers;
assignees;
commit-message;
milestone.
```

Nesta aula, vamos começar simples.

---

### 5.11 Criar workflow de supply chain

Crie a pasta de workflows se necessário:

```powershell
mkdir .github\workflows
```

No Linux/macOS:

```bash
mkdir -p .github/workflows
```

Crie:

```text
.github/workflows/aula-265-supply-chain.yml
```

Conteúdo:

```yaml
name: Aula 265 - Supply Chain Java

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
  sca-sbom:
    name: Gerar SBOM e validar dependências Maven
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-265-seguranca-dependencias

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

      - name: Rodar testes
        run: mvn -B clean test

      - name: Exibir árvore de dependências
        run: mvn -B dependency:tree

      - name: Gerar SBOM CycloneDX
        run: mvn -B cyclonedx:makeBom

      - name: Listar arquivos gerados
        run: |
          echo "Conteúdo do target:"
          ls -la target
          echo "Arquivos SBOM:"
          ls -la target/bom.*

      - name: Publicar SBOM como artifact
        uses: actions/upload-artifact@v4
        with:
          name: aula-265-sbom-cyclonedx
          path: |
            labs/m11/aula-265-seguranca-dependencias/target/bom.json
            labs/m11/aula-265-seguranca-dependencias/target/bom.xml
          if-no-files-found: error

  dependency-review:
    name: Revisar dependências no Pull Request
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Dependency Review
        uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
```

Esse workflow tem dois jobs.

O primeiro:

```text
roda testes;
mostra árvore de dependências;
gera SBOM;
publica SBOM como artifact.
```

O segundo:

```text
roda apenas em Pull Request;
analisa mudanças de dependências;
falha se encontrar vulnerabilidade high ou critical, conforme configuração.
```

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que gerar SBOM no pipeline

Gerar SBOM localmente é bom.

Gerar SBOM no pipeline é melhor.

Porque o pipeline representa um ambiente limpo e rastreável.

Com artifact, você consegue baixar:

```text
bom.json;
bom.xml.
```

Isso cria evidência sobre o que aquela execução continha.

Em projeto real, esse SBOM pode ser:

```text
arquivado;
enviado para ferramenta de segurança;
associado a uma release;
associado a uma imagem Docker;
usado em auditoria;
usado para resposta a incidente.
```

---

### 6.2 Por que dependency:tree no pipeline

O comando:

```bash
mvn dependency:tree
```

não substitui SCA.

Mas ele é excelente para diagnóstico.

Quando uma vulnerabilidade aparece, você precisa saber:

```text
a dependência é direta?
é transitiva?
quem puxou?
qual versão?
```

A árvore ajuda nisso.

---

### 6.3 Por que Dependabot para Maven e GitHub Actions

O risco não está só no `pom.xml`.

Ele também pode estar no pipeline.

Actions são dependências de automação.

Exemplo:

```yaml
uses: actions/checkout@v4
uses: actions/setup-java@v4
uses: actions/upload-artifact@v4
```

Essas actions também evoluem.

Dependabot pode abrir PRs para atualizar:

```text
bibliotecas Maven;
plugins Maven;
actions de workflows.
```

Isso ajuda a manter a cadeia mais saudável.

---

### 6.4 Por que não aceitar PR de Dependabot automaticamente

Dependabot ajuda, mas não deve ser tratado como piloto automático cego.

Antes de fazer merge, avalie:

```text
os testes passaram?
mudou versão major?
há breaking change?
o changelog tem algo relevante?
a atualização é de segurança?
a biblioteca é crítica?
a aplicação usa aquela parte?
há alteração em comportamento?
```

Em alguns projetos, updates patch podem ser automáticos.

Mas isso exige maturidade de testes e política clara.

No começo, revise.

---

### 6.5 Por que Dependency Review roda só em PR

Dependency Review é mais útil no momento em que uma mudança está tentando entrar.

Então configuramos:

```yaml
if: github.event_name == 'pull_request'
```

Ele analisa o diff de dependências.

Isso responde:

```text
este PR adicionou risco novo?
```

É diferente de escanear tudo sempre.

Para varredura completa, entram outras ferramentas de SCA.

---

### 6.6 Por que falhar em high

Configuramos:

```yaml
fail-on-severity: high
```

Isso significa:

```text
se uma dependência introduz vulnerabilidade de severidade high ou critical,
o job deve falhar.
```

Em projeto real, a política pode ser:

```text
falhar em critical;
falhar em high;
permitir medium com issue;
permitir exceção temporária;
bloquear licenças específicas;
exigir aprovação de segurança.
```

Não existe regra universal.

Existe política de risco.

---

### 6.7 Por que não usar OWASP Dependency-Check pesado no primeiro pipeline

OWASP Dependency-Check é uma ferramenta importante de SCA.

Mas o primeiro uso pode ser demorado porque ele precisa baixar e processar dados de vulnerabilidades.

Em pipeline didático, isso pode gerar demora e ruído.

Por isso, nesta aula, vamos focar em:

```text
Dependabot;
Dependency Review;
SBOM CycloneDX.
```

Você precisa conhecer Dependency-Check, mas não vamos torná-lo obrigatório nesta aula.

Em projeto real, ele pode entrar como:

```text
job noturno;
pipeline específico de segurança;
execução com cache;
ferramenta corporativa dedicada.
```

---

### 6.8 Como interpretar alertas de dependência

Quando uma ferramenta apontar vulnerabilidade, não reaja no automático.

Siga um raciocínio:

```text
1. Qual componente?
2. Qual versão?
3. É dependência direta ou transitiva?
4. Qual CVE?
5. Qual severidade?
6. Existe versão corrigida?
7. Está em runtime ou só em teste?
8. O trecho vulnerável é alcançável?
9. Há mitigação?
10. Atualizar quebra compatibilidade?
11. Precisa hotfix?
12. Precisa exceção temporária?
```

Essa é a diferença entre:

```text
clicar em alerta
```

e:

```text
agir como engenheiro.
```

---

### 6.9 Como isso aparece em empresa

Em empresas maduras, segurança de dependências pode envolver:

```text
alertas automáticos;
PRs do Dependabot;
SBOM por release;
scan de imagem Docker;
bloqueio de vulnerabilidades críticas;
aprovação de exceções;
política de licenças;
ferramentas comerciais;
relatórios de auditoria;
responsável por triagem;
SLA para correção.
```

Exemplo de SLA:

```text
critical: corrigir em até 24/48h;
high: corrigir em até 7 dias;
medium: corrigir no próximo ciclo;
low: acompanhar.
```

O prazo depende do contexto, exposição e política da empresa.

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Dependabot não abre PR

Possíveis causas:

```text
arquivo dependabot.yml fora de .github;
YAML inválido;
directory errado;
package-ecosystem errado;
não há atualização disponível;
limite de PRs atingido;
Dependabot desabilitado no repositório.
```

Verifique:

```text
.github/dependabot.yml
```

E o diretório:

```yaml
directory: "/labs/m11/aula-265-seguranca-dependencias"
```

O caminho precisa apontar para onde está o `pom.xml`.

---

### 7.2 SBOM não foi gerado

Possíveis causas:

```text
plugin CycloneDX ausente;
comando errado;
build falhou antes;
target foi limpo;
versão do plugin incompatível;
Maven não encontrou o projeto.
```

Rode localmente:

```powershell
mvn cyclonedx:makeBom
```

Confira:

```powershell
dir target
```

Procure:

```text
bom.json
bom.xml
```

---

### 7.3 upload-artifact não encontra bom.json

Erro comum:

```text
No files were found with the provided path
```

Causas:

```text
SBOM não foi gerado;
path errado;
working-directory confundiu caminho;
arquivo tem outro nome.
```

Atenção:

```text
working-directory afeta comandos run.
upload-artifact usa path relativo à raiz do repositório.
```

Por isso usamos:

```yaml
path: |
  labs/m11/aula-265-seguranca-dependencias/target/bom.json
  labs/m11/aula-265-seguranca-dependencias/target/bom.xml
```

---

### 7.4 Dependency Review falha no Pull Request

Se falhar, leia o log.

Ele pode estar apontando:

```text
vulnerabilidade;
licença bloqueada;
dependência adicionada;
severidade acima do permitido.
```

Não resolva no chute.

Investigue:

```text
qual dependência?
qual versão?
quem adicionou?
existe update?
é direta ou transitiva?
```

Use:

```powershell
mvn dependency:tree
```

---

### 7.5 Dependency Review não roda em push

Isso é esperado.

Configuramos:

```yaml
if: github.event_name == 'pull_request'
```

Dependency Review faz sentido no contexto de PR.

Para push, usamos o job de SBOM e árvore de dependências.

---

### 7.6 Falso positivo

Um alerta pode não afetar sua aplicação.

Exemplo:

```text
biblioteca vulnerável apenas em funcionalidade que você não usa;
dependência apenas de teste;
vulnerabilidade exige configuração inexistente;
componente não vai para runtime.
```

Mesmo assim, registre análise.

Não ignore sem justificativa.

Em empresa, exceção precisa de contexto.

---

### 7.7 Atualização quebra build

Dependabot pode abrir PR que atualiza uma biblioteca e quebra testes.

Isso não significa que Dependabot está errado.

Significa que houve mudança incompatível ou comportamento alterado.

Ação correta:

```text
ler changelog;
verificar versão major/minor/patch;
ajustar código se fizer sentido;
ou adiar update com justificativa.
```

---

### 7.8 Versão de plugin desatualizada

Ferramentas de segurança evoluem rápido.

Em projeto real, revise periodicamente:

```text
CycloneDX Maven plugin;
actions usadas;
Maven plugins;
Dependabot config;
políticas de severidade.
```

A própria configuração do Dependabot para GitHub Actions ajuda nisso.

---

## 8. Exercício prático principal

### Missão

Criar uma rotina mínima de segurança de dependências para projeto Maven.

Você deve criar:

```text
labs/m11/aula-265-seguranca-dependencias
.github/dependabot.yml
.github/workflows/aula-265-supply-chain.yml
```

O projeto deve conter:

```text
pom.xml com commons-lang3;
plugin CycloneDX;
NormalizadorTexto.java;
RelatorioDependencia.java;
NormalizadorTextoTest.java.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21;
rodar testes;
exibir dependency:tree;
gerar SBOM CycloneDX;
publicar bom.json e bom.xml como artifact;
rodar Dependency Review apenas em Pull Request.
```

O Dependabot deve monitorar:

```text
Maven;
GitHub Actions.
```

---

### Roteiro local

Dentro do laboratório:

```powershell
mvn clean test
mvn dependency:tree
mvn cyclonedx:makeBom
dir target
```

Confira:

```text
target/bom.json
target/bom.xml
```

Abra `target/bom.json` e procure por:

```text
commons-lang3
components
dependencies
```

---

### Roteiro no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-265-seguranca-dependencias
git add .github/dependabot.yml
git add .github/workflows/aula-265-supply-chain.yml
git commit -m "Aula 265: seguranca de dependencias sbom dependabot supply chain"
git push
```

Depois, no GitHub:

```text
Actions;
Aula 265 - Supply Chain Java;
abrir execução;
verificar testes;
verificar dependency:tree;
verificar geração de SBOM;
baixar artifact aula-265-sbom-cyclonedx.
```

Se estiver em Pull Request, confira também:

```text
job Dependency Review.
```

---

### Critérios de aceite

A aula está concluída quando:

```text
projeto compila;
testes passam;
mvn dependency:tree funciona;
mvn cyclonedx:makeBom gera bom.json e bom.xml;
workflow gera SBOM no pipeline;
workflow publica SBOM como artifact;
Dependabot está configurado para Maven;
Dependabot está configurado para GitHub Actions;
Dependency Review roda em Pull Request;
você entende dependência direta e transitiva;
você entende SCA;
você entende SBOM;
você entende supply chain;
você entende que alerta de segurança exige análise, não pânico.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. O que é supply chain em software?
2. O que é dependência direta?
3. O que é dependência transitiva?
4. Para que serve mvn dependency:tree?
5. O que é SCA?
6. O que é SBOM?
7. Para que serve CycloneDX?
8. O que é CVE?
9. Por que severidade não é tudo?
10. O que é Dependabot?
11. O que é Dependency Review?
12. Por que monitorar GitHub Actions também?
13. Por que gerar SBOM no pipeline?
14. Por que publicar SBOM como artifact?
15. Qual diferença entre alerta e risco real?
16. O que fazer quando Dependabot abre PR?
17. Por que não aceitar update automaticamente sem análise?
18. O que é falso positivo?
19. O que é política de severidade?
20. Como essa aula prepara segurança mais avançada?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 265.
[ ] Adicionei dependência externa no pom.xml.
[ ] Configurei CycloneDX.
[ ] Criei código usando commons-lang3.
[ ] Criei testes.
[ ] Rodei mvn clean test.
[ ] Rodei mvn dependency:tree.
[ ] Gerei SBOM local.
[ ] Criei dependabot.yml.
[ ] Configurei Maven no Dependabot.
[ ] Configurei GitHub Actions no Dependabot.
[ ] Criei workflow de supply chain.
[ ] Publiquei SBOM como artifact.
[ ] Configurei Dependency Review em PR.
[ ] Entendi SCA, SBOM e supply chain.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você estudou segurança de dependências e supply chain.

Você aprendeu:

```text
dependência direta;
dependência transitiva;
supply chain;
SCA;
SBOM;
CycloneDX;
CVE;
severidade;
falso positivo;
Dependabot;
dependabot.yml;
Dependency Review;
dependency:tree;
artifact de SBOM;
política mínima de segurança;
análise de risco;
limites das ferramentas.
```

A ideia principal é:

```text
um backend profissional não é seguro apenas porque o código próprio parece correto.
Ele também precisa controlar bibliotecas, plugins, actions, imagens e processos que entram na cadeia de construção e entrega.
```

Agora seu conjunto de ferramentas do M11 já cobre:

```text
testes;
cobertura;
relatórios;
artefatos;
Docker;
registry;
tags;
formatação;
estilo;
dependências;
SBOM;
Dependabot;
supply chain.
```

Na próxima aula, vamos voltar para testes, mas em outro nível.

A próxima aula será:

```text
266 — M11.22 — Testcontainers com PostgreSQL: testes de integração reais e descartáveis
```

Nela, vamos estudar:

```text
por que mock não substitui banco real em alguns testes;
o que é Testcontainers;
como subir PostgreSQL descartável para teste;
como rodar teste de integração com banco real;
como isso se conecta com Docker;
como isso prepara persistência, JDBC, JPA e Spring Boot.
```

Ainda não vamos iniciar o módulo SQL completo.

Ainda não vamos entrar em Spring Boot.

Vamos usar Testcontainers como ferramenta profissional do M11.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-265-seguranca-dependencias
git add .github/dependabot.yml
git add .github/workflows/aula-265-supply-chain.yml
git commit -m "Aula 265: seguranca de dependencias sbom dependabot supply chain"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-265-supply-chain
git add labs/m11/aula-265-seguranca-dependencias
git add .github/dependabot.yml
git add .github/workflows/aula-265-supply-chain.yml
git commit -m "Aula 265: seguranca de dependencias sbom dependabot supply chain"
git push -u origin feature/aula-265-supply-chain
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 265 — M11.21 — Segurança de dependências: SCA, SBOM, Dependabot e supply chain

Nesta aula, estudei segurança de dependências e supply chain em projetos Java Backend.

Aprendi a diferença entre dependência direta e transitiva, usei `mvn dependency:tree` para inspecionar a árvore de dependências e entendi como vulnerabilidades podem entrar no sistema por bibliotecas, plugins, actions e componentes da cadeia de build.

Criei o laboratório `labs/m11/aula-265-seguranca-dependencias`, configurei uma dependência externa com `commons-lang3`, usei CycloneDX para gerar SBOM em `bom.json` e `bom.xml`, e publiquei esses arquivos como artifacts no GitHub Actions.

Também configurei `.github/dependabot.yml` para monitorar dependências Maven e GitHub Actions, além de criar o workflow `.github/workflows/aula-265-supply-chain.yml` com testes, geração de SBOM e Dependency Review em Pull Requests.

O principal aprendizado foi que segurança de dependências não é apenas atualizar biblioteca: envolve inventário, análise de risco, severidade, contexto, falso positivo, rastreabilidade e política de manutenção.
```

---

## Referências oficiais consultadas

Esta aula foi elaborada com base em documentação oficial e referências técnicas sobre:

```text
GitHub Dependabot;
dependabot.yml;
GitHub Dependency Review Action;
CycloneDX Maven Plugin;
OWASP Dependency-Check;
conceitos de SCA, SBOM e supply chain.
```

Pontos importantes considerados:

```text
Dependabot usa .github/dependabot.yml para configurar ecossistemas, diretórios e agenda de atualização.
Dependency Review Action analisa mudanças de dependências em Pull Requests.
CycloneDX Maven Plugin gera SBOM com dependências diretas e transitivas.
OWASP Dependency-Check é uma ferramenta de SCA para identificar componentes com vulnerabilidades conhecidas.
```
