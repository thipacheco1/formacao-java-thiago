# 543 - M17.38 - Custos cloud

## Apresentação da aula

Na aula 542, você modelou Object Storage S3 conceitual.

A aplicação passou a tratar arquivos e artefatos com:

```text
buckets privados;

keys opacas;

versioning;

lifecycle;

checksums;

presigned URLs;

reconciliação;

observabilidade.
```

Essa arquitetura melhora segurança, governança e escalabilidade.

Entretanto, cada decisão técnica possui efeito financeiro.

Exemplos:

```text
mais réplicas
aumentam compute;

mais retenção
aumenta storage;

mais logs
aumentam ingestão
e armazenamento;

mais zonas
aumentam resiliência
e podem aumentar custo;

mais tráfego entre regiões
aumenta transferência;

mais serviços gerenciados
reduzem operação,
mas possuem preço próprio.
```

A pergunta central desta aula será:

```text
como projetar,
medir
e otimizar
custos cloud

sem sacrificar
segurança,
confiabilidade
e capacidade?
```

A resposta será construída com princípios de FinOps.

FinOps integra:

- engenharia;
- produto;
- finanças;
- operações;
- segurança;
- liderança.

O objetivo não é apenas reduzir a conta.

O objetivo é:

```text
maximizar valor
por unidade de custo.
```

Uma redução que causa indisponibilidade, perda de dados ou risco de segurança não é otimização.

É transferência de risco.

A regra central será:

```text
custo é
requisito arquitetural;

não é apenas
resultado financeiro
depois do deploy.
```

Nesta aula, nenhum preço atual de fornecedor será inventado.

Não haverá:

- consulta de conta real;
- billing export real;
- Cost Explorer real;
- orçamento real;
- cartão;
- commitment;
- Savings Plan;
- Reserved Instance;
- compra;
- recomendação financeira vinculante;
- recurso cloud;
- credencial;
- account ID;
- invoice;
- dado corporativo real.

Você criará:

- catálogo de drivers de custo;
- política de tags;
- política de budgets;
- modelo de custo unitário;
- envelope de capacidade;
- matriz de ambientes;
- política de retenção;
- auditoria de desperdícios;
- cenários de otimização;
- scripts de estimativa;
- evidence sanitizada.

A próxima aula será:

```text
544 - M17.39 - Observacoes de seguranca cloud
```

Por isso, segurança será considerada como constraint obrigatória, mas o aprofundamento de threat model, posture e controles cloud ficará para a aula seguinte.

---

## Onde estamos na formação

A sequência oficial é:

```text
541:
Redis gerenciado conceitual.

542:
Object Storage S3 conceitual.

543:
Custos cloud.

544:
Observacoes de seguranca cloud.

545:
Cloud readiness checklist.
```

A aula 542 respondeu:

```text
como armazenar
arquivos e artefatos

com segurança,
integridade
e lifecycle?
```

A aula 543 responderá:

```text
como transformar
consumo técnico

em custo observável,
atribuível
e otimizável?
```

Nesta aula:

```text
FinOps:
sim.

cost allocation:
sim.

tagging:
sim.

budgets:
sim.

forecast:
sim.

showback:
sim.

chargeback:
sim.

unit economics:
sim.

rightsizing:
sim.

commitments:
conceitual.

spot capacity:
conceitual.

storage lifecycle:
sim.

data transfer:
sim.

NAT:
sim.

observability cost:
sim.

idle resources:
sim.

environment schedules:
sim.

anomaly detection:
sim.

actual pricing:
não.

billing account:
não.

segurança detalhada:
não.
```

A regra operacional será:

```text
medir;

atribuir;

explicar;

otimizar;

validar impacto;

registrar resultado.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
cloud/cost
├── cloud-cost-driver-catalog.yaml
├── cloud-tagging-policy.yaml
├── cloud-budget-policy.yaml
├── cloud-unit-economics.yaml
├── cloud-capacity-cost-envelope.yaml
├── cloud-environment-cost-policy.yaml
├── cloud-storage-retention-cost-policy.yaml
├── cloud-observability-cost-policy.yaml
├── cloud-data-transfer-cost-policy.yaml
├── cloud-commitment-readiness.yaml
├── cloud-cost-optimization-backlog.yaml
└── cloud-cost-readiness-checklist.yaml

scripts/cloud/cost
├── validate-cost-driver-catalog.ps1
├── validate-tagging-policy.ps1
├── validate-budget-policy.ps1
├── calculate-unit-cost.ps1
├── estimate-capacity-cost-units.ps1
├── simulate-rightsizing.ps1
├── simulate-environment-scheduling.ps1
├── audit-idle-resources.ps1
├── audit-storage-retention.ps1
├── audit-observability-cost.ps1
├── audit-data-transfer-cost.ps1
├── generate-cost-decision-summary.ps1
└── collect-cloud-cost-evidence.ps1

docs/devops/cloud-cost
├── FINOPS_FOR_BACKEND.md
├── CLOUD_COST_DRIVERS.md
├── TAGGING_AND_ALLOCATION.md
├── BUDGETS_FORECASTS_ANOMALIES.md
├── UNIT_ECONOMICS.md
├── RIGHTSIZING_AND_SCALING.md
├── STORAGE_AND_RETENTION_COSTS.md
├── DATA_TRANSFER_AND_NETWORK_COSTS.md
├── OBSERVABILITY_COSTS.md
├── COMMITMENTS_AND_SPOT.md
├── CLOUD_COST_TEST_MATRIX.md
└── CLOUD_COST_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
drivers catalogados;

custos atribuíveis;

tags obrigatórias;

budgets por ambiente;

custo por pedido;

capacidade em unidades;

desperdícios detectados;

retention revisada;

data transfer revisado;

telemetry revisada;

backlog priorizado;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline;
2. definir FinOps;
3. classificar tipos de custo;
4. criar catálogo de drivers;
5. definir tags;
6. definir owner;
7. definir cost center;
8. definir budgets;
9. definir forecasts;
10. definir anomalies;
11. definir showback;
12. definir chargeback;
13. definir custo unitário;
14. estimar compute;
15. estimar banco;
16. estimar mensageria;
17. estimar cache;
18. estimar object storage;
19. estimar observabilidade;
20. estimar transferência;
21. revisar NAT;
22. revisar ambientes ociosos;
23. simular rightsizing;
24. simular scheduling;
25. revisar commitments;
26. revisar Spot;
27. criar backlog;
28. criar scripts;
29. criar documentação;
30. gerar evidence;
31. executar gate;
32. commitar;
33. preparar a aula 544.

---

## Conceito essencial

### FinOps

Prática operacional que conecta tecnologia, finanças e negócio para maximizar valor da cloud.

---

### Cost allocation

Atribuição de custos a aplicações, ambientes, equipes ou produtos.

---

### Tag

Metadata usada para ownership, ambiente, centro de custo e governança.

---

### Budget

Limite financeiro planejado para um período e escopo.

---

### Forecast

Estimativa de consumo futuro.

---

### Anomaly

Variação inesperada em relação ao comportamento esperado.

---

### Showback

Apresentação dos custos para quem consome, sem cobrança interna obrigatória.

---

### Chargeback

Cobrança interna baseada no consumo atribuído.

---

### Unit economics

Custo associado a uma unidade de negócio.

Exemplos:

```text
custo por pedido;

custo por usuário ativo;

custo por evento;

custo por gigabyte processado.
```

---

### Rightsizing

Adequação da capacidade ao workload real.

---

### Commitment

Compromisso de uso ou gasto em troca de condição comercial diferenciada.

---

### Spot capacity

Capacidade com preço variável e possibilidade de interrupção, adequada somente a workloads tolerantes.

---

### Total Cost of Ownership

Custo total considerando tecnologia, pessoas, operação, risco, suporte e lifecycle.

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
- duas réplicas mínimas;
- HPA definido;
- RDS apenas modelado;
- SQS, SNS, Redis e S3 apenas simulados;
- nenhum recurso cloud real.

---

### 2. Separar custo fixo, variável e indireto

Custos fixos permanecem mesmo sem tráfego, como control plane, load balancer ou capacidade mínima. Custos variáveis crescem com requests, CPU, mensagens, bytes, storage e transfer. Custos indiretos incluem engenharia, incidentes, manutenção, compliance e complexidade. A análise precisa considerar os três.

---

### 3. Criar catálogo de drivers

Arquivo:

```text
cloud-cost-driver-catalog.yaml
```

Conteúdo:

```yaml
drivers:
  compute:
    units:
      - vcpu-hour
      - memory-gib-hour
      - instance-hour
      - request

  database:
    units:
      - instance-hour
      - storage-gib-month
      - iops
      - backup-gib
      - replica-hour

  messaging:
    units:
      - request
      - message
      - payload-byte
      - retention

  cache:
    units:
      - node-hour
      - memory-gib
      - shard
      - replica

  objectStorage:
    units:
      - storage-gib-month
      - put-request
      - get-request
      - retrieval-byte
      - transfer-byte
      - noncurrent-version

  observability:
    units:
      - ingested-byte
      - stored-byte
      - metric
      - trace
      - query

  network:
    units:
      - nat-hour
      - nat-byte
      - cross-zone-byte
      - cross-region-byte
      - internet-egress-byte

  security:
    units:
      - scan
      - secret
      - key-operation
      - analyzed-event
```

---

### 4. Entender preço versus custo

Preço é a tarifa de uma unidade.

Custo é:

```text
quantidade consumida
x
preço aplicável.
```

Exemplo abstrato:

```text
100 unidades
x
0,02 unidade monetária
=
2 unidades monetárias.
```

Nesta aula, todos os cálculos usarão preços fictícios ou unidades normalizadas.

Nenhum número será apresentado como preço vigente de fornecedor.

---

### 5. Criar política de tags

Arquivo:

```text
cloud-tagging-policy.yaml
```

Conteúdo:

```yaml
tags:
  required:
    - application
    - environment
    - owner-role
    - cost-center
    - business-unit
    - lifecycle
    - data-classification
    - managed-by

  values:
    environment:
      allowed:
        - dev
        - hml
        - prod

    managed-by:
      allowed:
        - iac
        - platform
        - provider-managed

  forbidden:
    - password
    - token
    - email
    - personal-name

  untaggedResource:
    severity:
      high

  inheritance:
    documented:
      required
```

---

### 6. Tags não são segurança

Tags ajudam em governança.

Elas não impedem acesso por si só.

A autorização continua em:

- IAM;
- RBAC;
- policies;
- resource policies;
- network controls.

Também não assuma que todos os serviços propagam tags da mesma maneira.

O validator precisa conferir presença e valores.

---

### 7. Owner

Todo custo precisa de owner.

Owner não deve ser uma pessoa isolada.

Use responsabilidade organizacional.

Exemplos:

```text
team-orders;

platform-team;

security-operations;

data-platform.
```

Isso reduz dependência de nomes individuais.

---

### 8. Cost center e business unit

Cost center permite atribuição financeira.

Business unit conecta custo ao domínio de negócio.

Eles precisam ser validados contra um catálogo interno.

Nesta aula, serão usados identificadores fictícios.

---

### 9. Criar política de budgets

Arquivo:

```text
cloud-budget-policy.yaml
```

Conteúdo:

```yaml
budgets:
  environments:
    dev:
      monthlyUnits:
        100

      alertsPercent:
        - 50
        - 80
        - 100

    hml:
      monthlyUnits:
        200

      alertsPercent:
        - 50
        - 80
        - 100

    prod:
      monthlyUnits:
        1000

      alertsPercent:
        - 50
        - 75
        - 90
        - 100

  owner:
    required

  action:
    automaticShutdownProduction:
      forbidden

  review:
    monthly:
      required
```

Os valores são unidades didáticas.

---

### 10. Budget não é kill switch

Atingir budget não significa desligar produção automaticamente.

Uma ação automática sem contexto pode causar indisponibilidade.

Budgets servem para:

- alertar;
- investigar;
- aprovar;
- ajustar;
- prever;
- comunicar.

Ambientes não produtivos podem possuir automações de suspensão controlada.

Produção exige decisão humana e runbook.

---

### 11. Forecast

Forecast combina histórico, tendência, sazonalidade, crescimento, releases, retenção e mudanças de arquitetura. Premissas precisam ser explícitas e versionadas.

---

### 12. Anomaly detection

Anomaly é uma mudança inesperada, como egress sem aumento de pedidos, logs duplicados após deploy, NAT fora do padrão, snapshots esquecidos ou replicas ociosas. A investigação diferencia mudança legítima, bug, abuso, configuração e recurso órfão.

---

### 13. Showback e chargeback

Showback apresenta consumo e custo por equipe.

Chargeback transfere cobrança internamente.

A organização pode começar por showback.

Isso incentiva transparência sem criar conflito de cobrança antes de a alocação estar madura.

Chargeback exige:

- tags confiáveis;
- shared cost allocation;
- critérios acordados;
- tratamento de custos comuns;
- governança;
- contestação;
- auditoria.

---

### 14. Criar modelo de unit economics

Arquivo:

```text
cloud-unit-economics.yaml
```

Conteúdo:

```yaml
unitEconomics:
  primaryMetric:
    name:
      cost-per-order

    formula:
      totalAttributedCost / successfulOrders

  secondaryMetrics:
    - name:
        cost-per-api-request

      formula:
        apiAttributedCost / validApiRequests

    - name:
        cost-per-event

      formula:
        messagingAttributedCost / processedEvents

    - name:
        cost-per-stored-document

      formula:
        storageAttributedCost / activeDocuments

  exclusions:
    failedBusinessOrders:
      reviewed

    internalTraffic:
      classified

  period:
    monthly
```

---

### 15. Custo por pedido

Fórmula:

```text
custo atribuído
/
pedidos concluídos.
```

Não use pedidos criados se muitos são cancelados ou falham sem explicar a escolha.

A unidade precisa representar valor de negócio.

Uma redução de custo por pedido pode ocorrer por:

- mais volume com mesma base;
- rightsizing;
- melhor cache;
- menos retries;
- melhor batch;
- menor retenção;
- redução de logs;
- eliminação de desperdício.

---

### 16. Shared costs

Rede central, observabilidade, segurança, suporte, CI/CD e clusters compartilhados precisam de regra explícita de alocação, baseada em uso, workloads, CPU, requests, storage ou centro de custo comum. ---

### 17. Criar envelope de capacidade e custo

Arquivo:

```text
cloud-capacity-cost-envelope.yaml
```

Conteúdo:

```yaml
capacity:
  application:
    minimumReplicas:
      2

    maximumReplicas:
      6

    cpuPerReplica:
      millicores:
        500

    memoryPerReplica:
      mebibytes:
        512

  database:
    maxConnections:
      decisionRequired

    storageGrowthGiBPerMonth:
      decisionRequired

  messaging:
    messagesPerOrder:
      estimate:
        4

  cache:
    lookupPerOrder:
      estimate:
        8

  objectStorage:
    documentsPerOrder:
      estimate:
        1

    averageDocumentKiB:
      decisionRequired

  observability:
    logKiBPerRequest:
      decisionRequired
```

---

### 18. Compute

Compute depende de réplicas, CPU, memória, tempo ligado, runtime, autoscaling e nodes ociosos. Requests superdimensionados reduzem densidade; requests pequenos demais causam throttling, OOM e instabilidade.

---

### 19. Rightsizing de compute

Rightsizing usa percentis, throttling, memory working set, OOM, GC, latency, saturation e headroom. Média simples não basta. Mudanças passam por teste, canary, observabilidade e rollback.

---

### 20. Simular rightsizing

Execute:

```powershell
.\scripts\cloud\cost\simulate-rightsizing.ps1
```

Cenário didático:

```text
antes:
4 réplicas fixas,
1 unidade de CPU,
1 GiB cada.

depois:
2 réplicas mínimas,
6 máximas,
0,5 CPU,
512 MiB,
HPA.
```

A simulação calcula unidades de capacidade.

Ela não afirma economia monetária real.

---

### 21. HPA e custo

HPA reduz ou aumenta capacidade conforme métrica.

Ele pode economizar quando reduz réplicas.

Também pode aumentar custo durante carga.

A policy exige:

- minReplicas justificadas;
- maxReplicas limitadas;
- requests corretos;
- stabilization;
- alarms;
- capacity do banco;
- cost anomaly.

Autoscaling sem limite pode transferir um ataque para a invoice.

---

### 22. Banco

Banco depende de instance class, Multi-AZ, replicas, storage, IOPS, backups, snapshots, monitoring e transfer. Otimização começa em queries, índices, pool, retention e rightsizing. Multi-AZ de produção não é removido sem decisão explícita de risco.

---

### 23. Connection pool e custo

Pool excessivo pode forçar classe maior de banco.

Use:

```text
maxReplicas
x
pool por réplica
+
margem
<=
budget.
```

Melhorar queries e limitar concorrência pode evitar scaling vertical prematuro.

---

### 24. Mensageria

Mensageria depende de requests, payload, retenção, consumers, retries, DLQ, encryption e transfer. Batch, long polling, filtros, payload pequeno e retry limitado reduzem desperdício sem remover idempotência.

---

### 25. Cache

Cache depende de node size, replicas, shards, Multi-AZ, transfer e headroom. TTL coerente, payload menor, redução de hot keys e rightsizing evitam desperdício. Hit ratio alta com dado inútil não representa valor.

---

### 26. Object storage

Drivers:

- bytes armazenados;
- classe;
- requests;
- retrieval;
- transfer;
- versioning;
- noncurrent versions;
- multipart incompleto;
- replication;
- KMS;
- logs;
- objects órfãos.

Otimizações:

- lifecycle;
- cleanup;
- compressão adequada;
- retenção por domínio;
- versioning controlado;
- abort multipart;
- evitar objetos pequenos excessivos quando isso prejudicar o modelo;
- reduzir egress.

A aula 542 criou os contracts necessários.

---

### 27. Criar policy de storage e retenção

Arquivo:

```text
cloud-storage-retention-cost-policy.yaml
```

Conteúdo:

```yaml
storage:
  objectStorage:
    lifecycle:
      required

    noncurrentVersions:
      retention:
        explicit

    incompleteMultipart:
      cleanup:
        required

    orphanObjects:
      reconciliation:
        required

  database:
    backups:
      retention:
        explicit

    snapshots:
      owner:
        required

  logs:
    retention:
      explicit

  unknownRetention:
    forbidden
```

---

### 28. Observabilidade

Observabilidade também custa.

Drivers:

- log volume;
- metrics cardinality;
- traces;
- sampling;
- retention;
- indexing;
- queries;
- dashboards;
- alarms;
- export;
- archive.

Otimização não significa apagar sinais essenciais.

Significa:

- logar o necessário;
- redigir dados;
- controlar debug;
- sampling;
- cardinality;
- retenção;
- tiers;
- archive;
- queries eficientes.

---

### 29. Criar policy de custos de observabilidade

Arquivo:

```text
cloud-observability-cost-policy.yaml
```

Conteúdo:

```yaml
observabilityCost:
  logs:
    structured:
      required

    debugInProduction:
      default:
        disabled

    retention:
      explicit

    sensitiveData:
      forbidden

  metrics:
    highCardinality:
      approvalRequired

  traces:
    sampling:
      required

  dashboards:
    owner:
      required

  alarms:
    actionable:
      required

  archive:
    lifecycle:
      required
```

---

### 30. Cardinalidade

Uma métrica com label por:

- user ID;
- order ID;
- request ID;
- full URL;

pode gerar cardinalidade explosiva.

Use métricas agregadas.

Identificadores individuais pertencem a logs ou traces controlados, não a labels de métricas.

---

### 31. Data transfer

Transferência pode ocorrer:

- internet;
- entre AZs;
- entre regiões;
- entre serviços;
- por NAT;
- para observabilidade externa;
- para parceiros.

O fluxo precisa ser desenhado.

Arquitetura funcional pode ter custo alto por mover dados demais.

---

### 32. Criar policy de data transfer

Arquivo:

```text
cloud-data-transfer-cost-policy.yaml
```

Conteúdo:

```yaml
dataTransfer:
  crossRegion:
    architectureReview:
      required

  crossZone:
    measured:
      required

  internetEgress:
    owner:
      required

  nat:
    traffic:
      reviewed

  privateEndpoint:
    comparison:
      required

  observabilityExport:
    volume:
      measured

  unknownFlow:
    forbidden
```

---

### 33. NAT

NAT pode cobrar por tempo e dados processados, conforme o provedor e arquitetura.

Investigue:

- downloads de imagens;
- chamadas a serviços cloud;
- telemetry;
- package repositories;
- APIs externas;
- backups;
- atualizações.

Private endpoints podem reduzir alguns fluxos via NAT.

Eles também possuem custo e complexidade.

A comparação precisa usar o padrão real de tráfego.

---

### 34. Ambientes não produtivos

Dev e hml podem permanecer ociosos.

Estratégias:

- schedules;
- scale to zero quando suportado;
- desligar banco;
- reduzir réplicas;
- remover ambientes temporários;
- expirar previews;
- compartilhamento controlado;
- datasets menores.

Produção não deve receber a mesma automação sem análise.

---

### 35. Criar policy por ambiente

Arquivo:

```text
cloud-environment-cost-policy.yaml
```

Conteúdo:

```yaml
environments:
  dev:
    schedule:
      allowed

    minimumCapacity:
      reduced

    productionData:
      forbidden

  hml:
    schedule:
      reviewed

    representativeCapacity:
      requiredForPerformanceTests

  prod:
    automaticShutdown:
      forbidden

    highAvailability:
      required

  ephemeral:
    expirationHours:
      required

    owner:
      required
```

---

### 36. Simular scheduling

Execute:

```powershell
.\scripts\cloud\cost\simulate-environment-scheduling.ps1
```

A simulação compara unidades ligadas:

```text
24 horas por dia;

12 horas por dia;

dias úteis;

ambiente temporário.
```

Ela registra o percentual de unidades evitadas.

Não desliga recurso real.

---

### 37. Recursos ociosos

Discos sem instância, snapshots sem owner, IPs, load balancers, NATs, clusters, buckets, logs, replicas e filas sem uso precisam de owner e ação documentada.

---

### 38. Auditar recursos ociosos

Execute:

```powershell
.\scripts\cloud\cost\audit-idle-resources.ps1
```

O script usa um inventário fictício.

Classificações:

```text
keep;

rightsize;

schedule;

delete-after-approval;

investigate.
```

Nenhum delete automático será realizado.

---

### 39. Commitments

Commitments podem reduzir preço em troca de compromisso.

Exemplos conceituais:

- capacidade reservada;
- compromisso de gasto;
- reserva de banco;
- contrato empresarial.

Antes de comprometer:

- baseline estável;
- forecast confiável;
- ownership;
- duração;
- flexibilidade;
- break-even;
- risco de mudança;
- cobertura;
- utilização.

Não compre commitment para workload ainda volátil.

---

### 40. Criar readiness de commitments

Arquivo:

```text
cloud-commitment-readiness.yaml
```

Conteúdo:

```yaml
commitment:
  historicalUsageMonths:
    minimum:
      3

  forecastConfidence:
    required

  architectureStable:
    required

  owner:
    required

  breakEvenAnalysis:
    required

  coverageTarget:
    decisionRequired

  utilizationTarget:
    decisionRequired

  approval:
    financial:
      required

    engineering:
      required

  actualPurchase:
    forbiddenInThisLesson
```

---

### 41. Spot capacity

Spot pode reduzir custo de workloads interrompíveis.

Adequado para:

- batch;
- CI;
- workers idempotentes;
- processamento reexecutável;
- jobs com checkpoint;
- capacidade complementar.

Inadequado como única capacidade para:

- banco;
- workload sem retry;
- operação não idempotente;
- sistema crítico sem fallback.

A interrupção precisa ser parte do design.

---

### 42. TCO

TCO compara escopos equivalentes e inclui hardware, energia, rede, equipe, suporte, backup, segurança, capacidade ociosa, recuperação, tempo de entrega e risco.

---

### 43. Criar backlog de otimização

Arquivo:

```text
cloud-cost-optimization-backlog.yaml
```

Conteúdo:

```yaml
backlog:
  - id:
      COST-001

    title:
      reduce-debug-log-retention

    category:
      observability

    expectedImpact:
      medium

    risk:
      low

    owner:
      platform-team

    validation:
      log-search-and-incident-review

  - id:
      COST-002

    title:
      schedule-dev-environment

    category:
      compute

    expectedImpact:
      high

    risk:
      medium

    owner:
      team-orders

    validation:
      developer-availability

  - id:
      COST-003

    title:
      cleanup-noncurrent-object-versions

    category:
      storage

    expectedImpact:
      medium

    risk:
      medium

    owner:
      team-orders

    validation:
      restore-and-retention-review
```

Os impactos são qualitativos.

---

### 44. Priorizar otimizações

Priorize por impacto, esforço, risco, reversibilidade, owner, SLO, segurança e compliance. Mudanças simples e seguras vêm antes de migrações complexas sem retorno comprovado.

---

### 45. Custo de arquitetura complexa

Cada serviço adicional exige IAM, rede, monitoring, backup, runbook, skills, incident response e governança. O preço pode ser pequeno e o custo operacional alto.

---

### 46. Custo de segurança

Segurança possui custo.

Exemplos:

- encryption;
- key operations;
- scanning;
- audit logs;
- WAF;
- private endpoints;
- multi-account;
- backup imutável;
- monitoring.

Esses custos protegem risco.

Eles devem ser otimizados, não removidos sem análise.

A aula 544 aprofundará os controles.

---

### 47. Custo de confiabilidade

Multi-AZ, backups, replicas e failover aumentam consumo.

A decisão precisa comparar:

```text
custo da proteção;

custo da indisponibilidade;

custo da perda de dados;

impacto no cliente;

SLA;

RPO;

RTO.
```

Reduzir disponibilidade para economizar precisa de aprovação de negócio.

---

### 48. Criar scripts de cálculo

O script:

```text
calculate-unit-cost.ps1
```

recebe dados fictícios:

```text
totalCostUnits;

successfulOrders;

apiRequests;

processedEvents;

activeDocuments.
```

Ele calcula:

- custo por pedido;
- custo por request;
- custo por evento;
- custo por documento.

Divisão por zero precisa gerar erro controlado.

---

### 49. Estimar unidades de capacidade

O script:

```text
estimate-capacity-cost-units.ps1
```

calcula unidades normalizadas para:

- compute;
- database;
- messaging;
- cache;
- storage;
- telemetry;
- transfer.

A saída não é invoice.

Ela é um modelo comparativo.

---

### 50. Auditar storage e retenção

Execute:

```powershell
.\scripts\cloud\cost\audit-storage-retention.ps1
```

Detecte:

- object sem lifecycle;
- versioning sem retenção;
- multipart abandonado;
- snapshot sem owner;
- backup acima da policy;
- log sem expiração;
- dump não classificado.

---

### 51. Auditar observabilidade

Execute:

```powershell
.\scripts\cloud\cost\audit-observability-cost.ps1
```

Detecte:

- debug em produção;
- cardinalidade alta;
- trace sem sampling;
- retention indefinida;
- dashboard sem owner;
- alarm sem ação;
- log duplicado;
- payload completo.

---

### 52. Auditar transferência

Execute:

```powershell
.\scripts\cloud\cost\audit-data-transfer-cost.ps1
```

Detecte:

- cross-region não justificado;
- tráfego via NAT para serviço compatível com endpoint privado;
- export de telemetry excessivo;
- downloads repetidos;
- replication duplicada;
- egress sem owner.

---

### 53. Criar summary de decisão

O script:

```text
generate-cost-decision-summary.ps1
```

produz:

- top cost drivers;
- resources sem tags;
- budgets;
- unit economics;
- rightsizing candidates;
- storage waste;
- telemetry waste;
- transfer risks;
- commitment readiness;
- prioritized backlog;
- open decisions.

Sem valores reais de conta.

---

### 54. Criar evidence

Arquivo:

```text
cloud-cost-evidence.json.
```

Campos permitidos:

- driver categories;
- mandatory tags;
- budget environments;
- unit metric;
- cost allocation status;
- idle resource findings;
- storage findings;
- observability findings;
- transfer findings;
- commitment purchase false;
- actual billing access false;
- actual prices zero;
- actual resources zero;
- timestamp.

---

### 55. Criar documentação

#### `FINOPS_FOR_BACKEND.md`

Explique valor, colaboração e ciclo de otimização.

#### `CLOUD_COST_DRIVERS.md`

Explique compute, dados, rede, telemetry e segurança.

#### `TAGGING_AND_ALLOCATION.md`

Explique ownership, showback e shared costs.

#### `BUDGETS_FORECASTS_ANOMALIES.md`

Explique alertas e premissas.

#### `UNIT_ECONOMICS.md`

Explique custo por pedido.

#### `RIGHTSIZING_AND_SCALING.md`

Explique capacidade, HPA e SLO.

#### `STORAGE_AND_RETENTION_COSTS.md`

Explique lifecycle, backups e versions.

#### `DATA_TRANSFER_AND_NETWORK_COSTS.md`

Explique NAT, AZ, região e egress.

#### `OBSERVABILITY_COSTS.md`

Explique volume, cardinalidade e sampling.

#### `COMMITMENTS_AND_SPOT.md`

Explique estabilidade, risco e interrupção.

---

### 56. Criar test matrix

Arquivo:

```text
CLOUD_COST_TEST_MATRIX.md
```

Cenários:

- recurso possui tags;
- owner existe;
- ambiente válido;
- budget existe;
- alerta existe;
- produção não desliga automaticamente;
- custo por pedido calculado;
- zero orders gera erro;
- shared cost possui regra;
- rightsizing preserva headroom;
- HPA possui maxReplicas;
- banco preserva Multi-AZ;
- storage possui lifecycle;
- noncurrent versions possuem retenção;
- logs possuem retenção;
- metrics não possuem cardinalidade abusiva;
- traces possuem sampling;
- cross-region exige review;
- NAT possui análise;
- recurso ocioso possui ação;
- commitment sem histórico é bloqueado;
- Spot crítico é bloqueado;
- actual billing permanece false.

---

### 57. Criar troubleshooting

Arquivo:

```text
CLOUD_COST_TROUBLESHOOTING.md
```

Inclua:

- recurso sem tag;
- owner inexistente;
- budget não alerta;
- forecast divergente;
- anomaly falsa;
- custo por pedido aumenta;
- HPA cresce sem tráfego útil;
- banco superdimensionado;
- NAT inesperado;
- egress alto;
- logs duplicados;
- cardinalidade explosiva;
- snapshots esquecidos;
- versões antigas de objects;
- fila com retry excessivo;
- cache superdimensionado;
- commitment subutilizado;
- Spot interrompendo job;
- custo compartilhado sem regra;
- otimização afetando SLO.

---

### 58. Executar gate final

Execute:

```powershell
.\scripts\cloud\cost\validate-cost-driver-catalog.ps1

.\scripts\cloud\cost\validate-tagging-policy.ps1

.\scripts\cloud\cost\validate-budget-policy.ps1

.\scripts\cloud\cost\calculate-unit-cost.ps1

.\scripts\cloud\cost\estimate-capacity-cost-units.ps1

.\scripts\cloud\cost\simulate-rightsizing.ps1

.\scripts\cloud\cost\simulate-environment-scheduling.ps1

.\scripts\cloud\cost\audit-idle-resources.ps1

.\scripts\cloud\cost\audit-storage-retention.ps1

.\scripts\cloud\cost\audit-observability-cost.ps1

.\scripts\cloud\cost\audit-data-transfer-cost.ps1

.\scripts\cloud\cost\generate-cost-decision-summary.ps1

.\scripts\cloud\cost\collect-cloud-cost-evidence.ps1
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

- aplicação saudável;
- nenhum acesso a billing;
- nenhum preço real;
- nenhum commitment;
- nenhum recurso;
- nenhuma credencial;
- segurança não foi reduzida;
- ponte pronta para a aula 544.

---

## Entendendo o que foi feito

### Custo ganhou linguagem técnica

Compute, banco, storage, telemetry e transfer passaram a possuir unidades.

### Tags ganharam responsabilidade

Custo sem owner virou finding.

### Budget ganhou processo

Alertas não desligam produção automaticamente.

### Unit economics aproximou tecnologia do negócio

Custo por pedido passou a ser a métrica principal.

### Rightsizing ganhou proteção

Capacidade não é reduzida sem SLO, headroom e rollback.

### Ambientes ganharam lifecycle

Dev, hml e ambientes temporários podem possuir schedules.

### Storage ganhou controle financeiro

Lifecycle, noncurrent versions e multipart abandonado entraram na auditoria.

### Observabilidade ganhou orçamento

Logs, métricas e traces precisam de retenção e sampling.

### Transferência ganhou visibilidade

NAT, AZ, regiões e egress deixaram de ser fluxos invisíveis.

### Commitments ganharam gate

Compra não ocorre sem histórico, forecast e aprovação.

---

## Erros comuns importantes

### Otimizar apenas pela invoice

TCO inclui pessoas, risco e operação.

### Desligar produção ao atingir budget

Budget é alerta, não kill switch.

### Reduzir requests sem medir SLO

A aplicação pode ficar instável.

### Remover Multi-AZ para economizar

A decisão altera o risco de negócio.

### Usar tags com dados pessoais

Tags aparecem em inventários e relatórios.

### Comprar commitment cedo

Workload volátil pode gerar subutilização.

### Usar Spot para estado crítico

Interrupção faz parte do contrato.

### Manter logs sem retenção

O custo cresce continuamente.

### Ignorar NAT e egress

Rede pode ser um driver relevante.

### Medir custo total sem unidade de negócio

Não é possível avaliar eficiência.

### Antecipar segurança cloud

A aula 544 aprofundará esse tema.

---

## Comandos úteis

### Validar drivers

```powershell
.\scripts\cloud\cost\validate-cost-driver-catalog.ps1
```

### Calcular custo unitário

```powershell
.\scripts\cloud\cost\calculate-unit-cost.ps1
```

### Simular rightsizing

```powershell
.\scripts\cloud\cost\simulate-rightsizing.ps1
```

### Auditar storage

```powershell
.\scripts\cloud\cost\audit-storage-retention.ps1
```

### Auditar transfer

```powershell
.\scripts\cloud\cost\audit-data-transfer-cost.ps1
```

---

## Exercício guiado

### Parte 1 — Drivers

Classifique custos por serviço.

### Parte 2 — Allocation

Defina tags, owner e cost center.

### Parte 3 — Budgets

Crie alertas por ambiente.

### Parte 4 — Unit economics

Calcule custo por pedido.

### Parte 5 — Compute

Simule rightsizing e HPA.

### Parte 6 — Data

Revise banco, cache, mensageria e storage.

### Parte 7 — Telemetry

Revise logs, metrics e traces.

### Parte 8 — Network

Revise NAT, AZ, região e egress.

### Parte 9 — Commitments

Valide readiness sem compra.

### Parte 10 — Evidence

Registre decisões sem billing real.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 542 foi preservada;
- ponte para a aula 544 está correta;
- FinOps foi definido;
- custo fixo, variável e indireto foram diferenciados;
- preço e custo foram diferenciados;
- cost allocation foi definido;
- tags foram definidas;
- owner organizacional foi exigido;
- cost center e business unit foram definidos;
- budgets foram definidos;
- budget não foi tratado como kill switch;
- forecast foi definido;
- anomaly foi definida;
- showback e chargeback foram diferenciados;
- unit economics foi definida;
- custo por pedido foi definido;
- shared costs foram tratados;
- rightsizing foi definido;
- commitments foram definidos;
- Spot foi definido;
- TCO foi definido;
- catálogo de drivers foi criado;
- compute, database, messaging, cache, storage, observability, network e security foram catalogados;
- preços atuais não foram inventados;
- política de tags foi criada;
- dados pessoais em tags foram proibidos;
- recurso sem tag gera finding;
- política de budgets foi criada;
- alertas foram definidos;
- produção não desliga automaticamente;
- modelo de unit economics foi criado;
- divisão por zero foi tratada;
- envelope de capacidade foi criado;
- minReplicas e maxReplicas foram considerados;
- CPU e memória por réplica foram considerados;
- pool de banco foi relacionado à capacidade;
- mensagens por pedido foram estimadas;
- lookups de cache foram estimados;
- documentos por pedido foram estimados;
- volume de logs foi considerado;
- compute rightsizing foi simulado;
- p95 e p99 foram considerados;
- HPA teve limites;
- banco preservou Multi-AZ;
- pool excessivo foi tratado;
- mensageria considerou retries e payload;
- cache considerou shards, replicas e headroom;
- object storage considerou lifecycle e versions;
- policy de retenção foi criada;
- observabilidade foi tratada como driver;
- debug em produção foi desabilitado por padrão;
- cardinalidade alta exige aprovação;
- tracing exige sampling;
- data transfer policy foi criada;
- cross-region exige review;
- NAT foi analisado;
- private endpoints foram comparados;
- environments receberam policy;
- dev e hml podem possuir schedules;
- produção não possui shutdown automático;
- ambientes efêmeros possuem expiração;
- scheduling foi simulado;
- recursos ociosos foram auditados;
- nenhum delete automático foi executado;
- commitment readiness foi criada;
- compra de commitment foi proibida nesta aula;
- Spot foi limitada a workloads tolerantes;
- backlog de otimização foi criado;
- impacto, risco, owner e validação foram registrados;
- custos de segurança e confiabilidade foram preservados;
- scripts de cálculo foram criados;
- units normalizadas foram usadas;
- storage retention foi auditada;
- observability cost foi auditado;
- data transfer foi auditado;
- decision summary foi criado;
- evidence foi sanitizada;
- actual billing access ficou false;
- actual prices ficou zero;
- actual resources ficou zero;
- documentação foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- nenhuma conta, invoice, preço, commitment ou credencial real foi usada;
- segurança cloud não foi antecipada em profundidade;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/cost `
  scripts/cloud/cost `
  docs/devops/cloud-cost `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure dados reais:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "account.id|invoice|billing|credit.card|AKIA|ASIA|arn:aws:|subscription.id|actualPrice"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): estruturar custos cloud"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- invoice;
- account ID;
- subscription ID;
- preço atual;
- cartão;
- budget real;
- commitment;
- credencial;
- ARN;
- dado financeiro corporativo;
- controles detalhados da aula 544.

---

## Fechamento e ponte para a próxima aula

Nesta aula, custo deixou de ser apenas uma consequência da arquitetura.

O modelo passou a possuir:

```text
drivers;

tags;

owners;

budgets;

forecasts;

anomalies;

unit economics;

rightsizing;

retention;

transfer;

commitments;

backlog.
```

Você comprovou que custo precisa ser atribuído e explicado; budgets alertam, mas não desligam produção; custo por pedido conecta tecnologia ao negócio; rightsizing preserva SLO e headroom; HPA precisa de limites; bancos, mensageria, cache e storage possuem drivers diferentes; logs, métricas e traces precisam de governança; NAT, cross-zone, cross-region e egress precisam ser medidos; ambientes não produtivos precisam de lifecycle; e commitments só devem existir após histórico e forecast confiáveis.

A próxima aula será:

```text
544 - M17.39 - Observacoes de seguranca cloud
```

Nela, você irá aprofundar responsabilidade compartilhada, IAM, credentials, network boundaries, encryption, secrets, logging, threat modeling, posture management, supply chain, backup, incident response e controles preventivos, detectivos e responsivos.

Nenhuma policy de segurança cloud, threat model, guardrail, scanner ou controle real foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei drivers de custo.
- [ ] Criei política de tags.
- [ ] Criei budgets por ambiente.
- [ ] Defini custo por pedido.
- [ ] Simulei rightsizing e scheduling.
- [ ] Auditei storage, telemetry e transfer.
- [ ] Criei backlog de otimização.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O custo por pedido aumentou

Separe aumento de custo, queda de volume, falhas e mudança de escopo.

### O budget não alertou

Revise escopo, período, owner, canal e thresholds.

### O HPA aumentou custo inesperadamente

Revise métrica, maxReplicas, tráfego, ataque e dependências.

### O banco continua superdimensionado

Revise queries, pool, storage, replicas e workload real.

### O NAT cresce sem explicação

Mapeie destinations, image pulls, telemetry e serviços cloud.

### Logs aumentaram após deploy

Revise nível, duplicidade, payload e retenção.

### O storage cresce apesar do lifecycle

Revise filtro, versions, multipart, snapshots e objects órfãos.

### Um commitment está subutilizado

Revise forecast, cobertura, flexibilidade e ownership.

### Uma economia afetou o SLO

Reverta e registre que a otimização violou reliability.

### Um threat model detalhado apareceu

Preserve o aprofundamento para a aula 544.

---

## Perguntas de revisão

1. O que é FinOps?
2. Qual a diferença entre preço e custo?
3. O que é cost allocation?
4. O que é budget?
5. O que é forecast?
6. O que é anomaly?
7. Qual a diferença entre showback e chargeback?
8. O que é unit economics?
9. Como calcular custo por pedido?
10. O que é rightsizing?
11. Como HPA afeta custo?
12. Quais custos existem no banco?
13. Por que observabilidade custa?
14. O que é data transfer?
15. Por que NAT precisa ser analisado?
16. O que é commitment?
17. Quando usar Spot?
18. O que é TCO?
19. O que não foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Gestão colaborativa de valor cloud.
2. Tarifa e consumo multiplicado.
3. Atribuição do gasto.
4. Limite planejado.
5. Estimativa futura.
6. Variação inesperada.
7. Exposição e cobrança interna.
8. Custo por unidade de negócio.
9. Custo atribuído dividido por pedidos.
10. Adequação de capacidade.
11. Altera réplicas e consumo.
12. Compute, storage, backup e replicas.
13. Ingestão, retenção e consultas.
14. Movimento de dados.
15. Pode cobrar tempo e bytes.
16. Compromisso de consumo.
17. Workload interrompível.
18. Custo total.
19. Billing, preços e commitments reais.
20. Observações de segurança cloud.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 543 - M17.38 - Custos cloud

- Continuei após Object Storage S3 conceitual.
- Defini FinOps como prática de maximização de valor.
- Diferenciei preço, custo fixo, variável e indireto.
- Modelei cost allocation.
- Criei política de tags com owner, environment e cost center.
- Proibi dados pessoais e credenciais em tags.
- Criei budgets por ambiente.
- Mantive produção sem shutdown automático por budget.
- Defini forecast e anomaly detection.
- Diferenciei showback e chargeback.
- Defini unit economics e custo por pedido.
- Modelei shared costs.
- Criei envelope de capacidade e unidades normalizadas.
- Relacionei HPA, requests, limits e custo.
- Simulei rightsizing de compute.
- Relacionei pool e capacidade do banco.
- Analisei custos de mensageria, cache e object storage.
- Criei policies de retenção e lifecycle.
- Analisei custos de logs, métricas e traces.
- Limitei cardinalidade e exigi sampling.
- Modelei custos de NAT, AZ, região e egress.
- Criei policy de ambientes e expiração de recursos efêmeros.
- Simulei scheduling de dev e hml.
- Auditei recursos ociosos.
- Modelei readiness para commitments sem compra.
- Limitei Spot a workloads interrompíveis.
- Criei backlog de otimização com risco e validação.
- Preservei custos de segurança, backup e alta disponibilidade.
- Criei scripts, test matrix, troubleshooting e evidence sanitizada.
- Não acessei billing, preço, invoice ou conta real.
- Não antecipei segurança cloud em profundidade.
- Próxima aula: Observações de segurança cloud.
```

---

## Referência técnica curta

- FinOps Framework.
- Cloud Cost Allocation.
- Cloud Budgets and Forecasting.
- Unit Economics.
- Rightsizing.
- Autoscaling Cost Management.
- Storage Lifecycle Cost Management.
- Cloud Data Transfer Costs.
- Observability Cost Management.
- Commitment and Spot Capacity Concepts.

Regra final:

```text
custos cloud precisam ser projetados e operados como requisito arquitetural: drivers de compute, banco, mensageria, cache, storage, observabilidade, rede e segurança são medidos em unidades, atribuídos por tags e owner, acompanhados por budgets, forecast e anomalies e convertidos em unit economics como custo por pedido; rightsizing preserva SLO, headroom, requests, limits e capacidade das dependências, enquanto HPA possui min e max controlados; lifecycle remove desperdício de versões, snapshots, logs e uploads incompletos, e NAT, cross-zone, cross-region e internet egress permanecem observáveis; ambientes não produtivos podem usar schedules e expiração, resources ociosos geram findings e nenhum delete ocorre sem aprovação; commitments exigem histórico, forecast, break-even e aprovação, Spot fica limitado a workloads interrompíveis, e nenhuma economia remove segurança, backup, Multi-AZ ou recuperação sem decisão de risco; nenhum preço, billing, invoice, commitment ou recurso real é usado, deixando para a aula 544 o aprofundamento dos controles de segurança cloud.
```
