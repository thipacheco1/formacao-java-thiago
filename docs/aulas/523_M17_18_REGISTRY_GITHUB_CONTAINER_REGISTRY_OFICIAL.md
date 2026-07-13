# 523 - M17.18 - Registry GitHub Container Registry

## Apresentação da aula

Na aula 522, você construiu e publicou uma imagem em um registry local efêmero.

O fluxo passou a possuir:

```text
testes;

cobertura;

package;

metadata;

Buildx;

push;

digest;

pull;

runtime gates;

evidência.
```

A imagem somente era construída depois de:

- testes unitários;
- testes de integração;
- quality gate de cobertura;
- empacotamento do JAR;
- validação do artefato.

O job Docker então:

- configurava Buildx;
- gerava tags;
- gerava labels OCI;
- construía o target `runtime`;
- fazia push;
- capturava o digest;
- fazia pull por digest;
- validava usuário não root;
- validava healthcheck;
- validava ausência de ferramentas de build;
- executava smoke test;
- publicava evidências.

Essa sequência provou o contrato técnico.

Entretanto, o registry usado era:

```text
localhost:5000.
```

Ele existia somente durante a execução do job.

Quando o runner era descartado:

```text
o registry;

os manifests;

os blobs;

as tags;

o histórico local
```

também desapareciam.

A pergunta central desta aula será:

```text
como publicar
a imagem validada

em um registry persistente
integrado ao GitHub,

com autenticação,
permissões mínimas,
identidade por digest
e vínculo com o repositório?
```

A resposta será:

```text
GitHub Container Registry,
ou GHCR.
```

O endpoint do registry será:

```text
ghcr.io.
```

A referência de uma imagem seguirá o formato:

```text
ghcr.io/<owner>/<image>:<tag>
```

Exemplo conceitual para o repositório atual:

```text
ghcr.io/<owner-normalizado>/formacao-java-integrations:sha-abc1234
```

O owner e o nome da imagem precisam estar em minúsculas.

O workflow calculará o nome em runtime.

Não haverá nome pessoal fixado diretamente no arquivo.

A identidade de promoção continuará sendo:

```text
repository@sha256:digest.
```

Tags continuarão sendo nomes humanos.

O digest continuará sendo a referência imutável.

A aula utilizará as actions:

```text
docker/login-action@v4;

docker/setup-buildx-action@v4;

docker/metadata-action@v6;

docker/build-push-action@v7.
```

O workflow usará o token temporário da própria execução:

```text
secrets.GITHUB_TOKEN.
```

As permissões do workflow serão ampliadas apenas para o job que publica:

```yaml
permissions:
  contents: read
  packages: write
```

A permissão:

```text
contents: read
```

continua necessária para checkout.

A permissão:

```text
packages: write
```

permite publicar o package.

O workflow não receberá:

- `contents: write`;
- `actions: write`;
- `deployments: write`;
- `issues: write`;
- `pull-requests: write`;
- `security-events: write`;
- `id-token: write`.

Essas permissões não são necessárias para esta aula.

O job de testes também não receberá `packages: write`.

A permissão de publicação ficará restrita ao job Docker.

Esse detalhe reforça:

```text
least privilege.
```

O login utilizará:

```yaml
registry:
  ghcr.io

username:
  ${{ github.actor }}

password:
  ${{ secrets.GITHUB_TOKEN }}
```

O token não será salvo em arquivo versionado.

Ele não será exibido.

Ele não será transformado em output.

Ele não será incluído em artifact.

Ele não será passado como build argument.

A aula seguinte será:

```text
524 - M17.19 - Secrets em pipeline
```

Nela, serão aprofundados:

- tipos de secrets;
- repository secrets;
- environment secrets;
- organization secrets;
- masking;
- redaction;
- rotação;
- escopo;
- OIDC;
- credenciais temporárias;
- riscos em forks;
- secret scanning;
- vazamento em logs.

Nesta aula, o uso do `GITHUB_TOKEN` será limitado à autenticação no GHCR.

Não será criada uma política geral de secrets antecipadamente.

Outro ponto importante será o vínculo entre o package e o repositório.

A imagem terá o label:

```text
org.opencontainers.image.source.
```

Valor:

```text
URL do repositório.
```

Esse label ajuda o GitHub a relacionar o package à origem.

Também serão preservados:

```text
org.opencontainers.image.revision;

org.opencontainers.image.version;

org.opencontainers.image.created;

org.opencontainers.image.title;

org.opencontainers.image.description.
```

O package publicado terá uma página própria no GitHub Packages.

Nessa página, será possível observar:

- versões;
- tags;
- digest;
- repositório de origem;
- visibilidade;
- instruções de pull;
- acesso;
- histórico.

A primeira publicação exige revisão de visibilidade, acesso e vínculo do package.

A baseline não tornará o package público automaticamente.

Essa decisão permanecerá manual e auditável.

Outro cuidado será o evento que pode publicar.

Pull requests não confiáveis não devem publicar no GHCR.

O job de publicação será executado somente em:

```text
push para main;

execução manual controlada.
```

Em pull requests:

```text
testes:
sim.

cobertura:
sim.

package:
sim.

Docker build sem push externo:
opcional.

GHCR push:
não.
```

A condição do job será explícita.

Exemplo:

```yaml
if:
  github.event_name == 'push'
  && github.ref == 'refs/heads/main'
```

A execução manual poderá ser incluída quando o workflow possuir um input específico.

A baseline desta aula publicará em push para `main`.

O pipeline também continuará respeitando a concorrência.

Publicações para o mesmo package precisam ser previsíveis.

O workflow utilizará uma chave separada para o estágio de publicação.

Conceitualmente:

```text
ghcr-${repository}-${ref}.
```

Não será permitido que duas execuções publiquem a mesma tag imutável ao mesmo tempo.

Tags por commit reduzem conflito.

A tag:

```text
sha-<commit>
```

é determinística.

A tag:

```text
main
```

é mutável.

Nesta aula, a tag `main` poderá ser publicada apenas como conveniência.

Ela não será usada como identidade de promoção.

`latest` continuará proibida.

Uma policy futura poderá decidir quando `latest` faz sentido.

O pipeline também gerará:

```text
sha-<short-sha>;

main;

ci-<run-number>.
```

A metadata action aplicará condições.

A tag por SHA será obrigatória.

A publicação será validada em três níveis.

#### Nível 1 — Output do build

O build-push action precisa retornar:

```text
digest.
```

#### Nível 2 — Pull autenticado por digest

O workflow fará:

```text
docker pull
ghcr.io/...@sha256:...
```

#### Nível 3 — Inspeção e smoke

A imagem recuperada será submetida novamente aos gates.

O fato de o build local ter passado não basta.

O objetivo é validar o artefato armazenado no GHCR.

Um job separado:

```text
ghcr-verification
```

receberá repository, digest e referência imutável.

Ele fará novo login, pull por digest, inspect, runtime gates, smoke e evidência.

Assim, o pipeline prova o consumo em um job com filesystem novo.

A aula não implementará:

- scan de vulnerabilidades;
- assinatura Cosign;
- attestation de provenance;
- SBOM publicada no registry;
- imagem multi-platform;
- deploy;
- promoção produtiva;
- limpeza automática;
- secrets externos;
- OIDC.

O foco será:

```text
publicação persistente
e consumo seguro
no GHCR.
```

Ao final, você deverá explicar:

```text
o que é GHCR;

como formar o nome;

por que usar minúsculas;

como autenticar
com GITHUB_TOKEN;

por que packages: write
fica apenas no job de push;

como vincular package
ao repositório;

como publicar tags;

como capturar digest;

como outro job
faz pull por digest;

como visibilidade
difere de permissão;

por que PR não publica;

como preservar
build once, promote many.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
521:
Pipeline testes cobertura quality gate.

522:
Pipeline Docker build push.

523:
Registry GitHub Container Registry.

524:
Secrets em pipeline.

525:
Pipeline deploy em ambiente de teste.
```

A aula 522 respondeu:

```text
como construir,
publicar
e recuperar
uma imagem

em um registry efêmero?
```

A aula 523 responderá:

```text
como publicar
a mesma candidata

em um registry persistente
integrado ao GitHub?
```

Nesta aula:

```text
GHCR:
sim.

ghcr.io:
sim.

GITHUB_TOKEN:
sim.

packages write:
sim.

login-action:
sim.

metadata:
sim.

push persistente:
sim.

pull por digest:
sim.

package source:
sim.

visibilidade:
sim.

permissões:
sim.

retenção:
sim.

job separado de verificação:
sim.

pull anônimo:
conceitual.

PAT:
conceitual.

secrets gerais:
não.

OIDC:
não.

scan:
não.

deploy:
não.
```

A regra central será:

```text
o GHCR armazena
a candidata validada,

mas somente o digest
identifica exatamente
o artefato promovível.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou revisados:

```text
.github/workflows/ci-foundation.yml

pipeline/ghcr
├── package-policy.yaml
├── publication-contract.yaml
├── retention-policy.yaml
└── visibility-policy.yaml

scripts/ghcr
├── normalize-ghcr-name.ps1
├── validate-ghcr-reference.ps1
├── login-ghcr-local.ps1
├── pull-ghcr-by-digest.ps1
├── inspect-ghcr-image.ps1
└── verify-ghcr-package.ps1

docs/devops/ghcr
├── GHCR_ARCHITECTURE.md
├── GHCR_AUTHENTICATION.md
├── GHCR_NAMING_POLICY.md
├── GHCR_PERMISSION_POLICY.md
├── GHCR_VISIBILITY_AND_ACCESS.md
├── GHCR_PUBLICATION_RUNBOOK.md
├── GHCR_PULL_VERIFICATION.md
├── GHCR_RETENTION_POLICY.md
├── GHCR_TEST_MATRIX.md
└── GHCR_TROUBLESHOOTING.md
```

O workflow será evoluído para:

```text
metadata;

maven-unit;

maven-integration;

maven-quality-gate;

maven-package;

ghcr-build-push;

ghcr-verification;

maven-summary.
```

Ao final, você terá:

```text
nome GHCR normalizado;

login com token temporário;

permissão mínima;

push em main;

package persistente;

tags controladas;

labels OCI;

digest;

outputs;

job consumidor;

pull autenticado;

runtime gates;

evidências;

política de retenção.
```

Você irá:

1. confirmar a baseline;
2. definir namespace;
3. normalizar owner;
4. definir nome da imagem;
5. definir política de package;
6. definir visibilidade;
7. definir retenção;
8. restringir eventos;
9. adicionar permissions;
10. configurar login;
11. configurar Buildx;
12. gerar metadata;
13. gerar source label;
14. construir;
15. fazer push;
16. capturar digest;
17. criar outputs;
18. criar job de verificação;
19. autenticar novamente;
20. fazer pull por digest;
21. validar usuário;
22. validar healthcheck;
23. validar labels;
24. validar revision;
25. executar smoke;
26. publicar evidências;
27. atualizar summary;
28. revisar package;
29. testar pull;
30. documentar limpeza;
31. simular falhas;
32. criar scripts;
33. executar gate;
34. commitar;
35. preparar a aula 524.

---

## Conceito essencial

### GitHub Container Registry

GHCR é o registry de containers do GitHub Packages.

Endpoint:

```text
ghcr.io.
```

Ele armazena imagens OCI e Docker.

---

### Namespace

O namespace normalmente corresponde ao usuário ou organização.

Formato:

```text
ghcr.io/<owner>/<image>.
```

O nome deve ser normalizado para minúsculas.

---

### Package

Package é o recurso apresentado no GitHub Packages.

Ele pode possuir:

- versões;
- tags;
- acesso;
- visibilidade;
- repositório vinculado.

---

---

### `GITHUB_TOKEN`

É um token temporário fornecido ao workflow.

Seu alcance depende de:

```text
permissions.
```

Ele é preferível ao PAT quando o workflow publica package associado ao próprio repositório e o modelo de acesso permite.

---

### `packages: write`

Permite publicar packages.

Não deve ser concedida aos jobs que apenas testam.

---

### `packages: read`

Permite leitura autenticada quando necessária.

Um job com `packages: write` também possui o acesso necessário para o push naquela execução.

Para consumidores separados, declare o mínimo adequado.

---

### Login no registry

O login usa:

```text
registry:

ghcr.io.

username:

github.actor.

password:

secrets.GITHUB_TOKEN.
```

A action escreve credenciais no ambiente efêmero do runner.

O job termina e o runner é descartado.

---

### Package linkage

O label:

```text
org.opencontainers.image.source
```

aponta para o repositório.

Isso melhora rastreabilidade e associação.

---

### Visibility

Possibilidades dependem do contexto e da conta.

Conceitualmente:

- private;
- internal quando aplicável;
- public.

Visibilidade não é alterada automaticamente pela tag.

---

### Access

Acesso define quem ou quais repositórios podem:

- ler;
- gravar;
- administrar.

Visibilidade e acesso são conceitos relacionados, mas não idênticos.

---

---

### Tag policy

Tags desta aula:

```text
sha-<commit>;

main;

ci-<run-number>.
```

A tag SHA é obrigatória.

`latest` continua proibida.

---

### Digest policy

A saída promovível é:

```text
ghcr.io/...@sha256:...
```

Nenhum ambiente deve receber apenas:

```text
:main.
```

---

### Repository source label

Valor:

```text
${{ github.server_url }}/${{ github.repository }}.
```

O label não deve conter token.

---

### Job boundary

`ghcr-build-push` publica.

`ghcr-verification` consome.

Isso prova a disponibilidade do registry.

---

### Retention

Retenção precisa considerar:

- releases;
- rollback targets;
- branches;
- CI;
- storage;
- auditoria.

Não remova a imagem de rollback durante a janela.

---

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no laboratório:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\scripts\docker-pipeline\build-and-push-local.ps1 `
  -Tag `
  "sha-local"
```

Depois:

```powershell
.\scripts\docker-pipeline\verify-pushed-image.ps1
```

---

### 2. Definir o nome da imagem

Na raiz do workflow, defina:

```yaml
env:
  GHCR_REGISTRY:
    ghcr.io

  GHCR_IMAGE_NAME:
    formacao-java-integrations
```

O owner será calculado.

---

### 3. Normalizar o owner

Crie um step no job de metadata ou publicação:

```yaml
      - name:
          Normalize GHCR owner

        id:
          ghcr_owner

        working-directory:
          .

        env:
          REPOSITORY_OWNER:
            ${{ github.repository_owner }}

        run: |
          set -Eeuo pipefail

          normalized_owner="$(
            tr '[:upper:]' '[:lower:]' \
              <<< "${REPOSITORY_OWNER}"
          )"

          test -n "${normalized_owner}"

          echo "value=${normalized_owner}" \
            >> "${GITHUB_OUTPUT}"
```

---

### 4. Criar repository completo

```yaml
      - name:
          Build GHCR repository name

        id:
          ghcr_repository

        working-directory:
          .

        env:
          REGISTRY:
            ${{ env.GHCR_REGISTRY }}

          OWNER:
            ${{ steps.ghcr_owner.outputs.value }}

          IMAGE_NAME:
            ${{ env.GHCR_IMAGE_NAME }}

        run: |
          set -Eeuo pipefail

          repository="${REGISTRY}/${OWNER}/${IMAGE_NAME}"

          echo "value=${repository}" \
            >> "${GITHUB_OUTPUT}"
```

Valide caracteres permitidos.

---

### 5. Restringir o job de publicação

O job deve possuir condição:

```yaml
if:
  github.event_name == 'push'
  && github.ref == 'refs/heads/main'
```

Pull request não publica.

---

### 6. Configurar permissões do job

No job:

```yaml
permissions:
  contents:
    read

  packages:
    write
```

Não use:

```yaml
permissions:
  write-all
```

---

### 7. Remover o registry local

O job GHCR não precisa de:

```yaml
services:
  registry:
```

Remova apenas do job de publicação persistente.

Os scripts locais podem continuar usando registry local.

---

### 8. Configurar login

Adicione:

```yaml
      - name:
          Log in to GitHub Container Registry

        uses:
          docker/login-action@v4

        with:
          registry:
            ${{ env.GHCR_REGISTRY }}

          username:
            ${{ github.actor }}

          password:
            ${{ secrets.GITHUB_TOKEN }}
```

Não imprima a senha.

---

### 9. Configurar Buildx

Mantenha:

```yaml
      - name:
          Set up Docker Buildx

        uses:
          docker/setup-buildx-action@v4
```

---

### 10. Gerar metadata para GHCR

```yaml
      - name:
          Generate GHCR metadata

        id:
          docker_meta

        uses:
          docker/metadata-action@v6

        with:
          images:
            ${{ steps.ghcr_repository.outputs.value }}

          tags:
            |
              type=sha,prefix=sha-
              type=raw,value=main,enable=${{ github.ref == 'refs/heads/main' }}
              type=raw,value=ci-${{ github.run_number }}

          labels:
            |
              org.opencontainers.image.title=Formacao Java Integrations
              org.opencontainers.image.description=Aplicacao de laboratorio da formacao Java Backend
              org.opencontainers.image.source=${{ github.server_url }}/${{ github.repository }}
              org.opencontainers.image.revision=${{ github.sha }}
```

A tag SHA precisa ser validada.

---

### 11. Construir e publicar

```yaml
      - name:
          Build and push image to GHCR

        id:
          docker_build

        uses:
          docker/build-push-action@v7

        with:
          context:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab

          file:
            labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/Dockerfile

          target:
            runtime

          platforms:
            linux/amd64

          push:
            true

          tags:
            ${{ steps.docker_meta.outputs.tags }}

          labels:
            ${{ steps.docker_meta.outputs.labels }}

          cache-from:
            type=gha

          cache-to:
            type=gha,mode=max
```

---

### 12. Validar o digest

```yaml
      - name:
          Validate GHCR digest

        env:
          IMAGE_DIGEST:
            ${{ steps.docker_build.outputs.digest }}

        run: |
          set -Eeuo pipefail

          grep -Eq '^sha256:[0-9a-f]{64}$' \
            <<< "${IMAGE_DIGEST}"
```

---

### 13. Criar referência imutável

```yaml
      - name:
          Build immutable GHCR reference

        id:
          immutable_reference

        env:
          REPOSITORY:
            ${{ steps.ghcr_repository.outputs.value }}

          DIGEST:
            ${{ steps.docker_build.outputs.digest }}

        run: |
          set -Eeuo pipefail

          reference="${REPOSITORY}@${DIGEST}"

          echo "value=${reference}" \
            >> "${GITHUB_OUTPUT}"
```

---

### 14. Criar outputs do job

```yaml
outputs:
  image_repository:
    ${{ steps.ghcr_repository.outputs.value }}

  image_digest:
    ${{ steps.docker_build.outputs.digest }}

  image_reference:
    ${{ steps.immutable_reference.outputs.value }}

  image_tags:
    ${{ steps.docker_meta.outputs.tags }}
```

Não publique token como output.

---

### 15. Criar job de verificação

```yaml
  ghcr-verification:
    name:
      Verify image from GHCR

    needs:
      - metadata
      - ghcr-build-push

    runs-on:
      ubuntu-latest

    timeout-minutes:
      20

    permissions:
      contents:
        read

      packages:
        read
```

O job usa filesystem novo.

---

### 16. Autenticar novamente

```yaml
      - name:
          Log in to GHCR for verification

        uses:
          docker/login-action@v4

        with:
          registry:
            ghcr.io

          username:
            ${{ github.actor }}

          password:
            ${{ secrets.GITHUB_TOKEN }}
```

O job consumidor declara somente leitura quando possível.

---

### 17. Fazer pull por digest

```yaml
      - name:
          Pull immutable image

        env:
          IMAGE_REFERENCE:
            ${{ needs.ghcr-build-push.outputs.image_reference }}

        run: |
          set -Eeuo pipefail

          docker pull \
            "${IMAGE_REFERENCE}"
```

---

### 18. Inspecionar labels

```yaml
      - name:
          Verify source and revision labels

        env:
          IMAGE_REFERENCE:
            ${{ needs.ghcr-build-push.outputs.image_reference }}

          EXPECTED_SOURCE:
            ${{ github.server_url }}/${{ github.repository }}

          EXPECTED_REVISION:
            ${{ github.sha }}

        run: |
          set -Eeuo pipefail

          source_label="$(
            docker image inspect \
              "${IMAGE_REFERENCE}" \
              --format \
              '{{ index .Config.Labels "org.opencontainers.image.source" }}'
          )"

          revision_label="$(
            docker image inspect \
              "${IMAGE_REFERENCE}" \
              --format \
              '{{ index .Config.Labels "org.opencontainers.image.revision" }}'
          )"

          test "${source_label}" = "${EXPECTED_SOURCE}"
          test "${revision_label}" = "${EXPECTED_REVISION}"
```

---

### 19. Reutilizar gates de runtime

Execute:

- non-root;
- healthcheck;
- entrypoint;
- exposed port;
- ausência de Maven;
- ausência de source;
- ausência de env sensível;
- smoke.

A validação precisa usar:

```text
needs.ghcr-build-push.outputs.image_reference.
```

---

### 20. Criar evidência do GHCR

Arquivo gerado:

```text
ghcr-publication-evidence.json.
```

Campos:

- repository;
- tags;
- digest;
- immutable reference;
- commit;
- source label;
- revision label;
- build result;
- pull result;
- runtime gates;
- smoke result;
- run ID;
- timestamp.

Sem secrets.

---

### 21. Publicar evidence

```yaml
      - name:
          Upload GHCR verification evidence

        if:
          always()

        uses:
          actions/upload-artifact@v4

        with:
          name:
            ghcr-evidence-${{ needs.metadata.outputs.short_sha }}

          path:
            ghcr-publication-evidence.json

          if-no-files-found:
            error

          retention-days:
            30
```

A retenção pode ser maior que a evidência do registry local.

---

### 22. Atualizar summary

Inclua:

```text
repository;

digest;

reference;

push result;

pull result;

source label;

revision;

runtime gates;

smoke.
```

Não imprima token.

---

### 23. Atualizar o job final

O summary final dependerá de:

```text
ghcr-build-push;

ghcr-verification.
```

Somente quando o evento tiver publicação.

Use condições para PRs que não executam esses jobs.

O summary não deve considerar `skipped` como falha em pull request.

---

### 24. Criar política de package

Arquivo:

```text
pipeline/ghcr/package-policy.yaml
```

Exemplo conceitual:

```yaml
package:
  registry:
    ghcr.io

  name:
    formacao-java-integrations

  source:
    repository_label_required: true

  identity:
    digest_required: true
    sha_tag_required: true
    latest_forbidden: true

  permissions:
    publish:
      - contents:read
      - packages:write

    consume:
      - contents:read
      - packages:read
```

---

### 25. Criar contrato de publicação

Arquivo:

```text
publication-contract.yaml
```

Inclua:

- evento;
- branch;
- gates;
- repository;
- tags;
- labels;
- digest;
- outputs;
- pull;
- smoke;
- evidence;
- rollback target.

---

### 26. Criar política de visibilidade

Arquivo:

```text
visibility-policy.yaml
```

Defina:

```text
default:

private.

public:

decisão manual
de governança.

internal:

quando disponível
e aprovado.

workflow:

não altera visibilidade.
```

---

### 27. Criar política de retenção

Arquivo:

```text
retention-policy.yaml
```

Categorias:

```text
release digest;

rollback digest;

main tag;

SHA tag;

CI tag;

branch tag;

untagged version.
```

Defina owner e janela.

Não automatize delete nesta aula.

---

### 28. Revisar package na interface

Após o primeiro push:

1. abra o repositório;
2. localize Packages;
3. abra o package;
4. confirme repositório vinculado;
5. confirme tags;
6. confirme digest;
7. confirme source;
8. confirme visibilidade;
9. confirme acesso;
10. não altere sem registrar.

---

---

### 30. Criar script de normalização

Arquivo:

```text
normalize-ghcr-name.ps1
```

Valide:

- minúsculas;
- owner;
- image name;
- tamanho;
- caracteres;
- referência final.

---

### 31. Criar script de referência

Arquivo:

```text
validate-ghcr-reference.ps1
```

Valide:

```text
ghcr.io/owner/image:tag;

ghcr.io/owner/image@sha256:digest.
```

Proíba:

- uppercase;
- espaço;
- senha;
- token;
- protocolo HTTP na referência.

---

### 32. Criar script de pull

Arquivo:

```text
pull-ghcr-by-digest.ps1
```

Parâmetros:

```text
-ImageReference.
```

Ele não aceita somente tag quando `-RequireDigest` está ativo.

---

### 33. Criar script de inspeção

Arquivo:

```text
inspect-ghcr-image.ps1
```

Mostre:

- digest;
- architecture;
- OS;
- user;
- healthcheck;
- entrypoint;
- labels;
- size.

Não mostre Docker auth config.

---

### 34. Criar script de package

Arquivo:

```text
verify-ghcr-package.ps1
```

Valide:

- package existe por pull;
- digest;
- labels;
- runtime gates;
- smoke;
- evidence.

Não use API administrativa nesta aula.

---

### 35. Criar arquitetura

Arquivo:

```text
GHCR_ARCHITECTURE.md
```

Diagrama:

```text
Maven and quality gates
          |
          v
ghcr-build-push
          |
          v
       ghcr.io
          |
          v
repository@digest
          |
          v
ghcr-verification
          |
          v
runtime gates + smoke
```

---

### 36. Criar autenticação

Arquivo:

```text
GHCR_AUTHENTICATION.md
```

Explique:

- `GITHUB_TOKEN`;
- `github.actor`;
- packages write;
- packages read;
- job scope;
- pull request;
- token temporário;
- ausência de PAT na baseline.

---

### 37. Criar naming policy

Arquivo:

```text
GHCR_NAMING_POLICY.md
```

Inclua:

- lowercase;
- owner;
- image name;
- tag SHA;
- tag main;
- tag CI;
- digest;
- proibição de latest;
- exemplos válidos e inválidos.

---

### 38. Criar permission policy

Arquivo:

```text
GHCR_PERMISSION_POLICY.md
```

Separe:

- test job;
- publish job;
- verify job;
- future deploy job;
- human local pull.

Não antecipe secrets gerais.

---

### 39. Criar visibility doc

Arquivo:

```text
GHCR_VISIBILITY_AND_ACCESS.md
```

Explique:

- private;
- public;
- internal quando aplicável;
- acesso por repositório;
- pull anônimo público;
- decisão manual;
- auditoria.

---

### 40. Criar runbook

Arquivo:

```text
GHCR_PUBLICATION_RUNBOOK.md
```

Inclua:

- preflight;
- branch;
- permissions;
- login;
- build;
- push;
- digest;
- pull;
- gates;
- evidence;
- package page;
- rollback.

---

### 41. Criar retenção

Arquivo:

```text
GHCR_RETENTION_POLICY.md
```

Nunca remova:

- digest em produção;
- rollback target;
- release sob investigação;
- package sob incidente.

Até o encerramento formal.

---

### 42. Criar matriz de testes

Arquivo:

```text
GHCR_TEST_MATRIX.md
```

Cenários:

- push main;
- PR sem push;
- packages write ausente;
- login falha;
- owner uppercase;
- nome inválido;
- tag latest;
- push passa;
- digest ausente;
- job consumidor faz pull;
- packages read ausente;
- source label ausente;
- revision divergente;
- imagem root;
- healthcheck ausente;
- smoke falha;
- package private;
- package public;
- tag movida;
- digest preservado.

---

### 43. Simular permissão ausente

Em branch de laboratório, remova temporariamente:

```text
packages: write.
```

Confirme:

- login pode ocorrer;
- push falha;
- digest não é promovido;
- job fica vermelho;
- evidence registra falha.

Restaure.

---

### 44. Simular source label ausente

Remova temporariamente o label.

Confirme:

- push pode ocorrer;
- verification falha;
- package não vira candidata;
- correção exige novo push.

Restaure.

---

---

---

### 47. Criar troubleshooting

Arquivo:

```text
GHCR_TROUBLESHOOTING.md
```

Inclua:

- denied;
- unauthorized;
- packages write ausente;
- owner uppercase;
- package não aparece;
- package não vincula;
- source label ausente;
- visibility incorreta;
- pull privado falha;
- digest vazio;
- tag mudou;
- job skipped em main;
- PR tentou publicar;
- artifact ausente;
- smoke falha;
- token exposto.

---

### 48. Executar gate final

Execute localmente:

```powershell
.\scripts\ghcr\normalize-ghcr-name.ps1

.\scripts\ghcr\validate-ghcr-reference.ps1

.\scripts\github-actions\validate-workflow-foundation.ps1

.\scripts\github-actions\verify-workflow-security.ps1
```

Depois:

```powershell
git diff --check
git status
```

Após push controlado em `main`, valide:

- workflow;
- package;
- digest;
- pull;
- gates;
- evidence;
- summary.

---

## Entendendo o que foi feito

### O registry virou persistente

A imagem continua disponível depois do runner.

### A autenticação ficou integrada

O workflow utiliza token temporário e permissions explícitas.

### A escrita ficou restrita

Somente o job de publicação recebe `packages: write`.

### O nome ficou reproduzível

Owner e imagem são normalizados.

### O package ganhou vínculo

O source label aponta para o repositório.

### A publicação ficou restrita a main

Pull requests não produzem packages.

### O digest atravessou jobs

O consumidor recebe uma referência imutável.

### O pull provou armazenamento

Um job novo recuperou a imagem do GHCR.

### A visibilidade ficou fora do build

Governança não foi automatizada sem decisão.

### A próxima aula ganhou contexto

O `GITHUB_TOKEN` será o ponto de partida para estudar secrets com profundidade.

---

## Erros comuns importantes

### Publicar em pull request

Código não integrado produz package externo.

### Conceder packages write globalmente

Jobs de teste ganham permissão desnecessária.

### Usar PAT sem necessidade

Aumenta gestão e escopo de credenciais.

### Fixar owner com maiúsculas

A referência pode ser inválida.

### Usar somente a tag main

A promoção perde identidade imutável.

### Tornar package público automaticamente

Uma decisão de governança vira efeito colateral.

### Não usar source label

Rastreabilidade e vínculo ficam piores.

### Verificar no mesmo job apenas

Não se prova consumo por ambiente novo.

### Considerar tag como versão imutável

Tags podem mudar.

### Excluir imagem de rollback

A recuperação deixa de existir.

### Imprimir GITHUB_TOKEN

O segredo pode vazar em logs.

### Antecipar secrets em geral

A aula 524 possui esse objetivo.

---

## Comandos úteis

### Login local

```powershell
$token |
  docker login `
    ghcr.io `
    --username `
    $env:GITHUB_ACTOR `
    --password-stdin
```

Não salve o token no histórico.

### Pull por tag

```powershell
docker pull `
  ghcr.io/owner/formacao-java-integrations:sha-abc1234
```

### Pull por digest

```powershell
docker pull `
  ghcr.io/owner/formacao-java-integrations@sha256:...
```

### Inspecionar labels

```powershell
docker image inspect `
  ghcr.io/owner/formacao-java-integrations@sha256:... `
  --format `
  "{{json .Config.Labels}}"
```

### Logout

```powershell
docker logout `
  ghcr.io
```

---

## Exercício guiado

### Parte 1 — Namespace

Normalize owner e imagem.

### Parte 2 — Permissions

Restrinja packages write.

### Parte 3 — Login

Use GITHUB_TOKEN.

### Parte 4 — Metadata

Gere tags e source label.

### Parte 5 — Push

Publique no GHCR.

### Parte 6 — Digest

Crie referência imutável.

### Parte 7 — Consumer

Crie job separado.

### Parte 8 — Gates

Valide a imagem recuperada.

### Parte 9 — Governance

Revise visibilidade e retenção.

### Parte 10 — Failure

Comprove bloqueios.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 522 foi preservada;
- GHCR foi definido;
- endpoint `ghcr.io` foi usado;
- namespace foi definido;
- package foi definido;
- package version foi definida;
- tag foi definida;
- manifest foi definido;
- blob foi definido;
- digest foi definido;
- owner foi normalizado;
- nome da imagem foi normalizado;
- nomes em minúsculas foram usados;
- nome não foi fixado para pessoa específica;
- `GITHUB_TOKEN` foi usado;
- token foi classificado como temporário;
- `packages: write` foi usado;
- `contents: read` foi usado;
- permissions amplas não foram usadas;
- job de teste não recebeu write;
- login-action v4 foi usado;
- setup-buildx v4 foi preservado;
- metadata-action v6 foi preservado;
- build-push-action v7 foi preservado;
- registry `ghcr.io` foi configurado;
- username usa `github.actor`;
- password usa `secrets.GITHUB_TOKEN`;
- token não virou output;
- token não virou artifact;
- token não virou build arg;
- push foi restrito a main;
- pull request não publica;
- workflow dispatch foi discutido;
- tag SHA foi criada;
- tag main foi criada de forma condicional;
- tag CI foi criada;
- latest continuou proibida;
- source label foi criado;
- revision label foi criado;
- title foi criado;
- description foi criada;
- imagem foi construída após gates;
- push true foi usado;
- cache GHA foi usado;
- digest foi capturado;
- formato digest foi validado;
- immutable reference foi criada;
- outputs do job foram criados;
- repository foi output;
- digest foi output;
- reference foi output;
- tags foram output;
- job de verificação foi criado;
- job consumidor usa filesystem novo;
- job consumidor usa packages read;
- job consumidor autentica novamente;
- pull por digest foi executado;
- source label foi validado;
- revision label foi validado;
- user não root foi validado;
- healthcheck foi validado;
- entrypoint foi validado;
- porta foi validada;
- Maven ausente foi validado;
- source ausente foi validado;
- secret ausente foi validado;
- smoke foi executado;
- evidence JSON foi criado;
- evidence não contém secrets;
- artifact foi publicado;
- artifact usa always;
- retenção de evidence foi definida;
- summary foi atualizado;
- summary não imprime token;
- summary final trata skipped em PR;
- package policy foi criada;
- publication contract foi criado;
- visibility policy foi criada;
- default privado foi documentado;
- public exige decisão manual;
- internal foi discutido;
- workflow não altera visibilidade;
- retention policy foi criada;
- digest de release foi protegido;
- rollback target foi protegido;
- exclusão automática não foi criada;
- package page foi revisada;
- repository linkage foi revisado;
- tags foram revisadas;
- digest foi revisado;
- acesso foi revisado;
- pull autenticado local foi documentado;
- PAT não foi criado automaticamente;
- script de normalização foi criado;
- script de referência foi criado;
- script de login foi criado;
- script de pull foi criado;
- script de inspeção foi criado;
- script de package foi criado;
- arquitetura foi documentada;
- autenticação foi documentada;
- naming policy foi criada;
- permission policy foi criada;
- visibility doc foi criado;
- publication runbook foi criado;
- retention doc foi criado;
- test matrix foi criada;
- packages write ausente foi simulado;
- push falhou corretamente;
- source label ausente foi simulado;
- verification falhou;
- packages read ausente foi simulado;
- pull privado falhou quando esperado;
- tag mutável foi comparada ao digest;
- digest original permaneceu;
- alterações temporárias foram restauradas;
- troubleshooting foi criado;
- visibilidade não foi automatizada;
- cleanup não foi automatizado;
- scan não foi implementado;
- assinatura não foi implementada;
- SBOM no registry não foi implementada;
- deploy não foi executado;
- secrets gerais não foram antecipados;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 524 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline/ghcr `
  scripts/ghcr `
  docs/devops/ghcr `
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
git commit -m "ci(m17): publicar imagem no GHCR"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token;
- PAT;
- Docker config;
- `.env`;
- password;
- target;
- JAR;
- image archive;
- package dump;
- evidence local;
- registry cache;
- secrets da aula 524.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a imagem candidata deixou de existir somente durante o runner.

O fluxo passou a possuir:

```text
quality gates;

build;

login;

GHCR;

push;

digest;

job consumidor;

pull;

runtime gates;

evidência.
```

Você comprovou que:

- GHCR utiliza `ghcr.io`;
- namespace e image name precisam ser normalizados;
- `GITHUB_TOKEN` autentica a execução;
- `packages: write` fica no job de publicação;
- `packages: read` atende o consumidor;
- pull requests não publicam;
- metadata produz tags e labels;
- source label vincula origem;
- tag SHA é obrigatória;
- digest é a identidade de promoção;
- outro job consegue recuperar a imagem;
- runtime gates continuam obrigatórios;
- visibilidade é decisão de governança;
- retenção protege releases e rollback targets;
- package persistente não elimina a necessidade de evidência.

A próxima aula será:

```text
524 - M17.19 - Secrets em pipeline
```

Nela, você irá aprofundar como credenciais entram, circulam, são mascaradas, limitadas, rotacionadas e substituídas por identidades temporárias.

Nenhuma arquitetura completa de secrets foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Normalizei o nome GHCR.
- [ ] Restringi a publicação a main.
- [ ] Configurei permissions mínimas.
- [ ] Autentiquei com GITHUB_TOKEN.
- [ ] Publiquei tags e labels.
- [ ] Capturei o digest.
- [ ] Fiz pull em outro job.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O push retorna `denied`

Revise `packages: write`, token, namespace e acesso ao package.

### O login passa e o push falha

Autenticação não garante autorização de escrita no namespace.

### O owner possui maiúsculas

Normalize antes de formar a referência.

### O package não aparece no repositório

Revise source label e associação do package.

### A imagem foi publicada, mas não pode ser lida

Revise visibilidade, acesso do repositório e `packages: read`.

### O job de PR tenta publicar

A condição do job está incorreta.

### O digest está vazio

O push não concluiu ou o output está errado.

### O source label diverge

A metadata não recebeu a URL correta.

### O pull por tag retorna conteúdo diferente

A tag pode ter sido movida; use o digest.

### O summary falha em pull request

O job final pode estar tratando `skipped` como erro.

### O package ficou público sem aprovação

Revise governança e histórico imediatamente.

### O token apareceu em log

Interrompa, revise o workflow e trate como possível exposição.

---

## Perguntas de revisão

1. O que é GHCR?
2. Qual é o endpoint?
3. O que é namespace?
4. Por que normalizar para minúsculas?
5. O que é package?
6. O que é package version?
7. O que faz `GITHUB_TOKEN`?
8. Para que serve `packages: write`?
9. Para que serve `packages: read`?
10. Como login-action autentica?
11. Por que PR não publica?
12. Para que serve source label?
13. Tag é imutável?
14. Digest é imutável?
15. Por que criar job consumidor?
16. Pacote público pode ter pull anônimo?
17. Visibilidade é igual a acesso?
18. Por que proteger rollback targets?
19. O que não foi aprofundado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Registry de containers do GitHub.
2. `ghcr.io`.
3. Owner do package.
4. Compatibilidade do nome.
5. Recurso publicado.
6. Conteúdo ou versão registrada.
7. Autenticação temporária.
8. Publicar package.
9. Ler package.
10. Actor e token.
11. Evitar publicação não integrada.
12. Vincular origem.
13. Não.
14. Identifica conteúdo.
15. Provar consumo.
16. Sim.
17. Não.
18. Preservar rollback.
19. Secrets em geral.
20. Secrets em pipeline.

---

## Desafio opcional

Modele uma política para packages públicos e privados.

Requisitos:

- dois cenários;
- mesma imagem por digest;
- pull autenticado;
- pull anônimo somente público;
- acesso de repositório;
- visibilidade manual;
- logs sem token;
- rollback target protegido;
- nenhuma alteração automática de visibilidade;
- nenhuma implementação de secrets externos.

O objetivo é diferenciar visibilidade, autenticação e autorização sem antecipar a aula 524.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 523 - M17.18 - Registry GitHub Container Registry

- Continuei após o pipeline Docker build e push.
- Substituí o registry efêmero pelo GHCR.
- Defini `ghcr.io` como endpoint.
- Normalizei owner e image name para minúsculas.
- Criei política de package e naming.
- Restringi a publicação a push em main.
- Mantive pull requests sem push externo.
- Apliquei `contents: read`.
- Apliquei `packages: write` somente no job de publicação.
- Configurei `docker/login-action@v4`.
- Autentiquei com `github.actor`.
- Usei `secrets.GITHUB_TOKEN`.
- Mantive Buildx, metadata e build-push.
- Gerei tags SHA, main e CI.
- Mantive `latest` proibida.
- Adicionei source e revision labels.
- Publiquei a imagem no GHCR.
- Capturei o digest.
- Criei referência imutável.
- Publiquei repository, digest, reference e tags como outputs.
- Criei job separado de verificação.
- Apliquei `packages: read` no consumidor.
- Autentiquei novamente.
- Fiz pull por digest.
- Validei source, revision, usuário, healthcheck e runtime.
- Executei smoke da imagem recuperada.
- Criei evidence JSON sem secrets.
- Publiquei evidence como artifact.
- Atualizei summaries.
- Revisei a página do package.
- Documentei visibilidade e acesso.
- Mantive mudança de visibilidade como decisão manual.
- Criei política de retenção.
- Protegi digests de release e rollback.
- Simulei falhas de permission, source label e pull.
- Não antecipei a arquitetura completa de secrets.
- Próxima aula: Secrets em pipeline.
```

---

## Referência técnica curta

- GitHub Container Registry.
- GitHub Packages.
- `GITHUB_TOKEN`.
- GitHub Actions Permissions.
- Docker Login Action.
- Docker Metadata Action.
- Docker Build Push Action.
- OCI Image Source Label.
- Container Image Digest.
- Build Once, Promote Many.

Regra final:

```text
o GitHub Container Registry torna persistente a imagem validada no pipeline: o workflow normaliza owner e image name, restringe a publicação a push em main, concede `contents: read` e `packages: write` somente ao job de publicação, autentica `docker/login-action@v4` em `ghcr.io` com `github.actor` e `secrets.GITHUB_TOKEN`, gera tags SHA, main e CI e labels OCI de source e revision, e publica o target runtime com Buildx; o digest SHA-256 vira output e forma a referência imutável `ghcr.io/owner/image@digest`; um segundo job, com `packages: read`, autentica novamente, faz pull pelo digest e repete gates de usuário não root, healthcheck, labels, ausência de build tools e smoke; visibilidade e acesso permanecem decisões de governança, packages públicos podem permitir pull anônimo, mas a baseline usa leitura autenticada; retenção protege releases e rollback targets e nenhuma limpeza automática, PAT, scan, deploy ou arquitetura geral de secrets é antecipada; a aula 524 aprofundará o ciclo de vida seguro das credenciais do pipeline.
```
