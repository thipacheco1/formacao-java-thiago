# 526 - M17.21 - Infraestrutura como codigo conceitual

## Apresentação da aula

Na aula 525, você estruturou:

```text
dev;

hml;

prod.
```

Os ambientes deixaram de ser apenas nomes.

Cada um passou a possuir:

- finalidade;
- configuração;
- variables;
- secrets;
- protections;
- approval;
- concurrency;
- promotion evidence;
- rollback reference;
- configuration hash;
- critérios de entrada;
- critérios de saída.

O pipeline também passou a preservar:

```text
o mesmo digest
entre os ambientes.
```

Essa decisão resolveu a identidade da aplicação.

Entretanto, ainda existe outra parte fundamental:

```text
onde a aplicação executa?
```

Para que dev, hml e prod existam de verdade, são necessários recursos.

Exemplos:

- rede;
- sub-rede;
- regras de acesso;
- compute;
- cluster;
- balanceador;
- banco;
- mensageria;
- storage;
- DNS;
- certificados;
- identidade;
- observabilidade;
- backups;
- políticas;
- ambientes.

Se esses recursos forem criados apenas por cliques manuais, planilhas e memória, surgem problemas.

Exemplos:

```text
dev possui uma porta aberta
que hml não possui;

prod usa uma versão diferente
do banco;

uma regra de firewall
foi criada sem revisão;

o ambiente não pode
ser reproduzido;

ninguém sabe
qual mudança causou drift;

o rollback da infraestrutura
não foi planejado;

a configuração real
diverge da documentação.
```

A pergunta central desta aula será:

```text
como descrever,
revisar,
reproduzir
e governar

a infraestrutura
com a mesma disciplina
aplicada ao código?
```

A resposta será:

```text
Infraestrutura como Código,
ou IaC.
```

Nesta aula, IaC será estudada de forma conceitual e operacional.

Você ainda não implementará Terraform, Pulumi, CloudFormation, Bicep, Ansible, Helm ou Kubernetes manifests.

O objetivo será construir o modelo mental correto antes de escolher uma ferramenta.

A próxima aula será:

```text
527 - M17.22 - Kubernetes fundamentos
```

Portanto, esta aula preparará os contratos de infraestrutura que o Kubernetes deverá atender.

Você irá compreender:

- desired state;
- recursos;
- dependências;
- providers;
- state;
- plan;
- apply;
- destroy;
- idempotência;
- drift;
- módulos;
- environments;
- variables;
- outputs;
- data sources;
- lifecycle;
- import;
- policy as code;
- testes;
- segurança;
- revisão;
- pipeline;
- rollback;
- disaster recovery.

A primeira regra será:

```text
infraestrutura como código
não significa apenas
armazenar scripts no Git.
```

Um script pode criar recursos.

Mas IaC profissional também precisa de:

- estado desejado;
- revisão;
- reprodutibilidade;
- idempotência;
- validação;
- preview;
- rastreabilidade;
- controle de acesso;
- segregação de ambientes;
- política;
- evidência;
- reconciliação.

A segunda regra será:

```text
o código descreve
a intenção;

a plataforma mantém
o estado real.
```

Quando o estado real diverge da intenção, existe:

```text
drift.
```

O drift pode surgir por:

- alteração manual;
- automação paralela;
- falha parcial;
- provider;
- dependência externa;
- versão diferente;
- configuração emergencial;
- recurso importado;
- segredo rotacionado;
- política alterada.

A terceira regra será:

```text
um plan
não é um apply.
```

O plan mostra uma proposta de mudança.

O apply executa.

Uma revisão profissional precisa observar:

- recursos criados;
- recursos alterados;
- recursos substituídos;
- recursos removidos;
- dependências;
- impacto;
- downtime;
- custo;
- segurança;
- rollback;
- dados.

A quarta regra será:

```text
destroy
não é rollback.
```

Apagar infraestrutura pode:

- perder dados;
- remover rede;
- invalidar DNS;
- destruir volume;
- apagar histórico;
- eliminar evidência;
- tornar recuperação mais difícil.

Rollback de infraestrutura pode exigir:

- reaplicar versão anterior;
- restaurar backup;
- retornar configuração;
- reanexar recurso;
- recriar componente;
- executar compensação;
- fazer roll-forward.

A quinta regra será:

```text
state é um recurso crítico.
```

Ferramentas declarativas precisam saber o que gerenciam.

O state pode conter:

- IDs;
- relações;
- metadata;
- outputs;
- valores sensíveis;
- locks;
- versões.

Ele não deve ser tratado como arquivo comum.

Um state profissional precisa de:

- armazenamento remoto;
- criptografia;
- controle de acesso;
- locking;
- versionamento;
- backup;
- auditoria;
- recuperação.

Nesta aula, nenhum state real será criado.

Será criada apenas uma simulação local sem credenciais e sem recursos externos.

O laboratório irá construir um catálogo conceitual.

Esse catálogo descreverá recursos necessários para:

```text
dev;

hml;

prod.
```

Exemplo:

```text
network;

application_runtime;

database;

messaging;

observability;

secrets_store;

container_registry;

dns;

certificate;

backup.
```

Cada recurso terá:

- nome lógico;
- tipo;
- environment;
- owner;
- dependências;
- inputs;
- outputs;
- criticidade;
- persistência;
- estratégia de mudança;
- estratégia de rollback;
- evidência.

O laboratório também criará um arquivo de desired state.

Exemplo conceitual:

```yaml
environment:
  name: hml

resources:
  - id: app-runtime
    type: compute
    desired:
      replicas: 2
      container_port: 8084
      image_reference: ghcr.io/owner/image@sha256:...
```

Esse arquivo não será aplicado em nenhuma cloud.

Ele servirá para demonstrar:

- declaração;
- validação;
- dependência;
- plan;
- drift;
- change set;
- evidence.

Você também criará uma representação de observed state.

O script comparará:

```text
desired state
contra
observed state.
```

A saída será um plan conceitual.

Exemplo:

```text
create:
observability-dashboard.

update:
app-runtime replicas 1 -> 2.

replace:
database engine version incompatível.

delete:
nenhum recurso.
```

A presença de:

```text
replace
```

será tratada como alto risco.

A presença de:

```text
delete
```

exigirá aprovação explícita.

O pipeline conceitual será:

```text
format;

validate;

security checks;

policy checks;

plan;

review;

approval;

apply;

verify;

evidence.
```

Nenhuma fase de apply real será executada.

A aula criará um workflow manual de validação:

```text
iac-concept-validation.yml.
```

Esse workflow irá:

- validar os arquivos conceituais;
- verificar schema;
- calcular plan;
- detectar deletes;
- detectar replaces;
- verificar secrets;
- gerar evidence;
- publicar artifact;
- criar summary.

Não haverá credencial de cloud.

Não haverá provider real.

Não haverá criação de recurso.

Outro tema importante será:

```text
declarativo
versus
imperativo.
```

#### Imperativo

Descreve passos.

Exemplo:

```text
crie uma rede;

depois crie uma sub-rede;

depois configure uma regra;

depois crie uma máquina.
```

#### Declarativo

Descreve o estado desejado.

Exemplo:

```text
deve existir
uma rede
com estas propriedades.
```

Ambos podem coexistir.

Ferramentas declarativas ainda executam operações imperativas internamente.

Scripts imperativos ainda podem ser idempotentes.

A escolha depende do problema.

A aula também tratará de:

```text
mutable infrastructure
versus
immutable infrastructure.
```

Infraestrutura mutável recebe alterações no recurso existente.

Infraestrutura imutável substitui o recurso por outro.

Exemplo:

```text
mutável:

alterar configuração
da máquina atual.

imutável:

criar nova imagem,
subir novas instâncias,
mover tráfego,
remover antigas.
```

O módulo já praticou conceitos próximos em:

- blue-green;
- canary;
- build once;
- imagem imutável;
- digest;
- rollback target.

IaC conecta essas práticas à infraestrutura.

Outro princípio será:

```text
cada ambiente
possui state isolado.
```

Misturar dev, hml e prod no mesmo state sem separação aumenta o blast radius.

A separação pode ocorrer por:

- backend;
- workspace;
- diretório;
- projeto;
- conta;
- subscription;
- namespace;
- combinação controlada.

A aula não escolherá uma única estratégia universal.

Ela documentará critérios.

Outro tema será modularização.

Um módulo de infraestrutura pode representar:

- rede;
- banco;
- runtime;
- observabilidade;
- cluster;
- aplicação;
- ambiente completo.

Módulos precisam de:

- contrato;
- inputs;
- outputs;
- versionamento;
- documentação;
- testes;
- compatibilidade;
- owner.

Um módulo não deve esconder decisões críticas sem documentação.

A aula também diferenciará:

```text
variable;

local;

output;

data source;

resource.
```

#### Variable

Entrada fornecida ao módulo.

#### Local

Valor calculado internamente.

#### Output

Valor exposto.

#### Data source

Consulta recurso existente.

#### Resource

Objeto gerenciado.

Esses conceitos aparecem em várias ferramentas, mesmo com nomes diferentes.

Outro ponto será a segurança.

IaC pode expor:

- credenciais;
- IPs;
- nomes;
- políticas;
- topologia;
- backups;
- chaves;
- dados de state.

Por isso, são necessários:

- secret scanning;
- least privilege;
- state encryption;
- protected branches;
- approvals;
- policy as code;
- dependency pinning;
- provider pinning;
- logs controlados;
- artifacts controlados.

O código pode ser público e ainda assim não conter segredos.

Valores sensíveis devem ser injetados por mecanismos apropriados.

Outro princípio será:

```text
policy as code
bloqueia estados proibidos.
```

Exemplos de policy:

```text
prod não permite
banco sem backup;

porta administrativa
não pode ser pública;

storage não pode ser público;

imagem precisa usar digest;

recursos precisam de tags;

prod precisa de múltiplas réplicas;

deletes em prod
exigem aprovação;

secrets não entram
em outputs.
```

O laboratório criará políticas conceituais em YAML.

Scripts validarão essas regras.

A aula também introduzirá testes de infraestrutura.

Tipos:

```text
lint;

schema;

unitário de módulo;

policy;

plan;

integration;

compliance;

smoke;

drift.
```

Não haverá teste de cloud real.

O foco será validar contratos e plans.

Outro ponto será custo.

IaC pode criar recursos caros rapidamente.

O plan precisa considerar:

- quantidade;
- tamanho;
- região;
- storage;
- tráfego;
- licença;
- retenção;
- ambientes efêmeros;
- cleanup.

O laboratório criará um campo:

```text
cost_class.
```

Valores:

```text
low;

medium;

high.
```

Isso não substitui cálculo financeiro real.

Serve como gate conceitual.

Outro tema será ownership.

Todo recurso precisa de:

- team;
- system;
- environment;
- cost center quando aplicável;
- managed by;
- data classification;
- lifecycle.

Tags e labels ajudam.

Elas não substituem uma governança real.

Ao final, você deverá explicar:

```text
o que é IaC;

como declarativo
difere de imperativo;

o que é desired state;

o que é state;

o que é plan;

por que apply
precisa de gate;

o que é drift;

por que destroy
não é rollback;

como separar ambientes;

como modularizar;

como policy as code
protege a infraestrutura;

como testar IaC;

como preparar
o caminho para Kubernetes.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
524:
Secrets em pipeline.

525:
Ambientes dev hml prod.

526:
Infraestrutura como codigo conceitual.

527:
Kubernetes fundamentos.

528:
Cluster local com kind.
```

A aula 525 respondeu:

```text
como promover
o mesmo artefato
entre ambientes
com configuração
e proteção diferentes?
```

A aula 526 responderá:

```text
como descrever
e governar
os recursos
que sustentam
esses ambientes?
```

Nesta aula:

```text
IaC:
sim.

desired state:
sim.

observed state:
sim.

plan:
sim.

apply:
conceitual.

state:
sim.

drift:
sim.

idempotência:
sim.

módulos:
sim.

variables:
sim.

outputs:
sim.

policy as code:
sim.

testes:
sim.

segurança:
sim.

custos:
sim.

workflow de validação:
sim.

Terraform:
não implementado.

Pulumi:
não implementado.

CloudFormation:
não implementado.

Kubernetes:
não implementado.

cloud:
não provisionada.
```

A regra central será:

```text
infraestrutura deve ser
descritível,
revisável,
reproduzível
e verificável

antes de ser aplicada.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
.github/workflows/iac-concept-validation.yml

pipeline/iac
├── resource-catalog.yaml
├── desired-state.example.yaml
├── observed-state.example.yaml
├── policy-rules.yaml
├── module-contracts.yaml
└── environment-state-strategy.yaml

scripts/iac
├── validate-resource-catalog.ps1
├── validate-desired-state.ps1
├── calculate-conceptual-plan.ps1
├── validate-iac-policies.ps1
├── detect-conceptual-drift.ps1
├── generate-iac-evidence.ps1
└── simulate-iac-change.ps1

docs/devops/iac
├── IAC_ARCHITECTURE.md
├── DECLARATIVE_VS_IMPERATIVE.md
├── IAC_STATE_POLICY.md
├── IAC_MODULE_POLICY.md
├── IAC_CHANGE_POLICY.md
├── IAC_SECURITY_POLICY.md
├── IAC_TEST_STRATEGY.md
├── IAC_DRIFT_RUNBOOK.md
├── IAC_TEST_MATRIX.md
└── IAC_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
catálogo de recursos;

desired state;

observed state;

plan conceitual;

detecção de drift;

políticas;

contratos de módulo;

estratégia de state;

workflow de validação;

evidence.
```

Você irá:

1. confirmar a baseline;
2. definir princípios;
3. criar catálogo;
4. classificar recursos;
5. definir dependências;
6. definir desired state;
7. definir observed state;
8. calcular plan;
9. classificar create;
10. classificar update;
11. classificar replace;
12. classificar delete;
13. criar políticas;
14. bloquear deletes;
15. bloquear secrets;
16. bloquear imagem sem digest;
17. validar redundância prod;
18. criar contratos de módulo;
19. separar state;
20. criar scripts;
21. criar workflow;
22. publicar plan;
23. publicar evidence;
24. simular drift;
25. simular replace;
26. simular delete;
27. simular policy violation;
28. documentar rollback;
29. executar gate;
30. commitar;
31. preparar a aula 527.

---

## Conceito essencial

### Infrastructure as Code

IaC é a prática de definir e gerenciar infraestrutura por arquivos versionados, automatizados e revisáveis.

---

### Desired state

É o estado esperado.

Exemplo:

```text
duas réplicas;

porta 8084;

imagem por digest;

backup ativo.
```

---

### Observed state

É o estado encontrado.

Pode vir de:

- provider;
- API;
- inventário;
- cluster;
- banco;
- scanner;
- import.

---

### Plan

Diferença proposta entre desired e observed.

Categorias:

```text
create;

update;

replace;

delete;

no-op.
```

---

### Apply

Executa a mudança.

Não será realizado nesta aula.

---

### State

Registro usado pela ferramenta para relacionar código e recursos.

Precisa de proteção.

---

### Drift

Mudança no estado real fora do fluxo esperado.

---

### Idempotência

Executar novamente converge para o mesmo estado.

---

### Provider

Integração com uma plataforma.

Exemplos conceituais:

- cloud;
- DNS;
- GitHub;
- Kubernetes;
- observabilidade.

---

### Resource

Objeto gerenciado.

---

### Data source

Consulta recurso existente sem necessariamente gerenciá-lo.

---

### Module

Componente reutilizável de infraestrutura.

---

### Variable

Entrada externa.

---

### Local

Valor calculado.

---

### Output

Valor exposto.

Outputs sensíveis precisam de proteção.

---

### Lifecycle

Regras de criação, alteração, substituição e remoção.

---

### Import

Associa recurso existente ao gerenciamento da ferramenta.

Importar não garante que o código já representa corretamente o recurso.

---

### Policy as Code

Regras automatizadas sobre o plan ou configuração.

---

### Immutable infrastructure

Substitui recurso em vez de alterar internamente.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Na raiz:

```powershell
git status
git diff --check
```

Valide os ambientes:

```powershell
.\scripts\environments\simulate-environment-promotion.ps1
```

---

### 2. Criar catálogo de recursos

Arquivo:

```text
pipeline/iac/resource-catalog.yaml
```

Exemplo:

```yaml
resources:
  - id: application-network
    type: network
    environments:
      - dev
      - hml
      - prod
    persistent: true
    criticality: high
    owner: platform-team
    cost_class: medium

  - id: application-runtime
    type: compute
    environments:
      - dev
      - hml
      - prod
    persistent: false
    criticality: high
    owner: platform-team
    cost_class: medium

  - id: application-database
    type: database
    environments:
      - dev
      - hml
      - prod
    persistent: true
    criticality: critical
    owner: data-platform
    cost_class: high
```

Os owners são papéis.

---

### 3. Criar desired state

Arquivo:

```text
desired-state.example.yaml
```

Inclua:

```yaml
environment:
  name: hml

resources:
  - id: application-runtime
    desired:
      replicas: 2
      port: 8084
      image_reference: ghcr.io/owner/image@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      public_access: false
      observability_enabled: true
```

Use digest fictício válido em formato.

---

### 4. Criar observed state

Arquivo:

```text
observed-state.example.yaml
```

Exemplo:

```yaml
environment:
  name: hml

resources:
  - id: application-runtime
    observed:
      replicas: 1
      port: 8084
      image_reference: ghcr.io/owner/image@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      public_access: false
      observability_enabled: true
```

---

### 5. Criar script de catálogo

Arquivo:

```text
validate-resource-catalog.ps1
```

Valide:

- ID único;
- tipo;
- environment;
- owner;
- criticidade;
- persistência;
- cost class;
- dependências.

---

### 6. Criar script de desired state

Arquivo:

```text
validate-desired-state.ps1
```

Valide:

- environment permitido;
- resources conhecidos;
- digest;
- porta;
- réplicas;
- booleans;
- ausência de secrets;
- dependências.

---

### 7. Calcular plan conceitual

Arquivo:

```text
calculate-conceptual-plan.ps1
```

Compare desired e observed.

Saída:

```json
{
  "creates": [],
  "updates": [
    {
      "resource": "application-runtime",
      "field": "replicas",
      "from": 1,
      "to": 2
    }
  ],
  "replaces": [],
  "deletes": []
}
```

---

### 8. Classificar mudanças

Regras conceituais:

```text
replicas:
update.

imagem:
update ou replace
conforme runtime.

engine major:
replace.

resource ausente:
create.

resource extra gerenciado:
delete.
```

Documente as regras.

---

### 9. Criar policy rules

Arquivo:

```text
policy-rules.yaml
```

Inclua:

```yaml
policies:
  - id: immutable-image
    rule: image_reference_requires_digest
    severity: error

  - id: production-redundancy
    rule: prod_replicas_minimum_two
    severity: error

  - id: no-public-database
    rule: database_public_access_forbidden
    severity: error

  - id: protected-delete
    rule: persistent_delete_requires_approval
    severity: error

  - id: mandatory-owner
    rule: owner_required
    severity: error
```

---

### 10. Criar validator de policy

Arquivo:

```text
validate-iac-policies.ps1
```

Ele recebe desired state e plan.

Falha quando:

- imagem usa tag;
- prod possui uma réplica;
- banco é público;
- recurso persistente será removido;
- owner está ausente;
- secret aparece.

---

### 11. Criar contratos de módulo

Arquivo:

```text
module-contracts.yaml
```

Módulos:

```text
network;

runtime;

database;

messaging;

observability.
```

Para cada um:

- inputs;
- outputs;
- owner;
- version;
- compatibility;
- tests.

---

### 12. Criar estratégia de state

Arquivo:

```text
environment-state-strategy.yaml
```

Defina:

```yaml
state:
  dev:
    isolation: required
  hml:
    isolation: required
  prod:
    isolation: required

  backend:
    remote: required
    encryption: required
    locking: required
    versioning: required
    backup: required
```

Nenhum backend real será criado.

---

### 13. Criar detecção de drift

Arquivo:

```text
detect-conceptual-drift.ps1
```

Compare os arquivos e gere:

```text
drift detected:

yes/no.

resources affected.

severity.

recommended action.
```

---

### 14. Criar evidence

Arquivo:

```text
generate-iac-evidence.ps1
```

Gere:

```text
iac-validation-evidence.json.
```

Campos:

- commit;
- environment;
- desired hash;
- observed hash;
- creates;
- updates;
- replaces;
- deletes;
- policy violations;
- result;
- timestamp.

Sem secrets.

---

### 15. Criar workflow

Arquivo:

```text
.github/workflows/iac-concept-validation.yml
```

Trigger:

```yaml
on:
  pull_request:
    paths:
      - "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline/iac/**"
      - "scripts/iac/**"
      - ".github/workflows/iac-concept-validation.yml"

  workflow_dispatch:
```

O workflow não usa credencial de cloud.

---

### 16. Definir permissions

```yaml
permissions:
  contents:
    read
```

---

### 17. Criar job de validação

Steps:

- checkout;
- validar catálogo;
- validar desired;
- calcular plan;
- validar policies;
- gerar evidence;
- publicar artifact;
- summary.

---

### 18. Publicar plan

Artifact:

```text
iac-concept-plan-<sha>.
```

Inclua:

- plan JSON;
- evidence JSON.

Retenção:

```text
14 dias.
```

---

### 19. Criar summary

Mostre:

- environment;
- create count;
- update count;
- replace count;
- delete count;
- policy result;
- drift result.

Não inclua secrets.

---

### 20. Bloquear deletes

Quando:

```text
deletes > 0
```

o job falha.

Um processo futuro poderá aceitar aprovação explícita.

---

### 21. Bloquear replace de recurso persistente

Exemplo:

```text
database replace.
```

O job precisa falhar e exigir estratégia de migração.

---

### 22. Simular drift

Altere o observed state:

```text
replicas 2 para 1.
```

Confirme update no plan.

---

### 23. Simular imagem por tag

Use:

```text
ghcr.io/owner/image:main.
```

A policy precisa falhar.

---

### 24. Simular delete

Remova um recurso do desired e mantenha no observed.

Confirme:

- delete detectado;
- policy bloqueia;
- evidence registra.

---

### 25. Simular replace

Altere um campo classificado como replace.

Confirme gate vermelho.

---

### 26. Simular secret

Adicione uma chave falsa:

```text
database_password.
```

O scanner precisa bloquear o arquivo.

Não use valor real.

---

### 27. Criar arquitetura

Arquivo:

```text
IAC_ARCHITECTURE.md
```

Diagrama:

```text
Git
 |
 v
format and validate
 |
 v
desired state
 |
 +---- observed state
 |
 v
conceptual plan
 |
 v
policy checks
 |
 v
review
 |
 v
future apply
```

---

### 28. Documentar declarativo e imperativo

Arquivo:

```text
DECLARATIVE_VS_IMPERATIVE.md
```

Inclua exemplos e critérios de escolha.

---

### 29. Criar state policy

Arquivo:

```text
IAC_STATE_POLICY.md
```

Inclua:

- remote;
- encryption;
- locking;
- versioning;
- backup;
- access;
- recovery;
- segregation;
- sensitive values.

---

### 30. Criar module policy

Arquivo:

```text
IAC_MODULE_POLICY.md
```

Inclua:

- small contract;
- versioning;
- owners;
- inputs;
- outputs;
- tests;
- compatibility;
- deprecation.

---

### 31. Criar change policy

Arquivo:

```text
IAC_CHANGE_POLICY.md
```

Classifique:

- create;
- update;
- replace;
- delete;
- emergency change;
- import;
- drift correction.

---

### 32. Criar security policy

Arquivo:

```text
IAC_SECURITY_POLICY.md
```

Inclua:

- no secrets;
- provider pinning;
- dependency review;
- least privilege;
- protected state;
- policy as code;
- artifact retention;
- log redaction.

---

### 33. Criar test strategy

Arquivo:

```text
IAC_TEST_STRATEGY.md
```

Camadas:

- format;
- schema;
- unit;
- policy;
- plan;
- integration;
- compliance;
- smoke;
- drift.

---

### 34. Criar drift runbook

Arquivo:

```text
IAC_DRIFT_RUNBOOK.md
```

Passos:

1. detectar;
2. classificar;
3. preservar evidence;
4. identificar origem;
5. decidir import, revert ou update;
6. revisar;
7. aplicar;
8. verificar;
9. registrar.

---

### 35. Criar test matrix

Arquivo:

```text
IAC_TEST_MATRIX.md
```

Cenários:

- no-op;
- create;
- update;
- replace;
- delete;
- image tag;
- image digest;
- owner ausente;
- secret detectado;
- prod uma réplica;
- banco público;
- state misturado;
- módulo sem versão;
- drift;
- evidence inválida.

---

### 36. Criar troubleshooting

Arquivo:

```text
IAC_TROUBLESHOOTING.md
```

Inclua:

- plan inesperado;
- resource não mapeado;
- delete inesperado;
- replace inesperado;
- drift recorrente;
- state lock;
- state perdido;
- provider divergente;
- module incompatível;
- secret no plan;
- output sensível;
- policy falsa positiva;
- ambiente misturado.

---

### 37. Executar gate final

Execute:

```powershell
.\scripts\iac\validate-resource-catalog.ps1

.\scripts\iac\validate-desired-state.ps1

.\scripts\iac\calculate-conceptual-plan.ps1

.\scripts\iac\validate-iac-policies.ps1

.\scripts\iac\detect-conceptual-drift.ps1

.\scripts\iac\generate-iac-evidence.ps1
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### A infraestrutura ganhou uma linguagem de intenção

Recursos foram descritos como desired state.

### O estado real ganhou comparação

Observed state permitiu detectar drift.

### O plan ganhou classificação

Create, update, replace e delete ficaram explícitos.

### Mudanças perigosas ganharam gates

Deletes e replaces persistentes foram bloqueados.

### Imagens continuaram imutáveis

A policy exigiu digest.

### Ambientes ganharam state isolado

Dev, hml e prod não compartilham blast radius.

### Módulos ganharam contratos

Inputs, outputs, owners e versões foram definidos.

### Policy as code ganhou papel preventivo

Estados proibidos falham antes do apply.

### Evidências ganharam artifact

O plan pode ser revisado e auditado.

### A próxima aula ganhou requisitos

Kubernetes deverá materializar runtime, rede e configuração respeitando esses contratos.

---

## Erros comuns importantes

### Chamar qualquer script de IaC

Sem desired state, idempotência e revisão, existe apenas automação.

### Versionar state local

Pode expor dados e criar concorrência.

### Misturar ambientes no mesmo state

O blast radius aumenta.

### Aprovar plan sem ler replaces

Recursos críticos podem ser recriados.

### Tratar destroy como rollback

Dados e dependências podem ser perdidos.

### Editar recurso manualmente

Drift é criado.

### Ignorar import

Recursos existentes ficam fora do gerenciamento.

### Colocar secret em variable

Plan, logs ou state podem expor.

### Criar módulo gigante

Contrato e teste ficam difíceis.

### Usar imagem por tag

O runtime perde identidade imutável.

### Aplicar sem policy

Estados proibidos chegam ao ambiente.

### Antecipar Kubernetes

A aula 527 possui esse objetivo.

---

## Comandos úteis

### Validar catálogo

```powershell
.\scripts\iac\validate-resource-catalog.ps1
```

### Validar desired state

```powershell
.\scripts\iac\validate-desired-state.ps1
```

### Calcular plan

```powershell
.\scripts\iac\calculate-conceptual-plan.ps1
```

### Validar policies

```powershell
.\scripts\iac\validate-iac-policies.ps1
```

### Detectar drift

```powershell
.\scripts\iac\detect-conceptual-drift.ps1
```

---

## Exercício guiado

### Parte 1 — Catálogo

Liste recursos e owners.

### Parte 2 — Desired

Defina o estado esperado.

### Parte 3 — Observed

Modele o estado encontrado.

### Parte 4 — Plan

Classifique mudanças.

### Parte 5 — Policies

Bloqueie estados proibidos.

### Parte 6 — State

Separe ambientes.

### Parte 7 — Modules

Defina contratos.

### Parte 8 — Drift

Simule alteração manual.

### Parte 9 — Evidence

Gere plan e artifact.

### Parte 10 — Review

Analise create, update, replace e delete.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 525 foi preservada;
- IaC foi definida;
- desired state foi definido;
- observed state foi definido;
- plan foi definido;
- apply foi diferenciado;
- state foi definido;
- drift foi definido;
- idempotência foi definida;
- provider foi definido;
- resource foi definido;
- data source foi definido;
- module foi definido;
- variable foi definida;
- local foi definido;
- output foi definido;
- lifecycle foi definido;
- import foi definido;
- policy as code foi definida;
- immutable infrastructure foi definida;
- declarativo foi diferenciado de imperativo;
- mutable foi diferenciado de immutable;
- destroy não foi tratado como rollback;
- state foi classificado como crítico;
- remote state foi exigido conceitualmente;
- encryption foi exigida;
- locking foi exigido;
- versioning foi exigido;
- backup foi exigido;
- ambientes foram isolados;
- catálogo de recursos foi criado;
- IDs foram definidos;
- owners foram definidos;
- criticidade foi definida;
- persistência foi definida;
- cost class foi definida;
- desired state foi criado;
- digest fictício válido foi usado;
- observed state foi criado;
- script de catálogo foi criado;
- script de desired state foi criado;
- plan script foi criado;
- create foi classificado;
- update foi classificado;
- replace foi classificado;
- delete foi classificado;
- policy rules foram criadas;
- imagem por digest foi exigida;
- redundância prod foi exigida;
- banco público foi proibido;
- delete persistente foi protegido;
- owner foi exigido;
- validator de policy foi criado;
- contratos de módulo foram criados;
- módulos de network foram previstos;
- módulos de runtime foram previstos;
- módulos de database foram previstos;
- módulos de messaging foram previstos;
- módulos de observability foram previstos;
- state strategy foi criada;
- state de dev foi isolado;
- state de hml foi isolado;
- state de prod foi isolado;
- drift script foi criado;
- evidence script foi criado;
- evidence não contém secrets;
- workflow conceitual foi criado;
- workflow usa pull request;
- workflow usa workflow dispatch;
- paths foram filtrados;
- permissions read foram usadas;
- credencial de cloud não foi usada;
- job de validação foi criado;
- plan foi publicado;
- evidence foi publicada;
- summary foi criado;
- deletes foram bloqueados;
- replace persistente foi bloqueado;
- drift foi simulado;
- imagem por tag foi bloqueada;
- delete foi simulado;
- replace foi simulado;
- secret falso foi bloqueado;
- arquitetura foi documentada;
- declarativo versus imperativo foi documentado;
- state policy foi criada;
- module policy foi criada;
- change policy foi criada;
- security policy foi criada;
- test strategy foi criada;
- drift runbook foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- apply real não foi executado;
- Terraform não foi implementado;
- Pulumi não foi implementado;
- CloudFormation não foi implementado;
- Kubernetes não foi implementado;
- cloud não foi provisionada;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 527 está correta.

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
  .github/workflows/iac-concept-validation.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline/iac `
  scripts/iac `
  docs/devops/iac `
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
      "password|token|private.key|access.key|secret.key"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): estruturar infraestrutura como codigo"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- state real;
- backend config real;
- token;
- password;
- credencial de cloud;
- provider credentials;
- plan com dados sensíveis;
- evidence local;
- Terraform;
- Kubernetes manifest;
- cluster config;
- kubeconfig.

---

## Fechamento e ponte para a próxima aula

Nesta aula, infraestrutura deixou de ser tratada como uma sequência de cliques.

O modelo passou a possuir:

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

Você comprovou que:

- IaC é mais do que scripts;
- declarativo descreve intenção;
- observed state permite comparação;
- plan precisa de revisão;
- apply executa mudanças;
- state exige proteção;
- drift precisa de runbook;
- ambientes precisam de isolamento;
- replace pode ser mais perigoso que update;
- delete exige autorização;
- imagem por digest preserva identidade;
- policy as code bloqueia estados proibidos;
- módulos precisam de contratos;
- infrastructure tests começam antes da cloud.

A próxima aula será:

```text
527 - M17.22 - Kubernetes fundamentos
```

Nela, você irá aprender como um cluster organiza workloads, nodes, control plane, Pods, Deployments, Services, ConfigMaps, Secrets e namespaces.

Nenhum recurso Kubernetes foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini IaC e desired state.
- [ ] Modelei observed state.
- [ ] Calculei plan conceitual.
- [ ] Classifiquei mudanças.
- [ ] Criei policies.
- [ ] Separei state por ambiente.
- [ ] Simulei drift.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O plan mostra delete inesperado

Interrompa e revise desired state, import e ownership.

### O plan mostra replace de banco

Exija estratégia de migração e backup.

### O drift reaparece

Pode existir automação paralela ou alteração manual recorrente.

### O state está bloqueado

Investigue execução ativa antes de remover lock.

### O state foi perdido

Use backup e versionamento; não recrie cegamente.

### O módulo não expõe output necessário

Revise o contrato e a compatibilidade.

### A policy bloqueia um caso válido

Documente exceção, escopo e prazo.

### Um secret aparece no plan

Interrompa, trate exposição e revise modelagem.

### Dev e prod aparecem no mesmo state

Separe antes de qualquer apply.

### A imagem usa tag

Substitua por referência com digest.

### O workflow pede credencial de cloud

Remova; o laboratório é conceitual.

### Kubernetes manifest apareceu

Preserve para a aula 527 ou posterior.

---

## Perguntas de revisão

1. O que é IaC?
2. O que é desired state?
3. O que é observed state?
4. O que é plan?
5. O que é apply?
6. O que é state?
7. O que é drift?
8. O que é idempotência?
9. O que é provider?
10. O que é resource?
11. O que é data source?
12. O que é module?
13. O que é output?
14. O que é import?
15. O que é policy as code?
16. Por que destroy não é rollback?
17. Por que separar states?
18. O que é immutable infrastructure?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Infraestrutura versionada e automatizada.
2. Estado esperado.
3. Estado encontrado.
4. Proposta de mudança.
5. Execução.
6. Registro de recursos.
7. Divergência.
8. Convergência repetível.
9. Integração com plataforma.
10. Objeto gerenciado.
11. Consulta externa.
12. Componente reutilizável.
13. Valor exposto.
14. Adotar recurso existente.
15. Regra automatizada.
16. Pode destruir dados.
17. Reduzir blast radius.
18. Substituir em vez de alterar.
19. Ferramenta e cloud reais.
20. Kubernetes fundamentos.

---

## Desafio opcional

Modele um recurso de banco de dados.

Requisitos:

- desired state;
- observed state;
- backup obrigatório;
- public access false;
- owner;
- cost class;
- engine version;
- storage;
- create;
- update;
- replace;
- delete protegido;
- nenhum provider real.

O objetivo é identificar quais alterações são seguras e quais exigem migração.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 526 - M17.21 - Infraestrutura como codigo conceitual

- Continuei após ambientes dev, hml e prod.
- Defini Infraestrutura como Código.
- Diferenciei automação simples de IaC.
- Diferenciei declarativo e imperativo.
- Diferenciei infraestrutura mutável e imutável.
- Defini desired state e observed state.
- Defini plan, apply e state.
- Tratei state como recurso crítico.
- Exigi armazenamento remoto, criptografia, locking, versão e backup.
- Defini drift e idempotência.
- Defini provider, resource, data source, module, variable, local e output.
- Defini lifecycle e import.
- Defini policy as code.
- Criei catálogo conceitual de recursos.
- Classifiquei criticidade, persistência, ownership e custo.
- Criei desired state e observed state de exemplo.
- Criei script de plan conceitual.
- Classifiquei create, update, replace e delete.
- Criei policies para digest, redundância, banco privado, owner e deletes.
- Criei contratos de módulos.
- Separei state por dev, hml e prod.
- Criei detecção de drift.
- Criei workflow de validação sem credencial de cloud.
- Publiquei plan e evidence conceituais.
- Simulei drift, imagem por tag, delete, replace e secret indevido.
- Criei policies de state, módulos, mudanças, segurança e testes.
- Não implementei Terraform, cloud ou Kubernetes.
- Próxima aula: Kubernetes fundamentos.
```

---

## Referência técnica curta

- Infrastructure as Code.
- Desired State Configuration.
- Declarative Infrastructure.
- Infrastructure State.
- Infrastructure Drift.
- Idempotency.
- Infrastructure Modules.
- Policy as Code.
- Immutable Infrastructure.
- Infrastructure Testing.

Regra final:

```text
Infraestrutura como Código descreve recursos como estado desejado versionado, revisável e verificável: um catálogo define resources, owners, criticidade, persistência e custo, enquanto desired state e observed state produzem um plan classificado em create, update, replace, delete ou no-op; state é tratado como recurso crítico com isolamento por dev, hml e prod, backend remoto, criptografia, locking, versionamento e backup, e drift recebe detecção e runbook; módulos possuem inputs, outputs, versão, owner e testes, imagens exigem digest e policy as code bloqueia banco público, baixa redundância, deletes persistentes, owners ausentes e secrets; o workflow conceitual valida schema, calcula plan, executa policies e publica evidence sem credencial de cloud ou apply real; destroy não é rollback, replace exige análise e infraestrutura imutável conecta build once, blue-green e promoção por digest; com os contratos de runtime, rede, configuração e segurança definidos, a aula 527 poderá introduzir Kubernetes sem antecipar manifests, cluster ou recursos reais.
```
