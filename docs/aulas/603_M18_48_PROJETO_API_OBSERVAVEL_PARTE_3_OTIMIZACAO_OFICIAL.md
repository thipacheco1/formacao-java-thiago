# 603 - M18.48 - Projeto API observavel parte 3 otimizacao

## Apresentação da aula

Nas aulas 601 e 602, você construiu e integrou a API `observable-orders-api`.

Na parte 1, a aplicação ganhou:

```text
domínio sintético;

migrations PostgreSQL;

endpoints;

tratamento de erros;

request ID;

correlation ID;

logs estruturados;

métricas;

health;

liveness;

readiness;

graceful shutdown.
```

Na parte 2, ela ganhou:

```text
OpenTelemetry;

spans;

propagação W3C;

correlação entre logs e traces;

Prometheus;

Grafana;

dashboards;

SLIs;

SLOs;

error budget;

burn-rate alerts;

degradação controlada;

runbook;

game day.
```

Agora a aplicação possui sinais suficientes para responder:

```text
onde está a latência?

qual etapa consome CPU?

qual operação aloca mais?

o pool está saturado?

a query está lenta?

a fila está próxima do limite?

o erro apareceu depois de qual release?

o gargalo está no código,
no banco,
na concorrência
ou na capacidade?
```

Nesta terceira parte, você irá usar esses sinais para otimizar o sistema.

A pergunta central será:

```text
como melhorar
desempenho e capacidade

sem adivinhar,
sem quebrar contratos
e sem trocar
um gargalo por outro?
```

Uma otimização válida precisa de quatro elementos:

```text
baseline;

hipótese;

mudança isolada;

regressão before/after.
```

Sem baseline, não existe comparação.

Sem hipótese, a mudança vira tentativa aleatória.

Sem isolamento, não é possível atribuir o resultado.

Sem regressão, não existe prova de melhoria.

Você não irá aplicar dezenas de mudanças de uma vez.

O projeto trabalhará com um ciclo:

```text
medir;

identificar;

priorizar;

alterar;

repetir a carga;

comparar;

aceitar ou reverter.
```

A otimização será bounded.

Isso significa que cada mudança terá:

- problema observado;
- evidência;
- owner;
- objetivo;
- risco;
- escopo;
- condição de sucesso;
- condição de rollback;
- comparação funcional;
- comparação operacional.

Os principais eixos serão:

- latência HTTP;
- throughput;
- CPU por operação;
- allocation rate;
- live set;
- garbage collection;
- serialização;
- logging;
- query count;
- query plan;
- pool acquisition;
- filas;
- concorrência;
- virtual threads;
- locks;
- backpressure;
- timeouts;
- shutdown.

Nem todos receberão mudança.

O primeiro trabalho será descobrir quais gargalos realmente existem na baseline.

A regra será:

```text
não otimizar
o que não está
limitando o sistema.
```

Exemplo:

```text
CPU:
35%.

p99:
2 segundos.

repository span:
1,8 segundo.

Hikari pending:
alto.
```

O problema não parece ser o algoritmo Java local.

Outro exemplo:

```text
repository:
40 ms.

serialization:
600 ms.

CPU:
95%.

allocation:
alta.
```

Nesse caso, banco e pool não são o primeiro alvo.

Nesta aula, você também irá evitar otimizações perigosas:

- remover validações;
- remover logs necessários;
- aumentar pool sem medir banco;
- aumentar heap como solução;
- trocar collector sem diagnóstico;
- criar cache ilimitado;
- usar paralelismo sem limite;
- remover locks sem preservar invariantes;
- esconder erro do SLI;
- reduzir timeout apenas para melhorar gráfico;
- diminuir sampling até perder diagnóstico;
- aceitar perda silenciosa;
- aumentar fila indefinidamente.

A próxima aula oficial será:

```text
604 - M18.49 - Revisao producao parte 1
```

Por isso, esta aula irá fechar o projeto prático, mas não irá iniciar a revisão técnica sistemática do módulo.

A aula 604 será responsável por revisar os fundamentos e decisões de produção.

A regra central desta aula será:

```text
uma otimização
só é aprovada

quando melhora
o objetivo medido,

preserva correção,
não degrada outro SLO
e continua observável.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
601:
Projeto API observavel parte 1.

602:
Projeto API observavel parte 2.

603:
Projeto API observavel parte 3 otimizacao.

604:
Revisao producao parte 1.

605:
Revisao producao parte 2.
```

A progressão do projeto foi:

```text
parte 1:
fundação.

parte 2:
correlação operacional.

parte 3:
otimização orientada por evidência.
```

Nesta aula:

```text
baseline de carga:
sim.

profiling:
sim.

JFR:
sim.

CPU:
sim.

allocation:
sim.

GC:
sim.

query plan:
sim.

pool:
sim.

serialização:
sim.

logging:
sim.

fila:
sim.

concorrência:
sim.

before/after:
sim.

rollback de otimização:
sim.

revisão geral do módulo:
não.
```

Você continuará trabalhando em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api
```

A baseline funcional e operacional das partes 1 e 2 precisa permanecer aprovada.

---

## Objetivo prático

A estrutura será ampliada com:

```text
projects/observable-orders-api
├── contracts
│   ├── observable-api-optimization-contract.yaml
│   ├── observable-api-baseline-policy.yaml
│   ├── observable-api-load-policy.yaml
│   ├── observable-api-profiling-policy.yaml
│   ├── observable-api-database-optimization-policy.yaml
│   ├── observable-api-pool-optimization-policy.yaml
│   ├── observable-api-serialization-policy.yaml
│   ├── observable-api-logging-optimization-policy.yaml
│   ├── observable-api-concurrency-optimization-policy.yaml
│   ├── observable-api-memory-optimization-policy.yaml
│   ├── observable-api-regression-policy.yaml
│   ├── observable-api-rollback-policy.yaml
│   ├── observable-api-part3-security-policy.yaml
│   ├── observable-api-part3-data-quality-policy.yaml
│   ├── observable-api-part3-failure-policy.yaml
│   ├── observable-api-part3-scenarios.yaml
│   └── observable-api-part3-evidence.yaml
├── src/main/java/br/com/formacao/observableorders
│   ├── performance
│   │   ├── OptimizationCandidate.java
│   │   ├── OptimizationCategory.java
│   │   ├── OptimizationDecision.java
│   │   ├── OptimizationResult.java
│   │   ├── BaselineSnapshot.java
│   │   ├── LoadProfile.java
│   │   ├── PerformanceBudget.java
│   │   ├── CpuPerOperation.java
│   │   ├── AllocationSnapshot.java
│   │   ├── RepositoryBatchLoader.java
│   │   ├── OrderProjectionRepository.java
│   │   ├── OptimizedOrderMapper.java
│   │   ├── LoggingSampler.java
│   │   ├── BoundedEventDrainer.java
│   │   ├── ConcurrencyLimit.java
│   │   └── OptimizationGate.java
│   └── operations
│       ├── OptimizationRunbookService.java
│       └── OptimizationRollbackService.java
├── src/test/java/br/com/formacao/observableorders
│   ├── BaselineContractTest.java
│   ├── LoadProfileTest.java
│   ├── QueryCountRegressionTest.java
│   ├── RepositoryProjectionTest.java
│   ├── SerializationRegressionTest.java
│   ├── LoggingVolumeRegressionTest.java
│   ├── QueueCapacityRegressionTest.java
│   ├── ConcurrencyLimitTest.java
│   ├── CpuPerOperationTest.java
│   ├── AllocationRegressionTest.java
│   ├── PerformanceBudgetTest.java
│   ├── OptimizationRollbackTest.java
│   └── ObservableApiPart3GateTest.java
├── reports
│   ├── optimization-baseline-report.yaml
│   ├── optimization-load-report.yaml
│   ├── optimization-CPU-report.yaml
│   ├── optimization-memory-report.yaml
│   ├── optimization-database-report.yaml
│   ├── optimization-serialization-report.yaml
│   ├── optimization-logging-report.yaml
│   ├── optimization-concurrency-report.yaml
│   ├── optimization-before-after-report.yaml
│   └── observable-api-part3-gate-report.yaml
└── docs
    ├── OPTIMIZATION_STRATEGY.md
    ├── LOAD_PROFILE.md
    ├── BASELINE_AND_BUDGETS.md
    ├── CPU_AND_ALLOCATION_ANALYSIS.md
    ├── DATABASE_OPTIMIZATION.md
    ├── SERIALIZATION_AND_LOGGING.md
    ├── CONCURRENCY_AND_BACKPRESSURE.md
    ├── BEFORE_AFTER_ANALYSIS.md
    ├── OPTIMIZATION_ROLLBACK.md
    ├── OBSERVABLE_API_PART3_TEST_MATRIX.md
    └── OBSERVABLE_API_PART3_TROUBLESHOOTING.md
```

Scripts adicionais:

```text
scripts/projects/observable-orders-api
├── validate-optimization-contract.ps1
├── prepare-optimization-fixtures.ps1
├── run-optimization-baseline.ps1
├── run-steady-load.ps1
├── run-burst-load.ps1
├── run-read-heavy-load.ps1
├── run-write-heavy-load.ps1
├── collect-optimization-jfr.ps1
├── collect-optimization-thread-dumps.ps1
├── collect-optimization-histograms.ps1
├── collect-optimization-query-plans.ps1
├── analyze-optimization-hotspots.ps1
├── validate-database-optimization.ps1
├── validate-serialization-optimization.ps1
├── validate-logging-optimization.ps1
├── validate-concurrency-optimization.ps1
├── validate-memory-optimization.ps1
├── compare-optimization-before-after.ps1
├── validate-optimization-rollback.ps1
├── run-optimization-regression.ps1
├── collect-observable-api-part3-evidence.ps1
└── verify-observable-api-part3-baseline.ps1
```

Ao final, você terá um projeto medido, otimizado e comparado sem perder observabilidade ou correção.

---

## Conceito essencial

### Baseline

Estado medido antes da mudança.

---

### Performance budget

Limite operacional aprovado para um indicador.

---

### Bottleneck

Recurso ou etapa que limita o desempenho do fluxo.

---

### Throughput

Quantidade de operações concluídas por unidade de tempo.

---

### Latency

Tempo necessário para concluir uma operação.

---

### CPU per operation

Tempo de CPU dividido pela quantidade de operações concluídas.

---

### Allocation rate

Memória alocada por unidade de tempo.

---

### Live set

Objetos que permanecem vivos após coleta comparável.

---

### Regression

Piora mensurável em comportamento funcional ou operacional.

---

### Optimization candidate

Mudança proposta com problema, evidência, objetivo e risco explícitos.

---

### Before/after

Comparação controlada entre baseline e versão alterada.

---

### Rollback trigger

Condição objetiva que exige reversão da otimização.

---

### Local optimum

Melhoria de uma etapa que pode piorar o sistema completo.

---

## Mão na massa guiada

### 1. Validar as partes 1 e 2

Execute:

```powershell
.\scripts\projects\observable-orders-api\start-observable-api-dependencies.ps1

.\scripts\projects\observable-orders-api\start-observability-stack.ps1

.\scripts\projects\observable-orders-api\run-observable-api-tests.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-baseline.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part2-baseline.ps1

git status

git diff --check
```

Confirme:

- endpoints funcionais;
- logs correlacionados;
- traces completos;
- Prometheus coletando;
- dashboards provisionados;
- SLO calculável;
- alertas válidos;
- zero task leaks;
- zero connection leaks;
- modos de degradação resetados.

---

### 2. Criar contrato de otimização

Arquivo:

```text
contracts/observable-api-optimization-contract.yaml
```

Conteúdo:

```yaml
optimization:
  required:
    - baseline
    - workload
    - hypothesis
    - candidate
    - isolated-change
    - before-after
    - correctness
    - observability
    - rollback
    - regression

  approveOnlyWhen:
    - targetImproved
    - functionalTestsPass
    - noSLONegativeRegression
    - noResourceLeak
    - signalsPreserved

  multipleUnrelatedChanges:
    forbidden

  reviewLessons:
    beginAt:
      M18.49
```

---

### 3. Criar baseline policy

Arquivo:

```text
contracts/observable-api-baseline-policy.yaml
```

Conteúdo:

```yaml
baseline:
  fixed:
    - Java-version
    - JVM-flags
    - application-version
    - database-version
    - schema
    - dataset
    - statistics
    - CPU-limit
    - memory-limit
    - pool-size
    - workload
    - warmup
    - duration

  collect:
    - throughput
    - p50
    - p95
    - p99
    - error-rate
    - CPU
    - CPU-per-operation
    - allocation-rate
    - heap-after-GC
    - GC-time
    - query-count
    - query-latency
    - pool-acquisition
    - queue-utilization

  repeatedRuns:
    minimum:
      3
```

---

### 4. Criar load profiles

Arquivo:

```text
contracts/observable-api-load-policy.yaml
```

Perfis:

```yaml
load:
  steady:
    duration:
      10m
    concurrency:
      fixed

  burst:
    warmup:
      required
    burstDuration:
      bounded

  readHeavy:
    ratio:
      read:
        80
      write:
        20

  writeHeavy:
    ratio:
      read:
        20
      write:
        80

  invalidTraffic:
    separate:
      required

  generator:
    saturationCheck:
      required
```

---

### 5. Criar `LoadProfile`

```java
public record LoadProfile(
        String name,
        int concurrency,
        Duration warmup,
        Duration duration,
        int readPercentage,
        int writePercentage) {

    public LoadProfile {
        if (concurrency <= 0) {
            throw new IllegalArgumentException(
                    "Concurrency must be positive");
        }

        if (readPercentage
                + writePercentage
                != 100) {
            throw new IllegalArgumentException(
                    "Invalid ratio");
        }
    }
}
```

---

### 6. Executar baseline steady

Execute:

```powershell
.\scripts\projects\observable-orders-api\run-optimization-baseline.ps1

.\scripts\projects\observable-orders-api\run-steady-load.ps1
```

Colete três execuções equivalentes.

Registre:

- throughput;
- p50;
- p95;
- p99;
- error rate;
- CPU;
- heap after GC;
- allocation;
- query count;
- pool pending;
- queue utilization.

---

### 7. Criar baseline snapshot

```java
public record BaselineSnapshot(
        double throughput,
        Duration p50,
        Duration p95,
        Duration p99,
        double errorRate,
        double processCpu,
        double cpuPerOperationMillis,
        long allocationBytesPerSecond,
        long heapAfterGcBytes,
        Duration repositoryP95,
        Duration poolAcquisitionP95,
        double queueUtilization) {
}
```

---

### 8. Criar performance budgets

```java
public record PerformanceBudget(
        Duration p95Maximum,
        Duration p99Maximum,
        double errorRateMaximum,
        double CPUPerOperationMaximum,
        double queueUtilizationMaximum) {
}
```

Os budgets devem estar ligados ao SLO e à capacidade.

---

### 9. Coletar JFR

Execute:

```powershell
.\scripts\projects\observable-orders-api\collect-optimization-jfr.ps1
```

Colete durante carga estável.

Analise:

- execution samples;
- method profiling;
- allocation;
- GC;
- monitor enter;
- thread park;
- socket I/O;
- file I/O;
- exceptions;
- class loading;
- thread CPU.

---

### 10. Coletar dumps e histogramas

Execute:

```powershell
.\scripts\projects\observable-orders-api\collect-optimization-thread-dumps.ps1

.\scripts\projects\observable-orders-api\collect-optimization-histograms.ps1
```

Use múltiplas amostras.

Não versionar:

- thread dumps brutos;
- JFR bruto;
- histogramas com dados sensíveis;
- endereços;
- PIDs.

---

### 11. Coletar planos de query

Execute:

```powershell
.\scripts\projects\observable-orders-api\collect-optimization-query-plans.ps1
```

Colete apenas para operações sintéticas e autorizadas.

Compare:

- node;
- estimated rows;
- actual rows;
- loops;
- buffers;
- planning time;
- execution time;
- temp usage.

---

### 12. Criar candidato de otimização

```java
public record OptimizationCandidate(
        String id,
        OptimizationCategory category,
        String observedProblem,
        String evidenceCategory,
        String expectedImprovement,
        String risk,
        String rollbackTrigger) {
}
```

Categorias:

```java
public enum OptimizationCategory {
    DATABASE,
    SERIALIZATION,
    LOGGING,
    MEMORY,
    CPU,
    CONCURRENCY,
    QUEUE,
    POOL
}
```

---

### 13. Priorizar candidatos

Use impacto versus esforço.

Exemplo:

```text
candidato A:
reduzir query count de 21 para 2.

candidato B:
reduzir 2% de CPU em formatter.

candidato C:
diminuir p99 de 900ms para 500ms.

candidato D:
aumentar pool sem diagnóstico.
```

Priorize evidência, impacto no SLO e risco.

Candidato D deve ser rejeitado até existir prova.

---

### 14. Criar profiling policy

Arquivo:

```text
contracts/observable-api-profiling-policy.yaml
```

Conteúdo:

```yaml
profiling:
  collect:
    - JFR
    - CPU-samples
    - allocation-samples
    - thread-dumps
    - class-histograms
    - query-plans

  environment:
    controlled:
      required

  duration:
    bounded

  rawArtifacts:
    repository:
      forbidden

  conclusion:
    singleSample:
      insufficient
```

---

### 15. Diagnosticar query count

Cenário:

```text
listar pedidos;

carregar itens;

carregar detalhes;

montar resposta.
```

Valide se existe:

- N+1;
- consulta duplicada;
- query para campo não usado;
- contagem extra;
- lazy loading indireto;
- paginação inadequada.

Crie teste:

```java
@Test
void shouldListOrdersWithinQueryBudget() {

    queryCounter.reset();

    service.list(pageRequest);

    assertThat(
            queryCounter.total())
            .isLessThanOrEqualTo(2);
}
```

---

### 16. Criar projection

```java
public interface OrderSummaryProjection {

    UUID getId();

    String getStatus();

    BigDecimal getTotalAmount();

    Instant getCreatedAt();
}
```

Use projection quando a resposta não precisa da entidade completa.

---

### 17. Criar repository de projection

```java
public interface OrderProjectionRepository
        extends Repository<OrderEntity, UUID> {

    Page<OrderSummaryProjection>
    findByStatus(
            String status,
            Pageable pageable);
}
```

A query precisa ser validada por plano e volume.

---

### 18. Criar policy de banco

Arquivo:

```text
contracts/observable-api-database-optimization-policy.yaml
```

Conteúdo:

```yaml
databaseOptimization:
  require:
    - query-count
    - query-plan
    - rows-returned
    - repository-latency
    - write-cost
    - regression

  index:
    evidence:
      required

  projection:
    validateMapping:
      required

  pagination:
    stableOrdering:
      required

  poolIncrease:
    capacityReview:
      required
```

---

### 19. Validar before/after do banco

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-database-optimization.ps1
```

Compare:

- query count;
- p95 repository;
- p99 HTTP;
- rows returned;
- buffers;
- CPU;
- allocation;
- write path;
- correctness.

A otimização não pode perder campos exigidos.

---

### 20. Diagnosticar serialização

No JFR ou profile, procure:

- `ObjectMapper`;
- conversões repetidas;
- DTOs intermediários;
- collections copiadas;
- formatação desnecessária;
- payload grande;
- pretty print;
- campos não usados.

Meça:

```text
mapping duration;

serialization duration;

response bytes;

allocation rate.
```

---

### 21. Criar mapper otimizado

```java
@Component
public final class OptimizedOrderMapper {

    public OrderResponse map(
            OrderSummaryProjection projection) {

        return new OrderResponse(
                projection.getId(),
                projection.getStatus(),
                projection.getTotalAmount(),
                projection.getCreatedAt());
    }
}
```

Evite montar objetos que serão descartados.

---

### 22. Criar policy de serialização

Arquivo:

```text
contracts/observable-api-serialization-policy.yaml
```

Conteúdo:

```yaml
serialization:
  observe:
    - mapping-duration
    - serialization-duration
    - response-size
    - allocation-rate

  removeField:
    contractReview:
      required

  cacheSerializedResponse:
    forbiddenWithoutInvalidationContract

  DTO:
    avoidRedundantCopies:
      true

  compression:
    measureCPUAndNetwork:
      required
```

---

### 23. Validar serialização

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-serialization-optimization.ps1
```

Confirme:

- JSON compatível;
- campos preservados;
- p95 menor ou estável;
- allocation reduzida;
- CPU por operação não piorou;
- payload não aumentou.

---

### 24. Diagnosticar logging

Observe:

- logs por request;
- logs por item;
- stack traces repetidas;
- formatação;
- serialização de objetos;
- appender;
- volume por segundo;
- bytes escritos;
- CPU do logger;
- fila do appender.

Não remova logs necessários ao runbook.

---

### 25. Criar sampler de logging

```java
@Component
public final class LoggingSampler {

    private final AtomicLong sequence =
            new AtomicLong();

    public boolean shouldLogSuccess() {
        return sequence
                .incrementAndGet()
                % 100
                == 0;
    }
}
```

Sampling de sucesso pode ser usado quando métricas cobrem o volume.

Erros relevantes permanecem registrados conforme policy.

---

### 26. Criar policy de logging

Arquivo:

```text
contracts/observable-api-logging-optimization-policy.yaml
```

Conteúdo:

```yaml
loggingOptimization:
  preserve:
    - errors
    - state-transitions
    - security-events
    - deployment-events
    - incident-required-events

  reduce:
    - per-item-success
    - duplicate-completion
    - repetitive-stack

  sampling:
    documented:
      required

  metricsReplaceVolumeCounting:
    true

  correlationFields:
    preserve:
      required
```

---

### 27. Validar logging

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-logging-optimization.ps1
```

Compare:

- logs por segundo;
- bytes;
- CPU;
- p95;
- incident navigation;
- erro detectável;
- trace-log correlation.

Se o runbook perde capacidade de investigação, a mudança é rejeitada.

---

### 28. Diagnosticar fila

Observe:

- capacidade;
- pending;
- utilization;
- oldest age;
- arrival rate;
- consumption rate;
- rejection;
- drain time;
- shutdown behavior.

Não aumente a capacidade automaticamente.

Uma fila maior pode apenas aumentar latência.

---

### 29. Criar drainer bounded

```java
@Component
public final class BoundedEventDrainer {

    private final BlockingQueue<OrderEvent> queue;
    private final ExecutorService executor;
    private final AtomicBoolean running =
            new AtomicBoolean();

    public void start() {
        if (!running.compareAndSet(
                false,
                true)) {
            return;
        }

        executor.submit(this::drain);
    }

    private void drain() {
        while (running.get()
                || !queue.isEmpty()) {

            try {
                OrderEvent event =
                        queue.poll(
                                100,
                                TimeUnit.MILLISECONDS);

                if (event != null) {
                    process(event);
                }
            } catch (InterruptedException exception) {
                Thread.currentThread()
                        .interrupt();
                break;
            }
        }
    }
}
```

---

### 30. Criar policy de concorrência

Arquivo:

```text
contracts/observable-api-concurrency-optimization-policy.yaml
```

Conteúdo:

```yaml
concurrency:
  required:
    - workload
    - downstream-capacity
    - limit
    - queue
    - cancellation
    - shutdown

  unboundedExecutor:
    forbidden

  virtualThreads:
    downstreamLimitStillRequired:
      true

  parallelismIncrease:
    beforeAfter:
      required

  lockChange:
    invariantTest:
      required
```

---

### 31. Criar limite de concorrência

```java
public final class ConcurrencyLimit {

    private final Semaphore permits;

    public ConcurrencyLimit(
            int maximum) {
        permits = new Semaphore(
                maximum);
    }

    public <T> T execute(
            Supplier<T> supplier) {

        boolean acquired =
                permits.tryAcquire();

        if (!acquired) {
            throw new CapacityRejectedException();
        }

        try {
            return supplier.get();
        } finally {
            permits.release();
        }
    }
}
```

O limite deve refletir capacidade downstream.

---

### 32. Validar concorrência

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-concurrency-optimization.ps1
```

Compare:

- throughput;
- p95;
- p99;
- rejection;
- Hikari pending;
- queue utilization;
- CPU;
- context switches;
- downstream latency;
- shutdown.

Mais concorrência não é automaticamente melhor.

---

### 33. Diagnosticar alocação

No JFR, procure:

- DTOs temporários;
- listas copiadas;
- strings;
- JSON buffers;
- arrays;
- collectors;
- exceptions em fluxo comum;
- logging arguments;
- wrappers;
- reflection.

Alocação alta não prova leak.

O objetivo pode ser reduzir churn e CPU de GC.

---

### 34. Criar allocation snapshot

```java
public record AllocationSnapshot(
        long bytesPerSecond,
        long heapAfterGc,
        Duration gcTime,
        long operations) {

    public double bytesPerOperation() {
        return operations == 0
                ? 0
                : (double) bytesPerSecond
                / operations;
    }
}
```

---

### 35. Criar policy de memória

Arquivo:

```text
contracts/observable-api-memory-optimization-policy.yaml
```

Conteúdo:

```yaml
memoryOptimization:
  observe:
    - allocation-rate
    - bytes-per-operation
    - heap-after-GC
    - GC-time
    - pause
    - live-set

  objectReuse:
    mutableSharedObject:
      forbidden

  poolingSmallObjects:
    rejectByDefault:
      true

  largerHeapAsOptimization:
    forbiddenWithoutCapacityReason

  leakRegression:
    required
```

---

### 36. Validar memória

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-memory-optimization.ps1
```

Confirme:

- bytes por operação;
- heap after GC;
- GC time;
- live set;
- throughput;
- p99;
- ausência de leak;
- ausência de shared mutable state incorreto.

---

### 37. Calcular CPU por operação

```java
public record CpuPerOperation(
        long processCpuNanos,
        long completedOperations) {

    public double milliseconds() {
        if (completedOperations == 0) {
            return 0;
        }

        return processCpuNanos
                / 1_000_000.0
                / completedOperations;
    }
}
```

CPU percentual sem throughput pode enganar.

---

### 38. Criar runbook de otimização

Arquivo:

```text
docs/OPTIMIZATION_STRATEGY.md
```

Fluxo:

1. validar baseline;
2. escolher workload;
3. confirmar gerador;
4. coletar métricas;
5. coletar traces;
6. coletar JFR;
7. coletar planos;
8. listar candidatos;
9. priorizar um candidato;
10. definir sucesso e rollback;
11. aplicar uma mudança;
12. repetir carga;
13. comparar;
14. executar regressão funcional;
15. aprovar ou reverter;
16. atualizar documentação.

---

### 39. Criar rollback policy

Arquivo:

```text
contracts/observable-api-rollback-policy.yaml
```

Conteúdo:

```yaml
rollback:
  requiredWhen:
    - p99-regression
    - error-rate-regression
    - correctness-failure
    - SLO-regression
    - resource-leak
    - signal-loss
    - queue-instability

  candidate:
    record:
      - previous-version
      - change
      - trigger
      - rollback-command
      - validation

  rollbackTest:
    required
```

---

### 40. Criar optimization decision

```java
public record OptimizationDecision(
        String candidateId,
        String decision,
        String evidence,
        String expectedResult,
        String rollbackTrigger,
        Instant decidedAt) {
}
```

---

### 41. Criar result

```java
public record OptimizationResult(
        String candidateId,
        boolean targetImproved,
        boolean correctnessPreserved,
        boolean SLOPreserved,
        boolean observabilityPreserved,
        boolean leaksAbsent,
        String finalDecision) {
}
```

---

### 42. Criar regression policy

Arquivo:

```text
contracts/observable-api-regression-policy.yaml
```

Conteúdo:

```yaml
regression:
  functional:
    required

  operational:
    compare:
      - throughput
      - p95
      - p99
      - error-rate
      - CPU-per-operation
      - allocation-per-operation
      - query-count
      - pool-acquisition
      - queue-utilization
      - GC-time

  observability:
    preserve:
      - logs
      - metrics
      - traces
      - health
      - alerts
      - runbooks

  repetitions:
    minimum:
      3
```

---

### 43. Comparar before/after

Execute:

```powershell
.\scripts\projects\observable-orders-api\compare-optimization-before-after.ps1
```

Relatório:

```yaml
comparison:
  candidate:
    query-projection

  before:
    p95:
      420ms
    queryCount:
      21
    CPUPerOperation:
      4.8ms

  after:
    p95:
      250ms
    queryCount:
      2
    CPUPerOperation:
      3.1ms

  correctness:
    PASS

  SLO:
    PASS

  observability:
    PASS

  decision:
    APPROVE
```

Os números são exemplos didáticos.

---

### 44. Evitar média isolada

Compare distribuições:

- p50;
- p95;
- p99;
- máximo categorizado;
- variância;
- throughput;
- erro.

Uma média melhor pode esconder p99 pior.

---

### 45. Validar sob steady e burst

Uma mudança pode melhorar carga estável e falhar em burst.

Execute:

```powershell
.\scripts\projects\observable-orders-api\run-steady-load.ps1

.\scripts\projects\observable-orders-api\run-burst-load.ps1
```

Observe fila, pool, retries, readiness e recovery.

---

### 46. Validar read-heavy e write-heavy

Execute:

```powershell
.\scripts\projects\observable-orders-api\run-read-heavy-load.ps1

.\scripts\projects\observable-orders-api\run-write-heavy-load.ps1
```

Índices e projections podem ajudar leitura e piorar escrita.

A decisão precisa considerar o workload real.

---

### 47. Validar SLO após mudança

Confirme:

- disponibilidade;
- latência;
- error budget;
- burn rate;
- alertas;
- readiness;
- recovery.

Não aprove uma otimização que melhora microbenchmark e piora o SLO da jornada.

---

### 48. Preservar tracing

Após a mudança, confirme:

- spans ainda existem;
- parent-child está correto;
- atributos bounded;
- erros são marcados;
- exemplars funcionam;
- logs carregam trace ID;
- sampling não foi alterado silenciosamente.

---

### 49. Criar security policy

Arquivo:

```text
contracts/observable-api-part3-security-policy.yaml
```

Conteúdo:

```yaml
security:
  loadTest:
    syntheticData:
      required

  profile:
    rawArtifact:
      repository:
        forbidden

  queryPlan:
    sensitiveValue:
      forbidden

  optimizationReport:
    businessIdentifier:
      forbidden

  cache:
    sensitivePayload:
      forbidden

  rollback:
    credential:
      forbidden
```

---

### 50. Criar data quality policy

Arquivo:

```text
contracts/observable-api-part3-data-quality-policy.yaml
```

Conteúdo:

```yaml
quality:
  singleRun:
    result:
      insufficient

  saturatedGenerator:
    result:
      invalid

  differentDataset:
    result:
      invalid

  differentCPUQuota:
    result:
      invalid

  missingWarmup:
    result:
      invalid

  mixedChanges:
    result:
      inconclusive

  missingFunctionalRegression:
    action:
      reject

  p95WithoutTrafficVolume:
    result:
      limited
```

---

### 51. Criar failure policy

Arquivo:

```text
contracts/observable-api-part3-failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  optimizeWithoutBaseline:
    action:
      reject

  multipleChanges:
    action:
      reject-comparison

  hiddenErrorFromSLI:
    action:
      fail-governance

  unboundedCache:
    action:
      fail-design

  poolIncreaseWithoutDatabaseEvidence:
    action:
      reject

  observabilityRemoved:
    action:
      rollback

  revisionContent:
    deferredToLesson604
```

---

### 52. Criar cenários oficiais

Arquivo:

```text
contracts/observable-api-part3-scenarios.yaml
```

Cenários:

```text
baseline-steady;

baseline-burst;

baseline-read-heavy;

baseline-write-heavy;

generator-not-saturated;

query-count-hotspot;

projection-optimization;

query-plan-regression;

serialization-hotspot;

serialization-optimization;

logging-volume-hotspot;

logging-sampling;

queue-utilization-hotspot;

bounded-drainer;

concurrency-too-low;

concurrency-too-high;

concurrency-limit;

allocation-hotspot;

allocation-reduction;

GC-time-comparison;

CPU-per-operation-comparison;

p99-regression;

SLO-regression;

signal-loss-regression;

rollback-triggered;

rollback-success;

before-after-approved;

before-after-rejected;

zero-task-leak;

zero-connection-leak;

part3-gate-pass.
```

---

### 53. Criar matriz de testes

Arquivo:

```text
docs/OBSERVABLE_API_PART3_TEST_MATRIX.md
```

Cobertura:

- baseline;
- repetitions;
- steady;
- burst;
- read-heavy;
- write-heavy;
- generator saturation;
- JFR;
- thread dumps;
- histograms;
- query plans;
- query count;
- projections;
- serialization;
- logging volume;
- queue;
- concurrency;
- CPU per operation;
- allocation per operation;
- GC;
- p95;
- p99;
- SLO;
- alerts;
- tracing;
- rollback;
- task leaks;
- connection leaks;
- security;
- evidence.

---

### 54. Criar troubleshooting

Arquivo:

```text
docs/OBSERVABLE_API_PART3_TROUBLESHOOTING.md
```

Inclua:

- resultados variam entre execuções;
- gerador está saturado;
- warmup insuficiente;
- p95 melhora e p99 piora;
- throughput sobe e erro cresce;
- projection quebra contrato;
- índice melhora leitura e piora escrita;
- logging reduz e diagnóstico desaparece;
- fila maior aumenta latência;
- concorrência maior satura Hikari;
- virtual threads aumentam pressão downstream;
- allocation cai e CPU não muda;
- GC melhora, mas live set cresce;
- alertas deixam de disparar;
- trace perde parent;
- rollback não restaura baseline;
- revisão da aula 604 foi antecipada.

---

### 55. Criar optimization gate

```java
public final class OptimizationGate {

    public boolean approve(
            OptimizationResult result) {

        return result.targetImproved()
                && result.correctnessPreserved()
                && result.SLOPreserved()
                && result.observabilityPreserved()
                && result.leaksAbsent();
    }
}
```

---

### 56. Executar regressão completa

Execute:

```powershell
.\scripts\projects\observable-orders-api\run-optimization-regression.ps1
```

Confirme:

- testes funcionais;
- contratos;
- logs;
- traces;
- métricas;
- health;
- SLO;
- alertas;
- steady load;
- burst load;
- read-heavy;
- write-heavy;
- shutdown;
- zero task leaks;
- zero connection leaks.

---

### 57. Executar validação completa

Execute:

```powershell
.\scripts\projects\observable-orders-api\validate-optimization-contract.ps1

.\scripts\projects\observable-orders-api\prepare-optimization-fixtures.ps1

.\scripts\projects\observable-orders-api\run-optimization-baseline.ps1

.\scripts\projects\observable-orders-api\run-steady-load.ps1

.\scripts\projects\observable-orders-api\run-burst-load.ps1

.\scripts\projects\observable-orders-api\run-read-heavy-load.ps1

.\scripts\projects\observable-orders-api\run-write-heavy-load.ps1

.\scripts\projects\observable-orders-api\collect-optimization-jfr.ps1

.\scripts\projects\observable-orders-api\collect-optimization-thread-dumps.ps1

.\scripts\projects\observable-orders-api\collect-optimization-histograms.ps1

.\scripts\projects\observable-orders-api\collect-optimization-query-plans.ps1

.\scripts\projects\observable-orders-api\analyze-optimization-hotspots.ps1

.\scripts\projects\observable-orders-api\validate-database-optimization.ps1

.\scripts\projects\observable-orders-api\validate-serialization-optimization.ps1

.\scripts\projects\observable-orders-api\validate-logging-optimization.ps1

.\scripts\projects\observable-orders-api\validate-concurrency-optimization.ps1

.\scripts\projects\observable-orders-api\validate-memory-optimization.ps1

.\scripts\projects\observable-orders-api\compare-optimization-before-after.ps1

.\scripts\projects\observable-orders-api\validate-optimization-rollback.ps1

.\scripts\projects\observable-orders-api\run-optimization-regression.ps1

.\scripts\projects\observable-orders-api\collect-observable-api-part3-evidence.ps1

.\scripts\projects\observable-orders-api\verify-observable-api-part3-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 58. Criar gate da parte 3

O gate valida:

```text
partes 1 e 2;

baseline;

workloads;

profiling;

candidato;

mudança isolada;

database;

serialização;

logging;

fila;

concorrência;

memória;

CPU;

before/after;

SLO;

observabilidade;

rollback;

regressão;

security;

evidence.
```

Status:

```text
PASS;

FAIL_BASELINE;

FAIL_WORKLOAD;

FAIL_PROFILING;

FAIL_CANDIDATE;

FAIL_DATABASE;

FAIL_SERIALIZATION;

FAIL_LOGGING;

FAIL_CONCURRENCY;

FAIL_MEMORY;

FAIL_CPU;

FAIL_SLO;

FAIL_OBSERVABILITY;

FAIL_ROLLBACK;

FAIL_REGRESSION;

FAIL_SECURITY;

INCONCLUSIVE.
```

---

### 59. Coletar evidence

Arquivo:

```text
contracts/observable-api-part3-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- environment;
- release category;
- baseline status;
- workload status;
- profiling status;
- candidate category;
- target metric category;
- database optimization status;
- serialization status;
- logging status;
- concurrency status;
- memory status;
- CPU status;
- before-after status;
- SLO status;
- observability status;
- rollback status;
- regression status;
- task leak status;
- connection leak status;
- security status;
- gate status;
- tests status;
- timestamp.

Não inclua:

- raw JFR;
- raw profile;
- thread ID;
- PID;
- raw SQL;
- parâmetro;
- payload;
- customer reference;
- order ID;
- trace ID;
- segredo;
- conteúdo da revisão da aula 604.

---

### 60. Encerrar o projeto

Confirme:

- otimização aprovada ou revertida;
- modos lab resetados;
- API encerrada;
- collector encerrado;
- Prometheus encerrado;
- Grafana encerrado;
- PostgreSQL encerrado;
- filas drenadas conforme policy;
- executors encerrados;
- datasource fechado;
- zero task leaks;
- zero connection leaks;
- raw artifacts fora do Git;
- evidence sanitizada;
- baseline final aprovada.

---

## Entendendo o que foi feito

### A baseline ganhou autoridade

A otimização passou a depender de medições repetidas e comparáveis.

### O workload ganhou identidade

Steady, burst, read-heavy e write-heavy deixaram de ser misturados.

### O profiling ganhou hipótese

JFR, dumps, histogramas e planos passaram a sustentar candidatos.

### O banco ganhou comparação

Query count, planos, buffers e latência passaram a validar projections e índices.

### A serialização ganhou custo próprio

Mapping, bytes e allocation deixaram de ficar escondidos no tempo HTTP.

### O logging ganhou orçamento

Volume foi reduzido sem perder correlação e eventos essenciais.

### A fila ganhou limite operacional

Capacidade, utilização, idade e drain time passaram a orientar concorrência.

### A CPU ganhou unidade por operação

Uso de CPU passou a ser comparado com trabalho concluído.

### A memória ganhou regressão

Allocation e live set passaram a ser avaliados separadamente.

### A otimização ganhou rollback

Mudanças deixaram de ser irreversíveis.

### A observabilidade foi preservada

Logs, métricas, traces, health, alertas e runbooks continuaram funcionando.

### O projeto foi concluído

A API observável terminou funcional, operável, diagnosticável e otimizada com evidência.

---

## Erros comuns importantes

### Otimizar sem baseline

Não existe prova de melhoria.

### Misturar mudanças

O resultado fica inconclusivo.

### Comparar cargas diferentes

A diferença pode vir do workload.

### Usar apenas média

P99 e erro podem piorar.

### Aumentar pool automaticamente

O banco pode sofrer mais concorrência.

### Criar cache ilimitado

Latência melhora temporariamente e memória degrada.

### Remover logs críticos

A investigação de incidente perde contexto.

### Aumentar fila

Backlog vira latência.

### Aumentar paralelismo sem downstream budget

Pool, banco ou publisher saturam.

### Aprovar microbenchmark e ignorar SLO

A jornada real pode piorar.

---

## Comandos úteis

### Executar baseline

```powershell
.\scripts\projects\observable-orders-api\run-optimization-baseline.ps1
```

### Coletar JFR

```powershell
.\scripts\projects\observable-orders-api\collect-optimization-jfr.ps1
```

### Analisar hotspots

```powershell
.\scripts\projects\observable-orders-api\analyze-optimization-hotspots.ps1
```

### Comparar before/after

```powershell
.\scripts\projects\observable-orders-api\compare-optimization-before-after.ps1
```

### Executar regressão

```powershell
.\scripts\projects\observable-orders-api\run-optimization-regression.ps1
```

---

## Exercício guiado

### Parte 1 — Baseline

Execute três medições equivalentes.

### Parte 2 — Workloads

Separe steady, burst, read-heavy e write-heavy.

### Parte 3 — Profiling

Colete JFR, dumps, histogramas e planos.

### Parte 4 — Candidato

Escolha um gargalo com evidência.

### Parte 5 — Mudança

Aplique uma única alteração bounded.

### Parte 6 — Banco e serialização

Valide query count, planos, mapping e allocation.

### Parte 7 — Logging e concorrência

Preserve sinais e capacidade downstream.

### Parte 8 — Before/after

Compare distribuições e CPU por operação.

### Parte 9 — Rollback

Reverta se o trigger ocorrer.

### Parte 10 — Gate

Valide funcionalidade, SLO, leaks, observabilidade e evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 602 e ponte para a aula 604 foram preservadas;
- baselines das partes 1 e 2 continuam aprovadas;
- contrato, policies, cenários e scripts de otimização foram criados;
- Java, JVM, dataset, schema, estatísticas, quota, pool, warmup e workload foram fixados;
- ao menos três execuções comparáveis foram coletadas;
- steady, burst, read-heavy e write-heavy foram separados;
- saturação do gerador foi verificada;
- throughput, p50, p95, p99, erros, CPU, allocation, GC, query count, pool e fila foram medidos;
- JFR, thread dumps, histogramas e query plans foram coletados com segurança;
- candidatos possuem problema, evidência, objetivo, risco e rollback trigger;
- uma mudança principal foi aplicada por comparação;
- query count e planos foram validados;
- projections preservam contrato funcional;
- serialização foi comparada por duração, bytes e allocation;
- logging foi reduzido sem perder sinais essenciais;
- fila permaneceu bounded;
- concorrência respeita capacidade downstream;
- CPU por operação foi calculada;
- allocation por operação e live set foram avaliados;
- p95 e p99 foram comparados;
- SLO, error budget e alertas continuam válidos;
- tracing, logs, métricas, health e runbooks foram preservados;
- before/after foi executado com mesma carga;
- rollback foi testado;
- regressão funcional e operacional foi executada;
- zero task leaks e zero connection leaks foram validados;
- raw JFR, profiles, dumps, SQL, IDs e segredos não foram commitados;
- a revisão técnica da aula 604 não foi antecipada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/projects/observable-orders-api `
  scripts/projects/observable-orders-api `
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
      "password|authorization|bearer|access_token|refresh_token|client_secret|customerReference|orderId|requestId|traceIdValue|spanIdValue|rawJfr|rawProfile|heapDump|threadDump|rawSql|queryParameter"
```

Commit recomendado:

```powershell
git commit -m "perf(m18): otimizar API observavel parte 3"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- `.env`;
- IDs reais;
- payloads;
- raw logs;
- raw traces;
- raw JFR;
- profiles;
- dumps;
- SQL sensível;
- resultados temporários;
- material da aula 604.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu o projeto API observável.

Você executou:

```text
baseline;

workloads;

JFR;

thread dumps;

histogramas;

query plans;

seleção de candidato;

otimização de banco;

otimização de serialização;

otimização de logging;

controle de concorrência;

análise de memória;

CPU por operação;

before/after;

rollback;

regressão;

gate final.
```

Você comprovou que otimização começa com medição; que workload precisa ser reproduzível; que uma mudança deve ser isolada; que query count, CPU, allocation, pool e fila precisam ser observados juntos; que melhorar média não basta se o p99 piorar; que observabilidade não pode ser removida para ganhar desempenho; que mudanças precisam de rollback; e que o resultado só é aprovado quando funcionalidade, SLOs, sinais e recursos permanecem corretos.

A próxima aula será:

```text
604 - M18.49 - Revisao producao parte 1
```

Nela, você irá revisar os fundamentos de operação e diagnóstico do módulo, consolidando logs, métricas, tracing, SLOs, alertas, profiling, concorrência e decisões de produção.

Nenhuma revisão técnica sistemática da parte 1 foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei as partes 1 e 2.
- [ ] Fixei workload e ambiente.
- [ ] Coletei baseline repetida.
- [ ] Usei profiling e planos.
- [ ] Escolhi candidato com evidência.
- [ ] Apliquei mudança isolada.
- [ ] Comparei before/after e SLO.
- [ ] Validei rollback, regressão e zero leaks.

---

## Troubleshooting adicional

### Resultados variam muito

Revise warmup, workload, gerador, ambiente e ruído externo.

### Throughput não cresce

O gargalo pode estar downstream ou no gerador.

### P95 melhora e p99 piora

A mudança pode criar cauda longa ou contenção.

### Query count cai e CPU sobe

O novo mapping ou join pode ser mais caro.

### Allocation cai e GC não muda

O collector ou o período podem não refletir ganho suficiente.

### Logging cai e runbook perde contexto

Restaure eventos essenciais e use métricas para volume.

### Concorrência aumenta e Hikari pending cresce

O limite ultrapassou a capacidade do banco.

### Fila fica maior e p99 cresce

Capacidade adicional virou tempo de espera.

### Rollback não restaura baseline

Revise dados, caches, flags, schema e processos residuais.

### O conteúdo começou uma revisão geral

Preserve essa revisão para a aula 604.

---

## Perguntas de revisão

1. O que é baseline?
2. O que é performance budget?
3. O que é bottleneck?
4. O que é CPU por operação?
5. Por que executar várias medições?
6. Por que separar workloads?
7. Para que serve JFR?
8. Por que coletar query plans?
9. O que é optimization candidate?
10. Por que aplicar uma mudança por vez?
11. O que before/after precisa preservar?
12. Por que média não basta?
13. Como projection pode melhorar?
14. Qual risco de reduzir logs?
15. Qual risco de aumentar fila?
16. Qual risco de aumentar concorrência?
17. O que é rollback trigger?
18. Quando a otimização é aprovada?
19. O que ficou para a próxima aula?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Estado medido antes da mudança.
2. Limite operacional aprovado.
3. Etapa que limita o sistema.
4. Tempo de CPU dividido por operações.
5. Reduzir efeito de variabilidade.
6. Cargas diferentes revelam gargalos diferentes.
7. Correlacionar CPU, allocation, GC e locks.
8. Entender custo e cardinalidade.
9. Mudança proposta com evidência e risco.
10. Atribuir o resultado corretamente.
11. Ambiente, workload, correção e sinais.
12. Pode esconder p99 e erro.
13. Buscar apenas campos necessários.
14. Perder capacidade de diagnóstico.
15. Transformar backlog em latência.
16. Saturar downstream.
17. Condição objetiva de reversão.
18. Quando melhora o alvo e preserva correção, SLO e observabilidade.
19. Revisão produção parte 1.
20. Revisão produção parte 1.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
### Aula 603 - M18.48 - Projeto API observavel parte 3 otimizacao

- Concluí o projeto API observável.
- Validei as baselines das partes 1 e 2.
- Fixei JVM, dataset, schema, pool, quota, warmup e workload.
- Criei perfis steady, burst, read-heavy e write-heavy.
- Coletei throughput, p50, p95, p99, erros, CPU, allocation, GC, query count, pool e fila.
- Usei JFR, thread dumps, histogramas e query plans.
- Criei candidatos de otimização com evidência, risco e rollback.
- Reduzi query count com projection validada.
- Comparei planos, buffers e custo de escrita.
- Reduzi serialização e cópias desnecessárias.
- Otimizei volume de logs preservando correlação.
- Mantive fila bounded e limite de concorrência.
- Calculei CPU e allocation por operação.
- Comparei before/after com a mesma carga.
- Validei SLO, error budget, alertas e tracing.
- Testei rollback e regressão completa.
- Validei zero task leaks e zero connection leaks.
- Coletei evidence sanitizada.
- Não antecipei a revisão técnica.
- Próxima aula: Revisão produção parte 1.
```

---

## Referência técnica curta

- Performance baselines.
- Load profiles.
- Java Flight Recorder.
- CPU per operation.
- Allocation profiling.
- PostgreSQL query plans.
- Serialization optimization.
- Logging budgets.
- Concurrency limits.
- Before-and-after regression.

Regra final:

```text
a terceira parte da API observável precisa otimizar somente gargalos comprovados: toda mudança nasce de baseline repetida com JVM, dataset, schema, statistics, quota, pool, warmup e workload fixos, usa steady, burst, read-heavy e write-heavy separados, coleta throughput, p50, p95, p99, erros, CPU por operação, allocation por operação, heap after GC, query count, pool acquisition e queue utilization, e é sustentada por JFR, thread dumps, histogramas, traces e query plans; candidatos possuem hipótese, evidência, objetivo, risco e rollback trigger, apenas uma mudança principal é comparada por vez, projections, serialização, logging, filas, concorrência, memória e banco preservam contratos e limites, e nenhuma melhora local pode degradar SLO, error budget, alertas, tracing, health ou runbooks; before/after usa a mesma carga, regressão funcional e operacional é obrigatória, rollback é testado e o projeto termina com zero task leaks, zero connection leaks, sinais preservados e evidence sanitizada; a revisão técnica sistemática começa somente na aula 604.
```
