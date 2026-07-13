# 596 - M18.41 - Timeouts em producao

## Apresentação da aula

Na aula 595, você estruturou backpressure como um contrato de capacidade entre produtores e consumidores.

Você trabalhou com:

```text
production rate;

consumption rate;

bounded buffers;

overflow;

demanda;

créditos;

request(n);

admission control;

load shedding;

recovery;

shutdown.
```

A conclusão principal foi:

```text
quando a entrada
supera a saída,

o sistema precisa
reduzir,
bloquear,
rejeitar
ou descartar trabalho
de forma explícita.
```

Nesta aula, o problema é outro.

Mesmo quando o volume está dentro da capacidade, uma operação pode demorar mais do que o usuário, o chamador ou a arquitetura conseguem tolerar.

A pergunta central será:

```text
quanto tempo
cada etapa pode esperar

antes de desistir,

devolver controle
e proteger
o restante do sistema?
```

Um timeout não é apenas um número configurado em uma biblioteca.

Ele representa uma decisão arquitetural:

```text
por quanto tempo
um recurso pode permanecer
ocupado

sem produzir
um resultado útil?
```

Enquanto espera, uma operação consome threads, conexões, permits, slots, memória, filas, locks e budget da request.

Timeouts existem para limitar essa espera.

Porém, timeouts mal configurados podem piorar o sistema.

Exemplo:

```text
timeout externo:
2 segundos.

timeout interno:
10 segundos.
```

O chamador abandona a operação em dois segundos, mas o trabalho interno pode continuar por mais oito segundos.

Esse trabalho órfão ocupa recursos, gera efeitos tardios, amplia retries e degrada o shutdown.

Outro exemplo:

```text
request total:
1 segundo.

três dependências sequenciais:

500 ms cada.
```

Mesmo sem overhead local, a soma potencial é:

```text
1.500 ms.
```

O budget não fecha.

Você trabalhará com deadlines, budgets, timeouts de conexão, aquisição, leitura, escrita, resposta, fila, lock, transação, Future, Kafka, retries, cancelamento, tail latency, observabilidade e runbooks.

A regra central será:

```text
timeout local
não deve exceder
o budget restante
da jornada.
```

Você também irá validar que:

```text
timeout
não é cancelamento garantido.
```

Uma chamada pode retornar `TimeoutException` enquanto a operação continua.

Por isso, cada timeout precisa definir cancelamento, resultado tardio, cleanup, fallback, retry, idempotência e observabilidade.

O laboratório representará uma jornada sintética com HTTP, pool de conexão, PostgreSQL, Redis, Kafka e montagem da resposta.

O budget total didático será distribuído entre essas etapas.

Os valores são didáticos, não universais.

A próxima aula oficial será:

```text
597 - M18.42 - Memory leak diagnostico
```

Por isso, esta aula não irá aprofundar:

- heap dump;
- dominator tree;
- retained heap;
- shallow heap;
- GC roots;
- leak suspects;
- Eclipse MAT;
- JProfiler;
- VisualVM heap analysis;
- classes retidas;
- classloader leak;
- ThreadLocal leak aprofundado;
- direct buffer leak;
- native memory tracking;
- memory leak regression lab.

Memória aparecerá somente como recurso consumido por operações pendentes.

A regra final da aula será:

```text
defina primeiro
o deadline da jornada;

depois distribua
budgets internos;

por fim configure
clientes,
pools,
filas
e retries

para nunca ultrapassar
o tempo restante.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
594:
Deadlocks em Java.

595:
Backpressure conceitual.

596:
Timeouts em producao.

597:
Memory leak diagnostico.
```

A progressão é:

```text
diagnosticar ausência de progresso;

controlar pressão;

limitar duração da espera;

diagnosticar retenção de memória.
```

Nesta aula:

```text
deadline:
sim.

budget total:
sim.

remaining budget:
sim.

connect timeout:
sim.

connection acquisition timeout:
sim.

read timeout:
sim.

write timeout:
sim.

response timeout:
sim.

JDBC timeout:
sim.

Redis timeout:
sim.

Kafka timeout:
sim.

Future timeout:
sim.

lock e queue timeout:
sim.

retry budget:
sim.

timeout propagation:
sim.

cancelamento:
sim.

heap dump:
não.

memory leak:
não aprofundar.
```

Você reutilizará:

- backpressure;
- bounded queues;
- executors;
- `Future`;
- `CompletableFuture`;
- virtual threads;
- HikariCP;
- PostgreSQL;
- Redis;
- Kafka;
- HTTP;
- tracing;
- logs;
- métricas;
- load testing;
- stress testing;
- runbooks.

O desenho precisa preservar:

- deadline monotônico;
- budgets positivos;
- timeout interno menor que o restante;
- cancelamento quando suportado;
- idempotência;
- bounded retries;
- liberação de recursos;
- observabilidade;
- shutdown;
- ausência de trabalho órfão não controlado.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/timeouts
├── timeout-contract.yaml
├── timeout-journey-catalog.yaml
├── timeout-budget-policy.yaml
├── timeout-hierarchy-policy.yaml
├── timeout-propagation-policy.yaml
├── timeout-http-policy.yaml
├── timeout-jdbc-policy.yaml
├── timeout-redis-policy.yaml
├── timeout-kafka-policy.yaml
├── timeout-executor-policy.yaml
├── timeout-retry-policy.yaml
├── timeout-cancellation-policy.yaml
├── timeout-observability-policy.yaml
├── timeout-shutdown-policy.yaml
├── timeout-data-quality-policy.yaml
├── timeout-security-policy.yaml
├── timeout-failure-policy.yaml
├── timeout-scenarios.yaml
└── timeout-evidence.yaml

performance/timeouts/src/main/java
└── br/com/formacao/performance/timeouts
    ├── TimeoutCategory.java
    ├── Deadline.java
    ├── TimeBudget.java
    ├── RemainingBudget.java
    ├── TimeoutOutcome.java
    ├── TimeoutStageEvent.java
    ├── TimeoutMetrics.java
    ├── SyntheticOrderJourney.java
    ├── TimedDependency.java
    ├── HttpTimeoutProfile.java
    ├── JdbcTimeoutProfile.java
    ├── RedisTimeoutProfile.java
    ├── KafkaTimeoutProfile.java
    ├── RetryBudget.java
    ├── TimeoutCancellationManager.java
    ├── TimeoutShutdownResult.java
    ├── TimeoutShutdownManager.java
    └── TimeoutDemo.java

performance/timeouts/src/test/java
└── br/com/formacao/performance/timeouts
    ├── DeadlineTest.java
    ├── RemainingBudgetTest.java
    ├── TimeoutHierarchyTest.java
    ├── HttpTimeoutProfileTest.java
    ├── JdbcTimeoutProfileTest.java
    ├── RedisTimeoutProfileTest.java
    ├── KafkaTimeoutProfileTest.java
    ├── ExecutorTimeoutTest.java
    ├── RetryBudgetTest.java
    ├── TimeoutCancellationTest.java
    ├── TimeoutShutdownTest.java
    └── TimeoutContractTest.java

performance/timeouts/reports
├── timeout-baseline-report.yaml
├── timeout-budget-report.yaml
├── timeout-hierarchy-report.yaml
├── timeout-dependency-report.yaml
├── timeout-retry-report.yaml
├── timeout-cancellation-report.yaml
└── timeout-gate-report.yaml

scripts/performance/timeouts
├── validate-timeout-contract.ps1
├── validate-timeout-journey-catalog.ps1
├── run-timeout-baseline.ps1
├── validate-timeout-budgets.ps1
├── validate-timeout-hierarchy.ps1
├── simulate-connect-timeout.ps1
├── simulate-acquisition-timeout.ps1
├── simulate-read-timeout.ps1
├── simulate-response-timeout.ps1
├── validate-http-timeouts.ps1
├── validate-jdbc-timeouts.ps1
├── validate-redis-timeouts.ps1
├── validate-kafka-timeouts.ps1
├── validate-executor-timeouts.ps1
├── validate-retry-budget.ps1
├── validate-timeout-cancellation.ps1
├── validate-timeout-observability.ps1
├── validate-timeout-shutdown.ps1
├── scan-timeout-output.ps1
├── collect-timeout-evidence.ps1
└── verify-timeout-baseline.ps1

docs/performance/timeouts
├── TIMEOUTS_OVERVIEW.md
├── DEADLINES_AND_BUDGETS.md
├── TIMEOUT_HIERARCHY.md
├── HTTP_TIMEOUTS.md
├── JDBC_TIMEOUTS.md
├── REDIS_TIMEOUTS.md
├── KAFKA_TIMEOUTS.md
├── EXECUTOR_AND_FUTURE_TIMEOUTS.md
├── RETRY_AND_TIMEOUT_BUDGETS.md
├── TIMEOUT_OBSERVABILITY.md
├── TIMEOUT_TEST_MATRIX.md
└── TIMEOUT_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato;

catálogo de jornadas;

deadline;

remaining budget;

hierarquia de timeouts;

perfis HTTP,
JDBC,
Redis,
Kafka
e executor;

retry budget;

cancelamento;

observabilidade;

shutdown;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### Timeout

Limite máximo de espera para uma operação ou etapa.

---

### Deadline

Instante absoluto após o qual a jornada não possui mais utilidade.

---

### Time budget

Quantidade total de tempo disponível para uma jornada.

---

### Remaining budget

Tempo restante entre agora e o deadline.

---

### Connect timeout

Tempo máximo para estabelecer uma conexão.

---

### Connection acquisition timeout

Tempo máximo para obter uma conexão de um pool.

---

### Read timeout

Tempo máximo de espera por dados durante leitura.

---

### Write timeout

Tempo máximo permitido para envio ou escrita.

---

### Response timeout

Tempo máximo esperado para receber uma resposta completa ou seus sinais relevantes.

---

### Queue timeout

Tempo máximo aguardando em fila antes de iniciar processamento.

---

### Lock timeout

Tempo máximo para adquirir um lock.

---

### Transaction timeout

Limite da transação antes de abortar.

---

### Retry budget

Parte do budget total reservada para novas tentativas.

---

### False timeout

Timeout disparado em uma operação que poderia concluir pouco depois do limite, frequentemente por configuração agressiva ou variabilidade não considerada.

---

### Tail latency

Latência das requisições mais lentas, observada em percentis como p95, p99 e p99.9.

---

### Orphan work

Trabalho que continua após o chamador abandonar a operação.

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

Confirme:

- aula 595 validada;
- buffers encerrados;
- zero task leaks;
- nenhum processo residual;
- clientes sintéticos disponíveis;
- relógio monotônico será usado para duração;
- dados permanecem sintéticos.

---

### 2. Criar contrato

Arquivo:

```text
timeout-contract.yaml
```

Conteúdo:

```yaml
timeouts:
  required:
    - journey
    - owner
    - total-budget
    - deadline-source
    - stages
    - remaining-budget
    - cancellation
    - retry-budget
    - observability
    - shutdown

  hierarchy:
    innerMustFitRemainingBudget:
      required

  duration:
    monotonicClock:
      required

  indefiniteWait:
    forbidden

  forbiddenInLesson596:
    - heap-dump-analysis
    - memory-leak-diagnosis
    - retained-heap-analysis

  nextLesson:
    code:
      M18.42
```

---

### 3. Criar catálogo de jornadas

Arquivo:

```text
timeout-journey-catalog.yaml
```

Exemplo:

```yaml
journeys:
  - id:
      ORDER-DETAIL

    owner:
      orders-api

    totalBudget:
      800ms

    stages:
      - name:
          queue

        maximum:
          40ms

      - name:
          database-acquisition

        maximum:
          80ms

      - name:
          database-query

        maximum:
          180ms

      - name:
          Redis-read

        maximum:
          60ms

      - name:
          partner-HTTP

        maximum:
          250ms

      - name:
          response-assembly

        maximum:
          50ms

    reserve:
      140ms

    productionValues:
      undefined
```

---

### 4. Criar `Deadline`

```java
public record Deadline(
        long deadlineNanos) {

    public static Deadline after(
            Duration budget) {

        if (budget.isZero()
                || budget.isNegative()) {
            throw new IllegalArgumentException(
                    "Budget must be positive");
        }

        long now =
                System.nanoTime();

        return new Deadline(
                Math.addExact(
                        now,
                        budget.toNanos()));
    }

    public Duration remaining() {
        long nanos =
                deadlineNanos
                        - System.nanoTime();

        return nanos <= 0
                ? Duration.ZERO
                : Duration.ofNanos(nanos);
    }

    public boolean expired() {
        return remaining().isZero();
    }
}
```

`System.nanoTime()` é adequado para medir duração.

Não use apenas `Instant.now()` para duração monotônica.

---

### 5. Criar `TimeBudget`

```java
public record TimeBudget(
        Duration total,
        Duration reserve) {

    public TimeBudget {
        Objects.requireNonNull(total);
        Objects.requireNonNull(reserve);

        if (total.isZero()
                || total.isNegative()) {
            throw new IllegalArgumentException(
                    "Total must be positive");
        }

        if (reserve.isNegative()
                || reserve.compareTo(total) >= 0) {
            throw new IllegalArgumentException(
                    "Invalid reserve");
        }
    }

    public Duration usable() {
        return total.minus(reserve);
    }
}
```

A reserva cobre overhead, serialização, scheduling, logging, variabilidade, cleanup e resposta.

---

### 6. Criar `RemainingBudget`

```java
public final class RemainingBudget {

    private final Deadline deadline;
    private final Duration reserve;

    public RemainingBudget(
            Deadline deadline,
            Duration reserve) {
        this.deadline = deadline;
        this.reserve = reserve;
    }

    public Duration forStage(
            Duration configuredMaximum) {

        Duration remaining =
                deadline.remaining()
                        .minus(reserve);

        if (remaining.isZero()
                || remaining.isNegative()) {
            return Duration.ZERO;
        }

        return remaining.compareTo(
                        configuredMaximum)
                < 0
                        ? remaining
                        : configuredMaximum;
    }
}
```

Toda etapa recebe:

```text
min(
  timeout configurado,
  budget restante utilizável
).
```

---

### 7. Criar policy de budget

Arquivo:

```text
timeout-budget-policy.yaml
```

Conteúdo:

```yaml
budget:
  journey:
    required

  reserve:
    required

  stage:
    calculate:
      minConfiguredAndRemaining

  exhausted:
    action:
      fail-before-starting-new-work

  negative:
    forbidden

  measurement:
    monotonic:
      required
```

---

### 8. Entender deadline absoluto

Propagar apenas:

```text
timeout:
300ms
```

pode reiniciar o relógio em cada serviço.

Propagar:

```text
deadline absoluto
ou
remaining budget calculado
```

mantém a jornada dentro do limite.

Em sistemas distribuídos, considere clock skew, precisão, overhead, reserva e validação do valor recebido.

---

### 9. Criar policy de propagação

Arquivo:

```text
timeout-propagation-policy.yaml
```

Conteúdo:

```yaml
propagation:
  inbound:
    validate:
      required

  outbound:
    include:
      - deadline-or-remaining-budget
      - correlation-category

  downstream:
    neverReceiveMoreThanRemaining:
      required

  clockSkew:
    margin:
      requiredWhenAbsoluteWallClockUsed

  untrustedLargeDeadline:
    cap:
      required

  expiredBeforeCall:
    rejectLocally:
      required
```

---

### 10. Criar hierarchy policy

Arquivo:

```text
timeout-hierarchy-policy.yaml
```

Conteúdo:

```yaml
hierarchy:
  outer:
    greaterThan:
      - inner-operation-timeout
      - cleanup-margin

  inner:
    fitWithin:
      remaining-budget

  connectionAcquisition:
    lessThan:
      journey-budget

  retry:
    totalAttemptsFitJourney:
      required

  invertedHierarchy:
    action:
      fail-gate
```

Uma hierarquia coerente evita trabalho interno depois da desistência externa.

---

### 11. Classificar timeouts HTTP

Perfil:

```java
public record HttpTimeoutProfile(
        Duration connect,
        Duration acquisition,
        Duration write,
        Duration read,
        Duration response,
        Duration journey) {

    public HttpTimeoutProfile {
        requirePositive(connect);
        requirePositive(acquisition);
        requirePositive(write);
        requirePositive(read);
        requirePositive(response);
        requirePositive(journey);

        if (response.compareTo(journey) >= 0) {
            throw new IllegalArgumentException(
                    "Response must fit journey");
        }
    }
}
```

Os nomes variam por cliente; valide a semântica da biblioteca.

---

### 12. Criar policy HTTP

Arquivo:

```text
timeout-http-policy.yaml
```

Conteúdo:

```yaml
HTTP:
  required:
    - connect
    - connection-acquisition
    - write
    - read-or-response
    - total-journey

  DNS:
    observe:
      required

  connectionPool:
    pending:
      metric:
        required

  cancellation:
    propagateWhenSupported:
      true

  responseBody:
    abandoned:
      close:
        required

  defaultInfinite:
    forbidden
```

---

### 13. Diferenciar connect e acquisition

`connect timeout` limita a criação de nova conexão.

`connection acquisition timeout` limita a espera por uma conexão do pool.

Uma API pode estar saudável, mas o cliente local pode estar com pool esgotado.

Nesse caso:

```text
connect:
nem começou.

acquisition:
expirou esperando slot.
```

As métricas precisam distinguir os dois.

---

### 14. Simular connect timeout

Script:

```text
simulate-connect-timeout.ps1
```

O cenário sintético usa um endpoint de laboratório que não estabelece conexão dentro do budget.

Registre:

- etapa;
- timeout configurado;
- elapsed;
- remaining budget;
- pool;
- outcome;
- cancellation;
- cleanup.

---

### 15. Simular response timeout

Script:

```text
simulate-response-timeout.ps1
```

O servidor aceita a conexão, mas atrasa a resposta.

Isso precisa ser categorizado separadamente de connect timeout.

---

### 16. Configurar JDBC conceitualmente

JDBC e pool possuem limites diferentes:

- Hikari connection timeout;
- JDBC query timeout;
- transaction timeout;
- socket timeout do driver;
- statement timeout do banco;
- lock timeout do banco;
- idle transaction timeout.

Não use o mesmo valor sem entender cada camada.

---

### 17. Criar `JdbcTimeoutProfile`

```java
public record JdbcTimeoutProfile(
        Duration acquisition,
        Duration query,
        Duration transaction,
        Duration socket,
        Duration lockWait) {

    public JdbcTimeoutProfile {
        requirePositive(acquisition);
        requirePositive(query);
        requirePositive(transaction);
        requirePositive(socket);
        requirePositive(lockWait);

        if (query.compareTo(transaction) >= 0) {
            throw new IllegalArgumentException(
                    "Query must fit transaction");
        }
    }
}
```

---

### 18. Criar policy JDBC

Arquivo:

```text
timeout-jdbc-policy.yaml
```

Conteúdo:

```yaml
JDBC:
  connectionPool:
    acquisitionTimeout:
      required

  statement:
    queryTimeout:
      requiredForBoundedJourney

  transaction:
    timeout:
      requiredWhenFrameworkSupports

  database:
    statementTimeout:
      align:
        required

    lockTimeout:
      explicit:
        requiredForContentiousFlow

  rollback:
    budget:
      reserve:
        required

  connection:
    returnToPool:
      required
```

Reserve tempo para rollback e devolução da conexão.

---

### 19. Simular acquisition timeout

Pool sintético:

```text
connections:
2.

holders:
2.

third request:
aguarda.

acquisition timeout:
50ms.
```

Valide:

- timeout ocorre na aquisição;
- query não começa;
- conexão não vaza;
- pending retorna ao baseline;
- pool continua utilizável.

---

### 20. Simular query timeout

A conexão é obtida.

A query sintética ultrapassa o limite.

Valide:

- statement é cancelado quando suportado;
- transação é marcada para rollback;
- rollback ocorre dentro da reserva;
- conexão retorna limpa;
- erro é categorizado como query timeout.

---

### 21. Criar policy Redis

Arquivo:

```text
timeout-redis-policy.yaml
```

Conteúdo:

```yaml
Redis:
  connect:
    required

  command:
    timeout:
      required

  pool:
    acquisition:
      requiredWhenApplicable

  blockingCommand:
    bounded:
      required

  pipeline:
    totalBudget:
      required

  fallback:
    metric:
      required

  lateResponse:
    discardSafely:
      required
```

---

### 22. Criar perfil Redis

```java
public record RedisTimeoutProfile(
        Duration connect,
        Duration acquisition,
        Duration command,
        Duration pipeline) {
}
```

O timeout do comando precisa caber no budget do pipeline e da jornada.

---

### 23. Simular Redis lento

Cenários incluem conexão lenta, pool esgotado, comando lento, pipeline parcial, fallback, cache miss e stampede.

Valide que fallback não transforma indisponibilidade em carga descontrolada no banco.

---

### 24. Criar policy Kafka

Arquivo:

```text
timeout-kafka-policy.yaml
```

Conteúdo:

```yaml
Kafka:
  producer:
    deliveryTimeout:
      required

    requestTimeout:
      required

    maxBlock:
      required

  consumer:
    poll:
      bounded:
        required

    processing:
      fitWithin:
        maxPollInterval

  admin:
    operationTimeout:
      required

  transaction:
    timeout:
      requiredWhenTransactional

  retry:
    fitWithinDeliveryBudget:
      required
```

---

### 25. Diferenciar Kafka producer timeouts

Conceitualmente:

- `max.block.ms`: espera local por metadata ou buffer;
- `request.timeout.ms`: espera pela resposta da requisição;
- `delivery.timeout.ms`: limite total de entrega incluindo retries permitidos;
- transaction timeout: duração da transação do producer.

A hierarquia precisa ser coerente.

---

### 26. Validar Kafka timeout

Script:

```text
validate-kafka-timeouts.ps1
```

Cenário sintético:

- broker indisponível;
- buffer local pressionado;
- metadata atrasada;
- retry ativo;
- delivery budget bounded.

Confirme:

- operação termina;
- exception é categorizada;
- retry não ultrapassa delivery budget;
- producer continua fechável;
- nenhum envio tardio é tratado como sucesso local.

---

### 27. Configurar executor e Future

`Future.get(timeout)` limita a espera do chamador.

Ele não garante que a task pare.

Após timeout:

```java
boolean cancellationRequested =
        future.cancel(true);
```

A task precisa cooperar com interruption.

---

### 28. Criar policy de executor

Arquivo:

```text
timeout-executor-policy.yaml
```

Conteúdo:

```yaml
executor:
  queueWait:
    metric:
      required

  task:
    executionTimeout:
      requiredForBoundedJourney

  Future:
    get:
      timeout:
        required

  timeout:
    cancellation:
      evaluate:
        required

  samePoolNestedWait:
    forbidden

  shutdown:
    awaitTermination:
      bounded:
        required
```

---

### 29. Criar dependency sintética

```java
public final class TimedDependency {

    public String execute(
            Duration simulatedLatency)
            throws InterruptedException {

        Thread.sleep(
                simulatedLatency.toMillis());

        return "ok";
    }
}
```

Essa classe representa espera interruptível.

---

### 30. Criar outcome

```java
public enum TimeoutOutcome {
    SUCCESS,
    CONNECT_TIMEOUT,
    ACQUISITION_TIMEOUT,
    READ_TIMEOUT,
    WRITE_TIMEOUT,
    RESPONSE_TIMEOUT,
    QUERY_TIMEOUT,
    LOCK_TIMEOUT,
    QUEUE_TIMEOUT,
    JOURNEY_TIMEOUT,
    CANCELLED,
    FAILED
}
```

Não agrupe todos em `TIMEOUT_GENERIC`.

---

### 31. Criar stage event

```java
public record TimeoutStageEvent(
        String journey,
        String stage,
        TimeoutOutcome outcome,
        Duration configuredTimeout,
        Duration remainingBefore,
        Duration elapsed,
        boolean cancellationRequested,
        Instant occurredAt) {
}
```

Não inclua IDs reais.

---

### 32. Criar policy de retry

Arquivo:

```text
timeout-retry-policy.yaml
```

Conteúdo:

```yaml
retry:
  budget:
    required

  total:
    fitWithinJourney:
      required

  attempt:
    timeout:
      deriveFromRemaining

  maximumAttempts:
    required

  backoff:
    required

  jitter:
    required

  retryable:
    explicit:
      required

  nonIdempotent:
    retry:
      forbiddenWithoutIdempotencyProtection
```

---

### 33. Criar `RetryBudget`

```java
public final class RetryBudget {

    private final Deadline deadline;
    private final int maximumAttempts;
    private int attempts;

    public RetryBudget(
            Deadline deadline,
            int maximumAttempts) {
        this.deadline = deadline;
        this.maximumAttempts =
                maximumAttempts;
    }

    public boolean canAttempt(
            Duration minimumRequired) {

        return attempts < maximumAttempts
                && deadline.remaining()
                        .compareTo(
                                minimumRequired)
                >= 0;
    }

    public int registerAttempt() {
        attempts++;
        return attempts;
    }
}
```

Cada tentativa precisa recalcular o restante.

---

### 34. Evitar timeout amplification

Fluxo ruim:

```text
tentativa 1:
500ms.

retry:
500ms.

retry:
500ms.

budget externo:
800ms.
```

A operação interna pode consumir 1.500ms.

Fluxo correto:

```text
deadline:
800ms.

tentativa 1:
até 300ms.

backoff:
50ms.

tentativa 2:
usa apenas o restante.

reserva:
mantida.
```

---

### 35. Escolher timeout por percentis

Ponto inicial comum:

```text
timeout acima
da latência normal de cauda,
com margem.
```

A escolha considera SLO, falso timeout, variabilidade, cold start, rede, carga, GC, retries e margem de resposta.

Não configure exatamente no p99 sem entender que aproximadamente 1% das chamadas podem ultrapassá-lo no perfil medido.

---

### 36. Criar policy de cancelamento

Arquivo:

```text
timeout-cancellation-policy.yaml
```

Conteúdo:

```yaml
cancellation:
  timeout:
    request:
      explicit

  supportedOperation:
    cancel:
      required

  interruption:
    preserve:
      required

  unsupportedCancellation:
    lateResultPolicy:
      required

  sideEffect:
    idempotency:
      required

  cleanup:
    finally:
      required
```

---

### 37. Tratar resultado tardio

Quando não for possível cancelar, encerre a jornada, ignore o resultado tardio, proteja side effects, registre late completion e libere recursos.

---

### 38. Criar jornada sintética

```java
public final class SyntheticOrderJourney {

    public TimeoutOutcome execute(
            TimeBudget budget,
            List<TimedStage> stages) {

        Deadline deadline =
                Deadline.after(
                        budget.total());

        RemainingBudget remaining =
                new RemainingBudget(
                        deadline,
                        budget.reserve());

        for (TimedStage stage : stages) {
            Duration allowed =
                    remaining.forStage(
                            stage.maximum());

            if (allowed.isZero()) {
                return TimeoutOutcome
                        .JOURNEY_TIMEOUT;
            }

            TimeoutOutcome outcome =
                    stage.execute(allowed);

            if (outcome
                    != TimeoutOutcome.SUCCESS) {
                return outcome;
            }
        }

        return TimeoutOutcome.SUCCESS;
    }
}
```

---

### 39. Criar policy de observabilidade

Arquivo:

```text
timeout-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  required:
    - journey-duration
    - stage-duration
    - configured-timeout
    - remaining-budget
    - timeout-category
    - cancellation-requested
    - late-completion
    - retry-attempt
    - queue-wait
    - pool-acquisition-wait

  metrics:
    distributions:
      - latency
      - remaining-budget
      - acquisition-wait

  labels:
    forbidden:
      - request-id
      - customer-id
      - order-id
      - raw-exception-message
```

---

### 40. Evitar cardinalidade

Use labels de serviço, dependência, operação, categoria, outcome, release e ambiente; não use URLs dinâmicas, IDs, SQL, mensagens brutas ou thread IDs.

---

### 41. Criar alertas

Observe timeout rate por categoria, remaining budget, acquisition, queue, late completion, cancelamento, retries, p95, p99, saturação, erros e throughput.

Um aumento de timeout sem aumento de latência observada pode indicar erro de configuração ou instrumentação.

---

### 42. Correlacionar com backpressure

Se filas crescem:

```text
queue wait
consome budget
antes da task começar.
```

A dependência pode receber apenas uma fração do tempo original.

Meça queue wait, execution, acquisition, downstream e response assembly separadamente.

---

### 43. Correlacionar com virtual threads

Virtual threads tornam espera barata para a JVM, mas o deadline continua expirando.

Uma virtual thread aguardando HikariCP por muito tempo ainda representa uma request sem resposta.

Use acquisition timeout, deadline, cancellation, permits, métricas e admission control.

---

### 44. Correlacionar com deadlocks

Timeout de lock pode indicar contenção, critical section longa, starvation, deadlock possível ou CPU stall.

Timeout não prova deadlock.

Use thread dump e detector quando houver suspeita de ciclo.

---

### 45. Criar policy de shutdown

Arquivo:

```text
timeout-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewJourneys:
    required

  inFlight:
    deadline:
      bounded:
        required

  cancellation:
    request:
      required

  connections:
    close:
      required

  executors:
    await:
      bounded:
        required

  lateWork:
    record:
      required

  zeroTaskLeak:
    required
```

---

### 46. Criar shutdown manager

```java
public final class TimeoutShutdownManager {

    public TimeoutShutdownResult shutdown(
            ExecutorService executor,
            List<? extends Future<?>> futures,
            Duration totalBudget) {

        Deadline deadline =
                Deadline.after(totalBudget);

        executor.shutdown();

        int completed = 0;
        int cancelled = 0;

        for (Future<?> future : futures) {
            Duration remaining =
                    deadline.remaining();

            if (remaining.isZero()) {
                future.cancel(true);
                cancelled++;
                continue;
            }

            try {
                future.get(
                        remaining.toNanos(),
                        TimeUnit.NANOSECONDS);
                completed++;
            } catch (TimeoutException exception) {
                future.cancel(true);
                cancelled++;
            } catch (CancellationException exception) {
                cancelled++;
            } catch (ExecutionException exception) {
                completed++;
            } catch (InterruptedException exception) {
                future.cancel(true);
                Thread.currentThread()
                        .interrupt();
                cancelled++;
                break;
            }
        }

        return new TimeoutShutdownResult(
                completed,
                cancelled,
                executor.isTerminated());
    }
}
```

O budget é global, não reiniciado por Future.

---

### 47. Criar data quality policy

Arquivo:

```text
timeout-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unknownTimeoutSemantic:
    action:
      block

  missingJourneyBudget:
    action:
      fail

  wallClockDurationOnly:
    result:
      fragile

  missingRemainingBudget:
    result:
      limited

  timeoutWithoutStageCategory:
    action:
      fail-observability

  singleRun:
    result:
      limited

  generatorSaturated:
    result:
      inconclusive
```

---

### 48. Criar security policy

Arquivo:

```text
timeout-security-policy.yaml
```

Conteúdo:

```yaml
security:
  event:
    businessIdentifier:
      forbidden

  exception:
    rawMessage:
      forbidden

  HTTP:
    URLWithSecrets:
      forbidden

  SQL:
    rawQuery:
      forbidden

  evidence:
    synthetic:
      required

  credentials:
    forbidden
```

---

### 49. Criar failure policy

Arquivo:

```text
timeout-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  infiniteTimeout:
    action:
      reject-design

  invertedHierarchy:
    action:
      fail-gate

  retryExceedsDeadline:
    action:
      fail-gate

  timeoutWithoutCleanup:
    action:
      fail-review

  orphanWorkUnobserved:
    action:
      fail-observability

  connectionLeak:
    action:
      fail-gate

  memoryLeakDiagnosis:
    deferredToLesson597
```

---

### 50. Criar cenários oficiais

Arquivo:

```text
timeout-scenarios.yaml
```

Cenários:

```text
journey-success;

deadline-expired-before-stage;

remaining-budget-smaller-than-configured;

connect-timeout;

connection-acquisition-timeout;

write-timeout;

read-timeout;

response-timeout;

JDBC-query-timeout;

JDBC-lock-timeout;

Redis-command-timeout;

Kafka-max-block-timeout;

Kafka-delivery-timeout;

Future-get-timeout;

Future-cancel-success;

Future-cancel-ignored;

queue-timeout;

lock-timeout;

retry-within-budget;

retry-exceeds-budget-blocked;

late-completion;

shutdown-global-deadline;

zero-task-leak;

zero-connection-leak.
```

Cada cenário registra:

- journey;
- stage;
- configured timeout;
- remaining budget;
- elapsed;
- outcome;
- cancellation;
- retry;
- cleanup;
- shutdown;
- evidence.

---

### 51. Criar baseline report

Arquivo:

```text
timeout-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  journey:
    ORDER-DETAIL

  totalBudget:
    configured

  hierarchy:
    valid:
      true

  stages:
    allWithinRemaining:
      true

  retries:
    bounded:
      true

  cancellation:
    observed:
      true

  leaks:
    tasks:
      zero

    connections:
      zero

  result:
    PASS
```

---

### 52. Criar matriz de testes

Arquivo:

```text
TIMEOUT_TEST_MATRIX.md
```

Cenários:

- total budget;
- reserve;
- monotonic deadline;
- expired deadline;
- remaining budget;
- hierarchy;
- connect;
- acquisition;
- read;
- write;
- response;
- JDBC query;
- transaction;
- DB lock;
- Redis command;
- Kafka request;
- Kafka delivery;
- Future get;
- cancellation;
- late completion;
- retry budget;
- backoff;
- jitter;
- queue wait;
- lock wait;
- shutdown;
- task leak;
- connection leak;
- security;
- evidence.

---

### 53. Criar troubleshooting

Arquivo:

```text
TIMEOUT_TROUBLESHOOTING.md
```

Inclua:

- connect timeout confundido com response timeout;
- pool acquisition alto;
- query termina depois da request;
- rollback sem budget;
- Redis fallback sobrecarrega banco;
- Kafka retry ultrapassa delivery budget;
- `Future.get` expira e task continua;
- interruption é ignorada;
- timeout externo menor que interno;
- cada serviço reinicia o relógio;
- p99 usado sem margem;
- false timeout cresce;
- retry storm;
- shutdown multiplica timeout por Future;
- erro genérico esconde etapa;
- conteúdo de memory leak antecipado.

---

### 54. Criar gate

O gate valida:

- contrato;
- catálogo;
- deadlines;
- remaining budget;
- hierarchy;
- HTTP;
- JDBC;
- Redis;
- Kafka;
- executor;
- retry budget;
- cancelamento;
- observabilidade;
- shutdown;
- zero task leaks;
- zero connection leaks;
- segurança.

Status:

```text
PASS;

FAIL_BUDGET;

FAIL_HIERARCHY;

FAIL_HTTP_TIMEOUT;

FAIL_JDBC_TIMEOUT;

FAIL_REDIS_TIMEOUT;

FAIL_KAFKA_TIMEOUT;

FAIL_RETRY_BUDGET;

FAIL_CANCELLATION;

FAIL_SHUTDOWN;

FAIL_TASK_LEAK;

FAIL_CONNECTION_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 55. Coletar evidence

Script:

```text
collect-timeout-evidence.ps1
```

Arquivo:

```text
timeout-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- journey category;
- stage category;
- budget status;
- hierarchy status;
- HTTP status;
- JDBC status;
- Redis status;
- Kafka status;
- executor status;
- retry status;
- cancellation status;
- late completion status;
- shutdown status;
- task leak status;
- connection leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- request ID;
- order ID;
- customer ID;
- URL com segredo;
- SQL bruto;
- payload;
- exception message bruta;
- heap dump;
- memory dump;
- material da aula 597.

---

### 56. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\timeouts\validate-timeout-contract.ps1

.\scripts\performance\timeouts\validate-timeout-journey-catalog.ps1

.\scripts\performance\timeouts\run-timeout-baseline.ps1

.\scripts\performance\timeouts\validate-timeout-budgets.ps1

.\scripts\performance\timeouts\validate-timeout-hierarchy.ps1

.\scripts\performance\timeouts\simulate-connect-timeout.ps1

.\scripts\performance\timeouts\simulate-acquisition-timeout.ps1

.\scripts\performance\timeouts\simulate-read-timeout.ps1

.\scripts\performance\timeouts\simulate-response-timeout.ps1

.\scripts\performance\timeouts\validate-http-timeouts.ps1

.\scripts\performance\timeouts\validate-jdbc-timeouts.ps1

.\scripts\performance\timeouts\validate-redis-timeouts.ps1

.\scripts\performance\timeouts\validate-kafka-timeouts.ps1

.\scripts\performance\timeouts\validate-executor-timeouts.ps1

.\scripts\performance\timeouts\validate-retry-budget.ps1

.\scripts\performance\timeouts\validate-timeout-cancellation.ps1

.\scripts\performance\timeouts\validate-timeout-observability.ps1

.\scripts\performance\timeouts\validate-timeout-shutdown.ps1

.\scripts\performance\timeouts\scan-timeout-output.ps1

.\scripts\performance\timeouts\collect-timeout-evidence.ps1

.\scripts\performance\timeouts\verify-timeout-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- deadlines monotônicos;
- remaining budgets positivos;
- hierarchy aprovada;
- HTTP timeouts categorizados;
- JDBC timeouts alinhados;
- Redis timeouts aprovados;
- Kafka budgets aprovados;
- Future timeout e cancelamento validados;
- retries dentro do budget;
- late completions observadas;
- shutdown usa deadline global;
- zero task leaks;
- zero connection leaks;
- segurança aprovada;
- evidence sanitizada;
- memory leak não antecipado.

---

### 57. Encerrar o laboratório

Confirme novas jornadas bloqueadas, Futures tratadas, executors e clientes fechados, conexões devolvidas, retries encerrados e baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/timeouts `
  -Recurse `
  -Force
```

Preserve relatórios.

---

## Entendendo o que foi feito

### Timeout ganhou significado

Cada limite passou a representar uma etapa específica.

### Deadline ganhou monotonicidade

A duração deixou de depender apenas do relógio de parede.

### Budget ganhou reserva

A jornada passou a guardar tempo para overhead, cleanup e resposta.

### Hierarquia ganhou coerência

Timeouts internos passaram a caber no restante da jornada.

### HTTP ganhou categorias

Connect, acquisition, write, read e response deixaram de ser um erro único.

### JDBC ganhou camadas

Pool, statement, transaction, socket e lock timeout receberam papéis diferentes.

### Retry ganhou budget

Nova tentativa deixou de reiniciar o relógio.

### Cancelamento ganhou contrato

Timeout deixou de ser confundido com término garantido da operação.

### Observabilidade ganhou estágio

Métricas passaram a identificar onde o budget foi consumido.

### Shutdown ganhou deadline global

A espera total deixou de multiplicar pelo número de Futures.

### A próxima aula ganhou fronteira

A aula 597 irá aprofundar diagnóstico de memory leak.

---

## Erros comuns importantes

### Configurar timeout infinito

Uma dependência pode ocupar recursos indefinidamente.

### Usar o mesmo timeout em todas as camadas

Semânticas diferentes ficam escondidas.

### Reiniciar o relógio em cada serviço

A jornada ultrapassa o limite externo.

### Configurar interno maior que externo

Trabalho continua depois da desistência do chamador.

### Confundir timeout com cancelamento

A operação pode continuar.

### Fazer retry sem remaining budget

As tentativas ultrapassam o deadline.

### Não reservar tempo para rollback

A conexão permanece ocupada durante cleanup.

### Medir apenas duração downstream

Queue e acquisition wait podem consumir o budget antes da chamada.

### Registrar timeout genérico

O diagnóstico perde connect, read, query, queue ou lock.

### Usar p99 como timeout automático

Variabilidade e falso timeout precisam ser considerados.

---

## Comandos úteis

### Validar budgets

```powershell
.\scripts\performance\timeouts\validate-timeout-budgets.ps1
```

### Simular acquisition timeout

```powershell
.\scripts\performance\timeouts\simulate-acquisition-timeout.ps1
```

### Validar JDBC

```powershell
.\scripts\performance\timeouts\validate-jdbc-timeouts.ps1
```

### Validar retry budget

```powershell
.\scripts\performance\timeouts\validate-retry-budget.ps1
```

### Validar cancelamento

```powershell
.\scripts\performance\timeouts\validate-timeout-cancellation.ps1
```

---

## Exercício guiado

### Parte 1 — Jornada

Defina budget total, reserve e owner.

### Parte 2 — Deadline

Implemente relógio monotônico e remaining budget.

### Parte 3 — Hierarquia

Garanta que etapas internas caibam na jornada.

### Parte 4 — HTTP

Separe connect, acquisition, read, write e response.

### Parte 5 — JDBC

Separe pool, query, transaction, socket e lock wait.

### Parte 6 — Redis e Kafka

Alinhe command, request, delivery e retries.

### Parte 7 — Executor

Valide `Future.get`, cancelamento e interruption.

### Parte 8 — Retry

Use tentativas bounded e budget restante.

### Parte 9 — Shutdown

Aplique deadline global.

### Parte 10 — Gate

Valide leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 595 e ponte para a aula 597 foram preservadas;
- timeout, deadline, budget, remaining budget, connect, acquisition, read, write, response, queue, lock, transaction, retry budget, false timeout, tail latency e orphan work foram definidos;
- contrato, catálogo e policies foram criados;
- deadlines usam medição monotônica;
- budgets possuem reserva;
- cada estágio usa o menor valor entre configuração e restante;
- trabalho novo não começa com budget esgotado;
- propagação valida e limita deadlines externos;
- hierarchy impede timeout interno maior que a jornada;
- HTTP distingue connect, acquisition, write, read e response;
- JDBC distingue pool, query, transaction, socket e lock wait;
- rollback e devolução de conexão possuem reserva;
- Redis command e pipeline cabem na jornada;
- Kafka request, max block, delivery e transaction timeouts foram alinhados;
- `Future.get` usa timeout e cancelamento é avaliado;
- retries usam deadline, backoff, jitter e máximo de tentativas;
- operações não idempotentes não recebem retry inseguro;
- timeouts por percentil consideram SLO, variabilidade e falso timeout;
- late completion é observada;
- métricas registram etapa, configured timeout, remaining budget, elapsed, cancellation e retry;
- shutdown usa deadline global;
- qualidade, segurança, failure policy, matriz, troubleshooting, gate e evidence estão presentes;
- zero task leaks e zero connection leaks foram validados;
- nenhum identificador, payload, SQL bruto ou segredo foi commitado;
- memory leak não foi aprofundado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/timeouts `
  scripts/performance/timeouts `
  docs/performance/timeouts `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|requestId|rawSql|businessPayload|heapDump|dominatorTree|retainedHeap|GC.root"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar timeouts em producao"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- identificadores reais;
- SQL bruto;
- payloads;
- artifacts temporários;
- heap dump;
- relatório de memória;
- material da aula 597.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você estruturou timeouts como budgets distribuídos ao longo de uma jornada.

Você trabalhou com:

```text
deadline;

time budget;

remaining budget;

connect timeout;

acquisition timeout;

read timeout;

write timeout;

response timeout;

JDBC timeout;

Redis timeout;

Kafka timeout;

Future timeout;

retry budget;

cancelamento;

late completion;

shutdown.
```

Você comprovou que timeout precisa ter categoria e owner; que deadline monotônico evita reiniciar a duração; que etapas internas usam apenas o budget restante; que connect e pool acquisition são problemas diferentes; que JDBC exige alinhamento entre pool, statement, transaction e banco; que Kafka precisa manter retries dentro do delivery budget; que `Future.get(timeout)` não encerra automaticamente a task; que retry precisa caber na jornada; e que shutdown usa um deadline global.

A próxima aula será:

```text
597 - M18.42 - Memory leak diagnostico
```

Nela, você irá diagnosticar crescimento de heap, distinguir pressão normal de retenção anormal, coletar heap dumps com segurança, analisar dominator tree, retained heap, GC roots, ThreadLocal, caches, listeners, classloaders, buffers e criar regressões de memória.

Nenhum heap dump, dominator tree, retained heap, GC root analysis, leak suspect report, Eclipse MAT, native memory tracking ou laboratório completo de memory leak foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini budget total e reserva.
- [ ] Implementei deadline monotônico.
- [ ] Calculei remaining budget.
- [ ] Validei hierarchy.
- [ ] Separei timeouts HTTP.
- [ ] Separei timeouts JDBC, Redis e Kafka.
- [ ] Limitei retries.
- [ ] Encerrei sem task ou connection leak.

---

## Troubleshooting adicional

### Connect timeout cresce

Revise DNS, rota, firewall, handshake e disponibilidade do destino.

### Acquisition timeout cresce

O pool local pode estar saturado ou com conexões retidas.

### Query timeout ocorre depois da request

A hierarchy está invertida ou cancellation não foi propagada.

### Redis fallback aumenta carga no banco

A degradação precisa de admission control e proteção contra stampede.

### Kafka delivery demora além da jornada

Alinhe request, retries e delivery budget.

### Future expira, mas a task continua

Solicite cancelamento e valide interruption.

### Retry ultrapassa o deadline

Recalcule remaining budget antes de cada tentativa.

### Timeout rate cresce sem latência alta

Revise semântica da métrica, relógio e configuração.

### Shutdown demora por Future

Use um deadline global, não um timeout completo por item.

### O conteúdo começou a analisar heap dump

Preserve o diagnóstico para a aula 597.

---

## Perguntas de revisão

1. O que é timeout?
2. O que é deadline?
3. O que é time budget?
4. O que é remaining budget?
5. Qual diferença entre connect e acquisition timeout?
6. O que é response timeout?
7. O que é queue timeout?
8. Por que usar relógio monotônico?
9. O que é timeout hierarchy?
10. Por que reservar margem?
11. Timeout cancela automaticamente?
12. O que é orphan work?
13. O que é retry budget?
14. O que é false timeout?
15. Como usar percentis?
16. Quais camadas de timeout existem no JDBC?
17. Quais timeouts conceituais existem no Kafka producer?
18. Como o shutdown usa deadline?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Limite máximo de espera.
2. Instante absoluto de expiração.
3. Tempo total disponível.
4. Tempo até o deadline.
5. Criar conexão versus obter conexão do pool.
6. Limite para receber resposta.
7. Limite aguardando antes de executar.
8. Evitar alterações do relógio de parede.
9. Relação coerente entre limites internos e externos.
10. Cleanup, overhead e resposta.
11. Não.
12. Trabalho que continua sem chamador útil.
13. Parte do tempo reservada a tentativas.
14. Expiração agressiva de operação quase concluída.
15. Com SLO, margem e variabilidade.
16. Pool, query, transaction, socket e lock.
17. Max block, request, delivery e transaction.
18. Um budget total compartilhado.
19. Memory leak diagnóstico.
20. Memory leak diagnóstico.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 596 - M18.41 - Timeouts em producao

- Continuei após Backpressure conceitual.
- Defini timeout, deadline, budget e remaining budget.
- Usei `System.nanoTime` para duração monotônica.
- Criei reserva para overhead, cleanup e resposta.
- Validei timeout hierarchy.
- Propaguei deadline e limitei valores externos.
- Diferenciei connect e connection acquisition timeout.
- Modelei read, write e response timeout.
- Separei HikariCP, query, transaction, socket e DB lock timeout.
- Modelei Redis command e pipeline timeout.
- Alinhei Kafka max block, request, delivery e transaction timeout.
- Validei `Future.get` com timeout e cancelamento.
- Entendi que timeout não garante interrupção da operação.
- Criei retry budget com máximo de tentativas, backoff e jitter.
- Evitei timeout amplification.
- Relacionei percentis, tail latency e false timeout.
- Registrei stage, configured timeout, remaining budget e elapsed.
- Observei late completions.
- Implementei shutdown com deadline global.
- Validei zero task leaks e zero connection leaks.
- Coletei evidence sanitizada.
- Não antecipei memory leak.
- Próxima aula: Memory leak diagnóstico.
```

---

## Referência técnica curta

- Timeouts and deadlines.
- Monotonic clocks.
- HTTP client timeouts.
- HikariCP acquisition timeout.
- JDBC query and transaction timeouts.
- Redis command timeouts.
- Kafka producer delivery timeouts.
- `Future.get` timeout.
- Retry budgets.
- Tail latency.

Regra final:

```text
timeouts em produção precisam nascer de um deadline de jornada e não de números isolados: todo fluxo possui owner, budget total, reserva, estágios, remaining budget, cancelamento, retry policy, observabilidade e shutdown, enquanto cada operação usa o menor valor entre seu limite configurado e o tempo restante; connect, connection acquisition, write, read, response, queue, lock, query, transaction, Redis command, Kafka request, delivery e Future timeout são categorias distintas, e a hierarchy impede que trabalho interno continue além da utilidade externa; timeout não garante cancelamento, portanto late completion, orphan work, interruption, idempotência, rollback e liberação de recursos são explícitos, retries recalculam o budget, usam backoff, jitter e máximo de tentativas, e nunca reiniciam o relógio; métricas registram etapa, duração, remaining budget, cancellation e retry, o shutdown usa deadline global e o laboratório termina com zero task leaks e zero connection leaks; heap dumps, retained heap, dominator tree e diagnóstico de memory leak ficam para a aula 597.
```
