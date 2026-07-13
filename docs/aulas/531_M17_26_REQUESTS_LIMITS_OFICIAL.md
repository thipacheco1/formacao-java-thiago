# 531 - M17.26 - Requests limits

## Apresentação da aula

Na aula 530, você aprofundou o comportamento das probes Kubernetes.

O workload passou a ser observado por:

```text
startup;

readiness;

liveness;

EndpointSlices;

restart count;

rollout status;

events;

logs anteriores.
```

Você comprovou que:

```text
startup protege a inicialização;

readiness protege o tráfego;

liveness protege contra travamento.
```

Entretanto, um Pod pode possuir probes corretas e ainda assim apresentar instabilidade.

Exemplos:

- processo Java sofre throttling de CPU;
- garbage collector não recebe tempo suficiente;
- heap cresce além da capacidade;
- memória nativa consome o restante do limite;
- container recebe `OOMKilled`;
- Pod permanece `Pending` por falta de capacidade;
- node fica pressionado;
- várias réplicas disputam os mesmos recursos;
- rollout não encontra espaço para `maxSurge`;
- latência aumenta sem falha de readiness imediata;
- aplicação reinicia e parece problema de liveness;
- autoscaling futuro recebe sinais inconsistentes.

A pergunta central desta aula será:

```text
como declarar
quanto CPU e memória
um container precisa

e quanto ele pode consumir
antes de afetar
o cluster?
```

A resposta será construída com:

```text
requests;

limits.
```

#### Request

Representa a quantidade de recurso considerada pelo scheduler para posicionar o Pod.

É uma declaração de necessidade operacional.

#### Limit

Representa o teto de consumo aplicado ao container conforme o recurso e o runtime.

É uma declaração de contenção.

Requests e limits não possuem o mesmo efeito.

Para CPU:

```text
request:

participa do scheduling
e da distribuição relativa
de CPU sob contenção.

limit:

pode provocar throttling
quando o container tenta
usar mais CPU.
```

Para memória:

```text
request:

participa do scheduling.

limit:

é um teto rígido;
o container pode ser encerrado
quando ultrapassa.
```

A regra central será:

```text
request protege
a capacidade planejada;

limit protege
o node e os vizinhos;

medição protege
contra valores arbitrários.
```

Na aula 528, o workload recebeu uma baseline:

```yaml
resources:
  requests:
    cpu:
      100m

    memory:
      256Mi

  limits:
    cpu:
      500m

    memory:
      512Mi
```

Esses números foram classificados como didáticos.

Nesta aula, você irá:

- compreender unidades;
- observar o scheduler;
- medir consumo;
- provocar contenção;
- observar CPU throttling;
- provocar `OOMKilled` de forma controlada;
- comparar classes de QoS;
- revisar JVM em container;
- estabelecer política de dimensionamento;
- restaurar uma baseline segura.

Outro princípio será:

```text
não dimensione
pela média apenas.
```

A média esconde picos.

Uma política profissional considera:

- startup;
- estado estável;
- pico;
- carga sustentada;
- GC;
- burst;
- rollouts;
- dependências;
- sidecars;
- margem;
- comportamento por ambiente;
- número de réplicas;
- capacidade do node.

Outro princípio será:

```text
request não é reserva física
de CPU ociosa.
```

O scheduler usa requests para decidir se um Pod cabe no node.

Quando existe CPU disponível, um container pode consumir além do request.

Se houver limit, ele não ultrapassa indefinidamente esse teto.

Quando vários containers disputam CPU, requests influenciam a proporção relativa de acesso.

Para memória, o comportamento é diferente.

A memória não é comprimida como CPU.

Quando o container ultrapassa o limite, o kernel pode encerrar processos do cgroup.

O Kubernetes registra:

```text
reason:

OOMKilled.
```

O container pode reiniciar conforme a política do Pod.

Isso pode parecer:

```text
liveness failure;
```

mas a causa real é recurso.

Por isso, troubleshooting precisa separar:

- probe;
- aplicação;
- CPU;
- memória;
- scheduling;
- node pressure.

Outro tema será unidade de CPU.

No Kubernetes:

```text
1 CPU
```

representa aproximadamente um core virtual ou unidade equivalente do node.

Valores podem ser declarados como:

```text
1;

0.5;

500m;

100m.
```

`m` significa millicpu.

```text
1000m = 1 CPU.

500m = 0,5 CPU.

100m = 0,1 CPU.
```

Evite valores ambíguos.

Exemplo:

```text
0.1
```

é válido.

Entretanto:

```text
100m
```

costuma ser mais legível em manifests.

Outro tema será unidade de memória.

Kubernetes aceita sufixos decimais e binários.

Exemplos:

```text
M;

Mi;

G;

Gi.
```

Eles não são equivalentes.

```text
1M:

1.000.000 bytes.

1Mi:

1.048.576 bytes.
```

A baseline utilizará:

```text
Mi.
```

Outro cuidado é:

```text
400m
```

em memória.

Esse valor significa uma quantidade extremamente pequena, porque `m` é milli.

Não significa 400 megabytes.

Use:

```text
400Mi.
```

Outro tema será o scheduler.

Antes de atribuir o Pod a um node, o scheduler analisa requests.

Se a soma necessária não cabe:

```text
o Pod permanece Pending.
```

Events podem mostrar:

```text
Insufficient cpu;

Insufficient memory.
```

O scheduler não utiliza apenas o consumo atual.

Ele considera requests declarados.

Isso evita colocar novos Pods em um node cuja capacidade já está comprometida pelas promessas existentes.

Outro tema será QoS.

Kubernetes classifica Pods em classes de Quality of Service.

```text
Guaranteed;

Burstable;

BestEffort.
```

#### Guaranteed

Todos os containers possuem request e limit de CPU e memória.

Para cada recurso:

```text
request = limit.
```

Esse Pod recebe a classe mais previsível.

Isso não significa que nunca falha.

#### Burstable

Existe ao menos um request ou limit, mas os requisitos de Guaranteed não são atendidos.

É a classe da baseline desta aula.

#### BestEffort

Nenhum container possui requests ou limits de CPU e memória.

Em pressão de memória, esses Pods tendem a possuir menor proteção.

QoS influencia decisões de eviction e comportamento sob pressão.

Ela não substitui prioridades, quotas ou capacity planning.

Outro tema será CPU throttling.

Quando o container atinge a quota de CPU dentro de um período:

```text
a execução é pausada
até existir nova cota.
```

O processo não é encerrado.

Consequências possíveis:

- latência;
- timeout;
- fila;
- startup lenta;
- readiness oscilando;
- GC atrasado;
- throughput menor;
- rollout lento.

A aplicação pode consumir menos CPU em média e ainda sofrer throttling durante picos curtos.

Por isso, média baixa não prova que o limit está correto.

Outro tema será memória da JVM.

Java moderno reconhece limites de container.

Entretanto, memória do processo não é apenas heap.

Ela inclui:

- heap;
- metaspace;
- code cache;
- thread stacks;
- direct buffers;
- JNI;
- native allocations;
- GC structures;
- bibliotecas;
- page cache associada;
- agentes;
- overhead do runtime.

Se o limit é:

```text
512Mi
```

não configure heap máximo para:

```text
512Mi.
```

Isso deixa pouca margem para memória não heap.

Uma estratégia é usar percentuais.

Exemplo conceitual:

```text
-XX:MaxRAMPercentage.
```

O valor precisa ser validado com métricas.

A aula não fixará uma regra universal.

Outro princípio será:

```text
heap limit
não é igual
a container memory limit.
```

Outro tema será OOM da JVM versus OOM do container.

#### Java `OutOfMemoryError`

A JVM detecta que não consegue alocar dentro de uma região.

Pode gerar log ou heap dump conforme configuração.

#### `OOMKilled`

O sistema encerra o processo por exceder a memória do cgroup ou por pressão conforme o cenário.

Pode ocorrer sem a aplicação conseguir registrar um erro Java útil.

O diagnóstico precisa consultar:

```text
container last state;

reason;

exit code;

events;

logs previous;

métricas.
```

Outro tema será requests e rollouts.

O Deployment utiliza:

```yaml
maxSurge:
  1
```

Com duas réplicas, o rollout pode criar uma terceira temporariamente.

O node precisa comportar:

```text
requests de 3 Pods.
```

Se comporta apenas duas:

```text
o Pod novo fica Pending;

o rollout não conclui.
```

Isso não é falha da imagem.

É falta de capacidade para a estratégia escolhida.

Outro tema será requests e probes.

CPU limit baixo pode atrasar o endpoint de health.

Readiness começa a falhar.

A investigação pode culpar a probe.

Mas a raiz é:

```text
CPU throttling.
```

Memória baixa pode causar `OOMKilled`.

Liveness pode nunca ser executada antes do processo morrer.

A sequência das aulas permite separar essas causas.

A observação usará `describe`, events, logs atuais e anteriores, JSON do Pod, `docker stats` e métricas Actuator quando disponíveis. `kubectl top` continuará opcional porque depende de Metrics Server.

Outro tema será medição de CPU.

Você poderá usar:

- tempo de resposta;
- throughput;
- process CPU;
- container stats;
- throttling counters;
- load endpoint de laboratório.

A aplicação de laboratório poderá possuir um cenário:

```text
APP_RESOURCE_SCENARIO.
```

Valores:

```text
normal;

cpu-burst;

memory-pressure.
```

Esse suporte ficará ativo somente em profile local.

Não será habilitado em produção.

Outro tema será medição de memória.

Você irá observar:

- working set;
- RSS;
- heap used;
- heap committed;
- non-heap;
- restart;
- OOMKilled;
- tempo de recuperação;
- impacto no Service.

Nenhum heap dump com conteúdo real será versionado.

Requests excessivos reduzem densidade e podem deixar Pods Pending; limits baixos provocam throttling ou OOM, enquanto limits altos enfraquecem isolamento. O objetivo é um dimensionamento suficiente, observável e revisável.

A baseline começa em `100m/256Mi` de requests e `500m/512Mi` de limits. Os resultados reais serão registrados, sem inventar novos números quando o laboratório não for representativo.

A próxima aula será:

```text
532 - M17.27 - Ingress
```

Portanto, esta aula não criará:

- Ingress Controller;
- Ingress resource;
- host;
- path routing;
- TLS;
- DNS;
- exposição externa.

O foco será capacidade do workload.

Ao final, você deverá explicar:

```text
como request
afeta scheduling;

como limit
afeta execução;

como CPU
difere de memória;

o que é throttling;

o que é OOMKilled;

como QoS
é calculada;

como JVM usa
memória de container;

como rollout
depende de capacidade;

como medir
antes de ajustar;

como restaurar
uma baseline segura.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
529:
ConfigMap Secret.

530:
Probes liveness readiness startup.

531:
Requests limits.

532:
Ingress.

533:
Helm fundamentos.
```

A aula 530 respondeu:

```text
como proteger
startup,
tráfego
e restart
com probes?
```

A aula 531 responderá:

```text
como proteger
scheduling,
CPU,
memória
e capacidade
com requests e limits?
```

Nesta aula:

```text
CPU request:
sim.

CPU limit:
sim.

memory request:
sim.

memory limit:
sim.

millicpu:
sim.

Mi e Gi:
sim.

scheduler:
sim.

Pending:
sim.

throttling:
sim.

OOMKilled:
sim.

QoS:
sim.

Guaranteed:
sim.

Burstable:
sim.

BestEffort:
sim.

JVM container awareness:
sim.

resource evidence:
sim.

LimitRange:
conceitual.

ResourceQuota:
conceitual.

ephemeral storage:
conceitual.

HPA:
não.

Ingress:
não.

Metrics Server:
opcional.
```

A regra central será:

```text
requests planejam;

limits contêm;

métricas justificam.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
k8s/workloads/deployment.yaml
k8s/configuration/configmap.yaml

k8s/resources
├── resource-policy.yaml
├── qos-policy.yaml
├── jvm-container-policy.yaml
├── rollout-capacity-policy.yaml
└── resource-observability-contract.yaml

scripts/kubernetes/resources
├── inspect-node-capacity.ps1
├── inspect-pod-resources.ps1
├── measure-resource-baseline.ps1
├── simulate-cpu-throttling.ps1
├── simulate-memory-oom.ps1
├── simulate-unschedulable-pod.ps1
├── inspect-pod-qos.ps1
├── collect-resource-evidence.ps1
└── restore-resource-baseline.ps1

docs/devops/kubernetes-resources
├── CPU_REQUESTS_LIMITS.md
├── MEMORY_REQUESTS_LIMITS.md
├── KUBERNETES_QOS_CLASSES.md
├── JVM_MEMORY_IN_CONTAINERS.md
├── CPU_THROTTLING_GUIDE.md
├── OOMKILLED_RUNBOOK.md
├── ROLLOUT_CAPACITY_PLANNING.md
├── RESOURCE_TEST_MATRIX.md
└── RESOURCE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
capacidade do node inspecionada;

requests somados;

QoS identificada;

baseline medida;

CPU throttling observado;

OOMKilled observado;

Pod Pending observado;

rollout capacity avaliada;

baseline restaurada;

evidência sanitizada.
```

Você irá:

1. confirmar cluster;
2. confirmar probes;
3. inspecionar node;
4. inspecionar requests;
5. identificar QoS;
6. medir baseline;
7. gerar carga de CPU;
8. observar throttling;
9. reduzir CPU limit temporariamente;
10. observar latência;
11. restaurar CPU;
12. gerar pressão de memória;
13. reduzir memory limit temporariamente;
14. observar OOMKilled;
15. consultar last state;
16. consultar logs previous;
17. restaurar memória;
18. criar Pod impossível;
19. observar Pending;
20. consultar events;
21. remover cenário;
22. calcular capacidade de rollout;
23. criar policies;
24. criar scripts;
25. criar docs;
26. coletar evidence;
27. executar gate;
28. commitar;
29. preparar a aula 532.

---

## Conceito essencial

### Resource request

Quantidade considerada pelo scheduler.

---

### Resource limit

Teto aplicado ao container.

---

### Millicpu

Unidade de CPU.

```text
1000m = 1 CPU.
```

---

### Binary memory unit

Exemplos:

```text
Mi;

Gi.
```

---

### Compressible resource

CPU é considerada compressível.

Sob pressão, o processo desacelera.

---

### Incompressible resource

Memória é tratada como não compressível.

Excesso pode encerrar processos.

---

### CPU throttling

Pausa temporária ao atingir a quota.

---

### OOMKilled

Processo encerrado por falta de memória no contexto do container.

---

### QoS Guaranteed

Requests e limits iguais para CPU e memória em todos os containers.

---

### QoS Burstable

Possui alguma declaração de recurso sem cumprir Guaranteed.

---

### QoS BestEffort

Não possui requests nem limits de CPU e memória.

---

### Node capacity

Capacidade total do node.

---

### Node allocatable

Capacidade disponível para Pods após reservas do sistema.

---

### Unschedulable

Pod não pode ser atribuído a um node.

---

## Mão na massa guiada

### 1. Confirmar o context

Execute:

```powershell
kubectl config current-context
```

O resultado precisa ser:

```text
kind-formacao-java.
```

Depois:

```powershell
.\scripts\kubernetes\kubernetes-preflight.ps1
```

---

### 2. Confirmar a baseline do workload

```powershell
kubectl get deployment,pod,service,endpointslice `
  --namespace `
  formacao-java-dev
```

Confirme:

```text
2 réplicas Ready;

2 endpoints prontos;

cenário de probe normal.
```

---

### 3. Inspecionar capacidade do node

```powershell
kubectl describe node `
  formacao-java-control-plane
```

Procure:

```text
Capacity;

Allocatable;

Allocated resources.
```

Diferencie:

```text
capacity:

total.

allocatable:

disponível para Pods.
```

---

### 4. Inspecionar requests do Deployment

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.template.spec.containers[0].resources}"
```

Registre a baseline.

---

### 5. Identificar a QoS dos Pods

Escolha um Pod:

```powershell
$PodName = kubectl get pods `
  --namespace `
  formacao-java-dev `
  -l `
  "app.kubernetes.io/instance=orders-api-dev" `
  -o `
  "jsonpath={.items[0].metadata.name}"
```

Execute:

```powershell
kubectl get pod `
  $PodName `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.status.qosClass}"
```

Resultado esperado:

```text
Burstable.
```

---

### 6. Criar policy de resources

Arquivo:

```text
k8s/resources/resource-policy.yaml
```

Conteúdo conceitual:

```yaml
resources:
  required:
    requests:
      - cpu
      - memory

    limits:
      - cpu
      - memory

  measurement:
    startup:
      required

    steadyState:
      required

    peak:
      required

    sustainedLoad:
      required

  changes:
    evidence:
      required

    rollback:
      required
```

---

### 7. Criar policy de QoS

Arquivo:

```text
qos-policy.yaml
```

Defina:

```text
BestEffort:

proibido para aplicação.

Burstable:

permitido com evidência.

Guaranteed:

avaliado para workload crítico.

sidecars:

incluídos no cálculo.
```

Não imponha Guaranteed sem analisar custo.

---

### 8. Criar policy da JVM

Arquivo:

```text
jvm-container-policy.yaml
```

Inclua:

- container awareness;
- heap não ocupa todo o limit;
- metaspace;
- direct buffers;
- thread stacks;
- code cache;
- GC;
- margem;
- heap dump protegido;
- observação de OOM;
- valores por ambiente.

---

### 9. Criar cenário de carga

Na ConfigMap, adicione:

```yaml
APP_RESOURCE_SCENARIO:
  normal
```

A aplicação de laboratório pode expor endpoints apenas no profile local:

```text
/lab/resources/cpu;

/lab/resources/memory;

/lab/resources/release.
```

Requisitos:

- autenticação local ou restrição de profile;
- timeout;
- limites internos;
- nenhuma execução em prod;
- testes;
- release explícito da memória;
- sem alocação infinita.

---

### 10. Medir baseline

Arquivo:

```text
measure-resource-baseline.ps1
```

Colete por cinco minutos:

- latência readiness;
- CPU do container;
- memória do container;
- heap used;
- non-heap;
- restart count;
- throttling quando observável;
- requests;
- limits.

Use:

```powershell
docker stats `
  formacao-java-control-plane `
  --no-stream
```

Combine com métricas da aplicação quando disponíveis.

Não use um único ponto.

---

### 11. Registrar baseline

Arquivo gerado localmente:

```text
resource-baseline.json.
```

Campos:

- sample count;
- CPU min;
- CPU median;
- CPU max;
- memory min;
- memory median;
- memory max;
- heap;
- non-heap;
- latency;
- restarts.

Sem secrets.

---

### 12. Simular CPU burst

Ative:

```text
cpu-burst.
```

Execute carga controlada contra uma réplica.

Observe:

- CPU;
- latência;
- readiness;
- restart;
- Service.

A carga precisa terminar automaticamente.

---

### 13. Reduzir CPU limit temporariamente

Em branch de laboratório, altere:

```yaml
limits:
  cpu:
    100m
```

Mantenha request coerente para o experimento.

Aplique e acompanhe rollout.

---

### 14. Observar throttling

Execute o cenário de CPU novamente.

Compare:

- duração;
- throughput;
- readiness;
- startup;
- events;
- métricas.

O container não deve ser encerrado apenas por exceder CPU.

Ele deve ficar mais lento.

---

### 15. Restaurar CPU

Retorne:

```yaml
limits:
  cpu:
    500m
```

Aplique e confirme rollout saudável.

---

### 16. Preparar pressão de memória

Ative o cenário:

```text
memory-pressure.
```

O endpoint precisa alocar em passos controlados.

Não execute em cluster compartilhado.

---

### 17. Reduzir memory limit temporariamente

Altere:

```yaml
limits:
  memory:
    320Mi
```

Mantenha o request abaixo ou igual.

Aplique.

---

### 18. Provocar OOM controlado

Execute a carga de memória limitada.

Observe:

```powershell
kubectl get pod `
  --namespace `
  formacao-java-dev `
  --watch
```

O container pode reiniciar.

---

### 19. Consultar last state

```powershell
kubectl get pod `
  <pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.status.containerStatuses[0].lastState.terminated}"
```

Procure:

```text
reason:

OOMKilled.
```

---

### 20. Consultar logs anteriores

```powershell
kubectl logs `
  <pod> `
  --namespace `
  formacao-java-dev `
  --previous
```

Pode não existir log conclusivo.

Isso é esperado em alguns OOMKills.

---

### 21. Restaurar memória

Retorne:

```yaml
limits:
  memory:
    512Mi
```

Libere a carga do laboratório.

Aplique e valide:

```text
2 Pods Ready;

restart estabilizado;

2 endpoints.
```

---

### 22. Criar Pod impossível de agendar

Crie localmente um manifest temporário:

```yaml
apiVersion:
  v1

kind:
  Pod

metadata:
  name:
    unschedulable-lab

  namespace:
    formacao-java-dev

spec:
  containers:
    - name:
        pause

      image:
        registry.k8s.io/pause:3.10

      resources:
        requests:
          cpu:
            "100"

          memory:
            100Gi

  restartPolicy:
    Never
```

A imagem não precisa iniciar porque o scheduler deve bloquear antes.

---

### 23. Observar Pending

Aplique:

```powershell
kubectl apply `
  -f `
  "<manifest-temporario>"
```

Consulte:

```powershell
kubectl describe pod `
  unschedulable-lab `
  --namespace `
  formacao-java-dev
```

Observe:

```text
Insufficient cpu;

Insufficient memory.
```

---

### 24. Remover o Pod temporário

```powershell
kubectl delete pod `
  unschedulable-lab `
  --namespace `
  formacao-java-dev
```

O manifest temporário não entra no Git.

---

### 25. Calcular capacidade de rollout

Com:

```text
réplicas:
2.

maxSurge:
1.

request por Pod:
100m e 256Mi.
```

O rollout pode exigir:

```text
300m CPU;

768Mi memory
```

somente para os containers principais.

Inclua overhead e outros Pods do node.

Crie:

```text
rollout-capacity-policy.yaml.
```

---

### 26. Simular rollout sem capacidade

Aumente temporariamente o memory request para um valor que não permita o terceiro Pod.

Aplique uma mudança no Pod template.

Observe:

- novo Pod Pending;
- Pods antigos preservados;
- rollout incompleto;
- events de insuficiência.

Restaure.

---

### 27. Criar inspector de resources

Arquivo:

```text
inspect-pod-resources.ps1
```

Mostre:

- request;
- limit;
- QoS;
- restart;
- last state;
- node;
- phase;
- Ready.

---

### 28. Criar script de throttling

Arquivo:

```text
simulate-cpu-throttling.ps1
```

Responsabilidades:

- confirmar context;
- confirmar namespace;
- aplicar limit temporário;
- gerar carga com timeout;
- coletar métricas;
- restaurar em `finally`;
- falhar se a baseline não for restaurada.

---

### 29. Criar script de OOM

Arquivo:

```text
simulate-memory-oom.ps1
```

Responsabilidades:

- confirmar cluster local;
- garantir apenas uma réplica afetada quando possível;
- aplicar limit temporário;
- gerar pressão limitada;
- observar `OOMKilled`;
- coletar last state;
- restaurar;
- validar Service.

---

### 30. Criar observability contract

Arquivo:

```text
resource-observability-contract.yaml
```

Campos:

- CPU usage;
- CPU throttling;
- memory working set;
- heap;
- non-heap;
- OOM count;
- restart count;
- Pending duration;
- rollout duration;
- QoS.

---

### 31. Criar evidence

Arquivo:

```text
kubernetes-resource-evidence.json.
```

Campos permitidos:

- node capacity;
- node allocatable;
- request;
- limit;
- QoS;
- baseline sample count;
- CPU throttling observed;
- latency impact;
- OOMKilled observed;
- last exit reason;
- unschedulable observed;
- rollout capacity checked;
- baseline restored;
- ready replicas;
- ready endpoints;
- timestamp.

Sem logs brutos, kubeconfig ou secrets.

---

### 32. Criar documentação

#### `CPU_REQUESTS_LIMITS.md`

Unidades, scheduling, shares e throttling.

#### `MEMORY_REQUESTS_LIMITS.md`

Working set, OOM e margem.

#### `KUBERNETES_QOS_CLASSES.md`

Guaranteed, Burstable e BestEffort.

#### `JVM_MEMORY_IN_CONTAINERS.md`

Heap, metaspace, direct memory e stacks.

#### `CPU_THROTTLING_GUIDE.md`

Sinais, causas e investigação.

#### `OOMKILLED_RUNBOOK.md`

Last state, logs, métricas e recuperação.

#### `ROLLOUT_CAPACITY_PLANNING.md`

Réplicas, surge, requests e node capacity.

---

### 33. Criar test matrix

Arquivo:

```text
RESOURCE_TEST_MATRIX.md
```

Cenários:

- baseline;
- CPU burst;
- CPU limit baixo;
- throttling;
- readiness lenta;
- CPU restaurada;
- memory pressure;
- OOMKilled;
- restart;
- memória restaurada;
- Pod unschedulable;
- insufficient CPU;
- insufficient memory;
- rollout sem capacidade;
- QoS Burstable;
- QoS Guaranteed conceitual;
- BestEffort bloqueado;
- evidence sanitizada;
- baseline restaurada.

---

### 34. Criar troubleshooting

Arquivo:

```text
RESOURCE_TROUBLESHOOTING.md
```

Inclua:

- Pending;
- Insufficient cpu;
- Insufficient memory;
- CPU throttling;
- latência alta;
- readiness oscilando;
- OOMKilled;
- Java OutOfMemoryError;
- restart sem logs;
- rollout incompleto;
- request alto;
- limit baixo;
- node pressure;
- QoS inesperada;
- sidecar sem resources;
- unidade `m` incorreta.

---

### 35. Restaurar a baseline

Execute:

```powershell
.\scripts\kubernetes\resources\restore-resource-baseline.ps1
```

O script precisa restaurar:

```text
request CPU:
100m.

request memory:
256Mi.

limit CPU:
500m.

limit memory:
512Mi.

resource scenario:
normal.
```

Depois:

```text
2 Pods Ready;

2 endpoints prontos;

sem Pending;

restart estável.
```

---

### 36. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\resources\inspect-node-capacity.ps1

.\scripts\kubernetes\resources\inspect-pod-resources.ps1

.\scripts\kubernetes\resources\measure-resource-baseline.ps1

.\scripts\kubernetes\resources\inspect-pod-qos.ps1

.\scripts\kubernetes\resources\collect-resource-evidence.ps1

.\scripts\kubernetes\resources\restore-resource-baseline.ps1
```

Finalize:

```powershell
kubectl get deployment,pod,service,endpointslice `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

---

## Entendendo o que foi feito

### Requests ganharam efeito no scheduler

O Pod impossível permaneceu Pending antes de iniciar.

### Limits ganharam efeitos diferentes

CPU limit provocou lentidão; memory limit provocou encerramento.

### QoS ficou observável

A baseline foi classificada como Burstable.

### A JVM ganhou contexto de container

Heap deixou de ser confundido com memória total.

### Probes ganharam diagnóstico complementar

Readiness lenta pôde ser causada por throttling.

### OOM ganhou evidência correta

Last state mostrou `OOMKilled`.

### Rollout ganhou planejamento de capacidade

`maxSurge` passou a entrar no cálculo.

### Métricas ganharam método

Baseline, pico e carga sustentada foram separados.

### A baseline foi restaurada

Nenhum cenário de pressão permaneceu ativo.

### A próxima aula ganhou um workload estável

Ingress será estudado sem ruído de recursos mal dimensionados.

---

## Erros comuns importantes

### Copiar valores de outro sistema

Cada workload possui perfil diferente.

### Usar média como request

Picos e startup ficam invisíveis.

### Igualar heap ao memory limit

Memória nativa fica sem margem.

### Remover CPU limit sem política

Um Pod pode afetar vizinhos.

### Usar CPU limit baixo demais

Throttling pode parecer lentidão da aplicação.

### Aumentar memory limit sem investigar

Memory leak pode continuar.

### Confundir OOMKilled com liveness

O kernel encerrou o processo.

### Ignorar QoS de sidecars

A classe considera todos os containers.

### Usar `400m` para memória

O valor não significa 400 megabytes.

### Definir requests acima do necessário

Pods ficam Pending e custo aumenta.

### Esquecer maxSurge

O rollout pode precisar de capacidade extra.

### Antecipar Ingress

A aula 532 possui esse objetivo.

---

## Comandos úteis

### Inspecionar resources

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.template.spec.containers[0].resources}"
```

### Consultar QoS

```powershell
kubectl get pod `
  <pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.status.qosClass}"
```

### Consultar last state

```powershell
kubectl get pod `
  <pod> `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.status.containerStatuses[0].lastState}"
```

### Consultar node

```powershell
kubectl describe node `
  formacao-java-control-plane
```

### Consultar events

```powershell
kubectl get events `
  --namespace `
  formacao-java-dev `
  --sort-by `
  ".metadata.creationTimestamp"
```

---

## Exercício guiado

### Parte 1 — Capacidade

Inspecione capacity e allocatable.

### Parte 2 — Baseline

Meça CPU e memória.

### Parte 3 — QoS

Classifique o Pod.

### Parte 4 — CPU

Provoque throttling.

### Parte 5 — Recovery

Restaure CPU.

### Parte 6 — Memory

Provoque `OOMKilled`.

### Parte 7 — Diagnosis

Consulte last state e logs.

### Parte 8 — Scheduling

Crie Pod impossível.

### Parte 9 — Rollout

Calcule capacidade de surge.

### Parte 10 — Restore

Retorne à baseline.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 530 foi preservada;
- request foi definido;
- limit foi definido;
- CPU request foi explicado;
- CPU limit foi explicado;
- memory request foi explicado;
- memory limit foi explicado;
- millicpu foi explicado;
- `1000m = 1 CPU` foi registrado;
- Mi e Gi foram explicados;
- decimal e binário foram diferenciados;
- CPU foi classificada como compressível;
- memória foi classificada como não compressível;
- throttling foi definido;
- OOMKilled foi definido;
- Guaranteed foi definida;
- Burstable foi definida;
- BestEffort foi definida;
- node capacity foi definida;
- node allocatable foi definida;
- unschedulable foi definido;
- context kind foi validado;
- preflight foi executado;
- duas réplicas Ready foram confirmadas;
- dois endpoints prontos foram confirmados;
- node capacity foi inspecionada;
- allocatable foi inspecionado;
- allocated resources foram inspecionados;
- requests do Deployment foram inspecionados;
- limits do Deployment foram inspecionados;
- QoS Burstable foi confirmada;
- resource policy foi criada;
- medição de startup foi exigida;
- steady state foi exigido;
- peak foi exigido;
- sustained load foi exigido;
- QoS policy foi criada;
- BestEffort foi proibido para a aplicação;
- Guaranteed foi discutido;
- JVM policy foi criada;
- heap foi diferenciado de container limit;
- metaspace foi considerado;
- direct buffers foram considerados;
- thread stacks foram consideradas;
- code cache foi considerado;
- cenário de resources foi criado;
- cenário ficou limitado ao profile local;
- baseline foi medida por múltiplos samples;
- CPU mínima foi registrada;
- CPU mediana foi registrada;
- CPU máxima foi registrada;
- memória mínima foi registrada;
- memória mediana foi registrada;
- memória máxima foi registrada;
- heap foi observado;
- non-heap foi observado;
- restart count foi observado;
- CPU burst foi simulado;
- CPU limit foi reduzido temporariamente;
- throttling foi observado;
- latência foi comparada;
- container não foi encerrado apenas por CPU;
- CPU baseline foi restaurada;
- memory pressure foi simulada;
- memory limit foi reduzido temporariamente;
- OOM controlado foi provocado;
- restart foi observado;
- last state foi consultado;
- reason OOMKilled foi observada;
- logs previous foram consultados;
- ausência de log conclusivo foi considerada;
- memory baseline foi restaurada;
- Pods voltaram a Ready;
- EndpointSlices voltaram a prontos;
- Pod impossível foi criado temporariamente;
- request impossível foi usado;
- Pod Pending foi observado;
- Insufficient cpu foi observado quando aplicável;
- Insufficient memory foi observado;
- Pod temporário foi removido;
- manifest temporário não foi commitado;
- capacidade do rollout foi calculada;
- terceira réplica temporária foi considerada;
- overhead foi considerado;
- rollout sem capacidade foi simulado;
- novo Pod Pending foi observado;
- Pods antigos foram preservados;
- alteração foi restaurada;
- inspector de resources foi criado;
- script de throttling foi criado;
- script restaura em finally;
- script de OOM foi criado;
- apenas cluster local foi permitido;
- observability contract foi criado;
- evidence foi criada;
- evidence não contém secrets;
- evidence não contém kubeconfig;
- evidence não contém logs brutos;
- documentação de CPU foi criada;
- documentação de memória foi criada;
- documentação de QoS foi criada;
- documentação da JVM foi criada;
- guia de throttling foi criado;
- runbook de OOMKilled foi criado;
- planejamento de rollout foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- unidade `m` de memória foi alertada;
- LimitRange foi discutido sem implementação;
- ResourceQuota foi discutida sem implementação;
- ephemeral storage foi discutido sem aprofundamento;
- Metrics Server não foi requisito;
- HPA não foi criado;
- Ingress não foi criado;
- baseline foi restaurada;
- cenário normal foi confirmado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 532 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/resources `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/configuration/configmap.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/workloads/deployment.yaml `
  scripts/kubernetes/resources `
  docs/devops/kubernetes-resources `
  docs/diario-de-bordo.md
```

Adicione código de suporte ao cenário somente se estiver isolado ao profile local e possuir testes.

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
      "password|token|client-key-data|heapdump"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): dimensionar requests e limits"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- Secret real;
- token;
- heap dump;
- logs brutos;
- evidence não sanitizada;
- manifest temporário impossível;
- cenário de carga ativo;
- limits reduzidos;
- memory pressure ativa;
- Ingress da aula 532.

---

## Fechamento e ponte para a próxima aula

Nesta aula, CPU e memória deixaram de ser números decorativos no manifest.

Você comprovou que:

- request participa do scheduling;
- limit contém o consumo;
- CPU é compressível;
- memória pode encerrar o processo;
- throttling aumenta latência;
- `OOMKilled` aparece no last state;
- QoS depende das declarações de todos os containers;
- heap não representa toda a memória da JVM;
- rollout precisa de capacidade para surge;
- request alto pode impedir scheduling;
- limit baixo pode gerar instabilidade;
- medição precisa incluir startup, estado estável e pico;
- baseline precisa ser restaurada após experimentos.

A próxima aula será:

```text
532 - M17.27 - Ingress
```

Nela, você irá adicionar uma camada de entrada HTTP ao cluster, configurar host e path routing e comparar Service interno com exposição por Ingress.

Nenhum Ingress, Ingress Controller, TLS ou DNS foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Inspecionei capacity e allocatable.
- [ ] Confirmei a QoS.
- [ ] Medi a baseline.
- [ ] Observei CPU throttling.
- [ ] Observei `OOMKilled`.
- [ ] Simulei Pod Pending.
- [ ] Calculei capacidade de rollout.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O Pod fica Pending

Consulte events e compare requests com allocatable.

### A aplicação fica lenta sem restart

Pode existir CPU throttling.

### Readiness começa a oscilar

CPU insuficiente pode atrasar o endpoint.

### O container reinicia com `OOMKilled`

Memory limit ou consumo precisa ser investigado.

### Existe `OutOfMemoryError`, mas não `OOMKilled`

A JVM pode ter atingido o heap antes do cgroup.

### Não existem logs anteriores

O processo pode ter sido encerrado abruptamente.

### O rollout não cria a réplica nova

`maxSurge` pode não caber no node.

### A QoS aparece diferente do esperado

Revise todos os containers, inclusive sidecars.

### O uso médio é baixo, mas existe throttling

Picos curtos podem atingir a quota.

### O heap cabe no limit, mas existe OOM

Memória nativa e overhead também consomem o limite.

### O manifest ainda possui limit reduzido

Execute o script de restauração antes de encerrar.

### Ingress apareceu nesta aula

Remova e preserve para a aula 532.

---

## Perguntas de revisão

1. O que é request?
2. O que é limit?
3. Como CPU request afeta scheduling?
4. Como CPU limit afeta execução?
5. Como memory limit afeta execução?
6. O que significa `100m`?
7. Qual a diferença entre `M` e `Mi`?
8. O que é throttling?
9. O que é `OOMKilled`?
10. O que é QoS Guaranteed?
11. O que é QoS Burstable?
12. O que é QoS BestEffort?
13. O que é allocatable?
14. Por que o Pod fica Pending?
15. Heap é igual à memória do container?
16. Por que considerar `maxSurge`?
17. Por que medir picos?
18. O que faz LimitRange?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Necessidade para scheduling.
2. Teto de consumo.
3. Reserva capacidade declarada.
4. Pode provocar throttling.
5. Pode provocar OOMKilled.
6. Um décimo de CPU.
7. Decimal e binário.
8. Pausa pela quota de CPU.
9. Encerramento por memória.
10. Requests iguais aos limits.
11. Declaração parcial ou desigual.
12. Sem requests e limits.
13. Capacidade para Pods.
14. Request não cabe.
15. Não.
16. Rollout cria Pod extra.
17. Média esconde risco.
18. Defaults e limites de namespace.
19. Ingress.
20. Ingress.

---

## Desafio opcional

Modele uma versão Guaranteed do workload.

Requisitos:

- requests iguais a limits;
- CPU e memória;
- cálculo para duas réplicas;
- cálculo para `maxSurge`;
- confirmação da QoS;
- comparação com Burstable;
- medição de throttling;
- análise de custo;
- baseline original restaurada;
- nenhum Ingress.

O objetivo é compreender previsibilidade, densidade e custo entre classes de QoS.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 531 - M17.26 - Requests limits

- Continuei após o aprofundamento das probes.
- Diferenciei requests e limits.
- Estudei unidades de CPU e memória.
- Relacionei requests ao scheduler.
- Relacionei CPU limit ao throttling.
- Relacionei memory limit ao `OOMKilled`.
- Estudei QoS Guaranteed, Burstable e BestEffort.
- Confirmei o workload como Burstable.
- Inspecionei capacity, allocatable e allocated resources.
- Criei policies de resources, QoS e JVM.
- Diferenciei heap e memória total do container.
- Considerei metaspace, direct buffers, stacks e code cache.
- Medi baseline com múltiplos samples.
- Simulei CPU burst.
- Reduzi CPU limit temporariamente.
- Observei throttling e impacto de latência.
- Restaurei CPU.
- Simulei pressão de memória.
- Reduzi memory limit temporariamente.
- Observei `OOMKilled` e restart.
- Consultei last state e logs previous.
- Restaurei memória.
- Criei Pod impossível de agendar.
- Observei Pending e insuficiência de recursos.
- Calculei capacidade para `maxSurge`.
- Simulei rollout sem capacidade.
- Criei scripts, evidence, test matrix e troubleshooting.
- Restaurei a baseline com duas réplicas e dois endpoints.
- Não antecipei Ingress.
- Próxima aula: Ingress.
```

---

## Referência técnica curta

- Kubernetes Resource Management for Pods and Containers.
- Kubernetes CPU Units.
- Kubernetes Memory Units.
- Kubernetes Pod Quality of Service Classes.
- Kubernetes Node Allocatable.
- Kubernetes Scheduling.
- Linux Control Groups.
- JVM Container Awareness.
- CPU Throttling.
- Kubernetes OOMKilled Troubleshooting.

Regra final:

```text
requests e limits transformam CPU e memória em contratos operacionais: requests participam do scheduling e da capacidade prometida, enquanto CPU limit pode provocar throttling e memory limit pode encerrar o processo com OOMKilled; millicpu, Mi e Gi precisam ser usados corretamente, CPU é compressível e memória não, e a QoS Guaranteed, Burstable ou BestEffort depende de todos os containers do Pod; a JVM utiliza heap, metaspace, code cache, stacks, buffers diretos e memória nativa, portanto o heap não ocupa todo o container limit; baseline, startup, pico e carga sustentada são medidos antes de alterar valores, last state e logs previous diferenciam OOM de falha de probe, e capacity, allocatable, requests de réplicas e maxSurge determinam se o rollout cabe no node; após simular throttling, OOMKilled, Pod Pending e rollout sem capacidade, CPU, memória, cenário e réplicas retornam à baseline; com o workload estável e dimensionado, a aula 532 poderá introduzir Ingress sem mascarar problemas de capacidade.
```
