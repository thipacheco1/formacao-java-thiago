# 537 - M17.32 - Cloud conceitos para backend


## Apresentação da aula

Na aula 536, você organizou o acesso ao cluster com Namespace e RBAC.

O laboratório passou a possuir:

```text
Namespace explícito;

ServiceAccount dedicado;

Role read-only;

RoleBinding namespaced;

permissões permitidas
e negadas testadas;

Secrets,
exec
e port-forward
protegidos.
```

Essa base respondeu:

```text
quem pode fazer o quê
dentro do cluster?
```

Agora o escopo aumenta.

Uma aplicação backend moderna raramente depende apenas de código Java, container e Kubernetes. Ela também depende de:

- computação;
- rede;
- DNS;
- entrada HTTP;
- identidade;
- banco;
- cache;
- mensageria;
- storage;
- observabilidade;
- backup;
- recuperação;
- custos;
- governança.

A pergunta central desta aula será:

```text
como pensar
uma arquitetura backend
em cloud

sem começar
pela lista de produtos
de um fornecedor?
```

A resposta será construída com um modelo provider-neutral.

Antes de escolher um produto, defina a capacidade necessária.

Exemplo:

```text
necessidade:
executar containers.

capacidade:
compute orquestrado.

implementações possíveis:
Kubernetes gerenciado,
serviço de containers,
PaaS
ou máquinas virtuais.
```

```text
necessidade:
persistir pedidos.

capacidade:
banco transacional.

implementações possíveis:
database gerenciado
ou banco operado
pela própria equipe.
```

A regra central será:

```text
capacidade primeiro;

produto depois;

segurança,
resiliência
e custo
desde o início.
```

Nesta aula, nenhum recurso real será criado.

Não haverá:

- conta de cloud;
- credencial;
- cartão;
- IAM real;
- VPC real;
- subnet real;
- cluster gerenciado;
- banco gerenciado;
- DNS público;
- certificado;
- deploy externo.

O laboratório será arquitetural e verificável.

A próxima aula será:

```text
538 - M17.33 - AWS visao backend
```

Nela, as capacidades desta aula serão mapeadas para serviços AWS. Por isso, a aula 537 não usará nomes de produtos específicos como resposta principal.

---

### Cloud não é apenas hospedagem

Cloud combina:

- recursos sob demanda;
- APIs;
- automação;
- elasticidade;
- serviços gerenciados;
- identidade;
- medição;
- regiões;
- zonas;
- responsabilidade compartilhada.

Um serviço gerenciado desloca responsabilidades, mas não as elimina.

Ao usar banco gerenciado, o provedor pode operar infraestrutura, engine e mecanismos de failover. A equipe continua responsável por:

- schema;
- queries;
- índices;
- usuários;
- permissões;
- dados;
- retenção;
- restore;
- capacidade;
- custo;
- incidentes.

Outro princípio será:

```text
alta disponibilidade
não significa
recuperação de desastre.
```

High Availability reduz indisponibilidade em falhas previstas.

Disaster Recovery trata eventos de maior impacto, como:

- perda de região;
- corrupção;
- exclusão acidental;
- falha de identidade;
- indisponibilidade prolongada.

Backup sem restore testado é apenas uma hipótese.

Uma política profissional registra:

- escopo;
- frequência;
- retenção;
- criptografia;
- owner;
- teste;
- RPO;
- RTO.

---

### Modelos de serviço e implantação

As categorias mais conhecidas incluem:

```text
IaaS;

PaaS;

SaaS;

CaaS;

FaaS.
```

#### IaaS

Fornece compute, rede e storage com maior responsabilidade operacional da equipe.

#### PaaS

Abstrai parte do runtime e da infraestrutura para acelerar a entrega.

#### SaaS

Entrega uma aplicação pronta para consumo.

#### CaaS

Executa containers ou fornece orquestração gerenciada.

#### FaaS

Executa funções acionadas por eventos.

A escolha depende de:

- controle;
- operação;
- portabilidade;
- custo;
- requisitos;
- lock-in;
- skills;
- tempo de entrega.

Modelos de implantação:

```text
public cloud;

private cloud;

hybrid cloud;

multi-cloud.
```

Multi-cloud aumenta integração, governança, segurança e operação. Deve existir por necessidade real, não por slogan.

---

### Região, zona e failure domain

Uma região é uma área geográfica de operação.

Ela influencia:

- latência;
- residência de dados;
- catálogo;
- preço;
- compliance;
- recuperação.

Uma Availability Zone é um domínio de falha dentro da região.

Distribuir workloads entre zonas reduz dependência de uma única localização, mas exige:

- réplicas;
- balanceamento;
- banco redundante;
- capacidade;
- testes de falha.

Edge aproxima entrada, cache e proteção dos usuários.

---

### Rede de uma aplicação backend

A arquitetura provider-neutral utilizará três zonas lógicas:

```text
public entry;

private application;

private data.
```

#### Public entry

Recebe tráfego externo por capacidades como:

- DNS;
- edge;
- WAF;
- TLS;
- load balancer;
- API gateway.

#### Private application

Executa o backend sem endereço público direto.

#### Private data

Hospeda banco, cache e mensageria com acesso restrito.

A regra será:

```text
backend privado
não precisa
de IP público.
```

O cliente acessa uma camada de entrada.

A camada encaminha para o compute privado.

Egress também precisa de policy, pois a aplicação pode sair para APIs externas, observabilidade, autenticação e parceiros.

Permitir saída irrestrita aumenta risco e custo.

---

### Compute e elasticidade

Capacidades possíveis:

```text
máquina virtual;

container gerenciado;

Kubernetes gerenciado;

PaaS;

função;

batch.
```

A `orders-api` já está containerizada e stateless no compute.

A escolha futura precisa considerar:

- startup;
- protocolos;
- scaling;
- operação;
- patches;
- rede;
- observabilidade;
- custo;
- portabilidade.

Elasticidade não corrige uma arquitetura sem limites.

Mais réplicas podem aumentar:

- conexões de banco;
- consumers;
- chamadas externas;
- uso de mensageria;
- custo;
- pressão no node.

Por isso, a aplicação ainda precisa de timeout, retry limitado, backoff, circuit breaker, rate limit e idempotência.

---

### Identidade, Secrets e criptografia

Cloud possui conceitos como:

- principal;
- user;
- role;
- service identity;
- policy;
- trust;
- federation;
- temporary credential;
- workload identity.

A regra será:

```text
aplicação não recebe
credencial permanente

quando pode usar
identidade do workload.
```

Federation conecta o provedor de identidade corporativo à cloud.

Pipelines precisam de identidade própria, MFA quando aplicável e credenciais de curta duração.

Secret management deve oferecer:

- armazenamento criptografado;
- versionamento;
- rotação;
- auditoria;
- controle de acesso.

Key management cuida das chaves usadas para criptografia.

TLS protege dados em trânsito.

Criptografia em repouso protege banco, volumes, objects, backups e logs.

Criptografia não substitui autorização.

---

### Serviços de dados

A arquitetura distinguirá:

#### Banco relacional

Fonte transacional para pedidos.

A equipe continua responsável por schema, migrations, índices, transações e connection pool.

#### Cache

Reduz latência e carga, mas não é source of truth.

Precisa de TTL, invalidation, limite e fallback.

#### Mensageria

Pode oferecer queue, topic, stream ou event bus.

Precisa considerar:

- at-least-once;
- ordering;
- idempotência;
- retry;
- dead-letter;
- retention;
- poison message.

#### Object storage

Adequado para documentos, exports, backups e artifacts.

Trabalha com objetos, keys, versioning, lifecycle e signed URLs.

Block storage e file storage possuem outros modelos de acesso e serão tratados como capacidades diferentes.

---

### Observabilidade e confiabilidade

Os três pilares conhecidos são:

```text
metrics;

logs;

traces.
```

Também são necessários:

- events;
- audits;
- alerts;
- dashboards;
- SLOs;
- runbooks.

Logs precisam de:

- formato estruturado;
- correlation ID;
- redaction;
- retenção;
- controle de acesso.

Métricas importantes incluem:

- request rate;
- error rate;
- duration;
- saturation;
- queue depth;
- pool usage;
- JVM;
- custo.

Tracing distribui trace ID e spans entre serviços.

SLI é o indicador medido.

SLO é o objetivo interno.

SLA é o compromisso contratual.

---

### RPO, RTO e recuperação

RPO representa a perda máxima aceitável de dados medida no tempo.

RTO representa o tempo máximo aceitável para restaurar o serviço.

Estratégias conceituais de DR incluem:

```text
backup and restore;

pilot light;

warm standby;

active-active.
```

Quanto menores RPO e RTO, maior tende a ser a complexidade e o custo.

Disponibilidade e durabilidade também são diferentes.

Um dado pode ter alta durabilidade e estar temporariamente indisponível.

---

### Custos e governança

Cloud pode cobrar por:

- tempo;
- CPU;
- memória;
- requests;
- storage;
- IOPS;
- throughput;
- transferência;
- logs;
- métricas;
- snapshots;
- gateways;
- suporte.

Recurso parado pode continuar custando.

FinOps integra engenharia, finanças e negócio.

Práticas:

- tagging;
- budgets;
- alerts;
- rightsizing;
- cleanup;
- forecast;
- custo unitário.

Para backend, um indicador útil pode ser:

```text
custo por pedido.
```

Governança inclui:

- organização de ambientes;
- identidade;
- guardrails;
- logging;
- budgets;
- regions permitidas;
- naming;
- incidentes.

Landing zone é a fundação governada que reúne essas capacidades.

---

### Portabilidade e lock-in

Containers e Kubernetes aumentam portabilidade do compute.

Não tornam automaticamente portáveis:

- banco;
- IAM;
- DNS;
- observabilidade;
- mensageria;
- storage;
- rede.

Lock-in não é sempre errado.

Pode ser uma troca consciente por:

- velocidade;
- operação reduzida;
- recursos avançados;
- confiabilidade.

---

### Arquitetura provider-neutral da aula

A topologia será:

```text
Internet
   |
DNS
   |
Edge / WAF
   |
Load Balancer / API Entry
   |
Private Compute
   |
orders-api replicas
   |
+-------------------------------+
| Relational Database           |
| Cache                         |
| Messaging                     |
| Object Storage                |
| Secret Manager                |
| Observability                 |
+-------------------------------+
```

O fluxo de deploy será:

```text
commit;

pipeline;

testes;

imagem;

registry;

scan;

assinatura;

promoção;

identidade temporária;

deploy;

health;

smoke test;

evidence.
```

A arquitetura identificará falhas de:

- instância;
- Pod;
- node;
- zona;
- região;
- dependência;
- identidade;
- DNS;
- certificado;
- deployment;
- configuração.

Também classificará dados como:

```text
public;

internal;

confidential;

restricted.
```

---

### Relação com o que já foi construído

A formação já aplicou princípios úteis para cloud:

- configuração externa;
- containers;
- processos stateless;
- logs como streams;
- health checks;
- HPA;
- Ingress;
- volumes;
- RBAC;
- IaC conceitual;
- Helm conceitual;
- estratégias de release.

O compute da `orders-api` continuará stateless.

Estado durável ficará em serviços de dados.

Connection pool precisa considerar:

```text
máximo de réplicas
x
pool por réplica.
```

Exemplo didático:

```text
6 Pods
x
15 conexões
=
90 conexões.
```

Retry sem limite pode criar retry storm.

A policy exigirá:

- timeout;
- retry limitado;
- backoff;
- jitter;
- idempotência;
- circuit breaker.

Ao final, você deverá explicar:

```text
como escolher
uma capacidade
antes do produto;

como região e zona
afetam arquitetura;

como separar
entrada, aplicação
e dados;

como workload identity
reduz Secrets;

como compute,
database,
mensageria
e storage
se relacionam;

como RPO e RTO
orientam recuperação;

como responsabilidade
é compartilhada;

como custo
entra no design.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
535:
Helm conceitual.

536:
Namespace RBAC conceitual.

537:
Cloud conceitos para backend.

538:
AWS visao backend.

539:
Azure visao backend.
```

A aula 536 respondeu:

```text
como limitar
quem pode operar
resources no cluster?
```

A aula 537 responderá:

```text
como mapear
uma aplicação backend
para capacidades de cloud?
```

Nesta aula:

```text
cloud:
sim.

IaaS:
sim.

PaaS:
sim.

SaaS:
sim.

CaaS:
sim.

FaaS:
sim.

região:
sim.

zona:
sim.

rede:
sim.

compute:
sim.

IAM:
conceitual.

workload identity:
conceitual.

database:
sim.

cache:
sim.

messaging:
sim.

object storage:
sim.

observabilidade:
sim.

HA:
sim.

DR:
sim.

RPO:
sim.

RTO:
sim.

custo:
sim.

governança:
sim.

AWS:
não mapeada.

Azure:
não mapeada.

recurso real:
não.
```

A regra central será:

```text
capacidade primeiro;

produto depois;

segurança,
resiliência
e custo
desde o início.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
cloud/provider-neutral
├── backend-cloud-architecture.yaml
├── network-zones.yaml
├── shared-responsibility-matrix.yaml
├── data-service-catalog.yaml
├── resilience-contract.yaml
├── identity-contract.yaml
├── observability-contract.yaml
├── cost-governance-policy.yaml
├── environment-separation-policy.yaml
└── cloud-adoption-roadmap.yaml

scripts/cloud/provider-neutral
├── validate-cloud-architecture.ps1
├── validate-network-zones.ps1
├── validate-data-classification.ps1
├── validate-rpo-rto.ps1
├── validate-shared-responsibility.ps1
├── estimate-capacity-envelope.ps1
├── audit-cloud-cost-drivers.ps1
├── generate-cloud-decision-summary.ps1
└── collect-cloud-concept-evidence.ps1

docs/devops/cloud
├── CLOUD_FUNDAMENTALS_FOR_BACKEND.md
├── CLOUD_NETWORKING_MODEL.md
├── CLOUD_IDENTITY_MODEL.md
├── CLOUD_DATA_SERVICES.md
├── CLOUD_RESILIENCE_MODEL.md
├── SHARED_RESPONSIBILITY.md
├── CLOUD_COST_MODEL.md
├── CLOUD_ADOPTION_RUNBOOK.md
├── CLOUD_TEST_MATRIX.md
└── CLOUD_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
arquitetura provider-neutral;

zonas de rede;

contrato de identidade;

catálogo de dados;

matriz de responsabilidade;

RPO e RTO;

política de custos;

separação de ambientes;

roadmap de adoção;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline local;
2. inventariar dependências;
3. classificar o workload;
4. criar arquitetura provider-neutral;
5. modelar rede;
6. modelar entrada;
7. modelar compute;
8. modelar banco;
9. modelar cache;
10. modelar mensageria;
11. modelar storage;
12. modelar identidade;
13. modelar Secrets;
14. modelar observabilidade;
15. definir RPO;
16. definir RTO;
17. definir HA;
18. definir DR;
19. criar responsibility matrix;
20. criar cost policy;
21. separar ambientes;
22. validar blast radius;
23. simular falhas;
24. validar contratos;
25. criar scripts;
26. criar docs;
27. gerar roadmap;
28. coletar evidence;
29. executar gate;
30. commitar;
31. preparar a aula 538.

---

## Conceito essencial

### Cloud computing

Entrega de capacidades de tecnologia sob demanda por APIs, automação e modelos medidos.

---

### Region

Área geográfica de operação.

---

### Availability zone

Domínio de falha dentro de uma região.

---

### Edge

Infraestrutura próxima aos usuários para entrada, cache e proteção.

---

### IaaS

Infraestrutura como serviço.

---

### PaaS

Plataforma como serviço.

---

### SaaS

Software como serviço.

---

### CaaS

Containers como serviço.

---

### FaaS

Funções como serviço.

---

### Shared responsibility

Divisão de responsabilidades entre provedor e cliente.

---

### High availability

Capacidade de manter serviço durante falhas previstas.

---

### Disaster recovery

Recuperação após falha de maior impacto.

---

### RPO

Perda máxima aceitável de dados medida no tempo.

---

### RTO

Tempo máximo aceitável para recuperação.

---

### Workload identity

Identidade associada ao workload para acessar serviços sem chave permanente.

---

### Managed service

Serviço em que o provedor opera mais camadas técnicas.

---

### Elasticity

Ajuste de capacidade conforme demanda.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- aplicação disponível;
- duas réplicas mínimas;
- Ingress;
- HPA;
- volumes;
- RBAC read-only.

A arquitetura cloud partirá de um workload já funcional.

---

### 2. Inventariar as dependências atuais

Crie:

```text
cloud/provider-neutral/current-dependencies.yaml
```

Registre:

```yaml
application:
  name:
    orders-api

  runtime:
    container

  orchestration:
    kubernetes

  dependencies:
    - relational-database
    - kafka-compatible-messaging
    - secret-management
    - container-registry
    - observability

  exposure:
    http-ingress

  state:
    stateless-compute
```

Nenhum endpoint real entra no arquivo.

---

### 3. Classificar o workload

Registre:

```yaml
workload:
  protocol:
    HTTP

  execution:
    long-running

  state:
    stateless

  scaling:
    horizontal

  availability:
    multi-instance

  dataSensitivity:
    confidential

  recoveryTier:
    business-critical
```

---

### 4. Criar a arquitetura provider-neutral

Arquivo:

```text
backend-cloud-architecture.yaml
```

Conteúdo:

```yaml
architecture:
  entry:
    - dns
    - edge-protection
    - tls
    - layer7-load-balancing

  compute:
    - private-container-runtime
    - horizontal-scaling
    - multi-zone-placement
    - health-checks

  data:
    - managed-relational-database
    - distributed-cache
    - managed-messaging
    - object-storage

  security:
    - workload-identity
    - secret-manager
    - key-management
    - audit-logging

  operations:
    - metrics
    - logs
    - traces
    - alerts
    - backups
    - cost-monitoring
```

O arquivo descreve capacidades.

---

### 5. Criar zonas de rede

Arquivo:

```text
network-zones.yaml
```

Conteúdo:

```yaml
network:
  publicEntry:
    internetFacing:
      true

    allows:
      - HTTPS

  privateApplication:
    internetFacing:
      false

    receivesFrom:
      - publicEntry

    sendsTo:
      - privateData
      - approvedExternalApis
      - observability

  privateData:
    internetFacing:
      false

    receivesFrom:
      - privateApplication

  egress:
    allowlistRequired:
      true

    inspectionRequired:
      true
```

---

### 6. Modelar o fluxo HTTP

Registre:

```text
cliente
→ DNS
→ edge/WAF
→ load balancer
→ compute privado
→ orders-api
→ dependências.
```

O backend não recebe IP público direto.

---

### 7. Modelar compute

No architecture file:

```yaml
compute:
  packaging:
    container

  placement:
    private

  minimumInstances:
    2

  scaling:
    horizontal

  health:
    startup:
      required

    readiness:
      required

    liveness:
      required

  deployment:
    strategy:
      rolling

    immutableImage:
      required
```

---

### 8. Modelar identidade

Arquivo:

```text
identity-contract.yaml
```

Conteúdo:

```yaml
identity:
  human:
    federation:
      required

    mfa:
      required

  pipeline:
    shortLivedCredential:
      required

    staticKubeconfig:
      forbidden

  workload:
    workloadIdentity:
      required

    staticAccessKey:
      forbidden

  authorization:
    leastPrivilege:
      required

    separationOfDuties:
      required
```

---

### 9. Modelar Secrets

Adicione:

```yaml
secrets:
  source:
    managedSecretStore

  rotation:
    required

  encryption:
    required

  git:
    forbidden

  logs:
    forbidden

  delivery:
    workloadIdentity
```

---

### 10. Criar catálogo de dados

Arquivo:

```text
data-service-catalog.yaml
```

Conteúdo:

```yaml
dataServices:
  ordersDatabase:
    capability:
      relational-database

    criticality:
      high

    encryption:
      required

    backup:
      required

    multiZone:
      required

  integrationMessaging:
    capability:
      durable-messaging

    delivery:
      at-least-once

    deadLetter:
      required

  runtimeCache:
    capability:
      distributed-cache

    sourceOfTruth:
      false

  documents:
    capability:
      object-storage

    versioning:
      required
```

---

### 11. Definir conexão com banco

Crie um cálculo:

```text
max replicas
x
pool por réplica
<=
capacidade segura do banco.
```

Exemplo didático:

```text
6 réplicas
x
15 conexões
=
90 conexões.
```

O valor final depende da capacidade real.

---

### 12. Definir mensageria

Registre:

```yaml
messaging:
  delivery:
    at-least-once

  idempotentConsumer:
    required

  retry:
    bounded

  backoff:
    exponential-with-jitter

  deadLetter:
    required

  retention:
    defined

  poisonMessage:
    runbookRequired
```

---

### 13. Definir storage de objetos

Registre:

```yaml
objectStorage:
  publicAccess:
    forbidden

  encryption:
    required

  versioning:
    required

  lifecycle:
    required

  signedUrl:
    allowedWhenReviewed

  audit:
    required
```

---

### 14. Criar contrato de observabilidade

Arquivo:

```text
observability-contract.yaml
```

Inclua:

```yaml
observability:
  metrics:
    - request-rate
    - error-rate
    - latency
    - saturation
    - queue-depth
    - database-pool
    - jvm
    - cost

  logs:
    structured:
      true

    correlationId:
      required

    secretRedaction:
      required

  traces:
    propagation:
      required

  alerts:
    actionable:
      required

  runbooks:
    required:
      true
```

---

### 15. Criar contrato de resiliência

Arquivo:

```text
resilience-contract.yaml
```

Conteúdo:

```yaml
resilience:
  availability:
    multiZone:
      required

    minimumInstances:
      2

  recovery:
    ordersDatabase:
      rpoMinutes:
        15

      rtoMinutes:
        60

    objectStorage:
      rpoMinutes:
        60

      rtoMinutes:
        240

  testing:
    restore:
      quarterly

    failover:
      semiannual

  dependencies:
    timeout:
      required

    retry:
      bounded

    circuitBreaker:
      required
```

Os números são uma baseline didática e precisam de aprovação de negócio.

---

### 16. Criar matriz de responsabilidade

Arquivo:

```text
shared-responsibility-matrix.yaml
```

Exemplo:

```yaml
responsibilities:
  physicalDatacenter:
    owner:
      provider

  networkConfiguration:
    owner:
      customer

  operatingSystem:
    owner:
      depends-on-service-model

  applicationCode:
    owner:
      customer

  identityPolicy:
    owner:
      customer

  databaseSchema:
    owner:
      customer

  managedDatabaseEngine:
    owner:
      shared

  dataClassification:
    owner:
      customer

  backupConfiguration:
    owner:
      customer

  restoreTesting:
    owner:
      customer
```

---

### 17. Criar policy de ambientes

Arquivo:

```text
environment-separation-policy.yaml
```

Inclua:

```yaml
environments:
  dev:
    isolatedIdentity:
      true

    productionData:
      forbidden

  hml:
    isolatedIdentity:
      true

    representativeConfiguration:
      required

  prod:
    isolatedIdentity:
      true

    approval:
      required

    multiZone:
      required

  sharedCredentials:
    forbidden
```

---

### 18. Criar policy de custos

Arquivo:

```text
cost-governance-policy.yaml
```

Conteúdo:

```yaml
cost:
  tags:
    required:
      - application
      - environment
      - owner-role
      - cost-center
      - lifecycle

  budgets:
    required:
      true

  alerts:
    required:
      true

  rightsizing:
    monthly

  idleResourceCleanup:
    weekly

  unitCost:
    metric:
      cost-per-order

  dataTransfer:
    reviewed:
      true
```

---

### 19. Definir quotas e limites

Registre:

- quota de compute;
- quota de IP;
- quota de load balancer;
- quota de banco;
- quota de mensagens;
- quota de API;
- limite de logs;
- limite de budgets.

---

### 20. Simular falha de instância

Cenário:

```text
uma réplica falha.
```

Resposta esperada:

- health check falha;
- balanceador remove target;
- orquestrador cria substituto;
- mínimo de duas réplicas é restaurado;
- alerta registra o evento.

---

### 21. Simular falha de zona

Cenário:

```text
uma zona fica indisponível.
```

Resposta esperada:

- compute permanece em outra zona;
- entrada continua;
- banco utiliza failover;
- capacidade pode reduzir;
- alerta é acionado;
- nenhum deploy ocorre durante incidente.

---

### 22. Simular indisponibilidade do banco

Resposta esperada:

- timeout curto;
- pool não cresce indefinidamente;
- readiness pode falhar;
- liveness permanece local;
- retry é limitado;
- circuit breaker abre;
- alerta é acionado;
- nenhuma escrita é inventada.

---

### 23. Simular credencial revogada

Resposta esperada:

- workload falha de forma controlada;
- nenhum fallback para chave estática;
- alerta;
- identidade corrigida;
- credencial curta renovada;
- auditoria preservada.

---

### 24. Simular região indisponível

A decisão depende do recovery tier.

Para a baseline didática:

```text
backup and restore
ou
warm standby.
```

Registre:

- trigger;
- owner;
- DNS;
- data;
- RPO;
- RTO;
- smoke test;
- retorno.

Não implemente uma segunda região.

---

### 25. Validar RPO e RTO

O script:

```text
validate-rpo-rto.ps1
```

falha quando:

- serviço crítico sem RPO;
- serviço crítico sem RTO;
- backup frequency maior que RPO;
- restore não testado;
- owner ausente;
- estratégia incompatível.

---

### 26. Validar responsabilidade compartilhada

O script:

```text
validate-shared-responsibility.ps1
```

falha quando uma responsabilidade crítica aparece sem owner.

---

### 27. Estimar envelope de capacidade

Arquivo gerado:

```text
cloud-capacity-envelope.json.
```

Campos:

- min instances;
- max instances;
- CPU por instância;
- memória por instância;
- pool por instância;
- total de conexões;
- request rate alvo;
- queue throughput;
- storage growth;
- log volume.

Sem preço de fornecedor.

---

### 28. Auditar drivers de custo

O script procura:

- compute sempre ligado;
- banco superdimensionado;
- snapshots sem retenção;
- logs sem lifecycle;
- egress entre regiões;
- NAT;
- IP ocioso;
- load balancer ocioso;
- storage sem owner;
- ambiente abandonado.

---

### 29. Criar roadmap de adoção

Arquivo:

```text
cloud-adoption-roadmap.yaml
```

Fases:

```yaml
roadmap:
  - phase:
      foundations

    outcomes:
      - identity
      - network
      - logging
      - budgets
      - policies

  - phase:
      data

    outcomes:
      - managed-database
      - messaging
      - object-storage
      - backup

  - phase:
      runtime

    outcomes:
      - registry
      - compute
      - ingress
      - autoscaling

  - phase:
      operations

    outcomes:
      - metrics
      - logs
      - traces
      - alerts
      - runbooks

  - phase:
      resilience

    outcomes:
      - failover-tests
      - restore-tests
      - disaster-recovery
```

---

### 30. Criar summary de decisão

O script:

```text
generate-cloud-decision-summary.ps1
```

produz:

- workload type;
- required capabilities;
- security requirements;
- network zones;
- data services;
- RPO;
- RTO;
- cost drivers;
- open decisions;
- next provider mapping.

Sem recomendar um fornecedor nesta aula.

---

### 31. Criar evidence

Arquivo:

```text
cloud-backend-architecture-evidence.json.
```

Campos permitidos:

- workload;
- capability count;
- network zones;
- public backend false;
- workload identity required;
- static key forbidden;
- data services;
- multi-zone required;
- RPO defined;
- RTO defined;
- restore test defined;
- cost tags defined;
- environment separation defined;
- responsibility matrix complete;
- provider specific resources zero;
- timestamp.

---

### 32. Criar documentação

#### `CLOUD_FUNDAMENTALS_FOR_BACKEND.md`

Explique modelos, regiões, zonas e elasticidade.

#### `CLOUD_NETWORKING_MODEL.md`

Explique entrada pública, compute privado, dados privados e egress.

#### `CLOUD_IDENTITY_MODEL.md`

Explique federation, IAM, workload identity e credenciais curtas.

#### `CLOUD_DATA_SERVICES.md`

Explique banco, cache, mensageria e storage.

#### `CLOUD_RESILIENCE_MODEL.md`

Explique HA, DR, RPO, RTO, backup e restore.

#### `SHARED_RESPONSIBILITY.md`

Explique responsibilities por modelo de serviço.

#### `CLOUD_COST_MODEL.md`

Explique drivers de custo e FinOps.

---

### 33. Criar runbook

Arquivo:

```text
CLOUD_ADOPTION_RUNBOOK.md
```

Passos:

1. classificar workload;
2. classificar dados;
3. definir região;
4. definir zonas;
5. definir identidade;
6. definir rede;
7. definir compute;
8. definir dados;
9. definir Secrets;
10. definir observabilidade;
11. definir RPO e RTO;
12. definir custos;
13. validar responsabilidade;
14. simular falhas;
15. aprovar;
16. mapear para provedor.

---

### 34. Criar test matrix

Arquivo:

```text
CLOUD_TEST_MATRIX.md
```

Cenários:

- backend sem IP público;
- TLS obrigatório;
- workload identity presente;
- static key bloqueada;
- banco privado;
- backup definido;
- restore test definido;
- RPO definido;
- RTO definido;
- multi-zone;
- falha de instância;
- falha de zona;
- banco indisponível;
- Secret revogado;
- região indisponível;
- logs com redaction;
- environment isolation;
- budget alert;
- recurso sem owner;
- provider resource detectado.

---

### 35. Criar troubleshooting

Arquivo:

```text
CLOUD_TROUBLESHOOTING.md
```

Inclua:

- região errada;
- subnet sem rota;
- backend com IP público;
- DNS incorreto;
- TLS expirado;
- identity denied;
- Secret inacessível;
- banco sem conexão;
- pool esgotado;
- fila acumulando;
- object storage denied;
- quota atingida;
- logs caros;
- egress inesperado;
- backup sem restore;
- RPO impossível;
- ambiente compartilhando credencial;
- recurso órfão;
- custo sem owner.

---

### 36. Executar validações

Execute:

```powershell
.\scripts\cloud\provider-neutral\validate-cloud-architecture.ps1

.\scripts\cloud\provider-neutral\validate-network-zones.ps1

.\scripts\cloud\provider-neutral\validate-data-classification.ps1

.\scripts\cloud\provider-neutral\validate-rpo-rto.ps1

.\scripts\cloud\provider-neutral\validate-shared-responsibility.ps1

.\scripts\cloud\provider-neutral\estimate-capacity-envelope.ps1

.\scripts\cloud\provider-neutral\audit-cloud-cost-drivers.ps1

.\scripts\cloud\provider-neutral\generate-cloud-decision-summary.ps1

.\scripts\cloud\provider-neutral\collect-cloud-concept-evidence.ps1
```

---

### 37. Executar gate final

Finalize:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme:

- nenhum recurso cloud criado;
- nenhuma credencial adicionada;
- nenhum endpoint real;
- aplicação local saudável;
- contratos completos;
- ponte pronta para AWS.

---

## Entendendo o que foi feito

### Cloud deixou de ser uma lista de produtos

A arquitetura começou por capacidades e requisitos.

### Rede ganhou zonas

Entrada pública, aplicação privada e dados privados ficaram separados.

### Compute ganhou opções

Kubernetes deixou de ser a única resposta possível.

### Identidade ganhou prioridade

Workload identity substituiu a ideia de chave estática.

### Dados ganharam serviços adequados

Banco, cache, mensageria e object storage receberam responsabilidades diferentes.

### Resiliência ganhou números

RPO e RTO transformaram recuperação em contrato.

### Responsabilidade ficou explícita

Serviço gerenciado não removeu o papel da equipe.

### Custos entraram no design

Tags, budgets, lifecycle e custo unitário passaram a ser requisitos.

### Ambientes ganharam separação

Dev, hml e prod não compartilham credenciais ou dados.

### A próxima aula ganhou uma base neutra

AWS poderá ser estudada como mapeamento de capacidades, não como memorização de catálogo.

---

## Erros comuns importantes

### Escolher produto antes do requisito

A arquitetura vira dependente do catálogo.

### Colocar backend diretamente na internet

A superfície de ataque aumenta.

### Usar chave estática no container

Rotação e auditoria ficam frágeis.

### Tratar serviço gerenciado como responsabilidade zero

Configuração, dados e acesso continuam sendo do cliente.

### Confundir HA e DR

Uma arquitetura multi-zone ainda pode perder uma região.

### Definir backup sem restore

A recuperação permanece desconhecida.

### Usar auto scaling sem calcular banco

O pool pode esgotar conexões.

### Ignorar egress

Custos e exposição podem crescer.

### Centralizar logs sem retenção

O custo aumenta continuamente.

### Compartilhar credencial entre ambientes

O blast radius aumenta.

### Adotar multi-cloud sem necessidade

A complexidade operacional pode superar o benefício.

### Antecipar AWS

A aula 538 possui esse objetivo.

---

## Comandos úteis

### Validar arquitetura

```powershell
.\scripts\cloud\provider-neutral\validate-cloud-architecture.ps1
```

### Validar RPO e RTO

```powershell
.\scripts\cloud\provider-neutral\validate-rpo-rto.ps1
```

### Estimar capacidade

```powershell
.\scripts\cloud\provider-neutral\estimate-capacity-envelope.ps1
```

### Auditar custos

```powershell
.\scripts\cloud\provider-neutral\audit-cloud-cost-drivers.ps1
```

### Gerar summary

```powershell
.\scripts\cloud\provider-neutral\generate-cloud-decision-summary.ps1
```

---

## Exercício guiado

### Parte 1 — Workload

Classifique a `orders-api`.

### Parte 2 — Network

Separe entrada, compute e dados.

### Parte 3 — Identity

Defina federation e workload identity.

### Parte 4 — Data

Escolha capacidades de banco, cache, mensageria e storage.

### Parte 5 — Resilience

Defina RPO, RTO, HA e DR.

### Parte 6 — Observability

Defina metrics, logs, traces e alerts.

### Parte 7 — Responsibility

Distribua responsabilidades.

### Parte 8 — Cost

Defina tags, budgets e drivers.

### Parte 9 — Failure

Simule instância, zona, banco, identidade e região.

### Parte 10 — Roadmap

Organize a adoção antes do provedor.

---


## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 536 foi preservada;
- ponte para a aula 538 está correta;
- cloud computing, IaaS, PaaS, SaaS, CaaS e FaaS foram definidos;
- public, private, hybrid e multi-cloud foram diferenciados;
- região, Availability Zone, edge e failure domain foram explicados;
- responsabilidade compartilhada foi definida;
- HA foi diferenciada de DR;
- RPO e RTO foram definidos;
- workload identity e credenciais curtas foram priorizadas;
- nenhum recurso real de cloud foi criado;
- nenhuma conta, credencial, endpoint, IP ou Secret real foi usado;
- arquitetura começou por capacidades, não por produtos;
- workload `orders-api` foi classificado como containerizado, stateless e horizontalmente escalável;
- dependências atuais foram inventariadas;
- arquitetura provider-neutral foi criada;
- entrada pública, aplicação privada e dados privados foram separados;
- backend sem IP público foi definido;
- DNS, edge, WAF, TLS e load balancing foram modelados;
- compute privado, multi-zone, health checks e imagem imutável foram exigidos;
- federation, MFA, pipeline identity e workload identity foram modelados;
- static kubeconfig e static access key foram proibidos;
- secret manager, rotação e key management foram definidos;
- banco relacional, cache, mensageria e object storage foram diferenciados;
- encryption, backup e multi-zone foram exigidos para o banco;
- pool total foi relacionado ao número máximo de réplicas;
- mensageria exige idempotência, retry limitado, backoff e dead-letter;
- object storage público foi proibido;
- métricas, logs, traces, alerts e runbooks foram definidos;
- redaction e correlation ID foram exigidos;
- contrato de resiliência foi criado;
- RPO, RTO, restore test e failover test foram registrados;
- matriz de responsabilidade foi criada e possui owners;
- dev, hml e prod foram separados;
- dados produtivos em dev e credenciais compartilhadas foram proibidos;
- policy de custos possui tags, budgets, alerts, rightsizing e cleanup;
- custo por pedido foi definido como métrica unitária;
- quotas e drivers de custo foram documentados;
- falhas de instância, zona, banco, identidade e região foram simuladas;
- validator de RPO e RTO foi criado;
- validator de responsabilidade compartilhada foi criado;
- envelope de capacidade foi criado;
- conexões, throughput, storage e logs foram considerados;
- roadmap de adoção foi criado;
- decision summary não recomendou fornecedor;
- evidence foi sanitizada;
- provider-specific resources ficaram em zero;
- documentação, runbook, test matrix e troubleshooting foram criados;
- IaC, Helm, Kubernetes e cloud receberam boundaries claras;
- compute permaneceu stateless;
- retry storm e blast radius foram tratados;
- nenhum serviço AWS foi mapeado antecipadamente;
- gate final foi executado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/provider-neutral `
  scripts/cloud/provider-neutral `
  docs/devops/cloud `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure credenciais e endpoints reais:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "access.key|secret.key|token:|client-key-data|account.id|https://.*amazonaws|https://.*azure"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): modelar cloud para backend"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credencial;
- account ID;
- subscription ID;
- project ID;
- endpoint real;
- IP real;
- kubeconfig;
- Secret;
- preço não validado;
- recurso real de cloud;
- mapeamento AWS da aula 538.

---


## Fechamento e ponte para a próxima aula

Nesta aula, cloud deixou de ser uma lista de produtos.

O modelo passou a incluir:

```text
capabilities;

regions e zones;

network;

compute;

identity;

data;

observability;

resilience;

cost;

governance.
```

Você comprovou que requisito vem antes do produto; backend pode permanecer privado; workload identity reduz chaves estáticas; banco, cache, mensageria e object storage possuem responsabilidades diferentes; serviço gerenciado mantém responsabilidades do cliente; RPO e RTO orientam recuperação; observabilidade e custos fazem parte do design; ambientes não compartilham dados ou credenciais; e autoscaling precisa respeitar a capacidade das dependências.

A próxima aula será:

```text
538 - M17.33 - AWS visao backend
```

Nela, essas capacidades serão mapeadas para regiões, Availability Zones, VPC, IAM, compute, banco, mensageria, storage, observabilidade e custos da AWS.

Nenhum serviço, conta, credencial ou recurso real da AWS foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei o workload.
- [ ] Criei a arquitetura provider-neutral.
- [ ] Separei entrada, aplicação e dados.
- [ ] Modelei identidade e Secrets.
- [ ] Defini RPO, RTO, HA e DR.
- [ ] Criei a matriz de responsabilidade.
- [ ] Modelei custos e ambientes.
- [ ] Fiz o commit recomendado.

---


## Troubleshooting adicional

### A arquitetura começa por um produto

Retorne aos requisitos e capacidades.

### O backend possui IP público

Revise a camada de entrada e o compute privado.

### A aplicação exige chave estática

Modele workload identity e credenciais temporárias.

### Existe backup, mas não restore testado

A recuperação ainda não está comprovada.

### O HPA esgota conexões

Revise réplicas, pool por Pod e capacidade do banco.

### Logs ou egress aumentam o custo

Defina retenção, lifecycle, budgets e alertas.

### Dev usa dados ou credenciais de produção

Separe identidade, banco, Secrets e datasets.

### RPO, RTO ou owner estão ausentes

O contrato operacional está incompleto.

### Um produto AWS virou a resposta principal

Retorne ao modelo provider-neutral e preserve o mapeamento para a aula 538.

---

## Perguntas de revisão

1. O que é cloud computing?
2. O que é região?
3. O que é Availability Zone?
4. O que é IaaS?
5. O que é PaaS?
6. O que é CaaS?
7. O que é FaaS?
8. O que é shared responsibility?
9. O que é workload identity?
10. Qual a diferença entre HA e DR?
11. O que é RPO?
12. O que é RTO?
13. Por que backend não precisa de IP público?
14. Qual a função de um load balancer?
15. Qual a diferença entre queue e topic?
16. O que é object storage?
17. Quais são os pilares de observabilidade?
18. Por que custo é requisito arquitetural?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Capacidades sob demanda.
2. Área geográfica.
3. Domínio de falha regional.
4. Infraestrutura gerenciada.
5. Plataforma gerenciada.
6. Execução de containers.
7. Funções por evento.
8. Divisão de responsabilidade.
9. Identidade sem chave fixa.
10. Disponibilidade e recuperação.
11. Perda máxima de dados.
12. Tempo máximo de recuperação.
13. Usa entrada controlada.
14. Distribuir tráfego saudável.
15. Consumo único e múltiplos assinantes.
16. Storage por objetos.
17. Metrics, logs e traces.
18. Recursos são medidos.
19. Recursos reais de cloud.
20. AWS visão backend.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 537 - M17.32 - Cloud conceitos para backend

- Continuei após Namespace e RBAC.
- Defini cloud computing sob a perspectiva de backend.
- Estudei IaaS, PaaS, SaaS, CaaS e FaaS.
- Estudei public, private, hybrid e multi-cloud.
- Diferenciei região, zona e edge.
- Modelei entrada pública, compute privado e dados privados.
- Relacionei DNS, WAF, load balancing e API gateway.
- Modelei compute para containers e Kubernetes.
- Relacionei IAM, federation e workload identity.
- Proibi chaves estáticas para workloads e pipelines.
- Modelei secret management e key management.
- Modelei banco relacional, cache, mensageria e object storage.
- Relacionei pool de conexões ao número de réplicas.
- Defini idempotência, retry, backoff e dead-letter.
- Modelei metrics, logs, traces, alerts e runbooks.
- Diferenciei HA e DR.
- Defini RPO e RTO.
- Modelei backup, restore e failover tests.
- Criei uma matriz de responsabilidade compartilhada.
- Separei dev, hml e prod.
- Proibi credenciais compartilhadas e dados produtivos em dev.
- Modelei tags, budgets, rightsizing e custo por pedido.
- Simulei falha de instância, zona, banco, identidade e região.
- Criei envelope de capacidade e auditoria de custos.
- Criei roadmap de adoção.
- Mantive a arquitetura provider-neutral.
- Não criei conta, credencial ou recurso de cloud.
- Próxima aula: AWS visão backend.
```

---

## Referência técnica curta

- Cloud Computing Concepts.
- Shared Responsibility Model.
- Regions and Availability Zones.
- Cloud Networking Fundamentals.
- Workload Identity and Federation.
- Managed Databases.
- Managed Messaging.
- Object Storage.
- High Availability and Disaster Recovery.
- FinOps and Cloud Cost Management.

Regra final:

```text
arquitetura cloud para backend começa por capacidades e contratos, não pelo catálogo do fornecedor: região, zonas, edge, entrada pública, compute privado e dados privados definem failure domains e caminhos de tráfego; containers stateless recebem health checks, autoscaling, imagem imutável e identidade do workload, enquanto banco relacional, cache, mensageria e object storage possuem responsabilidades, consistência, backup e capacidade próprias; federation, MFA, credenciais curtas, secret manager, key management, TLS e least privilege substituem chaves estáticas, e responsabilidade compartilhada mantém o cliente responsável por código, dados, identidade, configuração, restore e operação mesmo em serviços gerenciados; HA, DR, RPO, RTO, restore test, failover test, metrics, logs, traces, budgets, tags, quotas e custo unitário fazem parte do design; dev, hml e prod permanecem separados e nenhuma conta, credencial ou infraestrutura real é criada, permitindo que a aula 538 mapeie essas capacidades para AWS sem transformar arquitetura em memorização de produtos.
```
