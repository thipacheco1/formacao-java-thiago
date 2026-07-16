# 688 - M20.18 - CI CD do projeto final

## Apresentação da aula

Na aula 687, você conteinerizou o OrderFlow.

O projeto passou a possuir:

- Dockerfiles multi-stage;
- layered JARs;
- imagens separadas para API e workers;
- usuário não root;
- filesystem controlado;
- configuração externa;
- PostgreSQL;
- Kafka em modo KRaft;
- criação idempotente de topics;
- OpenTelemetry Collector;
- Prometheus;
- Grafana;
- redes;
- volumes;
- health checks;
- limites de recursos;
- graceful shutdown;
- profiles do Docker Compose;
- scripts operacionais;
- smoke tests;
- testes de falha;
- reports, evidence e gate.

O ambiente local já pode ser construído e iniciado de forma reproduzível.

Mas uma entrega profissional não pode depender de uma pessoa executar manualmente:

```text
mvn clean verify;

docker compose build;

scan;

tag;

push;

deploy;

smoke;

rollback.
```

Essas etapas precisam formar uma pipeline automatizada, auditável e repetível.

Nesta aula, você implementará o CI/CD do OrderFlow.

CI significa:

```text
Continuous Integration.
```

O objetivo é integrar mudanças pequenas e verificar rapidamente:

- compilação;
- testes;
- arquitetura;
- segurança;
- contratos;
- migrations;
- containers;
- documentação;
- evidências.

CD pode significar:

```text
Continuous Delivery
```

ou:

```text
Continuous Deployment.
```

Neste projeto, será adotado:

```text
Continuous Delivery
com promocao controlada.
```

A pipeline produzirá artefatos prontos para implantação.

A promoção para ambientes exige gates explícitos.

A implantação final ou sua simulação completa será realizada na aula 689.

O CI/CD desta aula incluirá:

- validação de pull request;
- build Maven;
- cache seguro;
- testes unitários;
- testes de arquitetura;
- testes de integração;
- Testcontainers;
- validação de migrations;
- testes de contrato;
- testes da API;
- testes de mensageria;
- testes de observabilidade;
- validação do Docker Compose;
- construção de imagens;
- SBOM;
- scan de vulnerabilidades;
- scan de secrets;
- provenance;
- assinatura de imagem;
- publicação em registry;
- promoção por digest;
- approval;
- smoke test;
- estratégia de rollback;
- relatório;
- evidence;
- gate.

O laboratório será:

```text
labs/m20/aula-688-ci-cd-do-projeto-final/orderflow-ci-cd
```

A próxima aula será:

```text
689 - M20.19 - Deploy ou simulacao
```

Na aula 689, os artefatos desta pipeline serão promovidos para um ambiente real ou simulado, com configuração, migrations, rollout, smoke, observação, rollback e evidências finais.

Nesta aula, nenhum deploy definitivo será executado.

Regra central:

```text
a pipeline deve provar
que o mesmo commit
gera artefatos
testados,
rastreaveis,
assinados
e promovidos
sem reconstruir.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
685:
Implementacao mensageria.

686:
Implementacao observabilidade.

687:
Docker do projeto final.

688:
CI CD do projeto final.

689:
Deploy ou simulacao.

690:
Smoke tests finais.
```

O projeto já possui qualidade local.

A aula 688 transforma essa qualidade em automação de repositório.

A pipeline precisa respeitar:

- monorepo Maven;
- boundaries arquiteturais;
- segurança de supply chain;
- imagens não root;
- testes com PostgreSQL e Kafka;
- contracts versionados;
- migrations imutáveis;
- secrets externos;
- observabilidade;
- promoção por artefato;
- rollback previsível.

A pipeline não deve:

- usar credencial em texto;
- publicar imagem não testada;
- reconstruir durante promoção;
- usar tag mutável como identidade;
- ignorar failure;
- executar deploy em pull request;
- assinar artefato diferente do publicado;
- ocultar resultados;
- depender de máquina pessoal;
- permitir branch não protegida publicar release.

---

## Objetivo prático

Será criada a estrutura:

```text
.github
├── workflows
│   ├── pr-validation.yml
│   ├── main-build.yml
│   ├── container-images.yml
│   ├── security-supply-chain.yml
│   ├── release-candidate.yml
│   ├── promote-environment.yml
│   └── rollback.yml
├── actions
│   ├── setup-orderflow
│   │   └── action.yml
│   ├── collect-evidence
│   │   └── action.yml
│   └── verify-image
│       └── action.yml
├── dependabot.yml
└── CODEOWNERS
```

Scripts:

```text
scripts/ci
├── validate-repository.ps1
├── test-unit.ps1
├── test-integration.ps1
├── validate-migrations.ps1
├── validate-contracts.ps1
├── validate-compose.ps1
├── build-images.ps1
├── generate-sbom.ps1
├── scan-images.ps1
├── sign-images.ps1
├── verify-images.ps1
├── create-release-manifest.ps1
├── smoke-candidate.ps1
├── promote-by-digest.ps1
├── rollback-manifest.ps1
└── collect-ci-evidence.ps1
```

Documentação:

```text
docs/ci-cd
├── CI_CD_CHARTER.md
├── PIPELINE_CATALOG.md
├── QUALITY_GATE_POLICY.md
├── BRANCH_PROTECTION_POLICY.md
├── ARTIFACT_IDENTITY_POLICY.md
├── CACHE_POLICY.md
├── SUPPLY_CHAIN_POLICY.md
├── SBOM_POLICY.md
├── VULNERABILITY_POLICY.md
├── IMAGE_SIGNING_POLICY.md
├── REGISTRY_POLICY.md
├── ENVIRONMENT_PROMOTION_POLICY.md
├── APPROVAL_POLICY.md
├── ROLLBACK_POLICY.md
├── CI_CD_TEST_MATRIX.md
├── CI_CD_RISK_REGISTER.md
├── CI_CD_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Artifacts:

```text
release
├── release-manifest.yaml
├── image-digests.yaml
├── sbom
├── vulnerability-reports
├── test-reports
├── provenance
├── signatures
└── evidence
```

---

## Conceito essencial

### Pipeline é código

Workflow precisa de:

- revisão;
- owner;
- testes;
- versionamento;
- segurança;
- observabilidade;
- documentação.

Uma alteração de pipeline pode ser tão crítica quanto uma alteração no código.

### Artefato deve possuir identidade imutável

Tags ajudam humanos.

Digest identifica o conteúdo.

Exemplo:

```text
orderflow/api@sha256:...
```

Promoção deve usar digest.

### Build once, promote many

O fluxo correto é:

```text
build;

test;

scan;

sign;

publish;

promote same digest.
```

O fluxo incorreto é:

```text
build novamente em cada ambiente.
```

### Cache melhora velocidade, não confiança

Cache precisa possuir:

- key precisa;
- escopo;
- fallback controlado;
- invalidação;
- conteúdo não executável sem validação.

### Supply chain inclui todo o caminho

Supply chain envolve:

- source;
- dependencies;
- actions;
- runner;
- build;
- artifact;
- registry;
- signature;
- deployment.

---

## Mão na massa guiada

### 1. Criar CI/CD Charter

Arquivo:

```text
docs/ci-cd/CI_CD_CHARTER.md
```

Princípios:

```text
pull requests never deploy;

main produces immutable candidates;

the same digest is promoted;

secrets use environment protection;

actions are pinned;

artifacts carry provenance;

quality gates fail closed;

rollback uses a known manifest;

deployment belongs to lesson 689.
```

---

### 2. Criar Pipeline Catalog

Arquivo:

```text
docs/ci-cd/PIPELINE_CATALOG.md
```

Pipelines:

```text
PR Validation;

Main Build;

Container Images;

Security Supply Chain;

Release Candidate;

Environment Promotion;

Rollback.
```

Para cada uma, registre:

- trigger;
- inputs;
- outputs;
- permissions;
- secrets;
- owner;
- timeout;
- artifacts;
- gate.

---

### 3. Definir eventos

PR Validation:

```text
pull_request.
```

Main Build:

```text
push na main.
```

Release Candidate:

```text
tag ou workflow manual autorizado.
```

Promotion:

```text
workflow_dispatch
com manifest e environment.
```

Rollback:

```text
workflow_dispatch
com manifest anterior.
```

---

### 4. Criar Branch Protection Policy

Arquivo:

```text
docs/ci-cd/BRANCH_PROTECTION_POLICY.md
```

Exigir na `main`:

- pull request;
- approvals;
- checks obrigatórios;
- branch atualizada;
- conversas resolvidas;
- CODEOWNERS quando aplicável;
- bloqueio de force push;
- bloqueio de exclusão;
- commits assinados quando disponível.

---

### 5. Criar Quality Gate Policy

Arquivo:

```text
docs/ci-cd/QUALITY_GATE_POLICY.md
```

Gates obrigatórios:

```text
repository;

compile;

unit;

architecture;

integration;

migration;

contract;

API;

messaging;

observability;

compose;

security;

image;

evidence.
```

Cada gate possui:

- comando;
- owner;
- timeout;
- artifact;
- código de falha;
- condição de bloqueio.

---

## Workflow de pull request

### 6. Criar `pr-validation.yml`

O workflow deve:

- usar permissões mínimas;
- cancelar execução anterior da mesma branch;
- validar repository;
- compilar;
- executar testes rápidos;
- executar testes de arquitetura;
- validar documentação;
- validar secrets;
- publicar reports.

---

### 7. Configurar concurrency

Exemplo:

```yaml
concurrency:
  group: pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

Isso reduz consumo desnecessário.

---

### 8. Configurar permissões mínimas

Baseline:

```yaml
permissions:
  contents: read
```

Eleve apenas em jobs específicos.

PR de fork não recebe secrets de publicação.

---

### 9. Fixar actions

Não use referência flutuante sem política.

Registre:

```text
action;

versao;

commit pin;

owner;

review date.
```

O exemplo do curso pode mostrar major version, mas a implementação final deve fixar commit revisado.

---

### 10. Criar composite action de setup

Arquivo:

```text
.github/actions/setup-orderflow/action.yml
```

Responsabilidades:

- configurar Java 21;
- habilitar cache Maven;
- validar wrapper;
- mostrar versão;
- preparar diretórios de reports;
- não acessar secrets.

---

### 11. Validar Maven Wrapper

Execute:

```powershell
.\mvnw.cmd `
  --version
```

A pipeline não depende de Maven global.

---

### 12. Criar job repository

Comandos:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1
```

---

### 13. Criar job unit

Execute apenas testes unitários e arquiteturais rápidos.

Separe-os de Testcontainers para feedback inicial.

---

### 14. Criar fail fast controlado

Jobs independentes podem executar em paralelo.

Porém, imagem não deve ser construída quando gates essenciais falham.

---

### 15. Publicar test reports

Artifacts:

- Surefire;
- Failsafe;
- architecture;
- coverage;
- validation summary.

Use retenção limitada.

---

## Workflow de build principal

### 16. Criar `main-build.yml`

Esse workflow executa após push na `main`.

Ele produz:

- JARs;
- test reports;
- coverage;
- release metadata;
- evidence do commit.

---

### 17. Definir identidade do build

Variáveis:

```text
commit SHA;

run ID;

run attempt;

branch;

timestamp;

repository.
```

Não use timestamp como identidade principal.

---

### 18. Gerar versão candidata

Exemplo:

```text
0.1.0-main.<run-number>+<short-sha>.
```

O digest continua sendo a identidade imutável da imagem.

---

### 19. Criar cache Maven

Key:

```text
OS
+ Java
+ hashes dos POMs
+ wrapper config.
```

Cache não inclui secrets.

---

### 20. Criar job integration

Execute:

- PostgreSQL Testcontainers;
- Kafka Testcontainers;
- WireMock;
- API integration;
- persistence;
- messaging;
- observability.

Runner precisa de Docker disponível.

---

### 21. Validar migrations

O job deve:

- subir banco vazio;
- aplicar Flyway;
- validar checksums;
- executar teste de upgrade suportado;
- gerar migration report.

---

### 22. Validar contracts

Inclua:

- provider contracts;
- message compatibility;
- OpenAPI;
- schema evolution;
- contract drift tests.

---

### 23. Validar compose

Execute:

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

Também valide:

- variáveis;
- health checks;
- networks;
- volumes;
- imagens;
- profiles.

---

## Construção de imagens

### 24. Criar `container-images.yml`

Matriz:

```text
API;

Outbox Publisher;

Orchestration Worker;

Integration Gateway;

Projection Worker.
```

Cada item possui:

- module;
- Dockerfile;
- image name;
- health expectation.

---

### 25. Usar BuildKit

Ative:

- cache de layers;
- provenance;
- SBOM quando suportado;
- output por digest;
- labels OCI.

---

### 26. Criar labels OCI

Labels:

```text
org.opencontainers.image.source;

org.opencontainers.image.revision;

org.opencontainers.image.version;

org.opencontainers.image.created;

org.opencontainers.image.title;

org.opencontainers.image.description.
```

---

### 27. Não usar secret como build argument

Build argument pode aparecer em metadata ou cache.

Use secret mount somente quando indispensável.

O OrderFlow não precisa de secret para compilar.

---

### 28. Construir sem publicar em PR

Em pull request:

- build local da imagem;
- teste;
- scan;
- não push.

Na `main`:

- build;
- scan;
- sign;
- push autorizado.

---

### 29. Testar imagem

Para cada imagem:

- usuário não root;
- entrypoint;
- Java version;
- health;
- ausência de Maven;
- ausência de secret;
- labels;
- filesystem policy.

---

### 30. Criar smoke de imagem

Suba dependências mínimas e valide:

- startup;
- readiness;
- shutdown;
- logs;
- OTLP config;
- environment override.

---

## SBOM e vulnerabilidades

### 31. Criar SBOM Policy

Arquivo:

```text
docs/ci-cd/SBOM_POLICY.md
```

SBOM por:

- JAR;
- imagem;
- release candidate.

Formatos aceitos:

```text
CycloneDX;

SPDX.
```

---

### 32. Gerar SBOM Maven

Inclua:

- group;
- artifact;
- version;
- licenses;
- hashes;
- relationships.

---

### 33. Gerar SBOM de imagem

Associe o SBOM ao digest da imagem.

Não associe apenas à tag.

---

### 34. Criar Vulnerability Policy

Arquivo:

```text
docs/ci-cd/VULNERABILITY_POLICY.md
```

Bloqueios:

- critical explorável;
- high sem mitigação;
- secret;
- malware;
- base image não permitida.

Exceção exige:

- owner;
- reason;
- expiration;
- compensating control;
- issue rastreável.

---

### 35. Executar scan de dependências

O scan não substitui atualização.

Resultados precisam ser:

- deduplicados;
- classificados;
- associados ao artifact;
- armazenados;
- revisados.

---

### 36. Executar scan de imagem

Valide:

- OS packages;
- Java dependencies;
- secret;
- configuration;
- non-root;
- exposed ports;
- capabilities.

---

### 37. Evitar bloquear por ruído conhecido

A política deve distinguir:

- vulnerabilidade presente;
- vulnerabilidade alcançável;
- pacote de build ausente no runtime;
- false positive documentado;
- risco aceito temporariamente.

---

## Assinatura e provenance

### 38. Criar Supply Chain Policy

Arquivo:

```text
docs/ci-cd/SUPPLY_CHAIN_POLICY.md
```

Controles:

- actions fixadas;
- runner confiável;
- permissions mínimas;
- OIDC;
- provenance;
- SBOM;
- scan;
- assinatura;
- registry imutável;
- promotion por digest.

---

### 39. Preferir OIDC

A pipeline deve autenticar no registry ou serviço de assinatura usando identidade federada quando disponível.

Evite credencial longa.

---

### 40. Criar Image Signing Policy

Arquivo:

```text
docs/ci-cd/IMAGE_SIGNING_POLICY.md
```

Assinatura liga:

```text
identity do workflow;

repository;

commit;

image digest;

timestamp;

provenance.
```

---

### 41. Assinar por digest

Fluxo:

```text
push;

obter digest;

assinar digest;

verificar assinatura;

registrar evidence.
```

---

### 42. Gerar provenance

Provenance registra:

- source;
- commit;
- builder;
- workflow;
- materials;
- artifact digest;
- parameters permitidos.

---

### 43. Verificar antes da promoção

Promotion gate valida:

- digest existe;
- signature válida;
- provenance válida;
- SBOM disponível;
- scan aprovado;
- manifest compatível.

---

## Registry e release manifest

### 44. Criar Registry Policy

Arquivo:

```text
docs/ci-cd/REGISTRY_POLICY.md
```

Regras:

- namespaces por projeto;
- tags imutáveis quando possível;
- retention;
- garbage collection;
- acesso por OIDC;
- push apenas da `main` ou release;
- pull por environment identity.

---

### 45. Criar Artifact Identity Policy

Arquivo:

```text
docs/ci-cd/ARTIFACT_IDENTITY_POLICY.md
```

Identidades:

```text
source commit;

artifact digest;

release manifest ID;

environment revision.
```

---

### 46. Criar release manifest

Arquivo gerado:

```yaml
release:
  id: orderflow-0.1.0-rc.15
  sourceCommit: abcdef123456
  createdAt: 2026-07-15T22:00:00Z

images:
  API:
    repository: registry.example/orderflow/API
    digest: sha256:example-api-digest
  OutboxPublisher:
    repository: registry.example/orderflow/outbox-publisher
    digest: sha256:example-outbox-digest
  OrchestrationWorker:
    repository: registry.example/orderflow/orchestration-worker
    digest: sha256:example-orchestration-digest
  IntegrationGateway:
    repository: registry.example/orderflow/integration-gateway
    digest: sha256:example-gateway-digest
  ProjectionWorker:
    repository: registry.example/orderflow/projection-worker
    digest: sha256:example-projection-digest

quality:
  gate: PASS
  SBOM: PRESENT
  vulnerabilities: ACCEPTED
  signatures: VERIFIED
```

Os digests de exemplo devem ser substituídos pelo workflow gerador, sem serem tratados como artefatos reais.

---

### 47. Publicar manifest como artifact

O manifest não deve ser editado manualmente depois da aprovação.

Uma correção produz novo manifest.

---

## Release candidate

### 48. Criar `release-candidate.yml`

Inputs:

- version;
- source commit;
- release notes;
- environment target opcional.

O workflow:

- valida commit;
- baixa artifacts;
- verifica digests;
- verifica signatures;
- gera manifest;
- executa smoke candidato;
- publica evidence.

---

### 49. Não reconstruir no release

Se o artifact da `main` já foi aprovado, o release candidate apenas referencia e promove os mesmos digests.

---

### 50. Criar release notes técnicas

Inclua:

- source commit;
- changes;
- migrations;
- contracts;
- risks;
- rollback;
- known limitations;
- evidence links.

---

## Promoção entre ambientes

### 51. Criar Environment Promotion Policy

Arquivo:

```text
docs/ci-cd/ENVIRONMENT_PROMOTION_POLICY.md
```

Fluxo:

```text
candidate;

development;

homologation;

production.
```

Cada etapa usa o mesmo manifest ou um manifest derivado sem reconstrução.

---

### 52. Criar ambientes protegidos

Ambientes podem exigir:

- reviewers;
- wait time;
- branch restriction;
- secrets próprios;
- deployment history.

---

### 53. Criar Approval Policy

Arquivo:

```text
docs/ci-cd/APPROVAL_POLICY.md
```

Defina:

- quem aprova;
- quais evidências revisar;
- quando bloquear;
- como registrar exception;
- segregação possível;
- prazo de validade da aprovação.

---

### 54. Criar `promote-environment.yml`

Inputs:

- release manifest;
- target environment;
- change reference;
- approval evidence.

O workflow desta aula valida e prepara a promoção.

A execução de deploy será completada na aula 689.

---

### 55. Validar configuração de ambiente

Antes da promoção:

- secrets existem;
- URLs existem;
- migrations são compatíveis;
- capacity está disponível;
- observability está preparada;
- rollback manifest existe.

---

### 56. Criar smoke candidate

O smoke executa em ambiente efêmero ou compose:

- health;
- registro;
- replay idempotente;
- Outbox;
- Kafka;
- provider simulado;
- projection;
- logs;
- métricas.

---

## Rollback

### 57. Criar Rollback Policy

Arquivo:

```text
docs/ci-cd/ROLLBACK_POLICY.md
```

Rollback pode envolver:

- imagens;
- configuração;
- migrations;
- contracts;
- feature flags;
- consumer compatibility.

---

### 58. Distinguir rollback de roll-forward

Use rollback quando:

- artifact anterior é compatível;
- migration permite;
- contrato permanece legível;
- risco de permanência é maior.

Use roll-forward quando rollback de banco ou contrato é inseguro.

---

### 59. Criar rollback manifest

O rollback referencia um manifest anteriormente aprovado.

Não use:

```text
tag latest anterior.
```

---

### 60. Criar `rollback.yml`

Inputs:

- target environment;
- current manifest;
- rollback manifest;
- incident reference;
- reason;
- approval.

Na aula 688, o workflow valida a operação e gera evidence.

A execução final acontece na aula 689.

---

## Dependências e automação

### 61. Criar Dependabot configuration

Atualize:

- Maven;
- GitHub Actions;
- Docker base images quando suportado.

Agrupe updates compatíveis.

---

### 62. Não aplicar atualização automática sem gate

Dependabot abre pull request.

A pipeline executa todos os gates.

Merge continua exigindo revisão.

---

### 63. Criar Cache Policy

Arquivo:

```text
docs/ci-cd/CACHE_POLICY.md
```

Caches:

- Maven repository;
- Docker layers;
- scanner database.

Nunca cache:

- secret;
- token;
- assinatura privada;
- environment file real.

---

### 64. Criar timeouts

Todo job precisa de `timeout-minutes`.

Isso evita runner preso.

---

### 65. Criar retry de infraestrutura limitado

Retry de download ou registry pode existir.

Não aplique retry cego a teste funcional falhando.

---

## Evidências e governança

### 66. Criar composite action de evidence

A action coleta:

- commit;
- workflow;
- job results;
- test totals;
- reports;
- image digests;
- SBOM hashes;
- scan status;
- signatures;
- manifest;
- timestamps.

---

### 67. Criar naming de artifacts

Exemplo:

```text
orderflow-test-reports-<sha>;

orderflow-SBOM-<sha>;

orderflow-image-digests-<sha>;

orderflow-release-manifest-<id>;

orderflow-CI-evidence-<run-id>.
```

---

### 68. Definir retenção

Reports comuns possuem retenção curta.

Release manifests, signatures e provenance precisam de retenção compatível com auditoria.

---

### 69. Criar audit de pipeline

Registre:

- trigger;
- actor;
- source;
- approvals;
- environment;
- artifact;
- result;
- rollback relationship.

---

## Testes da pipeline

### 70. Validar YAML

Use parser e linter.

Falhe por:

- syntax;
- permission excessiva;
- secret em texto;
- action não permitida;
- timeout ausente;
- environment não protegido.

---

### 71. Testar scripts localmente

Scripts em `scripts/ci` devem executar fora da pipeline.

Isso reduz debug exclusivo do runner.

---

### 72. Testar PR sem secret

Simule contribuição externa.

Valide:

- build;
- tests;
- reports;
- nenhum push;
- nenhum secret;
- nenhuma promoção.

---

### 73. Testar falha de teste

Introduza falha controlada.

Valide:

- imagem não publicada;
- release candidate não criado;
- gate final `FAIL_TEST`.

---

### 74. Testar vulnerabilidade bloqueadora

Use fixture de relatório.

Valide:

- gate bloqueado;
- image não promovida;
- finding publicado;
- exception não aplicada automaticamente.

---

### 75. Testar assinatura inválida

Valide:

- promotion bloqueada;
- evidence registra falha;
- artifact não é implantado.

---

### 76. Testar digest divergente

Manifest referencia digest diferente do artifact.

Resultado:

```text
FAIL_ARTIFACT_IDENTITY.
```

---

### 77. Testar cache miss

Pipeline precisa continuar funcionando sem cache.

Cache é otimização.

---

### 78. Testar cancelamento concorrente

Novo commit na mesma PR cancela execução anterior.

Execução da `main` não deve ser cancelada de forma que deixe release inconsistente.

---

### 79. Testar rollback validation

Use manifest anterior compatível.

Valide:

- signature;
- schema compatibility;
- environment;
- evidence;
- approval.

---

## Arquitetura e qualidade

### 80. Criar CI/CD Test Matrix

Arquivo:

```text
docs/ci-cd/CI_CD_TEST_MATRIX.md
```

Categorias:

- workflow syntax;
- permissions;
- PR;
- unit;
- integration;
- migration;
- contracts;
- compose;
- images;
- SBOM;
- vulnerabilities;
- signing;
- provenance;
- registry;
- promotion;
- rollback;
- evidence.

---

### 81. Criar CI/CD Risk Register

Arquivo:

```text
docs/ci-cd/CI_CD_RISK_REGISTER.md
```

Riscos:

```text
secret em log;

action comprometida;

permission excessiva;

artifact reconstruido;

tag mutavel;

scan ignorado;

signature ausente;

manifest editado;

cache contaminado;

PR de fork publicando;

migration incompatível;

rollback inseguro;

environment sem approval;

report perdido.
```

---

### 82. Criar CI/CD Traceability

Arquivo:

```text
docs/ci-cd/CI_CD_TRACEABILITY.md
```

Exemplo:

```text
Repository Gate
-> pr-validation
-> validate-repository
-> required check.

Docker non-root
-> container-images
-> verify-image
-> image evidence.

Supply chain
-> SBOM
-> scan
-> signature
-> provenance
-> promotion gate.

Build once
-> digest manifest
-> environment promotion
-> rollback manifest.
```

---

### 83. Criar boundary da próxima aula

Arquivo:

```text
docs/ci-cd/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 688 define:

- CI workflows;
- quality gates;
- test automation;
- image builds;
- SBOM;
- scans;
- signatures;
- provenance;
- registry policy;
- release manifests;
- promotion gates;
- rollback validation;
- CI evidence.

A aula 689 define:

- target environment;
- deployment execution;
- configuration binding;
- migration execution;
- rollout;
- smoke;
- observation;
- rollback execution;
- deployment evidence.

Nenhum deploy definitivo
e executado nesta aula.
```

---

### 84. Executar validação local

Execute:

```powershell
.\scripts\validate-repository.ps1

.\scripts\validate-architecture.ps1

.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify

docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

---

### 85. Criar report

Arquivo:

```text
reports/CI-CD-final-report.yaml
```

Exemplo:

```yaml
CICDFinal:
  workflows:
    total:
      7

  qualityGates:
    total:
      13
    passed:
      13

  tests:
    unit:
      PASS
    integration:
      PASS
    migration:
      PASS
    contract:
      PASS
    messaging:
      PASS

  images:
    total:
      5
    SBOM:
      5
    scanned:
      5
    signed:
      5

  supplyChain:
    provenance:
      PASS
    digestPromotion:
      PASS

  deployment:
    executed:
      false

  gate:
    PASS
```

---

### 86. Criar evidence

Arquivo:

```text
contracts/CI-CD-final-evidence.yaml
```

Campos:

- lesson;
- project;
- workflow count;
- required check count;
- unit gate status;
- integration gate status;
- migration gate status;
- contract gate status;
- compose gate status;
- image count;
- SBOM count;
- scanned image count;
- signed image count;
- provenance status;
- digest manifest status;
- pull request secret exposure count;
- excessive permission count;
- promotion gate status;
- rollback validation status;
- pipeline test count;
- pipeline test failure count;
- deployment executed;
- documentation status;
- gate status;
- timestamp.

---

### 87. Criar gate de CI/CD

Status:

```text
PASS;

FAIL_CI_CD_STRUCTURE;

FAIL_WORKFLOW_SYNTAX;

FAIL_WORKFLOW_PERMISSION;

FAIL_ACTION_PINNING;

FAIL_BRANCH_PROTECTION;

FAIL_REPOSITORY_GATE;

FAIL_UNIT_GATE;

FAIL_INTEGRATION_GATE;

FAIL_MIGRATION_GATE;

FAIL_CONTRACT_GATE;

FAIL_COMPOSE_GATE;

FAIL_IMAGE_BUILD;

FAIL_IMAGE_TEST;

FAIL_SBOM;

FAIL_VULNERABILITY_SCAN;

FAIL_IMAGE_SIGNATURE;

FAIL_PROVENANCE;

FAIL_REGISTRY_POLICY;

FAIL_ARTIFACT_IDENTITY;

FAIL_RELEASE_MANIFEST;

FAIL_PROMOTION_POLICY;

FAIL_APPROVAL_POLICY;

FAIL_ROLLBACK_POLICY;

FAIL_SECRET_EXPOSURE;

FAIL_PIPELINE_TEST;

FAIL_DEPLOY_ANTICIPATION;

INCONCLUSIVE.
```

---

### 88. Executar validação final

Execute:

```powershell
.\scripts\ci\validate-repository.ps1

.\scripts\ci\test-unit.ps1

.\scripts\ci\test-integration.ps1

.\scripts\ci\validate-migrations.ps1

.\scripts\ci\validate-contracts.ps1

.\scripts\ci\validate-compose.ps1

.\scripts\ci\build-images.ps1

.\scripts\ci\generate-SBOM.ps1

.\scripts\ci\scan-images.ps1

.\scripts\ci\collect-ci-evidence.ps1
```

Confirme:

- PR não publica;
- main produz candidates;
- imagens possuem digest;
- SBOM existe;
- scan passou;
- assinatura é verificável;
- manifest referencia digests;
- promotion exige approval;
- rollback usa manifest conhecido;
- deploy ainda não foi executado.

---

### 89. Encerrar o laboratório

Confirme:

- Charter;
- Pipeline Catalog;
- branch protection;
- quality gates;
- PR workflow;
- main workflow;
- image workflow;
- security workflow;
- release candidate;
- promotion workflow;
- rollback workflow;
- composite actions;
- cache;
- tests;
- migrations;
- contracts;
- Docker;
- SBOM;
- scans;
- signatures;
- provenance;
- registry;
- manifest;
- approvals;
- rollback;
- evidence;
- report;
- gate aprovado;
- deploy não executado.

---

## Entendendo o que foi feito

### A qualidade local virou qualidade automatizada

Os mesmos comandos usados pelo desenvolvedor agora executam no runner.

### Pull requests ficaram seguras

PRs validam código sem receber credenciais de publicação.

### Imagens ganharam identidade

Digest, commit, SBOM, signature e provenance conectam source ao artifact.

### Promoção deixou de reconstruir

O mesmo digest atravessa os ambientes.

### Supply chain ganhou controles

Actions, permissions, OIDC, scans e signatures reduzem risco.

### Rollback ganhou referência concreta

O processo utiliza um manifest anterior aprovado.

### Evidências ficaram reproduzíveis

Cada pipeline produz artifacts e resultados auditáveis.

### O projeto ficou pronto para implantação

A aula 689 executará o deploy ou sua simulação completa.

---

## Erros comuns importantes

### Publicar imagem em pull request

Código não aprovado ganha artifact confiável.

### Usar secrets em fork

Credenciais podem ser exfiltradas.

### Usar tag como identidade

A tag pode apontar para outro conteúdo.

### Reconstruir em homologação

O artifact testado deixa de ser o implantado.

### Ignorar SBOM

Dependências do release ficam desconhecidas.

### Assinar antes de obter digest final

A assinatura pode não corresponder ao artifact publicado.

### Cache como requisito

Pipeline falha quando cache some.

### Retry de teste funcional

Uma falha real pode ser mascarada.

### Rollback sem validar migration

O banco pode ser incompatível.

### Executar deploy agora

A implantação pertence à aula 689.

---

## Comandos úteis

### Validar tudo

```powershell
.\mvnw.cmd `
  clean `
  verify
```

### Validar compose

```powershell
docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

### Construir imagens

```powershell
.\scripts\ci\build-images.ps1
```

### Gerar SBOM

```powershell
.\scripts\ci\generate-SBOM.ps1
```

### Validar artifacts

```powershell
.\scripts\ci\verify-images.ps1
```

---

## Exercício guiado

Implemente a pipeline para:

```text
um pull request
que altera o fluxo
de pagamento recusado.
```

Inclua:

1. trigger de PR;
2. permissions mínimas;
3. setup Java;
4. cache Maven;
5. repository gate;
6. unit tests;
7. integration tests;
8. contract tests;
9. messaging tests;
10. migration tests;
11. compose validation;
12. image build sem push;
13. SBOM;
14. vulnerability scan;
15. secret scan;
16. reports;
17. evidence;
18. branch protection;
19. merge na main;
20. image build;
21. push;
22. digest;
23. signature;
24. provenance;
25. release manifest;
26. promotion gate;
27. rollback manifest;
28. pipeline tests.

Não execute deploy.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 687 e ponte para a aula 689 foram preservadas;
- CI/CD Charter foi criado;
- Pipeline Catalog foi criado;
- eventos foram definidos;
- Branch Protection Policy foi criada;
- Quality Gate Policy foi criada;
- PR workflow foi criado;
- concurrency foi configurada;
- permissions mínimas foram aplicadas;
- actions foram fixadas;
- composite setup action foi criada;
- Maven Wrapper foi validado;
- repository job foi criado;
- unit job foi criado;
- fail fast foi controlado;
- test reports foram publicados;
- main build foi criado;
- identidade de build foi definida;
- versão candidata foi definida;
- cache Maven foi criado;
- integration job foi criado;
- migrations foram validadas;
- contracts foram validados;
- compose foi validado;
- container workflow foi criado;
- matriz de imagens foi criada;
- BuildKit foi usado;
- labels OCI foram criadas;
- secrets não foram usados como build args;
- PR não publica imagem;
- imagens foram testadas;
- smoke de imagem foi criado;
- SBOM Policy foi criada;
- SBOM Maven foi gerada;
- SBOM de imagem foi gerada;
- Vulnerability Policy foi criada;
- dependências foram escaneadas;
- imagens foram escaneadas;
- ruído conhecido foi tratado por política;
- Supply Chain Policy foi criada;
- OIDC foi priorizado;
- Image Signing Policy foi criada;
- assinatura por digest foi definida;
- provenance foi gerada;
- promoção verifica assinatura;
- Registry Policy foi criada;
- Artifact Identity Policy foi criada;
- release manifest foi criado;
- manifest foi publicado como artifact;
- release candidate workflow foi criado;
- release não reconstrói artifact;
- release notes técnicas foram definidas;
- Environment Promotion Policy foi criada;
- environments protegidos foram definidos;
- Approval Policy foi criada;
- promotion workflow foi criado;
- configuração de ambiente foi validada;
- smoke candidate foi criado;
- Rollback Policy foi criada;
- rollback e roll-forward foram diferenciados;
- rollback manifest foi criado;
- rollback workflow foi criado;
- Dependabot foi configurado;
- updates automáticos continuam com gate;
- Cache Policy foi criada;
- timeouts foram definidos;
- retry de infraestrutura foi limitado;
- evidence action foi criada;
- naming de artifacts foi definido;
- retenção foi definida;
- audit de pipeline foi criado;
- YAML foi validado;
- scripts foram testados localmente;
- PR sem secret foi testada;
- falha de teste foi testada;
- vulnerabilidade bloqueadora foi testada;
- assinatura inválida foi testada;
- digest divergente foi testado;
- cache miss foi testado;
- cancelamento concorrente foi testado;
- rollback validation foi testado;
- Test Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 689 foi criado;
- validação local passou;
- report, evidence e gate foram criados;
- commit recomendado e diário de bordo estão presentes;
- deploy não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\mvnw.cmd `
  --batch-mode `
  clean `
  verify

docker compose `
  -f infrastructure/docker/compose.yaml `
  config
```

Adicione:

```powershell
git add `
  .github `
  scripts/ci `
  docs/ci-cd `
  reports/CI-CD-final-report.yaml `
  contracts/CI-CD-final-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "client_secret|private_key|access_token|refresh_token|Bearer ey|registryPassword|cloudKey|kubectl apply|helm upgrade"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "ci(m20): implement OrderFlow delivery pipelines"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- credencial real;
- deploy real;
- manifest de ambiente real;
- execução de migration em ambiente real;
- conteúdo detalhado da aula 689.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você implementou o CI/CD do projeto final OrderFlow.

Você criou:

```text
PR validation;

main build;

test automation;

migration validation;

contract validation;

compose validation;

container builds;

SBOM;

vulnerability scans;

image signing;

provenance;

registry policy;

release manifests;

environment promotion gates;

approval policy;

rollback validation;

pipeline tests;

reports, evidence e gate.
```

A pipeline agora prova que um commit gera artifacts testados, rastreáveis e assinados.

A próxima aula será:

```text
689 - M20.19 - Deploy ou simulacao
```

Nela, você executará a implantação real ou simulada do release manifest, aplicará configuração, migrations, rollout, smoke, observação e rollback, produzindo evidências de entrega.

Nenhum deploy definitivo foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei workflows.
- [ ] Protegi pull requests.
- [ ] Automatizei testes.
- [ ] Validei migrations.
- [ ] Validei contracts.
- [ ] Construí imagens.
- [ ] Gerei SBOM.
- [ ] Escaneei vulnerabilidades.
- [ ] Assinei digests.
- [ ] Gerei provenance.
- [ ] Criei release manifest.
- [ ] Criei promotion gates.
- [ ] Criei rollback validation.
- [ ] Preservei deploy para a aula 689.

---

## Troubleshooting adicional

### PR tenta acessar secret

Remova job de publicação do evento de PR.

### Cache Maven não é restaurado

Revise key e paths.

### Testcontainers falha no runner

Valide Docker disponível e permissões.

### Imagem publicada diverge do scan

Faça scan sobre o digest publicado.

### Assinatura não verifica

Revise identity, digest e issuer.

### Promotion reconstrói imagem

Use o release manifest existente.

### Vulnerabilidade aceita nunca expira

Adicione expiration e issue.

### Rollback falha após migration

Revise expand-contract e use roll-forward.

### Workflow fica preso

Defina timeout e concurrency.

### Quero executar deploy

Essa etapa pertence à aula 689.

---

## Perguntas de revisão

1. O que é CI?
2. O que é Continuous Delivery?
3. PR deve publicar imagem?
4. O que é build once?
5. Qual identidade é imutável?
6. Tag é suficiente?
7. Para que serve SBOM?
8. O que vulnerability scan faz?
9. O que é provenance?
10. Por que assinar imagem?
11. O que OIDC reduz?
12. Cache é requisito?
13. O que branch protection exige?
14. Por que fixar actions?
15. O que release manifest contém?
16. Promoção pode reconstruir?
17. O que environment protection faz?
18. O que approval revisa?
19. Rollback usa qual referência?
20. Quando usar roll-forward?
21. PR de fork recebe secret?
22. O que a aula 689 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Integração contínua.
2. Artifact pronto com promoção controlada.
3. Não.
4. Construir uma vez e promover.
5. Digest.
6. Não.
7. Inventariar componentes.
8. Identificar riscos conhecidos.
9. Evidência da origem do build.
10. Provar identidade e integridade.
11. Credenciais longas.
12. Não.
13. Reviews e checks.
14. Reduzir supply chain risk.
15. Commit, digests e quality.
16. Não.
17. Approval, secrets e histórico.
18. Evidências e risco.
19. Manifest anterior.
20. Quando rollback é incompatível.
21. Não.
22. Executar deploy ou simulação.
23. Deploy definitivo.
24. Deploy ou simulação.
25. Mesmo commit, mesmo digest.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 688 - M20.18 - CI CD do projeto final

- Continuei após Docker do projeto final.
- Criei CI/CD Charter.
- Criei Pipeline Catalog.
- Defini triggers.
- Criei Branch Protection Policy.
- Criei Quality Gate Policy.
- Criei PR Validation.
- Configurei concurrency.
- Apliquei permissions mínimas.
- Defini pinning de actions.
- Criei composite action de setup.
- Validei Maven Wrapper.
- Criei repository job.
- Criei unit job.
- Controlei fail fast.
- Publiquei test reports.
- Criei Main Build.
- Defini build identity.
- Defini versão candidata.
- Configurei cache Maven.
- Criei integration job.
- Validei migrations.
- Validei contracts.
- Validei compose.
- Criei container workflow.
- Criei matriz de imagens.
- Usei BuildKit.
- Criei labels OCI.
- Evitei secret em build argument.
- Impedi publicação em PR.
- Testei imagens.
- Criei smoke de imagem.
- Criei SBOM Policy.
- Gerei SBOM Maven.
- Gerei SBOM de imagens.
- Criei Vulnerability Policy.
- Escaneei dependências.
- Escaneei imagens.
- Defini tratamento de findings.
- Criei Supply Chain Policy.
- Priorizei OIDC.
- Criei Image Signing Policy.
- Assinei por digest.
- Gerei provenance.
- Verifiquei antes da promoção.
- Criei Registry Policy.
- Criei Artifact Identity Policy.
- Criei release manifest.
- Publiquei manifest como artifact.
- Criei Release Candidate workflow.
- Preservei build once.
- Criei release notes técnicas.
- Criei Environment Promotion Policy.
- Criei environments protegidos.
- Criei Approval Policy.
- Criei Promotion workflow.
- Validei configuração de ambiente.
- Criei smoke candidate.
- Criei Rollback Policy.
- Diferenciei rollback e roll-forward.
- Criei rollback manifest.
- Criei Rollback workflow.
- Configurei Dependabot.
- Mantive updates sob gate.
- Criei Cache Policy.
- Defini timeouts.
- Limitei retries de infraestrutura.
- Criei action de evidence.
- Defini naming de artifacts.
- Defini retenção.
- Criei audit de pipeline.
- Validei YAML.
- Testei scripts localmente.
- Testei PR sem secret.
- Testei falha de teste.
- Testei vulnerabilidade bloqueadora.
- Testei assinatura inválida.
- Testei digest divergente.
- Testei cache miss.
- Testei cancelamento concorrente.
- Testei rollback validation.
- Criei CI/CD Test Matrix.
- Criei CI/CD Risk Register.
- Criei CI/CD Traceability.
- Criei boundary para a aula 689.
- Executei validação local.
- Criei report, evidence e gate.
- Não antecipei deploy.
- Próxima aula: Deploy ou simulacao.
```

---

## Referência técnica curta

- Continuous Integration.
- Continuous Delivery.
- GitHub Actions.
- Branch Protection.
- Required Check.
- BuildKit.
- SBOM.
- CycloneDX.
- SPDX.
- Vulnerability Scan.
- OIDC.
- Image Signature.
- Provenance.
- OCI Digest.
- Registry.
- Release Manifest.
- Environment Protection.
- Promotion.
- Rollback.
- Supply Chain Security.

Regra final:

```text
O CI/CD final do OrderFlow deve transformar cada commit aprovado em artifacts testados, rastreáveis e promovíveis sem reconstrução: pull requests usam permissions mínimas, concurrency, Maven Wrapper, repository gate, unit, architecture, integration, migration, contract, API, messaging, observability e compose checks e nunca recebem secrets ou publicam imagens, a main produz JARs e cinco imagens multi-stage com labels OCI, BuildKit e cache seguro, imagens são testadas como non-root e por health, SBOMs Maven e de imagem são ligados aos digests, scans de dependências, sistema operacional, secrets e configuração aplicam uma Vulnerability Policy com exceções temporárias auditáveis, OIDC evita credenciais longas, provenance conecta source, builder e artifact, signatures são geradas e verificadas sobre digests finais, registry aceita push apenas de workflows autorizados, release manifest registra source commit, image repositories, digests, quality, SBOM, scans e signatures, release candidate não recompila, promotion usa environment protection, approvals e o mesmo manifest, rollback referencia manifest anterior conhecido e valida compatibilidade de migrations e contracts, caches continuam opcionais, jobs possuem timeout, artifacts e evidence possuem naming e retenção, e testes comprovam PR sem secret, falha de gate, vulnerability block, invalid signature, digest mismatch, cache miss, concurrency e rollback validation; o gate termina com workflows, tests, images, SBOM, scans, signatures, provenance, manifests, policies, reports e evidence aprovados, enquanto configuração final do ambiente, execução de migrations, rollout, smoke, observação e rollback real ou simulado permanecem reservados para a aula 689.
```
