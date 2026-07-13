# 563 - M18.08 - Grafana

## Apresentação da aula

Na aula 562, a `orders-api` passou a disponibilizar métricas para um Prometheus local.

Você configurou:

```text
Micrometer registry;

endpoint
/actuator/prometheus;

scraping;

target;

séries temporais;

labels;

PromQL;

retenção;

qualidade dos dados.
```

O Prometheus passou a responder perguntas por consultas.

Exemplos:

```promql
up{job="orders-api"}
```

```promql
sum(
  rate(
    orders_creation_seconds_count[5m]
  )
)
```

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(
      orders_creation_seconds_bucket[5m]
    )
  )
)
```

Durante a operação, consultas manuais podem divergir em expressão, janela, filtro e interpretação, além de esconder ausência de dados.

O Grafana transforma consultas em visualizações organizadas.

Ele permite combinar:

```text
datasource;

dashboard;

row;

panel;

query;

variable;

annotation;

threshold;

unit;

transformation;

link;

provisioning.
```

A pergunta central desta aula será:

```text
como transformar
séries Prometheus

em dashboards
operacionais,
versionados,
seguros
e confiáveis

sem esconder
qualidade,
contexto
ou limitações
dos dados?
```

Você irá conectar o Grafana ao Prometheus e criar um conjunto de dashboards para a `orders-api`.

O laboratório terá três níveis: visão executiva operacional, golden signals e confiabilidade com diagnóstico.

O dashboard não é fonte absoluta: cada painel declara pergunta, consulta, unidade, janela, labels, no data, owner, limitações e ação esperada.

A regra central será:

```text
um painel
precisa apoiar
uma decisão;

não apenas
mostrar um gráfico.
```

A aula abordará datasource, provisioning, dashboards como código, folders, UIDs, variáveis, painéis, annotations, thresholds, units, no data, links, segurança, testes e evidence.

A aula não irá implementar:

- SDK OpenTelemetry;
- Java Agent OpenTelemetry;
- Collector;
- exporters OTLP;
- spans;
- propagação automática;
- traces;
- baggage;
- sampling;
- exemplars;
- integração trace-to-logs;
- integração trace-to-metrics.

Esses tópicos pertencem à próxima aula oficial:

```text
564 - M18.09 - OpenTelemetry
```

Nesta aula, campos de trace já existentes podem ser citados em links conceituais, mas nenhuma instrumentação OpenTelemetry será antecipada.

---

## Onde estamos na formação

A sequência oficial é:

```text
561:
SLI SLO SLA.

562:
Prometheus.

563:
Grafana.

564:
OpenTelemetry.
```

A progressão é:

```text
Micrometer:
gera medidas.

Prometheus:
coleta e consulta.

Grafana:
organiza e visualiza.

OpenTelemetry:
padroniza telemetria
e tracing.
```

Nesta aula:

```text
Grafana:
sim.

Prometheus datasource:
sim.

dashboards:
sim.

variables:
sim.

annotations:
sim.

provisioning:
sim.

dashboard JSON:
sim.

security:
sim.

tests:
sim.

OpenTelemetry:
não.

tracing:
não.

OTLP:
não.

Collector:
não.
```

A progressão prática será:

```text
1.
subir Grafana.

2.
provisionar datasource.

3.
definir dashboard contract.

4.
criar dashboard executivo.

5.
criar golden signals.

6.
criar confiabilidade.

7.
validar no data
e cardinalidade.

8.
versionar.

9.
coletar evidence.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
observability/grafana
├── grafana-compose.yml
├── provisioning
│   ├── datasources
│   │   └── prometheus-datasource.yml
│   └── dashboards
│       └── dashboard-provider.yml
├── dashboards
│   ├── orders-operational-overview.json
│   ├── orders-golden-signals.json
│   └── orders-reliability.json
├── dashboard-contract.yaml
├── datasource-contract.yaml
├── dashboard-variable-policy.yaml
├── dashboard-panel-catalog.yaml
├── dashboard-threshold-policy.yaml
├── dashboard-no-data-policy.yaml
├── dashboard-annotation-policy.yaml
├── dashboard-security-policy.yaml
├── dashboard-versioning-policy.yaml
├── grafana-failure-policy.yaml
├── grafana-scenarios.yaml
└── grafana-evidence.yaml

scripts/observability/grafana
├── validate-grafana-compose.ps1
├── validate-grafana-provisioning.ps1
├── validate-grafana-datasource.ps1
├── validate-dashboard-json.ps1
├── validate-dashboard-queries.ps1
├── validate-dashboard-variables.ps1
├── validate-dashboard-no-data.ps1
├── validate-dashboard-security.ps1
├── start-grafana-lab.ps1
├── simulate-grafana-scenarios.ps1
├── collect-grafana-evidence.ps1
└── verify-grafana-baseline.ps1

docs/observability/grafana
├── GRAFANA_OVERVIEW.md
├── GRAFANA_PROVISIONING.md
├── OPERATIONAL_OVERVIEW_DASHBOARD.md
├── GOLDEN_SIGNALS_DASHBOARD.md
├── RELIABILITY_DASHBOARD.md
├── DASHBOARD_DESIGN_GUIDE.md
├── GRAFANA_TEST_MATRIX.md
└── GRAFANA_TROUBLESHOOTING.md
```

Ao final, você terá Grafana local, datasource provisionado, dashboards versionados, variáveis controladas, annotations, segurança, testes e evidence.

Você irá:

1. validar a baseline;
2. preparar Compose;
3. subir Grafana;
4. provisionar datasource;
5. validar conexão;
6. definir contratos;
7. criar folder;
8. criar dashboard executivo;
9. criar dashboard golden signals;
10. criar dashboard de confiabilidade;
11. criar variáveis;
12. configurar unidades;
13. configurar legends;
14. definir thresholds;
15. tratar no data;
16. criar annotations;
17. criar links;
18. revisar cardinalidade;
19. validar JSON;
20. validar queries;
21. simular cenários;
22. coletar evidence;
23. executar gate;
24. commitar;
25. preparar a aula 564.

---

## Conceito essencial

### Grafana

Plataforma de visualização e exploração de dados de observabilidade.

---

### Datasource

Conexão configurada entre Grafana e uma fonte de dados.

---

### Dashboard

Conjunto organizado de painéis voltados a uma finalidade.

---

### Panel

Unidade visual que executa uma ou mais consultas.

---

### Query

Expressão enviada ao datasource.

---

### Variable

Valor selecionável usado para filtrar ou parametrizar dashboards.

---

### Annotation

Evento temporal desenhado sobre gráficos.

---

### Threshold

Regra visual aplicada a valores.

---

### Unit

Unidade exibida para um valor.

---

### Legend

Identificação das séries apresentadas.

---

### Transformation

Operação aplicada ao resultado antes da visualização.

---

### Provisioning

Criação declarativa de datasources e dashboards.

---

### Dashboard-as-code

Prática de versionar dashboards como artifacts revisáveis.

---

### UID

Identificador estável de datasource, folder ou dashboard.

---

### No data

Estado no qual a consulta não retorna séries ou valores.

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

Suba a aplicação com o profile Prometheus:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability,prometheus"
```

Suba o Prometheus da aula anterior:

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  up `
  --detach
```

Confirme:

```powershell
Invoke-RestMethod `
  http://localhost:9090/api/v1/targets
```

Antes do Grafana, o target precisa estar `UP`.

Grafana não corrige datasource sem dados.

---

### 2. Criar Compose do Grafana

Arquivo:

```text
grafana-compose.yml
```

Conteúdo:

```yaml
services:
  grafana:
    image: grafana/grafana:12.1.0
    container_name: orders-grafana
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: local_admin_only
      GF_USERS_ALLOW_SIGN_UP: "false"
      GF_AUTH_ANONYMOUS_ENABLED: "false"
      GF_SERVER_ROOT_URL: http://localhost:3000
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
      - ./provisioning:/etc/grafana/provisioning:ro
      - ./dashboards:/var/lib/grafana/dashboards:ro
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  grafana-data:
```

A credencial é fictícia e local. Não use essa configuração em produção, não versione valor real e não use `latest`.

---

### 3. Isolar o laboratório

Uma opção mais consistente é incluir Prometheus e Grafana na mesma network.

Exemplo conceitual:

```yaml
networks:
  observability:
    name: orders-observability
```

O Grafana poderá acessar:

```text
http://prometheus:9090
```

quando os dois serviços estiverem no mesmo Compose ou network.

Evite configurar datasource com:

```text
http://localhost:9090
```

dentro do container Grafana.

Nesse contexto, `localhost` aponta para o próprio Grafana.

---

### 4. Provisionar datasource

Arquivo:

```text
prometheus-datasource.yml
```

Conteúdo:

```yaml
apiVersion: 1

datasources:
  - name: Orders Prometheus
    uid: orders-prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
    jsonData:
      httpMethod: POST
      timeInterval: 15s
```

O UID precisa ser estável:

```text
orders-prometheus.
```

Dashboards devem referenciar o UID, não um ID numérico criado dinamicamente.

---

### 5. Criar contrato do datasource

Arquivo:

```text
datasource-contract.yaml
```

Conteúdo:

```yaml
datasource:
  name:
    Orders Prometheus

  uid:
    orders-prometheus

  type:
    prometheus

  access:
    proxy

  editable:
    false

  default:
    true

  url:
    internal-compose-network

  credentials:
    forbidden

  tlsSkipVerify:
    forbiddenInProduction
```

A URL interna não deve apontar para endereço corporativo.

---

### 6. Provisionar dashboards

Arquivo:

```text
dashboard-provider.yml
```

Conteúdo:

```yaml
apiVersion: 1

providers:
  - name: orders-observability
    orgId: 1
    folder: Orders Observability
    folderUid: orders-observability
    type: file
    disableDeletion: true
    updateIntervalSeconds: 10
    allowUiUpdates: false
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: false
```

`allowUiUpdates: false` reforça dashboard-as-code.

Alterações devem voltar ao JSON versionado.

Evite mudanças apenas na interface sem exportação.

---

### 7. Subir Grafana

Script:

```text
start-grafana-lab.ps1
```

Execute:

```powershell
docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  up `
  --detach
```

Valide:

```powershell
docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  ps

docker logs `
  orders-grafana `
  --tail 100
```

Acesse:

```text
http://localhost:3000
```

Use apenas a credencial local fictícia.

---

### 8. Validar health do Grafana

Consulte:

```powershell
Invoke-RestMethod `
  http://localhost:3000/api/health
```

Resultado esperado:

```json
{
  "database": "ok",
  "version": "12.1.0",
  "commit": "..."
}
```

O número de versão deve corresponder à imagem usada.

Não considere dashboard válido apenas porque o Grafana iniciou.

---

### 9. Validar datasource

A API de health do datasource exige autenticação.

Exemplo local:

```powershell
$pair = "admin:local_admin_only"
$token = [Convert]::ToBase64String(
  [Text.Encoding]::ASCII.GetBytes($pair)
)

Invoke-RestMethod `
  -Headers @{
    Authorization = "Basic $token"
  } `
  http://localhost:3000/api/datasources/uid/orders-prometheus/health
```

A senha não deve aparecer na evidence.

O script de validação precisa sanitizar headers.

---

### 10. Criar contrato de dashboard

Arquivo:

```text
dashboard-contract.yaml
```

Conteúdo:

```yaml
dashboard:
  uid:
    required

  title:
    required

  description:
    required

  owner:
    required

  datasourceUid:
    orders-prometheus

  refresh:
    minimum:
      15s

  timezone:
    browser-or-utc

  variables:
    bounded:
      required

  panels:
    question:
      required

    unit:
      requiredWhenApplicable

    noDataBehavior:
      required

    queryOwner:
      required

  alerts:
    deferred

  traces:
    deferredToLesson564
```

Cada dashboard precisa de owner e finalidade.

---

### 11. Planejar o dashboard executivo

Arquivo:

```text
orders-operational-overview.json
```

UID:

```text
orders-operational-overview.
```

Objetivo:

```text
responder em até um minuto
se a orders-api está coletada,
recebendo tráfego,
falhando,
lenta
ou saturada.
```

Rows:

```text
Service status;

Traffic and errors;

Latency;

Saturation;

Release context;

Data quality.
```

Não tente colocar todos os detalhes na primeira tela.

---

### 12. Criar painel de target

Tipo:

```text
Stat.
```

Consulta:

```promql
max(
  up{
    job="orders-api"
  }
)
```

Configuração:

```text
1:
UP.

0:
DOWN.

no data:
UNKNOWN.
```

Unidade:

```text
none.
```

Mapeamento de valores:

```text
1 → UP;

0 → DOWN.
```

Não transforme no data em zero.

---

### 13. Criar painel de tráfego

Tipo:

```text
Time series.
```

Consulta:

```promql
sum(
  rate(
    http_server_requests_seconds_count{
      job="orders-api",
      uri!~"/actuator.*"
    }[$__rate_interval]
  )
)
```

Unidade:

```text
requests per second.
```

Use:

```text
$__rate_interval.
```

Ele adapta a janela ao intervalo do dashboard e ao scrape interval.

Não fixe `[30s]` quando o scrape é 15 segundos e o volume é baixo.

---

### 14. Criar painel de error ratio

Consulta:

```promql
sum(
  rate(
    orders_creation_seconds_count{
      outcome=~"failure|timeout"
    }[$__rate_interval]
  )
)
/
clamp_min(
  sum(
    rate(
      orders_creation_seconds_count[
        $__rate_interval
      ]
    )
  ),
  0.000001
)
```

Unidade:

```text
percent 0.0–1.0.
```

O denominador precisa seguir o contrato da aula 561.

A expressão acima é didática e precisa ser adaptada aos nomes reais.

---

### 15. Criar painel de p95

Consulta:

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(
      orders_creation_seconds_bucket{
        outcome="success"
      }[$__rate_interval]
    )
  )
)
```

Unidade:

```text
seconds.
```

Título:

```text
Order creation latency p95.
```

Descrição:

```text
Estimated p95 for successful order creation.
Laboratory thresholds only.
```

Não chame threshold didático de SLO.

---

### 16. Criar painel de saturação

Consultas:

```promql
max(
  orders_internal_queue_size
)
```

e, quando disponível:

```promql
max(
  orders_internal_queue_size
)
/
clamp_min(
  max(
    orders_internal_queue_capacity
  ),
  1
)
```

Tipos possíveis:

- Gauge para proporção;
- Time series para tendência;
- Stat para valor atual.

A saturação precisa de limite.

Fila atual sem capacidade não informa headroom completo.

---

### 17. Criar painel de scrape duration

Consulta:

```promql
max(
  scrape_duration_seconds{
    job="orders-api"
  }
)
```

Unidade:

```text
seconds.
```

Compare visualmente com:

```text
scrape timeout:
5 seconds.
```

Não configure threshold vermelho exatamente no timeout sem margem operacional.

---

### 18. Criar painel de ausência de dados

Consulta:

```promql
absent(
  up{
    job="orders-api"
  }
)
```

Esse painel pode ser um Stat separado.

Estados:

```text
sem resultado:
target existe.

1:
target ausente.
```

Documente a semântica.

Um painel invertido sem descrição confunde.

---

### 19. Criar dashboard golden signals

Arquivo:

```text
orders-golden-signals.json
```

UID:

```text
orders-golden-signals.
```

Rows:

```text
Latency;

Traffic;

Errors;

Saturation;

Dependencies;

Messaging.
```

Cada row deve começar com uma pergunta.

Exemplo:

```text
Latency:
quanto tempo
operações bem-sucedidas
estão levando?
```

---

### 20. Painéis de latência

Inclua:

- p50;
- p95;
- p99;
- média;
- count;
- latência por outcome;
- latência HTTP;
- latência de negócio;
- processamento de mensagem.

Não sobreponha vinte séries sem legenda legível.

Quando necessário, use panels separados.

---

### 21. Painéis de tráfego

Inclua:

- requests por segundo;
- order operations por segundo;
- messages completed por segundo;
- retries por segundo;
- entrada versus conclusão.

A comparação entrada/conclusão ajuda a identificar backlog.

Use legendas:

```text
received;

completed;

retried.
```

Evite legenda baseada em todos os labels.

---

### 22. Painéis de erro

Inclua:

- error ratio;
- failures por categoria;
- timeouts;
- business rejections;
- HTTP status classes;
- messaging failures.

Rejeição de negócio e falha interna devem permanecer separadas.

Use Stack somente quando a soma possui sentido.

---

### 23. Painéis de saturação

Inclua:

- queue size;
- active tasks;
- JDBC active/max;
- JVM threads;
- memory pressure;
- CPU;
- consumer backlog disponível;
- scrape duration.

Nem toda utilização é saturação.

Descrição do painel deve explicar a relação com capacidade.

---

### 24. Criar dashboard de confiabilidade

Arquivo:

```text
orders-reliability.json
```

UID:

```text
orders-reliability.
```

Rows:

```text
SLI overview;

Availability;

Success;

Latency compliance;

Freshness;

Error budget;

Data quality;

Release comparison.
```

Os valores continuam didáticos.

Não publique como contrato externo.

---

### 25. Painel de SLI de disponibilidade

Consulta conceitual:

```promql
sum(
  rate(
    valid_order_responses_total[
      $__rate_interval
    ]
  )
)
/
clamp_min(
  sum(
    rate(
      valid_order_requests_total[
        $__rate_interval
      ]
    )
  ),
  0.000001
)
```

Quando as métricas reais usam outcomes de Timer, adapte conforme o catálogo.

Título:

```text
Order creation availability SLI.
```

Descrição deve incluir numerador e denominador.

---

### 26. Painel de compliance de latência

Consulta:

```promql
sum(
  rate(
    orders_creation_seconds_bucket{
      le="0.5",
      outcome="success"
    }[$__rate_interval]
  )
)
/
clamp_min(
  sum(
    rate(
      orders_creation_seconds_count{
        outcome="success"
      }[$__rate_interval]
    )
  ),
  0.000001
)
```

Isso representa a proporção dentro de 500 ms.

O bucket precisa existir.

O valor de 500 ms é didático.

---

### 27. Painel de error budget

Dados necessários:

- objetivo;
- SLI observado;
- eventos válidos;
- eventos ruins;
- budget total;
- budget consumido.

No laboratório, o painel pode usar consultas derivadas e uma constante versionada em configuração do dashboard.

Evite esconder a origem do objetivo.

Descrição:

```text
Laboratory SLO only.
Not a production commitment.
```

---

### 28. Criar variáveis

Arquivo:

```text
dashboard-variable-policy.yaml
```

Variáveis permitidas:

```text
environment;

job;

instance;

outcome;

channel.
```

Exemplo de query:

```promql
label_values(
  up,
  job
)
```

Outro:

```promql
label_values(
  up{
    job="$job"
  },
  instance
)
```

Variáveis precisam ser encadeadas com cuidado.

---

### 29. Não criar variáveis de alta cardinalidade

Variáveis proibidas:

- order ID;
- customer ID;
- correlation ID;
- trace ID;
- message ID;
- URL;
- exception message;
- timestamp.

Uma dropdown com milhares de valores não é investigação eficiente.

Detalhes de fluxo pertencem aos logs e futuramente aos traces.

---

### 30. Usar valores All com controle

A opção:

```text
Include All.
```

pode gerar regex muito ampla.

Defina:

```text
custom all value:
.*
```

somente quando a consulta foi desenhada para regex.

Use operador:

```promql
=~
```

Não use:

```promql
label="$variable"
```

com um valor regex.

---

### 31. Criar política de thresholds

Arquivo:

```text
dashboard-threshold-policy.yaml
```

Conteúdo:

```yaml
thresholds:
  targetUp:
    source:
      technical-state

    values:
      down:
        0

      up:
        1

  latency:
    status:
      laboratory-only

    source:
      hypothesis

  errorRatio:
    status:
      laboratory-only

  saturation:
    source:
      capacity-contract

  officialSlo:
    deferredUntilApproved
```

Cores não transformam hipótese em contrato.

O painel precisa declarar a fonte do threshold.

---

### 32. Configurar unidades

Unidades esperadas:

```text
seconds;

milliseconds;

requests per second;

ops per second;

bytes;

percent;

items;

connections;

short.
```

Não exiba:

```text
0.25
```

quando o significado é:

```text
25%.
```

A unidade incorreta muda interpretação.

---

### 33. Configurar legendas

Prefira legendas como:

```text
{{outcome}};

{{channel}};

{{instance}};

{{error_category}}.
```

Evite mostrar:

```text
todas as labels
em uma string longa.
```

A legenda precisa diferenciar séries sem expor labels irrelevantes.

---

### 34. Criar política de no data

Arquivo:

```text
dashboard-no-data-policy.yaml
```

Conteúdo:

```yaml
noData:
  targetStatus:
    display:
      UNKNOWN

    treatAsHealthy:
      false

  traffic:
    distinguish:
      - zero
      - missing

  errorRatio:
    zeroDenominator:
      display:
        NO_TRAFFIC

  percentile:
    insufficientSamples:
      display:
        LOW_CONFIDENCE

  datasourceFailure:
    display:
      DATASOURCE_ERROR
```

Zero, no data e erro de datasource são estados diferentes.

---

### 35. Evitar falsa saúde

Um Stat verde com valor zero pode significar:

- nenhum erro;
- nenhum tráfego;
- métrica ausente;
- query incorreta;
- target ausente;
- datasource quebrado.

Adicione painéis de:

- `up`;
- tráfego;
- ausência;
- scrape;
- last data.

Interprete error ratio somente quando existe denominador.

---

### 36. Criar annotations de release

Arquivo:

```text
dashboard-annotation-policy.yaml
```

Fonte possível:

```text
métrica ou série
que represente deploy;

ou annotation criada
por API local
durante simulação.
```

Campos:

- release ID;
- commit;
- timestamp;
- environment;
- change ID.

Não coloque Secret ou texto livre extenso.

As annotations ajudam a comparar antes e depois de deploy.

---

### 37. Criar annotation via API local

Exemplo:

```powershell
$body = @{
  dashboardUID = "orders-operational-overview"
  time = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  tags = @(
    "release",
    "orders-api"
  )
  text = "Release orders-api-local"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri `
  http://localhost:3000/api/annotations `
  -Headers @{
    Authorization = "Basic $token"
  } `
  -ContentType `
  "application/json" `
  -Body `
  $body
```

A credencial deve ficar fora da evidence.

No ambiente real, use identidade e integração apropriadas.

---

### 38. Criar links de dashboard

Links úteis conectam Overview, Golden signals, Reliability, Prometheus e runbooks.

Links precisam preservar:

- time range;
- environment;
- job;
- instance quando aplicável.

Não crie link para endpoint interno sensível.

---

### 39. Criar links para logs sem antecipar tracing

Como ainda não existe datasource de logs no laboratório, documente apenas o contrato futuro.

Exemplo:

```text
panel link:
investigate correlated logs.

required context:
time range;
release;
environment.
```

Não implemente integração OpenTelemetry ou trace-to-logs.

Essa evolução ficará para aulas posteriores.

---

### 40. Usar transformations com moderação

Transformations podem organizar a apresentação, mas também esconder lógica no dashboard.

Quando uma regra é importante para confiabilidade, prefira expressá-la em consulta ou documento versionado.

Use transformation apenas para apresentação.

---

### 41. Criar catálogo de painéis

Arquivo:

```text
dashboard-panel-catalog.yaml
```

Exemplo:

```yaml
panels:
  - id:
      service-target-status

    dashboard:
      orders-operational-overview

    question:
      Is Prometheus scraping the service?

    visualization:
      stat

    query:
      max(up{job="orders-api"})

    unit:
      none

    owner:
      platform

    noData:
      unknown

  - id:
      order-latency-p95

    dashboard:
      orders-golden-signals

    question:
      What is the successful order creation p95?

    visualization:
      time-series

    queryId:
      order-latency-p95

    unit:
      seconds

    owner:
      orders-team
```

O catálogo ajuda a revisar dashboards sem abrir a interface.

---

### 42. Criar política de versionamento

Arquivo:

```text
dashboard-versioning-policy.yaml
```

Regras:

```yaml
versioning:
  dashboardJson:
    required

  stableUid:
    required

  uiOnlyChanges:
    forbidden

  review:
    required

  generatedFields:
    normalized:
      required

  secrets:
    forbidden

  datasourceNumericId:
    forbidden

  datasourceUid:
    required
```

JSON exportado pode conter campos voláteis.

Normalize antes do commit.

---

### 43. Validar JSON

Script:

```text
validate-dashboard-json.ps1
```

Valide:

- JSON válido;
- UID;
- title;
- tags;
- datasource UID;
- refresh;
- timezone;
- panels;
- grid positions;
- queries;
- units;
- descriptions;
- no data;
- nenhuma credencial;
- nenhum ID numérico de datasource;
- nenhum URL corporativo.

Resultado:

```text
DASHBOARD_JSON_APPROVED
ou
DASHBOARD_JSON_BLOCKED.
```

---

### 44. Validar queries

Script:

```text
validate-dashboard-queries.ps1
```

Para cada expressão:

1. extraia do JSON;
2. substitua variáveis por valores de teste;
3. execute no Prometheus;
4. valide sintaxe;
5. valide resultado;
6. valide número de séries;
7. valide labels;
8. registre empty ou inconclusive;
9. não grave output completo.

Uma query sintaticamente válida pode retornar séries erradas.

---

### 45. Validar variáveis

Script:

```text
validate-dashboard-variables.ps1
```

Valide:

- nomes permitidos;
- query de valores;
- dependências entre variáveis;
- `All` controlado;
- regex;
- cardinalidade;
- valor padrão;
- refresh;
- ausência de IDs únicos.

Variável sem default pode abrir dashboard vazio.

---

### 46. Criar política de segurança

Arquivo:

```text
dashboard-security-policy.yaml
```

Conteúdo:

```yaml
security:
  anonymousAccess:
    laboratory:
      false

    production:
      forbiddenByDefault

  signup:
    false

  datasourceCredentials:
    storedInDashboard:
      forbidden

  publicDashboard:
    disabled

  adminPassword:
    realValueInGit:
      forbidden

  panelQueries:
    sensitiveLabels:
      forbidden

  snapshots:
    productionData:
      forbidden
```

Snapshots podem carregar dados.

Não publique snapshot com ambiente real sem governança.

---

### 47. Validar segurança

Script:

```text
validate-dashboard-security.ps1
```

Procure:

- password;
- token;
- API key;
- bearer;
- datasource basic auth;
- URL corporativa;
- user ID;
- email;
- query com labels proibidas;
- public dashboard;
- anonymous enabled;
- snapshot data;
- credential em annotation.

A credencial local fictícia pode existir apenas em arquivo específico do laboratório, com proibição explícita de uso real.

---

### 48. Simular cenário normal

Script:

```text
simulate-grafana-scenarios.ps1
```

Gere:

- tráfego estável;
- baixa taxa de erro;
- latência normal;
- fila baixa;
- target UP.

Valide:

- overview coerente;
- golden signals coerentes;
- SLI didático;
- ausência de no data inesperado;
- annotations.

Não valide apenas cores.

Valide consultas e valores.

---

### 49. Simular latência alta

Use a simulação controlada da aula 560.

Observe:

- p95;
- p99;
- média;
- traffic;
- errors;
- saturation;
- release annotation.

O dashboard deve permitir perceber:

```text
latência alta
com tráfego estável.
```

A hipótese não deve ser exibida como certeza.

---

### 50. Simular erro elevado

Gere falhas controladas.

Observe:

- error ratio;
- categorias;
- throughput;
- latência;
- target;
- health;
- SLI;
- budget didático.

Confirme que business rejection não aparece como internal failure.

---

### 51. Simular saturação

Gere fila local limitada.

Observe:

- queue size;
- capacity ratio;
- active tasks;
- throughput;
- latency;
- errors.

O painel deve mostrar tendência, não apenas valor atual.

---

### 52. Simular target DOWN

Pare a aplicação.

Observe:

- target status;
- absent;
- no traffic;
- queries vazias;
- datasource ainda saudável;
- Prometheus target DOWN.

O dashboard não deve mostrar:

```text
0% de erros
e tudo verde.
```

Ele precisa comunicar ausência de dados ou target indisponível.

---

### 53. Criar failure policy

Arquivo:

```text
grafana-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  datasourceUnavailable:
    display:
      DATASOURCE_ERROR

  targetDown:
    display:
      SERVICE_TARGET_DOWN

  queryEmpty:
    result:
      INCONCLUSIVE

  panelWithoutUnit:
    action:
      block-review

  highCardinalityVariable:
    action:
      block-release

  dashboardJsonInvalid:
    action:
      block-provisioning

  sensitiveDataDetected:
    action:
      block-release
```

A falha precisa ser explícita e verificável.

---

### 54. Criar matriz de testes

Arquivo:

```text
GRAFANA_TEST_MATRIX.md
```

Cenários:

- Compose válido;
- Grafana inicia;
- health OK;
- datasource provisionado;
- datasource health aprovado;
- folder criado;
- dashboards provisionados;
- UID estável;
- JSON válido;
- queries válidas;
- variables válidas;
- `All` controlado;
- Stat target UP;
- target DOWN;
- no data;
- traffic rate;
- error ratio;
- p95;
- saturation;
- SLI;
- annotation;
- links;
- units;
- legends;
- thresholds didáticos;
- datasource failure;
- security scan;
- cleanup;
- evidence sanitizada.

---

### 55. Criar troubleshooting

Arquivo:

```text
GRAFANA_TROUBLESHOOTING.md
```

Inclua:

- Grafana não inicia;
- volume sem permissão;
- datasource não aparece;
- datasource health falha;
- URL usa localhost;
- dashboard não provisiona;
- JSON inválido;
- UID duplicado;
- panel sem datasource;
- query retorna vazio;
- variável sem valores;
- opção All quebra query;
- unidade incorreta;
- legenda ilegível;
- no data tratado como zero;
- p95 sem buckets;
- threshold tratado como SLO;
- annotation sem aparecer;
- query gera muitas séries;
- dashboard muda apenas na UI;
- OpenTelemetry antecipado.

---

### 56. Coletar evidence

Script:

```text
collect-grafana-evidence.ps1
```

Arquivo:

```text
grafana-evidence.json.
```

A evidence pode conter identificação da aula, ambiente, versão, UIDs, health, contagens e status de queries, variables, no data, segurança, cenários, testes e timestamp.

Não inclua:

- senha;
- token;
- API key;
- screenshot com dados reais;
- séries completas;
- IDs de negócio;
- correlation IDs;
- trace IDs;
- dados pessoais.

---

### 57. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\grafana\validate-grafana-compose.ps1

.\scripts\observability\grafana\validate-grafana-provisioning.ps1

.\scripts\observability\grafana\validate-grafana-datasource.ps1

.\scripts\observability\grafana\validate-dashboard-json.ps1

.\scripts\observability\grafana\validate-dashboard-queries.ps1

.\scripts\observability\grafana\validate-dashboard-variables.ps1

.\scripts\observability\grafana\validate-dashboard-no-data.ps1

.\scripts\observability\grafana\validate-dashboard-security.ps1

.\scripts\observability\grafana\start-grafana-lab.ps1

.\scripts\observability\grafana\simulate-grafana-scenarios.ps1

.\scripts\observability\grafana\collect-grafana-evidence.ps1

.\scripts\observability\grafana\verify-grafana-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- Prometheus target UP;
- Grafana ativo;
- datasource saudável;
- folder provisionado;
- dashboards provisionados;
- UIDs estáveis;
- queries válidas;
- variables controladas;
- units corretas;
- no data tratado;
- annotations funcionando;
- segurança aprovada;
- scenarios executados;
- evidence sanitizada;
- OpenTelemetry não antecipado.

---

### 58. Encerrar o laboratório

Execute:

```powershell
docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  down
```

Quando o Grafana e o Prometheus estiverem no mesmo Compose, encerre pelo arquivo unificado.

Para remover volume local:

```powershell
docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  down `
  --volumes
```

Antes:

- colete evidence;
- confirme o arquivo;
- confirme que o volume é local;
- confirme ausência de dados necessários.

Não execute limpeza global do Docker.

---

## Entendendo o que foi feito

### O Prometheus ganhou visualização

Consultas deixaram de depender apenas da interface de PromQL.

### Dashboards ganharam propósito

Cada conjunto de painéis passou a responder perguntas específicas.

### Datasource ganhou UID

Referências deixaram de depender de IDs dinâmicos.

### Provisioning ganhou versionamento

Dashboards e conexões passaram a ser recriáveis.

### Golden signals ganharam leitura integrada

Latência, tráfego, erros e saturação puderam ser comparados na mesma janela.

### SLIs ganharam contexto visual

Numeradores, denominadores e objetivos didáticos ficaram explícitos.

### No data ganhou semântica

Ausência deixou de ser mostrada como zero saudável.

### Releases ganharam annotations

Mudanças puderam ser comparadas com o comportamento observado.

### Segurança ganhou política

Credenciais, snapshots e dashboards públicos passaram a ser controlados.

### A próxima aula ganhou ponto de integração

OpenTelemetry poderá adicionar traces e contexto padronizado a uma base visual já organizada.

---

## Erros comuns importantes

### Usar `localhost` no datasource

Dentro do container, ele aponta para o próprio Grafana.

### Alterar dashboard apenas pela UI

O repositório deixa de ser fonte da verdade.

### Usar ID numérico de datasource

O dashboard quebra em outro ambiente.

### Tratar no data como zero

A indisponibilidade vira falsa saúde.

### Exibir muitas séries

O gráfico perde legibilidade.

### Criar variáveis com IDs

A cardinalidade e o tempo de carregamento explodem.

### Usar cor sem contrato

O painel comunica severidade falsa.

### Chamar threshold de SLO

O valor didático vira compromisso indevido.

### Salvar senha no JSON

A credencial entra no Git.

### Antecipar OpenTelemetry

A instrumentação OTLP e os traces pertencem à aula 564.

---

## Comandos úteis

### Subir Grafana

```powershell
docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  up `
  --detach
```

### Consultar health

```powershell
Invoke-RestMethod `
  http://localhost:3000/api/health
```

### Validar dashboards

```powershell
.\scripts\observability\grafana\validate-dashboard-json.ps1
```

### Simular cenários

```powershell
.\scripts\observability\grafana\simulate-grafana-scenarios.ps1
```

### Encerrar

```powershell
docker compose `
  --file `
  observability/grafana/grafana-compose.yml `
  down
```

---

## Exercício guiado

### Parte 1 — Compose

Suba Grafana local.

### Parte 2 — Datasource

Provisione Prometheus por UID.

### Parte 3 — Overview

Crie target, tráfego, erros, p95 e saturação.

### Parte 4 — Golden signals

Organize as quatro perspectivas.

### Parte 5 — Reliability

Visualize SLIs e budget didático.

### Parte 6 — Variables

Crie filtros limitados.

### Parte 7 — No data

Diferencie zero, missing e datasource error.

### Parte 8 — Annotations

Marque releases.

### Parte 9 — Validation

Valide JSON, queries, variables e segurança.

### Parte 10 — Evidence

Simule cenários, registre e encerre.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 562 e ponte para a aula 564 foram preservadas;
- Grafana, datasource, dashboard, panel, query, variable, annotation, threshold, unit, legend, transformation, provisioning, UID e no data foram definidos;
- baseline da aplicação e Prometheus foi validada;
- target Prometheus ficou `UP`;
- Compose do Grafana foi criado;
- image tag conhecida foi usada;
- `latest` não foi usado;
- credencial local é fictícia;
- signup e anonymous access estão desabilitados;
- datasource Prometheus foi provisionado;
- datasource usa UID estável;
- datasource não usa ID numérico;
- URL interna usa network correta;
- contrato do datasource foi criado;
- dashboard provider foi criado;
- folder possui UID estável;
- UI-only changes são proibidas;
- contrato de dashboard foi criado;
- dashboard executivo foi criado;
- dashboard golden signals foi criado;
- dashboard de confiabilidade foi criado;
- target status diferencia UP, DOWN e UNKNOWN;
- tráfego usa `$__rate_interval`;
- error ratio respeita o contrato de confiabilidade;
- p95 usa histogram e label `le`;
- saturação possui referência de capacidade;
- scrape duration foi visualizada;
- ausência de target foi tratada;
- latência, tráfego, erros e saturação possuem rows próprias;
- rejeições de negócio e falhas internas permanecem separadas;
- SLIs didáticos possuem numerador e denominador documentados;
- error budget não foi tratado como SLA;
- variáveis possuem allowlist;
- IDs únicos não viram variáveis;
- opção All usa regex de forma controlada;
- thresholds possuem fonte e status;
- unidades foram configuradas corretamente;
- legends são legíveis;
- política de no data foi criada;
- zero, missing e datasource error são diferentes;
- falsa saúde foi evitada;
- annotations de release foram criadas;
- annotations não carregam Secrets;
- links preservam time range e filtros;
- integração de logs e traces não foi antecipada;
- transformations são usadas apenas para apresentação;
- catálogo de painéis foi criado;
- política de versionamento foi criada;
- JSON foi validado;
- queries foram executadas no Prometheus;
- variables foram validadas;
- política de segurança foi criada;
- snapshots com dados reais são proibidos;
- cenários normal, latência, erros, saturação e target DOWN foram simulados;
- failure policy foi criada;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhum Secret real, dado pessoal ou cloud pública foi usado;
- OpenTelemetry, OTLP, Collector e traces não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/grafana `
  scripts/observability/grafana `
  docs/observability/grafana `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure credenciais e dados proibidos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|token|api[_-]?key|bearer|order_id|customer_id|correlation_id|trace_id|message_id|email|latest"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): criar dashboards no Grafana"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- volume do Grafana;
- senha real;
- API key;
- snapshots;
- screenshots com dados reais;
- séries completas;
- IDs;
- configuração OpenTelemetry;
- material da aula 564.

---

## Fechamento e ponte para a próxima aula

Nesta aula, as métricas Prometheus da `orders-api` foram organizadas em dashboards Grafana.

Você criou:

```text
datasource provisionado;

folder versionado;

dashboard executivo;

dashboard golden signals;

dashboard de confiabilidade;

variáveis;

annotations;

links;

políticas;

testes.
```

Você comprovou que dashboard precisa responder a uma pergunta; datasource deve usar UID estável; provisioning torna o ambiente reproduzível; dashboards precisam ser versionados; `$__rate_interval` ajuda a criar rates coerentes; p95 depende de histogram buckets; thresholds precisam de fonte; units mudam interpretação; legends precisam ser legíveis; zero, no data e datasource error são estados diferentes; target DOWN não pode gerar painéis verdes; variáveis precisam de baixa cardinalidade; annotations ajudam a comparar releases; transformations não devem esconder regra crítica; e segurança inclui credenciais, acesso anônimo, snapshots e conteúdo das queries.

A próxima aula será:

```text
564 - M18.09 - OpenTelemetry
```

Nela, você irá introduzir uma abordagem padronizada para gerar e exportar telemetria, preparar traces distribuídos e conectar spans, atributos e recursos ao contexto da aplicação.

Nenhuma implementação de OpenTelemetry, OTLP, Collector, Java Agent, span, baggage, sampling ou tracing distribuído foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Subi Grafana e validei health.
- [ ] Provisionei datasource e folder.
- [ ] Criei overview, golden signals e reliability.
- [ ] Configurei variables, units e legends.
- [ ] Tratei no data e datasource error.
- [ ] Criei annotations e links.
- [ ] Validei JSON, queries e segurança.
- [ ] Coletei evidence e encerrei o laboratório.

---

## Troubleshooting adicional

### Grafana inicia, mas datasource falha

Revise network e evite `localhost` dentro do container.

### Dashboard não aparece

Revise provider, path, permissões, JSON e logs.

### Painel mostra `No data`

Execute a query no Prometheus e valide variables.

### Painel mostra zero com target DOWN

Revise a política de no data e adicione target status.

### p95 não aparece

Confirme buckets, tráfego e `$__rate_interval`.

### Variável fica vazia

Revise datasource, query e dependências entre variables.

### O dashboard volta ao estado anterior

A mudança feita na UI não foi versionada.

### O número de séries fica enorme

Revise queries, legendas e variables de alta cardinalidade.

### Threshold parece contrato

Marque como didático ou remova.

### OpenTelemetry começou a ser instalado

Preserve a instrumentação para a aula 564.

---

## Perguntas de revisão

1. O que é Grafana?
2. O que é datasource?
3. O que é dashboard?
4. O que é panel?
5. O que é variable?
6. O que é annotation?
7. Por que usar provisioning?
8. Por que usar UID?
9. Por que evitar ID numérico?
10. Para que serve `$__rate_interval`?
11. Como tratar no data?
12. Qual diferença entre zero e missing?
13. Por que configurar unit?
14. Qual risco de thresholds?
15. Qual risco de variables com IDs?
16. Como validar uma query?
17. O que é dashboard-as-code?
18. Qual risco de snapshots?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Plataforma de visualização.
2. Conexão com fonte de dados.
3. Conjunto de painéis.
4. Unidade visual e de consulta.
5. Filtro parametrizado.
6. Evento temporal.
7. Reprodutibilidade.
8. Identidade estável.
9. Muda entre ambientes.
10. Janela adequada para rate.
11. Estado explícito.
12. Valor real versus ausência.
13. Evitar interpretação errada.
14. Virar compromisso falso.
15. Cardinalidade e lentidão.
16. Executar no datasource.
17. Dashboards versionados.
18. Exposição de dados.
19. OpenTelemetry.
20. OpenTelemetry.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 563 - M18.08 - Grafana

- Continuei após Prometheus.
- Criei ambiente Grafana local.
- Usei image tag conhecida e retenção local.
- Provisionei datasource Prometheus por UID.
- Configurei network interna entre Grafana e Prometheus.
- Provisionei folder e dashboards.
- Adotei dashboard-as-code.
- Criei dashboard executivo operacional.
- Criei dashboard de golden signals.
- Criei dashboard de confiabilidade.
- Visualizei target, tráfego, erros, p95 e saturação.
- Usei `$__rate_interval` nas taxas.
- Mantive `le` nas consultas de histogramas.
- Documentei numeradores e denominadores dos SLIs.
- Mantive SLOs e thresholds como didáticos.
- Criei variables controladas.
- Proibi IDs únicos como variables.
- Configurei units e legends.
- Diferenciei zero, no data e datasource error.
- Evitei falsa saúde com target DOWN.
- Criei annotations de release.
- Criei links entre dashboards e runbooks.
- Usei transformations apenas para apresentação.
- Criei catálogo de painéis.
- Criei política de versionamento.
- Validei JSON, queries e variables.
- Criei política de segurança.
- Simulei normalidade, latência, erros, saturação e target DOWN.
- Coletei evidence sanitizada.
- Não antecipei OpenTelemetry ou tracing distribuído.
- Próxima aula: OpenTelemetry.
```

---

## Referência técnica curta

- Grafana Data Sources.
- Grafana Provisioning.
- Grafana Dashboards.
- Grafana Variables.
- Grafana Annotations.
- Grafana Time Series Panels.
- Grafana Stat Panels.
- Grafana Units and Thresholds.
- Grafana Dashboard JSON Model.
- Dashboard-as-Code.

Regra final:

```text
dashboards Grafana precisam transformar PromQL em decisões operacionais sem ocultar limitações: o datasource Prometheus usa UID estável, network interna e provisioning, folders e dashboards são versionados como código e alterações apenas na UI são proibidas; overview, golden signals e reliability organizam target, tráfego, erros, latência, saturação, SLIs e error budget didático, usando unidades, legendas, descrições e perguntas explícitas; variables aceitam somente dimensões limitadas, $__rate_interval orienta rates, histogram_quantile preserva le, thresholds possuem fonte e não viram SLO automaticamente; zero, no data, target DOWN e datasource error são estados diferentes, annotations marcam releases, links preservam contexto, transformations não escondem regras críticas e queries são validadas diretamente no Prometheus; credenciais, snapshots, acesso anônimo e dados sensíveis permanecem controlados, deixando para a aula 564 a introdução de OpenTelemetry, OTLP, Collector, spans e tracing distribuído.
```
