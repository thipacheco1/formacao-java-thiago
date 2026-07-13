# 518 - M17.13 - CI CD profissional visao geral

## Apresentação da aula

Na aula 517, você integrou migration de banco ao processo de deploy.

A evolução passou a seguir:

```text
expand;

deploy compatível;

migrate;

observe;

contract futuro.
```

Você também passou a possuir:

- imagem multi-stage;
- runtime não root;
- secrets por arquivo;
- healthchecks;
- Docker Compose;
- release plan;
- feature flags;
- blue-green;
- canary;
- rollback seguro;
- Flyway;
- backfill em lotes;
- testes com PostgreSQL real.

Até aqui, todas essas práticas foram executadas manualmente ou por scripts locais.

Isso foi intencional.

Antes de automatizar, você precisou compreender:

```text
o que validar;

em qual ordem;

qual artefato produzir;

qual risco controlar;

qual evidência registrar;

quando interromper;

quando promover;

quando reverter.
```

A partir desta aula, essas práticas começam a ser organizadas como um sistema de entrega.

A pergunta central será:

```text
como transformar
build,
testes,
segurança,
imagem,
migration,
deploy,
observação
e rollback

em um fluxo
repetível,
auditável
e confiável?
```

A resposta será:

```text
CI/CD profissional.
```

CI/CD não é apenas um arquivo YAML.

Não é apenas:

```text
executar mvn test;

construir imagem;

publicar;
```

Um pipeline profissional precisa representar um fluxo de engenharia.

Ele precisa definir:

- gatilhos;
- responsabilidades;
- estágios;
- dependências;
- artefatos;
- gates;
- ambientes;
- credenciais;
- aprovações;
- promoção;
- observabilidade;
- rollback;
- retenção;
- auditoria.

Nesta aula, você irá construir a visão completa antes de escolher a sintaxe de uma plataforma.

A próxima aula implementará:

```text
GitHub Actions workflows.
```

Portanto, nesta aula não será criado nenhum arquivo:

```text
.github/workflows/*.yml.
```

O foco será produzir um blueprint independente de ferramenta.

Esse blueprint poderá ser traduzido depois para:

- GitHub Actions;
- GitLab CI;
- Jenkins;
- Azure Pipelines;
- CircleCI;
- Buildkite;
- Argo Workflows;
- Tekton;
- outro orquestrador.

A visão profissional será dividida em duas grandes partes.

#### Continuous Integration

Responde:

```text
o commit está
correto,
testado,
seguro
e empacotável?
```

#### Continuous Delivery

Responde:

```text
o artefato validado
está pronto
para ser promovido
com segurança?
```

#### Continuous Deployment

Responde:

```text
o artefato aprovado
pode chegar
automaticamente
ao ambiente final?
```

Delivery e deployment não são a mesma coisa.

Um time pode possuir:

```text
CI automatizada;

entrega contínua;

deploy produtivo
com aprovação manual.
```

Isso ainda é CI/CD.

A maturidade não é medida apenas por remover aprovações humanas.

Ela é medida por:

- qualidade dos gates;
- previsibilidade;
- segurança;
- velocidade;
- recuperação;
- evidência;
- capacidade de aprender.

A aplicação do laboratório terá um pipeline lógico com os estágios:

```text
1. checkout;

2. contexto;

3. validação rápida;

4. testes unitários;

5. testes de arquitetura;

6. testes de integração;

7. validação de migrations;

8. análise de dependências;

9. build do JAR;

10. build da imagem;

11. verificação da imagem;

12. geração de SBOM;

13. publicação do artefato;

14. deploy em ambiente de teste;

15. smoke test;

16. promoção;

17. deploy controlado;

18. observação;

19. rollback ou conclusão.
```

Nem todo estágio será implementado tecnicamente nesta aula.

O objetivo é definir contratos.

Cada estágio precisa responder:

```text
qual entrada?

qual saída?

qual evidência?

qual gate?

qual falha?

qual retry?

qual owner?
```

Outro princípio será obrigatório:

```text
build once,
promote many.
```

O pipeline não reconstruirá a aplicação em cada ambiente.

Ele produzirá uma imagem única.

Depois, promoverá a mesma identidade:

```text
tag;

digest;

commit;

SBOM;

proveniência.
```

A configuração e os secrets mudam por ambiente.

O artefato não.

A aula também separará:

```text
pipeline de pull request;

pipeline da branch principal;

pipeline de release;

pipeline de promoção;

pipeline de rollback.
```

#### Pull request

Prioriza feedback rápido e confiança antes do merge.

#### Branch principal

Produz o candidato oficial.

#### Release

Associa versão, imagem, digest e evidências.

#### Promoção

Move o mesmo artefato entre ambientes.

#### Rollback

Retorna para uma baseline conhecida.

A aula trabalhará com uma regra de paralelismo.

Estágios independentes podem executar em paralelo.

Exemplo:

```text
unit tests;

static analysis;

architecture tests.
```

Estágios dependentes precisam respeitar ordem.

Exemplo:

```text
image publish
somente depois
do build e dos testes.
```

O pipeline também terá fail-fast.

Quando um gate essencial falha:

```text
os estágios dependentes
não continuam.
```

Porém, fail-fast não significa perder evidências.

Logs, relatórios e resultados precisam ser preservados.

A aula também definirá:

```text
caching;

artifacts;

outputs;

environments;

concurrency;

timeouts;

retries;

secrets;

permissions;

approvals;

retention.
```

O pipeline local criado nesta aula será uma simulação.

Ele não substituirá o CI real.

Será criado:

```text
scripts/pipeline/run-local-ci.ps1.
```

Esse script executará uma sequência equivalente aos primeiros gates.

Ele permitirá validar o blueprint antes de traduzi-lo para GitHub Actions.

O script local poderá executar:

- Git status;
- Maven Wrapper;
- testes;
- verificação de formatting quando disponível;
- migration tests;
- Docker build;
- image inspect;
- health smoke;
- relatório.

Ele não terá credenciais de registry.

Ele não publicará imagem remota.

Ele não fará deploy produtivo.

A próxima aula cuidará da plataforma de workflow.

Ao final, você deverá explicar:

```text
a diferença entre CI,
delivery
e deployment;

por que um pipeline
é um grafo de dependências;

por que PR,
main,
release
e promoção
possuem objetivos diferentes;

como build once
preserva identidade;

o que são gates;

o que são artifacts;

o que são outputs;

como cache difere
de artifact;

por que secrets
precisam de menor privilégio;

como separar
pipeline de aplicação
e pipeline de deploy;

quando usar aprovação;

como medir
a qualidade do fluxo.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
516:
Rollback seguro.

517:
Deploy com migracao sem downtime.

518:
CI CD profissional visao geral.

519:
GitHub Actions workflows.

520:
Pipeline de build e testes.
```

A aula 517 respondeu:

```text
como alterar
o schema
sem perder
compatibilidade
e rollback?
```

A aula 518 responderá:

```text
como organizar
todas as práticas anteriores
em um fluxo profissional?
```

Nesta aula:

```text
CI:
sim.

continuous delivery:
sim.

continuous deployment:
sim.

pipeline graph:
sim.

stages:
sim.

jobs:
sim.

steps:
sim.

artifacts:
sim.

cache:
sim.

outputs:
sim.

gates:
sim.

environments:
sim.

permissions:
sim.

secrets:
sim.

approvals:
sim.

concurrency:
sim.

timeouts:
sim.

observabilidade:
sim.

métricas DORA:
conceitual.

GitHub Actions:
não implementado.

workflow YAML:
não implementado.

registry remoto:
não publicado.

deploy produtivo:
não executado.
```

A regra central será:

```text
o pipeline automatiza
uma política de engenharia;

não substitui
a política.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
pipeline
├── ci-cd-blueprint.yaml
├── pipeline-contracts.yaml
├── environment-promotion.yaml
└── quality-gates.yaml

scripts/pipeline
├── run-local-ci.ps1
├── collect-pipeline-evidence.ps1
├── verify-build-reproducibility.ps1
├── verify-pipeline-prerequisites.ps1
└── clean-local-pipeline.ps1

docs/devops/ci-cd
├── CI_CD_ARCHITECTURE.md
├── PIPELINE_STAGE_CATALOG.md
├── PIPELINE_TRIGGER_POLICY.md
├── PIPELINE_ARTIFACT_POLICY.md
├── PIPELINE_SECURITY_POLICY.md
├── PIPELINE_ENVIRONMENT_STRATEGY.md
├── PIPELINE_FAILURE_POLICY.md
├── PIPELINE_OBSERVABILITY.md
├── PIPELINE_METRICS.md
├── PIPELINE_LOCAL_RUNBOOK.md
└── PIPELINE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
pipeline mapeado;

gatilhos definidos;

estágios catalogados;

inputs e outputs definidos;

gates definidos;

artefatos definidos;

ambientes definidos;

permissões definidas;

segredos isolados;

promoção definida;

rollback integrado;

script local;

evidências.
```

Você irá:

1. confirmar a baseline;
2. definir CI, delivery e deployment;
3. mapear pipelines;
4. definir gatilhos;
5. definir jobs;
6. definir dependências;
7. definir paralelismo;
8. definir fail-fast;
9. definir timeouts;
10. definir retries;
11. definir cache;
12. definir artifacts;
13. definir outputs;
14. definir versionamento;
15. definir imagem candidata;
16. definir SBOM;
17. definir provenance;
18. definir ambientes;
19. definir approvals;
20. definir permissions;
21. definir secrets;
22. definir concurrency;
23. definir promoção;
24. definir rollback;
25. definir observabilidade;
26. definir métricas;
27. criar blueprint;
28. criar contracts;
29. criar quality gates;
30. criar script local;
31. executar pipeline local;
32. coletar evidências;
33. testar falha;
34. documentar;
35. executar gate;
36. commitar;
37. preparar a aula 519.

---

## Conceito essencial

### Pipeline

Pipeline é um grafo de execução.

Ele possui:

- triggers;
- stages;
- jobs;
- steps;
- dependencies;
- inputs;
- outputs;
- conditions.

Um pipeline não precisa ser estritamente linear.

---

### Stage

Stage representa uma fase lógica.

Exemplo:

```text
verify;

build;

package;

publish;

deploy;

observe.
```

---

### Job

Job é uma unidade executável.

Ele roda em um ambiente isolado.

Exemplos:

```text
unit-tests;

integration-tests;

build-image.
```

---

### Step

Step é uma ação dentro de um job.

Exemplo:

```text
checkout;

setup Java;

run Maven;

upload report.
```

---

### Trigger

Trigger inicia o pipeline.

Exemplos:

- pull request;
- push;
- tag;
- schedule;
- manual dispatch;
- artifact promotion;
- rollback request.

---

### Gate

Gate é uma condição obrigatória.

Exemplos:

```text
testes verdes;

migration validate;

imagem não root;

healthcheck presente;

vulnerabilidade crítica ausente;

aprovação;
```

Gate não é apenas um log.

Ele bloqueia progressão.

---

### Artifact

Artifact é uma saída preservada.

Exemplos:

- JAR;
- image digest;
- test report;
- coverage report;
- SBOM;
- migration report;
- release evidence.

Artifacts precisam de:

- identidade;
- retenção;
- integridade;
- owner.

---

### Cache

Cache acelera execução.

Exemplo:

```text
dependências Maven.
```

Cache pode ser descartado.

Artifact não deve depender do cache para existir.

Cache não é mecanismo de promoção.

---

### Output

Output é um valor produzido por job.

Exemplos:

```text
version;

image tag;

digest;

commit;

environment URL.
```

Outputs conectam jobs.

---

### Build once

A imagem é construída uma vez.

O digest produzido vira o elo de promoção.

O deploy de homologação e produção utiliza a mesma identidade.

---

### Reproducibility

Reproducibilidade significa obter resultado equivalente a partir das mesmas entradas.

Ela depende de:

- lock de versões;
- wrapper;
- base image controlada;
- context limpo;
- clocks quando relevantes;
- metadata explícita.

---

### Pull request pipeline

Objetivo:

```text
feedback rápido
antes do merge.
```

Gates:

- compile;
- unit;
- architecture;
- static checks;
- migration tests;
- integration subset.

Não publica release oficial.

---

### Main pipeline

Objetivo:

```text
produzir candidato oficial
do commit integrado.
```

Pode executar:

- suíte completa;
- build JAR;
- build image;
- SBOM;
- scan;
- publish;
- deploy de teste.

---

### Release pipeline

Objetivo:

```text
congelar identidade
e evidências.
```

Pode ser disparado por tag ou aprovação.

---

### Promotion pipeline

Objetivo:

```text
promover o mesmo digest.
```

Não faz rebuild.

---

### Rollback pipeline

Objetivo:

```text
restaurar baseline conhecida.
```

Ele utiliza o runbook da aula 516.

---

### Environment

Environment representa uma fronteira operacional.

Exemplos:

- development;
- test;
- staging;
- production.

Cada ambiente possui:

- configuração;
- secrets;
- permissões;
- approval;
- observabilidade;
- retention.

---

### Concurrency

Concurrency impede execuções conflitantes.

Exemplo:

```text
dois deploys
simultâneos
para production.
```

A política pode cancelar o anterior ou serializar.

---

### Timeout

Todo job precisa de limite.

Sem timeout, um pipeline pode consumir runner indefinidamente.

---

### Retry

Retry deve ser usado apenas para falha transitória.

Não repita automaticamente:

- teste determinístico falho;
- migration incompatível;
- scan crítico;
- erro de compilação.

---

### Least privilege

O pipeline recebe somente permissões necessárias.

Um job de teste não precisa:

- publicar imagem;
- alterar ambiente;
- ler secret produtivo.

---

### Secret boundary

Secrets devem ser liberados somente em jobs e ambientes necessários.

Pull requests não confiáveis não devem receber secrets sensíveis.

---

### Supply chain

A cadeia inclui:

```text
source;

dependencies;

runner;

build;

image;

registry;

deploy;

runtime.
```

Cada elo precisa de identidade e confiança.

---

### SBOM

Software Bill of Materials descreve componentes do artefato.

Ela ajuda:

- inventário;
- resposta a vulnerabilidade;
- auditoria;
- compliance.

Nesta aula será definida como saída.

A geração técnica será aprofundada posteriormente.

---

### Provenance

Provenance registra como o artefato foi produzido.

Pode incluir:

- commit;
- workflow;
- runner;
- inputs;
- timestamp;
- builder;
- digest.

---

### Observabilidade do pipeline

O pipeline também precisa de sinais:

- duração;
- falhas;
- fila;
- retries;
- custo;
- flaky tests;
- tempo de aprovação;
- tempo de deploy;
- rollback.

---

### Métricas DORA

Conceitualmente:

```text
deployment frequency;

lead time for changes;

change failure rate;

mean time to restore.
```

Elas medem o sistema de entrega.

Não devem ser usadas para punir indivíduos.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
.\scripts\migration\verify-migration-compatibility.ps1
```

---

### 2. Criar arquitetura do pipeline

Arquivo:

```text
CI_CD_ARCHITECTURE.md
```

Diagrama:

```text
Pull Request
     |
     v
Fast Verification
     |
     v
Merge to Main
     |
     v
Full Verification
     |
     v
Build Artifact
     |
     v
Build Image
     |
     v
Publish Candidate
     |
     v
Deploy Test
     |
     v
Promotion Gate
     |
     v
Controlled Release
     |
     v
Observe
     |
     +----> Complete
     |
     +----> Rollback
```

---

### 3. Definir gatilhos

Arquivo:

```text
PIPELINE_TRIGGER_POLICY.md
```

Tabela:

```markdown
| Trigger | Pipeline | Objetivo |
|---|---|---|
| Pull request | PR validation | Feedback |
| Push main | Main build | Candidato |
| Tag | Release | Versão |
| Manual | Promotion | Ambiente |
| Manual | Rollback | Recuperação |
| Schedule | Maintenance | Dependências |
```

---

### 4. Criar blueprint

Arquivo:

```text
pipeline/ci-cd-blueprint.yaml
```

Esse arquivo não é um workflow executável.

Conteúdo conceitual:

```yaml
pipeline:
  name: java-backend-delivery

  triggers:
    pull_request:
      branches:
        - main

    push:
      branches:
        - main

    release_tag:
      pattern:
        "v*"

    manual:
      actions:
        - promote
        - rollback

  stages:
    - id: verify
      jobs:
        - compile
        - unit_tests
        - architecture_tests
        - static_checks

    - id: integration
      depends_on:
        - verify

      jobs:
        - integration_tests
        - migration_tests

    - id: package
      depends_on:
        - integration

      jobs:
        - build_jar
        - build_image
        - verify_image

    - id: publish
      depends_on:
        - package

      jobs:
        - publish_image
        - publish_reports
        - publish_sbom

    - id: deploy_test
      depends_on:
        - publish

      jobs:
        - migrate_test
        - deploy_candidate
        - smoke_test

    - id: promote
      depends_on:
        - deploy_test

      jobs:
        - approval
        - promote_digest

    - id: observe
      depends_on:
        - promote

      jobs:
        - release_observation
        - complete_or_rollback
```

---

### 5. Criar contracts

Arquivo:

```text
pipeline/pipeline-contracts.yaml
```

Exemplo:

```yaml
jobs:
  unit_tests:
    inputs:
      - source
      - pom
      - maven_wrapper

    outputs:
      - surefire_reports

    gates:
      - exit_code_zero

    timeout:
      minutes: 10

  build_image:
    inputs:
      - verified_commit

    outputs:
      - image_tag
      - image_id
      - image_digest

    gates:
      - non_root
      - healthcheck
      - no_secrets
```

---

### 6. Criar quality gates

Arquivo:

```text
pipeline/quality-gates.yaml
```

Inclua:

```yaml
gates:
  source:
    - compilation
    - unit_tests
    - architecture_tests
    - formatting
    - no_secret_leak

  database:
    - flyway_validate
    - migration_compatibility
    - postgres_integration

  image:
    - multi_stage
    - non_root
    - read_only_compatible
    - healthcheck
    - labels
    - no_build_tools
    - no_secrets

  release:
    - smoke_test
    - readiness
    - rollback_target
    - observation_plan
    - approval
```

---

### 7. Definir catálogo de stages

Arquivo:

```text
PIPELINE_STAGE_CATALOG.md
```

Para cada stage, documente:

- propósito;
- gatilho;
- inputs;
- outputs;
- gates;
- timeout;
- owner;
- evidências;
- falhas.

---

### 8. Definir pipeline de PR

PR:

```text
checkout;

JDK;

Maven cache;

compile;

unit;

architecture;

migration tests;

secret scan;

reports.
```

Não recebe:

- production secrets;
- registry write;
- deploy permission.

---

### 9. Definir pipeline de main

Main:

```text
suíte completa;

JAR;

imagem;

SBOM;

scan;

publicação de candidato;

deploy test.
```

---

### 10. Definir pipeline de promoção

Promoção recebe:

```text
digest;

environment;

release plan;

approval.
```

Ela não recebe código-fonte como entrada obrigatória para rebuild.

---

### 11. Definir pipeline de rollback

Rollback recebe:

```text
baseline file;

target digest;

config reference;

environment;

reason;

approval.
```

Ele chama os controles da aula 516.

---

### 12. Definir versionamento

Versão candidata pode combinar:

```text
SemVer;

commit SHA;

build number.
```

Exemplo:

```text
5.2.0-rc.3;

sha-abc1234.
```

A tag humana não substitui o digest.

---

### 13. Definir artifacts

Arquivo:

```text
PIPELINE_ARTIFACT_POLICY.md
```

Artifacts:

- JAR;
- test reports;
- coverage;
- migration reports;
- image digest;
- SBOM;
- provenance;
- release evidence;
- rollback evidence.

Defina retenção.

---

### 14. Diferenciar cache

Cache Maven:

```text
chave:

sistema operacional;

JDK;

hash do pom.
```

Cache não inclui:

- secrets;
- target promovido;
- banco;
- resultados oficiais.

---

### 15. Definir outputs

Outputs obrigatórios:

```text
commit_sha;

version;

jar_name;

image_tag;

image_digest;

sbom_path;

test_environment_url;

release_id.
```

---

### 16. Definir environments

Arquivo:

```text
PIPELINE_ENVIRONMENT_STRATEGY.md
```

Tabela:

```markdown
| Ambiente | Deploy | Aprovação | Secrets |
|---|---|---|---|
| Test | Automático | Não | Test |
| Staging | Promoção | Opcional | Staging |
| Production | Promoção | Sim | Production |
```

Adapte à política real.

---

### 17. Definir approvals

Aprovação deve observar:

- evidências;
- change window;
- rollback target;
- migration plan;
- owner;
- incident status.

Aprovação não deve ser clique sem contexto.

---

### 18. Definir security policy

Arquivo:

```text
PIPELINE_SECURITY_POLICY.md
```

Inclua:

- least privilege;
- pinned actions quando aplicável;
- protected branches;
- environment secrets;
- short-lived credentials;
- OIDC conceitual;
- log redaction;
- untrusted forks;
- dependency trust;
- runner isolation;
- secret rotation.

---

### 19. Definir permissions por job

Exemplo conceitual:

```text
test:

read repository.

publish:

read repository,
write package.

deploy:

read artifact,
write environment.

rollback:

read baseline,
write environment.
```

---

### 20. Definir concurrency

Chaves:

```text
ci-${branch};

deploy-${environment};

rollback-${environment}.
```

Política:

- PR pode cancelar execução antiga;
- deploy produtivo deve serializar;
- rollback pode interromper promoção quando autorizado.

---

### 21. Definir timeouts

Exemplo:

```text
unit:
10 min.

integration:
20 min.

image:
15 min.

deploy test:
15 min.

observation:
janela definida.
```

Ajuste com dados reais.

---

### 22. Definir retry

Retry permitido:

- download transitório;
- registry timeout;
- runner network;
- consulta externa idempotente.

Retry proibido:

- teste determinístico;
- compilation;
- migration incompatível;
- secret leak;
- quality gate.

---

### 23. Definir failure policy

Arquivo:

```text
PIPELINE_FAILURE_POLICY.md
```

Estados:

```text
failed;

cancelled;

timed_out;

blocked;

rolled_back;

completed.
```

Cada estado precisa de ação.

---

### 24. Definir observabilidade

Arquivo:

```text
PIPELINE_OBSERVABILITY.md
```

Sinais:

- job duration;
- queue time;
- success rate;
- flaky retries;
- cache hit;
- artifact size;
- deploy duration;
- approval delay;
- rollback rate;
- environment failures.

---

### 25. Definir métricas

Arquivo:

```text
PIPELINE_METRICS.md
```

Inclua DORA e métricas internas.

Não use número de commits como produtividade individual.

---

### 26. Criar promoção

Arquivo:

```text
pipeline/environment-promotion.yaml
```

Conteúdo conceitual:

```yaml
promotion:
  artifact:
    required:
      - image_digest
      - sbom
      - provenance

  environments:
    test:
      automatic: true

    staging:
      automatic: false
      requires:
        - test_success

    production:
      automatic: false
      requires:
        - staging_success
        - approval
        - rollback_target
        - observation_plan
```

---

### 27. Criar script de pré-requisitos

Arquivo:

```text
verify-pipeline-prerequisites.ps1
```

Valide:

- Git;
- JDK;
- Maven Wrapper;
- Docker;
- Compose;
- espaço;
- arquivos;
- scripts;
- secrets locais sem conteúdo;
- PostgreSQL test support.

---

### 28. Criar pipeline local

Arquivo:

```text
run-local-ci.ps1
```

Fluxo:

1. definir `$ErrorActionPreference`;
2. criar diretório de evidências;
3. capturar commit;
4. executar `git diff --check`;
5. executar Maven verify;
6. executar migration compatibility;
7. build image;
8. verify image security;
9. inspect healthcheck;
10. iniciar stack de teste;
11. smoke;
12. salvar relatório;
13. limpar em `finally`.

---

### 29. Não usar ambiente sujo

O script deve alertar quando:

```text
git status --porcelain
```

possui mudanças.

Para desenvolvimento local, permita:

```text
-AllowDirtyWorkingTree.
```

Mas registre essa condição.

No CI oficial, o checkout deve ser limpo.

---

### 30. Criar verificação de reprodutibilidade

Arquivo:

```text
verify-build-reproducibility.ps1
```

Execute duas builds controladas.

Compare:

- JAR hash;
- image metadata relevante;
- layers;
- labels;
- conteúdo esperado.

Timestamps podem gerar diferenças.

Documente quais diferenças são aceitáveis.

---

### 31. Criar coleta de evidências

Arquivo:

```text
collect-pipeline-evidence.ps1
```

Colete:

- commit;
- status;
- Maven reports;
- migration reports;
- image inspect;
- digest;
- health;
- smoke;
- timestamps;
- duração.

Não colete secrets.

---

### 32. Criar limpeza

Arquivo:

```text
clean-local-pipeline.ps1
```

Remova:

- containers de teste;
- rede de teste;
- arquivos temporários;
- logs locais;
- evidence temp quando solicitado.

Não remova volumes persistentes sem confirmação.

---

### 33. Executar pipeline local

```powershell
.\scripts\pipeline\run-local-ci.ps1
```

Observe:

```text
stage;

start;

end;

duration;

result.
```

---

### 34. Simular falha de teste

Crie uma falha temporária.

Confirme:

- stage verify falha;
- build image não executa;
- relatório é preservado;
- cleanup acontece;
- exit code é não zero.

Restaure o teste.

---

### 35. Simular falha de migration

Altere temporariamente uma expectation de teste, sem editar migration aplicada.

Confirme:

- integration falha;
- publish não continua;
- evidência existe.

Restaure.

---

### 36. Simular falha de imagem

Remova temporariamente `USER`.

Confirme que o gate de imagem falha.

Restaure.

---

### 37. Criar runbook local

Arquivo:

```text
PIPELINE_LOCAL_RUNBOOK.md
```

Inclua:

- pré-requisitos;
- execução;
- outputs;
- evidências;
- falhas;
- limpeza;
- comparação com CI real.

---

### 38. Criar troubleshooting

Arquivo:

```text
PIPELINE_TROUBLESHOOTING.md
```

Inclua:

- JDK incorreto;
- Maven cache corrompido;
- Docker indisponível;
- Compose não encontrado;
- Testcontainers falha;
- migration incompatível;
- image build falha;
- health timeout;
- evidence ausente;
- cleanup incompleto;
- secret no log;
- working tree suja;
- timeout.

---

### 39. Executar gate final

Execute:

```powershell
.\scripts\pipeline\verify-pipeline-prerequisites.ps1

.\scripts\pipeline\run-local-ci.ps1
```

Depois:

```powershell
git diff --check
git status
```

Valide que nenhum arquivo:

```text
.github/workflows
```

foi criado.

---

## Entendendo o que foi feito

### O pipeline virou arquitetura

Ele deixou de ser tratado como um script isolado.

### PR e main ganharam objetivos diferentes

Feedback rápido e candidato oficial foram separados.

### Build e promoção foram desacoplados

O mesmo digest atravessa ambientes.

### Gates ganharam contratos

Cada job possui entrada, saída, timeout e evidência.

### Cache e artifact foram separados

Aceleração não foi confundida com entrega.

### Secrets ganharam fronteiras

Jobs recebem apenas o necessário.

### Deploy ganhou environments

Configuração, aprovação e ownership ficaram explícitos.

### Rollback entrou no pipeline

Recuperação deixou de ser uma atividade externa.

### Métricas ganharam propósito

O sistema de entrega pode ser melhorado por dados.

### A próxima aula ganhou um blueprint

GitHub Actions será uma tradução, não uma invenção do processo.

---

## Erros comuns importantes

### Começar pelo YAML da ferramenta

A política fica escondida em sintaxe.

### Usar um job gigante

Falhas, cache e evidências ficam difíceis de isolar.

### Rebuildar por ambiente

O artefato promovido deixa de ser o validado.

### Usar cache como artifact

A saída oficial pode desaparecer.

### Liberar secrets em PR de fork

Credenciais podem vazar.

### Dar permissão ampla ao workflow

Um job comprometido ganha alcance excessivo.

### Repetir teste falho automaticamente

Flaky test é escondido.

### Não definir timeout

Runner pode ficar preso.

### Publicar antes dos gates

Artefato inválido vira candidato.

### Fazer deploy produtivo sem rollback target

A recuperação começa sem baseline.

### Medir pessoas por métricas DORA

O objetivo é melhorar o sistema.

### Antecipar GitHub Actions

A aula 519 possui esse objetivo.

---

## Comandos úteis

### Verificar pré-requisitos

```powershell
.\scripts\pipeline\verify-pipeline-prerequisites.ps1
```

### Executar CI local

```powershell
.\scripts\pipeline\run-local-ci.ps1
```

### Coletar evidências

```powershell
.\scripts\pipeline\collect-pipeline-evidence.ps1
```

### Verificar reprodutibilidade

```powershell
.\scripts\pipeline\verify-build-reproducibility.ps1
```

### Limpar ambiente

```powershell
.\scripts\pipeline\clean-local-pipeline.ps1
```

---

## Exercício guiado

### Parte 1 — Conceitos

Diferencie CI, delivery e deployment.

### Parte 2 — Triggers

Mapeie PR, main, release e rollback.

### Parte 3 — Grafo

Defina stages e dependências.

### Parte 4 — Gates

Defina quality gates.

### Parte 5 — Outputs

Defina artifacts e outputs.

### Parte 6 — Segurança

Defina permissions e secrets.

### Parte 7 — Ambientes

Defina promoção.

### Parte 8 — Observabilidade

Defina métricas.

### Parte 9 — Simulação

Execute CI local.

### Parte 10 — Falha

Comprove fail-fast e evidência.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 517 foi preservada;
- CI foi definida;
- continuous delivery foi definida;
- continuous deployment foi definida;
- diferenças foram explicadas;
- pipeline foi definido como grafo;
- stage foi definido;
- job foi definido;
- step foi definido;
- trigger foi definido;
- gate foi definido;
- artifact foi definido;
- cache foi definido;
- output foi definido;
- build once foi preservado;
- reproducibility foi discutida;
- pipeline de PR foi definido;
- pipeline de main foi definido;
- pipeline de release foi definido;
- pipeline de promoção foi definido;
- pipeline de rollback foi definido;
- environments foram definidos;
- concurrency foi definida;
- timeout foi definido;
- retry foi definido;
- least privilege foi aplicado;
- secret boundary foi definida;
- supply chain foi mapeada;
- SBOM foi definida;
- provenance foi definida;
- observabilidade do pipeline foi definida;
- métricas DORA foram apresentadas;
- métricas não foram usadas para punir pessoas;
- arquitetura foi documentada;
- triggers foram documentados;
- blueprint foi criado;
- blueprint não é workflow executável;
- contracts foram criados;
- quality gates foram criados;
- catálogo de stages foi criado;
- PR não recebe production secrets;
- PR não recebe registry write;
- main produz candidato;
- release congela identidade;
- promoção usa digest;
- rollback usa baseline;
- versionamento foi definido;
- tag não substitui digest;
- artifact policy foi criada;
- retenção foi definida;
- cache Maven foi definido;
- cache não contém secrets;
- cache não é promoção;
- outputs obrigatórios foram definidos;
- environment strategy foi criada;
- test environment foi definido;
- staging foi definido;
- production foi definido;
- approvals foram discutidos;
- approval observa evidências;
- security policy foi criada;
- permissions por job foram definidas;
- concurrency por ambiente foi definida;
- deploy produtivo foi serializado;
- timeouts foram definidos;
- retries transitórios foram definidos;
- retries determinísticos foram proibidos;
- failure policy foi criada;
- observabilidade foi documentada;
- metrics doc foi criado;
- promotion YAML conceitual foi criado;
- pré-requisitos foram verificados;
- pipeline local foi criado;
- Git limpo foi validado;
- dirty mode foi documentado;
- Maven verify foi executado;
- migration compatibility foi executada;
- image build foi executado;
- image security foi validada;
- healthcheck foi inspecionado;
- stack de teste foi iniciada;
- smoke foi executado;
- cleanup em finally foi usado;
- reprodutibilidade foi verificada;
- evidências foram coletadas;
- secrets não foram coletados;
- limpeza foi criada;
- volumes não foram removidos sem confirmação;
- pipeline local foi executado;
- stage duration foi registrada;
- falha de teste foi simulada;
- build não continuou após falha;
- relatório foi preservado;
- falha de migration foi simulada;
- publish não continuou;
- falha de imagem foi simulada;
- gate non-root falhou;
- alterações temporárias foram restauradas;
- runbook local foi criado;
- troubleshooting foi criado;
- nenhum workflow GitHub Actions foi criado;
- registry remoto não foi usado;
- deploy produtivo não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 519 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline `
  scripts/pipeline `
  docs/devops/ci-cd `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Confirme que não existe:

```text
.github/workflows.
```

Commit recomendado:

```powershell
git commit -m "docs(m17): estruturar visao profissional de CI CD"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret;
- `.env`;
- app env local;
- token;
- password;
- banco;
- volume;
- logs brutos;
- evidências locais sensíveis;
- cache;
- imagem exportada;
- workflow da aula 519.

---

## Fechamento e ponte para a próxima aula

Nesta aula, CI/CD deixou de ser entendido como um arquivo YAML.

O fluxo passou a possuir:

```text
triggers;

stages;

jobs;

steps;

dependencies;

gates;

artifacts;

outputs;

cache;

environments;

permissions;

promotion;

rollback;

observability.
```

Você comprovou que:

- CI valida integração;
- delivery mantém o artefato pronto;
- deployment pode automatizar a produção;
- PR e main possuem objetivos diferentes;
- o pipeline é um grafo;
- build once preserva identidade;
- digest conecta build e promoção;
- cache acelera;
- artifact preserva;
- outputs conectam jobs;
- secrets precisam de menor privilégio;
- deploys concorrentes precisam ser controlados;
- timeout e retry precisam de política;
- rollback faz parte do sistema de entrega;
- métricas ajudam a melhorar o fluxo;
- o processo deve existir antes da ferramenta.

A próxima aula será:

```text
519 - M17.14 - GitHub Actions workflows
```

Nela, você irá traduzir o blueprint em workflows reais, com jobs, dependências, cache, artifacts, outputs, permissions e triggers.

Nenhum workflow GitHub Actions foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Defini CI, delivery e deployment.
- [ ] Modelei stages e jobs.
- [ ] Criei gates e artifacts.
- [ ] Defini ambientes e segurança.
- [ ] Modelei promoção e rollback.
- [ ] Criei pipeline local.
- [ ] Testei fail-fast.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O pipeline local funciona, mas o CI não

O runner, shell, paths ou serviços podem ser diferentes.

### O cache não restaura

Revise chave, escopo e hash do POM.

### O artifact está vazio

O job pode usar path incorreto ou gerar depois do upload.

### O deploy reconstrói a imagem

A promoção não está usando digest existente.

### Um job recebe secret desnecessário

Reduza permissões e escopo.

### Dois deploys conflitam

Defina concurrency por ambiente.

### O pipeline fica preso

Adicione timeout e cleanup.

### Retry esconde teste flaky

Remova retry e trate a causa.

### Testcontainers falha no runner

Revise Docker disponível, recursos e permissões.

### A evidência contém secret

Interrompa, revogue quando necessário e corrija a coleta.

### O blueprint virou sintaxe específica

Separe contrato lógico da implementação.

### Workflow apareceu nesta aula

Remova e preserve para a aula 519.

---

## Perguntas de revisão

1. O que é CI?
2. O que é continuous delivery?
3. O que é continuous deployment?
4. O que é pipeline?
5. O que é stage?
6. O que é job?
7. O que é step?
8. O que é gate?
9. O que é artifact?
10. O que é cache?
11. O que é output?
12. O que significa build once?
13. Qual o objetivo do PR pipeline?
14. Qual o objetivo do main pipeline?
15. O que faz promotion pipeline?
16. Por que usar least privilege?
17. Para que serve concurrency?
18. O que são métricas DORA?
19. O que não foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Integração contínua.
2. Artefato sempre entregável.
3. Deploy automático.
4. Grafo de execução.
5. Fase lógica.
6. Unidade isolada.
7. Ação do job.
8. Condição obrigatória.
9. Saída preservada.
10. Aceleração descartável.
11. Valor entre jobs.
12. Promover o mesmo artefato.
13. Feedback antes do merge.
14. Produzir candidato.
15. Promover digest.
16. Reduzir impacto.
17. Evitar conflito.
18. Métricas do fluxo.
19. GitHub Actions.
20. GitHub Actions workflows.

---

## Desafio opcional

Crie uma matriz de pipeline para dois JDKs.

Requisitos:

- JDK 21 obrigatório;
- segundo JDK somente compatibilidade;
- build oficial gerado uma vez;
- resultados separados;
- cache separado;
- falha do JDK obrigatório bloqueia;
- falha do secundário possui policy explícita;
- nenhum workflow específico;
- documentação de custo e tempo.

O objetivo é compreender matrix strategy antes de implementá-la na plataforma.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 518 - M17.13 - CI CD profissional visao geral

- Continuei após deploy com migration sem downtime.
- Diferenciei CI, continuous delivery e continuous deployment.
- Modelei pipeline como grafo.
- Diferenciei stages, jobs e steps.
- Defini triggers para PR, main, release, promoção e rollback.
- Defini quality gates.
- Diferenciei artifacts, cache e outputs.
- Preservei build once, promote many.
- Defini versionamento, tag e digest.
- Modelei pipeline de pull request.
- Modelei pipeline da branch principal.
- Modelei pipeline de release.
- Modelei pipeline de promoção.
- Modelei pipeline de rollback.
- Defini ambientes de test, staging e production.
- Defini approvals com evidências.
- Defini permissions por job.
- Apliquei least privilege.
- Defini secret boundaries.
- Defini concurrency por ambiente.
- Defini timeouts e retries.
- Mapeei supply chain.
- Defini SBOM e provenance como artifacts.
- Criei blueprint independente de ferramenta.
- Criei contracts e quality gates.
- Criei política de artifacts e segurança.
- Criei estratégia de promoção.
- Criei script de pré-requisitos.
- Criei pipeline CI local.
- Executei Maven, migrations, imagem, health e smoke.
- Criei verificação de reprodutibilidade.
- Criei coleta de evidências.
- Criei cleanup seguro.
- Simulei falha de teste, migration e imagem.
- Comprovei fail-fast com evidências preservadas.
- Documentei observabilidade e métricas DORA.
- Não antecipei GitHub Actions.
- Próxima aula: GitHub Actions workflows.
```

---

## Referência técnica curta

- Continuous Integration.
- Continuous Delivery.
- Continuous Deployment.
- Pipeline as a Directed Acyclic Graph.
- Build Once, Promote Many.
- Artifact Management.
- Least Privilege.
- Software Bill of Materials.
- Build Provenance.
- DORA Metrics.

Regra final:

```text
CI/CD profissional automatiza uma política de engenharia: pull requests recebem feedback rápido sem secrets de produção, a branch principal executa a suíte completa e produz um candidato identificado por commit, tag e digest, a release preserva JAR, relatórios, SBOM, provenance e evidências, e a promoção move o mesmo artefato entre test, staging e production sem rebuild; o pipeline é um grafo de stages, jobs, steps, dependencies, gates, artifacts, cache e outputs, com timeouts, retries transitórios, fail-fast, concurrency e permissions de menor privilégio; environments controlam configuração, secrets, approvals e deploy, enquanto rollback utiliza a baseline conhecida das aulas anteriores; métricas de duração, fila, falha, rollback e DORA ajudam a melhorar o sistema sem medir pessoas; o blueprint, os contracts, os quality gates e o pipeline local validam a política de forma independente da plataforma; somente na aula 519 essa arquitetura será traduzida para GitHub Actions workflows reais.
```
