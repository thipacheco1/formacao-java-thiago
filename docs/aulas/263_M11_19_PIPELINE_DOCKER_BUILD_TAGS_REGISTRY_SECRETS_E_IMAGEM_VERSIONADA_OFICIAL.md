# 263 — M11.19 — Pipeline Docker: build, tags, registry, secrets e imagem versionada

## 1. Objetivo da aula

Na aula 262, você evoluiu o pipeline Maven.

Você trabalhou com:

```text
mvn clean verify;
testes automatizados;
JaCoCo;
relatórios Surefire;
relatório de cobertura;
JAR gerado;
artifacts do GitHub Actions;
evidências técnicas no pipeline.
```

Agora vamos avançar para o próximo passo natural de um backend moderno:

```text
gerar uma imagem Docker no pipeline.
```

Até aqui, você já sabe criar Dockerfile localmente.

Também já sabe criar workflow com GitHub Actions.

Nesta aula, vamos juntar essas duas habilidades.

O objetivo é construir um pipeline que:

```text
roda testes;
gera uma imagem Docker;
aplica tags profissionais;
diferencia Pull Request de branch principal;
prepara push para registry;
usa GitHub Container Registry;
usa permissões adequadas;
usa token seguro;
versiona imagem com branch, Pull Request, latest e hash do commit.
```

Ao final desta aula, você deve conseguir:

```text
entender por que imagem Docker é artifact de runtime;
entender diferença entre JAR artifact e Docker image;
criar Dockerfile multi-stage para aplicação Java;
criar .dockerignore;
buildar imagem localmente;
rodar container localmente;
testar endpoint de health;
entender registry;
entender GitHub Container Registry;
entender tag latest, branch, pull request e sha;
entender por que tag latest sozinha é perigosa;
usar docker/metadata-action para gerar tags;
usar docker/login-action para login em registry;
usar docker/build-push-action para build e push;
usar GITHUB_TOKEN com packages: write;
diferenciar build em PR e push em branch;
diagnosticar erros comuns de Docker no pipeline;
preparar a base para segurança de imagem e supply chain.
```

Esta aula não vai configurar Checkstyle, Spotless ou SCA.

Isso fica para as próximas aulas.

Também não vamos para Spring Boot.

Também não vamos iniciar SQL.

Aqui o foco é:

```text
pipeline Docker profissional inicial.
```

---

## 2. Onde estamos na formação

Estamos no módulo:

```text
M11 — Ferramentas essenciais do Java Backend profissional
```

A sequência deste trecho é:

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

A aula 263 é uma ponte entre:

```text
build Java
```

e:

```text
entrega de aplicação empacotada como imagem.
```

Em uma empresa, muitas aplicações Java Backend são entregues como imagens Docker.

A imagem pode depois ser executada em:

```text
Docker;
Docker Compose;
Kubernetes;
ECS;
Cloud Run;
OpenShift;
Nomad;
ambiente interno da empresa.
```

Então o pipeline precisa ser capaz de gerar essa imagem de forma padronizada.

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-263-pipeline-docker
```

E o workflow:

```text
.github/workflows/aula-263-pipeline-docker.yml
```

A estrutura será:

```text
.github
└── workflows
    └── aula-263-pipeline-docker.yml

labs
└── m11
    └── aula-263-pipeline-docker
        ├── .dockerignore
        ├── Dockerfile
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula263
            │                       ├── App.java
            │                       └── SaudacaoService.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula263
                                    └── SaudacaoServiceTest.java
```

A aplicação será uma API HTTP mínima usando recursos da própria JDK.

Não vamos usar Spring Boot ainda.

Ela terá endpoints simples:

```text
GET /
GET /health
GET /version
```

O pipeline fará:

```text
checkout;
setup Java 21;
mvn test;
setup Docker Buildx;
login no GitHub Container Registry;
geração de metadata/tags;
build da imagem;
push da imagem quando não for Pull Request.
```

Em Pull Request, o pipeline vai buildar a imagem, mas não publicar.

Isso é importante.

Regra profissional:

```text
PR valida.
Branch principal publica.
```

---

## 4. Conceitos essenciais antes da prática

### 4.1 JAR artifact vs Docker image

Na aula 262, você publicou um JAR como artifact.

Um JAR é um pacote Java.

Ele ainda precisa de ambiente para rodar:

```text
Java instalado;
variáveis configuradas;
comando correto;
porta;
sistema operacional;
dependências externas.
```

Uma imagem Docker empacota mais contexto de execução.

Ela pode conter:

```text
runtime Java;
JAR da aplicação;
diretório de trabalho;
variáveis padrão;
porta exposta;
comando de inicialização.
```

Resumo:

```text
JAR:
artefato Java.

Imagem Docker:
artefato executável de runtime em container.
```

---

### 4.2 O que é registry

Registry é um repositório de imagens Docker.

Ele armazena imagens para que outros ambientes possam baixar e executar.

Exemplos:

```text
Docker Hub;
GitHub Container Registry;
Amazon ECR;
Azure Container Registry;
Google Artifact Registry;
Harbor;
registry privado da empresa.
```

Nesta aula, vamos usar conceito de GitHub Container Registry, também conhecido como GHCR.

O endereço normalmente começa com:

```text
ghcr.io
```

Exemplo de imagem:

```text
ghcr.io/usuario/repositorio:sha-abc123
```

---

### 4.3 O que é tag de imagem

Tag é uma etiqueta associada à imagem.

Exemplos:

```text
minha-api:latest
minha-api:1.0.0
minha-api:main
minha-api:sha-a1b2c3d
minha-api:pr-25
```

A tag ajuda a identificar a versão da imagem.

Mas cuidado.

A tag não é a imagem em si.

A tag aponta para uma imagem.

Você pode ter várias tags apontando para o mesmo conteúdo.

---

### 4.4 Por que latest sozinho é perigoso

A tag:

```text
latest
```

parece confortável, mas pode ser perigosa.

Ela não diz exatamente:

```text
qual commit gerou a imagem;
quando foi gerada;
qual versão do código contém;
se é a mesma imagem de ontem;
se foi sobrescrita.
```

Em ambiente real, usar apenas `latest` dificulta:

```text
rollback;
auditoria;
rastreabilidade;
investigação;
comparação entre versões.
```

Por isso, uma imagem profissional costuma ter tags como:

```text
branch;
pull request;
sha do commit;
versão semântica;
número de build;
latest apenas em branch principal.
```

Nesta aula, usaremos tags automáticas com base em metadata.

---

### 4.5 O que é imagem versionada

Imagem versionada é uma imagem que pode ser rastreada.

Exemplo:

```text
ghcr.io/thiago/minha-api:sha-a1b2c3d
```

Essa tag mostra que a imagem veio de um commit específico.

Isso permite responder:

```text
qual código está rodando?
qual commit gerou essa imagem?
consigo voltar para a versão anterior?
consigo comparar logs com versão?
consigo reproduzir o build?
```

Rastreabilidade é parte da mentalidade de engenharia.

---

### 4.6 O que é secret no pipeline

Secret é um valor sensível armazenado de forma protegida no GitHub Actions.

Exemplos:

```text
senha de registry;
token Docker Hub;
chave de cloud;
senha de banco;
token de deploy.
```

Nesta aula, vamos usar principalmente:

```text
secrets.GITHUB_TOKEN
```

Esse token é fornecido automaticamente pelo GitHub Actions.

Ele permite que o workflow interaja com o próprio GitHub, respeitando permissões configuradas.

Para publicar imagem no GitHub Container Registry, o workflow precisa de:

```yaml
permissions:
  contents: read
  packages: write
```

E login usando:

```yaml
password: ${{ secrets.GITHUB_TOKEN }}
```

Regra profissional:

```text
nunca coloque senha diretamente no YAML.
```

---

### 4.7 Build em Pull Request vs Push em branch

Em Pull Request, queremos validar:

```text
testes passam?
Dockerfile funciona?
imagem consegue ser buildada?
```

Mas normalmente não queremos publicar imagem a cada PR.

Por quê?

```text
evita poluir registry;
evita publicar código não aprovado;
reduz risco;
separa validação de entrega.
```

Então aplicamos esta regra:

```text
pull_request:
builda, mas não faz push.

push para branch configurada:
builda e faz push.
```

No YAML, isso aparece como:

```yaml
push: ${{ github.event_name != 'pull_request' }}
```

---

### 4.8 Docker Buildx

Docker Buildx é uma ferramenta moderna de build Docker.

Ela permite recursos avançados como:

```text
build cache;
multi-platform;
builders customizados;
integração com GitHub Actions;
melhor controle do build.
```

Nesta aula, vamos usar:

```yaml
docker/setup-buildx-action
```

Não vamos aprofundar multi-platform ainda.

O foco é preparar o pipeline corretamente.

---

### 4.9 docker/metadata-action

A action:

```text
docker/metadata-action
```

gera tags e labels automaticamente.

Ela ajuda a evitar YAML manual demais.

Exemplos de tags geradas:

```text
main;
pr-12;
sha-a1b2c3d;
latest na branch principal.
```

Isso torna o versionamento da imagem mais padronizado.

---

### 4.10 docker/build-push-action

A action:

```text
docker/build-push-action
```

faz o build da imagem Docker e, se configurado, envia para o registry.

Ela recebe:

```text
context;
file;
push;
tags;
labels.
```

Nesta aula, ela será o coração do pipeline Docker.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-263-pipeline-docker
cd labs\m11\aula-263-pipeline-docker

mkdir src\main\java\br\com\curso\aula263
mkdir src\test\java\br\com\curso\aula263
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-263-pipeline-docker/src/main/java/br/com/curso/aula263
mkdir -p labs/m11/aula-263-pipeline-docker/src/test/java/br/com/curso/aula263
cd labs/m11/aula-263-pipeline-docker
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
    <artifactId>aula-263-pipeline-docker</artifactId>
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
        <finalName>aula-263-pipeline-docker</finalName>

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
                            <mainClass>br.com.curso.aula263.App</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

### 5.3 Criar o serviço de saudação

Crie:

```text
src/main/java/br/com/curso/aula263/SaudacaoService.java
```

Conteúdo:

```java
package br.com.curso.aula263;

public class SaudacaoService {

    public String gerarMensagem(String nome) {
        String nomeTratado = tratarNome(nome);

        return "Aula 263 - Pipeline Docker para " + nomeTratado;
    }

    private String tratarNome(String nome) {
        if (nome == null || nome.isBlank()) {
            return "Java Backend";
        }

        return nome.trim();
    }
}
```

Essa classe existe para termos uma regra simples testável.

---

### 5.4 Criar a aplicação HTTP mínima

Crie:

```text
src/main/java/br/com/curso/aula263/App.java
```

Conteúdo:

```java
package br.com.curso.aula263;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class App {

    public static void main(String[] args) throws IOException {
        int port = lerPorta();
        String version = lerVariavel("APP_VERSION", "local");
        String ambiente = lerVariavel("APP_ENV", "local");

        SaudacaoService saudacaoService = new SaudacaoService();

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/", exchange -> responder(
                exchange,
                200,
                saudacaoService.gerarMensagem("Thiago")
        ));

        server.createContext("/health", exchange -> responder(
                exchange,
                200,
                "{\"status\":\"UP\",\"ambiente\":\"" + ambiente + "\"}"
        ));

        server.createContext("/version", exchange -> responder(
                exchange,
                200,
                "{\"version\":\"" + version + "\"}"
        ));

        server.start();

        System.out.println("Aplicação da aula 263 iniciada.");
        System.out.println("Porta: " + port);
        System.out.println("Ambiente: " + ambiente);
        System.out.println("Versão: " + version);
    }

    private static int lerPorta() {
        String valor = System.getenv("APP_PORT");

        if (valor == null || valor.isBlank()) {
            return 8080;
        }

        return Integer.parseInt(valor);
    }

    private static String lerVariavel(String nome, String valorPadrao) {
        String valor = System.getenv(nome);

        if (valor == null || valor.isBlank()) {
            return valorPadrao;
        }

        return valor.trim();
    }

    private static void responder(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().add("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);

        try (OutputStream outputStream = exchange.getResponseBody()) {
            outputStream.write(bytes);
        }
    }
}
```

Observação:

```text
Estamos usando HttpServer da própria JDK para não entrar em Spring Boot ainda.
```

É uma aplicação HTTP mínima, suficiente para testar container.

---

### 5.5 Criar teste unitário

Crie:

```text
src/test/java/br/com/curso/aula263/SaudacaoServiceTest.java
```

Conteúdo:

```java
package br.com.curso.aula263;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("SaudacaoService")
class SaudacaoServiceTest {

    private final SaudacaoService service = new SaudacaoService();

    @Test
    @DisplayName("deve gerar saudação com nome informado")
    void deveGerarSaudacaoComNomeInformado() {
        String mensagem = service.gerarMensagem("Thiago");

        assertThat(mensagem).isEqualTo("Aula 263 - Pipeline Docker para Thiago");
    }

    @Test
    @DisplayName("deve usar Java Backend quando nome for nulo")
    void deveUsarJavaBackendQuandoNomeForNulo() {
        String mensagem = service.gerarMensagem(null);

        assertThat(mensagem).isEqualTo("Aula 263 - Pipeline Docker para Java Backend");
    }

    @Test
    @DisplayName("deve remover espaços do nome")
    void deveRemoverEspacosDoNome() {
        String mensagem = service.gerarMensagem("  Backend  ");

        assertThat(mensagem).isEqualTo("Aula 263 - Pipeline Docker para Backend");
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

---

### 5.6 Criar o Dockerfile multi-stage

Crie:

```text
Dockerfile
```

Conteúdo:

```dockerfile
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /build

COPY pom.xml .

RUN mvn -B dependency:go-offline

COPY src ./src

RUN mvn -B clean package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /build/target/aula-263-pipeline-docker.jar app.jar

ENV APP_PORT=8080
ENV APP_ENV=docker
ENV APP_VERSION=local

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

Esse Dockerfile tem dois estágios.

Primeiro estágio:

```text
usa Maven;
baixa dependências;
compila;
empacota JAR.
```

Segundo estágio:

```text
usa apenas JRE;
copia o JAR;
roda a aplicação.
```

Isso evita levar Maven para a imagem final.

---

### 5.7 Criar o .dockerignore

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

O `.dockerignore` evita enviar arquivos desnecessários para o contexto do build.

Isso ajuda a:

```text
reduzir tamanho do contexto;
evitar vazamento de arquivo local;
melhorar cache;
evitar builds lentos;
não copiar target antigo por acidente.
```

---

### 5.8 Build local da imagem

Execute:

```powershell
docker build -t aula-263-java-app:local .
```

Se tudo estiver certo, o Docker vai:

```text
baixar imagens base;
executar Maven no estágio build;
gerar JAR;
criar imagem final com JRE;
aplicar tag aula-263-java-app:local.
```

Veja a imagem:

```powershell
docker images
```

---

### 5.9 Rodar container localmente

Execute:

```powershell
docker run --rm --name aula-263-app -p 8080:8080 aula-263-java-app:local
```

Em outro terminal, teste:

```powershell
Invoke-RestMethod http://localhost:8080/health
```

Teste versão:

```powershell
Invoke-RestMethod http://localhost:8080/version
```

Teste raiz:

```powershell
Invoke-RestMethod http://localhost:8080/
```

Se estiver usando Git Bash, Linux ou macOS:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/version
curl http://localhost:8080/
```

Resultado esperado para health:

```json
{"status":"UP","ambiente":"docker"}
```

Para encerrar o container, pressione:

```text
CTRL + C
```

---

### 5.10 Rodar com variáveis

Execute:

```powershell
docker run --rm --name aula-263-app `
  -p 8080:8080 `
  -e APP_ENV=local-docker `
  -e APP_VERSION=sha-local `
  aula-263-java-app:local
```

No Git Bash/Linux/macOS:

```bash
docker run --rm --name aula-263-app \
  -p 8080:8080 \
  -e APP_ENV=local-docker \
  -e APP_VERSION=sha-local \
  aula-263-java-app:local
```

Teste:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/version
```

Agora você deve ver:

```text
APP_ENV refletido no /health;
APP_VERSION refletido no /version.
```

Isso reforça a regra profissional:

```text
imagem deve ser a mesma;
configuração muda por variável de ambiente.
```

---

### 5.11 Criar workflow Docker

Volte para a raiz do repositório.

No PowerShell, se estiver dentro da pasta do laboratório:

```powershell
cd ..\..\..
```

Crie a pasta de workflows, se ainda não existir:

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
.github/workflows/aula-263-pipeline-docker.yml
```

Conteúdo:

```yaml
name: Aula 263 - Pipeline Docker

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
  packages: write

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  pipeline-docker:
    name: Build e publicação de imagem Docker
    runs-on: ubuntu-latest

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Configurar Java 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Rodar testes Maven
        working-directory: labs/m11/aula-263-pipeline-docker
        run: mvn -B clean test

      - name: Configurar Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Fazer login no GitHub Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Gerar tags e labels da imagem
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix=sha-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Buildar imagem Docker
        uses: docker/build-push-action@v6
        with:
          context: labs/m11/aula-263-pipeline-docker
          file: labs/m11/aula-263-pipeline-docker/Dockerfile
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Esse workflow:

```text
roda testes Maven;
prepara Docker Buildx;
faz login no GHCR quando não é PR;
gera tags profissionais;
builda imagem;
publica imagem quando o evento não é pull_request.
```

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que rodar testes antes do build Docker

O pipeline faz:

```yaml
- name: Rodar testes Maven
  run: mvn -B clean test
```

antes do build Docker.

Motivo:

```text
não faz sentido gerar imagem de código com teste quebrado.
```

Pipeline profissional deve bloquear cedo.

Se teste falha, nem precisamos buildar imagem.

Isso economiza tempo e evita publicar artefato ruim.

---

### 6.2 Por que o Dockerfile também roda Maven

Nosso Dockerfile multi-stage faz:

```dockerfile
RUN mvn -B clean package
```

Então você pode perguntar:

```text
se o pipeline já roda teste, por que o Dockerfile também empacota?
```

Porque a imagem precisa ser autossuficiente no build.

O Dockerfile precisa saber gerar o JAR que vai entrar na imagem.

Em projetos maiores, existem variações:

```text
Dockerfile compila tudo;
pipeline compila e Dockerfile só copia JAR;
build usa cache avançado;
build usa imagem base corporativa;
build usa artefato Maven já publicado.
```

Nesta aula, manter o Dockerfile multi-stage é didático e reproduzível.

---

### 6.3 Por que usar Buildx

Usamos:

```yaml
docker/setup-buildx-action@v3
```

porque ele prepara um ambiente moderno de build Docker.

Mesmo que o build seja simples, Buildx prepara caminho para:

```text
cache;
multi-platform;
build remoto;
integração mais robusta com build-push-action.
```

É uma boa prática nos pipelines Docker modernos.

---

### 6.4 Por que login só fora de Pull Request

O login está assim:

```yaml
if: github.event_name != 'pull_request'
```

Isso evita usar credencial em Pull Request.

Motivos:

```text
PR pode vir de branch não confiável;
não queremos publicar imagem de código ainda não aprovado;
evitamos expor riscos desnecessários;
registry não fica poluído.
```

Em PR, o pipeline ainda valida o build Docker.

Mas não faz push.

---

### 6.5 Por que usar GITHUB_TOKEN

O workflow usa:

```yaml
password: ${{ secrets.GITHUB_TOKEN }}
```

Esse token é fornecido automaticamente pelo GitHub Actions.

Ele respeita as permissões declaradas:

```yaml
permissions:
  contents: read
  packages: write
```

Para publicar imagem no GHCR, precisamos de:

```text
packages: write
```

Se faltar, você pode ver erro de permissão.

---

### 6.6 Por que usar metadata-action

Sem metadata-action, você teria que escrever tags manualmente.

Exemplo manual:

```yaml
tags: |
  ghcr.io/usuario/repositorio:latest
  ghcr.io/usuario/repositorio:${{ github.sha }}
```

Funciona, mas cresce rápido.

A metadata-action ajuda a gerar tags baseadas em:

```text
branch;
pull request;
sha;
latest em branch principal.
```

Isso torna o pipeline mais organizado.

---

### 6.7 Entendendo as tags configuradas

Configuramos:

```yaml
tags: |
  type=ref,event=branch
  type=ref,event=pr
  type=sha,prefix=sha-
  type=raw,value=latest,enable={{is_default_branch}}
```

Isso significa:

```text
type=ref,event=branch:
gera tag com nome da branch.

type=ref,event=pr:
gera tag para Pull Request.

type=sha,prefix=sha-:
gera tag com hash do commit.

type=raw,value=latest,enable={{is_default_branch}}:
gera latest apenas na branch principal.
```

Exemplos possíveis:

```text
ghcr.io/usuario/repositorio:main
ghcr.io/usuario/repositorio:develop
ghcr.io/usuario/repositorio:pr-15
ghcr.io/usuario/repositorio:sha-a1b2c3d
ghcr.io/usuario/repositorio:latest
```

Em Pull Request, como `push` está falso, a imagem é buildada, mas não enviada.

---

### 6.8 Por que context aponta para o laboratório

O build-push-action usa:

```yaml
context: labs/m11/aula-263-pipeline-docker
file: labs/m11/aula-263-pipeline-docker/Dockerfile
```

O contexto é a pasta enviada para o Docker build.

Como nosso Dockerfile e pom.xml estão dentro do laboratório, usamos essa pasta como contexto.

Se apontar errado, o Dockerfile pode não encontrar:

```text
pom.xml;
src;
.dockerignore;
arquivos necessários.
```

---

### 6.9 Por que o .dockerignore importa no pipeline

Em CI, o contexto de build pode afetar:

```text
tempo;
cache;
segurança;
reprodutibilidade.
```

Sem `.dockerignore`, você pode enviar para o build:

```text
.git;
.github;
target;
logs;
arquivos de IDE;
.env.
```

Isso é ruim.

Regra:

```text
o Docker build deve receber só o necessário.
```

---

### 6.10 O que aparece em backend real

Em empresas, um pipeline Docker pode:

```text
rodar testes;
gerar JAR;
buildar imagem;
gerar tags;
fazer login no registry;
publicar imagem;
assinar imagem;
gerar SBOM;
rodar scan de vulnerabilidade;
promover imagem entre ambientes;
fazer deploy.
```

Nesta aula, ficamos no núcleo:

```text
build;
tags;
registry;
secrets;
imagem versionada.
```

Segurança avançada fica para a aula 265.

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Dockerfile não encontra pom.xml

Erro comum:

```text
COPY pom.xml . failed
```

ou:

```text
pom.xml not found
```

Causa provável:

```text
contexto do Docker build está errado.
```

No workflow, confira:

```yaml
context: labs/m11/aula-263-pipeline-docker
file: labs/m11/aula-263-pipeline-docker/Dockerfile
```

Se o contexto for a raiz, o Dockerfile precisará de caminhos diferentes.

Nesta aula, o contexto correto é a pasta do laboratório.

---

### 7.2 Maven falha dentro do Dockerfile

Causas comuns:

```text
teste quebrado;
dependência indisponível;
erro no pom.xml;
classe principal incorreta;
arquivo não copiado;
Java incompatível.
```

Diagnóstico local:

```powershell
docker build -t aula-263-java-app:local .
```

Diagnóstico no pipeline:

```text
abra logs do step Buildar imagem Docker.
```

---

### 7.3 Container sobe e morre

Se o container encerrar imediatamente, veja logs:

```powershell
docker logs aula-263-app
```

Possíveis causas:

```text
JAR não encontrado;
mainClass errada;
erro de porta;
exceção na inicialização;
comando ENTRYPOINT errado.
```

No nosso caso, a aplicação HTTP deve ficar rodando.

Se sair imediatamente, algo está errado.

---

### 7.4 Porta ocupada localmente

Erro:

```text
port is already allocated
```

Solução:

```powershell
docker ps
```

Pare o container antigo:

```powershell
docker stop aula-263-app
```

Ou rode em outra porta:

```powershell
docker run --rm --name aula-263-app -p 8085:8080 aula-263-java-app:local
```

Teste:

```powershell
Invoke-RestMethod http://localhost:8085/health
```

---

### 7.5 Erro de permissão ao publicar no GHCR

Erro comum:

```text
denied: permission_denied
```

ou:

```text
permission_denied: write_package
```

Verifique se o workflow tem:

```yaml
permissions:
  contents: read
  packages: write
```

Verifique também configurações do repositório e organização.

Em organizações, pode haver política bloqueando publicação.

---

### 7.6 Nome de imagem inválido

Alguns registries exigem nomes em letras minúsculas.

Se o owner ou repositório tiver letras maiúsculas, pode haver erro.

Solução prática:

```text
use nomes minúsculos para repositórios;
ou configure IMAGE_NAME manualmente em minúsculo.
```

Exemplo:

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: usuario/repositorio
```

---

### 7.7 Workflow não publica em Pull Request

Isso é esperado.

O workflow tem:

```yaml
push: ${{ github.event_name != 'pull_request' }}
```

Em PR:

```text
builda imagem;
não publica.
```

Isso é uma decisão de segurança.

Se você quer publicar imagem de PR, precisa fazer isso conscientemente.

Não é o padrão que vamos adotar agora.

---

### 7.8 latest não apareceu

A tag latest está configurada assim:

```yaml
type=raw,value=latest,enable={{is_default_branch}}
```

Isso significa:

```text
latest só aparece na branch principal padrão.
```

Se você rodou em feature branch, não espere latest.

Isso é bom.

Evita que qualquer branch sobrescreva latest.

---

### 7.9 GHCR publicou imagem privada

Dependendo da configuração do repositório e da conta, packages podem ficar privados.

Isso não é necessariamente erro.

Você pode ajustar visibilidade no GitHub, se fizer sentido.

Em empresa, imagem privada é comum.

---

### 7.10 Pipeline verde, mas imagem não foi publicada

Verifique:

```text
evento era pull_request?
login foi pulado?
push estava false?
permissão packages: write existe?
build-push-action mostrou digest?
registry aceitou publicação?
```

Olhe os logs dos steps:

```text
Fazer login no GitHub Container Registry;
Gerar tags e labels;
Buildar imagem Docker.
```

---

## 8. Exercício prático principal

### Missão

Criar um pipeline Docker completo inicial para uma aplicação Java.

Você deve criar:

```text
labs/m11/aula-263-pipeline-docker
.github/workflows/aula-263-pipeline-docker.yml
```

O laboratório deve conter:

```text
pom.xml;
Dockerfile;
.dockerignore;
App.java;
SaudacaoService.java;
SaudacaoServiceTest.java.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21;
rodar testes Maven;
configurar Docker Buildx;
fazer login no GitHub Container Registry fora de PR;
gerar tags com docker/metadata-action;
buildar imagem com docker/build-push-action;
publicar imagem quando não for PR;
não publicar imagem em Pull Request.
```

---

### Roteiro de validação local

Dentro do laboratório:

```powershell
mvn clean test
docker build -t aula-263-java-app:local .
docker run --rm --name aula-263-app -p 8080:8080 aula-263-java-app:local
```

Em outro terminal:

```powershell
Invoke-RestMethod http://localhost:8080/health
Invoke-RestMethod http://localhost:8080/version
Invoke-RestMethod http://localhost:8080/
```

Com variáveis:

```powershell
docker run --rm --name aula-263-app `
  -p 8080:8080 `
  -e APP_ENV=teste-local `
  -e APP_VERSION=sha-local `
  aula-263-java-app:local
```

---

### Roteiro de validação no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-263-pipeline-docker
git add .github/workflows/aula-263-pipeline-docker.yml
git commit -m "Aula 263: pipeline Docker com tags e registry"
git push
```

Depois, no GitHub:

```text
Actions;
Aula 263 - Pipeline Docker;
abrir execução;
verificar testes;
verificar build Docker;
verificar tags;
verificar publicação no GHCR se não for PR.
```

Se estiver em Pull Request:

```text
a imagem deve ser buildada;
a imagem não deve ser publicada.
```

Se estiver em branch configurada com push:

```text
a imagem deve ser publicada no GHCR, se permissões estiverem corretas.
```

---

### Critérios de aceite

O exercício está concluído quando:

```text
mvn clean test passa localmente;
docker build local funciona;
container local sobe;
endpoint /health responde;
endpoint /version responde;
.dockerignore existe;
Dockerfile é multi-stage;
workflow roda no GitHub Actions;
pipeline roda testes antes do Docker build;
Buildx é configurado;
metadata-action gera tags;
build-push-action executa;
PR não publica imagem;
push em branch publica imagem quando permitido;
você entende o papel do registry;
você entende GITHUB_TOKEN e packages: write;
você entende por que latest sozinho é perigoso;
você entende por que sha é importante.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. Qual diferença entre JAR artifact e Docker image?
2. O que é registry?
3. O que é GitHub Container Registry?
4. O que é tag de imagem?
5. Por que latest sozinho é perigoso?
6. Por que usar tag com sha do commit?
7. O que é imagem versionada?
8. O que é secret no pipeline?
9. Para que serve GITHUB_TOKEN?
10. Por que usar packages: write?
11. Por que buildar imagem em PR, mas não publicar?
12. Para que serve docker/setup-buildx-action?
13. Para que serve docker/metadata-action?
14. Para que serve docker/login-action?
15. Para que serve docker/build-push-action?
16. Por que .dockerignore importa?
17. Por que rodar testes antes do build Docker?
18. O que pode causar erro de permissão no GHCR?
19. O que pode causar erro de contexto no Docker build?
20. Como esta aula prepara supply chain e segurança?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 263.
[ ] Criei aplicação HTTP mínima com Java.
[ ] Criei teste unitário.
[ ] Criei Dockerfile multi-stage.
[ ] Criei .dockerignore.
[ ] Rodei mvn clean test.
[ ] Build da imagem local funcionou.
[ ] Container local respondeu /health.
[ ] Criei workflow Docker.
[ ] Configurei Buildx.
[ ] Configurei login no GHCR.
[ ] Configurei metadata-action.
[ ] Configurei build-push-action.
[ ] Entendi tags branch, PR, sha e latest.
[ ] Entendi publicação apenas fora de PR.
[ ] Entendi secrets e permissões básicas.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você saiu do pipeline Maven e entrou no pipeline Docker.

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
health endpoint;
publicação condicional;
Pull Request sem push de imagem;
troubleshooting de Docker no pipeline.
```

A ideia principal é:

```text
Pipeline Docker profissional não é apenas rodar docker build.
Ele precisa gerar uma imagem rastreável, versionada, publicável e segura o suficiente para entrar em uma cadeia de entrega.
```

Você agora começa a enxergar a aplicação Java como algo que passa por etapas:

```text
código;
testes;
JAR;
relatórios;
imagem Docker;
registry;
deploy futuro.
```

Na próxima aula, vamos continuar a maturidade do M11 com padronização automática de código.

A próxima aula será:

```text
264 — M11.20 — Checkstyle, Spotless e formatação automatizada com critério
```

Nela, vamos estudar:

```text
por que formatação importa;
diferença entre estilo e gosto pessoal;
Checkstyle;
Spotless;
formatação automática;
validação em pipeline;
padrão de time;
como evitar discussões inúteis em code review;
como manter consistência em projeto Java Backend.
```

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL.

Vamos concluir o bloco de ferramentas profissionais antes de avançar.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-263-pipeline-docker
git add .github/workflows/aula-263-pipeline-docker.yml
git commit -m "Aula 263: pipeline Docker com tags e registry"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-263-pipeline-docker
git add labs/m11/aula-263-pipeline-docker
git add .github/workflows/aula-263-pipeline-docker.yml
git commit -m "Aula 263: pipeline Docker com tags e registry"
git push -u origin feature/aula-263-pipeline-docker
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 263 — M11.19 — Pipeline Docker: build, tags, registry, secrets e imagem versionada

Nesta aula, evoluí o pipeline Java para gerar imagem Docker de forma automatizada.

Criei o laboratório `labs/m11/aula-263-pipeline-docker`, implementei uma aplicação HTTP mínima com Java, configurei testes unitários, criei um `Dockerfile` multi-stage e um `.dockerignore`.

Aprendi a diferença entre JAR como artifact Java e imagem Docker como artifact de runtime, além do papel de um registry como o GitHub Container Registry.

Configurei um workflow em `.github/workflows/aula-263-pipeline-docker.yml` com testes Maven, Docker Buildx, login no GHCR, geração automática de tags com `docker/metadata-action` e build/publicação com `docker/build-push-action`.

Também entendi por que uma imagem precisa ser versionada com tags como branch, PR e `sha`, por que `latest` sozinho é perigoso, como usar `GITHUB_TOKEN` com `packages: write`, e por que Pull Requests devem validar build sem necessariamente publicar imagem.
```
