# 524 - M17.19 - Secrets em pipeline

## Apresentação da aula

Na aula 523, você publicou a imagem validada no GitHub Container Registry.

O pipeline passou a usar:

```text
ghcr.io;

docker/login-action;

github.actor;

secrets.GITHUB_TOKEN;

packages: write;

packages: read;

digest;

pull autenticado;

runtime gates.
```

O uso do:

```text
GITHUB_TOKEN
```

foi controlado e restrito ao fluxo do GHCR.

Entretanto, pipelines reais precisam acessar outras credenciais.

Exemplos:

- senha de banco de homologação;
- token de API externa;
- chave de assinatura;
- credencial de cloud;
- webhook de notificação;
- client secret OAuth;
- certificado;
- chave SSH;
- token de observabilidade;
- credencial de registry privado;
- senha de proxy;
- chave de criptografia.

A pergunta central desta aula será:

```text
como permitir
que um pipeline
use credenciais

sem versioná-las,
sem imprimi-las,
sem distribuí-las
para todos os jobs
e sem mantê-las
por tempo indefinido?
```

A resposta exige mais do que:

```text
criar um secret
e referenciá-lo.
```

Um secret seguro precisa possuir ciclo de vida.

Esse ciclo inclui:

```text
criação;

armazenamento;

escopo;

autorização;

injeção;

uso;

mascaramento;

auditoria;

rotação;

revogação;

resposta a vazamento.
```

Nesta aula, você irá diferenciar:

```text
repository secret;

environment secret;

organization secret;

repository variable;

environment variable;

GITHUB_TOKEN;

credencial de longa duração;

credencial temporária;

OIDC.
```

O foco prático será GitHub Actions.

Serão criados fluxos seguros para:

- validar a presença de um secret;
- usar um secret em um step limitado;
- impedir o uso em pull request não confiável;
- mascarar valores derivados;
- evitar exposição em logs;
- impedir propagação para outros jobs;
- simular rotação;
- detectar uso incorreto;
- registrar apenas metadata não sensível.

A aula não criará credenciais reais de produção.

O laboratório utilizará nomes como:

```text
LAB_PROVIDER_TOKEN;

LAB_WEBHOOK_TOKEN;

LAB_DATABASE_PASSWORD.
```

Os valores serão cadastrados pelo usuário na interface do GitHub.

Nenhum valor será colocado:

- no Markdown;
- no YAML;
- no PowerShell;
- no Git;
- no artifact;
- no summary;
- no output;
- no Dockerfile;
- no build argument;
- no label OCI.

A regra central será:

```text
o pipeline deve saber
como usar o secret,

mas o repositório
não deve saber
qual é o valor.
```

Outro princípio será:

```text
secret não é configuração comum.
```

Exemplos de configuração não sensível:

```text
timeout;

nome do ambiente;

URL pública;

feature flag;

nome da imagem;

região;

batch size.
```

Esses valores podem usar:

```text
vars.
```

Exemplos sensíveis:

```text
senha;

token;

private key;

client secret;

connection string
com credencial.
```

Esses valores precisam usar:

```text
secrets.
```

A aula também mostrará que mascaramento não é criptografia.

Quando o GitHub reconhece o valor de um secret, ele tenta substituir ocorrências nos logs por:

```text
***.
```

Mas esse mecanismo possui limites.

Exemplos de risco:

- secret transformado;
- secret codificado;
- substring;
- JSON montado;
- certificado multilinha;
- valor derivado;
- arquivo copiado;
- stack trace;
- debug de shell;
- dump de environment;
- artifact;
- summary.

Por isso, a regra não será:

```text
pode imprimir
porque será mascarado.
```

A regra será:

```text
não imprimir.
```

Outro ponto importante será o escopo.

Um secret pode existir em:

#### Repositório

Disponível para workflows daquele repositório conforme as regras.

#### Organização

Pode ser compartilhado com repositórios selecionados ou permitidos.

#### Environment

Disponível apenas para jobs associados ao environment.

Environment secrets permitem combinar:

- proteção;
- aprovação;
- restrição por branch;
- separação entre ambientes;
- auditoria.

A próxima aula será:

```text
525 - M17.20 - Ambientes dev hml prod
```

Nela, você irá estruturar:

- desenvolvimento;
- homologação;
- produção;
- variáveis por ambiente;
- secrets por environment;
- proteção;
- promoção;
- approvals;
- naming;
- URLs;
- políticas.

Nesta aula, environments serão usados apenas o suficiente para demonstrar secret scope.

A arquitetura completa de dev, hml e prod ficará para a aula 525.

Outro tema será o uso de secrets em pull requests.

Em eventos:

```text
pull_request
```

originados do mesmo repositório, o comportamento depende das permissões e da configuração.

Em pull requests de forks, secrets sensíveis normalmente não são disponibilizados ao workflow.

Isso é uma proteção.

A equipe não deve contornar essa proteção copiando secrets para outros canais.

O evento:

```text
pull_request_target
```

executa no contexto da branch base.

Ele pode ter acesso privilegiado.

Executar código não confiável do pull request nesse contexto pode expor secrets.

A baseline não usará:

```text
pull_request_target.
```

Outro ponto será a diferença entre:

```text
secret como environment variable;

secret como input;

secret como arquivo;

secret como stdin;

secret mount.
```

A preferência depende da ferramenta.

#### Environment variable

Simples, mas pode vazar em dumps e subprocessos.

#### Input

Pode aparecer em metadata da ferramenta.

Precisa ser analisado.

#### Arquivo temporário

Útil para certificado ou chave multilinha.

Precisa de permissão restrita e cleanup.

#### Standard input

Evita argumento de linha de comando.

Exemplo:

```text
docker login --password-stdin.
```

#### Secret mount de build

BuildKit permite secrets temporários durante o build.

A aula não usará secret para construir a imagem porque o build atual não precisa.

O pipeline também evitará secrets em argumentos de comando.

Process lists podem expor argumentos.

Outro princípio será:

```text
um job recebe
somente o secret
necessário.
```

O job:

```text
maven-unit
```

não precisa de token do provider.

O job:

```text
maven-quality-gate
```

não precisa de senha de produção.

O job:

```text
ghcr-build-push
```

usa somente o token temporário do GitHub para o GHCR.

Um futuro job de deploy poderá receber secrets do environment correspondente.

A aula criará um workflow manual:

```text
secret-safety-lab.yml.
```

Esse workflow não fará deploy.

Ele será executado por:

```text
workflow_dispatch.
```

O job usará:

```text
environment:
  secret-lab.
```

Esse environment será apenas de laboratório.

O workflow receberá o secret:

```text
LAB_PROVIDER_TOKEN.
```

Ele validará:

- secret não vazio;
- tamanho mínimo;
- ausência em logs;
- uso por stdin ou header controlado;
- cleanup;
- metadata não sensível;
- falha quando ausente.

O laboratório utilizará um script local ou endpoint fake.

Nenhum token real será enviado para a internet.

O valor será comparado ou utilizado em um processo local.

A aula também demonstrará:

```text
::add-mask::
```

Esse comando permite mascarar um valor derivado.

Exemplo:

```bash
token_hash="$(
  printf '%s' "${LAB_PROVIDER_TOKEN}" \
    | sha256sum \
    | cut -d' ' -f1
)"

echo "::add-mask::${token_hash}"
```

O hash não é um secret equivalente em todos os contextos, mas pode ser metadata sensível.

A aula não imprimirá o token original.

Também não imprimirá o hash completo no summary.

Somente um identificador truncado poderá ser usado quando necessário.

Outro tema será a rotação.

Rotação significa substituir o secret sem alterar o código.

O runbook será:

```text
1. criar novo valor;

2. atualizar secret;

3. validar consumidor;

4. revogar valor anterior;

5. observar falhas;

6. registrar rotação.
```

Quando o provedor suporta dois valores simultâneos, a rotação pode ser feita sem downtime.

Quando não suporta, a janela precisa ser planejada.

A aula também criará um cenário de vazamento simulado.

Nenhum secret real será exposto.

O exercício utilizará uma string falsa:

```text
LAB_ONLY_FAKE_SECRET.
```

O objetivo será treinar:

1. interromper workflow;
2. remover valor do código;
3. revogar;
4. rotacionar;
5. revisar logs e artifacts;
6. invalidar caches quando aplicável;
7. registrar incidente;
8. adicionar prevenção.

A aula não ensinará a reescrever histórico Git em profundidade.

Será explicado que apagar o arquivo atual não remove o valor do histórico.

A resposta pode exigir:

- revogação imediata;
- rotação;
- secret scanning;
- remoção do histórico;
- notificação;
- auditoria.

Outro ponto será OIDC.

OIDC permite que o workflow troque uma identidade do GitHub por credenciais temporárias em um provedor compatível.

Conceitualmente:

```text
workflow;

token OIDC;

trust policy;

credencial temporária;

acesso limitado.
```

Isso reduz secrets de longa duração.

Entretanto, OIDC não será implementado nesta aula.

Ele será documentado como evolução.

A aula também diferenciará:

```text
masking;

redaction;

encryption at rest;

transport encryption;

authorization;

rotation.
```

Esses controles não são equivalentes.

Ao final, você deverá explicar:

```text
por que secrets
não entram no Git;

como escolher
repository,
organization
ou environment secret;

como vars diferem
de secrets;

por que masking
não autoriza logging;

por que forks
não recebem secrets;

por que pull_request_target
é perigoso;

como limitar
secret por job;

como criar
arquivo temporário seguro;

como rotacionar;

como responder
a um vazamento;

como OIDC
reduz credenciais estáticas.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
522:
Pipeline Docker build push.

523:
Registry GitHub Container Registry.

524:
Secrets em pipeline.

525:
Ambientes dev hml prod.

526:
Deploy automatico ambiente de homologacao.
```

A aula 523 respondeu:

```text
como autenticar
e publicar
uma imagem
no GHCR?
```

A aula 524 responderá:

```text
como controlar
todo o ciclo de vida
das credenciais
usadas pelo pipeline?
```

Nesta aula:

```text
repository secrets:
sim.

organization secrets:
sim.

environment secrets:
sim.

vars:
sim.

GITHUB_TOKEN:
sim.

masking:
sim.

add-mask:
sim.

secret em stdin:
sim.

arquivo temporário:
sim.

cleanup:
sim.

fork safety:
sim.

pull_request_target:
discutido.

rotação:
sim.

resposta a vazamento:
sim.

OIDC:
conceitual.

dev hml prod:
não estruturado.

deploy:
não.

cloud real:
não.
```

A regra central será:

```text
credenciais ficam
fora do código,
entram somente
no job necessário
e são revogáveis.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
.github/workflows/secret-safety-lab.yml

pipeline/secrets
├── secret-inventory.example.yaml
├── secret-policy.yaml
├── rotation-contract.yaml
└── incident-response-contract.yaml

scripts/secrets
├── validate-secret-name.ps1
├── test-secret-presence.ps1
├── create-temporary-secret-file.ps1
├── verify-secret-cleanup.ps1
├── scan-generated-artifacts-for-secrets.ps1
└── simulate-secret-rotation.ps1

docs/devops/secrets
├── PIPELINE_SECRET_ARCHITECTURE.md
├── SECRET_SCOPE_POLICY.md
├── SECRET_NAMING_POLICY.md
├── SECRET_INJECTION_POLICY.md
├── SECRET_MASKING_LIMITS.md
├── SECRET_ROTATION_RUNBOOK.md
├── SECRET_INCIDENT_RESPONSE.md
├── OIDC_MIGRATION_PLAN.md
├── SECRET_TEST_MATRIX.md
└── SECRET_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
inventário sem valores;

workflow manual;

environment de laboratório;

secret limitado a um job;

validação de presença;

uso seguro;

arquivo temporário;

cleanup;

scan de artifacts;

rotação simulada;

runbook de incidente;

plano OIDC.
```

Você irá:

1. confirmar a baseline;
2. criar inventário;
3. definir naming;
4. definir scopes;
5. definir secret lab;
6. criar workflow manual;
7. definir permissions;
8. associar environment;
9. validar presença;
10. evitar logs;
11. usar stdin;
12. mascarar derivado;
13. criar arquivo temporário;
14. restringir permissão do arquivo;
15. usar o arquivo;
16. remover o arquivo;
17. verificar cleanup;
18. publicar apenas evidências não sensíveis;
19. escanear artifacts;
20. simular secret ausente;
21. simular rotação;
22. simular vazamento falso;
23. criar resposta;
24. documentar OIDC;
25. criar scripts;
26. executar gate;
27. commitar;
28. preparar a aula 525.

---

## Conceito essencial

### Secret

Secret é um valor sensível necessário para autenticação, autorização, criptografia ou acesso.

---

### Repository secret

Escopo de um repositório.

Adequado quando:

- somente um repositório usa;
- não depende de environment;
- governança local é suficiente.

---

### Organization secret

Pode atender múltiplos repositórios.

Precisa de política de acesso restrita.

Não deve ser compartilhado com todos por padrão.

---

### Environment secret

Disponível para jobs vinculados a um environment.

Permite combinar secret com:

- approval;
- branch protection;
- deployment rules;
- auditoria.

---

### Variable

Valor não sensível.

No GitHub Actions:

```text
vars.
```

Não use secret para toda configuração.

Isso dificulta governança e debugging.

---

### `GITHUB_TOKEN`

Token temporário gerado para a execução.

As permissions precisam ser declaradas.

Ele não substitui toda credencial externa.

---

### Secret context

Uso:

```text
${{ secrets.NOME }}
```

O nome precisa ser conhecido.

Um secret ausente normalmente resulta em string vazia.

Por isso, valide presença.

---

### Environment context

Um secret pode ser colocado em:

```yaml
env:
  PROVIDER_TOKEN:
    ${{ secrets.LAB_PROVIDER_TOKEN }}
```

Isso torna o valor disponível aos processos do step ou job conforme o local.

Prefira escopo no step.

---

### Masking

O GitHub tenta mascarar secrets conhecidos.

Não dependa do masking para permitir impressão.

---

### `add-mask`

Permite registrar um valor para mascaramento.

Use antes de qualquer possível log.

---

### Standard input

Evita colocar o secret como argumento.

Exemplo:

```bash
printf '%s' "${TOKEN}" \
  | command --password-stdin
```

---

### Arquivo temporário

Use quando a ferramenta exige arquivo.

Regras:

- diretório temporário;
- permissão mínima;
- nome não sensível;
- cleanup em `trap`;
- nunca upload;
- nunca commit.

---

### Secret derivado

Pode continuar sensível.

Exemplos:

- base64;
- hash;
- fragmento;
- URL autenticada;
- JWT decodificado.

Não presuma que transformação remove sensibilidade.

---

### Rotation

Substituição controlada do valor.

Rotação precisa de owner, validade e confirmação.

---

### Revocation

Invalidação do valor anterior.

Deve ocorrer rapidamente após exposição.

---

### OIDC

Permite credenciais temporárias baseadas na identidade do workflow.

Exige trust policy no provedor.

---

### Least privilege

O secret precisa conceder somente o acesso necessário.

Escopo excessivo aumenta o impacto de vazamento.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Na raiz do repositório:

```powershell
git status
git diff --check
```

Valide o workflow do GHCR:

```powershell
.\scripts\github-actions\verify-workflow-security.ps1
```

---

### 2. Criar inventário de exemplo

Arquivo:

```text
pipeline/secrets/secret-inventory.example.yaml
```

Conteúdo:

```yaml
secrets:
  - name:
      LAB_PROVIDER_TOKEN

    scope:
      environment

    environment:
      secret-lab

    owner:
      platform-team

    consumer:
      secret-safety-lab

    rotation_days:
      30

    value:
      never-store-here
```

Substitua o campo `value` por:

```text
forbidden.
```

O inventário não contém valores.

---

### 3. Criar política

Arquivo:

```text
secret-policy.yaml
```

Inclua:

```yaml
policy:
  values_in_git:
    forbidden

  values_in_logs:
    forbidden

  values_in_artifacts:
    forbidden

  values_in_outputs:
    forbidden

  job_scope:
    required

  owner:
    required

  rotation:
    required

  incident_runbook:
    required
```

---

### 4. Criar environment de laboratório

Na interface do GitHub:

```text
Settings;

Environments;

New environment;

secret-lab.
```

Não crie ambiente produtivo nesta aula.

---

### 5. Cadastrar o secret

No environment:

```text
LAB_PROVIDER_TOKEN.
```

Use um valor falso exclusivo do laboratório.

Não use credencial real.

---

### 6. Criar workflow manual

Arquivo:

```text
.github/workflows/secret-safety-lab.yml
```

Baseline:

```yaml
name:
  Secret Safety Lab

run-name:
  Secret Safety Lab - ${{ github.actor }}

on:
  workflow_dispatch:

permissions:
  contents:
    read

concurrency:
  group:
    secret-safety-lab

  cancel-in-progress:
    false
```

---

### 7. Criar job seguro

```yaml
jobs:
  validate-secret-usage:
    name:
      Validate secret usage

    runs-on:
      ubuntu-latest

    timeout-minutes:
      10

    environment:
      secret-lab

    steps:
      - name:
          Checkout repository

        uses:
          actions/checkout@v6
```

Somente esse job recebe o environment secret.

---

### 8. Validar presença

```yaml
      - name:
          Validate secret presence

        env:
          LAB_PROVIDER_TOKEN:
            ${{ secrets.LAB_PROVIDER_TOKEN }}

        run: |
          set -Eeuo pipefail

          if [[ -z "${LAB_PROVIDER_TOKEN}" ]]; then
            echo "Required secret is not configured."
            exit 1
          fi

          if (( ${#LAB_PROVIDER_TOKEN} < 16 )); then
            echo "Secret does not satisfy the lab policy."
            exit 1
          fi
```

Não imprima o valor.

---

### 9. Registrar máscara derivada

```yaml
      - name:
          Register derived masks

        env:
          LAB_PROVIDER_TOKEN:
            ${{ secrets.LAB_PROVIDER_TOKEN }}

        run: |
          set -Eeuo pipefail

          token_hash="$(
            printf '%s' "${LAB_PROVIDER_TOKEN}" \
              | sha256sum \
              | cut -d' ' -f1
          )"

          token_prefix="$(
            printf '%s' "${token_hash}" \
              | cut -c1-12
          )"

          echo "::add-mask::${token_hash}"
          echo "::add-mask::${token_prefix}"

          echo "Derived identifiers were masked."
```

Não publique o prefixo.

---

### 10. Usar secret por stdin

Crie um script local de laboratório:

```text
scripts/secrets/test-secret-presence.ps1.
```

No Linux runner, use um script Bash auxiliar ou comando inline.

Exemplo conceitual:

```bash
printf '%s' "${LAB_PROVIDER_TOKEN}" \
  | ./scripts/secrets/fake-provider-login.sh \
      --token-stdin
```

O fake provider apenas verifica a entrada local.

---

### 11. Criar arquivo temporário

```yaml
      - name:
          Use secret through a temporary file

        env:
          LAB_PROVIDER_TOKEN:
            ${{ secrets.LAB_PROVIDER_TOKEN }}

        run: |
          set -Eeuo pipefail

          temp_dir="$(
            mktemp -d
          )"

          secret_file="${temp_dir}/provider-token"

          cleanup() {
            rm -f "${secret_file}"
            rmdir "${temp_dir}" 2>/dev/null || true
          }

          trap cleanup EXIT

          umask 077

          printf '%s' "${LAB_PROVIDER_TOKEN}" \
            > "${secret_file}"

          test -s "${secret_file}"

          file_mode="$(
            stat -c '%a' "${secret_file}"
          )"

          test "${file_mode}" = "600"

          ./scripts/secrets/fake-provider-login.sh \
            --token-file \
            "${secret_file}"
```

O script fake não imprime o conteúdo.

---

### 12. Verificar cleanup

Após o step, outro step não conhece o path local.

Para uma verificação controlada, grave apenas o diretório temporário em um arquivo não sensível ou realize toda a validação dentro do `trap`.

A regra principal é:

```text
cleanup sempre.
```

---

### 13. Criar evidence seguro

Gere:

```text
secret-safety-evidence.json.
```

Campos permitidos:

- workflow run;
- environment name;
- secret configured;
- length policy passed;
- stdin usage passed;
- temporary file mode passed;
- cleanup passed;
- artifact scan passed;
- timestamp.

Campos proibidos:

- valor;
- hash completo;
- prefixo;
- token;
- arquivo;
- base64.

---

### 14. Escanear evidence

Antes do upload:

```yaml
      - name:
          Scan evidence for forbidden content

        env:
          LAB_PROVIDER_TOKEN:
            ${{ secrets.LAB_PROVIDER_TOKEN }}

        run: |
          set -Eeuo pipefail

          if grep -Fq \
            "${LAB_PROVIDER_TOKEN}" \
            secret-safety-evidence.json; then
            echo "Secret found in evidence."
            exit 1
          fi
```

Não use `set -x`.

---

### 15. Publicar evidence

```yaml
      - name:
          Upload secret safety evidence

        uses:
          actions/upload-artifact@v4

        with:
          name:
            secret-safety-evidence-${{ github.run_number }}

          path:
            secret-safety-evidence.json

          if-no-files-found:
            error

          retention-days:
            7
```

A evidência possui retenção curta.

---

### 16. Criar summary

O summary inclui:

```text
environment;

presence check;

stdin check;

file permission;

cleanup;

artifact scan.
```

Não inclui valores ou identificadores derivados.

---

### 17. Criar naming policy

Arquivo:

```text
SECRET_NAMING_POLICY.md
```

Padrão:

```text
<DOMAIN>_<PURPOSE>_<TYPE>.
```

Exemplos:

```text
LAB_PROVIDER_TOKEN;

HML_DATABASE_PASSWORD;

PROD_OBSERVABILITY_API_KEY.
```

O prefixo do ambiente será aprofundado na aula 525.

---

### 18. Criar scope policy

Arquivo:

```text
SECRET_SCOPE_POLICY.md
```

Matriz:

```markdown
| Caso | Scope |
|---|---|
| Um repositório | Repository |
| Vários repositórios controlados | Organization |
| Deploy por ambiente | Environment |
| Token temporário GitHub | GITHUB_TOKEN |
```

---

### 19. Criar injection policy

Arquivo:

```text
SECRET_INJECTION_POLICY.md
```

Prioridade:

1. stdin;
2. file temporário;
3. environment variable de step;
4. input auditado;
5. nunca argumento visível;
6. nunca build arg persistente.

---

### 20. Documentar masking

Arquivo:

```text
SECRET_MASKING_LIMITS.md
```

Inclua:

- valor original;
- derivado;
- substring;
- encoding;
- multiline;
- shell trace;
- artifacts;
- summaries;
- contexts;
- `add-mask`.

---

### 21. Criar rotação simulada

Arquivo:

```text
simulate-secret-rotation.ps1
```

Use duas strings falsas:

```text
version A;

version B.
```

Valide:

- consumidor aceita A;
- secret troca para B;
- consumidor aceita B;
- A é rejeitada;
- nenhuma string vai ao Git.

---

### 22. Criar contrato de rotação

Arquivo:

```text
rotation-contract.yaml
```

Inclua:

- owner;
- provider;
- current version;
- next version;
- overlap;
- validation;
- revocation;
- rollback;
- evidence.

Sem valores.

---

### 23. Criar runbook de rotação

Arquivo:

```text
SECRET_ROTATION_RUNBOOK.md
```

Passos:

1. abrir mudança;
2. gerar novo valor;
3. cadastrar;
4. validar;
5. revogar anterior;
6. observar;
7. registrar;
8. encerrar.

---

### 24. Simular secret ausente

Remova temporariamente o secret do environment ou use um environment de teste sem valor.

Confirme:

- workflow falha cedo;
- nenhum step consumidor executa;
- nenhum valor é impresso;
- summary explica ausência.

Restaure.

---

### 25. Simular vazamento falso

Adicione temporariamente:

```text
LAB_ONLY_FAKE_SECRET
```

em um arquivo de laboratório não commitado.

Execute o scanner.

Confirme:

- gate falha;
- artifact não é publicado;
- runbook é acionado;
- arquivo é removido.

Não use um valor real.

---

### 26. Criar resposta a incidente

Arquivo:

```text
SECRET_INCIDENT_RESPONSE.md
```

Passos:

- classificar;
- revogar;
- rotacionar;
- bloquear workflow;
- revisar logs;
- revisar artifacts;
- revisar cache;
- revisar histórico;
- notificar;
- corrigir;
- prevenir;
- encerrar.

---

### 27. Criar contrato de incidente

Arquivo:

```text
incident-response-contract.yaml
```

Inclua:

- incident ID;
- secret name;
- scope;
- owner;
- detected at;
- revoked at;
- rotated at;
- affected workflows;
- affected artifacts;
- history cleanup;
- follow-up.

Sem valor.

---

### 28. Criar plano OIDC

Arquivo:

```text
OIDC_MIGRATION_PLAN.md
```

Inclua:

```text
provedor alvo;

trust policy;

subject;

audience;

environment;

branch;

permission id-token write;

credencial temporária;

remoção do secret estático;

rollback.
```

Não conceda `id-token: write` nesta aula.

---

### 29. Criar scanner de artifacts

Arquivo:

```text
scan-generated-artifacts-for-secrets.ps1
```

Parâmetros:

```text
-Path;

-ForbiddenValueFile.
```

O arquivo de valores fica fora do Git.

O script não imprime o valor encontrado.

Ele apenas informa arquivo e classificação.

---

### 30. Criar script de arquivo temporário

Arquivo:

```text
create-temporary-secret-file.ps1
```

Responsabilidades:

- criar path temporário;
- aplicar ACL restrita;
- escrever por stdin;
- retornar path somente ao processo;
- registrar cleanup;
- remover em finally.

No Windows, valide ACL.

No runner Linux, use `chmod 600`.

---

### 31. Criar verificação de cleanup

Arquivo:

```text
verify-secret-cleanup.ps1
```

Confirme que:

- arquivo não existe;
- diretório foi removido;
- nenhum processo mantém handle;
- nenhum artifact incluiu o path.

---

### 32. Criar test matrix

Arquivo:

```text
SECRET_TEST_MATRIX.md
```

Cenários:

- secret presente;
- secret ausente;
- secret curto;
- environment incorreto;
- job sem environment;
- stdin passa;
- arquivo 600;
- cleanup passa;
- cleanup falha;
- value em evidence;
- value em summary;
- value em artifact;
- derived value sem mask;
- fork PR;
- pull_request_target;
- rotação;
- revogação;
- falso vazamento;
- OIDC futuro.

---

### 33. Criar troubleshooting

Arquivo:

```text
SECRET_TROUBLESHOOTING.md
```

Inclua:

- secret vazio;
- nome incorreto;
- environment não associado;
- approval pendente;
- fork sem secret;
- masking não ocorre;
- multiline quebrado;
- arquivo com permissão ampla;
- cleanup falha;
- token em argument;
- artifact bloqueado;
- rotação quebra consumidor;
- secret revogado cedo;
- valor permanece no histórico;
- OIDC trust rejeita.

---

### 34. Executar validação local

Execute com valores falsos:

```powershell
.\scripts\secrets\validate-secret-name.ps1 `
  -Name `
  "LAB_PROVIDER_TOKEN"

.\scripts\secrets\simulate-secret-rotation.ps1

.\scripts\secrets\verify-secret-cleanup.ps1

.\scripts\secrets\scan-generated-artifacts-for-secrets.ps1
```

Nenhuma credencial real deve ser usada localmente.

---

### 35. Revisar workflows existentes

Confirme no:

```text
ci-foundation.yml
```

que:

- GITHUB_TOKEN não é impresso;
- package permissions estão limitadas;
- PR não publica;
- outputs não contêm token;
- artifacts não contêm Docker config.

---

### 36. Executar gate final

Execute:

```powershell
.\scripts\github-actions\verify-workflow-security.ps1

.\scripts\secrets\validate-secret-name.ps1 `
  -Name `
  "LAB_PROVIDER_TOKEN"

git diff --check
git status
```

No GitHub, execute manualmente:

```text
Secret Safety Lab.
```

Valide:

- environment;
- approval quando configurado;
- presence;
- stdin;
- file;
- cleanup;
- artifact;
- summary.

---

## Entendendo o que foi feito

### Secrets ganharam ciclo de vida

Criação, uso, rotação e revogação passaram a fazer parte da arquitetura.

### Configuração foi separada de credencial

`vars` e `secrets` receberam papéis distintos.

### O scope ficou explícito

Repository, organization e environment possuem usos diferentes.

### O job passou a receber somente o necessário

O secret não ficou global no workflow.

### A injeção ficou controlada

Stdin e arquivos temporários reduziram exposição.

### Masking ganhou limites claros

A equipe deixou de tratar `***` como garantia.

### Artifacts passaram por scan

Evidência não pode carregar o valor.

### Rotação virou processo

O valor pode mudar sem alterar o código.

### Incidente ganhou runbook

Vazamento exige revogação e auditoria, não apenas apagar arquivo.

### A próxima aula ganhou a base

Environment secrets serão distribuídos entre dev, hml e prod.

---

## Erros comuns importantes

### Commitar secret em `.env`

Git preserva histórico.

### Imprimir para testar masking

O valor pode escapar transformado.

### Definir secret no nível global

Todos os jobs recebem acesso desnecessário.

### Usar secret para config pública

Governança e debugging ficam ruins.

### Passar token como argumento

Process list e logs podem revelar.

### Fazer upload do arquivo temporário

O secret vira artifact.

### Usar `set -x`

O shell pode imprimir comandos e expansões.

### Confiar em base64

Encoding não protege segredo.

### Usar `pull_request_target` com checkout do PR

Código não confiável pode acessar contexto privilegiado.

### Rotacionar e não revogar

O valor antigo continua válido.

### Apagar arquivo e ignorar histórico

A exposição permanece.

### Antecipar ambientes completos

A aula 525 possui esse objetivo.

---

## Comandos úteis

### Criar secret no GitHub CLI

Exemplo conceitual:

```powershell
gh secret set `
  LAB_PROVIDER_TOKEN `
  --env `
  secret-lab
```

O valor deve ser fornecido por stdin ou prompt seguro.

### Listar nomes de secrets

```powershell
gh secret list `
  --env `
  secret-lab
```

A listagem não mostra valores.

### Executar workflow manual

```powershell
gh workflow run `
  secret-safety-lab.yml
```

### Ver runs

```powershell
gh run list `
  --workflow `
  secret-safety-lab.yml
```

### Revogar

A revogação real acontece no provedor que emitiu a credencial.

Remover o secret do GitHub não invalida automaticamente o token no provedor.

---

## Exercício guiado

### Parte 1 — Inventory

Liste secrets sem valores.

### Parte 2 — Scope

Escolha repository, organization ou environment.

### Parte 3 — Workflow

Crie execução manual.

### Parte 4 — Injection

Use stdin e arquivo temporário.

### Parte 5 — Masking

Proteja valores derivados.

### Parte 6 — Cleanup

Remova arquivo e valide.

### Parte 7 — Artifact

Escaneie evidências.

### Parte 8 — Rotation

Troque valor falso.

### Parte 9 — Incident

Simule vazamento falso.

### Parte 10 — OIDC

Planeje migração futura.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 523 foi preservada;
- secret foi definido;
- ciclo de vida foi definido;
- repository secret foi definido;
- organization secret foi definido;
- environment secret foi definido;
- variable foi diferenciada;
- GITHUB_TOKEN foi revisado;
- masking foi explicado;
- limites de masking foram explicados;
- `add-mask` foi explicado;
- stdin foi usado;
- arquivo temporário foi usado;
- permissões do arquivo foram restritas;
- cleanup foi criado;
- secret derivado foi tratado como sensível;
- rotation foi definida;
- revocation foi definida;
- OIDC foi explicado;
- least privilege foi aplicado;
- inventário foi criado sem valores;
- campo de valor foi proibido;
- policy foi criada;
- environment `secret-lab` foi criado;
- secret de laboratório foi cadastrado;
- credencial real não foi usada;
- workflow manual foi criado;
- workflow usa `workflow_dispatch`;
- permissions mínimas foram usadas;
- concurrency foi definida;
- job usa environment;
- secret ficou limitado ao job;
- presença foi validada;
- tamanho mínimo foi validado;
- valor não foi impresso;
- hash derivado foi mascarado;
- prefixo derivado foi mascarado;
- hash não foi publicado;
- stdin foi usado em fake provider;
- arquivo temporário foi criado;
- `umask 077` foi usado;
- modo 600 foi validado;
- trap de cleanup foi usado;
- script consumidor não imprimiu valor;
- evidence JSON foi criado;
- evidence não contém valor;
- evidence não contém hash;
- evidence não contém prefixo;
- evidence foi escaneado;
- artifact foi publicado;
- retenção curta foi usada;
- summary não contém secret;
- naming policy foi criada;
- scope policy foi criada;
- injection policy foi criada;
- masking doc foi criado;
- rotação foi simulada;
- versão A foi aceita;
- versão B foi aceita;
- versão A foi revogada;
- nenhum valor foi commitado;
- rotation contract foi criado;
- rotation runbook foi criado;
- secret ausente foi simulado;
- workflow falhou cedo;
- consumidor não executou;
- vazamento falso foi simulado;
- scanner bloqueou artifact;
- incident response foi criado;
- incident contract foi criado;
- histórico Git foi discutido;
- revogação imediata foi documentada;
- OIDC plan foi criado;
- `id-token: write` não foi concedido;
- scanner de artifacts foi criado;
- arquivo de valores ficou fora do Git;
- scanner não imprime valor;
- script de arquivo temporário foi criado;
- ACL Windows foi discutida;
- chmod Linux foi discutido;
- script de cleanup foi criado;
- test matrix foi criada;
- fork PR foi discutido;
- secrets não foram liberados para forks;
- pull_request_target não foi usado;
- troubleshooting foi criado;
- validação local usou valores falsos;
- workflows existentes foram revisados;
- GHCR token não foi impresso;
- outputs não possuem token;
- Docker config não virou artifact;
- workflow manual foi executado;
- environment foi validado;
- stdin foi validado;
- file permission foi validada;
- cleanup foi validado;
- artifact foi validado;
- config completa de dev hml prod não foi antecipada;
- deploy não foi executado;
- secret de cloud real não foi usado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 525 está correta.

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
  .github/workflows/secret-safety-lab.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline/secrets `
  scripts/secrets `
  docs/devops/secrets `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure padrões sensíveis:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "token|password|secret|private.key"
```

Analise cada ocorrência.

Os nomes podem ser legítimos.

Valores não.

Commit recomendado:

```powershell
git commit -m "ci(m17): proteger secrets no pipeline"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- password;
- private key;
- certificado;
- `.env`;
- Docker config;
- arquivo temporário;
- evidence local;
- hash de secret;
- prefixo de secret;
- secret inventory real;
- credencial de cloud;
- configuração completa de ambientes da aula 525.

---

## Fechamento e ponte para a próxima aula

Nesta aula, credenciais deixaram de ser apenas campos do workflow.

O pipeline passou a considerar:

```text
inventário;

scope;

injeção;

masking;

cleanup;

artifact scan;

rotação;

revogação;

incidente;

OIDC.
```

Você comprovou que:

- secrets não entram no Git;
- variables atendem configuração não sensível;
- repository, organization e environment possuem escopos diferentes;
- o secret deve ficar no job necessário;
- masking não autoriza logging;
- stdin evita argumento visível;
- arquivos temporários exigem permissão e cleanup;
- derivação não elimina sensibilidade;
- pull requests de forks não devem receber credenciais;
- `pull_request_target` exige extremo cuidado;
- artifacts precisam ser escaneados;
- rotação precisa revogar o valor anterior;
- apagar arquivo não remove histórico;
- OIDC pode reduzir secrets estáticos.

A próxima aula será:

```text
525 - M17.20 - Ambientes dev hml prod
```

Nela, você irá distribuir configurações, variables, secrets, proteção e promoção entre ambientes distintos.

Nenhuma arquitetura completa de ambientes dev, hml e prod foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei inventário sem valores.
- [ ] Defini scopes.
- [ ] Criei environment de laboratório.
- [ ] Limitei o secret ao job.
- [ ] Usei stdin e arquivo temporário.
- [ ] Validei cleanup.
- [ ] Simulei rotação e incidente.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O secret chega vazio

Revise nome, scope, environment e evento.

### O job aguarda indefinidamente

O environment pode exigir approval.

### O valor não aparece mascarado

Não imprima; revise transformação e `add-mask`.

### O arquivo fica com modo amplo

Aplique `umask` antes de criar.

### O arquivo não é removido

Use `trap` ou `finally`.

### O artifact é bloqueado

O scanner encontrou padrão ou valor proibido.

### O workflow de fork não recebe secret

Esse comportamento protege o repositório.

### A rotação quebra a integração

O consumidor pode não aceitar overlap ou o valor anterior foi revogado cedo.

### O secret foi apagado do GitHub

Isso não significa que foi revogado no provedor.

### O valor continua no histórico Git

Revogue primeiro e execute procedimento de remoção de histórico.

### OIDC retorna acesso negado

Revise subject, audience, branch, environment e trust policy.

### Dev, hml e prod foram configurados

Remova a antecipação e preserve para a aula 525.

---

## Perguntas de revisão

1. O que é secret?
2. O que é repository secret?
3. O que é organization secret?
4. O que é environment secret?
5. Qual a diferença entre vars e secrets?
6. Masking é criptografia?
7. Para que serve `add-mask`?
8. Por que usar stdin?
9. Quando usar arquivo temporário?
10. O que é rotação?
11. O que é revogação?
12. O que é least privilege?
13. Por que forks não recebem secrets?
14. Qual o risco de `pull_request_target`?
15. Base64 protege secret?
16. Por que escanear artifacts?
17. Apagar arquivo remove histórico?
18. O que é OIDC?
19. O que não foi estruturado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Valor sensível.
2. Escopo do repositório.
3. Compartilhado controladamente.
4. Escopo de environment.
5. Sensibilidade.
6. Não.
7. Mascarar derivado.
8. Evitar argumento.
9. Quando ferramenta exige.
10. Substituir valor.
11. Invalidar valor.
12. Menor acesso necessário.
13. Código não confiável.
14. Contexto privilegiado.
15. Não.
16. Evitar vazamento.
17. Não.
18. Identidade temporária.
19. Dev, hml e prod.
20. Ambientes dev hml prod.

---

## Desafio opcional

Modele um secret multilinha.

Requisitos:

- certificado falso;
- environment secret;
- arquivo temporário;
- permissão restrita;
- validação de formato;
- uso local fake;
- cleanup;
- nenhum log;
- nenhum artifact;
- rotação simulada;
- nenhum certificado real.

O objetivo é praticar valores multilinha sem antecipar deploy ou cloud.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 524 - M17.19 - Secrets em pipeline

- Continuei após a publicação no GHCR.
- Diferenciei secrets e variables.
- Estudei repository, organization e environment secrets.
- Revisei o `GITHUB_TOKEN`.
- Modelei o ciclo de vida de credenciais.
- Criei inventário de secrets sem valores.
- Criei policy de secrets.
- Criei o environment `secret-lab`.
- Cadastrei um secret falso de laboratório.
- Criei workflow manual.
- Limitei permissions.
- Limitei o secret a um único job.
- Validei presença e tamanho sem imprimir o valor.
- Usei `add-mask` para valores derivados.
- Usei secret por stdin.
- Criei arquivo temporário com permissão restrita.
- Usei `trap` para cleanup.
- Criei evidence JSON sem valor, hash ou prefixo.
- Escaneei evidence antes do upload.
- Publiquei artifact com retenção curta.
- Criei policies de naming, scope, injection e masking.
- Simulei rotação entre valores falsos.
- Criei contrato e runbook de rotação.
- Simulei secret ausente.
- Simulei vazamento falso.
- Criei resposta a incidente.
- Documentei revogação e histórico Git.
- Criei plano de migração para OIDC.
- Não concedi `id-token: write`.
- Criei scripts de scanner, arquivo temporário e cleanup.
- Revisei os workflows existentes.
- Mantive secrets fora de outputs, artifacts e logs.
- Não antecipei ambientes dev, hml e prod.
- Próxima aula: Ambientes dev hml prod.
```

---

## Referência técnica curta

- GitHub Actions Encrypted Secrets.
- GitHub Actions Variables.
- GitHub Environments.
- `GITHUB_TOKEN`.
- GitHub Actions Workflow Commands.
- Secret Masking.
- Least Privilege.
- Credential Rotation.
- Secret Incident Response.
- OpenID Connect for Workflows.

Regra final:

```text
secrets em pipeline exigem ciclo de vida e menor privilégio: valores nunca entram no Git, logs, outputs, summaries, labels, build args ou artifacts; repository, organization e environment secrets são escolhidos conforme o escopo, enquanto `vars` armazenam apenas configuração não sensível e `GITHUB_TOKEN` mantém permissions explícitas; o workflow manual `secret-safety-lab` associa um único job ao environment, valida presença sem imprimir, usa stdin ou arquivo temporário com permissão restrita, registra máscaras para derivados, executa cleanup e escaneia evidence antes do upload; pull requests de forks permanecem sem credenciais e `pull_request_target` não é usado para executar código não confiável; rotação substitui e revoga valores, incidentes exigem bloqueio, auditoria de logs, artifacts e histórico, e apagar um arquivo não encerra a exposição; OIDC é planejado para reduzir credenciais estáticas, sem ser implementado antecipadamente; com o uso seguro dominado, a aula 525 distribuirá variables, secrets, proteção e promoção entre ambientes dev, hml e prod.
```
