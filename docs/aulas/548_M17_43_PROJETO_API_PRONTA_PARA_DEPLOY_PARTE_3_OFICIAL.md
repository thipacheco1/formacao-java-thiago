# 548 - M17.43 - Projeto API pronta para deploy parte 3

## Apresentação da aula

Na aula 546, você preparou a aplicação internamente para deploy.

A `orders-api` passou a possuir:

```text
configuração externa e tipada;

profiles claros;

validação de startup;

build information;

release information;

liveness;

readiness;

graceful shutdown;

logging estruturado;

correlation ID;

Problem Details;

testes operacionais.
```

Na aula 547, essa aplicação foi transformada em release candidate verificável.

O projeto passou a possuir:

```text
JAR com checksum;

imagem non-root;

labels OCI;

digest local;

SBOM;

vulnerability scan;

manifests Kubernetes;

base e overlay;

ServiceAccount;

PDB;

HPA;

NetworkPolicy;

workflow de release candidate;

release bundle;

evidence da parte 2.
```

A aplicação, o artifact, a imagem e os manifests estão prontos. Falta provar promoção, referência imutável, deploy, smoke test, observabilidade, regressão, rollback e evidence final.

A pergunta central desta aula será:

```text
como concluir
o ciclo de entrega

sem reconstruir
o release candidate

e comprovando
deploy,
validação
e rollback?
```

A resposta será construída em um ambiente Kubernetes local e isolado.

Nenhuma cloud pública será necessária.

A promoção usará o mesmo JAR, imagem, release ID, commit e manifests, com registry local, digest, namespace exclusivo, Secret efêmero, deploy controlado e evidence sanitizada.

A regra central será:

```text
build uma vez;

verifique uma vez;

promova o mesmo conteúdo;

implante por digest;

valide a release executada;

reverta com segurança
quando o gate falhar.
```

Esta aula conclui o projeto sem conta cloud, registry corporativo, domínio, certificado, serviço gerenciado, credencial permanente, Secret corporativo ou produção.

Ambiente final:

```text
namespace:
formacao-java-deploy-final.
```

O registry será local e descartável.

O deploy final do projeto será executado apenas nesse ambiente de laboratório.

Próxima aula oficial:

```text
549 - M17.44 - Revisao DevOps parte 1
```

Por isso, esta aula encerra a construção do projeto e prepara uma base verificável para a revisão técnica.

---

## Onde estamos na formação

A sequência oficial é:

```text
546:
Projeto API pronta para deploy parte 1.

547:
Projeto API pronta para deploy parte 2.

548:
Projeto API pronta para deploy parte 3.

549:
Revisao DevOps parte 1.

550:
Revisao DevOps parte 2.
```

A parte 1 respondeu:

```text
como tornar
a aplicação
implantável e observável?
```

A parte 2 respondeu:

```text
como transformar
a aplicação
em release candidate?
```

A parte 3 responderá:

```text
como promover,
implantar,
validar
e reverter
o mesmo release candidate?
```

Nesta aula:

```text
promotion:
sim.

rebuild:
não.

registry local:
sim.

digest de registry:
sim.

namespace final:
sim.

Secret efêmero:
sim.

deploy integrado:
sim.

rollout:
sim.

smoke test:
sim.

release consistency:
sim.

observabilidade:
sim.

falha controlada:
sim.

rollback:
sim.

cleanup:
sim.

evidence final:
sim.

cloud pública:
não.

produção:
não.
```

A regra operacional será:

```text
verificar bundle;

promover sem rebuild;

resolver digest;

renderizar;

validar ambiente;

implantar;

observar;

aprovar ou reverter;

registrar;

encerrar.
```

---

## Objetivo prático

O projeto continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
release-promotion
├── promotion-contract.yaml
├── promotion-source-contract.yaml
├── immutable-image-reference.yaml
├── target-environment-readiness.yaml
├── final-deployment-gate.yaml
├── rollback-verification-contract.yaml
├── project-completion-checklist.yaml
└── final-acceptance-evidence.yaml

k8s/deploy-ready
└── overlays
    └── final-simple
        ├── namespace.yaml
        ├── ingress.yaml
        ├── release-metadata.yaml
        ├── patch-deployment.yaml
        ├── patch-networkpolicy.yaml
        └── kustomization.yaml

scripts/project/deploy-ready
├── validate-part-2-bundle.ps1
├── export-approved-image.ps1
├── start-local-registry.ps1
├── promote-image-to-local-registry.ps1
├── resolve-registry-digest.ps1
├── prepare-final-manifests.ps1
├── validate-target-environment.ps1
├── create-final-ephemeral-secret.ps1
├── deploy-approved-release.ps1
├── wait-final-rollout.ps1
├── run-final-smoke-test.ps1
├── verify-release-consistency.ps1
├── verify-final-observability.ps1
├── simulate-release-regression.ps1
├── rollback-final-release.ps1
├── collect-final-project-evidence.ps1
├── cleanup-final-environment.ps1
└── verify-project-completion.ps1

.github/workflows
└── orders-api-ephemeral-deploy.yml

docs/project/deploy-ready
├── RELEASE_PROMOTION.md
├── FINAL_TARGET_ENVIRONMENT.md
├── FINAL_DEPLOYMENT_RUNBOOK.md
├── FINAL_SMOKE_TEST.md
├── FINAL_OBSERVABILITY_CHECK.md
├── FINAL_ROLLBACK_RUNBOOK.md
├── FINAL_PROJECT_EVIDENCE.md
├── PROJECT_COMPLETION_REPORT.md
├── PART_3_TEST_MATRIX.md
└── PART_3_TROUBLESHOOTING.md
```

Ao final, você terá bundle validado, imagem promovida sem rebuild, digest resolvido, manifests finais, ambiente aprovado, deploy saudável, smoke test, regressão controlada, rollback e evidence final.

Você irá:

1. confirmar a parte 2;
2. verificar o release bundle;
3. confirmar checksums;
4. exportar a imagem aprovada;
5. iniciar registry local;
6. importar a mesma imagem;
7. resolver digest;
8. criar contrato de promoção;
9. criar overlay final;
10. fixar imagem por digest;
11. validar o ambiente alvo;
12. criar namespace;
13. criar Secret efêmero;
14. renderizar manifests;
15. executar dry-run;
16. aplicar a release;
17. acompanhar rollout;
18. validar Pods;
19. validar Service;
20. validar Ingress ou port-forward;
21. executar smoke test;
22. validar release endpoint;
23. validar correlation ID;
24. validar logs e eventos;
25. registrar aprovação;
26. simular regressão;
27. detectar falha;
28. executar rollback;
29. validar recuperação;
30. restaurar a release final saudável;
31. coletar evidence;
32. gerar relatório;
33. executar cleanup opcional;
34. validar conclusão;
35. commitar;
36. preparar a revisão DevOps.

---

## Conceito essencial

### Promotion

Movimento de um artifact já aprovado para outro estágio sem reconstrução.

---

### Immutable reference

Referência vinculada ao conteúdo, como digest de imagem.

---

### Target environment

Ambiente que receberá a release.

---

### Deployment gate

Conjunto de condições que precisam passar antes ou depois da implantação.

---

### Release consistency

Garantia de que commit, version, release ID, image digest e manifests representam a mesma release.

---

### Runtime verification

Confirmação da identidade e do comportamento da aplicação em execução.

---

### Rollback verification

Prova de que a revisão anterior foi restaurada e voltou a atender os gates.

---

### Final evidence

Conjunto sanitizado de resultados que comprova conclusão do projeto.

---

### Ephemeral environment

Ambiente temporário criado para validação e removido de forma controlada.

---

### Build once, promote many

Princípio de construir uma única vez e promover o mesmo conteúdo entre estágios.

---

## Mão na massa guiada

### 1. Confirmar a conclusão da parte 2

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\project\deploy-ready\verify-part-1-baseline.ps1

.\scripts\project\deploy-ready\verify-part-2-baseline.ps1
```

Confirme:

- artifact aprovado;
- checksum válido;
- imagem aprovada;
- usuário non-root;
- SBOM aprovada;
- scan aprovado;
- manifests aprovados;
- workflow sem push;
- workflow sem deploy;
- bundle íntegro;
- image published igual a `false`;
- deployment executed igual a `false`.

Não prossiga com bundle inconsistente.

---

### 2. Criar contrato de promoção

Arquivo:

```text
release-promotion/promotion-contract.yaml
```

Conteúdo:

```yaml
promotion:
  source:
    releaseBundle:
      required

    verification:
      required

  rebuild:
    forbidden

  identity:
    releaseId:
      immutable

    version:
      immutable

    commit:
      immutable

  image:
    content:
      unchanged

    targetReference:
      digestRequired

  manifests:
    releaseIdentity:
      consistent

  deployment:
    targetEnvironment:
      isolated

  evidence:
    required
```

---

### 3. Criar contrato da origem

Arquivo:

```text
promotion-source-contract.yaml
```

Conteúdo:

```yaml
source:
  bundle:
    checksum:
      required

    gateStatus:
      approved

  artifact:
    sha256:
      required

  image:
    localImageId:
      required

    testStatus:
      approved

  supplyChain:
    sbom:
      approved

    vulnerabilityGate:
      approved

  manifests:
    renderStatus:
      approved
```

---

### 4. Validar o bundle da parte 2

Execute:

```powershell
.\scripts\project\deploy-ready\validate-part-2-bundle.ps1
```

O script verifica release ID, version, commit, checksums, image identity, SBOM, scan, manifests, gates, evidence e arquivos proibidos.

Qualquer divergência bloqueia a promoção.

---

### 5. Exportar a imagem aprovada

A promoção não executará `docker build`.

O script:

```text
export-approved-image.ps1
```

usa a imagem aprovada da parte 2.

Exemplo:

```powershell
docker save `
  orders-api:rc-a1b2c3d `
  --output `
  target/promotion/orders-api-approved-image.tar
```

Depois:

```powershell
Get-FileHash `
  target/promotion/orders-api-approved-image.tar `
  -Algorithm `
  SHA256
```

---

### 6. Confirmar ausência de rebuild

O script precisa registrar:

```text
docker build executions:
zero.
```

O histórico do processo de promoção não pode conter novo build.

A mesma imagem testada será importada ou enviada ao registry local.

---

### 7. Iniciar registry local

Script:

```text
start-local-registry.ps1
```

Exemplo local:

```powershell
docker run `
  --detach `
  --restart=unless-stopped `
  --name `
  formacao-java-registry `
  --publish `
  5001:5000 `
  registry:2
```

O script valida existência, health, porta, exposição local, owner, finalidade e cleanup do registry.

Esse registry é didático e local.

---

### 8. Promover a imagem

Script:

```text
promote-image-to-local-registry.ps1
```

Fluxo:

```powershell
docker load `
  --input `
  target/promotion/orders-api-approved-image.tar

docker tag `
  orders-api:rc-a1b2c3d `
  localhost:5001/orders-api:1.0.0-a1b2c3d

docker push `
  localhost:5001/orders-api:1.0.0-a1b2c3d
```

O push é apenas para o registry local.

O conteúdo precisa permanecer idêntico.

---

### 9. Resolver o digest do registry

Script:

```text
resolve-registry-digest.ps1
```

Exemplo:

```powershell
docker image inspect `
  localhost:5001/orders-api:1.0.0-a1b2c3d
```

Quando o engine não exibir `RepoDigests` após o push, consulte o registry local por ferramenta apropriada ou puxe a tag novamente.

Saída:

```text
target/promotion/immutable-image-reference.json
```

Exemplo:

```json
{
  "repository": "localhost:5001/orders-api",
  "tag": "1.0.0-a1b2c3d",
  "digest": "sha256:example",
  "reference": "localhost:5001/orders-api@sha256:example"
}
```


---

### 10. Criar contrato de referência imutável

Arquivo:

```text
immutable-image-reference.yaml
```

Conteúdo:

```yaml
image:
  repository:
    required

  digest:
    algorithm:
      sha256

    required:
      true

  deploymentReference:
    tagOnly:
      forbidden

    repositoryAndDigest:
      required

  consistency:
    releaseId:
      required

    commit:
      required

  rebuild:
    count:
      zero
```

---

### 11. Preparar acesso do kind ao registry

Em um cluster kind, o node precisa alcançar o registry.

Use a rede Docker do kind ou o registry local já preparado no laboratório.

O script valida cluster, acesso do node ao registry, endpoint local e ausência de autenticação externa.

Como fallback, use `kind load image-archive`, preservando o image ID aprovado; o registry local continua preferido para comprovar digest.

---

### 12. Criar o namespace final

Arquivo:

```text
k8s/deploy-ready/overlays/final-simple/namespace.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: formacao-java-deploy-final
  labels:
    app.kubernetes.io/environment: final-simple
    app.kubernetes.io/part-of: orders-platform
    security.formacao-java/data-classification: internal
```

O namespace não reutiliza ambientes anteriores.

---

### 13. Criar release metadata final

Arquivo:

```text
release-metadata.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: orders-api-release
data:
  APP_ENVIRONMENT: "final-simple"
  APP_RELEASE_ID: "__RELEASE_ID__"
  APP_BUILD_COMMIT: "__COMMIT__"
  APP_IMAGE_DIGEST: "__IMAGE_DIGEST__"
```

O script substitui os marcadores durante a renderização.

Os valores finais precisam corresponder ao bundle.

---

### 14. Criar patch final do Deployment

Arquivo:

```text
patch-deployment.yaml
```

Conteúdo:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
spec:
  template:
    metadata:
      annotations:
        release.formacao-java/id: "__RELEASE_ID__"
        release.formacao-java/commit: "__COMMIT__"
        release.formacao-java/image-digest: "__IMAGE_DIGEST__"
    spec:
      terminationGracePeriodSeconds: 40

      containers:
        - name: orders-api
          envFrom:
            - configMapRef:
                name: orders-api-config

            - configMapRef:
                name: orders-api-release

            - secretRef:
                name: orders-api-secret
```

A imagem será definida na renderização por repositório e digest.

---

### 15. Criar patch final de NetworkPolicy

Arquivo:

```text
patch-networkpolicy.yaml
```

O patch precisa liberar apenas os destinos usados pelo laboratório.

No cenário sem banco externo, mantenha:

- DNS;
- ingress local;
- nenhuma saída para internet;
- nenhuma cloud;
- nenhum endpoint corporativo.

Se a aplicação precisar de banco local, adicione destino e porta explicitamente.

---

### 16. Criar Ingress final local

Arquivo:

```text
ingress.yaml
```

Conteúdo:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: orders-api
spec:
  ingressClassName: nginx

  rules:
    - host: orders-final.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: orders-api
                port:
                  name: http
```

Port-forward continua disponível como fallback.

---

### 17. Criar Kustomization final

Arquivo:

```text
kustomization.yaml
```

Conteúdo:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: formacao-java-deploy-final

resources:
  - namespace.yaml
  - ../../base
  - ingress.yaml
  - release-metadata.yaml

patches:
  - path: patch-deployment.yaml
  - path: patch-networkpolicy.yaml

images:
  - name: orders-api
    newName: __IMAGE_REPOSITORY__
    digest: __IMAGE_DIGEST__

commonLabels:
  app.kubernetes.io/environment: final-simple
```

O arquivo renderizado não pode manter marcadores não resolvidos.

---

### 18. Criar readiness do ambiente alvo

Arquivo:

```text
target-environment-readiness.yaml
```

Conteúdo:

```yaml
targetEnvironment:
  context:
    allowlisted:
      required

  cluster:
    reachable:
      required

  namespace:
    isolated:
      required

  ingressController:
    availableOrPortForwardFallback:
      required

  metricsServer:
    optionalForDeploy
    requiredForHpaValidation:
      true

  registry:
    reachableFromNodes:
      required

  secret:
    ephemeral:
      required

  capacity:
    sufficient:
      required

  previousEnvironment:
    untouched:
      required
```

---

### 19. Validar o ambiente alvo

Script:

```text
validate-target-environment.ps1
```

Ele verifica:

- contexto atual;
- cluster;
- namespaces existentes;
- capacidade;
- Ingress Controller;
- Metrics Server;
- registry;
- DNS do cluster;
- ausência do namespace final ou estado conhecido;
- nenhum recurso bloqueador;
- nenhum Secret real.

Um contexto fora da allowlist bloqueia o fluxo.

---

### 20. Criar Secret efêmero final

Script:

```text
create-final-ephemeral-secret.ps1
```

Exemplo:

```powershell
kubectl create namespace `
  formacao-java-deploy-final `
  --dry-run=client `
  --output=yaml `
  | kubectl apply `
      --filename -

kubectl create secret generic `
  orders-api-secret `
  --namespace `
  formacao-java-deploy-final `
  --from-literal=DB_USERNAME=final_local_user `
  --from-literal=DB_PASSWORD=final_local_password `
  --dry-run=client `
  --output=yaml `
  | kubectl apply `
      --filename -
```

---

### 21. Preparar manifests finais

Script:

```text
prepare-final-manifests.ps1
```

Entradas:

- release ID;
- version;
- commit;
- repository;
- digest;
- namespace.

Saída:

```text
target/final-deploy/rendered-final-manifests.yaml
```

O script renderiza em diretório temporário, resolve valores, confirma digest e metadata e calcula checksum.

---

### 22. Validar manifests finais

Execute:

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  target/final-deploy/rendered-final-manifests.yaml
```

Quando possível:

```powershell
kubectl apply `
  --dry-run=server `
  --filename `
  target/final-deploy/rendered-final-manifests.yaml
```

Execute também:

```powershell
.\scripts\cloud\security\scan-cloud-manifests.ps1
```

---

### 23. Criar gate final de deploy

Arquivo:

```text
final-deployment-gate.yaml
```

Conteúdo:

```yaml
gate:
  sourceBundle:
    approved

  rebuild:
    count:
      zero

  registryDigest:
    resolved

  targetEnvironment:
    approved

  secret:
    realValueInRepository:
      zero

  manifests:
    rendered:
      approved

    security:
      approved

    imageByDigest:
      required

  rollback:
    plan:
      approved

  deploy:
    authorized:
      true
```

---

### 24. Executar o deploy aprovado

Script:

```text
deploy-approved-release.ps1
```

Comando:

```powershell
kubectl apply `
  --filename `
  target/final-deploy/rendered-final-manifests.yaml
```

O script registra contexto, namespace, release ID, commit, digest, resources e resultado.

---

### 25. Acompanhar o rollout final

Script:

```text
wait-final-rollout.ps1
```

Execute:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-final `
  --timeout=180s
```

Depois:

```powershell
kubectl get deployment,replicaset,pod `
  --namespace `
  formacao-java-deploy-final `
  --output=wide
```

Aprovação exige réplicas disponíveis, Pods estáveis, probes aprovadas, imagem por digest e annotations corretas.

---

### 26. Validar a imagem executada

Execute:

```powershell
kubectl get pod `
  --namespace `
  formacao-java-deploy-final `
  --selector `
  app.kubernetes.io/name=orders-api `
  --output `
  jsonpath="{range .items[*]}{.metadata.name}{' '}{.status.containerStatuses[0].imageID}{'\n'}{end}"
```

Compare o `imageID` com o digest aprovado.

---

### 27. Validar Service e EndpointSlices

Execute:

```powershell
kubectl get service,endpointslice `
  --namespace `
  formacao-java-deploy-final
```

Confirme:

- Service ClusterIP;
- dois endpoints Ready;
- porta correta;
- selectors corretos;
- nenhum Service público.

---

### 28. Executar smoke test final

Script:

```text
run-final-smoke-test.ps1
```

O script abre port-forward controlado:

```powershell
kubectl port-forward `
  service/orders-api `
  18082:80 `
  --namespace `
  formacao-java-deploy-final
```

Valida:

```text
/actuator/health;

/actuator/health/liveness;

/actuator/health/readiness;

/internal/release;

endpoint funcional existente.
```

Critérios: sem `5xx`, health, readiness e liveness `UP`, correlation ID presente e release endpoint coerente.

---

### 29. Verificar consistência da release

Script:

```text
verify-release-consistency.ps1
```

Compare:

```text
bundle release ID;

ConfigMap release ID;

annotation release ID;

endpoint release ID;

bundle commit;

endpoint commit;

image digest aprovado;

Pod imageID;

manifest checksum.
```

Todos precisam representar a mesma release.

---

### 30. Validar correlation ID

Envie:

```powershell
$correlationId = [guid]::NewGuid().ToString()

Invoke-WebRequest `
  -Uri `
  http://localhost:18082/actuator/health `
  -Headers @{
    "X-Correlation-Id" = $correlationId
  }
```

Confirme:

- header de resposta;
- log correspondente;
- ausência de quebra de linha;
- ausência de vazamento para requisição seguinte.

---

### 31. Verificar observabilidade final

Script:

```text
verify-final-observability.ps1
```

Valide logs estruturados, release, correlation ID, startup, readiness, restarts, events, rollout, metrics, HPA, PDB e NetworkPolicy.

---

### 32. Revisar logs e eventos

Execute:

```powershell
kubectl logs `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-final `
  --tail=150

kubectl get events `
  --namespace `
  formacao-java-deploy-final `
  --sort-by=.metadata.creationTimestamp
```

Bloqueadores incluem Secret em log, stack trace crítica, restart loop, image pull, probes persistentes, tráfego necessário bloqueado e release divergente.

---

### 33. Registrar aprovação inicial

Após todos os gates:

```text
release status:
APPROVED_FOR_LAB.

environment:
final-simple.

promotion:
same-image.

deployment:
healthy.

smoke:
passed.

rollback-test:
pending.
```

---

### 34. Criar contrato de rollback

Arquivo:

```text
rollback-verification-contract.yaml
```

Conteúdo:

```yaml
rollback:
  healthyRevision:
    recorded:
      required

  regression:
    controlled:
      required

  detection:
    automaticOrScripted:
      required

  undo:
    required

  recovery:
    rollout:
      required

    smoke:
      required

    releaseConsistency:
      required

  data:
    destructiveChange:
      forbidden
```

---

### 35. Simular regressão controlada

Script:

```text
simulate-release-regression.ps1
```

A regressão não altera dados.

Uma opção segura é aplicar patch temporário com readiness path inválido:

```text
/actuator/health/readiness-invalid.
```

O script:

1. registra revisão saudável;
2. aplica patch controlado;
3. acompanha rollout;
4. detecta Pods não Ready;
5. coleta events;
6. registra o gatilho;
7. não espera indefinidamente;
8. chama rollback.

---

### 36. Executar rollback final

Script:

```text
rollback-final-release.ps1
```

Comando:

```powershell
kubectl rollout undo `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-final
```

Depois:

```powershell
kubectl rollout status `
  deployment/orders-api `
  --namespace `
  formacao-java-deploy-final `
  --timeout=180s
```

O rollback precisa restaurar a revisão saudável.

---

### 37. Validar recuperação

Após o rollback, Pods, endpoints, health, release, imageID, correlation ID, logs e events precisam voltar ao estado aprovado.

Execute novamente:

```powershell
.\scripts\project\deploy-ready\run-final-smoke-test.ps1

.\scripts\project\deploy-ready\verify-release-consistency.ps1

.\scripts\project\deploy-ready\verify-final-observability.ps1
```

---

### 38. Entender o limite do rollback

O rollback do Deployment não reverte schema, mensagens, arquivos, cache, Secrets, ConfigMaps, Service, Ingress, NetworkPolicy ou integrações externas.

Neste projeto, a regressão é limitada ao template do Deployment.

---

### 39. Restaurar a release final saudável

Depois do exercício de rollback, confirme qual revisão ficará ativa.

O estado final precisa ser:

```text
release aprovada;

digest aprovado;

probes corretas;

smoke aprovado;

evidence completa.
```

---

### 40. Criar workflow de deploy efêmero

Arquivo:

```text
.github/workflows/orders-api-ephemeral-deploy.yml
```

Objetivo:

- validar o ciclo em ambiente efêmero;
- não acessar cloud;
- não usar credencial corporativa;
- criar kind;
- iniciar registry local;
- promover bundle;
- deploy;
- smoke;
- rollback;
- evidence;
- cleanup.

Estrutura conceitual:

```yaml
name: Orders API Ephemeral Deploy

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Verify project
        run: mvn --batch-mode clean verify

      - name: Build release candidate
        shell: pwsh
        run: ./scripts/project/deploy-ready/build-release-artifact.ps1

      - name: Build approved image
        shell: pwsh
        run: ./scripts/project/deploy-ready/build-release-image.ps1

      - name: Verify candidate
        shell: pwsh
        run: ./scripts/project/deploy-ready/verify-part-2-baseline.ps1

      - name: Create ephemeral cluster
        run: kind create cluster --name orders-api-final

      - name: Execute final deploy flow
        shell: pwsh
        run: ./scripts/project/deploy-ready/verify-project-completion.ps1
```

Em pipeline empresarial, o artifact aprovado deve ser baixado do storage da esteira e promovido sem rebuild.

---

### 41. Manter permissões mínimas

O workflow usa:

```yaml
permissions:
  contents: read
```

Não precisa:

- OIDC;
- packages write;
- environment write;
- deployment write;
- cloud role;
- Secret de registry externo.

O ambiente é efêmero e local ao runner.

---

### 42. Criar evidence final

Script:

```text
collect-final-project-evidence.ps1
```

Arquivo:

```text
final-project-evidence.json.
```

Campos permitidos:

- project;
- module;
- lesson;
- release ID;
- version;
- commit;
- artifact checksum status;
- image digest;
- rebuild count;
- registry type local;
- target context sanitized;
- namespace;
- desired replicas;
- available replicas;
- Pod readiness;
- Service endpoints;
- health;
- liveness;
- readiness;
- smoke result;
- release consistency;
- observability status;
- regression detected;
- rollback executed;
- rollback smoke result;
- final active release;
- cloud resources zero;
- real secrets zero;
- timestamp.

---

### 43. Criar acceptance evidence final

Arquivo:

```text
final-acceptance-evidence.yaml
```

Conteúdo:

```yaml
project:
  deployability:
    approved

  artifact:
    approved

  image:
    approved

  supplyChain:
    approved

  manifests:
    approved

  promotion:
    sameContent:
      approved

    rebuildCount:
      zero

  deployment:
    finalSimple:
      approved

  smokeTest:
    approved

  releaseConsistency:
    approved

  rollback:
    approved

  evidence:
    approved

  external:
    cloudResources:
      zero

    realSecrets:
      zero

  status:
    completed
```

---

### 44. Criar checklist de conclusão

Arquivo:

```text
project-completion-checklist.yaml
```

Itens:

```yaml
completion:
  partOne:
    approved

  partTwo:
    approved

  partThree:
    approved

  buildOnce:
    demonstrated

  promotion:
    demonstrated

  immutableReference:
    demonstrated

  deployment:
    demonstrated

  smoke:
    demonstrated

  rollback:
    demonstrated

  security:
    demonstrated

  observability:
    demonstrated

  evidence:
    complete

  reviewReady:
    true
```

---

### 45. Criar documentação final

#### `RELEASE_PROMOTION.md`

Explique origem, export, registry local e digest.

#### `FINAL_TARGET_ENVIRONMENT.md`

Explique cluster, namespace, registry, Secret e boundaries.

#### `FINAL_DEPLOYMENT_RUNBOOK.md`

Explique gates, render, apply, rollout e decisão.

#### `FINAL_SMOKE_TEST.md`

Explique endpoints e critérios.

#### `FINAL_OBSERVABILITY_CHECK.md`

Explique logs, events, metrics, HPA e PDB.

#### `FINAL_ROLLBACK_RUNBOOK.md`

Explique regression, undo e recovery.

#### `FINAL_PROJECT_EVIDENCE.md`

Explique dados permitidos e proibidos.

#### `PROJECT_COMPLETION_REPORT.md`

Consolide partes 1, 2 e 3.

---

### 46. Criar matriz de testes da parte 3

Arquivo:

```text
PART_3_TEST_MATRIX.md
```

Cenários:

- parte 1 aprovada;
- parte 2 aprovada;
- bundle íntegro;
- rebuild count zero;
- image archive checksum válido;
- registry local saudável;
- push local aprovado;
- registry digest resolvido;
- image reference usa digest;
- contexto permitido;
- namespace isolado;
- Secret efêmero;
- markers resolvidos;
- dry-run aprovado;
- security scan aprovado;
- rollout aprovado;
- Pods Ready;
- Service com endpoints;
- health aprovado;
- liveness aprovada;
- readiness aprovada;
- release endpoint coerente;
- correlation ID propagado;
- logs estruturados;
- regression detectada;
- rollback executado;
- rollback smoke aprovado;
- release final saudável;
- cloud resources zero;
- real secrets zero;
- cleanup seguro.

---

### 47. Criar troubleshooting final

Arquivo:

```text
PART_3_TROUBLESHOOTING.md
```

Inclua:

- bundle inconsistente;
- image archive ausente;
- checksum divergente;
- registry não inicia;
- kind não alcança registry;
- digest não resolvido;
- manifest mantém marker;
- image reference usa tag;
- context incorreto;
- namespace já contém release desconhecida;
- Secret ausente;
- ImagePullBackOff;
- readiness falhando;
- NetworkPolicy bloqueando DNS;
- Service sem endpoints;
- release endpoint divergente;
- Pod imageID diferente;
- smoke test `5xx`;
- logs sem correlation ID;
- rollback sem revisão anterior;
- ConfigMap incompatível;
- cleanup apontando para namespace errado.

---

### 48. Criar relatório de conclusão

Arquivo:

```text
PROJECT_COMPLETION_REPORT.md
```

Estrutura:

```text
1.
objetivo.

2.
escopo.

3.
parte 1:
deployability interna.

4.
parte 2:
release candidate.

5.
parte 3:
promotion e deploy.

6.
gates.

7.
security.

8.
observability.

9.
rollback.

10.
evidence.

11.
limitações.

12.
próximos estudos.
```

Registre que o laboratório é local, sem cloud, tráfego, SLO ou credenciais corporativas. Ele comprova o processo, não uma produção real.

---

### 49. Executar o gate final do projeto

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\project\deploy-ready\verify-part-1-baseline.ps1

.\scripts\project\deploy-ready\verify-part-2-baseline.ps1

.\scripts\project\deploy-ready\validate-part-2-bundle.ps1

.\scripts\project\deploy-ready\export-approved-image.ps1

.\scripts\project\deploy-ready\start-local-registry.ps1

.\scripts\project\deploy-ready\promote-image-to-local-registry.ps1

.\scripts\project\deploy-ready\resolve-registry-digest.ps1

.\scripts\project\deploy-ready\validate-target-environment.ps1

.\scripts\project\deploy-ready\create-final-ephemeral-secret.ps1

.\scripts\project\deploy-ready\prepare-final-manifests.ps1

.\scripts\project\deploy-ready\deploy-approved-release.ps1

.\scripts\project\deploy-ready\wait-final-rollout.ps1

.\scripts\project\deploy-ready\run-final-smoke-test.ps1

.\scripts\project\deploy-ready\verify-release-consistency.ps1

.\scripts\project\deploy-ready\verify-final-observability.ps1

.\scripts\project\deploy-ready\simulate-release-regression.ps1

.\scripts\project\deploy-ready\rollback-final-release.ps1

.\scripts\project\deploy-ready\run-final-smoke-test.ps1

.\scripts\project\deploy-ready\collect-final-project-evidence.ps1

.\scripts\project\deploy-ready\verify-project-completion.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- partes 1, 2 e 3 aprovadas;
- promoção sem rebuild;
- digest resolvido;
- deploy saudável;
- smoke aprovado;
- release consistente;
- rollback aprovado;
- evidence completa;
- nenhuma cloud;
- nenhum Secret real;
- revisão técnica pronta.

---

## Entendendo o que foi feito

### O release candidate foi promovido sem reconstrução

O conteúdo aprovado permaneceu o mesmo.

### A tag deixou de comandar o deploy

O Deployment passou a usar referência por digest.

### O ambiente alvo ganhou gate

Contexto, registry, namespace, capacidade e Secret foram validados.

### O deploy ganhou rastreabilidade completa

Bundle, manifests, Pod e endpoint compartilharam release ID e commit.

### O runtime comprovou a imagem aprovada

O `imageID` dos Pods foi comparado ao digest esperado.

### O smoke test ganhou identidade

Além de saúde, ele confirmou qual release respondia.

### A observabilidade participou da decisão

Logs, events, rollout, HPA e PDB foram verificados.

### A regressão ganhou teste controlado

Uma readiness inválida comprovou detecção sem destruir dados.

### O rollback ganhou evidence

A revisão saudável foi restaurada e testada novamente.

### O projeto ganhou conclusão objetiva

As três partes passaram a formar um processo único de entrega.

---

## Erros comuns importantes

### Reconstruir antes do deploy

O artifact implantado deixa de ser o mesmo que passou pelos gates.

### Implantar por tag

A tag pode apontar para conteúdo diferente.

### Validar somente o manifest

É preciso validar o runtime e o imageID.

### Ignorar o release endpoint

A aplicação pode estar saudável, mas executar a versão errada.

### Criar Secret no bundle

O pacote de promoção não é cofre.

### Fazer rollback sem smoke test

O comando pode terminar e a aplicação continuar quebrada.

### Simular falha destrutiva

Use regressão controlada e reversível.

### Limpar o namespace errado

Contexto e nome exato precisam ser verificados.

### Marcar projeto como produção

O laboratório comprova processo, não readiness empresarial completa.

### Antecipar a revisão

A aula 549 irá revisar os conceitos de DevOps sistematicamente.

---

## Comandos úteis

### Validar bundle

```powershell
.\scripts\project\deploy-ready\validate-part-2-bundle.ps1
```

### Promover imagem

```powershell
.\scripts\project\deploy-ready\promote-image-to-local-registry.ps1
```

### Preparar manifests

```powershell
.\scripts\project\deploy-ready\prepare-final-manifests.ps1
```

### Executar deploy

```powershell
.\scripts\project\deploy-ready\deploy-approved-release.ps1
```

### Executar rollback

```powershell
.\scripts\project\deploy-ready\rollback-final-release.ps1
```

---

## Exercício guiado

### Parte 1 — Source verification

Valide o bundle aprovado.

### Parte 2 — Promotion

Exporte e promova a mesma imagem.

### Parte 3 — Immutable reference

Resolva o digest do registry.

### Parte 4 — Target environment

Valide cluster, namespace e registry.

### Parte 5 — Render

Gere manifests finais por digest.

### Parte 6 — Deploy

Aplique e acompanhe rollout.

### Parte 7 — Runtime verification

Valide health, release e imageID.

### Parte 8 — Observability

Revise logs, events, HPA e PDB.

### Parte 9 — Rollback

Simule regressão e restaure.

### Parte 10 — Completion

Colete evidence e encerre o projeto.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 547 foi preservada;
- ponte para a aula 549 está correta;
- parte 3 concluiu o projeto prático;
- promotion foi definida;
- immutable reference foi definida;
- target environment foi definido;
- deployment gate foi definido;
- release consistency foi definida;
- runtime verification foi definida;
- rollback verification foi definida;
- final evidence foi definida;
- ephemeral environment foi definido;
- build once, promote many foi definido;
- parte 1 foi validada;
- parte 2 foi validada;
- bundle foi verificado;
- contrato de promoção foi criado;
- contrato de origem foi criado;
- artifact checksum foi validado;
- imagem aprovada foi exportada;
- image archive recebeu checksum;
- rebuild count ficou zero;
- registry local foi criado;
- registry ficou restrito ao laboratório;
- mesma imagem foi carregada;
- tag local foi criada;
- push local foi executado;
- digest de registry foi resolvido;
- referência imutável foi criada;
- deploy por tag foi proibido;
- acesso do kind ao registry foi tratado;
- fallback local foi documentado;
- namespace `formacao-java-deploy-final` foi criado;
- namespace ficou isolado;
- release metadata final foi criada;
- release ID, commit e digest foram propagados;
- patch do Deployment foi criado;
- annotations de release foram criadas;
- NetworkPolicy final foi criada;
- Ingress local foi criado;
- Kustomization final foi criada;
- imagem foi configurada por digest;
- readiness do ambiente foi criada;
- contexto recebeu allowlist;
- cluster e registry foram validados;
- capacidade foi validada;
- ambiente anterior foi preservado;
- Secret efêmero foi criado;
- Secret real ficou fora do Git;
- manifests finais foram preparados;
- markers foram resolvidos;
- checksum do manifest foi criado;
- dry-run client-side foi executado;
- dry-run server-side foi documentado;
- scan de segurança foi executado;
- gate final foi criado;
- deploy foi autorizado somente após gates;
- release aprovada foi aplicada;
- rollout foi acompanhado;
- timeout foi definido;
- Pods Ready foram exigidos;
- imagem por digest foi exigida;
- annotations foram validadas;
- Pod imageID foi comparado ao digest;
- Service e EndpointSlices foram validados;
- nenhum Service público foi criado;
- smoke test final foi executado;
- health, liveness e readiness foram validados;
- endpoint funcional foi validado;
- correlation ID foi validado;
- release consistency foi validada;
- bundle, ConfigMap, annotation e endpoint foram comparados;
- observabilidade final foi validada;
- logs estruturados foram verificados;
- events foram revisados;
- HPA e PDB foram revisados;
- aprovação inicial foi registrada;
- contrato de rollback foi criado;
- regressão controlada foi simulada;
- readiness inválida foi detectada;
- dados não foram alterados;
- revisão saudável foi registrada;
- rollback foi executado;
- rollout pós-rollback foi aprovado;
- smoke pós-rollback foi aprovado;
- release consistency pós-rollback foi aprovada;
- limites do rollback foram documentados;
- release saudável ficou ativa ao final;
- workflow efêmero foi criado;
- workflow usa permissões mínimas;
- workflow não usa cloud;
- workflow não usa Secret corporativo;
- evidence final foi criada;
- evidence foi sanitizada;
- acceptance evidence final foi criada;
- checklist de conclusão foi criado;
- documentação final foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- relatório de conclusão foi criado;
- limitações do laboratório foram registradas;
- gate final do projeto foi executado;
- partes 1, 2 e 3 foram aprovadas;
- cloud resources ficou zero;
- real secrets ficou zero;
- projeto ficou pronto para revisão;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/release-promotion `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/deploy-ready/overlays/final-simple `
  scripts/project/deploy-ready `
  .github/workflows/orders-api-ephemeral-deploy.yml `
  docs/project/deploy-ready `
  docs/diario-de-bordo.md
```

Não adicione:

```text
target/promotion;

target/final-deploy;

final-project-evidence.json
quando contiver informação local não sanitizada.
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
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|kubeconfig|client-secret|X-Amz-Signature"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): concluir API pronta para deploy"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- Secret efetivo;
- senha;
- token;
- kubeconfig;
- image archive;
- registry data;
- logs completos;
- dados de usuário;
- account ID;
- credencial cloud;
- artifact temporário;
- material da revisão 549.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto prático de API pronta para deploy foi concluído.

As três partes formaram uma cadeia única:

```text
parte 1:
aplicação implantável.

parte 2:
release candidate verificável.

parte 3:
promoção,
deploy,
validação
e rollback.
```

Você comprovou que build e promoção são etapas diferentes; o mesmo artifact precisa atravessar os estágios; checksum, release ID, commit e digest garantem identidade; manifests finais precisam referenciar imagem imutável; contexto e ambiente precisam de gates; rollout não basta sem smoke test; o endpoint de release precisa confirmar a versão executada; Pod imageID precisa corresponder ao digest; observabilidade participa da decisão; regressão precisa ser detectável; rollback precisa ser testado; e evidence precisa comprovar todo o ciclo sem expor Secrets.

A próxima aula será:

```text
549 - M17.44 - Revisao DevOps parte 1
```

Nela, você irá revisar os fundamentos e as decisões técnicas do módulo, conectando CI/CD, containers, Kubernetes, cloud, segurança, custos, observabilidade, release strategies, deployability e operação.

Nenhum conteúdo da revisão DevOps foi antecipado além da ponte oficial para a próxima aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei o bundle da parte 2.
- [ ] Promovi a imagem sem rebuild.
- [ ] Resolvi o digest do registry.
- [ ] Renderizei manifests por digest.
- [ ] Executei deploy e smoke test.
- [ ] Validei release consistency.
- [ ] Simulei regressão e rollback.
- [ ] Coletei evidence final.

---

## Troubleshooting adicional

### O digest do registry não aparece

Faça pull da tag local ou consulte o registry; não substitua por tag na implantação.

### O kind não alcança o registry

Revise rede Docker, alias e configuração do cluster.

### O Pod mostra imageID diferente

Interrompa a aprovação; o conteúdo executado não é o aprovado.

### O release endpoint mostra commit diferente

Bundle, metadata ou imagem foram misturados.

### A NetworkPolicy bloqueia o startup

Libere apenas DNS e dependências explicitamente necessárias.

### O rollback não possui revisão anterior

Registre uma revisão saudável antes da simulação.

### O smoke pós-rollback falha

A recuperação não foi comprovada; revise configuração e recursos externos.

### O cleanup removeu o registry cedo

Colete evidence e finalize o exercício antes da remoção.

### O relatório chama o ambiente de produção

Corrija para laboratório local e documente as limitações.

### Uma revisão completa foi adicionada

Preserve a revisão estruturada para a aula 549.

---

## Perguntas de revisão

1. O que é promotion?
2. Por que não fazer rebuild?
3. O que é immutable reference?
4. Qual a diferença entre tag e digest?
5. O que é release consistency?
6. Para que serve target environment readiness?
7. Por que usar namespace isolado?
8. Por que o Secret não entra no bundle?
9. O que o Pod imageID comprova?
10. Por que consultar o release endpoint?
11. O que o smoke test valida?
12. Como a observabilidade participa da decisão?
13. Por que simular regressão?
14. O que comprova um rollback?
15. O que `rollout undo` não reverte?
16. O que entra na evidence final?
17. O que significa build once, promote many?
18. Quais limitações o laboratório possui?
19. Qual é o estado final do projeto?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Mover artifact aprovado.
2. Preservar o conteúdo validado.
3. Referência vinculada ao conteúdo.
4. Nome mutável e hash imutável.
5. Mesma identidade em todos os pontos.
6. Bloquear ambiente inadequado.
7. Isolamento e cleanup seguro.
8. Bundle não é cofre.
9. Imagem realmente executada.
10. Confirmar versão em runtime.
11. Saúde e função essencial.
12. Logs, events e métricas.
13. Provar detecção e runbook.
14. Saúde, smoke e consistência.
15. Dados e recursos externos.
16. Gates e resultados sanitizados.
17. Um build, várias promoções.
18. Sem cloud ou carga real.
19. Concluído e pronto para revisão.
20. Revisão DevOps parte 1.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 548 - M17.43 - Projeto API pronta para deploy parte 3

- Continuei após Projeto API pronta para deploy parte 2.
- Validei as partes 1 e 2.
- Criei o contrato de promoção.
- Verifiquei o release bundle e seus checksums.
- Exportei a imagem aprovada sem executar rebuild.
- Registrei rebuild count igual a zero.
- Iniciei um registry local e descartável.
- Promovi a mesma imagem para o registry local.
- Resolvi a referência imutável por digest.
- Criei contrato de referência imutável.
- Preparei acesso do cluster kind ao registry.
- Criei o namespace `formacao-java-deploy-final`.
- Criei release metadata com release ID, commit e digest.
- Criei overlay final com Kustomize.
- Fixei a imagem por repositório e digest.
- Validei contexto, cluster, capacidade e registry.
- Criei Secret efêmero e fictício fora do Git.
- Renderizei e escaneei os manifests finais.
- Executei dry-run e gate final.
- Implantei a release aprovada.
- Acompanhei rollout, Pods, Service e EndpointSlices.
- Comparei o Pod imageID com o digest aprovado.
- Executei smoke test final.
- Validei health, liveness, readiness e endpoint funcional.
- Validei correlation ID e release consistency.
- Revisei logs, events, HPA, PDB e NetworkPolicy.
- Simulei regressão com readiness inválida.
- Detectei a falha e executei rollback.
- Repeti smoke test e validação de consistência.
- Mantive a release saudável como estado final.
- Criei workflow de deploy efêmero sem cloud.
- Coletei evidence final sanitizada.
- Criei relatório e checklist de conclusão.
- Concluí as três partes do projeto.
- Não usei cloud pública, produção ou Secret real.
- Próxima aula: Revisão DevOps parte 1.
```

---

## Referência técnica curta

- Build Once, Promote Many.
- OCI Image Digests.
- Local Container Registry.
- Kubernetes Deployment Rollout.
- Kubernetes Rollback.
- Kubernetes EndpointSlices.
- Runtime Release Verification.
- Deployment Smoke Testing.
- Ephemeral Environments.
- Release Evidence and Traceability.

Regra final:

```text
a terceira parte do projeto precisa promover e implantar exatamente o release candidate aprovado: o bundle da parte 2 é verificado, a imagem é exportada e enviada a registry local sem novo build, o digest do registry é resolvido e se torna a referência imutável dos manifests; contexto, cluster, registry, namespace, capacidade e Secret efêmero passam por readiness antes do deploy, e o overlay final propaga release ID, commit e digest sem credenciais; rollout só é aprovado quando Pods estão Ready, Service possui endpoints, health, liveness, readiness e fluxo funcional passam, o endpoint interno confirma a release e o Pod imageID corresponde ao digest; logs, events, HPA, PDB e NetworkPolicy participam da decisão; uma regressão controlada precisa ser detectada e seguida de rollback, novo rollout, smoke e verificação de consistência; evidence final registra artifact, imagem, ambiente, gates, deploy e recuperação sem Secrets, cloud ou dados reais; com as três partes aprovadas, o projeto fica concluído e pronto para a aula 549 de revisão DevOps.
```
