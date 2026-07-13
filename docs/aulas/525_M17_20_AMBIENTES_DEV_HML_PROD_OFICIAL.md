# 525 - M17.20 - Ambientes dev hml prod

## Apresentação da aula

Na aula 524, você tratou secrets como recursos com ciclo de vida.

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

Você também diferenciou:

```text
repository secret;

organization secret;

environment secret;

repository variable;

environment variable;

GITHUB_TOKEN.
```

Essa base permite responder à próxima pergunta:

```text
como distribuir
configuração,
credenciais,
proteções
e promoção

entre ambientes
com objetivos diferentes?
```

A resposta desta aula será a construção explícita de:

```text
dev;

hml;

prod.
```

Os três ambientes não serão tratados apenas como nomes.

Cada um possuirá:

- finalidade;
- fonte do artefato;
- configuração;
- secrets;
- permissions;
- protection rules;
- concurrency;
- approval;
- janela;
- observabilidade;
- critérios de entrada;
- critérios de saída;
- rollback target;
- evidências.

A regra central será:

```text
o mesmo artefato
atravessa os ambientes;

configuração e autorização
mudam por ambiente.
```

A imagem validada e publicada no GHCR não será reconstruída.

O pipeline usará uma referência imutável:

```text
ghcr.io/owner/image@sha256:...
```

Essa referência será promovida de:

```text
dev
para
hml
para
prod.
```

O processo não utilizará:

```text
build em dev;

novo build em hml;

outro build em prod.
```

Isso violaria:

```text
build once,
promote many.
```

Se o artefato muda entre ambientes, a evidência de homologação deixa de representar o conteúdo produtivo.

Nesta aula, os ambientes serão modelados no GitHub Actions por:

```text
GitHub Environments.
```

Serão criados:

```text
dev;

hml;

prod.
```

Cada environment poderá possuir:

- variables;
- secrets;
- reviewers;
- branch restrictions;
- deployment history;
- URL;
- regras de proteção.

A configuração exata depende do plano e das opções disponíveis no repositório.

A aula documentará a intenção operacional mesmo quando alguma proteção da interface não estiver disponível para a conta usada no laboratório.

O environment:

```text
dev
```

terá foco em velocidade e validação integrada.

O environment:

```text
hml
```

terá foco em homologação, integração com dependências controladas e aprovação de negócio ou QA quando aplicável.

O environment:

```text
prod
```

terá foco em segurança, previsibilidade, menor privilégio, mudança controlada e observação.

A aula não criará infraestrutura real.

Não serão provisionados:

- máquinas virtuais;
- cluster;
- load balancer;
- banco;
- DNS;
- cloud;
- rede;
- storage;
- Kubernetes;
- Terraform;
- Pulumi;
- CloudFormation;
- Ansible.

A próxima aula será:

```text
526 - M17.21 - Infraestrutura como codigo conceitual
```

Portanto, esta aula modelará o contrato dos ambientes sem antecipar o provisionamento como código.

O laboratório criará um workflow:

```text
.github/workflows/environment-promotion.yml.
```

Esse workflow receberá:

```text
target_environment;

image_reference;

release_reason.
```

A execução será manual.

O workflow validará:

- environment permitido;
- referência por digest;
- ordem de promoção;
- configuração obrigatória;
- secrets obrigatórios;
- proteção do ambiente;
- concorrência;
- evidência anterior;
- rollback target;
- health contract;
- summary.

Ele não fará deploy em infraestrutura externa.

Em vez disso, produzirá um:

```text
deployment manifest.
```

Esse manifest representará exatamente o que um futuro job de deploy consumirá.

Exemplo:

```json
{
  "environment": "hml",
  "imageReference": "ghcr.io/owner/image@sha256:...",
  "applicationPort": 8084,
  "releaseColor": "candidate",
  "databaseHost": "hml-database.internal",
  "observabilityEnabled": true,
  "rollbackReference": "ghcr.io/owner/image@sha256:..."
}
```

O arquivo não conterá:

- senha;
- token;
- private key;
- connection string com credencial;
- conteúdo de secret.

Ele conterá somente:

- nomes;
- referências;
- valores não sensíveis;
- indicadores de presença.

O workflow também criará evidências por ambiente.

Exemplos:

```text
environment-dev-evidence.json;

environment-hml-evidence.json;

environment-prod-evidence.json.
```

Cada evidência registrará:

- environment;
- commit;
- image digest;
- source environment;
- target environment;
- configuration hash;
- secret presence checks;
- approval result;
- rollback reference;
- timestamp;
- run ID;
- result.

Outro princípio será:

```text
configuração precisa
ser compatível
com o artefato.
```

A aplicação utilizará variáveis como:

```text
APP_PUBLIC_URL;

APP_RELEASE_COLOR;

APP_LOG_LEVEL;

APP_OBSERVABILITY_ENABLED;

APP_RATE_LIMIT_ENABLED;

APP_PROVIDER_MODE;

APP_DATABASE_HOST;

APP_KAFKA_BOOTSTRAP_SERVERS.
```

Esses nomes são exemplos do laboratório.

Nenhum valor sensível será colocado em `vars`.

Secrets como:

```text
APP_DATABASE_PASSWORD;

APP_PROVIDER_TOKEN;

APP_OBSERVABILITY_API_KEY
```

ficarão em:

```text
secrets.
```

A aula também diferenciará:

```text
configuração por ambiente;

feature flag;

secret;

artefato.
```

#### Configuração por ambiente

Representa diferenças operacionais.

Exemplos:

- URL;
- nível de log;
- endpoints;
- limites;
- região;
- modo de provider.

#### Feature flag

Controla comportamento liberado ou não.

Ela pode variar por ambiente, mas não deve ser usada para esconder configuração essencial ausente.

#### Secret

Protege credenciais.

#### Artefato

É o mesmo conteúdo promovido.

Outro ponto será a ordem de promoção.

A baseline será:

```text
dev
depois
hml
depois
prod.
```

O workflow não aceitará:

```text
direto para prod
sem evidência de hml.
```

Uma exceção de emergência precisaria de política própria.

Ela não será implementada nesta aula.

O pipeline também trabalhará com:

```text
promotion evidence.
```

A evidência do ambiente anterior será um input obrigatório.

Para promover a prod, a execução precisa referenciar:

- digest homologado;
- run de hml;
- resultado de hml;
- rollback target;
- motivo;
- approver quando configurado.

A proteção não dependerá apenas de uma string escrita pelo operador.

O workflow validará a estrutura da evidência.

Nesta aula, a evidência será fornecida como artifact baixado de uma execução anterior ou como arquivo versionado de exemplo para testes locais.

No GitHub Actions, o download entre execuções exige uma estratégia explícita.

Para manter o laboratório controlado, o workflow aceitará também:

```text
source_run_id.
```

Um script poderá usar GitHub CLI ou API autenticada para obter o artifact correspondente.

A implementação completa de download cross-run não será obrigatória para concluir a aula.

O contrato e a validação serão criados.

Outro tema será o environment URL.

Cada environment poderá possuir uma URL não sensível:

```text
DEV_PUBLIC_URL;

HML_PUBLIC_URL;

PROD_PUBLIC_URL.
```

No workflow, o job poderá declarar:

```yaml
environment:
  name:
    ${{ inputs.target_environment }}

  url:
    ${{ steps.environment_metadata.outputs.public_url }}
```

A URL aparecerá no histórico de deployment.

Não coloque token em URL.

A aula também definirá concorrência por ambiente.

Exemplos:

```text
environment-dev;

environment-hml;

environment-prod.
```

Um ambiente não deve receber duas promoções simultâneas.

A política será:

```yaml
concurrency:
  group:
    environment-${{ inputs.target_environment }}

  cancel-in-progress:
    false
```

Para deploy, não será utilizado cancelamento automático.

Cancelar uma promoção no meio pode deixar o destino em estado intermediário.

Outro ponto será a diferença entre:

```text
branch protection;

environment protection;

workflow condition;

approval.
```

#### Branch protection

Protege integração do código.

#### Environment protection

Protege acesso e deployment ao ambiente.

#### Workflow condition

Controla se um job executa.

#### Approval

Representa autorização humana quando configurada.

Esses controles se complementam.

Nenhum deles substitui todos os demais.

A aula também criará uma matriz de ambientes.

Exemplo:

```text
dev:

aprovação:
não.

source:
main.

secrets:
dev.

observação:
curta.

hml:

aprovação:
QA ou owner.

source:
dev aprovado.

secrets:
hml.

observação:
funcional.

prod:

aprovação:
responsável definido.

source:
hml aprovado.

secrets:
prod.

observação:
reforçada.
```

Os nomes dos responsáveis não serão inventados.

O documento usará papéis.

Outro princípio será:

```text
produção não recebe
configuração de desenvolvimento.
```

Erros comuns incluem:

- log debug em prod;
- endpoint fake em prod;
- banco de dev em hml;
- secret de hml em prod;
- URL pública incorreta;
- rate limit desabilitado;
- provider sandbox em prod;
- telemetry desligada;
- feature flag divergente sem registro.

O workflow terá gates para detectar valores incompatíveis.

Exemplo:

```text
prod:

APP_LOG_LEVEL
não pode ser DEBUG.

APP_PROVIDER_MODE
não pode ser sandbox.

APP_DATABASE_HOST
não pode conter dev ou hml.

APP_PUBLIC_URL
precisa usar HTTPS.

rollback reference
é obrigatória.
```

Essas regras serão documentadas como policy do laboratório.

Elas não substituem validação da infraestrutura real.

A aula também tratará de drift.

Drift é divergência entre:

- configuração esperada;
- configuração aplicada;
- configuração observada.

Sem infraestrutura real, o laboratório validará:

```text
expected manifest
contra
recorded manifest.
```

Um hash SHA-256 do manifest não sensível será registrado.

Esse hash não contém secrets.

Ele ajuda a detectar alteração de configuração.

A próxima aula de infraestrutura como código aprofundará como reduzir drift de recursos.

Nesta aula, o foco é o contrato da aplicação e do pipeline.

Ao final, você deverá explicar:

```text
por que os ambientes
não são apenas nomes;

como manter
o mesmo digest;

como separar
vars e secrets;

como environment protection
difere de branch protection;

por que prod
não cancela promoção
automaticamente;

como a promoção
depende de evidência;

como definir
rollback target;

como registrar
configuration hash;

como impedir
configuração incompatível;

o que ficará
para infraestrutura como código.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
523:
Registry GitHub Container Registry.

524:
Secrets em pipeline.

525:
Ambientes dev hml prod.

526:
Infraestrutura como codigo conceitual.

527:
Terraform fundamentos.
```

A aula 524 respondeu:

```text
como usar,
rotacionar
e revogar
secrets no pipeline?
```

A aula 525 responderá:

```text
como distribuir
artefato,
configuração,
secrets
e proteção

entre dev,
hml
e prod?
```

Nesta aula:

```text
GitHub Environments:
sim.

dev:
sim.

hml:
sim.

prod:
sim.

variables:
sim.

environment secrets:
sim.

protection rules:
sim.

approvals:
sim.

branch restrictions:
sim.

concurrency:
sim.

promotion:
sim.

immutable digest:
sim.

rollback reference:
sim.

evidence:
sim.

configuration hash:
sim.

environment URL:
sim.

drift:
conceitual.

infraestrutura:
não provisionada.

Terraform:
não.

Kubernetes:
não.

deploy real:
não.
```

A regra central será:

```text
o ambiente muda
configuração e autorização;

o artefato promovido
permanece o mesmo.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados:

```text
.github/workflows/environment-promotion.yml

pipeline/environments
├── environment-catalog.yaml
├── promotion-policy.yaml
├── configuration-contract.yaml
├── protection-policy.yaml
└── rollback-policy.yaml

environments
├── dev
│   └── application.env.example
├── hml
│   └── application.env.example
└── prod
    └── application.env.example

scripts/environments
├── validate-environment-name.ps1
├── validate-environment-config.ps1
├── render-deployment-manifest.ps1
├── calculate-config-hash.ps1
├── validate-promotion-order.ps1
├── verify-promotion-evidence.ps1
└── simulate-environment-promotion.ps1

docs/devops/environments
├── ENVIRONMENT_ARCHITECTURE.md
├── ENVIRONMENT_CATALOG.md
├── ENVIRONMENT_VARIABLE_POLICY.md
├── ENVIRONMENT_SECRET_POLICY.md
├── ENVIRONMENT_PROTECTION_POLICY.md
├── PROMOTION_RUNBOOK.md
├── ROLLBACK_BY_ENVIRONMENT.md
├── CONFIGURATION_DRIFT_POLICY.md
├── ENVIRONMENT_TEST_MATRIX.md
└── ENVIRONMENT_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
catálogo de ambientes;

configuração de exemplo;

vars por environment;

secrets por environment;

workflow de promoção;

digest imutável;

ordem dev-hml-prod;

proteções;

manifest;

hash;

evidência;

rollback target.
```

Você irá:

1. confirmar a baseline;
2. criar catálogo;
3. definir dev;
4. definir hml;
5. definir prod;
6. criar examples;
7. separar vars e secrets;
8. cadastrar environments;
9. cadastrar variables;
10. cadastrar secrets falsos;
11. definir protection rules;
12. definir approvals;
13. definir branch restrictions;
14. criar workflow manual;
15. validar environment;
16. validar digest;
17. validar ordem;
18. carregar vars;
19. validar secrets;
20. renderizar manifest;
21. calcular hash;
22. criar evidence;
23. publicar artifact;
24. configurar environment URL;
25. configurar concurrency;
26. simular dev;
27. simular hml;
28. simular prod;
29. simular configuração inválida;
30. simular promoção fora da ordem;
31. documentar rollback;
32. criar scripts;
33. executar gate;
34. commitar;
35. preparar a aula 526.

---

## Conceito essencial

### Environment

Environment é uma fronteira operacional.

Ele agrupa:

- configuração;
- credenciais;
- autorização;
- histórico;
- risco;
- observação.

---

### Development

Ambiente para integração frequente.

Prioriza:

- feedback;
- velocidade;
- diagnóstico;
- dados controlados.

Não deve usar dados ou secrets de produção.

---

### Homologation

Ambiente para validar comportamento próximo do real.

Prioriza:

- integração;
- aceite;
- compatibilidade;
- migração;
- observação;
- aprovação.

---

### Production

Ambiente que atende o uso real.

Prioriza:

- disponibilidade;
- segurança;
- rastreabilidade;
- menor privilégio;
- rollback;
- mudança controlada.

---

### Promotion

Promotion move a mesma identidade de artefato para o próximo ambiente.

Não é rebuild.

---

### Environment variable

Configuração não sensível disponibilizada ao job ou aplicação.

No GitHub, pode ser armazenada em:

```text
vars.
```

---

### Environment secret

Credencial sensível ligada ao environment.

Somente jobs associados ao environment podem recebê-la conforme as regras.

---

### Protection rule

Regra que precisa ser satisfeita antes de liberar o job.

Exemplos:

- reviewer;
- wait timer;
- branch restriction.

A disponibilidade depende da configuração da conta.

---

### Environment URL

URL pública ou operacional associada à execução.

Não contém credencial.

---

### Promotion evidence

Registro que prova o resultado do ambiente anterior.

Inclui digest, resultado, checks e timestamp.

---

### Rollback reference

Digest conhecido para retorno.

Precisa existir antes da promoção.

---

### Configuration hash

Hash de conteúdo não sensível do manifest.

Ajuda a identificar drift.

---

### Drift

Diferença entre estado esperado e observado.

Nesta aula, será aplicado ao manifest.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Na raiz do repositório:

```powershell
git status
git diff --check
```

Valide a referência GHCR usada no laboratório:

```powershell
.\scripts\ghcr\validate-ghcr-reference.ps1
```

---

### 2. Criar catálogo

Arquivo:

```text
pipeline/environments/environment-catalog.yaml
```

Conteúdo:

```yaml
environments:
  dev:
    order: 1
    source: main
    approval: false
    observation_minutes: 5

  hml:
    order: 2
    source: dev
    approval: true
    observation_minutes: 15

  prod:
    order: 3
    source: hml
    approval: true
    observation_minutes: 30
```

Os tempos são didáticos.

---

### 3. Criar política de promoção

Arquivo:

```text
promotion-policy.yaml
```

Inclua:

```yaml
promotion:
  immutable_digest:
    required

  order:
    - dev
    - hml
    - prod

  rebuild:
    forbidden

  rollback_reference:
    required

  evidence:
    required
```

---

### 4. Criar contrato de configuração

Arquivo:

```text
configuration-contract.yaml
```

Defina variables obrigatórias:

```yaml
variables:
  required:
    - APP_PUBLIC_URL
    - APP_LOG_LEVEL
    - APP_PROVIDER_MODE
    - APP_OBSERVABILITY_ENABLED
    - APP_DATABASE_HOST
    - APP_KAFKA_BOOTSTRAP_SERVERS

secrets:
  required:
    - APP_DATABASE_PASSWORD
    - APP_PROVIDER_TOKEN
```

Nenhum valor entra no contrato.

---

### 5. Criar exemplos por ambiente

Arquivo:

```text
environments/dev/application.env.example
```

Exemplo:

```text
APP_PUBLIC_URL=https://dev.example.invalid
APP_LOG_LEVEL=DEBUG
APP_PROVIDER_MODE=sandbox
APP_OBSERVABILITY_ENABLED=true
APP_DATABASE_HOST=dev-database.internal
APP_KAFKA_BOOTSTRAP_SERVERS=dev-kafka.internal:9092
```

HML:

```text
APP_LOG_LEVEL=INFO
APP_PROVIDER_MODE=sandbox
```

Prod:

```text
APP_LOG_LEVEL=INFO
APP_PROVIDER_MODE=live
```

Os domínios `.invalid` deixam claro que são exemplos.

---

### 6. Cadastrar environments no GitHub

Crie:

```text
dev;

hml;

prod.
```

Use exatamente os nomes definidos no catálogo.

---

### 7. Cadastrar variables

Em cada environment, crie variables não sensíveis.

Não use:

```text
DATABASE_URL
```

quando ela contém senha.

Prefira separar host, database name e secret.

---

### 8. Cadastrar secrets falsos

Para o laboratório, use valores falsos.

Nomes:

```text
APP_DATABASE_PASSWORD;

APP_PROVIDER_TOKEN.
```

Não reutilize o secret de outro environment.

---

### 9. Configurar proteções

Baseline:

```text
dev:
sem reviewer.

hml:
reviewer quando disponível.

prod:
reviewer e branch restriction.
```

Documente o que foi possível aplicar.

---

### 10. Criar workflow de promoção

Arquivo:

```text
.github/workflows/environment-promotion.yml
```

Início:

```yaml
name:
  Environment Promotion

run-name:
  Promote ${{ inputs.image_reference }} to ${{ inputs.target_environment }}

on:
  workflow_dispatch:
    inputs:
      target_environment:
        description:
          Target environment

        required:
          true

        type:
          choice

        options:
          - dev
          - hml
          - prod

      image_reference:
        description:
          Immutable GHCR image reference

        required:
          true

        type:
          string

      rollback_reference:
        description:
          Immutable rollback image reference

        required:
          true

        type:
          string

      release_reason:
        description:
          Promotion reason

        required:
          true

        type:
          string
```

---

### 11. Definir permissions

```yaml
permissions:
  contents:
    read

  packages:
    read
```

O workflow não publica nova imagem.

---

### 12. Definir concurrency

```yaml
concurrency:
  group:
    environment-${{ inputs.target_environment }}

  cancel-in-progress:
    false
```

---

### 13. Criar job de validação

Esse job não usa environment secrets.

Ele valida:

- nome;
- digest;
- rollback digest;
- motivo;
- ordem;
- evidence.

---

### 14. Validar referências

Use regex para exigir:

```text
ghcr.io/...@sha256:<64 hex>.
```

Proíba referência somente por tag.

---

### 15. Validar ordem

Entrada adicional:

```text
source_environment
```

pode ser incluída.

Regras:

```text
dev:
source main.

hml:
source dev.

prod:
source hml.
```

---

### 16. Criar job do environment

```yaml
  prepare-environment:
    name:
      Prepare ${{ inputs.target_environment }}

    needs:
      - validate-promotion

    runs-on:
      ubuntu-latest

    timeout-minutes:
      15

    environment:
      name:
        ${{ inputs.target_environment }}

      url:
        ${{ steps.environment_metadata.outputs.public_url }}
```

Esse job recebe vars e secrets do target.

---

### 17. Carregar vars no step

```yaml
env:
  APP_PUBLIC_URL:
    ${{ vars.APP_PUBLIC_URL }}

  APP_LOG_LEVEL:
    ${{ vars.APP_LOG_LEVEL }}

  APP_PROVIDER_MODE:
    ${{ vars.APP_PROVIDER_MODE }}

  APP_OBSERVABILITY_ENABLED:
    ${{ vars.APP_OBSERVABILITY_ENABLED }}

  APP_DATABASE_HOST:
    ${{ vars.APP_DATABASE_HOST }}

  APP_KAFKA_BOOTSTRAP_SERVERS:
    ${{ vars.APP_KAFKA_BOOTSTRAP_SERVERS }}
```

---

### 18. Limitar secrets ao step

No step de validação:

```yaml
env:
  APP_DATABASE_PASSWORD:
    ${{ secrets.APP_DATABASE_PASSWORD }}

  APP_PROVIDER_TOKEN:
    ${{ secrets.APP_PROVIDER_TOKEN }}
```

Não os coloque globalmente no workflow.

---

### 19. Validar presença

Valide apenas:

- não vazio;
- policy mínima;
- formato quando aplicável.

Não imprima valor.

---

### 20. Validar regras de prod

Exemplo Bash:

```bash
if [[ "${TARGET_ENVIRONMENT}" == "prod" ]]; then
  test "${APP_LOG_LEVEL}" != "DEBUG"
  test "${APP_PROVIDER_MODE}" = "live"
  [[ "${APP_PUBLIC_URL}" == https://* ]]
  [[ "${APP_DATABASE_HOST}" != *dev* ]]
  [[ "${APP_DATABASE_HOST}" != *hml* ]]
fi
```

---

### 21. Renderizar manifest

Arquivo:

```text
deployment-manifest.json.
```

Inclua somente configuração não sensível.

Para secrets, inclua:

```json
{
  "databasePasswordConfigured": true,
  "providerTokenConfigured": true
}
```

---

### 22. Calcular hash

Use:

```bash
sha256sum deployment-manifest.json
```

Registre somente o hash.

---

### 23. Criar metadata do environment

Step output:

```text
public_url;

config_hash;

environment_name.
```

---

### 24. Criar evidence

Arquivo:

```text
environment-promotion-evidence.json.
```

Inclua:

- target;
- source;
- image reference;
- rollback reference;
- config hash;
- secret presence;
- reason;
- actor;
- run ID;
- timestamp;
- status.

---

### 25. Escanear evidence

Use o scanner da aula 524.

Confirme que nenhum secret aparece.

---

### 26. Publicar artifacts

Publique:

- deployment manifest;
- promotion evidence.

Retenção sugerida:

```text
dev:
7 dias.

hml:
30 dias.

prod:
90 dias.
```

Como retention dinâmica pode exigir estrutura adicional, a baseline pode usar 30 dias e documentar a política ideal.

---

### 27. Criar summary

Inclua:

- target;
- source;
- image digest;
- rollback digest;
- config hash;
- public URL;
- approval result;
- evidence artifact.

---

### 28. Criar script de validação

Arquivo:

```text
validate-environment-name.ps1
```

Aceita somente:

```text
dev;

hml;

prod.
```

---

### 29. Criar script de config

Arquivo:

```text
validate-environment-config.ps1
```

Parâmetros:

- environment;
- config file.

Valide chaves, URLs, log level, provider mode e host.

---

### 30. Criar script de manifest

Arquivo:

```text
render-deployment-manifest.ps1
```

Ele recebe valores não sensíveis e booleans de presença.

Nunca recebe secret para gravar no JSON.

---

### 31. Criar script de hash

Arquivo:

```text
calculate-config-hash.ps1
```

Normalize encoding e line endings antes do hash.

---

### 32. Criar script de ordem

Arquivo:

```text
validate-promotion-order.ps1
```

Valide source e target.

---

### 33. Criar verificação de evidence

Arquivo:

```text
verify-promotion-evidence.ps1
```

Valide:

- schema;
- result;
- digest;
- target;
- timestamp;
- config hash;
- artifact source.

---

### 34. Simular dev

Use imagem por digest.

Valide:

- sem approval;
- vars dev;
- secrets dev;
- manifest;
- evidence.

---

### 35. Simular hml

Exija evidence de dev.

Valide:

- approval quando disponível;
- vars hml;
- secrets hml;
- mesmo digest;
- rollback target.

---

### 36. Simular prod

Exija evidence de hml.

Valide:

- approval;
- HTTPS;
- log sem DEBUG;
- provider live;
- hosts sem dev/hml;
- mesmo digest;
- rollback target.

---

### 37. Simular promoção fora da ordem

Tente:

```text
dev para prod.
```

O gate precisa falhar.

---

### 38. Simular referência por tag

Tente:

```text
ghcr.io/owner/image:main.
```

O gate precisa exigir digest.

---

### 39. Simular config inválida

Use:

```text
APP_LOG_LEVEL=DEBUG
```

em prod.

O gate precisa falhar antes de gerar evidence válida.

---

### 40. Criar arquitetura

Arquivo:

```text
ENVIRONMENT_ARCHITECTURE.md
```

Diagrama:

```text
GHCR digest
    |
    v
dev environment
    |
evidence
    |
    v
hml environment
    |
evidence
    |
    v
prod environment
```

---

### 41. Criar catálogo documental

Arquivo:

```text
ENVIRONMENT_CATALOG.md
```

Documente finalidade, source, approval, vars, secrets, observação e rollback.

---

### 42. Criar policies

Crie:

- variable policy;
- secret policy;
- protection policy;
- drift policy.

Não repita valores sensíveis.

---

### 43. Criar runbook de promoção

Arquivo:

```text
PROMOTION_RUNBOOK.md
```

Inclua:

1. escolher digest;
2. validar source;
3. validar evidence;
4. validar rollback;
5. executar workflow;
6. aguardar approval;
7. revisar manifest;
8. observar;
9. concluir ou reverter.

---

### 44. Criar rollback por ambiente

Arquivo:

```text
ROLLBACK_BY_ENVIRONMENT.md
```

Dev pode retornar rapidamente.

HML preserva evidência para diagnóstico.

Prod exige approval e observação reforçada.

O rollback usa digest conhecido.

---

### 45. Criar test matrix

Arquivo:

```text
ENVIRONMENT_TEST_MATRIX.md
```

Cenários:

- dev válido;
- hml válido;
- prod válido;
- environment inválido;
- tag sem digest;
- rollback ausente;
- evidence ausente;
- ordem inválida;
- var ausente;
- secret ausente;
- prod DEBUG;
- prod sandbox;
- prod HTTP;
- host incorreto;
- concorrência;
- approval pendente;
- artifact sem secret;
- config hash divergente.

---

### 46. Criar troubleshooting

Arquivo:

```text
ENVIRONMENT_TROUBLESHOOTING.md
```

Inclua:

- environment não existe;
- var vazia;
- secret vazio;
- approval pendente;
- branch bloqueada;
- URL inválida;
- evidence não encontrada;
- digest divergente;
- config hash divergente;
- execução concorrente;
- prod recebe config hml;
- rollback reference indisponível.

---

### 47. Executar gate final

Execute:

```powershell
.\scripts\environments\validate-environment-name.ps1 `
  -Environment `
  "dev"

.\scripts\environments\validate-environment-config.ps1 `
  -Environment `
  "prod" `
  -ConfigFile `
  "environments/prod/application.env.example"

.\scripts\environments\simulate-environment-promotion.ps1

.\scripts\github-actions\verify-workflow-security.ps1
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Os ambientes ganharam contratos

Dev, hml e prod deixaram de ser nomes informais.

### O artefato permaneceu imutável

A promoção utilizou o mesmo digest.

### Variables e secrets foram separados

Configuração pública não foi tratada como credencial.

### Proteções ficaram por ambiente

Approval, branch e concorrência foram explicitados.

### A ordem de promoção virou gate

Prod não pode ignorar hml.

### O rollback virou entrada obrigatória

A promoção não começa sem referência conhecida.

### O manifest registrou configuração

Somente valores não sensíveis foram incluídos.

### O hash ajudou a detectar drift

Alterações de configuração ficaram observáveis.

### Evidências conectaram os ambientes

A promoção seguinte depende do resultado anterior.

### A próxima aula ganhou requisitos claros

Infraestrutura como código deverá entregar recursos compatíveis com esses contratos.

---

## Erros comuns importantes

### Rebuildar por ambiente

O conteúdo homologado deixa de ser o produtivo.

### Usar a mesma credencial em todos os ambientes

O impacto de vazamento aumenta.

### Colocar secret em vars

O valor perde a proteção adequada.

### Usar tag mutável para promoção

O ambiente pode receber conteúdo diferente.

### Permitir prod sem hml

A ordem de validação é quebrada.

### Cancelar deploy automaticamente

O ambiente pode ficar parcial.

### Colocar DEBUG em prod

Logs e dados podem ser expostos.

### Usar provider sandbox em prod

O comportamento real fica incorreto.

### Criar manifest com senha

A evidência vira vazamento.

### Tratar approval como único gate

Aprovação sem evidência não garante qualidade.

### Automatizar infraestrutura nesta aula

A aula 526 possui esse objetivo conceitual.

---

## Comandos úteis

### Validar nome

```powershell
.\scripts\environments\validate-environment-name.ps1 `
  -Environment `
  "hml"
```

### Validar config

```powershell
.\scripts\environments\validate-environment-config.ps1 `
  -Environment `
  "prod" `
  -ConfigFile `
  "environments/prod/application.env.example"
```

### Calcular hash

```powershell
.\scripts\environments\calculate-config-hash.ps1 `
  -Manifest `
  "deployment-manifest.json"
```

### Simular promoção

```powershell
.\scripts\environments\simulate-environment-promotion.ps1
```

---

## Exercício guiado

### Parte 1 — Catálogo

Defina dev, hml e prod.

### Parte 2 — Configuração

Crie examples.

### Parte 3 — GitHub

Cadastre environments, vars e secrets.

### Parte 4 — Proteção

Configure approvals e branches.

### Parte 5 — Workflow

Receba digest e target.

### Parte 6 — Validation

Valide ordem e configuração.

### Parte 7 — Manifest

Renderize sem secrets.

### Parte 8 — Evidence

Registre hash e resultado.

### Parte 9 — Promotion

Simule dev, hml e prod.

### Parte 10 — Failure

Bloqueie ordem e config inválidas.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 524 foi preservada;
- environment foi definido;
- dev foi definido;
- hml foi definido;
- prod foi definido;
- promotion foi definida;
- artifact imutável foi preservado;
- rebuild por ambiente foi proibido;
- variables foram diferenciadas;
- environment secrets foram definidos;
- protection rules foram definidas;
- environment URL foi definida;
- promotion evidence foi definida;
- rollback reference foi definida;
- configuration hash foi definido;
- drift foi definido;
- catálogo YAML foi criado;
- ordem dev-hml-prod foi criada;
- tempos didáticos foram identificados;
- policy de promoção foi criada;
- digest obrigatório foi definido;
- evidence obrigatória foi definida;
- rollback obrigatório foi definido;
- contrato de configuração foi criado;
- variables obrigatórias foram listadas;
- secrets obrigatórios foram listados;
- examples dev foram criados;
- examples hml foram criados;
- examples prod foram criados;
- domínios `.invalid` foram usados nos exemplos;
- environments GitHub foram criados;
- variables foram cadastradas por environment;
- secrets falsos foram cadastrados;
- secrets não foram reutilizados;
- proteção de dev foi definida;
- proteção de hml foi definida;
- proteção de prod foi definida;
- limitações da conta foram documentadas;
- workflow manual foi criado;
- target environment foi input;
- image reference foi input;
- rollback reference foi input;
- release reason foi input;
- permissions read foram usadas;
- packages read foi usado;
- concurrency por environment foi criada;
- cancel-in-progress false foi usado;
- job de validação não recebeu secrets;
- referência por digest foi exigida;
- tag simples foi rejeitada;
- ordem foi validada;
- job environment foi criado;
- environment name foi dinâmico;
- environment URL foi configurada;
- vars foram carregadas;
- secrets ficaram limitados ao step;
- presença de secret foi validada;
- valor não foi impresso;
- regras prod foram criadas;
- DEBUG foi bloqueado em prod;
- sandbox foi bloqueado em prod;
- HTTP foi bloqueado em prod;
- hosts dev e hml foram bloqueados em prod;
- manifest foi criado;
- manifest não contém secrets;
- booleans de presença foram usados;
- hash SHA-256 foi calculado;
- metadata outputs foram criados;
- evidence foi criada;
- source e target foram registrados;
- digest foi registrado;
- rollback foi registrado;
- actor e run foram registrados;
- evidence foi escaneada;
- artifact foi publicado;
- retenção foi documentada;
- summary foi criado;
- script de nome foi criado;
- script de config foi criado;
- script de manifest foi criado;
- script de hash foi criado;
- script de ordem foi criado;
- script de evidence foi criado;
- simulação dev foi executada;
- simulação hml foi executada;
- simulação prod foi executada;
- mesmo digest foi preservado;
- promoção fora da ordem falhou;
- referência por tag falhou;
- config prod inválida falhou;
- arquitetura foi documentada;
- catálogo documental foi criado;
- variable policy foi criada;
- secret policy foi criada;
- protection policy foi criada;
- drift policy foi criada;
- runbook foi criado;
- rollback por ambiente foi criado;
- test matrix foi criada;
- troubleshooting foi criado;
- infraestrutura real não foi provisionada;
- Terraform não foi implementado;
- Kubernetes não foi implementado;
- deploy externo não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 526 está correta.

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
  .github/workflows/environment-promotion.yml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline/environments `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/environments `
  scripts/environments `
  docs/devops/environments `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure possíveis valores sensíveis:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "password=|token=|api.key=|private.key"
```

Commit recomendado:

```powershell
git commit -m "ci(m17): estruturar ambientes dev hml prod"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret;
- password;
- token;
- `.env` real;
- deployment manifest local;
- evidence local;
- Docker config;
- URL autenticada;
- infraestrutura da aula 526;
- Terraform;
- state;
- cloud credentials.

---

## Fechamento e ponte para a próxima aula

Nesta aula, dev, hml e prod passaram a ser fronteiras operacionais explícitas.

O fluxo ficou:

```text
GHCR digest;

dev;

evidence;

hml;

evidence;

prod.
```

Você comprovou que:

- o mesmo artefato atravessa ambientes;
- variables e secrets possuem papéis diferentes;
- cada environment possui proteção própria;
- approvals complementam gates técnicos;
- concorrência impede promoções simultâneas;
- prod exige configuração mais restritiva;
- referência por digest evita ambiguidade;
- rollback target precisa existir antes da promoção;
- manifest não contém secrets;
- configuration hash ajuda a detectar drift;
- evidence conecta uma etapa à seguinte;
- deploy real depende de infraestrutura compatível.

A próxima aula será:

```text
526 - M17.21 - Infraestrutura como codigo conceitual
```

Nela, você irá compreender como redes, servidores, serviços, bancos, permissões e ambientes podem ser descritos, revisados e reproduzidos como código.

Nenhuma infraestrutura como código foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei catálogo de ambientes.
- [ ] Separei variables e secrets.
- [ ] Cadastrei dev, hml e prod.
- [ ] Configurei proteções.
- [ ] Criei workflow de promoção.
- [ ] Preservei o mesmo digest.
- [ ] Criei manifest e evidence.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O environment não é encontrado

Revise o nome exato no GitHub e no catálogo.

### A variable chega vazia

Ela pode ter sido cadastrada no escopo errado.

### O secret chega vazio

Revise environment, nome, approval e acesso.

### O job fica aguardando

Uma proteção do environment pode exigir reviewer.

### A URL não aparece

O step de metadata pode não ter produzido o output.

### A promoção hml falha por evidence

O arquivo anterior pode estar ausente, inválido ou associado a outro digest.

### Prod recebe DEBUG

A policy ou o script de validação está incompleto.

### O hash muda sem alteração intencional

Normalize encoding, line endings e ordenação do JSON.

### Duas promoções começam juntas

Revise a chave de concurrency.

### O rollback digest não existe

A promoção deve ser interrompida.

### O mesmo digest não foi mantido

Algum estágio reconstruiu a imagem.

### Terraform apareceu nesta aula

Remova e preserve para a aula 526 ou posterior.

---

## Perguntas de revisão

1. O que é environment?
2. Qual o objetivo de dev?
3. Qual o objetivo de hml?
4. Qual o objetivo de prod?
5. O que é promotion?
6. Por que não rebuildar?
7. O que é environment variable?
8. O que é environment secret?
9. O que é protection rule?
10. O que é environment URL?
11. O que é promotion evidence?
12. O que é rollback reference?
13. O que é configuration hash?
14. O que é drift?
15. Por que prod não usa DEBUG?
16. Por que exigir HTTPS?
17. Por que usar concurrency?
18. Approval substitui gate?
19. O que não foi provisionado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Fronteira operacional.
2. Integração rápida.
3. Homologação.
4. Uso real.
5. Mover o mesmo artefato.
6. Preservar identidade.
7. Configuração não sensível.
8. Credencial por ambiente.
9. Regra de proteção.
10. URL do ambiente.
11. Prova da etapa anterior.
12. Digest conhecido.
13. Hash da config.
14. Divergência de estado.
15. Evitar exposição e ruído.
16. Segurança.
17. Serializar promoção.
18. Não.
19. Infraestrutura real.
20. Infraestrutura como codigo conceitual.

---

## Desafio opcional

Modele um ambiente `preview`.

Requisitos:

- criado para pull request;
- sem secret produtivo;
- digest por commit;
- URL temporária;
- expiração;
- concorrência por PR;
- cleanup documentado;
- sem acesso a prod;
- sem provisionar infraestrutura real;
- sem antecipar IaC.

O objetivo é aplicar os mesmos princípios a um ambiente efêmero.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 525 - M17.20 - Ambientes dev hml prod

- Continuei após secrets em pipeline.
- Defini environment como fronteira operacional.
- Estruturei dev, hml e prod.
- Mantive o mesmo digest entre ambientes.
- Proibi rebuild por ambiente.
- Separei environment variables e environment secrets.
- Criei catálogo e política de promoção.
- Criei contrato de configuração.
- Criei examples de configuração por ambiente.
- Cadastrei environments no GitHub.
- Cadastrei variables não sensíveis.
- Cadastrei secrets falsos separados.
- Configurei proteções de dev, hml e prod.
- Criei workflow manual de promoção.
- Recebi target, image digest, rollback digest e reason.
- Exigi referência imutável.
- Configurei concurrency por environment.
- Validei ordem dev-hml-prod.
- Carreguei vars por environment.
- Limitei secrets ao step necessário.
- Criei regras específicas para prod.
- Bloqueei DEBUG, sandbox, HTTP e hosts errados em prod.
- Renderizei deployment manifest sem secrets.
- Calculei configuration hash.
- Criei promotion evidence.
- Escaneei evidence antes do upload.
- Publiquei manifest e evidence como artifacts.
- Configurei environment URL e summary.
- Simulei promoções para dev, hml e prod.
- Bloqueei promoção fora da ordem.
- Bloqueei referência apenas por tag.
- Documentei rollback, drift e troubleshooting.
- Não antecipei infraestrutura como código.
- Próxima aula: Infraestrutura como codigo conceitual.
```

---

## Referência técnica curta

- GitHub Environments.
- Environment Secrets.
- Environment Variables.
- Deployment Protection Rules.
- Required Reviewers.
- Deployment Concurrency.
- Build Once, Promote Many.
- Immutable Image Digest.
- Configuration Drift.
- Promotion Evidence.

Regra final:

```text
ambientes dev, hml e prod são fronteiras operacionais com objetivos, configuração, secrets, proteção, evidência e rollback próprios: o mesmo digest publicado no GHCR é promovido em ordem dev–hml–prod sem rebuild, enquanto `vars` fornecem configuração não sensível e environment secrets ficam limitados ao job associado ao destino; o workflow manual exige target, referência imutável, rollback digest e motivo, serializa execuções por environment, valida evidence do estágio anterior e aplica regras adicionais em prod, como HTTPS, log sem DEBUG, provider live e hosts corretos; um deployment manifest contém apenas valores não sensíveis e booleans de presença, recebe hash SHA-256 e gera promotion evidence escaneada antes do artifact; approvals, branch restrictions e environment protection complementam os quality gates, mas não os substituem; sem provisionar recursos, Terraform, Kubernetes ou cloud, a aula 526 poderá explicar como a infraestrutura que sustenta esses contratos passa a ser descrita e governada como código.
```
