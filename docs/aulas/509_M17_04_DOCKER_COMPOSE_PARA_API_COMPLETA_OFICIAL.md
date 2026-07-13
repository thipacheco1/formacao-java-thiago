# 509 - M17.04 - Docker Compose para API completa

## Apresentação da aula

Na aula 508, você endureceu a imagem Spring Boot criada no início do Módulo 17.

A imagem passou a possuir:

```text
Dockerfile multi-stage;

builder com JDK e Maven Wrapper;

runtime somente com JRE e JAR;

usuário e grupo app;

UID e GID explícitos;

JAR somente leitura;

root filesystem read-only;

tmpfs em /tmp;

volume em /data;

capabilities removidas;

no-new-privileges;

limites básicos.
```

A aplicação já pode ser executada com um comando `docker run` completo.

Esse comando precisa informar:

- imagem;
- nome do container;
- porta;
- rede;
- variáveis;
- volume;
- tmpfs;
- capabilities;
- security options;
- limites;
- dependências.

Um comando extenso funciona para uma execução manual.

Entretanto, ele apresenta dificuldades:

```text
é fácil esquecer uma opção;

é difícil revisar mudanças;

é difícil compartilhar a stack;

é difícil iniciar vários serviços;

é difícil repetir o mesmo ambiente;

é difícil documentar dependências;

é difícil desmontar tudo com segurança.
```

A pergunta central desta aula será:

```text
como declarar
a aplicação completa

e suas dependências

em um arquivo versionado,
reproduzível
e operável?
```

A resposta será:

```text
Docker Compose.
```

Docker Compose permite declarar serviços em YAML.

Nesta aula, a stack terá:

```text
app;

Kafka;

rede interna;

volume da aplicação;

volume do Kafka.
```

A aplicação continuará utilizando:

```text
H2 em arquivo
para o laboratório.
```

O banco será persistido no volume:

```text
app_data.
```

Kafka terá:

```text
KRaft;

um broker;

um controller;

listener interno;

listener para o host;

volume próprio.
```

A aplicação não utilizará:

```text
host.docker.internal
```

para alcançar Kafka.

Dentro da rede Compose, o DNS será:

```text
kafka.
```

Portanto:

```text
app -> kafka:29092.
```

O host continuará acessando Kafka em:

```text
localhost:9092.
```

Essa diferença é importante.

A stack terá dois contextos de acesso:

```text
dentro da rede Docker:

kafka:29092.

fora da rede Docker:

localhost:9092.
```

A aplicação será construída pelo Compose com o Dockerfile multi-stage e endurecido.

O serviço `app` preservará:

- usuário não root da imagem;
- root filesystem read-only;
- tmpfs;
- volume;
- capabilities removidas;
- no-new-privileges;
- limites;
- configuração externa;
- logs em stdout;
- graceful shutdown.

A aula utilizará:

```text
compose.yaml.
```

O campo legado:

```yaml
version:
```

não será necessário.

A declaração seguirá a Compose Specification.

A aula também explicará:

- service;
- image;
- build;
- target;
- environment;
- ports;
- expose;
- networks;
- volumes;
- tmpfs;
- restart;
- depends_on;
- command;
- entrypoint;
- project name;
- interpolation;
- merge de configuração;
- comandos de operação.

Um ponto importante será:

```text
depends_on
organiza a ordem de criação;

não prova
que a dependência está pronta.
```

Nesta aula, Kafka pode iniciar antes da aplicação, mas o client Kafka continuará tentando conectar quando o broker ainda estiver inicializando.

Na aula 511, você criará healthchecks específicos e readiness entre containers.

Por isso, nesta aula:

```text
não haverá
condition: service_healthy.
```

Também não haverá:

- Docker secrets;
- arquivo de segredo;
- rotação;
- `_FILE`;
- external secret provider;
- healthcheck de processo;
- healthcheck HTTP;
- profiles avançados;
- scaling;
- deploy section;
- Swarm;
- Kubernetes.

A próxima aula será:

```text
510 - M17.05 - Variaveis secrets e configuracao
```

Ela aprofundará como separar:

```text
configuração comum;

configuração de ambiente;

segredo;

valor de build;

valor de runtime.
```

O Compose desta aula utilizará apenas valores de laboratório e contratos de configuração já conhecidos.

Ao final, você deverá explicar:

```text
a diferença entre service
e container;

como o DNS de serviço funciona;

por que app usa kafka:29092;

por que o host usa localhost:9092;

o que build.target seleciona;

o que ports publica;

o que expose documenta;

como volumes preservam dados;

o que docker compose down remove;

por que down -v é destrutivo;

por que depends_on
não garante readiness;

como inspecionar
a configuração efetiva.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
507:
Dockerfile multi stage avancado.

508:
Imagem segura e usuario nao root.

509:
Docker Compose para API completa.

510:
Variaveis secrets e configuracao.

511:
Healthcheck em containers.
```

A aula 508 respondeu:

```text
como executar
a imagem com
o menor privilégio necessário?
```

A aula 509 responderá:

```text
como declarar
e operar
a stack completa
da API?
```

Nesta aula:

```text
compose.yaml:
sim.

serviço app:
sim.

serviço Kafka:
sim.

KRaft:
sim.

rede:
sim.

DNS interno:
sim.

listener interno:
sim.

listener externo:
sim.

volumes:
sim.

build:
sim.

runtime seguro:
sim.

logs:
sim.

operações:
sim.

depends_on:
sim.

readiness real:
não.

secrets avançados:
não.

healthcheck dedicado:
não.

scaling:
não.

registry:
não.

pipeline:
não.

Kubernetes:
não.
```

A regra central será:

```text
Compose declara
serviços,
rede,
configuração
e persistência;

cada serviço continua
responsável pelo próprio processo.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
compose.yaml
.env.example

scripts/compose
├── start-stack.ps1
├── verify-stack.ps1
└── stop-stack.ps1

docs/devops/compose
├── COMPOSE_ARCHITECTURE.md
├── COMPOSE_OPERATIONS.md
├── COMPOSE_NETWORKING.md
├── COMPOSE_DATA_LIFECYCLE.md
└── COMPOSE_TROUBLESHOOTING.md
```

A stack ficará:

```text
host
├── localhost:8084
│      |
│      v
│   app:8084
│      |
│      v
│   kafka:29092
│
└── localhost:9092
       |
       v
    kafka:9092
```

Volumes:

```text
app_data
-> /data.

kafka_data
-> /var/lib/kafka/data.
```

Rede:

```text
backend.
```

Ao final, você terá:

```text
stack declarada;

imagem construída;

Kafka iniciado;

API iniciada;

DNS interno validado;

porta host validada;

volumes persistentes;

logs centralizados pelo Compose;

comandos de start e stop;

script de verificação;

documentação operacional.
```

Você irá:

1. confirmar a baseline;
2. validar o plugin Compose;
3. revisar a imagem segura;
4. criar `compose.yaml`;
5. declarar a rede;
6. declarar volumes;
7. declarar Kafka;
8. configurar KRaft;
9. configurar listeners;
10. declarar a aplicação;
11. configurar build target;
12. configurar portas;
13. configurar environment;
14. configurar volume;
15. configurar tmpfs;
16. preservar hardening;
17. configurar limites;
18. validar o YAML;
19. construir a stack;
20. iniciar a stack;
21. inspecionar serviços;
22. validar DNS;
23. validar Kafka;
24. validar API;
25. validar jornada;
26. validar persistência;
27. validar logs;
28. validar restart;
29. desmontar a stack;
30. criar scripts;
31. documentar;
32. executar gate;
33. commitar;
34. preparar a aula 510.

---

## Conceito essencial

### Compose project

Um projeto Compose agrupa recursos relacionados.

Ele pode possuir:

- serviços;
- redes;
- volumes;
- containers;
- imagens construídas.

O nome do projeto influencia os nomes gerados.

Exemplo:

```text
m17-compose_app_1;

m17-compose_backend;

m17-compose_app_data.
```

A apresentação exata depende da versão do Compose.

---

### Service

Service é uma declaração lógica.

Exemplo:

```yaml
services:
  app:
```

O service descreve como criar um ou mais containers da aplicação.

Service não é sinônimo de container específico.

---

### Image

A propriedade:

```yaml
image:
```

define a referência da imagem.

Quando `build` e `image` aparecem juntos:

```text
Compose constrói;

aplica a tag declarada;

usa a imagem resultante.
```

---

### Build

Exemplo:

```yaml
build:
  context: .
  dockerfile: Dockerfile
  target: runtime
```

`target` seleciona o estágio final desejado.

Nesta aula:

```text
runtime.
```

---

### Command e entrypoint

A imagem já possui:

```text
ENTRYPOINT.
```

Compose não precisa sobrescrevê-lo.

Sobrescrever sem necessidade pode quebrar:

- sinais;
- argumentos;
- comportamento;
- segurança;
- documentação.

---

### Ports

Exemplo:

```yaml
ports:
  - "8084:8084"
```

Formato:

```text
host:container.
```

Isso publica a porta para o host.

---

### Expose

Exemplo:

```yaml
expose:
  - "29092"
```

`expose` documenta uma porta destinada à rede de containers.

Ele não publica a porta no host.

Mesmo sem `expose`, containers na mesma rede podem alcançar portas em que o processo escuta.

O campo melhora a intenção do arquivo.

---

### Network

A rede `backend` permitirá comunicação por DNS.

Os nomes dos serviços serão resolvidos:

```text
app;

kafka.
```

Não use IP fixo.

Containers podem receber novos IPs após recriação.

---

### Named volume

Named volume pertence ao Docker.

Exemplo:

```yaml
volumes:
  app_data:
```

Ele possui lifecycle separado do container.

`docker compose down` preserva volumes nomeados por padrão.

`docker compose down --volumes` remove.

---

### Bind mount

Bind mount liga um caminho do host ao container.

Ele é útil para:

- desenvolvimento;
- configuração;
- arquivos locais.

Ele também introduz diferenças de:

- sistema operacional;
- ownership;
- path;
- performance;
- permissões.

O laboratório utilizará named volumes para dados.

---

### Environment

Compose permite declarar:

```yaml
environment:
```

Nesta aula serão usados valores explícitos de laboratório e interpolação simples.

Segredos reais não serão armazenados no arquivo.

---

### `.env`

Um arquivo `.env` próximo ao Compose pode fornecer valores para interpolação.

Ele não é um cofre.

Na aula 510, você irá aprofundar esse assunto.

Nesta aula será criado apenas:

```text
.env.example.
```

Sem segredo real.

---

### Interpolação

Exemplo:

```yaml
SERVER_PORT: "${SERVER_PORT:-8084}"
```

O valor pode vir do ambiente ou do `.env`.

O operador:

```text
:- 
```

fornece um padrão quando a variável está ausente ou vazia.

---

### `depends_on`

Exemplo:

```yaml
depends_on:
  - kafka
```

Ele expressa dependência de criação e inicialização de processo.

Ele não espera automaticamente a aplicação dependente ficar funcional.

---

### Restart policy

Exemplo:

```yaml
restart: unless-stopped
```

O runtime tenta reiniciar o container quando ele encerra inesperadamente.

Restart não corrige:

- configuração errada;
- schema inválido;
- segredo ausente;
- volume sem permissão.

Um restart loop pode esconder a causa.

---

### KRaft

KRaft permite Kafka sem ZooKeeper.

No laboratório, um único processo atuará como:

```text
broker;

controller.
```

Isso é adequado para estudo.

Não representa alta disponibilidade.

---

### Listeners Kafka

A stack utilizará:

```text
BROKER:
comunicação interna.

HOST:
acesso do host.

CONTROLLER:
quórum KRaft.
```

Endereços anunciados:

```text
BROKER://kafka:29092;

HOST://localhost:9092.
```

O client recebe metadata e precisa alcançar o endereço correspondente ao listener utilizado.

---

### `docker compose config`

Esse comando renderiza a configuração efetiva.

Ele ajuda a detectar:

- YAML inválido;
- interpolação;
- caminhos;
- valores;
- merge;
- nomes.

Cuidado: ele pode exibir valores de ambiente.

Não compartilhe output com segredos.

---

### `up`

Comando:

```powershell
docker compose up
```

Cria e inicia serviços.

Com:

```text
--detach
```

executa em background.

Com:

```text
--build
```

reconstrói imagens quando solicitado.

---

### `down`

Comando:

```powershell
docker compose down
```

remove:

- containers;
- rede padrão do projeto.

Preserva volumes nomeados por padrão.

---

### `down --volumes`

Remove volumes do projeto.

É destrutivo para dados persistentes.

Use somente quando a intenção for resetar o laboratório.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Depois, valide a imagem:

```powershell
docker buildx build `
  --load `
  --tag `
  "formacao-java/m16-integrations:3.0.0" `
  .
```

---

### 2. Validar Docker Compose

Execute:

```powershell
docker compose version
```

Não use como baseline:

```text
docker-compose
```

com hífen.

O plugin moderno é invocado como:

```text
docker compose.
```

---

### 3. Criar `compose.yaml`

Crie na raiz do laboratório:

```text
compose.yaml
```

Conteúdo:

```yaml
name: m17-compose

services:
  kafka:
    image: apache/kafka:3.9.0

    environment:
      CLUSTER_ID: "MkU3OEVBNTcwNTJENDM2Qk"

      KAFKA_NODE_ID: "1"

      KAFKA_PROCESS_ROLES:
        "broker,controller"

      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP:
        "CONTROLLER:PLAINTEXT,BROKER:PLAINTEXT,HOST:PLAINTEXT"

      KAFKA_LISTENERS:
        "CONTROLLER://:29093,BROKER://:29092,HOST://:9092"

      KAFKA_ADVERTISED_LISTENERS:
        "BROKER://kafka:29092,HOST://localhost:9092"

      KAFKA_CONTROLLER_LISTENER_NAMES:
        "CONTROLLER"

      KAFKA_INTER_BROKER_LISTENER_NAME:
        "BROKER"

      KAFKA_CONTROLLER_QUORUM_VOTERS:
        "1@kafka:29093"

      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR:
        "1"

      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR:
        "1"

      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR:
        "1"

      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS:
        "0"

      KAFKA_NUM_PARTITIONS:
        "3"

      KAFKA_LOG_DIRS:
        "/var/lib/kafka/data"

    ports:
      - "${KAFKA_HOST_PORT:-9092}:9092"

    expose:
      - "29092"
      - "29093"

    volumes:
      - kafka_data:/var/lib/kafka/data

    networks:
      - backend

    restart: unless-stopped

  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runtime

    image:
      "formacao-java/m16-integrations:${APP_IMAGE_TAG:-4.0.0}"

    depends_on:
      - kafka

    environment:
      SPRING_PROFILES_ACTIVE:
        "container"

      SERVER_PORT:
        "8084"

      KAFKA_BOOTSTRAP_SERVERS:
        "kafka:29092"

      DB_URL:
        "jdbc:h2:file:/data/m16-integrations"

      DB_USERNAME:
        "sa"

      DB_PASSWORD:
        ""

      FAKE_NOTIFICATION_API_BASE_URL:
        "http://app:8084"

      FAKE_NOTIFICATION_API_TOKEN:
        "${FAKE_NOTIFICATION_API_TOKEN:-lab-only-token}"

      JAVA_TOOL_OPTIONS:
        "-XX:MaxRAMPercentage=75.0 -Djava.io.tmpdir=/tmp"

    ports:
      - "${APP_HOST_PORT:-8084}:8084"

    volumes:
      - app_data:/data

    tmpfs:
      - "/tmp:rw,noexec,nosuid,size=64m,mode=1777"

    read_only: true

    cap_drop:
      - ALL

    security_opt:
      - "no-new-privileges:true"

    pids_limit: 256

    mem_limit: 768m

    cpus: 1.0

    networks:
      - backend

    restart: unless-stopped

networks:
  backend:
    driver: bridge

volumes:
  app_data:
  kafka_data:
```

Não adicione:

```yaml
version:
```

---

### 4. Revisar a imagem Kafka

A tag do broker precisa ser explícita.

Antes de executar em outro período, confirme que a imagem definida está disponível no registry utilizado pelo laboratório.

Não substitua silenciosamente por `latest`.

Uma atualização de Kafka precisa de:

- changelog;
- teste;
- compatibilidade;
- rollback.

---

### 5. Revisar o listener interno

A aplicação utiliza:

```text
kafka:29092.
```

Isso corresponde a:

```text
BROKER.
```

O broker anuncia:

```text
BROKER://kafka:29092.
```

Esse nome é resolvido na rede:

```text
backend.
```

---

### 6. Revisar o listener do host

O host utiliza:

```text
localhost:9092.
```

Isso corresponde a:

```text
HOST.
```

O broker anuncia:

```text
HOST://localhost:9092.
```

A porta é publicada por:

```yaml
ports:
  - "9092:9092"
```

---

### 7. Criar `.env.example`

Arquivo:

```text
.env.example
```

Conteúdo:

```dotenv
APP_HOST_PORT=8084
KAFKA_HOST_PORT=9092
APP_IMAGE_TAG=4.0.0
FAKE_NOTIFICATION_API_TOKEN=lab-only-token
```

Esse arquivo contém somente valores didáticos.

Crie ou mantenha no `.gitignore`:

```text
.env
```

Não confunda `.env.example` com segredo real.

---

### 8. Validar a configuração

Execute:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

Revise:

- serviços;
- imagens;
- build;
- portas;
- rede;
- volumes;
- environment;
- security options.

Não publique a saída se ela contiver segredo.

---

### 9. Validar nomes dos serviços

Execute:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config `
  --services
```

Resultado esperado:

```text
kafka;

app.
```

---

### 10. Construir a aplicação pelo Compose

```powershell
docker compose `
  --env-file `
  ".env.example" `
  build `
  --progress plain `
  app
```

O Dockerfile multi-stage deve:

- resolver dependências;
- executar testes;
- gerar o JAR;
- criar runtime seguro.

---

### 11. Iniciar a stack

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach
```

Para construir e iniciar em um comando:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --build
```

Use `--build` quando deseja reconstrução.

---

### 12. Inspecionar os serviços

```powershell
docker compose `
  --env-file `
  ".env.example" `
  ps
```

Observe:

- service;
- state;
- ports;
- nomes dos containers;
- exit code quando houver falha.

---

### 13. Acompanhar logs

Todos:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  logs `
  --follow
```

Somente app:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  logs `
  --follow `
  app
```

Somente Kafka:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  logs `
  --follow `
  kafka
```

---

### 14. Validar DNS interno

Execute no serviço app:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "getent hosts kafka"
```

A imagem precisa possuir a ferramenta disponível.

Se `getent` não existir, use outra verificação compatível com a base ou observe a conexão Kafka nos logs.

Não instale ferramenta no runtime apenas para esse teste sem necessidade.

---

### 15. Validar resolução por Java

Uma verificação sem ferramenta externa pode usar Java em um container temporário da mesma rede.

Primeiro descubra a rede:

```powershell
docker network ls
```

Depois, quando necessário:

```powershell
docker run `
  --rm `
  --network `
  "m17-compose_backend" `
  eclipse-temurin:21-jre-jammy `
  sh `
  -c `
  "getent hosts kafka || true"
```

O nome exato da rede deve ser obtido pelo Docker, não presumido.

---

### 16. Validar Kafka a partir do serviço

Use os logs da aplicação.

Confirme ausência de loop permanente de conexão.

Depois, liste topics pelo container Kafka:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  kafka `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server `
  "kafka:29092" `
  --list
```

---

### 17. Criar o topic quando necessário

Se a aplicação não cria o topic automaticamente:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  kafka `
  /opt/kafka/bin/kafka-topics.sh `
  --bootstrap-server `
  "kafka:29092" `
  --create `
  --if-not-exists `
  --topic `
  "m16.service-order.events.v1" `
  --partitions `
  "3" `
  --replication-factor `
  "1"
```

Registre quem é responsável pela criação do topic.

---

### 18. Validar a API pelo host

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health"
```

O host acessa pela porta publicada.

A aplicação não precisa conhecer:

```text
localhost:8084.
```

Ela escuta em:

```text
0.0.0.0:8084
```

dentro do container.

---

### 19. Executar smoke test

Envie uma requisição de criação de OS com dados fictícios.

Confirme:

- response;
- Outbox;
- Kafka;
- Inbox;
- intent;
- provider fake;
- logs;
- métricas.

O fluxo precisa operar usando:

```text
kafka:29092.
```

---

### 20. Validar segurança do serviço app

Execute:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  id
```

Confirme:

```text
uid=10001(app);

gid=10001(app).
```

Valide rootfs:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "touch /app/forbidden.txt"
```

A escrita deve falhar.

---

### 21. Validar `/tmp` e `/data`

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "echo temp > /tmp/compose-temp.txt"
```

Depois:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "echo data > /data/compose-data.txt"
```

---

### 22. Validar os volumes

Liste:

```powershell
docker volume ls
```

Inspecione os volumes do projeto:

```powershell
docker volume inspect `
  "m17-compose_app_data"
```

O nome exato pode variar com o project name.

Use:

```powershell
docker compose config
```

e:

```powershell
docker volume ls
```

para localizar o recurso real.

---

### 23. Reiniciar somente a aplicação

```powershell
docker compose `
  --env-file `
  ".env.example" `
  restart `
  app
```

Confirme:

- Kafka não reiniciou;
- volume permaneceu;
- app voltou;
- health respondeu;
- dados permaneceram.

---

### 24. Recriar somente a aplicação

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --no-deps `
  --force-recreate `
  app
```

Confirme que:

- rede foi reutilizada;
- Kafka continuou;
- volume continuou;
- container app foi recriado.

---

### 25. Parar sem remover

```powershell
docker compose `
  --env-file `
  ".env.example" `
  stop
```

Depois:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  start
```

Containers são reutilizados.

---

### 26. Derrubar a stack

```powershell
docker compose `
  --env-file `
  ".env.example" `
  down
```

Isso remove containers e rede do projeto.

Volumes nomeados permanecem.

---

### 27. Subir novamente

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach
```

Confirme que dados persistiram.

---

### 28. Resetar dados conscientemente

Somente quando o reset for intencional:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  down `
  --volumes
```

Antes, confirme:

- ambiente;
- projeto;
- dados;
- backup quando necessário.

No laboratório, esse comando limpa Kafka e H2.

---

### 29. Criar script de inicialização

Arquivo:

```text
scripts/compose/start-stack.ps1
```

Responsabilidades:

```text
validar Docker;

validar Compose;

validar .env;

renderizar config;

build;

up -d;

ps;

imprimir endpoints.
```

Use:

```powershell
$ErrorActionPreference = "Stop"
```

---

### 30. Criar script de verificação

Arquivo:

```text
scripts/compose/verify-stack.ps1
```

Responsabilidades:

1. verificar `docker compose ps`;
2. verificar app ativa;
3. verificar Kafka ativo;
4. verificar health HTTP;
5. verificar usuário não root;
6. verificar escrita proibida em `/app`;
7. verificar escrita em `/tmp`;
8. verificar escrita em `/data`;
9. listar topics;
10. executar smoke test ou orientar execução.

O script não deve imprimir token.

---

### 31. Criar script de parada

Arquivo:

```text
scripts/compose/stop-stack.ps1
```

Parâmetro:

```text
-RemoveVolumes.
```

Sem parâmetro:

```text
docker compose down.
```

Com parâmetro:

```text
pedir confirmação;

docker compose down --volumes.
```

Não remova volumes silenciosamente.

---

### 32. Documentar arquitetura

Arquivo:

```text
COMPOSE_ARCHITECTURE.md
```

Inclua:

- diagrama;
- serviços;
- portas;
- listeners;
- rede;
- DNS;
- volumes;
- fluxo de inicialização;
- limitações.

---

### 33. Documentar operação

Arquivo:

```text
COMPOSE_OPERATIONS.md
```

Inclua:

- config;
- build;
- up;
- ps;
- logs;
- exec;
- restart;
- stop;
- start;
- down;
- reset;
- troubleshooting inicial.

---

### 34. Documentar networking

Arquivo:

```text
COMPOSE_NETWORKING.md
```

Tabela:

```markdown
| Origem | Destino | Endereço |
|---|---|---|
| app | Kafka | kafka:29092 |
| host | Kafka | localhost:9092 |
| host | app | localhost:8084 |
| app | provider fake interno | app:8084 |
```

Explique por que:

```text
localhost
não identifica
outro serviço.
```

---

### 35. Documentar lifecycle de dados

Arquivo:

```text
COMPOSE_DATA_LIFECYCLE.md
```

Tabela:

```markdown
| Comando | Containers | Rede | Volumes |
|---|---|---|---|
| stop | Mantém | Mantém | Mantém |
| start | Reutiliza | Reutiliza | Reutiliza |
| down | Remove | Remove | Mantém |
| down --volumes | Remove | Remove | Remove |
```

---

### 36. Criar troubleshooting

Arquivo:

```text
COMPOSE_TROUBLESHOOTING.md
```

Inclua:

- YAML inválido;
- interpolação ausente;
- porta ocupada;
- imagem Kafka indisponível;
- app inicia antes de Kafka;
- advertised listener incorreto;
- topic ausente;
- volume sem permissão;
- restart loop;
- config com segredo;
- project name diferente;
- rede não encontrada;
- app não saudável;
- build cache antigo;
- `down -v` acidental.

---

### 37. Executar validação completa

Com a stack ativa:

```powershell
.\scripts\compose\verify-stack.ps1
```

Depois, execute no host:

```powershell
.\mvnw.cmd clean verify
```

Finalize:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config

git diff --check
git status
```

---

## Entendendo o que foi feito

### A stack virou código versionado

As opções do `docker run` foram declaradas em YAML.

### App e Kafka ganharam uma rede comum

A aplicação utiliza DNS de serviço.

### Listeners Kafka ficaram contextuais

Container e host utilizam endereços diferentes.

### A imagem segura foi reutilizada

Compose não removeu o hardening da aula anterior.

### Volumes ganharam lifecycle explícito

Containers podem ser recriados sem apagar dados.

### Operação ficou padronizada

Build, start, logs, restart e down possuem comandos conhecidos.

### `depends_on` ganhou limite claro

Ordem de criação não foi confundida com readiness.

### `.env.example` documentou entradas

Nenhum segredo real foi versionado.

### Scripts reduziram erro manual

Operações repetidas ficaram verificáveis.

### A stack ficou pronta para externalizar configuração

A aula 510 aprofundará variables e secrets.

---

## Erros comuns importantes

### Usar `localhost` entre services

Cada container possui seu próprio loopback.

### Usar o listener do host dentro do app

O broker anuncia um endereço inadequado ao client interno.

### Publicar todas as portas

Serviços internos ficam expostos sem necessidade.

### Usar IP fixo de container

O IP muda após recriação.

### Usar `container_name`

Escala e nomes de projeto ficam mais rígidos sem necessidade.

### Considerar `depends_on` readiness

O processo pode existir sem estar pronto.

### Versionar `.env` com segredo

O valor entra no repositório.

### Usar `latest`

A stack pode mudar sem revisão.

### Executar `down --volumes` por rotina

Dados persistentes são apagados.

### Sobrescrever entrypoint

Sinais e inicialização podem quebrar.

### Remover hardening no Compose

A imagem segura perde parte da proteção operacional.

### Declarar deploy e esperar limites locais

A seção `deploy` possui semântica própria e não substitui os campos locais usados nesta aula.

---

## Comandos úteis

### Validar config

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

### Build

```powershell
docker compose `
  --env-file `
  ".env.example" `
  build
```

### Subir

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach
```

### Status

```powershell
docker compose `
  --env-file `
  ".env.example" `
  ps
```

### Logs

```powershell
docker compose `
  --env-file `
  ".env.example" `
  logs `
  --follow
```

### Executar comando

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  id
```

### Derrubar

```powershell
docker compose `
  --env-file `
  ".env.example" `
  down
```

---

## Exercício guiado

### Parte 1 — Projeto

Valide Compose e baseline.

### Parte 2 — Kafka

Declare KRaft e listeners.

### Parte 3 — App

Declare build, imagem e configuração.

### Parte 4 — Rede

Conecte os serviços por DNS.

### Parte 5 — Dados

Declare volumes.

### Parte 6 — Segurança

Preserve read-only e capabilities.

### Parte 7 — Operação

Execute build, up, logs e ps.

### Parte 8 — Jornada

Valide API e Kafka.

### Parte 9 — Lifecycle

Teste restart, down e volumes.

### Parte 10 — Automação

Crie scripts e documentação.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 508 foi preservada;
- Docker Compose foi validado;
- plugin sem hífen foi utilizado;
- `compose.yaml` foi criado;
- campo `version` legado não foi usado;
- project name foi definido;
- serviço Kafka foi criado;
- imagem Kafka possui tag explícita;
- KRaft foi configurado;
- node ID foi configurado;
- process roles foram configurados;
- controller listener foi configurado;
- broker listener foi configurado;
- host listener foi configurado;
- advertised listeners foram configurados;
- listener security map foi configurado;
- inter-broker listener foi configurado;
- quorum voters foram configurados;
- replication factor 1 foi usado apenas no laboratório;
- três partitions foram configuradas;
- diretório persistente de logs Kafka foi configurado;
- porta Kafka do host foi publicada;
- portas internas foram documentadas;
- volume Kafka foi criado;
- serviço app foi criado;
- build context foi definido;
- Dockerfile foi definido;
- target runtime foi definido;
- image tag foi definida;
- depends_on foi usado;
- limite de depends_on foi explicado;
- profile container foi configurado;
- server port foi configurado;
- app usa `kafka:29092`;
- banco usa `/data`;
- provider fake usa `app:8084`;
- porta da API foi publicada;
- volume app foi criado;
- tmpfs foi preservado;
- root filesystem read-only foi preservado;
- cap-drop ALL foi preservado;
- no-new-privileges foi preservado;
- PIDs limit foi preservado;
- memória foi limitada;
- CPU foi limitada;
- rede backend foi criada;
- DNS por service name foi usado;
- IP fixo não foi usado;
- container_name não foi usado;
- restart policy foi definida;
- volumes nomeados foram declarados;
- `.env.example` foi criado;
- `.env` real não foi versionado;
- nenhum segredo real foi incluído;
- configuração foi renderizada;
- services foram listados;
- app foi construída pelo Compose;
- testes do builder foram executados;
- stack foi iniciada;
- serviços foram inspecionados;
- logs foram acompanhados;
- DNS interno foi validado;
- Kafka interno foi validado;
- topics foram listados;
- topic foi criado quando necessário;
- responsabilidade pelo topic foi registrada;
- API foi acessada pelo host;
- smoke test foi executado;
- usuário não root foi validado;
- escrita em `/app` foi negada;
- escrita em `/tmp` foi validada;
- escrita em `/data` foi validada;
- volumes foram inspecionados;
- restart do app foi executado;
- recriação sem dependências foi testada;
- stop e start foram testados;
- down foi testado;
- dados persistiram após down;
- down --volumes foi tratado como destrutivo;
- script start foi criado;
- script verify foi criado;
- script stop foi criado;
- remoção de volume exige confirmação;
- arquitetura foi documentada;
- operação foi documentada;
- networking foi documentado;
- lifecycle dos dados foi documentado;
- troubleshooting foi criado;
- secrets avançados não foram antecipados;
- healthcheck dedicado não foi antecipado;
- scaling não foi antecipado;
- pipeline não foi antecipado;
- Kubernetes não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 510 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.env.example `
  scripts/compose `
  docs/devops/compose `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "build(m17): orquestrar API com Docker Compose"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- `.env`;
- token real;
- senha real;
- volume;
- banco;
- logs;
- imagens exportadas;
- tar;
- cache;
- arquivos temporários;
- healthcheck da aula 511;
- secrets da aula 510.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a execução manual da aplicação e do Kafka foi transformada em uma stack Compose versionada.

A arquitetura passou a ser:

```text
Compose project;

service app;

service Kafka;

network backend;

app_data;

kafka_data.
```

Você comprovou que:

- service é uma declaração lógica;
- container é uma instância;
- build e image podem trabalhar juntos;
- target seleciona o estágio runtime;
- `ports` publica no host;
- `expose` documenta portas internas;
- DNS utiliza o nome do serviço;
- `localhost` não conecta containers diferentes;
- app usa `kafka:29092`;
- host usa `localhost:9092`;
- volumes sobrevivem à recriação;
- `down` preserva volumes;
- `down --volumes` apaga dados;
- Compose reutiliza o hardening da imagem;
- `depends_on` não é readiness;
- scripts tornam a operação repetível;
- `docker compose config` mostra a configuração efetiva.

A próxima aula será:

```text
510 - M17.05 - Variaveis secrets e configuracao
```

Nela, você irá:

- classificar configuração;
- separar valores sensíveis;
- revisar `.env`;
- revisar `env_file`;
- usar interpolação;
- aplicar precedência;
- evitar segredos em metadata;
- utilizar arquivos montados;
- preparar padrão `_FILE`;
- documentar rotação;
- validar ausência de vazamento.

Nenhum mecanismo avançado de secrets foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o Compose.
- [ ] Declarei app e Kafka.
- [ ] Configurei rede e listeners.
- [ ] Preservei a imagem segura.
- [ ] Declarei volumes.
- [ ] Validei DNS e API.
- [ ] Testei lifecycle da stack.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `docker compose` não existe

Atualize ou habilite o plugin Compose compatível com o Docker instalado.

### YAML não renderiza

Execute `docker compose config` e revise indentação e interpolação.

### Kafka inicia e app não conecta

Revise `kafka:29092`, advertised listener e logs do broker.

### Host não conecta ao Kafka

Revise `localhost:9092`, porta publicada e listener HOST.

### App usa `localhost:9092`

O endereço aponta para o próprio container.

### Porta 8084 está ocupada

Altere `APP_HOST_PORT`, não a porta interna sem necessidade.

### O volume não persiste

Confirme named volume e caminho `/data`.

### App fica em restart loop

Consulte logs antes de repetir restart.

### `depends_on` não resolveu

O broker ainda não está pronto; healthcheck será aprofundado na aula 511.

### `.env.example` funciona, mas `.env` não

Revise caminho, sintaxe, precedência e valores vazios.

### `down` removeu rede

Esse é o comportamento esperado; `up` recria.

### `down --volumes` apagou dados

O comando é explicitamente destrutivo.

---

## Perguntas de revisão

1. O que é um projeto Compose?
2. O que é um service?
3. Service é igual a container?
4. O que faz `build.target`?
5. O que faz `ports`?
6. O que faz `expose`?
7. Como serviços se encontram?
8. Por que não usar IP fixo?
9. Qual endereço app usa para Kafka?
10. Qual endereço o host usa?
11. O que é KRaft?
12. Para que servem listeners?
13. O que faz `depends_on`?
14. Ele garante readiness?
15. O que é named volume?
16. O que `down` remove?
17. O que `down --volumes` remove?
18. `.env` é um cofre?
19. Para que serve `docker compose config`?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Grupo de recursos Compose.
2. Declaração de um componente.
3. Não.
4. Selecionar estágio do Dockerfile.
5. Publicar porta no host.
6. Documentar porta interna.
7. DNS pelo nome do service.
8. IP muda.
9. kafka:29092.
10. localhost:9092.
11. Kafka sem ZooKeeper.
12. Definir endpoints de comunicação.
13. Ordem de dependência.
14. Não.
15. Persistência gerenciada pelo Docker.
16. Containers e rede.
17. Também volumes.
18. Não.
19. Renderizar configuração efetiva.
20. Variaveis secrets e configuracao.

---

## Desafio opcional

Adicione uma segunda instância lógica da aplicação para estudo.

Não use:

```text
container_name.
```

Antes de escalar, responda:

- quantas partitions existem?
- como o consumer group distribui trabalho?
- a porta do host pode ser a mesma?
- o banco H2 em volume pode ser compartilhado?
- o provider fake interno possui estado local?
- quais componentes impedem scale horizontal seguro?

O objetivo é identificar limitações.

Não transforme o desafio em aula de scaling ou Kubernetes.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 509 - M17.04 - Docker Compose para API completa

- Continuei após o hardening da imagem.
- Validei o plugin `docker compose`.
- Criei `compose.yaml`.
- Não usei o campo legado `version`.
- Defini o projeto `m17-compose`.
- Declarei o serviço Kafka.
- Configurei Kafka em KRaft.
- Configurei listeners CONTROLLER, BROKER e HOST.
- Configurei advertised listeners internos e externos.
- Publiquei Kafka para o host.
- Criei volume do Kafka.
- Declarei o serviço app.
- Reutilizei o Dockerfile multi-stage.
- Selecionei o target runtime.
- Mantive uma tag explícita.
- Configurei `kafka:29092` para a aplicação.
- Publiquei a API em 8084.
- Criei volume `app_data`.
- Preservei rootfs read-only.
- Preservei tmpfs.
- Preservei cap-drop ALL.
- Preservei no-new-privileges.
- Preservei limites de recursos.
- Criei a rede `backend`.
- Usei DNS pelo nome dos serviços.
- Não usei IP fixo.
- Não usei `container_name`.
- Criei `.env.example`.
- Mantive `.env` fora do Git.
- Renderizei a configuração.
- Construí a app pelo Compose.
- Iniciei a stack.
- Inspecionei serviços e logs.
- Validei Kafka e API.
- Executei smoke test.
- Validei volumes e persistência.
- Testei restart, stop, start e down.
- Tratei `down --volumes` como destrutivo.
- Criei scripts de start, verify e stop.
- Documentei arquitetura, rede, operação e dados.
- Não antecipei secrets ou healthchecks.
- Próxima aula: Variaveis secrets e configuracao.
```

---

## Referência técnica curta

- Docker Compose Specification.
- Docker Compose Services.
- Docker Compose Networking.
- Docker Compose Volumes.
- Docker Compose Environment Variables.
- Docker Compose CLI.
- Apache Kafka KRaft.
- Kafka Listeners.
- Docker DNS.
- Spring Boot Externalized Configuration.

Regra final:

```text
o Docker Compose para a API completa transforma comandos manuais em uma stack declarativa: o projeto `m17-compose` define os serviços `app` e `kafka`, uma rede `backend` e volumes nomeados para H2 e Kafka; o broker KRaft anuncia `kafka:29092` para clients internos e `localhost:9092` para o host, enquanto a API é construída pelo target runtime da imagem multi-stage, publicada em 8084 e mantém usuário não root, root filesystem read-only, tmpfs, volume, capabilities removidas, no-new-privileges e limites; DNS por nome de service substitui IP e localhost entre containers; `docker compose config`, build, up, ps, logs, exec, restart, stop, start e down formam o ciclo operacional, volumes sobrevivem ao down e somente `down --volumes` remove dados; `depends_on` expressa ordem, não readiness; `.env.example` documenta entradas sem ser cofre; scripts e documentação tornam a stack reproduzível e preparam a separação entre variáveis, configuração e secrets da aula 510.
```
