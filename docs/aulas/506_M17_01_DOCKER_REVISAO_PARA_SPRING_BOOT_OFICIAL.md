# 506 - M17.01 - Docker revisao para Spring Boot

## Apresentação da aula

Esta aula inicia oficialmente o Módulo 17:

```text
DevOps,
CI/CD,
Kubernetes
e Cloud.
```

O Módulo 16 encerrou com uma aplicação Spring Boot capaz de executar uma jornada completa de integrações:

```text
HTTP;

transação local;

Outbox;

Kafka;

Inbox;

workers;

provider HTTP;

retry;

quarantine;

correlação;

métricas.
```

Até agora, a execução aconteceu principalmente a partir do ambiente de desenvolvimento:

```text
IntelliJ;

Maven Wrapper;

JDK instalado;

Docker usado como dependência;

comandos executados manualmente.
```

O novo módulo começa com uma mudança de perspectiva.

A pergunta deixa de ser apenas:

```text
o código funciona?
```

Ela passa a incluir:

```text
o mesmo artefato
pode ser construído
e executado
de forma reproduzível
em outro ambiente?
```

Docker ajuda a empacotar:

- runtime Java;
- aplicação;
- dependências de sistema;
- comando de inicialização;
- usuário do processo;
- diretório de trabalho;
- portas;
- configuração de execução.

O resultado é uma imagem.

A imagem pode iniciar um ou mais containers.

Nesta aula, você fará uma revisão prática dos fundamentos necessários para executar a aplicação Spring Boot do Módulo 16 em um container.

O foco será:

```text
imagem;

container;

camadas;

build context;

Dockerfile;

.dockerignore;

JAR executável;

configuração externa;

port mapping;

volume;

logs;

processo;

usuário não root;

health;

shutdown;

troubleshooting.
```

O Dockerfile será deliberadamente simples.

O build do JAR continuará acontecendo com o Maven Wrapper no host:

```text
.\mvnw.cmd clean verify
```

Depois, o Docker copiará o JAR pronto para uma imagem com Java Runtime.

Essa decisão cria uma separação clara:

```text
host:
compila e testa.

Docker:
empacota e executa.
```

Na aula seguinte, essa limitação será removida com um Dockerfile multi-stage:

```text
507 - M17.02 - Dockerfile multi stage avancado
```

Portanto, esta aula não antecipará:

- build Maven dentro da imagem;
- cache avançado de dependências;
- BuildKit mounts;
- distroless;
- layered JAR avançado;
- SBOM;
- assinatura de imagem;
- scan de vulnerabilidade;
- publicação em registry;
- pipeline CI;
- Kubernetes.

O objetivo desta revisão é garantir que os fundamentos estejam sólidos antes de avançar.

Ao final, você deverá explicar:

```text
a diferença entre imagem
e container;

por que a imagem
deve ser imutável;

por que configuração
fica fora da imagem;

por que logs vão
para stdout e stderr;

por que o filesystem
do container é efêmero;

por que a aplicação
não deve executar como root;

como o host acessa
a porta do container;

como o container acessa
Kafka e outras dependências;

como validar health;

como parar a aplicação
sem perder trabalho.
```

---

## Onde estamos na formação

A transição oficial é:

```text
505:
Fechamento do Modulo 16.

506:
Docker revisao para Spring Boot.

507:
Dockerfile multi stage avancado.

508:
Imagens enxutas.

509:
Docker Compose aplicado.
```

A aula 505 respondeu:

```text
o projeto de integrações
está validado,
documentado
e pronto para transição?
```

A aula 506 responderá:

```text
como transformar
o JAR validado
em uma imagem executável
e configurável?
```

Nesta aula:

```text
baseline Maven:
sim.

JAR executável:
sim.

Dockerfile simples:
sim.

.dockerignore:
sim.

imagem:
sim.

container:
sim.

usuário não root:
sim.

porta:
sim.

variáveis de ambiente:
sim.

volume:
sim.

logs:
sim.

health:
sim.

shutdown:
sim.

Kafka externo:
sim.

multi-stage:
não.

imagem enxuta avançada:
não.

Compose completo:
não.

registry:
não.

CI/CD:
não.

Kubernetes:
não.
```

A regra central será:

```text
a imagem contém
a aplicação e o runtime;

o ambiente fornece
configuração,
rede,
dados
e segredos.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão adicionados:

```text
Dockerfile
.dockerignore
src/main/resources/application-container.yaml
docs/devops/docker/DOCKER_REVIEW.md
docs/devops/docker/CONTAINER_CONFIGURATION.md
docs/devops/docker/CONTAINER_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
JAR validado;

imagem local;

container executando;

porta publicada;

profile container;

configuração externa;

volume de dados;

health validado;

logs inspecionados;

shutdown testado.
```

Você irá:

1. validar Docker;
2. validar a baseline Maven;
3. localizar o JAR;
4. revisar imagem e container;
5. revisar camadas;
6. criar `.dockerignore`;
7. criar Dockerfile simples;
8. executar como usuário não root;
9. definir diretório de trabalho;
10. copiar o JAR;
11. definir entrypoint;
12. criar profile `container`;
13. externalizar Kafka;
14. externalizar banco;
15. externalizar provider;
16. externalizar porta;
17. construir a imagem;
18. inspecionar a imagem;
19. criar volume;
20. iniciar o container;
21. validar health;
22. validar logs;
23. validar configuração;
24. testar persistência;
25. testar parada;
26. testar restart;
27. documentar troubleshooting;
28. executar o gate;
29. commitar;
30. preparar o multi-stage.

---

## Conceito essencial

### Imagem

Imagem é um artefato imutável usado para criar containers.

Ela contém:

- filesystem;
- runtime;
- aplicação;
- metadata;
- comando padrão;
- camadas.

A imagem não é um processo em execução.

---

### Container

Container é uma instância de uma imagem.

Ele possui:

- processo;
- namespace;
- rede;
- filesystem gravável;
- variáveis de ambiente;
- limites;
- estado de execução.

A mesma imagem pode iniciar vários containers.

---

### Imutabilidade

Uma imagem deve ser reconstruída quando o código muda.

Evite:

```text
entrar no container;

editar arquivo;

instalar pacote manualmente;

considerar aquilo
uma nova versão.
```

Mudança reproduzível acontece no Dockerfile e no build.

---

### Camadas

Cada instrução relevante do Dockerfile produz ou reutiliza camadas.

Exemplos:

```dockerfile
FROM
COPY
RUN
```

Camadas permitem cache e distribuição incremental.

Nesta aula, o JAR será uma camada única da aplicação.

A aula 507 aprofundará otimização de camadas.

---

### Build context

O comando:

```powershell
docker build .
```

envia um contexto para o daemon ou builder.

Se o contexto inclui:

- `.git`;
- logs;
- banco;
- `target/classes`;
- IDE;
- secrets;

o build fica maior, mais lento e arriscado.

`.dockerignore` controla esse envio.

---

### JAR executável

Spring Boot gera um JAR capaz de iniciar com:

```powershell
java -jar app.jar
```

O Dockerfile não precisa copiar o código-fonte quando o JAR já foi construído.

---

### Base image

A base fornecerá Java 21 Runtime.

A aplicação não precisa de compilador em runtime.

Nesta revisão, será usada uma imagem JRE do Eclipse Temurin.

A versão major precisa ser compatível com o bytecode compilado.

---

### Usuário não root

O processo da aplicação não deve depender de privilégios de root.

Nesta aula, será usado um UID numérico sem privilégios:

```text
10001.
```

O JAR precisa permanecer legível para esse usuário.

---

### ENTRYPOINT

`ENTRYPOINT` define o processo principal.

Será utilizado o formato exec:

```dockerfile
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Esse formato evita uma shell intermediária desnecessária e facilita o encaminhamento de sinais ao processo Java.

---

### PID 1

O processo principal do container ocupa o papel de PID 1 dentro do namespace.

Ele precisa receber sinais de encerramento.

Spring Boot deve ter tempo para:

- parar listeners;
- interromper novos trabalhos;
- concluir operações;
- liberar recursos;
- fechar o contexto.

---

### Configuração externa

A imagem não deve incorporar valores específicos de ambiente.

Exemplos externos:

- Kafka bootstrap servers;
- URL do banco;
- usuário;
- senha;
- provider URL;
- token;
- porta;
- timeouts;
- profile.

A mesma imagem deve servir para:

```text
local;

homologação;

produção.
```

---

### Variáveis de ambiente

Spring Boot consegue mapear variáveis para propriedades.

Exemplo:

```text
KAFKA_BOOTSTRAP_SERVERS
```

pode alimentar:

```yaml
spring.kafka.bootstrap-servers.
```

A configuração explícita no profile deixa o contrato operacional claro.

---

### Port mapping

A aplicação escuta dentro do container.

Exemplo:

```text
container:
8084.
```

O host pode publicar:

```text
host 8084
-> container 8084.
```

Comando:

```powershell
-p 8084:8084
```

A primeira porta é a do host.

---

### Rede do container

`localhost` dentro do container aponta para o próprio container.

Ele não aponta para:

- Windows host;
- outro container;
- broker externo.

No Docker Desktop, `host.docker.internal` pode representar o host.

Em redes Docker, serviços podem usar nomes DNS de containers ou serviços.

---

### Kafka e advertised listeners

Kafka devolve ao client os endereços anunciados pelo broker.

Não basta o bootstrap server ser alcançável.

Os listeners anunciados também precisam ser acessíveis a partir do container da aplicação.

Um broker que anuncia:

```text
localhost:9092
```

pode funcionar no host e falhar dentro de outro container.

---

### Filesystem efêmero

O filesystem gravável do container pode desaparecer quando o container é removido.

Dados importantes precisam ir para:

- volume;
- banco externo;
- object storage;
- serviço persistente.

Nesta aula, o banco de laboratório poderá usar `/data`.

---

### Logs

Containers devem escrever logs em:

```text
stdout;

stderr.
```

O runtime coleta esses streams.

Evite depender de arquivo local não montado.

Comando:

```powershell
docker logs
```

---

### Health

Health responde se a aplicação está em condição conhecida.

Spring Boot Actuator fornecerá:

```text
/actuator/health;

liveness;

readiness.
```

Nesta aula, a validação será feita a partir do host.

Um `HEALTHCHECK` embutido será discutido, mas a implementação avançada será deixada para a evolução do runtime.

---

## Mão na massa guiada

### 1. Validar o Docker

Execute:

```powershell
docker version
```

Depois:

```powershell
docker info
```

Confirme:

- client;
- server;
- engine ativo;
- sistema operacional do daemon;
- espaço disponível.

Liste containers:

```powershell
docker ps -a
```

---

### 2. Confirmar a baseline do projeto

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

A imagem não deve esconder testes quebrados.

---

### 3. Localizar o JAR

```powershell
Get-ChildItem `
  "target" `
  -Filter "*.jar" `
  -File
```

Confirme que existe um JAR executável.

Teste no host:

```powershell
java -jar `
  "target/<jar-gerado>.jar" `
  --spring.profiles.active=container
```

Substitua o nome pelo arquivo real exibido pelo comando anterior.

Interrompa após validar a inicialização.

---

### 4. Criar `.dockerignore`

Arquivo:

```text
.dockerignore
```

Conteúdo:

```dockerignore
.git
.github
.idea
.vscode
*.iml

.env
*.log
logs
data

docs
src/test

target/*
!target/*.jar

Dockerfile*
!Dockerfile
compose*.yaml
```

O JAR continua no contexto.

Arquivos de build intermediários ficam fora.

Se o projeto precisar de algum item ignorado, revise conscientemente.

---

### 5. Criar o Dockerfile simples

Arquivo:

```text
Dockerfile
```

Conteúdo:

```dockerfile
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8084

USER 10001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Observações:

- não há Maven na imagem;
- não há código-fonte;
- não há token;
- não há profile fixo;
- o JAR é o único artefato da aplicação;
- a aplicação executa sem root.

O formato exec mantém o processo Java como processo principal do container e evita uma shell intermediária desnecessária.

---

### 6. Criar profile de container

Arquivo:

```text
src/main/resources/application-container.yaml
```

Conteúdo:

```yaml
server:
  port: "${SERVER_PORT:8084}"

spring:
  kafka:
    bootstrap-servers:
      "${KAFKA_BOOTSTRAP_SERVERS:host.docker.internal:9092}"

  datasource:
    url:
      "${DB_URL:jdbc:h2:file:/data/m16-integrations}"

    username:
      "${DB_USERNAME:sa}"

    password:
      "${DB_PASSWORD:}"

management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
          - prometheus

  endpoint:
    health:
      probes:
        enabled: true

app:
  notification:
    provider:
      base-url:
        "${FAKE_NOTIFICATION_API_BASE_URL:http://127.0.0.1:8084}"

      token:
        "${FAKE_NOTIFICATION_API_TOKEN:lab-only-token}"

      connect-timeout:
        "${FAKE_NOTIFICATION_CONNECT_TIMEOUT:500ms}"

      read-timeout:
        "${FAKE_NOTIFICATION_READ_TIMEOUT:1s}"
```

Os nomes precisam coincidir com as propriedades reais do projeto.

Não copie um token real.

---

### 7. Revisar graceful shutdown

No profile comum ou de container, confirme:

```yaml
server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
```

O valor é didático.

O tempo real precisa considerar workers e timeouts externos.

---

### 8. Construir novamente o JAR

Depois de adicionar o profile:

```powershell
.\mvnw.cmd clean verify
```

Confirme o novo JAR.

---

### 9. Construir a imagem

Use uma tag explícita:

```powershell
docker build `
  --tag `
  "formacao-java/m16-integrations:1.0.0" `
  .
```

Não use apenas:

```text
latest.
```

Tags explícitas facilitam comparação.

---

### 10. Listar a imagem

```powershell
docker image ls `
  "formacao-java/m16-integrations"
```

Inspecione:

```powershell
docker image inspect `
  "formacao-java/m16-integrations:1.0.0"
```

Observe:

- ID;
- tags;
- tamanho;
- architecture;
- config;
- entrypoint;
- user;
- exposed ports.

---

### 11. Revisar o histórico de camadas

```powershell
docker history `
  "formacao-java/m16-integrations:1.0.0"
```

Identifique:

- base;
- workdir;
- JAR;
- metadata.

Na próxima aula, o build será dividido em estágios.

---

### 12. Criar volume

```powershell
docker volume create `
  "m16-integrations-data"
```

Inspecione:

```powershell
docker volume inspect `
  "m16-integrations-data"
```

---

### 13. Confirmar Kafka

Se o broker do laboratório já existe:

```powershell
docker start `
  "m16-kafka"
```

Confirme a porta:

```powershell
docker ps `
  --filter `
  "name=m16-kafka"
```

O broker precisa ser alcançável a partir do container da aplicação.

---

### 14. Iniciar o container

```powershell
docker run `
  --detach `
  --name `
  "m16-integrations-app" `
  --publish `
  "8084:8084" `
  --add-host `
  "host.docker.internal:host-gateway" `
  --env `
  "SPRING_PROFILES_ACTIVE=container" `
  --env `
  "KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092" `
  --env `
  "DB_URL=jdbc:h2:file:/data/m16-integrations" `
  --env `
  "FAKE_NOTIFICATION_API_BASE_URL=http://127.0.0.1:8084" `
  --mount `
  "type=volume,source=m16-integrations-data,target=/data" `
  "formacao-java/m16-integrations:1.0.0"
```

O container inicia em background.

---

### 15. Acompanhar logs

```powershell
docker logs `
  --follow `
  "m16-integrations-app"
```

Confirme:

- profile container;
- porta;
- conexão com banco;
- conexão Kafka;
- Actuator;
- ausência de segredo;
- ausência de loop de erro.

Interrompa o follow com `Ctrl+C`.

O container continua ativo.

---

### 16. Validar o processo

```powershell
docker top `
  "m16-integrations-app"
```

Confirme o processo Java.

Inspecione o usuário:

```powershell
docker inspect `
  --format `
  "{{.Config.User}}" `
  "m16-integrations-app"
```

Resultado esperado:

```text
10001.
```

---

### 17. Validar health

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health"
```

Depois:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health/liveness"
```

E:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health/readiness"
```

Registre diferenças.

---

### 18. Validar a porta

Liste:

```powershell
docker port `
  "m16-integrations-app"
```

Confirme:

```text
8084/tcp
-> host 8084.
```

---

### 19. Inspecionar variáveis sem expor segredo

```powershell
docker inspect `
  --format `
  "{{range .Config.Env}}{{println .}}{{end}}" `
  "m16-integrations-app" |
  Select-String `
  "SPRING_PROFILES_ACTIVE|KAFKA_BOOTSTRAP_SERVERS|DB_URL"
```

Não imprima tokens em evidências compartilhadas.

---

### 20. Executar smoke test

Crie uma OS com dados fictícios.

Use o endpoint já existente no projeto.

Confirme:

- response HTTP;
- logs;
- Outbox;
- Kafka;
- Inbox;
- intent;
- provider fake.

A jornada deve funcionar dentro do container.

---

### 21. Validar métricas

```powershell
(
  Invoke-WebRequest `
    "http://localhost:8084/actuator/prometheus"
).Content |
  Select-String `
    "integration_"
```

Confirme que o empacotamento não removeu instrumentação.

---

### 22. Validar persistência no volume

Crie dados pelo endpoint.

Pare:

```powershell
docker stop `
  "m16-integrations-app"
```

Remova:

```powershell
docker rm `
  "m16-integrations-app"
```

Inicie novamente com o mesmo volume.

Confirme que os dados persistidos continuam disponíveis.

---

### 23. Validar filesystem efêmero

Crie um arquivo temporário dentro do container:

```powershell
docker exec `
  "m16-integrations-app" `
  sh `
  -c `
  "echo ephemeral > /tmp/container-test.txt"
```

Remova e recrie o container.

Confirme que `/tmp/container-test.txt` desapareceu.

O volume `/data` permanece.

---

### 24. Validar shutdown

Acompanhe logs.

Execute:

```powershell
docker stop `
  --time `
  30 `
  "m16-integrations-app"
```

Observe:

- sinal recebido;
- contexto Spring encerrado;
- listeners parados;
- pool fechado;
- processo finalizado.

Não use `docker kill` como caminho normal.

---

### 25. Validar restart

```powershell
docker start `
  "m16-integrations-app"
```

Confirme health novamente.

---

### 26. Inspecionar consumo

```powershell
docker stats `
  "m16-integrations-app"
```

Observe:

- CPU;
- memória;
- rede;
- block I/O;
- PIDs.

Não transforme o snapshot em capacity planning.

---

### 27. Criar documentação de revisão

Arquivo:

```text
docs/devops/docker/DOCKER_REVIEW.md
```

Inclua:

- imagem;
- container;
- camadas;
- build context;
- Dockerfile;
- porta;
- volume;
- logs;
- health;
- shutdown;
- limitações.

---

### 28. Criar contrato de configuração

Arquivo:

```text
CONTAINER_CONFIGURATION.md
```

Tabela:

```markdown
| Variável | Obrigatória | Padrão de laboratório | Sensível |
|---|---:|---|---:|
| SPRING_PROFILES_ACTIVE | Sim | container | Não |
| SERVER_PORT | Não | 8084 | Não |
| KAFKA_BOOTSTRAP_SERVERS | Sim | host.docker.internal:9092 | Não |
| DB_URL | Sim | jdbc:h2:file:/data/... | Não |
| DB_USERNAME | Não | sa | Não |
| DB_PASSWORD | Ambiente real | vazio no lab | Sim |
| FAKE_NOTIFICATION_API_BASE_URL | Sim | loopback | Não |
| FAKE_NOTIFICATION_API_TOKEN | Ambiente real | lab-only-token | Sim |
```

Não registre valores produtivos.

---

### 29. Criar troubleshooting

Arquivo:

```text
CONTAINER_TROUBLESHOOTING.md
```

Inclua:

- Docker daemon indisponível;
- JAR ausente;
- `COPY` encontra vários JARs;
- porta ocupada;
- container reinicia;
- Kafka inacessível;
- advertised listener incorreto;
- banco sem permissão;
- volume não montado;
- health DOWN;
- usuário sem acesso;
- token exposto;
- shutdown lento.

---

### 30. Executar gate final

Pare o container quando necessário.

Execute no projeto:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
git diff --check
git status
```

---

### 31. Validar a reprodutibilidade

Remova somente o container e a imagem local da aplicação.

Preserve o código e o volume.

Reconstrua:

```powershell
.\mvnw.cmd clean verify

docker build `
  --tag `
  "formacao-java/m16-integrations:1.0.0" `
  .
```

Inicie novamente com o mesmo conjunto documentado de variáveis.

Confirme:

- mesmo entrypoint;
- mesmo profile;
- mesmos endpoints;
- mesmos contratos;
- mesma configuração externa;
- mesmos dados persistidos no volume;
- mesmos testes verdes.

Essa repetição valida que o resultado depende de arquivos versionados e comandos documentados, não de alterações manuais feitas em um container anterior.

Registre o comando completo em `DOCKER_REVIEW.md`.

---

## Entendendo o que foi feito

### O JAR virou uma imagem

A aplicação ganhou um formato reproduzível de execução.

### Imagem e ambiente foram separados

Configuração deixou de ser parte fixa do artefato.

### O container executa sem root

O processo possui menor privilégio.

### A porta ficou explícita

Host e container possuem namespaces diferentes.

### Dados persistentes saíram do filesystem efêmero

O volume protege o banco de laboratório.

### Logs permaneceram no stream

`docker logs` consegue coletar a saída.

### Health continuou disponível

Actuator sobreviveu ao empacotamento.

### Shutdown foi tratado como requisito

Parar um container não é interromper arbitrariamente o processo.

### Kafka revelou o problema de rede

Bootstrap e advertised listeners precisam ser alcançáveis.

### A limitação do build ficou clara

O JAR ainda depende de um build anterior no host.

Essa limitação será resolvida na aula 507.

---

## Erros comuns importantes

### Confundir imagem com container

Imagem é artefato; container é execução.

### Copiar o repositório inteiro

Contexto, imagem e risco aumentam.

### Ignorar `.dockerignore`

Arquivos desnecessários chegam ao builder.

### Usar JDK completo sem necessidade

O runtime fica maior que o necessário.

### Executar como root

A superfície de impacto aumenta.

### Colocar token no Dockerfile

O segredo entra na imagem e nas camadas.

### Usar localhost para Kafka externo

O container tenta acessar a si mesmo.

### Mapear porta invertida

A sintaxe é `host:container`.

### Gravar dados no filesystem efêmero

A remoção do container elimina o estado.

### Logar em arquivo interno

O runtime perde visibilidade ou exige volume adicional.

### Usar `docker kill` como rotina

O graceful shutdown não ocorre.

### Considerar `EXPOSE` como publicação

`EXPOSE` documenta; `-p` publica.

---

## Comandos úteis

### Construir JAR

```powershell
.\mvnw.cmd clean verify
```

### Construir imagem

```powershell
docker build `
  -t `
  "formacao-java/m16-integrations:1.0.0" `
  .
```

### Iniciar container

```powershell
docker start `
  "m16-integrations-app"
```

### Ver logs

```powershell
docker logs `
  -f `
  "m16-integrations-app"
```

### Inspecionar

```powershell
docker inspect `
  "m16-integrations-app"
```

### Parar

```powershell
docker stop `
  --time `
  30 `
  "m16-integrations-app"
```

### Remover

```powershell
docker rm `
  "m16-integrations-app"
```

### Remover imagem

```powershell
docker image rm `
  "formacao-java/m16-integrations:1.0.0"
```

---

## Exercício guiado

### Parte 1 — Baseline

Valide Docker e Maven.

### Parte 2 — Contexto

Crie `.dockerignore`.

### Parte 3 — Imagem

Crie o Dockerfile.

### Parte 4 — Configuração

Crie o profile container.

### Parte 5 — Build

Gere JAR e imagem.

### Parte 6 — Execução

Inicie com porta, env e volume.

### Parte 7 — Health

Valide Actuator.

### Parte 8 — Persistência

Remova e recrie o container.

### Parte 9 — Shutdown

Valide parada graciosa.

### Parte 10 — Documentação

Registre configuração e troubleshooting.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- Módulo 17 foi iniciado corretamente;
- continuidade com a aula 505 foi preservada;
- Docker client foi validado;
- Docker server foi validado;
- baseline Maven foi executada;
- JAR executável foi localizado;
- JAR foi testado no host;
- imagem foi definida;
- container foi definido;
- imutabilidade foi explicada;
- camadas foram explicadas;
- build context foi explicado;
- `.dockerignore` foi criado;
- `.git` foi ignorado;
- arquivos de IDE foram ignorados;
- secrets foram ignorados;
- JAR permaneceu no contexto;
- Dockerfile simples foi criado;
- base Java 21 Runtime foi usada;
- WORKDIR foi definido;
- ARG JAR_FILE foi definido;
- JAR foi copiado como app.jar;
- EXPOSE 8084 foi declarado;
- usuário 10001 foi definido;
- ENTRYPOINT exec foi usado;
- Maven não foi instalado na imagem;
- código-fonte não foi copiado;
- profile container foi criado;
- porta foi externalizada;
- Kafka foi externalizado;
- banco foi externalizado;
- provider URL foi externalizada;
- token foi externalizado;
- timeouts foram externalizados;
- graceful shutdown foi configurado;
- JAR foi reconstruído;
- imagem recebeu tag explícita;
- imagem foi construída;
- imagem foi listada;
- imagem foi inspecionada;
- usuário da imagem foi verificado;
- histórico de camadas foi inspecionado;
- volume foi criado;
- volume foi inspecionado;
- Kafka foi iniciado;
- rede entre container e host foi explicada;
- `host.docker.internal` foi utilizado;
- advertised listeners foram explicados;
- container foi iniciado em background;
- porta 8084 foi publicada;
- env vars foram passadas;
- volume `/data` foi montado;
- logs foram acompanhados;
- processo Java foi inspecionado;
- usuário não root foi confirmado;
- health foi validado;
- liveness foi validada;
- readiness foi validada;
- port mapping foi validado;
- configuração foi inspecionada sem token;
- smoke test foi executado;
- métricas foram validadas;
- persistência em volume foi validada;
- filesystem efêmero foi demonstrado;
- shutdown gracioso foi validado;
- restart foi validado;
- docker stats foi inspecionado;
- documentação de revisão foi criada;
- contrato de configuração foi criado;
- troubleshooting foi criado;
- multi-stage não foi antecipado;
- imagem enxuta avançada não foi antecipada;
- Compose completo não foi antecipado;
- CI/CD não foi antecipado;
- Kubernetes não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 507 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/Dockerfile `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.dockerignore `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-container.yaml `
  docs/devops/docker `
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
git commit -m "build(m17): revisar Docker para Spring Boot"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- senha real;
- `.env`;
- banco H2;
- volume;
- logs;
- target;
- imagem exportada;
- tar de container;
- Dockerfile multi-stage;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o Módulo 17 foi iniciado com uma revisão prática de Docker aplicada ao projeto real de integrações.

A sequência foi:

```text
JAR validado;

Dockerfile;

imagem;

container;

configuração;

porta;

volume;

logs;

health;

shutdown.
```

Você comprovou que:

- imagem e container são conceitos diferentes;
- a imagem deve ser reproduzível e imutável;
- o build context precisa ser controlado;
- `.dockerignore` reduz risco e volume;
- o runtime não precisa do código-fonte;
- a aplicação pode executar sem root;
- configuração pertence ao ambiente;
- `localhost` depende do namespace;
- Kafka exige listeners alcançáveis;
- dados importantes precisam de volume ou serviço externo;
- logs devem sair por stdout e stderr;
- health continua necessário;
- shutdown gracioso faz parte da confiabilidade.

A limitação atual ficou explícita:

```text
o JAR precisa ser
construído no host
antes do docker build.
```

A próxima aula será:

```text
507 - M17.02 - Dockerfile multi stage avancado
```

Nela, você irá:

- criar estágio de build;
- usar Maven Wrapper dentro do builder;
- separar build e runtime;
- melhorar cache;
- controlar dependências;
- validar artefato;
- reduzir acoplamento ao host;
- produzir imagem de forma reproduzível;
- preparar otimizações das imagens seguintes.

Nenhum Dockerfile multi-stage foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei Docker e Maven.
- [ ] Criei `.dockerignore`.
- [ ] Criei Dockerfile simples.
- [ ] Externalizei configuração.
- [ ] Construí imagem e container.
- [ ] Validei volume e logs.
- [ ] Validei health e shutdown.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `docker version` mostra apenas client

O daemon não está ativo ou acessível.

### O build não encontra o JAR

Execute Maven antes e revise `.dockerignore` e `ARG JAR_FILE`.

### Vários JARs são copiados

Remova artefatos extras ou configure um nome final único.

### A porta 8084 está ocupada

Use outra porta do host:

```powershell
-p 18084:8084
```

### O container encerra imediatamente

Consulte:

```powershell
docker logs m16-integrations-app
```

### Kafka não conecta

Revise bootstrap servers, porta publicada e advertised listeners.

### O container usa `localhost:9092`

Dentro do container, localhost aponta para ele mesmo.

### O banco retorna permissão negada

Confirme montagem e acesso ao diretório `/data` pelo UID 10001.

### Os dados desaparecem

O volume pode não ter sido montado no mesmo caminho.

### Health está DOWN

Revise dependências, profile, endpoints e logs.

### `docker stop` demora

Revise workers, timeout externo e `timeout-per-shutdown-phase`.

### Token aparece em `docker inspect`

Variáveis de ambiente são visíveis na metadata do container. Em ambientes reais, use mecanismo de secrets apropriado.

---

## Perguntas de revisão

1. O que é uma imagem?
2. O que é um container?
3. O que é uma camada?
4. O que é build context?
5. Para que serve `.dockerignore`?
6. Por que usar JRE?
7. Por que executar sem root?
8. O que faz WORKDIR?
9. O que faz EXPOSE?
10. O que faz `-p`?
11. O que é ENTRYPOINT?
12. Onde fica a configuração?
13. O que significa localhost no container?
14. Por que Kafka pode falhar mesmo com bootstrap correto?
15. O filesystem do container é persistente?
16. Para que serve volume?
17. Onde os logs devem ser escritos?
18. Por que validar health?
19. Por que usar graceful shutdown?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Artefato imutável.
2. Instância em execução.
3. Unidade do filesystem da imagem.
4. Arquivos enviados ao builder.
5. Excluir itens desnecessários.
6. Runtime não precisa compilar.
7. Reduzir privilégios.
8. Definir diretório de trabalho.
9. Documentar porta interna.
10. Publicar host para container.
11. Definir processo principal.
12. Fora da imagem.
13. O próprio container.
14. Listeners anunciados podem ser inacessíveis.
15. Não por padrão.
16. Persistir dados.
17. stdout e stderr.
18. Detectar condição da aplicação.
19. Encerrar trabalho com segurança.
20. Dockerfile multi stage avancado.

---

## Desafio opcional

Execute dois containers da mesma imagem.

Use:

```text
host 8084
-> container 8084.

host 8085
-> container 8084.
```

Requisitos:

- nomes diferentes;
- volumes diferentes;
- mesma tag de imagem;
- configuração externa;
- health independente;
- logs independentes;
- nenhuma alteração na imagem.

Observe que múltiplas instâncias do mesmo consumer group dividem partitions Kafka.

Não use essa execução como teste de carga.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 506 - M17.01 - Docker revisao para Spring Boot

- Iniciei oficialmente o Módulo 17.
- Revisei imagem e container.
- Revisei imutabilidade e camadas.
- Revisei build context.
- Validei Docker client e server.
- Executei a baseline Maven.
- Localizei o JAR executável.
- Criei `.dockerignore`.
- Mantive o JAR no contexto.
- Criei Dockerfile simples.
- Usei Java 21 Runtime.
- Defini WORKDIR.
- Copiei o JAR como app.jar.
- Declarei a porta 8084.
- Executei como usuário 10001.
- Usei ENTRYPOINT em formato exec.
- Criei profile `container`.
- Externalizei porta, Kafka e banco.
- Externalizei provider e timeouts.
- Configurei graceful shutdown.
- Construí uma imagem com tag explícita.
- Inspecionei imagem e camadas.
- Criei volume de dados.
- Iniciei o container.
- Publiquei a porta.
- Validei logs.
- Confirmei usuário não root.
- Validei health, liveness e readiness.
- Executei smoke test.
- Validei métricas.
- Demonstrei filesystem efêmero.
- Validei persistência com volume.
- Validei shutdown e restart.
- Documentei configuração e troubleshooting.
- Não implementei multi-stage antecipadamente.
- Próxima aula: Dockerfile multi stage avancado.
```

---

## Referência técnica curta

- Docker Images.
- Docker Containers.
- Dockerfile.
- Docker Build Context.
- `.dockerignore`.
- Docker Volumes.
- Docker Networking.
- Spring Boot Externalized Configuration.
- Spring Boot Actuator.
- Graceful Shutdown.

Regra final:

```text
a revisão de Docker para Spring Boot transforma o JAR validado do Módulo 16 em uma imagem reproduzível e um container configurável: `.dockerignore` limita o build context, o Dockerfile usa Java 21 Runtime, copia somente o JAR, define WORKDIR, porta e ENTRYPOINT em formato exec e executa com UID não root; a imagem permanece imutável e configuração, Kafka, banco, provider, timeouts e segredos pertencem ao ambiente; `-p` publica a porta, volumes preservam dados fora do filesystem efêmero, stdout e stderr alimentam os logs do runtime, Actuator fornece health e graceful shutdown permite encerrar listeners e workers com segurança; a execução confirma que localhost pertence ao namespace do container e que Kafka precisa anunciar endereços alcançáveis; o build ainda depende do JAR produzido no host, limitação que será removida pelo Dockerfile multi-stage da aula 507.
```
