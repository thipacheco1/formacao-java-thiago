# 547 - M17.42 - Projeto API pronta para deploy parte 2

## Apresentação da aula

Na aula 546, você iniciou o projeto prático da API pronta para deploy pela camada interna da aplicação.

A `orders-api` passou a possuir:

```text
configuração externa e tipada;

profiles de execução;

validação de startup;

build information;

release information;

health groups;

graceful shutdown;

logging estruturado;

correlation ID;

Problem Details;

testes operacionais;

evidence da parte 1.
```

A aplicação agora informa identidade, versão, ambiente, readiness, liveness, shutdown e correlation ID. Isso resolve a deployability interna.

Ainda falta transformar essa aplicação em um release candidate empacotado e verificável.

A pergunta central desta aula será:

```text
como transformar
código aprovado

em artifact,
imagem
e pacote de manifests

reprodutíveis,
rastreáveis
e protegidos por gates?
```

A resposta será construída em quatro camadas:

```text
artifact Java;

imagem de container;

manifests Kubernetes;

pipeline de release candidate.
```

Nesta segunda parte, você fechará o build, gerará JAR, imagem non-root, digest, SBOM, scan, manifests renderizados, workflow de release candidate, bundle e evidence.

A regra central será:

```text
release candidate
não é apenas uma tag;

é um conjunto
imutável e verificável

de artifact,
imagem,
metadata,
manifests
e resultados de gates.
```

Esta aula não fará promoção, deploy integrado, publicação obrigatória, criação de domínio, certificado, Secret real, rollout, rollback ou evidence final do projeto.

Esses pontos pertencem à continuação oficial:

```text
548 - M17.43 - Projeto API pronta para deploy parte 3
```

A aula termina com um release candidate localmente verificável e pronto para promoção.

---

## Onde estamos na formação

A sequência oficial é:

```text
545:
Deploy em ambiente simples.

546:
Projeto API pronta para deploy parte 1.

547:
Projeto API pronta para deploy parte 2.

548:
Projeto API pronta para deploy parte 3.

549:
Checkpoint DevOps Cloud.
```

A aula 546 respondeu:

```text
como preparar
a aplicação internamente

para configuração,
health,
logging
e operação?
```

A aula 547 responderá:

```text
como empacotar
essa aplicação

em um release candidate
imutável,
escaneável
e renderizável?
```

Nesta aula:

```text
build reproduzível:
sim.

JAR versionado:
sim.

Dockerfile final:
sim.

imagem non-root:
sim.

digest:
sim.

SBOM:
sim.

scan:
sim.

provenance:
contrato.

manifests finais:
sim.

Kustomize:
sim.

ConfigMap:
sim.

Secret reference:
sim.

Deployment:
sim.

Service:
sim.

Ingress:
sim.

PDB:
sim.

HPA:
sim.

NetworkPolicy:
sim.

workflow de release candidate:
sim.

push externo:
opcional e desabilitado.

deploy final:
não.

promoção:
não.
```

A regra operacional será:

```text
compilar;

testar;

empacotar;

inventariar;

escanear;

renderizar;

validar;

registrar;

não promover ainda.
```

---

## Objetivo prático

O projeto continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
container/release
├── Dockerfile
├── .dockerignore
├── container-security-contract.yaml
├── image-metadata-contract.yaml
└── container-test-matrix.yaml

k8s/deploy-ready
├── base
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   ├── pdb.yaml
│   ├── hpa.yaml
│   ├── networkpolicy.yaml
│   └── kustomization.yaml
├── overlays
│   └── simple
│       ├── namespace.yaml
│       ├── ingress.yaml
│       ├── release-metadata.yaml
│       ├── patch-deployment.yaml
│       └── kustomization.yaml
└── policies
    ├── manifest-security-policy.yaml
    ├── release-render-policy.yaml
    └── secret-reference-policy.yaml

release-candidate
├── release-candidate-contract.yaml
├── release-bundle-manifest.yaml
├── release-gate-policy.yaml
├── promotion-readiness.yaml
└── part-2-acceptance-evidence.yaml

scripts/project/deploy-ready
├── build-release-artifact.ps1
├── validate-release-artifact.ps1
├── build-release-image.ps1
├── test-release-image.ps1
├── generate-release-sbom.ps1
├── scan-release-image.ps1
├── capture-image-digest.ps1
├── render-release-manifests.ps1
├── validate-release-manifests.ps1
├── validate-release-security.ps1
├── package-release-bundle.ps1
├── verify-release-bundle.ps1
├── collect-part-2-evidence.ps1
└── verify-part-2-baseline.ps1

.github/workflows
└── orders-api-release-candidate.yml

docs/project/deploy-ready
├── RELEASE_ARTIFACT.md
├── RELEASE_CONTAINER.md
├── RELEASE_SBOM_AND_SCAN.md
├── RELEASE_MANIFESTS.md
├── RELEASE_CANDIDATE_PIPELINE.md
├── RELEASE_BUNDLE.md
├── PART_2_TEST_MATRIX.md
└── PART_2_TROUBLESHOOTING.md
```

Ao final, você terá JAR aprovado, imagem non-root identificável, digest, SBOM, scan, manifests renderizados, policies, bundle, workflow sem deploy e evidence da parte 2.

Você irá:

1. confirmar a parte 1;
2. fechar o build;
3. criar artifact versionado;
4. validar o JAR;
5. criar `.dockerignore`;
6. criar Dockerfile final;
7. definir usuário não root;
8. injetar metadata;
9. construir a imagem;
10. testar o startup;
11. testar health;
12. testar release endpoint;
13. testar shutdown;
14. capturar digest;
15. gerar SBOM;
16. executar scan;
17. criar manifests base;
18. criar overlay simple;
19. criar ServiceAccount;
20. criar ConfigMap;
21. referenciar Secret;
22. criar Deployment;
23. criar Service;
24. criar Ingress;
25. criar PDB;
26. criar HPA;
27. criar NetworkPolicy;
28. renderizar;
29. validar;
30. criar workflow;
31. criar bundle;
32. verificar bundle;
33. coletar evidence;
34. executar gate;
35. commitar;
36. preparar a parte 3.

---

## Conceito essencial

### Artifact

Arquivo produzido pelo build e usado como entrada para empacotamento.

---

### Release candidate

Versão candidata que passou pelos gates definidos, mas ainda não foi promovida.

---

### Image digest

Identificador criptográfico do conteúdo de uma imagem.

---

### SBOM

Inventário dos componentes presentes no software.

---

### Vulnerability scan

Análise de componentes em busca de vulnerabilidades conhecidas.

---

### Provenance

Informação sobre origem, processo e identidade do build.

---

### Release bundle

Pacote que reúne metadata, artifact, digest, SBOM, manifests e resultados de validação.

---

### Rendered manifest

Resultado final da composição de base, overlay, patches e imagens.

---

### Promotion

Movimento do mesmo artifact aprovado para outro estágio.

---

### Rebuild

Nova execução do build.

Promoção não deve reconstruir silenciosamente o artifact.

---

### Policy gate

Validação automática que bloqueia a release quando um requisito não é atendido.

---

## Mão na massa guiada

### 1. Confirmar a conclusão da parte 1

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\project\deploy-ready\verify-part-1-baseline.ps1
```

Confirme:

- build aprovado;
- profiles validados;
- release endpoint testado;
- health aprovado;
- logging aprovado;
- shutdown aprovado;
- Secret real igual a zero;
- imagem publicada igual a `false`;
- deploy final igual a `false`.

---

### 2. Definir identidade do release candidate

Use:

```text
application:
orders-api.

version:
versão Maven.

commit:
Git SHA abreviado.

release ID:
orders-api-<version>-<commit>.
```

Exemplo fictício:

```text
orders-api-1.0.0-a1b2c3d.
```

A mesma combinação acompanha JAR, labels, tag local, metadata, manifests, bundle e evidence.

---

### 3. Criar script de artifact

Arquivo:

```text
build-release-artifact.ps1
```

Fluxo:

```powershell
mvn `
  --batch-mode `
  clean `
  verify `
  package
```

Depois, o script:

- localiza exatamente um JAR executável;
- rejeita JAR de sources;
- rejeita JAR de tests;
- calcula SHA-256;
- registra tamanho;
- registra versão;
- registra commit;
- copia para diretório temporário da release.

Estrutura:

```text
target/release-candidate
├── orders-api.jar
├── artifact.sha256
└── artifact-metadata.json
```

---

### 4. Validar o artifact

Script:

```text
validate-release-artifact.ps1
```

O validator exige arquivo válido, SHA-256 correto, classe principal, configuração e metadata resolvidas, sem `.env`, private key ou credencial.

Inspecione:

```powershell
jar tf `
  target/release-candidate/orders-api.jar
```

---

### 5. Criar `.dockerignore`

Arquivo:

```text
container/release/.dockerignore
```

Conteúdo:

```text
.git
.github
.idea
.vscode
docs
scripts
k8s
cloud
target/*
!target/release-candidate/orders-api.jar
*.log
*.tmp
.env
.env.*
**/secret*.yaml
**/kubeconfig*
```

O contexto de build precisa conter somente o necessário.

---

### 6. Criar contrato de segurança do container

Arquivo:

```text
container-security-contract.yaml
```

Conteúdo:

```yaml
container:
  baseImage:
    pinned:
      required

  runtime:
    user:
      nonRoot:
        required

    shell:
      notRequiredByApplication

    privileged:
      forbidden

  artifact:
    copiedFromBuildOutput:
      required

  metadata:
    labels:
      required

  secrets:
    inImage:
      forbidden

  health:
    externallyValidated:
      required

  shutdown:
    graceful:
      required
```

---

### 7. Criar Dockerfile final

Arquivo:

```text
container/release/Dockerfile
```

Conteúdo:

```dockerfile
FROM eclipse-temurin:21-jre AS runtime

ARG APP_VERSION
ARG VCS_REF
ARG BUILD_TIME

LABEL org.opencontainers.image.title="orders-api" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.created="${BUILD_TIME}" \
      org.opencontainers.image.source="local-training-project"

RUN groupadd \
      --system \
      --gid 10001 \
      appgroup \
    && useradd \
      --system \
      --uid 10001 \
      --gid appgroup \
      --home-dir /app \
      --shell /usr/sbin/nologin \
      appuser

WORKDIR /app

COPY --chown=appuser:appgroup \
  target/release-candidate/orders-api.jar \
  /app/orders-api.jar

USER 10001:10001

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="\
-XX:MaxRAMPercentage=75.0 \
-XX:+ExitOnOutOfMemoryError \
-Dfile.encoding=UTF-8"

ENTRYPOINT ["java", "-jar", "/app/orders-api.jar"]
```

A imagem base deve ser revisada e fixada por digest. Não use `latest`.

---

### 8. Explicar o estágio runtime

A imagem final contém JRE, usuário, JAR, metadata e entrypoint. Maven, Git, source, testes, kubeconfig, cloud CLI, Secrets e scanners ficam fora. Menos componentes reduzem superfície, mas ainda exigem atualização, scan e controles de runtime.

---

### 9. Construir a imagem

Script:

```text
build-release-image.ps1
```

Comando conceitual:

```powershell
docker build `
  --file `
  container/release/Dockerfile `
  --build-arg `
  APP_VERSION=1.0.0 `
  --build-arg `
  VCS_REF=a1b2c3d `
  --build-arg `
  BUILD_TIME=2026-01-01T00:00:00Z `
  --tag `
  orders-api:rc-a1b2c3d `
  .
```

O script obtém valores do Git e do Maven.

---

### 10. Criar contrato de metadata da imagem

Arquivo:

```text
image-metadata-contract.yaml
```

Conteúdo:

```yaml
image:
  labels:
    required:
      - org.opencontainers.image.title
      - org.opencontainers.image.version
      - org.opencontainers.image.revision
      - org.opencontainers.image.created
      - org.opencontainers.image.source

  tag:
    mutableAlias:
      notUsedForPromotion

  digest:
    requiredForPromotion

  repository:
    decisionDeferredToPartThree
```

---

### 11. Inspecionar a imagem

Execute:

```powershell
docker image inspect `
  orders-api:rc-a1b2c3d
```

Valide:

- user `10001:10001`;
- labels;
- entrypoint;
- working directory;
- exposed port;
- nenhuma variável sensível;
- tamanho;
- layers esperadas.

Procure:

```powershell
docker history `
  --no-trunc `
  orders-api:rc-a1b2c3d
```

Nenhum Secret pode aparecer no histórico.

---

### 12. Testar execução non-root

Execute:

```powershell
docker run `
  --rm `
  --entrypoint `
  id `
  orders-api:rc-a1b2c3d
```

Resultado esperado:

```text
uid=10001
gid=10001
```

O processo não deve depender de root para criar arquivo obrigatório.

---

### 13. Testar a imagem

Script:

```text
test-release-image.ps1
```

O script inicia:

```powershell
docker run `
  --detach `
  --name `
  orders-api-rc-test `
  --publish `
  18081:8080 `
  --env `
  SPRING_PROFILES_ACTIVE=container `
  --env `
  APP_ENVIRONMENT=container-test `
  --env `
  APP_RELEASE_ID=orders-api-1.0.0-a1b2c3d `
  orders-api:rc-a1b2c3d
```

Depois valida:

- health;
- liveness;
- readiness;
- release endpoint;
- correlation ID;
- logs;
- process user;
- graceful stop.

Finalize:

```powershell
docker stop `
  --time `
  40 `
  orders-api-rc-test

docker rm `
  orders-api-rc-test
```

---

### 14. Capturar digest

Script:

```text
capture-image-digest.ps1
```

Para imagem local, registre o identificador de conteúdo disponível no engine.

Quando a imagem for publicada, a promoção utilizará o digest do registry.

Arquivo:

```text
target/release-candidate/image-digest.json
```

Conteúdo esperado:

```json
{
  "image": "orders-api",
  "tag": "rc-a1b2c3d",
  "localImageId": "sha256:example",
  "registryDigest": null,
  "promotionReady": false
}
```

A parte 3 poderá preencher o digest de registry sem reconstruir a imagem.

---

### 15. Gerar SBOM

Script:

```text
generate-release-sbom.ps1
```

A SBOM precisa registrar:

- application dependencies;
- runtime packages;
- versions;
- identifiers;
- licenses quando disponíveis;
- geração;
- artifact digest;
- image identity.

Formatos aceitos pelo contrato:

```text
CycloneDX JSON;

SPDX JSON.
```

Arquivo:

```text
target/release-candidate/orders-api-sbom.json
```

O script pode usar ferramenta já adotada no ambiente.

Quando ela não estiver disponível, o gate deve falhar claramente, não gerar uma SBOM vazia.

---

### 16. Executar scan

Script:

```text
scan-release-image.ps1
```

O scan avalia packages, dependências, severidade, correção disponível, contexto de exploração, exceções, expiração e owner.

A policy não usará somente contagem total.

Gate sugerido:

```text
critical:
bloqueia.

high com fix:
bloqueia.

high sem fix:
exige análise e exceção temporária.

medium:
entra no backlog.

unknown:
exige triagem.
```

---

### 17. Criar test matrix do container

Arquivo:

```text
container-test-matrix.yaml
```

Cenários:

- build concluído;
- artifact checksum válido;
- imagem construída;
- usuário non-root;
- labels presentes;
- nenhum Secret em layers;
- health aprovado;
- release endpoint aprovado;
- correlation ID aprovado;
- shutdown aprovado;
- SBOM gerada;
- scan aprovado;
- digest registrado;
- push externo não executado.

---

### 18. Criar ServiceAccount

Arquivo:

```text
k8s/deploy-ready/base/serviceaccount.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: orders-api
automountServiceAccountToken: false
```

A aplicação não precisa da API Kubernetes nesta etapa.

---

### 19. Criar ConfigMap base

Arquivo:

```text
base/configmap.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: orders-api-config
data:
  SPRING_PROFILES_ACTIVE: "kubernetes"
  SERVER_PORT: "8080"
  LOGGING_LEVEL_ROOT: "INFO"
  AWS_MESSAGING_ENABLED: "false"
  AWS_CACHE_ENABLED: "false"
  AWS_S3_ENABLED: "false"
```

`APP_ENVIRONMENT` e `APP_RELEASE_ID` serão definidos pelo overlay.

---

### 20. Definir referência de Secret

A base não cria senha real.

O Deployment referencia:

```text
orders-api-secret.
```

A policy exige Secret pré-existente, owner, origem segura, nenhum literal em Git e rotação documentada.

Arquivo:

```text
secret-reference-policy.yaml
```

---

### 21. Criar Deployment base

Arquivo:

```text
base/deployment.yaml
```

Conteúdo essencial:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
spec:
  replicas: 2

  revisionHistoryLimit: 5

  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1

  selector:
    matchLabels:
      app.kubernetes.io/name: orders-api

  template:
    metadata:
      labels:
        app.kubernetes.io/name: orders-api
    spec:
      serviceAccountName: orders-api
      automountServiceAccountToken: false
      terminationGracePeriodSeconds: 40

      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault

      containers:
        - name: orders-api
          image: orders-api:release-candidate
          imagePullPolicy: IfNotPresent

          ports:
            - name: http
              containerPort: 8080

          envFrom:
            - configMapRef:
                name: orders-api-config

            - secretRef:
                name: orders-api-secret

          startupProbe:
            httpGet:
              path: /actuator/health
              port: http
            periodSeconds: 5
            failureThreshold: 24

          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: http
            periodSeconds: 5
            timeoutSeconds: 2
            failureThreshold: 3

          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: http
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 3

          resources:
            requests:
              cpu: 250m
              memory: 256Mi
              ephemeral-storage: 128Mi

            limits:
              cpu: 750m
              memory: 512Mi
              ephemeral-storage: 512Mi

          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            readOnlyRootFilesystem: false
```

O valor `readOnlyRootFilesystem` permanece `false` até o teste confirmar compatibilidade.

A decisão precisa aparecer na evidence.

---

### 22. Criar Service base

Arquivo:

```text
base/service.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: orders-api
spec:
  type: ClusterIP

  selector:
    app.kubernetes.io/name: orders-api

  ports:
    - name: http
      port: 80
      targetPort: http
```

Nenhum `NodePort` ou `LoadBalancer` será criado.

---

### 23. Criar PodDisruptionBudget

Arquivo:

```text
base/pdb.yaml
```

Conteúdo:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: orders-api
spec:
  minAvailable: 1

  selector:
    matchLabels:
      app.kubernetes.io/name: orders-api
```

PDB reduz impacto de interrupções voluntárias, mas não corrige falhas da aplicação.

---

### 24. Criar HPA

Arquivo:

```text
base/hpa.yaml
```

Conteúdo:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: orders-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: orders-api

  minReplicas: 2
  maxReplicas: 6

  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300

  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

### 25. Criar NetworkPolicy

Arquivo:

```text
base/networkpolicy.yaml
```

Conteúdo conceitual:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: orders-api
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: orders-api

  policyTypes:
    - Ingress
    - Egress

  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx

      ports:
        - protocol: TCP
          port: 8080

  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system

      ports:
        - protocol: UDP
          port: 53

        - protocol: TCP
          port: 53
```

Dependências adicionais exigem regras explícitas; egress amplo permanece proibido.

---

### 26. Criar Kustomization base

Arquivo:

```text
base/kustomization.yaml
```

Conteúdo:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - serviceaccount.yaml
  - configmap.yaml
  - deployment.yaml
  - service.yaml
  - pdb.yaml
  - hpa.yaml
  - networkpolicy.yaml

commonLabels:
  app.kubernetes.io/part-of: orders-platform
  app.kubernetes.io/managed-by: kustomize
```

---

### 27. Criar overlay simple

Arquivo:

```text
overlays/simple/namespace.yaml
```

Conteúdo:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: formacao-java-deploy-ready
  labels:
    app.kubernetes.io/environment: simple
```

O overlay usa namespace dedicado.

---

### 28. Criar release metadata no overlay

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
  APP_ENVIRONMENT: "simple"
  APP_RELEASE_ID: "orders-api-1.0.0-a1b2c3d"
  APP_BUILD_COMMIT: "a1b2c3d"
```

O script de renderização substitui os valores pelo release candidate atual.

Nenhum dado sensível entra nesse ConfigMap.

---

### 29. Criar patch do Deployment

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
    spec:
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

O overlay também atualizará a imagem por Kustomize.

---

### 30. Criar Ingress do overlay

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
    - host: orders-deploy-ready.local
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

---

### 31. Criar Kustomization do overlay

Arquivo:

```text
overlays/simple/kustomization.yaml
```

Conteúdo:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: formacao-java-deploy-ready

resources:
  - namespace.yaml
  - ../../base
  - ingress.yaml
  - release-metadata.yaml

patches:
  - path: patch-deployment.yaml

images:
  - name: orders-api
    newName: orders-api
    newTag: rc-a1b2c3d

commonLabels:
  app.kubernetes.io/environment: simple
```

O script troca a tag pelo identificador atual.

A promoção por digest será concluída na parte 3.

---

### 32. Criar policy de segurança dos manifests

Arquivo:

```text
manifest-security-policy.yaml
```

Regras:

- namespace explícito;
- ServiceAccount dedicado;
- token automático desabilitado;
- non-root;
- privilege escalation false;
- capabilities removidas;
- seccomp;
- probes;
- requests e limits;
- Service interno;
- Ingress local;
- NetworkPolicy;
- PDB;
- HPA;
- Secret apenas por referência;
- sem hostPath;
- sem hostNetwork;
- sem privileged;
- sem `latest`.

---

### 33. Renderizar manifests

Script:

```text
render-release-manifests.ps1
```

Execute:

```powershell
kubectl kustomize `
  k8s/deploy-ready/overlays/simple
```

Saída:

```text
target/release-candidate/rendered-manifests.yaml
```

O render precisa conter namespace, release ID, image, ConfigMaps, Deployment, Service, PDB, HPA, NetworkPolicy e Ingress.

---

### 34. Validar manifests

Script:

```text
validate-release-manifests.ps1
```

Execute:

```powershell
kubectl apply `
  --dry-run=client `
  --filename `
  target/release-candidate/rendered-manifests.yaml
```

Quando houver cluster:

```powershell
kubectl apply `
  --dry-run=server `
  --filename `
  target/release-candidate/rendered-manifests.yaml
```

O script não aplica recursos.

---

### 35. Validar segurança

Script:

```text
validate-release-security.ps1
```

Ele verifica Secrets, manifests, Dockerfile, usuário, labels, digest, SBOM, findings e exceções.

Qualquer exceção precisa de owner, justificativa, compensating control e expiração.

---

### 36. Criar contrato do release candidate

Arquivo:

```text
release-candidate-contract.yaml
```

Conteúdo:

```yaml
releaseCandidate:
  identity:
    releaseId:
      required

    version:
      required

    commit:
      required

  artifact:
    jar:
      required

    sha256:
      required

  image:
    built:
      required

    nonRoot:
      required

    digest:
      required

    published:
      false

  supplyChain:
    sbom:
      required

    scan:
      required

    provenance:
      recorded

  manifests:
    rendered:
      required

    securityValidated:
      required

  deployment:
    executed:
      false
```

---

### 37. Criar workflow de release candidate

Arquivo:

```text
.github/workflows/orders-api-release-candidate.yml
```

Fluxo:

```yaml
name: Orders API Release Candidate

on:
  workflow_dispatch:
  pull_request:
    branches:
      - main

permissions:
  contents: read

jobs:
  release-candidate:
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

      - name: Verify
        run: mvn --batch-mode clean verify

      - name: Build artifact
        shell: pwsh
        run: ./scripts/project/deploy-ready/build-release-artifact.ps1

      - name: Validate artifact
        shell: pwsh
        run: ./scripts/project/deploy-ready/validate-release-artifact.ps1

      - name: Build image
        shell: pwsh
        run: ./scripts/project/deploy-ready/build-release-image.ps1

      - name: Test image
        shell: pwsh
        run: ./scripts/project/deploy-ready/test-release-image.ps1

      - name: Generate SBOM
        shell: pwsh
        run: ./scripts/project/deploy-ready/generate-release-sbom.ps1

      - name: Scan image
        shell: pwsh
        run: ./scripts/project/deploy-ready/scan-release-image.ps1

      - name: Render manifests
        shell: pwsh
        run: ./scripts/project/deploy-ready/render-release-manifests.ps1

      - name: Validate manifests
        shell: pwsh
        run: ./scripts/project/deploy-ready/validate-release-manifests.ps1

      - name: Package bundle
        shell: pwsh
        run: ./scripts/project/deploy-ready/package-release-bundle.ps1
```

Não inclua login, push ou deploy nesta aula.

---

### 38. Restringir permissões do workflow

A permissão padrão será:

```yaml
permissions:
  contents: read
```

O workflow não precisa:

- escrever packages;
- usar OIDC;
- alterar environments;
- criar release;
- comentar PR;
- fazer deploy.

Permissões adicionais serão analisadas na parte 3.

---

### 39. Criar gate policy

Arquivo:

```text
release-gate-policy.yaml
```

Conteúdo:

```yaml
gates:
  source:
    tests:
      required

  artifact:
    checksum:
      required

  image:
    nonRoot:
      required

    secretFree:
      required

    digest:
      required

  supplyChain:
    sbom:
      required

    vulnerabilityScan:
      required

  manifests:
    render:
      required

    schema:
      required

    security:
      required

  evidence:
    required

  external:
    push:
      forbiddenInPartTwo

    deployment:
      forbiddenInPartTwo
```

---

### 40. Criar bundle manifest

Arquivo:

```text
release-bundle-manifest.yaml
```

Conteúdo:

```yaml
bundle:
  requiredFiles:
    - artifact-metadata.json
    - artifact.sha256
    - image-digest.json
    - orders-api-sbom.json
    - vulnerability-scan-summary.json
    - rendered-manifests.yaml
    - release-gate-results.json
    - part-2-deployability-evidence.json

  forbiddenFiles:
    - .env
    - kubeconfig
    - secret.yaml
    - private-key
    - access-key
```

O JAR pode permanecer no artifact do pipeline sem ser versionado no Git.

---

### 41. Empacotar release bundle

Script:

```text
package-release-bundle.ps1
```

Saída:

```text
target/release-bundle
├── metadata
├── supply-chain
├── manifests
├── evidence
└── release-bundle.sha256
```

O script copia arquivos permitidos, calcula checksums, rejeita Secrets e arquivos inesperados e registra o release ID.

---

### 42. Verificar o bundle

Script:

```text
verify-release-bundle.ps1
```

Valide arquivos exigidos, checksums, release ID, commit, version, image identity, manifests, gates e deploy `false`.

---

### 43. Criar promotion readiness

Arquivo:

```text
promotion-readiness.yaml
```

Conteúdo:

```yaml
promotion:
  releaseCandidate:
    complete

  artifact:
    immutable

  image:
    localDigest:
      resolved

    registryDigest:
      pendingPartThree

  manifests:
    validated

  security:
    approved

  deployment:
    pendingPartThree

  rollback:
    pendingPartThree

  finalEvidence:
    pendingPartThree
```

---

### 44. Criar documentação

#### `RELEASE_ARTIFACT.md`

Explique JAR, checksum e metadata.

#### `RELEASE_CONTAINER.md`

Explique base, non-root, labels, JVM e startup.

#### `RELEASE_SBOM_AND_SCAN.md`

Explique inventário, scan, exceções e gates.

#### `RELEASE_MANIFESTS.md`

Explique base, overlay, image, Secret reference e policies.

#### `RELEASE_CANDIDATE_PIPELINE.md`

Explique workflow sem push ou deploy.

#### `RELEASE_BUNDLE.md`

Explique estrutura, checksums e promoção sem rebuild.

---

### 45. Criar test matrix da parte 2

Arquivo:

```text
PART_2_TEST_MATRIX.md
```

Cenários:

- parte 1 aprovada;
- JAR criado;
- checksum válido;
- metadata resolvida;
- Docker context mínimo;
- imagem construída;
- user non-root;
- labels OCI presentes;
- Secret ausente da layer;
- health aprovado no container;
- release endpoint aprovado;
- shutdown gracioso;
- digest capturado;
- SBOM gerada;
- scan aprovado;
- exceção expirada bloqueada;
- manifests renderizados;
- namespace definido;
- ServiceAccount dedicado;
- probes definidas;
- resources definidos;
- PDB criado;
- HPA criado;
- NetworkPolicy criada;
- Secret apenas referenciado;
- dry-run aprovado;
- workflow possui somente `contents: read`;
- workflow não faz push;
- workflow não faz deploy;
- bundle verificado;
- deploy final permanece pendente.

---

### 46. Criar troubleshooting

Arquivo:

```text
PART_2_TROUBLESHOOTING.md
```

Inclua:

- JAR não encontrado;
- múltiplos JARs;
- checksum divergente;
- build metadata ausente;
- base image indisponível;
- container executando como root;
- health timeout;
- release endpoint divergente;
- shutdown excedido;
- digest não resolvido;
- SBOM vazia;
- scanner indisponível;
- vulnerability bloqueadora;
- exceção expirada;
- Kustomize renderando imagem errada;
- namespace ausente;
- Secret literal;
- NetworkPolicy bloqueando DNS;
- HPA sem Metrics Server;
- PDB incompatível com réplicas;
- workflow com permissão excessiva;
- bundle inconsistente.

---

### 47. Coletar evidence da parte 2

Script:

```text
collect-part-2-evidence.ps1
```

Arquivo:

```text
part-2-deployability-evidence.json.
```

Campos permitidos:

- project;
- lesson;
- release ID;
- version;
- commit;
- artifact checksum status;
- image build status;
- non-root status;
- image labels status;
- local digest status;
- SBOM status;
- vulnerability gate status;
- manifest render status;
- manifest security status;
- workflow permission status;
- bundle status;
- image published false;
- deployment executed false;
- timestamp.

---

### 48. Criar acceptance evidence

Arquivo:

```text
part-2-acceptance-evidence.yaml
```

Conteúdo:

```yaml
partTwo:
  artifact:
    approved

  image:
    approved

  sbom:
    approved

  vulnerabilityGate:
    approved

  manifests:
    approved

  workflow:
    releaseCandidateOnly

  bundle:
    approved

  external:
    registryPush:
      false

    imagePublished:
      false

    deployment:
      false

  nextLesson:
    projectPartThree:
      ready
```

---

### 49. Executar o gate completo

Execute:

```powershell
mvn `
  --batch-mode `
  clean `
  verify

.\scripts\project\deploy-ready\verify-part-1-baseline.ps1

.\scripts\project\deploy-ready\build-release-artifact.ps1

.\scripts\project\deploy-ready\validate-release-artifact.ps1

.\scripts\project\deploy-ready\build-release-image.ps1

.\scripts\project\deploy-ready\test-release-image.ps1

.\scripts\project\deploy-ready\generate-release-sbom.ps1

.\scripts\project\deploy-ready\scan-release-image.ps1

.\scripts\project\deploy-ready\capture-image-digest.ps1

.\scripts\project\deploy-ready\render-release-manifests.ps1

.\scripts\project\deploy-ready\validate-release-manifests.ps1

.\scripts\project\deploy-ready\validate-release-security.ps1

.\scripts\project\deploy-ready\package-release-bundle.ps1

.\scripts\project\deploy-ready\verify-release-bundle.ps1

.\scripts\project\deploy-ready\collect-part-2-evidence.ps1

.\scripts\project\deploy-ready\verify-part-2-baseline.ps1
```

Finalize:

```powershell
git diff --check

git status
```

Confirme:

- artifact aprovado;
- imagem aprovada;
- usuário non-root;
- health aprovado;
- digest registrado;
- SBOM gerada;
- scan aprovado;
- manifests aprovados;
- workflow mínimo;
- bundle íntegro;
- nenhum push;
- nenhum deploy;
- parte 3 pronta.

---

## Entendendo o que foi feito

### O código virou artifact verificável

O JAR recebeu checksum e metadata.

### O artifact virou imagem controlada

A imagem possui usuário, labels, entrypoint e runtime mínimos.

### A imagem ganhou identidade por conteúdo

Tag deixou de ser a única referência.

### A supply chain ganhou inventário

SBOM e scan passaram a integrar o release candidate.

### Os manifests ganharam composição

Base e overlay evitaram duplicação.

### O workload ganhou controles de runtime

ServiceAccount, seccomp, probes, resources, PDB, HPA e NetworkPolicy passaram a fazer parte do pacote.

### O workflow ganhou limite de responsabilidade

Ele valida e empacota, mas não promove nem faz deploy.

### O bundle ganhou consistência

Artifact, imagem, manifests e evidence passaram a compartilhar release ID, version e commit.

### A parte 3 ganhou entrada confiável

A próxima aula poderá promover o mesmo release candidate sem rebuild.

---

## Erros comuns importantes

### Reconstruir na promoção

O artifact promovido pode ser diferente do aprovado.

### Usar somente tag

Tags podem ser alteradas.

### Gerar SBOM vazia

O arquivo existe, mas não oferece inventário.

### Ignorar findings sem exceção

O risco fica invisível.

### Colocar scanner dentro da imagem

Ferramentas de build não pertencem ao runtime.

### Versionar Secret no overlay

Referencie Secret criado por processo seguro.

### Liberar egress amplo

NetworkPolicy perde o objetivo.

### Dar permissão de packages e deploy ao workflow

A parte 2 não precisa dessas ações.

### Considerar dry-run como deploy aprovado

O comportamento real será validado na parte 3.

### Antecipar a promoção

A aula 548 possui esse objetivo.

---

## Comandos úteis

### Construir o artifact

```powershell
.\scripts\project\deploy-ready\build-release-artifact.ps1
```

### Construir a imagem

```powershell
.\scripts\project\deploy-ready\build-release-image.ps1
```

### Testar a imagem

```powershell
.\scripts\project\deploy-ready\test-release-image.ps1
```

### Renderizar manifests

```powershell
.\scripts\project\deploy-ready\render-release-manifests.ps1
```

### Verificar o bundle

```powershell
.\scripts\project\deploy-ready\verify-release-bundle.ps1
```

---

## Exercício guiado

### Parte 1 — Artifact

Gere JAR, checksum e metadata.

### Parte 2 — Image

Construa runtime non-root.

### Parte 3 — Runtime test

Valide health, release e shutdown.

### Parte 4 — Supply chain

Gere SBOM, scan e digest.

### Parte 5 — Base manifests

Crie recursos comuns.

### Parte 6 — Overlay

Defina ambiente simple.

### Parte 7 — Security

Valide ServiceAccount, policies e Secret reference.

### Parte 8 — Workflow

Crie pipeline de release candidate sem deploy.

### Parte 9 — Bundle

Empacote os resultados aprovados.

### Parte 10 — Evidence

Comprove readiness para a parte 3.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 546 foi preservada;
- ponte para a aula 548 está correta;
- parte 2 respeitou o escopo oficial;
- artifact foi definido;
- release candidate foi definido;
- image digest foi definido;
- SBOM foi definida;
- vulnerability scan foi definido;
- provenance foi definida;
- release bundle foi definido;
- promotion e rebuild foram diferenciados;
- policy gate foi definido;
- conclusão da parte 1 foi validada;
- release ID foi definido;
- version e commit foram propagados;
- script de artifact foi criado;
- JAR executável foi identificado;
- checksum SHA-256 foi criado;
- artifact metadata foi criada;
- JAR foi inspecionado;
- arquivos sensíveis foram bloqueados;
- `.dockerignore` foi criado;
- contexto de build foi reduzido;
- contrato de segurança do container foi criado;
- Dockerfile final foi criado;
- Java 21 runtime foi usado;
- usuário `10001` foi criado;
- container executa non-root;
- labels OCI foram definidas;
- `latest` foi proibida;
- Secret em image foi proibido;
- imagem foi construída;
- metadata da imagem foi criada;
- image history foi inspecionado;
- health foi testado no container;
- release endpoint foi testado;
- graceful shutdown foi testado;
- digest local foi capturado;
- registry digest ficou pendente para a parte 3;
- SBOM foi gerada;
- formato CycloneDX ou SPDX foi exigido;
- SBOM vazia foi bloqueada;
- scan foi executado;
- findings críticos foram bloqueados;
- exceções exigem owner e expiração;
- test matrix do container foi criada;
- ServiceAccount dedicado foi criado;
- automount de token foi desabilitado;
- ConfigMap base foi criada;
- Secret foi somente referenciado;
- Deployment base foi criado;
- duas réplicas foram definidas;
- RollingUpdate foi configurado;
- graceful shutdown recebeu 40 segundos;
- seccomp foi configurado;
- probes foram configuradas;
- requests e limits foram configurados;
- security context foi configurado;
- Service ClusterIP foi criado;
- PDB foi criado;
- HPA foi criado;
- NetworkPolicy foi criada;
- DNS e ingress foram tratados;
- Kustomization base foi criada;
- overlay simple foi criado;
- namespace dedicado foi criado;
- release metadata foi criada;
- patch do Deployment foi criado;
- Ingress local foi criado;
- Kustomization do overlay foi criada;
- policy de segurança dos manifests foi criada;
- manifests foram renderizados;
- output renderizado foi salvo;
- dry-run client-side foi executado;
- dry-run server-side foi documentado;
- security validation foi executada;
- contrato de release candidate foi criado;
- workflow de release candidate foi criado;
- workflow executa build, test, image, SBOM, scan e render;
- workflow usa `contents: read`;
- workflow não faz login em registry;
- workflow não faz push;
- workflow não faz deploy;
- gate policy foi criada;
- bundle manifest foi criado;
- bundle foi empacotado;
- bundle foi verificado;
- release ID é consistente;
- version é consistente;
- commit é consistente;
- promotion readiness foi criada;
- documentação foi criada;
- test matrix da parte 2 foi criada;
- troubleshooting foi criado;
- evidence foi sanitizada;
- image published ficou false;
- deployment executed ficou false;
- acceptance evidence foi criada;
- gate completo foi executado;
- nenhuma conta cloud foi usada;
- nenhum Secret real foi usado;
- nenhuma promoção foi executada;
- deploy final não foi antecipado;
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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/container/release `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/k8s/deploy-ready `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/release-candidate `
  scripts/project/deploy-ready `
  .github/workflows/orders-api-release-candidate.yml `
  docs/project/deploy-ready `
  docs/diario-de-bordo.md
```

Não adicione:

```text
target/release-candidate;

target/release-bundle.
```

Esses diretórios são artifacts de build.

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
      "password: [^$]|token: [^$]|AKIA|ASIA|BEGIN PRIVATE KEY|kubeconfig|X-Amz-Signature"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): preparar API para deploy parte 2"
```

Valide:

```powershell
git log -1 --oneline

git status --short
```

Não inclua:

- JAR;
- image archive;
- Secret;
- `.env`;
- token;
- kubeconfig;
- vulnerability report com dado sensível;
- registry credential;
- workflow de deploy;
- arquivos finais da aula 548.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto deixou de ser apenas uma aplicação internamente preparada e passou a possuir um release candidate verificável.

O projeto agora contém:

```text
artifact;

checksum;

metadata;

Dockerfile;

imagem non-root;

digest;

SBOM;

scan;

manifests;

policies;

workflow;

bundle;

evidence.
```

Você comprovou que artifact e release precisam de identidade única; promoção não deve reconstruir a aplicação; tags não substituem digest; Dockerfile precisa produzir runtime mínimo e non-root; SBOM precisa representar componentes reais; findings exigem decisão; manifests precisam ser renderizados e escaneados; Secret deve ser somente referenciado; ServiceAccount, probes, resources, PDB, HPA e NetworkPolicy fazem parte da deployability; workflow de release candidate deve possuir permissões mínimas; e o bundle precisa manter consistência entre version, commit, image e manifests.

A próxima aula será:

```text
548 - M17.43 - Projeto API pronta para deploy parte 3
```

Nela, você irá concluir o projeto com promoção do release candidate, referência imutável de imagem, preparação do ambiente, execução do deploy, validações operacionais, smoke test, observabilidade, rollback, cleanup, evidence final e decisão de encerramento.

Nenhum push, promoção, deploy integrado, rollout final, rollback final ou evidence conclusiva do projeto foi executado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Validei a parte 1.
- [ ] Gerei artifact e checksum.
- [ ] Construí imagem non-root.
- [ ] Testei health e shutdown.
- [ ] Capturei digest e gerei SBOM.
- [ ] Validei o scan.
- [ ] Renderizei e validei manifests.
- [ ] Empacotei o release bundle.

---

## Troubleshooting adicional

### O JAR não contém metadata

Revise resources filtering, plugin de Git ou entrada do pipeline.

### A imagem executa como root

Revise `USER`, ownership do JAR e imagem base.

### O container não inicia

Revise profile, release ID, porta e build information.

### A SBOM não contém dependências Java

Revise a ferramenta e a origem usada na geração.

### O scan bloqueia vulnerabilidade sem fix

Crie análise de risco e exceção temporária, não ignore o finding.

### A NetworkPolicy bloqueia o health

Confirme origem do Ingress e DNS; não abra todo o egress.

### O overlay usa tag antiga

Atualize a imagem durante a renderização e valide o release ID.

### O workflow tenta publicar package

Remova permissões e ações de push da parte 2.

### O bundle possui commits diferentes

Interrompa; artifacts não pertencem ao mesmo release candidate.

### Um deploy foi executado

Registre, reverta quando necessário e preserve a promoção para a aula 548.

---

## Perguntas de revisão

1. O que é release candidate?
2. Qual a diferença entre artifact e image?
3. Para que serve checksum?
4. Por que usar usuário non-root?
5. Para que servem labels OCI?
6. Qual a diferença entre tag e digest?
7. O que é SBOM?
8. O que é provenance?
9. Como tratar findings?
10. O que é release bundle?
11. Por que separar base e overlay?
12. Para que serve ServiceAccount dedicado?
13. Para que serve PDB?
14. Como HPA depende de requests?
15. Para que serve NetworkPolicy?
16. Por que o workflow usa permissões mínimas?
17. Por que não fazer rebuild na promoção?
18. O que pertence à parte 3?
19. O que não foi executado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Versão candidata aprovada.
2. JAR e runtime empacotado.
3. Validar integridade.
4. Reduzir privilégio.
5. Identificar artifact.
6. Nome mutável e conteúdo.
7. Inventário de componentes.
8. Origem e processo do build.
9. Gate, correção ou exceção.
10. Pacote consistente da release.
11. Reuso e diferença de ambiente.
12. Identidade do workload.
13. Proteger interrupções voluntárias.
14. Utilização usa requests.
15. Controlar tráfego de Pods.
16. Reduzir blast radius.
17. Preservar o artifact aprovado.
18. Promoção, deploy e rollback.
19. Push e deploy final.
20. Projeto API pronta para deploy parte 3.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 547 - M17.42 - Projeto API pronta para deploy parte 2

- Continuei após Projeto API pronta para deploy parte 1.
- Validei a baseline de deployability da aplicação.
- Defini release candidate com version, commit e release ID.
- Gerei JAR executável, checksum e metadata.
- Criei `.dockerignore` para reduzir o contexto.
- Criei Dockerfile final com Java 21.
- Configurei usuário non-root.
- Adicionei labels OCI.
- Proibi latest e Secrets na imagem.
- Construí e inspecionei a imagem.
- Testei health, release endpoint, correlation ID e shutdown.
- Capturei a identidade local da imagem.
- Gerei SBOM em formato estruturado.
- Executei vulnerability scan.
- Modelei gates e exceções temporárias.
- Criei ServiceAccount dedicado.
- Criei ConfigMap base e referência de Secret.
- Criei Deployment com probes, resources e hardening.
- Criei Service, PDB, HPA e NetworkPolicy.
- Criei base e overlay com Kustomize.
- Renderizei e validei os manifests.
- Criei policy de segurança dos manifests.
- Criei workflow de release candidate com permissão mínima.
- Mantive push e deploy desabilitados.
- Criei release bundle com checksums.
- Verifiquei consistência de release ID, version e commit.
- Coletei evidence sanitizada da parte 2.
- Não publiquei imagem e não executei deploy integrado.
- Próxima aula: Projeto API pronta para deploy parte 3.
```

---

## Referência técnica curta

- OCI Image Specification.
- Container Image Digests.
- Software Bill of Materials.
- Supply Chain Provenance.
- Dockerfile Security.
- Kubernetes Kustomize.
- Kubernetes PodDisruptionBudget.
- Kubernetes HorizontalPodAutoscaler.
- Kubernetes NetworkPolicy.
- CI Release Candidate Pipelines.

Regra final:

```text
a segunda parte do projeto de API pronta para deploy precisa transformar a aplicação aprovada em release candidate imutável e verificável: o build produz JAR, checksum e metadata ligados à mesma version, commit e release ID; o Dockerfile empacota Java 21 em runtime mínimo, usa usuário non-root, labels OCI, nenhum Secret e imagem identificável por conteúdo; testes validam health, release endpoint, correlation ID e graceful shutdown, enquanto SBOM, vulnerability scan, digest e provenance compõem a supply chain; manifests Kubernetes são organizados em base e overlay, usam ServiceAccount dedicado, ConfigMap não sensível, Secret por referência, Deployment com probes, resources, seccomp e capabilities reduzidas, além de Service, PDB, HPA e NetworkPolicy; o workflow possui apenas permissão de leitura e executa build, testes, image, SBOM, scan, render e bundle, sem login, push ou deploy; checksums e evidence comprovam consistência do bundle, deixando para a aula 548 a promoção do mesmo release candidate, o deploy integrado, o smoke test, a observabilidade, o rollback e a conclusão final.
```
