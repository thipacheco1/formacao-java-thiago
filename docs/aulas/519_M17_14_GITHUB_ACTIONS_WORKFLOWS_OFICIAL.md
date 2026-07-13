# 519 - M17.14 - GitHub Actions workflows

## Apresentação da aula

Na aula 518, você deixou de enxergar CI/CD como um arquivo YAML isolado.

O sistema de entrega passou a possuir:

```text
triggers;

stages;

jobs;

steps;

dependencies;

quality gates;

artifacts;

outputs;

cache;

environments;

permissions;

promotion;

rollback;

observability.
```

Também foram separados os objetivos de:

```text
pull request;

branch principal;

release;

promoção;

rollback.
```

Essa separação produziu um blueprint independente de ferramenta.

Agora esse blueprint será traduzido para uma plataforma concreta:

```text
GitHub Actions.
```

A pergunta central desta aula será:

```text
como transformar
a arquitetura do pipeline

em workflows reais,
seguros,
legíveis
e executáveis

dentro do GitHub?
```

GitHub Actions executa workflows armazenados em:

```text
.github/workflows.
```

Cada workflow é um arquivo:

```text
.yml
ou
.yaml.
```

Um workflow pode ser disparado por eventos como:

- pull request;
- push;
- tag;
- execução manual;
- chamada por outro workflow;
- conclusão de outro workflow;
- agendamento.

Nesta aula, será criado o primeiro workflow real:

```text
.github/workflows/ci-foundation.yml.
```

Ele terá como objetivo:

```text
validar a fundação
de CI do projeto

em pull requests
e pushes para main.
```

O workflow não publicará uma imagem em registry.

Não fará deploy.

Não acessará secrets de produção.

Não executará promoção.

Não criará release.

Não executará rollback.

Essas responsabilidades serão distribuídas nas próximas aulas.

A primeira versão terá três jobs:

```text
metadata;

verify;

workflow-summary.
```

#### `metadata`

Obtém e publica informações controladas:

- commit;
- branch ou ref;
- event;
- short SHA;
- identificador da execução.

#### `verify`

Faz checkout, configura JDK 21, utiliza cache Maven e executa uma validação básica.

O aprofundamento do pipeline Maven ocorrerá na aula 520.

Nesta aula, o comando principal será mantido simples:

```text
./mvnw --batch-mode --no-transfer-progress verify.
```

#### `workflow-summary`

Executa após os jobs anteriores.

Ele registra no summary:

- evento;
- commit;
- resultado;
- artifact;
- duração disponível;
- conclusão.

A aula também trabalhará com:

```text
name;

run-name;

on;

permissions;

concurrency;

defaults;

env;

jobs;

runs-on;

needs;

if;

steps;

uses;

run;

with;

outputs;

contexts;

expressions;

artifacts;

cache;

timeout;

shell.
```

O workflow terá permissões mínimas:

```yaml
permissions:
  contents: read
```

O job de teste não precisa:

- escrever no repositório;
- abrir issue;
- publicar package;
- alterar deployment;
- gerar token com amplo acesso.

A aula usará:

```text
actions/checkout@v6;

actions/setup-java@v5;

actions/upload-artifact@v4.
```

Essas majors refletem a documentação e os repositórios oficiais consultados para esta aula.

Entretanto, uma política profissional precisa diferenciar:

```text
exemplo legível;

execução endurecida.
```

Em workflows endurecidos, actions de terceiros e até actions oficiais podem ser fixadas por commit SHA completo.

Exemplo conceitual:

```yaml
uses:
  actions/checkout@<sha-completo-auditado>
```

Isso reduz o risco de uma tag móvel apontar para conteúdo diferente.

Nesta aula, a baseline utilizará majors para manter o laboratório compreensível.

A política documentará a evolução para SHA pinning.

Outro ponto importante será o cache.

`setup-java` pode configurar cache para Maven:

```yaml
cache: maven
```

O cache acelera downloads.

Ele não será tratado como artifact.

O cache:

- pode expirar;
- pode ser removido;
- pode ter miss;
- não representa uma saída oficial;
- não deve armazenar secrets.

Os relatórios de teste serão preservados como artifact.

O upload ocorrerá mesmo quando a validação falhar:

```yaml
if: always()
```

Isso permite investigar:

- teste quebrado;
- erro de integração;
- falha de migration;
- problema de contexto.

O artifact não transforma a falha em sucesso.

O job continuará falhando.

A aula também tratará de concorrência.

Em pull request, quando um novo commit é enviado:

```text
a execução anterior
da mesma branch
pode ser cancelada.
```

Isso evita gastar runner validando um commit que já foi substituído.

A configuração será:

```yaml
concurrency:
  group:
    ci-${{ github.workflow }}-${{ github.ref }}

  cancel-in-progress:
    true
```

Essa política é adequada para validação de código.

Ela não deve ser copiada automaticamente para deploy produtivo.

Cancelar um deployment em andamento pode deixar o ambiente em estado intermediário.

O workflow também terá timeout.

Jobs sem timeout podem ficar presos.

Cada job terá:

```yaml
timeout-minutes:
```

adequado ao laboratório.

Outro ponto será a diferença entre:

```text
context;

environment variable;

secret;

variable;

output.
```

#### Context

Objeto disponível nas expressions.

Exemplos:

```text
github;

runner;

job;

steps;

needs;

env;

vars;

secrets;

matrix.
```

#### Environment variable

Valor disponibilizado ao processo do step.

#### Secret

Valor protegido e mascarado quando possível.

Não deve ser impresso.

#### Repository or environment variable

Configuração não sensível acessada por:

```text
vars.
```

#### Output

Valor produzido por step ou job para outro job.

A aula criará um output:

```text
short_sha.
```

O job `verify` receberá esse output por:

```text
needs.metadata.outputs.short_sha.
```

Isso demonstrará o grafo de dependências.

A aula também mostrará que jobs executam em ambientes isolados.

Um arquivo criado no job `metadata` não aparece automaticamente em `verify`.

Para transferir arquivos entre jobs, é necessário:

- artifact;
- cache quando a finalidade é aceleração;
- storage externo;
- rebuild controlado.

Outputs servem para valores pequenos.

Artifacts servem para arquivos.

O workflow será validado antes do commit.

Você poderá:

- revisar YAML;
- verificar paths;
- conferir permissions;
- executar comandos equivalentes localmente;
- observar a aba Actions depois do push;
- analisar logs;
- baixar artifacts;
- verificar checks no pull request.

Não será prometida equivalência perfeita entre máquina local e runner.

O runner:

- usa outro sistema operacional;
- possui outro filesystem;
- começa limpo;
- possui recursos limitados;
- não carrega configurações locais não versionadas.

Essa diferença é desejável.

Ela detecta dependências acidentais do ambiente do desenvolvedor.

A próxima aula será:

```text
520 - M17.15 - Pipeline Maven
```

Nela, você irá aprofundar:

- lifecycle Maven;
- goals;
- profiles;
- Surefire;
- Failsafe;
- relatórios;
- cache;
- test selection;
- integração;
- paralelismo;
- parâmetros;
- gates.

Portanto, esta aula não transformará o workflow em um pipeline Maven completo.

O foco será:

```text
estrutura do GitHub Actions;

segurança;

dependências;

outputs;

artifacts;

concorrência;

execução.
```

Ao final, você deverá explicar:

```text
onde workflows vivem;

o que dispara um workflow;

como jobs se relacionam;

por que jobs isolados
não compartilham filesystem;

como usar needs;

como criar outputs;

quando usar artifact;

como cache difere de artifact;

como aplicar permissions;

como cancelar CI obsoleta;

por que artifacts usam always;

como investigar
uma execução falha.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
517:
Deploy com migracao sem downtime.

518:
CI CD profissional visao geral.

519:
GitHub Actions workflows.

520:
Pipeline Maven.

521:
Quality gates no CI.
```

A aula 518 respondeu:

```text
como modelar
um pipeline profissional
independente da ferramenta?
```

A aula 519 responderá:

```text
como traduzir
o primeiro trecho
desse blueprint
para GitHub Actions?
```

Nesta aula:

```text
workflow real:
sim.

.github/workflows:
sim.

pull_request:
sim.

push main:
sim.

workflow_dispatch:
sim.

permissions:
sim.

concurrency:
sim.

checkout:
sim.

setup Java:
sim.

cache Maven:
sim.

jobs:
sim.

needs:
sim.

outputs:
sim.

artifact:
sim.

summary:
sim.

timeout:
sim.

matrix:
conceitual.

reusable workflow:
conceitual.

environments:
conceitual.

registry:
não.

deploy:
não.

pipeline Maven completo:
não.
```

A regra central será:

```text
o workflow deve
expressar a política
com permissions mínimas,
gates claros
e evidências preservadas.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Será criado:

```text
.github/workflows/ci-foundation.yml
```

Também serão criados:

```text
scripts/github-actions
├── validate-workflow-foundation.ps1
├── simulate-workflow-commands.ps1
├── inspect-workflow-artifacts.ps1
└── verify-workflow-security.ps1

docs/devops/github-actions
├── GITHUB_ACTIONS_FOUNDATION.md
├── WORKFLOW_TRIGGER_POLICY.md
├── WORKFLOW_PERMISSIONS.md
├── WORKFLOW_CONCURRENCY.md
├── WORKFLOW_CONTEXTS_AND_OUTPUTS.md
├── WORKFLOW_ARTIFACTS.md
├── ACTION_PINNING_POLICY.md
├── WORKFLOW_TEST_MATRIX.md
└── WORKFLOW_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
workflow versionado;

triggers controlados;

permissions mínimas;

concorrência configurada;

JDK 21;

cache Maven;

Maven Wrapper;

relatórios preservados;

outputs entre jobs;

summary;

scripts de validação;

documentação.
```

Você irá:

1. confirmar a baseline;
2. criar diretório de workflows;
3. definir nome;
4. definir run-name;
5. definir triggers;
6. filtrar main;
7. adicionar dispatch manual;
8. definir permissions;
9. definir concurrency;
10. definir defaults;
11. criar job metadata;
12. criar output short SHA;
13. criar job verify;
14. adicionar checkout;
15. configurar Java;
16. configurar cache;
17. validar wrapper;
18. executar verify;
19. coletar relatórios;
20. publicar artifact;
21. criar summary;
22. usar needs;
23. usar always;
24. definir timeout;
25. simular falha;
26. verificar cancelamento;
27. validar ausência de secrets;
28. documentar action pinning;
29. criar scripts;
30. executar gate;
31. commitar;
32. preparar a aula 520.

---

## Conceito essencial

### Workflow

Workflow é o processo automatizado definido em YAML.

Ele pode conter um ou mais jobs.

---

### Diretório obrigatório

Os arquivos precisam estar em:

```text
.github/workflows.
```

Um YAML em outro diretório não é registrado como workflow.

---

### `name`

Nome exibido na aba Actions.

Exemplo:

```yaml
name:
  CI Foundation
```

---

### `run-name`

Nome de cada execução.

Pode utilizar contexts.

Exemplo:

```yaml
run-name:
  CI Foundation - ${{ github.event_name }} - ${{ github.ref_name }}
```

Evite inserir secret ou payload não confiável no nome.

---

### `on`

Define eventos.

Exemplo:

```yaml
on:
  pull_request:

  push:
    branches:
      - main

  workflow_dispatch:
```

Pull requests validam mudanças antes do merge.

Push em main valida o commit integrado.

Dispatch permite execução manual.

---

### Filtros de path

`paths` e `paths-ignore` podem reduzir execuções.

Entretanto, checks obrigatórios podem permanecer pendentes quando o workflow é ignorado por filtros mal planejados.

A baseline não aplicará filtro de path.

---

### `permissions`

Define permissões do `GITHUB_TOKEN`.

Baseline:

```yaml
permissions:
  contents:
    read
```

Permissões adicionais devem ser declaradas somente quando necessárias.

---

### `GITHUB_TOKEN`

Token temporário criado para a execução.

O alcance depende das permissões.

Ele não deve ser exibido.

---

### `concurrency`

Agrupa execuções.

Para CI de branch:

```yaml
concurrency:
  group:
    ci-${{ github.workflow }}-${{ github.ref }}

  cancel-in-progress:
    true
```

Um novo commit cancela a validação antiga do mesmo ref.

---

### `defaults.run`

Permite definir shell ou diretório padrão.

Como o projeto está em subdiretório:

```yaml
defaults:
  run:
    shell:
      bash

    working-directory:
      labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Steps que usam actions não obedecem ao `working-directory` de `run`.

O parâmetro se aplica aos steps com `run`.

---

### `runs-on`

Define o runner.

Baseline:

```yaml
runs-on:
  ubuntu-latest
```

O label é gerenciado pelo GitHub.

Para reprodutibilidade máxima, organizações podem controlar runner e imagem.

---

### Job isolation

Cada job recebe um ambiente novo.

Filesystem não é compartilhado.

O cache e artifacts são mecanismos explícitos.

---

### `needs`

Cria dependência.

Exemplo:

```yaml
verify:
  needs:
    - metadata
```

Sem `needs`, jobs podem executar em paralelo.

---

### Step ID

Um step precisa de `id` para expor outputs.

Exemplo:

```yaml
- name:
    Calculate metadata

  id:
    build_metadata

  run:
    echo "short_sha=${GITHUB_SHA::7}" >> "${GITHUB_OUTPUT}"
```

---

### `GITHUB_OUTPUT`

Arquivo usado para publicar outputs de step.

Não escreva secret como output.

Outputs podem aparecer em metadata e logs de uso.

---

### Job output

Mapeamento:

```yaml
outputs:
  short_sha:
    ${{ steps.build_metadata.outputs.short_sha }}
```

Outro job usa:

```text
needs.metadata.outputs.short_sha.
```

---

### `uses`

Executa uma action.

Exemplos:

```yaml
uses:
  actions/checkout@v6
```

```yaml
uses:
  actions/setup-java@v5
```

---

### Action pinning

Major tag é simples.

SHA completo oferece maior imutabilidade.

A política profissional precisa revisar e atualizar os SHAs de forma controlada.

---

### Setup Java

Exemplo:

```yaml
with:
  distribution:
    temurin

  java-version:
    "21"

  cache:
    maven
```

O JDK do workflow precisa corresponder à formação.

---

### Maven Wrapper

Use:

```text
./mvnw.
```

Não dependa apenas do Maven global do runner.

Antes:

```bash
chmod +x mvnw
```

O bit executável deve preferencialmente estar versionado corretamente.

---

### Artifact

Relatórios podem ser preservados com:

```yaml
uses:
  actions/upload-artifact@v4
```

Configuração:

```yaml
if:
  always()

with:
  name:
    maven-reports-${{ needs.metadata.outputs.short_sha }}

  path:
    |
      target/surefire-reports/**
      target/failsafe-reports/**

  if-no-files-found:
    warn

  retention-days:
    14
```

---

### `if: always()`

Executa o step mesmo quando um step anterior falha.

Ele não ignora o resultado do job.

---

### Summary

O arquivo:

```text
GITHUB_STEP_SUMMARY
```

permite publicar Markdown na execução.

Exemplo:

```bash
echo "## CI Foundation" >> "${GITHUB_STEP_SUMMARY}"
```

---

### Contexts

Contexts principais:

```text
github;

runner;

job;

steps;

needs;

env;

vars;

secrets;

matrix.
```

Não imprima o contexto `github` completo.

Ele pode conter dados que não devem virar log.

---

### Expressions

Usam:

```text
${{ ... }}.
```

Elas podem definir:

- condições;
- nomes;
- outputs;
- inputs;
- grupos;
- parâmetros.

---

### Secrets em pull requests

Workflows disparados por forks possuem restrições de secrets.

Não contorne usando `pull_request_target` sem compreender o modelo de confiança.

A baseline usa:

```text
pull_request.
```

E não precisa de secret.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

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
.\scripts\pipeline\run-local-ci.ps1
```

---

### 2. Criar o diretório

Na raiz do repositório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  ".github/workflows"
```

O workflow pertence à raiz do Git.

Não coloque dentro do laboratório.

---

### 3. Criar `ci-foundation.yml`

Arquivo:

```text
.github/workflows/ci-foundation.yml
```

Conteúdo inicial:

```yaml
name:
  CI Foundation

run-name:
  CI Foundation - ${{ github.event_name }} - ${{ github.ref_name }}

on:
  pull_request:

  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents:
    read

concurrency:
  group:
    ci-${{ github.workflow }}-${{ github.ref }}

  cancel-in-progress:
    true

defaults:
  run:
    shell:
      bash

    working-directory:
      labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

---

### 4. Criar job `metadata`

Adicione:

```yaml
jobs:
  metadata:
    name:
      Calculate workflow metadata

    runs-on:
      ubuntu-latest

    timeout-minutes:
      5

    outputs:
      short_sha:
        ${{ steps.metadata.outputs.short_sha }}

      source_ref:
        ${{ steps.metadata.outputs.source_ref }}

    steps:
      - name:
          Calculate metadata

        id:
          metadata

        working-directory:
          .

        run: |
          set -Eeuo pipefail

          short_sha="${GITHUB_SHA::7}"

          source_ref="${GITHUB_HEAD_REF:-${GITHUB_REF_NAME}}"

          echo "short_sha=${short_sha}" \
            >> "${GITHUB_OUTPUT}"

          echo "source_ref=${source_ref}" \
            >> "${GITHUB_OUTPUT}"

          {
            echo "## Workflow metadata"
            echo
            echo "- Event: ${GITHUB_EVENT_NAME}"
            echo "- Ref: ${source_ref}"
            echo "- Commit: ${GITHUB_SHA}"
          } >> "${GITHUB_STEP_SUMMARY}"
```

O job não precisa fazer checkout.

---

### 5. Criar job `verify`

Adicione:

```yaml
  verify:
    name:
      Verify Java project

    needs:
      - metadata

    runs-on:
      ubuntu-latest

    timeout-minutes:
      20

    steps:
      - name:
          Checkout repository

        uses:
          actions/checkout@v6

      - name:
          Set up Java 21

        uses:
          actions/setup-java@v5

        with:
          distribution:
            temurin

          java-version:
            "21"

          cache:
            maven

          cache-dependency-path:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml
```

---

### 6. Validar Java e Wrapper

Adicione:

```yaml
      - name:
          Validate Java and Maven Wrapper

        run: |
          set -Eeuo pipefail

          java -version

          test -f mvnw

          chmod +x mvnw

          ./mvnw \
            --version
```

A saída de `java -version` normalmente vai para stderr.

Isso não representa falha.

---

### 7. Executar Maven

Baseline:

```yaml
      - name:
          Run Maven verification

        run: |
          set -Eeuo pipefail

          ./mvnw \
            --batch-mode \
            --no-transfer-progress \
            clean \
            verify
```

O aprofundamento de phases e profiles ficará para a aula 520.

---

### 8. Publicar relatórios

Adicione depois do Maven:

```yaml
      - name:
          Upload Maven reports

        if:
          always()

        uses:
          actions/upload-artifact@v4

        with:
          name:
            maven-reports-${{ needs.metadata.outputs.short_sha }}

          path:
            |
              labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/surefire-reports/**
              labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/target/failsafe-reports/**

          if-no-files-found:
            warn

          retention-days:
            14
```

Observe que `path` é relativo ao workspace.

Ele não usa `defaults.run.working-directory`.

---

### 9. Adicionar summary do job

Antes ou depois do artifact:

```yaml
      - name:
          Write verification summary

        if:
          always()

        env:
          SHORT_SHA:
            ${{ needs.metadata.outputs.short_sha }}

        run: |
          {
            echo "## Java verification"
            echo
            echo "- Short SHA: ${SHORT_SHA}"
            echo "- Java: 21"
            echo "- Command: Maven clean verify"
            echo "- Reports: uploaded when available"
          } >> "${GITHUB_STEP_SUMMARY}"
```

Não insira valor secreto no summary.

---

### 10. Criar job final

Adicione:

```yaml
  workflow-summary:
    name:
      Final workflow summary

    needs:
      - metadata
      - verify

    if:
      always()

    runs-on:
      ubuntu-latest

    timeout-minutes:
      5

    steps:
      - name:
          Publish final summary

        env:
          VERIFY_RESULT:
            ${{ needs.verify.result }}

          SHORT_SHA:
            ${{ needs.metadata.outputs.short_sha }}

          SOURCE_REF:
            ${{ needs.metadata.outputs.source_ref }}

        run: |
          set -Eeuo pipefail

          {
            echo "## CI Foundation result"
            echo
            echo "- Ref: ${SOURCE_REF}"
            echo "- Commit: ${SHORT_SHA}"
            echo "- Verify: ${VERIFY_RESULT}"
          } >> "${GITHUB_STEP_SUMMARY}"

          if [[ "${VERIFY_RESULT}" != "success" ]]; then
            exit 1
          fi
```

Esse job garante uma conclusão clara.

---

### 11. Revisar o workflow completo

Confirme:

- indentação;
- triggers;
- permissions;
- concurrency;
- jobs;
- `needs`;
- paths;
- action versions;
- timeouts;
- outputs;
- summary;
- artifact.

---

### 12. Criar validação estrutural local

Arquivo:

```text
scripts/github-actions/validate-workflow-foundation.ps1
```

Responsabilidades:

1. confirmar arquivo;
2. confirmar diretório;
3. procurar tabs;
4. procurar `pull_request_target`;
5. confirmar permissions;
6. confirmar timeout;
7. confirmar concurrency;
8. confirmar action majors;
9. confirmar artifact;
10. confirmar ausência de secret literal.

A validação textual não substitui parser YAML.

---

### 13. Usar parser YAML quando disponível

O script pode utilizar uma ferramenta instalada no projeto ou container validado.

Não baixe executável arbitrário em runtime sem verificação.

Documente a opção escolhida.

---

### 14. Criar simulação local

Arquivo:

```text
simulate-workflow-commands.ps1
```

Ele executa:

- Java version;
- Wrapper version;
- Maven clean verify;
- localização dos relatórios;
- contagem de arquivos;
- summary local.

Ele não simula contexts do GitHub perfeitamente.

---

### 15. Criar verificação de segurança

Arquivo:

```text
verify-workflow-security.ps1
```

Verifique:

- `permissions`;
- ausência de `write-all`;
- ausência de `pull_request_target`;
- ausência de `secrets.*` em `run-name`;
- ausência de `echo` de secrets;
- actions permitidas;
- pinning policy;
- shell estrito;
- timeout.

---

### 16. Criar inspeção de artifacts

Arquivo:

```text
inspect-workflow-artifacts.ps1
```

Localmente, confirme quais relatórios seriam enviados.

Não inclua:

- secrets;
- `.env`;
- banco;
- volume;
- logs indiscriminados;
- dumps.

---

### 17. Criar política de triggers

Arquivo:

```text
WORKFLOW_TRIGGER_POLICY.md
```

Registre:

```text
pull_request:

valida antes do merge.

push main:

valida commit integrado.

workflow_dispatch:

reexecução manual
sem privilégio extra.
```

---

### 18. Criar política de permissions

Arquivo:

```text
WORKFLOW_PERMISSIONS.md
```

Baseline:

```text
contents: read.
```

Explique futuras permissões:

- packages write;
- id-token write;
- deployments write;
- security-events write.

Cada uma exigirá job específico.

---

### 19. Criar política de concurrency

Arquivo:

```text
WORKFLOW_CONCURRENCY.md
```

Explique:

- cancelamento em CI;
- serialização em deploy;
- chave por ref;
- diferença entre branch e environment;
- cuidado com rollback.

---

### 20. Criar documentação de contexts

Arquivo:

```text
WORKFLOW_CONTEXTS_AND_OUTPUTS.md
```

Inclua exemplos de:

- `github`;
- `needs`;
- `steps`;
- `env`;
- `vars`;
- `secrets`;
- outputs.

Explique o limite de dados não confiáveis.

---

### 21. Criar política de artifacts

Arquivo:

```text
WORKFLOW_ARTIFACTS.md
```

Defina:

- relatórios aceitos;
- nomes;
- retenção;
- paths;
- privacidade;
- ausência de secrets;
- comportamento em falha;
- download para investigação.

---

### 22. Criar pinning policy

Arquivo:

```text
ACTION_PINNING_POLICY.md
```

Fases:

```text
laboratório:

major auditada.

produção endurecida:

SHA completo.

atualização:

pull request automatizado
ou revisão manual.

evidência:

release notes,
diff,
resultado do workflow.
```

---

### 23. Criar matriz de testes

Arquivo:

```text
WORKFLOW_TEST_MATRIX.md
```

Cenários:

- pull request válido;
- pull request com teste falho;
- push main;
- dispatch manual;
- novo commit cancela execução antiga;
- artifact com relatórios;
- artifact sem relatórios;
- Maven falha;
- metadata falha;
- summary final falha;
- action indisponível;
- cache miss;
- cache hit.

---

### 24. Simular falha de teste

Altere temporariamente um teste.

Execute localmente.

Depois, faça push somente em uma branch de laboratório quando apropriado.

Observe:

- verify falha;
- upload artifact executa;
- summary final marca falha;
- check bloqueia merge quando obrigatório.

Restaure o teste.

---

### 25. Validar cancelamento

Em uma branch de laboratório:

1. faça push;
2. antes de terminar, faça novo push;
3. observe a execução anterior;
4. confirme política de concurrency.

Não use esse experimento em uma operação crítica.

---

### 26. Validar cache

Primeira execução:

```text
cache miss provável.
```

Execução seguinte com mesmo POM:

```text
cache hit possível.
```

O workflow precisa funcionar mesmo com cache miss.

---

### 27. Validar artifact

Na execução:

- abra Actions;
- selecione workflow;
- selecione run;
- verifique artifacts;
- valide nome;
- baixe;
- confira somente relatórios permitidos.

---

### 28. Validar logs

Procure:

- secret;
- token;
- paths locais sensíveis;
- stack trace;
- dados de teste;
- output excessivo.

Stack trace de teste pode ser necessário.

Dados sensíveis não.

---

### 29. Criar troubleshooting

Arquivo:

```text
WORKFLOW_TROUBLESHOOTING.md
```

Inclua:

- workflow não aparece;
- YAML inválido;
- trigger não dispara;
- path errado;
- working-directory incorreto;
- `mvnw` sem permissão;
- JDK incorreto;
- cache não restaura;
- artifact não encontra arquivos;
- job seguinte não recebe output;
- concurrency cancela execução;
- permission denied;
- action major incompatível;
- runner sem recurso;
- summary final falha.

---

### 30. Executar validação local

Execute:

```powershell
.\scripts\github-actions\validate-workflow-foundation.ps1

.\scripts\github-actions\verify-workflow-security.ps1

.\scripts\github-actions\simulate-workflow-commands.ps1

.\scripts\github-actions\inspect-workflow-artifacts.ps1
```

---

### 31. Revisar diff

```powershell
git status
git diff
git diff --check
```

Confirme:

- nenhum secret;
- nenhum env local;
- nenhuma credencial;
- nenhum artifact local;
- nenhum relatório gerado;
- apenas workflow, scripts e docs.

---

## Entendendo o que foi feito

### O blueprint virou workflow

A política da aula anterior ganhou sintaxe executável.

### Triggers ganharam objetivo

PR, main e execução manual ficaram explícitos.

### Permissions ficaram mínimas

O workflow de validação apenas lê o repositório.

### CI obsoleta pode ser cancelada

Novos commits substituem execuções antigas da mesma ref.

### Jobs ganharam dependências

`needs` transformou a execução em grafo.

### Outputs conectaram jobs

Metadados pequenos foram compartilhados sem filesystem.

### Cache acelerou Maven

A execução continua correta quando o cache não existe.

### Artifacts preservaram evidências

Relatórios ficam disponíveis mesmo em falhas.

### Summary melhorou leitura

A execução apresenta resultado consolidado.

### A próxima aula ganhou uma base real

O aprofundamento Maven acontecerá dentro de um workflow já estruturado.

---

## Erros comuns importantes

### Colocar workflow fora de `.github/workflows`

GitHub não registra o arquivo.

### Usar permissions amplas

O token ganha alcance desnecessário.

### Usar `pull_request_target` por conveniência

Código não confiável pode alcançar contexto privilegiado.

### Considerar jobs no mesmo filesystem

Cada job começa isolado.

### Usar output para arquivo grande

Outputs servem para valores pequenos.

### Usar cache como artifact

Evidências podem desaparecer.

### Fazer upload somente no sucesso

Relatórios de falha são perdidos.

### Usar `continue-on-error` no gate

O pipeline fica verde com falha real.

### Omitir timeout

Jobs podem ficar presos.

### Imprimir context completo

Dados desnecessários podem aparecer em logs.

### Fixar actions em tags sem política

Atualizações podem ocorrer sem revisão suficiente.

### Antecipar Pipeline Maven

A aula 520 aprofundará o lifecycle e os relatórios.

---

## Comandos úteis

### Validar workflow

```powershell
.\scripts\github-actions\validate-workflow-foundation.ps1
```

### Verificar segurança

```powershell
.\scripts\github-actions\verify-workflow-security.ps1
```

### Simular comandos

```powershell
.\scripts\github-actions\simulate-workflow-commands.ps1
```

### Inspecionar relatórios

```powershell
.\scripts\github-actions\inspect-workflow-artifacts.ps1
```

### Revisar diff

```powershell
git diff --check
git status
```

---

## Exercício guiado

### Parte 1 — Diretório

Crie `.github/workflows`.

### Parte 2 — Triggers

Configure PR, main e dispatch.

### Parte 3 — Segurança

Defina permissions e concurrency.

### Parte 4 — Metadata

Crie outputs.

### Parte 5 — Verify

Configure Java e Maven.

### Parte 6 — Cache

Ative cache Maven.

### Parte 7 — Artifact

Preserve relatórios.

### Parte 8 — Summary

Consolide o resultado.

### Parte 9 — Falha

Comprove artifact e fail.

### Parte 10 — Política

Documente pinning e segurança.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 518 foi preservada;
- GitHub Actions foi definido;
- workflow foi definido;
- diretório obrigatório foi explicado;
- extensão YAML foi explicada;
- `name` foi configurado;
- `run-name` foi configurado;
- `pull_request` foi configurado;
- push para main foi configurado;
- `workflow_dispatch` foi configurado;
- filtros de path foram discutidos;
- filtro de path não foi aplicado sem necessidade;
- permissions foram configuradas;
- `contents: read` foi usado;
- `GITHUB_TOKEN` foi explicado;
- concurrency foi configurada;
- grupo por workflow e ref foi usado;
- cancel-in-progress foi habilitado;
- diferença para deploy foi documentada;
- defaults.run foi configurado;
- shell bash foi definido;
- working-directory foi definido;
- actions não dependeram do working-directory;
- job metadata foi criado;
- runner foi definido;
- timeout foi definido;
- output short SHA foi criado;
- output source ref foi criado;
- `GITHUB_OUTPUT` foi usado;
- secrets não foram usados como outputs;
- summary de metadata foi criado;
- job verify foi criado;
- `needs` foi usado;
- checkout foi configurado;
- setup Java foi configurado;
- Java 21 foi usado;
- Temurin foi usado;
- cache Maven foi configurado;
- dependency path foi configurado;
- Maven Wrapper foi validado;
- Wrapper foi tornado executável;
- Maven version foi exibida;
- `clean verify` foi executado;
- batch mode foi usado;
- transfer progress foi reduzido;
- upload artifact foi configurado;
- artifact usa `if: always()`;
- artifact usa nome com short SHA;
- Surefire foi incluído;
- Failsafe foi incluído;
- if-no-files-found foi configurado;
- retention foi configurada;
- artifact não contém secrets;
- summary de verificação foi criado;
- job final foi criado;
- job final usa always;
- resultados de needs foram usados;
- job final falha quando verify falha;
- action versions atuais da aula foram usadas;
- política de SHA pinning foi criada;
- major tag foi diferenciada de SHA;
- job isolation foi explicado;
- outputs foram diferenciados de artifacts;
- cache foi diferenciado de artifact;
- contexts foram explicados;
- expressions foram explicadas;
- `pull_request_target` não foi usado;
- secrets de produção não foram usados;
- script de validação foi criado;
- tabs foram verificadas;
- permissions foram verificadas;
- timeout foi verificado;
- concurrency foi verificada;
- action allowlist foi discutida;
- parser YAML foi discutido;
- script de simulação foi criado;
- script de segurança foi criado;
- script de artifacts foi criado;
- trigger policy foi criada;
- permissions policy foi criada;
- concurrency policy foi criada;
- contexts documentation foi criada;
- artifact policy foi criada;
- pinning policy foi criada;
- test matrix foi criada;
- falha de teste foi simulada;
- verify falhou corretamente;
- artifact foi preservado;
- summary final indicou falha;
- cancelamento por novo commit foi validado;
- cache miss foi aceito;
- cache hit foi observado quando disponível;
- artifact foi inspecionado;
- logs foram revisados;
- troubleshooting foi criado;
- validação local foi executada;
- diff foi revisado;
- nenhum secret foi incluído;
- nenhum relatório local foi commitado;
- registry não foi usado;
- deploy não foi executado;
- Pipeline Maven não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 520 está correta.

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
  .github/workflows/ci-foundation.yml `
  scripts/github-actions `
  docs/devops/github-actions `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "ci(m17): criar fundacao do GitHub Actions"
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
- target;
- Surefire local;
- Failsafe local;
- artifact baixado;
- cache;
- logs;
- banco;
- volume;
- pipeline Maven aprofundado da aula 520.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o blueprint profissional ganhou seu primeiro workflow real.

O repositório passou a possuir:

```text
ci-foundation.yml;

triggers;

permissions;

concurrency;

metadata;

verify;

outputs;

cache;

artifacts;

summary.
```

Você comprovou que:

- workflows vivem em `.github/workflows`;
- eventos disparam execuções;
- permissions controlam o token;
- concurrency cancela CI obsoleta;
- jobs executam isoladamente;
- `needs` cria dependências;
- outputs transferem valores pequenos;
- artifacts transferem e preservam arquivos;
- cache acelera, mas não garante saída;
- Maven Wrapper reduz dependência do runner;
- relatórios precisam ser preservados na falha;
- summary melhora a investigação;
- pinning por SHA endurece o workflow;
- PR não precisa de secrets de produção.

A próxima aula será:

```text
520 - M17.15 - Pipeline Maven
```

Nela, você irá aprofundar o comando Maven, separar testes unitários e de integração, configurar relatórios, profiles, cache e gates próprios do build Java.

Nenhum Pipeline Maven aprofundado foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei o workflow no diretório correto.
- [ ] Configurei triggers.
- [ ] Apliquei permissions mínimas.
- [ ] Configurei concurrency.
- [ ] Criei jobs e outputs.
- [ ] Configurei JDK e cache.
- [ ] Preservei relatórios.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O workflow não aparece

Confirme diretório, branch e sintaxe YAML.

### O workflow não dispara no PR

Revise evento, target branch e configuração do repositório.

### O working-directory não funciona em uma action

`defaults.run` afeta steps `run`, não actions `uses`.

### `mvnw` retorna permission denied

Versione o bit executável ou execute `chmod +x`.

### O cache não restaura

Revise distribution, Java, POM e dependency path.

### O artifact diz que não encontrou arquivos

Os testes podem ter falhado antes de gerar relatórios ou o path está errado.

### O job final foi ignorado

Confirme `if: always()`.

### O output está vazio

Revise step `id`, `GITHUB_OUTPUT` e job outputs.

### A execução antiga não foi cancelada

Revise a chave de concurrency e a ref.

### O workflow não tem acesso de escrita

Esse é o comportamento esperado com `contents: read`.

### Uma action nova não roda no runner

Revise requisitos da major e atualização do runner.

### O summary contém dado sensível

Remova o dado, trate exposição e revise a policy.

---

## Perguntas de revisão

1. Onde workflows ficam?
2. O que faz `on`?
3. O que faz `permissions`?
4. O que é `GITHUB_TOKEN`?
5. O que faz `concurrency`?
6. O que faz `cancel-in-progress`?
7. O que é `runs-on`?
8. Jobs compartilham filesystem?
9. O que faz `needs`?
10. O que é step ID?
11. Para que serve `GITHUB_OUTPUT`?
12. O que é job output?
13. Para que serve setup-java?
14. Cache é artifact?
15. Para que serve upload-artifact?
16. Por que usar `always()`?
17. O que é step summary?
18. Por que pinning por SHA?
19. O que não foi aprofundado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `.github/workflows`.
2. Define eventos.
3. Limita o token.
4. Token temporário.
5. Controla execuções concorrentes.
6. Cancela execução anterior.
7. Seleciona runner.
8. Não.
9. Cria dependência.
10. Identificador do step.
11. Publicar output.
12. Valor para outro job.
13. Configurar JDK.
14. Não.
15. Preservar arquivos.
16. Executar mesmo após falha.
17. Markdown da execução.
18. Imutabilidade auditada.
19. Pipeline Maven.
20. Pipeline Maven.

---

## Desafio opcional

Adicione uma execução manual com input:

```text
full_validation.
```

Requisitos:

- input boolean;
- default false;
- somente `workflow_dispatch`;
- nenhuma permission extra;
- job adicional executa apenas quando true;
- timeout próprio;
- summary registra a escolha;
- nenhum secret;
- nenhum deploy;
- documentação e teste.

O objetivo é praticar inputs e condições sem antecipar o pipeline Maven completo.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 519 - M17.14 - GitHub Actions workflows

- Continuei após a visão profissional de CI/CD.
- Criei `.github/workflows/ci-foundation.yml`.
- Configurei nome e run-name.
- Configurei pull request.
- Configurei push para main.
- Configurei execução manual.
- Apliquei `contents: read`.
- Configurei concurrency por workflow e ref.
- Habilitei cancelamento de CI obsoleta.
- Defini Bash e working directory.
- Criei job de metadata.
- Publiquei short SHA e source ref como outputs.
- Usei `GITHUB_OUTPUT`.
- Criei summary de metadata.
- Criei job de verificação com `needs`.
- Usei checkout.
- Configurei Temurin JDK 21.
- Configurei cache Maven.
- Validei Maven Wrapper.
- Executei `clean verify`.
- Publiquei relatórios Surefire e Failsafe.
- Usei artifact com `always()`.
- Defini retenção.
- Criei summary da verificação.
- Criei job final com resultado consolidado.
- Diferenciei outputs, artifacts e cache.
- Documentei contexts e expressions.
- Mantive secrets produtivos fora do workflow.
- Não usei `pull_request_target`.
- Documentei pinning por SHA.
- Criei scripts de validação, segurança, simulação e artifacts.
- Simulei falha e preservei relatórios.
- Validei concurrency e cache.
- Não antecipei o Pipeline Maven aprofundado.
- Próxima aula: Pipeline Maven.
```

---

## Referência técnica curta

- GitHub Actions Workflow Syntax.
- GitHub Actions Jobs.
- GitHub Actions Contexts.
- GitHub Actions Expressions.
- GitHub Actions Permissions.
- GitHub Actions Concurrency.
- GitHub Actions Dependency Caching.
- GitHub Actions Artifacts.
- Building Java with Maven in GitHub Actions.
- Secure Use of Third-Party Actions.

Regra final:

```text
GitHub Actions workflows traduzem a arquitetura de CI/CD para processos executáveis em `.github/workflows`: `ci-foundation.yml` responde a pull requests, pushes em main e execução manual, utiliza `permissions: contents: read`, cancela CI obsoleta por concurrency e executa jobs isolados ligados por `needs`; metadata publica short SHA e source ref por `GITHUB_OUTPUT`, verify faz checkout, configura Temurin JDK 21, usa cache Maven e executa o Wrapper em batch mode, enquanto relatórios Surefire e Failsafe são enviados como artifact mesmo na falha e summaries consolidam evidências; outputs servem para valores pequenos, artifacts preservam arquivos e cache apenas acelera; timeouts impedem jobs presos, secrets de produção permanecem fora de PRs e actions seguem uma política que evolui de major auditada para SHA completo; com triggers, permissions, jobs, outputs e artifacts dominados, a aula 520 aprofundará o Pipeline Maven sem misturar deploy, registry ou promoção.
```
