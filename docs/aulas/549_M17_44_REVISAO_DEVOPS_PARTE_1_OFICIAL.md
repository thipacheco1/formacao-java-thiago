# 549 - M17.44 - Revisao DevOps parte 1

## Apresentação da aula

Você concluiu um ciclo extenso do Módulo 17.

Ao longo das aulas anteriores, a aplicação deixou de ser apenas código executado pela IDE e passou a possuir:

```text
build reproduzível;

testes automatizados;

pipeline;

container;

configuração externa;

health checks;

estratégias de release;

rollback;

Kubernetes;

cloud;

segurança;

custos;

release candidate;

deploy controlado;

evidence.
```

Nas aulas 546, 547 e 548, esses conhecimentos foram reunidos no projeto de API pronta para deploy.

O projeto comprovou três etapas:

```text
parte 1:
deployability interna da aplicação.

parte 2:
release candidate verificável.

parte 3:
promoção, deploy e rollback.
```

Agora começa uma revisão técnica em duas partes.

A revisão não irá repetir todas as aulas palavra por palavra.

Ela irá reorganizar o conhecimento em decisões que um profissional backend precisa tomar no trabalho.

A pergunta central desta primeira parte será:

```text
como explicar,
diagnosticar
e aplicar

os fundamentos de DevOps
que transformam código
em release confiável?
```

A revisão parte 1 concentrará:

- cultura DevOps;
- fluxo de entrega;
- integração contínua;
- entrega e implantação contínuas;
- pipelines;
- GitHub Actions;
- Maven;
- testes e coverage gates;
- configuração;
- ambientes;
- Secrets;
- containers;
- Dockerfile;
- Docker Compose;
- imagens non-root;
- health checks;
- estratégias de release;
- feature flags;
- rollback;
- migrations compatíveis;
- deploy sem indisponibilidade;
- rastreabilidade de artifacts;
- troubleshooting de entrega.

A parte 2 ficará responsável pela revisão de:

- Kubernetes;
- Namespace;
- RBAC;
- ConfigMap;
- Secret;
- probes;
- requests e limits;
- HPA;
- volumes;
- Ingress;
- Helm;
- cloud;
- AWS;
- RDS;
- SQS;
- SNS;
- Redis;
- S3;
- custos;
- segurança cloud;
- projeto final.

A regra desta aula será:

```text
não decorar comandos;

entender
qual problema
cada prática resolve.
```

Você irá construir uma matriz de revisão e executar um laboratório de diagnóstico.

Nenhum recurso externo será criado.

Não haverá:

- deploy cloud;
- publicação em registry;
- alteração de produção;
- credencial real;
- pipeline remoto executado;
- cobrança;
- domínio;
- certificado;
- recurso AWS;
- mudança destrutiva.

A próxima aula oficial será:

```text
550 - M17.45 - Revisao DevOps parte 2
```

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
Checkpoint DevOps e Cloud.
```

A aula 548 concluiu:

```text
build once;

promote many;

deploy por digest;

smoke test;

rollback comprovado.
```

A aula 549 responderá:

```text
quais fundamentos
permitiram chegar
a esse resultado?
```

Nesta aula:

```text
DevOps:
sim.

CI:
sim.

CD:
sim.

GitHub Actions:
sim.

Maven:
sim.

coverage gates:
sim.

containers:
sim.

Docker:
sim.

Docker Compose:
sim.

configuração:
sim.

Secrets:
sim.

health:
sim.

release strategies:
sim.

rollback:
sim.

zero downtime:
sim.

Kubernetes aprofundado:
não.

cloud aprofundada:
não.

projeto novo:
não.
```

A revisão seguirá cinco blocos:

```text
1.
cultura e fluxo.

2.
pipeline e qualidade.

3.
container e configuração.

4.
release e rollback.

5.
diagnóstico integrado.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
review/devops-part-1
├── devops-concept-map.yaml
├── ci-cd-decision-matrix.yaml
├── pipeline-gate-matrix.yaml
├── container-readiness-matrix.yaml
├── release-strategy-matrix.yaml
├── rollback-decision-tree.yaml
├── migration-release-contract.yaml
├── troubleshooting-scenarios.yaml
├── self-assessment.yaml
└── review-part-1-evidence.yaml

scripts/review/devops-part-1
├── validate-concept-map.ps1
├── validate-pipeline-gates.ps1
├── inspect-build-artifact.ps1
├── inspect-container-image.ps1
├── validate-runtime-configuration.ps1
├── simulate-pipeline-failure.ps1
├── simulate-container-failure.ps1
├── simulate-release-decision.ps1
├── validate-rollback-decision.ps1
├── collect-review-part-1-evidence.ps1
└── verify-review-part-1-baseline.ps1

docs/review/devops-part-1
├── DEVOPS_FOUNDATIONS_REVIEW.md
├── CI_CD_REVIEW.md
├── PIPELINE_AND_GATES_REVIEW.md
├── CONTAINERS_REVIEW.md
├── CONFIGURATION_AND_SECRETS_REVIEW.md
├── RELEASE_STRATEGIES_REVIEW.md
├── ROLLBACK_AND_MIGRATIONS_REVIEW.md
├── REVIEW_PART_1_TEST_MATRIX.md
└── REVIEW_PART_1_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
conceitos reorganizados;

diferenças entre CI e CD claras;

gates classificados;

artifact rastreável;

container revisado;

configuração validada;

estratégias comparadas;

rollback decidido;

migrations relacionadas ao deploy;

cenários diagnosticados;

autoavaliação registrada.
```

Você irá:

1. revisar cultura DevOps;
2. revisar value stream;
3. diferenciar CI, continuous delivery e continuous deployment;
4. revisar pipeline;
5. revisar build Maven;
6. revisar testes;
7. revisar coverage;
8. revisar artifact;
9. revisar cache de dependências;
10. revisar GitHub Actions;
11. revisar permissões;
12. revisar Secrets;
13. revisar ambientes;
14. revisar configuração externa;
15. revisar Docker;
16. revisar multi-stage build;
17. revisar non-root;
18. revisar Docker Compose;
19. revisar health checks;
20. revisar release strategies;
21. revisar feature flags;
22. revisar rollback;
23. revisar migrations;
24. revisar zero downtime;
25. resolver cenários;
26. criar evidence;
27. executar gate;
28. commitar;
29. preparar a parte 2.

---

## Conceito essencial

### DevOps

Forma de trabalho que aproxima desenvolvimento, operação, segurança e negócio para entregar valor com frequência e confiabilidade.

---

### Value stream

Fluxo completo desde uma necessidade até valor em produção.

---

### Lead time

Tempo entre a mudança e sua disponibilização.

---

### Deployment frequency

Frequência de implantações.

---

### Change failure rate

Proporção de mudanças que causam falha ou exigem correção.

---

### Mean time to restore

Tempo médio para restaurar o serviço após falha.

---

### Continuous Integration

Integração frequente com build e testes automatizados.

---

### Continuous Delivery

Software permanece pronto para ser implantado, mas a promoção pode exigir decisão humana.

---

### Continuous Deployment

Mudanças aprovadas pelos gates são implantadas automaticamente.

---

### Pipeline

Sequência automatizada de validações e ações.

---

### Gate

Condição que precisa ser aprovada para o fluxo continuar.

---

### Artifact

Resultado imutável de um build.

---

### Environment

Contexto de execução com configuração e dependências próprias.

---

### Release strategy

Forma de disponibilizar uma nova versão e controlar risco.

---

### Rollback

Retorno a uma versão anterior compatível.

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
```

Confirme:

- projeto compila;
- testes passam;
- nenhum Secret real;
- nenhuma alteração inesperada;
- artifacts temporários estão ignorados;
- ambiente final do projeto anterior está conhecido.

---

### 2. Revisar a cultura DevOps

DevOps não é uma ferramenta.

Também não é somente:

- Docker;
- Kubernetes;
- pipeline;
- cloud;
- automação.

A cultura busca reduzir handoffs, feedback lento e responsabilidade fragmentada.

Um fluxo ruim pode ser:

```text
desenvolvedor entrega código;

outra equipe tenta compilar;

outra equipe cria configuração;

operação descobre dependência;

produção falha;

ninguém conhece o owner.
```

Um fluxo melhor possui:

- responsabilidade compartilhada;
- automação;
- feedback rápido;
- observabilidade;
- pequenos lotes;
- rollback conhecido;
- aprendizado após incidentes.

---

### 3. Criar mapa conceitual

Arquivo:

```text
devops-concept-map.yaml
```

Conteúdo:

```yaml
devops:
  goals:
    - fast-feedback
    - reliable-delivery
    - shared-ownership
    - measurable-value

  practices:
    - version-control
    - continuous-integration
    - automated-testing
    - immutable-artifacts
    - externalized-configuration
    - observability
    - controlled-release
    - rollback

  outcomes:
    - lower-lead-time
    - higher-deployment-frequency
    - lower-change-failure-rate
    - lower-restore-time
```

O mapa precisa relacionar prática e resultado.

---

### 4. Revisar as métricas de entrega

As quatro métricas clássicas ajudam a avaliar capacidade de entrega.

#### Lead time

Quanto tempo uma mudança demora para chegar ao ambiente desejado.

#### Deployment frequency

Com que frequência a equipe implanta.

#### Change failure rate

Quantas mudanças geram incidente, rollback ou correção urgente.

#### Mean time to restore

Quanto tempo a equipe demora para restaurar.

Uma equipe pode implantar muito e ainda ser insegura.

Frequência precisa ser analisada junto de falhas e recuperação.

---

### 5. Diferenciar CI e CD

Arquivo:

```text
ci-cd-decision-matrix.yaml
```

Conteúdo:

```yaml
practices:
  continuousIntegration:
    trigger:
      push-or-pull-request

    responsibilities:
      - compile
      - unit-tests
      - integration-tests
      - static-analysis
      - artifact-generation

  continuousDelivery:
    result:
      deployable-release

    productionApproval:
      mayBeManual

  continuousDeployment:
    result:
      automatic-production-deploy

    requirement:
      mature-gates-and-observability
```

CI não significa deploy.

CD pode significar delivery ou deployment, dependendo do contexto.

Sempre declare o significado.

---

### 6. Revisar o pipeline Maven

Um pipeline Java comum executa:

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

O lifecycle relevante inclui:

```text
validate;

compile;

test;

package;

verify;

install;

deploy.
```

`verify` executa validações configuradas antes de considerar o build aprovado.

O pipeline não deve depender da IDE.

---

### 7. Revisar testes por camada

Um gate equilibrado pode conter:

```text
unit tests;

integration tests;

contract tests;

architecture tests;

security checks;

smoke tests.
```

Cada camada responde a uma pergunta.

#### Unit test

A unidade isolada funciona?

#### Integration test

Componentes reais ou representativos se integram?

#### Contract test

A interface respeita o contrato esperado?

#### Architecture test

Dependências estruturais seguem a arquitetura?

#### Smoke test

A release implantada executa o fluxo essencial?

Nenhuma camada substitui todas as outras.

---

### 8. Revisar coverage gates

Coverage mede execução de linhas ou branches pelos testes.

Ela não mede automaticamente:

- qualidade;
- assertividade;
- valor;
- cenários críticos;
- ausência de bug.

Uma meta pode bloquear regressão de cobertura.

Entretanto, cobertura alta com asserts fracos continua perigosa.

A decisão correta combina:

```text
coverage;

mutation awareness;

critical paths;

code review;

test design.
```

---

### 9. Criar matriz de gates

Arquivo:

```text
pipeline-gate-matrix.yaml
```

Conteúdo:

```yaml
gates:
  source:
    - formatting
    - compilation

  tests:
    - unit
    - integration
    - architecture

  quality:
    - coverage
    - static-analysis

  security:
    - dependency-scan
    - secret-scan

  artifact:
    - checksum
    - metadata

  container:
    - non-root
    - health
    - image-scan

  release:
    - manifest-validation
    - smoke-test
    - rollback-readiness
```

Cada gate precisa possuir:

- owner;
- ação quando falha;
- evidência;
- prazo para exceções.

---

### 10. Revisar GitHub Actions

Um workflow contém:

```text
events;

jobs;

steps;

actions;

permissions;

artifacts;

environments.
```

Exemplo mínimo:

```yaml
name: Java CI

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - run: mvn --batch-mode clean verify
```

Permissões mínimas reduzem blast radius.

---

### 11. Revisar cache de dependências

Cache acelera downloads.

Ele não deve armazenar:

- Secrets;
- artifacts não confiáveis;
- outputs misturados entre contextos;
- dados mutáveis sem key adequada.

Uma key de cache precisa considerar:

- sistema operacional;
- versão da ferramenta;
- lock file;
- `pom.xml`;
- contexto necessário.

Cache incorreto pode mascarar dependência ausente.

Por isso, builds limpos periódicos continuam necessários.

---

### 12. Revisar artifact de pipeline

O artifact precisa ser:

- versionado;
- imutável;
- rastreável;
- verificável;
- armazenado;
- promovível.

Metadata mínima:

```text
application;

version;

commit;

build time;

checksum;

pipeline run.
```

O artifact não deve ser reconstruído em cada ambiente.

---

### 13. Revisar configuração por ambiente

Arquivo:

```text
runtime configuration
≠
código.
```

Ambientes podem variar em:

- endpoints;
- timeouts;
- feature flags;
- capacidade;
- log level;
- integração;
- credenciais.

A lógica de negócio não deve ser copiada em branches por ambiente.

Use configuração externa e profiles com responsabilidade limitada.

---

### 14. Revisar Secrets

Secrets não pertencem a:

- Git;
- Dockerfile;
- image layer;
- ConfigMap;
- logs;
- command history;
- artifact;
- evidence.

Um Secret precisa de:

- origem segura;
- owner;
- least privilege;
- rotação;
- auditoria;
- revogação;
- prazo.

Em pipelines, prefira credenciais temporárias e OIDC quando suportado.

---

### 15. Criar matriz de configuração

Arquivo:

```text
container-readiness-matrix.yaml
```

Conteúdo:

```yaml
runtime:
  configuration:
    externalized:
      required

  secrets:
    repository:
      forbidden

    image:
      forbidden

  container:
    nonRoot:
      required

    immutableArtifact:
      required

    health:
      required

    gracefulShutdown:
      required

  evidence:
    buildMetadata:
      required
```

---

### 16. Revisar Docker

Docker empacota aplicação e runtime em imagem.

Conceitos:

```text
Dockerfile;

image;

container;

layer;

registry;

volume;

network.
```

Imagem é template imutável.

Container é instância em execução.

Alteração feita manualmente dentro de container não deve ser o método de configuração.

---

### 17. Revisar multi-stage build

Multi-stage separa build e runtime.

Exemplo:

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY pom.xml .
COPY src ./src

RUN mvn --batch-mode clean package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build \
  /workspace/target/orders-api.jar \
  /app/orders-api.jar

ENTRYPOINT ["java", "-jar", "/app/orders-api.jar"]
```

O estágio final não precisa conter Maven e source.

No projeto final, o JAR aprovado foi usado como entrada para evitar rebuild durante promoção.

---

### 18. Revisar usuário non-root

Executar como root aumenta impacto de uma exploração.

O Dockerfile precisa:

- criar usuário;
- ajustar ownership;
- definir `USER`;
- evitar escrita privilegiada;
- usar porta não privilegiada;
- validar runtime.

Kubernetes também precisa de `runAsNonRoot`.

Uma imagem que declara non-root, mas não inicia, ainda não está pronta.

---

### 19. Revisar layers

Cada comando pode gerar uma layer.

Problemas comuns:

- copiar todo o repositório;
- incluir `.git`;
- incluir `target` desnecessário;
- incluir Secrets;
- instalar ferramentas e não removê-las;
- alterar arquivos após copiar credenciais.

Use `.dockerignore`.

Inspecione:

```powershell
docker history `
  --no-trunc `
  orders-api:review
```

---

### 20. Revisar Docker Compose

Docker Compose organiza serviços locais.

Exemplo:

```yaml
services:
  orders-api:
    build:
      context: .

    environment:
      SPRING_PROFILES_ACTIVE: container

    ports:
      - "8080:8080"

    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16

    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U local_user

      interval: 5s
      timeout: 3s
      retries: 10
```

`depends_on` não substitui retry e readiness da aplicação.

---

### 21. Revisar persistência local

Volume preserva dados além do ciclo do container.

Tipos de necessidade:

- banco local;
- cache de build;
- arquivos temporários;
- evidências.

Não use volume para esconder dependência de filesystem da aplicação.

Em produção, a estratégia precisa ser definida pela plataforma e pelo domínio.

---

### 22. Revisar health checks

Health checks precisam ter semântica.

#### Startup

A aplicação concluiu a inicialização?

#### Readiness

Pode receber tráfego?

#### Liveness

O processo precisa ser reiniciado?

Uma liveness dependente do banco pode reiniciar todos os Pods quando o banco falha.

Isso aumenta o incidente.

---

### 23. Revisar graceful shutdown

Durante encerramento:

1. instância deixa de receber tráfego;
2. novos trabalhos são bloqueados;
3. requisições em andamento recebem prazo;
4. consumers param polling;
5. conexões são fechadas;
6. processo termina.

O timeout da plataforma precisa ser maior que o da aplicação.

---

### 24. Inspecionar artifact

Execute:

```powershell
.\scripts\review\devops-part-1\inspect-build-artifact.ps1
```

O script verifica:

- JAR único;
- checksum;
- classe principal;
- metadata;
- profiles;
- ausência de Secret;
- tamanho;
- version;
- commit.

Resultado:

```text
artifact:
approved
ou
rejected.
```

---

### 25. Inspecionar imagem

Execute:

```powershell
.\scripts\review\devops-part-1\inspect-container-image.ps1
```

Verifique:

- base;
- user;
- labels;
- entrypoint;
- layers;
- tamanho;
- health externo;
- nenhuma credencial;
- nenhuma tag `latest`;
- digest quando disponível.

---

### 26. Revisar release strategies

As estratégias reduzem risco de formas diferentes.

#### Recreate

Remove versão anterior e inicia a nova.

Vantagem:

- simples.

Risco:

- indisponibilidade.

#### Rolling update

Substitui instâncias gradualmente.

Vantagem:

- aproveita o controlador.

Risco:

- versões coexistem.

#### Blue-green

Dois ambientes completos.

Vantagem:

- troca rápida;
- rollback rápido.

Risco:

- custo;
- sincronização de dados.

#### Canary

Libera para pequena parcela.

Vantagem:

- valida comportamento real.

Risco:

- roteamento;
- métricas;
- análise.

---

### 27. Criar matriz de estratégias

Arquivo:

```text
release-strategy-matrix.yaml
```

Conteúdo:

```yaml
strategies:
  recreate:
    zeroDowntime:
      false

    complexity:
      low

  rolling:
    zeroDowntime:
      conditional

    compatibilityBetweenVersions:
      required

  blueGreen:
    rollbackSpeed:
      high

    duplicateCapacity:
      required

  canary:
    progressiveExposure:
      true

    metricsAndAbort:
      required
```

A escolha depende de:

- risco;
- custo;
- tráfego;
- arquitetura;
- compatibilidade;
- observabilidade;
- rollback.

---

### 28. Revisar feature flags

Feature flag separa deploy de release funcional.

A aplicação pode ser implantada com a funcionalidade desabilitada.

Benefícios:

- exposição gradual;
- desligamento rápido;
- teste por grupo;
- redução de risco.

Riscos:

- flags esquecidas;
- combinações;
- dívida;
- autorização incorreta;
- comportamento divergente.

Toda flag precisa de owner e data de remoção.

---

### 29. Revisar rollback

Rollback funciona melhor quando:

- artifact anterior existe;
- configuração anterior existe;
- schema é compatível;
- release é rastreável;
- runbook foi testado;
- smoke test existe.

Rollback não é sinônimo de:

```text
desfazer todos
os efeitos do mundo externo.
```

Mensagens, arquivos e efeitos financeiros podem exigir compensação.

---

### 30. Criar árvore de decisão de rollback

Arquivo:

```text
rollback-decision-tree.yaml
```

Conteúdo:

```yaml
decision:
  releaseFailure:
    beforeTraffic:
      action:
        stop-rollout

    afterTraffic:
      dataChange:
        backwardCompatible:
          action:
            rollback-application

        destructive:
          action:
            roll-forward-or-recovery-plan

      externalEffects:
        produced:
          action:
            compensate-and-contain

  securityIncident:
    action:
      contain-before-routine-rollback
```

---

### 31. Revisar migrations e release

Uma migration precisa considerar coexistência de versões.

Padrão:

```text
expand;

deploy;

migrate;

contract.
```

#### Expand

Adiciona estrutura compatível.

#### Deploy

Nova versão usa a nova estrutura sem quebrar a antiga.

#### Migrate

Dados são preenchidos ou transformados.

#### Contract

Estrutura antiga é removida depois que não é mais usada.

Isso reduz risco em rolling, blue-green e canary.

---

### 32. Criar contrato de migration

Arquivo:

```text
migration-release-contract.yaml
```

Conteúdo:

```yaml
migration:
  backwardCompatibility:
    required

  destructiveChange:
    sameRelease:
      forbidden

  execution:
    singleRunner:
      required

  rollback:
    previousApplicationVersion:
      supportedDuringWindow

  observability:
    duration:
      required

    failure:
      alert:
        required
```

---

### 33. Revisar zero downtime

Zero downtime não é apenas `maxUnavailable: 0`.

Também depende de:

- readiness correta;
- capacidade;
- startup;
- shutdown;
- compatibilidade;
- migrations;
- balanceamento;
- conexão;
- cache;
- sessão;
- observabilidade.

Uma aplicação pode possuir dois Pods e ainda ficar indisponível se ambos não estiverem Ready.

---

### 34. Simular falha de pipeline

Execute:

```powershell
.\scripts\review\devops-part-1\simulate-pipeline-failure.ps1
```

Cenários:

- teste falha;
- coverage cai;
- Secret é detectado;
- artifact sem metadata;
- scan crítico;
- manifest inválido.

Para cada cenário, registre:

- gate;
- fase;
- owner;
- bloqueio;
- correção;
- evidência.

---

### 35. Simular falha de container

Execute:

```powershell
.\scripts\review\devops-part-1\simulate-container-failure.ps1
```

Cenários:

- processo root;
- porta incorreta;
- profile ausente;
- release ID ausente;
- health não responde;
- Secret na layer;
- filesystem sem permissão;
- memória insuficiente.

A resposta precisa separar:

```text
falha de build;

falha de image;

falha de runtime;

falha de configuração.
```

---

### 36. Simular decisão de release

Execute:

```powershell
.\scripts\review\devops-part-1\simulate-release-decision.ps1
```

Cenários:

#### Cenário A

API interna de baixo risco, manutenção aceita.

Decisão possível:

```text
recreate.
```

#### Cenário B

API pública com várias réplicas e compatibilidade.

Decisão possível:

```text
rolling.
```

#### Cenário C

Mudança crítica com rollback imediato.

Decisão possível:

```text
blue-green.
```

#### Cenário D

Mudança de alto risco com métricas fortes.

Decisão possível:

```text
canary.
```

O script exige justificativa.

---

### 37. Validar decisão de rollback

Execute:

```powershell
.\scripts\review\devops-part-1\validate-rollback-decision.ps1
```

O validator pergunta:

- existe artifact anterior;
- configuração anterior;
- schema compatível;
- external effects;
- security impact;
- trigger;
- owner;
- smoke test;
- prazo.

Sem essas respostas, rollback não está pronto.

---

### 38. Criar cenários de troubleshooting

Arquivo:

```text
troubleshooting-scenarios.yaml
```

Inclua:

```yaml
scenarios:
  - id:
      PIPE-001

    symptom:
      tests-pass-locally-fail-ci

    likelyCauses:
      - hidden-local-dependency
      - timezone
      - filesystem-case
      - cached-state

  - id:
      CONT-001

    symptom:
      container-exits-immediately

    likelyCauses:
      - invalid-profile
      - missing-required-property
      - wrong-entrypoint
      - insufficient-memory

  - id:
      REL-001

    symptom:
      rolling-update-stalls

    likelyCauses:
      - readiness-failure
      - insufficient-capacity
      - image-pull
      - invalid-configuration
```

---

### 39. Criar autoavaliação

Arquivo:

```text
self-assessment.yaml
```

Use níveis:

```text
0:
não reconheço.

1:
reconheço.

2:
explico.

3:
aplico.

4:
diagnostico.

5:
ensino e decido.
```

Avalie:

- CI;
- CD;
- pipeline;
- Maven;
- tests;
- coverage;
- GitHub Actions;
- artifacts;
- configuration;
- Secrets;
- Docker;
- Compose;
- health;
- release strategies;
- rollback;
- migrations;
- zero downtime.

Não use a nota como punição.

Use para orientar revisão.

---

### 40. Criar documentação de revisão

#### `DEVOPS_FOUNDATIONS_REVIEW.md`

Conecte cultura, fluxo e métricas.

#### `CI_CD_REVIEW.md`

Diferencie integração, delivery e deployment.

#### `PIPELINE_AND_GATES_REVIEW.md`

Explique gates e falhas.

#### `CONTAINERS_REVIEW.md`

Explique image, runtime, layers e non-root.

#### `CONFIGURATION_AND_SECRETS_REVIEW.md`

Explique profiles e credenciais.

#### `RELEASE_STRATEGIES_REVIEW.md`

Compare estratégias.

#### `ROLLBACK_AND_MIGRATIONS_REVIEW.md`

Conecte schema, release e recovery.

---

### 41. Criar matriz de testes da revisão

Arquivo:

```text
REVIEW_PART_1_TEST_MATRIX.md
```

Cenários:

- diferença entre CI e CD explicada;
- pipeline Maven identificado;
- gate de teste classificado;
- coverage interpretada corretamente;
- workflow usa permissão mínima;
- artifact possui checksum;
- configuração é externa;
- Secret não entra no Git;
- imagem é non-root;
- layers não possuem Secret;
- Compose não substitui retry;
- health groups possuem semântica;
- graceful shutdown possui prazo;
- recreate é reconhecido;
- rolling exige compatibilidade;
- blue-green exige capacidade duplicada;
- canary exige métricas;
- feature flag possui owner;
- rollback possui artifact anterior;
- migration destrutiva não ocorre na mesma release;
- zero downtime considera readiness;
- troubleshooting produz hipótese e evidência.

---

### 42. Criar troubleshooting da revisão

Arquivo:

```text
REVIEW_PART_1_TROUBLESHOOTING.md
```

Inclua:

- build local diferente do CI;
- dependency cache inconsistente;
- testes flaky;
- coverage gate inesperado;
- workflow sem permissão;
- artifact sem metadata;
- image muito grande;
- container root;
- Secret no histórico;
- Compose inicia antes da dependência;
- readiness incorreta;
- shutdown interrompe requests;
- rolling update trava;
- canary sem métrica;
- blue-green com schema incompatível;
- rollback indisponível;
- migration lock;
- feature flag esquecida;
- evidence incompleta.

---

### 43. Coletar evidence da revisão

Script:

```text
collect-review-part-1-evidence.ps1
```

Arquivo:

```text
review-part-1-evidence.json.
```

Campos permitidos:

- lesson;
- concept map status;
- CI/CD matrix status;
- pipeline gates status;
- artifact inspection;
- image inspection;
- configuration validation;
- pipeline failure scenarios;
- container failure scenarios;
- release decisions;
- rollback readiness;
- self-assessment completed;
- cloud resources zero;
- real secrets zero;
- timestamp.

---

### 44. Executar o gate da revisão

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\review\devops-part-1\validate-concept-map.ps1

.\scripts\review\devops-part-1\validate-pipeline-gates.ps1

.\scripts\review\devops-part-1\inspect-build-artifact.ps1

.\scripts\review\devops-part-1\inspect-container-image.ps1

.\scripts\review\devops-part-1\validate-runtime-configuration.ps1

.\scripts\review\devops-part-1\simulate-pipeline-failure.ps1

.\scripts\review\devops-part-1\simulate-container-failure.ps1

.\scripts\review\devops-part-1\simulate-release-decision.ps1

.\scripts\review\devops-part-1\validate-rollback-decision.ps1

.\scripts\review\devops-part-1\collect-review-part-1-evidence.ps1

.\scripts\review\devops-part-1\verify-review-part-1-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- conceitos explicados;
- artifact inspecionado;
- image inspecionada;
- configuração validada;
- cenários diagnosticados;
- release strategies justificadas;
- rollback analisado;
- migrations relacionadas;
- autoavaliação concluída;
- nenhuma cloud;
- nenhum Secret real;
- parte 2 preparada.

---

## Entendendo o que foi feito

### DevOps voltou ao objetivo

Ferramentas foram ligadas a fluxo, feedback e confiabilidade.

### CI e CD foram separados

Build frequente não foi confundido com deploy automático.

### Gates ganharam propósito

Cada validação passou a responder a um risco.

### Artifact ganhou rastreabilidade

Version, commit e checksum explicam o que foi aprovado.

### Container ganhou responsabilidade limitada

Ele empacota runtime, mas não resolve configuração e operação sozinho.

### Health ganhou semântica

Startup, readiness e liveness deixaram de ser sinônimos.

### Release strategy ganhou contexto

A escolha depende de risco, compatibilidade, custo e observabilidade.

### Rollback ganhou pré-condições

Artifact anterior e schema compatível passaram a ser exigidos.

### Migrations ganharam relação com rollout

Expand and contract protege coexistência de versões.

### A revisão ganhou diagnóstico

Você praticou decisões, não apenas definições.

---

## Erros comuns importantes

### Tratar DevOps como cargo isolado

A responsabilidade de entrega continua compartilhada.

### Chamar qualquer workflow de CI/CD

O nome não garante integration, delivery ou deployment.

### Confiar apenas em coverage

Cobertura não mede qualidade dos asserts.

### Reconstruir artifact por ambiente

A promoção perde rastreabilidade.

### Colocar configuração dentro da imagem

O artifact fica acoplado ao ambiente.

### Guardar Secret no repositório privado

Repositório privado não é cofre.

### Executar container como root

O impacto de exploração aumenta.

### Confundir health com readiness

Um processo vivo pode não estar pronto.

### Escolher canary sem métricas

Não existe critério de abort.

### Prometer rollback com migration destrutiva

A versão anterior pode não funcionar.

---

## Comandos úteis

### Executar build completo

```powershell
mvn `
  --batch-mode `
  clean `
  verify
```

### Inspecionar JAR

```powershell
jar tf `
  target/orders-api.jar
```

### Inspecionar imagem

```powershell
docker image inspect `
  orders-api:review
```

### Inspecionar layers

```powershell
docker history `
  --no-trunc `
  orders-api:review
```

### Validar Compose

```powershell
docker compose `
  config
```

---

## Exercício guiado

### Parte 1 — Cultura

Explique DevOps sem citar ferramenta.

### Parte 2 — CI/CD

Classifique um pipeline.

### Parte 3 — Quality

Associe gates aos riscos.

### Parte 4 — Artifact

Inspecione metadata e checksum.

### Parte 5 — Configuration

Separe profile, variável e Secret.

### Parte 6 — Container

Valide non-root, layers e health.

### Parte 7 — Release

Escolha uma estratégia.

### Parte 8 — Rollback

Verifique pré-condições.

### Parte 9 — Migration

Modele expand and contract.

### Parte 10 — Diagnosis

Resolva cenários e gere evidence.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 548 foi preservada;
- ponte para a aula 550 está correta;
- revisão parte 1 respeitou o escopo;
- DevOps foi definido;
- value stream foi definido;
- lead time foi definido;
- deployment frequency foi definida;
- change failure rate foi definida;
- mean time to restore foi definido;
- CI foi definida;
- continuous delivery foi definida;
- continuous deployment foi definida;
- pipeline foi definido;
- gate foi definido;
- artifact foi definido;
- environment foi definido;
- release strategy foi definida;
- rollback foi definido;
- mapa conceitual foi criado;
- práticas foram relacionadas a resultados;
- métricas de entrega foram revisadas;
- CI e CD foram diferenciadas;
- matriz de decisão foi criada;
- lifecycle Maven foi revisado;
- `clean verify` foi usado;
- testes unitários foram revisados;
- testes de integração foram revisados;
- testes de contrato foram revisados;
- testes de arquitetura foram revisados;
- smoke tests foram revisados;
- coverage foi contextualizada;
- matriz de gates foi criada;
- GitHub Actions foi revisado;
- eventos, jobs e steps foram revisados;
- permissões mínimas foram exigidas;
- cache de dependências foi revisado;
- builds limpos foram preservados;
- artifact imutável foi exigido;
- metadata mínima foi definida;
- configuração externa foi revisada;
- profiles foram limitados a diferenças de ambiente;
- Secrets foram revisados;
- credenciais temporárias foram recomendadas;
- matriz de container readiness foi criada;
- image e container foram diferenciados;
- multi-stage build foi revisado;
- runtime sem Maven foi exigido;
- non-root foi revisado;
- layers foram revisadas;
- `.dockerignore` foi revisado;
- Docker Compose foi revisado;
- `depends_on` não substituiu readiness;
- volumes foram contextualizados;
- startup, readiness e liveness foram diferenciados;
- graceful shutdown foi revisado;
- artifact foi inspecionado;
- image foi inspecionada;
- recreate foi revisado;
- rolling update foi revisado;
- blue-green foi revisado;
- canary foi revisado;
- matriz de estratégias foi criada;
- feature flags foram revisadas;
- owner e remoção de flags foram exigidos;
- rollback foi relacionado a artifact e configuração;
- árvore de decisão foi criada;
- effects externos foram considerados;
- migration expand and contract foi revisada;
- migration contract foi criado;
- destructive change na mesma release foi proibida;
- zero downtime foi contextualizado;
- falha de pipeline foi simulada;
- falha de container foi simulada;
- decisão de release foi simulada;
- decisão de rollback foi validada;
- cenários de troubleshooting foram criados;
- autoavaliação foi criada;
- documentação foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- evidence foi sanitizada;
- cloud resources ficou zero;
- real secrets ficou zero;
- Kubernetes aprofundado não foi antecipado;
- cloud aprofundada não foi antecipada;
- revisão parte 2 ficou preparada;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/review/devops-part-1 `
  scripts/review/devops-part-1 `
  docs/review/devops-part-1 `
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
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|kubeconfig|client-secret"
```

Commit recomendado:

```powershell
git commit -m "docs(m17): revisar DevOps parte 1"
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
- image archive;
- JAR;
- log completo;
- relatório com dado real;
- recurso cloud;
- material da revisão parte 2.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você revisou a primeira metade do conhecimento de DevOps do módulo.

A revisão conectou:

```text
cultura;

fluxo;

métricas;

CI;

CD;

pipeline;

gates;

artifact;

configuração;

Secrets;

containers;

health;

release;

rollback;

migrations.
```

Você comprovou que DevOps não é sinônimo de ferramenta; CI não significa deploy; continuous delivery e continuous deployment possuem responsabilidades diferentes; gates precisam responder a riscos; artifact precisa ser imutável e rastreável; configuração não deve ser incorporada ao código; Secrets não entram em Git ou images; containers precisam de runtime mínimo e usuário non-root; health checks possuem semânticas diferentes; release strategies dependem do contexto; feature flags separam deploy de exposição; rollback exige compatibilidade; migrations precisam permitir coexistência; e zero downtime depende de toda a cadeia.

A próxima aula será:

```text
550 - M17.45 - Revisao DevOps parte 2
```

Nela, você irá revisar Kubernetes, Namespace, RBAC, ConfigMap, Secret, probes, requests, limits, HPA, volumes, Ingress, Helm, cloud, AWS, RDS, mensageria, cache, object storage, custos, segurança e as decisões do projeto final.

Nenhum conteúdo prático da revisão parte 2 foi antecipado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Expliquei DevOps sem depender de ferramentas.
- [ ] Diferenciei CI, delivery e deployment.
- [ ] Classifiquei gates de pipeline.
- [ ] Inspecionei artifact e imagem.
- [ ] Revisei configuração e Secrets.
- [ ] Comparei release strategies.
- [ ] Validei rollback e migrations.
- [ ] Concluí a autoavaliação.

---

## Troubleshooting adicional

### O build passa localmente e falha no CI

Procure dependência implícita, timezone, case sensitivity, cache e estado local.

### O workflow não consegue publicar artifact

Revise permissões, path, nome e fase de geração.

### O container encerra imediatamente

Revise entrypoint, profile, configuração obrigatória e memória.

### O health responde, mas o Service falha

Health local não comprova rota, selector ou endpoint da plataforma.

### O rolling update não avança

Revise readiness, capacidade, imagem, configuração e PDB.

### O rollback volta para versão incompatível

O schema ou a configuração romperam compatibilidade.

### O canary não possui critério de sucesso

Defina métricas, janela, baseline e abort.

### A feature flag permanece por meses

Registre owner, remoção e dívida técnica.

### A coverage está alta e bugs continuam

Revise asserts, casos críticos e qualidade dos testes.

### Kubernetes detalhado apareceu

Preserve para a aula 550.

---

## Perguntas de revisão

1. O que é DevOps?
2. O que é value stream?
3. Quais são as quatro métricas de entrega?
4. O que é CI?
5. Qual a diferença entre delivery e deployment?
6. O que é um gate?
7. Por que usar `mvn verify`?
8. O que coverage não mede?
9. Por que usar permissões mínimas no workflow?
10. O que torna um artifact promovível?
11. Por que externalizar configuração?
12. Onde Secrets não podem ficar?
13. Qual a diferença entre image e container?
14. Por que usar non-root?
15. Qual a diferença entre readiness e liveness?
16. Quando usar blue-green?
17. O que um canary precisa?
18. Quais pré-condições existem para rollback?
19. Como expand and contract reduz risco?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Cultura de entrega compartilhada.
2. Fluxo da necessidade ao valor.
3. Lead time, frequência, falha e restore.
4. Integração frequente automatizada.
5. Pronto para deploy e deploy automático.
6. Condição de continuidade.
7. Executar validações do lifecycle.
8. Qualidade dos testes.
9. Reduzir blast radius.
10. Imutabilidade e rastreabilidade.
11. Variar ambiente sem rebuild.
12. Git, image, logs e artifacts.
13. Template e instância.
14. Reduzir privilégio.
15. Tráfego e processo.
16. Troca rápida e capacidade duplicada.
17. Métricas e abort.
18. Artifact, config e schema compatíveis.
19. Permitir coexistência.
20. Revisão DevOps parte 2.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 549 - M17.44 - Revisao DevOps parte 1

- Continuei após concluir o projeto de API pronta para deploy.
- Iniciei a revisão técnica do Módulo 17.
- Reforcei DevOps como cultura de fluxo, feedback e responsabilidade.
- Revisei value stream e métricas de entrega.
- Diferenciei CI, continuous delivery e continuous deployment.
- Revisei pipeline, jobs, steps e gates.
- Revisei o lifecycle Maven e `clean verify`.
- Relacionei testes unitários, integração, contrato, arquitetura e smoke.
- Contextualizei coverage sem tratá-la como prova de qualidade.
- Revisei GitHub Actions e permissões mínimas.
- Revisei cache de dependências e builds limpos.
- Reforcei artifacts imutáveis com version, commit e checksum.
- Revisei configuração externa, profiles e ambientes.
- Reforcei que Secrets não entram em Git, image, logs ou evidence.
- Revisei Docker, images, containers e layers.
- Revisei multi-stage build e runtime mínimo.
- Reforcei execução non-root.
- Revisei Docker Compose e volumes locais.
- Diferenciei startup, readiness e liveness.
- Revisei graceful shutdown.
- Comparei recreate, rolling, blue-green e canary.
- Revisei feature flags.
- Modelei decisão de rollback.
- Relacionei rollback com schema e efeitos externos.
- Revisei migrations expand and contract.
- Contextualizei zero downtime.
- Simulei falhas de pipeline, container e release.
- Criei autoavaliação e evidence sanitizada.
- Não antecipei Kubernetes e cloud da parte 2.
- Próxima aula: Revisão DevOps parte 2.
```

---

## Referência técnica curta

- DevOps and Value Stream.
- DORA Delivery Metrics.
- Continuous Integration.
- Continuous Delivery.
- GitHub Actions.
- Maven Build Lifecycle.
- Container Image Best Practices.
- Externalized Configuration.
- Release Strategies.
- Expand and Contract Migrations.

Regra final:

```text
a revisão DevOps parte 1 precisa conectar cultura, automação e operação: DevOps reduz handoffs e acelera feedback, enquanto lead time, deployment frequency, change failure rate e restore time ajudam a medir o fluxo; CI integra código com build e testes, continuous delivery mantém release pronta e continuous deployment automatiza a implantação, sempre com gates de qualidade, segurança, artifact e operação; Maven, testes e coverage precisam produzir evidência sem confundir execução com qualidade, workflows usam permissões mínimas e artifacts carregam version, commit e checksum; configuração é externa, profiles representam ambientes e Secrets nunca entram em Git, image, logs ou evidence; containers usam runtime mínimo, usuário non-root, layers controladas, health e graceful shutdown; recreate, rolling, blue-green e canary são escolhidos por risco, custo, compatibilidade e observabilidade, feature flags separam deploy de exposição, rollback exige artifact e configuração anteriores, schema compatível e tratamento de efeitos externos, e migrations seguem expand, deploy, migrate e contract; Kubernetes e cloud ficam para a aula 550 de revisão DevOps parte 2.
```
