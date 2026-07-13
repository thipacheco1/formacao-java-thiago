# 527 - M17.22 - Kubernetes fundamentos

## Apresentação da aula

Na aula 526, você estruturou Infraestrutura como Código de forma conceitual.

A infraestrutura passou a ser observada por:

```text
desired state;

observed state;

plan;

state;

drift;

modules;

policies;

tests;

evidence.
```

Você também definiu que recursos precisam ser:

- descritíveis;
- revisáveis;
- reproduzíveis;
- verificáveis;
- protegidos por políticas;
- separados por ambiente;
- associados a owners;
- avaliados antes do apply.

Agora a formação entra em uma plataforma que materializa vários desses princípios no runtime:

```text
Kubernetes.
```

A pergunta central desta aula será:

```text
como um cluster
recebe um estado desejado,
mantém workloads ativos,
reconcilia diferenças
e expõe uma API
para operação declarativa?
```

Kubernetes é uma plataforma de orquestração de containers.

Ele organiza:

- aplicações;
- réplicas;
- rede;
- configuração;
- armazenamento;
- identidade;
- políticas;
- atualizações;
- recuperação;
- observabilidade.

Kubernetes não é apenas:

```text
um lugar para executar Docker.
```

Ele adiciona uma camada de controle.

Você declara:

```text
o estado desejado.
```

Os controladores trabalham continuamente para aproximar o estado observado desse objetivo.

Exemplo conceitual:

```text
desejado:

3 réplicas.

observado:

2 réplicas.

ação:

criar 1 nova réplica.
```

Esse ciclo é chamado de:

```text
reconciliation loop.
```

A aula 526 preparou exatamente esse raciocínio.

No Kubernetes:

```text
manifests
descrevem intenção;

API Server
recebe a intenção;

etcd
armazena o estado;

controllers
detectam divergências;

scheduler
escolhe nodes;

kubelet
materializa containers;

probes
informam saúde;

Services
estabilizam acesso.
```

Nesta aula, você irá estudar e observar:

- cluster;
- control plane;
- worker node;
- API Server;
- etcd;
- scheduler;
- controller manager;
- kubelet;
- container runtime;
- kube-proxy ou mecanismos equivalentes de rede;
- namespace;
- resource;
- object;
- manifest;
- metadata;
- spec;
- status;
- label;
- selector;
- annotation;
- reconciliation;
- desired state;
- observed state;
- declarative management;
- imperative command;
- kubeconfig;
- context;
- RBAC;
- admission;
- events;
- logs;
- metrics;
- probes;
- resource requests;
- resource limits.

A aula também será prática.

Você irá preparar:

```text
kubectl;

kind;

um cluster local;
```

O cluster será usado apenas para observar os fundamentos.

Nesta aula, você não criará a aplicação Java como:

- Pod;
- Deployment;
- Service.

Esses recursos serão o tema da próxima aula:

```text
528 - M17.23 - Pod Deployment Service
```

O cluster local servirá para:

- consultar a versão;
- verificar context;
- inspecionar nodes;
- observar namespaces;
- observar componentes de sistema;
- ler eventos;
- usar `kubectl explain`;
- compreender a API;
- validar acesso;
- praticar comandos seguros.

A topologia local será:

```text
máquina Windows
      |
      v
Docker
      |
      v
kind control-plane node
      |
      v
Kubernetes API
```

O `kind` executa nodes Kubernetes como containers Docker.

Isso é adequado para laboratório.

Não representa sozinho uma arquitetura produtiva.

Em produção, podem existir:

- múltiplos control planes;
- múltiplos worker nodes;
- load balancer da API;
- storage persistente;
- integração de rede;
- políticas;
- backup de etcd;
- atualização coordenada;
- autoscaling;
- observabilidade;
- disaster recovery.

Outro princípio será:

```text
kubectl não é o cluster.
```

`kubectl` é um cliente.

Ele:

1. lê o kubeconfig;
2. seleciona context;
3. autentica;
4. envia requisição ao API Server;
5. recebe resposta;
6. imprime ou altera recursos.

O acesso ao cluster depende de:

- cluster endpoint;
- certificado;
- usuário ou identidade;
- context;
- permissions.

Outro princípio será:

```text
kubeconfig é sensível.
```

Ele pode conter:

- endpoints;
- certificados;
- tokens;
- client keys;
- exec plugins;
- contexts;
- namespaces.

O arquivo não deve ser:

- commitado;
- enviado em artifact;
- colado em issue;
- impresso em log;
- compartilhado sem revisão.

O laboratório usará o kubeconfig criado pelo `kind`.

Ele permanecerá na máquina local.

Não será copiado para o repositório.

A aula também diferenciará:

```text
resource
e
object.
```

#### Resource

Tipo exposto pela API.

Exemplos:

```text
pods;

deployments;

services;

namespaces;

configmaps;

secrets.
```

#### Object

Instância persistida de um resource.

Exemplo conceitual:

```text
Deployment
chamado
orders-api.
```

Outro ponto será o formato de um manifest.

A estrutura comum possui:

```yaml
apiVersion:
  ...

kind:
  ...

metadata:
  ...

spec:
  ...
```

O cluster adiciona campos em:

```text
status.
```

Você declara `spec`.

Os controladores atualizam `status`.

Esse contraste é fundamental:

```text
spec:

o que você quer.

status:

o que existe agora.
```

Nesta aula, você criará apenas manifests conceituais e de configuração do cluster local.

Nenhum workload da aplicação será aplicado.

A aula também introduzirá labels e annotations.

#### Label

Par chave-valor usado para organização e seleção.

Exemplo:

```text
app=orders-api;

environment=dev;

component=api.
```

#### Annotation

Metadata não usada como selector principal.

Exemplo:

```text
owner;

runbook;

commit;

observability metadata.
```

Labels precisam ser:

- estáveis;
- previsíveis;
- úteis para seleção.

Annotations podem armazenar metadata descritiva.

Nenhuma delas deve armazenar secret.

Outro conceito será namespace.

Namespace cria uma separação lógica dentro do cluster.

Ele ajuda a organizar:

- resources;
- policies;
- quotas;
- access;
- environments;
- teams.

Namespace não é uma barreira absoluta de segurança por si só.

A proteção real depende de:

- RBAC;
- NetworkPolicy;
- Pod Security;
- quotas;
- admission;
- identidade;
- configuração do cluster.

Nesta aula, você apenas observará namespaces existentes.

Os namespaces da aplicação serão criados em aulas posteriores quando houver resources concretos.

Outro tema será RBAC.

RBAC responde:

```text
quem pode
fazer o quê
em qual resource
e em qual escopo?
```

Conceitos:

- Role;
- ClusterRole;
- RoleBinding;
- ClusterRoleBinding;
- ServiceAccount.

Nenhuma permissão ampla será criada nesta aula.

Você usará:

```text
kubectl auth can-i.
```

Esse comando ajuda a consultar autorização.

Outro tema será admission.

Depois da autenticação e autorização, uma requisição pode passar por mecanismos de admission.

Eles podem:

- validar;
- modificar;
- bloquear;
- exigir políticas;
- aplicar defaults.

Exemplos conceituais:

- impedir imagem por tag;
- exigir limits;
- exigir labels;
- bloquear privileged;
- exigir assinatura;
- restringir registries.

Nenhum admission controller customizado será configurado.

Outro tema será scheduling.

O scheduler considera:

- resources;
- affinities;
- taints;
- tolerations;
- topology;
- constraints;
- disponibilidade;
- policies.

Nesta aula, você observará o node local.

A próxima aula criará workloads para ver scheduling na prática.

Outro tema será kubelet.

O kubelet executa em cada node e trabalha para garantir que os Pods atribuídos estejam materializados.

Ele conversa com o container runtime usando interfaces apropriadas.

O runtime não precisa ser Docker Engine dentro do node.

Kubernetes gerencia containers por meio de uma interface de runtime.

Outro conceito será self-healing.

Quando um container falha, o Kubernetes pode reiniciá-lo conforme a política.

Quando um Pod gerenciado desaparece, um controller pode criar outro.

Porém:

```text
self-healing
não corrige
uma aplicação logicamente quebrada.
```

Se a imagem possui bug, o cluster pode manter o bug disponível.

Por isso continuam necessários:

- testes;
- coverage;
- scans;
- probes;
- rollout controlado;
- observação;
- rollback.

Outro conceito será probe.

Tipos principais:

```text
startup probe;

readiness probe;

liveness probe.
```

#### Startup probe

Indica que a aplicação concluiu a inicialização.

#### Readiness probe

Indica que pode receber tráfego.

#### Liveness probe

Indica que o processo precisa ser reiniciado.

Configurar probes incorretamente pode causar:

- restart loop;
- tráfego prematuro;
- indisponibilidade;
- falsa saúde;
- falha em rollout.

Nesta aula, probes serão estudadas conceitualmente.

A configuração prática virá quando a aplicação ganhar workloads Kubernetes.

Outro tema será resources.

Containers podem declarar:

```text
requests;

limits.
```

#### Request

Quantidade usada pelo scheduler para posicionamento.

#### Limit

Teto aplicado pelo runtime quando suportado.

Sem requests, scheduling e capacidade ficam menos previsíveis.

Sem limits, um workload pode consumir recursos excessivos.

Limits inadequados também podem causar:

- throttling;
- OOMKilled;
- latência;
- instabilidade.

A aula não definirá números finais.

Esses valores precisam nascer de medição.

Outro conceito será event.

Events registram ocorrências operacionais recentes.

Exemplos:

- scheduling;
- image pull;
- container start;
- probe failure;
- eviction;
- mount failure.

Events não substituem logs ou métricas.

Eles também possuem retenção limitada.

Outro conceito será condição.

Resources podem expor condições em `status`.

Exemplos:

- Ready;
- Available;
- Progressing.

Condições precisam ser interpretadas no contexto do resource.

A aula também trabalhará com comandos imperativos e declarativos.

#### Imperativo

Exemplo:

```text
kubectl create;

kubectl run;

kubectl expose.
```

É útil para:

- diagnóstico;
- laboratório;
- operação pontual;
- descoberta.

#### Declarativo

Exemplo:

```text
kubectl apply -f.
```

É preferível para resources versionados.

A próxima aula usará manifests declarativos.

Nesta aula, comandos que criam workloads serão evitados.

Outro princípio será:

```text
não use
kubectl delete
sem confirmar
context e namespace.
```

Antes de uma alteração:

```text
kubectl config current-context;

kubectl config view --minify;

kubectl get namespace.
```

O laboratório criará scripts de preflight.

Eles falharão se o context não começar com:

```text
kind-
```

Assim, comandos destrutivos do laboratório não atingem outro cluster por engano.

Ao final, você deverá explicar:

```text
o que é cluster;

o que faz
o control plane;

o que faz
um worker node;

como API Server,
etcd,
scheduler,
controllers
e kubelet
se relacionam;

o que é reconciliation;

como spec
difere de status;

como kubectl
usa kubeconfig;

como labels,
annotations
e namespaces
organizam resources;

como RBAC
protege ações;

como probes
e resources
afetam operação;

como preparar
o caminho para
Pod,
Deployment
e Service.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
525:
Ambientes dev hml prod.

526:
Infraestrutura como codigo conceitual.

527:
Kubernetes fundamentos.

528:
Pod Deployment Service.

529:
ConfigMap e Secret.
```

A aula 526 respondeu:

```text
como representar
recursos,
estado,
plan,
drift
e políticas
como código?
```

A aula 527 responderá:

```text
como Kubernetes
materializa
estado desejado
e reconcilia
workloads em um cluster?
```

Nesta aula:

```text
Kubernetes:
sim.

kubectl:
sim.

kind:
sim.

cluster local:
sim.

control plane:
sim.

worker node:
sim.

API Server:
sim.

etcd:
sim.

scheduler:
sim.

controller manager:
sim.

kubelet:
sim.

runtime:
sim.

namespace:
sim.

labels:
sim.

annotations:
sim.

RBAC:
sim.

admission:
sim.

probes:
conceitual.

requests e limits:
conceitual.

Pod da aplicação:
não.

Deployment da aplicação:
não.

Service da aplicação:
não.

Ingress:
não.

ConfigMap:
não aplicado.

Secret:
não aplicado.
```

A regra central será:

```text
Kubernetes mantém
estado desejado
por reconciliação,

mas a aplicação
continua responsável
por ser testável,
observável
e operável.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
k8s/fundamentals
├── kind-cluster.yaml
├── cluster-inventory.example.yaml
├── label-policy.yaml
├── namespace-policy.yaml
└── access-policy.yaml

scripts/kubernetes
├── verify-kubectl.ps1
├── verify-kind.ps1
├── create-kind-cluster.ps1
├── kubernetes-preflight.ps1
├── inspect-kubernetes-cluster.ps1
├── inspect-kubernetes-access.ps1
├── collect-kubernetes-fundamentals-evidence.ps1
└── delete-kind-cluster.ps1

docs/devops/kubernetes
├── KUBERNETES_ARCHITECTURE.md
├── KUBERNETES_CONTROL_PLANE.md
├── KUBERNETES_NODE_MODEL.md
├── KUBERNETES_API_OBJECTS.md
├── KUBERNETES_METADATA_POLICY.md
├── KUBERNETES_ACCESS_SAFETY.md
├── KUBERNETES_PROBES_AND_RESOURCES.md
├── KUBERNETES_LOCAL_CLUSTER_RUNBOOK.md
├── KUBERNETES_TEST_MATRIX.md
└── KUBERNETES_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
kubectl validado;

kind validado;

cluster local;

context seguro;

node inspecionado;

namespaces observados;

system Pods observados;

API descoberta;

RBAC consultado;

events consultados;

evidência criada;

runbook.
```

Você irá:

1. confirmar a baseline;
2. validar Docker;
3. instalar ou validar kubectl;
4. instalar ou validar kind;
5. criar configuração do cluster;
6. criar cluster;
7. validar context;
8. validar endpoint;
9. consultar cluster info;
10. consultar nodes;
11. descrever node;
12. listar namespaces;
13. listar system Pods;
14. consultar API resources;
15. consultar API versions;
16. usar `kubectl explain`;
17. consultar RBAC;
18. consultar events;
19. criar policies conceituais;
20. criar inventário;
21. criar scripts de segurança;
22. coletar evidence;
23. simular context incorreto;
24. simular cluster indisponível;
25. validar cleanup;
26. documentar;
27. executar gate;
28. commitar;
29. preparar a aula 528.

---

## Conceito essencial

### Cluster

Cluster é o conjunto de control plane e nodes que executam e gerenciam workloads.

---

### Control plane

Control plane toma decisões sobre o cluster.

Componentes principais:

```text
API Server;

etcd;

scheduler;

controller manager.
```

---

### API Server

É a porta de entrada da API Kubernetes.

Ele trata:

- autenticação;
- autorização;
- admission;
- validação;
- persistência;
- watch;
- respostas.

---

### etcd

Banco chave-valor consistente usado para armazenar o estado do cluster.

Backup e proteção de etcd são críticos em ambientes próprios.

---

### Scheduler

Seleciona um node para Pods ainda não atribuídos.

Ele não inicia o container diretamente.

---

### Controller manager

Executa controladores.

Controladores observam estado e tentam convergir para o desejado.

---

### Node

Máquina física ou virtual que executa workloads.

No `kind`, um node é representado por container.

---

### Kubelet

Agente do node.

Garante a execução dos Pods atribuídos.

---

### Container runtime

Executa os containers.

Kubernetes se integra ao runtime por interfaces próprias.

---

### Namespace

Escopo lógico para organizar resources.

---

### Manifest

Documento YAML ou JSON enviado à API.

---

### `apiVersion`

Versão da API usada pelo resource.

---

### `kind`

Tipo do object.

---

### `metadata`

Identidade e metadata.

Inclui:

- name;
- namespace;
- labels;
- annotations;
- UID;
- generation.

---

### `spec`

Estado desejado.

---

### `status`

Estado observado.

---

### Label

Metadata selecionável.

---

### Selector

Consulta ou associação baseada em labels.

---

### Annotation

Metadata descritiva não usada normalmente como selector.

---

### Reconciliation

Ciclo contínuo para reduzir diferença entre `spec` e estado observado.

---

### Kubeconfig

Configuração de acesso a clusters.

---

### Context

Combinação de:

- cluster;
- user;
- namespace.

---

### RBAC

Controle de acesso baseado em roles.

---

### Admission

Validação ou mutação de requests após autenticação e autorização.

---

### Event

Registro operacional de curta duração.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Na raiz do repositório:

```powershell
git status
git diff --check
```

Valide Docker:

```powershell
docker version
docker info
```

---

### 2. Validar `kubectl`

Execute:

```powershell
kubectl version `
  --client
```

Depois:

```powershell
kubectl config `
  get-contexts
```

Se não estiver instalado, use um método oficial compatível com o Windows.

Não baixe binário de origem desconhecida.

---

### 3. Validar `kind`

Execute:

```powershell
kind version
```

Se não estiver instalado, instale por método oficial e valide checksum quando aplicável.

---

### 4. Criar configuração do cluster

Arquivo:

```text
k8s/fundamentals/kind-cluster.yaml
```

Conteúdo:

```yaml
kind:
  Cluster

apiVersion:
  kind.x-k8s.io/v1alpha4

name:
  formacao-java

nodes:
  - role:
      control-plane
```

A aula usa um node por simplicidade.

---

### 5. Criar script `verify-kubectl.ps1`

Valide:

- comando disponível;
- client version;
- kubeconfig path;
- context atual;
- ausência de kubeconfig no Git;
- saída sem token.

---

### 6. Criar script `verify-kind.ps1`

Valide:

- comando disponível;
- Docker disponível;
- versão exibida;
- lista de clusters;
- nome permitido.

---

### 7. Criar cluster local

Execute:

```powershell
kind create cluster `
  --config `
  "k8s/fundamentals/kind-cluster.yaml" `
  --wait `
  120s
```

O context esperado será semelhante a:

```text
kind-formacao-java.
```

---

### 8. Confirmar o context

Execute:

```powershell
kubectl config `
  current-context
```

Depois:

```powershell
kubectl config `
  view `
  --minify
```

Não copie tokens ou client keys para a documentação.

---

### 9. Criar preflight seguro

Arquivo:

```text
kubernetes-preflight.ps1
```

Valide:

```text
context começa com kind-;

cluster responde;

node existe;

namespace padrão existe;

nenhum comando destrutivo
executa fora do laboratório.
```

---

### 10. Consultar cluster info

```powershell
kubectl cluster-info
```

Observe o endpoint local.

Não trate esse endpoint como configuração de produção.

---

### 11. Listar nodes

```powershell
kubectl get nodes `
  -o wide
```

Observe:

- name;
- status;
- roles;
- age;
- version;
- internal IP;
- OS;
- runtime.

---

### 12. Descrever o node

```powershell
kubectl describe node `
  formacao-java-control-plane
```

Procure:

- labels;
- taints;
- capacity;
- allocatable;
- conditions;
- addresses;
- system info;
- Pods alocados;
- events.

---

### 13. Listar namespaces

```powershell
kubectl get namespaces
```

Você poderá observar namespaces de sistema.

Não crie namespace da aplicação ainda.

---

### 14. Listar Pods do sistema

```powershell
kubectl get pods `
  --all-namespaces `
  -o wide
```

Observe componentes do cluster local.

Não altere resources do namespace de sistema.

---

### 15. Consultar API resources

```powershell
kubectl api-resources
```

Filtre:

```powershell
kubectl api-resources `
  --namespaced=true
```

Depois:

```powershell
kubectl api-resources `
  --namespaced=false
```

Isso mostra resources namespaced e cluster-scoped.

---

### 16. Consultar versões da API

```powershell
kubectl api-versions
```

Não escolha `apiVersion` por memória.

Use a API disponível no cluster.

---

### 17. Usar `kubectl explain`

Execute:

```powershell
kubectl explain pod
```

Depois:

```powershell
kubectl explain pod.spec
```

Também:

```powershell
kubectl explain deployment.spec
kubectl explain service.spec
```

Você está lendo a API.

Não está criando resources.

---

### 18. Consultar autorização

```powershell
kubectl auth can-i `
  get `
  pods `
  --all-namespaces
```

Depois:

```powershell
kubectl auth can-i `
  create `
  deployments `
  --namespace `
  default
```

No cluster local, seu usuário pode possuir permissões amplas.

Isso não é uma referência para produção.

---

### 19. Consultar events

```powershell
kubectl get events `
  --all-namespaces `
  --sort-by `
  ".metadata.creationTimestamp"
```

Events ajudam a explicar scheduling e inicialização.

---

### 20. Consultar status bruto

Exemplo:

```powershell
kubectl get node `
  formacao-java-control-plane `
  -o yaml
```

Compare:

```text
metadata;

spec;

status.
```

Não salve o YAML completo como artifact sem revisão.

---

### 21. Criar inventário conceitual

Arquivo:

```text
cluster-inventory.example.yaml
```

Inclua:

```yaml
cluster:
  name:
    formacao-java

  type:
    local-kind

  environments:
    - local

  control_plane_nodes:
    1

  worker_nodes:
    0

  purpose:
    kubernetes-fundamentals

  production_ready:
    false
```

---

### 22. Criar política de labels

Arquivo:

```text
label-policy.yaml
```

Defina labels futuros:

```yaml
required:
  - app.kubernetes.io/name
  - app.kubernetes.io/instance
  - app.kubernetes.io/component
  - app.kubernetes.io/part-of
  - app.kubernetes.io/managed-by
```

Nenhum workload será criado.

---

### 23. Criar política de namespace

Arquivo:

```text
namespace-policy.yaml
```

Defina:

- nomes minúsculos;
- separação por finalidade;
- quotas futuras;
- RBAC futuro;
- labels;
- proibição de usar `default` em ambientes reais.

No laboratório, `default` será apenas observado.

---

### 24. Criar política de acesso

Arquivo:

```text
access-policy.yaml
```

Inclua:

- menor privilégio;
- context explícito;
- namespace explícito;
- sem kubeconfig no Git;
- sem token em log;
- `auth can-i` antes de operações sensíveis;
- cluster local para comandos destrutivos.

---

### 25. Criar script de inspeção

Arquivo:

```text
inspect-kubernetes-cluster.ps1
```

Colete:

- context;
- cluster info;
- nodes;
- namespaces;
- API resources;
- system Pods;
- events.

Remova valores sensíveis.

---

### 26. Criar script de acesso

Arquivo:

```text
inspect-kubernetes-access.ps1
```

Execute consultas `can-i` para:

- get Pods;
- list namespaces;
- create Deployment;
- delete namespace;
- read Secrets.

Registre apenas resultado.

---

### 27. Criar evidence

Arquivo:

```text
kubernetes-fundamentals-evidence.json.
```

Campos:

- cluster name;
- context;
- node count;
- node ready;
- API reachable;
- namespace count;
- system Pods count;
- access checks;
- created at;
- production ready false.

Sem kubeconfig.

---

### 28. Publicar evidence somente localmente

Nesta aula, a evidence pode ser criada para revisão.

Não faça upload automático do kubeconfig ou dumps completos.

Quando houver workflow, publique apenas o JSON sanitizado.

---

### 29. Simular context incorreto

Altere o input do script para um nome não permitido.

Confirme:

- preflight falha;
- nenhum delete executa;
- mensagem mostra context esperado;
- nenhum token é impresso.

---

### 30. Simular cluster indisponível

Pare o cluster local ou Docker em cenário controlado.

Confirme:

- API check falha;
- script encerra;
- não tenta criar workload;
- troubleshooting orienta recuperação.

Restaure Docker.

---

### 31. Criar arquitetura

Arquivo:

```text
KUBERNETES_ARCHITECTURE.md
```

Diagrama:

```text
kubectl
   |
   v
API Server
   |
   +------> etcd
   |
   +------> admission
   |
   +------> controllers
   |
   +------> scheduler
                  |
                  v
                node
                  |
                  v
               kubelet
                  |
                  v
          container runtime
```

---

### 32. Criar control plane doc

Arquivo:

```text
KUBERNETES_CONTROL_PLANE.md
```

Explique responsabilidades e falhas.

---

### 33. Criar node model

Arquivo:

```text
KUBERNETES_NODE_MODEL.md
```

Explique:

- capacity;
- allocatable;
- conditions;
- labels;
- taints;
- kubelet;
- runtime;
- Pods.

---

### 34. Criar API objects doc

Arquivo:

```text
KUBERNETES_API_OBJECTS.md
```

Explique:

- apiVersion;
- kind;
- metadata;
- spec;
- status;
- UID;
- generation;
- resourceVersion.

---

### 35. Criar metadata policy

Arquivo:

```text
KUBERNETES_METADATA_POLICY.md
```

Defina labels e annotations.

Proíba secrets.

---

### 36. Criar access safety

Arquivo:

```text
KUBERNETES_ACCESS_SAFETY.md
```

Inclua:

- context;
- namespace;
- RBAC;
- kubeconfig;
- logs;
- artifacts;
- destructive commands;
- break-glass conceitual.

---

### 37. Criar probes e resources doc

Arquivo:

```text
KUBERNETES_PROBES_AND_RESOURCES.md
```

Explique:

- startup;
- readiness;
- liveness;
- requests;
- limits;
- throttling;
- OOMKilled;
- medição.

Não defina manifest da aplicação.

---

### 38. Criar runbook local

Arquivo:

```text
KUBERNETES_LOCAL_CLUSTER_RUNBOOK.md
```

Inclua:

- requisitos;
- criação;
- preflight;
- inspeção;
- evidence;
- parada;
- remoção;
- recuperação.

---

### 39. Criar test matrix

Arquivo:

```text
KUBERNETES_TEST_MATRIX.md
```

Cenários:

- kubectl ausente;
- kind ausente;
- Docker indisponível;
- cluster criado;
- context correto;
- context incorreto;
- node Ready;
- node NotReady;
- API indisponível;
- namespace listado;
- RBAC permitido;
- RBAC negado;
- kubeconfig detectado no Git;
- evidence sanitizada;
- cluster removido.

---

### 40. Criar troubleshooting

Arquivo:

```text
KUBERNETES_TROUBLESHOOTING.md
```

Inclua:

- connection refused;
- context errado;
- certificate error;
- node NotReady;
- Docker sem recurso;
- image pull do sistema;
- API timeout;
- kubeconfig ausente;
- permission denied;
- `kind` cluster já existe;
- porta ocupada;
- cleanup incompleto.

---

### 41. Remover cluster com segurança

Script:

```text
delete-kind-cluster.ps1
```

Valide o nome exato.

Execute:

```powershell
kind delete cluster `
  --name `
  formacao-java
```

Não use nome recebido sem allowlist.

Você pode manter o cluster para a aula 528.

Registre a decisão.

---

### 42. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\verify-kubectl.ps1

.\scripts\kubernetes\verify-kind.ps1

.\scripts\kubernetes\kubernetes-preflight.ps1

.\scripts\kubernetes\inspect-kubernetes-cluster.ps1

.\scripts\kubernetes\inspect-kubernetes-access.ps1

.\scripts\kubernetes\collect-kubernetes-fundamentals-evidence.ps1
```

Finalize:

```powershell
git diff --check
git status
```

Confirme que nenhum kubeconfig foi adicionado.

---

## Entendendo o que foi feito

### Kubernetes ganhou relação com IaC

O cluster trabalha com estado desejado e reconciliação.

### O control plane ganhou componentes claros

API Server, etcd, scheduler e controllers possuem responsabilidades diferentes.

### O node ganhou modelo operacional

Kubelet e runtime materializam Pods.

### Kubectl virou cliente consciente

Context e kubeconfig passaram a ser verificados.

### A API ganhou estrutura

`apiVersion`, `kind`, `metadata`, `spec` e `status` ficaram claros.

### Metadata ganhou política

Labels organizam e selecionam; annotations documentam.

### Segurança começou antes dos workloads

RBAC, admission, context e namespace foram tratados desde a fundação.

### O cluster local virou laboratório controlado

Kind permitiu inspecionar a plataforma sem cloud.

### Nenhum workload foi antecipado

Pod, Deployment e Service permanecem para a próxima aula.

### A próxima aula ganhou base segura

O cluster e os comandos necessários já estão preparados.

---

## Erros comuns importantes

### Tratar Kubernetes como Docker remoto

A reconciliação e a API são ignoradas.

### Confundir kubectl com cluster

O cliente pode apontar para ambientes diferentes.

### Executar delete no context errado

O impacto pode ser grave.

### Commitar kubeconfig

Credenciais e endpoints podem vazar.

### Usar namespace default em tudo

Organização e políticas ficam difíceis.

### Usar labels aleatórias

Selectors e operações ficam frágeis.

### Armazenar secret em annotation

Metadata pode ser exposta.

### Dar cluster-admin à aplicação

Viola menor privilégio.

### Configurar liveness como readiness

A aplicação pode reiniciar sem necessidade.

### Definir limits sem medir

Throttling e OOM podem aumentar.

### Confiar em self-healing para corrigir bug

O cluster pode apenas reiniciar o defeito.

### Antecipar workloads

A aula 528 possui esse objetivo.

---

## Comandos úteis

### Context atual

```powershell
kubectl config current-context
```

### Informações do cluster

```powershell
kubectl cluster-info
```

### Nodes

```powershell
kubectl get nodes `
  -o wide
```

### Namespaces

```powershell
kubectl get namespaces
```

### Recursos da API

```powershell
kubectl api-resources
```

### Explicar recurso

```powershell
kubectl explain deployment.spec
```

### Consultar autorização

```powershell
kubectl auth can-i `
  create `
  deployments `
  --namespace `
  default
```

---

## Exercício guiado

### Parte 1 — Ferramentas

Valide kubectl e kind.

### Parte 2 — Cluster

Crie o cluster local.

### Parte 3 — Context

Confirme acesso seguro.

### Parte 4 — Control plane

Inspecione a API.

### Parte 5 — Node

Observe capacidade e condições.

### Parte 6 — API

Liste resources e versions.

### Parte 7 — RBAC

Use `auth can-i`.

### Parte 8 — Metadata

Crie policies de labels e annotations.

### Parte 9 — Evidence

Gere inventário sanitizado.

### Parte 10 — Safety

Simule context incorreto.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 526 foi preservada;
- Kubernetes foi definido;
- cluster foi definido;
- control plane foi definido;
- worker node foi definido;
- API Server foi definido;
- etcd foi definido;
- scheduler foi definido;
- controller manager foi definido;
- node foi definido;
- kubelet foi definido;
- container runtime foi definido;
- namespace foi definido;
- manifest foi definido;
- apiVersion foi definido;
- kind foi definido;
- metadata foi definida;
- spec foi definida;
- status foi definido;
- label foi definida;
- selector foi definido;
- annotation foi definida;
- reconciliation foi definida;
- kubeconfig foi definido;
- context foi definido;
- RBAC foi definido;
- admission foi definido;
- event foi definido;
- startup probe foi explicada;
- readiness probe foi explicada;
- liveness probe foi explicada;
- requests foram explicados;
- limits foram explicados;
- kubectl foi validado;
- kind foi validado;
- Docker foi validado;
- configuração kind foi criada;
- cluster local foi criado;
- node único foi documentado;
- cluster foi classificado como não produtivo;
- context kind foi confirmado;
- kubeconfig não foi commitado;
- preflight foi criado;
- preflight exige context kind;
- cluster info foi consultado;
- nodes foram listados;
- node foi descrito;
- capacity foi observada;
- allocatable foi observada;
- conditions foram observadas;
- namespaces foram listados;
- system Pods foram listados;
- resources namespaced foram consultados;
- resources cluster-scoped foram consultados;
- API versions foram consultadas;
- `kubectl explain pod` foi usado;
- `kubectl explain deployment.spec` foi usado;
- `kubectl explain service.spec` foi usado;
- `auth can-i` foi usado;
- events foram consultados;
- node YAML foi comparado;
- metadata, spec e status foram observados;
- inventário conceitual foi criado;
- label policy foi criada;
- labels recomendadas foram definidas;
- namespace policy foi criada;
- default foi proibido para ambientes reais;
- access policy foi criada;
- menor privilégio foi documentado;
- context explícito foi exigido;
- namespace explícito foi exigido;
- script de inspeção foi criado;
- script de acesso foi criado;
- evidence JSON foi criada;
- evidence não contém kubeconfig;
- evidence não contém token;
- context incorreto foi simulado;
- operação destrutiva foi bloqueada;
- cluster indisponível foi simulado;
- falha da API foi detectada;
- arquitetura foi documentada;
- control plane foi documentado;
- node model foi documentado;
- API objects foram documentados;
- metadata policy foi documentada;
- access safety foi documentada;
- probes e resources foram documentados;
- runbook local foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- script de remoção foi criado;
- nome do cluster usa allowlist;
- decisão de manter ou remover foi registrada;
- Pod da aplicação não foi criado;
- Deployment da aplicação não foi criado;
- Service da aplicação não foi criado;
- ConfigMap não foi aplicado;
- Secret não foi aplicado;
- Ingress não foi criado;
- cloud não foi usada;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 528 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/fundamentals `
  scripts/kubernetes `
  docs/devops/kubernetes `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure arquivos sensíveis:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "client-key-data|client-certificate-data|token:|kubeconfig"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): consolidar fundamentos de Kubernetes"
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
- cluster dump completo;
- container exportado;
- logs brutos;
- evidence local não sanitizada;
- Pod da aplicação;
- Deployment da aplicação;
- Service da aplicação;
- manifest da aula 528.

---

## Fechamento e ponte para a próxima aula

Nesta aula, Kubernetes deixou de ser uma abstração distante.

Você preparou:

```text
kubectl;

kind;

cluster local;

context seguro;

inspeção da API;

evidência sanitizada.
```

Você comprovou que:

- Kubernetes trabalha com estado desejado;
- controllers reconciliam diferenças;
- API Server centraliza a API;
- etcd armazena estado;
- scheduler escolhe nodes;
- kubelet materializa workloads;
- kubectl é apenas o cliente;
- kubeconfig exige proteção;
- `spec` representa intenção;
- `status` representa observação;
- labels organizam e selecionam;
- annotations documentam;
- namespaces criam escopo lógico;
- RBAC limita ações;
- admission pode validar políticas;
- probes e resources afetam operação;
- kind é laboratório, não produção.

A próxima aula será:

```text
528 - M17.23 - Pod Deployment Service
```

Nela, você irá transformar a imagem da aplicação em resources Kubernetes, comparar Pod isolado com Deployment gerenciado e expor acesso estável por Service.

Nenhum Pod, Deployment ou Service da aplicação foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei Docker, kubectl e kind.
- [ ] Criei o cluster local.
- [ ] Confirmei context e API.
- [ ] Inspecionei node e namespaces.
- [ ] Consultei resources e RBAC.
- [ ] Criei policies de metadata e acesso.
- [ ] Gere evidence sanitizada.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `kubectl` não é reconhecido

Revise instalação e PATH.

### `kind` não encontra Docker

Docker Desktop pode não estar iniciado.

### O cluster já existe

Liste clusters antes de criar e use o runbook.

### `kubectl` aponta para outro cluster

Pare e selecione o context correto.

### A API retorna connection refused

O container do control plane pode estar parado.

### O node fica NotReady

Revise Docker, recursos e logs do node.

### O kubeconfig foi detectado no Git

Remova do stage, trate possível exposição e revise `.gitignore`.

### `auth can-i` retorna no

A identidade não possui a permissão consultada.

### Events estão vazios

A retenção pode ter expirado ou não houve evento recente.

### O cluster consome muitos recursos

Ajuste Docker Desktop ou remova o cluster.

### Um Pod da aplicação apareceu nesta aula

Remova o workload e preserve para a aula 528.

### O script aceita qualquer context

Corrija para usar allowlist do laboratório.

---

## Perguntas de revisão

1. O que é Kubernetes?
2. O que é cluster?
3. O que é control plane?
4. O que faz API Server?
5. O que faz etcd?
6. O que faz scheduler?
7. O que faz controller manager?
8. O que faz kubelet?
9. O que é reconciliation?
10. Qual a diferença entre spec e status?
11. O que é kubeconfig?
12. O que é context?
13. O que é namespace?
14. Qual a diferença entre label e annotation?
15. O que é RBAC?
16. O que é admission?
17. Para que serve readiness?
18. Para que serve liveness?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Orquestração de containers.
2. Control plane e nodes.
3. Camada de controle.
4. Expor e validar API.
5. Armazenar estado.
6. Escolher node.
7. Executar controladores.
8. Materializar Pods.
9. Convergir estado.
10. Intenção e observação.
11. Configuração de acesso.
12. Cluster, user e namespace.
13. Escopo lógico.
14. Seleção e descrição.
15. Autorização baseada em roles.
16. Validação e mutação.
17. Liberar tráfego.
18. Detectar necessidade de restart.
19. Workloads da aplicação.
20. Pod Deployment Service.

---

## Desafio opcional

Modele um cluster produtivo conceitual.

Requisitos:

- três control plane nodes;
- três worker nodes;
- API load balancer;
- backup de etcd;
- isolamento de ambientes;
- RBAC;
- observabilidade;
- upgrade plan;
- disaster recovery;
- nenhum recurso real;
- nenhum manifest de workload.

O objetivo é comparar o laboratório kind com requisitos produtivos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 527 - M17.22 - Kubernetes fundamentos

- Continuei após Infraestrutura como Código conceitual.
- Defini Kubernetes como plataforma de orquestração.
- Relacionei desired state e reconciliation.
- Estudei cluster, control plane e nodes.
- Estudei API Server, etcd, scheduler e controller manager.
- Estudei kubelet e container runtime.
- Diferenciei kubectl e cluster.
- Tratei kubeconfig como arquivo sensível.
- Diferenciei resource e object.
- Estudei apiVersion, kind, metadata, spec e status.
- Diferenciei labels, selectors e annotations.
- Estudei namespaces e seus limites.
- Introduzi RBAC e admission.
- Estudei events e conditions.
- Introduzi startup, readiness e liveness probes.
- Introduzi requests e limits.
- Validei Docker, kubectl e kind.
- Criei cluster local com kind.
- Confirmei context seguro.
- Consultei cluster info e nodes.
- Descrevi o node do laboratório.
- Listei namespaces e system Pods.
- Consultei API resources e versions.
- Usei `kubectl explain`.
- Usei `kubectl auth can-i`.
- Consultei events.
- Criei inventário do cluster.
- Criei policies de labels, namespace e acesso.
- Criei scripts de preflight, inspeção e evidence.
- Simulei context incorreto e API indisponível.
- Não antecipei Pod, Deployment ou Service.
- Próxima aula: Pod Deployment Service.
```

---

## Referência técnica curta

- Kubernetes Cluster Architecture.
- Kubernetes API Concepts.
- Kubernetes Objects.
- Kubernetes Controllers.
- Kubernetes Nodes.
- kubectl.
- Kubeconfig.
- Kubernetes Labels and Selectors.
- Kubernetes RBAC.
- Kubernetes Probes and Resource Management.

Regra final:

```text
Kubernetes materializa infraestrutura declarativa por uma API orientada a estado: kubectl usa kubeconfig e context para enviar manifests ao API Server, etcd preserva o estado do cluster, scheduler escolhe nodes, controllers executam loops de reconciliação e kubelet trabalha com o runtime para materializar Pods; cada object possui apiVersion, kind, metadata, spec e status, labels permitem seleção, annotations registram metadata e namespaces criam escopo lógico que precisa ser complementado por RBAC, policies e isolamento de rede; probes informam startup, readiness e liveness, enquanto requests e limits orientam scheduling e proteção de recursos; um cluster kind local permite inspecionar nodes, system Pods, API resources, events e autorização sem cloud, mas kubeconfig continua sensível e comandos destrutivos exigem context em allowlist; nenhum workload da aplicação é antecipado, deixando para a aula 528 a criação e comparação prática de Pod, Deployment e Service.
```
