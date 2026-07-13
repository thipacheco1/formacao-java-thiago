# 585 - M18.30 - Load testing K6 ou Gatling conceitual

## Apresentação da aula

Na aula 584, você estruturou cache invalidation com foco em coerência, eventos versionados, outbox, idempotência, ordering, tombstones, repair e reconciliation.

Você passou a medir:

```text
invalidation lag;

outbox age;

duplicate event;

reordered event;

lost invalidation;

repair attempt;

stale read;

rollback.
```

Agora você precisa responder a outra pergunta:

```text
o sistema continua
correto e estável

quando muitas operações
acontecem ao mesmo tempo?
```

Testes funcionais validam o comportamento de uma operação.

Testes de integração validam componentes trabalhando juntos.

Testes de carga validam o comportamento do sistema sob um workload controlado.

O objetivo não é apenas “mandar muitas requisições”.

Um teste de carga precisa representar operações, proporções, chegada, concorrência, duração, dados, autenticação, think time, ramp-up, critérios de parada, budgets, observabilidade e falhas.

Nesta aula, você irá estudar duas ferramentas populares:

```text
K6;

Gatling.
```

O K6 usa JavaScript para VUs, scenarios, executors, arrival rate, checks, thresholds, tags e summaries. O Gatling usa uma DSL JVM para scenarios, feeders, injection profiles, checks, assertions e reports.

A aula será conceitual e prática guiada.

O laboratório principal utilizará um esqueleto de K6 por ser simples de executar e fácil de comparar com as métricas já criadas.

O Gatling será apresentado de forma equivalente para que você compreenda como traduzir o mesmo workload.

A pergunta central será:

```text
como modelar,
executar
e interpretar

um teste de carga
reproduzível

sem confundir
usuários virtuais,
requisições por segundo,
concorrência
e capacidade?
```

Essa distinção é essencial.

Considere:

```text
100 virtual users.
```

Esse valor não informa sozinho:

- quantas requisições por segundo serão produzidas;
- quanto tempo cada operação leva;
- quanto think time existe;
- quantos usuários estão bloqueados;
- quantas chamadas cada iteração executa;
- qual endpoint domina a carga.

Outro exemplo:

```text
100 requests por segundo.
```

Esse ritmo pode exigir:

```text
5 VUs;
20 VUs;
100 VUs;
500 VUs.
```

A quantidade depende da duração de cada iteração.

A relação básica será:

```text
concorrência
≈
throughput
×
latência.
```

Se o sistema recebe:

```text
200 requests/s
```

e cada request permanece no sistema por:

```text
0,2 s
```

a concorrência média aproximada é:

```text
200 × 0,2
=
40 requests simultâneos.
```

Essa relação ajuda a revisar se o cenário é coerente.

Você também irá diferenciar dois modelos:

```text
closed workload model;

open workload model.
```

No modelo fechado:

```text
um conjunto de usuários
executa operações
e aguarda a resposta.
```

Se o sistema fica lento, a taxa de chegada tende a cair porque os usuários permanecem ocupados.

No modelo aberto:

```text
novas iterações chegam
em uma taxa definida,
independentemente
da latência anterior.
```

Se o sistema fica lento, a concorrência necessária aumenta para preservar a taxa.

Esses modelos respondem a perguntas diferentes.

Um portal com usuários navegando pode ser aproximado por modelo fechado.

Uma integração recebendo eventos a 500 mensagens por segundo pode ser aproximada por modelo aberto.

A aula irá trabalhar com um workload de pedidos composto por:

```text
45%:
GET /orders/{id}/status;

25%:
GET /orders/{id};

20%:
GET /orders;

10%:
POST /orders.
```

Essas proporções são didáticas; em sistemas reais, devem vir de métricas, traces, logs, eventos, analytics e previsões.

O teste utilizará dados sintéticos e ambientes autorizados.

Nunca execute carga significativa contra produção sem autorização, proteção e plano de parada.

A aula não irá aprofundar teste de stress ou carga de pico.

Não serão executados:

- aumento até quebra;
- busca do limite extremo;
- overload deliberado;
- spike abrupto;
- stress progressivo;
- teste de recuperação após colapso;
- saturação intencional de todos os recursos;
- definição de breaking point;
- carga acima da capacidade aprovada.

Esses assuntos pertencem à próxima aula oficial:

```text
586 - M18.31 - Teste de stress carga pico
```

Nesta aula, o workload permanecerá dentro de uma faixa planejada e segura.

A regra central será:

```text
load testing
é um experimento controlado
com workload,
ambiente,
observabilidade
e critérios de aceite;

não é apenas
gerar tráfego.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
583:
Cache distribuido Redis.

584:
Cache invalidation.

585:
Load testing K6 ou Gatling conceitual.

586:
Teste de stress carga pico.
```

A progressão é:

```text
cache compartilhado;

coerência;

carga controlada;

stress e pico.
```

Nesta aula:

```text
K6:
sim.

Gatling:
sim.

virtual users:
sim.

arrival rate:
sim.

closed model:
sim.

open model:
sim.

checks:
sim.

thresholds:
sim.

scenarios:
sim.

feeders:
sim.

ramp-up:
sim.

warmup:
sim.

steady load:
sim.

smoke validation:
sim.

stress:
não.

spike:
não.

breaking point:
não.
```

Você reutilizará:

- performance budgets;
- SLOs;
- RED;
- USE;
- saturação;
- API performance;
- banco;
- HikariCP;
- caches;
- traces;
- logs;
- Prometheus;
- Grafana;
- runbooks;
- Docker Compose.

O teste precisa preservar autorização, dados sintéticos, controle de taxa, parada, segurança, reprodutibilidade, rollback e evidence sanitizada.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/load-testing
├── load-test-contract.yaml
├── workload-catalog.yaml
├── load-test-environment-policy.yaml
├── load-test-data-policy.yaml
├── load-test-model-policy.yaml
├── load-test-arrival-rate-policy.yaml
├── load-test-virtual-user-policy.yaml
├── load-test-ramp-policy.yaml
├── load-test-duration-policy.yaml
├── load-test-check-policy.yaml
├── load-test-threshold-policy.yaml
├── load-test-observability-policy.yaml
├── load-test-stop-policy.yaml
├── load-test-regression-policy.yaml
├── load-test-data-quality-policy.yaml
├── load-test-security-policy.yaml
├── load-test-failure-policy.yaml
├── load-test-scenarios.yaml
└── load-test-evidence.yaml

performance/load-testing/k6
├── package.json
├── config.js
├── data.js
├── helpers.js
├── smoke.js
├── steady-load.js
├── orders-workload.js
├── thresholds.js
└── summary.js

performance/load-testing/gatling
├── README.md
├── OrdersProtocol.java
├── OrdersFeeder.java
├── OrdersScenario.java
├── OrdersSimulation.java
└── AssertionsGuide.md

performance/load-testing/reports
├── load-test-baseline-report.yaml
├── load-test-workload-report.yaml
├── load-test-k6-report.yaml
├── load-test-gatling-mapping-report.yaml
├── load-test-observability-report.yaml
└── load-test-gate-report.yaml

scripts/performance/load-testing
├── validate-load-test-contract.ps1
├── validate-load-test-environment.ps1
├── prepare-load-test-data.ps1
├── validate-load-test-data.ps1
├── run-load-test-smoke.ps1
├── run-load-test-steady.ps1
├── validate-load-test-rate.ps1
├── validate-load-test-thresholds.ps1
├── correlate-load-test-metrics.ps1
├── compare-load-test-runs.ps1
├── validate-load-test-stop-conditions.ps1
├── validate-load-test-rollback.ps1
├── scan-load-test-output.ps1
├── collect-load-test-evidence.ps1
└── verify-load-test-baseline.ps1

docs/performance/load-testing
├── LOAD_TESTING_OVERVIEW.md
├── K6_CONCEPTUAL_GUIDE.md
├── GATLING_CONCEPTUAL_GUIDE.md
├── CLOSED_AND_OPEN_WORKLOADS.md
├── VIRTUAL_USERS_AND_ARRIVAL_RATE.md
├── LOAD_TEST_DATA_GUIDE.md
├── LOAD_TEST_THRESHOLDS.md
├── LOAD_TEST_OBSERVABILITY.md
├── LOAD_TEST_TEST_MATRIX.md
└── LOAD_TEST_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de carga;

catálogo de workload;

dados sintéticos;

modelo fechado e aberto;

script K6;

mapeamento Gatling;

checks;

thresholds;

stop conditions;

correlação;

gate;

evidence sanitizada.
```

Você irá modelar, validar, executar smoke e carga estável, correlacionar sinais e comparar execuções.

---

## Conceito essencial

### Load testing

Execução de workload controlado para validar comportamento sob uma demanda esperada.

---

### Virtual user

Execução lógica que representa um fluxo de usuário ou cliente.

---

### Iteration

Uma execução completa da função ou cenário de um virtual user.

---

### Request rate

Quantidade de requests iniciados por unidade de tempo.

---

### Arrival rate

Quantidade de novas iterações iniciadas por unidade de tempo.

---

### Concurrency

Quantidade de operações simultaneamente em andamento.

---

### Closed workload model

Modelo em que a taxa depende da quantidade de usuários e da duração das iterações.

---

### Open workload model

Modelo em que novas iterações chegam conforme uma taxa definida.

---

### Think time

Pausa que representa comportamento entre operações.

---

### Ramp-up

Aumento gradual da carga.

---

### Warmup

Período usado para estabilizar aplicação, caches, pools e JIT antes da medição principal.

---

### Steady state

Janela com carga relativamente estável.

---

### Check

Validação funcional executada durante o teste.

---

### Threshold

Critério automatizado de aprovação ou falha.

---

### Scenario

Conjunto de operações, executores, dados e duração.

---

### Feeder

Fonte de dados para usuários ou iterações no Gatling.

---

### Pacing

Controle do intervalo entre iterações.

---

### Coordinated omission

Subestimação de latência quando o gerador reduz a taxa durante a degradação.

---

### Test generator saturation

Condição em que a máquina geradora não consegue produzir a carga planejada.

---

## Mão na massa guiada

### 1. Validar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

docker compose `
  ps

git status

git diff --check
```

Confirme:

- aplicação saudável;
- PostgreSQL saudável;
- Redis saudável;
- HikariCP na baseline;
- caches em profile conhecido;
- budgets disponíveis;
- ambiente autorizado;
- nenhum teste de stress será executado.

---

### 2. Criar contrato de carga

Arquivo:

```text
load-test-contract.yaml
```

Conteúdo:

```yaml
loadTest:
  required:
    - objective
    - environment
    - workload
    - model
    - rate-or-users
    - duration
    - data
    - checks
    - thresholds
    - observability
    - stop-conditions
    - rollback

  safety:
    authorizedEnvironment:
      required

  result:
    allowed:
      - pass
      - fail
      - inconclusive

  stressAndSpike:
    deferredToLesson586
```

---

### 3. Definir objetivo

Exemplo:

```yaml
objective:
  validate:
    service:
      orders-api

    workload:
      expected-business-hour

    target:
      80-requests-per-second

    duration:
      15m

    criteria:
      - API-budgets
      - error-rate
      - resource-headroom
      - no-growing-backlog
```

O objetivo precisa responder:

```text
qual hipótese
será testada?
```

Exemplo:

```text
A orders-api
mantém os budgets
com 80 requests/s
durante 15 minutos
no profile aprovado.
```

---

### 4. Criar catálogo de workload

Arquivo:

```text
workload-catalog.yaml
```

Conteúdo:

```yaml
operations:
  - id:
      ORDER-STATUS

    method:
      GET

    path:
      /orders/{id}/status

    share:
      0.45

  - id:
      ORDER-BY-ID

    method:
      GET

    path:
      /orders/{id}

    share:
      0.25

  - id:
      ORDER-LIST

    method:
      GET

    path:
      /orders

    share:
      0.20

  - id:
      ORDER-CREATE

    method:
      POST

    path:
      /orders

    share:
      0.10
```

A soma precisa ser:

```text
1,00.
```

---

### 5. Criar política de ambiente

Arquivo:

```text
load-test-environment-policy.yaml
```

Conteúdo:

```yaml
environment:
  required:
    - name
    - owner
    - authorization
    - topology
    - resources
    - data-volume
    - external-dependencies
    - monitoring
    - rollback

  production:
    loadWithoutApproval:
      forbidden

  sharedEnvironment:
    announceWindow:
      required

  backgroundTraffic:
    record:
      required

  changeDuringRun:
    forbiddenUnlessExperimentRequires
```

---

### 6. Registrar topologia

Registre réplicas, CPU, memória, heap, HikariCP, PostgreSQL, Redis, Kafka, dependências, limites, versão, commit e profile.

Sem topologia, o resultado não é reproduzível.

---

### 7. Criar política de dados

Arquivo:

```text
load-test-data-policy.yaml
```

Conteúdo:

```yaml
data:
  synthetic:
    required

  uniqueWriteKeys:
    requiredForCreate

  reusableReadKeys:
    allowed

  tenantIsolation:
    required

  cleanup:
    required

  secrets:
    forbidden

  productionData:
    forbiddenInLaboratory
```

---

### 8. Preparar dados sintéticos

Script:

```text
prepare-load-test-data.ps1
```

Crie IDs válidos e ausentes, tenants sintéticos, payloads, idempotency keys únicas, cursors, tokens de laboratório, cold keys e hot keys.

Não reutilize uma única idempotency key em todas as escritas.

---

### 9. Validar dados

Script:

```text
validate-load-test-data.ps1
```

Confirme quantidade, distribuição, unicidade, formato, isolamento, permissões, cleanup e ausência de dados reais.

---

### 10. Criar política de modelo

Arquivo:

```text
load-test-model-policy.yaml
```

Conteúdo:

```yaml
model:
  closed:
    useFor:
      - user-journey
      - interactive-flow

  open:
    useFor:
      - fixed-arrival-rate
      - integration-traffic
      - event-ingress

  selectedModel:
    documented:
      required

  mixedWithoutReason:
    forbidden
```

---

### 11. Modelar fluxo fechado

Exemplo K6:

```javascript
export const options = {
  vus: 20,
  duration: '10m',
};
```

Cada VU executa a função `default` repetidamente.

Se a latência aumenta:

```text
cada VU
completa menos iterações;

a taxa cai.
```

Esse comportamento pode representar usuários aguardando a resposta.

---

### 12. Modelar arrival rate

Exemplo K6:

```javascript
export const options = {
  scenarios: {
    orders_steady: {
      executor: 'constant-arrival-rate',
      rate: 80,
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 40,
      maxVUs: 120,
    },
  },
};
```

O gerador tenta iniciar 80 iterações por segundo.

Se as iterações ficam lentas, mais VUs podem ser necessários.

---

### 13. Criar política de arrival rate

Arquivo:

```text
load-test-arrival-rate-policy.yaml
```

Conteúdo:

```yaml
arrivalRate:
  target:
    required

  timeUnit:
    explicit:
      required

  preAllocatedVUs:
    estimate:
      required

  maxVUs:
    bound:
      required

  droppedIterations:
    threshold:
      required

  generatorSaturation:
    monitor:
      required
```

---

### 14. Estimar VUs

Use:

```text
VUs aproximados
=
arrival rate
×
iteration duration
×
margem.
```

Exemplo:

```text
arrival rate:
80/s.

iteration p95:
0,4 s.

base:
32 VUs.

margem:
50%.

preAllocated:
48 VUs.
```

O cálculo é estimado; valide dropped iterations e recursos do gerador.

---

### 15. Criar política de VUs

Arquivo:

```text
load-test-virtual-user-policy.yaml
```

Conteúdo:

```yaml
virtualUsers:
  represent:
    logicalExecution

  notEqualTo:
    - realUsers
    - requestsPerSecond
    - threadsInApplication

  maximum:
    bounded:
      required

  generatorResources:
    monitor:
      required

  credentials:
    reusable:
      accordingToContract
```

---

### 16. Criar política de ramp

Arquivo:

```text
load-test-ramp-policy.yaml
```

Conteúdo:

```yaml
ramp:
  warmup:
    required

  increase:
    gradual:
      true

  steadyWindow:
    required

  decrease:
    controlled:
      true

  abruptSpike:
    deferredToLesson586
```

---

### 17. Definir fases

Exemplo seguro:

```text
warmup:
2 minutos a 20 req/s.

ramp:
3 minutos até 80 req/s.

steady:
10 minutos a 80 req/s.

ramp-down:
2 minutos.
```

A medição principal ocorre no steady state.

Warmup deve ser registrado, não misturado silenciosamente à janela principal.

---

### 18. Criar política de duração

Arquivo:

```text
load-test-duration-policy.yaml
```

Conteúdo:

```yaml
duration:
  warmup:
    explicit

  steady:
    sufficientFor:
      - percentiles
      - pool-stability
      - cache-stability
      - GC-cycles

  tooShort:
    result:
      inconclusive

  maximumSafeWindow:
    defined:
      required
```

Um teste de 30 segundos pode não revelar:

- GC;
- eviction;
- pool rotation;
- backlog;
- cache warmup;
- connection churn.

---

### 19. Criar configuração K6

Arquivo:

```text
performance/load-testing/k6/config.js
```

Conteúdo:

```javascript
export const config = {
  baseUrl: __ENV.BASE_URL ?? 'http://localhost:8080',
  tenant: __ENV.TENANT ?? 'tenant-lab',
  token: __ENV.ACCESS_TOKEN ?? '',
  targetRate: Number(__ENV.TARGET_RATE ?? '80'),
  duration: __ENV.DURATION ?? '10m',
};
```

O token não deve ter valor padrão real.

---

### 20. Criar helpers

Arquivo:

```text
helpers.js
```

Exemplo:

```javascript
import http from 'k6/http';
import { check } from 'k6';
import { config } from './config.js';

export function getOrderStatus(orderId) {
  const response = http.get(
    `${config.baseUrl}/orders/${orderId}/status`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        'X-Tenant-Id': config.tenant,
      },
      tags: {
        operation: 'ORDER_STATUS',
      },
    },
  );

  check(response, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body.length > 0,
  });

  return response;
}
```

Não logue body nem token.

---

### 21. Criar checks

Arquivo:

```text
load-test-check-policy.yaml
```

Conteúdo:

```yaml
checks:
  required:
    - status
    - contract-minimum
    - business-result

  expensiveValidation:
    avoidInEveryRequest:
      true

  failedCheck:
    metric:
      required

  checkIsNotThreshold:
    true
```

Check valida comportamento.

Threshold decide aprovação.

---

### 22. Criar thresholds

Arquivo:

```text
thresholds.js
```

Exemplo:

```javascript
export const thresholds = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<250', 'p(99)<500'],
  checks: ['rate>0.99'],
  dropped_iterations: ['count==0'],
};
```

Os valores são didáticos.

Eles precisam vir dos budgets aprovados.

---

### 23. Criar política de thresholds

Arquivo:

```text
load-test-threshold-policy.yaml
```

Conteúdo:

```yaml
thresholds:
  deriveFrom:
    - performance-budget
    - SLO
    - error-budget
    - workload

  required:
    - latency
    - errors
    - checks
    - dropped-iterations

  aggregateOnly:
    forbidden

  operationSpecific:
    required

  generatorFailure:
    distinguish:
      required
```

---

### 24. Criar métricas por operação

No K6, use tags:

```javascript
tags: {
  operation: 'ORDER_CREATE',
}
```

Threshold específico:

```javascript
'http_req_duration{operation:ORDER_CREATE}': [
  'p(95)<400',
],
```

A média global pode esconder um endpoint lento.

---

### 25. Criar script de workload

Arquivo:

```text
orders-workload.js
```

Estrutura conceitual:

```javascript
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { getOrderStatus } from './helpers.js';

export function executeOrdersWorkload(data) {
  const draw = Math.random();

  if (draw < 0.45) {
    return getOrderStatus(randomItem(data.orderIds));
  }

  if (draw < 0.70) {
    return getOrder(randomItem(data.orderIds));
  }

  if (draw < 0.90) {
    return listOrders(data.cursor);
  }

  return createOrder(data.nextPayload());
}
```

Em ambiente sem dependência externa permitida, substitua `jslib` por helper local.

---

### 26. Criar smoke test

Arquivo:

```text
smoke.js
```

Objetivo:

```text
validar script,
dados,
auth,
checks
e observabilidade.
```

Exemplo:

```javascript
export const options = {
  vus: 1,
  iterations: 5,
};
```

Smoke não valida capacidade.

Ele valida que o teste está corretamente montado.

---

### 27. Criar steady load

Arquivo:

```text
steady-load.js
```

Exemplo:

```javascript
export const options = {
  scenarios: {
    warmup: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 20,
      maxVUs: 40,
      exec: 'orders',
      tags: {
        phase: 'warmup',
      },
    },
    steady: {
      executor: 'constant-arrival-rate',
      startTime: '2m',
      rate: 80,
      timeUnit: '1s',
      duration: '10m',
      preAllocatedVUs: 50,
      maxVUs: 120,
      exec: 'orders',
      tags: {
        phase: 'steady',
      },
    },
  },
  thresholds,
};
```

Este cenário permanece dentro da carga planejada.

---

### 28. Tratar think time

Em fluxo fechado, use pausa somente quando ela representa o comportamento:

```javascript
sleep(1);
```

Think time altera throughput.

Não adicione sleep apenas para aliviar o teste; no modelo aberto, o executor controla a taxa.

---

### 29. Criar summary sanitizado

Arquivo:

```text
summary.js
```

Inclua apenas:

- duração;
- requests;
- iterations;
- arrival rate observado;
- percentis;
- error rate;
- checks;
- dropped iterations;
- bytes agregados;
- status dos thresholds.

Não inclua:

- tokens;
- URLs privadas;
- payloads;
- IDs;
- responses;
- headers sensíveis.

---

### 30. Mapear para Gatling

A mesma hipótese pode ser escrita em Gatling.

Protocolo:

```java
HttpProtocolBuilder httpProtocol =
        http
            .baseUrl(baseUrl)
            .acceptHeader("application/json")
            .contentTypeHeader("application/json");
```

Feeder:

```java
Iterator<Map<String, Object>> feeder =
        orderIds
            .stream()
            .map(id -> Map.<String, Object>of(
                    "orderId",
                    id))
            .iterator();
```

Scenario:

```java
ScenarioBuilder scenario =
        scenario("Orders steady load")
            .feed(feeder)
            .exec(
                http("order status")
                    .get("/orders/#{orderId}/status")
                    .check(status().is(200)));
```

---

### 31. Mapear injection profile

Modelo fechado:

```java
setUp(
    scenario.injectClosed(
        rampConcurrentUsers(1)
            .to(20)
            .during(Duration.ofMinutes(3)),
        constantConcurrentUsers(20)
            .during(Duration.ofMinutes(10))
    )
).protocols(httpProtocol);
```

Modelo aberto:

```java
setUp(
    scenario.injectOpen(
        rampUsersPerSec(20)
            .to(80)
            .during(Duration.ofMinutes(3)),
        constantUsersPerSec(80)
            .during(Duration.ofMinutes(10))
    )
).protocols(httpProtocol);
```

A escolha precisa refletir o workload.

---

### 32. Criar assertions Gatling

Exemplo conceitual:

```java
assertions(
    global().failedRequests().percent().lt(1.0),
    global().responseTime().percentile3().lt(250),
    details("order status")
        .responseTime()
        .percentile3()
        .lt(200)
);
```

No Gatling, as assertions exercem papel semelhante aos thresholds do K6.

---

### 33. Comparar K6 e Gatling

K6:

- JavaScript;
- executores explícitos;
- thresholds;
- fácil operação por script;
- boa integração com times que já usam JS.

Gatling:

- JVM;
- DSL;
- feeders;
- injection profiles;
- reports;
- afinidade com ecossistema Java.

Ferramenta não corrige workload mal modelado; o contrato é mais importante que a sintaxe.

---

### 34. Criar política de observabilidade

Arquivo:

```text
load-test-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  generator:
    required:
      - CPU
      - memory
      - network
      - dropped-iterations
      - VUs

  application:
    required:
      - rate
      - errors
      - duration

  resources:
    required:
      - CPU
      - memory
      - GC
      - threads
      - HikariCP
      - Redis
      - Kafka
      - database

  correlation:
    sameWindow:
      required

  rawBusinessIdentifiers:
    forbidden
```

---

### 35. Correlacionar o teste

Script:

```text
correlate-load-test-metrics.ps1
```

Para a janela steady, registre:

- taxa planejada;
- taxa observada;
- p50;
- p95;
- p99;
- erros;
- dropped iterations;
- CPU;
- throttling;
- heap;
- GC;
- thread pools;
- HikariCP pending;
- query time;
- Redis latency;
- cache hit;
- Kafka lag;
- DB CPU;
- lock wait.

---

### 36. Diferenciar falha do gerador

Sinais de gerador saturado:

- CPU alta no gerador;
- memória pressionada;
- network limit;
- dropped iterations;
- VUs máximos atingidos;
- taxa observada abaixo da planejada;
- aplicação saudável.

Nesse caso:

```text
resultado:
inconclusive.
```

Não conclua que o sistema suporta a taxa se o gerador não conseguiu produzi-la.

---

### 37. Criar política de stop

Arquivo:

```text
load-test-stop-policy.yaml
```

Conteúdo:

```yaml
stopConditions:
  required:
    - critical-error-rate
    - source-overload
    - database-connection-risk
    - data-corruption
    - environment-instability
    - generator-failure

  automatic:
    whenSupported:
      true

  manualOwner:
    required

  stopIsNotFailureHiding:
    true
```

---

### 38. Definir critérios de parada

Exemplo:

```text
error rate:
acima de 5% por 1 minuto;

DB CPU:
acima do limite seguro;

HikariCP timeout:
crescimento contínuo;

Kafka lag:
fora da capacidade de recuperação;

dados:
inconsistência;

ambiente:
instável.
```

A parada protege o laboratório e precisa registrar o motivo.

---

### 39. Criar política de regressão

Arquivo:

```text
load-test-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  compare:
    - throughput
    - latency
    - errors
    - dropped-iterations
    - CPU
    - memory
    - GC
    - database
    - caches
    - queues

  sameWorkload:
    required

  sameEnvironment:
    required

  baseline:
    approved:
      required

  improvementWithResourceRegression:
    evaluate:
      required
```

---

### 40. Comparar execuções

Script:

```text
compare-load-test-runs.ps1
```

Compare:

```text
baseline;

candidate.
```

Registre:

- commit;
- profile;
- topology;
- workload;
- rate;
- duration;
- p95;
- p99;
- errors;
- resources;
- confidence;
- decision.

Status:

```text
PASS;

FAIL_BUDGET;

FAIL_ERRORS;

FAIL_RESOURCE;

FAIL_GENERATOR;

INCONCLUSIVE.
```

---

### 41. Criar política de data quality

Arquivo:

```text
load-test-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingWarmup:
    result:
      limited

  unknownBackgroundTraffic:
    result:
      limited

  changedTopology:
    result:
      invalid-comparison

  insufficientSamples:
    result:
      inconclusive

  droppedIterations:
    aboveThreshold:
      result:
        generator-limited

  missingGeneratorMetrics:
    result:
      limited

  mixedPhases:
    action:
      separate-analysis
```

---

### 42. Criar política de segurança

Arquivo:

```text
load-test-security-policy.yaml
```

Conteúdo:

```yaml
security:
  environment:
    authorization:
      required

  credentials:
    injectByEnvironment:
      required

  repository:
    secrets:
      forbidden

  data:
    synthetic:
      required

  logs:
    payload:
      forbidden

  target:
    allowlist:
      required

  destructiveOperation:
    bounded:
      required
```

---

### 43. Criar failure policy

Arquivo:

```text
load-test-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  authenticationFailure:
    action:
      stop-and-fix-test

  dataExhaustion:
    action:
      stop-and-reseed

  generatorSaturation:
    result:
      inconclusive

  targetInstability:
    action:
      stop-and-preserve

  thresholdFailure:
    action:
      collect-correlated-evidence

  cleanupFailure:
    action:
      quarantine-test-data

  stressOrSpike:
    deferredToLesson586
```

---

### 44. Criar cenários

Arquivo:

```text
load-test-scenarios.yaml
```

Cenários:

```text
script-smoke;

authentication-validation;

data-validation;

closed-model-steady;

open-model-steady;

mixed-read-write;

cache-warm;

cache-cold;

database-baseline;

Redis-enabled;

single-replica;

multi-replica;

generator-limited;

threshold-failure;

stop-condition;

rollback-to-baseline.
```

Cada cenário registra:

- objective;
- model;
- rate ou VUs;
- duration;
- data;
- environment;
- checks;
- thresholds;
- stop conditions;
- metrics;
- result;
- rollback;
- evidence.

---

### 45. Executar smoke

Script:

```text
run-load-test-smoke.ps1
```

Valide:

- target correto;
- auth;
- dados;
- status;
- checks;
- tags;
- métricas;
- cleanup;
- summary.

Smoke aprovado é pré-condição da carga estável.

---

### 46. Executar steady load

Script:

```text
run-load-test-steady.ps1
```

Parâmetros:

```text
TARGET_RATE=80;

DURATION=10m;

BASE_URL=ambiente autorizado;

ACCESS_TOKEN=secret local.
```

Não versione o token.

---

### 47. Validar taxa

Script:

```text
validate-load-test-rate.ps1
```

Compare:

- taxa configurada;
- taxa iniciada;
- taxa completada;
- dropped iterations;
- VUs usados;
- max VUs;
- latência;
- generator CPU.

Se a taxa não foi atingida, classifique corretamente.

---

### 48. Validar thresholds

Script:

```text
validate-load-test-thresholds.ps1
```

Confirme:

- thresholds derivam de budgets;
- operações possuem thresholds próprios;
- erro técnico e check são separados;
- dropped iterations são considerados;
- fase warmup não contamina steady;
- resultado é reproduzível.

---

### 49. Criar relatório baseline

Arquivo:

```text
load-test-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  tool:
    K6

  model:
    open

  targetRate:
    80-per-second

  warmup:
    2m

  steady:
    10m

  result:
    PASS

  metrics:
    requestRate:
      achieved

    p95:
      within-budget

    errorRate:
      within-budget

    droppedIterations:
      zero

  resources:
    headroom:
      preserved
```

---

### 50. Criar relatório de workload

Arquivo:

```text
load-test-workload-report.yaml
```

Inclua:

- operações;
- proporções planejadas;
- proporções observadas;
- dados;
- modelo;
- rate;
- VUs;
- think time;
- warmup;
- steady;
- checks;
- thresholds;
- stop conditions.

---

### 51. Validar rollback

Script:

```text
validate-load-test-rollback.ps1
```

Procedimento:

1. parar o teste;
2. interromper geradores;
3. confirmar ausência de workload residual;
4. limpar dados sintéticos;
5. restaurar profiles;
6. validar pools;
7. validar filas;
8. validar caches;
9. repetir health checks;
10. preservar evidence.

---

### 52. Criar matriz de testes

Arquivo:

```text
LOAD_TEST_TEST_MATRIX.md
```

Cenários:

- contract;
- environment;
- authorization;
- data;
- smoke;
- closed model;
- open model;
- VUs;
- arrival rate;
- ramp;
- warmup;
- steady;
- think time;
- checks;
- thresholds;
- operation tags;
- dropped iterations;
- generator CPU;
- generator memory;
- application RED;
- resource USE;
- HikariCP;
- Redis;
- database;
- Kafka;
- stop condition;
- regression;
- rollback;
- security;
- evidence.

---

### 53. Criar troubleshooting

Arquivo:

```text
LOAD_TEST_TROUBLESHOOTING.md
```

Inclua:

- K6 não conecta;
- token ausente;
- dados acabam;
- status 401;
- check passa, mas threshold falha;
- VUs máximos atingidos;
- dropped iterations;
- taxa real abaixo do target;
- gerador usa muita CPU;
- p95 varia;
- warmup misturado;
- cache frio;
- background traffic;
- criação duplica dados;
- cleanup falha;
- Gatling feeder termina;
- comparação usa topologias diferentes;
- stress ou spike antecipado.

---

### 54. Coletar evidence

Script:

```text
collect-load-test-evidence.ps1
```

Arquivo:

```text
load-test-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment category;
- service;
- release;
- commit;
- tool;
- model;
- target rate category;
- duration category;
- data status;
- smoke status;
- checks status;
- thresholds status;
- rate achieved status;
- dropped iterations status;
- application budget status;
- resource status;
- stop condition status;
- rollback status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- token;
- URL privada;
- hostname;
- IP;
- payload;
- ID real;
- resposta;
- cookie;
- header sensível;
- script de stress;
- material da aula 586.

---

### 55. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\load-testing\validate-load-test-contract.ps1

.\scripts\performance\load-testing\validate-load-test-environment.ps1

.\scripts\performance\load-testing\prepare-load-test-data.ps1

.\scripts\performance\load-testing\validate-load-test-data.ps1

.\scripts\performance\load-testing\run-load-test-smoke.ps1

.\scripts\performance\load-testing\run-load-test-steady.ps1

.\scripts\performance\load-testing\validate-load-test-rate.ps1

.\scripts\performance\load-testing\validate-load-test-thresholds.ps1

.\scripts\performance\load-testing\correlate-load-test-metrics.ps1

.\scripts\performance\load-testing\compare-load-test-runs.ps1

.\scripts\performance\load-testing\validate-load-test-stop-conditions.ps1

.\scripts\performance\load-testing\validate-load-test-rollback.ps1

.\scripts\performance\load-testing\scan-load-test-output.ps1

.\scripts\performance\load-testing\collect-load-test-evidence.ps1

.\scripts\performance\load-testing\verify-load-test-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- ambiente autorizado;
- dados aprovados;
- workload aprovado;
- modelo documentado;
- smoke aprovado;
- steady load executado;
- taxa validada;
- thresholds validados;
- gerador saudável;
- métricas correlacionadas;
- baseline comparada;
- stop conditions testadas;
- rollback aprovado;
- segurança aprovada;
- evidence sanitizada;
- stress e pico não antecipados.

---

### 56. Encerrar o laboratório

Pare o gerador.

Confirme:

- nenhuma execução ativa;
- dados sintéticos identificados;
- filas estabilizadas;
- Kafka lag recuperado;
- HikariCP pending em baseline;
- Redis saudável;
- banco saudável;
- profiles restaurados;
- evidence coletada.

Remova artifacts temporários:

```powershell
Remove-Item `
  .tmp/load-testing `
  -Recurse `
  -Force
```

Não remova relatórios sanitizados.

---

## Entendendo o que foi feito

### O teste ganhou hipótese

A execução deixou de ser “mandar tráfego” e passou a validar uma afirmação.

### O workload ganhou proporção

Endpoints passaram a representar comportamento real.

### VUs e taxa foram separados

Usuários virtuais deixaram de ser confundidos com requests por segundo.

### Modelos ganharam significado

Closed e open passaram a responder a tipos diferentes de demanda.

### Ramp e warmup ganharam fases

A janela principal deixou de misturar inicialização e medição.

### Checks e thresholds foram separados

Correção funcional e aprovação de performance passaram a ter papéis distintos.

### O gerador ganhou observabilidade

Dropped iterations e recursos do K6 passaram a limitar conclusões.

### O sistema ganhou correlação

RED, USE, pools, banco, cache e filas foram analisados na mesma janela.

### Stop conditions ganharam segurança

O teste passou a proteger o ambiente.

### A próxima aula ganhou fronteira

A aula 586 irá ultrapassar a carga planejada para localizar saturação, breaking point e comportamento de pico.

---

## Erros comuns importantes

### Usar VUs como sinônimo de RPS

A taxa depende da duração da iteração.

### Escolher modelo fechado para integração

A latência pode reduzir artificialmente a taxa de chegada.

### Ignorar dropped iterations

O gerador pode não ter produzido a carga.

### Medir somente a API

Banco, Redis, HikariCP e filas podem estar degradando.

### Misturar warmup e steady

Percentis ficam difíceis de interpretar.

### Usar média global

Endpoints lentos podem ficar escondidos.

### Fazer checks caros em todas as requests

O próprio gerador pode ser afetado.

### Usar dados repetidos em escrita

Idempotência e unicidade podem distorcer o teste.

### Testar produção sem autorização

Carga pode causar incidente.

### Antecipar stress e spike

Esses cenários pertencem à aula 586.

---

## Comandos úteis

### Executar smoke

```powershell
.\scripts\performance\load-testing\run-load-test-smoke.ps1
```

### Executar carga estável

```powershell
.\scripts\performance\load-testing\run-load-test-steady.ps1
```

### Validar taxa

```powershell
.\scripts\performance\load-testing\validate-load-test-rate.ps1
```

### Correlacionar métricas

```powershell
.\scripts\performance\load-testing\correlate-load-test-metrics.ps1
```

### Comparar execuções

```powershell
.\scripts\performance\load-testing\compare-load-test-runs.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Defina objetivo, ambiente e hipótese.

### Parte 2 — Workload

Modele operações e proporções.

### Parte 3 — Data

Prepare dados sintéticos.

### Parte 4 — Model

Compare closed e open.

### Parte 5 — K6

Crie smoke e steady load.

### Parte 6 — Gatling

Mapeie protocol, scenario, feeder e injection.

### Parte 7 — Thresholds

Derive critérios dos budgets.

### Parte 8 — Observability

Correlacione gerador e sistema.

### Parte 9 — Stop

Valide critérios de parada.

### Parte 10 — Gate

Compare baseline, rollback e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 584 e ponte para a aula 586 foram preservadas;
- load testing, VU, iteration, request rate, arrival rate, concurrency, closed model, open model, think time, ramp-up, warmup, steady state, check, threshold, scenario, feeder, pacing e coordinated omission foram definidos;
- contrato, workload, ambiente, dados, modelo, rate, VUs, ramp, duração, checks, thresholds, observabilidade, stop, regressão, qualidade, segurança e failure policies foram criados;
- hipótese de teste foi documentada;
- operações e proporções do workload foram catalogadas;
- ambiente autorizado e topologia foram registrados;
- dados sintéticos, idempotency keys e cleanup foram preparados;
- closed e open workload models foram comparados;
- VUs não foram confundidos com usuários reais ou requests por segundo;
- arrival rate, preAllocatedVUs, maxVUs e dropped iterations foram tratados;
- ramp-up, warmup, steady e ramp-down foram separados;
- script K6 possui config, helpers, tags, checks e thresholds;
- smoke test foi executado antes da carga estável;
- steady load permaneceu dentro da faixa planejada;
- operação específica possui threshold próprio;
- K6 e Gatling foram mapeados conceitualmente;
- Gatling possui protocol, feeder, scenario, injection e assertions;
- métricas do gerador foram observadas;
- RED e USE do sistema foram correlacionados na mesma janela;
- HikariCP, Redis, PostgreSQL, Kafka, CPU, memória e GC foram analisados;
- generator saturation foi diferenciado de target saturation;
- stop conditions foram definidos e validados;
- baseline e candidate foram comparadas com mesmo workload e ambiente;
- cenários, matriz, troubleshooting, rollback e evidence sanitizada estão presentes;
- nenhum token, URL privada, payload, ID real ou segredo foi commitado;
- stress e carga de pico não foram antecipados;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/load-testing `
  scripts/performance/load-testing `
  docs/performance/load-testing `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password|authorization|bearer|access_token|refresh_token|client_secret|cookie|privateUrl|hostname|customerId|orderId|responseBody|stressTest|spikeTest|breakingPoint"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar load testing conceitual"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- tokens;
- URLs privadas;
- payloads;
- IDs reais;
- cookies;
- headers sensíveis;
- artifacts temporários;
- scripts de stress;
- cenários de spike;
- material da aula 586.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você estruturou load testing como experimento controlado.

Você trabalhou com:

```text
K6;

Gatling;

virtual users;

arrival rate;

closed model;

open model;

ramp-up;

warmup;

steady load;

checks;

thresholds;

feeders;

assertions;

stop conditions;

correlação;

rollback.
```

Você comprovou que VUs não são iguais a RPS; modelo fechado reduz naturalmente a taxa quando a aplicação fica lenta; modelo aberto preserva a chegada e exige VUs suficientes; workload precisa representar operações e proporções reais; warmup e steady devem ser separados; checks validam funcionalidade e thresholds validam performance; dropped iterations podem indicar limitação do gerador; e a conclusão precisa correlacionar taxa, latência, erros, CPU, memória, GC, pools, banco, cache e filas.

A próxima aula será:

```text
586 - M18.31 - Teste de stress carga pico
```

Nela, você irá ultrapassar a carga esperada de forma controlada para identificar saturação, breaking point, degradação, recuperação, backlog, load shedding e comportamento durante picos abruptos.

Nenhum stress progressivo, spike abrupto, breaking point, overload deliberado ou teste de recuperação após colapso foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei hipótese de carga.
- [ ] Modelei workload.
- [ ] Preparei dados sintéticos.
- [ ] Diferenciei VUs e arrival rate.
- [ ] Diferenciei closed e open.
- [ ] Executei smoke.
- [ ] Executei steady load.
- [ ] Correlacionei gerador e sistema.

---

## Troubleshooting adicional

### A taxa real ficou abaixo do target

Verifique dropped iterations, max VUs, CPU, memória e rede do gerador.

### O p95 varia muito

Aumente amostra, estabilize ambiente e separe warmup.

### Checks passam, mas threshold falha

A funcionalidade está correta, porém o budget não foi atendido.

### O teste recebe 401

Corrija token, expiração, audience e tenant antes de gerar carga.

### O create gera conflitos

Use idempotency keys e dados únicos.

### O cache distorce a baseline

Defina se o cenário deve começar cold ou warm.

### O Gatling feeder termina

Aumente dados, use circularidade apenas quando o contrato permitir ou gere novos valores.

### O gerador está saturado

Distribua carga ou reduza custo do script; não conclua sobre o target.

### A fila continua crescendo após o teste

Aguarde recuperação e registre backlog antes do rollback.

### O cenário começou a aumentar até quebra

Preserve essa investigação para a aula 586.

---

## Perguntas de revisão

1. O que é load testing?
2. O que é virtual user?
3. O que é iteration?
4. Qual diferença entre RPS e arrival rate?
5. O que é concurrency?
6. O que é closed workload?
7. O que é open workload?
8. O que é think time?
9. O que é ramp-up?
10. O que é warmup?
11. O que é steady state?
12. Qual diferença entre check e threshold?
13. O que é dropped iteration?
14. Como estimar VUs?
15. O que é coordinated omission?
16. Como detectar saturação do gerador?
17. Por que usar tags por operação?
18. O que é stop condition?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Workload controlado.
2. Execução lógica.
3. Uma volta completa do cenário.
4. Requests versus início de iterações.
5. Operações simultâneas.
6. Usuários aguardam respostas.
7. Chegadas seguem uma taxa.
8. Pausa entre ações.
9. Aumento gradual.
10. Estabilização inicial.
11. Janela estável.
12. Validação funcional versus gate.
13. Iteração que não pôde iniciar.
14. Rate vezes duração com margem.
15. Subestimação quando a taxa cai.
16. Métricas do gerador e dropped iterations.
17. Separar operações.
18. Critério de interrupção segura.
19. Stress e carga pico.
20. Teste de stress carga pico.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 585 - M18.30 - Load testing K6 ou Gatling conceitual

- Continuei após Cache invalidation.
- Entendi load testing como experimento controlado.
- Criei contrato, hipótese e catálogo de workload.
- Registrei ambiente e topologia.
- Preparei dados sintéticos e cleanup.
- Diferenciei virtual users, RPS, arrival rate e concorrência.
- Apliquei a relação entre throughput, latência e concorrência.
- Diferenciei closed e open workload models.
- Modelei proporções entre endpoints.
- Separei warmup, ramp e steady state.
- Criei config, helpers, workload, smoke e steady load no K6.
- Criei checks e thresholds derivados dos budgets.
- Usei tags por operação.
- Modelei protocol, feeder, scenario, injection e assertions no Gatling.
- Observei CPU, memória, VUs e dropped iterations do gerador.
- Correlacionei RED e USE da aplicação.
- Analisei HikariCP, Redis, PostgreSQL, Kafka, CPU, memória e GC.
- Diferenciei falha do gerador e saturação do target.
- Criei stop conditions.
- Comparei baseline e candidate.
- Validei rollback e evidence sanitizada.
- Não antecipei stress ou spike.
- Próxima aula: Teste de stress carga pico.
```

---

## Referência técnica curta

- Load testing.
- K6 scenarios and executors.
- K6 checks and thresholds.
- Gatling scenarios and injection.
- Closed workload model.
- Open workload model.
- Virtual users.
- Arrival rate.
- Coordinated omission.
- Performance test observability.

Regra final:

```text
load testing precisa ser tratado como experimento reproduzível, com hipótese, ambiente autorizado, workload, dados sintéticos, modelo, duração, checks, thresholds, observabilidade, stop conditions e rollback: virtual users representam execuções lógicas e não requests por segundo, modelos fechados dependem da duração das iterações, modelos abertos preservam arrival rate e exigem VUs suficientes, e a relação entre throughput, latência e concorrência ajuda a validar o cenário; warmup, ramp e steady state são separados, operações recebem tags e budgets próprios, checks validam comportamento enquanto thresholds aprovam performance, e dropped iterations, CPU, memória e rede do gerador impedem conclusões falsas; resultados são correlacionados com RED, USE, HikariCP, PostgreSQL, Redis, Kafka, GC e filas na mesma janela, deixando para a aula 586 o stress progressivo, a carga de pico, o breaking point, o overload deliberado e a recuperação após saturação.
```
