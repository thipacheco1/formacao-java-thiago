# 564 - M18.09 - OpenTelemetry

## Apresentação da aula

Na aula 563, a `orders-api` passou a possuir dashboards Grafana provisionados e versionados.

A cadeia de observabilidade já contém:

```text
logs estruturados;

correlation ID;

trace ID;

Actuator;

Micrometer;

golden signals;

SLIs e SLOs didáticos;

Prometheus;

Grafana.
```

Cada peça resolveu um problema específico.

Os logs registram eventos.

As métricas mostram comportamento agregado.

O Prometheus coleta séries.

O Grafana organiza consultas em painéis.

Ainda existe uma questão arquitetural:

```text
como instrumentar,
transportar
e exportar telemetria

por um padrão
independente
do backend escolhido?
```

OpenTelemetry, também chamado de OTel, fornece APIs, SDKs, convenções e ferramentas para gerar, processar e exportar telemetria.

Ele trabalha principalmente com sinais como:

```text
traces;

metrics;

logs.
```

Nesta aula, você irá introduzir OpenTelemetry na `orders-api` sem substituir de forma precipitada o que já funciona.

A aplicação continuará usando:

- SLF4J e Logback para logs;
- Micrometer para métricas;
- Prometheus para séries;
- Grafana para visualização.

OpenTelemetry será adicionado inicialmente para:

- padronizar recursos;
- criar uma base de instrumentação automática;
- receber telemetria por OTLP;
- processar dados com o Collector;
- exportar traces locais para um exporter de diagnóstico;
- validar atributos;
- preparar a próxima aula.

A pergunta central será:

```text
como adicionar
OpenTelemetry

sem duplicar sinais,
expor dados,
acoplar o código
a um fornecedor

ou perder
a rastreabilidade
já construída?
```

Você irá usar duas peças principais.

### OpenTelemetry Java Agent

O Java Agent será anexado à JVM usando:

```text
-javaagent.
```

Ele realizará instrumentação automática de bibliotecas e frameworks suportados.

### OpenTelemetry Collector

O Collector receberá OTLP, processará a telemetria e enviará o resultado a um exporter local de diagnóstico.

O fluxo desta aula será:

```text
orders-api;

Java Agent;

OTLP;

Collector;

processors;

debug exporter;

evidence.
```

O laboratório usará versões fixadas e registradas:

```text
OpenTelemetry Java Agent:
2.29.0.

OpenTelemetry Collector Contrib:
0.156.0.
```

A aula não irá criar um fluxo completo entre dois ou mais serviços.

Não serão aprofundados:

- parent e child spans entre serviços;
- propagação HTTP completa;
- propagação Kafka completa;
- topologia distribuída;
- trace waterfall;
- critical path;
- span links;
- retry tracing;
- fanout;
- traces em Grafana;
- backend de traces;
- Tempo;
- Jaeger;
- Zipkin;
- sampling de produção.

Esses assuntos pertencem à próxima aula oficial:

```text
565 - M18.10 - Tracing distribuido
```

Nesta aula poderá existir um trace local gerado automaticamente pela entrada HTTP.

Entretanto, nenhuma investigação de um fluxo distribuído será antecipada.

A regra central será:

```text
instrumentar primeiro
com resource,
convenções,
pipeline
e proteção;

distribuir o trace
somente depois
que a base estiver correta.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
562:
Prometheus.

563:
Grafana.

564:
OpenTelemetry.

565:
Tracing distribuido.
```

A progressão é:

```text
telemetria existente;

visualização existente;

padrão OpenTelemetry;

tracing entre serviços.
```

Nesta aula:

```text
OpenTelemetry:
sim.

Java Agent:
sim.

OTLP:
sim.

Collector:
sim.

Resource:
sim.

instrumentation scope:
sim.

semantic conventions:
sim.

automatic instrumentation:
sim.

debug exporter:
sim.

basic local trace:
sim.

distributed trace:
não.

trace backend:
não.

production sampling:
não.

Grafana trace datasource:
não.
```

O objetivo não é remover as tecnologias anteriores.

O objetivo é criar uma camada padronizada que permita evolução controlada.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
tools/opentelemetry
├── opentelemetry-javaagent.jar
├── opentelemetry-javaagent.sha256
└── versions.properties

src/main/resources
└── application-opentelemetry.yml

observability/opentelemetry
├── collector-config.yml
├── opentelemetry-compose.yml
├── opentelemetry-architecture.yaml
├── opentelemetry-resource-contract.yaml
├── opentelemetry-instrumentation-policy.yaml
├── opentelemetry-export-policy.yaml
├── opentelemetry-attribute-policy.yaml
├── opentelemetry-signal-ownership.yaml
├── opentelemetry-data-protection.yaml
├── opentelemetry-failure-policy.yaml
├── opentelemetry-scenarios.yaml
└── opentelemetry-evidence.yaml

scripts/observability/opentelemetry
├── download-opentelemetry-javaagent.ps1
├── verify-opentelemetry-artifacts.ps1
├── validate-collector-config.ps1
├── start-opentelemetry-collector.ps1
├── start-orders-api-with-agent.ps1
├── validate-otlp-connectivity.ps1
├── validate-opentelemetry-resources.ps1
├── validate-opentelemetry-attributes.ps1
├── simulate-opentelemetry-traffic.ps1
├── scan-opentelemetry-output.ps1
├── collect-opentelemetry-evidence.ps1
└── verify-opentelemetry-baseline.ps1

docs/observability/opentelemetry
├── OPENTELEMETRY_OVERVIEW.md
├── JAVA_AGENT_GUIDE.md
├── OTLP_AND_COLLECTOR.md
├── OPENTELEMETRY_RESOURCES.md
├── OPENTELEMETRY_SEMANTIC_CONVENTIONS.md
├── SIGNAL_OWNERSHIP.md
├── OPENTELEMETRY_TEST_MATRIX.md
└── OPENTELEMETRY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
Java Agent fixado;

checksum validado;

Collector local;

OTLP HTTP e gRPC;

resource attributes;

instrumentação automática;

trace local;

processors;

debug exporter;

política de sinais;

proteção de dados;

testes;

evidence sanitizada.
```

Você irá:

1. validar a baseline;
2. definir a arquitetura;
3. fixar versões;
4. baixar o Java Agent;
5. validar checksum;
6. criar resource contract;
7. definir ownership dos sinais;
8. criar Collector config;
9. subir Collector;
10. configurar OTLP;
11. iniciar a aplicação com agent;
12. gerar tráfego;
13. validar resource;
14. validar spans locais;
15. validar attributes;
16. evitar duplicação;
17. filtrar dados;
18. simular falhas;
19. coletar evidence;
20. executar gate;
21. commitar;
22. preparar a aula 565.

---

## Conceito essencial

### OpenTelemetry

Framework aberto e independente de fornecedor para instrumentar, gerar, coletar e exportar telemetria.

---

### Signal

Forma de telemetria, como trace, metric ou log.

---

### API

Contrato usado pelo código de instrumentação para produzir telemetria.

---

### SDK

Implementação responsável por processar e exportar telemetria criada pela API.

---

### Automatic instrumentation

Instrumentação aplicada sem modificar diretamente cada ponto do código.

---

### Manual instrumentation

Instrumentação criada explicitamente pelo desenvolvedor.

---

### Java Agent

Agente anexado à JVM que instrumenta bytecode e bibliotecas suportadas.

---

### Resource

Conjunto de atributos que identifica a entidade que produz a telemetria.

---

### Instrumentation scope

Identidade da biblioteca ou componente que gerou a instrumentação.

---

### Semantic conventions

Nomes e significados padronizados para atributos, spans, métricas, logs e resources.

---

### OTLP

OpenTelemetry Protocol usado para transportar telemetria.

---

### Collector

Componente independente que recebe, processa e exporta telemetria.

---

### Receiver

Componente do Collector que recebe dados.

---

### Processor

Componente que transforma, agrupa, limita ou filtra dados.

---

### Exporter

Componente que envia dados para outro destino.

---

### Pipeline

Ligação entre receivers, processors e exporters para um sinal.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

git status

git diff --check
```

Suba o laboratório anterior quando necessário:

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  up `
  --detach

docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  up `
  --detach
```

Confirme:

- aplicação compila;
- testes passam;
- logs estruturados funcionam;
- correlation ID funciona;
- trace ID customizado funciona;
- Actuator funciona;
- métricas Micrometer funcionam;
- Prometheus target está `UP`;
- Grafana está disponível;
- nenhum OpenTelemetry Agent está ativo;
- nenhum Collector está ativo;
- nenhum Secret real existe.

Registre o estado anterior para evitar duplicação silenciosa.

---

### 2. Definir a arquitetura OpenTelemetry

Arquivo:

```text
opentelemetry-architecture.yaml
```

Conteúdo:

```yaml
architecture:
  application:
    name:
      orders-api

    runtime:
      Java-21

    instrumentation:
      mode:
        java-agent

  transport:
    protocol:
      otlp-http-protobuf

    endpoint:
      http://localhost:4318

  collector:
    distribution:
      contrib

    version:
      0.156.0

  signals:
    traces:
      enabled

    metrics:
      existingOwner:
        Micrometer-Prometheus

      otelExport:
        disabled

    logs:
      existingOwner:
        SLF4J-Logback

      otelExport:
        disabled

  backend:
    traces:
      debug-exporter-only
```

A decisão mais importante é:

```text
não exportar
a mesma métrica
por dois caminhos
sem um contrato.
```

---

### 3. Definir ownership dos sinais

Arquivo:

```text
opentelemetry-signal-ownership.yaml
```

Conteúdo:

```yaml
signals:
  logs:
    producer:
      SLF4J-Logback

    structuredFormat:
      existing-contract

    otelExport:
      disabled-in-lesson564

  metrics:
    producer:
      Micrometer

    backend:
      Prometheus

    otelExport:
      disabled-in-lesson564

  traces:
    producer:
      OpenTelemetry-Java-Agent

    transport:
      OTLP

    processor:
      OpenTelemetry-Collector

    backend:
      debug-only
```

Esse arquivo evita:

- métricas duplicadas;
- logs duplicados;
- cardinalidade inesperada;
- dois exporters concorrentes;
- custos ocultos.

---

### 4. Fixar versões

Arquivo:

```text
versions.properties
```

Conteúdo:

```properties
otel.javaagent.version=2.29.0
otel.collector.version=0.156.0
otel.protocol=http/protobuf
```

A versão fica registrada.

Atualização futura exige:

- revisão de release notes;
- checksum;
- execução de testes;
- evidence;
- commit próprio.

Não use `latest`.

---

### 5. Baixar o Java Agent

Script:

```text
download-opentelemetry-javaagent.ps1
```

Comando principal:

```powershell
$version = "2.29.0"

$destination = `
  "tools/opentelemetry/opentelemetry-javaagent.jar"

$uri = `
  "https://github.com/open-telemetry/" +
  "opentelemetry-java-instrumentation/" +
  "releases/download/v$version/" +
  "opentelemetry-javaagent.jar"

Invoke-WebRequest `
  -Uri $uri `
  -OutFile $destination
```

O script deve:

- criar o diretório;
- falhar em HTTP diferente de sucesso;
- não aceitar arquivo vazio;
- calcular SHA-256;
- registrar versão;
- comparar checksum conhecido do laboratório.

Não execute o JAR baixado antes da validação.

---

### 6. Calcular checksum

Execute:

```powershell
Get-FileHash `
  tools/opentelemetry/opentelemetry-javaagent.jar `
  -Algorithm SHA256
```

Grave o hash em:

```text
opentelemetry-javaagent.sha256.
```

Formato:

```text
<sha256>  opentelemetry-javaagent.jar
```

O checksum precisa ser atualizado somente quando a versão mudar de forma intencional.

O binário do agent não precisa ser commitado quando a política do repositório proíbe artifacts binários.

Nesse caso, versione:

- script;
- versão;
- checksum;
- instrução de download.

---

### 7. Criar contrato de resource

Arquivo:

```text
opentelemetry-resource-contract.yaml
```

Conteúdo:

```yaml
resource:
  required:
    service.name:
      orders-api

    service.namespace:
      formacao-java

    service.version:
      resolved-from-build

    deployment.environment.name:
      local

  recommended:
    service.instance.id:
      runtime-generated

  forbidden:
    - user.email
    - user.id
    - customer.id
    - order.id
    - password
    - token
    - host.full-path

  consistency:
    releaseEndpoint:
      required

    PrometheusApplicationLabel:
      required
```

Resource identifica o produtor da telemetria.

Ele não representa um evento individual.

---

### 8. Diferenciar resource e span attribute

Resource:

```text
service.name=orders-api.
```

Span attribute:

```text
http.request.method=POST.
```

Outro span attribute:

```text
http.route=/orders.
```

Não coloque em Resource:

- order ID;
- URL atual;
- status de uma requisição;
- correlation ID;
- payload;
- exception message.

Resource se repete em toda telemetria do processo.

---

### 9. Criar política de atributos

Arquivo:

```text
opentelemetry-attribute-policy.yaml
```

Conteúdo:

```yaml
attributes:
  semanticConventions:
    preferred:
      true

  allowed:
    - service.name
    - service.namespace
    - service.version
    - deployment.environment.name
    - http.request.method
    - http.route
    - http.response.status_code
    - server.address
    - server.port
    - error.type

  forbidden:
    - http.request.body
    - http.response.body
    - url.query
    - db.query.parameter
    - messaging.message.body
    - enduser.id
    - user.email
    - password
    - token
    - authorization

  identifiers:
    correlationId:
      log-only-in-this-lesson

    traceId:
      intrinsic-to-trace
```

Semantic conventions reduzem variações de nomes.

Não crie atributos alternativos para conceitos já padronizados.

---

### 10. Criar Collector config

Arquivo:

```text
collector-config.yml
```

Conteúdo:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 256
    spike_limit_mib: 64

  batch:
    timeout: 1s
    send_batch_size: 512

  attributes/drop_sensitive:
    actions:
      - key: http.request.body
        action: delete

      - key: http.response.body
        action: delete

      - key: authorization
        action: delete

      - key: enduser.id
        action: delete

exporters:
  debug:
    verbosity: normal

extensions:
  health_check:
    endpoint: 0.0.0.0:13133

service:
  extensions:
    - health_check

  pipelines:
    traces:
      receivers:
        - otlp

      processors:
        - memory_limiter
        - attributes/drop_sensitive
        - batch

      exporters:
        - debug
```

A ordem dos processors importa.

O memory limiter protege o Collector.

O processor de atributos remove campos proibidos.

O batch reduz custo de envio ao exporter.

---

### 11. Entender receivers

O receiver OTLP aceita:

```text
gRPC:
4317.

HTTP:
4318.
```

Nesta aula, o Java Agent usará:

```text
OTLP HTTP/protobuf.
```

A escolha será explícita.

Não dependa de defaults que podem mudar entre versões.

---

### 12. Entender processors

#### `memory_limiter`

Evita que o Collector consuma memória sem limite.

#### `attributes`

Remove atributos proibidos.

#### `batch`

Agrupa dados antes da exportação.

Processors não substituem proteção na aplicação.

Dados sensíveis não devem ser criados.

A remoção no Collector é uma defesa adicional.

---

### 13. Entender o debug exporter

O debug exporter escreve um resumo da telemetria nos logs do Collector.

Ele serve para:

- laboratório;
- validação;
- troubleshooting;
- inspeção de resource;
- confirmação de spans.

Ele não serve como backend de produção.

Não possui:

- busca histórica adequada;
- visualização;
- retenção operacional;
- correlação avançada;
- alta disponibilidade.

---

### 14. Criar Compose do Collector

Arquivo:

```text
opentelemetry-compose.yml
```

Conteúdo:

```yaml
services:
  otel-collector:
    image:
      otel/opentelemetry-collector-contrib:0.156.0

    container_name:
      orders-otel-collector

    command:
      - --config=/etc/otelcol-contrib/config.yml

    ports:
      - "4317:4317"
      - "4318:4318"
      - "13133:13133"

    volumes:
      - ./collector-config.yml:/etc/otelcol-contrib/config.yml:ro

    restart:
      "no"
```

A imagem usa versão fixa.

O config é read-only.

Nenhuma porta adicional é publicada sem necessidade.

---

### 15. Validar o Collector config

Script:

```text
validate-collector-config.ps1
```

Execute o Collector em modo de validação ou inicie e inspecione a saída.

Exemplo:

```powershell
docker run `
  --rm `
  --volume `
  "${PWD}/observability/opentelemetry/collector-config.yml:/etc/otelcol-contrib/config.yml:ro" `
  otel/opentelemetry-collector-contrib:0.156.0 `
  validate `
  --config=/etc/otelcol-contrib/config.yml
```

Quando a distribuição não oferecer o subcomando na mesma forma, use a opção de validação suportada ou um start controlado que falhe em config inválida.

O script precisa verificar:

- YAML;
- componentes existentes;
- pipelines;
- receivers;
- processors;
- exporters;
- portas;
- ausência de credentials.

---

### 16. Subir o Collector

Execute:

```powershell
docker compose `
  --file `
  observability/opentelemetry/opentelemetry-compose.yml `
  up `
  --detach
```

Valide:

```powershell
docker compose `
  --file `
  observability/opentelemetry/opentelemetry-compose.yml `
  ps

docker logs `
  orders-otel-collector `
  --tail 100
```

Consulte health:

```powershell
Invoke-RestMethod `
  http://localhost:13133
```

O Collector precisa estar saudável antes da aplicação exportar.

---

### 17. Configurar o profile OpenTelemetry

Arquivo:

```text
application-opentelemetry.yml
```

Conteúdo:

```yaml
app:
  observability:
    opentelemetry:
      enabled: true
      export:
        traces: true
        metrics: false
        logs: false
```

Esse arquivo documenta a intenção da aplicação.

A configuração efetiva do agent será realizada por propriedades `OTEL_*`.

Não coloque endpoint ou token real no arquivo.

---

### 18. Criar script de inicialização com agent

Script:

```text
start-orders-api-with-agent.ps1
```

Exemplo:

```powershell
$env:OTEL_SERVICE_NAME = "orders-api"

$env:OTEL_RESOURCE_ATTRIBUTES = `
  "service.namespace=formacao-java," +
  "service.version=local-build," +
  "deployment.environment.name=local"

$env:OTEL_TRACES_EXPORTER = "otlp"
$env:OTEL_METRICS_EXPORTER = "none"
$env:OTEL_LOGS_EXPORTER = "none"

$env:OTEL_EXPORTER_OTLP_PROTOCOL = `
  "http/protobuf"

$env:OTEL_EXPORTER_OTLP_ENDPOINT = `
  "http://localhost:4318"

$env:OTEL_PROPAGATORS = `
  "tracecontext,baggage"

java `
  "-javaagent:tools/opentelemetry/opentelemetry-javaagent.jar" `
  -jar `
  target/orders-api.jar `
  --spring.profiles.active=local,observability,prometheus,opentelemetry
```

O baggage propagator é configurado, mas nenhum baggage de negócio será criado nesta aula.

A aula 565 decidirá como propagação será usada no fluxo distribuído.

---

### 19. Não exportar métricas duas vezes

A aplicação já exporta métricas por:

```text
Micrometer
→
Prometheus.
```

Se o Java Agent também exportar métricas por OTLP, você poderá obter:

- métricas duplicadas;
- nomes diferentes;
- labels diferentes;
- dois owners;
- custo adicional;
- dashboards divergentes.

Por isso:

```text
OTEL_METRICS_EXPORTER=none.
```

A decisão poderá ser revista futuramente por uma arquitetura formal.

---

### 20. Não exportar logs duas vezes

Os logs atuais seguem:

```text
SLF4J
→
Logback
→
stdout.
```

Ativar logs OTLP sem planejamento pode gerar:

- duplicação;
- mudança de formato;
- perda de campos;
- dois pipelines;
- retenções diferentes.

Por isso:

```text
OTEL_LOGS_EXPORTER=none.
```

O trace ID automático poderá enriquecer logs quando a integração do agent e do logging estiver ativa.

A validação precisa confirmar o comportamento real.

---

### 21. Iniciar a aplicação

Antes:

```powershell
mvn `
  --batch-mode `
  clean `
  package
```

Depois:

```powershell
.\scripts\observability\opentelemetry\start-orders-api-with-agent.ps1
```

No startup, procure mensagens do agent.

Evite habilitar log detalhado do agent por padrão.

Quando necessário:

```text
OTEL_JAVAAGENT_DEBUG=true.
```

Use apenas durante troubleshooting.

O modo debug pode produzir muito volume.

---

### 22. Gerar tráfego local

Script:

```text
simulate-opentelemetry-traffic.ps1
```

Cenários:

- health;
- info;
- criação de pedido válida;
- rejeição de negócio;
- falha controlada;
- consulta de pedido.

Use dados fictícios.

Não envie Authorization real.

Não envie PII.

Aguarde o batch do Collector.

---

### 23. Inspecionar os spans locais

Execute:

```powershell
docker logs `
  orders-otel-collector `
  --tail 300
```

Procure:

- ResourceSpans;
- service.name;
- service.namespace;
- service.version;
- deployment environment;
- instrumentation scope;
- trace ID;
- span ID;
- span name;
- span kind;
- status;
- HTTP attributes.

A saída exata depende da versão e da verbosity.

A evidence deve registrar resumo, não copiar todos os spans.

---

### 24. Validar resource

Script:

```text
validate-opentelemetry-resources.ps1
```

Confirme:

```text
service.name:
orders-api.

service.namespace:
formacao-java.

service.version:
local-build ou versão resolvida.

deployment.environment.name:
local.
```

Compare com:

- `/actuator/info`;
- `/internal/release`;
- artifact metadata;
- Prometheus labels;
- Grafana context.

Divergência precisa ser registrada.

---

### 25. Validar instrumentation scope

O scope pode identificar a instrumentação responsável.

Exemplos:

- biblioteca do Java Agent;
- instrumentação Spring Web;
- instrumentação JDBC;
- componente customizado futuro.

Não confunda instrumentation scope com service name.

Um serviço pode possuir vários scopes.

O resource continua identificando a aplicação.

---

### 26. Validar span names

Spans automáticos podem representar:

- requisição HTTP;
- chamada de framework;
- operação de banco;
- cliente HTTP.

Nomes precisam ser estáveis.

Evite nome contendo:

- order ID;
- URL bruta;
- query completa;
- payload;
- UUID;
- customer ID.

A instrumentação automática deve usar route templates quando disponíveis.

---

### 27. Validar span kind

Tipos comuns:

```text
SERVER;

CLIENT;

PRODUCER;

CONSUMER;

INTERNAL.
```

Nesta aula, os spans HTTP locais podem apresentar `SERVER`.

Outros kinds podem surgir conforme bibliotecas instrumentadas.

A interpretação distribuída ficará para a aula 565.

---

### 28. Validar status

Um span pode possuir status que indica erro.

Entretanto, nem todo resultado de negócio rejeitado deve ser tratado como falha técnica do trace.

A política precisa diferenciar:

- erro técnico;
- rejeição esperada;
- status HTTP;
- exception;
- outcome de negócio.

Não marque todos os `4xx` como falha interna.

---

### 29. Criar política de instrumentação

Arquivo:

```text
opentelemetry-instrumentation-policy.yaml
```

Conteúdo:

```yaml
instrumentation:
  automatic:
    enabled:
      true

  manual:
    allowed:
      only-when-automatic-is-insufficient

  duplicateSpans:
    forbidden

  spanNames:
    dynamicIdentifiers:
      forbidden

  database:
    statementValues:
      forbidden

  messaging:
    payload:
      forbidden

  internalMethods:
    instrumentAll:
      false

  distributedValidation:
    deferredToLesson565
```

Instrumentar tudo cria custo e ruído.

---

### 30. Criar export policy

Arquivo:

```text
opentelemetry-export-policy.yaml
```

Conteúdo:

```yaml
export:
  protocol:
    otlp-http-protobuf

  endpoint:
    local-collector

  timeout:
    bounded

  retry:
    collector-and-sdk-managed

  compression:
    optional-in-laboratory

  traces:
    enabled

  metrics:
    disabled-to-avoid-duplication

  logs:
    disabled-to-avoid-duplication

  credentials:
    forbidden-in-laboratory

  productionEndpoint:
    notConfigured
```

Endpoint e protocolo precisam ser explícitos.

---

### 31. Criar política de proteção

Arquivo:

```text
opentelemetry-data-protection.yaml
```

Conteúdo:

```yaml
protection:
  prohibited:
    - password
    - authorization
    - access_token
    - refresh_token
    - cookie
    - request_body
    - response_body
    - customer_id
    - user_email
    - card_number
    - private_key

  queryStrings:
    default:
      drop-or-sanitize

  databaseStatements:
    parameterValues:
      forbidden

  messaging:
    body:
      forbidden

  collectorDefense:
    attributeDeletion:
      enabled
```

Telemetria é dado.

Ela precisa de classificação e retenção.

---

### 32. Escanear a saída

Script:

```text
scan-opentelemetry-output.ps1
```

Procure:

- password;
- bearer;
- authorization;
- token;
- Cookie;
- email;
- CPF;
- request body;
- response body;
- JDBC com credencial;
- order ID em span name;
- query parameter;
- private key.

Resultado:

```text
OPENTELEMETRY_OUTPUT_APPROVED
ou
OPENTELEMETRY_OUTPUT_BLOCKED.
```

Falso positivo precisa de revisão.

Não desabilite a regra globalmente sem justificativa.

---

### 33. Validar conectividade OTLP

Script:

```text
validate-otlp-connectivity.ps1
```

Valide:

- porta 4318 aberta;
- Collector health;
- aplicação exportando;
- absence de connection refused;
- absence de protocol mismatch;
- batch chegando;
- exporter debug recebendo.

Erro comum:

```text
aplicação usa gRPC
contra endpoint HTTP.
```

Por isso, protocolo e porta precisam corresponder.

---

### 34. Simular Collector indisponível

Pare o Collector:

```powershell
docker compose `
  --file `
  observability/opentelemetry/opentelemetry-compose.yml `
  stop `
  otel-collector
```

Execute uma requisição.

Confirme:

- regra de negócio continua funcionando;
- export falha de modo assíncrono;
- aplicação não retorna erro apenas porque telemetria falhou;
- logs do agent registram problema controlado;
- volume não explode.

Depois reinicie:

```powershell
docker compose `
  --file `
  observability/opentelemetry/opentelemetry-compose.yml `
  start `
  otel-collector
```

---

### 35. Simular protocolo incorreto

Em teste controlado, configure:

```text
grpc
```

contra:

```text
4318.
```

Ou HTTP contra uma porta gRPC.

Observe o erro.

Restaure imediatamente.

O objetivo é reconhecer:

- connection failure;
- HTTP error;
- gRPC status;
- ausência de export;
- Collector sem spans.

Não versione a configuração inválida.

---

### 36. Simular resource ausente

Remova temporariamente:

```text
OTEL_SERVICE_NAME.
```

Observe o resource resultante.

O gate deve bloquear:

```text
service.name desconhecido
ou genérico.
```

Restaure o valor.

A ausência de nome prejudica busca e ownership.

---

### 37. Criar failure policy

Arquivo:

```text
opentelemetry-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  collectorUnavailable:
    businessOperation:
      continue

    telemetry:
      degraded

  invalidCollectorConfig:
    action:
      block-lab-start

  protocolMismatch:
    action:
      block-validation

  missingServiceName:
    action:
      block-release

  sensitiveAttribute:
    action:
      block-release

  duplicateSignalExport:
    action:
      block-release

  excessiveAgentDebug:
    action:
      disable-after-diagnosis
```

Observabilidade não deve quebrar a regra de negócio.

Violações de segurança e contrato devem bloquear release.

---

### 38. Criar cenários

Arquivo:

```text
opentelemetry-scenarios.yaml
```

Cenários:

```text
collector healthy;

application with agent;

HTTP trace local;

business rejection;

technical failure;

collector unavailable;

protocol mismatch;

resource missing;

sensitive attribute attempt;

duplicate metric exporter disabled;

duplicate log exporter disabled.
```

Cada cenário precisa de:

- setup;
- ação;
- resultado esperado;
- cleanup;
- evidence.

---

### 39. Validar atributos

Script:

```text
validate-opentelemetry-attributes.ps1
```

Confirme:

- nomes compatíveis com convenções;
- tipos coerentes;
- status code numérico;
- route template;
- method;
- error type controlado;
- resource separado;
- nenhum ID em span name;
- nenhum atributo proibido;
- quantidade razoável de atributos.

Mais atributos não significa melhor trace.

---

### 40. Validar ausência de duplicação

Compare:

```text
Prometheus metrics antes;

Prometheus metrics depois;

logs antes;

logs depois.
```

Confirme:

- meters customizados não duplicaram;
- séries não dobraram;
- logs não aparecem duas vezes;
- agent não criou exporter de metrics;
- agent não criou exporter de logs;
- traces chegaram apenas ao Collector.

Registre a decisão em evidence.

---

### 41. Criar matriz de testes

Arquivo:

```text
OPENTELEMETRY_TEST_MATRIX.md
```

Cenários:

- agent existe;
- versão correta;
- checksum correto;
- Collector config válida;
- Collector health;
- OTLP HTTP;
- OTLP gRPC receiver disponível;
- application startup;
- resource completo;
- service name;
- service version;
- environment;
- instrumentation scope;
- HTTP span;
- status success;
- status failure;
- route sem ID;
- no body;
- no credentials;
- Collector down;
- protocol mismatch;
- recovery;
- metrics not duplicated;
- logs not duplicated;
- cleanup;
- evidence sanitizada.

---

### 42. Criar troubleshooting

Arquivo:

```text
OPENTELEMETRY_TROUBLESHOOTING.md
```

Inclua:

- agent não inicia;
- caminho do JAR incorreto;
- checksum diverge;
- versão desconhecida;
- Collector não inicia;
- config inválida;
- health 13133 falha;
- porta 4318 ocupada;
- protocol mismatch;
- connection refused;
- spans não aparecem;
- service name ausente;
- resource divergente;
- spans duplicados;
- métricas duplicadas;
- logs duplicados;
- span name com ID;
- body aparece;
- agent debug gera volume;
- exporter bloqueia shutdown;
- distributed tracing antecipado.

---

### 43. Coletar evidence

Script:

```text
collect-opentelemetry-evidence.ps1
```

Arquivo:

```text
opentelemetry-evidence.json.
```

Campos permitidos:

- lesson;
- application;
- environment;
- Java Agent version;
- Collector version;
- Collector health;
- OTLP protocol;
- OTLP endpoint status;
- resource status;
- instrumentation scope status;
- local trace status;
- attribute policy status;
- signal ownership status;
- duplicate metrics status;
- duplicate logs status;
- sensitive scan status;
- scenarios status;
- tests status;
- timestamp.

Não inclua:

- spans completos;
- trace IDs reais;
- correlation IDs;
- payloads;
- credentials;
- hostnames corporativos;
- dados pessoais.

---

### 44. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\opentelemetry\download-opentelemetry-javaagent.ps1

.\scripts\observability\opentelemetry\verify-opentelemetry-artifacts.ps1

.\scripts\observability\opentelemetry\validate-collector-config.ps1

.\scripts\observability\opentelemetry\start-opentelemetry-collector.ps1

.\scripts\observability\opentelemetry\validate-otlp-connectivity.ps1

.\scripts\observability\opentelemetry\start-orders-api-with-agent.ps1

.\scripts\observability\opentelemetry\simulate-opentelemetry-traffic.ps1

.\scripts\observability\opentelemetry\validate-opentelemetry-resources.ps1

.\scripts\observability\opentelemetry\validate-opentelemetry-attributes.ps1

.\scripts\observability\opentelemetry\scan-opentelemetry-output.ps1

.\scripts\observability\opentelemetry\collect-opentelemetry-evidence.ps1

.\scripts\observability\opentelemetry\verify-opentelemetry-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- agent fixado;
- checksum aprovado;
- Collector ativo;
- config válida;
- health aprovado;
- OTLP compatível;
- resource aprovado;
- instrumentation scope identificado;
- trace local recebido;
- atributos aprovados;
- métricas não duplicadas;
- logs não duplicados;
- dados sensíveis ausentes;
- falhas simuladas;
- evidence completa;
- tracing distribuído não antecipado.

---

### 45. Encerrar o laboratório

Pare a aplicação.

Depois:

```powershell
docker compose `
  --file `
  observability/opentelemetry/opentelemetry-compose.yml `
  down
```

Quando houver volume futuro, remova somente o volume do laboratório após coletar evidence.

Não execute:

```powershell
docker system prune
```

como parte do procedimento normal.

O cleanup precisa ser específico.

---

## Entendendo o que foi feito

### A telemetria ganhou um padrão

A aplicação passou a usar componentes independentes de fornecedor.

### A instrumentação ganhou modo automático

O Java Agent adicionou visibilidade sem espalhar código.

### Os sinais ganharam ownership

Logs, métricas e traces deixaram de competir pelo mesmo pipeline.

### A entidade produtora ganhou Resource

Service, version e environment ficaram explícitos.

### A origem da instrumentação ganhou scope

Bibliotecas automáticas puderam ser identificadas.

### O transporte ganhou OTLP

Protocolo e endpoint ficaram configurados de forma explícita.

### O processamento ganhou Collector

Receivers, processors e exporters passaram a formar um pipeline.

### A segurança ganhou defesa em profundidade

A aplicação evita dados e o Collector remove atributos proibidos.

### A indisponibilidade ganhou tolerância

Falha no Collector não interrompe o pedido.

### A próxima aula ganhou base

O tracing distribuído poderá focar causalidade entre componentes.

---

## Erros comuns importantes

### Ativar todos os sinais no agent

Logs e métricas podem ser duplicados.

### Usar `latest`

A reprodução do laboratório fica instável.

### Não validar checksum

O artifact baixado perde rastreabilidade.

### Misturar Resource e span attribute

A identidade do serviço fica poluída por eventos.

### Criar atributos com IDs

Busca, custo e privacidade são prejudicados.

### Usar protocolo e porta incompatíveis

Nenhuma telemetria chega ao Collector.

### Tratar debug exporter como backend

Não existe retenção operacional apropriada.

### Instrumentar todos os métodos

O volume de spans cresce sem valor.

### Deixar agent debug ativo

O log fica excessivo.

### Antecipar tracing distribuído

A causalidade entre serviços pertence à aula 565.

---

## Comandos úteis

### Validar artifacts

```powershell
.\scripts\observability\opentelemetry\verify-opentelemetry-artifacts.ps1
```

### Subir Collector

```powershell
docker compose `
  --file `
  observability/opentelemetry/opentelemetry-compose.yml `
  up `
  --detach
```

### Consultar health

```powershell
Invoke-RestMethod `
  http://localhost:13133
```

### Iniciar com agent

```powershell
.\scripts\observability\opentelemetry\start-orders-api-with-agent.ps1
```

### Ver Collector

```powershell
docker logs `
  orders-otel-collector `
  --tail 300
```

---

## Exercício guiado

### Parte 1 — Architecture

Defina agent, OTLP e Collector.

### Parte 2 — Versions

Fixe agent e Collector.

### Parte 3 — Resource

Crie atributos estáveis.

### Parte 4 — Collector

Configure receiver, processors e exporter.

### Parte 5 — Agent

Inicie a JVM com instrumentação automática.

### Parte 6 — Traffic

Gere spans HTTP locais.

### Parte 7 — Protection

Remova atributos proibidos.

### Parte 8 — Failures

Simule Collector down e protocol mismatch.

### Parte 9 — Ownership

Comprove ausência de logs e métricas duplicados.

### Parte 10 — Evidence

Valide, registre e encerre.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 563 e ponte para a aula 565 foram preservadas;
- OpenTelemetry, signal, API, SDK, automatic instrumentation, manual instrumentation, Agent, Resource, instrumentation scope, semantic conventions, OTLP, Collector, receiver, processor, exporter e pipeline foram definidos;
- baseline anterior foi validada;
- arquitetura OpenTelemetry foi criada;
- ownership dos sinais foi definido;
- logs continuam em SLF4J e Logback;
- métricas continuam em Micrometer e Prometheus;
- traces usam Java Agent, OTLP e Collector;
- Java Agent usa versão 2.29.0;
- Collector Contrib usa versão 0.156.0;
- nenhuma imagem `latest` é usada;
- versions properties foi criado;
- download do agent é automatizado;
- arquivo vazio é rejeitado;
- checksum SHA-256 é validado;
- política do repositório para binários foi respeitada;
- resource contract foi criado;
- service name, namespace, version e environment são obrigatórios;
- Resource e span attribute foram diferenciados;
- IDs de domínio não entram no Resource;
- attribute policy foi criada;
- semantic conventions são preferidas;
- bodies, credentials e parâmetros sensíveis são proibidos;
- Collector recebe OTLP gRPC e HTTP;
- Collector usa memory limiter;
- Collector usa attributes processor;
- Collector usa batch processor;
- debug exporter é somente de laboratório;
- Compose usa imagem fixada;
- config é read-only;
- Collector config foi validada;
- health extension foi configurada;
- profile OpenTelemetry foi criado;
- script de startup configura OTEL_SERVICE_NAME;
- resource attributes são explícitos;
- OTLP usa HTTP/protobuf na porta 4318;
- traces exporter está habilitado;
- metrics exporter está desabilitado;
- logs exporter está desabilitado;
- propagators são configurados;
- aplicação inicia com `-javaagent`;
- tráfego fictício foi gerado;
- Collector recebeu trace local;
- resource foi comparado com release e info;
- instrumentation scope foi validado;
- span names não possuem IDs dinâmicos;
- span kind foi analisado;
- status técnico e rejeição de negócio foram diferenciados;
- instrumentation policy foi criada;
- export policy foi criada;
- data protection foi criada;
- saída foi escaneada;
- OTLP connectivity foi validada;
- Collector indisponível não quebra a operação de negócio;
- protocol mismatch foi simulado;
- service name ausente bloqueia o gate;
- failure policy foi criada;
- cenários foram criados;
- atributos foram validados;
- métricas não foram duplicadas;
- logs não foram duplicados;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret real, dado pessoal, cloud pública ou backend de produção foi usado;
- trace entre múltiplos serviços não foi implementado;
- commit recomendado está presente;
- diário de bordo está presente;
- regra final está presente.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/tools/opentelemetry/versions.properties `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/tools/opentelemetry/opentelemetry-javaagent.sha256 `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-opentelemetry.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/opentelemetry `
  scripts/observability/opentelemetry `
  docs/observability/opentelemetry `
  docs/diario-de-bordo.md
```

Quando a política do projeto permitir versionar o Agent, adicione-o explicitamente.

Quando não permitir, mantenha o JAR ignorado e versione script, versão e checksum.

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|request_body|response_body|customer_id|email|latest"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): integrar OpenTelemetry"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- Secret;
- token;
- spans completos;
- trace IDs;
- payloads;
- Collector data;
- logs completos;
- backend de traces;
- configuração distribuída;
- material da aula 565.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a `orders-api` ganhou uma base OpenTelemetry independente de fornecedor.

Você configurou:

```text
Java Agent;

Resource;

semantic conventions;

OTLP;

Collector;

receivers;

processors;

debug exporter;

signal ownership;

data protection.
```

Você comprovou que OpenTelemetry não exige substituir imediatamente logs e métricas existentes; cada sinal precisa de ownership; o Java Agent oferece instrumentação automática; Resource identifica a aplicação; instrumentation scope identifica quem instrumentou; semantic conventions reduzem variações; OTLP precisa de protocolo e porta compatíveis; o Collector separa recebimento, processamento e exportação; memory limiter e batch protegem o pipeline; atributos sensíveis precisam ser evitados e removidos; debug exporter não é backend de produção; falha de telemetria não deve quebrar o negócio; versões e checksums precisam ser fixados; e ativar múltiplos exporters sem contrato gera duplicação.

A próxima aula será:

```text
565 - M18.10 - Tracing distribuido
```

Nela, você irá propagar contexto entre componentes, criar relações parent-child, instrumentar chamadas HTTP e mensageria e reconstruir um fluxo completo usando traces.

Nenhum trace completo entre múltiplos serviços, backend de traces, waterfall distribuído, span link, retry tracing ou análise de critical path foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Fixei versões e checksum.
- [ ] Defini ownership dos sinais.
- [ ] Criei Resource e attribute policy.
- [ ] Configurei Collector e OTLP.
- [ ] Iniciei a aplicação com Java Agent.
- [ ] Validei trace local e scopes.
- [ ] Evitei logs e métricas duplicados.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### O Agent não inicia

Revise caminho, versão, checksum e permissão do JAR.

### O Collector não inicia

Valide YAML, componentes e imagem fixada.

### A porta 4318 não responde

Revise container, publicação e conflito de porta.

### A aplicação mostra connection refused

Confirme endpoint e health do Collector.

### O Collector não recebe spans

Revise exporter, protocolo, endpoint e tráfego.

### Resource aparece incompleto

Revise `OTEL_SERVICE_NAME` e `OTEL_RESOURCE_ATTRIBUTES`.

### Métricas duplicaram

Confirme `OTEL_METRICS_EXPORTER=none`.

### Logs duplicaram

Confirme `OTEL_LOGS_EXPORTER=none`.

### Dados sensíveis aparecem

Remova na origem, aplique processor e bloqueie o gate.

### Trace entre serviços começou a ser construído

Preserve essa implementação para a aula 565.

---

## Perguntas de revisão

1. O que é OpenTelemetry?
2. O que é signal?
3. Qual diferença entre API e SDK?
4. O que é Java Agent?
5. O que é Resource?
6. O que é instrumentation scope?
7. O que são semantic conventions?
8. O que é OTLP?
9. O que é Collector?
10. O que é receiver?
11. O que é processor?
12. O que é exporter?
13. Por que usar memory limiter?
14. Por que usar batch?
15. Por que desabilitar metrics no agent?
16. Por que desabilitar logs no agent?
17. Qual risco de atributos com IDs?
18. O que acontece quando o Collector falha?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Padrão aberto de telemetria.
2. Trace, metric ou log.
3. Contrato e implementação.
4. Instrumentação automática da JVM.
5. Identidade do produtor.
6. Identidade da instrumentação.
7. Nomes padronizados.
8. Protocolo de transporte.
9. Pipeline independente.
10. Entrada de dados.
11. Processamento de dados.
12. Destino de dados.
13. Limitar memória.
14. Agrupar exportações.
15. Evitar duplicação com Micrometer.
16. Evitar duplicação com Logback.
17. Privacidade e volume.
18. Negócio continua e telemetria degrada.
19. Tracing distribuído.
20. Tracing distribuído.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 564 - M18.09 - OpenTelemetry

- Continuei após Grafana.
- Diferenciei API, SDK, Agent, Resource e instrumentation scope.
- Entendi OpenTelemetry como padrão independente de fornecedor.
- Defini ownership separado para logs, métricas e traces.
- Mantive logs em SLF4J e Logback.
- Mantive métricas em Micrometer e Prometheus.
- Configurei traces com Java Agent, OTLP e Collector.
- Fixei Java Agent 2.29.0.
- Fixei Collector Contrib 0.156.0.
- Criei script de download e checksum SHA-256.
- Modelei Resource com service name, namespace, version e environment.
- Diferenciei Resource e span attributes.
- Adotei semantic conventions.
- Criei política de atributos e proteção de dados.
- Configurei OTLP gRPC e HTTP no Collector.
- Configurei memory limiter, attributes processor e batch.
- Usei debug exporter somente para laboratório.
- Criei Compose do Collector com imagem fixada.
- Configurei OTLP HTTP/protobuf na porta 4318.
- Desabilitei exportação OTel de metrics e logs para evitar duplicação.
- Iniciei a aplicação com `-javaagent`.
- Gereei tráfego local e validei trace HTTP local.
- Validei Resource e instrumentation scope.
- Analisei span names, kinds e status.
- Simulei Collector indisponível e protocol mismatch.
- Confirmei que falha de telemetria não quebra o negócio.
- Escaneei atributos sensíveis.
- Coletei evidence sanitizada.
- Não antecipei tracing entre múltiplos serviços.
- Próxima aula: Tracing distribuído.
```

---

## Referência técnica curta

- OpenTelemetry Java Instrumentation.
- OpenTelemetry Java Agent.
- OpenTelemetry API and SDK.
- OpenTelemetry Resources.
- OpenTelemetry Instrumentation Scope.
- OpenTelemetry Semantic Conventions.
- OpenTelemetry Protocol.
- OpenTelemetry Collector.
- Collector Processors.
- Telemetry Data Protection.

Regra final:

```text
OpenTelemetry precisa ser introduzido como uma camada padronizada e não como duplicação da observabilidade existente: logs continuam sob SLF4J e Logback, métricas continuam sob Micrometer e Prometheus e traces são produzidos pelo Java Agent, enviados por OTLP HTTP/protobuf ao Collector e inspecionados no debug exporter; versões e checksums são fixados, Resource identifica service name, namespace, version e environment, instrumentation scope identifica quem gerou a telemetria e semantic conventions definem nomes conhecidos; receivers, memory limiter, attributes processor e batch formam um pipeline controlado, enquanto bodies, credentials, dados pessoais e IDs dinâmicos permanecem ausentes; Collector indisponível degrada telemetria sem quebrar o negócio, métricas e logs exporters ficam desabilitados para evitar duplicação e o gate valida conectividade, resources, attributes, segurança e evidence, deixando para a aula 565 a propagação e reconstrução de traces entre múltiplos componentes.
```
