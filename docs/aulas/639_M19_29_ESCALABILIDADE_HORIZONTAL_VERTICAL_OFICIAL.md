# 639 - M19.29 - Escalabilidade horizontal vertical

## Apresentação da aula

Na aula 638, você projetou uma arquitetura multi-tenant para `Service Scheduling`, isolando identidade, dados, cache, mensagens, configuração e capacidade por cliente.

Agora surge outra pergunta: o que acontece quando a quantidade de tenants, agendamentos, consultas, comandos e eventos ultrapassa a capacidade atual?

Existem duas estratégias principais:

```text
escalabilidade vertical:
aumentar a capacidade de uma unidade;

escalabilidade horizontal:
aumentar a quantidade de unidades.
```

Nenhuma funciona por mágica. Mais CPU não corrige lock global, consulta sem índice ou dependência lenta. Mais instâncias não ajudam quando sessão, workflow ou scheduler ficam presos à memória local, nem quando o banco permanece como gargalo único.

Escalabilidade é sustentar crescimento de carga mantendo objetivos explícitos de latência, throughput, erro, custo e utilização. Para escalar com segurança, é necessário medir demanda, localizar saturação, conhecer o limite atual e aumentar o recurso correto.

A pergunta desta aula será:

```text
como aumentar capacidade
sem apenas deslocar o gargalo
ou multiplicar custo sem evidência?
```

O laboratório será:

```text
labs/m19/aula-639-escalabilidade-horizontal-vertical/service-scheduling-scalability
```

Você construirá um simulador com nós de aplicação, balanceamento, workloads HTTP e assíncronos, catálogo de estado, políticas de scale up e scale out, autoscaling, capacity planning, testes, reports, evidence e gate.

A próxima aula será:

```text
640 - M19.30 - Resiliencia arquitetural
```

Timeout, retry, circuit breaker, bulkhead, fallback e recuperação ficam para a aula 640.

Regra central:

```text
escalar é aumentar capacidade útil
com hipótese mensurável;

não é adicionar recurso
sem localizar o gargalo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
637 Idempotencia avancada;
638 Multi tenancy arquitetura;
639 Escalabilidade horizontal vertical;
640 Resiliencia arquitetural;
641 Design de sistemas parte 1.
```

A progressão agora é isolar clientes, aumentar capacidade e, depois, sustentar operação diante de falhas.

O foco não será um provedor específico, mas um raciocínio transferível: localizar o recurso limitante, decidir entre escala vertical e horizontal, tornar componentes distribuíveis, definir sinais de autoscaling e provar o resultado. Ao final, você deverá explicar o limite atual, o SLO protegido, o estado que impede scale out, o próximo gargalo, o headroom e o custo de cada alternativa.

---

## Objetivo prático

O laboratório será organizado assim:

```text
service-scheduling-scalability
├── pom.xml
├── README.md
├── src/main/java/br/com/formacao/scalability
│   ├── workload
│   ├── node
│   ├── routing
│   ├── state
│   ├── database
│   ├── worker
│   ├── autoscaling
│   ├── capacity
│   └── observability
├── src/test/java/br/com/formacao/scalability
├── scalability
├── contracts
└── reports
```

O código conterá perfis de carga, nós, routers, catálogo de estado, modelo de pool, workers, policy de scaling, autoscaler e capacity planner. Os testes cobrirão baseline, saturação, escala vertical e horizontal, banco, workers, autoscaling, headroom e noisy neighbor.

Scripts:

```text
scripts/m19/service-scheduling-scalability
├── validate-scalability-contract.ps1
├── validate-workload-profile.ps1
├── validate-baseline.ps1
├── validate-vertical-scaling.ps1
├── validate-horizontal-scaling.ps1
├── validate-state-catalog.ps1
├── validate-database-capacity.ps1
├── validate-worker-capacity.ps1
├── validate-autoscaling-policy.ps1
├── validate-capacity-plan.ps1
├── validate-scalability-observability.ps1
├── run-scalability-tests.ps1
├── collect-scalability-evidence.ps1
└── verify-scalability-gate.ps1
```

---

## Conceito essencial

### Capacidade, carga e saturação

Carga é a demanda imposta ao sistema. Capacidade é o volume que o sistema consegue processar dentro dos objetivos definidos. Saturação ocorre quando um recurso se aproxima do limite e o trabalho adicional passa a aumentar filas, latência, timeout ou erro.

Sem SLO, não existe capacidade útil mensurável. Dizer que uma aplicação processa 1.000 requisições por segundo não basta se o `p99` chega a 20 segundos ou se 8% das requisições falham.

### Escalabilidade vertical

Scale up aumenta recursos da mesma unidade: CPU, memória, IOPS, conexões ou capacidade de máquina. É simples, preserva topologia e reduz complexidade distribuída, mas possui limite físico, pode exigir parada, aumenta concentração de risco e normalmente cresce em saltos de custo.

### Escalabilidade horizontal

Scale out adiciona unidades independentes: instâncias HTTP, consumers, workers, shards ou réplicas de leitura. Pode crescer gradualmente e melhorar distribuição, mas exige estado externo ou particionado, balanceamento, coordenação, observabilidade agregada e cuidado com dependências compartilhadas.

### Statelessness

Um nó stateless não guarda em memória local um estado necessário para que a próxima requisição funcione. Ele pode usar caches locais descartáveis, mas identidade, sessão, workflow, lock, deduplicação e progresso precisam sobreviver à troca de instância quando fazem parte da correção.

### Gargalo móvel

Quando a aplicação escala, o gargalo pode migrar para banco, cache, broker, rede, API externa, pool de threads ou pool de conexões. Scaling deve ser validado no sistema, não apenas no processo Java.

### Capacity planning

Capacity planning estima demanda futura, capacidade por unidade, crescimento, headroom, eventos de pico e tempo de provisionamento. O objetivo não é prever perfeitamente, mas decidir antes da saturação e registrar premissas verificáveis.

---

## Mão na massa guiada

### 1. Criar o laboratório

Execute:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  labs/m19/aula-639-escalabilidade-horizontal-vertical/service-scheduling-scalability

Set-Location `
  labs/m19/aula-639-escalabilidade-horizontal-vertical/service-scheduling-scalability
```

Crie um projeto Maven com Java 21 e JUnit 5. O laboratório será determinístico: não dependerá de cloud real para comprovar o raciocínio.

---

### 2. Criar Scalability Charter

Arquivo:

```text
scalability/SCALABILITY_CHARTER.md
```

Conteúdo:

```markdown
# Scalability Charter

Contexto: Service Scheduling.

Workloads:
- consulta de agenda;
- confirmação e reagendamento;
- dashboard;
- publicação e processamento assíncrono.

Objetivos:
- p95 de consulta menor que 250 ms;
- p99 de comando menor que 800 ms;
- erro menor que 0,5%;
- fila drenada em até 120 segundos;
- headroom mínimo de 30%.

Estratégia: medir baseline, localizar saturação, escalar o recurso limitante e repetir a medição.

Fora de escopo: circuit breaker, retry avançado, bulkhead, disaster recovery e cloud específica.
```

O charter impede que a equipe use “mais rápido” como objetivo impreciso.

---

### 3. Criar contrato principal

Arquivo:

```text
contracts/scalability-contract.yaml
```

Conteúdo:

```yaml
scalability:
  context:
    Service-Scheduling

  required:
    - workload-profile
    - service-level-objectives
    - reproducible-baseline
    - bottleneck-identification
    - vertical-scaling-model
    - horizontal-scaling-model
    - state-dependency-catalog
    - database-capacity
    - worker-capacity
    - autoscaling-policy
    - capacity-plan
    - cost-trade-off
    - load-tests
    - evidence

  forbidden:
    - scale-without-baseline
    - average-latency-only
    - add-instances-with-local-required-state
    - ignore-downstream-bottleneck
    - unlimited-autoscaling
    - cpu-only-decision-for-all-workloads
    - resilience-deep-dive

  nextLesson:
    code:
      M19.30
```

---

### 4. Definir os workloads

Não misture todos os requests em uma única média. O perfil precisa separar operações com custos e comportamentos diferentes.

Arquivo:

```text
scalability/WORKLOAD_PROFILE.md
```

Exemplo:

```text
Search Appointments:
70% do tráfego;
read-heavy;
p95 < 250 ms;
pico 1.800 RPS.

Confirm Appointment:
12% do tráfego;
write com transação;
p99 < 800 ms;
pico 250 RPS.

Reschedule Appointment:
8% do tráfego;
write com reserva de capacidade;
p99 < 1 s;
pico 120 RPS.

Dashboard:
10% do tráfego;
agregação;
p95 < 2 s;
pico 80 RPS.

Notification Worker:
assíncrono;
pico 20.000 mensagens;
drenagem < 120 s.
```

Escalabilidade precisa considerar distribuição, pico, duração e custo por operação.

---

### 5. Modelar Workload Profile

```java
package br.com.formacao.scalability.workload;

public record WorkloadProfile(
        String name,
        double requestsPerSecond,
        double averageServiceTimeMillis,
        double targetP95Millis,
        double targetErrorRate,
        boolean asynchronous) {

    public WorkloadProfile {
        if (requestsPerSecond < 0) {
            throw new IllegalArgumentException("RPS must not be negative");
        }
        if (averageServiceTimeMillis <= 0) {
            throw new IllegalArgumentException("Service time must be positive");
        }
        if (targetP95Millis <= 0) {
            throw new IllegalArgumentException("Target latency must be positive");
        }
        if (targetErrorRate < 0 || targetErrorRate >= 1) {
            throw new IllegalArgumentException("Invalid error rate target");
        }
    }
}
```

`averageServiceTimeMillis` não substitui percentis. Ele é usado apenas no modelo inicial de capacidade.

---

### 6. Criar o baseline

Baseline é a medição reproduzível antes da mudança.

Registre:

```text
versão do código;
configuração da JVM;
CPU e memória;
quantidade de nós;
pool de threads;
pool de conexões;
volume de dados;
dataset;
perfil de carga;
aquecimento;
duração;
p50, p95 e p99;
throughput;
erro;
CPU;
memória;
GC;
conexões;
fila.
```

Sem essas informações, dois testes de carga não são comparáveis.

Arquivo:

```text
reports/baseline-report.yaml
```

Exemplo:

```yaml
baseline:
  applicationNodes: 1
  cpuUnitsPerNode: 2
  memoryMbPerNode: 2048
  workloadRps: 600
  throughputRps: 575
  latencyMillis:
    p50: 75
    p95: 220
    p99: 490
  errorRate: 0.002
  cpuUtilization: 0.71
  databasePoolUtilization: 0.58
  result: PASS
```

---

### 7. Modelar a capacidade de um nó

```java
package br.com.formacao.scalability.node;

public record NodeCapacity(
        int cpuUnits,
        int memoryMb,
        int maxConcurrentRequests,
        double sustainableRequestsPerSecond) {

    public NodeCapacity {
        if (cpuUnits < 1 || memoryMb < 256) {
            throw new IllegalArgumentException("Invalid node resources");
        }
        if (maxConcurrentRequests < 1) {
            throw new IllegalArgumentException("Concurrency must be positive");
        }
        if (sustainableRequestsPerSecond <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
    }
}
```

Capacidade sustentável é diferente do maior pico observado por alguns segundos. Ela deve manter o SLO durante a janela definida.

---

### 8. Criar Service Node

```java
package br.com.formacao.scalability.node;

import java.util.concurrent.atomic.AtomicInteger;

public final class ServiceNode {

    private final String nodeId;
    private final NodeCapacity capacity;
    private final AtomicInteger inFlight = new AtomicInteger();

    public ServiceNode(String nodeId, NodeCapacity capacity) {
        this.nodeId = nodeId;
        this.capacity = capacity;
    }

    public AdmissionResult admit() {
        int current = inFlight.incrementAndGet();

        if (current > capacity.maxConcurrentRequests()) {
            inFlight.decrementAndGet();
            return AdmissionResult.rejected("NODE_SATURATED");
        }

        return AdmissionResult.accepted(nodeId);
    }

    public void complete() {
        inFlight.decrementAndGet();
    }

    public int currentLoad() {
        return inFlight.get();
    }

    public NodeCapacity capacity() {
        return capacity;
    }
}
```

O limite evita que a fila interna cresça sem controle e esconda saturação. Políticas completas de resiliência serão tratadas na aula 640.

---

### 9. Entender saturação

Quando a taxa de chegada se aproxima da taxa de serviço, a fila cresce. A aplicação pode continuar “viva”, mas a latência de cauda aumenta rapidamente.

Sinais de saturação incluem:

```text
CPU sustentada;
threads ocupadas;
pool de conexões esgotado;
fila interna crescente;
GC frequente;
IOPS no limite;
consumer lag crescente;
p95 e p99 degradando;
rejeições de admissão.
```

Uma única média de CPU não é suficiente.

---

### 10. Escalar verticalmente

Scale up pode transformar:

```text
2 CPU / 2 GB
```

em:

```text
4 CPU / 4 GB.
```

No simulador:

```java
NodeCapacity before = new NodeCapacity(
        2,
        2048,
        120,
        600);

NodeCapacity after = new NodeCapacity(
        4,
        4096,
        220,
        1_050);
```

Não assuma ganho linear. Locks, IO, banco, GC e partes seriais limitam o ganho.

---

### 11. Criar política de scale up

Arquivo:

```text
contracts/vertical-scaling-policy.yaml
```

Conteúdo:

```yaml
verticalScaling:
  allowedWhen:
    - application-node-is-bottleneck
    - larger-size-is-available
    - growth-window-is-known
    - restart-impact-is-accepted

  requires:
    - before-baseline
    - after-baseline
    - cost-comparison
    - maximum-size
    - rollback-plan

  forbiddenWhen:
    - database-is-the-actual-bottleneck
    - global-lock-dominates
    - latency-is-external
    - gain-is-assumed-linear
```

Scale up é uma decisão legítima quando simplifica a operação e ainda existe espaço econômico e técnico.

---

### 12. Validar ganho vertical

Compare o mesmo workload e dataset.

Exemplo:

```text
antes:
575 RPS sustentáveis;
p95 220 ms;
2 CPU.

depois:
960 RPS sustentáveis;
p95 205 ms;
4 CPU.

ganho de throughput:
67%.

ganho de CPU:
100%.
```

O resultado mostra ganho sublinear. A conclusão não é falha; é evidência para custo por capacidade útil.

---

### 13. Escalar horizontalmente

Scale out adiciona nós com a mesma função:

```text
node-a;
node-b;
node-c.
```

Para funcionar, requests equivalentes devem poder chegar a qualquer nó elegível.

Crie:

```java
package br.com.formacao.scalability.routing;

import br.com.formacao.scalability.node.ServiceNode;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public final class RoundRobinRouter implements RequestRouter {

    private final List<ServiceNode> nodes;
    private final AtomicInteger sequence = new AtomicInteger();

    public RoundRobinRouter(List<ServiceNode> nodes) {
        this.nodes = List.copyOf(nodes);
    }

    @Override
    public ServiceNode next() {
        int index = Math.floorMod(sequence.getAndIncrement(), nodes.size());
        return nodes.get(index);
    }
}
```

Round robin distribui quantidade, não custo. Um request de dashboard pode custar muito mais que uma leitura simples.

---

### 14. Criar Least Loaded Router

```java
package br.com.formacao.scalability.routing;

import br.com.formacao.scalability.node.ServiceNode;
import java.util.Comparator;
import java.util.List;

public final class LeastLoadedRouter implements RequestRouter {

    private final List<ServiceNode> nodes;

    public LeastLoadedRouter(List<ServiceNode> nodes) {
        this.nodes = List.copyOf(nodes);
    }

    @Override
    public ServiceNode next() {
        return nodes.stream()
                .min(Comparator.comparingInt(ServiceNode::currentLoad))
                .orElseThrow();
    }
}
```

Em produção, o balanceador não conhece perfeitamente a carga interna. O exemplo ensina a diferença entre distribuição cega e distribuição orientada a sinal.

---

### 15. Criar catálogo de estado

Antes do scale out, catalogue todo estado local.

Arquivo:

```text
scalability/STATE_DEPENDENCY_CATALOG.md
```

Modelo:

```text
HTTP session:
required across requests;
action: externalize or remove.

Idempotency record:
required for correctness;
action: shared durable store.

TenantContext:
request scoped;
action: reconstruct per request.

Local cache:
discardable;
action: allow with TTL and invalidation policy.

Scheduled job ownership:
single executor required;
action: distributed ownership or external scheduler.

Upload temporary file:
required after request;
action: shared object storage.
```

Nem todo estado local é proibido. O problema é depender dele para correção após mudança de nó.

---

### 16. Proibir afinidade como correção

Sticky session pode reduzir redistribuição, mas não deve corrigir arquitetura dependente de memória local. Quando o nó reinicia, o estado desaparece.

Arquivo:

```text
contracts/state-policy.yaml
```

Conteúdo:

```yaml
state:
  requiredAcrossRequests:
    localMemory:
      forbidden

  requestScoped:
    reconstructOnEveryRequest:
      required

  localCache:
    allowedWhen:
      - discardable
      - bounded
      - observable

  stickySession:
    correctnessMechanism:
      forbidden

  singletonJob:
    distributedOwnership:
      required
```

---

### 17. Separar readiness de liveness

Um nó pode estar com processo ativo e ainda não estar pronto para receber carga.

Readiness deve considerar:

```text
aplicação inicializada;
conexões essenciais disponíveis;
migrations compatíveis;
configuração carregada;
warm-up mínimo concluído;
capacidade de aceitar requests.
```

Liveness indica apenas se o processo precisa ser reiniciado. Não use liveness para remover um nó temporariamente saturado sem entender a causa.

---

### 18. Medir eficiência horizontal

Dois nós de 600 RPS teóricos raramente entregam exatamente 1.200 RPS úteis.

Defina:

```text
eficiência horizontal =
capacidade observada com N nós
/
(N × capacidade de um nó).
```

Exemplo:

```text
1 nó:
575 RPS.

3 nós:
1.560 RPS.

ideal:
1.725 RPS.

eficiência:
90,4%.
```

A perda pode vir de banco, balanceamento, cache frio, coordenação ou workload desigual.

---

### 19. Identificar o banco como gargalo compartilhado

Ao adicionar nós de aplicação, cada nó pode abrir mais conexões e aumentar pressão no banco.

Modelo:

```java
package br.com.formacao.scalability.database;

public record ConnectionPoolModel(
        int applicationNodes,
        int connectionsPerNode,
        int databaseConnectionLimit) {

    public int requestedConnections() {
        return applicationNodes * connectionsPerNode;
    }

    public boolean exceedsDatabaseLimit() {
        return requestedConnections() > databaseConnectionLimit;
    }
}
```

Exemplo:

```text
10 nós × 30 conexões = 300;
limite seguro do banco = 220.
```

Autoscaling da aplicação pode derrubar o banco se o pool for multiplicado sem orçamento global.

---

### 20. Criar política de capacidade do banco

Arquivo:

```text
contracts/database-capacity-policy.yaml
```

Conteúdo:

```yaml
databaseCapacity:
  requires:
    - query-profile
    - connection-budget
    - transaction-duration
    - lock-observation
    - index-review
    - storage-latency

  applicationScaling:
    mustRespect:
      global-connection-budget

  readReplica:
    allowedFor:
      - search
      - dashboard
      - reporting

  readReplica:
    forbiddenAsAuthorityFor:
      - expected-version
      - critical-transition
      - capacity-reservation

  sharding:
    requires:
      - partition-key
      - routing-model
      - rebalance-plan
      - cross-shard-query-analysis
```

Read replica pode ampliar leitura, mas não elimina lag nem substitui a autoridade de comandos críticos.

---

### 21. Avaliar particionamento

Particionar ou shardear dados é escala horizontal do armazenamento. É uma decisão cara porque muda roteamento, consultas, transações, migrations e operação.

No domínio, possíveis chaves incluem:

```text
tenantId;
região;
appointmentId hash;
janela temporal.
```

`tenantId` pode combinar com a aula 638, mas precisa avaliar tenants muito grandes, consultas administrativas e rebalanço. Não escolha uma chave apenas porque já existe na tabela.

---

### 22. Escalar workers separadamente

Workload HTTP e workload assíncrono possuem sinais diferentes.

Crie:

```java
package br.com.formacao.scalability.worker;

public record WorkerCapacity(
        int workers,
        double messagesPerSecondPerWorker,
        double incomingMessagesPerSecond) {

    public double totalProcessingRate() {
        return workers * messagesPerSecondPerWorker;
    }

    public boolean backlogWillGrow() {
        return incomingMessagesPerSecond > totalProcessingRate();
    }
}
```

Se chegam 500 mensagens por segundo e cada worker processa 80, seis workers entregam 480 e a fila continuará crescendo. Sete entregam 560 e começam a drenar.

---

### 23. Usar lag como sinal de workers

CPU baixa não significa capacidade suficiente. Um consumer pode esperar IO externo enquanto o backlog cresce.

Sinais úteis:

```text
queue depth;
oldest message age;
consumer lag;
processing rate;
arrival rate;
processing duration;
failure rate.
```

A aula 640 aprofundará o comportamento diante de dependências indisponíveis. Aqui, o objetivo é dimensionar capacidade de processamento.

---

### 24. Criar Scaling Policy

```java
package br.com.formacao.scalability.autoscaling;

import java.time.Duration;

public record ScalingPolicy(
        int minimumInstances,
        int maximumInstances,
        double scaleOutThreshold,
        double scaleInThreshold,
        int consecutiveWindows,
        Duration cooldown,
        double targetHeadroom) {

    public ScalingPolicy {
        if (minimumInstances < 1 || maximumInstances < minimumInstances) {
            throw new IllegalArgumentException("Invalid instance bounds");
        }
        if (scaleInThreshold >= scaleOutThreshold) {
            throw new IllegalArgumentException("Scale-in must be below scale-out");
        }
        if (consecutiveWindows < 1) {
            throw new IllegalArgumentException("Windows must be positive");
        }
        if (targetHeadroom <= 0 || targetHeadroom >= 1) {
            throw new IllegalArgumentException("Invalid headroom");
        }
    }
}
```

Limites e cooldown evitam crescimento infinito e oscilação constante.

---

### 25. Criar Scaling Decision

```java
package br.com.formacao.scalability.autoscaling;

public sealed interface ScalingDecision {

    record ScaleOut(int from, int to, String reason) implements ScalingDecision {
    }

    record ScaleIn(int from, int to, String reason) implements ScalingDecision {
    }

    record Keep(int instances, String reason) implements ScalingDecision {
    }
}
```

A decisão precisa registrar o sinal e a razão. “Autoscaler decidiu” não é evidência operacional suficiente.

---

### 26. Escolher sinais de autoscaling

CPU funciona bem para workloads CPU-bound. Não funciona sozinha para todos os casos.

Matriz recomendada:

```text
HTTP CPU-bound:
CPU + p95 + in-flight.

HTTP IO-bound:
in-flight + p95 + pool utilization.

Consumer:
lag + oldest message age + processing rate.

Database proxy:
connection utilization + queue wait.

Scheduled batch:
remaining work + deadline.
```

O sinal deve antecipar violação do SLO, não apenas reagir depois dela.

---

### 27. Criar autoscaling policy YAML

Arquivo:

```text
contracts/autoscaling-policy.yaml
```

Conteúdo:

```yaml
autoscaling:
  http:
    minimumInstances: 3
    maximumInstances: 12
    scaleOut:
      requiresAny:
        - cpu-above-70-percent
        - p95-above-220-ms
        - in-flight-above-75-percent
      consecutiveWindows: 3
    scaleIn:
      requiresAll:
        - cpu-below-35-percent
        - p95-below-150-ms
        - in-flight-below-30-percent
      consecutiveWindows: 10
    cooldownSeconds: 180

  worker:
    minimumInstances: 2
    maximumInstances: 20
    scaleOut:
      requiresAny:
        - oldest-message-age-above-30-seconds
        - processing-rate-below-arrival-rate

  globalConstraints:
    - database-connection-budget
    - cost-budget
    - tenant-quota
```

Scale in deve ser mais conservador que scale out porque remover capacidade durante uma oscilação pode recriar saturação.

---

### 28. Considerar warm-up

Nova instância pode precisar de:

```text
JVM warm-up;
class loading;
conexões;
cache inicial;
configuração;
readiness;
registro no balanceador.
```

Se o provisionamento leva quatro minutos e o pico cresce em trinta segundos, autoscaling reativo será atrasado. Use capacidade mínima maior, scaling programado ou sinais antecipados.

---

### 29. Modelar Capacity Planner

```java
package br.com.formacao.scalability.capacity;

public final class CapacityPlanner {

    public int requiredInstances(
            double peakRequestsPerSecond,
            double sustainableRpsPerInstance,
            double headroom) {

        if (headroom <= 0 || headroom >= 1) {
            throw new IllegalArgumentException("Invalid headroom");
        }

        double usableCapacityPerInstance =
                sustainableRpsPerInstance * (1 - headroom);

        return (int) Math.ceil(
                peakRequestsPerSecond / usableCapacityPerInstance);
    }
}
```

Exemplo:

```text
pico esperado:
2.400 RPS.

capacidade sustentável por nó:
600 RPS.

headroom:
30%.

capacidade útil por nó:
420 RPS.

nós necessários:
6.
```

Sem headroom, qualquer variação, GC, deploy ou workload mais caro viola o SLO.

---

### 30. Usar Little's Law como aproximação

Em estado estável:

```text
concorrência aproximada =
taxa de chegada × tempo no sistema.
```

Exemplo:

```text
1.000 requests/s × 0,2 s =
200 requests concorrentes.
```

Se a latência sobe para 0,8 s com a mesma chegada, a concorrência vai para aproximadamente 800. Isso pressiona threads, memória e conexões.

A fórmula não substitui teste de carga; ela ajuda a verificar se configurações são coerentes.

---

### 31. Definir headroom

Headroom absorve:

```text
variação normal;
picos curtos;
GC;
deploy rolling;
perda de uma instância;
workload mais caro;
atraso do autoscaler.
```

O percentual depende do tempo de reação e do risco. Não use 30% como número universal; registre a justificativa.

---

### 32. Planejar por cenários

Arquivo:

```text
scalability/CAPACITY_PLAN.md
```

Inclua:

```text
Base Day:
1.200 RPS;
4 nós.

Peak Campaign:
2.400 RPS;
6 nós.

One Node Unavailable:
2.400 RPS;
7 nós provisionados para manter 6 úteis.

Tenant Import Window:
HTTP normal;
workers sobem de 4 para 12.

End of Month Dashboard:
read replica e cache aquecido;
8 nós HTTP.
```

Separar cenários evita dimensionar tudo pelo pior caso durante o ano inteiro.

---

### 33. Preservar justiça entre tenants

A aula 638 criou quotas. Em escala, essas quotas precisam permanecer válidas.

Exemplo:

```text
um tenant envia 60% do tráfego;

cluster escala;

sem limite por tenant,
ele continua ocupando 60%
da nova capacidade.
```

Scale out aumenta capacidade global, mas não corrige fairness. Mantenha limites, filas ou concorrência por tenant e observe rejeições por plano.

---

### 34. Separar workloads incompatíveis

Não coloque no mesmo pool sem análise:

```text
consultas rápidas;
exports pesados;
processamento de imagem;
callbacks externos;
agregações de dashboard.
```

Um export pode consumir threads e conexões que deveriam atender confirmações. Separar deployment ou worker permite escalar de acordo com o sinal correto.

Essa separação não é bulkhead completo; o aprofundamento de isolamento de falhas fica para a aula 640.

---

### 35. Observar o custo

Escalabilidade precisa de custo por unidade útil.

Registre:

```text
custo por 1.000 requests;
custo por Appointment processado;
custo por mensagem;
custo em idle;
custo no pico;
custo de banco;
custo de observabilidade;
custo operacional.
```

Scale out pode parecer barato por instância e tornar-se caro com load balancer, logs, métricas, conexões e tráfego. Scale up pode ser mais simples até determinado limite.

---

### 36. Criar matriz de decisão

Arquivo:

```text
scalability/SCALING_DECISION_MATRIX.md
```

Registre o gargalo, a primeira ação e o motivo:

```text
CPU da aplicação:
scale up ou out, após baseline.

Heap por cache local:
corrigir limite antes de escalar.

Conexões do banco:
revisar query, pool e orçamento global.

Leitura de busca:
cache ou read replica.

Backlog de notificações:
escalar workers por lag.

Lock global:
redesenhar seção crítica.
```

A matriz evita prescrever a mesma solução para sintomas diferentes.

---

### 37. Criar observabilidade

Arquivo:

```text
contracts/observability-policy.yaml
```

Conteúdo:

```yaml
observability:
  workload:
    required:
      - request-rate
      - operation
      - tenant-plan
      - payload-class

  service:
    required:
      - throughput
      - p50
      - p95
      - p99
      - error-rate
      - in-flight
      - saturation

  node:
    required:
      - cpu
      - memory
      - gc-pause
      - thread-pool
      - connection-pool

  asynchronous:
    required:
      - arrival-rate
      - processing-rate
      - queue-depth
      - oldest-message-age

  scaling:
    required:
      - decision
      - signal
      - instances-before
      - instances-after
      - ready-time
      - effect-on-slo

  forbidden:
    - raw-personal-data
    - unbounded-tenant-cardinality
```

Observe sistema, workload e decisão de scaling na mesma linha do tempo.

---

### 38. Testar baseline

`BaselineCapacityTest` executa um nó, mede throughput, percentis, erro e saturação e salva um resultado reproduzível.

`VerticalScalingTest` repete o mesmo workload após scale up e compara ganho, custo e eficiência, sem exigir crescimento linear.

`HorizontalScalingTest` compara um e três nós, calcula eficiência horizontal e confirma que o orçamento do banco não foi violado.

`LocalStateScaleOutTest` demonstra que um workflow em memória falha ao mudar de nó; depois confirma a correção com store compartilhado.

`UnevenWorkloadRoutingTest` mistura requests leves e pesados para comparar round robin e least loaded.

`ConnectionBudgetTest` valida:

```text
instances × pool per instance
<= global database budget.
```

`WorkerScalingTest` cobre chegada abaixo, igual e acima da taxa de processamento, scale out e drenagem do backlog.

`AutoscalingPolicyTest` valida janelas consecutivas, cooldown, scale in conservador, mínimo, máximo e restrições globais.

`CapacityPlannerTest` confirma que 2.400 RPS, 600 RPS por nó e 30% de headroom exigem seis nós.

`TenantFairnessUnderScaleTest` prova que novas instâncias não removem quotas nem permitem que um tenant capture toda a capacidade.

Após os testes, gere um novo ranking de saturação. Scaling não elimina a existência de gargalo; torna seu limite conhecido e desloca a próxima decisão para o recurso correto.

---

### 49. Criar failure policy limitada ao escopo

Arquivo:

```text
contracts/failure-policy.yaml
```

Conteúdo:

```yaml
failure:
  baselineMissing:
    action:
      FAIL

  bottleneckUnknown:
    action:
      INCONCLUSIVE

  localRequiredStateDetected:
    action:
      BLOCK_HORIZONTAL_SCALE

  databaseBudgetExceeded:
    action:
      BLOCK_SCALE_OUT

  autoscalingAtMaximum:
    action:
      ALERT_CAPACITY_RISK

  scalingDidNotImproveSlo:
    action:
      ROLLBACK_OR_REASSESS

  resilienceDeepDive:
    deferredToLesson640
```

---

### 50. Criar Reports

Arquivos:

```text
reports/baseline-report.yaml
reports/vertical-scaling-report.yaml
reports/horizontal-scaling-report.yaml
reports/database-capacity-report.yaml
reports/worker-capacity-report.yaml
reports/autoscaling-report.yaml
reports/capacity-plan-report.yaml
reports/scalability-gate-report.yaml
```

Exemplo consolidado:

```yaml
scalability:
  baselineRps: 575
  verticalRps: 960
  horizontalNodes: 3
  horizontalRps: 1560
  horizontalEfficiency: 0.904
  targetP95Millis: 250
  observedP95Millis: 218
  errorRate: 0.003
  databasePoolUtilization: 0.82
  targetHeadroom: 0.30
  requiredPeakInstances: 6
  localRequiredStateFindings: 0
  result: PASS_WITH_DATABASE_WATCH
```

---

### 51. Criar Evidence

Arquivo:

```text
contracts/scalability-evidence.yaml
```

Campos permitidos:

- lesson;
- project;
- workload profile hash;
- code revision;
- node configuration;
- node count;
- baseline throughput;
- scaled throughput;
- p50, p95 e p99;
- error rate;
- horizontal efficiency;
- connection budget;
- worker processing rate;
- queue age;
- scaling decisions;
- headroom;
- test status;
- architecture status;
- documentation status;
- gate status;
- timestamp.

Não inclua dados pessoais, tokens, topologia real, custos contratuais confidenciais ou endpoints privados.

---

### 52. Criar Gate

O gate valida:

```text
charter;
workloads;
SLO;
baseline;
gargalo;
scale up;
scale out;
catálogo de estado;
banco;
workers;
autoscaling;
capacity plan;
headroom;
custo;
observabilidade;
testes;
reports;
evidence.
```

Status:

```text
PASS;
PASS_WITH_DATABASE_WATCH;
FAIL_WORKLOAD_PROFILE;
FAIL_BASELINE;
FAIL_BOTTLENECK;
FAIL_VERTICAL_MODEL;
FAIL_HORIZONTAL_MODEL;
FAIL_LOCAL_STATE;
FAIL_DATABASE_CAPACITY;
FAIL_WORKER_CAPACITY;
FAIL_AUTOSCALING;
FAIL_CAPACITY_PLAN;
FAIL_SLO;
FAIL_TEST;
FAIL_ARCHITECTURE;
INCONCLUSIVE.
```

---

### 53. Executar validação completa

```powershell
.\scripts\m19\service-scheduling-scalability\validate-scalability-contract.ps1

.\scripts\m19\service-scheduling-scalability\validate-workload-profile.ps1

.\scripts\m19\service-scheduling-scalability\validate-baseline.ps1

.\scripts\m19\service-scheduling-scalability\validate-vertical-scaling.ps1

.\scripts\m19\service-scheduling-scalability\validate-horizontal-scaling.ps1

.\scripts\m19\service-scheduling-scalability\validate-state-catalog.ps1

.\scripts\m19\service-scheduling-scalability\validate-database-capacity.ps1

.\scripts\m19\service-scheduling-scalability\validate-worker-capacity.ps1

.\scripts\m19\service-scheduling-scalability\validate-autoscaling-policy.ps1

.\scripts\m19\service-scheduling-scalability\validate-capacity-plan.ps1

.\scripts\m19\service-scheduling-scalability\validate-scalability-observability.ps1

.\scripts\m19\service-scheduling-scalability\run-scalability-tests.ps1

.\scripts\m19\service-scheduling-scalability\collect-scalability-evidence.ps1

.\scripts\m19\service-scheduling-scalability\verify-scalability-gate.ps1
```

Finalize:

```powershell
git diff --check

git status
```

---

### 54. Encerrar o laboratório

Confirme:

- workloads, SLO e baseline versionados;
- gargalo identificado antes da mudança;
- scale up e scale out medidos;
- eficiência horizontal calculada;
- estado obrigatório externalizado;
- readiness separada de liveness;
- connection budget respeitado;
- workers dimensionados por fluxo e backlog;
- autoscaling com sinais, limites, janelas e cooldown;
- warm-up e headroom justificados;
- quotas multi-tenant preservadas;
- custo e próximo gargalo registrados;
- testes, reports, evidence e gate aprovados;
- resiliência avançada não antecipada.

---

## Entendendo o que foi feito

### Capacidade passou a ter definição operacional

O laboratório não chamou o sistema de escalável por possuir várias instâncias. Ele definiu workloads, SLO, baseline, capacidade sustentável e headroom.

### Scale up e scale out ganharam critérios

Scale up foi tratado como opção simples e válida dentro de limites. Scale out exigiu statelessness, routing, readiness, estado externo, orçamento de conexões e medição de eficiência.

### O banco e os workers entraram no modelo

A capacidade da aplicação deixou de ser analisada isoladamente. Pools, queries, read replicas, particionamento, chegada de mensagens, processing rate e backlog passaram a fazer parte da decisão.

### Autoscaling ganhou limites e sinais

CPU deixou de ser a única métrica. Cada workload recebeu sinais, janelas, cooldown, mínimo, máximo, warm-up e restrições globais.

### Capacity planning ganhou cenários

Base day, campanha, perda de nó, importação e fechamento mensal passaram a possuir demanda, capacidade, headroom e estratégia documentada.

---

## Erros comuns importantes

### Escalar sem baseline

Sem medição anterior, não é possível provar ganho nem regressão.

### Olhar somente a média

Média de latência esconde picos de p95 e p99 que afetam usuários reais.

### Adicionar instâncias com estado obrigatório local

A próxima requisição pode chegar a outro nó e perder sessão, workflow ou deduplicação.

### Multiplicar pools sem orçamento global

A aplicação escala e esgota conexões do banco.

### Usar CPU para todos os workloads

Consumers e serviços IO-bound podem saturar fila e latência com CPU baixa.

### Confundir pico com capacidade sustentável

Um teste curto pode passar antes de GC, aquecimento inverso, fila ou banco estabilizarem.

### Assumir ganho linear

Mais CPU e mais nós possuem overhead, contenção e dependências compartilhadas.

### Autoscaling sem máximo ou cooldown

O sistema oscila, aumenta custo e pode atacar o banco.

### Escalar para esconder consulta ruim

Índice ausente, N+1, lock ou cache sem limite precisam ser corrigidos antes.

### Ignorar fairness multi-tenant

Mais capacidade pode ser consumida pelo mesmo noisy neighbor.

### Antecipar resiliência

Retries, circuit breakers, bulkheads e degradação serão aprofundados na aula 640.

---

## Comandos úteis

### Validar baseline

```powershell
.\scripts\m19\service-scheduling-scalability\validate-baseline.ps1
```

### Validar escala horizontal

```powershell
.\scripts\m19\service-scheduling-scalability\validate-horizontal-scaling.ps1
```

### Validar autoscaling

```powershell
.\scripts\m19\service-scheduling-scalability\validate-autoscaling-policy.ps1
```

### Executar testes

```powershell
.\scripts\m19\service-scheduling-scalability\run-scalability-tests.ps1
```

### Verificar gate

```powershell
.\scripts\m19\service-scheduling-scalability\verify-scalability-gate.ps1
```

---

## Exercício guiado

Modele os workloads de `Service Scheduling`, defina SLO, produza baseline, identifique o primeiro gargalo, compare scale up e scale out, catalogue estado local, proteja o banco com connection budget, dimensione workers, crie autoscaling por sinais coerentes e entregue um capacity plan com cenários, headroom, custo, reports, evidence e gate.

---

## Critérios de aceite

- arquivo, H1, número, módulo e título seguem a grade oficial;
- continuidade com a aula 638 e ponte para a 640 foram preservadas;
- laboratório, charter, workloads e SLO foram criados;
- baseline reproduzível mede throughput, percentis, erro e saturação;
- gargalo foi identificado antes do scaling;
- capacidade sustentável foi separada de pico temporário;
- scale up foi medido sem pressupor ganho linear;
- scale out inclui routing e cálculo de eficiência horizontal;
- estado obrigatório foi externalizado e sticky session não virou mecanismo de correção;
- readiness e liveness foram diferenciadas;
- banco possui orçamento global de conexões;
- read replica não decide transição crítica;
- sharding exige chave, routing e rebalanceamento;
- workers são dimensionados por chegada, processamento e lag;
- autoscaling possui sinais adequados, mínimo, máximo, janelas e cooldown;
- warm-up, headroom e tempo de provisionamento foram considerados;
- capacity plan cobre operação normal, pico e perda de nó;
- quotas multi-tenant e fairness foram preservadas;
- custo por capacidade útil foi registrado;
- observabilidade relaciona workload, scaling e SLO;
- testes cobrem vertical, horizontal, estado, banco, workers e autoscaling;
- reports, evidence e gate foram criados;
- resiliência arquitetural não foi antecipada;
- commit, diário de bordo e regra final estão presentes.

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
  labs/m19/aula-639-escalabilidade-horizontal-vertical/service-scheduling-scalability `
  scripts/m19/service-scheduling-scalability `
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
      "password|authorization: Bearer|access_token|refresh_token|client_secret|privateEndpoint|realTopology|contractCost|circuitBreakerDeepDive|bulkheadDeepDive"
```

Commit recomendado:

```powershell
git commit -m "feat(m19): modelar escalabilidade e capacidade"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- credenciais;
- tokens;
- topologia real;
- custos contratuais confidenciais;
- endpoints privados;
- resiliência arquitetural aprofundada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você aprofundou escalabilidade vertical e horizontal.

Você criou workloads, SLO, baseline, Node Capacity, routers, catálogo de estado, connection budget, worker capacity, autoscaling, Capacity Planner, reports, evidence e gate.

Você comprovou que scale up pode ser simples, mas possui limites; scale out exige estado distribuível e não remove gargalos compartilhados; pools precisam de orçamento global; workers escalam por lag e taxa de processamento; autoscaling precisa de sinais, janelas, cooldown e limites; e capacity planning combina pico, capacidade sustentável e headroom.

A próxima aula será:

```text
640 - M19.30 - Resiliencia arquitetural
```

Nela, você aprofundará timeout, retry, circuit breaker, bulkhead, fallback, degradação e recuperação. Esses assuntos não foram antecipados aqui.

---

# Material complementar

## Checkpoint final

- [ ] Defini workloads e SLO.
- [ ] Produzi baseline reproduzível.
- [ ] Identifiquei o gargalo antes de escalar.
- [ ] Comparei scale up e scale out.
- [ ] Externalizei estado obrigatório.
- [ ] Protegi o orçamento de conexões.
- [ ] Dimensionei workers por backlog.
- [ ] Criei autoscaling com limites.
- [ ] Mantive headroom e quotas.
- [ ] Verifiquei o gate.

---

## Troubleshooting adicional

### Mais instâncias pioraram o banco

Calcule `instances × pool per instance`, revise queries, duração das transações e orçamento global.

### CPU está baixa, mas o p99 está alto

Verifique IO, pool de conexões, filas, dependências, locks, GC e requests pesados.

### O autoscaler oscila

Aumente janelas, diferencie thresholds de entrada e saída e revise cooldown.

### O novo nó recebe tráfego cedo demais

Revise readiness, warm-up e registro no balanceador.

### O scale out perde sessão

Remova dependência de memória local ou externalize o estado obrigatório.

### O backlog cresce com workers ociosos

Verifique partição de fila, lock, concorrência efetiva, dependência externa e distribuição.

### Três nós entregam pouco mais que um

Meça banco, locks, cache frio, balanceamento, conexão e partes seriais.

### A equipe quer shardear imediatamente

Comprove que otimização, scale up, read path e particionamento lógico não resolvem antes de assumir complexidade de shards.

### Um tenant usa toda capacidade nova

Mantenha quota, concorrência e fila por tenant; scale out não substitui fairness.

### A equipe quer adicionar retry para melhorar throughput

Preserve retry e outras políticas de resiliência para a aula 640.

---

## Perguntas de revisão

1. O que é capacidade útil?
2. O que diferencia scale up de scale out?
3. O que impede scale out seguro?
4. O que é eficiência horizontal?
5. Como scale out pode esgotar o banco?
6. Qual sinal é útil para workers?
7. O que é headroom?
8. Para que serve cooldown?
9. O que Little's Law aproxima?
10. Por que capacity planning usa cenários?
11. Por que quotas continuam necessárias?
12. Qual é a próxima aula?

## Roteiro de resposta

1. Volume processado dentro do SLO, erro e custo aceitos.
2. Um amplia a unidade; o outro adiciona unidades.
3. Estado obrigatório local e dependências compartilhadas sem orçamento.
4. Capacidade observada dividida pela capacidade ideal de N nós.
5. Multiplicando pools por instância.
6. Lag, idade da fila e relação entre chegada e processamento.
7. Capacidade reservada para variação e tempo de reação.
8. Evitar oscilação e decisões repetidas.
9. Concorrência como taxa de chegada vezes tempo no sistema.
10. Porque demanda e estratégia mudam entre base e pico.
11. Porque nova capacidade também pode ser capturada por noisy neighbor.
12. Resiliencia arquitetural.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
**Aula 639 - M19.29 - Escalabilidade horizontal vertical**

- Defini workloads, SLO e baseline reproduzível para Service Scheduling.
- Diferenciei capacidade sustentável, saturação, scale up e scale out.
- Modelei nós, routing e eficiência horizontal.
- Externalizei estado obrigatório e diferenciei readiness de liveness.
- Protegi o orçamento global de conexões do banco.
- Dimensionei workers por arrival rate, processing rate e lag.
- Criei autoscaling com sinais, limites, janelas, cooldown e warm-up.
- Criei Capacity Planner com headroom e cenários de pico.
- Preservei quotas e fairness multi-tenant.
- Registrei custo, observabilidade, testes, reports, evidence e gate.
- Não antecipei resiliência arquitetural.
- Próxima aula: Resiliencia arquitetural.
```

---

## Referência técnica curta

- Scalability, Capacity e Saturation.
- Vertical Scaling e Horizontal Scaling.
- Statelessness e Load Balancing.
- Connection Budget e Consumer Lag.
- Autoscaling, Cooldown e Headroom.
- Capacity Planning e Little's Law.

Regra final:

```text
Escalabilidade é aumento mensurável de capacidade útil. Service Scheduling separa workloads, define SLO e produz baseline antes de localizar saturação. Scale up amplia uma unidade sem pressupor ganho linear; scale out adiciona nós, mas exige estado obrigatório fora da memória local, readiness, routing e medição de eficiência. O banco mantém orçamento global de conexões, read replicas não decidem comandos críticos e sharding exige routing e rebalanceamento. Workers são dimensionados por chegada, processamento e lag. Autoscaling usa sinais adequados, mínimo, máximo, janelas, cooldown e warm-up. Capacity planning transforma pico, capacidade sustentável e headroom em cenários verificáveis, preservando quotas, custo, observabilidade, testes, evidence e gate. Resiliência aprofundada permanece para a aula 640.
```
