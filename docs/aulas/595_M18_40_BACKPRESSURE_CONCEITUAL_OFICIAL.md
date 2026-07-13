# 595 - M18.40 - Backpressure conceitual

## Apresentação da aula

Na aula 594, você estudou deadlocks em Java.

Você trabalhou com:

```text
condições de Coffman;

ciclos de espera;

deadlocks de monitor;

deadlocks com ReentrantLock;

ThreadMXBean;

thread dumps;

JFR;

wait-for graph;

lock ordering;

tryLock;

lockInterruptibly;

recovery;

runbooks.
```

A conclusão principal foi:

```text
aumentar threads,
pools
ou timeouts

não remove
um ciclo de espera.
```

Nesta aula, o problema deixa de ser uma espera circular.

Agora o sistema ainda progride, porém um componente produz trabalho mais rápido do que outro consegue consumir.

A pergunta central será:

```text
como impedir
que um produtor rápido

sobrecarregue
um consumidor lento

sem esconder a pressão
em memória,
filas,
threads,
retries
ou latência?
```

Esse problema aparece quando HTTP, Kafka, executors, banco, APIs, importações, virtual threads ou retries produzem trabalho acima da capacidade de consumo.

Quando a entrada supera a saída, o trabalho pendente precisa ir para algum lugar.

As opções são esperar, enfileirar, rejeitar, descartar, agrupar, reduzir a taxa, degradar ou propagar pressão ao produtor.

Backpressure é o conjunto de mecanismos pelos quais o consumidor, ou um componente intermediário, comunica e impõe a capacidade que consegue absorver.

A ideia central é:

```text
o produtor
não deve emitir trabalho

sem considerar
a capacidade
do consumidor.
```

Backpressure não é apenas fila: a fila absorve picos temporários; se o desequilíbrio persistir, uma fila bounded enche e uma fila ilimitada converte pressão em memória e latência.

Por isso, toda fila precisa de capacidade, overflow, métricas, idade, rates, owner, shutdown e recovery.

Rate limiting limita uma origem por período; backpressure adapta o fluxo à capacidade do consumidor; load shedding rejeita trabalho para proteger o sistema. Os três podem coexistir.

Você estudará producer, consumer, rates, demanda, backlog, buffers bounded, overflow, water marks, push, pull, créditos, batching, drop, latest, reject, block, load shedding, admission control, Little’s Law, fairness, observabilidade e shutdown.

Você também irá conhecer o contrato conceitual de Reactive Streams:

```text
Publisher;

Subscriber;

Subscription;

Processor;

request(n);

cancel.
```

O laboratório usará Java clássico para simular fila bounded, demanda, overflow, métricas, sobrecarga, recovery e shutdown.

A próxima aula será `596 - M18.41 - Timeouts em producao`. Aqui, timeouts aparecem apenas como limites do laboratório; budgets, deadlines e configurações por dependência ficam para a aula 596.

A regra central será:

```text
quando a entrada
supera a saída,

o sistema precisa
diminuir,
bloquear,
rejeitar
ou descartar trabalho;

esconder a pressão
em uma fila infinita
não é backpressure.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
593:
Race condition.

594:
Deadlocks em Java.

595:
Backpressure conceitual.

596:
Timeouts em producao.
```

A progressão é:

```text
corrigir resultados concorrentes;

diagnosticar ausência de progresso;

controlar diferença entre entrada e saída;

limitar duração das esperas.
```

Nesta aula:

```text
producer e consumer:
sim.

push e pull:
sim.

fila bounded:
sim.

buffer:
sim.

overflow:
sim.

demanda:
sim.

créditos:
sim.

request(n):
conceitual.

Reactive Streams:
contrato conceitual.

batching:
sim.

drop e latest:
sim.

rejection:
sim.

load shedding:
sim.

admission control:
sim.

Little's Law:
sim.

timeouts de produção:
não aprofundar.

Spring WebFlux:
não.

Reactor:
não.

RxJava:
não.
```

Você reutilizará:

- `BlockingQueue`;
- executors;
- virtual threads;
- semáforos;
- filas bounded;
- rejection policies;
- métricas;
- load testing;
- stress testing;
- Kafka;
- HikariCP;
- Redis;
- logs;
- tracing;
- runbooks;
- shutdown.

O desenho precisa preservar limites, correção, ordem, idempotência, ausência de perda silenciosa, métricas, cancelamento, shutdown e segurança.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
performance/backpressure
├── backpressure-contract.yaml
├── backpressure-flow-catalog.yaml
├── backpressure-demand-policy.yaml
├── backpressure-buffer-policy.yaml
├── backpressure-overflow-policy.yaml
├── backpressure-admission-policy.yaml
├── backpressure-batching-policy.yaml
├── backpressure-fairness-policy.yaml
├── backpressure-recovery-policy.yaml
├── backpressure-observability-policy.yaml
├── backpressure-shutdown-policy.yaml
├── backpressure-data-quality-policy.yaml
├── backpressure-security-policy.yaml
├── backpressure-failure-policy.yaml
├── backpressure-scenarios.yaml
└── backpressure-evidence.yaml

performance/backpressure/src/main/java
└── br/com/formacao/performance/backpressure
    ├── WorkItem.java
    ├── BackpressureOutcome.java
    ├── OverflowStrategy.java
    ├── DemandCounter.java
    ├── BackpressureMetrics.java
    ├── BackpressureSnapshot.java
    ├── BoundedWorkBuffer.java
    ├── BlockingProducer.java
    ├── PullConsumer.java
    ├── CreditBasedChannel.java
    ├── BatchConsumer.java
    ├── AdmissionController.java
    ├── LatestValueBuffer.java
    ├── BackpressureShutdownResult.java
    ├── BackpressureShutdownManager.java
    ├── BackpressureScenarioRunner.java
    └── BackpressureDemo.java

performance/backpressure/src/test/java
└── br/com/formacao/performance/backpressure
    ├── BoundedWorkBufferTest.java
    ├── BlockingProducerTest.java
    ├── PullConsumerTest.java
    ├── CreditBasedChannelTest.java
    ├── OverflowRejectTest.java
    ├── OverflowDropLatestTest.java
    ├── OverflowDropOldestTest.java
    ├── LatestValueBufferTest.java
    ├── BatchConsumerTest.java
    ├── AdmissionControllerTest.java
    ├── BackpressureRecoveryTest.java
    ├── BackpressureShutdownTest.java
    └── BackpressureContractTest.java

performance/backpressure/reports
├── backpressure-baseline-report.yaml
├── backpressure-buffer-report.yaml
├── backpressure-demand-report.yaml
├── backpressure-overflow-report.yaml
├── backpressure-batching-report.yaml
├── backpressure-recovery-report.yaml
└── backpressure-gate-report.yaml

scripts/performance/backpressure
├── validate-backpressure-contract.ps1
├── validate-backpressure-flow-catalog.ps1
├── run-backpressure-baseline.ps1
├── simulate-fast-producer-slow-consumer.ps1
├── validate-bounded-buffer.ps1
├── validate-demand-credits.ps1
├── validate-overflow-reject.ps1
├── validate-overflow-drop-latest.ps1
├── validate-overflow-drop-oldest.ps1
├── validate-latest-value-policy.ps1
├── validate-batching-policy.ps1
├── validate-admission-control.ps1
├── validate-backpressure-recovery.ps1
├── validate-backpressure-observability.ps1
├── validate-backpressure-shutdown.ps1
├── scan-backpressure-output.ps1
├── collect-backpressure-evidence.ps1
└── verify-backpressure-baseline.ps1

docs/performance/backpressure
├── BACKPRESSURE_OVERVIEW.md
├── PRODUCER_CONSUMER_RATES.md
├── PUSH_PULL_AND_DEMAND.md
├── BOUNDED_BUFFERS.md
├── OVERFLOW_STRATEGIES.md
├── BATCHING_AND_COALESCING.md
├── ADMISSION_CONTROL_AND_SHEDDING.md
├── REACTIVE_STREAMS_CONCEPTS.md
├── BACKPRESSURE_OBSERVABILITY.md
├── BACKPRESSURE_TEST_MATRIX.md
└── BACKPRESSURE_TROUBLESHOOTING.md
```

Ao final, você terá contrato, catálogo, fila bounded, demanda, créditos, overflow, batching, admission control, métricas, recovery, shutdown, gate e evidence sanitizada.

---

## Conceito essencial

### Producer

Componente que cria ou envia unidades de trabalho.

---

### Consumer

Componente que recebe e processa unidades de trabalho.

---

### Production rate

Quantidade de itens produzidos por unidade de tempo.

---

### Consumption rate

Quantidade de itens consumidos por unidade de tempo.

---

### Backlog

Trabalho aceito que ainda não foi concluído.

---

### Buffer

Espaço temporário entre produtor e consumidor.

---

### Bounded buffer

Buffer com capacidade máxima explícita.

---

### Overflow

Situação em que novo trabalho chega e o buffer está cheio.

---

### Demand

Quantidade de itens que o consumidor declara estar preparado para receber.

---

### Credit

Permissão para o produtor emitir uma unidade ou lote de trabalho.

---

### Push model

O produtor envia itens conforme sua própria disponibilidade.

---

### Pull model

O consumidor solicita ou busca trabalho conforme sua capacidade.

---

### High-water mark

Nível de fila que indica pressão elevada.

---

### Low-water mark

Nível inferior que indica recuperação e permite retomar admissão normal.

---

### Admission control

Decisão de aceitar ou rejeitar trabalho antes de consumir recursos caros.

---

### Load shedding

Rejeição ou descarte intencional de trabalho para proteger o sistema.

---

### Batching

Processamento de múltiplos itens em uma operação.

---

### Coalescing

Combinação de atualizações redundantes em uma única atualização relevante.

---

### Reactive Streams

Contrato para processamento assíncrono com demanda não bloqueante entre componentes.

---

### `request(n)`

Sinal de demanda por até `n` itens adicionais.

---

### `cancel`

Sinal de encerramento da assinatura e interrupção de novas entregas.

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

- aula 594 validada;
- nenhum processo filho residual;
- nenhum deadlock ativo;
- executors encerrados;
- Java 21 ativo;
- métricas de filas disponíveis;
- todos os cenários usarão dados sintéticos.

---

### 2. Criar contrato

Arquivo:

```text
backpressure-contract.yaml
```

Conteúdo:

```yaml
backpressure:
  required:
    - flow
    - producer
    - consumer
    - production-rate
    - consumption-rate
    - buffer
    - capacity
    - overflow-strategy
    - demand-policy
    - admission-policy
    - observability
    - recovery
    - shutdown

  buffer:
    bounded:
      required

  overflow:
    silentLoss:
      forbidden

  tests:
    zeroTaskLeak:
      required

  forbiddenInLesson595:
    - production-timeout-tuning
    - Spring-WebFlux-implementation
    - Reactor-pipeline

  nextLesson:
    code:
      M18.41
```

---

### 3. Criar catálogo de fluxos

Arquivo:

```text
backpressure-flow-catalog.yaml
```

Exemplo:

```yaml
flows:
  - id:
      ORDER-ENRICHMENT

    producer:
      HTTP-ingress

    consumer:
      order-enrichment-worker

    productionRate:
      measured

    consumptionRate:
      measured

    buffer:
      type:
        ArrayBlockingQueue

      capacity:
        100

    overflow:
      reject

    demand:
      worker-capacity

    productionValues:
      undefined
```

Cada fluxo tem owner.

---

### 4. Criar item sintético

```java
public record WorkItem(
        long sequence,
        Instant createdAt,
        String category) {

    public WorkItem {
        Objects.requireNonNull(createdAt);
        Objects.requireNonNull(category);
    }
}
```

Não use dados reais de pedido.

---

### 5. Criar outcomes

```java
public enum BackpressureOutcome {
    ACCEPTED,
    REJECTED,
    DROPPED_LATEST,
    DROPPED_OLDEST,
    COALESCED,
    CONSUMED,
    CANCELLED,
    TIMED_OUT,
    FAILED
}
```

Toda perda deve ser explícita.

---

### 6. Criar estratégias

```java
public enum OverflowStrategy {
    BLOCK,
    REJECT,
    DROP_LATEST,
    DROP_OLDEST,
    KEEP_LATEST,
    CALLER_RUNS
}
```

A estratégia depende do contrato do dado.

---

### 7. Criar policy de demanda

Arquivo:

```text
backpressure-demand-policy.yaml
```

Conteúdo:

```yaml
demand:
  explicitWhenPossible:
    true

  consumer:
    requestOnlyWhatCanBeHandled:
      required

  credits:
    neverNegative:
      required

  cancelledFlow:
    newDemand:
      forbidden

  overProduction:
    action:
      reject-or-buffer-within-bound

  metrics:
    required:
      - requested
      - delivered
      - outstanding
```

---

### 8. Criar `DemandCounter`

```java
public final class DemandCounter {

    private final AtomicLong requested =
            new AtomicLong();

    private final AtomicBoolean cancelled =
            new AtomicBoolean();

    public boolean request(long amount) {
        if (amount <= 0
                || cancelled.get()) {
            return false;
        }

        requested.getAndAccumulate(
                amount,
                DemandCounter::saturatedAdd);

        return true;
    }

    public boolean tryConsumeCredit() {
        while (true) {
            long current =
                    requested.get();

            if (current <= 0
                    || cancelled.get()) {
                return false;
            }

            if (requested.compareAndSet(
                    current,
                    current - 1)) {
                return true;
            }
        }
    }

    public void cancel() {
        cancelled.set(true);
    }

    private static long saturatedAdd(
            long left,
            long right) {

        long result =
                left + right;

        if (result < 0) {
            return Long.MAX_VALUE;
        }

        return result;
    }
}
```

Saturating add evita overflow numérico.

---

### 9. Entender demanda acumulada

Se o consumidor chama:

```text
request 5;

depois request 3,
```

a demanda pendente pode chegar a:

```text
8 itens.
```

Cada entrega reduz o crédito.

Cancelamento bloqueia novas entregas.

---

### 10. Criar buffer bounded

```java
public final class BoundedWorkBuffer {

    private final ArrayBlockingQueue<
            WorkItem> queue;

    public BoundedWorkBuffer(
            int capacity,
            boolean fair) {

        this.queue =
                new ArrayBlockingQueue<>(
                        capacity,
                        fair);
    }

    public boolean offer(
            WorkItem item) {
        return queue.offer(item);
    }

    public WorkItem take()
            throws InterruptedException {
        return queue.take();
    }

    public WorkItem poll() {
        return queue.poll();
    }

    public int size() {
        return queue.size();
    }

    public int remainingCapacity() {
        return queue.remainingCapacity();
    }
}
```

A capacidade deriva de latência e memória.

---

### 11. Criar policy de buffer

Arquivo:

```text
backpressure-buffer-policy.yaml
```

Conteúdo:

```yaml
buffer:
  bounded:
    required

  capacity:
    deriveFrom:
      - arrival-rate
      - service-rate
      - latency-budget
      - item-size
      - memory-budget
      - recovery-time

  metrics:
    required:
      - size
      - remaining-capacity
      - oldest-item-age
      - enqueue-rate
      - dequeue-rate
      - utilization

  unlimited:
    forbidden
```

---

### 12. Relacionar Little’s Law

Conceitualmente, `L = λ × W`: quantidade média no sistema é taxa de chegada multiplicada pelo tempo médio. A 100 itens/s e dois segundos, há cerca de 200 itens no sistema. Use apenas com estabilidade e medições coerentes.

---

### 13. Simular produtor rápido

```java
public final class BlockingProducer
        implements Runnable {

    private final BoundedWorkBuffer buffer;
    private final int totalItems;
    private final BackpressureMetrics metrics;

    public BlockingProducer(
            BoundedWorkBuffer buffer,
            int totalItems,
            BackpressureMetrics metrics) {
        this.buffer = buffer;
        this.totalItems = totalItems;
        this.metrics = metrics;
    }

    @Override
    public void run() {
        for (int index = 0;
                index < totalItems;
                index++) {

            WorkItem item =
                    new WorkItem(
                            index,
                            Instant.now(),
                            "synthetic");

            if (buffer.offer(item)) {
                metrics.accepted();
            } else {
                metrics.rejected();
            }
        }
    }
}
```

O produtor rejeita imediatamente.

---

### 14. Criar consumidor lento

```java
public final class PullConsumer
        implements Runnable {

    private final BoundedWorkBuffer buffer;
    private final Duration processingTime;
    private final AtomicBoolean running;
    private final BackpressureMetrics metrics;

    @Override
    public void run() {
        while (running.get()
                || buffer.size() > 0) {

            WorkItem item =
                    buffer.poll();

            if (item == null) {
                Thread.onSpinWait();
                continue;
            }

            try {
                Thread.sleep(
                        processingTime.toMillis());

                metrics.consumed(
                        Duration.between(
                                item.createdAt(),
                                Instant.now()));

            } catch (
                    InterruptedException exception) {
                Thread.currentThread()
                        .interrupt();
                break;
            }
        }
    }
}
```

Em produção, use espera bloqueante adequada.

---

### 15. Simular sem backpressure suficiente

Script:

```text
simulate-fast-producer-slow-consumer.ps1
```

Perfil didático:

```text
producer:
1.000 itens/s.

consumer:
100 itens/s.

buffer:
200 itens.

duration:
bounded.
```

Observe:

- fila cresce;
- utilização chega a 100%;
- idade do item aumenta;
- rejeições começam;
- latência sobe;
- memória permanece bounded;
- throughput do consumidor não muda.

---

### 16. Entender estabilidade

No longo prazo, a taxa média aceita precisa ser menor ou igual à taxa consumida. Buffers absorvem picos, não desequilíbrios permanentes.

---

### 17. Implementar bloqueio do produtor

Com `queue.put(item)`, o produtor aguarda capacidade. Isso propaga pressão, mas pode bloquear requests, consumir workers, ampliar latência ou dificultar shutdown. Use apenas quando esse bloqueio fizer parte do contrato.

---

### 18. Criar policy de overflow

Arquivo:

```text
backpressure-overflow-policy.yaml
```

Conteúdo:

```yaml
overflow:
  required:
    true

  strategies:
    BLOCK:
      requires:
        - bounded-wait
        - cancellation
        - producer-can-block

    REJECT:
      requires:
        - explicit-error
        - retry-guidance-when-safe

    DROP_LATEST:
      requires:
        - newest-item-disposable

    DROP_OLDEST:
      requires:
        - old-item-less-valuable

    KEEP_LATEST:
      requires:
        - state-update-semantics

    CALLER_RUNS:
      requires:
        - safe-caller-execution
        - latency-review

  silentDrop:
    forbidden
```

---

### 19. Validar rejeição

Quando `buffer.offer(item)` retorna `false`, registre rejeição, retorne status explícito, preserve idempotência e evite retry imediato.

---

### 20. Validar drop latest

`DROP_LATEST` descarta o item novo.

É aceitável apenas para dados descartáveis, como telemetria redundante, e não para pagamentos, status obrigatórios, auditoria ou comandos únicos.

---

### 21. Validar drop oldest

`DROP_OLDEST` remove o item mais antigo e aceita o novo.

Pode servir quando dados antigos perdem valor, como posição ou estado visual; itens removidos precisam de métrica.

---

### 22. Criar `LatestValueBuffer`

```java
public final class LatestValueBuffer {

    private final AtomicReference<
            WorkItem> latest =
            new AtomicReference<>();

    public BackpressureOutcome publish(
            WorkItem item) {

        WorkItem previous =
                latest.getAndSet(item);

        return previous == null
                ? BackpressureOutcome.ACCEPTED
                : BackpressureOutcome.COALESCED;
    }

    public WorkItem consumeLatest() {
        return latest.getAndSet(null);
    }
}
```

Esse buffer preserva apenas o valor mais recente e não serve a eventos obrigatórios individuais.

---

### 23. Criar policy de batching

Arquivo:

```text
backpressure-batching-policy.yaml
```

Conteúdo:

```yaml
batching:
  useWhen:
    - downstream-supports-batch
    - per-call-overhead-is-significant
    - ordering-contract-is-known

  limits:
    required:
      - maximum-items
      - maximum-bytes
      - maximum-wait

  partialFailure:
    contract:
      required

  giantBatch:
    forbidden

  metrics:
    required:
      - batch-size
      - batch-wait
      - batch-success
      - batch-partial-failure
```

---

### 24. Criar consumidor em lote

```java
public final class BatchConsumer {

    public List<WorkItem> drain(
            BlockingQueue<WorkItem> queue,
            int maximumItems) {

        List<WorkItem> batch =
                new ArrayList<>(
                        maximumItems);

        WorkItem first =
                queue.poll();

        if (first == null) {
            return List.of();
        }

        batch.add(first);

        queue.drainTo(
                batch,
                maximumItems - 1);

        return List.copyOf(batch);
    }
}
```

O lote reduz chamadas downstream, mas pode aumentar espera.

---

### 25. Diferenciar batching e backpressure

Batching melhora eficiência; backpressure controla capacidade. Entrada acima da saída mantém o backlog crescendo.

---

### 26. Criar canal por créditos

```java
public final class CreditBasedChannel {

    private final DemandCounter demand;
    private final BoundedWorkBuffer buffer;
    private final BackpressureMetrics metrics;

    public BackpressureOutcome publish(
            WorkItem item) {

        if (!demand.tryConsumeCredit()) {
            metrics.noDemand();

            return BackpressureOutcome.REJECTED;
        }

        if (!buffer.offer(item)) {
            demand.request(1);
            metrics.rejected();

            return BackpressureOutcome.REJECTED;
        }

        metrics.accepted();

        return BackpressureOutcome.ACCEPTED;
    }

    public void request(long amount) {
        demand.request(amount);
    }

    public void cancel() {
        demand.cancel();
    }
}
```

Se a entrega falhar, devolva o crédito.

---

### 27. Validar créditos

Cenário:

```text
request:
5.

producer tenta:
10 itens.
```

Esperado:

```text
5 aceitos;

5 rejeitados
por ausência de demanda.
```

Depois:

```text
request:
3.
```

Mais três podem ser aceitos.

---

### 28. Entender Reactive Streams conceitualmente

Contrato:

```java
interface Publisher<T> {
    void subscribe(
            Subscriber<? super T> subscriber);
}
```

```java
interface Subscriber<T> {
    void onSubscribe(
            Subscription subscription);

    void onNext(T item);

    void onError(Throwable throwable);

    void onComplete();
}
```

```java
interface Subscription {
    void request(long n);

    void cancel();
}
```

O subscriber controla a demanda; o publisher respeita o solicitado.

---

### 29. Regras conceituais de demanda

`request(n)` exige valor positivo, demanda acumula sem overflow, `onNext` respeita créditos, eventos terminais encerram o fluxo e `cancel` impede novas entregas.

---

### 30. Criar policy de admissão

Arquivo:

```text
backpressure-admission-policy.yaml
```

Conteúdo:

```yaml
admission:
  evaluateBeforeExpensiveWork:
    required

  signals:
    - queue-utilization
    - active-workers
    - downstream-capacity
    - oldest-item-age
    - rejection-rate
    - error-rate

  states:
    - NORMAL
    - DEGRADED
    - SHEDDING
    - RECOVERING

  hysteresis:
    required

  expensiveAllocationBeforeAdmission:
    forbidden
```

---

### 31. Criar `AdmissionController`

```java
public final class AdmissionController {

    private final double highWaterMark;
    private final double lowWaterMark;
    private final AtomicReference<State> state =
            new AtomicReference<>(
                    State.NORMAL);

    public boolean admit(
            double utilization) {

        State current =
                state.get();

        if (current == State.NORMAL
                && utilization >= highWaterMark) {
            state.set(
                    State.SHEDDING);
        } else if (current == State.SHEDDING
                && utilization <= lowWaterMark) {
            state.set(
                    State.RECOVERING);
        } else if (current == State.RECOVERING
                && utilization < lowWaterMark) {
            state.set(
                    State.NORMAL);
        }

        return state.get()
                == State.NORMAL;
    }
}
```

Hysteresis evita alternância rápida.

---

### 32. Definir high e low water marks

Exemplo didático: high em 80% e low em 50%. Reduza admissão no high e retome apenas abaixo do low; valores reais exigem medição.

---

### 33. Criar policy de fairness

Arquivo:

```text
backpressure-fairness-policy.yaml
```

Conteúdo:

```yaml
fairness:
  evaluate:
    - tenant
    - priority
    - producer
    - queue-partition

  oneProducerCanMonopolizeBuffer:
    forbidden

  priority:
    starvationProtection:
      required

  weightedAdmission:
    document:
      required

  perTenantQueue:
    evaluate:
      required
```

---

### 34. Evitar noisy neighbor

Se um produtor monopoliza a fila, outros sofrem starvation. Use quotas, filas separadas, weighted fairness, limites por origem, prioridades bounded ou round robin.

---

### 35. Criar métricas

```java
public final class BackpressureMetrics {

    private final LongAdder accepted =
            new LongAdder();

    private final LongAdder rejected =
            new LongAdder();

    private final LongAdder consumed =
            new LongAdder();

    private final LongAdder dropped =
            new LongAdder();

    private final LongAdder noDemand =
            new LongAdder();

    public void accepted() {
        accepted.increment();
    }

    public void rejected() {
        rejected.increment();
    }

    public void consumed(
            Duration latency) {
        consumed.increment();
    }

    public void dropped() {
        dropped.increment();
    }

    public void noDemand() {
        noDemand.increment();
    }
}
```

Registre a distribuição de latência.

---

### 36. Criar snapshot

```java
public record BackpressureSnapshot(
        long produced,
        long accepted,
        long rejected,
        long dropped,
        long consumed,
        long outstandingDemand,
        int queueSize,
        int queueCapacity,
        Duration oldestItemAge,
        double arrivalRate,
        double consumptionRate) {
}
```

---

### 37. Criar policy de observabilidade

Arquivo:

```text
backpressure-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  rates:
    required:
      - produced
      - accepted
      - consumed
      - rejected
      - dropped

  queue:
    required:
      - size
      - capacity
      - utilization
      - oldest-item-age

  demand:
    required:
      - requested
      - delivered
      - outstanding

  flow:
    required:
      - p50-wait
      - p95-wait
      - p99-wait
      - recovery-time

  labels:
    forbidden:
      - item-id
      - customer-id
      - request-id
      - raw-tenant-id
```

---

### 38. Correlacionar sinais

Fila e idade crescendo com CPU baixa sugerem limite downstream ou consumer bloqueado. Fila alta, CPU em 100% e rejeições crescentes sugerem consumer CPU-bound no limite.

---

### 39. Criar policy de recovery

Arquivo:

```text
backpressure-recovery-policy.yaml
```

Conteúdo:

```yaml
recovery:
  detect:
    - queue-below-low-water
    - oldest-age-decreasing
    - consumption-above-arrival
    - rejection-rate-decreasing

  resume:
    gradual:
      required

  instantFullAdmission:
    forbidden

  backlog:
    drainTime:
      required

  success:
    stableWindow:
      required
```

---

### 40. Calcular drain time conceitual

Com backlog de 1.000 itens, consumo de 300/s e novas chegadas de 100/s, a drenagem líquida é 200/s e o drain time aproximado é cinco segundos. Se entrada e saída forem iguais, o backlog não drena.

---

### 41. Validar recuperação

Script:

```text
validate-backpressure-recovery.ps1
```

Sequência:

1. baseline estável;
2. producer acelera;
3. fila passa high-water mark;
4. admission entra em shedding;
5. producer reduz;
6. consumer drena;
7. fila passa low-water mark;
8. admissão retoma gradualmente;
9. janela estável confirma recovery.

---

### 42. Evitar retry storm

Retry imediato após rejeição amplifica a sobrecarga. Use backoff, jitter, retry budget, idempotência, limite de tentativas, circuit breaker e shedding. O aprofundamento com timeouts fica para a aula 596.

---

### 43. Kafka e backpressure conceitual

Kafka não usa `request(n)`. A pressão aparece em poll, batches, commits, pause/resume, partitions, consumer lag, filas internas e downstream. O lag é backlog persistido no broker.

---

### 44. HTTP e backpressure conceitual

HTTP aplica pressão por conexões, filas, rejection, status de sobrecarga, rate limiting, admission control, streaming, limites de payload e cancellation; não aceite tudo para enfileirar em memória.

---

### 45. JDBC e backpressure conceitual

HikariCP oferece um limite de conexões.

Quando muitas tasks aguardam conexão, pending e latência crescem. O pool JDBC é fronteira de capacidade, mas admission control deve ocorrer antes de trabalho caro.

---

### 46. Executors e backpressure

`ThreadPoolExecutor` com fila bounded e rejection policy oferece um mecanismo de pressão.

`AbortPolicy` rejeita; `CallerRunsPolicy` desacelera o chamador; filas menores dão feedback rápido, e maiores aumentam absorção e latência.

A escolha segue o contrato.

---

### 47. Virtual threads e backpressure

Virtual threads permitem muitas tasks bloqueadas.

Isso não significa que todas devam chegar ao downstream simultaneamente.

Use semáforos, pools de conexão, admission control, filas bounded, rate limits, budgets e prioridades.

Virtual threads reduzem custo de espera, não o limite do recurso.

---

### 48. Criar policy de shutdown

Arquivo:

```text
backpressure-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewProduction:
    first:
      true

  demand:
    cancel:
      required

  buffer:
    policy:
      required

  inFlight:
    wait:
      bounded:
        required

  droppedOnShutdown:
    record:
      required

  consumer:
    interruptWhenNeeded:
      true

  zeroTaskLeak:
    required
```

---

### 49. Definir política para buffer no shutdown

No shutdown, o buffer pode ser drenado, persistido, devolvido ao broker, descartado por contrato ou marcado como não processado.

---

### 50. Criar shutdown manager

```java
public final class BackpressureShutdownManager {

    public BackpressureShutdownResult shutdown(
            AtomicBoolean producing,
            DemandCounter demand,
            ExecutorService executor,
            BoundedWorkBuffer buffer,
            Duration wait) {

        producing.set(false);
        demand.cancel();
        executor.shutdown();

        boolean terminated;

        try {
            terminated =
                    executor.awaitTermination(
                            wait.toMillis(),
                            TimeUnit.MILLISECONDS);
        } catch (InterruptedException exception) {
            Thread.currentThread()
                    .interrupt();
            terminated = false;
        }

        if (!terminated) {
            executor.shutdownNow();
        }

        return new BackpressureShutdownResult(
                terminated,
                buffer.size());
    }
}
```

Itens restantes precisam de política explícita.

---

### 51. Criar policy de data quality

Arquivo:

```text
backpressure-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  unknownArrivalRate:
    result:
      inconclusive

  unknownConsumptionRate:
    result:
      inconclusive

  missingQueueCapacity:
    action:
      fail

  missingOldestAge:
    result:
      limited

  silentDrop:
    action:
      fail

  singleRun:
    result:
      limited

  generatorSaturated:
    result:
      inconclusive
```

---

### 52. Criar policy de segurança

Arquivo:

```text
backpressure-security-policy.yaml
```

Conteúdo:

```yaml
security:
  queueMetrics:
    itemIdentifier:
      forbidden

  rejectionLog:
    payload:
      forbidden

  tenant:
    rawIdentifier:
      forbidden

  evidence:
    syntheticData:
      required

  credentials:
    forbidden

  bufferDump:
    repository:
      forbidden
```

---

### 53. Criar failure policy

Arquivo:

```text
backpressure-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  unboundedBuffer:
    action:
      reject-design

  silentDrop:
    action:
      fail-gate

  demandBelowZero:
    action:
      fail

  producerIgnoresCancellation:
    action:
      fail-review

  recoveryNeverReachesLowWater:
    action:
      fail-recovery

  retryStorm:
    action:
      enable-shedding-and-backoff

  timeoutTuning:
    deferredToLesson596
```

---

### 54. Criar cenários oficiais

Arquivo:

```text
backpressure-scenarios.yaml
```

Cenários:

```text
balanced-producer-consumer;

fast-producer-slow-consumer;

bounded-buffer-reject;

bounded-buffer-block;

drop-latest;

drop-oldest;

keep-latest;

caller-runs;

explicit-demand-five;

demand-exhausted;

demand-replenished;

cancelled-demand;

batch-consumer;

partial-batch;

high-water-shedding;

low-water-recovery;

noisy-neighbor;

fair-admission;

retry-storm-model;

Kafka-lag-model;

HTTP-admission-model;

JDBC-capacity-model;

virtual-thread-downstream-limit;

shutdown-drain;

shutdown-discard-explicit;

zero-task-leak.
```

Cada cenário registra producer, consumer, rates, buffer, demanda, overflow, backlog, recovery, shutdown, resultado e evidence.

---

### 55. Criar relatório baseline

Arquivo:

```text
backpressure-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  flow:
    ORDER-ENRICHMENT

  producer:
    rateCategory:
      baseline

  consumer:
    rateCategory:
      baseline

  buffer:
    bounded:
      true

    utilizationPeak:
      below-high-water

  demand:
    explicit:
      true

  overflow:
    rejected:
      zero

  shutdown:
    taskLeaks:
      zero

  result:
    PASS
```

---

### 56. Criar matriz de testes

Arquivo:

```text
BACKPRESSURE_TEST_MATRIX.md
```

Cenários:

- producer faster;
- consumer faster;
- balanced flow;
- bounded buffer;
- rejection;
- blocking producer;
- drop latest;
- drop oldest;
- keep latest;
- caller runs;
- demand request;
- demand exhaustion;
- cancellation;
- credit return;
- batching;
- partial batch;
- high-water;
- low-water;
- hysteresis;
- noisy neighbor;
- fairness;
- recovery;
- shutdown;
- task leak;
- security;
- evidence.

---

### 57. Criar troubleshooting

Arquivo:

```text
BACKPRESSURE_TROUBLESHOOTING.md
```

Inclua:

- fila cresce sem parar;
- producer parece bloqueado;
- consumer não atinge throughput;
- `remainingCapacity` sempre zero;
- rejeições aparecem cedo;
- drop remove item crítico;
- latest perde eventos obrigatórios;
- créditos ficam negativos;
- demanda não é devolvida;
- batching aumenta latência;
- caller runs trava request;
- high-water oscila;
- recovery nunca ocorre;
- retry storm;
- HikariCP pending alto;
- Kafka lag cresce;
- virtual threads sobrecarregam downstream;
- shutdown deixa itens sem política;
- conteúdo da aula 596 antecipado.

---

### 58. Criar gate

O gate valida:

- contrato;
- catálogo;
- producers e consumers;
- rates;
- buffer bounded;
- demanda;
- créditos;
- overflow;
- batching;
- admission control;
- fairness;
- recovery;
- shutdown;
- zero task leaks;
- segurança.

Status:

```text
PASS;

FAIL_UNBOUNDED_BUFFER;

FAIL_SILENT_DROP;

FAIL_DEMAND;

FAIL_CREDIT;

FAIL_ADMISSION;

FAIL_FAIRNESS;

FAIL_RECOVERY;

FAIL_SHUTDOWN;

FAIL_TASK_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 59. Coletar evidence

Script:

```text
collect-backpressure-evidence.ps1
```

Arquivo:

```text
backpressure-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- flow category;
- producer category;
- consumer category;
- arrival rate category;
- consumption rate category;
- buffer status;
- demand status;
- overflow category;
- admission status;
- recovery status;
- shutdown status;
- task leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- item ID;
- order ID;
- customer ID;
- request ID;
- tenant ID bruto;
- payload;
- buffer dump;
- segredo;
- configuração detalhada de timeout;
- material da aula 596.

---

### 60. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\performance\backpressure\validate-backpressure-contract.ps1

.\scripts\performance\backpressure\validate-backpressure-flow-catalog.ps1

.\scripts\performance\backpressure\run-backpressure-baseline.ps1

.\scripts\performance\backpressure\simulate-fast-producer-slow-consumer.ps1

.\scripts\performance\backpressure\validate-bounded-buffer.ps1

.\scripts\performance\backpressure\validate-demand-credits.ps1

.\scripts\performance\backpressure\validate-overflow-reject.ps1

.\scripts\performance\backpressure\validate-overflow-drop-latest.ps1

.\scripts\performance\backpressure\validate-overflow-drop-oldest.ps1

.\scripts\performance\backpressure\validate-latest-value-policy.ps1

.\scripts\performance\backpressure\validate-batching-policy.ps1

.\scripts\performance\backpressure\validate-admission-control.ps1

.\scripts\performance\backpressure\validate-backpressure-recovery.ps1

.\scripts\performance\backpressure\validate-backpressure-observability.ps1

.\scripts\performance\backpressure\validate-backpressure-shutdown.ps1

.\scripts\performance\backpressure\scan-backpressure-output.ps1

.\scripts\performance\backpressure\collect-backpressure-evidence.ps1

.\scripts\performance\backpressure\verify-backpressure-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- rates observadas;
- buffer bounded;
- demanda validada;
- créditos nunca negativos;
- overflow explícito;
- drop sem silêncio;
- batching bounded;
- admission control aprovado;
- high e low water marks aprovados;
- fairness avaliada;
- recovery aprovada;
- shutdown aprovado;
- zero task leaks;
- segurança aprovada;
- evidence sanitizada;
- timeouts de produção não antecipados.

---

### 61. Encerrar o laboratório

Confirme produtor, consumidor e executor encerrados, demanda cancelada, buffer tratado, nenhuma task ou evidence sensível residual e baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/backpressure `
  -Recurse `
  -Force
```

Preserve relatórios.

---

## Entendendo o que foi feito

### Entrada e saída ganharam taxas

O fluxo deixou de ser descrito apenas por quantidade de threads.

### Buffer ganhou limite

O backlog deixou de crescer indefinidamente.

### Overflow ganhou contrato

Fila cheia passou a produzir bloqueio, rejeição, drop ou coalescing explícito.

### Demanda ganhou créditos

O produtor passou a emitir apenas o que o consumidor declarou poder receber.

### Push e pull ganharam diferença

Produção orientada pela origem ficou separada de consumo orientado por capacidade.

### Batching ganhou limite

Eficiência deixou de justificar lotes gigantes ou espera indefinida.

### Admission control ganhou feedback

Fila, idade, workers e downstream passaram a influenciar a aceitação.

### High e low water marks ganharam hysteresis

O sistema deixou de alternar continuamente entre normal e shedding.

### Fairness ganhou proteção

Um produtor deixou de poder monopolizar o buffer sem política.

### Recovery ganhou drain time

Retomar admissão passou a depender da drenagem e de uma janela estável.

### A próxima aula ganhou fronteira

A aula 596 irá aprofundar timeouts em produção.

---

## Erros comuns importantes

### Usar fila ilimitada

A pressão vira memória e latência.

### Aumentar buffer sem medir

O sistema aceita mais backlog, mas não processa mais rápido.

### Bloquear thread de request

A propagação de pressão pode consumir o próprio pool de entrada.

### Descartar silenciosamente

O produtor acredita que o trabalho foi aceito.

### Usar latest para eventos obrigatórios

Atualizações intermediárias podem ser perdidas.

### Confundir batching com capacidade

Lotes reduzem overhead, mas não resolvem taxa insuficiente.

### Ignorar demanda

O publisher pode ultrapassar o contrato do consumidor.

### Fazer retry imediato após rejeição

A sobrecarga cresce.

### Retomar tudo ao atingir low-water

A fila pode voltar a saturar rapidamente.

### Criar métrica por item

A cardinalidade cresce sem valor operacional.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\performance\backpressure\run-backpressure-baseline.ps1
```

### Simular produtor rápido

```powershell
.\scripts\performance\backpressure\simulate-fast-producer-slow-consumer.ps1
```

### Validar demanda

```powershell
.\scripts\performance\backpressure\validate-demand-credits.ps1
```

### Validar admissão

```powershell
.\scripts\performance\backpressure\validate-admission-control.ps1
```

### Validar recovery

```powershell
.\scripts\performance\backpressure\validate-backpressure-recovery.ps1
```

---

## Exercício guiado

### Parte 1 — Fluxo

Defina producer, consumer e rates.

### Parte 2 — Buffer

Crie fila bounded.

### Parte 3 — Overflow

Compare block, reject, drop e latest.

### Parte 4 — Demand

Implemente créditos.

### Parte 5 — Pull

Faça o consumidor solicitar capacidade.

### Parte 6 — Batching

Use limites de itens e espera.

### Parte 7 — Admission

Implemente high e low water marks.

### Parte 8 — Fairness

Evite noisy neighbor.

### Parte 9 — Recovery

Meça drain time e retomada gradual.

### Parte 10 — Gate

Valide shutdown, leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 594 e ponte para a aula 596 foram preservadas;
- producer, consumer, rates, backlog, buffer, overflow, demand, credits, push, pull, water marks, admission, shedding, batching e Reactive Streams foram definidos;
- contrato, catálogo e policies foram criados;
- buffer e capacidade são bounded e medidos;
- produtor rápido e consumidor lento foram simulados;
- picos temporários foram separados de desequilíbrio permanente;
- BLOCK, REJECT, DROP_LATEST, DROP_OLDEST, KEEP_LATEST e CALLER_RUNS possuem contratos explícitos;
- nenhuma perda ocorre silenciosamente;
- créditos nunca ficam negativos e cancelamento impede novas entregas;
- `request(n)` foi explicado e validado conceitualmente;
- batching possui limites e não foi confundido com capacidade;
- admission control atua antes de trabalho caro;
- high e low water marks utilizam hysteresis;
- fairness e noisy neighbor foram avaliados;
- métricas incluem rates, fila, idade, demanda, rejeição, drop e recovery;
- Kafka, HTTP, JDBC, executors e virtual threads foram relacionados ao conceito;
- recovery mede drain time e janela estável;
- retry storm foi tratado com backoff, jitter e shedding;
- shutdown para produção, cancela demanda e trata o buffer;
- qualidade, segurança, failure policy, matriz, troubleshooting, gate e evidence estão presentes;
- zero task leaks foram validados;
- nenhum payload, identificador ou buffer dump foi commitado;
- timeouts em produção não foram aprofundados;
- commit recomendado, diário de bordo e regra final estão presentes.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/performance/backpressure `
  scripts/performance/backpressure `
  docs/performance/backpressure `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|requestId|rawTenantId|businessPayload|bufferDump|connectTimeout|readTimeout|writeTimeout|responseTimeout"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar backpressure conceitual"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- secrets;
- identificadores reais;
- payloads;
- dumps de buffer;
- artifacts temporários;
- configuração detalhada de timeout;
- WebFlux;
- Reactor;
- material da aula 596.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você estruturou backpressure como um contrato de capacidade entre produtores e consumidores.

Você trabalhou com:

```text
production rate;

consumption rate;

backlog;

bounded buffer;

overflow;

demand;

credits;

push;

pull;

request(n);

batching;

admission control;

load shedding;

water marks;

fairness;

recovery;

shutdown.
```

Você comprovou que uma fila absorve apenas diferenças temporárias; que desequilíbrio permanente exige reduzir, bloquear, rejeitar ou descartar; que perda precisa ser explícita; que demanda limita a emissão; que batching melhora eficiência sem criar capacidade; que admission control deve atuar antes de trabalho caro; que high e low water marks evitam oscilação; que fairness protege contra noisy neighbor; e que virtual threads, executors, Kafka e pools JDBC continuam precisando de limites.

A próxima aula será:

```text
596 - M18.41 - Timeouts em producao
```

Nela, você irá definir budgets de tempo para conexão, aquisição, leitura, escrita, processamento e jornada total, propagar deadlines, alinhar timeouts entre camadas, evitar retries que excedem o budget e diagnosticar timeouts em HTTP, JDBC, Kafka, Redis e executors.

Nenhum modelo completo de timeout por dependência, deadline propagation, configuração detalhada de clientes, retry budget associado a timeout ou hierarquia de timeouts foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Medi produção e consumo.
- [ ] Criei buffer bounded.
- [ ] Defini overflow explícito.
- [ ] Implementei créditos.
- [ ] Modelei `request(n)`.
- [ ] Limitei batching.
- [ ] Implementei admission control.
- [ ] Validei recovery sem task leak.

---

## Troubleshooting adicional

### A fila cresce continuamente

A taxa aceita supera a taxa consumida.

### O buffer está sempre cheio

A capacidade pode estar pequena, o consumidor lento ou o fluxo permanentemente instável.

### O producer trava

A estratégia BLOCK está propagando pressão para a thread produtora.

### Rejeições aparecem mesmo com CPU baixa

O gargalo pode estar no consumidor ou downstream.

### Drop remove dado obrigatório

A estratégia de overflow não corresponde ao contrato.

### Créditos ficam negativos

A atualização de demanda está incorreta.

### `request(n)` não controla emissão

O producer pode estar ignorando o contador.

### Batching piora p99

O tempo de formação do lote pode estar alto.

### High-water oscila

Adicione low-water e janela estável.

### Recovery não termina

A capacidade líquida de drenagem pode ser zero ou negativa.

---

## Perguntas de revisão

1. O que é backpressure?
2. O que é producer?
3. O que é consumer?
4. O que é backlog?
5. O que é bounded buffer?
6. O que é overflow?
7. O que é demand?
8. O que é credit?
9. Qual diferença entre push e pull?
10. O que é high-water mark?
11. O que é low-water mark?
12. O que é admission control?
13. O que é load shedding?
14. Qual diferença entre batching e backpressure?
15. O que faz `request(n)`?
16. Por que fila ilimitada é perigosa?
17. O que é noisy neighbor?
18. O que é drain time?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Controle da produção pela capacidade de consumo.
2. Origem do trabalho.
3. Processador do trabalho.
4. Trabalho aceito e não concluído.
5. Fila com capacidade máxima.
6. Chegada com buffer cheio.
7. Quantidade que pode ser recebida.
8. Permissão de emissão.
9. Produtor envia versus consumidor solicita.
10. Limite de pressão alta.
11. Limite de recuperação.
12. Decisão antecipada de aceitar.
13. Rejeitar trabalho para proteger o sistema.
14. Eficiência versus controle de capacidade.
15. Solicita até `n` itens.
16. Converte pressão em memória e latência.
17. Origem que monopoliza capacidade.
18. Tempo para esvaziar backlog.
19. Timeouts em produção.
20. Timeouts em produção.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 595 - M18.40 - Backpressure conceitual

- Continuei após Deadlocks em Java.
- Defini producer, consumer, rates, backlog e buffers bounded.
- Diferenciei backpressure, rate limiting e load shedding.
- Criei contrato, catálogo e policies.
- Simulei produtor rápido e consumidor lento.
- Comparei estratégias de overflow explícitas.
- Criei demanda, créditos, `request(n)` e cancelamento.
- Diferenciei push e pull.
- Implementei batching bounded.
- Criei admission control com high, low e hysteresis.
- Avaliei fairness e noisy neighbor.
- Criei métricas de rates, fila, idade, demanda, rejeição e drop.
- Relacionei Kafka, HTTP, JDBC, executors e virtual threads.
- Modelei retry storm, drain time e recovery.
- Implementei shutdown e policy para itens restantes.
- Validei zero task leaks e evidence sanitizada.
- Não antecipei timeouts em produção.
- Próxima aula: Timeouts em produção.
```

## Referência técnica curta

- Producer-consumer systems.
- Bounded queues.
- Backpressure.
- Reactive Streams concepts.
- `request(n)`.
- Admission control.
- Load shedding.
- Batching.
- Little’s Law.
- Queue observability.

Regra final:

```text
backpressure precisa tornar explícita a relação entre taxa de produção, taxa de consumo, demanda, buffer e overflow: todo fluxo possui producer, consumer, owner, fila bounded, capacidade derivada de latência e memória, estratégia de overflow, métricas, recovery e shutdown, enquanto filas ilimitadas são proibidas porque convertem pressão em backlog, memória e p99; o consumidor declara créditos, o produtor não emite além da demanda, request(n) acumula capacidade sem overflow numérico e cancel impede novas entregas, enquanto BLOCK, REJECT, DROP_LATEST, DROP_OLDEST, KEEP_LATEST e CALLER_RUNS só são usados quando correspondem ao contrato do dado e toda perda é observável; batching reduz overhead, mas não substitui capacidade, admission control atua antes de trabalho caro, high e low water marks usam hysteresis, fairness protege contra noisy neighbor e recovery exige drain time e janela estável; Kafka, HTTP, JDBC, executors e virtual threads permanecem bounded, e o laboratório termina com zero task leaks e evidence sanitizada; budgets, deadlines e configuração de timeouts ficam para a aula 596.
```
