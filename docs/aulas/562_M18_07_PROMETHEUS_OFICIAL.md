# 562 - M18.07 - Prometheus

## Apresentação da aula

Na aula 561, a `orders-api` passou a possuir contratos de confiabilidade.

Você definiu:

```text
SLIs;

SLOs didáticos;

eventos válidos;

eventos bons;

numeradores;

denominadores;

janelas;

error budget;

fronteira de SLA.
```

Esses contratos responderam:

```text
o que medir?

qual comportamento
é considerado aceitável?

qual tolerância
de falha existe?
```

Ainda falta uma peça importante:

```text
como coletar,
armazenar
e consultar
essas métricas
ao longo do tempo?
```

O Prometheus é um sistema de monitoramento orientado a séries temporais.

Ele coleta métricas por meio de scraping, armazena amostras localmente e permite consultas usando PromQL.

No laboratório, ele será responsável por coletar métricas expostas pela `orders-api` por meio do Actuator e do Micrometer.

O fluxo será:

```text
orders-api;

endpoint
/actuator/prometheus;

Prometheus;

scrape;

séries temporais;

PromQL;

evidence.
```

A aplicação já possui:

- logs estruturados;
- correlation ID;
- trace ID;
- Actuator;
- métricas Micrometer;
- golden signals;
- SLIs e SLOs didáticos.

Agora você irá conectar essa instrumentação a um backend de métricas.

A pergunta central desta aula será:

```text
como disponibilizar
métricas da aplicação

para coleta confiável,

validar targets,
séries,
labels
e consultas

sem criar
cardinalidade,
exposição
ou retenção
incontroladas?
```

Você irá criar um ambiente local com:

- registry Prometheus;
- endpoint de exposição;
- `prometheus.yml`;
- target estático;
- scrape interval;
- scrape timeout;
- labels controladas;
- health do target;
- consultas básicas;
- rates;
- increases;
- histogramas;
- percentis por histogram quantile;
- resets;
- ausência de dados;
- validação de séries;
- troubleshooting;
- evidence sanitizada.

A aula não irá criar:

- dashboards Grafana;
- painéis;
- variáveis de dashboard;
- provisionamento de dashboards;
- visualizações;
- alertas visuais;
- links entre painéis;
- navegação operacional em Grafana.

Esses tópicos pertencem à próxima aula oficial:

```text
563 - M18.08 - Grafana
```

Também não será criado um ambiente Prometheus de produção.

Não haverá:

- alta disponibilidade;
- federation;
- remote write;
- long-term storage;
- Thanos;
- Cortex;
- Mimir;
- autenticação corporativa;
- TLS real;
- cloud pública;
- retenção de produção.

A regra central será:

```text
uma série
precisa possuir

nome estável,
labels controladas,
origem conhecida
e pergunta operacional.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
560:
Golden signals.

561:
SLI SLO SLA.

562:
Prometheus.

563:
Grafana.
```

A progressão é:

```text
Micrometer:
instrumentação.

golden signals:
organização.

SLI e SLO:
contrato.

Prometheus:
coleta e consulta.

Grafana:
visualização.
```

Nesta aula:

```text
Prometheus:
sim.

scraping:
sim.

target:
sim.

PromQL:
sim.

rates:
sim.

histogram quantile:
sim.

labels:
sim.

retention local:
sim.

Docker Compose:
sim.

Grafana:
não.

dashboards:
não.

alerting:
não aprofundado.

remote write:
não.
```

A progressão prática será:

```text
1.
expor métricas.

2.
subir Prometheus.

3.
configurar target.

4.
validar scraping.

5.
consultar séries.

6.
interpretar rates.

7.
consultar histogramas.

8.
validar qualidade.

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
pom.xml

src/main/resources
├── application-observability.yml
└── application-prometheus.yml

observability/prometheus
├── prometheus.yml
├── prometheus-compose.yml
├── prometheus-target-contract.yaml
├── prometheus-series-contract.yaml
├── prometheus-label-policy.yaml
├── prometheus-query-catalog.yaml
├── prometheus-retention-policy.yaml
├── prometheus-data-quality-policy.yaml
├── prometheus-failure-policy.yaml
├── prometheus-scenarios.yaml
└── prometheus-evidence.yaml

scripts/observability/prometheus
├── validate-prometheus-dependencies.ps1
├── validate-prometheus-endpoint.ps1
├── validate-prometheus-config.ps1
├── start-prometheus-lab.ps1
├── validate-prometheus-targets.ps1
├── simulate-prometheus-traffic.ps1
├── execute-promql-catalog.ps1
├── validate-prometheus-series.ps1
├── scan-prometheus-labels.ps1
├── collect-prometheus-evidence.ps1
└── verify-prometheus-baseline.ps1

docs/observability/prometheus
├── PROMETHEUS_OVERVIEW.md
├── PROMETHEUS_SCRAPING.md
├── PROMETHEUS_LABEL_POLICY.md
├── PROMQL_FOUNDATIONS.md
├── PROMETHEUS_HISTOGRAMS.md
├── PROMETHEUS_DATA_QUALITY.md
├── PROMETHEUS_TEST_MATRIX.md
└── PROMETHEUS_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
endpoint Prometheus;

registry configurado;

Prometheus local;

target UP;

scraping validado;

séries conhecidas;

labels governadas;

consultas documentadas;

histogramas consultáveis;

data quality validada;

evidence sanitizada.
```

Você irá:

1. validar a baseline;
2. adicionar registry;
3. configurar endpoint;
4. definir exposure;
5. criar configuração Prometheus;
6. criar Compose;
7. subir o laboratório;
8. validar target;
9. gerar tráfego;
10. consultar métricas;
11. calcular rate;
12. calcular increase;
13. consultar histogramas;
14. calcular quantis;
15. analisar gauges;
16. tratar resets;
17. tratar ausência;
18. validar labels;
19. validar cardinalidade;
20. validar retenção;
21. criar catálogo;
22. executar cenários;
23. coletar evidence;
24. executar gate;
25. commitar;
26. preparar a aula 563.

---

## Conceito essencial

### Prometheus

Sistema de monitoramento e séries temporais baseado em scraping e consultas PromQL.

---

### Scrape

Coleta periódica de métricas em um target.

---

### Target

Endpoint monitorado pelo Prometheus.

---

### Sample

Valor de uma série em um instante.

---

### Time series

Sequência de amostras identificada por nome e labels.

---

### Metric name

Nome principal da série.

---

### Label

Dimensão que participa da identidade da série.

---

### Scrape interval

Intervalo entre coletas.

---

### Scrape timeout

Tempo máximo permitido para uma coleta.

---

### PromQL

Linguagem de consulta do Prometheus.

---

### Instant vector

Conjunto de séries com uma amostra por série em um instante.

---

### Range vector

Conjunto de séries com várias amostras em uma janela.

---

### Counter

Série monotônica sujeita a reset.

---

### Gauge

Série que pode subir ou descer.

---

### Histogram

Família de séries que representa distribuição por buckets.

---

### Staleness

Estado no qual uma série deixa de receber amostras recentes.

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

Inicie a aplicação:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability"
```

Confirme:

- `/actuator/health`;
- `/actuator/info`;
- `/actuator/metrics`;
- métricas customizadas;
- golden signals;
- SLIs documentados;
- nenhum Secret real;
- nenhuma configuração Prometheus existente sem inventário.

Registre a baseline.

---

### 2. Adicionar o registry Prometheus

No `pom.xml`, adicione:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

A versão deve ser gerenciada pela plataforma do Spring Boot.

Não declare versão manual sem necessidade.

Execute:

```powershell
mvn `
  --batch-mode `
  dependency:tree `
  "-Dincludes=io.micrometer:micrometer-registry-prometheus"
```

Confirme:

- uma única versão;
- compatibilidade com Micrometer;
- ausência de conflito;
- ausência de registry adicional não utilizado.

---

### 3. Expor o endpoint Prometheus

Crie:

```text
application-prometheus.yml
```

Configuração:

```yaml
management:
  endpoints:
    web:
      exposure:
        include:
          - health
          - info
          - prometheus

  endpoint:
    prometheus:
      access: unrestricted
```

A configuração exata pode variar conforme a versão do Spring Boot.

O princípio permanece:

```text
exposure explícita.
```

Não use wildcard.

Em produção, o endpoint precisa de rede e política de acesso adequadas.

No laboratório, ele ficará acessível apenas no ambiente local controlado.

---

### 4. Validar o endpoint

Inicie:

```powershell
mvn `
  spring-boot:run `
  "-Dspring-boot.run.profiles=local,observability,prometheus"
```

Consulte:

```powershell
Invoke-WebRequest `
  http://localhost:8080/actuator/prometheus
```

Confirme:

- status 200;
- content type de texto Prometheus;
- métricas JVM;
- métricas HTTP;
- métricas customizadas;
- nenhum Secret;
- nenhuma tag proibida.

O output é texto, não JSON.

---

### 5. Entender o formato

Exemplo:

```text
# HELP orders_creation_seconds Order creation duration
# TYPE orders_creation_seconds histogram
orders_creation_seconds_count{channel="api",outcome="success"} 10
orders_creation_seconds_sum{channel="api",outcome="success"} 1.25
```

O backend transforma nomes Micrometer para convenção Prometheus.

Exemplo:

```text
orders.creation
```

pode virar:

```text
orders_creation_seconds.
```

Não use o nome transformado dentro do código Java.

---

### 6. Criar contrato do endpoint

Arquivo:

```text
prometheus-target-contract.yaml
```

Conteúdo:

```yaml
target:
  job:
    orders-api

  metricsPath:
    /actuator/prometheus

  scheme:
    http

  scrapeInterval:
    15s

  scrapeTimeout:
    5s

  expectedStatus:
    UP

  production:
    publicExposure:
      forbidden

  sensitiveData:
    forbidden
```

O endpoint precisa responder mais rápido que o timeout.

---

### 7. Criar configuração Prometheus

Arquivo:

```text
prometheus.yml
```

Conteúdo:

```yaml
global:
  scrape_interval: 15s
  scrape_timeout: 5s
  evaluation_interval: 15s

scrape_configs:
  - job_name: orders-api
    metrics_path: /actuator/prometheus
    static_configs:
      - targets:
          - host.docker.internal:8080
        labels:
          environment: local
          service: orders-api
```

No Linux, `host.docker.internal` pode exigir configuração adicional.

Uma alternativa é executar a aplicação e o Prometheus na mesma network do Compose.

Documente a estratégia usada.

---

### 8. Não duplicar labels

A aplicação já pode exportar:

```text
application;

environment.
```

Se o scrape também adicionar os mesmos nomes com valores diferentes, ocorrerá conflito ou ambiguidade.

Defina responsabilidade:

```text
application labels:
origem na instrumentação.

infrastructure labels:
origem no scrape.
```

Exemplos de labels de infraestrutura:

- job;
- instance;
- cluster lógico;
- namespace controlado.

Evite repetir environment em duas origens sem contrato.

---

### 9. Criar Compose do Prometheus

Arquivo:

```text
prometheus-compose.yml
```

Conteúdo:

```yaml
services:
  prometheus:
    image: prom/prometheus:v3.5.0
    container_name: orders-prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --storage.tsdb.retention.time=24h
      - --web.enable-lifecycle
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  prometheus-data:
```

Use uma tag conhecida.

Não use `latest`.

A retenção é curta e didática.

---

### 10. Criar política de retenção

Arquivo:

```text
prometheus-retention-policy.yaml
```

Conteúdo:

```yaml
retention:
  laboratory:
    time:
      24h

    persistentVolume:
      allowed

  production:
    defined:
      false

    longTermStorage:
      notConfigured

  cleanup:
    required

  sensitiveSeries:
    forbidden
```

Retenção longa aumenta:

- disco;
- custo;
- responsabilidade;
- risco de dados indevidos;
- tempo de compactação.

O laboratório não precisa de retenção extensa.

---

### 11. Subir o laboratório

Script:

```text
start-prometheus-lab.ps1
```

Execute:

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  up `
  --detach
```

Valide:

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  ps

docker logs `
  orders-prometheus `
  --tail 100
```

Confirme:

- container ativo;
- configuração carregada;
- porta 9090;
- volume criado;
- nenhum erro de parsing.

---

### 12. Validar configuração

Use a ferramenta disponível na imagem.

Exemplo:

```powershell
docker run `
  --rm `
  --volume `
  "${PWD}/observability/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro" `
  prom/prometheus:v3.5.0 `
  promtool `
  check config `
  /etc/prometheus/prometheus.yml
```

Quando a imagem não expuser o binário dessa forma, execute `promtool` em container dedicado.

O gate precisa validar a configuração antes do deploy local.

---

### 13. Validar o target

Abra:

```text
http://localhost:9090/targets
```

Ou consulte a API:

```powershell
Invoke-RestMethod `
  http://localhost:9090/api/v1/targets
```

Confirme:

- job `orders-api`;
- health `up`;
- scrape URL correta;
- last scrape recente;
- scrape duration;
- last error vazio.

Target `DOWN` não é problema de query.

Primeiro corrija conectividade ou endpoint.

---

### 14. Diagnosticar target DOWN

Verifique:

1. aplicação ativa;
2. profile Prometheus;
3. endpoint 200;
4. host correto;
5. porta;
6. network;
7. firewall;
8. timeout;
9. path;
10. logs do Prometheus.

Comandos:

```powershell
Invoke-WebRequest `
  http://localhost:8080/actuator/prometheus

docker exec `
  orders-prometheus `
  wget `
  --quiet `
  --output-document=- `
  http://host.docker.internal:8080/actuator/prometheus
```

A ferramenta dentro da imagem pode variar.

Use o recurso disponível sem alterar a imagem de produção da aplicação.

---

### 15. Consultar `up`

PromQL:

```promql
up{job="orders-api"}
```

Resultado:

```text
1:
último scrape bem-sucedido.

0:
falha de scrape.
```

`up = 1` não significa que a aplicação está funcional.

Significa que o Prometheus conseguiu coletar o endpoint.

Combine com health, erros e sinais.

---

### 16. Consultar duração do scrape

PromQL:

```promql
scrape_duration_seconds{job="orders-api"}
```

Compare com:

```text
scrape_timeout.
```

Se a duração se aproxima do timeout:

- endpoint pesado;
- rede lenta;
- volume de séries alto;
- target sobrecarregado;
- timeout inadequado.

O endpoint de métricas precisa ser eficiente.

---

### 17. Criar contrato de séries

Arquivo:

```text
prometheus-series-contract.yaml
```

Conteúdo:

```yaml
series:
  required:
    - up
    - scrape_duration_seconds
    - http_server_requests_seconds_count
    - orders_creation_seconds_count
    - orders_creation_seconds_sum

  forbiddenLabels:
    - order_id
    - customer_id
    - correlation_id
    - trace_id
    - message_id
    - email
    - exception_message

  metadata:
    help:
      requiredForCustomMetrics

    type:
      requiredForCustomMetrics
```

Use nomes reais do output.

O script deve descobrir e validar o nome transformado.

---

### 18. Consultar um Counter

Uma métrica Counter exportada termina frequentemente com:

```text
_total.
```

Exemplo:

```promql
orders_rejection_total
```

O valor absoluto representa o acumulado da instância.

Para observar taxa:

```promql
rate(orders_rejection_total[5m])
```

Para observar aumento:

```promql
increase(orders_rejection_total[30m])
```

Não use `rate` sem range vector.

---

### 19. Entender `rate`

`rate` calcula taxa média por segundo sobre a janela.

Exemplo:

```promql
sum(
  rate(
    orders_creation_seconds_count{
      outcome="success"
    }[5m]
  )
)
```

Essa consulta mostra operações bem-sucedidas por segundo.

Use uma janela compatível com:

- scrape interval;
- volume;
- volatilidade;
- objetivo.

Uma janela muito curta pode produzir ruído.

---

### 20. Entender `increase`

`increase` estima o aumento do Counter na janela.

Exemplo:

```promql
sum(
  increase(
    orders_creation_seconds_count[30m]
  )
)
```

É útil para responder:

```text
quantas operações
ocorreram no período?
```

O Prometheus considera resets de Counter.

Não calcule manualmente apenas:

```text
último - primeiro.
```

---

### 21. Consultar taxa de erro

Exemplo conceitual:

```promql
sum(
  rate(
    orders_creation_seconds_count{
      outcome=~"failure|timeout"
    }[5m]
  )
)
/
sum(
  rate(
    orders_creation_seconds_count[5m]
  )
)
```

A definição precisa corresponder ao SLI.

Rejeições de negócio não devem ser incluídas automaticamente.

PromQL não corrige uma definição ruim.

---

### 22. Consultar tráfego

Exemplo HTTP:

```promql
sum(
  rate(
    http_server_requests_seconds_count{
      uri!~"/actuator.*"
    }[5m]
  )
)
```

Exclua endpoints operacionais quando a pergunta é tráfego de negócio.

Evite filtrar por URI bruta de alta cardinalidade.

Use route templates exportados pelo framework.

---

### 23. Consultar latência média

Forma:

```promql
sum(
  rate(
    orders_creation_seconds_sum[5m]
  )
)
/
sum(
  rate(
    orders_creation_seconds_count[5m]
  )
)
```

Isso calcula média aproximada na janela.

A média não substitui percentis.

Ela ainda pode ser útil para tendências.

---

### 24. Entender histogramas

Um histogram gera:

```text
_metric_bucket;

_metric_count;

_metric_sum.
```

Exemplo:

```text
orders_creation_seconds_bucket{
  le="0.5"
}
```

`le` representa o limite superior do bucket.

Os buckets são cumulativos.

---

### 25. Calcular p95

PromQL:

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(
      orders_creation_seconds_bucket{
        outcome="success"
      }[5m]
    )
  )
)
```

Para preservar dimensões:

```promql
histogram_quantile(
  0.95,
  sum by (le, channel) (
    rate(
      orders_creation_seconds_bucket{
        outcome="success"
      }[5m]
    )
  )
)
```

Não remova `le`.

Ele é necessário para o cálculo.

---

### 26. Interpretar histogram quantile

O resultado é uma estimativa baseada nos buckets.

A precisão depende:

- limites configurados;
- distribuição;
- volume;
- janela;
- agregação.

Buckets muito largos produzem estimativas menos precisas.

Buckets excessivos aumentam séries.

A política da aula 559 continua válida.

---

### 27. Consultar saturação

Gauge de fila:

```promql
orders_internal_queue_size
```

Quando houver capacidade:

```promql
orders_internal_queue_size
/
orders_internal_queue_capacity
```

Conexões:

```promql
hikaricp_connections_active
/
hikaricp_connections_max
```

Os nomes dependem da instrumentação disponível.

Valide no endpoint antes de escrever a consulta definitiva.

---

### 28. Consultar tarefas ativas

Exemplo:

```promql
orders_messaging_active
```

Combine com throughput:

```promql
sum(
  rate(
    orders_messaging_processing_seconds_count[5m]
  )
)
```

Tarefas ativas altas com throughput baixo podem indicar bloqueio ou lentidão.

---

### 29. Criar catálogo de consultas

Arquivo:

```text
prometheus-query-catalog.yaml
```

Exemplo:

```yaml
queries:
  - id:
      target-up

    expression:
      up{job="orders-api"}

    question:
      Is scraping working?

  - id:
      order-throughput

    expression:
      sum(rate(orders_creation_seconds_count[5m]))

    question:
      How many order operations per second?

  - id:
      order-error-ratio

    expression:
      reliability-contract-expression

    question:
      What proportion of eligible operations failed?

  - id:
      order-latency-p95

    expression:
      histogram-quantile-expression

    question:
      What is the p95 successful order creation latency?
```

Cada consulta precisa de pergunta e owner.

---

### 30. Criar política de labels

Arquivo:

```text
prometheus-label-policy.yaml
```

Conteúdo:

```yaml
labels:
  allowed:
    - job
    - instance
    - application
    - environment
    - outcome
    - channel
    - operation
    - error_category

  forbidden:
    - order_id
    - customer_id
    - correlation_id
    - trace_id
    - span_id
    - message_id
    - email
    - url
    - exception_message

  scrapeLabels:
    owner:
      infrastructure

  applicationLabels:
    owner:
      application
```

A identidade de uma série inclui todos os labels.

Um novo valor cria uma nova série.

---

### 31. Controlar `instance`

O label `instance` normalmente identifica o target.

Em laboratório:

```text
host.docker.internal:8080.
```

Em ambientes dinâmicos, o valor pode mudar quando Pods mudam.

Consultas agregadas precisam decidir:

- somar instâncias;
- manter instância;
- agrupar por release;
- comparar replicas.

Não use `instance` como identidade de usuário.

---

### 32. Entender staleness

Quando um target desaparece:

- novas amostras deixam de chegar;
- a série se torna stale;
- consultas instantâneas deixam de retornar o valor depois do comportamento de staleness.

Ausência de série não significa zero.

Use funções e consultas adequadas.

Exemplo:

```promql
absent(
  up{job="orders-api"}
)
```

Isso ajuda a detectar ausência do target.

Não substitui um alerta completo nesta aula.

---

### 33. Tratar ausência de dados

Arquivo:

```text
prometheus-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  targetDown:
    analysis:
      blocked

  missingSeries:
    result:
      inconclusive

  staleSeries:
    result:
      inconclusive

  counterReset:
    queries:
      rate-or-increase

  labelDrift:
    action:
      block-comparison

  lowSampleCount:
    action:
      mark-low-confidence

  duplicateTargets:
    action:
      investigate
```

Prometheus armazenar dados não garante que a coleta está correta.

---

### 34. Consultar resets

PromQL:

```promql
resets(
  orders_creation_seconds_count[30m]
)
```

Resets podem ocorrer por:

- restart;
- redeploy;
- crash;
- scale;
- processo reiniciado.

Um reset não é necessariamente falha.

Ele precisa ser correlacionado com deploy e health.

---

### 35. Consultar mudanças

Para Gauge:

```promql
changes(
  orders_internal_queue_size[30m]
)
```

Isso mostra quantas vezes o valor mudou.

Não representa quantidade processada.

Gauge precisa ser interpretado como estado.

---

### 36. Validar metadata

Use a API:

```powershell
Invoke-RestMethod `
  http://localhost:9090/api/v1/metadata
```

Confirme para métricas customizadas:

- type;
- help;
- unit, quando disponível.

Metadata ausente reduz clareza.

Ela não altera a série, mas melhora governança.

---

### 37. Validar séries pela API

Exemplo:

```powershell
Invoke-RestMethod `
  "http://localhost:9090/api/v1/series?match[]=orders_creation_seconds_count"
```

Valide:

- labels permitidos;
- número de séries;
- ausência de IDs;
- environment coerente;
- job coerente;
- instance esperada.

O número de séries precisa permanecer dentro do budget.

---

### 38. Gerar tráfego

Script:

```text
simulate-prometheus-traffic.ps1
```

Gere:

- sucessos;
- rejeições;
- falhas controladas;
- payloads variados;
- tarefas de mensageria;
- fila interna variando.

Aguarde múltiplos scrapes.

Sem amostras suficientes, `rate` e histogramas podem não produzir resultado útil.

---

### 39. Executar catálogo de PromQL

Script:

```text
execute-promql-catalog.ps1
```

Para cada query:

- execute via API;
- registre status;
- registre quantidade de séries;
- valide tipo;
- valide valores não negativos;
- marque empty;
- marque inconclusive;
- não grave IDs sensíveis.

A evidence precisa guardar resumo, não output completo.

---

### 40. Criar cenários

Arquivo:

```text
prometheus-scenarios.yaml
```

Cenários:

```text
target UP;

target DOWN;

scrape timeout;

counter reset;

traffic increase;

error increase;

latency increase;

queue saturation;

missing series;

label drift;

duplicate target;

low sample count.
```

Cada cenário precisa de:

- setup;
- sinal;
- PromQL;
- resultado esperado;
- cleanup;
- evidence.

---

### 41. Simular target DOWN

Pare temporariamente a aplicação.

Observe:

```promql
up{job="orders-api"}
```

Resultado esperado:

```text
0.
```

Consulte:

```text
last error
```

na página de targets.

Reinicie a aplicação.

Confirme recuperação.

Não remova a configuração para simular falha.

---

### 42. Simular scrape timeout

Use um endpoint fake controlado ou configuração temporária de timeout no laboratório.

Não torne o endpoint real deliberadamente lento em código de produção.

Observe:

- target DOWN;
- scrape duration;
- last error;
- ausência de novas amostras.

Restaure a configuração.

---

### 43. Validar cardinalidade

Script:

```text
scan-prometheus-labels.ps1
```

O script deve:

- consultar séries;
- listar nomes de labels;
- comparar allowlist;
- detectar UUID;
- detectar email;
- detectar IDs;
- estimar combinações;
- comparar budget;
- bloquear violação.

Resultado:

```text
PROMETHEUS_LABELS_APPROVED
ou
PROMETHEUS_LABELS_BLOCKED.
```

---

### 44. Validar configuração de scrape

Script:

```text
validate-prometheus-config.ps1
```

Valide:

- YAML;
- job único esperado;
- path;
- target;
- interval;
- timeout menor que interval;
- sem credentials;
- sem endpoint público;
- sem wildcard de discovery;
- retenção local;
- image tag conhecida.

---

### 45. Criar failure policy

Arquivo:

```text
prometheus-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  targetDown:
    action:
      investigate-connectivity-and-endpoint

  scrapeTimeout:
    action:
      inspect-duration-and-series-volume

  configInvalid:
    action:
      block-lab-start

  forbiddenLabel:
    action:
      block-release

  cardinalityExceeded:
    action:
      block-release

  missingMetric:
    action:
      mark-query-inconclusive

  localStorageFull:
    action:
      cleanup-or-reduce-retention
```

O comportamento precisa ser previsível.

---

### 46. Criar matriz de testes

Arquivo:

```text
PROMETHEUS_TEST_MATRIX.md
```

Cenários:

- registry presente;
- endpoint 200;
- content type correto;
- config válida;
- container ativo;
- target UP;
- target DOWN;
- scrape timeout;
- `up`;
- scrape duration;
- rate de Counter;
- increase;
- error ratio;
- traffic rate;
- latency average;
- histogram quantile;
- Gauge;
- saturation ratio;
- reset;
- absent;
- metadata;
- labels permitidos;
- label proibido;
- cardinalidade budget;
- low samples;
- cleanup;
- evidence sanitizada.

---

### 47. Criar troubleshooting

Arquivo:

```text
PROMETHEUS_TROUBLESHOOTING.md
```

Inclua:

- `/actuator/prometheus` retorna 404;
- registry ausente;
- target DOWN;
- path incorreto;
- host inacessível;
- Docker network;
- scrape timeout;
- query vazia;
- `rate` sem dados;
- Counter reset;
- p95 sem buckets;
- `le` removido;
- label duplicado;
- cardinalidade alta;
- séries stale;
- storage cheio;
- config inválida;
- target duplicado;
- metadata ausente;
- Grafana antecipado.

---

### 48. Coletar evidence

Script:

```text
collect-prometheus-evidence.ps1
```

Arquivo:

```text
prometheus-evidence.json.
```

Campos permitidos:

- lesson;
- application;
- environment;
- Prometheus version;
- target status;
- scrape interval;
- scrape timeout;
- endpoint status;
- custom series count;
- query catalog status;
- rate status;
- histogram status;
- label policy status;
- cardinality status;
- data quality status;
- tests status;
- timestamp.

Não inclua:

- séries completas;
- IDs de negócio;
- correlation IDs;
- trace IDs;
- payloads;
- credentials;
- hostnames corporativos;
- dados pessoais.

---

### 49. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\prometheus\validate-prometheus-dependencies.ps1

.\scripts\observability\prometheus\validate-prometheus-endpoint.ps1

.\scripts\observability\prometheus\validate-prometheus-config.ps1

.\scripts\observability\prometheus\start-prometheus-lab.ps1

.\scripts\observability\prometheus\validate-prometheus-targets.ps1

.\scripts\observability\prometheus\simulate-prometheus-traffic.ps1

.\scripts\observability\prometheus\execute-promql-catalog.ps1

.\scripts\observability\prometheus\validate-prometheus-series.ps1

.\scripts\observability\prometheus\scan-prometheus-labels.ps1

.\scripts\observability\prometheus\collect-prometheus-evidence.ps1

.\scripts\observability\prometheus\verify-prometheus-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- registry presente;
- endpoint disponível;
- configuration válida;
- Prometheus ativo;
- target UP;
- scrapes recentes;
- queries aprovadas;
- rate e increase aprovados;
- histogram quantile aprovado;
- gauges aprovados;
- resets tratados;
- labels aprovados;
- cardinalidade dentro do budget;
- evidence sanitizada;
- Grafana não antecipado.

---

### 50. Encerrar o laboratório

Execute:

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  down
```

Para remover o volume:

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  down `
  --volumes
```

Antes de remover:

- colete evidence;
- confirme que o volume é local;
- confirme que não há dados necessários;
- confirme o arquivo Compose.

Não use limpeza Docker global.

---

## Entendendo o que foi feito

### Métricas ganharam backend

A instrumentação passou a ser coletada e armazenada como séries.

### Scraping ganhou contrato

Path, interval, timeout e target foram definidos explicitamente.

### Targets ganharam estado

Falhas de coleta deixaram de ser confundidas com falhas de query.

### Counters ganharam taxa

`rate` e `increase` passaram a tratar janelas e resets.

### Histogramas ganharam consulta

Buckets foram combinados com `histogram_quantile`.

### Labels ganharam governança

A identidade das séries passou a ser auditada.

### Qualidade ganhou validação

Missing, stale, reset e baixa amostragem passaram a ser considerados.

### Retenção ganhou limite

O laboratório deixou de armazenar dados indefinidamente.

### PromQL ganhou catálogo

Consultas passaram a possuir pergunta, owner e contrato.

### A próxima aula ganhou fonte de dados

O Grafana poderá visualizar séries já validadas.

---

## Erros comuns importantes

### Adicionar Prometheus sem registry

O endpoint não aparece.

### Expor `*` no Actuator

A superfície operacional cresce sem controle.

### Tratar target DOWN como query vazia

A coleta precisa ser corrigida primeiro.

### Usar Counter absoluto como taxa

A janela e o reset são ignorados.

### Calcular p95 sem histogram

A distribuição necessária não existe.

### Remover `le`

`histogram_quantile` deixa de funcionar corretamente.

### Criar labels com IDs

A cardinalidade explode.

### Duplicar environment

A série ganha identidade ambígua.

### Usar ausência como zero

Missing data vira falsa saúde.

### Antecipar Grafana

A visualização pertence à aula 563.

---

## Comandos úteis

### Consultar endpoint

```powershell
Invoke-WebRequest `
  http://localhost:8080/actuator/prometheus
```

### Consultar targets

```powershell
Invoke-RestMethod `
  http://localhost:9090/api/v1/targets
```

### Consultar PromQL

```powershell
Invoke-RestMethod `
  "http://localhost:9090/api/v1/query?query=up%7Bjob%3D%22orders-api%22%7D"
```

### Consultar séries

```powershell
Invoke-RestMethod `
  "http://localhost:9090/api/v1/series?match[]=orders_creation_seconds_count"
```

### Encerrar laboratório

```powershell
docker compose `
  --file `
  observability/prometheus/prometheus-compose.yml `
  down
```

---

## Exercício guiado

### Parte 1 — Registry

Adicione e valide a dependência.

### Parte 2 — Endpoint

Exponha `/actuator/prometheus`.

### Parte 3 — Config

Crie `prometheus.yml`.

### Parte 4 — Compose

Suba o Prometheus local.

### Parte 5 — Target

Valide `UP` e scraping.

### Parte 6 — Queries

Execute `rate`, `increase` e ratios.

### Parte 7 — Histogram

Calcule p95.

### Parte 8 — Labels

Valide allowlist e cardinalidade.

### Parte 9 — Failures

Simule target DOWN e missing data.

### Parte 10 — Evidence

Colete resultados e encerre o laboratório.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 561 e ponte para a aula 563 foram preservadas;
- Prometheus, scrape, target, sample, time series, labels, interval, timeout, PromQL, vectors, histogram e staleness foram definidos;
- baseline do Actuator e Micrometer foi validada;
- registry Prometheus foi adicionado sem conflito;
- endpoint `/actuator/prometheus` foi configurado;
- exposure permanece explícita;
- wildcard permanece proibido;
- output possui métricas JVM, HTTP e customizadas;
- contrato do target foi criado;
- `prometheus.yml` foi criado;
- scrape interval e timeout foram definidos;
- timeout é menor que interval;
- Compose usa image tag conhecida;
- retenção local foi definida;
- nenhum `latest` foi usado;
- configuração foi validada com `promtool`;
- laboratório foi iniciado;
- target `orders-api` ficou `UP`;
- scrape URL e last scrape foram verificados;
- target DOWN foi diagnosticado;
- métrica `up` foi consultada;
- scrape duration foi analisada;
- contrato de séries foi criado;
- HELP e TYPE foram validados;
- Counter absoluto não foi tratado como taxa;
- `rate` foi usado com range vector;
- `increase` foi usado para eventos por janela;
- taxa de erro respeita o contrato de SLI;
- tráfego exclui endpoints operacionais quando necessário;
- média de latência foi calculada por sum e count;
- histogramas foram explicados;
- p95 foi calculado com `histogram_quantile`;
- label `le` foi preservado;
- precisão e custo de buckets foram registrados;
- gauges e saturação foram consultados;
- catálogo de consultas foi criado;
- cada query possui pergunta e owner;
- política de labels foi criada;
- labels de aplicação e infraestrutura possuem ownership;
- IDs únicos são proibidos;
- label `instance` foi interpretado corretamente;
- staleness foi explicada;
- ausência de série não foi tratada como zero;
- policy de data quality foi criada;
- resets foram consultados;
- metadata foi validada;
- séries foram consultadas pela API;
- tráfego de laboratório foi gerado;
- múltiplos scrapes foram aguardados;
- catálogo PromQL foi executado;
- cenários foram criados;
- target DOWN e scrape timeout foram simulados;
- labels foram escaneados;
- cardinalidade ficou dentro do budget;
- failure policy foi criada;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- cleanup é específico;
- nenhuma cloud pública, credencial ou dado pessoal foi usado;
- Grafana e dashboards não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-prometheus.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/prometheus `
  scripts/observability/prometheus `
  docs/observability/prometheus `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure labels e dados proibidos:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "order_id|customer_id|correlation_id|trace_id|message_id|email|password|token|exception_message|latest"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): integrar metricas ao Prometheus"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- volume de dados;
- séries exportadas completas;
- IDs;
- credentials;
- logs completos;
- dashboards;
- provisioning Grafana;
- material da aula 563.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a `orders-api` passou a disponibilizar suas métricas para um Prometheus local.

Você configurou:

```text
Micrometer registry;

endpoint Prometheus;

scrape config;

target;

séries;

labels;

PromQL;

retenção;

quality checks.
```

Você comprovou que scraping precisa de target, interval, timeout e path coerentes; `up = 1` significa coleta bem-sucedida, não saúde funcional completa; Counters precisam de `rate` ou `increase`; resets precisam ser considerados; histogramas exigem buckets e label `le`; percentis calculados pelo Prometheus são estimativas; labels formam a identidade da série; IDs únicos não pertencem às labels; ausência de série não é zero; staleness, baixa amostragem e label drift afetam conclusões; e retenção local precisa ser limitada e limpa.

A próxima aula será:

```text
563 - M18.08 - Grafana
```

Nela, você irá conectar o Grafana ao Prometheus e criar visualizações operacionais para latência, tráfego, erros, saturação, SLIs e estado dos targets.

Nenhum dashboard, painel, variável, provisioning ou visualização completa do Grafana foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Adicionei o registry Prometheus.
- [ ] Expus o endpoint com allowlist.
- [ ] Criei configuração e Compose.
- [ ] Validei target e scraping.
- [ ] Executei consultas PromQL.
- [ ] Consultei histogramas e gauges.
- [ ] Validei labels e cardinalidade.
- [ ] Coletei evidence e encerrei o laboratório.

---

## Troubleshooting adicional

### `/actuator/prometheus` retorna 404

Revise registry, profile e exposure.

### Target permanece `DOWN`

Teste o endpoint a partir do container Prometheus.

### `rate` retorna vazio

Aguarde scrapes suficientes e revise a janela.

### p95 retorna vazio

Confirme histogram buckets e tráfego.

### `histogram_quantile` retorna valor estranho

Revise agregação, `le`, buckets e volume.

### O número de séries cresce

Liste labels e procure dimensões dinâmicas.

### `up` está 1, mas a API falha

Combine com health, erros e logs.

### A série desapareceu

Revise target, restart, staleness e labels.

### O disco cresce

Reduza retenção e faça cleanup do volume local.

### Um dashboard começou a ser criado

Preserve a visualização para a aula 563.

---

## Perguntas de revisão

1. O que é Prometheus?
2. O que é scrape?
3. O que é target?
4. O que é time series?
5. O que identifica uma série?
6. O que é scrape interval?
7. O que significa `up`?
8. Quando usar `rate`?
9. Quando usar `increase`?
10. Como tratar reset?
11. O que é histogram?
12. Para que serve `le`?
13. Como calcular p95?
14. O que é staleness?
15. Ausência significa zero?
16. Qual risco de labels dinâmicas?
17. Como validar cardinalidade?
18. Por que limitar retenção?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Sistema de séries temporais.
2. Coleta periódica.
3. Endpoint monitorado.
4. Amostras ao longo do tempo.
5. Nome e labels.
6. Frequência da coleta.
7. Último scrape funcionou.
8. Taxa de Counter.
9. Aumento na janela.
10. Funções conscientes de reset.
11. Distribuição em buckets.
12. Limite superior.
13. `histogram_quantile`.
14. Série sem amostras recentes.
15. Não.
16. Explosão de séries.
17. Consultar e comparar budget.
18. Disco, custo e responsabilidade.
19. Grafana.
20. Grafana.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 562 - M18.07 - Prometheus

- Continuei após SLI SLO SLA.
- Adicionei o registry Prometheus ao Micrometer.
- Expus `/actuator/prometheus` por allowlist.
- Validei o formato de exposição.
- Criei contrato de target e séries.
- Criei `prometheus.yml`.
- Configurei scrape interval, timeout, job e target.
- Criei Compose com image tag conhecida.
- Defini retenção local de laboratório.
- Validei a configuração com `promtool`.
- Subi o Prometheus local.
- Validei target `UP`, last scrape e scrape duration.
- Diagnostiquei target `DOWN`.
- Consultei `up`.
- Usei `rate` para taxas.
- Usei `increase` para eventos por janela.
- Criei consulta de error ratio.
- Consultei tráfego e latência média.
- Entendi histogram buckets, count e sum.
- Calculei p95 com `histogram_quantile`.
- Preservei o label `le`.
- Consultei gauges e saturação.
- Criei catálogo de PromQL.
- Criei política de labels.
- Proibi IDs únicos nas séries.
- Considerei staleness, missing data e resets.
- Validei metadata e séries pela API.
- Simulei tráfego, falhas e target DOWN.
- Escaneei labels e cardinalidade.
- Coletei evidence sanitizada.
- Não antecipei dashboards Grafana.
- Próxima aula: Grafana.
```

---

## Referência técnica curta

- Prometheus Data Model.
- Prometheus Scraping.
- Prometheus Configuration.
- PromQL Basics.
- Counter `rate`.
- Counter `increase`.
- Prometheus Histograms.
- `histogram_quantile`.
- Target Health.
- Prometheus Staleness.

Regra final:

```text
a integração com Prometheus precisa coletar séries controladas e consultáveis: o registry expõe `/actuator/prometheus` por allowlist, o scrape possui job, path, interval e timeout explícitos, a configuração é validada antes do laboratório e o target precisa ficar UP com last scrape recente; métricas Counter são analisadas com rate ou increase para respeitar janelas e resets, histogramas usam bucket, count, sum e label le para calcular quantis, Gauges representam estado e saturação depende de capacidade; nomes e labels formam a identidade das séries, portanto IDs de negócio, correlation ID, trace ID, mensagens e dados pessoais permanecem proibidos; missing data, staleness, label drift, baixo volume e targets duplicados tornam análises incompletas, retenção local é limitada e o cleanup é específico; consultas PromQL são catalogadas por pergunta e owner, deixando para a aula 563 a criação de dashboards e visualizações no Grafana.
```
