# 559 - M18.04 - Micrometer

## Apresentação da aula

Na aula 558, a `orders-api` ganhou uma superfície operacional controlada com Spring Boot Actuator.

A aplicação passou a responder perguntas como:

```text
o processo está vivo?

a instância está pronta?

qual release está executando?

quais componentes
participam do health?
```

Essas respostas representam o estado atual.

Entretanto, operação em produção também exige compreender comportamento ao longo do tempo.

Imagine que a API está `UP`, mas:

- o número de pedidos rejeitados aumenta;
- a latência cresce gradualmente;
- o consumer processa menos mensagens;
- a fila interna se aproxima do limite;
- o tamanho dos payloads cresce;
- tarefas longas permanecem em execução;
- o cache perde eficiência;
- a quantidade de operações com timeout aumenta;
- uma release apresenta comportamento diferente da anterior.

Health checks não foram criados para responder a essas perguntas.

Logs ajudam a investigar eventos individuais.

Métricas ajudam a observar tendências, taxas, distribuições e estados agregados.

O Micrometer fornece uma fachada de instrumentação para aplicações JVM.

A aplicação registra métricas por uma API estável, evitando espalhar dependência de fornecedor pelo código.

Você trabalhará com:

```text
MeterRegistry;

Counter;

Timer;

Gauge;

DistributionSummary;

LongTaskTimer;

MeterBinder;

tags;

common tags;

MeterFilter;

naming;

cardinalidade;

histogramas;

percentis;

testes.
```

Pergunta central:

```text
como transformar
comportamentos relevantes
da aplicação

em métricas
úteis,
consistentes,
econômicas
e testáveis?
```

Uma métrica ruim pode ser tecnicamente válida e operacionalmente inútil.

Exemplo:

```text
orders.
```

Esse nome não informa:

- o que está sendo medido;
- qual unidade;
- qual resultado;
- qual operação;
- se o valor é contador ou estado;
- quem é responsável;
- como consultar;
- qual risco de cardinalidade existe.

Uma métrica melhor pode representar:

```text
orders.creation.completed
```

com tags controladas:

```text
outcome=success;

channel=api.
```

O valor do identificador do pedido não deve virar tag.

A regra central será:

```text
métrica representa
uma pergunta operacional;

nome,
tipo
e tags

precisam ser definidos
antes da instrumentação.
```

A aula abordará:

- diferença entre logs e métricas;
- modelo dimensional;
- `MeterRegistry`;
- escolha do tipo de meter;
- convenção de nomes;
- unidades;
- tags;
- cardinalidade;
- timers;
- counters;
- gauges;
- summaries;
- long tasks;
- binders;
- filtros;
- instrumentação de domínio;
- instrumentação de mensageria;
- testes com `SimpleMeterRegistry`;
- scan de tags proibidas;
- evidence.

A aula não aprofundará golden signals, SLI, SLO, error budget, alertas, dashboards ou PromQL.

Esses tópicos começam na próxima aula oficial:

```text
560 - M18.05 - Golden signals
```

Nesta aula, você criará a base de métricas que permitirá essa análise posterior.

---

## Onde estamos na formação

A sequência oficial é:

```text
556:
Logs estruturados.

557:
Correlation ID trace ID.

558:
Actuator.

559:
Micrometer.

560:
Golden signals.
```

A evolução do Módulo 18 está formando uma pilha:

```text
logs estruturados:
eventos individuais.

correlation e trace IDs:
identidade do fluxo.

Actuator:
estado operacional atual.

Micrometer:
medidas agregadas
ao longo do tempo.
```

Nesta aula:

```text
MeterRegistry:
sim.

Counter:
sim.

Timer:
sim.

Gauge:
sim.

DistributionSummary:
sim.

LongTaskTimer:
sim.

MeterBinder:
sim.

tags:
sim.

cardinalidade:
sim.

MeterFilter:
sim.

testes:
sim.

Golden signals:
não aprofundado.

SLO:
não.

alertas finais:
não.

dashboards:
não.
```

A progressão será:

```text
1.
definir perguntas.

2.
escolher tipos.

3.
definir nomes.

4.
governar tags.

5.
instrumentar.

6.
testar.

7.
validar custo
e utilidade.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
src/main/java
└── .../observability/metrics
    ├── MetricNames.java
    ├── MetricTagNames.java
    ├── MetricOutcome.java
    ├── OrderMetrics.java
    ├── MessagingMetrics.java
    ├── OperationalStateMetrics.java
    ├── OrdersMetricsBinder.java
    ├── MetricsConfiguration.java
    ├── MetricsCardinalityPolicy.java
    └── MetricsMeterFilter.java

src/test/java
└── .../observability/metrics
    ├── OrderMetricsTest.java
    ├── MessagingMetricsTest.java
    ├── OperationalStateMetricsTest.java
    ├── MetricsMeterFilterTest.java
    ├── MetricsNamingContractTest.java
    ├── MetricsCardinalityContractTest.java
    └── MetricsIntegrationTest.java

observability/metrics
├── metrics-contract.yaml
├── metrics-catalog.yaml
├── metric-type-decision-matrix.yaml
├── metrics-tag-policy.yaml
├── metrics-cardinality-budget.yaml
├── metrics-histogram-policy.yaml
├── metrics-failure-policy.yaml
└── micrometer-evidence.yaml

scripts/observability/metrics
├── validate-micrometer-dependencies.ps1
├── validate-metrics-catalog.ps1
├── validate-metric-types.ps1
├── validate-metric-tags.ps1
├── validate-cardinality-budget.ps1
├── simulate-business-metrics.ps1
├── inspect-actuator-metrics.ps1
├── scan-metrics-output.ps1
├── collect-micrometer-evidence.ps1
└── verify-micrometer-baseline.ps1

docs/observability/metrics
├── MICROMETER_OVERVIEW.md
├── METRICS_CATALOG.md
├── METRIC_TYPE_GUIDE.md
├── METRIC_TAG_POLICY.md
├── METRICS_CARDINALITY.md
├── METRICS_TEST_MATRIX.md
└── METRICS_TROUBLESHOOTING.md
```

Ao final, você terá catálogo, tipos justificados, nomes e unidades padronizados, tags controladas, budget de cardinalidade, instrumentação, testes e evidence.

Você irá:

1. validar a baseline;
2. validar as dependências;
3. definir perguntas operacionais;
4. criar catálogo;
5. escolher tipos de meter;
6. padronizar nomes;
7. padronizar tags;
8. definir cardinalidade;
9. criar counters;
10. criar timers;
11. criar gauges;
12. criar distribution summaries;
13. criar long task timer;
14. criar binder;
15. criar filters;
16. instrumentar pedidos;
17. instrumentar mensageria;
18. medir estados;
19. testar;
20. simular;
21. inspecionar Actuator;
22. escanear output;
23. coletar evidence;
24. executar gate;
25. commitar;
26. preparar a aula 560.

---

## Conceito essencial

### Métrica

Medida numérica agregada ao longo do tempo.

---

### Meter

Abstração do Micrometer que representa uma métrica registrada.

---

### MeterRegistry

Registro central no qual meters são criados e consultados.

---

### Counter

Valor cumulativo que somente aumenta durante a vida da instância.

---

### Timer

Meter usado para contar eventos e medir sua duração.

---

### Gauge

Leitura do valor atual de um estado observado.

---

### DistributionSummary

Distribuição de valores que não representam duração.

---

### LongTaskTimer

Medição de tarefas que permanecem ativas por tempo significativo.

---

### Tag

Dimensão formada por chave e valor.

---

### Cardinalidade

Quantidade de combinações distintas de valores de tags.

---

### MeterBinder

Componente que registra um conjunto relacionado de métricas.

---

### MeterFilter

Política aplicada ao registro de meters.

---

### Histogram

Distribuição dos valores observados em buckets.

---

### Percentil

Valor abaixo do qual determinada proporção das observações se encontra.

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

Consulte:

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/metrics
```

Confirme:

- Actuator ativo;
- endpoint de metrics conforme política local;
- métricas JVM disponíveis;
- release ID conhecida;
- logs estruturados;
- contexto de correlação;
- nenhum Secret real;
- nenhuma métrica customizada do domínio ainda.

Registre a baseline.

---

### 2. Validar as dependências

O Spring Boot Actuator integra a aplicação ao Micrometer.

Confirme no `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Para testes, utilize as dependências já gerenciadas pelo projeto.

O `SimpleMeterRegistry` pode ser usado diretamente em testes unitários.

Execute:

```powershell
mvn `
  --batch-mode `
  dependency:tree `
  "-Dincludes=io.micrometer"
```

Valide:

- uma família coerente de versões;
- nenhuma versão manual conflitante;
- nenhum registry externo adicionado sem necessidade;
- nenhuma dependência duplicada.

Nesta aula, não é obrigatório adicionar Prometheus.

---

### 3. Começar pelas perguntas

Antes de criar uma métrica, escreva a pergunta.

Exemplos:

```text
quantas criações de pedido
terminaram por resultado?
```

```text
quanto tempo
a criação de pedido
demora?
```

```text
quantas mensagens
estão em processamento?
```

```text
qual é o tamanho atual
da fila interna?
```

```text
qual o tamanho
dos payloads aceitos?
```

Métrica sem pergunta tende a virar ruído.

---

### 4. Criar contrato de métricas

Arquivo:

```text
metrics-contract.yaml
```

Conteúdo:

```yaml
metrics:
  naming:
    convention:
      lowercase-dot-notation

  baseUnit:
    requiredWhenApplicable

  description:
    required

  tags:
    allowlist:
      required

  cardinality:
    budget:
      required

  identifiers:
    businessIdsAsTags:
      forbidden

    correlationIdAsTag:
      forbidden

    traceIdAsTag:
      forbidden

  sensitiveData:
    forbidden

  tests:
    required
```

A convenção de nomes do Micrometer utiliza palavras minúsculas separadas por pontos.

O registry pode adaptar o nome ao backend escolhido.

---

### 5. Criar catálogo de nomes

Arquivo:

```text
MetricNames.java
```

Exemplo:

```java
package com.formacao.orders.observability.metrics;

public final class MetricNames {

    public static final String ORDER_CREATION =
            "orders.creation";

    public static final String ORDER_REJECTION =
            "orders.rejection";

    public static final String ORDER_PAYLOAD_SIZE =
            "orders.payload.size";

    public static final String MESSAGE_PROCESSING =
            "orders.messaging.processing";

    public static final String MESSAGE_ACTIVE =
            "orders.messaging.active";

    public static final String INTERNAL_QUEUE_SIZE =
            "orders.internal.queue.size";

    private MetricNames() {
    }
}
```

Evite nomes ligados a uma ferramenta:

```text
prometheus_orders_total.
```

A instrumentação representa domínio e operação.

---

### 6. Criar catálogo de tags

Arquivo:

```text
MetricTagNames.java
```

Exemplo:

```java
package com.formacao.orders.observability.metrics;

public final class MetricTagNames {

    public static final String OUTCOME = "outcome";
    public static final String CHANNEL = "channel";
    public static final String OPERATION = "operation";
    public static final String MESSAGE_TYPE = "message.type";
    public static final String RETRYABLE = "retryable";
    public static final String DEPENDENCY = "dependency";

    private MetricTagNames() {
    }
}
```

Tags precisam de nomes e valores estáveis, sem dados pessoais, IDs únicos, texto livre, URL bruta ou exception message.

---

### 7. Criar outcomes controlados

Arquivo:

```text
MetricOutcome.java
```

Exemplo:

```java
package com.formacao.orders.observability.metrics;

public enum MetricOutcome {
    SUCCESS("success"),
    REJECTED("rejected"),
    FAILURE("failure"),
    TIMEOUT("timeout"),
    CANCELLED("cancelled");

    private final String value;

    MetricOutcome(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
```

Não aceite outcome vindo diretamente de entrada externa.

Mapeie para valores conhecidos.

---

### 8. Criar matriz de decisão de tipos

Arquivo:

```text
metric-type-decision-matrix.yaml
```

Conteúdo:

```yaml
decisions:
  completedOperations:
    type:
      timer

    reason:
      count-and-duration

  rejectedOperations:
    type:
      counter

    reason:
      monotonic-event-count

  currentQueueSize:
    type:
      gauge

    reason:
      current-state

  payloadSize:
    type:
      distribution-summary

    reason:
      non-time-distribution

  activeLongProcessing:
    type:
      long-task-timer

    reason:
      active-duration
```

Não use Gauge para contar eventos concluídos.

Não use Counter quando o Timer já produz contagem e duração da mesma operação.

---

### 9. Compreender Counter

Counter representa uma quantidade cumulativa.

Exemplo:

```java
Counter.builder(
        MetricNames.ORDER_REJECTION)
    .description(
        "Number of rejected order creation attempts")
    .tag(
        MetricTagNames.OUTCOME,
        MetricOutcome.REJECTED.value())
    .register(meterRegistry);
```

Incremento:

```java
rejectionCounter.increment();
```

Um Counter não deve diminuir.

Para observar uma taxa, o backend calcula variação ao longo do tempo.

Não interprete o valor absoluto isoladamente como taxa.

---

### 10. Evitar Counter duplicado

Um Timer já registra:

- quantidade;
- tempo total;
- valores de duração;
- distribuição quando configurada.

Se você criar:

```text
orders.creation counter;

orders.creation timer.
```

para o mesmo evento e mesmas tags, poderá duplicar contagem.

Use Counter separado apenas quando a pergunta for diferente.

Exemplo:

```text
rejeições antes
de iniciar o processamento cronometrado.
```

Registre a decisão no catálogo.

---

### 11. Compreender Timer

Timer mede duração de eventos curtos e também registra contagem.

Exemplo:

```java
Timer.builder(
        MetricNames.ORDER_CREATION)
    .description(
        "Order creation duration")
    .tag(
        MetricTagNames.CHANNEL,
        "api")
    .register(meterRegistry);
```

Uso:

```java
return timer.record(
        () -> orderCreator.create(command));
```

Quando o outcome só é conhecido ao final, use timers separados por outcome ou registre a amostra no timer correspondente.

---

### 12. Usar `Timer.Sample`

Exemplo:

```java
var sample = Timer.start(meterRegistry);

try {
    var order = orderCreator.create(command);

    sample.stop(
            orderMetrics.timer(
                    MetricOutcome.SUCCESS));

    return order;
} catch (BusinessRuleException exception) {
    sample.stop(
            orderMetrics.timer(
                    MetricOutcome.REJECTED));

    throw exception;
} catch (RuntimeException exception) {
    sample.stop(
            orderMetrics.timer(
                    MetricOutcome.FAILURE));

    throw exception;
}
```

O relógio e o registry ficam encapsulados pelo Micrometer.

Garanta que toda saída do fluxo finalize a amostra.

---

### 13. Criar `OrderMetrics`

Arquivo:

```text
OrderMetrics.java
```

Exemplo:

```java
package com.formacao.orders.observability.metrics;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

public final class OrderMetrics {

    private final MeterRegistry meterRegistry;

    public OrderMetrics(
            MeterRegistry meterRegistry) {

        this.meterRegistry = meterRegistry;
    }

    public Timer timer(
            MetricOutcome outcome) {

        return Timer.builder(
                        MetricNames.ORDER_CREATION)
                .description(
                        "Order creation duration")
                .tag(
                        MetricTagNames.OUTCOME,
                        outcome.value())
                .tag(
                        MetricTagNames.CHANNEL,
                        "api")
                .register(meterRegistry);
    }
}
```

Registrar o mesmo nome com o mesmo conjunto de tags retorna o meter correspondente no registry.

Mesmo assim, evite registrar dinamicamente com valores não controlados.

---

### 14. Compreender Gauge

Gauge observa o valor atual de um objeto ou função.

Exemplo:

```java
Gauge.builder(
        MetricNames.INTERNAL_QUEUE_SIZE,
        queue,
        Queue::size)
    .description(
        "Current number of elements in the internal queue")
    .baseUnit("items")
    .register(meterRegistry);
```

Gauge é adequado para:

- tamanho atual;
- quantidade ativa;
- capacidade disponível;
- estado numérico instantâneo.

O objeto observado precisa permanecer fortemente referenciado pela aplicação quando necessário.

Não crie um objeto temporário que será coletado.

---

### 15. Não atualizar Gauge como Counter

Código inadequado:

```java
gaugeValue.incrementAndGet();
```

para representar eventos concluídos.

Se o valor cresce continuamente e nunca representa estado atual, use Counter.

Pergunta para Gauge:

```text
qual é o valor agora?
```

Pergunta para Counter:

```text
quantas ocorrências
aconteceram?
```

---

### 16. Criar estado operacional

Arquivo:

```text
OperationalStateMetrics.java
```

Exemplo:

```java
package com.formacao.orders.observability.metrics;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import java.util.concurrent.atomic.AtomicInteger;

public final class OperationalStateMetrics {

    private final AtomicInteger activeMessages =
            new AtomicInteger();

    public OperationalStateMetrics(
            MeterRegistry meterRegistry) {

        Gauge.builder(
                        MetricNames.MESSAGE_ACTIVE,
                        activeMessages,
                        AtomicInteger::get)
                .description(
                        "Current number of active message handlers")
                .baseUnit("tasks")
                .register(meterRegistry);
    }

    public void incrementActive() {
        activeMessages.incrementAndGet();
    }

    public void decrementActive() {
        activeMessages.decrementAndGet();
    }
}
```

O decremento precisa ocorrer em `finally`.

---

### 17. Compreender DistributionSummary

DistributionSummary registra valores que não são tempo.

Exemplo:

```java
DistributionSummary.builder(
        MetricNames.ORDER_PAYLOAD_SIZE)
    .description(
        "Accepted order payload size")
    .baseUnit("bytes")
    .register(meterRegistry);
```

Registro:

```java
payloadSizeSummary.record(
        payloadSizeBytes);
```

Casos adequados incluem bytes, quantidades, lotes e tamanhos de documentos.

Não registre valores monetários sensíveis sem contrato específico.

---

### 18. Compreender LongTaskTimer

LongTaskTimer acompanha tarefas em execução.

Exemplo:

```java
LongTaskTimer longTaskTimer =
        LongTaskTimer.builder(
                MetricNames.MESSAGE_PROCESSING)
            .description(
                "Duration of active long-running message processing")
            .register(meterRegistry);
```

Uso:

```java
var sample = longTaskTimer.start();

try {
    processMessage(message);
} finally {
    sample.stop();
}
```

É útil quando a pergunta é:

```text
quantas tarefas longas
estão ativas

e há quanto tempo?
```

Não substitui Timer de conclusão quando você também precisa da distribuição final.

---

### 19. Criar métricas de mensageria

Arquivo:

```text
MessagingMetrics.java
```

Responsabilidades:

- medir duração do processamento;
- medir outcome;
- observar tarefas ativas;
- contar retries controlados;
- evitar message ID como tag;
- evitar topic dinâmico não governado;
- evitar exception message.

Tags permitidas:

```text
message.type;

outcome;

retryable.
```

Valores precisam vir de enum ou catálogo.

---

### 20. Criar `MeterBinder`

Arquivo:

```text
OrdersMetricsBinder.java
```

Exemplo:

```java
package com.formacao.orders.observability.metrics;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.MeterBinder;

public final class OrdersMetricsBinder
        implements MeterBinder {

    private final InternalOrderQueue queue;

    public OrdersMetricsBinder(
            InternalOrderQueue queue) {

        this.queue = queue;
    }

    @Override
    public void bindTo(
            MeterRegistry registry) {

        Gauge.builder(
                        MetricNames.INTERNAL_QUEUE_SIZE,
                        queue,
                        InternalOrderQueue::size)
                .description(
                        "Current internal order queue size")
                .baseUnit("items")
                .register(registry);
    }
}
```

MeterBinder é útil para agrupar instrumentação de um componente.

Não coloque regra de negócio dentro do binder.

---

### 21. Configurar common tags

Arquivo:

```text
MetricsConfiguration.java
```

Exemplo:

```java
@Bean
MeterRegistryCustomizer<MeterRegistry>
commonTags(
        ApplicationOperationalInfo info) {

    return registry ->
            registry.config()
                    .commonTags(
                            "application",
                            info.application(),
                            "environment",
                            info.environment());
}
```

Common tags aceitáveis incluem application, environment e dimensões lógicas controladas.

Evite usar `release_id` como common tag sem avaliar cardinalidade e necessidade.

Cada release cria novas séries.

Em alguns backends isso é útil.

Em outros, aumenta custo rapidamente.

Registre a decisão.

---

### 22. Não usar IDs únicos como tags

Tags proibidas:

- order ID;
- customer ID;
- correlation ID;
- trace ID;
- span ID;
- message ID;
- email;
- URL completa;
- exception message;
- timestamp;
- UUID de requisição.

Cada valor novo pode criar uma nova série.

Um campo útil em log pode ser desastroso como tag de métrica.

Logs e métricas possuem modelos diferentes.

---

### 23. Criar política de tags

Arquivo:

```text
metrics-tag-policy.yaml
```

Conteúdo:

```yaml
tags:
  allowed:
    outcome:
      values:
        - success
        - rejected
        - failure
        - timeout
        - cancelled

    channel:
      values:
        - api
        - messaging
        - scheduled

    retryable:
      values:
        - true
        - false

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

  unknownValue:
    allowed:
      only-when-bounded-and-documented
```

A allowlist precisa ser testada.

---

### 24. Criar budget de cardinalidade

Arquivo:

```text
metrics-cardinality-budget.yaml
```

Exemplo:

```yaml
cardinality:
  metric:
    orders.creation:
      estimatedSeries:
        outcomes:
          5

        channels:
          3

        environments:
          3

      maximumExpected:
        45

  blockWhen:
    unboundedTagDetected:
      true

    estimatedSeriesExceedsBudget:
      true
```

A estimativa básica multiplica combinações.

Se você adicionar:

```text
release:
100 valores.
```

o total pode crescer para:

```text
4500 séries.
```

Calcule o custo antes.

---

### 25. Criar `MetricsCardinalityPolicy`

Arquivo:

```text
MetricsCardinalityPolicy.java
```

A policy lista tags proibidas, valida valores, limita tamanhos, estima séries e rejeita configuração insegura.

Não tente descobrir cardinalidade somente depois de produção.

---

### 26. Criar `MeterFilter`

Arquivo:

```text
MetricsMeterFilter.java
```

Exemplo conceitual:

```java
package com.formacao.orders.observability.metrics;

import io.micrometer.core.instrument.Meter;
import io.micrometer.core.instrument.config.MeterFilter;
import io.micrometer.core.instrument.config.MeterFilterReply;
import java.util.Set;

public final class MetricsMeterFilter
        implements MeterFilter {

    private static final Set<String> FORBIDDEN_TAGS =
            Set.of(
                    "order_id",
                    "customer_id",
                    "correlation_id",
                    "trace_id",
                    "message_id");

    @Override
    public MeterFilterReply accept(
            Meter.Id id) {

        var forbiddenPresent =
                id.getTags()
                        .stream()
                        .anyMatch(tag ->
                                FORBIDDEN_TAGS.contains(
                                        tag.getKey()));

        return forbiddenPresent
                ? MeterFilterReply.DENY
                : MeterFilterReply.NEUTRAL;
    }
}
```

Uma policy pode negar um meter inseguro.

Também pode mapear nomes ou aplicar distribuição.

Documente qualquer transformação.

---

### 27. Configurar o filter

Exemplo:

```java
@Bean
MeterRegistryCustomizer<MeterRegistry>
metricsPolicyCustomizer() {

    return registry ->
            registry.config()
                    .meterFilter(
                            new MetricsMeterFilter());
}
```

A configuração precisa ocorrer antes da instrumentação relevante.

Teste o comportamento.

Não confie apenas em revisão manual.

---

### 28. Definir histogramas

Arquivo:

```text
metrics-histogram-policy.yaml
```

Exemplo:

```yaml
histograms:
  orders.creation:
    enabled:
      true

    serviceLevelObjectivesMs:
      - 100
      - 250
      - 500
      - 1000

    publishPercentiles:
      - 0.5
      - 0.95
      - 0.99

    environment:
      local:
        allowed

      production:
        costReviewRequired
```

Histogramas e percentis geram séries adicionais.

Não habilite para todas as métricas.

Os limites precisam estar ligados a perguntas e objetivos futuros.

Nesta aula, use valores de laboratório e registre que ainda não são SLOs oficiais.

---

### 29. Configurar Timer com distribuição

Exemplo:

```java
Timer.builder(
        MetricNames.ORDER_CREATION)
    .description(
        "Order creation duration")
    .publishPercentileHistogram()
    .serviceLevelObjectives(
        Duration.ofMillis(100),
        Duration.ofMillis(250),
        Duration.ofMillis(500),
        Duration.ofSeconds(1))
    .tag(
        MetricTagNames.OUTCOME,
        MetricOutcome.SUCCESS.value())
    .register(meterRegistry);
```

Não copie thresholds para produção sem dados.

Esses valores servem ao laboratório.

---

### 30. Instrumentar sem poluir o domínio

A regra de negócio não deve conhecer detalhes de backend de métricas.

Abordagens possíveis:

- wrapper específico;
- decorator;
- application service instrumentado;
- interceptor;
- observation API;
- aspect controlado.

Nesta aula, use componentes explícitos como `OrderMetrics`.

Evite chamadas de registry espalhadas em entidades.

---

### 31. Registrar outcome em todos os caminhos

Fluxo:

```text
success;

business rejection;

timeout;

unexpected failure;

cancellation.
```

Se um caminho não registra a métrica, o total fica incompleto.

Use `try`, `catch` e `finally` com cuidado.

Não incremente sucesso antes de concluir a transação relevante.

---

### 32. Definir ponto de medição

Pergunta:

```text
a duração começa
quando a requisição chega

ou quando a regra
de negócio começa?
```

São métricas diferentes.

Exemplos:

```text
http.server.requests:
borda HTTP.

orders.creation:
operação de negócio.
```

Não dê o mesmo nome para escopos diferentes.

Documente o ponto inicial e final.

---

### 33. Medir erro sem exception class livre

Tag problemática:

```text
exception=<nome dinâmico>.
```

Mesmo classes de exceção podem crescer com bibliotecas e proxies.

Quando usar uma dimensão de erro, prefira catálogo:

```text
validation;

conflict;

dependency_timeout;

dependency_unavailable;

internal.
```

Detalhes permanecem nos logs correlacionados.

---

### 34. Integrar com logs

Na falha, o log preserva contexto e detalhes; a métrica registra categoria controlada e outcome.

Exemplo:

```text
métrica:
orders.creation
outcome=failure
error.category=dependency_timeout.

log:
correlation_id;
trace_id;
order_id;
error_type;
stack trace.
```

Não transforme métrica em log.

Não transforme log em série temporal.

---

### 35. Consultar métricas pelo Actuator

Liste:

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/metrics
```

Consulte:

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/metrics/orders.creation
```

Use tags:

```text
availableTags.
```

Confirme:

- nome;
- measurements;
- base unit;
- description;
- tags disponíveis;
- ausência de tags proibidas.

O endpoint precisa continuar protegido conforme a política da aula 558.

---

### 36. Criar testes com `SimpleMeterRegistry`

Arquivo:

```text
OrderMetricsTest.java
```

Exemplo:

```java
@Test
void shouldRecordSuccessfulOrderCreation() {
    var registry =
            new SimpleMeterRegistry();

    var metrics =
            new OrderMetrics(registry);

    var timer =
            metrics.timer(
                    MetricOutcome.SUCCESS);

    timer.record(
            Duration.ofMillis(125));

    assertThat(timer.count())
            .isEqualTo(1);

    assertThat(
            timer.totalTime(
                    TimeUnit.MILLISECONDS))
            .isEqualTo(125);
}
```

Valide nome, tags e medidas.

---

### 37. Testar Gauge

Arquivo:

```text
OperationalStateMetricsTest.java
```

Teste valor inicial, incremento, decremento, cleanup, não negatividade e referência observada.

Teste o valor obtido pelo registry.

---

### 38. Testar cardinalidade

Arquivo:

```text
MetricsCardinalityContractTest.java
```

Cenários:

- tag permitida;
- order ID bloqueado;
- correlation ID bloqueado;
- trace ID bloqueado;
- URL bloqueada;
- exception message bloqueada;
- valor fora do catálogo;
- número esperado de séries;
- budget excedido.

Esse teste é tão importante quanto o teste do valor.

---

### 39. Testar naming

Arquivo:

```text
MetricsNamingContractTest.java
```

Valide minúsculas, dot notation, unidade, descrição, independência de fornecedor, catálogo e duplicações.

---

### 40. Testar o MeterFilter

Arquivo:

```text
MetricsMeterFilterTest.java
```

Registre um meter com tag proibida.

Confirme que ele é negado.

Registre outro com tags permitidas.

Confirme que ele permanece.

Teste a policy isoladamente e integrada ao registry.

---

### 41. Criar integração da aplicação

Arquivo:

```text
MetricsIntegrationTest.java
```

Cenários:

- criação de pedido com sucesso;
- rejeição;
- falha;
- timer registrado;
- tags corretas;
- log correlacionado existente;
- endpoint Actuator apresenta meter;
- nenhuma tag de ID;
- common tags controladas;
- release não utilizada sem aprovação de cardinalidade.

---

### 42. Simular métricas de negócio

Script:

```text
simulate-business-metrics.ps1
```

Execute sucessos, rejeições, falha, payloads variados, tarefas de mensageria e fila interna variável.

Depois consulte o Actuator.

A simulação deve ser reproduzível.

Não use dados pessoais.

---

### 43. Inspecionar o output

Script:

```text
inspect-actuator-metrics.ps1
```

Valide meters, measurements, tags, ausência de IDs e credenciais, descrição, unidade, timers, gauges, summaries e long tasks.

---

### 44. Escanear métricas

Script:

```text
scan-metrics-output.ps1
```

Procure:

- order ID;
- customer ID;
- correlation ID;
- trace ID;
- email;
- UUID;
- URL completa;
- token;
- password;
- exception message;
- timestamp como tag;
- release sem aprovação;
- valores livres.

Resultado:

```text
METRICS_OUTPUT_APPROVED
ou
METRICS_OUTPUT_BLOCKED.
```

---

### 45. Criar catálogo de métricas

Arquivo:

```text
metrics-catalog.yaml
```

Exemplo:

```yaml
meters:
  - name:
      orders.creation

    type:
      timer

    description:
      Order creation duration

    unit:
      seconds

    tags:
      - outcome
      - channel

    owner:
      orders-team

    cardinalityBudget:
      15

  - name:
      orders.internal.queue.size

    type:
      gauge

    description:
      Current internal order queue size

    unit:
      items

    tags:
      []

    owner:
      orders-team

    cardinalityBudget:
      1
```

Todo meter customizado precisa de owner e pergunta.

---

### 46. Criar failure policy

Arquivo:

```text
metrics-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  registryUnavailable:
    businessOperation:
      continue

  meterDenied:
    startupOrTest:
      fail-when-contract-violation

  invalidTag:
    action:
      reject-registration

  cardinalityBudgetExceeded:
    action:
      block-release

  metricsEndpointUnavailable:
    action:
      operational-investigation

  sensitiveValueDetected:
    action:
      block-release
```

A indisponibilidade da exportação de métricas não deve quebrar o pedido.

Violações de contrato precisam bloquear o build ou release.

---

### 47. Criar matriz de testes

Arquivo:

```text
METRICS_TEST_MATRIX.md
```

Cenários:

- Counter incrementa;
- Counter não diminui;
- Timer conta e mede;
- Timer registra outcomes;
- Gauge mostra estado atual;
- Gauge não fica negativo;
- Summary registra bytes;
- LongTaskTimer acompanha tarefa;
- MeterBinder registra uma vez;
- common tags são controladas;
- IDs únicos são bloqueados;
- MeterFilter nega meter inseguro;
- naming segue dot notation;
- base unit existe;
- description existe;
- histogram policy é seletiva;
- percentis não são globais;
- Actuator apresenta meter;
- endpoint protegido;
- logs e métricas se complementam;
- registry failure não quebra negócio;
- sensitive scan passa.

---

### 48. Criar troubleshooting

Arquivo:

```text
METRICS_TROUBLESHOOTING.md
```

Inclua:

- meter não aparece;
- Actuator metrics retorna 404;
- nome transformado pelo registry;
- timer count zero;
- sample não finalizada;
- Gauge retorna `NaN`;
- objeto do Gauge foi coletado;
- Gauge fica negativo;
- meter duplicado com tags diferentes;
- tag não aparece;
- cardinalidade cresce;
- MeterFilter nega meter;
- histogramas geram muitas séries;
- percentis não aparecem;
- endpoint expõe tags inesperadas;
- common tag multiplica séries;
- metric instrumentation quebra teste;
- registry externo ausente.

---

### 49. Coletar evidence

Script:

```text
collect-micrometer-evidence.ps1
```

Arquivo:

```text
micrometer-evidence.json.
```

Campos permitidos incluem lesson, application, environment, registry, status dos meters, tags, cardinalidade, filter, testes, scan e timestamp.

Não inclua:

- identificadores de pedidos;
- correlation IDs;
- trace IDs;
- payloads;
- credenciais;
- output completo.

---

### 50. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\observability\metrics\validate-micrometer-dependencies.ps1

.\scripts\observability\metrics\validate-metrics-catalog.ps1

.\scripts\observability\metrics\validate-metric-types.ps1

.\scripts\observability\metrics\validate-metric-tags.ps1

.\scripts\observability\metrics\validate-cardinality-budget.ps1

.\scripts\observability\metrics\simulate-business-metrics.ps1

.\scripts\observability\metrics\inspect-actuator-metrics.ps1

.\scripts\observability\metrics\scan-metrics-output.ps1

.\scripts\observability\metrics\collect-micrometer-evidence.ps1

.\scripts\observability\metrics\verify-micrometer-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- dependências coerentes;
- catálogo completo;
- tipos justificados;
- nomes padronizados;
- unidades definidas;
- tags em allowlist;
- IDs únicos ausentes;
- cardinalidade dentro do budget;
- counters aprovados;
- timers aprovados;
- gauges aprovados;
- summaries aprovados;
- long tasks aprovadas;
- filters ativos;
- testes aprovados;
- evidence sanitizada;
- golden signals não antecipados.

---

## Entendendo o que foi feito

### Métricas ganharam perguntas

A instrumentação deixou de começar pela API.

### Tipos ganharam semântica

Counter, Timer, Gauge, Summary e LongTaskTimer passaram a responder perguntas diferentes.

### Nomes ganharam portabilidade

A aplicação não foi acoplada ao nome de um backend.

### Tags ganharam governança

Valores dinâmicos deixaram de ser adicionados sem análise.

### Cardinalidade ganhou budget

O custo passou a ser estimado antes da produção.

### Timers ganharam outcomes

Duração e resultado passaram a ser analisáveis juntos.

### Gauges ganharam lifecycle

Estado atual e referência do objeto passaram a ser considerados.

### Binders ganharam responsabilidade

Métricas relacionadas foram agrupadas sem misturar regra de negócio.

### Filters ganharam poder de bloqueio

Meters inseguros passaram a ser negados.

### Métricas ganharam testes

Nome, tipo, tags, valores e budget tornaram-se contratos verificáveis.

---

## Erros comuns importantes

### Criar métrica sem pergunta

O dado não orienta nenhuma decisão.

### Usar Gauge para eventos

O valor não representa estado atual.

### Duplicar Counter e Timer

A mesma operação é contada duas vezes.

### Usar IDs como tags

A quantidade de séries explode.

### Usar exception message como tag

Cardinalidade e dados sensíveis aumentam.

### Habilitar histogramas globalmente

O custo cresce rapidamente.

### Usar release como common tag sem análise

Cada deploy multiplica séries.

### Instrumentar entidade de domínio

A regra de negócio fica acoplada à observabilidade.

### Não finalizar Timer.Sample

Durações deixam de ser registradas.

### Antecipar golden signals

A interpretação integrada pertence à aula 560.

---

## Comandos úteis

### Ver dependências Micrometer

```powershell
mvn `
  --batch-mode `
  dependency:tree `
  "-Dincludes=io.micrometer"
```

### Listar métricas

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/metrics
```

### Consultar métrica

```powershell
Invoke-RestMethod `
  http://localhost:8080/actuator/metrics/orders.creation
```

### Simular métricas

```powershell
.\scripts\observability\metrics\simulate-business-metrics.ps1
```

### Validar cardinalidade

```powershell
.\scripts\observability\metrics\validate-cardinality-budget.ps1
```

---

## Exercício guiado

### Parte 1 — Questions

Escreva a pergunta de cada métrica.

### Parte 2 — Types

Escolha Counter, Timer, Gauge, Summary ou LongTaskTimer.

### Parte 3 — Naming

Crie nomes em lowercase dot notation.

### Parte 4 — Tags

Defina allowlist e valores.

### Parte 5 — Cardinality

Calcule o número esperado de séries.

### Parte 6 — Domain

Instrumente criação de pedidos.

### Parte 7 — Messaging

Instrumente processamento e tarefas ativas.

### Parte 8 — Filters

Bloqueie tags proibidas.

### Parte 9 — Tests

Valide tipos, tags e medidas.

### Parte 10 — Evidence

Simule, inspecione e aprove.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 558 e ponte para a aula 560 foram preservadas;
- métrica, meter, registry, Counter, Timer, Gauge, DistributionSummary, LongTaskTimer, tag, cardinalidade, binder, filter, histogram e percentil foram definidos;
- baseline do Actuator foi validada;
- dependências Micrometer estão coerentes;
- nenhum registry externo foi adicionado sem necessidade;
- perguntas operacionais foram definidas antes da instrumentação;
- contrato de métricas foi criado;
- nomes usam lowercase dot notation;
- nomes não incluem fornecedor;
- campos de unidade e descrição são exigidos;
- catálogo de nomes foi criado;
- catálogo de tags foi criado;
- outcomes usam valores controlados;
- matriz de decisão de tipos foi criada;
- Counter somente aumenta;
- Timer registra contagem e duração;
- Counter não duplica Timer sem justificativa;
- `Timer.Sample` é finalizada em todos os caminhos;
- Gauge representa estado atual;
- objetos de Gauge permanecem referenciados;
- Gauge não é usado como contador;
- DistributionSummary mede valores não temporais;
- LongTaskTimer acompanha tarefas ativas;
- métricas de mensageria não usam message ID;
- MeterBinder não contém regra de negócio;
- common tags são controladas;
- release ID como tag foi submetida à análise de cardinalidade;
- order ID, customer ID, correlation ID, trace ID, message ID, email, URL e exception message são proibidos como tags;
- política de tags foi criada;
- budget de cardinalidade foi criado;
- multiplicação de combinações foi estimada;
- policy class foi criada;
- MeterFilter nega tags proibidas;
- filter foi configurado antes da instrumentação;
- histogramas e percentis possuem política seletiva;
- thresholds são declarados como valores de laboratório;
- instrumentação não foi espalhada por entidades;
- outcome é registrado em todos os caminhos;
- pontos de medição foram documentados;
- categorias de erro são controladas;
- logs e métricas possuem responsabilidades distintas;
- métricas são consultáveis pelo Actuator;
- endpoint mantém a segurança da aula 558;
- testes usam SimpleMeterRegistry;
- Counter, Timer, Gauge, Summary e LongTaskTimer foram testados;
- naming foi testado;
- cardinalidade foi testada;
- MeterFilter foi testado;
- integração da aplicação foi testada;
- simulação de métricas foi criada;
- output foi inspecionado e escaneado;
- catálogo de métricas possui owner e budget;
- failure policy foi criada;
- test matrix e troubleshooting foram criados;
- evidence é sanitizada;
- nenhum Secret ou dado pessoal foi utilizado;
- análise completa dos golden signals não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/test/java `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/observability/metrics `
  scripts/observability/metrics `
  docs/observability/metrics `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure tags sensíveis ou de alta cardinalidade:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "order_id|customer_id|correlation_id|trace_id|message_id|email|password|token|exception_message"
```

Commit recomendado:

```powershell
git commit -m "feat(m18): instrumentar metricas com Micrometer"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- amostras temporárias;
- output completo do Actuator;
- IDs de pedidos;
- correlation ou trace IDs;
- payloads;
- credentials;
- configuração completa de Prometheus;
- dashboards;
- material da aula 560.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a `orders-api` passou a transformar comportamentos relevantes em métricas testáveis.

Você trabalhou com:

```text
MeterRegistry;

Counter;

Timer;

Gauge;

DistributionSummary;

LongTaskTimer;

MeterBinder;

MeterFilter;

tags;

cardinalidade;

histogramas;

percentis.
```

Você comprovou que a instrumentação precisa começar por perguntas; Counters representam ocorrências cumulativas; Timers registram contagem e duração; Gauges mostram estado atual; DistributionSummary mede valores não temporais; LongTaskTimer acompanha tarefas ainda ativas; nomes precisam permanecer independentes do backend; tags precisam usar valores controlados; IDs únicos não pertencem às tags; cardinalidade precisa de budget; histogramas e percentis possuem custo; logs preservam detalhes enquanto métricas agregam comportamento; MeterFilter pode bloquear meters inseguros; e `SimpleMeterRegistry` permite testar contratos sem depender de infraestrutura externa.

A próxima aula será:

```text
560 - M18.05 - Golden signals
```

Nela, você irá organizar logs, métricas e estado operacional em torno de latência, tráfego, erros e saturação, criando uma leitura integrada da saúde e do comportamento da aplicação.

Nenhuma análise completa dos golden signals, SLI, SLO, error budget, dashboard ou regra final de alerta foi antecipada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini perguntas e tipos.
- [ ] Padronizei nomes, unidades e descrições.
- [ ] Criei tags controladas.
- [ ] Calculei cardinalidade.
- [ ] Instrumentei pedidos e mensageria.
- [ ] Criei binder e filter.
- [ ] Testei meters e contratos.
- [ ] Coletei evidence sanitizada.

---

## Troubleshooting adicional

### A métrica não aparece

Confirme que o código foi executado e que o endpoint está exposto no profile local.

### O Timer permanece com count zero

Verifique se a amostra foi finalizada.

### O Gauge mostra `NaN`

Revise a referência do objeto e a função de leitura.

### O Gauge fica negativo

Garanta decremento único em `finally`.

### O meter é negado

Revise MeterFilter e tags proibidas.

### A cardinalidade cresce

Liste valores de tags e procure IDs ou texto livre.

### Percentis não aparecem

Revise configuração de distribuição e registry.

### Histogramas geram muitas séries

Restrinja meters, buckets e ambientes.

### A tag de release multiplica séries

Remova ou documente a necessidade e o budget.

### Golden signals já foram organizados

Preserve a análise completa para a aula 560.

---

## Perguntas de revisão

1. O que é Micrometer?
2. O que é MeterRegistry?
3. Quando usar Counter?
4. Quando usar Timer?
5. Quando usar Gauge?
6. Quando usar DistributionSummary?
7. Quando usar LongTaskTimer?
8. O que é MeterBinder?
9. O que é MeterFilter?
10. Por que começar pela pergunta?
11. Como nomear métricas?
12. O que é tag?
13. O que é cardinalidade?
14. Por que IDs não viram tags?
15. O Timer já registra contagem?
16. Qual risco dos histogramas?
17. Como testar métricas?
18. Como logs e métricas se complementam?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fachada de instrumentação.
2. Registro central dos meters.
3. Ocorrências cumulativas.
4. Contagem e duração.
5. Estado atual.
6. Distribuição não temporal.
7. Tarefas longas ativas.
8. Agrupador de meters.
9. Política de registro.
10. Garantir utilidade.
11. Lowercase dot notation.
12. Dimensão controlada.
13. Combinações de séries.
14. Explosão de séries.
15. Sim.
16. Custo de séries.
17. SimpleMeterRegistry e contract tests.
18. Agregado e detalhe.
19. Golden signals.
20. Golden signals.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 559 - M18.04 - Micrometer

- Continuei após Spring Boot Actuator.
- Diferenciei logs, health e métricas.
- Defini perguntas operacionais antes da instrumentação.
- Revisei MeterRegistry e o modelo dimensional.
- Criei contrato e catálogo de métricas.
- Padronizei nomes em lowercase dot notation.
- Criei catálogo de tags e outcomes.
- Diferenciei Counter, Timer, Gauge, DistributionSummary e LongTaskTimer.
- Evitei duplicação entre Counter e Timer.
- Usei Timer.Sample para registrar outcomes.
- Criei Gauge para estados atuais.
- Mantive referências observadas pelo Gauge.
- Medi payloads com DistributionSummary.
- Medi tarefas ativas com LongTaskTimer.
- Criei métricas de pedidos e mensageria.
- Agrupei instrumentação com MeterBinder.
- Configurei common tags controladas.
- Proibi IDs únicos e dados sensíveis como tags.
- Criei política e budget de cardinalidade.
- Implementei MeterFilter para bloquear meters inseguros.
- Defini política seletiva de histogramas e percentis.
- Mantive instrumentação fora das entidades de domínio.
- Integrei métricas e logs com responsabilidades distintas.
- Testei meters usando SimpleMeterRegistry.
- Testei naming, tags, cardinalidade e filters.
- Simulei e inspecionei métricas pelo Actuator.
- Coletei evidence sanitizada.
- Não antecipei a análise completa dos golden signals.
- Próxima aula: Golden signals.
```

---

## Referência técnica curta

- Micrometer Concepts.
- Micrometer MeterRegistry.
- Micrometer Counters.
- Micrometer Timers.
- Micrometer Gauges.
- Micrometer DistributionSummary.
- Micrometer LongTaskTimer.
- Micrometer MeterBinder.
- Micrometer MeterFilter.
- Spring Boot Actuator Metrics.

Regra final:

```text
a instrumentação com Micrometer precisa começar por perguntas operacionais: nomes seguem lowercase dot notation, unidades e descrições são explícitas, Counter mede ocorrências cumulativas, Timer registra contagem e duração, Gauge representa estado atual, DistributionSummary mede valores não temporais e LongTaskTimer acompanha tarefas ativas; MeterBinder agrupa instrumentação sem conter regra de negócio e MeterFilter bloqueia meters que violam a política; tags usam allowlist e valores limitados, enquanto order ID, customer ID, correlation ID, trace ID, message ID, URL, email e exception message permanecem fora das dimensões; cardinalidade possui budget calculado, common tags, histogramas, buckets e percentis são avaliados pelo custo, logs preservam detalhes correlacionados e métricas agregam comportamento; testes com SimpleMeterRegistry validam nomes, tipos, medidas, tags, filtros e séries, deixando para a aula 560 a organização dessas medidas em latência, tráfego, erros e saturação.
```
