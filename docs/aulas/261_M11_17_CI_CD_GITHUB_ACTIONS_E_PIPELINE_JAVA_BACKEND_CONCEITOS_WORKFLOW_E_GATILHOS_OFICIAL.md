# 261 — M11.17 — CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos

## 1. Objetivo da aula

Na aula 260, você montou um ambiente local backend mais profissional com Docker Compose.

Você trabalhou com:

```text
PostgreSQL;
Redis;
Adminer;
Redis Commander;
.env.example;
.gitignore;
rede Docker dedicada;
volumes nomeados;
bind mount de scripts SQL;
healthcheck;
depends_on com service_healthy;
psql;
redis-cli;
reset controlado;
troubleshooting de ambiente local.
```

Agora vamos dar o próximo passo natural:

```text
automatizar validações.
```

Em um projeto Java Backend profissional, não basta o código rodar na sua máquina.

O time precisa de uma rotina confiável para validar o projeto quando alguém:

```text
faz push;
abre pull request;
atualiza uma branch;
pede uma execução manual;
prepara uma entrega;
vai integrar código na branch principal.
```

Essa rotina é chamada de pipeline.

E uma das ferramentas mais usadas para isso no GitHub é:

```text
GitHub Actions
```

Ao final desta aula, você deve conseguir:

```text
entender o que é CI;
entender o que é CD;
entender o que é pipeline;
entender o que é workflow;
entender o que é trigger/gatilho;
entender o que é job;
entender o que é step;
entender o que é action;
entender o que é runner;
entender eventos push, pull_request e workflow_dispatch;
criar um workflow inicial no GitHub Actions;
rodar uma validação Java simples;
usar Java 21 no workflow;
executar testes com Maven em um laboratório;
entender por que pipeline protege a branch principal;
entender como pipeline aparece em pull request;
entender erros comuns de YAML, diretório, Java e Maven;
preparar a base para a aula 262, onde o pipeline Maven será aprofundado.
```

Esta aula não é sobre decorar YAML.

É sobre entender a mentalidade de entrega profissional.

---

## 2. Onde estamos na formação

Estamos no M11:

```text
M11 — Ferramentas essenciais do Java Backend profissional
```

A sequência imediata do módulo é:

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

A aula 261 abre a porta para CI/CD.

Mas vamos com calma.

Nesta aula, o foco é:

```text
conceito;
estrutura;
primeiro workflow;
gatilhos;
execução básica;
leitura do resultado.
```

Na aula 262, vamos aprofundar:

```text
Maven;
testes;
JaCoCo;
relatórios;
artefatos;
pipeline mais completo.
```

Na aula 263, vamos aprofundar:

```text
Docker build;
tags;
registry;
imagem versionada;
segredos;
publicação de imagem.
```

Então não vamos atropelar a grade.

---

## 3. O que vamos construir

Vamos criar um laboratório em:

```text
labs/m11/aula-261-ci-cd-github-actions
```

E também criaremos um workflow em:

```text
.github/workflows/aula-261-ci-basico.yml
```

O laboratório terá um projeto Maven pequeno, apenas para validar que o GitHub Actions consegue:

```text
baixar o código;
preparar Java 21;
executar Maven;
rodar testes;
falhar se teste quebrar;
passar se teste estiver correto.
```

A estrutura final será:

```text
.github
└── workflows
    └── aula-261-ci-basico.yml

labs
└── m11
    └── aula-261-ci-cd-github-actions
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula261
            │                       └── CalculadoraPipeline.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula261
                                    └── CalculadoraPipelineTest.java
```

O workflow será disparado por três gatilhos:

```text
push;
pull_request;
workflow_dispatch.
```

Essa combinação é excelente para começo.

---

## 4. Conceitos essenciais antes da prática

### 4.1 O que é CI

CI significa:

```text
Continuous Integration
```

Em português:

```text
Integração Contínua
```

A ideia é simples:

```text
a cada mudança relevante no código, o projeto deve ser validado automaticamente.
```

Exemplos de validação:

```text
compilar;
rodar testes;
verificar estilo;
analisar cobertura;
rodar análise estática;
validar dependências;
gerar artefatos;
montar imagem Docker.
```

Nesta aula, vamos começar com:

```text
compilar e rodar testes.
```

CI evita aquele problema clássico:

```text
na minha máquina funciona.
```

Com CI, a pergunta vira:

```text
funciona em um ambiente limpo, automatizado e igual para todo mundo?
```

---

### 4.2 O que é CD

CD pode significar duas coisas, dependendo do contexto:

```text
Continuous Delivery
Continuous Deployment
```

Continuous Delivery significa:

```text
o sistema está sempre em condição de ser entregue.
```

Continuous Deployment significa:

```text
o sistema é implantado automaticamente em ambiente após passar nas validações.
```

Diferença prática:

```text
Continuous Delivery:
pipeline prepara a entrega, mas pode existir aprovação manual.

Continuous Deployment:
pipeline entrega automaticamente.
```

Nesta fase da formação, vamos focar mais em CI.

CD será aprofundado quando entrarmos em:

```text
Docker;
registry;
deploy;
Kubernetes;
cloud;
estratégias de release.
```

---

### 4.3 O que é pipeline

Pipeline é uma sequência automatizada de etapas.

Exemplo simples:

```text
1. Baixar código
2. Preparar Java
3. Restaurar dependências
4. Compilar
5. Rodar testes
6. Publicar resultado
```

Exemplo mais completo no futuro:

```text
1. Checkout
2. Setup Java
3. Cache Maven
4. Testes unitários
5. JaCoCo
6. SonarQube
7. Checkstyle
8. Build do JAR
9. Build Docker
10. Scan de imagem
11. Push para registry
12. Deploy em ambiente
```

Nesta aula, faremos a versão inicial.

Na próxima, vamos aumentar o nível.

---

### 4.4 O que é GitHub Actions

GitHub Actions é a ferramenta de automação do GitHub.

Com ela, você cria arquivos YAML dentro do repositório.

Esses arquivos ficam em:

```text
.github/workflows
```

Cada arquivo define um workflow.

O GitHub lê esses arquivos e executa os processos quando ocorre um evento configurado.

Exemplo de eventos:

```text
push;
pull_request;
workflow_dispatch;
schedule;
release;
tag;
deployment.
```

Para Java Backend, os mais comuns no começo são:

```text
push;
pull_request;
workflow_dispatch.
```

---

### 4.5 O que é workflow

Workflow é um processo automatizado definido em YAML.

Exemplo mental:

```text
Workflow:
CI Java Backend

Quando roda:
push e pull_request

O que faz:
prepara Java e roda testes
```

Arquivo:

```text
.github/workflows/aula-261-ci-basico.yml
```

Dentro do workflow, você define:

```text
nome;
gatilhos;
permissões;
jobs;
steps.
```

---

### 4.6 O que é trigger ou gatilho

Trigger, ou gatilho, é o evento que dispara o workflow.

Exemplo:

```yaml
on:
  push:
  pull_request:
  workflow_dispatch:
```

Isso significa:

```text
rode este workflow quando ocorrer push;
rode este workflow quando ocorrer pull request;
permita execução manual.
```

Gatilho é uma decisão importante.

Um pipeline profissional deve rodar no momento certo.

Se rodar pouco, problemas passam.

Se rodar demais, gasta tempo e recursos sem necessidade.

---

### 4.7 O que é job

Job é um bloco de trabalho dentro do workflow.

Exemplo:

```text
validar-projeto
```

Um workflow pode ter um ou vários jobs.

Exemplo futuro:

```text
testes;
qualidade;
build;
docker;
segurança;
deploy.
```

Nesta aula, teremos um job:

```text
validar-java
```

---

### 4.8 O que é runner

Runner é a máquina onde o job executa.

Exemplo:

```yaml
runs-on: ubuntu-latest
```

Isso significa:

```text
execute este job em uma máquina Linux fornecida pelo GitHub.
```

Também existem runners para:

```text
Windows;
macOS;
self-hosted;
runners privados de empresa.
```

Em backend Java, é muito comum usar Linux no pipeline.

Motivos:

```text
ambiente parecido com servidores;
execução rápida;
boa compatibilidade com Docker;
padrão comum em times.
```

---

### 4.9 O que é step

Step é uma etapa dentro do job.

Exemplo:

```yaml
steps:
  - name: Baixar código
  - name: Configurar Java
  - name: Rodar testes
```

Cada step pode:

```text
usar uma action pronta;
executar comandos shell;
definir variáveis;
publicar resultado;
chamar scripts.
```

---

### 4.10 O que é action

Action é uma unidade reutilizável no GitHub Actions.

Exemplos comuns:

```yaml
uses: actions/checkout@v4
uses: actions/setup-java@v4
```

`actions/checkout` baixa o código do repositório para o runner.

`actions/setup-java` instala/configura o Java no runner.

Atenção profissional:

```text
use actions conhecidas;
prefira versões fixas;
evite actions desconhecidas sem revisar;
não exponha secrets em actions de terceiros sem critério.
```

---

### 4.11 Secrets e variables

No GitHub Actions, você pode usar configurações externas.

De forma simples:

```text
variables:
valores não sensíveis.

secrets:
valores sensíveis.
```

Exemplos de variables:

```text
nome do ambiente;
URL pública;
flag não sensível;
nome de região cloud.
```

Exemplos de secrets:

```text
senha;
token;
chave privada;
credencial de registry;
credencial de cloud.
```

Regra profissional:

```text
nunca imprima secrets no log.
```

Nesta aula, não vamos configurar secrets.

Vamos apenas entender o conceito.

Secrets serão usados com mais cuidado quando chegarmos em Docker registry, deploy e segurança.

---

### 4.12 Por que pipeline importa para um backend Java

Em Java Backend, pipeline evita que código ruim entre na branch principal.

Ele protege contra:

```text
teste quebrado;
erro de compilação;
dependência ausente;
versão errada de Java;
configuração local escondida;
falta de padronização;
quebra acidental em pull request.
```

Um dev backend profissional não pensa só em:

```text
meu código compila localmente.
```

Ele pensa:

```text
meu código passa em ambiente limpo?
meu PR está validado?
meu time consegue confiar na branch principal?
o pipeline mostra evidência técnica?
se quebrar, consigo diagnosticar?
```

Isso é mentalidade de engenharia.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar o projeto Maven do laboratório

A partir da raiz do repositório do curso, execute:

```powershell
mkdir labs\m11\aula-261-ci-cd-github-actions
cd labs\m11\aula-261-ci-cd-github-actions

mkdir src\main\java\br\com\curso\aula261
mkdir src\test\java\br\com\curso\aula261
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-261-ci-cd-github-actions/src/main/java/br/com/curso/aula261
mkdir -p labs/m11/aula-261-ci-cd-github-actions/src/test/java/br/com/curso/aula261
cd labs/m11/aula-261-ci-cd-github-actions
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
    <artifactId>aula-261-ci-cd-github-actions</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
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
        <finalName>aula-261-ci-cd-github-actions</finalName>

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

Esse projeto será pequeno de propósito.

O foco da aula não é regra de negócio.

O foco é validar um projeto Java em pipeline.

---

### 5.3 Criar a classe principal de exemplo

Crie:

```text
src/main/java/br/com/curso/aula261/CalculadoraPipeline.java
```

Conteúdo:

```java
package br.com.curso.aula261;

public class CalculadoraPipeline {

    public int somar(int primeiroNumero, int segundoNumero) {
        return primeiroNumero + segundoNumero;
    }

    public int subtrair(int primeiroNumero, int segundoNumero) {
        return primeiroNumero - segundoNumero;
    }

    public boolean numeroPar(int numero) {
        return numero % 2 == 0;
    }
}
```

Essa classe é simples.

Ela serve para gerar uma evidência clara:

```text
se o teste passar, o pipeline passa;
se o teste quebrar, o pipeline falha.
```

---

### 5.4 Criar os testes

Crie:

```text
src/test/java/br/com/curso/aula261/CalculadoraPipelineTest.java
```

Conteúdo:

```java
package br.com.curso.aula261;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CalculadoraPipeline")
class CalculadoraPipelineTest {

    private final CalculadoraPipeline calculadora = new CalculadoraPipeline();

    @Test
    @DisplayName("deve somar dois números")
    void deveSomarDoisNumeros() {
        int resultado = calculadora.somar(10, 5);

        assertThat(resultado).isEqualTo(15);
    }

    @Test
    @DisplayName("deve subtrair dois números")
    void deveSubtrairDoisNumeros() {
        int resultado = calculadora.subtrair(10, 5);

        assertThat(resultado).isEqualTo(5);
    }

    @Test
    @DisplayName("deve identificar número par")
    void deveIdentificarNumeroPar() {
        boolean resultado = calculadora.numeroPar(10);

        assertThat(resultado).isTrue();
    }

    @Test
    @DisplayName("deve identificar número ímpar")
    void deveIdentificarNumeroImpar() {
        boolean resultado = calculadora.numeroPar(7);

        assertThat(resultado).isFalse();
    }
}
```

Rode localmente:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar localmente, corrija antes de criar o workflow.

Regra profissional:

```text
pipeline não substitui responsabilidade local.
```

Você deve rodar local antes de subir.

---

### 5.5 Voltar para a raiz do repositório

Se você está dentro da pasta do laboratório, volte para a raiz.

No PowerShell, dependendo de onde está, use:

```powershell
cd ..\..\..
```

Confirme que você está na raiz vendo pastas como:

```text
docs
labs
.git
```

Use:

```powershell
dir
```

No Linux/macOS:

```bash
pwd
ls
```

---

### 5.6 Criar a pasta de workflows

Na raiz do repositório:

```powershell
mkdir .github
mkdir .github\workflows
```

Se a pasta já existir, não tem problema.

No Linux/macOS:

```bash
mkdir -p .github/workflows
```

---

### 5.7 Criar o workflow inicial

Crie:

```text
.github/workflows/aula-261-ci-basico.yml
```

Conteúdo:

```yaml
name: Aula 261 - CI básico Java

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
  validar-java:
    name: Validar projeto Java da aula 261
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-261-ci-cd-github-actions

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
```

Esse é o primeiro workflow real da formação.

Ele faz poucas coisas, mas cada uma tem papel claro.

---

### 5.8 Entender o workflow por partes

#### name

```yaml
name: Aula 261 - CI básico Java
```

Esse é o nome que aparece na aba Actions do GitHub.

Use nomes claros.

Evite nomes genéricos como:

```text
test
pipeline
build
workflow
```

Melhor:

```text
CI Java
Validação Pull Request
Build API Ordem Serviço
```

---

#### on

```yaml
on:
```

Define gatilhos.

Aqui usamos:

```text
push;
pull_request;
workflow_dispatch.
```

---

#### push

```yaml
push:
  branches:
    - main
    - develop
    - "feature/**"
```

Esse workflow roda quando houver push nas branches:

```text
main;
develop;
qualquer branch feature/**.
```

Exemplos:

```text
feature/aula-261-ci
feature/corrigir-testes
feature/nova-validacao
```

---

#### pull_request

```yaml
pull_request:
  branches:
    - main
    - develop
```

Esse workflow roda quando um PR mirar:

```text
main;
develop.
```

Esse é um dos usos mais importantes.

Antes de código entrar na branch principal, o pipeline valida.

---

#### workflow_dispatch

```yaml
workflow_dispatch:
```

Permite rodar manualmente pela interface do GitHub.

Isso é útil para:

```text
testar workflow;
reexecutar validação;
validar ajuste sem novo push;
ensinar e demonstrar pipeline.
```

---

#### permissions

```yaml
permissions:
  contents: read
```

Aqui aplicamos uma ideia de segurança:

```text
dar ao workflow apenas a permissão necessária.
```

Para baixar o código e rodar testes, leitura do conteúdo basta.

Em pipelines mais avançados, permissões podem aumentar.

Mas não comece dando tudo.

---

#### jobs

```yaml
jobs:
  validar-java:
```

Define os jobs.

Aqui temos um job chamado:

```text
validar-java
```

O nome interno não pode ter espaço.

---

#### name do job

```yaml
name: Validar projeto Java da aula 261
```

Esse nome aparece na interface.

É mais amigável que o ID interno.

---

#### runs-on

```yaml
runs-on: ubuntu-latest
```

O job vai rodar em um runner Linux hospedado pelo GitHub.

Em projetos Java Backend, isso é comum.

---

#### defaults working-directory

```yaml
defaults:
  run:
    working-directory: labs/m11/aula-261-ci-cd-github-actions
```

Isso define a pasta padrão dos comandos `run`.

Como nosso `pom.xml` está dentro do laboratório, e não na raiz, precisamos dizer ao workflow onde rodar comandos Maven.

Sem isso, o erro provável seria:

```text
The goal you specified requires a project to execute but there is no POM in this directory
```

Esse erro acontece quando o Maven roda em uma pasta sem `pom.xml`.

---

#### checkout

```yaml
- name: Baixar código do repositório
  uses: actions/checkout@v4
```

O runner começa vazio.

Você precisa baixar o código do repositório.

Essa action faz isso.

Sem checkout, o workflow não encontra seus arquivos.

---

#### setup-java

```yaml
- name: Configurar Java 21
  uses: actions/setup-java@v4
  with:
    distribution: temurin
    java-version: "21"
    cache: maven
```

Esse step prepara Java 21.

Também habilita cache Maven.

O cache ajuda a reaproveitar dependências entre execuções, reduzindo tempo.

Nesta aula, não vamos aprofundar cache.

O foco é entender que pipeline precisa preparar o ambiente.

---

#### Exibir versões

```yaml
- name: Exibir versões
  run: |
    java -version
    mvn -version
```

Isso ajuda no diagnóstico.

Quando o pipeline falha, é útil saber:

```text
qual Java foi usado;
qual Maven foi usado;
qual ambiente estava rodando.
```

---

#### Rodar testes

```yaml
- name: Rodar testes
  run: mvn -B clean test
```

`mvn clean test` executa testes.

O `-B` significa batch mode.

Ele reduz interatividade e deixa a saída mais adequada para CI.

Em pipeline, prefira comandos não interativos.

---

### 5.9 Rodar local antes de commitar

Antes de enviar para o GitHub, rode localmente:

```powershell
cd labs\m11\aula-261-ci-cd-github-actions
mvn clean test
```

Depois volte para a raiz:

```powershell
cd ..\..\..
```

Verifique arquivos:

```powershell
git status
```

Você deve ver algo como:

```text
.github/workflows/aula-261-ci-basico.yml
labs/m11/aula-261-ci-cd-github-actions/pom.xml
labs/m11/aula-261-ci-cd-github-actions/src/...
```

---

### 5.10 Commit recomendado

Na raiz do repositório:

```bash
git status
git add .github/workflows/aula-261-ci-basico.yml
git add labs/m11/aula-261-ci-cd-github-actions
git commit -m "Aula 261: CI basico com GitHub Actions"
git status
```

Depois envie para o GitHub:

```bash
git push
```

Se você estiver em uma branch nova:

```bash
git push -u origin feature/aula-261-ci-basico
```

---

### 5.11 Ver execução no GitHub

No GitHub, abra o repositório e vá em:

```text
Actions
```

Você deve ver o workflow:

```text
Aula 261 - CI básico Java
```

Abra a execução.

Observe:

```text
evento que disparou;
branch;
commit;
job;
steps;
tempo de execução;
logs.
```

Clique no job:

```text
Validar projeto Java da aula 261
```

Verifique os steps:

```text
Baixar código do repositório;
Configurar Java 21;
Exibir versões;
Rodar testes.
```

Se tudo estiver correto, o workflow ficará verde.

---

### 5.12 Testar falha proposital

Este passo é opcional, mas didático.

Altere temporariamente um teste para quebrar.

Exemplo:

```java
assertThat(resultado).isEqualTo(999);
```

Rode local:

```powershell
mvn clean test
```

Deve falhar.

Agora imagine que você mandasse isso para o GitHub.

O pipeline também falharia.

Essa é a proteção.

Corrija o teste:

```java
assertThat(resultado).isEqualTo(15);
```

Rode de novo:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Regra profissional:

```text
pipeline vermelho não é enfeite.
Pipeline vermelho é bloqueio técnico.
```

---

### 5.13 Criar um Pull Request

Se você estiver usando branch, abra um PR para:

```text
main
```

ou:

```text
develop
```

O workflow deve rodar no PR.

A ideia é:

```text
o código só deve ser revisado/mergeado se as validações passarem.
```

Em empresa, muitas vezes existe regra de branch protection.

Exemplo:

```text
não permitir merge se pipeline falhar;
exigir aprovação;
exigir PR atualizado;
exigir status checks obrigatórios.
```

Não vamos configurar branch protection agora.

Mas você precisa entender o motivo.

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que criar workflow dentro de .github/workflows

O GitHub Actions procura workflows dentro de:

```text
.github/workflows
```

Se você colocar o YAML em outro lugar, ele não será reconhecido como workflow.

Essa pasta faz parte da estrutura oficial do GitHub Actions.

---

### 6.2 Por que usar push e pull_request

`push` ajuda a validar commits enviados para branches.

`pull_request` ajuda a validar código antes de entrar em uma branch importante.

Em backend profissional, `pull_request` é indispensável.

Sem validação em PR, o time depende de confiança manual.

Com validação em PR, o time tem evidência automatizada.

---

### 6.3 Por que usar workflow_dispatch

`workflow_dispatch` permite execução manual.

Isso ajuda quando você quer:

```text
testar pipeline;
reexecutar depois de instabilidade;
ensinar o fluxo;
validar uma mudança sem criar evento novo.
```

Em workflows futuros, `workflow_dispatch` pode aceitar inputs.

Exemplo futuro:

```text
ambiente;
versão;
tipo de execução;
flag de deploy.
```

Por enquanto, usamos sem inputs.

---

### 6.4 Por que configurar Java no runner

O runner é uma máquina nova para a execução.

Você não deve assumir que ele já tem exatamente o Java que você quer.

Por isso usamos:

```yaml
actions/setup-java
```

E definimos:

```text
Java 21;
Temurin.
```

Isso mantém coerência com a formação.

---

### 6.5 Por que usar working-directory

Nosso repositório de curso tem vários laboratórios.

O `pom.xml` da aula está dentro de:

```text
labs/m11/aula-261-ci-cd-github-actions
```

Se o workflow rodar Maven na raiz, ele não encontrará o `pom.xml`.

Então usamos:

```yaml
defaults:
  run:
    working-directory: labs/m11/aula-261-ci-cd-github-actions
```

Isso ensina uma habilidade real.

Muitos projetos corporativos têm:

```text
monorepo;
múltiplos módulos;
apps diferentes;
pastas específicas;
serviços separados.
```

Saber definir diretório de execução evita muito erro.

---

### 6.6 Por que usar permissões mínimas

Este bloco:

```yaml
permissions:
  contents: read
```

é simples, mas importante.

Ele comunica:

```text
este workflow só precisa ler o repositório.
```

Quando um pipeline precisa publicar pacote, comentar em PR, enviar imagem ou criar release, permissões podem mudar.

Mas a regra é:

```text
comece com o mínimo necessário.
```

Isso faz parte de segurança em pipeline.

---

### 6.7 Por que não usar secrets nesta aula

Secrets são importantes.

Mas usar secrets cedo demais pode desviar o foco.

Nesta aula, queremos entender:

```text
workflow;
gatilhos;
jobs;
steps;
runner;
execução;
logs;
falha;
sucesso.
```

Secrets entram com mais força em aulas sobre:

```text
Docker registry;
deploy;
supply chain;
segurança;
cloud.
```

Aqui basta entender:

```text
não coloque senha no YAML;
não imprima segredo em log;
use secrets quando houver dado sensível.
```

---

### 6.8 Por que não fazer pipeline completo agora

Porque pipeline profissional é grande.

Se colocarmos tudo nesta aula, você copiaria YAML sem entender.

A sequência correta é:

```text
261:
conceitos, workflow e gatilhos.

262:
pipeline Maven com testes, JaCoCo, relatórios e artefatos.

263:
pipeline Docker com build, tags, registry, secrets e imagem versionada.

264:
formatação e qualidade.

265:
segurança de dependências e supply chain.
```

Esse ritmo evita que você vire apenas copiador de pipeline.

O objetivo é formar raciocínio.

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Workflow não aparece na aba Actions

Causas comuns:

```text
arquivo não está em .github/workflows;
arquivo não foi commitado;
arquivo não foi enviado para o GitHub;
extensão errada;
YAML inválido;
Actions desabilitado no repositório.
```

Verifique:

```bash
git status
git log --oneline -5
git push
```

Confirme o caminho:

```text
.github/workflows/aula-261-ci-basico.yml
```

---

### 7.2 Erro de YAML

Sintomas:

```text
workflow não roda;
GitHub mostra erro de sintaxe;
indentação inválida.
```

YAML depende de indentação.

Errado:

```yaml
jobs:
validar-java:
```

Certo:

```yaml
jobs:
  validar-java:
```

Evite tab.

Use espaços.

---

### 7.3 Maven não encontra pom.xml

Erro comum:

```text
The goal you specified requires a project to execute but there is no POM in this directory
```

Causa:

```text
Maven rodou na pasta errada.
```

Solução:

```yaml
defaults:
  run:
    working-directory: labs/m11/aula-261-ci-cd-github-actions
```

Ou no step:

```yaml
- name: Rodar testes
  working-directory: labs/m11/aula-261-ci-cd-github-actions
  run: mvn -B clean test
```

Nesta aula usamos `defaults`.

---

### 7.4 Java errado no pipeline

Sintoma:

```text
invalid target release: 21
```

Causa provável:

```text
runner está usando Java diferente do esperado.
```

Confirme se existe:

```yaml
- name: Configurar Java 21
  uses: actions/setup-java@v4
  with:
    distribution: temurin
    java-version: "21"
```

E confira logs do step:

```text
Exibir versões
```

---

### 7.5 Teste passa local mas falha no GitHub

Possíveis causas:

```text
arquivo não commitado;
diferença de sistema operacional;
dependência local escondida;
teste dependente de ordem;
teste dependente de horário;
teste dependente de caminho absoluto;
teste dependente de arquivo local ignorado;
encoding;
variável de ambiente local.
```

Diagnóstico:

```text
olhe o log completo;
confira diretório;
confira Java;
confira Maven;
confira arquivos commitados;
rode clean test localmente.
```

Regra:

```text
pipeline é ambiente limpo.
Se só funciona localmente, há dependência escondida.
```

---

### 7.6 Action de terceiros não confiável

Evite sair copiando qualquer action da internet.

Riscos:

```text
vazar secrets;
executar código malicioso;
quebrar pipeline;
depender de action abandonada;
não ter versão fixa.
```

Comece com actions oficiais e conhecidas.

Exemplos desta aula:

```text
actions/checkout;
actions/setup-java.
```

---

### 7.7 Pipeline demora demais

Nesta aula, o pipeline é pequeno.

Mas em projetos reais, demora pode vir de:

```text
download de dependências;
sem cache;
testes lentos;
jobs sequenciais;
build Docker pesado;
integração externa;
testes instáveis.
```

Otimizações vêm depois.

Por enquanto, entenda o fluxo.

---

### 7.8 Pull request não dispara workflow

Verifique:

```yaml
pull_request:
  branches:
    - main
    - develop
```

Isso significa:

```text
o PR precisa mirar main ou develop.
```

Se o PR mirar outra branch, talvez o workflow não rode.

Também confira se o arquivo workflow existe na branch adequada.

---

## 8. Exercício prático principal

### Missão

Criar um laboratório de CI básico com GitHub Actions.

Você deve criar:

```text
labs/m11/aula-261-ci-cd-github-actions
.github/workflows/aula-261-ci-basico.yml
```

O pipeline deve:

```text
rodar em push;
rodar em pull_request;
permitir execução manual;
usar ubuntu-latest;
usar Java 21 Temurin;
baixar o repositório;
rodar mvn -B clean test;
usar working-directory correto;
mostrar versões de Java e Maven.
```

---

### Roteiro de execução

1. Criar projeto Maven da aula.
2. Criar classe `CalculadoraPipeline`.
3. Criar testes com JUnit 5 e AssertJ.
4. Rodar localmente:

```powershell
mvn clean test
```

5. Criar pasta:

```text
.github/workflows
```

6. Criar workflow:

```text
aula-261-ci-basico.yml
```

7. Commitar alterações.
8. Fazer push.
9. Abrir aba Actions no GitHub.
10. Verificar execução.
11. Abrir logs.
12. Confirmar que o job passou.
13. Criar ou atualizar um Pull Request.
14. Confirmar execução no PR.
15. Testar falha proposital em branch separada, se quiser praticar diagnóstico.

---

### Critérios de aceite

O exercício está concluído quando:

```text
mvn clean test passa localmente;
workflow aparece no GitHub Actions;
workflow roda em push;
workflow roda em pull_request;
workflow pode ser executado manualmente;
job usa Java 21;
job roda na pasta correta;
testes passam no GitHub;
você consegue abrir logs;
você consegue explicar cada bloco do YAML;
você entende por que pipeline protege pull request;
você entende diferença entre CI e CD;
você sabe o que é workflow, job, step, action, runner e trigger.
```

---

## 9. Checkpoint final

Antes de encerrar, responda mentalmente:

```text
1. O que é CI?
2. O que é CD?
3. Qual diferença entre Continuous Delivery e Continuous Deployment?
4. O que é pipeline?
5. O que é GitHub Actions?
6. Onde ficam os workflows no repositório?
7. O que é workflow?
8. O que é trigger/gatilho?
9. Para que serve push?
10. Para que serve pull_request?
11. Para que serve workflow_dispatch?
12. O que é job?
13. O que é runner?
14. O que é step?
15. O que é action?
16. Para que serve actions/checkout?
17. Para que serve actions/setup-java?
18. Por que configurar Java 21?
19. Por que usar working-directory?
20. Por que pipeline em PR é importante?
```

Checklist curto:

```text
[ ] Criei o projeto Maven da aula 261.
[ ] Criei a classe de exemplo.
[ ] Criei os testes.
[ ] Rodei mvn clean test localmente.
[ ] Criei .github/workflows/aula-261-ci-basico.yml.
[ ] Configurei push, pull_request e workflow_dispatch.
[ ] Configurei Java 21.
[ ] Configurei working-directory.
[ ] Fiz commit.
[ ] Fiz push.
[ ] Vi o workflow rodando no GitHub.
[ ] Abri os logs.
[ ] Entendi cada parte do YAML.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você criou o primeiro workflow de CI da formação.

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
Java 21 no pipeline;
working-directory;
mvn clean test;
logs;
falha e sucesso;
validação em pull request;
permissões mínimas.
```

A ideia principal é:

```text
CI/CD não é só automação.
CI/CD é disciplina de engenharia para proteger o código, reduzir risco e criar evidência técnica a cada mudança.
```

Você também viu que um pipeline precisa responder perguntas importantes:

```text
o código compila?
os testes passam?
o ambiente está configurado corretamente?
o PR pode ser integrado?
se falhou, onde falhou?
qual comando falhou?
qual evidência existe?
```

Nesta aula, o pipeline foi propositalmente simples.

Na próxima aula, vamos aprofundar o pipeline Maven.

A próxima aula será:

```text
262 — M11.18 — Pipeline Maven com testes, JaCoCo, relatórios e artefatos
```

Nela, vamos evoluir de:

```text
mvn clean test
```

para uma rotina mais completa, com:

```text
ciclo Maven no pipeline;
testes;
relatórios;
JaCoCo;
cobertura;
artefatos;
evidências;
organização de jobs;
leitura profissional do resultado.
```

Ainda não vamos pular para Spring Boot.

Ainda não vamos iniciar SQL.

Vamos fechar M11 com ferramentas profissionais do jeito certo.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add .github/workflows/aula-261-ci-basico.yml
git add labs/m11/aula-261-ci-cd-github-actions
git commit -m "Aula 261: CI basico com GitHub Actions"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-261-ci-basico
git add .github/workflows/aula-261-ci-basico.yml
git add labs/m11/aula-261-ci-cd-github-actions
git commit -m "Aula 261: CI basico com GitHub Actions"
git push -u origin feature/aula-261-ci-basico
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 261 — M11.17 — CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos

Nesta aula, estudei os fundamentos de CI/CD e comecei a usar GitHub Actions para automatizar validações de um projeto Java Backend.

Aprendi a diferença entre CI, Continuous Delivery e Continuous Deployment, além dos conceitos de pipeline, workflow, gatilho, job, runner, step e action.

Criei um laboratório Maven em `labs/m11/aula-261-ci-cd-github-actions` e configurei um workflow em `.github/workflows/aula-261-ci-basico.yml`, com execução em `push`, `pull_request` e `workflow_dispatch`.

Também configurei Java 21 com Temurin no runner, usei `actions/checkout`, `actions/setup-java`, defini `working-directory` para rodar Maven na pasta correta e executei `mvn -B clean test` no pipeline.

Entendi que pipeline protege a branch principal, fornece evidência técnica para pull requests e ajuda a evitar problemas que só aparecem fora da máquina local.
```

---

## Referências oficiais consultadas

Esta aula foi escrita tomando como base a documentação oficial do GitHub Actions sobre workflows, eventos/gatilhos, sintaxe de workflow, contexts, variables e secrets.

Pontos importantes utilizados:

```text
workflows são processos automatizados definidos em arquivos YAML dentro de .github/workflows;
eventos como push, pull_request e workflow_dispatch podem disparar workflows;
jobs rodam em runners;
steps podem executar comandos ou usar actions;
contexts e variables fornecem dados para workflows;
secrets devem ser tratados como dados sensíveis e não devem ser impressos em logs.
```
