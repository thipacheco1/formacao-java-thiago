# 544 - M17.39 - Observacoes de seguranca cloud

## Apresentação da aula

Na aula 543, você estruturou custos cloud como requisito arquitetural.

O modelo passou a incluir:

```text
drivers de custo;

tags;

owners;

budgets;

forecasts;

anomalies;

unit economics;

rightsizing;

retention;

data transfer;

commitment readiness.
```

A aula também preservou uma regra importante:

```text
economia
não pode remover
segurança,
backup,
alta disponibilidade
ou recuperação

sem uma decisão explícita
de risco.
```

Agora a formação precisa consolidar os controles de segurança que acompanham toda a arquitetura cloud construída até aqui.

A aplicação `orders-api` já possui conceitos de:

- containers;
- pipeline;
- registry;
- Kubernetes;
- Ingress;
- ConfigMap;
- Secret;
- probes;
- requests e limits;
- HPA;
- volumes;
- Helm;
- Namespace;
- RBAC;
- RDS;
- SQS e SNS;
- Redis;
- S3;
- custos.

A pergunta central desta aula será:

```text
como proteger
identidades,
rede,
dados,
workloads,
pipeline
e operação cloud

sem depender
de um único produto
ou de uma única barreira?
```

A resposta será construída com defesa em profundidade.

Defesa em profundidade significa usar controles complementares.

Exemplo:

```text
identidade forte;

menor privilégio;

rede segmentada;

criptografia;

logging;

detecção;

backup;

resposta.
```

Uma falha isolada não deve entregar todo o ambiente.

A regra central será:

```text
segurança cloud
é responsabilidade contínua;

não é configuração
executada uma vez.
```

Nesta aula, nenhum recurso cloud real será criado ou alterado.

Não haverá:

- conta AWS;
- conta Azure;
- projeto de cloud;
- access key;
- secret key;
- role real;
- VPC real;
- Security Group real;
- WAF real;
- bucket real;
- banco real;
- cluster real;
- scanner remoto;
- policy aplicada;
- incidente real;
- dado corporativo;
- cobrança;
- acesso a billing;
- acesso a logs reais.

Você criará:

- threat model;
- catálogo de ativos;
- trust boundaries;
- política de identidade;
- política de rede;
- política de dados;
- política de secrets;
- política de supply chain;
- política de logging e auditoria;
- controles preventivos, detectivos e responsivos;
- runbook de incidente;
- checklist de postura;
- scripts offline;
- evidence sanitizada.

A próxima aula será:

```text
545 - M17.40 - Deploy em ambiente simples
```

Por isso, esta aula preparará os gates de segurança necessários para um deploy simples, mas não executará o deploy antecipadamente.

---

## Onde estamos na formação

A sequência oficial é:

```text
542:
Object Storage S3 conceitual.

543:
Custos cloud.

544:
Observacoes de seguranca cloud.

545:
Deploy em ambiente simples.

546:
Checklist de validacao do deploy.
```

A aula 543 respondeu:

```text
como medir
e otimizar custos

sem violar
confiabilidade?
```

A aula 544 responderá:

```text
quais controles mínimos
precisam proteger

identidades,
rede,
dados,
workloads
e operação

antes de um deploy?
```

Nesta aula:

```text
shared responsibility:
sim.

threat modeling:
sim.

asset inventory:
sim.

trust boundaries:
sim.

IAM:
sim.

federation:
sim.

MFA:
sim.

least privilege:
sim.

break-glass:
sim.

secrets:
sim.

encryption:
sim.

network segmentation:
sim.

egress control:
sim.

WAF:
conceitual.

DDoS:
conceitual.

logging:
sim.

audit:
sim.

CSPM:
conceitual.

supply chain:
sim.

SBOM:
sim.

image signing:
sim.

IaC scanning:
sim.

backup security:
sim.

incident response:
sim.

resource real:
não.

deploy:
não.
```

A regra operacional será:

```text
identificar;

proteger;

detectar;

responder;

recuperar;

revisar.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
cloud/security
├── cloud-security-baseline.yaml
├── cloud-asset-inventory.yaml
├── cloud-threat-model.yaml
├── cloud-trust-boundaries.yaml
├── cloud-identity-security-policy.yaml
├── cloud-network-security-policy.yaml
├── cloud-data-security-policy.yaml
├── cloud-secrets-security-policy.yaml
├── cloud-workload-security-policy.yaml
├── cloud-supply-chain-policy.yaml
├── cloud-logging-audit-policy.yaml
├── cloud-backup-recovery-security-policy.yaml
├── cloud-incident-response-plan.yaml
├── cloud-control-matrix.yaml
├── cloud-security-exception-policy.yaml
└── cloud-security-readiness-checklist.yaml

scripts/cloud/security
├── validate-cloud-security-baseline.ps1
├── validate-asset-inventory.ps1
├── validate-threat-model.ps1
├── validate-identity-policy.ps1
├── validate-network-policy.ps1
├── validate-data-policy.ps1
├── validate-supply-chain-policy.ps1
├── scan-repository-secrets.ps1
├── scan-cloud-manifests.ps1
├── audit-security-exceptions.ps1
├── simulate-credential-leak.ps1
├── simulate-public-exposure.ps1
├── simulate-ransomware-recovery.ps1
├── generate-security-decision-summary.ps1
└── collect-cloud-security-evidence.ps1

docs/devops/cloud-security
├── CLOUD_SHARED_RESPONSIBILITY.md
├── CLOUD_THREAT_MODEL.md
├── CLOUD_IDENTITY_SECURITY.md
├── CLOUD_NETWORK_SECURITY.md
├── CLOUD_DATA_SECURITY.md
├── CLOUD_WORKLOAD_SECURITY.md
├── CLOUD_SUPPLY_CHAIN_SECURITY.md
├── CLOUD_LOGGING_AND_DETECTION.md
├── CLOUD_BACKUP_AND_RECOVERY_SECURITY.md
├── CLOUD_INCIDENT_RESPONSE.md
├── CLOUD_SECURITY_TEST_MATRIX.md
└── CLOUD_SECURITY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
ativos catalogados;

ameaças priorizadas;

trust boundaries;

identidade protegida;

rede segmentada;

dados classificados;

secrets controlados;

pipeline protegido;

workloads endurecidos;

logging e detecção;

backup recuperável;

incidente ensaiado;

exceções governadas;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline;
2. definir shared responsibility;
3. inventariar ativos;
4. classificar dados;
5. identificar trust boundaries;
6. criar threat model;
7. classificar ameaças;
8. definir controles;
9. criar política de identidade;
10. criar política de rede;
11. criar política de dados;
12. criar política de secrets;
13. criar política de workloads;
14. criar política de supply chain;
15. criar política de logging;
16. criar política de backup;
17. criar plano de incidente;
18. criar matriz de controles;
19. criar política de exceções;
20. escanear o repositório;
21. escanear manifests;
22. simular vazamento;
23. simular exposição pública;
24. simular recuperação;
25. validar readiness;
26. criar documentação;
27. coletar evidence;
28. executar gate;
29. commitar;
30. preparar a aula 545.

---

## Conceito essencial

### Shared responsibility

Divisão de responsabilidades entre provedor e cliente.

A divisão varia conforme o modelo de serviço.

---

### Asset

Recurso que possui valor e precisa de proteção.

Exemplos:

- identidade;
- dado;
- código;
- imagem;
- pipeline;
- banco;
- fila;
- bucket;
- chave;
- log;
- backup.

---

### Threat

Evento ou agente capaz de causar impacto.

---

### Vulnerability

Fraqueza que pode ser explorada.

---

### Risk

Combinação de probabilidade, impacto e contexto.

---

### Control

Medida usada para reduzir risco.

---

### Trust boundary

Ponto onde identidade, privilégio, rede ou responsabilidade mudam.

---

### Preventive control

Controle que busca impedir o evento.

---

### Detective control

Controle que busca identificar o evento.

---

### Responsive control

Controle usado para conter e tratar o evento.

---

### Recovery control

Controle usado para restaurar operação e dados.

---

### Least privilege

Concessão do mínimo necessário pelo menor período possível.

---

### Defense in depth

Uso de múltiplas camadas de proteção.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- aplicação saudável;
- nenhum recurso cloud real;
- adapters AWS desabilitados;
- Secrets sem conteúdo real;
- RBAC de auditoria limitado;
- Git sem alterações inesperadas.

---

### 2. Definir responsabilidade compartilhada

Arquivo:

```text
cloud-security-baseline.yaml
```

Inclua:

```yaml
security:
  sharedResponsibility:
    required

  defenseInDepth:
    required

  leastPrivilege:
    required

  encryption:
    inTransit:
      required

    atRest:
      required

  logging:
    required

  backup:
    required

  incidentResponse:
    required

  realResources:
    zero
```

O provedor protege partes da infraestrutura.

A equipe continua responsável por:

- identidade;
- configuração;
- dados;
- aplicações;
- permissões;
- secrets;
- código;
- observabilidade;
- retenção;
- recuperação;
- incidentes.

---

### 3. Criar inventário de ativos

Arquivo:

```text
cloud-asset-inventory.yaml
```

Conteúdo:

```yaml
assets:
  - name:
      source-code

    owner:
      team-orders

    classification:
      internal

    criticality:
      high

  - name:
      container-image

    owner:
      platform-team

    classification:
      internal

    criticality:
      high

  - name:
      order-database

    owner:
      team-orders

    classification:
      restricted

    criticality:
      critical

  - name:
      order-events

    owner:
      team-orders

    classification:
      confidential

    criticality:
      high

  - name:
      customer-documents

    owner:
      team-orders

    classification:
      confidential

    criticality:
      high

  - name:
      audit-logs

    owner:
      security-operations

    classification:
      restricted

    criticality:
      critical
```

Todo ativo precisa de:

- owner;
- classificação;
- criticidade;
- localização lógica;
- retenção;
- backup;
- controles;
- dependências.

---

### 4. Classificar dados

A baseline usará:

```text
public;

internal;

confidential;

restricted.
```

#### Public

Pode ser exposto conforme aprovação.

#### Internal

Uso interno sem exposição pública.

#### Confidential

Pode causar impacto se exposto.

#### Restricted

Exige controles mais fortes por risco, contrato ou regulação.

A classificação influencia:

- IAM;
- encryption;
- logging;
- região;
- retenção;
- backup;
- compartilhamento;
- incident response.

---

### 5. Identificar trust boundaries

Arquivo:

```text
cloud-trust-boundaries.yaml
```

Conteúdo:

```yaml
boundaries:
  - from:
      internet

    to:
      public-entry

    controls:
      - tls
      - waf
      - rate-limit
      - authentication

  - from:
      public-entry

    to:
      private-application

    controls:
      - security-group
      - identity
      - allowlisted-port

  - from:
      private-application

    to:
      private-data

    controls:
      - workload-identity
      - security-group
      - encryption
      - least-privilege

  - from:
      pipeline

    to:
      cloud-control-plane

    controls:
      - oidc
      - temporary-credential
      - approval
      - audit

  - from:
      operator

    to:
      production

    controls:
      - federation
      - mfa
      - role-session
      - break-glass-policy
```

---

### 6. Criar threat model

Arquivo:

```text
cloud-threat-model.yaml
```

Use categorias:

```text
spoofing;

tampering;

repudiation;

information-disclosure;

denial-of-service;

elevation-of-privilege.
```

Exemplo:

```yaml
threats:
  - id:
      THR-IDENTITY-001

    scenario:
      stolen-static-access-key

    category:
      spoofing

    impact:
      critical

    likelihood:
      medium

    controls:
      preventive:
        - oidc
        - temporary-credentials
        - no-static-keys

      detective:
        - audit-logs
        - anomaly-detection

      responsive:
        - revoke-session
        - disable-role-trust
        - incident-runbook
```

---

### 7. Priorizar riscos

Uma matriz simples pode usar:

```text
likelihood:
low,
medium,
high.

impact:
low,
medium,
high,
critical.
```

O nível não substitui análise.

Registre:

- cenário;
- ativo;
- ameaça;
- vulnerabilidade;
- impacto;
- probabilidade;
- controles;
- owner;
- risco residual;
- prazo;
- evidência.

---

### 8. Criar política de identidade

Arquivo:

```text
cloud-identity-security-policy.yaml
```

Conteúdo:

```yaml
identity:
  humans:
    federation:
      required

    mfa:
      required

    sharedAccount:
      forbidden

    longLivedAccessKey:
      forbidden

  pipelines:
    oidc:
      required

    temporaryCredential:
      required

    administratorAccess:
      forbidden

  workloads:
    workloadIdentity:
      required

    staticCredential:
      forbidden

  authorization:
    leastPrivilege:
      required

    wildcard:
      forbidden

    explicitResource:
      required

  review:
    access:
      quarterly

  inactiveIdentity:
    revoke:
      required
```

---

### 9. Identity lifecycle

Identidades passam por solicitação, aprovação, provisionamento, uso, revisão, alteração, revogação e auditoria. Acessos temporários expiram, mudanças de função exigem revisão e identidades sem owner são bloqueadas.

---

### 10. Break-glass

Acesso emergencial precisa ser separado do acesso diário.

Contrato:

```yaml
breakGlass:
  separateIdentity:
    required

  mfa:
    required

  approval:
    emergencyProcess

  duration:
    limited

  logging:
    mandatory

  notification:
    immediate

  postIncidentReview:
    required

  routineUse:
    forbidden
```

Nenhuma identidade break-glass será criada.

---

### 11. Service accounts e workload identities

Aplicações usam identidades próprias.

Não reutilize:

- credencial pessoal;
- role de pipeline;
- role administrativa;
- identidade de outro serviço;
- ServiceAccount default com privilégios amplos.

Cada workload recebe actions e resources mínimos.

A identidade da aplicação não administra a própria policy.

---

### 12. Criar política de rede

Arquivo:

```text
cloud-network-security-policy.yaml
```

Conteúdo:

```yaml
network:
  segmentation:
    publicEntry:
      required

    privateApplication:
      required

    isolatedData:
      required

  publicIp:
    backend:
      forbidden

    database:
      forbidden

  inbound:
    default:
      deny

    allowedPorts:
      explicit:
        required

  egress:
    allowlist:
      required

    unknownDestination:
      forbidden

  administrativeAccess:
    internetExposed:
      forbidden

  privateEndpoints:
    preferredWhenJustified

  flowLogs:
    required
```

---

### 13. Ingress e egress

Ingress controla entrada; egress controla saída. Um workload comprometido pode exfiltrar dados, baixar malware ou gerar custo. Destinations, ports, protocols, owner e motivo precisam ser explícitos.

---

### 14. Security Groups e firewalls

Regras usam origem e destino específicos: ALB recebe HTTPS, aplicação recebe do ALB, e banco e cache recebem somente da aplicação. `0.0.0.0/0` é proibido para portas administrativas e serviços internos.

---

### 15. WAF e proteção de borda

WAF pode bloquear padrões conhecidos, bots, payloads suspeitos e taxas abusivas, mas não substitui validação, autenticação, secure coding ou rate limiting de negócio. DDoS exige capacidade, edge e resposta operacional. Nenhum WAF real será configurado.

---

### 16. Criar política de dados

Arquivo:

```text
cloud-data-security-policy.yaml
```

Conteúdo:

```yaml
data:
  classification:
    required

  minimization:
    required

  encryption:
    atRest:
      required

    inTransit:
      required

  residency:
    decisionRequired

  retention:
    explicit

  deletion:
    controlled

  backup:
    encrypted:
      required

  restore:
    tested:
      required

  productionData:
    nonProduction:
      forbidden

  logs:
    restrictedData:
      forbidden
```

---

### 17. Data minimization

Armazene somente o necessário. Para cada campo, registre finalidade, acesso, retenção, backup, logs, eventos, cache e object storage. Menos dados reduzem o impacto de incidentes.

---

### 18. Encryption

Encryption at rest protege storage e TLS protege trânsito. Key ownership, policy, rotação, revogação, recovery, audit e separação de funções precisam ser definidos. Uma chave inacessível pode impedir a recuperação.

---

### 19. Criar política de secrets

Arquivo:

```text
cloud-secrets-security-policy.yaml
```

Conteúdo:

```yaml
secrets:
  source:
    managedSecretStore:
      required

  repository:
    forbidden

  containerImage:
    forbidden

  logs:
    forbidden

  environment:
    plainTextLongLived:
      forbidden

  rotation:
    required

  access:
    leastPrivilege:
      required

  audit:
    required

  emergencyRotation:
    runbookRequired

  scanning:
    repository:
      required
```

---

### 20. Secrets não são configuração comum

Secrets incluem:

- senha;
- token;
- access key;
- private key;
- client secret;
- signing key;
- connection credential.

ConfigMap, values file e Dockerfile não são cofres.

Mesmo dados codificados em Base64 continuam sensíveis.

---

### 21. Rotação

Rotação precisa coordenar versões, rollout, pools, conexões, consumers, rollback e revogação. Sem ensaio, a troca pode causar indisponibilidade.

---

### 22. Criar política de workload

Arquivo:

```text
cloud-workload-security-policy.yaml
```

Conteúdo:

```yaml
workload:
  container:
    nonRoot:
      required

    readOnlyRootFilesystem:
      preferred

    privileged:
      forbidden

    capabilities:
      dropAll:
        preferred

    image:
      digest:
        required

      latestTag:
        forbidden

  kubernetes:
    serviceAccount:
      dedicated:
        required

    tokenAutomount:
      disabledWhenUnused

    resources:
      requestsLimits:
        required

    probes:
      required

    namespace:
      explicit

    rbac:
      leastPrivilege

  runtime:
    secretsInProcessArgs:
      forbidden
```

---

### 23. Container hardening

A imagem usa base mínima, versão controlada, usuário não root, dependências atualizadas, nenhum Secret, SBOM, scan, digest e assinatura quando adotada. Imagem pequena não é automaticamente segura.

---

### 24. Kubernetes security

Namespace, RBAC, Pod Security, NetworkPolicy, admission, service accounts, image policy, limits, audit e node security formam a baseline. Pod Security e NetworkPolicy serão apenas documentadas.

---

### 25. Criar política de supply chain

Arquivo:

```text
cloud-supply-chain-policy.yaml
```

Conteúdo:

```yaml
supplyChain:
  source:
    protectedBranch:
      required

    review:
      required

  dependencies:
    lock:
      required

    vulnerabilityScan:
      required

  build:
    isolated:
      required

    reproducible:
      preferred

  artifact:
    registry:
      trusted:
        required

    digest:
      required

    sbom:
      required

    signature:
      requiredWhenSupported

  deployment:
    provenance:
      required

    promotion:
      required

    rebuildInProduction:
      forbidden
```

---

### 26. Dependency security

Dependências exigem source confiável, versão controlada, checksum, lock, scan, licença, owner e exceção com prazo. Vulnerabilidades são avaliadas pelo contexto de exploração, não apenas pelo score.

---

### 27. SBOM

Software Bill of Materials registra componentes do artifact e apoia inventário, auditoria e resposta a vulnerabilidades. Ela aumenta visibilidade, mas não prova ausência de falhas.

---

### 28. Assinatura e provenance

Assinatura verifica origem e integridade; provenance registra como o artifact foi produzido. O deploy valida digest, origem, assinatura, ambiente, pipeline, commit e policy. Nenhuma chave real será criada.

---

### 29. IaC e manifests

IaC pode introduzir:

- bucket público;
- Security Group aberto;
- role ampla;
- encryption desabilitada;
- logging ausente;
- backup ausente;
- recurso em região errada.

Por isso, pull requests precisam de:

- lint;
- policy as code;
- security scan;
- plan review;
- drift review;
- approval.

---

### 30. Criar política de logging e auditoria

Arquivo:

```text
cloud-logging-audit-policy.yaml
```

Conteúdo:

```yaml
logging:
  controlPlane:
    audit:
      required

  identity:
    authenticationEvents:
      required

    authorizationChanges:
      required

  network:
    flowLogs:
      required

  application:
    structured:
      required

    correlationId:
      required

    secretRedaction:
      required

  storage:
    immutableOrProtected:
      required

  retention:
    explicit

  access:
    restricted

  alerting:
    actionable:
      required
```

---

### 31. Logs de segurança

Login, falha de MFA, role assumption, policy change, Secret access, exposição pública, firewall, backup deletion, audit disable, mass download e privilege escalation precisam de timestamps confiáveis e retenção.

---

### 32. Detecção

Rules, baselines, anomalies, threat intelligence, posture, vulnerabilities e audit correlation alimentam detecção. Findings precisam de owner, severidade, ação e prazo.

---

### 33. CSPM e posture management

Cloud Security Posture Management detecta exposição, encryption ou logging ausentes, policies amplas, backup ausente e drift. Ele complementa threat model e secure coding. Nenhuma ferramenta real será conectada.

---

### 34. Criar política de backup e recovery

Arquivo:

```text
cloud-backup-recovery-security-policy.yaml
```

Conteúdo:

```yaml
backupSecurity:
  encryption:
    required

  access:
    separateRole:
      required

  immutability:
    reviewed

  crossAccountOrBoundary:
    decisionRequired

  retention:
    explicit

  deletion:
    approvalRequired

  restore:
    tested:
      required

  ransomware:
    recoveryScenario:
      required

  evidence:
    required
```

---

### 35. Ransomware e exclusão maliciosa

Um atacante com acesso amplo pode criptografar dados, apagar backups, alterar policies e desabilitar logs. Menor privilégio, separação de funções, backup protegido, alertas e restore testado reduzem o risco. Backup acessível pela identidade comprometida pode falhar como proteção.

---

### 36. Criar plano de resposta a incidentes

Arquivo:

```text
cloud-incident-response-plan.yaml
```

Conteúdo:

```yaml
incidentResponse:
  phases:
    - prepare
    - detect
    - analyze
    - contain
    - eradicate
    - recover
    - learn

  severity:
    levels:
      - SEV1
      - SEV2
      - SEV3
      - SEV4

  roles:
    incidentCommander:
      required

    securityLead:
      required

    operationsLead:
      required

    communications:
      required

  evidence:
    preserve:
      required

  credentials:
    emergencyRotation:
      supported

  recovery:
    cleanEnvironment:
      available:
        required

  postIncident:
    review:
      required
```

---

### 37. Containment

Containment pode revogar sessões, bloquear roles, rotacionar Secrets, isolar workloads, bloquear egress, pausar deploy e preservar snapshots. Evidências devem ser coletadas antes de destruir o ambiente.

---

### 38. Evidence

Evidence inclui timestamps, audit events, commit, image digest, identity, source, mudanças, logs, alerts, timeline e ações. Secrets são proibidos e acesso e retenção são restritos.

---

### 39. Criar matriz de controles

Arquivo:

```text
cloud-control-matrix.yaml
```

Conteúdo:

```yaml
controls:
  identity:
    preventive:
      - federation
      - mfa
      - least-privilege

    detective:
      - login-alert
      - policy-change-alert

    responsive:
      - revoke-session
      - rotate-secret

  network:
    preventive:
      - segmentation
      - deny-by-default

    detective:
      - flow-logs
      - exposure-scan

    responsive:
      - isolate-resource
      - block-egress

  data:
    preventive:
      - encryption
      - classification

    detective:
      - access-audit
      - mass-download-alert

    recovery:
      - protected-backup
      - restore-test
```

---

### 40. Criar política de exceções

Arquivo:

```text
cloud-security-exception-policy.yaml
```

Conteúdo:

```yaml
exceptions:
  businessJustification:
    required

  owner:
    required

  risk:
    documented:
      required

  compensatingControl:
    required

  expiration:
    required

  approval:
    security:
      required

    engineering:
      required

  review:
    scheduled

  permanentException:
    forbidden
```

Exceção sem expiração vira configuração permanente.

---

### 41. Repository secret scanning

Execute:

```powershell
.\scripts\cloud\security\scan-repository-secrets.ps1
```

O script procura padrões como:

```text
AKIA;

ASIA;

private key;

password literal;

token literal;

connection string;

signed URL;

client secret.
```

Se um Secret real já entrou no Git:

1. revogue;
2. rotacione;
3. remova do histórico conforme procedimento;
4. investigue acesso;
5. registre incidente.

Apenas apagar o arquivo não resolve.

---

### 42. Manifest scanning

Execute:

```powershell
.\scripts\cloud\security\scan-cloud-manifests.ps1
```

O script bloqueia:

- public access;
- wildcard actions;
- wildcard resources;
- `0.0.0.0/0` em portas sensíveis;
- encryption false;
- logging false;
- backup false;
- latest tag;
- privileged container;
- root obrigatório;
- Secret literal;
- resource sem owner.

---

### 43. Simular vazamento de credencial

Execute:

```powershell
.\scripts\cloud\security\simulate-credential-leak.ps1
```

Cenário offline:

```text
token fictício
é detectado
em arquivo temporário.
```

Resposta esperada:

1. bloquear gate;
2. classificar severidade;
3. identificar owner;
4. simular revogação;
5. simular rotação;
6. revisar logs;
7. remover artifact;
8. registrar evidence;
9. abrir action item.

Nenhuma credencial real será usada.

---

### 44. Simular exposição pública

Execute:

```powershell
.\scripts\cloud\security\simulate-public-exposure.ps1
```

O script recebe um manifest fictício com:

```text
publicAccess:
true.
```

Resultado esperado:

- policy failure;
- severity high;
- deploy bloqueado;
- owner notificado;
- correção para private;
- regression test;
- evidence.

---

### 45. Simular ransomware recovery

Execute:

```powershell
.\scripts\cloud\security\simulate-ransomware-recovery.ps1
```

A simulação percorre:

1. dado primário indisponível;
2. credencial comprometida;
3. sessão revogada;
4. backup protegido identificado;
5. ambiente limpo preparado;
6. restore lógico simulado;
7. integridade validada;
8. application smoke test;
9. acesso reaberto;
10. post-incident review.

Nenhum dado real é restaurado.

---

### 46. Validar threat model

Execute:

```powershell
.\scripts\cloud\security\validate-threat-model.ps1
```

O validator exige:

- ativo;
- owner;
- cenário;
- categoria;
- impacto;
- probabilidade;
- controls;
- risco residual;
- action;
- prazo.

---

### 47. Validar identidade

Execute:

```powershell
.\scripts\cloud\security\validate-identity-policy.ps1
```

Bloqueie:

- shared account;
- static access key;
- pipeline admin;
- workload sem role;
- wildcard;
- identidade sem owner;
- acesso sem review;
- exceção sem expiração.

---

### 48. Validar rede

Execute:

```powershell
.\scripts\cloud\security\validate-network-policy.ps1
```

Bloqueie:

- backend público;
- database público;
- cache público;
- porta administrativa na internet;
- egress desconhecido;
- flow logs ausentes;
- rule sem owner;
- CIDR amplo sem exceção.

---

### 49. Validar dados e supply chain

Execute:

```powershell
.\scripts\cloud\security\validate-data-policy.ps1

.\scripts\cloud\security\validate-supply-chain-policy.ps1
```

Exija:

- classification;
- encryption;
- retention;
- backup;
- restore;
- digest;
- SBOM;
- scan;
- provenance;
- promotion;
- review.

---

### 50. Criar security decision summary

O script:

```text
generate-security-decision-summary.ps1
```

produz:

- ativos críticos;
- threats críticos;
- risks residuais;
- identity findings;
- network findings;
- data findings;
- supply chain findings;
- logging findings;
- backup findings;
- exceptions;
- deploy blockers;
- readiness para ambiente simples.

Sem conteúdo sensível.

---

### 51. Criar evidence

Arquivo:

```text
cloud-security-evidence.json.
```

Campos permitidos:

- asset count;
- critical asset count;
- threat count;
- high risk count;
- identity baseline status;
- network baseline status;
- data baseline status;
- secrets scan status;
- supply chain status;
- backup recovery status;
- incident simulation status;
- active exception count;
- static credentials false;
- public backend false;
- actual cloud resources zero;
- timestamp.

---

### 52. Criar documentação

#### `CLOUD_SHARED_RESPONSIBILITY.md`

Explique as responsabilidades por modelo de serviço.

#### `CLOUD_THREAT_MODEL.md`

Explique ativos, threats, risks e boundaries.

#### `CLOUD_IDENTITY_SECURITY.md`

Explique federation, MFA, OIDC, roles e break-glass.

#### `CLOUD_NETWORK_SECURITY.md`

Explique segmentation, ingress, egress e flow logs.

#### `CLOUD_DATA_SECURITY.md`

Explique classification, minimization e encryption.

#### `CLOUD_WORKLOAD_SECURITY.md`

Explique containers, Kubernetes e runtime.

#### `CLOUD_SUPPLY_CHAIN_SECURITY.md`

Explique source, dependencies, SBOM, assinatura e provenance.

#### `CLOUD_LOGGING_AND_DETECTION.md`

Explique audit, alerts e posture.

#### `CLOUD_BACKUP_AND_RECOVERY_SECURITY.md`

Explique isolamento, imutabilidade e restore.

#### `CLOUD_INCIDENT_RESPONSE.md`

Explique preparação, contenção, recuperação e aprendizado.

---

### 53. Criar test matrix

Arquivo:

```text
CLOUD_SECURITY_TEST_MATRIX.md
```

Cenários:

- ativo sem owner é bloqueado;
- dado sem classificação é bloqueado;
- usuário sem MFA é bloqueado;
- access key estática é bloqueada;
- pipeline admin é bloqueado;
- wildcard IAM é bloqueado;
- workload sem identity é bloqueado;
- backend público é bloqueado;
- banco público é bloqueado;
- egress desconhecido é bloqueado;
- TLS desabilitado é bloqueado;
- encryption ausente é bloqueada;
- Secret no Git é bloqueado;
- latest tag é bloqueada;
- digest ausente é bloqueado;
- SBOM ausente é bloqueada;
- image sem scan é bloqueada;
- logging ausente é bloqueado;
- backup sem restore é bloqueado;
- exceção sem expiração é bloqueada;
- vazamento simulado bloqueia o gate;
- exposição pública simulada bloqueia o gate;
- ransomware recovery conclui;
- actual resource count permanece zero.

---

### 54. Criar troubleshooting

Arquivo:

```text
CLOUD_SECURITY_TROUBLESHOOTING.md
```

Inclua:

- acesso negado após least privilege;
- OIDC trust incorreto;
- MFA não aplicado;
- Secret detectado;
- falso positivo de scanner;
- Security Group amplo;
- backend público;
- egress bloqueando integração;
- TLS handshake;
- KMS denied;
- image signature inválida;
- SBOM ausente;
- vulnerability sem patch;
- audit log ausente;
- alerta ruidoso;
- backup inacessível;
- restore incompatível;
- break-glass indisponível;
- exceção expirada;
- evidence contendo Secret;
- deploy bloqueado por control failure.

---

### 55. Executar gate final

Execute:

```powershell
.\scripts\cloud\security\validate-cloud-security-baseline.ps1

.\scripts\cloud\security\validate-asset-inventory.ps1

.\scripts\cloud\security\validate-threat-model.ps1

.\scripts\cloud\security\validate-identity-policy.ps1

.\scripts\cloud\security\validate-network-policy.ps1

.\scripts\cloud\security\validate-data-policy.ps1

.\scripts\cloud\security\validate-supply-chain-policy.ps1

.\scripts\cloud\security\scan-repository-secrets.ps1

.\scripts\cloud\security\scan-cloud-manifests.ps1

.\scripts\cloud\security\audit-security-exceptions.ps1

.\scripts\cloud\security\simulate-credential-leak.ps1

.\scripts\cloud\security\simulate-public-exposure.ps1

.\scripts\cloud\security\simulate-ransomware-recovery.ps1

.\scripts\cloud\security\generate-security-decision-summary.ps1

.\scripts\cloud\security\collect-cloud-security-evidence.ps1
```

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
- nenhum Secret real;
- nenhuma credencial;
- nenhum recurso cloud;
- nenhum acesso externo;
- nenhum deploy executado;
- nenhum controle crítico pendente sem owner;
- ponte pronta para a aula 545.

---

## Entendendo o que foi feito

### Segurança ganhou ativos e owners

O que precisa de proteção deixou de ser implícito.

### Threat model ganhou cenários

Controles passaram a responder a riscos concretos.

### Identidade ganhou lifecycle

Federation, MFA, sessões temporárias e revogação entraram no contrato.

### Rede ganhou saída controlada

Egress passou a ser parte da segurança.

### Dados ganharam classificação

Retenção, região, encryption e logging passaram a depender do risco.

### Secrets ganharam rotação

Git, image, logs e ConfigMap foram removidos do papel de cofre.

### Workloads ganharam hardening

Non-root, digest, RBAC e resources passaram a ser gates.

### Supply chain ganhou provenance

Código, dependencies, artifact e deploy passaram a formar uma cadeia verificável.

### Logging ganhou ação

Findings precisam de owner, severidade e resposta.

### Backup ganhou proteção contra ataque

Restore seguro passou a considerar credencial comprometida e ambiente limpo.

---

## Erros comuns importantes

### Acreditar que o provedor protege tudo

Configuração, identidade, dados e aplicação continuam sob responsabilidade do cliente.

### Usar uma única role administrativa

O blast radius fica excessivo.

### Criar access key para facilitar automação

Use federation, OIDC e credenciais temporárias.

### Confiar apenas em rede privada

Identidade, encryption e logging continuam necessários.

### Guardar Secret em ConfigMap

Base64 ou YAML não oferecem proteção adequada.

### Desabilitar logging para reduzir custo

A investigação e detecção ficam comprometidas.

### Escanear sem corrigir findings

Scanner sem processo vira ruído.

### Assinar imagem sem verificar no deploy

A assinatura perde valor operacional.

### Manter exceção sem expiração

O risco temporário vira permanente.

### Antecipar deploy simples

A aula 545 possui esse objetivo.

---

## Comandos úteis

### Validar baseline

```powershell
.\scripts\cloud\security\validate-cloud-security-baseline.ps1
```

### Escanear Secrets

```powershell
.\scripts\cloud\security\scan-repository-secrets.ps1
```

### Escanear manifests

```powershell
.\scripts\cloud\security\scan-cloud-manifests.ps1
```

### Simular vazamento

```powershell
.\scripts\cloud\security\simulate-credential-leak.ps1
```

### Gerar summary

```powershell
.\scripts\cloud\security\generate-security-decision-summary.ps1
```

---

## Exercício guiado

### Parte 1 — Assets

Liste ativos e owners.

### Parte 2 — Boundaries

Identifique mudanças de confiança.

### Parte 3 — Threats

Modele cenários e riscos.

### Parte 4 — Identity

Defina federation, MFA e roles.

### Parte 5 — Network

Defina segmentation, ingress e egress.

### Parte 6 — Data

Defina classification, encryption e retention.

### Parte 7 — Workload

Aplique hardening e least privilege.

### Parte 8 — Supply chain

Defina digest, SBOM, scan e provenance.

### Parte 9 — Detection and response

Defina logs, alerts, backup e incident response.

### Parte 10 — Evidence

Comprove readiness sem cloud real.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 543 foi preservada;
- ponte para a aula 545 está correta;
- shared responsibility foi definida;
- defense in depth foi definida;
- asset, threat, vulnerability, risk e control foram definidos;
- trust boundary foi definida;
- controles preventivos, detectivos, responsivos e de recuperação foram definidos;
- baseline de segurança foi criada;
- inventário de ativos foi criado;
- owner e criticidade foram exigidos;
- classificação public, internal, confidential e restricted foi definida;
- trust boundaries foram modeladas;
- threat model foi criado;
- categorias STRIDE foram usadas;
- risco residual foi exigido;
- política de identidade foi criada;
- federation e MFA foram exigidos;
- shared accounts foram proibidas;
- access keys permanentes foram proibidas;
- OIDC foi exigido para pipelines;
- workload identity foi exigida;
- wildcard IAM foi proibido;
- access review foi definido;
- break-glass foi modelado;
- ServiceAccounts dedicados foram preservados;
- política de rede foi criada;
- backend, banco e cache públicos foram proibidos;
- deny by default foi exigido;
- egress allowlist foi exigida;
- flow logs foram exigidos;
- WAF e DDoS foram contextualizados;
- política de dados foi criada;
- minimização foi exigida;
- encryption at rest e in transit foram exigidas;
- residência e retenção foram consideradas;
- produção em não produção foi proibida;
- política de secrets foi criada;
- Git, image e logs foram proibidos para Secrets;
- rotação e emergency rotation foram definidas;
- política de workload foi criada;
- containers privilegiados foram proibidos;
- image digest foi exigido;
- latest tag foi proibida;
- Namespace e RBAC permaneceram explícitos;
- Pod Security e NetworkPolicy foram documentadas sem antecipação;
- política de supply chain foi criada;
- protected branch e review foram exigidos;
- dependency lock e scan foram exigidos;
- registry confiável foi exigido;
- SBOM foi exigida;
- assinatura e provenance foram exigidas;
- rebuild em produção foi proibido;
- IaC scanning foi definido;
- policy as code foi definida;
- política de logging e auditoria foi criada;
- logs de identidade, rede, aplicação e control plane foram exigidos;
- redaction foi exigida;
- alertas acionáveis foram exigidos;
- CSPM foi explicado;
- política de backup security foi criada;
- backup encryption e role separada foram exigidas;
- restore test foi exigido;
- cenário de ransomware foi criado;
- plano de incidente foi criado;
- fases de resposta foram definidas;
- incident commander e leads foram exigidos;
- contenção preserva evidência;
- matriz de controles foi criada;
- política de exceções foi criada;
- exceções exigem owner, expiração e compensating control;
- permanent exception foi proibida;
- secret scanning foi criado;
- manifest scanning foi criado;
- vazamento de credencial foi simulado;
- exposição pública foi simulada;
- ransomware recovery foi simulado;
- threat model foi validado;
- identidade, rede, dados e supply chain foram validados;
- decision summary foi criado;
- evidence foi sanitizada;
- static credentials ficou false;
- public backend ficou false;
- actual cloud resources ficou zero;
- documentação foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- nenhum resource, credential, policy ou scanner real foi usado;
- deploy não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/security `
  scripts/cloud/security `
  docs/devops/cloud-security `
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
      "AKIA|ASIA|BEGIN PRIVATE KEY|password: [^$]|token: [^$]|client-secret|X-Amz-Signature"
```

Commit recomendado:

```powershell
git commit -m "security(m17): consolidar seguranca cloud"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access key;
- secret key;
- token;
- private key;
- Secret real;
- account ID;
- ARN real;
- log real;
- dado pessoal;
- incidente real;
- recurso cloud;
- deploy da aula 545.

---

## Fechamento e ponte para a próxima aula

Nesta aula, segurança cloud deixou de ser tratada como uma lista isolada de configurações.

O modelo passou a possuir:

```text
assets;

owners;

classification;

threats;

trust boundaries;

identity;

network;

data;

secrets;

workloads;

supply chain;

detection;

response;

recovery.
```

Você comprovou que shared responsibility mantém o cliente responsável por identidade, configuração, dados e aplicação; federation, MFA, OIDC e roles temporárias reduzem credenciais permanentes; segmentação e egress control reduzem exposição; classificação orienta encryption e retention; Secrets precisam de cofre, rotação e auditoria; containers e Kubernetes exigem hardening; supply chain exige digest, SBOM, scan e provenance; logging precisa gerar resposta; backups precisam sobreviver à identidade comprometida; e incident response precisa ser ensaiada.

A próxima aula será:

```text
545 - M17.40 - Deploy em ambiente simples
```

Nela, você irá preparar e executar um deploy controlado em um ambiente simples, aplicando os gates acumulados de configuração, imagem, health checks, segurança, evidência, rollback e validação operacional.

Nenhum deploy, ambiente externo, domínio, certificado, credencial ou recurso cloud foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Inventariei ativos.
- [ ] Modelei threats e boundaries.
- [ ] Defini identidade e rede.
- [ ] Defini proteção de dados e Secrets.
- [ ] Modelei workload e supply chain.
- [ ] Defini logging, backup e incident response.
- [ ] Executei as simulações offline.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O scanner encontra um Secret real

Revogue e rotacione antes de tratar o histórico.

### A policy bloqueia o pipeline

Revise actions e resources necessários, sem adicionar administrador global.

### O egress bloqueia uma integração

Documente destino, porta, protocolo, owner e necessidade antes de liberar.

### O workload precisa executar como root

Documente o requisito, aplique compensating controls e prazo de correção.

### A imagem não possui SBOM

Bloqueie promoção até gerar inventário verificável.

### O backup não pode ser restaurado

Trate como falha crítica de recovery.

### O log contém token

Remova, rotacione e revise redaction.

### A exceção expirou

Corrija o controle ou renove com nova aprovação e justificativa.

### O finding não possui owner

O controle operacional está incompleto.

### Um deploy externo apareceu

Remova e preserve para a aula 545.

---

## Perguntas de revisão

1. O que é responsabilidade compartilhada?
2. O que é defesa em profundidade?
3. O que é asset?
4. O que é threat?
5. O que é vulnerability?
6. O que é risk?
7. O que é trust boundary?
8. Qual a diferença entre controle preventivo e detectivo?
9. Por que usar federation e MFA?
10. O que é workload identity?
11. Por que controlar egress?
12. Como classificar dados?
13. Onde Secrets devem ficar?
14. O que é SBOM?
15. Para que serve provenance?
16. O que é CSPM?
17. Como proteger backups?
18. Quais são as fases de resposta?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Divisão entre provedor e cliente.
2. Múltiplas camadas.
3. Recurso de valor.
4. Cenário de dano.
5. Fraqueza explorável.
6. Probabilidade e impacto.
7. Mudança de confiança.
8. Impedir e detectar.
9. Identidade forte e temporária.
10. Identidade do workload.
11. Reduzir exfiltração.
12. Public, internal, confidential e restricted.
13. Secret manager.
14. Inventário de componentes.
15. Origem do artifact.
16. Gestão de postura.
17. Isolamento, encryption e restore.
18. Preparar, detectar, conter, recuperar e aprender.
19. Recursos e deploy reais.
20. Deploy em ambiente simples.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 544 - M17.39 - Observacoes de seguranca cloud

- Continuei após Custos cloud.
- Defini responsabilidade compartilhada e defesa em profundidade.
- Criei inventário de ativos com owner, classificação e criticidade.
- Modelei trust boundaries.
- Criei threat model com categorias STRIDE.
- Registrei impacto, probabilidade, controles e risco residual.
- Criei baseline de identidade com federation, MFA e least privilege.
- Proibi shared accounts e access keys permanentes.
- Exigi OIDC e credenciais temporárias para pipelines.
- Modelei workload identity e break-glass.
- Criei política de segmentação de rede.
- Proibi backend, banco e cache públicos.
- Modelei ingress, egress allowlist e flow logs.
- Contextualizei WAF e proteção contra DDoS.
- Criei política de classificação, minimização e encryption.
- Proibi dados produtivos em ambientes não produtivos.
- Criei política de Secrets com rotação e auditoria.
- Criei baseline de hardening de containers e Kubernetes.
- Proibi privileged container e latest tag.
- Exigi image digest, SBOM, scan, assinatura e provenance.
- Criei policy as code para IaC e manifests.
- Modelei logging, audit, detection e CSPM.
- Criei política de backup protegida contra identidade comprometida.
- Modelei cenário de ransomware e restore limpo.
- Criei plano de incident response.
- Criei matriz de controles preventivos, detectivos e responsivos.
- Criei política de exceções com expiração.
- Simulei vazamento de credencial, exposição pública e ransomware recovery.
- Criei scripts, documentação, test matrix e evidence sanitizada.
- Não criei recurso, credencial, policy ou deploy real.
- Próxima aula: Deploy em ambiente simples.
```

---

## Referência técnica curta

- Cloud Shared Responsibility.
- Threat Modeling and STRIDE.
- Identity Federation and MFA.
- Cloud Network Segmentation.
- Data Classification and Encryption.
- Secrets Management.
- Container and Kubernetes Security.
- Software Supply Chain Security.
- Cloud Security Posture Management.
- Incident Response and Recovery.

Regra final:

```text
segurança cloud precisa operar como defesa em profundidade e responsabilidade contínua: ativos possuem owner, classificação e criticidade, threat models registram boundaries, ameaças, vulnerabilidades, impacto, probabilidade, controles e risco residual; pessoas usam federation, MFA e sessões temporárias, pipelines usam OIDC e roles mínimas, workloads usam identidades próprias e nenhuma access key permanente entra em código, image, Git ou logs; rede separa entrada, aplicação e dados, bloqueia exposição pública e controla egress; dados são minimizados, criptografados, retidos e recuperáveis, Secrets ficam em serviço dedicado com rotação; containers, Kubernetes, IaC e artifacts passam por hardening, digest, SBOM, scan, assinatura, provenance e policy as code; audit logs, posture findings, alerts, backups protegidos, break-glass, incident response e restore test completam controles preventivos, detectivos, responsivos e de recuperação; nenhuma credencial, policy, scanner, recurso ou deploy real é criado, deixando para a aula 545 o deploy controlado em ambiente simples.
```
