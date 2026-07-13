# 550 - M17.45 - Revisao DevOps parte 2

## Apresentação da aula

Na aula 549, você revisou a primeira metade do conhecimento de DevOps construído no Módulo 17.

A revisão conectou:

```text
cultura DevOps;

value stream;

métricas de entrega;

CI;

continuous delivery;

continuous deployment;

Maven;

testes;

coverage;

GitHub Actions;

artifacts;

configuração;

Secrets;

containers;

health checks;

release strategies;

rollback;

migrations.
```

A primeira parte respondeu:

```text
como transformar
código versionado

em artifact
testado,
rastreável,
configurável
e pronto para release?
```

Agora a segunda parte precisa revisar o que acontece depois que o artifact e a imagem existem.

A pergunta central desta aula será:

```text
como executar,
proteger,
observar
e dimensionar

uma aplicação
em Kubernetes
e cloud?
```

A revisão parte 2 concentrará Kubernetes, cloud, operação e rastreabilidade.

A regra desta aula será:

```text
não revisar serviços
como nomes isolados;

revisar decisões,
responsabilidades
e falhas possíveis.
```

Você não precisa decorar catálogos. Precisa identificar problema, componente, risco, validação, observabilidade e recuperação.

Kubernetes e cloud serão tratados como um único fluxo operacional.

Nenhum cluster cloud, conta, credencial, serviço gerenciado real, domínio, certificado, cobrança, produção ou prova será criado ou antecipado.

A próxima aula oficial será:

```text
551 - M17.46 - Prova pratica DevOps
```

A revisão termina quando você explicar e diagnosticar o ciclo completo.

---

## Onde estamos na formação

A sequência oficial é:

```text
548:
Projeto API pronta para deploy parte 3.

549:
Revisao DevOps parte 1.

550:
Revisao DevOps parte 2.

551:
Prova pratica DevOps.
```

A aula 549 revisou:

```text
código;

build;

pipeline;

artifact;

container;

release;

rollback.
```

A aula 550 revisará:

```text
orquestração;

plataforma;

cloud;

dados;

mensageria;

cache;

storage;

custos;

segurança;

operação.
```

Nesta aula:

```text
Kubernetes:
sim.

Namespace:
sim.

RBAC:
sim.

ConfigMap:
sim.

Secret:
sim.

probes:
sim.

requests e limits:
sim.

HPA:
sim.

volumes:
sim.

Ingress:
sim.

PDB:
sim.

NetworkPolicy:
sim.

Kustomize:
sim.

Helm:
sim.

cloud:
sim.

AWS:
sim.

RDS:
sim.

SQS e SNS:
sim.

Redis:
sim.

S3:
sim.

custos:
sim.

segurança:
sim.

projeto final:
sim.

prova prática:
não.
```

A revisão seguirá seis blocos:

```text
1.
Kubernetes e desired state.

2.
configuração, segurança
e capacidade.

3.
rede, volumes
e disponibilidade.

4.
cloud e serviços gerenciados.

5.
custos, segurança
e observabilidade.

6.
projeto final
e diagnóstico integrado.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
review/devops-part-2
├── kubernetes-concept-map.yaml
├── kubernetes-resource-decision-matrix.yaml
├── probes-decision-matrix.yaml
├── capacity-scaling-matrix.yaml
├── persistence-decision-matrix.yaml
├── access-control-matrix.yaml
├── cloud-capability-map.yaml
├── aws-backend-service-map.yaml
├── managed-data-services-matrix.yaml
├── cloud-cost-security-matrix.yaml
├── final-project-traceability-map.yaml
├── integrated-troubleshooting-scenarios.yaml
├── self-assessment.yaml
└── review-part-2-evidence.yaml

scripts/review/devops-part-2
├── validate-kubernetes-concept-map.ps1
├── inspect-kubernetes-manifests.ps1
├── validate-probes-and-resources.ps1
├── validate-access-controls.ps1
├── simulate-kubernetes-failure.ps1
├── simulate-cloud-architecture-decision.ps1
├── simulate-managed-service-failure.ps1
├── validate-cost-security-decisions.ps1
├── verify-final-project-traceability.ps1
├── collect-review-part-2-evidence.ps1
└── verify-review-part-2-baseline.ps1

docs/review/devops-part-2
├── KUBERNETES_FOUNDATIONS_REVIEW.md
├── KUBERNETES_CONFIGURATION_SECURITY_REVIEW.md
├── KUBERNETES_CAPACITY_AVAILABILITY_REVIEW.md
├── HELM_KUSTOMIZE_IAC_REVIEW.md
├── CLOUD_AND_AWS_REVIEW.md
├── MANAGED_DATA_SERVICES_REVIEW.md
├── CLOUD_COST_SECURITY_OBSERVABILITY_REVIEW.md
├── FINAL_PROJECT_REVIEW.md
├── REVIEW_PART_2_TEST_MATRIX.md
└── REVIEW_PART_2_TROUBLESHOOTING.md
```

Ao final, você terá recursos Kubernetes relacionados, probes justificadas, capacidade e acesso revisados, persistência classificada, cloud mapeada, serviços gerenciados comparados, custos e segurança conectados e o projeto final rastreado.

Você irá revisar Kubernetes, configuração, capacidade, acesso, rede, persistência, Kustomize, Helm, IaC, cloud, AWS, serviços gerenciados, custos, segurança, observabilidade e o projeto final; depois resolverá cenários, gerará evidence, executará o gate e preparará a prova prática.

---

## Conceito essencial

### Desired state

Estado declarado que o controlador tenta manter.

---

### Reconciliation loop

Ciclo que compara estado desejado e estado atual, aplicando correções.

---

### Pod

Menor unidade implantável no Kubernetes.

---

### Deployment

Controlador que administra ReplicaSets e atualizações de Pods.

---

### Service

Abstração estável de rede para um conjunto de Pods.

---

### Ingress

Recurso que descreve roteamento HTTP ou HTTPS para Services.

---

### ConfigMap

Configuração não sensível.

---

### Secret

Objeto Kubernetes destinado a dados sensíveis, sem funcionar sozinho como cofre completo.

---

### Request

Capacidade solicitada pelo container para scheduling.

---

### Limit

Teto de consumo imposto ao container.

---

### HPA

Controlador que ajusta réplicas conforme métricas.

---

### RBAC

Controle de autorização baseado em roles e bindings.

---

### NetworkPolicy

Regras de tráfego entre Pods, namespaces e destinos.

---

### PersistentVolume

Recurso de armazenamento disponibilizado ao cluster.

---

### PersistentVolumeClaim

Solicitação de armazenamento feita pelo workload.

---

### Managed service

Serviço no qual parte das responsabilidades operacionais é assumida pelo provedor.

---

### Shared responsibility

Divisão de responsabilidades entre provedor e cliente.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

Depois:

```powershell
git status

git diff --check
```

Quando o cluster local estiver disponível:

```powershell
kubectl get namespace

kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- build aprovado;
- nenhum Secret real;
- manifests disponíveis;
- cluster conhecido;
- nenhum contexto externo;
- projeto final preservado;
- revisão parte 1 concluída.

---

### 2. Revisar desired state

Kubernetes trabalha de forma declarativa.

Você informa:

```text
quero duas réplicas;

quero esta imagem;

quero esta configuração;

quero este Service;

quero estes recursos.
```

Os controladores observam e reconciliam o estado.

Se um Pod falha, o Deployment pode criar outro.

Isso não significa que Kubernetes conserta bugs.

Ele restaura a forma declarada.

Se a configuração desejada estiver errada, o controlador reproduzirá o erro.

---

### 3. Revisar a arquitetura Kubernetes

O control plane reúne API Server, scheduler, controllers, estado e admissão. Nodes executam kubelet, runtime, rede e agentes da plataforma.

O backend normalmente interage com a API por manifests, ferramentas e pipelines.

A regra de negócio não deve depender do control plane.

---

### 4. Criar mapa conceitual Kubernetes

Arquivo:

```text
kubernetes-concept-map.yaml
```

Conteúdo:

```yaml
kubernetes:
  desiredState:
    declaredIn:
      - manifests

  controllers:
    deployment:
      manages:
        - replicaSet

    replicaSet:
      manages:
        - pod

  networking:
    service:
      stableAccessTo:
        - readyPods

    ingress:
      routesTo:
        - service

  configuration:
    nonSensitive:
      - configMap

    sensitive:
      - secret

  operations:
    health:
      - startupProbe
      - readinessProbe
      - livenessProbe

    capacity:
      - requests
      - limits
      - hpa
```

---

### 5. Revisar Pod, ReplicaSet e Deployment

#### Pod

Agrupa um ou mais containers que compartilham:

- rede;
- lifecycle;
- volumes;
- identidade operacional.

#### ReplicaSet

Mantém determinada quantidade de Pods.

#### Deployment

Adiciona:

- rollout;
- revisions;
- estratégia;
- rollback;
- histórico.

Normalmente você cria Deployment, não ReplicaSet manual.

---

### 6. Revisar selectors e labels

Labels identificam recursos.

Selectors conectam controladores e Services aos Pods.

Exemplo:

```yaml
selector:
  matchLabels:
    app.kubernetes.io/name: orders-api
```

Se Service e Pod usam labels incompatíveis, o tráfego não chega. Selectors precisam ser testados.

---

### 7. Criar matriz de recursos

Arquivo:

```text
kubernetes-resource-decision-matrix.yaml
```

Conteúdo:

```yaml
decisions:
  statelessHttpApi:
    controller:
      deployment

    network:
      serviceClusterIp

    externalRouting:
      ingress

  scheduledJob:
    controller:
      cronJob

  finiteTask:
    controller:
      job

  stableIdentityStatefulWorkload:
    controller:
      statefulSet

  nodeAgent:
    controller:
      daemonSet
```

A matriz mostra que nem todo workload usa Deployment.

---

### 8. Revisar Service

Tipos comuns:

```text
ClusterIP;

NodePort;

LoadBalancer;

ExternalName.
```

Para uma API interna no cluster:

```text
ClusterIP.
```

Para exposição HTTP controlada:

```text
Ingress
→
Service ClusterIP.
```

Service seleciona Pods Ready e fornece endereço estável.

Ele não valida sozinho se o endpoint funcional está correto.

---

### 9. Revisar Ingress

Ingress descreve:

- host;
- path;
- backend Service;
- porta;
- TLS quando aplicável.

Ele depende de um Ingress Controller.

Criar o resource sem controller não cria roteamento real.

Problemas comuns incluem ingressClass, Service, porta, host, certificado ou path incorretos.

---

### 10. Revisar ConfigMap

ConfigMap armazena configuração não sensível.

Exemplos:

- profile;
- log level;
- flags;
- timeout;
- nome do ambiente.

Mudanças injetadas como environment variables exigem recriação dos Pods. A release precisa versionar configuração.

---

### 11. Revisar Secret

Secret Kubernetes pode ser montado ou injetado.

Entretanto:

```text
Base64
não é encryption.
```

A segurança depende de encryption, RBAC, identidade, origem, rotação, auditoria e, quando necessário, secret store externo.

Nunca coloque Secret real no manifest versionado.

---

### 12. Revisar startup probe

Startup probe protege aplicações com inicialização mais lenta.

Enquanto ela não passa, readiness e liveness não assumem controle normal.

Use quando o startup é lento, sem tornar o limite permissivo a ponto de esconder travamentos.

---

### 13. Revisar readiness probe

Readiness controla entrada no tráfego.

Uma instância não pronta continua em execução, mas sai dos endpoints do Service.

Readiness considera inicialização, configuração, capacidade e dependências obrigatórias, evitando flapping.

---

### 14. Revisar liveness probe

Liveness responde se o processo deve ser reiniciado.

Não inclua indiscriminadamente:

- banco;
- cache;
- fila;
- API externa.

Falhas externas não devem reiniciar todos os Pods. Liveness detecta processo travado ou estado irrecuperável.

---

### 15. Criar matriz de probes

Arquivo:

```text
probes-decision-matrix.yaml
```

Conteúdo:

```yaml
probes:
  startup:
    question:
      application-finished-starting

    failureAction:
      restart

  readiness:
    question:
      application-can-receive-traffic

    failureAction:
      remove-from-service-endpoints

  liveness:
    question:
      process-can-recover-without-restart

    failureAction:
      restart

  rules:
    externalDatabaseInLiveness:
      forbidden

    publicDetails:
      hidden
```

---

### 16. Revisar requests e limits

Requests influenciam scheduling.

Limits restringem consumo.

CPU:

- request ajuda o scheduler;
- limit pode causar throttling.

Memória:

- request ajuda o scheduler;
- limit excedido pode causar OOMKill.

Valores altos desperdiçam capacidade; baixos geram instabilidade. Use métricas e testes.

---

### 17. Criar matriz de capacidade

Arquivo:

```text
capacity-scaling-matrix.yaml
```

Conteúdo:

```yaml
capacity:
  requests:
    purpose:
      scheduling-and-baseline

  limits:
    purpose:
      resource-boundary

  hpa:
    requires:
      - metrics
      - requests
      - minReplicas
      - maxReplicas

  database:
    connectionBudget:
      required

  scaleOut:
    dependencyCapacity:
      validated
```

Escalar Pods sem validar banco e mensageria pode mover o gargalo.

---

### 18. Revisar HPA

HPA ajusta réplicas.

HPA possui target, minReplicas, maxReplicas, métricas, comportamento e stabilization window.

HPA não cria capacidade infinita; dependências continuam limitadas.

Autoscaling exige métricas confiáveis, requests, limites, alarms, testes e custo observado.

---

### 19. Revisar PDB

PodDisruptionBudget protege disponibilidade durante interrupções voluntárias.

Exemplo:

```yaml
minAvailable: 1
```

PDB ajuda em drain e manutenção, mas não impede crash, falha de node, bug, OOM ou dependência indisponível.

PDB incompatível com quantidade de réplicas pode bloquear manutenção.

---

### 20. Revisar Namespace

Namespace cria boundary lógico.

Namespace organiza ambiente, equipe, domínio, policies, quotas e RBAC.

Namespace não é isolamento absoluto e precisa de RBAC, NetworkPolicy, policies, quotas e identidade.

---

### 21. Revisar ServiceAccount

ServiceAccount representa a identidade do workload dentro do cluster.

Use uma identidade por workload, token automático desabilitado quando não usado e bindings mínimos.

A aplicação que não chama a API Kubernetes não monta token.

---

### 22. Revisar RBAC

Objetos principais:

```text
Role;

ClusterRole;

RoleBinding;

ClusterRoleBinding.
```

Role limita recursos em namespace.

ClusterRole pode representar permissões de cluster ou ser reutilizada em namespaces.

Binding liga subject a role.

RBAC deve registrar subject, verbs, resources, namespace, duração e owner.

---

### 23. Criar matriz de acesso

Arquivo:

```text
access-control-matrix.yaml
```

Conteúdo:

```yaml
access:
  application:
    serviceAccount:
      dedicated

    kubernetesApi:
      required:
        false

  deployPipeline:
    permissions:
      - get
      - list
      - create
      - patch
      - update

    deleteNamespace:
      forbidden

  auditor:
    permissions:
      - get
      - list

  wildcard:
    forbidden
```

O pipeline não precisa receber administração irrestrita.

---

### 24. Revisar NetworkPolicy

NetworkPolicy permite controlar tráfego.

NetworkPolicy usa selectors, ipBlock, ingress, egress e ports.

Ela só funciona quando o plugin de rede implementa enforcement.

Uma policy de deny precisa considerar DNS.

Sem DNS, a aplicação pode falhar mesmo com destinos corretos por nome.

---

### 25. Revisar volumes, PV e PVC

Volumes resolvem necessidades diferentes.

#### emptyDir

Temporário, acompanha o Pod.

#### ConfigMap e Secret volumes

Montam configuração.

#### PersistentVolume

Representa storage disponibilizado.

#### PersistentVolumeClaim

Solicita storage.

#### StorageClass

Define provisionamento e características.

Filesystem do Pod não é fonte de verdade.

---

### 26. Criar matriz de persistência

Arquivo:

```text
persistence-decision-matrix.yaml
```

Conteúdo:

```yaml
persistence:
  temporaryProcessing:
    volume:
      emptyDir

  relationalBusinessData:
    storage:
      managedPostgresql

  uploadedDocuments:
    storage:
      objectStorage

  applicationCache:
    storage:
      managedRedis

  containerFilesystem:
    sourceOfTruth:
      forbidden

  persistentVolume:
    useWhen:
      platformManagedFilesystemRequired
```

A decisão depende da semântica dos dados.

---

### 27. Revisar Kustomize

Kustomize compõe manifests sem template tradicional.

Conceitos:

- base;
- overlay;
- patches;
- images;
- namespace;
- labels.

Bom uso:

```text
base comum;

diferenças por ambiente
em overlays pequenos.
```

Evite copiar todos os manifests para cada ambiente.

---

### 28. Revisar Helm

Helm organiza recursos em Chart.

Conceitos:

- Chart;
- Values;
- Templates;
- Release;
- Revision.

Helm ajuda em:

- parametrização;
- empacotamento;
- instalação;
- upgrade;
- rollback de release.

Helm ainda exige revisão do render, schema, segurança, ownership, testes e compatibilidade.

---

### 29. Revisar infraestrutura como código

IaC descreve infraestrutura versionada.

IaC exige revisão, plan, apply controlado, estado, drift, módulos, policy as code e recovery.

Mudança manual cria drift e rompe a fonte de verdade.

---

### 30. Criar mapa de capacidades cloud

Arquivo:

```text
cloud-capability-map.yaml
```

Conteúdo resumido:

```yaml
cloud:
  identity: [federation, roles, temporaryCredentials]
  network: [virtualNetwork, subnets, routing, firewall]
  compute: [virtualMachines, containers, kubernetes, functions]
  data: [relationalDatabase, cache, objectStorage]
  integration: [queue, topic, eventBus]
  operations: [logs, metrics, traces, audit]
```

O mapa vale mais que decorar nomes.

---

### 31. Revisar conceitos de cloud

Cloud envolve Region, Availability Zone, contas, redes, routing, identidade, elasticidade, serviços gerenciados, responsabilidade compartilhada, observabilidade e custos.

Cloud não garante alta disponibilidade sem arquitetura e operação adequadas.

---

### 32. Revisar contas e ambientes

Separe:

- produção;
- homologação;
- desenvolvimento;
- segurança;
- shared services.

Boundaries de conta reduzem blast radius.

Também ajudam em:

- billing;
- IAM;
- quotas;
- auditoria;
- incidentes.

Não reutilize uma credencial administrativa entre ambientes.

---

### 33. Criar mapa AWS para backend

Arquivo:

```text
aws-backend-service-map.yaml
```

Conteúdo resumido:

```yaml
aws:
  identity: [IAM, STS]
  network: [VPC, Subnet, SecurityGroup, Route53, ALB]
  containers: [ECR, ECS, EKS, Fargate]
  database: [RDSPostgreSQL, AuroraPostgreSQL]
  messaging: [SQS, SNS, EventBridge]
  cache: [ElastiCacheRedisCompatible]
  objectStorage: [S3]
  configuration: [SecretsManager, SystemsManagerParameterStore]
  observability: [CloudWatch, CloudTrail, XRay]
```

Os nomes mapeiam capacidades.

Use ports e contracts.

---

### 34. Revisar VPC e subnets

VPC é uma rede virtual.

Subnets podem ser:

- públicas;
- privadas;
- isoladas.

Backend e dados normalmente ficam sem exposição pública direta.

Rotas e gateways, não o nome, determinam se uma subnet é pública.

Security Groups controlam tráfego stateful.

Network ACLs atuam em nível de subnet com modelo diferente.

---

### 35. Revisar identidade cloud

Pessoas:

```text
federation;

MFA;

role temporária.
```

Pipelines:

```text
OIDC;

STS;

credenciais temporárias.
```

Workloads:

```text
workload identity;

role específica;

least privilege.
```

Evite access keys permanentes.

Roles exigem permissions policy, trust policy, owner, sessão e auditoria.

---

### 36. Revisar RDS PostgreSQL

RDS gerencia parte das tarefas do banco.

O cliente continua responsável por schema, queries, índices, usuários, migrations, pool, retenção, restore, classificação e custos.

Revise instance, engine, classe, storage, subnet group, Security Group, parameters, backups, Multi-AZ, replicas e monitoring.

---

### 37. Diferenciar Multi-AZ e read replica

Multi-AZ:

- alta disponibilidade;
- standby;
- failover;
- foco em continuidade.

Read replica:

- escala de leitura;
- replicação assíncrona;
- possibilidade de lag;
- promoção possível.

Read replica não substitui Multi-AZ, e standby clássico não é reader da aplicação.

---

### 38. Revisar pool de conexões

Fórmula:

```text
réplicas máximas
x
pool máximo por réplica
+
migrations
+
admin
+
monitoring
<=
budget do banco.
```

HPA sem connection budget pode derrubar o banco.

Timeouts relevantes incluem conexão, query, lock, max lifetime e idle.

---

### 39. Revisar SQS

SQS representa fila.

SQS envolve producer, consumer, visibility timeout, long polling, retry, DLQ, retenção, idempotência e payload.

Consumers assumem entrega ao menos uma vez; apagar antes de concluir pode perder trabalho.

---

### 40. Revisar SNS

SNS representa publicação para múltiplos subscribers.

SNS pode integrar com filas, HTTP, email e outros destinos.

SNS não substitui fila quando cada consumer precisa de processamento e retry próprios.

Padrão comum:

```text
producer
→
SNS topic
→
SQS por consumer.
```

---

### 41. Revisar Redis gerenciado

Redis pode apoiar cache, rate limiting, sessão, coordenação e idempotência temporárias.

Redis não vira fonte de verdade sem decisão explícita.

Revise TTL, eviction, cache-aside, invalidation, stampede, hot keys, replication, failover, timeout e fallback.

---

### 42. Revisar Object Storage S3

S3 trabalha com:

- bucket;
- object;
- key;
- metadata;
- tags;
- versioning;
- lifecycle;
- checksum;
- presigned URL.

S3 não é filesystem local.

Boas práticas incluem bucket privado, Block Public Access, encryption, TLS, keys opacas, limites, checksum, lifecycle e reconciliação.

---

### 43. Criar matriz de serviços gerenciados

Arquivo:

```text
managed-data-services-matrix.yaml
```

Conteúdo resumido:

```yaml
services:
  postgresql: {sourceOfTruth: true, use: relational-transactions}
  queue: {sourceOfTruth: false, use: asynchronous-work}
  topic: {sourceOfTruth: false, use: fanout}
  redis: {sourceOfTruth: false, use: temporary-fast-data}
  objectStorage: {sourceOfTruth: binaryContent, reference: relationalDatabase}
```

Cada serviço possui semântica.

---

### 44. Revisar custos cloud

Drivers incluem compute, banco, storage, mensagens, requests, observabilidade, transferência, NAT, replicas, backups, KMS e recursos ociosos.

Práticas incluem tags, owners, budgets, forecasts, anomalies, rightsizing, lifecycle, scheduling e unit economics.

Custo por pedido conecta infraestrutura e valor.

---

### 45. Revisar segurança cloud

Segurança cobre identidade, rede, dados, Secrets, workloads, supply chain, logging, backup e incident response.

Princípios:

```text
least privilege;

defense in depth;

temporary credentials;

private by default;

encryption;

audit;

restore tested.
```

O cliente continua responsável por policies amplas.

---

### 46. Criar matriz custo-segurança

Arquivo:

```text
cloud-cost-security-matrix.yaml
```

Conteúdo resumido:

```yaml
decisions:
  reduceDatabaseAvailability: {risk: higher, approval: businessRequired}
  disableAuditLogs: {securityImpact: unacceptable}
  shortenObjectRetention: {approval: businessAndCompliance}
  rightsizeCompute: {validation: slo-and-load-test}
  removeUnusedResource: {validation: owner-and-dependency-check}
```

Economia não pode apagar controles sem decisão de risco.

---

### 47. Revisar observabilidade

Três sinais principais:

```text
logs;

metrics;

traces.
```

Também importam events, audit, release metadata, health, recursos, filas, conexões, cache e storage.

Observabilidade precisa responder:

```text
o que mudou?

quando?

qual release?

qual usuário ou fluxo?

qual dependência?

qual impacto?
```

---

### 48. Revisar o projeto final

O projeto possui três partes.

#### Parte 1

Deployability interna:

- configuration;
- build information;
- release information;
- health;
- shutdown;
- logging;
- correlation;
- errors.

#### Parte 2

Release candidate:

- JAR;
- checksum;
- image;
- digest;
- SBOM;
- scan;
- manifests;
- workflow;
- bundle.

#### Parte 3

Promotion:

- same content;
- registry;
- digest;
- target environment;
- deploy;
- smoke;
- release consistency;
- regression;
- rollback;
- evidence.

---

### 49. Criar mapa de rastreabilidade

Arquivo:

```text
final-project-traceability-map.yaml
```

Conteúdo resumido:

```yaml
traceability:
  source: {commit: required}
  build: {version: required, artifactChecksum: required}
  image: {digest: required}
  release: {releaseId: required}
  manifests: {imageDigest: sameAsRelease}
  runtime: {endpointReleaseId: sameAsRelease, podImageId: sameAsImageDigest}
  evidence: {allIdentitiesConsistent: required}
```

Esse mapa resume build once, promote many.

---

### 50. Simular falha Kubernetes

Execute:

```powershell
.\scripts\review\devops-part-2\simulate-kubernetes-failure.ps1
```

Cenários:

- selector incorreto;
- Service sem endpoints;
- readiness inválida;
- liveness agressiva;
- requests ausentes;
- OOMKilled;
- HPA sem métricas;
- PDB bloqueando operação;
- Secret ausente;
- NetworkPolicy bloqueando DNS;
- image pull;
- ConfigMap incompatível.

Para cada cenário, identifique camada, sintoma, diagnóstico, causa, correção e evidência.

---

### 51. Simular decisão de arquitetura cloud

Execute:

```powershell
.\scripts\review\devops-part-2\simulate-cloud-architecture-decision.ps1
```

Cenário:

```text
API pública;

PostgreSQL;

processamento assíncrono;

documentos;

cache;

alta disponibilidade.
```

Uma resposta coerente pode mapear:

- entrada: load balancer;
- compute: containers;
- banco: RDS PostgreSQL;
- fila: SQS;
- fanout: SNS;
- cache: Redis;
- documentos: S3;
- Secrets: secret manager;
- logs: observability service;
- rede: subnets privadas;
- identidade: roles temporárias.

O script exige justificativa e riscos.

---

### 52. Simular falha de serviço gerenciado

Execute:

```powershell
.\scripts\review\devops-part-2\simulate-managed-service-failure.ps1
```

Cenários:

- banco indisponível;
- pool esgotado;
- failover;
- replica lag;
- fila com retry;
- DLQ crescendo;
- cache indisponível;
- cache stampede;
- object checksum inválido;
- presigned URL expirada;
- lifecycle ausente.

A resposta precisa diferenciar retry, fallback, degradação, circuit breaker, rollback e recovery.

---

### 53. Validar decisões de custo e segurança

Execute:

```powershell
.\scripts\review\devops-part-2\validate-cost-security-decisions.ps1
```

O validator bloqueia decisões como:

- banco público;
- access key no Git;
- auditoria desabilitada;
- produção sem backup;
- HPA ilimitado;
- logs sem retenção;
- bucket público;
- cache como única fonte;
- remoção de Multi-AZ sem aprovação;
- Secret em ConfigMap.

---

### 54. Verificar rastreabilidade do projeto

Execute:

```powershell
.\scripts\review\devops-part-2\verify-final-project-traceability.ps1
```

Valide:

- commit;
- version;
- artifact checksum;
- release ID;
- image digest;
- manifest image;
- Pod imageID;
- endpoint release;
- evidence.

Identidades divergentes indicam mistura de releases.

---

### 55. Criar autoavaliação

Arquivo:

```text
self-assessment.yaml
```

Use níveis de 0 a 5: não reconheço, reconheço, explico, aplico, diagnostico, ensino e decido.

Avalie desired state, recursos Kubernetes, probes, capacidade, acesso, persistência, Kustomize, Helm, IaC, cloud, IAM, RDS, mensageria, Redis, S3, custos, segurança, observabilidade e rastreabilidade.

---

### 56. Criar documentação de revisão

#### `KUBERNETES_FOUNDATIONS_REVIEW.md`

Conecte controladores, Pods, Services e desired state.

#### `KUBERNETES_CONFIGURATION_SECURITY_REVIEW.md`

Explique ConfigMap, Secret, Namespace, ServiceAccount, RBAC e NetworkPolicy.

#### `KUBERNETES_CAPACITY_AVAILABILITY_REVIEW.md`

Explique probes, resources, HPA, PDB e volumes.

#### `HELM_KUSTOMIZE_IAC_REVIEW.md`

Compare composição, empacotamento e infraestrutura versionada.

#### `CLOUD_AND_AWS_REVIEW.md`

Mapeie capacidades e serviços.

#### `MANAGED_DATA_SERVICES_REVIEW.md`

Compare PostgreSQL, filas, tópicos, cache e object storage.

#### `CLOUD_COST_SECURITY_OBSERVABILITY_REVIEW.md`

Conecte eficiência, risco e operação.

#### `FINAL_PROJECT_REVIEW.md`

Reconte as três partes por rastreabilidade.

---

### 57. Criar matriz de testes da revisão

Arquivo:

```text
REVIEW_PART_2_TEST_MATRIX.md
```

Cenários:

- Deployment reconcilia Pods;
- selector conecta Service;
- Ingress depende de controller;
- ConfigMap não recebe Secret;
- Secret real não entra no Git;
- startup probe protege inicialização;
- readiness controla tráfego;
- liveness não depende de banco;
- requests permitem scheduling;
- limits controlam consumo;
- HPA possui min e max;
- pool de banco considera maxReplicas;
- Namespace cria boundary;
- ServiceAccount é dedicada;
- wildcard RBAC é bloqueado;
- NetworkPolicy preserva DNS;
- PVC é usado somente quando necessário;
- Kustomize renderiza overlay;
- Helm renderiza Chart;
- IaC detecta drift;
- backend não possui IP público;
- pipeline usa credencial temporária;
- RDS Multi-AZ não é read replica;
- SQS exige idempotência;
- SNS representa fanout;
- Redis não vira fonte de verdade;
- S3 usa bucket privado;
- custo possui owner;
- auditoria permanece habilitada;
- release endpoint corresponde ao digest;
- rollback possui smoke test.

---

### 58. Criar troubleshooting da revisão

Arquivo:

```text
REVIEW_PART_2_TROUBLESHOOTING.md
```

Inclua:

- Pod Pending;
- CrashLoopBackOff;
- ImagePullBackOff;
- readiness failing;
- liveness restart loop;
- Service sem endpoints;
- Ingress 404;
- Secret ausente;
- RBAC forbidden;
- DNS bloqueado;
- PVC Pending;
- HPA unknown;
- PDB bloqueando drain;
- Helm values incorretos;
- drift de IaC;
- RDS connections esgotadas;
- SQS visibility timeout curto;
- DLQ crescendo;
- Redis hit ratio baixa;
- cache stampede;
- S3 access denied;
- lifecycle ausente;
- NAT elevado;
- logs com cardinalidade alta;
- release inconsistente.

---

### 59. Coletar evidence da revisão

Script:

```text
collect-review-part-2-evidence.ps1
```

Arquivo:

```text
review-part-2-evidence.json.
```

Campos permitidos:

- lesson;
- Kubernetes map status;
- resource decision status;
- probes validation;
- capacity validation;
- access control validation;
- persistence decision status;
- cloud capability status;
- AWS service map status;
- managed services status;
- cost security status;
- project traceability status;
- troubleshooting scenarios;
- self-assessment completed;
- cloud resources zero;
- real secrets zero;
- timestamp.

---

### 60. Executar o gate da revisão

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\review\devops-part-2\validate-kubernetes-concept-map.ps1

.\scripts\review\devops-part-2\inspect-kubernetes-manifests.ps1

.\scripts\review\devops-part-2\validate-probes-and-resources.ps1

.\scripts\review\devops-part-2\validate-access-controls.ps1

.\scripts\review\devops-part-2\simulate-kubernetes-failure.ps1

.\scripts\review\devops-part-2\simulate-cloud-architecture-decision.ps1

.\scripts\review\devops-part-2\simulate-managed-service-failure.ps1

.\scripts\review\devops-part-2\validate-cost-security-decisions.ps1

.\scripts\review\devops-part-2\verify-final-project-traceability.ps1

.\scripts\review\devops-part-2\collect-review-part-2-evidence.ps1

.\scripts\review\devops-part-2\verify-review-part-2-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- Kubernetes explicado;
- probes justificadas;
- capacidade validada;
- acessos validados;
- persistência classificada;
- cloud mapeada;
- serviços gerenciados diferenciados;
- custos e segurança conectados;
- projeto final rastreável;
- cenários diagnosticados;
- autoavaliação concluída;
- nenhuma cloud real;
- nenhum Secret real;
- revisão concluída;
- prova prática preparada.

---

## Entendendo o que foi feito

### Kubernetes voltou ao modelo de controle

Resources deixaram de ser arquivos isolados e passaram a formar desired state.

### Rede ganhou encadeamento

Ingress, Service, selectors, EndpointSlices e Pods foram relacionados.

### Probes ganharam perguntas específicas

Startup, readiness e liveness deixaram de ser endpoints equivalentes.

### Capacidade ganhou dependências

Requests, limits, HPA, banco e custos passaram a ser analisados juntos.

### Acesso ganhou identidade

Namespace, ServiceAccount, RBAC e NetworkPolicy foram conectados.

### Persistência ganhou semântica

Banco, cache, object storage e volumes deixaram de competir pelo mesmo problema.

### Cloud ganhou mapa de capacidades

Serviços foram entendidos pelo problema que resolvem.

### Dados gerenciados ganharam responsabilidades

RDS, SQS, SNS, Redis e S3 foram diferenciados.

### Custos e segurança ganharam trade-offs explícitos

Otimização deixou de significar remover controles.

### O projeto final ganhou rastreabilidade completa

Commit, checksum, digest, release e runtime formaram uma cadeia verificável.

---

## Erros comuns importantes

### Acreditar que Kubernetes corrige aplicação

Ele reconcilia o estado declarado, inclusive quando está errado.

### Criar Service com selector incorreto

Pods saudáveis ficam inacessíveis.

### Colocar banco na liveness

Uma falha externa cria restart loop.

### Configurar HPA sem requests

A métrica de utilização pode ficar inválida.

### Dar wildcard ao pipeline

O blast radius aumenta.

### Tratar Namespace como isolamento absoluto

RBAC e rede ainda precisam de políticas.

### Usar volume local como banco

O lifecycle do Pod não oferece garantia de negócio.

### Decorar AWS sem entender capacidades

A arquitetura vira dependente de nomes.

### Confundir Multi-AZ com read scaling

Alta disponibilidade e leitura são problemas distintos.

### Reduzir custo removendo auditoria

A investigação de incidentes fica comprometida.

---

## Comandos úteis

### Listar recursos

```powershell
kubectl get deployment,pod,service,ingress,hpa,pdb `
  --namespace `
  formacao-java-dev
```

### Ver detalhes de Pod

```powershell
kubectl describe pod `
  --namespace `
  formacao-java-dev `
  <nome-do-pod>
```

### Ver eventos

```powershell
kubectl get events `
  --namespace `
  formacao-java-dev `
  --sort-by=.metadata.creationTimestamp
```

### Renderizar Kustomize

```powershell
kubectl kustomize `
  k8s/deploy-ready/overlays/final-simple
```

### Verificar autorização

```powershell
kubectl auth can-i `
  get `
  pods `
  --namespace `
  formacao-java-dev
```

---

## Exercício guiado

### Parte 1 — Desired state

Explique reconciliação e controladores.

### Parte 2 — Networking

Relacione Ingress, Service e Pods.

### Parte 3 — Configuration

Separe ConfigMap e Secret.

### Parte 4 — Health

Escolha probes para cenários diferentes.

### Parte 5 — Capacity

Defina requests, limits e HPA.

### Parte 6 — Security

Modele Namespace, ServiceAccount, RBAC e NetworkPolicy.

### Parte 7 — Persistence

Escolha banco, cache, object storage ou volume.

### Parte 8 — Cloud

Mapeie capacidades e serviços AWS.

### Parte 9 — Operations

Conecte custo, segurança e observabilidade.

### Parte 10 — Traceability

Valide commit, artifact, digest, release e runtime.

---

## Critérios de aceite

- arquivo, H1, numeração, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 549 e ponte para a aula 551 foram preservadas;
- revisão técnica concluiu Kubernetes, cloud, serviços gerenciados, custos, segurança, observabilidade e rastreabilidade;
- desired state, reconciliation loop, Pod, ReplicaSet, Deployment, Service e Ingress foram relacionados;
- labels, selectors, EndpointSlices e Ingress Controller foram revisados;
- ConfigMap e Secret foram diferenciados, sem Secret real em Git;
- startup, readiness e liveness receberam semânticas corretas;
- banco e serviços externos ficaram fora da liveness;
- requests, limits, throttling, OOMKill, HPA, PDB e connection budget foram revisados;
- Namespace, ServiceAccount, Role, ClusterRole, bindings, RBAC e NetworkPolicy foram conectados;
- token automático e wildcards foram tratados pelo princípio do menor privilégio;
- DNS foi considerado nas regras de egress;
- volumes, `emptyDir`, PV, PVC e StorageClass foram revisados;
- filesystem do container não virou fonte de verdade;
- Kustomize, Helm e infraestrutura como código foram comparados;
- base, overlay, Chart, Values, Release, plan, state e drift foram revisados;
- Region, Availability Zone, contas, VPC, subnets, routing, Security Groups e identidade cloud foram revisados;
- federation, MFA, OIDC, STS, roles temporárias e workload identity foram reforçados;
- mapa de capacidades AWS para backend foi criado;
- RDS PostgreSQL, Multi-AZ, read replicas, backups, migrations e pool foram revisados;
- SQS, visibility timeout, long polling, retries, DLQ e idempotência foram revisados;
- SNS e fanout foram revisados;
- Redis, cache-aside, TTL, invalidation, eviction e stampede foram revisados;
- S3, buckets privados, keys, checksums, versioning, lifecycle e presigned URLs foram revisados;
- PostgreSQL, filas, tópicos, cache e object storage foram diferenciados por semântica;
- tags, owners, budgets, forecasts, rightsizing, unit economics e desperdícios foram revisados;
- identidade, rede, dados, Secrets, workloads, supply chain, logs, backup e incident response foram revisados;
- logs, métricas, traces, events, health e release metadata foram conectados;
- as três partes do projeto final foram relacionadas por commit, checksum, release ID, digest, manifests, Pod imageID e endpoint;
- falhas Kubernetes, decisões cloud e falhas de serviços gerenciados foram simuladas;
- decisões inseguras ou financeiramente irresponsáveis foram bloqueadas;
- autoavaliação, documentação, matriz de testes, troubleshooting e evidence foram criados;
- `cloud resources` e `real secrets` permaneceram em zero;
- nenhuma solução ou gabarito da prova prática foi antecipado;
- comandos Git, diário de bordo e regra final estão presentes;
- commit recomendado está pronto.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/review/devops-part-2 `
  scripts/review/devops-part-2 `
  docs/review/devops-part-2 `
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
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|kubeconfig|client-secret|X-Amz-Signature"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): revisar DevOps parte 2"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- Secret;
- token;
- kubeconfig;
- account ID;
- endpoint real;
- logs completos;
- image archive;
- JAR;
- recurso cloud;
- respostas da prova prática.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você concluiu a revisão técnica de DevOps do Módulo 17.

A revisão parte 2 conectou:

```text
Kubernetes;

desired state;

networking;

configuração;

probes;

capacidade;

segurança;

persistência;

Helm;

Kustomize;

IaC;

cloud;

AWS;

dados gerenciados;

custos;

observabilidade;

projeto final.
```

Você comprovou que Kubernetes reconcilia o estado declarado, mas não corrige decisões ruins; Deployments administram versões e réplicas; Services dependem de selectors; Ingress depende de controller; ConfigMap e Secret possuem responsabilidades diferentes; probes precisam responder perguntas específicas; requests, limits e HPA precisam respeitar a capacidade das dependências; Namespace, ServiceAccount, RBAC e NetworkPolicy formam boundaries complementares; volumes precisam respeitar a semântica dos dados; Kustomize, Helm e IaC precisam de renderização, revisão e controle de drift; cloud divide responsabilidades; AWS oferece capacidades de identidade, rede, compute, dados e operação; RDS, SQS, SNS, Redis e S3 resolvem problemas diferentes; custos e segurança precisam ser decididos juntos; e o projeto final depende de rastreabilidade entre commit, artifact, digest, release e runtime.

A próxima aula será:

```text
551 - M17.46 - Prova pratica DevOps
```

Nela, você irá demonstrar os conhecimentos do módulo por meio de uma avaliação prática guiada pelos critérios oficiais, sem depender de respostas previamente fornecidas.

Nenhuma solução, resposta, roteiro de execução específico ou gabarito da prova prática foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Expliquei desired state e reconciliação.
- [ ] Relacionei Deployment, Service e Ingress.
- [ ] Diferenciei ConfigMap e Secret.
- [ ] Justifiquei probes, requests, limits e HPA.
- [ ] Revisei Namespace, RBAC e NetworkPolicy.
- [ ] Classifiquei persistência.
- [ ] Mapeei cloud e AWS.
- [ ] Validei rastreabilidade do projeto final.

---

## Troubleshooting adicional

### O Pod permanece Pending

Revise resources, capacity, PVC, affinity, taints e quotas.

### O Service não possui endpoints

Revise labels, selectors e readiness.

### O Pod reinicia quando o banco falha

Remova o banco da liveness.

### O HPA mostra métrica desconhecida

Revise metrics, requests e target.

### O acesso retorna `forbidden`

Revise subject, Role, binding e verb.

### O DNS falha após NetworkPolicy

Libere egress controlado para DNS.

### O PVC permanece Pending

Revise StorageClass, provisioner e access mode.

### A aplicação esgota conexões ao escalar

Revise HPA e connection pool.

### A fila envia mensagens repetidas

Revise idempotência e visibility timeout.

### Uma resposta da prova apareceu

Remova e preserve a avaliação para a aula 551.

---

## Perguntas de revisão

1. O que é desired state?
2. O que faz um Deployment?
3. Como um Service encontra Pods?
4. Do que um Ingress depende?
5. Qual a diferença entre ConfigMap e Secret?
6. Qual a pergunta da startup probe?
7. Qual a pergunta da readiness?
8. Qual a pergunta da liveness?
9. Para que servem requests?
10. O que acontece ao exceder memory limit?
11. De que o HPA depende?
12. Para que serve ServiceAccount?
13. Qual a diferença entre Role e ClusterRole?
14. Por que NetworkPolicy precisa considerar DNS?
15. Qual a diferença entre PV e PVC?
16. Qual a diferença entre Kustomize e Helm?
17. O que significa responsabilidade compartilhada?
18. Qual a diferença entre Multi-AZ e read replica?
19. Como provar release consistency?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Estado declarado.
2. Gerencia ReplicaSets e rollout.
3. Por selectors e labels.
4. De um controller.
5. Não sensível e sensível.
6. Terminou de iniciar?
7. Pode receber tráfego?
8. Precisa reiniciar?
9. Scheduling e baseline.
10. OOMKill.
11. Métricas, requests e limites.
12. Identidade do workload.
13. Namespace e escopo de cluster.
14. Nomes precisam ser resolvidos.
15. Recurso e solicitação.
16. Composição e empacotamento.
17. Divisão provedor-cliente.
18. Disponibilidade e escala de leitura.
19. Commit, checksum, digest e endpoint.
20. Prova prática DevOps.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 550 - M17.45 - Revisao DevOps parte 2

- Concluí a revisão técnica do Módulo 17.
- Revisei desired state, Pods, ReplicaSets, Deployments, Services e Ingress.
- Diferenciei ConfigMap, Secret, startup, readiness e liveness.
- Relacionei requests, limits, HPA, PDB e connection budget.
- Revisei Namespace, ServiceAccount, RBAC e NetworkPolicy.
- Revisei volumes, PV, PVC, StorageClass e semântica de persistência.
- Revisei Kustomize, Helm, IaC e drift.
- Revisei Region, Availability Zone, VPC, subnets e identidade cloud.
- Mapeei capacidades AWS para backend.
- Revisei RDS, Multi-AZ, read replicas e pool.
- Revisei SQS, SNS, retries, DLQ, fanout e idempotência.
- Revisei Redis, cache-aside, TTL, invalidation e stampede.
- Revisei S3, keys, versioning, lifecycle e presigned URLs.
- Relacionei custos, segurança, observabilidade e recuperação.
- Reuni as três partes do projeto final por rastreabilidade.
- Simulei falhas Kubernetes, cloud e serviços gerenciados.
- Criei autoavaliação e evidence sanitizada.
- Não antecipei o gabarito da prova prática.
- Próxima aula: Prova prática DevOps.
```

---

## Referência técnica curta

- Kubernetes Architecture.
- Kubernetes Deployments and Services.
- Kubernetes Probes and Resource Management.
- Kubernetes RBAC and NetworkPolicy.
- Kubernetes Persistent Volumes.
- Kustomize and Helm.
- Cloud Shared Responsibility.
- AWS Architecture for Backend Systems.
- Managed PostgreSQL, Messaging, Cache and Object Storage.
- Cloud Cost, Security and Observability.

Regra final:

```text
a revisão DevOps parte 2 conecta Kubernetes, cloud e operação: Deployments reconciliam Pods, Services selecionam endpoints Ready e Ingress depende de controller; ConfigMap guarda configuração não sensível e Secrets exigem proteção; startup valida inicialização, readiness controla tráfego e liveness decide restart; requests, limits, HPA, PDB e connection budgets equilibram capacidade e custo; Namespace, ServiceAccount, RBAC e NetworkPolicy reduzem blast radius; volumes, PV e PVC atendem persistência específica; Kustomize compõe overlays, Helm empacota releases e IaC controla drift; cloud divide responsabilidades, com RDS para PostgreSQL, SQS para filas, SNS para fanout, Redis para dados temporários e S3 para objetos; custos, auditoria, encryption, backup, logs, métricas e traces completam a operação; commit, checksum, digest, release ID, manifests, Pod imageID e endpoint precisam ser consistentes, deixando para a aula 551 a demonstração prática sem gabarito antecipado.
```
