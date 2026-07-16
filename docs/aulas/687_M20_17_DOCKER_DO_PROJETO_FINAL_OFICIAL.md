# 687 - M20.17 - Docker do projeto final

## Apresentação da aula

Na aula 686, você implementou a observabilidade do OrderFlow.

O projeto passou a possuir:

- logs estruturados;
- sanitização de telemetria;
- correlação ponta a ponta;
- propagação W3C;
- traces HTTP;
- traces Kafka;
- spans de providers;
- métricas da API;
- métricas da Outbox;
- métricas de consumers;
- métricas de providers;
- métricas da projection;
- métricas da jornada;
- SLOs;
- error budgets;
- dashboards;
- alertas;
- runbooks;
- testes de cardinalidade;
- testes de propagação;
- testes de telemetria.

Todos os principais componentes já foram implementados:

```text
orderflow-api;

outbox-publisher;

orchestration-worker;

integration-gateway;

projection-worker;

PostgreSQL;

Kafka;

OpenTelemetry Collector;

Prometheus;

Grafana.
```

Agora precisamos transformar esse conjunto em um ambiente reproduzível.

Uma aplicação distribuída não está pronta para demonstração quando exige:

- instalar cada dependência manualmente;
- lembrar dezenas de comandos;
- configurar portas individualmente;
- copiar secrets para arquivos;
- iniciar componentes em ordem incerta;
- descobrir nomes de hosts;
- limpar bancos e volumes manualmente;
- executar processos como root;
- usar imagens enormes;
- depender da máquina do desenvolvedor.

Nesta aula, você criará a conteinerização final do OrderFlow.

O objetivo não é apenas fazer a aplicação subir.

O ambiente precisa ser:

- reproduzível;
- legível;
- seguro;
- observável;
- inicializável com um comando;
- encerrável com um comando;
- testável;
- documentado;
- defensável em entrevista técnica.

Serão criados:

- Dockerfiles multi-stage;
- layered JARs;
- imagens por aplicação;
- usuário não root;
- filesystem controlado;
- health checks;
- configuração por variáveis;
- `.dockerignore`;
- rede interna;
- volumes;
- PostgreSQL;
- Kafka;
- initialization;
- OpenTelemetry Collector;
- Prometheus;
- Grafana;
- limites de recursos;
- profiles;
- compose completo;
- scripts de subida e validação;
- testes do ambiente;
- reports, evidence e gate.

O laboratório será:

```text
labs/m20/aula-687-docker-do-projeto-final/orderflow-docker
```

A próxima aula será:

```text
688 - M20.18 - CI CD do projeto final
```

Na aula 688, o ambiente desta aula será usado em pipelines para build, teste, análise, geração de imagem, SBOM, scan, assinatura, publicação, deploy e rollback.

Nesta aula, nenhum workflow final de CI/CD será criado.

Regra central:

```text
um ambiente Docker profissional
nao apenas inicia processos;

ele reproduz
build,
runtime,
configuracao,
dependencias,
saude
e operacao local.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
684:
Implementacao integracoes.

685:
Implementacao mensageria.

686:
Implementacao observabilidade.

687:
Docker do projeto final.

688:
CI CD do projeto final.

689:
Deploy completo.
```

O código já possui boundaries arquiteturais.

A conteinerização precisa preservá-los.

Cada aplicação executável terá sua própria imagem:

```text
orderflow-api;

outbox-publisher;

orchestration-worker;

integration-gateway;

projection-worker.
```

As bibliotecas compartilhadas não geram containers próprios.

Elas entram nas aplicações durante o build Maven.

A aula 687 precisa garantir:

- mesma versão Java;
- mesmo parent POM;
- build reproduzível;
- imagem mínima;
- runtime sem Maven;
- execução não root;
- configuração externa;
- portas explícitas;
- dependências saudáveis;
- observabilidade conectada;
- dados persistentes;
- isolamento de rede;
- limpeza controlada;
- nenhuma credencial real.

---

## Objetivo prático

Será criada a estrutura:

```text
infrastructure/docker
├── README.md
├── compose.yaml
├── compose.override.yaml
├── .env.example
├── api
│   └── Dockerfile
├── outbox-publisher
│   └── Dockerfile
├── orchestration-worker
│   └── Dockerfile
├── integration-gateway
│   └── Dockerfile
├── projection-worker
│   └── Dockerfile
├── postgres
│   ├── healthcheck.sh
│   └── init
│       └── 001-create-databases.sql
├── Kafka
│   └── create-topics.sh
├── observability
│   ├── otel-collector.yaml
│   ├── prometheus.yml
│   ├── alert-rules.yml
│   └── grafana
│       ├── provisioning
│       │   ├── dashboards
│       │   └── datasources
│       └── dashboards
├── scripts
│   ├── build-images.ps1
│   ├── up.ps1
│   ├── wait-healthy.ps1
│   ├── smoke-test.ps1
│   ├── collect-evidence.ps1
│   ├── down.ps1
│   └── reset.ps1
└── evidence
    └── README.md
```

Na raiz do repositório:

```text
.dockerignore;

docs/containerization
├── CONTAINERIZATION_CHARTER.md
├── IMAGE_CATALOG.md
├── RUNTIME_CONFIGURATION.md
├── NETWORK_POLICY.md
├── VOLUME_POLICY.md
├── HEALTHCHECK_POLICY.md
├── RESOURCE_POLICY.md
├── LOCAL_OPERATIONS_RUNBOOK.md
├── CONTAINER_SECURITY_CHECKLIST.md
├── CONTAINER_TEST_MATRIX.md
├── CONTAINER_RISK_REGISTER.md
├── CONTAINER_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

---

## Conceito essencial

### Imagem não é máquina virtual

Uma imagem deve conter apenas o necessário para executar um processo.

O container não deve:

- executar vários serviços independentes;
- possuir IDE;
- possuir Maven no runtime;
- guardar dados permanentes em camada gravável;
- usar root sem necessidade;
- armazenar secret na imagem;
- depender de hostname local da máquina.

### Multi-stage separa build e runtime

Stage de build:

```text
JDK;

Maven Wrapper;

source;

dependencies;

package.
```

Stage de runtime:

```text
JRE;

layered application;

non-root user;

health support;

entrypoint.
```

### Layered JAR melhora cache

Dependências mudam menos que código.

Separar layers permite reutilizar cache de imagem.

### Health check não é startup delay

Um health check comprova:

- processo vivo;
- aplicação pronta;
- dependências críticas acessíveis;
- migrations concluídas quando necessário.

### Compose não substitui produção

O compose desta aula é um ambiente local reproduzível.

Ele não substitui:

- Kubernetes;
- autoscaling;
- secret manager;
- load balancer;
- alta disponibilidade;
- storage distribuído.

---

## Mão na massa guiada

### 1. Criar diretórios

Na raiz:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  infrastructure/docker/api,
  infrastructure/docker/outbox-publisher,
  infrastructure/docker/orchestration-worker,
  infrastructure/docker/integration-gateway,
  infrastructure/docker/projection-worker,
  infrastructure/docker/postgres/init,
  infrastructure/docker/kafka,
  infrastructure/docker/observability/grafana/provisioning/dashboards,
  infrastructure/docker/observability/grafana/provisioning/datasources,
  infrastructure/docker/observability/grafana/dashboards,
  infrastructure/docker/scripts,
  docs/containerization
```

---

### 2. Criar Containerization Charter

Arquivo:

```text
docs/containerization/CONTAINERIZATION_CHARTER.md
```

Princípios:

```text
one executable per application container;

build and runtime are separated;

runtime uses non-root user;

images contain no secrets;

configuration comes from environment;

health is explicit;

state lives in named volumes;

internal traffic uses private network;

resource limits are documented;

CI CD belongs to lesson 688.
```

---

### 3. Criar `.dockerignore`

Arquivo na raiz:

```text
.git
.github
.idea
.vscode

**/target
**/out
**/build

docs
reports
contracts
test-results
coverage

.env
.env.*
!.env.example

*.log
*.iml
.DS_Store
Thumbs.db

secrets
local-data
```

Não envie artifacts desnecessários ao build context.

---

### 4. Definir estratégia de build

Cada Dockerfile usa a raiz como contexto.

Exemplo:

```powershell
docker build `
  -f infrastructure/docker/api/Dockerfile `
  -t orderflow/api:local `
  .
```

Isso permite que o Maven enxergue:

- parent POM;
- módulos;
- wrapper;
- fontes necessárias.

---

### 5. Criar Dockerfile multi-stage da API

Arquivo:

```text
infrastructure/docker/api/Dockerfile
```

Conteúdo:

```dockerfile
# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw pom.xml ./
COPY apps apps
COPY libs libs

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      -pl apps/orderflow-api \
      -am \
      clean package \
      -DskipTests

RUN java \
    -Djarmode=layertools \
    -jar apps/orderflow-api/target/*.jar \
    extract \
    --destination /workspace/layers

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup \
      -S \
      orderflow \
    && adduser \
      -S \
      -G orderflow \
      -u 10001 \
      orderflow

WORKDIR /app

COPY --from=builder \
  /workspace/layers/dependencies/ ./

COPY --from=builder \
  /workspace/layers/spring-boot-loader/ ./

COPY --from=builder \
  /workspace/layers/snapshot-dependencies/ ./

COPY --from=builder \
  /workspace/layers/application/ ./

USER 10001:10001

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="\
-XX:MaxRAMPercentage=75 \
-XX:+ExitOnOutOfMemoryError \
-Dfile.encoding=UTF-8 \
-Duser.timezone=UTC"

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
```

---

### 6. Validar imagem da API

Execute:

```powershell
docker build `
  -f infrastructure/docker/api/Dockerfile `
  -t orderflow/api:local `
  .
```

Inspecione:

```powershell
docker image inspect `
  orderflow/api:local
```

Confirme:

- usuário `10001`;
- nenhuma variável sensível;
- tamanho esperado;
- entrypoint correto.

---

### 7. Criar Dockerfiles dos workers

Repita a mesma estratégia para:

- `outbox-publisher`;
- `orchestration-worker`;
- `integration-gateway`;
- `projection-worker`.

Altere apenas:

- módulo Maven;
- nome da imagem;
- porta quando existir;
- health endpoint quando aplicável.

Evite cinco Dockerfiles completamente divergentes.

---

### 8. Avaliar Dockerfile compartilhado

Uma opção é usar build argument:

```text
APP_MODULE.
```

Porém, Dockerfiles explícitos podem ser mais fáceis de ensinar e auditar.

Nesta formação, use Dockerfiles por aplicação com padrão idêntico.

Registre a duplicação consciente.

---

### 9. Configurar layered JAR

No plugin Spring Boot, habilite layers.

Exemplo conceitual:

```xml
<configuration>
    <layers>
        <enabled>true</enabled>
    </layers>
</configuration>
```

Valide que `layertools` extrai:

- dependencies;
- spring-boot-loader;
- snapshot-dependencies;
- application.

---

### 10. Criar Image Catalog

Arquivo:

```text
docs/containerization/IMAGE_CATALOG.md
```

Registre:

- image name;
- source module;
- base image;
- Java version;
- exposed port;
- user;
- health endpoint;
- data volume;
- owner;
- purpose.

---

### 11. Criar política de tag

Tags locais:

```text
local;

dev.
```

Tags de CI futuras:

```text
commit SHA;

semantic version;

release channel.
```

Não use apenas `latest` como referência imutável.

A publicação será tratada na aula 688.

---

### 12. Configurar usuário não root

Todos os executáveis usam:

```text
UID 10001;

GID 10001.
```

Não conceda `sudo`.

Não instale shell adicional sem necessidade.

---

### 13. Configurar filesystem

O processo deve escrever apenas em diretórios explícitos:

```text
/tmp;

work directory
quando necessário.
```

Logs vão para stdout e stderr.

Não escreva logs em arquivos internos do container.

---

### 14. Criar Runtime Configuration

Arquivo:

```text
docs/containerization/RUNTIME_CONFIGURATION.md
```

Categorias:

- required;
- optional;
- secret;
- performance;
- observability;
- networking.

Exemplos:

```text
SPRING_DATASOURCE_URL;

SPRING_KAFKA_BOOTSTRAP_SERVERS;

OTEL_EXPORTER_OTLP_ENDPOINT;

ORDERFLOW_SECURITY_ISSUER;

ORDERFLOW_SECURITY_AUDIENCE.
```

---

### 15. Criar `.env.example`

Arquivo:

```text
infrastructure/docker/.env.example
```

Conteúdo sanitizado:

```dotenv
ORDERFLOW_ENVIRONMENT=local

POSTGRES_DB=orderflow
POSTGRES_USER=orderflow
POSTGRES_PASSWORD=local-only-change-me

KAFKA_CLUSTER_ID=orderflow-local-cluster

ORDERFLOW_SECURITY_ISSUER=http://identity.local
ORDERFLOW_SECURITY_AUDIENCE=orderflow-api

GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=local-only-change-me
```

O arquivo real `.env` não será versionado.

---

### 16. Tratar secrets locais

Para laboratório:

- use `.env` ignorado;
- use valores exclusivamente locais;
- não reutilize senha real;
- não publique evidência com senha;
- permita override por ambiente.

Em produção, use secret manager.

---

## PostgreSQL

### 17. Criar serviço PostgreSQL

No compose:

```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: ${POSTGRES_DB}
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  volumes:
    - postgres-data:/var/lib/postgresql/data
    - ./postgres/init:/docker-entrypoint-initdb.d:ro
  networks:
    - data-network
  healthcheck:
    test:
      - CMD-SHELL
      - pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}
    interval: 5s
    timeout: 3s
    retries: 20
    start_period: 10s
```

---

### 18. Criar banco de apoio

O script de init pode criar bancos separados quando necessário:

- aplicação;
- Grafana local;
- ferramentas de teste.

Não misture produção e teste no mesmo banco real.

---

### 19. Evitar publicar PostgreSQL por padrão

O serviço não precisa de `ports` para comunicação interna.

Use profile ou override local quando precisar acessar com cliente externo.

---

### 20. Criar Volume Policy

Arquivo:

```text
docs/containerization/VOLUME_POLICY.md
```

Volumes:

```text
postgres-data;

Kafka-data;

prometheus-data;

grafana-data.
```

Dados temporários dos apps não precisam de volumes.

---

## Kafka

### 21. Criar serviço Kafka

Use modo KRaft para ambiente local.

O serviço precisa de:

- broker ID;
- controller quorum;
- listeners internos;
- listener externo opcional;
- advertised listeners;
- storage volume;
- health check;
- resource limits.

Fixe a versão da imagem.

---

### 22. Configurar listeners

Listener interno:

```text
Kafka:9092.
```

Listener externo opcional:

```text
localhost:29092.
```

Aplicações em containers usam hostname `Kafka`.

A máquina host usa `localhost`.

---

### 23. Criar health check do Kafka

O check deve provar que o broker responde.

Evite apenas verificar processo.

Use comando de metadata ou topic list.

---

### 24. Criar script de topics

Arquivo:

```text
infrastructure/docker/kafka/create-topics.sh
```

Crie:

- order events;
- integration requests;
- integration results;
- projection events;
- retry 5s;
- retry 30s;
- dead letter.

O script deve ser idempotente.

---

### 25. Criar serviço `Kafka-init`

Esse serviço:

- depende do broker saudável;
- executa o script;
- encerra com sucesso;
- não permanece rodando.

Workers dependem de `Kafka-init` concluído.

---

## Observabilidade local

### 26. Criar OpenTelemetry Collector

Serviço:

- recebe OTLP gRPC;
- recebe OTLP HTTP;
- exporta traces;
- exporta métricas;
- expõe health;
- usa config read-only.

---

### 27. Criar Prometheus

Configure scrape para:

- API;
- workers;
- collector;
- Kafka exporter quando disponível.

Monte:

- `prometheus.yml`;
- alert rules;
- volume persistente.

---

### 28. Criar Grafana

Configure provisioning para:

- datasource Prometheus;
- dashboards;
- pasta OrderFlow.

Senha vem do `.env`.

---

### 29. Criar datasource provisionado

Arquivo:

```text
infrastructure/docker/observability/grafana/provisioning/datasources/prometheus.yml
```

Use hostname interno:

```text
http://prometheus:9090.
```

---

### 30. Copiar dashboards versionados

Monte dashboards da aula 686 em modo read-only.

Assim, o ambiente local nasce com painéis disponíveis.

---

## Aplicações no compose

### 31. Criar serviço `orderflow-api`

Configuração:

- image local;
- build;
- environment;
- depends_on;
- healthcheck;
- network;
- port `8080`;
- read-only filesystem quando possível;
- tmpfs;
- resource limits;
- restart local controlado.

---

### 32. Criar health endpoint da API

Use:

```text
/actuator/health/readiness.
```

Liveness:

```text
/actuator/health/liveness.
```

O readiness depende de recursos necessários para aceitar tráfego.

---

### 33. Criar serviço `outbox-publisher`

Dependências:

- PostgreSQL saudável;
- Kafka init concluído;
- collector disponível de forma não bloqueante.

Ele não expõe porta pública.

Pode expor actuator apenas na rede interna.

---

### 34. Criar `orchestration-worker`

Configuração:

- Kafka bootstrap;
- database;
- OTLP;
- consumer group;
- concurrency;
- health endpoint;
- resource limit.

---

### 35. Criar `integration-gateway`

Configuração:

- Kafka;
- OTLP;
- provider URLs simuladas;
- issuer e audience;
- workload identity local simulada.

Não inclua secret real.

---

### 36. Criar `projection-worker`

Configuração:

- Kafka;
- PostgreSQL;
- projection store;
- OTLP;
- consumer group;
- freshness metrics.

---

### 37. Criar dependências saudáveis

Use `depends_on` com:

```text
service_healthy;

service_completed_successfully.
```

Não dependa apenas da ordem textual do compose.

---

## Redes

### 38. Criar Network Policy

Arquivo:

```text
docs/containerization/NETWORK_POLICY.md
```

Redes:

```text
edge-network;

application-network;

data-network;

observability-network.
```

A API participa da edge e application.

PostgreSQL participa apenas da data.

Grafana pode publicar porta ao host.

---

### 39. Reduzir exposição

Portas públicas locais:

```text
8080 API;

3000 Grafana;

9090 Prometheus
opcional;

29092 Kafka
opcional.
```

PostgreSQL permanece interno por padrão.

---

### 40. Não usar `network_mode: host`

Esse modo reduz portabilidade e isolamento.

Use redes nomeadas.

---

## Recursos e runtime

### 41. Criar Resource Policy

Arquivo:

```text
docs/containerization/RESOURCE_POLICY.md
```

Defina baseline local por serviço:

- memory;
- CPU;
- JVM percentage;
- concurrency;
- queue size;
- timeout.

---

### 42. Configurar limites

Exemplo:

```yaml
deploy:
  resources:
    limits:
      memory: 768M
      cpus: "1.00"
    reservations:
      memory: 256M
      cpus: "0.25"
```

Documente limitações do suporte a `deploy` fora de Swarm.

Use também parâmetros compatíveis com o runtime local quando necessário.

---

### 43. Configurar JVM para containers

Use:

```text
-XX:MaxRAMPercentage;

-XX:InitialRAMPercentage;

-XX:+ExitOnOutOfMemoryError;

-Duser.timezone=UTC.
```

Evite heap fixo maior que o limite do container.

---

### 44. Configurar shutdown graceful

Spring Boot:

```text
server.shutdown=graceful.
```

Workers precisam:

- parar polling;
- terminar mensagem atual;
- liberar lease;
- fechar consumer;
- respeitar timeout.

---

### 45. Criar Healthcheck Policy

Arquivo:

```text
docs/containerization/HEALTHCHECK_POLICY.md
```

Diferencie:

- startup;
- liveness;
- readiness.

Não use dependência externa opcional como causa de restart infinito.

---

## Compose completo

### 46. Criar `compose.yaml`

O arquivo inclui:

- PostgreSQL;
- Kafka;
- Kafka-init;
- OTEL Collector;
- Prometheus;
- Grafana;
- API;
- Outbox Publisher;
- Orchestration Worker;
- Integration Gateway;
- Projection Worker;
- networks;
- volumes;
- health checks;
- resource policy;
- logging options.

---

### 47. Criar `compose.override.yaml`

Use o override para desenvolvimento:

- mapear porta do PostgreSQL;
- mapear porta externa do Kafka;
- aumentar logs;
- montar config editável;
- reduzir sampling;
- habilitar ferramentas locais.

Não altere o compose base para cada máquina.

---

### 48. Criar profiles

Profiles:

```text
core;

observability;

debug;

tools.
```

Exemplo:

```powershell
docker compose `
  --profile core `
  --profile observability `
  up -d
```

---

### 49. Configurar logs do Docker

Use rotação:

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

Isso não substitui logs estruturados da aplicação.

---

### 50. Criar política de restart

Local:

```text
unless-stopped
```

pode esconder falha durante teste.

Para evidência, prefira:

```text
no
ou
on-failure com limite.
```

Documente a escolha por serviço.

---

## Scripts operacionais

### 51. Criar `build-images.ps1`

O script:

- valida Docker;
- executa build Maven;
- constrói imagens;
- registra tags;
- falha no primeiro erro;
- gera inventário.

---

### 52. Criar `up.ps1`

Responsabilidades:

- validar `.env`;
- iniciar profiles;
- aguardar serviços;
- mostrar URLs;
- não imprimir secrets.

---

### 53. Criar `wait-healthy.ps1`

O script consulta:

```powershell
docker compose ps `
  --format json
```

Ele espera:

- healthy;
- completed;
- running esperado.

Timeout produz erro claro.

---

### 54. Criar `smoke-test.ps1`

Valide:

- API health;
- Grafana health;
- Prometheus ready;
- Kafka topics;
- PostgreSQL readiness;
- registro de pedido;
- replay idempotente;
- Outbox publicada;
- projection atualizada.

---

### 55. Criar `down.ps1`

Comportamento padrão:

```text
containers removidos;

volumes preservados.
```

---

### 56. Criar `reset.ps1`

Reset destrutivo:

- exige confirmação explícita;
- remove volumes;
- limpa dados locais;
- recria ambiente.

Não execute automaticamente.

---

### 57. Criar Operations Runbook

Arquivo:

```text
docs/containerization/LOCAL_OPERATIONS_RUNBOOK.md
```

Comandos:

- build;
- up;
- status;
- logs;
- restart;
- smoke;
- down;
- reset;
- collect evidence.

---

## Segurança de containers

### 58. Criar Container Security Checklist

Arquivo:

```text
docs/containerization/CONTAINER_SECURITY_CHECKLIST.md
```

Itens:

- non-root;
- base image fixada;
- sem secret;
- sem package manager no runtime quando possível;
- filesystem read-only;
- capabilities reduzidas;
- no-new-privileges;
- portas mínimas;
- health checks;
- logs sanitizados;
- imagem inventariada;
- scan na aula 688.

---

### 59. Configurar `read_only`

Aplicações podem usar:

```yaml
read_only: true
tmpfs:
  - /tmp
```

Teste antes de aplicar a todos.

---

### 60. Remover capabilities

Exemplo:

```yaml
cap_drop:
  - ALL
security_opt:
  - no-new-privileges:true
```

Adicione capabilities somente com justificativa.

---

### 61. Não montar Docker socket

Nenhuma aplicação precisa de:

```text
/var/run/docker.sock.
```

Montar o socket concede poder excessivo.

---

### 62. Validar usuário dos containers

Execute:

```powershell
docker compose exec `
  orderflow-api `
  id
```

Resultado esperado:

```text
uid=10001
gid=10001.
```

---

## Testes do ambiente

### 63. Validar compose

Execute:

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

Confirme ausência de erro e variável não resolvida.

---

### 64. Construir todas as imagens

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  build
```

---

### 65. Subir o ambiente

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  --profile core `
  --profile observability `
  up `
  -d
```

---

### 66. Verificar saúde

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  ps
```

Todos os serviços necessários devem estar:

```text
healthy;

running;

completed com sucesso.
```

---

### 67. Executar smoke test

```powershell
.\infrastructure\docker\scripts\smoke-test.ps1
```

---

### 68. Testar restart

Reinicie:

- API;
- Outbox Publisher;
- Orchestration Worker.

Valide:

- volumes preservados;
- consumer group recuperado;
- Outbox continuada;
- idempotência preservada;
- projection consistente.

---

### 69. Testar falha do Kafka

Pare Kafka temporariamente.

Valide:

- API continua persistindo quando policy permitir;
- Outbox cresce;
- publisher falha de forma controlada;
- alerta técnico aparece nas métricas;
- após retorno, backlog reduz.

---

### 70. Testar falha do PostgreSQL

Pare PostgreSQL.

Valide:

- readiness da API falha;
- liveness permanece correta quando aplicável;
- workers não entram em loop agressivo;
- logs mostram erro sanitizado;
- recovery acontece após retorno.

---

### 71. Testar limite de memória

Aplique limite reduzido em ambiente de teste.

Valide:

- JVM respeita container;
- OOM encerra processo;
- container não permanece zumbi;
- logs permitem diagnóstico.

---

### 72. Testar volume reset

Execute reset controlado.

Valide:

- banco vazio;
- migrations reaplicadas;
- topics recriados;
- dashboards reprovisionados;
- smoke test volta a passar.

---

## Arquitetura e qualidade

### 73. Criar Container Test Matrix

Arquivo:

```text
docs/containerization/CONTAINER_TEST_MATRIX.md
```

Categorias:

- build;
- layers;
- user;
- filesystem;
- health;
- networking;
- volumes;
- restart;
- failure;
- reset;
- observability;
- security;
- smoke.

---

### 74. Criar Container Risk Register

Arquivo:

```text
docs/containerization/CONTAINER_RISK_REGISTER.md
```

Riscos:

```text
root runtime;

secret in image;

large build context;

mutable latest tag;

host networking;

unbounded logs;

volume loss;

health check superficial;

startup race;

container OOM;

Kafka listener incorreto;

database exposed;

Docker socket mounted;

environment drift.
```

---

### 75. Criar Container Traceability

Arquivo:

```text
docs/containerization/CONTAINER_TRACEABILITY.md
```

Exemplo:

```text
ADR modular applications
-> one image per executable.

ADR PostgreSQL authority
-> postgres service
-> named volume
-> migration test.

ADR OpenTelemetry
-> collector service
-> OTLP environment
-> observability profile.

security policy
-> non-root
-> cap_drop
-> no-new-privileges
-> container security test.
```

---

### 76. Criar boundary da próxima aula

Arquivo:

```text
docs/containerization/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 687 define:

- Dockerfiles;
- layered JARs;
- runtime users;
- health checks;
- configuration;
- networks;
- volumes;
- limits;
- compose;
- local observability stack;
- operational scripts;
- container tests.

A aula 688 define:

- CI pipeline;
- test pipeline;
- image build;
- cache;
- SBOM;
- vulnerability scan;
- image signing;
- registry publishing;
- environment promotion;
- deployment automation;
- rollback.

Nenhum pipeline final
e implementado nesta aula.
```

---

### 77. Executar build completo

Antes de fechar:

```powershell
.\mvnw.cmd `
  --batch-mode `
  clean `
  verify
```

Depois:

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  config

docker compose `
  -f infrastructure/docker/compose.yaml `
  build
```

---

### 78. Criar report

Arquivo:

```text
reports/docker-final-report.yaml
```

Exemplo:

```yaml
DockerFinal:
  images:
    total:
      5
    nonRoot:
      5
    multiStage:
      5
    layered:
      5

  services:
    total:
      11
    healthy:
      11

  networks:
    total:
      4

  volumes:
    total:
      4

  tests:
    composeValidation:
      PASS
    smoke:
      PASS
    restart:
      PASS
    KafkaFailure:
      PASS
    PostgreSQLFailure:
      PASS
    reset:
      PASS

  CICD:
    implemented:
      false

  gate:
    PASS
```

---

### 79. Criar evidence

Arquivo:

```text
contracts/docker-final-evidence.yaml
```

Campos:

- lesson;
- project;
- Dockerfile count;
- image count;
- non-root image count;
- multi-stage image count;
- layered image count;
- compose service count;
- healthy service count;
- network count;
- named volume count;
- secret in image count;
- exposed database port status;
- read-only filesystem status;
- capability drop status;
- health check status;
- compose validation status;
- smoke test status;
- restart test status;
- Kafka failure test status;
- PostgreSQL failure test status;
- reset test status;
- CI/CD implemented;
- documentation status;
- gate status;
- timestamp.

---

### 80. Criar gate Docker

Status:

```text
PASS;

FAIL_DOCKERFILE;

FAIL_MULTI_STAGE;

FAIL_LAYERED_JAR;

FAIL_NON_ROOT;

FAIL_IMAGE_SECRET;

FAIL_BUILD_CONTEXT;

FAIL_RUNTIME_CONFIGURATION;

FAIL_HEALTHCHECK;

FAIL_COMPOSE;

FAIL_NETWORK_POLICY;

FAIL_VOLUME_POLICY;

FAIL_RESOURCE_POLICY;

FAIL_LOG_ROTATION;

FAIL_POSTGRESQL_SERVICE;

FAIL_KAFKA_SERVICE;

FAIL_OBSERVABILITY_SERVICE;

FAIL_APPLICATION_SERVICE;

FAIL_SMOKE_TEST;

FAIL_RESTART_TEST;

FAIL_FAILURE_TEST;

FAIL_RESET_TEST;

FAIL_SECURITY_CHECKLIST;

FAIL_CI_CD_ANTICIPATION;

INCONCLUSIVE.
```

---

### 81. Executar validação final

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify

docker compose `
  -f infrastructure/docker/compose.yaml `
  config

.\infrastructure\docker\scripts\smoke-test.ps1
```

Confirme:

- imagens construídas;
- usuários não root;
- serviços saudáveis;
- redes corretas;
- volumes persistentes;
- Kafka inicializado;
- PostgreSQL migrado;
- observabilidade acessível;
- replay idempotente;
- CI/CD não implementado.

---

### 82. Encerrar o laboratório

Confirme:

- `.dockerignore`;
- cinco Dockerfiles;
- multi-stage;
- layered JAR;
- non-root;
- runtime config;
- `.env.example`;
- PostgreSQL;
- Kafka;
- topic init;
- collector;
- Prometheus;
- Grafana;
- API;
- workers;
- networks;
- volumes;
- limits;
- health checks;
- profiles;
- scripts;
- security checklist;
- smoke test;
- failure tests;
- report;
- evidence;
- gate aprovado;
- CI/CD não implementado.

---

## Entendendo o que foi feito

### O projeto ganhou um runtime reproduzível

Todos os componentes podem subir com configuração documentada.

### Build e runtime foram separados

Maven e JDK não permanecem nas imagens finais.

### Segurança foi aplicada ao container

As aplicações executam sem root, sem capabilities e sem secret na imagem.

### Estado ganhou persistência local

PostgreSQL, Kafka, Prometheus e Grafana usam volumes nomeados.

### Dependências ganharam saúde explícita

Compose aguarda readiness e inicialização.

### A observabilidade ficou utilizável

Collector, Prometheus, Grafana e dashboards sobem junto com o projeto.

### Falhas passaram a ser testáveis

Kafka, PostgreSQL, restart e reset possuem cenários reproduzíveis.

### O ambiente ficou pronto para pipeline

A aula 688 poderá construir, testar, escanear e publicar as imagens.

---

## Erros comuns importantes

### Usar Maven no runtime

A imagem fica maior e mais exposta.

### Executar como root

Uma vulnerabilidade ganha impacto maior.

### Guardar secret no Dockerfile

O valor pode permanecer nas layers.

### Publicar PostgreSQL sem necessidade

A superfície local aumenta.

### Usar `localhost` entre containers

Cada container possui seu próprio localhost.

### Depender apenas de `depends_on`

Sem health condition, a aplicação pode iniciar cedo.

### Não limitar logs

O disco pode ser consumido.

### Apagar volumes no `down`

Dados locais são perdidos sem intenção.

### Um container com vários processos

Lifecycle e health ficam confusos.

### Criar pipeline agora

CI/CD pertence à aula 688.

---

## Comandos úteis

### Validar compose

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

### Construir

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  build
```

### Subir

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  --profile core `
  --profile observability `
  up -d
```

### Ver status

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  ps
```

### Ver logs

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  logs `
  --follow `
  orderflow-api
```

### Encerrar preservando volumes

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  down
```

---

## Exercício guiado

Conteinerize completamente:

```text
pagamento recusado
com compensacao.
```

Inclua:

1. API container;
2. PostgreSQL;
3. Kafka;
4. Outbox Publisher;
5. Integration Gateway;
6. Orchestration Worker;
7. Projection Worker;
8. provider simulado;
9. OTEL Collector;
10. Prometheus;
11. Grafana;
12. correlation;
13. Outbox;
14. integration request;
15. payment rejection;
16. integration result;
17. compensation;
18. projection;
19. dashboards;
20. restart do worker;
21. falha temporária do Kafka;
22. smoke test;
23. evidence.

Não crie pipeline.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 686 e ponte para a aula 688 foram preservadas;
- diretórios Docker foram criados;
- Containerization Charter foi criado;
- `.dockerignore` foi criado;
- estratégia de build foi definida;
- Dockerfile multi-stage da API foi criado;
- imagem da API foi validada;
- Dockerfiles dos workers foram criados;
- duplicação consciente foi documentada;
- layered JAR foi configurado;
- Image Catalog foi criado;
- política de tags foi definida;
- usuário não root foi criado;
- filesystem foi controlado;
- Runtime Configuration foi criada;
- `.env.example` foi criado;
- secrets locais foram tratados;
- serviço PostgreSQL foi criado;
- banco de apoio foi tratado;
- PostgreSQL não foi exposto por padrão;
- Volume Policy foi criada;
- serviço Kafka foi criado;
- listeners foram configurados;
- health check Kafka foi criado;
- script de topics foi criado;
- `Kafka-init` foi criado;
- OTEL Collector foi criado;
- Prometheus foi criado;
- Grafana foi criado;
- datasource foi provisionado;
- dashboards foram montados;
- API foi adicionada ao compose;
- health endpoints foram definidos;
- Outbox Publisher foi adicionado;
- Orchestration Worker foi adicionado;
- Integration Gateway foi adicionado;
- Projection Worker foi adicionado;
- dependências saudáveis foram configuradas;
- Network Policy foi criada;
- exposição de portas foi reduzida;
- host network foi evitado;
- Resource Policy foi criada;
- limites foram configurados;
- JVM foi configurada;
- graceful shutdown foi configurado;
- Healthcheck Policy foi criada;
- `compose.yaml` completo foi criado;
- override foi criado;
- profiles foram criados;
- rotação de logs foi criada;
- política de restart foi definida;
- scripts de build, up, wait, smoke, down e reset foram criados;
- Operations Runbook foi criado;
- Container Security Checklist foi criado;
- filesystem read-only foi testado;
- capabilities foram removidas;
- Docker socket não foi montado;
- usuário dos containers foi validado;
- compose foi validado;
- imagens foram construídas;
- ambiente foi iniciado;
- saúde foi validada;
- smoke test foi executado;
- restart foi testado;
- falha do Kafka foi testada;
- falha do PostgreSQL foi testada;
- limite de memória foi testado;
- reset de volumes foi testado;
- Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 688 foi criado;
- build completo passou;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- CI/CD não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify

docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

Adicione:

```powershell
git add `
  .dockerignore `
  infrastructure/docker `
  docs/containerization `
  reports/docker-final-report.yaml `
  contracts/docker-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "client_secret|private_key|access_token|refresh_token|Bearer ey|realPassword|realBootstrapServer|realRegistry|github/workflows"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "build(docker): containerize OrderFlow project"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- secret real;
- token;
- registry credential;
- pipeline;
- workflow de deploy;
- conteúdo detalhado da aula 688.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você conteinerizou o projeto final OrderFlow.

Você criou:

```text
multi-stage Dockerfiles;

layered JARs;

non-root runtime;

runtime configuration;

PostgreSQL;

Kafka;

topic initialization;

OpenTelemetry Collector;

Prometheus;

Grafana;

API container;

worker containers;

networks;

volumes;

resource limits;

health checks;

compose profiles;

operational scripts;

container security;

smoke tests;

failure tests;

report, evidence e gate.
```

O ambiente completo pode ser construído e iniciado de forma reproduzível.

A próxima aula será:

```text
688 - M20.18 - CI CD do projeto final
```

Nela, você implementará pipelines para validação, testes, build, cache, geração de imagens, SBOM, scan de vulnerabilidades, assinatura, publicação em registry, promoção entre ambientes, deploy, smoke test e rollback.

Nenhuma pipeline final foi implementada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei Dockerfiles multi-stage.
- [ ] Configurei layered JARs.
- [ ] Usei usuário não root.
- [ ] Externalizei configuração.
- [ ] Criei PostgreSQL.
- [ ] Criei Kafka.
- [ ] Criei stack de observabilidade.
- [ ] Criei networks.
- [ ] Criei volumes.
- [ ] Criei health checks.
- [ ] Criei limits.
- [ ] Criei compose completo.
- [ ] Criei scripts.
- [ ] Testei falhas.
- [ ] Preservei CI/CD para a aula 688.

---

## Troubleshooting adicional

### Build não encontra parent POM

Use a raiz como contexto.

### `layertools` não extrai

Confirme plugin Spring Boot e layered JAR.

### Container inicia como root

Revise `USER` e image inspect.

### API não acessa PostgreSQL

Use hostname do serviço, não localhost.

### Kafka anuncia endereço errado

Revise listeners e advertised listeners.

### Grafana não encontra Prometheus

Use hostname interno da rede.

### Serviço fica `starting`

Revise health check e start period.

### Volume não é removido

`down` preserva volume; use reset explícito.

### Logs consomem disco

Revise rotação.

### Quero criar GitHub Actions

Essa etapa pertence à aula 688.

---

## Perguntas de revisão

1. Por que usar multi-stage?
2. Maven fica no runtime?
3. O que layered JAR melhora?
4. Por que usuário não root?
5. Secret pode entrar no Dockerfile?
6. Onde fica configuração?
7. Container usa localhost para outro serviço?
8. O que health check prova?
9. Qual diferença entre liveness e readiness?
10. Para que servem volumes?
11. PostgreSQL deve ser público?
12. O que é KRaft?
13. Para que serve `Kafka-init`?
14. O que profiles controlam?
15. Por que rotacionar logs?
16. O que `read_only` protege?
17. Por que remover capabilities?
18. Docker socket deve ser montado?
19. O que smoke test valida?
20. O que reset remove?
21. Compose substitui Kubernetes?
22. O que a aula 688 fará?
23. O que não foi implementado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Separar build e runtime.
2. Não.
3. Cache e tamanho de atualização.
4. Reduz impacto de exploração.
5. Não.
6. Em variáveis e secrets externos.
7. Não.
8. Saúde real do serviço.
9. Vivo versus pronto.
10. Persistir estado.
11. Não por padrão.
12. Kafka sem ZooKeeper.
13. Criar topics idempotentemente.
14. Grupos opcionais de serviços.
15. Evitar consumo de disco.
16. Escrita não autorizada.
17. Reduz privilégios.
18. Não.
19. Jornada mínima.
20. Containers e volumes locais.
21. Não.
22. Implementar CI/CD.
23. Pipelines e publicação.
24. CI CD do projeto final.
25. Docker reproduz runtime e operação.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 687 - M20.17 - Docker do projeto final

- Continuei após Implementação observabilidade.
- Criei a estrutura Docker.
- Criei Containerization Charter.
- Criei `.dockerignore`.
- Defini contexto de build.
- Criei Dockerfile multi-stage da API.
- Validei a imagem da API.
- Criei Dockerfiles dos workers.
- Documentei duplicação consciente.
- Configurei layered JAR.
- Criei Image Catalog.
- Defini política de tags.
- Criei usuário não root.
- Controlei filesystem.
- Criei Runtime Configuration.
- Criei `.env.example`.
- Tratei secrets locais.
- Criei serviço PostgreSQL.
- Mantive PostgreSQL interno.
- Criei Volume Policy.
- Criei serviço Kafka em KRaft.
- Configurei listeners.
- Criei health check Kafka.
- Criei script de topics.
- Criei `Kafka-init`.
- Criei OpenTelemetry Collector.
- Criei Prometheus.
- Criei Grafana.
- Provisionei datasource.
- Montei dashboards.
- Adicionei API ao compose.
- Defini liveness e readiness.
- Adicionei Outbox Publisher.
- Adicionei Orchestration Worker.
- Adicionei Integration Gateway.
- Adicionei Projection Worker.
- Configurei dependências saudáveis.
- Criei Network Policy.
- Reduzi portas expostas.
- Evitei host network.
- Criei Resource Policy.
- Configurei limites.
- Configurei JVM.
- Configurei graceful shutdown.
- Criei Healthcheck Policy.
- Criei `compose.yaml`.
- Criei override.
- Criei profiles.
- Configurei rotação de logs.
- Defini restart policy.
- Criei scripts de build, up e wait.
- Criei smoke test.
- Criei scripts de down e reset.
- Criei Operations Runbook.
- Criei Container Security Checklist.
- Testei filesystem read-only.
- Removi capabilities.
- Não montei Docker socket.
- Validei usuário dos containers.
- Validei compose.
- Construí imagens.
- Subi o ambiente.
- Validei saúde.
- Executei smoke test.
- Testei restart.
- Testei falha do Kafka.
- Testei falha do PostgreSQL.
- Testei limite de memória.
- Testei reset de volumes.
- Criei Container Test Matrix.
- Criei Container Risk Register.
- Criei Container Traceability.
- Criei boundary para a aula 688.
- Executei build completo.
- Criei report, evidence e gate.
- Não antecipei CI/CD.
- Próxima aula: CI CD do projeto final.
```

---

## Referência técnica curta

- Docker.
- Multi-Stage Build.
- Layered JAR.
- BuildKit Cache.
- Non-Root User.
- Read-Only Filesystem.
- Capabilities.
- Health Check.
- Liveness.
- Readiness.
- Docker Compose.
- KRaft.
- Named Volume.
- Network.
- Resource Limit.
- Graceful Shutdown.
- Smoke Test.

Regra final:

```text
A conteinerização final do OrderFlow deve reproduzir build, runtime, configuração, dependências, saúde e operação local sem enfraquecer os boundaries: cinco Dockerfiles multi-stage constroem orderflow-api, outbox-publisher, orchestration-worker, integration-gateway e projection-worker com Maven Wrapper no builder e Java 21 JRE no runtime, layered JARs separam dependencies e application, imagens executam com UID e GID 10001, sem root, secret ou Maven, filesystem fica read-only quando possível, capabilities são removidas e logs vão para stdout com rotação, configuração vem de variáveis e `.env` ignorado, PostgreSQL usa volume nomeado e rede de dados sem porta pública por padrão, Kafka usa KRaft, listeners internos, health check e criação idempotente de topics, OpenTelemetry Collector, Prometheus e Grafana usam configuração e dashboards versionados, compose conecta API, publisher, workers, banco, broker e observabilidade em redes separadas, depends_on usa health e completion conditions, JVM respeita limites de memória, health checks distinguem startup, liveness e readiness, profiles controlam core, observability, debug e tools, scripts constroem, sobem, aguardam saúde, executam smoke, encerram e resetam com confirmação, testes comprovam restart, falha de Kafka, falha de PostgreSQL, persistência de volumes, OOM e reset, e o gate termina com imagens, compose, networks, volumes, health, security, tests, report e evidence aprovados, enquanto pipelines, SBOM, vulnerability scan, assinatura, registry, promoção, deploy e rollback permanecem reservados para a aula 688.
```
