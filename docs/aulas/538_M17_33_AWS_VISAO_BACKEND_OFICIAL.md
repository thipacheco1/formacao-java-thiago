# 538 - M17.33 - AWS visao backend

## Apresentação da aula

Na aula 537, você construiu uma arquitetura de cloud provider-neutral.

O modelo separou:

```text
entrada pública;

compute privado;

dados privados;

identidade;

Secrets;

observabilidade;

resiliência;

custos;

governança.
```

Também foram definidos contratos para:

- workload stateless;
- múltiplas zonas;
- banco relacional;
- cache;
- mensageria;
- object storage;
- workload identity;
- RPO;
- RTO;
- responsabilidade compartilhada;
- separação entre dev, hml e prod.

A pergunta central desta aula será:

```text
como mapear
essas capacidades

para serviços AWS

sem transformar
arquitetura
em memorização
de catálogo?
```

A resposta será construída por responsabilidade.

Exemplo:

```text
capacidade:
DNS.

serviço AWS:
Route 53.
```

Outro exemplo:

```text
capacidade:
registro de imagens.

serviço AWS:
Elastic Container Registry.
```

Outro exemplo:

```text
capacidade:
banco PostgreSQL gerenciado.

serviços AWS possíveis:
Amazon RDS for PostgreSQL
ou
Amazon Aurora PostgreSQL-Compatible.
```

A regra central será:

```text
capacidade define
o problema;

serviço AWS define
uma implementação;

arquitetura define
como tudo se conecta.
```

Nesta aula, nenhum recurso AWS será provisionado.

Não haverá:

- criação de conta;
- access key;
- secret key;
- login em console;
- cobrança;
- VPC real;
- cluster EKS;
- serviço ECS;
- função Lambda;
- bucket S3;
- fila SQS;
- tópico SNS;
- banco RDS;
- domínio Route 53;
- certificado ACM;
- pipeline conectado à AWS.

O laboratório será arquitetural, offline e validável.

A próxima aula será:

```text
539 - M17.34 - RDS PostgreSQL
```

Por isso, RDS será apresentado como capacidade e decisão arquitetural, mas nenhuma instância PostgreSQL será criada antecipadamente.

---

### Infraestrutura global da AWS

A AWS organiza serviços em Regions, Availability Zones e Edge Locations. Region é a área geográfica; AZ é um domínio de falha dentro dela; edge aproxima distribuição e proteção dos usuários. A arquitetura usará uma Region principal, ao menos duas AZs e compute e dados privados. A escolha considera latência, residência de dados, catálogo, custo, compliance e recuperação.

---

### Conta, organização e ambiente

A conta é uma boundary de billing, identidade, quotas, recursos, logs e blast radius. Uma estrutura profissional pode separar management, security, log archive, shared services, dev, hml e prod. Produção não compartilha credenciais, dados ou blast radius com desenvolvimento. Nesta aula, somente o contrato de boundaries será criado.

---

### Identidade na AWS

O serviço central de autorização é:

```text
AWS Identity and Access Management;

IAM.
```

Conceitos principais:

- principal;
- user;
- role;
- policy;
- permission;
- trust policy;
- session;
- federation;
- temporary credentials.

#### IAM User

Representa uma identidade persistente dentro de uma conta.

Não deve ser a escolha padrão para workloads e pipelines modernos.

#### IAM Role

Identidade assumida temporariamente.

É adequada para:

- serviços AWS;
- workloads;
- pipelines;
- usuários federados;
- automações.

#### Policy

Documento que define actions, resources e conditions.

#### AWS STS

Fornece credenciais temporárias para sessões e roles assumidas.

A regra será:

```text
pipeline e workload
usam roles
e sessões temporárias;

não usam
access key permanente
versionada.
```

Para pessoas, a arquitetura priorizará:

- federation;
- MFA;
- grupos;
- permission sets;
- sessões temporárias.

Para GitHub Actions, o plano conceitual utilizará:

```text
OIDC;

trust policy;

AssumeRoleWithWebIdentity;

credencial temporária.
```

Nenhum secret de access key será armazenado no GitHub.

---

### Workload identity em containers

A identidade acompanha o runtime: Pod, task, instância ou função recebe uma role apropriada, e o SDK usa credenciais temporárias. Nenhuma credencial AWS entra em variável versionada, imagem, ConfigMap ou arquivo do repositório.

---

### Rede com Amazon VPC

A capacidade de rede virtual é fornecida por:

```text
Amazon Virtual Private Cloud;

VPC.
```

Conceitos principais:

- CIDR;
- subnet;
- route table;
- Internet Gateway;
- NAT Gateway;
- Security Group;
- Network ACL;
- VPC Endpoint;
- peering;
- Transit Gateway;
- VPN;
- conexão dedicada.

A arquitetura utilizará três zonas lógicas.

```text
public entry;

private application;

isolated data.
```

#### Public subnets

Podem hospedar componentes de entrada que precisam de rota pública.

#### Private application subnets

Executam compute sem endereço público direto.

#### Isolated data subnets

Hospedam bancos e serviços de dados sem rota direta para a internet.

A distribuição será multi-AZ.

Exemplo conceitual:

```text
AZ A:
public-a,
app-a,
data-a.

AZ B:
public-b,
app-b,
data-b.
```

---

### Security Groups e Network ACLs

Security Group é stateful e protege interfaces e recursos; Network ACL é stateless e atua na subnet. O ALB aceita HTTPS, o backend aceita apenas o ALB e o RDS aceita PostgreSQL apenas do backend. PostgreSQL nunca será aberto para `0.0.0.0/0`.

---

### Entrada HTTP

A entrada pode combinar:

- Route 53;
- CloudFront;
- AWS WAF;
- AWS Shield;
- Application Load Balancer;
- Network Load Balancer;
- API Gateway;
- AWS Certificate Manager.

#### Route 53

DNS e políticas de roteamento.

#### CloudFront

Distribuição em edge, cache e aceleração.

#### AWS WAF

Regras de proteção de camada de aplicação.

#### Shield

Proteção contra ataques de negação de serviço conforme o nível do serviço.

#### Application Load Balancer

Balanceamento de camada 7 com host e path routing.

#### Network Load Balancer

Balanceamento de camada 4 com alta performance para TCP e UDP.

#### API Gateway

Entrada gerenciada para APIs, com autenticação, quotas, stages e integrações.

#### AWS Certificate Manager

Gerenciamento de certificados para integrações compatíveis.

A `orders-api` pode usar:

```text
Route 53
→ WAF
→ ALB
→ compute privado.
```

Em um cenário de API gateway:

```text
Route 53
→ API Gateway
→ integração privada
→ backend.
```

- protocolo;
- autenticação;
- throughput;
- latência;
- transformação;
- custo;
- necessidade de quotas;
- operação.

---

### Registro de imagens

O registro de containers será mapeado para:

```text
Amazon Elastic Container Registry;

ECR.
```

ECR armazena imagens e metadata.

- repositório por responsabilidade;
- tags imutáveis ou controladas;
- digest registrado;
- scanning;
- lifecycle;
- encryption;
- acesso por IAM;
- promoção entre ambientes;
- nenhuma credencial fixa.

O deploy utilizará a imagem por digest.

---

### Opções de compute para backend

EC2 oferece maior controle e maior operação. ECS orquestra containers sobre EC2 ou Fargate. Fargate reduz a gestão de instâncias. EKS preserva a API Kubernetes, mas mantém responsabilidades de workloads, add-ons, networking, upgrades e custos. Lambda atende processamento orientado a eventos. App Runner e Elastic Beanstalk oferecem maior abstração. A escolha compara controle, operação, portabilidade, startup, protocolo e custo; nenhum runtime será definido nesta aula.

---

### Mapeamento do Kubernetes existente

Em EKS, Deployment, Service, Ingress, HPA, ConfigMap, Secret, volumes e RBAC continuam existindo. Serviços AWS podem complementar load balancing, workload identity, secret management, CSI, logs e tracing. Nenhum controller, add-on ou driver será instalado.

---

### Banco relacional

As principais opções gerenciadas são:

```text
Amazon RDS;

Amazon Aurora.
```

#### Amazon RDS

Serviço gerenciado para engines relacionais, incluindo PostgreSQL.

#### Amazon Aurora

Banco relacional compatível com PostgreSQL e MySQL, com arquitetura própria da AWS.

Para a `orders-api`, a decisão inicial será:

```text
RDS for PostgreSQL
como baseline didática.
```

A próxima aula aprofundará:

- instance class;
- storage;
- subnet group;
- Security Group;
- parameter group;
- backup;
- Multi-AZ;
- replicas;
- encryption;
- maintenance;
- connection pool;
- migration;
- monitoring.

Nesta aula, nenhum endpoint ou senha será criado.

---

### Cache

ElastiCache fornece cache gerenciado. Ele não é source of truth e exige TTL, invalidation, encryption, subnet privada, Security Group restrito, metrics, eviction e fallback.

---

### NoSQL

DynamoDB oferece banco key-value e document com scaling gerenciado, TTL, streams, backups e encryption. A escolha depende do access pattern e não substitui PostgreSQL por hábito.

---

### Mensageria e eventos

SQS fornece filas com retry, visibility timeout e DLQ. SNS oferece pub/sub. EventBridge roteia eventos por regras. MSK mantém compatibilidade Kafka. Kinesis atende streaming AWS-native. A decisão considera ordering, retenção, throughput, replay, consumers e custo. Nenhuma migração do laboratório Kafka será realizada.

---

### Storage

S3 oferece object storage com Block Public Access, encryption, versioning e lifecycle. EBS fornece block storage, EFS oferece file storage compartilhado e AWS Backup orquestra policies de backup. ---

### Secrets e chaves

Secrets Manager trata credenciais rotacionáveis, Parameter Store trata parâmetros e KMS gerencia chaves e criptografia. Nenhum Secret será duplicado em image, values, ConfigMap, source ou evidence.

---

### Observabilidade e auditoria

CloudWatch fornece métricas, logs, alarms e dashboards; X-Ray oferece tracing; CloudTrail audita APIs; Config acompanha configuração; EventBridge roteia eventos; OpenTelemetry padroniza telemetry. A arquitetura exige logs estruturados, redaction, correlation ID, métricas, tracing, alarms, retenção e budget. CloudTrail não substitui logs da aplicação, nem CloudWatch substitui SLOs.

---

### Segurança gerenciada

GuardDuty, Security Hub, Inspector, Macie, Detective e IAM Access Analyzer ajudam a detectar ameaças, vulnerabilidades, exposição e permissões excessivas. Eles complementam, mas não substituem secure coding e least privilege.

---

### Pipeline para AWS

O fluxo conceitual será:

```text
GitHub Actions
→ OIDC
→ AWS STS
→ IAM Role temporária
→ ECR
→ deploy target
→ health
→ smoke test
→ evidence.
```

A trust policy precisa restringir:

- repository;
- branch ou environment;
- audience;
- subject;
- actions permitidas.

O pipeline não recebe:

- access key permanente;
- secret key permanente;
- administrator access;
- acesso irrestrito a todas as contas.

---

### Infraestrutura como código

A infraestrutura AWS pode ser modelada com:

- Terraform;
- AWS CloudFormation;
- AWS CDK;
- ferramentas equivalentes.

Helm permanece adequado para resources Kubernetes.

Boundaries:

```text
IaC:
VPC,
IAM,
EKS,
RDS,
ECR,
DNS,
observabilidade.

Helm:
resources da aplicação
dentro do Kubernetes.

pipeline:
orquestra validação,
promoção
e deploy.
```

Nenhuma ferramenta será escolhida como padrão nesta aula.

---

### Alta disponibilidade e recuperação

A arquitetura exige compute e banco multi-AZ, health checks, backup, restore test, RPO, RTO, alarms e runbooks. Para múltiplas Regions, as opções incluem backup and restore, pilot light, warm standby e active-active. Nenhuma segunda Region será criada.

---

### Custos na AWS

Cost Explorer, Budgets, Cost and Usage Report, tags, commitments, lifecycle e rightsizing apoiam governança. Drivers relevantes incluem compute, EKS, RDS, NAT, transfer, load balancers, telemetry, S3, snapshots e MSK. A métrica unitária continuará sendo custo por pedido, sem preços fixos no material.

---

### Arquitetura AWS de referência

A topologia conceitual será:

```text
Internet
   |
Route 53
   |
CloudFront / WAF
   |
ALB ou API Gateway
   |
Private subnets
   |
EKS, ECS/Fargate
ou PaaS
   |
+----------------------------------+
| RDS PostgreSQL                   |
| ElastiCache                      |
| SQS, SNS, EventBridge ou MSK     |
| S3                               |
| Secrets Manager / KMS            |
| CloudWatch / X-Ray               |
+----------------------------------+
```

O backend não possui IP público direto.

Dados permanecem em subnets privadas ou serviços com acesso privado controlado.

---

## Onde estamos na formação

A sequência oficial é:

```text
536:
Namespace RBAC conceitual.

537:
Cloud conceitos para backend.

538:
AWS visao backend.

539:
RDS PostgreSQL.

540:
Deploy AWS conceitual.
```

A aula 537 respondeu:

```text
quais capacidades
uma arquitetura cloud
precisa possuir?
```

A aula 538 responderá:

```text
quais serviços AWS
podem implementar
essas capacidades?
```

Nesta aula:

```text
Regions:
sim.

Availability Zones:
sim.

IAM:
sim.

STS:
sim.

VPC:
sim.

Security Groups:
sim.

Route 53:
sim.

CloudFront:
sim.

WAF:
sim.

ALB e NLB:
sim.

API Gateway:
sim.

ACM:
sim.

ECR:
sim.

EC2:
sim.

ECS:
sim.

Fargate:
sim.

EKS:
sim.

Lambda:
sim.

RDS:
conceitual.

Aurora:
conceitual.

ElastiCache:
sim.

DynamoDB:
sim.

SQS:
sim.

SNS:
sim.

EventBridge:
sim.

MSK:
sim.

Kinesis:
sim.

S3:
sim.

EBS:
sim.

EFS:
sim.

Secrets Manager:
sim.

KMS:
sim.

CloudWatch:
sim.

X-Ray:
sim.

CloudTrail:
sim.

recurso real:
não.
```

A regra central será:

```text
capacidade provider-neutral
é mapeada
para serviços AWS

com boundaries,
least privilege,
resiliência
e custo.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
cloud/aws
├── aws-backend-architecture.yaml
├── aws-service-mapping.yaml
├── aws-account-boundaries.yaml
├── aws-network-model.yaml
├── aws-identity-model.yaml
├── aws-data-services.yaml
├── aws-observability-model.yaml
├── aws-resilience-plan.yaml
├── aws-cost-governance-policy.yaml
├── aws-rds-postgresql-readiness.yaml
└── aws-adoption-roadmap.yaml

scripts/cloud/aws
├── verify-aws-cli.ps1
├── validate-aws-service-mapping.ps1
├── validate-aws-network-model.ps1
├── validate-aws-identity-model.ps1
├── validate-aws-data-services.ps1
├── validate-aws-resilience-plan.ps1
├── audit-aws-cost-drivers.ps1
├── generate-aws-decision-summary.ps1
└── collect-aws-concept-evidence.ps1

docs/devops/aws
├── AWS_GLOBAL_INFRASTRUCTURE.md
├── AWS_NETWORKING_FOR_BACKEND.md
├── AWS_IDENTITY_FOR_BACKEND.md
├── AWS_COMPUTE_OPTIONS.md
├── AWS_DATA_SERVICES.md
├── AWS_MESSAGING_OPTIONS.md
├── AWS_OBSERVABILITY_SECURITY.md
├── AWS_COST_MODEL.md
├── AWS_BACKEND_RUNBOOK.md
├── AWS_TEST_MATRIX.md
└── AWS_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
mapeamento de capacidades;

arquitetura AWS;

boundaries de conta;

modelo de VPC;

modelo de IAM;

opções de compute;

catálogo de dados;

observabilidade;

resiliência;

custos;

readiness para RDS;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline local;
2. revisar a arquitetura provider-neutral;
3. validar AWS CLI sem login;
4. mapear capacidades para serviços;
5. criar boundaries de contas;
6. modelar VPC;
7. modelar entrada;
8. modelar IAM;
9. modelar OIDC de pipeline;
10. comparar compute;
11. modelar ECR;
12. modelar banco;
13. modelar cache;
14. modelar mensageria;
15. modelar storage;
16. modelar Secrets;
17. modelar observabilidade;
18. modelar segurança;
19. definir HA;
20. definir DR;
21. definir custos;
22. criar readiness de RDS;
23. validar contratos;
24. simular falhas;
25. criar scripts;
26. criar docs;
27. criar roadmap;
28. coletar evidence;
29. executar gate;
30. commitar;
31. preparar a aula 539.

---

## Conceito essencial

### AWS Region

Área geográfica independente da AWS.

---

### Availability Zone

Domínio de falha dentro de uma Region.

---

### IAM Role

Identidade assumida temporariamente.

---

### AWS STS

Serviço de credenciais temporárias.

---

### Amazon VPC

Rede virtual isolada logicamente.

---

### Security Group

Firewall stateful associado a interfaces e recursos.

---

### Amazon ECR

Registro gerenciado de imagens de container.

---

### Amazon EKS

Kubernetes gerenciado.

---

### Amazon ECS

Orquestração de containers nativa da AWS.

---

### AWS Fargate

Compute serverless para containers.

---

### Amazon RDS

Banco relacional gerenciado.

---

### Amazon S3

Object storage.

---

### Amazon SQS

Fila gerenciada.

---

### Amazon SNS

Pub/sub gerenciado.

---

### Amazon CloudWatch

Métricas, logs, alarms e dashboards.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme que a aplicação permanece saudável.

---

### 2. Revisar a arquitetura provider-neutral

Abra:

```text
cloud/provider-neutral/backend-cloud-architecture.yaml
```

Liste as capacidades que precisam de mapeamento.

---

### 3. Validar AWS CLI sem autenticação

Execute:

```powershell
aws --version
```

O script:

```text
verify-aws-cli.ps1
```

valida apenas:

- comando disponível;
- versão;
- nenhum login;
- nenhuma chamada de conta;
- nenhuma leitura de credenciais;
- nenhuma operação remota.

---

### 4. Criar o mapeamento de serviços

Arquivo:

```text
cloud/aws/aws-service-mapping.yaml
```

Conteúdo:

```yaml
mapping:
  dns:
    primary:
      Route53

  edge:
    primary:
      CloudFront

  webProtection:
    primary:
      WAF

  layer7LoadBalancing:
    primary:
      ApplicationLoadBalancer

  apiManagement:
    option:
      APIGateway

  containerRegistry:
    primary:
      ECR

  kubernetes:
    option:
      EKS

  containerOrchestration:
    option:
      ECS

  serverlessContainers:
    option:
      Fargate

  functions:
    option:
      Lambda

  relationalDatabase:
    primary:
      RDSPostgreSQL

    alternative:
      AuroraPostgreSQLCompatible

  cache:
    primary:
      ElastiCache

  queue:
    primary:
      SQS

  publishSubscribe:
    primary:
      SNS

  eventBus:
    primary:
      EventBridge

  kafka:
    primary:
      MSK

  objectStorage:
    primary:
      S3

  secrets:
    primary:
      SecretsManager

  encryptionKeys:
    primary:
      KMS

  metricsLogs:
    primary:
      CloudWatch

  tracing:
    primary:
      XRay

  audit:
    primary:
      CloudTrail
```

---

### 5. Criar boundaries de contas

Arquivo:

```text
aws-account-boundaries.yaml
```

Conteúdo:

```yaml
accounts:
  management:
    workloads:
      forbidden

  security:
    centralizedSecurity:
      true

  logArchive:
    immutableLogs:
      required

  sharedServices:
    sharedNetworking:
      planned

  dev:
    productionData:
      forbidden

  hml:
    representativeConfiguration:
      required

  prod:
    approval:
      required

    multiAz:
      required

sharedCredentials:
  forbidden:
    true
```

---

### 6. Criar o modelo de VPC

Arquivo:

```text
aws-network-model.yaml
```

Conteúdo:

```yaml
vpc:
  availabilityZones:
    minimum:
      2

  subnets:
    public:
      purpose:
        entry

    privateApplication:
      purpose:
        compute

    isolatedData:
      purpose:
        database-cache-messaging

  routing:
    internetGateway:
      publicOnly

    natGateway:
      reviewed

    privateEndpoints:
      preferredForAwsServices

  security:
    publicDatabase:
      forbidden

    backendPublicIp:
      forbidden
```

---

### 7. Definir Security Groups

Registre:

```yaml
securityGroups:
  entry:
    inbound:
      - HTTPS-from-approved-sources

  application:
    inbound:
      - application-port-from-entry

  database:
    inbound:
      - PostgreSQL-from-application

  cache:
    inbound:
      - cache-port-from-application
```

Nenhum CIDR real será incluído.

---

### 8. Criar o modelo de identidade

Arquivo:

```text
aws-identity-model.yaml
```

Conteúdo:

```yaml
identity:
  humans:
    federation:
      required

    mfa:
      required

    longLivedAccessKey:
      forbidden

  githubActions:
    oidc:
      required

    roleSession:
      temporary

    administratorAccess:
      forbidden

  workloads:
    role:
      required

    staticAccessKey:
      forbidden

  policies:
    leastPrivilege:
      required

    wildcard:
      forbidden

    resourceScope:
      required
```

---

### 9. Modelar trust do pipeline

Registre os claims esperados:

```yaml
githubOidc:
  audience:
    sts.amazonaws.com

  repository:
    explicit:
      required

  branchOrEnvironment:
    explicit:
      required

  subject:
    restricted:
      true
```

Nenhuma trust policy real será aplicada.

---

### 10. Criar matriz de compute

Arquivo documental:

```text
AWS_COMPUTE_OPTIONS.md
```

Compare:

- EC2;
- ECS on EC2;
- ECS on Fargate;
- EKS with nodes;
- EKS on Fargate;
- Lambda;
- App Runner;
- Elastic Beanstalk.

Critérios:

- controle;
- operação;
- scaling;
- startup;
- protocolo;
- observabilidade;
- portabilidade;
- custo;
- skill;
- time-to-market.

---

### 11. Definir ECR

No architecture file:

```yaml
ecr:
  immutableTags:
    required

  imageDigest:
    required

  scan:
    required

  lifecycle:
    required

  encryption:
    required

  crossEnvironmentPromotion:
    required
```

---

### 12. Criar catálogo de dados AWS

Arquivo:

```text
aws-data-services.yaml
```

Conteúdo:

```yaml
data:
  orders:
    service:
      RDSPostgreSQL

    private:
      true

    multiAz:
      required

    encrypted:
      true

    backup:
      required

  cache:
    service:
      ElastiCache

    sourceOfTruth:
      false

  messaging:
    kafkaOption:
      MSK

    queueOption:
      SQS

    pubSubOption:
      SNS

    eventRoutingOption:
      EventBridge

  objects:
    service:
      S3

    publicAccess:
      forbidden

    versioning:
      required
```

---

### 13. Criar readiness de RDS

Arquivo:

```text
aws-rds-postgresql-readiness.yaml
```

Inclua:

```yaml
rdsPostgreSQL:
  engineVersion:
    decisionRequired

  instanceClass:
    capacityStudyRequired

  storage:
    growthStudyRequired

  subnetGroup:
    privateDataSubnetsRequired

  securityGroup:
    applicationOnly

  multiAz:
    requiredForProduction

  backupRetention:
    decisionRequired

  deletionProtection:
    requiredForProduction

  encryption:
    required

  parameterGroup:
    reviewRequired

  credentials:
    secretManagerRequired

  migration:
    flywayOrLiquibaseRequired

  pool:
    totalConnectionBudgetRequired

  monitoring:
    required
```

---

### 14. Criar o modelo de observabilidade

Arquivo:

```text
aws-observability-model.yaml
```

Conteúdo:

```yaml
observability:
  cloudWatch:
    metrics:
      required

    logs:
      required

    alarms:
      required

    dashboards:
      required

  tracing:
    xRayOrOpenTelemetry:
      required

  audit:
    cloudTrail:
      required

  configuration:
    awsConfig:
      planned

  retention:
    explicit:
      required

  redaction:
    required
```

---

### 15. Criar plano de resiliência

Arquivo:

```text
aws-resilience-plan.yaml
```

Inclua:

```yaml
resilience:
  region:
    primary:
      decisionRequired

  availabilityZones:
    minimum:
      2

  compute:
    minimumInstances:
      2

  database:
    multiAz:
      required

  backups:
    restoreTest:
      required

  recovery:
    database:
      rpoMinutes:
        15

      rtoMinutes:
        60

  secondRegion:
    strategy:
      notImplemented

    options:
      - backup-and-restore
      - pilot-light
      - warm-standby
      - active-active
```

---

### 16. Criar policy de custos

Arquivo:

```text
aws-cost-governance-policy.yaml
```

Conteúdo:

```yaml
cost:
  budgets:
    required

  alerts:
    required

  costAllocationTags:
    required:
      - application
      - environment
      - owner-role
      - cost-center

  review:
    monthly

  unitCost:
    cost-per-order

  drivers:
    - compute
    - rds
    - nat-gateway
    - data-transfer
    - load-balancer
    - logs
    - snapshots
    - messaging
```

---

### 17. Simular falha de AZ

Resultado esperado:

- ALB continua atendendo targets de outra AZ;
- compute mantém capacidade mínima;
- RDS Multi-AZ inicia failover conforme o serviço;
- alarms são acionados;
- deploys são bloqueados durante incidente;
- runbook registra o retorno.

---

### 18. Simular IAM denied

Cenário:

```text
pipeline não consegue
publicar no ECR.
```

Diagnóstico:

- role assumida;
- trust policy;
- action;
- resource ARN;
- condition;
- session;
- CloudTrail;
- nenhum fallback para access key.

---

### 19. Simular esgotamento de conexões

Cenário:

```text
HPA aumenta Pods;

pool total supera
a capacidade do RDS.
```

Resposta:

- limitar pool por réplica;
- revisar maxReplicas;
- usar proxy quando justificado;
- observar active connections;
- aplicar backpressure;
- ajustar capacidade.

---

### 20. Simular fila acumulando

Resposta:

- medir queue depth;
- verificar consumers;
- revisar visibility timeout;
- revisar retry;
- revisar dead-letter;
- aumentar workers dentro da capacidade;
- verificar dependências downstream.

---

### 21. Simular custo inesperado

Investigue:

- NAT Gateway;
- egress;
- CloudWatch Logs;
- RDS;
- MSK;
- load balancer;
- snapshots;
- S3 lifecycle;
- resources ociosos;
- ambientes abandonados.

---

### 22. Criar roadmap AWS

Arquivo:

```text
aws-adoption-roadmap.yaml
```

Fases:

```yaml
roadmap:
  - phase:
      account-foundation

    outcomes:
      - boundaries
      - federation
      - logging
      - budgets

  - phase:
      network

    outcomes:
      - vpc
      - subnets
      - routing
      - security-groups
      - private-endpoints

  - phase:
      data

    outcomes:
      - rds
      - cache
      - messaging
      - s3
      - secrets

  - phase:
      runtime

    outcomes:
      - ecr
      - compute
      - entry
      - autoscaling

  - phase:
      operations

    outcomes:
      - metrics
      - logs
      - traces
      - security
      - backups
```

---

### 23. Criar scripts de validação

Os scripts precisam:

- funcionar offline;
- não executar `aws sts get-caller-identity`;
- não ler credential files;
- não criar resources;
- não consultar preço automaticamente;
- validar YAML;
- bloquear access keys;
- bloquear account IDs reais;
- bloquear ARNs reais quando não sanitizados;
- bloquear endpoints reais;
- gerar evidence provider-specific sem credenciais.

---

### 24. Criar decision summary

O script:

```text
generate-aws-decision-summary.ps1
```

produz:

- Region criteria;
- account boundaries;
- VPC model;
- identity model;
- compute options;
- data services;
- messaging options;
- observability;
- resilience;
- cost drivers;
- decisions abertas para RDS;
- nenhum resource criado.

---

### 25. Criar evidence

Arquivo:

```text
aws-backend-concept-evidence.json.
```

Campos permitidos:

- capability mappings;
- account boundary count;
- minimum AZs;
- backend public IP false;
- static access key false;
- GitHub OIDC required;
- compute options;
- ECR controls;
- RDS readiness checks;
- messaging options;
- S3 public access false;
- CloudWatch required;
- CloudTrail required;
- RPO;
- RTO;
- cost drivers;
- actual AWS resources zero;
- timestamp.

---

### 26. Criar documentação

#### `AWS_GLOBAL_INFRASTRUCTURE.md`

Explique Regions, AZs, edge e accounts.

#### `AWS_NETWORKING_FOR_BACKEND.md`

Explique VPC, subnets, routes, SGs, endpoints e egress.

#### `AWS_IDENTITY_FOR_BACKEND.md`

Explique IAM, STS, federation, OIDC e workload roles.

#### `AWS_COMPUTE_OPTIONS.md`

Compare EC2, ECS, Fargate, EKS, Lambda e PaaS.

#### `AWS_DATA_SERVICES.md`

Explique RDS, Aurora, DynamoDB, ElastiCache e storage.

#### `AWS_MESSAGING_OPTIONS.md`

Compare SQS, SNS, EventBridge, MSK e Kinesis.

#### `AWS_OBSERVABILITY_SECURITY.md`

Explique CloudWatch, X-Ray, CloudTrail e serviços de segurança.

#### `AWS_COST_MODEL.md`

Explique Budgets, Cost Explorer, tags e drivers.

---

### 27. Criar runbook

Arquivo:

```text
AWS_BACKEND_RUNBOOK.md
```

Passos:

1. escolher Region;
2. validar account boundary;
3. validar identidade;
4. validar VPC;
5. validar entrada;
6. validar compute;
7. validar ECR;
8. validar dados;
9. validar Secrets;
10. validar observabilidade;
11. validar RPO e RTO;
12. validar custos;
13. simular falhas;
14. aprovar;
15. provisionar por IaC em aula futura.

---

### 28. Criar test matrix

Arquivo:

```text
AWS_TEST_MATRIX.md
```

Cenários:

- nenhuma access key;
- OIDC obrigatório;
- backend sem IP público;
- duas AZs;
- banco privado;
- SG do banco restrito;
- ECR por digest;
- S3 Block Public Access;
- Secrets Manager;
- KMS;
- CloudWatch;
- CloudTrail;
- falha de AZ;
- IAM denied;
- pool esgotado;
- fila acumulada;
- restore test;
- budget alert;
- recurso sem owner;
- resource real detectado.

---

### 29. Criar troubleshooting

Arquivo:

```text
AWS_TROUBLESHOOTING.md
```

Inclua:

- Region incorreta;
- quota atingida;
- subnet sem rota;
- SG bloqueando tráfego;
- NAT caro;
- ECR denied;
- image pull denied;
- IAM trust incorreta;
- RDS sem conexão;
- pool esgotado;
- SQS acumulando;
- MSK indisponível;
- S3 access denied;
- Secret denied;
- CloudWatch sem logs;
- CloudTrail ausente;
- custo inesperado;
- recurso em conta errada;
- access key detectada.

---

### 30. Executar validações

Execute:

```powershell
.\scripts\cloud\aws\verify-aws-cli.ps1

.\scripts\cloud\aws\validate-aws-service-mapping.ps1

.\scripts\cloud\aws\validate-aws-network-model.ps1

.\scripts\cloud\aws\validate-aws-identity-model.ps1

.\scripts\cloud\aws\validate-aws-data-services.ps1

.\scripts\cloud\aws\validate-aws-resilience-plan.ps1

.\scripts\cloud\aws\audit-aws-cost-drivers.ps1

.\scripts\cloud\aws\generate-aws-decision-summary.ps1

.\scripts\cloud\aws\collect-aws-concept-evidence.ps1
```

---

### 31. Executar gate final

Finalize:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme:

- aplicação local saudável;
- nenhum login AWS;
- nenhuma conta consultada;
- nenhuma credencial;
- nenhum ARN real;
- nenhum endpoint real;
- nenhum resource criado;
- readiness de RDS pronta para a aula 539.

---

## Entendendo o que foi feito

### Capacidades ganharam serviços AWS

O modelo provider-neutral foi preservado.

### Conta ganhou papel de boundary

Ambiente e blast radius deixaram de depender apenas de namespace.

### IAM ganhou identidade temporária

Pipeline e workload não receberam access key fixa.

### VPC ganhou zonas claras

Entrada, aplicação e dados foram separados.

### Compute ganhou opções

EKS deixou de ser a única resposta possível.

### Dados ganharam catálogo AWS

RDS, cache, mensageria e storage receberam papéis distintos.

### Observabilidade ganhou serviços concretos

CloudWatch, X-Ray e CloudTrail foram separados por responsabilidade.

### Custos ganharam drivers AWS

NAT, RDS, logs, transfer e messaging entraram no modelo.

### RDS ganhou checklist de readiness

A próxima aula poderá aprofundar PostgreSQL sem começar por um clique no console.

---

## Erros comuns importantes

### Criar access key para o pipeline

Use OIDC, STS e role temporária.

### Colocar backend em subnet pública

Use uma camada de entrada e compute privado.

### Abrir PostgreSQL para a internet

Restrinja o Security Group à aplicação.

### Escolher EKS por hábito

Compare operação, controle e custo com ECS, Fargate e PaaS.

### Tratar IAM Role como permissão automática

Role ainda precisa de trust e permission policies corretas.

### Usar S3 público por conveniência

Use acesso privado, signed URLs e policies mínimas.

### Ignorar NAT e data transfer

Eles podem ser drivers relevantes de custo.

### Usar CloudWatch sem retenção

Logs podem crescer continuamente.

### Escalar Pods sem calcular RDS

O pool pode esgotar conexões.

### Tratar Multi-AZ como DR regional

Multi-AZ não substitui estratégia de outra Region.

### Criar RDS nesta aula

A aula 539 possui esse objetivo.

---

## Comandos úteis

### Validar AWS CLI

```powershell
aws --version
```

### Validar mapeamento

```powershell
.\scripts\cloud\aws\validate-aws-service-mapping.ps1
```

### Validar rede

```powershell
.\scripts\cloud\aws\validate-aws-network-model.ps1
```

### Validar identidade

```powershell
.\scripts\cloud\aws\validate-aws-identity-model.ps1
```

### Gerar summary

```powershell
.\scripts\cloud\aws\generate-aws-decision-summary.ps1
```

---

## Exercício guiado

### Parte 1 — Global infrastructure

Defina critérios de Region e AZs.

### Parte 2 — Accounts

Modele boundaries para ambientes.

### Parte 3 — Network

Crie VPC, subnets e Security Groups conceituais.

### Parte 4 — Identity

Modele IAM, STS e OIDC.

### Parte 5 — Compute

Compare EC2, ECS, Fargate, EKS e Lambda.

### Parte 6 — Data

Mapeie RDS, ElastiCache, S3 e DynamoDB.

### Parte 7 — Messaging

Compare SQS, SNS, EventBridge, MSK e Kinesis.

### Parte 8 — Operations

Modele CloudWatch, X-Ray e CloudTrail.

### Parte 9 — Resilience and cost

Defina Multi-AZ, RPO, RTO e budgets.

### Parte 10 — RDS readiness

Prepare as decisões da aula 539.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 537 foi preservada;
- ponte para a aula 539 está correta;
- Regions, Availability Zones e edge foram explicados;
- contas foram tratadas como boundaries;
- IAM, Roles, policies, trust e STS foram definidos;
- federation, MFA, OIDC e credenciais temporárias foram priorizados;
- access keys permanentes foram proibidas;
- VPC, subnets, route tables, IGW, NAT, Security Groups e endpoints foram explicados;
- backend e banco públicos foram proibidos;
- Route 53, CloudFront, WAF, Shield, ALB, NLB, API Gateway e ACM foram mapeados;
- ECR foi definido com digest, scanning e lifecycle;
- EC2, ECS, Fargate, EKS, Lambda, App Runner e Elastic Beanstalk foram comparados;
- resources Kubernetes foram relacionados ao EKS sem implementação;
- RDS e Aurora foram diferenciados;
- ElastiCache e DynamoDB foram mapeados;
- SQS, SNS, EventBridge, MSK e Kinesis foram comparados;
- S3, EBS, EFS e AWS Backup foram diferenciados;
- Secrets Manager, Parameter Store e KMS foram definidos;
- CloudWatch, X-Ray, CloudTrail e Config foram mapeados;
- segurança gerenciada foi apresentada sem substituir least privilege;
- pipeline GitHub OIDC para STS foi modelado;
- IaC, Helm e pipeline receberam boundaries;
- Multi-AZ, DR, RPO e RTO foram preservados;
- custos AWS e drivers principais foram modelados;
- arquitetura AWS de referência foi criada;
- baseline local permaneceu saudável;
- arquitetura provider-neutral foi usada como entrada;
- AWS CLI foi validada sem login;
- nenhum credential file foi lido;
- mapeamento de serviços foi criado;
- boundaries de contas foram criadas;
- VPC multi-AZ foi modelada;
- Security Groups foram modelados sem CIDR real;
- modelo de identidade foi criado;
- trust de OIDC foi planejado;
- matriz de compute foi criada;
- ECR controls foram definidos;
- catálogo de dados AWS foi criado;
- readiness de RDS foi criada;
- observabilidade foi modelada;
- resiliência foi modelada;
- policy de custos foi criada;
- falha de AZ foi simulada;
- IAM denied foi simulado;
- esgotamento de conexões foi simulado;
- fila acumulada foi simulada;
- custo inesperado foi simulado;
- roadmap AWS foi criado;
- scripts funcionam offline;
- scripts bloqueiam access keys, account IDs e endpoints reais;
- decision summary foi criado;
- evidence foi sanitizada;
- actual AWS resources ficou em zero;
- documentação, runbook, test matrix e troubleshooting foram criados;
- nenhuma conta, credencial, VPC, EKS, ECS, S3 ou RDS real foi criado;
- RDS PostgreSQL não foi implementado antecipadamente;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/aws `
  scripts/cloud/aws `
  docs/devops/aws `
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
      "AKIA|ASIA|secret.access|account.id|arn:aws:|amazonaws.com"
```

Referências conceituais podem aparecer.

Credenciais, account IDs, ARNs e endpoints reais não podem.

Commit recomendado:

```powershell
git commit -m "docs(m17): mapear backend para AWS"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access key;
- secret key;
- session token;
- account ID;
- ARN real;
- endpoint real;
- credencial OIDC;
- kubeconfig;
- resource criado;
- state de IaC;
- banco RDS da aula 539.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a arquitetura provider-neutral foi mapeada para serviços AWS.

O modelo passou a relacionar:

```text
Region e AZ;

accounts;

IAM e STS;

VPC;

Route 53 e entry;

ECR;

compute;

data;

messaging;

storage;

observability;

security;

cost.
```

Você comprovou que a conta é uma boundary importante; IAM Roles e STS substituem access keys permanentes; VPC separa entrada, aplicação e dados; EKS é uma opção, não uma obrigação; ECR preserva imagens por digest; RDS, ElastiCache, SQS, SNS, EventBridge, MSK, S3 e outros serviços possuem responsabilidades específicas; CloudWatch, X-Ray e CloudTrail tratam sinais diferentes; Multi-AZ não substitui DR; e custos como NAT, RDS, transfer e logs precisam entrar no design.

A próxima aula será:

```text
539 - M17.34 - RDS PostgreSQL
```

Nela, você irá aprofundar PostgreSQL gerenciado na AWS, incluindo subnet group, Security Group, Multi-AZ, storage, backups, encryption, credentials, migrations, connection pool, monitoring e recuperação.

Nenhuma instância RDS, subnet group, parameter group, Secret ou endpoint PostgreSQL foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Mapeei capacidades para serviços AWS.
- [ ] Modelei boundaries de contas.
- [ ] Modelei VPC e Security Groups.
- [ ] Modelei IAM, STS e OIDC.
- [ ] Comparei opções de compute.
- [ ] Modelei dados, mensageria e storage.
- [ ] Defini observabilidade, resiliência e custos.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A arquitetura começou por um produto AWS

Retorne à capacidade provider-neutral.

### O pipeline pede access key

Modele OIDC, STS e IAM Role.

### O backend possui IP público

Revise ALB, API Gateway e subnets privadas.

### O banco aceita origem pública

Restrinja o Security Group à aplicação.

### O EKS virou escolha automática

Compare ECS, Fargate, PaaS e custo operacional.

### A aplicação não publica imagem no ECR

Revise trust, role, repository policy e actions.

### O HPA esgota conexões

Revise maxReplicas, pool e capacidade do RDS.

### A fila cresce

Revise consumers, visibility timeout, retry e DLQ.

### O custo cresce sem tráfego

Investigue NAT, logs, snapshots, transfer e recursos ociosos.

### Uma instância RDS foi criada

Remova a antecipação e preserve para a aula 539.

---

## Perguntas de revisão

1. O que é AWS Region?
2. O que é Availability Zone?
3. Por que separar contas?
4. O que é IAM Role?
5. Para que serve STS?
6. O que é VPC?
7. Qual a função de Security Group?
8. Para que serve Route 53?
9. Qual a diferença entre ALB e NLB?
10. O que é ECR?
11. Qual a diferença entre ECS e EKS?
12. O que é Fargate?
13. O que é RDS?
14. Para que serve SQS?
15. Qual a diferença entre SNS e EventBridge?
16. Para que serve S3?
17. Qual a função de Secrets Manager e KMS?
18. Qual a diferença entre CloudWatch e CloudTrail?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Área geográfica da AWS.
2. Domínio de falha regional.
3. Reduzir blast radius.
4. Identidade temporária assumível.
5. Emitir sessões temporárias.
6. Rede virtual.
7. Firewall stateful.
8. DNS.
9. Camada 7 e camada 4.
10. Registry de containers.
11. Orquestração AWS e Kubernetes.
12. Compute serverless de containers.
13. Banco relacional gerenciado.
14. Fila gerenciada.
15. Pub/sub e event routing.
16. Object storage.
17. Secrets e chaves.
18. Telemetry e auditoria de API.
19. Recursos AWS reais e RDS.
20. RDS PostgreSQL.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 538 - M17.33 - AWS visao backend

- Continuei após Cloud conceitos para backend.
- Mapeei a arquitetura provider-neutral para AWS.
- Estudei Regions, Availability Zones e edge.
- Modelei contas como boundaries de ambiente e blast radius.
- Estudei IAM, Roles, policies, trust e STS.
- Planejei federation, MFA e GitHub OIDC.
- Proibi access keys permanentes para pipeline e workload.
- Modelei VPC, subnets, routes, Security Groups e private endpoints.
- Modelei Route 53, CloudFront, WAF, ALB, NLB, API Gateway e ACM.
- Modelei ECR com digest, scanning e lifecycle.
- Comparei EC2, ECS, Fargate, EKS, Lambda e opções PaaS.
- Relacionei resources Kubernetes ao EKS sem implementação.
- Diferenciei RDS e Aurora.
- Modelei ElastiCache e DynamoDB.
- Comparei SQS, SNS, EventBridge, MSK e Kinesis.
- Diferenciei S3, EBS e EFS.
- Modelei Secrets Manager, Parameter Store e KMS.
- Modelei CloudWatch, X-Ray, CloudTrail e Config.
- Relacionei segurança gerenciada ao least privilege.
- Separei boundaries de IaC, Helm e pipeline.
- Modelei Multi-AZ, RPO, RTO e estratégias de DR.
- Modelei Budgets, tags e drivers de custo AWS.
- Simulei falha de AZ, IAM denied, pool esgotado e fila acumulada.
- Criei readiness de RDS PostgreSQL para a próxima aula.
- Criei roadmap, scripts e evidence sanitizada.
- Não criei conta, credencial ou recurso AWS.
- Próxima aula: RDS PostgreSQL.
```

---

## Referência técnica curta

- AWS Global Infrastructure.
- AWS Identity and Access Management.
- AWS Security Token Service.
- Amazon Virtual Private Cloud.
- Amazon Elastic Container Registry.
- Amazon ECS and AWS Fargate.
- Amazon Elastic Kubernetes Service.
- Amazon RDS and Amazon Aurora.
- AWS Messaging Services.
- Amazon CloudWatch and AWS CloudTrail.

Regra final:

```text
a visão AWS para backend começa pelo mapeamento das capacidades provider-neutral: Regions e Availability Zones definem domínios de falha, contas reduzem blast radius, VPC separa subnets públicas, privadas e de dados, Route 53, edge, WAF e load balancers controlam a entrada, e o backend permanece sem IP público; IAM Roles, federation, GitHub OIDC e STS fornecem sessões temporárias para pessoas, pipelines e workloads sem access keys permanentes; ECR armazena imagens por digest, enquanto EC2, ECS, Fargate, EKS, Lambda e PaaS representam trade-offs diferentes de controle e operação; RDS, Aurora, ElastiCache, DynamoDB, SQS, SNS, EventBridge, MSK, Kinesis, S3, EBS e EFS implementam responsabilidades específicas de dados e integração; Secrets Manager, KMS, CloudWatch, X-Ray, CloudTrail, security services, Multi-AZ, backups, RPO, RTO, budgets e cost allocation completam o contrato operacional; nenhum recurso, credencial ou endpoint AWS é criado, deixando para a aula 539 o aprofundamento seguro de RDS PostgreSQL.
```
