# 539 - M17.34 - RDS PostgreSQL

## Apresentação da aula

Na aula 538, você mapeou capacidades provider-neutral para serviços AWS.

A arquitetura passou a relacionar:

```text
Route 53;

CloudFront;

WAF;

ALB ou API Gateway;

ECR;

EC2, ECS, Fargate e EKS;

RDS e Aurora;

ElastiCache;

SQS, SNS, EventBridge e MSK;

S3;

Secrets Manager;

KMS;

CloudWatch;

CloudTrail.
```

Também foi criado um arquivo de readiness para PostgreSQL gerenciado.

A pergunta central desta aula será:

```text
como preparar
uma aplicação Java

para usar
PostgreSQL gerenciado
no Amazon RDS

com segurança,
resiliência,
migrations,
pool,
backup
e observabilidade?
```

A resposta será construída por contratos.

Nesta aula, você não criará uma instância real.

Não haverá:

- conta AWS;
- access key;
- secret key;
- endpoint RDS real;
- senha real;
- subnet group real;
- Security Group real;
- cobrança;
- DNS público;
- snapshot real;
- restore real;
- alteração em produção.

A prática será arquitetural, local e verificável.

Você irá criar:

- blueprint de RDS PostgreSQL;
- contrato de rede;
- policy de credenciais;
- profile Spring Boot;
- contrato de HikariCP;
- estratégia de migrations;
- política de backup e restore;
- runbook de failover;
- matriz de observabilidade;
- scripts offline;
- evidence sanitizada.

A próxima aula será:

```text
540 - M17.35 - SQS SNS
```

Por isso, nenhum recurso de mensageria será criado antecipadamente.

---

### RDS PostgreSQL em uma frase

Amazon RDS for PostgreSQL oferece PostgreSQL gerenciado.

O serviço reduz parte da operação de infraestrutura, como:

- provisionamento;
- substituição de host;
- backups conforme configuração;
- aplicação de manutenção conforme janela;
- monitoramento de recursos;
- failover em arquiteturas compatíveis.

A equipe continua responsável por:

- schema;
- migrations;
- queries;
- índices;
- roles do banco;
- connection pool;
- retenção;
- restore test;
- dados;
- classificação;
- performance;
- custos;
- aplicação;
- incidentes.

A regra central será:

```text
RDS gerencia
a plataforma do banco;

a equipe continua
responsável
pelo uso correto
do PostgreSQL.
```

---

### Endpoint e DNS

A aplicação se conecta ao RDS por um endpoint DNS.

Ela não deve gravar um IP fixo em configuração.

Em um failover compatível, o destino por trás do endpoint pode mudar.

A aplicação precisa:

- resolver DNS normalmente;
- tolerar conexões interrompidas;
- recriar conexões;
- usar retry limitado;
- possuir timeout;
- evitar cache permanente de IP;
- observar falhas de pool.

A URL JDBC conceitual será:

```text
jdbc:postgresql://<endpoint>:5432/orders
```

Nenhum endpoint real será usado.

---

### Rede privada

A instância de banco deve ficar em subnets privadas ou isoladas.

O contrato será:

```text
publiclyAccessible:
false.
```

A camada de aplicação acessa o PostgreSQL pela rede privada.

O Security Group do banco aceita a porta PostgreSQL somente a partir do Security Group da aplicação.

Não será permitido:

```text
0.0.0.0/0
na porta 5432.
```

Também não serão aceitos:

- IP pessoal;
- IP residencial;
- regra temporária sem expiração;
- acesso público para facilitar teste;
- senha compartilhada.

---

### DB Subnet Group

Um DB subnet group reúne subnets usadas pelo RDS.

Para produção, ele precisa cobrir múltiplas Availability Zones.

A policy exigirá:

```text
minimumAvailabilityZones:
2.
```

As subnets devem pertencer à zona de dados da VPC.

A aplicação executa em subnets privadas de aplicação.

O banco executa em subnets de dados.

Essa separação reduz exposição e melhora a leitura do fluxo.

---

### Single-AZ e Multi-AZ

#### Single-AZ

Executa a instância principal em uma AZ.

É adequada para laboratórios ou ambientes de menor criticidade quando o risco é aceito.

#### Multi-AZ

Mantém capacidade de standby ou arquitetura de alta disponibilidade compatível com o modo selecionado.

O objetivo principal é disponibilidade e failover.

Multi-AZ não deve ser confundido com read replica.

A regra será:

```text
Multi-AZ:
alta disponibilidade.

Read replica:
escala de leitura
e outros casos de uso.
```

Produção exigirá Multi-AZ no blueprint.

Dev poderá utilizar Single-AZ apenas quando custo, criticidade e perda aceitável estiverem documentados.

---

### Read replicas

Read replicas recebem alterações de forma assíncrona.

Elas podem ser usadas para:

- relatórios;
- leitura intensiva;
- consultas tolerantes a atraso;
- recuperação arquitetural conforme a estratégia;
- isolamento de workloads de leitura.

A aplicação não deve assumir consistência imediata na réplica.

Um pedido recém-gravado pode ainda não estar visível.

A arquitetura precisa definir:

```text
read-your-writes:
primário.

eventual reads:
réplica quando permitido.
```

A aula não implementará roteamento de leitura.

---

### Aurora PostgreSQL-Compatible

Aurora é uma alternativa compatível com PostgreSQL em vários aspectos, mas possui arquitetura própria.

Ela não será tratada como substituição automática.

A decisão considera:

- compatibilidade;
- extensões;
- performance;
- scaling;
- failover;
- operação;
- custo;
- recursos específicos;
- lock-in.

A baseline didática continuará:

```text
Amazon RDS for PostgreSQL.
```

---

### Engine version

A versão da engine não deve ser escolhida como:

```text
latest
```

sem análise.

O contrato exige:

- versão explicitamente aprovada;
- compatibilidade com JDBC;
- compatibilidade com migrations;
- compatibilidade de extensões;
- política de atualização;
- ambiente de homologação;
- rollback ou recovery plan;
- documentação de breaking changes.

Nenhuma versão específica será fixada no arquivo sem validação no momento do provisionamento.

---

### Maintenance window

RDS possui janela de manutenção.

Ela precisa ser definida conforme:

- menor tráfego;
- equipe disponível;
- calendário de negócio;
- backups;
- deploys;
- incidentes;
- comunicação.

A aplicação precisa tolerar reinício ou failover.

A janela não é uma garantia de ausência total de impacto.

Deploys de aplicação e manutenção de banco não devem ocorrer simultaneamente sem uma decisão explícita.

---

### Parameter group

Parameter group controla parâmetros da engine.

Não copie configurações de PostgreSQL autogerenciado sem revisar o modelo gerenciado.

Parâmetros como:

- connections;
- logging;
- timeouts;
- memory;
- autovacuum;
- statement behavior;

precisam de análise.

Algumas mudanças podem ser:

- dinâmicas;
- estáticas;
- dependentes de reboot.

A policy exige:

- parameter group dedicado;
- diff versionado;
- justificativa;
- impacto;
- teste;
- rollback;
- owner.

Nesta aula, nenhum parâmetro real será alterado.

---

### Storage

O storage precisa considerar:

- capacidade inicial;
- crescimento;
- IOPS;
- throughput;
- limite;
- autoscaling;
- custo;
- backup;
- restore;
- alarmes.

A policy não escolherá tamanho apenas pelo banco atual.

Ela também considerará:

```text
crescimento mensal;

índices;

WAL;

vacuum;

migrations;

retenção;

picos;

margem operacional.
```

Storage autoscaling pode reduzir risco de falta de espaço.

Ele não substitui monitoramento.

---

### Criptografia em repouso

Produção exigirá encryption at rest.

A chave será gerenciada pelo KMS conforme a policy da organização.

A decisão precisa registrar:

- key ownership;
- key policy;
- rotação;
- acesso;
- backup;
- snapshots;
- replicação;
- recuperação.

A aplicação não recebe permissão ampla sobre a chave.

Ela precisa apenas das ações necessárias ao seu fluxo.

---

### TLS em trânsito

A conexão JDBC precisa usar TLS.

A baseline não aceitará:

```text
sslmode=disable.
```

Em produção, a validação precisa conferir a cadeia de confiança e o hostname.

Exemplo conceitual:

```text
sslmode=verify-full.
```

O trust material deve vir de fonte oficial e passar por atualização controlada.

Não serão usados:

- certificado ignorado;
- trust-all;
- hostname verification desativada;
- CA copiada sem origem;
- arquivo sensível versionado.

---

### Credenciais

As credenciais do banco não entram em:

- Git;
- Dockerfile;
- image;
- ConfigMap;
- `values.yaml`;
- logs;
- evidence;
- linha de comando;
- screenshot.

A baseline utilizará:

```text
AWS Secrets Manager
ou
mecanismo corporativo equivalente.
```

A aplicação recebe o valor em runtime.

A policy exige:

- usuário dedicado;
- menor privilégio;
- rotação;
- auditoria;
- separação por ambiente;
- nenhuma conta compartilhada;
- nenhuma credencial de administrador para a aplicação.

IAM database authentication pode ser avaliada quando compatível com o cenário, mas não será implementada nesta aula.

---

### Usuários e roles PostgreSQL

Separe responsabilidades.

Exemplo conceitual:

```text
orders_app:
DML necessário.

orders_migration:
DDL controlado.

orders_readonly:
leitura autorizada.

administrative:
fora da aplicação.
```

A aplicação não usa superuser.

O usuário de runtime não precisa criar tabelas quando migrations são executadas por outra identidade.

Essa separação reduz blast radius.

---

### Migrations

Migrations precisam ser:

- versionadas;
- ordenadas;
- testadas;
- repetíveis quando apropriado;
- observáveis;
- compatíveis com rollback ou roll-forward;
- executadas uma vez por versão;
- protegidas contra concorrência.

A formação já trabalha com Flyway ou Liquibase como opções.

O contrato recomendará:

```text
pipeline ou Job controlado
executa migration;

Pods de aplicação
não disputam DDL
durante startup.
```

Em ambientes menores, migration no startup pode ser aceita somente quando:

- lock é confiável;
- concorrência foi testada;
- timeout existe;
- impacto é conhecido;
- rollback é possível.

Para produção, a baseline será:

```text
migration stage
antes do rollout.
```

---

### Expand and contract

Mudanças de schema precisam permitir deploy seguro.

Exemplo:

```text
1.
adicionar nova coluna
compatível.

2.
publicar aplicação
que escreve nos dois formatos.

3.
migrar dados.

4.
publicar leitura nova.

5.
remover campo antigo
em release futura.
```

Esse padrão reduz acoplamento entre versão da aplicação e schema.

Alterações destrutivas não devem ocorrer no mesmo passo que introduz o novo uso.

---

### Connection pool

A aplicação usa HikariCP.

O pool por Pod precisa considerar:

```text
maxReplicas
x
maximumPoolSize
+
conexões de migrations
+
administração
+
monitoramento
<=
budget seguro do banco.
```

Exemplo didático:

```text
6 Pods
x
12 conexões
=
72.

migrations:
5.

operações:
8.

margem:
15.

budget:
100 conexões.
```

Os números são didáticos.

O valor real depende da instance class, workload e política do PostgreSQL.

---

### Timeouts do pool

O contrato incluirá:

- `connectionTimeout`;
- `validationTimeout`;
- `idleTimeout`;
- `maxLifetime`;
- `keepaliveTime`;
- `minimumIdle`;
- `maximumPoolSize`.

Regras:

```text
connectionTimeout:
curto e observável.

maxLifetime:
menor que limites
de infraestrutura
quando aplicável.

maximumPoolSize:
baseado em budget.

minimumIdle:
evita excesso ocioso.

retry:
fora do pool,
limitado.
```

Não aumente o pool para corrigir query lenta.

---

### Spring Boot profile

Será criado um profile:

```text
aws-rds.
```

Exemplo seguro:

```yaml
spring:
  datasource:
    url: ${DB_JDBC_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

    hikari:
      maximum-pool-size: ${DB_POOL_MAX:12}
      minimum-idle: ${DB_POOL_MIN:2}
      connection-timeout: ${DB_CONNECTION_TIMEOUT_MS:3000}
      validation-timeout: ${DB_VALIDATION_TIMEOUT_MS:1000}
      idle-timeout: ${DB_IDLE_TIMEOUT_MS:600000}
      max-lifetime: ${DB_MAX_LIFETIME_MS:1500000}
      keepalive-time: ${DB_KEEPALIVE_MS:300000}

  flyway:
    enabled: false
```

A migration stage usará configuração separada.

Nenhum valor real será adicionado ao arquivo.

---

### Failover

Em um failover, conexões existentes podem falhar.

O endpoint DNS permanece como contrato, mas o destino pode mudar.

A aplicação precisa:

1. encerrar a operação atual;
2. classificar se ela é retryable;
3. descartar conexão inválida;
4. resolver o endpoint;
5. abrir nova conexão;
6. repetir apenas quando seguro;
7. preservar idempotência;
8. emitir métricas;
9. não criar retry infinito.

Liveness deve continuar local.

Readiness pode refletir indisponibilidade do banco quando o endpoint depende dele para operar com segurança.

A decisão precisa evitar reiniciar Pods indefinidamente durante uma falha de banco.

---

### Backups e point-in-time recovery

A policy definirá:

- backup automático;
- retenção;
- snapshot manual antes de mudanças críticas;
- encryption;
- owner;
- restore test;
- RPO;
- RTO;
- região;
- lifecycle;
- custo.

Point-in-time recovery depende da configuração e retenção aplicáveis.

O restore não sobrescreve magicamente a instância atual.

Normalmente cria outro destino que precisa ser validado e promovido conforme o runbook.

---

### Snapshot

Snapshots podem servir para:

- recuperação;
- clone;
- teste;
- migração;
- auditoria;
- retenção.

Eles também podem gerar custo e exposição.

A policy exige:

- encryption;
- owner;
- tags;
- retenção;
- compartilhamento controlado;
- cleanup;
- restore test.

Nenhum snapshot real será criado.

---

### Deletion protection

Produção exigirá deletion protection.

Ela reduz exclusão acidental.

Não substitui:

- backup;
- IAM;
- approval;
- IaC;
- review;
- restore test.

A remoção planejada precisa de um runbook com evidência e confirmação de retenção.

---

### Observabilidade

A matriz de observabilidade incluirá:

- CPU;
- memória disponível;
- storage livre;
- IOPS;
- throughput;
- conexões;
- latency;
- deadlocks;
- locks;
- replication lag;
- failover events;
- error rate;
- pool usage;
- query duration;
- migration duration.

CloudWatch fornece métricas e alarms do serviço.

Logs PostgreSQL podem ser exportados conforme a configuração aprovada.

Logs não devem registrar dados sensíveis.

---

### Performance

Antes de aumentar a instância:

- revise query plan;
- índices;
- locks;
- pool;
- N+1;
- batch;
- pagination;
- cache;
- vacuum;
- estatísticas;
- tamanho de transação.

Escalar hardware sem diagnosticar pode aumentar custo e esconder a causa.

A aplicação precisa medir:

```text
p50;

p95;

p99;

rows;

calls;

errors.
```

---

### Autovacuum e manutenção lógica

PostgreSQL depende de vacuum e autovacuum.

A equipe precisa observar:

- tabelas com bloat;
- dead tuples;
- transações longas;
- locks;
- estatísticas;
- freeze;
- migrations massivas.

RDS não elimina a necessidade de entender o comportamento do PostgreSQL.

---

### Extensões

Extensões precisam ser avaliadas quanto a:

- disponibilidade;
- versão;
- compatibilidade;
- segurança;
- upgrade;
- dependência da aplicação;
- portabilidade.

Nenhuma extensão será assumida como disponível sem validação.

---

### RDS Proxy

RDS Proxy pode ajudar em cenários com:

- muitas conexões curtas;
- funções;
- picos;
- failover;
- pooling intermediário.

Ele não será adotado automaticamente.

Para uma aplicação Java com HikariCP, a arquitetura precisa avaliar:

- benefício real;
- custo;
- latência;
- transações;
- sessão;
- autenticação;
- observabilidade.

Nesta aula, ele será apenas documentado.

---

### Custo

Drivers de custo incluem:

- instance class;
- horas;
- storage;
- IOPS;
- backups;
- snapshots;
- transferência;
- Multi-AZ;
- replicas;
- monitoring;
- proxy;
- licenças quando aplicáveis.

A policy exige:

- tags;
- budget;
- alertas;
- rightsizing;
- revisão mensal;
- owner;
- custo por pedido.

Nenhum preço será fixado.

---

## Onde estamos na formação

A sequência oficial é:

```text
537:
Cloud conceitos para backend.

538:
AWS visao backend.

539:
RDS PostgreSQL.

540:
SQS SNS.

541:
S3.
```

A aula 538 respondeu:

```text
quais serviços AWS
podem implementar
as capacidades
do backend?
```

A aula 539 responderá:

```text
como preparar
PostgreSQL gerenciado
para a aplicação?
```

Nesta aula:

```text
RDS PostgreSQL:
sim.

DB subnet group:
sim.

Security Group:
sim.

Multi-AZ:
sim.

read replica:
sim.

engine version:
sim.

parameter group:
sim.

storage:
sim.

KMS:
sim.

TLS:
sim.

Secrets Manager:
sim.

roles PostgreSQL:
sim.

migrations:
sim.

HikariCP:
sim.

failover:
sim.

backup:
sim.

PITR:
sim.

snapshot:
sim.

deletion protection:
sim.

observabilidade:
sim.

RDS Proxy:
conceitual.

instância real:
não.

SQS e SNS:
não.
```

A regra central será:

```text
banco privado;

credencial protegida;

migration controlada;

pool dimensionado;

backup restaurável;

failover observável.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
cloud/aws/rds
├── rds-postgresql-blueprint.yaml
├── rds-network-contract.yaml
├── rds-security-policy.yaml
├── rds-credentials-policy.yaml
├── rds-backup-restore-policy.yaml
├── rds-failover-runbook.yaml
├── rds-observability-contract.yaml
├── rds-cost-policy.yaml
└── rds-readiness-checklist.yaml

src/main/resources
└── application-aws-rds.yml

scripts/cloud/aws/rds
├── validate-rds-blueprint.ps1
├── validate-rds-network.ps1
├── validate-rds-security.ps1
├── validate-rds-pool-budget.ps1
├── validate-rds-migration-plan.ps1
├── simulate-rds-failover.ps1
├── simulate-rds-restore.ps1
├── collect-rds-evidence.ps1
└── verify-rds-baseline.ps1

docs/devops/aws-rds
├── RDS_POSTGRESQL_ARCHITECTURE.md
├── RDS_NETWORK_SECURITY.md
├── RDS_SPRING_BOOT_INTEGRATION.md
├── RDS_CONNECTION_POOL.md
├── RDS_MIGRATION_STRATEGY.md
├── RDS_BACKUP_RESTORE.md
├── RDS_FAILOVER.md
├── RDS_OBSERVABILITY.md
├── RDS_TEST_MATRIX.md
└── RDS_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
blueprint de RDS;

rede privada;

Security Group restrito;

Multi-AZ em produção;

credenciais protegidas;

profile Spring Boot;

budget de conexões;

migrations controladas;

backup e restore;

failover;

observabilidade;

evidência sanitizada.
```

---

## Conceito essencial

### Amazon RDS

Serviço gerenciado de banco relacional.

---

### DB instance

Instância de banco gerenciada pelo RDS.

---

### DB subnet group

Conjunto de subnets disponíveis para o banco.

---

### Multi-AZ

Configuração de alta disponibilidade em múltiplas zonas.

---

### Read replica

Réplica assíncrona para leitura e outros cenários.

---

### Parameter group

Conjunto de parâmetros da engine.

---

### Backup retention

Período de retenção dos backups automáticos.

---

### Point-in-time recovery

Restauração para um ponto permitido dentro da janela de retenção.

---

### Deletion protection

Proteção contra exclusão acidental.

---

### HikariCP

Pool de conexões usado pela aplicação Spring Boot.

---

### Failover

Mudança do destino ativo após falha ou manutenção compatível.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme aplicação e dependências locais saudáveis.

---

### 2. Criar o blueprint

Arquivo:

```text
cloud/aws/rds/rds-postgresql-blueprint.yaml
```

Conteúdo:

```yaml
rds:
  engine:
    family:
      postgresql

    version:
      decisionRequired

  environment:
    production:
      multiAz:
        true

      publiclyAccessible:
        false

      deletionProtection:
        true

  network:
    subnetGroup:
      privateDataSubnets:
        required

      minimumAvailabilityZones:
        2

    securityGroup:
      inbound:
        source:
          applicationSecurityGroup

        port:
          5432

  encryption:
    storage:
      required

    key:
      customerManagedOrApproved:
        required

  credentials:
    secretManager:
      required

    applicationAdminUser:
      forbidden
```

---

### 3. Criar contrato de rede

Arquivo:

```text
rds-network-contract.yaml
```

Inclua:

```yaml
network:
  publicEndpoint:
    forbidden

  databaseSubnets:
    isolated:
      true

  inbound:
    PostgreSQL:
      sourceSecurityGroup:
        application

  outbound:
    minimumRequired:
      true

  dns:
    endpoint:
      required

    hardcodedIp:
      forbidden
```

---

### 4. Criar policy de segurança

Arquivo:

```text
rds-security-policy.yaml
```

Regras:

- no public access;
- no broad CIDR;
- encryption required;
- TLS required;
- no trust-all;
- no superuser for app;
- no shared account;
- no password in Git;
- no password in logs;
- deletion protection in prod;
- backups required;
- audit enabled.

---

### 5. Criar policy de credenciais

Arquivo:

```text
rds-credentials-policy.yaml
```

Conteúdo:

```yaml
credentials:
  runtimeUser:
    name:
      orders_app

    privileges:
      dmlOnly:
        true

  migrationUser:
    name:
      orders_migration

    privileges:
      ddlControlled:
        true

  storage:
    secretsManager:
      required

  rotation:
    required

  staticPasswordInRepository:
    forbidden
```

Os nomes são contratos didáticos.

Nenhuma senha será criada.

---

### 6. Criar o profile Spring Boot

Arquivo:

```text
src/main/resources/application-aws-rds.yml
```

Conteúdo:

```yaml
spring:
  datasource:
    url: ${DB_JDBC_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

    hikari:
      maximum-pool-size: ${DB_POOL_MAX:12}
      minimum-idle: ${DB_POOL_MIN:2}
      connection-timeout: ${DB_CONNECTION_TIMEOUT_MS:3000}
      validation-timeout: ${DB_VALIDATION_TIMEOUT_MS:1000}
      idle-timeout: ${DB_IDLE_TIMEOUT_MS:600000}
      max-lifetime: ${DB_MAX_LIFETIME_MS:1500000}
      keepalive-time: ${DB_KEEPALIVE_MS:300000}

  flyway:
    enabled: false
```

Nenhum default de endpoint, usuário ou senha é permitido.

---

### 7. Criar budget de conexões

Arquivo:

```text
rds-pool-budget.yaml
```

Conteúdo:

```yaml
poolBudget:
  maxApplicationReplicas:
    6

  maxPoolPerReplica:
    12

  migrationConnections:
    5

  operationsConnections:
    8

  reservedMargin:
    15

  calculatedTotal:
    100

  databaseLimit:
    decisionRequired
```

O validator recalcula o total.

---

### 8. Validar o cálculo

Execute:

```powershell
.\scripts\cloud\aws\rds\validate-rds-pool-budget.ps1
```

O script falha quando:

- total calculado diverge;
- database limit está abaixo do budget;
- margem está ausente;
- maxReplicas diverge do HPA;
- pool é zero ou excessivo;
- valores sensíveis aparecem.

---

### 9. Criar strategy de migrations

Arquivo:

```text
rds-migration-plan.yaml
```

Inclua:

```yaml
migrations:
  tool:
    flyway-or-liquibase

  execution:
    pipelineStage:
      required

  runtimePods:
    automaticMigration:
      false

  concurrency:
    singleExecutor:
      required

  strategy:
    expandAndContract:
      required

  destructiveChange:
    sameRelease:
      forbidden

  evidence:
    required
```

---

### 10. Criar backup e restore policy

Arquivo:

```text
rds-backup-restore-policy.yaml
```

Conteúdo:

```yaml
backup:
  automatic:
    required

  retentionDays:
    decisionRequired

  encryption:
    required

  preCriticalChangeSnapshot:
    required

restore:
  test:
    quarterly

  target:
    isolatedEnvironment

  dataValidation:
    required

  rpoMinutes:
    15

  rtoMinutes:
    60
```

Os números são didáticos.

---

### 11. Criar runbook de failover

Arquivo:

```text
rds-failover-runbook.yaml
```

Passos:

```yaml
failover:
  detect:
    - connection-errors
    - RDS-events
    - application-readiness
    - pool-failures

  protect:
    - stop-risky-deploys
    - limit-retries
    - preserve-idempotency

  recover:
    - reconnect-by-dns
    - discard-stale-connections
    - validate-write
    - validate-read
    - observe-latency

  close:
    - confirm-primary
    - collect-evidence
    - review-root-cause
```

---

### 12. Criar observability contract

Arquivo:

```text
rds-observability-contract.yaml
```

Inclua:

```yaml
observability:
  metrics:
    - cpu
    - free-memory
    - free-storage
    - connections
    - read-latency
    - write-latency
    - read-iops
    - write-iops
    - replication-lag
    - deadlocks

  application:
    - pool-active
    - pool-idle
    - pool-pending
    - datasource-errors
    - query-duration
    - migration-duration

  alarms:
    actionable:
      required

  logs:
    sensitiveData:
      forbidden
```

---

### 13. Criar policy de custos

Arquivo:

```text
rds-cost-policy.yaml
```

Inclua:

- instance class;
- Multi-AZ;
- storage;
- IOPS;
- backups;
- snapshots;
- monitoring;
- replicas;
- proxy;
- transfer;
- tags;
- budget;
- owner;
- cost per order.

---

### 14. Validar o blueprint

Execute:

```powershell
.\scripts\cloud\aws\rds\validate-rds-blueprint.ps1
```

O script bloqueia:

- public access;
- Single-AZ em produção;
- encryption ausente;
- deletion protection ausente;
- versão não registrada;
- subnet pública;
- SG amplo;
- credencial de admin;
- backup ausente.

---

### 15. Validar a rede

Execute:

```powershell
.\scripts\cloud\aws\rds\validate-rds-network.ps1
```

Confirme:

- duas AZs;
- subnets de dados;
- source Security Group;
- porta 5432;
- nenhuma origem pública;
- DNS endpoint obrigatório;
- IP fixo proibido.

---

### 16. Validar segurança

Execute:

```powershell
.\scripts\cloud\aws\rds\validate-rds-security.ps1
```

O script procura:

```text
0.0.0.0/0;

sslmode=disable;

trust-all;

password literal;

superuser;

publiclyAccessible true.
```

---

### 17. Validar migrations

Execute:

```powershell
.\scripts\cloud\aws\rds\validate-rds-migration-plan.ps1
```

O script exige:

- ferramenta;
- executor único;
- expand and contract;
- evidence;
- rollback ou roll-forward;
- nenhum DDL destrutivo no mesmo release.

---

### 18. Simular failover

Execute:

```powershell
.\scripts\cloud\aws\rds\simulate-rds-failover.ps1
```

A simulação offline percorre:

1. conexão ativa;
2. destino indisponível;
3. conexões quebradas;
4. retries limitados;
5. DNS resolve novo destino;
6. pool descarta conexões antigas;
7. readiness recupera;
8. escrita idempotente é validada;
9. evidence é registrada.

Nenhum banco real é acessado.

---

### 19. Simular restore

Execute:

```powershell
.\scripts\cloud\aws\rds\simulate-rds-restore.ps1
```

A simulação exige:

- backup source;
- restore point;
- ambiente isolado;
- schema validation;
- row count controlado;
- migration compatibility;
- smoke test;
- owner;
- cleanup.

Nenhum dado real será usado.

---

### 20. Criar evidence

Arquivo:

```text
rds-postgresql-evidence.json.
```

Campos permitidos:

- engine family;
- version decision status;
- public access false;
- minimum AZs;
- Multi-AZ required;
- encryption required;
- credentials source;
- TLS required;
- HPA max replicas;
- pool budget;
- migration executor;
- backup required;
- RPO;
- RTO;
- restore test frequency;
- failover simulation result;
- actual RDS instances zero;
- timestamp.

---

### 21. Criar documentação

#### `RDS_POSTGRESQL_ARCHITECTURE.md`

Explique endpoint, subnets, SG, Multi-AZ e read replicas.

#### `RDS_NETWORK_SECURITY.md`

Explique acesso privado, TLS, KMS e credentials.

#### `RDS_SPRING_BOOT_INTEGRATION.md`

Explique datasource e profile sem valores reais.

#### `RDS_CONNECTION_POOL.md`

Explique HikariCP, HPA e budget.

#### `RDS_MIGRATION_STRATEGY.md`

Explique pipeline, lock e expand and contract.

#### `RDS_BACKUP_RESTORE.md`

Explique backup, PITR, snapshots e restore test.

#### `RDS_FAILOVER.md`

Explique DNS, stale connections, retry e idempotência.

#### `RDS_OBSERVABILITY.md`

Explique métricas do banco e da aplicação.

---

### 22. Criar test matrix

Arquivo:

```text
RDS_TEST_MATRIX.md
```

Cenários:

- public access bloqueado;
- subnet pública bloqueada;
- SG amplo bloqueado;
- TLS obrigatório;
- trust-all bloqueado;
- Secret literal bloqueado;
- runtime user sem DDL;
- migration user controlado;
- pool budget válido;
- HPA compatível;
- executor único;
- destructive migration bloqueada;
- backup definido;
- restore test definido;
- failover simulado;
- DNS reconnect;
- stale connection removida;
- readiness recuperada;
- deletion protection;
- actual instance zero.

---

### 23. Criar troubleshooting

Arquivo:

```text
RDS_TROUBLESHOOTING.md
```

Inclua:

- connection timeout;
- DNS não resolve;
- SG bloqueando;
- subnet route incorreta;
- TLS handshake;
- CA inválida;
- password rotation;
- pool exhausted;
- too many connections;
- long transaction;
- lock;
- deadlock;
- storage low;
- failover;
- replica lag;
- migration lock;
- restore incompatível;
- deletion denied;
- custo inesperado.

---

### 24. Executar gate final

Execute:

```powershell
.\scripts\cloud\aws\rds\validate-rds-blueprint.ps1

.\scripts\cloud\aws\rds\validate-rds-network.ps1

.\scripts\cloud\aws\rds\validate-rds-security.ps1

.\scripts\cloud\aws\rds\validate-rds-pool-budget.ps1

.\scripts\cloud\aws\rds\validate-rds-migration-plan.ps1

.\scripts\cloud\aws\rds\simulate-rds-failover.ps1

.\scripts\cloud\aws\rds\simulate-rds-restore.ps1

.\scripts\cloud\aws\rds\collect-rds-evidence.ps1

.\scripts\cloud\aws\rds\verify-rds-baseline.ps1
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
- profile sem valores reais;
- nenhuma senha;
- nenhum endpoint;
- nenhuma instância;
- nenhuma cobrança;
- ponte pronta para SQS SNS.

---

## Entendendo o que foi feito

### RDS ganhou arquitetura

Ele deixou de ser tratado como um formulário de console.

### Rede ficou privada

A aplicação acessa o banco por Security Group e DNS.

### Multi-AZ ganhou objetivo correto

Alta disponibilidade foi separada de escala de leitura.

### Credenciais ganharam lifecycle

Secrets, rotação e usuários separados entraram no contrato.

### Spring Boot ganhou profile seguro

A configuração usa environment sem defaults sensíveis.

### Pool ganhou budget

HPA e HikariCP passaram a compartilhar um limite de conexões.

### Migrations ganharam executor único

DDL não disputa com todos os Pods.

### Failover ganhou comportamento de aplicação

DNS, conexões antigas, retries e idempotência foram considerados.

### Backup ganhou restore test

RPO e RTO deixaram de ser apenas números.

### A próxima aula ganhou continuidade

SQS e SNS serão estudados sem misturar persistência relacional com mensageria.

---

## Erros comuns importantes

### Criar RDS público para facilitar acesso

Use rede privada e acesso controlado.

### Abrir 5432 para qualquer origem

Restrinja ao Security Group da aplicação.

### Usar superuser na aplicação

Separe runtime, migration e administração.

### Colocar senha no YAML

Use Secrets Manager ou mecanismo equivalente.

### Ativar migration em todos os Pods

Use executor único e pipeline controlado.

### Aumentar pool sem calcular HPA

O banco pode atingir o limite de conexões.

### Confundir Multi-AZ com read replica

Os objetivos são diferentes.

### Desativar validação TLS

Use cadeia confiável e hostname validation.

### Confiar em backup sem restore

A recuperação não está comprovada.

### Fixar IP do endpoint

Use DNS e reconexão.

### Criar SQS ou SNS nesta aula

A aula 540 possui esse objetivo.

---

## Comandos úteis

### Validar blueprint

```powershell
.\scripts\cloud\aws\rds\validate-rds-blueprint.ps1
```

### Validar pool

```powershell
.\scripts\cloud\aws\rds\validate-rds-pool-budget.ps1
```

### Validar migrations

```powershell
.\scripts\cloud\aws\rds\validate-rds-migration-plan.ps1
```

### Simular failover

```powershell
.\scripts\cloud\aws\rds\simulate-rds-failover.ps1
```

### Simular restore

```powershell
.\scripts\cloud\aws\rds\simulate-rds-restore.ps1
```

---

## Exercício guiado

### Parte 1 — Architecture

Crie o blueprint de RDS.

### Parte 2 — Network

Defina subnets e Security Group.

### Parte 3 — Credentials

Separe runtime e migration.

### Parte 4 — Spring

Crie o profile seguro.

### Parte 5 — Pool

Calcule o budget com HPA.

### Parte 6 — Migration

Defina executor único.

### Parte 7 — Backup

Defina RPO, RTO e restore test.

### Parte 8 — Failover

Simule DNS e stale connections.

### Parte 9 — Observability

Defina métricas e alarms.

### Parte 10 — Evidence

Comprove readiness sem recurso real.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 538 foi preservada;
- ponte para a aula 540 está correta;
- RDS PostgreSQL foi definido;
- endpoint DNS foi explicado;
- IP fixo foi proibido;
- rede privada foi exigida;
- DB subnet group foi definido;
- duas AZs foram exigidas;
- Security Group restrito foi definido;
- porta 5432 pública foi proibida;
- Single-AZ e Multi-AZ foram diferenciados;
- Multi-AZ e read replica foram diferenciados;
- eventual consistency de replica foi explicada;
- Aurora foi apresentada como alternativa;
- engine version explícita foi exigida;
- maintenance window foi definida;
- parameter group foi definido;
- storage, IOPS, throughput e crescimento foram considerados;
- KMS e encryption at rest foram exigidos;
- TLS e hostname validation foram exigidos;
- trust-all e `sslmode=disable` foram proibidos;
- Secrets Manager foi definido;
- superuser da aplicação foi proibido;
- usuários runtime e migration foram separados;
- migrations versionadas e executor único foram exigidos;
- expand and contract foi explicado;
- HikariCP foi configurado;
- maxReplicas foi relacionado ao pool;
- budget de conexões foi calculado;
- timeouts de pool foram definidos;
- profile `aws-rds` foi criado sem valores reais;
- failover foi relacionado a DNS, stale connections e retry limitado;
- liveness e readiness foram diferenciadas;
- backup, PITR, snapshot e restore foram explicados;
- deletion protection foi exigida;
- observabilidade de banco e aplicação foi definida;
- autovacuum, locks e query plans foram considerados;
- extensões exigem validação;
- RDS Proxy foi discutido sem implementação;
- custos foram modelados;
- baseline local permaneceu saudável;
- blueprint foi criado;
- network contract foi criado;
- security policy foi criada;
- credentials policy foi criada;
- backup restore policy foi criada;
- failover runbook foi criado;
- observability contract foi criado;
- cost policy foi criada;
- `application-aws-rds.yml` foi criado;
- `rds-pool-budget.yaml` foi criado;
- migration plan foi criado;
- validators offline foram criados;
- public access foi bloqueado;
- SG amplo foi bloqueado;
- senha literal foi bloqueada;
- pool divergente foi bloqueado;
- destructive migration no mesmo release foi bloqueada;
- failover foi simulado;
- restore foi simulado;
- evidence foi sanitizada;
- actual RDS instances ficou em zero;
- documentação, test matrix e troubleshooting foram criados;
- nenhuma conta, credencial, subnet, SG, Secret, snapshot ou RDS real foi criado;
- SQS e SNS não foram antecipados;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/aws/rds `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-aws-rds.yml `
  scripts/cloud/aws/rds `
  docs/devops/aws-rds `
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
      "password:|jdbc:postgresql://.*amazonaws.com|AKIA|ASIA|arn:aws:|sslmode=disable"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): preparar RDS PostgreSQL"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- senha;
- endpoint;
- ARN;
- account ID;
- access key;
- Secret;
- snapshot;
- dump;
- dados reais;
- resource state;
- SQS ou SNS da aula 540.

---

## Fechamento e ponte para a próxima aula

Nesta aula, PostgreSQL gerenciado deixou de ser tratado como apenas um endpoint e uma senha.

O modelo passou a possuir:

```text
subnet group;

Security Group;

Multi-AZ;

engine version;

parameter group;

storage;

KMS;

TLS;

Secrets;

roles PostgreSQL;

migrations;

HikariCP;

backup;

restore;

failover;

observabilidade.
```

Você comprovou que RDS reduz operação de infraestrutura, mas não elimina responsabilidades de schema, queries, índices, pool, migrations, dados, restore e custos; o banco permanece privado; a aplicação usa DNS e TLS; runtime e migration possuem usuários diferentes; HPA e pool compartilham um budget de conexões; migrations usam executor único; Multi-AZ atende disponibilidade e read replica atende leitura; failover exige reconexão e idempotência; backup precisa de restore test; e deletion protection não substitui governança.

A próxima aula será:

```text
540 - M17.35 - SQS SNS
```

Nela, você irá aprofundar filas, pub/sub, delivery, visibility timeout, dead-letter queues, retries, idempotência, ordering, fan-out e integração segura com aplicações Java.

Nenhuma fila SQS, tópico SNS, subscription, policy ou dead-letter queue foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o blueprint de RDS.
- [ ] Modelei rede privada e Security Group.
- [ ] Separei credenciais de runtime e migration.
- [ ] Criei o profile Spring Boot.
- [ ] Calculei o budget do pool.
- [ ] Defini backup, restore e failover.
- [ ] Gerei evidence sanitizada.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### A aplicação não conecta

Revise DNS, Security Group, subnet, TLS, credencial e timeout.

### O pool fica esgotado

Revise query lenta, transação longa, leak, pool por Pod e maxReplicas.

### O failover demora a recuperar

Revise DNS, `maxLifetime`, stale connections, timeout e retry.

### A migration trava

Revise lock, executor único, DDL, timeout e concorrência.

### O restore não atende ao RPO

A retenção e frequência não atendem ao contrato.

### A réplica retorna dado antigo

A replicação é assíncrona; use o primário quando precisar de read-your-writes.

### O banco está público

Bloqueie o blueprint e mova para subnets privadas.

### A senha apareceu no diff

Remova, rotacione e revise o processo de Secret.

### O custo aumentou

Revise instance class, Multi-AZ, storage, IOPS, snapshots e monitoring.

### Uma fila apareceu nesta aula

Remova e preserve para a aula 540.

---

## Perguntas de revisão

1. O que é Amazon RDS?
2. O que é DB subnet group?
3. Por que o banco deve ficar privado?
4. Qual a diferença entre Multi-AZ e read replica?
5. Por que usar endpoint DNS?
6. Para que serve parameter group?
7. Por que fixar engine version?
8. Como proteger a senha?
9. Por que separar runtime e migration user?
10. O que é expand and contract?
11. Como calcular o pool total?
12. Para que serve `maxLifetime`?
13. Como a aplicação reage ao failover?
14. O que é PITR?
15. Por que testar restore?
16. Para que serve deletion protection?
17. Quais métricas observar?
18. Quando avaliar RDS Proxy?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Banco relacional gerenciado.
2. Grupo de subnets do banco.
3. Reduzir exposição.
4. Disponibilidade e leitura assíncrona.
5. Permitir mudança de destino.
6. Configurar engine.
7. Controlar compatibilidade.
8. Secret manager e rotação.
9. Menor privilégio.
10. Migração compatível em fases.
11. Réplicas vezes pool mais margem.
12. Renovar conexões.
13. Reabre conexões com retry limitado.
14. Restore para um ponto no tempo.
15. Comprovar recuperação.
16. Reduzir exclusão acidental.
17. CPU, memória, storage, IOPS, conexões e latency.
18. Muitas conexões e picos.
19. Instância e credenciais reais.
20. SQS SNS.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 539 - M17.34 - RDS PostgreSQL

- Continuei após AWS visão backend.
- Defini RDS PostgreSQL como banco gerenciado.
- Modelei endpoint DNS e rede privada.
- Modelei DB subnet group com múltiplas AZs.
- Restringi a porta 5432 ao Security Group da aplicação.
- Diferenciei Single-AZ, Multi-AZ e read replica.
- Estudei consistência eventual das réplicas.
- Diferenciei RDS PostgreSQL e Aurora PostgreSQL-Compatible.
- Exigi engine version explícita.
- Modelei maintenance window e parameter group.
- Modelei storage, IOPS, throughput e crescimento.
- Exigi encryption at rest com KMS.
- Exigi TLS e hostname validation.
- Proibi trust-all e `sslmode=disable`.
- Modelei Secrets Manager e rotação.
- Separei usuários de runtime, migration e administração.
- Modelei migrations com executor único.
- Apliquei expand and contract.
- Criei o profile `application-aws-rds.yml`.
- Dimensionei HikariCP com o máximo de réplicas do HPA.
- Defini timeouts e lifecycle das conexões.
- Modelei failover, DNS e stale connections.
- Modelei backup, PITR, snapshots e restore test.
- Exigi deletion protection em produção.
- Modelei observabilidade do banco e do pool.
- Simulei failover e restore sem acessar AWS.
- Criei policies, scripts, evidence e troubleshooting.
- Não criei instância, credencial ou endpoint RDS.
- Não antecipei SQS e SNS.
- Próxima aula: SQS SNS.
```

---

## Referência técnica curta

- Amazon RDS for PostgreSQL.
- Amazon RDS Multi-AZ.
- Amazon RDS Read Replicas.
- Amazon RDS Backups and Point-in-Time Recovery.
- Amazon RDS Encryption.
- PostgreSQL JDBC Driver.
- Spring Boot DataSource Configuration.
- HikariCP Configuration.
- Flyway and Liquibase.
- PostgreSQL High Availability Concepts.

Regra final:

```text
RDS PostgreSQL deve ser tratado como uma arquitetura de dados gerenciada, não como um endpoint público com senha: DB subnet group cobre subnets privadas em múltiplas AZs, Security Group aceita 5432 somente da aplicação, Multi-AZ protege disponibilidade e read replicas atendem leituras tolerantes a atraso; engine version, maintenance window, parameter group, storage, KMS, TLS, backups, snapshots, PITR, deletion protection e observabilidade formam o contrato do serviço; credenciais ficam em secret manager, runtime, migration e administração usam identidades separadas, e nenhum superuser chega à aplicação; Spring Boot recebe URL, usuário e senha em runtime, HikariCP é dimensionado por maxReplicas e budget total do banco, migrations usam executor único e expand-and-contract; failover interrompe conexões e exige DNS, descarte de stale connections, retry limitado e idempotência, enquanto backup só é confiável quando restore é testado contra RPO e RTO; nenhuma instância, subnet, Secret ou endpoint real é criado, deixando para a aula 540 filas e pub/sub com SQS e SNS.
```
