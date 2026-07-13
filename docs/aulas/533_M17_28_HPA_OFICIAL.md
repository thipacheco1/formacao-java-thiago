# 533 - M17.28 - HPA

## Apresentação da aula

Na aula 532, a aplicação recebeu uma camada de entrada HTTP por meio de:

```text
Ingress;

IngressClass;

Ingress Controller;

Service;

EndpointSlice;

Pods.
```

A rota externa local permaneceu estável mesmo quando os Pods foram recriados.

Na aula 531, o workload também recebeu um contrato explícito de CPU e memória:

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

Essa combinação permite responder à pergunta central desta aula:

```text
como aumentar
ou reduzir
automaticamente
o número de Pods

quando a carga
do workload muda?
```

A resposta será construída com:

```text
HorizontalPodAutoscaler;

HPA.
```

O HPA observa métricas e ajusta a quantidade de réplicas de um workload escalável.

Nesta aula, o alvo será:

```text
Deployment orders-api.
```

O HPA não cria um novo tipo de aplicação.

Ele altera o subresource:

```text
scale
```

do Deployment.

A cadeia operacional ficará:

```text
carga HTTP
    |
    v
Ingress
    |
    v
Service
    |
    v
Pods
    |
    v
uso de CPU
    |
    v
Metrics Server
    |
    v
metrics.k8s.io
    |
    v
HPA Controller
    |
    v
Deployment replicas
```

A regra central será:

```text
métrica mede;

HPA decide;

Deployment reconcilia;

Service descobre
as novas réplicas.
```

O HPA não cria Pods diretamente.

Ele ajusta a quantidade desejada do Deployment.

O Deployment cria ou remove Pods por meio do ReplicaSet.

O Service e o Ingress não precisam ser recriados quando o número de Pods muda.

Outro ponto fundamental será:

```text
HPA de CPU depende
de CPU request.
```

Quando o target utiliza:

```yaml
type:
  Utilization
```

o percentual é calculado em relação ao request de CPU.

Exemplo:

```text
request:
100m.

uso:
60m.

utilização:
60%.
```

Se o container não possui request de CPU, o HPA não consegue calcular corretamente a utilização percentual daquele container para essa métrica.

A aula anterior deixou o request explícito exatamente para preparar esse comportamento.

A fórmula conceitual usada pelo autoscaler é:

```text
réplicas desejadas
=
arredondamento para cima
de

réplicas atuais
x
métrica atual
/
métrica desejada.
```

Exemplo:

```text
réplicas atuais:
2.

utilização média:
120%.

target:
60%.

réplicas desejadas:
ceil(2 x 120 / 60)
=
4.
```

A fórmula é uma aproximação do raciocínio central.

O controller ainda considera:

- tolerância;
- métricas ausentes;
- Pods não prontos;
- startup;
- limites mínimos e máximos;
- stabilization window;
- policies de scale-up e scale-down.

Nesta aula, o HPA utilizará:

```yaml
apiVersion:
  autoscaling/v2
```

Essa versão permite configurar:

- múltiplas métricas;
- behavior;
- stabilization;
- policies;
- targets diferentes.

A baseline prática utilizará CPU:

```text
averageUtilization:
60%.
```

O intervalo de réplicas será:

```text
minReplicas:
2.

maxReplicas:
6.
```

O valor mínimo preserva a disponibilidade já praticada no laboratório.

O valor máximo impede que uma carga artificial tente criar Pods sem limite.

Esses números são didáticos.

Em produção, eles precisam ser definidos por:

- capacidade do cluster;
- SLO;
- throughput por Pod;
- requests;
- custo;
- dependências;
- banco;
- Kafka;
- rate limits;
- comportamento do downstream;
- estratégia de incidentes.

Outro princípio será:

```text
autoscaling
não cria capacidade
no node.
```

O HPA pode pedir seis Pods.

Se o node só comporta três:

```text
os Pods adicionais
ficam Pending.
```

HPA de workload e autoscaling de nodes são responsabilidades diferentes.

O cluster local possui apenas um node.

Essa limitação será observada e respeitada.

Escalar a aplicação pode mover o gargalo para banco, Kafka, serviços externos ou node. A capacidade das dependências precisa acompanhar a política do HPA.

Outro conceito será a fonte de métricas.

O HPA de CPU e memória costuma consultar a API:

```text
metrics.k8s.io.
```

Essa API é normalmente fornecida por:

```text
Metrics Server.
```

Metrics Server coleta métricas de recursos dos nodes e Pods.

Ele não é uma plataforma completa de monitoramento de longo prazo.

Ele não substitui:

- Prometheus;
- Grafana;
- APM;
- logs;
- tracing;
- alertas;
- histórico de capacidade.

Seu papel nesta aula será alimentar:

```text
kubectl top;

HPA de CPU.
```

O cluster `kind` receberá Metrics Server por meio do chart oficial.

A instalação exigirá:

- repositório oficial;
- chart version explícita;
- registro de app version;
- namespace `kube-system`;
- rollout saudável;
- APIService disponível;
- `kubectl top` funcional.

No cluster local, o certificado do kubelet pode não atender à validação esperada pelo Metrics Server.

O laboratório adicionará:

```text
--kubelet-insecure-tls.
```

Esse argumento será usado somente no `kind`.

Ele não é uma recomendação para produção.

Em produção, certificados, identidade e conectividade entre Metrics Server e kubelets precisam ser configurados corretamente.

Outro conceito será HPA status.

O resource apresenta campos como:

- current replicas;
- desired replicas;
- current metrics;
- last scale time;
- conditions.

Condições importantes incluem:

```text
AbleToScale;

ScalingActive;

ScalingLimited.
```

#### `AbleToScale`

Indica se o controller consegue acessar e ajustar o target.

#### `ScalingActive`

Indica se a métrica pode ser calculada e usada.

#### `ScalingLimited`

Indica se a recomendação foi limitada por `minReplicas` ou `maxReplicas`.

Outro tema será scale-up.

Quando a carga cresce, o HPA pode aumentar réplicas.

A configuração desta aula permitirá aumento relativamente rápido, mas limitado.

Exemplo:

```yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds:
      0

    selectPolicy:
      Max

    policies:
      - type:
          Percent

        value:
          100

        periodSeconds:
          60

      - type:
          Pods

        value:
          2

        periodSeconds:
          60
```

Isso não significa que a aplicação sempre dobrará.

As policies limitam a velocidade máxima permitida.

A recomendação ainda depende da métrica e de `maxReplicas`.

Outro tema será scale-down.

Reduzir réplicas rapidamente pode causar oscilação.

Exemplo:

```text
carga cai;

HPA remove Pods;

carga volta;

HPA cria Pods;

carga cai;

HPA remove novamente.
```

Esse comportamento é conhecido como:

```text
flapping;

thrashing.
```

A baseline utilizará uma janela de estabilização para scale-down:

```text
300 segundos.
```

Durante essa janela, o controller considera recomendações anteriores para evitar redução precipitada.

Também limitará a remoção.

Outro princípio será:

```text
scale-up pode ser rápido;

scale-down precisa
ser conservador.
```

Readiness continua essencial: réplicas novas só entram no Service quando ficam prontas. Enquanto o HPA estiver ativo, `kubectl scale` é temporário e o manifest não deve disputar `spec.replicas`.

A carga reutilizará o endpoint local `/lab/resources/cpu`, limitado por profile, duração e timeout. O script enviará requisições concorrentes pelo Ingress usando `Host: orders.local`.

No scale-up, você observará CPU, desired replicas, novos Pods, readiness e EndpointSlices. Após a carga, acompanhará a estabilização e a redução gradual até `minReplicas: 2`, com timestamps e timeout.

Ingress e Service não precisam conhecer a quantidade de réplicas. Quando novos Pods ficam Ready, EndpointSlices são atualizados e o tráfego passa a alcançá-los.

A evidence registrará versões do Metrics Server, disponibilidade da API, target, limites, pico de CPU, pico de réplicas, tempos de escala, conditions, endpoints e restauração da baseline.

Outro tema será a próxima aula.

A próxima aula será:

```text
534 - M17.29 - Volumes Kubernetes
```

Portanto, esta aula não criará:

- PersistentVolume;
- PersistentVolumeClaim;
- StorageClass;
- StatefulSet;
- volume persistente;
- banco dentro do cluster;
- backup de volume.

A aplicação continuará stateless para o HPA.

Esse detalhe é importante.

Escala horizontal é mais simples quando cada réplica pode ser substituída sem depender de disco local exclusivo.

Ao final, você deverá explicar:

```text
como HPA
usa métricas;

por que CPU request
é obrigatório
para utilization;

como a fórmula
estima réplicas;

como Metrics Server
alimenta a API;

como behavior
limita escala;

por que scale-down
usa estabilização;

como readiness
interage com novas réplicas;

como Service e Ingress
permanecem estáveis;

como detectar
métrica desconhecida;

como restaurar
duas réplicas
ao final.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
531:
Requests limits.

532:
Ingress.

533:
HPA.

534:
Volumes Kubernetes.

535:
PersistentVolume PersistentVolumeClaim.
```

A aula 532 respondeu:

```text
como encaminhar
tráfego HTTP
até o Service?
```

A aula 533 responderá:

```text
como ajustar
automaticamente
a quantidade de Pods
com base em métricas?
```

Nesta aula:

```text
HorizontalPodAutoscaler:
sim.

autoscaling/v2:
sim.

Metrics Server:
sim.

metrics.k8s.io:
sim.

kubectl top:
sim.

CPU utilization:
sim.

CPU request:
sim.

minReplicas:
sim.

maxReplicas:
sim.

behavior:
sim.

scaleUp:
sim.

scaleDown:
sim.

stabilization:
sim.

load test local:
sim.

Ingress durante escala:
sim.

memory metric:
conceitual.

custom metrics:
conceitual.

external metrics:
conceitual.

HPA multi-métrica:
conceitual.

VPA:
não.

node autoscaling:
não.

volumes:
não.
```

A regra central será:

```text
HPA ajusta réplicas;

Deployment cria Pods;

Service encontra Pods Ready;

Ingress mantém a rota.
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

k8s/autoscaling
├── metrics-server-kind-values.yaml
├── hpa.yaml
├── hpa-policy.yaml
├── scaling-behavior-policy.yaml
├── metrics-server-lock.example.yaml
└── autoscaling-observability-contract.yaml

scripts/kubernetes/autoscaling
├── verify-metrics-server.ps1
├── install-metrics-server.ps1
├── validate-hpa-manifest.ps1
├── apply-orders-hpa.ps1
├── start-controlled-cpu-load.ps1
├── observe-hpa-scale-up.ps1
├── observe-hpa-scale-down.ps1
├── inspect-hpa-conditions.ps1
├── collect-hpa-evidence.ps1
└── restore-hpa-baseline.ps1

docs/devops/kubernetes-autoscaling
├── HPA_ARCHITECTURE.md
├── HPA_ALGORITHM.md
├── METRICS_SERVER_GUIDE.md
├── HPA_BEHAVIOR_POLICY.md
├── HPA_READINESS_INTERACTION.md
├── HPA_CAPACITY_POLICY.md
├── HPA_RUNBOOK.md
├── HPA_TEST_MATRIX.md
└── HPA_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
Metrics Server instalado;

Metrics API disponível;

kubectl top funcional;

HPA autoscaling/v2;

target CPU 60%;

mínimo 2;

máximo 6;

scale-up observado;

scale-down observado;

Ingress estável;

evidência;

baseline restaurada.
```

Você irá:

1. confirmar cluster;
2. confirmar workload;
3. confirmar requests;
4. validar Helm;
5. criar values local;
6. resolver chart version;
7. instalar Metrics Server;
8. aguardar rollout;
9. validar APIService;
10. validar `kubectl top`;
11. criar HPA;
12. validar manifest;
13. aplicar HPA;
14. observar conditions;
15. iniciar carga;
16. observar CPU;
17. observar scale-up;
18. observar novos Pods;
19. observar endpoints;
20. encerrar carga;
21. observar stabilization;
22. observar scale-down;
23. simular métrica indisponível;
24. restaurar Metrics Server;
25. criar policies;
26. criar scripts;
27. criar docs;
28. coletar evidence;
29. restaurar baseline;
30. executar gate;
31. commitar;
32. preparar a aula 534.

---

## Conceito essencial

### HorizontalPodAutoscaler

Resource e controller que ajustam horizontalmente a quantidade de réplicas de um workload.

---

### Horizontal scaling

Adiciona ou remove réplicas.

---

### Vertical scaling

Altera recursos atribuídos às réplicas existentes.

Não será implementado nesta aula.

---

### Metrics Server

Componente que fornece métricas de CPU e memória pela API agregada.

---

### `metrics.k8s.io`

API de resource metrics usada pelo HPA e por `kubectl top`.

---

### Scale target

Workload que expõe o subresource `scale`.

Nesta aula:

```text
Deployment/orders-api.
```

---

### Average utilization

Uso médio como percentual do request.

---

### Average value

Uso médio expresso como valor absoluto.

---

### `minReplicas`

Menor quantidade permitida.

---

### `maxReplicas`

Maior quantidade permitida.

---

### HPA behavior

Políticas de velocidade e estabilização.

---

### Stabilization window

Janela que reduz flapping ao considerar recomendações anteriores.

---

### Scaling condition

Estado operacional do HPA.

---

## Mão na massa guiada

### 1. Confirmar o context

Execute:

```powershell
kubectl config current-context
```

Resultado esperado:

```text
kind-formacao-java.
```

Depois:

```powershell
.\scripts\kubernetes\kubernetes-preflight.ps1
```

---

### 2. Confirmar a aplicação

```powershell
kubectl get deployment,pod,service,endpointslice,ingress `
  --namespace `
  formacao-java-dev
```

Confirme:

```text
Deployment:
2/2 Ready.

Service:
orders-api.

EndpointSlices:
2 prontos.

Ingress:
orders-api.
```

---

### 3. Confirmar CPU request

```powershell
kubectl get deployment `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.spec.template.spec.containers[0].resources.requests.cpu}"
```

Resultado esperado:

```text
100m.
```

Sem request, o target percentual de CPU não atende ao contrato desta aula.

---

### 4. Criar values do Metrics Server

Arquivo:

```text
k8s/autoscaling/metrics-server-kind-values.yaml
```

Conteúdo:

```yaml
args:
  - --kubelet-insecure-tls
```

Essa flag é exclusiva do cluster local.

O chart mantém seus argumentos padrão e adiciona esse argumento.

---

### 5. Adicionar repositório oficial

```powershell
helm repo add `
  metrics-server `
  "https://kubernetes-sigs.github.io/metrics-server/"
```

Depois:

```powershell
helm repo update
```

---

### 6. Resolver chart version

Liste versões:

```powershell
helm search repo `
  metrics-server/metrics-server `
  --versions
```

O script exige:

```powershell
.\scripts\kubernetes\autoscaling\install-metrics-server.ps1 `
  -ChartVersion `
  "<versao-validada>"
```

A versão resolvida será registrada na evidence.

---

### 7. Instalar Metrics Server

O script executará uma operação equivalente a:

```powershell
helm upgrade `
  --install `
  metrics-server `
  metrics-server/metrics-server `
  --namespace `
  kube-system `
  --version `
  $ChartVersion `
  --values `
  "k8s/autoscaling/metrics-server-kind-values.yaml" `
  --wait `
  --timeout `
  5m
```

A instalação não usa URL de release flutuante.

---

### 8. Validar o rollout

```powershell
kubectl rollout status `
  deployment/metrics-server `
  --namespace `
  kube-system `
  --timeout `
  300s
```

Depois:

```powershell
kubectl get pod `
  --namespace `
  kube-system `
  -l `
  "app.kubernetes.io/name=metrics-server"
```

---

### 9. Validar a API agregada

```powershell
kubectl get apiservice `
  v1beta1.metrics.k8s.io
```

Depois:

```powershell
kubectl get apiservice `
  v1beta1.metrics.k8s.io `
  -o `
  "jsonpath={.status.conditions[?(@.type=='Available')].status}"
```

Resultado esperado:

```text
True.
```

---

### 10. Validar `kubectl top`

Aguarde as primeiras coletas.

Execute:

```powershell
kubectl top node
```

Depois:

```powershell
kubectl top pod `
  --namespace `
  formacao-java-dev
```

Se as métricas ainda não aparecerem, aguarde uma nova resolução antes de concluir que falhou.

---

### 11. Criar o HPA

Arquivo:

```text
k8s/autoscaling/hpa.yaml
```

Conteúdo:

```yaml
apiVersion:
  autoscaling/v2

kind:
  HorizontalPodAutoscaler

metadata:
  name:
    orders-api

  namespace:
    formacao-java-dev

  labels:
    app.kubernetes.io/name:
      formacao-java-integrations

    app.kubernetes.io/instance:
      orders-api-dev

    app.kubernetes.io/component:
      autoscaling

    app.kubernetes.io/part-of:
      formacao-java

    app.kubernetes.io/managed-by:
      kubectl

spec:
  scaleTargetRef:
    apiVersion:
      apps/v1

    kind:
      Deployment

    name:
      orders-api

  minReplicas:
    2

  maxReplicas:
    6

  metrics:
    - type:
        Resource

      resource:
        name:
          cpu

        target:
          type:
            Utilization

          averageUtilization:
            60

  behavior:
    scaleUp:
      stabilizationWindowSeconds:
        0

      selectPolicy:
        Max

      policies:
        - type:
            Percent

          value:
            100

          periodSeconds:
            60

        - type:
            Pods

          value:
            2

          periodSeconds:
            60

    scaleDown:
      stabilizationWindowSeconds:
        300

      selectPolicy:
        Min

      policies:
        - type:
            Percent

          value:
            25

          periodSeconds:
            60

        - type:
            Pods

          value:
            1

          periodSeconds:
            60
```

---

### 12. Validar o manifest

Execute:

```powershell
kubectl apply `
  --server-side `
  --dry-run=server `
  -f `
  "k8s/autoscaling/hpa.yaml"
```

O validator também verifica:

- target existe;
- CPU request existe;
- min é menor ou igual ao estado atual;
- max é maior que min;
- target está entre 1 e 100;
- behavior possui limites;
- namespace está correto.

---

### 13. Aplicar o HPA

```powershell
kubectl apply `
  -f `
  "k8s/autoscaling/hpa.yaml"
```

---

### 14. Observar o HPA

```powershell
kubectl get hpa `
  orders-api `
  --namespace `
  formacao-java-dev
```

Depois:

```powershell
kubectl describe hpa `
  orders-api `
  --namespace `
  formacao-java-dev
```

A métrica pode aparecer inicialmente como desconhecida até a coleta ficar disponível.

---

### 15. Validar conditions

O script:

```text
inspect-hpa-conditions.ps1
```

registra:

- `AbleToScale`;
- `ScalingActive`;
- `ScalingLimited`;
- reason;
- message;
- current replicas;
- desired replicas.

Sem logs brutos.

---

### 16. Ajustar ownership de réplicas

Depois de validar que o HPA está ativo, remova de forma controlada o campo fixo:

```yaml
spec:
  replicas:
```

do manifest versionado do Deployment.

Aplique em uma janela observada.

Confirme que o HPA preserva pelo menos:

```text
2 réplicas.
```

O objetivo é evitar que futuros applies reescrevam continuamente o valor controlado pelo HPA.

---

### 17. Confirmar o Ingress local

Inicie o port-forward do controller:

```powershell
kubectl port-forward `
  service/ingress-nginx-controller `
  18080:80 `
  --namespace `
  ingress-nginx
```

Valide:

```powershell
curl.exe `
  --header `
  "Host: orders.local" `
  "http://localhost:18080/actuator/health/readiness"
```

---

### 18. Iniciar carga controlada

Execute:

```powershell
.\scripts\kubernetes\autoscaling\start-controlled-cpu-load.ps1 `
  -BaseUri `
  "http://localhost:18080" `
  -HostName `
  "orders.local" `
  -DurationSeconds `
  180 `
  -Workers `
  6
```

O script chama apenas o endpoint local de laboratório:

```text
/lab/resources/cpu.
```

Cada worker possui timeout e cancelamento.

---

### 19. Observar CPU

Em outro terminal:

```powershell
kubectl top pod `
  --namespace `
  formacao-java-dev
```

Repita em intervalos.

Observe o uso relativo ao request de:

```text
100m.
```

---

### 20. Observar scale-up

```powershell
kubectl get hpa `
  orders-api `
  --namespace `
  formacao-java-dev `
  --watch
```

Em outro terminal:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  --watch
```

Registre:

- início da carga;
- primeiro target acima de 60%;
- primeira mudança de desired replicas;
- novo Pod criado;
- novo Pod Ready;
- novo endpoint pronto.

---

### 21. Observar EndpointSlices

```powershell
kubectl get endpointslice `
  --namespace `
  formacao-java-dev `
  --selector `
  "kubernetes.io/service-name=orders-api" `
  -o wide
```

O Service incorpora as novas réplicas somente quando elas ficam prontas.

---

### 22. Confirmar a rota durante a escala

Continue enviando requisições pelo Ingress.

Confirme:

- host permanece o mesmo;
- Service permanece o mesmo;
- novos Pods entram sem alterar o cliente;
- erros não aumentam de forma inesperada.

---

### 23. Encerrar a carga

O script termina automaticamente.

Confirme que nenhum job local permanece enviando requisições.

---

### 24. Observar scale-down

Execute:

```powershell
.\scripts\kubernetes\autoscaling\observe-hpa-scale-down.ps1 `
  -TimeoutMinutes `
  12
```

O script registra:

- CPU caindo;
- desired replicas;
- janela de estabilização;
- primeira redução;
- retorno a duas réplicas.

Não force a redução manual durante a observação.

---

### 25. Consultar o histórico de eventos

```powershell
kubectl get events `
  --namespace `
  formacao-java-dev `
  --sort-by `
  ".metadata.creationTimestamp"
```

Procure eventos de rescale do HPA e criação dos Pods.

---

### 26. Simular métrica indisponível

Em cenário controlado, escale o Metrics Server para zero:

```powershell
kubectl scale `
  deployment/metrics-server `
  --replicas `
  0 `
  --namespace `
  kube-system
```

Observe:

- `kubectl top` falha;
- HPA mostra métrica desconhecida;
- `ScalingActive` muda;
- Pods atuais continuam executando.

Não gere carga nesse período.

---

### 27. Restaurar Metrics Server

Execute:

```powershell
helm upgrade `
  --install `
  metrics-server `
  metrics-server/metrics-server `
  --namespace `
  kube-system `
  --version `
  $ChartVersion `
  --values `
  "k8s/autoscaling/metrics-server-kind-values.yaml" `
  --wait `
  --timeout `
  5m
```

Valide APIService e `kubectl top` novamente.

---

### 28. Criar policy de HPA

Arquivo:

```text
k8s/autoscaling/hpa-policy.yaml
```

Inclua:

```yaml
hpa:
  apiVersion:
    autoscaling/v2

  resources:
    requestsRequired:
      true

  replicas:
    min:
      2

    max:
      6

  metrics:
    cpu:
      targetAverageUtilization:
        60

  production:
    loadTestRequired:
      true

    dependencyCapacityRequired:
      true

    nodeCapacityRequired:
      true
```

---

### 29. Criar policy de behavior

Arquivo:

```text
scaling-behavior-policy.yaml
```

Documente:

- scale-up rápido e limitado;
- scale-down conservador;
- stabilization de 300 segundos;
- máximo de uma remoção por período;
- min e max;
- rollback;
- owners;
- revisão de SLO.

---

### 30. Criar lock do Metrics Server

Arquivo:

```text
metrics-server-lock.example.yaml
```

Campos:

- chart;
- chart version;
- app version;
- repository;
- namespace;
- local-only args;
- installed at;
- validated Kubernetes version.

O arquivo de exemplo não inventa a versão.

A evidence registra a versão real.

---

### 31. Criar contrato de observabilidade

Arquivo:

```text
autoscaling-observability-contract.yaml
```

Campos:

- current CPU;
- target CPU;
- current replicas;
- desired replicas;
- ready replicas;
- pending replicas;
- scale events;
- time to Ready;
- time to scale-up;
- time to scale-down;
- maxReplicas reached;
- Metrics API available.

---

### 32. Criar scripts

Os scripts precisam:

- exigir context `kind-formacao-java`;
- exigir namespace allowlist;
- limitar duração;
- limitar workers;
- validar host local;
- encerrar jobs em `finally`;
- restaurar Metrics Server;
- restaurar minReplicas;
- validar endpoints;
- não executar contra host externo.

---

### 33. Criar evidence

Arquivo:

```text
kubernetes-hpa-evidence.json.
```

Campos permitidos:

- context;
- Metrics Server chart;
- chart version;
- app version;
- Metrics API available;
- HPA API version;
- target workload;
- CPU request;
- CPU target;
- min replicas;
- max replicas;
- initial replicas;
- peak replicas;
- peak CPU;
- scale-up duration;
- scale-down duration;
- conditions;
- ready endpoints after scale;
- baseline restored;
- timestamp.

Sem cookies, tokens, kubeconfig ou logs brutos.

---

### 34. Criar documentação

#### `HPA_ARCHITECTURE.md`

Explique a cadeia de métricas e reconciliação.

#### `HPA_ALGORITHM.md`

Explique fórmula, tolerância, métricas ausentes e arredondamento.

#### `METRICS_SERVER_GUIDE.md`

Explique instalação, APIService e limitações.

#### `HPA_BEHAVIOR_POLICY.md`

Explique policies e stabilization.

#### `HPA_READINESS_INTERACTION.md`

Explique startup, readiness e métricas.

#### `HPA_CAPACITY_POLICY.md`

Explique node capacity, downstream e limites.

---

### 35. Criar runbook

Arquivo:

```text
HPA_RUNBOOK.md
```

Passos:

1. validar requests;
2. validar Metrics API;
3. validar min e max;
4. aplicar HPA;
5. observar conditions;
6. iniciar carga;
7. observar scale-up;
8. observar readiness;
9. encerrar carga;
10. observar scale-down;
11. registrar evidence;
12. restaurar baseline.

---

### 36. Criar test matrix

Arquivo:

```text
HPA_TEST_MATRIX.md
```

Cenários:

- Metrics Server Ready;
- APIService disponível;
- `kubectl top` funcional;
- HPA ativo;
- CPU abaixo do target;
- CPU acima do target;
- scale-up;
- maxReplicas;
- novos Pods Ready;
- EndpointSlices atualizados;
- carga encerrada;
- stabilization;
- scale-down;
- minReplicas;
- CPU request ausente;
- métrica desconhecida;
- Metrics Server indisponível;
- target inexistente;
- behavior inválido;
- baseline restaurada.

---

### 37. Criar troubleshooting

Arquivo:

```text
HPA_TROUBLESHOOTING.md
```

Inclua:

- `unknown` em TARGETS;
- Metrics API not available;
- APIService unavailable;
- x509 do kubelet;
- CPU request ausente;
- `ScalingActive=False`;
- `FailedGetResourceMetric`;
- target não encontrado;
- réplicas não aumentam;
- Pods Pending;
- scale-down demora;
- `ScalingLimited=True`;
- carga insuficiente;
- endpoint de carga desativado;
- Metrics Server sem logs úteis;
- HPA e replicas em conflito;
- baseline não restaurada.

---

### 38. Restaurar a baseline

Execute:

```powershell
.\scripts\kubernetes\autoscaling\restore-hpa-baseline.ps1
```

O script precisa confirmar:

```text
Metrics Server Ready;

Metrics API disponível;

HPA ativo;

minReplicas 2;

maxReplicas 6;

carga encerrada;

2 Pods Ready após estabilização;

2 endpoints prontos;

Ingress saudável.
```

O HPA permanece aplicado.

A quantidade final deve retornar ao mínimo configurado.

---

### 39. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\autoscaling\verify-metrics-server.ps1

.\scripts\kubernetes\autoscaling\validate-hpa-manifest.ps1

.\scripts\kubernetes\autoscaling\apply-orders-hpa.ps1

.\scripts\kubernetes\autoscaling\inspect-hpa-conditions.ps1

.\scripts\kubernetes\autoscaling\collect-hpa-evidence.ps1

.\scripts\kubernetes\autoscaling\restore-hpa-baseline.ps1
```

Finalize:

```powershell
kubectl get hpa `
  --namespace `
  formacao-java-dev

kubectl get deployment,pod,service,endpointslice,ingress `
  --namespace `
  formacao-java-dev

kubectl top pod `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

---

## Entendendo o que foi feito

### Metrics Server tornou recursos observáveis

A API `metrics.k8s.io` passou a fornecer CPU e memória atuais.

### O HPA ganhou um target calculável

O request de CPU permitiu usar `averageUtilization`.

### O Deployment passou a ter réplicas dinâmicas

O HPA alterou o subresource de escala.

### Scale-up respondeu à carga

Novos Pods foram criados dentro das policies.

### Readiness protegeu a entrada no Service

Somente réplicas prontas entraram nos EndpointSlices.

### Ingress permaneceu estável

Host e path não mudaram durante a escala.

### Scale-down ficou conservador

A janela de estabilização reduziu flapping.

### Metrics Server virou dependência operacional

Sem métricas, o HPA não conseguiu calcular normalmente.

### O máximo virou guardrail

`maxReplicas` limitou a recomendação.

### A próxima aula ganhou um workload stateless

Volumes serão estudados sem confundir persistência com autoscaling.

---

## Erros comuns importantes

### Criar HPA sem CPU request

A utilização percentual não possui referência adequada.

### Instalar Metrics Server sem validar APIService

O Pod pode estar Running enquanto a API continua indisponível.

### Usar `latest` ou versão flutuante do chart

A instalação deixa de ser reproduzível.

### Usar `--kubelet-insecure-tls` em produção

O bypass é exclusivo do laboratório local.

### Definir maxReplicas sem capacidade

Novos Pods ficam Pending.

### Escalar aplicação e ignorar banco

O gargalo apenas muda de lugar.

### Usar memory utilization sem estudar a JVM

Heap committed pode atrasar scale-down.

### Remover réplicas rapidamente

Scale-down agressivo provoca flapping.

### Reaplicar `spec.replicas` fixo

Manifest e HPA disputam o controle.

### Esperar reação instantânea

Coleta, decisão, startup e readiness possuem atraso.

### Tratar Metrics Server como monitoramento histórico

Ele atende resource metrics do autoscaling.

### Antecipar volumes

A aula 534 possui esse objetivo.

---

## Comandos úteis

### Consultar métricas

```powershell
kubectl top pod `
  --namespace `
  formacao-java-dev
```

### Consultar HPA

```powershell
kubectl get hpa `
  --namespace `
  formacao-java-dev
```

### Descrever HPA

```powershell
kubectl describe hpa `
  orders-api `
  --namespace `
  formacao-java-dev
```

### Observar escala

```powershell
kubectl get hpa,pod `
  --namespace `
  formacao-java-dev `
  --watch
```

### Consultar Metrics API

```powershell
kubectl get `
  --raw `
  "/apis/metrics.k8s.io/v1beta1/namespaces/formacao-java-dev/pods"
```

A saída não deve ser publicada sem revisão.

---

## Exercício guiado

### Parte 1 — Metrics

Instale e valide Metrics Server.

### Parte 2 — Requests

Confirme CPU request.

### Parte 3 — HPA

Crie o resource `autoscaling/v2`.

### Parte 4 — Conditions

Observe estado e target.

### Parte 5 — Load

Gere CPU de forma controlada.

### Parte 6 — Scale-up

Acompanhe novas réplicas.

### Parte 7 — Routing

Valide Ingress e endpoints.

### Parte 8 — Scale-down

Observe stabilization.

### Parte 9 — Failure

Indisponibilize métricas temporariamente.

### Parte 10 — Restore

Retorne a duas réplicas.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 532 foi preservada;
- HPA foi definido;
- horizontal scaling foi definido;
- vertical scaling foi diferenciado;
- Metrics Server foi definido;
- `metrics.k8s.io` foi definido;
- scale target foi definido;
- average utilization foi definida;
- average value foi definida;
- `minReplicas` foi definido;
- `maxReplicas` foi definido;
- behavior foi definido;
- stabilization window foi definida;
- conditions foram definidas;
- fórmula de réplicas foi explicada;
- arredondamento para cima foi explicado;
- CPU request foi relacionado ao percentual;
- tolerância foi mencionada;
- métricas ausentes foram consideradas;
- Pods não prontos foram considerados;
- context kind foi validado;
- preflight foi executado;
- Deployment estava Ready;
- Service foi validado;
- EndpointSlices estavam prontos;
- Ingress foi validado;
- CPU request 100m foi confirmado;
- values do Metrics Server foi criado;
- `--kubelet-insecure-tls` foi limitado ao kind;
- repositório oficial foi configurado;
- chart version explícita foi exigida;
- app version foi registrada;
- Metrics Server foi instalado por Helm;
- namespace kube-system foi usado;
- rollout foi aguardado;
- Pod do Metrics Server ficou Ready;
- APIService foi validada;
- condição Available ficou True;
- `kubectl top node` funcionou;
- `kubectl top pod` funcionou;
- HPA usa `autoscaling/v2`;
- scaleTargetRef aponta para Deployment;
- minReplicas 2 foi usado;
- maxReplicas 6 foi usado;
- métrica Resource CPU foi usada;
- target Utilization foi usado;
- averageUtilization 60 foi usado;
- scaleUp behavior foi criado;
- scaleUp stabilization zero foi usado;
- scaleUp policies foram limitadas;
- scaleDown behavior foi criado;
- scaleDown stabilization 300 foi usada;
- scaleDown remove no máximo de forma controlada;
- manifest passou por server dry-run;
- target foi validado;
- request foi validado;
- HPA foi aplicado;
- status foi observado;
- `AbleToScale` foi observado;
- `ScalingActive` foi observado;
- `ScalingLimited` foi observado;
- ownership de réplicas foi documentado;
- campo fixo foi removido de forma controlada;
- minReplicas preservou duas réplicas;
- port-forward do Ingress foi usado;
- rota foi validada;
- carga ficou restrita ao endpoint local;
- duração foi limitada;
- workers foram limitados;
- CPU foi observada;
- scale-up foi observado;
- desired replicas aumentou;
- novos Pods foram criados;
- novos Pods ficaram Ready;
- EndpointSlices aumentaram;
- host do Ingress permaneceu;
- Service permaneceu;
- carga foi encerrada;
- jobs locais foram finalizados;
- CPU caiu;
- stabilization foi observada;
- scale-down foi observado;
- retorno a duas réplicas foi observado;
- events de rescale foram consultados;
- Metrics Server indisponível foi simulado;
- `kubectl top` falhou no cenário;
- métrica desconhecida foi observada;
- Pods atuais permaneceram;
- Metrics Server foi restaurado;
- APIService voltou a ficar disponível;
- policy de HPA foi criada;
- policy de behavior foi criada;
- lock de instalação foi modelado;
- observability contract foi criado;
- scripts exigem context permitido;
- scripts limitam duração;
- scripts finalizam jobs em `finally`;
- evidence foi criada;
- evidence não contém kubeconfig;
- evidence não contém token;
- evidence não contém cookies;
- evidence não contém logs brutos;
- arquitetura foi documentada;
- algoritmo foi documentado;
- Metrics Server foi documentado;
- behavior foi documentado;
- readiness foi documentada;
- capacity policy foi criada;
- runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- memória foi discutida sem ser target principal;
- métricas customizadas não foram instaladas;
- métricas externas não foram instaladas;
- VPA não foi criado;
- node autoscaling não foi criado;
- PersistentVolume não foi criado;
- PVC não foi criado;
- StatefulSet não foi criado;
- baseline foi restaurada;
- HPA permaneceu ativo;
- duas réplicas Ready foram confirmadas;
- dois endpoints prontos foram confirmados;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 534 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/autoscaling `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/workloads/deployment.yaml `
  scripts/kubernetes/autoscaling `
  docs/devops/kubernetes-autoscaling `
  docs/diario-de-bordo.md
```

Adicione o suporte ao endpoint de carga somente se ele estiver isolado ao profile local, possuir limites e testes.

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
      "token|password|client-key-data|authorization:"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): configurar HPA Kubernetes"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- token;
- Secret real;
- logs brutos;
- evidence não sanitizada;
- chart baixado;
- carga ainda ativa;
- Metrics Server escalado para zero;
- HPA com target temporário;
- Deployment com réplicas temporárias;
- volumes da aula 534.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a quantidade de réplicas deixou de ser exclusivamente estática.

O fluxo passou a possuir:

```text
carga;

métrica;

Metrics Server;

HPA;

Deployment;

Pods;

EndpointSlices;

Ingress.
```

Você comprovou que:

- HPA ajusta o subresource de escala;
- CPU utilization depende do request;
- Metrics Server fornece a API de recursos;
- `autoscaling/v2` permite behavior;
- min e max funcionam como guardrails;
- scale-up responde à carga;
- readiness controla quando a nova réplica entra no Service;
- scale-down usa estabilização;
- Ingress e Service não mudam com a quantidade de Pods;
- falta de métricas impede decisões normais;
- autoscaling de Pods não cria nodes;
- mais réplicas podem pressionar dependências;
- carga precisa ser controlada;
- baseline precisa ser restaurada.

A próxima aula será:

```text
534 - M17.29 - Volumes Kubernetes
```

Nela, você irá compreender volumes efêmeros e persistentes, lifecycle de dados, montagem, permissões e a diferença entre filesystem do container e storage desacoplado do Pod.

Nenhum volume persistente, PersistentVolumeClaim ou StatefulSet foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Instalei Metrics Server com versão registrada.
- [ ] Validei `metrics.k8s.io`.
- [ ] Criei HPA `autoscaling/v2`.
- [ ] Gereei carga controlada.
- [ ] Observei scale-up.
- [ ] Observei scale-down.
- [ ] Restaurei Metrics Server e baseline.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `kubectl top` retorna Metrics API not available

Revise Deployment, APIService, logs e conectividade com kubelet.

### Metrics Server apresenta erro x509 no kind

Confirme o argumento local `--kubelet-insecure-tls`.

### HPA mostra `<unknown>`

A métrica ainda não está disponível ou não pode ser calculada.

### `ScalingActive` está falso

Revise Metrics API, request de CPU e target.

### As réplicas não aumentam

A carga pode não ultrapassar o target ou o HPA pode estar limitado.

### O HPA pede mais Pods, mas eles ficam Pending

Não existe capacidade no node.

### Scale-down demora

A stabilization window está protegendo contra flapping.

### O HPA volta para outro número após `kubectl scale`

O autoscaler retomou o controle.

### O manifest redefine duas réplicas

Remova o conflito declarativo enquanto o HPA gerencia a escala.

### `ScalingLimited` está verdadeiro

A recomendação atingiu min ou max.

### O Ingress responde, mas a CPU não sobe

O endpoint de carga pode estar desativado ou leve demais.

### Um volume foi criado nesta aula

Remova e preserve para a aula 534.

---

## Perguntas de revisão

1. O que é HPA?
2. O que é horizontal scaling?
3. O que é Metrics Server?
4. O que é `metrics.k8s.io`?
5. Qual é o scale target desta aula?
6. O que significa average utilization?
7. Por que CPU request é necessário?
8. Como a fórmula estima réplicas?
9. Para que serve `minReplicas`?
10. Para que serve `maxReplicas`?
11. O que é stabilization window?
12. O que faz scale-up behavior?
13. O que faz scale-down behavior?
14. O que significa `ScalingActive`?
15. O que ocorre sem Metrics Server?
16. HPA cria nodes?
17. Ingress muda quando surgem Pods?
18. Por que scale-down é conservador?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Autoscaler horizontal.
2. Adicionar ou remover réplicas.
3. Provedor de resource metrics.
4. API agregada de métricas.
5. Deployment orders-api.
6. Uso relativo ao request.
7. É a base do percentual.
8. Réplicas vezes razão das métricas.
9. Preservar mínimo.
10. Limitar máximo.
11. Reduzir flapping.
12. Limitar crescimento.
13. Limitar redução.
14. Métrica ativa.
15. O cálculo falha.
16. Não.
17. Não.
18. Evitar oscilação.
19. Volumes e VPA.
20. Volumes Kubernetes.

---

## Desafio opcional

Adicione uma segunda métrica de memória em branch de laboratório.

Requisitos:

- `autoscaling/v2`;
- mesma min e max;
- target de memória justificado;
- observação do heap da JVM;
- comparação entre recomendações;
- maior recomendação escolhida;
- nenhum adapter externo;
- carga limitada;
- evidence;
- baseline de CPU restaurada.

O objetivo é compreender múltiplas métricas sem adotar memória por hábito.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 533 - M17.28 - HPA

- Continuei após a configuração do Ingress.
- Defini HorizontalPodAutoscaler.
- Relacionei HPA, Deployment, Service e Ingress.
- Estudei o subresource scale.
- Estudei a fórmula de réplicas desejadas.
- Relacionei CPU utilization ao CPU request.
- Instalei Metrics Server pelo chart oficial.
- Exigi e registrei chart version e app version.
- Usei `--kubelet-insecure-tls` somente no kind.
- Validei o APIService `metrics.k8s.io`.
- Validei `kubectl top`.
- Criei HPA com `autoscaling/v2`.
- Configurei target de CPU em 60%.
- Configurei mínimo de duas e máximo de seis réplicas.
- Configurei behavior de scale-up.
- Configurei stabilization e policies de scale-down.
- Observei `AbleToScale`, `ScalingActive` e `ScalingLimited`.
- Removi o conflito de réplicas fixas do manifest.
- Gerei carga de CPU controlada pelo Ingress.
- Observei scale-up.
- Observei novos Pods ficando Ready.
- Observei EndpointSlices aumentando.
- Encerrei a carga.
- Observei stabilization e scale-down.
- Simulei Metrics Server indisponível.
- Observei métrica desconhecida sem perda dos Pods atuais.
- Restaurei Metrics Server.
- Criei policies, scripts, evidence e runbook.
- Restaurei duas réplicas e dois endpoints prontos.
- Não antecipei volumes persistentes.
- Próxima aula: Volumes Kubernetes.
```

---

## Referência técnica curta

- Kubernetes Horizontal Pod Autoscaling.
- Kubernetes HorizontalPodAutoscaler API `autoscaling/v2`.
- Kubernetes Metrics API.
- Kubernetes Metrics Server.
- Kubernetes Resource Metrics Pipeline.
- HPA Scaling Behavior.
- HPA Stabilization Window.
- Kubernetes Deployment Scale Subresource.
- Kubernetes Readiness and Autoscaling.
- Workload Autoscaling.

Regra final:

```text
HorizontalPodAutoscaler observa métricas e ajusta o subresource scale do Deployment, enquanto o ReplicaSet materializa Pods e Service, EndpointSlices e Ingress permanecem independentes da quantidade de réplicas; Metrics Server fornece CPU e memória pela API `metrics.k8s.io`, e um target de CPU por `averageUtilization` depende do request declarado, usando conceitualmente a razão entre métrica atual e desejada para calcular réplicas; o HPA `autoscaling/v2` mantém mínimo de duas, máximo de seis, scale-up limitado e scale-down com stabilization de 300 segundos para reduzir flapping; carga HTTP local e limitada produz scale-up, novas réplicas só entram no Service após readiness, e o encerramento da carga permite scale-down gradual; indisponibilidade da Metrics API gera target desconhecido sem apagar os Pods existentes, autoscaling horizontal não cria nodes e dependências precisam suportar a escala; após os testes, Metrics Server, HPA, Ingress, duas réplicas e dois endpoints retornam à baseline, deixando para a aula 534 o lifecycle de volumes e persistência.
```
