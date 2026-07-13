# 536 - M17.31 - Namespace RBAC conceitual

## Apresentação da aula

Na aula 535, você consolidou o modelo mental do Helm.

Você passou a diferenciar:

```text
Chart;

Values;

Templates;

Release;

Revision;

Lifecycle;

Policies;

Evidence.
```

Também compreendeu que um release precisa operar em um namespace explícito e que resources podem ser:

```text
namespaced;

cluster-scoped.
```

Essa distinção é essencial porque acesso em Kubernetes não deve ser concedido de forma genérica.

A pergunta central desta aula será:

```text
como organizar
resources por escopo

e permitir
somente as ações necessárias

para usuários,
pipelines
e aplicações?
```

A resposta será construída com dois conceitos:

```text
Namespace;

RBAC.
```

Namespace organiza resources namespaced dentro do cluster.

RBAC controla quem pode executar determinadas ações sobre determinados resources.

A sigla significa:

```text
Role-Based Access Control.
```

O modelo possui quatro resources centrais:

```text
Role;

ClusterRole;

RoleBinding;

ClusterRoleBinding.
```

Além deles, aparecem subjects como:

```text
User;

Group;

ServiceAccount.
```

A regra central será:

```text
Role e ClusterRole
definem permissões;

RoleBinding e ClusterRoleBinding
associam permissões
a subjects.
```

Uma permissão RBAC é normalmente expressa por:

- `apiGroups`;
- `resources`;
- `resourceNames`;
- `verbs`;
- namespace ou escopo de cluster.

Exemplo conceitual:

```yaml
rules:
  - apiGroups:
      - ""

    resources:
      - pods

    verbs:
      - get
      - list
      - watch
```

Essa regra permite leitura de Pods.

Ela não permite:

- criar;
- atualizar;
- deletar;
- executar comandos;
- ler Secrets;
- alterar Deployments.

Kubernetes RBAC é aditivo: permissões de múltiplos bindings são combinadas e não existe uma negação explícita comum que anule outra concessão. A segurança depende de poucos bindings, ServiceAccounts limitados e revisões periódicas.

Namespace organiza escopo, mas não é uma barreira de segurança completa. RBAC, NetworkPolicy, Pod Security, quotas, admission, identidade e isolamento continuam necessários. Nesta aula, o foco permanece em namespace e RBAC.

ServiceAccount representa uma identidade namespaced de workloads e automações; usuários humanos normalmente vêm de OIDC, certificados, cloud IAM ou uma plataforma corporativa.

Autenticação responde quem é a identidade; autorização define o que ela pode fazer. RBAC atua na autorização, antes de admission e persistência.

Role é namespaced. ClusterRole pode cobrir resources cluster-scoped, vários namespaces ou servir como template reutilizado por RoleBinding. Quando um RoleBinding referencia ClusterRole, a concessão continua limitada ao namespace; ClusterRoleBinding amplia para o cluster.

Menor privilégio concede somente resources, verbs, namespace, período e identidade necessários. Um pipeline de deploy não precisa ler todos os Secrets nem operar todos os namespaces.

Verbs comuns incluem `get`, `list`, `watch`, `create`, `update`, `patch` e `delete`. Subresources como `pods/log`, `pods/exec`, `deployments/scale` e `serviceaccounts/token` exigem permissões próprias.

`resourceNames` pode limitar alguns verbs a objects nomeados, mas não restringe `list` e `watch` como uma consulta geral. O comportamento precisa ser validado.

Outro tema será wildcards.

Exemplos perigosos:

```yaml
apiGroups:
  - "*"

resources:
  - "*"

verbs:
  - "*"
```

Esse padrão equivale a permissão ampla.

Ele será proibido na baseline da formação.

`cluster-admin` é extremamente poderosa e não deve ser vinculada a usuários comuns, pipelines, aplicações ou ServiceAccounts default. O acesso administrativo do kind não é modelo de produção.

Outro tema será o ServiceAccount default.

Cada namespace possui um ServiceAccount chamado:

```text
default.
```

Quando um Pod não informa outro ServiceAccount, ele pode usar o default.

A baseline profissional prefere:

```text
ServiceAccount dedicado
por workload
ou responsabilidade.
```

Na aula 534, você desabilitou:

```yaml
automountServiceAccountToken:
  false
```

Isso continua correto para a aplicação que não precisa chamar a API Kubernetes.

Criar um ServiceAccount dedicado não obriga a montar token.

Quando uma aplicação precisa da API, tokens projetados devem usar audience e expiração curta. Nenhum token será criado, exibido ou versionado.

A policy usará nomes de namespace minúsculos, previsíveis, associados a ambiente ou domínio e com owner explícito.

Labels de namespace podem registrar environment, owner, policy level e lifecycle; annotations podem apontar para runbook e change policy. Nenhuma credencial entra em metadata.

Excluir um namespace pode remover muitos resources e deixar finalizers pendentes. A policy exige inventário, owner, aprovação, cleanup e análise de dependências. Nenhum namespace será deletado.

Namespaces podem separar dev, hml e prod, mas todos compartilham o cluster e seu blast radius. Ambientes críticos podem exigir clusters separados, tema conectado à aula 537.

Pipelines precisam de identidade própria, sem kubeconfig pessoal, token administrativo ou credencial permanente compartilhada. OIDC, workload identity e credenciais curtas serão apenas planejados; o laboratório usará um ServiceAccount local read-only.

A `orders-api` recebe ConfigMap e Secret pelo PodSpec, não consulta a API e mantém `automountServiceAccountToken: false`; portanto, não recebe rules de leitura de resources.

Operadores podem precisar ler Pods, logs e events ou executar ações de rollout. Esses poderes devem ser separados; `pods/exec` é acesso interativo sensível.

Kubernetes permite consultar autorização com:

```text
--as;

--as-group.
```

Isso depende da permissão de impersonate.

No laboratório administrativo, você poderá usar:

```powershell
kubectl auth can-i
```

com ServiceAccounts.

Outro tema será `kubectl auth can-i`.

Exemplos:

```powershell
kubectl auth can-i `
  get `
  pods `
  --namespace `
  formacao-java-dev
```

Para um ServiceAccount:

```powershell
kubectl auth can-i `
  list `
  pods `
  --namespace `
  formacao-java-dev `
  --as `
  system:serviceaccount:formacao-java-dev:release-auditor
```

```text
yes;

no.
```

Outro tema será `--list`.

Exemplo:

```powershell
kubectl auth can-i `
  --list `
  --namespace `
  formacao-java-dev `
  --as `
  system:serviceaccount:formacao-java-dev:release-auditor
```

A saída pode ser extensa.

Ela será sanitizada antes de entrar na evidence.

APIs de authorization review ajudam a avaliar permissões, mas não substituem auditoria completa de escopo e bindings.

Outro tema será agregação de ClusterRoles.

ClusterRoles podem usar labels de aggregation para compor outras roles.

Esse mecanismo é usado por roles padrão como:

- admin;
- edit;
- view.

Adicionar rules por agregação pode ampliar permissões de forma indireta.

A policy exige revisão cuidadosa dessas labels.

Nenhuma agregação será criada nesta aula.

Roles padrão como `cluster-admin`, `admin`, `edit` e `view` podem ser mais amplas que o necessário. A baseline criará uma Role dedicada.

Outro tema será Secrets.

Permitir:

```text
get secrets;
```

permite recuperar o conteúdo codificado dos Secrets acessíveis.

Isso é uma permissão altamente sensível.

O ServiceAccount de auditoria desta aula não poderá ler Secrets.

Também não poderá listar Secrets.

Outro tema será ConfigMaps.

ConfigMaps não são classificadas como Secrets.

Ainda podem conter informações internas.

A Role de laboratório não receberá leitura de ConfigMaps por padrão.

O objetivo será observar apenas:

- Pods;
- Deployments;
- ReplicaSets;
- Services;
- Ingresses;
- HPA;
- Events.

Logs usam o subresource `pods/log`. A baseline permite leitura local, mas reconhece que logs podem conter dados sensíveis e, em produção, podem ser acessados por plataforma central.

`pods/exec`, `pods/portforward` e `deployments/scale` são subresources sensíveis e não serão concedidos à Role de auditoria.

Helm usa a identidade do kubeconfig e precisa de autorização para todos os resources renderizados. Charts com Namespace, ClusterRole, CRD ou webhook exigem boundaries e revisão adicionais.

Antes de um release, o pipeline pode executar `can-i` para os verbs necessários. Isso complementa, mas não substitui, o dry-run.

Separe auditoria, deploy, revisão de segurança e operação de cluster em identidades diferentes.

Acesso break-glass exige justificativa, prazo, auditoria, aprovação, revogação e post-mortem. Nenhum acesso emergencial será criado.

Mudanças de RBAC devem registrar subject, role, binding, namespace, rules, owner, justificativa, expiração, reviewer e evidence.

A auditoria precisa localizar subjects órfãos, bindings sem owner, ServiceAccounts sem uso, wildcards, cluster-admin, acesso a Secrets e namespaces obsoletos.

Em RBAC, ausência de permissão resulta em negação. A baseline começa sem acesso e adiciona somente o necessário.

Outro tema será o laboratório prático.

Você criará, apenas no cluster kind:

```text
ServiceAccount:
release-auditor.

Role:
release-auditor.

RoleBinding:
release-auditor.
```

A Role permitirá leitura controlada no namespace:

```text
formacao-java-dev.
```

Ela não permitirá:

- Secrets;
- exec;
- port-forward;
- create;
- patch;
- update;
- delete;
- scale;
- resources de outros namespaces;
- resources cluster-scoped.

A prática comprovará permissões permitidas e negadas.

Os resources read-only podem permanecer no namespace, mas haverá script de cleanup e a decisão será registrada na evidence.

Outro tema será a próxima aula.

A próxima aula será:

```text
537 - M17.32 - Cloud conceitos para backend
```

Portanto, esta aula não implementará:

- IAM de cloud;
- VPC;
- subnets;
- load balancer gerenciado;
- banco gerenciado;
- storage de objetos;
- cluster cloud;
- OIDC externo;
- workload identity real.

Esses conceitos serão introduzidos na aula seguinte.

Ao final, você deverá explicar:

```text
o que Namespace organiza;

o que RBAC autoriza;

como Role difere
de ClusterRole;

como RoleBinding difere
de ClusterRoleBinding;

o que é Subject;

por que ServiceAccount
não é usuário humano;

como verbs,
resources
e apiGroups
formam uma rule;

por que wildcards
são perigosos;

como validar acesso
com can-i;

por que Helm
depende do RBAC;

como aplicar
least privilege.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
534:
Volumes Kubernetes.

535:
Helm conceitual.

536:
Namespace RBAC conceitual.

537:
Cloud conceitos para backend.

538:
Deploy em PaaS conceitual.
```

A aula 535 respondeu:

```text
como empacotar,
versionar
e auditar
manifests com Helm?
```

A aula 536 responderá:

```text
como organizar
resources por namespace

e autorizar
somente as ações
necessárias?
```

Nesta aula:

```text
Namespace:
sim.

Role:
sim.

ClusterRole:
sim.

RoleBinding:
sim.

ClusterRoleBinding:
sim.

ServiceAccount:
sim.

User:
conceitual.

Group:
conceitual.

verbs:
sim.

apiGroups:
sim.

resources:
sim.

subresources:
sim.

resourceNames:
sim.

wildcards:
sim.

kubectl auth can-i:
sim.

least privilege:
sim.

ServiceAccount read-only:
sim.

Role read-only:
sim.

RoleBinding:
sim.

Secret access:
negado.

pods/exec:
negado.

cloud IAM:
não.

OIDC externo:
conceitual.
```

A regra central será:

```text
Namespace limita escopo;

Role define ações locais;

Binding associa subjects;

least privilege reduz risco.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
k8s/rbac
├── namespace-policy.yaml
├── serviceaccount-release-auditor.yaml
├── role-release-auditor.yaml
├── rolebinding-release-auditor.yaml
├── rbac-policy.yaml
├── rbac-access-matrix.yaml
└── cloud-identity-adoption-plan.yaml

scripts/kubernetes/rbac
├── inspect-namespaces.ps1
├── inspect-current-access.ps1
├── validate-rbac-manifests.ps1
├── apply-release-auditor.ps1
├── verify-release-auditor-allowed.ps1
├── verify-release-auditor-denied.ps1
├── audit-rbac-risk.ps1
├── collect-rbac-evidence.ps1
└── cleanup-release-auditor.ps1

docs/devops/kubernetes-rbac
├── NAMESPACE_STRATEGY.md
├── RBAC_MODEL.md
├── ROLE_VS_CLUSTERROLE.md
├── BINDINGS_AND_SUBJECTS.md
├── SERVICEACCOUNT_SECURITY.md
├── HELM_RBAC_BOUNDARIES.md
├── RBAC_AUDIT_RUNBOOK.md
├── RBAC_TEST_MATRIX.md
└── RBAC_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
namespaces inventariados;

escopos identificados;

acesso atual inspecionado;

ServiceAccount dedicado;

Role read-only;

RoleBinding namespaced;

acessos permitidos testados;

acessos negados testados;

wildcards auditados;

evidência sanitizada.
```

Você irá:

1. confirmar cluster;
2. confirmar aplicação;
3. inventariar namespaces;
4. classificar namespaces;
5. inspecionar acesso atual;
6. criar namespace policy;
7. criar RBAC policy;
8. criar access matrix;
9. criar ServiceAccount;
10. criar Role;
11. criar RoleBinding;
12. validar manifests;
13. aplicar resources;
14. testar leitura de Pods;
15. testar leitura de logs;
16. testar leitura de Deployments;
17. testar Services;
18. testar Ingress;
19. testar HPA;
20. negar Secrets;
21. negar exec;
22. negar patch;
23. negar delete;
24. negar outro namespace;
25. negar cluster resources;
26. auditar wildcards;
27. documentar Helm boundaries;
28. criar plano de cloud identity;
29. coletar evidence;
30. executar gate;
31. commitar;
32. preparar a aula 537.

---

## Conceito essencial

### Namespace

Escopo lógico para resources namespaced.

---

### RBAC

Modelo de autorização baseado em roles.

---

### Role

Conjunto de rules limitado a um namespace.

---

### ClusterRole

Conjunto de rules com escopo de cluster ou reutilização em namespaces.

---

### RoleBinding

Associa uma Role ou ClusterRole a subjects dentro de um namespace.

---

### ClusterRoleBinding

Associa uma ClusterRole a subjects no cluster.

---

### Subject

Identidade que recebe uma role.

Tipos:

- User;
- Group;
- ServiceAccount.

---

### ServiceAccount

Identidade namespaced para workloads e automações.

---

### Rule

Combinação de API groups, resources, resource names e verbs.

---

### Verb

Ação autorizada.

---

### Subresource

Parte específica de um resource, como `pods/log`.

---

### Least privilege

Concessão mínima necessária.

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

### 2. Confirmar a baseline

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme aplicação e componentes saudáveis.

---

### 3. Inventariar namespaces

```powershell
kubectl get namespaces `
  --show-labels
```

Classifique:

- aplicação;
- sistema;
- controller;
- observabilidade;
- laboratório.

---

### 4. Inspecionar resources namespaced

```powershell
kubectl api-resources `
  --namespaced=true
```

Depois:

```powershell
kubectl api-resources `
  --namespaced=false
```

Registre a diferença.

---

### 5. Inspecionar acesso atual

```powershell
kubectl auth can-i `
  --list `
  --namespace `
  formacao-java-dev
```

Seu usuário do kind pode possuir acesso amplo.

Não copie essa baseline para produção.

---

### 6. Criar policy de namespace

Arquivo:

```text
k8s/rbac/namespace-policy.yaml
```

Conteúdo conceitual:

```yaml
namespace:
  naming:
    lowercase:
      required

  labels:
    required:
      - environment
      - owner-role
      - lifecycle

  deletion:
    inventory:
      required

    approval:
      required

  production:
    sharedWithDevelopment:
      forbidden
```

---

### 7. Criar policy de RBAC

Arquivo:

```text
k8s/rbac/rbac-policy.yaml
```

Inclua:

```yaml
rbac:
  leastPrivilege:
    required

  wildcard:
    forbidden

  clusterAdmin:
    application:
      forbidden

    pipeline:
      forbidden

  secrets:
    read:
      approvalRequired

  exec:
    approvalRequired

  bindings:
    owner:
      required
```

---

### 8. Criar access matrix

Arquivo:

```text
k8s/rbac/rbac-access-matrix.yaml
```

Defina para `release-auditor`:

```yaml
allowed:
  - get-list-watch pods
  - get pods/log
  - get-list-watch deployments
  - get-list-watch replicasets
  - get-list-watch services
  - get-list-watch ingresses
  - get-list-watch horizontalpodautoscalers
  - get-list-watch events

denied:
  - secrets
  - pods/exec
  - pods/portforward
  - deployments/scale
  - create
  - patch
  - update
  - delete
  - cluster-scoped resources
```

---

### 9. Criar o ServiceAccount

Arquivo:

```text
serviceaccount-release-auditor.yaml
```

Conteúdo:

```yaml
apiVersion:
  v1

kind:
  ServiceAccount

metadata:
  name:
    release-auditor

  namespace:
    formacao-java-dev

  labels:
    app.kubernetes.io/name:
      release-auditor

    app.kubernetes.io/component:
      authorization

    app.kubernetes.io/part-of:
      formacao-java

automountServiceAccountToken:
  false
```

O ServiceAccount será usado para authorization review.

Nenhum Pod utilizará essa identidade.

---

### 10. Criar a Role

Arquivo:

```text
role-release-auditor.yaml
```

Conteúdo:

```yaml
apiVersion:
  rbac.authorization.k8s.io/v1

kind:
  Role

metadata:
  name:
    release-auditor

  namespace:
    formacao-java-dev

rules:
  - apiGroups:
      - ""

    resources:
      - pods
      - services
      - events

    verbs:
      - get
      - list
      - watch

  - apiGroups:
      - ""

    resources:
      - pods/log

    verbs:
      - get

  - apiGroups:
      - apps

    resources:
      - deployments
      - replicasets

    verbs:
      - get
      - list
      - watch

  - apiGroups:
      - networking.k8s.io

    resources:
      - ingresses

    verbs:
      - get
      - list
      - watch

  - apiGroups:
      - autoscaling

    resources:
      - horizontalpodautoscalers

    verbs:
      - get
      - list
      - watch
```

Não existe rule para Secrets ou exec.

---

### 11. Criar o RoleBinding

Arquivo:

```text
rolebinding-release-auditor.yaml
```

Conteúdo:

```yaml
apiVersion:
  rbac.authorization.k8s.io/v1

kind:
  RoleBinding

metadata:
  name:
    release-auditor

  namespace:
    formacao-java-dev

subjects:
  - kind:
      ServiceAccount

    name:
      release-auditor

    namespace:
      formacao-java-dev

roleRef:
  apiGroup:
    rbac.authorization.k8s.io

  kind:
    Role

  name:
    release-auditor
```

O campo `roleRef` é estrutural e não deve ser alterado em um binding existente sem recriação apropriada.

---

### 12. Validar os manifests

Execute:

```powershell
kubectl apply `
  --server-side `
  --dry-run=server `
  -f `
  "k8s/rbac/serviceaccount-release-auditor.yaml" `
  -f `
  "k8s/rbac/role-release-auditor.yaml" `
  -f `
  "k8s/rbac/rolebinding-release-auditor.yaml"
```

O validator verifica:

- namespace permitido;
- sem wildcard;
- sem Secrets;
- sem exec;
- sem port-forward;
- sem write verbs;
- sem ClusterRoleBinding;
- roleRef correta;
- subject correto.

---

### 13. Aplicar os resources

```powershell
kubectl apply `
  -f `
  "k8s/rbac/serviceaccount-release-auditor.yaml" `
  -f `
  "k8s/rbac/role-release-auditor.yaml" `
  -f `
  "k8s/rbac/rolebinding-release-auditor.yaml"
```

---

### 14. Definir a identidade de teste

```powershell
$AuditorIdentity = `
  "system:serviceaccount:formacao-java-dev:release-auditor"
```

---

### 15. Testar leitura de Pods

```powershell
kubectl auth can-i `
  list `
  pods `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
yes.
```

---

### 16. Testar logs

```powershell
kubectl auth can-i `
  get `
  pods/log `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
yes.
```

---

### 17. Testar Deployments

```powershell
kubectl auth can-i `
  get `
  deployments `
  --api-group `
  apps `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
yes.
```

---

### 18. Testar Ingress

```powershell
kubectl auth can-i `
  list `
  ingresses `
  --api-group `
  networking.k8s.io `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
yes.
```

---

### 19. Testar HPA

```powershell
kubectl auth can-i `
  get `
  horizontalpodautoscalers `
  --api-group `
  autoscaling `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
yes.
```

---

### 20. Negar leitura de Secrets

```powershell
kubectl auth can-i `
  get `
  secrets `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

Teste também:

```powershell
kubectl auth can-i `
  list `
  secrets `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

---

### 21. Negar exec

```powershell
kubectl auth can-i `
  create `
  pods/exec `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

---

### 22. Negar port-forward

```powershell
kubectl auth can-i `
  create `
  pods/portforward `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

---

### 23. Negar alteração do Deployment

```powershell
kubectl auth can-i `
  patch `
  deployments `
  --api-group `
  apps `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

---

### 24. Negar scale

```powershell
kubectl auth can-i `
  patch `
  deployments/scale `
  --api-group `
  apps `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

---

### 25. Negar outro namespace

```powershell
kubectl auth can-i `
  list `
  pods `
  --namespace `
  kube-system `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

---

### 26. Negar resource cluster-scoped

```powershell
kubectl auth can-i `
  list `
  nodes `
  --as `
  $AuditorIdentity
```

Resultado esperado:

```text
no.
```

---

### 27. Listar permissões sanitizadas

```powershell
kubectl auth can-i `
  --list `
  --namespace `
  formacao-java-dev `
  --as `
  $AuditorIdentity
```

O script extrai somente:

- apiGroup;
- resource;
- verb;
- non-resource URL quando existir.

---

### 28. Auditar wildcards

O script:

```text
audit-rbac-risk.ps1
```

procura:

- `verbs: ["*"]`;
- `resources: ["*"]`;
- `apiGroups: ["*"]`;
- ClusterRoleBinding para ServiceAccounts;
- cluster-admin;
- Secrets;
- exec;
- impersonate;
- bind;
- escalate;
- approve;
- certificatesigningrequests.

Ele não altera resources.

---

### 29. Documentar boundaries do Helm

Arquivo:

```text
HELM_RBAC_BOUNDARIES.md
```

Defina:

```text
release-auditor:

read-only.

release-deployer:

futuro,
namespaced,
sem RBAC amplo.

cluster-operator:

cluster-scoped,
fora do chart da aplicação.

security-reviewer:

aprova alterações RBAC.
```

Nenhuma identidade de deploy será criada.

---

### 30. Criar plano de cloud identity

Arquivo:

```text
cloud-identity-adoption-plan.yaml
```

Inclua:

- OIDC;
- short-lived credentials;
- workload identity;
- pipeline identity;
- namespace mapping;
- role mapping;
- audit;
- revocation;
- no static kubeconfig;
- no long-lived token.

Nenhuma integração externa será implementada.

---

### 31. Criar evidence

Arquivo:

```text
kubernetes-rbac-evidence.json.
```

Campos permitidos:

- context;
- namespace;
- ServiceAccount;
- Role;
- RoleBinding;
- allowed checks;
- denied checks;
- wildcard findings;
- cluster-admin findings;
- secret access false;
- exec access false;
- cross-namespace access false;
- cluster-scoped access false;
- baseline healthy;
- timestamp.

Sem tokens, kubeconfig ou conteúdo de Secrets.

---

### 32. Criar documentação

#### `NAMESPACE_STRATEGY.md`

Explique naming, labels, lifecycle e ambientes.

#### `RBAC_MODEL.md`

Explique rules, verbs, resources e subjects.

#### `ROLE_VS_CLUSTERROLE.md`

Explique escopos e reutilização.

#### `BINDINGS_AND_SUBJECTS.md`

Explique associações e `roleRef`.

#### `SERVICEACCOUNT_SECURITY.md`

Explique tokens, automount e identidade de workload.

#### `HELM_RBAC_BOUNDARIES.md`

Explique permissões de release.

---

### 33. Criar runbook

Arquivo:

```text
RBAC_AUDIT_RUNBOOK.md
```

Passos:

1. confirmar context;
2. inventariar namespaces;
3. inventariar Roles;
4. inventariar bindings;
5. localizar wildcards;
6. localizar cluster-admin;
7. localizar acesso a Secrets;
8. localizar exec e impersonate;
9. validar owners;
10. validar subjects;
11. executar `can-i`;
12. registrar evidence;
13. remover acesso obsoleto.

---

### 34. Criar test matrix

Arquivo:

```text
RBAC_TEST_MATRIX.md
```

Cenários:

- ServiceAccount existe;
- Role existe;
- RoleBinding existe;
- list Pods permitido;
- logs permitidos;
- Deployment read permitido;
- Service read permitido;
- Ingress read permitido;
- HPA read permitido;
- Secret get negado;
- Secret list negado;
- exec negado;
- port-forward negado;
- patch negado;
- scale negado;
- delete negado;
- outro namespace negado;
- nodes negado;
- wildcard bloqueado;
- ClusterRoleBinding bloqueado;
- evidence sanitizada.

---

### 35. Criar troubleshooting

Arquivo:

```text
RBAC_TROUBLESHOOTING.md
```

Inclua:

- forbidden;
- no;
- subject incorreto;
- namespace incorreto;
- apiGroup incorreto;
- resource plural incorreto;
- subresource ausente;
- verb incorreto;
- RoleBinding sem efeito;
- roleRef imutável;
- ServiceAccount em outro namespace;
- permissão herdada por grupo;
- wildcard indireto;
- ClusterRole agregada;
- impersonation negada;
- Helm falha por permission denied;
- Secret acessível inesperadamente.

---

### 36. Validar a baseline

Confirme:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

O RBAC de auditoria não pode alterar a aplicação.

---

### 37. Executar gate final

Execute:

```powershell
.\scripts\kubernetes\rbac\inspect-namespaces.ps1

.\scripts\kubernetes\rbac\inspect-current-access.ps1

.\scripts\kubernetes\rbac\validate-rbac-manifests.ps1

.\scripts\kubernetes\rbac\apply-release-auditor.ps1

.\scripts\kubernetes\rbac\verify-release-auditor-allowed.ps1

.\scripts\kubernetes\rbac\verify-release-auditor-denied.ps1

.\scripts\kubernetes\rbac\audit-rbac-risk.ps1

.\scripts\kubernetes\rbac\collect-rbac-evidence.ps1
```

Finalize:

```powershell
kubectl get serviceaccount,role,rolebinding `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

---

## Entendendo o que foi feito

### Namespace ganhou estratégia

Ele deixou de ser apenas um nome no manifest.

### RBAC ganhou modelo claro

Rules e bindings foram separados.

### Role permaneceu namespaced

A permissão não vazou para outros namespaces.

### ServiceAccount ganhou responsabilidade específica

Ele representou uma identidade de auditoria.

### Allowed e denied foram comprovados

A segurança deixou de depender apenas da leitura do YAML.

### Secrets ficaram protegidos

A Role não concedeu leitura.

### Exec e port-forward ficaram protegidos

A identidade não ganhou acesso interativo aos Pods.

### Helm ganhou boundaries

Auditoria e deploy deixaram de compartilhar a mesma identidade conceitual.

### Wildcards ganharam auditoria

Permissões amplas passaram a ser detectadas.

### A próxima aula ganhou ponte

Cloud identity poderá mapear identidades externas para permissões controladas.

---

## Erros comuns importantes

### Usar namespace como única segurança

Outras camadas continuam necessárias.

### Criar ClusterRoleBinding sem necessidade

A permissão pode atingir todo o cluster.

### Dar `cluster-admin` ao pipeline

O blast radius fica excessivo.

### Usar o ServiceAccount default

Identidade e responsabilidade ficam misturadas.

### Permitir `get secrets`

O conteúdo pode ser recuperado.

### Permitir `pods/exec` como leitura

Exec é acesso interativo sensível.

### Usar wildcard em verbs

Novas APIs podem ampliar o acesso inesperadamente.

### Ignorar apiGroup

A rule pode não funcionar ou atingir o resource errado.

### Confundir RoleBinding com ClusterRoleBinding

O escopo muda completamente.

### Reutilizar kubeconfig pessoal no CI

A identidade fica sem ownership adequado.

### Alterar roleRef de um binding

Esse campo exige tratamento estrutural.

### Antecipar IAM cloud

A aula 537 possui esse objetivo.

---

## Comandos úteis

### Listar Roles

```powershell
kubectl get roles `
  --all-namespaces
```

### Listar bindings

```powershell
kubectl get rolebindings,clusterrolebindings `
  --all-namespaces
```

### Testar autorização

```powershell
kubectl auth can-i `
  list `
  pods `
  --namespace `
  formacao-java-dev `
  --as `
  system:serviceaccount:formacao-java-dev:release-auditor
```

### Ver Role

```powershell
kubectl describe role `
  release-auditor `
  --namespace `
  formacao-java-dev
```

### Ver RoleBinding

```powershell
kubectl describe rolebinding `
  release-auditor `
  --namespace `
  formacao-java-dev
```

---

## Exercício guiado

### Parte 1 — Namespaces

Inventarie e classifique.

### Parte 2 — Current access

Consulte seu acesso atual.

### Parte 3 — ServiceAccount

Crie identidade dedicada.

### Parte 4 — Role

Defina leitura mínima.

### Parte 5 — Binding

Associe no namespace.

### Parte 6 — Allowed

Teste Pods, logs e workloads.

### Parte 7 — Denied

Teste Secrets, exec e write.

### Parte 8 — Scope

Teste outro namespace e nodes.

### Parte 9 — Audit

Procure wildcards e cluster-admin.

### Parte 10 — Evidence

Registre resultados sem credenciais.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 535 foi preservada;
- Namespace foi definido;
- RBAC foi definido;
- Role foi definida;
- ClusterRole foi definida;
- RoleBinding foi definido;
- ClusterRoleBinding foi definido;
- Subject foi definido;
- User foi explicado;
- Group foi explicado;
- ServiceAccount foi definido;
- Rule foi definida;
- Verb foi definido;
- Subresource foi definido;
- least privilege foi definido;
- autenticação foi diferenciada de autorização;
- admission foi posicionado após autorização;
- RBAC foi tratado como aditivo;
- ausência de permissão foi tratada como negação;
- namespace não foi tratado como isolamento completo;
- Role foi classificada como namespaced;
- ClusterRole foi classificada como cluster-scoped;
- RoleBinding com ClusterRole foi explicado;
- ClusterRoleBinding foi classificado como cluster-wide;
- wildcards foram classificados como risco;
- cluster-admin foi classificado como acesso crítico;
- ServiceAccount default foi discutido;
- automount de token foi discutido;
- token projetado foi explicado;
- namespace naming foi definido;
- labels de namespace foram definidas;
- lifecycle de namespace foi explicado;
- isolamento por ambiente foi discutido;
- clusters separados foram considerados;
- identidade de pipeline foi discutida;
- kubeconfig pessoal foi proibido para CI;
- identidade da aplicação foi revisada;
- ausência de acesso à API foi preservada;
- acesso de operadores foi separado;
- `pods/log` foi tratado como subresource;
- `pods/exec` foi tratado como sensível;
- `pods/portforward` foi tratado como sensível;
- `deployments/scale` foi tratado como sensível;
- impersonation foi explicada;
- `kubectl auth can-i` foi usado;
- `--list` foi usado;
- roles padrão foram explicadas;
- agregação de ClusterRoles foi explicada;
- Secrets foram classificados como recurso sensível;
- Helm foi relacionado ao RBAC;
- separação de funções foi documentada;
- break-glass foi explicado sem implementação;
- auditoria de RBAC foi definida;
- drift de bindings foi explicado;
- context kind foi validado;
- preflight foi executado;
- baseline da aplicação foi validada;
- namespaces foram inventariados;
- resources namespaced foram listados;
- resources cluster-scoped foram listados;
- acesso atual foi inspecionado;
- policy de namespace foi criada;
- naming lowercase foi exigido;
- labels obrigatórias foram definidas;
- exclusão exige inventário;
- dev e prod compartilhados foram proibidos pela policy;
- policy de RBAC foi criada;
- least privilege foi exigido;
- wildcard foi proibido;
- cluster-admin foi proibido para aplicação;
- cluster-admin foi proibido para pipeline;
- leitura de Secrets exige aprovação;
- exec exige aprovação;
- access matrix foi criada;
- ServiceAccount foi criado;
- namespace correto foi usado;
- automount token false foi usado;
- Role foi criada;
- Role usa apiGroups corretos;
- Pods foram concedidos em leitura;
- Services foram concedidos em leitura;
- Events foram concedidos em leitura;
- pods/log foi concedido somente em get;
- Deployments foram concedidos em leitura;
- ReplicaSets foram concedidos em leitura;
- Ingresses foram concedidos em leitura;
- HPAs foram concedidos em leitura;
- Secrets não foram incluídos;
- exec não foi incluído;
- port-forward não foi incluído;
- verbs de escrita não foram incluídos;
- RoleBinding foi criado;
- RoleBinding ficou no namespace;
- subject corresponde ao ServiceAccount;
- roleRef corresponde à Role;
- server-side dry-run foi executado;
- validator bloqueou wildcard;
- validator bloqueou Secrets;
- validator bloqueou exec;
- validator bloqueou port-forward;
- validator bloqueou write verbs;
- validator bloqueou ClusterRoleBinding;
- resources foram aplicados;
- identidade de teste foi definida;
- list Pods retornou yes;
- get pods/log retornou yes;
- get Deployments retornou yes;
- list Ingresses retornou yes;
- get HPA retornou yes;
- get Secrets retornou no;
- list Secrets retornou no;
- create pods/exec retornou no;
- create pods/portforward retornou no;
- patch Deployment retornou no;
- patch deployments/scale retornou no;
- list Pods em kube-system retornou no;
- list Nodes retornou no;
- permissões foram listadas com sanitização;
- auditoria de wildcards foi criada;
- cluster-admin foi auditado;
- acesso a Secrets foi auditado;
- impersonate foi auditado;
- bind e escalate foram auditados;
- Helm boundaries foram documentadas;
- release-auditor ficou read-only;
- release-deployer ficou apenas planejado;
- cluster-operator ficou fora do chart;
- security-reviewer ficou separado;
- cloud identity plan foi criado;
- OIDC foi planejado;
- credenciais curtas foram exigidas;
- kubeconfig estático foi proibido;
- evidence foi criada;
- evidence não contém token;
- evidence não contém kubeconfig;
- evidence não contém Secrets;
- namespace strategy foi documentada;
- RBAC model foi documentado;
- Role e ClusterRole foram comparadas;
- bindings e subjects foram documentados;
- ServiceAccount security foi documentada;
- Helm boundaries foram documentadas;
- runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- cloud IAM não foi implementado;
- VPC não foi criada;
- cluster cloud não foi criado;
- OIDC externo não foi configurado;
- baseline permaneceu saudável;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 537 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/rbac `
  scripts/kubernetes/rbac `
  docs/devops/kubernetes-rbac `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure permissões amplas e credenciais:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      'verbs:\s*\["\*"\]|resources:\s*\["\*"\]|cluster-admin|token:|client-key-data'
```

Commit recomendado:

```powershell
git commit -m "security(m17): modelar Namespace e RBAC"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- kubeconfig;
- token;
- Secret;
- credencial de cloud;
- ClusterRoleBinding;
- cluster-admin;
- wildcard;
- release-deployer real;
- ServiceAccount com acesso amplo;
- IAM cloud da aula 537.

---

## Fechamento e ponte para a próxima aula

Nesta aula, namespace e autorização deixaram de ser detalhes implícitos.

O modelo passou a possuir:

```text
Namespace;

Subject;

Role;

ClusterRole;

RoleBinding;

ClusterRoleBinding;

Rules;

Evidence.
```

Você comprovou que:

- Namespace cria escopo lógico;
- Role concede permissões namespaced;
- ClusterRole pode atingir resources de cluster ou ser reutilizada;
- bindings associam subjects;
- ServiceAccount representa workload ou automação;
- RBAC é aditivo;
- ausência de permissão resulta em negação;
- wildcards aumentam risco;
- Secrets exigem proteção especial;
- logs, exec e port-forward são subresources diferentes;
- Helm utiliza a identidade do kubeconfig;
- leitura e deploy precisam de identidades separadas;
- permissões permitidas e negadas precisam ser testadas;
- menor privilégio reduz blast radius.

A próxima aula será:

```text
537 - M17.32 - Cloud conceitos para backend
```

Nela, você irá relacionar compute, rede, identidade, banco, mensageria, storage, observabilidade, alta disponibilidade e modelo de responsabilidade compartilhada com uma aplicação backend moderna.

Nenhum recurso de cloud, IAM externo, VPC ou cluster gerenciado foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei namespaces.
- [ ] Diferenciei Role e ClusterRole.
- [ ] Criei ServiceAccount dedicado.
- [ ] Criei Role read-only.
- [ ] Criei RoleBinding namespaced.
- [ ] Testei permissões permitidas e negadas.
- [ ] Auditei wildcards e cluster-admin.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `kubectl auth can-i` retorna no para uma permissão esperada

Revise namespace, apiGroup, resource, verb, subject e binding.

### A Role existe, mas não produz efeito

Pode faltar RoleBinding ou o subject está incorreto.

### O ServiceAccount está em outro namespace

O subject precisa informar o namespace correto.

### Logs retornam forbidden

A Role pode ter `pods`, mas não `pods/log`.

### Exec retorna forbidden

Esse é o comportamento esperado para o auditor.

### Acesso a Secrets retorna yes

Investigue outros bindings, grupos ou ClusterRoles.

### O RoleBinding referencia ClusterRole

Isso é válido, mas a permissão fica limitada ao namespace do binding.

### `roleRef` precisa mudar

Recrie o binding de forma controlada.

### O pipeline Helm falha com forbidden

Inventarie todos os resources do chart e ajuste uma identidade dedicada.

### O usuário kind possui tudo

Esse acesso administrativo local não é modelo produtivo.

### Uma credencial cloud apareceu

Remova e preserve a implementação para a aula seguinte.

---

## Perguntas de revisão

1. O que é Namespace?
2. O que é RBAC?
3. O que é Role?
4. O que é ClusterRole?
5. O que é RoleBinding?
6. O que é ClusterRoleBinding?
7. O que é Subject?
8. O que é ServiceAccount?
9. Qual a diferença entre autenticação e autorização?
10. O que é verb?
11. O que é subresource?
12. RBAC possui negação explícita comum?
13. O que significa least privilege?
14. Por que wildcard é perigoso?
15. Por que `get secrets` é sensível?
16. `get pods` permite ler logs?
17. Como testar autorização?
18. Como Helm se relaciona ao RBAC?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Escopo lógico.
2. Autorização por roles.
3. Permissão namespaced.
4. Permissão de cluster ou reutilizável.
5. Associação namespaced.
6. Associação cluster-wide.
7. Identidade autorizada.
8. Identidade de workload.
9. Identidade e permissão.
10. Ação autorizada.
11. Parte específica do resource.
12. Não no modelo comum.
13. Acesso mínimo.
14. Amplia acesso.
15. Revela conteúdo.
16. Não; exige pods/log.
17. `kubectl auth can-i`.
18. Usa a identidade Kubernetes.
19. IAM e cloud reais.
20. Cloud conceitos para backend.

---

## Desafio opcional

Modele uma identidade `release-deployer` sem aplicá-la.

Requisitos:

- namespace `formacao-java-dev`;
- resources exatos do futuro chart;
- sem Secrets;
- sem RBAC;
- sem Namespace;
- sem CRDs;
- sem cluster-scoped resources;
- verbs mínimos;
- `deployments/scale` justificado;
- matriz allowed e denied;
- server dry-run apenas;
- nenhuma aplicação.

O objetivo é praticar design de permissão antes de conceder acesso real.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 536 - M17.31 - Namespace RBAC conceitual

- Continuei após Helm conceitual.
- Defini Namespace e RBAC.
- Diferenciei autenticação, autorização e admission.
- Diferenciei Role, ClusterRole, RoleBinding e ClusterRoleBinding.
- Estudei Users, Groups e ServiceAccounts.
- Estudei apiGroups, resources, subresources e verbs.
- Reforcei que RBAC é aditivo.
- Apliquei o princípio de menor privilégio.
- Classifiquei wildcards e cluster-admin como riscos.
- Diferenciei usuário humano e ServiceAccount.
- Mantive token automático desabilitado na aplicação.
- Inventariei resources namespaced e cluster-scoped.
- Inspecionei o acesso administrativo atual.
- Criei policy de namespace.
- Criei policy de RBAC.
- Criei matriz de acesso.
- Criei o ServiceAccount `release-auditor`.
- Criei Role read-only no namespace.
- Criei RoleBinding namespaced.
- Validei os manifests com server-side dry-run.
- Testei leitura de Pods, logs, Deployments, Ingresses e HPA.
- Confirmei negação para Secrets.
- Confirmei negação para exec e port-forward.
- Confirmei negação para patch, scale e delete.
- Confirmei negação em outro namespace.
- Confirmei negação para Nodes.
- Auditei wildcards, cluster-admin, bind, escalate e impersonate.
- Documentei boundaries de Helm e RBAC.
- Planejei OIDC e credenciais curtas sem implementação externa.
- Criei evidence sanitizada.
- Mantive a aplicação saudável.
- Não antecipei recursos de cloud.
- Próxima aula: Cloud conceitos para backend.
```

---

## Referência técnica curta

- Kubernetes Namespaces.
- Kubernetes RBAC Authorization.
- Kubernetes Roles and ClusterRoles.
- Kubernetes RoleBindings and ClusterRoleBindings.
- Kubernetes ServiceAccounts.
- Kubernetes Authorization Overview.
- Kubernetes API Resources and Subresources.
- Kubernetes Impersonation.
- Kubernetes `kubectl auth can-i`.
- Kubernetes Least Privilege.

Regra final:

```text
Namespace organiza resources namespaced, mas isolamento efetivo depende também de RBAC e outras políticas; Role define rules locais, ClusterRole define permissões cluster-scoped ou reutilizáveis, e RoleBinding ou ClusterRoleBinding associam Users, Groups e ServiceAccounts ao escopo correto; rules combinam apiGroups, resources, subresources, resourceNames e verbs, permissões são aditivas e a ausência de concessão resulta em negação, por isso wildcards, cluster-admin, Secrets, pods/exec, port-forward, bind, escalate e impersonate exigem controle rigoroso; o ServiceAccount `release-auditor` recebe somente leitura de workloads, Services, Events, Ingresses, HPA e logs em `formacao-java-dev`, enquanto Secrets, escrita, scale, outro namespace e Nodes permanecem negados e comprovados por `kubectl auth can-i`; Helm usa a identidade Kubernetes e precisa de boundaries separados para auditor, deployer e operador de cluster; sem IAM externo, VPC ou cloud gerenciada antecipados, a aula 537 poderá relacionar identidade, compute, rede, dados e serviços gerenciados ao backend.
```
