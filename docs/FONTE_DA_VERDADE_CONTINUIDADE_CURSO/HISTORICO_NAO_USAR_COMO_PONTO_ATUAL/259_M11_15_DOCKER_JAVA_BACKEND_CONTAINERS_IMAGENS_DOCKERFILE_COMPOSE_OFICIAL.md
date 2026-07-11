# 259 — M11.15 — Docker para Java Backend: containers, imagens, Dockerfile e Docker Compose

## Objetivo da aula

Na aula anterior, você aprofundou SonarQube.

Você estudou:

```text
análise estática;
bugs;
vulnerabilities;
security hotspots;
code smells;
quality gate;
coverage;
JaCoCo XML;
pipeline;
new code;
dívida técnica;
relatório de qualidade;
governança técnica.
```

Agora vamos entrar em uma ferramenta essencial para backend moderno:

```text
Docker
```

Docker é uma tecnologia usada para empacotar e executar aplicações em containers.

Em projetos Java Backend profissionais, Docker aparece em várias situações:

```text
subir banco local;
subir Redis local;
subir RabbitMQ ou Kafka local;
rodar aplicação Java em container;
padronizar ambiente de desenvolvimento;
rodar testes de integração;
criar imagem para deploy;
simular ambiente próximo de produção;
usar docker-compose para stack local;
preparar aplicação Spring Boot para ambiente real.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é Docker;
entender o que é container;
entender o que é imagem;
entender diferença entre imagem e container;
entender Dockerfile;
entender build de imagem;
entender docker run;
entender portas;
entender variáveis de ambiente;
entender volumes;
entender redes;
entender Docker Compose;
criar uma aplicação Java simples;
gerar JAR;
criar Dockerfile;
criar imagem da aplicação;
executar container da aplicação;
subir PostgreSQL com Docker Compose;
subir aplicação e banco juntos;
entender logs;
entender troubleshooting básico;
preparar base para Spring Boot com Docker.
```

---

## Reforço do objetivo maior

Nosso objetivo é construir uma formação completa de Java Backend, do básico até nível engenheiro/arquiteto Java.

Por isso, Docker não será tratado apenas como:

```text
decorar docker run
```

O objetivo é entender o papel de containers em um ambiente profissional.

Um desenvolvedor backend avançado precisa saber:

```text
por que container existe;
como imagem é criada;
como container roda;
como aplicação Java entra em uma imagem;
como configurar variáveis por ambiente;
como expor porta;
como conectar aplicação com banco;
como ler logs;
como diagnosticar erro;
como evitar imagem pesada;
como preparar Dockerfile com boas práticas;
como Docker se conecta com CI/CD;
como isso prepara deploy em Kubernetes, ECS, Cloud Run ou ambientes similares.
```

Docker é uma ponte entre desenvolvimento, build, testes, infraestrutura e operação.

---

# Parte 1 — O problema que Docker resolve

Antes do Docker, era comum ouvir:

```text
funciona na minha máquina.
```

Por quê?

Porque cada máquina podia ter:

```text
versão diferente do Java;
versão diferente do Maven;
banco instalado diferente;
porta ocupada;
configuração local diferente;
variáveis de ambiente ausentes;
bibliotecas do sistema diferentes;
sistema operacional diferente;
serviços auxiliares instalados manualmente;
configuração difícil de reproduzir.
```

Docker ajuda a padronizar o ambiente.

Com Docker, você pode definir:

```text
qual imagem base usar;
qual JDK usar;
qual comando executar;
quais variáveis configurar;
quais portas expor;
quais serviços subir;
quais volumes persistir;
qual rede conectar.
```

---

## Docker em uma frase prática

```text
Docker permite empacotar e executar aplicações e serviços em containers reproduzíveis.
```

---

# Parte 2 — O que é container

Container é um processo isolado executando com um ambiente próprio.

Ele pode ter:

```text
sistema de arquivos próprio;
variáveis de ambiente próprias;
rede própria;
porta exposta;
processo principal;
dependências necessárias.
```

Um container não é uma máquina virtual completa.

Ele compartilha o kernel do sistema hospedeiro, mas isola o processo.

---

## Container em uma frase prática

```text
Container é uma forma leve e isolada de executar uma aplicação com seu ambiente.
```

---

# Parte 3 — O que é imagem

Imagem é o pacote imutável usado para criar containers.

Ela contém:

```text
sistema base;
runtime;
arquivos da aplicação;
dependências;
configurações;
comando padrão.
```

Você cria uma imagem.

Depois roda containers a partir dela.

---

## Imagem vs container

```text
Imagem:
molde.

Container:
execução do molde.
```

Exemplo:

```text
Imagem:
minha-api:1.0.0

Containers:
minha-api rodando na porta 8080
minha-api rodando na porta 8081
```

Você pode criar vários containers a partir da mesma imagem.

---

# Parte 4 — Analogia simples

Pense assim:

```text
Classe Java:
define estrutura.

Objeto:
instância da classe.
```

No Docker:

```text
Imagem:
define o pacote.

Container:
instância em execução da imagem.
```

Essa analogia não é perfeita, mas ajuda.

---

# Parte 5 — Conceitos principais

## Dockerfile

Arquivo de receita para criar imagem.

Exemplo:

```dockerfile
FROM eclipse-temurin:21-jre
COPY target/app.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## Image

Resultado do build do Dockerfile.

Exemplo:

```text
aula-259-java-api:1.0.0
```

---

## Container

Processo rodando a partir da imagem.

Exemplo:

```text
container aula-259-api rodando na porta 8080.
```

---

## Registry

Local onde imagens são armazenadas.

Exemplos:

```text
Docker Hub;
GitHub Container Registry;
Amazon ECR;
Azure Container Registry;
Google Artifact Registry;
registry privado da empresa.
```

---

## Docker Compose

Ferramenta para subir múltiplos containers com um arquivo YAML.

Exemplo:

```text
aplicação;
PostgreSQL;
Redis;
RabbitMQ;
SonarQube;
serviços auxiliares.
```

---

# Parte 6 — Comandos básicos

Ver versão:

```powershell
docker version
```

Ver informações:

```powershell
docker info
```

Listar containers em execução:

```powershell
docker ps
```

Listar todos os containers:

```powershell
docker ps -a
```

Listar imagens:

```powershell
docker images
```

Baixar imagem:

```powershell
docker pull postgres
```

Rodar container:

```powershell
docker run hello-world
```

Parar container:

```powershell
docker stop nome-ou-id
```

Remover container:

```powershell
docker rm nome-ou-id
```

Remover imagem:

```powershell
docker rmi nome-ou-id
```

Ver logs:

```powershell
docker logs nome-ou-id
```

Acompanhar logs:

```powershell
docker logs -f nome-ou-id
```

---

# Parte 7 — Rodando primeiro container

Execute:

```powershell
docker run hello-world
```

O que acontece:

```text
Docker procura imagem localmente;
se não encontrar, baixa do registry;
cria container;
executa processo;
mostra mensagem;
container finaliza.
```

Depois veja:

```powershell
docker ps -a
```

Você verá container finalizado.

---

# Parte 8 — Container em foreground e detached

Foreground:

```powershell
docker run nginx
```

O terminal fica preso no processo.

Detached:

```powershell
docker run -d nginx
```

O container roda em background.

Em backend, é comum usar `-d` para serviços como banco, Redis, RabbitMQ etc.

---

# Parte 9 — Nomeando container

Use:

```powershell
docker run --name meu-nginx -d nginx
```

Depois:

```powershell
docker ps
docker logs meu-nginx
docker stop meu-nginx
docker rm meu-nginx
```

Nome ajuda a operar.

---

# Parte 10 — Portas

Um container pode expor porta interna.

Mas, para acessar do host, você precisa mapear porta.

Exemplo:

```powershell
docker run --name meu-nginx -p 8080:80 -d nginx
```

Significa:

```text
porta 8080 da sua máquina
  -> porta 80 do container.
```

Formato:

```text
HOST:CONTAINER
```

---

## Exemplo backend

Aplicação Java roda dentro do container na porta:

```text
8080
```

Você quer acessar pela sua máquina em:

```text
8080
```

Mapeamento:

```powershell
-p 8080:8080
```

Se quiser usar porta local diferente:

```powershell
-p 9090:8080
```

Acesso:

```text
localhost:9090
```

---

# Parte 11 — Variáveis de ambiente

Aplicações backend usam variáveis para configurar:

```text
porta;
perfil;
URL do banco;
usuário;
senha;
timeout;
feature flags;
URLs externas.
```

No Docker:

```powershell
docker run -e APP_ENV=local minha-imagem
```

Várias variáveis:

```powershell
docker run ^
  -e DB_HOST=postgres ^
  -e DB_PORT=5432 ^
  -e DB_NAME=aula ^
  minha-imagem
```

Nunca coloque segredo real em imagem.

Segredo deve vir de ambiente seguro.

---

# Parte 12 — Volumes

Container é descartável.

Se você remove o container, dados internos podem ser perdidos.

Volume permite persistir dados.

Exemplo com PostgreSQL:

```powershell
docker volume create postgres-data
```

Rodando com volume:

```powershell
docker run --name postgres-aula ^
  -e POSTGRES_DB=aula ^
  -e POSTGRES_USER=aula ^
  -e POSTGRES_PASSWORD=aula ^
  -v postgres-data:/var/lib/postgresql/data ^
  -p 5432:5432 ^
  -d postgres
```

O volume persiste dados do banco.

---

## Tipos comuns

```text
named volume:
gerenciado pelo Docker.

bind mount:
mapeia pasta da sua máquina para dentro do container.
```

Exemplo bind mount:

```powershell
-v ${PWD}/logs:/app/logs
```

---

# Parte 13 — Redes

Containers podem se comunicar por rede Docker.

Quando você usa Docker Compose, os serviços geralmente entram na mesma rede.

Exemplo:

```text
api
postgres
```

A aplicação pode acessar o banco pelo nome do serviço:

```text
postgres
```

Não por `localhost`.

Isso é muito importante.

---

## localhost dentro do container

Dentro de um container:

```text
localhost
```

é o próprio container.

Então, se a API está em container e o banco está em outro container, a API não acessa banco com:

```text
localhost:5432
```

Ela deve usar o nome do serviço/container na rede Docker:

```text
postgres:5432
```

Esse ponto derruba muita gente no começo.

---

# Parte 14 — Dockerfile

Dockerfile é a receita da imagem.

Exemplo básico para Java:

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/aula.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Explicando:

```text
FROM:
imagem base.

WORKDIR:
diretório de trabalho dentro do container.

COPY:
copia arquivo da máquina/build para a imagem.

EXPOSE:
documenta porta usada pela aplicação.

ENTRYPOINT:
comando principal do container.
```

---

## EXPOSE não publica porta

`EXPOSE 8080` documenta que o container usa porta 8080.

Mas para acessar do host, ainda precisa:

```powershell
-p 8080:8080
```

---

# Parte 15 — CMD vs ENTRYPOINT

## CMD

Define comando padrão que pode ser sobrescrito facilmente.

Exemplo:

```dockerfile
CMD ["java", "-jar", "app.jar"]
```

## ENTRYPOINT

Define comando principal do container.

Exemplo:

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Em aplicações Java, é comum usar `ENTRYPOINT`.

---

## Forma exec vs shell

Preferível:

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Evite quando possível:

```dockerfile
ENTRYPOINT java -jar app.jar
```

A forma exec lida melhor com sinais e argumentos.

---

# Parte 16 — Laboratório: aplicação Java simples

Vamos criar uma aplicação Java simples com Maven.

Crie:

```powershell
mkdir labs\m11\aula-259-docker-java-backend
cd labs\m11\aula-259-docker-java-backend

mkdir src\main\java\br\com\curso\aula259
mkdir src\test\java\br\com\curso\aula259
```

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
    <artifactId>aula-259-docker-java-backend</artifactId>
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
        <finalName>aula-259-app</finalName>

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
                            <mainClass>br.com.curso.aula259.App</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# Parte 17 — Código Java

Crie:

```text
src/main/java/br/com/curso/aula259/AppConfig.java
```

Código:

```java
package br.com.curso.aula259;

public class AppConfig {
    private final String ambiente;
    private final String dbHost;
    private final String dbPort;
    private final String dbName;

    public AppConfig(String ambiente, String dbHost, String dbPort, String dbName) {
        this.ambiente = normalizar(ambiente, "local");
        this.dbHost = normalizar(dbHost, "localhost");
        this.dbPort = normalizar(dbPort, "5432");
        this.dbName = normalizar(dbName, "aula");
    }

    public static AppConfig carregarDoAmbiente() {
        return new AppConfig(
                System.getenv("APP_ENV"),
                System.getenv("DB_HOST"),
                System.getenv("DB_PORT"),
                System.getenv("DB_NAME")
        );
    }

    private String normalizar(String valor, String padrao) {
        if (valor == null || valor.isBlank()) {
            return padrao;
        }

        return valor.trim();
    }

    public String ambiente() {
        return ambiente;
    }

    public String dbHost() {
        return dbHost;
    }

    public String dbPort() {
        return dbPort;
    }

    public String dbName() {
        return dbName;
    }

    public String jdbcUrl() {
        return "jdbc:postgresql://" + dbHost + ":" + dbPort + "/" + dbName;
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula259/App.java
```

Código:

```java
package br.com.curso.aula259;

public class App {
    public static void main(String[] args) {
        AppConfig config = AppConfig.carregarDoAmbiente();

        System.out.println("Aplicação Java Backend iniciada.");
        System.out.println("Ambiente: " + config.ambiente());
        System.out.println("DB Host: " + config.dbHost());
        System.out.println("DB Port: " + config.dbPort());
        System.out.println("DB Name: " + config.dbName());
        System.out.println("JDBC URL: " + config.jdbcUrl());
    }
}
```

---

# Parte 18 — Teste da configuração

Crie:

```text
src/test/java/br/com/curso/aula259/AppConfigTest.java
```

Código:

```java
package br.com.curso.aula259;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("AppConfig")
class AppConfigTest {
    @Test
    @DisplayName("deve usar valores padrão quando entradas forem nulas")
    void deveUsarValoresPadraoQuandoEntradasForemNulas() {
        AppConfig config = new AppConfig(null, null, null, null);

        assertThat(config.ambiente()).isEqualTo("local");
        assertThat(config.dbHost()).isEqualTo("localhost");
        assertThat(config.dbPort()).isEqualTo("5432");
        assertThat(config.dbName()).isEqualTo("aula");
        assertThat(config.jdbcUrl()).isEqualTo("jdbc:postgresql://localhost:5432/aula");
    }

    @Test
    @DisplayName("deve usar valores informados")
    void deveUsarValoresInformados() {
        AppConfig config = new AppConfig("docker", "postgres", "5432", "curso");

        assertThat(config.ambiente()).isEqualTo("docker");
        assertThat(config.dbHost()).isEqualTo("postgres");
        assertThat(config.dbPort()).isEqualTo("5432");
        assertThat(config.dbName()).isEqualTo("curso");
        assertThat(config.jdbcUrl()).isEqualTo("jdbc:postgresql://postgres:5432/curso");
    }
}
```

Rode:

```powershell
mvn clean test
```

Empacote:

```powershell
mvn clean package
```

Execute local:

```powershell
java -jar target\aula-259-app.jar
```

---

# Parte 19 — Criando Dockerfile

Crie na raiz do projeto:

```text
Dockerfile
```

Conteúdo:

```dockerfile
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/aula-259-app.jar app.jar

ENV APP_ENV=docker
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_NAME=aula

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## Build da imagem

Rode:

```powershell
docker build -t aula-259-java-app:1.0.0 .
```

Explicando:

```text
docker build:
cria imagem.

-t:
define nome/tag.

aula-259-java-app:1.0.0:
nome da imagem.

.:
contexto do build.
```

---

## Rodar container

```powershell
docker run --name aula-259-app aula-259-java-app:1.0.0
```

Ver containers:

```powershell
docker ps -a
```

Ver logs:

```powershell
docker logs aula-259-app
```

Remover container:

```powershell
docker rm aula-259-app
```

---

# Parte 20 — Sobrescrevendo variáveis

Rode com variáveis diferentes:

```powershell
docker run --name aula-259-app ^
  -e APP_ENV=homolog ^
  -e DB_HOST=db-hml ^
  -e DB_PORT=5432 ^
  -e DB_NAME=kora ^
  aula-259-java-app:1.0.0
```

A aplicação deve imprimir os valores informados.

---

## Regra profissional

```text
Imagem deve ser a mesma.
Configuração muda por ambiente.
```

Não crie uma imagem para cada ambiente com dados fixos dentro.

Use variáveis.

---

# Parte 21 — .dockerignore

Assim como `.gitignore`, Docker tem:

```text
.dockerignore
```

Ele evita enviar arquivos desnecessários para o build context.

Crie:

```text
.dockerignore
```

Conteúdo:

```dockerignore
.git
.gitignore
target/surefire-reports
target/site
*.log
.idea
.vscode
.env
```

---

## Por que importa

Sem `.dockerignore`, o Docker pode enviar arquivos desnecessários para o build.

Isso pode:

```text
deixar build lento;
aumentar contexto;
expor arquivo sensível por acidente;
invalidar cache sem necessidade.
```

---

# Parte 22 — Dockerfile multi-stage

No Dockerfile anterior, você precisa rodar Maven antes:

```powershell
mvn clean package
docker build ...
```

Com multi-stage, o próprio Docker build compila.

Exemplo:

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /build/target/aula-259-app.jar app.jar

ENV APP_ENV=docker
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_NAME=aula

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## Explicando multi-stage

Primeiro estágio:

```text
usa Maven + JDK;
compila aplicação;
gera JAR.
```

Segundo estágio:

```text
usa apenas runtime Java;
copia JAR pronto;
roda aplicação.
```

Vantagem:

```text
imagem final menor;
não leva Maven para runtime;
separa build de execução.
```

---

## Observação sobre versões de imagem

As tags de imagem devem seguir padrão do projeto/time.

Em empresa, normalmente não se usa qualquer tag aleatória.

Pode haver:

```text
imagens aprovadas;
registry interno;
política de atualização;
scan de vulnerabilidade;
tags fixas.
```

---

# Parte 23 — Docker Compose

Docker Compose permite definir vários serviços em um arquivo.

Crie:

```text
docker-compose.yml
```

Conteúdo:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: aula-259-app
    environment:
      APP_ENV: docker-compose
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: aula
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    container_name: aula-259-postgres
    environment:
      POSTGRES_DB: aula
      POSTGRES_USER: aula
      POSTGRES_PASSWORD: aula
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

---

## Subir stack

```powershell
docker compose up --build
```

Em modo detached:

```powershell
docker compose up -d --build
```

Ver logs:

```powershell
docker compose logs
```

Logs de um serviço:

```powershell
docker compose logs app
docker compose logs postgres
```

Parar:

```powershell
docker compose down
```

Parar e remover volume:

```powershell
docker compose down -v
```

Cuidado com `-v`, pois remove dados persistidos.

---

# Parte 24 — docker compose vs docker-compose

Hoje é comum usar:

```powershell
docker compose
```

Também existe o comando legado:

```powershell
docker-compose
```

Se um não funcionar, verifique sua instalação.

Em projetos modernos, prefira o comando integrado:

```text
docker compose
```

Mas respeite o padrão do time.

---

# Parte 25 — depends_on não garante prontidão total

No Compose:

```yaml
depends_on:
  - postgres
```

Isso garante ordem de inicialização, mas não necessariamente que o PostgreSQL já está pronto para aceitar conexão.

Em aplicações reais, você pode precisar de:

```text
healthcheck;
retry na aplicação;
wait strategy;
configuração de pool;
migração controlada.
```

Em Spring Boot, conexão com banco será tratada melhor, mas ainda precisa entender esse ponto.

---

# Parte 26 — Healthcheck no Compose

Exemplo conceitual para PostgreSQL:

```yaml
postgres:
  image: postgres:16
  environment:
    POSTGRES_DB: aula
    POSTGRES_USER: aula
    POSTGRES_PASSWORD: aula
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U aula -d aula"]
    interval: 10s
    timeout: 5s
    retries: 5
```

Depois, dependendo da versão/configuração do Compose, você pode condicionar dependência.

Mas a principal ideia é:

```text
serviço iniciado não significa serviço pronto.
```

---

# Parte 27 — Logs

Logs são essenciais.

Para container:

```powershell
docker logs aula-259-app
```

Acompanhar:

```powershell
docker logs -f aula-259-app
```

Com Compose:

```powershell
docker compose logs -f
```

Serviço específico:

```powershell
docker compose logs -f postgres
```

---

## Regra profissional

Aplicação containerizada deve logar em:

```text
stdout/stderr
```

Ou seja:

```text
System.out;
logger console;
logs no output do processo.
```

Não dependa de arquivo local dentro do container como única fonte de log.

---

# Parte 28 — Entrando no container

Executar shell:

```powershell
docker exec -it aula-259-app sh
```

Ou, se imagem tiver bash:

```powershell
docker exec -it aula-259-app bash
```

Em imagens menores, pode não haver bash.

Use:

```text
sh
```

---

## Comandos úteis dentro do container

```sh
pwd
ls
env
cat arquivo
ps
```

Para sair:

```sh
exit
```

---

# Parte 29 — Inspecionar container

Use:

```powershell
docker inspect aula-259-app
```

Mostra detalhes como:

```text
variáveis;
rede;
volumes;
configuração;
imagem;
portas;
status.
```

Pode gerar muito JSON.

É útil para diagnóstico.

---

# Parte 30 — Troubleshooting básico

## 1. Docker não está rodando

Erro:

```text
Cannot connect to the Docker daemon
```

Solução:

```text
abrir Docker Desktop;
verificar serviço;
verificar permissões;
reiniciar Docker.
```

---

## 2. Porta já está em uso

Erro:

```text
port is already allocated
```

Solução:

```powershell
docker ps
```

Veja quem usa a porta.

Pare container ou mude porta.

---

## 3. Container finaliza imediatamente

Veja logs:

```powershell
docker logs nome
```

Possíveis causas:

```text
aplicação terminou normalmente;
erro de configuração;
JAR não encontrado;
comando errado;
exceção na inicialização.
```

---

## 4. JAR não encontrado

Erro:

```text
Unable to access jarfile app.jar
```

Possíveis causas:

```text
COPY errado;
mvn package não rodou;
nome do JAR diferente;
Dockerfile apontando arquivo inexistente.
```

Verifique:

```powershell
dir target
```

ou:

```bash
ls target
```

---

## 5. Aplicação não conecta no banco

Possíveis causas:

```text
usou localhost dentro do container;
banco não está na mesma rede;
serviço ainda não está pronto;
credenciais erradas;
porta errada;
nome do serviço errado;
variáveis não chegaram.
```

Diagnóstico:

```powershell
docker compose logs postgres
docker compose logs app
docker inspect aula-259-app
```

---

# Parte 31 — Boas práticas de Dockerfile para Java

Boas práticas:

```text
usar imagem base confiável;
fixar versões conforme padrão do time;
usar .dockerignore;
não copiar arquivos desnecessários;
não colocar segredo na imagem;
usar multi-stage quando fizer sentido;
rodar aplicação com JRE quando não precisa JDK;
preferir ENTRYPOINT em forma exec;
configurar via environment variables;
não depender de arquivo local fora do container;
logar em stdout/stderr;
criar imagem pequena quando possível;
não usar latest sem critério;
documentar como buildar e rodar.
```

---

# Parte 32 — O que não fazer

Evite:

```text
colocar senha real no Dockerfile;
commitar .env com segredo;
usar latest em produção sem controle;
instalar ferramentas desnecessárias na imagem final;
copiar target inteiro sem necessidade;
rodar container sem entender variáveis;
usar localhost para acessar outro container;
não olhar logs;
não usar .dockerignore;
criar imagem enorme sem necessidade.
```

---

# Parte 33 — Docker e segurança

Pontos importantes:

```text
não colocar segredo na imagem;
não commitar token;
não expor porta desnecessária;
usar imagens confiáveis;
manter imagens atualizadas conforme política;
evitar rodar como root quando política exigir usuário específico;
fazer scan de vulnerabilidade em imagens;
usar registry controlado em empresa;
não usar imagem desconhecida em produção.
```

Usuário não-root e hardening serão aprofundados mais para frente.

---

# Parte 34 — Docker e CI/CD

Pipeline pode:

```text
rodar testes;
gerar JAR;
buildar imagem;
rodar scan;
publicar imagem no registry;
fazer deploy.
```

Fluxo típico:

```text
git push;
pipeline roda mvn test;
mvn package;
docker build;
docker tag;
docker push;
deploy.
```

Exemplo conceitual:

```bash
mvn clean package
docker build -t registry/minha-api:${GIT_COMMIT} .
docker push registry/minha-api:${GIT_COMMIT}
```

---

## Tags de imagem

Boas tags:

```text
versão semântica;
hash do commit;
número do build;
ambiente controlado.
```

Exemplos:

```text
minha-api:1.0.0
minha-api:2026.07.09
minha-api:commit-a1b2c3d
```

Evite depender de:

```text
latest
```

sem política clara.

---

# Parte 35 — Docker e arquitetura Java Backend

Docker não muda arquitetura da aplicação.

Mas influencia operação.

A aplicação deve ser:

```text
configurável por ambiente;
stateless quando possível;
logs no console;
sem depender de caminho local fixo;
pronta para reiniciar;
com health check;
com shutdown adequado;
com variáveis claras;
com imagem reproduzível.
```

---

## Relação com Spring Boot

Quando chegarmos em Spring Boot, Docker será usado para:

```text
rodar API Spring;
subir PostgreSQL;
subir Redis;
subir RabbitMQ;
rodar migrations;
configurar profiles;
expor actuator health;
criar imagem com bootJar;
rodar testes com Testcontainers.
```

A base desta aula será usada diretamente.

---

# Parte 36 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é Docker.
[ ] Sei explicar container.
[ ] Sei explicar imagem.
[ ] Sei diferenciar imagem e container.
[ ] Sei explicar Dockerfile.
[ ] Sei usar docker build.
[ ] Sei usar docker run.
[ ] Sei mapear portas.
[ ] Sei configurar variáveis de ambiente.
[ ] Sei explicar volume.
[ ] Sei explicar rede Docker.
[ ] Sei explicar por que localhost muda dentro do container.
[ ] Sei criar .dockerignore.
[ ] Sei criar Dockerfile básico para Java.
[ ] Sei explicar multi-stage build.
[ ] Sei criar docker-compose.yml.
[ ] Sei subir stack com docker compose.
[ ] Sei ver logs.
[ ] Sei diagnosticar porta ocupada.
[ ] Sei diagnosticar JAR não encontrado.
[ ] Sei conectar Docker com CI/CD.
[ ] Sei conectar Docker com Spring futuro.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Docker?
2. O que é container?
3. O que é imagem?
4. Qual diferença entre imagem e container?
5. O que é Dockerfile?
6. Para que serve FROM?
7. Para que serve COPY?
8. Para que serve ENTRYPOINT?
9. EXPOSE publica porta automaticamente?
10. Como mapear porta?
11. Para que servem variáveis de ambiente?
12. O que é volume?
13. O que é rede Docker?
14. Por que localhost dentro do container não aponta para sua máquina?
15. O que é Docker Compose?
16. Para que serve depends_on?
17. depends_on garante que banco está pronto?
18. Como ver logs de container?
19. O que é multi-stage build?
20. Como Docker aparece em CI/CD?
```

---

# Parte 37 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-259-docker-java-backend
```

Com:

```text
pom.xml;
AppConfig.java;
App.java;
AppConfigTest.java;
Dockerfile;
.dockerignore;
docker-compose.yml;
RELATORIO_DOCKER.md.
```

---

## Requisitos

Você deve:

```text
rodar mvn clean test;
rodar mvn clean package;
executar java -jar localmente;
criar imagem Docker;
rodar container;
sobrescrever variáveis de ambiente;
criar docker-compose com app e postgres;
subir com docker compose up --build;
ver logs;
parar com docker compose down;
documentar comandos.
```

---

## Critérios

```text
build Maven deve passar;
JAR deve executar;
imagem deve ser criada;
container deve rodar;
logs devem mostrar variáveis;
docker-compose deve subir app e postgres;
não commitar segredo;
usar .dockerignore;
relatório deve registrar erros e soluções.
```

---

# Parte 38 — Relatório da aula

Crie:

```text
RELATORIO_DOCKER.md
```

Modelo:

```md
# Relatório Docker — Aula 259

## Comandos executados

### Maven

`mvn clean test`

`mvn clean package`

### Java local

`java -jar target/aula-259-app.jar`

### Docker build

`docker build -t aula-259-java-app:1.0.0 .`

### Docker run

### Docker Compose

`docker compose up --build`

`docker compose down`

## Imagem criada

## Containers criados

## Variáveis testadas

## Logs observados

## Erros encontrados

## Soluções aplicadas

## Diferença entre imagem e container

## Diferença entre porta interna e porta externa

## Observação sobre localhost dentro do container

## Aprendizados
```

---

# Parte 39 — Desafio extra

## Criar Compose com Adminer

Adicione um serviço para administrar PostgreSQL via navegador:

```yaml
adminer:
  image: adminer
  container_name: aula-259-adminer
  ports:
    - "8081:8080"
  depends_on:
    - postgres
```

Acesse:

```text
http://localhost:8081
```

Dados:

```text
Sistema: PostgreSQL
Servidor: postgres
Usuário: aula
Senha: aula
Banco: aula
```

Critérios:

```text
adminer deve subir;
deve conectar no postgres usando nome do serviço;
não usar localhost como servidor dentro do Adminer;
registrar no relatório.
```

---

# Parte 40 — Simulado rápido

## Questão 1

Docker é usado principalmente para:

```text
A) executar aplicações em containers reproduzíveis.
B) escrever código Java.
C) substituir testes unitários.
D) versionar código fonte.
```

---

## Questão 2

Imagem Docker é:

```text
A) molde usado para criar containers.
B) processo em execução apenas.
C) branch Git.
D) teste unitário.
```

---

## Questão 3

Container é:

```text
A) instância em execução de uma imagem.
B) arquivo pom.xml.
C) commit.
D) classe Java.
```

---

## Questão 4

Dockerfile é:

```text
A) receita para construir imagem.
B) relatório de teste.
C) arquivo de cobertura.
D) controller REST.
```

---

## Questão 5

O mapeamento `-p 8080:8080` significa:

```text
A) porta 8080 do host para porta 8080 do container.
B) duas imagens.
C) dois bancos.
D) duas branches.
```

---

## Questão 6

Dentro de um container, `localhost` normalmente aponta para:

```text
A) o próprio container.
B) sempre a máquina host.
C) sempre outro container.
D) sempre o banco.
```

---

## Questão 7

Docker Compose serve para:

```text
A) definir e subir múltiplos serviços/containers.
B) criar classe Java.
C) substituir Maven.
D) remover testes.
```

---

## Questão 8

Uma boa prática é:

```text
A) não colocar segredo real no Dockerfile.
B) commitar senha de produção.
C) usar latest sempre sem controle.
D) ignorar logs.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
7. A
8. A
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-259-docker-java-backend
git commit -m "Aula 259: docker java backend containers imagens dockerfile compose"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
Docker permite empacotar e executar aplicações Java Backend e serviços auxiliares em containers reproduzíveis, aproximando desenvolvimento, testes, build e operação.
```

Você estudou:

```text
Docker;
container;
imagem;
registry;
Dockerfile;
FROM;
WORKDIR;
COPY;
ENV;
EXPOSE;
ENTRYPOINT;
docker build;
docker run;
portas;
variáveis de ambiente;
volumes;
redes;
localhost em container;
.dockerignore;
multi-stage build;
Docker Compose;
PostgreSQL;
depends_on;
healthcheck em alto nível;
logs;
docker exec;
docker inspect;
troubleshooting;
boas práticas;
segurança;
CI/CD;
preparação para Spring Boot.
```

Na próxima aula, vamos aprofundar:

```text
Docker Compose profissional com PostgreSQL, Redis, redes, volumes, healthcheck e ambiente local de backend.
```

A ideia será montar uma stack local mais próxima de um projeto real, com banco, cache, variáveis, scripts de inicialização, troubleshooting e preparação para APIs Spring Boot.
