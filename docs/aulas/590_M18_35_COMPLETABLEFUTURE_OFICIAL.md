# 590 - M18.35 - CompletableFuture

## Apresentação da aula

Na aula 589, você deixou de criar uma thread para cada tarefa e passou a usar pools gerenciados com:

```text
Executor;

ExecutorService;

ThreadPoolExecutor;

workers;

fila bounded;

rejection policy;

Callable;

Future;

cancelamento;

context propagation;

shutdown.
```

Você também comprovou que um pool não cria capacidade infinita.

Ele apenas torna explícitos:

```text
quantos workers existem;

quanto trabalho pode aguardar;

quando uma task é rejeitada;

como falhas são observadas;

como o executor termina.
```

O `Future` clássico permitiu aguardar um resultado, tratar timeout, inspecionar falha e solicitar cancelamento.

Porém, ele possui uma limitação importante:

```text
Future representa
um resultado futuro,

mas não oferece
uma linguagem rica
para compor
múltiplas etapas.
```

Considere um fluxo de pedido:

```text
carregar pedido;

carregar cliente;

consultar política;

combinar dados;

calcular decisão;

persistir auditoria.
```

Com `Future` clássico, o código frequentemente fica preso em chamadas sequenciais de:

```java
future.get();
```

Isso pode produzir:

- bloqueio desnecessário;
- composição manual;
- tratamento repetitivo de exceções;
- timeout espalhado;
- dificuldade para combinar resultados;
- propagação de contexto inconsistente;
- cancelamento incompleto;
- observabilidade fragmentada.

Nesta aula, você irá trabalhar com:

```java
CompletableFuture
```

A pergunta central será:

```text
como criar
e compor estágios assíncronos

com executors explícitos,
falhas observáveis,
timeouts,
cancelamento,
contexto
e shutdown

sem usar o common pool
de forma acidental
ou esconder bloqueios?
```

`CompletableFuture` representa um estágio de computação que pode ser concluído:

- com sucesso;
- com falha;
- por cancelamento;
- manualmente;
- por outra etapa;
- por combinação de etapas.

Ele também permite descrever um pipeline:

```text
obter dado;

transformar;

encadear nova operação;

combinar resultados;

tratar falha;

aplicar timeout;

produzir resultado final.
```

Você irá diferenciar:

```java
runAsync(...)
```

e:

```java
supplyAsync(...)
```

`runAsync` executa uma ação sem produzir valor de retorno.

`supplyAsync` executa uma operação que produz um valor.

Também irá diferenciar:

```java
thenApply
```

de:

```java
thenCompose
```

`thenApply` transforma um valor.

`thenCompose` encadeia uma nova operação assíncrona e evita `CompletableFuture<CompletableFuture<T>>`.

Você também irá utilizar:

- `thenAccept`;
- `thenRun`;
- `thenCombine`;
- `allOf`;
- `anyOf`;
- `exceptionally`;
- `handle`;
- `whenComplete`;
- `orTimeout`;
- `completeOnTimeout`;
- `complete`;
- `completeExceptionally`;
- `join`;
- `get`;
- `cancel`;
- executors explícitos;
- propagação e limpeza de contexto;
- métricas por estágio;
- correlação;
- testes determinísticos;
- shutdown dos executors usados.

A aula não irá utilizar virtual threads.

Não serão implementados:

- `Thread.ofVirtual`;
- `Executors.newVirtualThreadPerTaskExecutor`;
- `Thread.startVirtualThread`;
- carrier threads;
- pinning;
- parking de virtual threads;
- comparação de milhões de threads;
- migração de pools para virtual threads;
- observabilidade específica de virtual threads.

Esses assuntos pertencem à próxima aula oficial:

```text
591 - M18.36 - Virtual threads
```

A regra central será:

```text
CompletableFuture
deve tornar a composição
mais clara;

não esconder executor,
timeout,
falha,
bloqueio,
contexto
ou shutdown.
```

---

## Onde estamos na formação

A sequência imediata é:

```text
588:
Threads e Runnable.

589:
ExecutorService pools.

590:
CompletableFuture.

591:
Virtual threads.
```

A progressão é:

```text
criar trabalho;

gerenciar workers;

compor estágios assíncronos;

simplificar concorrência bloqueante
com virtual threads.
```

Nesta aula:

```text
CompletableFuture:
sim.

runAsync:
sim.

supplyAsync:
sim.

thenApply:
sim.

thenCompose:
sim.

thenCombine:
sim.

allOf:
sim.

anyOf:
sim.

exceptionally:
sim.

handle:
sim.

whenComplete:
sim.

timeouts:
sim.

cancelamento:
sim.

executor explícito:
sim.

common pool:
analisar e evitar uso acidental.

virtual threads:
não.

locks:
não aprofundar.

structured concurrency:
não.
```

Você reutilizará:

- `ExecutorService`;
- pools bounded;
- interruption;
- cancelamento;
- timeout;
- contexto;
- métricas;
- logs;
- traces;
- thread dumps;
- shutdown;
- policies de falha.

A composição precisa preservar:

- boundedness;
- executor conhecido;
- timeout por jornada;
- falhas observáveis;
- contexto limpo;
- ausência de bloqueio acidental;
- ausência de future esquecida;
- shutdown dos recursos;
- zero task leaks.

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
concurrency/completable-future
├── completable-future-contract.yaml
├── completable-future-stage-catalog.yaml
├── completable-future-executor-policy.yaml
├── completable-future-composition-policy.yaml
├── completable-future-timeout-policy.yaml
├── completable-future-exception-policy.yaml
├── completable-future-cancellation-policy.yaml
├── completable-future-context-policy.yaml
├── completable-future-observability-policy.yaml
├── completable-future-shutdown-policy.yaml
├── completable-future-data-quality-policy.yaml
├── completable-future-security-policy.yaml
├── completable-future-failure-policy.yaml
├── completable-future-scenarios.yaml
└── completable-future-evidence.yaml

concurrency/completable-future/src/main/java
└── br/com/formacao/concurrency/futures
    ├── AsyncStageName.java
    ├── AsyncStageEvent.java
    ├── AsyncStageRecorder.java
    ├── AsyncContext.java
    ├── ContextAwareExecutor.java
    ├── OrderSnapshot.java
    ├── CustomerSnapshot.java
    ├── PolicySnapshot.java
    ├── OrderDecision.java
    ├── OrderAsyncSource.java
    ├── CompletableOrderFlow.java
    ├── CompletableFutureTimeouts.java
    ├── CompletableFutureFailures.java
    ├── CompletableFutureCancellation.java
    ├── CompletableFutureFanOut.java
    └── CompletableFutureDemo.java

concurrency/completable-future/src/test/java
└── br/com/formacao/concurrency/futures
    ├── RunAsyncVsSupplyAsyncTest.java
    ├── ThenApplyTest.java
    ├── ThenComposeTest.java
    ├── ThenCombineTest.java
    ├── AllOfTest.java
    ├── AnyOfTest.java
    ├── CompletableFutureTimeoutTest.java
    ├── CompletableFutureExceptionTest.java
    ├── CompletableFutureCancellationTest.java
    ├── CompletableFutureContextTest.java
    ├── CompletableFutureShutdownTest.java
    └── CompletableFutureNoLeakTest.java

concurrency/completable-future/reports
├── completable-future-baseline-report.yaml
├── completable-future-composition-report.yaml
├── completable-future-timeout-report.yaml
├── completable-future-failure-report.yaml
├── completable-future-context-report.yaml
├── completable-future-shutdown-report.yaml
└── completable-future-gate-report.yaml

scripts/concurrency/completable-future
├── validate-completable-future-contract.ps1
├── validate-completable-future-stage-catalog.ps1
├── run-completable-future-baseline.ps1
├── validate-completable-future-composition.ps1
├── validate-completable-future-timeouts.ps1
├── validate-completable-future-failures.ps1
├── validate-completable-future-cancellation.ps1
├── validate-completable-future-context.ps1
├── validate-completable-future-observability.ps1
├── validate-completable-future-shutdown.ps1
├── collect-completable-future-thread-dump.ps1
├── scan-completable-future-output.ps1
├── collect-completable-future-evidence.ps1
└── verify-completable-future-baseline.ps1

docs/concurrency/completable-future
├── COMPLETABLE_FUTURE_OVERVIEW.md
├── RUN_ASYNC_AND_SUPPLY_ASYNC.md
├── APPLY_COMPOSE_AND_COMBINE.md
├── ALL_OF_AND_ANY_OF.md
├── COMPLETABLE_FUTURE_TIMEOUTS.md
├── COMPLETABLE_FUTURE_FAILURES.md
├── COMPLETABLE_FUTURE_CONTEXT.md
├── COMPLETABLE_FUTURE_OBSERVABILITY.md
├── COMPLETABLE_FUTURE_TEST_MATRIX.md
└── COMPLETABLE_FUTURE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
contrato de composição;

catálogo de estágios;

executor explícito;

pipelines;

fan-out;

combinação;

timeouts;

falhas;

cancelamento;

contexto;

shutdown;

gate;

evidence sanitizada.
```

---

## Conceito essencial

### `CompletableFuture<T>`

Representa um estágio que poderá produzir um valor, falha ou cancelamento.

---

### Completion stage

Etapa ligada à conclusão de outra etapa.

---

### `runAsync`

Executa uma ação assíncrona sem valor de retorno.

---

### `supplyAsync`

Executa um `Supplier<T>` assíncrono e produz um valor.

---

### `thenApply`

Transforma o resultado de uma etapa.

```text
T
para
U.
```

---

### `thenCompose`

Encadeia uma função que retorna outro estágio assíncrono.

```text
T
para
CompletableFuture<U>.
```

O resultado final permanece:

```text
CompletableFuture<U>.
```

---

### `thenCombine`

Combina resultados de dois estágios independentes.

---

### `allOf`

Conclui quando todos os estágios informados terminam.

---

### `anyOf`

Conclui quando qualquer estágio termina.

---

### `exceptionally`

Transforma uma falha em valor alternativo.

---

### `handle`

Recebe valor ou falha e produz um novo resultado.

---

### `whenComplete`

Observa sucesso ou falha sem alterar intencionalmente o resultado.

---

### `orTimeout`

Completa excepcionalmente quando o prazo expira.

---

### `completeOnTimeout`

Produz um valor alternativo quando o prazo expira.

---

### Completion executor

Executor utilizado para executar um estágio assíncrono.

---

### Common pool

Pool compartilhado usado por operações assíncronas sem executor explícito em determinados métodos.

---

### Fan-out

Disparo de múltiplas operações independentes.

---

### Fan-in

Combinação dos resultados de múltiplas operações.

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

- aula 589 validada;
- executors anteriores encerrados;
- pool bounded disponível;
- zero thread leaks;
- nenhum `CompletableFuture` usa virtual thread;
- nenhum teste usa espera infinita;
- todos os estágios possuem owner e propósito.

---

### 2. Criar contrato

Arquivo:

```text
completable-future-contract.yaml
```

Conteúdo:

```yaml
completableFuture:
  required:
    - flow
    - stage
    - owner
    - executor
    - timeout
    - exception-policy
    - cancellation-policy
    - context-policy
    - observability
    - shutdown

  executor:
    explicitForAsyncProductionStage:
      required

  completion:
    everyCriticalFutureObserved:
      required

  tests:
    zeroTaskLeak:
      required

  forbiddenInLesson590:
    - virtualThread
    - structuredConcurrency
    - implicitCommonPoolForCriticalStage

  nextLesson:
    code:
      M18.36
```

---

### 3. Criar catálogo de estágios

Arquivo:

```text
completable-future-stage-catalog.yaml
```

Exemplo:

```yaml
flows:
  - id:
      ORDER-DECISION

    owner:
      orders-api

    stages:
      - name:
          load-order

        type:
          supplyAsync

        executor:
          orders-io

        timeout:
          300ms

      - name:
          load-customer

        type:
          supplyAsync

        executor:
          customers-io

        timeout:
          300ms

      - name:
          combine-order-customer

        type:
          thenCombine

      - name:
          load-policy

        type:
          thenCompose

        executor:
          policy-io

      - name:
          build-decision

        type:
          thenApply

    terminal:
      observed:
        true
```

---

### 4. Criar policy de executor

Arquivo:

```text
completable-future-executor-policy.yaml
```

Conteúdo:

```yaml
executor:
  asyncProductionStage:
    explicit:
      required

  commonPool:
    allowedOnlyFor:
      - isolated-laboratory-example
      - CPU-light-noncritical-stage

  blockingStage:
    dedicatedBoundedExecutor:
      required

  executorShutdown:
    required

  nestedBlockingOnSameExecutor:
    forbidden

  metrics:
    required
```

Não use o common pool acidentalmente em trabalho crítico.

---

### 5. Criar executors explícitos

Exemplo:

```java
ExecutorService orderIoExecutor =
        new ThreadPoolExecutor(
                4,
                8,
                30,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(50),
                namedFactory("cf-order-io"),
                new ThreadPoolExecutor.AbortPolicy());

ExecutorService policyIoExecutor =
        new ThreadPoolExecutor(
                2,
                4,
                30,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(20),
                namedFactory("cf-policy-io"),
                new ThreadPoolExecutor.AbortPolicy());
```

Os valores são didáticos.

Cada executor precisa constar no catálogo de pools.

---

### 6. Criar nomes de estágio

```java
public enum AsyncStageName {
    LOAD_ORDER,
    LOAD_CUSTOMER,
    LOAD_POLICY,
    COMBINE_ORDER_CUSTOMER,
    BUILD_DECISION,
    AUDIT_RESULT
}
```

---

### 7. Criar evento de estágio

```java
public record AsyncStageEvent(
        AsyncStageName stage,
        String category,
        String threadName,
        Duration elapsed,
        Instant occurredAt) {
}
```

Não inclua IDs de negócio.

---

### 8. Criar recorder

```java
public final class AsyncStageRecorder {

    private final List<AsyncStageEvent> events =
            Collections.synchronizedList(
                    new ArrayList<>());

    public void record(
            AsyncStageName stage,
            String category,
            Duration elapsed) {

        events.add(
                new AsyncStageEvent(
                        stage,
                        category,
                        Thread.currentThread()
                                .getName(),
                        elapsed,
                        Instant.now()));
    }

    public List<AsyncStageEvent> snapshot() {
        synchronized (events) {
            return List.copyOf(events);
        }
    }
}
```

---

### 9. Criar `runAsync`

Exemplo:

```java
CompletableFuture<Void> auditFuture =
        CompletableFuture.runAsync(
                () -> auditSyntheticEvent(),
                orderIoExecutor);
```

`runAsync` retorna:

```text
CompletableFuture<Void>.
```

Ele é adequado quando o estágio representa efeito sem valor de retorno.

O efeito ainda precisa ser observado.

---

### 10. Criar `supplyAsync`

```java
CompletableFuture<OrderSnapshot> orderFuture =
        CompletableFuture.supplyAsync(
                () -> source.loadOrder(),
                orderIoExecutor);
```

O resultado fica disponível na completion.

---

### 11. Criar teste `runAsync` versus `supplyAsync`

Valide:

- `runAsync` produz `Void`;
- `supplyAsync` produz valor;
- executor explícito é usado;
- nome da thread possui prefixo esperado;
- exceção aparece na future;
- executor é encerrado no teste.

---

### 12. Criar policy de composição

Arquivo:

```text
completable-future-composition-policy.yaml
```

Conteúdo:

```yaml
composition:
  thenApply:
    useFor:
      synchronous-transformation

  thenCompose:
    useFor:
      async-dependency

  thenCombine:
    useFor:
      independent-results

  allOf:
    requires:
      collect-individual-results

  anyOf:
    requires:
      result-type-validation

  accidentalNestedFuture:
    forbidden
```

---

### 13. Usar `thenApply`

```java
CompletableFuture<String> statusFuture =
        orderFuture.thenApply(
                OrderSnapshot::status);
```

`thenApply` transforma o valor sem criar nova operação assíncrona.

---

### 14. Evitar trabalho bloqueante em `thenApply`

O estágio não assíncrono pode executar na thread que conclui a etapa anterior.

Não coloque chamada bloqueante longa sem revisar o executor e a semântica.

Para um novo estágio assíncrono, avalie:

```java
thenApplyAsync(
        mapper,
        explicitExecutor)
```

---

### 15. Usar `thenCompose`

```java
CompletableFuture<PolicySnapshot> policyFuture =
        orderFuture.thenCompose(
                order ->
                        CompletableFuture.supplyAsync(
                                () ->
                                        source.loadPolicy(
                                                order.policyCode()),
                                policyIoExecutor));
```

Sem `thenCompose`, você poderia gerar:

```text
CompletableFuture<
    CompletableFuture<PolicySnapshot>
>.
```

---

### 16. Testar `thenApply` e `thenCompose`

Valide:

- `thenApply` produz valor transformado;
- `thenCompose` achata a future;
- executor correto processa a dependência;
- falha da primeira etapa impede o encadeamento normal;
- timeout é aplicado ao fluxo.

---

### 17. Usar `thenCombine`

```java
CompletableFuture<CustomerSnapshot>
        customerFuture =
        CompletableFuture.supplyAsync(
                source::loadCustomer,
                orderIoExecutor);

CompletableFuture<OrderDecision>
        partialDecisionFuture =
        orderFuture.thenCombine(
                customerFuture,
                (order, customer) ->
                        OrderDecision.partial(
                                order,
                                customer));
```

Use quando as etapas são independentes.

---

### 18. Evitar falso paralelismo

Se `loadCustomer` depende do resultado de `loadOrder`, as operações não são independentes.

Nesse caso, use `thenCompose`.

Disparar tarefas cedo demais pode:

- chamar serviço desnecessariamente;
- desperdiçar conexão;
- dificultar cancelamento;
- ampliar falhas;
- aumentar carga.

---

### 19. Criar fan-out controlado

Arquivo conceitual:

```java
public final class CompletableFutureFanOut {

    public CompletableFuture<OrderDecision> execute(
            OrderAsyncSource source,
            Executor orderExecutor,
            Executor customerExecutor,
            Executor policyExecutor) {

        CompletableFuture<OrderSnapshot> order =
                CompletableFuture.supplyAsync(
                        source::loadOrder,
                        orderExecutor);

        CompletableFuture<CustomerSnapshot> customer =
                CompletableFuture.supplyAsync(
                        source::loadCustomer,
                        customerExecutor);

        CompletableFuture<PolicySnapshot> policy =
                CompletableFuture.supplyAsync(
                        source::loadPolicy,
                        policyExecutor);

        return order
                .thenCombine(
                        customer,
                        OrderDecision::from)
                .thenCombine(
                        policy,
                        OrderDecision::withPolicy);
    }
}
```

O fan-out precisa ser bounded pelos executors.

---

### 20. Usar `allOf`

```java
List<CompletableFuture<String>> futures =
        List.of(
                loadOne(),
                loadTwo(),
                loadThree());

CompletableFuture<Void> all =
        CompletableFuture.allOf(
                futures.toArray(
                        CompletableFuture[]::new));
```

`allOf` não retorna automaticamente a lista de valores.

Depois da conclusão, obtenha resultados individuais.

---

### 21. Coletar resultados após `allOf`

```java
CompletableFuture<List<String>> collected =
        CompletableFuture.allOf(
                        futures.toArray(
                                CompletableFuture[]::new))
                .thenApply(
                        ignored ->
                                futures.stream()
                                        .map(
                                                CompletableFuture::join)
                                        .toList());
```

O `join` ocorre depois de todas as futures concluírem.

Ainda assim, falhas individuais precisam ser tratadas.

---

### 22. Usar `anyOf`

```java
CompletableFuture<Object> first =
        CompletableFuture.anyOf(
                primary(),
                secondary());
```

`anyOf` retorna `Object`.

O contrato precisa validar o tipo.

Além disso, as futures perdedoras não são canceladas automaticamente.

---

### 23. Cancelar perdedoras quando apropriado

Depois de obter o primeiro resultado, avalie:

- se as demais operações ainda são úteis;
- se podem ser canceladas;
- se o cancelamento é seguro;
- se o downstream suporta cancelamento;
- se existem efeitos parciais.

Não cancele cegamente operações de escrita.

---

### 24. Criar policy de timeout

Arquivo:

```text
completable-future-timeout-policy.yaml
```

Conteúdo:

```yaml
timeout:
  journey:
    required

  stage:
    deriveFrom:
      remaining-budget

  orTimeout:
    useFor:
      exceptional-timeout

  completeOnTimeout:
    useFor:
      explicit-fallback-value

  timeoutDoesNotGuaranteeUnderlyingCancellation:
    true

  blockingJoinWithoutBudget:
    forbidden
```

---

### 25. Usar `orTimeout`

```java
CompletableFuture<OrderSnapshot> timed =
        orderFuture.orTimeout(
                300,
                TimeUnit.MILLISECONDS);
```

Se o prazo expirar, a future completa excepcionalmente.

A operação subjacente pode continuar.

---

### 26. Usar `completeOnTimeout`

```java
CompletableFuture<PolicySnapshot> withFallback =
        policyFuture.completeOnTimeout(
                PolicySnapshot.defaultPolicy(),
                200,
                TimeUnit.MILLISECONDS);
```

Use apenas quando o fallback é válido para o negócio.

Não transforme timeout em sucesso silencioso sem métrica.

---

### 27. Criar utilitário de timeout

```java
public final class CompletableFutureTimeouts {

    public <T> CompletableFuture<T>
    failAfter(
            CompletableFuture<T> future,
            Duration timeout) {

        return future.orTimeout(
                timeout.toMillis(),
                TimeUnit.MILLISECONDS);
    }
}
```

O timeout precisa respeitar o budget restante da jornada.

---

### 28. Criar policy de falhas

Arquivo:

```text
completable-future-exception-policy.yaml
```

Conteúdo:

```yaml
exceptions:
  exceptionally:
    useFor:
      fallback-value

  handle:
    useFor:
      value-or-error-transformation

  whenComplete:
    useFor:
      observation-and-cleanup

  terminalStage:
    observed:
      required

  CompletionException:
    unwrap:
      required

  failureToSuccess:
    metric:
      required
```

---

### 29. Usar `exceptionally`

```java
CompletableFuture<PolicySnapshot> resilient =
        policyFuture.exceptionally(
                throwable ->
                        PolicySnapshot.defaultPolicy());
```

A falha vira valor.

Essa decisão precisa ser visível em métricas.

---

### 30. Usar `handle`

```java
CompletableFuture<String> category =
        orderFuture.handle(
                (order, throwable) -> {
                    if (throwable != null) {
                        return "FAILED";
                    }

                    return order.status();
                });
```

`handle` sempre produz um novo resultado.

---

### 31. Usar `whenComplete`

```java
CompletableFuture<OrderSnapshot> observed =
        orderFuture.whenComplete(
                (value, throwable) -> {
                    if (throwable == null) {
                        recordSuccess();
                    } else {
                        recordFailure(
                                unwrap(throwable));
                    }
                });
```

`whenComplete` é adequado para observação e cleanup.

Ele não deve esconder a falha original.

---

### 32. Desembrulhar falhas

Falhas podem aparecer em:

```text
CompletionException;

ExecutionException.
```

Crie:

```java
Throwable unwrap(
        Throwable throwable) {

    Throwable current =
            throwable;

    while (current.getCause() != null
            && (current
                    instanceof CompletionException
                || current
                    instanceof ExecutionException)) {

        current =
                current.getCause();
    }

    return current;
}
```

---

### 33. Diferenciar `join` e `get`

`join()`:

- não exige checked exception;
- lança `CompletionException`;
- pode bloquear;
- não possui timeout próprio.

`get()`:

- lança checked exceptions;
- pode usar versão com timeout;
- lança `ExecutionException`;
- pode lançar `TimeoutException`.

No caminho crítico, prefira uma estratégia de timeout antes do bloqueio terminal.

---

### 34. Criar policy de cancelamento

Arquivo:

```text
completable-future-cancellation-policy.yaml
```

Conteúdo:

```yaml
cancellation:
  terminalFuture:
    mayBeCancelled:
      true

  dependency:
    propagation:
      explicit:
        required

  underlyingTask:
    cancellation:
      notGuaranteedByCompletableFuture:
        true

  partialEffects:
    contract:
      required

  cancelAfterTimeout:
    evaluate:
      required
```

---

### 35. Testar cancelamento

```java
CompletableFuture<String> future =
        new CompletableFuture<>();

boolean cancelled =
        future.cancel(true);

assertTrue(cancelled);
assertTrue(future.isCancelled());
assertTrue(future.isDone());
```

Isso cancela a future.

Não conclua automaticamente que uma task externa foi interrompida.

---

### 36. Ligar Future clássico à `CompletableFuture`

Quando você controla um `Future` clássico, pode guardar a referência e solicitar cancelamento explícito.

O contrato precisa definir:

- qual operação será cancelada;
- quem possui a referência;
- quando cancelar;
- como observar interrupção;
- como limpar efeitos parciais.

---

### 37. Criar policy de contexto

Arquivo:

```text
completable-future-context-policy.yaml
```

Conteúdo:

```yaml
context:
  captureAtSubmission:
    required

  propagate:
    - correlation-category
    - deadline
    - tenant-scope-when-safe

  ThreadLocal:
    implicitPropagation:
      false

  cleanup:
    finally:
      required

  sensitiveData:
    forbidden
```

---

### 38. Criar contexto

```java
public record AsyncContext(
        String correlationCategory,
        Instant deadline) {
}
```

---

### 39. Criar executor context-aware

```java
public final class ContextAwareExecutor
        implements Executor {

    private final Executor delegate;
    private final ThreadLocal<AsyncContext>
            holder;

    public ContextAwareExecutor(
            Executor delegate,
            ThreadLocal<AsyncContext> holder) {
        this.delegate = delegate;
        this.holder = holder;
    }

    @Override
    public void execute(
            Runnable command) {

        AsyncContext captured =
                holder.get();

        delegate.execute(
                () -> {
                    try {
                        holder.set(captured);
                        command.run();
                    } finally {
                        holder.remove();
                    }
                });
    }
}
```

Workers reutilizados exigem cleanup.

---

### 40. Validar contexto

Teste:

1. defina contexto A;
2. submeta pipeline;
3. registre categoria;
4. conclua;
5. remova contexto do chamador;
6. execute pipeline B;
7. confirme ausência de contexto A;
8. finalize executor.

---

### 41. Criar policy de observabilidade

Arquivo:

```text
completable-future-observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  flow:
    required:
      - started
      - completed
      - failed
      - timed-out
      - cancelled

  stage:
    required:
      - stage-name
      - executor-category
      - wait-time
      - execution-time
      - outcome

  pool:
    correlate:
      - active
      - queue
      - rejected

  trace:
    contextPropagation:
      required

  labels:
    forbidden:
      - order-id
      - customer-id
      - raw-exception-message
```

---

### 42. Medir por estágio

Registre:

- submissão;
- início;
- conclusão;
- duração;
- executor;
- thread category;
- timeout;
- fallback;
- falha;
- cancelamento.

Não use a própria future como label.

---

### 43. Observar common pool

Crie um exemplo isolado:

```java
CompletableFuture<String> future =
        CompletableFuture.supplyAsync(
                () ->
                        Thread.currentThread()
                                .getName());
```

Registre o nome da thread.

Depois, substitua por executor explícito.

O objetivo é demonstrar a diferença, não aprovar o common pool para trabalho crítico.

---

### 44. Criar policy de shutdown

Arquivo:

```text
completable-future-shutdown-policy.yaml
```

Conteúdo:

```yaml
shutdown:
  stopNewFlows:
    required

  awaitCriticalTerminalStages:
    bounded:
      required

  executor:
    shutdown:
      required

  timeout:
    required

  pendingStage:
    record:
      required

  forcedCancellation:
    explicit:
      required

  threadLeak:
    forbidden
```

---

### 45. Criar fluxo principal

```java
public final class CompletableOrderFlow {

    public CompletableFuture<OrderDecision>
    execute(
            OrderAsyncSource source,
            Executor orderExecutor,
            Executor customerExecutor,
            Executor policyExecutor) {

        CompletableFuture<OrderSnapshot> order =
                CompletableFuture.supplyAsync(
                        source::loadOrder,
                        orderExecutor)
                        .orTimeout(
                                300,
                                TimeUnit.MILLISECONDS);

        CompletableFuture<CustomerSnapshot> customer =
                CompletableFuture.supplyAsync(
                        source::loadCustomer,
                        customerExecutor)
                        .orTimeout(
                                300,
                                TimeUnit.MILLISECONDS);

        CompletableFuture<OrderDecision> base =
                order.thenCombine(
                        customer,
                        OrderDecision::from);

        return base.thenCompose(
                        decision ->
                                CompletableFuture
                                        .supplyAsync(
                                                source::loadPolicy,
                                                policyExecutor)
                                        .thenApply(
                                                decision::withPolicy))
                .orTimeout(
                        800,
                        TimeUnit.MILLISECONDS);
    }
}
```

O timeout total precisa ser coerente com os timeouts dos estágios.

---

### 46. Evitar soma incoerente de timeouts

Exemplo ruim:

```text
endpoint:
500 ms.

order:
500 ms.

customer:
500 ms.

policy:
500 ms.
```

O fluxo pode ultrapassar o budget.

Defina:

- deadline;
- budget restante;
- timeout por dependência;
- margem;
- fallback.

---

### 47. Criar cenário de falha parcial

Exemplo:

- order sucesso;
- customer sucesso;
- policy timeout;
- fallback permitido.

Valide:

- decisão usa policy padrão;
- métrica de fallback aumenta;
- timeout é registrado;
- causa não aparece como segredo;
- pool não fica saturado;
- executor termina.

---

### 48. Criar cenário de falha crítica

Exemplo:

- order falha;
- fluxo inteiro falha;
- customer pode já estar em execução;
- terminal future registra falha;
- nenhuma auditoria de sucesso ocorre;
- executors são encerrados no laboratório.

---

### 49. Criar scenarios

Arquivo:

```text
completable-future-scenarios.yaml
```

Cenários:

```text
runAsync-success;

runAsync-failure;

supplyAsync-success;

supplyAsync-failure;

thenApply-transform;

thenCompose-async-dependency;

thenCombine-independent-results;

allOf-success;

allOf-one-failure;

anyOf-first-success;

anyOf-first-failure;

stage-timeout;

journey-timeout;

complete-on-timeout;

exceptionally-fallback;

handle-value;

handle-failure;

whenComplete-observation;

terminal-cancellation;

context-propagation;

context-cleanup;

common-pool-observation;

explicit-executor;

executor-rejection;

graceful-shutdown;

zero-task-leak;

zero-thread-leak.
```

Cada cenário registra:

- flow;
- stage;
- executor;
- timeout;
- outcome;
- fallback;
- cancellation;
- context;
- shutdown;
- result;
- evidence.

---

### 50. Criar failure policy

Arquivo:

```text
completable-future-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  ignoredTerminalFuture:
    action:
      fail-review

  implicitCommonPool:
    action:
      reject-critical-flow

  nestedFuture:
    action:
      replace-with-thenCompose

  timeoutWithoutPolicy:
    action:
      fail-review

  fallbackWithoutMetric:
    action:
      fail-gate

  contextLeak:
    action:
      fail-gate

  executorLeak:
    action:
      fail-gate

  virtualThread:
    deferredToLesson591
```

---

### 51. Criar data quality policy

Arquivo:

```text
completable-future-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  missingStageName:
    action:
      reject

  missingExecutor:
    result:
      limited

  timingOnlyAssertion:
    result:
      fragile

  unknownTerminalOutcome:
    action:
      fail

  singleRun:
    result:
      limited

  missingPoolMetrics:
    result:
      inconclusive
```

---

### 52. Criar security policy

Arquivo:

```text
completable-future-security-policy.yaml
```

Conteúdo:

```yaml
security:
  context:
    credential:
      forbidden

  stageName:
    identifier:
      forbidden

  failureLog:
    rawPayload:
      forbidden

  threadDump:
    repository:
      forbidden

  evidence:
    businessIdentifier:
      forbidden
```

---

### 53. Criar baseline report

Arquivo:

```text
completable-future-baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  flow:
    ORDER-DECISION

  stages:
    total:
      5

  executors:
    explicit:
      true

  timeout:
    journey:
      configured

  metrics:
    completed:
      all

    failed:
      zero

    fallback:
      zero

  shutdown:
    executorsTerminated:
      true

  result:
    PASS
```

---

### 54. Criar matriz de testes

Arquivo:

```text
COMPLETABLE_FUTURE_TEST_MATRIX.md
```

Cenários:

- runAsync;
- supplyAsync;
- explicit executor;
- common pool observation;
- thenApply;
- thenApplyAsync;
- thenCompose;
- thenCombine;
- allOf;
- anyOf;
- exceptionally;
- handle;
- whenComplete;
- orTimeout;
- completeOnTimeout;
- join;
- get;
- CompletionException;
- cancellation;
- context capture;
- context cleanup;
- executor rejection;
- shutdown;
- zero task leak;
- zero thread leak;
- security;
- evidence.

---

### 55. Criar troubleshooting

Arquivo:

```text
COMPLETABLE_FUTURE_TROUBLESHOOTING.md
```

Inclua:

- pipeline usa common pool;
- `thenApply` bloqueia worker;
- future ficou aninhada;
- `allOf` não retorna valores;
- `anyOf` retorna `Object`;
- timeout ocorreu, mas operação continua;
- fallback esconde erro;
- `join` bloqueia;
- `CompletionException` mascara causa;
- contexto desaparece;
- contexto vaza;
- executor rejeita estágio;
- pipeline não termina;
- terminal future não é observada;
- shutdown deixa workers vivos;
- virtual thread antecipada.

---

### 56. Criar gate

O gate valida:

- contrato;
- catálogo;
- executors explícitos;
- composição correta;
- ausência de nested future;
- timeouts;
- falhas;
- fallback;
- cancelamento;
- contexto;
- métricas;
- shutdown;
- zero task leaks;
- zero thread leaks;
- segurança.

Status:

```text
PASS;

FAIL_COMMON_POOL;

FAIL_NESTED_FUTURE;

FAIL_TIMEOUT;

FAIL_HIDDEN_FAILURE;

FAIL_CONTEXT_LEAK;

FAIL_EXECUTOR_REJECTION;

FAIL_SHUTDOWN;

FAIL_TASK_LEAK;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 57. Coletar evidence

Script:

```text
collect-completable-future-evidence.ps1
```

Arquivo:

```text
completable-future-evidence.yaml.
```

Campos permitidos:

- lesson;
- environment;
- service;
- release;
- flow category;
- stage category;
- executor status;
- composition status;
- timeout status;
- exception status;
- fallback status;
- cancellation status;
- context status;
- observability status;
- shutdown status;
- task leak status;
- thread leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- order ID;
- customer ID;
- token;
- payload;
- stack bruto;
- exception message sensível;
- thread dump bruto;
- virtual thread;
- material da aula 591.

---

### 58. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\concurrency\completable-future\validate-completable-future-contract.ps1

.\scripts\concurrency\completable-future\validate-completable-future-stage-catalog.ps1

.\scripts\concurrency\completable-future\run-completable-future-baseline.ps1

.\scripts\concurrency\completable-future\validate-completable-future-composition.ps1

.\scripts\concurrency\completable-future\validate-completable-future-timeouts.ps1

.\scripts\concurrency\completable-future\validate-completable-future-failures.ps1

.\scripts\concurrency\completable-future\validate-completable-future-cancellation.ps1

.\scripts\concurrency\completable-future\validate-completable-future-context.ps1

.\scripts\concurrency\completable-future\validate-completable-future-observability.ps1

.\scripts\concurrency\completable-future\validate-completable-future-shutdown.ps1

.\scripts\concurrency\completable-future\collect-completable-future-thread-dump.ps1

.\scripts\concurrency\completable-future\scan-completable-future-output.ps1

.\scripts\concurrency\completable-future\collect-completable-future-evidence.ps1

.\scripts\concurrency\completable-future\verify-completable-future-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- contrato aprovado;
- catálogo aprovado;
- executors explícitos;
- `runAsync` e `supplyAsync` diferenciados;
- `thenApply` e `thenCompose` diferenciados;
- `thenCombine` aprovado;
- `allOf` e `anyOf` aprovados;
- timeouts aprovados;
- falhas observadas;
- fallback medido;
- cancelamento validado;
- contexto propagado e limpo;
- métricas aprovadas;
- shutdown aprovado;
- zero task leaks;
- zero thread leaks;
- segurança aprovada;
- evidence sanitizada;
- virtual threads não antecipadas.

---

### 59. Encerrar o laboratório

Confirme:

- terminal futures concluídas;
- nenhum estágio pendente;
- nenhum executor aceitando nova task;
- todos os executors terminados;
- nenhuma fila residual;
- nenhum contexto residual;
- nenhum dump bruto no Git;
- relatórios sanitizados;
- baseline preservada.

Remova:

```powershell
Remove-Item `
  .tmp/completable-future `
  -Recurse `
  -Force
```

Preserve relatórios sanitizados.

---

## Entendendo o que foi feito

### Future ganhou composição

Resultados passaram a formar pipelines em vez de chamadas manuais de `get`.

### Executor ganhou explicitude

Estágios críticos deixaram de cair acidentalmente no common pool.

### `thenApply` ganhou transformação

Transformação síncrona ficou separada de dependência assíncrona.

### `thenCompose` ganhou encadeamento

Futures aninhadas foram evitadas.

### `thenCombine` ganhou fan-in

Resultados independentes passaram a ser combinados.

### `allOf` e `anyOf` ganharam contrato

Conclusão conjunta e primeira conclusão passaram a ter tratamento explícito de valores e cancelamento.

### Timeout ganhou jornada

Prazos deixaram de ser valores isolados e passaram a respeitar o budget restante.

### Falha ganhou semântica

`exceptionally`, `handle` e `whenComplete` receberam papéis diferentes.

### Contexto ganhou limpeza

Workers reutilizados deixaram de transportar contexto residual.

### Shutdown ganhou término

Pipelines críticos e executors passaram a encerrar sem task leak.

### A próxima aula ganhou fronteira

A aula 591 irá aplicar virtual threads a workloads bloqueantes.

---

## Erros comuns importantes

### Usar common pool sem perceber

Estágios críticos passam a competir com trabalho não relacionado.

### Usar `thenApply` para chamada bloqueante longa

A thread de conclusão pode ficar presa.

### Criar future aninhada

Use `thenCompose` para dependência assíncrona.

### Achar que `allOf` retorna valores

Ele retorna `CompletableFuture<Void>`.

### Achar que `anyOf` cancela perdedoras

As outras operações continuam.

### Usar fallback sem métrica

Uma dependência degradada pode parecer saudável.

### Achar que timeout cancela operação subjacente

O trabalho pode continuar.

### Usar `join` sem budget

O chamador pode bloquear indefinidamente.

### Esquecer terminal future

Falhas e conclusão podem ficar invisíveis.

### Encerrar aplicação sem fechar executors

Workers podem permanecer vivos.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\concurrency\completable-future\run-completable-future-baseline.ps1
```

### Validar composição

```powershell
.\scripts\concurrency\completable-future\validate-completable-future-composition.ps1
```

### Validar timeouts

```powershell
.\scripts\concurrency\completable-future\validate-completable-future-timeouts.ps1
```

### Validar contexto

```powershell
.\scripts\concurrency\completable-future\validate-completable-future-context.ps1
```

### Validar shutdown

```powershell
.\scripts\concurrency\completable-future\validate-completable-future-shutdown.ps1
```

---

## Exercício guiado

### Parte 1 — Contract

Defina flow, stages, executors e budgets.

### Parte 2 — Async creation

Compare `runAsync` e `supplyAsync`.

### Parte 3 — Transformation

Implemente `thenApply`.

### Parte 4 — Chaining

Implemente `thenCompose`.

### Parte 5 — Combination

Implemente `thenCombine`, `allOf` e `anyOf`.

### Parte 6 — Timeout

Valide `orTimeout` e `completeOnTimeout`.

### Parte 7 — Failure

Compare `exceptionally`, `handle` e `whenComplete`.

### Parte 8 — Context

Propague e limpe contexto.

### Parte 9 — Shutdown

Finalize terminal futures e executors.

### Parte 10 — Gate

Valide leaks, segurança e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 589 e ponte para a aula 591 foram preservadas;
- `CompletableFuture`, completion stage, `runAsync`, `supplyAsync`, `thenApply`, `thenCompose`, `thenCombine`, `allOf`, `anyOf`, `exceptionally`, `handle`, `whenComplete`, `orTimeout`, `completeOnTimeout`, completion executor, common pool, fan-out e fan-in foram definidos;
- contrato e catálogo de estágios foram criados;
- executors explícitos e bounded foram usados em estágios críticos;
- common pool foi observado apenas como exemplo isolado;
- `runAsync` e `supplyAsync` foram diferenciados;
- `thenApply` foi usado para transformação;
- `thenCompose` foi usado para dependência assíncrona;
- futures aninhadas foram proibidas;
- `thenCombine` combinou operações independentes;
- `allOf` coletou resultados individuais;
- `anyOf` validou tipo e não presumiu cancelamento;
- fan-out foi limitado pelos executors;
- timeouts de estágio respeitam o budget da jornada;
- `orTimeout` e `completeOnTimeout` foram diferenciados;
- timeout não foi confundido com cancelamento da operação subjacente;
- `exceptionally`, `handle` e `whenComplete` foram diferenciados;
- `CompletionException` e `ExecutionException` foram desembrulhadas;
- `join` e `get` foram comparados;
- cancelamento foi tratado como contrato explícito;
- contexto foi capturado, propagado e removido;
- métricas por flow, stage, executor, timeout, fallback e falha foram criadas;
- rejeição do executor foi tratada;
- shutdown bloqueia novos flows, aguarda terminais e encerra executors;
- policies de qualidade, segurança e failure foram criadas;
- cenários, matriz, troubleshooting, gate e evidence sanitizada estão presentes;
- zero task leaks e zero thread leaks foram validados;
- nenhum segredo, payload, dump bruto ou identificador real foi commitado;
- virtual threads não foram implementadas;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/concurrency/completable-future `
  scripts/concurrency/completable-future `
  docs/concurrency/completable-future `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerId|orderId|rawThreadDump|businessPayload|Thread\.ofVirtual|startVirtualThread|newVirtualThreadPerTaskExecutor|StructuredTaskScope"
```

Commit recomendado:

```powershell
git commit -m "docs(m18): estruturar CompletableFuture"
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
- dumps brutos;
- artifacts temporários;
- virtual threads;
- structured concurrency;
- material da aula 591.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você evoluiu de `Future` clássico para composição assíncrona declarativa.

Você trabalhou com:

```text
runAsync;

supplyAsync;

thenApply;

thenCompose;

thenCombine;

allOf;

anyOf;

exceptionally;

handle;

whenComplete;

timeouts;

cancelamento;

contexto;

observabilidade;

shutdown.
```

Você comprovou que composição assíncrona precisa de executors explícitos; `thenApply` transforma, `thenCompose` encadeia e `thenCombine` combina; `allOf` não devolve automaticamente valores; `anyOf` não cancela perdedoras; timeouts não garantem cancelamento do trabalho subjacente; fallback precisa ser medido; terminal futures precisam ser observadas; contexto precisa ser limpo; e executors precisam terminar sem task ou thread leak.

A próxima aula será:

```text
591 - M18.36 - Virtual threads
```

Nela, você irá criar virtual threads, comparar platform e virtual threads, aplicar thread-per-task a workloads bloqueantes, analisar pinning, carrier threads, limites downstream, ThreadLocal, observabilidade, cancelamento e shutdown.

Nenhum `Thread.ofVirtual`, `Thread.startVirtualThread`, `Executors.newVirtualThreadPerTaskExecutor`, carrier thread, pinning, structured concurrency ou execução com virtual threads foi implementado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei executors explícitos.
- [ ] Diferenciei `runAsync` e `supplyAsync`.
- [ ] Usei `thenApply`.
- [ ] Usei `thenCompose`.
- [ ] Usei `thenCombine`.
- [ ] Validei `allOf` e `anyOf`.
- [ ] Tratei timeout e falhas.
- [ ] Encerrei sem leaks.

---

## Troubleshooting adicional

### O estágio usa `ForkJoinPool.commonPool-worker`

Um método assíncrono foi chamado sem executor explícito.

### O pipeline ficou com `CompletableFuture<CompletableFuture<T>>`

Use `thenCompose`.

### `allOf` conclui, mas não tenho valores

Colete cada future depois da conclusão conjunta.

### `anyOf` retorna tipo inesperado

Valide o contrato dos estágios e converta com segurança.

### Timeout ocorreu, mas o downstream continua ativo

Timeout da completion não garante cancelamento da operação.

### `exceptionally` mascara indisponibilidade

Registre fallback e causa categorizada.

### Contexto de outro fluxo apareceu

Remova `ThreadLocal` e MDC em `finally`.

### O fluxo nunca termina

Procure estágio pendente, executor saturado, bloqueio ou terminal não observado.

### A aplicação não encerra

Algum executor usado pelo pipeline não foi finalizado.

### Surgiu `Thread.ofVirtual`

Preserve a implementação para a aula 591.

---

## Perguntas de revisão

1. O que é `CompletableFuture`?
2. Qual diferença entre `runAsync` e `supplyAsync`?
3. O que faz `thenApply`?
4. O que faz `thenCompose`?
5. O que faz `thenCombine`?
6. O que faz `allOf`?
7. O que faz `anyOf`?
8. O que faz `exceptionally`?
9. O que faz `handle`?
10. O que faz `whenComplete`?
11. O que faz `orTimeout`?
12. O que faz `completeOnTimeout`?
13. Por que usar executor explícito?
14. Qual risco do common pool?
15. Timeout cancela automaticamente a operação?
16. Qual diferença entre `join` e `get`?
17. Como evitar context leak?
18. Como encerrar o flow?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Estágio futuro componível.
2. Ação sem valor versus supplier com valor.
3. Transforma resultado.
4. Encadeia nova operação assíncrona.
5. Combina dois resultados.
6. Aguarda todos.
7. Aguarda qualquer um.
8. Produz fallback para falha.
9. Transforma valor ou erro.
10. Observa conclusão.
11. Falha por timeout.
12. Produz valor alternativo.
13. Isolar capacidade e observar saturação.
14. Competição com trabalho não relacionado.
15. Não.
16. Exceções checked e timeout versus CompletionException.
17. Capturar, propagar e remover.
18. Observar terminal e encerrar executor.
19. Virtual threads.
20. Virtual threads.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 590 - M18.35 - CompletableFuture

- Continuei após ExecutorService pools.
- Entendi `CompletableFuture` como estágio futuro componível.
- Criei contrato e catálogo de estágios.
- Usei executors explícitos e bounded.
- Observei o risco do common pool.
- Diferenciei `runAsync` e `supplyAsync`.
- Usei `thenApply` para transformação.
- Usei `thenCompose` para dependência assíncrona.
- Evitei futures aninhadas.
- Usei `thenCombine` para resultados independentes.
- Modelei fan-out e fan-in.
- Validei `allOf` e coleta de resultados.
- Validei `anyOf` e futures perdedoras.
- Apliquei `orTimeout` e `completeOnTimeout`.
- Diferenciei timeout e cancelamento.
- Usei `exceptionally`, `handle` e `whenComplete`.
- Desembrulhei `CompletionException` e `ExecutionException`.
- Diferenciei `join` e `get`.
- Propaguei e limpei contexto.
- Criei métricas por flow e stage.
- Tratei rejection do executor.
- Encerrei flows e executors sem leaks.
- Coletei evidence sanitizada.
- Não antecipei virtual threads.
- Próxima aula: Virtual threads.
```

---

## Referência técnica curta

- Java `CompletableFuture`.
- Completion stages.
- Async executors.
- Future composition.
- `thenApply` and `thenCompose`.
- `thenCombine`.
- `allOf` and `anyOf`.
- Exception handling.
- Timeout handling.
- Context propagation.

Regra final:

```text
CompletableFuture precisa transformar tarefas assíncronas em pipelines explícitos, não esconder capacidade ou bloqueio: todo estágio crítico possui nome, owner, executor bounded, timeout, política de falha, cancelamento, contexto, métricas e shutdown, enquanto o common pool fica restrito a exemplos isolados ou trabalho não crítico; runAsync representa ação sem valor, supplyAsync produz resultado, thenApply transforma, thenCompose encadeia sem criar future aninhada e thenCombine combina resultados independentes, enquanto allOf exige coleta explícita e anyOf não cancela as operações perdedoras; orTimeout e completeOnTimeout respeitam o budget da jornada, mas não garantem cancelamento do trabalho subjacente, fallback é medido, CompletionException é desembrulhada, contexto é removido em finally, terminal futures são observadas e todos os executors terminam com zero task leaks e zero thread leaks; virtual threads, carrier threads, pinning e thread-per-task ficam para a aula 591.
```
