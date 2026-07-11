# 400 - M14.45 - Compose API PostgreSQL Redis

## Apresentação da aula

Na aula 399, você transformou a API em uma imagem Docker.

O fluxo de construção ficou:

```text
código-fonte;

Maven Wrapper;

builder com JDK 21;

jar executável;

camadas do Spring Boot;

runtime com JRE 21;

usuário não root;

imagem;

container.
```

A aplicação foi iniciada com `docker run`.

PostgreSQL, Redis e Mailpit continuaram fora do container da API.

Para alcançar banco e cache publicados pelo host, a configuração utilizou:

```text
host.docker.internal.
```

Esse desenho foi útil para isolar a primeira pergunta:

```text
a imagem da API foi construída
e executada corretamente?
```

Agora o laboratório possui vários componentes com ciclos de vida diferentes:

```text
API;

PostgreSQL;

Redis;

volumes;

rede;

variáveis de ambiente;

healthchecks.
```

Iniciar tudo com comandos `docker run` separados exige lembrar:

- nome de cada container;
- imagem;
- variáveis;
- mounts;
- portas;
- ordem de inicialização;
- healthcheck;
- rede;
- políticas de restart;
- comandos de limpeza.

A pergunta central desta aula será:

```text
como declarar e operar
API, PostgreSQL e Redis
como uma única aplicação multicontainer
reproduzível?
```

A solução utilizará:

```text
Docker Compose;

compose.yaml;

services;

build;

image;

environment;

interpolação;

healthcheck;

depends_on;

condition service_healthy;

rede bridge;

DNS por nome de service;

volumes nomeados;

restart policy;

stop grace period.
```

A stack terá três services:

```text
api;

postgres;

redis.
```

A comunicação interna será:

```text
api -> postgres:5432;

api -> redis:6379.
```

Não será utilizado:

```text
localhost;

host.docker.internal;

IP fixo de container;

link legado.
```

O Compose cria e gerencia uma rede.

Cada service fica disponível pelo próprio nome no DNS interno.

Assim:

```text
postgres
```

resolve para o container atual do service PostgreSQL.

E:

```text
redis
```

resolve para o container atual do service Redis.

O consumidor não precisa conhecer o IP.

Isso é importante porque um container recriado pode receber outro endereço.

A configuração externa ficará em:

```text
.docker/compose.local.env
```

Esse arquivo real continuará ignorado pelo Git.

O repositório manterá:

```text
.docker/compose.local.env.example
```

sem senha preenchida.

O Compose utilizará o env file para interpolar:

- database;
- usuário;
- senha;
- tag da imagem;
- versão informada à aplicação.

A senha não será escrita em:

```text
compose.yaml;

Dockerfile;

application.yaml;

commit.
```

A stack utilizará dois volumes nomeados:

```text
postgres-data;

uploads-data.
```

`postgres-data` mantém a fonte da verdade.

`uploads-data` mantém os arquivos da aula 390.

Redis não terá volume.

Motivo:

```text
cache:
pode ser reconstruído.

rate limit:
estado temporário.

PostgreSQL:
continua fonte da verdade.
```

A ausência de volume não significa que Redis apaga a memória em um simples `restart`.

O mesmo container pode preservar arquivos internos e recarregar estado.

A garantia do laboratório será:

```text
ao remover e recriar o service Redis,
sem volume nomeado,
o estado anterior não faz parte
da nova instância.
```

PostgreSQL terá healthcheck com:

```text
pg_isready.
```

Redis terá healthcheck com:

```text
redis-cli ping.
```

A API manterá o healthcheck definido na imagem da aula 399:

```text
/livez.
```

O service `api` utilizará:

```yaml
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy
```

O Compose iniciará a API somente depois que os dois services estiverem saudáveis.

Isso resolve a corrida inicial mais simples:

```text
container iniciado
não significa serviço pronto.
```

Porém, `depends_on` não é um supervisor completo de runtime.

Se PostgreSQL ficar indisponível depois do startup:

```text
Compose não reinicia automaticamente a API
somente porque a dependência ficou unhealthy.
```

A aplicação, o pool de conexões e a política operacional ainda precisam lidar com falhas durante a execução.

A API será a única a publicar a porta de negócio:

```text
8081.
```

A porta de management será publicada somente no loopback do host:

```text
127.0.0.1:8082.
```

PostgreSQL e Redis não serão publicados no host.

Eles permanecerão acessíveis apenas na rede Compose.

Para diagnóstico, você utilizará:

```text
docker compose exec postgres ...;

docker compose exec redis ....
```

Essa decisão reduz a superfície local e evita conflitos com containers antigos nas portas `5432` e `6379`.

Mailpit ficará fora desta stack, e o envio de e-mail será desabilitado no container da API. O escopo permanece em API, PostgreSQL e Redis.

A próxima aula será:

```text
401 - M14.46 - Coleção Postman/Insomnia profissional
```

Por isso, não serão implementados:

- Mailpit no Compose;
- Kafka;
- broker;
- observabilidade externa;
- Prometheus;
- Grafana;
- proxy reverso;
- TLS;
- registry;
- deploy;
- Kubernetes;
- replicas;
- secrets de produção;
- pipeline de CI/CD.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
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

402:
Documentação técnica da API.
```

A aula 399 respondeu:

```text
como empacotar a API
em uma imagem segura e reproduzível?
```

A aula 400 responderá:

```text
como declarar e operar
a API e suas dependências principais
como uma stack multicontainer?
```

Nesta aula:

```text
Compose:
sim.

compose.yaml:
sim.

API:
sim.

PostgreSQL:
sim.

Redis:
sim.

rede interna:
sim.

DNS de services:
sim.

healthchecks:
sim.

depends_on healthy:
sim.

volume PostgreSQL:
sim.

volume de uploads:
sim.

Redis sem volume:
sim.

Mailpit:
não.

PostgreSQL publicado no host:
não.

Redis publicado no host:
não.

Kubernetes:
não.

deploy:
não.
```

A regra central será:

```text
Compose declara
services, rede, configuração e volumes;

containers se encontram
por nomes estáveis de service;

dados duráveis ficam em volumes.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
compose.yaml;

.docker/
├── compose.local.env
└── compose.local.env.example
```

A stack será validada com `docker compose config --quiet`.

Será iniciada com:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

O estado será acompanhado com:

```powershell
docker compose ps;

docker compose logs;

docker compose exec.
```

Você irá:

1. validar Docker Compose;
2. remover containers manuais conflitantes;
3. criar o env example;
4. criar o env local de forma segura;
5. criar `compose.yaml`;
6. declarar a imagem e o build da API;
7. declarar PostgreSQL;
8. declarar Redis;
9. configurar healthchecks;
10. configurar `depends_on`;
11. configurar rede interna;
12. configurar volumes nomeados;
13. validar o modelo renderizado;
14. construir e iniciar a stack;
15. verificar DNS interno;
16. validar Flyway e PostgreSQL;
17. validar Redis;
18. testar API e Actuator;
19. comprovar persistência;
20. comprovar estado efêmero do Redis;
21. operar stop, start, down e down com volumes;
22. commitar.

Estrutura esperada:

```text
formacao-java-backend-api
├── .docker
│   ├── compose.local.env
│   └── compose.local.env.example
├── .dockerignore
├── .gitignore
├── compose.yaml
├── Dockerfile
├── pom.xml
└── src
```

---

## Conceito essencial

### O que é Docker Compose

Docker Compose é uma ferramenta para definir e executar aplicações com múltiplos containers.

A definição fica em YAML.

O comando:

```text
docker compose up
```

interpreta o arquivo e cria:

- containers;
- rede;
- volumes;
- configuração;
- dependências.

Compose não substitui Docker Engine.

Ele usa o Engine para construir imagens e executar containers.

---

### Compose Specification

O formato atual é a Compose Specification.

O arquivo recomendado é:

```text
compose.yaml.
```

A baseline não adicionará:

```yaml
version: "3.8"
```

O campo `version` é legado para o modelo atual e pode gerar aviso de obsolescência.

A CLI detecta a specification suportada.

---

### Service

Um service descreve uma responsabilidade executável.

Nesta aula:

```text
api:
aplicação Spring.

postgres:
fonte da verdade.

redis:
cache e rate limiting.
```

Um service pode criar um ou mais containers, embora a baseline local utilize uma instância de cada.

Não confunda:

```text
service:
definição lógica.

container:
instância criada.
```

---

### Interpolação

Compose substitui expressões:

```text
${VARIABLE}.
```

Exemplo:

```yaml
POSTGRES_DB:
  "${POSTGRES_DB:?POSTGRES_DB is required}"
```

A forma `:?` encerra a leitura do modelo quando a variável está ausente ou vazia.

Isso evita iniciar uma stack com senha em branco por acidente.

Os valores virão de:

```text
--env-file .docker/compose.local.env.
```

Não confunda interpolação do Compose com environment do container.

Interpolação:

```text
acontece antes de criar containers.
```

`environment`:

```text
define variáveis dentro do container.
```

---

### Escapar $ no healthcheck

No healthcheck do PostgreSQL, a variável precisa ser expandida dentro do container.

Use:

```text
$${POSTGRES_USER}.
```

O `$$` impede que Compose consuma o símbolo.

Depois, o shell do container recebe:

```text
${POSTGRES_USER}.
```

Sem o escape, a CLI poderia tentar substituir a variável antes de criar o container.

---

### Rede padrão e rede explícita

Compose cria uma rede default automaticamente.

Services na mesma rede são descobertos pelo nome.

A baseline declarará uma rede:

```text
backend.
```

Motivos:

- deixar a intenção visível;
- restringir a stack a uma rede própria;
- preparar evolução;
- facilitar inspeção.

Todos os services serão conectados a `backend`.

---

### DNS por nome de service

A API utilizará:

```text
postgres;

redis.
```

Não use:

- IP;
- container ID;
- hostname gerado;
- `localhost`;
- `host.docker.internal`.

A resolução acompanha a recriação do container.

---

### Container name

A baseline não define:

```yaml
container_name:
```

Compose gera nomes com o project name.

Motivos:

- evitar colisões globais;
- permitir mais de um projeto;
- preservar convenções da ferramenta;
- facilitar scaling futuro;
- evitar dependência de nome manual.

Para comandos, use o service:

```text
docker compose exec postgres.
```

Não use o nome físico gerado.

---

### Portas internas e publicadas

PostgreSQL escuta:

```text
5432
```

dentro da rede.

Redis escuta:

```text
6379.
```

A API acessa essas portas diretamente.

Não é necessário publicar no host.

`ports` será usado apenas em `api`:

```text
8081:8081;

127.0.0.1:8082:8082.
```

A ausência de `ports` não impede comunicação entre containers na mesma rede.

---

### Volumes nomeados

Volumes possuem lifecycle independente do container.

Baseline:

```text
postgres-data;

uploads-data.
```

Quando o container PostgreSQL é recriado, os arquivos permanecem.

Quando a API é recriada, uploads permanecem.

O volume é criado e gerenciado pelo Compose.

---

### PostgreSQL volume

A imagem oficial grava dados em:

```text
/var/lib/postgresql/data.
```

O volume será montado nesse path.

As variáveis de inicialização são aplicadas quando o diretório está vazio.

Se você mudar:

```text
POSTGRES_DB;

POSTGRES_USER;

POSTGRES_PASSWORD
```

depois que o volume já foi inicializado, a imagem não recria automaticamente o cluster.

Esse comportamento é importante.

Configuração inicial e credenciais persistidas precisam ser tratadas com cuidado.

---

### Redis sem volume

Redis manterá estado em memória e em seu filesystem de container conforme sua configuração padrão.

Sem volume nomeado:

```text
recriar o container
remove esse filesystem.
```

Essa escolha é coerente com:

- cache;
- rate limit temporário;
- PostgreSQL como fonte da verdade.

Se o projeto passar a usar Redis como fonte de dados durável, essa decisão deverá ser revista.

---

### Healthcheck do PostgreSQL

Comando:

```text
pg_isready.
```

Ele verifica se o servidor aceita conexões.

Configuração:

```text
interval:
5 segundos.

timeout:
5 segundos.

retries:
10.

start period:
10 segundos.
```

O check não executa uma query de negócio.

Ele valida disponibilidade básica do servidor.

---

### Healthcheck do Redis

Comando:

```text
redis-cli ping.
```

Resposta esperada:

```text
PONG.
```

O healthcheck utiliza a ferramenta já presente na imagem Redis.

---

### Healthcheck da API

O Dockerfile já contém:

```text
curl http://127.0.0.1:8081/livez.
```

Compose herda o healthcheck da imagem quando não o sobrescreve.

Não duplique a definição no YAML.

Uma fonte de verdade reduz divergência.

---

### depends_on e service_healthy

A sintaxe curta:

```yaml
depends_on:
  - postgres
```

controla ordem de criação, mas não espera health.

A sintaxe longa permite:

```yaml
condition: service_healthy.
```

A API será criada depois que PostgreSQL e Redis reportarem healthy.

---

### Limite do depends_on

`depends_on` ajuda no startup.

Ele não garante:

- recuperação permanente;
- restart do dependent;
- retry de negócio;
- transação distribuída;
- alta disponibilidade;
- ordem de todas as operações em runtime.

Se Redis reiniciar depois:

```text
a aplicação precisa reconectar.
```

Se PostgreSQL reiniciar:

```text
o pool precisa recuperar conexões.
```

Compose não substitui resiliência da aplicação.

---

### Stop grace period

A API terá:

```yaml
stop_grace_period: 20s
```

O Compose envia `SIGTERM` e aguarda.

Isso preserva o shutdown gracioso da aula 399.

Depois do período, o runtime pode forçar o encerramento.

---

### Configuração da API

O service API receberá:

```text
SPRING_PROFILES_ACTIVE=local;

LOCAL_DB_URL=jdbc:postgresql://postgres:5432/...;

REDIS_HOST=redis;

FILE_STORAGE_ROOT=/var/lib/formacao/uploads;

MANAGEMENT_ADDRESS=0.0.0.0;

EMAIL_NOTIFICATION_ENABLED=false.
```

As properties existentes do projeto continuam sendo usadas.

O Compose não cria uma segunda configuração Java.

---

### down versus down -v

`docker compose down` remove:

- containers;
- rede.

Ele preserva volumes nomeados por default.

`docker compose down --volumes` também remove:

- `postgres-data`;
- `uploads-data`.

Esse comando apaga dados do laboratório.

Ele deve ser executado somente quando a intenção for reinicializar tudo.

---

## Mão na massa guiada

### 1. Validar Docker Compose

Execute:

```powershell
docker compose version
```

O comando correto é:

```text
docker compose
```

com espaço.

Evite depender do binário legado:

```text
docker-compose.
```

---

### 2. Revisar containers antigos

Liste:

```powershell
docker ps -a
```

Remova o container manual da API da aula 399:

```powershell
docker rm -f `
  "formacao-java-api" `
  2>$null
```

PostgreSQL e Redis antigos podem continuar ativos porque a stack não publicará as portas deles no host.

Para reduzir confusão, você pode pará-los durante o laboratório:

```powershell
docker stop `
  formacao-java-redis `
  2>$null
```

Não remova volumes antigos sem revisar.

---

### 3. Criar o env example

Arquivo:

```text
.docker/compose.local.env.example
```

Conteúdo:

```text
POSTGRES_DB=formacao_java
POSTGRES_USER=formacao
POSTGRES_PASSWORD=

APP_IMAGE_TAG=400-local
APP_VERSION=400-local
```

A senha permanece vazia no arquivo versionado.

O modelo Compose recusará valor ausente.

---

### 4. Gerar o env local

Execute:

```powershell
$securePassword = Read-Host `
  "Senha local do PostgreSQL da stack" `
  -AsSecureString

$plainPassword =
  [System.Net.NetworkCredential]::new(
      "",
      $securePassword
  ).Password

@"
POSTGRES_DB=formacao_java
POSTGRES_USER=formacao
POSTGRES_PASSWORD=$plainPassword
APP_IMAGE_TAG=400-local
APP_VERSION=400-local
"@ |
  Set-Content `
    ".docker/compose.local.env" `
    -Encoding utf8

$plainPassword = $null
$securePassword = $null
```

O arquivo real já corresponde ao padrão ignorado:

```text
.docker/*.env.
```

Confirme:

```powershell
git check-ignore `
  -v `
  ".docker/compose.local.env"
```

---

### 5. Criar compose.yaml

Arquivo:

```text
compose.yaml
```

Conteúdo:

```yaml
services:
  postgres:
    image: "postgres:17.6-alpine"

    environment:
      POSTGRES_DB:
        "${POSTGRES_DB:?POSTGRES_DB is required}"

      POSTGRES_USER:
        "${POSTGRES_USER:?POSTGRES_USER is required}"

      POSTGRES_PASSWORD:
        "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"

    volumes:
      - "postgres-data:/var/lib/postgresql/data"

    healthcheck:
      test:
        - "CMD-SHELL"
        - >-
          pg_isready
          -U "$${POSTGRES_USER}"
          -d "$${POSTGRES_DB}"

      interval: "5s"
      timeout: "5s"
      retries: 10
      start_period: "10s"

    restart: "unless-stopped"

    networks:
      - "backend"

  redis:
    image: "redis:8-alpine"

    healthcheck:
      test:
        - "CMD"
        - "redis-cli"
        - "ping"

      interval: "5s"
      timeout: "3s"
      retries: 10
      start_period: "5s"

    restart: "unless-stopped"

    networks:
      - "backend"

  api:
    build:
      context: "."

      args:
        APP_VERSION:
          "${APP_VERSION:-400-local}"

    image:
      "formacao-java-backend-api:${APP_IMAGE_TAG:-400-local}"

    environment:
      SPRING_PROFILES_ACTIVE:
        "local"

      SERVER_PORT:
        "8081"

      MANAGEMENT_PORT:
        "8082"

      MANAGEMENT_ADDRESS:
        "0.0.0.0"

      LOCAL_DB_URL:
        "jdbc:postgresql://postgres:5432/${POSTGRES_DB}"

      LOCAL_DB_USERNAME:
        "${POSTGRES_USER}"

      LOCAL_DB_PASSWORD:
        "${POSTGRES_PASSWORD}"

      REDIS_HOST:
        "redis"

      REDIS_PORT:
        "6379"

      EMAIL_NOTIFICATION_ENABLED:
        "false"

      FILE_STORAGE_ROOT:
        "/var/lib/formacao/uploads"

      APP_VERSION:
        "${APP_VERSION:-400-local}"

      AVAILABILITY_LAB_FORCED_STATE:
        "NONE"

    depends_on:
      postgres:
        condition: "service_healthy"

      redis:
        condition: "service_healthy"

    ports:
      - "8081:8081"
      - "127.0.0.1:8082:8082"

    volumes:
      - "uploads-data:/var/lib/formacao/uploads"

    restart: "unless-stopped"

    stop_grace_period: "20s"

    networks:
      - "backend"

networks:
  backend:
    driver: "bridge"

volumes:
  postgres-data:
  uploads-data:
```

Não adicione `version`.

Não adicione `container_name`.

---

### 6. Revisar o modelo

Confirme:

```text
services:
3.

networks:
1.

volumes:
2.

ports publicadas:
somente API.

Redis:
sem volume.

PostgreSQL:
com volume.

API:
com volume de uploads.
```

---

### 7. Validar interpolação sem imprimir secrets

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

Resultado esperado:

```text
exit code 0;
sem output relevante.
```

Não execute `docker compose config` e cole a saída em tickets ou chats.

A renderização completa pode conter a senha interpolada.

---

### 8. Listar services do modelo

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --services
```

Resultado:

```text
postgres;
redis;
api.
```

Liste volumes:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --volumes
```

---

### 9. Construir a API pelo Compose

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  build `
  "api"
```

O Compose reutiliza o Dockerfile da aula 399.

Confirme a imagem:

```powershell
docker image ls `
  "formacao-java-backend-api"
```

---

### 10. Iniciar a stack

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

O Compose cria:

- rede;
- volumes ausentes;
- containers;
- healthchecks.

---

### 11. Acompanhar o estado

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

A evolução esperada:

```text
postgres:
starting -> healthy.

redis:
starting -> healthy.

api:
created -> starting -> healthy.
```

A API só começa depois das dependências saudáveis.

---

### 12. Acompanhar logs agrupados

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow `
  --timestamps
```

Cada linha recebe o nome do service.

Interrompa o acompanhamento com:

```text
Ctrl + C.
```

A stack continua ativa.

---

### 13. Acompanhar somente API

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow `
  "api"
```

Procure:

```text
PostgreSQL conectado;

Flyway;

Redis;

startup;

liveness;

readiness.
```

---

### 14. Validar PostgreSQL

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "postgres" `
  pg_isready `
  -U "formacao" `
  -d "formacao_java"
```

Resultado:

```text
accepting connections.
```

Não use `localhost:5432` no host.

O PostgreSQL não foi publicado.

---

### 15. Validar Redis

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "redis" `
  redis-cli `
  PING
```

Resultado:

```text
PONG.
```

---

### 16. Validar DNS interno

Execute dentro da API:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "api" `
  sh `
  -c `
  "getent hosts postgres && getent hosts redis"
```

Resultado:

```text
um endereço interno para postgres;

um endereço interno para redis.
```

Não registre ou fixe esses IPs.

Eles podem mudar.

---

### 17. Confirmar que DB e Redis não estão publicados

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

Na coluna `PORTS`, PostgreSQL e Redis não devem apresentar mappings para o host.

A API apresenta:

```text
8081;

127.0.0.1:8082.
```

---

### 18. Testar health e readiness

```powershell
Invoke-WebRequest `
  "http://localhost:8081/livez"

Invoke-WebRequest `
  "http://localhost:8081/readyz"

Invoke-WebRequest `
  "http://127.0.0.1:8082/actuator/health"
```

Resultado esperado:

```text
200;
200;
200.
```

O health global pode refletir PostgreSQL e Redis.

---

### 19. Testar info

```powershell
Invoke-RestMethod `
  "http://127.0.0.1:8082/actuator/info"
```

Confirme:

```text
version:
400-local.
```

A imagem e o runtime usam a versão informada pelo env file.

---

### 20. Criar um registro persistente

Use o endpoint oficial da API:

```powershell
$body = @{
  value =
    "Compose"

  description =
    "Persistencia PostgreSQL na aula 400"
} |
  ConvertTo-Json

$created = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages" `
  -Headers @{
    "X-Client-Id" =
      "compose-aula-400"
  } `
  -ContentType "application/json" `
  -Body $body

$created
```

Guarde:

```powershell
$createdId = $created.id
```

Ajuste o DTO somente se o contrato oficial da feature utilizar nomes diferentes.

---

### 21. Conferir no PostgreSQL

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "postgres" `
  psql `
  -U "formacao" `
  -d "formacao_java" `
  -c `
  "select id, value from managed_runtime_message order by id desc limit 5;"
```

A linha deve existir.

---

### 22. Produzir cache no Redis

Leia o registro:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages/$createdId" `
  -Headers @{
    "X-Client-Id" =
      "compose-cache-aula-400"
  }
```

Liste as chaves:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "redis" `
  redis-cli `
  --scan `
  --pattern "*managed-runtime-message*"
```

O namespace da aula 388 deve aparecer.

---

### 23. Testar uploads

Envie um arquivo:

```powershell
$upload = curl.exe `
  --silent `
  --request POST `
  --form `
    "file=@.\samples\aula-390.txt;type=text/plain" `
  "http://localhost:8081/api/v2/runtime/files" |
  ConvertFrom-Json

$uploadId = $upload.id
```

O payload entra em:

```text
uploads-data.
```

---

### 24. Encerrar preservando volumes

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

O Compose remove:

- containers;
- rede.

Ele preserva:

- postgres-data;
- uploads-data.

Redis não possui volume.

---

### 25. Subir novamente

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --detach
```

A imagem já existe.

Aguarde:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

---

### 26. Comprovar persistência PostgreSQL

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages/$createdId" `
  -Headers @{
    "X-Client-Id" =
      "compose-after-recreate"
  }
```

O registro continua existindo porque o volume PostgreSQL foi preservado.

A primeira leitura pode recriar o cache.

---

### 27. Comprovar persistência de upload

Baixe:

```powershell
curl.exe `
  --output ".\samples\aula-400-recreated.txt" `
  "http://localhost:8081/api/v2/runtime/files/$uploadId"
```

O arquivo continua existindo no volume `uploads-data`.

---

### 28. Comprovar Redis efêmero

Depois de `down` e `up`, liste:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec `
  "redis" `
  redis-cli `
  --scan `
  --pattern "*managed-runtime-message*"
```

A chave anterior não deve fazer parte da nova instância.

Ao ler o registro novamente:

```text
cache miss;

PostgreSQL;

nova chave Redis.
```

Isso confirma a hierarquia:

```text
PostgreSQL:
durável.

Redis:
reconstruível.
```

---

### 29. Testar restart sem recriação

Execute:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  restart `
  "redis"
```

Esse comando reinicia o mesmo container.

Não use esse teste como prova de perda de dados.

Para provar ausência de persistência durável, o container precisa ser removido e recriado.

---

### 30. Testar dependência indisponível em runtime

Pare PostgreSQL:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  stop `
  "postgres"
```

Observe:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

A API não é parada automaticamente.

Consulte:

```text
health global;

livez;

readyz.
```

Reinicie:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  start `
  "postgres"
```

Isso demonstra o limite de `depends_on`.

---

### 36. Remover volumes somente com intenção

Para zerar completamente o laboratório:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down `
  --volumes `
  --remove-orphans
```

Antes, confirme:

```text
PostgreSQL será apagado;

uploads serão apagados.
```

Não execute esse comando como limpeza rotineira.

---

## Entendendo o que foi feito

### A stack virou código

Rede, services, volumes e healthchecks estão versionados.

### A API deixou de usar o host como roteador

Banco e Redis são encontrados pelos nomes de service.

### Dependências não foram publicadas

PostgreSQL e Redis existem somente na rede interna.

### Startup passou a considerar health

A API espera banco e cache ficarem prontos.

### Dados duráveis ficaram explícitos

PostgreSQL e uploads utilizam volumes.

### Redis permaneceu reconstruível

A ausência de volume reforça seu papel temporário.

### Operação ficou uniforme

`up`, `ps`, `logs`, `exec`, `stop` e `down` controlam a stack.

### Limites permaneceram honestos

Compose facilita o ambiente local, mas não oferece alta disponibilidade.

---

## Erros comuns importantes

### Usar localhost na API

Dentro do container, localhost aponta para a própria API.

### Publicar todas as portas

Banco e Redis ficam expostos sem necessidade.

### Fixar IP de container

O endereço pode mudar após recriação.

### Usar container_name

Cria colisões e acoplamento desnecessário.

### Confundir ordem com prontidão

A sintaxe curta de `depends_on` não espera health.

### Acreditar que depends_on monitora runtime

Falha posterior da dependência não reinicia automaticamente a API.

### Colocar senha no YAML

O arquivo é versionado.

### Imprimir docker compose config

A saída renderizada pode revelar secrets.

### Remover volumes sem intenção

`down --volumes` apaga banco e uploads.

### Persistir Redis sem decisão

Cache e rate limit não precisam virar fonte durável.

---

## Comandos úteis

### Validar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  config `
  --quiet
```

### Iniciar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

### Estado

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  ps
```

### Logs

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs `
  --follow
```

### Redis

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec redis redis-cli PING
```

### PostgreSQL

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  exec postgres `
  pg_isready -U formacao -d formacao_java
```

### Encerrar preservando volumes

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

### Apagar tudo

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down `
  --volumes `
  --remove-orphans
```

---

## Exercício guiado

### Parte 1 — Validação

Crie env file e valide o modelo sem imprimir secrets.

### Parte 2 — Startup ordenado

Suba a stack.

Observe PostgreSQL, Redis e API ficando healthy.

### Parte 3 — DNS interno

Confirme resolução de `postgres` e `redis`.

### Parte 4 — Superfície de rede

Comprove que apenas 8081 e 8082 estão publicadas.

### Parte 5 — Persistência

Crie mensagem e upload.

Execute `down` e `up`.

Confirme os dois dados.

### Parte 6 — Redis reconstruível

Confirme perda da chave após recriar a stack e recarga pelo PostgreSQL.

### Parte 7 — Limite de depends_on

Pare PostgreSQL durante o runtime.

Observe que a API continua executando.

### Parte 8 — Operação

Pratique:

```text
build;

up;

ps;

logs;

exec;

stop;

start;

down.
```

### Parte 9 — Registrar decisão

Anote:

```text
compose.yaml;

sem version;

services api, postgres e redis;

rede backend;

DNS por service name;

sem localhost;

sem host.docker.internal;

PostgreSQL 17.6 Alpine;

Redis 8 Alpine;

healthcheck pg_isready;

healthcheck redis-cli ping;

API herda /livez;

depends_on service_healthy;

PostgreSQL sem porta publicada;

Redis sem porta publicada;

API 8081;

management 8082 no loopback;

postgres-data;

uploads-data;

Redis sem volume;

restart unless-stopped;

stop grace period 20s;

env file ignorado;

sem Mailpit;

sem Kubernetes.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 399 foi preservada;
- Docker Compose foi definido;
- Compose foi diferenciado do Docker Engine;
- Compose Specification foi usada;
- arquivo `compose.yaml` foi criado;
- campo `version` não foi usado;
- três services foram criados;
- service `api` foi criado;
- service `postgres` foi criado;
- service `redis` foi criado;
- build da API utiliza o Dockerfile;
- imagem da API possui tag configurável;
- PostgreSQL usa imagem fixa;
- Redis usa imagem fixa;
- `latest` não foi usado;
- env example foi criado;
- env real foi ignorado;
- senha não foi colocada no Compose;
- interpolação obrigatória foi usada;
- diferença entre interpolação e environment foi explicada;
- `$$` foi usado no healthcheck PostgreSQL;
- healthcheck PostgreSQL usa `pg_isready`;
- healthcheck Redis usa `redis-cli ping`;
- API herdou healthcheck da imagem;
- healthcheck da API não foi duplicado;
- `depends_on` usa sintaxe longa;
- PostgreSQL exige `service_healthy`;
- Redis exige `service_healthy`;
- limite do `depends_on` foi explicado;
- rede `backend` foi criada;
- todos os services participam da rede;
- DNS por nome de service foi usado;
- IP fixo não foi usado;
- `container_name` não foi usado;
- `localhost` não foi usado entre services;
- `host.docker.internal` não foi usado;
- API conecta em `postgres:5432`;
- API conecta em `redis:6379`;
- PostgreSQL não publica porta no host;
- Redis não publica porta no host;
- API publica 8081;
- management publica 8082 somente no loopback;
- volume PostgreSQL foi criado;
- volume de uploads foi criado;
- Redis não possui volume;
- decisão de Redis efêmero foi explicada;
- restart policy foi configurada;
- stop grace period foi configurado;
- envio de e-mail foi desabilitado;
- Mailpit não foi adicionado;
- modelo foi validado com `config --quiet`;
- services foram listados;
- imagem da API foi construída;
- stack foi iniciada;
- status healthy foi observado;
- logs agrupados foram observados;
- logs da API foram observados;
- PostgreSQL foi testado por `exec`;
- Redis foi testado por `exec`;
- DNS interno foi testado;
- ausência de portas de DB e Redis foi comprovada;
- liveness foi testada;
- readiness foi testada;
- Actuator foi testado;
- versão foi consultada;
- registro foi persistido no PostgreSQL;
- registro foi conferido por psql;
- cache foi criado no Redis;
- upload foi criado;
- `down` preservou volumes;
- PostgreSQL sobreviveu à recriação;
- upload sobreviveu à recriação;
- Redis foi recriado sem estado anterior;
- restart foi diferenciado de recreate;
- falha de PostgreSQL em runtime foi observada;
- limite de supervisão foi comprovado;
- `stop` foi diferenciado de `down`;
- `down --volumes` foi tratado como destrutivo;
- Compose não foi apresentado como alta disponibilidade;
- Kafka não foi antecipado;
- Prometheus não foi antecipado;
- proxy não foi antecipado;
- TLS não foi antecipado;
- registry não foi antecipado;
- Kubernetes não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 401 está correta.

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
.docker/compose.local.env.
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "build(m14): orquestrar API PostgreSQL e Redis com Compose"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `.docker/compose.local.env`;
- senha;
- `target`;
- dados PostgreSQL;
- uploads;
- volumes;
- logs;
- dumps;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a aplicação containerizada passou a operar junto de suas dependências principais.

O fluxo ficou:

```text
compose.yaml;

env file local;

API;

PostgreSQL;

Redis;

healthchecks;

depends_on;

rede backend;

DNS interno;

volumes;

operação por Compose.
```

Você comprovou:

```text
PostgreSQL healthy;

Redis healthy;

API healthy;

startup ordenado;

comunicação por nomes;

portas internas protegidas;

persistência do banco;

persistência de uploads;

reconstrução do cache;

shutdown controlado.
```

A decisão central foi:

```text
Compose transforma
a topologia local em código;

services se encontram
por nomes estáveis;

healthchecks reduzem
corridas de startup;

volumes preservam
somente o estado que deve durar.
```

A próxima aula será:

```text
401 - M14.46 - Coleção Postman/Insomnia profissional
```

Nela, você organizará uma coleção de consumo da API com:

- ambientes;
- variáveis;
- autenticação quando aplicável;
- exemplos;
- scripts;
- encadeamento;
- erros;
- versionamento;
- execução reproduzível.

A stack Compose criada nesta aula fornecerá um ambiente previsível para executar a coleção.

Documentação técnica completa ficará para a aula 402.

Nada disso foi antecipado aqui.

---

# Material complementar

## Checkpoint final

- [ ] Criei `compose.yaml`.
- [ ] Subi API, PostgreSQL e Redis.
- [ ] Usei DNS interno e healthchecks.
- [ ] Preservei PostgreSQL e uploads em volumes.
- [ ] Operei a stack com comandos Compose.

---

## Troubleshooting adicional

### Variable is required

Confirme:

```text
--env-file correto;

nome da variável;

valor não vazio;

encoding do arquivo.
```

### Compose mostra senha no terminal

Você executou a renderização completa.

Use:

```text
config --quiet.
```

Não compartilhe a saída anterior.

### PostgreSQL fica unhealthy

Revise:

- logs;
- database;
- usuário;
- senha;
- volume antigo com outras credentials;
- healthcheck.

Se o volume foi inicializado com valores anteriores, alterar o env file não recria o cluster.

### API não inicia

Execute:

```powershell
docker compose logs api
```

Procure:

- Flyway;
- datasource;
- Redis;
- property obrigatória;
- permissão do volume.

### Redis healthy, mas API não conecta

Confirme:

```text
REDIS_HOST=redis;

mesma rede;

porta interna 6379.
```

### Banco conecta pelo host, mas não pela API

Confirme:

```text
LOCAL_DB_URL usa postgres;

não localhost;

não host.docker.internal.
```

### getent não existe

Use inspeção da rede ou instale uma ferramenta apenas em um container temporário conectado à rede.

Não altere a imagem da API somente para diagnóstico permanente.

### Dados PostgreSQL desapareceram

Revise se foi executado:

```text
down --volumes.
```

Confirme o mount em `/var/lib/postgresql/data`.

### Chave Redis continuou após restart

Restart reutiliza o mesmo container.

Remova e recrie o service ou execute `down` e `up` para testar ausência de volume.

### Porta 8081 já está ocupada

Pare a API manual antiga ou altere conscientemente o mapping local.

Não crie dois ambientes parcialmente sobrepostos.

---

## Observações para evolução

Compose também suporta:

- múltiplos arquivos;
- profiles;
- configs;
- secrets;
- watch;
- develop;
- resource limits;
- GPUs;
- serviços opcionais;
- redes públicas e privadas;
- dependências opcionais;
- replicas em alguns modos.

Um ambiente de produção precisa decidir:

- registry;
- tags imutáveis;
- secrets;
- backups;
- TLS;
- observabilidade;
- alta disponibilidade;
- atualização;
- rollback;
- políticas de rede;
- limites;
- disaster recovery.

Compose pode ser usado em produção em contextos controlados, mas esta aula o utiliza como ambiente local reproduzível.

Ele não substitui automaticamente uma plataforma de orquestração.

---

## Perguntas de revisão

1. O que Compose declara?
2. Qual é o arquivo recomendado?
3. O campo version foi usado?
4. Quais services existem?
5. Como a API encontra PostgreSQL?
6. Como encontra Redis?
7. É necessário IP fixo?
8. PostgreSQL está publicado no host?
9. Redis está publicado no host?
10. Para que serve service_healthy?
11. depends_on monitora runtime?
12. Qual volume preserva o banco?
13. Qual volume preserva uploads?
14. Redis possui volume?
15. Por que Redis é efêmero?
16. O que down remove?
17. Down remove volumes por default?
18. Qual comando apaga volumes?
19. Mailpit foi incluído?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Services, redes, volumes e configuração.
2. `compose.yaml`.
3. Não.
4. API, PostgreSQL e Redis.
5. Pelo nome `postgres`.
6. Pelo nome `redis`.
7. Não.
8. Não.
9. Não.
10. Esperar a dependência ficar saudável.
11. Não.
12. `postgres-data`.
13. `uploads-data`.
14. Não.
15. Cache e rate limit são reconstruíveis.
16. Containers e rede.
17. Não.
18. `down --volumes`.
19. Não.
20. Coleção Postman/Insomnia profissional.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 400 - M14.45 - Compose API PostgreSQL Redis

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei Docker Engine de Docker Compose.
- Usei a Compose Specification.
- Criei `compose.yaml`.
- Não usei o campo legado `version`.
- Criei os services `api`, `postgres` e `redis`.
- Mantive o Dockerfile da API.
- Fixei as imagens de PostgreSQL e Redis.
- Criei env example sem senha.
- GereI o env local de forma interativa.
- Mantive o env real fora do Git.
- Usei interpolação obrigatória.
- Diferenciei interpolação de environment.
- Criei healthcheck com `pg_isready`.
- Criei healthcheck com `redis-cli ping`.
- Reutilizei o healthcheck `/livez` da imagem da API.
- Usei `depends_on` com `service_healthy`.
- Entendi que `depends_on` não monitora falhas de runtime.
- Criei a rede `backend`.
- Usei DNS pelos nomes `postgres` e `redis`.
- Removi a dependência de `host.docker.internal`.
- Não usei IP fixo.
- Não usei `container_name`.
- Não publiquei PostgreSQL no host.
- Não publiquei Redis no host.
- Publiquei a API em 8081.
- Publiquei management em 8082 somente no loopback.
- Criei o volume `postgres-data`.
- Criei o volume `uploads-data`.
- Mantive Redis sem volume.
- Configurei `restart: unless-stopped`.
- Configurei stop grace period de 20 segundos.
- Desabilitei e-mail nesta stack.
- Validei o Compose sem imprimir secrets.
- Construí e iniciei a stack.
- Acompanhei status e logs por service.
- Validei PostgreSQL e Redis com `exec`.
- Validei o DNS interno.
- Testei liveness, readiness e Actuator.
- Persisti um registro no PostgreSQL.
- Persisti um upload.
- Executei `down` e `up`.
- Confirmei persistência do banco e dos uploads.
- Confirmei reconstrução do cache Redis.
- Diferenciei restart de recriação.
- Testei a indisponibilidade do banco em runtime.
- Não antecipei Mailpit, proxy, TLS ou Kubernetes.
- Próxima aula: Coleção Postman/Insomnia profissional.
```

---

## Referência técnica curta

- [Docker Compose](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Networking in Compose](https://docs.docker.com/compose/how-tos/networking/)
- [Control startup order](https://docs.docker.com/compose/how-tos/startup-order/)
- [Compose services](https://docs.docker.com/reference/compose-file/services/)
- [Compose volumes](https://docs.docker.com/reference/compose-file/volumes/)

Regra final:

```text
uma stack Compose precisa declarar services, rede, configuração, healthchecks e volumes sem depender de IPs ou comandos manuais dispersos; nesta baseline, a API encontra PostgreSQL e Redis pelos nomes de service, depends_on aguarda health no startup, somente as portas da API são publicadas, PostgreSQL e uploads usam volumes duráveis, Redis permanece reconstruível e o env file local fornece valores sem levar senha ao repositório.
```
