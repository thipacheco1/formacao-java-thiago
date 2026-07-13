# 528 - M17.23 - Pod Deployment Service

## Apresentação da aula

Na aula 527, você preparou o primeiro cluster Kubernetes da formação.

O laboratório passou a possuir:

```text
kubectl;

kind;

cluster local;

context seguro;

inspeção da API;

evidência sanitizada.
```

Você também compreendeu a relação entre:

```text
desired state;

observed state;

reconciliation.
```

Os principais componentes do cluster foram separados:

- API Server;
- etcd;
- scheduler;
- controller manager;
- node;
- kubelet;
- container runtime.

Agora chegou o momento de colocar um workload dentro do cluster.

A pergunta central desta aula será:

```text
como executar
um container,

mantê-lo disponível
mesmo quando uma instância falha

e oferecer
um endereço estável
para acesso?
```

A resposta será construída com três resources:

```text
Pod;

Deployment;

Service.
```

Esses resources resolvem problemas diferentes.

#### Pod

Materializa um ou mais containers que compartilham o mesmo contexto de execução.

#### Deployment

Declara como um conjunto de Pods deve ser mantido, atualizado e escalado.

#### Service

Oferece um ponto de acesso estável para Pods selecionados por labels.

A sequência prática será:

```text
imagem local;

Pod isolado;

falha do Pod;

Deployment;

ReplicaSet;

self-healing;

Service;

EndpointSlice;

port-forward;

escala;

cleanup.
```

A primeira experiência será propositalmente feita com um Pod isolado.

Você irá aplicar:

```text
pod.yaml.
```

Depois, irá removê-lo.

O cluster não criará outro Pod automaticamente.

Isso demonstra que:

```text
Pod isolado
não é uma estratégia
de disponibilidade.
```

Em seguida, a aplicação será declarada em um Deployment.

O Deployment criará e controlará um ReplicaSet.

O ReplicaSet manterá a quantidade desejada de Pods.

Quando um Pod controlado for removido:

```text
o controller
detectará a diferença

e criará
uma nova réplica.
```

Depois, um Service será criado.

Os Pods possuem identidade efêmera.

Se um Pod for recriado:

- o nome pode mudar;
- o UID muda;
- o IP pode mudar;
- a instância anterior deixa de existir.

Um cliente não deve depender do IP de um Pod.

O Service cria uma identidade estável para o conjunto.

Ele utiliza:

```text
selector
```

para localizar Pods por labels.

O fluxo ficará:

```text
cliente
   |
   v
Service
   |
   v
EndpointSlice
   |
   +----> Pod A
   |
   +----> Pod B
```

A aula utilizará:

```text
Service type ClusterIP.
```

ClusterIP é acessível dentro do cluster.

Para testar a partir da sua máquina, você utilizará:

```text
kubectl port-forward.
```

Nesta aula, não serão criados:

- NodePort;
- LoadBalancer;
- Ingress;
- Gateway API;
- DNS público;
- TLS externo.

Esses recursos possuem responsabilidades próprias.

Também não serão implementados:

```text
ConfigMap;

Secret.
```

A próxima aula será:

```text
529 - M17.24 - ConfigMap Secret
```

Por isso, a configuração desta aula permanecerá mínima.

Nenhuma senha será colocada no manifest.

Nenhum token será colocado em `env`.

A imagem usada no laboratório será a imagem local produzida pelo Dockerfile já validado no módulo.

Ela receberá uma tag controlada:

```text
formacao-java-integrations:sha-528-local.
```

Depois, será carregada no cluster kind com:

```text
kind load docker-image.
```

O manifest usará:

```yaml
imagePullPolicy:
  Never
```

Isso garante que o node use a imagem carregada localmente.

Essa estratégia é exclusiva do laboratório.

Em ambientes compartilhados, a imagem deve vir de um registry autorizado e ser referenciada por digest.

A política produtiva continua sendo:

```text
ghcr.io/owner/image@sha256:...
```

O uso de uma tag local nesta aula não altera o princípio de promoção por digest.

Ele apenas elimina a necessidade de autenticar o cluster local no GHCR antes da aula de ConfigMap e Secret.

Outro ponto importante será a diferença entre:

```text
containerPort;

Service port;

targetPort.
```

#### `containerPort`

Documenta a porta exposta pelo container no Pod.

Não publica automaticamente a porta fora do Pod.

#### `port`

É a porta oferecida pelo Service.

#### `targetPort`

É a porta do Pod para a qual o Service encaminha.

Nesta aula:

```text
containerPort:
8084.

Service port:
80.

targetPort:
http.
```

O `targetPort` usará o nome da porta:

```text
http.
```

Isso reduz acoplamento ao número em alguns cenários.

A aula também utilizará probes.

A imagem Spring Boot já foi preparada ao longo do módulo para healthchecks.

O manifest utilizará:

```text
startupProbe;

readinessProbe;

livenessProbe.
```

Com endpoints:

```text
/actuator/health/liveness;

/actuator/health/readiness.
```

A startup probe protege aplicações que precisam de tempo para iniciar.

A readiness probe controla quando o Pod pode receber tráfego do Service.

A liveness probe indica quando o container precisa ser reiniciado.

As probes não serão configuradas com valores agressivos.

Os tempos serão didáticos e deverão ser calibrados com dados reais.

Outro ponto será requests e limits.

O container terá:

```yaml
requests:
  cpu: 100m
  memory: 256Mi

limits:
  cpu: 500m
  memory: 512Mi
```

Esses valores não são uma recomendação universal.

Eles representam uma baseline de laboratório.

Em produção, precisam nascer de:

- métricas;
- testes de carga;
- perfil de uso;
- comportamento do garbage collector;
- latência;
- capacidade do node;
- políticas da organização.

A aula também trabalhará com labels recomendadas.

Exemplo:

```text
app.kubernetes.io/name:
formacao-java-integrations.

app.kubernetes.io/instance:
orders-api-dev.

app.kubernetes.io/component:
api.

app.kubernetes.io/part-of:
formacao-java.

app.kubernetes.io/managed-by:
kubectl.
```

O Service não utilizará todas as labels no selector.

Ele selecionará apenas labels estáveis e suficientes.

Exemplo:

```text
app.kubernetes.io/name;

app.kubernetes.io/instance;

app.kubernetes.io/component.
```

Selectors frágeis podem desconectar o Service dos Pods.

Outro conceito importante será a imutabilidade do selector do Deployment.

Depois que o Deployment existe, alterar seu selector é uma mudança problemática e normalmente rejeitada.

Por isso, o selector precisa ser planejado.

A aula também apresentará:

```text
ownerReferences.
```

Pods criados pelo ReplicaSet possuem relação de ownership.

O ReplicaSet, por sua vez, pertence ao Deployment.

Essa cadeia ajuda o garbage collector e os controllers.

Você irá observar:

```text
Deployment;

ReplicaSet;

Pods.
```

Outro tema será rollout.

Deployment suporta atualização declarativa.

A estratégia padrão usada será:

```yaml
strategy:
  type:
    RollingUpdate

  rollingUpdate:
    maxUnavailable:
      0

    maxSurge:
      1
```

Com duas réplicas:

- nenhuma réplica disponível precisa ser perdida intencionalmente;
- uma réplica extra pode ser criada durante o rollout.

Essa política exige capacidade adicional no node.

Em clusters pequenos, `maxSurge` pode deixar o rollout pendente por falta de recursos.

Nesta aula, o rollout será observado, mas não haverá troca para uma nova versão funcional da aplicação.

O foco será compreender o mecanismo.

Outro tema será revision history.

Deployment mantém histórico de ReplicaSets conforme sua configuração.

Você poderá consultar:

```text
kubectl rollout history.
```

Rollback de Deployment será explicado.

Não será executado contra uma versão produtiva.

Outro ponto será a diferença entre:

```text
delete de Pod;

delete de Deployment.
```

Ao remover um Pod controlado:

```text
o Deployment continua existindo
e o Pod volta.
```

Ao remover o Deployment:

```text
o controller desejado desaparece
e os Pods controlados
são removidos.
```

O Service pode continuar existindo sem endpoints.

Isso é uma condição importante de troubleshooting.

A aula também mostrará EndpointSlice.

O Kubernetes representa os endpoints associados ao Service em resources:

```text
EndpointSlice.
```

Você irá comparar:

```text
selector do Service;

labels dos Pods;

EndpointSlices.
```

Se os selectors não correspondem:

```text
o Service existe,

mas não possui
backends prontos.
```

Esse é um dos erros mais comuns.

Outro ponto será port-forward.

`kubectl port-forward` é útil para:

- laboratório;
- debug;
- validação pontual;
- acesso temporário.

Ele não é uma solução de exposição produtiva.

O processo termina quando o comando é encerrado.

Outro conceito será DNS de Service.

Dentro do namespace, o Service poderá ser resolvido como:

```text
orders-api.
```

A forma completa será semelhante a:

```text
orders-api.formacao-java-dev.svc.cluster.local.
```

A aula não criará um cliente interno adicional apenas para testar DNS.

A resolução será estudada e poderá ser validada em um Pod de diagnóstico em aula futura.

Outro princípio será:

```text
não edite
resources produtivos
manualmente
sem preservar
a fonte declarativa.
```

Comandos como:

```text
kubectl edit;

kubectl scale;

kubectl set image.
```

são úteis.

Porém, mudanças operacionais precisam ser refletidas na fonte de verdade.

Nesta aula, `kubectl scale` será usado apenas como experimento.

Ao final, o manifest continuará declarando o valor escolhido para o laboratório.

Outro tema será observabilidade básica.

Você irá utilizar:

```text
kubectl get;

kubectl describe;

kubectl logs;

kubectl events;

kubectl rollout status;

kubectl wait.
```

Esses comandos respondem perguntas diferentes.

#### `get`

Mostra estado resumido.

#### `describe`

Mostra detalhes, condições e events relacionados.

#### `logs`

Mostra saída do container.

#### `rollout status`

Acompanha a atualização do Deployment.

#### `wait`

Bloqueia até uma condição ou timeout.

Ao final, você deverá explicar:

```text
por que Pod
é a unidade mínima;

por que Pod isolado
não é suficiente;

como Deployment
usa ReplicaSet;

como controllers
mantêm réplicas;

como Service
seleciona Pods;

por que IP de Pod
não é contrato;

como probes
afetam readiness
e restart;

como requests e limits
afetam scheduling;

como observar
rollout,
self-healing
e endpoints.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
526:
Infraestrutura como codigo conceitual.

527:
Kubernetes fundamentos.

528:
Pod Deployment Service.

529:
ConfigMap Secret.

530:
Liveness readiness startup probes.
```

A aula 527 respondeu:

```text
como Kubernetes
organiza cluster,
API,
nodes
e reconciliação?
```

A aula 528 responderá:

```text
como executar
a aplicação,
manter réplicas
e oferecer
acesso estável?
```

Nesta aula:

```text
namespace:
sim.

imagem local no kind:
sim.

Pod:
sim.

Deployment:
sim.

ReplicaSet:
sim.

Service ClusterIP:
sim.

EndpointSlice:
sim.

labels:
sim.

selectors:
sim.

probes:
sim.

requests:
sim.

limits:
sim.

port-forward:
sim.

self-healing:
sim.

scale:
sim.

rollout:
sim.

ConfigMap:
não.

Secret:
não.

Ingress:
não.

LoadBalancer:
não.

deploy produtivo:
não.
```

A regra central será:

```text
Pod executa;

Deployment mantém;

Service estabiliza o acesso.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
k8s/workloads
├── namespace.yaml
├── pod.yaml
├── deployment.yaml
├── service.yaml
├── workload-policy.yaml
└── service-policy.yaml

scripts/kubernetes/workloads
├── build-and-load-kind-image.ps1
├── apply-isolated-pod.ps1
├── inspect-isolated-pod.ps1
├── apply-deployment-service.ps1
├── verify-deployment-self-healing.ps1
├── verify-service-endpoints.ps1
├── port-forward-orders-api.ps1
├── collect-workload-evidence.ps1
└── cleanup-workloads.ps1

docs/devops/kubernetes-workloads
├── POD_LIFECYCLE.md
├── DEPLOYMENT_RECONCILIATION.md
├── REPLICASET_OWNERSHIP.md
├── SERVICE_DISCOVERY.md
├── KUBERNETES_SELECTOR_POLICY.md
├── WORKLOAD_RESOURCE_POLICY.md
├── WORKLOAD_RUNBOOK.md
├── WORKLOAD_TEST_MATRIX.md
└── WORKLOAD_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
namespace;

imagem carregada;

Pod isolado;

falha demonstrada;

Deployment;

ReplicaSet;

duas réplicas;

self-healing;

Service;

EndpointSlices;

port-forward;

evidência.
```

Você irá:

1. confirmar o cluster;
2. confirmar context;
3. construir a imagem;
4. carregar a imagem no kind;
5. criar namespace;
6. aplicar Pod;
7. observar scheduling;
8. observar logs;
9. testar health;
10. remover Pod;
11. confirmar ausência de recriação;
12. aplicar Deployment;
13. observar ReplicaSet;
14. aguardar rollout;
15. remover Pod controlado;
16. confirmar self-healing;
17. aplicar Service;
18. validar selectors;
19. observar EndpointSlices;
20. usar port-forward;
21. escalar Deployment;
22. observar endpoints;
23. consultar rollout history;
24. criar policies;
25. simular selector incorreto;
26. simular probe incorreta;
27. simular imagem ausente;
28. criar scripts;
29. coletar evidence;
30. executar gate;
31. commitar;
32. preparar a aula 529.

---

## Conceito essencial

### Pod

Pod é a menor unidade implantável do Kubernetes.

Containers do mesmo Pod compartilham:

- rede;
- hostname;
- volumes declarados;
- lifecycle operacional.

---

### Container no Pod

Cada container possui:

- image;
- command;
- args;
- ports;
- env;
- probes;
- resources;
- volume mounts.

---

### Pod IP

É efêmero.

Não deve ser usado como endpoint estável.

---

### Pod phase

Valores comuns:

```text
Pending;

Running;

Succeeded;

Failed;

Unknown.
```

Phase não substitui conditions.

---

### Pod condition

Condições incluem:

- PodScheduled;
- Initialized;
- ContainersReady;
- Ready.

---

### Restart policy

Em Pods comuns:

```text
Always;

OnFailure;

Never.
```

Containers gerenciados por Deployment utilizam comportamento compatível com execução contínua.

---

### Deployment

Controller para workloads stateless e atualizáveis.

Declara:

- replicas;
- selector;
- Pod template;
- strategy;
- revision history.

---

### ReplicaSet

Mantém a quantidade de Pods correspondente ao selector.

Normalmente é gerenciado pelo Deployment.

---

### Pod template

Modelo usado para criar Pods.

Mudanças no template geram nova revisão do Deployment.

---

### Service

Cria uma identidade de rede estável para um conjunto de endpoints.

---

### ClusterIP

Tipo padrão de Service para acesso interno ao cluster.

---

### Selector

Associa Service e Pods por labels.

---

### EndpointSlice

Representa endpoints de rede do Service.

---

### Named port

Porta identificada por nome.

Permite ao Service usar:

```text
targetPort:
http.
```

---

### RollingUpdate

Estratégia que substitui Pods gradualmente.

---

### Self-healing

Controller recria Pods ausentes para restaurar o estado desejado.

---

## Mão na massa guiada

### 1. Confirmar o cluster

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
kubectl get nodes
```

O node precisa estar:

```text
Ready.
```

---

### 2. Executar o preflight

```powershell
.\scripts\kubernetes\kubernetes-preflight.ps1
```

O script precisa falhar fora do cluster permitido.

---

### 3. Construir a imagem local

Entre no laboratório:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
docker build `
  --target `
  runtime `
  --tag `
  formacao-java-integrations:sha-528-local `
  .
```

O Dockerfile já foi validado nas aulas anteriores.

---

### 4. Carregar a imagem no kind

```powershell
kind load docker-image `
  formacao-java-integrations:sha-528-local `
  --name `
  formacao-java
```

Confirme dentro do node:

```powershell
docker exec `
  formacao-java-control-plane `
  crictl images
```

A inspeção serve apenas ao laboratório.

---

### 5. Criar o namespace

Arquivo:

```text
k8s/workloads/namespace.yaml
```

Conteúdo:

```yaml
apiVersion:
  v1

kind:
  Namespace

metadata:
  name:
    formacao-java-dev

  labels:
    app.kubernetes.io/part-of:
      formacao-java

    environment:
      dev
```

Aplique:

```powershell
kubectl apply `
  -f `
  "k8s/workloads/namespace.yaml"
```

---

### 6. Criar o Pod isolado

Arquivo:

```text
k8s/workloads/pod.yaml
```

Conteúdo:

```yaml
apiVersion:
  v1

kind:
  Pod

metadata:
  name:
    orders-api-isolated

  namespace:
    formacao-java-dev

  labels:
    app.kubernetes.io/name:
      formacao-java-integrations

    app.kubernetes.io/instance:
      orders-api-isolated

    app.kubernetes.io/component:
      api

    app.kubernetes.io/part-of:
      formacao-java

    app.kubernetes.io/managed-by:
      kubectl

spec:
  restartPolicy:
    Always

  containers:
    - name:
        orders-api

      image:
        formacao-java-integrations:sha-528-local

      imagePullPolicy:
        Never

      ports:
        - name:
            http

          containerPort:
            8084

          protocol:
            TCP

      startupProbe:
        httpGet:
          path:
            /actuator/health/liveness

          port:
            http

        failureThreshold:
          30

        periodSeconds:
          5

        timeoutSeconds:
          2

      readinessProbe:
        httpGet:
          path:
            /actuator/health/readiness

          port:
            http

        initialDelaySeconds:
          5

        periodSeconds:
          10

        timeoutSeconds:
          2

        failureThreshold:
          3

      livenessProbe:
        httpGet:
          path:
            /actuator/health/liveness

          port:
            http

        periodSeconds:
          10

        timeoutSeconds:
          2

        failureThreshold:
          3

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

Nenhum secret foi adicionado.

---

### 7. Aplicar o Pod

```powershell
kubectl apply `
  -f `
  "k8s/workloads/pod.yaml"
```

Acompanhe:

```powershell
kubectl get pod `
  orders-api-isolated `
  --namespace `
  formacao-java-dev `
  --watch
```

Encerre o watch com:

```text
Ctrl+C.
```

---

### 8. Inspecionar o Pod

```powershell
kubectl describe pod `
  orders-api-isolated `
  --namespace `
  formacao-java-dev
```

Observe:

- node;
- image;
- conditions;
- container state;
- probes;
- requests;
- limits;
- events.

---

### 9. Consultar logs

```powershell
kubectl logs `
  orders-api-isolated `
  --namespace `
  formacao-java-dev
```

Se houver restart:

```powershell
kubectl logs `
  orders-api-isolated `
  --namespace `
  formacao-java-dev `
  --previous
```

---

### 10. Validar a readiness

```powershell
kubectl wait `
  --for=condition=Ready `
  pod/orders-api-isolated `
  --namespace `
  formacao-java-dev `
  --timeout `
  180s
```

Se falhar, não aumente o timeout sem investigar.

Use describe e logs.

---

### 11. Testar com port-forward

```powershell
kubectl port-forward `
  pod/orders-api-isolated `
  18084:8084 `
  --namespace `
  formacao-java-dev
```

Em outro terminal:

```powershell
Invoke-RestMethod `
  "http://localhost:18084/actuator/health/readiness"
```

---

### 12. Remover o Pod isolado

```powershell
kubectl delete `
  -f `
  "k8s/workloads/pod.yaml"
```

Depois:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev
```

Confirme que outro Pod não foi criado.

---

### 13. Criar o Deployment

Arquivo:

```text
k8s/workloads/deployment.yaml
```

Conteúdo:

```yaml
apiVersion:
  apps/v1

kind:
  Deployment

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
      api

    app.kubernetes.io/part-of:
      formacao-java

    app.kubernetes.io/managed-by:
      kubectl

spec:
  replicas:
    2

  revisionHistoryLimit:
    5

  strategy:
    type:
      RollingUpdate

    rollingUpdate:
      maxUnavailable:
        0

      maxSurge:
        1

  selector:
    matchLabels:
      app.kubernetes.io/name:
        formacao-java-integrations

      app.kubernetes.io/instance:
        orders-api-dev

      app.kubernetes.io/component:
        api

  template:
    metadata:
      labels:
        app.kubernetes.io/name:
          formacao-java-integrations

        app.kubernetes.io/instance:
          orders-api-dev

        app.kubernetes.io/component:
          api

        app.kubernetes.io/part-of:
          formacao-java

        app.kubernetes.io/managed-by:
          kubectl

      annotations:
        formation.java/lesson:
          "528"

        formation.java/runbook:
          docs/devops/kubernetes-workloads/WORKLOAD_RUNBOOK.md

    spec:
      terminationGracePeriodSeconds:
        30

      containers:
        - name:
            orders-api

          image:
            formacao-java-integrations:sha-528-local

          imagePullPolicy:
            Never

          ports:
            - name:
                http

              containerPort:
                8084

              protocol:
                TCP

          startupProbe:
            httpGet:
              path:
                /actuator/health/liveness

              port:
                http

            failureThreshold:
              30

            periodSeconds:
              5

            timeoutSeconds:
              2

          readinessProbe:
            httpGet:
              path:
                /actuator/health/readiness

              port:
                http

            initialDelaySeconds:
              5

            periodSeconds:
              10

            timeoutSeconds:
              2

            failureThreshold:
              3

          livenessProbe:
            httpGet:
              path:
                /actuator/health/liveness

              port:
                http

            periodSeconds:
              10

            timeoutSeconds:
              2

            failureThreshold:
              3

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

---

### 14. Aplicar o Deployment

```powershell
kubectl apply `
  -f `
  "k8s/workloads/deployment.yaml"
```

Acompanhe:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-dev `
  --timeout `
  180s
```

---

### 15. Observar Deployment, ReplicaSet e Pods

```powershell
kubectl get deployment,replicaset,pod `
  --namespace `
  formacao-java-dev `
  --show-labels
```

Compare:

- desired;
- current;
- ready;
- available;
- age.

---

### 16. Observar ownership

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

Depois:

```powershell
kubectl get pod `
  $PodName `
  --namespace `
  formacao-java-dev `
  -o `
  "jsonpath={.metadata.ownerReferences}"
```

A cadeia levará ao ReplicaSet.

---

### 17. Testar self-healing

Registre os Pods:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  -l `
  "app.kubernetes.io/instance=orders-api-dev"
```

Remova um:

```powershell
kubectl delete pod `
  $PodName `
  --namespace `
  formacao-java-dev
```

Observe:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  --watch
```

Um novo Pod deve ser criado.

---

### 18. Criar o Service

Arquivo:

```text
k8s/workloads/service.yaml
```

Conteúdo:

```yaml
apiVersion:
  v1

kind:
  Service

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
      api

    app.kubernetes.io/part-of:
      formacao-java

    app.kubernetes.io/managed-by:
      kubectl

spec:
  type:
    ClusterIP

  selector:
    app.kubernetes.io/name:
      formacao-java-integrations

    app.kubernetes.io/instance:
      orders-api-dev

    app.kubernetes.io/component:
      api

  ports:
    - name:
        http

      protocol:
        TCP

      port:
        80

      targetPort:
        http
```

---

### 19. Aplicar o Service

```powershell
kubectl apply `
  -f `
  "k8s/workloads/service.yaml"
```

Consulte:

```powershell
kubectl get service `
  orders-api `
  --namespace `
  formacao-java-dev `
  -o wide
```

---

### 20. Validar os selectors

Mostre os Pods selecionados:

```powershell
kubectl get pods `
  --namespace `
  formacao-java-dev `
  --selector `
  "app.kubernetes.io/name=formacao-java-integrations,app.kubernetes.io/instance=orders-api-dev,app.kubernetes.io/component=api"
```

Se o resultado for vazio, o Service não terá endpoints.

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

Descreva:

```powershell
kubectl describe endpointslice `
  --namespace `
  formacao-java-dev `
  --selector `
  "kubernetes.io/service-name=orders-api"
```

Observe readiness dos endpoints.

---

### 22. Testar o Service por port-forward

```powershell
kubectl port-forward `
  service/orders-api `
  18084:80 `
  --namespace `
  formacao-java-dev
```

Em outro terminal:

```powershell
Invoke-RestMethod `
  "http://localhost:18084/actuator/health/readiness"
```

O acesso usa o Service, não um Pod específico.

---

### 23. Escalar o Deployment

Experimento:

```powershell
kubectl scale `
  deployment/orders-api `
  --replicas `
  3 `
  --namespace `
  formacao-java-dev
```

Acompanhe:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
```

Depois, observe os EndpointSlices.

Ao terminar, ajuste o manifest para o valor final escolhido.

A baseline continuará com duas réplicas.

Restaure:

```powershell
kubectl apply `
  -f `
  "k8s/workloads/deployment.yaml"
```

---

### 24. Consultar rollout history

```powershell
kubectl rollout history `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
```

Como o Pod template não mudou, o histórico pode permanecer com uma revisão principal.

---

### 25. Consultar eventos do namespace

```powershell
kubectl get events `
  --namespace `
  formacao-java-dev `
  --sort-by `
  ".metadata.creationTimestamp"
```

Relacione eventos a:

- scheduling;
- image;
- probes;
- criação;
- remoção;
- scaling.

---

### 26. Criar policy de workload

Arquivo:

```text
workload-policy.yaml
```

Regras:

```yaml
workload:
  replicas:
    minimum:
      2

  image:
    local_lab_tag:
      formacao-java-integrations:sha-528-local

    production_digest:
      required

  probes:
    startup:
      required

    readiness:
      required

    liveness:
      required

  resources:
    requests:
      required

    limits:
      required

  security:
    run_as_non_root:
      inherited_from_image
```

A segurança de Pod será aprofundada depois.

---

### 27. Criar policy de Service

Arquivo:

```text
service-policy.yaml
```

Inclua:

- ClusterIP;
- named ports;
- selectors estáveis;
- nenhum `externalIPs`;
- nenhum NodePort;
- nenhum LoadBalancer;
- endpoints prontos obrigatórios.

---

### 28. Simular selector incorreto

Altere temporariamente o Service:

```text
app.kubernetes.io/component:
worker.
```

Aplique.

Confirme:

- Service existe;
- EndpointSlice não possui endpoints prontos;
- port-forward não atende corretamente.

Restaure o selector.

---

### 29. Simular probe incorreta

Altere temporariamente a readiness path para:

```text
/actuator/health/nao-existe.
```

Confirme:

- Pod pode estar Running;
- Ready permanece false;
- Service remove o endpoint não pronto;
- liveness não precisa falhar.

Restaure.

---

### 30. Simular imagem ausente

Altere temporariamente:

```text
formacao-java-integrations:sha-528-ausente.
```

Confirme:

```text
ErrImageNeverPull.
```

Restaure a imagem correta.

---

### 31. Criar scripts

Os scripts precisam:

- validar context;
- exigir namespace allowlist;
- usar timeout;
- coletar logs em falha;
- não remover cluster;
- não alterar outros namespaces.

---

### 32. Criar evidence

Arquivo gerado:

```text
kubernetes-workload-evidence.json.
```

Campos:

- context;
- namespace;
- deployment;
- desired replicas;
- ready replicas;
- Service ClusterIP;
- EndpointSlice count;
- ready endpoint count;
- image;
- Pod recreation observed;
- port-forward check;
- timestamp.

Sem kubeconfig ou tokens.

---

### 33. Criar documentação

#### `POD_LIFECYCLE.md`

Explique phases, conditions, restart e IP efêmero.

#### `DEPLOYMENT_RECONCILIATION.md`

Explique Deployment, ReplicaSet, template e rollout.

#### `REPLICASET_OWNERSHIP.md`

Explique ownerReferences e garbage collection.

#### `SERVICE_DISCOVERY.md`

Explique ClusterIP, selectors, EndpointSlices e DNS.

#### `KUBERNETES_SELECTOR_POLICY.md`

Defina labels estáveis.

#### `WORKLOAD_RESOURCE_POLICY.md`

Defina como medir requests e limits.

---

### 34. Criar runbook

Arquivo:

```text
WORKLOAD_RUNBOOK.md
```

Inclua:

1. preflight;
2. imagem;
3. kind load;
4. namespace;
5. apply;
6. rollout;
7. probes;
8. Service;
9. endpoints;
10. port-forward;
11. evidence;
12. cleanup.

---

### 35. Criar test matrix

Arquivo:

```text
WORKLOAD_TEST_MATRIX.md
```

Cenários:

- Pod isolado Ready;
- Pod isolado removido;
- Deployment com duas réplicas;
- Pod controlado removido;
- nova réplica criada;
- Service com endpoints;
- selector incorreto;
- readiness incorreta;
- liveness incorreta;
- image ausente;
- resource insuficiente;
- scale up;
- scale down;
- port-forward;
- cleanup.

---

### 36. Criar troubleshooting

Arquivo:

```text
WORKLOAD_TROUBLESHOOTING.md
```

Inclua:

- Pending;
- ImagePullBackOff;
- ErrImageNeverPull;
- CrashLoopBackOff;
- Running sem Ready;
- probe timeout;
- OOMKilled;
- CPU throttling;
- Service sem endpoints;
- targetPort incorreta;
- selector divergente;
- port-forward encerra;
- rollout timeout;
- ReplicaSet antigo;
- context incorreto.

---

### 37. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\workloads\build-and-load-kind-image.ps1

.\scripts\kubernetes\workloads\apply-isolated-pod.ps1

.\scripts\kubernetes\workloads\inspect-isolated-pod.ps1

.\scripts\kubernetes\workloads\apply-deployment-service.ps1

.\scripts\kubernetes\workloads\verify-deployment-self-healing.ps1

.\scripts\kubernetes\workloads\verify-service-endpoints.ps1

.\scripts\kubernetes\workloads\collect-workload-evidence.ps1
```

Finalize:

```powershell
kubectl get all `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme que nenhum Secret foi criado.

---

## Entendendo o que foi feito

### O Pod materializou o container

A imagem passou a executar dentro do cluster.

### O Pod isolado mostrou sua limitação

Sua remoção não gerou substituição.

### O Deployment declarou disponibilidade

Duas réplicas viraram estado desejado.

### O ReplicaSet executou a manutenção

Pods ausentes foram recriados.

### O Service removeu dependência do IP do Pod

Clientes passaram a usar uma identidade estável.

### EndpointSlices mostraram os backends

Somente Pods selecionados e prontos participaram.

### Probes influenciaram tráfego e restart

Running deixou de ser sinônimo de Ready.

### Requests e limits entraram no contrato

Scheduling e consumo ganharam limites explícitos.

### O rollout ganhou observabilidade

History, status e events ficaram disponíveis.

### A próxima aula ganhou uma necessidade real

Configuração e credenciais precisam sair do manifest do workload.

---

## Erros comuns importantes

### Usar Pod isolado em produção

Não existe controller para recriá-lo.

### Selecionar Pods com labels erradas

O Service fica sem endpoints.

### Depender do IP do Pod

A recriação muda a identidade de rede.

### Usar imagem ausente com `Never`

O Pod entra em `ErrImageNeverPull`.

### Configurar readiness como liveness

Falha de dependência pode causar restart desnecessário.

### Usar probes agressivas

A aplicação pode nunca estabilizar.

### Omitir requests

Scheduling fica menos previsível.

### Definir limits arbitrários

OOM e throttling podem aparecer.

### Editar selector do Deployment

O selector é parte estrutural do controller.

### Expor NodePort sem necessidade

A superfície de acesso aumenta.

### Colocar secret no manifest

A aula 529 tratará ConfigMap e Secret.

### Tratar port-forward como exposição real

O acesso termina com o processo local.

---

## Comandos úteis

### Listar workloads

```powershell
kubectl get deployment,replicaset,pod `
  --namespace `
  formacao-java-dev
```

### Acompanhar rollout

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-dev
```

### Listar Service e EndpointSlice

```powershell
kubectl get service,endpointslice `
  --namespace `
  formacao-java-dev
```

### Consultar logs por label

```powershell
kubectl logs `
  --namespace `
  formacao-java-dev `
  --selector `
  "app.kubernetes.io/instance=orders-api-dev" `
  --prefix
```

### Validar readiness

```powershell
kubectl wait `
  --for=condition=Available `
  deployment/orders-api `
  --namespace `
  formacao-java-dev `
  --timeout `
  180s
```

---

## Exercício guiado

### Parte 1 — Imagem

Construa e carregue no kind.

### Parte 2 — Pod

Aplique e inspecione.

### Parte 3 — Falha

Remova o Pod isolado.

### Parte 4 — Deployment

Crie duas réplicas.

### Parte 5 — Self-healing

Remova um Pod controlado.

### Parte 6 — Service

Crie ClusterIP.

### Parte 7 — Endpoints

Valide selectors e readiness.

### Parte 8 — Acesso

Use port-forward.

### Parte 9 — Scale

Altere réplicas e restaure o manifest.

### Parte 10 — Troubleshooting

Simule selector, probe e imagem inválidos.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 527 foi preservada;
- Pod foi definido;
- container no Pod foi explicado;
- Pod IP foi classificado como efêmero;
- Pod phase foi explicada;
- Pod conditions foram explicadas;
- restart policy foi explicada;
- Deployment foi definido;
- ReplicaSet foi definido;
- Pod template foi definido;
- Service foi definido;
- ClusterIP foi definido;
- selector foi definido;
- EndpointSlice foi definido;
- named port foi definida;
- RollingUpdate foi definida;
- self-healing foi definido;
- cluster kind foi confirmado;
- context permitido foi validado;
- node Ready foi validado;
- preflight foi executado;
- imagem local foi construída;
- target runtime foi usado;
- tag local controlada foi usada;
- imagem foi carregada no kind;
- imagem foi confirmada no node;
- namespace foi criado;
- namespace possui labels;
- Pod isolado foi criado;
- Pod usa namespace explícito;
- labels recomendadas foram usadas;
- imagePullPolicy Never foi usada;
- containerPort 8084 foi definida;
- named port `http` foi usada;
- startup probe foi criada;
- readiness probe foi criada;
- liveness probe foi criada;
- requests foram criados;
- limits foram criados;
- valores foram classificados como didáticos;
- Pod foi aplicado;
- Pod foi descrito;
- logs foram consultados;
- readiness foi aguardada;
- port-forward do Pod foi testado;
- Pod isolado foi removido;
- Pod isolado não foi recriado;
- Deployment foi criado;
- apps/v1 foi usado;
- duas réplicas foram definidas;
- revision history foi definida;
- RollingUpdate foi configurada;
- maxUnavailable zero foi usado;
- maxSurge um foi usado;
- selector corresponde ao template;
- selector estável foi usado;
- annotations não possuem secrets;
- termination grace period foi definida;
- Deployment foi aplicado;
- rollout status foi consultado;
- ReplicaSet foi observado;
- Pods foram observados;
- ownerReferences foram observadas;
- self-healing foi testado;
- Pod controlado foi removido;
- nova réplica foi criada;
- Service foi criado;
- Service type ClusterIP foi usado;
- Service port 80 foi usada;
- targetPort nomeada foi usada;
- selectors do Service foram validados;
- EndpointSlices foram observados;
- endpoints prontos foram validados;
- port-forward do Service foi testado;
- Service foi usado em vez de Pod específico;
- escala para três réplicas foi testada;
- manifest foi restaurado para duas réplicas;
- rollout history foi consultado;
- events foram consultados;
- workload policy foi criada;
- service policy foi criada;
- NodePort não foi usado;
- LoadBalancer não foi usado;
- externalIPs não foi usado;
- selector incorreto foi simulado;
- Service sem endpoints foi observado;
- selector foi restaurado;
- readiness incorreta foi simulada;
- Pod Running sem Ready foi observado;
- endpoint não pronto foi observado;
- probe foi restaurada;
- imagem ausente foi simulada;
- ErrImageNeverPull foi observado;
- imagem foi restaurada;
- scripts de workload foram criados;
- scripts validam context;
- scripts validam namespace;
- scripts usam timeout;
- logs são coletados em falha;
- evidence foi criada;
- evidence não contém kubeconfig;
- evidence não contém token;
- documentação de Pod foi criada;
- documentação de Deployment foi criada;
- documentação de ReplicaSet foi criada;
- documentação de Service foi criada;
- selector policy foi criada;
- resource policy foi criada;
- runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- ConfigMap não foi criado;
- Secret não foi criado;
- Ingress não foi criado;
- Gateway não foi criado;
- deploy produtivo não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 529 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/workloads `
  scripts/kubernetes/workloads `
  docs/devops/kubernetes-workloads `
  docs/diario-de-bordo.md
```

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
      "password|token|client-key-data|client-certificate-data"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): implementar Pod Deployment e Service"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- token;
- client key;
- client certificate;
- Secret;
- senha;
- `.env` real;
- logs brutos;
- evidence local não sanitizada;
- imagem exportada;
- ConfigMap da aula 529;
- Ingress;
- LoadBalancer.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a imagem da aplicação entrou no cluster.

O fluxo passou a possuir:

```text
imagem;

Pod;

Deployment;

ReplicaSet;

Service;

EndpointSlice.
```

Você comprovou que:

- Pod é a menor unidade implantável;
- Pod isolado não garante disponibilidade;
- Deployment declara réplicas e estratégia;
- ReplicaSet mantém os Pods;
- controllers implementam self-healing;
- IP de Pod não é contrato;
- Service oferece identidade estável;
- selectors conectam Service e Pods;
- EndpointSlices representam backends;
- readiness controla participação no tráfego;
- liveness controla restart;
- requests e limits participam do scheduling;
- port-forward serve para laboratório;
- rollout e events ajudam no diagnóstico.

A próxima aula será:

```text
529 - M17.24 - ConfigMap Secret
```

Nela, você irá remover configuração do manifest do workload, injetar valores não sensíveis com ConfigMap e tratar credenciais com Secret sem confundir encoding com criptografia.

Nenhum ConfigMap ou Secret foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Construí e carreguei a imagem.
- [ ] Apliquei o Pod isolado.
- [ ] Comprovei a ausência de self-healing.
- [ ] Criei Deployment e ReplicaSet.
- [ ] Comprovei self-healing.
- [ ] Criei Service e validei endpoints.
- [ ] Testei port-forward.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O Pod fica em `Pending`

Revise scheduling, requests, taints e events.

### O Pod fica em `ErrImageNeverPull`

A imagem não foi carregada no node ou a tag diverge.

### O container entra em `CrashLoopBackOff`

Consulte logs atuais, anteriores e describe.

### O Pod está Running, mas não Ready

Revise readiness, dependências e endpoint.

### O Pod recebe `OOMKilled`

O limite de memória pode ser baixo ou existe consumo anormal.

### O Service não possui endpoints

Selectors não correspondem ou Pods não estão Ready.

### O port-forward encerra

O Pod pode ter reiniciado ou o processo local foi interrompido.

### O rollout fica pendente

Revise probes, resources, imagem e capacidade do node.

### O Pod apagado não volta

Confirme se ele pertence ao Deployment.

### Existem ReplicaSets antigos

Eles podem representar revision history do Deployment.

### O Service atende um Pod inesperado

Os selectors estão amplos demais.

### ConfigMap ou Secret apareceu

Remova e preserve para a aula 529.

---

## Perguntas de revisão

1. O que é Pod?
2. Por que Pod IP é efêmero?
3. O que é Pod phase?
4. O que é Pod condition?
5. O que faz Deployment?
6. O que faz ReplicaSet?
7. O que é Pod template?
8. O que é self-healing?
9. O que é Service?
10. O que é ClusterIP?
11. O que é selector?
12. O que é EndpointSlice?
13. Para que serve readiness?
14. Para que serve liveness?
15. Para que serve startup probe?
16. O que são requests?
17. O que são limits?
18. Por que usar port-forward?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Unidade implantável.
2. Pod pode ser recriado.
3. Estado geral.
4. Condição específica.
5. Gerenciar réplicas e rollout.
6. Manter quantidade de Pods.
7. Modelo de Pod.
8. Reconciliação automática.
9. Identidade de rede.
10. Acesso interno.
11. Seleção por labels.
12. Lista de endpoints.
13. Liberar tráfego.
14. Reiniciar processo não saudável.
15. Proteger inicialização.
16. Reserva para scheduling.
17. Teto de consumo.
18. Acesso temporário.
19. ConfigMap e Secret.
20. ConfigMap Secret.

---

## Desafio opcional

Crie um segundo Service sem selector.

Requisitos:

- tipo ClusterIP;
- EndpointSlice criado manualmente;
- endereço controlado;
- porta nomeada;
- documentação do risco;
- cleanup;
- nenhum endereço produtivo;
- nenhum Secret;
- nenhum Ingress.

O objetivo é compreender que Service e descoberta de endpoints são conceitos relacionados, mas separáveis.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 528 - M17.23 - Pod Deployment Service

- Continuei após os fundamentos de Kubernetes.
- Construí a imagem runtime local.
- Carreguei a imagem no cluster kind.
- Criei o namespace `formacao-java-dev`.
- Criei e apliquei um Pod isolado.
- Observei phases, conditions, probes e resources.
- Consultei logs e events.
- Testei readiness e port-forward.
- Removi o Pod isolado.
- Comprovei que ele não foi recriado.
- Criei Deployment com duas réplicas.
- Configurei RollingUpdate.
- Planejei selectors estáveis.
- Observei o ReplicaSet.
- Observei ownerReferences.
- Removi um Pod controlado.
- Comprovei self-healing.
- Criei Service ClusterIP.
- Usei porta nomeada.
- Validei selectors.
- Observei EndpointSlices.
- Testei acesso pelo Service.
- Escalei o Deployment e restaurei o manifest.
- Consultei rollout history.
- Simulei selector incorreto.
- Simulei readiness incorreta.
- Simulei imagem ausente.
- Criei policies, scripts, evidence e runbook.
- Não antecipei ConfigMap, Secret ou Ingress.
- Próxima aula: ConfigMap Secret.
```

---

## Referência técnica curta

- Kubernetes Pods.
- Kubernetes Deployments.
- Kubernetes ReplicaSets.
- Kubernetes Services.
- Kubernetes EndpointSlices.
- Kubernetes Labels and Selectors.
- Kubernetes Probes.
- Kubernetes Resource Management.
- Kubernetes Rollouts.
- Kubernetes Port Forwarding.

Regra final:

```text
Pod materializa containers e possui IP, UID e lifecycle efêmeros, por isso um Pod isolado não oferece disponibilidade; Deployment declara replicas, selector, Pod template e RollingUpdate, cria ReplicaSets e usa reconciliação para substituir Pods ausentes, enquanto Service type ClusterIP oferece identidade estável para Pods selecionados por labels e EndpointSlices representam apenas backends prontos; a imagem runtime local é carregada no kind com tag controlada e imagePullPolicy Never somente no laboratório, mantendo digest obrigatório em ambientes compartilhados; startup, readiness e liveness probes separam inicialização, tráfego e restart, e requests e limits participam do scheduling e da proteção do node; selectors, ownerReferences, rollout status, events, logs e port-forward tornam o comportamento observável; sem ConfigMap, Secret, Ingress ou exposição externa antecipados, a aula 529 poderá retirar configuração e credenciais do manifest do workload com os recursos adequados.
```
