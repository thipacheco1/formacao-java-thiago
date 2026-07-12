# 399 - M14.44 - Dockerizando API Spring

## Apresentação da aula

Na aula 398, você separou health, liveness e readiness.

A aplicação passou a oferecer:

```text
/actuator/health/liveness;

/actuator/health/readiness;

/livez;

/readyz.
```

As decisões ficaram:

```text
liveness:
a instância precisa ser reiniciada?

readiness:
a instância pode receber tráfego?
```

Aquela aula preparou sinais operacionais que serão úteis quando a aplicação deixar de ser executada diretamente pela IDE e passar a rodar como um processo empacotado.

Até aqui, o fluxo local principal foi:

```text
código-fonte;

Maven Wrapper;

jar;

java -jar;

processo executado na máquina.
```

Esse fluxo funciona, mas depende do ambiente onde o jar é iniciado.

A máquina precisa possuir:

- Java compatível;
- configuração correta;
- diretórios;
- usuário;
- permissões;
- portas;
- comandos de startup;
- políticas de atualização.

A pergunta central desta aula será:

```text
como empacotar a API Spring
com seu runtime Java
em uma imagem reproduzível,
segura e preparada para operação?
```

A solução utilizará:

```text
Dockerfile;

build em múltiplos estágios;

Maven Wrapper;

Java 21;

Eclipse Temurin;

camadas do Spring Boot;

jarmode tools;

usuário não root;

configuração externa;

healthcheck;

volume para dados runtime;

logs em stdout e stderr.
```

O resultado será uma imagem:

```text
formacao-java-backend-api:399-local
```

Ela conterá:

```text
runtime Java 21;

Spring Boot Loader;

dependencies;

application classes;

curl para o healthcheck;

usuário app sem privilégios.
```

Ela não conterá:

- código-fonte completo no runtime;
- Maven;
- JDK completo no runtime;
- banco PostgreSQL;
- Redis;
- Mailpit;
- credentials;
- arquivo local privado;
- uploads do laboratório;
- logs;
- diretório `target`;
- cache Maven.

A imagem executará somente a API.

Essa decisão segue o princípio:

```text
um serviço principal por container.
```

PostgreSQL, Redis e Mailpit continuarão executando fora do container da API nesta aula.

Para conectar a API containerizada às dependências locais já existentes, será utilizado:

```text
host.docker.internal.
```

No Windows com Docker Desktop, esse hostname permite que o container alcance serviços publicados pelo host.

O comando também incluirá:

```text
--add-host
host.docker.internal:host-gateway
```

para manter compatibilidade com ambientes Docker que utilizam o gateway do host.

Na próxima aula, a comunicação deixará de depender do host.

A aula 400 criará:

```text
Docker Compose;

rede entre services;

API;

PostgreSQL;

Redis.
```

Por isso, esta aula não criará:

- `compose.yaml`;
- service `postgres`;
- service `redis`;
- `depends_on`;
- rede Compose;
- secrets Compose;
- migrations em service separado;
- replicas;
- Kubernetes;
- registry remoto;
- pipeline de publicação.

O foco será a imagem da API.

A baseline utilizará:

```text
eclipse-temurin:21-jdk-jammy
```

no estágio de build e:

```text
eclipse-temurin:21-jre-jammy
```

no runtime.

Essas imagens pertencem ao catálogo oficial de imagens Docker do Eclipse Temurin.

A variante Ubuntu Jammy será usada de forma explícita.

Não será utilizada a tag:

```text
latest.
```

A tag `21-jre-jammy` acompanha as atualizações da linha Java 21 e da imagem base.

Em produção de maior controle, a organização pode fixar também o digest da imagem.

Nesta aula, a fixação ficará em:

```text
Java 21;

tipo JDK ou JRE;

distribuição Jammy.
```

O jar executável do Spring Boot será extraído em camadas:

```text
dependencies;

spring-boot-loader;

snapshot-dependencies;

application.
```

Motivo:

```text
dependencies mudam menos;

código da aplicação muda mais;

Docker pode reutilizar
as camadas estáveis.
```

Uma mudança somente em uma classe da aplicação não precisa reconstruir conceitualmente a camada com todas as dependências.

O container será executado pelo usuário:

```text
app
```

com UID e GID:

```text
10001.
```

O processo Java não será root.

O healthcheck do Docker consultará:

```text
http://127.0.0.1:8081/livez
```

Ele utilizará liveness, não readiness.

Motivo:

```text
Docker health representa
se o processo está funcional;

readiness pode ficar temporariamente 503
sem justificar que o container esteja quebrado.
```

O healthcheck não chamará PostgreSQL, Redis ou SMTP diretamente.

Ele consumirá o sinal definido na aula 398.

O projeto continua em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
400 - M14.45 - Compose API PostgreSQL Redis
```

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
395:
Testes de integração Spring com Testcontainers.

396:
Testes de contrato introdução.

397:
Observabilidade inicial com Actuator.

398:
Health readiness/liveness.

399:
Dockerizando API Spring.

400:
Compose API PostgreSQL Redis.

401:
Coleção Postman/Insomnia profissional.
```

A aula 398 respondeu:

```text
quando reiniciar
e quando retirar do tráfego?
```

A aula 399 responderá:

```text
como transformar a API
em uma imagem executável
independente do Java instalado no host?
```

Nesta aula:

```text
Dockerfile:
sim.

multi-stage build:
sim.

Maven Wrapper:
sim.

Java 21:
sim.

runtime JRE:
sim.

Spring Boot layers:
sim.

usuário não root:
sim.

healthcheck:
sim.

configuração externa:
sim.

volume de upload:
sim.

Compose:
não.

PostgreSQL na imagem:
não.

Redis na imagem:
não.

Mailpit na imagem:
não.

registry:
não.

Kubernetes:
não.
```

A regra central será:

```text
imagem contém aplicação e runtime;

configuração e dados variáveis
ficam fora da imagem;

cada container possui
uma responsabilidade principal.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
Dockerfile;

.dockerignore;

.docker/
├── api.local.env
└── api.local.env.example
```

O arquivo real:

```text
.docker/api.local.env
```

ficará ignorado pelo Git.

A imagem será construída com:

```powershell
docker build `
  --build-arg APP_VERSION="399-local" `
  --tag "formacao-java-backend-api:399-local" `
  .
```

O container será iniciado com:

```text
configuração por env file;

porta 8081 publicada;

porta 8082 publicada somente no loopback;

volume de uploads;

usuário não root;

healthcheck.
```

Você irá:

1. validar o jar;
2. criar `.dockerignore`;
3. criar um Dockerfile multi-stage;
4. usar o Maven Wrapper no build;
5. extrair camadas do Spring Boot;
6. criar runtime somente com JRE;
7. instalar somente a ferramenta do healthcheck;
8. criar usuário não root;
9. configurar diretório persistente;
10. adicionar labels;
11. declarar portas;
12. criar healthcheck;
13. preparar env file local ignorado;
14. construir a imagem;
15. inspecionar imagem e usuário;
16. iniciar o container;
17. testar health, readiness e API;
18. testar persistência do volume;
19. encerrar graciosamente;
20. commitar.

Estrutura esperada na raiz do projeto:

```text
formacao-java-backend-api
├── .docker
│   ├── api.local.env
│   └── api.local.env.example
├── .dockerignore
├── Dockerfile
├── pom.xml
├── mvnw
├── .mvn
└── src
```

Não serão criados scripts numerados ou documentação paralela extensa.

---

## Conceito essencial

### O que é uma imagem

Imagem é um artefato imutável composto por camadas.

Ela contém:

- filesystem;
- metadata;
- comando de startup;
- usuário;
- environment defaults;
- healthcheck;
- portas documentadas.

A imagem não é um processo em execução.

Ela é o modelo usado para criar containers.

---

### O que é um container

Container é uma instância em execução de uma imagem.

Ele possui:

- processo principal;
- filesystem gravável próprio;
- network namespace;
- environment;
- mounts;
- limites;
- estado de execução.

Vários containers podem nascer da mesma imagem.

Exemplo:

```text
mesma imagem;

configuração diferente;

instâncias diferentes.
```

---

### Dockerfile

Dockerfile é uma receita declarativa para construir a imagem.

Instruções utilizadas:

```text
FROM;

ARG;

WORKDIR;

COPY;

RUN;

ENV;

LABEL;

USER;

EXPOSE;

HEALTHCHECK;

ENTRYPOINT.
```

Cada instrução relevante pode produzir metadata ou uma camada.

A ordem influencia cache e tamanho.

---

### Multi-stage build

Um build em múltiplos estágios utiliza mais de um `FROM`.

Baseline:

```text
build:
JDK e Maven Wrapper.

extract:
JRE e extração das camadas.

runtime:
somente o necessário para executar.
```

O runtime não recebe:

- Maven;
- repositório `.m2`;
- fontes;
- JDK;
- arquivos temporários do build.

Isso reduz superfície e tamanho.

---

### Spring Boot layered jar

Um jar executável tradicional reúne:

```text
loader;

dependencies;

classes;

resources.
```

Copiar o jar inteiro em uma camada funciona, mas uma pequena mudança de código altera o arquivo inteiro.

Spring Boot adiciona um índice de camadas ao jar.

O modo:

```text
-Djarmode=tools
```

permite extrair essas camadas.

Comando:

```text
extract --layers --destination extracted.
```

O runtime copia cada grupo em uma instrução própria.

---

### Camadas padrão

`dependencies`:

```text
dependências release.
```

`spring-boot-loader`:

```text
loader do jar executável.
```

`snapshot-dependencies`:

```text
dependências SNAPSHOT.
```

`application`:

```text
classes e recursos do projeto.
```

A ordem coloca conteúdo menos mutável antes do código da aplicação.

---

### Cache de build

O Docker reaproveita uma etapa quando:

- instrução não mudou;
- arquivos usados pela instrução não mudaram;
- cache está disponível.

O Dockerfile copiará primeiro:

```text
.mvn;

mvnw;

pom.xml.
```

Depois fará download de dependencies.

Somente depois copiará:

```text
src.
```

Assim, uma alteração de código não invalida automaticamente a etapa de resolução do `pom.xml`.

O build também utilizará um cache mount para:

```text
/root/.m2.
```

Esse cache acelera builds locais e não entra na imagem final.

---

### Testes e build da imagem

A baseline separa:

```text
quality gate;

image assembly.
```

Antes do Docker build:

```powershell
.\mvnw.cmd clean verify
```

Durante o Docker build:

```text
-DskipTests package.
```

Motivo:

```text
os testes já foram executados fora;

alguns testes de integração precisam do Docker;

executar Docker dentro do build
não pertence a esta baseline.
```

O pipeline futuro deve manter o quality gate antes da publicação.

Não use `-DskipTests` como substituto permanente dos testes.

---

### .dockerignore

O contexto de build é enviado ao Docker.

Sem `.dockerignore`, ele pode incluir:

- `.git`;
- `target`;
- uploads;
- credentials locais;
- caches;
- IDE;
- logs.

Mesmo quando o Dockerfile não usa `COPY . .`, reduzir o contexto evita vazamento e trabalho desnecessário.

---

### Credentials não entram na imagem

Nunca use:

```dockerfile
ENV LOCAL_DB_PASSWORD=senha
```

Também não use:

```dockerfile
ARG DB_PASSWORD
```

Build args podem aparecer em histórico e cache.

A imagem precisa ser reutilizável em ambientes diferentes.

Secrets são fornecidos no runtime.

---

### Environment no runtime

O Spring já usa configuração externalizada.

Exemplo:

```text
SPRING_PROFILES_ACTIVE;

LOCAL_DB_URL;

LOCAL_DB_USERNAME;

LOCAL_DB_PASSWORD;

REDIS_HOST;

MAIL_HOST;

APP_VERSION.
```

O mesmo artefato de imagem pode rodar com valores diferentes.

O Dockerfile não conhece a senha.

---

### Env file local

O laboratório usará:

```text
.docker/api.local.env.
```

Esse arquivo contém valores locais e será ignorado pelo Git.

Ele é adequado para o laboratório, mas não é um secret manager.

Em produção, prefira mecanismos da plataforma:

- Docker secrets;
- Kubernetes Secrets;
- secret store;
- arquivo montado;
- config tree;
- credenciais temporárias.

---

### host.docker.internal

Dentro do container:

```text
localhost
```

aponta para o próprio container.

Não aponta para o Windows host.

Por isso, uma URL:

```text
jdbc:postgresql://localhost:5432/formacao_java
```

tentaria encontrar PostgreSQL dentro do container da API.

Nesta aula, a URL utilizará:

```text
host.docker.internal.
```

A aula 400 substituirá isso por nomes de services na rede Compose.

---

### Um processo principal

O container da API inicia:

```text
java.
```

PostgreSQL, Redis e Mailpit não serão iniciados por shell script dentro dele.

Separar processos permite:

- lifecycle independente;
- logs independentes;
- atualização independente;
- health independente;
- limites independentes.

---

### Usuário não root

Imagens normalmente executam como root se `USER` não for definido.

A baseline cria:

```text
group app:
GID 10001.

user app:
UID 10001.
```

Depois:

```dockerfile
USER app:app
```

O Java não precisa de root para abrir as portas 8081 e 8082.

Portas acima de 1024 podem ser usadas por usuário comum.

---

### Diretórios graváveis

A aplicação precisa escrever uploads em:

```text
/var/lib/formacao/uploads.
```

O diretório será criado e terá ownership do usuário `app`.

Ele será montado como volume no runtime.

O restante da aplicação não precisa ser gravável.

O jar e suas layers permanecem em:

```text
/application.
```

---

### EXPOSE

O Dockerfile declarará:

```text
8081;
8082.
```

`EXPOSE` documenta as portas esperadas.

Ele não publica a porta no host.

A publicação acontece com:

```text
--publish.
```

---

### ENTRYPOINT em formato exec

Use:

```dockerfile
ENTRYPOINT ["java", "-jar", "application.jar"]
```

Não use:

```dockerfile
ENTRYPOINT java -jar application.jar
```

O formato exec evita uma shell intermediária e melhora o encaminhamento de signals ao processo Java.

O Java será o PID principal do container.

---

### SIGTERM e graceful shutdown

Ao executar:

```powershell
docker stop
```

o Docker envia `SIGTERM`.

Spring Boot inicia o shutdown gracioso conforme a configuração da aplicação.

Depois do timeout do Docker, um encerramento forçado pode ocorrer.

A baseline observará os logs de readiness mudando para recusar tráfego antes do encerramento.

---

### JAVA_TOOL_OPTIONS

O runtime definirá:

```text
-XX:MaxRAMPercentage=75.0;

-XX:+ExitOnOutOfMemoryError.
```

`MaxRAMPercentage` limita a heap como percentual da memória visível ao container.

O valor não é universal.

Ele deixa margem para:

- metaspace;
- stacks;
- buffers;
- native memory;
- bibliotecas;
- overhead da JVM.

`ExitOnOutOfMemoryError` encerra o processo quando ocorre OOM em vez de manter uma instância potencialmente corrompida.

A política deve ser revisada com métricas reais.

---

### Healthcheck

O Dockerfile incluirá:

```text
curl;
HEALTHCHECK;
```

A URL será:

```text
/livez.
```

Configuração:

```text
interval:
30 segundos.

timeout:
3 segundos.

start period:
60 segundos.

retries:
3.
```

Estados Docker:

```text
starting;

healthy;

unhealthy.
```

O healthcheck não reinicia automaticamente um container iniciado apenas por `docker run`.

Ele fornece estado.

Uma política de restart ou orquestrador decide a ação.

---

### Liveness versus readiness no Dockerfile

A baseline usa liveness no `HEALTHCHECK`.

Readiness pode ficar 503 durante:

- startup;
- drenagem;
- manutenção;
- indisponibilidade temporária.

Marcar o container como unhealthy por qualquer recusa de tráfego pode misturar decisões.

No Compose, readiness poderá participar do controle de dependências conforme a necessidade, mas não será implementada agora.

---

## Mão na massa guiada

### 1. Validar o projeto antes da imagem

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute o quality gate:

```powershell
.\mvnw.cmd clean verify
```

Se a integração da aula 395 estiver incluída no comando oficial do projeto, mantenha o Docker ativo.

A imagem não deve ser construída a partir de código quebrado.

---

### 2. Confirmar o jar executável

Execute:

```powershell
Get-ChildItem `
  ".\target" `
  -Filter "*.jar"
```

Confirme o jar principal.

Teste localmente:

```powershell
java `
  -Djarmode=tools `
  -jar `
  (Get-ChildItem `
      ".\target" `
      -Filter "*.jar" |
    Select-Object -First 1
  ).FullName `
  list-layers
```

Resultado esperado inclui:

```text
dependencies;

spring-boot-loader;

snapshot-dependencies;

application.
```

Não inicie a aplicação nesse comando.

---

### 3. Tornar o probe comum aos profiles de container

Mova para `application.yaml` somente o contrato comum:

```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
        add-additional-paths: true
```

Mantenha porta, endereço, exposição e detalhes nos profiles de ambiente. Assim, `/livez` existe em qualquer profile usado pela imagem, sem publicar Actuator além do necessário.

### 4. Criar .dockerignore

Arquivo:

```text
.dockerignore
```

Conteúdo:

```text
.git
.github
.idea
.vscode

target
var
samples

config/application-local-private.yaml
.docker/*.env

*.log
*.tmp
*.swp

README.local.md
```

Não ignore:

- `pom.xml`;
- `mvnw`;
- `.mvn`;
- `src`;
- `Dockerfile`.

O arquivo `api.local.env.example` não corresponde a `*.env` porque termina em `.example`.

---

### 5. Atualizar .gitignore

Adicione:

```text
.docker/*.env
```

Mantenha versionado:

```text
.docker/api.local.env.example.
```

O arquivo real não pode aparecer em:

```powershell
git status
```

---

### 6. Criar o Dockerfile

Arquivo:

```text
Dockerfile
```

Conteúdo:

```dockerfile
# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      --no-transfer-progress \
      -DskipTests \
      dependency:go-offline

COPY src/ src/

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      --no-transfer-progress \
      -DskipTests \
      package \
    && cp target/*.jar application.jar


FROM eclipse-temurin:21-jre-jammy AS extract

WORKDIR /builder

COPY --from=build \
    /workspace/application.jar \
    application.jar

RUN java \
      -Djarmode=tools \
      -jar application.jar \
      extract \
      --layers \
      --destination extracted


FROM eclipse-temurin:21-jre-jammy AS runtime

ARG APP_VERSION=dev
ARG APP_UID=10001
ARG APP_GID=10001

LABEL org.opencontainers.image.title="formacao-java-backend-api"
LABEL org.opencontainers.image.description="API da formacao Java Backend"
LABEL org.opencontainers.image.version="${APP_VERSION}"

RUN apt-get update \
    && apt-get install \
         --yes \
         --no-install-recommends \
         curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd \
         --gid "${APP_GID}" \
         app \
    && useradd \
         --uid "${APP_UID}" \
         --gid app \
         --create-home \
         --home-dir /home/app \
         --shell /usr/sbin/nologin \
         app

WORKDIR /application

RUN mkdir -p \
      /var/lib/formacao/uploads \
    && chown -R \
      app:app \
      /application \
      /var/lib/formacao

COPY --from=extract \
    --chown=app:app \
    /builder/extracted/dependencies/ \
    ./

COPY --from=extract \
    --chown=app:app \
    /builder/extracted/spring-boot-loader/ \
    ./

COPY --from=extract \
    --chown=app:app \
    /builder/extracted/snapshot-dependencies/ \
    ./

COPY --from=extract \
    --chown=app:app \
    /builder/extracted/application/ \
    ./

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

USER app:app

EXPOSE 8081
EXPOSE 8082

HEALTHCHECK \
  --interval=30s \
  --timeout=3s \
  --start-period=60s \
  --retries=3 \
  CMD curl \
        --fail \
        --silent \
        --show-error \
        http://127.0.0.1:8081/livez \
      || exit 1

ENTRYPOINT ["java", "-jar", "application.jar"]
```

O Dockerfile não contém credentials.

---

### 7. Criar o exemplo de env file

Crie o diretório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  ".docker" |
  Out-Null
```

Arquivo:

```text
.docker/api.local.env.example
```

Conteúdo:

```text
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8081

MANAGEMENT_PORT=8082
MANAGEMENT_ADDRESS=0.0.0.0

LOCAL_DB_URL=jdbc:postgresql://host.docker.internal:5432/formacao_java
# LOCAL_DB_USERNAME e LOCAL_DB_PASSWORD existem somente no arquivo real ignorado.

REDIS_HOST=host.docker.internal
REDIS_PORT=6379

MAIL_HOST=host.docker.internal
MAIL_PORT=1025

FILE_STORAGE_ROOT=/var/lib/formacao/uploads

APP_VERSION=399-container
AVAILABILITY_LAB_FORCED_STATE=NONE
```

O example informa os valores não sensíveis e registra que usuário e senha pertencem somente ao arquivo real ignorado. Ele não contém credentials.

---

### 8. Gerar o env file real

Não copie uma senha para o histórico do terminal.

Use entrada interativa:

```powershell
$dbUrl = Read-Host `
  "JDBC URL vista pelo container"

$dbUsername = Read-Host `
  "Usuario local do PostgreSQL"

$securePassword = Read-Host `
  "Senha local do PostgreSQL" `
  -AsSecureString

$plainPassword =
  [System.Net.NetworkCredential]::new(
      "",
      $securePassword
  ).Password

$envContent = @"
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8081
MANAGEMENT_PORT=8082
MANAGEMENT_ADDRESS=0.0.0.0
LOCAL_DB_URL=$dbUrl
LOCAL_DB_USERNAME=$dbUsername
LOCAL_DB_PASSWORD=$plainPassword
REDIS_HOST=host.docker.internal
REDIS_PORT=6379
MAIL_HOST=host.docker.internal
MAIL_PORT=1025
FILE_STORAGE_ROOT=/var/lib/formacao/uploads
APP_VERSION=399-container
AVAILABILITY_LAB_FORCED_STATE=NONE
"@

$utf8NoBom =
  New-Object `
    System.Text.UTF8Encoding($false)

[System.IO.File]::WriteAllText(
    (Join-Path `
      (Get-Location) `
      ".docker/api.local.env"),
    $envContent,
    $utf8NoBom
)

$plainPassword = $null
$securePassword = $null
```

Para a URL, utilize a mesma database e porta do laboratório, trocando o host local por:

```text
host.docker.internal.
```

Exemplo:

```text
jdbc:postgresql://host.docker.internal:5432/formacao_java.
```

---

### 9. Construir a imagem

Execute:

```powershell
docker build `
  --build-arg APP_VERSION="399-local" `
  --tag "formacao-java-backend-api:399-local" `
  .
```

O primeiro build baixa imagens e dependencies.

Builds seguintes podem reutilizar:

- cache Maven;
- estágio de dependencies;
- layers do Spring Boot;
- base image local.

---

### 10. Inspecionar a imagem

Liste:

```powershell
docker image ls `
  "formacao-java-backend-api"
```

Inspecione labels:

```powershell
docker image inspect `
  "formacao-java-backend-api:399-local" `
  --format `
  '{{json .Config.Labels}}'
```

Confirme a versão:

```text
399-local.
```

---

### 11. Confirmar Java do runtime

```powershell
docker run `
  --rm `
  --entrypoint java `
  "formacao-java-backend-api:399-local" `
  -version
```

Resultado esperado:

```text
Java 21;
Eclipse Temurin.
```

O comando não inicia Spring.

---

### 12. Confirmar usuário não root

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java-backend-api:399-local"
```

Resultado esperado inclui:

```text
uid=10001(app);

gid=10001(app).
```

Não deve retornar:

```text
uid=0(root).
```

---

### 13. Criar o volume de uploads

```powershell
docker volume create `
  "formacao-java-uploads"
```

Inspecione:

```powershell
docker volume inspect `
  "formacao-java-uploads"
```

O volume será montado em:

```text
/var/lib/formacao/uploads.
```

---

### 14. Iniciar o container

Remova uma instância antiga:

```powershell
docker rm -f `
  "formacao-java-api" `
  2>$null
```

Inicie:

```powershell
docker run `
  --name "formacao-java-api" `
  --detach `
  --env-file ".docker/api.local.env" `
  --add-host `
    "host.docker.internal:host-gateway" `
  --publish "8081:8081" `
  --publish "127.0.0.1:8082:8082" `
  --mount `
    "type=volume,source=formacao-java-uploads,target=/var/lib/formacao/uploads" `
  "formacao-java-backend-api:399-local"
```

A porta 8081 fica publicada.

A porta 8082 fica acessível somente pelo loopback do host.

Dentro do container, management usa:

```text
0.0.0.0
```

para aceitar o tráfego encaminhado pela publicação Docker.

---

### 15. Acompanhar logs

```powershell
docker logs `
  --follow `
  "formacao-java-api"
```

Procure:

```text
Java 21;

profiles ativos;

Flyway;

application started;

management port;

availability CORRECT;

readiness ACCEPTING_TRAFFIC.
```

Interrompa apenas o acompanhamento com:

```text
Ctrl + C.
```

O container continua ativo.

---

### 16. Verificar status do container

```powershell
docker ps `
  --filter "name=formacao-java-api"
```

A coluna status deve evoluir:

```text
health: starting;

healthy.
```

Inspecione:

```powershell
docker inspect `
  "formacao-java-api" `
  --format `
  '{{json .State.Health}}'
```

A URL do healthcheck não aparece na response pública da aplicação.

Ela faz parte da configuração da imagem.

---

### 17. Consultar liveness e readiness

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"
```

Resultado esperado:

```text
200;
200.
```

Consulte management:

```powershell
Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

A porta foi publicada apenas no loopback.

---

### 18. Testar a API de negócio

Execute uma leitura válida:

```powershell
Invoke-WebRequest `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages" `
  -Headers @{
    "X-Client-Id" =
      "docker-aula-399"
  } `
  -SkipHttpErrorCheck
```

Ajuste parâmetros conforme o contrato atual.

Se a request falhar por conexão com banco ou Redis, revise o env file e `host.docker.internal`.

Não altere o Dockerfile para inserir hosts locais fixos.

---

### 19. Testar upload persistente

Faça upload com o endpoint da aula 390:

```powershell
$upload = curl.exe `
  --silent `
  --request POST `
  --form `
    "file=@.\samples\aula-390.txt;type=text/plain" `
  "http://localhost:8081/api/v2/runtime/files" |
  ConvertFrom-Json
```

Confirme:

```text
201 ou response de sucesso do endpoint;

ID gerado.
```

Inspecione o volume:

```powershell
docker run `
  --rm `
  --mount `
    "type=volume,source=formacao-java-uploads,target=/data" `
  --entrypoint sh `
  "eclipse-temurin:21-jre-jammy" `
  -c "ls -la /data"
```

Os arquivos pertencem ao UID usado pela aplicação.

---

### 20. Recriar o container sem perder upload

Remova:

```powershell
docker rm -f `
  "formacao-java-api"
```

Inicie novamente com o mesmo comando e o mesmo volume.

Baixe o arquivo pelo ID anterior.

Resultado esperado:

```text
arquivo continua disponível.
```

O volume possui lifecycle independente do container.

A imagem não contém o upload.

---

### 21. Testar configuração inválida

Pare e remova:

```powershell
docker rm -f `
  "formacao-java-api"
```

Crie uma cópia temporária do env file sem `LOCAL_DB_PASSWORD` ou com URL inválida.

Inicie utilizando a cópia.

Resultado esperado:

```text
startup falha;

container encerra;

logs explicam a property ou conexão inválida;

nenhuma imagem nova é necessária.
```

Remova a cópia temporária.

A configuração é runtime.

---

### 22. Observar shutdown gracioso

Inicie o container normal.

Em um terminal:

```powershell
docker logs `
  --follow `
  "formacao-java-api"
```

Em outro:

```powershell
docker stop `
  --time 20 `
  "formacao-java-api"
```

Observe:

```text
readiness REFUSING_TRAFFIC;

shutdown;

processo finalizado.
```

O `ENTRYPOINT` exec permite que o Java receba o signal diretamente.

---

## Entendendo o que foi feito

### O build ficou reproduzível

O Dockerfile declara runtime, comandos e estrutura.

### O runtime ficou menor que o builder

Maven, fontes e JDK não chegam à imagem final.

### As camadas Spring Boot ficaram separadas

Dependências e código da aplicação possuem ritmos de mudança diferentes.

### O processo deixou de ser root

A API usa UID e GID conhecidos.

### Configuração permaneceu externa

A imagem não conhece senha, URL local ou profile fixo.

### Dados runtime ficaram fora da imagem

Uploads permanecem em volume.

### Healthcheck reutilizou liveness

A imagem não inventou um segundo conceito de saúde.

### Signals chegaram ao Java

ENTRYPOINT exec permitiu shutdown gracioso.

### A responsabilidade ficou isolada

A imagem contém somente a API.

---

## Erros comuns importantes

### Copiar o repositório inteiro

Pode levar credentials, target, Git e uploads ao contexto ou à imagem.

### Usar latest

O build pode mudar sem alteração no repositório.

### Executar Maven no runtime

Ferramentas de build não são necessárias para servir a API.

### Rodar como root

Uma vulnerabilidade ganha privilégios maiores dentro do container.

### Colocar senha no Dockerfile

Ela pode aparecer em layers, cache e histórico.

### Usar localhost para banco

Dentro do container, localhost é o próprio container.

### Publicar management em todas as interfaces do host

A porta operacional pode ficar exposta na rede.

### Usar readiness no HEALTHCHECK sem decisão

Uma recusa temporária de tráfego pode marcar o container como quebrado.

### Gravar uploads na camada gravável do container

Ao recriar o container, os arquivos desaparecem.

### Executar PostgreSQL no mesmo container

Mistura lifecycle, logs, health e atualização.

---

## Comandos úteis

### Quality gate

```powershell
.\mvnw.cmd clean verify
```

### Build

```powershell
docker build `
  --build-arg APP_VERSION="399-local" `
  --tag "formacao-java-backend-api:399-local" `
  .
```

### Ver imagens

```powershell
docker image ls `
  "formacao-java-backend-api"
```

### Confirmar usuário

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java-backend-api:399-local"
```

### Iniciar

```powershell
docker run `
  --name "formacao-java-api" `
  --detach `
  --env-file ".docker/api.local.env" `
  --add-host "host.docker.internal:host-gateway" `
  --publish "8081:8081" `
  --publish "127.0.0.1:8082:8082" `
  --mount "type=volume,source=formacao-java-uploads,target=/var/lib/formacao/uploads" `
  "formacao-java-backend-api:399-local"
```

### Health

```powershell
docker inspect `
  "formacao-java-api" `
  --format '{{json .State.Health}}'
```

### Parar

```powershell
docker stop `
  --time 20 `
  "formacao-java-api"
```

---

## Exercício guiado

### Parte 1 — Build limpo

Execute quality gate e construa a imagem.

### Parte 2 — Runtime

Confirme:

```text
Java 21;

usuário 10001;

Maven ausente;

source ausente.
```

### Parte 3 — Health

Inicie e aguarde `healthy`.

Confirme `/livez` e `/readyz`.

### Parte 4 — Configuração externa

Altere somente `APP_VERSION` no env file.

Recrie o container sem reconstruir a imagem.

Confirme novo valor no info.

### Parte 5 — Volume

Faça upload, recrie o container e faça download.

### Parte 6 — Falha de configuração

Use env file incompleto e confirme fail-fast.

### Parte 7 — Shutdown

Execute `docker stop --time 20`.

Observe readiness e encerramento.

### Parte 8 — Registrar a decisão

Anote:

```text
Dockerfile multi-stage;

builder com Java 21 JDK;

runtime com Java 21 JRE;

Eclipse Temurin Jammy;

Maven Wrapper;

BuildKit cache para .m2;

jarmode tools;

Spring Boot layers;

usuário app 10001;

sem root;

EXPOSE 8081 e 8082;

healthcheck em /livez;

ENTRYPOINT exec;

JAVA_TOOL_OPTIONS;

env file local ignorado;

host.docker.internal nesta aula;

volume de uploads;

um serviço por container;

sem Compose;

sem Kubernetes.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 398 foi preservada;
- Dockerfile e `.dockerignore` foram criados;
- env file real está ignorado e o example não possui credentials;
- quality gate foi executado antes do build;
- Maven Wrapper foi usado;
- build multi-stage separa compilação, extração e runtime;
- builder usa Java 21 JDK;
- runtime usa Java 21 JRE;
- Eclipse Temurin Jammy foi usado sem tag `latest`;
- cache Maven e ordem de cópia favorecem rebuilds;
- testes não são executados novamente dentro da montagem da imagem;
- jar executável foi extraído com `jarmode=tools`;
- dependencies, loader, snapshots e application formam camadas separadas;
- Maven, source e JDK completo não chegam ao runtime;
- curl existe somente para o healthcheck;
- caches do gerenciador de pacotes foram removidos;
- processo Java executa como usuário `app`, UID/GID 10001;
- diretório de upload possui ownership correto;
- credentials não aparecem em `ARG`, `ENV`, layers ou Git;
- `JAVA_TOOL_OPTIONS` foi configurado e explicado;
- portas 8081 e 8082 foram declaradas;
- `EXPOSE` foi diferenciado de publicação;
- healthcheck utiliza `/livez`, com start period, timeout e retries;
- ENTRYPOINT usa formato exec e recebe signals diretamente;
- env file local foi gerado de forma interativa;
- `localhost` dentro do container foi diferenciado do host;
- `host.docker.internal` foi usado apenas como ponte desta aula;
- management foi publicado somente no loopback do host;
- volume preserva uploads fora do filesystem efêmero;
- imagem, labels, Java e usuário foram inspecionados;
- container alcançou estado `healthy`;
- liveness, readiness, Actuator e API foram testados;
- upload permaneceu após recriar o container;
- configuração inválida provocou fail-fast;
- shutdown gracioso foi observado;
- PostgreSQL, Redis e Mailpit não foram incluídos na imagem;
- Docker Compose, registry e Kubernetes não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 400 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Confirme que não aparece:

```text
.docker/api.local.env.
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "build(m14): dockerizar API Spring"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `.docker/api.local.env`;
- credentials;
- `target`;
- uploads;
- volumes;
- image tar;
- logs;
- dumps;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API deixou de depender do Java instalado na máquina de execução.

O fluxo ficou:

```text
source;

Maven Wrapper;

builder JDK;

jar Spring Boot;

jarmode tools;

layers;

runtime JRE;

usuário não root;

container;

healthcheck;

volume;

configuração externa.
```

Você comprovou:

```text
imagem reproduzível;

Java 21 no runtime;

Maven fora do runtime;

source fora do runtime;

usuário 10001;

healthcheck liveness;

management protegido no host;

volume persistente;

shutdown gracioso;

fail-fast de configuração.
```

A decisão central foi:

```text
imagem é artefato imutável;

configuração entra no runtime;

dados variáveis ficam em mounts;

o processo executa sem root;

a imagem contém somente a API.
```

A próxima aula será:

```text
400 - M14.45 - Compose API PostgreSQL Redis
```

Nela, você deixará de depender de `host.docker.internal` para banco e Redis.

A rede será declarada em Compose e os services se encontrarão por nomes:

```text
api;

postgres;

redis.
```

Também serão estudados:

- healthchecks de dependências;
- ordem de startup;
- volumes;
- environment;
- portas;
- restart;
- logs;
- operação do conjunto.

Mailpit poderá permanecer como apoio do laboratório conforme o escopo definido na aula, mas o título oficial da próxima etapa prioriza API, PostgreSQL e Redis.

Nada disso foi implementado antecipadamente aqui.

---

# Material complementar

## Checkpoint final

- [ ] Criei Dockerfile multi-stage.
- [ ] Extraí as camadas do Spring Boot.
- [ ] Executei como usuário não root.
- [ ] Configurei healthcheck e volume.
- [ ] Iniciei a API com configuração externa.

---

## Troubleshooting adicional

### Maven Wrapper não executa no build

Confirme:

- `.mvn` no contexto;
- `mvnw` copiado;
- `chmod +x`;
- `.dockerignore` não exclui os arquivos;
- acesso à internet no primeiro build.

### Jarmode não reconhece tools

Confirme:

- jar repackaged pelo Spring Boot;
- plugin configurado;
- jar principal correto;
- Spring Boot atual;
- comando `list-layers` local.

### COPY target/*.jar encontra mais de um arquivo

Revise os artefatos do Maven.

Ajuste a cópia no estágio de build para selecionar o jar executável oficial.

Não escolha por ordem aleatória.

### Container inicia e encerra

Leia:

```powershell
docker logs formacao-java-api
```

Procure:

- property obrigatória;
- conexão;
- profile;
- migration;
- porta.

### Banco não conecta

Dentro do container, não use localhost.

Revise:

```text
LOCAL_DB_URL;

host.docker.internal;

porta publicada no host;

credentials.
```

### Redis não conecta

Revise:

```text
REDIS_HOST=host.docker.internal;

porta 6379 publicada;

container Redis ativo.
```

### Management não responde no host

Confirme:

```text
MANAGEMENT_ADDRESS=0.0.0.0 dentro do container;

publish 127.0.0.1:8082:8082;

profile observability-local.
```

### Container fica unhealthy durante startup

Revise:

- logs;
- start period;
- `/livez`;
- porta 8081;
- application startup.

Não aumente o start period para esconder uma falha permanente.

### Upload retorna permission denied

Confirme:

- volume montado;
- path `/var/lib/formacao/uploads`;
- usuário 10001;
- ownership criado na imagem;
- volume sem arquivos incompatíveis.

### docker stop termina à força

Revise:

- ENTRYPOINT exec;
- timeout;
- logs de shutdown;
- tarefas agendadas;
- requests longas.

---

## Observações para evolução

Uma imagem de produção pode avançar para:

- digest fixo da base;
- SBOM;
- assinatura;
- scan de vulnerabilidade;
- provenance;
- registry privado;
- política de atualização;
- runtime customizado com `jlink`;
- filesystem read-only;
- seccomp;
- capabilities reduzidas;
- limites de CPU e memória;
- build multi-architecture;
- Cloud Native Buildpacks;
- CDS e AOT cache.

Spring Boot também pode criar imagens OCI com Cloud Native Buildpacks por meio do Maven Plugin.

Buildpacks constroem e executam como usuários não root e oferecem uma alternativa ao Dockerfile manual.

Nesta aula, o Dockerfile foi escolhido para tornar explícitas as decisões de:

- stages;
- layers;
- usuário;
- healthcheck;
- diretórios;
- entrypoint.

Não implemente todas as opções de hardening ao mesmo tempo sem medir compatibilidade.

---

## Perguntas de revisão

1. O que é uma imagem?
2. O que é um container?
3. Por que usar multi-stage?
4. Qual imagem compila?
5. Qual imagem executa?
6. Por que usar JRE no runtime?
7. O que jarmode tools faz?
8. Quais são as quatro layers?
9. Para que serve `.dockerignore`?
10. Credentials entram na imagem?
11. Qual usuário executa Java?
12. Qual é o UID?
13. O que `EXPOSE` faz?
14. Ele publica a porta?
15. Qual endpoint o healthcheck usa?
16. Por que não usar readiness?
17. Para que serve o volume?
18. Por que localhost não aponta para o host?
19. Compose foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Artefato imutável em camadas.
2. Instância em execução da imagem.
3. Separar build e runtime.
4. `eclipse-temurin:21-jdk-jammy`.
5. `eclipse-temurin:21-jre-jammy`.
6. Ferramentas de compilação não são necessárias.
7. Extrai o jar em camadas.
8. Dependencies, loader, snapshots e application.
9. Reduzir e proteger o contexto.
10. Não.
11. `app`.
12. 10001.
13. Documenta portas.
14. Não.
15. `/livez`.
16. Recusa temporária não significa processo quebrado.
17. Persistir uploads fora do container.
18. Localhost é o próprio container.
19. Não.
20. Compose API PostgreSQL Redis.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 399 - M14.44 - Dockerizando API Spring

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei imagem, container e máquina virtual.
- Criei um `Dockerfile`.
- Criei `.dockerignore`.
- Ignorei o env file real.
- Mantive um example sem credentials.
- Executei o quality gate antes do build.
- Usei build em múltiplos estágios.
- Usei `eclipse-temurin:21-jdk-jammy` no build.
- Usei `eclipse-temurin:21-jre-jammy` no runtime.
- Não usei `latest`.
- Usei o Maven Wrapper.
- Usei cache BuildKit para `.m2`.
- Copiei `pom.xml` antes do source.
- Empacotei com testes já validados fora da imagem.
- Usei `jarmode=tools`.
- Extraí layers do Spring Boot.
- Separei dependencies, loader, snapshots e application.
- Mantive Maven, JDK e source fora do runtime.
- Instalei curl somente para o healthcheck.
- Criei o usuário `app`.
- Usei UID e GID 10001.
- Não executei Java como root.
- Criei `/var/lib/formacao/uploads`.
- Configurei ownership e `COPY --chown`.
- Adicionei labels OCI.
- Configurei `JAVA_TOOL_OPTIONS`.
- Expus 8081 e 8082.
- Diferenciei `EXPOSE` de publicação.
- Criei healthcheck em `/livez`.
- Usei ENTRYPOINT no formato exec.
- GereI env file local interativamente.
- Usei `host.docker.internal` como ponte temporária.
- Publiquei management somente no loopback do host.
- Criei volume para uploads.
- Construí e inspecionei a imagem.
- Confirmei Java 21 e usuário não root.
- Iniciei o container e aguardei `healthy`.
- Testei liveness, readiness, info e API.
- Comprovei persistência do volume.
- Testei fail-fast de configuração.
- Observei shutdown gracioso.
- Não incluí PostgreSQL, Redis ou Mailpit na imagem.
- Não antecipei Compose ou Kubernetes.
- Próxima aula: Compose API PostgreSQL Redis.
```

---

## Referência técnica curta

- [Spring Boot — Dockerfiles](https://docs.spring.io/spring-boot/reference/packaging/container-images/dockerfiles.html)
- [Spring Boot — Efficient Container Images](https://docs.spring.io/spring-boot/reference/packaging/container-images/efficient-images.html)
- [Docker — Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Docker — Running containers](https://docs.docker.com/engine/containers/run/)
- [Eclipse Temurin — Official Docker Image](https://hub.docker.com/_/eclipse-temurin)

Regra final:

```text
uma imagem de aplicação precisa separar build e runtime, manter código e dependências em camadas reutilizáveis, executar com usuário não root, receber configuração no runtime, persistir dados fora do filesystem efêmero e publicar um healthcheck coerente com a semântica da aplicação; nesta baseline, Maven Wrapper compila com JDK 21, jarmode tools extrai as layers do Spring Boot, o runtime usa Temurin JRE 21, o usuário app executa Java, /livez alimenta o healthcheck e um volume preserva uploads sem misturar PostgreSQL ou Redis no mesmo container.
```
