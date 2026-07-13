# 522 - M17.17 - Pipeline Docker build push

## Apresentação da aula

Na aula 521, o pipeline passou a bloquear a produção do artefato quando os testes ou a cobertura não atendem à política.

O grafo ficou:

```text
metadata;

maven-unit;

maven-integration;

maven-quality-gate;

maven-package;

maven-summary.
```

O projeto passou a preservar:

- relatórios Surefire;
- relatórios Failsafe;
- relatório JaCoCo;
- cobertura de linhas;
- cobertura de branches;
- JAR validado;
- summaries;
- artifacts.

Agora o JAR validado precisa se transformar em uma imagem de container identificável.

A pergunta central desta aula será:

```text
como construir
uma imagem Docker

somente depois
dos quality gates,

publicá-la
em um registry,

recuperá-la pelo digest

e provar que
o conteúdo publicado
é o conteúdo validado?
```

A resposta será um novo estágio de pipeline:

```text
Docker build e push.
```

A imagem não será construída antes dos testes.

O job Docker dependerá de:

```text
maven-unit;

maven-integration;

maven-quality-gate;

maven-package.
```

Isso produz a ordem:

```text
código;

testes;

cobertura;

JAR;

imagem;

push;

verificação.
```

A aula respeitará o princípio:

```text
build once,
promote many.
```

O pipeline produzirá uma imagem uma vez.

A identidade principal será o digest.

Exemplo conceitual:

```text
sha256:...
```

Tags serão usadas para leitura humana.

Digest será usado para identidade imutável.

A aula trabalhará com as actions oficiais atuais:

```text
docker/setup-buildx-action@v4;

docker/metadata-action@v6;

docker/build-push-action@v7.
```

O workflow já utiliza:

```text
actions/checkout@v6;

actions/setup-java@v5;

actions/upload-artifact@v4.
```

As tags de major deixam o laboratório legível.

A política profissional continuará recomendando:

```text
pinning por SHA completo
em ambientes endurecidos.
```

Nesta aula, nenhuma credencial externa será configurada.

O push será executado contra um registry local efêmero iniciado dentro do job do GitHub Actions.

A topologia será:

```text
GitHub Actions runner
        |
        v
Docker Buildx
        |
        v
localhost:5000
registry efêmero
        |
        v
pull por digest
        |
        v
verificação da imagem.
```

O registry local existe somente durante o job.

Ele permite praticar:

- tagging;
- push;
- digest;
- pull;
- inspect;
- smoke;
- gates;
- cache;
- outputs;
- evidências.

Ele não substitui um registry corporativo.

A próxima aula será:

```text
523 - M17.18 - Registry GitHub Container Registry
```

Nela, o pipeline será conectado ao:

```text
ghcr.io.
```

Serão tratados:

- autenticação;
- `GITHUB_TOKEN`;
- `packages: write`;
- namespace;
- visibilidade;
- associação ao repositório;
- permissões;
- retenção;
- pull;
- publicação oficial.

Por isso, esta aula não implementará:

- login no GHCR;
- `packages: write`;
- Personal Access Token;
- imagem pública;
- package settings;
- registry externo;
- promoção entre ambientes;
- assinatura;
- attestations manuais;
- scan de vulnerabilidades;
- deploy.

O push desta aula é real, mas o registry é descartável.

Esse recorte preserva a progressão pedagógica.

Outro princípio será:

```text
não usar latest.
```

A imagem receberá tags como:

```text
sha-abc1234;

ci-184;

pr-42.
```

Uma tag pode ser movida.

O digest não deve ser substituído silenciosamente.

O pipeline também adicionará labels OCI.

Exemplos:

```text
org.opencontainers.image.title;

org.opencontainers.image.description;

org.opencontainers.image.source;

org.opencontainers.image.revision;

org.opencontainers.image.version;

org.opencontainers.image.created.
```

Esses labels serão gerados pelo:

```text
docker/metadata-action.
```

A imagem continuará respeitando os gates já construídos no módulo:

- multi-stage;
- runtime não root;
- healthcheck;
- sem Maven no runtime;
- sem source code no runtime;
- secrets fora da imagem;
- labels;
- porta esperada;
- entrypoint;
- tamanho observado.

A aula também introduzirá cache de build do BuildKit.

Configuração:

```text
cache-from:
type=gha.

cache-to:
type=gha,mode=max.
```

O cache acelera layers reutilizáveis.

Ele não é a imagem publicada.

Ele não é o JAR.

Ele não é o digest de release.

Uma execução precisa continuar correta quando o cache não existe.

O pipeline utilizará contexto por path.

Isso é importante porque o projeto está em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab.
```

O workflow fará checkout e informará explicitamente:

```yaml
context:
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Assim, mudanças realizadas por steps anteriores no workspace podem entrar no build.

A alternativa de Git context possui comportamento diferente.

Nesta aula, o path context é mais fácil de auditar.

Outro ponto será a diferença entre:

```text
build;

load;

push;

export.
```

#### Build

Executa o Dockerfile com BuildKit.

#### Load

Carrega uma imagem de plataforma única no Docker Engine local.

#### Push

Envia a imagem para o registry.

#### Export

Produz saídas como OCI layout, Docker archive ou filesystem.

O job principal utilizará:

```text
push:
true.
```

Depois, fará:

```text
pull pelo digest.
```

Isso valida o conteúdo armazenado no registry.

Não será usado:

```text
load:
true
```

no mesmo passo principal.

A validação utilizará a cópia recuperada do registry.

Essa escolha evita verificar apenas a imagem local do builder.

A plataforma será:

```text
linux/amd64.
```

Multi-platform será discutido, mas não implementado.

Sem QEMU, o pipeline permanece simples e rápido.

A aula também definirá outputs do job Docker:

```text
image_repository;

image_tag;

image_digest;

image_reference.
```

Exemplo:

```text
localhost:5000/formacao-java/m16-integrations@sha256:...
```

O digest será usado no summary e no artifact de evidências.

O pipeline também produzirá um arquivo:

```text
docker-build-evidence.json.
```

Ele conterá:

- commit;
- short SHA;
- workflow run;
- image repository;
- tags;
- digest;
- platform;
- Dockerfile;
- build context;
- timestamp;
- gate results.

Ele não conterá:

- token;
- secret;
- password;
- Docker config;
- dados de registry autenticado.

A aula também simulará falhas.

#### Falha de quality gate

O job Docker não deve iniciar.

#### Dockerfile inválido

O build deve falhar.

#### Runtime root

O gate pós-push deve falhar.

#### Healthcheck ausente

O gate deve falhar.

#### Push indisponível

O job deve falhar sem marcar a imagem como publicada.

#### Digest ausente

A verificação deve falhar.

#### Pull por digest falha

O conteúdo publicado não foi comprovado.

O objetivo é fazer o pipeline responder:

```text
qual imagem foi construída?

qual imagem foi publicada?

qual digest foi produzido?

a imagem publicada
passa nos gates?

é possível recuperá-la
sem depender da tag?
```

Ao final, você deverá explicar:

```text
por que build
vem depois dos gates;

como Buildx participa;

como metadata-action
gera tags e labels;

como cache GHA
acelera layers;

por que push local
é útil nesta aula;

como digest
diferencia identidade;

por que pull por digest
é um gate;

como compartilhar outputs;

por que latest
não é adequado;

o que ficará
para o GHCR.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
520:
Pipeline Maven.

521:
Pipeline testes cobertura quality gate.

522:
Pipeline Docker build push.

523:
Registry GitHub Container Registry.

524:
Pipeline scan de vulnerabilidades.
```

A aula 521 respondeu:

```text
como bloquear
o package
quando testes
ou cobertura
não atendem
ao quality gate?
```

A aula 522 responderá:

```text
como transformar
o artefato validado
em uma imagem

e provar
o push por digest?
```

Nesta aula:

```text
Buildx:
sim.

BuildKit:
sim.

metadata-action:
sim.

build-push-action:
sim.

registry local:
sim.

push:
sim.

pull por digest:
sim.

tags:
sim.

labels OCI:
sim.

cache GHA:
sim.

outputs:
sim.

artifact de evidência:
sim.

imagem não root:
sim.

healthcheck:
sim.

single platform:
sim.

QEMU:
conceitual.

multi-platform:
conceitual.

GHCR:
não.

login externo:
não.

scan:
não.

deploy:
não.
```

A regra central será:

```text
somente uma imagem
que passou pelos gates,
foi publicada
e foi recuperada pelo digest

pode ser considerada
candidata.
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
Dockerfile
.dockerignore

pipeline/docker
├── image-policy.yaml
├── tag-policy.yaml
└── build-contract.yaml

scripts/docker-pipeline
├── validate-docker-context.ps1
├── start-local-registry.ps1
├── build-and-push-local.ps1
├── verify-pushed-image.ps1
├── inspect-build-metadata.ps1
└── stop-local-registry.ps1

docs/devops/docker-pipeline
├── DOCKER_PIPELINE_ARCHITECTURE.md
├── DOCKER_BUILD_POLICY.md
├── DOCKER_TAG_POLICY.md
├── DOCKER_LABEL_POLICY.md
├── DOCKER_CACHE_POLICY.md
├── LOCAL_REGISTRY_RUNBOOK.md
├── PUSH_VERIFICATION_POLICY.md
├── DOCKER_PIPELINE_TEST_MATRIX.md
└── DOCKER_PIPELINE_TROUBLESHOOTING.md
```

O workflow será evoluído para:

```text
metadata;

maven-unit;

maven-integration;

maven-quality-gate;

maven-package;

docker-build-push;

maven-summary.
```

Ao final, você terá:

```text
imagem construída;

tags geradas;

labels gerados;

registry local;

push validado;

digest capturado;

pull por digest;

gates de runtime;

outputs;

artifact de evidências;

summary.
```

Você irá:

1. confirmar a baseline;
2. revisar Dockerfile;
3. revisar `.dockerignore`;
4. criar política de imagem;
5. criar política de tags;
6. criar contrato de build;
7. criar registry local;
8. configurar Buildx;
9. gerar metadata;
10. construir imagem;
11. usar cache;
12. fazer push;
13. capturar digest;
14. criar outputs;
15. fazer pull por digest;
16. inspecionar user;
17. inspecionar healthcheck;
18. inspecionar labels;
19. validar ausência de build tools;
20. validar ausência de secrets;
21. executar smoke;
22. criar evidência;
23. publicar artifact;
24. atualizar summary;
25. simular falhas;
26. criar scripts locais;
27. documentar;
28. executar gate;
29. commitar;
30. preparar a aula 523.

---

## Conceito essencial

### Docker Buildx

Buildx é uma interface de build avançada para BuildKit.

Ele oferece:

- builders;
- cache;
- multi-platform;
- outputs;
- secrets;
- attestations;
- drivers.

---

### BuildKit

BuildKit executa o build com:

- grafo de dependências;
- cache eficiente;
- mounts;
- paralelismo;
- outputs controlados.

---

### Builder

Builder é a instância que executa builds.

O action:

```text
docker/setup-buildx-action
```

cria e inicializa um builder.

---

### Build context

Contexto é o conjunto de arquivos acessíveis ao build.

Um contexto excessivo:

- deixa build lento;
- aumenta risco;
- invalida cache;
- pode enviar arquivo sensível.

---

### `.dockerignore`

Exclui arquivos do contexto.

Itens esperados:

```text
.git;

.github;

target;

docs;

scripts locais;

.env;

secrets;

logs;

coverage;

arquivos de IDE.
```

Não exclua arquivos necessários ao build.

---

### Tag

Tag é um nome mutável.

Exemplos:

```text
sha-abc1234;

ci-184.
```

Ela facilita uso humano.

---

### Digest

Digest identifica o conteúdo publicado.

Exemplo:

```text
repository@sha256:...
```

O digest é a referência de promoção.

---

### OCI label

Label descreve o artefato.

Ela não substitui o digest.

Não armazene secrets em labels.

---

### Registry

Registry armazena manifests e blobs.

Nesta aula:

```text
localhost:5000.
```

Ele é efêmero e sem autenticação.

Somente o job local acessa.

---

### Push

Push envia layers e manifest ao registry.

Uma falha parcial precisa resultar em job vermelho.

---

### Pull por digest

Pull por digest recupera exatamente o manifest identificado.

É mais forte que pull por tag.

---

### Build cache

Cache reutiliza etapas.

Ele não deve alterar o resultado funcional.

---

### GHA cache backend

O backend:

```text
type=gha
```

armazena cache associado à infraestrutura do workflow.

Ele precisa ser tratado como acelerador.

---

### Path context

O Buildx usa o workspace após checkout.

Mutations anteriores podem ser observadas.

O path precisa apontar para o laboratório correto.

---

### Git context

O Buildx pode obter diretamente um ref Git.

Mudanças locais anteriores podem não entrar.

Não será usado como baseline desta aula.

---

### Single-platform

A imagem será:

```text
linux/amd64.
```

Isso evita emulação.

---

### Multi-platform

Pode produzir um manifest list para:

```text
linux/amd64;

linux/arm64.
```

Exige testes e estratégia de cache.

Será aprofundado futuramente.

---

### Build output

O action pode produzir:

- digest;
- metadata;
- image ID;
- build record.

O digest será um output do job.

---

### Image policy

Define gates obrigatórios.

Exemplo:

```text
user não root;

healthcheck;

labels;

porta;

entrypoint;

sem build tools;

sem secrets.
```

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
.\scripts\quality-gate\run-coverage-report.ps1
```

Depois:

```powershell
.\scripts\maven-pipeline\verify-maven-artifact.ps1
```

---

### 2. Revisar o Dockerfile

Confirme:

```text
multi-stage;

builder separado;

runtime mínimo;

USER não root;

COPY com owner;

HEALTHCHECK;

ENTRYPOINT;

sem secret;

sem Maven no runtime.
```

O Dockerfile não deve baixar dependências no runtime.

---

### 3. Revisar `.dockerignore`

Inclua:

```text
.git
.github
.idea
.vscode
target
docs
scripts
.env
*.log
coverage
secrets
```

Se o Dockerfile depende de um script em `scripts`, não exclua esse caminho.

No laboratório, o healthcheck está em:

```text
docker/healthcheck.sh.
```

Esse caminho precisa permanecer no contexto.

---

### 4. Criar política de imagem

Arquivo:

```text
pipeline/docker/image-policy.yaml
```

Conteúdo conceitual:

```yaml
image:
  platform:
    - linux/amd64

  runtime:
    non_root: true
    healthcheck: required
    shell: optional
    build_tools: forbidden

  secrets:
    dockerfile_arg: forbidden
    dockerfile_env: forbidden
    labels: forbidden

  identity:
    tag_required: true
    digest_required: true
    revision_label: required
```

---

### 5. Criar política de tags

Arquivo:

```text
pipeline/docker/tag-policy.yaml
```

Defina:

```yaml
tags:
  pull_request:
    - "pr-<number>"

  branch:
    - "branch-<sanitized>"

  commit:
    - "sha-<short-sha>"

  ci:
    - "ci-<run-number>"

  forbidden:
    - latest
    - production
    - stable
```

As tags proibidas podem existir em outra política, mas não nesta etapa.

---

### 6. Criar contrato de build

Arquivo:

```text
pipeline/docker/build-contract.yaml
```

Inclua:

- context;
- Dockerfile;
- target;
- platform;
- tags;
- labels;
- cache;
- push;
- outputs;
- gates;
- timeout;
- owner.

---

### 7. Criar registry local no workflow

No job:

```yaml
services:
  registry:
    image:
      registry:2

    ports:
      - 5000:5000
```

O serviço existe durante o job.

Não use esse registry para produção.

---

### 8. Adicionar job Docker

```yaml
  docker-build-push:
    name:
      Docker build and push

    needs:
      - metadata
      - maven-unit
      - maven-integration
      - maven-quality-gate
      - maven-package

    runs-on:
      ubuntu-latest

    timeout-minutes:
      30

    permissions:
      contents:
        read

    services:
      registry:
        image:
          registry:2

        ports:
          - 5000:5000
```

Nenhuma permission de package é necessária.

---

### 9. Fazer checkout

```yaml
    steps:
      - name:
          Checkout repository

        uses:
          actions/checkout@v6
```

---

### 10. Configurar Buildx

```yaml
      - name:
          Set up Docker Buildx

        uses:
          docker/setup-buildx-action@v4
```

O builder padrão usa driver adequado ao BuildKit.

---

### 11. Definir repository local

No job:

```yaml
    env:
      LOCAL_IMAGE_REPOSITORY:
        localhost:5000/formacao-java/m16-integrations
```

O nome é controlado.

---

### 12. Gerar metadata

```yaml
      - name:
          Generate Docker metadata

        id:
          docker_meta

        uses:
          docker/metadata-action@v6

        with:
          images:
            ${{ env.LOCAL_IMAGE_REPOSITORY }}

          tags:
            |
              type=sha,prefix=sha-
              type=raw,value=ci-${{ github.run_number }}

          labels:
            |
              org.opencontainers.image.title=Formacao Java Integrations
              org.opencontainers.image.description=Laboratorio de integracoes da formacao Java Backend
```

O action adiciona outros labels com base no contexto.

---

### 13. Validar tags

Crie um step:

```yaml
      - name:
          Validate generated tags

        env:
          DOCKER_TAGS:
            ${{ steps.docker_meta.outputs.tags }}

        run: |
          set -Eeuo pipefail

          test -n "${DOCKER_TAGS}"

          if grep -Eq '(^|:)latest($|[[:space:]])' \
            <<< "${DOCKER_TAGS}"; then
            echo "Tag latest is forbidden."
            exit 1
          fi
```

---

### 14. Build e push

```yaml
      - name:
          Build and push Docker image

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

Não passe secrets como build args.

---

### 15. Capturar digest

O output é:

```text
steps.docker_build.outputs.digest.
```

Valide:

```yaml
      - name:
          Validate image digest

        env:
          IMAGE_DIGEST:
            ${{ steps.docker_build.outputs.digest }}

        run: |
          set -Eeuo pipefail

          test -n "${IMAGE_DIGEST}"

          grep -Eq '^sha256:[0-9a-f]{64}$' \
            <<< "${IMAGE_DIGEST}"
```

---

### 16. Criar referência imutável

Use o repository com digest:

```yaml
      - name:
          Build immutable image reference

        id:
          image_ref

        env:
          IMAGE_REPOSITORY:
            ${{ env.LOCAL_IMAGE_REPOSITORY }}

          IMAGE_DIGEST:
            ${{ steps.docker_build.outputs.digest }}

        run: |
          set -Eeuo pipefail

          image_reference="${IMAGE_REPOSITORY}@${IMAGE_DIGEST}"

          echo "value=${image_reference}" \
            >> "${GITHUB_OUTPUT}"

          echo "Image reference: ${image_reference}"
```

---

### 17. Fazer pull pelo digest

```yaml
      - name:
          Pull pushed image by digest

        env:
          IMAGE_REFERENCE:
            ${{ steps.image_ref.outputs.value }}

        run: |
          set -Eeuo pipefail

          docker pull \
            "${IMAGE_REFERENCE}"
```

Esse step valida o registry.

---

### 18. Inspecionar user

```yaml
      - name:
          Verify non-root runtime

        env:
          IMAGE_REFERENCE:
            ${{ steps.image_ref.outputs.value }}

        run: |
          set -Eeuo pipefail

          runtime_user="$(
            docker image inspect \
              "${IMAGE_REFERENCE}" \
              --format '{{.Config.User}}'
          )"

          test -n "${runtime_user}"

          if [[ "${runtime_user}" == "0" ]] \
            || [[ "${runtime_user}" == "root" ]]; then
            echo "Runtime user must not be root."
            exit 1
          fi
```

---

### 19. Inspecionar healthcheck

```yaml
      - name:
          Verify healthcheck

        env:
          IMAGE_REFERENCE:
            ${{ steps.image_ref.outputs.value }}

        run: |
          set -Eeuo pipefail

          health_test="$(
            docker image inspect \
              "${IMAGE_REFERENCE}" \
              --format '{{json .Config.Healthcheck.Test}}'
          )"

          test "${health_test}" != "null"

          grep -q "healthcheck" \
            <<< "${health_test}"
```

A expressão exata precisa corresponder ao script real.

---

### 20. Inspecionar labels

Valide:

- revision;
- source;
- title;
- description;
- version;
- created.

Não aceite valores vazios nos labels obrigatórios.

---

### 21. Verificar ausência de Maven

Crie container sem iniciar a aplicação:

```bash
docker run \
  --rm \
  --entrypoint sh \
  "${IMAGE_REFERENCE}" \
  -c 'command -v mvn >/dev/null && exit 1 || exit 0'
```

Se a imagem não possui shell, use `docker export` ou outro gate.

A policy precisa aceitar runtime distroless no futuro.

---

### 22. Verificar ausência de source

Inspecione paths esperados.

O runtime não deve conter:

- `src`;
- `pom.xml`;
- `.git`;
- `.env`;
- arquivos de secret.

---

### 23. Executar smoke da imagem publicada

Inicie:

```bash
container_id="$(
  docker run \
    --detach \
    --rm \
    --name ci-image-smoke \
    --publish 18084:8084 \
    "${IMAGE_REFERENCE}"
)"
```

Forneça apenas configuração de teste não sensível.

Quando banco e Kafka forem obrigatórios, use Compose de smoke ou profile controlado.

Aguarde health com timeout.

---

### 24. Parar o smoke

Use `trap` ou step com `if: always()`.

Nenhum container deve ficar no runner após o job.

---

### 25. Criar outputs do job

No job:

```yaml
    outputs:
      image_repository:
        ${{ steps.image_output.outputs.repository }}

      image_digest:
        ${{ steps.docker_build.outputs.digest }}

      image_reference:
        ${{ steps.image_ref.outputs.value }}
```

Crie um step `image_output` para o repository.

---

### 26. Criar evidência JSON

Arquivo gerado no job:

```text
docker-build-evidence.json.
```

Exemplo:

```json
{
  "commit": "runtime-value",
  "shortSha": "runtime-value",
  "runNumber": "runtime-value",
  "repository": "localhost:5000/formacao-java/m16-integrations",
  "digest": "runtime-value",
  "platform": "linux/amd64",
  "target": "runtime",
  "pushed": true,
  "pulledByDigest": true,
  "nonRoot": true,
  "healthcheck": true
}
```

Valores reais são gerados pelo script.

Não comite o arquivo produzido.

---

### 27. Publicar evidência

```yaml
      - name:
          Upload Docker build evidence

        if:
          always()

        uses:
          actions/upload-artifact@v4

        with:
          name:
            docker-build-evidence-${{ needs.metadata.outputs.short_sha }}

          path:
            docker-build-evidence.json

          if-no-files-found:
            error

          retention-days:
            14
```

Use o path real do step.

---

### 28. Criar summary Docker

Inclua:

- tags;
- digest;
- platform;
- push;
- pull;
- non-root;
- healthcheck;
- artifact.

Não imprima Docker config.

---

### 29. Atualizar summary final

O job final passa a depender de:

```text
docker-build-push.
```

Inclua:

- Docker result;
- image digest;
- image reference.

Se o Docker job falha, o summary final falha.

---

### 30. Criar script de contexto

Arquivo:

```text
validate-docker-context.ps1
```

Valide:

- Dockerfile;
- `.dockerignore`;
- health script;
- JAR strategy;
- ausência de secrets;
- tamanho do contexto;
- paths obrigatórios.

---

### 31. Criar registry local

Arquivo:

```text
start-local-registry.ps1
```

Responsabilidades:

- validar Docker;
- remover registry antigo controlado;
- iniciar `registry:2`;
- publicar 5000;
- aguardar;
- registrar container;
- não expor além de localhost quando possível.

---

### 32. Criar build e push local

Arquivo:

```text
build-and-push-local.ps1
```

Parâmetros:

```text
-Tag;

-Repository;

-Platform.
```

Fluxo:

1. validar tag;
2. proibir latest;
3. configurar Buildx;
4. build;
5. push;
6. obter digest;
7. imprimir referência;
8. salvar evidência.

---

### 33. Criar verificação local

Arquivo:

```text
verify-pushed-image.ps1
```

Valide:

- pull por digest;
- user;
- healthcheck;
- labels;
- entrypoint;
- exposed port;
- source ausente;
- secret ausente;
- smoke.

---

### 34. Criar inspeção de metadata

Arquivo:

```text
inspect-build-metadata.ps1
```

Mostre:

- tags;
- labels;
- digest;
- image ID local quando existir;
- architecture;
- OS;
- created;
- size.

---

### 35. Criar stop seguro

Arquivo:

```text
stop-local-registry.ps1
```

Pare somente o registry do laboratório.

Não remova imagens ou volumes sem parâmetro explícito.

---

### 36. Criar arquitetura

Arquivo:

```text
DOCKER_PIPELINE_ARCHITECTURE.md
```

Diagrama:

```text
Maven gates
     |
     v
Docker metadata
     |
     v
Buildx + BuildKit
     |
     v
registry local :5000
     |
     v
digest
     |
     v
pull + inspect + smoke
     |
     v
candidate evidence
```

---

### 37. Criar política de build

Arquivo:

```text
DOCKER_BUILD_POLICY.md
```

Inclua:

- build após gates;
- path context;
- target runtime;
- single platform;
- sem secrets;
- sem latest;
- digest obrigatório;
- push obrigatório;
- pull obrigatório;
- timeout;
- cleanup.

---

### 38. Criar política de cache

Arquivo:

```text
DOCKER_CACHE_POLICY.md
```

Inclua:

- `type=gha`;
- miss aceitável;
- chave implícita;
- invalidação;
- conteúdo não promovível;
- não armazenar secret;
- investigação de cache poisoning.

---

### 39. Criar política de verificação

Arquivo:

```text
PUSH_VERIFICATION_POLICY.md
```

Defina:

```text
push retornou digest;

digest possui formato válido;

pull por digest funciona;

imagem passa gates;

smoke passa;

evidência existe.
```

---

### 40. Criar matriz de testes

Arquivo:

```text
DOCKER_PIPELINE_TEST_MATRIX.md
```

Cenários:

- gates Maven verdes;
- gate Maven vermelho;
- Dockerfile válido;
- Dockerfile inválido;
- `.dockerignore` inválido;
- tag latest;
- registry indisponível;
- push falha;
- digest ausente;
- pull falha;
- user root;
- healthcheck ausente;
- label ausente;
- source presente;
- secret presente;
- smoke falha;
- cache miss;
- cache hit;
- job cancelado.

---

### 41. Simular falha do Dockerfile

Altere temporariamente o target.

Confirme:

- build falha;
- push não conclui;
- digest não existe;
- evidence indica falha;
- summary final fica vermelho.

Restaure.

---

### 42. Simular runtime root

Remova temporariamente o `USER`.

Confirme:

- build e push podem concluir;
- gate pós-push falha;
- imagem não vira candidata.

Restaure.

---

### 43. Simular registry indisponível

Pare o registry antes do push.

Confirme:

- push falha;
- não existe digest válido;
- workflow falha;
- retry automático não esconde a causa.

Restaure.

---

### 44. Revisar build record

O build-push action pode gerar summary e build record.

Não baixe artifacts indiscriminadamente por glob.

Quando um workflow usa download de todos os artifacts, filtre arquivos de build record conforme a policy.

---

### 45. Criar troubleshooting

Arquivo:

```text
DOCKER_PIPELINE_TROUBLESHOOTING.md
```

Inclua:

- context errado;
- Dockerfile não encontrado;
- target inexistente;
- registry connection refused;
- tag inválida;
- push negado;
- digest vazio;
- cache sem acesso;
- runtime root;
- healthcheck nulo;
- JAR ausente;
- source dentro da imagem;
- secret em layer;
- smoke timeout;
- porta ocupada;
- artifact ausente.

---

### 46. Executar gate local

Execute:

```powershell
.\scripts\docker-pipeline\validate-docker-context.ps1

.\scripts\docker-pipeline\start-local-registry.ps1

.\scripts\docker-pipeline\build-and-push-local.ps1 `
  -Tag `
  "sha-local"

.\scripts\docker-pipeline\verify-pushed-image.ps1

.\scripts\docker-pipeline\inspect-build-metadata.ps1

.\scripts\docker-pipeline\stop-local-registry.ps1
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### A imagem passou a depender dos gates

Docker não executa quando Maven ou cobertura falham.

### Tags ganharam política

Nomes humanos foram separados da identidade imutável.

### Metadata virou automática

Labels e tags derivam do contexto do workflow.

### Buildx ganhou um builder explícito

BuildKit pode usar cache e outputs avançados.

### Push foi validado de verdade

Um registry efêmero recebeu a imagem.

### O digest virou output

Jobs seguintes podem referenciar conteúdo imutável.

### A imagem foi recuperada do registry

A validação não dependeu apenas do cache local.

### Runtime gates continuaram ativos

Non-root, healthcheck, labels e ausência de secrets foram verificados.

### Evidências viraram artifact

O pipeline preserva commit, tags, digest e resultados.

### A próxima aula ganhou uma fronteira clara

GHCR adicionará autenticação e persistência sem mudar o contrato de build.

---

## Erros comuns importantes

### Construir antes dos testes

Imagem inválida consome tempo e pode ser publicada.

### Usar `latest`

O conteúdo fica ambíguo.

### Promover por tag apenas

Uma tag pode mudar.

### Usar secret como build arg

O valor pode aparecer em histórico ou layers.

### Confiar apenas no push

A imagem publicada pode não passar nos gates.

### Verificar imagem local em vez do registry

O push não é realmente comprovado.

### Usar cache como imagem

Cache não é artifact promovível.

### Omitir `.dockerignore`

Contexto fica grande e arriscado.

### Executar multi-platform sem necessidade

Tempo, cache e diagnóstico ficam mais complexos.

### Dar `packages: write` nesta aula

GHCR pertence à aula 523.

### Fazer retry de push indefinidamente

Falha de registry precisa ser visível.

### Antecipar scan

A aula 524 terá esse objetivo.

---

## Comandos úteis

### Iniciar registry

```powershell
docker run `
  --detach `
  --name `
  m17-local-registry `
  --publish `
  5000:5000 `
  registry:2
```

### Build e push

```powershell
docker buildx build `
  --platform `
  linux/amd64 `
  --target `
  runtime `
  --tag `
  localhost:5000/formacao-java/m16-integrations:sha-local `
  --push `
  .
```

### Consultar digest

```powershell
docker buildx imagetools inspect `
  localhost:5000/formacao-java/m16-integrations:sha-local
```

### Pull por digest

```powershell
docker pull `
  localhost:5000/formacao-java/m16-integrations@sha256:...
```

### Inspecionar user

```powershell
docker image inspect `
  localhost:5000/formacao-java/m16-integrations@sha256:... `
  --format `
  "{{.Config.User}}"
```

---

## Exercício guiado

### Parte 1 — Policy

Defina imagem, tags e contrato.

### Parte 2 — Registry

Inicie registry efêmero.

### Parte 3 — Metadata

Gere tags e labels.

### Parte 4 — Buildx

Configure builder e cache.

### Parte 5 — Push

Publique a imagem.

### Parte 6 — Digest

Crie referência imutável.

### Parte 7 — Pull

Recupere do registry.

### Parte 8 — Gates

Valide runtime e smoke.

### Parte 9 — Evidence

Publique artifact e summary.

### Parte 10 — Falhas

Comprove bloqueios.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 521 foi preservada;
- Buildx foi definido;
- BuildKit foi definido;
- builder foi definido;
- build context foi definido;
- `.dockerignore` foi revisado;
- tag foi definida;
- digest foi definido;
- label OCI foi definida;
- registry foi definido;
- push foi definido;
- pull por digest foi definido;
- cache foi definido;
- GHA cache foi definido;
- path context foi usado;
- Git context foi diferenciado;
- single platform foi usada;
- multi-platform foi discutida;
- imagem depende dos gates Maven;
- job Docker depende de unit;
- job Docker depende de integration;
- job Docker depende do quality gate;
- job Docker depende do package;
- registry local foi declarado;
- registry usa porta 5000;
- registry foi classificado como efêmero;
- nenhuma credencial externa foi usada;
- checkout foi usado;
- setup-buildx v4 foi usado;
- metadata-action v6 foi usado;
- build-push-action v7 foi usado;
- repository local foi controlado;
- metadata gerou tags;
- metadata gerou labels;
- tag SHA foi criada;
- tag de run foi criada;
- latest foi proibida;
- build context correto foi usado;
- Dockerfile correto foi usado;
- target runtime foi usado;
- platform linux/amd64 foi usada;
- push true foi usado;
- labels foram passados;
- cache-from GHA foi usado;
- cache-to GHA mode max foi usado;
- secrets não foram passados como build args;
- digest foi capturado;
- formato SHA-256 foi validado;
- referência repository@digest foi criada;
- pull por digest foi executado;
- user não root foi validado;
- healthcheck foi validado;
- labels obrigatórios foram validados;
- Maven ausente no runtime foi validado;
- source ausente foi validado;
- pom ausente foi validado;
- Git ausente foi validado;
- env ausente foi validado;
- secret ausente foi validado;
- smoke da imagem publicada foi executado;
- smoke teve timeout;
- container de smoke foi removido;
- outputs do job foram criados;
- image repository foi output;
- image digest foi output;
- image reference foi output;
- evidence JSON foi criado;
- evidence não contém secrets;
- artifact de evidência foi publicado;
- artifact usa always;
- retention foi definida;
- summary Docker foi criado;
- summary final depende do Docker;
- script de contexto foi criado;
- script de registry foi criado;
- script de build push foi criado;
- script de verificação foi criado;
- script de metadata foi criado;
- script de stop foi criado;
- arquitetura foi documentada;
- build policy foi criada;
- tag policy foi criada;
- label policy foi criada;
- cache policy foi criada;
- push verification policy foi criada;
- test matrix foi criada;
- falha de Dockerfile foi simulada;
- push não gerou candidato em falha;
- runtime root foi simulado;
- gate pós-push falhou;
- registry indisponível foi simulado;
- push falhou corretamente;
- alterações temporárias foram restauradas;
- build record foi discutido;
- troubleshooting foi criado;
- cache não foi tratado como artifact;
- digest foi tratado como identidade;
- QEMU não foi usado;
- GHCR não foi configurado;
- packages write não foi adicionado;
- login externo não foi criado;
- scan não foi implementado;
- assinatura não foi implementada;
- deploy não foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 523 está correta.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/Dockerfile `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.dockerignore `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pipeline/docker `
  scripts/docker-pipeline `
  docs/devops/docker-pipeline `
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
git commit -m "ci(m17): adicionar build e push Docker"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- secret;
- `.env`;
- Docker config;
- token;
- password;
- target;
- JAR local;
- registry data;
- container exportado;
- image tar;
- evidence local;
- cache;
- configuração GHCR da aula 523.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o pipeline passou a produzir uma imagem candidata.

O fluxo ficou:

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

Você comprovou que:

- Docker só executa depois dos gates;
- Buildx cria um builder controlado;
- metadata-action gera tags e labels;
- build-push-action publica a imagem;
- cache GHA acelera layers;
- tag é uma referência humana;
- digest é a identidade imutável;
- push precisa ser seguido por pull;
- a imagem publicada precisa passar os gates;
- non-root e healthcheck continuam obrigatórios;
- secrets não entram em build args;
- registry efêmero permite testar o fluxo sem credencial externa;
- evidence e outputs preparam jobs seguintes.

A próxima aula será:

```text
523 - M17.18 - Registry GitHub Container Registry
```

Nela, você irá substituir o registry efêmero pelo GHCR, configurar autenticação e permissões, publicar packages persistentes e validar pull por digest.

Nenhuma configuração do GitHub Container Registry foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei Dockerfile e contexto.
- [ ] Criei políticas de imagem e tag.
- [ ] Configurei Buildx.
- [ ] Gerei metadata.
- [ ] Fiz push no registry local.
- [ ] Recuperei por digest.
- [ ] Validei runtime e smoke.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O registry local não inicia

Verifique porta 5000, Docker e nome de container.

### Buildx não consegue fazer push

Revise builder, repository, registry e conectividade.

### O digest está vazio

O push pode não ter concluído ou o output foi referenciado incorretamente.

### Pull por digest falha

O manifest não está disponível no repository informado.

### O gate detecta root

O Dockerfile final não definiu `USER` ou o target está incorreto.

### Healthcheck aparece nulo

O stage runtime não contém `HEALTHCHECK`.

### A imagem contém Maven

O stage builder foi publicado por engano.

### A imagem contém source

O Dockerfile copiou o contexto inteiro ou usou target errado.

### O cache não é restaurado

A execução deve continuar; revise acesso e backend.

### A tag `latest` apareceu

Revise as regras do metadata-action.

### O smoke fica aguardando

A aplicação pode precisar de dependências ou a porta está incorreta.

### O job pede `packages: write`

Remova; essa permissão pertence à aula 523.

---

## Perguntas de revisão

1. O que é Buildx?
2. O que é BuildKit?
3. O que é builder?
4. O que é build context?
5. Para que serve `.dockerignore`?
6. O que é tag?
7. O que é digest?
8. O que é OCI label?
9. O que faz push?
10. Por que fazer pull por digest?
11. O que é cache GHA?
12. Cache é imagem?
13. Por que usar path context?
14. Por que não usar latest?
15. Por que o job depende do quality gate?
16. O que metadata-action produz?
17. O que build-push-action produz?
18. Por que validar non-root após o push?
19. O que não foi configurado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Interface avançada de build.
2. Engine de build.
3. Instância executora.
4. Arquivos acessíveis ao build.
5. Reduzir e proteger contexto.
6. Nome mutável.
7. Identidade de conteúdo.
8. Metadata OCI.
9. Publicar layers e manifest.
10. Provar conteúdo armazenado.
11. Cache do workflow.
12. Não.
13. Usar workspace auditável.
14. Evitar ambiguidade.
15. Impedir imagem inválida.
16. Tags e labels.
17. Digest e metadata.
18. Validar o publicado.
19. GHCR.
20. Registry GitHub Container Registry.

---

## Desafio opcional

Modele um build multi-platform.

Requisitos:

- `linux/amd64`;
- `linux/arm64`;
- QEMU;
- manifest list;
- cache;
- tempo;
- testes por arquitetura;
- digest do índice;
- digest dos manifests;
- nenhum push externo;
- nenhuma mudança no workflow principal.

O objetivo é compreender a diferença entre imagem de plataforma única e índice multi-platform sem antecipar GHCR.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 522 - M17.17 - Pipeline Docker build push

- Continuei após os testes, cobertura e quality gates.
- Mantive Docker dependente dos gates Maven.
- Revisei o Dockerfile multi-stage.
- Revisei o runtime não root.
- Revisei o healthcheck.
- Revisei `.dockerignore` e o contexto.
- Criei políticas de imagem, tags e build.
- Diferenciei Buildx e BuildKit.
- Configurei `docker/setup-buildx-action@v4`.
- Configurei `docker/metadata-action@v6`.
- Configurei `docker/build-push-action@v7`.
- Usei path context.
- Mantive plataforma `linux/amd64`.
- Criei registry local efêmero.
- Gerei tags por SHA e execução.
- Proibi `latest`.
- Gerei labels OCI.
- Configurei cache GHA.
- Construí o target runtime.
- Fiz push no registry local.
- Capturei o digest.
- Criei referência imutável.
- Fiz pull por digest.
- Validei user não root.
- Validei healthcheck.
- Validei labels.
- Validei ausência de Maven, source e secrets.
- Executei smoke da imagem publicada.
- Criei outputs de repository, digest e reference.
- Criei evidence JSON.
- Publiquei evidências como artifact.
- Atualizei o summary final.
- Criei scripts locais de registry, build, push e verificação.
- Simulei falha de Dockerfile, runtime root e registry indisponível.
- Não antecipei GHCR.
- Próxima aula: Registry GitHub Container Registry.
```

---

## Referência técnica curta

- Docker Buildx.
- Moby BuildKit.
- Docker Build Push Action.
- Docker Metadata Action.
- GitHub Actions Cache Backend.
- OCI Image Specification.
- OCI Image Labels.
- Container Registry.
- Docker Image Digest.
- Build Once, Promote Many.

Regra final:

```text
o pipeline Docker transforma o JAR aprovado em uma imagem candidata somente depois de unitários, integração, cobertura e package: `docker/setup-buildx-action@v4` inicializa o builder, `docker/metadata-action@v6` produz tags e labels OCI sem `latest`, e `docker/build-push-action@v7` constrói o target runtime para `linux/amd64`, usa cache GHA e envia a imagem a um registry local efêmero; o push precisa retornar um digest SHA-256 válido, a referência `repository@digest` é recuperada do registry e a cópia publicada passa por gates de user não root, healthcheck, labels, ausência de Maven, source e secrets e smoke com timeout; repository, digest e referência tornam-se outputs, enquanto um artifact registra evidências não sensíveis; cache continua descartável, tag continua mutável e digest torna-se a identidade de promoção; sem login externo, `packages: write`, GHCR, scan ou deploy antecipados, a aula 523 poderá substituir o registry efêmero pelo GitHub Container Registry preservando o mesmo contrato de build e verificação.
```
